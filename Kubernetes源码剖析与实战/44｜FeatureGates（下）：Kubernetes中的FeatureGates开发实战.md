# 44 | FeatureGates（下）：Kubernetes中的FeatureGates开发实战

你好，我是孔令飞。

上一节课，我介绍了 Kubernetes 设计功能门控的目的、使用方式、生命周期，以及如何在代码中使用功能门控。学完之后，其实你还不知道具体如何定义并使用一个功能门控。这节课，我就通过一个实战示例为你展示具体的定义方法，并在代码中使用这个功能门控，为你介绍它的使用方式。

## 定义并使用 Feature Gates

我们可以通过以下 2 步来定义并使用一个新的功能门控：

1. 定义功能门控

2. 在代码中使用功能门控

- 示例源码为：https://github.com/superproj/k8sdemo/tree/master/featuregates。

### 步骤 1：定义功能门控

定义功能门控，又分为以下几步：

1. 添加自定义功能门控列表

2. 新增功能门控

3. 注册功能门控

### 1. 创建自定义功能门控列表

```python
新建文件  featuregates/feature/feature_gate.go，内容如下：
package feature
import (
   "k8s.io/component-base/featuregate"
)
var (
   // DefaultMutableFeatureGate is a mutable version of DefaultFeatureGate.
   // Only top-level commands/options setup and the k8s.io/component-base/featur
   // Tests that need to modify feature gates for the duration of their test sho
   //   defer featuregatetesting.SetFeatureGateDuringTest(t, utilfeature.Default
   DefaultMutableFeatureGate featuregate.MutableFeatureGate = featuregate.NewFea
   // DefaultFeatureGate is a shared global FeatureGate.
   // Top-level commands/options setup that needs to modify this feature gate sh
   DefaultFeatureGate featuregate.FeatureGate = DefaultMutableFeatureGate
)
```

上述代码创建了 2 个包级别的变量：

- DefaultMutableFeatureGate：可写的 Feature Gates，用来在应用启动时设置 FeatureGates。例如：读取命令行 Flag，并将 Flag 传入的 Feature Gate 的开启状态设置到

```
DefaultMutableFeatureGate 全局变量中。
```

- DefaultFeatureGate：只读的 Feature Gates，用来读取 Feature Gates 中注册的功能列

```
表，并根据是否开启，进行功能开启 / 关闭。这里需要注意，DefaultFeatureGate 是
DefaultMutableFeatureGate 的一个子集，只暴露了读方法。
```

### 2. 新增功能门控

```go
新建文件 featuregates/feature/feature.go，内容如下：
package feature
import (
   "k8s.io/apimachinery/pkg/util/runtime"
   "k8s.io/component-base/featuregate"
)
// Define a new feature gate.
const MyNewFeature featuregate.Feature = "MyNewFeature"
func init() {
   // runtime.Must(utilfeature.DefaultMutableFeatureGate.Add(defaultFeatureGates
   runtime.Must(DefaultMutableFeatureGate.Add(defaultFeatureGates))
}
// defaultFeatureGates consists of all known specific feature keys.
// To add a new feature, define a key for it above and add it here.
var defaultFeatureGates = map[featuregate.Feature]featuregate.FeatureSpec{
   // owner: @colin404
   // Deprecated: v1.31
   //
   // An example feature gate.
   MyNewFeature: {Default: false, PreRelease: featuregate.Alpha},
}
k8s.io/component-base/featuregate 包提供了功能门控的核心实现和接口，允许开
```

发者定义和管理功能门控。

```
在上述代码中，我们使用了 k8s.io/component-base/featuregate 包中定义的
featuregate.Feature类型作为 map 的 key，featuregate.FeatureSpec 类型作为
map 的 value。featuregate.Feature 类型的底层数据类型为 string。
此外，我们还定义并注册了一个名为 MyNewFeature 的功能，其设置为：默认关闭
（Default: false）、特性的成熟度为 Alpha（PreRelease: featuregate.Alpha）。
```

