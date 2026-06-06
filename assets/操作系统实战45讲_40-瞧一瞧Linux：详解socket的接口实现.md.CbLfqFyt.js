import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"40 | 瞧一瞧Linux：详解socket的接口实现","description":"","frontmatter":{},"headers":[{"level":2,"title":"套接字接口","slug":"套接字接口","link":"#套接字接口","children":[{"level":3,"title":"套接字的创建","slug":"套接字的创建","link":"#套接字的创建","children":[]},{"level":3,"title":"套接字的绑定","slug":"套接字的绑定","link":"#套接字的绑定","children":[]},{"level":3,"title":"主动连接","slug":"主动连接","link":"#主动连接","children":[]},{"level":3,"title":"监听套接字","slug":"监听套接字","link":"#监听套接字","children":[]},{"level":3,"title":"被动接收连接","slug":"被动接收连接","link":"#被动接收连接","children":[]},{"level":3,"title":"发送数据","slug":"发送数据","link":"#发送数据","children":[]},{"level":3,"title":"接收数据","slug":"接收数据","link":"#接收数据","children":[]},{"level":3,"title":"关闭连接","slug":"关闭连接","link":"#关闭连接","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/40-瞧一瞧Linux：详解socket的接口实现.md","filePath":"操作系统实战45讲/40-瞧一瞧Linux：详解socket的接口实现.md","lastUpdated":1779820584000}'),t={name:"操作系统实战45讲/40-瞧一瞧Linux：详解socket的接口实现.md"};function l(i,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_40-瞧一瞧linux-详解socket的接口实现" tabindex="-1">40 | 瞧一瞧Linux：详解socket的接口实现 <a class="header-anchor" href="#_40-瞧一瞧linux-详解socket的接口实现" aria-label="Permalink to &quot;40 | 瞧一瞧Linux：详解socket的接口实现&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课，我们一起了解了套接字的工作机制和数据结构，但套接字有哪些基本接口实现呢？相信学完这节课，你就能够解决这个问题了。</p><p>今天我会和你探讨套接字从创建、协议接口注册与初始化过程，还会为你深入分析套接字系统，是怎样调用各个功能函数的。通过这节课，相信你可以学会基于套接字来编写网络应用程序。有了之前的基础，想理解这节课并不难，让我们正式开始吧。</p><h2 id="套接字接口" tabindex="-1">套接字接口 <a class="header-anchor" href="#套接字接口" aria-label="Permalink to &quot;套接字接口&quot;">​</a></h2><p>套接字接口最初是BSD操作系统的一部分，在应用层与TCP/IP协议栈之间接供了一套标准的独立于协议的接口。</p><p>Linux内核实现的套接字接口，将UNIX的“一切都是文件操作”的概念应用在了网络连接访问上，让应用程序可以用常规文件操作API访问网络连接。</p><p>从TCP/IP协议栈的角度来看，传输层以上的都是应用程序的一部分，Linux与传统的UNIX类似，TCP/IP协议栈驻留在内核中，与内核的其他组件共享内存。传输层以上执行的网络功能，都是在用户地址空间完成的。</p><p>Linux使用内核套接字概念与用户空间套接字通信，这样可以让实现和操作变得更简单。Linux提供了一套API和套接字数据结构，这些服务向下与内核接口对接，向上与用户空间接口对接，应用程序正是使用这一套API访问内核中的网络功能。</p><h3 id="套接字的创建" tabindex="-1">套接字的创建 <a class="header-anchor" href="#套接字的创建" aria-label="Permalink to &quot;套接字的创建&quot;">​</a></h3><p>在应用程序使用TCP/IP协议栈的功能之前，我们必须调用套接字库函数API创建一个新的套接字，创建好以后，对库函数创建套接字的调用，就会转换为内核套接字创建函数的系统调用。</p><p>这时，完成的是通用套接字创建的初始化功能，跟具体的协议族并不相关。</p><p>这个过程具体是这样的，在应用程序中执行socket函数，socket产生系统调用中断执行内核的套接字分路函数sys_socketcall，在sys_socketcall套接字函数分路器中将调用传送到sys_socket函数，由sys_socket函数调用套接字的通用创建函数sock_create。</p><p>sock_create函数完成通用套接字创建、初始化任务后，再调用特定协议族的套接字创建函数。</p><p>这样描述你可能还没有直观感受，我特意画了图，帮你梳理socket创建的流程，你可以对照图片仔细体会调用过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/405781/313d5d8c3b3224633fab2bd121006aef.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/405781/313d5d8c3b3224633fab2bd121006aef.jpg" alt=""></a></p><p>结合图解，我再用一个具体例子帮你加深理解，比如由AF_INET协议族的inet_create函数完成套接字与特定协议族的关联。</p><p>一个新的struct socket数据结构起始由sock_create函数创建， <strong>该函数直接调用__sock_create函数，__sock_create函数的任务是为套接字预留需要的内存空间，由sock_alloc函数完成这项功能。</strong></p><p>这个sock_alloc函数不仅会为struct socket数据结构实例预留空间，也会为struct inode数据结构实例分配需要的内存空间，这样可以使两个数据结构的实例相关联。__sock_create函数代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __sock_create(struct net *net, int family, int type, int protocol,</span></span>
<span class="line"><span> struct socket **res, int kern)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>int err;</span></span>
<span class="line"><span>struct socket *sock;</span></span>
<span class="line"><span>const struct net_proto_family *pf;</span></span>
<span class="line"><span>// 首先检验是否支持协议族</span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>* 检查是否在内核支持的socket范围内</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>if (family &amp;lt; 0 || family &amp;gt;= NPROTO)</span></span>
<span class="line"><span>return -EAFNOSUPPORT;</span></span>
<span class="line"><span>if (type &amp;lt; 0 || type &amp;gt;= SOCK_MAX)</span></span>
<span class="line"><span>return -EINVAL;</span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>* 为新的套接字分配内存空间，分配成功后返回新的指针</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sock = sock_alloc();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>sock_alloc函数如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct socket *sock_alloc(void) {</span></span>
<span class="line"><span>struct inode *inode;</span></span>
<span class="line"><span>struct socket *sock;</span></span>
<span class="line"><span>    // 初始化一个可用的inode节点， 在fs/inode.c中</span></span>
<span class="line"><span>    inode = new_inode(sock_mnt-&amp;gt;mnt_sb);</span></span>
<span class="line"><span>    if (!inode)</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>    // 实际创建的是socket_alloc复合对象，因此要使用SOCKET_I宏从inode中取出关联的socket对象用于返回</span></span>
<span class="line"><span>    sock = SOCKET_I(inode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    kmemcheck_annotate_bitfield(sock, type);</span></span>
<span class="line"><span>    // 文件类型为套接字</span></span>
<span class="line"><span>    inode-&amp;gt;i_mode = S_IFSOCK | S_IRWXUGO;</span></span>
<span class="line"><span>    inode-&amp;gt;i_uid = current_fsuid();</span></span>
<span class="line"><span>    inode-&amp;gt;i_gid = current_fsgid();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    percpu_add(sockets_in_use, 1);</span></span>
<span class="line"><span>return sock;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当具体的协议与新套接字相连时，其内部状态的管理由协议自身维护。</p><p>现在，函数将struct socket数据结构的struct proto_ops *ops设置为NULL。随后，当某个协议族中的协议成员的套接字创建函数被调用时，ops将指向协议实例的操作函数。这时将struct socket数据结构的flags数据域设置为0，创建时还没有任何标志需要设置。</p><p>在之后的调用中，应用程序调用send或receive套接字库函数时会设置flags数据域。最后将其他两个数据域sk和file初始化为NULL。sk数据域随后会把由协议特有的套接字创建函数设置为指向内部套接字结构。file将在调用sock_ma_fd函数时设置为分配的文件返回的指针。</p><p>文件指针用于访问打开套接字的虚拟文件系统的文件状态。在sock_alloc函数返回后，sock_create函数调用协议族的套接字创建函数err =pf-&gt;create(net, sock, protocol)，它通过访问net_families数组获取协议族的创建函数，对于TCP/IP协议栈，协议族将设置为AF_INET。</p><h3 id="套接字的绑定" tabindex="-1">套接字的绑定 <a class="header-anchor" href="#套接字的绑定" aria-label="Permalink to &quot;套接字的绑定&quot;">​</a></h3><p>创建完套接字后，应用程序需要调用sys_bind函数把套接字和地址绑定起来，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>asmlinkage long sysbind (bind, int, fd, struct sockaddr __user *, umyaddr, int, addrlen)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	struct sockaddr_storage address;</span></span>
<span class="line"><span>	int err, fput_needed;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * 获取socket实例。</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	if (sock) {</span></span>
<span class="line"><span>		err = move_addr_to_kernel(umyaddr, addrlen, (struct sockaddr *)&amp;address);</span></span>
<span class="line"><span>		if (err &amp;gt;= 0) {</span></span>
<span class="line"><span>			err = security_socket_bind(sock,</span></span>
<span class="line"><span>						   (struct sockaddr *)&amp;address,</span></span>
<span class="line"><span>						   addrlen);</span></span>
<span class="line"><span>			/*</span></span>
<span class="line"><span>			 * 如果是TCP套接字，sock-&amp;gt;ops指向的是inet_stream_ops，</span></span>
<span class="line"><span>			 * sock-&amp;gt;ops是在inet_create()函数中初始化，所以bind接口</span></span>
<span class="line"><span>			 * 调用的是inet_bind()函数。</span></span>
<span class="line"><span>			 */</span></span>
<span class="line"><span>			if (!err)</span></span>
<span class="line"><span>				err = sock-&amp;gt;ops-&amp;gt;bind(sock,</span></span>
<span class="line"><span>						      (struct sockaddr *)</span></span>
<span class="line"><span>						      &amp;address, addrlen);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		fput_light(sock-&amp;gt;file, fput_needed);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合代码，我们可以看到，sys_bind函数首先会查找套接字对应的socket实例，调用 <strong>sockfd_lookup_light</strong>。在绑定之前，将用户空间的地址拷贝到内核空间的缓冲区中，在拷贝过程中会检查用户传入的地址是否正确。</p><p>等上述的准备工作完成后，就会调用 <strong>inet_bind函数</strong> 来完成绑定操作。 <strong>inet_bind</strong> 函数代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int inet_bind(struct socket *sock, struct sockaddr *uaddr, int addr_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct sockaddr_in *addr = (struct sockaddr_in *)uaddr;</span></span>
<span class="line"><span>    struct sock *sk = sock-&amp;gt;sk;</span></span>
<span class="line"><span>    struct inet_sock *inet = inet_sk(sk);</span></span>
<span class="line"><span>    unsigned short snum;</span></span>
<span class="line"><span>    int chk_addr_ret;</span></span>
<span class="line"><span>    int err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (sk-&amp;gt;sk_prot-&amp;gt;bind) {/* 如果传输层接口上实现了bind调用，则回调它。目前只有SOCK_RAW类型的传输层实现了该接口raw_bind */</span></span>
<span class="line"><span>        err = sk-&amp;gt;sk_prot-&amp;gt;bind(sk, uaddr, addr_len);</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    err = -EINVAL;</span></span>
<span class="line"><span>    if (addr_len &amp;lt; sizeof(struct sockaddr_in))</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    err = -EADDRNOTAVAIL;</span></span>
<span class="line"><span>    if (!sysctl_ip_nonlocal_bind &amp;&amp;/* 必须绑定到本地接口的地址 */</span></span>
<span class="line"><span>        !inet-&amp;gt;freebind &amp;&amp;</span></span>
<span class="line"><span>        addr-&amp;gt;sin_addr.s_addr != INADDR_ANY &amp;&amp;/* 绑定地址不合法 */</span></span>
<span class="line"><span>        chk_addr_ret != RTN_LOCAL &amp;&amp;</span></span>
<span class="line"><span>        chk_addr_ret != RTN_MULTICAST &amp;&amp;</span></span>
<span class="line"><span>        chk_addr_ret != RTN_BROADCAST)</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    snum = ntohs(addr-&amp;gt;sin_port);</span></span>
<span class="line"><span>    err = -EACCES;</span></span>
<span class="line"><span>    if (snum &amp;&amp; snum &amp;lt; PROT_SOCK &amp;&amp; !capable(CAP_NET_BIND_SERVICE))</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lock_sock(sk);/* 对套接口进行加锁，因为后面要对其状态进行判断 */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Check these errors (active socket, double bind). */</span></span>
<span class="line"><span>    err = -EINVAL;</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 如果状态不为CLOSE，表示套接口已经处于活动状态，不能再绑定</span></span>
<span class="line"><span>     * 或者已经指定了本地端口号，也不能再绑定</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    if (sk-&amp;gt;sk_state != TCP_CLOSE || inet-&amp;gt;num)</span></span>
<span class="line"><span>        goto out_release_sock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 设置地址到传输控制块中 */</span></span>
<span class="line"><span>    inet-&amp;gt;rcv_saddr = inet-&amp;gt;saddr = addr-&amp;gt;sin_addr.s_addr;</span></span>
<span class="line"><span>    /* 如果是广播或者多播地址，则源地址使用设备地址。 */</span></span>
<span class="line"><span>    if (chk_addr_ret == RTN_MULTICAST || chk_addr_ret == RTN_BROADCAST)</span></span>
<span class="line"><span>        inet-&amp;gt;saddr = 0;  /* Use device */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 调用传输层的get_port来进行地址绑定。如tcp_v4_get_port或udp_v4_get_port */</span></span>
<span class="line"><span>    if (sk-&amp;gt;sk_prot-&amp;gt;get_port(sk, snum)) {</span></span>
<span class="line"><span>        …</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 设置标志，表示已经绑定了本地地址和端口 */</span></span>
<span class="line"><span>    if (inet-&amp;gt;rcv_saddr)</span></span>
<span class="line"><span>        sk-&amp;gt;sk_userlocks |= SOCK_BINDADDR_LOCK;</span></span>
<span class="line"><span>    if (snum)</span></span>
<span class="line"><span>        sk-&amp;gt;sk_userlocks |= SOCK_BINDPORT_LOCK;</span></span>
<span class="line"><span>    inet-&amp;gt;sport = htons(inet-&amp;gt;num);</span></span>
<span class="line"><span>    /* 还没有连接到对方，清除远端地址和端口 */</span></span>
<span class="line"><span>    inet-&amp;gt;daddr = 0;</span></span>
<span class="line"><span>    inet-&amp;gt;dport = 0;</span></span>
<span class="line"><span>    /* 清除路由缓存 */</span></span>
<span class="line"><span>    sk_dst_reset(sk);</span></span>
<span class="line"><span>    err = 0;</span></span>
<span class="line"><span>out_release_sock:</span></span>
<span class="line"><span>    release_sock(sk);</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="主动连接" tabindex="-1">主动连接 <a class="header-anchor" href="#主动连接" aria-label="Permalink to &quot;主动连接&quot;">​</a></h3><p>因为应用程序处理的是面向连接的网络服务（SOCK_STREAM或SOCK_SEQPACKET），所以在交换数据之前，需要在请求连接服务的进程（客户）与提供服务的进程（服务器）之间建立连接。</p><p>当应用程序调用 <strong>connect</strong> 函数发出连接请求时，内核会启动函数 <strong>sys_connect</strong>，详细代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __sys_connect(int fd, struct sockaddr __user *uservaddr, int addrlen)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int ret = -EBADF;</span></span>
<span class="line"><span>	struct fd f;</span></span>
<span class="line"><span>	f = fdget(fd);</span></span>
<span class="line"><span>	if (f.file) {</span></span>
<span class="line"><span>		struct sockaddr_storage address;</span></span>
<span class="line"><span>		ret = move_addr_to_kernel(uservaddr, addrlen, &amp;address);</span></span>
<span class="line"><span>		if (!ret)</span></span>
<span class="line"><span>            // 调用__sys_connect_file</span></span>
<span class="line"><span>			ret = __sys_connect_file(f.file, &amp;address, addrlen, 0);</span></span>
<span class="line"><span>		fdput(f);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>连接成功会返回socket的描述符，否则会返回一个错误码。</p><h3 id="监听套接字" tabindex="-1">监听套接字 <a class="header-anchor" href="#监听套接字" aria-label="Permalink to &quot;监听套接字&quot;">​</a></h3><p>调用listen函数时，应用程序触发内核的 <strong>sys_listen</strong> 函数，把套接字描述符fd对应的套接字设置为监听模式，观察连接请求。详细代码你可以看看后面的内容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __sys_listen(int fd, int backlog)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	int err, fput_needed;</span></span>
<span class="line"><span>	int somaxconn;</span></span>
<span class="line"><span>    // 通过套接字描述符\b找到struct socket</span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	if (sock) {</span></span>
<span class="line"><span>		somaxconn = sock_net(sock-&amp;gt;sk)-&amp;gt;core.sysctl_somaxconn;</span></span>
<span class="line"><span>		if ((unsigned int)backlog &amp;gt; somaxconn)</span></span>
<span class="line"><span>			backlog = somaxconn;</span></span>
<span class="line"><span>		err = security_socket_listen(sock, backlog);</span></span>
<span class="line"><span>		if (!err)</span></span>
<span class="line"><span>            // 根据套接字类型调用监听函数</span></span>
<span class="line"><span>			err = sock-&amp;gt;ops-&amp;gt;listen(sock, backlog);</span></span>
<span class="line"><span>		fput_light(sock-&amp;gt;file, fput_needed);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="被动接收连接" tabindex="-1">被动接收连接 <a class="header-anchor" href="#被动接收连接" aria-label="Permalink to &quot;被动接收连接&quot;">​</a></h3><p>前面说过主动连接，我们再来看看被动接受连接的情况。接受一个客户端的连接请求会调用 <strong>accept</strong> 函数，应用程序触发内核函数 <strong>sys_accept</strong>，等待接收连接请求。如果允许连接，则重新创建一个代表该连接的套接字，并返回其套接字描述符，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __sys_accept4_file(struct file *file, unsigned file_flags,</span></span>
<span class="line"><span>		       struct sockaddr __user *upeer_sockaddr,</span></span>
<span class="line"><span>		       int __user *upeer_addrlen, int flags,</span></span>
<span class="line"><span>		       unsigned long nofile)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock, *newsock;</span></span>
<span class="line"><span>	struct file *newfile;</span></span>
<span class="line"><span>	int err, len, newfd;</span></span>
<span class="line"><span>	struct sockaddr_storage address;</span></span>
<span class="line"><span>	if (flags &amp; ~(SOCK_CLOEXEC | SOCK_NONBLOCK))</span></span>
<span class="line"><span>		return -EINVAL;</span></span>
<span class="line"><span>	if (SOCK_NONBLOCK != O_NONBLOCK &amp;&amp; (flags &amp; SOCK_NONBLOCK))</span></span>
<span class="line"><span>		flags = (flags &amp; ~SOCK_NONBLOCK) | O_NONBLOCK;</span></span>
<span class="line"><span>	sock = sock_from_file(file, &amp;err);</span></span>
<span class="line"><span>	if (!sock)</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	err = -ENFILE;</span></span>
<span class="line"><span>    // 创建一个新套接字</span></span>
<span class="line"><span>	newsock = sock_alloc();</span></span>
<span class="line"><span>	if (!newsock)</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	newsock-&amp;gt;type = sock-&amp;gt;type;</span></span>
<span class="line"><span>	newsock-&amp;gt;ops = sock-&amp;gt;ops;</span></span>
<span class="line"><span>	__module_get(newsock-&amp;gt;ops-&amp;gt;owner);</span></span>
<span class="line"><span>	newfd = __get_unused_fd_flags(flags, nofile);</span></span>
<span class="line"><span>	if (unlikely(newfd &amp;lt; 0)) {</span></span>
<span class="line"><span>		err = newfd;</span></span>
<span class="line"><span>		sock_release(newsock);</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	newfile = sock_alloc_file(newsock, flags, sock-&amp;gt;sk-&amp;gt;sk_prot_creator-&amp;gt;name);</span></span>
<span class="line"><span>	if (IS_ERR(newfile)) {</span></span>
<span class="line"><span>		err = PTR_ERR(newfile);</span></span>
<span class="line"><span>		put_unused_fd(newfd);</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	err = security_socket_accept(sock, newsock);</span></span>
<span class="line"><span>	if (err)</span></span>
<span class="line"><span>		goto out_fd;</span></span>
<span class="line"><span>    // 根据套接字类型调用不同的函数inet_accept</span></span>
<span class="line"><span>	err = sock-&amp;gt;ops-&amp;gt;accept(sock, newsock, sock-&amp;gt;file-&amp;gt;f_flags | file_flags,</span></span>
<span class="line"><span>					false);</span></span>
<span class="line"><span>	if (err &amp;lt; 0)</span></span>
<span class="line"><span>		goto out_fd;</span></span>
<span class="line"><span>	if (upeer_sockaddr) {</span></span>
<span class="line"><span>		len = newsock-&amp;gt;ops-&amp;gt;getname(newsock,</span></span>
<span class="line"><span>					(struct sockaddr *)&amp;address, 2);</span></span>
<span class="line"><span>		if (len &amp;lt; 0) {</span></span>
<span class="line"><span>			err = -ECONNABORTED;</span></span>
<span class="line"><span>			goto out_fd;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>        // 从内核复制到用户空间</span></span>
<span class="line"><span>		err = move_addr_to_user(&amp;address,</span></span>
<span class="line"><span>					len, upeer_sockaddr, upeer_addrlen);</span></span>
<span class="line"><span>		if (err &amp;lt; 0)</span></span>
<span class="line"><span>			goto out_fd;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	/* File flags are not inherited via accept() unlike another OSes. */</span></span>
<span class="line"><span>	fd_install(newfd, newfile);</span></span>
<span class="line"><span>	err = newfd;</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>out_fd:</span></span>
<span class="line"><span>	fput(newfile);</span></span>
<span class="line"><span>	put_unused_fd(newfd);</span></span>
<span class="line"><span>	goto out;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个新的套接字描述符与最初创建套接字时，设置的套接字地址族与套接字类型、使用的协议一样。原来创建的套接字不与连接关联，它继续在原套接字上侦听，以便接收其他连接请求。</p><h3 id="发送数据" tabindex="-1">发送数据 <a class="header-anchor" href="#发送数据" aria-label="Permalink to &quot;发送数据&quot;">​</a></h3><p>套接字应用中最简单的传送函数是 <strong>send</strong>，send函数的作用类似于write，但send函数允许应用程序指定标志，规定如何对待传送数据。调用send函数时，会触发内核的 <strong>sys_send</strong> 函数，把发送缓冲区的数据发送出去。</p><p><strong>sys_send</strong> 函数具体调用流程如下。</p><p>1.应用程序的数据被复制到内核后，sys_send函数调用 <strong>sock_sendmsg</strong>，依据协议族类型来执行发送操作。</p><p>2.如果是INET协议族套接字，sock_sendmsg将调用inet_sendmsg函数。</p><p>3.如果采用TCP协议，inet_sendmsg函数将调用tcp_sendmsg，并按照TCP协议规则来发送数据包。</p><p>send函数返回发送成功，并不意味着在连接的另一端的进程可以收到数据，这里只能保证发送send函数执行成功，发送给网络设备驱动程序的数据没有出错。</p><h3 id="接收数据" tabindex="-1">接收数据 <a class="header-anchor" href="#接收数据" aria-label="Permalink to &quot;接收数据&quot;">​</a></h3><p><strong>recv</strong> 函数与文件读read函数类似，recv函数中可以指定标志来控制如何接收数据，调用recv函数时，应用程序会触发内核的sys_recv函数，把网络中的数据递交到应用程序。当然，read、recvfrom函数也会触发sys_recv函数。具体流程如下。</p><p>1.为把内核的网络数据转入应用程序的接收缓冲区，sys_recv函数依次调用 <strong>sys_recvfrom、sock_recvfrom和__sock_recvmsg</strong>，并依据协议族类型来执行具体的接收操作。</p><p>2.如果是INET协议族套接字，__sock_recvmsg将调用sock_common_recvmsg函数。</p><p>3.如果采用TCP协议，sock_common_recvmsg函数将调用tcp_recvmsg，按照TCP协议规则来接收数据包</p><p>如果接收方想获取数据包发送端的标识符，应用程序可以调用 <strong>sys_recvfrom</strong> 函数来获取数据包发送方的源地址，下面是 <strong>sys_recvfrom</strong> 函数的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __sys_recvfrom(int fd, void __user *ubuf, size_t size, unsigned int flags,</span></span>
<span class="line"><span>		   struct sockaddr __user *addr, int __user *addr_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	struct iovec iov;</span></span>
<span class="line"><span>	struct msghdr msg;</span></span>
<span class="line"><span>	struct sockaddr_storage address;</span></span>
<span class="line"><span>	int err, err2;</span></span>
<span class="line"><span>	int fput_needed;</span></span>
<span class="line"><span>	err = import_single_range(READ, ubuf, size, &amp;iov, &amp;msg.msg_iter);</span></span>
<span class="line"><span>	if (unlikely(err))</span></span>
<span class="line"><span>		return err;</span></span>
<span class="line"><span>    // 通过套接字描述符\b找到struct socket</span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	if (!sock)</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	msg.msg_control = NULL;</span></span>
<span class="line"><span>	msg.msg_controllen = 0;</span></span>
<span class="line"><span>	/* Save some cycles and don&#39;t copy the address if not needed */</span></span>
<span class="line"><span>	msg.msg_name = addr ? (struct sockaddr *)&amp;address : NULL;</span></span>
<span class="line"><span>	/* We assume all kernel code knows the size of sockaddr_storage */</span></span>
<span class="line"><span>	msg.msg_namelen = 0;</span></span>
<span class="line"><span>	msg.msg_iocb = NULL;</span></span>
<span class="line"><span>	msg.msg_flags = 0;</span></span>
<span class="line"><span>	if (sock-&amp;gt;file-&amp;gt;f_flags &amp; O_NONBLOCK)</span></span>
<span class="line"><span>		flags |= MSG_DONTWAIT;</span></span>
<span class="line"><span>    // sock_recvmsg为具体的接收函数</span></span>
<span class="line"><span>	err = sock_recvmsg(sock, &amp;msg, flags);</span></span>
<span class="line"><span>	if (err &amp;gt;= 0 &amp;&amp; addr != NULL) {</span></span>
<span class="line"><span>        // 从内核复制到用户空间</span></span>
<span class="line"><span>		err2 = move_addr_to_user(&amp;address,</span></span>
<span class="line"><span>					 msg.msg_namelen, addr, addr_len);</span></span>
<span class="line"><span>		if (err2 &amp;lt; 0)</span></span>
<span class="line"><span>			err = err2;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	fput_light(sock-&amp;gt;file, fput_needed);</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="关闭连接" tabindex="-1">关闭连接 <a class="header-anchor" href="#关闭连接" aria-label="Permalink to &quot;关闭连接&quot;">​</a></h3><p>最后，我们来看看如何关闭连接。当应用程序调用shutdown函数关闭连接时，内核会启动函数sys_shutdown，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __sys_shutdown(int fd, int how)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int err, fput_needed;</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);/* 通过套接字，描述符找到对应的结构*/</span></span>
<span class="line"><span>	if (sock != NULL) {</span></span>
<span class="line"><span>		err = security_socket_shutdown(sock, how);</span></span>
<span class="line"><span>		if (!err)</span></span>
<span class="line"><span>             /* 根据套接字协议族调用关闭函数*/</span></span>
<span class="line"><span>			err = sock-&amp;gt;ops-&amp;gt;shutdown(sock, how);</span></span>
<span class="line"><span>    		fput_light(sock-&amp;gt;file, fput_needed);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好，这节课的内容告一段落了，我来给你做个总结。这节课我们继续研究了套接字在Linux内核中的实现。</p><p>套接字是UNIX兼容系统的一大特色，Linux在此基础上实现了内核套接字与应用程序套接字接口，在用户地址空间与内核地址空间之间提供了一套标准接口，实现应用套接字库函数与内核功能之间的一一对应，简化了用户地址空间与内核地址空间交换数据的过程。</p><p>通过应用套接字API编写网络应用程序，我们可以利用Linux内核TCP/IP协议栈提供的网络通信服务，在网络上实现应用数据快速、有效的传送。除此之外，套接字编程还可以使我们获取网络、主机的各种管理、统计信息。</p><p>创建套接字应用程序一般要经过后面这6个步骤。</p><p>1.创建套接字。</p><p>2.将套接字与地址绑定，设置套接字选项。</p><p>3.建立套接字之间的连接。</p><p>4.监听套接字</p><p>5.接收、发送数据。</p><p>6.关闭、释放套接字。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>我们了解的TCP三次握手，发生在socket的哪几个函数中呢？</p><p>欢迎你在留言区跟我交流，也推荐你把这节课转发给有需要的朋友。</p><p>我是LMOS，我们下节课见！</p>`,76)])])}const g=n(t,[["render",l]]);export{k as __pageData,g as default};
