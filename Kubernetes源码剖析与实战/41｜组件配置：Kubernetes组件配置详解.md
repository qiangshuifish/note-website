# 41 | 组件配置：Kubernetes组件配置详解

你好，我是孔令飞。

在 Go 项目开发中，我们通常用配置文件来配置应用，在 Kubernetes 发展初期，应用组件的配置是通过命令行选项来配置的，例如：kube-apiserver 有 164（v1.31.1 版本）个命令行选项。如果你是一个 Kubernetes 运维，要部署 kube-apiserver，这么多命令行选项的配置和维护，会是非常头痛的一件事。

Kubernetes 社区意识到用命令行选项来配置组件的各种弊端之后，开始通过配置文件的形式来配置组件。正如 Kubernetes 的其他功能特性一样，Kubernetes 通过配置文件配置组件的方式也比企业开发中单纯的加载、解析配置文件的方式要更加复杂、规范和标准化。

本节课，我就来详细介绍下 Kubernetes 社区在配置其自有组件时，遇到的一些问题、期望、思路和具体实现（组件配置，Component Config）。学习 Kubernetes 配置组件的背景、方式和实现，也可以为我们配置企业应用的组件提供参考。

## 组件配置（Component Config）介绍

Component Config 翻译过来就是组件配置，是由华为在 Kubernetes 社区 v1.12 周期重点推动的特性，并在 Kubernetes v1.12 版本进入 alpha 阶段。

所谓的组件配置，就是通过配置文件的形式来配置 Kubernetes 自有组件。但是 Kubernetes组件配置文件和我们 Go 项目开发中通常意义上的配置文件不一样，Kubernetes 组件配置支持版本化、默认值设置、配置项校验、代码生成等特性，而且更加规范和标准化。

### Kubernetes 社区为什么要引入组件？

Kubernetes 的组件，例如：kube-apiserver、kube-controller-manager、kubelet 等，在组件加入组件配置能力之前，都是通过命令行选项的方式来进行配置的。v1.31.1 版本的 kube-apiserver 有 164 个参数，你可以通过以下命令进行验证：

```
$ git clone https://github.com/kubernetes/kubernetes
$ cd kubernetes
$ make all WHAT=cmd/kube-apiserver
$ $ _output/bin/kube-apiserver -h|grep '\-\-'|wc -l
164
```

上面是 kube-apiserver 的命令行选项个数，像 kubelet、kube-controller-manager、kube-proxy 等组件，参数量也都很多。

这么多参数，开发运维人员在部署和运维这些组件的时候，需要配置大量的命令行选项，整个配置工作量很大，且后期的配置维护成本也很高。

另外，使用命令行选项配置组件还有其他一些问题。

- 命令行 Flag 是扁平的，无法合理地组织这些命令行 Flag，以便进行更好的配置、展示和说

```
明（相比之下，YAML 格式的配置文件，你可以在配置项上添加 # 注释来对配置进行说
明）。随着参数数量的增多，--help 变得无用，很难从一大堆命令行选项输出中，找出有
```

- 用的配置。

```
命令行 Flag 很难为相同组件的不同实例分配不同的值，例如：要调整 O(n) 控制器中信息
提供者的重新同步周期，需在全局命名空间中创建 O(n) 个不同标志。
```

- 更改进程的命令行选项需要重新编译组件，这在某些情况下可能不是优雅的方式。

- 命令行 Flag 不适用于配置一些敏感的信息，例如：Token、密钥之类的信息。因为进程的命令行 Flag 可以被主机 Pid 命名空间下的无特权进程查看。

- 命令行 Flag 被编译在二进制文件中，不能脱离二进制文件单独维护和进行版本化控制。

- 命令行 Flag 相较于 YAML 或 JSON 格式的配置文件来说，对一些结构化的数据支持不是很友好。

- 在程序开发中，滥用全局变量带来的问题，同样存在于全局可见的命令行 Flag 的使用上。

基于命令行 Flag 配置组件方式所带来的痛点和不能满足某些需求，Kubernetes 社区开发了组件配置机制，用来配置 Kubernetes 的各个自有组件，以便方便地管理组件的配置项并高效部署这些组件。

Kubernetes 社区对于配置组件的诸多要求，充分体现了其对项目质量和设计严谨性的严格把控。

### Kubernetes 对组件配置的需求是什么？

上面，我介绍了 Kubernetes 社区认为通过命令行 Flag 这种方式配置组件的一些不足之处。那么，Kubernetes 社区对于组件配置有哪些诉求呢？

Kubernetes 社区期望组件配置能够实现的能力如下：

