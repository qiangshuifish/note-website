import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"07-进阶部署（三）：非量化版DeepSeek分布式部署方案实战","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是 Ray","slug":"什么是-ray","link":"#什么是-ray","children":[]},{"level":2,"title":"部署过程","slug":"部署过程","link":"#部署过程","children":[{"level":3,"title":"环境与模型准备","slug":"环境与模型准备","link":"#环境与模型准备","children":[]},{"level":3,"title":"Ray 集群部署","slug":"ray-集群部署","link":"#ray-集群部署","children":[]},{"level":3,"title":"在 Ray 中 部署 Vllm","slug":"在-ray-中-部署-vllm","link":"#在-ray-中-部署-vllm","children":[]}]},{"level":2,"title":"使用对话前端连接模型","slug":"使用对话前端连接模型","link":"#使用对话前端连接模型","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"DeepSeek应用开发实战/07-进阶部署（三）：非量化版DeepSeek分布式部署方案实战.md","filePath":"DeepSeek应用开发实战/07-进阶部署（三）：非量化版DeepSeek分布式部署方案实战.md","lastUpdated":1795486824000}'),i={name:"DeepSeek应用开发实战/07-进阶部署（三）：非量化版DeepSeek分布式部署方案实战.md"};function l(t,s,r,h,o,c){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_07-进阶部署-三-非量化版deepseek分布式部署方案实战" tabindex="-1">07-进阶部署（三）：非量化版DeepSeek分布式部署方案实战 <a class="header-anchor" href="#_07-进阶部署-三-非量化版deepseek分布式部署方案实战" aria-label="Permalink to &quot;07-进阶部署（三）：非量化版DeepSeek分布式部署方案实战&quot;">​</a></h1><p>你好，我是邢云阳。</p><p>在上节课中，我们学习了 DeepSeek 官方在做私有化部署时，推荐的一个工具，也就是vLLM。通过学习 vLLM，想必你对分布式部署是怎么回事儿，已经有了初步感知。</p><p>今天，我们将学习另一个组件——Ray。随后，我们将在一台配备双 GPU（A100）的Kubernetes 集群上，演示如何分布式部署 DeepSeek-R1-Distill-Llama-70B 模型。</p><h2 id="什么是-ray" tabindex="-1">什么是 Ray <a class="header-anchor" href="#什么是-ray" aria-label="Permalink to &quot;什么是 Ray&quot;">​</a></h2><p>Ray 是一个开源的分布式计算框架，旨在简化大规模机器学习和分布式应用程序的开发。它提供了高效的并行处理能力，支持数据预处理、分布式训练、超参数调优、模型服务和强化学习等任务。Ray 的核心概念包括任务（Tasks）、参与者（Actors）和对象（Objects），使得开发者能够轻松地在分布式环境中编写和执行并行代码。</p><p>如下图所示，便是程序通过 Ray 的处理之后，在三个节点上分布式运行的一个简单示意图。Ray 会将程序拆分成多片，分布到多个节点去运行。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/1.png" alt=""></a></p><p>在之前的 Kubernetes 入门课中，我们讲过 K8s 作为云原生基础设施标准所具备的优势，比如弹性伸缩、资源调度等等。</p><p>因此，由字节跳动技术团队牵头，联合 AnyScale、蚂蚁金服、微软等公司在 Ray 的基础上又开发了适配 Kubernetes 版本的 KubeRay。它采用了经典的 Operator 设计，提供了RayCluster、RayJob 和 RayService 等自定义资源定义（CRD），使得在 Kubernetes 集群上部署和管理 Ray 集群变得更加简便。通过 KubeRay，用户可以高效地管理 Ray 集群的生命周期，实现弹性伸缩、资源调度和作业管理等功能。</p><p>Ray-Operator 是 KubeRay 项目中的核心组件，负责在 Kubernetes 集群中创建和管理 Ray 集群。它通过监听 RayCluster、RayJob 和 RayService 等 CRD 的变化，自动化地处理 Ray 集群的部署、扩缩容和故障恢复等任务。Ray-Operator 使得用户能够以声明式的方式管理 Ray集群，简化了集群的运维工作。</p><p>下图是在 Kubernetes 上通过 Ray-operator 创建 Ray 集群的示意图。用户通过向 Ray-operator 提交 CR 的方式，来创建 Ray-Cluster。Ray-Cluster 包括一个 Head 和多个Worker，会分别分布在不同的 GPU 节点上。以图中所示为例，含有两个 GPU 节点，则会有一个 Head 和一个 Worker 分别在这两个节点上以 pod 形式创建。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/2.png" alt=""></a></p><p>OK，理论部分就讲到这，你只要知道什么是 Ray，以及 Ray-Cluster 的架构即可，我们把重点放在部署和使用上。</p><h2 id="部署过程" tabindex="-1">部署过程 <a class="header-anchor" href="#部署过程" aria-label="Permalink to &quot;部署过程&quot;">​</a></h2><h3 id="环境与模型准备" tabindex="-1">环境与模型准备 <a class="header-anchor" href="#环境与模型准备" aria-label="Permalink to &quot;环境与模型准备&quot;">​</a></h3><p>首先是准备 GPU 机器。上节课讲过，分布式推理有两种方案，一种是一个节点上有多张卡的情况，这种情况是通过使用 NVLink 技术，在卡之间建立高速通道，实现卡卡高速互联。第二种是多节点单（多）卡的情况，这种情况依赖节点间的高速网络。</p><p>这节课我们来测试多节点的情况，因此我在联通云上开通了一台 GPU 版本的 K8s，包含三个非 GPU 的 master 节点，以及两个 GPU 节点，每个节点上有一张 A100 卡。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/3.png" alt=""></a></p><p>这台 K8s 会通过 NVIDIA 的 GPU-operator 部署好 NVIDIA 相关的驱动等，CUDA 版本选择12.2。</p><p>机器准备好后，接下来就是模型文件的准备。对于不能科学上网的同学，模型文件可以在魔搭社区下载，链接：<a href="https://www.modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Llama-70B/files%E3%80%82%E7%94%B1%E4%BA%8E%E6%96%87%E4%BB%B6%E9%9D%9E%E5%B8%B8%E5%A4%A7%EF%BC%8C%E6%95%B4%E4%B8%AA" target="_blank" rel="noreferrer">https://www.modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Llama-70B/files。由于文件非常大，整个</a> repo 大概有 131G 左右，因此推荐你将模型下载到对象存储或者云硬盘，再通过 PV、PVC 的方式挂载。我采用的是对象存储的方式，PV、PVC 的 YAML 如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: PersistentVolume</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: deepseek</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> accessModes:</span></span>
<span class="line"><span> - ReadWriteMany</span></span>
<span class="line"><span> capacity:</span></span>
<span class="line"><span>   storage: 200Gi</span></span>
<span class="line"><span> csi:</span></span>
<span class="line"><span>   driver: ossplugin.csi.cucloud.com</span></span>
<span class="line"><span>   volumeAttributes:</span></span>
<span class="line"><span>     bucket: deepseek</span></span>
<span class="line"><span>     url: http://obs-sh-internal.cucloud.cn</span></span>
<span class="line"><span>   volumeHandle: deepseek</span></span>
<span class="line"><span> persistentVolumeReclaimPolicy: Retain</span></span>
<span class="line"><span> volumeMode: Filesystem</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: PersistentVolumeClaim</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: deepseek</span></span>
<span class="line"><span> namespace: kuberay-operator</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> accessModes:</span></span>
<span class="line"><span> - ReadWriteMany</span></span>
<span class="line"><span> resources:</span></span>
<span class="line"><span>   requests:</span></span>
<span class="line"><span>     storage: 200Gi</span></span>
<span class="line"><span> volumeMode: Filesystem</span></span>
<span class="line"><span> volumeName: deepseek</span></span></code></pre></div><p>在 ModelScope 上下载模型有多种方式，推荐使用 ModelScope Python SDK 的方式进行下载。执行以下命令即可下载。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip install modelscope</span></span>
<span class="line"><span>modelscope download --model deepseek-ai/DeepSeek-R1-Distill-Llama-70B --cache_dir</span></span></code></pre></div><p>我们可以使通过–cache_dir 指定模型文件存放目录。例如在我的命令中的 /mnt/deepseek，意思是把模型下载到 /mnt/deepseek 目录。下载完成后，上传到对象存储即可。</p><p>为了节省一遍上传的时间，我们也可以在 K8s 上创建一个带有 python 环境的 pod，然后将上文中的对象存储 PVC 挂载到 pod 中，这样就可以直接在 pod 内访问到对象存储桶，也就可以直接将模型下载到对象存储桶内了。</p><p>当然，我还有种更简便的做法。可以先把 Ray 集群拉起来，Ray 集群内就带了 python 环境，然后把对象存储 PVC 挂载到 Ray 集群的 Head 中即可。因此，你也可以和我一样，先学习后面的 Ray 部署，然后再下载模型。</p><h3 id="ray-集群部署" tabindex="-1">Ray 集群部署 <a class="header-anchor" href="#ray-集群部署" aria-label="Permalink to &quot;Ray 集群部署&quot;">​</a></h3><p>接下来看一下 Ray 的部署。我们知道通过 kuberay-operator，可以方便的部署 Ray 集群。kuberay-operator 可以使用官方提供的 Helm Chart 包进行安装。命令如下：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">helm repo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kuberay https:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ray</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">project</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">github</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">io/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kuberay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">helm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">helm repo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">update</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">helm repo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">update</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">helm install kuberay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">operator </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n kuberay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">operator kuberay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kuberay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">operator</span></span></code></pre></div><p>之后看一下 kuberay-operator 的 pod 运行状况：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kubectl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> po</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> kuberay-operator</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">NAME</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                                          READY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   STATUS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    RESTARTS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   AGE</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kuberay-operator-5c5cb548db-2q2br</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">             1/1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     Running</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          23h</span></span></code></pre></div><p>确认它处于 Running 状态就可以了。</p><p>然后我们来创建 Ray-Cluster，向 kuberay-operator 提交 CR 即可。官方将 CR 封装成了Helm Chart 包，可以通过如下命令部署。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>helm install raycluster kuberay/ray-cluster -n kuberay-operator</span></span></code></pre></div><p>但由于 CUDA 版本原因，我们需要找一个合适版本的 Ray 集群，因此我是将 Helm 包 fetch下来，将 CR yaml 提取出来，手动进行了更改。YAML 如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: ray.io/v1</span></span>
<span class="line"><span>kind: RayCluster</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> annotations:</span></span>
<span class="line"><span>   meta.helm.sh/release-name: raycluster</span></span>
<span class="line"><span>   meta.helm.sh/release-namespace: kuberay-operator</span></span>
<span class="line"><span> generation: 3</span></span>
<span class="line"><span> labels:</span></span>
<span class="line"><span>   app.kubernetes.io/instance: raycluster</span></span>
<span class="line"><span>   app.kubernetes.io/managed-by: Helm</span></span>
<span class="line"><span>   helm.sh/chart: ray-cluster-1.2.2</span></span>
<span class="line"><span> name: raycluster-kuberay</span></span>
<span class="line"><span> namespace: kuberay-operator</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> headGroupSpec:</span></span>
<span class="line"><span>   rayStartParams:</span></span>
<span class="line"><span>     dashboard-host: 0.0.0.0</span></span>
<span class="line"><span>   serviceType: ClusterIP</span></span>
<span class="line"><span>   template:</span></span>
<span class="line"><span>     metadata:</span></span>
<span class="line"><span>       annotations: {}</span></span>
<span class="line"><span>       labels:</span></span>
<span class="line"><span>         app.kubernetes.io/instance: raycluster</span></span>
<span class="line"><span>         app.kubernetes.io/managed-by: Helm</span></span>
<span class="line"><span>         helm.sh/chart: ray-cluster-1.2.2</span></span>
<span class="line"><span>     spec:</span></span>
<span class="line"><span>       affinity: {}</span></span>
<span class="line"><span>       containers:</span></span>
<span class="line"><span>       - image: docker.1ms.run/rayproject/ray-ml:2.11.0.a464b6-py310-gpu</span></span>
<span class="line"><span>         imagePullPolicy: IfNotPresent</span></span>
<span class="line"><span>         name: ray-head</span></span>
<span class="line"><span>         resources:</span></span>
<span class="line"><span>           limits:</span></span>
<span class="line"><span>             cpu: &quot;4&quot;</span></span>
<span class="line"><span>             memory: 16G</span></span>
<span class="line"><span>           requests:</span></span>
<span class="line"><span>             cpu: &quot;1&quot;</span></span>
<span class="line"><span>             memory: 2G</span></span>
<span class="line"><span>         securityContext: {}</span></span>
<span class="line"><span>         volumeMounts:</span></span>
<span class="line"><span>         - mountPath: /tmp/ray</span></span>
<span class="line"><span>           name: log-volume</span></span>
<span class="line"><span>         - mountPath: /mnt/deepseek</span></span>
<span class="line"><span>           name: deepseek-r1</span></span>
<span class="line"><span>       imagePullSecrets: []</span></span>
<span class="line"><span>       nodeSelector: {}</span></span>
<span class="line"><span>       tolerations: []</span></span>
<span class="line"><span>       volumes:</span></span>
<span class="line"><span>       - emptyDir: {}</span></span>
<span class="line"><span>         name: log-volume</span></span>
<span class="line"><span>       - name: deepseek-r1</span></span>
<span class="line"><span>         persistentVolumeClaim:</span></span>
<span class="line"><span>           claimName: deepseek</span></span>
<span class="line"><span> workerGroupSpecs:</span></span>
<span class="line"><span> - groupName: workergroup</span></span>
<span class="line"><span>   maxReplicas: 3</span></span>
<span class="line"><span>   minReplicas: 1</span></span>
<span class="line"><span>   numOfHosts: 1</span></span>
<span class="line"><span>   rayStartParams:</span></span>
<span class="line"><span>     num-gpus: &quot;1&quot;</span></span>
<span class="line"><span>   replicas: 1</span></span>
<span class="line"><span>   template:</span></span>
<span class="line"><span>     metadata:</span></span>
<span class="line"><span>       annotations: {}</span></span>
<span class="line"><span>       labels:</span></span>
<span class="line"><span>         app.kubernetes.io/instance: raycluster</span></span>
<span class="line"><span>         app.kubernetes.io/managed-by: Helm</span></span>
<span class="line"><span>         helm.sh/chart: ray-cluster-1.2.2</span></span>
<span class="line"><span>     spec:</span></span>
<span class="line"><span>       affinity: {}</span></span>
<span class="line"><span>       containers:</span></span>
<span class="line"><span>       - image: docker.1ms.run/rayproject/ray-ml:2.11.0.a464b6-py310-gpu</span></span>
<span class="line"><span>         imagePullPolicy: IfNotPresent</span></span>
<span class="line"><span>         name: ray-worker</span></span>
<span class="line"><span>         resources:</span></span>
<span class="line"><span>           limits:</span></span>
<span class="line"><span>             cpu: &quot;14&quot;</span></span>
<span class="line"><span>             memory: 60G</span></span>
<span class="line"><span>           requests:</span></span>
<span class="line"><span>             cpu: &quot;1&quot;</span></span>
<span class="line"><span>             memory: 1G</span></span>
<span class="line"><span>         securityContext: {}</span></span>
<span class="line"><span>         volumeMounts:</span></span>
<span class="line"><span>         - mountPath: /tmp/ray</span></span>
<span class="line"><span>           name: log-volume</span></span>
<span class="line"><span>         - mountPath: /mnt/deepseek</span></span>
<span class="line"><span>           name: deepseek-r1</span></span>
<span class="line"><span>       imagePullSecrets: []</span></span>
<span class="line"><span>       nodeSelector: {}</span></span>
<span class="line"><span>       tolerations: []</span></span>
<span class="line"><span>       volumes:</span></span>
<span class="line"><span>       - emptyDir: {}</span></span>
<span class="line"><span>         name: log-volume</span></span>
<span class="line"><span>       - name: deepseek-r1</span></span>
<span class="line"><span>         persistentVolumeClaim:</span></span>
<span class="line"><span>           claimName: deepseek</span></span></code></pre></div><p>首先是镜像，使用 rayproject/ray-ml:2.11.0.a464b6-py310-gpu，也就是 2.11.0 版本的 Ray 集群。之后是 Head 节点和 Worker 节点的配置。Head 节点很简单，就是将对象存储 PVC 挂载上即可。Worker 节点除了挂载 PVC 之后，还需要配置两个参数，即：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>numOfHosts: 1</span></span>
<span class="line"><span>rayStartParams:</span></span>
<span class="line"><span> num-gpus: &quot;1&quot;</span></span></code></pre></div><p>numOfHosts 代表在一个节点上部署 worker，num-gpus 代表每个节点上有一张卡。这里是个坑，很多网上的教程在只有两个 GPU 节点的情况下会把 numOfHosts 设置成 2，这是没有理解 Ray 集群的组成。实际上，Head 本身会占用一个节点，因此 Worker 创建一个即可。</p><p>配好参数后，直接 kubectl apply 拉起：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kubectl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> po</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> kuberay-operator</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -owide</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">NAME</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                                          READY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   STATUS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    RESTARTS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   AGE</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">raycluster-kuberay-head-zphgs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                 1/1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     Running</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          171m</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">raycluster-kuberay-workergroup-worker-kbsvr</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   1/1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     Running</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          171m</span></span></code></pre></div><p>状态如上所示，就说明成功了。你可以直接拿我的 YAML，针对你的集群环境做相应的修改。</p><p>此时可以进入 raycluster-kuberay-head-zphgs 内，查看 ray 集群的状态。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(base) ray@raycluster-kuberay-head-zphgs:~$ ray status</span></span>
<span class="line"><span>2025-02-13 00:54:12,571 - INFO - Note: NumExpr detected 16 cores but &quot;NUMEXPR_MAX</span></span>
<span class="line"><span>2025-02-13 00:54:12,571 - INFO - NumExpr defaulting to 8 threads.</span></span>
<span class="line"><span>======== Autoscaler status: 2025-02-13 00:54:12.737576 ========</span></span>
<span class="line"><span>Node status</span></span>
<span class="line"><span>---------------------------------------------------------------</span></span>
<span class="line"><span>Active:</span></span>
<span class="line"><span>1 node_a0dcf7b6cdb9c28191d6db6a44ba774ed04fb0bbda704a498112674f</span></span>
<span class="line"><span>1 node_3804fd0732e483a2240e9f608d15362f415411fca7c69b58232a1174</span></span>
<span class="line"><span>Pending:</span></span>
<span class="line"><span>(no pending nodes)</span></span>
<span class="line"><span>Recent failures:</span></span>
<span class="line"><span>(no failures)</span></span>
<span class="line"><span>Resources</span></span>
<span class="line"><span>---------------------------------------------------------------</span></span>
<span class="line"><span>Usage:</span></span>
<span class="line"><span>0.0/18.0 CPU</span></span>
<span class="line"><span>0.0/2.0 GPU</span></span>
<span class="line"><span>0B/70.78GiB memory</span></span>
<span class="line"><span>0B/20.90GiB object_store_memory</span></span>
<span class="line"><span>Demands:</span></span>
<span class="line"><span>(no resource demands)</span></span></code></pre></div><p>可以看到有两个 Active 的节点，和两个没有使用的 GPU。Ray 集群自带了一个可视化 UI，可以直观地查看 CPU，内存，GPU 等的使用量以及任务执行情况等，因此可以通过loadBalancer 或者 NodePort 将 UI 的端口暴露出去，即可在集群外部访问。我们在浏览器输入 <a href="http://xxxx:8265" target="_blank" rel="noreferrer">http://xxxx:8265</a> 进入 Web UI 查看。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/4.png" alt=""></a></p><p>这样 Ray 集群部分，我们就部署完了。</p><p>PS：别忘了这时就可以下载模型文件了。</p><h3 id="在-ray-中-部署-vllm" tabindex="-1">在 Ray 中 部署 Vllm <a class="header-anchor" href="#在-ray-中-部署-vllm" aria-label="Permalink to &quot;在 Ray 中 部署 Vllm&quot;">​</a></h3><p>在 Ray 容器中，默认提供了一个 Conda 环境，有很多基础包，但需要将 pynvml 包卸载掉，因为这会与另一个包 nvidia-ml-py 冲突，命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip uninstall pynvml</span></span></code></pre></div><p>之后就可以安装 vllm 了，为了适配 Ray 集群，我选择的版本是 0.6.1.post2，安装命令为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip install vllm==0.6.1.post2</span></span></code></pre></div><p>安装完成后，便可以使用 vllm 拉起大模型。就像上节课讲得那样，此处可以使用 python 代码的方式，也可以直接使用 vllm serve 命令，它会拉起大模型，同时提供一个 OpenAI 兼容的服务器。命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vllm serve /mnt/deepseek/deepseek-ai/DeepSeek-R1-Distill-Llama-70B \\</span></span>
<span class="line"><span>--port 8000 \\</span></span>
<span class="line"><span>--trust-remote-code \\</span></span>
<span class="line"><span>--served-model-name deepseek-r1 \\</span></span>
<span class="line"><span>--gpu-memory-utilization 0.95 \\</span></span>
<span class="line"><span>--tensor-parallel-size 2 \\</span></span>
<span class="line"><span>--max-model-len 8096</span></span></code></pre></div><p>等待一段时间后，会有如下显示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/5.png" alt=""></a></p><p>此时就说明，模型加载成功，server 也启动了。</p><p>这时我们再看一下 Ray 集群情况：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/6.png" alt=""></a></p><p>可以看到模型在两个 GPU 卡上各占了一半的显存，这也就意味着分布式部署成功了。</p><p>我们可以用 curl 测试一下，命令如下：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> http://</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">公网I</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">P</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:8000/v1/chat/completions</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">-H </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Content-Type: application/json&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">-d </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;model&quot;: &quot;deepseek-r1&quot;,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;messages&quot;: [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;帮我写一个client-go代码，可以列出pod列表&quot;}</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   ]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&#39;</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/7.png" alt=""></a></p><h2 id="使用对话前端连接模型" tabindex="-1">使用对话前端连接模型 <a class="header-anchor" href="#使用对话前端连接模型" aria-label="Permalink to &quot;使用对话前端连接模型&quot;">​</a></h2><p>在 Ollama 那节课，我们讲过 LobeChat。通过 docker 一键拉起 LobeChat 后，点击设置，语言模型，在 OpenAI 模型中输入上文命令中的 Server 地址，点击获取模型列表，即可获取到可用模型。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/8.png" alt=""></a></p><p>然后便可以开始对话了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/07-%25E8%25BF%259B%25E9%2598%25B6%25E9%2583%25A8%25E7%25BD%25B2%25EF%25BC%2588%25E4%25B8%2589%25EF%25BC%2589/9.png" alt=""></a></p><p>至此，我们就用分布式的方式成功部署了 Deepseek-R1:70B 模型，。如果你机会去部署 671B模型，可以使用这节课的套路来操作，两者之间在部署手法上一模一样，没有任何区别。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天通过分布式部署非量化版 DeepSeek-R1 模型的实战，我们不仅深入了解了 Ray 这一强大的分布式计算框架，还掌握了如何在 Kubernetes 集群上高效部署和管理大规模机器学习模型。</p><p>首先我们要理解 Ray 在分布式计算中的核心作用，它通过任务、参与者和对象等概念，简化了并行代码的编写和执行。特别是在 Kubernetes 上通过 KubeRay 部署 Ray 集群，使得集群的弹性伸缩、资源调度和作业管理变得更加便捷。这不仅提高了资源利用率，还为大规模模型的推理提供了坚实的基础。</p><p>随后通过实际的部署过程，我们体会到了分布式部署的复杂性。从 GPU 机器的准备、模型文件的下载与存储，到 Ray 集群的配置与启动，每一步都需要细致地规划和调试。特别是在多节点、多 GPU 的场景下，如何合理分配资源、避免瓶颈，成为了成功部署的关键。</p><p>最后，通过 vLLM 的集成和模型的成功加载，我们验证了分布式部署的可行性。</p><p>总的来说，如果只是对着文档一步步执行命令行，那整个过程并不复杂。但在这个过程中，我们需要多多思考，理解每一步为什么要这么做，意义是什么，这样才能在后续版本更新，部署手法发生变化时，能够读懂官方文档，做到举一反三。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>如果一个 Kubernetes 集群，包含 3 个 master 节点，2 个 CPU worker 节点以及 3 个 GPUworker 节点，应如何设置 numOfHosts 和 num-gpus？</p><p>欢迎你在留言区展示你的思考结果，我们一起探讨。如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给其他朋友，我们下节课再见！</p>`,80)])])}const d=a(i,[["render",l]]);export{E as __pageData,d as default};
