import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"41 | IPC（中）：不同项目组之间抢资源，如何协调？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何创建共享内存？","slug":"如何创建共享内存","link":"#如何创建共享内存","children":[]},{"level":2,"title":"如何将共享内存映射到虚拟地址空间？","slug":"如何将共享内存映射到虚拟地址空间","link":"#如何将共享内存映射到虚拟地址空间","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/41-IPC（中）：不同项目组之间抢资源，如何协调？.md","filePath":"趣谈Linux操作系统/41-IPC（中）：不同项目组之间抢资源，如何协调？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/41-IPC（中）：不同项目组之间抢资源，如何协调？.md"};function l(i,s,c,m,_,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_41-ipc-中-不同项目组之间抢资源-如何协调" tabindex="-1">41 | IPC（中）：不同项目组之间抢资源，如何协调？ <a class="header-anchor" href="#_41-ipc-中-不同项目组之间抢资源-如何协调" aria-label="Permalink to &quot;41 | IPC（中）：不同项目组之间抢资源，如何协调？&quot;">​</a></h1><p>了解了如何使用共享内存和信号量集合之后，今天我们来解析一下，内核里面都做了什么。</p><p>不知道你有没有注意到，咱们讲消息队列、共享内存、信号量的机制的时候，我们其实能够从中看到一些统一的规律： <strong>它们在使用之前都要生成key，然后通过key得到唯一的id，并且都是通过xxxget函数。</strong></p><p>在内核里面，这三种进程间通信机制是使用统一的机制管理起来的，都叫ipcxxx。</p><p>为了维护这三种进程间通信进制，在内核里面，我们声明了一个有三项的数组。</p><p>我们通过这段代码，来具体看一看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct ipc_namespace {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct ipc_ids	ids[3];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define IPC_SEM_IDS	0</span></span>
<span class="line"><span>#define IPC_MSG_IDS	1</span></span>
<span class="line"><span>#define IPC_SHM_IDS	2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define sem_ids(ns)	((ns)-&amp;gt;ids[IPC_SEM_IDS])</span></span>
<span class="line"><span>#define msg_ids(ns)	((ns)-&amp;gt;ids[IPC_MSG_IDS])</span></span>
<span class="line"><span>#define shm_ids(ns)	((ns)-&amp;gt;ids[IPC_SHM_IDS])</span></span></code></pre></div><p>根据代码中的定义，第0项用于信号量，第1项用于消息队列，第2项用于共享内存，分别可以通过sem_ids、msg_ids、shm_ids来访问。</p><p>这段代码里面有ns，全称叫namespace。可能不容易理解，你现在可以将它认为是将一台Linux服务器逻辑的隔离为多台Linux服务器的机制，它背后的原理是一个相当大的话题，我们需要在容器那一章详细讲述。现在，你就可以简单的认为没有namespace，整个Linux在一个namespace下面，那这些ids也是整个Linux只有一份。</p><p>接下来，我们再来看struct ipc_ids里面保存了什么。</p><p>首先，in_use表示当前有多少个ipc；其次，seq和next_id用于一起生成ipc唯一的id，因为信号量，共享内存，消息队列，它们三个的id也不能重复；ipcs_idr是一棵基数树，我们又碰到它了，一旦涉及从一个整数查找一个对象，它都是最好的选择。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct ipc_ids {</span></span>
<span class="line"><span>	int in_use;</span></span>
<span class="line"><span>	unsigned short seq;</span></span>
<span class="line"><span>	struct rw_semaphore rwsem;</span></span>
<span class="line"><span>	struct idr ipcs_idr;</span></span>
<span class="line"><span>	int next_id;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct idr {</span></span>
<span class="line"><span>	struct radix_tree_root	idr_rt;</span></span>
<span class="line"><span>	unsigned int		idr_next;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>也就是说，对于sem_ids、msg_ids、shm_ids各有一棵基数树。那这棵树里面究竟存放了什么，能够统一管理这三类ipc对象呢？</p><p>通过下面这个函数ipc_obtain_object_idr，我们可以看出端倪。这个函数根据id，在基数树里面找出来的是struct kern_ipc_perm。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct kern_ipc_perm *ipc_obtain_object_idr(struct ipc_ids *ids, int id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kern_ipc_perm *out;</span></span>
<span class="line"><span>	int lid = ipcid_to_idx(id);</span></span>
<span class="line"><span>	out = idr_find(&amp;ids-&amp;gt;ipcs_idr, lid);</span></span>
<span class="line"><span>	return out;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果我们看用于表示信号量、消息队列、共享内存的结构，就会发现，这三个结构的第一项都是struct kern_ipc_perm。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sem_array {</span></span>
<span class="line"><span>	struct kern_ipc_perm	sem_perm;	/* permissions .. see ipc.h */</span></span>
<span class="line"><span>	time_t			sem_ctime;	/* create/last semctl() time */</span></span>
<span class="line"><span>	struct list_head	pending_alter;	/* pending operations */</span></span>
<span class="line"><span>						                /* that alter the array */</span></span>
<span class="line"><span>	struct list_head	pending_const;	/* pending complex operations */</span></span>
<span class="line"><span>						/* that do not alter semvals */</span></span>
<span class="line"><span>	struct list_head	list_id;	/* undo requests on this array */</span></span>
<span class="line"><span>	int			sem_nsems;	/* no. of semaphores in array */</span></span>
<span class="line"><span>	int			complex_count;	/* pending complex operations */</span></span>
<span class="line"><span>	unsigned int		use_global_lock;/* &amp;gt;0: global lock required */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct sem		sems[];</span></span>
<span class="line"><span>} __randomize_layout;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct msg_queue {</span></span>
<span class="line"><span>	struct kern_ipc_perm q_perm;</span></span>
<span class="line"><span>	time_t q_stime;			/* last msgsnd time */</span></span>
<span class="line"><span>	time_t q_rtime;			/* last msgrcv time */</span></span>
<span class="line"><span>	time_t q_ctime;			/* last change time */</span></span>
<span class="line"><span>	unsigned long q_cbytes;		/* current number of bytes on queue */</span></span>
<span class="line"><span>	unsigned long q_qnum;		/* number of messages in queue */</span></span>
<span class="line"><span>	unsigned long q_qbytes;		/* max number of bytes on queue */</span></span>
<span class="line"><span>	pid_t q_lspid;			/* pid of last msgsnd */</span></span>
<span class="line"><span>	pid_t q_lrpid;			/* last receive pid */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct list_head q_messages;</span></span>
<span class="line"><span>	struct list_head q_receivers;</span></span>
<span class="line"><span>	struct list_head q_senders;</span></span>
<span class="line"><span>} __randomize_layout;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct shmid_kernel /* private to the kernel */</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kern_ipc_perm	shm_perm;</span></span>
<span class="line"><span>	struct file		*shm_file;</span></span>
<span class="line"><span>	unsigned long		shm_nattch;</span></span>
<span class="line"><span>	unsigned long		shm_segsz;</span></span>
<span class="line"><span>	time_t			shm_atim;</span></span>
<span class="line"><span>	time_t			shm_dtim;</span></span>
<span class="line"><span>	time_t			shm_ctim;</span></span>
<span class="line"><span>	pid_t			shm_cprid;</span></span>
<span class="line"><span>	pid_t			shm_lprid;</span></span>
<span class="line"><span>	struct user_struct	*mlock_user;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* The task created the shm object.  NULL if the task is dead. */</span></span>
<span class="line"><span>	struct task_struct	*shm_creator;</span></span>
<span class="line"><span>	struct list_head	shm_clist;	/* list by creator */</span></span>
<span class="line"><span>} __randomize_layout;</span></span></code></pre></div><p>也就是说，我们完全可以通过struct kern_ipc_perm的指针，通过进行强制类型转换后，得到整个结构。做这件事情的函数如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct sem_array *sem_obtain_object(struct ipc_namespace *ns, int id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kern_ipc_perm *ipcp = ipc_obtain_object_idr(&amp;sem_ids(ns), id);</span></span>
<span class="line"><span>	return container_of(ipcp, struct sem_array, sem_perm);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline struct msg_queue *msq_obtain_object(struct ipc_namespace *ns, int id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kern_ipc_perm *ipcp = ipc_obtain_object_idr(&amp;msg_ids(ns), id);</span></span>
<span class="line"><span>	return container_of(ipcp, struct msg_queue, q_perm);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline struct shmid_kernel *shm_obtain_object(struct ipc_namespace *ns, int id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kern_ipc_perm *ipcp = ipc_obtain_object_idr(&amp;shm_ids(ns), id);</span></span>
<span class="line"><span>	return container_of(ipcp, struct shmid_kernel, shm_perm);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过这种机制，我们就可以将信号量、消息队列、共享内存抽象为ipc类型进行统一处理。你有没有觉得，这有点儿面向对象编程中抽象类和实现类的意思？没错，如果你试图去了解C++中类的实现机制，其实也是这么干的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104277/082b742753d862cfeae520fb02aa41af.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104277/082b742753d862cfeae520fb02aa41af.png" alt=""></a></p><p>有了抽象类，接下来我们来看共享内存和信号量的具体实现。</p><h2 id="如何创建共享内存" tabindex="-1">如何创建共享内存？ <a class="header-anchor" href="#如何创建共享内存" aria-label="Permalink to &quot;如何创建共享内存？&quot;">​</a></h2><p>首先，我们来看创建共享内存的的系统调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(shmget, key_t, key, size_t, size, int, shmflg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct ipc_namespace *ns;</span></span>
<span class="line"><span>	static const struct ipc_ops shm_ops = {</span></span>
<span class="line"><span>		.getnew = newseg,</span></span>
<span class="line"><span>		.associate = shm_security,</span></span>
<span class="line"><span>		.more_checks = shm_more_checks,</span></span>
<span class="line"><span>	};</span></span>
<span class="line"><span>	struct ipc_params shm_params;</span></span>
<span class="line"><span>	ns = current-&amp;gt;nsproxy-&amp;gt;ipc_ns;</span></span>
<span class="line"><span>	shm_params.key = key;</span></span>
<span class="line"><span>	shm_params.flg = shmflg;</span></span>
<span class="line"><span>	shm_params.u.size = size;</span></span>
<span class="line"><span>	return ipcget(ns, &amp;shm_ids(ns), &amp;shm_ops, &amp;shm_params);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面调用了抽象的ipcget、参数分别为共享内存对应的shm_ids、对应的操作shm_ops以及对应的参数shm_params。</p><p>如果key设置为IPC_PRIVATE则永远创建新的，如果不是的话，就会调用ipcget_public。ipcget的具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int ipcget(struct ipc_namespace *ns, struct ipc_ids *ids,</span></span>
<span class="line"><span>			const struct ipc_ops *ops, struct ipc_params *params)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (params-&amp;gt;key == IPC_PRIVATE)</span></span>
<span class="line"><span>		return ipcget_new(ns, ids, ops, params);</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		return ipcget_public(ns, ids, ops, params);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int ipcget_public(struct ipc_namespace *ns, struct ipc_ids *ids, const struct ipc_ops *ops, struct ipc_params *params)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kern_ipc_perm *ipcp;</span></span>
<span class="line"><span>	int flg = params-&amp;gt;flg;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	ipcp = ipc_findkey(ids, params-&amp;gt;key);</span></span>
<span class="line"><span>	if (ipcp == NULL) {</span></span>
<span class="line"><span>		if (!(flg &amp; IPC_CREAT))</span></span>
<span class="line"><span>			err = -ENOENT;</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			err = ops-&amp;gt;getnew(ns, params);</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		if (flg &amp; IPC_CREAT &amp;&amp; flg &amp; IPC_EXCL)</span></span>
<span class="line"><span>			err = -EEXIST;</span></span>
<span class="line"><span>		else {</span></span>
<span class="line"><span>			err = 0;</span></span>
<span class="line"><span>			if (ops-&amp;gt;more_checks)</span></span>
<span class="line"><span>				err = ops-&amp;gt;more_checks(ipcp, params);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ipcget_public中，我们会按照key，去查找struct kern_ipc_perm。如果没有找到，那就看是否设置了IPC_CREAT；如果设置了，就创建一个新的。如果找到了，就将对应的id返回。</p><p>我们这里重点看，如何按照参数shm_ops，创建新的共享内存，会调用newseg。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int newseg(struct ipc_namespace *ns, struct ipc_params *params)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	key_t key = params-&amp;gt;key;</span></span>
<span class="line"><span>	int shmflg = params-&amp;gt;flg;</span></span>
<span class="line"><span>	size_t size = params-&amp;gt;u.size;</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	struct shmid_kernel *shp;</span></span>
<span class="line"><span>	size_t numpages = (size + PAGE_SIZE - 1) &amp;gt;&amp;gt; PAGE_SHIFT;</span></span>
<span class="line"><span>	struct file *file;</span></span>
<span class="line"><span>	char name[13];</span></span>
<span class="line"><span>	vm_flags_t acctflag = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	shp = kvmalloc(sizeof(*shp), GFP_KERNEL);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	shp-&amp;gt;shm_perm.key = key;</span></span>
<span class="line"><span>	shp-&amp;gt;shm_perm.mode = (shmflg &amp; S_IRWXUGO);</span></span>
<span class="line"><span>	shp-&amp;gt;mlock_user = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	shp-&amp;gt;shm_perm.security = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file = shmem_kernel_file_setup(name, size, acctflag);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	shp-&amp;gt;shm_cprid = task_tgid_vnr(current);</span></span>
<span class="line"><span>	shp-&amp;gt;shm_lprid = 0;</span></span>
<span class="line"><span>	shp-&amp;gt;shm_atim = shp-&amp;gt;shm_dtim = 0;</span></span>
<span class="line"><span>	shp-&amp;gt;shm_ctim = get_seconds();</span></span>
<span class="line"><span>	shp-&amp;gt;shm_segsz = size;</span></span>
<span class="line"><span>	shp-&amp;gt;shm_nattch = 0;</span></span>
<span class="line"><span>	shp-&amp;gt;shm_file = file;</span></span>
<span class="line"><span>	shp-&amp;gt;shm_creator = current;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = ipc_addid(&amp;shm_ids(ns), &amp;shp-&amp;gt;shm_perm, ns-&amp;gt;shm_ctlmni);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	list_add(&amp;shp-&amp;gt;shm_clist, &amp;current-&amp;gt;sysvshm.shm_clist);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file_inode(file)-&amp;gt;i_ino = shp-&amp;gt;shm_perm.id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ns-&amp;gt;shm_tot += numpages;</span></span>
<span class="line"><span>	error = shp-&amp;gt;shm_perm.id;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return error;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>newseg函数的第一步，通过kvmalloc在直接映射区分配一个struct shmid_kernel结构。</strong> 这个结构就是用来描述共享内存的。这个结构最开始就是上面说的struct kern_ipc_perm结构。接下来就是填充这个struct shmid_kernel结构，例如key、权限等。</p><p><strong>newseg函数的第二步，共享内存需要和文件进行关联</strong>。**为什么要做这个呢？我们在讲内存映射的时候讲过，虚拟地址空间可以和物理内存关联，但是物理内存是某个进程独享的。虚拟地址空间也可以映射到一个文件，文件是可以跨进程共享的。</p><p>咱们这里的共享内存需要跨进程共享，也应该借鉴文件映射的思路。只不过不应该映射一个硬盘上的文件，而是映射到一个内存文件系统上的文件。mm/shmem.c里面就定义了这样一个基于内存的文件系统。这里你一定要注意区分shmem和shm的区别，前者是一个文件系统，后者是进程通信机制。</p><p>在系统初始化的时候，shmem_init注册了shmem文件系统shmem_fs_type，并且挂在到了shm_mnt下面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __init shmem_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	error = shmem_init_inodecache();</span></span>
<span class="line"><span>	error = register_filesystem(&amp;shmem_fs_type);</span></span>
<span class="line"><span>	shm_mnt = kern_mount(&amp;shmem_fs_type);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file_system_type shmem_fs_type = {</span></span>
<span class="line"><span>	.owner		= THIS_MODULE,</span></span>
<span class="line"><span>	.name		= &quot;tmpfs&quot;,</span></span>
<span class="line"><span>	.mount		= shmem_mount,</span></span>
<span class="line"><span>	.kill_sb	= kill_litter_super,</span></span>
<span class="line"><span>	.fs_flags	= FS_USERNS_MOUNT,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>接下来，newseg函数会调用shmem_kernel_file_setup，其实就是在shmem文件系统里面创建一个文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * shmem_kernel_file_setup - get an unlinked file living in tmpfs which must be kernel internal.</span></span>
<span class="line"><span> * &amp;#64;name: name for dentry (to be seen in /proc/&amp;lt;pid&amp;gt;/maps</span></span>
<span class="line"><span> * &amp;#64;size: size to be set for the file</span></span>
<span class="line"><span> * &amp;#64;flags: VM_NORESERVE suppresses pre-accounting of the entire object size */</span></span>
<span class="line"><span>struct file *shmem_kernel_file_setup(const char *name, loff_t size, unsigned long flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return __shmem_file_setup(name, size, flags, S_PRIVATE);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file *__shmem_file_setup(const char *name, loff_t size,</span></span>
<span class="line"><span>				       unsigned long flags, unsigned int i_flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *res;</span></span>
<span class="line"><span>	struct inode *inode;</span></span>
<span class="line"><span>	struct path path;</span></span>
<span class="line"><span>	struct super_block *sb;</span></span>
<span class="line"><span>	struct qstr this;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	this.name = name;</span></span>
<span class="line"><span>	this.len = strlen(name);</span></span>
<span class="line"><span>	this.hash = 0; /* will go */</span></span>
<span class="line"><span>	sb = shm_mnt-&amp;gt;mnt_sb;</span></span>
<span class="line"><span>	path.mnt = mntget(shm_mnt);</span></span>
<span class="line"><span>	path.dentry = d_alloc_pseudo(sb, &amp;this);</span></span>
<span class="line"><span>	d_set_d_op(path.dentry, &amp;anon_ops);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	inode = shmem_get_inode(sb, NULL, S_IFREG | S_IRWXUGO, 0, flags);</span></span>
<span class="line"><span>	inode-&amp;gt;i_flags |= i_flags;</span></span>
<span class="line"><span>	d_instantiate(path.dentry, inode);</span></span>
<span class="line"><span>	inode-&amp;gt;i_size = size;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	res = alloc_file(&amp;path, FMODE_WRITE | FMODE_READ,</span></span>
<span class="line"><span>		  &amp;shmem_file_operations);</span></span>
<span class="line"><span>	return res;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__shmem_file_setup会创建新的shmem文件对应的dentry和inode，并将它们两个关联起来，然后分配一个struct file结构，来表示新的shmem文件，并且指向独特的shmem_file_operations。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct file_operations shmem_file_operations = {</span></span>
<span class="line"><span>	.mmap		= shmem_mmap,</span></span>
<span class="line"><span>	.get_unmapped_area = shmem_get_unmapped_area,</span></span>
<span class="line"><span>#ifdef CONFIG_TMPFS</span></span>
<span class="line"><span>	.llseek		= shmem_file_llseek,</span></span>
<span class="line"><span>	.read_iter	= shmem_file_read_iter,</span></span>
<span class="line"><span>	.write_iter	= generic_file_write_iter,</span></span>
<span class="line"><span>	.fsync		= noop_fsync,</span></span>
<span class="line"><span>	.splice_read	= generic_file_splice_read,</span></span>
<span class="line"><span>	.splice_write	= iter_file_splice_write,</span></span>
<span class="line"><span>	.fallocate	= shmem_fallocate,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>};</span></span></code></pre></div><p><strong>newseg函数的第三步，通过ipc_addid将新创建的struct shmid_kernel结构挂到shm_ids里面的基数树上，并返回相应的id，并且将struct shmid_kernel挂到当前进程的sysvshm队列中。</strong></p><p>至此，共享内存的创建就完成了。</p><h2 id="如何将共享内存映射到虚拟地址空间" tabindex="-1">如何将共享内存映射到虚拟地址空间？ <a class="header-anchor" href="#如何将共享内存映射到虚拟地址空间" aria-label="Permalink to &quot;如何将共享内存映射到虚拟地址空间？&quot;">​</a></h2><p>从上面的代码解析中，我们知道，共享内存的数据结构struct shmid_kernel，是通过它的成员struct file *shm_file，来管理内存文件系统shmem上的内存文件的。无论这个共享内存是否被映射，shm_file都是存在的。</p><p>接下来，我们要将共享内存映射到虚拟地址空间中。调用的是shmat，对应的系统调用如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(shmat, int, shmid, char __user *, shmaddr, int, shmflg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned long ret;</span></span>
<span class="line"><span>    long err;</span></span>
<span class="line"><span>    err = do_shmat(shmid, shmaddr, shmflg, &amp;ret, SHMLBA);</span></span>
<span class="line"><span>    force_successful_syscall_return();</span></span>
<span class="line"><span>    return (long)ret;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long do_shmat(int shmid, char __user *shmaddr, int shmflg,</span></span>
<span class="line"><span>	      ulong *raddr, unsigned long shmlba)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct shmid_kernel *shp;</span></span>
<span class="line"><span>	unsigned long addr = (unsigned long)shmaddr;</span></span>
<span class="line"><span>	unsigned long size;</span></span>
<span class="line"><span>	struct file *file;</span></span>
<span class="line"><span>	int    err;</span></span>
<span class="line"><span>	unsigned long flags = MAP_SHARED;</span></span>
<span class="line"><span>	unsigned long prot;</span></span>
<span class="line"><span>	int acc_mode;</span></span>
<span class="line"><span>	struct ipc_namespace *ns;</span></span>
<span class="line"><span>	struct shm_file_data *sfd;</span></span>
<span class="line"><span>	struct path path;</span></span>
<span class="line"><span>	fmode_t f_mode;</span></span>
<span class="line"><span>	unsigned long populate = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	prot = PROT_READ | PROT_WRITE;</span></span>
<span class="line"><span>	acc_mode = S_IRUGO | S_IWUGO;</span></span>
<span class="line"><span>	f_mode = FMODE_READ | FMODE_WRITE;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ns = current-&amp;gt;nsproxy-&amp;gt;ipc_ns;</span></span>
<span class="line"><span>	shp = shm_obtain_object_check(ns, shmid);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	path = shp-&amp;gt;shm_file-&amp;gt;f_path;</span></span>
<span class="line"><span>	path_get(&amp;path);</span></span>
<span class="line"><span>	shp-&amp;gt;shm_nattch++;</span></span>
<span class="line"><span>	size = i_size_read(d_inode(path.dentry));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sfd = kzalloc(sizeof(*sfd), GFP_KERNEL);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file = alloc_file(&amp;path, f_mode,</span></span>
<span class="line"><span>			  is_file_hugepages(shp-&amp;gt;shm_file) ?</span></span>
<span class="line"><span>				&amp;shm_file_operations_huge :</span></span>
<span class="line"><span>				&amp;shm_file_operations);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file-&amp;gt;private_data = sfd;</span></span>
<span class="line"><span>	file-&amp;gt;f_mapping = shp-&amp;gt;shm_file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>	sfd-&amp;gt;id = shp-&amp;gt;shm_perm.id;</span></span>
<span class="line"><span>	sfd-&amp;gt;ns = get_ipc_ns(ns);</span></span>
<span class="line"><span>	sfd-&amp;gt;file = shp-&amp;gt;shm_file;</span></span>
<span class="line"><span>	sfd-&amp;gt;vm_ops = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	addr = do_mmap_pgoff(file, addr, size, prot, flags, 0, &amp;populate, NULL);</span></span>
<span class="line"><span>	*raddr = addr;</span></span>
<span class="line"><span>	err = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个函数里面，shm_obtain_object_check会通过共享内存的id，在基数树中找到对应的struct shmid_kernel结构，通过它找到shmem上的内存文件。</p><p>接下来，我们要分配一个struct shm_file_data，来表示这个内存文件。将shmem中指向内存文件的shm_file赋值给struct shm_file_data中的file成员。</p><p>然后，我们创建了一个struct file，指向的也是shmem中的内存文件。</p><p>为什么要再创建一个呢？这两个的功能不同，shmem中shm_file用于管理内存文件，是一个中立的，独立于任何一个进程的角色。而新创建的struct file是专门用于做内存映射的，就像咱们在讲内存映射那一节讲过的，一个硬盘上的文件要映射到虚拟地址空间中的时候，需要在vm_area_struct里面有一个struct file *vm_file指向硬盘上的文件，现在变成内存文件了，但是这个结构还是不能少。</p><p>新创建的struct file的private_data，指向struct shm_file_data，这样内存映射那部分的数据结构，就能够通过它来访问内存文件了。</p><p>新创建的struct file的file_operations也发生了变化，变成了shm_file_operations。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct file_operations shm_file_operations = {</span></span>
<span class="line"><span>	.mmap		= shm_mmap,</span></span>
<span class="line"><span>	.fsync		= shm_fsync,</span></span>
<span class="line"><span>	.release	= shm_release,</span></span>
<span class="line"><span>	.get_unmapped_area	= shm_get_unmapped_area,</span></span>
<span class="line"><span>	.llseek		= noop_llseek,</span></span>
<span class="line"><span>	.fallocate	= shm_fallocate,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>接下来，do_mmap_pgoff函数我们遇到过，原来映射硬盘上的文件的时候，也是调用它。这里我们不再详细解析了。它会分配一个vm_area_struct指向虚拟地址空间中没有分配的区域，它的vm_file指向这个内存文件，然后它会调用shm_file_operations的mmap函数，也即shm_mmap进行映射。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int shm_mmap(struct file *file, struct vm_area_struct *vma)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct shm_file_data *sfd = shm_file_data(file);</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span>	ret = __shm_open(vma);</span></span>
<span class="line"><span>	ret = call_mmap(sfd-&amp;gt;file, vma);</span></span>
<span class="line"><span>	sfd-&amp;gt;vm_ops = vma-&amp;gt;vm_ops;</span></span>
<span class="line"><span>	vma-&amp;gt;vm_ops = &amp;shm_vm_ops;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>shm_mmap中调用了shm_file_data中的file的mmap函数，这次调用的是shmem_file_operations的mmap，也即shmem_mmap。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int shmem_mmap(struct file *file, struct vm_area_struct *vma)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	file_accessed(file);</span></span>
<span class="line"><span>	vma-&amp;gt;vm_ops = &amp;shmem_vm_ops;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面，vm_area_struct的vm_ops指向shmem_vm_ops。等从call_mmap中返回之后，shm_file_data的vm_ops指向了shmem_vm_ops，而vm_area_struct的vm_ops改为指向shm_vm_ops。</p><p>我们来看一下，shm_vm_ops和shmem_vm_ops的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct vm_operations_struct shm_vm_ops = {</span></span>
<span class="line"><span>	.open	= shm_open,	/* callback for a new vm-area open */</span></span>
<span class="line"><span>	.close	= shm_close,	/* callback for when the vm-area is released */</span></span>
<span class="line"><span>	.fault	= shm_fault,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct vm_operations_struct shmem_vm_ops = {</span></span>
<span class="line"><span>	.fault		= shmem_fault,</span></span>
<span class="line"><span>	.map_pages	= filemap_map_pages,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>它们里面最关键的就是fault函数，也即访问虚拟内存的时候，访问不到应该怎么办。</p><p>当访问不到的时候，先调用vm_area_struct的vm_ops，也即shm_vm_ops的fault函数shm_fault。然后它会转而调用shm_file_data的vm_ops，也即shmem_vm_ops的fault函数shmem_fault。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int shm_fault(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file = vmf-&amp;gt;vma-&amp;gt;vm_file;</span></span>
<span class="line"><span>	struct shm_file_data *sfd = shm_file_data(file);</span></span>
<span class="line"><span>	return sfd-&amp;gt;vm_ops-&amp;gt;fault(vmf);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>虽然基于内存的文件系统，已经为这个内存文件分配了inode，但是内存也却是一点儿都没分配，只有在发生缺页异常的时候才进行分配。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int shmem_fault(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vm_area_struct *vma = vmf-&amp;gt;vma;</span></span>
<span class="line"><span>	struct inode *inode = file_inode(vma-&amp;gt;vm_file);</span></span>
<span class="line"><span>	gfp_t gfp = mapping_gfp_mask(inode-&amp;gt;i_mapping);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = shmem_getpage_gfp(inode, vmf-&amp;gt;pgoff, &amp;vmf-&amp;gt;page, sgp,</span></span>
<span class="line"><span>				  gfp, vma, vmf, &amp;ret);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * shmem_getpage_gfp - find page in cache, or get from swap, or allocate</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * If we allocate a new one we do not mark it dirty. That&#39;s up to the</span></span>
<span class="line"><span> * vm. If we swap it in we mark it dirty since we also free the swap</span></span>
<span class="line"><span> * entry since a page cannot live in both the swap and page cache.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * fault_mm and fault_type are only supplied by shmem_fault:</span></span>
<span class="line"><span> * otherwise they are NULL.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static int shmem_getpage_gfp(struct inode *inode, pgoff_t index,</span></span>
<span class="line"><span>	struct page **pagep, enum sgp_type sgp, gfp_t gfp,</span></span>
<span class="line"><span>	struct vm_area_struct *vma, struct vm_fault *vmf, int *fault_type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    page = shmem_alloc_and_acct_page(gfp, info, sbinfo,</span></span>
<span class="line"><span>					index, false);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>shmem_fault会调用shmem_getpage_gfp在page cache和swap中找一个空闲页，如果找不到就通过shmem_alloc_and_acct_page分配一个新的页，他最终会调用内存管理系统的alloc_page_vma在物理内存中分配一个页。</p><p>至此，共享内存才真的映射到了虚拟地址空间中，进程可以像访问本地内存一样访问共享内存。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>我们来总结一下共享内存的创建和映射过程。</p><ol><li>调用shmget创建共享内存。</li><li>先通过ipc_findkey在基数树中查找key对应的共享内存对象shmid_kernel是否已经被创建过，如果已经被创建，就会被查询出来，例如producer创建过，在consumer中就会查询出来。</li><li>如果共享内存没有被创建过，则调用shm_ops的newseg方法，创建一个共享内存对象shmid_kernel。例如，在producer中就会新建。</li><li>在shmem文件系统里面创建一个文件，共享内存对象shmid_kernel指向这个文件，这个文件用struct file表示，我们姑且称它为file1。</li><li>调用shmat，将共享内存映射到虚拟地址空间。</li><li>shm_obtain_object_check先从基数树里面找到shmid_kernel对象。</li><li>创建用于内存映射到文件的file和shm_file_data，这里的struct file我们姑且称为file2。</li><li>关联内存区域vm_area_struct和用于内存映射到文件的file，也即file2，调用file2的mmap函数。</li><li>file2的mmap函数shm_mmap，会调用file1的mmap函数shmem_mmap，设置shm_file_data和vm_area_struct的vm_ops。</li><li>内存映射完毕之后，其实并没有真的分配物理内存，当访问内存的时候，会触发缺页异常do_page_fault。</li><li>vm_area_struct的vm_ops的shm_fault会调用shm_file_data的vm_ops的shmem_fault。</li><li>在page cache中找一个空闲页，或者创建一个空闲页。</li></ol><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104277/20e8f4e69d47b7469f374bc9fbcf7251.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/104277/20e8f4e69d47b7469f374bc9fbcf7251.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>在这里，我们只分析了shm_ids的结构，消息队列的程序我们写过了，但是msg_ids的结构没有解析，你可以试着解析一下。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>`,74)])])}const d=n(t,[["render",l]]);export{h as __pageData,d as default};
