import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"28 | 异常（下）：处理finally子句和traceback对象","description":"","frontmatter":{},"headers":[{"level":2,"title":"实现 END_FINALLY","slug":"实现-end-finally","link":"#实现-end-finally","children":[]},{"level":2,"title":"Traceback 对象","slug":"traceback-对象","link":"#traceback-对象","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"手写Python虚拟机/28｜异常（下）：处理finally子句和traceback对象.md","filePath":"手写Python虚拟机/28｜异常（下）：处理finally子句和traceback对象.md","lastUpdated":1795557449000}'),l={name:"手写Python虚拟机/28｜异常（下）：处理finally子句和traceback对象.md"};function t(e,s,h,k,E,c){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_28-异常-下-处理finally子句和traceback对象" tabindex="-1">28 | 异常（下）：处理finally子句和traceback对象 <a class="header-anchor" href="#_28-异常-下-处理finally子句和traceback对象" aria-label="Permalink to &quot;28 | 异常（下）：处理finally子句和traceback对象&quot;">​</a></h1><p>你好，我是海纳。</p><p>上一节课，我们使用 Python 源码实现了 Exception 类，从而构建起了异常对象的继承体系，同时也实现了异常对象的匹配功能。在这个基础上，我们进一步实现了用于处理异常控制流的几条字节码。</p><p>第一条重要的字节码是 SETUP_FINALLY，它的作用是创建一个 Block，指定了如果在执行try 语句的过程中发生异常应该跳转到哪里执行。第二条是 CALL_FINALLY，它的作用是如果try 语句正常结束了，就跳转进 finally 子句执行。这节课，我们就来实现整个异常控制流的最后一条重要的指令，就是 END_FINALLY，我们要在 END_FINALLY 中增加恢复异常的逻辑。从而让解释器可以在退出函数栈帧的时候还能正确地维护异常对象。</p><h2 id="实现-end-finally" tabindex="-1">实现 END_FINALLY <a class="header-anchor" href="#实现-end-finally" aria-label="Permalink to &quot;实现 END_FINALLY&quot;">​</a></h2><p>就像之前分析的，END_FINALLY 的主要作用是结束 finally 子句的执行。根据上节课说的进入finally 子句的三种情况，我们这里分别做了处理，你可以看一下具体实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::eval_frame() {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::END_FINALLY: {</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>               long long t = (long long)v();</span></span>
<span class="line"><span>               if (t == 0) {</span></span>
<span class="line"><span>                   // do nothing.</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               else if (t &amp; 0x1) {</span></span>
<span class="line"><span>                   _frame-&gt;set_pc(t &gt;&gt; 1);</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               else {</span></span>
<span class="line"><span>                   _exception_class = v;</span></span>
<span class="line"><span>                   _pending_exception = POP();</span></span>
<span class="line"><span>                   _trace_back = POP();</span></span>
<span class="line"><span>                   _int_status = IS_EXCEPTION;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由此可见，END_FINALLY 的实现正好对应了三种情况，第一种情况对应 BEGIN_FINALLY，这个时候栈顶上只有一个数字 0，所以遇到这种情况，就什么都不用做（第 11 到 13 行）。</p><p>第二种情况栈上的值是一个地址，这对应了 CALL_FINALLY，这种情况下，只要把解释器的pc 值修改为栈上的值就可以了（第 14 至 16 行）。</p><p>最后一种是发生异常了，通过 SETUP_FINALLY Block 进入的，这种情况下，当 finally 子句执行完以后，就要从栈上恢复异常状态，进行进一步的处理（第 17 至 22 行）。所谓进一步处理， 指的是有可能更外层还有 except 子句，也有可能引发函数退栈，如果是在主文件中，还有可能直接导致进程退出。</p><p>最后，我们再把一些用于处理异常时的栈状态的字节码补齐，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>           case ByteCode::POP_EXCEPT: {</span></span>
<span class="line"><span>               Block b = _frame-&gt;pop_block();</span></span>
<span class="line"><span>               assert(b._type == ByteCode::EXCEPT_HANDLER);</span></span>
<span class="line"><span>               assert(STACK_LEVEL() &gt;= b._level + 3 &amp;&amp;</span></span>
<span class="line"><span>                   STACK_LEVEL() &lt;= b._level + 4);</span></span>
<span class="line"><span>               _exception_class = POP();</span></span>
<span class="line"><span>               _pending_exception = POP();</span></span>
<span class="line"><span>               _trace_back = POP();</span></span>
<span class="line"><span>               _int_status = IS_EXCEPTION;</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>           }</span></span></code></pre></div><p>POP_EXCEPT 是明确地知道当前解释器已经发生了异常情况时，在 except 子句或者 finally子句中用来恢复异常所使用的。所以它的功能只是 END_FINALLY 的一部分。</p><p>到这里，我们就完成了基本的异常处理机制。你可以试着运行一下这节课开始的那个例子，再测试一下异常和 finally 子句的组合是否能够正常执行。</p><p>接下来，我们关注异常处理的最后一个对象，那就是用于回栈的 Traceback 对象。</p><h2 id="traceback-对象" tabindex="-1">Traceback 对象 <a class="header-anchor" href="#traceback-对象" aria-label="Permalink to &quot;Traceback 对象&quot;">​</a></h2><p>Traceback 是指发生异常时，用于记录异常栈信息的一种机制。我们用一个例子演示一下。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(a):</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   b </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   bar(a, b)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(a, b):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   raise</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Exception</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;something wrong!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">foo(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>使用 Python 执行这个例子，结果是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Traceback (most recent call last):</span></span>
<span class="line"><span> File &quot;test_tb.py&quot;, line 8, in &lt;​module&gt;</span></span>
<span class="line"><span>   foo(1)</span></span>
<span class="line"><span> File &quot;test_tb.py&quot;, line 3, in foo</span></span>
<span class="line"><span>   bar(a, b)</span></span>
<span class="line"><span> File &quot;test_tb.py&quot;, line 6, in bar</span></span>
<span class="line"><span>   raise Exception(&quot;something wrong!&quot;)</span></span>
<span class="line"><span>Exception: something wrong!</span></span></code></pre></div><p>执行到 bar 函数中的语句时，调用栈是由 main 调用了 foo 方法，再由 foo 调用了 bar 方法。</p><p>如果这个时候发生了异常，并且异常没有被 except 语句处理掉，那么就会使用默认的处理方式，也就是退回到上一帧。如果已经退到了最后一帧，就打印 Traceback，并且退出程序。</p><p>我们先从最基本的结构开始实现，首先要实现 Traceback 类型，可以考虑使用 C++ 实现，也可以使用 Python 实现。因为 Traceback 要访问栈帧，从栈帧中获取信息，所以使用 C++ 在虚拟机内部实现会更方便一些。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StackElementKlass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public Klass {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   StackElementKlass() {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static StackElementKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _instance;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static StackElementKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> get_instance();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual size_t size();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void oops_do(OopClosure</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> f, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> obj);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StackElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public HiObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">friend StackElementKlass;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _file_name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _func_name;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         _line_no;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   StackElement(HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fname, HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mname, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> lineno);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> TracebackKlass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public Klass {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   TracebackKlass() {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static TracebackKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _instance;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static TracebackKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> get_instance();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual size_t size();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void oops_do(OopClosure</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> f, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> obj);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Traceback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public HiObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">friend </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> TracebackKlass;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _stack_elements;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Traceback();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   void record_frame(FrameObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> frame);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>与其他继承自 HiObject 的类型相似，Traceback 类型也有自己的 Klass，在 Klass 里增加 GC接口，实现 print 方法。Traceback 中定义了一个列表 _stack_elements，其中记录着多个StackElement。而 StackElement 中则存着栈帧的信息。</p><p>在刚刚那个例子中，我们已经观察到了 Traceback 的打印是由多帧组成的，我们把每一帧的信息都存到 StackElement 这个结构中。其中最重要的三个信息就是文件名、函数名和当前行数。可以看到，在 StackElement 中，我们分别加以定义。</p><p>其他地方就不再解释了，创建对象你应该都已经比较熟悉了。在异常处理的过程中，一直跟在exception_class 后面的 Traceback 对象，终于在这里补齐了。</p><p>如果解释器的状态不是 OK，并且当前栈帧的 block_stack 为空，也就是没有其他的 Block了，我们就可以离开栈帧了。所以这里可以在处理异常结束的地方增加离开函数栈帧的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::eval_frame() {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>       } // end of switch</span></span>
<span class="line"><span>   // handle EXCEPTION with loop stack is not empty</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>       // has pending exception and no handler found, unwind stack.</span></span>
<span class="line"><span>       if (_int_status == IS_EXCEPTION &amp;&amp; _frame-&gt;blocks()-&gt;length() == 0) {</span></span>
<span class="line"><span>           _trace_back-&gt;as&lt;​Traceback&gt;()-&gt;record_frame(_frame);</span></span>
<span class="line"><span>           if (_frame-&gt;is_first_frame() ||</span></span>
<span class="line"><span>                   _frame-&gt;is_entry_frame())</span></span>
<span class="line"><span>               return;</span></span>
<span class="line"><span>           leave_frame();</span></span>
<span class="line"><span>           goto error_handling;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第 13 行使用了 Traceback 的 record_frame 方法来记录当前栈帧。你可以看一下它的具体实现。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Traceback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">record_frame</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(FrameObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> frame) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _stack_elements</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">append</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StackElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               frame</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               frame</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">func_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               frame</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lineno</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> FrameObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _codes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">_file_name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> FrameObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">func_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _codes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">_co_name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">int </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FrameObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lineno</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   int pc_offset </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   int line_no </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _codes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">_lineno;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> char</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">* lnotab </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _codes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">_notable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   int length </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _codes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">_notable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (int i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> length; i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       pc_offset </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> lnotab[i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (pc_offset </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _pc)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> line_no;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       line_no </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> lnotab[i];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> line_no;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>_stack_elements 是一个列表，它的每一个元素都是一个 StackElement 实例。其中记录了这个栈帧所对应的函数名和文件名，最重要的一个信息是行号。也就是说提示我们问题发生在哪一行。</p><p>行号的信息也存储在 CodeObject 中，我们以前还从来没有使用过。栈帧中只保留了 pc 的信息，它代表的是字节码的位置，而不是源代码的位置。要把字节码位置转换成源代码位置，就要使用 CodeObject 的 lineno 和 notable 来进行转换。</p><p>lineno 代表了这个函数源代码的起始行号，notable 则描述了字节码与源文件的行号对应关系。</p><p>我们来看一个具体的例子。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;hello&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(a)</span></span></code></pre></div><p>通过 show_file 工具查看 foo 方法的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>     code</span></span>
<span class="line"><span>        argcount 0</span></span>
<span class="line"><span>        nlocals 1</span></span>
<span class="line"><span>        stacksize 2</span></span>
<span class="line"><span>        flags 0043</span></span>
<span class="line"><span>        code 64017d0074007c008301010064005300</span></span>
<span class="line"><span> 4           0 LOAD_CONST               1 (2)</span></span>
<span class="line"><span>             2 STORE_FAST               0 (a)</span></span>
<span class="line"><span> 5           4 LOAD_GLOBAL              0 (print)</span></span>
<span class="line"><span>             6 LOAD_FAST                0 (a)</span></span>
<span class="line"><span>             8 CALL_FUNCTION            1</span></span>
<span class="line"><span>            10 POP_TOP</span></span>
<span class="line"><span>            12 LOAD_CONST               0 (None)</span></span>
<span class="line"><span>            14 RETURN_VALUE</span></span>
<span class="line"><span>        consts</span></span>
<span class="line"><span>           None</span></span>
<span class="line"><span>           2</span></span>
<span class="line"><span>        names (&#39;print&#39;,)</span></span>
<span class="line"><span>        varnames (&#39;a&#39;,)</span></span>
<span class="line"><span>        freevars ()</span></span>
<span class="line"><span>        cellvars ()</span></span>
<span class="line"><span>        filename &#39;/Users/dandan/hinusDocs/gitee/pythonvm/build/htb.py&#39;</span></span>
<span class="line"><span>        name &#39;foo&#39;</span></span>
<span class="line"><span>        firstlineno 3</span></span>
<span class="line"><span>        lnotab 00010401</span></span></code></pre></div><p>注意到 firstlineno 的值是 3 ，这说明 foo 方法是在第 3 行开始被定义的。</p><p>lnotab 每两位是一个独立的数字，每两个数字为一组，代表源代码行号和字节码行号的变化。例如，00010601 可以拆分为 ([00, 01], [06, 01]) 这样的结构。字节码的起始偏移是 0，而源代码的起始行号是 3。[00, 01] 代表了字节码偏移为 0+0 的地方对应的源代码是 3+1，也就是4。</p><p>第二组，[06, 01] 代表了字节码偏移为 0+6 的地方对应的源代码是 4+1，也就是 5。就是说，在 lnotab 里，并不是直接把字节码偏移与源代码行号的对应关系记录下来，而是记录当源代码行号发生变化时，字节码偏移发生了多少变化。</p><p>明白了这个公式以后，FrameObject 的 lineno 方法也就清楚了。再回过头来看这个方法的实现，我们每次通过不断地改变 pc 偏移量，并且检查当前的 pc 是否落在两次变化之间，来确定当前的 pc 所对应的源代码行号。</p><p>如果在退栈的过程中，一直没有遇到可以处理这个异常的 except 语句，这个异常就会导致栈帧回退到最后一帧。在这里，虚拟机要提供一个默认的实现：打印这个 traceback。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span>   _frame-&gt;locals()-&gt;put(ST(name), new HiString(&quot;__main__&quot;));</span></span>
<span class="line"><span>   eval_frame();</span></span>
<span class="line"><span>   if (_int_status == IS_EXCEPTION) {</span></span>
<span class="line"><span>       _int_status = IS_OK;</span></span>
<span class="line"><span>       _trace_back-&gt;print();</span></span>
<span class="line"><span>       _pending_exception-&gt;print();</span></span>
<span class="line"><span>       printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>       _trace_back = NULL;</span></span>
<span class="line"><span>       _pending_exception = NULL;</span></span>
<span class="line"><span>       _exception_class = NULL;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   destroy_frame();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void TracebackKlass::print(HiObject* x) {</span></span>
<span class="line"><span>   Traceback* tbx = (Traceback*)x;</span></span>
<span class="line"><span>   printf(&quot;Traceback (most recent call last):\\n&quot;);</span></span>
<span class="line"><span>   for (int i = tbx-&gt;_stack_elements-&gt;size() - 1; i &gt;= 0; i--) {</span></span>
<span class="line"><span>       tbx-&gt;_stack_elements-&gt;get(i)-&gt;print();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void StackElementKlass::print(HiObject* x) {</span></span>
<span class="line"><span>   StackElement* xse = (StackElement*)x;</span></span>
<span class="line"><span>   printf(&quot;  File \\&quot;&quot;);</span></span>
<span class="line"><span>   xse-&gt;_file_name-&gt;print();</span></span>
<span class="line"><span>   printf(&quot;\\&quot;, line %d,&quot;, xse-&gt;_line_no);</span></span>
<span class="line"><span>   printf(&quot; in &quot;);</span></span>
<span class="line"><span>   xse-&gt;_func_name-&gt;print();</span></span>
<span class="line"><span>   printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 run 方法中，如果 eval_frame 结束以后，解释器的状态是 EXCEPTION，那就在这里把它处理掉。具体的动作是把 Traceback 打印出来，将状态改为 OK，并且把所有的异常信息都清空。Traceback 的打印也是比较简单的，只需要把每个栈帧的信息打印出来就可以了。</p><p>到这里，我们就把与异常相关的所有机制全部实现了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课完成了异常的全部功能以后，我们可以回顾一下异常处理的全部流程。</p><p>首先，解释器在正常执行的情况下，有些语句可能会发生异常，比如除法中遇到除数为 0 的情况会产生 ZeroDivisionError，循环执行到最后一个元素时会产生 StopIteration 异常，访问列表下标越界时会产生 IndexOutOrRangeErrror 等等。</p><p>如果异常发生在 try 语句中，解释器就会通过 SETUP_FINALLY Block 跳转入 except 子句或者 finally 子句执行。这个时候，要把栈上的 Block 状态设置为 EXCEPT_HANDLER，表示解释器正在处理异常对象。在这之前，解释器会把异常对象放入栈上，同时修改异常状态，这样解释器才能顺利执行 except 语句和 finally 语句中的指令。</p><p>最后，当 finally 子句执行完以后，END_FINALLY 会把异常状态全部恢复，以便于解释器带着异常状态退出当前函数栈帧。同时，我们还实现了 Traceback 对象在退栈时记录栈帧。这样异常处理的全部功能才算完成。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在现有的条件下，如果让你自己实现自定义类的迭代器，你会如何实现呢？欢迎你把思考结果分享到评论区，也欢迎你把这节课的内容分享给其他朋友，我们下节课再见！</p>`,53)])])}const g=a(l,[["render",t]]);export{d as __pageData,g as default};
