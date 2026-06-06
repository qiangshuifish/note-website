import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"42 | 瞧一瞧Linux：如何实现系统API？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Linux内核API接口的架构","slug":"linux内核api接口的架构","link":"#linux内核api接口的架构","children":[]},{"level":2,"title":"Linux内核有多少API接口","slug":"linux内核有多少api接口","link":"#linux内核有多少api接口","children":[{"level":3,"title":"Linux系统调用表","slug":"linux系统调用表","link":"#linux系统调用表","children":[]}]},{"level":2,"title":"Linux系统调用实现","slug":"linux系统调用实现","link":"#linux系统调用实现","children":[{"level":3,"title":"下载Linux源码","slug":"下载linux源码","link":"#下载linux源码","children":[]},{"level":3,"title":"申明系统调用","slug":"申明系统调用","link":"#申明系统调用","children":[]},{"level":3,"title":"定义系统调用","slug":"定义系统调用","link":"#定义系统调用","children":[]},{"level":3,"title":"编译Linux内核","slug":"编译linux内核","link":"#编译linux内核","children":[]},{"level":3,"title":"编写应用测试","slug":"编写应用测试","link":"#编写应用测试","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/42-瞧一瞧Linux：如何实现系统API？.md","filePath":"操作系统实战45讲/42-瞧一瞧Linux：如何实现系统API？.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/42-瞧一瞧Linux：如何实现系统API？.md"};function i(t,s,c,_,o,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_42-瞧一瞧linux-如何实现系统api" tabindex="-1">42 | 瞧一瞧Linux：如何实现系统API？ <a class="header-anchor" href="#_42-瞧一瞧linux-如何实现系统api" aria-label="Permalink to &quot;42 | 瞧一瞧Linux：如何实现系统API？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课，我们通过实现一个获取时间的系统服务，学习了Cosmos里如何建立一个系统服务接口。Cosmos为应用程序提供服务的过程大致是这样的：应用程序先设置服务参数，然后通过int指令进入内核，由Cosmos内核运行相应的服务函数，最后为应用程序提供所需服务。</p><p>不知道你是否好奇过业内成熟的Linux内核，又是怎样为应用程序提供服务的呢？</p><p>这节课我们就来看看Linux内核是如何实现这一过程的，我们首先了解一下Linux内核有多少API接口，然后了解一下Linux内核API接口的架构，最后，我们动手为Linux内核增加一个全新的API，并实现相应的功能。</p><p>下面让我们开始吧！这节课的配套代码你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson42" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="linux内核api接口的架构" tabindex="-1">Linux内核API接口的架构 <a class="header-anchor" href="#linux内核api接口的架构" aria-label="Permalink to &quot;Linux内核API接口的架构&quot;">​</a></h2><p>在上节课中，我们已经熟悉了我们自己的Cosmos内核服务接口的架构，由应用程序调用库函数，再由库函数调用API入口函数，进入内核函数执行系统服务。</p><p>其实对于Linux内核也是一样，应用程序会调用库函数，在库函数中调用API入口函数，触发中断进入Linux内核执行系统调用，完成相应的功能服务。</p><p>在Linux内核之上，使用最广泛的C库是glibc，其中包括C标准库的实现，也包括所有和系统API对应的库接口函数。几乎所有C程序都要调用glibc的库函数，所以 <strong>glibc是Linux内核上C程序运行的基础。</strong></p><p>下面我们以open库函数为例分析一下，看看open是如何进入Linux内核调用相关的系统调用的。glibc虽然开源了，但是并没有在Linux内核代码之中，你需要从 <a href="https://www.gnu.org/software/libc/sources.html" target="_blank" rel="noreferrer">这里</a> 下载并解压，open函数代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//glibc/intl/loadmsgcat.c</span></span>
<span class="line"><span>#ifdef _LIBC</span></span>
<span class="line"><span># define open(name, flags)  __open_nocancel (name, flags)</span></span>
<span class="line"><span># define close(fd)      __close_nocancel_nostatus (fd)</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>//glibc/sysdeps/unix/sysv/linux/open_nocancel.c</span></span>
<span class="line"><span>int __open_nocancel (const char *file, int oflag, ...)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int mode = 0;</span></span>
<span class="line"><span>  if (__OPEN_NEEDS_MODE (oflag))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      va_list arg;</span></span>
<span class="line"><span>      va_start (arg, oflag);//解决可变参数</span></span>
<span class="line"><span>      mode = va_arg (arg, int);</span></span>
<span class="line"><span>      va_end (arg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  return INLINE_SYSCALL_CALL (openat, AT_FDCWD, file, oflag, mode);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//glibc/sysdeps/unix/sysdep.h</span></span>
<span class="line"><span>//这是为了解决不同参数数量的问题</span></span>
<span class="line"><span>#define __INLINE_SYSCALL0(name) \\</span></span>
<span class="line"><span>  INLINE_SYSCALL (name, 0)</span></span>
<span class="line"><span>#define __INLINE_SYSCALL1(name, a1) \\</span></span>
<span class="line"><span>  INLINE_SYSCALL (name, 1, a1)</span></span>
<span class="line"><span>#define __INLINE_SYSCALL2(name, a1, a2) \\</span></span>
<span class="line"><span>  INLINE_SYSCALL (name, 2, a1, a2)</span></span>
<span class="line"><span>#define __INLINE_SYSCALL3(name, a1, a2, a3) \\</span></span>
<span class="line"><span>  INLINE_SYSCALL (name, 3, a1, a2, a3)</span></span>
<span class="line"><span>#define __INLINE_SYSCALL_NARGS_X(a,b,c,d,e,f,g,h,n,...) n</span></span>
<span class="line"><span>#define __INLINE_SYSCALL_NARGS(...) \\</span></span>
<span class="line"><span>  __INLINE_SYSCALL_NARGS_X (__VA_ARGS__,7,6,5,4,3,2,1,0,)</span></span>
<span class="line"><span>#define __INLINE_SYSCALL_DISP(b,...) \\</span></span>
<span class="line"><span>  __SYSCALL_CONCAT (b,__INLINE_SYSCALL_NARGS(__VA_ARGS__))(__VA_ARGS__)</span></span>
<span class="line"><span>#define INLINE_SYSCALL_CALL(...) \\</span></span>
<span class="line"><span>  __INLINE_SYSCALL_DISP (__INLINE_SYSCALL, __VA_ARGS__)</span></span>
<span class="line"><span>//glibc/sysdeps/unix/sysv/linux/sysdep.h</span></span>
<span class="line"><span>//关键是这个宏</span></span>
<span class="line"><span>#define INLINE_SYSCALL(name, nr, args...)       \\</span></span>
<span class="line"><span>  ({                  \\</span></span>
<span class="line"><span>    long int sc_ret = INTERNAL_SYSCALL (name, nr, args);    \\</span></span>
<span class="line"><span>    __glibc_unlikely (INTERNAL_SYSCALL_ERROR_P (sc_ret))    \\</span></span>
<span class="line"><span>    ? SYSCALL_ERROR_LABEL (INTERNAL_SYSCALL_ERRNO (sc_ret))   \\</span></span>
<span class="line"><span>    : sc_ret;               \\</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>#define INTERNAL_SYSCALL(name, nr, args...)       \\</span></span>
<span class="line"><span>  internal_syscall##nr (SYS_ify (name), args)</span></span>
<span class="line"><span>#define INTERNAL_SYSCALL_NCS(number, nr, args...)     \\</span></span>
<span class="line"><span>  internal_syscall##nr (number, args)</span></span>
<span class="line"><span>//这是需要6个参数的宏</span></span>
<span class="line"><span>#define internal_syscall6(number, arg1, arg2, arg3, arg4, arg5, arg6) \\</span></span>
<span class="line"><span>({                  \\</span></span>
<span class="line"><span>    unsigned long int resultvar;          \\</span></span>
<span class="line"><span>    TYPEFY (arg6, __arg6) = ARGIFY (arg6);        \\</span></span>
<span class="line"><span>    TYPEFY (arg5, __arg5) = ARGIFY (arg5);        \\</span></span>
<span class="line"><span>    TYPEFY (arg4, __arg4) = ARGIFY (arg4);        \\</span></span>
<span class="line"><span>    TYPEFY (arg3, __arg3) = ARGIFY (arg3);        \\</span></span>
<span class="line"><span>    TYPEFY (arg2, __arg2) = ARGIFY (arg2);        \\</span></span>
<span class="line"><span>    TYPEFY (arg1, __arg1) = ARGIFY (arg1);        \\</span></span>
<span class="line"><span>    register TYPEFY (arg6, _a6) asm (&quot;r9&quot;) = __arg6;      \\</span></span>
<span class="line"><span>    register TYPEFY (arg5, _a5) asm (&quot;r8&quot;) = __arg5;      \\</span></span>
<span class="line"><span>    register TYPEFY (arg4, _a4) asm (&quot;r10&quot;) = __arg4;     \\</span></span>
<span class="line"><span>    register TYPEFY (arg3, _a3) asm (&quot;rdx&quot;) = __arg3;     \\</span></span>
<span class="line"><span>    register TYPEFY (arg2, _a2) asm (&quot;rsi&quot;) = __arg2;     \\</span></span>
<span class="line"><span>    register TYPEFY (arg1, _a1) asm (&quot;rdi&quot;) = __arg1;     \\</span></span>
<span class="line"><span>    asm volatile (              \\</span></span>
<span class="line"><span>    &quot;syscall\\n\\t&quot;             \\</span></span>
<span class="line"><span>    : &quot;=a&quot; (resultvar)              \\</span></span>
<span class="line"><span>    : &quot;0&quot; (number), &quot;r&quot; (_a1), &quot;r&quot; (_a2), &quot;r&quot; (_a3), &quot;r&quot; (_a4),   \\</span></span>
<span class="line"><span>      &quot;r&quot; (_a5), &quot;r&quot; (_a6)            \\</span></span>
<span class="line"><span>    : &quot;memory&quot;, REGISTERS_CLOBBERED_BY_SYSCALL);      \\</span></span>
<span class="line"><span>    (long int) resultvar;           \\</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>上述代码中，我们可以清楚地看到，open只是宏，实际工作的是__open_nocancel函数，其中会用INLINE_SYSCALL_CALL宏经过一系列替换，最终根据参数的个数替换成相应的internal_syscall##nr宏。</p><p>比如有6个参数，就会替换成internal_syscall6。其中number是系统调用号，参数通过寄存器传递的。但是这里我们没有发现int指令，这是因为这里用到的指令是最新处理器为其设计的系统调用指令syscall。这个指令和int指令一样，都可以让CPU跳转到特定的地址上，只不过不经过中断门，系统调用返回时要用sysexit指令。</p><p>好了，我们已经了解了这个open函数的调用流程，如果用一幅图来展示Linux内核API的架构，就会呈现后面这个样子。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/407343/03yy161484ed15837f58a4283b960c8f.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/407343/03yy161484ed15837f58a4283b960c8f.jpg" alt=""></a></p><p>有了前面代码流程分析和结构示意图，我想你会对Linux内核API的框架结构加深了解。上图中的系统调用表和许多sys_xxxx函数你可能不太明白，别担心，我们后面就会讲到。</p><p>那么Linux系统有多少个API呢？我们一起去看看吧。</p><h2 id="linux内核有多少api接口" tabindex="-1">Linux内核有多少API接口 <a class="header-anchor" href="#linux内核有多少api接口" aria-label="Permalink to &quot;Linux内核有多少API接口&quot;">​</a></h2><p>Linux作为比较成熟的操作系统，功能完善，它以众多API接口的方式向应用程序提供文件、网络、进程、时间等待服务，并且完美执行了国际posix标准。</p><p>Linux从最初几十个API接口，现在已经发展到了几百个API接口，从这里你可以预见到Linux内核功能增加的速度与数量。那么现在的Linux内核究竟有多少个API接口呢？我们还是要来看看最新发布的Linux内核版本，才能准确知道。</p><p>具体我们需要对Linux代码进行编译，在编译的过程中，根据syscall_32.tbl和syscall_64.tbl生成自己的syscalls_32.h和syscalls_64.h文件。</p><p>生成方式在 arch/x86/entry/syscalls/Makefile 文件中。这里面会使用两个脚本，即syscallhdr.sh、syscalltbl.sh，它们最终生成的 syscalls_32.h 和 syscalls_64.h两个文件中就保存了 <strong>系统调用号和系统调用实现函数之间的对应关系</strong>，在里面可以看到Linux内核的系统调用号，即API号，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//linux/arch/x86/include/generated/asm/syscalls_64.h</span></span>
<span class="line"><span>__SYSCALL_COMMON(0, sys_read)</span></span>
<span class="line"><span>__SYSCALL_COMMON(1, sys_write)</span></span>
<span class="line"><span>__SYSCALL_COMMON(2, sys_open)</span></span>
<span class="line"><span>__SYSCALL_COMMON(3, sys_close)</span></span>
<span class="line"><span>__SYSCALL_COMMON(4, sys_newstat)</span></span>
<span class="line"><span>__SYSCALL_COMMON(5, sys_newfstat)</span></span>
<span class="line"><span>__SYSCALL_COMMON(6, sys_newlstat)</span></span>
<span class="line"><span>__SYSCALL_COMMON(7, sys_poll)</span></span>
<span class="line"><span>__SYSCALL_COMMON(8, sys_lseek)</span></span>
<span class="line"><span>//……</span></span>
<span class="line"><span>__SYSCALL_COMMON(435, sys_clone3)</span></span>
<span class="line"><span>__SYSCALL_COMMON(436, sys_close_range)</span></span>
<span class="line"><span>__SYSCALL_COMMON(437, sys_openat2)</span></span>
<span class="line"><span>__SYSCALL_COMMON(438, sys_pidfd_getfd)</span></span>
<span class="line"><span>__SYSCALL_COMMON(439, sys_faccessat2)</span></span>
<span class="line"><span>__SYSCALL_COMMON(440, sys_process_madvise)</span></span>
<span class="line"><span>//linux/arch/x86/include/generated/uapi/asm/unistd_64.h</span></span>
<span class="line"><span>#define __NR_read 0</span></span>
<span class="line"><span>#define __NR_write 1</span></span>
<span class="line"><span>#define __NR_open 2</span></span>
<span class="line"><span>#define __NR_close 3</span></span>
<span class="line"><span>#define __NR_stat 4</span></span>
<span class="line"><span>#define __NR_fstat 5</span></span>
<span class="line"><span>#define __NR_lstat 6</span></span>
<span class="line"><span>#define __NR_poll 7</span></span>
<span class="line"><span>#define __NR_lseek 8</span></span>
<span class="line"><span>//……</span></span>
<span class="line"><span>#define __NR_clone3 435</span></span>
<span class="line"><span>#define __NR_close_range 436</span></span>
<span class="line"><span>#define __NR_openat2 437</span></span>
<span class="line"><span>#define __NR_pidfd_getfd 438</span></span>
<span class="line"><span>#define __NR_faccessat2 439</span></span>
<span class="line"><span>#define __NR_process_madvise 440</span></span>
<span class="line"><span>#ifdef __KERNEL__</span></span>
<span class="line"><span>#define __NR_syscall_max 440</span></span>
<span class="line"><span>#endif</span></span></code></pre></div><p>上述代码中，已经定义了__NR_syscall_max为440，这说明Linux内核一共有441个系统调用，而系统调用号从0开始到440结束，所以最后一个系统调用是sys_process_madvise。</p><p>其实，__SYSCALL_COMMON除了表示系统调用号和系统调用函数之间的关系，还会在Linux内核的系统调用表中进行相应的展开，究竟展开成什么样子呢？我们一起接着看一看Linux内核的系统调用表。</p><h3 id="linux系统调用表" tabindex="-1">Linux系统调用表 <a class="header-anchor" href="#linux系统调用表" aria-label="Permalink to &quot;Linux系统调用表&quot;">​</a></h3><p>Linux内核有400多个系统调用，它使用了一个函数指针数组，存放所有的系统调用函数的地址，通过数组下标就能索引到相应的系统调用。这个数组叫sys_call_table，即Linux系统调用表。</p><p>sys_call_table到底长什么样？我们来看一看代码才知道，同时也解答一下前面留下的疑问，这里还是要说明一下，__SYSCALL_COMMON首先会替换成__SYSCALL_64，因为我们编译的Linux内核是x86_64架构的，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define __SYSCALL_COMMON(nr, sym) __SYSCALL_64(nr, sym)</span></span>
<span class="line"><span>//第一次定义__SYSCALL_64</span></span>
<span class="line"><span>#define __SYSCALL_64(nr, sym) extern asmlinkage long sym(unsigned long, unsigned long, unsigned long, unsigned long, unsigned long, unsigned long) ;</span></span>
<span class="line"><span>#include &amp;lt;asm/syscalls_64.h&amp;gt;//第一次包含syscalls_64.h文件，其中的宏会被展开一次，例如__SYSCALL_COMMON(2, sys_open)会被展开成：</span></span>
<span class="line"><span>extern asmlinkage long sys_open(unsigned long, unsigned long, unsigned long, unsigned long, unsigned long, unsigned long) ;</span></span>
<span class="line"><span>这表示申明</span></span>
<span class="line"><span>//取消__SYSCALL_64定义</span></span>
<span class="line"><span>#undef __SYSCALL_64</span></span>
<span class="line"><span>//第二次重新定义__SYSCALL_64</span></span>
<span class="line"><span>#define __SYSCALL_64(nr, sym) [ nr ] = sym,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern asmlinkage long sys_ni_syscall(unsigned long, unsigned long, unsigned long, unsigned long, unsigned long, unsigned long);</span></span>
<span class="line"><span>const sys_call_ptr_t sys_call_table[] ____cacheline_aligned = {</span></span>
<span class="line"><span>    [0 ... __NR_syscall_max] = &amp;sys_ni_syscall,//默认系统调用函数，什么都不干</span></span>
<span class="line"><span>#include &amp;lt;asm/syscalls_64.h&amp;gt;//包含前面生成文件</span></span>
<span class="line"><span>//第二次包含syscalls_64.h文件，其中的宏会被再展开一次，例如__SYSCALL_COMMON(2, sys_open)会被展开成：</span></span>
<span class="line"><span>[2] = sys_open, 用于初始化这个数组，即表示数组的第二个元素填入sys_open</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>int syscall_table_size = sizeof(sys_call_table);//系统调用表的大小</span></span></code></pre></div><p>上述代码中，通过两次包含syscalls_64.h文件，并在其中分别定义不同的__SYSCALL_64宏，完成了系统调用函数的申明和系统调用表的初始化，不得不说这是一个非常巧妙的方式。</p><p>sys_call_table数组，第一次全部初始化为默认系统调用函数sys_ni_syscall，这个函数什么都不干，这是为了 <strong>防止数组有些元素中没有函数地址，从而导致调用失败。</strong> 这在内核中是非常危险的。我单独提示你这点，其实也是希望你留意这种编程技巧，这在内核编码中并不罕见，考虑到内核编程代码的安全性，加一道防线可以有备无患。</p><h2 id="linux系统调用实现" tabindex="-1">Linux系统调用实现 <a class="header-anchor" href="#linux系统调用实现" aria-label="Permalink to &quot;Linux系统调用实现&quot;">​</a></h2><p>前面我们已经了解了Linux系统调用的架构和Linux系统调用表，也清楚了Linux系统调用的个数和定义一个Linux系统调用的方式。</p><p>为了让你更好地理解Linux系统是如何工作的，我们为现有的Linux写一个系统调用。这个系统调用的功能并不复杂，就是返回你机器的CPU数量，即你的机器是多少核心的处理器。</p><p>为Linux增加一个系统调用，其实有很多步骤，不过也别慌，下面我将一步一步为你讲解。</p><h3 id="下载linux源码" tabindex="-1">下载Linux源码 <a class="header-anchor" href="#下载linux源码" aria-label="Permalink to &quot;下载Linux源码&quot;">​</a></h3><p>想为Linux系统增加一个系统调用，首先你得有Linux内核源代码，如果你机器上没有Linux内核源代码，你就要去 <a href="https://www.kernel.org/" target="_blank" rel="noreferrer">内核官网</a> 下载，或者你也可以到GitHub上git clone一份内核代码。</p><p>如果你使用了git clone的方式，可以用如下方式操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>git clone git://git.kernel.org/pub/scm/linux/kernel/git/stable/linux-stable.git/</span></span></code></pre></div><p>如果你想尽量保持与我的Linux内核版本相同，降低出现各种未知问题的概率，那么请你使用 <strong>5.10.13版本</strong> 的内核。另外别忘了，如果你下载的Linux内核是压缩包，请记得先解压到一个可以访问的目录下。</p><h3 id="申明系统调用" tabindex="-1">申明系统调用 <a class="header-anchor" href="#申明系统调用" aria-label="Permalink to &quot;申明系统调用&quot;">​</a></h3><p>根据前面的知识点，可以得知Linux内核的系统调用的申明文件和信息，具体实现是这样的：由一个makefile在编译Linux系统内核时调用了一个脚本，这个脚本文件会读取另一个叫syscall_64.tbl文件，根据其中信息生成相应的文件syscall_64.h。</p><p>请注意，我这里是以x86_64架构为例进行说明的，这里我们并不关注syscall_64.h的生成原理，只关注syscall_64.tbl文件中的内容。下面我们还是结合代码看一下吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//linux-5.10.13/arch/x86/entry/syscalls/syscall_64.tbl</span></span>
<span class="line"><span>0	common	read			sys_read</span></span>
<span class="line"><span>1	common	write			sys_write</span></span>
<span class="line"><span>2	common	open			sys_open</span></span>
<span class="line"><span>3	common	close			sys_close</span></span>
<span class="line"><span>4	common	stat			sys_newstat</span></span>
<span class="line"><span>5	common	fstat			sys_newfstat</span></span>
<span class="line"><span>6	common	lstat			sys_newlstat</span></span>
<span class="line"><span>7	common	poll			sys_poll</span></span>
<span class="line"><span>8	common	lseek			sys_lseek</span></span>
<span class="line"><span>9	common	mmap			sys_mmap</span></span>
<span class="line"><span>10	common	mprotect		sys_mprotect</span></span>
<span class="line"><span>11	common	munmap			sys_munmap</span></span>
<span class="line"><span>12	common	brk			    sys_brk</span></span>
<span class="line"><span>//……</span></span>
<span class="line"><span>435	common	clone3			sys_clone3</span></span>
<span class="line"><span>436	common	close_range		sys_close_range</span></span>
<span class="line"><span>437	common	openat2			sys_openat2</span></span>
<span class="line"><span>438	common	pidfd_getfd		sys_pidfd_getfd</span></span>
<span class="line"><span>439	common	faccessat2		sys_faccessat2</span></span>
<span class="line"><span>440	common	process_madvise		sys_process_madvise</span></span></code></pre></div><p>上面这些代码可以分成四列，分别是系统调用号、架构、服务名，以及其相对应的服务入口函数。例如系统调用open的结构，如下表所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/407343/777e8e56b151b5812c48e06d861408f4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/407343/777e8e56b151b5812c48e06d861408f4.jpg" alt=""></a></p><p>那我们要如何申明自己的系统调用呢？第一步就需要在syscall_64.tbl文件中增加一项，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>441	common	get_cpus		sys_get_cpus</span></span></code></pre></div><p>我们自己的系统调用的系统调用号是441，架构是common ，服务名称是get_cpus，服务入口函数则是sys_get_cpus。请注意系统调用号要唯一，不能和其它系统调用号冲突。</p><p>写好这个，我们还需要把sys_get_cpus函数在syscalls.h文件中申明一下，供其它内核模块引用。具体代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//linux-5.10.13/include/linux/syscalls.h</span></span>
<span class="line"><span>asmlinkage long sys_get_cpus(void);</span></span></code></pre></div><p>这一步做好之后，我们就完成了一个Linux系统调用的所有申明工作。下面我们就去定义这个系统调用的服务入口函数。</p><h3 id="定义系统调用" tabindex="-1">定义系统调用 <a class="header-anchor" href="#定义系统调用" aria-label="Permalink to &quot;定义系统调用&quot;">​</a></h3><p>我们现在来定义自己的第一个Linux系统调用，为了降低工程复杂度，我们不打算新建一个C模块文件，而是直接在Linux内核代码目录下挑一个已经存在的C模块文件，并在其中定义我们自己的系统调用函数。</p><p>定义一个系统调用函数，需要使用专门的宏。根据参数不同选用不同的宏，这个宏的细节我们无须关注。对于我们这个无参数的系统调用函数，应该使用SYSCALL_DEFINE0宏来定义，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//linux-5.10.13/include/linux/syscalls.h</span></span>
<span class="line"><span>#ifndef SYSCALL_DEFINE0</span></span>
<span class="line"><span>#define SYSCALL_DEFINE0(sname)                  \\</span></span>
<span class="line"><span>    SYSCALL_METADATA(_##sname, 0);              \\</span></span>
<span class="line"><span>    asmlinkage long sys_##sname(void);          \\</span></span>
<span class="line"><span>    ALLOW_ERROR_INJECTION(sys_##sname, ERRNO);      \\</span></span>
<span class="line"><span>    asmlinkage long sys_##sname(void)</span></span>
<span class="line"><span>#endif /* SYSCALL_DEFINE0 */</span></span>
<span class="line"><span>//linux-5.10.13/kernel/sys.c</span></span>
<span class="line"><span>SYSCALL_DEFINE0(get_cpus)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return num_present_cpus();//获取系统中有多少CPU</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中SYSCALL_DEFINE0会将get_cpus转换成sys_get_cpus函数。这个函数中，调用了一个Linux内核中另一个函数num_present_cpus，从名字就能推断出作用了，它负责返回系统CPU的数量。 这正是我们要达到的结果。这个结果最终会返回给调用这个系统调用的应用程序。</p><h3 id="编译linux内核" tabindex="-1">编译Linux内核 <a class="header-anchor" href="#编译linux内核" aria-label="Permalink to &quot;编译Linux内核&quot;">​</a></h3><p>现在我们的Linux系统调用的代码，已经写好了，不过这跟编写内核模块还是不一样的。编写内核模块，我们只需要把内核模块动态加载到内核中，就可以直接使用了。系统调用发生在内核中，与内核是一体的，它无法独立成为可以加载的内核模块。所以我们需要重新编译内核，然后使用我们新编译的内核。</p><p>要编译内核首先是要配置内核，内核的配置操作非常简单，我们只需要源代码目录下执行“make menuconfig”指令，就会出现如下所示的界面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/407343/66597887b59b30d73ff300249e47e296.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/407343/66597887b59b30d73ff300249e47e296.jpg" alt=""></a></p><p>图中这些菜单都可以进入子菜单或者手动选择。</p><p>但是手动选择配置项非常麻烦且危险， <strong>如果不是资深的内核玩家，不建议手动配置！</strong> 但是我们可以选择加载一个已经存在的配置文件，这个配置文件可以加载你机器上boot目录下的config开头的文件，加载之后选择Save，就能保存配置并退出以上界面。</p><p>然后输入如下指令，就可以喝点茶、听听音乐，等待机器自行完成编译，编译的时间取决于机器的性能，快则十几分钟，慢则几个小时。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>make -j8 bzImage &amp;&amp; make -j8 modules</span></span></code></pre></div><p>上述代码指令干了哪些事儿呢？我来说一说，首先要编译内核，然后再编译内核模块，j8表示开启8线程并行编译，这个你可以根据自己的机器CPU核心数量进行调整。</p><p>编译过程结束之后就可以开始安装新内核了，你只需要在源代码目录下，执行如下指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo make modules_install &amp;&amp; sudo make install</span></span></code></pre></div><p>上述代码指令先安装好内核模块，然后再安装内核，最后会调用update-grub，自动生成启动选项，重启计算机就可以选择启动我们自己修改的Linux内核了。</p><h3 id="编写应用测试" tabindex="-1">编写应用测试 <a class="header-anchor" href="#编写应用测试" aria-label="Permalink to &quot;编写应用测试&quot;">​</a></h3><p>相信经过上述过程，你应该已经成功启动了修改过的新内核。不过我们还不确定我们增加的系统调用是不是正常的，所以我们还要写个应用程序测试一下，其实就是去调用一下我们增加的系统调用，看看结果是不是预期的。</p><p>我们应用程序代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;unistd.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/syscall.h&amp;gt;</span></span>
<span class="line"><span>int main(int argc, char const *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //syscall就是根据系统调用号调用相应的系统调用</span></span>
<span class="line"><span>    long cpus = syscall(441);</span></span>
<span class="line"><span>    printf(&quot;cpu num is:%d\\n&quot;, cpus);//输出结果</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对上述代码我们使用gcc main.c -o cpus指令进行编译，运行之后就可以看到结果了，但是我们没有写库代码，而是直接使用syscall函数。这个函数可以根据系统调用号触发系统调用，根据上面定义，441正是对应咱们的sys_get_cpus系统调用。</p><p>至此，在Linux系统上增加自己的系统调用这个实验，我们就完成了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天我们从了解Linux系统的API架构开始，最后在Linux系统上实现了一个自己的系统调用，虽然增加一个系统调用步骤不少，但你只要紧跟着我的思路一定可以拿下。</p><p>下面我来为你梳理一下课程的重点。</p><p>1.从Linux系统的API架构开始，我们了解了glibc库，这个库是大部分应用程序的基础，我们以其中的open函数为例，分析了库函数如何通过寄存器传递参数，最后执行syscall指令进入Linux内核，执行系统调用，最后还归纳出一幅Linux系统API框架图。</p><p>2.然后,我们了解Linux系统中有多少个API，它们都放在系统调用表中，同时也知道了Linux系统调用表的生成方式。</p><p>3.最后，为了验证我们了解的知识是否正确，我们从申明系统调用、定义系统调用到编译内核、编写应用测试，在现有的Linux代码中增加了一个属于我们自己的系统调用。</p><p>好了，我们通过这节课搞清楚了Linux内核系统调用的实现原理。你是否感觉这和我们的Cosmos的系统服务有些相似，又有些不同？</p><p>相似的是我们都使用寄存器来传递参数，不同的是Cosmos使用了中断门进入内核，而Linux内核使用了更新的syscall指令。有了这些知识储备，我也非常期待你能动手拓展，挑战一下在Cosmos上实现使用syscall触发系统调用。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请说说syscall指令和int指令的区别，是什么？</p><p>欢迎你在留言区跟我交流互动，也推荐你把这节课分享给有需要的朋友，一起实现操作系统里的各种功能。</p><p>我是LMOS，我们下节课见。</p>`,88)])])}const d=n(l,[["render",i]]);export{g as __pageData,d as default};
