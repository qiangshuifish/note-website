import{_ as n,H as s,f as e,i as t}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"26 | MetadataCache：Broker是怎么异步更新元数据缓存的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"MetadataCache类","slug":"metadatacache类","link":"#metadatacache类","children":[]},{"level":2,"title":"类定义及字段","slug":"类定义及字段","link":"#类定义及字段","children":[]},{"level":2,"title":"重要方法","slug":"重要方法","link":"#重要方法","children":[{"level":3,"title":"判断类方法","slug":"判断类方法","link":"#判断类方法","children":[]},{"level":3,"title":"获取类方法","slug":"获取类方法","link":"#获取类方法","children":[]},{"level":3,"title":"更新类方法","slug":"更新类方法","link":"#更新类方法","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/26-MetadataCache：Broker是怎么异步更新元数据缓存的？.md","filePath":"Kafka核心源码解读/26-MetadataCache：Broker是怎么异步更新元数据缓存的？.md","lastUpdated":1779815932000}'),p={name:"Kafka核心源码解读/26-MetadataCache：Broker是怎么异步更新元数据缓存的？.md"};function l(i,a,o,r,c,d){return s(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="_26-metadatacache-broker是怎么异步更新元数据缓存的" tabindex="-1">26 | MetadataCache：Broker是怎么异步更新元数据缓存的？ <a class="header-anchor" href="#_26-metadatacache-broker是怎么异步更新元数据缓存的" aria-label="Permalink to &quot;26 | MetadataCache：Broker是怎么异步更新元数据缓存的？&quot;">​</a></h1><p>你好，我是胡夕。今天，我们学习Broker上的元数据缓存（MetadataCache）。</p><p>你肯定很好奇，前面我们不是学过Controller端的元数据缓存了吗？这里的元数据缓存又是啥呢？其实，这里的MetadataCache是指Broker上的元数据缓存，这些数据是Controller通过UpdateMetadataRequest请求发送给Broker的。换句话说，Controller实现了一个异步更新机制，能够将最新的集群信息广播给所有Broker。</p><p>那么，为什么每台Broker上都要保存这份相同的数据呢？这里有两个原因。</p><p>第一个，也是最重要的原因，就是保存了这部分数据，Broker就能够及时 <strong>响应客户端发送的元数据请求，也就是处理Metadata请求</strong>。Metadata请求是为数不多的能够被集群任意Broker处理的请求类型之一，也就是说，客户端程序能够随意地向任何一个Broker发送Metadata请求，去获取集群的元数据信息，这完全得益于MetadataCache的存在。</p><p>第二个原因是，Kafka的一些重要组件会用到这部分数据。比如副本管理器会使用它来获取Broker的节点信息，事务管理器会使用它来获取分区Leader副本的信息，等等。</p><p>总之，MetadataCache是每台Broker上都会保存的数据。Kafka通过异步更新机制来保证所有Broker上的元数据缓存实现最终一致性。</p><p>在实际使用的过程中，你可能会碰到这样一种场景：集群明明新创建了主题，但是消费者端却报错说“找不到主题信息”，这种情况通常只持续很短的时间。不知道你是否思考过这里面的原因，其实说白了，很简单，这就是因为元数据是异步同步的，因此，在某一时刻，某些Broker尚未更新元数据，它们保存的数据就是过期的元数据，无法识别最新的主题。</p><p>等你今天学完了MetadataCache类，特别是元数据的更新之后，就会彻底明白这个问题了。下面，我们就来学习下MetadataCache的类代码。</p><h2 id="metadatacache类" tabindex="-1">MetadataCache类 <a class="header-anchor" href="#metadatacache类" aria-label="Permalink to &quot;MetadataCache类&quot;">​</a></h2><p>MetadataCache类位于server包下的同名scala文件中。这是一个不到400行的小文件，里面的代码结构非常简单，该文件只定义了一个类，那就是MetadataCache。</p><p>MetadataCache的实例化是在Kafka Broker启动时完成的，具体的调用发生在KafkaServer类的startup方法中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// KafkaServer.scala</span></span>
<span class="line"><span>def startup(): Unit = {</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    metadataCache = new MetadataCache(config.brokerId)</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch {</span></span>
<span class="line"><span>    case e: Throwable =&amp;gt;</span></span>
<span class="line"><span>      ......</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一旦实例被成功创建，就会被Kafka的4个组件使用。我来给你解释一下这4个组件的名称，以及它们各自使用该实例的主要目的。</p><ul><li>KafkaApis：这是源码入口类。它是执行Kafka各类请求逻辑的地方。该类大量使用MetadataCache中的主题分区和Broker数据，执行主题相关的判断与比较，以及获取Broker信息。</li><li>AdminManager：这是Kafka定义的专门用于管理主题的管理器，里面定义了很多与主题相关的方法。同KafkaApis类似，它会用到MetadataCache中的主题信息和Broker数据，以获取主题和Broker列表。</li><li>ReplicaManager：这是我们刚刚学过的副本管理器。它需要获取主题分区和Broker数据，同时还会更新MetadataCache。</li><li>TransactionCoordinator：这是管理Kafka事务的协调者组件，它需要用到MetadataCache中的主题分区的Leader副本所在的Broker数据，向指定Broker发送事务标记。</li></ul><h2 id="类定义及字段" tabindex="-1">类定义及字段 <a class="header-anchor" href="#类定义及字段" aria-label="Permalink to &quot;类定义及字段&quot;">​</a></h2><p>搞清楚了MetadataCache类被创建的时机以及它的调用方，我们就了解了它的典型使用场景，即作为集群元数据集散地，它保存了集群中关于主题和Broker的所有重要数据。那么，接下来，我们来看下这些数据到底都是什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MetadataCache(brokerId: Int) extends Logging {</span></span>
<span class="line"><span>  private val partitionMetadataLock = new ReentrantReadWriteLock()</span></span>
<span class="line"><span>  &amp;#64;volatile private var metadataSnapshot: MetadataSnapshot = MetadataSnapshot(partitionStates = mutable.AnyRefMap.empty,</span></span>
<span class="line"><span>    controllerId = None, aliveBrokers = mutable.LongMap.empty, aliveNodes = mutable.LongMap.empty)</span></span>
<span class="line"><span>  this.logIdent = s&quot;[MetadataCache brokerId=$brokerId] &quot;</span></span>
<span class="line"><span>  private val stateChangeLogger = new StateChangeLogger(brokerId, inControllerContext = false, None)</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>MetadataCache类构造函数只需要一个参数： <strong>brokerId</strong>，即Broker的ID序号。除了这个参数，该类还定义了4个字段。</p><p>partitionMetadataLock字段是保护它写入的锁对象，logIndent和stateChangeLogger字段仅仅用于日志输出，而metadataSnapshot字段保存了实际的元数据信息，它是MetadataCache类中最重要的字段，我们要重点关注一下它。</p><p>该字段的类型是MetadataSnapshot类，该类是MetadataCache中定义的一个嵌套类。以下是该嵌套类的源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class MetadataSnapshot(partitionStates: mutable.AnyRefMap</span></span>
<span class="line"><span>  [String, mutable.LongMap[UpdateMetadataPartitionState]],</span></span>
<span class="line"><span>  controllerId: Option[Int],</span></span>
<span class="line"><span>  aliveBrokers: mutable.LongMap[Broker],</span></span>
<span class="line"><span>  aliveNodes: mutable.LongMap[collection.Map[ListenerName, Node]])</span></span></code></pre></div><p>从源码可知，它是一个case类，相当于Java中配齐了Getter方法的POJO类。同时，它也是一个不可变类（Immutable Class）。正因为它的不可变性，其字段值是不允许修改的，我们只能重新创建一个新的实例，来保存更新后的字段值。</p><p>我们看下它的各个字段的含义。</p><ul><li><strong>partitionStates</strong>：这是一个Map类型。Key是主题名称，Value又是一个Map类型，其Key是分区号，Value是一个UpdateMetadataPartitionState类型的字段。UpdateMetadataPartitionState类型是UpdateMetadataRequest请求内部所需的数据结构。一会儿我们再说这个类型都有哪些数据。</li><li><strong>controllerId</strong>：Controller所在Broker的ID。</li><li><strong>aliveBrokers</strong>：当前集群中所有存活着的Broker对象列表。</li><li><strong>aliveNodes</strong>：这也是一个Map的Map类型。其Key是Broker ID序号，Value是Map类型，其Key是ListenerName，即Broker监听器类型，而Value是Broker节点对象。</li></ul><p>现在，我们说说UpdateMetadataPartitionState类型。这个类型的源码是由Kafka工程自动生成的。UpdateMetadataRequest请求所需的字段用JSON格式表示，由Kafka的generator工程负责为JSON格式自动生成对应的Java文件，生成的类是一个POJO类，其定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static public class UpdateMetadataPartitionState implements Message {</span></span>
<span class="line"><span>    private String topicName;     // 主题名称</span></span>
<span class="line"><span>    private int partitionIndex;   // 分区号</span></span>
<span class="line"><span>    private int controllerEpoch;  // Controller Epoch值</span></span>
<span class="line"><span>    private int leader;           // Leader副本所在Broker ID</span></span>
<span class="line"><span>    private int leaderEpoch;      // Leader Epoch值</span></span>
<span class="line"><span>    private List&amp;lt;Integer&amp;gt; isr;    // ISR列表</span></span>
<span class="line"><span>    private int zkVersion;        // ZooKeeper节点Stat统计信息中的版本号</span></span>
<span class="line"><span>    private List&amp;lt;Integer&amp;gt; replicas;  // 副本列表</span></span>
<span class="line"><span>    private List&amp;lt;Integer&amp;gt; offlineReplicas;  // 离线副本列表</span></span>
<span class="line"><span>    private List&amp;lt;RawTaggedField&amp;gt; _unknownTaggedFields; // 未知字段列表</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，UpdateMetadataPartitionState类的字段信息非常丰富，它包含了一个主题分区非常详尽的数据，从主题名称、分区号、Leader副本、ISR列表到Controller Epoch、ZooKeeper版本号等信息，一应俱全。从宏观角度来看，Kafka集群元数据由主题数据和Broker数据两部分构成。所以，可以这么说，MetadataCache中的这个字段撑起了元数据缓存的“一半天空”。</p><h2 id="重要方法" tabindex="-1">重要方法 <a class="header-anchor" href="#重要方法" aria-label="Permalink to &quot;重要方法&quot;">​</a></h2><p>接下来，我们学习下MetadataCache类的重要方法。你需要记住的是，这个类最重要的方法就是 <strong>操作metadataSnapshot字段的方法</strong>，毕竟，所谓的元数据缓存，就是指MetadataSnapshot类中承载的东西。</p><p>我把MetadataCache类的方法大致分为三大类：</p><ol><li>判断类；</li><li>获取类；</li><li>更新类。</li></ol><p>这三大类方法是由浅入深的关系，我们先从简单的判断类方法开始。</p><h3 id="判断类方法" tabindex="-1">判断类方法 <a class="header-anchor" href="#判断类方法" aria-label="Permalink to &quot;判断类方法&quot;">​</a></h3><p>所谓的判断类方法，就是判断给定主题或主题分区是否包含在元数据缓存中的方法。MetadataCache类提供了两个判断类的方法，方法名都是 <strong>contains</strong>，只是输入参数不同。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 判断给定主题是否包含在元数据缓存中</span></span>
<span class="line"><span>def contains(topic: String): Boolean = {</span></span>
<span class="line"><span>  metadataSnapshot.partitionStates.contains(topic)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 判断给定主题分区是否包含在元数据缓存中</span></span>
<span class="line"><span>def contains(tp: TopicPartition): Boolean = getPartitionInfo(tp.topic, tp.partition).isDefined</span></span>
<span class="line"><span>// 获取给定主题分区的详细数据信息。如果没有找到对应记录，返回None</span></span>
<span class="line"><span>def getPartitionInfo(topic: String,</span></span>
<span class="line"><span>  partitionId: Int): Option[UpdateMetadataPartitionState] = {</span></span>
<span class="line"><span>  metadataSnapshot.partitionStates.get(topic)</span></span>
<span class="line"><span>    .flatMap(_.get(partitionId))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第一个contains方法用于判断给定主题是否包含在元数据缓存中，比较简单，只需要判断metadataSnapshot中partitionStates的所有Key是否包含指定主题就行了。</p><p>第二个contains方法相对复杂一点。它首先要从metadataSnapshot中获取指定主题分区的分区数据信息，然后根据分区数据是否存在，来判断给定主题分区是否包含在元数据缓存中。</p><p>判断类的方法实现都很简单，代码也不多，很好理解，我就不多说了。接下来，我们来看获取类方法。</p><h3 id="获取类方法" tabindex="-1">获取类方法 <a class="header-anchor" href="#获取类方法" aria-label="Permalink to &quot;获取类方法&quot;">​</a></h3><p>MetadataCache类的getXXX方法非常多，其中，比较有代表性的是getAllTopics方法、getAllPartitions方法和getPartitionReplicaEndpoints，它们分别是获取主题、分区和副本对象的方法。在我看来，这是最基础的元数据获取方法了，非常值得我们学习。</p><p>首先，我们来看入门级的get方法，即getAllTopics方法。该方法返回当前集群元数据缓存中的所有主题。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def getAllTopics(snapshot: MetadataSnapshot): Set[String] = {</span></span>
<span class="line"><span>  snapshot.partitionStates.keySet</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它仅仅是返回MetadataSnapshot数据类型中partitionStates字段的所有Key字段。前面说过，partitionStates是一个Map类型，Key就是主题。怎么样，简单吧？</p><p>如果我们要获取元数据缓存中的分区对象，该怎么写呢？来看看 <strong>getAllPartitions方法</strong> 的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def getAllPartitions(): Set[TopicPartition] = {</span></span>
<span class="line"><span>  metadataSnapshot.partitionStates.flatMap { case (topicName, partitionsAndStates) =&amp;gt;</span></span>
<span class="line"><span>    partitionsAndStates.keys.map(partitionId =&amp;gt; new TopicPartition(topicName, partitionId.toInt))</span></span>
<span class="line"><span>  }.toSet</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和getAllTopics方法类似，它的主要思想也是遍历partitionStates，取出分区号后，构建TopicPartition实例，并加入到返回集合中返回。</p><p>最后，我们看一个相对复杂一点的get方法：getPartitionReplicaEndpoints。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def getPartitionReplicaEndpoints(tp: TopicPartition, listenerName: ListenerName): Map[Int, Node] = {</span></span>
<span class="line"><span>  // 使用局部变量获取当前元数据缓存</span></span>
<span class="line"><span>  val snapshot = metadataSnapshot</span></span>
<span class="line"><span>  // 获取给定主题分区的数据</span></span>
<span class="line"><span>  snapshot.partitionStates.get(tp.topic).flatMap(_.get(tp.partition))</span></span>
<span class="line"><span>    .map { partitionInfo =&amp;gt;</span></span>
<span class="line"><span>    // 拿到副本Id列表</span></span>
<span class="line"><span>    val replicaIds = partitionInfo.replicas</span></span>
<span class="line"><span>    replicaIds.asScala</span></span>
<span class="line"><span>      .map(replicaId =&amp;gt; replicaId.intValue() -&amp;gt; {</span></span>
<span class="line"><span>        // 获取副本所在的Broker Id</span></span>
<span class="line"><span>        snapshot.aliveBrokers.get(replicaId.longValue()) match {</span></span>
<span class="line"><span>          case Some(broker) =&amp;gt;</span></span>
<span class="line"><span>            // 根据Broker Id去获取对应的Broker节点对象</span></span>
<span class="line"><span>            broker.getNode(listenerName).getOrElse(Node.noNode())</span></span>
<span class="line"><span>          case None =&amp;gt; // 如果找不到节点</span></span>
<span class="line"><span>            Node.noNode()</span></span>
<span class="line"><span>        }​}).toMap</span></span>
<span class="line"><span>      .filter(pair =&amp;gt; pair match {</span></span>
<span class="line"><span>        case (_, node) =&amp;gt; !node.isEmpty</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span>  }.getOrElse(Map.empty[Int, Node])</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个getPartitionReplicaEndpoints方法接收主题分区和ListenerName，以获取指定监听器类型下该主题分区所有副本的Broker节点对象，并按照Broker ID进行分组。</p><p>首先，代码使用局部变量获取当前的元数据缓存。这样做的好处在于，不需要使用锁技术，但是，就像我开头说过的，这里有一个可能的问题是，读到的数据可能是过期的数据。不过，好在Kafka能够自行处理过期元数据的问题。当客户端因为拿到过期元数据而向Broker发出错误的指令时，Broker会显式地通知客户端错误原因。客户端接收到错误后，会尝试再次拉取最新的元数据。这个过程能够保证，客户端最终可以取得最新的元数据信息。总体而言，过期元数据的不良影响是存在的，但在实际场景中并不是太严重。</p><p>拿到主题分区数据之后，代码会获取副本ID列表，接着遍历该列表，依次获取每个副本所在的Broker ID，再根据这个Broker ID去获取对应的Broker节点对象。最后，将这些节点对象封装到返回结果中并返回。</p><h3 id="更新类方法" tabindex="-1">更新类方法 <a class="header-anchor" href="#更新类方法" aria-label="Permalink to &quot;更新类方法&quot;">​</a></h3><p>下面，我们进入到今天的“重头戏”：Broker端元数据缓存的更新方法。说它是重头戏，有两个原因：</p><ol><li>跟前两类方法相比，它的代码实现要复杂得多，因此，我们需要花更多的时间去学习；</li><li>元数据缓存只有被更新了，才能被读取。从某种程度上说，它是后续所有getXXX方法的前提条件。</li></ol><p>源码中实现更新的方法只有一个： <strong>updateMetadata方法</strong>。该方法的代码比较长，我先画一张流程图，帮助你理解它做了什么事情。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/253108/2abcce0bb1e7e4d1ac3d8bbc41c3f803.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/253108/2abcce0bb1e7e4d1ac3d8bbc41c3f803.jpg" alt=""></a></p><p>updateMetadata方法的主要逻辑，就是 <strong>读取UpdateMetadataRequest请求中的分区数据，然后更新本地元数据缓存</strong>。接下来，我们详细地学习一下它的实现逻辑。</p><p>为了方便你掌握，我将该方法分成几个部分来讲，首先来看第一部分代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def updateMetadata(correlationId: Int, updateMetadataRequest: UpdateMetadataRequest): Seq[TopicPartition] = {</span></span>
<span class="line"><span>  inWriteLock(partitionMetadataLock) {</span></span>
<span class="line"><span>    // 保存存活Broker对象。Key是Broker ID，Value是Broker对象</span></span>
<span class="line"><span>    val aliveBrokers = new mutable.LongMap[Broker](metadataSnapshot.aliveBrokers.size)</span></span>
<span class="line"><span>    // 保存存活节点对象。Key是Broker ID，Value是监听器-&amp;gt;节点对象</span></span>
<span class="line"><span>    val aliveNodes = new mutable.LongMap[collection.Map[ListenerName, Node]](metadataSnapshot.aliveNodes.size)</span></span>
<span class="line"><span>    // 从UpdateMetadataRequest中获取Controller所在的Broker ID</span></span>
<span class="line"><span>    // 如果当前没有Controller，赋值为None</span></span>
<span class="line"><span>    val controllerIdOpt = updateMetadataRequest.controllerId match {</span></span>
<span class="line"><span>        case id if id &amp;lt; 0 =&amp;gt; None</span></span>
<span class="line"><span>        case id =&amp;gt; Some(id)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    // 遍历UpdateMetadataRequest请求中的所有存活Broker对象</span></span>
<span class="line"><span>    updateMetadataRequest.liveBrokers.forEach { broker =&amp;gt;</span></span>
<span class="line"><span>      val nodes = new java.util.HashMap[ListenerName, Node]</span></span>
<span class="line"><span>      val endPoints = new mutable.ArrayBuffer[EndPoint]</span></span>
<span class="line"><span>      // 遍历它的所有EndPoint类型，也就是为Broker配置的监听器</span></span>
<span class="line"><span>      broker.endpoints.forEach { ep =&amp;gt;</span></span>
<span class="line"><span>        val listenerName = new ListenerName(ep.listener)</span></span>
<span class="line"><span>        endPoints += new EndPoint(ep.host, ep.port, listenerName, SecurityProtocol.forId(ep.securityProtocol))</span></span>
<span class="line"><span>        // 将&amp;lt;监听器，Broker节点对象&amp;gt;对保存起来</span></span>
<span class="line"><span>        nodes.put(listenerName, new Node(broker.id, ep.host, ep.port))</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 将Broker加入到存活Broker对象集合</span></span>
<span class="line"><span>      aliveBrokers(broker.id) = Broker(broker.id, endPoints, Option(broker.rack))</span></span>
<span class="line"><span>      // 将Broker节点加入到存活节点对象集合</span></span>
<span class="line"><span>      aliveNodes(broker.id) = nodes.asScala</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这部分代码的主要作用是给后面的操作准备数据，即aliveBrokers和aliveNodes两个字段中保存的数据。</p><p>因此，首先，代码会创建这两个字段，分别保存存活Broker对象和存活节点对象。aliveBrokers的Key类型是Broker ID，而Value类型是Broker对象；aliveNodes的Key类型也是Broker ID，Value类型是&lt;监听器，节点对象&gt;对。</p><p>然后，该方法从UpdateMetadataRequest中获取Controller所在的Broker ID，并赋值给controllerIdOpt字段。如果集群没有Controller，则赋值该字段为None。</p><p>接着，代码会遍历UpdateMetadataRequest请求中的所有存活Broker对象。取出它配置的所有EndPoint类型，也就是Broker配置的所有监听器。</p><p>最后，代码会遍历它配置的监听器，并将&lt;监听器，Broker节点对象&gt;对保存起来，再将Broker加入到存活Broker对象集合和存活节点对象集合。至此，第一部分代码逻辑完成。</p><p>再来看第二部分的代码。这一部分的主要工作是 <strong>确保集群Broker配置了相同的监听器，同时初始化已删除分区数组对象，等待下一部分代码逻辑对它进行操作</strong>。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用上一部分中的存活Broker节点对象，</span></span>
<span class="line"><span>// 获取当前Broker所有的&amp;lt;监听器,节点&amp;gt;对</span></span>
<span class="line"><span>aliveNodes.get(brokerId).foreach { listenerMap =&amp;gt;</span></span>
<span class="line"><span>  val listeners = listenerMap.keySet</span></span>
<span class="line"><span>  // 如果发现当前Broker配置的监听器与其他Broker有不同之处，记录错误日志</span></span>
<span class="line"><span>  if (!aliveNodes.values.forall(_.keySet == listeners))</span></span>
<span class="line"><span>    error(s&quot;Listeners are not identical across brokers: $aliveNodes&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 构造已删除分区数组，将其作为方法返回结果</span></span>
<span class="line"><span>val deletedPartitions = new mutable.ArrayBuffer[TopicPartition]</span></span>
<span class="line"><span>// UpdateMetadataRequest请求没有携带任何分区信息</span></span>
<span class="line"><span>if (!updateMetadataRequest.partitionStates.iterator.hasNext) {</span></span>
<span class="line"><span>  // 构造新的MetadataSnapshot对象，使用之前的分区信息和新的Broker列表信息</span></span>
<span class="line"><span>  metadataSnapshot = MetadataSnapshot(metadataSnapshot.partitionStates, controllerIdOpt, aliveBrokers, aliveNodes)</span></span>
<span class="line"><span>// 否则，进入到方法最后一部分</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这部分代码首先使用上一部分中的存活Broker节点对象，获取当前Broker所有的&lt;监听器,节点&gt;对。</p><p>之后，拿到为当前Broker配置的所有监听器。如果发现配置的监听器与其他Broker有不同之处，则记录一条错误日志。</p><p>接下来，代码会构造一个已删除分区数组，将其作为方法返回结果。然后判断UpdateMetadataRequest请求是否携带了任何分区信息，如果没有，则构造一个新的MetadataSnapshot对象，使用之前的分区信息和新的Broker列表信息；如果有，代码进入到该方法的最后一个部分。</p><p>最后一部分全部位于上面代码中的else分支上。这部分的主要工作是 <strong>提取UpdateMetadataRequest请求中的数据，然后填充元数据缓存</strong>。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val partitionStates = new mutable.AnyRefMap[String, mutable.LongMap[UpdateMetadataPartitionState]](metadataSnapshot.partitionStates.size)</span></span>
<span class="line"><span>// 备份现有元数据缓存中的分区数据</span></span>
<span class="line"><span>metadataSnapshot.partitionStates.foreach { case (topic, oldPartitionStates) =&amp;gt;</span></span>
<span class="line"><span>  val copy = new mutable.LongMap[UpdateMetadataPartitionState](oldPartitionStates.size)</span></span>
<span class="line"><span>  copy ++= oldPartitionStates</span></span>
<span class="line"><span>  partitionStates(topic) = copy</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>val traceEnabled = stateChangeLogger.isTraceEnabled</span></span>
<span class="line"><span>val controllerId = updateMetadataRequest.controllerId</span></span>
<span class="line"><span>val controllerEpoch = updateMetadataRequest.controllerEpoch</span></span>
<span class="line"><span>// 获取UpdateMetadataRequest请求中携带的所有分区数据</span></span>
<span class="line"><span>val newStates = updateMetadataRequest.partitionStates.asScala</span></span>
<span class="line"><span>// 遍历分区数据</span></span>
<span class="line"><span>newStates.foreach { state =&amp;gt;</span></span>
<span class="line"><span>  val tp = new TopicPartition(state.topicName, state.partitionIndex)</span></span>
<span class="line"><span>  // 如果分区处于被删除过程中</span></span>
<span class="line"><span>  if (state.leader == LeaderAndIsr.LeaderDuringDelete) {</span></span>
<span class="line"><span>    // 将分区从元数据缓存中移除</span></span>
<span class="line"><span>    removePartitionInfo(partitionStates, tp.topic, tp.partition)</span></span>
<span class="line"><span>    if (traceEnabled)</span></span>
<span class="line"><span>      stateChangeLogger.trace(s&quot;Deleted partition $tp from metadata cache in response to UpdateMetadata &quot; +</span></span>
<span class="line"><span>        s&quot;request sent by controller $controllerId epoch $controllerEpoch with correlation id $correlationId&quot;)</span></span>
<span class="line"><span>    // 将分区加入到返回结果数据</span></span>
<span class="line"><span>    deletedPartitions += tp</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    // 将分区加入到元数据缓存</span></span>
<span class="line"><span>    addOrUpdatePartitionInfo(partitionStates, tp.topic, tp.partition, state)</span></span>
<span class="line"><span>    if (traceEnabled)</span></span>
<span class="line"><span>      stateChangeLogger.trace(s&quot;Cached leader info $state for partition $tp in response to &quot; +</span></span>
<span class="line"><span>        s&quot;UpdateMetadata request sent by controller $controllerId epoch $controllerEpoch with correlation id $correlationId&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>val cachedPartitionsCount = newStates.size - deletedPartitions.size</span></span>
<span class="line"><span>stateChangeLogger.info(s&quot;Add $cachedPartitionsCount partitions and deleted \${deletedPartitions.size} partitions from metadata cache &quot; +</span></span>
<span class="line"><span>  s&quot;in response to UpdateMetadata request sent by controller $controllerId epoch $controllerEpoch with correlation id $correlationId&quot;)</span></span>
<span class="line"><span>// 使用更新过的分区元数据，和第一部分计算的存活Broker列表及节点列表，构建最新的元数据缓存</span></span>
<span class="line"><span>metadataSnapshot =</span></span>
<span class="line"><span>  MetadataSnapshot(partitionStates, controllerIdOpt, aliveBrokers, aliveNodes)</span></span>
<span class="line"><span>// 返回已删除分区列表数组</span></span>
<span class="line"><span>deletedPartitions</span></span></code></pre></div><p>首先，该方法会备份现有元数据缓存中的分区数据到partitionStates的局部变量中。</p><p>之后，获取UpdateMetadataRequest请求中携带的所有分区数据，并遍历每个分区数据。如果发现分区处于被删除的过程中，就将分区从元数据缓存中移除，并把分区加入到已删除分区数组中。否则的话，代码就将分区加入到元数据缓存中。</p><p>最后，方法使用更新过的分区元数据，和第一部分计算的存活Broker列表及节点列表，构建最新的元数据缓存，然后返回已删除分区列表数组。至此，updateMetadata方法结束。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们学习了Broker端的MetadataCache类，即所谓的元数据缓存类。该类保存了当前集群上的主题分区详细数据和Broker数据。每台Broker都维护了一个MetadataCache实例。Controller通过给Broker发送UpdateMetadataRequest请求的方式，来异步更新这部分缓存数据。</p><p>我们来回顾下这节课的重点。</p><ul><li>MetadataCache类：Broker元数据缓存类，保存了分区详细数据和Broker节点数据。</li><li>四大调用方：分别是ReplicaManager、KafkaApis、TransactionCoordinator和AdminManager。</li><li>updateMetadata方法：Controller给Broker发送UpdateMetadataRequest请求时，触发更新。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/253108/e95db24997c6cb615150ccc269aeb781.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/253108/e95db24997c6cb615150ccc269aeb781.jpg" alt=""></a></p><p>最后，我想和你讨论一个话题。</p><p>有人认为，Kafka Broker是无状态的。学完了今天的内容，现在你应该知道了，Broker并非是无状态的节点，它需要从Controller端异步更新保存集群的元数据信息。由于Kafka采用的是Leader/Follower模式，跟多Leader架构和无Leader架构相比，这种分布式架构的一致性是最容易保证的，因此，Broker间元数据的最终一致性是有保证的。不过，就像我前面说过的，你需要处理Follower滞后或数据过期的问题。需要注意的是，这里的Leader其实是指Controller，而Follower是指普通的Broker节点。</p><p>总之，这一路学到现在，不知道你有没有这样的感受，很多分布式架构设计的问题与方案是相通的。比如，在应对数据备份这个问题上，元数据缓存和Kafka副本其实都是相同的设计思路，即使用单Leader的架构，令Leader对外提供服务，Follower只是被动地同步Leader上的数据。</p><p>每次学到新的内容之后，希望你不要把它们当作单一的知识看待，要善于进行思考和总结，做到融会贯通。源码学习固然重要，但能让学习源码引领我们升级架构思想，其实是更难得的收获！</p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>前面说到，Controller发送UpdateMetadataRequest请求给Broker时，会更新MetadataCache，你能在源码中找到更新元数据缓存的完整调用路径吗？</p><p>欢迎在留言区写下你的思考和答案，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,87)])])}const k=n(p,[["render",l]]);export{g as __pageData,k as default};