- 安全：能够控制谁可以修改配置、谁能读取更敏感的配置项。

- 可管理：能够控制组件的哪个实例使用哪个配置，尤其是在实例版本不同的情况下。

- 可靠性：配置推送成功，就应该确保配置成功发布。如果配置推送失败，应该在发布初期就终止流程，尽可能回滚配置，并发出明显的警报。

- 可恢复：当组件异常时，需要能够更新配置（例如：回滚配置）。

```
可监控：开发者和程序都需要能够监控配置。例如开发者通过 /configz 这样的 JSON 接
口来监控配置；程序通过 prometheus /streamz 等接口来监控配置。
```

- 可验证：能够验证一个配置是否合法、完整。

- 可审计：能够追踪配置变更的来源。

- 可追责：配置的变更应该能够评估其对系统的影响，这些影响可通过后面的日志分析等来进行评估。

- 高可用：能够避免会造成服务中断的高频的配置变更，需要考虑组件的 SLA。

```
可扩展：能够支持向 O(10,000) 个组件分发配置。
```

- 一致性：配置应该具有统一的规范，以确保不同的配置是一致的。

- 可组合：应该能够支持配置源的组合，而不是分层 / 模板 / 继承。

- 规范化：应该避免冗余的配置项。

- 可测试：能够支持在不同的配置下测试系统。还需要能够测试配置的更改，包括变更那些需要组件重启的配置项。

- 可维护：应该避免代码为了支持配置而带来的复杂性。例如：需要避免为了支持配置项而在

```
代码中添加 一些 if ... else ... 分支，或者增加函数参数。
```

- 可演进：能够像扩展其他 API 一样扩展配置，且需要跟其他资源定义保持一致的 SLA 承诺和弃用策略。

Kubernetes 社区不需要配置能力实现上述的每一个期望点。但在某个阶段，应该根据优先级排名来实施。

### Kubernetes 中配置 / 配置项类型有哪些？

Kubernetes 组件的配置来自于以下 3 个地方：

- 命令行标志

- 序列化并存储在磁盘上的 API 类型

- 序列化并存储在 Kubernetes API 中（也即 etcd 中）的 API 类型

另外，Kubernetes 的配置选项可以分为以下几类：

- 引导类型的配置项（Bootstrap 类型）：例如 kubeconfig 和 kubeconfig 路径配置。组件的启动依赖于这些配置项，在组件启动前加载。

- 动态配置项与静态配置项：动态配置是指正常操作中会被更改的配置项；静态配置是指在后续的组件部署、发布中被更改的配置项。

```
共享配置项与独有配置项：独有配置项是每个实例所特有的配置，如 kubelet 的 --
hostname-override 配置项。
```

- Feature Gates：功能门控是默认情况下被认为不安全而被禁用的配置项。

- 请求上下文：跟某次请求有关的配置项，如请求用户。

- 环境信息：通过 Downward API 或者操作系统 API 获取的配置项，如 CPU 数量、IP 地址等。

## Kubernetes 是如何解决组件配置痛点的？

上面，我介绍了 Kubernetes 社区在配置自有组件时遇到的一些问题和期望，那么 Kubernetes又是如何解决这些问题的呢？

Kubernetes 解决这些问题的思路有以下 2 个：

1. 减少配置：通过一些方法、手段尽量避免不必要的配置项。

```
引入组件配置机制：引入了组件配置机制，其实就是内置组件支持配置文件，通过 --
config 命令行 Flag 指定配置文件路径，并加载、解析配置文件。
```

## 解决方法 1：减少不必要的配置项

减轻配置负担的最有效方法是尽量减少配置项。在添加一个新的配置项时，应该思考下有没有其他更合适的方案可用。Kubernetes 一些可用的配置方案如下：

- 策略对象：创建一等的 Kubernetes 资源对象来配置系统如何运行，对于请求上下文相关的配置来说尤其有用。例如：Kubernetes 的 RBAC 和 ResourceQuota 这种 Kubernetes 资源。其实还可以做更多，例如速率限制等。

```
API 功能：使用（或实现）API 的功能（例如，思考并实现初始化器，而不是 --
register-with-label）。在适当的位置允许扩展是让用户掌控的更好方法。
```

- 功能发现：编写组件去自省现有 API，以决定是否启用功能。例如，如果 App API 可用，controller-manager 应启动一个应用控制器；如果节点规范中设置了 zram，kubelet 应启用zram。

- DownwardsAPI：在选择传递新的配置选项之前，请首先使用操作系统和 Pod 环境直接披露的 API。

