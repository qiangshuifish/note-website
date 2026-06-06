import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"25 | 使用阻塞I/O和进程模型：最传统的方式","description":"","frontmatter":{},"headers":[{"level":2,"title":"父进程和子进程","slug":"父进程和子进程","link":"#父进程和子进程","children":[]},{"level":2,"title":"阻塞I/O的进程模型","slug":"阻塞i-o的进程模型","link":"#阻塞i-o的进程模型","children":[]},{"level":2,"title":"程序讲解","slug":"程序讲解","link":"#程序讲解","children":[]},{"level":2,"title":"实验","slug":"实验","link":"#实验","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/25-使用阻塞I-O和进程模型：最传统的方式.md","filePath":"网络编程实战/25-使用阻塞I-O和进程模型：最传统的方式.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/25-使用阻塞I-O和进程模型：最传统的方式.md"};function i(t,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_25-使用阻塞i-o和进程模型-最传统的方式" tabindex="-1">25 | 使用阻塞I/O和进程模型：最传统的方式 <a class="header-anchor" href="#_25-使用阻塞i-o和进程模型-最传统的方式" aria-label="Permalink to &quot;25 | 使用阻塞I/O和进程模型：最传统的方式&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战第25讲，欢迎回来。</p><p>上一讲中，我们讲到了C10K问题，并引入了解决C10K问题的各种解法。其中，最简单也是最有效的一种解决方法就是为每个连接创建一个独立的进程去服务。那么，到底如何为每个连接客户创建一个进程来服务呢？在这其中，又需要特别注意什么呢？今天我们就围绕这部分内容展开，期望经过今天的学习，你对父子进程、僵尸进程、使用进程处理连接等有一个比较直观的理解。</p><h2 id="父进程和子进程" tabindex="-1">父进程和子进程 <a class="header-anchor" href="#父进程和子进程" aria-label="Permalink to &quot;父进程和子进程&quot;">​</a></h2><p>我们知道，进程是程序执行的最小单位，一个进程有完整的地址空间、程序计数器等，如果想创建一个新的进程，使用函数fork就可以。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pid_t fork(void)</span></span>
<span class="line"><span>返回：在子进程中为0，在父进程中为子进程ID，若出错则为-1</span></span></code></pre></div><p>如果你是第一次使用这个函数，你会觉得难以理解的地方在于，虽然我们的程序调用fork一次，它却在父、子进程里各返回一次。在调用该函数的进程（即为父进程）中返回的是新派生的进程ID号，在子进程中返回的值为0。想要知道当前执行的进程到底是父进程，还是子进程，只能通过返回值来进行判断。</p><p>fork函数实现的时候，实际上会把当前父进程的所有相关值都克隆一份，包括地址空间、打开的文件描述符、程序计数器等，就连执行代码也会拷贝一份，新派生的进程的表现行为和父进程近乎一样，就好像是派生进程调用过fork函数一样。为了区别两个不同的进程，实现者可以通过改变fork函数的栈空间值来判断，对应到程序中就是返回值的不同。</p><p>这样就形成了编程范式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(fork() == 0){</span></span>
<span class="line"><span>  do_child_process(); //子进程执行代码</span></span>
<span class="line"><span>}else{</span></span>
<span class="line"><span>  do_parent_process();  //父进程执行代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当一个子进程退出时，系统内核还保留了该进程的若干信息，比如退出状态。这样的进程如果不回收，就会变成僵尸进程。在Linux下，这样的“僵尸”进程会被挂到进程号为1的init进程上。所以，由父进程派生出来的子进程，也必须由父进程负责回收，否则子进程就会变成僵尸进程。僵尸进程会占用不必要的内存空间，如果量多到了一定数量级，就会耗尽我们的系统资源。</p><p>有两种方式可以在子进程退出后回收资源，分别是调用wait和waitpid函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pid_t wait(int *statloc);</span></span>
<span class="line"><span>pid_t waitpid(pid_t pid, int *statloc, int options);</span></span></code></pre></div><p>函数wait和waitpid都可以返回两个值，一个是函数返回值，表示已终止子进程的进程ID号，另一个则是通过statloc指针返回子进程终止的实际状态。这个状态可能的值为正常终止、被信号杀死、作业控制停止等。</p><p>如果没有已终止的子进程，而是有一个或多个子进程在正常运行，那么wait将阻塞，直到第一个子进程终止。</p><p>waitpid可以认为是wait函数的升级版，它的参数更多，提供的控制权也更多。pid参数允许我们指定任意想等待终止的进程ID，值-1表示等待第一个终止的子进程。options参数给了我们更多的控制选项。</p><p>处理子进程退出的方式一般是注册一个信号处理函数，捕捉信号SIGCHLD信号，然后再在信号处理函数里调用waitpid函数来完成子进程资源的回收。SIGCHLD是子进程退出或者中断时由内核向父进程发出的信号，默认这个信号是忽略的。所以，如果想在子进程退出时能回收它，需要像下面一样，注册一个SIGCHLD函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>signal(SIGCHLD, sigchld_handler);</span></span></code></pre></div><h2 id="阻塞i-o的进程模型" tabindex="-1">阻塞I/O的进程模型 <a class="header-anchor" href="#阻塞i-o的进程模型" aria-label="Permalink to &quot;阻塞I/O的进程模型&quot;">​</a></h2><p>为了说明使用阻塞I/O和进程模型，我们假设有两个客户端，服务器初始监听在套接字lisnted_fd上。当第一个客户端发起连接请求，连接建立后产生出连接套接字，此时，父进程派生出一个子进程，在子进程中，使用连接套接字和客户端通信，因此子进程不需要关心监听套接字，只需要关心连接套接字；父进程则相反，将客户服务交给子进程来处理，因此父进程不需要关心连接套接字，只需要关心监听套接字。</p><p>这张图描述了从连接请求到连接建立，父进程派生子进程为客户服务。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/143410/6cf70cf7f651273b38aac61cb61a88a3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/143410/6cf70cf7f651273b38aac61cb61a88a3.png" alt=""></a></p><p>假设父进程之后又接收了新的连接请求，从accept调用返回新的已连接套接字，父进程又派生出另一个子进程，这个子进程用第二个已连接套接字为客户端服务。</p><p>这张图同样描述了这个过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/143410/4fb66c841fbca96f8b27c13c61a29608.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/143410/4fb66c841fbca96f8b27c13c61a29608.png" alt=""></a></p><p>现在，服务器端的父进程继续监听在套接字上，等待新的客户连接到来；两个子进程分别使用两个不同的连接套接字为两个客户服务。</p><h2 id="程序讲解" tabindex="-1">程序讲解 <a class="header-anchor" href="#程序讲解" aria-label="Permalink to &quot;程序讲解&quot;">​</a></h2><p>我们将前面的内容串联起来，就是下面完整的一个基于进程模型的服务器端程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/common.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define MAX_LINE 4096</span></span>
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
<span class="line"><span>void child_run(int fd) {</span></span>
<span class="line"><span>    char outbuf[MAX_LINE + 1];</span></span>
<span class="line"><span>    size_t outbuf_used = 0;</span></span>
<span class="line"><span>    ssize_t result;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        char ch;</span></span>
<span class="line"><span>        result = recv(fd, &amp;ch, 1, 0);</span></span>
<span class="line"><span>        if (result == 0) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        } else if (result == -1) {</span></span>
<span class="line"><span>            perror(&quot;read&quot;);</span></span>
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
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void sigchld_handler(int sig) {</span></span>
<span class="line"><span>    while (waitpid(-1, 0, WNOHANG) &amp;gt; 0);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    int listener_fd = tcp_server_listen(SERV_PORT);</span></span>
<span class="line"><span>    signal(SIGCHLD, sigchld_handler);</span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        struct sockaddr_storage ss;</span></span>
<span class="line"><span>        socklen_t slen = sizeof(ss);</span></span>
<span class="line"><span>        int fd = accept(listener_fd, (struct sockaddr *) &amp;ss, &amp;slen);</span></span>
<span class="line"><span>        if (fd &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &quot;accept failed&quot;);</span></span>
<span class="line"><span>            exit(1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (fork() == 0) {</span></span>
<span class="line"><span>            close(listener_fd);</span></span>
<span class="line"><span>            child_run(fd);</span></span>
<span class="line"><span>            exit(0);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            close(fd);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>程序的48行注册了一个信号处理函数，用来回收子进程资源。函数sigchld_handler，在一个循环体内调用了waitpid函数，以便回收所有已终止的子进程。这里选项WNOHANG用来告诉内核，即使还有未终止的子进程也不要阻塞在waitpid上。注意这里不可以使用wait，因为wait函数在有未终止子进程的情况下，没有办法不阻塞。</p><p>程序的58-62行，通过判断fork的返回值为0，进入子进程处理逻辑。按照前面的讲述，子进程不需要关心监听套接字，故而在这里关闭掉监听套接字listen_fd，之后调用child_run函数使用已连接套接字fd来进行数据读写。第63行，进入的是父进程处理逻辑，父进程不需要关心连接套接字，所以在这里关闭连接套接字。</p><p>还记得 <a href="https://time.geekbang.org/column/article/126126" target="_blank" rel="noreferrer">第11讲</a> 中讲到的close函数吗？我们知道，从父进程派生出的子进程，同时也会复制一份描述字，也就是说，连接套接字和监听套接字的引用计数都会被加1，而调用close函数则会对引用计数进行减1操作，这样在套接字引用计数到0时，才可以将套接字资源回收。所以，这里的close函数非常重要，缺少了它们，就会引起服务器端资源的泄露。</p><p>child_run函数中，通过一个while循环来不断和客户端进行交互，依次读出字符之后，进行了简单的转码，如果读到回车符，则将转码之后的结果通过连接套接字发送出去。这样的回显方式，显得比较有“交互感”。</p><h2 id="实验" tabindex="-1">实验 <a class="header-anchor" href="#实验" aria-label="Permalink to &quot;实验&quot;">​</a></h2><p>我们启动该服务器，监听在对应的端口43211上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>./fork01</span></span></code></pre></div><p>再启动两个telnet客户端，连接到43211端口，每次通过标准输入和服务器端传输一些数据，我们看到，服务器和客户端的交互正常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to localhost.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>afasfa</span></span>
<span class="line"><span>nsnfsn</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to localhost.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>agasgasg</span></span>
<span class="line"><span>ntnftnft</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre></div><p>客户端退出，服务器端也在正常工作，此时如果再通过telnet建立新的连接，客户端和服务器端的数据传输也会正常进行。</p><p>至此，我们构建了一个完整的服务器端程序，可以并发处理多个不同的客户连接，互不干扰。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>使用阻塞I/O和进程模型，为每一个连接创建一个独立的子进程来进行服务，是一个非常简单有效的实现方式，这种方式可能很难满足高性能程序的需求，但好处在于实现简单。在实现这样的程序时，我们需要注意两点：</p><ul><li>要注意对套接字的关闭梳理；</li><li>要注意对子进程进行回收，避免产生不必要的僵尸进程。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>给你出两道思考题：</p><p>第一道，你可以查查资料，看看有没有比较著名的程序是使用这样的模式来构建的？</p><p>第二道，程序中处理SIGCHLD信号时，使用了一个循环来回收处理终止的子进程，为什么要这么做呢？如果不使用循环会有什么后果？</p><p>欢迎你在评论区写下你的思考，我会和你一起交流，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,49)])])}const g=a(l,[["render",i]]);export{u as __pageData,g as default};
