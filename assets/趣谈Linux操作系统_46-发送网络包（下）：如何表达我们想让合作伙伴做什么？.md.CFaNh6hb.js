import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"46 | 发送网络包（下）：如何表达我们想让合作伙伴做什么？","description":"","frontmatter":{},"headers":[{"level":2,"title":"解析ip_queue_xmit函数","slug":"解析ip-queue-xmit函数","link":"#解析ip-queue-xmit函数","children":[]},{"level":2,"title":"解析ip_finish_output函数","slug":"解析ip-finish-output函数","link":"#解析ip-finish-output函数","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/46-发送网络包（下）：如何表达我们想让合作伙伴做什么？.md","filePath":"趣谈Linux操作系统/46-发送网络包（下）：如何表达我们想让合作伙伴做什么？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/46-发送网络包（下）：如何表达我们想让合作伙伴做什么？.md"};function i(l,s,c,_,o,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_46-发送网络包-下-如何表达我们想让合作伙伴做什么" tabindex="-1">46 | 发送网络包（下）：如何表达我们想让合作伙伴做什么？ <a class="header-anchor" href="#_46-发送网络包-下-如何表达我们想让合作伙伴做什么" aria-label="Permalink to &quot;46 | 发送网络包（下）：如何表达我们想让合作伙伴做什么？&quot;">​</a></h1><p>上一节我们讲网络包的发送，讲了上半部分，也即从VFS层一直到IP层，这一节我们接着看下去，看IP层和MAC层是如何发送数据的。</p><h2 id="解析ip-queue-xmit函数" tabindex="-1">解析ip_queue_xmit函数 <a class="header-anchor" href="#解析ip-queue-xmit函数" aria-label="Permalink to &quot;解析ip\\_queue\\_xmit函数&quot;">​</a></h2><p>从ip_queue_xmit函数开始，我们就要进入IP层的发送逻辑了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ip_queue_xmit(struct sock *sk, struct sk_buff *skb, struct flowi *fl)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct inet_sock *inet = inet_sk(sk);</span></span>
<span class="line"><span>    struct net *net = sock_net(sk);</span></span>
<span class="line"><span>    struct ip_options_rcu *inet_opt;</span></span>
<span class="line"><span>    struct flowi4 *fl4;</span></span>
<span class="line"><span>    struct rtable *rt;</span></span>
<span class="line"><span>    struct iphdr *iph;</span></span>
<span class="line"><span>    int res;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    inet_opt = rcu_dereference(inet-&amp;gt;inet_opt);</span></span>
<span class="line"><span>    fl4 = &amp;fl-&amp;gt;u.ip4;</span></span>
<span class="line"><span>    rt = skb_rtable(skb);</span></span>
<span class="line"><span>    /* Make sure we can route this packet. */</span></span>
<span class="line"><span>    rt = (struct rtable *)__sk_dst_check(sk, 0);</span></span>
<span class="line"><span>    if (!rt) {</span></span>
<span class="line"><span>        __be32 daddr;</span></span>
<span class="line"><span>        /* Use correct destination address if we have options. */</span></span>
<span class="line"><span>        daddr = inet-&amp;gt;inet_daddr;</span></span>
<span class="line"><span> ......</span></span>
<span class="line"><span>        rt = ip_route_output_ports(net, fl4, sk,</span></span>
<span class="line"><span>                       daddr, inet-&amp;gt;inet_saddr,</span></span>
<span class="line"><span>                       inet-&amp;gt;inet_dport,</span></span>
<span class="line"><span>                       inet-&amp;gt;inet_sport,</span></span>
<span class="line"><span>                       sk-&amp;gt;sk_protocol,</span></span>
<span class="line"><span>                       RT_CONN_FLAGS(sk),</span></span>
<span class="line"><span>                       sk-&amp;gt;sk_bound_dev_if);</span></span>
<span class="line"><span>        if (IS_ERR(rt))</span></span>
<span class="line"><span>            goto no_route;</span></span>
<span class="line"><span>        sk_setup_caps(sk, &amp;rt-&amp;gt;dst);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    skb_dst_set_noref(skb, &amp;rt-&amp;gt;dst);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>packet_routed:</span></span>
<span class="line"><span>    /* OK, we know where to send it, allocate and build IP header. */</span></span>
<span class="line"><span>    skb_push(skb, sizeof(struct iphdr) + (inet_opt ? inet_opt-&amp;gt;opt.optlen : 0));</span></span>
<span class="line"><span>    skb_reset_network_header(skb);</span></span>
<span class="line"><span>    iph = ip_hdr(skb);</span></span>
<span class="line"><span>    *((__be16 *)iph) = htons((4 &amp;lt;&amp;lt; 12) | (5 &amp;lt;&amp;lt; 8) | (inet-&amp;gt;tos &amp; 0xff));</span></span>
<span class="line"><span>    if (ip_dont_fragment(sk, &amp;rt-&amp;gt;dst) &amp;&amp; !skb-&amp;gt;ignore_df)</span></span>
<span class="line"><span>        iph-&amp;gt;frag_off = htons(IP_DF);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        iph-&amp;gt;frag_off = 0;</span></span>
<span class="line"><span>    iph-&amp;gt;ttl      = ip_select_ttl(inet, &amp;rt-&amp;gt;dst);</span></span>
<span class="line"><span>    iph-&amp;gt;protocol = sk-&amp;gt;sk_protocol;</span></span>
<span class="line"><span>    ip_copy_addrs(iph, fl4);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Transport layer set skb-&amp;gt;h.foo itself. */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (inet_opt &amp;&amp; inet_opt-&amp;gt;opt.optlen) {</span></span>
<span class="line"><span>        iph-&amp;gt;ihl += inet_opt-&amp;gt;opt.optlen &amp;gt;&amp;gt; 2;</span></span>
<span class="line"><span>        ip_options_build(skb, &amp;inet_opt-&amp;gt;opt, inet-&amp;gt;inet_daddr, rt, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ip_select_ident_segs(net, skb, sk,</span></span>
<span class="line"><span>                 skb_shinfo(skb)-&amp;gt;gso_segs ?: 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* TODO : should we use skb-&amp;gt;sk here instead of sk ? */</span></span>
<span class="line"><span>    skb-&amp;gt;priority = sk-&amp;gt;sk_priority;</span></span>
<span class="line"><span>    skb-&amp;gt;mark = sk-&amp;gt;sk_mark;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    res = ip_local_out(net, sk, skb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ip_queue_xmit中，也即IP层的发送函数里面，有三部分逻辑。</p><p>第一部分，选取路由，也即我要发送这个包应该从哪个网卡出去。</p><p>这件事情主要由ip_route_output_ports函数完成。接下来的调用链为：ip_route_output_ports-&gt;ip_route_output_flow-&gt;__ip_route_output_key-&gt;ip_route_output_key_hash-&gt;ip_route_output_key_hash_rcu。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct rtable *ip_route_output_key_hash_rcu(struct net *net, struct flowi4 *fl4, struct fib_result *res, const struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net_device *dev_out = NULL;</span></span>
<span class="line"><span>	int orig_oif = fl4-&amp;gt;flowi4_oif;</span></span>
<span class="line"><span>	unsigned int flags = 0;</span></span>
<span class="line"><span>	struct rtable *rth;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    err = fib_lookup(net, fl4, res, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>make_route:</span></span>
<span class="line"><span>	rth = __mkroute_output(res, fl4, orig_oif, dev_out, flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ip_route_output_key_hash_rcu先会调用fib_lookup。</p><p><strong>FIB</strong> 全称是Forwarding Information Base， <strong>转发信息表。</strong> 其实就是咱们常说的路由表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int fib_lookup(struct net *net, const struct flowi4 *flp, struct fib_result *res, unsigned int flags)</span></span>
<span class="line"><span>{	struct fib_table *tb;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tb = fib_get_table(net, RT_TABLE_MAIN);</span></span>
<span class="line"><span>	if (tb)</span></span>
<span class="line"><span>		err = fib_table_lookup(tb, flp, res, flags | FIB_LOOKUP_NOREF);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>路由表可以有多个，一般会有一个主表，RT_TABLE_MAIN。然后fib_table_lookup函数在这个表里面进行查找。</p><p>路由表是一个什么样的结构呢？</p><p>路由就是在Linux服务器上的路由表里面配置的一条一条规则。这些规则大概是这样的：想访问某个网段，从某个网卡出去，下一跳是某个IP。</p><p>之前我们讲过一个简单的拓扑图，里面的三台Linux机器的路由表都可以通过ip route命令查看。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/f6982eb85dc66bd04200474efb3a050e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/f6982eb85dc66bd04200474efb3a050e.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Linux服务器A</span></span>
<span class="line"><span>default via 192.168.1.1 dev eth0</span></span>
<span class="line"><span>192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Linux服务器B</span></span>
<span class="line"><span>default via 192.168.2.1 dev eth0</span></span>
<span class="line"><span>192.168.2.0/24 dev eth0 proto kernel scope link src 192.168.2.100 metric 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Linux服务器做路由器</span></span>
<span class="line"><span>192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.1</span></span>
<span class="line"><span>192.168.2.0/24 dev eth1 proto kernel scope link src 192.168.2.1</span></span></code></pre></div><p>其实，对于两端的服务器来讲，我们没有太多路由可以选，但是对于中间的Linux服务器做路由器来讲，这里有两条路可以选，一个是往左面转发，一个是往右面转发，就需要路由表的查找。</p><p>fib_table_lookup的代码逻辑比较复杂，好在注释比较清楚。因为路由表要按照前缀进行查询，希望找到最长匹配的那一个，例如192.168.2.0/24和192.168.0.0/16都能匹配192.168.2.100/24。但是，我们应该使用192.168.2.0/24的这一条。</p><p>为了更方面的做这个事情，我们使用了Trie树这种结构。比如我们有一系列的字符串：{bcs#, badge#, baby#, back#, badger#, badness#}。之所以每个字符串都加上#，是希望不要一个字符串成为另外一个字符串的前缀。然后我们把它们放在Trie树中，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/3f0a99cf1c47afcd0bd740c4b7802511.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/3f0a99cf1c47afcd0bd740c4b7802511.png" alt=""></a></p><p>对于将IP地址转成二进制放入trie树，也是同样的道理，可以很快进行路由的查询。</p><p>找到了路由，就知道了应该从哪个网卡发出去。</p><p>然后，ip_route_output_key_hash_rcu会调用__mkroute_output，创建一个struct rtable，表示找到的路由表项。这个结构是由rt_dst_alloc函数分配的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct rtable *rt_dst_alloc(struct net_device *dev,</span></span>
<span class="line"><span>			    unsigned int flags, u16 type,</span></span>
<span class="line"><span>			    bool nopolicy, bool noxfrm, bool will_cache)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct rtable *rt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	rt = dst_alloc(&amp;ipv4_dst_ops, dev, 1, DST_OBSOLETE_FORCE_CHK,</span></span>
<span class="line"><span>		       (will_cache ? 0 : DST_HOST) |</span></span>
<span class="line"><span>		       (nopolicy ? DST_NOPOLICY : 0) |</span></span>
<span class="line"><span>		       (noxfrm ? DST_NOXFRM : 0));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (rt) {</span></span>
<span class="line"><span>		rt-&amp;gt;rt_genid = rt_genid_ipv4(dev_net(dev));</span></span>
<span class="line"><span>		rt-&amp;gt;rt_flags = flags;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_type = type;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_is_input = 0;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_iif = 0;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_pmtu = 0;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_gateway = 0;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_uses_gateway = 0;</span></span>
<span class="line"><span>		rt-&amp;gt;rt_table_id = 0;</span></span>
<span class="line"><span>		INIT_LIST_HEAD(&amp;rt-&amp;gt;rt_uncached);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		rt-&amp;gt;dst.output = ip_output;</span></span>
<span class="line"><span>		if (flags &amp; RTCF_LOCAL)</span></span>
<span class="line"><span>			rt-&amp;gt;dst.input = ip_local_deliver;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return rt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终返回struct rtable实例，第一部分也就完成了。</p><p>第二部分，就是准备IP层的头，往里面填充内容。这就要对着IP层的头的格式进行理解。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/6b2ea7148a8e04138a2228c5dbc7182b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/6b2ea7148a8e04138a2228c5dbc7182b.png" alt=""></a></p><p>在这里面，服务类型设置为tos，标识位里面设置是否允许分片frag_off。如果不允许，而遇到MTU太小过不去的情况，就发送ICMP报错。TTL是这个包的存活时间，为了防止一个IP包迷路以后一直存活下去，每经过一个路由器TTL都减一，减为零则“死去”。设置protocol，指的是更上层的协议，这里是TCP。源地址和目标地址由ip_copy_addrs设置。最后，设置options。</p><p>第三部分，就是调用ip_local_out发送IP包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ip_local_out(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	err = __ip_local_out(net, sk, skb);</span></span>
<span class="line"><span>	if (likely(err == 1))</span></span>
<span class="line"><span>		err = dst_output(net, sk, skb);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int __ip_local_out(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct iphdr *iph = ip_hdr(skb);</span></span>
<span class="line"><span>	iph-&amp;gt;tot_len = htons(skb-&amp;gt;len);</span></span>
<span class="line"><span>	skb-&amp;gt;protocol = htons(ETH_P_IP);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return nf_hook(NFPROTO_IPV4, NF_INET_LOCAL_OUT,</span></span>
<span class="line"><span>		       net, sk, skb, NULL, skb_dst(skb)-&amp;gt;dev,</span></span>
<span class="line"><span>		       dst_output);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ip_local_out先是调用__ip_local_out，然后里面调用了nf_hook。这是什么呢？nf的意思是Netfilter，这是Linux内核的一个机制，用于在网络发送和转发的关键节点上加上hook函数，这些函数可以截获数据包，对数据包进行干预。</p><p>一个著名的实现，就是内核模块ip_tables。在用户态，还有一个客户端程序iptables，用命令行来干预内核的规则。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/75c8257049eed99499e802fcc2eacf4d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/75c8257049eed99499e802fcc2eacf4d.png" alt=""></a></p><p>iptables有表和链的概念，最终要的是两个表。</p><p>filter表处理过滤功能，主要包含以下三个链。</p><ul><li>INPUT链：过滤所有目标地址是本机的数据包</li><li>FORWARD链：过滤所有路过本机的数据包</li><li>OUTPUT链：过滤所有由本机产生的数据包</li></ul><p>nat表主要处理网络地址转换，可以进行SNAT（改变源地址）、DNAT（改变目标地址），包含以下三个链。</p><ul><li>PREROUTING链：可以在数据包到达时改变目标地址</li><li>OUTPUT链：可以改变本地产生的数据包的目标地址</li><li>POSTROUTING链：在数据包离开时改变数据包的源地址</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/765e5431fe4b17f62b1b5712cc82abda.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/765e5431fe4b17f62b1b5712cc82abda.png" alt=""></a></p><p>在这里，网络包马上就要发出去了，因而是NF_INET_LOCAL_OUT，也即ouput链，如果用户曾经在iptables里面写过某些规则，就会在nf_hook这个函数里面起作用。</p><p>ip_local_out再调用dst_output，就是真正的发送数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Output packet to network from transport.  */</span></span>
<span class="line"><span>static inline int dst_output(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return skb_dst(skb)-&amp;gt;output(net, sk, skb);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里调用的就是struct rtable成员dst的ouput函数。在rt_dst_alloc中，我们可以看到，output函数指向的是ip_output。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ip_output(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net_device *dev = skb_dst(skb)-&amp;gt;dev;</span></span>
<span class="line"><span>	skb-&amp;gt;dev = dev;</span></span>
<span class="line"><span>	skb-&amp;gt;protocol = htons(ETH_P_IP);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return NF_HOOK_COND(NFPROTO_IPV4, NF_INET_POST_ROUTING,</span></span>
<span class="line"><span>			    net, sk, skb, NULL, dev,</span></span>
<span class="line"><span>			    ip_finish_output,</span></span>
<span class="line"><span>			    !(IPCB(skb)-&amp;gt;flags &amp; IPSKB_REROUTED));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ip_output里面，我们又看到了熟悉的NF_HOOK。这一次是NF_INET_POST_ROUTING，也即POSTROUTING链，处理完之后，调用ip_finish_output。</p><h2 id="解析ip-finish-output函数" tabindex="-1">解析ip_finish_output函数 <a class="header-anchor" href="#解析ip-finish-output函数" aria-label="Permalink to &quot;解析ip\\_finish\\_output函数&quot;">​</a></h2><p>从ip_finish_output函数开始，发送网络包的逻辑由第三层到达第二层。ip_finish_output最终调用ip_finish_output2。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int ip_finish_output2(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct dst_entry *dst = skb_dst(skb);</span></span>
<span class="line"><span>	struct rtable *rt = (struct rtable *)dst;</span></span>
<span class="line"><span>	struct net_device *dev = dst-&amp;gt;dev;</span></span>
<span class="line"><span>	unsigned int hh_len = LL_RESERVED_SPACE(dev);</span></span>
<span class="line"><span>	struct neighbour *neigh;</span></span>
<span class="line"><span>	u32 nexthop;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	nexthop = (__force u32) rt_nexthop(rt, ip_hdr(skb)-&amp;gt;daddr);</span></span>
<span class="line"><span>	neigh = __ipv4_neigh_lookup_noref(dev, nexthop);</span></span>
<span class="line"><span>	if (unlikely(!neigh))</span></span>
<span class="line"><span>		neigh = __neigh_create(&amp;arp_tbl, &amp;nexthop, dev, false);</span></span>
<span class="line"><span>	if (!IS_ERR(neigh)) {</span></span>
<span class="line"><span>		int res;</span></span>
<span class="line"><span>		sock_confirm_neigh(skb, neigh);</span></span>
<span class="line"><span>		res = neigh_output(neigh, skb);</span></span>
<span class="line"><span>		return res;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ip_finish_output2中，先找到struct rtable路由表里面的下一跳，下一跳一定和本机在同一个局域网中，可以通过二层进行通信，因而通过__ipv4_neigh_lookup_noref，查找如何通过二层访问下一跳。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct neighbour *__ipv4_neigh_lookup_noref(struct net_device *dev, u32 key)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return ___neigh_lookup_noref(&amp;arp_tbl, neigh_key_eq32, arp_hashfn, &amp;key, dev);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__ipv4_neigh_lookup_noref是从本地的ARP表中查找下一跳的MAC地址。ARP表的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct neigh_table arp_tbl = {</span></span>
<span class="line"><span>    .family     = AF_INET,</span></span>
<span class="line"><span>    .key_len    = 4,</span></span>
<span class="line"><span>    .protocol   = cpu_to_be16(ETH_P_IP),</span></span>
<span class="line"><span>    .hash       = arp_hash,</span></span>
<span class="line"><span>    .key_eq     = arp_key_eq,</span></span>
<span class="line"><span>    .constructor    = arp_constructor,</span></span>
<span class="line"><span>    .proxy_redo = parp_redo,</span></span>
<span class="line"><span>    .id     = &quot;arp_cache&quot;,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    .gc_interval    = 30 * HZ,</span></span>
<span class="line"><span>    .gc_thresh1 = 128,</span></span>
<span class="line"><span>    .gc_thresh2 = 512,</span></span>
<span class="line"><span>    .gc_thresh3 = 1024,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>如果在ARP表中没有找到相应的项，则调用__neigh_create进行创建。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct neighbour *__neigh_create(struct neigh_table *tbl, const void *pkey, struct net_device *dev, bool want_ref)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u32 hash_val;</span></span>
<span class="line"><span>    int key_len = tbl-&amp;gt;key_len;</span></span>
<span class="line"><span>    int error;</span></span>
<span class="line"><span>    struct neighbour *n1, *rc, *n = neigh_alloc(tbl, dev);</span></span>
<span class="line"><span>    struct neigh_hash_table *nht;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    memcpy(n-&amp;gt;primary_key, pkey, key_len);</span></span>
<span class="line"><span>    n-&amp;gt;dev = dev;</span></span>
<span class="line"><span>    dev_hold(dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Protocol specific setup. */</span></span>
<span class="line"><span>    if (tbl-&amp;gt;constructor &amp;&amp; (error = tbl-&amp;gt;constructor(n)) &amp;lt; 0) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (atomic_read(&amp;tbl-&amp;gt;entries) &amp;gt; (1 &amp;lt;&amp;lt; nht-&amp;gt;hash_shift))</span></span>
<span class="line"><span>        nht = neigh_hash_grow(tbl, nht-&amp;gt;hash_shift + 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    hash_val = tbl-&amp;gt;hash(pkey, dev, nht-&amp;gt;hash_rnd) &amp;gt;&amp;gt; (32 - nht-&amp;gt;hash_shift);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (n1 = rcu_dereference_protected(nht-&amp;gt;hash_buckets[hash_val],</span></span>
<span class="line"><span>                        lockdep_is_held(&amp;tbl-&amp;gt;lock));</span></span>
<span class="line"><span>         n1 != NULL;</span></span>
<span class="line"><span>         n1 = rcu_dereference_protected(n1-&amp;gt;next,</span></span>
<span class="line"><span>            lockdep_is_held(&amp;tbl-&amp;gt;lock))) {</span></span>
<span class="line"><span>        if (dev == n1-&amp;gt;dev &amp;&amp; !memcmp(n1-&amp;gt;primary_key, pkey, key_len)) {</span></span>
<span class="line"><span>            if (want_ref)</span></span>
<span class="line"><span>                neigh_hold(n1);</span></span>
<span class="line"><span>            rc = n1;</span></span>
<span class="line"><span>            goto out_tbl_unlock;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    rcu_assign_pointer(n-&amp;gt;next,</span></span>
<span class="line"><span>               rcu_dereference_protected(nht-&amp;gt;hash_buckets[hash_val],</span></span>
<span class="line"><span>                             lockdep_is_held(&amp;tbl-&amp;gt;lock)));</span></span>
<span class="line"><span>    rcu_assign_pointer(nht-&amp;gt;hash_buckets[hash_val], n);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__neigh_create先调用neigh_alloc，创建一个struct neighbour结构，用于维护MAC地址和ARP相关的信息。这个名字也很好理解，大家都是在一个局域网里面，可以通过MAC地址访问到，当然是邻居了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct neighbour *neigh_alloc(struct neigh_table *tbl, struct net_device *dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct neighbour *n = NULL;</span></span>
<span class="line"><span>	unsigned long now = jiffies;</span></span>
<span class="line"><span>	int entries;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	n = kzalloc(tbl-&amp;gt;entry_size + dev-&amp;gt;neigh_priv_len, GFP_ATOMIC);</span></span>
<span class="line"><span>	if (!n)</span></span>
<span class="line"><span>		goto out_entries;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	__skb_queue_head_init(&amp;n-&amp;gt;arp_queue);</span></span>
<span class="line"><span>	rwlock_init(&amp;n-&amp;gt;lock);</span></span>
<span class="line"><span>	seqlock_init(&amp;n-&amp;gt;ha_lock);</span></span>
<span class="line"><span>	n-&amp;gt;updated	  = n-&amp;gt;used = now;</span></span>
<span class="line"><span>	n-&amp;gt;nud_state	  = NUD_NONE;</span></span>
<span class="line"><span>	n-&amp;gt;output	  = neigh_blackhole;</span></span>
<span class="line"><span>	seqlock_init(&amp;n-&amp;gt;hh.hh_lock);</span></span>
<span class="line"><span>	n-&amp;gt;parms	  = neigh_parms_clone(&amp;tbl-&amp;gt;parms);</span></span>
<span class="line"><span>	setup_timer(&amp;n-&amp;gt;timer, neigh_timer_handler, (unsigned long)n);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	NEIGH_CACHE_STAT_INC(tbl, allocs);</span></span>
<span class="line"><span>	n-&amp;gt;tbl		  = tbl;</span></span>
<span class="line"><span>	refcount_set(&amp;n-&amp;gt;refcnt, 1);</span></span>
<span class="line"><span>	n-&amp;gt;dead		  = 1;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在neigh_alloc中，我们先分配一个struct neighbour结构并且初始化。这里面比较重要的有两个成员，一个是arp_queue，所以上层想通过ARP获取MAC地址的任务，都放在这个队列里面。另一个是timer定时器，我们设置成，过一段时间就调用neigh_timer_handler，来处理这些ARP任务。</p><p>__neigh_create然后调用了arp_tbl的constructor函数，也即调用了arp_constructor，在这里面定义了ARP的操作arp_hh_ops。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int arp_constructor(struct neighbour *neigh)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	__be32 addr = *(__be32 *)neigh-&amp;gt;primary_key;</span></span>
<span class="line"><span>	struct net_device *dev = neigh-&amp;gt;dev;</span></span>
<span class="line"><span>	struct in_device *in_dev;</span></span>
<span class="line"><span>	struct neigh_parms *parms;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	neigh-&amp;gt;type = inet_addr_type_dev_table(dev_net(dev), dev, addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	parms = in_dev-&amp;gt;arp_parms;</span></span>
<span class="line"><span>	__neigh_parms_put(neigh-&amp;gt;parms);</span></span>
<span class="line"><span>	neigh-&amp;gt;parms = neigh_parms_clone(parms);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	neigh-&amp;gt;ops = &amp;arp_hh_ops;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	neigh-&amp;gt;output = neigh-&amp;gt;ops-&amp;gt;output;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct neigh_ops arp_hh_ops = {</span></span>
<span class="line"><span>	.family =		AF_INET,</span></span>
<span class="line"><span>	.solicit =		arp_solicit,</span></span>
<span class="line"><span>	.error_report =		arp_error_report,</span></span>
<span class="line"><span>	.output =		neigh_resolve_output,</span></span>
<span class="line"><span>	.connected_output =	neigh_resolve_output,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>__neigh_create最后是将创建的struct neighbour结构放入一个哈希表，从里面的代码逻辑比较容易看出，这是一个数组加链表的链式哈希表，先计算出哈希值hash_val，得到相应的链表，然后循环这个链表找到对应的项，如果找不到就在最后插入一项。</p><p>我们回到ip_finish_output2，在__neigh_create之后，会调用neigh_output发送网络包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int neigh_output(struct neighbour *n, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return n-&amp;gt;output(n, skb);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照上面对于struct neighbour的操作函数arp_hh_ops 的定义，output调用的是neigh_resolve_output。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int neigh_resolve_output(struct neighbour *neigh, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (!neigh_event_send(neigh, skb)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		rc = dev_queue_xmit(skb);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在neigh_resolve_output里面，首先neigh_event_send触发一个事件，看能否激活ARP。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __neigh_event_send(struct neighbour *neigh, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int rc;</span></span>
<span class="line"><span>	bool immediate_probe = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!(neigh-&amp;gt;nud_state &amp; (NUD_STALE | NUD_INCOMPLETE))) {</span></span>
<span class="line"><span>		if (NEIGH_VAR(neigh-&amp;gt;parms, MCAST_PROBES) +</span></span>
<span class="line"><span>		    NEIGH_VAR(neigh-&amp;gt;parms, APP_PROBES)) {</span></span>
<span class="line"><span>			unsigned long next, now = jiffies;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			atomic_set(&amp;neigh-&amp;gt;probes,</span></span>
<span class="line"><span>				   NEIGH_VAR(neigh-&amp;gt;parms, UCAST_PROBES));</span></span>
<span class="line"><span>			neigh-&amp;gt;nud_state     = NUD_INCOMPLETE;</span></span>
<span class="line"><span>			neigh-&amp;gt;updated = now;</span></span>
<span class="line"><span>			next = now + max(NEIGH_VAR(neigh-&amp;gt;parms, RETRANS_TIME),</span></span>
<span class="line"><span>					 HZ/2);</span></span>
<span class="line"><span>			neigh_add_timer(neigh, next);</span></span>
<span class="line"><span>			immediate_probe = true;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	} else if (neigh-&amp;gt;nud_state &amp; NUD_STALE) {</span></span>
<span class="line"><span>		neigh_dbg(2, &quot;neigh %p is delayed\\n&quot;, neigh);</span></span>
<span class="line"><span>		neigh-&amp;gt;nud_state = NUD_DELAY;</span></span>
<span class="line"><span>		neigh-&amp;gt;updated = jiffies;</span></span>
<span class="line"><span>		neigh_add_timer(neigh, jiffies +</span></span>
<span class="line"><span>				NEIGH_VAR(neigh-&amp;gt;parms, DELAY_PROBE_TIME));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (neigh-&amp;gt;nud_state == NUD_INCOMPLETE) {</span></span>
<span class="line"><span>		if (skb) {</span></span>
<span class="line"><span>.......</span></span>
<span class="line"><span>			__skb_queue_tail(&amp;neigh-&amp;gt;arp_queue, skb);</span></span>
<span class="line"><span>			neigh-&amp;gt;arp_queue_len_Bytes += skb-&amp;gt;truesize;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		rc = 1;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>out_unlock_bh:</span></span>
<span class="line"><span>	if (immediate_probe)</span></span>
<span class="line"><span>		neigh_probe(neigh);</span></span>
<span class="line"><span>.......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在__neigh_event_send中，激活ARP分两种情况，第一种情况是马上激活，也即immediate_probe。另一种情况是延迟激活则仅仅设置一个timer。然后将ARP包放在arp_queue上。如果马上激活，就直接调用neigh_probe；如果延迟激活，则定时器到了就会触发neigh_timer_handler，在这里面还是会调用neigh_probe。</p><p>我们就来看neigh_probe的实现，在这里面会从arp_queue中拿出ARP包来，然后调用struct neighbour的solicit操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void neigh_probe(struct neighbour *neigh)</span></span>
<span class="line"><span>        __releases(neigh-&amp;gt;lock)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        struct sk_buff *skb = skb_peek_tail(&amp;neigh-&amp;gt;arp_queue);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        if (neigh-&amp;gt;ops-&amp;gt;solicit)</span></span>
<span class="line"><span>                neigh-&amp;gt;ops-&amp;gt;solicit(neigh, skb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照上面对于struct neighbour的操作函数arp_hh_ops 的定义，solicit调用的是arp_solicit，在这里我们可以找到对于arp_send_dst的调用，创建并发送一个arp包，得到结果放在struct dst_entry里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void arp_send_dst(int type, int ptype, __be32 dest_ip,</span></span>
<span class="line"><span>                         struct net_device *dev, __be32 src_ip,</span></span>
<span class="line"><span>                         const unsigned char *dest_hw,</span></span>
<span class="line"><span>                         const unsigned char *src_hw,</span></span>
<span class="line"><span>                         const unsigned char *target_hw,</span></span>
<span class="line"><span>                         struct dst_entry *dst)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        struct sk_buff *skb;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        skb = arp_create(type, ptype, dest_ip, dev, src_ip,</span></span>
<span class="line"><span>                         dest_hw, src_hw, target_hw);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        skb_dst_set(skb, dst_clone(dst));</span></span>
<span class="line"><span>        arp_xmit(skb);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们回到neigh_resolve_output中，当ARP发送完毕，就可以调用dev_queue_xmit发送二层网络包了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> *	__dev_queue_xmit - transmit a buffer</span></span>
<span class="line"><span> *	&amp;#64;skb: buffer to transmit</span></span>
<span class="line"><span> *	&amp;#64;accel_priv: private data used for L2 forwarding offload</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> *	Queue a buffer for transmission to a network device.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static int __dev_queue_xmit(struct sk_buff *skb, void *accel_priv)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net_device *dev = skb-&amp;gt;dev;</span></span>
<span class="line"><span>	struct netdev_queue *txq;</span></span>
<span class="line"><span>	struct Qdisc *q;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	txq = netdev_pick_tx(dev, skb, accel_priv);</span></span>
<span class="line"><span>	q = rcu_dereference_bh(txq-&amp;gt;qdisc);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (q-&amp;gt;enqueue) {</span></span>
<span class="line"><span>		rc = __dev_xmit_skb(skb, q, dev, txq);</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>就像咱们在讲述硬盘块设备的时候讲过，每个块设备都有队列，用于将内核的数据放到队列里面，然后设备驱动从队列里面取出后，将数据根据具体设备的特性发送给设备。</p><p>网络设备也是类似的，对于发送来说，有一个发送队列struct netdev_queue *txq。</p><p>这里还有另一个变量叫做struct Qdisc，这个是什么呢？如果我们在一台Linux机器上运行ip addr，我们能看到对于一个网卡，都有下面的输出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ip addr</span></span>
<span class="line"><span>1: lo: &amp;lt;LOOPBACK,UP,LOWER_UP&amp;gt; mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000</span></span>
<span class="line"><span>    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00</span></span>
<span class="line"><span>    inet 127.0.0.1/8 scope host lo</span></span>
<span class="line"><span>       valid_lft forever preferred_lft forever</span></span>
<span class="line"><span>    inet6 ::1/128 scope host</span></span>
<span class="line"><span>       valid_lft forever preferred_lft forever</span></span>
<span class="line"><span>2: eth0: &amp;lt;BROADCAST,MULTICAST,UP,LOWER_UP&amp;gt; mtu 1400 qdisc pfifo_fast state UP group default qlen 1000</span></span>
<span class="line"><span>    link/ether fa:16:3e:75:99:08 brd ff:ff:ff:ff:ff:ff</span></span>
<span class="line"><span>    inet 10.173.32.47/21 brd 10.173.39.255 scope global noprefixroute dynamic eth0</span></span>
<span class="line"><span>       valid_lft 67104sec preferred_lft 67104sec</span></span>
<span class="line"><span>    inet6 fe80::f816:3eff:fe75:9908/64 scope link</span></span>
<span class="line"><span>       valid_lft forever preferred_lft forever</span></span></code></pre></div><p>这里面有个关键字qdisc pfifo_fast是什么意思呢？qdisc全称是queueing discipline，中文叫排队规则。内核如果需要通过某个网络接口发送数据包，都需要按照为这个接口配置的qdisc（排队规则）把数据包加入队列。</p><p>最简单的qdisc是pfifo，它不对进入的数据包做任何的处理，数据包采用先入先出的方式通过队列。pfifo_fast稍微复杂一些，它的队列包括三个波段（band）。在每个波段里面，使用先进先出规则。</p><p>三个波段的优先级也不相同。band 0的优先级最高，band 2的最低。如果band 0里面有数据包，系统就不会处理band 1里面的数据包，band 1和band 2之间也是一样。</p><p>数据包是按照服务类型（Type of Service，TOS）被分配到三个波段里面的。TOS是IP头里面的一个字段，代表了当前的包是高优先级的，还是低优先级的。</p><p>pfifo_fast分为三个先入先出的队列，我们能称为三个Band。根据网络包里面的TOS，看这个包到底应该进入哪个队列。TOS总共四位，每一位表示的意思不同，总共十六种类型。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/ab6af2f9e1a64868636080a05cfde0d9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/ab6af2f9e1a64868636080a05cfde0d9.png" alt=""></a></p><p>通过命令行tc qdisc show dev eth0，我们可以输出结果priomap，也是十六个数字。在0到2之间，和TOS的十六种类型对应起来。不同的TOS对应不同的队列。其中Band 0优先级最高，发送完毕后才轮到Band 1发送，最后才是Band 2。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># tc qdisc show dev eth0</span></span>
<span class="line"><span>qdisc pfifo_fast 0: root refcnt 2 bands 3 priomap  1 2 2 2 1 2 0 0 1 1 1 1 1 1 1 1</span></span></code></pre></div><p>接下来，__dev_xmit_skb开始进行网络包发送。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int __dev_xmit_skb(struct sk_buff *skb, struct Qdisc *q,</span></span>
<span class="line"><span>                 struct net_device *dev,</span></span>
<span class="line"><span>                 struct netdev_queue *txq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    rc = q-&amp;gt;enqueue(skb, q, &amp;to_free) &amp; NET_XMIT_MASK;</span></span>
<span class="line"><span>    if (qdisc_run_begin(q)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        __qdisc_run(q);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void __qdisc_run(struct Qdisc *q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int quota = dev_tx_weight;</span></span>
<span class="line"><span>    int packets;</span></span>
<span class="line"><span>     while (qdisc_restart(q, &amp;packets)) {</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>         * Ordered by possible occurrence: Postpone processing if</span></span>
<span class="line"><span>         * 1. we&#39;ve exceeded packet quota</span></span>
<span class="line"><span>         * 2. another process needs the CPU;</span></span>
<span class="line"><span>         */</span></span>
<span class="line"><span>        quota -= packets;</span></span>
<span class="line"><span>        if (quota &amp;lt;= 0 || need_resched()) {</span></span>
<span class="line"><span>            __netif_schedule(q);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     qdisc_run_end(q);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__dev_xmit_skb会将请求放入队列，然后调用__qdisc_run处理队列中的数据。qdisc_restart用于数据的发送。根据注释中的说法，qdisc的另一个功能是用于控制网络包的发送速度，因而如果超过速度，就需要重新调度，则会调用__netif_schedule。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void __netif_reschedule(struct Qdisc *q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct softnet_data *sd;</span></span>
<span class="line"><span>    unsigned long flags;</span></span>
<span class="line"><span>    local_irq_save(flags);</span></span>
<span class="line"><span>    sd = this_cpu_ptr(&amp;softnet_data);</span></span>
<span class="line"><span>    q-&amp;gt;next_sched = NULL;</span></span>
<span class="line"><span>    *sd-&amp;gt;output_queue_tailp = q;</span></span>
<span class="line"><span>    sd-&amp;gt;output_queue_tailp = &amp;q-&amp;gt;next_sched;</span></span>
<span class="line"><span>    raise_softirq_irqoff(NET_TX_SOFTIRQ);</span></span>
<span class="line"><span>    local_irq_restore(flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__netif_schedule会调用__netif_reschedule，发起一个软中断NET_TX_SOFTIRQ。咱们讲设备驱动程序的时候讲过，设备驱动程序处理中断，分两个过程，一个是屏蔽中断的关键处理逻辑，一个是延迟处理逻辑。当时说工作队列是延迟处理逻辑的处理方案，软中断也是一种方案。</p><p>在系统初始化的时候，我们会定义软中断的处理函数。例如，NET_TX_SOFTIRQ的处理函数是net_tx_action，用于发送网络包。还有一个NET_RX_SOFTIRQ的处理函数是net_rx_action，用于接收网络包。接收网络包的过程咱们下一节解析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>open_softirq(NET_TX_SOFTIRQ, net_tx_action);</span></span>
<span class="line"><span>open_softirq(NET_RX_SOFTIRQ, net_rx_action);</span></span></code></pre></div><p>这里我们来解析一下net_tx_action。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __latent_entropy void net_tx_action(struct softirq_action *h)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct softnet_data *sd = this_cpu_ptr(&amp;softnet_data);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (sd-&amp;gt;output_queue) {</span></span>
<span class="line"><span>        struct Qdisc *head;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        local_irq_disable();</span></span>
<span class="line"><span>        head = sd-&amp;gt;output_queue;</span></span>
<span class="line"><span>        sd-&amp;gt;output_queue = NULL;</span></span>
<span class="line"><span>        sd-&amp;gt;output_queue_tailp = &amp;sd-&amp;gt;output_queue;</span></span>
<span class="line"><span>        local_irq_enable();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (head) {</span></span>
<span class="line"><span>            struct Qdisc *q = head;</span></span>
<span class="line"><span>            spinlock_t *root_lock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            head = head-&amp;gt;next_sched;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>            qdisc_run(q);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们会发现，net_tx_action还是调用了qdisc_run，还是会调用__qdisc_run，然后调用qdisc_restart发送网络包。</p><p>我们来看一下qdisc_restart的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int qdisc_restart(struct Qdisc *q, int *packets)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        struct netdev_queue *txq;</span></span>
<span class="line"><span>        struct net_device *dev;</span></span>
<span class="line"><span>        spinlock_t *root_lock;</span></span>
<span class="line"><span>        struct sk_buff *skb;</span></span>
<span class="line"><span>        bool validate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* Dequeue packet */</span></span>
<span class="line"><span>        skb = dequeue_skb(q, &amp;validate, packets);</span></span>
<span class="line"><span>        if (unlikely(!skb))</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        root_lock = qdisc_lock(q);</span></span>
<span class="line"><span>        dev = qdisc_dev(q);</span></span>
<span class="line"><span>        txq = skb_get_tx_queue(dev, skb);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return sch_direct_xmit(skb, q, dev, txq, root_lock, validate);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>qdisc_restart将网络包从Qdisc的队列中拿下来，然后调用sch_direct_xmit进行发送。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int sch_direct_xmit(struct sk_buff *skb, struct Qdisc *q,</span></span>
<span class="line"><span>            struct net_device *dev, struct netdev_queue *txq,</span></span>
<span class="line"><span>            spinlock_t *root_lock, bool validate)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int ret = NETDEV_TX_BUSY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (likely(skb)) {</span></span>
<span class="line"><span>        if (!netif_xmit_frozen_or_stopped(txq))</span></span>
<span class="line"><span>            skb = dev_hard_start_xmit(skb, dev, txq, &amp;ret);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (dev_xmit_complete(ret)) {</span></span>
<span class="line"><span>        /* Driver sent out skb successfully or skb was consumed */</span></span>
<span class="line"><span>        ret = qdisc_qlen(q);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        /* Driver returned NETDEV_TX_BUSY - requeue skb */</span></span>
<span class="line"><span>        ret = dev_requeue_skb(skb, q);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在sch_direct_xmit中，调用dev_hard_start_xmit进行发送，如果发送不成功，会返回NETDEV_TX_BUSY。这说明网络卡很忙，于是就调用dev_requeue_skb，重新放入队列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sk_buff *dev_hard_start_xmit(struct sk_buff *first, struct net_device *dev, struct netdev_queue *txq, int *ret)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct sk_buff *skb = first;</span></span>
<span class="line"><span>    int rc = NETDEV_TX_OK;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (skb) {</span></span>
<span class="line"><span>        struct sk_buff *next = skb-&amp;gt;next;</span></span>
<span class="line"><span>        rc = xmit_one(skb, dev, txq, next != NULL);</span></span>
<span class="line"><span>        skb = next;</span></span>
<span class="line"><span>        if (netif_xmit_stopped(txq) &amp;&amp; skb) {</span></span>
<span class="line"><span>            rc = NETDEV_TX_BUSY;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在dev_hard_start_xmit中，是一个while循环。每次在队列中取出一个sk_buff，调用xmit_one发送。</p><p>接下来的调用链为：xmit_one-&gt;netdev_start_xmit-&gt;__netdev_start_xmit。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline netdev_tx_t __netdev_start_xmit(const struct net_device_ops *ops, struct sk_buff *skb, struct net_device *dev, bool more)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    skb-&amp;gt;xmit_more = more ? 1 : 0;</span></span>
<span class="line"><span>    return ops-&amp;gt;ndo_start_xmit(skb, dev);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个时候，已经到了设备驱动层了。我们能看到，drivers/net/ethernet/intel/ixgb/ixgb_main.c里面有对于这个网卡的操作的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct net_device_ops ixgb_netdev_ops = {</span></span>
<span class="line"><span>        .ndo_open               = ixgb_open,</span></span>
<span class="line"><span>        .ndo_stop               = ixgb_close,</span></span>
<span class="line"><span>        .ndo_start_xmit         = ixgb_xmit_frame,</span></span>
<span class="line"><span>        .ndo_set_rx_mode        = ixgb_set_multi,</span></span>
<span class="line"><span>        .ndo_validate_addr      = eth_validate_addr,</span></span>
<span class="line"><span>        .ndo_set_mac_address    = ixgb_set_mac,</span></span>
<span class="line"><span>        .ndo_change_mtu         = ixgb_change_mtu,</span></span>
<span class="line"><span>        .ndo_tx_timeout         = ixgb_tx_timeout,</span></span>
<span class="line"><span>        .ndo_vlan_rx_add_vid    = ixgb_vlan_rx_add_vid,</span></span>
<span class="line"><span>        .ndo_vlan_rx_kill_vid   = ixgb_vlan_rx_kill_vid,</span></span>
<span class="line"><span>        .ndo_fix_features       = ixgb_fix_features,</span></span>
<span class="line"><span>        .ndo_set_features       = ixgb_set_features,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在这里面，我们可以找到对于ndo_start_xmit的定义，调用ixgb_xmit_frame。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static netdev_tx_t</span></span>
<span class="line"><span>ixgb_xmit_frame(struct sk_buff *skb, struct net_device *netdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct ixgb_adapter *adapter = netdev_priv(netdev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (count) {</span></span>
<span class="line"><span>        ixgb_tx_queue(adapter, count, vlan_id, tx_flags);</span></span>
<span class="line"><span>        /* Make sure there is space in the ring for the next send. */</span></span>
<span class="line"><span>        ixgb_maybe_stop_tx(netdev, &amp;adapter-&amp;gt;tx_ring, DESC_NEEDED);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return NETDEV_TX_OK;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ixgb_xmit_frame中，我们会得到这个网卡对应的适配器，然后将其放入硬件网卡的队列中。</p><p>至此，整个发送才算结束。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节，我们继续解析了发送一个网络包的过程，我们整个过程的图画在了下面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/79cc42f3163d159a66e163c006d9f36f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/79cc42f3163d159a66e163c006d9f36f.png" alt=""></a></p><p>这个过程分成几个层次。</p><ul><li>VFS层：write系统调用找到struct file，根据里面的file_operations的定义，调用sock_write_iter函数。sock_write_iter函数调用sock_sendmsg函数。</li><li>Socket层：从struct file里面的private_data得到struct socket，根据里面ops的定义，调用inet_sendmsg函数。</li><li>Sock层：从struct socket里面的sk得到struct sock，根据里面sk_prot的定义，调用tcp_sendmsg函数。</li><li>TCP层：tcp_sendmsg函数会调用tcp_write_xmit函数，tcp_write_xmit函数会调用tcp_transmit_skb，在这里实现了TCP层面向连接的逻辑。</li><li>IP层：扩展struct sock，得到struct inet_connection_sock，根据里面icsk_af_ops的定义，调用ip_queue_xmit函数。</li><li>IP层：ip_route_output_ports函数里面会调用fib_lookup查找路由表。FIB全称是Forwarding Information Base，转发信息表，也就是路由表。</li><li>在IP层里面要做的另一个事情是填写IP层的头。</li><li>在IP层还要做的一件事情就是通过iptables规则。</li><li>MAC层：IP层调用ip_finish_output进行MAC层。</li><li>MAC层需要ARP获得MAC地址，因而要调用___neigh_lookup_noref查找属于同一个网段的邻居，他会调用neigh_probe发送ARP。</li><li>有了MAC地址，就可以调用dev_queue_xmit发送二层网络包了，它会调用__dev_xmit_skb会将请求放入队列。</li><li>设备层：网络包的发送会触发一个软中断NET_TX_SOFTIRQ来处理队列中的数据。这个软中断的处理函数是net_tx_action。</li><li>在软中断处理函数中，会将网络包从队列上拿下来，调用网络设备的传输函数ixgb_xmit_frame，将网络包发到设备的队列上去。</li></ul><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>上一节你应该通过tcpdump看到了TCP包头的格式，这一节，请你查看一下IP包的格式以及ARP的过程。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107209/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,121)])])}const h=n(t,[["render",i]]);export{d as __pageData,h as default};
