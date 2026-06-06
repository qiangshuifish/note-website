import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const B=JSON.parse('{"title":"15 | 如何理解Controller在Kafka集群中的作用？","description":"","frontmatter":{},"headers":[{"level":2,"title":"集群成员管理","slug":"集群成员管理","link":"#集群成员管理","children":[{"level":3,"title":"成员数量管理","slug":"成员数量管理","link":"#成员数量管理","children":[]},{"level":3,"title":"成员信息管理","slug":"成员信息管理","link":"#成员信息管理","children":[]}]},{"level":2,"title":"主题管理","slug":"主题管理","link":"#主题管理","children":[{"level":3,"title":"主题创建/变更","slug":"主题创建-变更","link":"#主题创建-变更","children":[]},{"level":3,"title":"主题删除","slug":"主题删除","link":"#主题删除","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后讨论","slug":"课后讨论","link":"#课后讨论","children":[]}],"relativePath":"Kafka核心源码解读/15-如何理解Controller在Kafka集群中的作用？.md","filePath":"Kafka核心源码解读/15-如何理解Controller在Kafka集群中的作用？.md","lastUpdated":1779815932000}'),o={name:"Kafka核心源码解读/15-如何理解Controller在Kafka集群中的作用？.md"};function r(l,n,t,i,c,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_15-如何理解controller在kafka集群中的作用" tabindex="-1">15 | 如何理解Controller在Kafka集群中的作用？ <a class="header-anchor" href="#_15-如何理解controller在kafka集群中的作用" aria-label="Permalink to &quot;15 | 如何理解Controller在Kafka集群中的作用？&quot;">​</a></h1><p>你好，我是胡夕。</p><p>上节课，我们学习了Controller选举的源码，了解了Controller组件的选举触发场景，以及它是如何被选举出来的。Controller就绪之后，就会行使它作为控制器的重要权利了，包括管理集群成员、维护主题、操作元数据，等等。</p><p>之前在学习Kafka的时候，我一直很好奇，新启动的Broker是如何加入到集群中的。官方文档里的解释是：“Adding servers to a Kafka cluster is easy, just assign them a unique broker id and start up Kafka on your new servers.”显然，你只要启动Broker进程，就可以实现集群的扩展，甚至包括集群元数据信息的同步。</p><p>不过，你是否思考过，这一切是怎么做到的呢？其实，这就是Controller组件源码提供的一个重要功能：管理新集群成员。</p><p>当然，作为核心组件，Controller提供的功能非常多。除了集群成员管理，主题管理也是一个极其重要的功能。今天，我就带你深入了解下它们的实现代码。可以说，这是Controller最核心的两个功能，它们几乎涉及到了集群元数据中的所有重要数据。掌握了这些，之后你在探索Controller的其他代码时，会更加游刃有余。</p><h2 id="集群成员管理" tabindex="-1">集群成员管理 <a class="header-anchor" href="#集群成员管理" aria-label="Permalink to &quot;集群成员管理&quot;">​</a></h2><p>首先，我们来看Controller管理集群成员部分的代码。这里的成员管理包含两个方面：</p><ol><li>成员数量的管理，主要体现在新增成员和移除现有成员；</li><li>单个成员的管理，如变更单个Broker的数据等。</li></ol><h3 id="成员数量管理" tabindex="-1">成员数量管理 <a class="header-anchor" href="#成员数量管理" aria-label="Permalink to &quot;成员数量管理&quot;">​</a></h3><p>每个Broker在启动的时候，会在ZooKeeper的/brokers/ids节点下创建一个名为broker.id参数值的临时节点。</p><p>举个例子，假设Broker的broker.id参数值设置为1001，那么，当Broker启动后，你会在ZooKeeper的/brokers/ids下观测到一个名为1001的子节点。该节点的内容包括了Broker配置的主机名、端口号以及所用监听器的信息（注意：这里的监听器和上面说的ZooKeeper监听器不是一回事）。</p><p>当该Broker正常关闭或意外退出时，ZooKeeper上对应的临时节点会自动消失。</p><p>基于这种临时节点的机制，Controller定义了BrokerChangeHandler监听器，专门负责监听/brokers/ids下的子节点数量变化。</p><p>一旦发现新增或删除Broker，/brokers/ids下的子节点数目一定会发生变化。这会被Controller侦测到，进而触发BrokerChangeHandler的处理方法，即handleChildChange方法。</p><p>我给出BrokerChangeHandler的代码。可以看到，这里面定义了handleChildChange方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class BrokerChangeHandler(eventManager: ControllerEventManager) extends ZNodeChildChangeHandler {</span></span>
<span class="line"><span>  // Broker ZooKeeper ZNode: /brokers/ids</span></span>
<span class="line"><span>  override val path: String = BrokerIdsZNode.path</span></span>
<span class="line"><span>  override def handleChildChange(): Unit = {</span></span>
<span class="line"><span>    eventManager.put(BrokerChange) // 仅仅是向事件队列写入BrokerChange事件</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法的作用就是向Controller事件队列写入一个BrokerChange事件。 <strong>事实上，Controller端定义的所有Handler的处理逻辑，都是向事件队列写入相应的ControllerEvent，真正的事件处理逻辑位于KafkaController类的process方法中。</strong></p><p>那么，接下来，我们就来看process方法。你会发现，处理BrokerChange事件的方法实际上是processBrokerChange，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def processBrokerChange(): Unit = {</span></span>
<span class="line"><span>  // 如果该Broker不是Controller，自然无权处理，直接返回</span></span>
<span class="line"><span>  if (!isActive) return</span></span>
<span class="line"><span>  // 第1步：从ZooKeeper中获取集群Broker列表</span></span>
<span class="line"><span>  val curBrokerAndEpochs = zkClient.getAllBrokerAndEpochsInCluster</span></span>
<span class="line"><span>  val curBrokerIdAndEpochs = curBrokerAndEpochs map { case (broker, epoch) =&amp;gt; (broker.id, epoch) }</span></span>
<span class="line"><span>  val curBrokerIds = curBrokerIdAndEpochs.keySet</span></span>
<span class="line"><span>  // 第2步：获取Controller当前保存的Broker列表</span></span>
<span class="line"><span>  val liveOrShuttingDownBrokerIds = controllerContext.liveOrShuttingDownBrokerIds</span></span>
<span class="line"><span>  // 第3步：比较两个列表，获取新增Broker列表、待移除Broker列表、</span></span>
<span class="line"><span>  // 已重启Broker列表和当前运行中的Broker列表</span></span>
<span class="line"><span>  val newBrokerIds = curBrokerIds.diff(liveOrShuttingDownBrokerIds)</span></span>
<span class="line"><span>  val deadBrokerIds = liveOrShuttingDownBrokerIds.diff(curBrokerIds)</span></span>
<span class="line"><span>  val bouncedBrokerIds = (curBrokerIds &amp; liveOrShuttingDownBrokerIds)</span></span>
<span class="line"><span>    .filter(brokerId =&amp;gt; curBrokerIdAndEpochs(brokerId) &amp;gt; controllerContext.liveBrokerIdAndEpochs(brokerId))</span></span>
<span class="line"><span>  val newBrokerAndEpochs = curBrokerAndEpochs.filter { case (broker, _) =&amp;gt; newBrokerIds.contains(broker.id) }</span></span>
<span class="line"><span>  val bouncedBrokerAndEpochs = curBrokerAndEpochs.filter { case (broker, _) =&amp;gt; bouncedBrokerIds.contains(broker.id) }</span></span>
<span class="line"><span>  val newBrokerIdsSorted = newBrokerIds.toSeq.sorted</span></span>
<span class="line"><span>  val deadBrokerIdsSorted = deadBrokerIds.toSeq.sorted</span></span>
<span class="line"><span>  val liveBrokerIdsSorted = curBrokerIds.toSeq.sorted</span></span>
<span class="line"><span>  val bouncedBrokerIdsSorted = bouncedBrokerIds.toSeq.sorted</span></span>
<span class="line"><span>  info(s&quot;Newly added brokers: \${newBrokerIdsSorted.mkString(&quot;,&quot;)}, &quot; +</span></span>
<span class="line"><span>    s&quot;deleted brokers: \${deadBrokerIdsSorted.mkString(&quot;,&quot;)}, &quot; +</span></span>
<span class="line"><span>    s&quot;bounced brokers: \${bouncedBrokerIdsSorted.mkString(&quot;,&quot;)}, &quot; +</span></span>
<span class="line"><span>    s&quot;all live brokers: \${liveBrokerIdsSorted.mkString(&quot;,&quot;)}&quot;)</span></span>
<span class="line"><span>  // 第4步：为每个新增Broker创建与之连接的通道管理器和</span></span>
<span class="line"><span>  // 底层的请求发送线程（RequestSendThread）</span></span>
<span class="line"><span>  newBrokerAndEpochs.keySet.foreach(</span></span>
<span class="line"><span>    controllerChannelManager.addBroker)</span></span>
<span class="line"><span>  // 第5步：为每个已重启的Broker移除它们现有的配套资源</span></span>
<span class="line"><span>  //（通道管理器、RequestSendThread等），并重新添加它们</span></span>
<span class="line"><span>  bouncedBrokerIds.foreach(controllerChannelManager.removeBroker)</span></span>
<span class="line"><span>  bouncedBrokerAndEpochs.keySet.foreach(</span></span>
<span class="line"><span>    controllerChannelManager.addBroker)</span></span>
<span class="line"><span>  // 第6步：为每个待移除Broker移除对应的配套资源</span></span>
<span class="line"><span>  deadBrokerIds.foreach(controllerChannelManager.removeBroker)</span></span>
<span class="line"><span>  // 第7步：为新增Broker执行更新Controller元数据和Broker启动逻辑</span></span>
<span class="line"><span>  if (newBrokerIds.nonEmpty) {</span></span>
<span class="line"><span>    controllerContext.addLiveBrokers(newBrokerAndEpochs)</span></span>
<span class="line"><span>    onBrokerStartup(newBrokerIdsSorted)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 第8步：为已重启Broker执行重添加逻辑，包含</span></span>
<span class="line"><span>  // 更新ControllerContext、执行Broker重启动逻辑</span></span>
<span class="line"><span>  if (bouncedBrokerIds.nonEmpty) {</span></span>
<span class="line"><span>    controllerContext.removeLiveBrokers(bouncedBrokerIds)</span></span>
<span class="line"><span>    onBrokerFailure(bouncedBrokerIdsSorted)</span></span>
<span class="line"><span>    controllerContext.addLiveBrokers(bouncedBrokerAndEpochs)</span></span>
<span class="line"><span>    onBrokerStartup(bouncedBrokerIdsSorted)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 第9步：为待移除Broker执行移除ControllerContext和Broker终止逻辑</span></span>
<span class="line"><span>  if (deadBrokerIds.nonEmpty) {</span></span>
<span class="line"><span>    controllerContext.removeLiveBrokers(deadBrokerIds)</span></span>
<span class="line"><span>    onBrokerFailure(deadBrokerIdsSorted)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (newBrokerIds.nonEmpty || deadBrokerIds.nonEmpty ||</span></span>
<span class="line"><span>   bouncedBrokerIds.nonEmpty) {</span></span>
<span class="line"><span>    info(s&quot;Updated broker epochs cache: \${controllerContext.liveBrokerIdAndEpochs}&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码有点长，你可以看下我添加的重点注释。同时，我再画一张图，帮你梳理下这个方法做的事情。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/239512/fffc8456d8ede9219462e607fa4241d3.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/239512/fffc8456d8ede9219462e607fa4241d3.jpg" alt=""></a></p><p>整个方法共有9步。</p><p>第1~3步：</p><p>前两步分别是从ZooKeeper和ControllerContext中获取Broker列表；第3步是获取4个Broker列表：新增Broker列表、待移除Broker列表、已重启的Broker列表和当前运行中的Broker列表。</p><p>假设前两步中的Broker列表分别用A和B表示，由于Kafka以ZooKeeper上的数据为权威数据，因此，A就是最新的运行中Broker列表，“A-B”就表示新增的Broker，“B-A”就表示待移除的Broker。</p><p>已重启的Broker的判断逻辑要复杂一些，它判断的是A∧B集合中的那些Epoch值变更了的Broker。你大体上可以把Epoch值理解为Broker的版本或重启的次数。显然，Epoch值变更了，就说明Broker发生了重启行为。</p><p>第4~9步：</p><p>拿到这些集合之后，Controller会分别为这4个Broker列表执行相应的操作，也就是这个方法中第4~9步要做的事情。总体上，这些相应的操作分为3类。</p><ul><li>执行元数据更新操作：调用ControllerContext类的各个方法，更新不同的集群元数据信息。比如需要将新增Broker加入到集群元数据，将待移除Broker从元数据中移除等。</li><li>执行Broker终止操作：为待移除Broker和已重启Broker调用onBrokerFailure方法。</li><li>执行Broker启动操作：为已重启Broker和新增Broker调用onBrokerStartup方法。</li></ul><p>下面我们深入了解下onBrokerFailure和onBrokerStartup方法的逻辑。相比于其他方法，这两个方法的代码逻辑有些复杂，要做的事情也很多，因此，我们重点研究下它们。</p><p>首先是处理Broker终止逻辑的onBrokerFailure方法，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def onBrokerFailure(deadBrokers: Seq[Int]): Unit = {</span></span>
<span class="line"><span>  info(s&quot;Broker failure callback for \${deadBrokers.mkString(&quot;,&quot;)}&quot;)</span></span>
<span class="line"><span>  // 第1步：为每个待移除Broker，删除元数据对象中的相关项</span></span>
<span class="line"><span>  deadBrokers.foreach(controllerContext.replicasOnOfflineDirs.remove</span></span>
<span class="line"><span>  // 第2步：将待移除Broker从元数据对象中处于已关闭状态的Broker列表中去除</span></span>
<span class="line"><span>  val deadBrokersThatWereShuttingDown =</span></span>
<span class="line"><span>    deadBrokers.filter(id =&amp;gt; controllerContext.shuttingDownBrokerIds.remove(id))</span></span>
<span class="line"><span>  if (deadBrokersThatWereShuttingDown.nonEmpty)</span></span>
<span class="line"><span>    info(s&quot;Removed \${deadBrokersThatWereShuttingDown.mkString(&quot;,&quot;)} from list of shutting down brokers.&quot;)</span></span>
<span class="line"><span>  // 第3步：找出待移除Broker上的所有副本对象，执行相应操作，</span></span>
<span class="line"><span>  // 将其置为“不可用状态”（即Offline）</span></span>
<span class="line"><span>  val allReplicasOnDeadBrokers = controllerContext.replicasOnBrokers(deadBrokers.toSet)</span></span>
<span class="line"><span>  onReplicasBecomeOffline(allReplicasOnDeadBrokers)</span></span>
<span class="line"><span>  // 第4步：注销注册的BrokerModificationsHandler监听器</span></span>
<span class="line"><span>  unregisterBrokerModificationsHandler(deadBrokers)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Broker终止，意味着我们必须要删除Controller元数据缓存中与之相关的所有项，还要处理这些Broker上保存的副本。最后，我们还要注销之前为该Broker注册的BrokerModificationsHandler监听器。</p><p>其实，主体逻辑在于如何处理Broker上的副本对象，即onReplicasBecomeOffline方法。该方法大量调用了Kafka副本管理器和分区管理器的相关功能，后面我们会专门学习这两个管理器，因此这里我就不展开讲了。</p><p>现在，我们看onBrokerStartup方法。它是处理Broker启动的方法，也就是Controller端应对集群新增Broker启动的方法。同样，我先给出带注释的完整方法代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def onBrokerStartup(newBrokers: Seq[Int]): Unit = {</span></span>
<span class="line"><span>  info(s&quot;New broker startup callback for \${newBrokers.mkString(&quot;,&quot;)}&quot;)</span></span>
<span class="line"><span>  // 第1步：移除元数据中新增Broker对应的副本集合</span></span>
<span class="line"><span>  newBrokers.foreach(controllerContext.replicasOnOfflineDirs.remove)</span></span>
<span class="line"><span>  val newBrokersSet = newBrokers.toSet</span></span>
<span class="line"><span>  val existingBrokers = controllerContext.</span></span>
<span class="line"><span>    liveOrShuttingDownBrokerIds.diff(newBrokersSet)</span></span>
<span class="line"><span>  // 第2步：给集群现有Broker发送元数据更新请求，令它们感知到新增Broker的到来</span></span>
<span class="line"><span>  sendUpdateMetadataRequest(existingBrokers.toSeq, Set.empty)</span></span>
<span class="line"><span>  // 第3步：给新增Broker发送元数据更新请求，令它们同步集群当前的所有分区数据</span></span>
<span class="line"><span>  sendUpdateMetadataRequest(newBrokers, controllerContext.partitionLeadershipInfo.keySet)</span></span>
<span class="line"><span>  val allReplicasOnNewBrokers = controllerContext.replicasOnBrokers(newBrokersSet)</span></span>
<span class="line"><span>  // 第4步：将新增Broker上的所有副本设置为Online状态，即可用状态</span></span>
<span class="line"><span>  replicaStateMachine.handleStateChanges(</span></span>
<span class="line"><span>    allReplicasOnNewBrokers.toSeq, OnlineReplica)</span></span>
<span class="line"><span>  partitionStateMachine.triggerOnlinePartitionStateChange()</span></span>
<span class="line"><span>  // 第5步：重启之前暂停的副本迁移操作</span></span>
<span class="line"><span>  maybeResumeReassignments { (_, assignment) =&amp;gt;</span></span>
<span class="line"><span>    assignment.targetReplicas.exists(newBrokersSet.contains)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  val replicasForTopicsToBeDeleted = allReplicasOnNewBrokers.filter(p =&amp;gt; topicDeletionManager.isTopicQueuedUpForDeletion(p.topic))</span></span>
<span class="line"><span>  // 第6步：重启之前暂停的主题删除操作</span></span>
<span class="line"><span>  if (replicasForTopicsToBeDeleted.nonEmpty) {</span></span>
<span class="line"><span>    info(s&quot;Some replicas \${replicasForTopicsToBeDeleted.mkString(&quot;,&quot;)} for topics scheduled for deletion &quot; +</span></span>
<span class="line"><span>      s&quot;\${controllerContext.topicsToBeDeleted.mkString(&quot;,&quot;)} are on the newly restarted brokers &quot; +</span></span>
<span class="line"><span>      s&quot;\${newBrokers.mkString(&quot;,&quot;)}. Signaling restart of topic deletion for these topics&quot;)</span></span>
<span class="line"><span>   topicDeletionManager.resumeDeletionForTopics(</span></span>
<span class="line"><span>     replicasForTopicsToBeDeleted.map(_.topic))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 第7步：为新增Broker注册BrokerModificationsHandler监听器</span></span>
<span class="line"><span>  registerBrokerModificationsHandler(newBrokers)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如代码所示，第1步是移除新增Broker在元数据缓存中的信息。你可能会问：“这些Broker不都是新增的吗？元数据缓存中有它们的数据吗？”实际上，这里的newBrokers仅仅表示新启动的Broker，它们不一定是全新的Broker。因此，这里的删除元数据缓存是非常安全的做法。</p><p>第2、3步：分别给集群的已有Broker和新增Broker发送更新元数据请求。这样一来，整个集群上的Broker就可以互相感知到彼此，而且最终所有的Broker都能保存相同的分区数据。</p><p>第4步：将新增Broker上的副本状态置为Online状态。Online状态表示这些副本正常提供服务，即Leader副本对外提供读写服务，Follower副本自动向Leader副本同步消息。</p><p>第5、6步：分别重启可能因为新增Broker启动、而能够重新被执行的副本迁移和主题删除操作。</p><p>第7步：为所有新增Broker注册BrokerModificationsHandler监听器，允许Controller监控它们在ZooKeeper上的节点的数据变更。</p><h3 id="成员信息管理" tabindex="-1">成员信息管理 <a class="header-anchor" href="#成员信息管理" aria-label="Permalink to &quot;成员信息管理&quot;">​</a></h3><p>了解了Controller管理集群成员数量的机制之后，接下来，我们要重点学习下Controller如何监听Broker端信息的变更，以及具体的操作。</p><p>和管理集群成员类似，Controller也是通过ZooKeeper监听器的方式来应对Broker的变化。这个监听器就是BrokerModificationsHandler。一旦Broker的信息发生变更，该监听器的handleDataChange方法就会被调用，向事件队列写入BrokerModifications事件。</p><p>KafkaController类的processBrokerModification方法负责处理这类事件，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def processBrokerModification(brokerId: Int): Unit = {</span></span>
<span class="line"><span>  if (!isActive) return</span></span>
<span class="line"><span>  // 第1步：获取目标Broker的详细数据，</span></span>
<span class="line"><span>  // 包括每套监听器配置的主机名、端口号以及所使用的安全协议等</span></span>
<span class="line"><span>  val newMetadataOpt = zkClient.getBroker(brokerId)</span></span>
<span class="line"><span>  // 第2步：从元数据缓存中获得目标Broker的详细数据</span></span>
<span class="line"><span>  val oldMetadataOpt = controllerContext.liveOrShuttingDownBroker(brokerId)</span></span>
<span class="line"><span>  if (newMetadataOpt.nonEmpty &amp;&amp; oldMetadataOpt.nonEmpty) {</span></span>
<span class="line"><span>    val oldMetadata = oldMetadataOpt.get</span></span>
<span class="line"><span>    val newMetadata = newMetadataOpt.get</span></span>
<span class="line"><span>    // 第3步：如果两者不相等，说明Broker数据发生了变更</span></span>
<span class="line"><span>    // 那么，更新元数据缓存，以及执行onBrokerUpdate方法处理Broker更新的逻辑</span></span>
<span class="line"><span>    if (newMetadata.endPoints != oldMetadata.endPoints) {</span></span>
<span class="line"><span>      info(s&quot;Updated broker metadata: $oldMetadata -&amp;gt; $newMetadata&quot;)</span></span>
<span class="line"><span>      controllerContext.updateBrokerMetadata(oldMetadata, newMetadata)</span></span>
<span class="line"><span>      onBrokerUpdate(brokerId)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法首先获取ZooKeeper上最权威的Broker数据，将其与元数据缓存上的数据进行比对。如果发现两者不一致，就会更新元数据缓存，同时调用onBrokerUpdate方法执行更新逻辑。</p><p>那么，onBrokerUpdate方法又是如何实现的呢？我们先看下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def onBrokerUpdate(updatedBrokerId: Int): Unit = {</span></span>
<span class="line"><span>  info(s&quot;Broker info update callback for $updatedBrokerId&quot;)</span></span>
<span class="line"><span>  // 给集群所有Broker发送UpdateMetadataRequest，让她它们去更新元数据</span></span>
<span class="line"><span>  sendUpdateMetadataRequest(</span></span>
<span class="line"><span>    controllerContext.liveOrShuttingDownBrokerIds.toSeq, Set.empty)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，onBrokerUpdate就是向集群所有Broker发送更新元数据信息请求，把变更信息广播出去。</p><p>怎么样，应对Broker信息变更的方法还是比较简单的吧？</p><h2 id="主题管理" tabindex="-1">主题管理 <a class="header-anchor" href="#主题管理" aria-label="Permalink to &quot;主题管理&quot;">​</a></h2><p>除了维护集群成员之外，Controller还有一个重要的任务，那就是对所有主题进行管理，主要包括主题的创建、变更与删除。</p><p>掌握了前面集群成员管理的方法，在学习下面的内容时会轻松很多。因为它们的实现机制是一脉相承的，几乎没有任何差异。</p><h3 id="主题创建-变更" tabindex="-1">主题创建/变更 <a class="header-anchor" href="#主题创建-变更" aria-label="Permalink to &quot;主题创建/变更&quot;">​</a></h3><p>我们重点学习下主题是如何被创建的。实际上，主题变更与创建是相同的逻辑，因此，源码使用了一套监听器统一处理这两种情况。</p><p>你一定使用过Kafka的kafka-topics脚本或AdminClient创建主题吧？实际上，这些工具仅仅是向ZooKeeper对应的目录下写入相应的数据而已，那么，Controller，或者说Kafka集群是如何感知到新创建的主题的呢？</p><p>这当然要归功于监听主题路径的ZooKeeper监听器：TopicChangeHandler。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TopicChangeHandler(eventManager: ControllerEventManager) extends ZNodeChildChangeHandler {</span></span>
<span class="line"><span>  // ZooKeeper节点：/brokers/topics</span></span>
<span class="line"><span>  override val path: String = TopicsZNode.path</span></span>
<span class="line"><span>  // 向事件队列写入TopicChange事件</span></span>
<span class="line"><span>  override def handleChildChange(): Unit = eventManager.put(TopicChange)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码中的TopicsZNode.path就是ZooKeeper下/brokers/topics节点。一旦该节点下新增了主题信息，该监听器的handleChildChange就会被触发，Controller通过ControllerEventManager对象，向事件队列写入TopicChange事件。</p><p>KafkaController的process方法接到该事件后，调用processTopicChange方法执行主题创建。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def processTopicChange(): Unit = {</span></span>
<span class="line"><span>  if (!isActive) return</span></span>
<span class="line"><span>  // 第1步：从ZooKeeper中获取所有主题</span></span>
<span class="line"><span>  val topics = zkClient.getAllTopicsInCluster(true)</span></span>
<span class="line"><span>  // 第2步：与元数据缓存比对，找出新增主题列表与已删除主题列表</span></span>
<span class="line"><span>  val newTopics = topics -- controllerContext.allTopics</span></span>
<span class="line"><span>  val deletedTopics = controllerContext.allTopics.diff(topics)</span></span>
<span class="line"><span>  // 第3步：使用ZooKeeper中的主题列表更新元数据缓存</span></span>
<span class="line"><span>  controllerContext.setAllTopics(topics)</span></span>
<span class="line"><span>  // 第4步：为新增主题注册分区变更监听器</span></span>
<span class="line"><span>  // 分区变更监听器是监听主题分区变更的</span></span>
<span class="line"><span>  registerPartitionModificationsHandlers(newTopics.toSeq)</span></span>
<span class="line"><span>  // 第5步：从ZooKeeper中获取新增主题的副本分配情况</span></span>
<span class="line"><span>  val addedPartitionReplicaAssignment = zkClient.getFullReplicaAssignmentForTopics(newTopics)</span></span>
<span class="line"><span>  // 第6步：清除元数据缓存中属于已删除主题的缓存项</span></span>
<span class="line"><span>  deletedTopics.foreach(controllerContext.removeTopic)</span></span>
<span class="line"><span>  // 第7步：为新增主题更新元数据缓存中的副本分配条目</span></span>
<span class="line"><span>  addedPartitionReplicaAssignment.foreach {</span></span>
<span class="line"><span>    case (topicAndPartition, newReplicaAssignment) =&amp;gt; controllerContext.updatePartitionFullReplicaAssignment(topicAndPartition, newReplicaAssignment)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  info(s&quot;New topics: [$newTopics], deleted topics: [$deletedTopics], new partition replica assignment &quot; +</span></span>
<span class="line"><span>    s&quot;[$addedPartitionReplicaAssignment]&quot;)</span></span>
<span class="line"><span>  // 第8步：调整新增主题所有分区以及所属所有副本的运行状态为“上线”状态</span></span>
<span class="line"><span>  if (addedPartitionReplicaAssignment.nonEmpty)</span></span>
<span class="line"><span>    onNewPartitionCreation(addedPartitionReplicaAssignment.keySet)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>虽然一共有8步，但大部分的逻辑都与更新元数据缓存项有关，因此，处理逻辑总体上还是比较简单的。需要注意的是，第8步涉及到了使用分区管理器和副本管理器来调整分区和副本状态。后面我们会详细介绍。这里你只需要知道，分区和副本处于“上线”状态，就表明它们能够正常工作，就足够了。</p><h3 id="主题删除" tabindex="-1">主题删除 <a class="header-anchor" href="#主题删除" aria-label="Permalink to &quot;主题删除&quot;">​</a></h3><p>和主题创建或变更类似，删除主题也依赖ZooKeeper监听器完成。</p><p>Controller定义了TopicDeletionHandler，用它来实现对删除主题的监听，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TopicDeletionHandler(eventManager: ControllerEventManager) extends ZNodeChildChangeHandler {</span></span>
<span class="line"><span>  // ZooKeeper节点：/admin/delete_topics</span></span>
<span class="line"><span>  override val path: String = DeleteTopicsZNode.path</span></span>
<span class="line"><span>  // 向事件队列写入TopicDeletion事件</span></span>
<span class="line"><span>  override def handleChildChange(): Unit = eventManager.put(TopicDeletion)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的DeleteTopicsZNode.path指的是/admin/delete_topics节点。目前，无论是kafka-topics脚本，还是AdminClient，删除主题都是在/admin/delete_topics节点下创建名为待删除主题名的子节点。</p><p>比如，如果我要删除test-topic主题，那么，Kafka的删除命令仅仅是在ZooKeeper上创建/admin/delete_topics/test-topic节点。一旦监听到该节点被创建，TopicDeletionHandler的handleChildChange方法就会被触发，Controller会向事件队列写入TopicDeletion事件。</p><p>处理TopicDeletion事件的方法是processTopicDeletion，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def processTopicDeletion(): Unit = {</span></span>
<span class="line"><span>  if (!isActive) return</span></span>
<span class="line"><span>  // 从ZooKeeper中获取待删除主题列表</span></span>
<span class="line"><span>  var topicsToBeDeleted = zkClient.getTopicDeletions.toSet</span></span>
<span class="line"><span>  debug(s&quot;Delete topics listener fired for topics \${topicsToBeDeleted.mkString(&quot;,&quot;)} to be deleted&quot;)</span></span>
<span class="line"><span>  // 找出不存在的主题列表</span></span>
<span class="line"><span>  val nonExistentTopics = topicsToBeDeleted -- controllerContext.allTopics</span></span>
<span class="line"><span>  if (nonExistentTopics.nonEmpty) {</span></span>
<span class="line"><span>    warn(s&quot;Ignoring request to delete non-existing topics \${nonExistentTopics.mkString(&quot;,&quot;)}&quot;)</span></span>
<span class="line"><span>    zkClient.deleteTopicDeletions(nonExistentTopics.toSeq, controllerContext.epochZkVersion)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  topicsToBeDeleted --= nonExistentTopics</span></span>
<span class="line"><span>  // 如果delete.topic.enable参数设置成true</span></span>
<span class="line"><span>  if (config.deleteTopicEnable) {</span></span>
<span class="line"><span>    if (topicsToBeDeleted.nonEmpty) {</span></span>
<span class="line"><span>      info(s&quot;Starting topic deletion for topics \${topicsToBeDeleted.mkString(&quot;,&quot;)}&quot;)</span></span>
<span class="line"><span>      topicsToBeDeleted.foreach { topic =&amp;gt;</span></span>
<span class="line"><span>        val partitionReassignmentInProgress = controllerContext.partitionsBeingReassigned.map(_.topic).contains(topic)</span></span>
<span class="line"><span>        if (partitionReassignmentInProgress)</span></span>
<span class="line"><span>          topicDeletionManager.markTopicIneligibleForDeletion(</span></span>
<span class="line"><span>            Set(topic), reason = &quot;topic reassignment in progress&quot;)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 将待删除主题插入到删除等待集合交由TopicDeletionManager处理</span></span>
<span class="line"><span>      topicDeletionManager.enqueueTopicsForDeletion(topicsToBeDeleted)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } else { // 不允许删除主题</span></span>
<span class="line"><span>    info(s&quot;Removing $topicsToBeDeleted since delete topic is disabled&quot;)</span></span>
<span class="line"><span>    // 清除ZooKeeper下/admin/delete_topics下的子节点</span></span>
<span class="line"><span>    zkClient.deleteTopicDeletions(topicsToBeDeleted.toSeq, controllerContext.epochZkVersion)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了帮助你更直观地理解，我再画一张图来说明下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/239512/976d35f7771f4cd5ef94eda856fb53c9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/239512/976d35f7771f4cd5ef94eda856fb53c9.jpg" alt=""></a></p><p>首先，代码从ZooKeeper的/admin/delete_topics下获取子节点列表，即待删除主题列表。</p><p>之后，比对元数据缓存中的主题列表，获知压根不存在的主题列表。如果确实有不存在的主题，删除/admin/delete_topics下对应的子节点就行了。同时，代码会更新待删除主题列表，将这些不存在的主题剔除掉。</p><p>接着，代码会检查Broker端参数delete.topic.enable的值。如果该参数为false，即不允许删除主题，代码就会清除ZooKeeper下的对应子节点，不会做其他操作。反之，代码会遍历待删除主题列表，将那些正在执行分区迁移的主题暂时设置成“不可删除”状态。</p><p>最后，把剩下可以删除的主题交由TopicDeletionManager，由它执行真正的删除逻辑。</p><p>这里的TopicDeletionManager是Kafka专门负责删除主题的管理器，下节课我会详细讲解它的代码实现。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们学习了Controller的两个主要功能：管理集群Broker成员和主题。这两个功能是Controller端提供的重要服务。我建议你仔细地查看这两部分的源码，弄明白Controller是如何管理集群中的重要资源的。</p><p>针对这些内容，我总结了几个重点，希望可以帮助你更好地理解和记忆。</p><ul><li>集群成员管理：Controller负责对集群所有成员进行有效管理，包括自动发现新增Broker、自动处理下线Broker，以及及时响应Broker数据的变更。</li><li>主题管理：Controller负责对集群上的所有主题进行高效管理，包括创建主题、变更主题以及删除主题，等等。对于删除主题而言，实际的删除操作由底层的TopicDeletionManager完成。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/239512/0035a579a02def8f5234831bf0857f37.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Kafka%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/images/239512/0035a579a02def8f5234831bf0857f37.jpg" alt=""></a></p><p>接下来，我们将进入到下一个模块：状态机模块。在该模块中，我们将系统学习Kafka提供的三大状态机或管理器。Controller非常依赖这些状态机对下辖的所有Kafka对象进行管理。在下一个模块中，我将带你深入了解分区或副本在底层的状态流转是怎么样的，你一定不要错过。</p><h2 id="课后讨论" tabindex="-1">课后讨论 <a class="header-anchor" href="#课后讨论" aria-label="Permalink to &quot;课后讨论&quot;">​</a></h2><p>如果我们想要使用脚本命令增加一个主题的分区，你知道应该用KafkaController类中的哪个方法吗？</p><p>欢迎你在留言区畅所欲言，跟我交流讨论，也欢迎你把今天的内容分享给你的朋友。</p>`,88)])])}const h=s(o,[["render",r]]);export{B as __pageData,h as default};
