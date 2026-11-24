# 50 | 动手实现一个Kubernetes调度器插件

你好，我是孔令飞。

本专栏我们介绍了 Kubernetes 的 kube-scheduler 组件的源码。kube-scheduler 通过插件化的方式实现了众多的调度器插件。本节课就带你实现一个 Kubernetes 调度器插件。

## scheduler-plugins 项目介绍

kube-scheduler 虽然提供了比较丰富的原生调度策略，例如：NodeSelector、NodeResourcesBalancedAllocation、NodeAffinity 等。但是在真实的企业 Kuberentes 环境中，这些调度器插件还不能满足企业内对 Pod 调度的诉求。例如，在企业中，经常需要根据内部的 Node 真实的负载情况来调度 Pod。此时，就需要开发自己的调度策略。

为了让开发者更快捷的开发调度策略，Kubernetes 提供了 scheduler framework 框架。scheduler framework 分别在调度器的调度循环和绑定循环中提供了多个扩展点，来供开发者实现自己的调度能力。例如：Score 阶段可以实现自定义的 Node 打分策略，Filter 可以过滤掉不符合要求的 Node 节点。

为了更好的帮助开发者使用 out-of-tree 插件，Kubernetes 社区创建了 scheduler-plugins 项目。该项目集成了众多的调度插件，并且支持很轻松的开发自定义调度器插件。

本节课，我会通过一个简单的调度插件实现流程，给你介绍下编写 scheduler-plugin 的方法和流程。

## 实现自定义调度插件

Kubernetes 支持在创建 Pod 时，通过 Node Selector 来指定将 Pod 调度到的 Node 节点。例

```
如：当在 Pod YAML 中设置 nodeSelector 为 disktype: ssd 时，Pod 会被调度到具有
disktype: ssd 标签的 Node 上。
```

我们来实现一个具有类似功能的调度插件：annotationaffinity。该插件可以根据 Pod 的annotation 将 Pod 调度到具备相同 annotation 的 Node 节点上：

```
当 Pod 没有 onexstack.com/annotationaffinity annotation 时，调度插件不做任
```

- 何处理；

```
当 Pod 有 onexstack.com/annotationaffinity annotation 时，调度插件会将 Pod
```

- 调度到具有相同 annotation 的 Node 上，如果没有则调度失败。

## 调度插件实现

要想实现该调度器插件，需要实现以下 3 步：

1. 编写 plugin 的主逻辑

2. 编写 plugin 的注册逻辑

3. 编写 plugin 的配置文件

### 调度插件主逻辑

我们需要在 scheduler-plugins 项目的 pkg 目录下创建一个目录作为 annotationaffinity 插件的源码目录，并且在目录下创建 annotationaffinity.go 文件，创建后目录结构如下所示：

```
|--pkg
|  |--annotationaffinity
|     |--annotationaffinity.go
```

annotationaffinity.go 代码如下所示：

```go
package annotationaffinity
import (
   "context"
   v1 "k8s.io/api/core/v1"
   "k8s.io/apimachinery/pkg/runtime"
   "k8s.io/klog/v2"
   "k8s.io/kubernetes/pkg/scheduler/framework"
)
// 定义plugin struct
type AnnotationAffinity struct {
   handle framework.Handle
}
// New initializes a new plugin and returns it.
func New(ctx context.Context, obj runtime.Object, handle framework.Handle) (frame
   klog.V(3).Infof("create annotationaffinity plugin")
   return &AnnotationAffinity{handle: handle}, nil
}
// 用来保证 AnnotationAffinity 实现了 FilterPlugin 的所有接口
var _ = framework.FilterPlugin(&AnnotationAffinity{})
const (
   Name             = "AnnotationAffinity"
   targetAnnotation = "onexstack.com/annotationaffinity"
)
// plugin 注册和配置时使用的 Name
func (am *AnnotationAffinity) Name() string {
   return Name
}
func (am *AnnotationAffinity) Filter(ctx context.Context, state *framework.CycleS
   if pod == nil {
       return framework.NewStatus(framework.Error, "pod is nil")
   }
   klog.InfoS("annotationaffinity plugin get pod", "pod", pod.ObjectMeta.Name)
   // 检查 pod 是否有指定的 annotation
   var targetValue string = ""
   for key, value := range pod.ObjectMeta.Annotations {
       if key == targetAnnotation {
           targetValue = value
       }
   }
   // 如果 pod 没有 targetAnnotation，直接返回success
   if len(targetValue) == 0 {
       return framework.NewStatus(framework.Success)
   }
   // 如果有，则判断 pod 的 annotation 同 node annotation 是否相同，如果相同则返回 succ
   // 否则返回 UnschedulableAndUnresolvable
   node := nodeInfo.Node()
   if node == nil {
       return framework.NewStatus(framework.Error, "node not found")
   }
   for key, value := range node.ObjectMeta.Annotations {
       if key == targetAnnotation && value == targetValue {
           return framework.NewStatus(framework.Success)
       }
   }
   return framework.NewStatus(framework.UnschedulableAndUnresolvable, "annotatio
}
```

### 调度插件注册

开发完调度插件后，还需要将 annotationaffinity 插件注册到调度器中，使得调度器初始化时能够加载 annotationaffinity 插件。

添加方法很简单，在 cmd/scheduler/main.go 文件中，添加以下代码即可：

```go
package main
import (
   ...
   "sigs.k8s.io/scheduler-plugins/pkg/annotationaffinity"
   ...
)
func main() {
   // Register custom plugins to the scheduler framework.
   // Later they can consist of scheduler profile(s) and hence
   // used by various kinds of workloads.
   command := app.NewSchedulerCommand(
       ...
       app.WithPlugin(annotationaffinity.Name, annotationaffinity.New)
   )
   code := cli.Run(command)
   os.Exit(code)
}
```

