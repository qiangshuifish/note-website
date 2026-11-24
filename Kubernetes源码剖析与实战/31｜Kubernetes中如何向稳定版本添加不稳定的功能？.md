# 31 | Kubernetes中如何向稳定版本添加不稳定的功能？

你好，我是孔令飞。

在实际企业开发中，我们经常需要往一个稳定的 API 版本中添加一个可能不稳定的功能。本节课，我们就来看下 Kubernetes 中是如何向稳定版本添加不稳定功能的。

将功能添加到已经稳定的对象时，新字段和新行为需要满足稳定级别的要求。如果无法满足这些要求，则新字段不能添加到对象中。例如，考虑以下对象：

```
// API v6.
type Frobber struct {
   // height ...
   Height *int32 `json:"height"`
   // param ...
   Param string `json:"param"`
}
开发人员正在考虑添加一个新的 Width 参数，如下所示：
// API v6.
type Frobber struct {
   // height ...
   Height *int32 `json:"height"`
   // param ...
   Param string `json:"param"`
   // width ...
   Width *int32 `json:"width,omitempty"`
}
```

然而，新功能还不够稳定，不能在稳定版本（v6）中使用。这可能的原因包括：

```
最终表示尚未确定（例如，应该称为 Width 还是 Breadth）。
实现对于一般使用还不够稳定（例如，Area() 函数有时会溢出)。
```

在确保稳定性之前，开发人员不能随意添加新字段。然而，有时稳定性只有在某些用户尝试新功能后才能得到验证，而这些用户可能只能或愿意使用 Kubernetes 的已发布版本。在这种情况下，开发人员可以选择采取一些策略，这些策略需要分阶段实施，覆盖多个版本。

所采用的机制将根据是添加新字段还是允许现有字段接受新值而有所不同。

## 在现有 API 版本中添加新字段

以前，注释被用于标记实验性 alpha 功能，但由于以下原因，现已不再推荐这种做法：

- 注释可能会使集群暴露于针对早期 API 服务器的潜在“定时炸弹”数据（参见：https://issue.k8s.io/30819）。

- 它们无法迁移到同一 API 版本中的主字段，导致在多个位置中表示单个值时出现兼容性问题（更多信息请参阅向后兼容性的注意事项）。

推荐的做法是向现有对象添加 alpha 字段，并确保默认情况下禁用该功能。

首先在 API 服务器中引入 feature gate，以管理新字段及其相关功能的启用状态。在staging/src/k8s.io/apiserver/pkg/features/kube_features.go 中：

```javascript
// owner: @you
// alpha: v1.11
//
// Add multiple dimensions to frobbers.
Frobber2D utilfeature.Feature = "Frobber2D"
var defaultKubernetesFeatureGates = map[utilfeature.Feature]utilfeature.FeatureSp
   ...
   Frobber2D: {Default: false, PreRelease: utilfeature.Alpha},
}
```

然后将字段添加到 API 类型。我们先要确保字段是 optional：

```
添加 omitempty 结构体标签。
添加 // +optional 注释标签。
```

- 确保当字段为空时，该字段在 API 响应中完全不存在（可选字段应该是指针）。

在字段描述中包含有关 alpha 级别的详细信息：

```
// API v6.
type Frobber struct {
   // height ...
   Height int32  `json:"height"`
   // param ...
   Param  string `json:"param"`
   // width indicates how wide the object is.
   // This field is alpha-level and is only honored by servers that enable the F
   // +optional
   Width  *int32 `json:"width,omitempty"`
}
```

在将对象持久化到存储之前，对于创建请求，应清除已禁用的 alpha 字段；对于更新请求，如果现有对象中缺少该字段的值，也应将其清除。这种做法可以防止在功能禁用时仍使用新功能，同时确保现有数据得以保留。这一点至关重要，因为在未来的版本中默认启用该功能，并

```
允许数据无条件持久化时，n-1 版本的 API 服务器（该功能仍然默认禁用）在更新时不会丢
失任何数据。推荐在 REST 存储策略的 PrepareForCreate 和 PrepareForUpdate 方法
```

中实现这一逻辑：

```go
func (frobberStrategy) PrepareForCreate(ctx genericapirequest.Context, obj runtim
   frobber := obj.(*api.Frobber)
   if !utilfeature.DefaultFeatureGate.Enabled(features.Frobber2D) {
       frobber.Width = nil
   }
}
func (frobberStrategy) PrepareForUpdate(ctx genericapirequest.Context, obj, old r
   newFrobber := obj.(*api.Frobber)
   oldFrobber := old.(*api.Frobber)
   if !utilfeature.DefaultFeatureGate.Enabled(features.Frobber2D) && oldFrobber.
       newFrobber.Width = nil
   }
}
```

