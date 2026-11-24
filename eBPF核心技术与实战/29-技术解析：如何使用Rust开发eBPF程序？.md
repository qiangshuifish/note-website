# 29-技术解析：如何使用Rust开发eBPF程序？

你好，我是倪朋飞。

在上一讲中，我带你一起回顾了 eBPF 在 2024 年的发展历程。在过去的 2024 年，Linux 内核持续增强 eBPF，迭代增加了异常处理、可编程网络设备 Netkit、Arena 共享内存、KPROBE 会话以及可扩展调度器等一系列的重大更新，进一步提升了 eBPF 的安全性、灵活性以及运行时性能。

伴随着这些新特性，以内存安全、并发安全和高性能著称的 Rust 也在积极推进到 Linux 内核中，并通过 Rust for Linux 项目尝试从编程语言层面解决之前 C 代码带来的内存安全问题。虽然在 DMA API 访问和混合语言代码库维护等方面遭受到一些内核维护者的阻碍，但整体上Rust for Linux 项目还在稳步推进中，并且已经借助 Rust 实现了 NVMe、Nova GPU、AppleAGX GPU 以及空块设备（/dev/nullb*）等多个驱动。

不只是内核驱动，对于 eBPF 程序的开发来说，内存安全和高性能同样重要，因而 Rust 也是开发 eBPF 程序的理想选择。相比于 C 语言，Rust 提供了更强的类型系统和所有权模型，可以在编译时捕获错误的同时而不牺牲性能。今天，我就带你一起来看看如何使用 Rust 语言来开发一个 eBPF 程序。

## 为什么选择 Rust？

到这里，你可能会问，为什么其他编程语言都无法进入 Linux 内核，而 Rust 可以呢？

实际上，这是因为 Rust 同 C 类似，也是一种系统级的通用编程语言。它不仅没有运行时和垃圾回收器，更是在语言层面上就提供了高性能、类型安全和并发性保证。Rust 的所有权模型在编译时就可以跟踪引用对象的生命周期，防止内存安全错误和数据竞争，从而保证了内存安全和线程安全。Rust 的这些优点正是 C 语言被人诟病最多的地方，所以包括 Linux 在内的很多内核维护者都支持在内核中尝试 Rust 编程语言。

对于新手来说，Rust 有一定的学习门槛，它的很多编程语法并不像从 C 切换到 C++、Go 或者其他高级编程语言那样自然。但好在 Rust 拥有出色的文档、友好的编译器以及非常实用的错误信息，再配合其集成的包管理和构建工具 Cargo，你也不需要担心 Rust 的学习会成为一个障碍。如果你想要深入学习 Rust，可以参考它的官方学习指南。

## 有哪些 Rust eBPF 开发框架？

既然 Linux 内核都采纳了 Rust，内核 eBPF 的维护者和开源社区当然也不例外。我们课程经常用到的 libbpf 库就提供了针对 libbpf 的 Rust 绑定 libbpf-rs。

libbpf-rs 框架包含两个模块，libbpf-rs 和 libbpf-cargo，两者通常一起使用。它们的功能分别是：

- libbpf-rs 是 libbpf 库的 Rust 绑定，提供了用于同 libbpf 交互的 Rust API。

- libbpf-cargo 则是 Rust 构建工具 Cargo 的一个插件，方便开发者通过 Cargo 管理和编译eBPF 程序。

需要注意的是，由于 libbpf-rs 只是 libbpf 库的 Rust 绑定，并不提供任何内核态的直接支持。因而，在使用 libbpf-rs 开发 eBPF 程序时，只有用户态代码可以使用 Rust 来开发，而内核态则还是使用 C 语言来开发。

那么，能不能使用 Rust 同时开发内核态和用户态的 eBPF 程序呢？答案自然是可以，Aya框架正是因此而生。

Aya 是一个专注于可操作性和开发者体验的 eBPF 库。它不依赖 libbpf 和 bcc，完全用 Rust从头构建，仅使用 Rust 的 libc 包执行系统调用，并同时支持 eBPF 内核态和用户态的开发。为了方便用户使用，Aya 还提供了各种类型的 eBPF 程序模板，方便开发者快速入门。

接下来，我就以 TC 程序为例，带你一起来看看如何使用这两个框架开发 eBPF 程序。

## 如何搭建 Rust 开发环境？

在正式开始 eBPF 开发之前，我们首先需要安装 Rust 工具链，搭建 Rust 开发环境。

根据官方文档，通常推荐使用 rustup 工具来安装 Rust。执行下面的命令就可以安装 rustup并自动安装 Rust 稳定版本：

```bash
# 安装rustup，在提示时按下回车键使用默认配置
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
下载安装完成后，你还需要执行 source $HOME/.cargo/env 把刚刚安装的 Rust 工具链导
```

