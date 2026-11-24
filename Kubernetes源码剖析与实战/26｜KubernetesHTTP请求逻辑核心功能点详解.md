# 26 | KubernetesHTTP请求逻辑核心功能点详解

你好，我是孔令飞。

上一节课，我介绍了 Kubernetes 中 HTTP 处理的核心流程，其中还有很多重要的细节功能需要我们了解。

```
我们在定义一个资源的存储层代码时，分别创建了以下 3 个核心源码文件（这里以 apps资源
组的 Deployment 为例来介绍）：
pkg/registry/apps/rest/storage_apps.go：提供了创建 APIGroupInfo 类型实
例的方法，APIGroupInfo 类型中的各个字段，用来安装 apps 资源组下所有版本、所有
```

- 资源的 REST 路由。

```
pkg/registry/apps/deployment/strategy.go：定义了 deploymentStrategy
```

- 结构体，该结构体中的方法，可以在更新资源的时候被调用。也就是说，

```
deploymentStrategy 结构体中的方法，主要负责定义与 Kubernetes 的 Deployment 相
```

- 关的更新策略。

```
pkg/registry/apps/deployment/storage/storage.go：该文件主要用于实现与
```

- Deployment 资源相关的存储层的功能。这个文件定义了如何将 Deployment 对象持久化到存储后端（如 etcd）。

上述 3 个文件都包含了大量的请求处理方法，这节课我们来详细介绍下。

## 如何创建资源组的 REST Storage ？

```
资源组的 REST Storage 创建逻辑位于 pkg/registry/apps/rest/storage_apps.go
```

文件中，其创建逻辑如下：

