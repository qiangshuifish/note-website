import{_ as n,H as a,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"48 | 接收网络包（下）：如何搞明白合作伙伴让我们做什么？","description":"","frontmatter":{},"headers":[{"level":2,"title":"网络协议栈的TCP层","slug":"网络协议栈的tcp层","link":"#网络协议栈的tcp层","children":[]},{"level":2,"title":"Socket层","slug":"socket层","link":"#socket层","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/48-接收网络包（下）：如何搞明白合作伙伴让我们做什么？.md","filePath":"趣谈Linux操作系统/48-接收网络包（下）：如何搞明白合作伙伴让我们做什么？.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/48-接收网络包（下）：如何搞明白合作伙伴让我们做什么？.md"};function l(c,s,i,_,o,r){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_48-接收网络包-下-如何搞明白合作伙伴让我们做什么" tabindex="-1">48 | 接收网络包（下）：如何搞明白合作伙伴让我们做什么？ <a class="header-anchor" href="#_48-接收网络包-下-如何搞明白合作伙伴让我们做什么" aria-label="Permalink to &quot;48 | 接收网络包（下）：如何搞明白合作伙伴让我们做什么？&quot;">​</a></h1><p>上一节，我们解析了网络包接收的上半部分，从硬件网卡到IP层。这一节，我们接着来解析TCP层和Socket层都做了哪些事情。</p><h2 id="网络协议栈的tcp层" tabindex="-1">网络协议栈的TCP层 <a class="header-anchor" href="#网络协议栈的tcp层" aria-label="Permalink to &quot;网络协议栈的TCP层&quot;">​</a></h2><p>从tcp_v4_rcv函数开始，我们的处理逻辑就从IP层到了TCP层。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_v4_rcv(struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net *net = dev_net(skb-&amp;gt;dev);</span></span>
<span class="line"><span>	const struct iphdr *iph;</span></span>
<span class="line"><span>	const struct tcphdr *th;</span></span>
<span class="line"><span>	bool refcounted;</span></span>
<span class="line"><span>	struct sock *sk;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	th = (const struct tcphdr *)skb-&amp;gt;data;</span></span>
<span class="line"><span>	iph = ip_hdr(skb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;seq = ntohl(th-&amp;gt;seq);</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;end_seq = (TCP_SKB_CB(skb)-&amp;gt;seq + th-&amp;gt;syn + th-&amp;gt;fin + skb-&amp;gt;len - th-&amp;gt;doff * 4);</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;ack_seq = ntohl(th-&amp;gt;ack_seq);</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;tcp_flags = tcp_flag_byte(th);</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;tcp_tw_isn = 0;</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;ip_dsfield = ipv4_get_dsfield(iph);</span></span>
<span class="line"><span>	TCP_SKB_CB(skb)-&amp;gt;sacked	 = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>lookup:</span></span>
<span class="line"><span>	sk = __inet_lookup_skb(&amp;tcp_hashinfo, skb, __tcp_hdrlen(th), th-&amp;gt;source, th-&amp;gt;dest, &amp;refcounted);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>process:</span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_state == TCP_TIME_WAIT)</span></span>
<span class="line"><span>		goto do_time_wait;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_state == TCP_NEW_SYN_RECV) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	th = (const struct tcphdr *)skb-&amp;gt;data;</span></span>
<span class="line"><span>	iph = ip_hdr(skb);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	skb-&amp;gt;dev = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_state == TCP_LISTEN) {</span></span>
<span class="line"><span>		ret = tcp_v4_do_rcv(sk, skb);</span></span>
<span class="line"><span>		goto put_and_return;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (!sock_owned_by_user(sk)) {</span></span>
<span class="line"><span>		if (!tcp_prequeue(sk, skb))</span></span>
<span class="line"><span>			ret = tcp_v4_do_rcv(sk, skb);</span></span>
<span class="line"><span>	} else if (tcp_add_backlog(sk, skb)) {</span></span>
<span class="line"><span>		goto discard_and_relse;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_v4_rcv中，得到TCP的头之后，我们可以开始处理TCP层的事情。因为TCP层是分状态的，状态被维护在数据结构struct sock里面，因而我们要根据IP地址以及TCP头里面的内容，在tcp_hashinfo中找到这个包对应的struct sock，从而得到这个包对应的连接的状态。</p><p>接下来，我们就根据不同的状态做不同的处理，例如，上面代码中的TCP_LISTEN、TCP_NEW_SYN_RECV状态属于连接建立过程中。这个我们在讲三次握手的时候讲过了。再如，TCP_TIME_WAIT状态是连接结束的时候的状态，这个我们暂时可以不用看。</p><p>接下来，我们来分析最主流的网络包的接收过程，这里面涉及三个队列：</p><ul><li>backlog队列</li><li>prequeue队列</li><li>sk_receive_queue队列</li></ul><p>为什么接收网络包的过程，需要在这三个队列里面倒腾过来、倒腾过去呢？这是因为，同样一个网络包要在三个主体之间交接。</p><p>第一个主体是 <strong>软中断的处理过程</strong>。如果你没忘记的话，我们在执行tcp_v4_rcv函数的时候，依然处于软中断的处理逻辑里，所以必然会占用这个软中断。</p><p>第二个主体就是 <strong>用户态进程</strong>。如果用户态触发系统调用read读取网络包，也要从队列里面找。</p><p>第三个主体就是 <strong>内核协议栈</strong>。哪怕用户进程没有调用read，读取网络包，当网络包来的时候，也得有一个地方收着呀。</p><p>这时候，我们就能够了解上面代码中sock_owned_by_user的意思了，其实就是说，当前这个sock是不是正有一个用户态进程等着读数据呢，如果没有，内核协议栈也调用tcp_add_backlog，暂存在backlog队列中，并且抓紧离开软中断的处理过程。</p><p>如果有一个用户态进程等待读取数据呢？我们先调用tcp_prequeue，也即赶紧放入prequeue队列，并且离开软中断的处理过程。在这个函数里面，我们会看到对于sysctl_tcp_low_latency的判断，也即是不是要低时延地处理网络包。</p><p>如果把sysctl_tcp_low_latency设置为0，那就要放在prequeue队列中暂存，这样不用等待网络包处理完毕，就可以离开软中断的处理过程，但是会造成比较长的时延。如果把sysctl_tcp_low_latency设置为1，我们还是调用tcp_v4_do_rcv。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_v4_do_rcv(struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sock *rsk;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_state == TCP_ESTABLISHED) { /* Fast path */</span></span>
<span class="line"><span>		struct dst_entry *dst = sk-&amp;gt;sk_rx_dst;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		tcp_rcv_established(sk, skb, tcp_hdr(skb), skb-&amp;gt;len);</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (tcp_rcv_state_process(sk, skb)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_v4_do_rcv中，分两种情况，一种情况是连接已经建立，处于TCP_ESTABLISHED状态，调用tcp_rcv_established。另一种情况，就是其他的状态，调用tcp_rcv_state_process。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_rcv_state_process(struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	struct inet_connection_sock *icsk = inet_csk(sk);</span></span>
<span class="line"><span>	const struct tcphdr *th = tcp_hdr(skb);</span></span>
<span class="line"><span>	struct request_sock *req;</span></span>
<span class="line"><span>	int queued = 0;</span></span>
<span class="line"><span>	bool acceptable;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch (sk-&amp;gt;sk_state) {</span></span>
<span class="line"><span>	case TCP_CLOSE:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_LISTEN:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_SYN_SENT:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch (sk-&amp;gt;sk_state) {</span></span>
<span class="line"><span>	case TCP_SYN_RECV:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_FIN_WAIT1:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_CLOSING:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_LAST_ACK:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* step 7: process the segment text */</span></span>
<span class="line"><span>	switch (sk-&amp;gt;sk_state) {</span></span>
<span class="line"><span>	case TCP_CLOSE_WAIT:</span></span>
<span class="line"><span>	case TCP_CLOSING:</span></span>
<span class="line"><span>	case TCP_LAST_ACK:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_FIN_WAIT1:</span></span>
<span class="line"><span>	case TCP_FIN_WAIT2:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case TCP_ESTABLISHED:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_rcv_state_process中，如果我们对着TCP的状态图进行比对，能看到，对于TCP所有状态的处理，其中和连接建立相关的状态，咱们已经分析过，所以我们重点关注连接状态下的工作模式。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/108227/385ff4a348dfd2f64feb0d7ba81e2bc6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/108227/385ff4a348dfd2f64feb0d7ba81e2bc6.png" alt=""></a></p><p>在连接状态下，我们会调用tcp_rcv_established。在这个函数里面，我们会调用tcp_data_queue，将其放入sk_receive_queue队列进行处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void tcp_data_queue(struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	bool fragstolen = false;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (TCP_SKB_CB(skb)-&amp;gt;seq == tp-&amp;gt;rcv_nxt) {</span></span>
<span class="line"><span>		if (tcp_receive_window(tp) == 0)</span></span>
<span class="line"><span>			goto out_of_window;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		/* Ok. In sequence. In window. */</span></span>
<span class="line"><span>		if (tp-&amp;gt;ucopy.task == current &amp;&amp;</span></span>
<span class="line"><span>		    tp-&amp;gt;copied_seq == tp-&amp;gt;rcv_nxt &amp;&amp; tp-&amp;gt;ucopy.len &amp;&amp;</span></span>
<span class="line"><span>		    sock_owned_by_user(sk) &amp;&amp; !tp-&amp;gt;urg_data) {</span></span>
<span class="line"><span>			int chunk = min_t(unsigned int, skb-&amp;gt;len,</span></span>
<span class="line"><span>					  tp-&amp;gt;ucopy.len);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			__set_current_state(TASK_RUNNING);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (!skb_copy_datagram_msg(skb, 0, tp-&amp;gt;ucopy.msg, chunk)) {</span></span>
<span class="line"><span>				tp-&amp;gt;ucopy.len -= chunk;</span></span>
<span class="line"><span>				tp-&amp;gt;copied_seq += chunk;</span></span>
<span class="line"><span>				eaten = (chunk == skb-&amp;gt;len);</span></span>
<span class="line"><span>				tcp_rcv_space_adjust(sk);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (eaten &amp;lt;= 0) {</span></span>
<span class="line"><span>queue_and_out:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			eaten = tcp_queue_rcv(sk, skb, 0, &amp;fragstolen);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		tcp_rcv_nxt_update(tp, TCP_SKB_CB(skb)-&amp;gt;end_seq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (!RB_EMPTY_ROOT(&amp;tp-&amp;gt;out_of_order_queue)) {</span></span>
<span class="line"><span>			tcp_ofo_queue(sk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		return;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!after(TCP_SKB_CB(skb)-&amp;gt;end_seq, tp-&amp;gt;rcv_nxt)) {</span></span>
<span class="line"><span>		/* A retransmit, 2nd most common case.  Force an immediate ack. */</span></span>
<span class="line"><span>		tcp_dsack_set(sk, TCP_SKB_CB(skb)-&amp;gt;seq, TCP_SKB_CB(skb)-&amp;gt;end_seq);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>out_of_window:</span></span>
<span class="line"><span>		tcp_enter_quickack_mode(sk);</span></span>
<span class="line"><span>		inet_csk_schedule_ack(sk);</span></span>
<span class="line"><span>drop:</span></span>
<span class="line"><span>		tcp_drop(sk, skb);</span></span>
<span class="line"><span>		return;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Out of window. F.e. zero window probe. */</span></span>
<span class="line"><span>	if (!before(TCP_SKB_CB(skb)-&amp;gt;seq, tp-&amp;gt;rcv_nxt + tcp_receive_window(tp)))</span></span>
<span class="line"><span>		goto out_of_window;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tcp_enter_quickack_mode(sk);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (before(TCP_SKB_CB(skb)-&amp;gt;seq, tp-&amp;gt;rcv_nxt)) {</span></span>
<span class="line"><span>		/* Partial packet, seq &amp;lt; rcv_next &amp;lt; end_seq */</span></span>
<span class="line"><span>		tcp_dsack_set(sk, TCP_SKB_CB(skb)-&amp;gt;seq, tp-&amp;gt;rcv_nxt);</span></span>
<span class="line"><span>		/* If window is closed, drop tail of packet. But after</span></span>
<span class="line"><span>		 * remembering D-SACK for its head made in previous line.</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		if (!tcp_receive_window(tp))</span></span>
<span class="line"><span>			goto out_of_window;</span></span>
<span class="line"><span>		goto queue_and_out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tcp_data_queue_ofo(sk, skb);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tcp_data_queue中，对于收到的网络包，我们要分情况进行处理。</p><p>第一种情况，seq == tp-&gt;rcv_nxt，说明来的网络包正是我服务端期望的下一个网络包。这个时候我们判断sock_owned_by_user，也即用户进程也是正在等待读取，这种情况下，就直接skb_copy_datagram_msg，将网络包拷贝给用户进程就可以了。</p><p>如果用户进程没有正在等待读取，或者因为内存原因没有能够拷贝成功，tcp_queue_rcv里面还是将网络包放入sk_receive_queue队列。</p><p>接下来，tcp_rcv_nxt_update将tp-&gt;rcv_nxt设置为end_seq，也即当前的网络包接收成功后，更新下一个期待的网络包。</p><p>这个时候，我们还会判断一下另一个队列，out_of_order_queue，也看看乱序队列的情况，看看乱序队列里面的包，会不会因为这个新的网络包的到来，也能放入到sk_receive_queue队列中。</p><p>例如，客户端发送的网络包序号为5、6、7、8、9。在5还没有到达的时候，服务端的rcv_nxt应该是5，也即期望下一个网络包是5。但是由于中间网络通路的问题，5、6还没到达服务端，7、8已经到达了服务端了，这就出现了乱序。</p><p>乱序的包不能进入sk_receive_queue队列。因为一旦进入到这个队列，意味着可以发送给用户进程。然而，按照TCP的定义，用户进程应该是按顺序收到包的，没有排好序，就不能给用户进程。所以，7、8不能进入sk_receive_queue队列，只能暂时放在out_of_order_queue乱序队列中。</p><p>当5、6到达的时候，5、6先进入sk_receive_queue队列。这个时候我们再来看out_of_order_queue乱序队列中的7、8，发现能够接上。于是，7、8也能进入sk_receive_queue队列了。tcp_ofo_queue函数就是做这个事情的。</p><p>至此第一种情况处理完毕。</p><p>第二种情况，end_seq不大于rcv_nxt，也即服务端期望网络包5。但是，来了一个网络包3，怎样才会出现这种情况呢？肯定是服务端早就收到了网络包3，但是ACK没有到达客户端，中途丢了，那客户端就认为网络包3没有发送成功，于是又发送了一遍，这种情况下，要赶紧给客户端再发送一次ACK，表示早就收到了。</p><p>第三种情况，seq不小于rcv_nxt + tcp_receive_window。这说明客户端发送得太猛了。本来seq肯定应该在接收窗口里面的，这样服务端才来得及处理，结果现在超出了接收窗口，说明客户端一下子把服务端给塞满了。</p><p>这种情况下，服务端不能再接收数据包了，只能发送ACK了，在ACK中会将接收窗口为0的情况告知客户端，客户端就知道不能再发送了。这个时候双方只能交互窗口探测数据包，直到服务端因为用户进程把数据读走了，空出接收窗口，才能在ACK里面再次告诉客户端，又有窗口了，又能发送数据包了。</p><p>第四种情况，seq小于rcv_nxt，但是end_seq大于rcv_nxt，这说明从seq到rcv_nxt这部分网络包原来的ACK客户端没有收到，所以重新发送了一次，从rcv_nxt到end_seq时新发送的，可以放入sk_receive_queue队列。</p><p>当前四种情况都排除掉了，说明网络包一定是一个乱序包了。这里有点儿难理解，我们还是用上面那个乱序的例子仔细分析一下rcv_nxt=5。</p><p>我们假设tcp_receive_window也是5，也即超过10服务端就接收不了了。当前来的这个网络包既不在rcv_nxt之前（不是3这种），也不在rcv_nxt + tcp_receive_window之后（不是11这种），说明这正在我们期望的接收窗口里面，但是又不是rcv_nxt（不是我们马上期望的网络包5），这正是上面的例子中网络包7、8的情况。</p><p>对于网络包7、8，我们只好调用tcp_data_queue_ofo进入out_of_order_queue乱序队列，但是没有关系，当网络包5、6到来的时候，我们会走第一种情况，把7、8拿出来放到sk_receive_queue队列中。</p><p>至此，网络协议栈的处理过程就结束了。</p><h2 id="socket层" tabindex="-1">Socket层 <a class="header-anchor" href="#socket层" aria-label="Permalink to &quot;Socket层&quot;">​</a></h2><p>当接收的网络包进入各种队列之后，接下来我们就要等待用户进程去读取它们了。</p><p>读取一个socket，就像读取一个文件一样，读取socket的文件描述符，通过read系统调用。</p><p>read系统调用对于一个文件描述符的操作，大致过程都是类似的，在文件系统那一节，我们已经详细解析过。最终它会调用到用来表示一个打开文件的结构stuct file指向的file_operations操作。</p><p>对于socket来讲，它的file_operations定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct file_operations socket_file_ops = {</span></span>
<span class="line"><span>	.owner =	THIS_MODULE,</span></span>
<span class="line"><span>	.llseek =	no_llseek,</span></span>
<span class="line"><span>	.read_iter =	sock_read_iter,</span></span>
<span class="line"><span>	.write_iter =	sock_write_iter,</span></span>
<span class="line"><span>	.poll =		sock_poll,</span></span>
<span class="line"><span>	.unlocked_ioctl = sock_ioctl,</span></span>
<span class="line"><span>	.mmap =		sock_mmap,</span></span>
<span class="line"><span>	.release =	sock_close,</span></span>
<span class="line"><span>	.fasync =	sock_fasync,</span></span>
<span class="line"><span>	.sendpage =	sock_sendpage,</span></span>
<span class="line"><span>	.splice_write = generic_splice_sendpage,</span></span>
<span class="line"><span>	.splice_read =	sock_splice_read,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>按照文件系统的读取流程，调用的是sock_read_iter。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ssize_t sock_read_iter(struct kiocb *iocb, struct iov_iter *to)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file = iocb-&amp;gt;ki_filp;</span></span>
<span class="line"><span>	struct socket *sock = file-&amp;gt;private_data;</span></span>
<span class="line"><span>	struct msghdr msg = {.msg_iter = *to,</span></span>
<span class="line"><span>			     .msg_iocb = iocb};</span></span>
<span class="line"><span>	ssize_t res;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (file-&amp;gt;f_flags &amp; O_NONBLOCK)</span></span>
<span class="line"><span>		msg.msg_flags = MSG_DONTWAIT;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	res = sock_recvmsg(sock, &amp;msg, msg.msg_flags);</span></span>
<span class="line"><span>	*to = msg.msg_iter;</span></span>
<span class="line"><span>	return res;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在sock_read_iter中，通过VFS中的struct file，将创建好的socket结构拿出来，然后调用sock_recvmsg，sock_recvmsg会调用sock_recvmsg_nosec。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int sock_recvmsg_nosec(struct socket *sock, struct msghdr *msg, int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return sock-&amp;gt;ops-&amp;gt;recvmsg(sock, msg, msg_data_left(msg), flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里调用了socket的ops的recvmsg，这个我们遇到好几次了。根据inet_stream_ops的定义，这里调用的是inet_recvmsg。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int inet_recvmsg(struct socket *sock, struct msghdr *msg, size_t size,</span></span>
<span class="line"><span>		 int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sock *sk = sock-&amp;gt;sk;</span></span>
<span class="line"><span>	int addr_len = 0;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = sk-&amp;gt;sk_prot-&amp;gt;recvmsg(sk, msg, size, flags &amp; MSG_DONTWAIT,</span></span>
<span class="line"><span>				   flags &amp; ~MSG_DONTWAIT, &amp;addr_len);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面，从socket结构，我们可以得到更底层的sock结构，然后调用sk_prot的recvmsg方法。这个同样遇到好几次了，根据tcp_prot的定义，调用的是tcp_recvmsg。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int tcp_recvmsg(struct sock *sk, struct msghdr *msg, size_t len, int nonblock,</span></span>
<span class="line"><span>		int flags, int *addr_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tcp_sock *tp = tcp_sk(sk);</span></span>
<span class="line"><span>	int copied = 0;</span></span>
<span class="line"><span>	u32 peek_seq;</span></span>
<span class="line"><span>	u32 *seq;</span></span>
<span class="line"><span>	unsigned long used;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	int target;		/* Read at least this many bytes */</span></span>
<span class="line"><span>	long timeo;</span></span>
<span class="line"><span>	struct task_struct *user_recv = NULL;</span></span>
<span class="line"><span>	struct sk_buff *skb, *last;</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		u32 offset;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/* Next get a buffer. */</span></span>
<span class="line"><span>		last = skb_peek_tail(&amp;sk-&amp;gt;sk_receive_queue);</span></span>
<span class="line"><span>		skb_queue_walk(&amp;sk-&amp;gt;sk_receive_queue, skb) {</span></span>
<span class="line"><span>			last = skb;</span></span>
<span class="line"><span>			offset = *seq - TCP_SKB_CB(skb)-&amp;gt;seq;</span></span>
<span class="line"><span>			if (offset &amp;lt; skb-&amp;gt;len)</span></span>
<span class="line"><span>				goto found_ok_skb;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (!sysctl_tcp_low_latency &amp;&amp; tp-&amp;gt;ucopy.task == user_recv) {</span></span>
<span class="line"><span>			/* Install new reader */</span></span>
<span class="line"><span>			if (!user_recv &amp;&amp; !(flags &amp; (MSG_TRUNC | MSG_PEEK))) {</span></span>
<span class="line"><span>				user_recv = current;</span></span>
<span class="line"><span>				tp-&amp;gt;ucopy.task = user_recv;</span></span>
<span class="line"><span>				tp-&amp;gt;ucopy.msg = msg;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			tp-&amp;gt;ucopy.len = len;</span></span>
<span class="line"><span>			/* Look: we have the following (pseudo)queues:</span></span>
<span class="line"><span>			 *</span></span>
<span class="line"><span>			 * 1. packets in flight</span></span>
<span class="line"><span>			 * 2. backlog</span></span>
<span class="line"><span>			 * 3. prequeue</span></span>
<span class="line"><span>			 * 4. receive_queue</span></span>
<span class="line"><span>			 *</span></span>
<span class="line"><span>			 * Each queue can be processed only if the next ones</span></span>
<span class="line"><span>			 * are empty.</span></span>
<span class="line"><span>			 */</span></span>
<span class="line"><span>			if (!skb_queue_empty(&amp;tp-&amp;gt;ucopy.prequeue))</span></span>
<span class="line"><span>				goto do_prequeue;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (copied &amp;gt;= target) {</span></span>
<span class="line"><span>			/* Do not sleep, just process backlog. */</span></span>
<span class="line"><span>			release_sock(sk);</span></span>
<span class="line"><span>			lock_sock(sk);</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			sk_wait_data(sk, &amp;timeo, last);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (user_recv) {</span></span>
<span class="line"><span>			int chunk;</span></span>
<span class="line"><span>			chunk = len - tp-&amp;gt;ucopy.len;</span></span>
<span class="line"><span>			if (chunk != 0) {</span></span>
<span class="line"><span>				len -= chunk;</span></span>
<span class="line"><span>				copied += chunk;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (tp-&amp;gt;rcv_nxt == tp-&amp;gt;copied_seq &amp;&amp;</span></span>
<span class="line"><span>			    !skb_queue_empty(&amp;tp-&amp;gt;ucopy.prequeue)) {</span></span>
<span class="line"><span>do_prequeue:</span></span>
<span class="line"><span>				tcp_prequeue_process(sk);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>				chunk = len - tp-&amp;gt;ucopy.len;</span></span>
<span class="line"><span>				if (chunk != 0) {</span></span>
<span class="line"><span>					len -= chunk;</span></span>
<span class="line"><span>					copied += chunk;</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		continue;</span></span>
<span class="line"><span>	found_ok_skb:</span></span>
<span class="line"><span>		/* Ok so how much can we use? */</span></span>
<span class="line"><span>		used = skb-&amp;gt;len - offset;</span></span>
<span class="line"><span>		if (len &amp;lt; used)</span></span>
<span class="line"><span>			used = len;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (!(flags &amp; MSG_TRUNC)) {</span></span>
<span class="line"><span>			err = skb_copy_datagram_msg(skb, offset, msg, used);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		*seq += used;</span></span>
<span class="line"><span>		copied += used;</span></span>
<span class="line"><span>		len -= used;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		tcp_rcv_space_adjust(sk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	} while (len &amp;gt; 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>tcp_recvmsg这个函数比较长，里面逻辑也很复杂，好在里面有一段注释概括了这里面的逻辑。注释里面提到了三个队列，receive_queue队列、prequeue队列和backlog队列。这里面，我们需要把前一个队列处理完毕，才处理后一个队列。</p><p>tcp_recvmsg的整个逻辑也是这样执行的：这里面有一个while循环，不断地读取网络包。</p><p>这里，我们会先处理sk_receive_queue队列。如果找到了网络包，就跳到found_ok_skb这里。这里会调用skb_copy_datagram_msg，将网络包拷贝到用户进程中，然后直接进入下一层循环。</p><p>直到sk_receive_queue队列处理完毕，我们才到了sysctl_tcp_low_latency判断。如果不需要低时延，则会有prequeue队列。于是，我们能就跳到do_prequeue这里，调用tcp_prequeue_process进行处理。</p><p>如果sysctl_tcp_low_latency设置为1，也即没有prequeue队列，或者prequeue队列为空，则需要处理backlog队列，在release_sock函数中处理。</p><p>release_sock会调用__release_sock，这里面会依次处理队列中的网络包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void release_sock(struct sock *sk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (sk-&amp;gt;sk_backlog.tail)</span></span>
<span class="line"><span>		__release_sock(sk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void __release_sock(struct sock *sk)</span></span>
<span class="line"><span>	__releases(&amp;sk-&amp;gt;sk_lock.slock)</span></span>
<span class="line"><span>	__acquires(&amp;sk-&amp;gt;sk_lock.slock)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sk_buff *skb, *next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	while ((skb = sk-&amp;gt;sk_backlog.head) != NULL) {</span></span>
<span class="line"><span>		sk-&amp;gt;sk_backlog.head = sk-&amp;gt;sk_backlog.tail = NULL;</span></span>
<span class="line"><span>		do {</span></span>
<span class="line"><span>			next = skb-&amp;gt;next;</span></span>
<span class="line"><span>			prefetch(next);</span></span>
<span class="line"><span>			skb-&amp;gt;next = NULL;</span></span>
<span class="line"><span>			sk_backlog_rcv(sk, skb);</span></span>
<span class="line"><span>			cond_resched();</span></span>
<span class="line"><span>			skb = next;</span></span>
<span class="line"><span>		} while (skb != NULL);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，哪里都没有网络包，我们只好调用sk_wait_data，继续等待在哪里，等待网络包的到来。</p><p>至此，网络包的接收过程到此结束。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节我们讲完了接收网络包，我们来从头串一下，整个过程可以分成以下几个层次。</p><ul><li>硬件网卡接收到网络包之后，通过DMA技术，将网络包放入Ring Buffer；</li><li>硬件网卡通过中断通知CPU新的网络包的到来；</li><li>网卡驱动程序会注册中断处理函数ixgb_intr；</li><li>中断处理函数处理完需要暂时屏蔽中断的核心流程之后，通过软中断NET_RX_SOFTIRQ触发接下来的处理过程；</li><li>NET_RX_SOFTIRQ软中断处理函数net_rx_action，net_rx_action会调用napi_poll，进而调用ixgb_clean_rx_irq，从Ring Buffer中读取数据到内核struct sk_buff；</li><li>调用netif_receive_skb进入内核网络协议栈，进行一些关于VLAN的二层逻辑处理后，调用ip_rcv进入三层IP层；</li><li>在IP层，会处理iptables规则，然后调用ip_local_deliver交给更上层TCP层；</li><li>在TCP层调用tcp_v4_rcv，这里面有三个队列需要处理，如果当前的Socket不是正在被读；取，则放入backlog队列，如果正在被读取，不需要很实时的话，则放入prequeue队列，其他情况调用tcp_v4_do_rcv；</li><li>在tcp_v4_do_rcv中，如果是处于TCP_ESTABLISHED状态，调用tcp_rcv_established，其他的状态，调用tcp_rcv_state_process；</li><li>在tcp_rcv_established中，调用tcp_data_queue，如果序列号能够接的上，则放入sk_receive_queue队列；如果序列号接不上，则暂时放入out_of_order_queue队列，等序列号能够接上的时候，再放入sk_receive_queue队列。</li></ul><p>至此内核接收网络包的过程到此结束，接下来就是用户态读取网络包的过程，这个过程分成几个层次。</p><ul><li>VFS层：read系统调用找到struct file，根据里面的file_operations的定义，调用sock_read_iter函数。sock_read_iter函数调用sock_recvmsg函数。</li><li>Socket层：从struct file里面的private_data得到struct socket，根据里面ops的定义，调用inet_recvmsg函数。</li><li>Sock层：从struct socket里面的sk得到struct sock，根据里面sk_prot的定义，调用tcp_recvmsg函数。</li><li>TCP层：tcp_recvmsg函数会依次读取receive_queue队列、prequeue队列和backlog队列。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/108227/20df32a842495d0f629ca5da53e47152.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/108227/20df32a842495d0f629ca5da53e47152.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>对于TCP协议、三次握手、发送和接收的连接维护、拥塞控制、滑动窗口，我们都解析过了。唯独四次挥手我们没有解析，对应的代码你应该知道在什么地方了，你可以自己试着解析一下四次挥手的过程。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/108227/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/108227/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,73)])])}const d=n(e,[["render",l]]);export{k as __pageData,d as default};
