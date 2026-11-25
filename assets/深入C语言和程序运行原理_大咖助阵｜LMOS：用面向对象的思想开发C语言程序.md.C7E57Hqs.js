import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"大咖助阵 | LMOS：用面向对象的思想开发C语言程序","description":"","frontmatter":{},"headers":[{"level":2,"title":"C 语言能干什么？","slug":"c-语言能干什么","link":"#c-语言能干什么","children":[]},{"level":2,"title":"面向过程和面向对象的两种思想","slug":"面向过程和面向对象的两种思想","link":"#面向过程和面向对象的两种思想","children":[]},{"level":2,"title":"基于 C 语言的面向对象编程","slug":"基于-c-语言的面向对象编程","link":"#基于-c-语言的面向对象编程","children":[{"level":3,"title":"封装","slug":"封装","link":"#封装","children":[]},{"level":3,"title":"继承","slug":"继承","link":"#继承","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"写在最后","slug":"写在最后","link":"#写在最后","children":[]}],"relativePath":"深入C语言和程序运行原理/大咖助阵｜LMOS：用面向对象的思想开发C语言程序.md","filePath":"深入C语言和程序运行原理/大咖助阵｜LMOS：用面向对象的思想开发C语言程序.md","lastUpdated":1795558606000}'),l={name:"深入C语言和程序运行原理/大咖助阵｜LMOS：用面向对象的思想开发C语言程序.md"};function e(t,s,k,h,c,o){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="大咖助阵-lmos-用面向对象的思想开发c语言程序" tabindex="-1">大咖助阵 | LMOS：用面向对象的思想开发C语言程序 <a class="header-anchor" href="#大咖助阵-lmos-用面向对象的思想开发c语言程序" aria-label="Permalink to &quot;大咖助阵 | LMOS：用面向对象的思想开发C语言程序&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>在“ LMOS 说 C 语言”的上篇里，我向你分享了 C 语言的起源，它与 UNIX 操作系统的联系，以及与 C 语言简单和困难相关的语言特性。今天我想和你聊聊，既然 C 语言是一把锋利但考验使用者技巧的瑞士军刀，我们可以拿它做什么，又怎么才能把它用好。</p><h2 id="c-语言能干什么" tabindex="-1">C 语言能干什么？ <a class="header-anchor" href="#c-语言能干什么" aria-label="Permalink to &quot;C 语言能干什么？&quot;">​</a></h2><p>对于“C 语言能干什么”这个问题，我的回答是：C 语言能干一切其他语言能干的事。</p><p>C 语言自身的特性使得它能完全操作计算机所有的资源，因此它生来就是开发操作系统等底层核心软件的。不仅仅是开发操作系统，还有一些数据库和一些其他高级编程语言的编译器、解析器等。C 语言简单的语法，被 C++、Java、Go、JS 等语言效仿。其实从 C 语言的语言特性就可以看出来，它属于高级语言中的低级语言，又是低级语言中的高级语言，能适应一切底层开发。</p><p>然而，C 语言既然能做一切底层开发，就一定能做一切上层开发，只是对开发者的能力要求远高于 Java、Go 这些高级语言。其实，所有的高级语言都有共同的目标，就是降低开发者的学习使用成本和心智负担，从而降低软件的开发和维护成本。比如，Java 用虚拟机实现了一次编译处处运行，用垃圾内存回收机制解决了程序员使用内存的困难，不用时刻担心内存没有释放。这些归根结底是为了降低软件开发成本。</p><p>对于“C 语言能干一切其他语言能干的事”这句话，你可能还有这样的疑问：C 语言是一门面向过程的编程语言，而在工程应用中，我们多使用面向对象的编程方式。用 C 语言来做现代大型软件项目，是不是不太现实？</p><p>确实，由于 C 语言函数之间的强耦合和内存的低级控制特性，在用它开发大型工程项目时，如果不设计好架构和相关的编码规则，将会给项目的开发、协同和后期维护带来很多困难。但是，C 语言是一门面向过程的编程语言，并不意味着我们不能用它来实现面向对象的编程方式。接下来，我就具体讲讲，怎么用面向对象的思想开发 C 语言程序。</p><h2 id="面向过程和面向对象的两种思想" tabindex="-1">面向过程和面向对象的两种思想 <a class="header-anchor" href="#面向过程和面向对象的两种思想" aria-label="Permalink to &quot;面向过程和面向对象的两种思想&quot;">​</a></h2><p>我先带你回顾下面向过程和面向对象这两种思想，以及一些容易混淆的相关概念。</p><p>对于计算过程的不同认识，产生了不同的计算模型。基于计算模型进行分类，我们可以将语言分为命令式、函数式、面向过程、面向对象四大类。如果从程序的本质上来看，可以进一步归纳为两种：命令式语言和说明式语言。</p><p>面向过程是命令式语言的主要实现手段，而面向对象是当前应用编程领域中最常用的语言类型。但是，无论从语言定义还是数据抽象发展来看，面向对象都是面向过程的衍生。</p><p>命令式这个词太过于学术化了，其实我们常见的编程语言，从汇编到 C 再到 C++、 Java，都是命令式语言。命令式语言在很大程度上受到了“冯·诺依曼”计算体系的影响。这个体系又以“存储”和“处理”为核心，其中存储被抽象为内存，处理被抽象为运算指令和语句。于是，命令式的核心就是通过运算去改变内存（数据）。</p><p>听到这里，你应该能把这些概念的关系理清楚了：面向过程 / 面向对象这些概念，和命令式并不在同一个维度上。前者是运算类型，表现为语言；后者着重表达的则是程序设计和开发的方法。</p><p>C 语言和 C++ 都是命令式语言，不过 C 语言是面向过程的语言，C++ 是面向对象的语言，那么面向过程和面向对象有什么区别呢？其实它们大同小异，只不过是“思考问题的方式”不同。为了方便你理解，这里我用“吃饭”来类比。</p><p>过程是对每个功能或者动作的精确实现。用“吃饭”来举例子：吃饭这个“功能”，包含怎么吃，吃多少。小猫能吃饭，人也能吃饭，但二者吃饭的“过程”肯定有区别。这个逻辑可以用下面的代码来描述：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">void</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cateat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cat*</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 吃饭；</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">void</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> peopleeat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">people*</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 吃饭；</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">int</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">int</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> argc,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> char</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">argv[]</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> cateat(cat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> peopleeat(people</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>至于“面向对象”里的“对象”，可以这么理解：猫和人分别是两个对象，这两个对象都包含吃饭这个动作。对于人，会调用人的吃饭动作的函数；而对于猫，则会调用属于猫的吃饭动作。代码如下：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Cat {  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 对象猫；</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> void eat();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void Cat::eat(void) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 猫吃饭；</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> People {  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 对象人；</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> void eat();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void People::eat(void) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 人吃饭；</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> main(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> argc, char const </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">argv[]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Cat c;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> People p;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> c.eat(); </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 调用猫对象的吃饭动作；</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> p.eat(); </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 调用人对象的吃饭动作；</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>我们可以看到，面向过程和面向对象的思考方式截然不同。面向过程，是对每个不同动物的吃饭过程进行精确描述。而面向对象的思考方式却不同：认为猫和人是两个不同的对象，都有吃饭的动作，各自对吃饭这个动作进行封装和实现。最后，用对象自己调用自己的方法，完成相应的吃饭动作。</p><p>但仔细思考一下，猫和人其实都属于哺乳动物，哺乳动物间还是有一些共性的。那么，如何表示这种父子范畴关系呢？答案就是在封装的基础上进行继承操作。</p><p>这是因为，如果仅仅是把属性和方法封装成对象，这个意义还不是很大。封装是为了继承，继承是为了解耦和复用。当然，随着工程复杂度的发展，人们发现传统的单 / 多继承又会带来额外的复杂度，于是就又有了组合优于继承的思想，这里就不展开了。接下来让我们看看，怎么用 C 语言来实现封装和继承这两种面向对象编程的特性。</p><h2 id="基于-c-语言的面向对象编程" tabindex="-1">基于 C 语言的面向对象编程 <a class="header-anchor" href="#基于-c-语言的面向对象编程" aria-label="Permalink to &quot;基于 C 语言的面向对象编程&quot;">​</a></h2><p>首先，请一定要记住：面向对象是一种编程思想，并非特定语言（如 C++、Java）实现的功能。C++、Java 这些语言只是用语言的文法对这种思想进行规约，达到方便或者强制编程人员用面向对象的思想实现自己的代码逻辑的目的。</p><p>所以，我们不仅能用 C++、Java 这些“面向对象的编程语言”实现面向对象编程，用 C 或者汇编也可以实现，只是后者没有提供类似 C++、Java 中，可用于实现面向对象的语法糖而已。下面，我们就一起用 C 来实现面向对象的编程方法。</p><h3 id="封装" tabindex="-1">封装 <a class="header-anchor" href="#封装" aria-label="Permalink to &quot;封装&quot;">​</a></h3><p>我们首先用 C 语言来实现封装。封装是面向对象中最基础的思想，即把一些属性和方法组织在一起，形成一个对象。</p><p>接下来，我会用我的课程《操作系统实战 45 讲》中的 Cosmos 的锁实现为实例，剖析用 C语言来实现封装的方法。在操作系统中，用锁的模块很多，进程模块要用锁，内存模块也要用锁，它们对锁的要求也有不同。现在我们来封装最基本的锁，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct SPINLOCK {</span></span>
<span class="line"><span> volatile U32 Lock; // int 类型，0 表示解锁，1 表示加锁；</span></span>
<span class="line"><span>} SpinLock;</span></span>
<span class="line"><span>// 加锁；</span></span>
<span class="line"><span>void HalSpinLock(SpinLock *lock) {</span></span>
<span class="line"><span> __asm__ __volatile__(</span></span>
<span class="line"><span>   &quot;1：lock; xchg %0, %1\\n&quot;</span></span>
<span class="line"><span>   &quot;cmpl $0, %0\\n&quot;</span></span>
<span class="line"><span>   &quot;jnz 2f\\n&quot;</span></span>
<span class="line"><span>   &quot;.section .spinlock.text,&quot;&quot;\\&quot;ax\\&quot;&quot;</span></span>
<span class="line"><span>   &quot;2：cmpl $0, %1\\n&quot;</span></span>
<span class="line"><span>   &quot;jne 2b\\n&quot;</span></span>
<span class="line"><span>   &quot;jmp 1b\\n&quot;</span></span>
<span class="line"><span>   &quot;.previous\\n&quot;</span></span>
<span class="line"><span>   :: &quot;r&quot;(1), &quot;m&quot;(*lock));</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 解锁；</span></span>
<span class="line"><span>void HalUnSpinLock(SpinLock *lock) {</span></span>
<span class="line"><span> __asm__ __volatile__(</span></span>
<span class="line"><span>   &quot;movl   $0, %0\\n&quot;</span></span>
<span class="line"><span>   :: &quot;m&quot;(*lock));</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码中，我们定义了一个 SpinLock 数据结构，并且围绕这个结构写好了两个函数，一个加锁，一个解锁。其中，代码是用嵌入汇编实现的，这里我们不用管它们的实现，只需明白它们能加锁和解锁就行了。</p><p>不过，仅仅是这样还体现不出封装的意义，我们继续修改代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct MLOCK {</span></span>
<span class="line"><span> SpinLock Locks;  // 锁；</span></span>
<span class="line"><span> UInt Count;  // 计数器；</span></span>
<span class="line"><span> void (*MLocked)(MLock* Lock);  // 加锁函数指针；</span></span>
<span class="line"><span> void (*MUnLock)(MLock* Lock);  // 解锁函数指针；</span></span>
<span class="line"><span>} MLock;</span></span>
<span class="line"><span>// 初始化；</span></span>
<span class="line"><span>void MLockInit(MLock* init) {</span></span>
<span class="line"><span> SpinLockInit(&amp;init-&gt;Locks);</span></span>
<span class="line"><span> init-&gt;Count = 0;</span></span>
<span class="line"><span> init-&gt;MLocked = KrlMmLocked;</span></span>
<span class="line"><span> init-&gt;MUnLock = KrlMmUnLock;</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 加锁；</span></span>
<span class="line"><span>void KrlMmLocked(MLock* lock) {</span></span>
<span class="line"><span> HalSpinLock(&amp;lock-&gt;Locks);  // 调用基类加锁函数；</span></span>
<span class="line"><span> lock-&gt;Count++;</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 解锁；</span></span>
<span class="line"><span>void KrlMmUnLock(MLock* lock) {</span></span>
<span class="line"><span> HalUnSpinLock(&amp;lock-&gt;Locks);  // 调用基类解锁函数；</span></span>
<span class="line"><span> lock-&gt;Count--;</span></span>
<span class="line"><span> return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>MLock Lock;  // 定义一个 Lock 对象；</span></span>
<span class="line"><span>MLockInit(&amp;Lock);  // 初始化对象；</span></span>
<span class="line"><span>Lock.MLocked(&amp;Lock);  // 调用对象方法；</span></span>
<span class="line"><span>Lock.MUnLock(&amp;Lock);</span></span></code></pre></div><p>上述代码中，MLock 结构中的 SpinLock 相当于基类，并且扩展封装了一个计数器和两个成员方法，形成了新的 MLock 锁。</p><p>MLock 锁封装了底层锁的实现机制，使用者不用考虑底层实现，在任何需要使用 MLock 的地方，只要定义一个 MLock 类型的对象，并对其初始化，需要的时候调用其中对应的方法就行了。你看，是不是有点 C++ 的味道了？只是 C++ 用语法糖包装了这些实现细节，而 C 语言的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>语法上没有 new ，没有 class ，也没有构造函数。但是 C 语言有 struct ，有函数指针，</span></span></code></pre></div><p>可以自己写初始化函数。</p><h3 id="继承" tabindex="-1">继承 <a class="header-anchor" href="#继承" aria-label="Permalink to &quot;继承&quot;">​</a></h3><p>在面向对象的编程思想中，把属性和方法封装成一个个对象是为了继承。若非如此，就失去了封装对象的意义。上面的 MLock 只是封装加上简单的继承，下面我们来看看复杂点的继承。</p><p>在操作系统中，内存管理需要很多数据结构（如果你想深入了解这些，可以看看我在极客时间的课程《操作系统实战 45 讲》），内存管理的各种数据结构都需要锁来避免程序并发运行带来的破坏性结果。下面，我用其中几个结构作为实例，示范一下“继承”这个概念。</p><p>先来看这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 物理地址块头链；</span></span>
<span class="line"><span>typedef struct PABHLIST {</span></span>
<span class="line"><span> MLock Lock;  // 锁对象；</span></span>
<span class="line"><span> U32  Status;</span></span>
<span class="line"><span> UInt Order;</span></span>
<span class="line"><span> UInt InOrderPmsadNR;</span></span>
<span class="line"><span> UInt FreePmsadNR;</span></span>
<span class="line"><span> UInt PmsadNR;</span></span>
<span class="line"><span> UInt AllocCount;</span></span>
<span class="line"><span> UInt FreeCount;</span></span>
<span class="line"><span> List FreeLists;</span></span>
<span class="line"><span> List AllocLists;</span></span>
<span class="line"><span> List OveLists;</span></span>
<span class="line"><span>} PABHList;</span></span>
<span class="line"><span>// 内存拆分合并结构；</span></span>
<span class="line"><span>typedef struct MSPLITMER {</span></span>
<span class="line"><span> MLock Lock;  // 锁对象；</span></span>
<span class="line"><span> U32  Status;</span></span>
<span class="line"><span> UInt MaxSMNR;</span></span>
<span class="line"><span> UInt PhySMNR;</span></span>
<span class="line"><span> UInt PreSMNR;</span></span>
<span class="line"><span> UInt SPlitNR;</span></span>
<span class="line"><span> UInt MerNR;</span></span>
<span class="line"><span> PABHList PAddrBlockArr[MSPLMER_ARR_LMAX];</span></span>
<span class="line"><span> PABHList OnePAddrBlock;</span></span>
<span class="line"><span>} MSPlitMer;</span></span>
<span class="line"><span>// 内存节点；</span></span>
<span class="line"><span>typedef struct MNode {</span></span>
<span class="line"><span> List Lists;</span></span>
<span class="line"><span> MLock Lock;  // 锁对象；</span></span>
<span class="line"><span> UInt Status;</span></span>
<span class="line"><span> UInt Flags;</span></span>
<span class="line"><span> UInt NodeID;</span></span>
<span class="line"><span> UInt CPUID;</span></span>
<span class="line"><span> Addr NodeMemAddrStart;</span></span>
<span class="line"><span> Addr NodeMemAddrEnd;</span></span>
<span class="line"><span> PHYMSPaceArea* PMSAreaPtr;</span></span>
<span class="line"><span> U64 PMSAreaNR;</span></span>
<span class="line"><span> U64 NodeMemSize;</span></span>
<span class="line"><span> Addr NodeMemResvAddrStart;</span></span>
<span class="line"><span> Addr NodeMemResvAddrEnd;</span></span>
<span class="line"><span> U64 NodeMemResvSize;</span></span>
<span class="line"><span> MArea MAreaArr[MEMAREA_MAX];</span></span>
<span class="line"><span> PMSADDireArr PMSADDir;</span></span>
<span class="line"><span>} MNode;</span></span></code></pre></div><p>上面的三个数据结构，都需要用锁来保护其自身数据的完整体，避免并发访问带来的各种问题。要访问，先加锁，一旦加锁别人就无法访问了，这样就能保证数据是安全访问的，不会读取到状态不一致的数据。</p><p>你可能想问：难道我们要每种数据结构都写一套加锁、解锁的代码吗？当然不是。我们只需要在其他结构里包括这个 MLock 就行了，相当于继承 MLock 类。这样，我们就可以访问结构时先调用 MLock 中的加锁操作。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MNode node;</span></span>
<span class="line"><span>MnodeInit(&amp;node);</span></span>
<span class="line"><span>node.Lock.MLocked(&amp;node.Lock);</span></span>
<span class="line"><span>node.PMSAreaNR++;</span></span>
<span class="line"><span>node.Lock.MUnLock(&amp;node.Lock);</span></span></code></pre></div><p>从这段代码中我们看到，操作 MNode 中的数据，首先会调用 MNode 下的 Lock 中的加锁操作，然而这个 Lock 对象是继承于 MLock 类的。</p><p>由此我们可以发现，任何数据结构只要包含（继承）MLock 类，就可以具有锁的功能了，而不用知道锁是如何实现的。并且，我们如果需要移植代码到不同的机器上，只用改动 MLock中 SpinLock 的实现，就好了。这种高内聚，低耦合的状态，正是衡量软件工程设计是否优良的重要指标。</p><p>我们在工作中，不仅仅是要追求代码运行正常与否，更要在这个基础之上追求代码的可读性、可维护性、软件架构的优雅性。正如我们看到的这样，面向过程和面向对象是两种不同的编程设计思想。我们可以取其优势以用之，把这两种思想融会贯通，这样就能用面向过程的编程语言实现面向对象的编程方法。这就像剑法大成的独孤求败一样，已经不在乎用什么剑了。在他眼里，草木竹石均可为剑，以至于能达到更高的境界，“无剑胜有剑”。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天的分享就到这里了，最后我来给你总结一下。</p><ol><li><p>首先，我们了解了 C 语言能干什么：从操作系统到编译器，从数据库到应用软件，C 语言都可以非常高效地实现它们。</p></li><li><p>然后，我们对比了面向过程和面向对象这两种不同编程思想的“思考方式”。</p></li><li><p>既然面向对象是一种编程思想，那么用 C 语言这种面向过程的编程语言也可以实现。最后，我们通过大量的实例，实现了面向对象的封装和继承特性。</p></li></ol><h2 id="写在最后" tabindex="-1">写在最后 <a class="header-anchor" href="#写在最后" aria-label="Permalink to &quot;写在最后&quot;">​</a></h2><p>C 语言是一把利剑，用好了威力无穷。如果想最大程度地发挥它的威力，我们还需要把它跟工程实践相结合，可以尝试用 C 语言开发一个工程，比如操作系统、数据库等。</p><p>今天我举的实例仅仅是一个数据结构，如果稍微扩展一下思维，你就会发现：一个 C 语言模块文件就是一个对象类，其中的数据结构和函数就是这个对象类的成员数据和成员方法。在《操作系统实战 45 讲》这门课中，我带同学们实现了一个基于 x86 平台的 64 位多进程的操作系统——Cosmos。Cosmos 中的 CPU 类、MMU 类、List 类、RBTree 类、Atomic 类、Queue 类等，都是用 C 语言基于面向对象的思想实现的。总之，如果你想看到更多 C 语言在操作系统中应用的案例，我在这门课里等你。</p><p>感谢你看到这里，如果今天的内容让你有所收获，欢迎把它分享给你的朋友。</p>`,55)])])}const E=a(l,[["render",e]]);export{r as __pageData,E as default};
