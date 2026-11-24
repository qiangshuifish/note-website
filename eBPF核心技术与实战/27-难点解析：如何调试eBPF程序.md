# 27-难点解析：如何调试eBPF程序

你好，我是倪朋飞。

在上一讲中，我带你深入探讨了 eBPF 程序参数格式和返回格式的设计。从 Linux 内核 eBPF

```
源码出发，我们重点分析了 BPF_PROG_TYPE 宏定义，并详细讨论了不同类型 eBPF 程序的
```

参数格式和返回格式。为了便于理解和快速参考，我还以表格形式对常用的 eBPF 程序类型进行了全面汇总。通过这节课程，相信你在开发新的 eBPF 程序时能够更加得心应手地选择合适的程序类型，并正确处理其参数和返回值。

除了不容易找到 eBPF 程序的参数格式及返回格式之外，开发 eBPF 程序的另一个难点是如何调试 eBPF 程序。由于 eBPF 程序运行在内核虚拟机中，传统的调试工具如 GDB、Valgrind和 strace 等都无法直接使用。这就导致开发者在完成 eBPF 程序开发后，往往很难有效地排查和解决代码中的潜在问题。在我们课程的留言区，我也收到很多类似的留言。

今天，我就带你一起来深入探讨这个问题，并为你介绍一些高效的调试方法和技巧。通过这些方法，希望能够帮助你更好地应对 eBPF 程序开发中的挑战，提高代码质量和开发效率。

## 日志

首先，我们来看一个最简单、最常用的方法，也就是打印调试日志。在我们课程之前的案例中，其实已经大量使用了这种方法。

```
我想你也应该已经在不同的 eBPF 程序中使用过 bpf_trace_printk() 或者
bpf_printk() 等方式来打印日志，不过我想再次提醒你注意它们在使用时的限制。
```

### bpf_trace_printk

```
先看第一个 bpf_trace_printk()。
bpf_trace_printk() 是一个 eBPF 辅助函数，最多只支持 3 个参数，并且在使用时需要
```

传入格式化字符串的长度。比如下面就是一个简单的示例：

```javascript
static const char fmt[] = "some int: %d";
bpf_trace_printk(fmt, sizeof(fmt), 123);
可以看到，bpf_trace_printk() 使用起来还是比较麻烦的。
```

### bpf_printk

```
接下来，再来看它的简化版本 bpf_printk()。
bpf_printk() 是 Libbpf 引入的一个宏，用来简化 eBPF 程序打印调试日志的过程。为了方
便开发者使用，它在内部封装了 bpf_trace_printk() 和 bpf_trace_vprintk() 这两
```

个函数：

```
当参数数量小于或等于 3 的时候，还是继续调用 bpf_trace_printk() 来打印日志。
而当参数数量大于 3 的时候，则调用 bpf_trace_vprintk() 来打印日志，这样最多可
```

- 以支持 12 个参数，当然限制是需要 v5.16 或者更新的内核。

```
简化之后，bpf_printk() 的使用就很方便了，不再需要传入格式化字符串的长度，比如下
```

面就是一个简单的示例：

```
bpf_printk("Process[%d]: %s\n", pid, filename);
```

### 如何查看日志

进行到这里，日志已经打印了，那么又该如何查看日志呢？

```
其实，无论是哪种方法，你都可以到 /sys/kernel/debug/tracing/trace 或
/sys/kernel/debug/tracing/trace_pipe 找到打印的日志。注意，trace 记录的是
静态快照，而 trace_pipe 则是动态的输出。
```

至于具体的日志格式，我已经在第 3 讲 初窥门径：开发并运行你的第一个 eBPF 程序 中详细讲过。如果你已经忘记了，可以回去再复习一下。

虽然日志是最常用的调试方法，但由于其对性能有比较大的影响，通常在生产环境中并不建议打印过多的日志。那么，还有没有其他的方法来确保 eBPF 程序的行为是我们期望的结果呢？

接下来，我们再来看看另外一种测试 eBPF 程序的方法，即单元测试。

## 单元测试

对于程序开发来说，单元测试是必不可少的一部分，是确保程序的行为跟我们的预期一致的重要手段，eBPF 程序的开发自然也不例外。良好的单元测试不仅能够提前发现问题，还能为后续的重构提供质量保障。

不过，eBPF 程序毕竟运行在内核态，并不能像常规编程那样直接通过接口模拟进行测试。那么，该如何对 eBPF 程序进行单元测试呢？

Linux 内核开发者自然也考虑到了这个问题，所以为此专门增加了一个

