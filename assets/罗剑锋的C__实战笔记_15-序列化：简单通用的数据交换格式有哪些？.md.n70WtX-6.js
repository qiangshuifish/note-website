import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"15 | 序列化：简单通用的数据交换格式有哪些？","description":"","frontmatter":{},"headers":[{"level":2,"title":"JSON","slug":"json","link":"#json","children":[]},{"level":2,"title":"MessagePack","slug":"messagepack","link":"#messagepack","children":[]},{"level":2,"title":"ProtoBuffer","slug":"protobuffer","link":"#protobuffer","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"课下作业","slug":"课下作业","link":"#课下作业","children":[]}],"relativePath":"罗剑锋的C++实战笔记/15-序列化：简单通用的数据交换格式有哪些？.md","filePath":"罗剑锋的C++实战笔记/15-序列化：简单通用的数据交换格式有哪些？.md","lastUpdated":1779821799000}'),t={name:"罗剑锋的C++实战笔记/15-序列化：简单通用的数据交换格式有哪些？.md"};function l(i,s,o,c,r,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_15-序列化-简单通用的数据交换格式有哪些" tabindex="-1">15 | 序列化：简单通用的数据交换格式有哪些？ <a class="header-anchor" href="#_15-序列化-简单通用的数据交换格式有哪些" aria-label="Permalink to &quot;15 | 序列化：简单通用的数据交换格式有哪些？&quot;">​</a></h1><p>你好，我是Chrono。</p><p>在前面的三个单元里，我们学习了C++的语言特性和标准库，算是把C++的编程范式、生命周期、核心特性、标准库的内容整体过了一遍。从今天起，我们的学习之旅又将开启一个新的篇章。</p><p>C++语言和标准库很强大，功能灵活，组件繁多，但也只能说是构建软件这座大厦的基石。想要仅凭它们去“包打天下”，不能说是绝对不可行，但至少是“吃力难讨好”。</p><p>还是那句老话：“不要重复发明轮子。”（Reinventing the wheel）虽然很多C++程序员都热衷于此，但我觉得对于你我这样的“凡人”，还是要珍惜自己的时间和精力，把有限的资源投入到能有更多产出的事情上。</p><p>所以，接下来的这几节课，我会介绍一些第三方工具，精选出序列化/反序列化、网络通信、脚本语言混合编程和性能分析这四类工具，弥补标准库的不足，节约你的开发成本，让你的工作更有效率。</p><p>今天，我先来说一下序列化和反序列化。这两个功能在软件开发中经常遇到，你可能很熟悉了，所以我只简单解释一下。</p><p>序列化，就是把内存里“活的对象”转换成静止的字节序列，便于存储和网络传输；而反序列化则是反向操作，从静止的字节序列重新构建出内存里可用的对象。</p><p>我借用《三体》里的内容，打一个形象的比喻：序列化就是“三体人”的脱水，变成干纤维，在乱纪元方便存储运输；反序列化就是“三体人”的浸泡，在恒纪元由干纤维再恢复成活生生的人。（即使没读过《三体》，也是很好理解的吧？）</p><p>接下来，我就和你介绍三种既简单又高效的数据交换格式：JSON、MessagePack和ProtoBuffer，看看在C++里怎么对数据做序列化和反序列化。</p><h2 id="json" tabindex="-1">JSON <a class="header-anchor" href="#json" aria-label="Permalink to &quot;JSON&quot;">​</a></h2><p>JSON是一种轻量级的数据交换格式，采用纯文本表示，所以是“human readable”，阅读和修改都很方便。</p><p>由于JSON起源于“最流行的脚本语言”JavaScript，所以它也随之得到了广泛的应用，在Web开发领域几乎已经成为了事实上的标准，而且还渗透到了其他的领域。比如很多数据库就支持直接存储JSON数据，还有很多应用服务使用JSON作为配置接口。</p><p>在 <a href="https://www.json.org/json-zh.html" target="_blank" rel="noreferrer">JSON的官方网站</a> 上，你可以找到大量的C++实现，不过用起来都差不多。因为JSON本身就是个KV结构，很容易映射到类似map的关联数组操作方式。</p><p>如果不是特别在意性能的话，选个你自己喜欢的就好。否则，你就要做一下测试，看哪一个更适合你的应用场景。</p><p>不过我觉得，JSON格式注重的是方便易用，在性能上没有太大的优势，所以 <strong>一般选择JSON来交换数据，通常都不会太在意性能（不然肯定会改换其他格式了），还是自己用着顺手最重要</strong>。</p><p>下面就来说说我的个人推荐：“ <a href="https://github.com/nlohmann/json" target="_blank" rel="noreferrer">JSON for Modern C++</a>”这个库。</p><p>JSON for Modern C++可能不是最小最快的JSON解析工具，但功能足够完善，而且使用方便，仅需要包含一个头文件“json.hpp”，没有外部依赖，也不需要额外的安装、编译、链接工作，适合快速上手开发。</p><p>JSON for Modern C++可以用“git clone”下载源码，或者更简单一点，直接用wget获取头文件就行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>git clone git&amp;#64;github.com:nlohmann/json.git    # git clone</span></span>
<span class="line"><span>wget https://github.com/nlohmann/json/releases/download/v3.7.3/json.hpp  # wget</span></span></code></pre></div><p>JSON for Modern C++使用一个json类来表示JSON数据，为了避免说的时候弄混，我给这个类起了个别名json_t：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>using json_t = nlohmann::json;</span></span></code></pre></div><p>json_t的序列化功能很简单，和标准容器map一样，用关联数组的“[]”来添加任意数据。</p><p>你不需要特别指定数据的类型，它会自动推导出恰当的类型。比如，连续多个“[]”就是嵌套对象，array、vector或者花括号形式的初始化列表就是JSON数组，map或者是花括号形式的pair就是JSON对象，非常自然：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>json_t j;                                   // JSON对象</span></span>
<span class="line"><span></span></span>
<span class="line"><span>j[&quot;age&quot;] = 23;                              // &quot;age&quot;:23</span></span>
<span class="line"><span>j[&quot;name&quot;] = &quot;spiderman&quot;;                    // &quot;name&quot;:&quot;spiderman&quot;</span></span>
<span class="line"><span>j[&quot;gear&quot;][&quot;suits&quot;] = &quot;2099&quot;;                // &quot;gear&quot;:{&quot;suits&quot;:&quot;2099&quot;}</span></span>
<span class="line"><span>j[&quot;jobs&quot;] = {&quot;superhero&quot;};                  // &quot;jobs&quot;:[&quot;superhero&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vector&amp;lt;int&amp;gt; v = {1,2,3};                   // vector容器</span></span>
<span class="line"><span>j[&quot;numbers&quot;] = v;                          // &quot;numbers&quot;:[1,2,3]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>map&amp;lt;string, int&amp;gt; m =                       // map容器</span></span>
<span class="line"><span>    {​{&quot;one&quot;,1}, {&quot;two&quot;, 2}​};               // 初始化列表</span></span>
<span class="line"><span>j[&quot;kv&quot;] = m;                               // &quot;kv&quot;:{&quot;one&quot;:1,&quot;two&quot;:2}</span></span></code></pre></div><p>添加完之后，用成员函数dump()就可以序列化，得到它的JSON文本形式。默认的格式是紧凑输出，没有缩进，如果想要更容易阅读的话，可以加上指示缩进的参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &amp;lt;&amp;lt; j.dump() &amp;lt;&amp;lt; endl;         // 序列化，无缩进</span></span>
<span class="line"><span>cout &amp;lt;&amp;lt; j.dump(2) &amp;lt;&amp;lt; endl;        // 序列化，有缩进，2个空格</span></span></code></pre></div><p>json_t的反序列化功能同样也很简单，只要调用静态成员函数parse()就行，直接得到JSON对象，而且可以用auto自动推导类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>string str = R&quot;({                // JSON文本，原始字符串</span></span>
<span class="line"><span>    &quot;name&quot;: &quot;peter&quot;,</span></span>
<span class="line"><span>    &quot;age&quot; : 23,</span></span>
<span class="line"><span>    &quot;married&quot; : true</span></span>
<span class="line"><span>})&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto j = json_t::parse(str);    // 从字符串反序列化</span></span>
<span class="line"><span>assert(j[&quot;age&quot;] == 23);        // 验证序列化是否正确</span></span>
<span class="line"><span>assert(j[&quot;name&quot;] == &quot;peter&quot;);</span></span></code></pre></div><p>json_t使用异常来处理解析时可能发生的错误，如果你不能保证JSON数据的完整性，就要使用try-catch来保护代码，防止错误数据导致程序崩溃：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto txt = &quot;bad:data&quot;s;        // 不是正确的JSON数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>try                             // try保护代码</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto j = json_t::parse(txt);// 从字符串反序列化</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch(std::exception&amp; e)        // 捕获异常</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于通常的应用来说，掌握了基本的序列化和反序列化就够用了，不过JSON for Modern C++里还有很多高级用法，比如SAX、BSON、自定义类型转换等。如果你需要这些功能，可以去看 <a href="https://github.com/nlohmann/json" target="_blank" rel="noreferrer">它的文档</a>，里面写得都很详细。</p><h2 id="messagepack" tabindex="-1">MessagePack <a class="header-anchor" href="#messagepack" aria-label="Permalink to &quot;MessagePack&quot;">​</a></h2><p>说完JSON，再来说另外第二种格式：MessagePack。</p><p>它也是一种轻量级的数据交换格式，与JSON的不同之处在于它不是纯文本，而是二进制。所以MessagePack就比JSON更小巧，处理起来更快，不过也就没有JSON那么直观、易读、好修改了。</p><p>由于二进制这个特点，MessagePack也得到了广泛的应用，著名的有Redis、Pinterest。</p><p>MessagePack支持几乎所有的编程语言，你可以在 <a href="https://msgpack.org/" target="_blank" rel="noreferrer">官网</a> 上找到它的C++实现。</p><p>我常用的是官方库msgpack-c，可以用apt-get直接安装。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apt-get install libmsgpack-dev</span></span></code></pre></div><p>但这种安装方式有个问题，可能发行方仓库里的是老版本（像Ubuntu 16.04就是0.57），缺失很多功能，所以最好是从 <a href="https://github.com/msgpack/msgpack-c" target="_blank" rel="noreferrer">GitHub</a> 上下载最新版，编译时手动指定包含路径：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>git clone git&amp;#64;github.com:msgpack/msgpack-c.git</span></span>
<span class="line"><span></span></span>
<span class="line"><span>g++ msgpack.cpp -std=c++14 -I../common/include -o a.out</span></span></code></pre></div><p>和JSON for Modern C++一样，msgpack-c也是仅头文件的库（head only），只要包含一个头文件“msgpack.hpp”就行了，不需要额外的编译链接选项（C版本需要用“-lmsgpackc”链接）。</p><p>但MessagePack的设计理念和JSON是完全不同的，它没有定义JSON那样的数据结构，而是比较底层，只能对基本类型和标准容器序列化/反序列化，需要你自己去组织、整理要序列化的数据。</p><p>我拿vector容器来举个例子，调用pack()函数序列化为MessagePack格式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vector&amp;lt;int&amp;gt; v = {1,2,3,4,5};              // vector容器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>msgpack::sbuffer sbuf;                    // 输出缓冲区</span></span>
<span class="line"><span>msgpack::pack(sbuf, v);                   // 序列化</span></span></code></pre></div><p>从代码里你可以看到，它的用法不像JSON那么简单直观， <strong>必须同时传递序列化的输出目标和被序列化的对象</strong>。</p><p>输出目标sbuffer是个简单的缓冲区，你可以把它理解成是对字符串数组的封装，和 <code>vector&amp;lt;char&gt;</code> 很像，也可以用data()和size()方法获取内部的数据和长度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &amp;lt;&amp;lt; sbuf.size() &amp;lt;&amp;lt; endl;            // 查看序列化后数据的长度</span></span></code></pre></div><p>除了sbuffer，你还可以选择另外的zbuffer、fbuffer。它们是压缩输出和文件输出，和sbuffer只是格式不同，用法是相同的，所以后面我就都用sbuffer来举例说明。</p><p>MessagePack反序列化的时候略微麻烦一些，要用到函数unpack()和两个核心类：object_handle和object。</p><p>函数unpack()反序列化数据，得到的是一个object_handle，再调用get()，就是object：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto handle = msgpack::unpack(          // 反序列化</span></span>
<span class="line"><span>            sbuf.data(), sbuf.size());  // 输入二进制数据</span></span>
<span class="line"><span>auto obj = handle.get();                // 得到反序列化对象</span></span></code></pre></div><p>这个object是MessagePack对数据的封装，相当于JSON for Modern C++的JSON对象，但你不能直接使用，必须知道数据的原始类型，才能转换还原：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vector&amp;lt;int&amp;gt; v2;                       // vector容器</span></span>
<span class="line"><span>obj.convert(v2);                      // 转换反序列化的数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(std::equal(                    // 算法比较两个容器</span></span>
<span class="line"><span>      begin(v), end(v), begin(v2)));</span></span></code></pre></div><p>因为MessagePack不能直接打包复杂数据，所以用起来就比JSON麻烦一些，你必须自己把数据逐个序列化，连在一起才行。</p><p>好在MessagePack又提供了一个packer类，可以实现串联的序列化操作，简化代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>msgpack::sbuffer sbuf;                         // 输出缓冲区</span></span>
<span class="line"><span>msgpack::packer&amp;lt;decltype(sbuf)&amp;gt; packer(sbuf);  // 专门的序列化对象</span></span>
<span class="line"><span></span></span>
<span class="line"><span>packer.pack(10).pack(&quot;monado&quot;s)                // 连续序列化多个数据</span></span>
<span class="line"><span>      .pack(vector&amp;lt;int&amp;gt;{1,2,3});</span></span></code></pre></div><p>对于多个对象连续序列化后的数据，反序列化的时候可以用一个偏移量（offset）参数来同样连续操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for(decltype(sbuf.size()) offset = 0;          // 初始偏移量是0</span></span>
<span class="line"><span>    offset != sbuf.size();){                   // 直至反序列化结束</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto handle = msgpack::unpack(            // 反序列化</span></span>
<span class="line"><span>            sbuf.data(), sbuf.size(), offset);  // 输入二进制数据和偏移量</span></span>
<span class="line"><span>    auto obj = handle.get();                  // 得到反序列化对象</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但这样还是比较麻烦，能不能像JSON那样，直接对类型序列化和反序列化呢？</p><p>MessagePack为此提供了一个特别的宏：MSGPACK_DEFINE，把它放进你的类定义里，就可以像标准类型一样被MessagePack处理。</p><p>下面定义了一个简单的Book类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Book final                       // 自定义类</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    int         id;</span></span>
<span class="line"><span>    string      title;</span></span>
<span class="line"><span>    set&amp;lt;string&amp;gt; tags;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    MSGPACK_DEFINE(id, title, tags);   // 实现序列化功能的宏</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>它可以直接用于pack()和unpack()，基本上和JSON差不多了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Book book1 = {1, &quot;1984&quot;, {&quot;a&quot;,&quot;b&quot;}​};  // 自定义类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>msgpack::sbuffer sbuf;                    // 输出缓冲区</span></span>
<span class="line"><span>msgpack::pack(sbuf, book1);              // 序列化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto obj = msgpack::unpack(              // 反序列化</span></span>
<span class="line"><span>      sbuf.data(), sbuf.size()).get();   // 得到反序列化对象</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Book book2;</span></span>
<span class="line"><span>obj.convert(book2);                      // 转换反序列化的数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(book2.id == book1.id);</span></span>
<span class="line"><span>assert(book2.tags.size() == 2);</span></span>
<span class="line"><span>cout &amp;lt;&amp;lt; book2.title &amp;lt;&amp;lt; endl;</span></span></code></pre></div><p>使用MessagePack的时候，你也要注意数据不完整的问题，必须要用try-catch来保护代码，捕获异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto txt = &quot;&quot;s;                      // 空数据</span></span>
<span class="line"><span>try                                  // try保护代码</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto handle = msgpack::unpack(   // 反序列化</span></span>
<span class="line"><span>        txt.data(), txt.size());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch(std::exception&amp; e)            // 捕获异常</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="protobuffer" tabindex="-1">ProtoBuffer <a class="header-anchor" href="#protobuffer" aria-label="Permalink to &quot;ProtoBuffer&quot;">​</a></h2><p>第三个要说的库就是著名的 <a href="https://github.com/protocolbuffers/protobuf" target="_blank" rel="noreferrer">ProtoBuffer</a>，通常简称为PB，由Google出品。</p><p>PB也是一种二进制的数据格式，但毕竟是工业级产品，所以没有JSON和MessagePack那么“轻”，相关的东西比较多，要安装一个预处理器和开发库，编译时还要链接动态库（-lprotobuf）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apt-get install protobuf-compiler</span></span>
<span class="line"><span>apt-get install libprotobuf-dev</span></span>
<span class="line"><span></span></span>
<span class="line"><span>g++ protobuf.cpp -std=c++14 -lprotobuf -o a.out</span></span></code></pre></div><p><strong>PB的另一个特点是数据有“模式”（schema）</strong>，必须要先写一个IDL（Interface Description Language）文件，在里面定义好数据结构，只有预先定义了的数据结构，才能被序列化和反序列化。</p><p>这个特点既有好处也有坏处：一方面，接口就是清晰明确的规范文档，沟通交流简单无歧义；而另一方面，就是缺乏灵活性，改接口会导致一连串的操作，有点繁琐。</p><p>下面是一个简单的PB定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>syntax = &quot;proto2&quot;;                    // 使用第2版</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package sample;                        // 定义名字空间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>message Vendor                        // 定义消息</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    required uint32     id      = 1;  // required表示必须字段</span></span>
<span class="line"><span>    required string     name    = 2;  // 有int32/string等基本类型</span></span>
<span class="line"><span>    required bool       valid   = 3;  // 需要指定字段的序号，序列化时用</span></span>
<span class="line"><span>    optional string     tel     = 4;  // optional字段可以没有</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了接口定义文件，需要再用protoc工具生成对应的C++源码，然后把源码文件加入自己的项目中，就可以使用了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protoc --cpp_out=. sample.proto       // 生成C++代码</span></span></code></pre></div><p>由于PB相关的资料实在太多了，这里我就只简单说一下重要的接口：</p><ul><li>字段名会生成对应的has/set函数，检查是否存在和设置值；</li><li>IsInitialized()检查数据是否完整（required字段必须有值）；</li><li>DebugString()输出数据的可读字符串描述；</li><li>ByteSize()返回序列化数据的长度；</li><li>SerializeToString()从对象序列化到字符串；</li><li>ParseFromString()从字符串反序列化到对象；</li><li>SerializeToArray()/ParseFromArray()序列化的目标是字节数组。</li></ul><p>下面的代码示范了PB的用法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>using vendor_t = sample::Vendor;        // 类型别名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vendor_t v;                             // 声明一个PB对象</span></span>
<span class="line"><span>assert(!v.IsInitialized());            // required等字段未初始化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>v.set_id(1);                            // 设置每个字段的值</span></span>
<span class="line"><span>v.set_name(&quot;sony&quot;);</span></span>
<span class="line"><span>v.set_valid(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(v.IsInitialized());             // required等字段都设置了，数据完整</span></span>
<span class="line"><span>assert(v.has_id() &amp;&amp; v.id() == 1);</span></span>
<span class="line"><span>assert(v.has_name() &amp;&amp; v.name() == &quot;sony&quot;);</span></span>
<span class="line"><span>assert(v.has_valid() &amp;&amp; v.valid());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cout &amp;lt;&amp;lt; v.DebugString() &amp;lt;&amp;lt; endl;       // 输出调试字符串</span></span>
<span class="line"><span></span></span>
<span class="line"><span>string enc;</span></span>
<span class="line"><span>v.SerializeToString(&amp;enc);              // 序列化到字符串</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vendor_t v2;</span></span>
<span class="line"><span>assert(!v2.IsInitialized());</span></span>
<span class="line"><span>v2.ParseFromString(enc);               // 反序列化</span></span></code></pre></div><p>虽然业界很多大厂都在使用PB，但我觉得它真不能算是最好的，IDL定义和接口都太死板生硬，还只能用最基本的数据类型，不支持标准容器，在现代C++里显得“不太合群”，用起来有点别扭。</p><p>不过它后面有Google“撑腰”，而且最近几年又有gRPC“助拳”，所以很多时候也不得不用。</p><p>PB的另一个缺点是官方支持的编程语言太少，通用性较差，最常用的proto2只有C++、Java和Python。后来的proto3增加了对Go、Ruby等的支持，但仍然不能和JSON、MessagePack相比。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天我讲了三种数据交换格式：JSON、MessagePack和ProtoBuffer。</p><p>这三种数据格式各有特色，在很多领域都得到了广泛的应用，我来简单小结一下：</p><ol><li>JSON是纯文本，容易阅读，方便编辑，适用性最广；</li><li>MessagePack是二进制，小巧高效，在开源界接受程度比较高；</li><li>ProtoBuffer是工业级的数据格式，注重安全和性能，多用在大公司的商业产品里。</li></ol><p>有很多开源库支持这些数据格式，官方的、民间的都有，你应该选择适合自己的高质量库，必要的时候可以做些测试。</p><p>再补充一点，除了今天说的这三种，你还可以尝试其他的数据格式，比较知名的有Avro、Thrift，虽然它们有点冷门，但也有自己的独到之处（比如，天生支持RPC、可选择多种序列化格式和传输方式）。</p><h2 id="课下作业" tabindex="-1">课下作业 <a class="header-anchor" href="#课下作业" aria-label="Permalink to &quot;课下作业&quot;">​</a></h2><p>最后是课下作业时间，给你留两个思考题：</p><ol><li>为什么要有序列化和反序列化，直接memcpy内存数据行不行呢？</li><li>你最常用的是哪种数据格式？它有什么优缺点？</li></ol><p>欢迎你在留言区写下你的思考和答案，如果觉得今天的内容对你有所帮助，也欢迎分享给你的朋友。我们下节课见。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/245880/a39719e615f1124d60b5b9ca51b88cf1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/245880/a39719e615f1124d60b5b9ca51b88cf1.png" alt=""></a></p>`,95)])])}const h=a(t,[["render",l]]);export{g as __pageData,h as default};