### 3. 注册功能门控

新增完一个功能门控，接下来，我们还需要将此功能门控添加到全局的可变功能门控中。

```
在 init() 函数中，通过
DefaultMutableFeatureGate.Add(defaultFeatureGates) 方法调用，将我们新增
的功能门控添加到全局的可变功能门控中。defaultFeatureGates 是我们自定义的功能门
控列表。defaultFeatureGates 是一个 map 类型的结构，其中 key 是功能门控名字，
```

value 是功能门控的定义，在定义中指定了功能门控的默认值、所处的发布状态。

### 步骤 2：在代码中使用功能门控

```
这里，我们再来看下具体如何使用新增的功能门控。添加 featuregates/main.go 文件，
```

内容如下：

```go
package main
import (
   "fmt"
   "os"
   "github.com/spf13/pflag"
   "github.com/superproj/k8sdemo/featuregates/feature"
)
func main() {
   // Create a new FlagSet for managing command-line flags
   fs := pflag.NewFlagSet("feature", pflag.ExitOnError)
   // Set the usage function to provide a custom help message
   fs.Usage = func() {
       fmt.Fprintf(os.Stderr, "Usage of %s:\n", os.Args[0])
       fs.PrintDefaults()
   }
   // Define a boolean flag for displaying help
   help := fs.BoolP("help", "h", false, "Show this help message.")
   // Add the feature gates to the flag set
   feature.DefaultMutableFeatureGate.AddFlag(fs)
   // Parse the command-line flags
   fs.Parse(os.Args[1:])
   // Display help message if the help flag is set
   if *help {
       fs.Usage()
       return
   }
   // Check if the MyNewFeature feature gate is enabled
   if feature.DefaultFeatureGate.Enabled(feature.MyNewFeature) {
       // Logic when the new feature is enabled
       fmt.Println("Feature Gates: MyNewFeature is opened")
   } else {
       // Logic when the new feature is disabled
       fmt.Println("Feature Gates: MyNewFeature is closed")
   }
}
```

上述代码内容比较简单、易懂，我就不过多介绍了。

运行上述命令，输出结果如下：

```
$ go run main.go -h
Usage of /tmp/go-build224395384/b001/exe/main:
     --feature-gates mapStringBool   A set of key=value pairs that describe feat
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     MyNewFeature=true|false (ALPHA - default=fa
 -h, --help                          Show this help message.
$ go run main.go  --feature-gates=MyNewFeature=false
Feature Gates: MyNewFeature is closed
$ go run main.go  --feature-gates=MyNewFeature=true
Feature Gates: MyNewFeature is opened
可以看到，我们可以通过 --feature-gates 来控制某个功能是否开启，非常方便。并且在
执行 -h 时，会输出当前注册的功能列表、开启状态及成熟度。
```

上面，我介绍了如何自定义并使用 Feature Gates，以此加深你对 Feature Gates 的了解。接下来，我们看下 Kubernetes 项目是如何使用 Feature Gates 的。

## Kubernetes 中的功能门控实现

Kubernetes 中使用 Feature Gates 的方式和上述介绍的定义及使用方式大同小异，区别如下：

- Kubernetes 中的 Feature Gates 列表更多。Kubernetes 支持的 Feature Gates 列表见：

```
pkg/features/kube_features.go。当然，你也可以执行 kube-apiserver -h 查看 --
feature-gates 命令行 Flag 的描述，描述中详细列出了 kube-apiserver 支持的 Feature
```

- Gate。

```
kube-apiserver --feature-gates 描述中的 Feature Gate 列表展示的 Feature
Gate 名字，通过 : 符号进一步划分了 Feature Gate 的类别，例如：
kube:APIResponseCompression=true|false (BETA - default=true)。
```

- Kubernetes 中的 Feature Gate 在定义时，有严格的注释规范，例如：