入到系统环境路径中。或者，你也可以把下面的环境变量配置到你的终端中（比如添加到

```bash
.bashrc或者 .zshrc中），这样就不需要每次打开终端时都去执行前面的 source 命令了：
export PATH="$HOME/.cargo/bin:$PATH"
```

```
配置完成后，你可以在终端中执行 rustc --version 命令来验证安装是否正确。如果一切
```

正常，你将看到如下的输出：

```
$ rustc --version
rustc 1.85.1 (4eb161250 2025-03-15)
```

到这儿，Rust 开发环境就搭建好了。

另外需要注意的是，对于新配置的开发环境，不要忘记安装 eBPF 开发所必须的 LLVM 和libelf 库。你可以执行下面的命令来安装它们：

```bash
# Ubuntu
sudo apt-get install -y make clang llvm libelf-dev linux-tools-$(uname -r)
# RHEL
sudo yum install -y make clang llvm elfutils-libelf-devel bpftool
```

接下来就正式进入今天的案例环节，我们一起看看如何使用 libbpf-rs 框架开发 eBPF 程序。

## 如何使用 libbpf-rs 开发 eBPF 程序？

还记得我们之前讲到的使用 libbpf 开发 eBPF 程序的步骤吗？如果不记得，可以到第 8 讲回顾一下。

跟这个步骤类似，使用 libbpf-rs 开发 eBPF 程序也需要 4 个步骤：

1. 新建一个 Rust 项目。

2. 使用 C 语言开发内核态 eBPF 程序。

3. 使用 libbpf-cargo 编译 eBPF 程序为字节码并生成脚手架框架。

4. 开发用户态 eBPF 程序。

第一步，新建一个 Rust 项目。

```
这一步跟新建普通的 Rust 项目是一样的，执行下面的 cargo new 命令即可：
cargo new hello-libbpf
```

成功执行后，Cargo 会帮我们创建项目目录结构，并初始化配置文件和主入口文件。项目结构如下所示：

```
$ tree hello-libbpf
hello-libbpf
├── Cargo.toml
└── src
   └── main.rs
```

这其中：

```
src/main.rs 是用户空间 Rust 代码的主入口文件。
Cargo.toml 是 Rust 项目配置文件，用于配置项目版本和依赖库等。
```

你可以看到，这里创建的就是一个普通的 Rust 项目，并没有 eBPF 程序相关的代码。

```
eBPF 内核态程序的源码通常放在 src/bpf/ 目录中。你可以执行下面的命令，创建这个目
```

录：

```bash
cd hello-libbpf
mkdir src/bpf
```

第二步，使用 C 语言开发内核态 eBPF 程序。

```
接下来，你就可以在新建的 src/bpf 目录开发 eBPF 内核态程序了。
```

由于 libbpf-rs 需要使用 C 语言来开发 eBPF 程序，因而我们可以创建一个

```
src/bpf/tc.bpf.c 文件，然后在 tc.bpf.c 文件中开发 eBPF 内核态程序。
```

这里，我们以 TC 程序阻止特定端口访问为例，看看如何完成这个程序的开发。

我们课程已经讲过很多使用 libbpf 开发 eBPF 程序的案例了，所以这儿具体的步骤就不再展开，完整源代码如下所示。为了方便你理解，我在关键的位置都加了注释：