为了确保你的 API 测试具备前瞻性，在测试 feature gate 的启用和禁用时，请务必明确将feature gate 设置为所需的状态。切勿假设 feature gate 的状态为开启或关闭。随着功能从alpha 阶段进入 beta，并最终达到稳定状态，整个代码库中可能会存在默认启用或禁用该功能的情况。以下示例将提供更多细节：

```go
func TestAPI(t *testing.T){
   testCases:= []struct{
       // ... test definition ...
   }{
       {
           // .. test case ..
       },
       {
           // ... test case ..
       },
   }
   for _, testCase := range testCases{
       t.Run("..name...", func(t *testing.T){
           // run with gate on
           defer featuregatetesting.SetFeatureGateDuringTest(t, utilfeature.Defa
           // ... test logic ...
       })
       t.Run("..name...", func(t *testing.T){
           // run with gate off, *do not assume it is off by default*
           defer featuregatetesting.SetFeatureGateDuringTest(t, utilfeature.Defa
           // ... test gate-off testing logic logic ...
       })
   }
```

在验证逻辑中，如果存在字段，请验证该字段：

```go
func ValidateFrobber(f *api.Frobber, fldPath *field.Path) field.ErrorList {
   ...
   if f.Width != nil {
       ... validation of width field ...
   }
   ...
}
```

在未来的 Kubernetes 版本中：

- 如果该功能晋升到 beta 或稳定状态，feature gate 可以被移除或默认启用。

- 如果需要以不兼容的方式更改 alpha 字段的模式，则必须使用新的字段名称。

- 如果该功能被弃用或字段名称发生更改，应从 Go 结构中移除该字段，并使用墓碑注释确保该字段名称及其 protobuf 标记不被重用。

```
// API v6.
type Frobber struct {
   // height ...
   Height int32  `json:"height" protobuf:"varint,1,opt,name=height"`
   // param ...
   Param  string `json:"param" protobuf:"bytes,2,opt,name=param"`
   // +k8s:deprecated=width,protobuf=3
}
```

## 现有字段中的新枚举值