```
   // owner: @thockin
   // deprecated: v1.29
   //
   // Enables Service.status.ingress.loadBanace to be set on
   // services of types other than LoadBalancer.
   AllowServiceLBStatusOnNonLB featuregate.Feature = "AllowServiceLBStatusOnNonL
   // owner: @bswartz
   // alpha: v1.18
   // beta: v1.24
   //
   // Enables usage of any object for volume data source in PVCs
   AnyVolumeDataSource featuregate.Feature = "AnyVolumeDataSource"
```

在 Feature Gate 定义时，通过注释说明了 Feature Gate 的功能、负责人、废弃版本、每个阶段所在的版本等信息。

### Kubernetes 中功能门控定义

Kubernetes 中有 2 个地方定义了功能门控：

```
staging/src/k8s.io/apiserver/pkg/features/kube_features.go 定义了一
```

- 些通用的功能门控，这些功能会被多个 Kubernetes 组件共同使用。

```
pkg/features/kube_features.go 是组件级别的功能门控，这些功能被某个组件使
```

- 用，其他组件无法使用。组件级别的功能门控，可以通过以下方式（可选的）来引用通用的功能门控：

```go
package features
import (
   apiextensionsfeatures "k8s.io/apiextensions-apiserver/pkg/features"
   "k8s.io/apimachinery/pkg/util/runtime"
   genericfeatures "k8s.io/apiserver/pkg/features"
   utilfeature "k8s.io/apiserver/pkg/util/feature"
   clientfeatures "k8s.io/client-go/features"
   "k8s.io/component-base/featuregate"
)
func init() {
   runtime.Must(utilfeature.DefaultMutableFeatureGate.Add(defaultKubernetesFeatu
   runtime.Must(utilfeature.DefaultMutableFeatureGate.AddVersioned(defaultVersio
   // Register all client-go features with kube's feature gate instance and make
   // feature checks use kube's instance. The effect is that for kube binaries,
   // features are wired to the existing --feature-gates flag just as all other
   // are. Further, client-go features automatically support the existing mechan
   // feature enablement metrics and test overrides.
   ca := &clientAdapter{utilfeature.DefaultMutableFeatureGate}
   runtime.Must(clientfeatures.AddFeaturesToExistingFeatureGates(ca))
   clientfeatures.ReplaceFeatureGates(ca)
}
// defaultKubernetesFeatureGates consists of all known Kubernetes-specific featur
// To add a new feature, define a key for it above and add it here. The features
// available throughout Kubernetes binaries.
//
// Entries are separated from each other with blank lines to avoid sweeping gofmt
// when adding or removing one entry.
var defaultKubernetesFeatureGates = map[featuregate.Feature]featuregate.FeatureSp
   ...
   genericfeatures.AdmissionWebhookMatchConditions: {Default: true, PreRelease:
   genericfeatures.AggregatedDiscoveryEndpoint: {Default: true, PreRelease: feat
   genericfeatures.AnonymousAuthConfigurableEndpoints: {Default: false, PreRelea
   ...
}
在 Kubernetes 源码中导入包时，你经常可以发现有以下包重命名方式：genericxxx。
generic 关键字说明这个包中的功能是通用的，这通常也意味着存在一些组件维度的、非通
```

用的类似功能包。

### Kubernetes 中功能门控注册

```
在 k8s.io/apiserver/pkg/util/feature 包中，定义了全局的
DefaultMutableFeatureGate 和 DefaultFeatureGate 2 个 Feature Gate。程序启动
```

时会将预定义的 Feature Gate 注册到这 2 个全局 Feature Gates 中供程序使用。例如：在kube-apiserver 组件启动时，通过以下代码向上述 Feature Gates 注册预定义的 FeatureGate：