```
/* 导入头文件 */
#include "vmlinux.h"
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_core_read.h>
#include <bpf/bpf_endian.h>
/* 常量定义 */
#define ETH_P_IP    0x0800
#define ETH_P_IPV6  0x86DD
#define TC_ACT_UNSPEC (-1)
#define TC_ACT_SHOT  2
u8 rc_allow = TC_ACT_UNSPEC;
u8 rc_disallow = TC_ACT_SHOT;
/* 定义BPF映射，用于用户空间配置允许的端口号 */
struct {
   __uint(type, BPF_MAP_TYPE_ARRAY);
   __uint(max_entries, 10);
   __type(value, u16);
   __type(key, u32);
} allow_ports SEC(".maps");
/* 如果端口号在允许的端口号列表中，则允许该端口 */
static bool allow_port(__be16 port)
{
   u16 hport = bpf_ntohs(port);
   u32 i = 0;
   for (i = 0; i < 10; i++) {
       u32 key = i;
       u16 *allow_port = bpf_map_lookup_elem(&allow_ports, &key);
       if (allow_port && hport == *allow_port) {
           return true;
       }
   }
   return false;
}
/* TC 程序主函数  */
SEC("tc")
int handle_tc(struct __sk_buff *skb)
{
   /* 默认不允许 */
   int rc = rc_disallow;
   /* 定义变量 */
   __be16 dst = 0;
   __be16 src = 0;
   __be16 port = 0;
   __u8 proto = 0;
   /* 检查数据包是否完整 */
   void *data_end = (void*)(long)skb->data_end;
   struct ethhdr *eth = (struct ethhdr*)(void*)(long)skb->data;
   void *trans_data;
   if (eth + 1 > data_end) {
       return TC_ACT_UNSPEC;
   }
   if (eth->h_proto == bpf_htons(ETH_P_IP)) { // ipv4
       struct iphdr *iph = (struct iphdr *)((void*)eth + sizeof(*eth));
       if ((void*)(iph + 1) > data_end) {
          return TC_ACT_SHOT;
       }
       proto = iph->protocol;
       trans_data = (void*)iph + (iph->ihl * 4);
   } else if (eth->h_proto == bpf_htons(ETH_P_IPV6)) { // ipv6
       struct ipv6hdr *ip6h = (struct ipv6hdr *)((void*)eth + sizeof(*eth));
       if ((void*)(ip6h + 1) > data_end) {
          return TC_ACT_SHOT;
       }
       proto = ip6h->nexthdr;
       trans_data = ip6h + 1;
   }
   /* 获取TCP/UDP源/目的端口*/
   if (proto == IPPROTO_TCP)  {
       struct tcphdr *tcph = (struct tcphdr *)trans_data;
       if ((void*)(trans_data + sizeof(*tcph)) > data_end) {
           return TC_ACT_SHOT;
       }
       dst = tcph->dest;
       src = tcph->source;
   } else if (proto == IPPROTO_UDP) {
       struct udphdr *udph = (struct udphdr *)trans_data;
       if ((void*)(trans_data + sizeof(*udph)) > data_end) {
           return TC_ACT_SHOT;
       }
       dst = udph->dest;
       src = udph->source;
   } else {
       goto found_unknown;
   }
   /* 检查源端口或目的端口是否被允许 */
   if (allow_port(src) || allow_port(dst)) {
       rc = rc_allow;
   }
   /* 打印日志 */
   if (skb->ingress_ifindex) {
       bpf_printk("b ingress on -- src %d dst %d",
           bpf_ntohs(src), bpf_ntohs(dst));
   } else {
       bpf_printk("b  egress on -- src %d dst %d",
           bpf_ntohs(src), bpf_ntohs(dst));
   }
   return rc;
found_unknown:
   rc = TC_ACT_UNSPEC;
   return rc;
}
/* 定义许可证 */
char _license[] SEC("license") = "GPL";
```

从源码中你可以看到，这个 eBPF 程序跟我们课程之前的 libbpf 方法完全一致，所以使用libbpf 方法开发的程序都可以直接拿来使用。

第三步，使用 libbpf-cargo 编译 eBPF 程序为字节码并生成脚手架框架。

eBPF 内核态程序开发完成之后，接下来需要将其编译为字节码。我们课程第 8 讲讲到的libbpf 方法是通过一系列的 clang 和 bpftool 命令一起完成的，而 libbpf-cargo 则可以将这些编译步骤都封装到一起，使用起来更为方便。

```
打开终端，确保切换到了 hello-libbpf 根目录中，执行下面的命令安装 libbpf-cargo：
cargo install libbpf-cargo
由于我们代码中引用了 vmlinux.h，所以在编译之前还需要生成这个文件。这儿，我推荐两
```

种方法：

第一种，你可以通过 bpftool 来生成，即运行下面的命令：

```
bpftool btf dump file /sys/kernel/btf/vmlinux format c > src/bpf/vmlinux.h
```

第二种，你可以通过 Cargo 管理依赖，让 Cargo 帮你自动生成。

第一种方法你已经很熟悉了，我们一起看看第二种方法是如何实现的。

继续在终端中执行下面的命令，将 vmlinux 仓库作为构建依赖添加到 Cargo.toml 中：

```javascript
cargo add --build --git https://github.com/libbpf/vmlinux.h
然后创建一个 Cargo 构建文件build.rs ，内容如下：
use std::env;
use std::ffi::OsStr;
use std::path::PathBuf;
use libbpf_cargo::SkeletonBuilder;
const SRC: &str = "src/bpf/tc.bpf.c";
fn main() {
   let out = PathBuf::from(
       env::var_os("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR must be set
   )
   .join("src")
   .join("bpf")
   .join("tc.skel.rs");
   let arch = env::var("CARGO_CFG_TARGET_ARCH")
       .expect("CARGO_CFG_TARGET_ARCH must be set in build script");
   SkeletonBuilder::new()
       .source(SRC)
       .clang_args([
           OsStr::new("-I"),
           vmlinux::include_path_root().join(arch).as_os_str(),
       ])
       .build_and_generate(&out)
       .unwrap();
   println!("cargo:rerun-if-changed={SRC}");
}
build.rs 脚本是 Cargo 的脚本构建文件，用于在编译 Rust 项目之前执行一些自定义的构建
```

