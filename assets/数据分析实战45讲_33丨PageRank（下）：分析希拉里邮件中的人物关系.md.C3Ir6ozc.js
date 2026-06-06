import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"33丨PageRank（下）：分析希拉里邮件中的人物关系","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何使用工具实现PageRank算法","slug":"如何使用工具实现pagerank算法","link":"#如何使用工具实现pagerank算法","children":[]},{"level":2,"title":"如何用PageRank揭秘希拉里邮件中的人物关系","slug":"如何用pagerank揭秘希拉里邮件中的人物关系","link":"#如何用pagerank揭秘希拉里邮件中的人物关系","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"数据分析实战45讲/33丨PageRank（下）：分析希拉里邮件中的人物关系.md","filePath":"数据分析实战45讲/33丨PageRank（下）：分析希拉里邮件中的人物关系.md","lastUpdated":1779820717000}'),t={name:"数据分析实战45讲/33丨PageRank（下）：分析希拉里邮件中的人物关系.md"};function l(i,a,o,r,g,c){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_33丨pagerank-下-分析希拉里邮件中的人物关系" tabindex="-1">33丨PageRank（下）：分析希拉里邮件中的人物关系 <a class="header-anchor" href="#_33丨pagerank-下-分析希拉里邮件中的人物关系" aria-label="Permalink to &quot;33丨PageRank（下）：分析希拉里邮件中的人物关系&quot;">​</a></h1><p>上节课我们讲到PageRank算法经常被用到网络关系的分析中，比如在社交网络中计算个人的影响力，计算论文的影响力或者网站的影响力等。</p><p>今天我们就来做一个关于PageRank算法的实战，在这之前，你需要思考三个问题：</p><ol><li><p>如何使用工具完成PageRank算法，包括使用工具创建网络图，设置节点、边、权重等，并通过创建好的网络图计算节点的PR值；</p></li><li><p>对于一个实际的项目，比如希拉里的9306封邮件（工具包中邮件的数量），如何使用PageRank算法挖掘出有影响力的节点，并且绘制网络图；</p></li><li><p>如何对创建好的网络图进行可视化，如果网络中的节点数较多，如何筛选重要的节点进行可视化，从而得到精简的网络关系图。</p></li></ol><h2 id="如何使用工具实现pagerank算法" tabindex="-1">如何使用工具实现PageRank算法 <a class="header-anchor" href="#如何使用工具实现pagerank算法" aria-label="Permalink to &quot;如何使用工具实现PageRank算法&quot;">​</a></h2><p>PageRank算法工具在sklearn中并不存在，我们需要找到新的工具包。实际上有一个关于图论和网络建模的工具叫NetworkX，它是用Python语言开发的工具，内置了常用的图与网络分析算法，可以方便我们进行网络数据分析。</p><p>上节课，我举了一个网页权重的例子，假设一共有4个网页A、B、C、D，它们之间的链接信息如图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/47e5f21d16b15a98d4a32a73ebd477ea.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/47e5f21d16b15a98d4a32a73ebd477ea.png" alt=""></a></p><p>针对这个例子，我们看下用NetworkX如何计算A、B、C、D四个网页的PR值，具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import networkx as nx</span></span>
<span class="line"><span># 创建有向图</span></span>
<span class="line"><span>G = nx.DiGraph()</span></span>
<span class="line"><span># 有向图之间边的关系</span></span>
<span class="line"><span>edges = [(&quot;A&quot;, &quot;B&quot;), (&quot;A&quot;, &quot;C&quot;), (&quot;A&quot;, &quot;D&quot;), (&quot;B&quot;, &quot;A&quot;), (&quot;B&quot;, &quot;D&quot;), (&quot;C&quot;, &quot;A&quot;), (&quot;D&quot;, &quot;B&quot;), (&quot;D&quot;, &quot;C&quot;)]</span></span>
<span class="line"><span>for edge in edges:</span></span>
<span class="line"><span>    G.add_edge(edge[0], edge[1])</span></span>
<span class="line"><span>pagerank_list = nx.pagerank(G, alpha=1)</span></span>
<span class="line"><span>print(&quot;pagerank值是：&quot;, pagerank_list)</span></span></code></pre></div><p>NetworkX工具把中间的计算细节都已经封装起来了，我们直接调用PageRank函数就可以得到结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pagerank值是： {&#39;A&#39;: 0.33333396911621094, &#39;B&#39;: 0.22222201029459634, &#39;C&#39;: 0.22222201029459634, &#39;D&#39;: 0.22222201029459634}</span></span></code></pre></div><p>我们通过NetworkX创建了一个有向图之后，设置了节点之间的边，然后使用PageRank函数就可以求得节点的PR值，结果和上节课中我们人工模拟的结果一致。</p><p>好了，运行完这个例子之后，我们来看下NetworkX工具都有哪些常用的操作。</p><p><strong>1.关于图的创建</strong></p><p>图可以分为无向图和有向图，在NetworkX中分别采用不同的函数进行创建。无向图指的是不用节点之间的边的方向，使用nx.Graph() 进行创建；有向图指的是节点之间的边是有方向的，使用nx.DiGraph()来创建。在上面这个例子中，存在A→D的边，但不存在D→A的边。</p><p><strong>2.关于节点的增加、删除和查询</strong></p><p>如果想在网络中增加节点，可以使用G.add_node(‘A’)添加一个节点，也可以使用G.add_nodes_from([‘B’,‘C’,‘D’,‘E’])添加节点集合。如果想要删除节点，可以使用G.remove_node(node)删除一个指定的节点，也可以使用G.remove_nodes_from([‘B’,‘C’,‘D’,‘E’])删除集合中的节点。</p><p>那么该如何查询节点呢？</p><p>如果你想要得到图中所有的节点，就可以使用G.nodes()，也可以用G.number_of_nodes()得到图中节点的个数。</p><p><strong>3.关于边的增加、删除、查询</strong></p><p>增加边与添加节点的方式相同，使用G.add_edge(“A”, “B”)添加指定的“从A到B”的边，也可以使用add_edges_from函数从边集合中添加。我们也可以做一个加权图，也就是说边是带有权重的，使用add_weighted_edges_from函数从带有权重的边的集合中添加。在这个函数的参数中接收的是1个或多个三元组[u,v,w]作为参数，u、v、w分别代表起点、终点和权重。</p><p>另外，我们可以使用remove_edge函数和remove_edges_from函数删除指定边和从边集合中删除。</p><p>另外可以使用edges()函数访问图中所有的边，使用number_of_edges()函数得到图中边的个数。</p><p>以上是关于图的基本操作，如果我们创建了一个图，并且对节点和边进行了设置，就可以找到其中有影响力的节点，原理就是通过PageRank算法，使用nx.pagerank(G)这个函数，函数中的参数G代表创建好的图。</p><h2 id="如何用pagerank揭秘希拉里邮件中的人物关系" tabindex="-1">如何用PageRank揭秘希拉里邮件中的人物关系 <a class="header-anchor" href="#如何用pagerank揭秘希拉里邮件中的人物关系" aria-label="Permalink to &quot;如何用PageRank揭秘希拉里邮件中的人物关系&quot;">​</a></h2><p>了解了NetworkX工具的基础使用之后，我们来看一个实际的案例：希拉里邮件人物关系分析。</p><p>希拉里邮件事件相信你也有耳闻，对这个数据的背景我们就不做介绍了。你可以从GitHub上下载这个数据集： <a href="https://github.com/cystanford/PageRank" target="_blank" rel="noreferrer">https://github.com/cystanford/PageRank</a>。</p><p>整个数据集由三个文件组成：Aliases.csv，Emails.csv和Persons.csv，其中Emails文件记录了所有公开邮件的内容，发送者和接收者的信息。Persons这个文件统计了邮件中所有人物的姓名及对应的ID。因为姓名存在别名的情况，为了将邮件中的人物进行统一，我们还需要用Aliases文件来查询别名和人物的对应关系。</p><p>整个数据集包括了9306封邮件和513个人名，数据集还是比较大的。不过这一次我们不需要对邮件的内容进行分析，只需要通过邮件中的发送者和接收者（对应Emails.csv文件中的MetadataFrom和MetadataTo字段）来绘制整个关系网络。因为涉及到的人物很多，因此我们需要通过PageRank算法计算每个人物在邮件关系网络中的权重，最后筛选出来最有价值的人物来进行关系网络图的绘制。</p><p>了解了数据集和项目背景之后，我们来设计到执行的流程步骤：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/72132ffbc1209301f0876178c75927c9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/72132ffbc1209301f0876178c75927c9.jpg" alt=""></a></p><ol><li><p>首先我们需要加载数据源；</p></li><li><p>在准备阶段：我们需要对数据进行探索，在数据清洗过程中，因为邮件中存在别名的情况，因此我们需要统一人物名称。另外邮件的正文并不在我们考虑的范围内，只统计邮件中的发送者和接收者，因此我们筛选MetadataFrom和MetadataTo这两个字段作为特征。同时，发送者和接收者可能存在多次邮件往来，需要设置权重来统计两人邮件往来的次数。次数越多代表这个边（从发送者到接收者的边）的权重越高；</p></li><li><p>在挖掘阶段：我们主要是对已经设置好的网络图进行PR值的计算，但邮件中的人物有500多人，有些人的权重可能不高，我们需要筛选PR值高的人物，绘制出他们之间的往来关系。在可视化的过程中，我们可以通过节点的PR值来绘制节点的大小，PR值越大，节点的绘制尺寸越大。</p></li></ol><p>设置好流程之后，实现的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span># 用 PageRank 挖掘希拉里邮件中的重要任务关系</span></span>
<span class="line"><span>import pandas as pd</span></span>
<span class="line"><span>import networkx as nx</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>from collections import defaultdict</span></span>
<span class="line"><span>import matplotlib.pyplot as plt</span></span>
<span class="line"><span># 数据加载</span></span>
<span class="line"><span>emails = pd.read_csv(&quot;./input/Emails.csv&quot;)</span></span>
<span class="line"><span># 读取别名文件</span></span>
<span class="line"><span>file = pd.read_csv(&quot;./input/Aliases.csv&quot;)</span></span>
<span class="line"><span>aliases = {}</span></span>
<span class="line"><span>for index, row in file.iterrows():</span></span>
<span class="line"><span>    aliases[row[&#39;Alias&#39;]] = row[&#39;PersonId&#39;]</span></span>
<span class="line"><span># 读取人名文件</span></span>
<span class="line"><span>file = pd.read_csv(&quot;./input/Persons.csv&quot;)</span></span>
<span class="line"><span>persons = {}</span></span>
<span class="line"><span>for index, row in file.iterrows():</span></span>
<span class="line"><span>    persons[row[&#39;Id&#39;]] = row[&#39;Name&#39;]</span></span>
<span class="line"><span># 针对别名进行转换</span></span>
<span class="line"><span>def unify_name(name):</span></span>
<span class="line"><span>    # 姓名统一小写</span></span>
<span class="line"><span>    name = str(name).lower()</span></span>
<span class="line"><span>    # 去掉, 和 @后面的内容</span></span>
<span class="line"><span>    name = name.replace(&quot;,&quot;,&quot;&quot;).split(&quot;@&quot;)[0]</span></span>
<span class="line"><span>    # 别名转换</span></span>
<span class="line"><span>    if name in aliases.keys():</span></span>
<span class="line"><span>        return persons[aliases[name]]</span></span>
<span class="line"><span>    return name</span></span>
<span class="line"><span># 画网络图</span></span>
<span class="line"><span>def show_graph(graph, layout=&#39;spring_layout&#39;):</span></span>
<span class="line"><span>    # 使用 Spring Layout 布局，类似中心放射状</span></span>
<span class="line"><span>    if layout == &#39;circular_layout&#39;:</span></span>
<span class="line"><span>        positions=nx.circular_layout(graph)</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        positions=nx.spring_layout(graph)</span></span>
<span class="line"><span>    # 设置网络图中的节点大小，大小与 pagerank 值相关，因为 pagerank 值很小所以需要 *20000</span></span>
<span class="line"><span>    nodesize = [x[&#39;pagerank&#39;]*20000 for v,x in graph.nodes(data=True)]</span></span>
<span class="line"><span>    # 设置网络图中的边长度</span></span>
<span class="line"><span>    edgesize = [np.sqrt(e[2][&#39;weight&#39;]) for e in graph.edges(data=True)]</span></span>
<span class="line"><span>    # 绘制节点</span></span>
<span class="line"><span>    nx.draw_networkx_nodes(graph, positions, node_size=nodesize, alpha=0.4)</span></span>
<span class="line"><span>    # 绘制边</span></span>
<span class="line"><span>    nx.draw_networkx_edges(graph, positions, edge_size=edgesize, alpha=0.2)</span></span>
<span class="line"><span>    # 绘制节点的 label</span></span>
<span class="line"><span>    nx.draw_networkx_labels(graph, positions, font_size=10)</span></span>
<span class="line"><span>    # 输出希拉里邮件中的所有人物关系图</span></span>
<span class="line"><span>    plt.show()</span></span>
<span class="line"><span># 将寄件人和收件人的姓名进行规范化</span></span>
<span class="line"><span>emails.MetadataFrom = emails.MetadataFrom.apply(unify_name)</span></span>
<span class="line"><span>emails.MetadataTo = emails.MetadataTo.apply(unify_name)</span></span>
<span class="line"><span># 设置遍的权重等于发邮件的次数</span></span>
<span class="line"><span>edges_weights_temp = defaultdict(list)</span></span>
<span class="line"><span>for row in zip(emails.MetadataFrom, emails.MetadataTo, emails.RawText):</span></span>
<span class="line"><span>    temp = (row[0], row[1])</span></span>
<span class="line"><span>    if temp not in edges_weights_temp:</span></span>
<span class="line"><span>        edges_weights_temp[temp] = 1</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        edges_weights_temp[temp] = edges_weights_temp[temp] + 1</span></span>
<span class="line"><span># 转化格式 (from, to), weight =&gt; from, to, weight</span></span>
<span class="line"><span>edges_weights = [(key[0], key[1], val) for key, val in edges_weights_temp.items()]</span></span>
<span class="line"><span># 创建一个有向图</span></span>
<span class="line"><span>graph = nx.DiGraph()</span></span>
<span class="line"><span># 设置有向图中的路径及权重 (from, to, weight)</span></span>
<span class="line"><span>graph.add_weighted_edges_from(edges_weights)</span></span>
<span class="line"><span># 计算每个节点（人）的 PR 值，并作为节点的 pagerank 属性</span></span>
<span class="line"><span>pagerank = nx.pagerank(graph)</span></span>
<span class="line"><span># 将 pagerank 数值作为节点的属性</span></span>
<span class="line"><span>nx.set_node_attributes(graph, name = &#39;pagerank&#39;, values=pagerank)</span></span>
<span class="line"><span># 画网络图</span></span>
<span class="line"><span>show_graph(graph)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将完整的图谱进行精简</span></span>
<span class="line"><span># 设置 PR 值的阈值，筛选大于阈值的重要核心节点</span></span>
<span class="line"><span>pagerank_threshold = 0.005</span></span>
<span class="line"><span># 复制一份计算好的网络图</span></span>
<span class="line"><span>small_graph = graph.copy()</span></span>
<span class="line"><span># 剪掉 PR 值小于 pagerank_threshold 的节点</span></span>
<span class="line"><span>for n, p_rank in graph.nodes(data=True):</span></span>
<span class="line"><span>    if p_rank[&#39;pagerank&#39;] &lt; pagerank_threshold:</span></span>
<span class="line"><span>        small_graph.remove_node(n)</span></span>
<span class="line"><span># 画网络图,采用circular_layout布局让筛选出来的点组成一个圆</span></span>
<span class="line"><span>show_graph(small_graph, &#39;circular_layout&#39;)</span></span></code></pre></div><p>运行结果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/419f7621392045f07bcd03f9e4c7c8b1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/419f7621392045f07bcd03f9e4c7c8b1.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/3f08f61360e8a82a23a16e44d2b973e1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/3f08f61360e8a82a23a16e44d2b973e1.png" alt=""></a></p><p>针对代码中的几个模块我做个简单的说明：</p><p><strong>1.函数定义</strong></p><p>人物的名称需要统一，因此我设置了unify_name函数，同时设置了show_graph函数将网络图可视化。NetworkX提供了多种可视化布局，这里我使用spring_layout布局，也就是呈中心放射状。</p><p>除了spring_layout外，NetworkX还有另外三种可视化布局，circular_layout（在一个圆环上均匀分布节点），random_layout（随机分布节点 ），shell_layout（节点都在同心圆上）。</p><p><strong>2.计算边权重</strong></p><p>邮件的发送者和接收者的邮件往来可能不止一次，我们需要用两者之间邮件往来的次数计算这两者之间边的权重，所以我用edges_weights_temp数组存储权重。而上面介绍过在NetworkX中添加权重边（即使用add_weighted_edges_from函数）的时候，接受的是u、v、w的三元数组，因此我们还需要对格式进行转换，具体转换方式见代码。</p><p><strong>3.PR值计算及筛选</strong></p><p>我使用nx.pagerank(graph)计算了节点的PR值。由于节点数量很多，我们设置了PR值阈值，即pagerank_threshold=0.005，然后遍历节点，删除小于PR值阈值的节点，形成新的图small_graph，最后对small_graph进行可视化（对应运行结果的第二张图）。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在上节课中，我们通过矩阵乘法求得网页的权重，这节课我们使用NetworkX可以得到相同的结果。</p><p>另外我带你用PageRank算法做了一次实战，我们将一个复杂的网络图，通过PR值的计算、筛选，最终得到了一张精简的网络图。在这个过程中我们学习了NetworkX工具的使用，包括创建图、节点、边及PR值的计算。</p><p>实际上掌握了PageRank的理论之后，在实战中往往就是一行代码的事。但项目与理论不同，项目中涉及到的数据量比较大，你会花80%的时间（或80%的代码量）在预处理过程中，比如今天的项目中，我们对别名进行了统一，对边的权重进行计算，同时还需要把计算好的结果以可视化的方式呈现。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/307055050e005ba5092028a074a5c142.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%AE%9E%E6%88%9845%E8%AE%B2/images/83471/307055050e005ba5092028a074a5c142.png" alt=""></a></p><p>今天我举了一个网页权重的例子，假设一共有4个网页A、B、C、D。它们之间的链接信息如文章中的图示。我们假设用户有15%的概率随机跳转，请你编写代码重新计算这4个节点的PR值。</p><p>欢迎你在评论区与我分享你的答案，也欢迎点击“请朋友读”，把这篇文章分享给你的朋友或者同事。</p>`,53)])])}const u=s(t,[["render",l]]);export{h as __pageData,u as default};