```
BPF_PROG_TEST_RUN 的系统调用，后来又简化为 BPF_PROG_RUN（这两个系统调用可以
直接互替，这一讲中我们使用简化的 BPF_PROG_RUN）。
BPF_PROG_RUN 命令允许你将 eBPF 程序加载到内核后多次运行，并基于你提供的输入记录
```

输出，这样就可以方便地进行单元测试或基准测试。同其他 eBPF 命令一样，Libbpf 对它也进

```
行了封装，也就是 bpf_prog_test_run_opts() 库函数，它的定义如下所示：
LIBBPF_API int bpf_prog_test_run_opts(int prog_fd,
         struct bpf_test_run_opts *opts);
这其中，prog_fd 是 eBPF 程序加载后的文件描述符，而 struct bpf_test_run_opts
```

则是用来传入单元测试的参数，包括输入数据、上下文信息、重复执行次数、批处理大小等，其定义如下所示。为了方便你理解，我已经加上了详细的注释。

```javascript
struct bpf_test_run_opts {
    // 结构体的大小，用于前向 / 后向兼容性
   size_t sz;
   // 输入数据的指针，可选
   const void *data_in;
   // 输入数据的大小
   __u32 data_size_in;
   // 输出数据的指针，可选
   void *data_out;
   // 输出数据的大小
   // 输入时：data_out 的最大长度
   // 输出时：data_out 的实际长度
   __u32 data_size_out;
   // 输入上下文的指针，可选
   const void *ctx_in;
   // 输入上下文的大小
   __u32 ctx_size_in;
   // 输出上下文的指针，可选
   void *ctx_out;
   // 输出上下文的大小
   // 输入时：ctx_out 的最大长度
   // 输出时：ctx_out 的实际长度
   __u32 ctx_size_out;
   // eBPF 程序的返回值（作为输出）
   __u32 retval;
   // 重复执行次数（用于基准测试）
   int repeat;
   // 平均每次执行的耗时（单位纳秒，作为输出）
   __u32 duration;
   // 标志位
   __u32 flags;
   // 指定运行 BPF 程序的 CPU
   __u32 cpu;
   // 批处理大小
   __u32 batch_size;
};
接下来，让我用一个简单的示例带你一起看看如何使用 bpf_prog_test_run_opts() 来做
```

单元测试。

### eBPF 程序

要做单元测试，首先当然还是需要有一个待测试的 eBPF 程序，以下就是这个 eBPF 程序的核心代码（完整的代码请参考 GitHub）：

```
SEC("xdp")
int xdp_prog_drop(struct xdp_md *ctx)
{
 void *data = (void *)(long)ctx->data;
 void *data_end = (void *)(long)ctx->data_end;
 int pkt_sz = data_end - data;
 bpf_printk("packet size: %d", pkt_sz);
 struct ethhdr *eth = data;
 struct iphdr *iph = data + sizeof(struct ethhdr);
 if (data + sizeof(struct ethhdr) + sizeof(struct iphdr) > data_end)
 {
   return XDP_PASS;
 }
 if (iph->protocol == IPPROTO_ICMP)
 {
  return XDP_DROP;
 }
 return XDP_PASS;
}
```

从这段代码你可以看出，它的功能就是丢弃所有的 ICMP 包，而正常放过其他类型的网络包。

### 单元测试程序

eBPF 程序开发完成后，接下来我们就可以开始开发单元测试程序了。和常规的 eBPF 程序类

```
似，我们还需要首先编译 eBPF 程序为字节码，然后再调用  bpftool gen skeleton  为
```

eBPF 字节码生成脚手架头文件，最后再到测试文件中引用脚手架头文件加载并测试 eBPF 程序。

忽略异常处理和工具函数后，测试程序的核心代码如下所示（完整的代码请参考 GitHub）：

```
int main(int argc, char **argv)
{
 /* 1. 构造 ICMP 和 TCP 包 */
 char *icmp_packet = get_icmp();
 char *tcp_packet = get_tcp();
 /* 2. 构造 ICMP 测试参数 */
 struct bpf_test_run_opts opts = {
   .sz = sizeof(struct bpf_test_run_opts),
   .data_in = icmp_packet,
   .data_size_in = ICMP_SIZE,
 };
 /* 3. 加载 XDP 程序 */
 struct xdp_drop_test_bpf *obj = xdp_drop_test_bpf__open_and_load();
 if (!obj) {
   fprintf(stderr, "failed to open and/or load BPF object\n");
   free(icmp_packet);
   free(tcp_packet);
   return 1;
 }
 /* 4. 执行 ICMP 测试 */
 int prog_id = bpf_program__fd(obj->progs.xdp_prog_drop);
 int err = bpf_prog_test_run_opts(prog_id, &opts);
 if (err != 0) {
   fprintf(stderr,
     "[FAIL] failed to run bpf_prog_test_run_opts() for ICMP: %d\n",
     err);
   goto cleanup;
 }
 if (opts.retval == XDP_DROP) {
   fprintf(stdout, "[PASS] ICMP packets dropped\n");
 } else {
   fprintf(stdout, "[FAIL] ICMP packets not dropped\n");
 }
 /* 5. 构造 TCP 测试参数并执行 TCP 测试 */
 struct bpf_test_run_opts tcp_opts = {
   .sz = sizeof(struct bpf_test_run_opts),
   .data_in = tcp_packet,
   .data_size_in = TCP_SIZE,
 };
 err = bpf_prog_test_run_opts(prog_id, &tcp_opts);
 if (err != 0) {
   fprintf(stderr,
     "[FAIL] failed to run bpf_prog_test_run_opts() for TCP: %d\n",
     err);
   goto cleanup;
 }
 if (tcp_opts.retval == XDP_PASS) {
   fprintf(stdout, "[PASS] TCP packets passed\n");
 } else {
   fprintf(stdout, "[FAIL] TCP packets not passed\n");
 }
 // cleanup
 ...
}
```

