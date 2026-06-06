import{_ as n,H as s,f as a,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"12 | ControllerChannelManager：Controller如何管理请求发送？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Controller发送请求类型","slug":"controller发送请求类型","link":"#controller发送请求类型","children":[]},{"level":2,"title":"RequestSendThread","slug":"requestsendthread","link":"#requestsendthread","children":[]},{"level":2,"title":"ControllerChannelManager","slug":"controllerchannelmanager","link":"#controllerchannelmanager","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/12-ControllerChannelManager：Controller如何管理请求发送？.md","filePath":"Kafka核心源码解读/12-ControllerChannelManager：Controller如何管理请求发送？.md","lastUpdated":1779815932000}'),r={name:"Kafka核心源码解读/12-ControllerChannelManager：Controller如何管理请求发送？.md"};function l(t,e,o,i,c,d){return s(),a("div",null,[...e[0]||(e[0]=[p(`<h1 id="_12-controllerchannelmanager-controller如何管理请求发送" tabindex="-1">12 | ControllerChannelManager：Controller如何管理请求发送？ <a class="header-anchor" href="#_12-controllerchannelmanager-controller如何管理请求发送" aria-label="Permalink to &quot;12 | ControllerChannelManager：Controller如何管理请求发送？&quot;">​</a></h1><p>你好，我是胡夕。上节课，我们深入研究了ControllerContext.scala源码文件，掌握了Kafka集群定义的重要元数据。今天，我们来学习下Controller是如何给其他Broker发送请求的。</p><p>掌握了这部分实现原理，你就能更好地了解Controller究竟是如何与集群Broker进行交互，从而实现管理集群元数据的功能的。而且，阅读这部分源码，还能帮你定位和解决线上问题。我先跟你分享一个真实的案例。</p><p>当时还是在Kafka 0.10.0.1时代，我们突然发现，在线上环境中，很多元数据变更无法在集群的所有Broker上同步了。具体表现为，创建了主题后，有些Broker依然无法感知到。</p><p>我的第一感觉是Controller出现了问题，但又苦于无从排查和验证。后来，我想到，会不会是Controller端请求队列中积压的请求太多造成的呢？因为当时Controller所在的Broker本身承载着非常重的业务，这是非常有可能的原因。</p><p>在看了相关代码后，我们就在相应的源码中新加了一个监控指标，用于实时监控Controller的请求队列长度。当更新到生产环境后，我们很轻松地定位了问题。果然，由于Controller所在的Broker自身负载过大，导致Controller端的请求积压，从而造成了元数据更新的滞后。精准定位了问题之后，解决起来就很容易了。后来，社区于0.11版本正式引入了相关的监控指标。</p><p>你看，阅读源码，除了可以学习优秀开发人员编写的代码之外，我们还能根据自身的实际情况做定制化方案，实现一些非开箱即用的功能。</p><h2 id="controller发送请求类型" tabindex="-1">Controller发送请求类型 <a class="header-anchor" href="#controller发送请求类型" aria-label="Permalink to &quot;Controller发送请求类型&quot;">​</a></h2><p>下面，我们就正式进入到Controller请求发送管理部分的学习。你可能会问：“Controller也会给Broker发送请求吗？”当然！ <strong>Controller会给集群中的所有Broker（包括它自己所在的Broker）机器发送网络请求</strong>。发送请求的目的，是让Broker执行相应的指令。我用一张图，来展示下Controller都会发送哪些请求，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/3e8b0a34f003db5d67d5adafe8781ef7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/3e8b0a34f003db5d67d5adafe8781ef7.jpg" alt=""></a></p><p>当前，Controller只会向Broker发送三类请求，分别是LeaderAndIsrRequest、StopReplicaRequest和UpdateMetadataRequest。注意，这里我使用的是“当前”！我只是说，目前仅有这三类，不代表以后不会有变化。事实上，我几乎可以肯定，以后能发送的RPC协议种类一定会变化的。因此，你需要掌握请求发送的原理。毕竟，所有请求发送都是通过相同的机制完成的。</p><p>还记得我在 <a href="https://time.geekbang.org/column/article/232134" target="_blank" rel="noreferrer">第8节课</a> 提到的控制类请求吗？没错，这三类请求就是典型的控制类请求。我来解释下它们的作用。</p><ul><li>LeaderAndIsrRequest：最主要的功能是，告诉Broker相关主题各个分区的Leader副本位于哪台Broker上、ISR中的副本都在哪些Broker上。在我看来， <strong>它应该被赋予最高的优先级，毕竟，它有令数据类请求直接失效的本领</strong>。试想一下，如果这个请求中的Leader副本变更了，之前发往老的Leader的PRODUCE请求是不是全部失效了？因此，我认为它是非常重要的控制类请求。</li><li>StopReplicaRequest：告知指定Broker停止它上面的副本对象，该请求甚至还能删除副本底层的日志数据。这个请求主要的使用场景，是 <strong>分区副本迁移</strong> 和 <strong>删除主题</strong>。在这两个场景下，都要涉及停掉Broker上的副本操作。</li><li>UpdateMetadataRequest：顾名思义，该请求会更新Broker上的元数据缓存。集群上的所有元数据变更，都首先发生在Controller端，然后再经由这个请求广播给集群上的所有Broker。在我刚刚分享的案例中，正是因为这个请求被处理得不及时，才导致集群Broker无法获取到最新的元数据信息。</li></ul><p>现在，社区越来越倾向于 <strong>将重要的数据结构源代码从服务器端的core工程移动到客户端的clients工程中</strong>。这三类请求Java类的定义就封装在clients中，它们的抽象基类是AbstractControlRequest类，这个类定义了这三类请求的公共字段。</p><p>我用代码展示下这三类请求及其抽象父类的定义，以便让你对Controller发送的请求类型有个基本的认识。这些类位于clients工程下的src/main/java/org/apache/kafka/common/requests路径下。</p><p>先来看AbstractControlRequest类的主要代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractControlRequest extends AbstractRequest {</span></span>
<span class="line"><span>    public static final long UNKNOWN_BROKER_EPOCH = -1L;</span></span>
<span class="line"><span>    public static abstract class Builder&amp;lt;T extends AbstractRequest&amp;gt; extends AbstractRequest.Builder&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span>        protected final int controllerId;</span></span>
<span class="line"><span>        protected final int controllerEpoch;</span></span>
<span class="line"><span>        protected final long brokerEpoch;</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>区别于其他的数据类请求，抽象类请求必然包含3个字段。</p><ul><li><strong>controllerId</strong>：Controller所在的Broker ID。</li><li><strong>controllerEpoch</strong>：Controller的版本信息。</li><li><strong>brokerEpoch</strong>：目标Broker的Epoch。</li></ul><p>后面这两个Epoch字段用于隔离Zombie Controller和Zombie Broker，以保证集群的一致性。</p><p>在同一源码路径下，你能找到LeaderAndIsrRequest、StopReplicaRequest和UpdateMetadataRequest的定义，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LeaderAndIsrRequest extends AbstractControlRequest { ...... }</span></span>
<span class="line"><span>public class StopReplicaRequest extends AbstractControlRequest { ...... }</span></span>
<span class="line"><span>public class UpdateMetadataRequest extends AbstractControlRequest { ...... }</span></span></code></pre></div><h2 id="requestsendthread" tabindex="-1">RequestSendThread <a class="header-anchor" href="#requestsendthread" aria-label="Permalink to &quot;RequestSendThread&quot;">​</a></h2><p>说完了Controller发送什么请求，接下来我们说说怎么发。</p><p>Kafka源码非常喜欢生产者-消费者模式。该模式的好处在于， <strong>解耦生产者和消费者逻辑，分离两者的集中性交互</strong>。学完了“请求处理”模块，现在，你一定很赞同这个说法吧。还记得Broker端的SocketServer组件吗？它就在内部定义了一个线程共享的请求队列：它下面的Processor线程扮演Producer，而KafkaRequestHandler线程扮演Consumer。</p><p>对于Controller而言，源码同样使用了这个模式：它依然是一个线程安全的阻塞队列，Controller事件处理线程（第13节课会详细说它）负责向这个队列写入待发送的请求，而一个名为RequestSendThread的线程负责执行真正的请求发送。如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/825d084eb1517daace5532d1c93b0321.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/825d084eb1517daace5532d1c93b0321.jpg" alt=""></a></p><p>Controller会为集群中的每个Broker都创建一个对应的RequestSendThread线程。Broker上的这个线程，持续地从阻塞队列中获取待发送的请求。</p><p>那么，Controller往阻塞队列上放什么数据呢？这其实是由源码中的QueueItem类定义的。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class QueueItem(apiKey: ApiKeys, request: AbstractControlRequest.Builder[_ &amp;lt;: AbstractControlRequest], callback: AbstractResponse =&amp;gt; Unit, enqueueTimeMs: Long)</span></span></code></pre></div><p>每个QueueItem的核心字段都是 <strong>AbstractControlRequest.Builder对象</strong>。你基本上可以认为，它就是阻塞队列上AbstractControlRequest类型。</p><p>需要注意的是这里的“&lt;:”符号，它在Scala中表示 <strong>上边界</strong> 的意思，即字段request必须是AbstractControlRequest的子类，也就是上面说到的那三类请求。</p><p>这也就是说，每个QueueItem实际保存的都是那三类请求中的其中一类。如果使用一个BlockingQueue对象来保存这些QueueItem，那么，代码就实现了一个请求阻塞队列。这就是RequestSendThread类做的事情。</p><p>接下来，我们就来学习下RequestSendThread类的定义。我给一些主要的字段添加了注释。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class RequestSendThread(val controllerId: Int, // Controller所在Broker的Id</span></span>
<span class="line"><span>    val controllerContext: ControllerContext, // Controller元数据信息</span></span>
<span class="line"><span>    val queue: BlockingQueue[QueueItem], // 请求阻塞队列</span></span>
<span class="line"><span>    val networkClient: NetworkClient, // 用于执行发送的网络I/O类</span></span>
<span class="line"><span>    val brokerNode: Node, // 目标Broker节点</span></span>
<span class="line"><span>    val config: KafkaConfig, // Kafka配置信息</span></span>
<span class="line"><span>    val time: Time,</span></span>
<span class="line"><span>    val requestRateAndQueueTimeMetrics: Timer,</span></span>
<span class="line"><span>    val stateChangeLogger: StateChangeLogger,</span></span>
<span class="line"><span>    name: String) extends ShutdownableThread(name = name) {</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实，RequestSendThread最重要的是它的 <strong>doWork方法</strong>，也就是执行线程逻辑的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>override def doWork(): Unit = {</span></span>
<span class="line"><span>    def backoff(): Unit = pause(100, TimeUnit.MILLISECONDS)</span></span>
<span class="line"><span>    val QueueItem(apiKey, requestBuilder, callback, enqueueTimeMs) = queue.take() // 以阻塞的方式从阻塞队列中取出请求</span></span>
<span class="line"><span>    requestRateAndQueueTimeMetrics.update(time.milliseconds() - enqueueTimeMs, TimeUnit.MILLISECONDS) // 更新统计信息</span></span>
<span class="line"><span>    var clientResponse: ClientResponse = null</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      var isSendSuccessful = false</span></span>
<span class="line"><span>      while (isRunning &amp;&amp; !isSendSuccessful) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          // 如果没有创建与目标Broker的TCP连接，或连接暂时不可用</span></span>
<span class="line"><span>          if (!brokerReady()) {</span></span>
<span class="line"><span>            isSendSuccessful = false</span></span>
<span class="line"><span>            backoff() // 等待重试</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          else {</span></span>
<span class="line"><span>            val clientRequest = networkClient.newClientRequest(brokerNode.idString, requestBuilder,</span></span>
<span class="line"><span>              time.milliseconds(), true)</span></span>
<span class="line"><span>            // 发送请求，等待接收Response</span></span>
<span class="line"><span>            clientResponse = NetworkClientUtils.sendAndReceive(networkClient, clientRequest, time)</span></span>
<span class="line"><span>            isSendSuccessful = true</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        } catch {</span></span>
<span class="line"><span>          case e: Throwable =&amp;gt;</span></span>
<span class="line"><span>            warn(s&quot;Controller $controllerId epoch \${controllerContext.epoch} fails to send request $requestBuilder &quot; +</span></span>
<span class="line"><span>              s&quot;to broker $brokerNode. Reconnecting to broker.&quot;, e)</span></span>
<span class="line"><span>            // 如果出现异常，关闭与对应Broker的连接</span></span>
<span class="line"><span>            networkClient.close(brokerNode.idString)</span></span>
<span class="line"><span>            isSendSuccessful = false</span></span>
<span class="line"><span>            backoff()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 如果接收到了Response</span></span>
<span class="line"><span>      if (clientResponse != null) {</span></span>
<span class="line"><span>        val requestHeader = clientResponse.requestHeader</span></span>
<span class="line"><span>        val api = requestHeader.apiKey</span></span>
<span class="line"><span>        // 此Response的请求类型必须是LeaderAndIsrRequest、StopReplicaRequest或UpdateMetadataRequest中的一种</span></span>
<span class="line"><span>        if (api != ApiKeys.LEADER_AND_ISR &amp;&amp; api != ApiKeys.STOP_REPLICA &amp;&amp; api != ApiKeys.UPDATE_METADATA)</span></span>
<span class="line"><span>          throw new KafkaException(s&quot;Unexpected apiKey received: $apiKey&quot;)</span></span>
<span class="line"><span>        val response = clientResponse.responseBody</span></span>
<span class="line"><span>        stateChangeLogger.withControllerEpoch(controllerContext.epoch)</span></span>
<span class="line"><span>          .trace(s&quot;Received response &quot; +</span></span>
<span class="line"><span>          s&quot;\${response.toString(requestHeader.apiVersion)} for request $api with correlation id &quot; +</span></span>
<span class="line"><span>          s&quot;\${requestHeader.correlationId} sent to broker $brokerNode&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (callback != null) {</span></span>
<span class="line"><span>          callback(response) // 处理回调</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch {</span></span>
<span class="line"><span>      case e: Throwable =&amp;gt;</span></span>
<span class="line"><span>        error(s&quot;Controller $controllerId fails to send a request to broker $brokerNode&quot;, e)</span></span>
<span class="line"><span>        networkClient.close(brokerNode.idString)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>我用一张图来说明doWork的执行逻辑：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/869727e22f882509a149d1065a8a1719.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/869727e22f882509a149d1065a8a1719.jpg" alt=""></a></p><p>总体上来看，doWork的逻辑很直观。它的主要作用是从阻塞队列中取出待发送的请求，然后把它发送出去，之后等待Response的返回。在等待Response的过程中，线程将一直处于阻塞状态。当接收到Response之后，调用callback执行请求处理完成后的回调逻辑。</p><p>需要注意的是，RequestSendThread线程对请求发送的处理方式与Broker处理请求不太一样。它调用的sendAndReceive方法在发送完请求之后，会原地进入阻塞状态，等待Response返回。只有接收到Response，并执行完回调逻辑之后，该线程才能从阻塞队列中取出下一个待发送请求进行处理。</p><h2 id="controllerchannelmanager" tabindex="-1">ControllerChannelManager <a class="header-anchor" href="#controllerchannelmanager" aria-label="Permalink to &quot;ControllerChannelManager&quot;">​</a></h2><p>了解了RequestSendThread线程的源码之后，我们进入到ControllerChannelManager类的学习。</p><p>这个类和RequestSendThread是合作共赢的关系。在我看来，它有两大类任务。</p><ul><li>管理Controller与集群Broker之间的连接，并为每个Broker创建RequestSendThread线程实例；</li><li>将要发送的请求放入到指定Broker的阻塞队列中，等待该Broker专属的RequestSendThread线程进行处理。</li></ul><p>由此可见，它们是紧密相连的。</p><p>ControllerChannelManager类最重要的数据结构是brokerStateInfo，它是在下面这行代码中定义的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected val brokerStateInfo = new HashMap[Int, ControllerBrokerStateInfo]</span></span></code></pre></div><p>这是一个HashMap类型，Key是Integer类型，其实就是集群中Broker的ID信息，而Value是一个ControllerBrokerStateInfo。</p><p>你可能不太清楚ControllerBrokerStateInfo类是什么，我先解释一下。它本质上是一个POJO类，仅仅是承载若干数据结构的容器，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class ControllerBrokerStateInfo(networkClient: NetworkClient,</span></span>
<span class="line"><span>    brokerNode: Node,</span></span>
<span class="line"><span>    messageQueue: BlockingQueue[QueueItem],</span></span>
<span class="line"><span>    requestSendThread: RequestSendThread,</span></span>
<span class="line"><span>    queueSizeGauge: Gauge[Int],</span></span>
<span class="line"><span>    requestRateAndTimeMetrics: Timer,</span></span>
<span class="line"><span>reconfigurableChannelBuilder: Option[Reconfigurable])</span></span></code></pre></div><p>它有三个非常关键的字段。</p><ul><li><strong>brokerNode</strong>：目标Broker节点对象，里面封装了目标Broker的连接信息，比如主机名、端口号等。</li><li><strong>messageQueue</strong>：请求消息阻塞队列。你可以发现，Controller为每个目标Broker都创建了一个消息队列。</li><li><strong>requestSendThread</strong>：Controller使用这个线程给目标Broker发送请求。</li></ul><p>你一定要记住这三个字段，因为它们是实现Controller发送请求的关键因素。</p><p>为什么呢？我们思考一下，如果Controller要给Broker发送请求，肯定需要解决三个问题：发给谁？发什么？怎么发？“发给谁”就是由brokerNode决定的；messageQueue里面保存了要发送的请求，因而解决了“发什么”的问题；最后的“怎么发”就是依赖requestSendThread变量实现的。</p><p>好了，我们现在回到ControllerChannelManager。它定义了5个public方法，我来一一介绍下。</p><ul><li><strong>startup方法</strong>：Controller组件在启动时，会调用ControllerChannelManager的startup方法。该方法会从元数据信息中找到集群的Broker列表，然后依次为它们调用addBroker方法，把它们加到brokerStateInfo变量中，最后再依次启动brokerStateInfo中的RequestSendThread线程。</li><li><strong>shutdown方法</strong>：关闭所有RequestSendThread线程，并清空必要的资源。</li><li><strong>sendRequest方法</strong>：从名字看，就是发送请求，实际上就是把请求对象提交到请求队列。</li><li><strong>addBroker方法</strong>：添加目标Broker到brokerStateInfo数据结构中，并创建必要的配套资源，如请求队列、RequestSendThread线程对象等。最后，RequestSendThread启动线程。</li><li><strong>removeBroker方法</strong>：从brokerStateInfo移除目标Broker的相关数据。</li></ul><p>这里面大部分的方法逻辑都很简单，从方法名字就可以看得出来。我重点说一下 <strong>addBroker</strong>，以及 <strong>底层相关的私有方法addNewBroker和startRequestSendThread方法</strong>。</p><p>毕竟，addBroker是最重要的逻辑。每当集群中扩容了新的Broker时，Controller就会调用这个方法为新Broker增加新的RequestSendThread线程。</p><p>我们先来看addBroker：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def addBroker(broker: Broker): Unit = {</span></span>
<span class="line"><span>    brokerLock synchronized {</span></span>
<span class="line"><span>      // 如果该Broker是新Broker的话</span></span>
<span class="line"><span>      if (!brokerStateInfo.contains(broker.id)) {</span></span>
<span class="line"><span>        // 将新Broker加入到Controller管理，并创建对应的RequestSendThread线程</span></span>
<span class="line"><span>        addNewBroker(broker)</span></span>
<span class="line"><span>        // 启动RequestSendThread线程</span></span>
<span class="line"><span>        startRequestSendThread(broker.id)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>整个代码段被brokerLock保护起来了。还记得brokerStateInfo的定义吗？它仅仅是一个HashMap对象，因为不是线程安全的，所以任何访问该变量的地方，都需要锁的保护。</p><p>这段代码的逻辑是，判断目标Broker的序号，是否已经保存在brokerStateInfo中。如果是，就说明这个Broker之前已经添加过了，就没必要再次添加了；否则，addBroker方法会对目前的Broker执行两个操作：</p><ol><li>把该Broker节点添加到brokerStateInfo中；</li><li>启动与该Broker对应的RequestSendThread线程。</li></ol><p>这两步分别是由addNewBroker和startRequestSendThread方法实现的。</p><p>addNewBroker方法的逻辑比较复杂，我用注释的方式给出主要步骤：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def addNewBroker(broker: Broker): Unit = {</span></span>
<span class="line"><span>  // 为该Broker构造请求阻塞队列</span></span>
<span class="line"><span>  val messageQueue = new LinkedBlockingQueue[QueueItem]</span></span>
<span class="line"><span>  debug(s&quot;Controller \${config.brokerId} trying to connect to broker \${broker.id}&quot;)</span></span>
<span class="line"><span>  val controllerToBrokerListenerName = config.controlPlaneListenerName.getOrElse(config.interBrokerListenerName)</span></span>
<span class="line"><span>  val controllerToBrokerSecurityProtocol = config.controlPlaneSecurityProtocol.getOrElse(config.interBrokerSecurityProtocol)</span></span>
<span class="line"><span>  // 获取待连接Broker节点对象信息</span></span>
<span class="line"><span>  val brokerNode = broker.node(controllerToBrokerListenerName)</span></span>
<span class="line"><span>  val logContext = new LogContext(s&quot;[Controller id=\${config.brokerId}, targetBrokerId=\${brokerNode.idString}] &quot;)</span></span>
<span class="line"><span>  val (networkClient, reconfigurableChannelBuilder) = {</span></span>
<span class="line"><span>    val channelBuilder = ChannelBuilders.clientChannelBuilder(</span></span>
<span class="line"><span>      controllerToBrokerSecurityProtocol,</span></span>
<span class="line"><span>      JaasContext.Type.SERVER,</span></span>
<span class="line"><span>      config,</span></span>
<span class="line"><span>      controllerToBrokerListenerName,</span></span>
<span class="line"><span>      config.saslMechanismInterBrokerProtocol,</span></span>
<span class="line"><span>      time,</span></span>
<span class="line"><span>      config.saslInterBrokerHandshakeRequestEnable,</span></span>
<span class="line"><span>      logContext</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    val reconfigurableChannelBuilder = channelBuilder match {</span></span>
<span class="line"><span>      case reconfigurable: Reconfigurable =&amp;gt;</span></span>
<span class="line"><span>        config.addReconfigurable(reconfigurable)</span></span>
<span class="line"><span>        Some(reconfigurable)</span></span>
<span class="line"><span>      case _ =&amp;gt; None</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 创建NIO Selector实例用于网络数据传输</span></span>
<span class="line"><span>    val selector = new Selector(</span></span>
<span class="line"><span>      NetworkReceive.UNLIMITED,</span></span>
<span class="line"><span>      Selector.NO_IDLE_TIMEOUT_MS,</span></span>
<span class="line"><span>      metrics,</span></span>
<span class="line"><span>      time,</span></span>
<span class="line"><span>      &quot;controller-channel&quot;,</span></span>
<span class="line"><span>      Map(&quot;broker-id&quot; -&amp;gt; brokerNode.idString).asJava,</span></span>
<span class="line"><span>      false,</span></span>
<span class="line"><span>      channelBuilder,</span></span>
<span class="line"><span>      logContext</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    // 创建NetworkClient实例</span></span>
<span class="line"><span>    // NetworkClient类是Kafka clients工程封装的顶层网络客户端API</span></span>
<span class="line"><span>    // 提供了丰富的方法实现网络层IO数据传输</span></span>
<span class="line"><span>    val networkClient = new NetworkClient(</span></span>
<span class="line"><span>      selector,</span></span>
<span class="line"><span>      new ManualMetadataUpdater(Seq(brokerNode).asJava),</span></span>
<span class="line"><span>      config.brokerId.toString,</span></span>
<span class="line"><span>      1,</span></span>
<span class="line"><span>      0,</span></span>
<span class="line"><span>      0,</span></span>
<span class="line"><span>      Selectable.USE_DEFAULT_BUFFER_SIZE,</span></span>
<span class="line"><span>      Selectable.USE_DEFAULT_BUFFER_SIZE,</span></span>
<span class="line"><span>      config.requestTimeoutMs,</span></span>
<span class="line"><span>      ClientDnsLookup.DEFAULT,</span></span>
<span class="line"><span>      time,</span></span>
<span class="line"><span>      false,</span></span>
<span class="line"><span>      new ApiVersions,</span></span>
<span class="line"><span>      logContext</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    (networkClient, reconfigurableChannelBuilder)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 为这个RequestSendThread线程设置线程名称</span></span>
<span class="line"><span>  val threadName = threadNamePrefix match {</span></span>
<span class="line"><span>    case None =&amp;gt; s&quot;Controller-\${config.brokerId}-to-broker-\${broker.id}-send-thread&quot;</span></span>
<span class="line"><span>    case Some(name) =&amp;gt; s&quot;$name:Controller-\${config.brokerId}-to-broker-\${broker.id}-send-thread&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 构造请求处理速率监控指标</span></span>
<span class="line"><span>  val requestRateAndQueueTimeMetrics = newTimer(</span></span>
<span class="line"><span>    RequestRateAndQueueTimeMetricName, TimeUnit.MILLISECONDS, TimeUnit.SECONDS, brokerMetricTags(broker.id)</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>  // 创建RequestSendThread实例</span></span>
<span class="line"><span>  val requestThread = new RequestSendThread(config.brokerId, controllerContext, messageQueue, networkClient,</span></span>
<span class="line"><span>    brokerNode, config, time, requestRateAndQueueTimeMetrics, stateChangeLogger, threadName)</span></span>
<span class="line"><span>  requestThread.setDaemon(false)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  val queueSizeGauge = newGauge(QueueSizeMetricName, () =&amp;gt; messageQueue.size, brokerMetricTags(broker.id))</span></span>
<span class="line"><span>  // 创建该Broker专属的ControllerBrokerStateInfo实例</span></span>
<span class="line"><span>  // 并将其加入到brokerStateInfo统一管理</span></span>
<span class="line"><span>  brokerStateInfo.put(broker.id, ControllerBrokerStateInfo(networkClient, brokerNode, messageQueue,</span></span>
<span class="line"><span>    requestThread, queueSizeGauge, requestRateAndQueueTimeMetrics, reconfigurableChannelBuilder))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了方便你理解，我还画了一张流程图形象说明它的执行流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/4f34c319f9480c16ac12dee78d5ba322.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/4f34c319f9480c16ac12dee78d5ba322.jpg" alt=""></a></p><p>addNewBroker的关键在于， <strong>要为目标Broker创建一系列的配套资源</strong>，比如，NetworkClient用于网络I/O操作、messageQueue用于阻塞队列、requestThread用于发送请求，等等。</p><p>至于startRequestSendThread方法，就简单得多了，只有几行代码而已。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected def startRequestSendThread(brokerId: Int): Unit = {</span></span>
<span class="line"><span>  // 获取指定Broker的专属RequestSendThread实例</span></span>
<span class="line"><span>  val requestThread = brokerStateInfo(brokerId).requestSendThread</span></span>
<span class="line"><span>  if (requestThread.getState == Thread.State.NEW)</span></span>
<span class="line"><span>    // 启动线程</span></span>
<span class="line"><span>    requestThread.start()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它首先根据给定的Broker序号信息，从brokerStateInfo中找出对应的ControllerBrokerStateInfo对象。有了这个对象，也就有了为该目标Broker服务的所有配套资源。下一步就是从ControllerBrokerStateInfo中拿出RequestSendThread对象，再启动它就好了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我结合ControllerChannelManager.scala文件，重点分析了Controller向Broker发送请求机制的实现原理。</p><p>Controller主要通过ControllerChannelManager类来实现与其他Broker之间的请求发送。其中，ControllerChannelManager类中定义的RequestSendThread是主要的线程实现类，用于实际发送请求给集群Broker。除了RequestSendThread之外，ControllerChannelManager还定义了相应的管理方法，如添加Broker、移除Broker等。通过这些管理方法，Controller在集群扩缩容时能够快速地响应到这些变化，完成对应Broker连接的创建与销毁。</p><p>我们来回顾下这节课的重点。</p><ul><li>Controller端请求：Controller发送三类请求给Broker，分别是LeaderAndIsrRequest、StopReplicaRequest和UpdateMetadataRequest。</li><li>RequestSendThread：该线程负责将请求发送给集群中的相关或所有Broker。</li><li>请求阻塞队列+RequestSendThread：Controller会为集群上所有Broker创建对应的请求阻塞队列和RequestSendThread线程。</li></ul><p>其实，今天讲的所有东西都只是这节课的第二张图中“消费者”的部分，我们并没有详细了解请求是怎么被放到请求队列中的。接下来，我们就会针对这个问题，深入地去探讨Controller单线程的事件处理器是如何实现的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/00fce28d26a94389f2bb5e957b650bb9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/235904/00fce28d26a94389f2bb5e957b650bb9.jpg" alt=""></a></p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>你觉得，为每个Broker都创建一个RequestSendThread的方案有什么优缺点？</p><p>欢迎你在留言区写下你的思考和答案，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,83)])])}const k=n(r,[["render",l]]);export{g as __pageData,k as default};