任务。对我们 eBPF 开发来说，这其中最关键的有两点：

```
第一，调用 libbpf_cargo 库定义的 SkeletonBuilder 来编译 eBPF 内核态源码并生
```

- 成脚手架框架。

- 第二，指定 clang 编译选项要引用 vmlinux 路径。

```
最后，再执行 cargo build 就可以执行编译了，生成的脚手架框架程序会存入
src/bpf/tc.skel.rs 文件中。
```

- 提示：如果你使用了第一种方法（即手动生成 vmlinux 头文件），可以执行下面的 cargo libbpf 命令来编译并生成脚手架框架（不需要创建 build.rs 脚本）：cargo libbpf buildcargo libbpf gen

到这里，内核态 eBPF 程序的开发以及脚手架框架的生成就完成了，接下来就是最后一步，开发用户态程序。

第四步，开发用户态 eBPF 程序。

在开发用户态程序之前，先执行下面的命令，添加我们程序所需的依赖库：

```
cargo add libbpf-rs anyhow clap nix
```

这其中：

- libbpf-rs 是 libbpf 库的 Rust 封装。

- anyhow 是一个错误处理库，用于错误处理。

- clap 是一个命令行参数解析库，用于创建命令行参数。

- nix 是一个 Unix 系统调用封装库，用于执行系统调用。

```
依赖库准备好之后，打开 src/main.rs，就可以开始用户态程序的开发了，完整源代码如下
```

所示。为了方便你理解，我在关键的位置都加了注释。

```sql
#![allow(clippy::let_unit_value)]
/* 导入依赖库 */
use std::mem::MaybeUninit;
use std::os::unix::io::AsFd as _;
use anyhow::Context as _;
use anyhow::Result;
use clap::Parser;
use libbpf_rs::skel::OpenSkel;
use libbpf_rs::skel::SkelBuilder;
use libbpf_rs::MapCore as _;
use libbpf_rs::MapFlags;
use libbpf_rs::TcHookBuilder;
use libbpf_rs::TC_EGRESS;
use libbpf_rs::TC_INGRESS;
use nix::net::if_::if_nametoindex;
/* 导入脚手架框架 */
mod tc {
   include!(concat!(env!("CARGO_MANIFEST_DIR"), "/src/bpf/tc.skel.rs"));
}
use tc::*;
/* 定义命令行参数 */
#[derive(Debug, Parser)]
struct Command {
   /// list of ports to whitelist
   #[arg(short, long)]
   ports: Vec<u16>,
   /// attach a hook
   #[arg(short, long)]
   attach: bool,
   /// detach existing hook
   #[arg(short, long)]
   detach: bool,
   /// interface to attach to
   #[arg(short = 'i', long = "interface")]
   iface: String,
}
/* 主函数 */
fn main() -> Result<()> {
   let opts = Command::parse();
   /* 变量定义 */
   let builder = TcSkelBuilder::default();
   let mut open_object = MaybeUninit::uninit();
   let open = builder.open(&mut open_object)?;
   let skel = open.load()?;
   let ifidx = if_nametoindex(opts.iface.as_str())? as i32;
   /* TC钩子定义 */
   let mut tc_builder = TcHookBuilder::new(skel.progs.handle_tc.as_fd());
   tc_builder
       .ifindex(ifidx)
       .replace(true)
       .handle(1)
       .priority(1);
   let mut egress = tc_builder.hook(TC_EGRESS);
   let mut ingress = tc_builder.hook(TC_INGRESS);
   /* 卸载TC程序 */
   if opts.detach {
       if let Err(e) = ingress.detach() {
           println!("failed to detach ingress hook {e}");
       }
       if let Err(e) = egress.detach() {
           println!("failed to detach egress hook {e}");
       }
   }
   /* 挂载TC程序 */
   if opts.attach {
       for (i, port) in opts.ports.iter().enumerate() {
           let key = (i as u32).to_ne_bytes();
           let val = port.to_ne_bytes();
           let () = skel
               .maps
               .allow_ports
               .update(&key, &val, MapFlags::ANY)
               .context("Example limited to 10 ports")?;
       }
       if let Err(e) = ingress.attach() {
           println!("failed to attach ingress hook {e}");
       }
       if let Err(e) = egress.attach() {
           println!("failed to attach egress hook {e}");
       }
   }
   Ok(())
}
```

从这段代码中你可以看出，使用 Rust 开发 eBPF 用户态程序的核心逻辑跟我们课程之前讲到的 libbpf 方法完全一致，只是换了一种编程语言和依赖库之后，在代码上（特别是错误处理上）有所不同。

程序开发完成后，执行下面的 Cargo 命令编译：

```
cargo build
```