```
开发人员正在考虑向以下现有枚举字段添加一个新的允许的枚举值 OnlyOnTuesday：
type Frobber struct {
   // restartPolicy may be set to "Always" or "Never".
   // Additional policies may be defined in the future.
   // Clients should expect to handle additional values,
   // and treat unrecognized values in this field as "Never".
   RestartPolicy string `json:"policy"
}
```

预期的 API 客户端旧版本必须能够安全地处理新值：

- 如果枚举字段影响单个组件的行为，确保该组件的所有版本能够正确处理含有新值的 API对象，或在安全情况下失败。例如，kubelet 处理的 Pod 枚举字段中的新允许值必须能够被第一个允许新值的 API 服务器发布的两个先前版本的 kubelet 安全处理。

- 如果 API 由外部客户端实现（如 Ingress 或 NetworkPolicy），则枚举字段应明确指示未来可能允许的额外值，并定义客户端如何处理未知值。如果在包含枚举字段的首次发布中未进行此定义将无法添加，可能会破坏现有客户端的新值。

当确保 API 客户端能够安全地处理新枚举值后，接下来的要求是以不会中断先前 API 服务器对该对象验证的方式开始允许这些新值。此过程至少需要两个版本才能安全完成：

- 版本 1：

- 仅在更新已包含新枚举值的现有对象时允许新的枚举值。

- 在其他情况下禁止新值（即在创建和更新尚未包含新枚举值的对象时）。

- 验证现有客户端是否按照预期处理新值，遵循新值规范，或在必要时使用以前定义的“未知值”行为（这取决于是否启用了相关 feature gate ）。

- 版本 2：在创建和更新操作中允许使用新的枚举值。

这确保了在版本不一致的情况下（如滚动升级期间），集群能够处理多个服务器，而不会因阻止保留以前版本的 API 服务器所阻塞的数据而导致问题。

通常，feature gate 用于执行此流程，从 alpha 开始，在版本 1 中默认禁用，并逐步升级至beta，在版本 2 中默认启用。

首先，向 API 服务器添加 feature gate ，以控制新枚举值（及其相关功能）的启用，在staging/src/k8s.io/apiserver/pkg/features/kube_features.go 中：

```javascript
// owner: @you
// alpha: v1.11
//
// Allow OnTuesday restart policy in frobbers.
FrobberRestartPolicyOnTuesday utilfeature.Feature = "FrobberRestartPolicyOnTuesda
var defaultKubernetesFeatureGates = map[utilfeature.Feature]utilfeature.FeatureSp
   ...
   FrobberRestartPolicyOnTuesday: {Default: false, PreRelease: utilfeature.Alpha
}
```

然后更新有关 API 类型的文档，在字段描述中包含有关 Alpha 级别的详细信息：

```
type Frobber struct {
   // restartPolicy may be set to "Always" or "Never" (or "OnTuesday" if the alp
   // Additional policies may be defined in the future.
   // Unrecognized policies should be treated as "Never".
   RestartPolicy string `json:"policy"
}
```

需要确保现有数据得到保留，以便在将来的版本中默认启用该功能时（即在版本 n 中允许数据无条件持久化在字段中），n-1 版本的 API 服务器能够验证对象并判断是否应允许新的枚举值。这一做法可以防止在功能禁用时意外使用新值，同时确保现有数据不会丢失，避免在默认仍禁用该功能的情况下，API 服务器在验证时出现阻塞。建议在 REST 存储策略的

```go
Validate 和 ValidateUpdate 方法中实施此逻辑。
func (frobberStrategy) Validate(ctx genericapirequest.Context, obj runtime.Object
   frobber := obj.(*api.Frobber)
   return validation.ValidateFrobber(frobber, validationOptionsForFrobber(frobbe
}
func (frobberStrategy) ValidateUpdate(ctx genericapirequest.Context, obj, old run
   newFrobber := obj.(*api.Frobber)
   oldFrobber := old.(*api.Frobber)
   return validation.ValidateFrobberUpdate(newFrobber, oldFrobber, validationOpt
}
func validationOptionsForFrobber(newFrobber, oldFrobber *api.Frobber) validation.
   opts := validation.FrobberValidationOptions{
       // allow if the feature is enabled
       AllowRestartPolicyOnTuesday: utilfeature.DefaultFeatureGate.Enabled(featu
   }
   if oldFrobber == nil {
       // if there's no old object, use the options based solely on feature enab
       return opts
   }
   if oldFrobber.RestartPolicy == api.RestartPolicyOnTuesday {
       // if the old object already used the enum value, continue to allow it in
       opts.AllowRestartPolicyOnTuesday = true
   }
   return opts
}
```

在验证逻辑中，根据传入的选项验证枚举值：

```go
func ValidateFrobber(f *api.Frobber, opts FrobberValidationOptions) field.ErrorLi
   ...
   validRestartPolicies := sets.NewString(RestartPolicyAlways, RestartPolicyNeve
   if opts.AllowRestartPolicyOnTuesday {
       validRestartPolicies.Insert(RestartPolicyOnTuesday)
   }
   if f.RestartPolicy == RestartPolicyOnTuesday && !opts.AllowRestartPolicyOnTue
       allErrs = append(allErrs, field.Invalid(field.NewPath("restartPolicy"), f
   } else if !validRestartPolicies.Has(f.RestartPolicy) {
       allErrs = append(allErrs, field.NotSupported(field.NewPath("restartPolicy
   }
   ...
}
```

在至少一个版本发布后，该功能可以升级为 beta 或 GA，并默认启用。在staging/src/k8s.io/apiserver/pkg/features/kube_features.go 中：

```javascript
// owner: @you
// alpha: v1.11
// beta: v1.12
//
// Allow OnTuesday restart policy in frobbers.
FrobberRestartPolicyOnTuesday utilfeature.Feature = "FrobberRestartPolicyOnTuesda
var defaultKubernetesFeatureGates = map[utilfeature.Feature]utilfeature.FeatureSp
   ...
   FrobberRestartPolicyOnTuesday: {Default: true, PreRelease: utilfeature.Beta},
}
```

## 创建新的 Alpha API 版本

另一种选择是引入带有新 alpha 或 beta 版本的类型指示符，如下所示：

```
// API v7alpha1
type Frobber struct {
   // height ...
   Height *int32 `json:"height"`
   // param ...
   Param  string `json:"param"`
   // width ...
   Width  *int32 `json:"width,omitempty"`
}
```

后者要求与 Frobber 在新版本 v7alpha1 中处于同一 API 组的所有对象进行复制。这也要求用户使用新的客户端版本，因此这不是首选选项。另外一个相关的问题是集群管理器如何回滚到新版本，同时保留用户已在使用的新功能（详细信息，请参考kubernetes/kubernetes#4855）。

## Kubernetes 版本级别介绍

Kubernetes 中的所有 API 版本都分属于 4 大类版本类别，不同的版本类别对 API 版本兼容性要求是不一样的。这 4 大类别是：

- Development 级别

- Alpha 级别

- Beta 级别

- Stable 级别

上述这些版本级别既是版本变更的规范约束，也是对开发者的一种承诺。接下来，我们详细来看。

首先是 Development 级别：

- 对象版本：无约定。

- 可用性：没有被提交到 Kubernetes 代码仓库的 main 分支，所以也不能被官方发布。

- 受众：某个特性或概念的相关开发者。

- 可升级性、可靠性、完整性和支持：没有任何要求或保证。

其次是 Alpha 级别：

```
对象版本：API 版本名称包含 alpha（例如 v1alpha1）。
```

- 可用性：被提交到 Kubernetes 代码仓库的 main 分支，并被官方发布。新特性默认被禁用，但可以通过 Feature Gate 被开启。

- 受众：对新功能感兴趣的开发者或者 Kubernetes 资深使用者。

- 完整性：一些 API 操作、CLI 命令、UI 等可能未被支持。API 不一定经过 API 审查（对API 进行深入和针对性的审查，审查力度超出了普通代码审查）。

- 可升级性：对象 Schema 和语义可能在后续版本中被更改，这些对象可能会从 Kubernetes集群中移除；在 Alpha 阶段，移除可升级性约束，开发者可以快速迭代版本，并且不用去维护多个版本。但当对象 Schema 和语义以 incompatible way 更改时，开发仍然需要增加 API 版本号。

- 集群可靠性：因为特性很新，可能缺乏完整的端到端测试，通过 Feature Gate 开启新特性时，可能会带来一些稳定性问题，例如引入 Bug。

- 支持：新特性不承诺一定会开发完成，可能在后续的版本中被完全删除；

- 推荐使用情况：因为可升级性复杂，并且新特性缺乏长期的支持和稳定性保障，所以仅建议在短期的测试集群中使用。

接着是 Beta 级别：

- 对象版本：API 版本名称包含 beta（例如 v2beta3）。

- 可用性：被提交到 Kubernetes 代码仓库的 main 分支，并被官方发布。新特性默认被禁用，但可以通过 Feature Gate 被开启。

- 受众：对提供功能反馈感兴趣的 Kubernetes 用户。

- 完整性：所有 API 操作、CLI 命令、UI 等都支持新特性。新特性完成了端到端测试，经过了彻底的 API 审查，新特性被认为是功能完备的。新特性在 beta 阶段被使用时，可能会因为 API 审查时没有审查到，而带来一些问题。

- 可升级性：对象 Schema 和语义可能在后续版本中被更改。当被更改时，Kubernetes 会提供升级操作文档。在某些情况下，对象可自动转换为新版本。在其他情况下，可能需要我们手动升级到新版本。手动升级时，对于依赖这些功能的服务可能需要停机，并且可能需要手动将对象转换为新版本。当需要手动转换时，Kubernetes 会提供相关的转换文档。

- 集群可靠性：由于新特性已经进行了端到端测试，通过 Feature Gate 启用新特性后，不应该在与该特性不相关的地方引入 Bug。不过，因为特性是新的，可能仍会引入一些小Bug。

- 支持：Kubernetes 项目承诺，在随后的稳定版本中，完成该功能。通常会在 3 个月内完成，但有时可能需要更长的时间。发布应同时支持两个连续版本（例如 v1beta1 和v1beta2、 v1beta2 和 v1），至少在一个次要发布周期内（通常为 3 个月），以便用户有足够的时间进行升级和迁移对象。

- 推荐使用情况：可以在生产集群中短时间使用，用于评估目的，建议在短期的测试集群中使用。

最后是 Stable 级别：

```
对象版本：API 版本为 vX，其中 X 是个整数，例如：v1。
```

- 可用性：被提交到 Kubernetes 代码仓库的 main 分支，并被官方发布。新特性默认被启用。

- 受众：所有用户。

- 完整性：经过了充分的测试，可以用于生产环境中。

- 可升级性：仅允许在后续软件发布中进行符合兼容性要求的更改。

- 集群可靠性：高。

- 支持：API 版本将在今后的多个发布中继续存在。

- 推荐使用情况：任何情况。

## 课程总结

本节课讲解了 Kubernetes 中是如何进行不兼容变更的，以及如何向稳定的版本添加不稳定的功能，同时我们还详细介绍了 Kubernetes 中的 4 大类 API 级别：Development Level、AlphaLevel、Beta Level、Stable Level。

## 课后练习

1. 请你描述下 Kubernetes 中是如何向稳定版本添加不稳定功能的？

2. Kubernetes API 版本按严谨顺序演进，每个阶段代表的含义是什么？

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
