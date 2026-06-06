import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"51 | 案例篇：动态追踪怎么用？（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"perf","slug":"perf","link":"#perf","children":[]},{"level":2,"title":"eBPF 和 BCC","slug":"ebpf-和-bcc","link":"#ebpf-和-bcc","children":[]},{"level":2,"title":"SystemTap 和 sysdig","slug":"systemtap-和-sysdig","link":"#systemtap-和-sysdig","children":[]},{"level":2,"title":"如何选择追踪工具","slug":"如何选择追踪工具","link":"#如何选择追踪工具","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考","slug":"思考","link":"#思考","children":[]}],"relativePath":"Linux性能优化实战/51-案例篇：动态追踪怎么用？（下）.md","filePath":"Linux性能优化实战/51-案例篇：动态追踪怎么用？（下）.md","lastUpdated":1779815995000}'),t={name:"Linux性能优化实战/51-案例篇：动态追踪怎么用？（下）.md"};function l(i,s,o,c,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_51-案例篇-动态追踪怎么用-下" tabindex="-1">51 | 案例篇：动态追踪怎么用？（下） <a class="header-anchor" href="#_51-案例篇-动态追踪怎么用-下" aria-label="Permalink to &quot;51 | 案例篇：动态追踪怎么用？（下）&quot;">​</a></h1><p>你好，我是倪朋飞。</p><p>上一节，我带你一起学习了常见的动态追踪方法。所谓动态追踪，就是在系统或者应用程序正常运行的时候，通过内核中提供的探针，来动态追踪它们的行为，从而辅助排查出性能问题的瓶颈。</p><p>使用动态追踪，可以在不修改代码、不重启服务的情况下，动态了解应用程序或者内核的行为，这对排查线上问题、特别是不容易重现的问题尤其有效。</p><p>在 Linux 系统中，常见的动态追踪方法包括 ftrace、perf、eBPF 以及 SystemTap 等。上节课，我们具体学习了 ftrace 的使用方法。今天，我们再来一起看看其他几种方法。</p><h2 id="perf" tabindex="-1">perf <a class="header-anchor" href="#perf" aria-label="Permalink to &quot;perf&quot;">​</a></h2><p>perf 已经是我们的老朋友了。在前面的案例中，我们多次用到它，来查找应用程序或者内核中的热点函数，从而定位性能瓶颈。而在内核线程 CPU 高的案例中，我们还使用火焰图动态展示 perf 的事件记录，从而更直观地发现了问题。</p><p>不过，我们前面使用 perf record/top时，都是先对事件进行采样，然后再根据采样数，评估各个函数的调用频率。实际上，perf 的功能远不止于此。比如，</p><ul><li><p>perf 可以用来分析 CPU cache、CPU 迁移、分支预测、指令周期等各种硬件事件；</p></li><li><p>perf 也可以只对感兴趣的事件进行动态追踪。</p></li></ul><p>接下来，我们还是以内核函数 do_sys_open，以及用户空间函数 readline 为例，看一看 perf 动态追踪的使用方法。</p><p>同 ftrace 一样，你也可以通过 perf list ，查询所有支持的事件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ perf list</span></span></code></pre></div><p>然后，在 perf 的各个子命令中添加 --event 选项，设置追踪感兴趣的事件。如果这些预定义的事件不满足实际需要，你还可以使用 perf probe 来动态添加。而且，除了追踪内核事件外，perf 还可以用来跟踪用户空间的函数。</p><p><strong>我们先来看第一个 perf 示例，内核函数 do_sys_open 的例子</strong>。你可以执行 perf probe 命令，添加 do_sys_open 探针：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ perf probe --add do_sys_open</span></span>
<span class="line"><span>Added new event:</span></span>
<span class="line"><span>  probe:do_sys_open    (on do_sys_open)</span></span>
<span class="line"><span>You can now use it in all perf tools, such as:</span></span>
<span class="line"><span>    perf record -e probe:do_sys_open -aR sleep 1</span></span></code></pre></div><p>探针添加成功后，就可以在所有的 perf 子命令中使用。比如，上述输出就是一个 perf record 的示例，执行它就可以对 10s 内的 do_sys_open 进行采样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ perf record -e probe:do_sys_open -aR sleep 10</span></span>
<span class="line"><span>[ perf record: Woken up 1 times to write data ]</span></span>
<span class="line"><span>[ perf record: Captured and wrote 0.148 MB perf.data (19 samples) ]</span></span></code></pre></div><p>而采样成功后，就可以执行 perf script ，来查看采样结果了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ perf script</span></span>
<span class="line"><span>            perf 12886 [000] 89565.879875: probe:do_sys_open: (ffffffffa807b290)</span></span>
<span class="line"><span>           sleep 12889 [000] 89565.880362: probe:do_sys_open: (ffffffffa807b290)</span></span>
<span class="line"><span>           sleep 12889 [000] 89565.880382: probe:do_sys_open: (ffffffffa807b290)</span></span>
<span class="line"><span>           sleep 12889 [000] 89565.880635: probe:do_sys_open: (ffffffffa807b290)</span></span>
<span class="line"><span>           sleep 12889 [000] 89565.880669: probe:do_sys_open: (ffffffffa807b290)</span></span></code></pre></div><p>输出中，同样也列出了调用 do_sys_open 的任务名称、进程 PID 以及运行的 CPU 等信息。不过，对于 open 系统调用来说，只知道它被调用了并不够，我们需要知道的是，进程到底在打开哪些文件。所以，实际应用中，我们还希望追踪时能显示这些函数的参数。</p><p>对于内核函数来说，你当然可以去查看内核源码，找出它的所有参数。不过还有更简单的方法，那就是直接从调试符号表中查询。执行下面的命令，你就可以知道 do_sys_open 的所有参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ perf probe -V do_sys_open</span></span>
<span class="line"><span>Available variables at do_sys_open</span></span>
<span class="line"><span>        &amp;#64;&amp;lt;do_sys_open+0&amp;gt;</span></span>
<span class="line"><span>                char*   filename</span></span>
<span class="line"><span>                int     dfd</span></span>
<span class="line"><span>                int     flags</span></span>
<span class="line"><span>                struct open_flags       op</span></span>
<span class="line"><span>                umode_t mode</span></span></code></pre></div><p>从这儿可以看出，我们关心的文件路径，就是第一个字符指针参数（也就是字符串），参数名称为 filename。如果这个命令执行失败，就说明调试符号表还没有安装。那么，你可以执行下面的命令，安装调试信息后重试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Ubuntu</span></span>
<span class="line"><span>$ apt-get install linux-image-\`uname -r\`-dbgsym</span></span>
<span class="line"><span># CentOS</span></span>
<span class="line"><span>$ yum --enablerepo=base-debuginfo install -y kernel-debuginfo-$(uname -r)</span></span></code></pre></div><p>找出参数名称和类型后，就可以把参数加到探针中了。不过由于我们已经添加过同名探针，所以在这次添加前，需要先把旧探针给删掉：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 先删除旧的探针</span></span>
<span class="line"><span>perf probe --del probe:do_sys_open</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 添加带参数的探针</span></span>
<span class="line"><span>$ perf probe --add &#39;do_sys_open filename:string&#39;</span></span>
<span class="line"><span>Added new event:</span></span>
<span class="line"><span>  probe:do_sys_open    (on do_sys_open with filename:string)</span></span>
<span class="line"><span>You can now use it in all perf tools, such as:</span></span>
<span class="line"><span>    perf record -e probe:do_sys_open -aR sleep 1</span></span></code></pre></div><p>新的探针添加后，重新执行 record 和 script 子命令，采样并查看记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 重新采样记录</span></span>
<span class="line"><span>$ perf record -e probe:do_sys_open -aR ls</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查看结果</span></span>
<span class="line"><span>$ perf script</span></span>
<span class="line"><span>            perf 13593 [000] 91846.053622: probe:do_sys_open: (ffffffffa807b290) filename_string=&quot;/proc/13596/status&quot;</span></span>
<span class="line"><span>              ls 13596 [000] 91846.053995: probe:do_sys_open: (ffffffffa807b290) filename_string=&quot;/etc/ld.so.cache&quot;</span></span>
<span class="line"><span>              ls 13596 [000] 91846.054011: probe:do_sys_open: (ffffffffa807b290) filename_string=&quot;/lib/x86_64-linux-gnu/libselinux.so.1&quot;</span></span>
<span class="line"><span>              ls 13596 [000] 91846.054066: probe:do_sys_open: (ffffffffa807b290) filename_string=&quot;/lib/x86_64-linux-gnu/libc.so.6”</span></span>
<span class="line"><span>              ...</span></span>
<span class="line"><span># 使用完成后不要忘记删除探针</span></span>
<span class="line"><span>$ perf probe --del probe:do_sys_open</span></span></code></pre></div><p>现在，你就可以看到每次调用 open 时打开的文件了。不过，这个结果是不是看着很熟悉呢？</p><p>其实，在我们使用 strace 跟踪进程的系统调用时，也经常会看到这些动态库的影子。比如，使用 strace 跟踪 ls 时，你可以得到下面的结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ strace ls</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>access(&quot;/etc/ld.so.nohwcap&quot;, F_OK)      = -1 ENOENT (No such file or directory)</span></span>
<span class="line"><span>access(&quot;/etc/ld.so.preload&quot;, R_OK)      = -1 ENOENT (No such file or directory)</span></span>
<span class="line"><span>openat(AT_FDCWD, &quot;/etc/ld.so.cache&quot;, O_RDONLY|O_CLOEXEC) = 3</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>access(&quot;/etc/ld.so.nohwcap&quot;, F_OK)      = -1 ENOENT (No such file or directory)</span></span>
<span class="line"><span>openat(AT_FDCWD, &quot;/lib/x86_64-linux-gnu/libselinux.so.1&quot;, O_RDONLY|O_CLOEXEC) = 3</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>你估计在想，既然strace 也能得到类似结果，本身又容易操作，为什么我们还要用perf 呢？</p><p>实际上，很多人只看到了 strace 简单易用的好处，却忽略了它对进程性能带来的影响。从原理上来说， <strong>strace 基于系统调用 ptrace 实现</strong>，这就带来了两个问题。</p><ul><li><p>由于ptrace 是系统调用，就需要在内核态和用户态切换。当事件数量比较多时，繁忙的切换必然会影响原有服务的性能；</p></li><li><p>ptrace 需要借助 SIGSTOP 信号挂起目标进程。这种信号控制和进程挂起，会影响目标进程的行为。</p></li></ul><p>所以，在性能敏感的应用（比如数据库）中，我并不推荐你用 strace （或者其他基于 ptrace 的性能工具）去排查和调试。</p><p>在 strace 的启发下，结合内核中的 utrace 机制， perf 也提供了一个 trace 子命令，是取代 strace 的首选工具。相对于 ptrace 机制来说，perf trace 基于内核事件，自然要比进程跟踪的性能好很多。</p><p>perf trace 的使用方法如下所示，跟 strace 其实很像：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ perf trace ls</span></span>
<span class="line"><span>         ? (         ): ls/14234  ... [continued]: execve()) = 0</span></span>
<span class="line"><span>     0.177 ( 0.013 ms): ls/14234 brk(                                                                  ) = 0x555d96be7000</span></span>
<span class="line"><span>     0.224 ( 0.014 ms): ls/14234 access(filename: 0xad98082                                            ) = -1 ENOENT No such file or directory</span></span>
<span class="line"><span>     0.248 ( 0.009 ms): ls/14234 access(filename: 0xad9add0, mode: R                                   ) = -1 ENOENT No such file or directory</span></span>
<span class="line"><span>     0.267 ( 0.012 ms): ls/14234 openat(dfd: CWD, filename: 0xad98428, flags: CLOEXEC                  ) = 3</span></span>
<span class="line"><span>     0.288 ( 0.009 ms): ls/14234 fstat(fd: 3&amp;lt;/usr/lib/locale/C.UTF-8/LC_NAME&amp;gt;, statbuf: 0x7ffd2015f230 ) = 0</span></span>
<span class="line"><span>     0.305 ( 0.011 ms): ls/14234 mmap(len: 45560, prot: READ, flags: PRIVATE, fd: 3                    ) = 0x7efe0af92000</span></span>
<span class="line"><span>     0.324 Dockerfile  test.sh</span></span>
<span class="line"><span>( 0.008 ms): ls/14234 close(fd: 3&amp;lt;/usr/lib/locale/C.UTF-8/LC_NAME&amp;gt;                          ) = 0</span></span>
<span class="line"><span>     ...</span></span></code></pre></div><p>不过，perf trace 还可以进行系统级的系统调用跟踪（即跟踪所有进程），而 strace 只能跟踪特定的进程。</p><p><strong>第二个 perf 的例子是用户空间的库函数</strong>。以 bash 调用的库函数 readline 为例，使用类似的方法，可以跟踪库函数的调用（基于 uprobes）。</p><p>readline 的作用，是从终端中读取用户输入，并把这些数据返回调用方。所以，跟 open 系统调用不同的是，我们更关注 readline 的调用结果。</p><p>我们执行下面的命令，通过 -x 指定 bash 二进制文件的路径，就可以动态跟踪库函数。这其实就是跟踪了所有用户在 bash 中执行的命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 为/bin/bash添加readline探针</span></span>
<span class="line"><span>$ perf probe -x /bin/bash &#39;readline%return +0($retval):string’</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 采样记录</span></span>
<span class="line"><span>$ perf record -e probe_bash:readline__return -aR sleep 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查看结果</span></span>
<span class="line"><span>$ perf script</span></span>
<span class="line"><span>    bash 13348 [000] 93939.142576: probe_bash:readline__return: (5626ffac1610 &amp;lt;- 5626ffa46739) arg1=&quot;ls&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 跟踪完成后删除探针</span></span>
<span class="line"><span>$ perf probe --del probe_bash:readline__return</span></span></code></pre></div><p>当然，如果你不确定探针格式，也可以通过下面的命令，查询所有支持的函数和函数参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 查询所有的函数</span></span>
<span class="line"><span>$ perf probe -x /bin/bash —funcs</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查询函数的参数</span></span>
<span class="line"><span>$ perf probe -x /bin/bash -V readline</span></span>
<span class="line"><span>Available variables at readline</span></span>
<span class="line"><span>        &amp;#64;&amp;lt;readline+0&amp;gt;</span></span>
<span class="line"><span>                char*   prompt</span></span></code></pre></div><p>跟内核函数类似，如果你想要查看普通应用的函数名称和参数，那么在应用程序的二进制文件中，同样需要包含调试信息。</p><h2 id="ebpf-和-bcc" tabindex="-1">eBPF 和 BCC <a class="header-anchor" href="#ebpf-和-bcc" aria-label="Permalink to &quot;eBPF 和 BCC&quot;">​</a></h2><p>ftrace 和 perf 的功能已经比较丰富了，不过，它们有一个共同的缺陷，那就是不够灵活，没法像 DTrace 那样通过脚本自由扩展。</p><p>而 eBPF 就是 Linux 版的 DTrace，可以通过C 语言自由扩展（这些扩展通过 LLVM 转换为 BPF 字节码后，加载到内核中执行）。下面这张图，就表示了 eBPF 追踪的工作原理：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/a3547f2ac1d4d75b850a02a2735560e9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/a3547f2ac1d4d75b850a02a2735560e9.png" alt=""></a></p><p>（图片来自 <a href="https://thenewstack.io/long-last-linux-gets-dynamic-tracing/" target="_blank" rel="noreferrer">THE NEW STACK</a>）</p><p>从图中你可以看到，eBPF 的执行需要三步：</p><ul><li><p>从用户跟踪程序生成 BPF 字节码；</p></li><li><p>加载到内核中运行；</p></li><li><p>向用户空间输出结果。</p></li></ul><p>所以，从使用上来说，eBPF 要比我们前面看到的 ftrace 和 perf ，都更加繁杂。</p><p>实际上，在 eBPF 执行过程中，编译、加载还有 maps 等操作，对所有的跟踪程序来说都是通用的。把这些过程通过 Python 抽象起来，也就诞生了 BCC（BPF Compiler Collection）。</p><p>BCC 把 eBPF 中的各种事件源（比如 kprobe、uprobe、tracepoint 等）和数据操作（称为 Maps），也都转换成了 Python 接口（也支持 lua）。这样，使用 BCC 进行动态追踪时，编写简单的脚本就可以了。</p><p>不过要注意，因为需要跟内核中的数据结构交互，真正核心的事件处理逻辑，还是需要我们用 C 语言来编写。</p><p>至于 BCC 的安装方法，在内存模块的 <a href="https://time.geekbang.org/column/article/0?cid=140" target="_blank" rel="noreferrer">缓存案例</a> 中，我就已经介绍过了。如果你还没有安装过，可以执行下面的命令来安装（其他系统的安装请参考 <a href="https://github.com/iovisor/bcc/blob/master/INSTALL.md" target="_blank" rel="noreferrer">这里</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Ubuntu</span></span>
<span class="line"><span>sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4052245BD4284CDD</span></span>
<span class="line"><span>echo &quot;deb https://repo.iovisor.org/apt/$(lsb_release -cs) $(lsb_release -cs) main&quot; | sudo tee /etc/apt/sources.list.d/iovisor.list</span></span>
<span class="line"><span>sudo apt-get update</span></span>
<span class="line"><span>sudo apt-get install bcc-tools libbcc-examples linux-headers-$(uname -r)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># REHL 7.6</span></span>
<span class="line"><span>yum install bcc-tools</span></span></code></pre></div><p>安装后，BCC 会把所有示例（包括 Python 和 lua），放到 /usr/share/bcc/examples 目录中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ls /usr/share/bcc/examples</span></span>
<span class="line"><span>hello_world.py  lua  networking  tracing</span></span></code></pre></div><p>接下来，还是以 do_sys_open 为例，我们一起来看看，如何用 eBPF 和 BCC 实现同样的动态跟踪。</p><p>通常，我们可以把 BCC 应用，拆分为下面这四个步骤。</p><p>第一，跟所有的 Python 模块使用方法一样，在使用之前，先导入要用到的模块：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from bcc import BPF</span></span></code></pre></div><p>第二，需要定义事件以及处理事件的函数。这个函数需要用 C 语言来编写，作用是初始化刚才导入的 BPF 对象。这些用 C 语言编写的处理函数，要以字符串的形式送到 BPF 模块中处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># define BPF program (&quot;&quot;&quot; is used for multi-line string).</span></span>
<span class="line"><span># &#39;#&#39; indicates comments for python, while &#39;//&#39; indicates comments for C.</span></span>
<span class="line"><span>prog = &quot;&quot;&quot;</span></span>
<span class="line"><span>#include &amp;lt;uapi/linux/ptrace.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;uapi/linux/limits.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;linux/sched.h&amp;gt;</span></span>
<span class="line"><span>// define output data structure in C</span></span>
<span class="line"><span>struct data_t {</span></span>
<span class="line"><span>    u32 pid;</span></span>
<span class="line"><span>    u64 ts;</span></span>
<span class="line"><span>    char comm[TASK_COMM_LEN];</span></span>
<span class="line"><span>    char fname[NAME_MAX];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>BPF_PERF_OUTPUT(events);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// define the handler for do_sys_open.</span></span>
<span class="line"><span>// ctx is required, while other params depends on traced function.</span></span>
<span class="line"><span>int hello(struct pt_regs *ctx, int dfd, const char __user *filename, int flags){</span></span>
<span class="line"><span>    struct data_t data = {};</span></span>
<span class="line"><span>    data.pid = bpf_get_current_pid_tgid();</span></span>
<span class="line"><span>    data.ts = bpf_ktime_get_ns();</span></span>
<span class="line"><span>    if (bpf_get_current_comm(&amp;data.comm, sizeof(data.comm)) == 0) {</span></span>
<span class="line"><span>        bpf_probe_read(&amp;data.fname, sizeof(data.fname), (void *)filename);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    events.perf_submit(ctx, &amp;data, sizeof(data));</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span># load BPF program</span></span>
<span class="line"><span>b = BPF(text=prog)</span></span>
<span class="line"><span># attach the kprobe for do_sys_open, and set handler to hello</span></span>
<span class="line"><span>b.attach_kprobe(event=&quot;do_sys_open&quot;, fn_name=&quot;hello&quot;)</span></span></code></pre></div><p>第三步，是定义一个输出函数，并把输出函数跟 BPF 事件绑定：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># process event</span></span>
<span class="line"><span>start = 0</span></span>
<span class="line"><span>def print_event(cpu, data, size):</span></span>
<span class="line"><span>    global start</span></span>
<span class="line"><span>    # event’s type is data_t</span></span>
<span class="line"><span>    event = b[&quot;events&quot;].event(data)</span></span>
<span class="line"><span>    if start == 0:</span></span>
<span class="line"><span>            start = event.ts</span></span>
<span class="line"><span>    time_s = (float(event.ts - start)) / 1000000000</span></span>
<span class="line"><span>    print(&quot;%-18.9f %-16s %-6d %-16s&quot; % (time_s, event.comm, event.pid, event.fname))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># loop with callback to print_event</span></span>
<span class="line"><span>b[&quot;events&quot;].open_perf_buffer(print_event)</span></span></code></pre></div><p>最后一步，就是执行事件循环，开始追踪 do_sys_open 的调用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># print header</span></span>
<span class="line"><span>print(&quot;%-18s %-16s %-6s %-16s&quot; % (&quot;TIME(s)&quot;, &quot;COMM&quot;, &quot;PID&quot;, &quot;FILE”))</span></span>
<span class="line"><span># start the event polling loop</span></span>
<span class="line"><span>while 1:</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        b.perf_buffer_poll()</span></span>
<span class="line"><span>    except KeyboardInterrupt:</span></span>
<span class="line"><span>        exit()</span></span></code></pre></div><p>我们把上面几个步骤的代码，保存到文件 trace-open.py 中，然后就可以用 Python 来运行了。如果一切正常，你可以看到如下输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ python trace-open.py</span></span>
<span class="line"><span>TIME(s)            COMM             PID    FILE</span></span>
<span class="line"><span>0.000000000        irqbalance       1073   /proc/interrupts</span></span>
<span class="line"><span>0.000175401        irqbalance       1073   /proc/stat</span></span>
<span class="line"><span>0.000258802        irqbalance       1073   /proc/irq/9/smp_affinity</span></span>
<span class="line"><span>0.000290102        irqbalance       1073   /proc/irq/0/smp_affinity</span></span></code></pre></div><p>从输出中，你可以看到 irqbalance 进程（你的环境中可能还会有其他进程）正在打开很多文件，而 irqbalance 依赖这些文件中读取的内容，来执行中断负载均衡。</p><p>通过这个简单的示例，你也可以发现，eBPF 和 BCC 的使用，其实比 ftrace 和 perf 有更高的门槛。想用 BCC 开发自己的动态跟踪程序，至少要熟悉 C 语言、Python 语言、被跟踪事件或函数的特征（比如内核函数的参数和返回格式）以及 eBPF 提供的各种数据操作方法。</p><p>不过，因为强大的灵活性，虽然 eBPF 在使用上有一定的门槛，却也无法阻止它成为目前最热门、最受关注的动态追踪技术。</p><p>当然，BCC 软件包也内置了很多已经开发好的实用工具，默认安装到 /usr/share/bcc/tools/ 目录中，它们的使用场景如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/fc5f387a982db98c49c7cefb77342c21.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/fc5f387a982db98c49c7cefb77342c21.png" alt=""></a></p><p>（图片来自 <a href="http://www.brendangregg.com/ebpf.html#bcc" target="_blank" rel="noreferrer">Linux Extended BPF (eBPF) Tracing Tools</a>）</p><p>这些工具，一般都可以直接拿来用。而在编写其他的动态追踪脚本时，它们也是最好的参考资料。不过，有一点需要你特别注意，很多 eBPF 的新特性，都需要比较新的 <a href="https://github.com/iovisor/bcc/blob/master/docs/kernel-versions.md" target="_blank" rel="noreferrer">内核版本</a>（如下图所示）。如果某些工具无法运行，很可能就是因为使用了当前内核不支持的特性。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/61abce1affc770a15dae7d489e50a8e8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/61abce1affc770a15dae7d489e50a8e8.png" alt=""></a></p><p>（图片来自 <a href="http://www.brendangregg.com/ebpf.html#bcc" target="_blank" rel="noreferrer">Linux Extended BPF (eBPF) Tracing Tools</a>）</p><h2 id="systemtap-和-sysdig" tabindex="-1">SystemTap 和 sysdig <a class="header-anchor" href="#systemtap-和-sysdig" aria-label="Permalink to &quot;SystemTap 和 sysdig&quot;">​</a></h2><p>除了前面提到的 ftrace、perf、eBPF 和 BCC 外，SystemTap 和 sysdig 也是常用的动态追踪工具。</p><p><strong>SystemTap</strong> 也是一种可以通过脚本进行自由扩展的动态追踪技术。在 eBPF 出现之前，SystemTap 是Linux 系统中，功能最接近 DTrace 的动态追踪机制。不过要注意，SystemTap 在很长时间以来都游离于内核之外（而 eBPF 自诞生以来，一直根植在内核中）。</p><p>所以，从稳定性上来说，SystemTap 只在 RHEL 系统中好用，在其他系统中则容易出现各种异常问题。当然，反过来说，支持 3.x 等旧版本的内核，也是 SystemTap 相对于 eBPF 的一个巨大优势。</p><p><strong>sysdig</strong> 则是随着容器技术的普及而诞生的，主要用于容器的动态追踪。sysdig 汇集了一些列性能工具的优势，可以说是集百家之所长。我习惯用这个公式来表示sysdig的特点： sysdig = strace + tcpdump + htop + iftop + lsof + docker inspect。</p><p>而在最新的版本中（内核版本 &gt;= 4.14），sysdig 还可以通过 eBPF 来进行扩展，所以，也可以用来追踪内核中的各种函数和事件。</p><h2 id="如何选择追踪工具" tabindex="-1">如何选择追踪工具 <a class="header-anchor" href="#如何选择追踪工具" aria-label="Permalink to &quot;如何选择追踪工具&quot;">​</a></h2><p>到这里，你可能又觉得头大了，这么多动态追踪工具，在实际场景中到底该怎么选择呢？还是那句话，具体性能工具的选择，就要从具体的工作原理来入手。</p><p>这两节课，我们已经把常见工具的原理和特点都介绍过了，你可以先自己思考区分一下，不同场景的工具选择问题。比如：</p><ul><li><p>在不需要很高灵活性的场景中，使用 perf 对性能事件进行采样，然后再配合火焰图辅助分析，就是最常用的一种方法；</p></li><li><p>而需要对事件或函数调用进行统计分析（比如观察不同大小的 I/O 分布）时，就要用 SystemTap 或者 eBPF，通过一些自定义的脚本来进行数据处理。</p></li></ul><p>在这里，我也总结了几个常见的动态追踪使用场景，并且分别推荐了适合的工具。你可以保存这个表格，方便自己查找并使用。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/5a2b2550547d5eaee850bfb806f76625.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Linux%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98/images/86710/5a2b2550547d5eaee850bfb806f76625.png" alt=""></a></p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我主要带你学习了 perf、eBPF 和 BCC 等动态追踪方法，并总结了不同场景中如何选择动态追踪方法。</p><p>在 Linux 系统中，常见的动态追踪方法，包括 ftrace、perf、eBPF 以及 SystemTap 等。在大多数性能问题中，使用 perf 配合火焰图是一个不错的方法。如果这满足不了你的要求，那么：</p><ul><li><p>在新版的内核中，eBPF 和 BCC 是最灵活的动态追踪方法；</p></li><li><p>而在旧版本内核中，特别是在 RHEL 系统中，由于 eBPF 支持受限，SystemTap 往往是更好的选择。</p></li></ul><p>此外，在使用动态追踪技术时，为了得到分析目标的详细信息，一般需要内核以及应用程序的调试符号表。动态追踪实际上也是在这些符号（包括函数和事件）上进行的，所以易读易理解的符号，有助于加快动态追踪的过程。</p><h2 id="思考" tabindex="-1">思考 <a class="header-anchor" href="#思考" aria-label="Permalink to &quot;思考&quot;">​</a></h2><p>最后，我想邀请你一起来聊聊，你所理解的动态追踪技术。你有没有在实际环境中用过动态追踪呢？这么多的动态追踪方法，你一般会怎么选择呢？你可以结合今天的内容，和你自己的操作记录，来总结思路。</p><p>欢迎在留言区和我讨论，也欢迎把这篇文章分享给你的同事、朋友。我们一起在实战中演练，在交流中进步。</p>`,102)])])}const h=a(t,[["render",l]]);export{b as __pageData,h as default};
