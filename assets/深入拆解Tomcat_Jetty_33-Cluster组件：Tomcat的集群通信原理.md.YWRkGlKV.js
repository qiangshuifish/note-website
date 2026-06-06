import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"33 | Cluster组件：Tomcat的集群通信原理","description":"","frontmatter":{},"headers":[{"level":2,"title":"集群通信原理","slug":"集群通信原理","link":"#集群通信原理","children":[]},{"level":2,"title":"集群通信配置","slug":"集群通信配置","link":"#集群通信配置","children":[]},{"level":2,"title":"集群工作过程","slug":"集群工作过程","link":"#集群工作过程","children":[]},{"level":2,"title":"本期精华","slug":"本期精华","link":"#本期精华","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"深入拆解Tomcat&Jetty/33-Cluster组件：Tomcat的集群通信原理.md","filePath":"深入拆解Tomcat&Jetty/33-Cluster组件：Tomcat的集群通信原理.md","lastUpdated":1779821049000}'),t={name:"深入拆解Tomcat&Jetty/33-Cluster组件：Tomcat的集群通信原理.md"};function l(i,s,o,c,r,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_33-cluster组件-tomcat的集群通信原理" tabindex="-1">33 | Cluster组件：Tomcat的集群通信原理 <a class="header-anchor" href="#_33-cluster组件-tomcat的集群通信原理" aria-label="Permalink to &quot;33 | Cluster组件：Tomcat的集群通信原理&quot;">​</a></h1><p>为了支持水平扩展和高可用，Tomcat提供了集群部署的能力，但与此同时也带来了分布式系统的一个通用问题，那就是如何在集群中的多个节点之间保持数据的一致性，比如会话（Session）信息。</p><p>要实现这一点，基本上有两种方式，一种是把所有Session数据放到一台服务器或者一个数据库中，集群中的所有节点通过访问这台Session服务器来获取数据。另一种方式就是在集群中的节点间进行Session数据的同步拷贝，这里又分为两种策略：第一种是将一个节点的Session拷贝到集群中其他所有节点；第二种是只将一个节点上的Session数据拷贝到另一个备份节点。</p><p>对于Tomcat的Session管理来说，这两种方式都支持。今天我们就来看看第二种方式的实现原理，也就是Tomcat集群通信的原理和配置方法，最后通过官网上的一个例子来了解下Tomcat集群到底是如何工作的。</p><h2 id="集群通信原理" tabindex="-1">集群通信原理 <a class="header-anchor" href="#集群通信原理" aria-label="Permalink to &quot;集群通信原理&quot;">​</a></h2><p>要实现集群通信，首先要知道集群中都有哪些成员。Tomcat是通过 <strong>组播</strong>（Multicast）来实现的。那什么是组播呢？为了理解组播，我先来说说什么是“单播”。网络节点之间的通信就好像是人们之间的对话一样，一个人对另外一个人说话，此时信息的接收和传递只在两个节点之间进行，比如你在收发电子邮件、浏览网页时，使用的就是单播，也就是我们熟悉的“点对点通信”。</p><p>如果一台主机需要将同一个消息发送多个主机逐个传输，效率就会比较低，于是就出现组播技术。组播是 <strong>一台主机向指定的一组主机发送数据报包</strong>，组播通信的过程是这样的：每一个Tomcat节点在启动时和运行时都会周期性（默认500毫秒）发送组播心跳包，同一个集群内的节点都在相同的 <strong>组播地址</strong> 和 <strong>端口</strong> 监听这些信息；在一定的时间内（默认3秒）不发送 <strong>组播报文</strong> 的节点就会被认为已经崩溃了，会从集群中删去。因此通过组播，集群中每个成员都能维护一个集群成员列表。</p><h2 id="集群通信配置" tabindex="-1">集群通信配置 <a class="header-anchor" href="#集群通信配置" aria-label="Permalink to &quot;集群通信配置&quot;">​</a></h2><p>有了集群成员的列表，集群中的节点就能通过TCP连接向其他节点传输Session数据。Tomcat通过SimpleTcpCluster类来进行会话复制（In-Memory Replication）。要开启集群功能，只需要将 <code>server.xml</code> 里的这一行的注释去掉就行：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/110335/45760766a99cad8a1e7001beae6d5589.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/110335/45760766a99cad8a1e7001beae6d5589.png" alt=""></a></p><p>变成这样：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/110335/99d7bd2cebfd19dfd4d702351a4450bb.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/110335/99d7bd2cebfd19dfd4d702351a4450bb.png" alt=""></a></p><p>虽然只是简单的一行配置，但这一行配置等同于下面这样的配置，也就是说Tomcat给我们设置了很多默认参数，这些参数都跟集群通信有关。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!--</span></span>
<span class="line"><span>  SimpleTcpCluster是用来复制Session的组件。复制Session有同步和异步两种方式：</span></span>
<span class="line"><span>  同步模式下，向浏览器的发送响应数据前，需要先将Session拷贝到其他节点完；</span></span>
<span class="line"><span>  异步模式下，无需等待Session拷贝完成就可响应。异步模式更高效，但是同步模式</span></span>
<span class="line"><span>  可靠性更高。</span></span>
<span class="line"><span>  同步异步模式由channelSendOptions参数控制，默认值是8，为异步模式；4是同步模式。</span></span>
<span class="line"><span>  在异步模式下，可以通过加上&quot;拷贝确认&quot;（Acknowledge）来提高可靠性，此时</span></span>
<span class="line"><span>  channelSendOptions设为10</span></span>
<span class="line"><span>--&gt;</span></span>
<span class="line"><span>&lt;​Cluster className=&quot;org.apache.catalina.ha.tcp.SimpleTcpCluster&quot;</span></span>
<span class="line"><span>                 channelSendOptions=&quot;8&quot;&gt;</span></span>
<span class="line"><span>   &lt;!--</span></span>
<span class="line"><span>    Manager决定如何管理集群的Session信息。</span></span>
<span class="line"><span>    Tomcat提供了两种Manager：BackupManager和DeltaManager。</span></span>
<span class="line"><span>    BackupManager－集群下的某一节点的Session，将复制到一个备份节点。</span></span>
<span class="line"><span>    DeltaManager－ 集群下某一节点的Session，将复制到所有其他节点。</span></span>
<span class="line"><span>    DeltaManager是Tomcat默认的集群Manager。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    expireSessionsOnShutdown－设置为true时，一个节点关闭时，</span></span>
<span class="line"><span>    将导致集群下的所有Session失效</span></span>
<span class="line"><span>    notifyListenersOnReplication－集群下节点间的Session复制、</span></span>
<span class="line"><span>    删除操作，是否通知session listeners</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    maxInactiveInterval－集群下Session的有效时间(单位:s)。</span></span>
<span class="line"><span>    maxInactiveInterval内未活动的Session，将被Tomcat回收。</span></span>
<span class="line"><span>    默认值为1800(30min)</span></span>
<span class="line"><span>  --&gt;</span></span>
<span class="line"><span>  &lt;​Manager className=&quot;org.apache.catalina.ha.session.DeltaManager&quot;</span></span>
<span class="line"><span>                   expireSessionsOnShutdown=&quot;false&quot;</span></span>
<span class="line"><span>                   notifyListenersOnReplication=&quot;true&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &lt;!--</span></span>
<span class="line"><span>    Channel是Tomcat节点之间进行通讯的工具。</span></span>
<span class="line"><span>    Channel包括5个组件：Membership、Receiver、Sender、</span></span>
<span class="line"><span>    Transport、Interceptor</span></span>
<span class="line"><span>   --&gt;</span></span>
<span class="line"><span>  &lt;Channel className=&quot;org.apache.catalina.tribes.group.GroupChannel&quot;&gt;</span></span>
<span class="line"><span>     &lt;!--</span></span>
<span class="line"><span>      Membership维护集群的可用节点列表。它可以检查到新增的节点，</span></span>
<span class="line"><span>      也可以检查没有心跳的节点</span></span>
<span class="line"><span>      className－指定Membership使用的类</span></span>
<span class="line"><span>      address－组播地址</span></span>
<span class="line"><span>      port－组播端口</span></span>
<span class="line"><span>      frequency－发送心跳(向组播地址发送UDP数据包)的时间间隔(单位:ms)。</span></span>
<span class="line"><span>      dropTime－Membership在dropTime(单位:ms)内未收到某一节点的心跳，</span></span>
<span class="line"><span>      则将该节点从可用节点列表删除。默认值为3000。</span></span>
<span class="line"><span>     --&gt;</span></span>
<span class="line"><span>     &lt;​Membership  className=&quot;org.apache.catalina.tribes.membership.</span></span>
<span class="line"><span>         McastService&quot;</span></span>
<span class="line"><span>         address=&quot;228.0.0.4&quot;</span></span>
<span class="line"><span>         port=&quot;45564&quot;</span></span>
<span class="line"><span>         frequency=&quot;500&quot;</span></span>
<span class="line"><span>         dropTime=&quot;3000&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;!--</span></span>
<span class="line"><span>       Receiver用于各个节点接收其他节点发送的数据。</span></span>
<span class="line"><span>       接收器分为两种：BioReceiver(阻塞式)、NioReceiver(非阻塞式)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>       className－指定Receiver使用的类</span></span>
<span class="line"><span>       address－接收消息的地址</span></span>
<span class="line"><span>       port－接收消息的端口</span></span>
<span class="line"><span>       autoBind－端口的变化区间，如果port为4000，autoBind为100，</span></span>
<span class="line"><span>                 接收器将在4000-4099间取一个端口进行监听。</span></span>
<span class="line"><span>       selectorTimeout－NioReceiver内Selector轮询的超时时间</span></span>
<span class="line"><span>       maxThreads－线程池的最大线程数</span></span>
<span class="line"><span>     --&gt;</span></span>
<span class="line"><span>     &lt;​Receiver className=&quot;org.apache.catalina.tribes.transport.nio.</span></span>
<span class="line"><span>         NioReceiver&quot;</span></span>
<span class="line"><span>         address=&quot;auto&quot;</span></span>
<span class="line"><span>         port=&quot;4000&quot;</span></span>
<span class="line"><span>         autoBind=&quot;100&quot;</span></span>
<span class="line"><span>         selectorTimeout=&quot;5000&quot;</span></span>
<span class="line"><span>         maxThreads=&quot;6&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      &lt;!--</span></span>
<span class="line"><span>         Sender用于向其他节点发送数据，Sender内嵌了Transport组件，</span></span>
<span class="line"><span>         Transport真正负责发送消息。</span></span>
<span class="line"><span>      --&gt;</span></span>
<span class="line"><span>      &lt;​Sender className=&quot;org.apache.catalina.tribes.transport.</span></span>
<span class="line"><span>          ReplicationTransmitter&quot;&gt;</span></span>
<span class="line"><span>          &lt;!--</span></span>
<span class="line"><span>            Transport分为两种：bio.PooledMultiSender(阻塞式)</span></span>
<span class="line"><span>            和nio.PooledParallelSender(非阻塞式)，PooledParallelSender</span></span>
<span class="line"><span>            是从tcp连接池中获取连接，可以实现并行发送，即集群中的节点可以</span></span>
<span class="line"><span>            同时向其他所有节点发送数据而互不影响。</span></span>
<span class="line"><span>           --&gt;</span></span>
<span class="line"><span>          &lt;​Transport className=&quot;org.apache.catalina.tribes.</span></span>
<span class="line"><span>          transport.nio.PooledParallelSender&quot;/&gt;</span></span>
<span class="line"><span>       &lt;/Sender&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>       &lt;!--</span></span>
<span class="line"><span>         Interceptor : Cluster的拦截器</span></span>
<span class="line"><span>         TcpFailureDetector－TcpFailureDetector可以拦截到某个节点关闭</span></span>
<span class="line"><span>         的信息，并尝试通过TCP连接到此节点，以确保此节点真正关闭，从而更新集</span></span>
<span class="line"><span>         群可用节点列表</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>       &lt;​Interceptor className=&quot;org.apache.catalina.tribes.group.</span></span>
<span class="line"><span>       interceptors.TcpFailureDetector&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>       &lt;!--</span></span>
<span class="line"><span>         MessageDispatchInterceptor－查看Cluster组件发送消息的</span></span>
<span class="line"><span>         方式是否设置为Channel.SEND_OPTIONS_ASYNCHRONOUS，如果是，</span></span>
<span class="line"><span>         MessageDispatchInterceptor先将等待发送的消息进行排队，</span></span>
<span class="line"><span>         然后将排好队的消息转给Sender。</span></span>
<span class="line"><span>        --&gt;</span></span>
<span class="line"><span>       &lt;​Interceptor className=&quot;org.apache.catalina.tribes.group.</span></span>
<span class="line"><span>       interceptors.MessageDispatchInterceptor&quot;/&gt;</span></span>
<span class="line"><span>  &lt;/Channel&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!--</span></span>
<span class="line"><span>    Valve : Tomcat的拦截器，</span></span>
<span class="line"><span>    ReplicationValve－在处理请求前后打日志；过滤不涉及Session变化的请求。</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>  &lt;​Valve className=&quot;org.apache.catalina.ha.tcp.ReplicationValve&quot;</span></span>
<span class="line"><span>    filter=&quot;&quot;/&gt;</span></span>
<span class="line"><span>  &lt;​Valve className=&quot;org.apache.catalina.ha.session.</span></span>
<span class="line"><span>  JvmRouteBinderValve&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!--</span></span>
<span class="line"><span>    Deployer用于集群的farm功能，监控应用中文件的更新，以保证集群中所有节点</span></span>
<span class="line"><span>    应用的一致性，如某个用户上传文件到集群中某个节点的应用程序目录下，Deployer</span></span>
<span class="line"><span>    会监测到这一操作并把文件拷贝到集群中其他节点相同应用的对应目录下以保持</span></span>
<span class="line"><span>    所有应用的一致，这是一个相当强大的功能。</span></span>
<span class="line"><span>  --&gt;</span></span>
<span class="line"><span>  &lt;​Deployer className=&quot;org.apache.catalina.ha.deploy.FarmWarDeployer&quot;</span></span>
<span class="line"><span>     tempDir=&quot;/tmp/war-temp/&quot;</span></span>
<span class="line"><span>     deployDir=&quot;/tmp/war-deploy/&quot;</span></span>
<span class="line"><span>     watchDir=&quot;/tmp/war-listen/&quot;</span></span>
<span class="line"><span>     watchEnabled=&quot;false&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!--</span></span>
<span class="line"><span>    ClusterListener : 监听器，监听Cluster组件接收的消息</span></span>
<span class="line"><span>    使用DeltaManager时，Cluster接收的信息通过ClusterSessionListener</span></span>
<span class="line"><span>    传递给DeltaManager，从而更新自己的Session列表。</span></span>
<span class="line"><span>    --&gt;</span></span>
<span class="line"><span>  &lt;​ClusterListener className=&quot;org.apache.catalina.ha.session.</span></span>
<span class="line"><span>  ClusterSessionListener&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/Cluster&gt;</span></span></code></pre></div><p>从上面的的参数列表可以看到，默认情况下Session管理组件DeltaManager会在节点之间拷贝Session，DeltaManager采用的一种all-to-all的工作方式，即集群中的节点会把Session数据向所有其他节点拷贝，而不管其他节点是否部署了当前应用。当集群节点数比较少时，比如少于4个，这种all-to-all的方式是不错的选择；但是当集群中的节点数量比较多时，数据拷贝的开销成指数级增长，这种情况下可以考虑BackupManager，BackupManager只向一个备份节点拷贝数据。</p><p>在大体了解了Tomcat集群实现模型后，就可以对集群作出更优化的配置了。Tomcat推荐了一套配置，使用了比DeltaManager更高效的BackupManager，并且通过ReplicationValve设置了请求过滤。</p><p>这里还请注意在一台服务器部署多个节点时需要修改Receiver的侦听端口，另外为了在节点间高效地拷贝数据，所有Tomcat节点最好采用相同的配置，具体配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;​Cluster className=&quot;org.apache.catalina.ha.tcp.SimpleTcpCluster&quot;</span></span>
<span class="line"><span>                 channelSendOptions=&quot;6&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;​Manager className=&quot;org.apache.catalina.ha.session.BackupManager&quot;</span></span>
<span class="line"><span>                   expireSessionsOnShutdown=&quot;false&quot;</span></span>
<span class="line"><span>                   notifyListenersOnReplication=&quot;true&quot;</span></span>
<span class="line"><span>                   mapSendOptions=&quot;6&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Channel className=&quot;org.apache.catalina.tribes.group.</span></span>
<span class="line"><span>     GroupChannel&quot;&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Membership className=&quot;org.apache.catalina.tribes.membership.</span></span>
<span class="line"><span>     McastService&quot;</span></span>
<span class="line"><span>       address=&quot;228.0.0.4&quot;</span></span>
<span class="line"><span>       port=&quot;45564&quot;</span></span>
<span class="line"><span>       frequency=&quot;500&quot;</span></span>
<span class="line"><span>       dropTime=&quot;3000&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Receiver className=&quot;org.apache.catalina.tribes.transport.nio.</span></span>
<span class="line"><span>     NioReceiver&quot;</span></span>
<span class="line"><span>       address=&quot;auto&quot;</span></span>
<span class="line"><span>       port=&quot;5000&quot;</span></span>
<span class="line"><span>       selectorTimeout=&quot;100&quot;</span></span>
<span class="line"><span>       maxThreads=&quot;6&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Sender className=&quot;org.apache.catalina.tribes.transport.</span></span>
<span class="line"><span>     ReplicationTransmitter&quot;&gt;</span></span>
<span class="line"><span>          &lt;​Transport className=&quot;org.apache.catalina.tribes.transport.</span></span>
<span class="line"><span>          nio.PooledParallelSender&quot;/&gt;</span></span>
<span class="line"><span>     &lt;/Sender&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Interceptor className=&quot;org.apache.catalina.tribes.group.</span></span>
<span class="line"><span>     interceptors.TcpFailureDetector&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Interceptor className=&quot;org.apache.catalina.tribes.group.</span></span>
<span class="line"><span>     interceptors.MessageDispatchInterceptor&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &lt;​Interceptor className=&quot;org.apache.catalina.tribes.group.</span></span>
<span class="line"><span>     interceptors.ThroughputInterceptor&quot;/&gt;</span></span>
<span class="line"><span>   &lt;/Channel&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &lt;​Valve className=&quot;org.apache.catalina.ha.tcp.ReplicationValve&quot;</span></span>
<span class="line"><span>       filter=&quot;.*\\.gif|.*\\.js|.*\\.jpeg|.*\\.jpg|.*\\.png|.*\\</span></span>
<span class="line"><span>               .htm|.*\\.html|.*\\.css|.*\\.txt&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &lt;​Deployer className=&quot;org.apache.catalina.ha.deploy.FarmWarDeployer&quot;</span></span>
<span class="line"><span>       tempDir=&quot;/tmp/war-temp/&quot;</span></span>
<span class="line"><span>       deployDir=&quot;/tmp/war-deploy/&quot;</span></span>
<span class="line"><span>       watchDir=&quot;/tmp/war-listen/&quot;</span></span>
<span class="line"><span>       watchEnabled=&quot;false&quot;/&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;​ClusterListener className=&quot;org.apache.catalina.ha.session.</span></span>
<span class="line"><span>    ClusterSessionListener&quot;/&gt;</span></span>
<span class="line"><span>&lt;/Cluster&gt;</span></span></code></pre></div><h2 id="集群工作过程" tabindex="-1">集群工作过程 <a class="header-anchor" href="#集群工作过程" aria-label="Permalink to &quot;集群工作过程&quot;">​</a></h2><p>Tomcat的官网给出了一个例子，来说明Tomcat集群模式下是如何工作的，以及Tomcat集群是如何实现高可用的。比如集群由Tomcat A和Tomcat B两个Tomcat实例组成，按照时间先后顺序发生了如下事件：</p><p><strong>1. Tomcat A启动</strong></p><p>Tomcat A启动过程中，当Host对象被创建时，一个Cluster组件（默认是SimpleTcpCluster）被关联到这个Host对象。当某个应用在 <code>web.xml</code> 中设置了Distributable时，Tomcat将为此应用的上下文环境创建一个DeltaManager。SimpleTcpCluster启动Membership服务和Replication服务。</p><p><strong>2. Tomcat B启动（在Tomcat A之后启动）</strong></p><p>首先Tomcat B会执行和Tomcat A一样的操作，然后SimpleTcpCluster会建立一个由Tomcat A和Tomcat B组成的Membership。接着Tomcat B向集群中的Tomcat A请求Session数据，如果Tomcat A没有响应Tomcat B的拷贝请求，Tomcat B会在60秒后time out。在Session数据拷贝完成之前Tomcat B不会接收浏览器的请求。</p><p><strong>3. Tomcat A接收HTTP请求，创建Session 1</strong></p><p>Tomcat A响应客户请求，在把结果发送回客户端之前，ReplicationValve会拦截当前请求（如果Filter中配置了不需拦截的请求类型，这一步就不会进行，默认配置下拦截所有请求），如果发现当前请求更新了Session，就调用Replication服务建立TCP连接将Session拷贝到Membership列表中的其他节点即Tomcat B。在拷贝时，所有保存在当前Session中的可序列化的对象都会被拷贝，而不仅仅是发生更新的部分。</p><p><strong>4. Tomcat A崩溃</strong></p><p>当Tomcat A崩溃时，Tomcat B会被告知Tomcat A已从集群中退出，然后Tomcat B就会把Tomcat A从自己的Membership列表中删除。并且Tomcat B的Session更新时不再往Tomcat A拷贝，同时负载均衡器会把后续的HTTP请求全部转发给Tomcat B。在此过程中所有的Session数据不会丢失。</p><p><strong>5. Tomcat B接收Tomcat A的请求</strong></p><p>Tomcat B正常响应本应该发往Tomcat A的请求，因为Tomcat B保存了Tomcat A的所有Session数据。</p><p><strong>6. Tomcat A重新启动</strong></p><p>Tomcat A按步骤1、2操作启动，加入集群，并从Tomcat B拷贝所有Session数据，拷贝完成后开始接收请求。</p><p><strong>7. Tomcat A接收请求，Session 1被用户注销</strong></p><p>Tomcat继续接收发往Tomcat A的请求，Session 1设置为失效。请注意这里的失效并非因为Tomcat A处于非活动状态超过设置的时间，而是应用程序执行了注销的操作（比如用户登出）而引起的Session失效。这时Tomcat A向Tomcat B发送一个Session 1 Expired的消息，Tomcat B收到消息后也会把Session 1设置为失效。</p><p><strong>8. Tomcat B接收到一个新请求，创建Session 2</strong></p><p>同理这个新的Session也会被拷贝到Tomcat A。</p><p><strong>9. Tomcat A上的Session 2过期</strong></p><p>因超时原因引起的Session失效Tomcat A无需通知Tomcat B，Tomcat B同样知道Session 2已经超时。因此对于Tomcat集群有一点非常重要， <strong>所有节点的操作系统时间必须一致</strong>。不然会出现某个节点Session已过期而在另一节点此Session仍处于活动状态的现象。</p><h2 id="本期精华" tabindex="-1">本期精华 <a class="header-anchor" href="#本期精华" aria-label="Permalink to &quot;本期精华&quot;">​</a></h2><p>今天我谈了Tomcat的集群工作原理和配置方式，还通过官网上的一个例子说明了Tomcat集群的工作过程。Tomcat集群对Session的拷贝支持两种方式：DeltaManager和BackupManager。</p><p>当集群中节点比较少时，可以采用DeltaManager，因为Session数据在集群中各个节点都有备份，任何一个节点崩溃都不会对整体造成影响，可靠性比较高。</p><p>当集群中节点数比较多时，可以采用BackupManager，这是因为一个节点的Session只会拷贝到另一个节点，数据拷贝的开销比较少，同时只要这两个节点不同时崩溃，Session数据就不会丢失。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>在Tomcat官方推荐的配置里，ReplicationValve被配置成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;​Valve className=&quot;org.apache.catalina.ha.tcp.ReplicationValve&quot;</span></span>
<span class="line"><span>       filter=&quot;.*\\.gif|.*\\.js|.*\\.jpeg|.*\\.jpg|.*\\.png|.*\\</span></span>
<span class="line"><span>               .htm|.*\\.html|.*\\.css|.*\\.txt&quot;/&gt;</span></span></code></pre></div><p>你是否注意到，filter的值是一些JS文件或者图片等，这是为什么呢？</p><p>不知道今天的内容你消化得如何？如果还有疑问，请大胆的在留言区提问，也欢迎你把你的课后思考和心得记录下来，与我和其他同学一起讨论。如果你觉得今天有所收获，欢迎你把它分享给你的朋友。</p>`,47)])])}const h=a(t,[["render",l]]);export{g as __pageData,h as default};
