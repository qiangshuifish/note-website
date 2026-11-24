# 18 | Kubernetes如何定义标准化资源对象？

你好，我是孔令飞。

上一节课，我介绍了 Kubernetes 在设计 RESTful API 接口时的一些特点。接下来几节课，我们通过源码来看下 Kubernetes 具体如何设计 RESTful API。

设计 RESTful API 的第一个核心步骤便是定义 REST 资源对象。Kubernetes 拥有如此庞大的代码量，仍然能够快速迭代和维护，其核心原因之一就是功能设计的标准化，包括 REST 资源对象的设计。

本节课，我们来看下 Kubernetes 如何定义标准化的资源对象。

## 什么是 Kubernetes 资源对象？

开发 API 接口的第一步就是设计 API 接口。所谓的设计 API 接口，一般包含以下 3 大类工作：

- 定义 API 接口的参数（资源定义）：根据 API 接口的功能定义该 API 接口的各种参数，这些参数包括路径参数、查询参数、请求体等。

- 定义 API 接口的请求方法：请求方法一般包括 POST、PUT、GET、DELETE、PATCH等。

- 定义 API 接口的请求路径：我们需要根据 REST 规范来指定 API 接口的请求路径，如

```
/apis/batch/v1/cronjobs。
```

其中，最核心的一步是定义 API 接口的参数，也就是资源定义。另外两项——定义 API 接口的请求方法和请求路径——在 Kubernetes 中都会根据资源定义自动生成。

资源定义是一个开发动作，在 Kubernetes 中，定义出来的资源也叫资源对象，其实就是一个Go 结构体，也称为 Kubernetes 资源对象（一种编程对象）。这是我自己理解的 Kubernetes对象。接下来，我们再来看下 Kubernetes 对象的官方定义。

在 Kubernetes 系统中，Kubernetes 对象是持久化的实体。Kubernetes 使用这些实体去表示整个集群的状态。Kubernetes 对象主要描述了以下信息：

- 哪些容器化应用在运行（以及在哪些节点上）。

- 可以被应用使用的资源。

- 关于应用运行时表现的策略，比如重启策略、升级策略，以及容错策略。

上面的对象其实描述的是 Workload 类型的资源对象（如 Deployment、StatefulSet 等）。随着Kubernetes 功能的迭代，内置了越来越多的对象，这些对象包含的信息，已经远远超出了上面描述的信息。

Kubernetes 对象具有以下 3 个特点：

- Kubernetes 对象是 “意向表达”：一旦创建对象，Kubernetes 系统将持续工作以确保对象存在。 通过创建对象，本质上是在告知 Kubernetes 系统，所需要的集群工作负载看起来是什么样子的，这就是 Kubernetes 集群的期望状态（Desired State）。

- 需要使用 Kubernetes API 操作 Kubernetes 对象：无论是创建、修改或者删除，都需要使用 Kubernetes API。比如，当使用 kubectl 命令行接口（CLI）时，CLI 会调用必要的Kubernetes API；也可以在程序中使用客户端库（client-go）来直接调用 Kubernetes API。

- 对象具有一定的格式：Kubernetes 中的所有资源格式都具有固定的格式。

## Kubernetes 资源对象的标准格式

Kubernetes 中，几乎所有的 Kubernetes 对象都具有固定的格式，都包含 4 类信息：类型元数据、资源元数据、资源期望状态定义、资源当前状态定义。

例如，Kubernetes 的核心资源对象 Deployment 的资源定义如下：

