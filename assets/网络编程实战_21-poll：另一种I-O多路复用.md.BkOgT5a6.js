import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"21 | poll：另一种I/O多路复用","description":"","frontmatter":{},"headers":[{"level":2,"title":"poll函数介绍","slug":"poll函数介绍","link":"#poll函数介绍","children":[]},{"level":2,"title":"基于poll的服务器程序","slug":"基于poll的服务器程序","link":"#基于poll的服务器程序","children":[]},{"level":2,"title":"实验","slug":"实验","link":"#实验","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/21-poll：另一种I-O多路复用.md","filePath":"网络编程实战/21-poll：另一种I-O多路复用.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/21-poll：另一种I-O多路复用.md"};function t(i,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_21-poll-另一种i-o多路复用" tabindex="-1">21 | poll：另一种I/O多路复用 <a class="header-anchor" href="#_21-poll-另一种i-o多路复用" aria-label="Permalink to &quot;21 | poll：另一种I/O多路复用&quot;">​</a></h1><p>你好，我是盛延敏，这是网络编程实战第21讲，欢迎回来。</p><p>上一讲我们讲到了I/O多路复用技术，并以select为核心，展示了I/O多路复用技术的能力。select方法是多个UNIX平台支持的非常常见的I/O多路复用技术，它通过描述符集合来表示检测的I/O对象，通过三个不同的描述符集合来描述I/O事件 ：可读、可写和异常。但是select有一个缺点，那就是所支持的文件描述符的个数是有限的。在Linux系统中，select的默认最大值为1024。</p><p>那么有没有别的I/O多路复用技术可以突破文件描述符个数限制呢？当然有，这就是poll函数。这一讲，我们就来学习一下另一种I/O多路复用的技术：poll。</p><h2 id="poll函数介绍" tabindex="-1">poll函数介绍 <a class="header-anchor" href="#poll函数介绍" aria-label="Permalink to &quot;poll函数介绍&quot;">​</a></h2><p>poll是除了select之外，另一种普遍使用的I/O多路复用技术，和select相比，它和内核交互的数据结构有所变化，另外，也突破了文件描述符的个数限制。</p><p>下面是poll函数的原型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int poll(struct pollfd *fds, unsigned long nfds, int timeout);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>返回值：若有就绪描述符则为其数目，若超时则为0，若出错则为-1</span></span></code></pre></div><p>这个函数里面输入了三个参数，第一个参数是一个pollfd的数组。其中pollfd的结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct pollfd {</span></span>
<span class="line"><span>    int    fd;       /* file descriptor */</span></span>
<span class="line"><span>    short  events;   /* events to look for */</span></span>
<span class="line"><span>    short  revents;  /* events returned */</span></span>
<span class="line"><span> };</span></span></code></pre></div><p>这个结构体由三个部分组成，首先是描述符fd，然后是描述符上待检测的事件类型events，注意这里的events可以表示多个不同的事件，具体的实现可以通过使用二进制掩码位操作来完成，例如，POLLIN和POLLOUT可以表示读和写事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define    POLLIN    0x0001    /* any readable data available */</span></span>
<span class="line"><span>#define    POLLPRI   0x0002    /* OOB/Urgent readable data */</span></span>
<span class="line"><span>#define    POLLOUT   0x0004    /* file descriptor is writeable */</span></span></code></pre></div><p>和select非常不同的地方在于，poll每次检测之后的结果不会修改原来的传入值，而是将结果保留在revents字段中，这样就不需要每次检测完都得重置待检测的描述字和感兴趣的事件。我们可以把revents理解成“returned events”。</p><p>events类型的事件可以分为两大类。</p><p>第一类是可读事件，有以下几种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define POLLIN     0x0001    /* any readable data available */</span></span>
<span class="line"><span>#define POLLPRI    0x0002    /* OOB/Urgent readable data */</span></span>
<span class="line"><span>#define POLLRDNORM 0x0040    /* non-OOB/URG data available */</span></span>
<span class="line"><span>#define POLLRDBAND 0x0080    /* OOB/Urgent readable data */</span></span></code></pre></div><p>一般我们在程序里面有POLLIN即可。套接字可读事件和select的readset基本一致，是系统内核通知应用程序有数据可以读，通过read函数执行操作不会被阻塞。</p><p>第二类是可写事件，有以下几种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define POLLOUT    0x0004    /* file descriptor is writeable */</span></span>
<span class="line"><span>#define POLLWRNORM POLLOUT   /* no write type differentiation */</span></span>
<span class="line"><span>#define POLLWRBAND 0x0100    /* OOB/Urgent data can be written */</span></span></code></pre></div><p>一般我们在程序里面统一使用POLLOUT。套接字可写事件和select的writeset基本一致，是系统内核通知套接字缓冲区已准备好，通过write函数执行写操作不会被阻塞。</p><p>以上两大类的事件都可以在“returned events”得到复用。还有另一大类事件，没有办法通过poll向系统内核递交检测请求，只能通过“returned events”来加以检测，这类事件是各种错误事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define POLLERR    0x0008    /* 一些错误发送 */</span></span>
<span class="line"><span>#define POLLHUP    0x0010    /* 描述符挂起*/</span></span>
<span class="line"><span>#define POLLNVAL   0x0020    /* 请求的事件无效*/</span></span></code></pre></div><p>我们再回过头看一下poll函数的原型。参数nfds描述的是数组fds的大小，简单说，就是向poll申请的事件检测的个数。</p><p>最后一个参数timeout，描述了poll的行为。</p><p>如果是一个&lt;0的数，表示在有事件发生之前永远等待；如果是0，表示不阻塞进程，立即返回；如果是一个&gt;0的数，表示poll调用方等待指定的毫秒数后返回。</p><p>关于返回值，当有错误发生时，poll函数的返回值为-1；如果在指定的时间到达之前没有任何事件发生，则返回0，否则就返回检测到的事件个数，也就是“returned events”中非0的描述符个数。</p><p>poll函数有一点非常好，如果我们 <strong>不想对某个pollfd结构进行事件检测，</strong> 可以把它对应的pollfd结构的fd成员设置成一个负值。这样，poll函数将忽略这样的events事件，检测完成以后，所对应的“returned events”的成员值也将设置为0。</p><p>和select函数对比一下，我们发现poll函数和select不一样的地方就是，在select里面，文件描述符的个数已经随着fd_set的实现而固定，没有办法对此进行配置；而在poll函数里，我们可以控制pollfd结构的数组大小，这意味着我们可以突破原来select函数最大描述符的限制，在这种情况下，应用程序调用者需要分配pollfd数组并通知poll函数该数组的大小。</p><h2 id="基于poll的服务器程序" tabindex="-1">基于poll的服务器程序 <a class="header-anchor" href="#基于poll的服务器程序" aria-label="Permalink to &quot;基于poll的服务器程序&quot;">​</a></h2><p>下面我们将开发一个基于poll的服务器程序。这个程序可以同时处理多个客户端连接，并且一旦有客户端数据接收后，同步地回显回去。这已经是一个颇具高并发处理的服务器原型了，再加上后面讲到的非阻塞I/O和多线程等技术，基本上就是可使用的准生产级别了。</p><p>所以，让我们打起精神，一起来看这个程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define INIT_SIZE 128</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listen_fd, connected_fd;</span></span>
<span class="line"><span>    int ready_number;</span></span>
<span class="line"><span>    ssize_t n;</span></span>
<span class="line"><span>    char buf[MAXLINE];</span></span>
<span class="line"><span>    struct sockaddr_in client_addr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    listen_fd = tcp_server_listen(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化pollfd数组，这个数组的第一个元素是listen_fd，其余的用来记录将要连接的connect_fd</span></span>
<span class="line"><span>    struct pollfd event_set[INIT_SIZE];</span></span>
<span class="line"><span>    event_set[0].fd = listen_fd;</span></span>
<span class="line"><span>    event_set[0].events = POLLRDNORM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 用-1表示这个数组位置还没有被占用</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    for (i = 1; i &amp;lt; INIT_SIZE; i++) {</span></span>
<span class="line"><span>        event_set[i].fd = -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        if ((ready_number = poll(event_set, INIT_SIZE, -1)) &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &quot;poll failed &quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (event_set[0].revents &amp; POLLRDNORM) {</span></span>
<span class="line"><span>            socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span>            connected_fd = accept(listen_fd, (struct sockaddr *) &amp;client_addr, &amp;client_len);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //找到一个可以记录该连接套接字的位置</span></span>
<span class="line"><span>            for (i = 1; i &amp;lt; INIT_SIZE; i++) {</span></span>
<span class="line"><span>                if (event_set[i].fd &amp;lt; 0) {</span></span>
<span class="line"><span>                    event_set[i].fd = connected_fd;</span></span>
<span class="line"><span>                    event_set[i].events = POLLRDNORM;</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (i == INIT_SIZE) {</span></span>
<span class="line"><span>                error(1, errno, &quot;can not hold so many clients&quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (--ready_number &amp;lt;= 0)</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 1; i &amp;lt; INIT_SIZE; i++) {</span></span>
<span class="line"><span>            int socket_fd;</span></span>
<span class="line"><span>            if ((socket_fd = event_set[i].fd) &amp;lt; 0)</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            if (event_set[i].revents &amp; (POLLRDNORM | POLLERR)) {</span></span>
<span class="line"><span>                if ((n = read(socket_fd, buf, MAXLINE)) &amp;gt; 0) {</span></span>
<span class="line"><span>                    if (write(socket_fd, buf, n) &amp;lt; 0) {</span></span>
<span class="line"><span>                        error(1, errno, &quot;write error&quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } else if (n == 0 || errno == ECONNRESET) {</span></span>
<span class="line"><span>                    close(socket_fd);</span></span>
<span class="line"><span>                    event_set[i].fd = -1;</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    error(1, errno, &quot;read error&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (--ready_number &amp;lt;= 0)</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，一开始需要创建一个监听套接字，并绑定在本地的地址和端口上，这在第10行调用tcp_server_listen函数来完成。</p><p>在第13行，我初始化了一个pollfd数组，并命名为event_set，之所以叫这个名字，是引用pollfd数组确实代表了检测的事件集合。这里数组的大小固定为INIT_SIZE，这在实际的生产环境肯定是需要改进的。</p><p>我在前面讲过，监听套接字上如果有连接建立完成，也是可以通过 I/O事件复用来检测到的。在第14-15行，将监听套接字listen_fd和对应的POLLRDNORM事件加入到event_set里，表示我们期望系统内核检测监听套接字上的连接建立完成事件。</p><p>在前面介绍poll函数时，我们提到过，如果对应pollfd里的文件描述字fd为负数，poll函数将会忽略这个pollfd，所以我们在第18-21行将event_set数组里其他没有用到的fd统统设置为-1。这里-1也表示了当前pollfd没有被使用的意思。</p><p>下面我们的程序进入一个无限循环，在这个循环体内，第24行调用poll函数来进行事件检测。poll函数传入的参数为event_set数组，数组大小INIT_SIZE和-1。这里之所以传入INIT_SIZE，是因为poll函数已经能保证可以自动忽略fd为-1的pollfd，否则我们每次都需要计算一下event_size里真正需要被检测的元素大小；timeout设置为-1，表示在I/O事件发生之前poll调用一直阻塞。</p><p>如果系统内核检测到监听套接字上的连接建立事件，就进入到第28行的判断分支。我们看到，使用了如event_set[0].revent来和对应的事件类型进行位与操作，这个技巧大家一定要记住，这是因为event都是通过二进制位来进行记录的，位与操作是和对应的二进制位进行操作，一个文件描述字是可以对应到多个事件类型的。</p><p>在这个分支里，调用accept函数获取了连接描述字。接下来，33-38行做了一件事，就是把连接描述字connect_fd也加入到event_set里，而且说明了我们感兴趣的事件类型为POLLRDNORM，也就是套接字上有数据可以读。在这里，我们从数组里查找一个没有没占用的位置，也就是fd为-1的位置，然后把fd设置为新的连接套接字connect_fd。</p><p>如果在数组里找不到这样一个位置，说明我们的event_set已经被很多连接充满了，没有办法接收更多的连接了，这就是第41-42行所做的事情。</p><p>第45-46行是一个加速优化能力，因为poll返回的一个整数，说明了这次I/O事件描述符的个数，如果处理完监听套接字之后，就已经完成了这次I/O复用所要处理的事情，那么我们就可以跳过后面的处理，再次进入poll调用。</p><p>接下来的循环处理是查看event_set里面其他的事件，也就是已连接套接字的可读事件。这是通过遍历event_set数组来完成的。</p><p>如果数组里的pollfd的fd为-1，说明这个pollfd没有递交有效的检测，直接跳过；来到第53行，通过检测revents的事件类型是POLLRDNORM或者POLLERR，我们可以进行读操作。在第54行，读取数据正常之后，再通过write操作回显给客户端；在第58行，如果读到EOF或者是连接重置，则关闭这个连接，并且把event_set对应的pollfd重置；第61行读取数据失败。</p><p>和前面的优化加速处理一样，第65-66行是判断如果事件已经被完全处理完之后，直接跳过对event_set的循环处理，再次来到poll调用。</p><h2 id="实验" tabindex="-1">实验 <a class="header-anchor" href="#实验" aria-label="Permalink to &quot;实验&quot;">​</a></h2><p>我们启动这个服务器程序，然后通过telnet连接到这个服务器程序。为了检验这个服务器程序的I/O复用能力，我们可以多开几个telnet客户端，并且在屏幕上输入各种字符串。</p><p>客户端1：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to 127.0.0.1.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>a</span></span>
<span class="line"><span>a</span></span>
<span class="line"><span>aaaaaaaaaaa</span></span>
<span class="line"><span>aaaaaaaaaaa</span></span>
<span class="line"><span>afafasfa</span></span>
<span class="line"><span>afafasfa</span></span>
<span class="line"><span>fbaa</span></span>
<span class="line"><span>fbaa</span></span>
<span class="line"><span>^]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><p>客户端2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to 127.0.0.1.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>b</span></span>
<span class="line"><span>b</span></span>
<span class="line"><span>bbbbbbb</span></span>
<span class="line"><span>bbbbbbb</span></span>
<span class="line"><span>bbbbbbb</span></span>
<span class="line"><span>bbbbbbb</span></span>
<span class="line"><span>^]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><p>可以看到，这两个客户端互不影响，每个客户端输入的字符很快会被回显到客户端屏幕上。一个客户端断开连接，也不会影响到其他客户端。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>poll是另一种在各种UNIX系统上被广泛支持的I/O多路复用技术，虽然名声没有select那么响，能力一点不比select差，而且因为可以突破select文件描述符的个数限制，在高并发的场景下尤其占优势。这一讲我们编写了一个基于poll的服务器程序，希望你从中学会poll的用法。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>和往常一样，给你留两道思考题：</p><p>第一道，在我们的程序里event_set数组的大小固定为INIT_SIZE，这在实际的生产环境肯定是需要改进的。你知道如何改进吗？</p><p>第二道，如果我们进行了改进，那么接下来把连接描述字connect_fd也加入到event_set里，如何配合进行改造呢？</p><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,58)])])}const h=n(l,[["render",t]]);export{b as __pageData,h as default};
