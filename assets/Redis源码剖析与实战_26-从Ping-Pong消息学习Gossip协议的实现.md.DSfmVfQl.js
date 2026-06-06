import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"26 | 从Ping-Pong消息学习Gossip协议的实现","description":"","frontmatter":{},"headers":[{"level":2,"title":"Gossip协议的基本工作机制","slug":"gossip协议的基本工作机制","link":"#gossip协议的基本工作机制","children":[]},{"level":2,"title":"Redis是如何实现Gossip通信的？","slug":"redis是如何实现gossip通信的","link":"#redis是如何实现gossip通信的","children":[{"level":3,"title":"节点通信的常见消息有哪些？","slug":"节点通信的常见消息有哪些","link":"#节点通信的常见消息有哪些","children":[]},{"level":3,"title":"Ping消息的生成和发送","slug":"ping消息的生成和发送","link":"#ping消息的生成和发送","children":[]},{"level":3,"title":"Ping消息的处理和Pong消息的回复","slug":"ping消息的处理和pong消息的回复","link":"#ping消息的处理和pong消息的回复","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"每课一问","slug":"每课一问","link":"#每课一问","children":[]}],"relativePath":"Redis源码剖析与实战/26-从Ping-Pong消息学习Gossip协议的实现.md","filePath":"Redis源码剖析与实战/26-从Ping-Pong消息学习Gossip协议的实现.md","lastUpdated":1779816274000}'),i={name:"Redis源码剖析与实战/26-从Ping-Pong消息学习Gossip协议的实现.md"};function t(l,s,c,o,r,g){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_26-从ping-pong消息学习gossip协议的实现" tabindex="-1">26 | 从Ping-Pong消息学习Gossip协议的实现 <a class="header-anchor" href="#_26-从ping-pong消息学习gossip协议的实现" aria-label="Permalink to &quot;26 | 从Ping-Pong消息学习Gossip协议的实现&quot;">​</a></h1><p>你好，我是蒋德钧。</p><p>从这节课开始，我们又将进入一个新的模块：“Redis Cluster”模块。在这个模块中，我会带你了解Redis Cluster的关键功能实现，包括了Gossip协议通信、集群关键命令和数据迁移等机制的设计与实现。</p><p>通过这些课程的学习，一方面，你可以深入了解Redis是如何完成集群关系维护、请求转发和数据迁移的。当你遇到集群问题时，这些知识可以帮助你排查问题。另一方面，当你在开发分布式集群时，不可避免地会遇到节点信息维护、数据放置和迁移等设计问题，接下来的几节课可以让你掌握Gossip协议、数据迁移等分布式集群中关键机制的典型设计和实现，而这些实现方法对于你开发分布式集群是很有帮助的。</p><p>那么接下来，我就先带你来学习Redis Cluster中节点的通信机制，而这个通信机制的关键是Gossip协议。所以今天这节课，我们主要来了解下Gossip协议在Redis中是如何实现的。</p><h2 id="gossip协议的基本工作机制" tabindex="-1">Gossip协议的基本工作机制 <a class="header-anchor" href="#gossip协议的基本工作机制" aria-label="Permalink to &quot;Gossip协议的基本工作机制&quot;">​</a></h2><p>对于一个分布式集群来说，它的良好运行离不开集群节点信息和节点状态的正常维护。为了实现这一目标，通常我们可以选择 <strong>中心化</strong> 的方法，使用一个第三方系统，比如Zookeeper或etcd，来维护集群节点的信息、状态等。同时，我们也可以选择 <strong>去中心化</strong> 的方法，让每个节点都维护彼此的信息、状态，并且使用集群通信协议Gossip在节点间传播更新的信息，从而实现每个节点都能拥有一致的信息。</p><p>下图就展示了这两种集群节点信息维护的方法，你可以看下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/08e25d1645b196f0143b495071d219c7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/08e25d1645b196f0143b495071d219c7.jpg" alt="图片"></a></p><p>我在 <a href="https://time.geekbang.org/column/article/310347" target="_blank" rel="noreferrer">第一季</a> 的“通信开销：限制Redis Cluster规模的关键因素”课程中，介绍过Gossip协议的工作机制，你可以去参考或回顾下。这里，我就简单介绍下Gossip协议的主要机制，来帮助你更好地理解接下来要学习的Gossip协议，在源码层面的设计与实现。</p><p>简单来说，在一个使用了Gossip协议的集群中，每个集群节点会维护一份集群的状态信息，包括集群中各节点的信息、运行状态，以及数据在各节点间的分布情况。</p><p>对于Redis来说，集群节点信息包括了节点名称、IP、端口号等，而节点运行状态主要用两个时间来表示，分别是节点向其他节点发送PING消息的时间，以及它自己收到其他节点返回的PONG消息的时间。最后，集群中数据的分布情况，在Redis中就对应了Redis Cluster的slots分配情况，也就是每个节点拥有哪些slots。</p><p>当集群节点按照Gossip协议工作时，每个节点会以一定的频率从集群中随机挑选一些其他节点，把自身的信息和已知的其他节点信息，用PING消息发送给选出的节点。而其他节点收到PING消息后，也会把自己的信息和已知的其他节点信息，用PONG消息返回给发送节点，这个过程如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/44b8b114acyy59f9eb5ac410a28fe01b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/44b8b114acyy59f9eb5ac410a28fe01b.jpg" alt="图片"></a></p><p>Gossip协议正是通过这种 <strong>随机挑选通信节点</strong> 的方法，让节点信息在整个集群中传播。当有节点维护的信息发生变化时，比如数据布局信息发生了改变，那么通过几轮通信后，其他节点也可以获得这一变化的信息了。这样一来，就实现了分布式集群所有节点维护一致的状态信息的目标。</p><p>好了，了解了Gossip协议的基本工作机制后，下面我们就来学习Redis中是如何实现Gossip协议的。</p><h2 id="redis是如何实现gossip通信的" tabindex="-1">Redis是如何实现Gossip通信的？ <a class="header-anchor" href="#redis是如何实现gossip通信的" aria-label="Permalink to &quot;Redis是如何实现Gossip通信的？&quot;">​</a></h2><p>首先，你要知道Redis Cluster的主要功能是在 <strong>cluster.h和cluster.c</strong> 两个文件中定义和实现的。如果你有进一步阅读源码的需求，可以重点从这两个文件中查找。</p><p>然后，我们来看下Redis Cluster中通信的消息有哪些，这也是Gossip协议通信的基础数据结构。</p><h3 id="节点通信的常见消息有哪些" tabindex="-1">节点通信的常见消息有哪些？ <a class="header-anchor" href="#节点通信的常见消息有哪些" aria-label="Permalink to &quot;节点通信的常见消息有哪些？&quot;">​</a></h3><p>Redis源码在cluster.h文件中，通过宏定义定义了节点间通信的消息类型。下面的代码列了几种常见的消息，包括 <strong>Ping</strong> 消息，这是一个节点用来向其他节点发送信息的消息类型，而 <strong>Pong</strong> 是对Ping消息的回复。 <strong>Meet</strong> 消息是一个节点表示要加入集群的消息类型，而 <strong>Fail</strong> 消息表示某个节点有故障。如果你想了解更多的消息类型，可以进一步阅读cluster.h文件。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define CLUSTERMSG_TYPE_PING 0</span><span>  //Ping消息，用来向其他节点发送当前节点信息</span></span>
<span class="line"><span>#define CLUSTERMSG_TYPE_PONG 1</span><span>  //Pong消息，对Ping消息的回复</span></span>
<span class="line"><span>#define CLUSTERMSG_TYPE_MEET 2</span><span>  //Meet消息，表示某个节点要加入集群</span></span>
<span class="line"><span>#define CLUSTERMSG_TYPE_FAIL 3</span><span>  //Fail消息，表示某个节点有故障</span></span></code></pre></div><p>刚才我介绍的是节点间通信的消息类型，那么， <strong>Redis源码中消息的数据结构具体是怎样的呢？</strong> 这部分内容也是在cluster.h文件中定义的。</p><p>Redis定义了一个 <strong>结构体clusterMsg</strong>，它用来表示节点间通信的一条消息。它包含的信息包括发送消息节点的名称、IP、集群通信端口和负责的slots，以及消息类型、消息长度和具体的消息体。下面的代码展示了clusterMsg定义中的部分重要内容，你可以看下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct {</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   uint32_t totlen;    //消息长度</span></span>
<span class="line"><span>   uint16_t type;     //消息类型</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   char sender[CLUSTER_NAMELEN];  //发送消息节点的名称</span></span>
<span class="line"><span>   unsigned char myslots[CLUSTER_SLOTS/8]; //发送消息节点负责的slots</span></span>
<span class="line"><span>   char myip[NET_IP_STR_LEN];  //发送消息节点的IP</span></span>
<span class="line"><span>   uint16_t cport;      //发送消息节点的通信端口</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   union clusterMsgData data;  //消息体</span></span>
<span class="line"><span>} clusterMsg;</span></span></code></pre></div><p>从clusterMsg数据结构中，我们可以看到它包含了一个 <strong>联合体结构clusterMsgData</strong>，而这个数据结构正是定义了节点间通信的实际消息体。</p><p>在cluster.h文件中，我们可以看到clusterMsgData的定义，它包含了多种消息类型对应的数据结构，包括clusterMsgDataGossip、clusterMsgDataFail、clusterMsgDataPublish和clusterMsgDataUpdate，如下所示，而这些数据结构也就对应了不同类型消息的消息体。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>union clusterMsgData {</span></span>
<span class="line"><span>    //Ping、Pong和Meet消息类型对应的数据结构</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        clusterMsgDataGossip gossip[1];</span></span>
<span class="line"><span>    } ping;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //Fail消息类型对应的数据结构</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        clusterMsgDataFail about;</span></span>
<span class="line"><span>    } fail;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //Publish消息类型对应的数据结构</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        clusterMsgDataPublish msg;</span></span>
<span class="line"><span>    } publish;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //Update消息类型对应的数据结构</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        clusterMsgDataUpdate nodecfg;</span></span>
<span class="line"><span>    } update;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //Module消息类型对应的数据结构</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        clusterMsgModule msg;</span></span>
<span class="line"><span>    } module;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在这个联合体结构中，我们重点看下 <strong>clusterMsgDataGossip数据结构</strong>，因为它对应了Gossip协议通信过程中使用的Ping、Pong和Meet消息的消息体。clusterMsgDataGossip数据结构定义如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct {</span></span>
<span class="line"><span>    char nodename[CLUSTER_NAMELEN]; //节点名称</span></span>
<span class="line"><span>    uint32_t ping_sent;  //节点发送Ping的时间</span></span>
<span class="line"><span>    uint32_t pong_received; //节点收到Pong的时间</span></span>
<span class="line"><span>    char ip[NET_IP_STR_LEN];  //节点IP</span></span>
<span class="line"><span>    uint16_t port;              //节点和客户端的通信端口</span></span>
<span class="line"><span>    uint16_t cport;             //节点用于集群通信的端口</span></span>
<span class="line"><span>    uint16_t flags;             //节点的标记</span></span>
<span class="line"><span>    uint32_t notused1;    //未用字段</span></span>
<span class="line"><span>} clusterMsgDataGossip;</span></span></code></pre></div><p>从clusterMsgDataGossip数据结构中，我们可以看到，它里面包含了节点的基本信息，比如节点名称、IP和通信端口，以及使用Ping、Pong消息发送和接收时间来表示的节点运行状态。这就和我刚才给你介绍的Gossip协议工作机制中的通信内容对应上了。</p><p>那么，Gossip协议在通信过程中传播的slots分布信息，也已经在刚才介绍的clusterMsg数据结构中定义了。所以， <strong>Redis使用clusterMsg结构体作为节点间通信的消息，就可以实现Gossip协议的通信目的</strong>。如果你要开发Gossip协议，可以参考这里clusterMsg、clusterMsgData和clusterMsgDataGossip的定义。</p><p>好了，了解了Redis Cluster中节点通信的消息定义后，接下来，我们来看下Gossip协议中的收发消息具体是如何实现的。</p><h3 id="ping消息的生成和发送" tabindex="-1">Ping消息的生成和发送 <a class="header-anchor" href="#ping消息的生成和发送" aria-label="Permalink to &quot;Ping消息的生成和发送&quot;">​</a></h3><p>Gossip协议是按一定的频率随机选一些节点进行通信的。那么在前面课程的学习中，我们已经知道，Redis的serverCron函数是在周期性执行的。而它会调用 <strong>clusterCron函数</strong>（在cluster.c文件中）来实现集群的周期性操作，这就包括了Gossip协议的通信。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int serverCron(struct aeEventLoop *eventLoop, long long id, void *clientData) {</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   run_with_period(100) {</span></span>
<span class="line"><span>      //每100ms调用依次clusterCron函数</span></span>
<span class="line"><span>      if (server.cluster_enabled) clusterCron();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>clusterCron函数的一个主要逻辑就是每经过10次执行，就会随机选五个节点，然后在这五个节点中，遴选出最早向当前节点发送Pong消息的那个节点，并向它发送Ping消息。而clusterCron函数本身是每1秒执行10次，所以，这也相当于是 <strong>集群节点每1秒向一个随机节点发送Gossip协议的Ping消息</strong>。</p><p>下面的代码展示了clusterCron函数的这一执行逻辑，你可以看下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void clusterCron(void) {</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   if (!(iteration % 10)) { //每执行10次clusterCron函数，执行1次该分支代码</span></span>
<span class="line"><span>   int j;</span></span>
<span class="line"><span>   for (j = 0; j &amp;lt; 5; j++) { //随机选5个节点</span></span>
<span class="line"><span>            de = dictGetRandomKey(server.cluster-&amp;gt;nodes);</span></span>
<span class="line"><span>            clusterNode *this = dictGetVal(de);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      //不向断连的节点、当前节点和正在握手的节点发送Ping消息</span></span>
<span class="line"><span>      if (this-&amp;gt;link == NULL || this-&amp;gt;ping_sent != 0) continue;</span></span>
<span class="line"><span>      if (this-&amp;gt;flags &amp; (CLUSTER_NODE_MYSELF|CLUSTER_NODE_HANDSHAKE))</span></span>
<span class="line"><span>         continue;</span></span>
<span class="line"><span>      //遴选向当前节点发送Pong消息最早的节点</span></span>
<span class="line"><span>      if (min_pong_node == NULL || min_pong &amp;gt; this-&amp;gt;pong_received) {</span></span>
<span class="line"><span>         min_pong_node = this;</span></span>
<span class="line"><span>         min_pong = this-&amp;gt;pong_received;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果遴选出了最早向当前节点发送Pong消息的节点，那么调用clusterSendPing函数向该节点发送Ping消息</span></span>
<span class="line"><span>    if (min_pong_node) {</span></span>
<span class="line"><span>       serverLog(LL_DEBUG,&quot;Pinging node %.40s&quot;, min_pong_node-&amp;gt;name);</span></span>
<span class="line"><span>       clusterSendPing(min_pong_node-&amp;gt;link, CLUSTERMSG_TYPE_PING);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从这段代码中，我们可以看到，向其他节点发送Ping消息的函数是 <strong>clusterSendPing</strong>，而实际上，Ping消息也是在这个函数中完成构建和发送的。 clusterSendPing函数的主要逻辑可以分成三步，分别是：构建Ping消息头、构建Ping消息体和发送消息。我们分别来看下。</p><p><strong>第一步，构建Ping消息头</strong></p><p>clusterSendPing函数会调用 <strong>clusterBuildMessageHdr函数</strong> 来构建Ping消息头，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (link-&amp;gt;node &amp;&amp; type == CLUSTERMSG_TYPE_PING)</span></span>
<span class="line"><span>   link-&amp;gt;node-&amp;gt;ping_sent = mstime(); //如果当前是Ping消息，那么在发送目标节点的结构中记录Ping消息的发送时间</span></span>
<span class="line"><span>clusterBuildMessageHdr(hdr,type); //调用clusterBuildMessageHdr函数构建Ping消息头</span></span></code></pre></div><p>在刚才学习Redis Cluster节点间通信消息的数据结构时，我们知道了，每一条消息的数据结构是clusterMsg，所以在这里，clusterBuildMessageHdr函数也是设置clusterMsg结构体中的各个成员变量，比如消息类型，发送消息节点的名称、IP、slots分布等信息。你可以进一步仔细阅读clusterBuildMessageHdr函数的源码，了解这些成员变量的具体设置。</p><p>不过，clusterBuildMessageHdr函数并不会设置clusterMsg结构体中的data成员变量，这个成员变量就是刚才我介绍的clusterMsgData联合体，也就是Ping消息的消息体。因为在完成消息头的构建后，clusterSendPing函数就会来构建消息体。</p><p><strong>第二步，构建Ping消息体</strong></p><p>你可以再看下clusterMsgData的数据结构定义，如下所示。当它表示Ping、Pong消息时，其实是一个clusterMsgDataGossip类型的数组，这也就是说，一个Ping消息中会包含多个clusterMsgDataGossip结构体，而每个clusterMsgDataGossip结构体实际对应了一个节点的信息。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>union clusterMsgData {</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        //当消息是Ping或Pong时，使用clusterMsgDataGossip类型的数组</span></span>
<span class="line"><span>        clusterMsgDataGossip gossip[1];</span></span>
<span class="line"><span>	} ping;</span></span>
<span class="line"><span>	…</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，当clusterSendPing函数构建Ping消息体时，它会将多个节点的信息写入Ping消息。那么， <strong>clusterSendPing函数具体会写入多少个节点的信息呢？</strong> 这其实是由三个变量控制的，分别是freshnodes、wanted和maxiterations。</p><p>其中，freshnodes的值等于集群节点数减2，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int freshnodes = dictSize(server.cluster-&amp;gt;nodes)-2;</span></span></code></pre></div><p>而wanted变量的值和freshnodes大小也有关，wanted的默认值是集群节点数的1/10，但是如果这个默认值小于3，那么wanted就等于3。如果这个默认值大于freshnodes，那么wanted就等于freshnodes的大小，这部分的计算逻辑如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wanted = floor(dictSize(server.cluster-&amp;gt;nodes)/10);</span></span>
<span class="line"><span>if (wanted &amp;lt; 3) wanted = 3;</span></span>
<span class="line"><span>if (wanted &amp;gt; freshnodes) wanted = freshnodes;</span></span></code></pre></div><p>有了wanted值之后，maxiterations的值就等于wanted的三倍大小。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int maxiterations = wanted*3;</span></span></code></pre></div><p>在计算完freshnodes、wanted和maxiterations这三个值的大小后，clusterSendPing会根据这三个值的大小，执行一个 <strong>循环流程</strong>，在这个循环中，它每次从集群节点中随机选一个节点出来，并调用clusterSetGossipEntry函数为这个节点设置相应的Ping消息体，也就是clusterMsgDataGossip结构。关于clusterSetGossipEntry函数对clusterMsgDataGossip结构的具体设置，你可以进一步看下它的源码。</p><p>当然，如果选出的节点是当前节点自身、可能有故障的节点、正在握手的节点、失联的节点以及没有地址信息的节点，那么clusterSendPing是不会为这些节点设置Ping消息体的。</p><p>下面的代码展示了clusterSendPing函数设置Ping消息体的基本逻辑，你可以看下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>while(freshnodes &amp;gt; 0 &amp;&amp; gossipcount &amp;lt; wanted &amp;&amp; maxiterations--) {</span></span>
<span class="line"><span>   dictEntry *de = dictGetRandomKey(server.cluster-&amp;gt;nodes);</span></span>
<span class="line"><span>   clusterNode *this = dictGetVal(de);</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   clusterSetGossipEntry(hdr,gossipcount,this); //调用clusterSetGossipEntry设置Ping消息体</span></span>
<span class="line"><span>   freshnodes--;</span></span>
<span class="line"><span>   gossipcount++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里，你需要注意的是，对可能有故障的节点，clusterSendPing函数会将它们的信息放在Ping消息体的最后。</p><p><strong>第三步，发送Ping消息</strong></p><p>好了，到这里，Ping消息体的构建就完成了。那么，clusterSendPing函数主体逻辑的最后一步就是调用clusterSendMessage函数，将Ping消息发送给随机选出的目标节点。这样一来，Gossip协议要求的，向随机选出的节点发送当前节点信息的操作就完成了。</p><p>我画了下面的这张图，展示了clusterSendPing函数的主体逻辑，你可以再回顾下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/e4fd8037321e805027d604ee130c70da.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/e4fd8037321e805027d604ee130c70da.jpg" alt="图片"></a></p><p>接下来，我们再来看下当节点收到Ping消息后的处理，也就是Pong消息的发送。</p><h3 id="ping消息的处理和pong消息的回复" tabindex="-1">Ping消息的处理和Pong消息的回复 <a class="header-anchor" href="#ping消息的处理和pong消息的回复" aria-label="Permalink to &quot;Ping消息的处理和Pong消息的回复&quot;">​</a></h3><p>在刚才介绍的clusterCron函数中，节点在调用clusterSendPing函数向其他节点发送Ping消息前，会检查它和其他节点连接情况，如果连接断开了，节点会重新建立连接，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void clusterCron(void) {</span></span>
<span class="line"><span>…</span></span>
<span class="line"><span>di = dictGetSafeIterator(server.cluster-&amp;gt;nodes);</span></span>
<span class="line"><span>while((de = dictNext(di)) != NULL) {</span></span>
<span class="line"><span>   clusterNode *node = dictGetVal(de);</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   if (node-&amp;gt;link == NULL) {</span></span>
<span class="line"><span>    …</span></span>
<span class="line"><span>    fd = anetTcpNonBlockBindConnect(server.neterr, node-&amp;gt;ip,</span></span>
<span class="line"><span>                node-&amp;gt;cport, NET_FIRST_BIND_ADDR);</span></span>
<span class="line"><span>	…</span></span>
<span class="line"><span>	link = createClusterLink(node);</span></span>
<span class="line"><span>	link-&amp;gt;fd = fd;</span></span>
<span class="line"><span>	node-&amp;gt;link = link;</span></span>
<span class="line"><span>	aeCreateFileEvent(server.el,link-&amp;gt;fd,AE_READABLE, clusterReadHandler,link);</span></span>
<span class="line"><span>	…</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	…</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>…</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码中，我们可以看到，一个节点在和其他节点建立的连接上，设置的 <strong>监听函数是clusterReadHandler</strong>。所以，当一个节点收到Ping消息时，它就会在clusterReadHandler函数中进行处理，我们来看下这个函数。</p><p>clusterReadHandler函数执行一个while(1)循环，并在这个循环中读取收到的消息，当读到一个完整的消息后，它会调用 <strong>clusterProcessPacket函数</strong> 处理这个消息，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void clusterReadHandler(aeEventLoop *el, int fd, void *privdata, int mask) {</span></span>
<span class="line"><span>…</span></span>
<span class="line"><span>while(1) { //持续读取收到的数据</span></span>
<span class="line"><span>   rcvbuflen = sdslen(link-&amp;gt;rcvbuf);</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   nread = read(fd,buf,readlen); //读取收到的数据</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   //读取到一个完整的消息</span></span>
<span class="line"><span>   if (rcvbuflen &amp;gt;= 8 &amp;&amp; rcvbuflen == ntohl(hdr-&amp;gt;totlen)) {</span></span>
<span class="line"><span>   if (clusterProcessPacket(link)) { …} //调用clusterProcessPacket函数处理消息</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为节点间发送的消息类型不止Ping消息，所以clusterProcessPacket函数会先从收到的消息头中读取消息类型，然后根据不同的消息类型，执行不同的代码分支。</p><p>当收到的是Ping消息时，clusterProcessPacket函数会先调用clusterSendPing函数，向Ping消息发送节点返回Pong消息，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int clusterProcessPacket(clusterLink *link) {</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_MEET) {</span></span>
<span class="line"><span>      … //处理Meet消息，将发送Meet消息的节点加入本地记录的节点列表中</span></span>
<span class="line"><span>      clusterSendPing(link,CLUSTERMSG_TYPE_PONG); //调用clusterSendPing函数返回Pong消息。</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从这里你可以看到， <strong>Ping和Pong消息使用的是同一个函数clusterSendPing来生成和发送的，所以它们包含的内容也是相同的</strong>。这也就是说，Pong消息中也包含了Pong消息发送节点的信息和它已知的其他节点信息。因此，Ping消息的发送节点从Pong消息中，也能获取其他节点的最新信息，这就能实现Gossip协议通过多轮消息传播，达到每个节点拥有一致信息的目的。</p><p>这里，你还需要注意的是，无论是Ping消息的目标节点收到Ping消息，还是发送Ping消息的节点收到目标节点返回的Pong消息，它们都会 <strong>在clusterProcessPacket函数的同一个代码分支中进行处理</strong>，比如更新最新Pong消息的返回时间，根据消息头中的slots分布信息更新本地的slots信息。此外，clusterProcessPacket函数还会调用 <strong>clusterProcessGossipSection函数</strong>，依次处理Ping-Pong消息中包含的多个消息体。</p><p>这样一来，收到Ping或Pong消息的节点，就可以根据消息体中的信息，更新本地记录的对应节点的信息了。你可以进一步阅读clusterProcessGossipSection函数源码，了解它根据消息体内容对本地记录的节点信息的更新设置。</p><p>下面的代码就展示了节点收到Ping-Pong消息后，对本地信息进行更新的代码分支，你可以看下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int clusterProcessPacket(clusterLink *link) {</span></span>
<span class="line"><span>   …</span></span>
<span class="line"><span>   if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_PONG ||</span></span>
<span class="line"><span>        type == CLUSTERMSG_TYPE_MEET)</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>	   …</span></span>
<span class="line"><span>	   //当收到Pong消息时，更新本地记录的目标节点Pong消息最新返回时间</span></span>
<span class="line"><span>       if (link-&amp;gt;node &amp;&amp; type == CLUSTERMSG_TYPE_PONG) {</span></span>
<span class="line"><span>          link-&amp;gt;node-&amp;gt;pong_received = mstime();</span></span>
<span class="line"><span>          …</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	…//如果发送消息的节点是主节点，更新本地记录的slots分布信息</span></span>
<span class="line"><span>	//调用clusterProcessGossipSection函数处理Ping或Pong消息的消息体</span></span>
<span class="line"><span>	if (sender) clusterProcessGossipSection(hdr,link);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	…</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>好了，到这里，我们就了解了按照Gossip协议发送的Ping、Pong消息的整体处理过程。从中，我们也看到了Redis实现Gossip协议用到的数据结构和主要函数，我画了两张表，分别汇总了刚才介绍的数据结构和函数，你可以再回顾下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/9828680d9e8fe70c3af6e7b02484304b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/9828680d9e8fe70c3af6e7b02484304b.jpg" alt="图片"></a><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/ebfa014888404b1a0f087a43e0e61820.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Redis%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98/images/424827/ebfa014888404b1a0f087a43e0e61820.jpg" alt="图片"></a></p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天这节课，我给你介绍了Redis Cluster使用的Gossip协议的设计和实现。Gossip协议实现的关键有两个， <strong>一个是要通过Ping-Pong消息发送节点自身的信息，以及节点已知的其他节点的信息</strong>。针对这一点，Redis是设计了clusterMsg结构的消息，其中消息头包含了发送消息节点自身的信息，比如名称、IP、端口号、slots分布等。</p><p>而clusterMsg结构中的消息体，是设计使用了 <strong>clusterMsgDataGossip</strong> 类型的数组，这个数组的每一个元素对应了发送消息节点已知的一个节点的信息。这样一来，发送消息节点通过Ping消息可以把自己的信息和已知的其他节点信息传播出去。</p><p>同样的，收到Ping消息的节点，也会使用同样结构的Pong消息将自己的信息和它已知的其他节点信息返回给发送节点。这样一来，就能实现Gossip协议的要求。</p><p><strong>Gossip协议实现的另一个关键就是要随机选择节点发送</strong>，这一点，Redis Cluster在源码中就比较容易实现了。其实，就是clusterCron函数先通过随机选择五个节点，然后，再在其中挑选和当前节点最长时间没有发送Pong消息的节点，作为目标节点，这样一来，也满足了Gossip协议的要求。</p><p>通过今天这节课的学习，我希望你能了解Redis Cluster设计的消息结构、周期发送Ping和Pong消息的整体执行逻辑。这些都是你可以用在自行开发Gossip协议时的经典参考设计。</p><h2 id="每课一问" tabindex="-1">每课一问 <a class="header-anchor" href="#每课一问" aria-label="Permalink to &quot;每课一问&quot;">​</a></h2><p>在今天课程介绍的源码中，你知道为什么clusterSendPing函数计算wanted值时，是用的集群节点个数的十分之一吗？</p>`,89)])])}const h=n(i,[["render",t]]);export{u as __pageData,h as default};
