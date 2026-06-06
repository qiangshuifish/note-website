import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"03 | 列表和元组，到底用哪一个？","description":"","frontmatter":{},"headers":[{"level":2,"title":"列表和元组基础","slug":"列表和元组基础","link":"#列表和元组基础","children":[]},{"level":2,"title":"列表和元组存储方式的差异","slug":"列表和元组存储方式的差异","link":"#列表和元组存储方式的差异","children":[]},{"level":2,"title":"列表和元组的性能","slug":"列表和元组的性能","link":"#列表和元组的性能","children":[]},{"level":2,"title":"列表和元组的使用场景","slug":"列表和元组的使用场景","link":"#列表和元组的使用场景","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/03-列表和元组，到底用哪一个？.md","filePath":"Python核心技术与实战/03-列表和元组，到底用哪一个？.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/03-列表和元组，到底用哪一个？.md"};function i(t,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_03-列表和元组-到底用哪一个" tabindex="-1">03 | 列表和元组，到底用哪一个？ <a class="header-anchor" href="#_03-列表和元组-到底用哪一个" aria-label="Permalink to &quot;03 | 列表和元组，到底用哪一个？&quot;">​</a></h1><p>你好，我是景霄。</p><p>前面的课程，我们讲解了Python语言的学习方法，并且带你了解了Python必知的常用工具——Jupyter。那么从这节课开始，我们将正式学习Python的具体知识。</p><p>对于每一门编程语言来说，数据结构都是其根基。了解掌握Python的基本数据结构，对于学好这门语言至关重要。今天我们就一起来学习，Python中最常见的两种数据结构：列表（list）和元组（tuple）。</p><h2 id="列表和元组基础" tabindex="-1">列表和元组基础 <a class="header-anchor" href="#列表和元组基础" aria-label="Permalink to &quot;列表和元组基础&quot;">​</a></h2><p>首先，我们需要弄清楚最基本的概念，什么是列表和元组呢？</p><p>实际上，列表和元组，都是 <strong>一个可以放置任意数据类型的有序集合</strong>。</p><p>在绝大多数编程语言中，集合的数据类型必须一致。不过，对于Python的列表和元组来说，并无此要求：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, &#39;hello&#39;, &#39;world&#39;] # 列表中同时含有int和string类型的元素</span></span>
<span class="line"><span>l</span></span>
<span class="line"><span>[1, 2, &#39;hello&#39;, &#39;world&#39;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tup = (&#39;jason&#39;, 22) # 元组中同时含有int和string类型的元素</span></span>
<span class="line"><span>tup</span></span>
<span class="line"><span>(&#39;jason&#39;, 22)</span></span></code></pre></div><p>其次，我们必须掌握它们的区别。</p><ul><li><p><strong>列表是动态的</strong>，长度大小不固定，可以随意地增加、删减或者改变元素（mutable）。</p></li><li><p><strong>而元组是静态的</strong>，长度大小固定，无法增加删减或者改变（immutable）。</p></li></ul><p>下面的例子中，我们分别创建了一个列表与元组。你可以看到，对于列表，我们可以很轻松地让其最后一个元素，由4变为40；但是，如果你对元组采取相同的操作，Python 就会报错，原因就是元组是不可变的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4]</span></span>
<span class="line"><span>l[3] = 40 # 和很多语言类似，python中索引同样从0开始，l[3]表示访问列表的第四个元素</span></span>
<span class="line"><span>l</span></span>
<span class="line"><span>[1, 2, 3, 40]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tup = (1, 2, 3, 4)</span></span>
<span class="line"><span>tup[3] = 40</span></span>
<span class="line"><span>Traceback (most recent call last):</span></span>
<span class="line"><span>  File &quot;&amp;lt;stdin&amp;gt;&quot;, line 1, in &amp;lt;module&amp;gt;</span></span>
<span class="line"><span>TypeError: &#39;tuple&#39; object does not support item assignment</span></span></code></pre></div><p>可是，如果你想对已有的元组做任何&quot;改变&quot;，该怎么办呢？那就只能重新开辟一块内存，创建新的元组了。</p><p>比如下面的例子，我们想增加一个元素5给元组，实际上就是创建了一个新的元组，然后把原来两个元组的值依次填充进去。</p><p>而对于列表来说，由于其是动态的，我们只需简单地在列表末尾，加入对应元素就可以了。如下操作后，会修改原来列表中的元素，而不会创建新的列表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tup = (1, 2, 3, 4)</span></span>
<span class="line"><span>new_tup = tup + (5, ) # 创建新的元组new_tup，并依次填充原元组的值</span></span>
<span class="line"><span>new _tup</span></span>
<span class="line"><span>(1, 2, 3, 4, 5)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>l = [1, 2, 3, 4]</span></span>
<span class="line"><span>l.append(5) # 添加元素5到原列表的末尾</span></span>
<span class="line"><span>l</span></span>
<span class="line"><span>[1, 2, 3, 4, 5]</span></span></code></pre></div><p>通过上面的例子，相信你肯定掌握了列表和元组的基本概念。接下来我们来看一些列表和元组的基本操作和注意事项。</p><p>首先，和其他语言不同， <strong>Python中的列表和元组都支持负数索引</strong>，-1表示最后一个元素，-2表示倒数第二个元素，以此类推。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4]</span></span>
<span class="line"><span>l[-1]</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tup = (1, 2, 3, 4)</span></span>
<span class="line"><span>tup[-1]</span></span>
<span class="line"><span>4</span></span></code></pre></div><p>除了基本的初始化，索引外， <strong>列表和元组都支持切片操作</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3, 4]</span></span>
<span class="line"><span>l[1:3] # 返回列表中索引从1到2的子列表</span></span>
<span class="line"><span>[2, 3]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tup = (1, 2, 3, 4)</span></span>
<span class="line"><span>tup[1:3] # 返回元组中索引从1到2的子元组</span></span>
<span class="line"><span>(2, 3)</span></span></code></pre></div><p>另外，列表和元组都 <strong>可以随意嵌套</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [[1, 2, 3], [4, 5]] # 列表的每一个元素也是一个列表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tup = ((1, 2, 3), (4, 5, 6)) # 元组的每一个元素也是一个元组</span></span></code></pre></div><p>当然，两者也可以通过list()和tuple()函数相互转换：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>list((1, 2, 3))</span></span>
<span class="line"><span>[1, 2, 3]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tuple([1, 2, 3])</span></span>
<span class="line"><span>(1, 2, 3)</span></span></code></pre></div><p>最后，我们来看一些列表和元组常用的内置函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [3, 2, 3, 7, 8, 1]</span></span>
<span class="line"><span>l.count(3)</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>l.index(7)</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>l.reverse()</span></span>
<span class="line"><span>l</span></span>
<span class="line"><span>[1, 8, 7, 3, 2, 3]</span></span>
<span class="line"><span>l.sort()</span></span>
<span class="line"><span>l</span></span>
<span class="line"><span>[1, 2, 3, 3, 7, 8]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tup = (3, 2, 3, 7, 8, 1)</span></span>
<span class="line"><span>tup.count(3)</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>tup.index(7)</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>list(reversed(tup))</span></span>
<span class="line"><span>[1, 8, 7, 3, 2, 3]</span></span>
<span class="line"><span>sorted(tup)</span></span>
<span class="line"><span>[1, 2, 3, 3, 7, 8]</span></span></code></pre></div><p>这里我简单解释一下这几个函数的含义。</p><ul><li><p>count(item)表示统计列表/元组中item出现的次数。</p></li><li><p>index(item)表示返回列表/元组中item第一次出现的索引。</p></li><li><p>list.reverse()和list.sort()分别表示原地倒转列表和排序（注意，元组没有内置的这两个函数)。</p></li><li><p>reversed()和sorted()同样表示对列表/元组进行倒转和排序，reversed()返回一个倒转后的迭代器（上文例子使用list()函数再将其转换为列表）；sorted()返回排好序的新列表。</p></li></ul><h2 id="列表和元组存储方式的差异" tabindex="-1">列表和元组存储方式的差异 <a class="header-anchor" href="#列表和元组存储方式的差异" aria-label="Permalink to &quot;列表和元组存储方式的差异&quot;">​</a></h2><p>前面说了，列表和元组最重要的区别就是，列表是动态的、可变的，而元组是静态的、不可变的。这样的差异，势必会影响两者存储方式。我们可以来看下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = [1, 2, 3]</span></span>
<span class="line"><span>l.__sizeof__()</span></span>
<span class="line"><span>64</span></span>
<span class="line"><span>tup = (1, 2, 3)</span></span>
<span class="line"><span>tup.__sizeof__()</span></span>
<span class="line"><span>48</span></span></code></pre></div><p>你可以看到，对列表和元组，我们放置了相同的元素，但是元组的存储空间，却比列表要少16字节。这是为什么呢？</p><p>事实上，由于列表是动态的，所以它需要存储指针，来指向对应的元素（上述例子中，对于int型，8字节）。另外，由于列表可变，所以需要额外存储已经分配的长度大小（8字节），这样才可以实时追踪列表空间的使用情况，当空间不足时，及时分配额外空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>l = []</span></span>
<span class="line"><span>l.__sizeof__() // 空列表的存储空间为40字节</span></span>
<span class="line"><span>40</span></span>
<span class="line"><span>l.append(1)</span></span>
<span class="line"><span>l.__sizeof__()</span></span>
<span class="line"><span>72 // 加入了元素1之后，列表为其分配了可以存储4个元素的空间 (72 - 40)/8 = 4</span></span>
<span class="line"><span>l.append(2)</span></span>
<span class="line"><span>l.__sizeof__()</span></span>
<span class="line"><span>72 // 由于之前分配了空间，所以加入元素2，列表空间不变</span></span>
<span class="line"><span>l.append(3)</span></span>
<span class="line"><span>l.__sizeof__()</span></span>
<span class="line"><span>72 // 同上</span></span>
<span class="line"><span>l.append(4)</span></span>
<span class="line"><span>l.__sizeof__()</span></span>
<span class="line"><span>72 // 同上</span></span>
<span class="line"><span>l.append(5)</span></span>
<span class="line"><span>l.__sizeof__()</span></span>
<span class="line"><span>104 // 加入元素5之后，列表的空间不足，所以又额外分配了可以存储4个元素的空间</span></span></code></pre></div><p>上面的例子，大概描述了列表空间分配的过程。我们可以看到，为了减小每次增加/删减操作时空间分配的开销，Python每次分配空间时都会额外多分配一些，这样的机制（over-allocating）保证了其操作的高效性：增加/删除的时间复杂度均为O(1)。</p><p>但是对于元组，情况就不同了。元组长度大小固定，元素不可变，所以存储空间固定。</p><p>看了前面的分析，你也许会觉得，这样的差异可以忽略不计。但是想象一下，如果列表和元组存储元素的个数是一亿，十亿甚至更大数量级时，你还能忽略这样的差异吗？</p><h2 id="列表和元组的性能" tabindex="-1">列表和元组的性能 <a class="header-anchor" href="#列表和元组的性能" aria-label="Permalink to &quot;列表和元组的性能&quot;">​</a></h2><p>通过学习列表和元组存储方式的差异，我们可以得出结论：元组要比列表更加轻量级一些，所以总体上来说，元组的性能速度要略优于列表。</p><p>另外，Python会在后台，对静态数据做一些 <strong>资源缓存</strong>（resource caching）。通常来说，因为垃圾回收机制的存在，如果一些变量不被使用了，Python就会回收它们所占用的内存，返还给操作系统，以便其他变量或其他应用使用。</p><p>但是对于一些静态变量，比如元组，如果它不被使用并且占用空间不大时，Python会暂时缓存这部分内存。这样，下次我们再创建同样大小的元组时，Python就可以不用再向操作系统发出请求，去寻找内存，而是可以直接分配之前缓存的内存空间，这样就能大大加快程序的运行速度。</p><p>下面的例子，是计算 <strong>初始化</strong> 一个相同元素的列表和元组分别所需的时间。我们可以看到，元组的初始化速度，要比列表快5倍。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python3 -m timeit &#39;x=(1,2,3,4,5,6)&#39;</span></span>
<span class="line"><span>20000000 loops, best of 5: 9.97 nsec per loop</span></span>
<span class="line"><span>python3 -m timeit &#39;x=[1,2,3,4,5,6]&#39;</span></span>
<span class="line"><span>5000000 loops, best of 5: 50.1 nsec per loop</span></span></code></pre></div><p>但如果是 <strong>索引操作</strong> 的话，两者的速度差别非常小，几乎可以忽略不计。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python3 -m timeit -s &#39;x=[1,2,3,4,5,6]&#39; &#39;y=x[3]&#39;</span></span>
<span class="line"><span>10000000 loops, best of 5: 22.2 nsec per loop</span></span>
<span class="line"><span>python3 -m timeit -s &#39;x=(1,2,3,4,5,6)&#39; &#39;y=x[3]&#39;</span></span>
<span class="line"><span>10000000 loops, best of 5: 21.9 nsec per loop</span></span></code></pre></div><p>当然，如果你想要增加、删减或者改变元素，那么列表显然更优。原因你现在肯定知道了，那就是对于元组，你必须得通过新建一个元组来完成。</p><h2 id="列表和元组的使用场景" tabindex="-1">列表和元组的使用场景 <a class="header-anchor" href="#列表和元组的使用场景" aria-label="Permalink to &quot;列表和元组的使用场景&quot;">​</a></h2><p>那么列表和元组到底用哪一个呢？根据上面所说的特性，我们具体情况具体分析。</p><p><strong>1.</strong> 如果存储的数据和数量不变，比如你有一个函数，需要返回的是一个地点的经纬度，然后直接传给前端渲染，那么肯定选用元组更合适。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def get_location():</span></span>
<span class="line"><span>    .....</span></span>
<span class="line"><span>    return (longitude, latitude)</span></span></code></pre></div><p><strong>2.</strong> 如果存储的数据或数量是可变的，比如社交平台上的一个日志功能，是统计一个用户在一周之内看了哪些用户的帖子，那么则用列表更合适。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>viewer_owner_id_list = [] # 里面的每个元素记录了这个viewer一周内看过的所有owner的id</span></span>
<span class="line"><span>records = queryDB(viewer_id) # 索引数据库，拿到某个viewer一周内的日志</span></span>
<span class="line"><span>for record in records:</span></span>
<span class="line"><span>    viewer_owner_id_list.append(record.id)</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>关于列表和元组，我们今天聊了很多，最后一起总结一下你必须掌握的内容。</p><p>总的来说，列表和元组都是有序的，可以存储任意数据类型的集合，区别主要在于下面这两点。</p><ul><li><p>列表是动态的，长度可变，可以随意的增加、删减或改变元素。列表的存储空间略大于元组，性能略逊于元组。</p></li><li><p>元组是静态的，长度大小固定，不可以对元素进行增加、删减或者改变操作。元组相对于列表更加轻量级，性能稍优。</p></li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p><strong>1.</strong> 想创建一个空的列表，我们可以用下面的A、B两种方式，请问它们在效率上有什么区别吗？我们应该优先考虑使用哪种呢？可以说说你的理由。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 创建空列表</span></span>
<span class="line"><span># option A</span></span>
<span class="line"><span>empty_list = list()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># option B</span></span>
<span class="line"><span>empty_list = []</span></span></code></pre></div><p><strong>2.</strong> 你在平时的学习工作中，是在什么场景下使用列表或者元组呢？欢迎留言和我分享。</p>`,62)])])}const g=n(l,[["render",i]]);export{u as __pageData,g as default};