```
编译完成的二进制代码路径位于 target/debug/hello-libbpf。执行下面的命令，以
```

sudo 运行：

```bash
# 仅允许22、443、53端口（即允许SSH/HTTPS/DNS）
sudo target/debug/hello-libbpf -i eth0 --attach -p 22 -p 443 -p 53
```

然后打开另一个终端，执行 curl 命令做测试，你可以发现只有 SSH/HTTPS/DNS 是通的，而其他协议（比如 HTTP 等）都是不通的：

```bash
# HTTPS 可以正常连接
$ curl -m5 https://baidu.com
<html>
<head><title>302 Found</title></head>
<body bgcolor="white">
<center><h1>302 Found</h1></center>
<hr><center>bfe/1.0.8.18</center>
</body>
</html>
# HTTP 超时
$ curl -m5 http://baidu.com
curl: (28) Connection timed out after 5001 milliseconds
```

恭喜你，你已经借助 libbpf-rs 使用 Rust 语言完整开发了一个 eBPF 程序，并成功运行。

那么，怎么把内核态 eBPF 程序也迁移到 Rust 开发呢？接下来，我再带你一起看看 Aya 的使用方法。

## 如何使用 Aya 开发 eBPF 程序？

Aya 是一个纯 Rust 语言实现的 eBPF 库，在使用之前当然也需要安装这个库以及它的所有依赖。

打开一个新终端，执行下面的命令安装 Aya 库和它的依赖：

```bash
# 安装 libSSL
sudo apt install -y libssl-dev
# 安装 Rust 工具链（Aya需要nightly版本）
rustup toolchain install nightly --component rust-src
# 安装 bpf-linker和cargo-generate
cargo install bpf-linker
cargo install cargo-generate
```

- 提示：Aya 跟 libbpf-rs 一样， 都依赖于 LLVM、bpftool 等开发工具。如果你没有安装，请参考上述 Rust 开发环境搭建的步骤安装。

所有依赖安装完成后，接下来就可以开始创建项目了。使用 Aya 的一个好处是它提供了丰富的模板，所以你不需要从零开始创建 Rust 项目。

执行下面的命令，指定 eBPF 程序类型为 classifier（即 TC 程序），使用 Aya 模板创建项目：

```
cargo generate --name hello-aya -d program_type=classifier -d direction=Egress ht
```

命令执行成功后，会生成一个包含三个模块的项目：

```
hello-aya
├── Cargo.toml
├── README.md
├── hello-aya       # 用户空间程序
│   ├── Cargo.toml
│   ├── build.rs
│   └── src
│       └── main.rs
├── hello-aya-common # 公共库
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── hello-aya-ebpf  # 内核eBPF程序
│   ├── Cargo.toml
│   ├── build.rs
│   └── src
│       ├── lib.rs
│       └── main.rs
└── rustfmt.toml
```

这其中：

```
hello-aya-ebpf 用于 eBPF 程序的内核态源码。
hello-aya 用于 eBPF 程序的用户态源码。
hello-aya-common 则是一个公共库，用于存放共享代码。
```

从这个项目结构上可以看到，Aya 已经帮我们初始化了一个非常清晰的项目结构，只需要我们继续修改内核 eBPF 程序和用户态程序就可以完成我们的开发了。

第一步，开发 eBPF 内核态程序。

先来看内核态 eBPF 程序的开发。执行下面的命令，切换到 hello-aya-ebpf 目录中，并添加我们程序将要用到的网络库：

```bash
cd hello-aya/hello-aya-ebpf
cargo add network_types
接着，打开 src/main.rs，开始内核态 eBPF 程序的开发。你可以先看一遍没有注释的代
```

码，看看能否理解程序的含义，然后继续后面的内容。