```go
// 位于 cmd/kube-apiserver/app/server.go 文件中
package app
import (
   ...
   utilfeature "k8s.io/apiserver/pkg/util/feature"
   ...
   "k8s.io/kubernetes/cmd/kube-apiserver/app/options"
   ...
)
func init() {
   utilruntime.Must(logsapi.AddFeatureGates(utilfeature.DefaultMutableFeatureGat
}
...
// 位于 cmd/kube-apiserver/app/options/options.go 文件中
package options
import (
   ...
   _ "k8s.io/kubernetes/pkg/features" // add the kubernetes feature gates
   ...
)
// 位于 pkg/features/kube_features.go 文件中
package features
import (
   apiextensionsfeatures "k8s.io/apiextensions-apiserver/pkg/features"
   "k8s.io/apimachinery/pkg/util/runtime"
   genericfeatures "k8s.io/apiserver/pkg/features"
   utilfeature "k8s.io/apiserver/pkg/util/feature"
   clientfeatures "k8s.io/client-go/features"
   "k8s.io/component-base/featuregate"
)
...
func init() {
   runtime.Must(utilfeature.DefaultMutableFeatureGate.Add(defaultKubernetesFeatu
   runtime.Must(utilfeature.DefaultMutableFeatureGate.AddVersioned(defaultVersio
   // Register all client-go features with kube's feature gate instance and make
   // feature checks use kube's instance. The effect is that for kube binaries,
   // features are wired to the existing --feature-gates flag just as all other
   // are. Further, client-go features automatically support the existing mechan
   // feature enablement metrics and test overrides.
   ca := &clientAdapter{utilfeature.DefaultMutableFeatureGate}
   runtime.Must(clientfeatures.AddFeaturesToExistingFeatureGates(ca))
   clientfeatures.ReplaceFeatureGates(ca)
}
```

我给你梳理下 kube-apiserver 启动时注册 Feature Gate 的流程：

```
在 k8s.io/kubernetes/pkg/features 包中，定义了一些预定义的 Feature Gate，这
些包在被加载时，会调用  init() 函数，在函数中，会将这些预定义的 Feature Gate 通过
utilfeature.DefaultMutableFeatureGate.Add 方法注册到 utilfeature
（k8s.io/apiserver/pkg/util/feature 包别名）包的
DefaultMutableFeatureGate Feature Gates 中。
在 kube-apiserver 启动时，会首先导入 k8s.io/kubernetes/cmd/kube-
apiserver/app/options 包，在 k8s.io/kubernetes/cmd/kube-
apiserver/app/options 包中匿名导入 k8s.io/kubernetes/pkg/features。
```

通过以上 2 步，将 kube-apiserver 预定义的 Feature Gate 注册到

```
k8s.io/apiserver/pkg/util/feature 包的 DefaultMutableFeatureGate 全局变
量中。之后，便可以在 kube-apiserver 代码中，使用 DefaultMutableFeatureGate 中注
```

册的 Feature Gate。

### Kubernetes 中功能门控使用

```
接下来，我们看看 Kubernetes 代码中是如何使用 CSIVolumeHealth 功能门控的。具体来
```

说，使用代码见文件 pkg/volume/csi/csi_client.go，代码内容如下：

```go
   if utilfeature.DefaultFeatureGate.Enabled(features.CSIVolumeHealth) {
       isSupportNodeVolumeCondition, err := c.nodeSupportsVolumeCondition(ctx)
       if err != nil {
           return nil, err
       }
       if isSupportNodeVolumeCondition {
           abnormal, message := resp.VolumeCondition.GetAbnormal(), resp.VolumeC
           metrics.Abnormal, metrics.Message = &abnormal, &message
       }
   }
我们不难发现，使用方式其实就是调用 Feature Gate 的 Enabled 方法，来判断功能门控是
```

否开启，如果开启了做什么操作，如果没有开启又做什么操作。Feature Gate 来自于

```
k8s.io/apiserver/pkg/util/feature 包中的全局变量
DefaultMutableFeatureGate。
```

另外，在启动 kube-apiserver 时，我们也可以动态地设置某个功能是否开启，例如：

