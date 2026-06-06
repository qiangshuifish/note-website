import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"28 | 手把手带你设计一个完整的连锁超市信息系统数据库（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何创建数据库和数据表？","slug":"如何创建数据库和数据表","link":"#如何创建数据库和数据表","children":[{"level":3,"title":"如何创建索引？","slug":"如何创建索引","link":"#如何创建索引","children":[]},{"level":3,"title":"如何创建视图？","slug":"如何创建视图","link":"#如何创建视图","children":[]},{"level":3,"title":"如何创建存储过程？","slug":"如何创建存储过程","link":"#如何创建存储过程","children":[]},{"level":3,"title":"如何创建触发器？","slug":"如何创建触发器","link":"#如何创建触发器","children":[]}]},{"level":2,"title":"如何制定容灾和备份策略？","slug":"如何制定容灾和备份策略","link":"#如何制定容灾和备份策略","children":[{"level":3,"title":"如何搭建主从服务器？","slug":"如何搭建主从服务器","link":"#如何搭建主从服务器","children":[]},{"level":3,"title":"如何制定数据备份策略？","slug":"如何制定数据备份策略","link":"#如何制定数据备份策略","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"MySQL必知必会/28-手把手带你设计一个完整的连锁超市信息系统数据库（下）.md","filePath":"MySQL必知必会/28-手把手带你设计一个完整的连锁超市信息系统数据库（下）.md","lastUpdated":1779816051000}'),i={name:"MySQL必知必会/28-手把手带你设计一个完整的连锁超市信息系统数据库（下）.md"};function l(t,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_28-手把手带你设计一个完整的连锁超市信息系统数据库-下" tabindex="-1">28 | 手把手带你设计一个完整的连锁超市信息系统数据库（下） <a class="header-anchor" href="#_28-手把手带你设计一个完整的连锁超市信息系统数据库-下" aria-label="Permalink to &quot;28 | 手把手带你设计一个完整的连锁超市信息系统数据库（下）&quot;">​</a></h1><p>你好，我是朱晓峰。</p><p>上节课，我们完成了项目的需求分析和业务流程的梳理，为设计数据库做好了准备工作，接下来我们就可以开始具体的设计了。所以，今天，我就带你来建库建表、创建外键约束、视图、存储过程和触发器，最后制定容灾和备份的策略，从而完成一个完整的连锁超市项目数据库的设计，帮助你提高设计高效可靠的数据库的能力。</p><p>首先，我们一起来创建数据库和数据表。</p><h2 id="如何创建数据库和数据表" tabindex="-1">如何创建数据库和数据表？ <a class="header-anchor" href="#如何创建数据库和数据表" aria-label="Permalink to &quot;如何创建数据库和数据表？&quot;">​</a></h2><p>经过上节课的分库分表操作，我们把数据库按照业务模块，拆分成了多个数据库。其中，盘点模块中的数据表分别被拆分到了营运数据库（operation）和库存数据库（inventory）中。</p><p>下面我们就按照上节课的分库策略，分别创建营运数据库和库存数据库：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE DATABASE operation;</span></span>
<span class="line"><span>Query OK, 1 row affected (0.03 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&amp;gt; CREATE DATABASE inventory;</span></span>
<span class="line"><span>Query OK, 1 row affected (0.02 sec)</span></span></code></pre></div><p>接下来，我们来分别创建下这两个数据库中的表。</p><p>商户表、门店表、员工表、商品常用信息表和商品不常用信息表从属于营运数据库，我们先把这5个表创建出来。</p><p>商户表（operation.enterprice）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE operation.enterprice</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT PRIMARY KEY,  -- 组号</span></span>
<span class="line"><span>-&amp;gt; groupname VARCHAR(100) NOT NULL,   -- 名称</span></span>
<span class="line"><span>-&amp;gt; address TEXT NOT NULL,             -- 地址</span></span>
<span class="line"><span>-&amp;gt; phone VARCHAR(20) NOT NULL,        -- 电话</span></span>
<span class="line"><span>-&amp;gt; contactor VARCHAR(50) NOT NULL     -- 联系人</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span></code></pre></div><p>门店表（operation.branch）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE operation.branch</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT PRIMARY KEY,        -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,        -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchname VARCHAR(100) NOT NULL,     -- 门店名称</span></span>
<span class="line"><span>-&amp;gt; address TEXT NOT NULL,                -- 地址</span></span>
<span class="line"><span>-&amp;gt; phone VARCHAR(20) NOT NULL,           -- 电话</span></span>
<span class="line"><span>-&amp;gt; branchtype VARCHAR(20) NOT NULL,      -- 门店类别</span></span>
<span class="line"><span>-&amp;gt; CONSTRAINT fk_branch_enterprice FOREIGN KEY (groupnumber) REFERENCES operation.enterprice(groupnumber)  -- 外键约束，组号是外键</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span></code></pre></div><p>员工表（operation.employee）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE operation.employee</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; employeeid SMALLINT PRIMARY KEY,     -- 员工编号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,       -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,          -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; workno VARCHAR(20) NOT NULL,         -- 工号</span></span>
<span class="line"><span>-&amp;gt; employeename VARCHAR(100) NOT NULL,  -- 员工名称</span></span>
<span class="line"><span>-&amp;gt; pid VARCHAR(20) NOT NULL,            -- 身份证</span></span>
<span class="line"><span>-&amp;gt; address VARCHAR(100) NOT NULL,       -- 地址</span></span>
<span class="line"><span>-&amp;gt; phone VARCHAR(20) NOT NULL,          -- 电话</span></span>
<span class="line"><span>-&amp;gt; employeeduty VARCHAR(20) NOT NULL,   -- 职责</span></span>
<span class="line"><span>-&amp;gt; CONSTRAINT fk_employee_branch FOREIGN KEY (branchid) REFERENCES operation.branch(branchid)</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span></code></pre></div><p>商品常用信息表（operation.goods_o）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE operation.goods_o</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; itemnumber MEDIUMINT ,   -- 商品编号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,      -- 组号</span></span>
<span class="line"><span>-&amp;gt; barcode VARCHAR(50) NOT NULL,       -- 条码</span></span>
<span class="line"><span>-&amp;gt; goodsname TEXT NOT NULL,            -- 名称</span></span>
<span class="line"><span>-&amp;gt; salesprice DECIMAL(10,2) NOT NULL,  -- 售价</span></span>
<span class="line"><span>-&amp;gt; PRIMARY KEY (groupnumber,itemnumber)-- 主键</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.06 sec)</span></span></code></pre></div><p>商品不常用信息表（operation.goods_f）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE operation.goods_f</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; itemnumber MEDIUMINT,       -- 商品编号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,          -- 组号</span></span>
<span class="line"><span>-&amp;gt; specification TEXT NOT NULL,            -- 规格</span></span>
<span class="line"><span>-&amp;gt; unit VARCHAR(20) NOT NULL,              -- 单位</span></span>
<span class="line"><span>-&amp;gt; PRIMARY KEY (groupnumber,itemnumber)    -- 主键</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.06 sec)</span></span></code></pre></div><p>好了，现在我们来创建库存数据库中的表。仓库表、库存表、盘点单头表、盘点单明细表、盘点单头历史表和盘点单明细历史表，从属于库存数据库。</p><p>仓库表（inventory.stockmaster）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE inventory.stockmaster</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; stockid SMALLINT PRIMARY KEY,     -- 仓库编号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,    -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,       -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; stockname VARCHAR(100) NOT NULL,  -- 仓库名称</span></span>
<span class="line"><span>-&amp;gt; stockkind VARCHAR(20) NOT NULL,   -- 仓库种类</span></span>
<span class="line"><span>-&amp;gt; CONSTRAINT fk_stock_branch FOREIGN KEY (branchid) REFERENCES operation.branch(branchid)           -- 外键约束，门店编号是外键</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span></code></pre></div><p>库存表（inventory.inventory）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE inventory.inventory</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; id INT PRIMARY KEY AUTO_INCREMENT,       -- 库存编号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,           -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,              -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; stockid SMALLINT NOT NULL,               -- 仓库编号</span></span>
<span class="line"><span>-&amp;gt; itemnumber MEDIUMINT NOT NULL,           -- 商品编号</span></span>
<span class="line"><span>-&amp;gt; itemquantity DECIMAL(10,3) NOT NULL      -- 商品数量</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.06 sec)</span></span></code></pre></div><p>盘点单头表（inventory.invcounthead）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE inventory.invcounthead</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; listnumber INT PRIMARY KEY,              -- 单号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,           -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,              -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; stockid SMALLINT NOT NULL,               -- 仓库编号</span></span>
<span class="line"><span>-&amp;gt; recorder SMALLINT NOT NULL,              -- 录入人编号</span></span>
<span class="line"><span>-&amp;gt; recordingdate DATETIME NOT NULL          -- 录入时间</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span></code></pre></div><p>盘点单明细表（inventorry.invcountdetails）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE inventory.invcountdetails</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; id INT PRIMARY KEY AUTO_INCREMENT,   -- 明细编号</span></span>
<span class="line"><span>-&amp;gt; listnumber INT NOT NULL,             -- 单号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,       -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,          -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; stockid SMALLINT NOT NULL,           -- 仓库编号</span></span>
<span class="line"><span>-&amp;gt; itemnumber MEDIUMINT NOT NULL,       -- 商品编号</span></span>
<span class="line"><span>-&amp;gt; accquant DECIMAL(10,3) NOT NULL,     -- 结存数量</span></span>
<span class="line"><span>-&amp;gt; invquant DECIMAL(10,3) NOT NULL,     -- 盘存数量</span></span>
<span class="line"><span>-&amp;gt; plquant DECIMAL(10,3) NOT NULL       -- 盈亏数量</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span></code></pre></div><p>盘点单头历史表（inventory.invcountheadhist）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE inventory.invcountheadhist</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; listnumber INT PRIMARY KEY,       -- 单号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,    -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,       -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; stockid SMALLINT NOT NULL,        -- 仓库编号</span></span>
<span class="line"><span>-&amp;gt; recorder SMALLINT NOT NULL,       -- 录入人编号</span></span>
<span class="line"><span>-&amp;gt; recordingdate DATETIME NOT NULL,  -- 录入时间</span></span>
<span class="line"><span>-&amp;gt; confirmer SMALLINT NOT NULL,      -- 验收人编号</span></span>
<span class="line"><span>-&amp;gt; confirmationdate DATETIME NOT NULL -- 验收时间</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.10 sec)</span></span></code></pre></div><p>盘点单明细历史表（inventorry.invcountdetailshist）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE TABLE inventory.invcountdetailshist</span></span>
<span class="line"><span>-&amp;gt; (</span></span>
<span class="line"><span>-&amp;gt; id INT PRIMARY KEY AUTO_INCREMENT,   -- 明细编号</span></span>
<span class="line"><span>-&amp;gt; listnumber INT NOT NULL,             -- 单号</span></span>
<span class="line"><span>-&amp;gt; groupnumber SMALLINT NOT NULL,       -- 组号</span></span>
<span class="line"><span>-&amp;gt; branchid SMALLINT NOT NULL,          -- 门店编号</span></span>
<span class="line"><span>-&amp;gt; stockid SMALLINT NOT NULL,           -- 仓库编号</span></span>
<span class="line"><span>-&amp;gt; itemnumber MEDIUMINT NOT NULL,       -- 商品编号</span></span>
<span class="line"><span>-&amp;gt; accquant DECIMAL(10,3) NOT NULL,     -- 结存数量</span></span>
<span class="line"><span>-&amp;gt; invquant DECIMAL(10,3) NOT NULL,     -- 盘存数量</span></span>
<span class="line"><span>-&amp;gt; plquant DECIMAL(10,3) NOT NULL       -- 盈亏数量</span></span>
<span class="line"><span>-&amp;gt; );</span></span>
<span class="line"><span>Query OK, 0 rows affected (1.62 sec)</span></span></code></pre></div><p>至此，我们完成了创建数据库和数据表的工作。为了提高查询的速度，我们还要为数据表创建索引。下面我们就来实际操作一下。</p><h3 id="如何创建索引" tabindex="-1">如何创建索引？ <a class="header-anchor" href="#如何创建索引" aria-label="Permalink to &quot;如何创建索引？&quot;">​</a></h3><p>索引对提升数据查询的效率作用最大，没有之一。我们创建索引的策略是：</p><ol><li>所有的数据表都必须创建索引；</li><li>只要是有可能成为查询筛选条件的字段，都必须创建索引。</li></ol><p>这样做的原因是，当数据量特别大的时候，如果没有索引，一旦出现大并发，没有索引的表很可能会成为访问的瓶颈。而且这个问题十分隐蔽，不容易察觉，系统也不会报错，但是却会消耗大量的CPU资源，导致系统事实上的崩溃。</p><p>在之前的操作中，我们一共创建了11个数据表，下面我们就来一一为这些表创建索引。</p><p>商户表中的组号字段，常被用于筛选条件。我们用商户表的组号字段为商户表创建索引，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_enterprice_groupname ON operation.enterprice (groupname);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.06 sec)</span></span>
<span class="line"><span>Records: 0 Duplicates: 0 Warnings: 0</span></span></code></pre></div><p>门店表的组号字段也常被用作筛选条件，所以，我们用组号字段为门店表创建索引，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_branch_groupnumber ON operation.branch (groupnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>除了组号字段，门店名称字段也常用在查询的筛选条件中，下面我们就用门店名称字段为门店表创建索引：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_branch_branchname ON operation.branch (branchname);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>门店类别字段也是用作筛选条件的字段之一，我们可以用门店类别字段为门店表创建索引，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_branch_branchtype ON operation.branch (branchtype);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>在员工表中，组号、门店编号、身份证号、电话和职责字段常被用作查询的筛选条件，下面我们就分别用这几个字段为员工表创建索引。</p><p>第一步，用组号字段为员工表创建索引：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_employee_groupnumer ON operation.employee (groupnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.06 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>第二步，用门店编号字段为员工表创建索引：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_employee_branchid ON operation.employee (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>第三步，用身份证字段为员工表创建索引：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_employee_pid ON operation.employee (pid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>第四步，用电话字段为员工表创建索引：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_employee_phone ON operation.employee (phone);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>最后，我们用职责字段为员工表创建索引：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_employee_duty ON operation.employee (employeeduty);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.09 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>对于商品常用信息表（operation.goods_o），我们发现，组号和售价字段常被用在查询筛选条件语句中，所以，我们分别用这两个字段为商品常用信息表创建索引。</p><p>首先，用组号字段为商品常用信息表创建索引，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_goodso_groupnumber ON operation.goods_o (groupnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>然后，用价格字段为商品常用信息表创建索引，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_goodso_salesprice ON operation.goods_o (salesprice);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>对于商品不常用信息表，只有组号字段经常用在查询的筛选条件中，所以，我们只需要用组号字段为商品不常用信息表创建索引。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_goodsf_groupnumber ON operation.goods_f (groupnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>到这里，我们就完成了为营运数据库中的表创建索引的工作，下面我们来为库存数据库中的表创建索引。</p><p>首先是仓库表。这个表中经常被用做筛选条件的字段，是组号和门店编号字段。</p><p>我们先用组号字段为仓库表创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_stock_groupnumber ON inventory.stockmaster (groupnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>然后我们用门店编号字段为仓库表创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_stock_branchid ON inventory.stockmaster (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>接下来，我们为库存表创建索引。库存表中常用于筛选的字段有组号、门店编号和商品编号字段。</p><p>我们先用组号字段来创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_inventory_groupnumber ON inventory.inventory (groupnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.11 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>然后，我们用门店编号字段创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_inventory_branchid ON inventory.inventory (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>最后用商品编号字段创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_inventory_itemnumber ON inventory.inventory (itemnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.07 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>盘点单头表也需要创建索引，常用的筛选字段是门店编号。那么，我们就用门店编号为盘点单头表创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcounthead_branchid ON inventory.invcounthead (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>盘点单头明细表中常用于筛选的字段有门店编号和商品编号，我们分别用这2个字段创建索引。</p><p>首先是用门店编号字段创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcountdetails_branchid ON inventory.invcountdetails (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.08 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>然后是用商品编号字段创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcountdetails_itemnumber ON inventory.invcountdetails (itemnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>盘点单头历史表数据量比较大，主要用于查询，常用的筛选字段有门店编号和验收时间。我们先用门店编号字段创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcounthaedhist_branchid ON inventory.invcountheadhist (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.06 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>然后用验收时间字段创建索引，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcounthaedhist_confirmationdate ON inventory.invcountheadhist (confirmationdate);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>盘点单明细历史表是整个盘点模块中数据量最大的表，主要用于查询，索引对提升查询效率来说非常重要。要是忘了创建索引，很可能成为整个系统的瓶颈。</p><p>这个表中用作筛选条件的字段主要有门店编号和商品编号，我们分别用它们创建索引。首先是门店编号字段，创建索引的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcountdetailshist_branchid ON inventory.invcountdetailshist (branchid);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.05 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>然后是商品编号字段，创建索引的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE INDEX index_invcountdetailshist_itemnumber ON inventory.invcountdetailshist (itemnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span>
<span class="line"><span>Records: 0  Duplicates: 0  Warnings: 0</span></span></code></pre></div><p>到这里，索引就全部创建完成了。</p><p>由于我们把盘点单拆分成了单头和明细两个表，在应用中，经常要用到单头和明细的全部信息，所以，为了使代码更加简洁，查询更加方便，我们要为这两个表创建视图。</p><h3 id="如何创建视图" tabindex="-1">如何创建视图？ <a class="header-anchor" href="#如何创建视图" aria-label="Permalink to &quot;如何创建视图？&quot;">​</a></h3><p>首先，我们为盘点单创建视图，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE VIEW view_invcount</span></span>
<span class="line"><span>    -&amp;gt; AS</span></span>
<span class="line"><span>    -&amp;gt; SELECT a.*,b.itemnumber,b.accquant,b.invquant,b.plquant</span></span>
<span class="line"><span>    -&amp;gt; FROM inventory.invcounthead AS a</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; inventory.invcountdetails AS b</span></span>
<span class="line"><span>    -&amp;gt; ON (a.listnumber=b.listnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.04 sec)</span></span></code></pre></div><p>然后，我们为盘点单历史表创建视图，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE VIEW view_invcounthist</span></span>
<span class="line"><span>    -&amp;gt; AS</span></span>
<span class="line"><span>    -&amp;gt; SELECT a.*,b.itemnumber,b.accquant,b.invquant,b.plquant</span></span>
<span class="line"><span>    -&amp;gt; FROM inventory.invcountheadhist AS a</span></span>
<span class="line"><span>    -&amp;gt; JOIN inventory.invcountdetailshist AS b</span></span>
<span class="line"><span>    -&amp;gt; ON (a.listnumber=b.listnumber);</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.02 sec)</span></span></code></pre></div><h3 id="如何创建存储过程" tabindex="-1">如何创建存储过程？ <a class="header-anchor" href="#如何创建存储过程" aria-label="Permalink to &quot;如何创建存储过程？&quot;">​</a></h3><p>在整个盘点模块中，有一个核心的计算模块，就是盘点单验收模块。这个计算模块，每次盘点结束都会被调用。为了提升执行效率，让代码更加模块化，使代码的可读性更好，我们可以把盘点表验收这个模块的数据处理逻辑，用存储过程的方式保存在服务器上，以方便应用程序进行调用。</p><p>下面我具体介绍存储过程的入口参数和数据处理逻辑。</p><p>存储过程的入口参数是单号和验收人的员工编号。存储过程的数据处理逻辑是：先用盈亏数量调整库存，计算方式是新库存 = 老库存 + 盈亏数量；然后把盘点单数据移到盘点单历史中去。</p><ul><li>把盘点单明细表中的数据插入到盘点单明细历史表中；</li><li>把盘点单头表中的数据，插入到盘点单头历史表中；</li><li>删除盘点单明细表中的数据；</li><li>删除盘点单头表中的数据。</li></ul><p>按照这个参数定义和计算逻辑，我们就可以用下面的代码来创建存储过程了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE DEFINER=\`root\`&amp;#64;\`localhost\` PROCEDURE \`invcountconfirm\`(mylistnumber INT,myconfirmer SMALLINT)</span></span>
<span class="line"><span>BEGIN</span></span>
<span class="line"><span>DECLARE done INT DEFAULT FALSE;</span></span>
<span class="line"><span>DECLARE mybranchid INT;</span></span>
<span class="line"><span>DECLARE myitemnumber INT;</span></span>
<span class="line"><span>DECLARE myplquant DECIMAL(10,3);</span></span>
<span class="line"><span>DECLARE cursor_invcount CURSOR FOR</span></span>
<span class="line"><span>SELECT branchid,itemnumber,plquant</span></span>
<span class="line"><span>FROM inventory.invcountdetails</span></span>
<span class="line"><span>WHERE listnumber = mylistnumber;</span></span>
<span class="line"><span>DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;</span></span>
<span class="line"><span>DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>START TRANSACTION;</span></span>
<span class="line"><span> OPEN cursor_invcount; -- 打开游标</span></span>
<span class="line"><span> FETCH cursor_invcount INTO mybranchid,myitemnumber,myplquant; -- 读入第一条记录</span></span>
<span class="line"><span>REPEAT</span></span>
<span class="line"><span>  UPDATE inventory.inventory</span></span>
<span class="line"><span>  SET itemquantity = itemquantity + myplquant    -- 更新库存</span></span>
<span class="line"><span>        WHERE itemnumber = myitemnumber</span></span>
<span class="line"><span>        AND branchid = mybranchid;</span></span>
<span class="line"><span>  FETCH cursor_invcount INTO mybranchid,myitemnumber,myplquant; -- 读入下一条记录</span></span>
<span class="line"><span> UNTIL done END REPEAT;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> CLOSE cursor_invcount;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  INSERT INTO inventory.invcountdetailshist</span></span>
<span class="line"><span>(listnumber,groupnumber,branchid,stockid,itemnumber,accquant,invquant,plquant)</span></span>
<span class="line"><span>  SELECT listnumber,groupnumber,branchid,stockid,itemnumber,accquant,invquant,plquant</span></span>
<span class="line"><span>  FROM inventory.invcountdetails</span></span>
<span class="line"><span>  WHERE listnumber=mylistnumber;  -- 把这一单的盘点单明细插入历史表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  INSERT INTO inventory.invcountheadhist</span></span>
<span class="line"><span>(listnumber,groupnumber,branchid,stockid,recorder,recordingdate,confirmer,confirmationdate)</span></span>
<span class="line"><span>  SELECT listnumber,groupnumber,branchid,stockid,recorder,recordingdate,myconfirmer,now()</span></span>
<span class="line"><span>  FROM inventory.invcounthead</span></span>
<span class="line"><span>  WHERE listnumber=mylistnumber;  -- 把这一单的盘点单头插入历史</span></span>
<span class="line"><span>  DELETE FROM inventory.invcountdetails WHERE listnumber = mylistnumber; -- 删除这一单的盘点单明细表数据</span></span>
<span class="line"><span> DELETE FROM inventory.invcounthead WHERE listnumber = mylistnumber; -- 删除这一单的盘点单头表数据</span></span>
<span class="line"><span>COMMIT;</span></span>
<span class="line"><span>END</span></span></code></pre></div><p>具体的操作我都标注在代码里面了，你可以看一下。</p><h3 id="如何创建触发器" tabindex="-1">如何创建触发器？ <a class="header-anchor" href="#如何创建触发器" aria-label="Permalink to &quot;如何创建触发器？&quot;">​</a></h3><p>创建完了存储过程，我们已经完成了一大半，但是别急，还有一步工作没有做，就是创建触发器。</p><p>由于我们根据分库分表的策略，把商品信息表拆分成了商品常用信息表和商品不常用信息表，这样就很容易产生数据不一致的情况。为了确保商品常用信息表和商品不常用信息表中的数据保持一致，我们可以创建触发器，保证这2个表中删除其中一个表的一条记录的操作，自动触发删除另外一个表中对应的记录的操作。这样一来，就防止了一个表中的记录在另外一个表中不存在的情况，也就确保了数据的一致性。</p><p>创建触发器的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DELIMITER //</span></span>
<span class="line"><span>CREATE TRIGGER operation.del_goodso BEFORE DELETE  -- 在删除前触发</span></span>
<span class="line"><span>ON operation.goods_o</span></span>
<span class="line"><span>FOR EACH ROW                              -- 表示每删除一条记录，触发一次</span></span>
<span class="line"><span>BEGIN                                     -- 开始程序体</span></span>
<span class="line"><span> DELETE FROM operation.goods_f</span></span>
<span class="line"><span>    WHERE groupnumber=OLD.groupnumber</span></span>
<span class="line"><span>    AND itemnumber=OLD.itemnumber;</span></span>
<span class="line"><span>END</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>DELIMITER ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DELIMITER //</span></span>
<span class="line"><span>CREATE TRIGGER operation.del_goodsf BEFORE DELETE  -- 在删除前触发</span></span>
<span class="line"><span>ON operation.goods_f</span></span>
<span class="line"><span>FOR EACH ROW                              -- 表示每删除一条记录，触发一次</span></span>
<span class="line"><span>BEGIN                                     -- 开始程序体</span></span>
<span class="line"><span> DELETE FROM operation.goods_o</span></span>
<span class="line"><span>    WHERE groupnumber=OLD.groupnumber</span></span>
<span class="line"><span>    AND itemnumber=OLD.itemnumber;</span></span>
<span class="line"><span>END</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>DELIMITER ;</span></span></code></pre></div><p>到这儿呢，数据库数据表以及相关的索引、存储过程和触发器就都创建完了。可以说，我们已经完成了数据库的设计。</p><p>但是，在实际工作中，如果你只进行到这一步就打住了，那就还不能算是一个优秀的开发者。因为你考虑问题还不够全面。一个合格的系统设计者，不但要准确把握客户的需求，预见项目实施的前景，还要准备好对任何可能意外的应对方案。实际做项目时，不是纸上谈兵，什么情况都可能发生，我们需要未雨绸缪。所以，下面我们就来设计下项目的容灾和备份策略。</p><h2 id="如何制定容灾和备份策略" tabindex="-1">如何制定容灾和备份策略？ <a class="header-anchor" href="#如何制定容灾和备份策略" aria-label="Permalink to &quot;如何制定容灾和备份策略？&quot;">​</a></h2><p>为了防止灾害出现，我设置了主从架构。为了方便你理解，我采用的是一主一从的架构，你也可以搭建一主多从的架构，原理都是一样的。</p><p>主从架构的核心是，从服务器实时自动同步主服务器的数据，一旦主服务器宕机，可以切换到从服务器继续使用。这样就可以把灾害损失降到最低。</p><p>下面我就和你一起，搭建一下主从服务器。</p><h3 id="如何搭建主从服务器" tabindex="-1">如何搭建主从服务器？ <a class="header-anchor" href="#如何搭建主从服务器" aria-label="Permalink to &quot;如何搭建主从服务器？&quot;">​</a></h3><p>第一步，确保从服务器可以访问主服务器（在同一网段），例如，可以把主服务器的IP地址设置为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>主服务器IP：192.168.1.100</span></span></code></pre></div><p>需要注意的是，主服务器入口方向的3306号端口需要打开，否则从服务器无法访问主服务器的MySQL服务器。</p><p>同时，我们把从服务器的IP地址设置为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>从服务器IP： 192.168.1.110</span></span></code></pre></div><p>第二步，修改主从服务器的系统配置文件my.ini，使主从服务器有不同的ID编号，并且指定需要同步的数据库。</p><p>在主服务器的配置文件中，我们把主服务器的编号修改为：server-id = 1。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ***** Group Replication Related *****</span></span>
<span class="line"><span># Specifies the base name to use for binary log files. With binary logging</span></span>
<span class="line"><span># enabled, the server logs all statements that change data to the binary</span></span>
<span class="line"><span># log, which is used for backup and replication.</span></span>
<span class="line"><span>log-bin=mysql-bin          -- 二进制日志名称</span></span>
<span class="line"><span>binlog-do-db = operation   -- 需要同步的数据库：营运数据库</span></span>
<span class="line"><span>binlog-do-db = inventory   -- 需要同步的数据库：库存数据库</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ***** Group Replication Related *****</span></span>
<span class="line"><span># Specifies the server ID. For servers that are used in a replication topology,</span></span>
<span class="line"><span># you must specify a unique server ID for each replication server, in the</span></span>
<span class="line"><span># range from 1 to 2^32 − 1. “Unique” means that each ID must be different</span></span>
<span class="line"><span># from every other ID in use by any other source or replica.</span></span>
<span class="line"><span>server-id=1          -- 主服务器的ID设为1</span></span></code></pre></div><p>然后，我们来修改从服务器的配置文件my.ini，把从服务器的编号设置为server-id = 2。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ***** Group Replication Related *****</span></span>
<span class="line"><span># Specifies the base name to use for binary log files. With binary logging</span></span>
<span class="line"><span># enabled, the server logs all statements that change data to the binary</span></span>
<span class="line"><span># log, which is used for backup and replication.</span></span>
<span class="line"><span>log-bin=mysql-bin              -- 二进制日志名称</span></span>
<span class="line"><span>replicate_do_db = operation    -- 需要同步过来的数据库：营运数据库</span></span>
<span class="line"><span>replicate_do_db = inventory    -- 需要同步过来的数据库：库存数据库</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ***** Group Replication Related *****</span></span>
<span class="line"><span># Specifies the server ID. For servers that are used in a replication topology,</span></span>
<span class="line"><span># you must specify a unique server ID for each replication server, in the</span></span>
<span class="line"><span># range from 1 to 2^32 − 1. “Unique” means that each ID must be different</span></span>
<span class="line"><span># from every other ID in use by any other source or replica.</span></span>
<span class="line"><span>server-id=2                       -- 从服务器的编号为2</span></span></code></pre></div><p>第三步，在主从服务器上都保存配置文件，然后分别重启主从服务器上的MySQL服务器。</p><p>第四步，为了使从服务器可以访问主服务器，在主服务器上创建数据同步用户，并赋予所有权限。这样，从服务器就可以实时读取主服务器的数据了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; CREATE USER &#39;myreplica&#39;&amp;#64;&#39;%&#39; IDENTIFIED BY &#39;mysql&#39;;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.02 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&amp;gt; GRANT ALL ON *.* TO &#39;myreplica&#39;&amp;#64;&#39;%&#39;;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.99 sec)</span></span></code></pre></div><p>第五步，在从服务器上启动数据同步，开始从主服务器中同步数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt;change master to master_host=&#39;192.168.1.100&#39;,master_port=3306,master_user=&#39;myreplica&#39;,master_password=&#39;mysql’,master_log_file=&#39;mysql-bin.000001&#39;,master_log_pos=535;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.02 sec)</span></span></code></pre></div><p>启动同步的时候，你需要注意的是，必须指明主服务器上二进制日志中的位置master_log_pos。也就是说，你准备从主服务器的二进制日志的哪个位置开始同步数据。你可以通过在主服务器上，用SQL语句“SHOW BINLOG EVENTS IN 二进制日志名” 获取这个值。下面的代码可以启动同步：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt;start slave;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.02 sec)</span></span></code></pre></div><h3 id="如何制定数据备份策略" tabindex="-1">如何制定数据备份策略？ <a class="header-anchor" href="#如何制定数据备份策略" aria-label="Permalink to &quot;如何制定数据备份策略？&quot;">​</a></h3><p>设置了主从服务器，也不是万无一失。</p><p>我曾经就遇到过这样一件事：我们把主从服务器搭在了某大厂几台不同的云服务器上，自以为没问题了，没想到大厂也有失手的时候，居然整个地区全部宕机，导致我们的主从服务器同时无法使用，近千家商户无法开展业务，损失惨重。</p><p>所以，无论系统的架构多么可靠，我们也不能大意。备份仍然是必不可少的步骤。我们可以在应用层面调用类似下面的命令进行备份：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>H:\\&amp;gt;mysqldump -u root -p --databases</span></span>
<span class="line"><span>inventory operation &amp;gt; H:\\backup\\Monday\\mybackup.sql</span></span></code></pre></div><p>我在项目中设定的策略是，每天晚上12:00做一个自动备份，循环备份7天，创建7个文件夹，从Monday到Sunday，每个文件夹中保存对应的备份文件，新的覆盖旧的。</p><p>这个逻辑也很简单，你很容易理解，我就不多解释了，你不要忘了做这一步工作就可以了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天这节课，我给你详细讲解了建库建表、创建索引、存储过程、触发器，以及容灾和备份策略。有几点你需要格外重视一下。</p><p>索引是提升查询执行速度的关键，创建的原则是：所有的数据表都要创建索引；有可能作为筛选条件的字段，都要用来创建索引。</p><p>另外，容灾和备份是数据库系统设计中必不可少的部分。因为在现实生活中，什么情况都可能发生，我们无法预见，但是可以尽量避免。在设计阶段的未雨绸缪，可以帮助我们减少很多损失。</p><p>最后我要提醒你的是，MySQL的相关知识实践性非常强，决不能停留在纸面上。我在课中演示的的代码，都是在实际环境中运行过的，你课下一定要跟着实际操作一下。毕竟，学习知识最好的办法，就是在解决实际问题中学习。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在今天的课程中，我演示了搭建主从服务器的过程。其中，在第四步，我专门创建了一个用来同步数据的账号“myreplica”。我想请你思考一下，我为什么要这样做？直接用“root”账号不行吗？</p><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得今天的内容对你有所帮助，也欢迎你把它分享给你的朋友或同事，我们下节课见。</p>`,153)])])}const h=a(i,[["render",l]]);export{g as __pageData,h as default};
