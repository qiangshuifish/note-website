# 第2章Rust导览(1)

写这样一本书并不容易：Rust 这门语言如此卓尔不群，我们固然有能力在一开始就展示出其独特的、令人惊叹的特性，但更为重要的是它的各个部分之间能够良好协作，共同服务于我们在第 1 章中设定的目标——安全、高性能的系统编程。该语言的每个部分都与其他部分配合得天衣无缝。

因此，我们并不打算每次讲透一个语言特性，而是准备了一些小而完备的程序作为导览，每个程序都会在其上下文中介绍该语言的更多特性。

- 作为暖场，我们会设计一个简单的程序，它可以解析命令行参数并进行简单计算，而且带有单元测试。这会展示 Rust 的一些核心类型并引入特型的概念。

- 接下来，我们一起构建一个 Web 服务器。我们将使用第三方库来处理 HTTP 的细节，并介绍字符串处理、闭包和错误处理功能。

- 第三个程序会绘制一张美丽的分形图，将计算工作分派到多个线程以提高效率。这包括一个泛型函数的示例，以说明该如何处理像素缓冲区之类的问题，并展示 Rust 对并发的支持。

- 最后，我们会展示一个强大的命令行工具，它利用正则表达式来处理文件。这展示了 Rust标准库的文件处理功能，以及最常用的第三方正则表达式库。

Rust 承诺会在对性能影响最小的情况下防止未定义行为，这在潜移默化中引导着每个部分的设计——从标准数据结构（如向量和字符串）到使用第三方库的方式。关于如何做好这些的细节会贯穿全书。但就目前而言，我们只想向你证明 Rust 是一门功能强大且易于使用的语言。

当然，你要先在计算机上安装 Rust。

## 2.1　rustup 与 Cargo

```
安装 Rust 的最佳方式是使用 rustup。请转到 rustup.rs 网站并按照那里的说明进行操作。
```

还可以到 Rust 网站获取针对 Linux、macOS 和 Windows 的预构建包。Rust 也已经包含在某

```
些操作系统的发行版中。建议使用 rustup，因为它是专门管理 Rust 安装的工具，就像
```

Ruby 中的 RVM 或 Node 中的 NVM。例如，当 Rust 发布新版本时，你就可以通过键入

```sql
rustup update 来实现一键升级。
```

无论采用哪种方式，完成安装之后，你的命令行中都会有 3 条新命令：

```
$ cargo --version
cargo 1.49.0 (d00d64df9 2020-12-05)
$ rustc --version
rustc 1.49.0 (e1884a8e3 2020-12-29)
$ rustdoc --version
rustdoc 1.49.0 (e1884a8e3 2020-12-29)
在这里，$ 是命令提示符，在 Windows 上，则会是 C:\> 之类的文本。在刚才的记录中，我
```

们运行了 3 条已安装的命令，并要求每条命令报告其版本号。下面来逐个看看每条命令。

```
cargo 是 Rust 的编译管理器、包管理器和通用工具。可以用 Cargo 启动新项目、构建和
```

- 运行程序，并管理代码所依赖的任何外部库。

```
rustc 是 Rust 编译器。通常 Cargo 会替我们调用此编译器，但有时也需要直接运行它。
rustdoc 是 Rust 文档工具。如果你在程序源代码中以适当形式的注释编写文档，那么
rustdoc 就可以从中构建出格式良好的 HTML。与 rustc 一样，通常 Cargo 会替我们运
行 rustdoc。
```

为便于使用，Cargo 可以为我们创建一个新的 Rust 包，并适当准备一些标准化的元数据：

```
$ cargo new hello
    Created binary (application) `hello` package
```

该命令会创建一个名为 hello 的新包目录，用于构建命令行可执行文件。

查看包的顶层目录：

```
$ cd hello
$ ls -la
total 24
drwxrwxr-x.  4 jimb jimb 4096 Sep 22 21:09 .
drwx------. 62 jimb jimb 4096 Sep 22 21:09 ..
drwxrwxr-x.  6 jimb jimb 4096 Sep 22 21:09 .git
-rw-rw-r--.  1 jimb jimb    7 Sep 22 21:09 .gitignore
-rw-rw-r--.  1 jimb jimb   88 Sep 22 21:09 Cargo.toml
drwxrwxr-x.  2 jimb jimb 4096 Sep 22 21:09 src
```

