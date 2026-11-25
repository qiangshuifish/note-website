import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"大咖助阵 | LMOS：为什么说C语言是一把瑞士军刀？","description":"","frontmatter":{},"headers":[{"level":2,"title":"C 语言、UNIX 的起源和发展","slug":"c-语言、unix-的起源和发展","link":"#c-语言、unix-的起源和发展","children":[{"level":3,"title":"C 语言是两位牛人“玩”出来的","slug":"c-语言是两位牛人-玩-出来的","link":"#c-语言是两位牛人-玩-出来的","children":[]},{"level":3,"title":"C 语言和 UNIX 操作系统","slug":"c-语言和-unix-操作系统","link":"#c-语言和-unix-操作系统","children":[]}]},{"level":2,"title":"用一个程序体会 C 语言的简单性","slug":"用一个程序体会-c-语言的简单性","link":"#用一个程序体会-c-语言的简单性","children":[]},{"level":2,"title":"C 语言难在哪里？","slug":"c-语言难在哪里","link":"#c-语言难在哪里","children":[{"level":3,"title":"通过汇编代码看 C 语言的本质","slug":"通过汇编代码看-c-语言的本质","link":"#通过汇编代码看-c-语言的本质","children":[]},{"level":3,"title":"C 语言指针带来的陷阱","slug":"c-语言指针带来的陷阱","link":"#c-语言指针带来的陷阱","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]}],"relativePath":"深入C语言和程序运行原理/大咖助阵｜LMOS：为什么说C语言是一把瑞士军刀？.md","filePath":"深入C语言和程序运行原理/大咖助阵｜LMOS：为什么说C语言是一把瑞士军刀？.md","lastUpdated":1795558606000}'),l={name:"深入C语言和程序运行原理/大咖助阵｜LMOS：为什么说C语言是一把瑞士军刀？.md"};function t(e,s,h,k,r,E){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="大咖助阵-lmos-为什么说c语言是一把瑞士军刀" tabindex="-1">大咖助阵 | LMOS：为什么说C语言是一把瑞士军刀？ <a class="header-anchor" href="#大咖助阵-lmos-为什么说c语言是一把瑞士军刀" aria-label="Permalink to &quot;大咖助阵 | LMOS：为什么说C语言是一把瑞士军刀？&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>很高兴受邀来到这个专栏做一期分享。也许这门课的一些同学对我很熟悉，我是极客时间上《操作系统实战 45 讲》这门课的作者，同时也是 LMOS、LMOSEM 这两套操作系统的独立开发者。十几年来，我一直专注于操作系统内核研发，在 C 语言的使用方面有比较深刻的理解，所以想在这里把我的经验、见解分享给你。</p><p>操作系统和 C 语言的起源有着千丝万缕的联系，那么今天，我就先从 C 语言的起源和发展历史讲起。然后，我会从 C 语言自身的语法特性出发，向你展示这门古老的语言简单在哪里，又难在哪里。</p><h2 id="c-语言、unix-的起源和发展" tabindex="-1">C 语言、UNIX 的起源和发展 <a class="header-anchor" href="#c-语言、unix-的起源和发展" aria-label="Permalink to &quot;C 语言、UNIX 的起源和发展&quot;">​</a></h2><p>从英国的剑桥大学到美国的贝尔实验室，C 语言走过了一段不平凡的旅程。从最开始的 CPL语言到 BCPL 语言，再到 B 语言，到最终的 C 语言，一共经历了四次改进。从 20 世纪中叶到 21 世纪初，C 语言以它的灵活、高效、通用、抽象、可移植的特性，在计算机界占据了不可撼动的地位。但是，C 语言是如何产生的？诞生几十年来，它的地位为何一直不可动摇？请往下看。</p><h3 id="c-语言是两位牛人-玩-出来的" tabindex="-1">C 语言是两位牛人“玩”出来的 <a class="header-anchor" href="#c-语言是两位牛人-玩-出来的" aria-label="Permalink to &quot;C 语言是两位牛人“玩”出来的&quot;">​</a></h3><p>1969 年夏天，美国贝尔实验室的肯·汤普森的妻子回了娘家，这位理工男终于有了自己的时间。于是，他以 BCPL 语言为基础，设计出了简单且接近于机器语言的 B 语言（取 BCPL 的首字母）。然后，他又用 B 语言写出了 UNICS 操作系统，这就是后来风靡全世界的 UNIX 操作系统的初级版本。</p><p>那么，肯·汤普森为什么要写这个操作系统呢？背后的原因是我们这些凡人想象不到的：为了玩一个叫“Space Travel”的游戏。牛人就是牛人，这个“玩出来”的操作系统成功到让人无法想象。</p><p>而肯·汤普森一位同样是牛人的朋友，也疯狂地热爱这款游戏，这个朋友就是 C 语言之父（请注意不是谭浩强老师），丹尼斯·里奇。他为了能早点儿玩上游戏，加入了汤普森的疯狂项目，一起开发 UNIX。他的主要工作是改造 B 语言，使其更加成熟。1972 年，丹尼斯·里奇在 B 语言的基础上设计出了一种新的语言，他取了 BCPL 的第二个字母作为这种语言的名字，这就是C 语言。C 语言实现之后，汤普森和里奇用它重写了 UNIX。</p><h3 id="c-语言和-unix-操作系统" tabindex="-1">C 语言和 UNIX 操作系统 <a class="header-anchor" href="#c-语言和-unix-操作系统" aria-label="Permalink to &quot;C 语言和 UNIX 操作系统&quot;">​</a></h3><p>听到这儿，你应该可以理解，C 语言和 UNIX 操作系统从诞生时就密切相关。那么，C 语言对UNIX 操作系统的发展具体有什么影响呢？我们先从 C 语言出现之前说起。</p><p>在 C 语言出现之前，UNIX 操作系统的初级版本是用汇编语言编写的。用机器语言或者汇编语言开发的程序，是不可能在诸如 X86、Alpha、SPARC、PPC 和 ARM 等机器上任意运行的，想要运行就得重写所有代码。而用 C 语言编写的程序，则可以在任意架构的处理器上运行。只需要有那种架构的处理器对应的 C 语言编译器和库，然后将 C 源代码编译、链接成目标二进制文件，之后即可在该架构的处理器上运行。</p><p>正是 C 语言的这种高性能和强大的可移植性，促进了 UNIX 生态的发展。UNIX 诞生后的 40年间，出现的各种操作系统都是和 UNIX 有关系的，或者受其影响。甚至直到 2021 年，各种版本的 UNIX 内核和周边工具仍然使用 C 语言作为最主要的开发语言。</p><p>你可以看下这个 UNIX 家谱图（来自维基百科），更直观地感受 UNIX 的发展史：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5C%E8%AF%AD%E8%A8%80%E5%92%8C%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E5%8E%9F%E7%90%86/images/%25E5%25A4%25A7%25E5%2592%2596%25E5%258A%25A9%25E9%2598%25B5-LMOS%25EF%25BC%259A%25E4%25B8%25BA%25E4%25BB%2580%25E4%25B9%2588%25E8%25AF%25B4C%25E8%25AF%25AD%25E8%25A8%2580%25E6%2598%25AF%25E4%25B8%2580%25E6%258A%258A%25E7%2591%259E%25E5%25A3%25AB%25E5%2586%259B%25E5%2588%2580%25EF%25BC%259F/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5C%E8%AF%AD%E8%A8%80%E5%92%8C%E7%A8%8B%E5%BA%8F%E8%BF%90%E8%A1%8C%E5%8E%9F%E7%90%86/images/%25E5%25A4%25A7%25E5%2592%2596%25E5%258A%25A9%25E9%2598%25B5-LMOS%25EF%25BC%259A%25E4%25B8%25BA%25E4%25BB%2580%25E4%25B9%2588%25E8%25AF%25B4C%25E8%25AF%25AD%25E8%25A8%2580%25E6%2598%25AF%25E4%25B8%2580%25E6%258A%258A%25E7%2591%259E%25E5%25A3%25AB%25E5%2586%259B%25E5%2588%2580%25EF%25BC%259F/1.png" alt=""></a></p><p>看到这个庞大的家谱图，不知道你是否吃惊不已？但是我想说的是，这些操作系统内核都是使用 C 语言开发的，无一例外。甚至可以说，C 语言就是开发操作系统的专用语言。也正因如此，C 语言成了计算机史上的一颗明珠，一座灯塔，永远闪耀在计算机历史的长河之上。</p><h2 id="用一个程序体会-c-语言的简单性" tabindex="-1">用一个程序体会 C 语言的简单性 <a class="header-anchor" href="#用一个程序体会-c-语言的简单性" aria-label="Permalink to &quot;用一个程序体会 C 语言的简单性&quot;">​</a></h2><p>从对 C 语言起源的介绍中，你可以了解到，C 语言最开始是被设计用来开发 UNIX 的，而这造就了它自身的语言特性：</p><ul><li><p>要预知程序的运行流程和结果，就需要简单的类型系统和静态编译；</p></li><li><p>需要用 C 语言开发底层核心代码，要求 C 语言能灵活地操控内存和寄存器。</p></li><li><p>需要 C 语言是可以移植的，所以需要提供结构体、函数等抽象的编程机制。</p></li></ul><p>正是这些需求，导致了 C 语言的高效、简单、灵活和可移植性。所以，很多人说 C 语言是一种非常简单的语言。</p><p>我写了一个经典的 C 语言程序，Hello World ，你可以从中体会 C 语言的简单性。代码如下所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">#include </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;stdio.h&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 定义申明两个全局变量：hellostr、global，类型分别是：char*、int；</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">char</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> hellostr </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;HelloWorld&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int global </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 定义一个结构体类型 HW；</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">struct </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HW</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> char</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> str;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> int sum;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> long indx;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 函数；</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> show</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(struct </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HW</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> hw, long x) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;%d %d %s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, global, x, hellostr);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;%d %d %s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, hw</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sum, hw</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">indx, hw</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">str);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 函数；</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(int argc, char const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">argv[]) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 定义三个局部变量：x、parm、ishw，类型分别是：int、log、struct HW;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> int x;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> long parm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> struct </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HW</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ishw;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 变量赋值;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ishw.str </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> hellostr;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ishw.sum </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> global;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ishw.indx </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> parm;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 调用函数;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> show</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ishw, parm);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>这个短短的代码，就几乎包含了 C 语言 90% 的特性，有函数，有变量。其中，变量包括局部变量和全局变量；变量还有类型，用于存放各种类型的数据；还有一种特殊的变量即指针，指针也有类型，用于存放其它变量的地址。</p><p>总之一句话，C 语言就是函数 + 变量。函数表示算法操作，变量存放数据，即数据结构，合起来就是程序 = 算法 + 数据结构。</p><h2 id="c-语言难在哪里" tabindex="-1">C 语言难在哪里？ <a class="header-anchor" href="#c-语言难在哪里" aria-label="Permalink to &quot;C 语言难在哪里？&quot;">​</a></h2><p>你可以看到，从语言特性上来看，C 语言极其简单。但是，很多程序员却说，C 语言用起来无比困难，这又是为什么呢？</p><p>其实你可以这么理解：C 语言就像一把锋利的瑞士军刀，使用起来非常简单，并不像飞机坦克一样难于驾驭；但同时，它对使用者的技巧要求极高，使用时稍有不慎，就会伤及自身。C 语言可操控寄存器和内存的特性，对初级软件开发者极其不友好，很容易导致软件 bug，而且bug 查找起来非常困难。</p><h3 id="通过汇编代码看-c-语言的本质" tabindex="-1">通过汇编代码看 C 语言的本质 <a class="header-anchor" href="#通过汇编代码看-c-语言的本质" aria-label="Permalink to &quot;通过汇编代码看 C 语言的本质&quot;">​</a></h3><p>而 C 语言使用的困难之处，就要从 C 语言的本质说起了。</p><p>我们知道，C 语言的代码是不能直接执行的，需要通过 C 编译器编译。C 编译器首先将 C 代码编译成汇编代码，然后再通过汇编器编译成二进制机器代码。这刚好给了我们一个通过观察汇编代码了解 C 语言本质的机会。接下来，我们就按三个步骤观察下。</p><p>第一步，观察 C 语言如何处理全局变量。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.globl hellostr</span></span>
<span class="line"><span>.section .rodata</span></span>
<span class="line"><span>.LC0:</span></span>
<span class="line"><span> .string  &quot;HelloWorld&quot;  // 字符变量放在可执行文件的 rodata 段；</span></span>
<span class="line"><span> .data</span></span>
<span class="line"><span> .align 8</span></span>
<span class="line"><span> .type hellostr, @object</span></span>
<span class="line"><span> .size hellostr, 8</span></span>
<span class="line"><span>hellostr:  // 字符指针变量放在可执行文件的 data 段；</span></span>
<span class="line"><span> .quad .LC0</span></span>
<span class="line"><span> .globl global</span></span>
<span class="line"><span> .align 4</span></span>
<span class="line"><span> .type global, @object</span></span>
<span class="line"><span> .size global, 4</span></span>
<span class="line"><span>global:</span></span>
<span class="line"><span> .long 5  // long 型变量放在可执行文件的 rodata 段；</span></span>
<span class="line"><span> .section .rodata</span></span></code></pre></div><p>我们看到，C 语言对全局变量的处理是放在可执行文件的某个段中的，这些段会被操作系统的程序加载器映射到进程相应的地址空间中，代码通过地址就能访问到它们了。</p><p>第二步，观察 C 语言如何处理局部变量。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>main:</span></span>
<span class="line"><span>.LFB1:</span></span>
<span class="line"><span> .cfi_startproc</span></span>
<span class="line"><span> pushq %rbp</span></span>
<span class="line"><span> .cfi_def_cfa_offset 16</span></span>
<span class="line"><span> .cfi_offset 6, -16</span></span>
<span class="line"><span> movq %rsp, %rbp</span></span>
<span class="line"><span> .cfi_def_cfa_register 6</span></span>
<span class="line"><span> subq $64, %rsp  // 在栈中分配局部变量的内存空间；</span></span>
<span class="line"><span>   // 保存 main 的两个参数；</span></span>
<span class="line"><span> movl %edi, -52(%rbp)</span></span>
<span class="line"><span> movq %rsi, -64(%rbp)</span></span>
<span class="line"><span>   // long parm = 10;</span></span>
<span class="line"><span> movq $10, -8(%rbp)</span></span>
<span class="line"><span> movq hellostr(%rip), %rax</span></span>
<span class="line"><span>   // ishw.str = hellostr;</span></span>
<span class="line"><span> movq %rax, -48(%rbp)</span></span>
<span class="line"><span> movl global(%rip), %eax</span></span>
<span class="line"><span>   // ishw.sum = global;</span></span>
<span class="line"><span> movl %eax, -40(%rbp)</span></span>
<span class="line"><span> movq -8(%rbp), %rax</span></span>
<span class="line"><span>   // ishw.indx = parm;</span></span>
<span class="line"><span> movq %rax, -32(%rbp)</span></span>
<span class="line"><span>   // 处理给 show 函数传递的参数；</span></span>
<span class="line"><span> movq -8(%rbp), %rdx</span></span>
<span class="line"><span> leaq -48(%rbp), %rax</span></span>
<span class="line"><span> movq %rdx, %rsi</span></span>
<span class="line"><span> movq %rax, %rdi</span></span>
<span class="line"><span>   // 调用 show 函数；</span></span>
<span class="line"><span> call show</span></span>
<span class="line"><span> movl -12(%rbp), %eax</span></span>
<span class="line"><span> leave</span></span>
<span class="line"><span> .cfi_def_cfa 7, 8</span></span>
<span class="line"><span>   // 返回；</span></span>
<span class="line"><span> ret</span></span>
<span class="line"><span> .cfi_endproc</span></span></code></pre></div><p>由上可知，C 语言把局部变量放在栈中。栈也是一块内存空间，数据从栈顶压入，也从栈顶弹出。所以栈的特性是先进后出，栈顶由 RSP 寄存器指向，因此 RSP 也被称为栈指针寄存器。上面的代码对 RSP 减去 64，就是在栈中分配局部变量的空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>还有 call 指令也要用到栈，以上述代码为例：它是把第 31 行的 movl  -12(%rbp), %eax</span></span></code></pre></div><p>的地址压入栈顶，然后跳转 show 函数的地址，开始运行代码。而在 show 函数的最后，有一</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>条 ret 指令，从栈顶弹出返回地址（ movl -12(%rbp), %eax 的地址）到 RIP（程序指针</span></span></code></pre></div><p>寄存器），使得程序流程回到 main 函数中继续执行。这样，就完成了函数调用。</p><p>第三步，观察 C 语言如何处理函数。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>show:</span></span>
<span class="line"><span>.LFB0:</span></span>
<span class="line"><span> .cfi_startproc</span></span>
<span class="line"><span> pushq %rbp</span></span>
<span class="line"><span> .cfi_def_cfa_offset 16</span></span>
<span class="line"><span> .cfi_offset 6, -16</span></span>
<span class="line"><span> movq %rsp, %rbp</span></span>
<span class="line"><span> .cfi_def_cfa_register 6</span></span>
<span class="line"><span>   // 在栈中分配局部变量空间；</span></span>
<span class="line"><span> subq $16, %rsp</span></span>
<span class="line"><span>   // 把 hw 和 x 两个参数变量放在栈空间中；</span></span>
<span class="line"><span> movq %rdi, -8(%rbp)</span></span>
<span class="line"><span> movq %rsi, -16(%rbp)</span></span>
<span class="line"><span>   // 处理 printf 函数的参数；</span></span>
<span class="line"><span> movq hellostr(%rip), %rcx</span></span>
<span class="line"><span> movl global(%rip), %eax</span></span>
<span class="line"><span> movq -16(%rbp), %rdx</span></span>
<span class="line"><span> movl %eax, %esi</span></span>
<span class="line"><span> movl $.LC1, %edi</span></span>
<span class="line"><span> movl $0, %eax</span></span>
<span class="line"><span>   // 调用 printf 函数；</span></span>
<span class="line"><span> call printf</span></span>
<span class="line"><span> movq -8(%rbp), %rax</span></span>
<span class="line"><span> movq (%rax), %rcx</span></span>
<span class="line"><span>   // -8(%rbp) 指向的内存中放的 hw 指针；</span></span>
<span class="line"><span> movq -8(%rbp), %rax</span></span>
<span class="line"><span>   // 16(%rax) 指向的内存中放的 hw-&gt;indx；</span></span>
<span class="line"><span> movq 16(%rax), %rdx</span></span>
<span class="line"><span> movq -8(%rbp), %rax</span></span>
<span class="line"><span>   // 8(%rax) 指向的内存中放的 hw-&gt;sum；</span></span>
<span class="line"><span> movl 8(%rax), %eax</span></span>
<span class="line"><span> movl %eax, %esi</span></span>
<span class="line"><span>   // $.LC1 指向的内存中放的 &quot;HelloWorld&quot;，即 hw-&gt;str；</span></span>
<span class="line"><span> movl $.LC1, %edi</span></span>
<span class="line"><span> movl $0, %eax</span></span>
<span class="line"><span>   // 调用 printf 函数；</span></span>
<span class="line"><span> call printf</span></span>
<span class="line"><span> nop</span></span>
<span class="line"><span> leave</span></span>
<span class="line"><span> .cfi_def_cfa 7, 8</span></span>
<span class="line"><span> ret</span></span></code></pre></div><p>上面的代码清楚地展示了 C 语言编译器是如何编译一个 C 语言函数，如何处理函数参数的。你可以发现，C 语言编译出来的代码和你手写的汇编代码相差无几，有时甚至还要更高效。</p><p>因为汇编代码和机器指令直接对应，所以我们通过汇编代码，可以非常直观地观察到 C 语言编译器编译 C 代码的结果，清楚地看到一行 C 代码编译成的机器指令。在这个过程中，我们就可以清楚地知道 C 语言的变量、指针、函数的实现机制是什么，从而达到了解 C 语言本质的目的。</p><h3 id="c-语言指针带来的陷阱" tabindex="-1">C 语言指针带来的陷阱 <a class="header-anchor" href="#c-语言指针带来的陷阱" aria-label="Permalink to &quot;C 语言指针带来的陷阱&quot;">​</a></h3><p>在上面用汇编代码观察 C 语言的时候，我们看到了 C 语言是如何处理指针变量的。而这就是C 语言的灵活之处，也是其难点。C 语言的指针导致 C 语言程序员可以毫无节制地操控内存，这个特性赋予了 C 语言强大、灵活的特点，同时也带来了陷阱。下面我们用几个例子看看，具体有哪些陷阱。</p><p>陷阱一：未初始化的指针指针变量中存放的是地址数据，未初始化即为地址数据不明，指向何处也就不清楚。如果你指向了一个关键内存地址，对其进行读写，就会破坏其中的重要数据，从而导致代码逻辑出现问题，而且这样的问题非常难于查找。</p><p>你可以观察下面的代码，思考它是不是有问题。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(int argc, char const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">argv[]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> p;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> int k </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (int i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> k; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;hello world</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>这代码有问题吗？有，p 没有初始化，所以 p 的值是不确定的，可以指向任意地址。而这个地址中的数据也是不确定的，所以问题来了：i 可能大于 100，也可能小于 100，代码的行为是不确定的，所以出问题之后就极其难以查找。</p><p>陷阱二：指针越界</p><p>我们经常用指针操作一块连续的内存，比如数组。这样的情况下，如果代码逻辑出现问题，很容易导致指针越界，超出指针指向这块内存的边界，从而改写不该操作的内存中的数据。</p><p>我们还是来看一个具体的代码：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">char str[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> stringcopy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(char</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dest, char</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> src) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">src </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; dest</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dest </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">src;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(int argc, char const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">argv[]) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> stringcopy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(str, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;helloworld&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>从上述代码可以看出，str 只能存放 5 个字符，而 helloworld 是 10 个字符。而 stringcopy 函数的实现是把两个参数作为指针使用，所以这个代码一定会导致指针越界。如果 str[5]后面存放了关键数据，这个关键数据一定会被破坏，从而导致未知 bug，并且这样的 bug 很难查找。</p><p>陷阱三：栈破坏</p><p>指针可以指向任意的内存，栈也是内存，因此用指针很容易操作栈中的内容。而栈中保存着函数的返回地址和局部变量，其中重要的函数返回地址，经常被黑客作为攻击点。他们通过改写返回地址，使函数返回到自己写好的函数上。下面来看看黑客们是如何操作的。</p><p>来看下面的代码，它展示了黑客们攻击时利用的“陷阱”。你可以先试想下这段代码的运行结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void test() {</span></span>
<span class="line"><span> printf(&quot;test&quot;);</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void stackret(long* l) {</span></span>
<span class="line"><span>*l-- = (long)test;</span></span>
<span class="line"><span>*l-- = (long)test;</span></span>
<span class="line"><span>*l-- = (long)test;</span></span>
<span class="line"><span>*l-- = (long)test;</span></span>
<span class="line"><span>*l-- = (long)test;</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>int main(void) {</span></span>
<span class="line"><span> int* p;</span></span>
<span class="line"><span> long x = 0;</span></span>
<span class="line"><span> stackret(&amp;x);</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你一定想不到程序会输出“test”，可是我们明明没有调用 test 函数，这是为什么呢？</p><p>我们在 stackret 函数中不小心修改了栈中的内容，用 test 地址覆盖了返回地址。因为 x 变量在栈分配内存，我们传给 stackret 函数的就是 x 的地址，自然就可以修改栈中的内容。这个特性经常被木马程序所利用。</p><p>上面，我从三个方面向你展现了指针可能带来的危险。总之，C 语言的指针给开发人员带来了内存的完全可控性，但是也给程序开发带来了困难，稍有不慎，就会坠入万劫不复的深渊。所以在使用指针时要非常小心。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天的分享就到这里了，最后我来给你总结一下。</p><ol><li><p>首先我带你回顾了 C 语言的起源，以及它和 UNIX 操作系统的密切联系。C 语言是牛人们“玩”出来的，而 C 语言和 UNIX 在发展过程中互相成就了对方。</p></li><li><p>C 语言最开始是被设计用来开发 UNIX 的，这导致了 C 语言的高效、简单、灵活和可移植性。我们用一个代码实例了解了 C 语言的简单性。</p></li><li><p>我们通过观察汇编代码，了解了 C 语言的本质，进而理解了 C 语言指针可能带来的陷阱。</p></li></ol><p>关于 C 语言，我想和你聊的还远不止这些。在“LMOS 说 C 语言”的下篇，我会和你分享 C 语言在工程项目中的应用方式，以及如何用 C 语言来实现面向对象的编程方法，我们到时候见！</p>`,67)])])}const g=a(l,[["render",t]]);export{d as __pageData,g as default};