```go
// NewRESTStorage returns APIGroupInfo object.
func (p StorageProvider) NewRESTStorage(apiResourceConfigSource serverstorage.API
   apiGroupInfo := genericapiserver.NewDefaultAPIGroupInfo(apps.GroupName, legac
   // If you add a version here, be sure to add an entry in `k8s.io/kubernetes/c
   // TODO refactor the plumbing to provide the information in the APIGroupInfo
   if storageMap, err := p.v1Storage(apiResourceConfigSource, restOptionsGetter)
       return genericapiserver.APIGroupInfo{}, err
   } else if len(storageMap) > 0 {
       apiGroupInfo.VersionedResourcesStorageMap[appsapiv1.SchemeGroupVersion.Ve
   }
   return apiGroupInfo, nil
}
func (p StorageProvider) v1Storage(apiResourceConfigSource serverstorage.APIResou
   storage := map[string]rest.Storage{}
   // deployments
   if resource := "deployments"; apiResourceConfigSource.ResourceEnabled(appsapi
       deploymentStorage, err := deploymentstore.NewStorage(restOptionsGetter)
       if err != nil {
           return storage, err
       }
       storage[resource] = deploymentStorage.Deployment
       storage[resource+"/status"] = deploymentStorage.Status
       storage[resource+"/scale"] = deploymentStorage.Scale
   }
   ...
   // daemonsets
   if resource := "daemonsets"; apiResourceConfigSource.ResourceEnabled(appsapiv
       daemonSetStorage, daemonSetStatusStorage, err := daemonsetstore.NewREST(r
       if err != nil {
           return storage, err
       }
       storage[resource] = daemonSetStorage
       storage[resource+"/status"] = daemonSetStatusStorage
   }
   return storage, nil
}
上述创建逻辑比较简单，在 storage := map[string]rest.Storage{} 中保存每个资
源的 Storage，map 的 key 为资源名，例如：deployments、deployments//status、
deployments/scale。
之后在 NewRESTStorage 方法中，将这些 storage 保存在 APIGroupInfo 的
VersionedResourcesStorageMap 字段中，VersionedResourcesStorageMap 类型
为 map[string]map[string]rest.Storag。其中最外层 map 的 key 为资源的版本。所
```

以资源组的 REST Storage 格式为：

```json
{
 "v1": {
   "deployments": <deployment资源的REST实例>,
   "deployments/status": <deployment status 资源的REST实例>,
   "deployments/scale": <deployment scale资源的REST实例>,
 },
 "v1beta1": {
   "deployments": <deployment资源的REST实例>,
   "deployments/status": <deployment status 资源的REST实例>,
   "deployments/scale": <deployment scale资源的REST实例>,
 },
}
```

之后，kube-apiserver 可以通过以上 map，按照资源版本 -> 资源的方式找到版本化资源的REST 实现。该 REST 实现是路由函数的组成部分。

## Kubernetes 包含了哪些请求处理策略（以资源创建请求为例）?

```go
我们先来看下 Strategy 在哪里被调用。前面，我介绍了 HTTP 的创建请求是在 e.create 方
法中实现的。在 e.create 方法中，有以下 3 行代码：
   // 执行创建前处理，执行与创建相关的前置验证或处理。
   if err := rest.BeforeCreate(e.CreateStrategy, ctx, obj); err != nil {
       return nil, err
   }
rest.BeforeCreate 函数调用会执行资源创建时的策略执行，创建时可以执行的策略方法
定义在 rest.RESTCreateStrategy 接口中，接口定义如下：
// RESTCreateStrategy defines the minimum validation, accepted input, and
// name generation behavior to create an object that follows Kubernetes
// API conventions.
type RESTCreateStrategy interface {
   runtime.ObjectTyper // 该接口用于提供对象类型信息
   // 如果资源设置了 metadata.GenerateName 字段，names.NameGenerator 中的方法会被调用
   names.NameGenerator
   // 该方法返回资源是否是 Namespace 级别的资源
   NamespaceScoped() bool
   // 在 Validate 之前被调用，用来对资源进行一些规范化处理，例如：清除状态或者进行类型检查
   PrepareForCreate(ctx context.Context, obj runtime.Object) // 准备创建对象，进行规
   // Validate 返回一个 ErrorList，包含验证错误或 nil。
   // 在对象被持久化之前验证资源是否合法，Validate 不应该修改资源对象
   Validate(ctx context.Context, obj runtime.Object) field.ErrorList // 验证对象的
   // 给客户端返回一些告警信息，在 Validate 之后被调用，在持久化之前被调用
   //
   // 使用警告消息描述客户端在执行 API 请求时应纠正或注意的问题。
   // 例如：
   // - 使用将在未来版本中停止工作的过时字段/标签/注释
   // - 使用无效的字段/标签/注释，这些字段在功能上无效
   // - 形状不良或无效的规范，阻止成功处理提交的对象，但不会因为兼容性原因被验证拒绝
   WarningsOnCreate(ctx context.Context, obj runtime.Object) []string // 返回创建
   // 修改资源对象为规范化的形式，该方法可以修改对象
   Canonicalize(obj runtime.Object) // 将对象转换为规范形式
}
接口中提供的方法在 rest.BeforeCreate 函数中被调用，rest.BeforeCreate 函数代
```

码如下：

```go
// BeforeCreate ensures that common operations for all resources are performed on
// errors that can be converted to api.Status. It invokes PrepareForCreate, then
// It returns nil if the object should be created.
func BeforeCreate(strategy RESTCreateStrategy, ctx context.Context, obj runtime.O
   objectMeta, kind, kerr := objectMetaAndKind(strategy, obj)
   if kerr != nil {
       return kerr
   }
   // ensure that system-critical metadata has been populated
   if !metav1.HasObjectMetaSystemFieldValues(objectMeta) {
       return errors.NewInternalError(fmt.Errorf("system metadata was not initia
   }
   // ensure the name has been generated
   if len(objectMeta.GetGenerateName()) > 0 && len(objectMeta.GetName()) == 0 {
       return errors.NewInternalError(fmt.Errorf("metadata.name was not generate
   }
   // ensure namespace on the object is correct, or error if a conflicting names
   requestNamespace, ok := genericapirequest.NamespaceFrom(ctx)
   if !ok {
       return errors.NewInternalError(fmt.Errorf("no namespace information found
   }
   if err := EnsureObjectNamespaceMatchesRequestNamespace(ExpectedNamespaceForSc
       return err
   }
   strategy.PrepareForCreate(ctx, obj)
   if errs := strategy.Validate(ctx, obj); len(errs) > 0 {
       return errors.NewInvalid(kind.GroupKind(), objectMeta.GetName(), errs)
   }
   // Custom validation (including name validation) passed
   // Now run common validation on object meta
   // Do this *after* custom validation so that specific error messages are show
   if errs := genericvalidation.ValidateObjectMetaAccessor(objectMeta, strategy.
       return errors.NewInvalid(kind.GroupKind(), objectMeta.GetName(), errs)
   }
   for _, w := range strategy.WarningsOnCreate(ctx, obj) {
       warning.AddWarning(ctx, "", w)
   }
   strategy.Canonicalize(obj)
   return nil
}
rest.BeforeCreate(e.CreateStrategy, ctx, obj) 函数的入参
e.CreateStrategy 是在创建 Deployment REST 结构体实例时被创建的：
// NewREST returns a RESTStorage object that will work against deployments.
func NewREST(optsGetter generic.RESTOptionsGetter) (*REST, *StatusREST, *Rollback
   store := &genericregistry.Store{
       // NewFunc 用来创建一个空的 &apps.Deployment{}
       // 该空对象会被用来保存 Etcd 中的 Deployment 对象内容
       NewFunc: func() runtime.Object { return &apps.Deployment{} },
       // NewListFunc 用来创建一个空的 &apps.DeploymentList{}
       // 该空对象会被用来保存 Deployment 对象列表
       NewListFunc: func() runtime.Object { return &apps.DeploymentList{} },
       // 设置资源的默认复数名称
       DefaultQualifiedResource: apps.Resource("deployments"),
       // 设置资源的单数名称
       SingularQualifiedResource: apps.Resource("deployment"),
       // 指定创建 Deployment 时的策略
       CreateStrategy: deployment.Strategy,
       // 指定更新 Deployment 时的策略
       UpdateStrategy: deployment.Strategy,
       // 指定删除 Deployment 时的策略
       DeleteStrategy: deployment.Strategy,
       // 指定重置 Deployment 字段时的策略
       ResetFieldsStrategy: deployment.Strategy,
       // 设置表格转换器
       TableConvertor: printerstorage.TableConvertor{TableGenerator: printers.Ne
   }
   ...
   return &REST{store}, &StatusREST{store: &statusStore}, &RollbackREST{store: s
}
通过上面的代码，我们可以知道，更新资源时使用的是 UpdateStrategy；删除资源时使用
的是 DeleteStrategy；重置资源字段时使用的是 ResetFieldsStrategy。你可以将这
```

些 Strategy 的调用流程作为留给自己的作业，通过阅读源码来了解，其实现方式跟创建资源时保持一致。

## 如何自定义请求处理逻辑？

```python
Deployment REST的定义如下：
import (
   genericregistry "k8s.io/apiserver/pkg/registry/generic/registry"
)
type REST struct {
   *genericregistry.Store
}
可以看到，REST 结构体内嵌了 *genericregistry.Store 类型的字段，也就是说 REST
继承了 *genericregistry.Store 类型的 Create 方法。*genericregistry.Store
```

中的方法是标准的、默认的资源创建方法。如果在实际业务开发中有自定义的创建逻辑，可以

```
通过重写 Create 方法来实现。例如，可以在
pkg/registry/apps/deployment/storage/storage.go 文件中给 REST 新增一个
Create 方法：
```

```
func (r *REST) Create(ctx context.Context, obj runtime.Object, createValidation r
   // 添加你的创建逻辑
   return nil, nil
}
```

## 课程总结

本节通过 Deployment 资源的创建请求为例，拆解了 kube-apiserver 从接收 HTTP 请求到数

```sql
据最终落盘 etcd 的完整链路。首先说明 StorageProvider 如何为 apps 资源组生成
VersionedResourcesStorageMap，使不同版本、不同资源均能找到各自的 REST 实现。
随后聚焦 RESTCreateStrategy，剖析 rest.BeforeCreate 函数在对象持久化前所做的
PrepareForCreate、Validate、Canonicalize 等通用校验与规范化处理。
接着展示 genericregistry.Store 如何为 Deployment 绑定 Create／Update／
Delete 等多种 Strategy，保证各类操作的一致行为。
```

最后指出在真实业务场景下可通过嵌入式组合与方法覆写，为特定资源自定义增删改查逻辑。整体思路：用分层解耦实现策略可插拔、存储可扩展、版本可多态，体现了 Kubernetes API服务器的高度模块化能力。

## 课后练习

```
代码走读：以 apps/v1 下的 DaemonSet 为对象，按照 Deployment 的分析方法定位并梳
理其 BeforeCreate 到数据写入 etcd 的完整调用栈（含 Strategy 与 Storage 实现），画
```

- 出时序图并在注释中注明关键函数的作用。

```
自定义扩展：假设业务要求在创建 Deployment 时自动为所有镜像标签追加后缀 -
verified。请在 pkg/registry/apps/deployment/storage/storage.go 中覆写
Create 方法实现该逻辑，同时保证现有校验流程不受影响。完成后编写单元测试，验证新
```

- 建对象的镜像字段已被正确修改并顺利持久化。

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
