import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"29 | 渐入佳境：使用epoll和多线程模型","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何切换到epoll","slug":"如何切换到epoll","link":"#如何切换到epoll","children":[]},{"level":2,"title":"样例程序","slug":"样例程序","link":"#样例程序","children":[]},{"level":2,"title":"样例程序结果","slug":"样例程序结果","link":"#样例程序结果","children":[]},{"level":2,"title":"epoll的性能分析","slug":"epoll的性能分析","link":"#epoll的性能分析","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/29-渐入佳境：使用epoll和多线程模型.md","filePath":"网络编程实战/29-渐入佳境：使用epoll和多线程模型.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/29-渐入佳境：使用epoll和多线程模型.md"};function t(i,n,c,o,r,d){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_29-渐入佳境-使用epoll和多线程模型" tabindex="-1">29 | 渐入佳境：使用epoll和多线程模型 <a class="header-anchor" href="#_29-渐入佳境-使用epoll和多线程模型" aria-label="Permalink to &quot;29 | 渐入佳境：使用epoll和多线程模型&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战第29讲，欢迎回来。</p><p>在前面的第27讲和第28讲中，我介绍了基于poll事件分发的reactor反应堆模式，以及主从反应堆模式。我们知道，和poll相比，Linux提供的epoll是一种更为高效的事件分发机制。在这一讲里，我们将切换到epoll实现的主从反应堆模式，并且分析一下为什么epoll的性能会强于poll等传统的事件分发机制。</p><h2 id="如何切换到epoll" tabindex="-1">如何切换到epoll <a class="header-anchor" href="#如何切换到epoll" aria-label="Permalink to &quot;如何切换到epoll&quot;">​</a></h2><p>我已经将所有的代码已经放置到 <a href="https://github.com/froghui/yolanda" target="_blank" rel="noreferrer">GitHub</a> 上，你可以自行查看或下载。</p><p>我们的网络编程框架是可以同时支持poll和epoll机制的，那么如何开启epoll的支持呢？</p><p>lib/event_loop.c文件的event_loop_init_with_name函数是关键，可以看到，这里是通过宏EPOLL_ENABLE来决定是使用epoll还是poll的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct event_loop *event_loop_init_with_name(char *thread_name) {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>#ifdef EPOLL_ENABLE</span></span>
<span class="line"><span>    yolanda_msgx(&quot;set epoll as dispatcher, %s&quot;, eventLoop-&amp;gt;thread_name);</span></span>
<span class="line"><span>    eventLoop-&amp;gt;eventDispatcher = &amp;epoll_dispatcher;</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>    yolanda_msgx(&quot;set poll as dispatcher, %s&quot;, eventLoop-&amp;gt;thread_name);</span></span>
<span class="line"><span>    eventLoop-&amp;gt;eventDispatcher = &amp;poll_dispatcher;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    eventLoop-&amp;gt;event_dispatcher_data = eventLoop-&amp;gt;eventDispatcher-&amp;gt;init(eventLoop);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在根目录下的CMakeLists.txt文件里，引入CheckSymbolExists，如果系统里有epoll_create函数和sys/epoll.h，就自动开启EPOLL_ENABLE。如果没有，EPOLL_ENABLE就不会开启，自动使用poll作为默认的事件分发机制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># check epoll and add config.h for the macro compilation</span></span>
<span class="line"><span>include(CheckSymbolExists)</span></span>
<span class="line"><span>check_symbol_exists(epoll_create &quot;sys/epoll.h&quot; EPOLL_EXISTS)</span></span>
<span class="line"><span>if (EPOLL_EXISTS)</span></span>
<span class="line"><span>    #    Linux下设置为epoll</span></span>
<span class="line"><span>    set(EPOLL_ENABLE 1 CACHE INTERNAL &quot;enable epoll&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    #    Linux下也设置为poll</span></span>
<span class="line"><span>    #    set(EPOLL_ENABLE &quot;&quot; CACHE INTERNAL &quot;not enable epoll&quot;)</span></span>
<span class="line"><span>else ()</span></span>
<span class="line"><span>    set(EPOLL_ENABLE &quot;&quot; CACHE INTERNAL &quot;not enable epoll&quot;)</span></span>
<span class="line"><span>endif ()</span></span></code></pre></div><p>但是，为了能让编译器使用到这个宏，需要让CMake往config.h文件里写入这个宏的最终值，configure_file命令就是起这个作用的。其中config.h.cmake是一个模板文件，已经预先创建在根目录下。同时还需要让编译器include这个config.h文件。include_directories可以帮我们达成这个目标。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>configure_file(\${CMAKE_CURRENT_SOURCE_DIR}/config.h.cmake</span></span>
<span class="line"><span>        \${CMAKE_CURRENT_BINARY_DIR}/include/config.h)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>include_directories(\${CMAKE_CURRENT_BINARY_DIR}/include)</span></span></code></pre></div><p>这样，在Linux下，就会默认使用epoll作为事件分发。</p><p>那么前面的 <a href="https://time.geekbang.org/column/article/146664" target="_blank" rel="noreferrer">27讲</a> 和 <a href="https://time.geekbang.org/column/article/148148" target="_blank" rel="noreferrer">28讲</a> 中的程序案例如何改为使用poll的呢？</p><p>我们可以修改CMakeLists.txt文件，把Linux下设置为poll的那段注释下的命令打开，同时关闭掉原先设置为1的命令就可以了。 下面就是具体的示例代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># check epoll and add config.h for the macro compilation</span></span>
<span class="line"><span>include(CheckSymbolExists)</span></span>
<span class="line"><span>check_symbol_exists(epoll_create &quot;sys/epoll.h&quot; EPOLL_EXISTS)</span></span>
<span class="line"><span>if (EPOLL_EXISTS)</span></span>
<span class="line"><span>    #    Linux下也设置为poll</span></span>
<span class="line"><span>     set(EPOLL_ENABLE &quot;&quot; CACHE INTERNAL &quot;not enable epoll&quot;)</span></span>
<span class="line"><span>else ()</span></span>
<span class="line"><span>    set(EPOLL_ENABLE &quot;&quot; CACHE INTERNAL &quot;not enable epoll&quot;)</span></span>
<span class="line"><span>endif (</span></span></code></pre></div><p>不管怎样，现在我们得到了一个Linux下使用epoll作为事件分发的版本，现在让我们使用它来编写程序吧。</p><h2 id="样例程序" tabindex="-1">样例程序 <a class="header-anchor" href="#样例程序" aria-label="Permalink to &quot;样例程序&quot;">​</a></h2><p>我们的样例程序和 <a href="https://time.geekbang.org/column/article/148148" target="_blank" rel="noreferrer">第28讲</a> 的一模一样，只是现在我们的事件分发机制从poll切换到了epoll。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;lib/acceptor.h&amp;gt;</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>关于这个程序，之前一直没有讲到的部分是缓冲区对象buffer。这其实也是网络编程框架应该考虑的部分。</p><p>我们希望框架可以对应用程序封装掉套接字读和写的部分，转而提供的是针对缓冲区对象的读和写操作。这样一来，从套接字收取数据、处理异常、发送数据等操作都被类似buffer这样的对象所封装和屏蔽，应用程序所要做的事情就会变得更加简单，从buffer对象中可以获取已接收到的字节流再进行应用层处理，比如这里通过调用buffer_read_char函数从buffer中读取一个字节。</p><p>另外一方面，框架也必须对应用程序提供套接字发送的接口，接口的数据类型类似这里的buffer对象，可以看到，这里先生成了一个buffer对象，之后将编码后的结果填充到buffer对象里，最后调用tcp_connection_send_buffer将buffer对象里的数据通过套接字发送出去。</p><p>这里像onMessage、onConnectionClosed几个回调函数都是运行在子反应堆线程中的，也就是说，刚刚提到的生成buffer对象，encode部分的代码，是在子反应堆线程中执行的。这其实也是回调函数的内涵，回调函数本身只是提供了类似Handlder的处理逻辑，具体执行是由事件分发线程，或者说是event loop线程发起的。</p><p>框架通过一层抽象，让应用程序的开发者只需要看到回调函数，回调函数中的对象，也都是如buffer和tcp_connection这样封装过的对象，这样像套接字、字节流等底层实现的细节就完全由框架来完成了。</p><p>框架帮我们做了很多事情，那这些事情是如何做到的？在第四篇实战篇，我们将一一揭开答案。如果你有兴趣，不妨先看看实现代码。</p><h2 id="样例程序结果" tabindex="-1">样例程序结果 <a class="header-anchor" href="#样例程序结果" aria-label="Permalink to &quot;样例程序结果&quot;">​</a></h2><p>启动服务器，可以从屏幕输出上看到，使用的是epoll作为事件分发器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$./epoll-server-multithreads</span></span>
<span class="line"><span>[msg] set epoll as dispatcher, main thread</span></span>
<span class="line"><span>[msg] add channel fd == 5, main thread</span></span>
<span class="line"><span>[msg] set epoll as dispatcher, Thread-1</span></span>
<span class="line"><span>[msg] add channel fd == 9, Thread-1</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-1</span></span>
<span class="line"><span>[msg] event loop run, Thread-1</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-1</span></span>
<span class="line"><span>[msg] set epoll as dispatcher, Thread-2</span></span>
<span class="line"><span>[msg] add channel fd == 12, Thread-2</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-2</span></span>
<span class="line"><span>[msg] event loop run, Thread-2</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-2</span></span>
<span class="line"><span>[msg] set epoll as dispatcher, Thread-3</span></span>
<span class="line"><span>[msg] add channel fd == 15, Thread-3</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-3</span></span>
<span class="line"><span>[msg] event loop run, Thread-3</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-3</span></span>
<span class="line"><span>[msg] set epoll as dispatcher, Thread-4</span></span>
<span class="line"><span>[msg] add channel fd == 18, Thread-4</span></span>
<span class="line"><span>[msg] event loop thread init and signal, Thread-4</span></span>
<span class="line"><span>[msg] event loop run, Thread-4</span></span>
<span class="line"><span>[msg] event loop thread started, Thread-4</span></span>
<span class="line"><span>[msg] add channel fd == 6, main thread</span></span>
<span class="line"><span>[msg] event loop run, main thread</span></span></code></pre></div><p>开启多个telnet客户端，连接上该服务器, 通过屏幕输入和服务器端交互。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to 127.0.0.1.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>fafaf</span></span>
<span class="line"><span>snsns</span></span>
<span class="line"><span>^]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><p>服务端显示不断地从epoll_wait中返回处理I/O事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[msg] epoll_wait wakeup, main thread</span></span>
<span class="line"><span>[msg] get message channel fd==6 for read, main thread</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 19</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-1</span></span>
<span class="line"><span>[msg] get message channel fd==9 for read, Thread-1</span></span>
<span class="line"><span>[msg] activate channel fd == 9, revents=2, Thread-1</span></span>
<span class="line"><span>[msg] wakeup, Thread-1</span></span>
<span class="line"><span>[msg] add channel fd == 19, Thread-1</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-1</span></span>
<span class="line"><span>[msg] get message channel fd==19 for read, Thread-1</span></span>
<span class="line"><span>[msg] activate channel fd == 19, revents=2, Thread-1</span></span>
<span class="line"><span>get message from tcp connection connection-19</span></span>
<span class="line"><span>afasf</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, main thread</span></span>
<span class="line"><span>[msg] get message channel fd==6 for read, main thread</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 20</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-2</span></span>
<span class="line"><span>[msg] get message channel fd==12 for read, Thread-2</span></span>
<span class="line"><span>[msg] activate channel fd == 12, revents=2, Thread-2</span></span>
<span class="line"><span>[msg] wakeup, Thread-2</span></span>
<span class="line"><span>[msg] add channel fd == 20, Thread-2</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-2</span></span>
<span class="line"><span>[msg] get message channel fd==20 for read, Thread-2</span></span>
<span class="line"><span>[msg] activate channel fd == 20, revents=2, Thread-2</span></span>
<span class="line"><span>get message from tcp connection connection-20</span></span>
<span class="line"><span>asfasfas</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-2</span></span>
<span class="line"><span>[msg] get message channel fd==20 for read, Thread-2</span></span>
<span class="line"><span>[msg] activate channel fd == 20, revents=2, Thread-2</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, main thread</span></span>
<span class="line"><span>[msg] get message channel fd==6 for read, main thread</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 21</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-3</span></span>
<span class="line"><span>[msg] get message channel fd==15 for read, Thread-3</span></span>
<span class="line"><span>[msg] activate channel fd == 15, revents=2, Thread-3</span></span>
<span class="line"><span>[msg] wakeup, Thread-3</span></span>
<span class="line"><span>[msg] add channel fd == 21, Thread-3</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-3</span></span>
<span class="line"><span>[msg] get message channel fd==21 for read, Thread-3</span></span>
<span class="line"><span>[msg] activate channel fd == 21, revents=2, Thread-3</span></span>
<span class="line"><span>get message from tcp connection connection-21</span></span>
<span class="line"><span>dfasfadsf</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-1</span></span>
<span class="line"><span>[msg] get message channel fd==19 for read, Thread-1</span></span>
<span class="line"><span>[msg] activate channel fd == 19, revents=2, Thread-1</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, main thread</span></span>
<span class="line"><span>[msg] get message channel fd==6 for read, main thread</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 22</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-4</span></span>
<span class="line"><span>[msg] get message channel fd==18 for read, Thread-4</span></span>
<span class="line"><span>[msg] activate channel fd == 18, revents=2, Thread-4</span></span>
<span class="line"><span>[msg] wakeup, Thread-4</span></span>
<span class="line"><span>[msg] add channel fd == 22, Thread-4</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-4</span></span>
<span class="line"><span>[msg] get message channel fd==22 for read, Thread-4</span></span>
<span class="line"><span>[msg] activate channel fd == 22, revents=2, Thread-4</span></span>
<span class="line"><span>get message from tcp connection connection-22</span></span>
<span class="line"><span>fafaf</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-4</span></span>
<span class="line"><span>[msg] get message channel fd==22 for read, Thread-4</span></span>
<span class="line"><span>[msg] activate channel fd == 22, revents=2, Thread-4</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] epoll_wait wakeup, Thread-3</span></span>
<span class="line"><span>[msg] get message channel fd==21 for read, Thread-3</span></span>
<span class="line"><span>[msg] activate channel fd == 21, revents=2, Thread-3</span></span>
<span class="line"><span>connection closed</span></span></code></pre></div><p>其中主线程的epoll_wait只处理acceptor套接字的事件，表示的是连接的建立；反应堆子线程的epoll_wait主要处理的是已连接套接字的读写事件。这幅图详细解释了这部分逻辑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/149204/167e8e055d690a15f22cee8f114fb5dd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/149204/167e8e055d690a15f22cee8f114fb5dd.png" alt=""></a></p><h2 id="epoll的性能分析" tabindex="-1">epoll的性能分析 <a class="header-anchor" href="#epoll的性能分析" aria-label="Permalink to &quot;epoll的性能分析&quot;">​</a></h2><p>epoll的性能凭什么就要比poll或者select好呢？这要从两个角度来说明。</p><p>第一个角度是事件集合。在每次使用poll或select之前，都需要准备一个感兴趣的事件集合，系统内核拿到事件集合，进行分析并在内核空间构建相应的数据结构来完成对事件集合的注册。而epoll则不是这样，epoll维护了一个全局的事件集合，通过epoll句柄，可以操纵这个事件集合，增加、删除或修改这个事件集合里的某个元素。要知道在绝大多数情况下，事件集合的变化没有那么的大，这样操纵系统内核就不需要每次重新扫描事件集合，构建内核空间数据结构。</p><p>第二个角度是就绪列表。每次在使用poll或者select之后，应用程序都需要扫描整个感兴趣的事件集合，从中找出真正活动的事件，这个列表如果增长到10K以上，每次扫描的时间损耗也是惊人的。事实上，很多情况下扫描完一圈，可能发现只有几个真正活动的事件。而epoll则不是这样，epoll返回的直接就是活动的事件列表，应用程序减少了大量的扫描时间。</p><p>此外， epoll还提供了更高级的能力——边缘触发。 <a href="https://time.geekbang.org/column/article/143245" target="_blank" rel="noreferrer">第23讲</a> 通过一个直观的例子，讲解了边缘触发和条件触发的区别。</p><p>这里再举一个例子说明一下。</p><p>如果某个套接字有100个字节可以读，边缘触发（edge-triggered）和条件触发（level-triggered）都会产生read ready notification事件，如果应用程序只读取了50个字节，边缘触发就会陷入等待；而条件触发则会因为还有50个字节没有读取完，不断地产生read ready notification事件。</p><p>在条件触发下（level-triggered），如果某个套接字缓冲区可以写，会无限次返回write ready notification事件，在这种情况下，如果应用程序没有准备好，不需要发送数据，一定需要解除套接字上的ready notification事件，否则CPU就直接跪了。</p><p>我们简单地总结一下，边缘触发只会产生一次活动事件，性能和效率更高。不过，程序处理起来要更为小心。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>本讲我们将程序框架切换到了epoll的版本，和poll版本相比，只是底层的框架做了更改，上层应用程序不用做任何修改，这也是程序框架强大的地方。和poll相比，epoll从事件集合和就绪列表两个方面加强了程序性能，是Linux下高性能网络程序的首选。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后我给你布置两道思考题：</p><p>第一道，说说你对边缘触发和条件触发的理解。</p><p>第二道，对于边缘触发和条件触发，onMessage函数处理要注意什么？</p><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流进步。</p>`,51)])])}const m=a(l,[["render",t]]);export{g as __pageData,m as default};
