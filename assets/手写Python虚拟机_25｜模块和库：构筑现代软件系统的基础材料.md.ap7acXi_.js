import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"25 | 模块和库：构筑现代软件系统的基础材料","description":"","frontmatter":{},"headers":[{"level":2,"title":"实现 import 语句","slug":"实现-import-语句","link":"#实现-import-语句","children":[]},{"level":2,"title":"实现 ModuleObject","slug":"实现-moduleobject","link":"#实现-moduleobject","children":[{"level":3,"title":"实现加载模块功能","slug":"实现加载模块功能","link":"#实现加载模块功能","children":[]},{"level":3,"title":"实现 from 子句","slug":"实现-from-子句","link":"#实现-from-子句","children":[]}]},{"level":2,"title":"构建 builtin 模块","slug":"构建-builtin-模块","link":"#构建-builtin-模块","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"手写Python虚拟机/25｜模块和库：构筑现代软件系统的基础材料.md","filePath":"手写Python虚拟机/25｜模块和库：构筑现代软件系统的基础材料.md","lastUpdated":1795557449000}'),e={name:"手写Python虚拟机/25｜模块和库：构筑现代软件系统的基础材料.md"};function l(t,s,h,c,k,d){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_25-模块和库-构筑现代软件系统的基础材料" tabindex="-1">25 | 模块和库：构筑现代软件系统的基础材料 <a class="header-anchor" href="#_25-模块和库-构筑现代软件系统的基础材料" aria-label="Permalink to &quot;25 | 模块和库：构筑现代软件系统的基础材料&quot;">​</a></h1><p>你好，我是海纳。</p><p>在之前的课程里，我们分别实现了函数的功能，面向对象的基础设施以及自动内存管理功能。这一节课将开始一个新的主题，那就是模块和库。</p><p>在现在的编程语言中，模块和库是最重要的组成部分，它决定了某一门语言的流行程度。例如Java、Perl 等语言都有丰富的扩展库，可以方便地实现各种功能。</p><p>Python 语言也不例外，甚至可以说，Python 的成功正是由于它的丰富多样的功能库。功能库既要容易开发维护，也要容易部署传播，这就需要在语言虚拟机的层面进行全面的设计。</p><p>今天我们就来研究 Python 中的块和模块是如何定义、组织和实现的。我们的目标并不是实现一个完备的，功能强大的运行时库（Runtime Library），而是重在介绍虚拟机为实现模块和库的功能，提供了哪些能力。</p><h2 id="实现-import-语句" tabindex="-1">实现 import 语句 <a class="header-anchor" href="#实现-import-语句" aria-label="Permalink to &quot;实现 import 语句&quot;">​</a></h2><p>在 Python 中，库是以模块为单位进行组织的，一个库由一个或者多个模块组成。导入一个库，其实就是导入它的模块，导入模块使用的语句是 import。我们通过一个例子来说明 import语句的用法。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># test_import.py</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test_func</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(test_func.fact(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># test_func.py</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;loading func module&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fact</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(n):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fact(n</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>在同一个目录下新建两个文件，一个名为 test_import.py，另一个名为 test_func.py，通过代码你可以看到它们的内容。</p><p>把这两个文件编译成 pyc 文件，然后使用 show_file 工具查看。可以看到 test_func 文件并没什么特别，其中的字节码都是我们已经实现过了的。重点在于 test_import 文件。它的字节码我列在下面了，你可以看一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> 1           0 LOAD_CONST               0 (0)</span></span>
<span class="line"><span>             2 LOAD_CONST               1 (None)</span></span>
<span class="line"><span>             4 IMPORT_NAME              0 (test_func)</span></span>
<span class="line"><span>             6 STORE_NAME               0 (test_func)</span></span>
<span class="line"><span> 2           8 LOAD_NAME                1 (print)</span></span>
<span class="line"><span>            10 LOAD_NAME                0 (test_func)</span></span>
<span class="line"><span>            12 LOAD_METHOD              2 (fact)</span></span>
<span class="line"><span>            14 LOAD_CONST               2 (5)</span></span>
<span class="line"><span>            16 CALL_METHOD              1</span></span>
<span class="line"><span>            18 CALL_FUNCTION            1</span></span>
<span class="line"><span>            20 POP_TOP</span></span>
<span class="line"><span>            22 LOAD_CONST               1 (None)</span></span>
<span class="line"><span>            24 RETURN_VALUE</span></span></code></pre></div><p>上述字节码中，第 3 行出现了一个新的指令：</p><p>IMPORT_NAME，它的操作数是 names 列表的序号，所对应的字符串是 test_func。IMPORT_NAME 的执行结果也是一个虚拟机对象，它会被放在操作数栈上，然后通过STORE_NAME 把它赋值给了 test_func 变量（第 4 行）。这个虚拟机对象就是我们这节课要实现的 ModuleObject。</p><p>在第 1 行和第 2 行往栈上加载了两个常量，这两个常量也是供 IMPORT_NAME 使用的，我们暂时还用不着它，这里就先不管了。接下来，LOAD_METHOD 这条指令从 ModuleObject 中加载了 fact 对象到栈上。fact 是一个函数对象，它可以被调用。</p><h2 id="实现-moduleobject" tabindex="-1">实现 ModuleObject <a class="header-anchor" href="#实现-moduleobject" aria-label="Permalink to &quot;实现 ModuleObject&quot;">​</a></h2><p>我们要在虚拟机里增加一个代表模块的类，它是 import 语句的执行结果，还要支持LOAD_METHOD 方法。先来定义 ModuleObject，它也是一个普通的对象，所以也需要继承HiObject。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ModuleKlass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public Klass {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static ModuleKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _instance;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ModuleKlass();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static ModuleKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> get_instance();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   void initialize();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ModuleObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public HiObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _mod_name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ModuleObject(HiDict</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static ModuleObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> import_module(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mod_name);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   void put(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> get(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>和其他所有的类型一样，ModuleObject 也要有自己所对应的 ModuleKlass。ModuleKlass 是一个单例类，并且只定义了 oops_do 和 size 两个虚方法用来支持 GC。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void ModuleKlass::initialize() {</span></span>
<span class="line"><span>   HiDict* dict = HiDict::new_instance();</span></span>
<span class="line"><span>   set_klass_dict(dict);</span></span>
<span class="line"><span>   set_name(HiString::new_instance(&quot;module&quot;));</span></span>
<span class="line"><span>   (new HiTypeObject())-&gt;set_own_klass(this);</span></span>
<span class="line"><span>   add_super(ObjectKlass::get_instance());</span></span>
<span class="line"><span>   order_supers();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>size_t ModuleKlass::size() {</span></span>
<span class="line"><span>   return sizeof(ModuleObject);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void ModuleKlass::oops_do(OopClosure* f, HiObject* obj) {</span></span>
<span class="line"><span>   f-&gt;do_oop((HiObject**)&amp;obj-&gt;as&lt;​ModuleObject&gt;()-&gt;_mod_name);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ModuleKlass 没有什么特别的实现，这些逻辑在前面新建各种内建类型的时候都曾经遇见过。ModuleObject 很像一个字典，它支持以键值对的方式向里面添加元素，也支持以 key 查找相关元素。相比于 FunctionObject 等比较复杂的对象，ModuleObject 的定义更简洁。</p><p>ModuleObject 中有一个 static 方法 import_module 用来加载模块，还有一个方法是 extend，可以用于合并两个模块的内容。extend 方法和字典的合并非常相似，这里就不再详细解释了，下面我们来重点实现加载模块的功能。</p><h3 id="实现加载模块功能" tabindex="-1">实现加载模块功能 <a class="header-anchor" href="#实现加载模块功能" aria-label="Permalink to &quot;实现加载模块功能&quot;">​</a></h3><p>我们先来分析加载模块的时候，虚拟机做了哪些动作。</p><p>第一步，是要找到这个模块所对应的文件，比如当执行 import 语句的时候，虚拟机会在执行文件的相同目录下，查找对应的 pyc 文件。Python 虚拟机还可以加载 py 文件，并在加载之前，把它编译成 pyc 文件。但我们的虚拟机里不打算支持编译的能力，所以我们就直接查找pyc 文件就可以了。</p><p>第二步，加载文件并且执行。Python 的 import 语句和 Java 的大不相同，Java 的 import 只是用于编译时引入符号，而 Python 中却会执行要加载的模块。比如，在这节课开始的例子里，test_func 模块里包含了一条 print 语句。在 import 的时候，这条语句是会被执行的。</p><p>同样的道理，被加载的模块中用于定义类、函数、变量的语句都会被执行，执行的结果就是创建了一个新的命名空间。这个新的命名空间就是我们这节课所实现的 ModuleObject。</p><p>你可以看一下具体的实现。首先，要实现 import_module 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* ModuleObject::search_file(Handle&lt;​HiObject*&gt; x) {</span></span>
<span class="line"><span>   Handle&lt;​HiList*&gt; paths = Interpreter::get_instance()-&gt;search_path();</span></span>
<span class="line"><span>   for (int i = 0; i &lt; paths-&gt;length(); i++) {</span></span>
<span class="line"><span>       Handle&lt;​HiString*&gt; path = paths-&gt;get(i)-&gt;as&lt;​HiString&gt;();</span></span>
<span class="line"><span>       path = path-&gt;add(x)-&gt;as&lt;​HiString&gt;();</span></span>
<span class="line"><span>       Handle&lt;​HiString*&gt; name = path-&gt;add(ST(pyc))-&gt;as&lt;​HiString&gt;();</span></span>
<span class="line"><span>       name-&gt;print();</span></span>
<span class="line"><span>       printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>       if (access(name-&gt;value(), R_OK) == 0) {</span></span>
<span class="line"><span>           return import_pyc(x-&gt;as&lt;​HiString&gt;(), name);</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Universe::HiNone;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>ModuleObject* ModuleObject::import_pyc(HiString* raw_mod_name, HiString* file_nam</span></span>
<span class="line"><span>   BufferedInputStream stream(file_name-&gt;value());</span></span>
<span class="line"><span>   BinaryFileParser parser(&amp;stream);</span></span>
<span class="line"><span>   Handle&lt;​HiString*&gt; mod_name(raw_mod_name);</span></span>
<span class="line"><span>   Handle&lt;​CodeObject*&gt; mod_code = parser.parse();</span></span>
<span class="line"><span>   Handle&lt;​HiDict*&gt; mod_dict = Interpreter::get_instance()-&gt;run_mod(mod_code, mod</span></span>
<span class="line"><span>   return new ModuleObject(mod_dict);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>ModuleObject* ModuleObject::import_module(HiObject* x) {</span></span>
<span class="line"><span>   Handle&lt;​HiObject*&gt; mod_name(x);</span></span>
<span class="line"><span>   HiObject* mod = search_file(x);</span></span>
<span class="line"><span>   if (mod == Universe::HiNone) {</span></span>
<span class="line"><span>       printf(&quot;No module named &quot;);</span></span>
<span class="line"><span>       mod_name-&gt;print();</span></span>
<span class="line"><span>       printf(&quot;\\n&quot;);</span></span>
<span class="line"><span>       assert(false);</span></span>
<span class="line"><span>       return nullptr;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return mod-&gt;as&lt;​ModuleObject&gt;();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>import_module 的核心逻辑就是调用 search_file 在 Python 的库目录下搜索模块（第 30 行）。search_file 通过遍历所有的 Python 库目录，去查找对应的 pyc 文件。通过 access 方法来判断文件是否存在。如果文件存在，就说明找到了目标文件，那就可以通过调用 import_pyc 来加载模块（第 10 至 12 行）。在 import_pyc 方法中，需要执行一遍加载的模块。</p><p>在虚拟机刚开始创建的时候，我们通过 BufferedInputStream 读入字节码文件，并通过BinaryFileParser 把字节码文件解析成 CodeObject。这里做了同样的事情（第 19 至 23 行）。</p><p>然后虚拟机调用 run_mod 方法，执行模块，并将执行的结果，也就是一个变量表，通过返回值的形式传递出来（第 24 行）。然后使用这个返回值创建 ModuleObject（第 25 行）。</p><p>接下来，再实现 run_mod 方法。其实，run_mod 与 run 方法是一样的，只有一些细微的差别。你可以看一下具体的代码实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiDict* Interpreter::run_mod(Handle&lt;​CodeObject*&gt; codes, Handle&lt;​HiString*&gt; mod_nam</span></span>
<span class="line"><span>   FrameObject* frame = new FrameObject();</span></span>
<span class="line"><span>   enter_frame(frame);</span></span>
<span class="line"><span>   frame-&gt;initialize(codes);</span></span>
<span class="line"><span>   frame-&gt;set_entry_frame(true);</span></span>
<span class="line"><span>   frame-&gt;locals()-&gt;put(ST(name), mod_name);</span></span>
<span class="line"><span>   eval_frame();</span></span>
<span class="line"><span>   HiDict* result = frame-&gt;locals();</span></span>
<span class="line"><span>   destroy_frame();</span></span>
<span class="line"><span>   return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>run_mod 方法把这个 frame 设置成 enter_frame（第 5 行），以便模块执行结束以后返回到这里继续执行。这个方法的核心是调用 eval_frame 真正执行模块代码。最后把 frame 中的局部变量表返回出去，并且把这一个 frame 销毁掉。</p><p>完成了这些基础工作，我们就可以实现 IMPORT_NAME 这条字节码了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::eval_frame() {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::IMPORT_NAME:</span></span>
<span class="line"><span>               v = _frame-&gt;names()-&gt;get(op_arg);</span></span>
<span class="line"><span>               w = _modules-&gt;get(v);</span></span>
<span class="line"><span>               if (w != Universe::HiNone) {</span></span>
<span class="line"><span>                   PUSH(w);</span></span>
<span class="line"><span>                   break;</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               w = ModuleObject::import_module(v);</span></span>
<span class="line"><span>               _modules-&gt;put(v, w);</span></span>
<span class="line"><span>               PUSH(w);</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>IMPORT_NAME 的实现就是简单地调用了 import_module（第 15 行），通过模块的名字加载模块。加载成功以后，就把它放到 _modules 存储起来，下一次再遇到 import 同一个模块的时候，就从缓存中查找，如果缓存中已经有了，就可以直接得到，这就避免了重复加载模块。</p><p>做完了这些工作，重新编译虚拟机的代码就可以正确执行 test_import 例子了。</p><h3 id="实现-from-子句" tabindex="-1">实现 from 子句 <a class="header-anchor" href="#实现-from-子句" aria-label="Permalink to &quot;实现 from 子句&quot;">​</a></h3><p>使用 import 语句加载一个模块，使用它们命名空间中的变量时，要加上模块名字，例如：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test_func</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(test_func.fact(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><p>每次要使用 fact 函数的时候，都必须通过 test_func 符号来引用，不太方便。</p><p>这时候，我们也可以使用 from 子句来进行化简。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test_func </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fact</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fact(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><p>fact 这个符号就被加载到当前的局部变量表里了。这种做法的优点是使代码简洁，性能也会稍好一些，因为少了一次 LOAD_ATTR 的调用。但它也有一个问题，那就是增加了命名冲突的可能。比如本模块中也有一个 fact 的定义，那么这两个符号就冲突了，后面的定义会覆盖前边那一次的定义。</p><p>我们看一下 from 子句所对应的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> 1           0 LOAD_CONST               0 (0)</span></span>
<span class="line"><span>             2 LOAD_CONST               1 ((&#39;fact&#39;,))</span></span>
<span class="line"><span>             4 IMPORT_NAME              0 (test_func)</span></span>
<span class="line"><span>             6 IMPORT_FROM              1 (fact)</span></span>
<span class="line"><span>             8 STORE_NAME               1 (fact)</span></span>
<span class="line"><span>            10 POP_TOP</span></span>
<span class="line"><span> 2          12 LOAD_NAME                2 (print)</span></span>
<span class="line"><span>            14 LOAD_NAME                1 (fact)</span></span>
<span class="line"><span>            16 LOAD_CONST               2 (5)</span></span>
<span class="line"><span>            18 CALL_FUNCTION            1</span></span>
<span class="line"><span>            20 CALL_FUNCTION            1</span></span>
<span class="line"><span>            22 POP_TOP</span></span>
<span class="line"><span>            24 LOAD_CONST               3 (None)</span></span>
<span class="line"><span>26 RETURN VALUE</span></span></code></pre></div><p>在 IMPORT_NAME 字节码之后，是一个 IMPORT_FROM 和 STORE_NAME。这个IMPORT_FROM 的作用，就是从刚刚加载的那个 Module 中查找 fact 符号。</p><p>ModuleObject 中提供了 get 方法，可以从一个模块对象中获得一个符号。所以IMPORT_FROM 字节码的实现就依赖于 get 方法来获取符号。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::eval_frame() {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>       case ByteCode::IMPORT_FROM:</span></span>
<span class="line"><span>               v = _frame-&gt;names()-&gt;get(op_arg);</span></span>
<span class="line"><span>               w = TOP();</span></span>
<span class="line"><span>               u = w-&gt;getattr(v);</span></span>
<span class="line"><span>               PUSH(u);</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，我们就完全实现了 IMPORT 语句的功能。</p><h2 id="构建-builtin-模块" tabindex="-1">构建 builtin 模块 <a class="header-anchor" href="#构建-builtin-模块" aria-label="Permalink to &quot;构建 builtin 模块&quot;">​</a></h2><p>回顾第 18 课，实现 TypeObject 的时候，我们把 object、list、dict 这些符号都放在 builtin 中创建。其实 builtin 中有很多符号还没被创建，比如，Exception 类、range、map 等函数。</p><p>这些类和函数如果使用 C++ 来写就会非常麻烦，但如果使用 Python 来写就很简单，有了模块以后，我们就可以把这些函数丢到 Python 库里，在虚拟机启动的时候，通过调用import_module 加载这个库，完成这些内建符号的初始化。</p><p>第一步，先把 builtin 由原来简版的 HiDict 封装成豪装版的 ModuleObject。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Interpreter {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ModuleObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         _builtins;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiDict</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               _modules;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>第二步，在 Interpreter::initialize 方法中加载 builtin.pyc 模块，并和原来的那个内建的_builtins 模块合并。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::initialize() {</span></span>
<span class="line"><span>   _search_path = HiList::new_instance();</span></span>
<span class="line"><span>   _search_path-&gt;append(ST(lib));</span></span>
<span class="line"><span>   _modules  = HiDict::new_instance();</span></span>
<span class="line"><span>   _builtins = new ModuleObject(HiDict::new_instance());</span></span>
<span class="line"><span>   _builtins-&gt;put(HiString::new_instance(&quot;True&quot;),     Universe::HiTrue);</span></span>
<span class="line"><span>   // ....</span></span>
<span class="line"><span>   _builtins-&gt;put(ST(build_class), new FunctionObject(build_type_object, ST(buil</span></span>
<span class="line"><span>   _builtins-&gt;extend(ModuleObject::import_module(HiString::new_instance(&quot;builtin</span></span>
<span class="line"><span>   _modules-&gt;put(HiString::new_instance(&quot;__builtins__&quot;), _builtins);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 Interpreter 的初始化方法中，先创建 _builtins 模块（第 7 行），并在其中创建 True、False、None 等符号。这段代码中还包括一些其他符号的初始化操作，比如类型对象 int、list等，还有内建函数 len、isinstance 等。这些机制之前都讲过，这里就不重复了（第 9 行以省略号简化）。</p><p>然后通过调用 import_module 将 builtin.py 中的符号加载成模块，并且通过 extend 方法将两个模块合并，这才得到了完整的 builtin 模块（第 12 行）。最后，将这个模块以</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__builtins__ 为名称缓存在 _modules 对象中即可（第 14 行）。</span></span></code></pre></div><p>修改完解释器的初始化方法以后，再来创建 builtin.py 文件。在 vm 的同级目录下，新建一个名为 lib 的目录，所有的内建模块，比如未来可能添加的 asyncio、math 等，都放到 lib 目录下。在 lib 目录中新建 builtin.py 文件。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sum</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(iterable, i):</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   temp </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> iterable:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       temp </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> temp </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> temp</span></span></code></pre></div><p>最后，在 lib 下新建 CMakeLists.txt 文件用来构建 builtin.pyc。由于 CMake 的用法和我们课程的主题无关，这里就不再详细解释了。你可以通过代码仓自己查看。</p><p>做完了所有的工作以后，我们可以通过例子来测试 builtin 模块里的符号是否可以正常访问。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lst</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> list</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">i</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">while</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 10:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   lst.append(i</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   i</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">sum</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lst,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><p>我们看到这些方法都能被正常地调用了。到这里，我们就实现了 Python 中的模块的加载功能。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课我们实现了模块的基本功能，首先分析了 import 语句翻译成什么样的字节码，然后实现了 ModuleObject。</p><p>import_module 方法是这节课最核心的内容。它的主要工作流程是：</p><ol><li><p>在搜索目录中找到要加载的模块所对应的文件；</p></li><li><p>加载 pyc 文件并使用 BinaryFileParser，对它进行解析从而得到 CodeObject；</p></li><li><p>调用 run_mod 方法执行代码，并且使用执行所得到的局部变量表创建 ModuleObject。</p></li></ol><p>在这节课之前构建的 builtins 模块并不完整，还有一些核心功能需要使用 Python 来实现。这些功能被安放在 lib 目录下的 builtin.py 文件里。这里就可以通过 import_moudle 方法进行加载，这样得到的 ModuleObject 再与原来的 builtins 模块进行合并，才是完整的 builtins 模块。</p><p>除了使用 pyc 来组织 Python 的模块之外，还有一些依赖于具体平台的功能，需要通过动态链接库实现，比如数学库、图形界面等。下节课我们就进一步研究虚拟机如何通过本地库来调用相应平台的服务。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在导入模块的时候，目录名也可以作为模块名。这个时候，Python 虚拟机会自动地执行目录</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>下的 __init__.py 文件。请你思考一下，这个功能如何实现？如果可以的话，你自己实现</span></span></code></pre></div><p>一下这个功能。欢迎你把你实现的结果分享到评论区，我们一起交流讨论，同时也欢迎你把这节课的内容分享给其他朋友，我们下节课再见！</p>`,78)])])}const g=a(e,[["render",l]]);export{o as __pageData,g as default};
