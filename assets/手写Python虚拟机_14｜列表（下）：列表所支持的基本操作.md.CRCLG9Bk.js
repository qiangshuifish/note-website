import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"14 | 列表（下）：列表所支持的基本操作","description":"","frontmatter":{},"headers":[{"level":2,"title":"删除元素","slug":"删除元素","link":"#删除元素","children":[{"level":3,"title":"实现 pop 方法","slug":"实现-pop-方法","link":"#实现-pop-方法","children":[]},{"level":3,"title":"实现 del 关键字","slug":"实现-del-关键字","link":"#实现-del-关键字","children":[]}]},{"level":2,"title":"对列表元素进行排序","slug":"对列表元素进行排序","link":"#对列表元素进行排序","children":[]},{"level":2,"title":"遍历列表元素","slug":"遍历列表元素","link":"#遍历列表元素","children":[]},{"level":2,"title":"列表的加法乘法操作","slug":"列表的加法乘法操作","link":"#列表的加法乘法操作","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"手写Python虚拟机/14｜列表（下）：列表所支持的基本操作.md","filePath":"手写Python虚拟机/14｜列表（下）：列表所支持的基本操作.md","lastUpdated":1795557449000}'),l={name:"手写Python虚拟机/14｜列表（下）：列表所支持的基本操作.md"};function t(e,s,h,k,c,r){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_14-列表-下-列表所支持的基本操作" tabindex="-1">14 | 列表（下）：列表所支持的基本操作 <a class="header-anchor" href="#_14-列表-下-列表所支持的基本操作" aria-label="Permalink to &quot;14 | 列表（下）：列表所支持的基本操作&quot;">​</a></h1><p>你好，我是海纳。</p><p>上节课我们介绍了列表的基本实现，初步实现了往列表中增加新元素、修改列表中的元素等功能。这节课我们会继续实现列表支持的其他基本操作，主要包括删除元素、对元素进行排序，以及迭代访问列表元素等功能。</p><h2 id="删除元素" tabindex="-1">删除元素 <a class="header-anchor" href="#删除元素" aria-label="Permalink to &quot;删除元素&quot;">​</a></h2><p>从列表中删除元素，如果是删除最后一个元素，可以直接使用 list 的 pop 方法。pop 方法与append 方法刚好是一对逆操作。append 用来在列表的末尾添加元素，而 pop 则是删除列表的最后一个元素。</p><p>而删除指定位置的元素有两种方法，一种是使用 del 关键字，另一种是使用列表的 remove 方法。接下来，我们逐个实现它们。先从 pop 方法开始。</p><h3 id="实现-pop-方法" tabindex="-1">实现 pop 方法 <a class="header-anchor" href="#实现-pop-方法" aria-label="Permalink to &quot;实现 pop 方法&quot;">​</a></h3><p>先使用 C++ 实现 list_pop 函数，用于将列表末尾的元素删除。list_pop 只需要简单地调用列表对象上的 pop 方法即可。而 pop 方法在第 4 节课中定义 list 的时候，我们就已经实现了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* list_pop(ObjList args) {</span></span>
<span class="line"><span>   HiList* list = (HiList*)(args-&gt;get(0));</span></span>
<span class="line"><span>   assert(list &amp;&amp; list-&gt;klass() == ListKlass::get_instance());</span></span>
<span class="line"><span>   return list-&gt;pop();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>第二步，在 ListKlass 的构造方法里，把字符串 “pop” 与这个 native 方法关联在一起。</span></span>
<span class="line"><span>ListKlass::ListKlass() {</span></span>
<span class="line"><span>   HiDict * klass_dict = new HiDict();</span></span>
<span class="line"><span>   klass_dict-&gt;put(new HiString(&quot;append&quot;),</span></span>
<span class="line"><span>       new FunctionObject(list_append));</span></span>
<span class="line"><span>   klass_dict-&gt;put(new HiString(&quot;pop&quot;),</span></span>
<span class="line"><span>       new FunctionObject(list_pop));</span></span>
<span class="line"><span>   set_klass_dict(klass_dict);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码里，我们可以看到，添加 pop 方法与添加 append 方法要做的事情几乎是一样的。</p><p>接下来，我们再看一下使用 del 关键字删除指定的列表元素。</p><h3 id="实现-del-关键字" tabindex="-1">实现 del 关键字 <a class="header-anchor" href="#实现-del-关键字" aria-label="Permalink to &quot;实现 del 关键字&quot;">​</a></h3><p>关键字 del 不同于方法，一般来说，遇到关键字都会引入新的字节码。所以我们还是创建一个简单的例子，然后观察它的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [4, 1, 2, 3]</span></span>
<span class="line"><span>del l[0]</span></span>
<span class="line"><span>17          56 LOAD_NAME                0 (l)</span></span>
<span class="line"><span>            59 LOAD_CONST               4 (0)</span></span>
<span class="line"><span>            62 DELETE_SUBSCR</span></span></code></pre></div><p>为了方便查看，我把 Python 源代码和字节码放在一起了。注意上述代码的最后一行，出现了新的字节码：DELETE_SUBSCR 。这个字节码是不带参数的，它的参数都在操作数栈上。</p><p>栈顶第一个元素是整数 0，也就是序号，栈顶第二个元素是列表对象。而且这个字节码没有返回值，所以也就不用再把任何值送回到栈上了。我们可以这么实现这个字节码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span> HiObject *v, *w, *u;</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::DELETE_SUBSCR:</span></span>
<span class="line"><span>               w = POP();</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>               v-&gt;del_subscr(w);</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码里可以看到，v、w 都是指向 HiObject 的指针，这就要求我们要在 HiObject 里添加del_subscr 方法。这个逻辑推演和上一节课中的 store_subscr 方法是完全一样的。下面我给出了 del_subscr 方法的具体代码实现，你可以参考。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> object</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">hiObject.cpp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void HiObject::del_subscr(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   klass()</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">del_subscr(this, x);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> object</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">klass.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Klass {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Klass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        _super;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     _name;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiDict</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       _klass_dict;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void del_subscr    (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>然后，我们在 ListKlass 中实现这个虚函数。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> object</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">hiList.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ListKlass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public Klass {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   virtual void del_subscr (HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> object</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">hiList.cpp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void ListKlass::del_subscr(HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x, HiObject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   assert</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">klass() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Klass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) this);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   assert</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(y </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">klass() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> IntegerKlass::get_instance());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiList </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> lx = (HiList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)x;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiInteger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> iy = (HiInteger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)y;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   lx</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">inner_list()</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">delete_index(iy</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">value());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> util</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">arrayList.cpp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​typename T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void ArrayList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::delete_index(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> index) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i = index; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _length; i</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       _array[i] = _array[i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _length</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>delete_index 的作用是从 ArrayList 中删除指定位置的元素（第 20 至 26 行）。由于其内部的数据结构是一个数组，在删除的时候，我们必须把后面的元素向前移，覆盖掉被删除的那个元素。在完成这个操作以后，再把 _length 减 1。这样，del 关键字删除元素的功能就全部完成了。</p><p>最后，我们关注 remove 方法的实现。这个方法接受一个参数，把列表里和这个参数相等的值删除掉。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [&quot;hello&quot;, &quot;world&quot;, &quot;hello&quot;]</span></span>
<span class="line"><span>l.remove(&quot;hello&quot;)</span></span>
<span class="line"><span>print(l) # [&quot;world&quot;]</span></span></code></pre></div><p>在列表中添加一个 native 方法我们已经做过很多次了。对 ListKlass 构造函数的修改，这里就不再列出了，为了练手，你可以自己实现。</p><p>这里重点关注一下 list_remove 方法的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* list_remove(ObjList args) {</span></span>
<span class="line"><span>   HiList* list = (HiList*)(args-&gt;get(0));</span></span>
<span class="line"><span>   HiObject* target = (HiObject*)(args-&gt;get(1));</span></span>
<span class="line"><span>   assert(list &amp;&amp; list-&gt;klass() == ListKlass::get_instance());</span></span>
<span class="line"><span>   for (int i = 0; i &lt; list-&gt;inner_list()-&gt;size(); i++) {</span></span>
<span class="line"><span>       if (list-&gt;get(i)-&gt;equal(target) == (HiObject*)Universe::HiTrue) {</span></span>
<span class="line"><span>           list-&gt;inner_list()-&gt;delete_index(i);</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Universe::HiNone;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码使用 equal 比较列表中的元素与输入参数 target 是否相等（第 8 行）。如果相等，equal 方法的返回值就是 HiTrue，否则就是 HiFalse。当元素与参数相等时，我们可以通过直接调用 delete_index 方法将元素删除。</p><p>到这里，删除元素的所有方法我们就全部实现了。最后我们可以通过以下的测试用例进行综合测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [4, 1, 2, 3]</span></span>
<span class="line"><span>l.remove(2)</span></span>
<span class="line"><span>print(l)       # [4, 1, 3]</span></span>
<span class="line"><span>l[0] = 3</span></span>
<span class="line"><span>print(l)       # [3, 1, 3]</span></span>
<span class="line"><span>del l[0]</span></span>
<span class="line"><span>print(l)       # [1, 3]</span></span>
<span class="line"><span>print(l.pop()) # 3</span></span>
<span class="line"><span>print(l)       # [1]</span></span></code></pre></div><p>你自己运行一下这个例子，看看自己的测试结果是否与预期相符。</p><h2 id="对列表元素进行排序" tabindex="-1">对列表元素进行排序 <a class="header-anchor" href="#对列表元素进行排序" aria-label="Permalink to &quot;对列表元素进行排序&quot;">​</a></h2><p>列表中有两个方法与列表元素的序列有关，一个是 reverse，一个是 sort。reverse 方法用来把列表中的所有元素倒序。sort 用来把列表中的元素按从小到大的顺序排列，也就是升序。</p><p>reverse 是列表的一个方法，我们看一下添加 reverse 方法的过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ListKlass::ListKlass() {</span></span>
<span class="line"><span>   HiDict * klass_dict = new HiDict();</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   klass_dict-&gt;put(new HiString(&quot;reverse&quot;),</span></span>
<span class="line"><span>       new FunctionObject(list_reverse));</span></span>
<span class="line"><span>   set_klass_dict(klass_dict);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>HiObject* list_reverse(ObjList args) {</span></span>
<span class="line"><span>   HiList* list = (HiList*)(args-&gt;get(0));</span></span>
<span class="line"><span>   int i = 0;</span></span>
<span class="line"><span>   int j = list-&gt;size() - 1;</span></span>
<span class="line"><span>   while (i &lt; j) {</span></span>
<span class="line"><span>       HiObject* t = list-&gt;get(i);</span></span>
<span class="line"><span>       list-&gt;set(i, list-&gt;get(j));</span></span>
<span class="line"><span>       list-&gt;set(j, t);</span></span>
<span class="line"><span>       i++;</span></span>
<span class="line"><span>       j--;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Universe::HiNone;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码的逻辑是这样的，i 指向列表头，j 指向列表尾，不停地交换前半部分元素和后半部分元素，直到 i 不再指向前半部分（第 14 至第 21 行）。代码的其他部分比较简单，这里我就不过多解释了。</p><p>接下来是 sort 方法。绝大多数的排序算法都是基于比较的，就是说，如果要把所有元素按照从小到大升序排列，得先定义大和小。两个元素能比较大小了，它们的先后顺序也就决定了。所以，我们要解决的第一个问题是列表的元素可以比较大小。</p><p>在 HiObject 中，我们已经定义好了 less、greater 等方法用来比较对象大小。并且在IntegerKlass 中实现了相应的方法。</p><p>Python 2.7 支持不同类型的对象相互比较大小。它的规则是，整数类型比其他所有类型都小。其他类型之间相互比较的时候按照类型名称的字符串比较规则进行比较。例如，列表的类型名称是 list，字符串类的类型名称是 str。这两个类名称的字符串进行比较时，list 小于 str，这就意味着所有的列表对象都比字符串对象小。</p><p>但在 Python 3.8 中，这个规则被优化了，不再支持不同类型的对象之间进行比较和排序。也就是说只有比较操作符两边的操作数类型是相同的，才可以相互比较，如果比较的对象是不同类型的，就会抛出异常。但我们现在还没有实现异常，所以就直接 assert 失败退出程序了。</p><p>在搞清楚这些规则以后，我们再来实现 sort 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ListKlass::ListKlass() {</span></span>
<span class="line"><span>   HiDict * klass_dict = new HiDict();</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   klass_dict-&gt;put(new HiString(&quot;sort&quot;),</span></span>
<span class="line"><span>       new FunctionObject(list_sort));</span></span>
<span class="line"><span>   set_klass_dict(klass_dict);</span></span>
<span class="line"><span>   set_name(new HiString(&quot;list&quot;));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>HiObject* list_sort(ObjList args) {</span></span>
<span class="line"><span>   HiList* list = (HiList*)(args-&gt;get(0));</span></span>
<span class="line"><span>   assert(list &amp;&amp; list-&gt;klass() == ListKlass::get_instance());</span></span>
<span class="line"><span>   // bubble sort</span></span>
<span class="line"><span>   for (int i = 0; i &lt; list-&gt;size(); i++) {</span></span>
<span class="line"><span>       for (int j = list-&gt;size() - 1; j &gt; i; j--) {</span></span>
<span class="line"><span>           if (list-&gt;get(j)-&gt;less(list-&gt;get(j-1)) == Universe::HiTrue) {</span></span>
<span class="line"><span>               HiObject* t = list-&gt;get(j);</span></span>
<span class="line"><span>               list-&gt;set(j, list-&gt;get(j-1));</span></span>
<span class="line"><span>               list-&gt;set(j-1, t);</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Universe::HiNone;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>list_sort 是列表的 sort 方法的真正实现。在 list_sort 中，我们采用了冒泡排序算法，这是一种最简单的排序算法。它重复地访问要排序的元素序列，依次比较两个相邻的元素，如果他们的顺序错误，如从小到大排序时，更大的数在前边，就把它们交换过来。</p><p>访问元素的工作会重复进行，直到没有相邻元素需要交换。这个算法名字的由来是因为越小的元素会经过交换慢慢“浮”到数列的顶端，就如同水中的气泡最终会上浮到顶端一样，所以叫作“冒泡排序”。</p><p>这里你可以尝试着使用快排或者堆排序来替换冒泡排序算法，从而使 list 的排序效率更高。</p><p>为了让列表对象相互之间能够比较，我们还要为列表增加比较的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* ListKlass::less(HiObject* x, HiObject* y) {</span></span>
<span class="line"><span>   HiList * lx = (HiList*)x;</span></span>
<span class="line"><span>   HiList * ly = (HiList*)y;</span></span>
<span class="line"><span>   assert(lx &amp;&amp; lx-&gt;klass() == (Klass*) this);</span></span>
<span class="line"><span>   assert(ly &amp;&amp; ly-&gt;klass() == (Klass*) this);</span></span>
<span class="line"><span>   int len = lx-&gt;size() &lt; ly-&gt;size() ?</span></span>
<span class="line"><span>       lx-&gt;size() : ly-&gt;size();</span></span>
<span class="line"><span>   for (int i = 0; i &lt; len; i++) {</span></span>
<span class="line"><span>       if (lx-&gt;get(i)-&gt;less(ly-&gt;get(i)) == Universe::HiTrue) {</span></span>
<span class="line"><span>           return Universe::HiTrue;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else if (lx-&gt;get(i)-&gt;equal(ly-&gt;get(i)) != Universe::HiTrue) {</span></span>
<span class="line"><span>           return Universe::HiFalse;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (lx-&gt;size() &lt; ly-&gt;size())</span></span>
<span class="line"><span>       return Universe::HiTrue;</span></span>
<span class="line"><span>   return Universe::HiFalse;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>列表比较的逻辑与字符串比较的逻辑十分相似。首先检查两个对象的类型是否相同，如果不相同，就先比较类型的大小。如果类型相同，就逐个元素进行比较。</p><p>比较的规则是，在 x 某位置上的元素如果小于 y 相同位置上的元素，就可以直接返回 True。x某位置上的元素如果大于 y 相同位置上的元素，就返回 False。如果在相同位置上的元素相等，那就继续比较下一位。如果所有位置上的元素都相等，但是 x 和 y 的长度不同，那么更短的那个列表更小。</p><p>到这里，我们可以使用下面的测试用例来检查我们的实现是否正确。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a = [1, 3, 2, 5, 4]</span></span>
<span class="line"><span>c = [1, 3]</span></span>
<span class="line"><span>b = [&quot;a&quot;, &quot;z&quot;, &quot;hello&quot;, &quot;world&quot;]</span></span>
<span class="line"><span>a.sort()</span></span>
<span class="line"><span>print(a)</span></span>
<span class="line"><span>b.sort()</span></span>
<span class="line"><span>print(b)</span></span>
<span class="line"><span>print(a &lt; c)</span></span></code></pre></div><h2 id="遍历列表元素" tabindex="-1">遍历列表元素 <a class="header-anchor" href="#遍历列表元素" aria-label="Permalink to &quot;遍历列表元素&quot;">​</a></h2><p>列表还有一个重要的机制，在 Python 编程实践中使用频率非常高的遍历。在讲解控制流的时候，我们只讲解了 while 循环，没有使用 for 关键字，这是因为 for 关键字要依赖更多的数据结构。</p><p>我们用一个例子来查看 for 循环使用的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3]</span></span>
<span class="line"><span>for i in l:</span></span>
<span class="line"><span>   print(i)</span></span></code></pre></div><p>我们将这个测试用例编译以后，再使用 show_file 工具查看它的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> 1           0 LOAD_CONST               0 (1)</span></span>
<span class="line"><span>             2 LOAD_CONST               1 (2)</span></span>
<span class="line"><span>             4 LOAD_CONST               2 (3)</span></span>
<span class="line"><span>             6 BUILD_LIST               3</span></span>
<span class="line"><span>             8 STORE_NAME               0 (l)</span></span>
<span class="line"><span> 2          10 LOAD_NAME                0 (l)</span></span>
<span class="line"><span>            12 GET_ITER</span></span>
<span class="line"><span>       &gt;&gt;   14 FOR_ITER                12 (to 28)</span></span>
<span class="line"><span>            16 STORE_NAME               1 (i)</span></span>
<span class="line"><span> 3          18 LOAD_NAME                2 (print)</span></span>
<span class="line"><span>            20 LOAD_NAME                1 (i)</span></span>
<span class="line"><span>            22 CALL_FUNCTION            1</span></span>
<span class="line"><span>            24 POP_TOP</span></span>
<span class="line"><span>            26 JUMP_ABSOLUTE           14</span></span>
<span class="line"><span>       &gt;&gt;   28 LOAD_CONST               3 (None)</span></span>
<span class="line"><span>            30 RETURN_VALUE</span></span></code></pre></div><p>上述字节码的第一个功能是创建列表（第 1 行至第 5 行）。第二部分对应源码文件的第 2 行，也就是那条 for 语句（第 7 行至第 10 行）。这 4 条字节码中，有两个是我们还没有实现的，分别是 GET_ITER 和 FOR_ITER。第三部分就是打印，这部分不再赘述。</p><p>第二部分出现了一个全新的概念：迭代器（iterator）。迭代器在 C++ STL 中和 Java 容器里被广泛使用，是一种非常常见的软件设计模式。</p><p>迭代器是一种对象，它能够遍历容器中的所有元素。迭代器并不仅仅是列表专用的，它用在很多地方，例如字典、文件等，程序员甚至可以自己定义迭代器。它的作用就是屏蔽底层的数据结构，让程序可以使用统一的接口来对不同的数据结构进行遍历操作。</p><p>GET_ITER 可以获得栈顶对象的迭代器，并把迭代器送到栈顶。FOR_ITER 可以将迭代器往前推进。比如，迭代器在刚被创建的时候，总是指向第一个元素，而执行一次 FOR_ITER 以后，就会把第一个元素送到栈顶，同时将迭代器推进一次，指向第二个元素。</p><p>知道了迭代器的作用以后，我们就来设计列表的迭代器。Python 提供了一个函数，名为 iter，可以获取对象上的迭代器，我们可以先探究一下。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&gt;&gt; l = []</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&gt;&gt; it = iter(l)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&gt;&gt; print(it)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​list_iterator object at 0x7fee725ccb20&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&gt;&gt; dir(it)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[..., &#39;__next__&#39;, ...]</span></span></code></pre></div><p>在 Python 的 REPL 环境里（在命令行下手动输入 Python 并回车即可进入），通过调用 iter 函数，获得一个空列表对象的迭代器，并把它打印了出来。可以看到，迭代器对象本身也是一个普通的 Python 对象，并且它的类型是 list_iterator。</p><p>通过 dir 查看它的属性，可以看到，list_iterator 类型上定义了 next 方法。这就为我们实现迭代器指明了方向。首先，迭代器也是一个 HiObject 对象，它的 klass 名称是 list_iterator。我们把这些分析转换成代码。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> object</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">hiList.hpp</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ListIteratorKlass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public Klass {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static ListIteratorKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> instance;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ListIteratorKlass();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static ListIteratorKlass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> get_instance();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ListIterator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : public HiObject {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   _owner;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       _iter_cnt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ListIterator(HiList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> owner);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> owner()        { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _owner; }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> iter_cnt()         { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _iter_cnt; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   void inc_cnt()         { _iter_cnt</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>ListIteratorKlass 和之前实现的 ListKlass 等其他 Klass 相同，也是一个单例对象。ListIterator才是真正的迭代器，它继承自 HiObject。为了遍历列表，迭代器上要记录目标列表（_owner），还要记录当前已经遍历到什么位置（_iter_cnt）。</p><p>接下来，就要在代表迭代器类型的 ListIteratorKlass 中添加 next 方法。这个工作可以在构造函数里完成。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// object/hiList.hpp</span></span>
<span class="line"><span>HiObject* listiterator_next(ObjList args);</span></span>
<span class="line"><span>// object/hiList.cpp</span></span>
<span class="line"><span>ListIteratorKlass::ListIteratorKlass() {</span></span>
<span class="line"><span>   HiDict* klass_dict = new HiDict();</span></span>
<span class="line"><span>   klass_dict-&gt;put(new HiString(&quot;next&quot;),</span></span>
<span class="line"><span>           new FunctionObject(listiterator_next));</span></span>
<span class="line"><span>   set_klass_dict(klass_dict);</span></span>
<span class="line"><span>   set_name(new HiString(&quot;listiterator&quot;));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>ListIterator::ListIterator(HiList* list) {</span></span>
<span class="line"><span>   _owner = list;</span></span>
<span class="line"><span>   _iter_cnt = 0;</span></span>
<span class="line"><span>   set_klass(ListIteratorKlass::get_instance());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>HiObject* listiterator_next(ObjList args) {</span></span>
<span class="line"><span>   ListIterator* iter = (ListIterator*)(args-&gt;get(0));</span></span>
<span class="line"><span>   HiList* alist = iter-&gt;owner();</span></span>
<span class="line"><span>   int iter_cnt = iter-&gt;iter_cnt();</span></span>
<span class="line"><span>   if (iter_cnt &lt; alist-&gt;inner_list()-&gt;size()) {</span></span>
<span class="line"><span>       HiObject* obj = alist-&gt;get(iter_cnt);</span></span>
<span class="line"><span>       iter-&gt;inc_cnt();</span></span>
<span class="line"><span>       return obj;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else // TODO : we need StopIteration here to mark iteration end</span></span>
<span class="line"><span>       return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>listiterator_next 方法的逻辑是取出当前 iter_cnt 所对应的对象，把它作为返回值返回给调用者，并且把 iter_cnt 加 1。</p><p>如果遍历结束，iter_cnt 的值就会等于列表的长度，我们通过返回 NULL 来表示结束了（第 30行）。实际上，按照 Python 标准的要求，这里应该抛出一个 StopIteration 异常。但由于我们现在还没有实现异常机制，所以这里就先使用 NULL 来代表迭代器遍历结束。</p><p>实现完列表的迭代器以后，就可以实现迭代器相关的两个字节码了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   _frame = new FrameObject(codes);</span></span>
<span class="line"><span> HiObject *v, *w, *u;</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>   while (_frame-&gt;has_more_codes()) {</span></span>
<span class="line"><span>     unsigned char op_code = _frame-&gt;get_op_code();</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       switch (op_code) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::GET_ITER:</span></span>
<span class="line"><span>               v = POP();</span></span>
<span class="line"><span>               PUSH(v-&gt;iter());</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>           case ByteCode::FOR_ITER:</span></span>
<span class="line"><span>               v = TOP();</span></span>
<span class="line"><span>               w = v-&gt;getattr(new HiString(&quot;next&quot;));</span></span>
<span class="line"><span>               build_frame(w, NULL);</span></span>
<span class="line"><span>               if (TOP() == NULL) {</span></span>
<span class="line"><span>                   _frame-&gt;_pc += op_arg;</span></span>
<span class="line"><span>                   POP();</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               break;</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>GET_ITER 的实现中调用了 v 的 iter 方法（第 10 至 13 行），v 的类型虽然是指向 HiObject 的指针，但它本质上是一个列表对象。</p><p>iter 方法的作用是生成与 v 相联系的 ListIterator。在 HiObject 及 Klass 类里添加 iter 方法的原型的代码，它的逻辑比较简单，就不再列出了。这里我只列出 ListKlass 中 iter 的具体实现，供你参考。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* ListKlass::iter(HiObject* x) {</span></span>
<span class="line"><span>   assert(x &amp;&amp; x-&gt;klass() == this);</span></span>
<span class="line"><span>   return new ListIterator((HiList*)x);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行完 GET_ITER 字节码以后，列表的迭代器对象就已经在操作数栈顶了。接下来解释器就会循环地执行 FOR_ITER。</p><p>如果迭代的过程正常，也就是返回值不为 NULL，那么就继续执行下一条字节码。如果迭代的过程结束了，就跳转到目标字节码继续执行。</p><p>这个目标字节码由 FOR_ITER 的参数描述， FOR_ITER 的参数代表了迭代结束的目标指令与当前指令的偏移量。所以我们在迭代结束以后，将 _frame 的 _pc 值加上这个参数，就得到了要跳转的目标指令地址。</p><p>从列表中迭代取出元素的过程，就是不断地通过 build_frame 调用 ListIterator 的 next 方法的过程。这个调用最终会执行到 listiterator_next 函数中去。在这个函数里，我们不断地从列表中取出它的元素。</p><p>到这里，迭代器就全部实现完了。编译运行，就可以执行这部分的测试用例了。</p><p>最后，再添加一点优化。我们注意到 FOR_ITER 的每一次执行都会生成一个新的字符串对象，这种做法不仅会使性能变差，在没有正确地实现自动内存管理之前，还会带来更多的内存泄漏。</p><p>这个新生成的字符串值为 next，是一个常量，没有必要每次都重新生成。所以我们就可以以静态变量的形式把它记录下来。为此，我们创建一个名为 StringTable 的类，把所有虚拟机的字符串常量都记录在这个类里。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> StringTable {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static StringTable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> instance;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   StringTable();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   static StringTable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> get_instance();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   HiString</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> next_str;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>因为 StringTable 在整个虚拟机里只需要一份即可，所以我们采用单例模式实现它。在构造函数里，我们初始化 next_str。这样，在 FOR_ITER 里就可以使用这个字符串常量了，避免每次执行都需要创建一个新的对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>StringTable::StringTable() {</span></span>
<span class="line"><span>   next_str = new HiString(&quot;next&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void Interpreter::run(CodeObject* codes) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>           case ByteCode::FOR_ITER:</span></span>
<span class="line"><span>               v = TOP();</span></span>
<span class="line"><span>               w = v-&gt;getattr(StringTable::get_instance()-&gt;next_str);</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>好了，关于迭代器我们先介绍到这里，Python 的迭代器是一个很复杂的机制，这里只是开了个头，后面我会慢慢补充。</p><h2 id="列表的加法乘法操作" tabindex="-1">列表的加法乘法操作 <a class="header-anchor" href="#列表的加法乘法操作" aria-label="Permalink to &quot;列表的加法乘法操作&quot;">​</a></h2><p>列表上定义的各种操作，我们已经介绍得差不多了。最后还有三种简单的操作，值得再介绍一下。第一个就是加法，两个列表相加的结果是一个新的列表，它包含了两个列表的所有内容。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a = [1, 2]</span></span>
<span class="line"><span>b = [&quot;hello&quot;, &quot;world&quot;]</span></span>
<span class="line"><span>c = a + b</span></span>
<span class="line"><span>#     24 LOAD_NAME                0 (a)</span></span>
<span class="line"><span>#     27 LOAD_NAME                1 (b)</span></span>
<span class="line"><span>#     30 BINARY_ADD</span></span>
<span class="line"><span>#     31 STORE_NAME               2 (c)</span></span>
<span class="line"><span>print(a)  # [1, 2]</span></span>
<span class="line"><span>print(b)  # [&quot;hello&quot;, &quot;world&quot;]</span></span>
<span class="line"><span>print(c)  # [1, 2, &quot;hello&quot;, &quot;world&quot;]</span></span></code></pre></div><p>使用 Python 运行这个测试，就会发现，a 和 b 所指向的列表并没有发生改变。而 c 是一个新的列表，它包含了 a 和 b 的内容。</p><p>为了方便你观察，我在测试用例中以注释的形式把字节码列出来了。可以看到，列表的加法操作并没有引入新的字节码，与整数一样，使用了 BINARY_ADD 来进行列表的相加操作。我们知道，BINARY_ADD 的实现依赖于对象的 add 方法。为了支持列表类型的加法操作，就需要在 ListKlass 中增加加法操作的实现。这是比较容易的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* ListKlass::add(HiObject* x, HiObject* y) {</span></span>
<span class="line"><span>   HiList* lx = (HiList*)x;</span></span>
<span class="line"><span>   assert(lx &amp;&amp; lx-&gt;klass() == (Klass*) this);</span></span>
<span class="line"><span>   HiList* ly = (HiList*)y;</span></span>
<span class="line"><span>   assert(ly &amp;&amp; ly-&gt;klass() == (Klass*) this);</span></span>
<span class="line"><span>   HiList* z = new HiList();</span></span>
<span class="line"><span>   for (int i = 0; i &lt; lx-&gt;size(); i++) {</span></span>
<span class="line"><span>       z-&gt;inner_list()-&gt;set(i, lx-&gt;inner_list()-&gt;get(i));</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   for (int i = 0; i &lt; ly-&gt;size(); i++) {</span></span>
<span class="line"><span>       z-&gt;inner_list()-&gt;set(i + lx-&gt;size(),</span></span>
<span class="line"><span>               ly-&gt;inner_list()-&gt;get(i));</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return z;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 add 方法中，我们先创建一个新的空列表 z，然后把 x 里的所有元素都拷贝到 z 中去，再把y 中的所有元素都拷贝到 z 中去，最后把 z 返回给调用者就可以了。</p><p>和加法差不多，列表还支持乘法。列表只能与整数相乘，记整数为 n，那么列表 lst 乘以 n 的结果与 n 个 lst 相加的结果相同。</p><p>乘法对应的字节码是 BINARY_MULTIPLY，这个字节码的实现依赖于对象的 mul 方法。在ListKlass 中增加 mul 的实现就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HiObject* ListKlass::mul(HiObject* x, HiObject* y) {</span></span>
<span class="line"><span>   HiList * lx = (HiList*)x;</span></span>
<span class="line"><span>   assert(lx &amp;&amp; lx-&gt;klass() == (Klass*) this);</span></span>
<span class="line"><span>   HiInteger* iy = (HiInteger*)y;</span></span>
<span class="line"><span>   assert(iy &amp;&amp; iy-&gt;klass() == IntegerKlass::get_instance());</span></span>
<span class="line"><span>   HiList* z = new HiList();</span></span>
<span class="line"><span>   for (int i = 0; i &lt; iy-&gt;value(); i++) {</span></span>
<span class="line"><span>       for (int j = 0; j &lt; lx-&gt;size(); j++) {</span></span>
<span class="line"><span>           z-&gt;inner_list()-&gt;set(i * lx-&gt;size() + j,</span></span>
<span class="line"><span>                   lx-&gt;inner_list()-&gt;get(j));</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return z;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>乘法的逻辑也很直接，你可以与加法相互对照着研究。</p><p>到这里，列表的基本操作就全部完成了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课主要实现了几个内建方法，一是 list_pop，删除列表的最后一个元素；二是list_remove，从列表中删除由参数指定的那个元素；三是 list_reverse，将列表元素倒序排列；四是 list_sort，对列表元素进行升序排列。</p><p>这节课我们也引入了几个新的字节码来实现列表的相关操作：DELETE_SUBSCR 用来删除列表中指定下标对应的元素；GET_ITER 用来构建列表迭代器；FOR_ITER 可以通过迭代器访问元素，如果遍历结束就跳转到目标代码执行。</p><p>最后，我们还介绍了列表的加法，乘法等操作。</p><p>通过第 13 节课和第 14 节课，我们实现了列表的几个最重要的基本操作，包括列表的构建，对列表元素的增、删、查、改、遍历列表元素、对列表元素进行排序等等。列表的功能已经基本完备，从下节课开始，我们将重点实现另外一个基本的数据结构：字典。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你查看一下，Python 3.8 中列表还有哪些内建方法我们尚未实现？欢迎你把你查找到的结果分享到评论区，我们一起讨论，如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给身边的朋友，我们下节课再见！</p>`,106)])])}const E=a(l,[["render",t]]);export{g as __pageData,E as default};