我们看到 Cargo 已经创建了一个名为 Cargo.toml 的文件来保存此包的元数据。目前这个文件还没有多少内容：

```
[package]
name = "hello"
version = "0.1.0"
edition = "2021"
# 请到“The Cargo Book”查看更多的键及其定义
[dependencies]
```

如果程序依赖于其他库，那么可以把它们记录在这个文件中，Cargo 将为我们下载、构建和更新这些库。第 8 章会详细介绍 Cargo.toml 文件。

```
Cargo 已将我们的包设置为与版本控制系统 git 一起使用，并为此创建了一个元数据子目录
.git 和一个 .gitignore 文件。可以通过在命令行中将 --vcs none 传给 cargo new 来要求
```

Cargo 跳过此步骤。

src 子目录包含实际的 Rust 代码：

```
$ cd src
$ ls -l
total 4
-rw-rw-r--. 1 jimb jimb 45 Sep 22 21:09 main.rs
```

Cargo 似乎已经替我们写好一部分程序了。main.rs 文件包含以下文本：

```
fn main() {
   println!("Hello, world!");
}
```

在 Rust 中，你甚至不需要编写自己的“Hello, World!”程序。这是 Rust 新程序样板的职责，该程序样板包括两个文件，总共 13 行代码。

```
可以在包内的任意目录下调用 cargo run 命令来构建和运行程序：
$ cargo run
  Compiling hello v0.1.0 (/home/jimb/rust/hello)
   Finished dev [unoptimized + debuginfo] target(s) in 0.28s
    Running `/home/jimb/rust/hello/target/debug/hello`
Hello, world!
这里 Cargo 先调用 Rust 编译器 rustc，然后运行了它生成的可执行文件。Cargo 将可执行
```

文件放在此包顶层的 target 子目录中：

```
$ ls -l ../target/debug
total 580
drwxrwxr-x. 2 jimb jimb   4096 Sep 22 21:37 build
drwxrwxr-x. 2 jimb jimb   4096 Sep 22 21:37 deps
drwxrwxr-x. 2 jimb jimb   4096 Sep 22 21:37 examples
-rwxrwxr-x. 1 jimb jimb 576632 Sep 22 21:37 hello
-rw-rw-r--. 1 jimb jimb    198 Sep 22 21:37 hello.d
drwxrwxr-x. 2 jimb jimb     68 Sep 22 21:37 incremental
$ ../target/debug/hello
Hello, world!
```

完工之后，Cargo 还可以帮我们清理生成的文件。

```
$ cargo clean
$ ../target/debug/hello
bash: ../target/debug/hello: No such file or directory
```

## 2.2　Rust 函数

Rust 在语法设计上刻意减少了原创性。如果你熟悉 C、C++、Java 或 JavaScript，那么就能通过 Rust 程序的一般性构造找到自己的快速学习之道。这是一个使用欧几里得算法计算两个整数的最大公约数的函数。可以将这些代码添加到 src/main.rs 的末尾：

```javascript
fn gcd(mut n: u64, mut m: u64) -> u64 {
   assert!(n != 0 && m != 0);
   while m != 0 {
       if m < n {
           let t = m;
           m = n;
           n = t;
       }
       m = m % n;
   }
   n
}
```

```
fn（发音为 /fʌn/）关键字引入了一个函数。这里我们定义了一个名为 gcd 的函数，它有两个
参数（n 和 m），每个参数都是 u64 类型，即一个无符号的 64 位整数。-> 标记后面紧跟着
返回类型，表示此函数返回一个 u64 值。4 空格缩进是 Rust 的标准风格。
Rust 的“机器整数类型名”揭示了它们的大小和符号：i32 是一个带符号的 32 位整数，u8 是
一个无符号的 8 位整数（“字节”值），以此类推。isize 类型和 usize 类型保存着恰好等于
```

“指针大小”的有符号整数和无符号整数，在 32 位平台上是 32 位长，在 64 位平台上则是 64

```
位长。Rust 还有 f32 和 f64 这两种浮点类型，它们分别是 IEEE 单精度浮点类型和 IEEE 双
精度浮点类型，就像 C 和 C++ 中的 float 和 double。
默认情况下，一经初始化，变量的值就不能再改变了，但是在参数 n 和 m 之前放置 mut（发
```