```javascript
#![no_std]
#![no_main]
use aya_ebpf::{
   bindings::{TC_ACT_UNSPEC, TC_ACT_SHOT},
   macros::{classifier, map},
   maps::Array,
   programs::TcContext,
};
use aya_log_ebpf::info;
use core::mem;
use network_types::{
   eth::{EthHdr, EtherType},
   ip::{IpProto, Ipv4Hdr, Ipv6Hdr},
   tcp::TcpHdr,
   udp::UdpHdr,
};
#[map]
static ALLOW_PORTS: Array<u32> =
   Array::<u32>::with_max_entries(10, 0);
#[classifier]
pub fn hello_aya(ctx: TcContext) -> i32 {
   match try_hello_aya(ctx) {
       Ok(ret) => ret,
       Err(_) => TC_ACT_UNSPEC,
   }
}
#[inline(always)]
fn ptr_at<T>(ctx: &TcContext, offset: usize) -> Result<*const T, ()> {
   let start = ctx.data();
   let end = ctx.data_end();
   let len = mem::size_of::<T>();
   if start + offset + len > end {
       return Err(());
   }
   Ok((start + offset) as *const T)
}
fn try_hello_aya(ctx: TcContext) -> Result<i32, ()> {
   let mut rc: i32 = TC_ACT_SHOT;
   let mut tcphdr: *const TcpHdr = core::ptr::null();
   let mut udphdr: *const UdpHdr = core::ptr::null();
   let proto: IpProto;
   /* 获取TCP/UDP头 */
   let ethhdr: *const EthHdr = ptr_at(&ctx, 0)?;
   match unsafe { (*ethhdr).ether_type } {
       EtherType::Ipv4 => {
           let ipv4hdr: *const Ipv4Hdr = ptr_at(&ctx, EthHdr::LEN)?;
           proto = unsafe { (*ipv4hdr).proto };
           match proto {
               IpProto::Tcp => {
                   tcphdr = ptr_at(&ctx, EthHdr::LEN + Ipv4Hdr::LEN)?;
               }
               IpProto::Udp => {
                   udphdr = ptr_at(&ctx, EthHdr::LEN + Ipv4Hdr::LEN)?;
               }
               _ => return Ok(TC_ACT_SHOT),
           };
       }
       EtherType::Ipv6 => {
           let ipv6hdr: *const Ipv6Hdr = ptr_at(&ctx, EthHdr::LEN)?;
           proto = unsafe { (*ipv6hdr).next_hdr };
           match proto {
               IpProto::Tcp => {
                   tcphdr = ptr_at(&ctx, EthHdr::LEN + Ipv6Hdr::LEN)?;
               }
               IpProto::Udp => {
                   udphdr = ptr_at(&ctx, EthHdr::LEN + Ipv6Hdr::LEN)?;
               }
               _ => return Ok(TC_ACT_SHOT),
           };
       }
       _ => return Ok(TC_ACT_SHOT),
   }
   let source_port: u16;
   let dest_port: u16;
   match proto {
       IpProto::Tcp => {
           source_port = u16::from_be(unsafe { (*tcphdr).source });
           dest_port = u16::from_be(unsafe { (*tcphdr).dest });
       }
       IpProto::Udp => {
           source_port = u16::from_be(unsafe { (*udphdr).source });
           dest_port = u16::from_be(unsafe { (*udphdr).dest });
       }
       _ => return Ok(TC_ACT_UNSPEC),
   }
   for i in 0..10 {
       let port = ALLOW_PORTS.get(i).unwrap_or(&0);
       if *port == source_port as u32 || *port == dest_port as u32 {
           rc = TC_ACT_UNSPEC;
           break;
       }
   }
   info!(&ctx, "Packet {} -> {}", source_port,  dest_port);
   Ok(rc)
}
#[cfg(not(test))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
   unsafe { core::hint::unreachable_unchecked() }
}
```

怎么样？看懂这段 eBPF 程序的含义了吗？其实，这段代码的功能跟上一节 libbpf-rs 案例中的tc.bpf.c 是一样的，只是换成了使用 Aya 库和 Rust 语言开发。你可以对着下述详细注释再看一看：

