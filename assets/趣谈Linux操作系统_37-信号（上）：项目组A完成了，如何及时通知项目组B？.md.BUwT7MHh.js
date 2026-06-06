import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"37 | 信号（上）：项目组A完成了，如何及时通知项目组B？","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/37-信号（上）：项目组A完成了，如何及时通知项目组B？.md","filePath":"趣谈Linux操作系统/37-信号（上）：项目组A完成了，如何及时通知项目组B？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/37-信号（上）：项目组A完成了，如何及时通知项目组B？.md"};function e(l,s,c,o,g,r){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_37-信号-上-项目组a完成了-如何及时通知项目组b" tabindex="-1">37 | 信号（上）：项目组A完成了，如何及时通知项目组B？ <a class="header-anchor" href="#_37-信号-上-项目组a完成了-如何及时通知项目组b" aria-label="Permalink to &quot;37 | 信号（上）：项目组A完成了，如何及时通知项目组B？&quot;">​</a></h1><p>上一节最后，我们讲了信号的机制。在某些紧急情况下，我们需要给进程发送一个信号，紧急处理一些事情。</p><p>这种方式有点儿像咱们运维一个线上系统，为了应对一些突发事件，往往需要制定应急预案。就像下面的列表中一样。一旦发生了突发事件，马上能够找到负责人，根据处理步骤进行紧急响应，并且在限定的事件内搞定。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/102281/498199918340c55f59c91129ceb59f0c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/102281/498199918340c55f59c91129ceb59f0c.png" alt=""></a></p><p>我们现在就按照应急预案的设计思路，来看一看Linux信号系统的机制。</p><p>首先，第一件要做的事情就是，整个团队要想一下，线上到底能够产生哪些异常情况，越全越好。于是，我们就有了上面这个很长很长的列表。</p><p>在Linux操作系统中，为了响应各种各样的事件，也是定义了非常多的信号。我们可以通过kill -l命令，查看所有的信号。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># kill -l</span></span>
<span class="line"><span> 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP</span></span>
<span class="line"><span> 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1</span></span>
<span class="line"><span>11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM</span></span>
<span class="line"><span>16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP</span></span>
<span class="line"><span>21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ</span></span>
<span class="line"><span>26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR</span></span>
<span class="line"><span>31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3</span></span>
<span class="line"><span>38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8</span></span>
<span class="line"><span>43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13</span></span>
<span class="line"><span>48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12</span></span>
<span class="line"><span>53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7</span></span>
<span class="line"><span>58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2</span></span>
<span class="line"><span>63) SIGRTMAX-1  64) SIGRTMAX</span></span></code></pre></div><p>这些信号都是什么作用呢？我们可以通过man 7 signal命令查看，里面会有一个列表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Signal     Value     Action   Comment</span></span>
<span class="line"><span>──────────────────────────────────────────────────────────────────────</span></span>
<span class="line"><span>SIGHUP        1       Term    Hangup detected on controlling terminal</span></span>
<span class="line"><span>                              or death of controlling process</span></span>
<span class="line"><span>SIGINT        2       Term    Interrupt from keyboard</span></span>
<span class="line"><span>SIGQUIT       3       Core    Quit from keyboard</span></span>
<span class="line"><span>SIGILL        4       Core    Illegal Instruction</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SIGABRT       6       Core    Abort signal from abort(3)</span></span>
<span class="line"><span>SIGFPE        8       Core    Floating point exception</span></span>
<span class="line"><span>SIGKILL       9       Term    Kill signal</span></span>
<span class="line"><span>SIGSEGV      11       Core    Invalid memory reference</span></span>
<span class="line"><span>SIGPIPE      13       Term    Broken pipe: write to pipe with no</span></span>
<span class="line"><span>                              readers</span></span>
<span class="line"><span>SIGALRM      14       Term    Timer signal from alarm(2)</span></span>
<span class="line"><span>SIGTERM      15       Term    Termination signal</span></span>
<span class="line"><span>SIGUSR1   30,10,16    Term    User-defined signal 1</span></span>
<span class="line"><span>SIGUSR2   31,12,17    Term    User-defined signal 2</span></span>
<span class="line"><span>……</span></span></code></pre></div><p>就像应急预案里面给出的一样，每个信号都有一个唯一的ID，还有遇到这个信号的时候的默认操作。</p><p>一旦有信号产生，我们就有下面这几种，用户进程对信号的处理方式。</p><ol><li><p><strong>执行默认操作</strong>。Linux对每种信号都规定了默认操作，例如，上面列表中的Term，就是终止进程的意思。Core的意思是Core Dump，也即终止进程后，通过Core Dump将当前进程的运行状态保存在文件里面，方便程序员事后进行分析问题在哪里。</p></li><li><p><strong>捕捉信号</strong>。我们可以为信号定义一个信号处理函数。当信号发生时，我们就执行相应的信号处理函数。</p></li><li><p><strong>忽略信号</strong>。当我们不希望处理某些信号的时候，就可以忽略该信号，不做任何处理。有两个信号是应用进程无法捕捉和忽略的，即SIGKILL和SEGSTOP，它们用于在任何时候中断或结束某一进程。</p></li></ol><p>接下来，我们来看一下信号处理最常见的流程。这个过程主要是分成两步，第一步是注册信号处理函数。第二步是发送信号。这一节我们主要看第一步。</p><p>如果我们不想让某个信号执行默认操作，一种方法就是对特定的信号注册相应的信号处理函数，设置信号处理方式的是 <strong>signal函数</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef void (*sighandler_t)(int);</span></span>
<span class="line"><span>sighandler_t signal(int signum, sighandler_t handler);</span></span></code></pre></div><p>这其实就是定义一个方法，并且将这个方法和某个信号关联起来。当这个进程遇到这个信号的时候，就执行这个方法。</p><p>如果我们在Linux下面执行man signal的话，会发现Linux不建议我们直接用这个方法，而是改用sigaction。定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int sigaction(int signum, const struct sigaction *act,</span></span>
<span class="line"><span>                     struct sigaction *oldact);</span></span></code></pre></div><p>这两者的区别在哪里呢？其实它还是将信号和一个动作进行关联，只不过这个动作由一个结构struct sigaction表示了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct sigaction {</span></span>
<span class="line"><span>	__sighandler_t sa_handler;</span></span>
<span class="line"><span>	unsigned long sa_flags;</span></span>
<span class="line"><span>	__sigrestore_t sa_restorer;</span></span>
<span class="line"><span>	sigset_t sa_mask;		/* mask last for extensibility */</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>和signal类似的是，这里面还是有__sighandler_t。但是，其他成员变量可以让你更加细致地控制信号处理的行为。而signal函数没有给你机会设置这些。这里需要注意的是，signal不是系统调用，而是glibc封装的一个函数。这样就像man signal里面写的一样，不同的实现方式，设置的参数会不同，会导致行为的不同。</p><p>例如，我们在glibc里面会看到了这样一个实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#  define signal __sysv_signal</span></span>
<span class="line"><span>__sighandler_t</span></span>
<span class="line"><span>__sysv_signal (int sig, __sighandler_t handler)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  struct sigaction act, oact;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  act.sa_handler = handler;</span></span>
<span class="line"><span>  __sigemptyset (&amp;act.sa_mask);</span></span>
<span class="line"><span>  act.sa_flags = SA_ONESHOT | SA_NOMASK | SA_INTERRUPT;</span></span>
<span class="line"><span>  act.sa_flags &amp;= ~SA_RESTART;</span></span>
<span class="line"><span>  if (__sigaction (sig, &amp;act, &amp;oact) &amp;lt; 0)</span></span>
<span class="line"><span>    return SIG_ERR;</span></span>
<span class="line"><span>  return oact.sa_handler;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>weak_alias (__sysv_signal, sysv_signal)</span></span></code></pre></div><p>在这里面，sa_flags进行了默认的设置。SA_ONESHOT是什么意思呢？意思就是，这里设置的信号处理函数，仅仅起作用一次。用完了一次后，就设置回默认行为。这其实并不是我们想看到的。毕竟我们一旦安装了一个信号处理函数，肯定希望它一直起作用，直到我显式地关闭它。</p><p>另外一个设置就是 <strong>SA_NOMASK</strong>。我们通过__sigemptyset，将sa_mask设置为空。这样的设置表示在这个信号处理函数执行过程中，如果再有其他信号，哪怕相同的信号到来的时候，这个信号处理函数会被中断。如果一个信号处理函数真的被其他信号中断，其实问题也不大，因为当处理完了其他的信号处理函数后，还会回来接着处理这个信号处理函数的，但是对于相同的信号就有点尴尬了，这就需要这个信号处理函数写得比较有技巧了。</p><p>例如，对于这个信号的处理过程中，要操作某个数据结构，因为是相同的信号，很可能操作的是同一个实例，这样的话，同步、死锁这些都要想好。其实一般的思路应该是，当某一个信号的信号处理函数运行的时候，我们暂时屏蔽这个信号。后面我们还会仔细分析屏蔽这个动作，屏蔽并不意味着信号一定丢失，而是暂存，这样能够做到信号处理函数对于相同的信号，处理完一个再处理下一个，这样信号处理函数的逻辑要简单得多。</p><p>还有一个设置就是设置了 <strong>SA_INTERRUPT，清除了SA_RESTART</strong>。这是什么意思呢？我们知道，信号的到来时间是不可预期的，有可能程序正在调用某个漫长的系统调用的时候（你可以在一台Linux机器上运行man 7 signal命令，在这里找Interruption of system calls and library functions by signal handlers的部分，里面说得非常详细），这个时候一个信号来了，会中断这个系统调用，去执行信号处理函数，那执行完了以后呢？系统调用怎么办呢？</p><p>这时候有两种处理方法，一种就是SA_INTERRUPT，也即系统调用被中断了，就不再重试这个系统调用了，而是直接返回一个-EINTR常量，告诉调用方，这个系统调用被信号中断了，但是怎么处理你看着办。如果是这样的话，调用方可以根据自己的逻辑，重新调用或者直接返回，这会使得我们的代码非常复杂，在所有系统调用的返回值判断里面，都要特殊判断一下这个值。</p><p>另外一种处理方法是SA_RESTART。这个时候系统调用会被自动重新启动，不需要调用方自己写代码。当然也可能存在问题，例如从终端读入一个字符，这个时候用户在终端输入一个 <code>&#39;a&#39;</code> 字符，在处理 <code>&#39;a&#39;</code> 字符的时候被信号中断了，等信号处理完毕，再次读入一个字符的时候，如果用户不再输入，就停在那里了，需要用户再次输入同一个字符。</p><p>因此，建议你使用sigaction函数，根据自己的需要定制参数。</p><p>接下来，我们来看sigaction具体做了些什么。</p><p>还记得在学习系统调用那一节的时候，我们知道，glibc里面有个文件syscalls.list。这里面定义了库函数调用哪些系统调用，在这里我们找到了sigaction。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sigaction    -       sigaction       i:ipp   __sigaction     sigaction</span></span></code></pre></div><p>接下来，在glibc中，__sigaction会调用__libc_sigaction，并最终调用的系统调用是rt_sigaction。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int</span></span>
<span class="line"><span>__sigaction (int sig, const struct sigaction *act, struct sigaction *oact)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  return __libc_sigaction (sig, act, oact);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int</span></span>
<span class="line"><span>__libc_sigaction (int sig, const struct sigaction *act, struct sigaction *oact)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int result;</span></span>
<span class="line"><span>  struct kernel_sigaction kact, koact;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (act)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      kact.k_sa_handler = act-&amp;gt;sa_handler;</span></span>
<span class="line"><span>      memcpy (&amp;kact.sa_mask, &amp;act-&amp;gt;sa_mask, sizeof (sigset_t));</span></span>
<span class="line"><span>      kact.sa_flags = act-&amp;gt;sa_flags | SA_RESTORER;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      kact.sa_restorer = &amp;restore_rt;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  result = INLINE_SYSCALL (rt_sigaction, 4,</span></span>
<span class="line"><span>                           sig, act ? &amp;kact : NULL,</span></span>
<span class="line"><span>                           oact ? &amp;koact : NULL, _NSIG / 8);</span></span>
<span class="line"><span>  if (oact &amp;&amp; result &amp;gt;= 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      oact-&amp;gt;sa_handler = koact.k_sa_handler;</span></span>
<span class="line"><span>      memcpy (&amp;oact-&amp;gt;sa_mask, &amp;koact.sa_mask, sizeof (sigset_t));</span></span>
<span class="line"><span>      oact-&amp;gt;sa_flags = koact.sa_flags;</span></span>
<span class="line"><span>      oact-&amp;gt;sa_restorer = koact.sa_restorer;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这也是很多人看信号处理的内核实现的时候，比较困惑的地方。例如，内核代码注释里面会说，系统调用signal是为了兼容过去，系统调用sigaction也是为了兼容过去，连参数都变成了struct compat_old_sigaction，所以说，我们的库函数虽然调用的是sigaction，到了系统调用层，调用的可不是系统调用sigaction，而是系统调用rt_sigaction。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE4(rt_sigaction, int, sig,</span></span>
<span class="line"><span>		const struct sigaction __user *, act,</span></span>
<span class="line"><span>		struct sigaction __user *, oact,</span></span>
<span class="line"><span>		size_t, sigsetsize)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct k_sigaction new_sa, old_sa;</span></span>
<span class="line"><span>	int ret = -EINVAL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (act) {</span></span>
<span class="line"><span>		if (copy_from_user(&amp;new_sa.sa, act, sizeof(new_sa.sa)))</span></span>
<span class="line"><span>			return -EFAULT;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ret = do_sigaction(sig, act ? &amp;new_sa : NULL, oact ? &amp;old_sa : NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!ret &amp;&amp; oact) {</span></span>
<span class="line"><span>		if (copy_to_user(oact, &amp;old_sa.sa, sizeof(old_sa.sa)))</span></span>
<span class="line"><span>			return -EFAULT;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在rt_sigaction里面，我们将用户态的struct sigaction结构，拷贝为内核态的k_sigaction，然后调用do_sigaction。do_sigaction也很简单，还记得进程内核的数据结构里，struct task_struct里面有一个成员sighand，里面有一个action。这是一个数组，下标是信号，内容就是信号处理函数，do_sigaction就是设置sighand里的信号处理函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int do_sigaction(int sig, struct k_sigaction *act, struct k_sigaction *oact)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *p = current, *t;</span></span>
<span class="line"><span>	struct k_sigaction *k;</span></span>
<span class="line"><span>	sigset_t mask;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	k = &amp;p-&amp;gt;sighand-&amp;gt;action[sig-1];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	spin_lock_irq(&amp;p-&amp;gt;sighand-&amp;gt;siglock);</span></span>
<span class="line"><span>	if (oact)</span></span>
<span class="line"><span>		*oact = *k;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (act) {</span></span>
<span class="line"><span>		sigdelsetmask(&amp;act-&amp;gt;sa.sa_mask,</span></span>
<span class="line"><span>			      sigmask(SIGKILL) | sigmask(SIGSTOP));</span></span>
<span class="line"><span>		*k = *act;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	spin_unlock_irq(&amp;p-&amp;gt;sighand-&amp;gt;siglock);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此，信号处理函数的注册已经完成了。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节讲了如何通过API注册一个信号处理函数，整个过程如下图所示。</p><ul><li>在用户程序里面，有两个函数可以调用，一个是signal，一个是sigaction，推荐使用sigaction。</li><li>用户程序调用的是Glibc里面的函数，signal调用的是__sysv_signal，里面默认设置了一些参数，使得signal的功能受到了限制，sigaction调用的是__sigaction，参数用户可以任意设定。</li><li>无论是__sysv_signal还是__sigaction，调用的都是统一的一个系统调用rt_sigaction。</li><li>在内核中，rt_sigaction调用的是do_sigaction设置信号处理函数。在每一个进程的task_struct里面，都有一个sighand指向struct sighand_struct，里面是一个数组，下标是信号，里面的内容是信号处理函数。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/102281/7cb86c73b9e73893e6b0e0433d476928.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/102281/7cb86c73b9e73893e6b0e0433d476928.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你可以试着写一个程序，调用sigaction为某个信号设置一个信号处理函数，在信号处理函数中，如果收到信号则打印一些字符串，然后用命令kill发送信号，看是否字符串被正常输出。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/102281/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/102281/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,49)])])}const u=a(t,[["render",e]]);export{d as __pageData,u as default};
