import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"03 | 日志（下）：彻底搞懂Log对象的常见操作","description":"","frontmatter":{},"headers":[{"level":2,"title":"高水位管理操作","slug":"高水位管理操作","link":"#高水位管理操作","children":[{"level":3,"title":"定义","slug":"定义","link":"#定义","children":[]},{"level":3,"title":"获取和设置高水位值","slug":"获取和设置高水位值","link":"#获取和设置高水位值","children":[]},{"level":3,"title":"更新高水位值","slug":"更新高水位值","link":"#更新高水位值","children":[]},{"level":3,"title":"读取高水位值","slug":"读取高水位值","link":"#读取高水位值","children":[]}]},{"level":2,"title":"日志段管理","slug":"日志段管理","link":"#日志段管理","children":[]},{"level":2,"title":"关键位移值管理","slug":"关键位移值管理","link":"#关键位移值管理","children":[]},{"level":2,"title":"读写操作","slug":"读写操作","link":"#读写操作","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/03-日志（下）：彻底搞懂Log对象的常见操作.md","filePath":"Kafka核心源码解读/03-日志（下）：彻底搞懂Log对象的常见操作.md","lastUpdated":1779815932000}'),t={name:"Kafka核心源码解读/03-日志（下）：彻底搞懂Log对象的常见操作.md"};function l(i,s,o,c,r,f){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_03-日志-下-彻底搞懂log对象的常见操作" tabindex="-1">03 | 日志（下）：彻底搞懂Log对象的常见操作 <a class="header-anchor" href="#_03-日志-下-彻底搞懂log对象的常见操作" aria-label="Permalink to &quot;03 | 日志（下）：彻底搞懂Log对象的常见操作&quot;">​</a></h1><p>你好，我是胡夕。上节课，我们一起了解了日志加载日志段的过程。今天，我会继续带你学习Log源码，给你介绍Log对象的常见操作。</p><p>我一般习惯把Log的常见操作分为4大部分。</p><ol><li><strong>高水位管理操作</strong>：高水位的概念在Kafka中举足轻重，对它的管理，是Log最重要的功能之一。</li><li><strong>日志段管理</strong>：Log是日志段的容器。高效组织与管理其下辖的所有日志段对象，是源码要解决的核心问题。</li><li><strong>关键位移值管理</strong>：日志定义了很多重要的位移值，比如Log Start Offset和LEO等。确保这些位移值的正确性，是构建消息引擎一致性的基础。</li><li><strong>读写操作</strong>：所谓的操作日志，大体上就是指读写日志。读写操作的作用之大，不言而喻。</li></ol><p>接下来，我会按照这个顺序和你介绍Log对象的常见操作，并希望你特别关注下高水位管理部分。</p><p>事实上，社区关于日志代码的很多改进都是基于高水位机制的，有的甚至是为了替代高水位机制而做的更新。比如，Kafka的KIP-101提案正式引入的Leader Epoch机制，就是用来替代日志截断操作中的高水位的。显然，要深入学习Leader Epoch，你至少要先了解高水位并清楚它的弊病在哪儿才行。</p><p>既然高水位管理这么重要，那我们就从它开始说起吧。</p><h2 id="高水位管理操作" tabindex="-1">高水位管理操作 <a class="header-anchor" href="#高水位管理操作" aria-label="Permalink to &quot;高水位管理操作&quot;">​</a></h2><p>在介绍高水位管理操作之前，我们先来了解一下高水位的定义。</p><h3 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h3><p>源码中日志对象定义高水位的语句只有一行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;volatile private var highWatermarkMetadata: LogOffsetMetadata = LogOffsetMetadata(logStartOffset)</span></span></code></pre></div><p>这行语句传达了两个重要的事实：</p><ol><li>高水位值是volatile（易变型）的。因为多个线程可能同时读取它，因此需要设置成volatile，保证内存可见性。另外，由于高水位值可能被多个线程同时修改，因此源码使用Java Monitor锁来确保并发修改的线程安全。</li><li>高水位值的初始值是Log Start Offset值。上节课我们提到，每个Log对象都会维护一个Log Start Offset值。当首次构建高水位时，它会被赋值成Log Start Offset值。</li></ol><p>你可能会关心LogOffsetMetadata是什么对象。因为它比较重要，我们一起来看下这个类的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class LogOffsetMetadata(messageOffset: Long,</span></span>
<span class="line"><span>                             segmentBaseOffset: Long = Log.UnknownOffset, relativePositionInSegment: Int = LogOffsetMetadata.UnknownFilePosition)</span></span></code></pre></div><p>显然，它就是一个POJO类，里面保存了三个重要的变量。</p><ol><li>messageOffset： <strong>消息位移值</strong>，这是最重要的信息。我们总说高水位值，其实指的就是这个变量的值。</li><li>segmentBaseOffset： <strong>保存该位移值所在日志段的起始位移</strong>。日志段起始位移值辅助计算两条消息在物理磁盘文件中位置的差值，即两条消息彼此隔了多少字节。这个计算有个前提条件，即两条消息必须处在同一个日志段对象上，不能跨日志段对象。否则它们就位于不同的物理文件上，计算这个值就没有意义了。 <strong>这里的segmentBaseOffset，就是用来判断两条消息是否处于同一个日志段的</strong>。</li><li>relativePositionSegment： <strong>保存该位移值所在日志段的物理磁盘位置</strong>。这个字段在计算两个位移值之间的物理磁盘位置差值时非常有用。你可以想一想，Kafka什么时候需要计算位置之间的字节数呢？答案就是在读取日志的时候。假设每次读取时只能读1MB的数据，那么，源码肯定需要关心两个位移之间所有消息的总字节数是否超过了1MB。</li></ol><p>LogOffsetMetadata类的所有方法，都是围绕这3个变量展开的工具辅助类方法，非常容易理解。我会给出一个方法的详细解释，剩下的你可以举一反三。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def onSameSegment(that: LogOffsetMetadata): Boolean = {</span></span>
<span class="line"><span>    if (messageOffsetOnly)</span></span>
<span class="line"><span>      throw new KafkaException(s&quot;$this cannot compare its segment info with $that since it only has message offset info&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.segmentBaseOffset == that.segmentBaseOffset</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>看名字我们就知道了，这个方法就是用来判断给定的两个LogOffsetMetadata对象是否处于同一个日志段的。判断方法很简单，就是比较两个LogOffsetMetadata对象的segmentBaseOffset值是否相等。</p><p>好了，我们接着说回高水位，你要重点关注下获取和设置高水位值、更新高水位值，以及读取高水位值的方法。</p><h3 id="获取和设置高水位值" tabindex="-1">获取和设置高水位值 <a class="header-anchor" href="#获取和设置高水位值" aria-label="Permalink to &quot;获取和设置高水位值&quot;">​</a></h3><p>关于获取高水位值的方法，其实很好理解，我就不多说了。设置高水位值的方法，也就是Setter方法更复杂一些，为了方便你理解，我用注释的方式来解析它的作用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// getter method：读取高水位的位移值</span></span>
<span class="line"><span>def highWatermark: Long = highWatermarkMetadata.messageOffset</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// setter method：设置高水位值</span></span>
<span class="line"><span>private def updateHighWatermarkMetadata(newHighWatermark: LogOffsetMetadata): Unit = {</span></span>
<span class="line"><span>    if (newHighWatermark.messageOffset &amp;lt; 0) // 高水位值不能是负数</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;High watermark offset should be non-negative&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lock synchronized { // 保护Log对象修改的Monitor锁</span></span>
<span class="line"><span>      highWatermarkMetadata = newHighWatermark // 赋值新的高水位值</span></span>
<span class="line"><span>      producerStateManager.onHighWatermarkUpdated(newHighWatermark.messageOffset) // 处理事务状态管理器的高水位值更新逻辑，忽略它……</span></span>
<span class="line"><span>      maybeIncrementFirstUnstableOffset() // First Unstable Offset是Kafka事务机制的一部分，忽略它……</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    trace(s&quot;Setting high watermark $newHighWatermark&quot;)</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="更新高水位值" tabindex="-1">更新高水位值 <a class="header-anchor" href="#更新高水位值" aria-label="Permalink to &quot;更新高水位值&quot;">​</a></h3><p>除此之外，源码还定义了两个更新高水位值的方法： <strong>updateHighWatermark</strong> 和 <strong>maybeIncrementHighWatermark</strong>。从名字上来看，前者是一定要更新高水位值的，而后者是可能会更新也可能不会。</p><p>我们分别看下它们的实现原理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// updateHighWatermark method</span></span>
<span class="line"><span>def updateHighWatermark(hw: Long): Long = {</span></span>
<span class="line"><span>    // 新高水位值一定介于[Log Start Offset，Log End Offset]之间</span></span>
<span class="line"><span>    val newHighWatermark = if (hw &amp;lt; logStartOffset)</span></span>
<span class="line"><span>      logStartOffset</span></span>
<span class="line"><span>    else if (hw &amp;gt; logEndOffset)</span></span>
<span class="line"><span>      logEndOffset</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>	hw</span></span>
<span class="line"><span>    // 调用Setter方法来更新高水位值</span></span>
<span class="line"><span>    updateHighWatermarkMetadata(LogOffsetMetadata(newHighWatermark))</span></span>
<span class="line"><span>    newHighWatermark  // 最后返回新高水位值</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>// maybeIncrementHighWatermark method</span></span>
<span class="line"><span>def maybeIncrementHighWatermark(newHighWatermark: LogOffsetMetadata): Option[LogOffsetMetadata] = {</span></span>
<span class="line"><span>    // 新高水位值不能越过Log End Offset</span></span>
<span class="line"><span>    if (newHighWatermark.messageOffset &amp;gt; logEndOffset)</span></span>
<span class="line"><span>      throw new IllegalArgumentException(s&quot;High watermark $newHighWatermark update exceeds current &quot; +</span></span>
<span class="line"><span>        s&quot;log end offset $logEndOffsetMetadata&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lock.synchronized {</span></span>
<span class="line"><span>      val oldHighWatermark = fetchHighWatermarkMetadata  // 获取老的高水位值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 新高水位值要比老高水位值大以维持单调增加特性，否则就不做更新！</span></span>
<span class="line"><span>      // 另外，如果新高水位值在新日志段上，也可执行更新高水位操作</span></span>
<span class="line"><span>      if (oldHighWatermark.messageOffset &amp;lt; newHighWatermark.messageOffset ||</span></span>
<span class="line"><span>        (oldHighWatermark.messageOffset == newHighWatermark.messageOffset &amp;&amp; oldHighWatermark.onOlderSegment(newHighWatermark))) {</span></span>
<span class="line"><span>        updateHighWatermarkMetadata(newHighWatermark)</span></span>
<span class="line"><span>        Some(oldHighWatermark) // 返回老的高水位值</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        None</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>你可能觉得奇怪，为什么要定义两个更新高水位的方法呢？</p><p>其实，这两个方法有着不同的用途。updateHighWatermark方法，主要用在Follower副本从Leader副本获取到消息后更新高水位值。一旦拿到新的消息，就必须要更新高水位值；而maybeIncrementHighWatermark方法，主要是用来更新Leader副本的高水位值。需要注意的是，Leader副本高水位值的更新是有条件的——某些情况下会更新高水位值，某些情况下可能不会。</p><p>就像我刚才说的，Follower副本成功拉取Leader副本的消息后必须更新高水位值，但Producer端向Leader副本写入消息时，分区的高水位值就可能不需要更新——因为它可能需要等待其他Follower副本同步的进度。因此，源码中定义了两个更新的方法，它们分别应用于不同的场景。</p><h3 id="读取高水位值" tabindex="-1">读取高水位值 <a class="header-anchor" href="#读取高水位值" aria-label="Permalink to &quot;读取高水位值&quot;">​</a></h3><p>关于高水位值管理的最后一个操作是 <strong>fetchHighWatermarkMetadata方法</strong>。它不仅仅是获取高水位值，还要获取高水位的其他元数据信息，即日志段起始位移和物理位置信息。下面是它的实现逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def fetchHighWatermarkMetadata: LogOffsetMetadata = {</span></span>
<span class="line"><span>    checkIfMemoryMappedBufferClosed() // 读取时确保日志不能被关闭</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val offsetMetadata = highWatermarkMetadata // 保存当前高水位值到本地变量，避免多线程访问干扰</span></span>
<span class="line"><span>    if (offsetMetadata.messageOffsetOnly) { //没有获得到完整的高水位元数据</span></span>
<span class="line"><span>      lock.synchronized {</span></span>
<span class="line"><span>        val fullOffset = convertToOffsetMetadataOrThrow(highWatermark) // 通过读日志文件的方式把完整的高水位元数据信息拉出来</span></span>
<span class="line"><span>        updateHighWatermarkMetadata(fullOffset) // 然后再更新一下高水位对象</span></span>
<span class="line"><span>        fullOffset</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } else { // 否则，直接返回即可</span></span>
<span class="line"><span>      offsetMetadata</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="日志段管理" tabindex="-1">日志段管理 <a class="header-anchor" href="#日志段管理" aria-label="Permalink to &quot;日志段管理&quot;">​</a></h2><p>前面我反复说过，日志是日志段的容器，那它究竟是如何承担起容器一职的呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private val segments: ConcurrentNavigableMap[java.lang.Long, LogSegment] = new ConcurrentSkipListMap[java.lang.Long, LogSegment]</span></span></code></pre></div><p>可以看到，源码使用Java的ConcurrentSkipListMap类来保存所有日志段对象。ConcurrentSkipListMap有2个明显的优势。</p><ul><li><strong>它是线程安全的</strong>，这样Kafka源码不需要自行确保日志段操作过程中的线程安全；</li><li><strong>它是键值（Key）可排序的Map</strong>。Kafka将每个日志段的起始位移值作为Key，这样一来，我们就能够很方便地根据所有日志段的起始位移值对它们进行排序和比较，同时还能快速地找到与给定位移值相近的前后两个日志段。</li></ul><p>所谓的日志段管理，无非是增删改查。接下来，我们就从这4个方面一一来看下。</p><p><strong>1.增加</strong></p><p>Log对象中定义了添加日志段对象的方法： <strong>addSegment</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def addSegment(segment: LogSegment): LogSegment = this.segments.put(segment.baseOffset, segment)</span></span></code></pre></div><p>很简单吧，就是调用Map的put方法将给定的日志段对象添加到segments中。</p><p><strong>2.删除</strong></p><p>删除操作相对来说复杂一点。我们知道Kafka有很多留存策略，包括基于时间维度的、基于空间维度的和基于Log Start Offset维度的。那啥是留存策略呢？其实，它本质上就是 <strong>根据一定的规则决定哪些日志段可以删除</strong>。</p><p>从源码角度来看，Log中控制删除操作的总入口是 <strong>deleteOldSegments无参方法</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def deleteOldSegments(): Int = {</span></span>
<span class="line"><span>    if (config.delete) {</span></span>
<span class="line"><span>      deleteRetentionMsBreachedSegments() + deleteRetentionSizeBreachedSegments() + deleteLogStartOffsetBreachedSegments()</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      deleteLogStartOffsetBreachedSegments()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>代码中的deleteRetentionMsBreachedSegments、deleteRetentionSizeBreachedSegments和deleteLogStartOffsetBreachedSegments分别对应于上面的那3个策略。</p><p>下面这张图展示了Kafka当前的三种日志留存策略，以及底层涉及到日志段删除的所有方法：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/f321f8f8572356248465f00bd5b702ad.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/f321f8f8572356248465f00bd5b702ad.jpg" alt=""></a></p><p>从图中我们可以知道，上面3个留存策略方法底层都会调用带参数版本的deleteOldSegments方法，而这个方法又相继调用了deletableSegments和deleteSegments方法。下面，我们来深入学习下这3个方法的代码。</p><p>首先是带参数版的deleteOldSegments方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def deleteOldSegments(predicate: (LogSegment, Option[LogSegment]) =&amp;gt; Boolean, reason: String): Int = {</span></span>
<span class="line"><span>    lock synchronized {</span></span>
<span class="line"><span>      val deletable = deletableSegments(predicate)</span></span>
<span class="line"><span>      if (deletable.nonEmpty)</span></span>
<span class="line"><span>        info(s&quot;Found deletable segments with base offsets [\${deletable.map(_.baseOffset).mkString(&quot;,&quot;)}] due to $reason&quot;)</span></span>
<span class="line"><span>      deleteSegments(deletable)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>该方法只有两个步骤：</p><ol><li>使用传入的函数计算哪些日志段对象能够被删除；</li><li>调用deleteSegments方法删除这些日志段。</li></ol><p>接下来是deletableSegments方法，我用注释的方式来解释下主体代码含义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def deletableSegments(predicate: (LogSegment, Option[LogSegment]) =&amp;gt; Boolean): Iterable[LogSegment] = {</span></span>
<span class="line"><span>    if (segments.isEmpty) { // 如果当前压根就没有任何日志段对象，直接返回</span></span>
<span class="line"><span>      Seq.empty</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      val deletable = ArrayBuffer.empty[LogSegment]</span></span>
<span class="line"><span>	  var segmentEntry = segments.firstEntry</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	  // 从具有最小起始位移值的日志段对象开始遍历，直到满足以下条件之一便停止遍历：</span></span>
<span class="line"><span>	  // 1. 测定条件函数predicate = false</span></span>
<span class="line"><span>	  // 2. 扫描到包含Log对象高水位值所在的日志段对象</span></span>
<span class="line"><span>	  // 3. 最新的日志段对象不包含任何消息</span></span>
<span class="line"><span>	  // 最新日志段对象是segments中Key值最大对应的那个日志段，也就是我们常说的Active Segment。完全为空的Active Segment如果被允许删除，后面还要重建它，故代码这里不允许删除大小为空的Active Segment。</span></span>
<span class="line"><span>	  // 在遍历过程中，同时不满足以上3个条件的所有日志段都是可以被删除的！</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      while (segmentEntry != null) {</span></span>
<span class="line"><span>        val segment = segmentEntry.getValue</span></span>
<span class="line"><span>        val nextSegmentEntry = segments.higherEntry(segmentEntry.getKey)</span></span>
<span class="line"><span>        val (nextSegment, upperBoundOffset, isLastSegmentAndEmpty) =</span></span>
<span class="line"><span>          if (nextSegmentEntry != null)</span></span>
<span class="line"><span>            (nextSegmentEntry.getValue, nextSegmentEntry.getValue.baseOffset, false)</span></span>
<span class="line"><span>          else</span></span>
<span class="line"><span>            (null, logEndOffset, segment.size == 0)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (highWatermark &amp;gt;= upperBoundOffset &amp;&amp; predicate(segment, Option(nextSegment)) &amp;&amp; !isLastSegmentAndEmpty) {</span></span>
<span class="line"><span>          deletable += segment</span></span>
<span class="line"><span>          segmentEntry = nextSegmentEntry</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          segmentEntry = null</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      deletable</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>最后是deleteSegments方法，这个方法执行真正的日志段删除操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def deleteSegments(deletable: Iterable[LogSegment]): Int = {</span></span>
<span class="line"><span>    maybeHandleIOException(s&quot;Error while deleting segments for $topicPartition in dir \${dir.getParent}&quot;) {</span></span>
<span class="line"><span>      val numToDelete = deletable.size</span></span>
<span class="line"><span>      if (numToDelete &amp;gt; 0) {</span></span>
<span class="line"><span>        // 不允许删除所有日志段对象。如果一定要做，先创建出一个新的来，然后再把前面N个删掉</span></span>
<span class="line"><span>        if (segments.size == numToDelete)</span></span>
<span class="line"><span>          roll()</span></span>
<span class="line"><span>        lock synchronized {</span></span>
<span class="line"><span>          checkIfMemoryMappedBufferClosed() // 确保Log对象没有被关闭</span></span>
<span class="line"><span>          // 删除给定的日志段对象以及底层的物理文件</span></span>
<span class="line"><span>          removeAndDeleteSegments(deletable, asyncDelete = true)</span></span>
<span class="line"><span>          // 尝试更新日志的Log Start Offset值</span></span>
<span class="line"><span>          maybeIncrementLogStartOffset(</span></span>
<span class="line"><span> segments.firstEntry.getValue.baseOffset)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      numToDelete</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这里我稍微解释一下，为什么要在删除日志段对象之后，尝试更新Log Start Offset值。Log Start Offset值是整个Log对象对外可见消息的最小位移值。如果我们删除了日志段对象，很有可能对外可见消息的范围发生了变化，自然要看一下是否需要更新Log Start Offset值。这就是deleteSegments方法最后要更新Log Start Offset值的原因。</p><p><strong>3.修改</strong></p><p>说完了日志段删除，接下来我们来看如何修改日志段对象。</p><p>其实，源码里面不涉及修改日志段对象，所谓的修改或更新也就是替换而已，用新的日志段对象替换老的日志段对象。举个简单的例子。segments.put(1L, newSegment)语句在没有Key=1时是添加日志段，否则就是替换已有日志段。</p><p><strong>4.查询</strong></p><p>最后再说下查询日志段对象。源码中需要查询日志段对象的地方太多了，但主要都是利用了ConcurrentSkipListMap的现成方法。</p><ul><li>segments.firstEntry：获取第一个日志段对象；</li><li>segments.lastEntry：获取最后一个日志段对象，即Active Segment；</li><li>segments.higherEntry：获取第一个起始位移值≥给定Key值的日志段对象；</li><li>segments.floorEntry：获取最后一个起始位移值≤给定Key值的日志段对象。</li></ul><h2 id="关键位移值管理" tabindex="-1">关键位移值管理 <a class="header-anchor" href="#关键位移值管理" aria-label="Permalink to &quot;关键位移值管理&quot;">​</a></h2><p>Log对象维护了一些关键位移值数据，比如Log Start Offset、LEO等。其实，高水位值也算是关键位移值，只不过它太重要了，所以，我单独把它拎出来作为独立的一部分来讲了。</p><p>还记得我上节课给你说的那张标识LEO和Log Start Offset的图吗？我再来借助这张图说明一下这些关键位移值的区别：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/388672f6dab8571f272ed47c9679c2b4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/388672f6dab8571f272ed47c9679c2b4.jpg" alt=""></a></p><p>请注意这张图中位移值15的虚线方框。这揭示了一个重要的事实： <strong>Log对象中的LEO永远指向下一条待插入消息</strong> <strong>，</strong> <strong>也就是说，LEO值上面是没有消息的！</strong> 源码中定义LEO的语句很简单：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;volatile private var nextOffsetMetadata: LogOffsetMetadata = _</span></span></code></pre></div><p>这里的nextOffsetMetadata就是我们所说的LEO，它也是LogOffsetMetadata类型的对象。Log对象初始化的时候，源码会加载所有日志段对象，并由此计算出当前Log的下一条消息位移值。之后，Log对象将此位移值赋值给LEO，代码片段如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>locally {</span></span>
<span class="line"><span>  val startMs = time.milliseconds</span></span>
<span class="line"><span>  // 创建日志路径，保存Log对象磁盘文件</span></span>
<span class="line"><span>  Files.createDirectories(dir.toPath)</span></span>
<span class="line"><span>  // 初始化Leader Epoch缓存</span></span>
<span class="line"><span>  initializeLeaderEpochCache()</span></span>
<span class="line"><span>  // 加载所有日志段对象，并返回该Log对象下一条消息的位移值</span></span>
<span class="line"><span>  val nextOffset = loadSegments()</span></span>
<span class="line"><span>  // 初始化LEO元数据对象，LEO值为上一步获取的位移值，起始位移值是Active Segment的起始位移值，日志段大小是Active Segment的大小</span></span>
<span class="line"><span>  nextOffsetMetadata = LogOffsetMetadata(nextOffset, activeSegment.baseOffset, activeSegment.size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 更新Leader Epoch缓存，去除LEO值之上的所有无效缓存项</span></span>
<span class="line"><span>  leaderEpochCache.foreach(</span></span>
<span class="line"><span>    _.truncateFromEnd(nextOffsetMetadata.messageOffset))</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，代码中单独定义了更新LEO的updateLogEndOffset方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def updateLogEndOffset(offset: Long): Unit = {</span></span>
<span class="line"><span>  nextOffsetMetadata = LogOffsetMetadata(offset, activeSegment.baseOffset, activeSegment.size)</span></span>
<span class="line"><span>  if (highWatermark &amp;gt;= offset) {</span></span>
<span class="line"><span>    updateHighWatermarkMetadata(nextOffsetMetadata)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (this.recoveryPoint &amp;gt; offset) {</span></span>
<span class="line"><span>    this.recoveryPoint = offset</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据上面的源码，你应该能看到，更新过程很简单，我就不再展开说了。不过，你需要注意的是，如果在更新过程中发现新LEO值小于高水位值，那么Kafka还要更新高水位值，因为对于同一个Log对象而言，高水位值是不能越过LEO值的。这一点你一定要切记再切记！</p><p>讲到这儿，我就要提问了，Log对象什么时候需要更新LEO呢？</p><p>实际上，LEO对象被更新的时机有4个。</p><ol><li><strong>Log对象初始化时</strong>：当Log对象初始化时，我们必须要创建一个LEO对象，并对其进行初始化。</li><li><strong>写入新消息时</strong>：这个最容易理解。以上面的图为例，当不断向Log对象插入新消息时，LEO值就像一个指针一样，需要不停地向右移动，也就是不断地增加。</li><li><strong>Log对象发生日志切分（Log Roll）时</strong>：日志切分是啥呢？其实就是创建一个全新的日志段对象，并且关闭当前写入的日志段对象。这通常发生在当前日志段对象已满的时候。一旦发生日志切分，说明Log对象切换了Active Segment，那么，LEO中的起始位移值和段大小数据都要被更新，因此，在进行这一步操作时，我们必须要更新LEO对象。</li><li><strong>日志截断（Log Truncation）时</strong>：这个也是显而易见的。日志中的部分消息被删除了，自然可能导致LEO值发生变化，从而要更新LEO对象。</li></ol><p>你可以在代码中查看一下updateLogEndOffset方法的调用时机，验证下是不是和我所说的一致。这里我也想给你一个小小的提示： <strong>阅读源码的时候，最好加入一些思考，而不是简单地全盘接受源码的内容，也许你会有不一样的收获</strong>。</p><p>说完了LEO，我再跟你说说Log Start Offset。其实，就操作的流程和原理而言，源码管理Log Start Offset的方式要比LEO简单，因为Log Start Offset不是一个对象，它就是一个长整型的值而已。代码定义了专门的updateLogStartOffset方法来更新它。该方法很简单，我就不详细说了，你可以自己去学习下它的实现。</p><p>现在，我们再来思考一下，Kafka什么时候需要更新Log Start Offset呢？我们一一来看下。</p><ol><li><strong>Log对象初始化时</strong>：和LEO类似，Log对象初始化时要给Log Start Offset赋值，一般是将第一个日志段的起始位移值赋值给它。</li><li><strong>日志截断时</strong>：同理，一旦日志中的部分消息被删除，可能会导致Log Start Offset发生变化，因此有必要更新该值。</li><li><strong>Follower副本同步时</strong>：一旦Leader副本的Log对象的Log Start Offset值发生变化。为了维持和Leader副本的一致性，Follower副本也需要尝试去更新该值。</li><li><strong>删除日志段时</strong>：这个和日志截断是类似的。凡是涉及消息删除的操作都有可能导致Log Start Offset值的变化。</li><li><strong>删除消息时</strong>：严格来说，这个更新时机有点本末倒置了。在Kafka中，删除消息就是通过抬高Log Start Offset值来实现的，因此，删除消息时必须要更新该值。</li></ol><h2 id="读写操作" tabindex="-1">读写操作 <a class="header-anchor" href="#读写操作" aria-label="Permalink to &quot;读写操作&quot;">​</a></h2><p>最后，我重点说说针对Log对象的读写操作。</p><p><strong>1.写操作</strong></p><p>在Log中，涉及写操作的方法有3个：appendAsLeader、appendAsFollower和append。它们的调用关系如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/efd914ef24911704fa5d23d38447a024.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/efd914ef24911704fa5d23d38447a024.jpg" alt=""></a></p><p>appendAsLeader是用于写Leader副本的，appendAsFollower是用于Follower副本同步的。它们的底层都调用了append方法。</p><p>我们重点学习下append方法。下图是append方法的执行流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/e4b47776198b7def72332f93930f65f1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/e4b47776198b7def72332f93930f65f1.jpg" alt=""></a></p><p>看到这张图，你可能会感叹：“天呐，执行步骤居然有12步？这么多！”别急，现在我用代码注释的方式给你分别解释下每步的实现原理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def append(records: MemoryRecords,</span></span>
<span class="line"><span>                     origin: AppendOrigin,</span></span>
<span class="line"><span>                     interBrokerProtocolVersion: ApiVersion,</span></span>
<span class="line"><span>                     assignOffsets: Boolean,</span></span>
<span class="line"><span>                     leaderEpoch: Int): LogAppendInfo = {</span></span>
<span class="line"><span>	maybeHandleIOException(s&quot;Error while appending records to $topicPartition in dir \${dir.getParent}&quot;) {</span></span>
<span class="line"><span>	  // 第1步：分析和验证待写入消息集合，并返回校验结果</span></span>
<span class="line"><span>      val appendInfo = analyzeAndValidateRecords(records, origin)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 如果压根就不需要写入任何消息，直接返回即可</span></span>
<span class="line"><span>      if (appendInfo.shallowCount == 0)</span></span>
<span class="line"><span>        return appendInfo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 第2步：消息格式规整，即删除无效格式消息或无效字节</span></span>
<span class="line"><span>      var validRecords = trimInvalidBytes(records, appendInfo)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      lock synchronized {</span></span>
<span class="line"><span>        checkIfMemoryMappedBufferClosed() // 确保Log对象未关闭</span></span>
<span class="line"><span>        if (assignOffsets) { // 需要分配位移</span></span>
<span class="line"><span>          // 第3步：使用当前LEO值作为待写入消息集合中第一条消息的位移值</span></span>
<span class="line"><span>          val offset = new LongRef(nextOffsetMetadata.messageOffset)</span></span>
<span class="line"><span>          appendInfo.firstOffset = Some(offset.value)</span></span>
<span class="line"><span>          val now = time.milliseconds</span></span>
<span class="line"><span>          val validateAndOffsetAssignResult = try {</span></span>
<span class="line"><span>            LogValidator.validateMessagesAndAssignOffsets(validRecords,</span></span>
<span class="line"><span>              topicPartition,</span></span>
<span class="line"><span>              offset,</span></span>
<span class="line"><span>              time,</span></span>
<span class="line"><span>              now,</span></span>
<span class="line"><span>              appendInfo.sourceCodec,</span></span>
<span class="line"><span>              appendInfo.targetCodec,</span></span>
<span class="line"><span>              config.compact,</span></span>
<span class="line"><span>              config.messageFormatVersion.recordVersion.value,</span></span>
<span class="line"><span>              config.messageTimestampType,</span></span>
<span class="line"><span>              config.messageTimestampDifferenceMaxMs,</span></span>
<span class="line"><span>              leaderEpoch,</span></span>
<span class="line"><span>              origin,</span></span>
<span class="line"><span>              interBrokerProtocolVersion,</span></span>
<span class="line"><span>              brokerTopicStats)</span></span>
<span class="line"><span>          } catch {</span></span>
<span class="line"><span>            case e: IOException =&amp;gt;</span></span>
<span class="line"><span>              throw new KafkaException(s&quot;Error validating messages while appending to log $name&quot;, e)</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          // 更新校验结果对象类LogAppendInfo</span></span>
<span class="line"><span>          validRecords = validateAndOffsetAssignResult.validatedRecords</span></span>
<span class="line"><span>          appendInfo.maxTimestamp = validateAndOffsetAssignResult.maxTimestamp</span></span>
<span class="line"><span>          appendInfo.offsetOfMaxTimestamp = validateAndOffsetAssignResult.shallowOffsetOfMaxTimestamp</span></span>
<span class="line"><span>          appendInfo.lastOffset = offset.value - 1</span></span>
<span class="line"><span>          appendInfo.recordConversionStats = validateAndOffsetAssignResult.recordConversionStats</span></span>
<span class="line"><span>          if (config.messageTimestampType == TimestampType.LOG_APPEND_TIME)</span></span>
<span class="line"><span>            appendInfo.logAppendTime = now</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          // 第4步：验证消息，确保消息大小不超限</span></span>
<span class="line"><span>          if (validateAndOffsetAssignResult.messageSizeMaybeChanged) {</span></span>
<span class="line"><span>            for (batch &amp;lt;- validRecords.batches.asScala) {</span></span>
<span class="line"><span>              if (batch.sizeInBytes &amp;gt; config.maxMessageSize) {</span></span>
<span class="line"><span>                // we record the original message set size instead of the trimmed size</span></span>
<span class="line"><span>                // to be consistent with pre-compression bytesRejectedRate recording</span></span>
<span class="line"><span>                brokerTopicStats.topicStats(topicPartition.topic).bytesRejectedRate.mark(records.sizeInBytes)</span></span>
<span class="line"><span>                brokerTopicStats.allTopicsStats.bytesRejectedRate.mark(records.sizeInBytes)</span></span>
<span class="line"><span>                throw new RecordTooLargeException(s&quot;Message batch size is \${batch.sizeInBytes} bytes in append to&quot; +</span></span>
<span class="line"><span>                  s&quot;partition $topicPartition which exceeds the maximum configured size of \${config.maxMessageSize}.&quot;)</span></span>
<span class="line"><span>              }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        } else {  // 直接使用给定的位移值，无需自己分配位移值</span></span>
<span class="line"><span>          if (!appendInfo.offsetsMonotonic) // 确保消息位移值的单调递增性</span></span>
<span class="line"><span>            throw new OffsetsOutOfOrderException(s&quot;Out of order offsets found in append to $topicPartition: &quot; +</span></span>
<span class="line"><span>                                                 records.records.asScala.map(_.offset))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          if (appendInfo.firstOrLastOffsetOfFirstBatch &amp;lt; nextOffsetMetadata.messageOffset) {</span></span>
<span class="line"><span>            val firstOffset = appendInfo.firstOffset match {</span></span>
<span class="line"><span>              case Some(offset) =&amp;gt; offset</span></span>
<span class="line"><span>              case None =&amp;gt; records.batches.asScala.head.baseOffset()</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            val firstOrLast = if (appendInfo.firstOffset.isDefined) &quot;First offset&quot; else &quot;Last offset of the first batch&quot;</span></span>
<span class="line"><span>            throw new UnexpectedAppendOffsetException(</span></span>
<span class="line"><span>              s&quot;Unexpected offset in append to $topicPartition. $firstOrLast &quot; +</span></span>
<span class="line"><span>              s&quot;\${appendInfo.firstOrLastOffsetOfFirstBatch} is less than the next offset \${nextOffsetMetadata.messageOffset}. &quot; +</span></span>
<span class="line"><span>              s&quot;First 10 offsets in append: \${records.records.asScala.take(10).map(_.offset)}, last offset in&quot; +</span></span>
<span class="line"><span>              s&quot; append: \${appendInfo.lastOffset}. Log start offset = $logStartOffset&quot;,</span></span>
<span class="line"><span>              firstOffset, appendInfo.lastOffset)</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第5步：更新Leader Epoch缓存</span></span>
<span class="line"><span>        validRecords.batches.asScala.foreach { batch =&amp;gt;</span></span>
<span class="line"><span>          if (batch.magic &amp;gt;= RecordBatch.MAGIC_VALUE_V2) {</span></span>
<span class="line"><span>            maybeAssignEpochStartOffset(batch.partitionLeaderEpoch, batch.baseOffset)</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            leaderEpochCache.filter(_.nonEmpty).foreach { cache =&amp;gt;</span></span>
<span class="line"><span>              warn(s&quot;Clearing leader epoch cache after unexpected append with message format v\${batch.magic}&quot;)</span></span>
<span class="line"><span>              cache.clearAndFlush()</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第6步：确保消息大小不超限</span></span>
<span class="line"><span>        if (validRecords.sizeInBytes &amp;gt; config.segmentSize) {</span></span>
<span class="line"><span>          throw new RecordBatchTooLargeException(s&quot;Message batch size is \${validRecords.sizeInBytes} bytes in append &quot; +</span></span>
<span class="line"><span>            s&quot;to partition $topicPartition, which exceeds the maximum configured segment size of \${config.segmentSize}.&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第7步：执行日志切分。当前日志段剩余容量可能无法容纳新消息集合，因此有必要创建一个新的日志段来保存待写入的所有消息</span></span>
<span class="line"><span>        val segment = maybeRoll(validRecords.sizeInBytes, appendInfo)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        val logOffsetMetadata = LogOffsetMetadata(</span></span>
<span class="line"><span>          messageOffset = appendInfo.firstOrLastOffsetOfFirstBatch,</span></span>
<span class="line"><span>          segmentBaseOffset = segment.baseOffset,</span></span>
<span class="line"><span>          relativePositionInSegment = segment.size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第8步：验证事务状态</span></span>
<span class="line"><span>        val (updatedProducers, completedTxns, maybeDuplicate) = analyzeAndValidateProducerState(</span></span>
<span class="line"><span>          logOffsetMetadata, validRecords, origin)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        maybeDuplicate.foreach { duplicate =&amp;gt;</span></span>
<span class="line"><span>          appendInfo.firstOffset = Some(duplicate.firstOffset)</span></span>
<span class="line"><span>          appendInfo.lastOffset = duplicate.lastOffset</span></span>
<span class="line"><span>          appendInfo.logAppendTime = duplicate.timestamp</span></span>
<span class="line"><span>          appendInfo.logStartOffset = logStartOffset</span></span>
<span class="line"><span>          return appendInfo</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第9步：执行真正的消息写入操作，主要调用日志段对象的append方法实现</span></span>
<span class="line"><span>        segment.append(largestOffset = appendInfo.lastOffset,</span></span>
<span class="line"><span>          largestTimestamp = appendInfo.maxTimestamp,</span></span>
<span class="line"><span>          shallowOffsetOfMaxTimestamp = appendInfo.offsetOfMaxTimestamp,</span></span>
<span class="line"><span>          records = validRecords)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第10步：更新LEO对象，其中，LEO值是消息集合中最后一条消息位移值+1</span></span>
<span class="line"><span>       // 前面说过，LEO值永远指向下一条不存在的消息</span></span>
<span class="line"><span>        updateLogEndOffset(appendInfo.lastOffset + 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第11步：更新事务状态</span></span>
<span class="line"><span>        for (producerAppendInfo &amp;lt;- updatedProducers.values) {</span></span>
<span class="line"><span>          producerStateManager.update(producerAppendInfo)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (completedTxn &amp;lt;- completedTxns) {</span></span>
<span class="line"><span>          val lastStableOffset = producerStateManager.lastStableOffset(completedTxn)</span></span>
<span class="line"><span>          segment.updateTxnIndex(completedTxn, lastStableOffset)</span></span>
<span class="line"><span>          producerStateManager.completeTxn(completedTxn)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        producerStateManager.updateMapEndOffset(appendInfo.lastOffset + 1)</span></span>
<span class="line"><span>       maybeIncrementFirstUnstableOffset()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        trace(s&quot;Appended message set with last offset: \${appendInfo.lastOffset}, &quot; +</span></span>
<span class="line"><span>          s&quot;first offset: \${appendInfo.firstOffset}, &quot; +</span></span>
<span class="line"><span>          s&quot;next offset: \${nextOffsetMetadata.messageOffset}, &quot; +</span></span>
<span class="line"><span>          s&quot;and messages: $validRecords&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 是否需要手动落盘。一般情况下我们不需要设置Broker端参数log.flush.interval.messages</span></span>
<span class="line"><span>       // 落盘操作交由操作系统来完成。但某些情况下，可以设置该参数来确保高可靠性</span></span>
<span class="line"><span>        if (unflushedMessages &amp;gt;= config.flushInterval)</span></span>
<span class="line"><span>          flush()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 第12步：返回写入结果</span></span>
<span class="line"><span>        appendInfo</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这些步骤里有没有需要你格外注意的呢？我希望你重点关注下第1步，即Kafka如何校验消息，重点是看 <strong>针对不同的消息格式版本，Kafka是如何做校验的</strong>。</p><p>说起消息校验，你还记得上一讲我们提到的LogAppendInfo类吗？它就是一个普通的POJO类，里面几乎保存了待写入消息集合的所有信息。我们来详细了解一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class LogAppendInfo(var firstOffset: Option[Long],</span></span>
<span class="line"><span>                         var lastOffset: Long, // 消息集合最后一条消息的位移值</span></span>
<span class="line"><span>                         var maxTimestamp: Long, // 消息集合最大消息时间戳</span></span>
<span class="line"><span>                         var offsetOfMaxTimestamp: Long, // 消息集合最大消息时间戳所属消息的位移值</span></span>
<span class="line"><span>                         var logAppendTime: Long, // 写入消息时间戳</span></span>
<span class="line"><span>                         var logStartOffset: Long, // 消息集合首条消息的位移值</span></span>
<span class="line"><span>                         // 消息转换统计类，里面记录了执行了格式转换的消息数等数据</span></span>
<span class="line"><span>    var recordConversionStats: RecordConversionStats,</span></span>
<span class="line"><span>                         sourceCodec: CompressionCodec, // 消息集合中消息使用的压缩器（Compressor）类型，比如是Snappy还是LZ4</span></span>
<span class="line"><span>                         targetCodec: CompressionCodec, // 写入消息时需要使用的压缩器类型</span></span>
<span class="line"><span>                         shallowCount: Int, // 消息批次数，每个消息批次下可能包含多条消息</span></span>
<span class="line"><span>                         validBytes: Int, // 写入消息总字节数</span></span>
<span class="line"><span>                         offsetsMonotonic: Boolean, // 消息位移值是否是顺序增加的</span></span>
<span class="line"><span>                         lastOffsetOfFirstBatch: Long, // 首个消息批次中最后一条消息的位移</span></span>
<span class="line"><span>                         recordErrors: Seq[RecordError] = List(), // 写入消息时出现的异常列表</span></span>
<span class="line"><span>                         errorMessage: String = null) {  // 错误码</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>大部分字段的含义很明确，这里我稍微提一下 <strong>lastOffset</strong> 和 <strong>lastOffsetOfFirstBatch</strong>。</p><p>Kafka消息格式经历了两次大的变迁，目前是0.11.0.0版本引入的Version 2消息格式。我们没有必要详细了解这些格式的变迁，你只需要知道，在0.11.0.0版本之后， <strong>lastOffset和lastOffsetOfFirstBatch都是指向消息集合的最后一条消息即可</strong>。它们的区别主要体现在0.11.0.0之前的版本。</p><p>append方法调用analyzeAndValidateRecords方法对消息集合进行校验，并生成对应的LogAppendInfo对象，其流程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def analyzeAndValidateRecords(records: MemoryRecords, origin: AppendOrigin): LogAppendInfo = {</span></span>
<span class="line"><span>    var shallowMessageCount = 0</span></span>
<span class="line"><span>    var validBytesCount = 0</span></span>
<span class="line"><span>    var firstOffset: Option[Long] = None</span></span>
<span class="line"><span>    var lastOffset = -1L</span></span>
<span class="line"><span>    var sourceCodec: CompressionCodec = NoCompressionCodec</span></span>
<span class="line"><span>    var monotonic = true</span></span>
<span class="line"><span>    var maxTimestamp = RecordBatch.NO_TIMESTAMP</span></span>
<span class="line"><span>    var offsetOfMaxTimestamp = -1L</span></span>
<span class="line"><span>    var readFirstMessage = false</span></span>
<span class="line"><span>    var lastOffsetOfFirstBatch = -1L</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (batch &amp;lt;- records.batches.asScala) {</span></span>
<span class="line"><span>      // 消息格式Version 2的消息批次，起始位移值必须从0开始</span></span>
<span class="line"><span>      if (batch.magic &amp;gt;= RecordBatch.MAGIC_VALUE_V2 &amp;&amp; origin == AppendOrigin.Client &amp;&amp; batch.baseOffset != 0)</span></span>
<span class="line"><span>        throw new InvalidRecordException(s&quot;The baseOffset of the record batch in the append to $topicPartition should &quot; +</span></span>
<span class="line"><span>          s&quot;be 0, but it is \${batch.baseOffset}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (!readFirstMessage) {</span></span>
<span class="line"><span>        if (batch.magic &amp;gt;= RecordBatch.MAGIC_VALUE_V2)</span></span>
<span class="line"><span>          firstOffset = Some(batch.baseOffset)  // 更新firstOffset字段</span></span>
<span class="line"><span>        lastOffsetOfFirstBatch = batch.lastOffset // 更新lastOffsetOfFirstBatch字段</span></span>
<span class="line"><span>        readFirstMessage = true</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 一旦出现当前lastOffset不小于下一个batch的lastOffset，说明上一个batch中有消息的位移值大于后面batch的消息</span></span>
<span class="line"><span>      // 这违反了位移值单调递增性</span></span>
<span class="line"><span>      if (lastOffset &amp;gt;= batch.lastOffset)</span></span>
<span class="line"><span>        monotonic = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 使用当前batch最后一条消息的位移值去更新lastOffset</span></span>
<span class="line"><span>      lastOffset = batch.lastOffset</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 检查消息批次总字节数大小是否超限，即是否大于Broker端参数max.message.bytes值</span></span>
<span class="line"><span>      val batchSize = batch.sizeInBytes</span></span>
<span class="line"><span>      if (batchSize &amp;gt; config.maxMessageSize) {</span></span>
<span class="line"><span>        brokerTopicStats.topicStats(topicPartition.topic).bytesRejectedRate.mark(records.sizeInBytes)</span></span>
<span class="line"><span>        brokerTopicStats.allTopicsStats.bytesRejectedRate.mark(records.sizeInBytes)</span></span>
<span class="line"><span>        throw new RecordTooLargeException(s&quot;The record batch size in the append to $topicPartition is $batchSize bytes &quot; +</span></span>
<span class="line"><span>          s&quot;which exceeds the maximum configured value of \${config.maxMessageSize}.&quot;)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 执行消息批次校验，包括格式是否正确以及CRC校验</span></span>
<span class="line"><span>      if (!batch.isValid) {</span></span>
<span class="line"><span>        brokerTopicStats.allTopicsStats.invalidMessageCrcRecordsPerSec.mark()</span></span>
<span class="line"><span>        throw new CorruptRecordException(s&quot;Record is corrupt (stored crc = \${batch.checksum()}) in topic partition $topicPartition.&quot;)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 更新maxTimestamp字段和offsetOfMaxTimestamp</span></span>
<span class="line"><span>      if (batch.maxTimestamp &amp;gt; maxTimestamp) {</span></span>
<span class="line"><span>        maxTimestamp = batch.maxTimestamp</span></span>
<span class="line"><span>        offsetOfMaxTimestamp = lastOffset</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 累加消息批次计数器以及有效字节数，更新shallowMessageCount字段</span></span>
<span class="line"><span>      shallowMessageCount += 1</span></span>
<span class="line"><span>      validBytesCount += batchSize</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 从消息批次中获取压缩器类型</span></span>
<span class="line"><span>      val messageCodec = CompressionCodec.getCompressionCodec(batch.compressionType.id)</span></span>
<span class="line"><span>      if (messageCodec != NoCompressionCodec)</span></span>
<span class="line"><span>        sourceCodec = messageCodec</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取Broker端设置的压缩器类型，即Broker端参数compression.type值。</span></span>
<span class="line"><span>    // 该参数默认值是producer，表示sourceCodec用的什么压缩器，targetCodec就用什么</span></span>
<span class="line"><span>    val targetCodec = BrokerCompressionCodec.getTargetCompressionCodec(config.compressionType, sourceCodec)</span></span>
<span class="line"><span>    // 最后生成LogAppendInfo对象并返回</span></span>
<span class="line"><span>    LogAppendInfo(firstOffset, lastOffset, maxTimestamp, offsetOfMaxTimestamp, RecordBatch.NO_TIMESTAMP, logStartOffset,</span></span>
<span class="line"><span>      RecordConversionStats.EMPTY, sourceCodec, targetCodec, shallowMessageCount, validBytesCount, monotonic, lastOffsetOfFirstBatch)</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p><strong>2.读取操作</strong></p><p>说完了append方法，下面我们聊聊read方法。</p><p>read方法的流程相对要简单一些，首先来看它的方法签名：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def read(startOffset: Long,</span></span>
<span class="line"><span>           maxLength: Int,</span></span>
<span class="line"><span>           isolation: FetchIsolation,</span></span>
<span class="line"><span>           minOneMessage: Boolean): FetchDataInfo = {</span></span>
<span class="line"><span>           ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它接收4个参数，含义如下：</p><ul><li>startOffset，即从Log对象的哪个位移值开始读消息。</li><li>maxLength，即最多能读取多少字节。</li><li>isolation，设置读取隔离级别，主要控制能够读取的最大位移值，多用于Kafka事务。</li><li>minOneMessage，即是否允许至少读一条消息。设想如果消息很大，超过了maxLength，正常情况下read方法永远不会返回任何消息。但如果设置了该参数为true，read方法就保证至少能够返回一条消息。</li></ul><p>read方法的返回值是FetchDataInfo类，也是一个POJO类，里面最重要的数据就是读取的消息集合，其他数据还包括位移等元数据信息。</p><p>下面我们来看下read方法的流程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def read(startOffset: Long,</span></span>
<span class="line"><span>           maxLength: Int,</span></span>
<span class="line"><span>           isolation: FetchIsolation,</span></span>
<span class="line"><span>           minOneMessage: Boolean): FetchDataInfo = {</span></span>
<span class="line"><span>    maybeHandleIOException(s&quot;Exception while reading from $topicPartition in dir \${dir.getParent}&quot;) {</span></span>
<span class="line"><span>      trace(s&quot;Reading $maxLength bytes from offset $startOffset of length $size bytes&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      val includeAbortedTxns = isolation == FetchTxnCommitted</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 读取消息时没有使用Monitor锁同步机制，因此这里取巧了，用本地变量的方式把LEO对象保存起来，避免争用（race condition）</span></span>
<span class="line"><span>      val endOffsetMetadata = nextOffsetMetadata</span></span>
<span class="line"><span>      val endOffset = nextOffsetMetadata.messageOffset</span></span>
<span class="line"><span>      if (startOffset == endOffset) // 如果从LEO处开始读取，那么自然不会返回任何数据，直接返回空消息集合即可</span></span>
<span class="line"><span>        return emptyFetchDataInfo(endOffsetMetadata, includeAbortedTxns)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 找到startOffset值所在的日志段对象。注意要使用floorEntry方法</span></span>
<span class="line"><span>      var segmentEntry = segments.floorEntry(startOffset)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // return error on attempt to read beyond the log end offset or read below log start offset</span></span>
<span class="line"><span>      // 满足以下条件之一将被视为消息越界，即你要读取的消息不在该Log对象中：</span></span>
<span class="line"><span>      // 1. 要读取的消息位移超过了LEO值</span></span>
<span class="line"><span>      // 2. 没找到对应的日志段对象</span></span>
<span class="line"><span>      // 3. 要读取的消息在Log Start Offset之下，同样是对外不可见的消息</span></span>
<span class="line"><span>      if (startOffset &amp;gt; endOffset || segmentEntry == null || startOffset &amp;lt; logStartOffset)</span></span>
<span class="line"><span>        throw new OffsetOutOfRangeException(s&quot;Received request for offset $startOffset for partition $topicPartition, &quot; +</span></span>
<span class="line"><span>          s&quot;but we only have log segments in the range $logStartOffset to $endOffset.&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 查看一下读取隔离级别设置。</span></span>
<span class="line"><span>      // 普通消费者能够看到[Log Start Offset, 高水位值)之间的消息</span></span>
<span class="line"><span>      // 事务型消费者只能看到[Log Start Offset, Log Stable Offset]之间的消息。Log Stable Offset(LSO)是比LEO值小的位移值，为Kafka事务使用</span></span>
<span class="line"><span>      // Follower副本消费者能够看到[Log Start Offset，LEO)之间的消息</span></span>
<span class="line"><span>      val maxOffsetMetadata = isolation match {</span></span>
<span class="line"><span>        case FetchLogEnd =&amp;gt; nextOffsetMetadata</span></span>
<span class="line"><span>        case FetchHighWatermark =&amp;gt; fetchHighWatermarkMetadata</span></span>
<span class="line"><span>        case FetchTxnCommitted =&amp;gt; fetchLastStableOffsetMetadata</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 如果要读取的起始位置超过了能读取的最大位置，返回空的消息集合，因为没法读取任何消息</span></span>
<span class="line"><span>      if (startOffset &amp;gt; maxOffsetMetadata.messageOffset) {</span></span>
<span class="line"><span>        val startOffsetMetadata = convertToOffsetMetadataOrThrow(startOffset)</span></span>
<span class="line"><span>        return emptyFetchDataInfo(startOffsetMetadata, includeAbortedTxns)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 开始遍历日志段对象，直到读出东西来或者读到日志末尾</span></span>
<span class="line"><span>      while (segmentEntry != null) {</span></span>
<span class="line"><span>        val segment = segmentEntry.getValue</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        val maxPosition = {</span></span>
<span class="line"><span>          if (maxOffsetMetadata.segmentBaseOffset == segment.baseOffset) {</span></span>
<span class="line"><span>            maxOffsetMetadata.relativePositionInSegment</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            segment.size</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 调用日志段对象的read方法执行真正的读取消息操作</span></span>
<span class="line"><span>        val fetchInfo = segment.read(startOffset, maxLength, maxPosition, minOneMessage)</span></span>
<span class="line"><span>        if (fetchInfo == null) { // 如果没有返回任何消息，去下一个日志段对象试试</span></span>
<span class="line"><span>          segmentEntry = segments.higherEntry(segmentEntry.getKey)</span></span>
<span class="line"><span>        } else { // 否则返回</span></span>
<span class="line"><span>          return if (includeAbortedTxns)</span></span>
<span class="line"><span>            addAbortedTransactions(startOffset, segmentEntry, fetchInfo)</span></span>
<span class="line"><span>          else</span></span>
<span class="line"><span>            fetchInfo</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 已经读到日志末尾还是没有数据返回，只能返回空消息集合</span></span>
<span class="line"><span>      FetchDataInfo(nextOffsetMetadata, MemoryRecords.EMPTY)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我重点讲解了Kafka的Log对象以及常见的操作。我们复习一下。</p><ol><li><strong>高水位管理</strong>：Log对象定义了高水位对象以及管理它的各种操作，主要包括更新和读取。</li><li><strong>日志段管理</strong>：作为日志段的容器，Log对象保存了很多日志段对象。你需要重点掌握这些日志段对象被组织在一起的方式以及Kafka Log对象是如何对它们进行管理的。</li><li><strong>关键位移值管理</strong>：主要涉及对Log Start Offset和LEO的管理。这两个位移值是Log对象非常关键的字段。比如，副本管理、状态机管理等高阶功能都要依赖于它们。</li><li><strong>读写操作</strong>：日志读写是实现Kafka消息引擎基本功能的基石。虽然你不需要掌握每行语句的含义，但你至少要明白大体的操作流程。</li></ol><p>讲到这里，Kafka Log部分的源码我就介绍完了。我建议你特别关注下高水位管理和读写操作部分的代码（特别是后者），并且结合我今天讲的内容，重点分析下这两部分的实现原理。最后，我用一张思维导图来帮助你理解和记忆Log源码中的这些常见操作：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/d0cb945d7284f09ab2b6ffa764190399.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/225993/d0cb945d7284f09ab2b6ffa764190399.jpg" alt=""></a></p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>你能为Log对象添加一个方法，统计介于高水位值和LEO值之间的消息总数吗？</p><p>欢迎你在留言区畅所欲言，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,120)])])}const m=a(t,[["render",l]]);export{d as __pageData,m as default};
