import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"42 | IPC（下）：不同项目组之间抢资源，如何协调？","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/42-IPC（下）：不同项目组之间抢资源，如何协调？.md","filePath":"趣谈Linux操作系统/42-IPC（下）：不同项目组之间抢资源，如何协调？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/42-IPC（下）：不同项目组之间抢资源，如何协调？.md"};function l(i,s,c,m,o,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_42-ipc-下-不同项目组之间抢资源-如何协调" tabindex="-1">42 | IPC（下）：不同项目组之间抢资源，如何协调？ <a class="header-anchor" href="#_42-ipc-下-不同项目组之间抢资源-如何协调" aria-label="Permalink to &quot;42 | IPC（下）：不同项目组之间抢资源，如何协调？&quot;">​</a></h1><p>IPC这块的内容比较多，为了让你能够更好地理解，我分成了三节来讲。前面我们解析完了共享内存的内核机制后，今天我们来看最后一部分，信号量的内核机制。</p><p>首先，我们需要创建一个信号量，调用的是系统调用semget。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(semget, key_t, key, int, nsems, int, semflg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct ipc_namespace *ns;</span></span>
<span class="line"><span>	static const struct ipc_ops sem_ops = {</span></span>
<span class="line"><span>		.getnew = newary,</span></span>
<span class="line"><span>		.associate = sem_security,</span></span>
<span class="line"><span>		.more_checks = sem_more_checks,</span></span>
<span class="line"><span>	};</span></span>
<span class="line"><span>	struct ipc_params sem_params;</span></span>
<span class="line"><span>	ns = current-&amp;gt;nsproxy-&amp;gt;ipc_ns;</span></span>
<span class="line"><span>	sem_params.key = key;</span></span>
<span class="line"><span>	sem_params.flg = semflg;</span></span>
<span class="line"><span>	sem_params.u.nsems = nsems;</span></span>
<span class="line"><span>	return ipcget(ns, &amp;sem_ids(ns), &amp;sem_ops, &amp;sem_params);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们解析过了共享内存，再看信号量，就顺畅很多了。这里同样调用了抽象的ipcget，参数分别为信号量对应的sem_ids、对应的操作sem_ops以及对应的参数sem_params。</p><p>ipcget的代码我们已经解析过了。如果key设置为IPC_PRIVATE则永远创建新的；如果不是的话，就会调用ipcget_public。</p><p>在ipcget_public中，我们能会按照key，去查找struct kern_ipc_perm。如果没有找到，那就看看是否设置了IPC_CREAT。如果设置了，就创建一个新的。如果找到了，就将对应的id返回。</p><p>我们这里重点看，如何按照参数sem_ops，创建新的信号量会调用newary。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int newary(struct ipc_namespace *ns, struct ipc_params *params)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int retval;</span></span>
<span class="line"><span>	struct sem_array *sma;</span></span>
<span class="line"><span>	key_t key = params-&amp;gt;key;</span></span>
<span class="line"><span>	int nsems = params-&amp;gt;u.nsems;</span></span>
<span class="line"><span>	int semflg = params-&amp;gt;flg;</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sma = sem_alloc(nsems);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sma-&amp;gt;sem_perm.mode = (semflg &amp; S_IRWXUGO);</span></span>
<span class="line"><span>	sma-&amp;gt;sem_perm.key = key;</span></span>
<span class="line"><span>	sma-&amp;gt;sem_perm.security = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; nsems; i++) {</span></span>
<span class="line"><span>		INIT_LIST_HEAD(&amp;sma-&amp;gt;sems[i].pending_alter);</span></span>
<span class="line"><span>		INIT_LIST_HEAD(&amp;sma-&amp;gt;sems[i].pending_const);</span></span>
<span class="line"><span>		spin_lock_init(&amp;sma-&amp;gt;sems[i].lock);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	sma-&amp;gt;complex_count = 0;</span></span>
<span class="line"><span>	sma-&amp;gt;use_global_lock = USE_GLOBAL_LOCK_HYSTERESIS;</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;sma-&amp;gt;pending_alter);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;sma-&amp;gt;pending_const);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;sma-&amp;gt;list_id);</span></span>
<span class="line"><span>	sma-&amp;gt;sem_nsems = nsems;</span></span>
<span class="line"><span>	sma-&amp;gt;sem_ctime = get_seconds();</span></span>
<span class="line"><span>	retval = ipc_addid(&amp;sem_ids(ns), &amp;sma-&amp;gt;sem_perm, ns-&amp;gt;sc_semmni);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ns-&amp;gt;used_sems += nsems;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return sma-&amp;gt;sem_perm.id;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>newary函数的第一步，通过kvmalloc在直接映射区分配一个struct sem_array结构。这个结构是用来描述信号量的，这个结构最开始就是上面说的struct kern_ipc_perm结构。接下来就是填充这个struct sem_array结构，例如key、权限等。</p><p>struct sem_array里有多个信号量，放在struct sem sems[]数组里面，在struct sem里面有当前的信号量的数值semval。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sem {</span></span>
<span class="line"><span>	int	semval;		/* current value */</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * PID of the process that last modified the semaphore. For</span></span>
<span class="line"><span>	 * Linux, specifically these are:</span></span>
<span class="line"><span>	 *  - semop</span></span>
<span class="line"><span>	 *  - semctl, via SETVAL and SETALL.</span></span>
<span class="line"><span>	 *  - at task exit when performing undo adjustments (see exit_sem).</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	int	sempid;</span></span>
<span class="line"><span>	spinlock_t	lock;	/* spinlock for fine-grained semtimedop */</span></span>
<span class="line"><span>	struct list_head pending_alter; /* pending single-sop operations that alter the semaphore */</span></span>
<span class="line"><span>	struct list_head pending_const; /* pending single-sop operations that do not alter the semaphore*/</span></span>
<span class="line"><span>	time_t	sem_otime;	/* candidate for sem_otime */</span></span>
<span class="line"><span>} ____cacheline_aligned_in_smp;</span></span></code></pre></div><p>struct sem_array和struct sem各有一个链表struct list_head pending_alter，分别表示对于整个信号量数组的修改和对于某个信号量的修改。</p><p>newary函数的第二步，就是初始化这些链表。</p><p>newary函数的第三步，通过ipc_addid将新创建的struct sem_array结构，挂到sem_ids里面的基数树上，并返回相应的id。</p><p>信号量创建的过程到此结束，接下来我们来看，如何通过semctl对信号量数组进行初始化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE4(semctl, int, semid, int, semnum, int, cmd, unsigned long, arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int version;</span></span>
<span class="line"><span>	struct ipc_namespace *ns;</span></span>
<span class="line"><span>	void __user *p = (void __user *)arg;</span></span>
<span class="line"><span>	ns = current-&amp;gt;nsproxy-&amp;gt;ipc_ns;</span></span>
<span class="line"><span>	switch (cmd) {</span></span>
<span class="line"><span>	case IPC_INFO:</span></span>
<span class="line"><span>	case SEM_INFO:</span></span>
<span class="line"><span>	case IPC_STAT:</span></span>
<span class="line"><span>	case SEM_STAT:</span></span>
<span class="line"><span>		return semctl_nolock(ns, semid, cmd, version, p);</span></span>
<span class="line"><span>	case GETALL:</span></span>
<span class="line"><span>	case GETVAL:</span></span>
<span class="line"><span>	case GETPID:</span></span>
<span class="line"><span>	case GETNCNT:</span></span>
<span class="line"><span>	case GETZCNT:</span></span>
<span class="line"><span>	case SETALL:</span></span>
<span class="line"><span>		return semctl_main(ns, semid, semnum, cmd, p);</span></span>
<span class="line"><span>	case SETVAL:</span></span>
<span class="line"><span>		return semctl_setval(ns, semid, semnum, arg);</span></span>
<span class="line"><span>	case IPC_RMID:</span></span>
<span class="line"><span>	case IPC_SET:</span></span>
<span class="line"><span>		return semctl_down(ns, semid, cmd, version, p);</span></span>
<span class="line"><span>	default:</span></span>
<span class="line"><span>		return -EINVAL;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们重点看，SETALL操作调用的semctl_main函数，以及SETVAL操作调用的semctl_setval函数。</p><p>对于SETALL操作来讲，传进来的参数为union semun里面的unsigned short *array，会设置整个信号量集合。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int semctl_main(struct ipc_namespace *ns, int semid, int semnum,</span></span>
<span class="line"><span>		int cmd, void __user *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sem_array *sma;</span></span>
<span class="line"><span>	struct sem *curr;</span></span>
<span class="line"><span>	int err, nsems;</span></span>
<span class="line"><span>	ushort fast_sem_io[SEMMSL_FAST];</span></span>
<span class="line"><span>	ushort *sem_io = fast_sem_io;</span></span>
<span class="line"><span>	DEFINE_WAKE_Q(wake_q);</span></span>
<span class="line"><span>	sma = sem_obtain_object_check(ns, semid);</span></span>
<span class="line"><span>	nsems = sma-&amp;gt;sem_nsems;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch (cmd) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case SETALL:</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		int i;</span></span>
<span class="line"><span>		struct sem_undo *un;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (copy_from_user(sem_io, p, nsems*sizeof(ushort))) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		for (i = 0; i &amp;lt; nsems; i++) {</span></span>
<span class="line"><span>			sma-&amp;gt;sems[i].semval = sem_io[i];</span></span>
<span class="line"><span>			sma-&amp;gt;sems[i].sempid = task_tgid_vnr(current);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		sma-&amp;gt;sem_ctime = get_seconds();</span></span>
<span class="line"><span>		/* maybe some queued-up processes were waiting for this */</span></span>
<span class="line"><span>		do_smart_update(sma, NULL, 0, 0, &amp;wake_q);</span></span>
<span class="line"><span>		err = 0;</span></span>
<span class="line"><span>		goto out_unlock;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    wake_up_q(&amp;wake_q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在semctl_main函数中，先是通过sem_obtain_object_check，根据信号量集合的id在基数树里面找到struct sem_array对象，发现如果是SETALL操作，就将用户的参数中的unsigned short *array通过copy_from_user拷贝到内核里面的sem_io数组，然后是一个循环，对于信号量集合里面的每一个信号量，设置semval，以及修改这个信号量值的pid。</p><p>对于SETVAL操作来讲，传进来的参数union semun里面的int val，仅仅会设置某个信号量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int semctl_setval(struct ipc_namespace *ns, int semid, int semnum,</span></span>
<span class="line"><span>		unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sem_undo *un;</span></span>
<span class="line"><span>	struct sem_array *sma;</span></span>
<span class="line"><span>	struct sem *curr;</span></span>
<span class="line"><span>	int err, val;</span></span>
<span class="line"><span>	DEFINE_WAKE_Q(wake_q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sma = sem_obtain_object_check(ns, semid);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	curr = &amp;sma-&amp;gt;sems[semnum];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	curr-&amp;gt;semval = val;</span></span>
<span class="line"><span>	curr-&amp;gt;sempid = task_tgid_vnr(current);</span></span>
<span class="line"><span>	sma-&amp;gt;sem_ctime = get_seconds();</span></span>
<span class="line"><span>	/* maybe some queued-up processes were waiting for this */</span></span>
<span class="line"><span>	do_smart_update(sma, NULL, 0, 0, &amp;wake_q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	wake_up_q(&amp;wake_q);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在semctl_setval函数中，我们先是通过sem_obtain_object_check，根据信号量集合的id在基数树里面找到struct sem_array对象，对于SETVAL操作，直接根据参数中的val设置semval，以及修改这个信号量值的pid。</p><p>至此，信号量数组初始化完毕。接下来我们来看P操作和V操作。无论是P操作，还是V操作都是调用semop系统调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(semop, int, semid, struct sembuf __user *, tsops,</span></span>
<span class="line"><span>		unsigned, nsops)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return sys_semtimedop(semid, tsops, nsops, NULL);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYSCALL_DEFINE4(semtimedop, int, semid, struct sembuf __user *, tsops,</span></span>
<span class="line"><span>		unsigned, nsops, const struct timespec __user *, timeout)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error = -EINVAL;</span></span>
<span class="line"><span>	struct sem_array *sma;</span></span>
<span class="line"><span>	struct sembuf fast_sops[SEMOPM_FAST];</span></span>
<span class="line"><span>	struct sembuf *sops = fast_sops, *sop;</span></span>
<span class="line"><span>	struct sem_undo *un;</span></span>
<span class="line"><span>	int max, locknum;</span></span>
<span class="line"><span>	bool undos = false, alter = false, dupsop = false;</span></span>
<span class="line"><span>	struct sem_queue queue;</span></span>
<span class="line"><span>	unsigned long dup = 0, jiffies_left = 0;</span></span>
<span class="line"><span>	struct ipc_namespace *ns;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ns = current-&amp;gt;nsproxy-&amp;gt;ipc_ns;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (copy_from_user(sops, tsops, nsops * sizeof(*tsops))) {</span></span>
<span class="line"><span>		error =  -EFAULT;</span></span>
<span class="line"><span>		goto out_free;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (timeout) {</span></span>
<span class="line"><span>		struct timespec _timeout;</span></span>
<span class="line"><span>		if (copy_from_user(&amp;_timeout, timeout, sizeof(*timeout))) {</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		jiffies_left = timespec_to_jiffies(&amp;_timeout);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* On success, find_alloc_undo takes the rcu_read_lock */</span></span>
<span class="line"><span>	un = find_alloc_undo(ns, semid);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sma = sem_obtain_object_check(ns, semid);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	queue.sops = sops;</span></span>
<span class="line"><span>	queue.nsops = nsops;</span></span>
<span class="line"><span>	queue.undo = un;</span></span>
<span class="line"><span>	queue.pid = task_tgid_vnr(current);</span></span>
<span class="line"><span>	queue.alter = alter;</span></span>
<span class="line"><span>	queue.dupsop = dupsop;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = perform_atomic_semop(sma, &amp;queue);</span></span>
<span class="line"><span>	if (error == 0) { /* non-blocking succesfull path */</span></span>
<span class="line"><span>		DEFINE_WAKE_Q(wake_q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		do_smart_update(sma, sops, nsops, 1, &amp;wake_q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		wake_up_q(&amp;wake_q);</span></span>
<span class="line"><span>		goto out_free;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * We need to sleep on this operation, so we put the current</span></span>
<span class="line"><span>	 * task into the pending queue and go to sleep.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	if (nsops == 1) {</span></span>
<span class="line"><span>		struct sem *curr;</span></span>
<span class="line"><span>		curr = &amp;sma-&amp;gt;sems[sops-&amp;gt;sem_num];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		list_add_tail(&amp;queue.list,</span></span>
<span class="line"><span>						&amp;curr-&amp;gt;pending_alter);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		list_add_tail(&amp;queue.list, &amp;sma-&amp;gt;pending_alter);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		queue.status = -EINTR;</span></span>
<span class="line"><span>		queue.sleeper = current;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		__set_current_state(TASK_INTERRUPTIBLE);</span></span>
<span class="line"><span>		if (timeout)</span></span>
<span class="line"><span>			jiffies_left = schedule_timeout(jiffies_left);</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			schedule();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/*</span></span>
<span class="line"><span>		 * If an interrupt occurred we have to clean up the queue.</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		if (timeout &amp;&amp; jiffies_left == 0)</span></span>
<span class="line"><span>			error = -EAGAIN;</span></span>
<span class="line"><span>	} while (error == -EINTR &amp;&amp; !signal_pending(current)); /* spurious */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>semop会调用semtimedop，这是一个非常复杂的函数。</p><p>semtimedop做的第一件事情，就是将用户的参数，例如，对于信号量的操作struct sembuf，拷贝到内核里面来。另外，如果是P操作，很可能让进程进入等待状态，是否要为这个等待状态设置一个超时，timeout也是一个参数，会把它变成时钟的滴答数目。</p><p>semtimedop做的第二件事情，是通过sem_obtain_object_check，根据信号量集合的id，获得struct sem_array，然后，创建一个struct sem_queue表示当前的信号量操作。为什么叫queue呢？因为这个操作可能马上就能完成，也可能因为无法获取信号量不能完成，不能完成的话就只好排列到队列上，等待信号量满足条件的时候。semtimedop会调用perform_atomic_semop在实施信号量操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int perform_atomic_semop(struct sem_array *sma, struct sem_queue *q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int result, sem_op, nsops;</span></span>
<span class="line"><span>	struct sembuf *sop;</span></span>
<span class="line"><span>	struct sem *curr;</span></span>
<span class="line"><span>	struct sembuf *sops;</span></span>
<span class="line"><span>	struct sem_undo *un;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sops = q-&amp;gt;sops;</span></span>
<span class="line"><span>	nsops = q-&amp;gt;nsops;</span></span>
<span class="line"><span>	un = q-&amp;gt;undo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for (sop = sops; sop &amp;lt; sops + nsops; sop++) {</span></span>
<span class="line"><span>		curr = &amp;sma-&amp;gt;sems[sop-&amp;gt;sem_num];</span></span>
<span class="line"><span>		sem_op = sop-&amp;gt;sem_op;</span></span>
<span class="line"><span>		result = curr-&amp;gt;semval;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		result += sem_op;</span></span>
<span class="line"><span>		if (result &amp;lt; 0)</span></span>
<span class="line"><span>			goto would_block;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (sop-&amp;gt;sem_flg &amp; SEM_UNDO) {</span></span>
<span class="line"><span>			int undo = un-&amp;gt;semadj[sop-&amp;gt;sem_num] - sem_op;</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for (sop = sops; sop &amp;lt; sops + nsops; sop++) {</span></span>
<span class="line"><span>		curr = &amp;sma-&amp;gt;sems[sop-&amp;gt;sem_num];</span></span>
<span class="line"><span>		sem_op = sop-&amp;gt;sem_op;</span></span>
<span class="line"><span>		result = curr-&amp;gt;semval;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (sop-&amp;gt;sem_flg &amp; SEM_UNDO) {</span></span>
<span class="line"><span>			int undo = un-&amp;gt;semadj[sop-&amp;gt;sem_num] - sem_op;</span></span>
<span class="line"><span>			un-&amp;gt;semadj[sop-&amp;gt;sem_num] = undo;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		curr-&amp;gt;semval += sem_op;</span></span>
<span class="line"><span>		curr-&amp;gt;sempid = q-&amp;gt;pid;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>would_block:</span></span>
<span class="line"><span>	q-&amp;gt;blocking = sop;</span></span>
<span class="line"><span>	return sop-&amp;gt;sem_flg &amp; IPC_NOWAIT ? -EAGAIN : 1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在perform_atomic_semop函数中，对于所有信号量操作都进行两次循环。在第一次循环中，如果发现计算出的result小于0，则说明必须等待，于是跳到would_block中，设置q-&gt;blocking = sop表示这个queue是block在这个操作上，然后如果需要等待，则返回1。如果第一次循环中发现无需等待，则第二个循环实施所有的信号量操作，将信号量的值设置为新的值，并且返回0。</p><p>接下来，我们回到semtimedop，来看它干的第三件事情，就是如果需要等待，应该怎么办？</p><p>如果需要等待，则要区分刚才的对于信号量的操作，是对一个信号量的，还是对于整个信号量集合的。如果是对于一个信号量的，那我们就将queue挂到这个信号量的pending_alter中；如果是对于整个信号量集合的，那我们就将queue挂到整个信号量集合的pending_alter中。</p><p>接下来的do-while循环，就是要开始等待了。如果等待没有时间限制，则调用schedule让出CPU；如果等待有时间限制，则调用schedule_timeout让出CPU，过一段时间还回来。当回来的时候，判断是否等待超时，如果没有等待超时则进入下一轮循环，再次等待，如果超时则退出循环，返回错误。在让出CPU的时候，设置进程的状态为TASK_INTERRUPTIBLE，并且循环的结束会通过signal_pending查看是否收到过信号，这说明这个等待信号量的进程是可以被信号中断的，也即一个等待信号量的进程是可以通过kill杀掉的。</p><p>我们再来看，semtimedop要做的第四件事情，如果不需要等待，应该怎么办？</p><p>如果不需要等待，就说明对于信号量的操作完成了，也改变了信号量的值。接下来，就是一个标准流程。我们通过DEFINE_WAKE_Q(wake_q)声明一个wake_q，调用do_smart_update，看这次对于信号量的值的改变，可以影响并可以激活等待队列中的哪些struct sem_queue，然后把它们都放在wake_q里面，调用wake_up_q唤醒这些进程。其实，所有的对于信号量的值的修改都会涉及这三个操作，如果你回过头去仔细看SETALL和SETVAL操作，在设置完毕信号量之后，也是这三个操作。</p><p>我们来看do_smart_update是如何实现的。do_smart_update会调用update_queue。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int update_queue(struct sem_array *sma, int semnum, struct wake_q_head *wake_q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sem_queue *q, *tmp;</span></span>
<span class="line"><span>	struct list_head *pending_list;</span></span>
<span class="line"><span>	int semop_completed = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (semnum == -1)</span></span>
<span class="line"><span>		pending_list = &amp;sma-&amp;gt;pending_alter;</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		pending_list = &amp;sma-&amp;gt;sems[semnum].pending_alter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>again:</span></span>
<span class="line"><span>	list_for_each_entry_safe(q, tmp, pending_list, list) {</span></span>
<span class="line"><span>		int error, restart;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		error = perform_atomic_semop(sma, q);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		/* Does q-&amp;gt;sleeper still need to sleep? */</span></span>
<span class="line"><span>		if (error &amp;gt; 0)</span></span>
<span class="line"><span>			continue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		unlink_queue(sma, q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		wake_up_sem_queue_prepare(q, error, wake_q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return semop_completed;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void wake_up_sem_queue_prepare(struct sem_queue *q, int error,</span></span>
<span class="line"><span>					     struct wake_q_head *wake_q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	wake_q_add(wake_q, q-&amp;gt;sleeper);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>update_queue会依次循环整个信号量集合的等待队列pending_alter，或者某个信号量的等待队列。试图在信号量的值变了的情况下，再次尝试perform_atomic_semop进行信号量操作。如果不成功，则尝试队列中的下一个；如果尝试成功，则调用unlink_queue从队列上取下来，然后调用wake_up_sem_queue_prepare，将q-&gt;sleeper加到wake_q上去。q-&gt;sleeper是一个task_struct，是等待在这个信号量操作上的进程。</p><p>接下来，wake_up_q就依次唤醒wake_q上的所有task_struct，调用的是我们在进程调度那一节学过的wake_up_process方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void wake_up_q(struct wake_q_head *head)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct wake_q_node *node = head-&amp;gt;first;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	while (node != WAKE_Q_TAIL) {</span></span>
<span class="line"><span>		struct task_struct *task;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		task = container_of(node, struct task_struct, wake_q);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		node = node-&amp;gt;next;</span></span>
<span class="line"><span>		task-&amp;gt;wake_q.next = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		wake_up_process(task);</span></span>
<span class="line"><span>		put_task_struct(task);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此，对于信号量的主流操作都解析完毕了。</p><p>其实还有一点需要强调一下，信号量是一个整个Linux可见的全局资源，而不像咱们在线程同步那一节讲过的都是某个进程独占的资源，好处是可以跨进程通信，坏处就是如果一个进程通过P操作拿到了一个信号量，但是不幸异常退出了，如果没有来得及归还这个信号量，可能所有其他的进程都阻塞了。</p><p>那怎么办呢？Linux有一种机制叫SEM_UNDO，也即每一个semop操作都会保存一个反向struct sem_undo操作，当因为某个进程异常退出的时候，这个进程做的所有的操作都会回退，从而保证其他进程可以正常工作。</p><p>如果你回头看，我们写的程序里面的semaphore_p函数和semaphore_v函数，都把sem_flg设置为SEM_UNDO，就是这个作用。</p><p>等待队列上的每一个struct sem_queue，都有一个struct sem_undo，以此来表示这次操作的反向操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sem_queue {</span></span>
<span class="line"><span>	struct list_head	list;	 /* queue of pending operations */</span></span>
<span class="line"><span>	struct task_struct	*sleeper; /* this process */</span></span>
<span class="line"><span>	struct sem_undo		*undo;	 /* undo structure */</span></span>
<span class="line"><span>	int			pid;	 /* process id of requesting process */</span></span>
<span class="line"><span>	int			status;	 /* completion status of operation */</span></span>
<span class="line"><span>	struct sembuf		*sops;	 /* array of pending operations */</span></span>
<span class="line"><span>	struct sembuf		*blocking; /* the operation that blocked */</span></span>
<span class="line"><span>	int			nsops;	 /* number of operations */</span></span>
<span class="line"><span>	bool			alter;	 /* does *sops alter the array? */</span></span>
<span class="line"><span>	bool                    dupsop;	 /* sops on more than one sem_num */</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在进程的task_struct里面对于信号量有一个成员struct sysv_sem，里面是一个struct sem_undo_list，将这个进程所有的semop所带来的undo操作都串起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct task_struct {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>struct sysv_sem			sysvsem;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct sysv_sem {</span></span>
<span class="line"><span>	struct sem_undo_list *undo_list;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct sem_undo {</span></span>
<span class="line"><span>	struct list_head	list_proc;	/* per-process list: *</span></span>
<span class="line"><span>						 * all undos from one process</span></span>
<span class="line"><span>						 * rcu protected */</span></span>
<span class="line"><span>	struct rcu_head		rcu;		/* rcu struct for sem_undo */</span></span>
<span class="line"><span>	struct sem_undo_list	*ulp;		/* back ptr to sem_undo_list */</span></span>
<span class="line"><span>	struct list_head	list_id;	/* per semaphore array list:</span></span>
<span class="line"><span>						 * all undos for one array */</span></span>
<span class="line"><span>	int			semid;		/* semaphore set identifier */</span></span>
<span class="line"><span>	short			*semadj;	/* array of adjustments */</span></span>
<span class="line"><span>						/* one per semaphore */</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct sem_undo_list {</span></span>
<span class="line"><span>	atomic_t		refcnt;</span></span>
<span class="line"><span>	spinlock_t		lock;</span></span>
<span class="line"><span>	struct list_head	list_proc;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>为了让你更清楚地理解struct sem_undo的原理，我们这里举一个例子。</p><p>假设我们创建了两个信号量集合。一个叫semaphore1，它包含三个信号量，初始化值为3，另一个叫semaphore2，它包含4个信号量，初始化值都为4。初始化时候的信号量以及undo结构里面的值如图中(1)标号所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104273/0352227c5f49d194b6094f229220cdd6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104273/0352227c5f49d194b6094f229220cdd6.png" alt=""></a></p><p>首先，我们来看进程1。我们调用semop，将semaphore1的三个信号量的值，分别加1、加2和减3，从而信号量的值变为4,5,0。于是在semaphore1和进程1链表交汇的undo结构里面，填写-1,-2,+3，是semop操作的反向操作，如图中(2)标号所示。</p><p>然后，我们来看进程2。我们调用semop，将semaphore1的三个信号量的值，分别减3、加2和加1，从而信号量的值变为1、7、1。于是在semaphore1和进程2链表交汇的undo结构里面，填写+3、-2、-1，是semop操作的反向操作，如图中(3)标号所示。</p><p>然后，我们接着看进程2。我们调用semop，将semaphore2的四个信号量的值，分别减3、加1、加4和减1，从而信号量的值变为1、5、8、3。于是，在semaphore2和进程2链表交汇的undo结构里面，填写+3、-1、-4、+1，是semop操作的反向操作，如图中(4)标号所示。</p><p>然后，我们再来看进程1。我们调用semop，将semaphore2的四个信号量的值，分别减1、减4、减5和加2，从而信号量的值变为0、1、3、5。于是在semaphore2和进程1链表交汇的undo结构里面，填写+1、+4、+5、-2，是semop操作的反向操作，如图中(5)标号所示。</p><p>从这个例子可以看出，无论哪个进程异常退出，只要将undo结构里面的值加回当前信号量的值，就能够得到正确的信号量的值，不会因为一个进程退出，导致信号量的值处于不一致的状态。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>信号量的机制也很复杂，我们对着下面这个图总结一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104273/6028c83b0aa00e65916988911aa01b7c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104273/6028c83b0aa00e65916988911aa01b7c.png" alt=""></a></p><ol><li>调用semget创建信号量集合。</li><li>ipc_findkey会在基数树中，根据key查找信号量集合sem_array对象。如果已经被创建，就会被查询出来。例如producer被创建过，在consumer中就会查询出来。</li><li>如果信号量集合没有被创建过，则调用sem_ops的newary方法，创建一个信号量集合对象sem_array。例如，在producer中就会新建。</li><li>调用semctl(SETALL)初始化信号量。</li><li>sem_obtain_object_check先从基数树里面找到sem_array对象。</li><li>根据用户指定的信号量数组，初始化信号量集合，也即初始化sem_array对象的struct sem sems[]成员。</li><li>调用semop操作信号量。</li><li>创建信号量操作结构sem_queue，放入队列。</li><li>创建undo结构，放入链表。</li></ol><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>现在，我们的共享内存、信号量、消息队列都讲完了，你是不是觉得，它们的API非常相似。为了方便记忆，你可以自己整理一个表格，列一下这三种进程间通信机制、行为创建xxxget、使用、控制xxxctl、对应的API和系统调用。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>`,64)])])}const d=n(t,[["render",l]]);export{_ as __pageData,d as default};
