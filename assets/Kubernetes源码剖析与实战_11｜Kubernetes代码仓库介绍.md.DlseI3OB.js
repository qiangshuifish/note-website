import{_ as n,H as a,f as e,i}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"11 | Kubernetes代码仓库介绍","description":"","frontmatter":{},"headers":[{"level":2,"title":"Kubernetes 仓库结构介绍","slug":"kubernetes-仓库结构介绍","link":"#kubernetes-仓库结构介绍","children":[]},{"level":2,"title":"Staging 目录","slug":"staging-目录","link":"#staging-目录","children":[{"level":3,"title":"Kubernetes 代码如何导入 staging 包？","slug":"kubernetes-代码如何导入-staging-包","link":"#kubernetes-代码如何导入-staging-包","children":[]},{"level":3,"title":"如何根据 Kubernetes v1.30.2 查找 staging 包的版本？","slug":"如何根据-kubernetes-v1-30-2-查找-staging-包的版本","link":"#如何根据-kubernetes-v1-30-2-查找-staging-包的版本","children":[]}]},{"level":2,"title":"cmd/ 目录下组件介绍","slug":"cmd-目录下组件介绍","link":"#cmd-目录下组件介绍","children":[]},{"level":2,"title":"三个易混淆的 API 包","slug":"三个易混淆的-api-包","link":"#三个易混淆的-api-包","children":[]},{"level":2,"title":"Kubernetes 学习文档推荐","slug":"kubernetes-学习文档推荐","link":"#kubernetes-学习文档推荐","children":[]},{"level":2,"title":"课程总结","slug":"课程总结","link":"#课程总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Kubernetes源码剖析与实战/11｜Kubernetes代码仓库介绍.md","filePath":"Kubernetes源码剖析与实战/11｜Kubernetes代码仓库介绍.md","lastUpdated":1795530017000}'),p={name:"Kubernetes源码剖析与实战/11｜Kubernetes代码仓库介绍.md"};function l(t,s,o,r,c,k){return a(),e("div",null,[...s[0]||(s[0]=[i(`<h1 id="_11-kubernetes代码仓库介绍" tabindex="-1">11 | Kubernetes代码仓库介绍 <a class="header-anchor" href="#_11-kubernetes代码仓库介绍" aria-label="Permalink to &quot;11 | Kubernetes代码仓库介绍&quot;">​</a></h1><p>你好，我是孔令飞。</p><p>Kubernetes 源码量比较大，如果没有一个合理的仓库结构设计，维护起来会很困难。这节课咱们一起来聊聊它的代码仓库结构，以及每个源码目录的作用，看看 Kubernetes 是怎么“排兵布阵”的，让你更轻松地看懂 Kubernetes 的源码。</p><h2 id="kubernetes-仓库结构介绍" tabindex="-1">Kubernetes 仓库结构介绍 <a class="header-anchor" href="#kubernetes-仓库结构介绍" aria-label="Permalink to &quot;Kubernetes 仓库结构介绍&quot;">​</a></h2><p>Kubernetes 社区在项目迭代过程中，也在不断优化项目的目录结构以适配最新的功能代码以及代码设计方法。</p><p>在 v1.30.2 版本中，Kubernetes 源码目录结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── api/ # 存放 API 定义相关文件，例如：OpenAPI 文档</span></span>
<span class="line"><span>├── build/ # 包含了使用容器来构建 Kubernetes 组件的脚本</span></span>
<span class="line"><span>├── CHANGELOG/ # 存放 Kubernetes 的 CHANGELOG。master 分支会存放所有版本的CHANGELOG。在</span></span>
<span class="line"><span>├── cluster/ # 存放一些脚本和工具，用于创建、更新和管理Kubernetes集群</span></span>
<span class="line"><span>├── cmd # 存放Kubernetes的各种命令行工具的入口文件（即main文件），包括kubelet、kube-apiser</span></span>
<span class="line"><span>├── docs # 存放设计、开发文档或用户文档等。为了精简 Kubernetes 仓库，docs目录下的文件已挪至h</span></span>
<span class="line"><span>├── hack # 包含了一些脚本，这些脚本用来管理Kubernetes项目，例如：代码生成、组件安装、代码构建</span></span>
<span class="line"><span>│   ├── boilerplate # 各种类型文件的版权头信息。在生成代码时，对应文件类型的版权头信息取自该目</span></span>
<span class="line"><span>│   ├── lib # 存放shell脚本库，包含一些通用的Shell函数</span></span>
<span class="line"><span>│   ├── make-rules # 存放 Makefile 文件</span></span>
<span class="line"><span>├── Makefile -&gt; build/root/Makefile</span></span>
<span class="line"><span>├── _output # 保存一些构建产物或者其他临时文件</span></span>
<span class="line"><span>├── pkg # 存放大部分Kubernetes的核心代码。这里有API对象的定义、客户端库、认证/授权/审计机制、</span></span>
<span class="line"><span>│   ├── api # 包含了跟 API 相关的一些功能函数</span></span>
<span class="line"><span>│   ├── apis # 包含了 Kubernetes 中内置资源的定义、版本转换、默认值设置、参数校验等功能</span></span>
<span class="line"><span>│   ├── auth # 包含了授权相关的功能实现</span></span>
<span class="line"><span>│   ├── controller # 包含了kubernetes各类controller实现</span></span>
<span class="line"><span>│   ├── controlplane # 包含了kube-apiserver的核心实现</span></span>
<span class="line"><span>│   ├── credentialprovider</span></span>
<span class="line"><span>│   ├── features # 包含了Kubernetes内置的feature gate</span></span>
<span class="line"><span>│   ├── generated # 包含了Kubernetes中所有的生成文件。当前只包含了openapi。但是该目录目的是</span></span>
<span class="line"><span>│   ├── kubeapiserver # 包含了kube-apiserver相关的核心包，当前有adminssion初始化、认证、</span></span>
<span class="line"><span>│   ├── kubectl # kubectl 命令行工具具体实现</span></span>
<span class="line"><span>│   ├── kubelet # kubelet 具体实现</span></span>
<span class="line"><span>│   ├── kubemark # kubemark 具体实现</span></span>
<span class="line"><span>│   ├── printers # 实现 Kubernetes 对象的打印和显示功能</span></span>
<span class="line"><span>│   ├── probe # 管理 Kubernetes 的健康检查探针</span></span>
<span class="line"><span>│   ├── proxy # kube-proxy 具体实现</span></span>
<span class="line"><span>│   ├── registry # kube-apiserver核心代码实现，包含了资源的CURD、资源注册等</span></span>
<span class="line"><span>│   ├── scheduler # kube-scheduler 具体实现</span></span>
<span class="line"><span>│   ├── util # 提供一些通用的工具函数和辅助函数</span></span>
<span class="line"><span>│   ├── volume # 实现 Kubernetes 存储卷的管理</span></span>
<span class="line"><span>├── plugin # 存放Kubernetes的各种插件，包括网络插件、设备插件、调度插件、认证插件、授权插件等</span></span>
<span class="line"><span>├── staging # 存放些即将被移动到其它仓库的代码</span></span>
<span class="line"><span>├── test # 存放测试工具及测试数据</span></span>
<span class="line"><span>├── third_party # 存放第三方工具、代码或其他组件</span></span>
<span class="line"><span>└── vendor # 存放项目依赖的库代码，一般为第三方库代码</span></span></code></pre></div><p>这里要说明的是，我只在上面列出了 Kubernetes 源码目录下的一些核心目录，至于其他没有提到的，通过文件名，不难知道它们的功能，所以我就不一一来说了。</p><p>在这些目录中，我们会重点讲解 staging 目录和 cmd 目录，以及一些易混淆的 API 包。</p><h2 id="staging-目录" tabindex="-1">Staging 目录 <a class="header-anchor" href="#staging-目录" aria-label="Permalink to &quot;Staging 目录&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>很多刚开始看 Kubernetes 源码的同学，都搞不清楚 /staging 目录的命名和作用，所以接下</span></span>
<span class="line"><span>来我们先介绍 /staging 目录。</span></span>
<span class="line"><span>staging 目录是一个暂存区，用来暂时保存未来会发布到其自己代码仓库的项目。暂存区中</span></span></code></pre></div><p>的项目会被 publishing-bot 机器人定期同步到 k8s.io 组织中，作为 k8s.io 组织的一级项目而存</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在，其模块名为 k8s.io/xxx，api 包的模块名可以是下面这样：</span></span>
<span class="line"><span>// This is a generated file. Do not edit directly.</span></span>
<span class="line"><span>module k8s.io/api</span></span>
<span class="line"><span>go 1.21.3</span></span></code></pre></div><p>将这些项目发布为 k8s.io 组织的一级项目，可以方便其他开发者引用。要注意的是，这些代码虽然以独立项目发布，但都在 Kubernetes 主项目中维护，位于目录</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kubernetes/staging/ 中，这里面的代码会被定期同步到各个独立项目中。</span></span></code></pre></div><p>还需要注意，虽然 staging 目录已成为暂存区，但是目录下的项目会永久存在于 Kubernetes仓库中，未来会发布到独立代码仓库。</p><p>在 Go 项目中，我们如果要使用 api 包，引用的是其模块名：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">package kubelet</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v1 </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;k8s.io/api/core/v1&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">另外，Go 模块 k8s.io</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api 对应的 GitHub 仓库是</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">https:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">github.com</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kubernetes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api。在实际执行 go get 命令时，Go 工具会先访问</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">https:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">k8s.io</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api，然后 k8s.io 服务器将模块下载地址转发到</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">https:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">github.com</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kubernetes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api。</span></span></code></pre></div><p>总的来说，staging 目录当前暂存了以下项目（为了方便表述，我后面会统称这些包为 staging包）：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/11/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kubernetes%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/11/1.png" alt=""></a></p><p>我们要注意，staging 目录中的代码是权威的，也就是说它是代码的唯一副本，如果你要对</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>k8s.io/api 包的代码进行变更，你只能修改 kubernetes/staging/src/k8s.io/api</span></span>
<span class="line"><span>目录下的代码。换句话说，k8s.io/api 仓库是只读的，你不能对其进行任何代码修改。</span></span></code></pre></div><h3 id="kubernetes-代码如何导入-staging-包" tabindex="-1">Kubernetes 代码如何导入 staging 包？ <a class="header-anchor" href="#kubernetes-代码如何导入-staging-包" aria-label="Permalink to &quot;Kubernetes 代码如何导入 staging 包？&quot;">​</a></h3><p>staging 目录下的包也会被 Kubernetes 仓库中的其他代码导入并使用，例如pkg/kubelet/kubelet.go：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">package kubelet</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/client-go/informers&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v1 </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;k8s.io/api/core/v1&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   metav1 </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;k8s.io/apimachinery/pkg/apis/meta/v1&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/apimachinery/pkg/types&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/apimachinery/pkg/util/wait&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/klog/v2&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/kubernetes/pkg/api/v1/resource&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/kubernetes/pkg/features&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;k8s.io/kubernetes/pkg/kubelet/cadvisor&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">因为 staging 目录下的项目模块名为 k8s.io</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xxx，所以即使 Kubernetes 代码需要用，也需</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">要按模块名进行导入 k8s.io</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xxx。但这时候会出现一个问题，如果 Kubernetes 需要添加 A</span></span></code></pre></div><p>功能，这个功能涉及 xxx 包的修改，那么就有两种方案：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>先将 xxx 包发布到 k8s.io/xxx 仓库下，再升级 Kubernetes 仓库下 go.mod 文件中</span></span>
<span class="line"><span>k8s.io/xxx 包的版本，最后再开发 A 功能。</span></span>
<span class="line"><span>使用 Go 模块的包替代功能，直接将 k8s.io/xxx 替换为 staging 目录下的 xxx 模块。</span></span>
<span class="line"><span>方案 1 会有一个问题，先把 xxx 的变更发布到 k8s.io/xxx 仓库中，再开发 A 功能，如果在</span></span>
<span class="line"><span>开发过程中，发现 xxx 包需要适配，就需要频繁地将适配的内容发布到 k8s.io/xxx 仓库</span></span>
<span class="line"><span>中，会造成 k8s.io/xxx 仓库被频繁发布了不稳定的代码，不合理。</span></span></code></pre></div><p>因此，Kubernetes 选择了第二种方法，因为它最便捷也最合理，例如 go.mod：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>replace (</span></span>
<span class="line"><span>   k8s.io/api =&gt; ./staging/src/k8s.io/api</span></span>
<span class="line"><span>   k8s.io/apiextensions-apiserver =&gt; ./staging/src/k8s.io/apiextensions-apiserve</span></span>
<span class="line"><span>   k8s.io/apimachinery =&gt; ./staging/src/k8s.io/apimachinery</span></span>
<span class="line"><span>   k8s.io/apiserver =&gt; ./staging/src/k8s.io/apiserver</span></span>
<span class="line"><span>   k8s.io/cli-runtime =&gt; ./staging/src/k8s.io/cli-runtime</span></span>
<span class="line"><span>   k8s.io/client-go =&gt; ./staging/src/k8s.io/client-go</span></span>
<span class="line"><span>   k8s.io/cloud-provider =&gt; ./staging/src/k8s.io/cloud-provider</span></span>
<span class="line"><span>   k8s.io/cluster-bootstrap =&gt; ./staging/src/k8s.io/cluster-bootstrap</span></span>
<span class="line"><span>   k8s.io/code-generator =&gt; ./staging/src/k8s.io/code-generator</span></span>
<span class="line"><span>   k8s.io/component-base =&gt; ./staging/src/k8s.io/component-base</span></span>
<span class="line"><span>   k8s.io/component-helpers =&gt; ./staging/src/k8s.io/component-helpers</span></span>
<span class="line"><span>   k8s.io/controller-manager =&gt; ./staging/src/k8s.io/controller-manager</span></span>
<span class="line"><span>   k8s.io/cri-api =&gt; ./staging/src/k8s.io/cri-api</span></span>
<span class="line"><span>   k8s.io/csi-translation-lib =&gt; ./staging/src/k8s.io/csi-translation-lib</span></span>
<span class="line"><span>   k8s.io/dynamic-resource-allocation =&gt; ./staging/src/k8s.io/dynamic-resource-a</span></span>
<span class="line"><span>   k8s.io/endpointslice =&gt; ./staging/src/k8s.io/endpointslice</span></span>
<span class="line"><span>   k8s.io/kms =&gt; ./staging/src/k8s.io/kms</span></span>
<span class="line"><span>   k8s.io/kube-aggregator =&gt; ./staging/src/k8s.io/kube-aggregator</span></span>
<span class="line"><span>   k8s.io/kube-controller-manager =&gt; ./staging/src/k8s.io/kube-controller-manage</span></span>
<span class="line"><span>   k8s.io/kube-proxy =&gt; ./staging/src/k8s.io/kube-proxy</span></span>
<span class="line"><span>   k8s.io/kube-scheduler =&gt; ./staging/src/k8s.io/kube-scheduler</span></span>
<span class="line"><span>   k8s.io/kubectl =&gt; ./staging/src/k8s.io/kubectl</span></span>
<span class="line"><span>   k8s.io/kubelet =&gt; ./staging/src/k8s.io/kubelet</span></span>
<span class="line"><span>   k8s.io/legacy-cloud-providers =&gt; ./staging/src/k8s.io/legacy-cloud-providers</span></span>
<span class="line"><span>   k8s.io/metrics =&gt; ./staging/src/k8s.io/metrics</span></span>
<span class="line"><span>   k8s.io/mount-utils =&gt; ./staging/src/k8s.io/mount-utils</span></span>
<span class="line"><span>   k8s.io/pod-security-admission =&gt; ./staging/src/k8s.io/pod-security-admission</span></span>
<span class="line"><span>   k8s.io/sample-apiserver =&gt; ./staging/src/k8s.io/sample-apiserver</span></span>
<span class="line"><span>   k8s.io/sample-cli-plugin =&gt; ./staging/src/k8s.io/sample-cli-plugin</span></span>
<span class="line"><span>   k8s.io/sample-controller =&gt; ./staging/src/k8s.io/sample-controller</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>如果你使用 vendor 机制，会发现 vendor/k8s.io/api 目录也被做了软连接：</span></span>
<span class="line"><span>vendor/k8s.io/api -&gt; ../../staging/src/k8s.io/api</span></span></code></pre></div><h3 id="如何根据-kubernetes-v1-30-2-查找-staging-包的版本" tabindex="-1">如何根据 Kubernetes v1.30.2 查找 staging 包的版本？ <a class="header-anchor" href="#如何根据-kubernetes-v1-30-2-查找-staging-包的版本" aria-label="Permalink to &quot;如何根据 Kubernetes v1.30.2 查找 staging 包的版本？&quot;">​</a></h3><p>在 Kubernetes 中，了解版本映射非常重要。当第三方项目需要引用 Kubernetes 包及 staging包时，必须指明对应版本。一旦 Kubernetes 包与 staging 包之间的版本出现不匹配的情况，极有可能带来很多兼容性问题。</p><p>接下来，我们就以 Kubernetes v1.30.2 为例，讲讲怎么查找 staging 包的版本。</p><p>Kubernetes 会依赖 staging 包，在 Kubernetes 包中，对 staging 包的依赖配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ grep -w k8s.io/api go.mod</span></span>
<span class="line"><span>k8s.io/api v0.0.0</span></span>
<span class="line"><span>k8s.io/api =&gt; ./staging/src/k8s.io/api</span></span>
<span class="line"><span>可以看到，go.mod 中并没有配置 k8s.io/api 包的版本。那么，我们如何知道 Kubernetes</span></span>
<span class="line"><span>v1.30.2 所依赖 k8s.io/api 包的具体发布版本呢？</span></span></code></pre></div><p>有一个不成文的约定：如果 Kubernetes 的版本号是 v1.30.2，那么对应的 staging 包的版本为</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>v0.30.2，也就是 v1.30.2 主版本号 1 减去 1。</span></span></code></pre></div><h2 id="cmd-目录下组件介绍" tabindex="-1">cmd/ 目录下组件介绍 <a class="header-anchor" href="#cmd-目录下组件介绍" aria-label="Permalink to &quot;cmd/ 目录下组件介绍&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Kubernetes cmd/ 目录下有很多组件，v1.30.2 版本下，cmd/ 目录下有 27 个组件（也即有</span></span></code></pre></div><p>27 个 main 文件）。我们按功能将这些组件分为 4 类：</p><ul><li><p>Kubernetes 控制面组件（核心组件）：</p></li><li><p>kube-apiserver</p></li><li><p>kube-controller-manager</p></li><li><p>cloud-controller-manager</p></li><li><p>kube-scheduler</p></li><li><p>kubelet</p></li><li><p>kube-proxy</p></li><li><p>Kubernetes 客户端工具：</p></li><li><p>kubeadm</p></li><li><p>kubectl</p></li><li><p>辅助工具：</p></li><li><p>clicheck</p></li><li><p>genkubedocs</p></li><li><p>gendocs</p></li><li><p>genman</p></li><li><p>genswaggertypedocs</p></li><li><p>genyaml</p></li><li><p>kubectl-convert</p></li><li><p>kubemark</p></li><li><p>其它</p></li><li><p>dependencycheck</p></li><li><p>dependencyverifier</p></li><li><p>genutils</p></li><li><p>fieldnamedocscheck</p></li><li><p>prune-junit-xml</p></li><li><p>importverifier</p></li><li><p>preferredimports</p></li><li><p>import-boss</p></li><li><p>gotemplate</p></li></ul><h2 id="三个易混淆的-api-包" tabindex="-1">三个易混淆的 API 包 <a class="header-anchor" href="#三个易混淆的-api-包" aria-label="Permalink to &quot;三个易混淆的 API 包&quot;">​</a></h2><p>在阅读 Kubernetes 源码或者进行 Kubernetes 编程过程中，我们经常会引用以下 3 个包：</p><ul><li><p>k8s.io/api</p></li><li><p>kubernetes/pkg/api</p></li><li><p>kubernetes/pkg/apis</p></li></ul><p>这 3 个包都与 Kubernetes API 相关，但在功能和位置上有所不同。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我们先来看 k8s.io/api。该包包含了 Kubernetes 内置资源对象的结构体定义，以及与这些</span></span>
<span class="line"><span>资源对象相关的操作和状态。该包涉及的操作主要包括针对每种资源对象的 Marshal、</span></span>
<span class="line"><span>Unmarshal、DeepCopy()、DeepCopyObject、DeepCopyInto、String。</span></span></code></pre></div><p>例如，DaemonSet 资源具有以下操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>generated.pb.go:func (m *DaemonSet) Reset()      { *m = DaemonSet{} }</span></span>
<span class="line"><span>generated.pb.go:func (*DaemonSet) ProtoMessage() {}</span></span>
<span class="line"><span>generated.pb.go:func (*DaemonSet) Descriptor() ([]byte, []int) {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) XXX_Unmarshal(b []byte) error {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) XXX_Marshal(b []byte, deterministic bool) ([]</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) XXX_Merge(src proto.Message) {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) XXX_Size() int {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) XXX_DiscardUnknown() {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) Marshal() (dAtA []byte, err error) {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) MarshalTo(dAtA []byte) (int, error) {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) MarshalToSizedBuffer(dAtA []byte) (int, error</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) Size() (n int) {</span></span>
<span class="line"><span>generated.pb.go:func (this *DaemonSet) String() string {</span></span>
<span class="line"><span>generated.pb.go:func (m *DaemonSet) Unmarshal(dAtA []byte) error {</span></span>
<span class="line"><span>zz_generated.deepcopy.go:func (in *DaemonSet) DeepCopyInto(out *DaemonSet) {</span></span>
<span class="line"><span>zz_generated.deepcopy.go:func (in *DaemonSet) DeepCopy() *DaemonSet {</span></span>
<span class="line"><span>zz_generated.deepcopy.go:func (in *DaemonSet) DeepCopyObject() runtime.Object {</span></span>
<span class="line"><span>zz_generated.prerelease-lifecycle.go:func (in *DaemonSet) APILifecycleIntroduced(</span></span>
<span class="line"><span>zz_generated.prerelease-lifecycle.go:func (in *DaemonSet) APILifecycleDeprecated(</span></span>
<span class="line"><span>zz_generated.prerelease-lifecycle.go:func (in *DaemonSet) APILifecycleReplacement</span></span>
<span class="line"><span>zz_generated.prerelease-lifecycle.go:func (in *DaemonSet) APILifecycleRemoved() (</span></span>
<span class="line"><span>k8s.io/api 涉及的资源状态主要是 XXXConditionType，例如 Pod 资源对象具有以下状</span></span></code></pre></div><p>态：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// These are built-in conditions of pod. An application may use a custom conditio</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // ContainersReady indicates whether all containers in the pod are ready.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ContainersReady PodConditionType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;ContainersReady&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // PodInitialized means that all init containers in the pod have started succ</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   PodInitialized PodConditionType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Initialized&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // PodReady means the pod is able to service requests and should be added to</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // load balancing pools of all matching services.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   PodReady PodConditionType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Ready&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // PodScheduled represents status of the scheduling process for this pod.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   PodScheduled PodConditionType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;PodScheduled&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // DisruptionTarget indicates the pod is about to be terminated due to a</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // disruption (such as preemption, eviction API or garbage-collection).</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   DisruptionTarget PodConditionType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;DisruptionTarget&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kubernetes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pkg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api 包含了一些核心资源对象 utill 类型的函数定义。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kubernetes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pkg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">apis 与 k8s.io</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api 包内容类似，也包含了 Kubernetes 内置资源对象</span></span></code></pre></div><p>的结构体定义。但是这个项目只建议被 Kubernetes 内部引用，如果外部项目引用建议使用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>k8s.io/api。而且 Kubernetes 内置代码也有很多引用了 k8s.io/api 下面的 api，所以后</span></span>
<span class="line"><span>面可能都会迁移至 k8s.io/api 项目下。</span></span></code></pre></div><p>Kubernetes 中的 API 被组织为多个 API 组，每个 API 组都有自己的版本和资源对象。每个API 组通常对应一个子目录，每一个版本又对应一个子目录，在版本子目录下包含了该版本的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>资源对象的结构体定义、状态定义和相关的方法。例如 kubernetes/pkg/apis/ 目录下的</span></span></code></pre></div><p>资源组和版本的目录结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kubernetes/pkg/apis</span></span>
<span class="line"><span>├── ...</span></span>
<span class="line"><span>├── apps # apps 资源组</span></span>
<span class="line"><span>│   ├── doc.go</span></span>
<span class="line"><span>│   ├── fuzzer/</span></span>
<span class="line"><span>│   ├── install/</span></span>
<span class="line"><span>│   ├── register.go</span></span>
<span class="line"><span>│   ├── types.go</span></span>
<span class="line"><span>│   ├── v1/ # v1版本</span></span>
<span class="line"><span>│   ├── v1beta1/ # v1beta1 版本</span></span>
<span class="line"><span>│   ├── v1beta2/ # v1beta2 版本</span></span>
<span class="line"><span>│   ├── validation/</span></span>
<span class="line"><span>│   └── zz_generated.deepcopy.go</span></span>
<span class="line"><span>├── ...</span></span>
<span class="line"><span>├── core # core 资源组（也叫核心资源组）</span></span>
<span class="line"><span>│   ├── annotation_key_constants.go</span></span>
<span class="line"><span>│   ├── doc.go</span></span>
<span class="line"><span>│   ├── fuzzer/</span></span>
<span class="line"><span>│   ├── helper/</span></span>
<span class="line"><span>│   ├── install/</span></span>
<span class="line"><span>│   ├── json.go</span></span>
<span class="line"><span>│   ├── objectreference.go</span></span>
<span class="line"><span>│   ├── pods/</span></span>
<span class="line"><span>│   ├── register.go</span></span>
<span class="line"><span>│   ├── resource.go</span></span>
<span class="line"><span>│   ├── taint.go</span></span>
<span class="line"><span>│   ├── toleration.go</span></span>
<span class="line"><span>│   ├── types.go</span></span>
<span class="line"><span>│   ├── v1/ # v1 版本</span></span>
<span class="line"><span>│   ├── validation/</span></span>
<span class="line"><span>│   └── zz_generated.deepcopy.go</span></span></code></pre></div><h2 id="kubernetes-学习文档推荐" tabindex="-1">Kubernetes 学习文档推荐 <a class="header-anchor" href="#kubernetes-学习文档推荐" aria-label="Permalink to &quot;Kubernetes 学习文档推荐&quot;">​</a></h2><p>如果你还想更多地学习和熟悉 Kubernetes，我再给你推荐一些 Kubernetes 阅读资料。</p><ul><li><p>Kubernetes 官方文档：面向于使用者，如果你有时间，建议把官方文档阅读一遍（当然，如果你习惯看中文，也有 Kubernetes 中文文档，但我还是建议你直接阅读官方文档）。</p></li><li><p>Kubernetes 社区文档：包含了 Kubernetes 的开发文档、开发规范、方案设计等文档，相比于官方文档，更多面向于开发者。建议过一遍社区文档，其中有很多文档，对我们的项目开发很有帮助。</p></li><li><p>design-proposals-archive：介绍 Kubernetes 功能设计时的一些提案，对了解Kubernetes 功能设计背后的思考非常有帮助。</p></li><li><p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 6 版）：学习Kubernetes 必读的一本书，分为第六版分为上下两册。</p></li></ul><h2 id="课程总结" tabindex="-1">课程总结 <a class="header-anchor" href="#课程总结" aria-label="Permalink to &quot;课程总结&quot;">​</a></h2><p>本节课我们介绍了 Kubernetes 的代码仓库结构，以及核心目录的功能作用。希望通过本节课的学习，你能对 Kubernetes 源码结构有一个初步的认识。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li><p>你觉得 Kubernetes 源码还有哪些值得借鉴的特点？</p></li><li><p>尝试从 Kubernetes 源码中找到一个文档类错误，并给 Kubernetes 贡献一个 PR。</p></li><li><p>如果你有其他好的 Kubernetes 相关资料，欢迎评论区分享。</p></li></ol><p>期待你的留言，如果今天的内容让你有所收获，也欢迎转发给有需要的朋友，我们下节课再见！</p>`,63)])])}const d=n(p,[["render",l]]);export{h as __pageData,d as default};
