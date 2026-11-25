import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"14 | Pod相互访问的网络策略","description":"","frontmatter":{},"headers":[{"level":2,"title":"认识网络策略","slug":"认识网络策略","link":"#认识网络策略","children":[]},{"level":2,"title":"使用网络策略","slug":"使用网络策略","link":"#使用网络策略","children":[{"level":3,"title":"创建网络策略","slug":"创建网络策略","link":"#创建网络策略","children":[]},{"level":3,"title":"验证网络策略","slug":"验证网络策略","link":"#验证网络策略","children":[]},{"level":3,"title":"网络策略注意事项","slug":"网络策略注意事项","link":"#网络策略注意事项","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"零基础拿下云原生CKA认证/14｜Pod相互访问的网络策略.md","filePath":"零基础拿下云原生CKA认证/14｜Pod相互访问的网络策略.md","lastUpdated":1795561650000}'),l={name:"零基础拿下云原生CKA认证/14｜Pod相互访问的网络策略.md"};function o(i,s,t,c,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_14-pod相互访问的网络策略" tabindex="-1">14 | Pod相互访问的网络策略 <a class="header-anchor" href="#_14-pod相互访问的网络策略" aria-label="Permalink to &quot;14 | Pod相互访问的网络策略&quot;">​</a></h1><p>你好，我是雪飞。</p><p>上一课我们讨论了用户和服务账号通过 API Server 访问集群的安全问题，通过 RBAC 权限控制有效应对了外部访问风险。今天，我带你了解一下 K8s 内部 Pod 之间相互访问的安全问题，从而防范 K8s 集群内部的安全风险。</p><p>默认情况下，K8s 集群内部网络没有任何网络访问限制，任何 Pod 都可以与其他 Pod 通信，甚至不同命名空间的 Pod 也可以相互访问。例如，在 A 命名空间下运行着一个转账的业务应用 Pod，然后有人偷偷在 B 命名空间中部署了一个给自己转账的应用，那么这个 Pod 就可能直接访问 A 中的 Pod 来给自己转账，这样就会出现严重的安全漏洞。因此，有时需要对 Pod进行网络隔离，从而提升集群的安全性。</p><h2 id="认识网络策略" tabindex="-1">认识网络策略 <a class="header-anchor" href="#认识网络策略" aria-label="Permalink to &quot;认识网络策略&quot;">​</a></h2><p>K8s 提供了网络策略（NetworkPolicy）资源对象，用于确保只有授权的流量才能进入或离开Pod，从而提供一种强大灵活的安全机制。网络策略允许管理员设置网络规则来控制 Pod 间的网络流量，这些规则通过标签选择器选定被保护的 Pod，并规定哪些来源 Pod（或者来源 IP）允许访问被保护的 Pod，或者规定这些被保护的 Pod 允许访问哪些目标 Pod（或者目标 IP）。</p><p>我们看一下网络策略的三个组成部分：</p><ul><li><p>Pod 选择器：通过标签来选择被保护的 Pod，最终在这些 Pod 上应用网络策略。</p></li><li><p>入口规则（Ingress）：定义允许进入 Pod 的来源流量。</p></li><li><p>出口规则（Egress）：定义允许从 Pod 流出的目标流量。</p></li></ul><p>入口规则和出口规则中都包含两大组成部分，一是限定访问来源 Pod 或者访问目标 Pod，另一个是指定访问请求的端口号和协议，这两个部分是“并且”的关系，既要满足端口号和协议的要求，又要满足来源 Pod 或目标 Pod 的限制。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/14/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E9%9B%B6%E5%9F%BA%E7%A1%80%E6%8B%BF%E4%B8%8B%E4%BA%91%E5%8E%9F%E7%94%9FCKA%E8%AE%A4%E8%AF%81/images/14/1.png" alt=""></a></p><p>当这些策略被创建并应用后，它们依赖于集群的网络插件来执行。我们部署集群时，安装的是Calico 网络插件，它实现了网络策略能力。部署网络策略时，K8s 会告诉网络插件如何处理Pod 之间的访问，网络插件会根据规则调整底层网络设置（路由器、交换机或防火墙等），确保只允许满足条件的访问。</p><p>K8s 网络策略可以通过 Pod 标签、命名空间标签和 IP 地址这三种不同维度来选择来源或者目标 Pod 或者 IP，同时也会根据访问请求的协议类型、端口来选择要控制的入口或出口请求。常见应用场景包括：</p><ul><li><p>Pod 间访问隔离：在微服务架构中，K8s 网络策略为不同安全级别的业务应用定制 Pod 的访问权限。例如，对于处理敏感支付信息的 Pod，可以配置网络策略仅允许订单 Pod 访问，从而阻止其他 Pod 访问。这种精确的网络策略配置增强了安全性，确保只有授权的Pod 能够进行通信。</p></li><li><p>命名空间的访问隔离：K8s 为不同项目分配独立的命名空间并配置特定的网络策略，保障项目间的访问隔离，防止数据泄露或未授权访问。</p></li><li><p>IP 白名单：对于一些向集群外部提供服务的 Pod，可以通过配置网络策略来限制访问请求的 IP 地址，严格控制外部访问请求。</p></li></ul><p>合理设计和部署网络策略可以在不同场景下实现对应用的灵活精细的访问控制，从而确保 K8s集群内部 Pod 的安全与稳定。了解了网络策略的概念，我们接着来实际配置网络策略。</p><h2 id="使用网络策略" tabindex="-1">使用网络策略 <a class="header-anchor" href="#使用网络策略" aria-label="Permalink to &quot;使用网络策略&quot;">​</a></h2><p>使用网络策略包含以下步骤：</p><ol><li><p>首先，要确定网络策略生效的命名空间，因为网络策略是保护该命名空间中的 Pod。</p></li><li><p>其次，通过 Pod 的标签来选择该命名空间中被保护的 Pod。</p></li><li><p>然后，确认入口 Ingress 和出口 Egress 规则。</p></li><li><p>最后，编写网络策略的 YAML 文件，部署后生效。</p></li></ol><h3 id="创建网络策略" tabindex="-1">创建网络策略 <a class="header-anchor" href="#创建网络策略" aria-label="Permalink to &quot;创建网络策略&quot;">​</a></h3><p>我带你动手部署一个网络策略。要求如下：</p><ul><li><p>被保护的 Pod 是在命名空间 ns1 中，Pod 标签为 “app=back”。</p></li><li><p>入口流量规则：对于 TCP 协议并且端口为 80 的访问请求，以下三种来源可以允许访问被保护的 Pod：a. 命名空间 ns2 中的所有 Pod；</p></li><li><p>b. 命名空间 ns1 中标签为 “app=front” 的所有 Pod；</p></li><li><p>c. 请求来源 IP 地址为 192.168.2.0/8 网段。</p></li><li><p>出口流量规则：只允许被保护的 Pod 对外访问相同命名空间中的所有 Pod。</p></li></ul><p>我们为这个网络策略编写一个 YAML 文件（back-pod-np.yaml）如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># back-pod-np.yaml</span></span>
<span class="line"><span>apiVersion: networking.k8s.io/v1</span></span>
<span class="line"><span>kind: NetworkPolicy</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> name: back-pod-networkpolicy</span></span>
<span class="line"><span> namespace: ns1</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span> podSelector:</span></span>
<span class="line"><span>   matchLabels:</span></span>
<span class="line"><span>     app: back</span></span>
<span class="line"><span> policyTypes:</span></span>
<span class="line"><span> - Ingress</span></span>
<span class="line"><span> - Egress</span></span>
<span class="line"><span> ingress:</span></span>
<span class="line"><span> - from:</span></span>
<span class="line"><span>   - namespaceSelector:</span></span>
<span class="line"><span>       matchLabels:</span></span>
<span class="line"><span>         ns: ns2</span></span>
<span class="line"><span>   - podSelector:</span></span>
<span class="line"><span>       matchLabels:</span></span>
<span class="line"><span>         app: front</span></span>
<span class="line"><span>   - ipBlock:</span></span>
<span class="line"><span>       cidr: 192.168.2.0/8</span></span>
<span class="line"><span>   ports:</span></span>
<span class="line"><span>   - protocol: TCP</span></span>
<span class="line"><span>     port: 80</span></span>
<span class="line"><span> egress:</span></span>
<span class="line"><span> - to:</span></span>
<span class="line"><span>   - podSelector: {}</span></span></code></pre></div><ul><li><p>namespace：网络策略是按照命名空间隔离的，所以它选择的被保护的 Pod 都是在这个命名空间中。</p></li><li><p>podSelector：每个网络策略都包括一个 podSelector，通过 Pod 标签选择一组被保护的Pod。示例中的策略选择了命名空间 ns1 中带有 “app=back” 标签的 Pod。</p></li><li><p>policyTypes：指定规则中包含 Ingress 或者 Egress 规则，示例中两者兼有。</p></li><li><p>ingress：如果在 policyTypes 属性中包含了 Ingress，则需要 ingress 属性来定义入口流量的规则列表，流量需要同时匹配 from 和 ports 属性的要求。示例中，ports 属性要求访问请求的协议是 TCP 并且访问端口是 80，同时 from 属性则要求来源 Pod（或者 IP）满足三个条件的任意一个：第一个通过 namespaceSelector 属性指定标签为 “ns=ns2” 的命名空</p></li><li><p>间中的所有 Pod；第二个通过 podSelector 属性指定在网络策略的命名空间 ns1 中，标签为 “app=front” 的所有 Pod；第三个通过 ipBlock 属性指定 IP 地址为 192.168.2.0/8 网段的所有访问请求（ipBlock 比较特殊，限定的不是某个 Pod ，而是针对来源的 IP 地址）。</p></li><li><p>egress：如果在 policyTypes 属性中包含了 Egress，则需要 egress 属性来定义出口流量的规则列表，流量需要同时匹配 to 和 ports 属性的要求。示例中，没有 ports 属性，所以规则针对所有协议和端口的出口流量，同时 to 属性则只要求目标 Pod 满足 podSelector 属性指定的 Pod。空的 podSelector（podSelector: {}）表示网络策略命名空间 ns1 下的所有Pod。</p></li></ul><p>from 和 to 属性都可以支持 namespaceSelector、podSelector 和 ipBlock 三种选择方式，来限制来源 Pod 或 来源 IP，以及限制目标 Pod 或目标 IP。这些方式可以相互嵌套，形成更复杂的规则。</p><p>部署网络策略，然后通过 “kubectl describe” 查看网络策略，通过返回结果可以清晰地了解网络策略的规则详情。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl apply -f back-pod-np.yaml</span></span>
<span class="line"><span>networkpolicy.networking.k8s.io/back-pod-networkpolicy created</span></span>
<span class="line"><span>[root@k8s-master example-14]# kubectl describe networkpolicy back-pod-networkpoli</span></span>
<span class="line"><span>Name:         back-pod-networkpolicy</span></span>
<span class="line"><span>Namespace:    ns1</span></span>
<span class="line"><span>Created on:   2024-06-28 22:32:46 +0800 CST</span></span>
<span class="line"><span>Labels:       &lt;​none&gt;</span></span>
<span class="line"><span>Annotations:  &lt;​none&gt;</span></span>
<span class="line"><span>Spec:</span></span>
<span class="line"><span> PodSelector:     app=back</span></span>
<span class="line"><span> Allowing ingress traffic:</span></span>
<span class="line"><span>   To Port: 80/TCP</span></span>
<span class="line"><span>   From:</span></span>
<span class="line"><span>     NamespaceSelector: ns=ns2</span></span>
<span class="line"><span>   From:</span></span>
<span class="line"><span>     PodSelector: app=front</span></span>
<span class="line"><span>   From:</span></span>
<span class="line"><span>     IPBlock:</span></span>
<span class="line"><span>       CIDR: 192.168.2.0/8</span></span>
<span class="line"><span>       Except:</span></span>
<span class="line"><span> Allowing egress traffic:</span></span>
<span class="line"><span>   To Port: &lt;​any&gt; (traffic allowed to all ports)</span></span>
<span class="line"><span>   To:</span></span>
<span class="line"><span>     PodSelector: &lt;​none&gt;</span></span>
<span class="line"><span> Policy Types: Ingress, Egress</span></span></code></pre></div><h3 id="验证网络策略" tabindex="-1">验证网络策略 <a class="header-anchor" href="#验证网络策略" aria-label="Permalink to &quot;验证网络策略&quot;">​</a></h3><p>现在我们来简单验证一下网络策略，准备一下环境。</p><ol><li>准备两个命名空间，ns1 和 ns2，同时给 ns2 打标签 ns=ns2。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl create ns ns1</span></span>
<span class="line"><span>namespace/ns1 created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl create ns ns2</span></span>
<span class="line"><span>namespace/ns2 created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl label ns ns2 ns=ns2</span></span>
<span class="line"><span>namespace/ns2 labeled</span></span></code></pre></div><ol start="2"><li>准备 4 个 Pod</li></ol><ul><li><p>在命名空间 ns1 中创建一个运行 nginx 镜像的 Pod，名称为 ns1-nginx，打上标签“app=back”；</p></li><li><p>在命名空间 ns1 中创建一个运行 busybox 镜像的 Pod，名称为 ns1-busybox；</p></li><li><p>在命名空间 ns1 中创建一个运行 busybox 镜像的 Pod，名称为 ns1-busybox-front，打上标签为 “app=front”；</p></li><li><p>在命名空间 ns2 中创建一个运行 busybox 镜像的 Pod，名称为 ns2-busybox。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl run ns1-nginx --image=nginx -n ns1</span></span>
<span class="line"><span>pod/ns1-nginx created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl label pod ns1-nginx -n ns1 app=back</span></span>
<span class="line"><span>pod/ns1-nginx labeled</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl run ns1-busybox --image=busybox -n ns1 -- sleep 3600</span></span>
<span class="line"><span>pod/ns1-busybox created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl run ns1-busybox-front --image=busybox -n ns1 -- slee</span></span>
<span class="line"><span>pod/default-busybox created</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl label pod ns1-busybox-front -n ns1 app=front</span></span>
<span class="line"><span>pod/default-busybox labeled</span></span>
<span class="line"><span>[root@k8s-master ~]# kubectl run ns2-busybox --image=busybox -n ns2 -- sleep 3600</span></span>
<span class="line"><span>pod/ns2-busybox created</span></span></code></pre></div><ol start="3"><li>验证过程</li></ol><p>根据网络策略，名称为 ns1-nginx （命名空间为 ns1，同时标签为 “app=back”）的 Pod 就是符合规则的被保护的 Pod。由于 Pod 之间的访问可以通过它们的临时 IP 地址，我们查看一下ns1-nginx 的 IP 地址，然后进入其他几个 Pod 中，使用 wget 命令来请求 ns1-nginx 的 Web服务页面，根据请求是否成功来测试网络策略的规则。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl get pod ns1-nginx -n ns1 -o wide</span></span>
<span class="line"><span>NAME        READY   STATUS    RESTARTS   AGE   IP              NODE          NOMI</span></span>
<span class="line"><span>ns1-nginx   1/1     Running   0          11m   10.244.126.11   k8s-worker2   &lt;​non</span></span></code></pre></div><p>命名空间 ns1 中的 ns1-busybox 是否可以访问相同命名空间中的 ns1-nginx？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl exec -it ns1-busybox -n ns1 -- sh</span></span>
<span class="line"><span>/ # wget 10.244.126.11</span></span>
<span class="line"><span>Connecting to 10.244.126.11 (10.244.126.11:80)</span></span></code></pre></div><p>命名空间 ns2 中的 ns2-busybox 是否可以访问命名空间 ns1 中的 ns1-nginx？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl exec -it ns2-busybox -n ns2 -- sh</span></span>
<span class="line"><span>/ # wget 10.244.126.11</span></span>
<span class="line"><span>Connecting to 10.244.126.11 (10.244.126.11:80)</span></span>
<span class="line"><span>saving to &#39;index.html&#39;</span></span>
<span class="line"><span>index.html           100% |*********************|   615  0:00:00 ETA</span></span>
<span class="line"><span>&#39;index.html&#39; saved</span></span></code></pre></div><p>命名空间 ns1 中的 ns1-busybox-front 是否可以访问命名空间 ns1 中的 ns1-nginx？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@k8s-master ~]# kubectl exec -it ns1-busybox-front -n ns1 -- sh</span></span>
<span class="line"><span>/ # wget 10.244.126.11</span></span>
<span class="line"><span>Connecting to 10.244.126.11 (10.244.126.11:80)</span></span>
<span class="line"><span>saving to &#39;index.html&#39;</span></span>
<span class="line"><span>index.html           100% |*********************|   615  0:00:00 ETA</span></span>
<span class="line"><span>&#39;index.html&#39; saved</span></span></code></pre></div><p>上面的 3 个问题代表了我们使用 3 种不同来源的 Pod 来访问被保护的 Pod（ns1-nginx），从访问请求结果可以看出，命名空间 ns2 中的 Pod（ns2-busybox）可以访问 ns1-nginx，相同命名空间中带有 “app=front” 标签的 Pod（default-busybox）也可以访问 ns1-nginx，但是相同命名空间中没有标签的 Pod（ns1-busybox）无法访问 ns1-nginx，这与我们部署的网络策略的入口流量规则是一致。对于出口流量的规则，你可以自己设计实验验证一下。</p><h3 id="网络策略注意事项" tabindex="-1">网络策略注意事项 <a class="header-anchor" href="#网络策略注意事项" aria-label="Permalink to &quot;网络策略注意事项&quot;">​</a></h3><p>通过上面动手设计并部署网络策略，你已经了解了网络策略的使用方式。那么在实际配置网络策略时，你要注意以下几点。</p><p>首先，网络策略是白名单机制。一旦使用网络策略，只有明确定义的访问请求才会被允许放行。在没有使用网络策略之前，Pod 默认允许所有入口和出口的访问请求。但是，一旦在网络策略中配置了 policyTypes，包含了 Ingress 和 Egress，则只有符合配置规则的入口或者出口访问请求才能成功。</p><p>其次，要允许从来源 Pod 到目的 Pod 的某个连接，来源 Pod 的出口策略和目的 Pod 的入口策略都需要允许此连接。如果任何一方不允许此连接，则连接将会失败。</p><p>最后，可以为 Pod 设置多个网络策略，网络策略的规则是相加的，不会产生冲突。但应该避免创建过于复杂的网络策略，因为这可能会导致网络通信中断或延迟。</p><p>对于多个规则在同一个 from 或 to 属性中，如果多个条件在一个列表项中，则是“并且”的关系，所有条件要同时满足。如果多个条件是多个列表项，则是“或者”的关系，所有条件满足其中一个就会放行。看下面两个 YAML 文件，虽然多了一个 “-”，但是表达的意思完全不同。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span> ingress:</span></span>
<span class="line"><span> - from:</span></span>
<span class="line"><span>   - namespaceSelector:</span></span>
<span class="line"><span>       matchLabels:</span></span>
<span class="line"><span>         user: dev</span></span>
<span class="line"><span>   - podSelector:</span></span>
<span class="line"><span>       matchLabels:</span></span>
<span class="line"><span>         role: client</span></span>
<span class="line"><span> ...</span></span></code></pre></div><p>此策略在 from 数组中包含两个列表项（每个 “-” 就是一个列表项）。该策略允许来自带有“user=dev” 标签的命名空间中的所有 Pod 的访问，或者来自网络策略所在的命名空间中，带有 “role=client” 标签的所有 Pod 的访问 。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span> ingress:</span></span>
<span class="line"><span> - from:</span></span>
<span class="line"><span>   - namespaceSelector:</span></span>
<span class="line"><span>       matchLabels:</span></span>
<span class="line"><span>         user: dev</span></span>
<span class="line"><span>     podSelector:</span></span>
<span class="line"><span>       matchLabels:</span></span>
<span class="line"><span>         role: client</span></span>
<span class="line"><span> ...</span></span></code></pre></div><p>此策略在 from 数组中仅包含一个列表项（只有一个 “-”）。所以这个策略只允许来自带有“user=dev” 标签的命名空间中，且带有 “role=client” 标签的 Pod 的访问。</p><p>如果是同一命名空间中部署了多个网络策略，这些网络策略是“或者”的关系，只要命中其中一个规则，就可以对访问放行。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我带你了解了 K8s 集群中的网络安全策略（NetworkPolicy）。</p><p>首先，网络策略是 K8s 提供的针对内部 Pod 之间网络访问的控制机制，用于确保只有授权的流量才能进入或离开 Pod。网络策略由三个部分组成，Pod 选择器是通过标签来选择被保护的Pod。入口规则（Ingress）定义允许进入 Pod 的来源流量。出口规则（Egress）定义允许从Pod 流出的目标流量。</p><p>其次，网络策略可以通过 Pod 标签、命名空间标签和 IP 地址这三种不同维度来选择来源或者目标 Pod（或者 IP），同时也会根据访问请求的协议类型、端口来选择要控制的入口或出口请求。网络策略主要应用于 Pod 之间的访问隔离、命名空间之间的访问隔离以及设置 IP 白名单。</p><p>接着，我带你动手配置和验证了网络策略，学习了网络策略的 YAML 文件结构，注意podSelector、namespaceSelector 和 ipBlock 这 3 个属性，使用起来非常灵活，用来限制的访问请求的来源或目标。</p><p>最后，注意网络策略是白名单机制，多个规则可以同时生效，只要满足其中一个，就可以放行访问请求。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这就是今天的全部内容，在 CKA 中也会考到相关的知识点。我给你留一道练习题。</p><p>创建一个网络策略，只允许 dev 命名空间中的 Pod 访问 prod 命名空间中的 Pod 的 80 端口。</p><p>相信经过动手实践，会让你对知识的理解更加深刻。</p>`,64)])])}const g=n(l,[["render",o]]);export{u as __pageData,g as default};
