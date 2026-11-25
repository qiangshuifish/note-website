import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"03 | 正式开工：如何组织、编译、打包复杂的Rust项目？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Rust 的 bin、lib 和 mod","slug":"rust-的-bin、lib-和-mod","link":"#rust-的-bin、lib-和-mod","children":[]},{"level":2,"title":"如何组织代码结构","slug":"如何组织代码结构","link":"#如何组织代码结构","children":[]},{"level":2,"title":"通过 Cargo build 编译打包","slug":"通过-cargo-build-编译打包","link":"#通过-cargo-build-编译打包","children":[]},{"level":2,"title":"通过 make 和 makefile 来编译打包","slug":"通过-make-和-makefile-来编译打包","link":"#通过-make-和-makefile-来编译打包","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Rust实战·手写下一代云原生消息队列/03｜正式开工：如何组织、编译、打包复杂的Rust项目？.md","filePath":"Rust实战·手写下一代云原生消息队列/03｜正式开工：如何组织、编译、打包复杂的Rust项目？.md","lastUpdated":1795533810000}'),e={name:"Rust实战·手写下一代云原生消息队列/03｜正式开工：如何组织、编译、打包复杂的Rust项目？.md"};function l(t,s,c,r,h,o){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_03-正式开工-如何组织、编译、打包复杂的rust项目" tabindex="-1">03 | 正式开工：如何组织、编译、打包复杂的Rust项目？ <a class="header-anchor" href="#_03-正式开工-如何组织、编译、打包复杂的rust项目" aria-label="Permalink to &quot;03 | 正式开工：如何组织、编译、打包复杂的Rust项目？&quot;">​</a></h1><ul><li>本课程为精品小课，不标配音频</li></ul><p>你好，我是文强。</p><p>这节课开始，我们就正式来写消息队列架构中的元数据集群部分。首先我们需要初始化一个项目，接下来我会详细讲解如何组织项目结构，以及如何编译打包 Rust 项目。</p><h2 id="rust-的-bin、lib-和-mod" tabindex="-1">Rust 的 bin、lib 和 mod <a class="header-anchor" href="#rust-的-bin、lib-和-mod" aria-label="Permalink to &quot;Rust 的 bin、lib 和 mod&quot;">​</a></h2><p>在初始化项目之前，我们先来学习 3 个基础概念，cargo 中的 bin、lib、mod。</p><p>在 Rust 中，项目代码是通过 bin、lib、mod 这三种形式来组织的，先介绍下它们的功能。</p><ol><li>bin</li></ol><p>用来存放主入口 main 函数的目录。如下所示，它是通过 cargo.toml 中的 [[bin]] 语法指定的。name 表示编译生成的二进制文件的名称，path 表示主入口 main 函数所在的文件。当然，你可以在 cargo 文件中指定多个 [[bin]] ，生成多个目标二进制文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[[bin]]</span></span>
<span class="line"><span>name = &quot;placement-center&quot;</span></span>
<span class="line"><span>path = &quot;src/placement-center/server.rs&quot;</span></span>
<span class="line"><span>[[bin]]</span></span>
<span class="line"><span>name = &quot;placement-center1&quot;</span></span>
<span class="line"><span>path = &quot;src/placement-center/server1.rs&quot;</span></span></code></pre></div><ol start="2"><li>lib</li></ol><p>这是 Library 的简写，表示功能库的集合。比如我们有一批通用的功能，就可以通过 lib 来组织，封装成一个独立的 lib，给其他项目调用。在 <a href="https://crates.io/" target="_blank" rel="noreferrer">https://crates.io/</a> 上的各种基础功能库都是lib 的形式。从功能来看，Rust 中 lib 的概念相当于 Java Maven 中的 module。</p><p>lib 的特征是在 src 的目录下必须有一个 lib.rs 文件。比如我们在 common 目录下定义一个base 的 Library，则它的结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── common</span></span>
<span class="line"><span>│   └── base</span></span>
<span class="line"><span>│       ├── Cargo.toml</span></span>
<span class="line"><span>│       ├── src</span></span>
<span class="line"><span>│       │   └── lib.rs</span></span>
<span class="line"><span>│       └── tests</span></span>
<span class="line"><span>│           └── test.rs</span></span></code></pre></div><ol start="3"><li>mod</li></ol><p>这是 Module 的缩写，从功能上来看，它相当于 Java 中的 package，它用来在 lib 中组织独立的代码功能。所以可以简单理解，mod 是包含在 lib 中的。比如我们在 common 中定义一个config 的 mod，此时目录结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── common</span></span>
<span class="line"><span>│   └── base</span></span>
<span class="line"><span>│       ├── Cargo.toml</span></span>
<span class="line"><span>│       ├── src</span></span>
<span class="line"><span>│       │   ├── config</span></span>
<span class="line"><span>│       │   │   └──  mod.rs</span></span>
<span class="line"><span>│       │   └── lib.rs</span></span>
<span class="line"><span>│       └── tests</span></span>
<span class="line"><span>│           └── test.rs</span></span></code></pre></div><p>一般情况下，从功能上来看：一个 lib 会包含多个 mod，一个 bin 需要调用多个 lib。</p><p>接下来我们来看一下如何组织我们的代码结构。</p><h2 id="如何组织代码结构" tabindex="-1">如何组织代码结构 <a class="header-anchor" href="#如何组织代码结构" aria-label="Permalink to &quot;如何组织代码结构&quot;">​</a></h2><p>如果你对我之前推荐的资料看得比较仔细，可能会关注到有这一章节《标准的 Package 目录结构》。这里推荐了一个项目目录结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── Cargo.lock</span></span>
<span class="line"><span>├── Cargo.toml</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── lib.rs</span></span>
<span class="line"><span>│   ├── main.rs</span></span>
<span class="line"><span>│   └── bin/</span></span>
<span class="line"><span>│       ├── named-executable.rs</span></span>
<span class="line"><span>│       ├── another-executable.rs</span></span>
<span class="line"><span>│       └── multi-file-executable/</span></span>
<span class="line"><span>│           ├── main.rs</span></span>
<span class="line"><span>│           └── some_module.rs</span></span>
<span class="line"><span>├── benches/</span></span>
<span class="line"><span>│   ├── large-input.rs</span></span>
<span class="line"><span>│   └── multi-file-bench/</span></span>
<span class="line"><span>│       ├── main.rs</span></span>
<span class="line"><span>│       └── bench_module.rs</span></span>
<span class="line"><span>├── examples/</span></span>
<span class="line"><span>│   ├── simple.rs</span></span>
<span class="line"><span>│   └── multi-file-example/</span></span>
<span class="line"><span>│       ├── main.rs</span></span>
<span class="line"><span>│       └── ex_module.rs</span></span>
<span class="line"><span>└── tests/</span></span>
<span class="line"><span>   ├── some-integration-tests.rs</span></span>
<span class="line"><span>   └── multi-file-test/</span></span>
<span class="line"><span>       ├── main.rs</span></span>
<span class="line"><span>       └── test_module.rs</span></span></code></pre></div><p>从编码的角度来看，推荐的这个项目结构适合单体项目，比如微服务架构中某个服务的项目结构，它不适合复杂的项目。这是因为，在这个项目结构中，只有一个 lib 和 bin，当项目中需要多个 lib 和多个 bin 的时候，这个目录结构就不够用了。而大部分项目，都是需要多个 lib和多个 bin 的。</p><p>在 cargo 的定义中，在业务逻辑比较复杂的项目中，一般需要通过 workspace 来组织多个lib 和 bin。</p><p>那项目结构应该是什么样子呢？我们来看一下项目初始化后的目录结构，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── Cargo.toml # Cargo 的定义文件</span></span>
<span class="line"><span>├── LICENSE # 项目 的LICENSE 文件，比如Apache2.0</span></span>
<span class="line"><span>├── README.md # 项目说明 README文件</span></span>
<span class="line"><span>├── benches # 压测代码所在目录</span></span>
<span class="line"><span>├── bin # 项目启动命令存放的目录</span></span>
<span class="line"><span>├── build.rs # cargo中的构建脚本 build.rs。可参考这个文档:https://course.rs/cargo/refe</span></span>
<span class="line"><span>├── config # 存放配置文件的目录</span></span>
<span class="line"><span>├── docs # 存放技术文档的目录</span></span>
<span class="line"><span>├── example # 存放项目调用 Demo 的项目</span></span>
<span class="line"><span>├── makefile # 用于编译打包项目的makefile文件</span></span>
<span class="line"><span>├── src  # 源代码目录</span></span>
<span class="line"><span>│   ├── cmd</span></span>
<span class="line"><span>│   │   ├── Cargo.toml</span></span>
<span class="line"><span>│   │   ├── src</span></span>
<span class="line"><span>│   │   │   └── placement-center</span></span>
<span class="line"><span>│   │   │       └── server.rs</span></span>
<span class="line"><span>│   │   └── tests</span></span>
<span class="line"><span>│   │       └── test.rs</span></span>
<span class="line"><span>│   ├── placement-center</span></span>
<span class="line"><span>│   │   ├── Cargo.toml</span></span>
<span class="line"><span>│   │   ├── src</span></span>
<span class="line"><span>│   │   │   └── lib.rs</span></span>
<span class="line"><span>│   │   └── tests</span></span>
<span class="line"><span>│   │       └── test.rs</span></span>
<span class="line"><span>│   └── protocol</span></span>
<span class="line"><span>│       ├── Cargo.toml</span></span>
<span class="line"><span>│       ├── src</span></span>
<span class="line"><span>│       │   └── lib.rs</span></span>
<span class="line"><span>│       └── tests</span></span>
<span class="line"><span>│           └── test.rs</span></span>
<span class="line"><span>├── tests # 存放测试用例代码的文件</span></span>
<span class="line"><span>└── version.ini  # 记录版本信息的文件</span></span></code></pre></div><p>各个文件和目录的说明已经有标注，就不再赘述了。我们重点来看 src 目录的组织结构。这个目录结构得配合根目录的 cargo.toml 和子目录的 cargo 文件来解释，下面分别是根目录和子目录的 cargo 文件。</p><ul><li>根目录 cargo.toml</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[workspace]</span></span>
<span class="line"><span>members = [</span></span>
<span class="line"><span>   &quot;src/common/base&quot;,</span></span>
<span class="line"><span>   &quot;src/placement-center&quot;,</span></span>
<span class="line"><span>   &quot;src/cmd&quot;,</span></span>
<span class="line"><span>   &quot;src/protocol&quot;,</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>resolver = &quot;2&quot;</span></span>
<span class="line"><span>[workspace.package]</span></span>
<span class="line"><span>version = &quot;0.0.1&quot;</span></span>
<span class="line"><span>edition = &quot;2021&quot;</span></span>
<span class="line"><span>license = &quot;Apache-2.0&quot;</span></span>
<span class="line"><span>[workspace.dependencies]</span></span>
<span class="line"><span>serde = { version = &quot;1.0&quot;, features = [&quot;derive&quot;] }</span></span>
<span class="line"><span>serde_json = &quot;1.0&quot;</span></span>
<span class="line"><span>## workspaces members</span></span>
<span class="line"><span>placement-center = { path = &quot;src/placement-center&quot; }</span></span>
<span class="line"><span>cmd = { path = &quot;src/cmd&quot; }</span></span>
<span class="line"><span>protocol = { path = &quot;src/protocol&quot; }</span></span>
<span class="line"><span>common-base = { path = &quot;src/common/base&quot; }</span></span></code></pre></div><ul><li>子目录 cargo.toml</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[package]</span></span>
<span class="line"><span>name = &quot;cmd&quot;</span></span>
<span class="line"><span>version.workspace = true</span></span>
<span class="line"><span>edition.workspace = true</span></span>
<span class="line"><span>license.workspace = true</span></span>
<span class="line"><span>[dependencies]</span></span>
<span class="line"><span>[[bin]]</span></span>
<span class="line"><span>name = &quot;placement-center&quot;</span></span>
<span class="line"><span>path = &quot;src/placement-center/server.rs&quot;</span></span></code></pre></div><p>这个项目结构的核心是：在项目的根目录通过 workspace 来组织管理 cmd、protocol、placement-center、common-base 等 4 个子项目。从定义上看，protocol、placement-center、common-base 是 lib 类型，分别完成相关业务逻辑，cmd 是 bin 类型。也就是说主入口 main 函数是写在 cmd/src/placement-center/server.rs 中的。</p><p>当然，在 cmd 中可以支持多个主入口 main 函数，来支持启动多个不同类型的服务。比如在最开始的架构图中有一个 Broker Server，我们就可以在 cmd 中的 toml 加一个 bin，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[package]</span></span>
<span class="line"><span>name = &quot;cmd&quot;</span></span>
<span class="line"><span>version.workspace = true</span></span>
<span class="line"><span>edition.workspace = true</span></span>
<span class="line"><span>license.workspace = true</span></span>
<span class="line"><span>[dependencies]</span></span>
<span class="line"><span>[[bin]]</span></span>
<span class="line"><span>name = &quot;placement-center&quot;</span></span>
<span class="line"><span>path = &quot;src/placement-center/server.rs&quot;</span></span>
<span class="line"><span>[[bin]]</span></span>
<span class="line"><span>name = &quot;mqtt-broker&quot;</span></span>
<span class="line"><span>path = &quot;src/mqtt-broker/server.rs&quot;</span></span></code></pre></div><p>从实践的角度看，对于大多数项目，这个项目结构基本是通用的，可以直接复制。接下来，我们来看一下如何打包项目。</p><h2 id="通过-cargo-build-编译打包" tabindex="-1">通过 Cargo build 编译打包 <a class="header-anchor" href="#通过-cargo-build-编译打包" aria-label="Permalink to &quot;通过 Cargo build 编译打包&quot;">​</a></h2><p>在 Rust 中，打包项目是一件很简单的事情，就是在项目根目录直接执行 cargo build 即可。基于上面的 cargo 文件，执行完会在 target/debug 目录下生成一个 placement-center 文件，效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Rust%E5%AE%9E%E6%88%98%C2%B7%E6%89%8B%E5%86%99%E4%B8%8B%E4%B8%80%E4%BB%A3%E4%BA%91%E5%8E%9F%E7%94%9F%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97/images/03/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Rust%E5%AE%9E%E6%88%98%C2%B7%E6%89%8B%E5%86%99%E4%B8%8B%E4%B8%80%E4%BB%A3%E4%BA%91%E5%8E%9F%E7%94%9F%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97/images/03/1.png" alt=""></a></p><p>此时，你可以执行 ./placement-center 命令，它会调用 cmd/src/placement-center/server.rs 中的主入口 main 函数，从而启动服务。如下图所示，会输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Get Started</span></span></code></pre></div><p>因为我们在 cmd/src/placement-center/server.rs 中的内容是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fn main() {</span></span>
<span class="line"><span>   println!(&quot;Get Started&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有一点需要注意的是：你必须先了解 Cargo 中 Profile 的含义。</p><p>Profile 是 Cargo 的一个功能，详细内容你可以参考这个文档《发布配置 Profile》。Profile 默认包含 dev、 release、 test 和 bench 4 种配置项。正常情况下，我们无需去指定，Cargo 会根据我们使用的命令来自动进行选择。例如：</p><ol><li><p>cargo build 自动选择 dev profile</p></li><li><p>cargo test 则是 test profile</p></li><li><p>cargo build --release 自动选择 release profile</p></li><li><p>cargo bench 则是 bench profile</p></li></ol><p>从运行的角度，编译器会根据这 4 种不同的配置提供不同的优化机制，比如优化编译速度、优化运行速度等等。例如在开发时，我们需要更快的构建速度来验证代码。此时，我们可以牺牲运行性能来换取编译性能，所以应该选择 dev 模式。而在线上环境，我们希望代码运行得更快，可以接受编译速度降低，则需要选择 release 模式。</p><p>因为默认情况下是 dev 模式，所以我们在开发测试时，编译时可以直接使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cargo build</span></span></code></pre></div><p>而发布线上包，则需要使用:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cargo build -- release</span></span></code></pre></div><p>编译生成可执行的二进制文件后，不清楚你会不会有疑问。我们平时下载的开源软件包，一般是 .tar.gz 的形式，而且下载解压完成后的目录结构一般是下面这种形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.</span></span>
<span class="line"><span>├── bin</span></span>
<span class="line"><span>├── config</span></span>
<span class="line"><span>└── libs</span></span></code></pre></div><p>在这种结构中，bin 目录一般放启动脚本，config 目录一般放配置文件，libs 一般放一些依赖的可执行文件。启动时通过 bin 中的启动脚本来启动服务。</p><p>那能通过 Cargo 打出这种形式的 tar.gz 的包吗？ 答案是不行的。那应该怎样打出这种包呢？</p><p>从实践来看，如果要实现类似的效果，一般需要依赖 make 和 makefile 来完成打包。</p><h2 id="通过-make-和-makefile-来编译打包" tabindex="-1">通过 make 和 makefile 来编译打包 <a class="header-anchor" href="#通过-make-和-makefile-来编译打包" aria-label="Permalink to &quot;通过 make 和 makefile 来编译打包&quot;">​</a></h2><p>可以说，是否掌握 make 和 makefile，某种程度上意味着你是否掌握了构建大型项目的能力。所以建议你要去了解一下 make 命令和 makefile 的语法。这块语法，网上教程很多，你直接搜一下即可，我就不推荐了。</p><p>从功能上看，make 是一个编译命令，makefile 是 make 命令的语法文件。当执行 make 命令的时候，会默认在当前目录下寻找名称为 makefile 的文件，解析文件内容，并执行完成编译。</p><p>接下来，来看我们项目的 makefile 文件，通过这个文件看一下应该如何写 makefile。</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TARGET </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> robustmq</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">geek</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BUILD_FOLD </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">build</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">VERSION</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$(shell cat version.ini)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PACKAGE_FOLD_NAME </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${TARGET}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$(VERSION)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">release:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 创建对应目录</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   mkdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p \${BUILD_FOLD}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   mkdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p $(BUILD_FOLD)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\${PACKAGE_FOLD_NAME}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   mkdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p $(BUILD_FOLD)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\${PACKAGE_FOLD_NAME}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bin</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   mkdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p $(BUILD_FOLD)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\${PACKAGE_FOLD_NAME}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">libs</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   mkdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p $(BUILD_FOLD)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\${PACKAGE_FOLD_NAME}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">config</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 编译 release 包</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   cargo build </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">release</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 拷贝 bin目录下的脚本、config中的配置文件、编译成功的可执行文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   cp </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rf target</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">release</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">placement</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">center $(BUILD_FOLD)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\${PACKAGE_FOLD_NAME}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lib</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   cp </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rf bin</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* $(BUILD_FOLD)/\${PACKAGE_FOLD_NAME}/bin</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   cp -rf config/* $(BUILD_FOLD)/\${PACKAGE_FOLD_NAME}/config</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   chmod -R 777 $(BUILD_FOLD)/\${PACKAGE_FOLD_NAME}/bin/*</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # 将目录打包成.tar.gz 文件</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   cd $(BUILD_FOLD) &amp;&amp; tar zcvf \${PACKAGE_FOLD_NAME}.tar.gz \${PACKAGE_FOLD_NAME}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   echo &quot;build release package success. \${PACKAGE_FOLD_NAME}.tar.gz &quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">test:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   sh ./scripts/integration-testing.sh</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">clean:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   cargo clean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   rm -rf build</span></span></code></pre></div><p>在上面的 makefile 中，我们定义了 release、test、clean 等 3 个 target，即我们的 make 支持下面三个命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>make release # 编译项目并打包成名称为robustmq-geek-{***}-beta.tar.gz的安装包</span></span>
<span class="line"><span>make test # 通过脚本./scripts/integration-testing.sh 运行测试用例，</span></span>
<span class="line"><span>make clean # 清理编译文件</span></span></code></pre></div><p>接下来我们用 release target 来讲一下 makefile 的语法。</p><ol><li><p>首先，定义了 TARGET、BUILD_FOLD、VERSION、PACKAGE_FOLD_NAME 4 个变量，分别表示项目的名称、构建完成后的包的存放目录、包的版本、项目名称 + 版本号组成的安装包的名称。</p></li><li><p>release target 里面是一段 shell 代码，拆解开来主要有下面四部分逻辑：</p></li></ol><ul><li><p>1.创建对应目录</p></li><li><p>编译 release 包2.</p></li><li><p>拷贝 bin 目录下的脚本、config 中的配置文件、编译成功的可执行文件3.</p></li><li><p>将目录打包成 .tar.gz 文件4.</p></li></ul><p>当我们写完 makefile 后，接下来就可以执行 make release 命令打包即可，打包过程如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Rust%E5%AE%9E%E6%88%98%C2%B7%E6%89%8B%E5%86%99%E4%B8%8B%E4%B8%80%E4%BB%A3%E4%BA%91%E5%8E%9F%E7%94%9F%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97/images/03/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Rust%E5%AE%9E%E6%88%98%C2%B7%E6%89%8B%E5%86%99%E4%B8%8B%E4%B8%80%E4%BB%A3%E4%BA%91%E5%8E%9F%E7%94%9F%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97/images/03/2.png" alt=""></a></p><p>打包完成后，会在 build 目录下生成一个 robustmq-geek-0.0.1-beta.tar.gz 安装包，解压后效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Rust%E5%AE%9E%E6%88%98%C2%B7%E6%89%8B%E5%86%99%E4%B8%8B%E4%B8%80%E4%BB%A3%E4%BA%91%E5%8E%9F%E7%94%9F%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97/images/03/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Rust%E5%AE%9E%E6%88%98%C2%B7%E6%89%8B%E5%86%99%E4%B8%8B%E4%B8%80%E4%BB%A3%E4%BA%91%E5%8E%9F%E7%94%9F%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97/images/03/3.png" alt=""></a></p><p>到这里，我们就完成了项目的初始化、编译、打包的整个流程了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li>tips：从本节课开始，每节课的代码都能在项目 <a href="https://github.com/robustmq/robustmq-geek" target="_blank" rel="noreferrer">https://github.com/robustmq/robustmq-geek</a> 中找到源码，有兴趣的同学可以下载源码来看。</li></ul><p>这节课的核心，我们完成了如何组织项目结构和如何编译打包项目两个工作。如果你要初始化一个项目，你直接按照这节课的思路去组织项目就可以了。</p><p>在组织复杂的 Rust 项目时，workspace 是需要重点关注的一个功能。另外在项目组织这块，你需要多去了解 Cargo 的各种语法。在 Cargo 中提供了很多好用的命令，比如 cargo bench可以帮你压测代码的性能，cargo test 可以运行测试用例等等。</p><p>值得一提的是，Rust 在语言基础设施这块做得非常好，所以，当你熟悉了它的各种语法后，实际的工作量是很低的。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>从这节课开始，我们的思考题换个方式。</p><p>我会在 <a href="https://github.com/robustmq/robustmq" target="_blank" rel="noreferrer">https://github.com/robustmq/robustmq</a> 项目中发布一些 good first issue 的任务，让你来完成，目的是让你有真正动手的机会，你可以选择自己感兴趣的任务来执行。当然如果你基础更好，也可以完成一些复杂的任务。当你完成自己认领的任务后，在评论区回复即可，我会找时间 check 一下大家的完成情况。</p><p>这里是本节课推荐的相关 issue 的任务列表，请点击查看《Good First Issue》。 欢迎给我的项目 <a href="https://github.com/robustmq/robustmq" target="_blank" rel="noreferrer">https://github.com/robustmq/robustmq</a> 点个 Star 啊！</p>`,79)])])}const E=a(e,[["render",l]]);export{d as __pageData,E as default};