- 常量：如果不知道需要配置的值是否有用，可以先将值设为常量。只有在需要调整值的情况下，才提供配置选项。

- 自动调优：构建系统以结合反馈，并在现有情况下做到最好，这使系统更为稳健。

- 避免功能标志：在功能经过充分测试，并准备好发布到生产环境时再启用配置。不要将功能标志用来作为测试不充分代码的开关。

- 配置文件：与其允许单独的配置选项被修改，不如尝试将更广泛的需求纳入配置文件中。例

```
如：与其启用单个 alpha 特性，不如有一个 EnableAlpha 选项来启用所有功能。与其允
许单个控制器被修改，不如有一个 TestMode 选项，设置适合测试的广泛参数。
```

## 解决方法 2：Kubernetes 中的组件配置机制

Kubernetes 的解决方法 2 是解决命令行 Flag 配置组件问题的最有效方式，也是本节课重点要介绍的方式。

组件配置机制说简单一点，就是 Kubernetes 内置组件支持通过配置文件来读取并加载配置。

```
具体来说就是内置组件加入一个 --config 命令行 Flag，在组件启动时，指定 --
config=/path/to/kube-proxy.yaml，组件进程内会根据配置格式加载并读取配置项。
```

例如 Kubernetes 源码仓库中的 local-up-cluster.sh 脚本用来在本地启动一个开发测试的Kubernetes 集群，脚本中会配置并启动 kube-proxy 组件。在配置 kube-proxy 时用的就是组件配置的方式，代码如下：

```bash
function start_kubeproxy {
   PROXY_LOG=${LOG_DIR}/kube-proxy.log
   if [[ "${START_MODE}" != *"nokubelet"* ]]; then
     # wait for kubelet collect node information
     echo "wait kubelet ready"
     wait_node_ready
   fi
   cat <<EOF > "${TMP_DIR}"/kube-proxy.yaml
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
clientConnection:
 kubeconfig: ${CERT_DIR}/kube-proxy.kubeconfig
hostnameOverride: ${HOSTNAME_OVERRIDE}
mode: ${KUBE_PROXY_MODE}
conntrack:
# Skip setting sysctl value "net.netfilter.nf_conntrack_max"
 maxPerCore: 0
# Skip setting "net.netfilter.nf_conntrack_tcp_timeout_established"
 tcpEstablishedTimeout: 0s
# Skip setting "net.netfilter.nf_conntrack_tcp_timeout_close"
 tcpCloseWaitTimeout: 0s
EOF
   if [[ -n ${FEATURE_GATES} ]]; then
     parse_feature_gates "${FEATURE_GATES}"
   fi >>"${TMP_DIR}"/kube-proxy.yaml
   if [[ "${REUSE_CERTS}" != true ]]; then
       generate_kubeproxy_certs
   fi
   # shellcheck disable=SC2024
   sudo "${GO_OUT}/kube-proxy" \
     --v="${LOG_LEVEL}" \
     --config="${TMP_DIR}"/kube-proxy.yaml \
     --master="https://${API_HOST}:${API_SECURE_PORT}" >"${PROXY_LOG}" 2>&1 &
   PROXY_PID=$!
}
```

```
上述 Shell 脚本，在启动 kube-proxy 时，是先生成了一个 KubeProxyConfiguration 类型
的配置文件，接着在启动 kube-proxy 时，通过 --config 命令行选项来加载配置。
```

但是 Kubernetes 的组件配置机制比我们日常开发中的组件配置功能更加强大。接下来，我就来给你详细介绍下其内容和实现。

### 支持版本化的配置

Kubernetes 为每个组件创建配置 API 组，这些组在组件的源代码树中存在。每个组件都有自己的 API 组，用于配置的 API 组拥有和其他 Kubernetes 内置资源的 API 组相同机制，例如：支持代码生成、深拷贝、配置项校验、默认值设置、版本转换等。

配置 API 资源的序列化在性能要求上不需要跟其他内置资源序列化性能保持一致，因此可以支持通过反射来序列化配置，从而避免了生成一些代码（如 ugorji、conversion）。

组件配置的 API 组和类型命名需要遵循一定的规范：

```
配置 API 组命名格式：<component>.config.k8s.io。其中 <component>是组件
名，例如：kubeproxy、kubelet、kubescheduler 等。.config.k8s.io 后缀用于
```

- 将配置 API 组类型与 Kubernetes 内置的资源 API 区分开来（内置 Kubernetes 资源组，如

```
core、batch 等）。
配置 API 类型命名格式：<component>Configuration，如
KubeProxyConfiguration。
```

一般来说，每个核心内置组件都应该满足以下组件配置要求：