```python
import (
   "metav1 "k8s.io/apimachinery/pkg/apis/meta/v1""
)
// +genclient
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
type Deployment struct {
   metav1.TypeMeta `json:",inline"`
   // Standard object metadata.
   // +optional
   metav1.ObjectMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metad
   // Specification of the desired behavior of the Deployment.
   // +optional
   Spec DeploymentSpec `json:"spec,omitempty" protobuf:"bytes,2,opt,name=spec"`
   // Most recently observed status of the Deployment.
   // +optional
   Status DeploymentStatus `json:"status,omitempty" protobuf:"bytes,3,opt,name=s
}
// DeploymentSpec is the specification of the desired behavior of the Deployment.
type DeploymentSpec struct {
   // replicas is the number of desired pods. This is a pointer to distinguish b
   // zero and not specified. Defaults to 1.
   // +optional
   Replicas *int32 `json:"replicas,omitempty" protobuf:"varint,1,opt,name=replic
   // selector is the label selector for pods. Existing ReplicaSets whose pods a
   // selected by this will be the ones affected by this deployment.
   // +optional
   Selector *metav1.LabelSelector `json:"selector,omitempty" protobuf:"bytes,2,o
   // Template describes the pods that will be created.
   // The only allowed template.spec.restartPolicy value is "Always".
   Template v1.PodTemplateSpec `json:"template" protobuf:"bytes,3,opt,name=templ
   ...
}
// DeploymentStatus is the most recently observed status of the Deployment.
type DeploymentStatus struct {
   // observedGeneration is the generation observed by the deployment controller
   // +optional
   ObservedGeneration int64 `json:"observedGeneration,omitempty" protobuf:"varin
   // replicas is the total number of non-terminated pods targeted by this deplo
   // +optional
   Replicas int32 `json:"replicas,omitempty" protobuf:"varint,2,opt,name=replica
   // updatedReplicas is the total number of non-terminated pods targeted by thi
   // +optional
   UpdatedReplicas int32 `json:"updatedReplicas,omitempty" protobuf:"varint,3,op
   // readyReplicas is the number of pods targeted by this Deployment controller
   // +optional
   ReadyReplicas int32 `json:"readyReplicas,omitempty" protobuf:"varint,7,opt,na
   ...
}
```

上述代码中，黑体字段是每个 Kubernetes 对象都要具有的字段。要注意的是，在有些资源对

```
象中，没有 Status 字段。
```

上述 Deployment 资源定义其实也反应了 Kubernetes 资源对象的基本格式，其定义格式为：

```python
package resourceobject
import (
   metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)
// +enum
type XXXPhase string
// These are the valid phases of a xxx.
const (
   // XXXRunning means the xxx is in the running state.
   XXXRunning XXXPhase = "Running"
   // XXXPending means the xxx is in the pending state.
   XXXPending XXXPhase = "Pending"
)
// +genclient
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
// XXX is an example definition of a Kubernetes resource object.
type XXX struct {
   metav1.TypeMeta `json:",inline"`
   // Standard object's metadata.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   metav1.ObjectMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metad
   // Spec defines the behavior of the XXX.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   Spec XXXSpec `json:"spec,omitempty" protobuf:"bytes,2,opt,name=spec"`
   // Status describes the current status of a XXX.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   Status XXXStatus `json:"status,omitempty" protobuf:"bytes,3,opt,name=status"`
}
// XXXSpec describes the attributes on a XXX.
type XXXSpec struct {
   // DisplayName is the display name of the XXX resource.
   DisplayName string `json:"displayName" protobuf:"bytes,1,opt,name=displayName
   // Description provides a brief summary of the XXX's purpose or functionality
   // It helps users understand what the XXX is intended for.
   // +optional
   Description string `json:"description,omitempty" protobuf:"bytes,2,opt,name=d
   // You can add more status fields as needed.
   // +optional
}
// XXXStatus is information about the current status of a XXX.
type XXXStatus struct {
   // Phase is the current lifecycle phase of the xxx.
   // +optional
   Phase XXXPhase `json:"phase,omitempty" protobuf:"bytes,1,opt,name=phase,castt
   // ObservedGeneration reflects the generation of the most recently observed X
   // +optional
   ObservedGeneration int64 `json:"observedGeneration,omitempty" protobuf:"varin
   // Represents the latest available observations of a xxx's current state.
   // +optional
   // +patchMergeKey=type
   // +patchStrategy=merge
   // +listType=map
   // +listMapKey=type
   Conditions []metav1.Condition `json:"conditions,omitempty" patchStrategy:"mer
   // You can add more status fields as needed.
   // +optional
}
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
// XXXList is a list of XXX objects.
type XXXList struct {
   metav1.TypeMeta `json:",inline"`
   // Standard list metadata.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   metav1.ListMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metadat
   // Items is a list of schema objects.
   Items []XXX `json:"items" protobuf:"bytes,2,rep,name=items"`
}
如果你想开发一个 Kuberentes 资源，可以参考上述格式。直接复制，替换掉 XXX 即可。
```

```
在上述资源定义代码中，XXX 是资源名，通过 type XXX struct Go 语法定义了资源拥有
```

的属性。Kubernetes 资源定义中，有以下 4 个标准属性：

```
metav1.TypeMeta（必须）：内嵌字段，定义了资源使用的资源组、资源版本和资源类
```

- 型。

```
metav1.ObjectMeta（必须）：储资源的元数据，包括名称、命名空间、标签和注释等。
Spec（必须）： 对象规约，定义对象的期望状态（Desired State），该字段描述了对象的配
```

- 置和期望状态，其中的字段可以根据需要制定。

```
Status（可选）：对象状态，用来描述对象的当前状态（Current State），Status 字段通
```

- 常由 Kubernetes 的各种 Controller 根据对象的当前状态来设置并更新，用户不需要手动设置。

```
TypeMeta、ObjectMeta、Spec、Status 字段的名字是固定的。Spec 对应的结构体类
型名为格式为 <资源名>Spec，Status 对应的结构体类型名格式为 <资源名>Status。
XXXStatus 通常包含以下字段：
Phase：指示资源的当前生命周期阶段，如 Pending、Running、Succeeded、
Failed、Unknown。Phase 字段很常用，但也有很多资源的 XXXStatus 中不需要
Phase 字段。Phase 字段的类型通常可以为 string，但更多的时候是自定义类型，如
XXXPhase。
ObservedGeneration：表示资源最后一次变化的版本，控制器用来检查该资源是否已被
```

- 响应。

```
Conditions：用于提供资源当前状态的详细信息，让开发者能够更好地理解和监控资源
```

- 的健康状况。

```
XXXStatus 结构体中的 Conditions 字段是一个数组字段，在执行 PATCH 操作时，通常
采用 Merge 策略，即合并新旧资源的 Conditions 数组中的元素。为了告诉 kube-apiserver
```

合并 Condition 数组，我们打上指定的结构体标签和注释，例如：

```
   // Represents the latest available observations of a xxx's current state.
   // +optional
   // +patchMergeKey=type
   // +patchStrategy=merge
   // +listType=map
   // +listMapKey=type
   Conditions []metav1.Condition `json:"conditions,omitempty" patchStrategy:"mer
Kubernetes 中通过各类 // + 注释和结构体标签来控制代码生成器的行为。上面的 // + 注
```

