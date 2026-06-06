import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"17 | 调度（下）：抢占式调度是如何发生的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"抢占式调度","slug":"抢占式调度","link":"#抢占式调度","children":[]},{"level":2,"title":"抢占的时机","slug":"抢占的时机","link":"#抢占的时机","children":[{"level":3,"title":"用户态的抢占时机","slug":"用户态的抢占时机","link":"#用户态的抢占时机","children":[]},{"level":3,"title":"内核态的抢占时机","slug":"内核态的抢占时机","link":"#内核态的抢占时机","children":[]}]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/17-调度（下）：抢占式调度是如何发生的？.md","filePath":"趣谈Linux操作系统/17-调度（下）：抢占式调度是如何发生的？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/17-调度（下）：抢占式调度是如何发生的？.md"};function l(i,s,c,r,_,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_17-调度-下-抢占式调度是如何发生的" tabindex="-1">17 | 调度（下）：抢占式调度是如何发生的？ <a class="header-anchor" href="#_17-调度-下-抢占式调度是如何发生的" aria-label="Permalink to &quot;17 | 调度（下）：抢占式调度是如何发生的？&quot;">​</a></h1><p>上一节，我们讲了主动调度，就是进程运行到一半，因为等待I/O等操作而主动让出CPU，然后就进入了我们的“进程调度第一定律”。所有进程的调用最终都会走__schedule函数。那这个定律在这一节还是要继续起作用。</p><h2 id="抢占式调度" tabindex="-1">抢占式调度 <a class="header-anchor" href="#抢占式调度" aria-label="Permalink to &quot;抢占式调度&quot;">​</a></h2><p>上一节我们讲的主动调度是第一种方式，第二种方式，就是抢占式调度。什么情况下会发生抢占呢？</p><p>最常见的现象就是 <strong>一个进程执行时间太长了，是时候切换到另一个进程了</strong>。那怎么衡量一个进程的运行时间呢？在计算机里面有一个时钟，会过一段时间触发一次时钟中断，通知操作系统，时间又过去一个时钟周期，这是个很好的方式，可以查看是否是需要抢占的时间点。</p><p>时钟中断处理函数会调用scheduler_tick()，它的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void scheduler_tick(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int cpu = smp_processor_id();</span></span>
<span class="line"><span>	struct rq *rq = cpu_rq(cpu);</span></span>
<span class="line"><span>	struct task_struct *curr = rq-&amp;gt;curr;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	curr-&amp;gt;sched_class-&amp;gt;task_tick(rq, curr, 0);</span></span>
<span class="line"><span>	cpu_load_update_active(rq);</span></span>
<span class="line"><span>	calc_global_load_tick(rq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个函数先取出当前CPU的运行队列，然后得到这个队列上当前正在运行中的进程的task_struct，然后调用这个task_struct的调度类的task_tick函数，顾名思义这个函数就是来处理时钟事件的。</p><p>如果当前运行的进程是普通进程，调度类为fair_sched_class，调用的处理时钟的函数为task_tick_fair。我们来看一下它的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void task_tick_fair(struct rq *rq, struct task_struct *curr, int queued)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cfs_rq *cfs_rq;</span></span>
<span class="line"><span>	struct sched_entity *se = &amp;curr-&amp;gt;se;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for_each_sched_entity(se) {</span></span>
<span class="line"><span>		cfs_rq = cfs_rq_of(se);</span></span>
<span class="line"><span>		entity_tick(cfs_rq, se, queued);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据当前进程的task_struct，找到对应的调度实体sched_entity和cfs_rq队列，调用entity_tick。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void</span></span>
<span class="line"><span>entity_tick(struct cfs_rq *cfs_rq, struct sched_entity *curr, int queued)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	update_curr(cfs_rq);</span></span>
<span class="line"><span>	update_load_avg(curr, UPDATE_TG);</span></span>
<span class="line"><span>	update_cfs_shares(curr);</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>	if (cfs_rq-&amp;gt;nr_running &amp;gt; 1)</span></span>
<span class="line"><span>		check_preempt_tick(cfs_rq, curr);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在entity_tick里面，我们又见到了熟悉的update_curr。它会更新当前进程的vruntime，然后调用check_preempt_tick。顾名思义就是，检查是否是时候被抢占了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void</span></span>
<span class="line"><span>check_preempt_tick(struct cfs_rq *cfs_rq, struct sched_entity *curr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned long ideal_runtime, delta_exec;</span></span>
<span class="line"><span>	struct sched_entity *se;</span></span>
<span class="line"><span>	s64 delta;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ideal_runtime = sched_slice(cfs_rq, curr);</span></span>
<span class="line"><span>	delta_exec = curr-&amp;gt;sum_exec_runtime - curr-&amp;gt;prev_sum_exec_runtime;</span></span>
<span class="line"><span>	if (delta_exec &amp;gt; ideal_runtime) {</span></span>
<span class="line"><span>		resched_curr(rq_of(cfs_rq));</span></span>
<span class="line"><span>		return;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	se = __pick_first_entity(cfs_rq);</span></span>
<span class="line"><span>	delta = curr-&amp;gt;vruntime - se-&amp;gt;vruntime;</span></span>
<span class="line"><span>	if (delta &amp;lt; 0)</span></span>
<span class="line"><span>		return;</span></span>
<span class="line"><span>	if (delta &amp;gt; ideal_runtime)</span></span>
<span class="line"><span>		resched_curr(rq_of(cfs_rq));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>check_preempt_tick先是调用sched_slice函数计算出的ideal_runtime。ideal_runtime是一个调度周期中，该进程运行的实际时间。</p><p>sum_exec_runtime指进程总共执行的实际时间，prev_sum_exec_runtime指上次该进程被调度时已经占用的实际时间。每次在调度一个新的进程时都会把它的se-&gt;prev_sum_exec_runtime = se-&gt;sum_exec_runtime，所以sum_exec_runtime-prev_sum_exec_runtime就是这次调度占用实际时间。如果这个时间大于ideal_runtime，则应该被抢占了。</p><p>除了这个条件之外，还会通过__pick_first_entity取出红黑树中最小的进程。如果当前进程的vruntime大于红黑树中最小的进程的vruntime，且差值大于ideal_runtime，也应该被抢占了。</p><p>当发现当前进程应该被抢占，不能直接把它踢下来，而是把它标记为应该被抢占。为什么呢？因为进程调度第一定律呀，一定要等待正在运行的进程调用__schedule才行啊，所以这里只能先标记一下。</p><p>标记一个进程应该被抢占，都是调用resched_curr，它会调用set_tsk_need_resched，标记进程应该被抢占，但是此时此刻，并不真的抢占，而是打上一个标签TIF_NEED_RESCHED。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void set_tsk_need_resched(struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	set_tsk_thread_flag(tsk,TIF_NEED_RESCHED);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外一个可能抢占的场景是 <strong>当一个进程被唤醒的时候</strong>。</p><p>我们前面说过，当一个进程在等待一个I/O的时候，会主动放弃CPU。但是当I/O到来的时候，进程往往会被唤醒。这个时候是一个时机。当被唤醒的进程优先级高于CPU上的当前进程，就会触发抢占。try_to_wake_up()调用ttwu_queue将这个唤醒的任务添加到队列当中。ttwu_queue再调用ttwu_do_activate激活这个任务。ttwu_do_activate调用ttwu_do_wakeup。这里面调用了check_preempt_curr检查是否应该发生抢占。如果应该发生抢占，也不是直接踢走当前进程，而是将当前进程标记为应该被抢占。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void ttwu_do_wakeup(struct rq *rq, struct task_struct *p, int wake_flags,</span></span>
<span class="line"><span>			   struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	check_preempt_curr(rq, p, wake_flags);</span></span>
<span class="line"><span>	p-&amp;gt;state = TASK_RUNNING;</span></span>
<span class="line"><span>	trace_sched_wakeup(p);</span></span></code></pre></div><p>到这里，你会发现，抢占问题只做完了一半。就是标识当前运行中的进程应该被抢占了，但是真正的抢占动作并没有发生。</p><h2 id="抢占的时机" tabindex="-1">抢占的时机 <a class="header-anchor" href="#抢占的时机" aria-label="Permalink to &quot;抢占的时机&quot;">​</a></h2><p>真正的抢占还需要时机，也就是需要那么一个时刻，让正在运行中的进程有机会调用一下__schedule。</p><p>你可以想象，不可能某个进程代码运行着，突然要去调用__schedule，代码里面不可能这么写，所以一定要规划几个时机，这个时机分为用户态和内核态。</p><h3 id="用户态的抢占时机" tabindex="-1">用户态的抢占时机 <a class="header-anchor" href="#用户态的抢占时机" aria-label="Permalink to &quot;用户态的抢占时机&quot;">​</a></h3><p>对于用户态的进程来讲，从系统调用中返回的那个时刻，是一个被抢占的时机。</p><p>前面讲系统调用的时候，64位的系统调用的链路位do_syscall_64-&gt;syscall_return_slowpath-&gt;prepare_exit_to_usermode-&gt;exit_to_usermode_loop，当时我们还没关注exit_to_usermode_loop这个函数，现在我们来看一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void exit_to_usermode_loop(struct pt_regs *regs, u32 cached_flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	while (true) {</span></span>
<span class="line"><span>		/* We have work to do. */</span></span>
<span class="line"><span>		local_irq_enable();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (cached_flags &amp; _TIF_NEED_RESCHED)</span></span>
<span class="line"><span>			schedule();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在我们看到在exit_to_usermode_loop函数中，上面打的标记起了作用，如果被打了_TIF_NEED_RESCHED，调用schedule进行调度，调用的过程和上一节解析的一样，会选择一个进程让出CPU，做上下文切换。</p><p>对于用户态的进程来讲，从中断中返回的那个时刻，也是一个被抢占的时机。</p><p>在arch/x86/entry/entry_64.S中有中断的处理过程。又是一段汇编语言代码，你重点领会它的意思就行，不要纠结每一行都看懂。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>common_interrupt:</span></span>
<span class="line"><span>        ASM_CLAC</span></span>
<span class="line"><span>        addq    $-0x80, (%rsp)</span></span>
<span class="line"><span>        interrupt do_IRQ</span></span>
<span class="line"><span>ret_from_intr:</span></span>
<span class="line"><span>        popq    %rsp</span></span>
<span class="line"><span>        testb   $3, CS(%rsp)</span></span>
<span class="line"><span>        jz      retint_kernel</span></span>
<span class="line"><span>/* Interrupt came from user space */</span></span>
<span class="line"><span>GLOBAL(retint_user)</span></span>
<span class="line"><span>        mov     %rsp,%rdi</span></span>
<span class="line"><span>        call    prepare_exit_to_usermode</span></span>
<span class="line"><span>        TRACE_IRQS_IRETQ</span></span>
<span class="line"><span>        SWAPGS</span></span>
<span class="line"><span>        jmp     restore_regs_and_iret</span></span>
<span class="line"><span>/* Returning to kernel space */</span></span>
<span class="line"><span>retint_kernel:</span></span>
<span class="line"><span>#ifdef CONFIG_PREEMPT</span></span>
<span class="line"><span>        bt      $9, EFLAGS(%rsp)</span></span>
<span class="line"><span>        jnc     1f</span></span>
<span class="line"><span>0:      cmpl    $0, PER_CPU_VAR(__preempt_count)</span></span>
<span class="line"><span>        jnz     1f</span></span>
<span class="line"><span>        call    preempt_schedule_irq</span></span>
<span class="line"><span>        jmp     0b</span></span></code></pre></div><p>中断处理调用的是do_IRQ函数，中断完毕后分为两种情况，一个是返回用户态，一个是返回内核态。这个通过注释也能看出来。</p><p>咱们先来看返回用户态这一部分，先不管返回内核态的那部分代码，retint_user会调用prepare_exit_to_usermode，最终调用exit_to_usermode_loop，和上面的逻辑一样，发现有标记则调用schedule()。</p><h3 id="内核态的抢占时机" tabindex="-1">内核态的抢占时机 <a class="header-anchor" href="#内核态的抢占时机" aria-label="Permalink to &quot;内核态的抢占时机&quot;">​</a></h3><p>用户态的抢占时机讲完了，接下来我们看内核态的抢占时机。</p><p>对内核态的执行中，被抢占的时机一般发生在preempt_enable()中。</p><p>在内核态的执行中，有的操作是不能被中断的，所以在进行这些操作之前，总是先调用preempt_disable()关闭抢占，当再次打开的时候，就是一次内核态代码被抢占的机会。</p><p>就像下面代码中展示的一样，preempt_enable()会调用preempt_count_dec_and_test()，判断preempt_count和TIF_NEED_RESCHED是否可以被抢占。如果可以，就调用preempt_schedule-&gt;preempt_schedule_common-&gt;__schedule进行调度。还是满足进程调度第一定律的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define preempt_enable() \\</span></span>
<span class="line"><span>do { \\</span></span>
<span class="line"><span>	if (unlikely(preempt_count_dec_and_test())) \\</span></span>
<span class="line"><span>		__preempt_schedule(); \\</span></span>
<span class="line"><span>} while (0)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define preempt_count_dec_and_test() \\</span></span>
<span class="line"><span>	({ preempt_count_sub(1); should_resched(0); })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static __always_inline bool should_resched(int preempt_offset)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return unlikely(preempt_count() == preempt_offset &amp;&amp;</span></span>
<span class="line"><span>			tif_need_resched());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define tif_need_resched() test_thread_flag(TIF_NEED_RESCHED)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void __sched notrace preempt_schedule_common(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		__schedule(true);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	} while (need_resched())</span></span></code></pre></div><p>在内核态也会遇到中断的情况，当中断返回的时候，返回的仍然是内核态。这个时候也是一个执行抢占的时机，现在我们再来上面中断返回的代码中返回内核的那部分代码，调用的是preempt_schedule_irq。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>asmlinkage __visible void __sched preempt_schedule_irq(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		preempt_disable();</span></span>
<span class="line"><span>		local_irq_enable();</span></span>
<span class="line"><span>		__schedule(true);</span></span>
<span class="line"><span>		local_irq_disable();</span></span>
<span class="line"><span>		sched_preempt_enable_no_resched();</span></span>
<span class="line"><span>	} while (need_resched());</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>preempt_schedule_irq调用__schedule进行调度。还是满足进程调度第一定律的。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>好了，抢占式调度就讲到这里了。我这里画了一张脑图，将整个进程的调度体系都放在里面。</p><p>这个脑图里面第一条就是总结了进程调度第一定律的核心函数__schedule的执行过程，这是上一节讲的，因为要切换的东西比较多，需要你详细了解每一部分是如何切换的。</p><p>第二条总结了标记为可抢占的场景，第三条是所有的抢占发生的时机，这里是真正验证了进程调度第一定律的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93711/93588d71abd7f007397979f0ba7def7f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93711/93588d71abd7f007397979f0ba7def7f.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>通过对于内核中进程调度的分析，我们知道，时间对于调度是很重要的，你知道Linux内核是如何管理和度量时间的吗？</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93711/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/93711/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,55)])])}const h=a(t,[["render",l]]);export{o as __pageData,h as default};
