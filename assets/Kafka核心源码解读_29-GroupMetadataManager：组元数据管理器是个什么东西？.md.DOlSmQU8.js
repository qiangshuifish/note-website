import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"29 | GroupMetadataManager：组元数据管理器是个什么东西？","description":"","frontmatter":{},"headers":[{"level":2,"title":"消费者组元数据管理","slug":"消费者组元数据管理","link":"#消费者组元数据管理","children":[{"level":3,"title":"查询获取消费者组元数据","slug":"查询获取消费者组元数据","link":"#查询获取消费者组元数据","children":[]},{"level":3,"title":"移除消费者组元数据","slug":"移除消费者组元数据","link":"#移除消费者组元数据","children":[]},{"level":3,"title":"添加消费者组元数据","slug":"添加消费者组元数据","link":"#添加消费者组元数据","children":[]},{"level":3,"title":"加载消费者组元数据","slug":"加载消费者组元数据","link":"#加载消费者组元数据","children":[]}]},{"level":2,"title":"消费者组位移管理","slug":"消费者组位移管理","link":"#消费者组位移管理","children":[{"level":3,"title":"保存消费者组位移","slug":"保存消费者组位移","link":"#保存消费者组位移","children":[]},{"level":3,"title":"查询消费者组位移","slug":"查询消费者组位移","link":"#查询消费者组位移","children":[]}]}],"relativePath":"Kafka核心源码解读/29-GroupMetadataManager：组元数据管理器是个什么东西？.md","filePath":"Kafka核心源码解读/29-GroupMetadataManager：组元数据管理器是个什么东西？.md","lastUpdated":1779815932000}'),t={name:"Kafka核心源码解读/29-GroupMetadataManager：组元数据管理器是个什么东西？.md"};function i(o,a,l,r,c,d){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_29-groupmetadatamanager-组元数据管理器是个什么东西" tabindex="-1">29 | GroupMetadataManager：组元数据管理器是个什么东西？ <a class="header-anchor" href="#_29-groupmetadatamanager-组元数据管理器是个什么东西" aria-label="Permalink to &quot;29 | GroupMetadataManager：组元数据管理器是个什么东西？&quot;">​</a></h1><p>你好，我是胡夕。今天，我们学习GroupMetadataManager类的源码。从名字上来看，它是组元数据管理器，但是，从它提供的功能来看，我更愿意将它称作消费者组管理器，因为它定义的方法，提供的都是添加消费者组、移除组、查询组这样组级别的基础功能。</p><p>不过，这个类的知名度不像KafkaController、GroupCoordinator那么高，你之前可能都没有听说过它。但是，它其实是非常重要的消费者组管理类。</p><p>GroupMetadataManager类是在消费者组Coordinator组件被创建时被实例化的。这就是说，每个Broker在启动过程中，都会创建并维持一个GroupMetadataManager实例，以实现对该Broker负责的消费者组进行管理。更重要的是，生产环境输出日志中的与消费者组相关的大多数信息，都和它息息相关。</p><p>我举一个简单的例子。你应该见过这样的日志输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Removed ××× expired offsets in ××× milliseconds.</span></span></code></pre></div><p>这条日志每10分钟打印一次。你有没有想过，它为什么要这么操作呢？其实，这是由GroupMetadataManager类创建的定时任务引发的。如果你不清楚GroupMetadataManager的原理，虽然暂时不会影响你使用，但是，一旦你在实际环境中看到了有关消费者组的错误日志，仅凭日志输出，你是无法定位错误原因的。要解决这个问题，就只有一个办法： <strong>通过阅读源码，彻底搞懂底层实现原理，做到以不变应万变</strong>。</p><p>关于这个类，最重要的就是要掌握它是如何管理消费者组的，以及它对内部位移主题的操作方法。这两个都是重磅功能，我们必须要吃透它们的原理，这也是我们这三节课的学习重点。今天，我们先学习它的类定义和管理消费者组的方法。</p><h1 id="类定义与字段" tabindex="-1">类定义与字段 <a class="header-anchor" href="#类定义与字段" aria-label="Permalink to &quot;类定义与字段&quot;">​</a></h1><p>GroupMetadataManager类定义在coordinator.group包下的同名scala文件中。这个类的代码将近1000行，逐行分析的话，显然效率不高，也没有必要。所以，我从类定义和字段、重要方法两个维度给出主要逻辑的代码分析。下面的代码是该类的定义，以及我选取的重要字段信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// brokerId：所在Broker的Id</span></span>
<span class="line"><span>// interBrokerProtocolVersion：Broker端参数inter.broker.protocol.version值</span></span>
<span class="line"><span>// config: 内部位移主题配置类</span></span>
<span class="line"><span>// replicaManager: 副本管理器类</span></span>
<span class="line"><span>// zkClient: ZooKeeper客户端</span></span>
<span class="line"><span>class GroupMetadataManager(</span></span>
<span class="line"><span>  brokerId: Int,</span></span>
<span class="line"><span>  interBrokerProtocolVersion: ApiVersion,</span></span>
<span class="line"><span>  config: OffsetConfig,</span></span>
<span class="line"><span>  replicaManager: ReplicaManager,</span></span>
<span class="line"><span>  zkClient: KafkaZkClient,</span></span>
<span class="line"><span>  time: Time,</span></span>
<span class="line"><span>  metrics: Metrics) extends Logging with KafkaMetricsGroup {</span></span>
<span class="line"><span>  // 压缩器类型。向位移主题写入消息时执行压缩操作</span></span>
<span class="line"><span>  private val compressionType: CompressionType = CompressionType.forId(config.offsetsTopicCompressionCodec.codec)</span></span>
<span class="line"><span>  // 消费者组元数据容器，保存Broker管理的所有消费者组的数据</span></span>
<span class="line"><span>  private val groupMetadataCache = new Pool[String, GroupMetadata]</span></span>
<span class="line"><span>  // 位移主题下正在执行加载操作的分区</span></span>
<span class="line"><span>  private val loadingPartitions: mutable.Set[Int] = mutable.Set()</span></span>
<span class="line"><span>  // 位移主题下完成加载操作的分区</span></span>
<span class="line"><span>  private val ownedPartitions: mutable.Set[Int] = mutable.Set()</span></span>
<span class="line"><span>  // 位移主题总分区数</span></span>
<span class="line"><span>  private val groupMetadataTopicPartitionCount = getGroupMetadataTopicPartitionCount</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个类的构造函数需要7个参数，后面的time和metrics只是起辅助作用，因此，我重点解释一下前5个参数的含义。</p><ul><li>brokerId：这个参数我们已经无比熟悉了。它是所在Broker的ID值，也就是broker.id参数值。</li><li>interBrokerProtocolVersion：保存Broker间通讯使用的请求版本。它是Broker端参数inter.broker.protocol.version值。这个参数的主要用途是 <strong>确定位移主题消息格式的版本</strong>。</li><li>config：这是一个OffsetConfig类型。该类型定义了与位移管理相关的重要参数，比如位移主题日志段大小设置、位移主题备份因子、位移主题分区数配置等。</li><li>replicaManager：副本管理器类。GroupMetadataManager类使用该字段实现获取分区对象、日志对象以及写入分区消息的目的。</li><li>zkClient：ZooKeeper客户端。该类中的此字段只有一个目的：从ZooKeeper中获取位移主题的分区数。</li></ul><p>除了构造函数所需的字段，该类还定义了其他关键字段，我给你介绍几个非常重要的。</p><p><strong>1.compressionType</strong></p><p><strong>压缩器类型</strong>。Kafka向位移主题写入消息前，可以选择对消息执行压缩操作。是否压缩，取决于Broker端参数offsets.topic.compression.codec值，默认是不进行压缩。如果你的位移主题占用的磁盘空间比较多的话，可以考虑启用压缩，以节省资源。</p><p><strong>2.groupMetadataCache</strong></p><p><strong>该字段是GroupMetadataManager类上最重要的属性，它</strong> <strong>保存这个Broker上GroupCoordinator组件管理的所有消费者组元数据。</strong> 它的Key是消费者组名称，Value是消费者组元数据，也就是GroupMetadata。源码通过该字段实现对消费者组的添加、删除和遍历操作。</p><p><strong>3.loadingPartitions</strong></p><p><strong>位移主题下正在执行加载操作的分区号集合</strong>。这里需要注意两点：首先，这些分区都是位移主题分区，也就是__consumer_offsets主题下的分区；其次，所谓的加载，是指读取位移主题消息数据，填充GroupMetadataCache字段的操作。</p><p><strong>4.ownedPartitions</strong></p><p><strong>位移主题下完成加载操作的分区号集合</strong>。与loadingPartitions类似的是，该字段保存的分区也是位移主题下的分区。和loadingPartitions不同的是，它保存的分区都是 <strong>已经完成加载操作</strong> 的分区。</p><p><strong>5.groupMetadataTopicPartitionCount</strong></p><p><strong>位移主题的分区数</strong>。它是Broker端参数offsets.topic.num.partitions的值，默认是50个分区。若要修改分区数，除了变更该参数值之外，你也可以手动创建位移主题，并指定不同的分区数。</p><p>在这些字段中，groupMetadataCache是最重要的，GroupMetadataManager类大量使用该字段实现对消费者组的管理。接下来，我们就重点学习一下该类是如何管理消费者组的。</p><h1 id="重要方法" tabindex="-1">重要方法 <a class="header-anchor" href="#重要方法" aria-label="Permalink to &quot;重要方法&quot;">​</a></h1><p>管理消费者组包含两个方面，对消费者组元数据的管理以及对消费者组位移的管理。组元数据和组位移都是Coordinator端重要的消费者组管理对象。</p><h2 id="消费者组元数据管理" tabindex="-1">消费者组元数据管理 <a class="header-anchor" href="#消费者组元数据管理" aria-label="Permalink to &quot;消费者组元数据管理&quot;">​</a></h2><p>消费者组元数据管理分为查询获取组信息、添加组、移除组和加载组信息。从代码复杂度来讲，查询获取、移除和添加的逻辑相对简单，加载的过程稍微费事些。我们先说说查询获取。</p><h3 id="查询获取消费者组元数据" tabindex="-1">查询获取消费者组元数据 <a class="header-anchor" href="#查询获取消费者组元数据" aria-label="Permalink to &quot;查询获取消费者组元数据&quot;">​</a></h3><p>GroupMetadataManager类中查询及获取组数据的方法有很多。大多逻辑简单，你一看就能明白，比如下面的getGroup方法和getOrMaybeCreateGroup方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// getGroup方法：返回给定消费者组的元数据信息。</span></span>
<span class="line"><span>// 若该组信息不存在，返回None</span></span>
<span class="line"><span>def getGroup(groupId: String): Option[GroupMetadata] = {</span></span>
<span class="line"><span>  Option(groupMetadataCache.get(groupId))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// getOrMaybeCreateGroup方法：返回给定消费者组的元数据信息。</span></span>
<span class="line"><span>// 若不存在，则视createIfNotExist参数值决定是否需要添加该消费者组</span></span>
<span class="line"><span>def getOrMaybeCreateGroup(groupId: String, createIfNotExist: Boolean): Option[GroupMetadata] = {</span></span>
<span class="line"><span>  if (createIfNotExist)</span></span>
<span class="line"><span>    // 若不存在且允许添加，则添加一个状态是Empty的消费者组元数据对象</span></span>
<span class="line"><span>    Option(groupMetadataCache.getAndMaybePut(groupId, new GroupMetadata(groupId, Empty, time)))</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    Option(groupMetadataCache.get(groupId))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>GroupMetadataManager类的上层组件GroupCoordinator会大量使用这两个方法来获取给定消费者组的数据。这两个方法都会返回给定消费者组的元数据信息，但是它们之间是有区别的。</p><p>对于getGroup方法而言，如果该组信息不存在，就返回None，而这通常表明，消费者组确实不存在，或者是，该组对应的Coordinator组件变更到其他Broker上了。</p><p>而对于getOrMaybeCreateGroup方法而言，若组信息不存在，就根据createIfNotExist参数值决定是否需要添加该消费者组。而且，getOrMaybeCreateGroup方法是在消费者组第一个成员加入组时被调用的，用于把组创建出来。</p><p>在GroupMetadataManager类中，还有一些地方也散落着组查询获取的逻辑。不过它们与这两个方法中的代码大同小异，很容易理解，课下你可以自己阅读下。</p><h3 id="移除消费者组元数据" tabindex="-1">移除消费者组元数据 <a class="header-anchor" href="#移除消费者组元数据" aria-label="Permalink to &quot;移除消费者组元数据&quot;">​</a></h3><p>接下来，我们看下如何移除消费者组信息。当Broker卸任某些消费者组的Coordinator角色时，它需要将这些消费者组从groupMetadataCache中全部移除掉，这就是removeGroupsForPartition方法要做的事情。我们看下它的源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def removeGroupsForPartition(offsetsPartition: Int,</span></span>
<span class="line"><span>                             onGroupUnloaded: GroupMetadata =&amp;gt; Unit): Unit = {</span></span>
<span class="line"><span>  // 位移主题分区</span></span>
<span class="line"><span>  val topicPartition = new TopicPartition(Topic.GROUP_METADATA_TOPIC_NAME, offsetsPartition)</span></span>
<span class="line"><span>  info(s&quot;Scheduling unloading of offsets and group metadata from $topicPartition&quot;)</span></span>
<span class="line"><span>  // 创建异步任务，移除组信息和位移信息</span></span>
<span class="line"><span>  scheduler.schedule(topicPartition.toString, () =&amp;gt; removeGroupsAndOffsets)</span></span>
<span class="line"><span>  // 内部方法，用于移除组信息和位移信息</span></span>
<span class="line"><span>  def removeGroupsAndOffsets(): Unit = {</span></span>
<span class="line"><span>    var numOffsetsRemoved = 0</span></span>
<span class="line"><span>    var numGroupsRemoved = 0</span></span>
<span class="line"><span>    inLock(partitionLock) {</span></span>
<span class="line"><span>      // 移除ownedPartitions中特定位移主题分区记录</span></span>
<span class="line"><span>      ownedPartitions.remove(offsetsPartition)</span></span>
<span class="line"><span>      // 遍历所有消费者组信息</span></span>
<span class="line"><span>      for (group &amp;lt;- groupMetadataCache.values) {</span></span>
<span class="line"><span>        // 如果该组信息保存在特定位移主题分区中</span></span>
<span class="line"><span>        if (partitionFor(group.groupId) == offsetsPartition) {</span></span>
<span class="line"><span>          // 执行组卸载逻辑</span></span>
<span class="line"><span>          onGroupUnloaded(group)</span></span>
<span class="line"><span>          // 关键步骤！将组信息从groupMetadataCache中移除</span></span>
<span class="line"><span>          groupMetadataCache.remove(group.groupId, group)</span></span>
<span class="line"><span>          // 把消费者组从producer对应的组集合中移除</span></span>
<span class="line"><span>          removeGroupFromAllProducers(group.groupId)</span></span>
<span class="line"><span>          // 更新已移除组计数器</span></span>
<span class="line"><span>          numGroupsRemoved += 1</span></span>
<span class="line"><span>          // 更新已移除位移值计数器</span></span>
<span class="line"><span>          numOffsetsRemoved += group.numOffsets</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    info(s&quot;Finished unloading $topicPartition. Removed $numOffsetsRemoved cached offsets &quot; +</span></span>
<span class="line"><span>      s&quot;and $numGroupsRemoved cached groups.&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法的主要逻辑是，先定义一个内部方法removeGroupsAndOffsets，然后创建一个异步任务，调用该方法来执行移除消费者组信息和位移信息。</p><p>那么，怎么判断要移除哪些消费者组呢？这里的依据就是 <strong>传入的位移主题分区</strong>。每个消费者组及其位移的数据，都只会保存在位移主题的一个分区下。一旦给定了位移主题分区，那么，元数据保存在这个位移主题分区下的消费者组就要被移除掉。removeGroupsForPartition方法传入的offsetsPartition参数，表示Leader发生变更的位移主题分区，因此，这些分区保存的消费者组都要从该Broker上移除掉。</p><p>具体的执行逻辑是什么呢？我来解释一下。</p><p>首先，异步任务从ownedPartitions中移除给定位移主题分区。</p><p>其次，遍历消费者组元数据缓存中的所有消费者组对象，如果消费者组正是在给定位移主题分区下保存的，就依次执行下面的步骤。</p><ul><li>第1步，调用onGroupUnloaded方法执行组卸载逻辑。这个方法的逻辑是上层组件GroupCoordinator传过来的。它主要做两件事情：将消费者组状态变更到Dead状态；封装异常表示Coordinator已发生变更，然后调用回调函数返回。</li><li>第2步，把消费者组信息从groupMetadataCache中移除。这一步非常关键，目的是彻底清除掉该组的“痕迹”。</li><li>第3步，把消费者组从producer对应的组集合中移除。这里的producer，是给Kafka事务用的。</li><li>第4步，增加已移除组计数器。</li><li>第5步，更新已移除位移值计数器。</li></ul><p>到这里，方法结束。</p><h3 id="添加消费者组元数据" tabindex="-1">添加消费者组元数据 <a class="header-anchor" href="#添加消费者组元数据" aria-label="Permalink to &quot;添加消费者组元数据&quot;">​</a></h3><p>下面，我们学习添加消费者组的管理方法，即addGroup。它特别简单，仅仅是调用putIfNotExists将给定组添加进groupMetadataCache中而已。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def addGroup(group: GroupMetadata): GroupMetadata = {</span></span>
<span class="line"><span>  val currentGroup = groupMetadataCache.putIfNotExists(group.groupId, group)</span></span>
<span class="line"><span>  if (currentGroup != null) {</span></span>
<span class="line"><span>    currentGroup</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    group</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="加载消费者组元数据" tabindex="-1">加载消费者组元数据 <a class="header-anchor" href="#加载消费者组元数据" aria-label="Permalink to &quot;加载消费者组元数据&quot;">​</a></h3><p>现在轮到相对复杂的加载消费者组了。GroupMetadataManager类中定义了一个loadGroup方法执行对应的加载过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def loadGroup(</span></span>
<span class="line"><span>  group: GroupMetadata, offsets: Map[TopicPartition, CommitRecordMetadataAndOffset],</span></span>
<span class="line"><span>  pendingTransactionalOffsets: Map[Long, mutable.Map[TopicPartition, CommitRecordMetadataAndOffset]]): Unit = {</span></span>
<span class="line"><span>  trace(s&quot;Initialized offsets $offsets for group \${group.groupId}&quot;)</span></span>
<span class="line"><span>  // 初始化消费者组的位移信息</span></span>
<span class="line"><span>  group.initializeOffsets(offsets, pendingTransactionalOffsets.toMap)</span></span>
<span class="line"><span>  // 调用addGroup方法添加消费者组</span></span>
<span class="line"><span>  val currentGroup = addGroup(group)</span></span>
<span class="line"><span>  if (group != currentGroup)</span></span>
<span class="line"><span>    debug(s&quot;Attempt to load group \${group.groupId} from log with generation \${group.generationId} failed &quot; +</span></span>
<span class="line"><span>      s&quot;because there is already a cached group with generation \${currentGroup.generationId}&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法的逻辑有两步。</p><p>第1步，通过initializeOffsets方法，将位移值添加到offsets字段标识的消费者组提交位移元数据中，实现加载消费者组订阅分区提交位移的目的。</p><p>第2步，调用addGroup方法，将该消费者组元数据对象添加进消费者组元数据缓存，实现加载消费者组元数据的目的。</p><h2 id="消费者组位移管理" tabindex="-1">消费者组位移管理 <a class="header-anchor" href="#消费者组位移管理" aria-label="Permalink to &quot;消费者组位移管理&quot;">​</a></h2><p>除了消费者组的管理，GroupMetadataManager类的另一大类功能，是提供消费者组位移的管理，主要包括位移数据的保存和查询。我们总说，位移主题是保存消费者组位移信息的地方。实际上， <strong>当消费者组程序在查询位移时，Kafka总是从内存中的位移缓存数据查询，而不会直接读取底层的位移主题数据。</strong></p><h3 id="保存消费者组位移" tabindex="-1">保存消费者组位移 <a class="header-anchor" href="#保存消费者组位移" aria-label="Permalink to &quot;保存消费者组位移&quot;">​</a></h3><p>storeOffsets方法负责保存消费者组位移。该方法的代码很长，我先画一张图来展示下它的完整流程，帮助你建立起对这个方法的整体认知。接下来，我们再从它的方法签名和具体代码两个维度，来具体了解一下它的执行逻辑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257053/76116b323c0c7b024ebe95c3c08e6ae6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257053/76116b323c0c7b024ebe95c3c08e6ae6.jpg" alt=""></a></p><p>我先给你解释一下保存消费者组位移的全部流程。</p><p><strong>首先</strong>，storeOffsets方法要过滤出满足特定条件的待保存位移信息。是否满足特定条件，要看validateOffsetMetadataLength方法的返回值。这里的特定条件，是指位移提交记录中的自定义数据大小，要小于Broker端参数offset.metadata.max.bytes的值，默认值是4KB。</p><p>如果没有一个分区满足条件，就构造OFFSET_METADATA_TOO_LARGE异常，并调用回调函数。这里的回调函数执行发送位移提交Response的动作。</p><p>倘若有分区满足了条件， <strong>接下来</strong>，方法会判断当前Broker是不是该消费者组的Coordinator，如果不是的话，就构造NOT_COORDINATOR异常，并提交给回调函数；如果是的话，就构造位移主题消息，并将消息写入进位移主题下。</p><p><strong>然后</strong>，调用一个名为putCacheCallback的内置方法，填充groupMetadataCache中各个消费者组元数据中的位移值， <strong>最后</strong>，调用回调函数返回。</p><p>接下来，我们结合代码来查看下storeOffsets方法的实现逻辑。</p><p>首先我们看下它的方法签名。既然是保存消费者组提交位移的，那么，我们就要知道上层调用方都给这个方法传入了哪些参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// group：消费者组元数据</span></span>
<span class="line"><span>// consumerId：消费者组成员ID</span></span>
<span class="line"><span>// offsetMetadata：待保存的位移值，按照分区分组</span></span>
<span class="line"><span>// responseCallback：处理完成后的回调函数</span></span>
<span class="line"><span>// producerId：事务型Producer ID</span></span>
<span class="line"><span>// producerEpoch：事务型Producer Epoch值</span></span>
<span class="line"><span>def storeOffsets(</span></span>
<span class="line"><span>  group: GroupMetadata,</span></span>
<span class="line"><span>  consumerId: String,</span></span>
<span class="line"><span>  offsetMetadata: immutable.Map[TopicPartition, OffsetAndMetadata],</span></span>
<span class="line"><span>  responseCallback: immutable.Map[TopicPartition, Errors] =&amp;gt; Unit,</span></span>
<span class="line"><span>  producerId: Long = RecordBatch.NO_PRODUCER_ID,</span></span>
<span class="line"><span>  producerEpoch: Short = RecordBatch.NO_PRODUCER_EPOCH): Unit = {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法接收6个参数，它们的含义我都用注释的方式标注出来了。producerId和producerEpoch这两个参数是与Kafka事务相关的，你简单了解下就行。我们要重点掌握前面4个参数的含义。</p><ul><li>group：消费者组元数据信息。该字段的类型就是我们之前学到的GroupMetadata类。</li><li>consumerId：消费者组成员ID，仅用于DEBUG调试。</li><li>offsetMetadata：待保存的位移值，按照分区分组。</li><li>responseCallback：位移保存完成后需要执行的回调函数。</li></ul><p>接下来，我们看下storeOffsets的代码。为了便于你理解，我删除了与Kafka事务操作相关的部分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 过滤出满足特定条件的待保存位移数据</span></span>
<span class="line"><span>val filteredOffsetMetadata = offsetMetadata.filter { case (_, offsetAndMetadata) =&amp;gt;</span></span>
<span class="line"><span>  validateOffsetMetadataLength(offsetAndMetadata.metadata)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>val isTxnOffsetCommit = producerId != RecordBatch.NO_PRODUCER_ID</span></span>
<span class="line"><span>// 如果没有任何分区的待保存位移满足特定条件</span></span>
<span class="line"><span>if (filteredOffsetMetadata.isEmpty) {</span></span>
<span class="line"><span>  // 构造OFFSET_METADATA_TOO_LARGE异常并调用responseCallback返回</span></span>
<span class="line"><span>  val commitStatus = offsetMetadata.map { case (k, _) =&amp;gt; k -&amp;gt; Errors.OFFSET_METADATA_TOO_LARGE }</span></span>
<span class="line"><span>  responseCallback(commitStatus)</span></span>
<span class="line"><span>  None</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  // 查看当前Broker是否为给定消费者组的Coordinator</span></span>
<span class="line"><span>  getMagic(partitionFor(group.groupId)) match {</span></span>
<span class="line"><span>    // 如果是Coordinator</span></span>
<span class="line"><span>    case Some(magicValue) =&amp;gt;</span></span>
<span class="line"><span>      val timestampType = TimestampType.CREATE_TIME</span></span>
<span class="line"><span>      val timestamp = time.milliseconds()</span></span>
<span class="line"><span>      // 构造位移主题的位移提交消息</span></span>
<span class="line"><span>      val records = filteredOffsetMetadata.map { case (topicPartition, offsetAndMetadata) =&amp;gt;</span></span>
<span class="line"><span>        val key = GroupMetadataManager.offsetCommitKey(group.groupId, topicPartition)</span></span>
<span class="line"><span>        val value = GroupMetadataManager.offsetCommitValue(offsetAndMetadata, interBrokerProtocolVersion)</span></span>
<span class="line"><span>        new SimpleRecord(timestamp, key, value)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      val offsetTopicPartition = new TopicPartition(Topic.GROUP_METADATA_TOPIC_NAME, partitionFor(group.groupId))</span></span>
<span class="line"><span>      // 为写入消息创建内存Buffer</span></span>
<span class="line"><span>      val buffer = ByteBuffer.allocate(AbstractRecords.estimateSizeInBytes(magicValue, compressionType, records.asJava))</span></span>
<span class="line"><span>      if (isTxnOffsetCommit &amp;&amp; magicValue &amp;lt; RecordBatch.MAGIC_VALUE_V2)</span></span>
<span class="line"><span>        throw Errors.UNSUPPORTED_FOR_MESSAGE_FORMAT.exception(&quot;Attempting to make a transaction offset commit with an invalid magic: &quot; + magicValue)</span></span>
<span class="line"><span>      val builder = MemoryRecords.builder(buffer, magicValue, compressionType, timestampType, 0L, time.milliseconds(),</span></span>
<span class="line"><span>        producerId, producerEpoch, 0, isTxnOffsetCommit, RecordBatch.NO_PARTITION_LEADER_EPOCH)</span></span>
<span class="line"><span>      records.foreach(builder.append)</span></span>
<span class="line"><span>      val entries = Map(offsetTopicPartition -&amp;gt; builder.build())</span></span>
<span class="line"><span>      // putCacheCallback函数定义......</span></span>
<span class="line"><span>      if (isTxnOffsetCommit) {</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        group.inLock {</span></span>
<span class="line"><span>          group.prepareOffsetCommit(offsetMetadata)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 写入消息到位移主题，同时调用putCacheCallback方法更新消费者元数据</span></span>
<span class="line"><span>      appendForGroup(group, entries, putCacheCallback)</span></span>
<span class="line"><span>    // 如果是Coordinator</span></span>
<span class="line"><span>    case None =&amp;gt;</span></span>
<span class="line"><span>      // 构造NOT_COORDINATOR异常并提交给responseCallback方法</span></span>
<span class="line"><span>      val commitStatus = offsetMetadata.map {</span></span>
<span class="line"><span>        case (topicPartition, _) =&amp;gt;</span></span>
<span class="line"><span>          (topicPartition, Errors.NOT_COORDINATOR)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      responseCallback(commitStatus)</span></span>
<span class="line"><span>      None</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我为方法的关键步骤都标注了注释，具体流程前面我也介绍过了，应该很容易理解。不过，这里还需要注意两点，也就是appendForGroup和putCacheCallback方法。前者是向位移主题写入消息；后者是填充元数据缓存的。我们结合代码来学习下。</p><p>appendForGroup方法负责写入消息到位移主题，同时传入putCacheCallback方法，更新消费者元数据。以下是它的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def appendForGroup(</span></span>
<span class="line"><span>  group: GroupMetadata,</span></span>
<span class="line"><span>  records: Map[TopicPartition, MemoryRecords],</span></span>
<span class="line"><span>  callback: Map[TopicPartition, PartitionResponse] =&amp;gt; Unit): Unit = {</span></span>
<span class="line"><span>  replicaManager.appendRecords(</span></span>
<span class="line"><span>    timeout = config.offsetCommitTimeoutMs.toLong,</span></span>
<span class="line"><span>    requiredAcks = config.offsetCommitRequiredAcks,</span></span>
<span class="line"><span>    internalTopicsAllowed = true,</span></span>
<span class="line"><span>    origin = AppendOrigin.Coordinator,</span></span>
<span class="line"><span>    entriesPerPartition = records,</span></span>
<span class="line"><span>    delayedProduceLock = Some(group.lock),</span></span>
<span class="line"><span>    responseCallback = callback)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，该方法就是调用ReplicaManager的appendRecords方法，将消息写入到位移主题中。</p><p>下面，我们再关注一下putCacheCallback方法的实现，也就是将写入的位移值填充到缓存中。我先画一张图来展示下putCacheCallback的逻辑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257053/bc2fcf199a685a5cc6d32846c53c3042.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257053/bc2fcf199a685a5cc6d32846c53c3042.jpg" alt=""></a></p><p>现在，我们结合代码，学习下它的逻辑实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def putCacheCallback(responseStatus: Map[TopicPartition, PartitionResponse]): Unit = {</span></span>
<span class="line"><span>  // 确保消息写入到指定位移主题分区，否则抛出异常</span></span>
<span class="line"><span>  if (responseStatus.size != 1 || !responseStatus.contains(offsetTopicPartition))</span></span>
<span class="line"><span>    throw new IllegalStateException(&quot;Append status %s should only have one partition %s&quot;</span></span>
<span class="line"><span>      .format(responseStatus, offsetTopicPartition))</span></span>
<span class="line"><span>  // 更新已提交位移数指标</span></span>
<span class="line"><span>  offsetCommitsSensor.record(records.size)</span></span>
<span class="line"><span>  val status = responseStatus(offsetTopicPartition)</span></span>
<span class="line"><span>  val responseError = group.inLock {</span></span>
<span class="line"><span>    // 写入结果没有错误</span></span>
<span class="line"><span>    if (status.error == Errors.NONE) {</span></span>
<span class="line"><span>      // 如果不是Dead状态</span></span>
<span class="line"><span>      if (!group.is(Dead)) {</span></span>
<span class="line"><span>        filteredOffsetMetadata.foreach { case (topicPartition, offsetAndMetadata) =&amp;gt;</span></span>
<span class="line"><span>          if (isTxnOffsetCommit)</span></span>
<span class="line"><span>            ......</span></span>
<span class="line"><span>          else</span></span>
<span class="line"><span>            // 调用GroupMetadata的onOffsetCommitAppend方法填充元数据</span></span>
<span class="line"><span>            group.onOffsetCommitAppend(topicPartition, CommitRecordMetadataAndOffset(Some(status.baseOffset), offsetAndMetadata))</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      Errors.NONE</span></span>
<span class="line"><span>    // 写入结果有错误</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      if (!group.is(Dead)) {</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>        filteredOffsetMetadata.foreach { case (topicPartition, offsetAndMetadata) =&amp;gt;</span></span>
<span class="line"><span>          if (isTxnOffsetCommit)</span></span>
<span class="line"><span>            group.failPendingTxnOffsetCommit(producerId, topicPartition)</span></span>
<span class="line"><span>          else</span></span>
<span class="line"><span>            // 取消未完成的位移消息写入</span></span>
<span class="line"><span>            group.failPendingOffsetWrite(topicPartition, offsetAndMetadata)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      ......</span></span>
<span class="line"><span>      // 确认异常类型</span></span>
<span class="line"><span>      status.error match {</span></span>
<span class="line"><span>        case Errors.UNKNOWN_TOPIC_OR_PARTITION</span></span>
<span class="line"><span>             | Errors.NOT_ENOUGH_REPLICAS</span></span>
<span class="line"><span>             | Errors.NOT_ENOUGH_REPLICAS_AFTER_APPEND =&amp;gt;</span></span>
<span class="line"><span>          Errors.COORDINATOR_NOT_AVAILABLE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case Errors.NOT_LEADER_FOR_PARTITION</span></span>
<span class="line"><span>             | Errors.KAFKA_STORAGE_ERROR =&amp;gt;</span></span>
<span class="line"><span>          Errors.NOT_COORDINATOR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case Errors.MESSAGE_TOO_LARGE</span></span>
<span class="line"><span>             | Errors.RECORD_LIST_TOO_LARGE</span></span>
<span class="line"><span>             | Errors.INVALID_FETCH_SIZE =&amp;gt;</span></span>
<span class="line"><span>          Errors.INVALID_COMMIT_OFFSET_SIZE</span></span>
<span class="line"><span>        case other =&amp;gt; other</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 利用异常类型构建提交返回状态</span></span>
<span class="line"><span>  val commitStatus = offsetMetadata.map { case (topicPartition, offsetAndMetadata) =&amp;gt;</span></span>
<span class="line"><span>    if (validateOffsetMetadataLength(offsetAndMetadata.metadata))</span></span>
<span class="line"><span>      (topicPartition, responseError)</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>      (topicPartition, Errors.OFFSET_METADATA_TOO_LARGE)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 调用回调函数</span></span>
<span class="line"><span>  responseCallback(commitStatus)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>putCacheCallback方法的主要目的，是将多个消费者组位移值填充到GroupMetadata的offsets元数据缓存中。</p><p><strong>首先</strong>，该方法要确保位移消息写入到指定位移主题分区，否则就抛出异常。</p><p><strong>之后</strong>，更新已提交位移数指标，然后判断写入结果是否有错误。</p><p>如果没有错误，只要组状态不是Dead状态，就调用GroupMetadata的onOffsetCommitAppend方法填充元数据。onOffsetCommitAppend方法的主体逻辑，是将消费者组订阅分区的位移值写入到offsets字段保存的集合中。当然，如果状态是Dead，则什么都不做。</p><p>如果刚才的写入结果有错误，那么，就通过failPendingOffsetWrite方法取消未完成的位移消息写入。</p><p><strong>接下来</strong>，代码要将日志写入的异常类型转换成表征提交状态错误的异常类型。具体来说，就是将UNKNOWN_TOPIC_OR_PARTITION、NOT_LEADER_FOR_PARTITION和MESSAGE_TOO_LARGE这样的异常，转换到COORDINATOR_NOT_AVAILABLE和NOT_COORDINATOR这样的异常。之后，再将这些转换后的异常封装进commitStatus字段中传给回调函数。</p><p><strong>最后</strong>，调用回调函数返回。至此，方法结束。</p><p>好了，保存消费者组位移信息的storeOffsets方法，我们就学完了，它的关键逻辑，是构造位移主题消息并写入到位移主题，然后将位移值填充到消费者组元数据中。</p><h3 id="查询消费者组位移" tabindex="-1">查询消费者组位移 <a class="header-anchor" href="#查询消费者组位移" aria-label="Permalink to &quot;查询消费者组位移&quot;">​</a></h3><p>现在，我再说说查询消费者组位移，也就是getOffsets方法的代码实现。比起storeOffsets，这个方法要更容易理解。我们看下它的源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def getOffsets(</span></span>
<span class="line"><span>  groupId: String,</span></span>
<span class="line"><span>  requireStable: Boolean,</span></span>
<span class="line"><span>  topicPartitionsOpt: Option[Seq[TopicPartition]]): Map[TopicPartition, PartitionData] = {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  // 从groupMetadataCache字段中获取指定消费者组的元数据</span></span>
<span class="line"><span>  val group = groupMetadataCache.get(groupId)</span></span>
<span class="line"><span>  // 如果没有组数据，返回空数据</span></span>
<span class="line"><span>  if (group == null) {</span></span>
<span class="line"><span>    topicPartitionsOpt.getOrElse(Seq.empty[TopicPartition]).map { topicPartition =&amp;gt;</span></span>
<span class="line"><span>      val partitionData = new PartitionData(OffsetFetchResponse.INVALID_OFFSET,</span></span>
<span class="line"><span>        Optional.empty(), &quot;&quot;, Errors.NONE)</span></span>
<span class="line"><span>      topicPartition -&amp;gt; partitionData</span></span>
<span class="line"><span>    }.toMap</span></span>
<span class="line"><span>  // 如果存在组数据</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    group.inLock {</span></span>
<span class="line"><span>      // 如果组处于Dead状态，则返回空数据</span></span>
<span class="line"><span>      if (group.is(Dead)) {</span></span>
<span class="line"><span>        topicPartitionsOpt.getOrElse(Seq.empty[TopicPartition]).map { topicPartition =&amp;gt;</span></span>
<span class="line"><span>          val partitionData = new PartitionData(OffsetFetchResponse.INVALID_OFFSET,</span></span>
<span class="line"><span>            Optional.empty(), &quot;&quot;, Errors.NONE)</span></span>
<span class="line"><span>          topicPartition -&amp;gt; partitionData</span></span>
<span class="line"><span>        }.toMap</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        val topicPartitions = topicPartitionsOpt.getOrElse(group.allOffsets.keySet)</span></span>
<span class="line"><span>        topicPartitions.map { topicPartition =&amp;gt;</span></span>
<span class="line"><span>          if (requireStable &amp;&amp; group.hasPendingOffsetCommitsForTopicPartition(topicPartition)) {</span></span>
<span class="line"><span>            topicPartition -&amp;gt; new PartitionData(OffsetFetchResponse.INVALID_OFFSET,</span></span>
<span class="line"><span>              Optional.empty(), &quot;&quot;, Errors.UNSTABLE_OFFSET_COMMIT)</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            val partitionData = group.offset(topicPartition) match {</span></span>
<span class="line"><span>              // 如果没有该分区位移数据，返回空数据</span></span>
<span class="line"><span>              case None =&amp;gt;</span></span>
<span class="line"><span>                new PartitionData(OffsetFetchResponse.INVALID_OFFSET,</span></span>
<span class="line"><span>                  Optional.empty(), &quot;&quot;, Errors.NONE)</span></span>
<span class="line"><span>              // 从消费者组元数据中返回指定分区的位移数据</span></span>
<span class="line"><span>              case Some(offsetAndMetadata) =&amp;gt;</span></span>
<span class="line"><span>                new PartitionData(offsetAndMetadata.offset,</span></span>
<span class="line"><span>                  offsetAndMetadata.leaderEpoch, offsetAndMetadata.metadata, Errors.NONE)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            topicPartition -&amp;gt; partitionData</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }.toMap</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>getOffsets方法首先会读取groupMetadataCache中的组元数据，如果不存在对应的记录，则返回空数据集，如果存在，就接着判断组是否处于Dead状态。</p><p>如果是Dead状态，就说明消费者组已经被销毁了，位移数据也被视为不可用了，依然返回空数据集；若状态不是Dead，就提取出消费者组订阅的分区信息，再依次为它们获取对应的位移数据并返回。至此，方法结束。</p><h1 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h1><p>今天，我们学习了GroupMetadataManager类的源码。作为消费者组管理器，它负责管理消费者组的方方面面。其中，非常重要的两个管理功能是消费者组元数据管理和消费者组位移管理，分别包括查询获取、移除、添加和加载消费者组元数据，以及保存和查询消费者组位移，这些方法是上层组件GroupCoordinator倚重的重量级功能载体，你一定要彻底掌握它们。</p><p>我画了一张思维导图，帮助你复习一下今天的重点内容。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257053/eb8fe45e1d152e2ac9cb52c81390265a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257053/eb8fe45e1d152e2ac9cb52c81390265a.jpg" alt=""></a></p><p>实际上，GroupMetadataManager类的地位举足轻重。虽然它在Coordinator组件中不显山不露水，但却是一些线上问题的根源所在。</p><p>我再跟你分享一个小案例。</p><p>之前，我碰到过一个问题：在消费者组成员超多的情况下，无法完成位移加载，这导致Consumer端总是接收到Marking the coordinator dead的错误。</p><p>当时，我查遍各种资料，都无法定位问题，最终，还是通过阅读源码，发现是这个类的doLoadGroupsAndOffsets方法中创建的buffer过小导致的。后来，通过调大offsets.load.buffer.size参数值，我们顺利地解决了问题。</p><p>试想一下，如果当时没有阅读这部分的源码，仅凭日志，我们肯定无法解决这个问题。因此，我们花三节课的时间，专门阅读GroupMetadataManager类源码，是非常值得的。下节课，我将带你继续研读GroupMetadataManager源码，去探寻有关位移主题的那些代码片段。</p><h1 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h1><p>请思考这样一个问题：在什么场景下，需要移除GroupMetadataManager中保存的消费者组记录？</p><p>欢迎在留言区写下你的思考和答案，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,105)])])}const f=s(t,[["render",i]]);export{g as __pageData,f as default};