```javascript
/* 告诉编译器不使用标准库和main函数 */
#![no_std]
#![no_main]
/* 导入依赖库 */
use aya_ebpf::{
   bindings::{TC_ACT_UNSPEC, TC_ACT_SHOT},
   macros::{classifier, map},
   maps::Array,
   programs::TcContext,
};
use aya_log_ebpf::info;
use core::mem;
use network_types::{
   eth::{EthHdr, EtherType},
   ip::{IpProto, Ipv4Hdr, Ipv6Hdr},
   tcp::TcpHdr,
   udp::UdpHdr,
};
/* 定义BPF映射，用于用户空间配置允许的端口号 */
#[map]
static ALLOW_PORTS: Array<u32> =
   Array::<u32>::with_max_entries(10, 0);
/* TC程序主处理函数 */
#[classifier]
pub fn hello_aya(ctx: TcContext) -> i32 {
   match try_hello_aya(ctx) {
       Ok(ret) => ret,
       Err(_) => TC_ACT_UNSPEC,
   }
}
/* 网络数据头定位辅助函数 */
#[inline(always)]
fn ptr_at<T>(ctx: &TcContext, offset: usize) -> Result<*const T, ()> {
   let start = ctx.data();
   let end = ctx.data_end();
   let len = mem::size_of::<T>();
   if start + offset + len > end {
       return Err(());
   }
   Ok((start + offset) as *const T)
}
/* TC处理函数 */
fn try_hello_aya(ctx: TcContext) -> Result<i32, ()> {
   /* 变量定义 */
   let mut rc: i32 = TC_ACT_SHOT; /* 默认不允许 */
   let mut tcphdr: *const TcpHdr = core::ptr::null();
   let mut udphdr: *const UdpHdr = core::ptr::null();
   let proto: IpProto;
   /* 获取TCP/UDP头（IPv4和IPv6的偏移不一样，因而分别处理） */
   let ethhdr: *const EthHdr = ptr_at(&ctx, 0)?;
   match unsafe { (*ethhdr).ether_type } {
       EtherType::Ipv4 => {
           let ipv4hdr: *const Ipv4Hdr = ptr_at(&ctx, EthHdr::LEN)?;
           proto = unsafe { (*ipv4hdr).proto };
           match proto {
               IpProto::Tcp => {
                   tcphdr = ptr_at(&ctx, EthHdr::LEN + Ipv4Hdr::LEN)?;
               }
               IpProto::Udp => {
                   udphdr = ptr_at(&ctx, EthHdr::LEN + Ipv4Hdr::LEN)?;
               }
               _ => return Ok(TC_ACT_SHOT),
           };
       }
       EtherType::Ipv6 => {
           let ipv6hdr: *const Ipv6Hdr = ptr_at(&ctx, EthHdr::LEN)?;
           proto = unsafe { (*ipv6hdr).next_hdr };
           match proto {
               IpProto::Tcp => {
                   tcphdr = ptr_at(&ctx, EthHdr::LEN + Ipv6Hdr::LEN)?;
               }
               IpProto::Udp => {
                   udphdr = ptr_at(&ctx, EthHdr::LEN + Ipv6Hdr::LEN)?;
               }
               _ => return Ok(TC_ACT_SHOT),
           };
       }
       _ => return Ok(TC_ACT_SHOT),
   }
   /* 获取源端口号和目的端口号 */
   let source_port: u16;
   let dest_port: u16;
   match proto {
       IpProto::Tcp => {
           source_port = u16::from_be(unsafe { (*tcphdr).source });
           dest_port = u16::from_be(unsafe { (*tcphdr).dest });
       }
       IpProto::Udp => {
           source_port = u16::from_be(unsafe { (*udphdr).source });
           dest_port = u16::from_be(unsafe { (*udphdr).dest });
       }
       _ => return Ok(TC_ACT_UNSPEC),
   }
   /* 检查源端口或目的端口是否被允许 */
   for i in 0..10 {
       let port = ALLOW_PORTS.get(i).unwrap_or(&0);
       if *port == source_port as u32 || *port == dest_port as u32 {
           rc = TC_ACT_UNSPEC;
           break;
       }
   }
   /* 打印日志 */
   info!(&ctx, "Packet {} -> {}", source_port,  dest_port);
   Ok(rc)
}
/* Panic处理（实际上用不到，但是Rust编译必须的）*/
#[cfg(not(test))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
   unsafe { core::hint::unreachable_unchecked() }
}
```

从这段代码你可以看出，使用 Aya + Rust 开发 eBPF 内核程序时，其核心逻辑跟使用 libbpf +C 还是一样的，但有几点需要你注意：

- 第一，不能使用 Rust 标准库和 main 函数，需要设置属性告诉编译器。

```
第二，使用 #[map] 和 #[classifier] 方式指定 eBPF 映射和 eBPF 程序的类型（而不
```

- 是使用 SEC）。

- 第三，错误处理和内存管理需遵循 Rust 语法，不要忽略任何编译器警告。

- 第四，虽然 eBPF 程序不允许 Panic，但为了通过 Rust 编译，还是需要定义 Panic 处理函数。

到这里，内核态 eBPF 程序就开发好了。接下来还需要开发用户态程序。

第二步，开发用户态程序。

```
用户空间代码在 hello-aya 子目录中，打开 hello-aya/src/main.rs 就可以开始用户
```

态程序的开发了。Aya 已经为我们生成了基本的程序结构，因而只需要稍作调整，加上我们自己的逻辑即可，比如增加我们需要的命令行选项以及 eBPF 映射的更新等逻辑。

完整的代码如下所示，为了方便你理解，我在关键位置都加了注释：

