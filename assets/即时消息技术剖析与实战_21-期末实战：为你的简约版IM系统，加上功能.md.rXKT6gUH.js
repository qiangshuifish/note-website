import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"21 | 期末实战：为你的简约版IM系统，加上功能","description":"","frontmatter":{},"headers":[{"level":2,"title":"功能介绍","slug":"功能介绍","link":"#功能介绍","children":[]},{"level":2,"title":"功能实现拆解","slug":"功能实现拆解","link":"#功能实现拆解","children":[{"level":3,"title":"WebSocket长连接","slug":"websocket长连接","link":"#websocket长连接","children":[]},{"level":3,"title":"核心消息收发逻辑处理","slug":"核心消息收发逻辑处理","link":"#核心消息收发逻辑处理","children":[]},{"level":3,"title":"消息推送的ACK","slug":"消息推送的ack","link":"#消息推送的ack","children":[]},{"level":3,"title":"应用层心跳","slug":"应用层心跳","link":"#应用层心跳","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"relativePath":"即时消息技术剖析与实战/21-期末实战：为你的简约版IM系统，加上功能.md","filePath":"即时消息技术剖析与实战/21-期末实战：为你的简约版IM系统，加上功能.md","lastUpdated":1779819064000}'),t={name:"即时消息技术剖析与实战/21-期末实战：为你的简约版IM系统，加上功能.md"};function l(i,n,o,c,r,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_21-期末实战-为你的简约版im系统-加上功能" tabindex="-1">21 | 期末实战：为你的简约版IM系统，加上功能 <a class="header-anchor" href="#_21-期末实战-为你的简约版im系统-加上功能" aria-label="Permalink to &quot;21 | 期末实战：为你的简约版IM系统，加上功能&quot;">​</a></h1><p>你好，我是袁武林。</p><p>在期中实战中，我们一起尝试实现了一个简易版的聊天系统，并且为这个聊天系统增加了一些基本功能。比如，用户登录、简单的文本消息收发、消息存储设计、未读数提示、消息自动更新等。</p><p>但是期中实战的目的，主要是让你对IM系统的基本功能构成有一个直观的了解，所以在功能的实现层面上比较简单。比如针对消息的实时性，期中采用的是基于HTTP短轮询的方式来实现。</p><p>因此，在期末实战中，我们主要的工作就是针对期中实战里的消息收发来进行功能优化。</p><p>比如，我们会采用WebSocket的长连接，来替代之前的HTTP短轮询方式，并且会加上一些课程中有讲到的相对高级的功能，如应用层心跳、ACK机制等。</p><p>希望通过期末整体技术实现上的升级，你能更深刻地体会到IM系统升级前后，对使用方和服务端压力的差异性。相应的示例代码我放在了 <a href="https://github.com/coldwalker/Sample" target="_blank" rel="noreferrer">GitHub</a> 里，你可以作为参考来学习和实现。</p><h2 id="功能介绍" tabindex="-1">功能介绍 <a class="header-anchor" href="#功能介绍" aria-label="Permalink to &quot;功能介绍&quot;">​</a></h2><p>关于这次期末实战，希望你能够完成的功能主要包括以下几个部分：</p><ol><li>支持基于WebSocket的长连接。</li><li>消息收发均通过长连接进行通信。</li><li>支持消息推送的ACK机制和重推机制。</li><li>支持客户端的心跳机制和双端的idle超时断连。</li><li>支持客户端断线后的自动重连。</li></ol><h2 id="功能实现拆解" tabindex="-1">功能实现拆解 <a class="header-anchor" href="#功能实现拆解" aria-label="Permalink to &quot;功能实现拆解&quot;">​</a></h2><p>接下来，我们就针对以上这些需要升级的功能和新增的主要功能，来进行实现上的拆解。</p><h3 id="websocket长连接" tabindex="-1">WebSocket长连接 <a class="header-anchor" href="#websocket长连接" aria-label="Permalink to &quot;WebSocket长连接&quot;">​</a></h3><p>首先，期末实战一个比较大的改变就是，将之前HTTP短轮询的实现，改造成真正的长连接。为了方便Web端的演示，这里我建议你可以使用WebSocket来实现。</p><p>对于WebSocket，我们在客户端JS（JavaScript）里主要是使用HTML5的原生API来实现，其核心的实现代码部分如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (window.WebSocket) {</span></span>
<span class="line"><span>    websocket = new WebSocket(&quot;ws://127.0.0.1:8080&quot;);</span></span>
<span class="line"><span>    websocket.onmessage = function (event) {</span></span>
<span class="line"><span>        onmsg(event);</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //连接建立后的事件监听</span></span>
<span class="line"><span>    websocket.onopen = function () {</span></span>
<span class="line"><span>        bind();</span></span>
<span class="line"><span>        heartBeat.start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //连接关闭后的事件监听</span></span>
<span class="line"><span>    websocket.onclose = function () {</span></span>
<span class="line"><span>        reconnect();</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //连接出现异常后的事件监听</span></span>
<span class="line"><span>    websocket.onerror = function () {</span></span>
<span class="line"><span>        reconnect();</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    alert(&quot;您的浏览器不支持WebSocket协议！&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>页面打开时，JS先通过服务端的WebSocket地址建立长连接。要注意这里服务端连接的地址是ws://开头的，不是<a href="http://xn--ykqv88g" target="_blank" rel="noreferrer">http://的了</a>；如果是使用加密的WebSocket协议，那么相应的地址应该是以wss://开头的。</p><p>建立长连之后，要针对创建的WebSocket对象进行事件的监听，我们只需要在各种事件触发的时候，进行对应的逻辑处理就可以了。</p><p>比如，API主要支持的几种事件有：长连接通道建立完成后，通过onopen事件来进行用户信息的上报绑定；通过onmessage事件，对接收到的所有该连接上的数据进行处理，这个也是我们最核心的消息推送的处理逻辑；另外，在长连接通道发生异常错误，或者连接被关闭时，可以分别通过onerror和onclose两个事件来进行监听处理。</p><p>除了通过事件监听，来对长连接的状态变化进行逻辑处理外，我们还可以通过这个WebSocket长连接，向服务器发送数据（消息）。这个功能在实现上也非常简单，你只需要调用WebSocket对象的send方法就OK了。</p><p>通过长连接发送消息的代码设计如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var sendMsgJson = &#39;{ &quot;type&quot;: 3, &quot;data&quot;: {&quot;senderUid&quot;:&#39; + sender_id + &#39;,&quot;recipientUid&quot;:&#39; + recipient_id + &#39;, &quot;content&quot;:&quot;&#39; + msg_content + &#39;&quot;,&quot;msgType&quot;:1  }​}&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>websocket.send(sendMsgJson);</span></span></code></pre></div><p>此外，针对WebSocket在服务端的实现，如果你是使用JVM（Java Virtual Machine，Java虚拟机）系列语言的话，我推荐你使用比较成熟的Java NIO框架Netty来做实现。</p><p>因为Netty本身对WebSocket的支持就很完善了，各种编解码器和WebSocket的处理器都有，这样我们在代码实现上就比较简单。</p><p>采用Netty实现WebSocket Server的核心代码，你可以参考下面的示例代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>EventLoopGroup bossGroup =</span></span>
<span class="line"><span>                    new EpollEventLoopGroup(serverConfig.bossThreads, new DefaultThreadFactory(&quot;WebSocketBossGroup&quot;, true));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EventLoopGroup workerGroup =</span></span>
<span class="line"><span>                    new EpollEventLoopGroup(serverConfig.workerThreads, new DefaultThreadFactory(&quot;WebSocketWorkerGroup&quot;, true));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ServerBootstrap serverBootstrap = new ServerBootstrap().group(bossGroup, workerGroup).channel(EpollServerSocketChannel.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ChannelInitializer&lt;​SocketChannel&gt; initializer = new ChannelInitializer&lt;​SocketChannel&gt;() {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void initChannel(SocketChannel ch) throws Exception {</span></span>
<span class="line"><span>        ChannelPipeline pipeline = ch.pipeline();</span></span>
<span class="line"><span>        //先添加WebSocket相关的编解码器和协议处理器</span></span>
<span class="line"><span>        pipeline.addLast(new HttpServerCodec());</span></span>
<span class="line"><span>        pipeline.addLast(new HttpObjectAggregator(65536));</span></span>
<span class="line"><span>        pipeline.addLast(new LoggingHandler(LogLevel.DEBUG));</span></span>
<span class="line"><span>        pipeline.addLast(new WebSocketServerProtocolHandler(&quot;/&quot;, null, true));</span></span>
<span class="line"><span>        //再添加服务端业务消息的总处理器</span></span>
<span class="line"><span>        pipeline.addLast(websocketRouterHandler);</span></span>
<span class="line"><span>        //服务端添加一个idle处理器，如果一段时间Socket中没有消息传输，服务端会强制断开</span></span>
<span class="line"><span>        pipeline.addLast(new IdleStateHandler(0, 0, serverConfig.getAllIdleSecond()));</span></span>
<span class="line"><span>        pipeline.addLast(closeIdleChannelHandler);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>serverBootstrap.childHandler(initializer);</span></span>
<span class="line"><span>serverBootstrap.bind(serverConfig.port).sync(</span></span></code></pre></div><p>首先 <strong>创建服务器的ServerBootstrap对象</strong>。Netty作为服务端，从ServerBootstrap启动，ServerBootstrap对象主要用于在服务端的某一个端口进行监听，并接受客户端的连接。</p><p>接着， <strong>通过ChannelInitializer对象，初始化连接管道中用于处理数据的各种编解码器和业务逻辑处理器</strong>。比如这里，我们就需要添加为了处理WebSocket协议相关的编解码器，还要添加服务端接收到客户端发送的消息的业务逻辑处理器，并且还加上了用于通道idle超时管理的处理器。</p><p>最后， <strong>把这个管道处理器链挂到ServerBootstrap，再通过bind和sync方法，启动ServerBootstrap的端口进行监听</strong> 就可以了。</p><h3 id="核心消息收发逻辑处理" tabindex="-1">核心消息收发逻辑处理 <a class="header-anchor" href="#核心消息收发逻辑处理" aria-label="Permalink to &quot;核心消息收发逻辑处理&quot;">​</a></h3><p>建立好WebSocket长连接后，我们再来看一下最核心的消息收发是怎么处理的。</p><p>刚才讲到，客户端发送消息的功能，在实现上其实比较简单。我们只需要通过WebSocket对象的send方法，就可以把消息通过长连接发送到服务端。</p><p>那么，下面我们就来看一下服务端接收到消息后的逻辑处理。</p><p>核心的代码逻辑在WebSocketRouterHandler这个处理器中，消息接收处理的相关代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> @Override</span></span>
<span class="line"><span>protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {</span></span>
<span class="line"><span>    //如果是文本类型的WebSocket数据</span></span>
<span class="line"><span>    if (frame instanceof TextWebSocketFrame) {</span></span>
<span class="line"><span>        //先解析出具体的文本数据内容</span></span>
<span class="line"><span>        String msg = ((TextWebSocketFrame) frame).text();</span></span>
<span class="line"><span>        //再用JSON来对这些数据内容进行解析</span></span>
<span class="line"><span>        JSONObject msgJson = JSONObject.parseObject(msg);</span></span>
<span class="line"><span>        int type = msgJson.getIntValue(&quot;type&quot;);</span></span>
<span class="line"><span>        JSONObject data = msgJson.getJSONObject(&quot;data&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        long senderUid = data.getLong(&quot;senderUid&quot;);</span></span>
<span class="line"><span>        long recipientUid = data.getLong(&quot;recipientUid&quot;);</span></span>
<span class="line"><span>        String content = data.getString(&quot;content&quot;);</span></span>
<span class="line"><span>        int msgType = data.getIntValue(&quot;msgType&quot;);</span></span>
<span class="line"><span>        //调用业务层的Service来进行真正的发消息逻辑处理</span></span>
<span class="line"><span>        MessageVO messageContent = messageService.sendNewMsg(senderUid, recipientUid, content, msgType);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (messageContent != null) {</span></span>
<span class="line"><span>            JSONObject jsonObject = new JSONObject();</span></span>
<span class="line"><span>            jsonObject.put(&quot;type&quot;, 3);</span></span>
<span class="line"><span>            jsonObject.put(&quot;data&quot;, JSONObject.toJSON(messageContent));</span></span>
<span class="line"><span>                        ctx.writeAndFlush(new TextWebSocketFrame(JSONObject.toJSONString(jsonObject)));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的WebSocketRouterHandler，我们也是采用事件监听机制来实现。由于这里需要处理“接收到”的消息，所以我们只需要实现channelRead0方法就可以。</p><p>在前面的管道处理器链中，因为添加了WebSocket相关的编解码器，所以这里的WebSocketRouterHandler接收到的都是WebSocketFrame格式的数据。</p><p>接下来，我们从WebSocketFrame格式的数据中，解析出文本类型的收发双方UID和发送内容，就可以调用后端业务模块的发消息功能，来进行最终的发消息逻辑处理了。</p><p>最后，把需要返回给消息发送方的客户端的信息，再通过writeAndFlush方法写回去，就完成消息的发送。</p><p>不过，以上的代码只是处理消息的发送，那么针对消息下推的逻辑处理又是如何实现的呢？</p><p>刚刚讲到，客户端发送的消息，会通过后端业务模块来进行最终的发消息逻辑处理，这个处理过程也包括消息的推送触发。</p><p>因此，我们可以在messageService.sendNewMsg方法中，等待消息存储、未读变更都完成后，再处理待推送给接收方的消息。</p><p>你可以参考下面的核心代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final ConcurrentHashMap&lt;​Long, Channel&gt; userChannel = new ConcurrentHashMap&lt;&gt;(15000);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {</span></span>
<span class="line"><span>        //处理上线请求</span></span>
<span class="line"><span>        long loginUid = data.getLong(&quot;uid&quot;);</span></span>
<span class="line"><span>        userChannel.put(loginUid, ctx.channel());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>public void pushMsg(long recipientUid, JSONObject message) {</span></span>
<span class="line"><span>    Channel channel = userChannel.get(recipientUid);</span></span>
<span class="line"><span>    if (channel != null &amp;&amp; channel.isActive() &amp;&amp; channel.isWritable()) {</span></span>
<span class="line"><span>        channel.writeAndFlush(new TextWebSocketFrame(message.toJSONString()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先，我们在处理用户建连上线的请求时，会先在网关机内存记录一个“当前连接用户和对应的连接”的映射。</p><p>当系统有消息需要推送时，我们通过查询这个映射关系，就能找到对应的连接，然后就可以通过这个连接，将消息下推下去。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NewMessageListener implements MessageListener {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onMessage(Message message, byte[] pattern) {</span></span>
<span class="line"><span>        String topic = stringRedisSerializer.deserialize(message.getChannel());</span></span>
<span class="line"><span>        //从订阅到的Redis的消息里解析出真正需要的业务数据</span></span>
<span class="line"><span>        String jsonMsg = valueSerializer.deserialize(message.getBody());</span></span>
<span class="line"><span>        logger.info(&quot;Message Received --&gt; pattern: {}，topic:{}，message: {}&quot;, new String(pattern), topic, jsonMsg);</span></span>
<span class="line"><span>        JSONObject msgJson = JSONObject.parseObject(jsonMsg);</span></span>
<span class="line"><span>        //解析出消息接收人的UID</span></span>
<span class="line"><span>        long otherUid = msgJson.getLong(&quot;otherUid&quot;);</span></span>
<span class="line"><span>        JSONObject pushJson = new JSONObject();</span></span>
<span class="line"><span>        pushJson.put(&quot;type&quot;, 4);</span></span>
<span class="line"><span>        pushJson.put(&quot;data&quot;, msgJson);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //最终调用网关层处理器将消息真正下推下去</span></span>
<span class="line"><span>        websocketRouterHandler.pushMsg(otherUid, pushJson);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public MessageVO sendNewMsg(long senderUid, long recipientUid, String content, int msgType) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //先对发送消息进行存储、加未读等操作</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>    // 然后将待推送消息发布到Redis</span></span>
<span class="line"><span>    redisTemplate.convertAndSend(Constants.WEBSOCKET_MSG_TOPIC, JSONObject.toJSONString(messageVO));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们可以基于Redis的发布/订阅，实现一个消息推送的发布订阅器。</p><p>在业务层进行发送消息逻辑处理的最后，会将这条消息发布到Redis的一个Topic中，这个Topic被NewMessageListener一直监听着，如果有消息发布，那么监听器会马上感知到，然后再将消息提交给WebSocketRouterHandler，来进行最终消息的下推。</p><h3 id="消息推送的ack" tabindex="-1">消息推送的ACK <a class="header-anchor" href="#消息推送的ack" aria-label="Permalink to &quot;消息推送的ACK&quot;">​</a></h3><p>我在 <a href="https://time.geekbang.org/column/article/129751" target="_blank" rel="noreferrer">“04 | ACK机制：如何保证消息的可靠投递？”</a> 中有讲到，当系统有消息下推后，我们会依赖客户端响应的ACK包，来保证消息推送的可靠性。如果消息下推后一段时间，服务端没有收到客户端的ACK包，那么服务端会认为这条消息没有正常投递下去，就会触发重新下推。</p><p>关于ACK机制相应的服务端代码，你可以参考下面的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void pushMsg(long recipientUid, JSONObject message) {</span></span>
<span class="line"><span>    channel.writeAndFlush(new TextWebSocketFrame(message.toJSONString()));</span></span>
<span class="line"><span>    //消息推送下去后，将这条消息加入到待ACK列表中</span></span>
<span class="line"><span>    addMsgToAckBuffer(channel, message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public void addMsgToAckBuffer(Channel channel, JSONObject msgJson) {</span></span>
<span class="line"><span>    nonAcked.put(msgJson.getLong(&quot;tid&quot;), msgJson);</span></span>
<span class="line"><span>    //定时器针对下推的这条消息在5s后进行&quot;是否ACK&quot;的检查</span></span>
<span class="line"><span>    executorService.schedule(() -&gt; {</span></span>
<span class="line"><span>        if (channel.isActive()) {</span></span>
<span class="line"><span>            //检查是否被ACK，如果没有收到ACK回包，会触发重推</span></span>
<span class="line"><span>            checkAndResend(channel, msgJson);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }, 5000, TimeUnit.MILLISECONDS);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>long tid = data.getLong(&quot;tid&quot;);</span></span>
<span class="line"><span>nonAcked.remove(tid);</span></span>
<span class="line"><span>private void checkAndResend(Channel channel, JSONObject msgJson) {</span></span>
<span class="line"><span>    long tid = msgJson.getLong(&quot;tid&quot;);</span></span>
<span class="line"><span>    //重推2次</span></span>
<span class="line"><span>    int tryTimes = 2;</span></span>
<span class="line"><span>    while (tryTimes &gt; 0) {</span></span>
<span class="line"><span>        if (nonAcked.containsKey(tid) &amp;&amp; tryTimes &gt; 0) {</span></span>
<span class="line"><span>            channel.writeAndFlush(new TextWebSocketFrame(msgJson.toJSONString()));</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Thread.sleep(2000);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        tryTimes--;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>用户在上线完成后，服务端会在这个连接维度的存储里，初始化一个起始值为0的序号（tid），每当有消息推送给客户端时，服务端会针对这个序号进行加1操作，下推消息时就会携带这个序号连同消息一起推下去。</p><p>消息推送后，服务端会将当前消息加入到一个“待ACK Buffer”中，这个ACK Buffer的实现，我们可以简单地用一个ConcurrentHashMap来实现，Key就是这条消息携带的序号，Value是消息本身。</p><p>当消息加入到这个“待ACK Buffer”时，服务端会同时创建一个定时器，在一定的时间后，会触发“检查当前消息是否被ACK”的逻辑；如果客户端有回ACK，那么服务端就会从这个“待ACK Buffer”中移除这条消息，否则如果这条消息没有被ACK，那么就会触发消息的重新下推。</p><h3 id="应用层心跳" tabindex="-1">应用层心跳 <a class="header-anchor" href="#应用层心跳" aria-label="Permalink to &quot;应用层心跳&quot;">​</a></h3><p>在了解了如何通过WebSocket长连接，来完成最核心的消息收发功能之后，我们再来看下，针对这个长连接，我们如何实现新增加的应用层心跳功能。</p><p>应用层心跳的作用，我在 <a href="https://time.geekbang.org/column/article/134231" target="_blank" rel="noreferrer">第8课“智能心跳机制：解决网络的不确定性”</a> 中也有讲到过，主要是为了解决由于网络的不确定性，而导致的连接不可用的问题。</p><p>客户端发送心跳包的主要代码设计如下，不过我这里的示例代码只是一个简单的实现，你可以自行参考，然后自己去尝试动手实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//每2分钟发送一次心跳包，接收到消息或者服务端的响应又会重置来重新计时。</span></span>
<span class="line"><span>var heartBeat = {</span></span>
<span class="line"><span>    timeout: 120000,</span></span>
<span class="line"><span>    timeoutObj: null,</span></span>
<span class="line"><span>    serverTimeoutObj: null,</span></span>
<span class="line"><span>    reset: function () {</span></span>
<span class="line"><span>        clearTimeout(this.timeoutObj);</span></span>
<span class="line"><span>        clearTimeout(this.serverTimeoutObj);</span></span>
<span class="line"><span>        this.start();</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    start: function () {</span></span>
<span class="line"><span>        var self = this;</span></span>
<span class="line"><span>        this.timeoutObj = setTimeout(function () {</span></span>
<span class="line"><span>            var sender_id = $(&quot;#sender_id&quot;).val();</span></span>
<span class="line"><span>            var sendMsgJson = &#39;{ &quot;type&quot;: 0, &quot;data&quot;: {&quot;uid&quot;:&#39; + sender_id + &#39;,&quot;timeout&quot;: 120000}​}&#39;;</span></span>
<span class="line"><span>            websocket.send(sendMsgJson);</span></span>
<span class="line"><span>            self.serverTimeoutObj = setTimeout(function () {</span></span>
<span class="line"><span>                websocket.close();</span></span>
<span class="line"><span>                $(&quot;#ws_status&quot;).text(&quot;失去连接！&quot;);</span></span>
<span class="line"><span>            }, self.timeout)</span></span>
<span class="line"><span>        }, this.timeout)</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>客户端通过一个定时器，每2分钟通过长连接给服务端发送一次心跳包，如果在2分钟内接收到服务端的消息或者响应，那么客户端的下次2分钟定时器的计时，会进行清零重置，重新计算；如果发送的心跳包在2分钟后没有收到服务端的响应，客户端会断开当前连接，然后尝试重连。</p><p>我在下面的代码示例中，提供的“服务端接收到心跳包的处理逻辑”的实现过程，其实非常简单，只是封装了一个普通回包消息进行响应，代码设计如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {</span></span>
<span class="line"><span>    long uid = data.getLong(&quot;uid&quot;);</span></span>
<span class="line"><span>    long timeout = data.getLong(&quot;timeout&quot;);</span></span>
<span class="line"><span>    logger.info(&quot;[heartbeat]: uid = {} , current timeout is {} ms, channel = {}&quot;, uid, timeout, ctx.channel());</span></span>
<span class="line"><span>    ctx.writeAndFlush(new TextWebSocketFrame(&quot;{\\&quot;type\\&quot;:0,\\&quot;timeout\\&quot;:&quot; + timeout + &quot;}&quot;));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们实际在线上实现的时候，可以采用前面介绍的“智能心跳”机制，通过服务端对心跳包的响应，来计算新的心跳间隔，然后返回给客户端来进行调整。</p><p>好，到这里，期末实战的主要核心功能基本上也讲解得差不多了，细节方面你可以再翻一翻我在 <a href="https://github.com/coldwalker/Sample" target="_blank" rel="noreferrer">GitHub</a> 上提供的示例代码。</p><p>对于即时消息场景的代码实现来说，如果要真正达到线上使用的程度，相应的代码量是非常庞大的；而且对于同一个功能的实现，根据不同的使用场景和业务特征，很多业务在设计上也会有较大的差异性。</p><p>所以，实战课程的设计和示例代码只能做到挂一漏万，我尽量通过最简化的代码，来让你真正了解某一个功能在实现上最核心的思想。并且，通过期中和期末两个阶段的功能升级与差异对比，使你能感受到这些差异对于使用方体验和服务端压力的改善，从而可以更深刻地理解和掌握前面课程中相应的理论点。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天的期末实战，我们主要是针对期中实战中IM系统设计的功能，来进行优化改造。</p><p>比如， <strong>使用基于WebSocket的长连接</strong>，代替基于HTTP的短轮询，来提升消息的实时性，并增加了 <strong>应用层心跳、ACK机制</strong> 等新功能。</p><p>通过这次核心代码的讲解，是想让你能理论结合实际地去理解前面课程讲到的，IM系统设计中最重要的部分功能，也希望你能自己尝试去动手写一写。当然，你也可以基于已有代码，去增加一些之前课程中有讲到，但是示例代码中没有实现的功能，比如离线消息、群聊等。</p><p>最后再给你留一个思考题： <strong>ACK机制的实现中，如果尝试多次下推之后仍然没有成功，服务端后续应该进行哪些处理呢？</strong></p><p>以上就是今天课程的内容，欢迎你给我留言，我们可以在留言区一起讨论，感谢你的收听，我们下期再见。</p>`,74)])])}const h=s(t,[["render",l]]);export{g as __pageData,h as default};
