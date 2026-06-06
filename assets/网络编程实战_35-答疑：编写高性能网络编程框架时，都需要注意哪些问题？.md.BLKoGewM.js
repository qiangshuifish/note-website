import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"35 | 答疑：编写高性能网络编程框架时，都需要注意哪些问题？","description":"","frontmatter":{},"headers":[{"level":2,"title":"为什么在发送数据时，会先尝试通过socket直接发送，再由框架接管呢？","slug":"为什么在发送数据时-会先尝试通过socket直接发送-再由框架接管呢","link":"#为什么在发送数据时-会先尝试通过socket直接发送-再由框架接管呢","children":[]},{"level":2,"title":"关于回调函数的设计","slug":"关于回调函数的设计","link":"#关于回调函数的设计","children":[]},{"level":2,"title":"tcp_connection对象设计的想法是什么，和channel有什么联系和区别？","slug":"tcp-connection对象设计的想法是什么-和channel有什么联系和区别","link":"#tcp-connection对象设计的想法是什么-和channel有什么联系和区别","children":[]},{"level":2,"title":"主线程等待子线程完成的同步锁问题","slug":"主线程等待子线程完成的同步锁问题","link":"#主线程等待子线程完成的同步锁问题","children":[]},{"level":2,"title":"关于channel_map的设计，特别是内存方面的设计。","slug":"关于channel-map的设计-特别是内存方面的设计。","link":"#关于channel-map的设计-特别是内存方面的设计。","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"网络编程实战/35-答疑：编写高性能网络编程框架时，都需要注意哪些问题？.md","filePath":"网络编程实战/35-答疑：编写高性能网络编程框架时，都需要注意哪些问题？.md","lastUpdated":1779821786000}'),t={name:"网络编程实战/35-答疑：编写高性能网络编程框架时，都需要注意哪些问题？.md"};function l(c,n,i,o,r,d){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_35-答疑-编写高性能网络编程框架时-都需要注意哪些问题" tabindex="-1">35 | 答疑：编写高性能网络编程框架时，都需要注意哪些问题？ <a class="header-anchor" href="#_35-答疑-编写高性能网络编程框架时-都需要注意哪些问题" aria-label="Permalink to &quot;35 | 答疑：编写高性能网络编程框架时，都需要注意哪些问题？&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战的第35讲，欢迎回来。</p><p>这一篇文章是实战篇的答疑部分，也是本系列的最后一篇文章。非常感谢你的积极评论与留言，让每一篇文章的留言区都成为学习互动的好地方。在今天的内容里，我将针对评论区的问题做一次集中回答，希望能帮助你解决前面碰到的一些问题。</p><p>有关这部分内容，我将采用Q&amp;A的形式来展开。</p><h2 id="为什么在发送数据时-会先尝试通过socket直接发送-再由框架接管呢" tabindex="-1">为什么在发送数据时，会先尝试通过socket直接发送，再由框架接管呢？ <a class="header-anchor" href="#为什么在发送数据时-会先尝试通过socket直接发送-再由框架接管呢" aria-label="Permalink to &quot;为什么在发送数据时，会先尝试通过socket直接发送，再由框架接管呢？&quot;">​</a></h2><p>这个问题具体描述是下面这样的。</p><p>当应用程序需要发送数据时，比如下面这段，在完成数据读取和回应的编码之后，会调用tcp_connection_send_buffer方法发送数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//数据读到buffer之后的callback</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>而tcp_connection_send_buffer方法则会调用tcp_connection_send_data来发送数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_connection_send_buffer(struct tcp_connection *tcpConnection, struct buffer *buffer) {</span></span>
<span class="line"><span>    int size = buffer_readable_size(buffer);</span></span>
<span class="line"><span>    int result = tcp_connection_send_data(tcpConnection, buffer-&amp;gt;data + buffer-&amp;gt;readIndex, size);</span></span>
<span class="line"><span>    buffer-&amp;gt;readIndex += size;</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_connection_send_data中，如果发现当前 channel 没有注册 WRITE 事件，并且当前 tcp_connection 对应的发送缓冲无数据需要发送，就直接调用 write 函数将数据发送出去。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//应用层调用入口</span></span>
<span class="line"><span>int tcp_connection_send_data(struct tcp_connection *tcpConnection, void *data, int size) {</span></span>
<span class="line"><span>    size_t nwrited = 0;</span></span>
<span class="line"><span>    size_t nleft = size;</span></span>
<span class="line"><span>    int fault = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct channel *channel = tcpConnection-&amp;gt;channel;</span></span>
<span class="line"><span>    struct buffer *output_buffer = tcpConnection-&amp;gt;output_buffer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //先往套接字尝试发送数据</span></span>
<span class="line"><span>    if (!channel_write_event_is_enabled(channel) &amp;&amp; buffer_readable_size(output_buffer) == 0) {</span></span>
<span class="line"><span>        nwrited = write(channel-&amp;gt;fd, data, size);</span></span>
<span class="line"><span>        if (nwrited &amp;gt;= 0) {</span></span>
<span class="line"><span>            nleft = nleft - nwrited;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            nwrited = 0;</span></span>
<span class="line"><span>            if (errno != EWOULDBLOCK) {</span></span>
<span class="line"><span>                if (errno == EPIPE || errno == ECONNRESET) {</span></span>
<span class="line"><span>                    fault = 1;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!fault &amp;&amp; nleft &amp;gt; 0) {</span></span>
<span class="line"><span>        //拷贝到Buffer中，Buffer的数据由框架接管</span></span>
<span class="line"><span>        buffer_append(output_buffer, data + nwrited, nleft);</span></span>
<span class="line"><span>        if (!channel_write_event_is_enabled(channel)) {</span></span>
<span class="line"><span>            channel_write_event_enable(channel);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return nwrited;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有同学不是很理解，为啥不能做成无论有没有 WRITE 事件都统一往发送缓冲区写，再把WRITE 事件注册到event_loop中呢？</p><p>这个问题问得非常好。我觉得有必要展开讲讲。</p><p>如果用一句话来总结的话，这是为了发送效率。</p><p>我们来分析一下，应用层读取数据，进行编码，之后的这个buffer对象是应用层创建的，数据也在应用层这个buffer对象上。你可以理解，tcp_connection_send_data里面的data数据其实是应用层缓冲的，而不是我们tcp_connection这个对象里面的buffer。</p><p>如果我们跳过直接往套接字发送这一段，而是把数据交给我们的tcp_connection对应的output_buffer，这里有一个数据拷贝的过程，它发生在buffer_append里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int buffer_append(struct buffer *buffer, void *data, int size) {</span></span>
<span class="line"><span>    if (data != NULL) {</span></span>
<span class="line"><span>        make_room(buffer, size);</span></span>
<span class="line"><span>        //拷贝数据到可写空间中</span></span>
<span class="line"><span>        memcpy(buffer-&amp;gt;data + buffer-&amp;gt;writeIndex, data, size);</span></span>
<span class="line"><span>        buffer-&amp;gt;writeIndex += size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是，如果增加了一段判断来直接往套接字发送，其实就跳过了这段拷贝，直接把数据发往到了套接字发生缓冲区。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//先往套接字尝试发送数据</span></span>
<span class="line"><span>if (!channel_write_event_is_enabled(channel) &amp;&amp; buffer_readable_size(output_buffer) == 0) {</span></span>
<span class="line"><span>        nwrited = write(channel-&amp;gt;fd, data, size)</span></span>
<span class="line"><span>        ...</span></span></code></pre></div><p>在绝大部分场景下，这种处理方式已经满足数据发送的需要了，不再需要把数据拷贝到tcp_connection对象中的output_buffer中。</p><p>如果不满足直接往套接字发送的条件，比如已经注册了回调事件，或者output_buffer里面有数据需要发送，那么就把数据拷贝到output_buffer中，让event_loop的回调不断地驱动handle_write将数据从output_buffer发往套接字缓冲区中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//发送缓冲区可以往外写</span></span>
<span class="line"><span>//把channel对应的output_buffer不断往外发送</span></span>
<span class="line"><span>int handle_write(void *data) {</span></span>
<span class="line"><span>    struct tcp_connection *tcpConnection = (struct tcp_connection *) data;</span></span>
<span class="line"><span>    struct event_loop *eventLoop = tcpConnection-&amp;gt;eventLoop;</span></span>
<span class="line"><span>    assertInSameThread(eventLoop);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct buffer *output_buffer = tcpConnection-&amp;gt;output_buffer;</span></span>
<span class="line"><span>    struct channel *channel = tcpConnection-&amp;gt;channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ssize_t nwrited = write(channel-&amp;gt;fd, output_buffer-&amp;gt;data + output_buffer-&amp;gt;readIndex,buffer_readable_size(output_buffer));</span></span>
<span class="line"><span>    if (nwrited &amp;gt; 0) {</span></span>
<span class="line"><span>        //已读nwrited字节</span></span>
<span class="line"><span>        output_buffer-&amp;gt;readIndex += nwrited;</span></span>
<span class="line"><span>        //如果数据完全发送出去，就不需要继续了</span></span>
<span class="line"><span>        if (buffer_readable_size(output_buffer) == 0) {</span></span>
<span class="line"><span>            channel_write_event_disable(channel);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //回调writeCompletedCallBack</span></span>
<span class="line"><span>        if (tcpConnection-&amp;gt;writeCompletedCallBack != NULL) {</span></span>
<span class="line"><span>            tcpConnection-&amp;gt;writeCompletedCallBack(tcpConnection);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        yolanda_msgx(&quot;handle_write for tcp connection %s&quot;, tcpConnection-&amp;gt;name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以这样想象，在一个非常高效的处理条件下，你需要发送什么，都直接发送给了套接字缓冲区；而当网络条件变差，处理效率变慢，或者待发送的数据极大，一次发送不可能完成的时候，这部分数据被框架缓冲到tcp_connection的发送缓冲区对象output_buffer中，由事件分发机制来负责把这部分数据发送给套接字缓冲区。</p><h2 id="关于回调函数的设计" tabindex="-1">关于回调函数的设计 <a class="header-anchor" href="#关于回调函数的设计" aria-label="Permalink to &quot;关于回调函数的设计&quot;">​</a></h2><p>在epoll-server-multithreads.c里面定义了很多回调函数，比如onMessage， onConnectionCompleted等，这些回调函数被用于创建一个TCPServer，但是在tcp_connection对照中，又实现了handle_read handle_write 等事件的回调，似乎有两层回调，为什么要这样封装两层回调呢？</p><p>这里如果说回调函数，确实有两个不同层次的回调函数。</p><p>第一个层次是框架定义的，对连接的生命周期管理的回调。包括连接建立完成后的回调、报文读取并接收到output缓冲区之后的回调、报文发送到套接字缓冲区之后的回调，以及连接关闭时的回调。分别是connectionCompletedCallBack、messageCallBack、writeCompletedCallBack，以及connectionClosedCallBack。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct tcp_connection {</span></span>
<span class="line"><span>    struct event_loop *eventLoop;</span></span>
<span class="line"><span>    struct channel *channel;</span></span>
<span class="line"><span>    char *name;</span></span>
<span class="line"><span>    struct buffer *input_buffer;   //接收缓冲区</span></span>
<span class="line"><span>    struct buffer *output_buffer;  //发送缓冲区</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    connection_completed_call_back connectionCompletedCallBack;</span></span>
<span class="line"><span>    message_call_back messageCallBack;</span></span>
<span class="line"><span>    write_completed_call_back writeCompletedCallBack;</span></span>
<span class="line"><span>    connection_closed_call_back connectionClosedCallBack;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void * data; //for callback use: http_server</span></span>
<span class="line"><span>    void * request; // for callback use</span></span>
<span class="line"><span>    void * response; // for callback use</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>为什么要定义这四个回调函数呢？</p><p>因为框架需要提供给应用程序和框架的编程接口，我把它总结为编程连接点，或者叫做program-hook-point。就像是设计了一个抽象类，这个抽象类代表了框架给你提供的一个编程入口，你可以继承这个抽象类，完成一些方法的填充，这些方法和框架类一起工作，就可以表现出一定符合逻辑的行为。</p><p>比如我们定义一个抽象类People，这个类的其他属性，包括它的创建和管理都可以交给框架来完成，但是你需要完成两个函数，一个是on_sad，这个人悲伤的时候干什么；另一个是on_happy，这个人高兴的时候干什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract class People{</span></span>
<span class="line"><span>  void on_sad();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void on_happy();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，我们可以试着把tcp_connection改成这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract class TCP_connection{</span></span>
<span class="line"><span>  void on_connection_completed();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void on_message();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void on_write_completed();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void on_connectin_closed();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个层次的回调，更像是一层框架和应用程序约定的接口，接口实现由应用程序来完成，框架负责在合适的时候调用这些预定义好的接口，回调的意思体现在“框架会调用预定好的接口实现”。</p><p>比如，当连接建立成功，一个新的connection创建出来，connectionCompletedCallBack函数会被回调：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct tcp_connection *</span></span>
<span class="line"><span>tcp_connection_new(int connected_fd, struct event_loop *eventLoop,</span></span>
<span class="line"><span>connection_completed_call_back connectionCompletedCallBack,</span></span>
<span class="line"><span>connection_closed_call_back connectionClosedCallBack,</span></span>
<span class="line"><span>message_call_back messageCallBack,</span></span>
<span class="line"><span>write_completed_call_back writeCompletedCallBack) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // add event read for the new connection</span></span>
<span class="line"><span>    struct channel *channel1 = channel_new(connected_fd, EVENT_READ, handle_read, handle_write, tcpConnection);</span></span>
<span class="line"><span>    tcpConnection-&amp;gt;channel = channel1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //connectionCompletedCallBack callback</span></span>
<span class="line"><span>    if (tcpConnection-&amp;gt;connectionCompletedCallBack != NULL) {</span></span>
<span class="line"><span>        tcpConnection-&amp;gt;connectionCompletedCallBack(tcpConnection);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二个层次的回调，是基于epoll、poll事件分发机制的回调。通过注册一定的读、写事件，在实际事件发生时，由事件分发机制保证对应的事件回调函数被及时调用，完成基于事件机制的网络I/O处理。</p><p>在每个连接建立之后，创建一个对应的channel对象，并为这个channel对象赋予了读、写回调函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// add event read for the new connection</span></span>
<span class="line"><span>struct channel *channel1 = channel_new(connected_fd, EVENT_READ, handle_read, handle_write, tcpConnection);</span></span></code></pre></div><p>handle_read函数，对应用程序屏蔽了套接字的读操作，把数据缓冲到tcp_connection的input_buffer中，而且，它还起到了编程连接点和框架的耦合器的作用，这里分别调用了messageCallBack和connectionClosedCallBack函数，完成了应用程序编写部分代码在框架的“代入”。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int handle_read(void *data) {</span></span>
<span class="line"><span>    struct tcp_connection *tcpConnection = (struct tcp_connection *) data;</span></span>
<span class="line"><span>    struct buffer *input_buffer = tcpConnection-&amp;gt;input_buffer;</span></span>
<span class="line"><span>    struct channel *channel = tcpConnection-&amp;gt;channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (buffer_socket_read(input_buffer, channel-&amp;gt;fd) &amp;gt; 0) {</span></span>
<span class="line"><span>        //应用程序真正读取Buffer里的数据</span></span>
<span class="line"><span>        if (tcpConnection-&amp;gt;messageCallBack != NULL) {</span></span>
<span class="line"><span>            tcpConnection-&amp;gt;messageCallBack(input_buffer, tcpConnection);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        handle_connection_closed(tcpConnection);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>handle_write函数则负责把tcp_connection对象里的output_buffer源源不断地送往套接字发送缓冲区。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//发送缓冲区可以往外写</span></span>
<span class="line"><span>//把channel对应的output_buffer不断往外发送</span></span>
<span class="line"><span>int handle_write(void *data) {</span></span>
<span class="line"><span>    struct tcp_connection *tcpConnection = (struct tcp_connection *) data;</span></span>
<span class="line"><span>    struct event_loop *eventLoop = tcpConnection-&amp;gt;eventLoop;</span></span>
<span class="line"><span>    assertInSameThread(eventLoop);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct buffer *output_buffer = tcpConnection-&amp;gt;output_buffer;</span></span>
<span class="line"><span>    struct channel *channel = tcpConnection-&amp;gt;channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ssize_t nwrited = write(channel-&amp;gt;fd, output_buffer-&amp;gt;data + output_buffer-&amp;gt;readIndex,buffer_readable_size(output_buffer));</span></span>
<span class="line"><span>    if (nwrited &amp;gt; 0) {</span></span>
<span class="line"><span>        //已读nwrited字节</span></span>
<span class="line"><span>        output_buffer-&amp;gt;readIndex += nwrited;</span></span>
<span class="line"><span>        //如果数据完全发送出去，就不需要继续了</span></span>
<span class="line"><span>        if (buffer_readable_size(output_buffer) == 0) {</span></span>
<span class="line"><span>            channel_write_event_disable(channel);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //回调writeCompletedCallBack</span></span>
<span class="line"><span>        if (tcpConnection-&amp;gt;writeCompletedCallBack != NULL) {</span></span>
<span class="line"><span>            tcpConnection-&amp;gt;writeCompletedCallBack(tcpConnection);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        yolanda_msgx(&quot;handle_write for tcp connection %s&quot;, tcpConnection-&amp;gt;name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="tcp-connection对象设计的想法是什么-和channel有什么联系和区别" tabindex="-1">tcp_connection对象设计的想法是什么，和channel有什么联系和区别？ <a class="header-anchor" href="#tcp-connection对象设计的想法是什么-和channel有什么联系和区别" aria-label="Permalink to &quot;tcp\\_connection对象设计的想法是什么，和channel有什么联系和区别？&quot;">​</a></h2><p>tcp_connection对象似乎和channel对象有着非常紧密的联系，为什么要单独设计一个tcp_connection呢？</p><p>我也提到了，开始的时候我并不打算设计一个tcp_connection对象的，后来我才发现非常有必要存在一个tcp_connection对象。</p><p>第一，我需要在暴露给应用程序的onMessage，onConnectionCompleted等回调函数里，传递一个有用的数据结构，这个数据结构必须有一定的现实语义，可以携带一定的信息，比如套接字、缓冲区等，而channel对象过于单薄，和连接的语义相去甚远。</p><p>第二，这个channel对象是抽象的，比如acceptor，比如socketpair等，它们都是一个channel，只要能引起事件的发生和传递，都是一个channel，基于这一点，我也觉得最好把chanel作为一个内部实现的细节，不要通过回调函数暴露给应用程序。</p><p>第三，在后面实现HTTP的过程中，我发现需要在上下文中保存http_request和http_response数据，而这个部分数据放在channel中是非常不合适的，所以才有了最后的tcp_connection对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct tcp_connection {</span></span>
<span class="line"><span>    struct event_loop *eventLoop;</span></span>
<span class="line"><span>    struct channel *channel;</span></span>
<span class="line"><span>    char *name;</span></span>
<span class="line"><span>    struct buffer *input_buffer;   //接收缓冲区</span></span>
<span class="line"><span>    struct buffer *output_buffer;  //发送缓冲区</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    connection_completed_call_back connectionCompletedCallBack;</span></span>
<span class="line"><span>    message_call_back messageCallBack;</span></span>
<span class="line"><span>    write_completed_call_back writeCompletedCallBack;</span></span>
<span class="line"><span>    connection_closed_call_back connectionClosedCallBack;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void * data; //for callback use: http_server</span></span>
<span class="line"><span>    void * request; // for callback use</span></span>
<span class="line"><span>    void * response; // for callback use</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>简单总结下来就是，每个tcp_connection对象一定包含了一个channel对象，而channel对象未必是一个tcp_connection对象。</p><h2 id="主线程等待子线程完成的同步锁问题" tabindex="-1">主线程等待子线程完成的同步锁问题 <a class="header-anchor" href="#主线程等待子线程完成的同步锁问题" aria-label="Permalink to &quot;主线程等待子线程完成的同步锁问题&quot;">​</a></h2><p>有人在加锁这里有个疑问，如果加锁的目的是让主线程等待子线程初始化event_loop，那不加锁不是也可以达到这个目的吗？主线程while循环里面不断判断子线程的event_loop是否不为null不就可以了？为什么一定要加一把锁呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//由主线程调用，初始化一个子线程，并且让子线程开始运行event_loop</span></span>
<span class="line"><span>struct event_loop *event_loop_thread_start(struct event_loop_thread *eventLoopThread) {</span></span>
<span class="line"><span>    pthread_create(&amp;eventLoopThread-&amp;gt;thread_tid, NULL, &amp;event_loop_thread_run, eventLoopThread);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    assert(pthread_mutex_lock(&amp;eventLoopThread-&amp;gt;mutex) == 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (eventLoopThread-&amp;gt;eventLoop == NULL) {</span></span>
<span class="line"><span>        assert(pthread_cond_wait(&amp;eventLoopThread-&amp;gt;cond, &amp;eventLoopThread-&amp;gt;mutex) == 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    assert(pthread_mutex_unlock(&amp;eventLoopThread-&amp;gt;mutex) == 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    yolanda_msgx(&quot;event loop thread started, %s&quot;, eventLoopThread-&amp;gt;thread_name);</span></span>
<span class="line"><span>    return eventLoopThread-&amp;gt;eventLoop;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>要回答这个问题，就要解释多线程下共享变量竞争的问题。我们知道，一个共享变量在多个线程下同时作用，如果没有锁的控制，就会引起变量的不同步。这里的共享变量就是每个eventLoopThread的eventLoop对象。</p><p>这里如果我们不加锁，一直循环判断每个eventLoopThread的状态，会对CPU增加很大的消耗，如果使用锁-信号量的方式来加以解决，就变得很优雅，而且不会对CPU造成过多的影响。</p><h2 id="关于channel-map的设计-特别是内存方面的设计。" tabindex="-1">关于channel_map的设计，特别是内存方面的设计。 <a class="header-anchor" href="#关于channel-map的设计-特别是内存方面的设计。" aria-label="Permalink to &quot;关于channel\\_map的设计，特别是内存方面的设计。&quot;">​</a></h2><p>我们来详细介绍一下channel_map。</p><p>channel_map实际上是一个指针数组，这个数组里面的每个元素都是一个指针，指向了创建出的channel对象。我们用数据下标和套接字进行了映射，这样虽然有些元素是浪费了，比如stdin，stdout，stderr代表的套接字0、1和2，但是总体效率是非常高的。</p><p>你在这里可以看到图中描绘了channel_map的设计。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/156948/a32869877c3bd54f8433267e009002fe.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/156948/a32869877c3bd54f8433267e009002fe.png" alt=""></a></p><p>而且，我们的channel_map还不会太占用内存，在最开始的时候，整个channel_map的指针数组大小为0，当这个channel_map投入使用时，会根据实际使用的套接字的增长，按照32、64、128这样的速度成倍增长，这样既保证了实际的需求，也不会一下子占用太多的内存。</p><p>此外，当指针数组增长时，我们不会销毁原来的部分，而是使用realloc()把旧的内容搬过去，再使用memset() 用来给新申请的内存初始化为0值，这样既高效也节省内存。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>以上就是实战篇中一些同学的疑问。</p><p>在这篇文章之后，我们的专栏就告一段落了，我希望这个专栏可以帮你梳理清楚高性能网络编程的方方面面，如果你能从中有所领悟，或者帮助你在面试中拿到好的结果，我会深感欣慰。</p><p>如果你觉得今天的答疑内容对你有所帮助，欢迎把它转发给你的朋友或者同事，一起交流一下。</p>`,69)])])}const h=a(t,[["render",l]]);export{_ as __pageData,h as default};
