# 42 | 组件配置：Kubernetes组件配置开发实战

你好，我是孔令飞。

上一节课，我介绍了 Kubernetes 在配置内置组件时遇到的痛点及期望，以及为了解决这些痛点而开发的组件配置功能的一些实现方式。本节课，我再来介绍具体应该如何编写代码，从而让一个组件支持通过配置文件的方式来配置。

为了方便理解，我将通过介绍迁移 kube-proxy 命令行 Flag 到组件配置时的开发步骤和开发内容，为你介绍如何编码实现 Kubernetes 社区所期望的组件配置能力。

## Kubernetes 组件配置迁移概况

从 Kubernetes v1.10 开始，kubelet 正逐步从命令行标识迁移到版本配置文件，而且已经转换成 beta 版本（已支持动态 kubelet 配置）。为了支持这一特性，现有很多 kubelet 命令行标识已弃用或待删除，且在 v1.12 中， kubelet 组件版本配置文件特性已 GA。此外，kube-proxy组件可以说已有 GA 版本的配置文件特性，这可从 local-up 脚本启动 kube-proxy 组件得到佐证。在 Kubernetes v1.12 周期中，社区已将 kube-scheduler、kube-controller-manager、kube-apiserver 组件迁移为配置文件管理模式。社区将在 Kubernetes v1.13 周期重点推动功能稳定性。

Kubernetes 社区在迁移命令行 Flag 时，会将已经迁移的 Flag 从组件的命令行 Flag 列表中移除，以此促使 Kubernetes 开发 / 运维人员使用新的配置方式来配置组件。

## 命令行 Flag 迁移到组件配置开发实战

接下来，我就以 kube-proxy 组件为例，具体介绍下如何通过编码将命令行 Flag 迁移到组件配置。通过学习这个示例，也希望你未来能够为自己或者其他 Kubernetes 组件适配一套版本化的组件配置功能。

要将命令行 Flag 迁移到组件配置，可通过以下几步来实现：

1. 定义组件配置 API

2. 编写配置项校验、版本转换、默认值设置函数

3. 代码生成

4. 指定读取配置的命令行 Flag

5. 编写组件配置 YAML 文件

6. 启动组件并指定组件配置文件

接下来，我们一一来看。

### 步骤 1：定义组件配置 API

定义组件配置 API 的方法跟定义 Kubernetes 其他内置资源的方式比较一致。首先，我们要根据命名规范指定 kube-proxy 组件配置 API 组和 Kind 的名字。根据命名规范可分别指定名字：

```
配置 API 资源组名字：kubeproxy.config.k8s.io/v1alpha1。
配置 API 资源类型名字：KubeProxyConfiguration。
```

接着，定义配置 API 的版本化。kube-proxy 的配置 API 版本化定义位于staging/src/k8s.io/kube-proxy/config/v1alpha1/types.go 文件中，资源定义如下：

