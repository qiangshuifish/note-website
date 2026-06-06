import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"26 | 使用阻塞I/O和线程模型：换一种轻量的方式","description":"","frontmatter":{},"headers":[{"level":2,"title":"POSIX线程模型","slug":"posix线程模型","link":"#posix线程模型","children":[]},{"level":2,"title":"主要线程函数","slug":"主要线程函数","link":"#主要线程函数","children":[{"level":3,"title":"创建线程","slug":"创建线程","link":"#创建线程","children":[]},{"level":3,"title":"终止线程","slug":"终止线程","link":"#终止线程","children":[]},{"level":3,"title":"回收已终止线程的资源","slug":"回收已终止线程的资源","link":"#回收已终止线程的资源","children":[]},{"level":3,"title":"分离线程","slug":"分离线程","link":"#分离线程","children":[]}]},{"level":2,"title":"每个连接一个线程处理","slug":"每个连接一个线程处理","link":"#每个连接一个线程处理","children":[]},{"level":2,"title":"构建线程池处理多个连接","slug":"构建线程池处理多个连接","link":"#构建线程池处理多个连接","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/26-使用阻塞I-O和线程模型：换一种轻量的方式.md","filePath":"网络编程实战/26-使用阻塞I-O和线程模型：换一种轻量的方式.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/26-使用阻塞I-O和线程模型：换一种轻量的方式.md"};function t(i,a,c,o,d,r){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_26-使用阻塞i-o和线程模型-换一种轻量的方式" tabindex="-1">26 | 使用阻塞I/O和线程模型：换一种轻量的方式 <a class="header-anchor" href="#_26-使用阻塞i-o和线程模型-换一种轻量的方式" aria-label="Permalink to &quot;26 | 使用阻塞I/O和线程模型：换一种轻量的方式&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战第26讲，欢迎回来。</p><p>在前面一讲中，我们使用了进程模型来处理用户连接请求，进程切换上下文的代价是比较高的，幸运的是，有一种轻量级的模型可以处理多用户连接请求，这就是线程模型。这一讲里，我们就来了解一下线程模型。</p><p>线程（thread）是运行在进程中的一个“逻辑流”，现代操作系统都允许在单进程中运行多个线程。线程由操作系统内核管理。每个线程都有自己的上下文（context），包括一个可以唯一标识线程的ID（thread ID，或者叫tid）、栈、程序计数器、寄存器等。在同一个进程中，所有的线程共享该进程的整个虚拟地址空间，包括代码、数据、堆、共享库等。</p><p>在前面的程序中，我们没有显式使用线程，但这不代表线程没有发挥作用。实际上，每个进程一开始都会产生一个线程，一般被称为主线程，主线程可以再产生子线程，这样的主线程-子线程对可以叫做一个对等线程。</p><p>你可能会问，既然可以使用多进程来处理并发，为什么还要使用多线程模型呢？</p><p>简单来说，在同一个进程下，线程上下文切换的开销要比进程小得多。怎么理解线程上下文呢？我们的代码被CPU执行的时候，是需要一些数据支撑的，比如程序计数器告诉CPU代码执行到哪里了，寄存器里存了当前计算的一些中间值，内存里放置了一些当前用到的变量等，从一个计算场景，切换到另外一个计算场景，程序计数器、寄存器等这些值重新载入新场景的值，就是线程的上下文切换。</p><h2 id="posix线程模型" tabindex="-1">POSIX线程模型 <a class="header-anchor" href="#posix线程模型" aria-label="Permalink to &quot;POSIX线程模型&quot;">​</a></h2><p>POSIX线程是现代UNIX系统提供的处理线程的标准接口。POSIX定义的线程函数大约有60多个，这些函数可以帮助我们创建线程、回收线程。接下来我们先看一个简单的例子程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int another_shared = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void thread_run(void *arg) {</span></span>
<span class="line"><span>    int *calculator = (int *) arg;</span></span>
<span class="line"><span>    printf(&quot;hello, world, tid == %d \\n&quot;, pthread_self());</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 1000; i++) {</span></span>
<span class="line"><span>        *calculator += 1;</span></span>
<span class="line"><span>        another_shared += 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    int calculator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pthread_t tid1;</span></span>
<span class="line"><span>    pthread_t tid2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pthread_create(&amp;tid1, NULL, thread_run, &amp;calculator);</span></span>
<span class="line"><span>    pthread_create(&amp;tid2, NULL, thread_run, &amp;calculator);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pthread_join(tid1, NULL);</span></span>
<span class="line"><span>    pthread_join(tid2, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    printf(&quot;calculator is %d \\n&quot;, calculator);</span></span>
<span class="line"><span>    printf(&quot;another_shared is %d \\n&quot;, another_shared);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>thread_helloworld程序中，主线程依次创建了两个子线程，然后等待这两个子线程处理完毕之后终止。每个子线程都在对两个共享变量进行计算，最后在主线程中打印出最后的计算结果。</p><p>程序的第18和19行分别调用了pthread_create创建了两个线程，每个线程的入口都是thread_run函数，这里我们使用了calculator这个全局变量，并且通过传地址指针的方式，将这个值传给了thread_run函数。当调用pthread_create结束，子线程会立即执行，主线程在此后调用了pthread_join函数等待子线程结束。</p><p>运行这个程序，很幸运，计算的结果是正确的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$./thread-helloworld</span></span>
<span class="line"><span>hello, world, tid == 125607936</span></span>
<span class="line"><span>hello, world, tid == 126144512</span></span>
<span class="line"><span>calculator is 2000</span></span>
<span class="line"><span>another_shared is 2000</span></span></code></pre></div><h2 id="主要线程函数" tabindex="-1">主要线程函数 <a class="header-anchor" href="#主要线程函数" aria-label="Permalink to &quot;主要线程函数&quot;">​</a></h2><h3 id="创建线程" tabindex="-1">创建线程 <a class="header-anchor" href="#创建线程" aria-label="Permalink to &quot;创建线程&quot;">​</a></h3><p>正如前面看到，通过调用pthread_create函数来创建一个线程。这个函数的原型如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int pthread_create(pthread_t *tid, const pthread_attr_t *attr,</span></span>
<span class="line"><span>　　　　　　　　　　　void *(*func)(void *), void *arg);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>返回：若成功则为0，若出错则为正的Exxx值</span></span></code></pre></div><p>每个线程都有一个线程ID（tid）唯一来标识，其数据类型为pthread_t，一般是unsigned int。pthread_create函数的第一个输出参数tid就是代表了线程ID，如果创建线程成功，tid就返回正确的线程ID。</p><p>每个线程都会有很多属性，比如优先级、是否应该成为一个守护进程等，这些值可以通过pthread_attr_t来描述，一般我们不会特殊设置，可以直接指定这个参数为NULL。</p><p>第三个参数为新线程的入口函数，该函数可以接收一个参数arg，类型为指针，如果我们想给线程入口函数传多个值，那么需要把这些值包装成一个结构体，再把这个结构体的地址作为pthread_create的第四个参数，在线程入口函数内，再将该地址转为该结构体的指针对象。</p><p>在新线程的入口函数内，可以执行pthread_self函数返回线程tid。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pthread_t pthread_self(void)</span></span></code></pre></div><h3 id="终止线程" tabindex="-1">终止线程 <a class="header-anchor" href="#终止线程" aria-label="Permalink to &quot;终止线程&quot;">​</a></h3><p>终止一个线程最直接的方法是在父线程内调用以下函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void pthread_exit(void *status)</span></span></code></pre></div><p>当调用这个函数之后，父线程会等待其他所有的子线程终止，之后父线程自己终止。</p><p>当然，如果一个子线程入口函数直接退出了，那么子线程也就自然终止了。所以，绝大多数的子线程执行体都是一个无限循环。</p><p>也可以通过调用pthread_cancel来主动终止一个子线程，和pthread_exit不同的是，它可以指定某个子线程终止。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int pthread_cancel(pthread_t tid)</span></span></code></pre></div><h3 id="回收已终止线程的资源" tabindex="-1">回收已终止线程的资源 <a class="header-anchor" href="#回收已终止线程的资源" aria-label="Permalink to &quot;回收已终止线程的资源&quot;">​</a></h3><p>我们可以通过调用pthread_join回收已终止线程的资源：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int pthread_join(pthread_t tid, void ** thread_return)</span></span></code></pre></div><p>当调用pthread_join时，主线程会阻塞，直到对应tid的子线程自然终止。和pthread_cancel不同的是，它不会强迫子线程终止。</p><h3 id="分离线程" tabindex="-1">分离线程 <a class="header-anchor" href="#分离线程" aria-label="Permalink to &quot;分离线程&quot;">​</a></h3><p>一个线程的重要属性是可结合的，或者是分离的。一个可结合的线程是能够被其他线程杀死和回收资源的；而一个分离的线程不能被其他线程杀死或回收资源。一般来说，默认的属性是可结合的。</p><p>我们可以通过调用pthread_detach函数可以分离一个线程：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int pthread_detach(pthread_t tid)</span></span></code></pre></div><p>在高并发的例子里，每个连接都由一个线程单独处理，在这种情况下，服务器程序并不需要对每个子线程进行终止，这样的话，每个子线程可以在入口函数开始的地方，把自己设置为分离的，这样就能在它终止后自动回收相关的线程资源了，就不需要调用pthread_join函数了。</p><h2 id="每个连接一个线程处理" tabindex="-1">每个连接一个线程处理 <a class="header-anchor" href="#每个连接一个线程处理" aria-label="Permalink to &quot;每个连接一个线程处理&quot;">​</a></h2><p>接下来，我们改造一下服务器端程序。我们的目标是这样：每次有新的连接到达后，创建一个新线程，而不是用新进程来处理它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/common.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern void loop_echo(int);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void thread_run(void *arg) {</span></span>
<span class="line"><span>    pthread_detach(pthread_self());</span></span>
<span class="line"><span>    int fd = (int) arg;</span></span>
<span class="line"><span>    loop_echo(fd);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    int listener_fd = tcp_server_listen(SERV_PORT);</span></span>
<span class="line"><span>    pthread_t tid;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        struct sockaddr_storage ss;</span></span>
<span class="line"><span>        socklen_t slen = sizeof(ss);</span></span>
<span class="line"><span>        int fd = accept(listener_fd, (struct sockaddr *) &amp;ss, &amp;slen);</span></span>
<span class="line"><span>        if (fd &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &quot;accept failed&quot;);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            pthread_create(&amp;tid, NULL, &amp;thread_run, (void *) fd);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个程序的第18行阻塞调用在accept上，一旦有新连接建立，阻塞调用返回，调用pthread_create创建一个子线程来处理这个连接。</p><p>描述连接最主要的是连接描述字，这里通过强制把描述字转换为void *指针的方式，完成了传值。如果你对这部分有点不理解，建议看一下C语言相关的指针部分内容。我们这里可以简单总结一下，虽然传的是一个指针，但是这个指针里存放的并不是一个地址，而是连接描述符的数值。</p><p>新线程入口函数thread_run里，第6行使用了pthread_detach方法，将子线程转变为分离的，也就意味着子线程独自负责线程资源回收。第7行，强制将指针转变为描述符数据，和前面将描述字转换为void *指针对应，第8行调用loop_echo方法处理这个连接的数据读写。</p><p>loop_echo的程序如下，在接收客户端的数据之后，再编码回送出去。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>char rot13_char(char c) {</span></span>
<span class="line"><span>    if ((c &amp;gt;= &#39;a&#39; &amp;&amp; c &amp;lt;= &#39;m&#39;) || (c &amp;gt;= &#39;A&#39; &amp;&amp; c &amp;lt;= &#39;M&#39;))</span></span>
<span class="line"><span>        return c + 13;</span></span>
<span class="line"><span>    else if ((c &amp;gt;= &#39;n&#39; &amp;&amp; c &amp;lt;= &#39;z&#39;) || (c &amp;gt;= &#39;N&#39; &amp;&amp; c &amp;lt;= &#39;Z&#39;))</span></span>
<span class="line"><span>        return c - 13;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return c;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void loop_echo(int fd) {</span></span>
<span class="line"><span>    char outbuf[MAX_LINE + 1];</span></span>
<span class="line"><span>    size_t outbuf_used = 0;</span></span>
<span class="line"><span>    ssize_t result;</span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        char ch;</span></span>
<span class="line"><span>        result = recv(fd, &amp;ch, 1, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //断开连接或者出错</span></span>
<span class="line"><span>        if (result == 0) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        } else if (result == -1) {</span></span>
<span class="line"><span>            error(1, errno, &quot;read error&quot;);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (outbuf_used &amp;lt; sizeof(outbuf)) {</span></span>
<span class="line"><span>            outbuf[outbuf_used++] = rot13_char(ch);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (ch == &#39;\\n&#39;) {</span></span>
<span class="line"><span>            send(fd, outbuf, outbuf_used, 0);</span></span>
<span class="line"><span>            outbuf_used = 0;</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这个程序之后，开启多个telnet客户端，可以看到这个服务器程序可以处理多个并发连接并回送数据。单独一个连接退出也不会影响其他连接的数据收发。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to localhost.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>aaa</span></span>
<span class="line"><span>nnn</span></span>
<span class="line"><span>^]</span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><h2 id="构建线程池处理多个连接" tabindex="-1">构建线程池处理多个连接 <a class="header-anchor" href="#构建线程池处理多个连接" aria-label="Permalink to &quot;构建线程池处理多个连接&quot;">​</a></h2><p>上面的服务器端程序虽然可以正常工作，不过它有一个缺点，那就是如果并发连接过多，就会引起线程的频繁创建和销毁。虽然线程切换的上下文开销不大，但是线程创建和销毁的开销却是不小的。</p><p>能不能对这个程序进行一些优化呢？</p><p>我们可以使用预创建线程池的方式来进行优化。在服务器端启动时，可以先按照固定大小预创建出多个线程，当有新连接建立时，往连接字队列里放置这个新连接描述字，线程池里的线程负责从连接字队列里取出连接描述字进行处理。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/145464/d976c7b993862f0dbef75354d2f49672.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/145464/d976c7b993862f0dbef75354d2f49672.png" alt=""></a></p><p>这个程序的关键是连接字队列的设计，因为这里既有往这个队列里放置描述符的操作，也有从这个队列里取出描述符的操作。</p><p>对此，需要引入两个重要的概念，一个是锁mutex，一个是条件变量condition。锁很好理解，加锁的意思就是其他线程不能进入；条件变量则是在多个线程需要交互的情况下，用来线程间同步的原语。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义一个队列</span></span>
<span class="line"><span>typedef struct {</span></span>
<span class="line"><span>    int number;  //队列里的描述字最大个数</span></span>
<span class="line"><span>    int *fd;     //这是一个数组指针</span></span>
<span class="line"><span>    int front;   //当前队列的头位置</span></span>
<span class="line"><span>    int rear;    //当前队列的尾位置</span></span>
<span class="line"><span>    pthread_mutex_t mutex;  //锁</span></span>
<span class="line"><span>    pthread_cond_t cond;    //条件变量</span></span>
<span class="line"><span>} block_queue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//初始化队列</span></span>
<span class="line"><span>void block_queue_init(block_queue *blockQueue, int number) {</span></span>
<span class="line"><span>    blockQueue-&amp;gt;number = number;</span></span>
<span class="line"><span>    blockQueue-&amp;gt;fd = calloc(number, sizeof(int));</span></span>
<span class="line"><span>    blockQueue-&amp;gt;front = blockQueue-&amp;gt;rear = 0;</span></span>
<span class="line"><span>    pthread_mutex_init(&amp;blockQueue-&amp;gt;mutex, NULL);</span></span>
<span class="line"><span>    pthread_cond_init(&amp;blockQueue-&amp;gt;cond, NULL);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//往队列里放置一个描述字fd</span></span>
<span class="line"><span>void block_queue_push(block_queue *blockQueue, int fd) {</span></span>
<span class="line"><span>    //一定要先加锁，因为有多个线程需要读写队列</span></span>
<span class="line"><span>    pthread_mutex_lock(&amp;blockQueue-&amp;gt;mutex);</span></span>
<span class="line"><span>    //将描述字放到队列尾的位置</span></span>
<span class="line"><span>    blockQueue-&amp;gt;fd[blockQueue-&amp;gt;rear] = fd;</span></span>
<span class="line"><span>    //如果已经到最后，重置尾的位置</span></span>
<span class="line"><span>    if (++blockQueue-&amp;gt;rear == blockQueue-&amp;gt;number) {</span></span>
<span class="line"><span>        blockQueue-&amp;gt;rear = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    printf(&quot;push fd %d&quot;, fd);</span></span>
<span class="line"><span>    //通知其他等待读的线程，有新的连接字等待处理</span></span>
<span class="line"><span>    pthread_cond_signal(&amp;blockQueue-&amp;gt;cond);</span></span>
<span class="line"><span>    //解锁</span></span>
<span class="line"><span>    pthread_mutex_unlock(&amp;blockQueue-&amp;gt;mutex);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//从队列里读出描述字进行处理</span></span>
<span class="line"><span>int block_queue_pop(block_queue *blockQueue) {</span></span>
<span class="line"><span>    //加锁</span></span>
<span class="line"><span>    pthread_mutex_lock(&amp;blockQueue-&amp;gt;mutex);</span></span>
<span class="line"><span>    //判断队列里没有新的连接字可以处理，就一直条件等待，直到有新的连接字入队列</span></span>
<span class="line"><span>    while (blockQueue-&amp;gt;front == blockQueue-&amp;gt;rear)</span></span>
<span class="line"><span>        pthread_cond_wait(&amp;blockQueue-&amp;gt;cond, &amp;blockQueue-&amp;gt;mutex);</span></span>
<span class="line"><span>    //取出队列头的连接字</span></span>
<span class="line"><span>    int fd = blockQueue-&amp;gt;fd[blockQueue-&amp;gt;front];</span></span>
<span class="line"><span>    //如果已经到最后，重置头的位置</span></span>
<span class="line"><span>    if (++blockQueue-&amp;gt;front == blockQueue-&amp;gt;number) {</span></span>
<span class="line"><span>        blockQueue-&amp;gt;front = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    printf(&quot;pop fd %d&quot;, fd);</span></span>
<span class="line"><span>    //解锁</span></span>
<span class="line"><span>    pthread_mutex_unlock(&amp;blockQueue-&amp;gt;mutex);</span></span>
<span class="line"><span>    //返回连接字</span></span>
<span class="line"><span>    return fd;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有block_queue相关的定义和实现，并在关键的地方加了一些注释，有几个地方需要特别注意：</p><p>第一是记得对操作进行加锁和解锁，这里是通过pthread_mutex_lock和pthread_mutex_unlock来完成的。</p><p>第二是当工作线程没有描述字可用时，需要等待，第43行通过调用pthread_cond_wait，所有的工作线程等待有新的描述字可达。第32行，主线程通知工作线程有新的描述符需要服务。</p><p>服务器端程序如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void thread_run(void *arg) {</span></span>
<span class="line"><span>    pthread_t tid = pthread_self();</span></span>
<span class="line"><span>    pthread_detach(tid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    block_queue *blockQueue = (block_queue *) arg;</span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        int fd = block_queue_pop(blockQueue);</span></span>
<span class="line"><span>        printf(&quot;get fd in thread, fd==%d, tid == %d&quot;, fd, tid);</span></span>
<span class="line"><span>        loop_echo(fd);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    int listener_fd = tcp_server_listen(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    block_queue blockQueue;</span></span>
<span class="line"><span>    block_queue_init(&amp;blockQueue, BLOCK_QUEUE_SIZE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    thread_array = calloc(THREAD_NUMBER, sizeof(Thread));</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; THREAD_NUMBER; i++) {</span></span>
<span class="line"><span>        pthread_create(&amp;(thread_array[i].thread_tid), NULL, &amp;thread_run, (void *) &amp;blockQueue);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        struct sockaddr_storage ss;</span></span>
<span class="line"><span>        socklen_t slen = sizeof(ss);</span></span>
<span class="line"><span>        int fd = accept(listener_fd, (struct sockaddr *) &amp;ss, &amp;slen);</span></span>
<span class="line"><span>        if (fd &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &quot;accept failed&quot;);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            block_queue_push(&amp;blockQueue, fd);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了描述字队列，主程序变得非常简洁。第19-23行预创建了多个线程，组成了一个线程池。28-32行在新连接建立后，将连接描述字加入到队列中。</p><p>7-9行是工作线程的主循环，从描述字队列中取出描述字，对这个连接进行服务处理。</p><p>同样的，运行这个程序之后，开启多个telnet客户端，可以看到这个服务器程序可以正常处理多个并发连接并回显。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to localhost.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>aaa</span></span>
<span class="line"><span>nnn</span></span>
<span class="line"><span>^]</span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><p>和前面的程序相比，线程创建和销毁的开销大大降低，但因为线程池大小固定，又因为使用了阻塞套接字，肯定会出现有连接得不到及时服务的场景。这个问题的解决还是要回到我在开篇词里提到的方案上来，多路I/O复用加上线程来处理，仅仅使用阻塞I/O模型和线程是没有办法达到极致的高并发处理能力。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这一讲，我们使用了线程来构建服务器端程序。一种是每次动态创建线程，另一种是使用线程池提高效率。和进程相比，线程的语义更轻量，使用的场景也更多。线程是高性能网络服务器必须掌握的核心知识，希望你能够通过本讲的学习，牢牢掌握它。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>和往常一样，给你留两道思考题。</p><p>第一道，连接字队列的实现里，有一个重要情况没有考虑，就是队列里没有可用的位置了，想想看，如何对这种情况进行优化？</p><p>第二道，我在讲到第一个hello-world计数器应用时，说“结果是幸运”这是为什么呢？怎么理解呢？</p><p>欢迎你在评论区写下你的思考，我会和你一起思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,74)])])}const _=s(l,[["render",t]]);export{h as __pageData,_ as default};