释如下：

```
// +optional：表示该字段是可选的。这意味着在序列化和反序列化时，可以选择不提
```

- 供这个字段。即使在定义时没有提供这个字段，也不会导致序列化错误。

```
// +patchMergeKey=type：这是用于 patch 操作的键。它指定了当执行部分更新（如
使用 kubectl apply）时，如何识别不同的条件项。在这里，type 被用作唯一标识符，
它允许多个条件根据其 type 字段进行合并，而不是简单地替换整个条件列表。
// +patchStrategy=merge：指定了在执行部分更新（patch）时应该使用合并策略。
```

- 这意味着如果存在相同类型的条件，则现有条件将与新条件信息合并，而不是完全替换。这对于保留条件的历史状态非常重要。

```
// +listType=map：指定条件列表的类型为 map。这可以让 Kubernetes 知道如何处理
```

- 条件的序列化和反序列化，允许更灵活的数据结构。

```
// +listMapKey=type：指定 listType 的键字段。在本例中，type 字段用于作为
map 的键。这允许在序列化时通过条件的 type 字段来组织和查找条件。
```

结构体标签释义如下：

```
patchStrategy:"merge"：指定在更新时使用的处理策略，如上所述，表示将使用合并
```

- 策略。

```
patchMergeKey:"type"：指定在执行部分更新时，使用 type 字段作为识别和合并的
```

