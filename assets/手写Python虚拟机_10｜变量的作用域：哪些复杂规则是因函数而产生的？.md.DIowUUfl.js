import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"10 | 变量的作用域：哪些复杂规则是因函数而产生的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"变量的作用规则","slug":"变量的作用规则","link":"#变量的作用规则","children":[]},{"level":2,"title":"全局变量","slug":"全局变量","link":"#全局变量","children":[{"level":3,"title":"跨文件的全局变量","slug":"跨文件的全局变量","link":"#跨文件的全局变量","children":[]},{"level":3,"title":"LOAD 指令","slug":"load-指令","link":"#load-指令","children":[]}]},{"level":2,"title":"builtin 变量","slug":"builtin-变量","link":"#builtin-变量","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"手写Python虚拟机/10｜变量的作用域：哪些复杂规则是因函数而产生的？.md","filePath":"手写Python虚拟机/10｜变量的作用域：哪些复杂规则是因函数而产生的？.md","lastUpdated":1795557449000}'),l={name:"手写Python虚拟机/10｜变量的作用域：哪些复杂规则是因函数而产生的？.md"};function t(e,s,h,k,c,r){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_10-变量的作用域-哪些复杂规则是因函数而产生的" tabindex="-1">10 | 变量的作用域：哪些复杂规则是因函数而产生的？ <a class="header-anchor" href="#_10-变量的作用域-哪些复杂规则是因函数而产生的" aria-label="Permalink to &quot;10 | 变量的作用域：哪些复杂规则是因函数而产生的？&quot;">​</a></h1><p>你好，我是海纳。</p><p>上一节课我们实现了函数的基本功能，可以调用一个不带参数的函数，也可以正常地得到函数的返回值。引入函数以后，就有了新的命名空间（namespace），简单说就是函数内部定义的变量，在函数外部是访问不到的，这就产生了变量的作用域的问题。这一节课，我们就来实现函数的作用域。</p><h2 id="变量的作用规则" tabindex="-1">变量的作用规则 <a class="header-anchor" href="#变量的作用规则" aria-label="Permalink to &quot;变量的作用规则&quot;">​</a></h2><p>在 Python 语言中，主要有四种类型的变量，按照作用域从小到大排列，分别是局部变量（Local）、闭包变量（Enclosing）、全局变量（Global）和内建变量（Builtin）。</p><p>例如以下三个例子：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">global</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> goo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> bar, goo</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   global</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">func()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x)   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#this is 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bar, goo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> foo()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bar()   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># this is 2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">goo()   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># this is 3</span></span></code></pre></div><p>代码的注释里已经把结果标明了。</p><p>第 2 行定义了全局变量 x，但是在 goo 方法里，又定义了一个局部变量 x，那么第 11 行要打印 x 的值的时候，首先就会去局部变量表里查找。在 goo 方法里首先查到的是第 10 行定义的局部变量，所以这里就会打印 3。也就是说局部变量对全部变量 x 造成了覆盖。</p><p>在 func 方法中，我们明确地指定了要修改全局变量 x 的值，由原来的 0 改为 1（第 16、17行），这里是直接修改了全局变量表中的 x，而不是在局部变量表里创建新的变量。所以这会导致第 20 行打印全局变量时，输出为 1。</p><p>在 bar 方法里，虚拟机按照同样的查找顺序，先查找局部变量表，发现局部变量表里找不到x，接下来就会去定义 bar 的上下文中去找，也就是 foo 的定义中。可以看到 foo 里已经定义了 x 为 2。</p><p>bar 函数使用了 foo 函数中定义的局部变量，即使 bar 函数作为返回值被取出来以后（第 20行），它仍然可以访问到 foo 函数中 x 的值。就好像 foo 中的局部变量已经与 bar 绑定在一起一样。人们把这种把函数外的变量与函数绑在一起的现象叫做 Closure 或者 Enclosing，中文翻译为闭包。</p><p>可见，虚拟机在查找变量时，是按照局部变量 -&gt; 闭包变量 -&gt; 全局变量这样的顺序进行查找的。如果再加上语言内建变量，这种查找顺序就会被统称为 LEGB 规则。</p><p>当然，这个例子中缺少内建（Builtin）变量。Builtin 是 Python 内建变量表，在这个变量表里，常驻了很多 Python 语言的重要变量，例如 print 函数。</p><p>注意，Python 2 和 Python 3 版本在处理语言内建变量时有所不同。在 Python 2 中，True 和False，实际上是个变量。虽然我们几乎从来不去主动修改 Builtin 变量表，但这样做确实是合法的，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 只能在Python2中运行</span></span>
<span class="line"><span>True, False = 0, 1</span></span>
<span class="line"><span>if False:</span></span>
<span class="line"><span>   print &quot;hello&quot;</span></span></code></pre></div><p>但在 Python 3 中，这个例子就不能再通过编译了。</p><p>另外一个区别是，Python 2 中 print 是关键字，它会被翻译成 PRINT_ITEM 和PRINT_NEWLINE 两条指令。但是这两条指令在 Python 3 中被废弃了，print 也从关键字变成了内建函数。所以在 Python 3 中，可以执行赋值操作，而 Python 2 则不行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&gt;&gt;&gt; say = print</span></span>
<span class="line"><span>&gt;&gt;&gt; print = None</span></span>
<span class="line"><span>&gt;&gt;&gt; print</span></span>
<span class="line"><span>&gt;&gt;&gt; print(&quot;hello&quot;)</span></span>
<span class="line"><span>Traceback (most recent call last):</span></span>
<span class="line"><span> File &quot;&lt;​stdin&gt;&quot;, line 1, in &lt;​module&gt;</span></span>
<span class="line"><span>TypeError: &#39;NoneType&#39; object is not callable</span></span>
<span class="line"><span>&gt;&gt;&gt; say(&quot;hello&quot;)</span></span>
<span class="line"><span>hello</span></span></code></pre></div><p>在详细地解释过 LEGB 规则以后，接下来我们就要思考如何在虚拟机中实现这些规则。</p><h2 id="全局变量" tabindex="-1">全局变量 <a class="header-anchor" href="#全局变量" aria-label="Permalink to &quot;全局变量&quot;">​</a></h2><p>实际上，局部变量已经实现好了，就在 FrameObject 中的 _locals 表里，函数执行过程中使用的局部变量都存储在这里。</p><p>所以，我们接下来需要实现的是 Global 变量的功能。先看一个 Global 变量的具体例子，通过这个例子，我们可以观察对应的字节码是怎么样的。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 全局变量的例子</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">global</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   global</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">func()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#this is 1</span></span></code></pre></div><p>将上述代码保存成一个 py 文件，编译以后通过 show_file 来查看它的内容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> 2           0 LOAD_CONST               0 (0)</span></span>
<span class="line"><span>             3 STORE_GLOBAL             0 (x)</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span> 9          22 LOAD_GLOBAL              0 (x)</span></span>
<span class="line"><span>            25 PRINT_ITEM</span></span></code></pre></div><p>这个文件所对应的字节码里有两个是我们尚未实现的：STORE_GLOBAL 和LOAD_GLOBAL。这两个字节码的作用都是操作全局变量，我们把局部变量放在了FrameObject 的局部变量表里，而全局变量也放到 FrameObject 的全局变量表里。</p><p>接下来，就给 FrameObject 添加全局变量表。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">FrameObject.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> FrameObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _locals;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _globals;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> globals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()          { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _globals; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>简单推理就能知道，在同一个文件中所有的全局变量都会存放在同一个地方。所以这里需要一种机制，确保在同一个文件中定义的函数，它们所创建的 FrameObject 使用的是同一个全局变量列表。</p><p>有很多种设计方案可以达成这一目标，但为了更全面正确地实现全局变量功能，我们还需要研究跨文件的全局变量是如何工作的。</p><h3 id="跨文件的全局变量" tabindex="-1">跨文件的全局变量 <a class="header-anchor" href="#跨文件的全局变量" aria-label="Permalink to &quot;跨文件的全局变量&quot;">​</a></h3><p>在同一个目录下，创建两个文件，分别命名为 a.py 和 b.py。</p><p>a.py 的代码：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># a.py</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> b </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> foo</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">foo()</span></span></code></pre></div><p>b.py 的代码：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># b.py</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span></span></code></pre></div><p>然后执行 a.py，得到的结果是 100，而不是 2。这说明函数所依赖的全局变量表是定义函数对象时，它所在的那个文件的全局变量，在这个例子中就是 b.py，而不是调用函数时所在文件的全局变量（a.py)。</p><p>换句话说，函数执行所依赖的全局变量是 MAKE_FUNCTION 时的，而不是CALL_FUNCTION 时的。所以在执行 MAKE_FUNCTION 时，虚拟机就应该将 FrameObject中的全局变量表打包进 FunctionObject，这样一来，无论函数对象在哪里被调用，它所使用的全局变量表都是定义该函数时所在文件的全局变量表。</p><p>实现这个功能最好的办法是，也为 FunctionObject 引入一个变量表。我们来看一下FunctionObject 的变化。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">functionObject.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> FunctionObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public HiObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _globals;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> globals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _globals; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   void set_globals(Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) { _globals = x; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">interpreter.cpp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void Interpreter::run(CodeObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> codes) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _frame = new FrameObject(codes);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   while</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (_frame</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">has_more_codes()) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     unsigned char op_code = _frame</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">get_op_code();</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       FunctionObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fo;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       switch (op_code) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           case ByteCode::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">MAKE_FUNCTION</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               v = POP();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               fo = new FunctionObject(v);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               fo</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">set_globals(_frame</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">globals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               PUSH(fo);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>上述代码中，在创建函数对象的时候，我们就把当前栈帧的全局变量表传递给了FunctionObject （第 26 行）。从此，无论这个函数被传递到哪里去执行，无论它的执行上下文中的全局变量表的内容是什么，这个函数一旦开始执行，它的全局变量表总会是它定义时的那个。</p><p>最后，在与变量表相关的逻辑里，还有几处需要修改的地方。</p><p>第一处是 FrameObject 的构造函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FrameObject::FrameObject (FunctionObject* func) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   _locals  = new Map&lt;​HiObject*, HiObject*&gt;();</span></span>
<span class="line"><span>   _globals = func-&gt;_globals;</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// this constructor is used for module only.</span></span>
<span class="line"><span>FrameObject::FrameObject(CodeObject* codes) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   _locals  = new Map&lt;​HiObject*, HiObject*&gt;();</span></span>
<span class="line"><span>   _globals = _locals;</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们之前实现了两个 FrameObject 的构造函数，一个是用于调用函数时，为函数创建栈帧的。创建栈帧时，全局变量表就从 FunctionObject 中去取（第 4 行）。</p><p>还有一个构造函数是用于创建第一个栈帧的，它的输入参数是 CodeObject。在这个构造函数里，我们并没有创建一个新的全局变量表，而是让 _globals 与 _locals 指向了同一个对象（第11 行）。这么做的原因是，在非函数上下文中，Python 的局部变量与全局变量的作用是一样的，只有调用函数时，创建了新的栈帧，才对局部变量和全局变量进行区分。</p><p>这样的设计可以保证在文件的模块中，全局变量表和局部变量是相同的，而且通过FrameObject 和 FunctionObject 的相互传递，也保证了在同一个文件中定义的函数，所使用的全局变量表是同一个。</p><h3 id="load-指令" tabindex="-1">LOAD 指令 <a class="header-anchor" href="#load-指令" aria-label="Permalink to &quot;LOAD 指令&quot;">​</a></h3><p>在实现了全局变量以后，接下来我们就可以实现 LOAD_GLOBAL 和 STORE_GLOBAL 指令了。顾名思义，这两个指令都是用于操作全局变量表的。它们的实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>       case ByteCode::LOAD_GLOBAL:</span></span>
<span class="line"><span>            v = _frame-&gt;names()-&gt;get(op_arg);</span></span>
<span class="line"><span>            w = _frame-&gt;globals()-&gt;get(v);</span></span>
<span class="line"><span>            PUSH(w);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>       case ByteCode::STORE_GLOBAL:</span></span>
<span class="line"><span>           v = _frame-&gt;names()-&gt;get(op_arg);</span></span>
<span class="line"><span>           _frame-&gt;globals()-&gt;put(v, POP());</span></span>
<span class="line"><span>           break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>受影响的还有 LOAD_NAME 指令。</p><p>LOAD_GLOBAL 只会去全局变量表里读取变量，但是 LOAD_NAME 却依赖于 LEGB 规则。也就是说，遇到 LOAD_NAME 时，执行器应该先去局部变量表里尝试读取变量，如果查找不到，再尝试去全局变量表里读取，如果还查找不到，就应该去 builtin 表里读取。这里没有考虑闭包变量的情况，这是因为在 Python 中，有专用的特殊字节码来处理闭包变量，我们会在后面的课程里实现相应的机制。</p><p>LOAD_NAME 的实现也要相应地发生变化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::LOAD_NAME:</span></span>
<span class="line"><span>               v = _frame-&gt;names()-&gt;get(op_arg);</span></span>
<span class="line"><span>               w = _frame-&gt;locals()-&gt;get(v);</span></span>
<span class="line"><span>               if (w != Universe::HiNone) {</span></span>
<span class="line"><span>                   PUSH(w);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               w = _frame-&gt;globals()-&gt;get(v);</span></span>
<span class="line"><span>               if (w != Universe::HiNone) {</span></span>
<span class="line"><span>                   PUSH(w);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               PUSH(Universe::HiNone);</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="builtin-变量" tabindex="-1">builtin 变量 <a class="header-anchor" href="#builtin-变量" aria-label="Permalink to &quot;builtin 变量&quot;">​</a></h2><p>Python 虚拟机里有很多内建变量，这些变量不需要任何定义，赋值就可以直接使用了。例如print、zip 等函数，以及 list、dict 等数据结构。</p><p>实际上，这些内建变量我们已经在虚拟机的内部实现中使用了。但如果想在 Python 代码里使用，我们还有一步工作，就是将这些变量在虚拟机的初始化阶段就放到 builtin 变量表中。</p><p>由于 builtin 变量表在整个虚拟机实例中只有一份，所以我们可以使用 static 关键字来修饰它，并且把它放在 Interpreter 类中。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">interpreter.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Interpreter {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    _builtins;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   FrameObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                  _frame;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">interpreter.cpp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Interpreter::Interpreter() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _builtins = new Map</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _builtins</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">put(new HiString(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;True&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),     Universe::HiTrue);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _builtins</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">put(new HiString(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;False&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),    Universe::HiFalse);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _builtins</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">put(new HiString(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;None&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),     Universe::HiNone);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _builtins</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">put(new HiString(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;print&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),    Universe::HiNone);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>通过以上代码，我们就把 print 变量与内建的 None 对象联系起来了。当然，这里先把 print 变量放在内建变量表里并没有什么用，只是为了说明内建变量表的结构而已。等以后，我们实现</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>了 native 方法，再来修改这里的实现，将真正实现打印功能的方法与 &quot;print&quot; 变量绑定在一</span></span></code></pre></div><p>起。</p><p>同时，None、True 和 False 也都被搬到内建变量表里了，虽然在 Python 3 时代，内建变量表里是否包含这三个变量已经不重要了，但我们为了逻辑实现的一致性，还是把它们放到这里了。</p><p>构建完内建变量表以后，虚拟机还要在 LOAD_NAME 里增加一些逻辑，当执行器在全局变量中查找失败以后，应该继续在 _builtins 表里查找。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::LOAD_NAME:</span></span>
<span class="line"><span>               v = _frame-&gt;names()-&gt;get(op_arg);</span></span>
<span class="line"><span>               w = _frame-&gt;locals()-&gt;get(v);</span></span>
<span class="line"><span>               if (w != Universe::HiNone) {</span></span>
<span class="line"><span>                   PUSH(w);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               w = _frame-&gt;globals()-&gt;get(v);</span></span>
<span class="line"><span>               if (w != Universe::HiNone) {</span></span>
<span class="line"><span>                   PUSH(w);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               w = _builtins-&gt;get(v);</span></span>
<span class="line"><span>               if (w != Universe::HiNone) {</span></span>
<span class="line"><span>                   PUSH(w);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               PUSH(Universe::HiNone);</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一切准备完毕以后，我们来看一个综合的测试用例。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> foo() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">is</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> None</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>在这个例子里，我们用到了函数定义、函数调用、None、True 等内建变量，这些功能，虚拟机都已经实现了。</p><p>还有一个 is 比较是没有实现的。is 的比较和大于、小于这些比较的实现原理是完全一样的。我们只需要在 COMPARE_OP 的逻辑里增加 is 的比较操作就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define HI_TRUE       Universe::HiTrue</span></span>
<span class="line"><span>#define HI_FALSE      Universe::HiFalse</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::COMPARE_OP:</span></span>
<span class="line"><span>               w = POP();</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>       switch(op_arg) {</span></span>
<span class="line"><span>               case ByteCode::IS:</span></span>
<span class="line"><span>                   if (v == w)</span></span>
<span class="line"><span>                       PUSH(HI_TRUE);</span></span>
<span class="line"><span>                   else</span></span>
<span class="line"><span>                       PUSH(HI_FALSE);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               case ByteCode::IS_NOT:</span></span>
<span class="line"><span>                   if (v == w)</span></span>
<span class="line"><span>                       PUSH(HI_TRUE);</span></span>
<span class="line"><span>                   else</span></span>
<span class="line"><span>                       PUSH(HI_FALSE);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               default:</span></span>
<span class="line"><span>                   printf(&quot;Error: Unrecognized compare op %d\\n&quot;, op_arg);</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，这个测试就可以成功运行了。到这里，函数所使用的变量及其作用域，我们就全部介绍完了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>引入函数以后，也引入了新的命名空间，从而产生了全局变量、局部变量、闭包变量、内建变量这些概念。</p><p>Python 按照一定的规则来访问变量，即先查找局部变量，如果找不到，就继续查找闭包变量，如果还是找不到，就继续查找全局变量、内建变量。这种访问规则，被称为 LEGB 规则。根据这个规则，我们添加了访问全局变量的机制，修改了 LOAD_NAME 的查找逻辑，并且准备好了内建变量表。</p><p>函数的功能进一步完善，但是当前函数还是不能接受参数。不能接受参数的函数就失去了它本来的意义。所以下节课我们就来实现函数的另一个重要功能：传递参数。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请你在 Python 的 REPL 环境中，使用 &quot;print(dir(__builtins__))&quot; 查看 CPython 中</span></span></code></pre></div><p>有哪些内建变量，还可以进一步对比一下 Python 2.7 和 Python 3.8 的内建变量表有什么不同。欢迎你把你比对后的结果分享到评论区，也欢迎你把这节课的内容分享给其他朋友，我们下节课再见！</p>`,79)])])}const g=a(l,[["render",t]]);export{d as __pageData,g as default};