```
$ _output/bin/kube-apiserver --feature-gates=CSIVolumeHealth=true
```

### Feature Gates 源码剖析

```
Kubernetes 定义 Feature Gates、使用 Feature Gates 都是通过 k8s.io/component-
base/featuregate 包中定义的结构体、函数、方法来实现的。接下来，我就给你详细介绍
下 k8s.io/component-base/featuregate 包的具体实现，也即 Kubernetes Feature
```

Gates 机制的具体实现方式。

Kubernetes Feature Gates 机制的核心实现位于 staging/src/k8s.io/component-base/featuregate/feature_gate.go 文件中。

```
k8s.io/component-base/featuregate 包定义了一个 featureGate 结构体类型，该
结构体类型其实就代表一个 Feature Gates。featureGate 结构体定义如下：
// featureGate implements FeatureGate as well as pflag.Value for flag parsing.
type featureGate struct {
   // Feature Gates 的名称，用来表示一个 Feature Gates.
   featureGateName string
   // Feature Gates 的处理函数映射，用于定义如何处理相关的特性逻辑，如解析和启用特性。
   special map[Feature]func(map[Feature]VersionedSpecs, map[Feature]bool, bool,
   // 互斥锁，用于保护对以下字段的写访问，确保线程安全。
   lock sync.Mutex
   // 存储已知特性及其相关定义的映射（map[Feature]FeatureSpec）。
   known atomic.Value
   // 存储每个特性是否被启用的映射（map[Feature]bool）。
   enabled atomic.Value
   // 存储解析后的原始标志值的映射（map[string]bool），保留特殊特性的初始值。
   enabledRaw atomic.Value
   // 在调用 AddFlag 时设置为 true，以防止后续的 Add 方法调用。
   closed bool
   // 存储通过 Enabled 接口查询的特性，当调用 SetEmulationVersion 时，这些特性重置。
   queriedFeatures atomic.Value
   // 指向当前模拟版本的指针，用于特性门控的逻辑处理。
   emulationVersion atomic.Pointer[version.Version]
}
通过 featureGate 结构体中包含了一些字段，分别用来完成不同的功能。featureGate结
```

构体具有一些方法，这些方法完成跟功能门控相关的各类功能。核心方法列表如下：

```
NewFeatureGate()：创建并返回一个新的 featureGate 实例。
Set(value string) error：设置特性的值，根据传入的字符串值解析并更新功能门控
```

- 的状态。

```
SetFromMap(m map[string]bool) error：根据给定的映射设置特性的启用状态。
```

- 这是一个公共方法，用于根据传入的键值对更新特性。

```
Add(features map[Feature]FeatureSpec) error：向功能门控添加新的特性及其
```

- 规格，用于扩展功能门控的能力以支持更多特性。

```
SetEmulationVersion(emulationVersion version.Version) error：设置模
```

- 拟版本，以便在特性逻辑中使用。此版本会影响特性启用的逻辑。

```
AddFlag(fs *pflag.FlagSet)：将功能门控的标志添加到提供的标志集，便于通过命
```

- 令行配置特性。

```
KnownFeatures() []string：返回所有已知特性的名称列表，提供特性的可用性信
```

- 息。

- 还有一些我们没讲到的其他有用的方法，你可以阅读 staging/src/k8s.io/component-base/featuregate/feature_gate.go 文件，学习并掌握。

## 课程总结

本节课详细介绍了如何定义并使用 Feature Gates，给出了详细、可实操的示例。此外，也详细介绍了 Kubernetes 项目是如何定义并使用 Feature Gates 的。通过今天的学习 ，你也可以在业务开发中复用 Kubernetes 的 Feature Gates 的设计及包。

## 课后练习

请你阅读 staging/src/k8s.io/component-base/featuregate/feature_gate.go 文件，学习下Kubernetes Feature Gates 功能特性具体是如何实现的。

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