- 键。

```
除此之外，你还可以看到资源定义注释上面会有一些 // +k8s: 注释，这些注释是
```

Kubernetes code-generator 组件用来生成代码时用的。

```
上述 XXX 资源 JSON 格式的定义示例如下：
{
 "apiVersion": "example.com/v1",
 "kind": "XXX",
 "metadata": {
   "resourceVersion": "12345",
   "name": "example-xxx",
   "namespace": "default",
   "uid": "abc123-xyz456",
   "creationTimestamp": "2023-10-01T00:00:00Z"
 },
 "spec": {
   "displayName": "Example XXX",
   "description": "This is an example definition of a Kubernetes resource object
 },
 "status": {
   "phase": "Running",
   "observedGeneration": 1,
   "conditions": [
     {
       "type": "Ready",
       "status": "True",
       "lastProbeTime": "2023-10-01T00:00:00Z",
       "lastTransitionTime": "2023-10-01T00:00:00Z",
       "reason": "Initialized",
       "message": "The resource is ready."
     }
   ]
 }
}
```

最后，在定义好资源对象之后，还需要再定义一个资源的列表对象，用来表示资源的列表。列表对象定义的固定格式如下：

```
// XXXList is a list of XXX objects.
type XXXList struct {
   metav1.TypeMeta `json:",inline"`
   // Standard list metadata.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   metav1.ListMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metadat
   // Items is a list of schema objects.
   Items []XXX `json:"items" protobuf:"bytes,2,rep,name=items"`
}
值得注意的是，在 Kubernetes 中 XXX、XXXList、TypeMeta、ObjectMeta 等结构体或
```

字段的注释格式也是相似的。在你定义资源的时候，可以参考其它资源对象的注释来写。

## 课程总结

在 Kubernetes 中，设计一条 REST API 的第一步是先用 Go 结构体“声明”资源对象。所有对象都遵循统一的四段式格式：

- TypeMeta（API 组、版本、Kind）

- ObjectMeta（名称、命名空间、标签等）

- Spec（期望状态）

```
可选的 Status（当前状态，含 Phase、ObservedGeneration、Conditions 等常见字
```

- 段）

Kubernetes 资源对象的格式如下：

```
type XXX struct {
   metav1.TypeMeta `json:",inline"`
   // Standard object's metadata.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   metav1.ObjectMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metad
   // Spec defines the behavior of the XXX.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   Spec XXXSpec `json:"spec,omitempty" protobuf:"bytes,2,opt,name=spec"`
   // Status describes the current status of a XXX.
   // More info: https://git.k8s.io/community/contributors/devel/sig-architectur
   // +optional
   Status XXXStatus `json:"status,omitempty" protobuf:"bytes,3,opt,name=status"`
}
```

也就是说，一个 Kubernetes 资源对象一定要具有类型定义（资源组、资源版本、资源类型）、和元数据定义。而且，所有的 Kubernetes 资源对象都有统一的资源元数据。

```
另外，Kubernetes 资源对象还需要包含 Spec 字段，用来定义对象的期望状态。绝大部分的
Kubernetes 资源对象还需要一个 Status 状态字段，用来描述对象的当前状态。
借助 // +k8s: 及 Patch 注解，code‑generator 能自动为这些结构体生成 DeepCopy、客户
```

端、合并策略等配套代码，同时据此派生 API 路径和请求方法。每个资源还需提供对应的

```
XXXList 列表对象（TypeMeta+ListMeta+Items）。正是这套标准化模型，保证了
```

Kubernetes API 的一致性、可自动化生成及快速迭代。

## 课后练习

1. Kubernetes 标准化资源定义格式带来了什么价值？

2. 在你的业务开发中，能否将 REST 资源定义成 Kubernetes 的标准化资源格式？这种方式会给业务引入什么价值？

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