```
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
// KubeProxyConfiguration contains everything necessary to configure the
// Kubernetes proxy server.
type KubeProxyConfiguration struct {
   metav1.TypeMeta `json:",inline"`
   // featureGates is a map of feature names to bools that enable or disable alp
   FeatureGates map[string]bool `json:"featureGates,omitempty"`
   // clientConnection specifies the kubeconfig file and client connection setti
   // server to use when communicating with the apiserver.
   ClientConnection componentbaseconfigv1alpha1.ClientConnectionConfiguration `j
   // logging specifies the options of logging.
   // Refer to [Logs Options](https://github.com/kubernetes/component-base/blob/
   // for more information.
   Logging logsapi.LoggingConfiguration `json:"logging,omitempty"`
   // hostnameOverride, if non-empty, will be used as the name of the Node that
   // kube-proxy is running on. If unset, the node name is assumed to be the sam
   // the node's hostname.
   HostnameOverride string `json:"hostnameOverride"`
   // bindAddress can be used to override kube-proxy's idea of what its node's
   // primary IP is. Note that the name is a historical artifact, and kube-proxy
   // not actually bind any sockets to this IP.
   BindAddress string `json:"bindAddress"`
   // healthzBindAddress is the IP address and port for the health check server
   // serve on, defaulting to "0.0.0.0:10256" (if bindAddress is unset or IPv4),
   // "[::]:10256" (if bindAddress is IPv6).
   HealthzBindAddress string `json:"healthzBindAddress"`
   // metricsBindAddress is the IP address and port for the metrics server to se
   // on, defaulting to "127.0.0.1:10249" (if bindAddress is unset or IPv4), or
   // "[::1]:10249" (if bindAddress is IPv6). (Set to "0.0.0.0:10249" / "[::]:10
   // to bind on all interfaces.)
   MetricsBindAddress string `json:"metricsBindAddress"`
   // bindAddressHardFail, if true, tells kube-proxy to treat failure to bind to
   // port as fatal and exit
   BindAddressHardFail bool `json:"bindAddressHardFail"`
   // enableProfiling enables profiling via web interface on /debug/pprof handle
   // Profiling handlers will be handled by metrics server.
   EnableProfiling bool `json:"enableProfiling"`
   // showHiddenMetricsForVersion is the version for which you want to show hidd
   ShowHiddenMetricsForVersion string `json:"showHiddenMetricsForVersion"`
   // mode specifies which proxy mode to use.
   Mode ProxyMode `json:"mode"`
   // iptables contains iptables-related configuration options.
   IPTables KubeProxyIPTablesConfiguration `json:"iptables"`
   // ipvs contains ipvs-related configuration options.
   IPVS KubeProxyIPVSConfiguration `json:"ipvs"`
   // nftables contains nftables-related configuration options.
   NFTables KubeProxyNFTablesConfiguration `json:"nftables"`
   // winkernel contains winkernel-related configuration options.
   Winkernel KubeProxyWinkernelConfiguration `json:"winkernel"`
   // detectLocalMode determines mode to use for detecting local traffic, defaul
   DetectLocalMode LocalMode `json:"detectLocalMode"`
   // detectLocal contains optional configuration settings related to DetectLoca
   DetectLocal DetectLocalConfiguration `json:"detectLocal"`
   // clusterCIDR is the CIDR range of the pods in the cluster. (For dual-stack
   // clusters, this can be a comma-separated dual-stack pair of CIDR ranges.).
   // DetectLocalMode is set to ClusterCIDR, kube-proxy will consider
   // traffic to be local if its source IP is in this range. (Otherwise it is no
   // used.)
   ClusterCIDR string `json:"clusterCIDR"`
   // nodePortAddresses is a list of CIDR ranges that contain valid node IPs, or
   // alternatively, the single string 'primary'. If set to a list of CIDRs,
   // connections to NodePort services will only be accepted on node IPs in one
   // the indicated ranges. If set to 'primary', NodePort services will only be
   // accepted on the node's primary IPv4 and/or IPv6 address according to the N
   // object. If unset, NodePort connections will be accepted on all local IPs.
   NodePortAddresses []string `json:"nodePortAddresses"`
   // oomScoreAdj is the oom-score-adj value for kube-proxy process. Values must
   // the range [-1000, 1000]
   OOMScoreAdj *int32 `json:"oomScoreAdj"`
   // conntrack contains conntrack-related configuration options.
   Conntrack KubeProxyConntrackConfiguration `json:"conntrack"`
   // configSyncPeriod is how often configuration from the apiserver is refreshe
   // than 0.
   ConfigSyncPeriod metav1.Duration `json:"configSyncPeriod"`
   // portRange was previously used to configure the userspace proxy, but is now
   PortRange string `json:"portRange"`
   // windowsRunAsService, if true, enables Windows service control manager API
   WindowsRunAsService bool `json:"windowsRunAsService,omitempty"`
}
```

接着，需要添加 Kubernetes 代码生成注释。既然组件配置 API 跟 Kuberentes 资源 API 机制

```
保持一致，那就也需要生产 DeepCopy 方法，所以，需要在 KubeProxyConfiguration 结
构体定义上面添加 // +k8s:deepcopy-
gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object 注释：
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
// KubeProxyConfiguration contains everything necessary to configure the
// Kubernetes proxy server.
type KubeProxyConfiguration struct {
   ...
}
```

还要在 staging/src/k8s.io/kube-proxy/config/v1alpha1/doc.go 文件中添加以下注释：

```
// +k8s:deepcopy-gen=package
// +k8s:openapi-gen=true
// +groupName=kubeproxy.config.k8s.io
package v1alpha1 // import "k8s.io/kube-proxy/config/v1alpha1"
```

接着，将组件配置 API 注册到资源注册表 Scheme 中。可新建文件staging/src/k8s.io/kube-proxy/config/v1alpha1/register.go，内容如下：

```go
package v1alpha1
import (
   "k8s.io/apimachinery/pkg/runtime"
   "k8s.io/apimachinery/pkg/runtime/schema"
)
// GroupName is the group name used in this package
const GroupName = "kubeproxy.config.k8s.io"
// SchemeGroupVersion is group version used to register these objects
var SchemeGroupVersion = schema.GroupVersion{Group: GroupName, Version: "v1alpha1
var (
   // SchemeBuilder is the scheme builder with scheme init functions to run for
   SchemeBuilder = runtime.NewSchemeBuilder(addKnownTypes)
   // AddToScheme is a global function that registers this API group & version t
   AddToScheme = SchemeBuilder.AddToScheme
)
// addKnownTypes registers known types to the given scheme
func addKnownTypes(scheme *runtime.Scheme) error {
   scheme.AddKnownTypes(SchemeGroupVersion,
       &KubeProxyConfiguration{},
   )
   return nil
}
创建完上述代码后，还需要在 kube-proxy 启动前，调用 AddToScheme 函数，将版本化的组
```

件配置 API 注册到全局的资源注册表中。具体是在 cmd/kube-proxy/app/options.go 文件

```
中，调用 kubeproxyconfigv1alpha1.AddToScheme(lenientScheme) 方法来主动注
```

册的，代码段如下：

```go
// newLenientSchemeAndCodecs returns a scheme that has only v1alpha1 registered i
// it and a CodecFactory with strict decoding disabled.
func newLenientSchemeAndCodecs() (*runtime.Scheme, *serializer.CodecFactory, erro
   lenientScheme := runtime.NewScheme()
   if err := kubeproxyconfig.AddToScheme(lenientScheme); err != nil {
       return nil, nil, fmt.Errorf("failed to add kube-proxy config API to lenie
   }
   if err := kubeproxyconfigv1alpha1.AddToScheme(lenientScheme); err != nil {
       return nil, nil, fmt.Errorf("failed to add kube-proxy config v1alpha1 API
   }
   lenientCodecs := serializer.NewCodecFactory(lenientScheme, serializer.Disable
   return lenientScheme, &lenientCodecs, nil
}
```

接着，还需要添加内部资源 API 版本。新建文件 pkg/proxy/apis/config/types.go，在该文件

```
中添加 KubeProxyConfiguration 的内部版本定义：
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
// KubeProxyConfiguration contains everything necessary to configure the
// Kubernetes proxy server.
type KubeProxyConfiguration struct {
   metav1.TypeMeta
   // linux contains Linux-related configuration options.
   Linux KubeProxyLinuxConfiguration
   // windows contains Windows-related configuration options.
   Windows KubeProxyWindowsConfiguration
   // featureGates is a map of feature names to bools that enable or disable alp
   FeatureGates map[string]bool
   // clientConnection specifies the kubeconfig file and client connection setti
   // server to use when communicating with the apiserver.
   ClientConnection componentbaseconfig.ClientConnectionConfiguration
   // logging specifies the options of logging.
   // Refer to [Logs Options](https://github.com/kubernetes/component-base/blob/
   // for more information.
   Logging logsapi.LoggingConfiguration
   // hostnameOverride, if non-empty, will be used as the name of the Node that
   // kube-proxy is running on. If unset, the node name is assumed to be the sam
   // the node's hostname.
   HostnameOverride string
   // bindAddress can be used to override kube-proxy's idea of what its node's
   // primary IP is. Note that the name is a historical artifact, and kube-proxy
   // not actually bind any sockets to this IP.
   BindAddress string
   // healthzBindAddress is the IP address and port for the health check server
   // serve on, defaulting to "0.0.0.0:10256" (if bindAddress is unset or IPv4),
   // "[::]:10256" (if bindAddress is IPv6).
   HealthzBindAddress string
   // metricsBindAddress is the IP address and port for the metrics server to se
   // on, defaulting to "127.0.0.1:10249" (if bindAddress is unset or IPv4), or
   // "[::1]:10249" (if bindAddress is IPv6). (Set to "0.0.0.0:10249" / "[::]:10
   // to bind on all interfaces.)
   MetricsBindAddress string
   // bindAddressHardFail, if true, tells kube-proxy to treat failure to bind to
   // port as fatal and exit
   BindAddressHardFail bool
   // enableProfiling enables profiling via web interface on /debug/pprof handle
   // Profiling handlers will be handled by metrics server.
   EnableProfiling bool
   // showHiddenMetricsForVersion is the version for which you want to show hidd
   ShowHiddenMetricsForVersion string
   // mode specifies which proxy mode to use.
   Mode ProxyMode
   // iptables contains iptables-related configuration options.
   IPTables KubeProxyIPTablesConfiguration
   // ipvs contains ipvs-related configuration options.
   IPVS KubeProxyIPVSConfiguration
   // winkernel contains winkernel-related configuration options.
   Winkernel KubeProxyWinkernelConfiguration
   // nftables contains nftables-related configuration options.
   NFTables KubeProxyNFTablesConfiguration
   // detectLocalMode determines mode to use for detecting local traffic, defaul
   DetectLocalMode LocalMode
   // detectLocal contains optional configuration settings related to DetectLoca
   DetectLocal DetectLocalConfiguration
   // nodePortAddresses is a list of CIDR ranges that contain valid node IPs, or
   // alternatively, the single string 'primary'. If set to a list of CIDRs,
   // connections to NodePort services will only be accepted on node IPs in one
   // the indicated ranges. If set to 'primary', NodePort services will only be
   // accepted on the node's primary IPv4 and/or IPv6 address according to the N
   // object. If unset, NodePort connections will be accepted on all local IPs.
   NodePortAddresses []string
   // syncPeriod is an interval (e.g. '5s', '1m', '2h22m') indicating how freque
   // various re-synchronizing and cleanup operations are performed. Must be gre
   // than 0.
   SyncPeriod metav1.Duration
   // minSyncPeriod is the minimum period between proxier rule resyncs (e.g. '5s
   // '1m', '2h22m'). A value of 0 means every Service or EndpointSlice change w
   // result in an immediate proxier resync.
   MinSyncPeriod metav1.Duration
   // configSyncPeriod is how often configuration from the apiserver is refreshe
   // than 0.
   ConfigSyncPeriod metav1.Duration
}
```

```
同样，要记得在 API 定义注释上面添加 // +k8s:deepcopy-
gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object 注释。添加完注释之
```

后，还要将内部版本注册到全局的资源注册表中，新建 pkg/proxy/apis/config/register.go 文件，内容如下：

```go
package config
import (
   "k8s.io/apimachinery/pkg/runtime"
   "k8s.io/apimachinery/pkg/runtime/schema"
)
// GroupName is the group name used in this package
const GroupName = "kubeproxy.config.k8s.io"
// SchemeGroupVersion is group version used to register these objects
var SchemeGroupVersion = schema.GroupVersion{Group: GroupName, Version: runtime.A
var (
   // SchemeBuilder is the scheme builder with scheme init functions to run for
   SchemeBuilder = runtime.NewSchemeBuilder(addKnownTypes)
   // AddToScheme is a global function that registers this API group & version t
   AddToScheme = SchemeBuilder.AddToScheme
)
// addKnownTypes registers known types to the given scheme
func addKnownTypes(scheme *runtime.Scheme) error {
   scheme.AddKnownTypes(SchemeGroupVersion,
       &KubeProxyConfiguration{},
   )
   return nil
}
```

同样，也需要在 cmd/kube-proxy/app/options.go 文件中调用注册函数进行资源注册。

### 步骤 2：编写配置项校验、版本转换、默认值设置函数

在定义完组件配置的版本化 API 和内部 API 之后，如果有需要还得编写配置项校验函数、版本转换函数、默认值设置函数，并注册到全局的资源注册表中。

kube-proxy 组件配置 API 内置了配置项校验、版本转换、默认值设置实现。实现方式跟Kubernetes 其他资源 API 是一样的。这里，我只列出这些文件，具体实现方式可以参考对应文件内的代码。

```
其中，版本转换、默认值设置的方法，会通过生成的 zz_generated.conversion.go、
zz_generated.defaults.go 文件注册到全局的资源注册表中，供 kube-proxy 代码从资
```

源注册表中查找、调用。

首先是编写配置项校验逻辑。kube-apiserver 组件配置 API 配置项校验实现见pkg/proxy/apis/config/validation/validation.go 文件。校验函数在 cmd/kube-proxy/app/options.go 文件中被调用：

```go
// Validate validates all the required options.
func (o *Options) Validate() error {
   if errs := validation.Validate(o.config); len(errs) != 0 {
       return errs.ToAggregate()
   }
   return nil
}
Options 的 Validate 方法，在 kube-proxy 启动时被调用（见文件 cmd/kube-
```

proxy/app/server.go），调用代码如下：

```go
// NewProxyCommand creates a *cobra.Command object with default parameters
func NewProxyCommand() *cobra.Command {
   opts := NewOptions()
   cmd := &cobra.Command{
       Use: "kube-proxy",
       Long: ...,
       RunE: func(cmd *cobra.Command, args []string) error {
           ...
           if err := opts.Validate(); err != nil {
               return fmt.Errorf("failed validate: %w", err)
           }
           ...
       },
       ...
   }
   ...
   return cmd
}
```

然后是编写版本转换逻辑。kube-apiserver 组件配置 API 版本转换的函数见pkg/proxy/apis/config/v1alpha1/conversion.go 文件。

最后是编写默认值设置函数。kube-apiserver 组件配置 API 设置默认值的函数见pkg/proxy/apis/config/v1alpha1/defaults.go 文件。

### 步骤 3：代码生成

在步骤 2 中，我们已经编写完了版本校验函数、设置默认值函数，接下来还需要执行以下命令

```sql
生成 zz_generated.*.go 文件，这些文件会将上述版本函数注册到全局的资源注册表中。
另外，zz_generated.*.go 文件中也会生成默认的版本转换函数和设置默认值函数。
$ ./hack/update-codegen.sh deepcopy openapi conversions defaults # 在 Kubernetes 项
```

### 步骤 4： 指定读取配置的命令行 Flag

```
在文件 cmd/kube-proxy/app/options.go 中通过以下代码，添加一个 --config 命令行
```

Flag：

```
// AddFlags adds flags to fs and binds them to options.
func (o *Options) AddFlags(fs *pflag.FlagSet) {
   o.addOSFlags(fs)
   fs.StringVar(&o.ConfigFile, "config", o.ConfigFile, "The path to the configur
   fs.StringVar(&o.WriteConfigTo, "write-config-to", o.WriteConfigTo, "If set, w
   ...
}
AddFlags 方法会在 NewProxyCommand 函数中被调用，用来将设置的 Flag 添加到 cmd 对
```

象的 FlagSet 中：

```go
// NewProxyCommand creates a *cobra.Command object with default parameters
func NewProxyCommand() *cobra.Command {
   opts := NewOptions()
   cmd := &cobra.Command{
       Use: "kube-proxy",
       Long: ...,
       RunE: func(cmd *cobra.Command, args []string) error {
           ...
           if err := opts.Validate(); err != nil {
               return fmt.Errorf("failed validate: %w", err)
           }
           ...
           return nil
       },
       ...
   }
   fs := cmd.Flags()
   opts.AddFlags(fs)
   fs.AddGoFlagSet(goflag.CommandLine) // for --boot-id-file and --machine-id-fi
   _ = cmd.MarkFlagFilename("config", "yaml", "yml", "json")
   return cmd
}
```

### 步骤 5： 编写组件配置 YAML 文件

```
通过上面 4 步，我们开发好了 kube-proxy 的组件配置 API，并且给 kube-proxy 命令添加了 -
-config 命令行 Flag，用来指定组件配置文件。接下来，我们还要编写组件配置文件，用来
配置 kube-proxy。以下是 kube-proxy 的一个示例组件配置文件（假设保存在 kube-
proxy.yaml 文件中）：
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
clientConnection:
 kubeconfig: /etc/kubernetes/certificates/kube-proxy.kubeconfig
hostnameOverride: my-node-name
mode: iptables
conntrack:
# Skip setting sysctl value "net.netfilter.nf_conntrack_max"
 maxPerCore: 0
# Skip setting "net.netfilter.nf_conntrack_tcp_timeout_established"
 tcpEstablishedTimeout: 0s
# Skip setting "net.netfilter.nf_conntrack_tcp_timeout_close"
 tcpCloseWaitTimeout: 0s
```

### 步骤 6： 启动组件并指定组件配置文件

```
接下来，我们就可以启动 kube-proxy 命令，并指定上面的 kube-proxy.yaml 文件：
$ _output/bin/kube-proxy --v=10 --config=kube-proxy.yaml  --master="https://192.1
```

## 组件配置 API 定位文件位置

```
上面，我们操作了defaults.go、conversion.go、版本化 API 定义、内部版本 API 定义
```

等文件，它们分布于不同的目录。为了让你清晰地了解组件配置的目录结构，下面我将介绍开发组件配置 API 时的目录结构设计方法。

为了方便你清晰地了解，这里我只列出相关文件及目录结构，具体如下：

```
├── cmd
│   └── kube-proxy # 该目录包含 kube-proxy 的主要命令和应用逻辑
│       ├── app
│       │   ├── options.go # 该文件定义了Kube Proxy可配置的命令行选项和参数，包括如日志级别
│       │   └── server.go # 该文件实现Kube Proxy的核心服务器逻辑，包括启动、停止、配置和管
│       └── proxy.go
├── hack
│   └── local-up-cluster.sh # 用于在本地环境中快速启动一个Kubernetes集群，以便开发和测试，
├── pkg
│   └── proxy # 该目录包含Kube Proxy的核心功能和API
│       └── apis # kube-proxy API 定义目录
│           └── config # kube-proxy 组件配置 API 定义目录
│               ├── doc.go # 定义了包级别的 Kubernetes 代码生成注释
│               ├── register.go #  负责注册Kube Proxy的API类型到资源注册表中
│               ├── scheme
│               │   └── scheme.go # 注册kube-proxy API、版本转换、默认值设置等方法到资源
│               ├── types.go # kube-proxy 组件配置内部版本 API 定义
│               ├── v1alpha1 # 保存了自定义版本转换、默认值设置函数实现
│               │   ├── conversion.go # 实现API类型之间的转换逻辑，允许不同版本之间的兼容
│               │   ├── defaults.go # 定义API对象的默认值设置
│               │   ├── doc.go # 定义了包级别的 Kubernetes 代码生成注释
│               │   ├── register.go # 处理该API版本的注册逻辑
│               │   ├── zz_generated.conversion.go # 生成的代码，包含了类型转换实现
│               │   ├── zz_generated.deepcopy.go # 生成的代码，包含了深拷贝实现
│               │   └── zz_generated.defaults.go # 生成的代码，包含了默认值设置实现
│               ├── validation
│               │   └── validation.go # 实现对Kube Proxy配置类型的验证逻辑，确保配置的有
│               └── zz_generated.deepcopy.go # 生成的深拷贝实现文件，为Kube Proxy配置结
└── staging
   └── src
       └── k8s.io
           └── kube-proxy
               └── config
                   └── v1alpha1
                       ├── doc.go
                       ├── register.go
                       ├── types.go # kube-proxy 组件配置版本化 API 定义
                       └── zz_generated.deepcopy.go # 生成的深拷贝实现文件，为Kube P
```

这里指出一些核心文件目录：

```
staging/src/k8s.io/kube-proxy/config/v1alpha1：组件配置版本化 API 定义
```

- 目录。

```
pkg/proxy/apis/config/v1alpha1：版本转换、默认值设置代码存放目录。
pkg/proxy/apis/config：组件配置内部版本 API 定义目录。
pkg/proxy/apis/config/validation：组件配置项校验实现目录。
```

此外，OneX 项目也借鉴了 Kubernetes 的组件配置机制，例如，onex-minerset-controller

```
组件通过 MinerSetControllerConfiguration 来进行配置。具体实现见 OneX 项目根
```

目录下的 internal/controller/minerset/apis/config 目录。

## 课程总结

本节课通过 kube-proxy 组件配置功能的具体实战，为你展示了如何为一个组件开发组件配置的功能。核心步骤有 6 个：

- 定义组件配置 API 并注册到 Scheme

- 编写校验、版本转换和默认值函数

- 代码生成

- 指定配置文件命令行 Flag

- 编写 YAML 配置

- 启动组件并指定配置文件

## 课后练习

1. 思考下，kube-proxy 具体是如何开发和使用组件配置来配置组件的？

```
阅读 OneX onex-minerset-controller 组件的组件配置实现：
```

- MinerSetControllerConfiguration。

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