- 符合组件配置命名规范的组件 API 组、组件配置 API 类型。

```
确保 <component>.config.k8s.io 符合 Kubernetes 标准的 API 弃用策略、API 约定
```

- 和 API 更改策略。

```
暴露名为 --config 的命令行 Flag，该 Flag 接受包含序列化Configuration 结构文件的路
```

- 径。

- 使用 Kubernetes API 机制反序列化配置文件数据、应用默认文件和转换为内部版本以供运行时使用（一般由 API 目录下 Install 包和 Scheme 包实现）。

- 在使用 Configuration 配置前验证内部版本（一般为 API 目录下的 validate 包实现）。如果验证失败，则拒绝运行指定的配置。

- 确保第三方库（如 pflag 库）没有暴露标识。

### 支持检索配置

检索静态配置的主要机制应该是从文件反序列化。对于大多数组件（可能只有 kubelet 是个例外，参见此处），这些文件将从 configmap API 中获取，并由 kubelet 管理。该机制的可靠性依赖于 kubelet 对 Pod 依赖项的检查点。

### 支持结构化配置

将相关选项分组为不同的对象和子对象，与其写成：

```
kind: KubeProxyConfiguration
apiVersion: kubeproxy.config.k8s.io/v1beta3
ipTablesSyncPeriod: 2
ipTablesConntrackHashSize: 2
ipTablesConntrackTableSize: 2
```

应该写为：

```
kind: KubeProxyConfiguration
apiVersion: kubeproxy.config.k8s.io/v1beta3
ipTables:
 syncPeriod: 2
 conntrack:
   hashSize: 2
   tableSize: 2
```

我们应该避免将完整的配置选项绕过深层的构造模块。例如，与其使用完整的 controller-

```
manager 配置调用 NewSomethingController，不如将相关配置分组到一个子对象中，只
传递子对象。我们应该向 SomethingController 暴露尽可能少的必要配置。
```

### 支持处理不同类型的配置

刚才，我介绍了一些划分配置选项的方法，包括环境信息、请求上下文相关配置、功能门控和静态配置。对于这些配置，如果可以使用配置文件实现，则应该尽量使用配置文件的方式。

应该为不同的组件使用单独的配置对象，并从单独的配置来源（即文件）加载这些配置。例如：kubeconfig（属于引导类型的配置）不应该是主配置选项的一部分（文件路径也不应该是），每个实例配置应该与共享配置单独存储。这种方式可以使配置能够根据需要灵活组合。

### 进程内配置的表示

配置的进程内表示方式为命令行标志、可序列化的配置和运行时的配置分开定义，也即定义为不同的 Go 结构体：

- 命令行标志：命令行标志对应的 Go 结构体，应该具备足够的信息，以便组件进程在启动时能够获取到完整的配置。例如：kubeconfig 的路径、配置文件路径、用于配置 ConfigMap的命名空间和名词。

- 可序列化的配置：该结构体需要包含完整的配置项，这些配置项需要支持序列化（例如：IP

```
地址的表示形式应该为 string 而不是 net.IP）。结构体支持序列化，能够使我们对其进
```

- 行版本控制，并序列化结构体的内容到硬盘上。

- 运行时的配置：该结构体应该用最适合罪行的格式来保存数据。结构体中的字段了可以支持

```
不可序列化的类型（例如：可以具有 KubeClient 字段，可以将 IP 地址存储为 net.IP
```

- 类型）。

上述 3 种进程内配置可以进行以下转换：命令行标志结构体 -> 可序列化的配置结构体 -> 运行时的配置结构体。

这里需要注意：上面提到的配置方式只是指导原则，不是硬性规定。因此，我们应该尽可能保持配置的一致性，在有需要的情况下，也要能够灵活调整。

## 课程总结

本节课详细介绍了 Kubernetes 组件配置机制的引入背景和期望实现的功能。

早期 Kubernetes 组件依赖命令行选项配置，存在参数繁多、维护困难等弊端。为此社区开发组件配置（Component Config）机制，该机制通过配置文件管理组件，支持版本化、校验、代码生成等特性，遵循规范的 API 组命名。Kubernetes 为了解决命令行 Flag 配置组件带来的问题，提供了 2 种解决方法：

- 减少不必要的配置项

- 通过组件配置来配置内置组件

最后，我们再来梳理一遍组件配置的内容和特点：

- 支持版本化配置

- 支持检索配置

- 支持结构化配置

- 支持处理不同的配置类型

## 课后练习

1. 命令行 Flag 带来了哪些问题？

2. Kubernetes 组件配置机制优缺点有哪些？

欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！
