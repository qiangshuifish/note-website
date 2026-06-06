import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"24 | ReplicaManager（中）：副本管理器是如何读写副本的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"副本写入：appendRecords","slug":"副本写入-appendrecords","link":"#副本写入-appendrecords","children":[]},{"level":2,"title":"副本读取：fetchMessages","slug":"副本读取-fetchmessages","link":"#副本读取-fetchmessages","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/24-ReplicaManager（中）：副本管理器是如何读写副本的？.md","filePath":"Kafka核心源码解读/24-ReplicaManager（中）：副本管理器是如何读写副本的？.md","lastUpdated":1779815932000}'),t={name:"Kafka核心源码解读/24-ReplicaManager（中）：副本管理器是如何读写副本的？.md"};function l(i,a,o,r,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_24-replicamanager-中-副本管理器是如何读写副本的" tabindex="-1">24 | ReplicaManager（中）：副本管理器是如何读写副本的？ <a class="header-anchor" href="#_24-replicamanager-中-副本管理器是如何读写副本的" aria-label="Permalink to &quot;24 | ReplicaManager（中）：副本管理器是如何读写副本的？&quot;">​</a></h1><p>你好，我是胡夕。上节课，我们学习了ReplicaManager类的定义和重要字段，今天我们接着学习这个类中的读写副本对象部分的源码。无论是读取副本还是写入副本，都是通过底层的Partition对象完成的，而这些分区对象全部保存在上节课所学的allPartitions字段中。可以说，理解这些字段的用途，是后续我们探索副本管理器类功能的重要前提。</p><p>现在，我们就来学习下副本读写功能。整个Kafka的同步机制，本质上就是副本读取+副本写入，搞懂了这两个功能，你就知道了Follower副本是如何同步Leader副本数据的。</p><h2 id="副本写入-appendrecords" tabindex="-1">副本写入：appendRecords <a class="header-anchor" href="#副本写入-appendrecords" aria-label="Permalink to &quot;副本写入：appendRecords&quot;">​</a></h2><p>所谓的副本写入，是指向副本底层日志写入消息。在ReplicaManager类中，实现副本写入的方法叫appendRecords。</p><p>放眼整个Kafka源码世界，需要副本写入的场景有4个。</p><ul><li>场景一：生产者向Leader副本写入消息；</li><li>场景二：Follower副本拉取消息后写入副本；</li><li>场景三：消费者组写入组信息；</li><li>场景四：事务管理器写入事务信息（包括事务标记、事务元数据等）。</li></ul><p>除了第二个场景是直接调用Partition对象的方法实现之外，其他3个都是调用appendRecords来完成的。</p><p>该方法将给定一组分区的消息写入到对应的Leader副本中，并且根据PRODUCE请求中acks设置的不同，有选择地等待其他副本写入完成。然后，调用指定的回调逻辑。</p><p>我们先来看下它的方法签名：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def appendRecords(</span></span>
<span class="line"><span>  timeout: Long,  // 请求处理超时时间</span></span>
<span class="line"><span>  requiredAcks: Short,  // 请求acks设置</span></span>
<span class="line"><span>  internalTopicsAllowed: Boolean,  // 是否允许写入内部主题</span></span>
<span class="line"><span>  origin: AppendOrigin,  // 写入方来源</span></span>
<span class="line"><span>  entriesPerPartition: Map[TopicPartition, MemoryRecords], // 待写入消息</span></span>
<span class="line"><span>  // 回调逻辑</span></span>
<span class="line"><span>  responseCallback: Map[TopicPartition, PartitionResponse] =&amp;gt; Unit,</span></span>
<span class="line"><span>  delayedProduceLock: Option[Lock] = None,</span></span>
<span class="line"><span>  recordConversionStatsCallback:</span></span>
<span class="line"><span>    Map[TopicPartition, RecordConversionStats] =&amp;gt; Unit = _ =&amp;gt; ())</span></span>
<span class="line"><span>  : Unit = {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输入参数有很多，而且都很重要，我一个一个地说。</p><ul><li><strong>timeout</strong>：请求处理超时时间。对于生产者来说，它就是request.timeout.ms参数值。</li><li><strong>requiredAcks</strong>：是否需要等待其他副本写入。对于生产者而言，它就是acks参数的值。而在其他场景中，Kafka默认使用-1，表示等待其他副本全部写入成功再返回。</li><li><strong>internalTopicsAllowed</strong>：是否允许向内部主题写入消息。对于普通的生产者而言，该字段是False，即不允许写入内部主题。对于Coordinator组件，特别是消费者组GroupCoordinator组件来说，它的职责之一就是向内部位移主题写入消息，因此，此时，该字段值是True。</li><li><strong>origin</strong>：AppendOrigin是一个接口，表示写入方来源。当前，它定义了3类写入方，分别是Replication、Coordinator和Client。Replication表示写入请求是由Follower副本发出的，它要将从Leader副本获取到的消息写入到底层的消息日志中。Coordinator表示这些写入由Coordinator发起，它既可以是管理消费者组的GroupCooridnator，也可以是管理事务的TransactionCoordinator。Client表示本次写入由客户端发起。前面我们说过了，Follower副本同步过程不调用appendRecords方法，因此，这里的origin值只可能是Replication或Coordinator。</li><li><strong>entriesPerPartitio</strong> n：按分区分组的、实际要写入的消息集合。</li><li><strong>responseCallback</strong>：写入成功之后，要调用的回调逻辑函数。</li><li><strong>delayedProduceLock</strong>：专门用来保护消费者组操作线程安全的锁对象，在其他场景中用不到。</li><li><strong>recordConversionStatsCallback</strong>：消息格式转换操作的回调统计逻辑，主要用于统计消息格式转换操作过程中的一些数据指标，比如总共转换了多少条消息，花费了多长时间。</li></ul><p>接下来，我们就看看，appendRecords如何利用这些输入参数向副本日志写入消息。我把它的完整代码贴出来。对于重要的步骤，我标注了注释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// requiredAcks合法取值是-1，0，1，否则视为非法</span></span>
<span class="line"><span>if (isValidRequiredAcks(requiredAcks)) {</span></span>
<span class="line"><span>  val sTime = time.milliseconds</span></span>
<span class="line"><span>  // 调用appendToLocalLog方法写入消息集合到本地日志</span></span>
<span class="line"><span>  val localProduceResults = appendToLocalLog(</span></span>
<span class="line"><span>    internalTopicsAllowed = internalTopicsAllowed,</span></span>
<span class="line"><span>    origin, entriesPerPartition, requiredAcks)</span></span>
<span class="line"><span>  debug(&quot;Produce to local log in %d ms&quot;.format(time.milliseconds - sTime))</span></span>
<span class="line"><span>  val produceStatus = localProduceResults.map { case (topicPartition, result) =&amp;gt;</span></span>
<span class="line"><span>    topicPartition -&amp;gt;</span></span>
<span class="line"><span>            ProducePartitionStatus(</span></span>
<span class="line"><span>              result.info.lastOffset + 1, // 设置下一条待写入消息的位移值</span></span>
<span class="line"><span>              // 构建PartitionResponse封装写入结果</span></span>
<span class="line"><span>              new PartitionResponse(result.error, result.info.firstOffset.getOrElse(-1), result.info.logAppendTime,</span></span>
<span class="line"><span>                result.info.logStartOffset, result.info.recordErrors.asJava, result.info.errorMessage))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 尝试更新消息格式转换的指标数据</span></span>
<span class="line"><span>  recordConversionStatsCallback(localProduceResults.map { case (k, v) =&amp;gt; k -&amp;gt; v.info.recordConversionStats })</span></span>
<span class="line"><span>  // 需要等待其他副本完成写入</span></span>
<span class="line"><span>  if (delayedProduceRequestRequired(</span></span>
<span class="line"><span>    requiredAcks, entriesPerPartition, localProduceResults)) {</span></span>
<span class="line"><span>    val produceMetadata = ProduceMetadata(requiredAcks, produceStatus)</span></span>
<span class="line"><span>    // 创建DelayedProduce延时请求对象</span></span>
<span class="line"><span>    val delayedProduce = new DelayedProduce(timeout, produceMetadata, this, responseCallback, delayedProduceLock)</span></span>
<span class="line"><span>    val producerRequestKeys = entriesPerPartition.keys.map(TopicPartitionOperationKey(_)).toSeq</span></span>
<span class="line"><span>    // 再一次尝试完成该延时请求</span></span>
<span class="line"><span>    // 如果暂时无法完成，则将对象放入到相应的Purgatory中等待后续处理</span></span>
<span class="line"><span>    delayedProducePurgatory.tryCompleteElseWatch(delayedProduce, producerRequestKeys)</span></span>
<span class="line"><span>  } else { // 无需等待其他副本写入完成，可以立即发送Response</span></span>
<span class="line"><span>    val produceResponseStatus = produceStatus.map { case (k, status) =&amp;gt; k -&amp;gt; status.responseStatus }</span></span>
<span class="line"><span>    // 调用回调逻辑然后返回即可</span></span>
<span class="line"><span>    responseCallback(produceResponseStatus)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>} else { // 如果requiredAcks值不合法</span></span>
<span class="line"><span>  val responseStatus = entriesPerPartition.map { case (topicPartition, _) =&amp;gt;</span></span>
<span class="line"><span>    topicPartition -&amp;gt; new PartitionResponse(Errors.INVALID_REQUIRED_ACKS,</span></span>
<span class="line"><span>      LogAppendInfo.UnknownLogAppendInfo.firstOffset.getOrElse(-1), RecordBatch.NO_TIMESTAMP, LogAppendInfo.UnknownLogAppendInfo.logStartOffset)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 构造INVALID_REQUIRED_ACKS异常并封装进回调函数调用中</span></span>
<span class="line"><span>  responseCallback(responseStatus)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了帮助你更好地理解，我再用一张图说明一下appendRecords方法的完整流程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/250860/52f1dc751ecfc95f509d1f001ff551d4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/250860/52f1dc751ecfc95f509d1f001ff551d4.jpg" alt=""></a></p><p>我再给你解释一下它的执行流程。</p><p>首先，它会判断requiredAcks的取值是否在合理范围内，也就是“是否是-1、0、1这3个数值中的一个”。如果不是合理取值，代码就进入到外层的else分支，构造名为INVALID_REQUIRED_ACKS的异常，并将其封装进回调函数中执行，然后返回结果。否则的话，代码进入到外层的if分支下。</p><p>进入到if分支后，代码调用 <strong>appendToLocalLog</strong> 方法，将要写入的消息集合保存到副本的本地日志上。然后构造PartitionResponse对象实例，来封装写入结果以及一些重要的元数据信息，比如本次写入有没有错误（errorMessage）、下一条待写入消息的位移值、本次写入消息集合首条消息的位移值，等等。待这些做完了之后，代码会尝试更新消息格式转换的指标数据。此时，源码需要调用delayedProduceRequestRequired方法，来判断本次写入是否算是成功了。</p><p>如果还需要等待其他副本同步完成消息写入，那么就不能立即返回，代码要创建DelayedProduce延时请求对象，并把该对象交由Purgatory来管理。DelayedProduce是生产者端的延时发送请求，对应的Purgatory就是ReplicaManager类构造函数中的delayedProducePurgatory。所谓的Purgatory管理，主要是调用tryCompleteElseWatch方法尝试完成延时发送请求。如果暂时无法完成，就将对象放入到相应的Purgatory中，等待后续处理。</p><p>如果无需等待其他副本同步完成消息写入，那么，appendRecords方法会构造响应的Response，并调用回调逻辑函数，至此，方法结束。</p><p>从刚刚的分析中，我们可以知道，appendRecords实现消息写入的方法是 <strong>appendToLocalLog</strong>，用于判断是否需要等待其他副本写入的方法是 <strong>delayedProduceRequestRequired</strong>。下面我们就深入地学习下这两个方法的代码。</p><p>首先来看appendToLocalLog。从它的名字来看，就是写入副本本地日志。我们来看一下该方法的主要代码片段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def appendToLocalLog(</span></span>
<span class="line"><span>  internalTopicsAllowed: Boolean,</span></span>
<span class="line"><span>  origin: AppendOrigin,</span></span>
<span class="line"><span>  entriesPerPartition: Map[TopicPartition, MemoryRecords],</span></span>
<span class="line"><span>  requiredAcks: Short): Map[TopicPartition, LogAppendResult] = {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  entriesPerPartition.map { case (topicPartition, records) =&amp;gt;</span></span>
<span class="line"><span>    brokerTopicStats.topicStats(topicPartition.topic)</span></span>
<span class="line"><span>      .totalProduceRequestRate.mark()</span></span>
<span class="line"><span>    brokerTopicStats.allTopicsStats.totalProduceRequestRate.mark()</span></span>
<span class="line"><span>    // 如果要写入的主题是内部主题，而internalTopicsAllowed=false，则返回错误</span></span>
<span class="line"><span>    if (Topic.isInternal(topicPartition.topic)</span></span>
<span class="line"><span>      &amp;&amp; !internalTopicsAllowed) {</span></span>
<span class="line"><span>      (topicPartition, LogAppendResult(</span></span>
<span class="line"><span>        LogAppendInfo.UnknownLogAppendInfo,</span></span>
<span class="line"><span>        Some(new InvalidTopicException(s&quot;Cannot append to internal topic \${topicPartition.topic}&quot;))))</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        // 获取分区对象</span></span>
<span class="line"><span>        val partition = getPartitionOrException(topicPartition, expectLeader = true)</span></span>
<span class="line"><span>        // 向该分区对象写入消息集合</span></span>
<span class="line"><span>        val info = partition.appendRecordsToLeader(records, origin, requiredAcks)</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>        // 返回写入结果</span></span>
<span class="line"><span>        (topicPartition, LogAppendResult(info))</span></span>
<span class="line"><span>      } catch {</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我忽略了很多打日志以及错误处理的代码。你可以看到，该方法主要就是利用Partition的appendRecordsToLeader方法写入消息集合，而后者就是利用我们在 <a href="https://time.geekbang.org/column/article/225993" target="_blank" rel="noreferrer">第3节课</a> 学到的appendAsLeader方法写入本地日志的。总体来说，appendToLocalLog的逻辑不复杂，你应该很容易理解。</p><p>下面我们看下delayedProduceRequestRequired方法的源码。它用于判断消息集合被写入到日志之后，是否需要等待其他副本也写入成功。我们看下它的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def delayedProduceRequestRequired(</span></span>
<span class="line"><span>  requiredAcks: Short,</span></span>
<span class="line"><span>  entriesPerPartition: Map[TopicPartition, MemoryRecords],</span></span>
<span class="line"><span>  localProduceResults: Map[TopicPartition, LogAppendResult]): Boolean = {</span></span>
<span class="line"><span>  requiredAcks == -1 &amp;&amp; entriesPerPartition.nonEmpty &amp;&amp;</span></span>
<span class="line"><span>    localProduceResults.values.count(_.exception.isDefined) &amp;lt; entriesPerPartition.size</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法返回一个布尔值，True表示需要等待其他副本完成；False表示无需等待。上面的代码表明，如果需要等待其他副本的写入，就必须同时满足3个条件：</p><ol><li>requiredAcks必须等于-1；</li><li>依然有数据尚未写完；</li><li>至少有一个分区的消息已经成功地被写入到本地日志。</li></ol><p>其实，你可以把条件2和3联合在一起来看。如果所有分区的数据写入都不成功，就表明可能出现了很严重的错误，此时，比较明智的做法是不再等待，而是直接返回错误给发送方。相反地，如果有部分分区成功写入，而部分分区写入失败了，就表明可能是由偶发的瞬时错误导致的。此时，不妨将本次写入请求放入Purgatory，再给它一个重试的机会。</p><h2 id="副本读取-fetchmessages" tabindex="-1">副本读取：fetchMessages <a class="header-anchor" href="#副本读取-fetchmessages" aria-label="Permalink to &quot;副本读取：fetchMessages&quot;">​</a></h2><p>好了，说完了副本的写入，下面我们进入到副本读取的源码学习。</p><p>在ReplicaManager类中，负责读取副本数据的方法是fetchMessages。不论是Java消费者API，还是Follower副本，它们拉取消息的主要途径都是向Broker发送FETCH请求，Broker端接收到该请求后，调用fetchMessages方法从底层的Leader副本取出消息。</p><p>和appendRecords方法类似，fetchMessages方法也可能会延时处理FETCH请求，因为Broker端必须要累积足够多的数据之后，才会返回Response给请求发送方。</p><p>可以看一下下面的这张流程图，它展示了fetchMessages方法的主要逻辑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/250860/0f4b45008bdf0b83d0865c7db6d5452c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/250860/0f4b45008bdf0b83d0865c7db6d5452c.jpg" alt=""></a></p><p>我们来看下该方法的签名：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def fetchMessages(timeout: Long,</span></span>
<span class="line"><span>                  replicaId: Int,</span></span>
<span class="line"><span>                  fetchMinBytes: Int,</span></span>
<span class="line"><span>                  fetchMaxBytes: Int,</span></span>
<span class="line"><span>                  hardMaxBytesLimit: Boolean,</span></span>
<span class="line"><span>                  fetchInfos: Seq[(TopicPartition, PartitionData)],</span></span>
<span class="line"><span>                  quota: ReplicaQuota,</span></span>
<span class="line"><span>                  responseCallback: Seq[(TopicPartition, FetchPartitionData)] =&amp;gt; Unit,</span></span>
<span class="line"><span>                  isolationLevel: IsolationLevel,</span></span>
<span class="line"><span>                  clientMetadata: Option[ClientMetadata]): Unit = {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些输入参数都是我们理解下面的重要方法的基础，所以，我们来逐个分析一下。</p><ul><li><strong>timeout</strong>：请求处理超时时间。对于消费者而言，该值就是request.timeout.ms参数值；对于Follower副本而言，该值是Broker端参数replica.fetch.wait.max.ms的值。</li><li><strong>replicaId</strong>：副本ID。对于消费者而言，该参数值是-1；对于Follower副本而言，该值就是Follower副本所在的Broker ID。</li><li><strong>fetchMinBytes &amp; fetchMaxBytes</strong>：能够获取的最小字节数和最大字节数。对于消费者而言，它们分别对应于Consumer端参数fetch.min.bytes和fetch.max.bytes值；对于Follower副本而言，它们分别对应于Broker端参数replica.fetch.min.bytes和replica.fetch.max.bytes值。</li><li><strong>hardMaxBytesLimit</strong>：对能否超过最大字节数做硬限制。如果hardMaxBytesLimit=True，就表示，读取请求返回的数据字节数绝不允许超过最大字节数。</li><li><strong>fetchInfos</strong>：规定了读取分区的信息，比如要读取哪些分区、从这些分区的哪个位移值开始读、最多可以读多少字节，等等。</li><li><strong>quota</strong>：这是一个配额控制类，主要是为了判断是否需要在读取的过程中做限速控制。</li><li><strong>responseCallback</strong>：Response回调逻辑函数。当请求被处理完成后，调用该方法执行收尾逻辑。</li></ul><p>有了这些铺垫之后，我们进入到方法代码的学习。为了便于学习，我将整个方法的代码分成两部分：第一部分是读取本地日志；第二部分是根据读取结果确定Response。</p><p>我们先看第一部分的源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 判断该读取请求是否来自于Follower副本或Consumer</span></span>
<span class="line"><span>val isFromFollower = Request.isValidBrokerId(replicaId)</span></span>
<span class="line"><span>val isFromConsumer = !(isFromFollower || replicaId == Request.FutureLocalReplicaId)</span></span>
<span class="line"><span>// 根据请求发送方判断可读取范围</span></span>
<span class="line"><span>// 如果请求来自于普通消费者，那么可以读到高水位值</span></span>
<span class="line"><span>// 如果请求来自于配置了READ_COMMITTED的消费者，那么可以读到Log Stable Offset值</span></span>
<span class="line"><span>// 如果请求来自于Follower副本，那么可以读到LEO值</span></span>
<span class="line"><span>val fetchIsolation = if (!isFromConsumer)</span></span>
<span class="line"><span>  FetchLogEnd</span></span>
<span class="line"><span>else if (isolationLevel == IsolationLevel.READ_COMMITTED)</span></span>
<span class="line"><span>  FetchTxnCommitted</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>  FetchHighWatermark</span></span>
<span class="line"><span>val fetchOnlyFromLeader = isFromFollower || (isFromConsumer &amp;&amp; clientMetadata.isEmpty)</span></span>
<span class="line"><span>// 定义readFromLog方法读取底层日志中的消息</span></span>
<span class="line"><span>def readFromLog(): Seq[(TopicPartition, LogReadResult)] = {</span></span>
<span class="line"><span>  val result = readFromLocalLog(</span></span>
<span class="line"><span>    replicaId = replicaId,</span></span>
<span class="line"><span>    fetchOnlyFromLeader = fetchOnlyFromLeader,</span></span>
<span class="line"><span>    fetchIsolation = fetchIsolation,</span></span>
<span class="line"><span>    fetchMaxBytes = fetchMaxBytes,</span></span>
<span class="line"><span>    hardMaxBytesLimit = hardMaxBytesLimit,</span></span>
<span class="line"><span>    readPartitionInfo = fetchInfos,</span></span>
<span class="line"><span>    quota = quota,</span></span>
<span class="line"><span>    clientMetadata = clientMetadata)</span></span>
<span class="line"><span>  if (isFromFollower) updateFollowerFetchState(replicaId, result)</span></span>
<span class="line"><span>  else result</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 读取消息并返回日志读取结果</span></span>
<span class="line"><span>val logReadResults = readFromLog()</span></span></code></pre></div><p>这部分代码首先会判断，读取消息的请求方到底是Follower副本，还是普通的Consumer。判断的依据就是看 <strong>replicaId字段是否大于0</strong>。Consumer的replicaId是-1，而Follower副本的则是大于0的数。一旦确定了请求方，代码就能确定可读取范围。</p><p>这里的fetchIsolation是读取隔离级别的意思。对于Follower副本而言，它能读取到Leader副本LEO值以下的所有消息；对于普通Consumer而言，它只能“看到”Leader副本高水位值以下的消息。</p><p>待确定了可读取范围后，fetchMessages方法会调用它的内部方法 <strong>readFromLog</strong>，读取本地日志上的消息数据，并将结果赋值给logReadResults变量。readFromLog方法的主要实现是调用readFromLocalLog方法，而后者就是在待读取分区上依次调用其日志对象的read方法执行实际的消息读取。</p><p>fetchMessages方法的第二部分，是根据上一步的读取结果创建对应的Response。我们看下具体实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var bytesReadable: Long = 0</span></span>
<span class="line"><span>var errorReadingData = false</span></span>
<span class="line"><span>val logReadResultMap = new mutable.HashMap[TopicPartition, LogReadResult]</span></span>
<span class="line"><span>// 统计总共可读取的字节数</span></span>
<span class="line"><span>logReadResults.foreach { case (topicPartition, logReadResult) =&amp;gt;</span></span>
<span class="line"><span> brokerTopicStats.topicStats(topicPartition.topic).totalFetchRequestRate.mark()</span></span>
<span class="line"><span>  brokerTopicStats.allTopicsStats.totalFetchRequestRate.mark()</span></span>
<span class="line"><span>  if (logReadResult.error != Errors.NONE)</span></span>
<span class="line"><span>    errorReadingData = true</span></span>
<span class="line"><span>  bytesReadable = bytesReadable + logReadResult.info.records.sizeInBytes</span></span>
<span class="line"><span>  logReadResultMap.put(topicPartition, logReadResult)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 判断是否能够立即返回Reponse，满足以下4个条件中的任意一个即可：</span></span>
<span class="line"><span>// 1. 请求没有设置超时时间，说明请求方想让请求被处理后立即返回</span></span>
<span class="line"><span>// 2. 未获取到任何数据</span></span>
<span class="line"><span>// 3. 已累积到足够多的数据</span></span>
<span class="line"><span>// 4. 读取过程中出错</span></span>
<span class="line"><span>if (timeout &amp;lt;= 0 || fetchInfos.isEmpty || bytesReadable &amp;gt;= fetchMinBytes || errorReadingData) {</span></span>
<span class="line"><span>  // 构建返回结果</span></span>
<span class="line"><span>  val fetchPartitionData = logReadResults.map { case (tp, result) =&amp;gt;</span></span>
<span class="line"><span>    tp -&amp;gt; FetchPartitionData(result.error, result.highWatermark, result.leaderLogStartOffset, result.info.records,</span></span>
<span class="line"><span>      result.lastStableOffset, result.info.abortedTransactions, result.preferredReadReplica, isFromFollower &amp;&amp; isAddingReplica(tp, replicaId))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 调用回调函数</span></span>
<span class="line"><span>  responseCallback(fetchPartitionData)</span></span>
<span class="line"><span>} else { // 如果无法立即完成请求</span></span>
<span class="line"><span>  val fetchPartitionStatus = new mutable.ArrayBuffer[(TopicPartition, FetchPartitionStatus)]</span></span>
<span class="line"><span>  fetchInfos.foreach { case (topicPartition, partitionData) =&amp;gt;</span></span>
<span class="line"><span>    logReadResultMap.get(topicPartition).foreach(logReadResult =&amp;gt; {</span></span>
<span class="line"><span>      val logOffsetMetadata = logReadResult.info.fetchOffsetMetadata</span></span>
<span class="line"><span>      fetchPartitionStatus += (topicPartition -&amp;gt; FetchPartitionStatus(logOffsetMetadata, partitionData))</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  val fetchMetadata: SFetchMetadata = SFetchMetadata(fetchMinBytes, fetchMaxBytes, hardMaxBytesLimit,</span></span>
<span class="line"><span>    fetchOnlyFromLeader, fetchIsolation, isFromFollower, replicaId, fetchPartitionStatus)</span></span>
<span class="line"><span>  // 构建DelayedFetch延时请求对象</span></span>
<span class="line"><span>  val delayedFetch = new DelayedFetch(timeout, fetchMetadata, this, quota, clientMetadata,</span></span>
<span class="line"><span>    responseCallback)</span></span>
<span class="line"><span>  val delayedFetchKeys = fetchPartitionStatus.map { case (tp, _) =&amp;gt; TopicPartitionOperationKey(tp) }</span></span>
<span class="line"><span>  // 再一次尝试完成请求，如果依然不能完成，则交由Purgatory等待后续处理</span></span>
<span class="line"><span>  delayedFetchPurgatory.tryCompleteElseWatch(delayedFetch, delayedFetchKeys)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这部分代码首先会根据上一步得到的读取结果，统计可读取的总字节数，之后，判断此时是否能够立即返回Reponse。那么，怎么判断是否能够立即返回Response呢？实际上，只要满足以下4个条件中的任意一个即可：</p><ol><li>请求没有设置超时时间，说明请求方想让请求被处理后立即返回；</li><li>未获取到任何数据；</li><li>已累积到足够多数据；</li><li>读取过程中出错。</li></ol><p>如果这4个条件一个都不满足，就需要进行延时处理了。具体来说，就是构建DelayedFetch对象，然后把该延时对象交由delayedFetchPurgatory后续自动处理。</p><p>至此，关于副本管理器读写副本的两个方法appendRecords和fetchMessages，我们就学完了。本质上，它们在底层分别调用Log的append和read方法，以实现本地日志的读写操作。当完成读写操作之后，这两个方法还定义了延时处理的条件。一旦发现满足了延时处理的条件，就交给对应的Purgatory进行处理。</p><p>从这两个方法中，我们已经看到了之前课程中单个组件融合在一起的趋势。就像我在开篇词里面说的，虽然我们学习单个源码文件的顺序是自上而下，但串联Kafka主要组件功能的路径却是自下而上。</p><p>就拿这节课的副本写入操作来说，日志对象的append方法被上一层Partition对象中的方法调用，而后者又进一步被副本管理器中的方法调用。我们是按照自上而下的方式阅读副本管理器、日志对象等单个组件的代码，了解它们各自的独立功能的，现在，我们开始慢慢地把它们融合在一起，勾勒出了Kafka操作分区副本日志对象的完整调用路径。咱们同时采用这两种方式来阅读源码，就可以更快、更深入地搞懂Kafka源码的原理了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们学习了Kafka副本状态机类ReplicaManager是如何读写副本的，重点学习了它的两个重要方法appendRecords和fetchMessages。我们再简单回顾一下。</p><ul><li>appendRecords：向副本写入消息的方法，主要利用Log的append方法和Purgatory机制，共同实现Follower副本向Leader副本获取消息后的数据同步工作。</li><li>fetchMessages：从副本读取消息的方法，为普通Consumer和Follower副本所使用。当它们向Broker发送FETCH请求时，Broker上的副本管理器调用该方法从本地日志中获取指定消息。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/250860/295faae205df4255d2861d658df10db3.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/250860/295faae205df4255d2861d658df10db3.jpg" alt=""></a></p><p>下节课中，我们要把重心转移到副本管理器对副本和分区对象的管理上。这是除了读写副本之外，副本管理器另一大核心功能，你一定不要错过！</p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>appendRecords参数列表中有个origin。我想请你思考一下，在写入本地日志的过程中，这个参数的作用是什么？你能找出最终使用origin参数的具体源码位置吗？</p><p>欢迎在留言区写下你的思考和答案，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,63)])])}const h=s(t,[["render",l]]);export{g as __pageData,h as default};