在企业开发中，我们通常可以基于 scheduler-plugins 开源项目，修改其 main.go 文件，根据需要移除不要的调度器插件，并添加或者开发需要的调度器插件。

### 配置调度器

Kubernetes 为调度器提供了标准的配置方式。一个简单的调度器配置文件如下：

```
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
 kubeconfig: /home/colin/.kube/config
```

接下来，修改 KubeSchedulerConfiguration 配置，修改后的配置文件如下：

```
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
 - schedulerName: onexstack-scheduler
   plugins:
     # 根据你的需求启用/禁用插件
     # 例如：
     filter:
       enabled:
         - name: AnnotationAffinity   # 你的自定义插件
   pluginConfig:
     # 如果自定义插件需要参数，在这里配置
     # - name: AnnotationAffinity
     #   args:
     #     key: "onexstack.com/annotationaffinity"
leaderElection:
 leaderElect: false
clientConnection:
kubeconfig: /home/colin/.kube/config
```

上述调度器配置保存在 /tmp/kubescheduler.yaml 文件中。配置项释义如下：

- schedulerName：KubeSchedulerConfiguration 可以配置多个调度器策略，每个调度器策略要指定对应的调度器名称。在创建 Pod 时，可以通过 schedulerName 配置项，来指定该Pod 使用的调度器名字。为了跟原生的调度器进行区分，这里指定调度器名字为onexstack-scheduler。

- plugins：指定 framework 每个扩展点所使用的调度插件，这里配置在 filter 扩展点开启annotationaffinity 调度插件，其他调度逻辑同原有保持一致。

## 启动自定义调度器

之后，我们可以在本地启动 scheduler-plugins 项目，并测试调度效果。启动命令如下：

```
$ go run cmd/scheduler/main.go  --leader-elect=false --v=5 --kubeconfig ~/.kube/c
```

## 测试调度插件

集群中有 1 个 Node 节点，如下所示：

```
$ kubectl get nodes
NAME     STATUS   ROLES    AGE   VERSION
k8s-01   Ready    <none>   60d   v1.33.3
```

我们给 k8s-01 节点打上以下 annotation：

```
$ kubectl annotate node k8s-01 onexstack.com/annotationaffinity=ssd
```

接下来，分别调度两个 Pod：

```
第 1 个具有 onexstack.com/annotationaffinity=nossd 的 annotation。因为并没
```

- 有任何一个 Node 与之匹配，所以该 Pod 会处在 Pending 状态。

```
第 2 个不具有 onexstack.com/annotationaffinity=ssd 的 annotation，该 Pod 会
被调度到具有 onexstack.com/annotationaffinity=ssd annotation 的 Node 上，
```

- 例如：k8s-01。

```
提交第一个具有 onexstack.com/annotationaffinity=nossd annotation 的 Pod：
apiVersion: v1
kind: Pod
metadata:
 name: busybox-nossd
 labels:
   app: busybox-nossd
 annotations:
   onexstack.com/annotationaffinity: nossd
spec:
 restartPolicy: Always
 schedulerName: onexstack-scheduler
 containers:
   - name: busybox
     image: busybox
     imagePullPolicy: IfNotPresent
     command: ["sh", "-c", "sleep infinity"]
     resources:
       requests:
         cpu: "10m"
         memory: "16Mi"
       limits:
         memory: "64Mi"
```

观察其调度状态：

```
$ kubectl get pod busybox-nossd
NAME            READY   STATUS    RESTARTS   AGE
busybox-nossd   0/1     Pending   0          19s
```

观察其 Event，会有如下内容，通过事件，可知由于 annotation 不匹配导致这个 Pod 一直处于 Pending 状态：

```
Events:
 Type     Reason            Age   From                 Message
 ----     ------            ----  ----                 -------
 Warning  FailedScheduling  5s    onexstack-scheduler  0/1 nodes are available:
我们再次提交一个具有 onexstack.com/annotationaffinity=ssd annotation 的
```

Pod，YAML 如下：

```
apiVersion: v1
kind: Pod
metadata:
 name: busybox-ssd
 labels:
   app: busybox-ssd
 annotations:
   onexstack.com/annotationaffinity: ssd
spec:
 restartPolicy: Always
 schedulerName: onexstack-scheduler
 containers:
   - name: busybox
     image: busybox
     imagePullPolicy: IfNotPresent
     command: ["sh", "-c", "sleep infinity"]
     resources:
       requests:
         cpu: "10m"
         memory: "16Mi"
       limits:
         memory: "64Mi"
```

查看运行情况：

```
$ kubectl get pods bke-job-bf754bb74-c5zmg -owide
NAME                      READY   STATUS    RESTARTS   AGE   IP           NODE
busybox-ssd   1/1     Running   0          10s   10.66.6.48   k8s-01   <none>
```

可知 busybox-ssd 已经被成功调度到 k8s-01 节点上。

## 课程总结

在真实的企业环境中，Kubernetes 原生调度器提供的调度插件通常不能满足企业需求，因此需要自行开发调度器插件。目前流行的方式是，基于 scheduler-plugins 项目实现企业自己的调度器插件。本节课，我们通过一个极简的例子，介绍了如何开发一个调度器插件，并给出了测试结果。

## 课后练习

1. 请你将注解键从固定的 onexstack.com/annotationaffinity 改为可配置项，通过 pluginConfig注入并完成一次匹配测试。

2. 参考 annotationaffinity 调度器插件，实现一个 labelaffinity 调度器插件，并进行测试。

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