```javascript
/* 导入依赖库 */
use aya::maps::Array;
use aya::programs::{tc, SchedClassifier, TcAttachType};
use clap::Parser;
#[rustfmt::skip]
use log::{debug, warn};
use tokio::signal;
/* 定义命令行参数 */
#[derive(Debug, Parser)]
struct Command {
   /// list of ports to whitelist
   #[arg(short = 'p', long = "ports", default_value = "22,443,53", value_delimit
   ports: Vec<u16>,
   /// interface to attach to
   #[arg(short = 'i', long = "iface", default_value = "eth0")]
   iface: String,
}
#[tokio::main]
async fn main() -> anyhow::Result<()> {
   /* 命令行参数解析 */
   let opts = Command::parse();
   env_logger::init();
   /* 提高 memlock rlimit */
   let rlim = libc::rlimit {
       rlim_cur: libc::RLIM_INFINITY,
       rlim_max: libc::RLIM_INFINITY,
   };
   let ret: i32 = unsafe { libc::setrlimit(libc::RLIMIT_MEMLOCK, &rlim) };
   if ret != 0 {
       debug!("remove limit on locked memory failed, ret is: {}", ret);
   }
   /* 加载eBPF程序 */
   let mut ebpf = aya::Ebpf::load(aya::include_bytes_aligned!(concat!(
       env!("OUT_DIR"),
       "/hello-aya"
   )))?;
   if let Err(e) = aya_log::EbpfLogger::init(&mut ebpf) {
       /* 这里说明eBPF程序不包含任何日志语句 */
       warn!("failed to initialize eBPF logger: {}", e);
   }
   /* 根据命令行参数更新BPF映射中的端口号 */
   let mut port_map: Array<_, _> = Array::try_from(ebpf.map_mut("ALLOW_PORTS").u
   for (i, port) in opts.ports.iter().enumerate() {
       let key = i as u32;
       let val = *port as u32;
       port_map.set(key, val, 0)?;
   }
   /* 挂载TC程序（程序退出时会自动卸载） */
   let program: &mut SchedClassifier = ebpf.program_mut("hello_aya").unwrap().tr
   program.load()?;
   let _ = tc::qdisc_add_clsact(&opts.iface);
   program.attach(&opts.iface, TcAttachType::Egress)?;
   program.attach(&opts.iface, TcAttachType::Ingress)?;
   let ctrl_c = signal::ctrl_c();
   println!("Waiting for Ctrl-C...");
   ctrl_c.await?;
   println!("Exiting...");
   Ok(())
}
```

从这段代码你可以看出，它的核心逻辑跟上一节 libbpf-rs 是一样的。只是默认情况下，Aya 程序在退出时会自动卸载 eBPF 程序，因而这个案例中没有增加专门的卸载参数和卸载逻辑。

开发完成后，你就可以编译并执行程序了。切换到项目根目录，执行下面的命令：

```bash
# 编译（这会同时编译内核态和用户态代码）
cargo build
# 指定日志级别为info（默认为error）运行程序
sudo RUST_LOG=info ./target/debug/hello-aya
```

当然，你也可以把编译和执行这两步合并到一起，在开发调试时更为便捷：

```
RUST_LOG=info cargo run --config 'target."cfg(all())".runner="sudo -E"'
```

程序运行后，你可以使用上一节 libbpf-rs 的方法来验证它的功能是否正常，这一步留作你的课后作业，你可以动手实践看一看它的效果。

## 小结

今天的课程中，我们共同探讨了如何使用 Rust 语言来开发 eBPF 程序。在实际开发时，通常使用 libbpf-rs 或 Aya 这两个主流框架，它们各有优缺点：

- libbpf-rs 是基于 libbpf 的 Rust 封装，由 libbpf 原团队直接维护，因此稳定性较高。但它无法使用 Rust 来直接编写内核态的 eBPF 程序。

- Aya 则是一套完全基于 Rust 语言构建的 eBPF 开发框架，同时支持内核态和用户态程序的开发，灵活度更高。但相对而言，它的稳定性稍有不足，建议你在使用的时候关注其GitHub 上用户报告的已知问题。

在今天的课程中，我们以一个 TC 程序为示例，分别使用两个框架开发了完整的 eBPF 内核态与用户态程序。从实现逻辑来看，无论是此前课程提到的 libbpf 方法，还是今天所讲解的libbpf-rs 与 Aya 方法，它们在核心逻辑上其实都是相通的，而编程语言与开发框架则是实现这些逻辑的不同工具。

相对于以内存安全问题为诟病的 C 语言，Rust 提供了内存安全、并发安全与高性能等先进特性，使其成为了开发 eBPF 程序的理想选择。伴随 Rust 在 Linux 内核社区内地位的不断提高，我们可以期待 Rust 与 eBPF 的结合在未来必然更加紧密，推动更多出色的应用和创新不断涌现。

## 思考题

在课程结束之前，我想邀请你来聊一聊：

1. 除了 Rust 之外，Go 语言也是开发 eBPF 程序的热门语言之一。你认为，相比于 Go，使用Rust 来开发 eBPF 程序具备哪些独特的优势？同时，你觉得可能存在什么样的不足或局限？

2. Rust 是如何从语言本身的设计层面解决内存安全问题的？为什么传统的 C 语言无法从根本上避免这些问题？（提示：你可以借助搜索引擎或其他参考资料，更详细地了解相关知识）

期待你在留言区和我讨论，也欢迎把这节课分享给你的同事、朋友。让我们一起在实战中演练，在交流中进步。
