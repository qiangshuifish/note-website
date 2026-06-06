import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"06 | 外键和连接：如何做关联查询？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何创建外键？","slug":"如何创建外键","link":"#如何创建外键","children":[]},{"level":2,"title":"连接","slug":"连接","link":"#连接","children":[]},{"level":2,"title":"关联查询的误区","slug":"关联查询的误区","link":"#关联查询的误区","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"MySQL必知必会/06-外键和连接：如何做关联查询？.md","filePath":"MySQL必知必会/06-外键和连接：如何做关联查询？.md","lastUpdated":1779816051000}'),i={name:"MySQL必知必会/06-外键和连接：如何做关联查询？.md"};function l(t,s,c,o,r,m){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_06-外键和连接-如何做关联查询" tabindex="-1">06 | 外键和连接：如何做关联查询？ <a class="header-anchor" href="#_06-外键和连接-如何做关联查询" aria-label="Permalink to &quot;06 | 外键和连接：如何做关联查询？&quot;">​</a></h1><p>你好，我是朱晓峰。今天我来和你聊一聊关联查询的问题。</p><p>在实际的数据库应用开发过程中，我们经常需要把2个或2个以上的表进行关联，以获取需要的数据。这是因为，为了提高存取效率，我们会把不同业务模块的信息分别存放在不同的表里面。但是，从业务层面上看，我们需要完整全面的信息为经营决策提供数据支撑。</p><p>就拿咱们的超市项目来说，数据库里面的销售流水表一般只保存销售必需的信息（比如商品编号、数量、价格、金额和会员卡号等）。但是，在呈现给超市经营者的统计报表里面，只包括这些信息是不够的，比如商品编号、会员卡号，这些数字经营者就看不懂。因此，必须要从商品信息表提取出商品信息，从会员表中提取出会员的相关信息，这样才能形成一个完整的报表。 <strong>这种把分散在多个不同的表里的数据查询出来的操作，就是多表查询</strong>。</p><p>不过，这种查询可不简单，我们需要建立起多个表之间的关联，然后才能去查询，同时还需要规避关联表查询中的常见错误。具体怎么做呢？我来借助实际的项目给你讲一讲。</p><p>在我们项目的进货模块，有这样2个数据表，分别是进货单头表（importhead）和进货单明细表（importdetails），我们每天都要对这两个表进行增删改查的操作。</p><p>进货单头表记录的是整个进货单的总体信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/43d3b085096efc3a6111a89bbe0e7911.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/43d3b085096efc3a6111a89bbe0e7911.jpg" alt=""></a></p><p>进货单明细表记录了每次进货的商品明细信息。一条进货单头数据记录，对应多条进货商品的明细数据，也就是所谓的一对多的关系。具体信息如下表所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/369981d9a37a38fb65c0981a0544bc44.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/369981d9a37a38fb65c0981a0544bc44.jpg" alt=""></a></p><p>现在我们需要查询一次进货的所有相关数据，包括进货单的总体信息和进货商品的明细，这样一来，我们就需要把2个表关联起来，那么，该怎么操作呢？</p><p>在MySQL中，为了把2个表关联起来，会用到2个重要的功能：外键（FOREIGN KEY）和连接（JOIN）。外键需要在创建表的阶段就定义；连接可以通过相同意义的字段把2个表连接起来，用在查询阶段。</p><p>接下来，我就先和你聊聊外键。</p><h2 id="如何创建外键" tabindex="-1">如何创建外键？ <a class="header-anchor" href="#如何创建外键" aria-label="Permalink to &quot;如何创建外键？&quot;">​</a></h2><p>我先来解释一下什么是外键。</p><p>假设我们有2个表，分别是表A和表B，它们通过一个公共字段“id”发生关联关系，我们把这个关联关系叫做R。如果“id”在表A中是主键，那么，表A就是这个关系R中的主表。相应的，表B就是这个关系中的从表，表B中的“id”，就是表B用来引用表A中数据的，叫外键。所以， <strong>外键就是从表中用来引用主表中数据的那个公共字段</strong>。</p><p>为了方便你理解，我画了一张图来展示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/68836a01eb1d667dea93ceda8e5714ae.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/68836a01eb1d667dea93ceda8e5714ae.jpg" alt=""></a></p><p>如图所示，在关联关系R中，公众字段（字段A）是表A的主键，所以表A是主表，表B是从表。表B中的公共字段（字段A）是外键。</p><p>在MySQL中，外键是通过外键约束来定义的。外键约束就是约束的一种，它必须在从表中定义，包括指明哪个是外键字段，以及外键字段所引用的主表中的主键字段是什么。MySQL系统会根据外键约束的定义，监控对主表中数据的删除操作。如果发现要删除的主表记录，正在被从表中某条记录的外键字段所引用，MySQL就会提示错误，从而确保了关联数据不会缺失。</p><p>外键约束可以在创建表的时候定义，也可以通过修改表来定义。我们先来看看外键约束定义的语法结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[CONSTRAINT &amp;lt;外键约束名称&amp;gt;] FOREIGN KEY 字段名</span></span>
<span class="line"><span>REFERENCES &amp;lt;主表名&amp;gt; 字段名</span></span></code></pre></div><p>你可以在创建表的时候定义外键约束：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE 从表名</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>  字段名 类型,</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>-- 定义外键约束，指出外键字段和参照的主表字段</span></span>
<span class="line"><span>CONSTRAINT 外键约束名</span></span>
<span class="line"><span>FOREIGN KEY (字段名) REFERENCES 主表名 (字段名)</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>当然，你也可以通过修改表来定义外键约束：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ALTER TABLE 从表名 ADD CONSTRAINT 约束名 FOREIGN KEY 字段名 REFERENCES 主表名 （字段名）;</span></span></code></pre></div><p>一般情况下，表与表的关联都是提前设计好了的，因此，会在创建表的时候就把外键约束定义好。不过，如果需要修改表的设计（比如添加新的字段，增加新的关联关系），但没有预先定义外键约束，那么，就要用修改表的方式来补充定义。</p><p>下面，我就来讲一讲怎么创建外键约束。</p><p>先创建主表demo.importhead：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE demo.importhead (</span></span>
<span class="line"><span>    listnumber INT PRIMARY KEY,</span></span>
<span class="line"><span>    supplierid INT,</span></span>
<span class="line"><span>    stocknumber INT,</span></span>
<span class="line"><span>    importtype INT,</span></span>
<span class="line"><span>    importquantity DECIMAL(10 , 3 ),</span></span>
<span class="line"><span>    importvalue DECIMAL(10 , 2 ),</span></span>
<span class="line"><span>    recorder INT,</span></span>
<span class="line"><span>    recordingdate DATETIME</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>然后创建从表demo.importdetails，并且给它定义外键约束：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE demo.importdetails</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>	listnumber INT,</span></span>
<span class="line"><span>	itemnumber INT,</span></span>
<span class="line"><span>	quantity DECIMAL(10,3),</span></span>
<span class="line"><span>	importprice DECIMAL(10,2),</span></span>
<span class="line"><span>	importvalue DECIMAL(10,2),</span></span>
<span class="line"><span>	-- 定义外键约束，指出外键字段和参照的主表字段</span></span>
<span class="line"><span>	CONSTRAINT fk_importdetails_importhead</span></span>
<span class="line"><span>	FOREIGN KEY (listnumber) REFERENCES importhead (listnumber)</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>运行这个SQL语句，我们就在创建表的同时定义了一个名字叫“fk_importdetails_importhead”的外键约束。同时，我们声明，这个外键约束的字段“listnumber”引用的是表importhead里面的字段“listnumber”。</p><p>外键约束创建好之后，我们可以通过Workbench，来查看外键约束是不是创建成功了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/8f7154a32943699113a308b62ea5979b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/8f7154a32943699113a308b62ea5979b.png" alt=""></a></p><p>当然，我们也可以通过SQL语句来查看，这里我们要用到MySQL自带的、用于存储系统信息的数据库：information_schema。我们可以查看外键约束的相关信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt;     constraint_name, -- 表示外键约束名称</span></span>
<span class="line"><span>    -&amp;gt;     table_name, -- 表示外键约束所属数据表的名称</span></span>
<span class="line"><span>    -&amp;gt;     column_name, -- 表示外键约束的字段名称</span></span>
<span class="line"><span>    -&amp;gt;     referenced_table_name, -- 表示外键约束所参照的数据表名称</span></span>
<span class="line"><span>    -&amp;gt;     referenced_column_name -- 表示外键约束所参照的字段名称</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt;     information_schema.KEY_COLUMN_USAGE</span></span>
<span class="line"><span>    -&amp;gt; WHERE</span></span>
<span class="line"><span>    -&amp;gt;     constraint_name = &#39;fk_importdetails_importhead&#39;;</span></span>
<span class="line"><span>+-----------------------------+---------------+-------------+-----------------------+------------------------+</span></span>
<span class="line"><span>| CONSTRAINT_NAME             | TABLE_NAME    | COLUMN_NAME | REFERENCED_TABLE_NAME | REFERENCED_COLUMN_NAME |</span></span>
<span class="line"><span>+-----------------------------+---------------+-------------+-----------------------+------------------------+</span></span>
<span class="line"><span>| fk_importdetails_importhead | importdetails | listnumber  | importhead            | listnumber             |</span></span>
<span class="line"><span>+-----------------------------+---------------+-------------+-----------------------+------------------------+</span></span>
<span class="line"><span>1 row in set (0.05 sec)</span></span></code></pre></div><p>通过查询，我们可以看到，外键约束所在的表是“importdetails”，外键字段是“listnumber”，参照的主表是“importhead”，参照的主表字段是“listnumber”。这样，通过定义外键约束，我们已经建立起了2个表之间的关联关系。</p><p>关联关系建立起来之后，如何才能获取我们需要的数据呢？这时，我们就需要用到连接查询了。</p><h2 id="连接" tabindex="-1">连接 <a class="header-anchor" href="#连接" aria-label="Permalink to &quot;连接&quot;">​</a></h2><p>在MySQL中，有2种类型的连接，分别是内连接（INNER JOIN）和外连接（OUTER JOIN）。</p><ul><li>内连接表示查询结果只返回符合连接条件的记录，这种连接方式比较常用；</li><li>外连接则不同，表示查询结果返回某一个表中的所有记录，以及另一个表中满足连接条件的记录。</li></ul><p>下面我先来讲一下内连接。</p><p>在MySQL里面，关键字JOIN、INNER JOIN、CROSS JOIN的含义是一样的，都表示内连接。我们可以通过JOIN把两个表关联起来，来查询两个表中的数据。</p><p>我借助一个小例子，来帮助你理解。</p><p>咱们的项目中有会员销售的需求，所以，我们的流水表中的数据记录，既包括非会员的普通销售，又包括会员销售。它们的区别是，会员销售的数据记录包括会员编号，而在非会员销售的数据记录中，会员编号为空。</p><p>来看一下项目中的销售表（demo.trans)。实际的销售表比较复杂，为了方便你理解，我把表进行了简化，并且假设业务字段cardno是会员信息表的主键。简化以后的结构如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/97b818520dc0de32c5c8e17181746673.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/97b818520dc0de32c5c8e17181746673.jpg" alt=""></a></p><p>再看下简化后的会员信息表（demo.membermaster）：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/023f62732eede3ee7c14cebd689770c7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/353464/023f62732eede3ee7c14cebd689770c7.jpg" alt=""></a></p><p>这两个表之间存在关联关系，表demo.trans中的字段“cardno”是这个关联关系中的外键。</p><p>我们可以通过内连接，查询所有会员销售的流水记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt;     a.transactionno,</span></span>
<span class="line"><span>    -&amp;gt;     a.itemnumber,</span></span>
<span class="line"><span>    -&amp;gt;     a.quantity,</span></span>
<span class="line"><span>    -&amp;gt;     a.price,</span></span>
<span class="line"><span>    -&amp;gt;     a.transdate,</span></span>
<span class="line"><span>    -&amp;gt;     b.membername</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt;     demo.trans AS a</span></span>
<span class="line"><span>    -&amp;gt;         JOIN</span></span>
<span class="line"><span>    -&amp;gt;     demo.membermaster AS b ON (a.cardno = b.cardno);</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>| transactionno | itemnumber | quantity | price | transdate           | membername |</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>|             1 |          1 |    1.000 | 89.00 | 2020-12-01 00:00:00 | 张三       |</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>可以看到，我们通过公共字段“cardno”把两个表关联到了一起，查询出了会员消费的数据。</p><p>在这里，关键字JOIN与关键字ON配对使用，意思是查询满足关联条件“demo.trans表中cardno的值与demo.membermaster表中的cardno值相等”的两个表中的所有记录。</p><p>知道了内连接，我们再来学习下外连接。跟内连接只返回符合连接条件的记录不同的是，外连接还可以返回表中的所有记录，它包括两类，分别是左连接和右连接。</p><ul><li>左连接，一般简写成LEFT JOIN，返回左边表中的所有记录，以及右表中符合连接条件的记录。</li><li>右连接，一般简写成RIGHT JOIN，返回右边表中的所有记录，以及左表中符合连接条件的记录。</li></ul><p>当我们需要查询全部流水信息的时候，就会用到外连接，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    a.transactionno,</span></span>
<span class="line"><span>    a.itemnumber,</span></span>
<span class="line"><span>    a.quantity,</span></span>
<span class="line"><span>    a.price,</span></span>
<span class="line"><span>    a.transdate,</span></span>
<span class="line"><span>    b.membername</span></span>
<span class="line"><span>FROM demo.trans AS a</span></span>
<span class="line"><span>LEFT JOIN demo.membermaster AS b -- LEFT JOIN，以demo.transaction为主</span></span>
<span class="line"><span>ON (a.cardno = b.cardno);</span></span></code></pre></div><p>可以看到，我用到了LEFT JOIN，意思是以表demo.trans中的数据记录为主，这个表中的数据记录要全部出现在结果集中，同时给出符合连接条件（a.cardno=b.cardno)的表demo.membermaster中的字段membername的值。</p><p>我们也可以使用RIGHT JOIN实现同样的效果，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    a.transactionno,</span></span>
<span class="line"><span>    a.itemnumber,</span></span>
<span class="line"><span>    a.quantity,</span></span>
<span class="line"><span>    a.price,</span></span>
<span class="line"><span>    a.transdate,</span></span>
<span class="line"><span>    b.membername</span></span>
<span class="line"><span>FROM</span></span>
<span class="line"><span>    demo.membermaster AS b</span></span>
<span class="line"><span>        RIGHT JOIN</span></span>
<span class="line"><span>    demo.trans AS a ON (a.cardno = b.cardno); -- RIGHT JOIN，顺序颠倒了，还是以demo.trans为主</span></span></code></pre></div><p>其实，这里就是把顺序颠倒了一下，意思是一样的。运行之后，我们都能得到下面的结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt;     a.transactionno,</span></span>
<span class="line"><span>    -&amp;gt;     a.itemnumber,</span></span>
<span class="line"><span>    -&amp;gt;     a.quantity,</span></span>
<span class="line"><span>    -&amp;gt;     a.price,</span></span>
<span class="line"><span>    -&amp;gt;     a.transdate,</span></span>
<span class="line"><span>    -&amp;gt;     b.membername</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt;     demo.trans AS a</span></span>
<span class="line"><span>    -&amp;gt;         LEFT JOIN   -- 左连接</span></span>
<span class="line"><span>    -&amp;gt;     demo.membermaster AS b ON (a.cardno = b.cardno);</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>| transactionno | itemnumber | quantity | price | transdate           | membername |</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>|             1 |          1 |    1.000 | 89.00 | 2020-12-01 00:00:00 | 张三       |</span></span>
<span class="line"><span>|             2 |          2 |    1.000 | 12.00 | 2020-12-02 00:00:00 | NULL       |</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>2 rows in set (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt;     a.transactionno,</span></span>
<span class="line"><span>    -&amp;gt;     a.itemnumber,</span></span>
<span class="line"><span>    -&amp;gt;     a.quantity,</span></span>
<span class="line"><span>    -&amp;gt;     a.price,</span></span>
<span class="line"><span>    -&amp;gt;     a.transdate,</span></span>
<span class="line"><span>    -&amp;gt;     b.membername</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt;     demo.membermaster AS b</span></span>
<span class="line"><span>    -&amp;gt;         RIGHT JOIN   -- 右连接</span></span>
<span class="line"><span>    -&amp;gt;     demo.trans AS a</span></span>
<span class="line"><span>    -&amp;gt;     ON (a.cardno = b.cardno);</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>| transactionno | itemnumber | quantity | price | transdate           | membername |</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>|             1 |          1 |    1.000 | 89.00 | 2020-12-01 00:00:00 | 张三       |</span></span>
<span class="line"><span>|             2 |          2 |    1.000 | 12.00 | 2020-12-02 00:00:00 | NULL       |</span></span>
<span class="line"><span>+---------------+------------+----------+-------+---------------------+------------+</span></span>
<span class="line"><span>2 rows in set (0.00 sec)</span></span></code></pre></div><p>通过关联查询，销售流水数据里就补齐了会员的名称，我们也就获取到了需要的数据。</p><h2 id="关联查询的误区" tabindex="-1">关联查询的误区 <a class="header-anchor" href="#关联查询的误区" aria-label="Permalink to &quot;关联查询的误区&quot;">​</a></h2><p>有了连接，我们就可以进行2个表的关联查询了。你可能会有疑问：关联查询必须在外键约束的基础上，才可以吗？</p><p>其实，在MySQL中，外键约束不是关联查询的必要条件。很多人往往在设计表的时候，觉得只要连接查询就可以搞定一切了，外键约束太麻烦，没有必要。如果你这么想，就进入了一个误区。</p><p>下面我就以超市进货的例子，来实际说明一下，为什么这种思路不对。</p><p>假设一次进货数据是这样的：供货商编号是1，进货仓库编号是1。我们进货的商品编号是1234，进货数量是1，进货价格是10，进货金额是10。</p><p>我先插入单头数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSERT INTO demo.importhead</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>listnumber,</span></span>
<span class="line"><span>supplierid,</span></span>
<span class="line"><span>stocknumber</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>1234,</span></span>
<span class="line"><span>1,</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>运行成功后，查看一下表的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>    -&amp;gt; FROM demo.importhead;</span></span>
<span class="line"><span>+------------+------------+-------------+------------+----------+-------------+-------------+</span></span>
<span class="line"><span>| listnumber | supplierid | stocknumber | importtype | quantity | importprice | importvalue |</span></span>
<span class="line"><span>+------------+------------+-------------+------------+----------+-------------+-------------+</span></span>
<span class="line"><span>|       1234 |          1 |           1 |          1 |     NULL |        NULL |        NULL |</span></span>
<span class="line"><span>+------------+------------+-------------+------------+----------+-------------+-------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>可以看到，我们有了一个进货单头，单号是1234，供货商是1号供货商，进货仓库是1号仓库。</p><p>接着，我们向进货单明细表中插入进货明细数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>INSERT INTO demo.importdetails</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>listnumber,</span></span>
<span class="line"><span>itemnumber,</span></span>
<span class="line"><span>quantity,</span></span>
<span class="line"><span>importprice,</span></span>
<span class="line"><span>importvalue</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>VALUES</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>1234,</span></span>
<span class="line"><span>1,</span></span>
<span class="line"><span>1,</span></span>
<span class="line"><span>10,</span></span>
<span class="line"><span>10</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>运行成功，查看一下表的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>    -&amp;gt; FROM demo.importdetails;</span></span>
<span class="line"><span>+------------+------------+----------+-------------+-------------+</span></span>
<span class="line"><span>| listnumber | itemnumber | quantity | importprice | importvalue |</span></span>
<span class="line"><span>+------------+------------+----------+-------------+-------------+</span></span>
<span class="line"><span>|       1234 |          1 |    1.000 |       10.00 |       10.00 |</span></span>
<span class="line"><span>+------------+------------+----------+-------------+-------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>这样，我们就有了1234号进货单的明细数据：进货商品是1号商品，进货数量是1个，进货价格是10元，进货金额是10元。</p><p>这个时候，如果我删除进货单头表的数据，就会出现只有明细、没有单头的数据缺失情况。我们来看看会发生什么：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DELETE FROM demo.importhead</span></span>
<span class="line"><span>WHERE listnumbere = 1234;</span></span></code></pre></div><p>运行这条语句，MySQL会提示错误，因为数据删除违反了外键约束。看到了吗？MySQL阻止了数据不一致的情况出现。</p><p>不知道你有没有注意我插入数据的顺序：为什么我要先插入进货单头表的数据，再插入进货单明细表的数据呢？其实，这是因为，如果我先插入数据到从表，也就是进货单明细表，会导致MySQL找不到参照的主表信息，会提示错误，因为添加数据违反了外键约束。</p><p>你可能会不以为然，觉得按照信息系统的操作逻辑，生成一张进货单的时候，一定是先生成单头，再插入明细。同样，删除一张进货单的时候，一定是先删除明细，再删除单头。</p><p>要是你这么想，可能就会“中招”了。原因很简单，既然我们把进货数据拆成了2个表，这就决定了无论是数据添加，还是数据删除，都不能通过一条SQL语句实现。实际工作中，什么突发情况都是有可能发生的。你认为一定会完成的操作，完全有可能只执行了一部分。</p><p>我们曾经就遇到过这么一个问题：用户月底盘点的时候，盘点单无法生成，系统提示“有未处理的进货单”。经过排查，发现是进货单数据发生了数据缺失，明细数据还在，对应的单头数据却被删除了。我们反复排查之后，才发现是缺少了防止数据缺失的机制。最后通过定义外键约束，解决了这个问题。</p><p>所以，虽然你不用外键约束，也可以进行关联查询，但是有了它，MySQL系统才会保护你的数据，避免出现误删的情况，从而提高系统整体的可靠性。</p><p>现在来回答另外一个问题，为什么在MySQL里，没有外键约束也可以进行关联查询呢？原因是外键约束是有成本的，需要消耗系统资源。对于大并发的SQL操作，有可能会不适合。比如大型网站的中央数据库，可能会因为外键约束的系统开销而变得非常慢。所以，MySQL允许你不使用系统自带的外键约束，在应用层面完成检查数据一致性的逻辑。也就是说，即使你不用外键约束，也要想办法通过应用层面的附加逻辑，来实现外键约束的功能，确保数据的一致性。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我给你介绍了如何进行多表查询，我们重点学习了外键和连接。</p><p>外键约束，可以帮助我们确定从表中的外键字段与主表中的主键字段之间的引用关系，还可以确保从表中数据所引用的主表数据不会被删除，从而保证了2个表中数据的一致性。</p><p>连接可以帮助我们对2个相关的表进行连接查询，从2个表中获取需要的信息。左连接表示连接以左边的表为主，结果集中要包括左边表中的所有记录；右连接表示连接以右边的表为主，结果集中要包括右边表中的所有记录。</p><p>我汇总了常用的SQL语句，你一定要重点掌握。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-- 定义外键约束：</span></span>
<span class="line"><span>CREATE TABLE 从表名</span></span>
<span class="line"><span>(</span></span>
<span class="line"><span>字段 字段类型</span></span>
<span class="line"><span>....</span></span>
<span class="line"><span>CONSTRAINT 外键约束名称</span></span>
<span class="line"><span>FOREIGN KEY (字段名) REFERENCES 主表名 (字段名称)</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>ALTER TABLE 从表名 ADD CONSTRAINT 约束名 FOREIGN KEY 字段名 REFERENCES 主表名 （字段名）;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-- 连接查询</span></span>
<span class="line"><span>SELECT 字段名</span></span>
<span class="line"><span>FROM 表名 AS a</span></span>
<span class="line"><span>JOIN 表名 AS b</span></span>
<span class="line"><span>ON (a.字段名称=b.字段名称);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SELECT 字段名</span></span>
<span class="line"><span>FROM 表名 AS a</span></span>
<span class="line"><span>LEFT JOIN 表名 AS b</span></span>
<span class="line"><span>ON (a.字段名称=b.字段名称);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SELECT 字段名</span></span>
<span class="line"><span>FROM 表名 AS a</span></span>
<span class="line"><span>RIGHT JOIN 表名 AS b</span></span>
<span class="line"><span>ON (a.字段名称=b.字段名称);</span></span></code></pre></div><p>刚开始学习MySQL的同学，很容易忽略在关联表中定义外键约束的重要性，从而导致数据缺失，影响系统的可靠性。我建议你尽量养成在关联表中定义外键约束的习惯。不过，如果你的业务场景因为高并发等原因，无法承担外键约束的成本，也可以不定义外键约束，但是一定要在应用层面实现外键约束的逻辑功能，这样才能确保系统的正确可靠。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>如果你的业务场景因高并发等原因，不能使用外键约束，在这种情况下，你怎么在应用层面确保数据的一致性呢？</p><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得今天的内容对你有所帮助，欢迎你把它分享给你的朋友或同事，我们下节课见。</p>`,99)])])}const g=a(i,[["render",l]]);export{b as __pageData,g as default};
