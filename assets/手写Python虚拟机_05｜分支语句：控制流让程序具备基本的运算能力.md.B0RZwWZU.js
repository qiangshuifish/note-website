import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"05 | 分支语句：控制流让程序具备基本的运算能力","description":"","frontmatter":{},"headers":[{"level":2,"title":"分支语句","slug":"分支语句","link":"#分支语句","children":[]},{"level":2,"title":"实现比较指令","slug":"实现比较指令","link":"#实现比较指令","children":[]},{"level":2,"title":"实现跳转功能","slug":"实现跳转功能","link":"#实现跳转功能","children":[]},{"level":2,"title":"实现 True、False 和 None","slug":"实现-true、false-和-none","link":"#实现-true、false-和-none","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"手写Python虚拟机/05｜分支语句：控制流让程序具备基本的运算能力.md","filePath":"手写Python虚拟机/05｜分支语句：控制流让程序具备基本的运算能力.md","lastUpdated":1795557449000}'),e={name:"手写Python虚拟机/05｜分支语句：控制流让程序具备基本的运算能力.md"};function l(t,s,h,c,r,k){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_05-分支语句-控制流让程序具备基本的运算能力" tabindex="-1">05 | 分支语句：控制流让程序具备基本的运算能力 <a class="header-anchor" href="#_05-分支语句-控制流让程序具备基本的运算能力" aria-label="Permalink to &quot;05 | 分支语句：控制流让程序具备基本的运算能力&quot;">​</a></h1><p>你好，我是海纳。</p><p>上一节课，我们让虚拟机成功地加载并执行了标准 Python3.8 版本的字节码，我知道你已经迫不及待想继续实现对象系统，以支持整数和字符串等更多的数据类型了。但只实现完备的对象系统并不能让虚拟机看上去功能更加强大，而控制流却可以让我们做更多的测试，例如，支持了分支和循环语句以后，就可以实现一个计算 fibonacci 数列的程序。所以我们决定实现了控制流之后，再重新思考对象系统。</p><p>典型的两种控制流结构是分支选择和循环结构，这节课我们先研究分支语句是如何实现的。</p><h2 id="分支语句" tabindex="-1">分支语句 <a class="header-anchor" href="#分支语句" aria-label="Permalink to &quot;分支语句&quot;">​</a></h2><p>为了研究 Python 字节码是如何表达分支结构的，我们先创建一个包含分支语句的测试文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># test_if.py</span></span>
<span class="line"><span>if 2 &gt; 1:</span></span>
<span class="line"><span>   print(2)</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>   print(1)</span></span>
<span class="line"><span>print(3)</span></span></code></pre></div><p>使用以下命令，把上述文件编译成 pyc 文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python -m compileall test_if.py</span></span></code></pre></div><p>然后通过 show_file.py 查看这个文件结构，得到如下结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>code</span></span>
<span class="line"><span>  argcount 0</span></span>
<span class="line"><span>  nlocals 0</span></span>
<span class="line"><span>  stacksize 2</span></span>
<span class="line"><span>  flags 0040</span></span>
<span class="line"><span>  code</span></span>
<span class="line"><span>     640064016b04721265006400830101006e08650064018301010065006402</span></span>
<span class="line"><span>     8301010064035300</span></span>
<span class="line"><span> 1           0 LOAD_CONST               0 (2)</span></span>
<span class="line"><span>             2 LOAD_CONST               1 (1)</span></span>
<span class="line"><span>             4 COMPARE_OP               4 (&gt;)</span></span>
<span class="line"><span>             6 POP_JUMP_IF_FALSE       18</span></span>
<span class="line"><span> 2           8 LOAD_NAME                0 (print)</span></span>
<span class="line"><span>            10 LOAD_CONST               0 (2)</span></span>
<span class="line"><span>            12 CALL_FUNCTION            1</span></span>
<span class="line"><span>            14 POP_TOP</span></span>
<span class="line"><span>            16 JUMP_FORWARD             8 (to 26)</span></span>
<span class="line"><span> 4     &gt;&gt;   18 LOAD_NAME                0 (print)</span></span>
<span class="line"><span>            20 LOAD_CONST               1 (1)</span></span>
<span class="line"><span>            22 CALL_FUNCTION            1</span></span>
<span class="line"><span>            24 POP_TOP</span></span>
<span class="line"><span> 6     &gt;&gt;   26 LOAD_NAME                0 (print)</span></span>
<span class="line"><span>            28 LOAD_CONST               2 (3)</span></span>
<span class="line"><span>            30 CALL_FUNCTION            1</span></span>
<span class="line"><span>            32 POP_TOP</span></span>
<span class="line"><span>            34 LOAD_CONST               3 (None)</span></span>
<span class="line"><span>            36 RETURN_VALUE</span></span>
<span class="line"><span>  consts</span></span>
<span class="line"><span>     2</span></span>
<span class="line"><span>     1</span></span>
<span class="line"><span>     3</span></span>
<span class="line"><span>     None</span></span>
<span class="line"><span>  names (&#39;print&#39;,)</span></span>
<span class="line"><span>  varnames ()</span></span>
<span class="line"><span>  freevars ()</span></span>
<span class="line"><span>  cellvars ()</span></span>
<span class="line"><span>  filename &#39;test_if.py&#39;</span></span></code></pre></div><p>我们看到代码中所使用的三个整数都已经放在了 consts 表中。反编译出来的字节码部分则出现了三个尚未支持的字节码，分别是 COMPARE_OP、POP_JUMP_IF_FALSE 和JUMP_FORWARD。从 Python 虚拟机的标准文档或者 CPython 的源代码里都可以查到这三个字节码的编号，在 bytecode.hpp 里添加它们。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   /* Comparison operator */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> unsigned</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> char COMPARE_OP </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 107</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   /* Number of bytes to skip */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> unsigned</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> char JUMP_FORWARD </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 110</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> unsigned</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> char POP_JUMP_IF_FALSE </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 114</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>接下来，我们重点看看这三个字节码分别是如何实现的。</p><h2 id="实现比较指令" tabindex="-1">实现比较指令 <a class="header-anchor" href="#实现比较指令" aria-label="Permalink to &quot;实现比较指令&quot;">​</a></h2><p>第一个要处理的字节码是 COMPARE_OP，第 3 节课我们曾经提到字节码操作数编号大于90 的都是带参数的。COMPARE_OP 的编号是 107，所以它是带参数的。在这节课的例子里，它的参数是 4（反编译结果的第 11 行）。这个参数所代表的是比较操作符的类型，比如 4就代表大于，0 代表小于，2 代表等于。你可以看一下完整的比较操作所对应的类型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   enum COMPARE {</span></span>
<span class="line"><span>       LESS = 0,</span></span>
<span class="line"><span>       LESS_EQUAL,</span></span>
<span class="line"><span>       EQUAL,</span></span>
<span class="line"><span>       NOT_EQUAL,</span></span>
<span class="line"><span>       GREATER,</span></span>
<span class="line"><span>       GREATER_EQUAL</span></span>
<span class="line"><span>   };</span></span></code></pre></div><p>接下来就可以在 Interpreter 里添加 COMPARE_OP 的实现了。在此之前，我需要引入一个小的代码重构。为了使代码更简洁，我在代码里定义了宏 PUSH 和 POP，这样可以避免大量的手动输入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// runtime/interpreter.cpp</span></span>
<span class="line"><span>#define PUSH(x)  _stack-&gt;add((x))</span></span>
<span class="line"><span>#define POP()    _stack-&gt;pop()</span></span></code></pre></div><p>最后，我们就可以在 Interpreter 中实现我们这节课提到的三个字节码了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>           case ByteCode::COMPARE_OP:</span></span>
<span class="line"><span>               w = POP();</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>               switch(op_arg) {</span></span>
<span class="line"><span>               case ByteCode::GREATER:</span></span>
<span class="line"><span>                   PUSH(v-&gt;greater(w));</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               case ByteCode::LESS:</span></span>
<span class="line"><span>                   PUSH(v-&gt;less(w));</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               case ByteCode::EQUAL:</span></span>
<span class="line"><span>                   PUSH(v-&gt;equal(w));</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               case ByteCode::NOT_EQUAL:</span></span>
<span class="line"><span>                   PUSH(v-&gt;not_equal(w));</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               case ByteCode::GREATER_EQUAL:</span></span>
<span class="line"><span>                   PUSH(v-&gt;ge(w));</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               case ByteCode::LESS_EQUAL:</span></span>
<span class="line"><span>                   PUSH(v-&gt;le(w));</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               default:</span></span>
<span class="line"><span>                   printf(&quot;Error: Unrecognized compare op %d\\n&quot;, op_arg);</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               break;</span></span></code></pre></div><p>在这段代码中，我们为每一种比较操作都提供了一个方法，又因为各个对象的比较方式各不相同，所以每个对象都会有自己的实现。要完成这个功能，这些比较方法必须和 print 方法一样，是虚函数，也就是必须要使用 virtual 关键字进行修饰。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HiObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> add(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x){}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> greater  (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> less     (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> equal    (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> not_equal(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ge       (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> le       (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>在 HiInteger 类中，我们必须提供用于整数比较的方法，也就是在子类中覆写父类的方法。在这里，我只列出大于操作所对应的 greater 方法，而等于、不等于、小于等操作所对应的方法，你可以自己补充。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* HiInteger::greater(HiObject* x) {</span></span>
<span class="line"><span>   if (_value &gt; ((HiInteger*)x)-&gt;_value)</span></span>
<span class="line"><span>       return new HiInteger(1);</span></span>
<span class="line"><span>   else</span></span>
<span class="line"><span>       return new HiInteger(0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意这个方法的返回值，在 Python 中 True 和 False 都是对象，所以在这里，我们定义用于比较操作的几个方法的时候，它的返回值也是 HiObject 类型的指针。但现在我们的虚拟机对象类型还不完整，没有真正的 True 和 False 对象，就临时使用 0 代表 False，使用 1 代表True。这样的替代虽然并不完全符合 Python 语义，但就目前而言已经足够了。</p><h2 id="实现跳转功能" tabindex="-1">实现跳转功能 <a class="header-anchor" href="#实现跳转功能" aria-label="Permalink to &quot;实现跳转功能&quot;">​</a></h2><p>在刚开始实现执行器的时候，我就解释过 pc 变量的含义，它是一个程序计数器，代表虚拟机当前执行到哪条指令了。当控制流因为分支选择而发生跳转的时候，本质上就是改变这个程序计数器，让它不再顺序向下取指，而是跳转到另外一个目标地址，去把那里的指令取出来执行。所以，所有的跳转指令本质上就是对程序计数器的干预，使它指向我们期望的地址。</p><p>然后再考察 POP_JUMP_IF_FALSE 的参数，在这节课的例子里，它是 18。这个参数代表的是绝对地址，也就是字节码前面的编号。你看一下地址编号为 18 的那条指令，反编译工具已经很贴心地帮我们标记了 “&gt;&gt;” 符号，地址为 18 的那条 LOAD_NAME 指令就是我们要跳转的目标地址。经过分析，POP_JUMP_IF_FALSE 的实现就非常简单了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>           case ByteCode::POP_JUMP_IF_FALSE:</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>               if (((HiInteger*)v)-&gt;value() == 0)</span></span>
<span class="line"><span>                   pc = op_arg;</span></span>
<span class="line"><span>               break;</span></span></code></pre></div><p>上述实现只做了一个动作：当栈顶值为 0 时，把 pc 的值修改成目标地址（第 4 行）。刚刚我们讲到，现阶段我们用值为 0 的整数代表 False，所以当栈顶值为 False 的时候，就跳转到参数所指定的目标地址，如果是 True，就什么也不做，继续执行下面的语句。</p><p>三个字节码，我们已经实现了两个，还剩下最后一个：JUMP_FORWARD。这个字节码其实是最简单的，它也是带参数的，它的参数是一个无符号正数，代表相对地址，也就是用当前的pc 加上这个参数才是要跳转的目标地址。就像它的名称所指示的，这个字节码只能向前跳转，所以它的参数一定是一个正数。你可以看一下它的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>           case ByteCode::JUMP_FORWARD:</span></span>
<span class="line"><span>               pc += op_arg;</span></span>
<span class="line"><span>               break;</span></span></code></pre></div><p>到这里，我们就把分支结构所需要的字节码全都实现了。现在可以编译执行一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src/build# make all</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>src/build# ./vm/pvm test_if.pyc</span></span>
<span class="line"><span>magic number is 0xa0df303</span></span>
<span class="line"><span>moddate is 0x5b66d766</span></span>
<span class="line"><span>flags is 0x40</span></span>
<span class="line"><span>parse OK!</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span></code></pre></div><p>我们看到，结果是打印出了 2 和 3，这个结果符合预期。你不妨尝试一下等于、小于、不等于等其他比较操作，看看结果是否正确。</p><h2 id="实现-true、false-和-none" tabindex="-1">实现 True、False 和 None <a class="header-anchor" href="#实现-true、false-和-none" aria-label="Permalink to &quot;实现 True、False 和 None&quot;">​</a></h2><p>在前面的实现中，我们要使用 True 和 False 时，都是使用整型的 1 和 0 代替的。而且每次使用的时候，都要重新创建一个整型对象。实际上，整个虚拟机中只需要一个唯一的 True 对象和唯一的 False 对象。要实现全局唯一，我们自然就会想到 static 变量。除了 True 和False，还有一个是 None 对象，它也是全局唯一的。</p><p>类似 True 和 False 这种全局唯一变量，未来还会遇到很多，所以我们把所有的这些变量都集中起来放到一个类中。我们不妨把这个类叫作 Universe，你可以看一下它的定义。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">universe.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Universe {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static HiInteger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HiTrue;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static HiInteger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HiFalse;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HiNone;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static void genesis();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static void destroy();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>在 Universe 类中定义了三个静态变量，分别代表 True、False 和 None，又定义了两个方法，一个名为 Genesis，意思是创世纪，就像宇宙的诞生，在这个函数中创建虚拟机最原始的对象结构。虚拟机里的所有对象以后都会以这个方法为起点。另一个是 destroy，顾名思义，这个方法是在虚拟机退出的时候调用，用来销毁对象，释放资源，清理空间。下面我们看一下这个类的具体实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// runtime/universe.cpp</span></span>
<span class="line"><span>HiInteger* Universe::HiTrue   = NULL;</span></span>
<span class="line"><span>HiInteger* Universe::HiFalse  = NULL;</span></span>
<span class="line"><span>HiObject*  Universe::HiNone   = NULL;</span></span>
<span class="line"><span>void Universe::genesis() {</span></span>
<span class="line"><span>   HiTrue       = new HiInteger(1);</span></span>
<span class="line"><span>   HiFalse      = new HiInteger(0);</span></span>
<span class="line"><span>   HiNone       = new HiObject();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void Universe::destroy() {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先，是 True、False 和 None 对象的初始化。static 变量在源文件中定义初始化，而不是在头文件中，是为了避免多个目标文件的链接冲突。我们在 genesis 方法里做真正的初始化，这样做的好处是，我们对于对象初始化的时机有绝对的掌控权，而不是交给编译器去决定。也就是说，只有我们明确地调用 genesis 的时候，对象才会真正开始初始化，这样我们就有机会在对象初始化之前做一些额外的工作。</p><p>实际上，这里完全可以把 HiTrue 和 HiFalse 这两个变量初始化为任意对象。对于虚拟机来说，真正有意义的是它们的地址，而不是它们的值。也就是说，这里只要指定一个绝对地址，然后说它就是 True，或者说它就是 None 就可以。</p><p>经过这样的改进，BinaryFileParser 在解析常量表的时候，就可以把字母“N”解析成 HiNone，而不是 NULL 指针。以此类推，HiInteger 的 greater 方法，也不用每次执行都创建一个新的对象，只要返回一个全局唯一的 True 和 False 就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// use HiTrue and HiFalse instead of creating a new</span></span>
<span class="line"><span>// object everytime.</span></span>
<span class="line"><span>HiObject* HiInteger::greater(HiObject* x) {</span></span>
<span class="line"><span>   if (_value &gt; ((HiInteger*)x)-&gt;_value)</span></span>
<span class="line"><span>       //return new HiInteger(1);</span></span>
<span class="line"><span>       return Universe::HiTrue;</span></span>
<span class="line"><span>   else</span></span>
<span class="line"><span>       //return new HiInteger(0);</span></span>
<span class="line"><span>       return Universe::HiFalse;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其他的方法，比如 less、equal 等都有相同的改动。</p><p>还有一处修改是要注意的，interpreter 中对 JUMP_IF_FALSE 的实现，在判断 False 时，我们也不用再使用强制类型转换了，而是换成更加简单的地址比较。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>            case ByteCode::POP_JUMP_IF_FALSE:</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>       //if (((HiInteger*)v)-&gt;value() == 0)</span></span>
<span class="line"><span>               if (v == Universe::HiFalse)</span></span>
<span class="line"><span>                   pc = op_arg;</span></span>
<span class="line"><span>               break;</span></span></code></pre></div><p>到这里，分支操作所需要的比较和跳转功能就全部实现了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>控制流的作用是控制程序的执行顺序，主要包含分支和循环两种结构，这节课我们重点介绍了分支语句的实现原理。</p><p>比较指令和跳转指令是实现分支语句的基础。Python 字节码中用于比较判断的指令是COMPARE_OP，这节课的第二部分我们实现了这个字节码。每个比较指令结果都是布尔值True 或者 False。在第二部分，我们临时使用了整型变量 1 和 0 来代替。后面我们又使用全局变量补全了 True、False 和 None 的实现。</p><p>用于跳转的指令，这节课中出现两条，第一条是 POP_JUMP_IF_FALSE，它的含义是取出栈顶元素并判断，如果栈顶元素是 True，就不发生跳转，如果栈顶元素是 False，就跳转到这条字节码的参数所指定的目标地址，所以这是一条绝对跳转指令。</p><p>这节课出现的第二条跳转指令是 JUMP_FORWARD。执行这条指令不需要进行条件判断，但是它的参数却有些不一样。这条字节码的参数是目标地址相对于当前指令地址的偏移量，计算目标地址的时候，需要用当前地址加上这个偏移量。</p><p>实现了这些功能，我们这节课开头的例子就能正确执行了。成功地实现分支语句后，下节课我们继续实现循环语句。</p><p>注：点击链接查看课程代码地址</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>None 也可以用于条件判断，Python 语言是如何处理它的呢？</p><p>如果执行我给出的这段代码，它的结果会是什么？我们的虚拟机又该如何修改，来支持这个特性呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if None:</span></span>
<span class="line"><span>   print(0)</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>   print(1)</span></span></code></pre></div><p>欢迎你把你的答案分享到评论区，也欢迎你把这节课的内容分享给其他朋友，我们下节课再见！</p>`,62)])])}const g=a(e,[["render",l]]);export{o as __pageData,g as default};