从这段代码中你可以看出，测试 eBPF 程序主要分为三步。

- 第一步，构造输入数据：eBPF 程序所需要的数据和上下文信息需要在测试之前构造好，这里我们构造了一个 ICMP 包和一个 TCP 包。

- 第二步，加载 eBPF 程序：eBPF 程序加载之后不再需要挂载到网卡上，而是在运行测试时通过构造数据自动触发其执行。

```
第三，开始测试：设置 bpf_test_run_opts 参数之后运行
bpf_prog_test_run_opts() 开始测试，最后再验证运行结果是否跟期望值相同。
```

测试程序编译之后，你就可以开始运行测试了。注意测试时需要使用 sudo 或者 root 用户运行，如果一切正常，你将看到如下的输出：

```
# sudo ./xdp_drop_test
[PASS] ICMP packets dropped
[PASS] TCP packets passed
对于大型应用程序，你还可以基于 BPF_PROG_RUN 构建专用的测试框架，进一步简化新功能
```

的测试过程，从而确保测试的全面性和准确性。

```
一个典型的例子是 Cilium 项目。Cilium 团队基于 BPF_PROG_RUN 开发了一套独特的测试框
```

架，专门针对其 eBPF 程序进行优化。通过定制化的测试框架， Cilium 能够更加高效地验证其复杂的网络和安全功能。如果你想深入了解 Cilium 的测试框架及其实现细节，可以参考它的 官方测试文档。

## 小结

今天，我带你一起探讨了 eBPF 程序的调试方法。eBPF 程序运行在内核虚拟机中，无法直接使用传统的调试工具，从而导致 eBPF 程序的调试成为一大难题。

在今天的课程中，我和你分享了两种有效调试 eBPF 程序的方法，即日志记录和单元测试。这两种方法虽然简单，却能在 eBPF 开发过程中发挥重要作用，帮助你有效调试和解决开发测试过程中的各种问题。

第一种，日志是最简单、最有效的调试方法，也是应用最广泛的一种方法。然而，由于日志记录对系统性能有较大影响，故而在生产环境中应当谨慎使用。

第二种，单元测试也是程序开发过程中必不可少的一环，良好的单元测试不仅能够帮你提前发现问题，还能为后续的新变更提供质量保障。借助 Libbpf 提供的

```
bpf_prog_test_run_opts() 库函数，通过 BPF_PROG_RUN 方法对 eBPF 程序进行单元
```

测试，操作起来也很方便。

```
你可能也注意到了，使用 BPF_PROG_RUN 这种方法来做测试时，实际上还是需要加载 eBPF
```

程序到内核里，所以它的测试过程还是依赖于测试所在系统的内核。

这样一来，想要测试不同版本内核的兼容性时，就需要我们为这些内核创建相应的测试环境。比如，你可以使用 QEMU 或者云平台为不同版本的内核创建响应的虚拟机，然后在这些虚拟机中测试不同内核的兼容性。

除了这些方法之外，对于 XDP、TC 和 cGroup 类型的 eBPF 程序，你还可以使用 fentry/fexit来跟踪它们的执行过程。相比 kprobe，fentry/fexit 不仅性能优越，而且还能跟踪 eBPF 程序本身，而不是仅限于内核函数。

### 思考与讨论

最后，我想邀请你也来聊一聊你的 eBPF 程序开发经历，特别是调试过程中遇到的挑战及解决方法。你是否使用过今天课程中提到的调试方法呢？有什么宝贵经验可以与同学们交流吗？

期待你在留言区和我讨论，也欢迎把这节课分享给你的同事、朋友。让我们一起在实战中演练，在交流中进步。
