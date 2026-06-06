import{_ as e,H as a,f as s,i as t}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"13 | ControllerEventManager：变身单线程后的Controller如何处理事件？","description":"","frontmatter":{},"headers":[{"level":2,"title":"基本术语和概念","slug":"基本术语和概念","link":"#基本术语和概念","children":[]},{"level":2,"title":"ControllerEventProcessor","slug":"controllereventprocessor","link":"#controllereventprocessor","children":[]},{"level":2,"title":"ControllerEvent","slug":"controllerevent","link":"#controllerevent","children":[]},{"level":2,"title":"ControllerEventManager","slug":"controllereventmanager","link":"#controllereventmanager","children":[{"level":3,"title":"QueuedEvent","slug":"queuedevent","link":"#queuedevent","children":[]},{"level":3,"title":"ControllerEventThread","slug":"controllereventthread","link":"#controllereventthread","children":[]},{"level":3,"title":"其他方法","slug":"其他方法","link":"#其他方法","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/13-ControllerEventManager：变身单线程后的Controller如何处理事件？.md","filePath":"Kafka核心源码解读/13-ControllerEventManager：变身单线程后的Controller如何处理事件？.md","lastUpdated":1779815932000}'),l={name:"Kafka核心源码解读/13-ControllerEventManager：变身单线程后的Controller如何处理事件？.md"};function p(r,n,o,i,c,d){return a(),s("div",null,[...n[0]||(n[0]=[t(`<h1 id="_13-controllereventmanager-变身单线程后的controller如何处理事件" tabindex="-1">13 | ControllerEventManager：变身单线程后的Controller如何处理事件？ <a class="header-anchor" href="#_13-controllereventmanager-变身单线程后的controller如何处理事件" aria-label="Permalink to &quot;13 | ControllerEventManager：变身单线程后的Controller如何处理事件？&quot;">​</a></h1><p>你好，我是胡夕。 今天，我们来学习下Controller的单线程事件处理器源码。</p><p>所谓的单线程事件处理器，就是Controller端定义的一个组件。该组件内置了一个专属线程，负责处理其他线程发送过来的Controller事件。另外，它还定义了一些管理方法，用于为专属线程输送待处理事件。</p><p>在0.11.0.0版本之前，Controller组件的源码非常复杂。集群元数据信息在程序中同时被多个线程访问，因此，源码里有大量的Monitor锁、Lock锁或其他线程安全机制，这就导致，这部分代码读起来晦涩难懂，改动起来也困难重重，因为你根本不知道，变动了这个线程访问的数据，会不会影响到其他线程。同时，开发人员在修复Controller Bug时，也非常吃力。</p><p>鉴于这个原因，自0.11.0.0版本开始，社区陆续对Controller代码结构进行了改造。其中非常重要的一环，就是将 <strong>多线程并发访问的方式改为了单线程的事件队列方式</strong>。</p><p>这里的单线程，并非是指Controller只有一个线程了，而是指 <strong>对局部状态的访问限制在一个专属线程上</strong>，即让这个特定线程排他性地操作Controller元数据信息。</p><p>这样一来，整个组件代码就不必担心多线程访问引发的各种线程安全问题了，源码也可以抛弃各种不必要的锁机制，最终大大简化了Controller端的代码结构。</p><p>这部分源码非常重要， <strong>它能够帮助你掌握Controller端处理各类事件的原理，这将极大地提升你在实际场景中处理Controller各类问题的能力</strong>。因此，我建议你多读几遍，彻底了解Controller是怎么处理各种事件的。</p><h2 id="基本术语和概念" tabindex="-1">基本术语和概念 <a class="header-anchor" href="#基本术语和概念" aria-label="Permalink to &quot;基本术语和概念&quot;">​</a></h2><p>接下来，我们先宏观领略一下Controller单线程事件队列处理模型及其基础组件。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/67fbf8a12ebb57bc309188dcbc18e231.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/67fbf8a12ebb57bc309188dcbc18e231.jpg" alt=""></a></p><p>从图中可见，Controller端有多个线程向事件队列写入不同种类的事件，比如，ZooKeeper端注册的Watcher线程、KafkaRequestHandler线程、Kafka定时任务线程，等等。而在事件队列的另一端，只有一个名为ControllerEventThread的线程专门负责“消费”或处理队列中的事件。这就是所谓的单线程事件队列模型。</p><p>参与实现这个模型的源码类有4个。</p><ul><li>ControllerEventProcessor：Controller端的事件处理器接口。</li><li>ControllerEvent：Controller事件，也就是事件队列中被处理的对象。</li><li>ControllerEventManager：事件处理器，用于创建和管理ControllerEventThread。</li><li>ControllerEventThread：专属的事件处理线程，唯一的作用是处理不同种类的ControllEvent。这个类是ControllerEventManager类内部定义的线程类。</li></ul><p>今天，我们的重要目标就是要搞懂这4个类。就像我前面说的，它们完整地构建出了单线程事件队列模型。下面我们将一个一个地学习它们的源码，你要重点掌握事件队列的实现以及专属线程是如何访问事件队列的。</p><h2 id="controllereventprocessor" tabindex="-1">ControllerEventProcessor <a class="header-anchor" href="#controllereventprocessor" aria-label="Permalink to &quot;ControllerEventProcessor&quot;">​</a></h2><p>这个接口位于controller包下的ControllerEventManager.scala文件中。它定义了一个支持普通处理和抢占处理Controller事件的接口，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>trait ControllerEventProcessor {</span></span>
<span class="line"><span>  def process(event: ControllerEvent): Unit</span></span>
<span class="line"><span>  def preempt(event: ControllerEvent): Unit</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该接口定义了两个方法，分别是process和preempt。</p><ul><li>process：接收一个Controller事件，并进行处理。</li><li>preempt：接收一个Controller事件，并抢占队列之前的事件进行优先处理。</li></ul><p>目前，在Kafka源码中，KafkaController类是Controller组件的功能实现类，它也是ControllerEventProcessor接口的唯一实现类。</p><p>对于这个接口，你要重点掌握process方法的作用，因为 <strong>它是实现Controller事件处理的主力方法</strong>。你要了解process方法 <strong>处理各类Controller事件的代码结构是什么样的</strong>，而且还要能够准确地找到处理每类事件的子方法。</p><p>至于preempt方法，你仅需要了解，Kafka使用它实现某些高优先级事件的抢占处理即可，毕竟，目前在源码中只有两类事件（ShutdownEventThread和Expire）需要抢占式处理，出镜率不是很高。</p><h2 id="controllerevent" tabindex="-1">ControllerEvent <a class="header-anchor" href="#controllerevent" aria-label="Permalink to &quot;ControllerEvent&quot;">​</a></h2><p>这就是前面说到的Controller事件，在源码中对应的就是ControllerEvent接口。该接口定义在KafkaController.scala文件中，本质上是一个trait类型，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sealed trait ControllerEvent {</span></span>
<span class="line"><span>  def state: ControllerState</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>每个ControllerEvent都定义了一个状态</strong>。Controller在处理具体的事件时，会对状态进行相应的变更。这个状态是由源码文件ControllerState.scala中的抽象类ControllerState定义的，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sealed abstract class ControllerState {</span></span>
<span class="line"><span>  def value: Byte</span></span>
<span class="line"><span>  def rateAndTimeMetricName: Option[String] =</span></span>
<span class="line"><span>    if (hasRateAndTimeMetric) Some(s&quot;\${toString}RateAndTimeMs&quot;) else None</span></span>
<span class="line"><span>  protected def hasRateAndTimeMetric: Boolean = true</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>每类ControllerState都定义一个value值，表示Controller状态的序号，从0开始。另外，rateAndTimeMetricName方法是用于构造Controller状态速率的监控指标名称的。</p><p>比如，TopicChange是一类ControllerState，用于表示主题总数发生了变化。为了监控这类状态变更速率，代码中的rateAndTimeMetricName方法会定义一个名为TopicChangeRateAndTimeMs的指标。当然，并非所有的ControllerState都有对应的速率监控指标，比如，表示空闲状态的Idle就没有对应的指标。</p><p>目前，Controller总共定义了25类事件和17种状态，它们的对应关系如下表所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/a4bd821a8fac58bdf9c813379bc28e63.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/a4bd821a8fac58bdf9c813379bc28e63.jpg" alt=""></a></p><p>内容看着好像有很多，那我们应该怎样使用这张表格呢？</p><p>实际上，你并不需要记住每一行的对应关系。这张表格更像是一个工具，当你监控到某些Controller状态变更速率异常的时候，你可以通过这张表格，快速确定可能造成瓶颈的Controller事件，并定位处理该事件的函数代码，辅助你进一步地调试问题。</p><p>另外，你要了解的是， <strong>多个ControllerEvent可能归属于相同的ControllerState。</strong></p><p>比如，TopicChange和PartitionModifications事件都属于TopicChange状态，毕竟，它们都与Topic的变更有关。前者是创建Topic，后者是修改Topic的属性，比如，分区数或副本因子，等等。</p><p>再比如，BrokerChange和BrokerModifications事件都属于 BrokerChange状态，表征的都是对Broker属性的修改。</p><h2 id="controllereventmanager" tabindex="-1">ControllerEventManager <a class="header-anchor" href="#controllereventmanager" aria-label="Permalink to &quot;ControllerEventManager&quot;">​</a></h2><p>有了这些铺垫，我们就可以开始学习事件处理器的实现代码了。</p><p>在Kafka中，Controller事件处理器代码位于controller包下的ControllerEventManager.scala文件下。我用一张图来展示下这个文件的结构：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/1137cfd21025c797369fa3d39cee5d4b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/1137cfd21025c797369fa3d39cee5d4b.jpg" alt=""></a></p><p>如图所示，该文件主要由4个部分组成。</p><ul><li><strong>ControllerEventManager Object</strong>：保存一些字符串常量，比如线程名字。</li><li><strong>ControllerEventProcessor</strong>：前面讲过的事件处理器接口，目前只有KafkaController实现了这个接口。</li><li><strong>QueuedEvent</strong>：表征事件队列上的事件对象。</li><li><strong>ControllerEventManager Class</strong>：ControllerEventManager的伴生类，主要用于创建和管理事件处理线程和事件队列。就像我前面说的，这个类中定义了重要的ControllerEventThread线程类，还有一些其他值得我们学习的重要方法，一会儿我们详细说说。</li></ul><p>ControllerEventManager对象仅仅定义了3个公共变量，没有任何逻辑，你简单看下就行。至于ControllerEventProcessor接口，我们刚刚已经学习过了。接下来，我们重点学习后面这两个类。</p><h3 id="queuedevent" tabindex="-1">QueuedEvent <a class="header-anchor" href="#queuedevent" aria-label="Permalink to &quot;QueuedEvent&quot;">​</a></h3><p>我们先来看QueuedEvent的定义，全部代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 每个QueuedEvent定义了两个字段</span></span>
<span class="line"><span>// event: ControllerEvent类，表示Controller事件</span></span>
<span class="line"><span>// enqueueTimeMs：表示Controller事件被放入到事件队列的时间戳</span></span>
<span class="line"><span>class QueuedEvent(val event: ControllerEvent,</span></span>
<span class="line"><span>                  val enqueueTimeMs: Long) {</span></span>
<span class="line"><span>  // 标识事件是否开始被处理</span></span>
<span class="line"><span>  val processingStarted = new CountDownLatch(1)</span></span>
<span class="line"><span>  // 标识事件是否被处理过</span></span>
<span class="line"><span>  val spent = new AtomicBoolean(false)</span></span>
<span class="line"><span>  // 处理事件</span></span>
<span class="line"><span>  def process(processor: ControllerEventProcessor): Unit = {</span></span>
<span class="line"><span>    if (spent.getAndSet(true))</span></span>
<span class="line"><span>      return</span></span>
<span class="line"><span>    processingStarted.countDown()</span></span>
<span class="line"><span>    processor.process(event)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 抢占式处理事件</span></span>
<span class="line"><span>  def preempt(processor: ControllerEventProcessor): Unit = {</span></span>
<span class="line"><span>    if (spent.getAndSet(true))</span></span>
<span class="line"><span>      return</span></span>
<span class="line"><span>    processor.preempt(event)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 阻塞等待事件被处理完成</span></span>
<span class="line"><span>  def awaitProcessing(): Unit = {</span></span>
<span class="line"><span>    processingStarted.await()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  override def toString: String = {</span></span>
<span class="line"><span>    s&quot;QueuedEvent(event=$event, enqueueTimeMs=$enqueueTimeMs)&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，每个QueuedEvent对象实例都裹挟了一个ControllerEvent。另外，每个QueuedEvent还定义了process、preempt和awaitProcessing方法，分别表示 <strong>处理事件</strong>、 <strong>以抢占方式处理事件</strong>，以及 <strong>等待事件处理</strong>。</p><p>其中，process方法和preempt方法的实现原理，就是调用给定ControllerEventProcessor接口的process和preempt方法，非常简单。</p><p>在QueuedEvent对象中，我们再一次看到了CountDownLatch的身影，我在 <a href="https://time.geekbang.org/column/article/231139" target="_blank" rel="noreferrer">第7节课</a> 里提到过它。Kafka源码非常喜欢用CountDownLatch来做各种条件控制，比如用于侦测线程是否成功启动、成功关闭，等等。</p><p>在这里，QueuedEvent使用它的唯一目的，是确保Expire事件在建立ZooKeeper会话前被处理。</p><p>如果不是在这个场景下，那么，代码就用spent来标识该事件是否已经被处理过了，如果已经被处理过了，再次调用process方法时就会直接返回，什么都不做。</p><h3 id="controllereventthread" tabindex="-1">ControllerEventThread <a class="header-anchor" href="#controllereventthread" aria-label="Permalink to &quot;ControllerEventThread&quot;">​</a></h3><p>了解了QueuedEvent，我们来看下消费它们的ControllerEventThread类。</p><p>首先是这个类的定义代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class ControllerEventThread(name: String) extends ShutdownableThread(name = name, isInterruptible = false) {</span></span>
<span class="line"><span>  logIdent = s&quot;[ControllerEventThread controllerId=$controllerId] &quot;</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个类就是一个普通的线程类，继承了ShutdownableThread基类，而后者是Kafka为很多线程类定义的公共父类。该父类是Java Thread类的子类，其线程逻辑方法run的主要代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def doWork(): Unit</span></span>
<span class="line"><span>override def run(): Unit = {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    while (isRunning)</span></span>
<span class="line"><span>      doWork()</span></span>
<span class="line"><span>  } catch {</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可见，这个父类会循环地执行doWork方法的逻辑，而该方法的具体实现则交由子类来完成。</p><p>作为Controller唯一的事件处理线程，我们要时刻关注这个线程的运行状态。因此，我们必须要知道这个线程在JVM上的名字，这样后续我们就能有针对性地对其展开监控。这个线程的名字是由ControllerEventManager Object中ControllerEventThreadName变量定义的，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>object ControllerEventManager {</span></span>
<span class="line"><span>  val ControllerEventThreadName = &quot;controller-event-thread&quot;</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在我们看看ControllerEventThread类的doWork是如何实现的。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>override def doWork(): Unit = {</span></span>
<span class="line"><span>  // 从事件队列中获取待处理的Controller事件，否则等待</span></span>
<span class="line"><span>  val dequeued = queue.take()</span></span>
<span class="line"><span>  dequeued.event match {</span></span>
<span class="line"><span>    // 如果是关闭线程事件，什么都不用做。关闭线程由外部来执行</span></span>
<span class="line"><span>    case ShutdownEventThread =&amp;gt;</span></span>
<span class="line"><span>    case controllerEvent =&amp;gt;</span></span>
<span class="line"><span>      _state = controllerEvent.state</span></span>
<span class="line"><span>      // 更新对应事件在队列中保存的时间</span></span>
<span class="line"><span>      eventQueueTimeHist.update(time.milliseconds() - dequeued.enqueueTimeMs)</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        def process(): Unit = dequeued.process(processor)</span></span>
<span class="line"><span>        // 处理事件，同时计算处理速率</span></span>
<span class="line"><span>        rateAndTimeMetrics.get(state) match {</span></span>
<span class="line"><span>          case Some(timer) =&amp;gt; timer.time { process() }</span></span>
<span class="line"><span>          case None =&amp;gt; process()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } catch {</span></span>
<span class="line"><span>        case e: Throwable =&amp;gt; error(s&quot;Uncaught error processing event $controllerEvent&quot;, e)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      _state = ControllerState.Idle</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我用一张图来展示下具体的执行流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/db4905db1a32ac7d356317f29d920dd1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/db4905db1a32ac7d356317f29d920dd1.jpg" alt=""></a></p><p>大体上看，执行逻辑很简单。</p><p>首先是调用LinkedBlockingQueue的take方法，去获取待处理的QueuedEvent对象实例。注意，这里用的是 <strong>take方法</strong>，这说明，如果事件队列中没有QueuedEvent，那么，ControllerEventThread线程将一直处于阻塞状态，直到事件队列上插入了新的待处理事件。</p><p>一旦拿到QueuedEvent事件后，线程会判断是否是ShutdownEventThread事件。当ControllerEventManager关闭时，会显式地向事件队列中塞入ShutdownEventThread，表明要关闭ControllerEventThread线程。如果是该事件，那么ControllerEventThread什么都不用做，毕竟要关闭这个线程了。相反地，如果是其他的事件，就调用QueuedEvent的process方法执行对应的处理逻辑，同时计算事件被处理的速率。</p><p>该process方法底层调用的是ControllerEventProcessor的process方法，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def process(processor: ControllerEventProcessor): Unit = {</span></span>
<span class="line"><span>  // 若已经被处理过，直接返回</span></span>
<span class="line"><span>  if (spent.getAndSet(true))</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>  processingStarted.countDown()</span></span>
<span class="line"><span>  // 调用ControllerEventProcessor的process方法处理事件</span></span>
<span class="line"><span>  processor.process(event)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>方法首先会判断该事件是否已经被处理过，如果是，就直接返回；如果不是，就调用ControllerEventProcessor的process方法处理事件。</p><p>你可能很关心，每个ControllerEventProcessor的process方法是在哪里实现的？实际上，它们都封装在KafkaController.scala文件中。还记得我之前说过，KafkaController类是目前源码中ControllerEventProcessor接口的唯一实现类吗？</p><p>实际上，就是KafkaController类实现了ControllerEventProcessor的process方法。由于代码过长，而且有很多重复结构的代码，因此，我只展示部分代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>override def process(event: ControllerEvent): Unit = {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      // 依次匹配ControllerEvent事件</span></span>
<span class="line"><span>      event match {</span></span>
<span class="line"><span>        case event: MockEvent =&amp;gt;</span></span>
<span class="line"><span>          event.process()</span></span>
<span class="line"><span>        case ShutdownEventThread =&amp;gt;</span></span>
<span class="line"><span>          error(&quot;Received a ShutdownEventThread event. This type of event is supposed to be handle by ControllerEventThread&quot;)</span></span>
<span class="line"><span>        case AutoPreferredReplicaLeaderElection =&amp;gt;</span></span>
<span class="line"><span>          processAutoPreferredReplicaLeaderElection()</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch {</span></span>
<span class="line"><span>      // 如果Controller换成了别的Broker</span></span>
<span class="line"><span>      case e: ControllerMovedException =&amp;gt;</span></span>
<span class="line"><span>        info(s&quot;Controller moved to another broker when processing $event.&quot;, e)</span></span>
<span class="line"><span>        // 执行Controller卸任逻辑</span></span>
<span class="line"><span>        maybeResign()</span></span>
<span class="line"><span>      case e: Throwable =&amp;gt;</span></span>
<span class="line"><span>        error(s&quot;Error processing event $event&quot;, e)</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      updateMetrics()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个process方法接收一个ControllerEvent实例，接着会判断它是哪类Controller事件，并调用相应的处理方法。比如，如果是AutoPreferredReplicaLeaderElection事件，则调用processAutoPreferredReplicaLeaderElection方法；如果是其他类型的事件，则调用process***方法。</p><h3 id="其他方法" tabindex="-1">其他方法 <a class="header-anchor" href="#其他方法" aria-label="Permalink to &quot;其他方法&quot;">​</a></h3><p>除了QueuedEvent和ControllerEventThread之外， <strong>put方法</strong> 和 <strong>clearAndPut方法也很重要</strong>。如果说ControllerEventThread是读取队列事件的，那么，这两个方法就是向队列生产元素的。</p><p>在这两个方法中，put是把指定ControllerEvent插入到事件队列，而clearAndPut则是先执行具有高优先级的抢占式事件，之后清空队列所有事件，最后再插入指定的事件。</p><p>下面这两段源码分别对应于这两个方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// put方法</span></span>
<span class="line"><span>def put(event: ControllerEvent): QueuedEvent = inLock(putLock) {</span></span>
<span class="line"><span>  // 构建QueuedEvent实例</span></span>
<span class="line"><span>  val queuedEvent = new QueuedEvent(event, time.milliseconds())</span></span>
<span class="line"><span>  // 插入到事件队列</span></span>
<span class="line"><span>  queue.put(queuedEvent)</span></span>
<span class="line"><span>  // 返回新建QueuedEvent实例</span></span>
<span class="line"><span>  queuedEvent</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// clearAndPut方法</span></span>
<span class="line"><span>def clearAndPut(event: ControllerEvent): QueuedEvent = inLock(putLock) {</span></span>
<span class="line"><span>  // 优先处理抢占式事件</span></span>
<span class="line"><span>  queue.forEach(_.preempt(processor))</span></span>
<span class="line"><span>  // 清空事件队列</span></span>
<span class="line"><span>  queue.clear()</span></span>
<span class="line"><span>  // 调用上面的put方法将给定事件插入到事件队列</span></span>
<span class="line"><span>  put(event)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>整体上代码很简单，需要解释的地方不多，但我想和你讨论一个问题。</p><p>你注意到，源码中的put方法使用putLock对代码进行保护了吗？</p><p>就我个人而言，我觉得这个putLock是不需要的，因为LinkedBlockingQueue数据结构本身就已经是线程安全的了。put方法只会与全局共享变量queue打交道，因此，它们的线程安全性完全可以委托LinkedBlockingQueue实现。更何况，LinkedBlockingQueue内部已经维护了一个putLock和一个takeLock，专门保护读写操作。</p><p>当然，我同意在clearAndPut中使用锁的做法，毕竟，我们要保证，访问抢占式事件和清空操作构成一个原子操作。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们重点学习了Controller端的单线程事件队列实现方式，即ControllerEventManager通过构建ControllerEvent、ControllerState和对应的ControllerEventThread线程，并且结合专属事件队列，共同实现事件处理。我们来回顾下这节课的重点。</p><ul><li>ControllerEvent：定义Controller能够处理的各类事件名称，目前总共定义了25类事件。</li><li>ControllerState：定义Controller状态。你可以认为，它是ControllerEvent的上一级分类，因此，ControllerEvent和ControllerState是多对一的关系。</li><li>ControllerEventManager：Controller定义的事件管理器，专门定义和维护专属线程以及对应的事件队列。</li><li>ControllerEventThread：事件管理器创建的事件处理线程。该线程排他性地读取事件队列并处理队列中的所有事件。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/4ec79e1ff2b83d0a1e850b6acf30b226.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/237961/4ec79e1ff2b83d0a1e850b6acf30b226.jpg" alt=""></a></p><p>下节课，我们将正式进入到KafkaController的学习。这是一个有着2100多行的大文件，不过大部分的代码都是实现那27类ControllerEvent的处理逻辑，因此，你不要被它吓到了。我们会先学习Controller是如何选举出来的，后面会再详谈Controller的具体作用。</p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>你认为，ControllerEventManager中put方法代码是否有必要被一个Lock保护起来？</p><p>欢迎你在留言区畅所欲言，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,92)])])}const v=e(l,[["render",p]]);export{h as __pageData,v as default};
