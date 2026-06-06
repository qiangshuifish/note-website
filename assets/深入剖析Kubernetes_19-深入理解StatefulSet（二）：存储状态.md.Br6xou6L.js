import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"19 | 深入理解StatefulSet（二）：存储状态","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"深入剖析Kubernetes/19-深入理解StatefulSet（二）：存储状态.md","filePath":"深入剖析Kubernetes/19-深入理解StatefulSet（二）：存储状态.md","lastUpdated":1779821023000}'),l={name:"深入剖析Kubernetes/19-深入理解StatefulSet（二）：存储状态.md"};function t(i,s,o,c,u,d){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_19-深入理解statefulset-二-存储状态" tabindex="-1">19 | 深入理解StatefulSet（二）：存储状态 <a class="header-anchor" href="#_19-深入理解statefulset-二-存储状态" aria-label="Permalink to &quot;19 | 深入理解StatefulSet（二）：存储状态&quot;">​</a></h1><p>你好，我是张磊。今天我和你分享的主题是：深入理解StatefulSet之存储状态。</p><p>在上一篇文章中，我和你分享了StatefulSet如何保证应用实例的拓扑状态，在Pod删除和再创建的过程中保持稳定。</p><p>而在今天这篇文章中，我将继续为你解读StatefulSet对存储状态的管理机制。这个机制，主要使用的是一个叫作Persistent Volume Claim的功能。</p><p>在前面介绍Pod的时候，我曾提到过，要在一个Pod里声明Volume，只要在Pod里加上spec.volumes字段即可。然后，你就可以在这个字段里定义一个具体类型的Volume了，比如：hostPath。</p><p>可是，你有没有想过这样一个场景： <strong>如果你并不知道有哪些Volume类型可以用，要怎么办呢</strong>？</p><p>更具体地说，作为一个应用开发者，我可能对持久化存储项目（比如Ceph、GlusterFS等）一窍不通，也不知道公司的Kubernetes集群里到底是怎么搭建出来的，我也自然不会编写它们对应的Volume定义文件。</p><p>所谓“术业有专攻”，这些关于Volume的管理和远程持久化存储的知识，不仅超越了开发者的知识储备，还会有暴露公司基础设施秘密的风险。</p><p>比如，下面这个例子，就是一个声明了Ceph RBD类型Volume的Pod：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Pod</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: rbd</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  containers:</span></span>
<span class="line"><span>    - image: kubernetes/pause</span></span>
<span class="line"><span>      name: rbd-rw</span></span>
<span class="line"><span>      volumeMounts:</span></span>
<span class="line"><span>      - name: rbdpd</span></span>
<span class="line"><span>        mountPath: /mnt/rbd</span></span>
<span class="line"><span>  volumes:</span></span>
<span class="line"><span>    - name: rbdpd</span></span>
<span class="line"><span>      rbd:</span></span>
<span class="line"><span>        monitors:</span></span>
<span class="line"><span>        - &#39;10.16.154.78:6789&#39;</span></span>
<span class="line"><span>        - &#39;10.16.154.82:6789&#39;</span></span>
<span class="line"><span>        - &#39;10.16.154.83:6789&#39;</span></span>
<span class="line"><span>        pool: kube</span></span>
<span class="line"><span>        image: foo</span></span>
<span class="line"><span>        fsType: ext4</span></span>
<span class="line"><span>        readOnly: true</span></span>
<span class="line"><span>        user: admin</span></span>
<span class="line"><span>        keyring: /etc/ceph/keyring</span></span>
<span class="line"><span>        imageformat: &quot;2&quot;</span></span>
<span class="line"><span>        imagefeatures: &quot;layering&quot;</span></span></code></pre></div><p>其一，如果不懂得Ceph RBD的使用方法，那么这个Pod里Volumes字段，你十有八九也完全看不懂。其二，这个Ceph RBD对应的存储服务器的地址、用户名、授权文件的位置，也都被轻易地暴露给了全公司的所有开发人员，这是一个典型的信息被“过度暴露”的例子。</p><p>这也是为什么，在后来的演化中， <strong>Kubernetes项目引入了一组叫作Persistent Volume Claim（PVC）和Persistent Volume（PV）的API对象，大大降低了用户声明和使用持久化Volume的门槛。</strong></p><p>举个例子，有了PVC之后，一个开发人员想要使用一个Volume，只需要简单的两步即可。</p><p><strong>第一步：定义一个PVC，声明想要的Volume的属性：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kind: PersistentVolumeClaim</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: pv-claim</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  accessModes:</span></span>
<span class="line"><span>  - ReadWriteOnce</span></span>
<span class="line"><span>  resources:</span></span>
<span class="line"><span>    requests:</span></span>
<span class="line"><span>      storage: 1Gi</span></span></code></pre></div><p>可以看到，在这个PVC对象里，不需要任何关于Volume细节的字段，只有描述性的属性和定义。比如，storage: 1Gi，表示我想要的Volume大小至少是1 GiB；accessModes: ReadWriteOnce，表示这个Volume的挂载方式是可读写，并且只能被挂载在一个节点上而非被多个节点共享。</p><blockquote><p>备注：关于哪种类型的Volume支持哪种类型的AccessMode，你可以查看Kubernetes项目官方文档中的 <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes" target="_blank" rel="noreferrer">详细列表</a>。</p></blockquote><p><strong>第二步：在应用的Pod中，声明使用这个PVC：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Pod</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: pv-pod</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  containers:</span></span>
<span class="line"><span>    - name: pv-container</span></span>
<span class="line"><span>      image: nginx</span></span>
<span class="line"><span>      ports:</span></span>
<span class="line"><span>        - containerPort: 80</span></span>
<span class="line"><span>          name: &quot;http-server&quot;</span></span>
<span class="line"><span>      volumeMounts:</span></span>
<span class="line"><span>        - mountPath: &quot;/usr/share/nginx/html&quot;</span></span>
<span class="line"><span>          name: pv-storage</span></span>
<span class="line"><span>  volumes:</span></span>
<span class="line"><span>    - name: pv-storage</span></span>
<span class="line"><span>      persistentVolumeClaim:</span></span>
<span class="line"><span>        claimName: pv-claim</span></span></code></pre></div><p>可以看到，在这个Pod的Volumes定义中，我们只需要声明它的类型是persistentVolumeClaim，然后指定PVC的名字，而完全不必关心Volume本身的定义。</p><p>这时候，只要我们创建这个PVC对象，Kubernetes就会自动为它绑定一个符合条件的Volume。可是，这些符合条件的Volume又是从哪里来的呢？</p><p>答案是，它们来自于由运维人员维护的PV（Persistent Volume）对象。接下来，我们一起看一个常见的PV对象的YAML文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kind: PersistentVolume</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: pv-volume</span></span>
<span class="line"><span>  labels:</span></span>
<span class="line"><span>    type: local</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  capacity:</span></span>
<span class="line"><span>    storage: 10Gi</span></span>
<span class="line"><span>  accessModes:</span></span>
<span class="line"><span>    - ReadWriteOnce</span></span>
<span class="line"><span>  rbd:</span></span>
<span class="line"><span>    monitors:</span></span>
<span class="line"><span>    # 使用 kubectl get pods -n rook-ceph 查看 rook-ceph-mon- 开头的 POD IP 即可得下面的列表</span></span>
<span class="line"><span>    - &#39;10.16.154.78:6789&#39;</span></span>
<span class="line"><span>    - &#39;10.16.154.82:6789&#39;</span></span>
<span class="line"><span>    - &#39;10.16.154.83:6789&#39;</span></span>
<span class="line"><span>    pool: kube</span></span>
<span class="line"><span>    image: foo</span></span>
<span class="line"><span>    fsType: ext4</span></span>
<span class="line"><span>    readOnly: true</span></span>
<span class="line"><span>    user: admin</span></span>
<span class="line"><span>    keyring: /etc/ceph/keyring</span></span></code></pre></div><p>可以看到，这个PV对象的spec.rbd字段，正是我们前面介绍过的Ceph RBD Volume的详细定义。而且，它还声明了这个PV的容量是10 GiB。这样，Kubernetes就会为我们刚刚创建的PVC对象绑定这个PV。</p><p>所以，Kubernetes中PVC和PV的设计， <strong>实际上类似于“接口”和“实现”的思想</strong>。开发者只要知道并会使用“接口”，即：PVC；而运维人员则负责给“接口”绑定具体的实现，即：PV。</p><p>这种解耦，就避免了因为向开发者暴露过多的存储系统细节而带来的隐患。此外，这种职责的分离，往往也意味着出现事故时可以更容易定位问题和明确责任，从而避免“扯皮”现象的出现。</p><p>而PVC、PV的设计，也使得StatefulSet对存储状态的管理成为了可能。我们还是以上一篇文章中用到的StatefulSet为例（你也可以借此再回顾一下 <a href="https://time.geekbang.org/column/article/41017" target="_blank" rel="noreferrer">《深入理解StatefulSet（一）：拓扑状态》</a> 中的相关内容）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apiVersion: apps/v1</span></span>
<span class="line"><span>kind: StatefulSet</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: web</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  serviceName: &quot;nginx&quot;</span></span>
<span class="line"><span>  replicas: 2</span></span>
<span class="line"><span>  selector:</span></span>
<span class="line"><span>    matchLabels:</span></span>
<span class="line"><span>      app: nginx</span></span>
<span class="line"><span>  template:</span></span>
<span class="line"><span>    metadata:</span></span>
<span class="line"><span>      labels:</span></span>
<span class="line"><span>        app: nginx</span></span>
<span class="line"><span>    spec:</span></span>
<span class="line"><span>      containers:</span></span>
<span class="line"><span>      - name: nginx</span></span>
<span class="line"><span>        image: nginx:1.9.1</span></span>
<span class="line"><span>        ports:</span></span>
<span class="line"><span>        - containerPort: 80</span></span>
<span class="line"><span>          name: web</span></span>
<span class="line"><span>        volumeMounts:</span></span>
<span class="line"><span>        - name: www</span></span>
<span class="line"><span>          mountPath: /usr/share/nginx/html</span></span>
<span class="line"><span>  volumeClaimTemplates:</span></span>
<span class="line"><span>  - metadata:</span></span>
<span class="line"><span>      name: www</span></span>
<span class="line"><span>    spec:</span></span>
<span class="line"><span>      accessModes:</span></span>
<span class="line"><span>      - ReadWriteOnce</span></span>
<span class="line"><span>      resources:</span></span>
<span class="line"><span>        requests:</span></span>
<span class="line"><span>          storage: 1Gi</span></span></code></pre></div><p>这次，我们为这个StatefulSet额外添加了一个volumeClaimTemplates字段。从名字就可以看出来，它跟Deployment里Pod模板（PodTemplate）的作用类似。也就是说，凡是被这个StatefulSet管理的Pod，都会声明一个对应的PVC；而这个PVC的定义，就来自于volumeClaimTemplates这个模板字段。更重要的是，这个PVC的名字，会被分配一个与这个Pod完全一致的编号。</p><p>这个自动创建的PVC，与PV绑定成功后，就会进入Bound状态，这就意味着这个Pod可以挂载并使用这个PV了。</p><p>如果你还是不太理解PVC的话，可以先记住这样一个结论： <strong>PVC其实就是一种特殊的Volume</strong>。只不过一个PVC具体是什么类型的Volume，要在跟某个PV绑定之后才知道。关于PV、PVC更详细的知识，我会在容器存储部分做进一步解读。</p><p>当然，PVC与PV的绑定得以实现的前提是，运维人员已经在系统里创建好了符合条件的PV（比如，我们在前面用到的pv-volume）；或者，你的Kubernetes集群运行在公有云上，这样Kubernetes就会通过Dynamic Provisioning的方式，自动为你创建与PVC匹配的PV。</p><p>所以，我们在使用kubectl create创建了StatefulSet之后，就会看到Kubernetes集群里出现了两个PVC：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ kubectl create -f statefulset.yaml</span></span>
<span class="line"><span>$ kubectl get pvc -l app=nginx</span></span>
<span class="line"><span>NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE</span></span>
<span class="line"><span>www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s</span></span>
<span class="line"><span>www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s</span></span></code></pre></div><p>可以看到，这些PVC，都以“&lt;​PVC名字&gt;-&lt;​StatefulSet名字&gt;-&lt;编号&gt;”的方式命名，并且处于Bound状态。</p><p>我们前面已经讲到过，这个StatefulSet创建出来的所有Pod，都会声明使用编号的PVC。比如，在名叫web-0的Pod的volumes字段，它会声明使用名叫www-web-0的PVC，从而挂载到这个PVC所绑定的PV。</p><p>所以，我们就可以使用如下所示的指令，在Pod的Volume目录里写入一个文件，来验证一下上述Volume的分配情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ for i in 0 1; do kubectl exec web-$i -- sh -c &#39;echo hello $(hostname) &gt; /usr/share/nginx/html/index.html&#39;; done</span></span></code></pre></div><p>如上所示，通过kubectl exec指令，我们在每个Pod的Volume目录里，写入了一个index.html文件。这个文件的内容，正是Pod的hostname。比如，我们在web-0的index.html里写入的内容就是&quot;hello web-0&quot;。</p><p>此时，如果你在这个Pod容器里访问 <code>“http://localhost”</code>，你实际访问到的就是Pod里Nginx服务器进程，而它会为你返回/usr/share/nginx/html/index.html里的内容。这个操作的执行方法如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ for i in 0 1; do kubectl exec -it web-$i -- curl localhost; done</span></span>
<span class="line"><span>hello web-0</span></span>
<span class="line"><span>hello web-1</span></span></code></pre></div><p>现在，关键来了。</p><p>如果你使用kubectl delete命令删除这两个Pod，这些Volume里的文件会不会丢失呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ kubectl delete pod -l app=nginx</span></span>
<span class="line"><span>pod &quot;web-0&quot; deleted</span></span>
<span class="line"><span>pod &quot;web-1&quot; deleted</span></span></code></pre></div><p>可以看到，正如我们前面介绍过的，在被删除之后，这两个Pod会被按照编号的顺序被重新创建出来。而这时候，如果你在新创建的容器里通过访问 <code>“http://localhost”</code> 的方式去访问web-0里的Nginx服务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 在被重新创建出来的Pod容器里访问http://localhost</span></span>
<span class="line"><span>$ kubectl exec -it web-0 -- curl localhost</span></span>
<span class="line"><span>hello web-0</span></span></code></pre></div><p>就会发现，这个请求依然会返回：hello web-0。也就是说，原先与名叫web-0的Pod绑定的PV，在这个Pod被重新创建之后，依然同新的名叫web-0的Pod绑定在了一起。对于Pod web-1来说，也是完全一样的情况。</p><p><strong>这是怎么做到的呢？</strong></p><p>其实，我和你分析一下StatefulSet控制器恢复这个Pod的过程，你就可以很容易理解了。</p><p>首先，当你把一个Pod，比如web-0，删除之后，这个Pod对应的PVC和PV，并不会被删除，而这个Volume里已经写入的数据，也依然会保存在远程存储服务里（比如，我们在这个例子里用到的Ceph服务器）。</p><p>此时，StatefulSet控制器发现，一个名叫web-0的Pod消失了。所以，控制器就会重新创建一个新的、名字还是叫作web-0的Pod来，“纠正”这个不一致的情况。</p><p>需要注意的是，在这个新的Pod对象的定义里，它声明使用的PVC的名字，还是叫作：www-web-0。这个PVC的定义，还是来自于PVC模板（volumeClaimTemplates），这是StatefulSet创建Pod的标准流程。</p><p>所以，在这个新的web-0 Pod被创建出来之后，Kubernetes为它查找名叫www-web-0的PVC时，就会直接找到旧Pod遗留下来的同名的PVC，进而找到跟这个PVC绑定在一起的PV。</p><p>这样，新的Pod就可以挂载到旧Pod对应的那个Volume，并且获取到保存在Volume里的数据。</p><p><strong>通过这种方式，Kubernetes的StatefulSet就实现了对应用存储状态的管理。</strong></p><p>看到这里，你是不是已经大致理解了StatefulSet的工作原理呢？现在，我再为你详细梳理一下吧。</p><p><strong>首先，StatefulSet的控制器直接管理的是Pod</strong>。这是因为，StatefulSet里的不同Pod实例，不再像ReplicaSet中那样都是完全一样的，而是有了细微区别的。比如，每个Pod的hostname、名字等都是不同的、携带了编号的。而StatefulSet区分这些实例的方式，就是通过在Pod的名字里加上事先约定好的编号。</p><p><strong>其次，Kubernetes通过Headless Service，为这些有编号的Pod，在DNS服务器中生成带有同样编号的DNS记录</strong>。只要StatefulSet能够保证这些Pod名字里的编号不变，那么Service里类似于web-0.nginx.default.svc.cluster.local这样的DNS记录也就不会变，而这条记录解析出来的Pod的IP地址，则会随着后端Pod的删除和再创建而自动更新。这当然是Service机制本身的能力，不需要StatefulSet操心。</p><p><strong>最后，StatefulSet还为每一个Pod分配并创建一个同样编号的PVC</strong>。这样，Kubernetes就可以通过Persistent Volume机制为这个PVC绑定上对应的PV，从而保证了每一个Pod都拥有一个独立的Volume。</p><p>在这种情况下，即使Pod被删除，它所对应的PVC和PV依然会保留下来。所以当这个Pod被重新创建出来之后，Kubernetes会为它找到同样编号的PVC，挂载这个PVC对应的Volume，从而获取到以前保存在Volume里的数据。</p><p>这么一看，原本非常复杂的StatefulSet，是不是也很容易理解了呢？</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在今天这篇文章中，我为你详细介绍了StatefulSet处理存储状态的方法。然后，以此为基础，我为你梳理了StatefulSet控制器的工作原理。</p><p>从这些讲述中，我们不难看出StatefulSet的设计思想：StatefulSet其实就是一种特殊的Deployment，而其独特之处在于，它的每个Pod都被编号了。而且，这个编号会体现在Pod的名字和hostname等标识信息上，这不仅代表了Pod的创建顺序，也是Pod的重要网络标识（即：在整个集群里唯一的、可被访问的身份）。</p><p>有了这个编号后，StatefulSet就使用Kubernetes里的两个标准功能：Headless Service和PV/PVC，实现了对Pod的拓扑状态和存储状态的维护。</p><p>实际上，在下一篇文章的“有状态应用”实践环节，以及后续的讲解中，你就会逐渐意识到，StatefulSet可以说是Kubernetes中作业编排的“集大成者”。</p><p>因为，几乎每一种Kubernetes的编排功能，都可以在编写StatefulSet的YAML文件时被用到。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在实际场景中，有一些分布式应用的集群是这么工作的：当一个新节点加入到集群时，或者老节点被迁移后重建时，这个节点可以从主节点或者其他从节点那里同步到自己所需要的数据。</p><p>在这种情况下，你认为是否还有必要将这个节点Pod与它的PV进行一对一绑定呢？（提示：这个问题的答案根据不同的项目是不同的。关键在于，重建后的节点进行数据恢复和同步的时候，是不是一定需要原先它写在本地磁盘里的数据）</p><p>感谢你的收听，欢迎你给我留言，也欢迎分享给更多的朋友一起阅读。</p>`,71)])])}const P=n(l,[["render",t]]);export{m as __pageData,P as default};
