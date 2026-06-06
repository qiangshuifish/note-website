import{_ as a,H as n,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"18 | 进程的创建：如何发起一个新项目？","description":"","frontmatter":{},"headers":[{"level":2,"title":"fork的第一件大事：复制结构","slug":"fork的第一件大事-复制结构","link":"#fork的第一件大事-复制结构","children":[]},{"level":2,"title":"fork的第二件大事：唤醒新进程","slug":"fork的第二件大事-唤醒新进程","link":"#fork的第二件大事-唤醒新进程","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/18-进程的创建：如何发起一个新项目？.md","filePath":"趣谈Linux操作系统/18-进程的创建：如何发起一个新项目？.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/18-进程的创建：如何发起一个新项目？.md"};function l(i,s,c,r,_,o){return n(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_18-进程的创建-如何发起一个新项目" tabindex="-1">18 | 进程的创建：如何发起一个新项目？ <a class="header-anchor" href="#_18-进程的创建-如何发起一个新项目" aria-label="Permalink to &quot;18 | 进程的创建：如何发起一个新项目？&quot;">​</a></h1><p>前面我们学习了如何使用fork创建进程，也学习了进程管理和调度的相关数据结构。这一节，我们就来看一看，创建进程这个动作在内核里都做了什么事情。</p><p>fork是一个系统调用，根据咱们讲过的系统调用的流程，流程的最后会在sys_call_table中找到相应的系统调用sys_fork。</p><p>sys_fork是如何定义的呢？根据SYSCALL_DEFINE0这个宏的定义，下面这段代码就定义了sys_fork。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE0(fork)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return _do_fork(SIGCHLD, 0, 0, NULL, NULL, 0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>sys_fork会调用_do_fork。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long _do_fork(unsigned long clone_flags,</span></span>
<span class="line"><span>	      unsigned long stack_start,</span></span>
<span class="line"><span>	      unsigned long stack_size,</span></span>
<span class="line"><span>	      int __user *parent_tidptr,</span></span>
<span class="line"><span>	      int __user *child_tidptr,</span></span>
<span class="line"><span>	      unsigned long tls)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>	int trace = 0;</span></span>
<span class="line"><span>	long nr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	p = copy_process(clone_flags, stack_start, stack_size,</span></span>
<span class="line"><span>			 child_tidptr, NULL, trace, tls, NUMA_NO_NODE);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (!IS_ERR(p)) {</span></span>
<span class="line"><span>		struct pid *pid;</span></span>
<span class="line"><span>		pid = get_task_pid(p, PIDTYPE_PID);</span></span>
<span class="line"><span>		nr = pid_vnr(pid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (clone_flags &amp; CLONE_PARENT_SETTID)</span></span>
<span class="line"><span>			put_user(nr, parent_tidptr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		wake_up_new_task(p);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		put_pid(pid);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span></code></pre></div><h2 id="fork的第一件大事-复制结构" tabindex="-1">fork的第一件大事：复制结构 <a class="header-anchor" href="#fork的第一件大事-复制结构" aria-label="Permalink to &quot;fork的第一件大事：复制结构&quot;">​</a></h2><p>_do_fork里面做的第一件大事就是copy_process，咱们前面讲过这个思想。如果所有数据结构都从头创建一份太麻烦了，还不如使用惯用“伎俩”，Ctrl C + Ctrl V。</p><p>这里我们再把task_struct的结构图拿出来，对比着看如何一个个复制。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94064/fda98b6c68605babb2036bf91782311d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94064/fda98b6c68605babb2036bf91782311d.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __latent_entropy struct task_struct *copy_process(</span></span>
<span class="line"><span>					unsigned long clone_flags,</span></span>
<span class="line"><span>					unsigned long stack_start,</span></span>
<span class="line"><span>					unsigned long stack_size,</span></span>
<span class="line"><span>					int __user *child_tidptr,</span></span>
<span class="line"><span>					struct pid *pid,</span></span>
<span class="line"><span>					int trace,</span></span>
<span class="line"><span>					unsigned long tls,</span></span>
<span class="line"><span>					int node)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int retval;</span></span>
<span class="line"><span>	struct task_struct *p;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	p = dup_task_struct(current, node);</span></span></code></pre></div><p>dup_task_struct主要做了下面几件事情：</p><ul><li><p>调用alloc_task_struct_node分配一个task_struct结构；</p></li><li><p>调用alloc_thread_stack_node来创建内核栈，这里面调用__vmalloc_node_range分配一个连续的THREAD_SIZE的内存空间，赋值给task_struct的void *stack成员变量；</p></li><li><p>调用arch_dup_task_struct(struct task_struct *dst, struct task_struct *src)，将task_struct进行复制，其实就是调用memcpy；</p></li><li><p>调用setup_thread_stack设置thread_info。</p></li></ul><p>到这里，整个task_struct复制了一份，而且内核栈也创建好了。</p><p>我们再接着看copy_process。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>retval = copy_creds(p, clone_flags);</span></span></code></pre></div><p>轮到权限相关了，copy_creds主要做了下面几件事情：</p><ul><li><p>调用prepare_creds，准备一个新的struct cred *new。如何准备呢？其实还是从内存中分配一个新的struct cred结构，然后调用memcpy复制一份父进程的cred；</p></li><li><p>接着p-&gt;cred = p-&gt;real_cred = get_cred(new)，将新进程的“我能操作谁”和“谁能操作我”两个权限都指向新的cred。</p></li></ul><p>接下来，copy_process重新设置进程运行的统计量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>p-&amp;gt;utime = p-&amp;gt;stime = p-&amp;gt;gtime = 0;</span></span>
<span class="line"><span>p-&amp;gt;start_time = ktime_get_ns();</span></span>
<span class="line"><span>p-&amp;gt;real_start_time = ktime_get_boot_ns();</span></span></code></pre></div><p>接下来，copy_process开始设置调度相关的变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>retval = sched_fork(clone_flags, p);</span></span></code></pre></div><p>sched_fork主要做了下面几件事情：</p><ul><li><p>调用__sched_fork，在这里面将on_rq设为0，初始化sched_entity，将里面的exec_start、sum_exec_runtime、prev_sum_exec_runtime、vruntime都设为0。你还记得吗，这几个变量涉及进程的实际运行时间和虚拟运行时间。是否到时间应该被调度了，就靠它们几个；</p></li><li><p>设置进程的状态p-&gt;state = TASK_NEW；</p></li><li><p>初始化优先级prio、normal_prio、static_prio；</p></li><li><p>设置调度类，如果是普通进程，就设置为p-&gt;sched_class = &amp;fair_sched_class；</p></li><li><p>调用调度类的task_fork函数，对于CFS来讲，就是调用task_fork_fair。在这个函数里，先调用update_curr，对于当前的进程进行统计量更新，然后把子进程和父进程的vruntime设成一样，最后调用place_entity，初始化sched_entity。这里有一个变量sysctl_sched_child_runs_first，可以设置父进程和子进程谁先运行。如果设置了子进程先运行，即便两个进程的vruntime一样，也要把子进程的sched_entity放在前面，然后调用resched_curr，标记当前运行的进程TIF_NEED_RESCHED，也就是说，把父进程设置为应该被调度，这样下次调度的时候，父进程会被子进程抢占。</p></li></ul><p>接下来，copy_process开始初始化与文件和文件系统相关的变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>retval = copy_files(clone_flags, p);</span></span>
<span class="line"><span>retval = copy_fs(clone_flags, p);</span></span></code></pre></div><p>copy_files主要用于复制一个进程打开的文件信息。这些信息用一个结构files_struct来维护，每个打开的文件都有一个文件描述符。在copy_files函数里面调用dup_fd，在这里面会创建一个新的files_struct，然后将所有的文件描述符数组fdtable拷贝一份。</p><p>copy_fs主要用于复制一个进程的目录信息。这些信息用一个结构fs_struct来维护。一个进程有自己的根目录和根文件系统root，也有当前目录pwd和当前目录的文件系统，都在fs_struct里面维护。copy_fs函数里面调用copy_fs_struct，创建一个新的fs_struct，并复制原来进程的fs_struct。</p><p>接下来，copy_process开始初始化与信号相关的变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>init_sigpending(&amp;p-&amp;gt;pending);</span></span>
<span class="line"><span>retval = copy_sighand(clone_flags, p);</span></span>
<span class="line"><span>retval = copy_signal(clone_flags, p);</span></span></code></pre></div><p>copy_sighand会分配一个新的sighand_struct。这里最主要的是维护信号处理函数，在copy_sighand里面会调用memcpy，将信号处理函数sighand-&gt;action从父进程复制到子进程。</p><p>init_sigpending和copy_signal用于初始化，并且复制用于维护发给这个进程的信号的数据结构。copy_signal函数会分配一个新的signal_struct，并进行初始化。</p><p>接下来，copy_process开始复制进程内存空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>retval = copy_mm(clone_flags, p);</span></span></code></pre></div><p>进程都有自己的内存空间，用mm_struct结构来表示。copy_mm函数中调用dup_mm，分配一个新的mm_struct结构，调用memcpy复制这个结构。dup_mmap用于复制内存空间中内存映射的部分。前面讲系统调用的时候，我们说过，mmap可以分配大块的内存，其实mmap也可以将一个文件映射到内存中，方便可以像读写内存一样读写文件，这个在内存管理那节我们讲。</p><p>接下来，copy_process开始分配pid，设置tid，group_leader，并且建立进程之间的亲缘关系。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	INIT_LIST_HEAD(&amp;p-&amp;gt;children);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;p-&amp;gt;sibling);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    p-&amp;gt;pid = pid_nr(pid);</span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_THREAD) {</span></span>
<span class="line"><span>		p-&amp;gt;exit_signal = -1;</span></span>
<span class="line"><span>		p-&amp;gt;group_leader = current-&amp;gt;group_leader;</span></span>
<span class="line"><span>		p-&amp;gt;tgid = current-&amp;gt;tgid;</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		if (clone_flags &amp; CLONE_PARENT)</span></span>
<span class="line"><span>			p-&amp;gt;exit_signal = current-&amp;gt;group_leader-&amp;gt;exit_signal;</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			p-&amp;gt;exit_signal = (clone_flags &amp; CSIGNAL);</span></span>
<span class="line"><span>		p-&amp;gt;group_leader = p;</span></span>
<span class="line"><span>		p-&amp;gt;tgid = p-&amp;gt;pid;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (clone_flags &amp; (CLONE_PARENT|CLONE_THREAD)) {</span></span>
<span class="line"><span>		p-&amp;gt;real_parent = current-&amp;gt;real_parent;</span></span>
<span class="line"><span>		p-&amp;gt;parent_exec_id = current-&amp;gt;parent_exec_id;</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		p-&amp;gt;real_parent = current;</span></span>
<span class="line"><span>		p-&amp;gt;parent_exec_id = current-&amp;gt;self_exec_id;</span></span>
<span class="line"><span>	}</span></span></code></pre></div><p>好了，copy_process要结束了，上面图中的组件也初始化的差不多了。</p><h2 id="fork的第二件大事-唤醒新进程" tabindex="-1">fork的第二件大事：唤醒新进程 <a class="header-anchor" href="#fork的第二件大事-唤醒新进程" aria-label="Permalink to &quot;fork的第二件大事：唤醒新进程&quot;">​</a></h2><p>_do_fork做的第二件大事是wake_up_new_task。新任务刚刚建立，有没有机会抢占别人，获得CPU呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void wake_up_new_task(struct task_struct *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct rq_flags rf;</span></span>
<span class="line"><span>	struct rq *rq;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	p-&amp;gt;state = TASK_RUNNING;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	activate_task(rq, p, ENQUEUE_NOCLOCK);</span></span>
<span class="line"><span>	p-&amp;gt;on_rq = TASK_ON_RQ_QUEUED;</span></span>
<span class="line"><span>	trace_sched_wakeup_new(p);</span></span>
<span class="line"><span>	check_preempt_curr(rq, p, WF_FORK);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先，我们需要将进程的状态设置为TASK_RUNNING。</p><p>activate_task函数中会调用enqueue_task。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void enqueue_task(struct rq *rq, struct task_struct *p, int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>	p-&amp;gt;sched_class-&amp;gt;enqueue_task(rq, p, flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果是CFS的调度类，则执行相应的enqueue_task_fair。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void</span></span>
<span class="line"><span>enqueue_task_fair(struct rq *rq, struct task_struct *p, int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cfs_rq *cfs_rq;</span></span>
<span class="line"><span>	struct sched_entity *se = &amp;p-&amp;gt;se;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	cfs_rq = cfs_rq_of(se);</span></span>
<span class="line"><span>	enqueue_entity(cfs_rq, se, flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	cfs_rq-&amp;gt;h_nr_running++;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在enqueue_task_fair中取出的队列就是cfs_rq，然后调用enqueue_entity。</p><p>在enqueue_entity函数里面，会调用update_curr，更新运行的统计量，然后调用__enqueue_entity，将sched_entity加入到红黑树里面，然后将se-&gt;on_rq = 1设置在队列上。</p><p>回到enqueue_task_fair后，将这个队列上运行的进程数目加一。然后，wake_up_new_task会调用check_preempt_curr，看是否能够抢占当前进程。</p><p>在check_preempt_curr中，会调用相应的调度类的rq-&gt;curr-&gt;sched_class-&gt;check_preempt_curr(rq, p, flags)。对于CFS调度类来讲，调用的是check_preempt_wakeup。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void check_preempt_wakeup(struct rq *rq, struct task_struct *p, int wake_flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *curr = rq-&amp;gt;curr;</span></span>
<span class="line"><span>	struct sched_entity *se = &amp;curr-&amp;gt;se, *pse = &amp;p-&amp;gt;se;</span></span>
<span class="line"><span>	struct cfs_rq *cfs_rq = task_cfs_rq(curr);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (test_tsk_need_resched(curr))</span></span>
<span class="line"><span>		return;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	find_matching_se(&amp;se, &amp;pse);</span></span>
<span class="line"><span>	update_curr(cfs_rq_of(se));</span></span>
<span class="line"><span>	if (wakeup_preempt_entity(se, pse) == 1) {</span></span>
<span class="line"><span>		goto preempt;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return;</span></span>
<span class="line"><span>preempt:</span></span>
<span class="line"><span>	resched_curr(rq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在check_preempt_wakeup函数中，前面调用task_fork_fair的时候，设置sysctl_sched_child_runs_first了，已经将当前父进程的TIF_NEED_RESCHED设置了，则直接返回。</p><p>否则，check_preempt_wakeup还是会调用update_curr更新一次统计量，然后wakeup_preempt_entity将父进程和子进程PK一次，看是不是要抢占，如果要则调用resched_curr标记父进程为TIF_NEED_RESCHED。</p><p>如果新创建的进程应该抢占父进程，在什么时间抢占呢？别忘了fork是一个系统调用，从系统调用返回的时候，是抢占的一个好时机，如果父进程判断自己已经被设置为TIF_NEED_RESCHED，就让子进程先跑，抢占自己。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>好了，fork系统调用的过程咱们就解析完了。它包含两个重要的事件，一个是将task_struct结构复制一份并且初始化，另一个是试图唤醒新创建的子进程。</p><p>这个过程我画了一张图，你可以对照着这张图回顾进程创建的过程。</p><p>这个图的上半部分是复制task_struct结构，你可以对照着右面的task_struct结构图，看这里面的成员是如何一部分一部分地被复制的。图的下半部分是唤醒新创建的子进程，如果条件满足，就会将当前进程设置应该被调度的标识位，就等着当前进程执行__schedule了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94064/9d9c5779436da40cabf8e8599eb85558.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94064/9d9c5779436da40cabf8e8599eb85558.jpeg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你可以试着设置sysctl_sched_child_runs_first参数，然后使用系统调用写程序创建进程，看看执行结果。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94064/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94064/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,64)])])}const g=a(e,[["render",l]]);export{u as __pageData,g as default};
