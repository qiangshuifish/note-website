import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"27 | 瞧一瞧Linux：Linux如何实现进程与进程调度?","description":"","frontmatter":{},"headers":[{"level":2,"title":"Linux如何表示进程","slug":"linux如何表示进程","link":"#linux如何表示进程","children":[{"level":3,"title":"Linux进程的数据结构","slug":"linux进程的数据结构","link":"#linux进程的数据结构","children":[]},{"level":3,"title":"创建task_struct结构","slug":"创建task-struct结构","link":"#创建task-struct结构","children":[]},{"level":3,"title":"Linux进程地址空间","slug":"linux进程地址空间","link":"#linux进程地址空间","children":[]},{"level":3,"title":"Linux进程文件表","slug":"linux进程文件表","link":"#linux进程文件表","children":[]}]},{"level":2,"title":"Linux进程调度","slug":"linux进程调度","link":"#linux进程调度","children":[{"level":3,"title":"进程调度实体","slug":"进程调度实体","link":"#进程调度实体","children":[]},{"level":3,"title":"进程运行队列","slug":"进程运行队列","link":"#进程运行队列","children":[]},{"level":3,"title":"调度实体和运行队列的关系","slug":"调度实体和运行队列的关系","link":"#调度实体和运行队列的关系","children":[]},{"level":3,"title":"调度器类","slug":"调度器类","link":"#调度器类","children":[]}]},{"level":2,"title":"Linux的CFS调度器","slug":"linux的cfs调度器","link":"#linux的cfs调度器","children":[{"level":3,"title":"普通进程的权重","slug":"普通进程的权重","link":"#普通进程的权重","children":[]},{"level":3,"title":"进程调度延迟","slug":"进程调度延迟","link":"#进程调度延迟","children":[]},{"level":3,"title":"虚拟时间","slug":"虚拟时间","link":"#虚拟时间","children":[]}]},{"level":2,"title":"CFS调度进程","slug":"cfs调度进程","link":"#cfs调度进程","children":[{"level":3,"title":"定时周期调度","slug":"定时周期调度","link":"#定时周期调度","children":[]},{"level":3,"title":"调度器入口","slug":"调度器入口","link":"#调度器入口","children":[]},{"level":3,"title":"挑选下一个进程","slug":"挑选下一个进程","link":"#挑选下一个进程","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/27-瞧一瞧Linux：Linux如何实现进程与进程调度.md","filePath":"操作系统实战45讲/27-瞧一瞧Linux：Linux如何实现进程与进程调度.md","lastUpdated":1779820584000}'),t={name:"操作系统实战45讲/27-瞧一瞧Linux：Linux如何实现进程与进程调度.md"};function l(c,s,i,r,_,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_27-瞧一瞧linux-linux如何实现进程与进程调度" tabindex="-1">27 | 瞧一瞧Linux：Linux如何实现进程与进程调度? <a class="header-anchor" href="#_27-瞧一瞧linux-linux如何实现进程与进程调度" aria-label="Permalink to &quot;27 | 瞧一瞧Linux：Linux如何实现进程与进程调度?&quot;">​</a></h1><p>你好，我是LMOS。</p><p>在前面的课程中，我们已经写好了Cosmos的进程管理组件，实现了多进程调度运行，今天我们一起探索Linux如何表示进程以及如何进行多进程调度。</p><p>好了，话不多说，我们开始吧。</p><h2 id="linux如何表示进程" tabindex="-1">Linux如何表示进程 <a class="header-anchor" href="#linux如何表示进程" aria-label="Permalink to &quot;Linux如何表示进程&quot;">​</a></h2><p>在Cosmos中，我们设计了一个thread_t数据结构来代表一个进程，Linux也同样是用一个数据结构表示一个进程。</p><p>下面我们先来研究Linux的进程数据结构，然后看看Linux进程的地址空间数据结构，最后再来理解Linux的文件表结构。</p><h3 id="linux进程的数据结构" tabindex="-1">Linux进程的数据结构 <a class="header-anchor" href="#linux进程的数据结构" aria-label="Permalink to &quot;Linux进程的数据结构&quot;">​</a></h3><p>Linux系统下，把运行中的应用程序抽象成一个数据结构task_struct，一个应用程序所需要的各种资源，如内存、文件等都包含在task_struct结构中。</p><p>因此，task_struct结构是非常巨大的一个数据结构，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct task_struct {</span></span>
<span class="line"><span>    struct thread_info thread_info;//处理器特有数据</span></span>
<span class="line"><span>    volatile long   state;       //进程状态</span></span>
<span class="line"><span>    void            *stack;      //进程内核栈地址</span></span>
<span class="line"><span>    refcount_t      usage;       //进程使用计数</span></span>
<span class="line"><span>    int             on_rq;       //进程是否在运行队列上</span></span>
<span class="line"><span>    int             prio;        //动态优先级</span></span>
<span class="line"><span>    int             static_prio; //静态优先级</span></span>
<span class="line"><span>    int             normal_prio; //取决于静态优先级和调度策略</span></span>
<span class="line"><span>    unsigned int    rt_priority; //实时优先级</span></span>
<span class="line"><span>    const struct sched_class    *sched_class;//指向其所在的调度类</span></span>
<span class="line"><span>    struct sched_entity         se;//普通进程的调度实体</span></span>
<span class="line"><span>    struct sched_rt_entity      rt;//实时进程的调度实体</span></span>
<span class="line"><span>    struct sched_dl_entity      dl;//采用EDF算法调度实时进程的调度实体</span></span>
<span class="line"><span>    struct sched_info       sched_info;//用于调度器统计进程的运行信息</span></span>
<span class="line"><span>    struct list_head        tasks;//所有进程的链表</span></span>
<span class="line"><span>    struct mm_struct        *mm;  //指向进程内存结构</span></span>
<span class="line"><span>    struct mm_struct        *active_mm;</span></span>
<span class="line"><span>    pid_t               pid;            //进程id</span></span>
<span class="line"><span>    struct task_struct __rcu    *parent;//指向其父进程</span></span>
<span class="line"><span>    struct list_head        children; //链表中的所有元素都是它的子进程</span></span>
<span class="line"><span>    struct list_head        sibling;  //用于把当前进程插入到兄弟链表中</span></span>
<span class="line"><span>    struct task_struct      *group_leader;//指向其所在进程组的领头进程</span></span>
<span class="line"><span>    u64             utime;   //用于记录进程在用户态下所经过的节拍数</span></span>
<span class="line"><span>    u64             stime;   //用于记录进程在内核态下所经过的节拍数</span></span>
<span class="line"><span>    u64             gtime;   //用于记录作为虚拟机进程所经过的节拍数</span></span>
<span class="line"><span>    unsigned long           min_flt;//缺页统计</span></span>
<span class="line"><span>    unsigned long           maj_flt;</span></span>
<span class="line"><span>    struct fs_struct        *fs;    //进程相关的文件系统信息</span></span>
<span class="line"><span>    struct files_struct     *files;//进程打开的所有文件</span></span>
<span class="line"><span>    struct vm_struct        *stack_vm_area;//内核栈的内存区</span></span>
<span class="line"><span>  };</span></span></code></pre></div><p>为了帮你掌握核心思路，关于task_struct结构体，我省略了进程的权能、性能跟踪、信号、numa、cgroup等相关的近500行内容，你若有兴趣可以自行 <a href="https://elixir.bootlin.com/linux/v5.10.23/source/include/linux/sched.h#L640" target="_blank" rel="noreferrer">阅读</a>，这里你只需要明白，在内存中， <strong>一个task_struct结构体的实例变量代表一个Linux进程</strong> 就行了。</p><h3 id="创建task-struct结构" tabindex="-1">创建task_struct结构 <a class="header-anchor" href="#创建task-struct结构" aria-label="Permalink to &quot;创建task\\_struct结构&quot;">​</a></h3><p>Linux创建task_struct结构体的实例变量，这里我们只关注早期和最新的创建方式。</p><p>Linux早期是这样创建task_struct结构体的实例变量的：找伙伴内存管理系统，分配两个连续的页面（即8KB），作为进程的内核栈，再把task_struct结构体的实例变量，放在这8KB内存空间的开始地址处。内核栈则是从上向下伸长的，task_struct数据结构是从下向上伸长的。</p><p>我给你画幅图，你就明白了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/9f6acf3a5b6f31a3aeb8743726a65286.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/9f6acf3a5b6f31a3aeb8743726a65286.jpg" alt=""></a></p><p>从图中不难发现，Linux把task_struct结构和内核栈放在了一起 ，所以我们只要把RSP寄存器的值读取出来，然后将其低13位清零，就得到了当前task_struct结构体的地址。由于内核栈比较大，而且会向下伸长，覆盖掉task_struct结构体内容的概率就很小。</p><p>随着Linux版本的迭代，task_struct结构体的体积越来越大，从前task_struct结构体和内核栈放在一起的方式就不合适了。最新的版本是分开放的，我们一起来看看后面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static unsigned long *alloc_thread_stack_node(struct task_struct *tsk, int node)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct page *page = alloc_pages_node(node, THREADINFO_GFP,</span></span>
<span class="line"><span>                         THREAD_SIZE_ORDER);//分配两个页面</span></span>
<span class="line"><span>    if (likely(page)) {</span></span>
<span class="line"><span>        tsk-&amp;gt;stack = kasan_reset_tag(page_address(page));</span></span>
<span class="line"><span>        return tsk-&amp;gt;stack;//让task_struct结构的stack字段指向page的地址</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline struct task_struct *alloc_task_struct_node(int node)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return kmem_cache_alloc_node(task_struct_cachep, GFP_KERNEL, node);//在task_struct_cachep内存对象中分配一个task_struct结构休对象</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static struct task_struct *dup_task_struct(struct task_struct *orig, int node)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct task_struct *tsk; unsigned long *stack;</span></span>
<span class="line"><span>    tsk = alloc_task_struct_node(node);//分配task_struct结构体</span></span>
<span class="line"><span>    if (!tsk)</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    stack = alloc_thread_stack_node(tsk, node);//分配内核栈</span></span>
<span class="line"><span>    tsk-&amp;gt;stack = stack;</span></span>
<span class="line"><span>    return tsk;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static __latent_entropy struct task_struct *copy_process(</span></span>
<span class="line"><span>                    struct pid *pid, int trace, int node,</span></span>
<span class="line"><span>                    struct kernel_clone_args *args)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int pidfd = -1, retval;</span></span>
<span class="line"><span>    struct task_struct *p;</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    retval = -ENOMEM;</span></span>
<span class="line"><span>    p = dup_task_struct(current, node);//分配task_struct和内核栈</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    return ERR_PTR(retval);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pid_t kernel_clone(struct kernel_clone_args *args)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64 clone_flags = args-&amp;gt;flags;</span></span>
<span class="line"><span>    struct task_struct *p;</span></span>
<span class="line"><span>    pid_t nr;</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    //复制进程</span></span>
<span class="line"><span>    p = copy_process(NULL, trace, NUMA_NO_NODE, args);</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    return nr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//建立进程接口</span></span>
<span class="line"><span>SYSCALL_DEFINE0(fork)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kernel_clone_args args = {</span></span>
<span class="line"><span>        .exit_signal = SIGCHLD,</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    return kernel_clone(&amp;args);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了直击重点，我们不会讨论Linux的fork函数，你只要知道，它负责建立一个与父进程相同的进程，也就是复制了父进程的一系列数据，这就够了。</p><p>要复制父进程的数据必须要分配内存， <strong>上面代码的流程完整展示了从SLAB中分配task_struct结构，以及从伙伴内存系统分配内核栈的过程，整个过程是怎么回事儿，才是你要领会的重点。</strong></p><h3 id="linux进程地址空间" tabindex="-1">Linux进程地址空间 <a class="header-anchor" href="#linux进程地址空间" aria-label="Permalink to &quot;Linux进程地址空间&quot;">​</a></h3><p>Linux也是支持虚拟内存的操作系统内核，现在我们来看看Linux用于描述一个进程的地址空间的数据结构，它就是 <strong>mm_struct结构</strong>，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct mm_struct {</span></span>
<span class="line"><span>        struct vm_area_struct *mmap; //虚拟地址区间链表VMAs</span></span>
<span class="line"><span>        struct rb_root mm_rb;   //组织vm_area_struct结构的红黑树的根</span></span>
<span class="line"><span>        unsigned long task_size;    //进程虚拟地址空间大小</span></span>
<span class="line"><span>        pgd_t * pgd;        //指向MMU页表</span></span>
<span class="line"><span>        atomic_t mm_users; //多个进程共享这个mm_struct</span></span>
<span class="line"><span>        atomic_t mm_count; //mm_struct结构本身计数</span></span>
<span class="line"><span>        atomic_long_t pgtables_bytes;//页表占用了多个页</span></span>
<span class="line"><span>        int map_count;      //多少个VMA</span></span>
<span class="line"><span>        spinlock_t page_table_lock; //保护页表的自旋锁</span></span>
<span class="line"><span>        struct list_head mmlist; //挂入mm_struct结构的链表</span></span>
<span class="line"><span>        //进程应用程序代码开始、结束地址，应用程序数据的开始、结束地址</span></span>
<span class="line"><span>        unsigned long start_code, end_code, start_data, end_data;</span></span>
<span class="line"><span>        //进程应用程序堆区的开始、当前地址、栈开始地址</span></span>
<span class="line"><span>        unsigned long start_brk, brk, start_stack;</span></span>
<span class="line"><span>        //进程应用程序参数区开始、结束地址</span></span>
<span class="line"><span>        unsigned long arg_start, arg_end, env_start, env_end;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>同样的，mm_struct结构，我也精减了很多内容。其中的vm_area_struct结构，相当于我们之前Cosmos的kmvarsdsc_t结构（可以回看 <a href="https://time.geekbang.org/column/article/387258" target="_blank" rel="noreferrer">第20节课</a>），是用来描述一段虚拟地址空间的。mm_struct结构中也包含了MMU页表相关的信息。</p><p>下面我们一起来看看，mm_struct结构是如何建立对应的实例变量呢？代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//在mm_cachep内存对象中分配一个mm_struct结构休对象</span></span>
<span class="line"><span>#define allocate_mm()   (kmem_cache_alloc(mm_cachep, GFP_KERNEL))</span></span>
<span class="line"><span>static struct mm_struct *dup_mm(struct task_struct *tsk,</span></span>
<span class="line"><span>                struct mm_struct *oldmm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct mm_struct *mm;</span></span>
<span class="line"><span>    //分配mm_struct结构</span></span>
<span class="line"><span>    mm = allocate_mm();</span></span>
<span class="line"><span>    if (!mm)</span></span>
<span class="line"><span>        goto fail_nomem;</span></span>
<span class="line"><span>    //复制mm_struct结构</span></span>
<span class="line"><span>    memcpy(mm, oldmm, sizeof(*mm));</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    return mm;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static int copy_mm(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct mm_struct *mm, *oldmm;</span></span>
<span class="line"><span>    int retval;</span></span>
<span class="line"><span>    tsk-&amp;gt;min_flt = tsk-&amp;gt;maj_flt = 0;</span></span>
<span class="line"><span>    tsk-&amp;gt;nvcsw = tsk-&amp;gt;nivcsw = 0;</span></span>
<span class="line"><span>    retval = -ENOMEM;</span></span>
<span class="line"><span>    mm = dup_mm(tsk, current-&amp;gt;mm);//分配mm_struct结构的实例变量</span></span>
<span class="line"><span>    if (!mm)</span></span>
<span class="line"><span>        goto fail_nomem;</span></span>
<span class="line"><span>good_mm:</span></span>
<span class="line"><span>    tsk-&amp;gt;mm = mm;</span></span>
<span class="line"><span>    tsk-&amp;gt;active_mm = mm;</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>fail_nomem:</span></span>
<span class="line"><span>    return retval;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的copy_mm函数正是在copy_process函数中被调用的， copy_mm函数调用dup_mm函数，把当前进程的mm_struct结构复制到allocate_mm宏分配的一个mm_struct结构中。这样，一个新进程的mm_struct结构就建立了。</p><h3 id="linux进程文件表" tabindex="-1">Linux进程文件表 <a class="header-anchor" href="#linux进程文件表" aria-label="Permalink to &quot;Linux进程文件表&quot;">​</a></h3><p>在Linux系统中，可以说万物皆为文件，比如文件、设备文件、管道文件等。一个进程对一个文件进行读写操作之前，必须先打开文件，这个打开的文件就记录在进程的文件表中，它由task_struct结构中的files字段指向。这里指向的其实是个 <strong>files_struct结构</strong>，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct files_struct {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    atomic_t count;//自动计数</span></span>
<span class="line"><span>    struct fdtable __rcu *fdt;</span></span>
<span class="line"><span>    struct fdtable fdtab;</span></span>
<span class="line"><span>    spinlock_t file_lock; //自旋锁</span></span>
<span class="line"><span>    unsigned int next_fd;//下一个文件句柄</span></span>
<span class="line"><span>    unsigned long close_on_exec_init[1];//执行exec()时要关闭的文件句柄</span></span>
<span class="line"><span>    unsigned long open_fds_init[1];</span></span>
<span class="line"><span>    unsigned long full_fds_bits_init[1];</span></span>
<span class="line"><span>    struct file __rcu * fd_array[NR_OPEN_DEFAULT];//默认情况下打开文件的指针数组</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>从上述代码中，可以推想出我们在应用软件中调用：int fd = open(&quot;/tmp/test.txt&quot;); 实际Linux会建立一个struct file结构体实例变量与文件对应，然后把struct file结构体实例变量的指针放入fd_array数组中。</p><p>那么Linux在建立一个新进程时，怎样给新进程建立一个files_struct结构呢？其实很简单，也是复制当前进程的files_struct结构，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int copy_files(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct files_struct *oldf, *newf;</span></span>
<span class="line"><span>    int error = 0;</span></span>
<span class="line"><span>    oldf = current-&amp;gt;files;//获取当前进程的files_struct的指针</span></span>
<span class="line"><span>    if (!oldf)</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (clone_flags &amp; CLONE_FILES) {</span></span>
<span class="line"><span>        atomic_inc(&amp;oldf-&amp;gt;count);</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //分配新files_struct结构的实例变量，并复制当前的files_struct结构</span></span>
<span class="line"><span>    newf = dup_fd(oldf, NR_OPEN_MAX, &amp;error);</span></span>
<span class="line"><span>    if (!newf)</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tsk-&amp;gt;files = newf;//新进程的files_struct结构指针指向新的files_struct结构</span></span>
<span class="line"><span>    error = 0;</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    return error;</span></span></code></pre></div><p>同样的，copy_files函数由copy_process函数调用，copy_files最终会复制当前进程的files_struct结构到一个新的files_struct结构实例变量中，并让新进程的files指针指向这个新的files_struct结构实例变量。</p><p>好了，关于进程的一些数据结构，我们就了解这么多，因为现在你还无需知道Linux进程的所有细节，对于一个庞大的系统， <strong>最大的误区是陷入细节而不知全貌</strong>。这里，我们只需要知道Linux用什么代表一个进程就行了。</p><h2 id="linux进程调度" tabindex="-1">Linux进程调度 <a class="header-anchor" href="#linux进程调度" aria-label="Permalink to &quot;Linux进程调度&quot;">​</a></h2><p>Linux支持多CPU上运行多进程，这就要说到多进程调度了。Linux进程调度支持多种调度算法，有基于优先级的调度算法，有实时调度算法，有完全公平调度算法（CFQ）。</p><p>下面我们以CFQ为例进行探讨，我们先了解一下CFQ相关的数据结构，随后探讨CFQ算法要怎样实现。</p><h3 id="进程调度实体" tabindex="-1">进程调度实体 <a class="header-anchor" href="#进程调度实体" aria-label="Permalink to &quot;进程调度实体&quot;">​</a></h3><p>我们先来看看什么是进程调度实体，它是干什么的呢？</p><p>它其实是Linux进程调度系统的一部分，被嵌入到了Linux进程数据结构中，与调度器进行关联，能间接地访问进程， <strong>这种高内聚低耦合的方式，保证了进程数据结构和调度数据结构相互独立</strong>，我们后面可以分别做改进、优化，这是一种高明的软件设计思想。我们来看看这个结构，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sched_entity {</span></span>
<span class="line"><span>    struct load_weight load;//表示当前调度实体的权重</span></span>
<span class="line"><span>    struct rb_node run_node;//红黑树的数据节点</span></span>
<span class="line"><span>    struct list_head group_node;// 链表节点，被链接到 percpu 的 rq-&amp;gt;cfs_tasks</span></span>
<span class="line"><span>    unsigned int on_rq; //当前调度实体是否在就绪队列上</span></span>
<span class="line"><span>    u64 exec_start;//当前实体上次被调度执行的时间</span></span>
<span class="line"><span>    u64 sum_exec_runtime;//当前实体总执行时间</span></span>
<span class="line"><span>    u64 prev_sum_exec_runtime;//截止到上次统计，进程执行的时间</span></span>
<span class="line"><span>    u64 vruntime;//当前实体的虚拟时间</span></span>
<span class="line"><span>    u64 nr_migrations;//实体执行迁移的次数</span></span>
<span class="line"><span>    struct sched_statistics statistics;//统计信息包含进程的睡眠统计、等待延迟统计、CPU迁移统计、唤醒统计等。</span></span>
<span class="line"><span>#ifdef CONFIG_FAIR_GROUP_SCHED</span></span>
<span class="line"><span>    int depth;// 表示当前实体处于调度组中的深度</span></span>
<span class="line"><span>    struct sched_entity *parent;//指向父级调度实体</span></span>
<span class="line"><span>    struct cfs_rq *cfs_rq;//当前调度实体属于的 cfs_rq.</span></span>
<span class="line"><span>    struct cfs_rq *my_q;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#ifdef CONFIG_SMP</span></span>
<span class="line"><span>    struct sched_avg avg ;// 记录当前实体对于CPU的负载</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>上述代码的信息量很多，但是我们现在不急于搞清楚所有的信息，我们现在需要知道的是 <strong>在task_struct结构中，会包含至少一个sched_entity结构的变量</strong>，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/00de9da1b13f6f3e975050a393782891.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/00de9da1b13f6f3e975050a393782891.jpg" alt=""></a></p><p>结合图示，我们只要通过sched_entity结构变量的地址，减去它在task_struct结构中的偏移（由编译器自动计算），就能获取到task_struct结构的地址。这样就能达到通过sched_entity结构，访问task_struct结构的目的了。</p><h3 id="进程运行队列" tabindex="-1">进程运行队列 <a class="header-anchor" href="#进程运行队列" aria-label="Permalink to &quot;进程运行队列&quot;">​</a></h3><p>那么，在Linux中，又是怎样组织众多调度实体，进而组织众多进程，方便进程调度器找到调度实体呢？</p><p>首先，Linux定义了一个进程运行队列结构，每个CPU分配一个这样的进程运行队列结构实例变量，进程运行队列结构的代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct rq {</span></span>
<span class="line"><span>    raw_spinlock_t      lock;//自旋锁</span></span>
<span class="line"><span>    unsigned int        nr_running;//多个就绪运行进程</span></span>
<span class="line"><span>    struct cfs_rq       cfs; //作用于完全公平调度算法的运行队列</span></span>
<span class="line"><span>    struct rt_rq        rt;//作用于实时调度算法的运行队列</span></span>
<span class="line"><span>    struct dl_rq        dl;//作用于EDF调度算法的运行队列</span></span>
<span class="line"><span>    struct task_struct __rcu    *curr;//这个运行队列当前正在运行的进程</span></span>
<span class="line"><span>    struct task_struct  *idle;//这个运行队列的空转进程</span></span>
<span class="line"><span>    struct task_struct  *stop;//这个运行队列的停止进程</span></span>
<span class="line"><span>    struct mm_struct    *prev_mm;//这个运行队列上一次运行进程的mm_struct</span></span>
<span class="line"><span>    unsigned int        clock_update_flags;//时钟更新标志</span></span>
<span class="line"><span>    u64         clock; //运行队列的时间</span></span>
<span class="line"><span>    //后面的代码省略</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>以上这个rq结构结构中，很多我们不需要关注的字段我已经省略了。你要重点理解的是，其中task_struct结构指针是为了快速访问特殊进程，而rq结构并不直接关联调度实体，而是包含了cfs_rq、rt_rq、dl_rq，通过它们来关联调度实体。</p><p>有三个不同的运行队列，是因为作用于三种不同的调度算法。我们这里只需要关注cfs_rq，代码我列在了后面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct rb_root_cached {</span></span>
<span class="line"><span>    struct rb_root rb_root;   //红黑树的根</span></span>
<span class="line"><span>    struct rb_node *rb_leftmost;//红黑树最左子节点</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct cfs_rq {</span></span>
<span class="line"><span>    struct load_weight  load;//cfs_rq上所有调度实体的负载总和</span></span>
<span class="line"><span>    unsigned int nr_running;//cfs_rq上所有的调度实体不含调度组中的调度实体</span></span>
<span class="line"><span>    unsigned int h_nr_running;//cfs_rq上所有的调度实体包含调度组中所有调度实体</span></span>
<span class="line"><span>    u64         exec_clock;//当前 cfs_rq 上执行的时间</span></span>
<span class="line"><span>    u64         min_vruntime;//最小虚拟运行时间</span></span>
<span class="line"><span>    struct rb_root_cached   tasks_timeline;//所有调度实体的根</span></span>
<span class="line"><span>    struct sched_entity *curr;//当前调度实体</span></span>
<span class="line"><span>    struct sched_entity *next;//下一个调度实体</span></span>
<span class="line"><span>    struct sched_entity *last;//上次执行过的调度实体</span></span>
<span class="line"><span>    //省略不关注的代码</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>为了简化问题，上述代码中我省略了调度组和负载相关的内容。你也许已经看出来了，其中 <strong>load、exec_clock、min_vruntime、tasks_timeline字段是CFS调度算法得以实现的关键</strong>，你甚至可以猜出所有的调度实体，都是通过红黑树组织起来的，即cfs_rq结构中的tasks_timeline字段。</p><h3 id="调度实体和运行队列的关系" tabindex="-1">调度实体和运行队列的关系 <a class="header-anchor" href="#调度实体和运行队列的关系" aria-label="Permalink to &quot;调度实体和运行队列的关系&quot;">​</a></h3><p>相信我，作为初学者， <strong>了解数据结构之间的组织关系，这远比了解一个数据结构所有字段的作用和细节重要得多。</strong></p><p>通过前面的学习，我们已经了解了rq、cfs_rq、rb_root_cached、sched_entity、task_struct等数据结构，下面我们来看看它的组织关系，我特意为你准备了后面这幅图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/bb9f817b5db40106cb324b71b04ebed0.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/bb9f817b5db40106cb324b71b04ebed0.jpg" alt=""></a></p><p>结合图片我们发现，task_struct结构中包含了sched_entity结构。sched_entity结构是通过红黑树组织起来的，红黑树的根在cfs_rq结构中，cfs_rq结构又被包含在rq结构，每个CPU对应一个rq结构。这样，我们就把所有运行的进程组织起来了。</p><h3 id="调度器类" tabindex="-1">调度器类 <a class="header-anchor" href="#调度器类" aria-label="Permalink to &quot;调度器类&quot;">​</a></h3><p>从前面的rq数据结构中，你已经发现了，Linux是同时支持多个进程调度器的，不同的进程挂载到不同的运行队列中，如rq结构中的cfs、rt、dl，然后针对它们这些结构，使用不同的调度器。</p><p>为了支持不同的调度器，Linux定义了调度器类数据结构，它定义了一个调度器要实现哪些函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sched_class {</span></span>
<span class="line"><span>    //向运行队列中添加一个进程，入队</span></span>
<span class="line"><span>    void (*enqueue_task) (struct rq *rq, struct task_struct *p, int flags);</span></span>
<span class="line"><span>    //向运行队列中删除一个进程，出队</span></span>
<span class="line"><span>    void (*dequeue_task) (struct rq *rq, struct task_struct *p, int flags);</span></span>
<span class="line"><span>    //检查当前进程是否可抢占</span></span>
<span class="line"><span>    void (*check_preempt_curr)(struct rq *rq, struct task_struct *p, int flags);</span></span>
<span class="line"><span>    //从运行队列中返回可以投入运行的一个进程</span></span>
<span class="line"><span>    struct task_struct *(*pick_next_task)(struct rq *rq);</span></span>
<span class="line"><span>} ;</span></span></code></pre></div><p>这个sched_class结构定义了一组函数指针，为了让你抓住重点，这里我删除了调度组和负载均衡相关的函数指针。Linux系统一共定义了五个sched_class结构的实例变量，这五个sched_class结构紧靠在一起，形成了sched_class结构数组。</p><p>为了找到相应的sched_class结构实例，可以用以下代码遍历所有的sched_class结构实例变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义在链接脚本文件中</span></span>
<span class="line"><span>extern struct sched_class __begin_sched_classes[];</span></span>
<span class="line"><span>extern struct sched_class __end_sched_classes[];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define sched_class_highest (__end_sched_classes - 1)</span></span>
<span class="line"><span>#define sched_class_lowest  (__begin_sched_classes - 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define for_class_range(class, _from, _to) \\</span></span>
<span class="line"><span>    for (class = (_from); class != (_to); class--)</span></span>
<span class="line"><span>//遍历每个调度类</span></span>
<span class="line"><span>#define for_each_class(class) \\</span></span>
<span class="line"><span>    for_class_range(class, sched_class_highest, sched_class_lowest)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern const struct sched_class stop_sched_class;//停止调度类</span></span>
<span class="line"><span>extern const struct sched_class dl_sched_class;//Deadline调度类</span></span>
<span class="line"><span>extern const struct sched_class rt_sched_class;//实时调度类</span></span>
<span class="line"><span>extern const struct sched_class fair_sched_class;//CFS调度类</span></span>
<span class="line"><span>extern const struct sched_class idle_sched_class;//空转调度类</span></span></code></pre></div><p>这些类是有优先级的，它们的优先级是：stop_sched_class &gt; dl_sched_class &gt; rt_sched_class &gt; fair_sched_class &gt; idle_sched_class。</p><p>下面我们观察一下，CFS调度器（这个调度器我们稍后讨论）所需要的 fair_sched_class，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct sched_class fair_sched_class</span></span>
<span class="line"><span>    __section(&quot;__fair_sched_class&quot;) = {</span></span>
<span class="line"><span>    .enqueue_task       = enqueue_task_fair,</span></span>
<span class="line"><span>    .dequeue_task       = dequeue_task_fair,</span></span>
<span class="line"><span>    .check_preempt_curr = check_preempt_wakeup,</span></span>
<span class="line"><span>    .pick_next_task     = __pick_next_task_fair,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>我们看到这些函数指针字段都对应到了具体的函数。其实，实现一个新的调度器，就是实现这些对应的函数。好了，我们清楚了调度器类，它就是一组函数指针，不知道你发现没有，这难道不是C语言下的面向对象吗？下面，我们接着研究CFS调度器。</p><h2 id="linux的cfs调度器" tabindex="-1">Linux的CFS调度器 <a class="header-anchor" href="#linux的cfs调度器" aria-label="Permalink to &quot;Linux的CFS调度器&quot;">​</a></h2><p>Linux支持多种不同的进程调度器，比如RT调度器、Deadline调度器、CFS调度器以及Idle调度器。不过，这里我们仅仅讨论一下CFS调度器，也就是完全公平调度器，CFS的设计理念是在有限的真实硬件平台上模拟实现理想的、精确的多任务CPU。现在你不懂也不要紧，我们后面会讨论的。</p><p>在了解CFS核心算法之前，你需要先掌握几个核心概念。</p><h3 id="普通进程的权重" tabindex="-1">普通进程的权重 <a class="header-anchor" href="#普通进程的权重" aria-label="Permalink to &quot;普通进程的权重&quot;">​</a></h3><p>Linux会使用CFS调度器调度普通进程，CFS调度器与其它进程调度器的不同之处在于没有时间片的概念，它是分配CPU使用时间的比例。比如，4个相同优先级的进程在一个CPU上运行，那么每个进程都将会分配25%的CPU运行时间。这就是进程要的公平。</p><p>然而事有轻重缓急，对进程来说也是一样，有些进程的优先级就需要很高。那么CFS调度器是如何在公平之下，实现“不公平”的呢？</p><p>首先，CFS调度器下不叫优先级，而是叫 <strong>权重</strong>，权重表示进程的优先级，各个进程按权重的比例分配CPU时间。</p><p>举个例子，现在有A、B两个进程。进程A的权重是1024，进程B的权重是2048。那么进程A获得CPU的时间比例是1024/(1024+2048) = 33.3%。进程B获得的CPU时间比例是2048/(1024+2048)=66.7%。</p><p>因此，权重越大，分配的时间比例越大，就相当于进程的优先级越高。</p><p>有了权重之后，分配给进程的时间计算公式如下：</p><p><strong>进程的时间 = CPU总时间 * 进程的权重/就绪队列所有进程权重之和</strong></p><p>但是进程对外的编程接口中使用的是一个 <strong>nice值</strong>，大小范围是（-20～19），数值越小优先级越大，意味着权重值越大，nice值和权重之间可以转换的。Linux提供了后面这个数组，用于转换nice值和权重。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const int sched_prio_to_weight[40] = {</span></span>
<span class="line"><span> /* -20 */     88761,     71755,     56483,     46273,     36291,</span></span>
<span class="line"><span> /* -15 */     29154,     23254,     18705,     14949,     11916,</span></span>
<span class="line"><span> /* -10 */      9548,      7620,      6100,      4904,      3906,</span></span>
<span class="line"><span> /*  -5 */      3121,      2501,      1991,      1586,      1277,</span></span>
<span class="line"><span> /*   0 */      1024,       820,       655,       526,       423,</span></span>
<span class="line"><span> /*   5 */       335,       272,       215,       172,       137,</span></span>
<span class="line"><span> /*  10 */       110,        87,        70,        56,        45,</span></span>
<span class="line"><span> /*  15 */        36,        29,        23,        18,        15,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>一个进程每降低一个nice值，就能多获得10% 的CPU时间。1024权重对应nice值为0，被称为NICE_0_LOAD。默认情况下，大多数进程的权重都是NICE_0_LOAD。</p><h3 id="进程调度延迟" tabindex="-1">进程调度延迟 <a class="header-anchor" href="#进程调度延迟" aria-label="Permalink to &quot;进程调度延迟&quot;">​</a></h3><p>了解了进程权重，现在我们看看进程调度延迟，什么是调度延迟？其实就是保证每一个可运行的进程，都至少运行一次的 <strong>时间间隔</strong>。</p><p>我们结合实例理解，系统中有3个可运行进程，每个进程都运行10ms，那么调度延迟就是30ms；如果有10个进程，那么调度延迟就是100ms；如果现在保证调度延迟不变，固定是30ms；如果系统中有3个进程，则每个进程可运行10ms；如果有10个进程，则每个进程可运行3ms。</p><p>随着进程的增加，每个进程分配的时间在减少，进程调度次数会增加，调度器占用的时间就会增加。因此，CFS调度器的调度延迟时间的设定 <strong>并不是固定的</strong>。</p><p>当运行进程少于8个的时候，调度延迟是固定的6ms不变。当运行进程个数超过8个时，就要保证每个进程至少运行一段时间，才被调度。这个“至少一段时间”叫作 <strong>最小调度粒度时间</strong>。</p><p>在CFS默认设置中，最小调度粒度时间是0.75ms，用变量sysctl_sched_min_granularity记录。由__sched_period函数负责计算，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unsigned int sysctl_sched_min_granularity           = 750000ULL;</span></span>
<span class="line"><span>static unsigned int normalized_sysctl_sched_min_granularity = 750000ULL;</span></span>
<span class="line"><span>static unsigned int sched_nr_latency = 8;</span></span>
<span class="line"><span>static u64 __sched_period(unsigned long nr_running)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (unlikely(nr_running &amp;gt; sched_nr_latency))</span></span>
<span class="line"><span>        return nr_running * sysctl_sched_min_granularity;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return sysctl_sched_latency;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，参数nr_running是Linux系统中可运行的进程数量，当超过sched_nr_latency时，我们无法保证调度延迟，因此转为保证最小调度粒度。</p><h3 id="虚拟时间" tabindex="-1">虚拟时间 <a class="header-anchor" href="#虚拟时间" aria-label="Permalink to &quot;虚拟时间&quot;">​</a></h3><p>你是否还记得调度实体中的vruntime么？它就是用来表示虚拟时间的，我们先按下不表，来看一个例子。</p><p>假设幼儿园只有一个秋千，所有孩子都想玩，身为老师的你该怎么处理呢？你一定会想每个孩子玩一段时间，然后就让给别的孩子，依次类推。CFS调度器也是这样做的，它记录了每个进程的执行时间，为保证每个进程运行时间的公平，哪个进程运行的时间最少，就会让哪个进程运行。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/818313e87a4e1129470fb87bacee59f1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/818313e87a4e1129470fb87bacee59f1.jpg" alt=""></a></p><p>例如，调度延迟是10ms，系统一共2个相同优先级的进程，那么各进程都将在10ms的时间内各运行5ms。</p><p>现在进程A和进程B他们的权重分别是1024和820（nice值分别是0和1）。进程A获得的运行时间是10x1024/(1024+820)=5.6ms，进程B获得的执行时间是10x820/(1024+820)=4.4ms。进程A的cpu使用比例是5.6/10x100%=56%，进程B的cpu使用比例是4.4/10x100%=44%。</p><p>很明显，这两个进程的实际执行时间是不等的，但CFS调度器想保证每个进程的运行时间相等。因此CFS调度器引入了虚拟时间，也就是说，上面的5.6ms和4.4ms经过一个公式，转换成相同的值，这个转换后的值就叫虚拟时间。这样的话，CFS只需要保证每个进程运行的虚拟时间是相等的。</p><p>虚拟时间vruntime和实际时间（wtime）转换公式如下：</p><p>vruntime = wtime*( NICE_0_LOAD/weight)</p><p>根据上面的公式，可以发现nice值为0的进程，这种进程的虚拟时间和实际时间是相等的，那么进程A的虚拟时间为：5.6*(1024/1024)=5.6，进程B的虚拟时间为：4.4*(1024/820)=5.6。虽然进程A和进程B的权重不一样，但是计算得到的虚拟时间是一样的。</p><p>所以，CFS调度主要保证每个进程运行的虚拟时间一致即可。在选择下一个即将运行的进程时，只需要找到虚拟时间最小的进程就行了。这个计算过程由calc_delta_fair函数完成，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static u64 __calc_delta(u64 delta_exec, unsigned long weight, struct load_weight *lw)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64 fact = scale_load_down(weight);</span></span>
<span class="line"><span>    int shift = WMULT_SHIFT;</span></span>
<span class="line"><span>    __update_inv_weight(lw);</span></span>
<span class="line"><span>    if (unlikely(fact &amp;gt;&amp;gt; 32)) {</span></span>
<span class="line"><span>        while (fact &amp;gt;&amp;gt; 32) {</span></span>
<span class="line"><span>            fact &amp;gt;&amp;gt;= 1;</span></span>
<span class="line"><span>            shift--;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //为了避免使用浮点计算</span></span>
<span class="line"><span>    fact = mul_u32_u32(fact, lw-&amp;gt;inv_weight);</span></span>
<span class="line"><span>    while (fact &amp;gt;&amp;gt; 32) {</span></span>
<span class="line"><span>        fact &amp;gt;&amp;gt;= 1;</span></span>
<span class="line"><span>        shift--;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return mul_u64_u32_shr(delta_exec, fact, shift);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static inline u64 calc_delta_fair(u64 delta, struct sched_entity *se)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (unlikely(se-&amp;gt;load.weight != NICE_0_LOAD))</span></span>
<span class="line"><span>        delta = __calc_delta(delta, NICE_0_LOAD, &amp;se-&amp;gt;load);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return delta;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照上面的理论，调用__calc_delta函数的时候，传递的weight参数是NICE_0_LOAD，lw参数正是调度实体中的load_weight结构体。</p><p><strong>到这里，我要公开一个问题，在运行队列中用红黑树结构组织进程的调度实体，这里进程虚拟时间正是红黑树的key，这样进程就以进程的虚拟时间被红黑树组织起来了。红黑树的最左子节点，就是虚拟时间最小的进程，随着时间的推移进程会从红黑树的左边跑到右，然后从右边跑到左边，就像舞蹈一样优美。</strong></p><h2 id="cfs调度进程" tabindex="-1">CFS调度进程 <a class="header-anchor" href="#cfs调度进程" aria-label="Permalink to &quot;CFS调度进程&quot;">​</a></h2><p>根据前面的内容，我们得知CFS调度器就是要维持各个可运行进程的虚拟时间相等，不相等就需要被调度运行。如果一个进程比其它进程的虚拟时间小，它就应该运行达到和其它进程的虚拟时间持平，直到它的虚拟时间超过其它进程，这时就要停下来，这样其它进程才能被调度运行。</p><h3 id="定时周期调度" tabindex="-1">定时周期调度 <a class="header-anchor" href="#定时周期调度" aria-label="Permalink to &quot;定时周期调度&quot;">​</a></h3><p>前面虚拟时间的方案还存在问题，你发现了么？</p><p>没错，虚拟时间就是一个数据，如果没有任何机制对它进行更新，就会导致一个进程永远运行下去，因为那个进程的虚拟时间没有更新，虚拟时间永远最小，这当然不行。</p><p>因此定时周期调度机制应运而生。Linux启动会启动定时器，这个定时器每1/1000、1/250、1/100秒（根据配置不同选取其一），产生一个时钟中断，在中断处理函数中最终会调用一个scheduler_tick函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void update_curr(struct cfs_rq *cfs_rq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct sched_entity *curr = cfs_rq-&amp;gt;curr;</span></span>
<span class="line"><span>    u64 now = rq_clock_task(rq_of(cfs_rq));//获取当前时间</span></span>
<span class="line"><span>    u64 delta_exec;</span></span>
<span class="line"><span>    delta_exec = now - curr-&amp;gt;exec_start;//间隔时间</span></span>
<span class="line"><span>    curr-&amp;gt;exec_start = now;</span></span>
<span class="line"><span>    curr-&amp;gt;sum_exec_runtime += delta_exec;//累计运行时间</span></span>
<span class="line"><span>    curr-&amp;gt;vruntime += calc_delta_fair(delta_exec, curr);//计算进程的虚拟时间</span></span>
<span class="line"><span>    update_min_vruntime(cfs_rq);//更新运行队列中的最小虚拟时间，这是新建进程的虚拟时间，避免一个新建进程因为虚拟时间太小而长时间占用CPU</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static void entity_tick(struct cfs_rq *cfs_rq, struct sched_entity *curr, int queued)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    update_curr(cfs_rq);//更新当前运行进程和运行队列相关的时间</span></span>
<span class="line"><span>    if (cfs_rq-&amp;gt;nr_running &amp;gt; 1)//当运行进程数量大于1就检查是否可抢占</span></span>
<span class="line"><span>        check_preempt_tick(cfs_rq, curr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#define for_each_sched_entity(se) \\</span></span>
<span class="line"><span>        for (; se; se = NULL)</span></span>
<span class="line"><span>static void task_tick_fair(struct rq *rq, struct task_struct *curr, int queued)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct cfs_rq *cfs_rq;</span></span>
<span class="line"><span>    struct sched_entity *se = &amp;curr-&amp;gt;se;//获取当前进程的调度实体</span></span>
<span class="line"><span>    for_each_sched_entity(se) {//仅对当前进程的调度实体</span></span>
<span class="line"><span>        cfs_rq = cfs_rq_of(se);//获取当前进程的调度实体对应运行队列</span></span>
<span class="line"><span>        entity_tick(cfs_rq, se, queued);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void scheduler_tick(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int cpu = smp_processor_id();</span></span>
<span class="line"><span>    struct rq *rq = cpu_rq(cpu);//获取运行CPU运行进程队列</span></span>
<span class="line"><span>    struct task_struct *curr = rq-&amp;gt;curr;//获取当进程</span></span>
<span class="line"><span>    update_rq_clock(rq);//更新运行队列的时间等数据</span></span>
<span class="line"><span>    curr-&amp;gt;sched_class-&amp;gt;task_tick(rq, curr, 0);//更新当前时间的虚拟时间</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，scheduler_tick函数会调用进程调度类的task_tick函数，对于CFS调度器就是task_tick_fair函数。但是真正做事的是 <strong>entity_tick函数</strong>，entity_tick函数中调用了update_curr函数更新当前进程虚拟时间，这个函数我们在之前讨论过了，还更新了运行队列的相关数据。</p><p>entity_tick函数的最后，调用了check_preempt_tick函数，用来检查是否可以抢占调度，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void check_preempt_tick(struct cfs_rq *cfs_rq, struct sched_entity *curr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned long ideal_runtime, delta_exec;</span></span>
<span class="line"><span>    struct sched_entity *se;</span></span>
<span class="line"><span>    s64 delta;</span></span>
<span class="line"><span>    //计算当前进程在本次调度中分配的运行时间</span></span>
<span class="line"><span>    ideal_runtime = sched_slice(cfs_rq, curr);</span></span>
<span class="line"><span>    //当前进程已经运行的实际时间</span></span>
<span class="line"><span>    delta_exec = curr-&amp;gt;sum_exec_runtime - curr-&amp;gt;prev_sum_exec_runtime;</span></span>
<span class="line"><span>    //如果实际运行时间已经超过分配给进程的运行时间，就需要抢占当前进程。设置进程的TIF_NEED_RESCHED抢占标志。</span></span>
<span class="line"><span>    if (delta_exec &amp;gt; ideal_runtime) {</span></span>
<span class="line"><span>        resched_curr(rq_of(cfs_rq));</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //因此如果进程运行时间小于最小调度粒度时间，不应该抢占</span></span>
<span class="line"><span>    if (delta_exec &amp;lt; sysctl_sched_min_granularity)</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    //从红黑树中找到虚拟时间最小的调度实体</span></span>
<span class="line"><span>    se = __pick_first_entity(cfs_rq);</span></span>
<span class="line"><span>    delta = curr-&amp;gt;vruntime - se-&amp;gt;vruntime;</span></span>
<span class="line"><span>    //如果当前进程的虚拟时间仍然比红黑树中最左边调度实体虚拟时间小，也不应该发生调度</span></span>
<span class="line"><span>    if (delta &amp;lt; 0)</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>刚才的代码你可以这样理解，如果需要抢占就会调用resched_curr函数设置进程的抢占标志，但是这个函数本身不会调用进程调度器函数，而是在进程从中断或者系统调用返回到用户态空间时，检查当前进程的调度标志，然后根据需要调用进程调度器函数。</p><h3 id="调度器入口" tabindex="-1">调度器入口 <a class="header-anchor" href="#调度器入口" aria-label="Permalink to &quot;调度器入口&quot;">​</a></h3><p>如果设计需要进行进程抢占调度，Linux就会在适当的时机进行进程调度，进程调度就是调用进程调度器入口函数，该函数会选择一个最合适投入运行的进程，然后切换到该进程上运行。</p><p>我们先来看看，进程调度器入口函数的代码长什么样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void __sched notrace __schedule(bool preempt)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct task_struct *prev, *next;</span></span>
<span class="line"><span>    unsigned long *switch_count;</span></span>
<span class="line"><span>    unsigned long prev_state;</span></span>
<span class="line"><span>    struct rq_flags rf;</span></span>
<span class="line"><span>    struct rq *rq;</span></span>
<span class="line"><span>    int cpu;</span></span>
<span class="line"><span>    cpu = smp_processor_id();</span></span>
<span class="line"><span>    rq = cpu_rq(cpu);//获取当前CPU的运行队列</span></span>
<span class="line"><span>    prev = rq-&amp;gt;curr; //获取当前进程</span></span>
<span class="line"><span>    rq_lock(rq, &amp;rf);//运行队列加锁</span></span>
<span class="line"><span>    update_rq_clock(rq);//更新运行队列时钟</span></span>
<span class="line"><span>    switch_count = &amp;prev-&amp;gt;nivcsw;</span></span>
<span class="line"><span>    next = pick_next_task(rq, prev, &amp;rf);//获取下一个投入运行的进程</span></span>
<span class="line"><span>    clear_tsk_need_resched(prev); //清除抢占标志</span></span>
<span class="line"><span>    clear_preempt_need_resched();</span></span>
<span class="line"><span>    if (likely(prev != next)) {//当前运行进程和下一个运行进程不同，就要进程切换</span></span>
<span class="line"><span>        rq-&amp;gt;nr_switches++; //切换计数统计</span></span>
<span class="line"><span>        ++*switch_count;</span></span>
<span class="line"><span>        rq = context_switch(rq, prev, next, &amp;rf);//进程机器上下文切换</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        rq-&amp;gt;clock_update_flags &amp;= ~(RQCF_ACT_SKIP|RQCF_REQ_SKIP);</span></span>
<span class="line"><span>        rq_unlock_irq(rq, &amp;rf);//解锁运行队列</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void schedule(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct task_struct *tsk = current;//获取当前进程</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        preempt_disable();//关闭内核抢占</span></span>
<span class="line"><span>        __schedule(false);//进程调用</span></span>
<span class="line"><span>        sched_preempt_enable_no_resched();//开启内核抢占</span></span>
<span class="line"><span>    } while (need_resched());//是否需要再次重新调用</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>之所以在循环中调用__schedule函数执行真正的进程调度，是因为在执行调度的过程中，有些更高优先级的进程进入了可运行状态，因此它就要抢占当前进程。</p><p>__schedule函数中会更新一些统计数据，然后调用pick_next_task函数挑选出下一个进程投入运行。最后，如果当前进程和下一个要运行的进程不同，就要进行进程机器上下文切换，其中会切换地址空间和CPU寄存器。</p><h3 id="挑选下一个进程" tabindex="-1">挑选下一个进程 <a class="header-anchor" href="#挑选下一个进程" aria-label="Permalink to &quot;挑选下一个进程&quot;">​</a></h3><p>在__schedule函数中，获取了正在运行的进程，更新了运行队列的时钟，下面就要挑选出下一个投入运行的进程。显然，不是随便挑选一个，我们这就来看看调度器是如何挑选的。</p><p>挑选下一个运行进程这个过程，是在pick_next_task函数中完成的，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct task_struct *pick_next_task(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    const struct sched_class *class;</span></span>
<span class="line"><span>    struct task_struct *p;</span></span>
<span class="line"><span>    //这是对CFS的一种优化处理，因为大部分进程属于CFS管理</span></span>
<span class="line"><span>    if (likely(prev-&amp;gt;sched_class &amp;lt;= &amp;fair_sched_class &amp;&amp;</span></span>
<span class="line"><span>           rq-&amp;gt;nr_running == rq-&amp;gt;cfs.h_nr_running)) {</span></span>
<span class="line"><span>        p = pick_next_task_fair(rq, prev, rf);//调用CFS的对应的函数</span></span>
<span class="line"><span>        if (unlikely(p == RETRY_TASK))</span></span>
<span class="line"><span>            goto restart;</span></span>
<span class="line"><span>        if (!p) {//如果没有获取到运行进程</span></span>
<span class="line"><span>            put_prev_task(rq, prev);//将上一个进程放回运行队列中</span></span>
<span class="line"><span>            p = pick_next_task_idle(rq);//获取空转进程</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>restart:</span></span>
<span class="line"><span>    for_each_class(class) {//依次从最高优先级的调度类开始遍历</span></span>
<span class="line"><span>        p = class-&amp;gt;pick_next_task(rq);</span></span>
<span class="line"><span>        if (p)//如果在一个调度类所管理的运行队列中挑选到一个进程，立即返回</span></span>
<span class="line"><span>            return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    BUG();//出错</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你看，pick_next_task函数只是个框架函数，它的逻辑也很清楚，会依照优先级调用具体调度器类的函数完成工作，对于CFS则会调用pick_next_task_fair函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct task_struct *pick_next_task_fair(struct rq *rq, struct task_struct *prev, struct rq_flags *rf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct cfs_rq *cfs_rq = &amp;rq-&amp;gt;cfs;</span></span>
<span class="line"><span>    struct sched_entity *se;</span></span>
<span class="line"><span>    struct task_struct *p;</span></span>
<span class="line"><span>    if (prev)</span></span>
<span class="line"><span>        put_prev_task(rq, prev);//把上一个进程放回运行队列</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        se = pick_next_entity(cfs_rq, NULL);//选择最适合运行的调度实体</span></span>
<span class="line"><span>        set_next_entity(cfs_rq, se);//对选择的调度实体进行一些处理</span></span>
<span class="line"><span>        cfs_rq = group_cfs_rq(se);</span></span>
<span class="line"><span>    } while (cfs_rq);//在没有调度组的情况下，循环一次就结束了</span></span>
<span class="line"><span>    p = task_of(se);//通过se获取包含se的进程task_struct</span></span>
<span class="line"><span>    return p;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中调用pick_next_entity函数选择虚拟时间最小的调度实体，然后调用set_next_entity函数，对选择的调度实体进行一些必要的处理，主要是将这调度实体从运行队列中拿出来。</p><p>pick_next_entity函数具体要怎么工作呢？</p><p>首先，它调用了相关函数，从运行队列上的红黑树中查找虚拟时间最少的调度实体，然后处理要跳过调度的情况，最后决定挑选的调度实体是否可以抢占并返回它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sched_entity *__pick_first_entity(struct cfs_rq *cfs_rq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct rb_node *left = rb_first_cached(&amp;cfs_rq-&amp;gt;tasks_timeline);//先读取在tasks_timeline中rb_node指针</span></span>
<span class="line"><span>    if (!left)</span></span>
<span class="line"><span>        return NULL;//如果为空直接返回NULL</span></span>
<span class="line"><span>    //通过红黑树结点指针取得包含它的调度实体结构地址</span></span>
<span class="line"><span>    return rb_entry(left, struct sched_entity, run_node);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static struct sched_entity *__pick_next_entity(struct sched_entity *se)</span></span>
<span class="line"><span>{    //获取当前红黑树节点的下一个结点</span></span>
<span class="line"><span>    struct rb_node *next = rb_next(&amp;se-&amp;gt;run_node);</span></span>
<span class="line"><span>    if (!next)</span></span>
<span class="line"><span>        return NULL;//如果为空直接返回NULL</span></span>
<span class="line"><span>    return rb_entry(next, struct sched_entity, run_node);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static struct sched_entity *pick_next_entity(struct cfs_rq *cfs_rq, struct sched_entity *curr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取Cfs_rq中的红黑树上最左节点上调度实体，虚拟时间最小</span></span>
<span class="line"><span>    struct sched_entity *left = __pick_first_entity(cfs_rq);</span></span>
<span class="line"><span>    struct sched_entity *se;</span></span>
<span class="line"><span>    if (!left || (curr &amp;&amp; entity_before(curr, left)))</span></span>
<span class="line"><span>        left = curr;//可能当前进程主动放弃CPU，它的虚拟时间比红黑树上的还小，所以left指向当前进程调度实体</span></span>
<span class="line"><span>    se = left;</span></span>
<span class="line"><span>    if (cfs_rq-&amp;gt;skip == se) { //如果选择的调度实体是要跳过的调度实体</span></span>
<span class="line"><span>        struct sched_entity *second;</span></span>
<span class="line"><span>        if (se == curr) {//如果是当前调度实体</span></span>
<span class="line"><span>            second = __pick_first_entity(cfs_rq);//选择运行队列中虚拟时间最小的调度实体</span></span>
<span class="line"><span>        } else {//否则选择红黑树上第二左的进程节点</span></span>
<span class="line"><span>            second = __pick_next_entity(se);</span></span>
<span class="line"><span>            //如果次优的调度实体的虚拟时间，还是比当前的调度实体的虚拟时间大</span></span>
<span class="line"><span>            if (!second || (curr &amp;&amp; entity_before(curr, second)))</span></span>
<span class="line"><span>                second = curr;//让次优的调度实体也指向当前调度实体</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //判断left和second的虚拟时间的差距是否小于sysctl_sched_wakeup_granularity</span></span>
<span class="line"><span>        if (second &amp;&amp; wakeup_preempt_entity(second, left) &amp;lt; 1)</span></span>
<span class="line"><span>            se = second;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (cfs_rq-&amp;gt;next &amp;&amp; wakeup_preempt_entity(cfs_rq-&amp;gt;next, left) &amp;lt; 1) {</span></span>
<span class="line"><span>        se = cfs_rq-&amp;gt;next;</span></span>
<span class="line"><span>    } else if (cfs_rq-&amp;gt;last &amp;&amp; wakeup_preempt_entity(cfs_rq-&amp;gt;last, left) &amp;lt; 1) {</span></span>
<span class="line"><span>             se = cfs_rq-&amp;gt;last;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    clear_buddies(cfs_rq, se);//需要清除掉last、next、skip指针</span></span>
<span class="line"><span>    return se;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码的调用路径最终会返回到__schedule函数中，这个函数中就是上一个运行的进程和将要投入运行的下一个进程，最后调用context_switch函数，完成两个进程的地址空间和机器上下文的切换，一次进程调度工作结束。这个机制和我们的Cosmos的 <strong>save_to_new_context函数</strong> 类似，不再赘述。</p><p>至此CFS调度器的基本概念与数据结构，还有算法实现，我们就搞清楚了，核心就是 <strong>让虚拟时间最小的进程最先运行， 一旦进程运行虚拟时间就会增加，最后尽量保证所有进程的虚拟时间相等，谁小了就要多运行，谁大了就要暂停运行。</strong></p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>Linux如何表示一个进程以及如何进行多个进程调度，我们已经搞清楚了。我们来总结一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/bd82db725228db2b69cbbceef088a950.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/393350/bd82db725228db2b69cbbceef088a950.jpg" alt=""></a></p><p>你可能在想。为什么要用红黑树来组织调度实体？这是因为要维护虚拟时间的顺序，又要从中频繁的删除和插入调度实体，这种情况下红黑树这种结构无疑是非常好，如果你有更好的选择，可以向Linux社区提交补丁。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>想一想，Linux进程的优先级和Linux调度类的优先级是一回事儿吗？</p><p>欢迎你在留言区记录你的学习经验或者个我交流讨论，也欢迎你把这节课转发给需要的朋友。</p><p>好，我是LMOS，我们下节课见！</p>`,144)])])}const h=n(t,[["render",l]]);export{d as __pageData,h as default};
