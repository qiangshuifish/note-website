import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"15 | 怎么老是出现“地址已经被使用”？","description":"","frontmatter":{},"headers":[{"level":2,"title":"从例子开始","slug":"从例子开始","link":"#从例子开始","children":[]},{"level":2,"title":"复习TIME_WAIT","slug":"复习time-wait","link":"#复习time-wait","children":[]},{"level":2,"title":"重用套接字选项","slug":"重用套接字选项","link":"#重用套接字选项","children":[]},{"level":2,"title":"最佳实践","slug":"最佳实践","link":"#最佳实践","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"网络编程实战/15-怎么老是出现“地址已经被使用”？.md","filePath":"网络编程实战/15-怎么老是出现“地址已经被使用”？.md","lastUpdated":1779821786000}'),l={name:"网络编程实战/15-怎么老是出现“地址已经被使用”？.md"};function i(t,s,c,r,d,o){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_15-怎么老是出现-地址已经被使用" tabindex="-1">15 | 怎么老是出现“地址已经被使用”？ <a class="header-anchor" href="#_15-怎么老是出现-地址已经被使用" aria-label="Permalink to &quot;15 | 怎么老是出现“地址已经被使用”？&quot;">​</a></h1><p>你好，我是盛延敏，这里是网络编程实战的第15讲，欢迎回来。</p><p>上一讲我们讲到UDP也可以像TCP一样，使用connect方法，以快速获取异步错误的信息。在今天的内容里，我们将讨论服务器端程序重启时，地址被占用的原因和解决方法。</p><p>我们已经知道，网络编程中，服务器程序需要绑定本地地址和一个端口，然后就监听在这个地址和端口上，等待客户端连接的到来。在实战中，你可能会经常碰到一个问题，当服务器端程序重启之后，总是碰到“Address in use”的报错信息，服务器程序不能很快地重启。那么这个问题是如何产生的？我们又该如何避免呢？</p><p>今天我们就来讲一讲这个“地址已经被使用”的问题。</p><h2 id="从例子开始" tabindex="-1">从例子开始 <a class="header-anchor" href="#从例子开始" aria-label="Permalink to &quot;从例子开始&quot;">​</a></h2><p>为了引入讨论，我们从之前讲过的一个TCP服务器端程序开始说起：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void sig_int(int signo) {</span></span>
<span class="line"><span>    printf(&quot;\\nreceived %d datagrams\\n&quot;, count);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listenfd;</span></span>
<span class="line"><span>    listenfd = socket(AF_INET, SOCK_STREAM, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct sockaddr_in server_addr;</span></span>
<span class="line"><span>    bzero(&amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    server_addr.sin_family = AF_INET;</span></span>
<span class="line"><span>    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);</span></span>
<span class="line"><span>    server_addr.sin_port = htons(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rt1 = bind(listenfd, (struct sockaddr *) &amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    if (rt1 &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &quot;bind failed &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rt2 = listen(listenfd, LISTENQ);</span></span>
<span class="line"><span>    if (rt2 &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &quot;listen failed &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    signal(SIGPIPE, SIG_IGN);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int connfd;</span></span>
<span class="line"><span>    struct sockaddr_in client_addr;</span></span>
<span class="line"><span>    socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((connfd = accept(listenfd, (struct sockaddr *) &amp;client_addr, &amp;client_len)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &quot;bind failed &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char message[MAXLINE];</span></span>
<span class="line"><span>    count = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        int n = read(connfd, message, MAXLINE);</span></span>
<span class="line"><span>        if (n &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &quot;error read&quot;);</span></span>
<span class="line"><span>        } else if (n == 0) {</span></span>
<span class="line"><span>            error(1, 0, &quot;client closed \\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        message[n] = 0;</span></span>
<span class="line"><span>        printf(&quot;received %d bytes: %s\\n&quot;, n, message);</span></span>
<span class="line"><span>        count++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个服务器端程序绑定到一个本地端口，使用的是通配地址ANY，当连接建立之后，从该连接中读取输入的字符流。</p><p>启动服务器，之后我们使用Telnet登录这个服务器，并在屏幕上输入一些字符，例如：network，good。</p><p>和我们期望的一样，服务器端打印出Telnet客户端的输入。在Telnet端关闭连接之后，服务器端接收到EOF，也顺利地关闭了连接。服务器端也可以很快重启，等待新的连接到来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> $./addressused</span></span>
<span class="line"><span> received 9 bytes: network</span></span>
<span class="line"><span> received 6 bytes: good</span></span>
<span class="line"><span> client closed</span></span>
<span class="line"><span> $./addressused</span></span></code></pre></div><p>接下来，我们改变一下连接的关闭顺序。和前面的过程一样，先启动服务器，再使用Telnet作为客户端登录到服务器，在屏幕上输入一些字符。注意接下来的不同，我不会在Telnet端关闭连接，而是直接使用Ctrl+C的方式在服务器端关闭连接。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$telnet 127.0.0.1 9527</span></span>
<span class="line"><span>network</span></span>
<span class="line"><span>bad</span></span>
<span class="line"><span>Connection closed by foreign host.</span></span></code></pre></div><p>我们看到，连接已经被关闭，Telnet客户端也感知连接关闭并退出了。接下来，我们尝试重启服务器端程序。你会发现，这个时候服务端程序重启失败，报错信息为： <strong>bind failed: Address already in use</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> $./addressused</span></span>
<span class="line"><span> received 9 bytes: network</span></span>
<span class="line"><span> received 6 bytes: good</span></span>
<span class="line"><span> client closed</span></span>
<span class="line"><span> $./addressused</span></span>
<span class="line"><span> bind faied: Address already in use(98)</span></span></code></pre></div><h2 id="复习time-wait" tabindex="-1">复习TIME_WAIT <a class="header-anchor" href="#复习time-wait" aria-label="Permalink to &quot;复习TIME\\_WAIT&quot;">​</a></h2><p>那么，这个错误到底是怎么发生的呢？</p><p>还记得第10篇文章里提到的TIME_WAIT么？当连接的一方主动关闭连接，在接收到对端的FIN报文之后，主动关闭连接的一方会在TIME_WAIT这个状态里停留一段时间，这个时间大约为2MSL。如果你对此有点淡忘，没有关系，我在下面放了一张图，希望会唤起你的记忆。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/131670/945c60ae06d282dcc22ad3b868f1175f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/131670/945c60ae06d282dcc22ad3b868f1175f.png" alt=""></a></p><p>如果我们此时使用netstat去查看服务器程序所在主机的TIME_WAIT的状态连接，你会发现有一个服务器程序生成的TCP连接，当前正处于TIME_WAIT状态。这里9527是本地监听端口，36650是telnet客户端端口。当然了，Telnet客户端端口每次也会不尽相同。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/131670/5127adf94e564c13d6be86460d3317e1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/131670/5127adf94e564c13d6be86460d3317e1.png" alt=""></a></p><p>通过服务器端发起的关闭连接操作，引起了一个已有的TCP连接处于TME_WAIT状态，正是这个TIME_WAIT的连接，使得服务器重启时，继续绑定在127.0.0.1地址和9527端口上的操作，返回了 <strong>Address already in use</strong> 的错误。</p><h2 id="重用套接字选项" tabindex="-1">重用套接字选项 <a class="header-anchor" href="#重用套接字选项" aria-label="Permalink to &quot;重用套接字选项&quot;">​</a></h2><p>我们知道，一个TCP连接是通过四元组（源地址、源端口、目的地址、目的端口）来唯一确定的，如果每次Telnet客户端使用的本地端口都不同，就不会和已有的四元组冲突，也就不会有TIME_WAIT的新旧连接化身冲突的问题。</p><p>事实上，即使在很小的概率下，客户端Telnet使用了相同的端口，从而造成了新连接和旧连接的四元组相同，在现代Linux操作系统下，也不会有什么大的问题，原因是现代Linux操作系统对此进行了一些优化。</p><p>第一种优化是新连接SYN告知的初始序列号，一定比TIME_WAIT老连接的末序列号大，这样通过序列号就可以区别出新老连接。</p><p>第二种优化是开启了tcp_timestamps，使得新连接的时间戳比老连接的时间戳大，这样通过时间戳也可以区别出新老连接。</p><p>在这样的优化之下，一个TIME_WAIT的TCP连接可以忽略掉旧连接，重新被新的连接所使用。</p><p>这就是重用套接字选项，通过给套接字配置可重用属性，告诉操作系统内核，这样的TCP连接完全可以复用TIME_WAIT状态的连接。代码片段已经放在文章中了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int on = 1;</span></span>
<span class="line"><span>setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &amp;on, sizeof(on));</span></span></code></pre></div><p>SO_REUSEADDR套接字选项，允许启动绑定在一个端口，即使之前存在一个和该端口一样的连接。前面的例子已经表明，在默认情况下，服务器端历经创建socket、bind和listen重启时，如果试图绑定到一个现有连接上的端口，bind操作会失败，但是如果我们在创建socket和bind之间，使用上面的代码片段设置SO_REUSEADDR套接字选项，情况就会不同。</p><p>下面我们对原来的服务器端代码进行升级，升级的部分主要在11-12行，在bind监听套接字之前，调用setsockopt方法，设置重用套接字选项：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listenfd;</span></span>
<span class="line"><span>    listenfd = socket(AF_INET, SOCK_STREAM, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct sockaddr_in server_addr;</span></span>
<span class="line"><span>    bzero(&amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    server_addr.sin_family = AF_INET;</span></span>
<span class="line"><span>    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);</span></span>
<span class="line"><span>    server_addr.sin_port = htons(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int on = 1;</span></span>
<span class="line"><span>    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &amp;on, sizeof(on));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rt1 = bind(listenfd, (struct sockaddr *) &amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    if (rt1 &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &quot;bind failed &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rt2 = listen(listenfd, LISTENQ);</span></span>
<span class="line"><span>    if (rt2 &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &quot;listen failed &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    signal(SIGPIPE, SIG_IGN);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int connfd;</span></span>
<span class="line"><span>    struct sockaddr_in client_addr;</span></span>
<span class="line"><span>    socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((connfd = accept(listenfd, (struct sockaddr *) &amp;client_addr, &amp;client_len)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &quot;bind failed &quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char message[MAXLINE];</span></span>
<span class="line"><span>    count = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        int n = read(connfd, message, MAXLINE);</span></span>
<span class="line"><span>        if (n &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &quot;error read&quot;);</span></span>
<span class="line"><span>        } else if (n == 0) {</span></span>
<span class="line"><span>            error(1, 0, &quot;client closed \\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        message[n] = 0;</span></span>
<span class="line"><span>        printf(&quot;received %d bytes: %s\\n&quot;, n, message);</span></span>
<span class="line"><span>        count++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重新编译过后，重复上面那个例子，先启动服务器，再使用Telnet作为客户端登录到服务器，在屏幕上输入一些字符，使用Ctrl+C的方式在服务器端关闭连接。马上尝试重启服务器，这个时候我们发现，服务器正常启动，没有出现 <strong>Address already in use</strong> 的错误。这说明我们的修改已经起作用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> $./addressused2</span></span>
<span class="line"><span> received 9 bytes: network</span></span>
<span class="line"><span> received 6 bytes: good</span></span>
<span class="line"><span> client closed</span></span>
<span class="line"><span> $./addressused2</span></span></code></pre></div><p>SO_REUSEADDR套接字选项还有一个作用，那就是本机服务器如果有多个地址，可以在不同地址上使用相同的端口提供服务。</p><p>比如，一台服务器有192.168.1.101和10.10.2.102两个地址，我们可以在这台机器上启动三个不同的HTTP服务，第一个以本地通配地址ANY和端口80启动；第二个以192.168.101和端口80启动；第三个以10.10.2.102和端口80启动。</p><p>这样目的地址为192.168.101，目的端口为80的连接请求会被发往第二个服务；目的地址为10.10.2.102，目的端口为80的连接请求会被发往第三个服务；目的端口为80的所有其他连接请求被发往第一个服务。</p><p>我们必须给这三个服务设置SO_REUSEADDR套接字选项，否则第二个和第三个服务调用bind绑定到80端口时会出错。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to &quot;最佳实践&quot;">​</a></h2><p>这里的最佳实践可以总结成一句话： 服务器端程序，都应该设置SO_REUSEADDR套接字选项，以便服务端程序可以在极短时间内复用同一个端口启动。</p><p>有些人可能觉得这不是安全的。其实，单独重用一个套接字不会有任何问题。我在前面已经讲过，TCP连接是通过四元组唯一区分的，只要客户端不使用相同的源端口，连接服务器是没有问题的，即使使用了相同的端口，根据序列号或者时间戳，也是可以区分出新旧连接的。</p><p>而且，TCP的机制绝对不允许在相同的地址和端口上绑定不同的服务器，即使我们设置SO_REUSEADDR套接字选项，也不可能在ANY通配符地址下和端口9527上重复启动两个服务器实例。如果我们启动第二个服务器实例，不出所料会得到 <strong>Address already in use</strong> 的报错，即使当前还没有任何一条有效TCP连接产生。</p><p>比如下面就是第二次运行服务器端程序的报错信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> $./addressused2</span></span>
<span class="line"><span> bind faied: Address already in use(98)</span></span></code></pre></div><p>你可能还记得 <a href="https://time.geekbang.org/column/article/125806" target="_blank" rel="noreferrer">第10讲</a> 中，我们提到过一个叫做tcp_tw_reuse的内核配置选项，这里又提到了SO_REUSEADDR套接字选择，你会不会觉得两个有点混淆呢？</p><p>其实，这两个东西一点关系也没有。</p><ul><li>tcp_tw_reuse是内核选项，主要用在连接的发起方。TIME_WAIT状态的连接创建时间超过1秒后，新的连接才可以被复用，注意，这里是连接的发起方；</li><li>SO_REUSEADDR是用户态的选项，SO_REUSEADDR选项用来告诉操作系统内核，如果端口已被占用，但是TCP连接状态位于TIME_WAIT ，可以重用端口。如果端口忙，而TCP处于其他状态，重用端口时依旧得到“Address already in use”的错误信息。注意，这里一般都是连接的服务方。</li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我们分析了“Address already in use”产生的原因和解决方法。你只要记住一句话， <strong>在所有TCP服务器程序中，调用bind之前请设置SO_REUSEADDR套接字选项</strong>。这不会产生危害，相反，它会帮助我们在很快时间内重启服务端程序，而这一点恰恰是很多场景所需要的。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>跟往常一样，给你布置两道思考题：</p><p>第一道，之前我们看到的例子，都是对TCP套接字设置SO_REUSEADDR套接字选项，你知道吗，我们也可以对UDP设置SO_REUSEADDR套接字选项。那么问题来了，对UDP来说，设置SO_REUSEADDR套接字选项有哪些场景和好处呢？</p><p>第二道，在服务器端程序中，设置SO_REUSEADDR套接字选项时，需要在bind函数之前对监听字进行设置，想一想，为什么不是对已连接的套接字进行设置呢？</p><p>欢迎你在评论区写下你的思考，我会和你一起讨论交流，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,56)])])}const h=n(l,[["render",i]]);export{_ as __pageData,h as default};
