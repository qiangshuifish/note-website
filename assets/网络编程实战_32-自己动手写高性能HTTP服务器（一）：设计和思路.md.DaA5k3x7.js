import{_ as a,H as e,f as s,i as p}from"./chunks/framework.BH2BK_3i.js";const v=JSON.parse('{"title":"32 | 自己动手写高性能HTTP服务器（一）：设计和思路","description":"","frontmatter":{},"headers":[{"level":2,"title":"设计需求","slug":"设计需求","link":"#设计需求","children":[]},{"level":2,"title":"主要设计思路","slug":"主要设计思路","link":"#主要设计思路","children":[{"level":3,"title":"反应堆模式设计","slug":"反应堆模式设计","link":"#反应堆模式设计","children":[]},{"level":3,"title":"I/O模型和多线程模型设计","slug":"i-o模型和多线程模型设计","link":"#i-o模型和多线程模型设计","children":[]},{"level":3,"title":"Buffer和数据读写","slug":"buffer和数据读写","link":"#buffer和数据读写","children":[]}]},{"level":2,"title":"反应堆模式设计","slug":"反应堆模式设计-1","link":"#反应堆模式设计-1","children":[{"level":3,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":3,"title":"event_loop分析","slug":"event-loop分析","link":"#event-loop分析","children":[]},{"level":3,"title":"event_dispacher分析","slug":"event-dispacher分析","link":"#event-dispacher分析","children":[]},{"level":3,"title":"channel对象分析","slug":"channel对象分析","link":"#channel对象分析","children":[]},{"level":3,"title":"channel_map对象分析","slug":"channel-map对象分析","link":"#channel-map对象分析","children":[]},{"level":3,"title":"增加、删除、修改channel event","slug":"增加、删除、修改channel-event","link":"#增加、删除、修改channel-event","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/32-自己动手写高性能HTTP服务器（一）：设计和思路.md","filePath":"网络编程实战/32-自己动手写高性能HTTP服务器（一）：设计和思路.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/32-自己动手写高性能HTTP服务器（一）：设计和思路.md"};function t(i,n,c,o,r,h){return e(),s("div",null,[...n[0]||(n[0]=[p(`<h1 id="_32-自己动手写高性能http服务器-一-设计和思路" tabindex="-1">32 | 自己动手写高性能HTTP服务器（一）：设计和思路 <a class="header-anchor" href="#_32-自己动手写高性能http服务器-一-设计和思路" aria-label="Permalink to &quot;32 | 自己动手写高性能HTTP服务器（一）：设计和思路&quot;">​</a></h1><p>\b你好，我是盛延敏，这里是网络编程实战第32讲，欢迎回来。</p><p>从这一讲开始，我们进入实战篇，开启一个高性能HTTP服务器的编写之旅。</p><p>在开始编写高性能HTTP服务器之前，我们先要构建一个支持TCP的高性能网络编程框架，完成这个TCP高性能网络框架之后，再增加HTTP特性的支持就比较容易了，这样就可以很快开发出一个高性能的HTTP服务器程序。</p><h2 id="设计需求" tabindex="-1">设计需求 <a class="header-anchor" href="#设计需求" aria-label="Permalink to &quot;设计需求&quot;">​</a></h2><p>在第三个模块性能篇中，我们已经使用这个网络编程框架完成了多个应用程序的开发，这也等于对网络编程框架提出了编程接口方面的需求。综合之前的使用经验，TCP高性能网络框架需要满足的需求有以下三点。</p><p>第一，采用reactor模型，可以灵活使用poll/epoll作为事件分发实现。</p><p>第二，必须支持多线程，从而可以支持单线程单reactor模式，也可以支持多线程主-从reactor模式。可以将套接字上的I/O事件分离到多个线程上。</p><p>第三，封装读写操作到Buffer对象中。</p><p>按照这三个需求，正好可以把整体设计思路分成三块来讲解，分别包括反应堆模式设计、I/O模型和多线程模型设计、数据读写封装和buffer。今天我们主要讲一下主要的设计思路和数据结构，以及反应堆模式设计。</p><h2 id="主要设计思路" tabindex="-1">主要设计思路 <a class="header-anchor" href="#主要设计思路" aria-label="Permalink to &quot;主要设计思路&quot;">​</a></h2><h3 id="反应堆模式设计" tabindex="-1">反应堆模式设计 <a class="header-anchor" href="#反应堆模式设计" aria-label="Permalink to &quot;反应堆模式设计&quot;">​</a></h3><p>反应堆模式，按照性能篇的讲解，主要是设计一个基于事件分发和回调的反应堆框架。这个框架里面的主要对象包括：</p><ul><li><h3 id="event-loop" tabindex="-1">event_loop <a class="header-anchor" href="#event-loop" aria-label="Permalink to &quot;event\\_loop&quot;">​</a></h3></li></ul><p>你可以把event_loop这个对象理解成和一个线程绑定的无限事件循环，你会在各种语言里看到event_loop这个抽象。这是什么意思呢？简单来说，它就是一个无限循环着的事件分发器，一旦有事件发生，它就会回调预先定义好的回调函数，完成事件的处理。</p><p>具体来说，event_loop使用poll或者epoll方法将一个线程阻塞，等待各种I/O事件的发生。</p><ul><li><h3 id="channel" tabindex="-1">channel <a class="header-anchor" href="#channel" aria-label="Permalink to &quot;channel&quot;">​</a></h3></li></ul><p>对各种注册到event_loop上的对象，我们抽象成channel来表示，例如注册到event_loop上的监听事件，注册到event_loop上的套接字读写事件等。在各种语言的API里，你都会看到channel这个对象，大体上它们表达的意思跟我们这里的设计思路是比较一致的。</p><ul><li><h3 id="acceptor" tabindex="-1">acceptor <a class="header-anchor" href="#acceptor" aria-label="Permalink to &quot;acceptor&quot;">​</a></h3></li></ul><p>acceptor对象表示的是服务器端监听器，acceptor对象最终会作为一个channel对象，注册到event_loop上，以便进行连接完成的事件分发和检测。</p><ul><li><h3 id="event-dispatcher" tabindex="-1">event_dispatcher <a class="header-anchor" href="#event-dispatcher" aria-label="Permalink to &quot;event\\_dispatcher&quot;">​</a></h3></li></ul><p>event_dispatcher是对事件分发机制的一种抽象，也就是说，可以实现一个基于poll的poll_dispatcher，也可以实现一个基于epoll的epoll_dispatcher。在这里，我们统一设计一个event_dispatcher结构体，来抽象这些行为。</p><ul><li><h3 id="channel-map" tabindex="-1">channel_map <a class="header-anchor" href="#channel-map" aria-label="Permalink to &quot;channel\\_map&quot;">​</a></h3></li></ul><p>channel_map保存了描述字到channel的映射，这样就可以在事件发生时，根据事件类型对应的套接字快速找到channel对象里的事件处理函数。</p><h3 id="i-o模型和多线程模型设计" tabindex="-1">I/O模型和多线程模型设计 <a class="header-anchor" href="#i-o模型和多线程模型设计" aria-label="Permalink to &quot;I/O模型和多线程模型设计&quot;">​</a></h3><p>I/O线程和多线程模型，主要解决event_loop的线程运行问题，以及事件分发和回调的线程执行问题。</p><ul><li><h3 id="thread-pool" tabindex="-1">thread_pool <a class="header-anchor" href="#thread-pool" aria-label="Permalink to &quot;thread\\_pool&quot;">​</a></h3></li></ul><p>thread_pool维护了一个sub-reactor的线程列表，它可以提供给主reactor线程使用，每次当有新的连接建立时，可以从thread_pool里获取一个线程，以便用它来完成对新连接套接字的read/write事件注册，将I/O线程和主reactor线程分离。</p><ul><li><h3 id="event-loop-thread" tabindex="-1">event_loop_thread <a class="header-anchor" href="#event-loop-thread" aria-label="Permalink to &quot;event\\_loop\\_thread&quot;">​</a></h3></li></ul><p>event_loop_thread是reactor的线程实现，连接套接字的read/write事件检测都是在这个线程里完成的。</p><h3 id="buffer和数据读写" tabindex="-1">Buffer和数据读写 <a class="header-anchor" href="#buffer和数据读写" aria-label="Permalink to &quot;Buffer和数据读写&quot;">​</a></h3><ul><li><h3 id="buffer" tabindex="-1">buffer <a class="header-anchor" href="#buffer" aria-label="Permalink to &quot;buffer&quot;">​</a></h3></li></ul><p>buffer对象屏蔽了对套接字进行的写和读的操作，如果没有buffer对象，连接套接字的read/write事件都需要和字节流直接打交道，这显然是不友好的。所以，我们也提供了一个基本的buffer对象，用来表示从连接套接字收取的数据，以及应用程序即将需要发送出去的数据。</p><ul><li><h3 id="tcp-connection" tabindex="-1">tcp_connection <a class="header-anchor" href="#tcp-connection" aria-label="Permalink to &quot;tcp\\_connection&quot;">​</a></h3></li></ul><p>tcp_connection这个对象描述的是已建立的TCP连接。它的属性包括接收缓冲区、发送缓冲区、channel对象等。这些都是一个TCP连接的天然属性。</p><p>tcp_connection是大部分应用程序和我们的高性能框架直接打交道的数据结构。我们不想把最下层的channel对象暴露给应用程序，因为抽象的channel对象不仅仅可以表示tcp_connection，前面提到的监听套接字也是一个channel对象，后面提到的唤醒socketpair也是一个 channel对象。所以，我们设计了tcp_connection这个对象，希望可以提供给用户比较清晰的编程入口。</p><h2 id="反应堆模式设计-1" tabindex="-1">反应堆模式设计 <a class="header-anchor" href="#反应堆模式设计-1" aria-label="Permalink to &quot;反应堆模式设计&quot;">​</a></h2><h3 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h3><p>下面，我们详细讲解一下以event_loop为核心的反应堆模式设计。这里有一张event_loop的运行详图，你可以对照这张图来理解。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/152668/7ab9f89544aba2021a9d2ceb94ad9661.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/152668/7ab9f89544aba2021a9d2ceb94ad9661.jpg" alt=""></a></p><p>当event_loop_run完成之后，线程进入循环，首先执行dispatch事件分发，一旦有事件发生，就会调用channel_event_activate函数，在这个函数中完成事件回调函数eventReadcallback和eventWritecallback的调用，最后再进行event_loop_handle_pending_channel，用来修改当前监听的事件列表，完成这个部分之后，又进入了事件分发循环。</p><h3 id="event-loop分析" tabindex="-1">event_loop分析 <a class="header-anchor" href="#event-loop分析" aria-label="Permalink to &quot;event\\_loop分析&quot;">​</a></h3><p>说event_loop是整个反应堆模式设计的核心，一点也不为过。先看一下event_loop的数据结构。</p><p>在这个数据结构中，最重要的莫过于event_dispatcher对象了。你可以简单地把event_dispatcher理解为poll或者epoll，它可以让我们的线程挂起，等待事件的发生。</p><p>这里有一个小技巧，就是event_dispatcher_data，它被定义为一个void *类型，可以按照我们的需求，任意放置一个我们需要的对象指针。这样，针对不同的实现，例如poll或者epoll，都可以根据需求，放置不同的数据对象。</p><p>event_loop中还保留了几个跟多线程有关的对象，如owner_thread_id是保留了每个event loop的线程ID，mutex和con是用来进行线程同步的。</p><p>socketPair是父线程用来通知子线程有新的事件需要处理。pending_head和pending_tail是保留在子线程内的需要处理的新事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct event_loop {</span></span>
<span class="line"><span>    int quit;</span></span>
<span class="line"><span>    const struct event_dispatcher *eventDispatcher;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** 对应的event_dispatcher的数据. */</span></span>
<span class="line"><span>    void *event_dispatcher_data;</span></span>
<span class="line"><span>    struct channel_map *channelMap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int is_handle_pending;</span></span>
<span class="line"><span>    struct channel_element *pending_head;</span></span>
<span class="line"><span>    struct channel_element *pending_tail;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pthread_t owner_thread_id;</span></span>
<span class="line"><span>    pthread_mutex_t mutex;</span></span>
<span class="line"><span>    pthread_cond_t cond;</span></span>
<span class="line"><span>    int socketPair[2];</span></span>
<span class="line"><span>    char *thread_name;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>下面我们看一下event_loop最主要的方法event_loop_run方法，前面提到过，event_loop就是一个无限while循环，不断地在分发事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 1.参数验证</span></span>
<span class="line"><span> * 2.调用dispatcher来进行事件分发,分发完回调事件处理函数</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>int event_loop_run(struct event_loop *eventLoop) {</span></span>
<span class="line"><span>    assert(eventLoop != NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct event_dispatcher *dispatcher = eventLoop-&amp;gt;eventDispatcher;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (eventLoop-&amp;gt;owner_thread_id != pthread_self()) {</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    yolanda_msgx(&quot;event loop run, %s&quot;, eventLoop-&amp;gt;thread_name);</span></span>
<span class="line"><span>    struct timeval timeval;</span></span>
<span class="line"><span>    timeval.tv_sec = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (!eventLoop-&amp;gt;quit) {</span></span>
<span class="line"><span>        //block here to wait I/O event, and get active channels</span></span>
<span class="line"><span>        dispatcher-&amp;gt;dispatch(eventLoop, &amp;timeval);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //handle the pending channel</span></span>
<span class="line"><span>        event_loop_handle_pending_channel(eventLoop);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    yolanda_msgx(&quot;event loop end, %s&quot;, eventLoop-&amp;gt;thread_name);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码很明显地反映了这一点，这里我们在event_loop不退出的情况下，一直在循环，循环体中调用了dispatcher对象的dispatch方法来等待事件的发生。</p><h3 id="event-dispacher分析" tabindex="-1">event_dispacher分析 <a class="header-anchor" href="#event-dispacher分析" aria-label="Permalink to &quot;event\\_dispacher分析&quot;">​</a></h3><p>为了实现不同的事件分发机制，这里把poll、epoll等抽象成了一个event_dispatcher结构。event_dispatcher的具体实现有poll_dispatcher和epoll_dispatcher两种，实现的方法和性能篇 <a href="https://time.geekbang.org/column/article/140520" target="_blank" rel="noreferrer">21</a> <a href="https://time.geekbang.org/column/article/140520" target="_blank" rel="noreferrer">讲</a> 和 <a href="https://time.geekbang.org/column/article/141573" target="_blank" rel="noreferrer">22讲</a> 类似，这里就不再赘述，你如果有兴趣的话，可以直接研读代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** 抽象的event_dispatcher结构体，对应的实现如select,poll,epoll等I/O复用. */</span></span>
<span class="line"><span>struct event_dispatcher {</span></span>
<span class="line"><span>    /**  对应实现 */</span></span>
<span class="line"><span>    const char *name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**  初始化函数 */</span></span>
<span class="line"><span>    void *(*init)(struct event_loop * eventLoop);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** 通知dispatcher新增一个channel事件*/</span></span>
<span class="line"><span>    int (*add)(struct event_loop * eventLoop, struct channel * channel);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** 通知dispatcher删除一个channel事件*/</span></span>
<span class="line"><span>    int (*del)(struct event_loop * eventLoop, struct channel * channel);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** 通知dispatcher更新channel对应的事件*/</span></span>
<span class="line"><span>    int (*update)(struct event_loop * eventLoop, struct channel * channel);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** 实现事件分发，然后调用event_loop的event_activate方法执行callback*/</span></span>
<span class="line"><span>    int (*dispatch)(struct event_loop * eventLoop, struct timeval *);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** 清除数据 */</span></span>
<span class="line"><span>    void (*clear)(struct event_loop * eventLoop);</span></span>
<span class="line"><span>};</span></span></code></pre></div><h3 id="channel对象分析" tabindex="-1">channel对象分析 <a class="header-anchor" href="#channel对象分析" aria-label="Permalink to &quot;channel对象分析&quot;">​</a></h3><p>channel对象是用来和event_dispather进行交互的最主要的结构体，它抽象了事件分发。一个channel对应一个描述字，描述字上可以有READ可读事件，也可以有WRITE可写事件。channel对象绑定了事件处理函数event_read_callback和event_write_callback。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef int (*event_read_callback)(void *data);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef int (*event_write_callback)(void *data);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct channel {</span></span>
<span class="line"><span>    int fd;</span></span>
<span class="line"><span>    int events;   //表示event类型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    event_read_callback eventReadCallback;</span></span>
<span class="line"><span>    event_write_callback eventWriteCallback;</span></span>
<span class="line"><span>    void *data; //callback data, 可能是event_loop，也可能是tcp_server或者tcp_connection</span></span>
<span class="line"><span>};</span></span></code></pre></div><h3 id="channel-map对象分析" tabindex="-1">channel_map对象分析 <a class="header-anchor" href="#channel-map对象分析" aria-label="Permalink to &quot;channel\\_map对象分析&quot;">​</a></h3><p>event_dispatcher在获得活动事件列表之后，需要通过文件描述字找到对应的channel，从而回调channel上的事件处理函数event_read_callback和event_write_callback，为此，设计了channel_map对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * channel映射表, key为对应的socket描述字</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct channel_map {</span></span>
<span class="line"><span>    void **entries;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* The number of entries available in entries */</span></span>
<span class="line"><span>    int nentries;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>channel_map对象是一个数组，数组的下标即为描述字，数组的元素为channel对象的地址。</p><p>比如描述字3对应的channel，就可以这样直接得到。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct chanenl * channel = map-&amp;gt;entries[3];</span></span></code></pre></div><p>这样，当event_dispatcher需要回调channel上的读、写函数时，调用channel_event_activate就可以，下面是channel_event_activate的实现，在找到了对应的channel对象之后，根据事件类型，回调了读函数或者写函数。注意，这里使用了EVENT_READ和EVENT_WRITE来抽象了poll和epoll的所有读写事件类型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int channel_event_activate(struct event_loop *eventLoop, int fd, int revents) {</span></span>
<span class="line"><span>    struct channel_map *map = eventLoop-&amp;gt;channelMap;</span></span>
<span class="line"><span>    yolanda_msgx(&quot;activate channel fd == %d, revents=%d, %s&quot;, fd, revents, eventLoop-&amp;gt;thread_name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (fd &amp;lt; 0)</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (fd &amp;gt;= map-&amp;gt;nentries)return (-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct channel *channel = map-&amp;gt;entries[fd];</span></span>
<span class="line"><span>    assert(fd == channel-&amp;gt;fd);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (revents &amp; (EVENT_READ)) {</span></span>
<span class="line"><span>        if (channel-&amp;gt;eventReadCallback) channel-&amp;gt;eventReadCallback(channel-&amp;gt;data);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (revents &amp; (EVENT_WRITE)) {</span></span>
<span class="line"><span>        if (channel-&amp;gt;eventWriteCallback) channel-&amp;gt;eventWriteCallback(channel-&amp;gt;data);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="增加、删除、修改channel-event" tabindex="-1">增加、删除、修改channel event <a class="header-anchor" href="#增加、删除、修改channel-event" aria-label="Permalink to &quot;增加、删除、修改channel event&quot;">​</a></h3><p>那么如何增加新的channel event事件呢？下面这几个函数是用来增加、删除和修改channel event事件的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int event_loop_add_channel_event(struct event_loop *eventLoop, int fd, struct channel *channel1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int event_loop_remove_channel_event(struct event_loop *eventLoop, int fd, struct channel *channel1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int event_loop_update_channel_event(struct event_loop *eventLoop, int fd, struct channel *channel1);</span></span></code></pre></div><p>前面三个函数提供了入口能力，而真正的实现则落在这三个函数上：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int event_loop_handle_pending_add(struct event_loop *eventLoop, int fd, struct channel *channel);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int event_loop_handle_pending_remove(struct event_loop *eventLoop, int fd, struct channel *channel);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int event_loop_handle_pending_update(struct event_loop *eventLoop, int fd, struct channel *channel);</span></span></code></pre></div><p>我们看一下其中的一个实现，event_loop_handle_pending_add在当前event_loop的channel_map里增加一个新的key-value对，key是文件描述字，value是channel对象的地址。之后调用event_dispatcher对象的add方法增加channel event事件。注意这个方法总在当前的I/O线程中执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// in the i/o thread</span></span>
<span class="line"><span>int event_loop_handle_pending_add(struct event_loop *eventLoop, int fd, struct channel *channel) {</span></span>
<span class="line"><span>    yolanda_msgx(&quot;add channel fd == %d, %s&quot;, fd, eventLoop-&amp;gt;thread_name);</span></span>
<span class="line"><span>    struct channel_map *map = eventLoop-&amp;gt;channelMap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (fd &amp;lt; 0)</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (fd &amp;gt;= map-&amp;gt;nentries) {</span></span>
<span class="line"><span>        if (map_make_space(map, fd, sizeof(struct channel *)) == -1)</span></span>
<span class="line"><span>            return (-1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //第一次创建，增加</span></span>
<span class="line"><span>    if ((map)-&amp;gt;entries[fd] == NULL) {</span></span>
<span class="line"><span>        map-&amp;gt;entries[fd] = channel;</span></span>
<span class="line"><span>        //add channel</span></span>
<span class="line"><span>        struct event_dispatcher *eventDispatcher = eventLoop-&amp;gt;eventDispatcher;</span></span>
<span class="line"><span>        eventDispatcher-&amp;gt;add(eventLoop, channel);</span></span>
<span class="line"><span>        return 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在这一讲里，我们介绍了高性能网络编程框架的主要设计思路和基本数据结构，以及反应堆设计相关的具体做法。在接下来的章节中，我们将继续编写高性能网络编程框架的线程模型以及读写Buffer部分。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>和往常一样，给你留两道思考题:</p><p>第一道，如果你有兴趣，不妨实现一个select_dispatcher对象，用select方法实现定义好的event_dispatcher接口；</p><p>第二道，仔细研读channel_map实现中的map_make_space部分，说说你的理解。</p><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,79)])])}const _=a(l,[["render",t]]);export{v as __pageData,_ as default};
