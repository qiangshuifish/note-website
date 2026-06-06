import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"31丨关联规则挖掘（下）：导演如何选择演员？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何使用Apriori工具包","slug":"如何使用apriori工具包","link":"#如何使用apriori工具包","children":[]},{"level":2,"title":"挖掘导演是如何选择演员的","slug":"挖掘导演是如何选择演员的","link":"#挖掘导演是如何选择演员的","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"数据分析实战45讲/31丨关联规则挖掘（下）：导演如何选择演员？.md","filePath":"数据分析实战45讲/31丨关联规则挖掘（下）：导演如何选择演员？.md","lastUpdated":1779820717000}'),i={name:"数据分析实战45讲/31丨关联规则挖掘（下）：导演如何选择演员？.md"};function t(l,s,r,c,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_31丨关联规则挖掘-下-导演如何选择演员" tabindex="-1">31丨关联规则挖掘（下）：导演如何选择演员？ <a class="header-anchor" href="#_31丨关联规则挖掘-下-导演如何选择演员" aria-label="Permalink to &quot;31丨关联规则挖掘（下）：导演如何选择演员？&quot;">​</a></h1><p>上次我给你讲了关联规则挖掘的原理。关联规则挖掘在生活中有很多使用场景，不仅是商品的捆绑销售，甚至在挑选演员决策上，你也能通过关联规则挖掘看出来某个导演选择演员的倾向。</p><p>今天我来带你用Apriori算法做一个项目实战。你需要掌握的是以下几点：</p><ol><li><p>熟悉上节课讲到的几个重要概念：支持度、置信度和提升度；</p></li><li><p>熟悉与掌握Apriori工具包的使用；</p></li><li><p>在实际问题中，灵活运用。包括数据集的准备等。</p></li></ol><h2 id="如何使用apriori工具包" tabindex="-1">如何使用Apriori工具包 <a class="header-anchor" href="#如何使用apriori工具包" aria-label="Permalink to &quot;如何使用Apriori工具包&quot;">​</a></h2><p>Apriori虽然是十大算法之一，不过在sklearn工具包中并没有它，也没有FP-Growth算法。这里教你个方法，来选择Python中可以使用的工具包，你可以通过 <a href="https://pypi.org/" target="_blank" rel="noreferrer">https://pypi.org/</a> 搜索工具包。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/76a3b34beccbe7b69a11951b4efd80c7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/76a3b34beccbe7b69a11951b4efd80c7.png" alt=""></a></p><p>这个网站提供的工具包都是Python语言的，你能找到8个Python语言的Apriori工具包，具体选择哪个呢？建议你使用第二个工具包，即efficient-apriori。后面我会讲到为什么推荐这个工具包。</p><p>首先你需要通过pip install efficient-apriori 安装这个工具包。</p><p>然后看下如何使用它，核心的代码就是这一行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>itemsets, rules = apriori(data, min_support,  min_confidence)</span></span></code></pre></div><p>其中data是我们要提供的数据集，它是一个list数组类型。min_support参数为最小支持度，在efficient-apriori工具包中用0到1的数值代表百分比，比如0.5代表最小支持度为50%。min_confidence是最小置信度，数值也代表百分比，比如1代表100%。</p><p>关于支持度、置信度和提升度，我们再来简单回忆下。</p><p>支持度指的是某个商品组合出现的次数与总次数之间的比例。支持度越高，代表这个组合出现的概率越大。</p><p>置信度是一个条件概念，就是在A发生的情况下，B发生的概率是多少。</p><p>提升度代表的是“商品A的出现，对商品B的出现概率提升了多少”。</p><p>接下来我们用这个工具包，跑一下上节课中讲到的超市购物的例子。下面是客户购买的商品列表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/a48f4a2961c3be811431418eb84aeaa6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/a48f4a2961c3be811431418eb84aeaa6.png" alt=""></a></p><p>具体实现的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from efficient_apriori import apriori</span></span>
<span class="line"><span># 设置数据集</span></span>
<span class="line"><span>data = [(&#39;牛奶&#39;,&#39;面包&#39;,&#39;尿布&#39;),</span></span>
<span class="line"><span>           (&#39;可乐&#39;,&#39;面包&#39;, &#39;尿布&#39;, &#39;啤酒&#39;),</span></span>
<span class="line"><span>           (&#39;牛奶&#39;,&#39;尿布&#39;, &#39;啤酒&#39;, &#39;鸡蛋&#39;),</span></span>
<span class="line"><span>           (&#39;面包&#39;, &#39;牛奶&#39;, &#39;尿布&#39;, &#39;啤酒&#39;),</span></span>
<span class="line"><span>           (&#39;面包&#39;, &#39;牛奶&#39;, &#39;尿布&#39;, &#39;可乐&#39;)]</span></span>
<span class="line"><span># 挖掘频繁项集和频繁规则</span></span>
<span class="line"><span>itemsets, rules = apriori(data, min_support=0.5,  min_confidence=1)</span></span>
<span class="line"><span>print(itemsets)</span></span>
<span class="line"><span>print(rules)</span></span></code></pre></div><p>运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{1: {(&#39;啤酒&#39;,): 3, (&#39;尿布&#39;,): 5, (&#39;牛奶&#39;,): 4, (&#39;面包&#39;,): 4}, 2: {(&#39;啤酒&#39;, &#39;尿布&#39;): 3, (&#39;尿布&#39;, &#39;牛奶&#39;): 4, (&#39;尿布&#39;, &#39;面包&#39;): 4, (&#39;牛奶&#39;, &#39;面包&#39;): 3}, 3: {(&#39;尿布&#39;, &#39;牛奶&#39;, &#39;面包&#39;): 3}​}</span></span>
<span class="line"><span>[{啤酒} -&gt; {尿布}, {牛奶} -&gt; {尿布}, {面包} -&gt; {尿布}, {牛奶, 面包} -&gt; {尿布}]</span></span></code></pre></div><p>你能从代码中看出来，data是个List数组类型，其中每个值都可以是一个集合。实际上你也可以把data数组中的每个值设置为List数组类型，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data = [[&#39;牛奶&#39;,&#39;面包&#39;,&#39;尿布&#39;],</span></span>
<span class="line"><span>           [&#39;可乐&#39;,&#39;面包&#39;, &#39;尿布&#39;, &#39;啤酒&#39;],</span></span>
<span class="line"><span>           [&#39;牛奶&#39;,&#39;尿布&#39;, &#39;啤酒&#39;, &#39;鸡蛋&#39;],</span></span>
<span class="line"><span>           [&#39;面包&#39;, &#39;牛奶&#39;, &#39;尿布&#39;, &#39;啤酒&#39;],</span></span>
<span class="line"><span>           [&#39;面包&#39;, &#39;牛奶&#39;, &#39;尿布&#39;, &#39;可乐&#39;]]</span></span></code></pre></div><p>两者的运行结果是一样的，efficient-apriori 工具包把每一条数据集里的项式都放到了一个集合中进行运算，并没有考虑它们之间的先后顺序。因为实际情况下，同一个购物篮中的物品也不需要考虑购买的先后顺序。</p><p>而其他的Apriori算法可能会因为考虑了先后顺序，出现计算频繁项集结果不对的情况。所以这里采用的是efficient-apriori这个工具包。</p><h2 id="挖掘导演是如何选择演员的" tabindex="-1">挖掘导演是如何选择演员的 <a class="header-anchor" href="#挖掘导演是如何选择演员的" aria-label="Permalink to &quot;挖掘导演是如何选择演员的&quot;">​</a></h2><p>在实际工作中，数据集是需要自己来准备的，比如今天我们要挖掘导演是如何选择演员的数据情况，但是并没有公开的数据集可以直接使用。因此我们需要使用之前讲到的Python爬虫进行数据采集。</p><p>不同导演选择演员的规则是不同的，因此我们需要先指定导演。数据源我们选用豆瓣电影。</p><p>先来梳理下采集的工作流程。</p><p>首先我们先在 <a href="https://movie.douban.com" target="_blank" rel="noreferrer">https://movie.douban.com</a> 搜索框中输入导演姓名，比如“宁浩”。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/eaba9861825a38b6fbd5af1bff7194ef.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/eaba9861825a38b6fbd5af1bff7194ef.png" alt=""></a></p><p>页面会呈现出来导演之前的所有电影，然后对页面进行观察，你能观察到以下几个现象：</p><ol><li><p>页面默认是15条数据反馈，第一页会返回16条。因为第一条数据实际上这个导演的概览，你可以理解为是一条广告的插入，下面才是真正的返回结果。</p></li><li><p>每条数据的最后一行是电影的演出人员的信息，第一个人员是导演，其余为演员姓名。姓名之间用“/”分割。</p></li></ol><p>有了这些观察之后，我们就可以编写抓取程序了。在代码讲解中你能看出这两点观察的作用。抓取程序的目的是为了生成宁浩导演（你也可以抓取其他导演）的数据集，结果会保存在csv文件中。完整的抓取代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span># 下载某个导演的电影数据集</span></span>
<span class="line"><span>from efficient_apriori import apriori</span></span>
<span class="line"><span>from lxml import etree</span></span>
<span class="line"><span>import time</span></span>
<span class="line"><span>from selenium import webdriver</span></span>
<span class="line"><span>import csv</span></span>
<span class="line"><span>driver = webdriver.Chrome()</span></span>
<span class="line"><span># 设置想要下载的导演 数据集</span></span>
<span class="line"><span>director = u&#39;宁浩&#39;</span></span>
<span class="line"><span># 写CSV文件</span></span>
<span class="line"><span>file_name = &#39;./&#39; + director + &#39;.csv&#39;</span></span>
<span class="line"><span>base_url = &#39;https://movie.douban.com/subject_search?search_text=&#39;+director+&#39;&amp;cat=1002&amp;start=&#39;</span></span>
<span class="line"><span>out = open(file_name,&#39;w&#39;, newline=&#39;&#39;, encoding=&#39;utf-8-sig&#39;)</span></span>
<span class="line"><span>csv_write = csv.writer(out, dialect=&#39;excel&#39;)</span></span>
<span class="line"><span>flags=[]</span></span>
<span class="line"><span># 下载指定页面的数据</span></span>
<span class="line"><span>def download(request_url):</span></span>
<span class="line"><span>	driver.get(request_url)</span></span>
<span class="line"><span>	time.sleep(1)</span></span>
<span class="line"><span>	html = driver.find_element_by_xpath(&quot;//*&quot;).get_attribute(&quot;outerHTML&quot;)</span></span>
<span class="line"><span>	html = etree.HTML(html)</span></span>
<span class="line"><span>	# 设置电影名称，导演演员 的XPATH</span></span>
<span class="line"><span>	movie_lists = html.xpath(&quot;/html/body/div[@id=&#39;wrapper&#39;]/div[@id=&#39;root&#39;]/div[1]//div[@class=&#39;item-root&#39;]/div[@class=&#39;detail&#39;]/div[@class=&#39;title&#39;]/a[@class=&#39;title-text&#39;]&quot;)</span></span>
<span class="line"><span>	name_lists = html.xpath(&quot;/html/body/div[@id=&#39;wrapper&#39;]/div[@id=&#39;root&#39;]/div[1]//div[@class=&#39;item-root&#39;]/div[@class=&#39;detail&#39;]/div[@class=&#39;meta abstract_2&#39;]&quot;)</span></span>
<span class="line"><span>	# 获取返回的数据个数</span></span>
<span class="line"><span>	num = len(movie_lists)</span></span>
<span class="line"><span>	if num &gt; 15: #第一页会有16条数据</span></span>
<span class="line"><span>		# 默认第一个不是，所以需要去掉</span></span>
<span class="line"><span>		movie_lists = movie_lists[1:]</span></span>
<span class="line"><span>		name_lists = name_lists[1:]</span></span>
<span class="line"><span>	for (movie, name_list) in zip(movie_lists, name_lists):</span></span>
<span class="line"><span>		# 会存在数据为空的情况</span></span>
<span class="line"><span>		if name_list.text is None:</span></span>
<span class="line"><span>			continue</span></span>
<span class="line"><span>		# 显示下演员名称</span></span>
<span class="line"><span>		print(name_list.text)</span></span>
<span class="line"><span>		names = name_list.text.split(&#39;/&#39;)</span></span>
<span class="line"><span>		# 判断导演是否为指定的director</span></span>
<span class="line"><span>		if names[0].strip() == director and movie.text not in flags:</span></span>
<span class="line"><span>			# 将第一个字段设置为电影名称</span></span>
<span class="line"><span>			names[0] = movie.text</span></span>
<span class="line"><span>			flags.append(movie.text)</span></span>
<span class="line"><span>			csv_write.writerow(names)</span></span>
<span class="line"><span>	print(&#39;OK&#39;) # 代表这页数据下载成功</span></span>
<span class="line"><span>	print(num)</span></span>
<span class="line"><span>	if num &gt;= 14: #有可能一页会有14个电影</span></span>
<span class="line"><span>		# 继续下一页</span></span>
<span class="line"><span>		return True</span></span>
<span class="line"><span>	else:</span></span>
<span class="line"><span>		# 没有下一页</span></span>
<span class="line"><span>		return False</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 开始的ID为0，每页增加15</span></span>
<span class="line"><span>start = 0</span></span>
<span class="line"><span>while start&lt;10000: #最多抽取1万部电影</span></span>
<span class="line"><span>	request_url = base_url + str(start)</span></span>
<span class="line"><span>	# 下载数据，并返回是否有下一页</span></span>
<span class="line"><span>	flag = download(request_url)</span></span>
<span class="line"><span>	if flag:</span></span>
<span class="line"><span>		start = start + 15</span></span>
<span class="line"><span>	else:</span></span>
<span class="line"><span>		break</span></span>
<span class="line"><span>out.close()</span></span>
<span class="line"><span>print(&#39;finished&#39;)</span></span></code></pre></div><p>代码中涉及到了几个模块，我简单讲解下这几个模块。</p><p>在引用包这一段，我们使用csv工具包读写CSV文件，用efficient_apriori完成Apriori算法，用lxml进行XPath解析，time工具包可以让我们在模拟后有个适当停留，代码中我设置为1秒钟，等HTML数据完全返回后再进行HTML内容的获取。使用selenium的webdriver来模拟浏览器的行为。</p><p>在读写文件这一块，我们需要事先告诉python的open函数，文件的编码是utf-8-sig（对应代码：encoding=‘utf-8-sig’），这是因为我们会用到中文，为了避免编码混乱。</p><p>编写download函数，参数传入我们要采集的页面地址（request_url）。针对返回的HTML，我们需要用到之前讲到的Chrome浏览器的XPath Helper工具，来获取电影名称以及演出人员的XPath。我用页面返回的数据个数来判断当前所处的页面序号。如果数据个数&gt;15，也就是第一页，第一页的第一条数据是广告，我们需要忽略。如果数据个数=15，代表是中间页，需要点击“下一页”，也就是翻页。如果数据个数&lt;15，代表最后一页，没有下一页。</p><p>在程序主体部分，我们设置start代表抓取的ID，从0开始最多抓取1万部电影的数据（一个导演不会超过1万部电影），每次翻页start自动增加15，直到flag=False为止，也就是不存在下一页的情况。</p><p>你可以模拟下抓取的流程，获得指定导演的数据，比如我上面抓取的宁浩的数据。这里需要注意的是，豆瓣的电影数据可能是不全的，但基本上够我们用。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/5ea61131d1fce390040cf0edf6897a16.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/5ea61131d1fce390040cf0edf6897a16.png" alt=""></a></p><p>有了数据之后，我们就可以用Apriori算法来挖掘频繁项集和关联规则，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span>from efficient_apriori import apriori</span></span>
<span class="line"><span>import csv</span></span>
<span class="line"><span>director = u&#39;宁浩&#39;</span></span>
<span class="line"><span>file_name = &#39;./&#39;+director+&#39;.csv&#39;</span></span>
<span class="line"><span>lists = csv.reader(open(file_name, &#39;r&#39;, encoding=&#39;utf-8-sig&#39;))</span></span>
<span class="line"><span># 数据加载</span></span>
<span class="line"><span>data = []</span></span>
<span class="line"><span>for names in lists:</span></span>
<span class="line"><span>     name_new = []</span></span>
<span class="line"><span>     for name in names:</span></span>
<span class="line"><span>           # 去掉演员数据中的空格</span></span>
<span class="line"><span>           name_new.append(name.strip())</span></span>
<span class="line"><span>     data.append(name_new[1:])</span></span>
<span class="line"><span># 挖掘频繁项集和关联规则</span></span>
<span class="line"><span>itemsets, rules = apriori(data, min_support=0.5,  min_confidence=1)</span></span>
<span class="line"><span>print(itemsets)</span></span>
<span class="line"><span>print(rules)</span></span></code></pre></div><p>代码中使用的apriori方法和开头中用Apriori获取购物篮规律的方法类似，比如代码中都设定了最小支持度和最小置信系数，这样我们可以找到支持度大于50%，置信系数为1的频繁项集和关联规则。</p><p>这是最后的运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{1: {(&#39;徐峥&#39;,): 5, (&#39;黄渤&#39;,): 6}, 2: {(&#39;徐峥&#39;, &#39;黄渤&#39;): 5}​}</span></span>
<span class="line"><span>[{徐峥} -&gt; {黄渤}]</span></span></code></pre></div><p>你能看出来，宁浩导演喜欢用徐峥和黄渤，并且有徐峥的情况下，一般都会用黄渤。你也可以用上面的代码来挖掘下其他导演选择演员的规律。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>Apriori算法的核心就是理解频繁项集和关联规则。在算法运算的过程中，还要重点掌握对支持度、置信度和提升度的理解。在工具使用上，你可以使用efficient-apriori这个工具包，它会把每一条数据中的项（item）放到一个集合（篮子）里来处理，不考虑项（item）之间的先后顺序。</p><p>在实际运用中你还需要灵活处理，比如导演如何选择演员这个案例，虽然工具的使用会很方便，但重要的还是数据挖掘前的准备过程，也就是获取某个导演的电影数据集。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/282c25e8651b3e0b675be7267d13629d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/82943/282c25e8651b3e0b675be7267d13629d.png" alt=""></a></p><p>最后给你留两道思考题吧。请你编写代码挖掘下张艺谋导演使用演员的频繁项集和关联规则，最小支持度可以设置为0.1或0.05。另外你认为Apriori算法中的最小支持度和最小置信度，一般设置为多少比较合理？</p><p>欢迎你在评论区与我分享你的答案，也欢迎点击“请朋友读”，把这篇文章分享给你的朋友或者同事。</p>`,55)])])}const u=a(i,[["render",t]]);export{m as __pageData,u as default};
