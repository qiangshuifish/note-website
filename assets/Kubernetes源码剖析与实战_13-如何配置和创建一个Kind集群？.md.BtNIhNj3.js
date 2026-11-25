import{_ as n,H as a,f as e,i}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"13-如何配置和创建一个Kind集群？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Kind 介绍","slug":"kind-介绍","link":"#kind-介绍","children":[]},{"level":2,"title":"Kind 命令安装","slug":"kind-命令安装","link":"#kind-命令安装","children":[]},{"level":2,"title":"Kind 集群配置","slug":"kind-集群配置","link":"#kind-集群配置","children":[{"level":3,"title":"端口映射","slug":"端口映射","link":"#端口映射","children":[]},{"level":3,"title":"暴露 kube-apiserver","slug":"暴露-kube-apiserver","link":"#暴露-kube-apiserver","children":[]},{"level":3,"title":"启用 Feature Gates","slug":"启用-feature-gates","link":"#启用-feature-gates","children":[]}]},{"level":2,"title":"Kind 常用操作","slug":"kind-常用操作","link":"#kind-常用操作","children":[{"level":3,"title":"创建 Kind 集群","slug":"创建-kind-集群","link":"#创建-kind-集群","children":[]},{"level":3,"title":"查询 Kind 集群","slug":"查询-kind-集群","link":"#查询-kind-集群","children":[]},{"level":3,"title":"导出 Kind 集群的 kubeconfig 文件","slug":"导出-kind-集群的-kubeconfig-文件","link":"#导出-kind-集群的-kubeconfig-文件","children":[]},{"level":3,"title":"导入镜像到 Kind 节点容器","slug":"导入镜像到-kind-节点容器","link":"#导入镜像到-kind-节点容器","children":[]},{"level":3,"title":"删除集群","slug":"删除集群","link":"#删除集群","children":[]}]},{"level":2,"title":"课程总结","slug":"课程总结","link":"#课程总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Kubernetes源码剖析与实战/13-如何配置和创建一个Kind集群？.md","filePath":"Kubernetes源码剖析与实战/13-如何配置和创建一个Kind集群？.md","lastUpdated":1795530017000}'),p={name:"Kubernetes源码剖析与实战/13-如何配置和创建一个Kind集群？.md"};function l(t,s,d,o,c,r){return a(),e("div",null,[...s[0]||(s[0]=[i(`<h1 id="_13-如何配置和创建一个kind集群" tabindex="-1">13-如何配置和创建一个Kind集群？ <a class="header-anchor" href="#_13-如何配置和创建一个kind集群" aria-label="Permalink to &quot;13-如何配置和创建一个Kind集群？&quot;">​</a></h1><p>你好，我是孔令飞。</p><p>因为在学习本课程的过程中，需要频繁地创建、删除用于开发、测试的 Kind 集群。所以，本节课，我们详细介绍下 Kind，带你熟练掌握 Kind 工具，方便以后的学习。</p><p>注意，本节课介绍的 Kind 命令版本为 v0.19.0。其他版本的命令可能会有变更，例如v0.20.0、v0.21.0，在使用时需要你根据版本自行适配。另外，在正式开始之前需要你在宿主机上安装好 Docker。</p><h2 id="kind-介绍" tabindex="-1">Kind 介绍 <a class="header-anchor" href="#kind-介绍" aria-label="Permalink to &quot;Kind 介绍&quot;">​</a></h2><p>我们先来回忆一下 Kind 的概念，它是一个 Kubernetes SIG 项目，用来快速在本地创建一个开发、测试用的 Kubernetes 集群。Kind 使用 Docker/Podman 驱动，Kubernetes 组件都部署在用 kindest/node 镜像启动的 Docker 容器中。</p><p>Kind 的核心特性如下：</p><ul><li><p>支持多个 Kubernetes 节点（支持集群 HA，其实就是创建多个 control-plane 类型的 Node节点）。</p></li><li><p>创建的 Kubernetes 集群经过 Kubernetes 一致性认证。</p></li><li><p>支持 Linux、macOS 和 Windows。</p></li><li><p>因为 Kind 足够轻量，所以 Kind 也大量使用于 CI 流程中的集群创建。</p></li></ul><p>Kind 架构如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/13-%25E5%25A6%2582%25E4%25BD%2595%25E9%2585%258D%25E7%25BD%25AE%25E5%2592%258C%25E5%2588%259B%25E5%25BB%25BA%25E4%25B8%2580%25E4%25B8%25AAKind%25E9%259B%2586%25E7%25BE%25A4%25EF%25BC%259F/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/13-%25E5%25A6%2582%25E4%25BD%2595%25E9%2585%258D%25E7%25BD%25AE%25E5%2592%258C%25E5%2588%259B%25E5%25BB%25BA%25E4%25B8%2580%25E4%25B8%25AAKind%25E9%259B%2586%25E7%25BE%25A4%25EF%25BC%259F/1.png" alt=""></a></p><ul><li>图片来源于网络</li></ul><p>结合上图我们一起来说说 Kind 的工作流程。首先，在宿主机上，要安装一个 Kind 命令行工具，用来完成所有的集群管理，例如创建、查询、删除、加载镜像、导出 kubeconfig 文件等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>执行 kind create cluster -n test-k8s 命令后，Kind 工具会下载 kindest/node 镜</span></span></code></pre></div><p>像，并使用该镜像启动一个或多个 Docker 容器（可以通过配置文件来配置启动几个 Docker容器），这些容器就作为 Kubernetes 集群的 Node 节点，也即上图中的 “Node” Container。</p><p>在节点容器中，会根据节点的类型启动对应的 Kubernetes 组件。Kind 集群有两类节点：</p><ul><li><p>control-plane 节点：作为 Kubernetes 的 master 节点，部署 master 组件，例如：kube-apiserver、kube-controller-manager、kube-scheduler、etcd、coredns、kubelet、kube-proxy 组件。</p></li><li><p>worker 节点：作为 Kubernetes 工作节点，用来运行 Kubernetes Pod。worker 节点会部署kubelet、kube-proxy。当然，如果我们在测试集群中创建 Deployment、StatefulSet 等Workload 类型的资源，还会在 worker 节点中创建 Kubernetes Pod。</p></li></ul><p>在使用 kindest/node 创建 Kubernetes 节点容器时，kindest/node 镜像启动时，会启动systemd 服务作为 Linux 1 号进程。之后，会启动 containerd、kubelet systemd 服务。因为节点容器中运行了 containerd，所以我们就可以在节点容器中继续创建容器（其实就是Kubernetes Pod）。</p><p>其他 Kubernetes 组件，例如：kube-apiserver、kube-controller-manager、kube-scheduler、etcd 作为静态 Pod，由 kubelet 进程直接启动和管理。静态 Pod 的 YAML 文件存放在节点容器中的 /etc/kubernetes/manifests 目录下。</p><h2 id="kind-命令安装" tabindex="-1">Kind 命令安装 <a class="header-anchor" href="#kind-命令安装" aria-label="Permalink to &quot;Kind 命令安装&quot;">​</a></h2><p>当前 Kind 最新版本为 v0.22.0，我在测试这个版本的过程中，会遇到创建集群失败的问题。所以，这里我安装的是我测试过的 v0.19.0 版本。如果你感兴趣，也可以尝试升级到 v0.22.0 版本自行创建集群测试。</p><p>Kind 官网提供了多种安装方式，详细的介绍你可以点击 Quick Start-Installation 这个链接查看。这里我选择了与平台无关的二进制文件安装方式，安装命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ [ $(uname -m) = x86_64 ] &amp;&amp; curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.19.0</span></span>
<span class="line"><span>$ chmod +x ./kind</span></span>
<span class="line"><span>$ mv kind $HOME/bin</span></span>
<span class="line"><span>$ kind completion bash &gt; \${HOME}/.kind-completion.bash # 配置 kind bash 自动补全</span></span>
<span class="line"><span>$ \${ONEX_ROOT}/scripts/add-completion.sh kind bash # 需要 clone onex 项目，并配置 on</span></span>
<span class="line"><span>$ kind version # 如果 kind version 能够输出 Kind 版本号，说明创建成功</span></span>
<span class="line"><span>kind v0.19.0 go1.20.4 linux/amd64</span></span></code></pre></div><p>如果你克隆了 onex 项目仓库，还可以选择执行以下 Makefile 规则来快速安装：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ make tools.install.kind</span></span></code></pre></div><h2 id="kind-集群配置" tabindex="-1">Kind 集群配置 <a class="header-anchor" href="#kind-集群配置" aria-label="Permalink to &quot;Kind 集群配置&quot;">​</a></h2><p>Kind 提供了丰富的配置选项，有集群级别的，也有节点级别的。Kind 缺省使用 kubeadm 创建和配置 Kubernetes 集群，通过 Kubeadm Config Patches 机制提供了针对 Kubeadm 的各种配置。关于 Kind 配置的详情你可以参考其官方文档：Configuration。</p><p>一般的开源项目或工具都会在项目仓库中存放一个示例配置文件，但是 Kind 仓库没有。所以这里我阅读了 Configuration 文档后，将所有的配置项整理到一个配置文件中，并给你解释了每个配置项的作用。所有的配置项内容及释义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 提示：本 Kind 集群配置，可在 Kind v0.19.0 版本下正常工作</span></span>
<span class="line"><span>kind: Cluster</span></span>
<span class="line"><span>apiVersion: kind.x-k8s.io/v1alpha4</span></span>
<span class="line"><span># Kind 集群名字</span></span>
<span class="line"><span>name: onex</span></span>
<span class="line"><span>featureGates:</span></span>
<span class="line"><span> # 开启 CSIMigration 特性</span></span>
<span class="line"><span> # Kubernetes 支持的所有 FeatureGate 请参考 https://kubernetes.io/docs/reference/co</span></span>
<span class="line"><span> # &quot;CSIMigration&quot;: true</span></span>
<span class="line"><span># 用来配置 kube-apiserver 启动参数。所有的启动参数可参考 https://kubernetes.io/docs/ref</span></span>
<span class="line"><span>runtimeConfig:</span></span>
<span class="line"><span> &quot;api/alpha&quot;: &quot;false&quot;</span></span>
<span class="line"><span>networking:</span></span>
<span class="line"><span> # 绑定到宿主机上的地址，如果需要外部访问请设置为宿主机 IP</span></span>
<span class="line"><span> # 注意：这里需要设置为你的宿主机 IP 地址</span></span>
<span class="line"><span> apiServerAddress: 10.37.83.200</span></span>
<span class="line"><span> # 绑定到宿主机上的端口，如果建多个集群或者宿主机已经占用需要修改为不同的端口</span></span>
<span class="line"><span> apiServerPort: 16443</span></span>
<span class="line"><span> # 设置 Pod 子网</span></span>
<span class="line"><span> # 默认情况下，Kind 对 IPv4 使用 10.244.0.0/16 pod 子网，对 IPv6 使用 fd00:10:244::/5</span></span>
<span class="line"><span> podSubnet: &quot;10.244.0.0/16&quot;</span></span>
<span class="line"><span> # 设置 Kubernetes Service 子网</span></span>
<span class="line"><span> # 默认情况下，Kind 对 IPv4 使用 10.96.0.0/16 服务子网，对 IPv6 使用 fd00:10:96::/112</span></span>
<span class="line"><span> serviceSubnet: &quot;10.96.0.0/12&quot;</span></span>
<span class="line"><span> # 设置集群网络模式为双栈，ipFamily 可用取值为 dual, ipv6, ipv4</span></span>
<span class="line"><span> ipFamily: dual</span></span>
<span class="line"><span> # 是否使用默认的 CNI 插件 kindnet</span></span>
<span class="line"><span> # 你可以禁用默认的 CNI 插件，安装自己的 CNI 插件，这里我们使用默认的 CNI 插件</span></span>
<span class="line"><span> disableDefaultCNI: false</span></span>
<span class="line"><span> # kube-proxy 使用的网络模式，none 表示不需要 kube-proxy 组件</span></span>
<span class="line"><span> kubeProxyMode: &quot;ipvs&quot;</span></span>
<span class="line"><span># kubeadm 配置设置，以 Patch 方式来设置</span></span>
<span class="line"><span># 可以设置 InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, Kubele</span></span>
<span class="line"><span># 详细的 kubeadm 配置见：https://kubernetes.io/docs/setup/production-environment/too</span></span>
<span class="line"><span>kubeadmConfigPatches:</span></span>
<span class="line"><span>- |</span></span>
<span class="line"><span> kind: ClusterConfiguration</span></span>
<span class="line"><span> networking:</span></span>
<span class="line"><span>   dnsDomain: &quot;onex.io&quot;</span></span>
<span class="line"><span>- |</span></span>
<span class="line"><span> apiVersion: kubelet.config.k8s.io/v1beta1</span></span>
<span class="line"><span> kind: KubeletConfiguration</span></span>
<span class="line"><span> # 开启 imageGC，防止磁盘空间被 image 占满</span></span>
<span class="line"><span> # imageGCHighThresholdPercent: 80 # NOTICE: 该选项慎开启，可能导致创建多 worker 节点</span></span>
<span class="line"><span> #evictionHard: # 不要打开，否则 nodes 可能 NotReady</span></span>
<span class="line"><span> #nodefs.available: &quot;0%&quot;</span></span>
<span class="line"><span> #nodefs.inodesFree: &quot;0%&quot;</span></span>
<span class="line"><span> #imagefs.available: &quot;90%&quot;</span></span>
<span class="line"><span>nodes:</span></span>
<span class="line"><span> # master 节点列表。一个列表元素，代表一个 Kubernetes 节点</span></span>
<span class="line"><span>- role: control-plane</span></span>
<span class="line"><span> # 自定义节点使用的镜像及版本</span></span>
<span class="line"><span> image: kindest/node:v1.28.0@sha256:dad5a6238c5e41d7cac405fae3b5eda2ad1de6f1190f</span></span>
<span class="line"><span> kubeadmConfigPatches:</span></span>
<span class="line"><span> - |</span></span>
<span class="line"><span>   kind: ClusterConfiguration</span></span>
<span class="line"><span>   apiServer:</span></span>
<span class="line"><span>       extraArgs:</span></span>
<span class="line"><span>         # 自动创建命名空间</span></span>
<span class="line"><span>         enable-admission-plugins: NamespaceAutoProvision,NamespaceExists,Namesp</span></span>
<span class="line"><span> # 宿主机和节点文件共享挂载</span></span>
<span class="line"><span> extraMounts:</span></span>
<span class="line"><span>   # 宿主机目录</span></span>
<span class="line"><span> - hostPath: /kind/onex</span></span>
<span class="line"><span>   # 节点数据目录</span></span>
<span class="line"><span>   containerPath: /data</span></span>
<span class="line"><span>   # 是否以只读方式挂载</span></span>
<span class="line"><span>   readOnly: false</span></span>
<span class="line"><span>   # 是否重新生成 SELinux 标签</span></span>
<span class="line"><span>   selinuxRelabel: false</span></span>
<span class="line"><span>   propagation: HostToContainer</span></span>
<span class="line"><span>   # 节点端口到宿主机端口映射</span></span>
<span class="line"><span> extraPortMappings:</span></span>
<span class="line"><span>   # 节点端口 nodeport</span></span>
<span class="line"><span> - containerPort: 32080 # 对应到 traefik web.nodePort</span></span>
<span class="line"><span>   # 宿主机端口</span></span>
<span class="line"><span>   hostPort: 18080</span></span>
<span class="line"><span>   # 宿主机端口监听地址，需要外部访问设置为&quot;0.0.0.0&quot;</span></span>
<span class="line"><span>   listenAddress: &quot;0.0.0.0&quot;</span></span>
<span class="line"><span>   # 通信协议</span></span>
<span class="line"><span>   protocol: TCP</span></span>
<span class="line"><span> - containerPort: 32443 # 对应到 traefik websecure.nodePort</span></span>
<span class="line"><span>   hostPort: 18443</span></span>
<span class="line"><span>   listenAddress: &quot;0.0.0.0&quot;</span></span>
<span class="line"><span>   protocol: TCP</span></span>
<span class="line"><span># worker 节点，配置同 master 节点</span></span>
<span class="line"><span>- role: worker</span></span>
<span class="line"><span> labels:</span></span>
<span class="line"><span>   # 设置节点标签</span></span>
<span class="line"><span>   nodePool: onex</span></span>
<span class="line"><span> image: kindest/node:v1.28.0@sha256:dad5a6238c5e41d7cac405fae3b5eda2ad1de6f1190f</span></span>
<span class="line"><span>- role: worker</span></span>
<span class="line"><span> image: kindest/node:v1.28.0@sha256:dad5a6238c5e41d7cac405fae3b5eda2ad1de6f1190f</span></span>
<span class="line"><span>- role: worker</span></span>
<span class="line"><span> image: kindest/node:v1.28.0@sha256:dad5a6238c5e41d7cac405fae3b5eda2ad1de6f1190f</span></span></code></pre></div><p>上面是 Kind 支持的几乎全部的配置，其中有一些配置项可以满足一些重要的、常见的功能需求，接下来我们就要讲到。</p><h3 id="端口映射" tabindex="-1">端口映射 <a class="header-anchor" href="#端口映射" aria-label="Permalink to &quot;端口映射&quot;">​</a></h3><p>在测试、开发的过程中，我们在 Kind 集群中部署了一个 Deployment，并为该 Deployment 创建了一个 NodePort 类型的 Service，但是我们发现，在宿主机上无法访问 Service 中配置的nodePort 端口，进而访问 Pod 端口。这是因为 Service 中配置的 nodePort 是监听在Kubernetes 节点容器上的，而非宿主机。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Kind 支持 extraPortMappings 配置项，用来将宿主机的端口映射到 Kubernetes 节点容器</span></span>
<span class="line"><span>上的某个端口，可以通过 extraPortMappings 配置，来实现宿主机访问 Kubernetes 节点</span></span></code></pre></div><p>容器端口，进而访问 Kubernetes Pod 端口的目的。具体配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extraPortMappings:</span></span>
<span class="line"><span>   # 节点端口 nodeport</span></span>
<span class="line"><span> - containerPort: 32080 # 对应到 traefik web.nodePort</span></span>
<span class="line"><span>   # 宿主机端口</span></span>
<span class="line"><span>   hostPort: 18080</span></span>
<span class="line"><span>   # 宿主机端口监听地址，需要外部访问设置为&quot;0.0.0.0&quot;</span></span>
<span class="line"><span>   listenAddress: &quot;0.0.0.0&quot;</span></span>
<span class="line"><span>   # 通信协议</span></span>
<span class="line"><span>   protocol: TCP</span></span>
<span class="line"><span> - containerPort: 32443 # 对应到 traefik websecure.nodePort</span></span>
<span class="line"><span>   hostPort: 18443</span></span>
<span class="line"><span>   listenAddress: &quot;0.0.0.0&quot;</span></span>
<span class="line"><span>   protocol: TCP</span></span></code></pre></div><h3 id="暴露-kube-apiserver" tabindex="-1">暴露 kube-apiserver <a class="header-anchor" href="#暴露-kube-apiserver" aria-label="Permalink to &quot;暴露 kube-apiserver&quot;">​</a></h3><p>在测试、开发的过程中， 有时候我们可能想在 B 机器上访问 A 机器上的 Kind 集群，这时候你会发现访问不通。这是因为默认情况下，Kind 集群的 kube-apiserver 是监听在 A 机器上的lo 网络设备上的，并且监听端口也是随机的。如果你想从 B 机器上访问，就需要使 Kind 集群的 kube-apiserver 监听在可访问网络设备（如 eth0）的某个端口上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Kind 提供了 apiServerAddress 和 apiServerPort 来满足此种场景的需求，具体配置如</span></span></code></pre></div><p>下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>networking:</span></span>
<span class="line"><span> # 绑定到宿主机上的地址，如果需要外部访问请设置为宿主机 IP</span></span>
<span class="line"><span> # 注意：这里需要设置为你的宿主机 IP 地址</span></span>
<span class="line"><span> apiServerAddress: 10.37.83.200</span></span>
<span class="line"><span> # 绑定到宿主机上的端口，如果建多个集群或者宿主机已经占用需要修改为不同的端口</span></span>
<span class="line"><span> apiServerPort: 16443</span></span></code></pre></div><h3 id="启用-feature-gates" tabindex="-1">启用 Feature Gates <a class="header-anchor" href="#启用-feature-gates" aria-label="Permalink to &quot;启用 Feature Gates&quot;">​</a></h3><p>Kubernetes 支持 Feature Gates，我们可以开启或关闭 Feature Gates 来开启或关闭某些功能。Kind 也提供了开启或关闭 Feature Gates 功能的配置，具体配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>featureGates:</span></span>
<span class="line"><span> # 开启 CSIMigration 特性</span></span>
<span class="line"><span> # Kubernetes 支持的所有 FeatureGate 请参考 https://kubernetes.io/docs/reference/co</span></span>
<span class="line"><span> # &quot;CSIMigration&quot;: true</span></span></code></pre></div><h2 id="kind-常用操作" tabindex="-1">Kind 常用操作 <a class="header-anchor" href="#kind-常用操作" aria-label="Permalink to &quot;Kind 常用操作&quot;">​</a></h2><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">安装完 Kind 命令后，可以执行 kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h 来查看 Kind 工具支持的命令：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Kind 使用 Docker 容器 </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;nodes&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 创建和管理本地 Kubernetes 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Usage:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kind [command]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Available Commands:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> build       构建 Node 镜像</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> completion  为指定的 shell（bash、zsh 或 fish）输出 shell 补全代码</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      创建 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      删除 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> export      导出集群 kubeconfig 配置和集群日志</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         获取 Kind 集群列表、指定集群的 Node 列表、指定集群的 kubeconfig</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> help        打印帮助信息</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> load</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        将宿主机 Docker 镜像加载到 Kind 集群的 Node 节点</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     打印 Kind 命令行工具版本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Flags:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--help              打印帮助信息</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     --loglevel string   DEPRECATED: see -v instead</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">q, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--quiet             不输出错误到标准错误</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">v, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--verbosity int32   设置 log 日志级别</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     --version           打印 Kind 命令行工具版本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">使用 </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;kind [command] --help&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 了解更多关于命令的信息</span></span></code></pre></div><p>接下来，我会给你详细介绍下常用的 Kind 命令操作。</p><h3 id="创建-kind-集群" tabindex="-1">创建 Kind 集群 <a class="header-anchor" href="#创建-kind-集群" aria-label="Permalink to &quot;创建 Kind 集群&quot;">​</a></h3><p>可以执行以下命令快速创建一个带默认配置的 Kind 集群：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ kind create cluster -n test-k8s</span></span>
<span class="line"><span>kind create cluster 提供了一些参数，参数如下：</span></span>
<span class="line"><span>$ kind create cluster -h</span></span>
<span class="line"><span>创建一个本地测试用的 Kubernetes 集群</span></span></code></pre></div><ul><li>用法：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> kind create cluster [flags]</span></span></code></pre></div><ul><li>标志：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>     --config string       指定创建 Kind 集群时的配置文件</span></span>
<span class="line"><span> -h, --help                打印 Kind create cluster 的帮助信息</span></span>
<span class="line"><span>     --image string        指定创建 Kind 集群节点的 docker 镜像</span></span>
<span class="line"><span>     --kubeconfig string   设置创建出的 Kind 集群的 kubeconfig 文件保存路径，替代 $KUB</span></span>
<span class="line"><span> -n, --name string         设置集群名称，可以覆盖 KIND_CLUSTER_NAME、配置文件中指定的集</span></span>
<span class="line"><span>     --retain              在集群创建失败时，保留节点以进行调试</span></span>
<span class="line"><span>     --wait duration       等待，直到控制面节点准备就绪 (默认 0s)</span></span></code></pre></div><p>上面的配置文件，在使用 Kind 命令时会被经常用到。</p><h3 id="查询-kind-集群" tabindex="-1">查询 Kind 集群 <a class="header-anchor" href="#查询-kind-集群" aria-label="Permalink to &quot;查询 Kind 集群&quot;">​</a></h3><p>我们可以使用 kind get 命令查询集群信息，具体可以查询以下集群信息：</p><ul><li><p>获取 Kind 集群列表</p></li><li><p>获取指定集群的 Node 列表</p></li><li><p>获取指定集群的 kubeconfig</p></li></ul><p>具体命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 获取所有的 Kind 集群</span></span>
<span class="line"><span>$ kind get clusters</span></span>
<span class="line"><span>onex</span></span>
<span class="line"><span>test-k8s</span></span>
<span class="line"><span># 查询名为 test-k8s Kind 集群的节点列表</span></span>
<span class="line"><span>$ kind get nodes -n test-k8s</span></span>
<span class="line"><span>test-k8s-control-plane</span></span>
<span class="line"><span># 查询所有 Kind 集群的节点列表</span></span>
<span class="line"><span>$ kind get nodes -A</span></span>
<span class="line"><span>onex-control-plane</span></span>
<span class="line"><span>onex-worker</span></span>
<span class="line"><span>onex-worker3</span></span>
<span class="line"><span>onex-worker2</span></span>
<span class="line"><span>test-k8s-control-plane</span></span>
<span class="line"><span># 获取名为 test-k8s Kind 集群的 kubeconfig 文件内容</span></span>
<span class="line"><span>$ kind get kubeconfig -n test-k8s</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>clusters:</span></span>
<span class="line"><span>- cluster:</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>kind get clusters 命令在实际开发中最经常被用到。其他查询命令使用较少。</span></span></code></pre></div><h3 id="导出-kind-集群的-kubeconfig-文件" tabindex="-1">导出 Kind 集群的 kubeconfig 文件 <a class="header-anchor" href="#导出-kind-集群的-kubeconfig-文件" aria-label="Permalink to &quot;导出 Kind 集群的 kubeconfig 文件&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>使用 kind export 命令可以导出集群的 kubeconfig 文件和日志，具体命令如下：</span></span>
<span class="line"><span># 导出名为 test-k8s Kind 集群的 kubeconfig，并保存到 /tmp/test-k8s 文件中</span></span>
<span class="line"><span>$ kind export kubeconfig -n test-k8s --kubeconfig /tmp/test-k8s</span></span>
<span class="line"><span>Set kubectl context to &quot;kind-test-k8s&quot;</span></span>
<span class="line"><span># 导出名为 test-k8s Kind 集群的日志到 test-k8s-log 目录中</span></span>
<span class="line"><span>$ kind export logs -n test-k8s test-k8s-log</span></span>
<span class="line"><span>Exporting logs for cluster &quot;test-k8s&quot; to:</span></span>
<span class="line"><span>test-k8s-log</span></span>
<span class="line"><span>kind export logs 命令会将我们需要排障用的各类日志，例如：Docker 和 Kind 的版本、</span></span></code></pre></div><p>kubelet 日志、containerd 日志、标准输出、镜像列表、journald 日志、容器日志等导出到指定的目录中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kind export kubeconfig、kind export logs 2 个命令，在测试开发中经常用到。</span></span></code></pre></div><h3 id="导入镜像到-kind-节点容器" tabindex="-1">导入镜像到 Kind 节点容器 <a class="header-anchor" href="#导入镜像到-kind-节点容器" aria-label="Permalink to &quot;导入镜像到 Kind 节点容器&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在 Kubernetes 开发中，我们通常会在开发机上使用 docker build 命令构建需要测试的组</span></span>
<span class="line"><span>件镜像，例如：ccr.ccs.tencentyun.com/superproj/onex-usercenter-</span></span>
<span class="line"><span>amd64:v0.1.0。构建的镜像保存在宿主机上，并没有保存在 Kubernetes 节点容器中。我们</span></span></code></pre></div><p>在节点容器中创建 Pod 加载的镜像是节点容器中的镜像。所以，我们还需要将宿主机上的Docker 镜像加载到节点容器中。</p><p>加载命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 将 ccr.ccs.tencentyun.com/superproj/onex-usercenter-amd64:v0.1.0 镜像加载到名为 on</span></span>
<span class="line"><span>$ kind load docker-image --name onex ccr.ccs.tencentyun.com/superproj/onex-userce</span></span>
<span class="line"><span>上述命令会将指定的镜像加载到所有的 Kind 集群节点中，kind load docker-image 还提</span></span>
<span class="line"><span>供了 --nodes 参数，该参数可以将镜像加载到指定的节点容器中（逗号分裂，例如 --</span></span>
<span class="line"><span>nodes onex-worker,onex-worker2），例如：</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ kind load docker-image --name onex --nodes onex-worker,onex-worker2 ccr.ccs.ten</span></span></code></pre></div><h3 id="删除集群" tabindex="-1">删除集群 <a class="header-anchor" href="#删除集群" aria-label="Permalink to &quot;删除集群&quot;">​</a></h3><p>最后，我们还可以执行以下命令来删除一个或多个 Kind 集群：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 删除名为 onex 的 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cluster </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n onex</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 删除所有的 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clusters </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">A</span></span></code></pre></div><h2 id="课程总结" tabindex="-1">课程总结 <a class="header-anchor" href="#课程总结" aria-label="Permalink to &quot;课程总结&quot;">​</a></h2><p>本节课详细介绍了 Kind 工具的安装方法、配置项和常用的操作命令。在日常开发中，用得最多的命令如下：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cluster </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n onex # 创建名为 onex 的 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cluster </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--config kind-onex.yaml # 指定配置文件创建 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clusters # 获取 Kind 集群列表</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cluster </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n onex # 删除名为 onex 的 Kind 集群</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kind export kubeconfig </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n onex </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--kubeconfig /tmp/onex-config # 导出名为 onex Kind 集</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kind </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">load</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> docker</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-image</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n onex </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ccr</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ccs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">tencentyun</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">com</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">superproj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">onex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usercenter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">a</span></span></code></pre></div><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>如果你感兴趣，可以调研下 Kind 集群中 control-plane 节点上的 kube-proxy、coredns 进程是如何启动的。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在本节课中，我们介绍了使用 kind load docker-image 命令将宿主机镜像导入到</span></span>
<span class="line"><span>Kind 集群节点容器中的方法。其实还可以使用 kind load image-archive 来导入，请</span></span>
<span class="line"><span>你试着使用 kind load image-archive 命令导入一个测试镜像到节点容器中。</span></span></code></pre></div><p>欢迎你在留言区与我交流讨论，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！</p>`,78)])])}const u=n(p,[["render",l]]);export{h as __pageData,u as default};
