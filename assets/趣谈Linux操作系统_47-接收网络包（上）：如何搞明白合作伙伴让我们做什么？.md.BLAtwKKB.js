import{_ as n,H as a,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"47 | 接收网络包（上）：如何搞明白合作伙伴让我们做什么？","description":"","frontmatter":{},"headers":[{"level":2,"title":"设备驱动层","slug":"设备驱动层","link":"#设备驱动层","children":[]},{"level":2,"title":"网络协议栈的二层逻辑","slug":"网络协议栈的二层逻辑","link":"#网络协议栈的二层逻辑","children":[]},{"level":2,"title":"网络协议栈的IP层","slug":"网络协议栈的ip层","link":"#网络协议栈的ip层","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/47-接收网络包（上）：如何搞明白合作伙伴让我们做什么？.md","filePath":"趣谈Linux操作系统/47-接收网络包（上）：如何搞明白合作伙伴让我们做什么？.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/47-接收网络包（上）：如何搞明白合作伙伴让我们做什么？.md"};function l(i,s,c,_,r,o){return a(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_47-接收网络包-上-如何搞明白合作伙伴让我们做什么" tabindex="-1">47 | 接收网络包（上）：如何搞明白合作伙伴让我们做什么？ <a class="header-anchor" href="#_47-接收网络包-上-如何搞明白合作伙伴让我们做什么" aria-label="Permalink to &quot;47 | 接收网络包（上）：如何搞明白合作伙伴让我们做什么？&quot;">​</a></h1><p>前面两节，我们分析了发送网络包的整个过程。这一节，我们来解析接收网络包的过程。</p><p>如果说网络包的发送是从应用层开始，层层调用，一直到网卡驱动程序的话，网络包的接收过程，就是一个反过来的过程，我们不能从应用层的读取开始，而应该从网卡接收到一个网络包开始。我们用两节来解析这个过程，这一节我们从硬件网卡解析到IP层，下一节，我们从IP层解析到Socket层。</p><h2 id="设备驱动层" tabindex="-1">设备驱动层 <a class="header-anchor" href="#设备驱动层" aria-label="Permalink to &quot;设备驱动层&quot;">​</a></h2><p>网卡作为一个硬件，接收到网络包，应该怎么通知操作系统，这个网络包到达了呢？咱们学习过输入输出设备和中断。没错，我们可以触发一个中断。但是这里有个问题，就是网络包的到来，往往是很难预期的。网络吞吐量比较大的时候，网络包的到达会十分频繁。这个时候，如果非常频繁地去触发中断，想想就觉得是个灾难。</p><p>比如说，CPU正在做某个事情，一些网络包来了，触发了中断，CPU停下手里的事情，去处理这些网络包，处理完毕按照中断处理的逻辑，应该回去继续处理其他事情。这个时候，另一些网络包又来了，又触发了中断，CPU手里的事情还没捂热，又要停下来去处理网络包。能不能大家要来的一起来，把网络包好好处理一把，然后再回去集中处理其他事情呢？</p><p>网络包能不能一起来，这个我们没法儿控制，但是我们可以有一种机制，就是当一些网络包到来触发了中断，内核处理完这些网络包之后，我们可以先进入主动轮询poll网卡的方式，主动去接收到来的网络包。如果一直有，就一直处理，等处理告一段落，就返回干其他的事情。当再有下一批网络包到来的时候，再中断，再轮询poll。这样就会大大减少中断的数量，提升网络处理的效率，这种处理方式我们称为 <strong>NAPI</strong>。</p><p>为了帮你了解设备驱动层的工作机制，我们还是以上一节发送网络包时的网卡drivers/net/ethernet/intel/ixgb/ixgb_main.c为例子，来进行解析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct pci_driver ixgb_driver = {</span></span>
<span class="line"><span>	.name     = ixgb_driver_name,</span></span>
<span class="line"><span>	.id_table = ixgb_pci_tbl,</span></span>
<span class="line"><span>	.probe    = ixgb_probe,</span></span>
<span class="line"><span>	.remove   = ixgb_remove,</span></span>
<span class="line"><span>	.err_handler = &amp;ixgb_err_handler</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MODULE_AUTHOR(&quot;Intel Corporation, &amp;lt;linux.nics&amp;#64;intel.com&amp;gt;&quot;);</span></span>
<span class="line"><span>MODULE_DESCRIPTION(&quot;Intel(R) PRO/10GbE Network Driver&quot;);</span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span>
<span class="line"><span>MODULE_VERSION(DRV_VERSION);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * ixgb_init_module - Driver Registration Routine</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * ixgb_init_module is the first routine called when the driver is</span></span>
<span class="line"><span> * loaded. All it does is register with the PCI subsystem.</span></span>
<span class="line"><span> **/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init</span></span>
<span class="line"><span>ixgb_init_module(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	pr_info(&quot;%s - version %s\\n&quot;, ixgb_driver_string, ixgb_driver_version);</span></span>
<span class="line"><span>	pr_info(&quot;%s\\n&quot;, ixgb_copyright);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return pci_register_driver(&amp;ixgb_driver);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module_init(ixgb_init_module);</span></span></code></pre></div><p>在网卡驱动程序初始化的时候，我们会调用ixgb_init_module，注册一个驱动ixgb_driver，并且调用它的probe函数ixgb_probe。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int</span></span>
<span class="line"><span>ixgb_probe(struct pci_dev *pdev, const struct pci_device_id *ent)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net_device *netdev = NULL;</span></span>
<span class="line"><span>	struct ixgb_adapter *adapter;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	netdev = alloc_etherdev(sizeof(struct ixgb_adapter));</span></span>
<span class="line"><span>	SET_NETDEV_DEV(netdev, &amp;pdev-&amp;gt;dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	pci_set_drvdata(pdev, netdev);</span></span>
<span class="line"><span>	adapter = netdev_priv(netdev);</span></span>
<span class="line"><span>	adapter-&amp;gt;netdev = netdev;</span></span>
<span class="line"><span>	adapter-&amp;gt;pdev = pdev;</span></span>
<span class="line"><span>	adapter-&amp;gt;hw.back = adapter;</span></span>
<span class="line"><span>	adapter-&amp;gt;msg_enable = netif_msg_init(debug, DEFAULT_MSG_ENABLE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	adapter-&amp;gt;hw.hw_addr = pci_ioremap_bar(pdev, BAR_0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	netdev-&amp;gt;netdev_ops = &amp;ixgb_netdev_ops;</span></span>
<span class="line"><span>	ixgb_set_ethtool_ops(netdev);</span></span>
<span class="line"><span>	netdev-&amp;gt;watchdog_timeo = 5 * HZ;</span></span>
<span class="line"><span>	netif_napi_add(netdev, &amp;adapter-&amp;gt;napi, ixgb_clean, 64);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	strncpy(netdev-&amp;gt;name, pci_name(pdev), sizeof(netdev-&amp;gt;name) - 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	adapter-&amp;gt;bd_number = cards_found;</span></span>
<span class="line"><span>	adapter-&amp;gt;link_speed = 0;</span></span>
<span class="line"><span>	adapter-&amp;gt;link_duplex = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ixgb_probe中，我们会创建一个struct net_device表示这个网络设备，并且netif_napi_add函数为这个网络设备注册一个轮询poll函数ixgb_clean，将来一旦出现网络包的时候，就是要通过它来轮询了。</p><p>当一个网卡被激活的时候，我们会调用函数ixgb_open-&gt;ixgb_up，在这里面注册一个硬件的中断处理函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int</span></span>
<span class="line"><span>ixgb_up(struct ixgb_adapter *adapter)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net_device *netdev = adapter-&amp;gt;netdev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    err = request_irq(adapter-&amp;gt;pdev-&amp;gt;irq, ixgb_intr, irq_flags,</span></span>
<span class="line"><span>	                  netdev-&amp;gt;name, netdev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * ixgb_intr - Interrupt Handler</span></span>
<span class="line"><span> * &amp;#64;irq: interrupt number</span></span>
<span class="line"><span> * &amp;#64;data: pointer to a network interface device structure</span></span>
<span class="line"><span> **/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static irqreturn_t</span></span>
<span class="line"><span>ixgb_intr(int irq, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct net_device *netdev = data;</span></span>
<span class="line"><span>	struct ixgb_adapter *adapter = netdev_priv(netdev);</span></span>
<span class="line"><span>	struct ixgb_hw *hw = &amp;adapter-&amp;gt;hw;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (napi_schedule_prep(&amp;adapter-&amp;gt;napi)) {</span></span>
<span class="line"><span>		IXGB_WRITE_REG(&amp;adapter-&amp;gt;hw, IMC, ~0);</span></span>
<span class="line"><span>		__napi_schedule(&amp;adapter-&amp;gt;napi);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return IRQ_HANDLED;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果一个网络包到来，触发了硬件中断，就会调用ixgb_intr，这里面会调用__napi_schedule。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * __napi_schedule - schedule for receive</span></span>
<span class="line"><span> * &amp;#64;n: entry to schedule</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * The entry&#39;s receive function will be scheduled to run.</span></span>
<span class="line"><span> * Consider using __napi_schedule_irqoff() if hard irqs are masked.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>void __napi_schedule(struct napi_struct *n)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned long flags;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	local_irq_save(flags);</span></span>
<span class="line"><span>	____napi_schedule(this_cpu_ptr(&amp;softnet_data), n);</span></span>
<span class="line"><span>	local_irq_restore(flags);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void ____napi_schedule(struct softnet_data *sd,</span></span>
<span class="line"><span>				     struct napi_struct *napi)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	list_add_tail(&amp;napi-&amp;gt;poll_list, &amp;sd-&amp;gt;poll_list);</span></span>
<span class="line"><span>	__raise_softirq_irqoff(NET_RX_SOFTIRQ);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__napi_schedule是处于中断处理的关键部分，在他被调用的时候，中断是暂时关闭的，但是处理网络包是个复杂的过程，需要到延迟处理部分，所以____napi_schedule将当前设备放到struct softnet_data结构的poll_list里面，说明在延迟处理部分可以接着处理这个poll_list里面的网络设备。</p><p>然后____napi_schedule触发一个软中断NET_RX_SOFTIRQ，通过软中断触发中断处理的延迟处理部分，也是常用的手段。</p><p>上一节，我们知道，软中断NET_RX_SOFTIRQ对应的中断处理函数是net_rx_action。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __latent_entropy void net_rx_action(struct softirq_action *h)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct softnet_data *sd = this_cpu_ptr(&amp;softnet_data);</span></span>
<span class="line"><span>    LIST_HEAD(list);</span></span>
<span class="line"><span>    list_splice_init(&amp;sd-&amp;gt;poll_list, &amp;list);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	for (;;) {</span></span>
<span class="line"><span>		struct napi_struct *n;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		n = list_first_entry(&amp;list, struct napi_struct, poll_list);</span></span>
<span class="line"><span>		budget -= napi_poll(n, &amp;repoll);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在net_rx_action中，会得到struct softnet_data结构，这个结构在发送的时候我们也遇到过。当时它的output_queue用于网络包的发送，这里的poll_list用于网络包的接收。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct softnet_data {</span></span>
<span class="line"><span>	struct list_head	poll_list;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct Qdisc		*output_queue;</span></span>
<span class="line"><span>	struct Qdisc		**output_queue_tailp;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在net_rx_action中，接下来是一个循环，在poll_list里面取出网络包到达的设备，然后调用napi_poll来轮询这些设备，napi_poll会调用最初设备初始化的时候，注册的poll函数，对于ixgb_driver，对应的函数是ixgb_clean。</p><p>ixgb_clean会调用ixgb_clean_rx_irq。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static bool</span></span>
<span class="line"><span>ixgb_clean_rx_irq(struct ixgb_adapter *adapter, int *work_done, int work_to_do)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct ixgb_desc_ring *rx_ring = &amp;adapter-&amp;gt;rx_ring;</span></span>
<span class="line"><span>	struct net_device *netdev = adapter-&amp;gt;netdev;</span></span>
<span class="line"><span>	struct pci_dev *pdev = adapter-&amp;gt;pdev;</span></span>
<span class="line"><span>	struct ixgb_rx_desc *rx_desc, *next_rxd;</span></span>
<span class="line"><span>	struct ixgb_buffer *buffer_info, *next_buffer, *next2_buffer;</span></span>
<span class="line"><span>	u32 length;</span></span>
<span class="line"><span>	unsigned int i, j;</span></span>
<span class="line"><span>	int cleaned_count = 0;</span></span>
<span class="line"><span>	bool cleaned = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	i = rx_ring-&amp;gt;next_to_clean;</span></span>
<span class="line"><span>	rx_desc = IXGB_RX_DESC(*rx_ring, i);</span></span>
<span class="line"><span>	buffer_info = &amp;rx_ring-&amp;gt;buffer_info[i];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	while (rx_desc-&amp;gt;status &amp; IXGB_RX_DESC_STATUS_DD) {</span></span>
<span class="line"><span>		struct sk_buff *skb;</span></span>
<span class="line"><span>		u8 status;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		status = rx_desc-&amp;gt;status;</span></span>
<span class="line"><span>		skb = buffer_info-&amp;gt;skb;</span></span>
<span class="line"><span>		buffer_info-&amp;gt;skb = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		prefetch(skb-&amp;gt;data - NET_IP_ALIGN);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (++i == rx_ring-&amp;gt;count)</span></span>
<span class="line"><span>			i = 0;</span></span>
<span class="line"><span>		next_rxd = IXGB_RX_DESC(*rx_ring, i);</span></span>
<span class="line"><span>		prefetch(next_rxd);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		j = i + 1;</span></span>
<span class="line"><span>		if (j == rx_ring-&amp;gt;count)</span></span>
<span class="line"><span>			j = 0;</span></span>
<span class="line"><span>		next2_buffer = &amp;rx_ring-&amp;gt;buffer_info[j];</span></span>
<span class="line"><span>		prefetch(next2_buffer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		next_buffer = &amp;rx_ring-&amp;gt;buffer_info[i];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		length = le16_to_cpu(rx_desc-&amp;gt;length);</span></span>
<span class="line"><span>		rx_desc-&amp;gt;length = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		ixgb_check_copybreak(&amp;adapter-&amp;gt;napi, buffer_info, length, &amp;skb);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		/* Good Receive */</span></span>
<span class="line"><span>		skb_put(skb, length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		/* Receive Checksum Offload */</span></span>
<span class="line"><span>		ixgb_rx_checksum(adapter, rx_desc, skb);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		skb-&amp;gt;protocol = eth_type_trans(skb, netdev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		netif_receive_skb(skb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/* use prefetched values */</span></span>
<span class="line"><span>		rx_desc = next_rxd;</span></span>
<span class="line"><span>		buffer_info = next_buffer;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	rx_ring-&amp;gt;next_to_clean = i;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在网络设备的驱动层，有一个用于接收网络包的rx_ring。它是一个环，从网卡硬件接收的包会放在这个环里面。这个环里面的buffer_info[]是一个数组，存放的是网络包的内容。i和j是这个数组的下标，在ixgb_clean_rx_irq里面的while循环中，依次处理环里面的数据。在这里面，我们看到了i和j加一之后，如果超过了数组的大小，就跳回下标0，就说明这是一个环。</p><p>ixgb_check_copybreak函数将buffer_info里面的内容，拷贝到struct sk_buff *skb，从而可以作为一个网络包进行后续的处理，然后调用netif_receive_skb。</p><h2 id="网络协议栈的二层逻辑" tabindex="-1">网络协议栈的二层逻辑 <a class="header-anchor" href="#网络协议栈的二层逻辑" aria-label="Permalink to &quot;网络协议栈的二层逻辑&quot;">​</a></h2><p>从netif_receive_skb函数开始，我们就进入了内核的网络协议栈。</p><p>接下来的调用链为：netif_receive_skb-&gt;netif_receive_skb_internal-&gt;__netif_receive_skb-&gt;__netif_receive_skb_core。</p><p>在__netif_receive_skb_core中，我们先是处理了二层的一些逻辑。例如，对于VLAN的处理，接下来要想办法交给第三层。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __netif_receive_skb_core(struct sk_buff *skb, bool pfmemalloc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct packet_type *ptype, *pt_prev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	type = skb-&amp;gt;protocol;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	deliver_ptype_list_skb(skb, &amp;pt_prev, orig_dev, type,</span></span>
<span class="line"><span>			       &amp;orig_dev-&amp;gt;ptype_specific);</span></span>
<span class="line"><span>	if (pt_prev) {</span></span>
<span class="line"><span>		ret = pt_prev-&amp;gt;func(skb, skb-&amp;gt;dev, pt_prev, orig_dev);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void deliver_ptype_list_skb(struct sk_buff *skb,</span></span>
<span class="line"><span>					  struct packet_type **pt,</span></span>
<span class="line"><span>					  struct net_device *orig_dev,</span></span>
<span class="line"><span>					  __be16 type,</span></span>
<span class="line"><span>					  struct list_head *ptype_list)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct packet_type *ptype, *pt_prev = *pt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	list_for_each_entry_rcu(ptype, ptype_list, list) {</span></span>
<span class="line"><span>		if (ptype-&amp;gt;type != type)</span></span>
<span class="line"><span>			continue;</span></span>
<span class="line"><span>		if (pt_prev)</span></span>
<span class="line"><span>			deliver_skb(skb, pt_prev, orig_dev);</span></span>
<span class="line"><span>		pt_prev = ptype;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	*pt = pt_prev;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在网络包struct sk_buff里面，二层的头里面有一个protocol，表示里面一层，也即三层是什么协议。deliver_ptype_list_skb在一个协议列表中逐个匹配。如果能够匹配到，就返回。</p><p>这些协议的注册在网络协议栈初始化的时候， inet_init函数调用dev_add_pack(&amp;ip_packet_type)，添加IP协议。协议被放在一个链表里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void dev_add_pack(struct packet_type *pt)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct list_head *head = ptype_head(pt);</span></span>
<span class="line"><span>    list_add_rcu(&amp;pt-&amp;gt;list, head);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline struct list_head *ptype_head(const struct packet_type *pt)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (pt-&amp;gt;type == htons(ETH_P_ALL))</span></span>
<span class="line"><span>        return pt-&amp;gt;dev ? &amp;pt-&amp;gt;dev-&amp;gt;ptype_all : &amp;ptype_all;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return pt-&amp;gt;dev ? &amp;pt-&amp;gt;dev-&amp;gt;ptype_specific : &amp;ptype_base[ntohs(pt-&amp;gt;type) &amp; PTYPE_HASH_MASK];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假设这个时候的网络包是一个IP包，则在这个链表里面一定能够找到ip_packet_type，在__netif_receive_skb_core中会调用ip_packet_type的func函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct packet_type ip_packet_type __read_mostly = {</span></span>
<span class="line"><span>	.type = cpu_to_be16(ETH_P_IP),</span></span>
<span class="line"><span>	.func = ip_rcv,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>从上面的定义我们可以看出，接下来，ip_rcv会被调用。</p><h2 id="网络协议栈的ip层" tabindex="-1">网络协议栈的IP层 <a class="header-anchor" href="#网络协议栈的ip层" aria-label="Permalink to &quot;网络协议栈的IP层&quot;">​</a></h2><p>从ip_rcv函数开始，我们的处理逻辑就从二层到了三层，IP层。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ip_rcv(struct sk_buff *skb, struct net_device *dev, struct packet_type *pt, struct net_device *orig_dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	const struct iphdr *iph;</span></span>
<span class="line"><span>	struct net *net;</span></span>
<span class="line"><span>	u32 len;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	net = dev_net(dev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	iph = ip_hdr(skb);</span></span>
<span class="line"><span>	len = ntohs(iph-&amp;gt;tot_len);</span></span>
<span class="line"><span>	skb-&amp;gt;transport_header = skb-&amp;gt;network_header + iph-&amp;gt;ihl*4;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return NF_HOOK(NFPROTO_IPV4, NF_INET_PRE_ROUTING,</span></span>
<span class="line"><span>		       net, NULL, skb, dev, NULL,</span></span>
<span class="line"><span>		       ip_rcv_finish);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ip_rcv中，得到IP头，然后又遇到了我们见过多次的NF_HOOK，这次因为是接收网络包，第一个hook点是NF_INET_PRE_ROUTING，也就是iptables的PREROUTING链。如果里面有规则，则执行规则，然后调用ip_rcv_finish。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int ip_rcv_finish(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	const struct iphdr *iph = ip_hdr(skb);</span></span>
<span class="line"><span>	struct net_device *dev = skb-&amp;gt;dev;</span></span>
<span class="line"><span>	struct rtable *rt;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	rt = skb_rtable(skb);</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>	return dst_input(skb);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline int dst_input(struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return skb_dst(skb)-&amp;gt;input(skb);</span></span></code></pre></div><p>ip_rcv_finish得到网络包对应的路由表，然后调用dst_input，在dst_input中，调用的是struct rtable的成员的dst的input函数。在rt_dst_alloc中，我们可以看到，input函数指向的是ip_local_deliver。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ip_local_deliver(struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 *	Reassemble IP fragments.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct net *net = dev_net(skb-&amp;gt;dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (ip_is_fragment(ip_hdr(skb))) {</span></span>
<span class="line"><span>		if (ip_defrag(net, skb, IP_DEFRAG_LOCAL_DELIVER))</span></span>
<span class="line"><span>			return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return NF_HOOK(NFPROTO_IPV4, NF_INET_LOCAL_IN,</span></span>
<span class="line"><span>		       net, NULL, skb, skb-&amp;gt;dev, NULL,</span></span>
<span class="line"><span>		       ip_local_deliver_finish);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ip_local_deliver函数中，如果IP层进行了分段，则进行重新的组合。接下来就是我们熟悉的NF_HOOK。hook点在NF_INET_LOCAL_IN，对应iptables里面的INPUT链。在经过iptables规则处理完毕后，我们调用ip_local_deliver_finish。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int ip_local_deliver_finish(struct net *net, struct sock *sk, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	__skb_pull(skb, skb_network_header_len(skb));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	int protocol = ip_hdr(skb)-&amp;gt;protocol;</span></span>
<span class="line"><span>	const struct net_protocol *ipprot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ipprot = rcu_dereference(inet_protos[protocol]);</span></span>
<span class="line"><span>	if (ipprot) {</span></span>
<span class="line"><span>		int ret;</span></span>
<span class="line"><span>		ret = ipprot-&amp;gt;handler(skb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在IP头中，有一个字段protocol用于指定里面一层的协议，在这里应该是TCP协议。于是，从inet_protos数组中，找出TCP协议对应的处理函数。这个数组的定义如下，里面的内容是struct net_protocol。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct net_protocol __rcu *inet_protos[MAX_INET_PROTOS] __read_mostly;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int inet_add_protocol(const struct net_protocol *prot, unsigned char protocol)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return !cmpxchg((const struct net_protocol **)&amp;inet_protos[protocol],</span></span>
<span class="line"><span>			NULL, prot) ? 0 : -1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init inet_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (inet_add_protocol(&amp;udp_protocol, IPPROTO_UDP) &amp;lt; 0)</span></span>
<span class="line"><span>		pr_crit(&quot;%s: Cannot add UDP protocol\\n&quot;, __func__);</span></span>
<span class="line"><span>	if (inet_add_protocol(&amp;tcp_protocol, IPPROTO_TCP) &amp;lt; 0)</span></span>
<span class="line"><span>		pr_crit(&quot;%s: Cannot add TCP protocol\\n&quot;, __func__);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct net_protocol tcp_protocol = {</span></span>
<span class="line"><span>	.early_demux	=	tcp_v4_early_demux,</span></span>
<span class="line"><span>	.early_demux_handler =  tcp_v4_early_demux,</span></span>
<span class="line"><span>	.handler	=	tcp_v4_rcv,</span></span>
<span class="line"><span>	.err_handler	=	tcp_v4_err,</span></span>
<span class="line"><span>	.no_policy	=	1,</span></span>
<span class="line"><span>	.netns_ok	=	1,</span></span>
<span class="line"><span>	.icmp_strict_tag_validation = 1,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct net_protocol udp_protocol = {</span></span>
<span class="line"><span>	.early_demux =	udp_v4_early_demux,</span></span>
<span class="line"><span>	.early_demux_handler =	udp_v4_early_demux,</span></span>
<span class="line"><span>	.handler =	udp_rcv,</span></span>
<span class="line"><span>	.err_handler =	udp_err,</span></span>
<span class="line"><span>	.no_policy =	1,</span></span>
<span class="line"><span>	.netns_ok =	1,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在系统初始化的时候，网络协议栈的初始化调用的是inet_init，它会调用inet_add_protocol，将TCP协议对应的处理函数tcp_protocol、UDP协议对应的处理函数udp_protocol，放到inet_protos数组中。</p><p>在上面的网络包的接收过程中，会取出TCP协议对应的处理函数tcp_protocol，然后调用handler函数，也即tcp_v4_rcv函数。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节我们讲了接收网络包的上半部分，分以下几个层次。</p><ul><li>硬件网卡接收到网络包之后，通过DMA技术，将网络包放入Ring Buffer。</li><li>硬件网卡通过中断通知CPU新的网络包的到来。</li><li>网卡驱动程序会注册中断处理函数ixgb_intr。</li><li>中断处理函数处理完需要暂时屏蔽中断的核心流程之后，通过软中断NET_RX_SOFTIRQ触发接下来的处理过程。</li><li>NET_RX_SOFTIRQ软中断处理函数net_rx_action，net_rx_action会调用napi_poll，进而调用ixgb_clean_rx_irq，从Ring Buffer中读取数据到内核struct sk_buff。</li><li>调用netif_receive_skb进入内核网络协议栈，进行一些关于VLAN的二层逻辑处理后，调用ip_rcv进入三层IP层。</li><li>在IP层，会处理iptables规则，然后调用ip_local_deliver，交给更上层TCP层。</li><li>在TCP层调用tcp_v4_rcv。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107485/a51af8ada1135101e252271626669337.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107485/a51af8ada1135101e252271626669337.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>我们没有仔细分析对于二层VLAN的处理，请你研究一下VLAN的原理，然后在代码中看一下对于VLAN的处理过程，这是一项重要的网络基础知识。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107485/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/107485/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,59)])])}const g=n(e,[["render",l]]);export{u as __pageData,g as default};
