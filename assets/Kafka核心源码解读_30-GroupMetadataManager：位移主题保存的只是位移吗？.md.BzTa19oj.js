import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"30 | GroupMetadataManager：位移主题保存的只是位移吗？","description":"","frontmatter":{},"headers":[{"level":2,"title":"消息类型","slug":"消息类型","link":"#消息类型","children":[{"level":3,"title":"注册消息","slug":"注册消息","link":"#注册消息","children":[]},{"level":3,"title":"已提交位移消息","slug":"已提交位移消息","link":"#已提交位移消息","children":[]},{"level":3,"title":"Tombstone消息","slug":"tombstone消息","link":"#tombstone消息","children":[]}]},{"level":2,"title":"如何确定Coordinator？","slug":"如何确定coordinator","link":"#如何确定coordinator","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/30-GroupMetadataManager：位移主题保存的只是位移吗？.md","filePath":"Kafka核心源码解读/30-GroupMetadataManager：位移主题保存的只是位移吗？.md","lastUpdated":1779815932000}'),t={name:"Kafka核心源码解读/30-GroupMetadataManager：位移主题保存的只是位移吗？.md"};function l(i,a,o,r,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_30-groupmetadatamanager-位移主题保存的只是位移吗" tabindex="-1">30 | GroupMetadataManager：位移主题保存的只是位移吗？ <a class="header-anchor" href="#_30-groupmetadatamanager-位移主题保存的只是位移吗" aria-label="Permalink to &quot;30 | GroupMetadataManager：位移主题保存的只是位移吗？&quot;">​</a></h1><p>你好，我是胡夕。今天，我们学习位移主题管理的源码。</p><p>位移主题，即__consumer_offsets，是Kafka的两大内部主题之一（另一个内部主题是管理Kafka事务的，名字是__transaction_state，用于保存Kafka事务的状态信息）。</p><p>Kafka创建位移主题的目的，是 <strong>保存消费者组的注册消息和提交位移消息</strong>。前者保存能够标识消费者组的身份信息；后者保存消费者组消费的进度信息。在Kafka源码中，GroupMetadataManager类定义了操作位移主题消息类型以及操作位移主题的方法。该主题下都有哪些消息类型，是我们今天学习的重点。</p><p>说到位移主题，你是否对它里面的消息内容感到很好奇呢？我见过很多人直接使用kafka-console-consumer命令消费该主题，想要知道里面保存的内容，可输出的结果却是一堆二进制乱码。其实，如果你不阅读今天的源码，是无法知晓如何通过命令行工具查询该主题消息的内容的。因为这些知识只包含在源码中，官方文档并没有涉及到。</p><p>好了，我不卖关子了。简单来说，你在运行kafka-console-consumer命令时，必须指定 <code>--formatter &quot;kafka.coordinator.group.GroupMetadataManager\\$OffsetsMessageFormatter&quot;</code>，才能查看提交的位移消息数据。类似地，你必须指定GroupMetadataMessageFormatter，才能读取消费者组的注册消息数据。</p><p>今天，我们就来学习位移主题下的这两大消息类型。除此之外，我还会给你介绍消费者组是如何寻找自己的Coordinator的。毕竟，对位移主题进行读写的前提，就是要能找到正确的Coordinator所在。</p><h2 id="消息类型" tabindex="-1">消息类型 <a class="header-anchor" href="#消息类型" aria-label="Permalink to &quot;消息类型&quot;">​</a></h2><p>位移主题有两类消息： <strong>消费者组注册消息</strong>（Group Metadata）和 <strong>消费者组的已提交位移消息</strong>（Offset Commit）。很多人以为，位移主题里面只保存消费者组位移，这是错误的！它还保存了消费者组的注册信息，或者说是消费者组的元数据。这里的元数据，主要是指消费者组名称以及成员分区消费分配方案。</p><p>在分别介绍这两类消息的实现代码之前，我们先看下Kafka为它们定义的公共服务代码。毕竟它们是这两类消息都会用到的代码组件。这些公共代码主要由两部分组成：GroupTopicPartition类和BaseKey接口。</p><p>我们首先来看POJO类 <strong>GroupTopicPartition</strong>。它的作用是封装&lt;消费者组名，主题，分区号&gt;的三元组，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class GroupTopicPartition(group: String, topicPartition: TopicPartition) {</span></span>
<span class="line"><span>  def this(group: String, topic: String, partition: Int) =</span></span>
<span class="line"><span>    this(group, new TopicPartition(topic, partition))</span></span>
<span class="line"><span>  // toString方法......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>显然，这个类就是一个数据容器类。我们后面在学习已提交位移消息时，还会看到它的身影。</p><p>其次是 <strong>BaseKey接口，</strong> 它表示位移主题的两类消息的Key类型。强调一下，无论是该主题下的哪类消息，都必须定义Key。这里的BaseKey接口，定义的就是这两类消息的Key类型。我们看下它的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>trait BaseKey{</span></span>
<span class="line"><span>  def version: Short  // 消息格式版本</span></span>
<span class="line"><span>  def key: Any        // 消息key</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的version是Short型的消息格式版本。随着Kafka代码的不断演进，位移主题的消息格式也在不断迭代，因此，这里出现了版本号的概念。至于key字段，它保存的是实际的Key值。在Scala中，Any类型类似于Java中的Object类，表示该值可以是任意类型。稍后讲到具体的消息类型时，你就会发现，这两类消息的Key类型其实是不同的数据类型。</p><p>好了，基础知识铺垫完了，有了对GroupTopicPartition和BaseKey的理解，你就能明白，位移主题的具体消息类型是如何构造Key的。</p><p>接下来，我们开始学习具体消息类型的实现代码，包括注册消息、提交位移消息和Tombstone消息。由于消费者组必须要先向Coordinator组件注册，然后才能提交位移，所以我们先阅读注册消息的代码。</p><h3 id="注册消息" tabindex="-1">注册消息 <a class="header-anchor" href="#注册消息" aria-label="Permalink to &quot;注册消息&quot;">​</a></h3><p>所谓的注册消息，就是指消费者组向位移主题写入注册类的消息。该类消息的写入时机有两个。</p><ul><li><strong>所有成员都加入组后</strong>：Coordinator向位移主题写入注册消息，只是该消息不含分区消费分配方案；</li><li><strong>Leader成员发送方案给Coordinator后</strong>：当Leader成员将分区消费分配方案发给Coordinator后，Coordinator写入携带分配方案的注册消息。</li></ul><p>我们首先要知道，注册消息的Key是如何定义，以及如何被封装到消息里的。</p><p>Key的定义在GroupMetadataKey类代码中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class GroupMetadataKey(version: Short, key: String) extends BaseKey {</span></span>
<span class="line"><span>  override def toString: String = key</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该类的key字段是一个字符串类型，保存的是消费者组的名称。可见， <strong>注册消息的Key就是消费者组名</strong>。</p><p>GroupMetadataManager对象有个groupMetadataKey方法，负责将注册消息的Key转换成字节数组，用于后面构造注册消息。这个方法的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def groupMetadataKey(group: String): Array[Byte] = {</span></span>
<span class="line"><span>  val key = new Struct(CURRENT_GROUP_KEY_SCHEMA)</span></span>
<span class="line"><span>  key.set(GROUP_KEY_GROUP_FIELD, group)</span></span>
<span class="line"><span>  // 构造一个ByteBuffer对象，容纳version和key数据</span></span>
<span class="line"><span>  val byteBuffer = ByteBuffer.allocate(2 /* version */ + key.sizeOf)</span></span>
<span class="line"><span>  byteBuffer.putShort(CURRENT_GROUP_KEY_SCHEMA_VERSION)</span></span>
<span class="line"><span>  key.writeTo(byteBuffer)</span></span>
<span class="line"><span>  byteBuffer.array()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法首先会接收消费者组名，构造ByteBuffer对象，然后，依次向Buffer写入Short型的消息格式版本以及消费者组名，最后，返回该Buffer底层的字节数组。</p><p>你不用关心这里的格式版本变量以及Struct类型都是怎么实现的，因为它们不是我们理解位移主题内部原理的关键。你需要掌握的，是 <strong>注册消息的Key和Value都是怎么定义的</strong>。</p><p>接下来，我们就来了解下消息体Value的代码实现。既然有groupMetadataKey方法，那么，源码也提供了相应的groupMetadataValue方法。它的目的是 <strong>将消费者组重要的元数据写入到字节数组</strong>。我们看下它的代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def groupMetadataValue(</span></span>
<span class="line"><span>  groupMetadata: GroupMetadata,  // 消费者组元数据对象</span></span>
<span class="line"><span>  assignment: Map[String, Array[Byte]], // 分区消费分配方案</span></span>
<span class="line"><span>  apiVersion: ApiVersion // Kafka API版本号</span></span>
<span class="line"><span>): Array[Byte] = {</span></span>
<span class="line"><span>  // 确定消息格式版本以及格式结构</span></span>
<span class="line"><span>  val (version, value) = {</span></span>
<span class="line"><span>    if (apiVersion &amp;lt; KAFKA_0_10_1_IV0)</span></span>
<span class="line"><span>      (0.toShort, new Struct(GROUP_METADATA_VALUE_SCHEMA_V0))</span></span>
<span class="line"><span>    else if (apiVersion &amp;lt; KAFKA_2_1_IV0)</span></span>
<span class="line"><span>      (1.toShort, new Struct(GROUP_METADATA_VALUE_SCHEMA_V1))</span></span>
<span class="line"><span>    else if (apiVersion &amp;lt; KAFKA_2_3_IV0)</span></span>
<span class="line"><span>      (2.toShort, new Struct(GROUP_METADATA_VALUE_SCHEMA_V2))</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>      (3.toShort, new Struct(GROUP_METADATA_VALUE_SCHEMA_V3))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 依次写入消费者组主要的元数据信息</span></span>
<span class="line"><span>  // 包括协议类型、Generation ID、分区分配策略和Leader成员ID</span></span>
<span class="line"><span>  value.set(PROTOCOL_TYPE_KEY, groupMetadata.protocolType.getOrElse(&quot;&quot;))</span></span>
<span class="line"><span>  value.set(GENERATION_KEY, groupMetadata.generationId)</span></span>
<span class="line"><span>  value.set(PROTOCOL_KEY, groupMetadata.protocolName.orNull)</span></span>
<span class="line"><span>  value.set(LEADER_KEY, groupMetadata.leaderOrNull)</span></span>
<span class="line"><span>  // 写入最近一次状态变更时间戳</span></span>
<span class="line"><span>  if (version &amp;gt;= 2)</span></span>
<span class="line"><span>    value.set(CURRENT_STATE_TIMESTAMP_KEY, groupMetadata.currentStateTimestampOrDefault)</span></span>
<span class="line"><span>  // 写入各个成员的元数据信息</span></span>
<span class="line"><span>  // 包括成员ID、client.id、主机名以及会话超时时间</span></span>
<span class="line"><span>  val memberArray = groupMetadata.allMemberMetadata.map { memberMetadata =&amp;gt;</span></span>
<span class="line"><span>    val memberStruct = value.instance(MEMBERS_KEY)</span></span>
<span class="line"><span>    memberStruct.set(MEMBER_ID_KEY, memberMetadata.memberId)</span></span>
<span class="line"><span>    memberStruct.set(CLIENT_ID_KEY, memberMetadata.clientId)</span></span>
<span class="line"><span>    memberStruct.set(CLIENT_HOST_KEY, memberMetadata.clientHost)</span></span>
<span class="line"><span>    memberStruct.set(SESSION_TIMEOUT_KEY, memberMetadata.sessionTimeoutMs)</span></span>
<span class="line"><span>    // 写入Rebalance超时时间</span></span>
<span class="line"><span>    if (version &amp;gt; 0)</span></span>
<span class="line"><span>      memberStruct.set(REBALANCE_TIMEOUT_KEY, memberMetadata.rebalanceTimeoutMs)</span></span>
<span class="line"><span>    // 写入用于静态消费者组管理的Group Instance ID</span></span>
<span class="line"><span>    if (version &amp;gt;= 3)</span></span>
<span class="line"><span>      memberStruct.set(GROUP_INSTANCE_ID_KEY, memberMetadata.groupInstanceId.orNull)</span></span>
<span class="line"><span>    // 必须定义分区分配策略，否则抛出异常</span></span>
<span class="line"><span>    val protocol = groupMetadata.protocolName.orNull</span></span>
<span class="line"><span>    if (protocol == null)</span></span>
<span class="line"><span>      throw new IllegalStateException(&quot;Attempted to write non-empty group metadata with no defined protocol&quot;)</span></span>
<span class="line"><span>    // 写入成员消费订阅信息</span></span>
<span class="line"><span>    val metadata = memberMetadata.metadata(protocol)</span></span>
<span class="line"><span>    memberStruct.set(SUBSCRIPTION_KEY, ByteBuffer.wrap(metadata))</span></span>
<span class="line"><span>    val memberAssignment = assignment(memberMetadata.memberId)</span></span>
<span class="line"><span>    assert(memberAssignment != null)</span></span>
<span class="line"><span>    // 写入成员消费分配信息</span></span>
<span class="line"><span>    memberStruct.set(ASSIGNMENT_KEY, ByteBuffer.wrap(memberAssignment))</span></span>
<span class="line"><span>    memberStruct</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  value.set(MEMBERS_KEY, memberArray.toArray)</span></span>
<span class="line"><span>  // 向Buffer依次写入版本信息和以上写入的元数据信息</span></span>
<span class="line"><span>  val byteBuffer = ByteBuffer.allocate(2 /* version */ + value.sizeOf)</span></span>
<span class="line"><span>  byteBuffer.putShort(version)</span></span>
<span class="line"><span>  value.writeTo(byteBuffer)</span></span>
<span class="line"><span>  // 返回Buffer底层的字节数组</span></span>
<span class="line"><span>  byteBuffer.array()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码比较长，我结合一张图来帮助你理解这个方法的执行逻辑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/032bdb247859f796a5ca21c3db710007.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/032bdb247859f796a5ca21c3db710007.jpg" alt=""></a></p><p>第1步，代码根据传入的apiVersion字段，确定要使用哪个格式版本，并创建对应版本的结构体（Struct）来保存这些元数据。apiVersion的取值是Broker端参数inter.broker.protocol.version的值。你打开Kafka官网的话，就可以看到，这个参数的值永远指向当前最新的Kafka版本。</p><p>第2步，代码依次向结构体写入消费者组的协议类型（Protocol Type）、Generation ID、分区分配策略（Protocol Name）和Leader成员ID。在学习GroupMetadata时，我说过，对于普通的消费者组而言，协议类型就是&quot;consumer&quot;字符串，分区分配策略可能是&quot;range&quot;&quot;round-robin&quot;等。之后，代码还会为格式版本≥2的结构体，写入消费者组状态最近一次变更的时间戳。</p><p>第3步，遍历消费者组的所有成员，为每个成员构建专属的结构体对象，并依次向结构体写入成员的ID、Client ID、主机名以及会话超时时间信息。对于格式版本≥0的结构体，代码要写入成员配置的Rebalance超时时间，而对于格式版本≥3的结构体，代码还要写入用于静态消费者组管理的Group Instance ID。待这些都做完之后，groupMetadataValue方法必须要确保消费者组选出了分区分配策略，否则就抛出异常。再之后，方法依次写入成员消费订阅信息和成员消费分配信息。</p><p>第4步，代码向Buffer依次写入版本信息和刚刚说到的写入的元数据信息，并返回Buffer底层的字节数组。至此，方法逻辑结束。</p><p>关于注册消息Key和Value的内容，我就介绍完了。为了帮助你更直观地理解注册消息到底包含了什么数据，我再用一张图向你展示一下它们的构成。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/4d5ecbdc21d5bb29d054443e31eab28f.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/4d5ecbdc21d5bb29d054443e31eab28f.jpg" alt=""></a></p><p>这张图完整地总结了groupMetadataKey和groupMetadataValue方法要生成的注册消息内容。灰色矩形中的字段表示可选字段，有可能不会包含在Value中。</p><h3 id="已提交位移消息" tabindex="-1">已提交位移消息 <a class="header-anchor" href="#已提交位移消息" aria-label="Permalink to &quot;已提交位移消息&quot;">​</a></h3><p>接下来，我们再学习一下提交位移消息的Key和Value构成。</p><p>OffsetKey类定义了提交位移消息的Key值，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class OffsetKey(version: Short, key: GroupTopicPartition) extends BaseKey {</span></span>
<span class="line"><span>  override def toString: String = key.toString</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可见，这类消息的Key是一个GroupTopicPartition类型，也就是&lt;消费者组名，主题，分区号&gt;三元组。</p><p>offsetCommitKey方法负责将这个三元组转换成字节数组，用于后续构造提交位移消息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def offsetCommitKey(</span></span>
<span class="line"><span>  group: String,  // 消费者组名</span></span>
<span class="line"><span>  topicPartition: TopicPartition // 主题 + 分区号</span></span>
<span class="line"><span>): Array[Byte] = {</span></span>
<span class="line"><span>  // 创建结构体，依次写入消费者组名、主题和分区号</span></span>
<span class="line"><span>  val key = new Struct(CURRENT_OFFSET_KEY_SCHEMA)</span></span>
<span class="line"><span>  key.set(OFFSET_KEY_GROUP_FIELD, group)</span></span>
<span class="line"><span>  key.set(OFFSET_KEY_TOPIC_FIELD, topicPartition.topic)</span></span>
<span class="line"><span>  key.set(OFFSET_KEY_PARTITION_FIELD, topicPartition.partition)</span></span>
<span class="line"><span>  // 构造ByteBuffer，写入格式版本和结构体</span></span>
<span class="line"><span>  val byteBuffer = ByteBuffer.allocate(2 /* version */ + key.sizeOf)</span></span>
<span class="line"><span>  byteBuffer.putShort(CURRENT_OFFSET_KEY_SCHEMA_VERSION)</span></span>
<span class="line"><span>  key.writeTo(byteBuffer)</span></span>
<span class="line"><span>  // 返回字节数组</span></span>
<span class="line"><span>  byteBuffer.array()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法接收三元组中的数据，然后创建一个结构体对象，依次写入消费者组名、主题和分区号。接下来，构造ByteBuffer，写入格式版本和结构体，最后返回它底层的字节数组。</p><p>说完了Key，我们看下Value的定义。</p><p>offsetCommitValue方法决定了Value中都有哪些元素，我们一起看下它的代码。这里，我只列出了最新版本对应的结构体对象，其他版本要写入的元素大同小异，课下你可以阅读下其他版本的结构体内容，也就是我省略的if分支下的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def offsetCommitValue(offsetAndMetadata: OffsetAndMetadata,</span></span>
<span class="line"><span>                      apiVersion: ApiVersion): Array[Byte] = {</span></span>
<span class="line"><span>  // 确定消息格式版本以及创建对应的结构体对象</span></span>
<span class="line"><span>  val (version, value) = {</span></span>
<span class="line"><span>    if (......) {</span></span>
<span class="line"><span>      ......</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      val value = new Struct(OFFSET_COMMIT_VALUE_SCHEMA_V3)</span></span>
<span class="line"><span>      // 依次写入位移值、Leader Epoch值、自定义元数据以及时间戳</span></span>
<span class="line"><span>      value.set(</span></span>
<span class="line"><span>        OFFSET_VALUE_OFFSET_FIELD_V3, offsetAndMetadata.offset)</span></span>
<span class="line"><span>      value.set(OFFSET_VALUE_LEADER_EPOCH_FIELD_V3,</span></span>
<span class="line"><span> offsetAndMetadata.leaderEpoch.orElse(RecordBatch.NO_PARTITION_LEADER_EPOCH))</span></span>
<span class="line"><span>      value.set(OFFSET_VALUE_METADATA_FIELD_V3, offsetAndMetadata.metadata)</span></span>
<span class="line"><span>      value.set(OFFSET_VALUE_COMMIT_TIMESTAMP_FIELD_V3, offsetAndMetadata.commitTimestamp)</span></span>
<span class="line"><span>(3, value)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 构建ByteBuffer，写入消息格式版本和结构体</span></span>
<span class="line"><span>  val byteBuffer = ByteBuffer.allocate(2 /* version */ + value.sizeOf)</span></span>
<span class="line"><span>  byteBuffer.putShort(version.toShort)</span></span>
<span class="line"><span>  value.writeTo(byteBuffer)</span></span>
<span class="line"><span>  // 返回ByteBuffer底层字节数组</span></span>
<span class="line"><span>  byteBuffer.array()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>offsetCommitValue方法首先确定消息格式版本以及创建对应的结构体对象。对于当前最新版本V3而言，结构体的元素包括位移值、Leader Epoch值、自定义元数据和时间戳。如果我们使用Java Consumer API的话，那么，在提交位移时，这个自定义元数据一般是空。</p><p>接下来，构建ByteBuffer，写入消息格式版本和结构体。</p><p>最后，返回ByteBuffer底层字节数组。</p><p>与注册消息的消息体相比，提交位移消息的Value要简单得多。我再用一张图展示一下提交位移消息的Key、Value构成。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/90f52b9fbf2b8daced15717aafdd24bd.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/90f52b9fbf2b8daced15717aafdd24bd.jpg" alt=""></a></p><h3 id="tombstone消息" tabindex="-1">Tombstone消息 <a class="header-anchor" href="#tombstone消息" aria-label="Permalink to &quot;Tombstone消息&quot;">​</a></h3><p>关于位移主题，Kafka源码中还存在一类消息，那就是Tombstone消息。其实，它并没有任何稀奇之处，就是Value为null的消息。因此，注册消息和提交位移消息都有对应的Tombstone消息。这个消息的主要作用，是让Kafka识别哪些Key对应的消息是可以被删除的，有了它，Kafka就能保证，内部位移主题不会持续增加磁盘占用空间。</p><p>你可以看下下面两行代码，它们分别表示两类消息对应的Tombstone消息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 提交位移消息对应的Tombstone消息</span></span>
<span class="line"><span>tombstones += new SimpleRecord(timestamp, commitKey, null)</span></span>
<span class="line"><span>// 注册消息对应的Tombstone消息</span></span>
<span class="line"><span>tombstones += new SimpleRecord(timestamp, groupMetadataKey, null)</span></span></code></pre></div><p>无论是哪类消息， <strong>它们的Value字段都是null</strong>。一旦注册消息中出现了Tombstone消息，就表示Kafka可以将该消费者组元数据从位移主题中删除；一旦提交位移消息中出现了Tombstone，就表示Kafka能够将该消费者组在某主题分区上的位移提交数据删除。</p><h2 id="如何确定coordinator" tabindex="-1">如何确定Coordinator？ <a class="header-anchor" href="#如何确定coordinator" aria-label="Permalink to &quot;如何确定Coordinator？&quot;">​</a></h2><p>接下来，我们要再学习一下位移主题和消费者组Coordinator之间的关系。 <strong>Coordinator组件是操作位移主题的唯一组件，它在内部对位移主题进行读写操作</strong>。</p><p>每个Broker在启动时，都会启动Coordinator组件，但是，一个消费者组只能被一个Coordinator组件所管理。Kafka是如何确定哪台Broker上的Coordinator组件为消费者组服务呢？答案是，位移主题某个特定分区Leader副本所在的Broker被选定为指定消费者组的Coordinator。</p><p>那么，这个特定分区是怎么计算出来的呢？我们来看GroupMetadataManager类的partitionFor方法代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def partitionFor(groupId: String): Int = Utils.abs(groupId.hashCode) % groupMetadataTopicPartitionCount</span></span></code></pre></div><p>看到了吧，消费者组名哈希值与位移主题分区数求模的绝对值结果，就是该消费者组要写入位移主题的目标分区。</p><p>假设位移主题默认是50个分区，我们的消费者组名是“testgroup”，因此，Math.abs(“testgroup”.hashCode % 50)的结果是27，那么，目标分区号就是27。也就是说，这个消费者组的注册消息和提交位移消息都会写入到位移主题的分区27中，而分区27的Leader副本所在的Broker，就成为该消费者组的Coordinator。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>Kafka内部位移主题，是Coordinator端用来保存和记录消费者组信息的重要工具。具体而言，消费者组信息包括消费者组元数据以及已提交位移，它们分别对应于我们今天讲的位移主题中的注册消息和已提交位移消息。前者定义了消费者组的元数据信息，包括组名、成员列表和分区消费分配方案；后者则是消费者组各个成员提交的位移值。这两部分信息共同构成了位移主题的消息类型。</p><p>除了消息类型，我还介绍了消费者组确定Coordinator端的代码。明白了这一点，下次你的消费者组成员出现问题的时候，你就会知道，要去哪台Broker上去查找相应的日志了。</p><p>我们来回顾一下这节课的重点。</p><ul><li>位移主题：即__consumer_offsets。该主题是内部主题，默认有50个分区，Kafka负责将其创建出来，因此你不需要亲自执行创建主题操作。</li><li>消息类型：位移主题分为注册消息和已提交位移消息。</li><li>Tombstone消息：Value为null的位移主题消息，用于清除消费者组已提交的位移值和注册信息。</li><li>Coordinator确认原则：消费者组名的哈希值与位移主题分区数求模的绝对值，即为目标分区，目标分区Leader副本所在的Broker即为Coordinator。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/03843d5742157064dbb8bd227b9fb7e8.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/257019/03843d5742157064dbb8bd227b9fb7e8.jpg" alt=""></a></p><p>定义了消息格式，明确了Coordinator，下一步，就是Coordinator对位移主题进行读写操作了。具体来说，就是构建今天我们所学的两类消息，并将其序列化成字节数组，写入到位移主题，以及从位移主题中读取出字节数组，并反序列化成对应的消息类型。下节课，我们一起研究下这个问题。</p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>请你根据今天的内容，用kafka-console-consumer脚本去读取一下你线上环境中位移主题的已提交位移消息，并结合readOffsetMessageValue方法的源码，说一下输出中的每个字段都是什么含义。</p><p>欢迎在留言区写下你的思考和答案，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,78)])])}const f=s(t,[["render",l]]);export{g as __pageData,f as default};
