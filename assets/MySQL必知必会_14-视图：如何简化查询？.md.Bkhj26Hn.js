import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"14 | 视图：如何简化查询？","description":"","frontmatter":{},"headers":[{"level":2,"title":"视图的创建及其好处","slug":"视图的创建及其好处","link":"#视图的创建及其好处","children":[]},{"level":2,"title":"如何操作视图和视图中的数据？","slug":"如何操作视图和视图中的数据","link":"#如何操作视图和视图中的数据","children":[{"level":3,"title":"如何操作视图？","slug":"如何操作视图","link":"#如何操作视图","children":[]},{"level":3,"title":"如何操作视图中的数据？","slug":"如何操作视图中的数据","link":"#如何操作视图中的数据","children":[]}]},{"level":2,"title":"视图有哪些优缺点？","slug":"视图有哪些优缺点","link":"#视图有哪些优缺点","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"MySQL必知必会/14-视图：如何简化查询？.md","filePath":"MySQL必知必会/14-视图：如何简化查询？.md","lastUpdated":1779816051000}'),t={name:"MySQL必知必会/14-视图：如何简化查询？.md"};function i(l,s,c,o,g,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_14-视图-如何简化查询" tabindex="-1">14 | 视图：如何简化查询？ <a class="header-anchor" href="#_14-视图-如何简化查询" aria-label="Permalink to &quot;14 | 视图：如何简化查询？&quot;">​</a></h1><p>你好，我是朱晓峰。今天，我们来聊一聊视图。</p><p>视图是一种虚拟表，我们可以把一段查询语句作为视图存储在数据库中，在需要的时候，可以把视图看做一个表，对里面的数据进行查询。</p><p>举个小例子，在学校的信息系统里面，为了减少冗余数据，学生档案（包括姓名、年龄等）和考试成绩（包括考试时间、科目、分数等）是分别存放在不同的数据表里面的，但是，我们经常需要查询学生的考试成绩（包括学生姓名、科目、分数）。这个时候，我们就可以把查询学生考试成绩的这个关联查询，用视图的形式保存起来。这样一来，我们不仅可以从视图中直接查询学生考试成绩，让查询变得简单，而且，视图没有实际存储数据，还避免了数据存储过程中可能产生的冗余，提高了存储的效率。</p><p>今天，我就结合超市的项目，来具体讲解一下怎么创建和操作视图，来帮助你提高查询效率。</p><h2 id="视图的创建及其好处" tabindex="-1">视图的创建及其好处 <a class="header-anchor" href="#视图的创建及其好处" aria-label="Permalink to &quot;视图的创建及其好处&quot;">​</a></h2><p>首先，我们来学习下创建视图的方法，以及使用视图的一些好处。</p><p>创建视图的语法结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE [OR REPLACE]</span></span>
<span class="line"><span>VIEW 视图名称 [(字段列表)]</span></span>
<span class="line"><span>AS 查询语句</span></span></code></pre></div><p>现在，假设我们要查询一下商品的每日销售明细，这就要从销售流水表（demo.trans）和商品信息表（demo.goodsmaster）中获取到销售数据和对应的商品信息数据。</p><p>销售流水表包含流水单号、商品编号、销售数量、销售金额和交易时间等信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/65168f6e248fcc848e8b9968a712c956.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/65168f6e248fcc848e8b9968a712c956.jpeg" alt=""></a></p><p>商品信息表包含商品编号、条码、名称和售价等信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/73836142bbfd6cc0f69de418acb7444b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/73836142bbfd6cc0f69de418acb7444b.jpeg" alt=""></a></p><p>在不使用视图的情况下，我们可以通过对销售流水表和商品信息表进行关联查询，得到每天商品销售统计的结果，包括销售日期、商品名称、每天销售数量的合计和每天销售金额的合计，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; a.transdate,</span></span>
<span class="line"><span>-&amp;gt; a.itemnumber,</span></span>
<span class="line"><span>-&amp;gt; b.goodsname,</span></span>
<span class="line"><span>-&amp;gt; SUM(a.quantity) AS quantity,   -- 统计销售数量</span></span>
<span class="line"><span>-&amp;gt; SUM(a.salesvalue) AS salesvalue -- 统计销售金额</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.trans AS a</span></span>
<span class="line"><span>-&amp;gt; LEFT JOIN                 -- 连接查询</span></span>
<span class="line"><span>-&amp;gt; demo.goodsmaster AS b ON (a.itemnumber = b.itemnumber)</span></span>
<span class="line"><span>-&amp;gt; GROUP BY a.transdate , a.itemnumber;</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+------------+</span></span>
<span class="line"><span>| transdate | itemnumber | goodsname | quantity | salesvalue |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+------------+</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 1 | 本 | 1.000 | 89.00 |</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 2 | 笔 | 1.000 | 5.00 |</span></span>
<span class="line"><span>| 2020-12-02 00:00:00 | 3 | 胶水 | 2.000 | 20.00 |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span></code></pre></div><p>在实际项目中，我们发现，每日商品销售查询使用的频次很高，而且经常需要以这个查询的结果为基础，进行更进一步的统计。</p><p>举个例子，超市经营者要查一下“每天商品的销售数量和当天库存数量的对比”，如果用一个SQL语句查询，就会比较复杂。历史库存表（demo.inventoryhist）如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/ac3f59ba59e460bb4962391b20a8c1bc.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/ac3f59ba59e460bb4962391b20a8c1bc.jpeg" alt=""></a></p><p>接下来我们的查询步骤会使用到子查询和派生表，很容易理解，你知道含义就行了。</p><ul><li>子查询：就是嵌套在另一个查询中的查询。</li><li>派生表：如果我们在查询中把子查询的结果作为一个表来使用，这个表就是派生表。</li></ul><p>这个查询的具体步骤是：</p><ol><li>通过子查询获得单品销售统计的查询结果；</li><li>把第一步中的查询结果作为一个派生表，跟历史库存表进行连接，查询获得包括销售日期、商品名称、销售数量和历史库存数量在内的最终结果。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; a.transdate,</span></span>
<span class="line"><span>-&amp;gt; a.itemnumber,</span></span>
<span class="line"><span>-&amp;gt; a.goodsname,</span></span>
<span class="line"><span>-&amp;gt; a.quantity,       -- 获取单品销售数量</span></span>
<span class="line"><span>-&amp;gt; b.invquantity     -- 获取历史库存数量</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; (SELECT           -- 子查询，统计单品销售</span></span>
<span class="line"><span>-&amp;gt; a.transdate,</span></span>
<span class="line"><span>-&amp;gt; a.itemnumber,</span></span>
<span class="line"><span>-&amp;gt; b.goodsname,</span></span>
<span class="line"><span>-&amp;gt; SUM(a.quantity) AS quantity,</span></span>
<span class="line"><span>-&amp;gt; SUM(a.salesvalue) AS salesvalue</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.trans AS a</span></span>
<span class="line"><span>-&amp;gt; LEFT JOIN demo.goodsmaster AS b ON (a.itemnumber = b.itemnumber)</span></span>
<span class="line"><span>-&amp;gt; GROUP BY a.transdate , a.itemnumber</span></span>
<span class="line"><span>-&amp;gt; ) AS a -- 派生表，与历史库存进行连接</span></span>
<span class="line"><span>-&amp;gt; LEFT JOIN</span></span>
<span class="line"><span>-&amp;gt; demo.inventoryhist AS b</span></span>
<span class="line"><span>-&amp;gt; ON (a.transdate = b.invdate</span></span>
<span class="line"><span>-&amp;gt; AND a.itemnumber = b.itemnumber);</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+-------------+</span></span>
<span class="line"><span>| transdate | itemnumber | goodsname | quantity | invquantity |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+-------------+</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 1 | 本 | 1.000 | 100.000 |</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 2 | 笔 | 1.000 | 99.000 |</span></span>
<span class="line"><span>| 2020-12-02 00:00:00 | 3 | 胶水 | 2.000 | 200.000 |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+-------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span></code></pre></div><p>可以看到，这个查询语句是比较复杂的，可读性和可维护性都比较差。那该怎么办呢？其实，针对这种情况，我们就可以使用视图。</p><p>我们可以把商品的每日销售统计查询做成一个视图，存储在数据库里，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> mysql&amp;gt; CREATE VIEW demo.trans_goodsmaster AS  -- 创建视图</span></span>
<span class="line"><span>-&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; a.transdate,</span></span>
<span class="line"><span>-&amp;gt; a.itemnumber,</span></span>
<span class="line"><span>-&amp;gt; b.goodsname,                           -- 从商品信息表中获取名称</span></span>
<span class="line"><span>-&amp;gt; SUM(a.quantity) AS quantity,           -- 统计销售数量</span></span>
<span class="line"><span>-&amp;gt; SUM(a.salesvalue) AS salesvalue        -- 统计销售金额</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.trans AS a</span></span>
<span class="line"><span>-&amp;gt; LEFT JOIN</span></span>
<span class="line"><span>-&amp;gt; demo.goodsmaster AS b ON (a.itemnumber = b.itemnumber) -- 与商品信息表关联</span></span>
<span class="line"><span>-&amp;gt; GROUP BY a.transdate , a.itemnumber;   -- 按照销售日期和商品编号分组</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.01 sec)</span></span></code></pre></div><p>这样一来，我们每次需要查询每日商品销售数据的时候，就可以直接查询视图，不需要再写一个复杂的关联查询语句了。</p><p>我们来试试用一个查询语句直接从视图中进行查询：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *                 -- 直接查询</span></span>
<span class="line"><span>-&amp;gt; FROM demo.trans_goodsmaster; -- 视图</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+------------+</span></span>
<span class="line"><span>| transdate | itemnumber | goodsname | quantity | salesvalue |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+------------+</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 1 | 本 | 1.000 | 89.00 |</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 2 | 笔 | 1.000 | 5.00 |</span></span>
<span class="line"><span>| 2020-12-02 00:00:00 | 3 | 胶水 | 2.000 | 20.00 |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+------------+</span></span>
<span class="line"><span>3 rows in set (0.01 sec)</span></span></code></pre></div><p>结果显示，这两种查询方式得到的结果是一样的。</p><p>如果我们要进一步查询“每日单品销售的数量与当日的库存数量的对比”，就可以把刚刚定义的视图作为一个数据表来使用。我们把它跟历史库存表连接起来，来获取销售数量和历史库存数量。就像下面的代码这样，查询就简单多了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; a.transdate,               -- 从视图中获取销售日期</span></span>
<span class="line"><span>-&amp;gt; a.itemnumber,              -- 从视图中获取商品编号</span></span>
<span class="line"><span>-&amp;gt; a.goodsname,               -- 从视图中获取商品名称</span></span>
<span class="line"><span>-&amp;gt; a.quantity,                -- 从视图中获取销售数量</span></span>
<span class="line"><span>-&amp;gt; b.invquantity              -- 从历史库存表中获取历史库存数量</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.trans_goodsmaster AS a -- 视图</span></span>
<span class="line"><span>-&amp;gt; LEFT JOIN</span></span>
<span class="line"><span>-&amp;gt; demo.inventoryhist AS b ON (a.transdate = b.invdate</span></span>
<span class="line"><span>-&amp;gt; AND a.itemnumber = b.itemnumber);  -- 直接连接库存历史表</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+-------------+</span></span>
<span class="line"><span>| transdate | itemnumber | goodsname | quantity | invquantity |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+-------------+</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 1 | 本 | 1.000 | 100.000 |</span></span>
<span class="line"><span>| 2020-12-01 00:00:00 | 2 | 笔 | 1.000 | 99.000 |</span></span>
<span class="line"><span>| 2020-12-02 00:00:00 | 3 | 胶水 | 2.000 | 200.000 |</span></span>
<span class="line"><span>+---------------------+------------+-----------+----------+-------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span></code></pre></div><p>结果显示，这里的查询结果和我们刚刚使用派生表的查询结果是一样的。但是， <strong>使用视图的查询语句明显简单多了，可读性更好，也更容易维护</strong>。</p><h2 id="如何操作视图和视图中的数据" tabindex="-1">如何操作视图和视图中的数据？ <a class="header-anchor" href="#如何操作视图和视图中的数据" aria-label="Permalink to &quot;如何操作视图和视图中的数据？&quot;">​</a></h2><p>创建完了视图，我们还经常需要对视图进行一些操作，比如修改、查看和删除视图。同时，我们可能还需要修改视图中的数据。具体咋操作呢？我来介绍下。</p><h3 id="如何操作视图" tabindex="-1">如何操作视图？ <a class="header-anchor" href="#如何操作视图" aria-label="Permalink to &quot;如何操作视图？&quot;">​</a></h3><p>修改、查看、删除视图的操作比较简单，你只要掌握具体的语法就行了。</p><p>修改视图的语法如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ALTER VIEW 视图名</span></span>
<span class="line"><span>AS 查询语句;</span></span></code></pre></div><p>查看视图的语法是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>查看视图：</span></span>
<span class="line"><span>DESCRIBE 视图名；</span></span></code></pre></div><p>删除视图要使用DROP关键词，具体方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>删除视图：</span></span>
<span class="line"><span>DROP VIEW 视图名;</span></span></code></pre></div><p>好了，到这里，对视图的操作我就介绍完了，下面我再讲讲怎么操作视图中的数据。</p><h3 id="如何操作视图中的数据" tabindex="-1">如何操作视图中的数据？ <a class="header-anchor" href="#如何操作视图中的数据" aria-label="Permalink to &quot;如何操作视图中的数据？&quot;">​</a></h3><p>刚刚说过，视图本身是一个虚拟表，所以，对视图中的数据进行插入、修改和删除操作，实际都是通过对实际数据表的操作来实现的。</p><p><strong>1.在视图中插入数据</strong></p><p>为了方便你理解，我们创建一个视图，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE VIEW demo.view_goodsmaster AS</span></span>
<span class="line"><span>SELECT itemnumber,barcode,goodsname,specification,salesprice</span></span>
<span class="line"><span>FROM demo.goodsmaster;</span></span></code></pre></div><p>假设商品信息表中的规格字段（specification）被删除了，当我们尝试用INSERT INTO 语句向视图中插入一条记录的时候，就会提示错误了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; INSERT INTO demo.view_goodsmaster</span></span>
<span class="line"><span>-&amp;gt; (itemnumber,barcode,goodsname,salesprice)</span></span>
<span class="line"><span>-&amp;gt; VALUES</span></span>
<span class="line"><span>-&amp;gt; (5,&#39;0005&#39;,&#39;测试&#39;,100);</span></span>
<span class="line"><span>ERROR 1471 (HY000): The target table view_goodsmaster of the INSERT is not insertable-into</span></span></code></pre></div><p>这是因为， <strong>只有视图中的字段跟实际数据表中的字段完全一样，MySQL才允许通过视图插入数据</strong>。刚刚的视图中包含了实际数据表所没有的字段“specification”，所以在插入数据时，系统就会提示错误。</p><p>为了解决这个问题，我们来修改一下视图，让它只包含实际数据表中有的字段，也就是商品编号、条码、名称和售价。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; ALTER VIEW demo.view_goodsmaster</span></span>
<span class="line"><span>-&amp;gt; AS</span></span>
<span class="line"><span>-&amp;gt; SELECT itemnumber,barcode,goodsname,salesprice -- 只包含实际表中存在的字段</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster</span></span>
<span class="line"><span>-&amp;gt; WHERE salesprice &amp;gt; 50;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.01 sec)</span></span></code></pre></div><p>对视图进行修改之后，我们重新尝试向视图中插入一条记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; INSERT INTO demo.view_goodsmaster</span></span>
<span class="line"><span>-&amp;gt; (itemnumber,barcode,goodsname,salesprice)</span></span>
<span class="line"><span>-&amp;gt; VALUES</span></span>
<span class="line"><span>-&amp;gt; (5,&#39;0005&#39;,&#39;测试&#39;,100);</span></span>
<span class="line"><span>Query OK, 1 row affected (0.02 sec)</span></span></code></pre></div><p>结果显示，插入成功了。</p><p>现在我们来查看一下视图中的数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.view_goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 本 | 89.00 |</span></span>
<span class="line"><span>| 5 | 0005 | 测试 | 100.00 |                        -- 通过视图插入的数据</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>2 rows in set (0.01 sec)</span></span></code></pre></div><p>结果显示，表中确实包含了我们插入的商品编号是5的商品信息。</p><p>现在，视图中已经包括了刚才插入的数据，那么，实际数据表中的数据情况又是怎样的呢？我们再来看一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 本 | 89.00 |</span></span>
<span class="line"><span>| 2 | 0002 | 笔 | 5.00 |</span></span>
<span class="line"><span>| 3 | 0003 | 胶水 | 10.00 |</span></span>
<span class="line"><span>| 5 | 0005 | 测试 | 100.00 |                      -- 通过视图插入的数据</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>4 rows in set (0.00 sec)</span></span></code></pre></div><p>可以看到，实际数据表demo.goodsmaster中，也已经包含通过视图插入的商品编号是5的商品数据了。</p><p><strong>2.删除视图中的数据</strong></p><p>我们可以通过DELETE语句，删除视图中的数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; DELETE FROM demo.view_goodsmaster   -- 直接在视图中删除数据</span></span>
<span class="line"><span>-&amp;gt; WHERE itemnumber = 5;</span></span>
<span class="line"><span>Query OK, 1 row affected (0.02 sec)</span></span></code></pre></div><p>现在我们来查看视图和实际数据表的内容，会发现商品编号是5的商品都已经被删除了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.view_goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 本 | 89.00 |                         -- 视图中已经没有商品编号是5的商品了</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 本 | 89.00 |</span></span>
<span class="line"><span>| 2 | 0002 | 笔 | 5.00 |</span></span>
<span class="line"><span>| 3 | 0003 | 胶水 | 10.00 |                        -- 实际表中也已经没有商品编号是5的商品了</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span></code></pre></div><p><strong>3.修改视图中的数据</strong></p><p>我们可以通过UPDATE语句对视图中的数据进行修改：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; UPDATE demo.view_goodsmaster             -- 更新视图中的数据</span></span>
<span class="line"><span>-&amp;gt; SET salesprice = 100</span></span>
<span class="line"><span>-&amp;gt; WHERE itemnumber = 1;</span></span>
<span class="line"><span>Query OK, 1 row affected (0.01 sec)</span></span>
<span class="line"><span>Rows matched: 1 Changed: 1 Warnings: 0</span></span></code></pre></div><p>结果显示，更新成功了。现在我们来查看一下视图和实际数据表，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.view_goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 本 | 100.00 |                        -- 视图中的售价改过了</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>1 row in set (0.01 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster;</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| itemnumber | barcode | goodsname | salesprice |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>| 1 | 0001 | 本 | 100.00 |                        -- 实际数据表中的售价也改过了</span></span>
<span class="line"><span>| 2 | 0002 | 笔 | 5.00 |</span></span>
<span class="line"><span>| 3 | 0003 | 胶水 | 10.00 |</span></span>
<span class="line"><span>+------------+---------+-----------+------------+</span></span>
<span class="line"><span>3 rows in set (0.00 sec)</span></span></code></pre></div><p>可以发现，视图和原来的数据表都已经改过来了。</p><p>需要注意的是， <strong>我不建议你对视图的数据进行更新操作</strong>，因为MySQL允许用比较复杂的SQL查询语句来创建视图（比如SQL查询语句中使用了分组和聚合函数，或者是UION和DISTINCT关键字），所以，要通过对这个结果集的更新来更新实际数据表，有可能不被允许，因为MySQL没办法精确定位实际数据表中的记录。就比如刚刚讲到的那个“每日销售统计查询”视图就没办法更改，因为创建视图的SQL语句是一个包含了分组函数（GROUP BY）的查询。</p><h2 id="视图有哪些优缺点" tabindex="-1">视图有哪些优缺点？ <a class="header-anchor" href="#视图有哪些优缺点" aria-label="Permalink to &quot;视图有哪些优缺点？&quot;">​</a></h2><p>到这里，视图的操作我就讲完了，现在我们把视线拔高一点，来看看视图都有哪些优缺点。只有全面掌握视图的特点，我们才能充分享受它的高效，避免踩坑。</p><p>首先，我来介绍下视图的优点。</p><p>第一，因为我们可以把视图看成一张表来进行查询，所以在使用视图的时候，我们不用考虑视图本身是如何获取数据的，里面有什么逻辑，包括了多少个表，有哪些关联操作，而是可以直接使用。这样一来，实际上就把查询模块化了，查询变得更加简单，提高了开发和维护的效率。所以，你可以把那些经常会用到的查询和复杂查询的子查询定义成视图，存储到数据库中，这样可以为你以后的使用提供方便。</p><p>第二，视图跟实际数据表不一样，它存储的是查询语句。所以，在使用的时候，我们要通过定义视图的查询语句来获取结果集。而视图本身不存储数据，不占用数据存储的资源。</p><p>第三，视图具有隔离性。视图相当于在用户和实际的数据表之间加了一层虚拟表。也就是说， <strong>用户不需要查询数据表，可以直接通过视图获取数据表中的信息</strong>。这样既提高了数据表的安全性，同时也通过视图把用户实际需要的信息汇总在了一起，查询起来很轻松。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/a2ca36c520ed6a6fee5f788d5dcb2845.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/a2ca36c520ed6a6fee5f788d5dcb2845.jpg" alt=""></a></p><p>第四， <strong>视图的数据结构相对独立，即便实际数据表的结构发生变化，我们也可以通过修改定义视图的查询语句，让查询结果集里的字段保持不变</strong>。这样一来，针对视图的查询就不受实际数据表结构变化的影响了。</p><p>这一点不容易理解，我举个小例子来说明一下。</p><p>假设我们有一个实际的数据表（demo.goodsmaster），包括商品编号、条码、名称、规格和售价等信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/63f46f64a5007278b97235a00633d58f.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/63f46f64a5007278b97235a00633d58f.jpeg" alt=""></a></p><p>在这个表的基础上，我们建一个视图，查询所有价格超过50元的商品：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE VIEW demo.view_goodsmaster AS</span></span>
<span class="line"><span>-&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster</span></span>
<span class="line"><span>-&amp;gt; WHERE salesprice &amp;gt; 50;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.03 sec)</span></span></code></pre></div><p>接着，我们在这个视图的基础上做一个查询，来验证一下视图的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT barcode,goodsname,specification</span></span>
<span class="line"><span>-&amp;gt; FROM demo.view_goodsmaster;</span></span>
<span class="line"><span>+---------+-----------+---------------+</span></span>
<span class="line"><span>| barcode | goodsname | specification |</span></span>
<span class="line"><span>+---------+-----------+---------------+</span></span>
<span class="line"><span>| 0001 | 本 | 16开 |</span></span>
<span class="line"><span>+---------+-----------+---------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>结果显示，我们得到了商品信息表中售价大于50元的商品：本（16开）。</p><p>假设现在我们需要把数据表demo.goodsmaster中的字段“specification”删掉，就可以用下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; ALTER TABLE demo.goodsmaster DROP COLUMN specification;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.13 sec)</span></span>
<span class="line"><span>Records: 0 Duplicates: 0 Warnings: 0</span></span></code></pre></div><p>这样一来，因为少了一个字段，而我们的语句又是直接查询数据表的，代码就会提示错误：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT barcode,goodsname,specification</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster;</span></span>
<span class="line"><span>ERROR 1054 (42S22): Unknown column &#39;specification&#39; in &#39;field list&#39;</span></span></code></pre></div><p>你看，代码提示字段“specification”不存在。</p><p>但是，如果查询的是视图，就可以通过修改视图来规避这个问题。我们可以用下面的代码把刚才的视图修改一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; ALTER VIEW demo.view_goodsmaster</span></span>
<span class="line"><span>-&amp;gt; AS</span></span>
<span class="line"><span>-&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; itemnumber,</span></span>
<span class="line"><span>-&amp;gt; barcode,</span></span>
<span class="line"><span>-&amp;gt; goodsname,</span></span>
<span class="line"><span>-&amp;gt; &#39;&#39; as specification, -- 由于字段不存在，插入一个长度是0的空字符串作为这个字段的值</span></span>
<span class="line"><span>-&amp;gt; salesprice</span></span>
<span class="line"><span>-&amp;gt; FROM demo.goodsmaster</span></span>
<span class="line"><span>-&amp;gt; WHERE salesprice &amp;gt; 50;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.02 sec)</span></span></code></pre></div><p>你看，虽然实际数据表中已经没有字段“specification”了，但是视图中却保留了这个字段，而且字段值始终是空字符串。所以，我们不用修改原有视图的查询语句，它也会正常运行。下面的代码查询的结果中，就包括了实际数据表没有的字段“specification”。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT barcode,goodsname,specification</span></span>
<span class="line"><span>-&amp;gt; FROM demo.view_goodsmaster;</span></span>
<span class="line"><span>+---------+-----------+---------------+</span></span>
<span class="line"><span>| barcode | goodsname | specification |</span></span>
<span class="line"><span>+---------+-----------+---------------+</span></span>
<span class="line"><span>| 0001 | 本 | |</span></span>
<span class="line"><span>+---------+-----------+---------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>结果显示，运行成功了。这个视图查询，就没有受到实际数据表中删除字段的影响。</p><p>看到这儿，你可能会说，视图有这么多好处，那我以后都用视图可以吗？其实不是的，视图也有自身的不足。</p><p>如果我们在实际数据表的基础上创建了视图，那么， <strong>如果实际数据表的结构变更了，我们就需要及时对相关的视图进行相应的维护</strong>。特别是当视图是由视图生成的时候，维护会变得比较复杂。因为创建视图的SQL查询可能会对字段重命名，也可能包含复杂的逻辑，这些都会增加维护的成本。</p><p>所以，在创建视图的时候，你要结合实际项目需求，综合考虑视图的优点和不足，这样才能正确使用视图，使系统整体达到最优。</p><p>为了方便你掌握，我用一张图来汇总下视图的优缺点：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/d4cb502799c8328d22774907d7b97212.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/d4cb502799c8328d22774907d7b97212.jpeg" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我给你介绍了简化查询的工具：视图，我们学习了创建视图、操作视图和视图中的数据的方法以及视图的优缺点。你要重点掌握操作的语法结构。</p><p>最后，我还是想提醒你一下，虽然可以更新视图数据，但总的来说，视图作为虚拟表，主要用于方便查询。我不建议你更新视图的数据，因为对视图数据的更改，都是通过对实际数据表里数据的操作来完成的，而且有很多限制条件。</p><p>视图虽然有很多优点。但是在创建视图、简化查询的同时，也要考虑到视图太多而导致的数据库维护成本的问题。</p><p>视图不是越多越好，特别是嵌套的视图（就是在视图的基础上创建视图），我不建议你使用，因为逻辑复杂，可读性不好，容易变成系统的潜在隐患。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>假设某公园售票系统包括门票信息表和类别信息表，这两个表之间通过类别编号相关联。</p><p>门票信息表包含门票编号、名称、类别编号和剩余数量等信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/e1d07bcc301ec2929ff50d601b3c5a6a.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/e1d07bcc301ec2929ff50d601b3c5a6a.jpeg" alt=""></a></p><p>类别信息表包含类别编号、开门时间和闭馆时间。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/8f21b2f64c2bb51ab7719f27d40ed942.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/359702/8f21b2f64c2bb51ab7719f27d40ed942.jpeg" alt=""></a></p><p>请编写一个视图，视图返回的结果集包括：当前时间可以卖的门票名称和剩余数量（说明：开门前30分钟开始售票，结束前30分钟停止售票）。</p><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得今天的内容对你有所帮助，也欢迎你把它分享给你的朋友或同事，我们下节课见。</p>`,120)])])}const b=a(t,[["render",i]]);export{r as __pageData,b as default};
