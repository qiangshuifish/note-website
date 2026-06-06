import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"19 | 线程的创建：如何执行一个新子项目？","description":"","frontmatter":{},"headers":[{"level":2,"title":"用户态创建线程","slug":"用户态创建线程","link":"#用户态创建线程","children":[]},{"level":2,"title":"内核态创建任务","slug":"内核态创建任务","link":"#内核态创建任务","children":[]},{"level":2,"title":"用户态执行线程","slug":"用户态执行线程","link":"#用户态执行线程","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/19-线程的创建：如何执行一个新子项目？.md","filePath":"趣谈Linux操作系统/19-线程的创建：如何执行一个新子项目？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/19-线程的创建：如何执行一个新子项目？.md"};function l(i,s,c,r,d,o){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_19-线程的创建-如何执行一个新子项目" tabindex="-1">19 | 线程的创建：如何执行一个新子项目？ <a class="header-anchor" href="#_19-线程的创建-如何执行一个新子项目" aria-label="Permalink to &quot;19 | 线程的创建：如何执行一个新子项目？&quot;">​</a></h1><p>上一节，我们了解了进程创建的整个过程，今天我们来看线程创建的过程。</p><p>我们前面已经写过多线程编程的程序了，你应该都知道创建一个线程调用的是pthread_create，可你知道它背后的机制吗？</p><h2 id="用户态创建线程" tabindex="-1">用户态创建线程 <a class="header-anchor" href="#用户态创建线程" aria-label="Permalink to &quot;用户态创建线程&quot;">​</a></h2><p>你可能会问，咱们之前不是讲过了吗？无论是进程还是线程，在内核里面都是任务，管起来不是都一样吗？但是问题来了，如果两个完全一样，那为什么咱们前两节写的程序差别那么大？如果不一样，那怎么在内核里面加以区分呢？</p><p>其实，线程不是一个完全由内核实现的机制，它是由内核态和用户态合作完成的。pthread_create不是一个系统调用，是Glibc库的一个函数，所以我们还要去Glibc里面去找线索。</p><p>果然，我们在nptl/pthread_create.c里面找到了这个函数。这里的参数我们应该比较熟悉了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __pthread_create_2_1 (pthread_t *newthread, const pthread_attr_t *attr, void *(*start_routine) (void *), void *arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>versioned_symbol (libpthread, __pthread_create_2_1, pthread_create, GLIBC_2_1);</span></span></code></pre></div><p>下面我们依次来看这个函数做了些啥。</p><p>首先处理的是线程的属性参数。例如前面写程序的时候，我们设置的线程栈大小。如果没有传入线程属性，就取默认值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct pthread_attr *iattr = (struct pthread_attr *) attr;</span></span>
<span class="line"><span>struct pthread_attr default_attr;</span></span>
<span class="line"><span>if (iattr == NULL)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  iattr = &amp;default_attr;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，就像在内核里一样，每一个进程或者线程都有一个task_struct结构，在用户态也有一个用于维护线程的结构，就是这个pthread结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct pthread *pd = NULL;</span></span></code></pre></div><p>凡是涉及函数的调用，都要使用到栈。每个线程也有自己的栈。那接下来就是创建线程栈了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int err = ALLOCATE_STACK (iattr, &amp;pd);</span></span></code></pre></div><p>ALLOCATE_STACK是一个宏，我们找到它的定义之后，发现它其实就是一个函数。只是，这个函数有些复杂，所以我这里把主要的代码列一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># define ALLOCATE_STACK(attr, pd) allocate_stack (attr, pd, &amp;stackaddr)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int</span></span>
<span class="line"><span>allocate_stack (const struct pthread_attr *attr, struct pthread **pdp,</span></span>
<span class="line"><span>                ALLOCATE_STACK_PARMS)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  struct pthread *pd;</span></span>
<span class="line"><span>  size_t size;</span></span>
<span class="line"><span>  size_t pagesize_m1 = __getpagesize () - 1;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  size = attr-&amp;gt;stacksize;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  /* Allocate some anonymous memory.  If possible use the cache.  */</span></span>
<span class="line"><span>  size_t guardsize;</span></span>
<span class="line"><span>  void *mem;</span></span>
<span class="line"><span>  const int prot = (PROT_READ | PROT_WRITE</span></span>
<span class="line"><span>                   | ((GL(dl_stack_flags) &amp; PF_X) ? PROT_EXEC : 0));</span></span>
<span class="line"><span>  /* Adjust the stack size for alignment.  */</span></span>
<span class="line"><span>  size &amp;= ~__static_tls_align_m1;</span></span>
<span class="line"><span>  /* Make sure the size of the stack is enough for the guard and</span></span>
<span class="line"><span>  eventually the thread descriptor.  */</span></span>
<span class="line"><span>  guardsize = (attr-&amp;gt;guardsize + pagesize_m1) &amp; ~pagesize_m1;</span></span>
<span class="line"><span>  size += guardsize;</span></span>
<span class="line"><span>  pd = get_cached_stack (&amp;size, &amp;mem);</span></span>
<span class="line"><span>  if (pd == NULL)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    /* If a guard page is required, avoid committing memory by first</span></span>
<span class="line"><span>    allocate with PROT_NONE and then reserve with required permission</span></span>
<span class="line"><span>    excluding the guard page.  */</span></span>
<span class="line"><span>	mem = __mmap (NULL, size, (guardsize == 0) ? prot : PROT_NONE,</span></span>
<span class="line"><span>			MAP_PRIVATE | MAP_ANONYMOUS | MAP_STACK, -1, 0);</span></span>
<span class="line"><span>    /* Place the thread descriptor at the end of the stack.  */</span></span>
<span class="line"><span>#if TLS_TCB_AT_TP</span></span>
<span class="line"><span>    pd = (struct pthread *) ((char *) mem + size) - 1;</span></span>
<span class="line"><span>#elif TLS_DTV_AT_TP</span></span>
<span class="line"><span>    pd = (struct pthread *) ((((uintptr_t) mem + size - __static_tls_size) &amp; ~__static_tls_align_m1) - TLS_PRE_TCB_SIZE);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    /* Now mprotect the required region excluding the guard area. */</span></span>
<span class="line"><span>    char *guard = guard_position (mem, size, guardsize, pd, pagesize_m1);</span></span>
<span class="line"><span>    setup_stack_prot (mem, size, guard, guardsize, prot);</span></span>
<span class="line"><span>    pd-&amp;gt;stackblock = mem;</span></span>
<span class="line"><span>    pd-&amp;gt;stackblock_size = size;</span></span>
<span class="line"><span>    pd-&amp;gt;guardsize = guardsize;</span></span>
<span class="line"><span>    pd-&amp;gt;specific[0] = pd-&amp;gt;specific_1stblock;</span></span>
<span class="line"><span>    /* And add to the list of stacks in use.  */</span></span>
<span class="line"><span>    stack_list_add (&amp;pd-&amp;gt;list, &amp;stack_used);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  *pdp = pd;</span></span>
<span class="line"><span>  void *stacktop;</span></span>
<span class="line"><span># if TLS_TCB_AT_TP</span></span>
<span class="line"><span>  /* The stack begins before the TCB and the static TLS block.  */</span></span>
<span class="line"><span>  stacktop = ((char *) (pd + 1) - __static_tls_size);</span></span>
<span class="line"><span># elif TLS_DTV_AT_TP</span></span>
<span class="line"><span>  stacktop = (char *) (pd - 1);</span></span>
<span class="line"><span># endif</span></span>
<span class="line"><span>  *stack = stacktop;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们来看一下，allocate_stack主要做了以下这些事情：</p><ul><li><p>如果你在线程属性里面设置过栈的大小，需要你把设置的值拿出来；</p></li><li><p>为了防止栈的访问越界，在栈的末尾会有一块空间guardsize，一旦访问到这里就错误了；</p></li><li><p>其实线程栈是在进程的堆里面创建的。如果一个进程不断地创建和删除线程，我们不可能不断地去申请和清除线程栈使用的内存块，这样就需要有一个缓存。get_cached_stack就是根据计算出来的size大小，看一看已经有的缓存中，有没有已经能够满足条件的；</p></li><li><p>如果缓存里面没有，就需要调用__mmap创建一块新的，系统调用那一节我们讲过，如果要在堆里面malloc一块内存，比较大的话，用__mmap；</p></li><li><p>线程栈也是自顶向下生长的，还记得每个线程要有一个pthread结构，这个结构也是放在栈的空间里面的。在栈底的位置，其实是地址最高位；</p></li><li><p>计算出guard内存的位置，调用setup_stack_prot设置这块内存的是受保护的；</p></li><li><p>接下来，开始填充pthread这个结构里面的成员变量stackblock、stackblock_size、guardsize、specific。这里的specific是用于存放Thread Specific Data的，也即属于线程的全局变量；</p></li><li><p>将这个线程栈放到stack_used链表中，其实管理线程栈总共有两个链表，一个是stack_used，也就是这个栈正被使用；另一个是stack_cache，就是上面说的，一旦线程结束，先缓存起来，不释放，等有其他的线程创建的时候，给其他的线程用。</p></li></ul><p>搞定了用户态栈的问题，其实用户态的事情基本搞定了一半。</p><h2 id="内核态创建任务" tabindex="-1">内核态创建任务 <a class="header-anchor" href="#内核态创建任务" aria-label="Permalink to &quot;内核态创建任务&quot;">​</a></h2><p>接下来，我们接着pthread_create看。其实有了用户态的栈，接着需要解决的就是用户态的程序从哪里开始运行的问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pd-&amp;gt;start_routine = start_routine;</span></span>
<span class="line"><span>pd-&amp;gt;arg = arg;</span></span>
<span class="line"><span>pd-&amp;gt;schedpolicy = self-&amp;gt;schedpolicy;</span></span>
<span class="line"><span>pd-&amp;gt;schedparam = self-&amp;gt;schedparam;</span></span>
<span class="line"><span>/* Pass the descriptor to the caller.  */</span></span>
<span class="line"><span>*newthread = (pthread_t) pd;</span></span>
<span class="line"><span>atomic_increment (&amp;__nptl_nthreads);</span></span>
<span class="line"><span>retval = create_thread (pd, iattr, &amp;stopped_start, STACK_VARIABLES_ARGS, &amp;thread_ran);</span></span></code></pre></div><p>start_routine就是咱们给线程的函数，start_routine，start_routine的参数arg，以及调度策略都要赋值给pthread。</p><p>接下来__nptl_nthreads加一，说明又多了一个线程。</p><p>真正创建线程的是调用create_thread函数，这个函数定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int</span></span>
<span class="line"><span>create_thread (struct pthread *pd, const struct pthread_attr *attr,</span></span>
<span class="line"><span>bool *stopped_start, STACK_VARIABLES_PARMS, bool *thread_ran)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  const int clone_flags = (CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SYSVSEM | CLONE_SIGHAND | CLONE_THREAD | CLONE_SETTLS | CLONE_PARENT_SETTID | CLONE_CHILD_CLEARTID | 0);</span></span>
<span class="line"><span>  ARCH_CLONE (&amp;start_thread, STACK_VARIABLES_ARGS, clone_flags, pd, &amp;pd-&amp;gt;tid, tp, &amp;pd-&amp;gt;tid)；</span></span>
<span class="line"><span>  /* It&#39;s started now, so if we fail below, we&#39;ll have to cancel it</span></span>
<span class="line"><span>and let it clean itself up.  */</span></span>
<span class="line"><span>  *thread_ran = true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面有很长的clone_flags，这些咱们原来一直没注意，不过接下来的过程，我们要特别的关注一下这些标志位。</p><p>然后就是ARCH_CLONE，其实调用的是__clone。看到这里，你应该就有感觉了，马上就要到系统调用了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># define ARCH_CLONE __clone</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* The userland implementation is:</span></span>
<span class="line"><span>   int clone (int (*fn)(void *arg), void *child_stack, int flags, void *arg),</span></span>
<span class="line"><span>   the kernel entry is:</span></span>
<span class="line"><span>   int clone (long flags, void *child_stack).</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   The parameters are passed in register and on the stack from userland:</span></span>
<span class="line"><span>   rdi: fn</span></span>
<span class="line"><span>   rsi: child_stack</span></span>
<span class="line"><span>   rdx: flags</span></span>
<span class="line"><span>   rcx: arg</span></span>
<span class="line"><span>   r8d: TID field in parent</span></span>
<span class="line"><span>   r9d: thread pointer</span></span>
<span class="line"><span>%esp+8: TID field in child</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   The kernel expects:</span></span>
<span class="line"><span>   rax: system call number</span></span>
<span class="line"><span>   rdi: flags</span></span>
<span class="line"><span>   rsi: child_stack</span></span>
<span class="line"><span>   rdx: TID field in parent</span></span>
<span class="line"><span>   r10: TID field in child</span></span>
<span class="line"><span>   r8:  thread pointer  */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        .text</span></span>
<span class="line"><span>ENTRY (__clone)</span></span>
<span class="line"><span>        movq    $-EINVAL,%rax</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        /* Insert the argument onto the new stack.  */</span></span>
<span class="line"><span>        subq    $16,%rsi</span></span>
<span class="line"><span>        movq    %rcx,8(%rsi)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* Save the function pointer.  It will be popped off in the</span></span>
<span class="line"><span>           child in the ebx frobbing below.  */</span></span>
<span class="line"><span>        movq    %rdi,0(%rsi)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* Do the system call.  */</span></span>
<span class="line"><span>        movq    %rdx, %rdi</span></span>
<span class="line"><span>        movq    %r8, %rdx</span></span>
<span class="line"><span>        movq    %r9, %r8</span></span>
<span class="line"><span>        mov     8(%rsp), %R10_LP</span></span>
<span class="line"><span>        movl    $SYS_ify(clone),%eax</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        syscall</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>PSEUDO_END (__clone)</span></span></code></pre></div><p>如果对于汇编不太熟悉也没关系，你可以重点看上面的注释。</p><p>我们能看到最后调用了syscall，这一点clone和我们原来熟悉的其他系统调用几乎是一致的。但是，也有少许不一样的地方。</p><p>如果在进程的主线程里面调用其他系统调用，当前用户态的栈是指向整个进程的栈，栈顶指针也是指向进程的栈，指令指针也是指向进程的主线程的代码。此时此刻执行到这里，调用clone的时候，用户态的栈、栈顶指针、指令指针和其他系统调用一样，都是指向主线程的。</p><p>但是对于线程来说，这些都要变。因为我们希望当clone这个系统调用成功的时候，除了内核里面有这个线程对应的task_struct，当系统调用返回到用户态的时候，用户态的栈应该是线程的栈，栈顶指针应该指向线程的栈，指令指针应该指向线程将要执行的那个函数。</p><p>所以这些都需要我们自己做，将线程要执行的函数的参数和指令的位置都压到栈里面，当从内核返回，从栈里弹出来的时候，就从这个函数开始，带着这些参数执行下去。</p><p>接下来我们就要进入内核了。内核里面对于clone系统调用的定义是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE5(clone, unsigned long, clone_flags, unsigned long, newsp,</span></span>
<span class="line"><span>		 int __user *, parent_tidptr,</span></span>
<span class="line"><span>		 int __user *, child_tidptr,</span></span>
<span class="line"><span>		 unsigned long, tls)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return _do_fork(clone_flags, newsp, 0, parent_tidptr, child_tidptr, tls);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到这里，发现了熟悉的面孔_do_fork，是不是轻松了一些？上一节我们已经沿着它的逻辑过了一遍了。这里我们重点关注几个区别。</p><p>第一个是上面 <strong>复杂的标志位设定</strong>，我们来看都影响了什么。</p><p>对于copy_files，原来是调用dup_fd复制一个files_struct的，现在因为CLONE_FILES标识位变成将原来的files_struct引用计数加一。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int copy_files(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct files_struct *oldf, *newf;</span></span>
<span class="line"><span>	oldf = current-&amp;gt;files;</span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_FILES) {</span></span>
<span class="line"><span>		atomic_inc(&amp;oldf-&amp;gt;count);</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	newf = dup_fd(oldf, &amp;error);</span></span>
<span class="line"><span>	tsk-&amp;gt;files = newf;</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>	return error;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于copy_fs，原来是调用copy_fs_struct复制一个fs_struct，现在因为CLONE_FS标识位变成将原来的fs_struct的用户数加一。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int copy_fs(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct fs_struct *fs = current-&amp;gt;fs;</span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_FS) {</span></span>
<span class="line"><span>		fs-&amp;gt;users++;</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	tsk-&amp;gt;fs = copy_fs_struct(fs);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于copy_sighand，原来是创建一个新的sighand_struct，现在因为CLONE_SIGHAND标识位变成将原来的sighand_struct引用计数加一。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int copy_sighand(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sighand_struct *sig;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_SIGHAND) {</span></span>
<span class="line"><span>		atomic_inc(&amp;current-&amp;gt;sighand-&amp;gt;count);</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	sig = kmem_cache_alloc(sighand_cachep, GFP_KERNEL);</span></span>
<span class="line"><span>	atomic_set(&amp;sig-&amp;gt;count, 1);</span></span>
<span class="line"><span>	memcpy(sig-&amp;gt;action, current-&amp;gt;sighand-&amp;gt;action, sizeof(sig-&amp;gt;action));</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于copy_signal，原来是创建一个新的signal_struct，现在因为CLONE_THREAD直接返回了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int copy_signal(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct signal_struct *sig;</span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_THREAD)</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	sig = kmem_cache_zalloc(signal_cachep, GFP_KERNEL);</span></span>
<span class="line"><span>	tsk-&amp;gt;signal = sig;</span></span>
<span class="line"><span>    init_sigpending(&amp;sig-&amp;gt;shared_pending);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于copy_mm，原来是调用dup_mm复制一个mm_struct，现在因为CLONE_VM标识位而直接指向了原来的mm_struct。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int copy_mm(unsigned long clone_flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct mm_struct *mm, *oldmm;</span></span>
<span class="line"><span>	oldmm = current-&amp;gt;mm;</span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_VM) {</span></span>
<span class="line"><span>		mmget(oldmm);</span></span>
<span class="line"><span>		mm = oldmm;</span></span>
<span class="line"><span>		goto good_mm;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	mm = dup_mm(tsk);</span></span>
<span class="line"><span>good_mm:</span></span>
<span class="line"><span>	tsk-&amp;gt;mm = mm;</span></span>
<span class="line"><span>	tsk-&amp;gt;active_mm = mm;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二个就是 <strong>对于亲缘关系的影响</strong>，毕竟我们要识别多个线程是不是属于一个进程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>p-&amp;gt;pid = pid_nr(pid);</span></span>
<span class="line"><span>if (clone_flags &amp; CLONE_THREAD) {</span></span>
<span class="line"><span>	p-&amp;gt;exit_signal = -1;</span></span>
<span class="line"><span>	p-&amp;gt;group_leader = current-&amp;gt;group_leader;</span></span>
<span class="line"><span>	p-&amp;gt;tgid = current-&amp;gt;tgid;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>	if (clone_flags &amp; CLONE_PARENT)</span></span>
<span class="line"><span>		p-&amp;gt;exit_signal = current-&amp;gt;group_leader-&amp;gt;exit_signal;</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		p-&amp;gt;exit_signal = (clone_flags &amp; CSIGNAL);</span></span>
<span class="line"><span>	p-&amp;gt;group_leader = p;</span></span>
<span class="line"><span>	p-&amp;gt;tgid = p-&amp;gt;pid;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	/* CLONE_PARENT re-uses the old parent */</span></span>
<span class="line"><span>if (clone_flags &amp; (CLONE_PARENT|CLONE_THREAD)) {</span></span>
<span class="line"><span>	p-&amp;gt;real_parent = current-&amp;gt;real_parent;</span></span>
<span class="line"><span>	p-&amp;gt;parent_exec_id = current-&amp;gt;parent_exec_id;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>	p-&amp;gt;real_parent = current;</span></span>
<span class="line"><span>	p-&amp;gt;parent_exec_id = current-&amp;gt;self_exec_id;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面的代码可以看出，使用了CLONE_THREAD标识位之后，使得亲缘关系有了一定的变化。</p><ul><li><p>如果是新进程，那这个进程的group_leader就是它自己，tgid是它自己的pid，这就完全重打锣鼓另开张了，自己是线程组的头。如果是新线程，group_leader是当前进程的，group_leader，tgid是当前进程的tgid，也就是当前进程的pid，这个时候还是拜原来进程为老大。</p></li><li><p>如果是新进程，新进程的real_parent是当前的进程，在进程树里面又见一辈人；如果是新线程，线程的real_parent是当前的进程的real_parent，其实是平辈的。</p></li></ul><p>第三， <strong>对于信号的处理</strong>，如何保证发给进程的信号虽然可以被一个线程处理，但是影响范围应该是整个进程的。例如，kill一个进程，则所有线程都要被干掉。如果一个信号是发给一个线程的pthread_kill，则应该只有线程能够收到。</p><p>在copy_process的主流程里面，无论是创建进程还是线程，都会初始化struct sigpending pending，也就是每个task_struct，都会有这样一个成员变量。这就是一个信号列表。如果这个task_struct是一个线程，这里面的信号就是发给这个线程的；如果这个task_struct是一个进程，这里面的信号是发给主线程的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>init_sigpending(&amp;p-&amp;gt;pending);</span></span></code></pre></div><p>另外，上面copy_signal的时候，我们可以看到，在创建进程的过程中，会初始化signal_struct里面的struct sigpending shared_pending。但是，在创建线程的过程中，连signal_struct都共享了。也就是说，整个进程里的所有线程共享一个shared_pending，这也是一个信号列表，是发给整个进程的，哪个线程处理都一样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>init_sigpending(&amp;sig-&amp;gt;shared_pending);</span></span></code></pre></div><p>至此，clone在内核的调用完毕，要返回系统调用，回到用户态。</p><h2 id="用户态执行线程" tabindex="-1">用户态执行线程 <a class="header-anchor" href="#用户态执行线程" aria-label="Permalink to &quot;用户态执行线程&quot;">​</a></h2><p>根据__clone的第一个参数，回到用户态也不是直接运行我们指定的那个函数，而是一个通用的start_thread，这是所有线程在用户态的统一入口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define START_THREAD_DEFN \\</span></span>
<span class="line"><span>  static int __attribute__ ((noreturn)) start_thread (void *arg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>START_THREAD_DEFN</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct pthread *pd = START_THREAD_SELF;</span></span>
<span class="line"><span>    /* Run the code the user provided.  */</span></span>
<span class="line"><span>    THREAD_SETMEM (pd, result, pd-&amp;gt;start_routine (pd-&amp;gt;arg));</span></span>
<span class="line"><span>    /* Call destructors for the thread_local TLS variables.  */</span></span>
<span class="line"><span>    /* Run the destructor for the thread-local data.  */</span></span>
<span class="line"><span>    __nptl_deallocate_tsd ();</span></span>
<span class="line"><span>    if (__glibc_unlikely (atomic_decrement_and_test (&amp;__nptl_nthreads)))</span></span>
<span class="line"><span>        /* This was the last thread.  */</span></span>
<span class="line"><span>        exit (0);</span></span>
<span class="line"><span>    __free_tcb (pd);</span></span>
<span class="line"><span>    __exit_thread ();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在start_thread入口函数中，才真正的调用用户提供的函数，在用户的函数执行完毕之后，会释放这个线程相关的数据。例如，线程本地数据thread_local variables，线程数目也减一。如果这是最后一个线程了，就直接退出进程，另外__free_tcb用于释放pthread。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void</span></span>
<span class="line"><span>internal_function</span></span>
<span class="line"><span>__free_tcb (struct pthread *pd)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  __deallocate_stack (pd);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void</span></span>
<span class="line"><span>internal_function</span></span>
<span class="line"><span>__deallocate_stack (struct pthread *pd)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  /* Remove the thread from the list of threads with user defined</span></span>
<span class="line"><span>     stacks.  */</span></span>
<span class="line"><span>  stack_list_del (&amp;pd-&amp;gt;list);</span></span>
<span class="line"><span>  /* Not much to do.  Just free the mmap()ed memory.  Note that we do</span></span>
<span class="line"><span>     not reset the &#39;used&#39; flag in the &#39;tid&#39; field.  This is done by</span></span>
<span class="line"><span>     the kernel.  If no thread has been created yet this field is</span></span>
<span class="line"><span>     still zero.  */</span></span>
<span class="line"><span>  if (__glibc_likely (! pd-&amp;gt;user_stack))</span></span>
<span class="line"><span>    (void) queue_stack (pd);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__free_tcb会调用__deallocate_stack来释放整个线程栈，这个线程栈要从当前使用线程栈的列表stack_used中拿下来，放到缓存的线程栈列表stack_cache中。</p><p>好了，整个线程的生命周期到这里就结束了。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>线程的调用过程解析完毕了，我画了一个图总结一下。这个图对比了创建进程和创建线程在用户态和内核态的不同。</p><p>创建进程的话，调用的系统调用是fork，在copy_process函数里面，会将五大结构files_struct、fs_struct、sighand_struct、signal_struct、mm_struct都复制一遍，从此父进程和子进程各用各的数据结构。而创建线程的话，调用的是系统调用clone，在copy_process函数里面， 五大结构仅仅是引用计数加一，也即线程共享进程的数据结构。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94479/14635b1613d04df9f217c3508ae8524b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94479/14635b1613d04df9f217c3508ae8524b.jpeg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你知道如果查看一个进程的线程以及线程栈的使用情况吗？请找一下相关的命令和API，尝试一下。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94479/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/94479/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,74)])])}const h=a(t,[["render",l]]);export{g as __pageData,h as default};
