import{_ as s,H as a,f as e,i as t}from"./chunks/framework.BH2BK_3i.js";const S=JSON.parse('{"title":"18 | 新特性：Tomcat如何支持WebSocket？","description":"","frontmatter":{},"headers":[{"level":2,"title":"WebSocket工作原理","slug":"websocket工作原理","link":"#websocket工作原理","children":[]},{"level":2,"title":"Tomcat如何支持WebSocket","slug":"tomcat如何支持websocket","link":"#tomcat如何支持websocket","children":[]},{"level":2,"title":"本期精华","slug":"本期精华","link":"#本期精华","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"深入拆解Tomcat&Jetty/18-新特性：Tomcat如何支持WebSocket？.md","filePath":"深入拆解Tomcat&Jetty/18-新特性：Tomcat如何支持WebSocket？.md","lastUpdated":1779821049000}'),p={name:"深入拆解Tomcat&Jetty/18-新特性：Tomcat如何支持WebSocket？.md"};function o(c,n,i,l,r,d){return a(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="_18-新特性-tomcat如何支持websocket" tabindex="-1">18 | 新特性：Tomcat如何支持WebSocket？ <a class="header-anchor" href="#_18-新特性-tomcat如何支持websocket" aria-label="Permalink to &quot;18 | 新特性：Tomcat如何支持WebSocket？&quot;">​</a></h1><p>我们知道HTTP协议是“请求-响应”模式，浏览器必须先发请求给服务器，服务器才会响应这个请求。也就是说，服务器不会主动发送数据给浏览器。</p><p>对于实时性要求比较的高的应用，比如在线游戏、股票基金实时报价和在线协同编辑等，浏览器需要实时显示服务器上最新的数据，因此出现了Ajax和Comet技术。Ajax本质上还是轮询，而Comet是在HTTP长连接的基础上做了一些hack，但是它们的实时性不高，另外频繁的请求会给服务器带来压力，也会浪费网络流量和带宽。于是HTML5推出了WebSocket标准，使得浏览器和服务器之间任何一方都可以主动发消息给对方，这样服务器有新数据时可以主动推送给浏览器。</p><p>今天我会介绍WebSocket的工作原理，以及作为服务器端的Tomcat是如何支持WebSocket的。更重要的是，希望你在学完之后可以灵活地选用WebSocket技术来解决实际工作中的问题。</p><h2 id="websocket工作原理" tabindex="-1">WebSocket工作原理 <a class="header-anchor" href="#websocket工作原理" aria-label="Permalink to &quot;WebSocket工作原理&quot;">​</a></h2><p>WebSocket的名字里带有Socket，那Socket是什么呢？网络上的两个程序通过一个双向链路进行通信，这个双向链路的一端称为一个Socket。一个Socket对应一个IP地址和端口号，应用程序通常通过Socket向网络发出请求或者应答网络请求。Socket不是协议，它其实是对TCP/IP协议层抽象出来的API。</p><p>但WebSocket不是一套API，跟HTTP协议一样，WebSocket也是一个应用层协议。为了跟现有的HTTP协议保持兼容，它通过HTTP协议进行一次握手，握手之后数据就直接从TCP层的Socket传输，就与HTTP协议无关了。浏览器发给服务端的请求会带上跟WebSocket有关的请求头，比如 <code>Connection: Upgrade</code> 和 <code>Upgrade: websocket</code>。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/eebd74d6f1cbdf6d765adac12ebaed20.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/eebd74d6f1cbdf6d765adac12ebaed20.jpg" alt=""></a></p><p>如果服务器支持WebSocket，同样会在HTTP响应里加上WebSocket相关的HTTP头部。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/14776cea5251c30c73df754dfbd45a2e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/14776cea5251c30c73df754dfbd45a2e.jpg" alt=""></a></p><p>这样WebSocket连接就建立好了，接下来WebSocket的数据传输会以frame形式传输，会将一条消息分为几个frame，按照先后顺序传输出去。这样做的好处有：</p><ul><li>大数据的传输可以分片传输，不用考虑数据大小的问题。</li><li>和HTTP的chunk一样，可以边生成数据边传输，提高传输效率。</li></ul><h2 id="tomcat如何支持websocket" tabindex="-1">Tomcat如何支持WebSocket <a class="header-anchor" href="#tomcat如何支持websocket" aria-label="Permalink to &quot;Tomcat如何支持WebSocket&quot;">​</a></h2><p>在讲Tomcat如何支持WebSocket之前，我们先来开发一个简单的聊天室程序，需求是：用户可以通过浏览器加入聊天室、发送消息，聊天室的其他人都可以收到消息。</p><p><strong>WebSocket聊天室程序</strong></p><p>浏览器端JavaScript核心代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var Chat = {};</span></span>
<span class="line"><span>Chat.socket = null;</span></span>
<span class="line"><span>Chat.connect = (function(host) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //判断当前浏览器是否支持WebSocket</span></span>
<span class="line"><span>    if (&#39;WebSocket&#39; in window) {</span></span>
<span class="line"><span>        //如果支持则创建WebSocket JS类</span></span>
<span class="line"><span>        Chat.socket = new WebSocket(host);</span></span>
<span class="line"><span>    } else if (&#39;MozWebSocket&#39; in window) {</span></span>
<span class="line"><span>        Chat.socket = new MozWebSocket(host);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        Console.log(&#39;WebSocket is not supported by this browser.&#39;);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //回调函数，当和服务器的WebSocket连接建立起来后，浏览器会回调这个方法</span></span>
<span class="line"><span>    Chat.socket.onopen = function () {</span></span>
<span class="line"><span>        Console.log(&#39;Info: WebSocket connection opened.&#39;);</span></span>
<span class="line"><span>        document.getElementById(&#39;chat&#39;).onkeydown = function(event) {</span></span>
<span class="line"><span>            if (event.keyCode == 13) {</span></span>
<span class="line"><span>                Chat.sendMessage();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //回调函数，当和服务器的WebSocket连接关闭后，浏览器会回调这个方法</span></span>
<span class="line"><span>    Chat.socket.onclose = function () {</span></span>
<span class="line"><span>        document.getElementById(&#39;chat&#39;).onkeydown = null;</span></span>
<span class="line"><span>        Console.log(&#39;Info: WebSocket closed.&#39;);</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //回调函数，当服务器有新消息发送到浏览器，浏览器会回调这个方法</span></span>
<span class="line"><span>    Chat.socket.onmessage = function (message) {</span></span>
<span class="line"><span>        Console.log(message.data);</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>上面的代码实现逻辑比较清晰，就是创建一个WebSocket JavaScript对象，然后实现了几个回调方法：onopen、onclose和onmessage。当连接建立、关闭和有新消息时，浏览器会负责调用这些回调方法。我们再来看服务器端Tomcat的实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Tomcat端的实现类加上@ServerEndpoint注解，里面的value是URL路径</span></span>
<span class="line"><span>@ServerEndpoint(value = &quot;/websocket/chat&quot;)</span></span>
<span class="line"><span>public class ChatEndpoint {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final String GUEST_PREFIX = &quot;Guest&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //记录当前有多少个用户加入到了聊天室，它是static全局变量。为了多线程安全使用原子变量AtomicInteger</span></span>
<span class="line"><span>    private static final AtomicInteger connectionIds = new AtomicInteger(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //每个用户用一个CharAnnotation实例来维护，请你注意它是一个全局的static变量，所以用到了线程安全的CopyOnWriteArraySet</span></span>
<span class="line"><span>    private static final Set&lt;​ChatEndpoint&gt; connections =</span></span>
<span class="line"><span>            new CopyOnWriteArraySet&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final String nickname;</span></span>
<span class="line"><span>    private Session session;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ChatEndpoint() {</span></span>
<span class="line"><span>        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //新连接到达时，Tomcat会创建一个Session，并回调这个函数</span></span>
<span class="line"><span>    @OnOpen</span></span>
<span class="line"><span>    public void start(Session session) {</span></span>
<span class="line"><span>        this.session = session;</span></span>
<span class="line"><span>        connections.add(this);</span></span>
<span class="line"><span>        String message = String.format(&quot;* %s %s&quot;, nickname, &quot;has joined.&quot;);</span></span>
<span class="line"><span>        broadcast(message);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //浏览器关闭连接时，Tomcat会回调这个函数</span></span>
<span class="line"><span>    @OnClose</span></span>
<span class="line"><span>    public void end() {</span></span>
<span class="line"><span>        connections.remove(this);</span></span>
<span class="line"><span>        String message = String.format(&quot;* %s %s&quot;,</span></span>
<span class="line"><span>                nickname, &quot;has disconnected.&quot;);</span></span>
<span class="line"><span>        broadcast(message);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //浏览器发送消息到服务器时，Tomcat会回调这个函数</span></span>
<span class="line"><span>    @OnMessage</span></span>
<span class="line"><span>    public void incoming(String message) {</span></span>
<span class="line"><span>        // Never trust the client</span></span>
<span class="line"><span>        String filteredMessage = String.format(&quot;%s: %s&quot;,</span></span>
<span class="line"><span>                nickname, HTMLFilter.filter(message.toString()));</span></span>
<span class="line"><span>        broadcast(filteredMessage);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //WebSocket连接出错时，Tomcat会回调这个函数</span></span>
<span class="line"><span>    @OnError</span></span>
<span class="line"><span>    public void onError(Throwable t) throws Throwable {</span></span>
<span class="line"><span>        log.error(&quot;Chat Error: &quot; + t.toString(), t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //向聊天室中的每个用户广播消息</span></span>
<span class="line"><span>    private static void broadcast(String msg) {</span></span>
<span class="line"><span>        for (ChatAnnotation client : connections) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                synchronized (client) {</span></span>
<span class="line"><span>                    client.session.getBasicRemote().sendText(msg);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>              ...</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据Java WebSocket规范的规定，Java WebSocket应用程序由一系列的WebSocket Endpoint组成。 <strong>Endpoint是一个Java对象，代表WebSocket连接的一端，就好像处理HTTP请求的Servlet一样，你可以把它看作是处理WebSocket消息的接口</strong>。跟Servlet不同的地方在于，Tomcat会给每一个WebSocket连接创建一个Endpoint实例。你可以通过两种方式定义和实现Endpoint。</p><p>第一种方法是编程式的，就是编写一个Java类继承 <code>javax.websocket.Endpoint</code>，并实现它的onOpen、onClose和onError方法。这些方法跟Endpoint的生命周期有关，Tomcat负责管理Endpoint的生命周期并调用这些方法。并且当浏览器连接到一个Endpoint时，Tomcat会给这个连接创建一个唯一的Session（ <code>javax.websocket.Session</code>）。Session在WebSocket连接握手成功之后创建，并在连接关闭时销毁。当触发Endpoint各个生命周期事件时，Tomcat会将当前Session作为参数传给Endpoint的回调方法，因此一个Endpoint实例对应一个Session，我们通过在Session中添加MessageHandler消息处理器来接收消息，MessageHandler中定义了onMessage方法。 <strong>在这里Session的本质是对Socket的封装，Endpoint通过它与浏览器通信。</strong></p><p>第二种定义Endpoint的方法是注解式的，也就是上面的聊天室程序例子中用到的方式，即实现一个业务类并给它添加WebSocket相关的注解。首先我们注意到 <code>@ServerEndpoint(value = &quot;/websocket/chat&quot;)</code> 注解，它表明当前业务类ChatEndpoint是一个实现了WebSocket规范的Endpoint，并且注解的value值表明ChatEndpoint映射的URL是 <code>/websocket/chat</code>。我们还看到ChatEndpoint类中有 <code>@OnOpen</code>、 <code>@OnClose</code>、 <code>@OnError</code> 和在 <code>@OnMessage</code> 注解的方法，从名字你就知道它们的功能是什么。</p><p>对于程序员来说，其实我们只需要专注具体的Endpoint的实现，比如在上面聊天室的例子中，为了方便向所有人群发消息，ChatEndpoint在内部使用了一个全局静态的集合CopyOnWriteArraySet来维护所有的ChatEndpoint实例，因为每一个ChatEndpoint实例对应一个WebSocket连接，也就是代表了一个加入聊天室的用户。 <strong>当某个ChatEndpoint实例收到来自浏览器的消息时，这个ChatEndpoint会向集合中其他ChatEndpoint实例背后的WebSocket连接推送消息。</strong></p><p>那么这个过程中，Tomcat主要做了哪些事情呢？简单来说就是两件事情： <strong>Endpoint加载和WebSocket请求处理</strong>。下面我分别来详细说说Tomcat是如何做这两件事情的。</p><p><strong>WebSocket加载</strong></p><p>Tomcat的WebSocket加载是通过SCI机制完成的。SCI全称ServletContainerInitializer，是Servlet 3.0规范中定义的用来 <strong>接收Web应用启动事件的接口</strong>。那为什么要监听Servlet容器的启动事件呢？因为这样我们有机会在Web应用启动时做一些初始化工作，比如WebSocket需要扫描和加载Endpoint类。SCI的使用也比较简单，将实现ServletContainerInitializer接口的类增加HandlesTypes注解，并且在注解内指定的一系列类和接口集合。比如Tomcat为了扫描和加载Endpoint而定义的SCI类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@HandlesTypes({ServerEndpoint.class, ServerApplicationConfig.class, Endpoint.class})</span></span>
<span class="line"><span>public class WsSci implements ServletContainerInitializer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void onStartup(Set&lt;​Class&lt;?&gt;&gt; clazzes, ServletContext ctx) throws ServletException {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一旦定义好了SCI，Tomcat在启动阶段扫描类时，会将HandlesTypes注解中指定的类都扫描出来，作为SCI的onStartup方法的参数，并调用SCI的onStartup方法。注意到WsSci的HandlesTypes注解中定义了 <code>ServerEndpoint.class</code>、 <code>ServerApplicationConfig.class</code> 和 <code>Endpoint.class</code>，因此在Tomcat的启动阶段会将这些类的类实例（注意不是对象实例）传递给WsSci的onStartup方法。那么WsSci的onStartup方法又做了什么事呢？</p><p>它会构造一个WebSocketContainer实例，你可以把WebSocketContainer理解成一个专门处理WebSocket请求的 <strong>Endpoint容器</strong>。也就是说Tomcat会把扫描到的Endpoint子类和添加了注解 <code>@ServerEndpoint</code> 的类注册到这个容器中，并且这个容器还维护了URL到Endpoint的映射关系，这样通过请求URL就能找到具体的Endpoint来处理WebSocket请求。</p><p><strong>WebSocket请求处理</strong></p><p>在讲WebSocket请求处理之前，我们先来回顾一下Tomcat连接器的组件图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/ea924a53eb834e4b07fce6a559fc37ed.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/ea924a53eb834e4b07fce6a559fc37ed.jpg" alt=""></a></p><p>你可以看到Tomcat用ProtocolHandler组件屏蔽应用层协议的差异，其中ProtocolHandler中有两个关键组件：Endpoint和Processor。需要注意，这里的Endpoint跟上文提到的WebSocket中的Endpoint完全是两回事，连接器中的Endpoint组件用来处理I/O通信。WebSocket本质就是一个应用层协议，因此不能用HttpProcessor来处理WebSocket请求，而要用专门Processor来处理，而在Tomcat中这样的Processor叫作UpgradeProcessor。</p><p>为什么叫UpgradeProcessor呢？这是因为Tomcat是将HTTP协议升级成WebSocket协议的，我们知道WebSocket是通过HTTP协议来进行握手的，因此当WebSocket的握手请求到来时，HttpProtocolHandler首先接收到这个请求，在处理这个HTTP请求时，Tomcat通过一个特殊的Filter判断该当前HTTP请求是否是一个WebSocket Upgrade请求（即包含 <code>Upgrade: websocket</code> 的HTTP头信息），如果是，则在HTTP响应里添加WebSocket相关的响应头信息，并进行协议升级。具体来说就是用UpgradeProtocolHandler替换当前的HttpProtocolHandler，相应的，把当前Socket的Processor替换成UpgradeProcessor，同时Tomcat会创建WebSocket Session实例和Endpoint实例，并跟当前的WebSocket连接一一对应起来。这个WebSocket连接不会立即关闭，并且在请求处理中，不再使用原有的HttpProcessor，而是用专门的UpgradeProcessor，UpgradeProcessor最终会调用相应的Endpoint实例来处理请求。下面我们通过一张图来理解一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/90892eab8ab21dac9dda65eed3aa5c65.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102009/90892eab8ab21dac9dda65eed3aa5c65.jpg" alt=""></a></p><p>你可以看到，Tomcat对WebSocket请求的处理没有经过Servlet容器，而是通过UpgradeProcessor组件直接把请求发到ServerEndpoint实例，并且Tomcat的WebSocket实现不需要关注具体I/O模型的细节，从而实现了与具体I/O方式的解耦。</p><h2 id="本期精华" tabindex="-1">本期精华 <a class="header-anchor" href="#本期精华" aria-label="Permalink to &quot;本期精华&quot;">​</a></h2><p>WebSocket技术实现了Tomcat与浏览器的双向通信，Tomcat可以主动向浏览器推送数据，可以用来实现对数据实时性要求比较高的应用。这需要浏览器和Web服务器同时支持WebSocket标准，Tomcat启动时通过SCI技术来扫描和加载WebSocket的处理类ServerEndpoint，并且建立起了URL到ServerEndpoint的映射关系。</p><p>当第一个WebSocket请求到达时，Tomcat将HTTP协议升级成WebSocket协议，并将该Socket连接的Processor替换成UpgradeProcessor。这个Socket不会立即关闭，对接下来的请求，Tomcat通过UpgradeProcessor直接调用相应的ServerEndpoint来处理。</p><p>今天我讲了可以通过两种方式来开发WebSocket应用，一种是继承 <code>javax.websocket.Endpoint</code>，另一种通过WebSocket相关的注解。其实你还可以通过Spring来实现WebSocket应用，有兴趣的话你可以去研究一下Spring WebSocket的原理。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>今天我举的聊天室的例子实现的是群发消息，如果要向某个特定用户发送消息，应该怎么做呢？</p><p>不知道今天的内容你消化得如何？如果还有疑问，请大胆的在留言区提问，也欢迎你把你的课后思考和心得记录下来，与我和其他同学一起讨论。如果你觉得今天有所收获，欢迎你把它分享给你的朋友。</p>`,43)])])}const k=s(p,[["render",o]]);export{S as __pageData,k as default};
