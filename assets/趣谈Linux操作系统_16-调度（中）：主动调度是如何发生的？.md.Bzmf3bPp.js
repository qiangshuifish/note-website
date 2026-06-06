import{_ as a,H as n,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"16 | 调度（中）：主动调度是如何发生的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"主动调度","slug":"主动调度","link":"#主动调度","children":[]},{"level":2,"title":"进程上下文切换","slug":"进程上下文切换","link":"#进程上下文切换","children":[]},{"level":2,"title":"指令指针的保存与恢复","slug":"指令指针的保存与恢复","link":"#指令指针的保存与恢复","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/16-调度（中）：主动调度是如何发生的？.md","filePath":"趣谈Linux操作系统/16-调度（中）：主动调度是如何发生的？.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/16-调度（中）：主动调度是如何发生的？.md"};function i(l,s,c,r,_,o){return n(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_16-调度-中-主动调度是如何发生的" tabindex="-1">16 | 调度（中）：主动调度是如何发生的？ <a class="header-anchor" href="#_16-调度-中-主动调度是如何发生的" aria-label="Permalink to &quot;16 | 调度（中）：主动调度是如何发生的？&quot;">​</a></h1><p>上一节，我们为调度准备了这么多的数据结构，这一节我们来看调度是如何发生的。</p><p>所谓进程调度，其实就是一个人在做A项目，在某个时刻，换成做B项目去了。发生这种情况，主要有两种方式。</p><p><strong>方式一</strong>：A项目做着做着，发现里面有一条指令sleep，也就是要休息一下，或者在等待某个I/O事件。那没办法了，就要主动让出CPU，然后可以开始做B项目。</p><p><strong>方式二</strong>：A项目做着做着，旷日持久，实在受不了了。项目经理介入了，说这个项目A先停停，B项目也要做一下，要不然B项目该投诉了。</p><h2 id="主动调度" tabindex="-1">主动调度 <a class="header-anchor" href="#主动调度" aria-label="Permalink to &quot;主动调度&quot;">​</a></h2><p>我们这一节先来看方式一，主动调度。</p><p>这里我找了几个代码片段。 <strong>第一个片段是Btrfs，等待一个写入</strong>。 <a href="https://zh.wikipedia.org/wiki/Btrfs" target="_blank" rel="noreferrer">B</a> <a href="https://zh.wikipedia.org/wiki/Btrfs" target="_blank" rel="noreferrer">trfs</a>（B-Tree）是一种文件系统，感兴趣你可以自己去了解一下。</p><p>这个片段可以看作写入块设备的一个典型场景。写入需要一段时间，这段时间用不上CPU，还不如主动让给其他进程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void btrfs_wait_for_no_snapshoting_writes(struct btrfs_root *root)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		prepare_to_wait(&amp;root-&amp;gt;subv_writers-&amp;gt;wait, &amp;wait,</span></span>
<span class="line"><span>				TASK_UNINTERRUPTIBLE);</span></span>
<span class="line"><span>		writers = percpu_counter_sum(&amp;root-&amp;gt;subv_writers-&amp;gt;counter);</span></span>
<span class="line"><span>		if (writers)</span></span>
<span class="line"><span>			schedule();</span></span>
<span class="line"><span>		finish_wait(&amp;root-&amp;gt;subv_writers-&amp;gt;wait, &amp;wait);</span></span>
<span class="line"><span>	} while (writers);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外一个例子是， <strong>从Tap网络设备等待一个读取</strong>。Tap网络设备是虚拟机使用的网络设备。当没有数据到来的时候，它也需要等待，所以也会选择把CPU让给其他进程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ssize_t tap_do_read(struct tap_queue *q,</span></span>
<span class="line"><span>			   struct iov_iter *to,</span></span>
<span class="line"><span>			   int noblock, struct sk_buff *skb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	while (1) {</span></span>
<span class="line"><span>		if (!noblock)</span></span>
<span class="line"><span>			prepare_to_wait(sk_sleep(&amp;q-&amp;gt;sk), &amp;wait,</span></span>
<span class="line"><span>					TASK_INTERRUPTIBLE);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/* Nothing to read, let&#39;s sleep */</span></span>
<span class="line"><span>		schedule();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你应该知道，计算机主要处理计算、网络、存储三个方面。计算主要是CPU和内存的合作；网络和存储则多是和外部设备的合作；在操作外部设备的时候，往往需要让出CPU，就像上面两段代码一样，选择调用schedule()函数。</p><p>接下来，我们就来看 <strong>schedule函数的调用过程</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>asmlinkage __visible void __sched schedule(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *tsk = current;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sched_submit_work(tsk);</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		preempt_disable();</span></span>
<span class="line"><span>		__schedule(false);</span></span>
<span class="line"><span>		sched_preempt_enable_no_resched();</span></span>
<span class="line"><span>	} while (need_resched());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码的主要逻辑是在__schedule函数中实现的。这个函数比较复杂，我们分几个部分来讲解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void __sched notrace __schedule(bool preempt)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *prev, *next;</span></span>
<span class="line"><span>	unsigned long *switch_count;</span></span>
<span class="line"><span>	struct rq_flags rf;</span></span>
<span class="line"><span>	struct rq *rq;</span></span>
<span class="line"><span>	int cpu;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	cpu = smp_processor_id();</span></span>
<span class="line"><span>	rq = cpu_rq(cpu);</span></span>
<span class="line"><span>	prev = rq-&amp;gt;curr;</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>首先，在当前的CPU上，我们取出任务队列rq。</p><p>task_struct *prev指向这个CPU的任务队列上面正在运行的那个进程curr。为啥是prev？因为一旦将来它被切换下来，那它就成了前任了。</p><p>接下来代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>next = pick_next_task(rq, prev, &amp;rf);</span></span>
<span class="line"><span>clear_tsk_need_resched(prev);</span></span>
<span class="line"><span>clear_preempt_need_resched();</span></span></code></pre></div><p>第二步，获取下一个任务，task_struct *next指向下一个任务，这就是 <strong>继任</strong>。</p><p>pick_next_task的实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct task_struct *</span></span>
<span class="line"><span>pick_next_task(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	const struct sched_class *class;</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * Optimization: we know that if all tasks are in the fair class we can call that function directly, but only if the &amp;#64;prev task wasn&#39;t of a higher scheduling class, because otherwise those loose the opportunity to pull in more work from other CPUs.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	if (likely((prev-&amp;gt;sched_class == &amp;idle_sched_class ||</span></span>
<span class="line"><span>		    prev-&amp;gt;sched_class == &amp;fair_sched_class) &amp;&amp;</span></span>
<span class="line"><span>		   rq-&amp;gt;nr_running == rq-&amp;gt;cfs.h_nr_running)) {</span></span>
<span class="line"><span>		p = fair_sched_class.pick_next_task(rq, prev, rf);</span></span>
<span class="line"><span>		if (unlikely(p == RETRY_TASK))</span></span>
<span class="line"><span>			goto again;</span></span>
<span class="line"><span>		/* Assumes fair_sched_class-&amp;gt;next == idle_sched_class */</span></span>
<span class="line"><span>		if (unlikely(!p))</span></span>
<span class="line"><span>			p = idle_sched_class.pick_next_task(rq, prev, rf);</span></span>
<span class="line"><span>		return p;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>again:</span></span>
<span class="line"><span>	for_each_class(class) {</span></span>
<span class="line"><span>		p = class-&amp;gt;pick_next_task(rq, prev, rf);</span></span>
<span class="line"><span>		if (p) {</span></span>
<span class="line"><span>			if (unlikely(p == RETRY_TASK))</span></span>
<span class="line"><span>				goto again;</span></span>
<span class="line"><span>			return p;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们来看again这里，就是咱们上一节讲的依次调用调度类。但是这里有了一个优化，因为大部分进程是普通进程，所以大部分情况下会调用上面的逻辑，调用的就是fair_sched_class.pick_next_task。</p><p>根据上一节对于fair_sched_class的定义，它调用的是pick_next_task_fair，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct task_struct *</span></span>
<span class="line"><span>pick_next_task_fair(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cfs_rq *cfs_rq = &amp;rq-&amp;gt;cfs;</span></span>
<span class="line"><span>	struct sched_entity *se;</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>	int new_tasks;</span></span></code></pre></div><p>对于CFS调度类，取出相应的队列cfs_rq，这就是我们上一节讲的那棵红黑树。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>		struct sched_entity *curr = cfs_rq-&amp;gt;curr;</span></span>
<span class="line"><span>		if (curr) {</span></span>
<span class="line"><span>			if (curr-&amp;gt;on_rq)</span></span>
<span class="line"><span>				update_curr(cfs_rq);</span></span>
<span class="line"><span>			else</span></span>
<span class="line"><span>				curr = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		se = pick_next_entity(cfs_rq, curr);</span></span></code></pre></div><p>取出当前正在运行的任务curr，如果依然是可运行的状态，也即处于进程就绪状态，则调用update_curr更新vruntime。update_curr咱们上一节就见过了，它会根据实际运行时间算出vruntime来。</p><p>接着，pick_next_entity从红黑树里面，取最左边的一个节点。这个函数的实现我们上一节也讲过了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	p = task_of(se);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (prev != p) {</span></span>
<span class="line"><span>		struct sched_entity *pse = &amp;prev-&amp;gt;se;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		put_prev_entity(cfs_rq, pse);</span></span>
<span class="line"><span>		set_next_entity(cfs_rq, se);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return p</span></span></code></pre></div><p>task_of得到下一个调度实体对应的task_struct，如果发现继任和前任不一样，这就说明有一个更需要运行的进程了，就需要更新红黑树了。前面前任的vruntime更新过了，put_prev_entity放回红黑树，会找到相应的位置，然后set_next_entity将继任者设为当前任务。</p><p>第三步，当选出的继任者和前任不同，就要进行上下文切换，继任者进程正式进入运行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (likely(prev != next)) {</span></span>
<span class="line"><span>		rq-&amp;gt;nr_switches++;</span></span>
<span class="line"><span>		rq-&amp;gt;curr = next;</span></span>
<span class="line"><span>		++*switch_count;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		rq = context_switch(rq, prev, next, &amp;rf);</span></span></code></pre></div><h2 id="进程上下文切换" tabindex="-1">进程上下文切换 <a class="header-anchor" href="#进程上下文切换" aria-label="Permalink to &quot;进程上下文切换&quot;">​</a></h2><p>上下文切换主要干两件事情，一是切换进程空间，也即虚拟内存；二是切换寄存器和CPU上下文。</p><p>我们先来看context_switch的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * context_switch - switch to the new MM and the new thread&#39;s register state.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static __always_inline struct rq *</span></span>
<span class="line"><span>context_switch(struct rq *rq, struct task_struct *prev,</span></span>
<span class="line"><span>	       struct task_struct *next, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct mm_struct *mm, *oldmm;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	mm = next-&amp;gt;mm;</span></span>
<span class="line"><span>	oldmm = prev-&amp;gt;active_mm;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch_mm_irqs_off(oldmm, mm, next);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Here we just switch the register state and the stack. */</span></span>
<span class="line"><span>	switch_to(prev, next, prev);</span></span>
<span class="line"><span>	barrier();</span></span>
<span class="line"><span>	return finish_task_switch(prev);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里首先是内存空间的切换，里面涉及内存管理的内容比较多。内存管理后面我们会有专门的章节来讲，这里你先知道有这么一回事就行了。</p><p>接下来，我们看switch_to。它就是寄存器和栈的切换，它调用到了__switch_to_asm。这是一段汇编代码，主要用于栈的切换。</p><p>对于32位操作系统来讲，切换的是栈顶指针esp。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * %eax: prev task</span></span>
<span class="line"><span> * %edx: next task</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>ENTRY(__switch_to_asm)</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* switch stack */</span></span>
<span class="line"><span>	movl	%esp, TASK_threadsp(%eax)</span></span>
<span class="line"><span>	movl	TASK_threadsp(%edx), %esp</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	jmp	__switch_to</span></span>
<span class="line"><span>END(__switch_to_asm)</span></span></code></pre></div><p>对于64位操作系统来讲，切换的是栈顶指针rsp。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * %rdi: prev task</span></span>
<span class="line"><span> * %rsi: next task</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>ENTRY(__switch_to_asm)</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* switch stack */</span></span>
<span class="line"><span>	movq	%rsp, TASK_threadsp(%rdi)</span></span>
<span class="line"><span>	movq	TASK_threadsp(%rsi), %rsp</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	jmp	__switch_to</span></span>
<span class="line"><span>END(__switch_to_asm)</span></span></code></pre></div><p>最终，都返回了__switch_to这个函数。这个函数对于32位和64位操作系统虽然有不同的实现，但里面做的事情是差不多的。所以我这里仅仅列出64位操作系统做的事情。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__visible __notrace_funcgraph struct task_struct *</span></span>
<span class="line"><span>__switch_to(struct task_struct *prev_p, struct task_struct *next_p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct thread_struct *prev = &amp;prev_p-&amp;gt;thread;</span></span>
<span class="line"><span>	struct thread_struct *next = &amp;next_p-&amp;gt;thread;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	int cpu = smp_processor_id();</span></span>
<span class="line"><span>	struct tss_struct *tss = &amp;per_cpu(cpu_tss, cpu);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	load_TLS(next, cpu);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	this_cpu_write(current_task, next_p);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Reload esp0 and ss1.  This changes current_thread_info(). */</span></span>
<span class="line"><span>	load_sp0(tss, next);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return prev_p;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面有一个Per CPU的结构体tss。这是个什么呢？</p><p>在x86体系结构中，提供了一种以硬件的方式进行进程切换的模式，对于每个进程，x86希望在内存里面维护一个TSS（Task State Segment，任务状态段）结构。这里面有所有的寄存器。</p><p>另外，还有一个特殊的寄存器TR（Task Register，任务寄存器），指向某个进程的TSS。更改TR的值，将会触发硬件保存CPU所有寄存器的值到当前进程的TSS中，然后从新进程的TSS中读出所有寄存器值，加载到CPU对应的寄存器中。</p><p>下图就是32位的TSS结构。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93396/dfa9762cfec16822ec74d53350db4664.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93396/dfa9762cfec16822ec74d53350db4664.png" alt=""></a></p><p>图片来自Intel® 64 and IA-32 Architectures Software Developer’s Manual Combined Volumes</p><p>但是这样有个缺点。我们做进程切换的时候，没必要每个寄存器都切换，这样每个进程一个TSS，就需要全量保存，全量切换，动作太大了。</p><p>于是，Linux操作系统想了一个办法。还记得在系统初始化的时候，会调用cpu_init吗？这里面会给每一个CPU关联一个TSS，然后将TR指向这个TSS，然后在操作系统的运行过程中，TR就不切换了，永远指向这个TSS。TSS用数据结构tss_struct表示，在x86_hw_tss中可以看到和上图相应的结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void cpu_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int cpu = smp_processor_id();</span></span>
<span class="line"><span>	struct task_struct *curr = current;</span></span>
<span class="line"><span>	struct tss_struct *t = &amp;per_cpu(cpu_tss, cpu);</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    load_sp0(t, thread);</span></span>
<span class="line"><span>	set_tss_desc(cpu, t);</span></span>
<span class="line"><span>	load_TR_desc();</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct tss_struct {</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * The hardware state:</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct x86_hw_tss	x86_tss;</span></span>
<span class="line"><span>	unsigned long		io_bitmap[IO_BITMAP_LONGS + 1];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Linux中，真的参与进程切换的寄存器很少，主要的就是栈顶寄存器。</p><p>于是，在task_struct里面，还有一个我们原来没有注意的成员变量thread。这里面保留了要切换进程的时候需要修改的寄存器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* CPU-specific state of this task: */</span></span>
<span class="line"><span>	struct thread_struct		thread;</span></span></code></pre></div><p>所谓的进程切换，就是将某个进程的thread_struct里面的寄存器的值，写入到CPU的TR指向的tss_struct，对于CPU来讲，这就算是完成了切换。</p><p>例如__switch_to中的load_sp0，就是将下一个进程的thread_struct的sp0的值加载到tss_struct里面去。</p><h2 id="指令指针的保存与恢复" tabindex="-1">指令指针的保存与恢复 <a class="header-anchor" href="#指令指针的保存与恢复" aria-label="Permalink to &quot;指令指针的保存与恢复&quot;">​</a></h2><p>你是不是觉得，这样真的就完成切换了吗？是的，不信我们来 <strong>盘点</strong> 一下。</p><p>从进程A切换到进程B，用户栈要不要切换呢？当然要，其实早就已经切换了，就在切换内存空间的时候。每个进程的用户栈都是独立的，都在内存空间里面。</p><p>那内核栈呢？已经在__switch_to里面切换了，也就是将current_task指向当前的task_struct。里面的void *stack指针，指向的就是当前的内核栈。</p><p>内核栈的栈顶指针呢？在__switch_to_asm里面已经切换了栈顶指针，并且将栈顶指针在__switch_to加载到了TSS里面。</p><p>用户栈的栈顶指针呢？如果当前在内核里面的话，它当然是在内核栈顶部的pt_regs结构里面呀。当从内核返回用户态运行的时候，pt_regs里面有所有当时在用户态的时候运行的上下文信息，就可以开始运行了。</p><p>唯一让人不容易理解的是指令指针寄存器，它应该指向下一条指令的，那它是如何切换的呢？这里有点绕，请你仔细看。</p><p>这里我先明确一点，进程的调度都最终会调用到__schedule函数。为了方便你记住，我姑且给它起个名字，就叫“ <strong>进程调度第一定律</strong>”。后面我们会多次用到这个定律，你一定要记住。</p><p>我们用最前面的例子仔细分析这个过程。本来一个进程A在用户态是要写一个文件的，写文件的操作用户态没办法完成，就要通过系统调用到达内核态。在这个切换的过程中，用户态的指令指针寄存器是保存在pt_regs里面的，到了内核态，就开始沿着写文件的逻辑一步一步执行，结果发现需要等待，于是就调用__schedule函数。</p><p>这个时候，进程A在内核态的指令指针是指向__schedule了。这里请记住，A进程的内核栈会保存这个__schedule的调用，而且知道这是从btrfs_wait_for_no_snapshoting_writes这个函数里面进去的。</p><p>__schedule里面经过上面的层层调用，到达了context_switch的最后三行指令（其中barrier语句是一个编译器指令，用于保证switch_to和finish_task_switch的执行顺序，不会因为编译阶段优化而改变，这里咱们可以忽略它）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>switch_to(prev, next, prev);</span></span>
<span class="line"><span>barrier();</span></span>
<span class="line"><span>return finish_task_switch(prev);</span></span></code></pre></div><p>当进程A在内核里面执行switch_to的时候，内核态的指令指针也是指向这一行的。但是在switch_to里面，将寄存器和栈都切换到成了进程B的，唯一没有变的就是指令指针寄存器。当switch_to返回的时候，指令指针寄存器指向了下一条语句finish_task_switch。</p><p>但这个时候的finish_task_switch已经不是进程A的finish_task_switch了，而是进程B的finish_task_switch了。</p><p>这样合理吗？你怎么知道进程B当时被切换下去的时候，执行到哪里了？恢复B进程执行的时候一定在这里呢？这时候就要用到咱的“进程调度第一定律”了。</p><p>当年B进程被别人切换走的时候，也是调用__schedule，也是调用到switch_to，被切换成为C进程的，所以，B进程当年的下一个指令也是finish_task_switch，这就说明指令指针指到这里是没有错的。</p><p>接下来，我们要从finish_task_switch完毕后，返回__schedule的调用了。返回到哪里呢？按照函数返回的原理，当然是从内核栈里面去找，是返回到btrfs_wait_for_no_snapshoting_writes吗？当然不是了，因为btrfs_wait_for_no_snapshoting_writes是在A进程的内核栈里面的，它早就被切换走了，应该从B进程的内核栈里面找。</p><p>假设，B就是最前面例子里面调用tap_do_read读网卡的进程。它当年调用__schedule的时候，是从tap_do_read这个函数调用进去的。</p><p>当然，B进程的内核栈里面放的是tap_do_read。于是，从__schedule返回之后，当然是接着tap_do_read运行，然后在内核运行完毕后，返回用户态。这个时候，B进程内核栈的pt_regs也保存了用户态的指令指针寄存器，就接着在用户态的下一条指令开始运行就可以了。</p><p>假设，我们只有一个CPU，从B切换到C，从C又切换到A。在C切换到A的时候，还是按照“进程调度第一定律”，C进程还是会调用__schedule到达switch_to，在里面切换成为A的内核栈，然后运行finish_task_switch。</p><p>这个时候运行的finish_task_switch，才是A进程的finish_task_switch。运行完毕从__schedule返回的时候，从内核栈上才知道，当年是从btrfs_wait_for_no_snapshoting_writes调用进去的，因而应该返回btrfs_wait_for_no_snapshoting_writes继续执行，最后内核执行完毕返回用户态，同样恢复pt_regs，恢复用户态的指令指针寄存器，从用户态接着运行。</p><p>到这里你是不是有点理解为什么switch_to有三个参数呢？为啥有两个prev呢？其实我们从定义就可以看到。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define switch_to(prev, next, last)					\\</span></span>
<span class="line"><span>do {									\\</span></span>
<span class="line"><span>	prepare_switch_to(prev, next);					\\</span></span>
<span class="line"><span>									\\</span></span>
<span class="line"><span>	((last) = __switch_to_asm((prev), (next)));			\\</span></span>
<span class="line"><span>} while (0)</span></span></code></pre></div><p>在上面的例子中，A切换到B的时候，运行到__switch_to_asm这一行的时候，是在A的内核栈上运行的，prev是A，next是B。但是，A执行完__switch_to_asm之后就被切换走了，当C再次切换到A的时候，运行到__switch_to_asm，是从C的内核栈运行的。这个时候，prev是C，next是A，但是__switch_to_asm里面切换成为了A当时的内核栈。</p><p>还记得当年的场景“prev是A，next是B”，__switch_to_asm里面return prev的时候，还没return的时候，prev这个变量里面放的还是C，因而它会把C放到返回结果中。但是，一旦return，就会弹出A当时的内核栈。这个时候，prev变量就变成了A，next变量就变成了B。这就还原了当年的场景，好在返回值里面的last还是C。</p><p>通过三个变量switch_to(prev = A, next=B, last=C)，A进程就明白了，我当时被切换走的时候，是切换成B，这次切换回来，是从C回来的。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节我们讲主动调度的过程，也即一个运行中的进程主动调用__schedule让出CPU。在__schedule里面会做两件事情，第一是选取下一个进程，第二是进行上下文切换。而上下文切换又分用户态进程空间的切换和内核态的切换。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93396/9f4433e82c78ed5cd4399b4b116a9064.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93396/9f4433e82c78ed5cd4399b4b116a9064.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你知道应该用什么命令查看进程的运行时间和上下文切换次数吗？</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p>`,93)])])}const u=a(e,[["render",i]]);export{d as __pageData,u as default};
