import{_ as n,H as a,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"44 | Socket内核数据结构：如何成立特大项目合作部？","description":"","frontmatter":{},"headers":[{"level":2,"title":"解析socket函数","slug":"解析socket函数","link":"#解析socket函数","children":[]},{"level":2,"title":"解析bind函数","slug":"解析bind函数","link":"#解析bind函数","children":[]},{"level":2,"title":"解析listen函数","slug":"解析listen函数","link":"#解析listen函数","children":[]},{"level":2,"title":"解析accept函数","slug":"解析accept函数","link":"#解析accept函数","children":[]},{"level":2,"title":"解析connect函数","slug":"解析connect函数","link":"#解析connect函数","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/44-Socket内核数据结构：如何成立特大项目合作部？.md","filePath":"趣谈Linux操作系统/44-Socket内核数据结构：如何成立特大项目合作部？.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/44-Socket内核数据结构：如何成立特大项目合作部？.md"};function c(l,s,i,o,_,r){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_44-socket内核数据结构-如何成立特大项目合作部" tabindex="-1">44 | Socket内核数据结构：如何成立特大项目合作部？ <a class="header-anchor" href="#_44-socket内核数据结构-如何成立特大项目合作部" aria-label="Permalink to &quot;44 | Socket内核数据结构：如何成立特大项目合作部？&quot;">​</a></h1><p>上一节我们讲了Socket在TCP和UDP场景下的调用流程。这一节，我们就沿着这个流程到内核里面一探究竟，看看在内核里面，都创建了哪些数据结构，做了哪些事情。</p><h2 id="解析socket函数" tabindex="-1">解析socket函数 <a class="header-anchor" href="#解析socket函数" aria-label="Permalink to &quot;解析socket函数&quot;">​</a></h2><p>我们从Socket系统调用开始。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(socket, int, family, int, type, int, protocol)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int retval;</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	int flags;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (SOCK_NONBLOCK != O_NONBLOCK &amp;&amp; (flags &amp; SOCK_NONBLOCK))</span></span>
<span class="line"><span>		flags = (flags &amp; ~SOCK_NONBLOCK) | O_NONBLOCK;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	retval = sock_create(family, type, protocol, &amp;sock);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	retval = sock_map_fd(sock, flags &amp; (O_CLOEXEC | O_NONBLOCK));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return retval;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面的代码比较容易看懂，Socket系统调用会调用sock_create创建一个struct socket结构，然后通过sock_map_fd和文件描述符对应起来。</p><p>在创建Socket的时候，有三个参数。</p><p>一个是 <strong>family</strong>，表示地址族。不是所有的Socket都要通过IP进行通信，还有其他的通信方式。例如，下面的定义中，domain sockets就是通过本地文件进行通信的，不需要IP地址。只不过，通过IP地址只是最常用的模式，所以我们这里着重分析这种模式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define AF_UNIX 1/* Unix domain sockets */</span></span>
<span class="line"><span>#define AF_INET 2/* Internet IP Protocol */</span></span></code></pre></div><p>第二个参数是 <strong>type</strong>，也即Socket的类型。类型是比较少的。</p><p>第三个参数是 <strong>protocol</strong>，是协议。协议数目是比较多的，也就是说，多个协议会属于同一种类型。</p><p>常用的Socket类型有三种，分别是SOCK_STREAM、SOCK_DGRAM和SOCK_RAW。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum sock_type {</span></span>
<span class="line"><span>SOCK_STREAM = 1,</span></span>
<span class="line"><span>SOCK_DGRAM = 2,</span></span>
<span class="line"><span>SOCK_RAW = 3,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>SOCK_STREAM是面向数据流的，协议IPPROTO_TCP属于这种类型。SOCK_DGRAM是面向数据报的，协议IPPROTO_UDP属于这种类型。如果在内核里面看的话，IPPROTO_ICMP也属于这种类型。SOCK_RAW是原始的IP包，IPPROTO_IP属于这种类型。</p><p><strong>这一节，我们重点看SOCK_STREAM类型和IPPROTO_TCP协议。</strong></p><p>为了管理family、type、protocol这三个分类层次，内核会创建对应的数据结构。</p><p>接下来，我们打开sock_create函数看一下。它会调用__sock_create。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __sock_create(struct net *net, int family, int type, int protocol,</span></span>
<span class="line"><span>			 struct socket **res, int kern)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	const struct net_proto_family *pf;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sock = sock_alloc();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sock-&amp;gt;type = type;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	pf = rcu_dereference(net_families[family]);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = pf-&amp;gt;create(net, sock, protocol, kern);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	*res = sock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里先是分配了一个struct socket结构。接下来我们要用到family参数。这里有一个net_families数组，我们可以以family参数为下标，找到对应的struct net_proto_family。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Supported address families. */</span></span>
<span class="line"><span>#define AF_UNSPEC	0</span></span>
<span class="line"><span>#define AF_UNIX		1	/* Unix domain sockets 		*/</span></span>
<span class="line"><span>#define AF_LOCAL	1	/* POSIX name for AF_UNIX	*/</span></span>
<span class="line"><span>#define AF_INET		2	/* Internet IP Protocol 	*/</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>#define AF_INET6	10	/* IP version 6			*/</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>#define AF_MPLS		28	/* MPLS */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>#define AF_MAX		44	/* For now.. */</span></span>
<span class="line"><span>#define NPROTO		AF_MAX</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct net_proto_family __rcu *net_families[NPROTO] __read_mostly;</span></span></code></pre></div><p>我们可以找到net_families的定义。每一个地址族在这个数组里面都有一项，里面的内容是net_proto_family。每一种地址族都有自己的net_proto_family，IP地址族的net_proto_family定义如下，里面最重要的就是，create函数指向inet_create。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//net/ipv4/af_inet.c</span></span>
<span class="line"><span>static const struct net_proto_family inet_family_ops = {</span></span>
<span class="line"><span>	.family = PF_INET,</span></span>
<span class="line"><span>	.create = inet_create,//这个用于socket系统调用创建</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们回到函数__sock_create。接下来，在这里面，这个inet_create会被调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int inet_create(struct net *net, struct socket *sock, int protocol, int kern)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sock *sk;</span></span>
<span class="line"><span>	struct inet_protosw *answer;</span></span>
<span class="line"><span>	struct inet_sock *inet;</span></span>
<span class="line"><span>	struct proto *answer_prot;</span></span>
<span class="line"><span>	unsigned char answer_flags;</span></span>
<span class="line"><span>	int try_loading_module = 0;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Look for the requested type/protocol pair. */</span></span>
<span class="line"><span>lookup_protocol:</span></span>
<span class="line"><span>	list_for_each_entry_rcu(answer, &amp;inetsw[sock-&amp;gt;type], list) {</span></span>
<span class="line"><span>		err = 0;</span></span>
<span class="line"><span>		/* Check the non-wild match. */</span></span>
<span class="line"><span>		if (protocol == answer-&amp;gt;protocol) {</span></span>
<span class="line"><span>			if (protocol != IPPROTO_IP)</span></span>
<span class="line"><span>				break;</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			/* Check for the two wild cases. */</span></span>
<span class="line"><span>			if (IPPROTO_IP == protocol) {</span></span>
<span class="line"><span>				protocol = answer-&amp;gt;protocol;</span></span>
<span class="line"><span>				break;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			if (IPPROTO_IP == answer-&amp;gt;protocol)</span></span>
<span class="line"><span>				break;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		err = -EPROTONOSUPPORT;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sock-&amp;gt;ops = answer-&amp;gt;ops;</span></span>
<span class="line"><span>	answer_prot = answer-&amp;gt;prot;</span></span>
<span class="line"><span>	answer_flags = answer-&amp;gt;flags;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sk = sk_alloc(net, PF_INET, GFP_KERNEL, answer_prot, kern);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	inet = inet_sk(sk);</span></span>
<span class="line"><span>	inet-&amp;gt;nodefrag = 0;</span></span>
<span class="line"><span>	if (SOCK_RAW == sock-&amp;gt;type) {</span></span>
<span class="line"><span>		inet-&amp;gt;inet_num = protocol;</span></span>
<span class="line"><span>		if (IPPROTO_RAW == protocol)</span></span>
<span class="line"><span>			inet-&amp;gt;hdrincl = 1;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	inet-&amp;gt;inet_id = 0;</span></span>
<span class="line"><span>	sock_init_data(sock, sk);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sk-&amp;gt;sk_destruct	   = inet_sock_destruct;</span></span>
<span class="line"><span>	sk-&amp;gt;sk_protocol	   = protocol;</span></span>
<span class="line"><span>	sk-&amp;gt;sk_backlog_rcv = sk-&amp;gt;sk_prot-&amp;gt;backlog_rcv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	inet-&amp;gt;uc_ttl	= -1;</span></span>
<span class="line"><span>	inet-&amp;gt;mc_loop	= 1;</span></span>
<span class="line"><span>	inet-&amp;gt;mc_ttl	= 1;</span></span>
<span class="line"><span>	inet-&amp;gt;mc_all	= 1;</span></span>
<span class="line"><span>	inet-&amp;gt;mc_index	= 0;</span></span>
<span class="line"><span>	inet-&amp;gt;mc_list	= NULL;</span></span>
<span class="line"><span>	inet-&amp;gt;rcv_tos	= 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (inet-&amp;gt;inet_num) {</span></span>
<span class="line"><span>		inet-&amp;gt;inet_sport = htons(inet-&amp;gt;inet_num);</span></span>
<span class="line"><span>		/* Add to protocol hash chains. */</span></span>
<span class="line"><span>		err = sk-&amp;gt;sk_prot-&amp;gt;hash(sk);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_prot-&amp;gt;init) {</span></span>
<span class="line"><span>		err = sk-&amp;gt;sk_prot-&amp;gt;init(sk);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在inet_create中，我们先会看到一个循环list_for_each_entry_rcu。在这里，第二个参数type开始起作用。因为循环查看的是inetsw[sock-&gt;type]。</p><p>这里的inetsw也是一个数组，type作为下标，里面的内容是struct inet_protosw，是协议，也即inetsw数组对于每个类型有一项，这一项里面是属于这个类型的协议。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct list_head inetsw[SOCK_MAX];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init inet_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Register the socket-side information for inet_create. */</span></span>
<span class="line"><span>	for (r = &amp;inetsw[0]; r &amp;lt; &amp;inetsw[SOCK_MAX]; ++r)</span></span>
<span class="line"><span>		INIT_LIST_HEAD(r);</span></span>
<span class="line"><span>	for (q = inetsw_array; q &amp;lt; &amp;inetsw_array[INETSW_ARRAY_LEN]; ++q)</span></span>
<span class="line"><span>		inet_register_protosw(q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>inetsw数组是在系统初始化的时候初始化的，就像下面代码里面实现的一样。</p><p>首先，一个循环会将inetsw数组的每一项，都初始化为一个链表。咱们前面说了，一个type类型会包含多个protocol，因而我们需要一个链表。接下来一个循环，是将inetsw_array注册到inetsw数组里面去。inetsw_array的定义如下，这个数组里面的内容很重要，后面会用到它们。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct inet_protosw inetsw_array[] =</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		.type =       SOCK_STREAM,</span></span>
<span class="line"><span>		.protocol =   IPPROTO_TCP,</span></span>
<span class="line"><span>		.prot =       &amp;tcp_prot,</span></span>
<span class="line"><span>		.ops =        &amp;inet_stream_ops,</span></span>
<span class="line"><span>		.flags =      INET_PROTOSW_PERMANENT |</span></span>
<span class="line"><span>			      INET_PROTOSW_ICSK,</span></span>
<span class="line"><span>	},</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		.type =       SOCK_DGRAM,</span></span>
<span class="line"><span>		.protocol =   IPPROTO_UDP,</span></span>
<span class="line"><span>		.prot =       &amp;udp_prot,</span></span>
<span class="line"><span>		.ops =        &amp;inet_dgram_ops,</span></span>
<span class="line"><span>		.flags =      INET_PROTOSW_PERMANENT,</span></span>
<span class="line"><span>     },</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>		.type =       SOCK_DGRAM,</span></span>
<span class="line"><span>		.protocol =   IPPROTO_ICMP,</span></span>
<span class="line"><span>		.prot =       &amp;ping_prot,</span></span>
<span class="line"><span>		.ops =        &amp;inet_sockraw_ops,</span></span>
<span class="line"><span>		.flags =      INET_PROTOSW_REUSE,</span></span>
<span class="line"><span>     },</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>        .type =       SOCK_RAW,</span></span>
<span class="line"><span>	    .protocol =   IPPROTO_IP,	/* wild card */</span></span>
<span class="line"><span>	    .prot =       &amp;raw_prot,</span></span>
<span class="line"><span>	    .ops =        &amp;inet_sockraw_ops,</span></span>
<span class="line"><span>	    .flags =      INET_PROTOSW_REUSE,</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们回到inet_create的list_for_each_entry_rcu循环中。到这里就好理解了，这是在inetsw数组中，根据type找到属于这个类型的列表，然后依次比较列表中的struct inet_protosw的protocol是不是用户指定的protocol；如果是，就得到了符合用户指定的family-&gt;type-&gt;protocol的struct inet_protosw *answer对象。</p><p>接下来，struct socket *sock的ops成员变量，被赋值为answer的ops。对于TCP来讲，就是inet_stream_ops。后面任何用户对于这个socket的操作，都是通过inet_stream_ops进行的。</p><p>接下来，我们创建一个struct sock *sk对象。这里比较让人困惑。socket和sock看起来几乎一样，容易让人混淆，这里需要说明一下，socket是用于负责对上给用户提供接口，并且和文件系统关联。而sock，负责向下对接内核网络协议栈。</p><p>在sk_alloc函数中，struct inet_protosw *answer结构的tcp_prot赋值给了struct sock *sk的sk_prot成员。tcp_prot的定义如下，里面定义了很多的函数，都是sock之下内核协议栈的动作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct proto tcp_prot = {</span></span>
<span class="line"><span>	.name			= &quot;TCP&quot;,</span></span>
<span class="line"><span>	.owner			= THIS_MODULE,</span></span>
<span class="line"><span>	.close			= tcp_close,</span></span>
<span class="line"><span>	.connect		= tcp_v4_connect,</span></span>
<span class="line"><span>	.disconnect		= tcp_disconnect,</span></span>
<span class="line"><span>	.accept			= inet_csk_accept,</span></span>
<span class="line"><span>	.ioctl			= tcp_ioctl,</span></span>
<span class="line"><span>	.init			= tcp_v4_init_sock,</span></span>
<span class="line"><span>	.destroy		= tcp_v4_destroy_sock,</span></span>
<span class="line"><span>	.shutdown		= tcp_shutdown,</span></span>
<span class="line"><span>	.setsockopt		= tcp_setsockopt,</span></span>
<span class="line"><span>	.getsockopt		= tcp_getsockopt,</span></span>
<span class="line"><span>	.keepalive		= tcp_set_keepalive,</span></span>
<span class="line"><span>	.recvmsg		= tcp_recvmsg,</span></span>
<span class="line"><span>	.sendmsg		= tcp_sendmsg,</span></span>
<span class="line"><span>	.sendpage		= tcp_sendpage,</span></span>
<span class="line"><span>	.backlog_rcv		= tcp_v4_do_rcv,</span></span>
<span class="line"><span>	.release_cb		= tcp_release_cb,</span></span>
<span class="line"><span>	.hash			= inet_hash,</span></span>
<span class="line"><span>    .get_port		= inet_csk_get_port,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在inet_create函数中，接下来创建一个struct inet_sock结构，这个结构一开始就是struct sock，然后扩展了一些其他的信息，剩下的代码就填充这些信息。这一幕我们会经常看到，将一个结构放在另一个结构的开始位置，然后扩展一些成员，通过对于指针的强制类型转换，来访问这些成员。</p><p>socket的创建至此结束。</p><h2 id="解析bind函数" tabindex="-1">解析bind函数 <a class="header-anchor" href="#解析bind函数" aria-label="Permalink to &quot;解析bind函数&quot;">​</a></h2><p>接下来，我们来看bind。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(bind, int, fd, struct sockaddr __user *, umyaddr, int, addrlen)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	struct sockaddr_storage address;</span></span>
<span class="line"><span>	int err, fput_needed;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	if (sock) {</span></span>
<span class="line"><span>		err = move_addr_to_kernel(umyaddr, addrlen, &amp;address);</span></span>
<span class="line"><span>		if (err &amp;gt;= 0) {</span></span>
<span class="line"><span>			err = sock-&amp;gt;ops-&amp;gt;bind(sock,</span></span>
<span class="line"><span>						      (struct sockaddr *)</span></span>
<span class="line"><span>						      &amp;address, addrlen);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		fput_light(sock-&amp;gt;file, fput_needed);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在bind中，sockfd_lookup_light会根据fd文件描述符，找到struct socket结构。然后将sockaddr从用户态拷贝到内核态，然后调用struct socket结构里面ops的bind函数。根据前面创建socket的时候的设定，调用的是inet_stream_ops的bind函数，也即调用inet_bind。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int inet_bind(struct socket *sock, struct sockaddr *uaddr, int addr_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sockaddr_in *addr = (struct sockaddr_in *)uaddr;</span></span>
<span class="line"><span>	struct sock *sk = sock-&amp;gt;sk;</span></span>
<span class="line"><span>	struct inet_sock *inet = inet_sk(sk);</span></span>
<span class="line"><span>	struct net *net = sock_net(sk);</span></span>
<span class="line"><span>	unsigned short snum;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	snum = ntohs(addr-&amp;gt;sin_port);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	inet-&amp;gt;inet_rcv_saddr = inet-&amp;gt;inet_saddr = addr-&amp;gt;sin_addr.s_addr;</span></span>
<span class="line"><span>	/* Make sure we are allowed to bind here. */</span></span>
<span class="line"><span>	if ((snum || !inet-&amp;gt;bind_address_no_port) &amp;&amp;</span></span>
<span class="line"><span>	    sk-&amp;gt;sk_prot-&amp;gt;get_port(sk, snum)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	inet-&amp;gt;inet_sport = htons(inet-&amp;gt;inet_num);</span></span>
<span class="line"><span>	inet-&amp;gt;inet_daddr = 0;</span></span>
<span class="line"><span>	inet-&amp;gt;inet_dport = 0;</span></span>
<span class="line"><span>	sk_dst_reset(sk);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>bind里面会调用sk_prot的get_port函数，也即inet_csk_get_port来检查端口是否冲突，是否可以绑定。如果允许，则会设置struct inet_sock的本方的地址inet_saddr和本方的端口inet_sport，对方的地址inet_daddr和对方的端口inet_dport都初始化为0。</p><p>bind的逻辑相对比较简单，就到这里了。</p><h2 id="解析listen函数" tabindex="-1">解析listen函数 <a class="header-anchor" href="#解析listen函数" aria-label="Permalink to &quot;解析listen函数&quot;">​</a></h2><p>接下来我们来看listen。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE2(listen, int, fd, int, backlog)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	int err, fput_needed;</span></span>
<span class="line"><span>	int somaxconn;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	if (sock) {</span></span>
<span class="line"><span>		somaxconn = sock_net(sock-&amp;gt;sk)-&amp;gt;core.sysctl_somaxconn;</span></span>
<span class="line"><span>		if ((unsigned int)backlog &amp;gt; somaxconn)</span></span>
<span class="line"><span>			backlog = somaxconn;</span></span>
<span class="line"><span>		err = sock-&amp;gt;ops-&amp;gt;listen(sock, backlog);</span></span>
<span class="line"><span>		fput_light(sock-&amp;gt;file, fput_needed);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在listen中，我们还是通过sockfd_lookup_light，根据fd文件描述符，找到struct socket结构。接着，我们调用struct socket结构里面ops的listen函数。根据前面创建socket的时候的设定，调用的是inet_stream_ops的listen函数，也即调用inet_listen。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int inet_listen(struct socket *sock, int backlog)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sock *sk = sock-&amp;gt;sk;</span></span>
<span class="line"><span>	unsigned char old_state;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	old_state = sk-&amp;gt;sk_state;</span></span>
<span class="line"><span>	/* Really, if the socket is already in listen state</span></span>
<span class="line"><span>	 * we can only allow the backlog to be adjusted.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	if (old_state != TCP_LISTEN) {</span></span>
<span class="line"><span>		err = inet_csk_listen_start(sk, backlog);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	sk-&amp;gt;sk_max_ack_backlog = backlog;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果这个socket还不在TCP_LISTEN状态，会调用inet_csk_listen_start进入监听状态。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int inet_csk_listen_start(struct sock *sk, int backlog)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	struct inet_sock *inet = inet_sk(sk);</span></span>
<span class="line"><span>	int err = -EADDRINUSE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	reqsk_queue_alloc(&amp;icsk-&amp;gt;icsk_accept_queue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sk-&amp;gt;sk_max_ack_backlog = backlog;</span></span>
<span class="line"><span>	sk-&amp;gt;sk_ack_backlog = 0;</span></span>
<span class="line"><span>	inet_csk_delack_init(sk);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sk_state_store(sk, TCP_LISTEN);</span></span>
<span class="line"><span>	if (!sk-&amp;gt;sk_prot-&amp;gt;get_port(sk, inet-&amp;gt;inet_num)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面建立了一个新的结构inet_connection_sock，这个结构一开始是struct inet_sock，inet_csk其实做了一次强制类型转换，扩大了结构，看到了吧，又是这个套路。</p><p>struct inet_connection_sock结构比较复杂。如果打开它，你能看到处于各种状态的队列，各种超时时间、拥塞控制等字眼。我们说TCP是面向连接的，就是客户端和服务端都是有一个结构维护连接的状态，就是指这个结构。我们这里先不详细分析里面的变量，因为太多了，后面我们遇到一个分析一个。</p><p>首先，我们遇到的是icsk_accept_queue。它是干什么的呢？</p><p>在TCP的状态里面，有一个listen状态，当调用listen函数之后，就会进入这个状态，虽然我们写程序的时候，一般要等待服务端调用accept后，等待在哪里的时候，让客户端就发起连接。其实服务端一旦处于listen状态，不用accept，客户端也能发起连接。其实TCP的状态中，没有一个是否被accept的状态，那accept函数的作用是什么呢？</p><p>在内核中，为每个Socket维护两个队列。一个是已经建立了连接的队列，这时候连接三次握手已经完毕，处于established状态；一个是还没有完全建立连接的队列，这个时候三次握手还没完成，处于syn_rcvd的状态。</p><p>服务端调用accept函数，其实是在第一个队列中拿出一个已经完成的连接进行处理。如果还没有完成就阻塞等待。这里的icsk_accept_queue就是第一个队列。</p><p>初始化完之后，将TCP的状态设置为TCP_LISTEN，再次调用get_port判断端口是否冲突。</p><p>至此，listen的逻辑就结束了。</p><h2 id="解析accept函数" tabindex="-1">解析accept函数 <a class="header-anchor" href="#解析accept函数" aria-label="Permalink to &quot;解析accept函数&quot;">​</a></h2><p>接下来，我们解析服务端调用accept。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(accept, int, fd, struct sockaddr __user *, upeer_sockaddr,</span></span>
<span class="line"><span>		int __user *, upeer_addrlen)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return sys_accept4(fd, upeer_sockaddr, upeer_addrlen, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYSCALL_DEFINE4(accept4, int, fd, struct sockaddr __user *, upeer_sockaddr,</span></span>
<span class="line"><span>		int __user *, upeer_addrlen, int, flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock, *newsock;</span></span>
<span class="line"><span>	struct file *newfile;</span></span>
<span class="line"><span>	int err, len, newfd, fput_needed;</span></span>
<span class="line"><span>	struct sockaddr_storage address;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	newsock = sock_alloc();</span></span>
<span class="line"><span>	newsock-&amp;gt;type = sock-&amp;gt;type;</span></span>
<span class="line"><span>	newsock-&amp;gt;ops = sock-&amp;gt;ops;</span></span>
<span class="line"><span>	newfd = get_unused_fd_flags(flags);</span></span>
<span class="line"><span>	newfile = sock_alloc_file(newsock, flags, sock-&amp;gt;sk-&amp;gt;sk_prot_creator-&amp;gt;name);</span></span>
<span class="line"><span>	err = sock-&amp;gt;ops-&amp;gt;accept(sock, newsock, sock-&amp;gt;file-&amp;gt;f_flags, false);</span></span>
<span class="line"><span>	if (upeer_sockaddr) {</span></span>
<span class="line"><span>		if (newsock-&amp;gt;ops-&amp;gt;getname(newsock, (struct sockaddr *)&amp;address, &amp;len, 2) &amp;lt; 0) {</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		err = move_addr_to_user(&amp;address,</span></span>
<span class="line"><span>					len, upeer_sockaddr, upeer_addrlen);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	fd_install(newfd, newfile);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>accept函数的实现，印证了socket的原理中说的那样，原来的socket是监听socket，这里我们会找到原来的struct socket，并基于它去创建一个新的newsock。这才是连接socket。除此之外，我们还会创建一个新的struct file和fd，并关联到socket。</p><p>这里面还会调用struct socket的sock-&gt;ops-&gt;accept，也即会调用inet_stream_ops的accept函数，也即inet_accept。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int inet_accept(struct socket *sock, struct socket *newsock, int flags, bool kern)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sock *sk1 = sock-&amp;gt;sk;</span></span>
<span class="line"><span>	int err = -EINVAL;</span></span>
<span class="line"><span>	struct sock *sk2 = sk1-&amp;gt;sk_prot-&amp;gt;accept(sk1, flags, &amp;err, kern);</span></span>
<span class="line"><span>	sock_rps_record_flow(sk2);</span></span>
<span class="line"><span>	sock_graft(sk2, newsock);</span></span>
<span class="line"><span>	newsock-&amp;gt;state = SS_CONNECTED;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>inet_accept会调用struct sock的sk1-&gt;sk_prot-&gt;accept，也即tcp_prot的accept函数，inet_csk_accept函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * This will accept the next outstanding connection.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct sock *inet_csk_accept(struct sock *sk, int flags, int *err, bool kern)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	struct request_sock_queue *queue = &amp;icsk-&amp;gt;icsk_accept_queue;</span></span>
<span class="line"><span>	struct request_sock *req;</span></span>
<span class="line"><span>	struct sock *newsk;</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_state != TCP_LISTEN)</span></span>
<span class="line"><span>		goto out_err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Find already established connection */</span></span>
<span class="line"><span>	if (reqsk_queue_empty(queue)) {</span></span>
<span class="line"><span>		long timeo = sock_rcvtimeo(sk, flags &amp; O_NONBLOCK);</span></span>
<span class="line"><span>		error = inet_csk_wait_for_connect(sk, timeo);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	req = reqsk_queue_remove(queue, sk);</span></span>
<span class="line"><span>	newsk = req-&amp;gt;sk;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * Wait for an incoming connection, avoid race conditions. This must be called</span></span>
<span class="line"><span> * with the socket locked.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static int inet_csk_wait_for_connect(struct sock *sk, long timeo)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	DEFINE_WAIT(wait);</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	for (;;) {</span></span>
<span class="line"><span>		prepare_to_wait_exclusive(sk_sleep(sk), &amp;wait,</span></span>
<span class="line"><span>					  TASK_INTERRUPTIBLE);</span></span>
<span class="line"><span>		release_sock(sk);</span></span>
<span class="line"><span>		if (reqsk_queue_empty(&amp;icsk-&amp;gt;icsk_accept_queue))</span></span>
<span class="line"><span>			timeo = schedule_timeout(timeo);</span></span>
<span class="line"><span>		sched_annotate_sleep();</span></span>
<span class="line"><span>		lock_sock(sk);</span></span>
<span class="line"><span>		err = 0;</span></span>
<span class="line"><span>		if (!reqsk_queue_empty(&amp;icsk-&amp;gt;icsk_accept_queue))</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		err = -EINVAL;</span></span>
<span class="line"><span>		if (sk-&amp;gt;sk_state != TCP_LISTEN)</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		err = sock_intr_errno(timeo);</span></span>
<span class="line"><span>		if (signal_pending(current))</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		err = -EAGAIN;</span></span>
<span class="line"><span>		if (!timeo)</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	finish_wait(sk_sleep(sk), &amp;wait);</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>inet_csk_accept的实现，印证了上面我们讲的两个队列的逻辑。如果icsk_accept_queue为空，则调用inet_csk_wait_for_connect进行等待；等待的时候，调用schedule_timeout，让出CPU，并且将进程状态设置为TASK_INTERRUPTIBLE。</p><p>如果再次CPU醒来，我们会接着判断icsk_accept_queue是否为空，同时也会调用signal_pending看有没有信号可以处理。一旦icsk_accept_queue不为空，就从inet_csk_wait_for_connect中返回，在队列中取出一个struct sock对象赋值给newsk。</p><h2 id="解析connect函数" tabindex="-1">解析connect函数 <a class="header-anchor" href="#解析connect函数" aria-label="Permalink to &quot;解析connect函数&quot;">​</a></h2><p>什么情况下，icsk_accept_queue才不为空呢？当然是三次握手结束才可以。接下来我们来分析三次握手的过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/105980/ab92c2afb4aafb53143c471293ccb2df.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/105980/ab92c2afb4aafb53143c471293ccb2df.png" alt=""></a></p><p>三次握手一般是由客户端调用connect发起。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(connect, int, fd, struct sockaddr __user *, uservaddr,</span></span>
<span class="line"><span>		int, addrlen)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct socket *sock;</span></span>
<span class="line"><span>	struct sockaddr_storage address;</span></span>
<span class="line"><span>	int err, fput_needed;</span></span>
<span class="line"><span>	sock = sockfd_lookup_light(fd, &amp;err, &amp;fput_needed);</span></span>
<span class="line"><span>	err = move_addr_to_kernel(uservaddr, addrlen, &amp;address);</span></span>
<span class="line"><span>	err = sock-&amp;gt;ops-&amp;gt;connect(sock, (struct sockaddr *)&amp;address, addrlen, sock-&amp;gt;file-&amp;gt;f_flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>connect函数的实现一开始你应该很眼熟，还是通过sockfd_lookup_light，根据fd文件描述符，找到struct socket结构。接着，我们会调用struct socket结构里面ops的connect函数，根据前面创建socket的时候的设定，调用inet_stream_ops的connect函数，也即调用inet_stream_connect。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> *	Connect to a remote host. There is regrettably still a little</span></span>
<span class="line"><span> *	TCP &#39;magic&#39; in here.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>int __inet_stream_connect(struct socket *sock, struct sockaddr *uaddr,</span></span>
<span class="line"><span>			  int addr_len, int flags, int is_sendmsg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sock *sk = sock-&amp;gt;sk;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	long timeo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch (sock-&amp;gt;state) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case SS_UNCONNECTED:</span></span>
<span class="line"><span>		err = -EISCONN;</span></span>
<span class="line"><span>		if (sk-&amp;gt;sk_state != TCP_CLOSE)</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		err = sk-&amp;gt;sk_prot-&amp;gt;connect(sk, uaddr, addr_len);</span></span>
<span class="line"><span>		sock-&amp;gt;state = SS_CONNECTING;</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	timeo = sock_sndtimeo(sk, flags &amp; O_NONBLOCK);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if ((1 &amp;lt;&amp;lt; sk-&amp;gt;sk_state) &amp; (TCPF_SYN_SENT | TCPF_SYN_RECV)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (!timeo || !inet_wait_for_connect(sk, timeo, writebias))</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		err = sock_intr_errno(timeo);</span></span>
<span class="line"><span>		if (signal_pending(current))</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	sock-&amp;gt;state = SS_CONNECTED;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在__inet_stream_connect里面，我们发现，如果socket处于SS_UNCONNECTED状态，那就调用struct sock的sk-&gt;sk_prot-&gt;connect，也即tcp_prot的connect函数——tcp_v4_connect函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_v4_connect(struct sock *sk, struct sockaddr *uaddr, int addr_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sockaddr_in *usin = (struct sockaddr_in *)uaddr;</span></span>
<span class="line"><span>	struct inet_sock *inet = inet_sk(sk);</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	__be16 orig_sport, orig_dport;</span></span>
<span class="line"><span>	__be32 daddr, nexthop;</span></span>
<span class="line"><span>	struct flowi4 *fl4;</span></span>
<span class="line"><span>	struct rtable *rt;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	orig_sport = inet-&amp;gt;inet_sport;</span></span>
<span class="line"><span>	orig_dport = usin-&amp;gt;sin_port;</span></span>
<span class="line"><span>	rt = ip_route_connect(fl4, nexthop, inet-&amp;gt;inet_saddr,</span></span>
<span class="line"><span>			      RT_CONN_FLAGS(sk), sk-&amp;gt;sk_bound_dev_if,</span></span>
<span class="line"><span>			      IPPROTO_TCP,</span></span>
<span class="line"><span>			      orig_sport, orig_dport, sk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tcp_set_state(sk, TCP_SYN_SENT);</span></span>
<span class="line"><span>	err = inet_hash_connect(tcp_death_row, sk);</span></span>
<span class="line"><span>	sk_set_txhash(sk);</span></span>
<span class="line"><span>	rt = ip_route_newports(fl4, rt, orig_sport, orig_dport,</span></span>
<span class="line"><span>			       inet-&amp;gt;inet_sport, inet-&amp;gt;inet_dport, sk);</span></span>
<span class="line"><span>	/* OK, now commit destination to socket.  */</span></span>
<span class="line"><span>	sk-&amp;gt;sk_gso_type = SKB_GSO_TCPV4;</span></span>
<span class="line"><span>	sk_setup_caps(sk, &amp;rt-&amp;gt;dst);</span></span>
<span class="line"><span>    if (likely(!tp-&amp;gt;repair)) {</span></span>
<span class="line"><span>		if (!tp-&amp;gt;write_seq)</span></span>
<span class="line"><span>			tp-&amp;gt;write_seq = secure_tcp_seq(inet-&amp;gt;inet_saddr,</span></span>
<span class="line"><span>						       inet-&amp;gt;inet_daddr,</span></span>
<span class="line"><span>						       inet-&amp;gt;inet_sport,</span></span>
<span class="line"><span>						       usin-&amp;gt;sin_port);</span></span>
<span class="line"><span>		tp-&amp;gt;tsoffset = secure_tcp_ts_off(sock_net(sk),</span></span>
<span class="line"><span>						 inet-&amp;gt;inet_saddr,</span></span>
<span class="line"><span>						 inet-&amp;gt;inet_daddr);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	rt = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = tcp_connect(sk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_v4_connect函数中，ip_route_connect其实是做一个路由的选择。为什么呢？因为三次握手马上就要发送一个SYN包了，这就要凑齐源地址、源端口、目标地址、目标端口。目标地址和目标端口是服务端的，已经知道源端口是客户端随机分配的，源地址应该用哪一个呢？这时候要选择一条路由，看从哪个网卡出去，就应该填写哪个网卡的IP地址。</p><p>接下来，在发送SYN之前，我们先将客户端socket的状态设置为TCP_SYN_SENT。然后初始化TCP的seq num，也即write_seq，然后调用tcp_connect进行发送。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Build a SYN and send it off. */</span></span>
<span class="line"><span>int tcp_connect(struct sock *sk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	struct sk_buff *buff;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tcp_connect_init(sk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	buff = sk_stream_alloc_skb(sk, 0, sk-&amp;gt;sk_allocation, true);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tcp_init_nondata_skb(buff, tp-&amp;gt;write_seq++, TCPHDR_SYN);</span></span>
<span class="line"><span>	tcp_mstamp_refresh(tp);</span></span>
<span class="line"><span>	tp-&amp;gt;retrans_stamp = tcp_time_stamp(tp);</span></span>
<span class="line"><span>	tcp_connect_queue_skb(sk, buff);</span></span>
<span class="line"><span>	tcp_ecn_send_syn(sk, buff);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Send off SYN; include data in Fast Open. */</span></span>
<span class="line"><span>	err = tp-&amp;gt;fastopen_req ? tcp_send_syn_data(sk, buff) :</span></span>
<span class="line"><span>	      tcp_transmit_skb(sk, buff, 1, sk-&amp;gt;sk_allocation);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tp-&amp;gt;snd_nxt = tp-&amp;gt;write_seq;</span></span>
<span class="line"><span>	tp-&amp;gt;pushed_seq = tp-&amp;gt;write_seq;</span></span>
<span class="line"><span>	buff = tcp_send_head(sk);</span></span>
<span class="line"><span>	if (unlikely(buff)) {</span></span>
<span class="line"><span>		tp-&amp;gt;snd_nxt	= TCP_SKB_CB(buff)-&amp;gt;seq;</span></span>
<span class="line"><span>		tp-&amp;gt;pushed_seq	= TCP_SKB_CB(buff)-&amp;gt;seq;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Timer for repeating the SYN until an answer. */</span></span>
<span class="line"><span>	inet_csk_reset_xmit_timer(sk, ICSK_TIME_RETRANS,</span></span>
<span class="line"><span>				  inet_csk(sk)-&amp;gt;icsk_rto, TCP_RTO_MAX);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_connect中，有一个新的结构struct tcp_sock，如果打开他，你会发现他是struct inet_connection_sock的一个扩展，struct inet_connection_sock在struct tcp_sock开头的位置，通过强制类型转换访问，故伎重演又一次。</p><p>struct tcp_sock里面维护了更多的TCP的状态，咱们同样是遇到了再分析。</p><p>接下来tcp_init_nondata_skb初始化一个SYN包，tcp_transmit_skb将SYN包发送出去，inet_csk_reset_xmit_timer设置了一个timer，如果SYN发送不成功，则再次发送。</p><p>发送网络包的过程，我们放到下一节讲解。这里我们姑且认为SYN已经发送出去了。</p><p>我们回到__inet_stream_connect函数，在调用sk-&gt;sk_prot-&gt;connect之后，inet_wait_for_connect会一直等待客户端收到服务端的ACK。而我们知道，服务端在accept之后，也是在等待中。</p><p>网络包是如何接收的呢？对于解析的详细过程，我们会在下下节讲解，这里为了解析三次握手，我们简单的看网络包接收到TCP层做的部分事情。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct net_protocol tcp_protocol = {</span></span>
<span class="line"><span>	.early_demux	=	tcp_v4_early_demux,</span></span>
<span class="line"><span>	.early_demux_handler =  tcp_v4_early_demux,</span></span>
<span class="line"><span>	.handler	=	tcp_v4_rcv,</span></span>
<span class="line"><span>	.err_handler	=	tcp_v4_err,</span></span>
<span class="line"><span>	.no_policy	=	1,</span></span>
<span class="line"><span>	.netns_ok	=	1,</span></span>
<span class="line"><span>	.icmp_strict_tag_validation = 1,</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们通过struct net_protocol结构中的handler进行接收，调用的函数是tcp_v4_rcv。接下来的调用链为tcp_v4_rcv-&gt;tcp_v4_do_rcv-&gt;tcp_rcv_state_process。tcp_rcv_state_process，顾名思义，是用来处理接收一个网络包后引起状态变化的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_rcv_state_process(struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	const struct tcphdr *th = tcp_hdr(skb);</span></span>
<span class="line"><span>	struct request_sock *req;</span></span>
<span class="line"><span>	int queued = 0;</span></span>
<span class="line"><span>	bool acceptable;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch (sk-&amp;gt;sk_state) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_LISTEN:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (th-&amp;gt;syn) {</span></span>
<span class="line"><span>			acceptable = icsk-&amp;gt;icsk_af_ops-&amp;gt;conn_request(sk, skb) &amp;gt;= 0;</span></span>
<span class="line"><span>			if (!acceptable)</span></span>
<span class="line"><span>				return 1;</span></span>
<span class="line"><span>			consume_skb(skb);</span></span>
<span class="line"><span>			return 0;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>目前服务端是处于TCP_LISTEN状态的，而且发过来的包是SYN，因而就有了上面的代码，调用icsk-&gt;icsk_af_ops-&gt;conn_request函数。struct inet_connection_sock对应的操作是inet_connection_sock_af_ops，按照下面的定义，其实调用的是tcp_v4_conn_request。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct inet_connection_sock_af_ops ipv4_specific = {</span></span>
<span class="line"><span>        .queue_xmit        = ip_queue_xmit,</span></span>
<span class="line"><span>        .send_check        = tcp_v4_send_check,</span></span>
<span class="line"><span>        .rebuild_header    = inet_sk_rebuild_header,</span></span>
<span class="line"><span>        .sk_rx_dst_set     = inet_sk_rx_dst_set,</span></span>
<span class="line"><span>        .conn_request      = tcp_v4_conn_request,</span></span>
<span class="line"><span>        .syn_recv_sock     = tcp_v4_syn_recv_sock,</span></span>
<span class="line"><span>        .net_header_len    = sizeof(struct iphdr),</span></span>
<span class="line"><span>        .setsockopt        = ip_setsockopt,</span></span>
<span class="line"><span>        .getsockopt        = ip_getsockopt,</span></span>
<span class="line"><span>        .addr2sockaddr     = inet_csk_addr2sockaddr,</span></span>
<span class="line"><span>        .sockaddr_len      = sizeof(struct sockaddr_in),</span></span>
<span class="line"><span>        .mtu_reduced       = tcp_v4_mtu_reduced,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>tcp_v4_conn_request会调用tcp_conn_request，这个函数也比较长，里面调用了send_synack，但实际调用的是tcp_v4_send_synack。具体发送的过程我们不去管它，看注释我们能知道，这是收到了SYN后，回复一个SYN-ACK，回复完毕后，服务端处于TCP_SYN_RECV。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_conn_request(struct request_sock_ops *rsk_ops,</span></span>
<span class="line"><span>		     const struct tcp_request_sock_ops *af_ops,</span></span>
<span class="line"><span>		     struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>af_ops-&amp;gt;send_synack(sk, dst, &amp;fl, req, &amp;foc,</span></span>
<span class="line"><span>				    !want_cookie ? TCP_SYNACK_NORMAL :</span></span>
<span class="line"><span>						   TCP_SYNACK_COOKIE);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> *	Send a SYN-ACK after having received a SYN.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static int tcp_v4_send_synack(const struct sock *sk, struct dst_entry *dst,</span></span>
<span class="line"><span>			      struct flowi *fl,</span></span>
<span class="line"><span>			      struct request_sock *req,</span></span>
<span class="line"><span>			      struct tcp_fastopen_cookie *foc,</span></span>
<span class="line"><span>			      enum tcp_synack_type synack_type)</span></span>
<span class="line"><span>{......}</span></span></code></pre></div><p>这个时候，轮到客户端接收网络包了。都是TCP协议栈，所以过程和服务端没有太多区别，还是会走到tcp_rcv_state_process函数的，只不过由于客户端目前处于TCP_SYN_SENT状态，就进入了下面的代码分支。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_rcv_state_process(struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	const struct tcphdr *th = tcp_hdr(skb);</span></span>
<span class="line"><span>	struct request_sock *req;</span></span>
<span class="line"><span>	int queued = 0;</span></span>
<span class="line"><span>	bool acceptable;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch (sk-&amp;gt;sk_state) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_SYN_SENT:</span></span>
<span class="line"><span>		tp-&amp;gt;rx_opt.saw_tstamp = 0;</span></span>
<span class="line"><span>		tcp_mstamp_refresh(tp);</span></span>
<span class="line"><span>		queued = tcp_rcv_synsent_state_process(sk, skb, th);</span></span>
<span class="line"><span>		if (queued &amp;gt;= 0)</span></span>
<span class="line"><span>			return queued;</span></span>
<span class="line"><span>		/* Do step6 onward by hand. */</span></span>
<span class="line"><span>		tcp_urg(sk, skb, th);</span></span>
<span class="line"><span>		__kfree_skb(skb);</span></span>
<span class="line"><span>		tcp_data_snd_check(sk);</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>tcp_rcv_synsent_state_process会调用tcp_send_ack，发送一个ACK-ACK，发送后客户端处于TCP_ESTABLISHED状态。</p><p>又轮到服务端接收网络包了，我们还是归tcp_rcv_state_process函数处理。由于服务端目前处于状态TCP_SYN_RECV状态，因而又走了另外的分支。当收到这个网络包的时候，服务端也处于TCP_ESTABLISHED状态，三次握手结束。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_rcv_state_process(struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	const struct tcphdr *th = tcp_hdr(skb);</span></span>
<span class="line"><span>	struct request_sock *req;</span></span>
<span class="line"><span>	int queued = 0;</span></span>
<span class="line"><span>	bool acceptable;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch (sk-&amp;gt;sk_state) {</span></span>
<span class="line"><span>	case TCP_SYN_RECV:</span></span>
<span class="line"><span>		if (req) {</span></span>
<span class="line"><span>			inet_csk(sk)-&amp;gt;icsk_retransmits = 0;</span></span>
<span class="line"><span>			reqsk_fastopen_remove(sk, req, false);</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			/* Make sure socket is routed, for correct metrics. */</span></span>
<span class="line"><span>			icsk-&amp;gt;icsk_af_ops-&amp;gt;rebuild_header(sk);</span></span>
<span class="line"><span>			tcp_call_bpf(sk, BPF_SOCK_OPS_PASSIVE_ESTABLISHED_CB);</span></span>
<span class="line"><span>			tcp_init_congestion_control(sk);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			tcp_mtup_init(sk);</span></span>
<span class="line"><span>			tp-&amp;gt;copied_seq = tp-&amp;gt;rcv_nxt;</span></span>
<span class="line"><span>			tcp_init_buffer_space(sk);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		smp_mb();</span></span>
<span class="line"><span>		tcp_set_state(sk, TCP_ESTABLISHED);</span></span>
<span class="line"><span>		sk-&amp;gt;sk_state_change(sk);</span></span>
<span class="line"><span>		if (sk-&amp;gt;sk_socket)</span></span>
<span class="line"><span>			sk_wake_async(sk, SOCK_WAKE_IO, POLL_OUT);</span></span>
<span class="line"><span>		tp-&amp;gt;snd_una = TCP_SKB_CB(skb)-&amp;gt;ack_seq;</span></span>
<span class="line"><span>		tp-&amp;gt;snd_wnd = ntohs(th-&amp;gt;window) &amp;lt;&amp;lt; tp-&amp;gt;rx_opt.snd_wscale;</span></span>
<span class="line"><span>		tcp_init_wl(tp, TCP_SKB_CB(skb)-&amp;gt;seq);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节除了网络包的接收和发送，其他的系统调用我们都分析到了。可以看出来，它们有一个统一的数据结构和流程。具体如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/105980/c028381cf45d65d3f148e57408d26bd8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/105980/c028381cf45d65d3f148e57408d26bd8.png" alt=""></a></p><p>首先，Socket系统调用会有三级参数family、type、protocal，通过这三级参数，分别在net_proto_family表中找到type链表，在type链表中找到protocal对应的操作。这个操作分为两层，对于TCP协议来讲，第一层是inet_stream_ops层，第二层是tcp_prot层。</p><p>于是，接下来的系统调用规律就都一样了：</p><ul><li>bind第一层调用inet_stream_ops的inet_bind函数，第二层调用tcp_prot的inet_csk_get_port函数；</li><li>listen第一层调用inet_stream_ops的inet_listen函数，第二层调用tcp_prot的inet_csk_get_port函数；</li><li>accept第一层调用inet_stream_ops的inet_accept函数，第二层调用tcp_prot的inet_csk_accept函数；</li><li>connect第一层调用inet_stream_ops的inet_stream_connect函数，第二层调用tcp_prot的tcp_v4_connect函数。</li></ul><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>TCP的三次握手协议非常重要，请你务必跟着代码走读一遍。另外我们这里重点关注了TCP的场景，请走读代码的时候，也看一下UDP是如何实现各层的函数的。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>`,108)])])}const u=n(e,[["render",c]]);export{d as __pageData,u as default};
