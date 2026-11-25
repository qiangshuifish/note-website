import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"27-难点解析：如何调试eBPF程序","description":"","frontmatter":{},"headers":[{"level":2,"title":"日志","slug":"日志","link":"#日志","children":[{"level":3,"title":"bpf_trace_printk","slug":"bpf-trace-printk","link":"#bpf-trace-printk","children":[]},{"level":3,"title":"bpf_printk","slug":"bpf-printk","link":"#bpf-printk","children":[]},{"level":3,"title":"如何查看日志","slug":"如何查看日志","link":"#如何查看日志","children":[]}]},{"level":2,"title":"单元测试","slug":"单元测试","link":"#单元测试","children":[{"level":3,"title":"eBPF 程序","slug":"ebpf-程序","link":"#ebpf-程序","children":[]},{"level":3,"title":"单元测试程序","slug":"单元测试程序","link":"#单元测试程序","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[{"level":3,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}]}],"relativePath":"eBPF核心技术与实战/27-难点解析：如何调试eBPF程序.md","filePath":"eBPF核心技术与实战/27-难点解析：如何调试eBPF程序.md","lastUpdated":1795536221000}'),e={name:"eBPF核心技术与实战/27-难点解析：如何调试eBPF程序.md"};function t(l,s,c,h,d,r){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_27-难点解析-如何调试ebpf程序" tabindex="-1">27-难点解析：如何调试eBPF程序 <a class="header-anchor" href="#_27-难点解析-如何调试ebpf程序" aria-label="Permalink to &quot;27-难点解析：如何调试eBPF程序&quot;">​</a></h1><p>你好，我是倪朋飞。</p><p>在上一讲中，我带你深入探讨了 eBPF 程序参数格式和返回格式的设计。从 Linux 内核 eBPF</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>源码出发，我们重点分析了 BPF_PROG_TYPE 宏定义，并详细讨论了不同类型 eBPF 程序的</span></span></code></pre></div><p>参数格式和返回格式。为了便于理解和快速参考，我还以表格形式对常用的 eBPF 程序类型进行了全面汇总。通过这节课程，相信你在开发新的 eBPF 程序时能够更加得心应手地选择合适的程序类型，并正确处理其参数和返回值。</p><p>除了不容易找到 eBPF 程序的参数格式及返回格式之外，开发 eBPF 程序的另一个难点是如何调试 eBPF 程序。由于 eBPF 程序运行在内核虚拟机中，传统的调试工具如 GDB、Valgrind和 strace 等都无法直接使用。这就导致开发者在完成 eBPF 程序开发后，往往很难有效地排查和解决代码中的潜在问题。在我们课程的留言区，我也收到很多类似的留言。</p><p>今天，我就带你一起来深入探讨这个问题，并为你介绍一些高效的调试方法和技巧。通过这些方法，希望能够帮助你更好地应对 eBPF 程序开发中的挑战，提高代码质量和开发效率。</p><h2 id="日志" tabindex="-1">日志 <a class="header-anchor" href="#日志" aria-label="Permalink to &quot;日志&quot;">​</a></h2><p>首先，我们来看一个最简单、最常用的方法，也就是打印调试日志。在我们课程之前的案例中，其实已经大量使用了这种方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我想你也应该已经在不同的 eBPF 程序中使用过 bpf_trace_printk() 或者</span></span>
<span class="line"><span>bpf_printk() 等方式来打印日志，不过我想再次提醒你注意它们在使用时的限制。</span></span></code></pre></div><h3 id="bpf-trace-printk" tabindex="-1">bpf_trace_printk <a class="header-anchor" href="#bpf-trace-printk" aria-label="Permalink to &quot;bpf_trace_printk&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>先看第一个 bpf_trace_printk()。</span></span>
<span class="line"><span>bpf_trace_printk() 是一个 eBPF 辅助函数，最多只支持 3 个参数，并且在使用时需要</span></span></code></pre></div><p>传入格式化字符串的长度。比如下面就是一个简单的示例：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">static </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> char</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fmt[] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;some int: %d&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bpf_trace_printk</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fmt, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fmt), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">123</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">可以看到，</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bpf_trace_printk</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 使用起来还是比较麻烦的。</span></span></code></pre></div><h3 id="bpf-printk" tabindex="-1">bpf_printk <a class="header-anchor" href="#bpf-printk" aria-label="Permalink to &quot;bpf_printk&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>接下来，再来看它的简化版本 bpf_printk()。</span></span>
<span class="line"><span>bpf_printk() 是 Libbpf 引入的一个宏，用来简化 eBPF 程序打印调试日志的过程。为了方</span></span>
<span class="line"><span>便开发者使用，它在内部封装了 bpf_trace_printk() 和 bpf_trace_vprintk() 这两</span></span></code></pre></div><p>个函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>当参数数量小于或等于 3 的时候，还是继续调用 bpf_trace_printk() 来打印日志。</span></span>
<span class="line"><span>而当参数数量大于 3 的时候，则调用 bpf_trace_vprintk() 来打印日志，这样最多可</span></span></code></pre></div><ul><li>以支持 12 个参数，当然限制是需要 v5.16 或者更新的内核。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>简化之后，bpf_printk() 的使用就很方便了，不再需要传入格式化字符串的长度，比如下</span></span></code></pre></div><p>面就是一个简单的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bpf_printk(&quot;Process[%d]: %s\\n&quot;, pid, filename);</span></span></code></pre></div><h3 id="如何查看日志" tabindex="-1">如何查看日志 <a class="header-anchor" href="#如何查看日志" aria-label="Permalink to &quot;如何查看日志&quot;">​</a></h3><p>进行到这里，日志已经打印了，那么又该如何查看日志呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>其实，无论是哪种方法，你都可以到 /sys/kernel/debug/tracing/trace 或</span></span>
<span class="line"><span>/sys/kernel/debug/tracing/trace_pipe 找到打印的日志。注意，trace 记录的是</span></span>
<span class="line"><span>静态快照，而 trace_pipe 则是动态的输出。</span></span></code></pre></div><p>至于具体的日志格式，我已经在第 3 讲 初窥门径：开发并运行你的第一个 eBPF 程序 中详细讲过。如果你已经忘记了，可以回去再复习一下。</p><p>虽然日志是最常用的调试方法，但由于其对性能有比较大的影响，通常在生产环境中并不建议打印过多的日志。那么，还有没有其他的方法来确保 eBPF 程序的行为是我们期望的结果呢？</p><p>接下来，我们再来看看另外一种测试 eBPF 程序的方法，即单元测试。</p><h2 id="单元测试" tabindex="-1">单元测试 <a class="header-anchor" href="#单元测试" aria-label="Permalink to &quot;单元测试&quot;">​</a></h2><p>对于程序开发来说，单元测试是必不可少的一部分，是确保程序的行为跟我们的预期一致的重要手段，eBPF 程序的开发自然也不例外。良好的单元测试不仅能够提前发现问题，还能为后续的重构提供质量保障。</p><p>不过，eBPF 程序毕竟运行在内核态，并不能像常规编程那样直接通过接口模拟进行测试。那么，该如何对 eBPF 程序进行单元测试呢？</p><p>Linux 内核开发者自然也考虑到了这个问题，所以为此专门增加了一个</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BPF_PROG_TEST_RUN 的系统调用，后来又简化为 BPF_PROG_RUN（这两个系统调用可以</span></span>
<span class="line"><span>直接互替，这一讲中我们使用简化的 BPF_PROG_RUN）。</span></span>
<span class="line"><span>BPF_PROG_RUN 命令允许你将 eBPF 程序加载到内核后多次运行，并基于你提供的输入记录</span></span></code></pre></div><p>输出，这样就可以方便地进行单元测试或基准测试。同其他 eBPF 命令一样，Libbpf 对它也进</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>行了封装，也就是 bpf_prog_test_run_opts() 库函数，它的定义如下所示：</span></span>
<span class="line"><span>LIBBPF_API int bpf_prog_test_run_opts(int prog_fd,</span></span>
<span class="line"><span>         struct bpf_test_run_opts *opts);</span></span>
<span class="line"><span>这其中，prog_fd 是 eBPF 程序加载后的文件描述符，而 struct bpf_test_run_opts</span></span></code></pre></div><p>则是用来传入单元测试的参数，包括输入数据、上下文信息、重复执行次数、批处理大小等，其定义如下所示。为了方便你理解，我已经加上了详细的注释。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">struct bpf_test_run_opts {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 结构体的大小，用于前向 / 后向兼容性</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   size_t sz;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输入数据的指针，可选</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> *data_in;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输入数据的大小</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 data_size_in;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输出数据的指针，可选</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">data_out;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输出数据的大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输入时：data_out 的最大长度</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输出时：data_out 的实际长度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 data_size_out;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输入上下文的指针，可选</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> *ctx_in;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输入上下文的大小</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 ctx_size_in;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输出上下文的指针，可选</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   void</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ctx_out;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输出上下文的大小</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输入时：ctx_out 的最大长度</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 输出时：ctx_out 的实际长度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 ctx_size_out;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // eBPF 程序的返回值（作为输出）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 retval;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 重复执行次数（用于基准测试）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   int repeat;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 平均每次执行的耗时（单位纳秒，作为输出）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 duration;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 标志位</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 flags;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 指定运行 BPF 程序的 CPU</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 cpu;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 批处理大小</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   __u32 batch_size;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">接下来，让我用一个简单的示例带你一起看看如何使用 </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bpf_prog_test_run_opts</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() 来做</span></span></code></pre></div><p>单元测试。</p><h3 id="ebpf-程序" tabindex="-1">eBPF 程序 <a class="header-anchor" href="#ebpf-程序" aria-label="Permalink to &quot;eBPF 程序&quot;">​</a></h3><p>要做单元测试，首先当然还是需要有一个待测试的 eBPF 程序，以下就是这个 eBPF 程序的核心代码（完整的代码请参考 GitHub）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SEC(&quot;xdp&quot;)</span></span>
<span class="line"><span>int xdp_prog_drop(struct xdp_md *ctx)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> void *data = (void *)(long)ctx-&gt;data;</span></span>
<span class="line"><span> void *data_end = (void *)(long)ctx-&gt;data_end;</span></span>
<span class="line"><span> int pkt_sz = data_end - data;</span></span>
<span class="line"><span> bpf_printk(&quot;packet size: %d&quot;, pkt_sz);</span></span>
<span class="line"><span> struct ethhdr *eth = data;</span></span>
<span class="line"><span> struct iphdr *iph = data + sizeof(struct ethhdr);</span></span>
<span class="line"><span> if (data + sizeof(struct ethhdr) + sizeof(struct iphdr) &gt; data_end)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   return XDP_PASS;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> if (iph-&gt;protocol == IPPROTO_ICMP)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>  return XDP_DROP;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return XDP_PASS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从这段代码你可以看出，它的功能就是丢弃所有的 ICMP 包，而正常放过其他类型的网络包。</p><h3 id="单元测试程序" tabindex="-1">单元测试程序 <a class="header-anchor" href="#单元测试程序" aria-label="Permalink to &quot;单元测试程序&quot;">​</a></h3><p>eBPF 程序开发完成后，接下来我们就可以开始开发单元测试程序了。和常规的 eBPF 程序类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>似，我们还需要首先编译 eBPF 程序为字节码，然后再调用  bpftool gen skeleton  为</span></span></code></pre></div><p>eBPF 字节码生成脚手架头文件，最后再到测试文件中引用脚手架头文件加载并测试 eBPF 程序。</p><p>忽略异常处理和工具函数后，测试程序的核心代码如下所示（完整的代码请参考 GitHub）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int main(int argc, char **argv)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> /* 1. 构造 ICMP 和 TCP 包 */</span></span>
<span class="line"><span> char *icmp_packet = get_icmp();</span></span>
<span class="line"><span> char *tcp_packet = get_tcp();</span></span>
<span class="line"><span> /* 2. 构造 ICMP 测试参数 */</span></span>
<span class="line"><span> struct bpf_test_run_opts opts = {</span></span>
<span class="line"><span>   .sz = sizeof(struct bpf_test_run_opts),</span></span>
<span class="line"><span>   .data_in = icmp_packet,</span></span>
<span class="line"><span>   .data_size_in = ICMP_SIZE,</span></span>
<span class="line"><span> };</span></span>
<span class="line"><span> /* 3. 加载 XDP 程序 */</span></span>
<span class="line"><span> struct xdp_drop_test_bpf *obj = xdp_drop_test_bpf__open_and_load();</span></span>
<span class="line"><span> if (!obj) {</span></span>
<span class="line"><span>   fprintf(stderr, &quot;failed to open and/or load BPF object\\n&quot;);</span></span>
<span class="line"><span>   free(icmp_packet);</span></span>
<span class="line"><span>   free(tcp_packet);</span></span>
<span class="line"><span>   return 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> /* 4. 执行 ICMP 测试 */</span></span>
<span class="line"><span> int prog_id = bpf_program__fd(obj-&gt;progs.xdp_prog_drop);</span></span>
<span class="line"><span> int err = bpf_prog_test_run_opts(prog_id, &amp;opts);</span></span>
<span class="line"><span> if (err != 0) {</span></span>
<span class="line"><span>   fprintf(stderr,</span></span>
<span class="line"><span>     &quot;[FAIL] failed to run bpf_prog_test_run_opts() for ICMP: %d\\n&quot;,</span></span>
<span class="line"><span>     err);</span></span>
<span class="line"><span>   goto cleanup;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> if (opts.retval == XDP_DROP) {</span></span>
<span class="line"><span>   fprintf(stdout, &quot;[PASS] ICMP packets dropped\\n&quot;);</span></span>
<span class="line"><span> } else {</span></span>
<span class="line"><span>   fprintf(stdout, &quot;[FAIL] ICMP packets not dropped\\n&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> /* 5. 构造 TCP 测试参数并执行 TCP 测试 */</span></span>
<span class="line"><span> struct bpf_test_run_opts tcp_opts = {</span></span>
<span class="line"><span>   .sz = sizeof(struct bpf_test_run_opts),</span></span>
<span class="line"><span>   .data_in = tcp_packet,</span></span>
<span class="line"><span>   .data_size_in = TCP_SIZE,</span></span>
<span class="line"><span> };</span></span>
<span class="line"><span> err = bpf_prog_test_run_opts(prog_id, &amp;tcp_opts);</span></span>
<span class="line"><span> if (err != 0) {</span></span>
<span class="line"><span>   fprintf(stderr,</span></span>
<span class="line"><span>     &quot;[FAIL] failed to run bpf_prog_test_run_opts() for TCP: %d\\n&quot;,</span></span>
<span class="line"><span>     err);</span></span>
<span class="line"><span>   goto cleanup;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> if (tcp_opts.retval == XDP_PASS) {</span></span>
<span class="line"><span>   fprintf(stdout, &quot;[PASS] TCP packets passed\\n&quot;);</span></span>
<span class="line"><span> } else {</span></span>
<span class="line"><span>   fprintf(stdout, &quot;[FAIL] TCP packets not passed\\n&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // cleanup</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从这段代码中你可以看出，测试 eBPF 程序主要分为三步。</p><ul><li><p>第一步，构造输入数据：eBPF 程序所需要的数据和上下文信息需要在测试之前构造好，这里我们构造了一个 ICMP 包和一个 TCP 包。</p></li><li><p>第二步，加载 eBPF 程序：eBPF 程序加载之后不再需要挂载到网卡上，而是在运行测试时通过构造数据自动触发其执行。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>第三，开始测试：设置 bpf_test_run_opts 参数之后运行</span></span>
<span class="line"><span>bpf_prog_test_run_opts() 开始测试，最后再验证运行结果是否跟期望值相同。</span></span></code></pre></div><p>测试程序编译之后，你就可以开始运行测试了。注意测试时需要使用 sudo 或者 root 用户运行，如果一切正常，你将看到如下的输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># sudo ./xdp_drop_test</span></span>
<span class="line"><span>[PASS] ICMP packets dropped</span></span>
<span class="line"><span>[PASS] TCP packets passed</span></span>
<span class="line"><span>对于大型应用程序，你还可以基于 BPF_PROG_RUN 构建专用的测试框架，进一步简化新功能</span></span></code></pre></div><p>的测试过程，从而确保测试的全面性和准确性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>一个典型的例子是 Cilium 项目。Cilium 团队基于 BPF_PROG_RUN 开发了一套独特的测试框</span></span></code></pre></div><p>架，专门针对其 eBPF 程序进行优化。通过定制化的测试框架， Cilium 能够更加高效地验证其复杂的网络和安全功能。如果你想深入了解 Cilium 的测试框架及其实现细节，可以参考它的 官方测试文档。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我带你一起探讨了 eBPF 程序的调试方法。eBPF 程序运行在内核虚拟机中，无法直接使用传统的调试工具，从而导致 eBPF 程序的调试成为一大难题。</p><p>在今天的课程中，我和你分享了两种有效调试 eBPF 程序的方法，即日志记录和单元测试。这两种方法虽然简单，却能在 eBPF 开发过程中发挥重要作用，帮助你有效调试和解决开发测试过程中的各种问题。</p><p>第一种，日志是最简单、最有效的调试方法，也是应用最广泛的一种方法。然而，由于日志记录对系统性能有较大影响，故而在生产环境中应当谨慎使用。</p><p>第二种，单元测试也是程序开发过程中必不可少的一环，良好的单元测试不仅能够帮你提前发现问题，还能为后续的新变更提供质量保障。借助 Libbpf 提供的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bpf_prog_test_run_opts() 库函数，通过 BPF_PROG_RUN 方法对 eBPF 程序进行单元</span></span></code></pre></div><p>测试，操作起来也很方便。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你可能也注意到了，使用 BPF_PROG_RUN 这种方法来做测试时，实际上还是需要加载 eBPF</span></span></code></pre></div><p>程序到内核里，所以它的测试过程还是依赖于测试所在系统的内核。</p><p>这样一来，想要测试不同版本内核的兼容性时，就需要我们为这些内核创建相应的测试环境。比如，你可以使用 QEMU 或者云平台为不同版本的内核创建响应的虚拟机，然后在这些虚拟机中测试不同内核的兼容性。</p><p>除了这些方法之外，对于 XDP、TC 和 cGroup 类型的 eBPF 程序，你还可以使用 fentry/fexit来跟踪它们的执行过程。相比 kprobe，fentry/fexit 不仅性能优越，而且还能跟踪 eBPF 程序本身，而不是仅限于内核函数。</p><h3 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h3><p>最后，我想邀请你也来聊一聊你的 eBPF 程序开发经历，特别是调试过程中遇到的挑战及解决方法。你是否使用过今天课程中提到的调试方法呢？有什么宝贵经验可以与同学们交流吗？</p><p>期待你在留言区和我讨论，也欢迎把这节课分享给你的同事、朋友。让我们一起在实战中演练，在交流中进步。</p>`,70)])])}const _=a(e,[["render",t]]);export{k as __pageData,_ as default};
