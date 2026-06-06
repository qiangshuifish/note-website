import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"02 | 日志（上）：日志究竟是如何加载日志段的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Log源码结构","slug":"log源码结构","link":"#log源码结构","children":[]},{"level":2,"title":"Log Class & Object","slug":"log-class-object","link":"#log-class-object","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/02-日志（上）：日志究竟是如何加载日志段的？.md","filePath":"Kafka核心源码解读/02-日志（上）：日志究竟是如何加载日志段的？.md","lastUpdated":1779815932000}'),l={name:"Kafka核心源码解读/02-日志（上）：日志究竟是如何加载日志段的？.md"};function i(t,s,o,c,r,f){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_02-日志-上-日志究竟是如何加载日志段的" tabindex="-1">02 | 日志（上）：日志究竟是如何加载日志段的？ <a class="header-anchor" href="#_02-日志-上-日志究竟是如何加载日志段的" aria-label="Permalink to &quot;02 | 日志（上）：日志究竟是如何加载日志段的？&quot;">​</a></h1><p>你好，我是胡夕。今天我来讲讲Kafka源码的日志（Log）对象。</p><p>上节课，我们学习了日志段部分的源码，你可以认为， <strong>日志是日志段的容器，里面定义了很多管理日志段的操作</strong>。坦率地说，如果看Kafka源码却不看Log，就跟你买了这门课却不知道作者是谁一样。在我看来，Log对象是Kafka源码（特别是Broker端）最核心的部分，没有之一。</p><p>它到底有多重要呢？我和你分享一个例子，你先感受下。我最近正在修复一个Kafka的Bug（ <a href="https://issues.apache.org/jira/browse/KAFKA-9157" target="_blank" rel="noreferrer">KAFKA-9157</a>）：在某些情况下，Kafka的Compaction操作会产生很多空的日志段文件。如果要避免这些空日志段文件被创建出来，就必须搞懂创建日志段文件的原理，而这些代码恰恰就在Log源码中。</p><p>既然Log源码要管理日志段对象，那么它就必须先把所有日志段对象加载到内存里面。这个过程是怎么实现的呢？今天，我就带你学习下日志加载日志段的过程。</p><p>首先，我们来看下Log对象的源码结构。</p><h2 id="log源码结构" tabindex="-1">Log源码结构 <a class="header-anchor" href="#log源码结构" aria-label="Permalink to &quot;Log源码结构&quot;">​</a></h2><p>Log源码位于Kafka core工程的log源码包下，文件名是Log.scala。总体上，该文件定义了10个类和对象，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/8126a191f63d9abea860d71992b0aece.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/8126a191f63d9abea860d71992b0aece.jpg" alt=""></a></p><p>那么，这10个类和对象都是做什么的呢？我先给你简单介绍一下，你可以对它们有个大致的了解。</p><p>不过，在介绍之前，我先提一句，图中括号里的C表示Class，O表示Object。还记得我在上节课提到过的伴生对象吗？没错，同时定义同名的Class和Object，就属于Scala中的伴生对象用法。</p><p>我们先来看伴生对象，也就是LogAppendInfo、Log和RollParams。</p><p><strong>1.LogAppendInfo</strong></p><ul><li>LogAppendInfo（C）：保存了一组待写入消息的各种元数据信息。比如，这组消息中第一条消息的位移值是多少、最后一条消息的位移值是多少；再比如，这组消息中最大的消息时间戳又是多少。总之，这里面的数据非常丰富（下节课我再具体说说）。</li><li>LogAppendInfo（O）: 可以理解为其对应伴生类的工厂方法类，里面定义了一些工厂方法，用于创建特定的LogAppendInfo实例。</li></ul><p><strong>2.Log</strong></p><ul><li>Log（C）: Log源码中最核心的代码。这里我先卖个关子，一会儿细聊。</li><li>Log（O）：同理，Log伴生类的工厂方法，定义了很多常量以及一些辅助方法。</li></ul><p><strong>3.RollParams</strong></p><ul><li>RollParams（C）：定义用于控制日志段是否切分（Roll）的数据结构。</li><li>RollParams（O）：同理，RollParams伴生类的工厂方法。</li></ul><p>除了这3组伴生对象之外，还有4类源码。</p><ul><li>LogMetricNames：定义了Log对象的监控指标。</li><li>LogOffsetSnapshot：封装分区所有位移元数据的容器类。</li><li>LogReadInfo：封装读取日志返回的数据及其元数据。</li><li>CompletedTxn：记录已完成事务的元数据，主要用于构建事务索引。</li></ul><h2 id="log-class-object" tabindex="-1">Log Class &amp; Object <a class="header-anchor" href="#log-class-object" aria-label="Permalink to &quot;Log Class &amp; Object&quot;">​</a></h2><p>下面，我会按照这些类和对象的重要程度，对它们一一进行拆解。首先，咱们先说说Log类及其伴生对象。</p><p>考虑到伴生对象多用于保存静态变量和静态方法（比如静态工厂方法等），因此我们先看伴生对象（即Log Object）的实现。毕竟，柿子先找软的捏！</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>object Log {</span></span>
<span class="line"><span>  val LogFileSuffix = &quot;.log&quot;</span></span>
<span class="line"><span>  val IndexFileSuffix = &quot;.index&quot;</span></span>
<span class="line"><span>  val TimeIndexFileSuffix = &quot;.timeindex&quot;</span></span>
<span class="line"><span>  val ProducerSnapshotFileSuffix = &quot;.snapshot&quot;</span></span>
<span class="line"><span>  val TxnIndexFileSuffix = &quot;.txnindex&quot;</span></span>
<span class="line"><span>  val DeletedFileSuffix = &quot;.deleted&quot;</span></span>
<span class="line"><span>  val CleanedFileSuffix = &quot;.cleaned&quot;</span></span>
<span class="line"><span>  val SwapFileSuffix = &quot;.swap&quot;</span></span>
<span class="line"><span>  val CleanShutdownFile = &quot;.kafka_cleanshutdown&quot;</span></span>
<span class="line"><span>  val DeleteDirSuffix = &quot;-delete&quot;</span></span>
<span class="line"><span>  val FutureDirSuffix = &quot;-future&quot;</span></span>
<span class="line"><span>……</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这是Log Object定义的所有常量。如果有面试官问你Kafka中定义了多少种文件类型，你可以自豪地把这些说出来。耳熟能详的.log、.index、.timeindex和.txnindex我就不解释了，我们来了解下其他几种文件类型。</p><ul><li>.snapshot是Kafka为幂等型或事务型Producer所做的快照文件。鉴于我们现在还处于阅读源码的初级阶段，事务或幂等部分的源码我就不详细展开讲了。</li><li>.deleted是删除日志段操作创建的文件。目前删除日志段文件是异步操作，Broker端把日志段文件从.log后缀修改为.deleted后缀。如果你看到一大堆.deleted后缀的文件名，别慌，这是Kafka在执行日志段文件删除。</li><li>.cleaned和.swap都是Compaction操作的产物，等我们讲到Cleaner的时候再说。</li><li>-delete则是应用于文件夹的。当你删除一个主题的时候，主题的分区文件夹会被加上这个后缀。</li><li>-future是用于变更主题分区文件夹地址的，属于比较高阶的用法。</li></ul><p>总之，记住这些常量吧。记住它们的主要作用是，以后不要被面试官唬住！开玩笑，其实这些常量最重要的地方就在于，它们能够让你了解Kafka定义的各种文件类型。</p><p>Log Object还定义了超多的工具类方法。由于它们都很简单，这里我只给出一个方法的源码，我们一起读一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def filenamePrefixFromOffset(offset: Long): String = {</span></span>
<span class="line"><span>    val nf = NumberFormat.getInstance()</span></span>
<span class="line"><span>    nf.setMinimumIntegerDigits(20)</span></span>
<span class="line"><span>    nf.setMaximumFractionDigits(0)</span></span>
<span class="line"><span>    nf.setGroupingUsed(false)</span></span>
<span class="line"><span>    nf.format(offset)</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这个方法的作用是 <strong>通过给定的位移值计算出对应的日志段文件名</strong>。Kafka日志文件固定是20位的长度，filenamePrefixFromOffset方法就是用前面补0的方式，把给定位移值扩充成一个固定20位长度的字符串。</p><p>举个例子，我们给定一个位移值是12345，那么Broker端磁盘上对应的日志段文件名就应该是00000000000000012345.log。怎么样，很简单吧？其他的工具类方法也很简单，我就不一一展开说了。</p><p>下面我们来看Log源码部分的重头戏： <strong>Log类</strong>。这是一个2000多行的大类。放眼整个Kafka源码，像Log这么大的类也不多见，足见它的重要程度。我们先来看这个类的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Log(&amp;#64;volatile var dir: File,</span></span>
<span class="line"><span>          &amp;#64;volatile var config: LogConfig,</span></span>
<span class="line"><span>          &amp;#64;volatile var logStartOffset: Long,</span></span>
<span class="line"><span>          &amp;#64;volatile var recoveryPoint: Long,</span></span>
<span class="line"><span>          scheduler: Scheduler,</span></span>
<span class="line"><span>          brokerTopicStats: BrokerTopicStats,</span></span>
<span class="line"><span>          val time: Time,</span></span>
<span class="line"><span>          val maxProducerIdExpirationMs: Int,</span></span>
<span class="line"><span>          val producerIdExpirationCheckIntervalMs: Int,</span></span>
<span class="line"><span>          val topicPartition: TopicPartition,</span></span>
<span class="line"><span>          val producerStateManager: ProducerStateManager,</span></span>
<span class="line"><span>          logDirFailureChannel: LogDirFailureChannel) extends Logging with KafkaMetricsGroup {</span></span>
<span class="line"><span>……</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看着好像有很多属性，但其实，你只需要记住两个属性的作用就够了： <strong>dir和logStartOffset</strong>。dir就是这个日志所在的文件夹路径，也就是 <strong>主题分区的路径</strong>。而logStartOffset，表示 <strong>日志的当前最早位移</strong>。dir和logStartOffset都是volatile var类型，表示它们的值是变动的，而且可能被多个线程更新。</p><p>你可能听过日志的当前末端位移，也就是Log End Offset（LEO），它是表示日志下一条待插入消息的位移值，而这个Log Start Offset是跟它相反的，它表示日志当前对外可见的最早一条消息的位移值。我用一张图来标识它们的区别：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/388672f6dab8571f272ed47c9679c2b4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/388672f6dab8571f272ed47c9679c2b4.jpg" alt=""></a></p><p>图中绿色的位移值3是日志的Log Start Offset，而位移值15表示LEO。另外，位移值8是高水位值，它是区分已提交消息和未提交消息的分水岭。</p><p>有意思的是，Log End Offset可以简称为LEO，但Log Start Offset却不能简称为LSO。因为在Kafka中，LSO特指Log Stable Offset，属于Kafka事务的概念。这个课程中不会涉及LSO，你只需要知道Log Start Offset不等于LSO即可。</p><p>Log类的其他属性你暂时不用理会，因为它们要么是很明显的工具类属性，比如timer和scheduler，要么是高阶用法才会用到的高级属性，比如producerStateManager和logDirFailureChannel。工具类的代码大多是做辅助用的，跳过它们也不妨碍我们理解Kafka的核心功能；而高阶功能代码设计复杂，学习成本高，性价比不高。</p><p>其实，除了Log类签名定义的这些属性之外，Log类还定义了一些很重要的属性，比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    &amp;#64;volatile private var nextOffsetMetadata: LogOffsetMetadata = _</span></span>
<span class="line"><span>    &amp;#64;volatile private var highWatermarkMetadata: LogOffsetMetadata = LogOffsetMetadata(logStartOffset)</span></span>
<span class="line"><span>    private val segments: ConcurrentNavigableMap[java.lang.Long, LogSegment] = new ConcurrentSkipListMap[java.lang.Long, LogSegment]</span></span>
<span class="line"><span>    &amp;#64;volatile var leaderEpochCache: Option[LeaderEpochFileCache] = None</span></span></code></pre></div><p>第一个属性nextOffsetMetadata，它封装了下一条待插入消息的位移值，你基本上可以把这个属性和LEO等同起来。</p><p>第二个属性highWatermarkMetadata，是分区日志高水位值。关于高水位的概念，我们在 <a href="https://time.geekbang.org/column/intro/100029201" target="_blank" rel="noreferrer">《Kafka核心技术与实战》</a> 这个课程中做过详细解释，你可以看一下 <a href="https://time.geekbang.org/column/article/112118" target="_blank" rel="noreferrer">这篇文章</a>（下节课我还会再具体给你介绍下）。</p><p>第三个属性segments，我认为这是Log类中最重要的属性。它保存了分区日志下所有的日志段信息，只不过是用Map的数据结构来保存的。Map的Key值是日志段的起始位移值，Value则是日志段对象本身。Kafka源码使用ConcurrentNavigableMap数据结构来保存日志段对象，就可以很轻松地利用该类提供的线程安全和各种支持排序的方法，来管理所有日志段对象。</p><p>第四个属性是Leader Epoch Cache对象。Leader Epoch是社区于0.11.0.0版本引入源码中的，主要是用来判断出现Failure时是否执行日志截断操作（Truncation）。之前靠高水位来判断的机制，可能会造成副本间数据不一致的情形。这里的Leader Epoch Cache是一个缓存类数据，里面保存了分区Leader的Epoch值与对应位移值的映射关系，我建议你查看下LeaderEpochFileCache类，深入地了解下它的实现原理。</p><p>掌握了这些基本属性之后，我们看下Log类的初始化逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> locally {</span></span>
<span class="line"><span>        val startMs = time.milliseconds</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // create the log directory if it doesn&#39;t exist</span></span>
<span class="line"><span>        Files.createDirectories(dir.toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        initializeLeaderEpochCache()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        val nextOffset = loadSegments()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* Calculate the offset of the next message */</span></span>
<span class="line"><span>        nextOffsetMetadata = LogOffsetMetadata(nextOffset, activeSegment.baseOffset, activeSegment.size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        leaderEpochCache.foreach(_.truncateFromEnd(nextOffsetMetadata.messageOffset))</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        logStartOffset = math.max(logStartOffset, segments.firstEntry.getValue.baseOffset)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // The earliest leader epoch may not be flushed during a hard failure. Recover it here.</span></span>
<span class="line"><span>        leaderEpochCache.foreach(_.truncateFromStart(logStartOffset))</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Any segment loading or recovery code must not use producerStateManager, so that we can build the full state here</span></span>
<span class="line"><span>        // from scratch.</span></span>
<span class="line"><span>        if (!producerStateManager.isEmpty)</span></span>
<span class="line"><span>          throw new IllegalStateException(&quot;Producer state must be empty during log initialization&quot;)</span></span>
<span class="line"><span>        loadProducerState(logEndOffset, reloadFromCleanShutdown = hasCleanShutdownFile)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        info(s&quot;Completed load of log with \${segments.size} segments, log start offset $logStartOffset and &quot; +</span></span>
<span class="line"><span>          s&quot;log end offset $logEndOffset in \${time.milliseconds() - startMs}</span></span></code></pre></div><p>在详细解释这段初始化代码之前，我使用一张图来说明它到底做了什么：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/a10b81680a449e5b1d8882939061f7a8.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/a10b81680a449e5b1d8882939061f7a8.jpg" alt=""></a></p><p>这里我们重点说说第三步，即加载日志段的实现逻辑，以下是loadSegments的实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> private def loadSegments(): Long = {</span></span>
<span class="line"><span>        // first do a pass through the files in the log directory and remove any temporary files</span></span>
<span class="line"><span>        // and find any interrupted swap operations</span></span>
<span class="line"><span>        val swapFiles = removeTempFilesAndCollectSwapFiles()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Now do a second pass and load all the log and index files.</span></span>
<span class="line"><span>        // We might encounter legacy log segments with offset overflow (KAFKA-6264). We need to split such segments. When</span></span>
<span class="line"><span>        // this happens, restart loading segment files from scratch.</span></span>
<span class="line"><span>        retryOnOffsetOverflow {</span></span>
<span class="line"><span>          // In case we encounter a segment with offset overflow, the retry logic will split it after which we need to retry</span></span>
<span class="line"><span>          // loading of segments. In that case, we also need to close all segments that could have been left open in previous</span></span>
<span class="line"><span>          // call to loadSegmentFiles().</span></span>
<span class="line"><span>          logSegments.foreach(_.close())</span></span>
<span class="line"><span>          segments.clear()</span></span>
<span class="line"><span>          loadSegmentFiles()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Finally, complete any interrupted swap operations. To be crash-safe,</span></span>
<span class="line"><span>        // log files that are replaced by the swap segment should be renamed to .deleted</span></span>
<span class="line"><span>        // before the swap file is restored as the new segment file.</span></span>
<span class="line"><span>        completeSwapOperations(swapFiles)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!dir.getAbsolutePath.endsWith(Log.DeleteDirSuffix)) {</span></span>
<span class="line"><span>          val nextOffset = retryOnOffsetOverflow {</span></span>
<span class="line"><span>            recoverLog()</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>          // reset the index size of the currently active log segment to allow more entries</span></span>
<span class="line"><span>          activeSegment.resizeIndexes(config.maxIndexSize)</span></span>
<span class="line"><span>          nextOffset</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>           if (logSegments.isEmpty) {</span></span>
<span class="line"><span>              addSegment(LogSegment.open(dir = dir,</span></span>
<span class="line"><span>                baseOffset = 0,</span></span>
<span class="line"><span>                config,</span></span>
<span class="line"><span>                time = time,</span></span>
<span class="line"><span>                fileAlreadyExists = false,</span></span>
<span class="line"><span>                initFileSize = this.initFileSize,</span></span>
<span class="line"><span>                preallocate = false))</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>          0</span></span>
<span class="line"><span>        }</span></span></code></pre></div><p>这段代码会对分区日志路径遍历两次。</p><p>首先，它会移除上次Failure遗留下来的各种临时文件（包括.cleaned、.swap、.deleted文件等），removeTempFilesAndCollectSwapFiles方法实现了这个逻辑。</p><p>之后，它会清空所有日志段对象，并且再次遍历分区路径，重建日志段segments Map并删除无对应日志段文件的孤立索引文件。</p><p>待执行完这两次遍历之后，它会完成未完成的swap操作，即调用completeSwapOperations方法。等这些都做完之后，再调用recoverLog方法恢复日志段对象，然后返回恢复之后的分区日志LEO值。</p><p>如果你现在觉得有点蒙，也没关系，我把这段代码再进一步拆解下，以更小的粒度跟你讲下它们做了什么。理解了这段代码之后，你大致就能搞清楚大部分的分区日志操作了。所以，这部分代码绝对值得我们多花一点时间去学习。</p><p>我们首先来看第一步，removeTempFilesAndCollectSwapFiles方法的实现。我用注释的方式详细解释了每行代码的作用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> private def removeTempFilesAndCollectSwapFiles(): Set[File] = {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在方法内部定义一个名为deleteIndicesIfExist的方法，用于删除日志文件对应的索引文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def deleteIndicesIfExist(baseFile: File, suffix: String = &quot;&quot;): Unit = {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    info(s&quot;Deleting index files with suffix $suffix for baseFile $baseFile&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val offset = offsetFromFile(baseFile)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(Log.offsetIndexFile(dir, offset, suffix).toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(Log.timeIndexFile(dir, offset, suffix).toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(Log.transactionIndexFile(dir, offset, suffix).toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var swapFiles = Set[File]()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var cleanFiles = Set[File]()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var minCleanedFileOffset = Long.MaxValue</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 遍历分区日志路径下的所有文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (file &amp;lt;- dir.listFiles if file.isFile) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!file.canRead) // 如果不可读，直接抛出IOException</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    throw new IOException(s&quot;Could not read file $file&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val filename = file.getName</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (filename.endsWith(DeletedFileSuffix)) { // 如果以.deleted结尾</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    debug(s&quot;Deleting stray temporary file \${file.getAbsolutePath}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(file.toPath) // 说明是上次Failure遗留下来的文件，直接删除</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } else if (filename.endsWith(CleanedFileSuffix)) { // 如果以.cleaned结尾</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    minCleanedFileOffset = Math.min(offsetFromFileName(filename), minCleanedFileOffset) // 选取文件名中位移值最小的.cleaned文件，获取其位移值，并将该文件加入待删除文件集合中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cleanFiles += file</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } else if (filename.endsWith(SwapFileSuffix)) { // 如果以.swap结尾</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val baseFile = new File(CoreUtils.replaceSuffix(file.getPath, SwapFileSuffix, &quot;&quot;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    info(s&quot;Found file \${file.getAbsolutePath} from interrupted swap operation.&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (isIndexFile(baseFile)) { // 如果该.swap文件原来是索引文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    deleteIndicesIfExist(baseFile) // 删除原来的索引文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } else if (isLogFile(baseFile)) { // 如果该.swap文件原来是日志文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    deleteIndicesIfExist(baseFile) // 删除掉原来的索引文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    swapFiles += file // 加入待恢复的.swap文件集合中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从待恢复swap集合中找出那些起始位移值大于minCleanedFileOffset值的文件，直接删掉这些无效的.swap文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val (invalidSwapFiles, validSwapFiles) = swapFiles.partition(file =&amp;gt; offsetFromFile(file) &amp;gt;= minCleanedFileOffset)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    invalidSwapFiles.foreach { file =&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    debug(s&quot;Deleting invalid swap file \${file.getAbsoluteFile} minCleanedFileOffset: $minCleanedFileOffset&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val baseFile = new File(CoreUtils.replaceSuffix(file.getPath, SwapFileSuffix, &quot;&quot;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    deleteIndicesIfExist(baseFile, SwapFileSuffix)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(file.toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Now that we have deleted all .swap files that constitute an incomplete split operation, let&#39;s delete all .clean files</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 清除所有待删除文件集合中的文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cleanFiles.foreach { file =&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    debug(s&quot;Deleting stray .clean file \${file.getAbsolutePath}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(file.toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 最后返回当前有效的.swap文件集合</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    validSwapFiles</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>执行完了removeTempFilesAndCollectSwapFiles逻辑之后，源码开始清空已有日志段集合，并重新加载日志段文件。这就是第二步。这里调用的主要方法是loadSegmentFiles。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   private def loadSegmentFiles(): Unit = {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 按照日志段文件名中的位移值正序排列，然后遍历每个文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (file &amp;lt;- dir.listFiles.sortBy(_.getName) if file.isFile) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (isIndexFile(file)) { // 如果是索引文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val offset = offsetFromFile(file)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val logFile = Log.logFile(dir, offset)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!logFile.exists) { // 确保存在对应的日志文件，否则记录一个警告，并删除该索引文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    warn(s&quot;Found an orphaned index file \${file.getAbsolutePath}, with no corresponding log file.&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.deleteIfExists(file.toPath)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } else if (isLogFile(file)) { // 如果是日志文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val baseOffset = offsetFromFile(file)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val timeIndexFileNewlyCreated = !Log.timeIndexFile(dir, baseOffset).exists()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建对应的LogSegment对象实例，并加入segments中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val segment = LogSegment.open(dir = dir,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    baseOffset = baseOffset,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    config,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    time = time,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fileAlreadyExists = true)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try segment.sanityCheck(timeIndexFileNewlyCreated)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    catch {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    case _: NoSuchFileException =&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    error(s&quot;Could not find offset index file corresponding to log file \${segment.log.file.getAbsolutePath}, &quot; +</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;recovering segment and rebuilding index files...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    recoverSegment(segment)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    case e: CorruptIndexException =&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    warn(s&quot;Found a corrupted index file corresponding to log file \${segment.log.file.getAbsolutePath} due &quot; +</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    s&quot;to \${e.getMessage}​}, recovering segment and rebuilding index files...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    recoverSegment(segment)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    addSegment(segment)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>第三步是处理第一步返回的有效.swap文件集合。completeSwapOperations方法就是做这件事的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private def completeSwapOperations(swapFiles: Set[File]): Unit = {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 遍历所有有效.swap文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (swapFile &amp;lt;- swapFiles) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val logFile = new File(CoreUtils.replaceSuffix(swapFile.getPath, SwapFileSuffix, &quot;&quot;)) // 获取对应的日志文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val baseOffset = offsetFromFile(logFile) // 拿到日志文件的起始位移值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建对应的LogSegment实例</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val swapSegment = LogSegment.open(swapFile.getParentFile,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    baseOffset = baseOffset,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    config,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    time = time,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fileSuffix = SwapFileSuffix)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    info(s&quot;Found log file \${swapFile.getPath} from interrupted swap operation, repairing.&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 执行日志段恢复操作</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    recoverSegment(swapSegment)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // We create swap files for two cases:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // (1) Log cleaning where multiple segments are merged into one, and</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // (2) Log splitting where one segment is split into multiple.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Both of these mean that the resultant swap segments be composed of the original set, i.e. the swap segment</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // must fall within the range of existing segment(s). If we cannot find such a segment, it means the deletion</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // of that segment was successful. In such an event, we should simply rename the .swap to .log without having to</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // do a replace with an existing segment.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 确认之前删除日志段是否成功，是否还存在老的日志段文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    val oldSegments = logSegments(swapSegment.baseOffset, swapSegment.readNextOffset).filter { segment =&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    segment.readNextOffset &amp;gt; swapSegment.baseOffset</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将生成的.swap文件加入到日志中，删除掉swap之前的日志段</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    replaceSegments(Seq(swapSegment), oldSegments.toSeq, isRecoveredSwapFile = true)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>最后一步是recoverLog操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> private def recoverLog(): Long = {</span></span>
<span class="line"><span>        // if we have the clean shutdown marker, skip recovery</span></span>
<span class="line"><span>        // 如果不存在以.kafka_cleanshutdown结尾的文件。通常都不存在</span></span>
<span class="line"><span>        if (!hasCleanShutdownFile) {</span></span>
<span class="line"><span>          // 获取到上次恢复点以外的所有unflushed日志段对象</span></span>
<span class="line"><span>          val unflushed = logSegments(this.recoveryPoint, Long.MaxValue).toIterator</span></span>
<span class="line"><span>          var truncated = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>          // 遍历这些unflushed日志段</span></span>
<span class="line"><span>          while (unflushed.hasNext &amp;&amp; !truncated) {</span></span>
<span class="line"><span>            val segment = unflushed.next</span></span>
<span class="line"><span>            info(s&quot;Recovering unflushed segment \${segment.baseOffset}&quot;)</span></span>
<span class="line"><span>            val truncatedBytes =</span></span>
<span class="line"><span>              try {</span></span>
<span class="line"><span>                // 执行恢复日志段操作</span></span>
<span class="line"><span>                recoverSegment(segment, leaderEpochCache)</span></span>
<span class="line"><span>              } catch {</span></span>
<span class="line"><span>                case _: InvalidOffsetException =&amp;gt;</span></span>
<span class="line"><span>                  val startOffset = segment.baseOffset</span></span>
<span class="line"><span>                  warn(&quot;Found invalid offset during recovery. Deleting the corrupt segment and &quot; +</span></span>
<span class="line"><span>                    s&quot;creating an empty one with starting offset $startOffset&quot;)</span></span>
<span class="line"><span>                  segment.truncateTo(startOffset)</span></span>
<span class="line"><span>              }</span></span>
<span class="line"><span>            if (truncatedBytes &amp;gt; 0) { // 如果有无效的消息导致被截断的字节数不为0，直接删除剩余的日志段对象</span></span>
<span class="line"><span>              warn(s&quot;Corruption found in segment \${segment.baseOffset}, truncating to offset \${segment.readNextOffset}&quot;)</span></span>
<span class="line"><span>              removeAndDeleteSegments(unflushed.toList, asyncDelete = true)</span></span>
<span class="line"><span>              truncated = true</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 这些都做完之后，如果日志段集合不为空</span></span>
<span class="line"><span>        if (logSegments.nonEmpty) {</span></span>
<span class="line"><span>          val logEndOffset = activeSegment.readNextOffset</span></span>
<span class="line"><span>          if (logEndOffset &amp;lt; logStartOffset) { // 验证分区日志的LEO值不能小于Log Start Offset值，否则删除这些日志段对象</span></span>
<span class="line"><span>            warn(s&quot;Deleting all segments because logEndOffset ($logEndOffset) is smaller than logStartOffset ($logStartOffset). &quot; +</span></span>
<span class="line"><span>              &quot;This could happen if segment files were deleted from the file system.&quot;)</span></span>
<span class="line"><span>            removeAndDeleteSegments(logSegments, asyncDelete = true)</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 这些都做完之后，如果日志段集合为空了</span></span>
<span class="line"><span>        if (logSegments.isEmpty) {</span></span>
<span class="line"><span>        // 至少创建一个新的日志段，以logStartOffset为日志段的起始位移，并加入日志段集合中</span></span>
<span class="line"><span>          addSegment(LogSegment.open(dir = dir,</span></span>
<span class="line"><span>            baseOffset = logStartOffset,</span></span>
<span class="line"><span>            config,</span></span>
<span class="line"><span>            time = time,</span></span>
<span class="line"><span>            fileAlreadyExists = false,</span></span>
<span class="line"><span>            initFileSize = this.initFileSize,</span></span>
<span class="line"><span>            preallocate = config.preallocate))</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 更新上次恢复点属性，并返回</span></span>
<span class="line"><span>        recoveryPoint = activeSegment.readNextOffset</span></span>
<span class="line"><span>        recoveryPoint</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我重点向你介绍了Kafka的Log源码，主要包括：</p><ol><li><strong>Log文件的源码结构</strong>：你可以看下下面的导图，它展示了Log类文件的架构组成，你要重点掌握Log类及其相关方法。</li><li><strong>加载日志段机制</strong>：我结合源码重点分析了日志在初始化时是如何加载日志段的。前面说过了，日志是日志段的容器，弄明白如何加载日志段是后续学习日志段管理的前提条件。</li></ol><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/dd2bf4882021d969accb14c0017d9dfc.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/224795/dd2bf4882021d969accb14c0017d9dfc.jpg" alt=""></a></p><p>总的来说，虽然洋洋洒洒几千字，但我也只讲了最重要的部分。我建议你多看几遍Log.scala中加载日志段的代码，这对后面我们理解Kafka Broker端日志段管理原理大有裨益。在下节课，我会继续讨论日志部分的源码，带你学习常见的Kafka日志操作。</p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>Log源码中有个maybeIncrementHighWatermark方法，你能说说它的实现原理吗？</p><p>欢迎你在留言区畅所欲言，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,72)])])}const u=n(l,[["render",i]]);export{d as __pageData,u as default};