音为 /mjuːt/，是 mutable 的缩写）关键字将会准许我们在函数体中赋值给它们。实际上，大多

```
数变量是不需要被赋值的，而对于那些确实需要被赋值的变量，mut 关键字相当于用一个醒
```

目的提示来帮我们阅读代码。

```
函数的主体始于一次 assert! 宏调用，以验证这两个参数都不为 0。这里的 ! 字符标明此句
为宏调用，而不是函数调用。就像 C 和 C++ 中的 assert 宏一样，Rust 的 assert! 会检
```

查其参数是否为真，如果非真，则终止本程序并提供一条有帮助的信息，其中包括导致本次检查失败的源代码位置。这种突然的终止在 Rust 中称为 panic。与可以跳过断言的 C 和 C++ 不

```
同，Rust 总是会检查这些断言，而不管程序是如何编译的。还有一个 debug_assert! 宏，
```

在编译发布版程序时会跳过其断言以提高速度。

```
这个函数的核心是一个包含 if 语句和赋值语句的 while 循环。与 C 和 C++ 不同，Rust 不
```

需要在条件表达式周围使用圆括号，但必须在受其控制的语句周围使用花括号。

```javascript
let 语句会声明一个局部变量，比如本函数中的 t。只要 Rust 能从变量的使用方式中推断出
t 的类型，就不需要标注其类型。在此函数中，通过匹配 m 和 n，可以推断出唯一适用于 t
的类型是 u64。Rust 只会推断函数体内部的类型，因此必须像之前那样写出函数参数的类型
和返回值的类型。如果想明确写出 t 的类型，那么可以这样写：
```

```javascript
let t: u64 = m;
Rust 有 return 语句，但这里的 gcd 函数并不需要。如果一个函数体以没有尾随着分号的表
```

达式结尾，那么这个表达式就是函数的返回值。事实上，花括号包起来的任意代码块都可以用

```
作表达式。例如，下面是一个打印了一条信息然后以 x.cos() 作为其值的表达式：
{
   println!("evaluating cos x");
   x.cos()
}
```

在 Rust 中，当控制流“正常离开函数的末尾”时，通常会以上述形式创建函数的返回值，

```
return 语句只会用在从函数中间显式地提前返回的场景中。
```

## 2.3　编写与运行单元测试

```
Rust 语言内置了对测试的简单支持。为了测试 gcd 函数，可以在 src/main.rs 的末尾添加下
```

面这段代码：

```
#[test]
fn test_gcd() {
   assert_eq!(gcd(14, 15), 1);
   assert_eq!(gcd(2 * 3 * 5 * 11 * 17,
                  3 * 7 * 11 * 13 * 19),
              3 * 11);
}
这里我们定义了一个名为 test_gcd 的函数，该函数会调用 gcd 并检查它是否返回了正确的
值。此定义顶部的 #[test] 将 test_gcd 标记为“测试函数”，在正常编译时会跳过它，但如
果用 cargo test 命令运行我们的程序，则会自动包含并调用它。可以让测试函数分散在源
代码树中，紧挨着它们所测试的代码，cargo test 会自动收集并运行它们。
#[test] 标记是属性（attribute）的示例之一。属性是一个开放式体系，可以用附加信息给
```

函数和其他声明做标记，就像 C++ 和 C# 中的属性或 Java 中的注解（annotation）一样。属

```
性可用于控制编译器警告和代码风格检查、有条件地包含代码（就像 C 和 C++ 中的 #ifdef
```

一样）、告诉 Rust 如何与其他语言编写的代码互动，等等。后面还会介绍更多的属性示例。

```
将 gcd 和 test_gcd 的定义添加到本章开头创建的 hello 包中，如果当前目录位于此包子树
```

中的任意位置，可以用如下方式运行测试。

```
$ cargo test
  Compiling hello v0.1.0 (/home/jimb/rust/hello)
   Finished test [unoptimized + debuginfo] target(s) in 0.35s
    Running unittests (/home/jimb/rust/hello/target/debug/deps/hello-2375...)
running 1 test
test test_gcd ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```
