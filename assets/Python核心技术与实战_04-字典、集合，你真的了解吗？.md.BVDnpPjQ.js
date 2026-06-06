import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"04 | 字典、集合，你真的了解吗？","description":"","frontmatter":{},"headers":[{"level":2,"title":"字典和集合基础","slug":"字典和集合基础","link":"#字典和集合基础","children":[]},{"level":2,"title":"字典和集合性能","slug":"字典和集合性能","link":"#字典和集合性能","children":[]},{"level":2,"title":"字典和集合的工作原理","slug":"字典和集合的工作原理","link":"#字典和集合的工作原理","children":[{"level":3,"title":"插入操作","slug":"插入操作","link":"#插入操作","children":[]},{"level":3,"title":"查找操作","slug":"查找操作","link":"#查找操作","children":[]},{"level":3,"title":"删除操作","slug":"删除操作","link":"#删除操作","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/04-字典、集合，你真的了解吗？.md","filePath":"Python核心技术与实战/04-字典、集合，你真的了解吗？.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/04-字典、集合，你真的了解吗？.md"};function i(t,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_04-字典、集合-你真的了解吗" tabindex="-1">04 | 字典、集合，你真的了解吗？ <a class="header-anchor" href="#_04-字典、集合-你真的了解吗" aria-label="Permalink to &quot;04 | 字典、集合，你真的了解吗？&quot;">​</a></h1><p>你好，我是景霄。</p><p>前面的课程，我们学习了Python中的列表和元组，了解了他们的基本操作和性能比较。这节课，我们再来学习两个同样很常见并且很有用的数据结构：字典（dict）和集合（set）。字典和集合在Python被广泛使用，并且性能进行了高度优化，其重要性不言而喻。</p><h2 id="字典和集合基础" tabindex="-1">字典和集合基础 <a class="header-anchor" href="#字典和集合基础" aria-label="Permalink to &quot;字典和集合基础&quot;">​</a></h2><p>那究竟什么是字典，什么是集合呢？字典是一系列由键（key）和值（value）配对组成的元素的集合，在Python3.7+，字典被确定为有序（注意：在3.6中，字典有序是一个implementation detail，在3.7才正式成为语言特性，因此3.6中无法100%确保其有序性），而3.6之前是无序的，其长度大小可变，元素可以任意地删减和改变。</p><p>相比于列表和元组，字典的性能更优，特别是对于查找、添加和删除操作，字典都能在常数时间复杂度内完成。</p><p>而集合和字典基本相同，唯一的区别，就是集合没有键和值的配对，是一系列无序的、唯一的元素组合。</p><p>首先我们来看字典和集合的创建，通常有下面这几种方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d1 = {&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20, &#39;gender&#39;: &#39;male&#39;}</span></span>
<span class="line"><span>d2 = dict({&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20, &#39;gender&#39;: &#39;male&#39;})</span></span>
<span class="line"><span>d3 = dict([(&#39;name&#39;, &#39;jason&#39;), (&#39;age&#39;, 20), (&#39;gender&#39;, &#39;male&#39;)])</span></span>
<span class="line"><span>d4 = dict(name=&#39;jason&#39;, age=20, gender=&#39;male&#39;)</span></span>
<span class="line"><span>d1 == d2 == d3 ==d4</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s1 = {1, 2, 3}</span></span>
<span class="line"><span>s2 = set([1, 2, 3])</span></span>
<span class="line"><span>s1 == s2</span></span>
<span class="line"><span>True</span></span></code></pre></div><p>这里注意，Python中字典和集合，无论是键还是值，都可以是混合类型。比如下面这个例子，我创建了一个元素为 <code>1</code>， <code>&#39;hello&#39;</code>， <code>5.0</code> 的集合：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s = {1, &#39;hello&#39;, 5.0}</span></span></code></pre></div><p>再来看元素访问的问题。字典访问可以直接索引键，如果不存在，就会抛出异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20}</span></span>
<span class="line"><span>d[&#39;name&#39;]</span></span>
<span class="line"><span>&#39;jason&#39;</span></span>
<span class="line"><span>d[&#39;location&#39;]</span></span>
<span class="line"><span>Traceback (most recent call last):</span></span>
<span class="line"><span>  File &quot;&amp;lt;stdin&amp;gt;&quot;, line 1, in &amp;lt;module&amp;gt;</span></span>
<span class="line"><span>KeyError: &#39;location&#39;</span></span></code></pre></div><p>也可以使用get(key, default)函数来进行索引。如果键不存在，调用get()函数可以返回一个默认值。比如下面这个示例，返回了 <code>&#39;null&#39;</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20}</span></span>
<span class="line"><span>d.get(&#39;name&#39;)</span></span>
<span class="line"><span>&#39;jason&#39;</span></span>
<span class="line"><span>d.get(&#39;location&#39;, &#39;null&#39;)</span></span>
<span class="line"><span>&#39;null&#39;</span></span></code></pre></div><p>说完了字典的访问，我们再来看集合。</p><p>首先我要强调的是， <strong>集合并不支持索引操作，因为集合本质上是一个哈希表，和列表不一样</strong>。所以，下面这样的操作是错误的，Python会抛出异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s = {1, 2, 3}</span></span>
<span class="line"><span>s[0]</span></span>
<span class="line"><span>Traceback (most recent call last):</span></span>
<span class="line"><span>  File &quot;&amp;lt;stdin&amp;gt;&quot;, line 1, in &amp;lt;module&amp;gt;</span></span>
<span class="line"><span>TypeError: &#39;set&#39; object does not support indexing</span></span></code></pre></div><p>想要判断一个元素在不在字典或集合内，我们可以用value in dict/set 来判断。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s = {1, 2, 3}</span></span>
<span class="line"><span>1 in s</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span>10 in s</span></span>
<span class="line"><span>False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20}</span></span>
<span class="line"><span>&#39;name&#39; in d</span></span>
<span class="line"><span>True</span></span>
<span class="line"><span>&#39;location&#39; in d</span></span>
<span class="line"><span>False</span></span></code></pre></div><p>当然，除了创建和访问，字典和集合也同样支持增加、删除、更新等操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20}</span></span>
<span class="line"><span>d[&#39;gender&#39;] = &#39;male&#39; # 增加元素对&#39;gender&#39;: &#39;male&#39;</span></span>
<span class="line"><span>d[&#39;dob&#39;] = &#39;1999-02-01&#39; # 增加元素对&#39;dob&#39;: &#39;1999-02-01&#39;</span></span>
<span class="line"><span>d</span></span>
<span class="line"><span>{&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20, &#39;gender&#39;: &#39;male&#39;, &#39;dob&#39;: &#39;1999-02-01&#39;}</span></span>
<span class="line"><span>d[&#39;dob&#39;] = &#39;1998-01-01&#39; # 更新键&#39;dob&#39;对应的值</span></span>
<span class="line"><span>d.pop(&#39;dob&#39;) # 删除键为&#39;dob&#39;的元素对</span></span>
<span class="line"><span>&#39;1998-01-01&#39;</span></span>
<span class="line"><span>d</span></span>
<span class="line"><span>{&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20, &#39;gender&#39;: &#39;male&#39;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s = {1, 2, 3}</span></span>
<span class="line"><span>s.add(4) # 增加元素4到集合</span></span>
<span class="line"><span>s</span></span>
<span class="line"><span>{1, 2, 3, 4}</span></span>
<span class="line"><span>s.remove(4) # 从集合中删除元素4</span></span>
<span class="line"><span>s</span></span>
<span class="line"><span>{1, 2, 3}</span></span></code></pre></div><p>不过要注意，集合的pop()操作是删除集合中最后一个元素，可是集合本身是无序的，你无法知道会删除哪个元素，因此这个操作得谨慎使用。</p><p>实际应用中，很多情况下，我们需要对字典或集合进行排序，比如，取出值最大的50对。</p><p>对于字典，我们通常会根据键或值，进行升序或降序排序：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d = {&#39;b&#39;: 1, &#39;a&#39;: 2, &#39;c&#39;: 10}</span></span>
<span class="line"><span>d_sorted_by_key = sorted(d.items(), key=lambda x: x[0]) # 根据字典键的升序排序</span></span>
<span class="line"><span>d_sorted_by_value = sorted(d.items(), key=lambda x: x[1]) # 根据字典值的升序排序</span></span>
<span class="line"><span>d_sorted_by_key</span></span>
<span class="line"><span>[(&#39;a&#39;, 2), (&#39;b&#39;, 1), (&#39;c&#39;, 10)]</span></span>
<span class="line"><span>d_sorted_by_value</span></span>
<span class="line"><span>[(&#39;b&#39;, 1), (&#39;a&#39;, 2), (&#39;c&#39;, 10)]</span></span></code></pre></div><p>这里返回了一个列表。列表中的每个元素，是由原字典的键和值组成的元组。</p><p>而对于集合，其排序和前面讲过的列表、元组很类似，直接调用sorted(set)即可，结果会返回一个排好序的列表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s = {3, 4, 2, 1}</span></span>
<span class="line"><span>sorted(s) # 对集合的元素进行升序排序</span></span>
<span class="line"><span>[1, 2, 3, 4]</span></span></code></pre></div><h2 id="字典和集合性能" tabindex="-1">字典和集合性能 <a class="header-anchor" href="#字典和集合性能" aria-label="Permalink to &quot;字典和集合性能&quot;">​</a></h2><p>文章开头我就说到了，字典和集合是进行过性能高度优化的数据结构，特别是对于查找、添加和删除操作。那接下来，我们就来看看，它们在具体场景下的性能表现，以及与列表等其他数据结构的对比。</p><p>比如电商企业的后台，存储了每件产品的ID、名称和价格。现在的需求是，给定某件商品的ID，我们要找出其价格。</p><p>如果我们用列表来存储这些数据结构，并进行查找，相应的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def find_product_price(products, product_id):</span></span>
<span class="line"><span>    for id, price in products:</span></span>
<span class="line"><span>        if id == product_id:</span></span>
<span class="line"><span>            return price</span></span>
<span class="line"><span>    return None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>products = [</span></span>
<span class="line"><span>    (143121312, 100),</span></span>
<span class="line"><span>    (432314553, 30),</span></span>
<span class="line"><span>    (32421912367, 150)</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(&#39;The price of product 432314553 is {}&#39;.format(find_product_price(products, 432314553)))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>The price of product 432314553 is 30</span></span></code></pre></div><p>假设列表有n个元素，而查找的过程要遍历列表，那么时间复杂度就为O(n)。即使我们先对列表进行排序，然后使用二分查找，也会需要O(logn)的时间复杂度，更何况，列表的排序还需要O(nlogn)的时间。</p><p>但如果我们用字典来存储这些数据，那么查找就会非常便捷高效，只需O(1)的时间复杂度就可以完成。原因也很简单，刚刚提到过的，字典的内部组成是一张哈希表，你可以直接通过键的哈希值，找到其对应的值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>products = {</span></span>
<span class="line"><span>  143121312: 100,</span></span>
<span class="line"><span>  432314553: 30,</span></span>
<span class="line"><span>  32421912367: 150</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>print(&#39;The price of product 432314553 is {}&#39;.format(products[432314553]))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>The price of product 432314553 is 30</span></span></code></pre></div><p>类似的，现在需求变成，要找出这些商品有多少种不同的价格。我们还用同样的方法来比较一下。</p><p>如果还是选择使用列表，对应的代码如下，其中，A和B是两层循环。同样假设原始列表有n个元素，那么，在最差情况下，需要O(n^2)的时间复杂度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># list version</span></span>
<span class="line"><span>def find_unique_price_using_list(products):</span></span>
<span class="line"><span>    unique_price_list = []</span></span>
<span class="line"><span>    for _, price in products: # A</span></span>
<span class="line"><span>        if price not in unique_price_list: #B</span></span>
<span class="line"><span>            unique_price_list.append(price)</span></span>
<span class="line"><span>    return len(unique_price_list)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>products = [</span></span>
<span class="line"><span>    (143121312, 100),</span></span>
<span class="line"><span>    (432314553, 30),</span></span>
<span class="line"><span>    (32421912367, 150),</span></span>
<span class="line"><span>    (937153201, 30)</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>print(&#39;number of unique price is: {}&#39;.format(find_unique_price_using_list(products)))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>number of unique price is: 3</span></span></code></pre></div><p>但如果我们选择使用集合这个数据结构，由于集合是高度优化的哈希表，里面元素不能重复，并且其添加和查找操作只需O(1)的复杂度，那么，总的时间复杂度就只有O(n)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># set version</span></span>
<span class="line"><span>def find_unique_price_using_set(products):</span></span>
<span class="line"><span>    unique_price_set = set()</span></span>
<span class="line"><span>    for _, price in products:</span></span>
<span class="line"><span>        unique_price_set.add(price)</span></span>
<span class="line"><span>    return len(unique_price_set)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>products = [</span></span>
<span class="line"><span>    (143121312, 100),</span></span>
<span class="line"><span>    (432314553, 30),</span></span>
<span class="line"><span>    (32421912367, 150),</span></span>
<span class="line"><span>    (937153201, 30)</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span>print(&#39;number of unique price is: {}&#39;.format(find_unique_price_using_set(products)))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>number of unique price is: 3</span></span></code></pre></div><p>可能你对这些时间复杂度没有直观的认识，我可以举一个实际工作场景中的例子，让你来感受一下。</p><p>下面的代码，初始化了含有100,000个元素的产品，并分别计算了使用列表和集合来统计产品价格数量的运行时间：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import time</span></span>
<span class="line"><span>id = [x for x in range(0, 100000)]</span></span>
<span class="line"><span>price = [x for x in range(200000, 300000)]</span></span>
<span class="line"><span>products = list(zip(id, price))</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 计算列表版本的时间</span></span>
<span class="line"><span>start_using_list = time.perf_counter()</span></span>
<span class="line"><span>find_unique_price_using_list(products)</span></span>
<span class="line"><span>end_using_list = time.perf_counter()</span></span>
<span class="line"><span>print(&quot;time elapse using list: {}&quot;.format(end_using_list - start_using_list))</span></span>
<span class="line"><span>## 输出</span></span>
<span class="line"><span>time elapse using list: 41.61519479751587</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 计算集合版本的时间</span></span>
<span class="line"><span>start_using_set = time.perf_counter()</span></span>
<span class="line"><span>find_unique_price_using_set(products)</span></span>
<span class="line"><span>end_using_set = time.perf_counter()</span></span>
<span class="line"><span>print(&quot;time elapse using set: {}&quot;.format(end_using_set - start_using_set))</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>time elapse using set: 0.008238077163696289</span></span></code></pre></div><p>你可以看到，仅仅十万的数据量，两者的速度差异就如此之大。事实上，大型企业的后台数据往往有上亿乃至十亿数量级，如果使用了不合适的数据结构，就很容易造成服务器的崩溃，不但影响用户体验，并且会给公司带来巨大的财产损失。</p><h2 id="字典和集合的工作原理" tabindex="-1">字典和集合的工作原理 <a class="header-anchor" href="#字典和集合的工作原理" aria-label="Permalink to &quot;字典和集合的工作原理&quot;">​</a></h2><p>我们通过举例以及与列表的对比，看到了字典和集合操作的高效性。不过，字典和集合为什么能够如此高效，特别是查找、插入和删除操作？</p><p>这当然和字典、集合内部的数据结构密不可分。不同于其他数据结构，字典和集合的内部结构都是一张哈希表。</p><ul><li><p>对于字典而言，这张表存储了哈希值（hash）、键和值这3个元素。</p></li><li><p>而对集合来说，区别就是哈希表内没有键和值的配对，只有单一的元素了。</p></li></ul><p>我们来看，老版本Python的哈希表结构如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--+-------------------------------+</span></span>
<span class="line"><span>  | 哈希值(hash)  键(key)  值(value)</span></span>
<span class="line"><span>--+-------------------------------+</span></span>
<span class="line"><span>0 |    hash0      key0    value0</span></span>
<span class="line"><span>--+-------------------------------+</span></span>
<span class="line"><span>1 |    hash1      key1    value1</span></span>
<span class="line"><span>--+-------------------------------+</span></span>
<span class="line"><span>2 |    hash2      key2    value2</span></span>
<span class="line"><span>--+-------------------------------+</span></span>
<span class="line"><span>. |           ...</span></span>
<span class="line"><span>__+_______________________________+</span></span></code></pre></div><p>不难想象，随着哈希表的扩张，它会变得越来越稀疏。举个例子，比如我有这样一个字典：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&#39;name&#39;: &#39;mike&#39;, &#39;dob&#39;: &#39;1999-01-01&#39;, &#39;gender&#39;: &#39;male&#39;}</span></span></code></pre></div><p>那么它会存储为类似下面的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>entries = [</span></span>
<span class="line"><span>[&#39;--&#39;, &#39;--&#39;, &#39;--&#39;]</span></span>
<span class="line"><span>[-230273521, &#39;dob&#39;, &#39;1999-01-01&#39;],</span></span>
<span class="line"><span>[&#39;--&#39;, &#39;--&#39;, &#39;--&#39;],</span></span>
<span class="line"><span>[&#39;--&#39;, &#39;--&#39;, &#39;--&#39;],</span></span>
<span class="line"><span>[1231236123, &#39;name&#39;, &#39;mike&#39;],</span></span>
<span class="line"><span>[&#39;--&#39;, &#39;--&#39;, &#39;--&#39;],</span></span>
<span class="line"><span>[9371539127, &#39;gender&#39;, &#39;male&#39;]</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>这样的设计结构显然非常浪费存储空间。为了提高存储空间的利用率，现在的哈希表除了字典本身的结构，会把索引和哈希值、键、值单独分开，也就是下面这样新的结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Indices</span></span>
<span class="line"><span>----------------------------------------------------</span></span>
<span class="line"><span>None | index | None | None | index | None | index ...</span></span>
<span class="line"><span>----------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Entries</span></span>
<span class="line"><span>--------------------</span></span>
<span class="line"><span>hash0   key0  value0</span></span>
<span class="line"><span>---------------------</span></span>
<span class="line"><span>hash1   key1  value1</span></span>
<span class="line"><span>---------------------</span></span>
<span class="line"><span>hash2   key2  value2</span></span>
<span class="line"><span>---------------------</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>---------------------</span></span></code></pre></div><p>那么，刚刚的这个例子，在新的哈希表结构下的存储形式，就会变成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>indices = [None, 1, None, None, 0, None, 2]</span></span>
<span class="line"><span>entries = [</span></span>
<span class="line"><span>[1231236123, &#39;name&#39;, &#39;mike&#39;],</span></span>
<span class="line"><span>[-230273521, &#39;dob&#39;, &#39;1999-01-01&#39;],</span></span>
<span class="line"><span>[9371539127, &#39;gender&#39;, &#39;male&#39;]</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>我们可以很清晰地看到，空间利用率得到很大的提高。</p><p>清楚了具体的设计结构，我们接着来看这几个操作的工作原理。</p><h3 id="插入操作" tabindex="-1">插入操作 <a class="header-anchor" href="#插入操作" aria-label="Permalink to &quot;插入操作&quot;">​</a></h3><p>每次向字典或集合插入一个元素时，Python会首先计算键的哈希值（hash(key)），再和 mask = PyDicMinSize - 1做与操作，计算这个元素应该插入哈希表的位置index = hash(key) &amp; mask。如果哈希表中此位置是空的，那么这个元素就会被插入其中。</p><p>而如果此位置已被占用，Python便会比较两个元素的哈希值和键是否相等。</p><ul><li><p>若两者都相等，则表明这个元素已经存在，如果值不同，则更新值。</p></li><li><p>若两者中有一个不相等，这种情况我们通常称为哈希冲突（hash collision），意思是两个元素的键不相等，但是哈希值相等。这种情况下，Python便会继续寻找表中空余的位置，直到找到位置为止。</p></li></ul><p>值得一提的是，通常来说，遇到这种情况，最简单的方式是线性寻找，即从这个位置开始，挨个往后寻找空位。当然，Python内部对此进行了优化（这一点无需深入了解，你有兴趣可以查看源码，我就不再赘述），让这个步骤更加高效。</p><h3 id="查找操作" tabindex="-1">查找操作 <a class="header-anchor" href="#查找操作" aria-label="Permalink to &quot;查找操作&quot;">​</a></h3><p>和前面的插入操作类似，Python会根据哈希值，找到其应该处于的位置；然后，比较哈希表这个位置中元素的哈希值和键，与需要查找的元素是否相等。如果相等，则直接返回；如果不等，则继续查找，直到找到空位或者抛出异常为止。</p><h3 id="删除操作" tabindex="-1">删除操作 <a class="header-anchor" href="#删除操作" aria-label="Permalink to &quot;删除操作&quot;">​</a></h3><p>对于删除操作，Python会暂时对这个位置的元素，赋于一个特殊的值，等到重新调整哈希表的大小时，再将其删除。</p><p>不难理解，哈希冲突的发生，往往会降低字典和集合操作的速度。因此，为了保证其高效性，字典和集合内的哈希表，通常会保证其至少留有1/3的剩余空间。随着元素的不停插入，当剩余空间小于1/3时，Python会重新获取更大的内存空间，扩充哈希表。不过，这种情况下，表内所有的元素位置都会被重新排放。</p><p>虽然哈希冲突和哈希表大小的调整，都会导致速度减缓，但是这种情况发生的次数极少。所以，平均情况下，这仍能保证插入、查找和删除的时间复杂度为O(1)。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我们一起学习了字典和集合的基本操作，并对它们的高性能和内部存储结构进行了讲解。</p><p>字典在Python3.7+是有序的数据结构，而集合是无序的，其内部的哈希表存储结构，保证了其查找、插入、删除操作的高效性。所以，字典和集合通常运用在对元素的高效查找、去重等场景。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p><strong>1.</strong> 下面初始化字典的方式，哪一种更高效？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Option A</span></span>
<span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20, &#39;gender&#39;: &#39;male&#39;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Option B</span></span>
<span class="line"><span>d = dict({&#39;name&#39;: &#39;jason&#39;, &#39;age&#39;: 20, &#39;gender&#39;: &#39;male&#39;})</span></span></code></pre></div><p><strong>2.</strong> 字典的键可以是一个列表吗？下面这段代码中，字典的初始化是否正确呢？如果不正确，可以说出你的原因吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>d = {&#39;name&#39;: &#39;jason&#39;, [&#39;education&#39;]: [&#39;Tsinghua University&#39;, &#39;Stanford University&#39;]}</span></span></code></pre></div><p>欢迎留言和我分享，也欢迎你把这篇文章分享给你的同事、朋友。</p>`,82)])])}const g=n(l,[["render",i]]);export{h as __pageData,g as default};
