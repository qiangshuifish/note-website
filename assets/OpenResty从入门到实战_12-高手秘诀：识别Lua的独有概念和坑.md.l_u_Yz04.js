import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"12 | 高手秘诀：识别Lua的独有概念和坑","description":"","frontmatter":{},"headers":[{"level":2,"title":"弱表","slug":"弱表","link":"#弱表","children":[]},{"level":2,"title":"闭包和 upvalue","slug":"闭包和-upvalue","link":"#闭包和-upvalue","children":[]},{"level":2,"title":"常见的坑","slug":"常见的坑","link":"#常见的坑","children":[{"level":3,"title":"下标从 0 开始还是从 1 开始","slug":"下标从-0-开始还是从-1-开始","link":"#下标从-0-开始还是从-1-开始","children":[]},{"level":3,"title":"正则模式匹配","slug":"正则模式匹配","link":"#正则模式匹配","children":[]},{"level":3,"title":"json 编码时无法区分 array 和 dict","slug":"json-编码时无法区分-array-和-dict","link":"#json-编码时无法区分-array-和-dict","children":[]},{"level":3,"title":"变量的个数限制","slug":"变量的个数限制","link":"#变量的个数限制","children":[]}]},{"level":2,"title":"写在最后","slug":"写在最后","link":"#写在最后","children":[]}],"relativePath":"OpenResty从入门到实战/12-高手秘诀：识别Lua的独有概念和坑.md","filePath":"OpenResty从入门到实战/12-高手秘诀：识别Lua的独有概念和坑.md","lastUpdated":1779816093000}'),l={name:"OpenResty从入门到实战/12-高手秘诀：识别Lua的独有概念和坑.md"};function t(c,a,o,i,d,u){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_12-高手秘诀-识别lua的独有概念和坑" tabindex="-1">12 | 高手秘诀：识别Lua的独有概念和坑 <a class="header-anchor" href="#_12-高手秘诀-识别lua的独有概念和坑" aria-label="Permalink to &quot;12 | 高手秘诀：识别Lua的独有概念和坑&quot;">​</a></h1><p>你好，我是温铭。</p><p>上一节中，我们一起了解了 LuaJIT 中 table 相关的库函数。除了这些常用的函数外，今天我再为你介绍一些Lua 独有的或不太常用的概念，以及 OpenResty 中常见的 Lua 的坑。</p><h2 id="弱表" tabindex="-1">弱表 <a class="header-anchor" href="#弱表" aria-label="Permalink to &quot;弱表&quot;">​</a></h2><p>首先是 <code>弱表</code>（weak table），它是 Lua 中很独特的一个概念，和垃圾回收相关。和其他高级语言一样，Lua 是自动垃圾回收的，你不用关心具体的实现，也不用显式 GC。没有被引用到的空间，会被垃圾收集器自动完成回收。</p><p>但简单的引用计数还不太够用，有时候我们需要一种更灵活的机制。举个例子，我们把一个 Lua 的对象 <code>Foo</code>（table 或者函数）插入到 table <code>tb</code> 中，这就会产生对这个对象 <code>Foo</code> 的引用。即使没有其他地方引用 <code>Foo</code>， <code>tb</code> 对它的引用也还一直存在，那么 GC 就没有办法回收 <code>Foo</code> 所占用的内存。这时候，我们就只有两种选择：</p><ul><li>一是手工释放 <code>Foo</code>；</li><li>二是让它常驻内存。</li></ul><p>比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local tb = {}</span></span>
<span class="line"><span>tb[1] = {red}</span></span>
<span class="line"><span>tb[2] = function() print(&quot;func&quot;) end</span></span>
<span class="line"><span>print(#tb) -- 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>collectgarbage()</span></span>
<span class="line"><span>print(#tb) -- 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>table.remove(tb, 1)</span></span>
<span class="line"><span>print(#tb) -- 1</span></span></code></pre></div><p>不过，你肯定不希望，内存一直被用不到的对象占用着吧，特别是 LuaJIT 中还有 2G 内存的上限。而手工释放的时机并不好把握，也会增加代码的复杂度。</p><p>那么这时候，就轮到弱表来大显身手了。看它的名字，弱表，首先它是一个表，然后这个表里面的所有元素都是弱引用。概念总是抽象的，让我们先来看一段稍加修改后的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local tb = {}</span></span>
<span class="line"><span>tb[1] = {red}</span></span>
<span class="line"><span>tb[2] = function() print(&quot;func&quot;) end</span></span>
<span class="line"><span>setmetatable(tb, {__mode = &quot;v&quot;})</span></span>
<span class="line"><span>print(#tb)  -- 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>collectgarbage()</span></span>
<span class="line"><span>print(#tb) -- 0</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>可以看到，没有被使用的对象都被 GC 了。这其中，最重要的就是下面这一行代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>setmetatable(tb, {__mode = &quot;v&quot;})</span></span></code></pre></div><p>是不是似曾相识？这不就是元表的操作吗！没错，当一个 table 的元表中存在 <code>__mode</code> 字段时，这个 table 就是弱表（weak table）了。</p><ul><li>如果 <code>__mode</code> 的值是 <code>k</code>，那就意味着这个 table 的 <code>键</code> 是弱引用。</li><li>如果 <code>__mode</code> 的值是 <code>v</code>，那就意味着这个 table 的 <code>值</code> 是弱引用。</li><li>当然，你也可以设置为 <code>kv</code>，表明这个表的键和值都是弱引用。</li></ul><p>这三者中的任意一种弱表，只要它的 <code>键</code> 或者 <code>值</code> 被回收了，那么对应的 <strong>整个</strong> <code>键值</code> 对象都会被回收。</p><p>在上面的代码示例中， <code>__mode</code> 的值 <code>v</code>，而 <code>tb</code> 是一个数组，数组的 <code>value</code> 则是 table 和函数对象，所以可以被自动回收。不过，如果你把 <code>__mode</code> 的值改为 <code>k</code>，就不会 GC 了，比如看下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local tb = {}</span></span>
<span class="line"><span>tb[1] = {red}</span></span>
<span class="line"><span>tb[2] = function() print(&quot;func&quot;) end</span></span>
<span class="line"><span>setmetatable(tb, {__mode = &quot;k&quot;})</span></span>
<span class="line"><span>print(#tb)  -- 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>collectgarbage()</span></span>
<span class="line"><span>print(#tb) -- 2</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>请注意，这里我们只演示了 <code>value</code> 为弱引用的弱表，也就是数组类型的弱表。自然，你同样可以把对象作为 <code>key</code>，来构建哈希表类型的弱表，比如下面这样写：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local tb = {}</span></span>
<span class="line"><span>tb[{color = red}] = &quot;red&quot;</span></span>
<span class="line"><span>local fc = function() print(&quot;func&quot;) end</span></span>
<span class="line"><span>tb[fc] = &quot;func&quot;</span></span>
<span class="line"><span>fc = nil</span></span>
<span class="line"><span></span></span>
<span class="line"><span>setmetatable(tb, {__mode = &quot;k&quot;})</span></span>
<span class="line"><span>for k,v in pairs(tb) do</span></span>
<span class="line"><span>     print(v)</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>collectgarbage()</span></span>
<span class="line"><span>print(&quot;----------&quot;)</span></span>
<span class="line"><span>for k,v in pairs(tb) do</span></span>
<span class="line"><span>     print(v)</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>在手动调用 <code>collectgarbage()</code> 进行强制 GC 后， <code>tb</code> 整个 table 里面的元素，就已经全部被回收了。当然，在实际的代码中，我们大可不必手动调用 <code>collectgarbage()</code>，它会在后台自动运行，无须我们担心。</p><p>不过，既然提到了 <code>collectgarbage()</code> 这个函数，我就再多说几句。这个函数其实可以传入多个不同的选项，且默认是 <code>collect</code>，即完整的 GC。另一个比较有用的是 <code>count</code>，它可以返回 Lua 占用的内存空间大小。这个统计数据很有用，可以让你看出是否存在内存泄漏，也可以提醒我们不要接近 2G 的上限值。</p><p>弱表相关的代码，在实际应用中会写得比较复杂，不太容易理解，相对应的，也会隐藏更多的 bug。具体有哪些呢？不必着急，后面内容，我会专门介绍一个开源项目中，使用弱表带来的内存泄漏问题。</p><h2 id="闭包和-upvalue" tabindex="-1">闭包和 upvalue <a class="header-anchor" href="#闭包和-upvalue" aria-label="Permalink to &quot;闭包和 upvalue&quot;">​</a></h2><p>再来看闭包和 upvalue。前面我强调过，在 Lua 中，所有的值都是一等公民，包含函数也是。这就意味着函数可以保存在变量中，当作参数传递，以及作为另一个函数的返回值。比如在上面弱表中出现的这段示例代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tb[2] = function() print(&quot;func&quot;) end</span></span></code></pre></div><p>其实就是把一个匿名函数，作为 table 的值给存储了起来。</p><p>在 Lua 中，下面这段代码中动两个函数的定义是完全等价的。不过注意，后者是把函数赋值给一个变量，这也是我们经常会用到的一种方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local function foo() print(&quot;foo&quot;) end</span></span>
<span class="line"><span>local foo = fuction() print(&quot;foo&quot;) end</span></span></code></pre></div><p>另外，Lua 支持把一个函数写在另外一个函数里面，即嵌套函数，比如下面的示例代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;</span></span>
<span class="line"><span>local function foo()</span></span>
<span class="line"><span>     local i = 1</span></span>
<span class="line"><span>     local function bar()</span></span>
<span class="line"><span>         i = i + 1</span></span>
<span class="line"><span>         print(i)</span></span>
<span class="line"><span>     end</span></span>
<span class="line"><span>     return bar</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>local fn = foo()</span></span>
<span class="line"><span>print(fn()) -- 2</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>你可以看到， <code>bar</code> 这个函数可以读取函数 <code>foo</code> 里面的局部变量 <code>i</code>，并修改它的值，即使这个变量并不在 <code>bar</code> 里面定义。这个特性叫做词法作用域（lexical scoping）。</p><p>事实上，Lua 的这些特性正是闭包的基础。所谓 <code>闭包</code> ，简单地理解，它其实是一个函数，不过它访问了另外一个函数词法作用域中的变量。</p><p>如果按照闭包的定义来看，Lua 的所有函数实际上都是闭包，即使你没有嵌套。这是因为 Lua 编译器会把 Lua 脚本外面，再包装一层主函数。比如下面这几行简单的代码段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local foo, bar</span></span>
<span class="line"><span>local function fn()</span></span>
<span class="line"><span>     foo = 1</span></span>
<span class="line"><span>     bar = 2</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>在编译后，就会变为下面的样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function main(...)</span></span>
<span class="line"><span>     local foo, bar</span></span>
<span class="line"><span>     local function fn()</span></span>
<span class="line"><span>         foo = 1</span></span>
<span class="line"><span>         bar = 2</span></span>
<span class="line"><span>     end</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>而函数 <code>fn</code> 捕获了主函数的两个局部变量，因此也是闭包。</p><p>当然，我们知道，很多语言中都有闭包的概念，它并非 Lua 独有，你也可以对比着来加深理解。只有理解了闭包，你才能明白我们接下来要讲的 upvalue。</p><p>upvalue 就是 Lua 中独有的概念了。从字面意思来看，可以翻译成 <code>上面的值</code>。实际上，upvalue 就是闭包中捕获的自己词法作用域外的那个变量。还是继续看上面那段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local foo, bar</span></span>
<span class="line"><span>local function fn()</span></span>
<span class="line"><span>     foo = 1</span></span>
<span class="line"><span>     bar = 2</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>你可以看到，函数 <code>fn</code> 捕获了两个不在自己词法作用域的局部变量 <code>foo</code> 和 <code>bar</code>，而这两个变量，实际上就是函数 <code>fn</code> 的 upvalue。</p><h2 id="常见的坑" tabindex="-1">常见的坑 <a class="header-anchor" href="#常见的坑" aria-label="Permalink to &quot;常见的坑&quot;">​</a></h2><p>介绍了 Lua 中的几个概念后，我再来说说，在 OpenResty 开发中遇到的那些和 Lua 相关的坑。</p><p>在前面内容中，我们提到了一些 Lua 和其他开发语言不同的点，比如下标从 1 开始、默认全局变量等等。在 OpenResty 实际的代码开发中，我们还会遇到更多和 Lua、 LuaJIT 相关的问题点， 下面我会讲其中一些比较常见的。</p><p>这里要先提醒一下，即使你知道了所有的 <code>坑</code>，但不可避免的，估计还是要自己踩过之后才能印象深刻。当然，不同的是，你能够更块地从坑里面爬出来，并找到症结所在。</p><h3 id="下标从-0-开始还是从-1-开始" tabindex="-1">下标从 0 开始还是从 1 开始 <a class="header-anchor" href="#下标从-0-开始还是从-1-开始" aria-label="Permalink to &quot;下标从 0 开始还是从 1 开始&quot;">​</a></h3><p>第一个坑，Lua 的下标是从 1 开始的，这点我们之前反复提及过。但我不得不说，这并非事实的全部。</p><p>因为在 LuaJIT 中，使用 <code>ffi.new</code> 创建的数组，下标又是从 0 开始的:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local buf = ffi_new(&quot;char[?]&quot;, 128)</span></span></code></pre></div><p>所以，如果你要访问上面这段代码中 <code>buf</code> 这个 cdata，请记得下标从 0 开始，而不是 1。在使用 FFI 和 C 交互的时候，一定要特别注意这个地方。</p><h3 id="正则模式匹配" tabindex="-1">正则模式匹配 <a class="header-anchor" href="#正则模式匹配" aria-label="Permalink to &quot;正则模式匹配&quot;">​</a></h3><p>第二个坑，正则模式匹配问题。OpenResty 中并行着两套字符串匹配方法：Lua 自带的 <code>sting</code> 库，以及 OpenResty 提供的 <code>ngx.re.*</code> API。</p><p>其中， Lua 正则模式匹配是自己独有的格式，和 PCRE 的写法不同。下面是一个简单的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>resty -e &#39;print(string.match(&quot;foo 123 bar&quot;, &quot;%d%d%d&quot;))&#39;  — 123</span></span></code></pre></div><p>这段代码从字符串中提取了数字部分，你会发现，它和我们的熟悉的正则表达式完全不同。Lua 自带的正则匹配库，不仅代码维护成本高，而且性能低——不能被 JIT，而且被编译过一次的模式也不会被缓存。</p><p>所以，在你使用 Lua 内置的 string 库去做 find、match 等操作时，如果有类似正则这样的需求，不用犹豫，请直接使用 OpenResty 提供的 <code>ngx.re</code> 来替代。只有在查找固定字符串的时候，我们才考虑使用 plain 模式来调用 string 库。</p><p><strong>这里我有一个建议：在 OpenResty 中，我们总是优先使用 OpenResty 的 API，然后是 LuaJIT 的 API，使用 Lua 库则需要慎之又慎</strong>。</p><h3 id="json-编码时无法区分-array-和-dict" tabindex="-1">json 编码时无法区分 array 和 dict <a class="header-anchor" href="#json-编码时无法区分-array-和-dict" aria-label="Permalink to &quot;json 编码时无法区分 array 和 dict&quot;">​</a></h3><p>第三个坑，json 编码时无法区分 array 和 dict。由于 Lua 中只有 table 这一个数据结构，所以在 json 对空 table 编码的时候，自然就无法确定编码为数组还是字典：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>resty -e &#39;local cjson = require &quot;cjson&quot;</span></span>
<span class="line"><span>local t = {}</span></span>
<span class="line"><span>print(cjson.encode(t))</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>比如上面这段代码，它的输出是 <code>{}</code>，由此可见， OpenResty 的 cjson 库，默认把空 table 当做字典来编码。当然，我们可以通过 <code>encode_empty_table_as_object</code> 这个函数，来修改这个全局的默认值：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>resty -e &#39;local cjson = require &quot;cjson&quot;</span></span>
<span class="line"><span>cjson.encode_empty_table_as_object(false)</span></span>
<span class="line"><span>local t = {}</span></span>
<span class="line"><span>print(cjson.encode(t))</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>这次，空 table 就被编码为了数组： <code>[]</code>。</p><p>不过，全局这种设置的影响面比较大，那能不能指定某个 table 的编码规则呢？答案自然是可以的，我们有两种方法可以做到。</p><p>第一种方法，把 <code>cjson.empty_array</code> 这个 userdata 赋值给指定 table。这样，在 json 编码的时候，它就会被当做空数组来处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local cjson = require &quot;cjson&quot;</span></span>
<span class="line"><span>local t = cjson.empty_array</span></span>
<span class="line"><span>print(cjson.encode(t))</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>不过，有时候我们并不确定，这个指定的 table 是否一直为空。我们希望当它为空的时候编码为数组，那么就要用到 <code>cjson.empty_array_mt</code> 这个函数，也就是我们的第二个方法。</p><p>它会标记好指定的 table，当 table 为空时编码为数组。从 <code>cjson.empty_array_mt</code> 这个命名你也可以看出，它是通过 metatable 的方式进行设置的，比如下面这段代码操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ resty -e &#39;local cjson = require &quot;cjson&quot;</span></span>
<span class="line"><span>local t = {}</span></span>
<span class="line"><span>setmetatable(t, cjson.empty_array_mt)</span></span>
<span class="line"><span>print(cjson.encode(t))</span></span>
<span class="line"><span>t = {123}</span></span>
<span class="line"><span>print(cjson.encode(t))</span></span>
<span class="line"><span>&#39;</span></span></code></pre></div><p>你可以在本地执行一下这段代码，看看输出和你预期的是否一致。</p><h3 id="变量的个数限制" tabindex="-1">变量的个数限制 <a class="header-anchor" href="#变量的个数限制" aria-label="Permalink to &quot;变量的个数限制&quot;">​</a></h3><p>再来看第四个坑，变量的个数限制问题。 Lua 中，一个函数的局部变量的个数，和 upvalue 的个数都是有上限的，你可以从 Lua 的源码中得到印证：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>&amp;#64;&amp;#64; LUAI_MAXVARS is the maximum number of local variables per function</span></span>
<span class="line"><span>&amp;#64;* (must be smaller than 250).</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>#define LUAI_MAXVARS            200</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>&amp;#64;&amp;#64; LUAI_MAXUPVALUES is the maximum number of upvalues per function</span></span>
<span class="line"><span>&amp;#64;* (must be smaller than 250).</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>#define LUAI_MAXUPVALUES        60</span></span></code></pre></div><p>这两个阈值，分别被硬编码为 200 和 60。虽说你可以手动修改源码来调整这两个值，不过最大也只能设置为 250。</p><p>一般情况下，我们不会超过这个阈值，但写 OpenResty 代码的时候，你还是要留意这个事情，不要过多地使用局部变量和 upvalue，而是要尽可能地使用 <code>do .. end</code> 做一层封装，来减少局部变量和 upvalue 的个数。</p><p>比如我们来看下面这段伪码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>local re_find = ngx.re.find</span></span>
<span class="line"><span>  function foo() ... end</span></span>
<span class="line"><span>function bar() ... end</span></span>
<span class="line"><span>function fn() ... end</span></span></code></pre></div><p>如果只有函数 <code>foo</code> 使用到了 <code>re_find</code>， 那么我们可以这样改造下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>do</span></span>
<span class="line"><span>     local re_find = ngx.re.find</span></span>
<span class="line"><span>     function foo() ... end</span></span>
<span class="line"><span>end</span></span>
<span class="line"><span>function bar() ... end</span></span>
<span class="line"><span>function fn() ... end</span></span></code></pre></div><p>这样一来，在 <code>main</code> 函数的层面上，就少了 <code>re_find</code> 这个局部变量。这在单个的大的 Lua 文件中，算是一个优化技巧。</p><h2 id="写在最后" tabindex="-1">写在最后 <a class="header-anchor" href="#写在最后" aria-label="Permalink to &quot;写在最后&quot;">​</a></h2><p>从“多问几个为什么”的角度出发，Lua 中 250 这个阈值是从何而来的呢？这算是我们今天的思考题，欢迎你留言说下你的看法，也欢迎你把这篇文章分享给你的同事、朋友，我们一起交流，一起进步。</p>`,84)])])}const h=s(l,[["render",t]]);export{b as __pageData,h as default};
