import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"33 | 字符设备（下）：如何建立直销模式？","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/33-字符设备（下）：如何建立直销模式？.md","filePath":"趣谈Linux操作系统/33-字符设备（下）：如何建立直销模式？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/33-字符设备（下）：如何建立直销模式？.md"};function i(l,s,c,r,_,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_33-字符设备-下-如何建立直销模式" tabindex="-1">33 | 字符设备（下）：如何建立直销模式？ <a class="header-anchor" href="#_33-字符设备-下-如何建立直销模式" aria-label="Permalink to &quot;33 | 字符设备（下）：如何建立直销模式？&quot;">​</a></h1><p>上一节，我们讲了一个设备能够被打开、能够读写，主流的功能基本就完成了。我们讲输入输出设备的时候说到，如果一个设备有事情需要通知操作系统，会通过中断和设备驱动程序进行交互，今天我们就来解析中断处理机制。</p><p>鼠标就是通过中断，将自己的位置和按键信息，传递给设备驱动程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int logibm_open(struct input_dev *dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (request_irq(logibm_irq, logibm_interrupt, 0, &quot;logibm&quot;, NULL)) {</span></span>
<span class="line"><span>		printk(KERN_ERR &quot;logibm.c: Can&#39;t allocate irq %d\\n&quot;, logibm_irq);</span></span>
<span class="line"><span>		return -EBUSY;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	outb(LOGIBM_ENABLE_IRQ, LOGIBM_CONTROL_PORT);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static irqreturn_t logibm_interrupt(int irq, void *dev_id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	char dx, dy;</span></span>
<span class="line"><span>	unsigned char buttons;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	outb(LOGIBM_READ_X_LOW, LOGIBM_CONTROL_PORT);</span></span>
<span class="line"><span>	dx = (inb(LOGIBM_DATA_PORT) &amp; 0xf);</span></span>
<span class="line"><span>	outb(LOGIBM_READ_X_HIGH, LOGIBM_CONTROL_PORT);</span></span>
<span class="line"><span>	dx |= (inb(LOGIBM_DATA_PORT) &amp; 0xf) &amp;lt;&amp;lt; 4;</span></span>
<span class="line"><span>	outb(LOGIBM_READ_Y_LOW, LOGIBM_CONTROL_PORT);</span></span>
<span class="line"><span>	dy = (inb(LOGIBM_DATA_PORT) &amp; 0xf);</span></span>
<span class="line"><span>	outb(LOGIBM_READ_Y_HIGH, LOGIBM_CONTROL_PORT);</span></span>
<span class="line"><span>	buttons = inb(LOGIBM_DATA_PORT);</span></span>
<span class="line"><span>	dy |= (buttons &amp; 0xf) &amp;lt;&amp;lt; 4;</span></span>
<span class="line"><span>	buttons = ~buttons &amp;gt;&amp;gt; 5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	input_report_rel(logibm_dev, REL_X, dx);</span></span>
<span class="line"><span>	input_report_rel(logibm_dev, REL_Y, dy);</span></span>
<span class="line"><span>	input_report_key(logibm_dev, BTN_RIGHT,  buttons &amp; 1);</span></span>
<span class="line"><span>	input_report_key(logibm_dev, BTN_MIDDLE, buttons &amp; 2);</span></span>
<span class="line"><span>	input_report_key(logibm_dev, BTN_LEFT,   buttons &amp; 4);</span></span>
<span class="line"><span>	input_sync(logibm_dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	outb(LOGIBM_ENABLE_IRQ, LOGIBM_CONTROL_PORT);</span></span>
<span class="line"><span>	return IRQ_HANDLED</span></span></code></pre></div><p>要处理中断，需要有一个中断处理函数。定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>irqreturn_t (*irq_handler_t)(int irq, void * dev_id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * enum irqreturn</span></span>
<span class="line"><span> * &amp;#64;IRQ_NONE		interrupt was not from this device or was not handled</span></span>
<span class="line"><span> * &amp;#64;IRQ_HANDLED		interrupt was handled by this device</span></span>
<span class="line"><span> * &amp;#64;IRQ_WAKE_THREAD	handler requests to wake the handler thread</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>enum irqreturn {</span></span>
<span class="line"><span>	IRQ_NONE		= (0 &amp;lt;&amp;lt; 0),</span></span>
<span class="line"><span>	IRQ_HANDLED		= (1 &amp;lt;&amp;lt; 0),</span></span>
<span class="line"><span>	IRQ_WAKE_THREAD		= (1 &amp;lt;&amp;lt; 1),</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>其中，irq是一个整数，是中断信号。dev_id是一个void *的通用指针，主要用于区分同一个中断处理函数对于不同设备的处理。</p><p>这里的返回值有三种：IRQ_NONE表示不是我的中断，不归我管；IRQ_HANDLED表示处理完了的中断；IRQ_WAKE_THREAD表示有一个进程正在等待这个中断，中断处理完了，应该唤醒它。</p><p>上面的例子中，logibm_interrupt这个中断处理函数，先是获取了x和y的移动坐标，以及左中右的按键，上报上去，然后返回IRQ_HANDLED，这表示处理完毕。</p><p>其实，写一个真正生产用的中断处理程序还是很复杂的。当一个中断信号A触发后，正在处理的过程中，这个中断信号A是应该暂时关闭的，这样是为了防止再来一个中断信号A，在当前的中断信号A的处理过程中插一杠子。但是，这个暂时关闭的时间应该多长呢？</p><p>如果太短了，应该原子化处理完毕的没有处理完毕，又被另一个中断信号A中断了，很多操作就不正确了；如果太长了，一直关闭着，新的中断信号A进不来，系统就显得很慢。所以，很多中断处理程序将整个中断要做的事情分成两部分，称为上半部和下半部，或者成为关键处理部分和延迟处理部分。在中断处理函数中，仅仅处理关键部分，完成了就将中断信号打开，使得新的中断可以进来，需要比较长时间处理的部分，也即延迟部分，往往通过工作队列等方式慢慢处理。</p><p>这个写起来可以是一本书了，推荐你好好读一读《Linux Device Drivers》这本书，这里我就不详细介绍了。</p><p>有了中断处理函数，接下来要调用request_irq来注册这个中断处理函数。request_irq有这样几个参数：</p><ul><li>unsigned int irq是中断信号；</li><li>irq_handler_t handler是中断处理函数；</li><li>unsigned long flags是一些标识位；</li><li>const char *name是设备名称；</li><li>void *dev这个通用指针应该和中断处理函数的void *dev相对应。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int __must_check</span></span>
<span class="line"><span>request_irq(unsigned int irq, irq_handler_t handler, unsigned long flags, const char *name, void *dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return request_threaded_irq(irq, handler, NULL, flags, name, dev);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>中断处理函数被注册到哪里去呢？让我们沿着request_irq看下去。request_irq调用的是request_threaded_irq。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int request_threaded_irq(unsigned int irq, irq_handler_t handler,</span></span>
<span class="line"><span>			 irq_handler_t thread_fn, unsigned long irqflags,</span></span>
<span class="line"><span>			 const char *devname, void *dev_id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct irqaction *action;</span></span>
<span class="line"><span>	struct irq_desc *desc;</span></span>
<span class="line"><span>	int retval;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	desc = irq_to_desc(irq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	action = kzalloc(sizeof(struct irqaction), GFP_KERNEL);</span></span>
<span class="line"><span>	action-&amp;gt;handler = handler;</span></span>
<span class="line"><span>	action-&amp;gt;thread_fn = thread_fn;</span></span>
<span class="line"><span>	action-&amp;gt;flags = irqflags;</span></span>
<span class="line"><span>	action-&amp;gt;name = devname;</span></span>
<span class="line"><span>	action-&amp;gt;dev_id = dev_id;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	retval = __setup_irq(irq, desc, action);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于每一个中断，都有一个对中断的描述结构struct irq_desc。它有一个重要的成员变量是struct irqaction，用于表示处理这个中断的动作。如果我们仔细看这个结构，会发现，它里面有next指针，也就是说，这是一个链表，对于这个中断的所有处理动作，都串在这个链表上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct irq_desc {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct irqaction	*action;	/* IRQ action list */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct module		*owner;</span></span>
<span class="line"><span>	const char		*name;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * struct irqaction - per interrupt action descriptor</span></span>
<span class="line"><span> * &amp;#64;handler:	interrupt handler function</span></span>
<span class="line"><span> * &amp;#64;name:	name of the device</span></span>
<span class="line"><span> * &amp;#64;dev_id:	cookie to identify the device</span></span>
<span class="line"><span> * &amp;#64;percpu_dev_id:	cookie to identify the device</span></span>
<span class="line"><span> * &amp;#64;next:	pointer to the next irqaction for shared interrupts</span></span>
<span class="line"><span> * &amp;#64;irq:	interrupt number</span></span>
<span class="line"><span> * &amp;#64;flags:	flags (see IRQF_* above)</span></span>
<span class="line"><span> * &amp;#64;thread_fn:	interrupt handler function for threaded interrupts</span></span>
<span class="line"><span> * &amp;#64;thread:	thread pointer for threaded interrupts</span></span>
<span class="line"><span> * &amp;#64;secondary:	pointer to secondary irqaction (force threading)</span></span>
<span class="line"><span> * &amp;#64;thread_flags:	flags related to &amp;#64;thread</span></span>
<span class="line"><span> * &amp;#64;thread_mask:	bitmask for keeping track of &amp;#64;thread activity</span></span>
<span class="line"><span> * &amp;#64;dir:	pointer to the proc/irq/NN/name entry</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct irqaction {</span></span>
<span class="line"><span>	irq_handler_t		handler;</span></span>
<span class="line"><span>	void			*dev_id;</span></span>
<span class="line"><span>	void __percpu		*percpu_dev_id;</span></span>
<span class="line"><span>	struct irqaction	*next;</span></span>
<span class="line"><span>	irq_handler_t		thread_fn;</span></span>
<span class="line"><span>	struct task_struct	*thread;</span></span>
<span class="line"><span>	struct irqaction	*secondary;</span></span>
<span class="line"><span>	unsigned int		irq;</span></span>
<span class="line"><span>	unsigned int		flags;</span></span>
<span class="line"><span>	unsigned long		thread_flags;</span></span>
<span class="line"><span>	unsigned long		thread_mask;</span></span>
<span class="line"><span>	const char		*name;</span></span>
<span class="line"><span>	struct proc_dir_entry	*dir;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>每一个中断处理动作的结构struct irqaction，都有以下成员：</p><ul><li>中断处理函数handler；</li><li>void *dev_id为设备id；</li><li>irq为中断信号；</li><li>如果中断处理函数在单独的线程运行，则有thread_fn是线程的执行函数，thread是线程的task_struct。</li></ul><p>在request_threaded_irq函数中，irq_to_desc根据中断信号查找中断描述结构。如何查找呢？这就要区分情况。一般情况下，所有的struct irq_desc都放在一个数组里面，我们直接按下标查找就可以了。如果配置了CONFIG_SPARSE_IRQ，那中断号是不连续的，就不适合用数组保存了，</p><p>我们可以放在一棵基数树上。我们不是第一次遇到这个数据结构了。这种结构对于从某个整型key找到value速度很快，中断信号irq是这个整数。通过它，我们很快就能定位到对应的struct irq_desc。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef CONFIG_SPARSE_IRQ</span></span>
<span class="line"><span>static RADIX_TREE(irq_desc_tree, GFP_KERNEL);</span></span>
<span class="line"><span>struct irq_desc *irq_to_desc(unsigned int irq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return radix_tree_lookup(&amp;irq_desc_tree, irq);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#else /* !CONFIG_SPARSE_IRQ */</span></span>
<span class="line"><span>struct irq_desc irq_desc[NR_IRQS] __cacheline_aligned_in_smp = {</span></span>
<span class="line"><span>	[0 ... NR_IRQS-1] = {</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct irq_desc *irq_to_desc(unsigned int irq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return (irq &amp;lt; NR_IRQS) ? irq_desc + irq : NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#endif /* !CONFIG_SPARSE_IRQ */</span></span></code></pre></div><p>为什么中断信号会有稀疏，也就是不连续的情况呢？这里需要说明一下，这里的irq并不是真正的、物理的中断信号，而是一个抽象的、虚拟的中断信号。因为物理的中断信号和硬件关联比较大，中断控制器也是各种各样的。</p><p>作为内核，我们不可能写程序的时候，适配各种各样的硬件中断控制器，因而就需要有一层中断抽象层。这里虚拟中断信号到中断描述结构的映射，就是抽象中断层的主要逻辑。</p><p>下面我们讲真正中断响应的时候，会涉及物理中断信号。可以想象，如果只有一个CPU，一个中断控制器，则基本能够保证从物理中断信号到虚拟中断信号的映射是线性的，这样用数组表示就没啥问题，但是如果有多个CPU，多个中断控制器，每个中断控制器各有各的物理中断信号，就没办法保证虚拟中断信号是连续的，所以就要用到基数树了。</p><p>接下来，request_threaded_irq函数分配了一个struct irqaction，并且初始化它，接着调用__setup_irq。在这个函数里面，如果struct irq_desc里面已经有struct irqaction了，我们就将新的struct irqaction挂在链表的末端。如果设定了以单独的线程运行中断处理函数，setup_irq_thread就会创建这个内核线程，wake_up_process会唤醒它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int</span></span>
<span class="line"><span>__setup_irq(unsigned int irq, struct irq_desc *desc, struct irqaction *new)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct irqaction *old, **old_ptr;</span></span>
<span class="line"><span>	unsigned long flags, thread_mask = 0;</span></span>
<span class="line"><span>	int ret, nested, shared = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new-&amp;gt;irq = irq;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * Create a handler thread when a thread function is supplied</span></span>
<span class="line"><span>	 * and the interrupt does not nest into another interrupt</span></span>
<span class="line"><span>	 * thread.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	if (new-&amp;gt;thread_fn &amp;&amp; !nested) {</span></span>
<span class="line"><span>		ret = setup_irq_thread(new, irq, false);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	old_ptr = &amp;desc-&amp;gt;action;</span></span>
<span class="line"><span>	old = *old_ptr;</span></span>
<span class="line"><span>	if (old) {</span></span>
<span class="line"><span>		/* add new interrupt at end of irq queue */</span></span>
<span class="line"><span>		do {</span></span>
<span class="line"><span>			thread_mask |= old-&amp;gt;thread_mask;</span></span>
<span class="line"><span>			old_ptr = &amp;old-&amp;gt;next;</span></span>
<span class="line"><span>			old = *old_ptr;</span></span>
<span class="line"><span>		} while (old);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	*old_ptr = new;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (new-&amp;gt;thread)</span></span>
<span class="line"><span>		wake_up_process(new-&amp;gt;thread);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int</span></span>
<span class="line"><span>setup_irq_thread(struct irqaction *new, unsigned int irq, bool secondary)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *t;</span></span>
<span class="line"><span>	struct sched_param param = {</span></span>
<span class="line"><span>		.sched_priority = MAX_USER_RT_PRIO/2,</span></span>
<span class="line"><span>	};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	t = kthread_create(irq_thread, new, &quot;irq/%d-%s&quot;, irq, new-&amp;gt;name);</span></span>
<span class="line"><span>	sched_setscheduler_nocheck(t, SCHED_FIFO, &amp;param);</span></span>
<span class="line"><span>	get_task_struct(t);</span></span>
<span class="line"><span>	new-&amp;gt;thread = t;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return 0;</span></span></code></pre></div><p>至此为止，request_irq完成了它的使命。总结来说，它就是根据中断信号irq，找到基数树上对应的irq_desc，然后将新的irqaction挂在链表上。</p><p>接下来，我们就来看，真正中断来了的时候，会发生一些什么。</p><p>真正中断的发生还是要从硬件开始。这里面有四个层次。</p><ul><li>第一个层次是外部设备给中断控制器发送物理中断信号。</li><li>第二个层次是中断控制器将物理中断信号转换成为中断向量interrupt vector，发给各个CPU。</li><li>第三个层次是每个CPU都会有一个中断向量表，根据interrupt vector调用一个IRQ处理函数。注意这里的IRQ处理函数还不是咱们上面指定的irq_handler_t，到这一层还是CPU硬件的要求。</li><li>第四个层次是在IRQ处理函数中，将interrupt vector转化为抽象中断层的中断信号irq，调用中断信号irq对应的中断描述结构里面的irq_handler_t。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100576/dd492efdcf956cb22ce3d51592cdc113.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100576/dd492efdcf956cb22ce3d51592cdc113.png" alt=""></a></p><p>在这里，我们不解析硬件的部分，我们从CPU收到中断向量开始分析。</p><p>CPU收到的中断向量是什么样的呢？这个定义在文件arch/x86/include/asm/irq_vectors.h中。这里面的注释非常好，建议你仔细阅读。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Linux IRQ vector layout.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * There are 256 IDT entries (per CPU - each entry is 8 bytes) which can</span></span>
<span class="line"><span> * be defined by Linux. They are used as a jump table by the CPU when a</span></span>
<span class="line"><span> * given vector is triggered - by a CPU-external, CPU-internal or</span></span>
<span class="line"><span> * software-triggered event.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Linux sets the kernel code address each entry jumps to early during</span></span>
<span class="line"><span> * bootup, and never changes them. This is the general layout of the</span></span>
<span class="line"><span> * IDT entries:</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> *  Vectors   0 ...  31 : system traps and exceptions - hardcoded events</span></span>
<span class="line"><span> *  Vectors  32 ... 127 : device interrupts</span></span>
<span class="line"><span> *  Vector  128         : legacy int80 syscall interface</span></span>
<span class="line"><span> *  Vectors 129 ... INVALIDATE_TLB_VECTOR_START-1 except 204 : device interrupts</span></span>
<span class="line"><span> *  Vectors INVALIDATE_TLB_VECTOR_START ... 255 : special interrupts</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * 64-bit x86 has per CPU IDT tables, 32-bit has one shared IDT table.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * This file enumerates the exact layout of them:</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>#define FIRST_EXTERNAL_VECTOR		0x20</span></span>
<span class="line"><span>#define IA32_SYSCALL_VECTOR		0x80</span></span>
<span class="line"><span>#define NR_VECTORS			 256</span></span>
<span class="line"><span>#define FIRST_SYSTEM_VECTOR		NR_VECTORS</span></span></code></pre></div><p>通过这些注释，我们可以看出，CPU能够处理的中断总共256个，用宏NR_VECTOR或者FIRST_SYSTEM_VECTOR表示。</p><p>为了处理中断，CPU硬件要求每一个CPU都有一个中断向量表，通过load_idt加载，里面记录着每一个中断对应的处理方法，这个中断向量表定义在文件arch/x86/kernel/traps.c中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>gate_desc idt_table[NR_VECTORS] __page_aligned_bss;</span></span></code></pre></div><p>对于一个CPU可以处理的中断被分为几个部分，第一部分0到31的前32位是系统陷入或者系统异常，这些错误无法屏蔽，一定要处理。</p><p>这些中断的处理函数在系统初始化的时候，在start_kernel函数中调用过trap_init()。这个咱们讲系统初始化和系统调用的时候，都大概讲过这个函数，这里还需要仔细看一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void __init trap_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>	set_intr_gate(X86_TRAP_DE, divide_error);</span></span>
<span class="line"><span>//各种各样的set_intr_gate，不都贴在这里了，只贴一头一尾</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>	set_intr_gate(X86_TRAP_XF, simd_coprocessor_error);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Reserve all the builtin and the syscall vector: */</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; FIRST_EXTERNAL_VECTOR; i++)</span></span>
<span class="line"><span>		set_bit(i, used_vectors);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef CONFIG_X86_32</span></span>
<span class="line"><span>	set_system_intr_gate(IA32_SYSCALL_VECTOR, entry_INT80_32);</span></span>
<span class="line"><span>	set_bit(IA32_SYSCALL_VECTOR, used_vectors);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * Set the IDT descriptor to a fixed read-only location, so that the</span></span>
<span class="line"><span>	 * &quot;sidt&quot; instruction will not leak the location of the kernel, and</span></span>
<span class="line"><span>	 * to defend the IDT against arbitrary memory write vulnerabilities.</span></span>
<span class="line"><span>	 * It will be reloaded in cpu_init() */</span></span>
<span class="line"><span>	__set_fixmap(FIX_RO_IDT, __pa_symbol(idt_table), PAGE_KERNEL_RO);</span></span>
<span class="line"><span>	idt_descr.address = fix_to_virt(FIX_RO_IDT);</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>我这里贴的代码省略了很多，在trap_init函数的一开始，调用了大量的set_intr_gate，最终都会调用_set_gate，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void _set_gate(int gate, unsigned type, void *addr,</span></span>
<span class="line"><span>			     unsigned dpl, unsigned ist, unsigned seg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	gate_desc s;</span></span>
<span class="line"><span>	pack_gate(&amp;s, type, (unsigned long)addr, dpl, ist, seg);</span></span>
<span class="line"><span>	write_idt_entry(idt_table, gate, &amp;s);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码可以看出，set_intr_gate其实就是将每个中断都设置了中断处理函数，放在中断向量表idt_table中。</p><p>在trap_init中，由于set_intr_gate调用的太多，容易让人眼花缭乱。其实arch/x86/include/asm/traps.h文件中，早就定义好了前32个中断。如果仔细对比一下，你会发现，这些都在trap_init中使用set_intr_gate设置过了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Interrupts/Exceptions */</span></span>
<span class="line"><span>enum {</span></span>
<span class="line"><span>	X86_TRAP_DE = 0,	/*  0, Divide-by-zero */</span></span>
<span class="line"><span>	X86_TRAP_DB,		/*  1, Debug */</span></span>
<span class="line"><span>	X86_TRAP_NMI,		/*  2, Non-maskable Interrupt */</span></span>
<span class="line"><span>	X86_TRAP_BP,		/*  3, Breakpoint */</span></span>
<span class="line"><span>	X86_TRAP_OF,		/*  4, Overflow */</span></span>
<span class="line"><span>	X86_TRAP_BR,		/*  5, Bound Range Exceeded */</span></span>
<span class="line"><span>	X86_TRAP_UD,		/*  6, Invalid Opcode */</span></span>
<span class="line"><span>	X86_TRAP_NM,		/*  7, Device Not Available */</span></span>
<span class="line"><span>	X86_TRAP_DF,		/*  8, Double Fault */</span></span>
<span class="line"><span>	X86_TRAP_OLD_MF,	/*  9, Coprocessor Segment Overrun */</span></span>
<span class="line"><span>	X86_TRAP_TS,		/* 10, Invalid TSS */</span></span>
<span class="line"><span>	X86_TRAP_NP,		/* 11, Segment Not Present */</span></span>
<span class="line"><span>	X86_TRAP_SS,		/* 12, Stack Segment Fault */</span></span>
<span class="line"><span>	X86_TRAP_GP,		/* 13, General Protection Fault */</span></span>
<span class="line"><span>	X86_TRAP_PF,		/* 14, Page Fault */</span></span>
<span class="line"><span>	X86_TRAP_SPURIOUS,	/* 15, Spurious Interrupt */</span></span>
<span class="line"><span>	X86_TRAP_MF,		/* 16, x87 Floating-Point Exception */</span></span>
<span class="line"><span>	X86_TRAP_AC,		/* 17, Alignment Check */</span></span>
<span class="line"><span>	X86_TRAP_MC,		/* 18, Machine Check */</span></span>
<span class="line"><span>	X86_TRAP_XF,		/* 19, SIMD Floating-Point Exception */</span></span>
<span class="line"><span>	X86_TRAP_IRET = 32,	/* 32, IRET Exception */</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>我们回到trap_init中，当前32个中断都用set_intr_gate设置完毕。在中断向量表idt_table中填完了之后，接下来的for循环，for (i = 0; i &lt; FIRST_EXTERNAL_VECTOR; i++)，将前32个中断都在used_vectors中标记为1，表示这些都设置过中断处理函数了。</p><p>接下来，trap_init单独调用set_intr_gate来设置32位系统调用的中断。IA32_SYSCALL_VECTOR，也即128，单独将used_vectors中的第128位标记为1。</p><p>在trap_init的最后，我们将idt_table放在一个固定的虚拟地址上。trap_init结束后，中断向量表中已经填好了前32位，外加一位32位系统调用，其他的都是用于设备中断。</p><p>在start_kernel调用完毕trap_init之后，还会调用init_IRQ()来初始化其他的设备中断，最终会调用到native_init_IRQ。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void __init native_init_IRQ(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span>	i = FIRST_EXTERNAL_VECTOR;</span></span>
<span class="line"><span>#ifndef CONFIG_X86_LOCAL_APIC</span></span>
<span class="line"><span>#define first_system_vector NR_VECTORS</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	for_each_clear_bit_from(i, used_vectors, first_system_vector) {</span></span>
<span class="line"><span>		/* IA32_SYSCALL_VECTOR could be used in trap_init already. */</span></span>
<span class="line"><span>		set_intr_gate(i, irq_entries_start +</span></span>
<span class="line"><span>				8 * (i - FIRST_EXTERNAL_VECTOR));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面从第32个中断开始，到最后NR_VECTORS为止，对于used_vectors中没有标记为1的位置，都会调用set_intr_gate设置中断向量表。</p><p>其实used_vectors中没有标记为1的，都是设备中断的部分。</p><p>也即所有的设备中断的中断处理函数，在中断向量表里面都会设置为从irq_entries_start开始，偏移量为i - FIRST_EXTERNAL_VECTOR的一项。</p><p>看来中断处理函数是定义在irq_entries_start这个表里面的，我们在arch\\x86\\entry\\entry_32.S和arch\\x86\\entry\\entry_64.S都能找到这个函数表的定义。</p><p>这又是汇编语言，不需要完全看懂，但是我们还是能看出来，这里面定义了FIRST_SYSTEM_VECTOR - FIRST_EXTERNAL_VECTOR项。每一项都是中断处理函数，会跳到common_interrupt去执行。这里会最终调用do_IRQ，调用完毕后，就从中断返回。这里我们需要区分返回用户态还是内核态。这里会有一个机会触发抢占，咱们讲进程切换的时候讲过的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ENTRY(irq_entries_start)</span></span>
<span class="line"><span>    vector=FIRST_EXTERNAL_VECTOR</span></span>
<span class="line"><span>    .rept (FIRST_SYSTEM_VECTOR - FIRST_EXTERNAL_VECTOR)</span></span>
<span class="line"><span>	pushl	$(~vector+0x80)			/* Note: always in signed byte range */</span></span>
<span class="line"><span>    vector=vector+1</span></span>
<span class="line"><span>	jmp	common_interrupt /* 会调用到do_IRQ */</span></span>
<span class="line"><span>	.align	8</span></span>
<span class="line"><span>    .endr</span></span>
<span class="line"><span>END(irq_entries_start)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>common_interrupt:</span></span>
<span class="line"><span>	ASM_CLAC</span></span>
<span class="line"><span>	addq	$-0x80, (%rsp)			/* Adjust vector to [-256, -1] range */</span></span>
<span class="line"><span>	interrupt do_IRQ</span></span>
<span class="line"><span>	/* 0(%rsp): old RSP */</span></span>
<span class="line"><span>ret_from_intr:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Interrupt came from user space */</span></span>
<span class="line"><span>GLOBAL(retint_user)</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>/* Returning to kernel space */</span></span>
<span class="line"><span>retint_kernel:</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>这样任何一个中断向量到达任何一个CPU，最终都会走到do_IRQ。我们来看do_IRQ的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * do_IRQ handles all normal device IRQ&#39;s (the special</span></span>
<span class="line"><span> * SMP cross-CPU interrupts have their own specific</span></span>
<span class="line"><span> * handlers).</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>__visible unsigned int __irq_entry do_IRQ(struct pt_regs *regs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct pt_regs *old_regs = set_irq_regs(regs);</span></span>
<span class="line"><span>	struct irq_desc * desc;</span></span>
<span class="line"><span>	/* high bit used in ret_from_ code  */</span></span>
<span class="line"><span>	unsigned vector = ~regs-&amp;gt;orig_ax;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	desc = __this_cpu_read(vector_irq[vector]);</span></span>
<span class="line"><span>	if (!handle_irq(desc, regs)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	set_irq_regs(old_regs);</span></span>
<span class="line"><span>	return 1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，从AX寄存器里面拿到了中断向量vector，但是别忘了中断控制器发送给每个CPU的中断向量都是每个CPU局部的，而抽象中断处理层的虚拟中断信号irq以及它对应的中断描述结构irq_desc是全局的，也即这个CPU的200号的中断向量和另一个CPU的200号中断向量对应的虚拟中断信号irq和中断描述结构irq_desc可能不一样，这就需要一个映射关系。这个映射关系放在Per CPU变量vector_irq里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DECLARE_PER_CPU(vector_irq_t, vector_irq);</span></span></code></pre></div><p>在系统初始化的时候，我们会调用__assign_irq_vector，将虚拟中断信号irq分配到某个CPU上的中断向量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __assign_irq_vector(int irq, struct apic_chip_data *d,</span></span>
<span class="line"><span>			       const struct cpumask *mask,</span></span>
<span class="line"><span>			       struct irq_data *irqdata)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	static int current_vector = FIRST_EXTERNAL_VECTOR + VECTOR_OFFSET_START;</span></span>
<span class="line"><span>	static int current_offset = VECTOR_OFFSET_START % 16;</span></span>
<span class="line"><span>	int cpu, vector;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	while (cpu &amp;lt; nr_cpu_ids) {</span></span>
<span class="line"><span>		int new_cpu, offset;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		vector = current_vector;</span></span>
<span class="line"><span>		offset = current_offset;</span></span>
<span class="line"><span>next:</span></span>
<span class="line"><span>		vector += 16;</span></span>
<span class="line"><span>		if (vector &amp;gt;= first_system_vector) {</span></span>
<span class="line"><span>			offset = (offset + 1) % 16;</span></span>
<span class="line"><span>			vector = FIRST_EXTERNAL_VECTOR + offset;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		/* If the search wrapped around, try the next cpu */</span></span>
<span class="line"><span>		if (unlikely(current_vector == vector))</span></span>
<span class="line"><span>			goto next_cpu;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (test_bit(vector, used_vectors))</span></span>
<span class="line"><span>			goto next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/* Found one! */</span></span>
<span class="line"><span>		current_vector = vector;</span></span>
<span class="line"><span>		current_offset = offset;</span></span>
<span class="line"><span>		/* Schedule the old vector for cleanup on all cpus */</span></span>
<span class="line"><span>		if (d-&amp;gt;cfg.vector)</span></span>
<span class="line"><span>			cpumask_copy(d-&amp;gt;old_domain, d-&amp;gt;domain);</span></span>
<span class="line"><span>		for_each_cpu(new_cpu, vector_searchmask)</span></span>
<span class="line"><span>			per_cpu(vector_irq, new_cpu)[vector] = irq_to_desc(irq);</span></span>
<span class="line"><span>		goto update;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>next_cpu:</span></span>
<span class="line"><span>		cpumask_or(searched_cpumask, searched_cpumask, vector_cpumask);</span></span>
<span class="line"><span>		cpumask_andnot(vector_cpumask, mask, searched_cpumask);</span></span>
<span class="line"><span>		cpu = cpumask_first_and(vector_cpumask, cpu_online_mask);</span></span>
<span class="line"><span>		continue;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>....</span></span></code></pre></div><p>在这里，一旦找到某个向量，就将CPU的此向量对应的向量描述结构irq_desc，设置为虚拟中断信号irq对应的向量描述结构irq_to_desc(irq)。</p><p>这样do_IRQ会根据中断向量vector得到对应的irq_desc，然后调用handle_irq。handle_irq会调用generic_handle_irq_desc，里面调用irq_desc的handle_irq。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void generic_handle_irq_desc(struct irq_desc *desc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	desc-&amp;gt;handle_irq(desc);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的handle_irq，最终会调用__handle_irq_event_percpu。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>irqreturn_t __handle_irq_event_percpu(struct irq_desc *desc, unsigned int *flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	irqreturn_t retval = IRQ_NONE;</span></span>
<span class="line"><span>	unsigned int irq = desc-&amp;gt;irq_data.irq;</span></span>
<span class="line"><span>	struct irqaction *action;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	record_irq_time(desc);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for_each_action_of_desc(desc, action) {</span></span>
<span class="line"><span>		irqreturn_t res;</span></span>
<span class="line"><span>		res = action-&amp;gt;handler(irq, action-&amp;gt;dev_id);</span></span>
<span class="line"><span>		switch (res) {</span></span>
<span class="line"><span>		case IRQ_WAKE_THREAD:</span></span>
<span class="line"><span>			__irq_wake_thread(desc, action);</span></span>
<span class="line"><span>		case IRQ_HANDLED:</span></span>
<span class="line"><span>			*flags |= action-&amp;gt;flags;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		default:</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		retval |= res;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return retval;</span></span></code></pre></div><p>__handle_irq_event_percpu里面调用了irq_desc里每个hander，这些hander是我们在所有action列表中注册的，这才是我们设置的那个中断处理函数。如果返回值是IRQ_HANDLED，就说明处理完毕；如果返回值是IRQ_WAKE_THREAD就唤醒线程。</p><p>至此，中断的整个过程就结束了。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节，我们讲了中断的整个处理过程。中断是从外部设备发起的，会形成外部中断。外部中断会到达中断控制器，中断控制器会发送中断向量Interrupt Vector给CPU。</p><p>对于每一个CPU，都要求有一个idt_table，里面存放了不同的中断向量的处理函数。中断向量表中已经填好了前32位，外加一位32位系统调用，其他的都是用于设备中断。</p><p>硬件中断的处理函数是do_IRQ进行统一处理，在这里会让中断向量，通过vector_irq映射为irq_desc。</p><p>irq_desc是一个用于描述用户注册的中断处理函数的结构，为了能够根据中断向量得到irq_desc结构，会把这些结构放在一个基数树里面，方便查找。</p><p>irq_desc里面有一个成员是irqaction，指向设备驱动程序里面注册的中断处理函数。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100576/26bde4fa2279f66098856c5b2b6d308f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100576/26bde4fa2279f66098856c5b2b6d308f.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你知道如何查看每个CPU都收到了哪些中断吗？</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100576/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100576/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,83)])])}const h=n(t,[["render",i]]);export{u as __pageData,h as default};
