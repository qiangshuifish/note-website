import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"28 | I/O多路复用进阶：子线程使用poll处理连接I/O事件","description":"","frontmatter":{},"headers":[{"level":2,"title":"主-从reactor模式","slug":"主-从reactor模式","link":"#主-从reactor模式","children":[]},{"level":2,"title":"主-从reactor+worker threads模式","slug":"主-从reactor-worker-threads模式","link":"#主-从reactor-worker-threads模式","children":[]},{"level":2,"title":"样例程序","slug":"样例程序","link":"#样例程序","children":[]},{"level":2,"title":"样例程序结果","slug":"样例程序结果","link":"#样例程序结果","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/28-I-O多路复用进阶：子线程使用poll处理连接I-O事件.md","filePath":"网络编程实战/28-I-O多路复用进阶：子线程使用poll处理连接I-O事件.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/28-I-O多路复用进阶：子线程使用poll处理连接I-O事件.md"};function c(t,n,i,o,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_28-i-o多路复用进阶-子线程使用poll处理连接i-o事件" tabindex="-1">28 | I/O多路复用进阶：子线程使用poll处理连接I/O事件 <a class="header-anchor" href="#_28-i-o多路复用进阶-子线程使用poll处理连接i-o事件" aria-label="Permalink to &quot;28 | I/O多路复用进阶：子线程使用poll处理连接I/O事件&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战第28讲，欢迎回来。</p><p>在前面的第27讲中，我们引入了reactor反应堆模式，并且让reactor反应堆同时分发Acceptor上的连接建立事件和已建立连接的I/O事件。</p><p>我们仔细想想这种模式，在发起连接请求的客户端非常多的情况下，有一个地方是有问题的，那就是单reactor线程既分发连接建立，又分发已建立连接的I/O，有点忙不过来，在实战中的表现可能就是客户端连接成功率偏低。</p><p>再者，新的硬件技术不断发展，多核多路CPU已经得到极大的应用，单reactor反应堆模式看着大把的CPU资源却不用，有点可惜。</p><p>这一讲我们就将acceptor上的连接建立事件和已建立连接的I/O事件分离，形成所谓的主-从reactor模式。</p><h2 id="主-从reactor模式" tabindex="-1">主-从reactor模式 <a class="header-anchor" href="#主-从reactor模式" aria-label="Permalink to &quot;主-从reactor模式&quot;">​</a></h2><p>下面的这张图描述了主-从reactor模式是如何工作的。</p><p>主-从这个模式的核心思想是，主反应堆线程只负责分发Acceptor连接建立，已连接套接字上的I/O事件交给sub-reactor负责分发。其中sub-reactor的数量，可以根据CPU的核数来灵活设置。</p><p>比如一个四核CPU，我们可以设置sub-reactor为4。相当于有4个身手不凡的反应堆线程同时在工作，这大大增强了I/O分发处理的效率。而且，同一个套接字事件分发只会出现在一个反应堆线程中，这会大大减少并发处理的锁开销。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/148148/9269551b14c51dc9605f43d441c5a92a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/148148/9269551b14c51dc9605f43d441c5a92a.png" alt=""></a></p><p>我来解释一下这张图，我们的主反应堆线程一直在感知连接建立的事件，如果有连接成功建立，主反应堆线程通过accept方法获取已连接套接字，接下来会按照一定的算法选取一个从反应堆线程，并把已连接套接字加入到选择好的从反应堆线程中。</p><p>主反应堆线程唯一的工作，就是调用accept获取已连接套接字，以及将已连接套接字加入到从反应堆线程中。不过，这里还有一个小问题，主反应堆线程和从反应堆线程，是两个不同的线程，如何把已连接套接字加入到另外一个线程中呢？更令人沮丧的是，此时从反应堆线程或许处于事件分发的无限循环之中，在这种情况下应该怎么办呢？</p><p>我在这里先卖个关子，这是高性能网络程序框架要解决的问题。在实战篇里，我将为这些问题一一解开答案。</p><h2 id="主-从reactor-worker-threads模式" tabindex="-1">主-从reactor+worker threads模式 <a class="header-anchor" href="#主-从reactor-worker-threads模式" aria-label="Permalink to &quot;主-从reactor+worker threads模式&quot;">​</a></h2><p>如果说主-从reactor模式解决了I/O分发的高效率问题，那么work threads就解决了业务逻辑和I/O分发之间的耦合问题。把这两个策略组装在一起，就是实战中普遍采用的模式。大名鼎鼎的Netty，就是把这种模式发挥到极致的一种实现。不过要注意Netty里面提到的worker线程，其实就是我们这里说的从reactor线程，并不是处理具体业务逻辑的worker线程。</p><p>下面贴的一段代码就是常见的Netty初始化代码，这里Boss Group就是acceptor主反应堆，workerGroup就是从反应堆。而处理业务逻辑的线程，通常都是通过使用Netty的程序开发者进行设计和定制，一般来说，业务逻辑线程需要从workerGroup线程中分离，以便支持更高的并发度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class TelnetServer {</span></span>
<span class="line"><span>    static final int PORT = Integer.parseInt(System.getProperty(&quot;port&quot;, SSL? &quot;8992&quot; : &quot;8023&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        //产生一个reactor线程，只负责accetpor的对应处理</span></span>
<span class="line"><span>        EventLoopGroup bossGroup = new NioEventLoopGroup(1);</span></span>
<span class="line"><span>        //产生一个reactor线程，负责处理已连接套接字的I/O事件分发</span></span>
<span class="line"><span>        EventLoopGroup workerGroup = new NioEventLoopGroup(1);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>           //标准的Netty初始，通过serverbootstrap完成线程池、channel以及对应的handler设置，注意这里讲bossGroup和workerGroup作为参数设置</span></span>
<span class="line"><span>            ServerBootstrap b = new ServerBootstrap();</span></span>
<span class="line"><span>            b.group(bossGroup, workerGroup)</span></span>
<span class="line"><span>             .channel(NioServerSocketChannel.class)</span></span>
<span class="line"><span>             .handler(new LoggingHandler(LogLevel.INFO))</span></span>
<span class="line"><span>             .childHandler(new TelnetServerInitializer(sslCtx));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //开启两个reactor线程无限循环处理</span></span>
<span class="line"><span>            b.bind(PORT).sync().channel().closeFuture().sync();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            bossGroup.shutdownGracefully();</span></span>
<span class="line"><span>            workerGroup.shutdownGracefully();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/148148/1e647269a5f51497bd5488b2a44444b4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/148148/1e647269a5f51497bd5488b2a44444b4.png" alt=""></a></p><p>这张图解释了主-从反应堆下加上worker线程池的处理模式。</p><p>主-从反应堆跟上面介绍的做法是一样的。和上面不一样的是，这里将decode、compute、encode等CPU密集型的工作从I/O线程中拿走，这些工作交给worker线程池来处理，而且这些工作拆分成了一个个子任务进行。encode之后完成的结果再由sub-reactor的I/O线程发送出去。</p><h2 id="样例程序" tabindex="-1">样例程序 <a class="header-anchor" href="#样例程序" aria-label="Permalink to &quot;样例程序&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;lib/acceptor.h&amp;gt;</span></span>
<span class="line"><span>#include &quot;lib/common.h&quot;</span></span>
<span class="line"><span>#include &quot;lib/event_loop.h&quot;</span></span>
<span class="line"><span>#include &quot;lib/tcp_server.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>char rot13_char(char c) {</span></span>
<span class="line"><span>    if ((c &amp;gt;= &#39;a&#39; &amp;&amp; c &amp;lt;= &#39;m&#39;) || (c &amp;gt;= &#39;A&#39; &amp;&amp; c &amp;lt;= &#39;M&#39;))</span></span>
<span class="line"><span>        return c + 13;</span></span>
<span class="line"><span>    else if ((c &amp;gt;= &#39;n&#39; &amp;&amp; c &amp;lt;= &#39;z&#39;) || (c &amp;gt;= &#39;N&#39; &amp;&amp; c &amp;lt;= &#39;Z&#39;))</span></span>
<span class="line"><span>        return c - 13;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return c;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//连接建立之后的callback</span></span>
<span class="line"><span>int onConnectionCompleted(struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&quot;connection completed\\n&quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//数据读到buffer之后的callback</span></span>
<span class="line"><span>int onMessage(struct buffer *input, struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&quot;get message from tcp connection %s\\n&quot;, tcpConnection-&amp;gt;name);</span></span>
<span class="line"><span>    printf(&quot;%s&quot;, input-&amp;gt;data);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct buffer *output = buffer_new();</span></span>
<span class="line"><span>    int size = buffer_readable_size(input);</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; size; i++) {</span></span>
<span class="line"><span>        buffer_append_char(output, rot13_char(buffer_read_char(input)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    tcp_connection_send_buffer(tcpConnection, output);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//数据通过buffer写完之后的callback</span></span>
<span class="line"><span>int onWriteCompleted(struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&quot;write completed\\n&quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//连接关闭之后的callback</span></span>
<span class="line"><span>int onConnectionClosed(struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&quot;connection closed\\n&quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    //主线程event_loop</span></span>
<span class="line"><span>    struct event_loop *eventLoop = event_loop_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化acceptor</span></span>
<span class="line"><span>    struct acceptor *acceptor = acceptor_init(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始tcp_server，可以指定线程数目，这里线程是4，说明是一个acceptor线程，4个I/O线程，没一个I/O线程</span></span>
<span class="line"><span>    //tcp_server自己带一个event_loop</span></span>
<span class="line"><span>    struct TCPserver *tcpServer = tcp_server_init(eventLoop, acceptor, onConnectionCompleted, onMessage,</span></span>
<span class="line"><span>                                                  onWriteCompleted, onConnectionClosed, 4);</span></span>
<span class="line"><span>    tcp_server_start(tcpServer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // main thread for acceptor</span></span>
<span class="line"><span>    event_loop_run(eventLoop);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们的样例程序几乎和第27讲的一样，唯一的不同是在创建TCPServer时，线程的数量设置不再是0，而是4。这里线程是4，说明是一个主acceptor线程，4个从reactor线程，每一个线程都跟一个event_loop一一绑定。</p><p>你可能会问，这么简单就完成了主、从线程的配置？</p><p>答案是YES。这其实是设计框架需要考虑的地方，一个框架不仅要考虑性能、扩展性，也需要考虑可用性。可用性部分就是程序开发者如何使用框架。如果我是一个开发者，我肯定关心框架的使用方式是不是足够方便，配置是不是足够灵活等。</p><p>像这里，可以根据需求灵活地配置主、从反应堆线程，就是一个易用性的体现。当然，因为时间有限，我没有考虑woker线程的部分，这部分其实应该是应用程序自己来设计考虑。网络编程框架通过回调函数暴露了交互的接口，这里应用程序开发者完全可以在onMessage方法里面获取一个子线程来处理encode、compute和encode的工作，像下面的示范代码一样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//数据读到buffer之后的callback</span></span>
<span class="line"><span>int onMessage(struct buffer *input, struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&quot;get message from tcp connection %s\\n&quot;, tcpConnection-&amp;gt;name);</span></span>
<span class="line"><span>    printf(&quot;%s&quot;, input-&amp;gt;data);</span></span>
<span class="line"><span>    //取出一个线程来负责decode、compute和encode</span></span>
<span class="line"><span>    struct buffer *output = thread_handle(input);</span></span>
<span class="line"><span>    //处理完之后再通过reactor I/O线程发送数据</span></span>
<span class="line"><span>    tcp_connection_send_buffer(tcpConnection, output);</span></span>
<span class="line"><span>    return</span></span></code></pre></div><h2 id="样例程序结果" tabindex="-1">样例程序结果 <a class="header-anchor" href="#样例程序结果" aria-label="Permalink to &quot;样例程序结果&quot;">​</a></h2><p>我们启动这个服务器端程序，你可以从服务器端的输出上看到使用了poll作为事件分发方式。</p><p>多打开几个telnet客户端交互，main-thread只负责新的连接建立，每个客户端数据的收发由不同的子线程Thread-1、Thread-2、Thread-3和Thread-4来提供服务。</p><p>这里由于使用了子线程进行I/O处理，主线程可以专注于新连接处理，从而大大提高了客户端连接成功率。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$./poll-server-multithreads</span></span>
<span class="line"><span>[msg] set poll as dispatcher</span></span>
<span class="line"><span>[msg] add channel fd == 4, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==4</span></span>
<span class="line"><span>[msg] set poll as dispatcher</span></span>
<span class="line"><span>[msg] add channel fd == 7, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==7</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-1</span></span>
<span class="line"><span>[msg] event loop run, Thread-1</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-1</span></span>
<span class="line"><span>[msg] set poll as dispatcher</span></span>
<span class="line"><span>[msg] add channel fd == 9, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==9</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-2</span></span>
<span class="line"><span>[msg] event loop run, Thread-2</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-2</span></span>
<span class="line"><span>[msg] set poll as dispatcher</span></span>
<span class="line"><span>[msg] add channel fd == 11, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==11</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-3</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-3</span></span>
<span class="line"><span>[msg] set poll as dispatcher</span></span>
<span class="line"><span>[msg] event loop run, Thread-3</span></span>
<span class="line"><span>[msg] add channel fd == 13, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==13</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-4</span></span>
<span class="line"><span>[msg] event loop run, Thread-4</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-4</span></span>
<span class="line"><span>[msg] add channel fd == 5, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==5</span></span>
<span class="line"><span>[msg] event loop run, main thread</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 14</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] get message channel i==0, fd==7</span></span>
<span class="line"><span>[msg] activate channel fd == 7, revents=2, Thread-1</span></span>
<span class="line"><span>[msg] wakeup, Thread-1</span></span>
<span class="line"><span>[msg] add channel fd == 14, Thread-1</span></span>
<span class="line"><span>[msg] poll added channel fd==14</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==14</span></span>
<span class="line"><span>[msg] activate channel fd == 14, revents=2, Thread-1</span></span>
<span class="line"><span>get message from tcp connection connection-14</span></span>
<span class="line"><span>fasfas</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==14</span></span>
<span class="line"><span>[msg] activate channel fd == 14, revents=2, Thread-1</span></span>
<span class="line"><span>get message from tcp connection connection-14</span></span>
<span class="line"><span>fasfas</span></span>
<span class="line"><span>asfa</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 15</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] get message channel i==0, fd==9</span></span>
<span class="line"><span>[msg] activate channel fd == 9, revents=2, Thread-2</span></span>
<span class="line"><span>[msg] wakeup, Thread-2</span></span>
<span class="line"><span>[msg] add channel fd == 15, Thread-2</span></span>
<span class="line"><span>[msg] poll added channel fd==15</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==15</span></span>
<span class="line"><span>[msg] activate channel fd == 15, revents=2, Thread-2</span></span>
<span class="line"><span>get message from tcp connection connection-15</span></span>
<span class="line"><span>afasdfasf</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==15</span></span>
<span class="line"><span>[msg] activate channel fd == 15, revents=2, Thread-2</span></span>
<span class="line"><span>get message from tcp connection connection-15</span></span>
<span class="line"><span>afasdfasf</span></span>
<span class="line"><span>safsafa</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==15</span></span>
<span class="line"><span>[msg] activate channel fd == 15, revents=2, Thread-2</span></span>
<span class="line"><span>[msg] poll delete channel fd==15</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 16</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] get message channel i==0, fd==11</span></span>
<span class="line"><span>[msg] activate channel fd == 11, revents=2, Thread-3</span></span>
<span class="line"><span>[msg] wakeup, Thread-3</span></span>
<span class="line"><span>[msg] add channel fd == 16, Thread-3</span></span>
<span class="line"><span>[msg] poll added channel fd==16</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==16</span></span>
<span class="line"><span>[msg] activate channel fd == 16, revents=2, Thread-3</span></span>
<span class="line"><span>get message from tcp connection connection-16</span></span>
<span class="line"><span>fdasfasdf</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==14</span></span>
<span class="line"><span>[msg] activate channel fd == 14, revents=2, Thread-1</span></span>
<span class="line"><span>[msg] poll delete channel fd==14</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 17</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] get message channel i==0, fd==13</span></span>
<span class="line"><span>[msg] activate channel fd == 13, revents=2, Thread-4</span></span>
<span class="line"><span>[msg] wakeup, Thread-4</span></span>
<span class="line"><span>[msg] add channel fd == 17, Thread-4</span></span>
<span class="line"><span>[msg] poll added channel fd==17</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==17</span></span>
<span class="line"><span>[msg] activate channel fd == 17, revents=2, Thread-4</span></span>
<span class="line"><span>get message from tcp connection connection-17</span></span>
<span class="line"><span>qreqwrq</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==16</span></span>
<span class="line"><span>[msg] activate channel fd == 16, revents=2, Thread-3</span></span>
<span class="line"><span>[msg] poll delete channel fd==16</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 18</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] get message channel i==0, fd==7</span></span>
<span class="line"><span>[msg] activate channel fd == 7, revents=2, Thread-1</span></span>
<span class="line"><span>[msg] wakeup, Thread-1</span></span>
<span class="line"><span>[msg] add channel fd == 18, Thread-1</span></span>
<span class="line"><span>[msg] poll added channel fd==18</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==18</span></span>
<span class="line"><span>[msg] activate channel fd == 18, revents=2, Thread-1</span></span>
<span class="line"><span>get message from tcp connection connection-18</span></span>
<span class="line"><span>fasgasdg</span></span>
<span class="line"><span>^C</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>本讲主要讲述了主从reactor模式，主从reactor模式中，主reactor只负责连接建立的处理，而把已连接套接字的I/O事件分发交给从reactor线程处理，这大大提高了客户端连接的处理能力。从Netty的实现上来看，也遵循了这一原则。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>和往常一样，给你留两道思考题：</p><p>第一道，从日志输出中，你还可以看到main-thread首先加入了fd为4的套接字，这个是监听套接字，很好理解。可是这里的main-thread又加入了一个fd为7的套接字，这个套接字是干什么用的呢？</p><p>第二道，你可以试着修改一下服务器端的代码，把decode-compute-encode部分使用线程或者线程池来处理。</p><p>欢迎你在评论区写下你的思考，或者在GitHub上上传修改过的代码，我会和你一起交流，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,40)])])}const m=s(l,[["render",c]]);export{g as __pageData,m as default};
