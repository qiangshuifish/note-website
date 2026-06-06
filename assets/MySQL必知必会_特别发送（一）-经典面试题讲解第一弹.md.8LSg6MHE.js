import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"特别发送（一） | 经典面试题讲解第一弹","description":"","frontmatter":{},"headers":[{"level":2,"title":"第一题","slug":"第一题","link":"#第一题","children":[]},{"level":2,"title":"第二题","slug":"第二题","link":"#第二题","children":[]},{"level":2,"title":"第三题","slug":"第三题","link":"#第三题","children":[]},{"level":2,"title":"第四题","slug":"第四题","link":"#第四题","children":[]},{"level":2,"title":"第五题","slug":"第五题","link":"#第五题","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"MySQL必知必会/特别发送（一）-经典面试题讲解第一弹.md","filePath":"MySQL必知必会/特别发送（一）-经典面试题讲解第一弹.md","lastUpdated":1779816051000}'),t={name:"MySQL必知必会/特别发送（一）-经典面试题讲解第一弹.md"};function i(l,s,c,o,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="特别发送-一-经典面试题讲解第一弹" tabindex="-1">特别发送（一） | 经典面试题讲解第一弹 <a class="header-anchor" href="#特别发送-一-经典面试题讲解第一弹" aria-label="Permalink to &quot;特别发送（一） | 经典面试题讲解第一弹&quot;">​</a></h1><p>你好，我是朱晓峰。</p><p>到这里，“实践篇”的内容咱们就学完了。今天，我们来学点儿不一样的——5道经典面试题。这些都是在实际面试中的原题，当然，我没有完全照搬，而是结合咱们课程的具体情况，有针对性地进行了调整。我不仅会给你提供答案，还会和你一起分析，让你能够灵活地吃透这些题目，并能举一反三。</p><p>话不多说，我们现在开始。我先带你从一道简单的关于“索引”的面试题入手，索引在面试题里经常出现，来看看这一道你能不能做对。</p><h2 id="第一题" tabindex="-1">第一题 <a class="header-anchor" href="#第一题" aria-label="Permalink to &quot;第一题&quot;">​</a></h2><p>下面关于索引的描述，正确的是：</p><ol><li>建立索引的主要目的是减少冗余数据，使数据表占用更少的空间，并且提高查询的速度</li><li>一个表上可以建立一个或者多个索引</li><li>组合索引可以有效提高查询的速度，比单字段索引更高效，所以，我们应该创建一个由所有的字段组成的组合索引，这样就可以解决所有问题了</li><li>因为索引可以提高查询效率，所以索引建得越多越好</li></ol><p>解析：这道题的正确答案是选项2，我们来分析一下其他选项。</p><ul><li>选项1说对了一半，索引可以提高查询效率，但是创建索引不能减少冗余数据，而且索引还要占用额外的存储空间，所以选项1不对。</li><li>选项3不对的原因有2个。第一，组合索引不一定比单字段索引高效，因为组合索引的字段是有序的，遵循左对齐的原则。如果查询的筛选条件不包含组合索引中最左边的字段，那么组合索引就完全不能用。第二，创建索引也是有成本的，需要占用额外的存储空间。用所有的字段创建组合索引的存储成本比较高，而且利用率比较低，完全用上的可能性几乎不存在，所以很少有人会这样做。而且一旦更改任何一个字段的数据，就必须要改索引，这样操作成本也比较高。</li><li>选项4错误，因为索引有成本，很少作为筛选条件的字段，没有必要创建索引。</li></ul><p>如果这道题你回答错了，一定要回去复习下 <a href="https://time.geekbang.org/column/article/357312" target="_blank" rel="noreferrer">第11讲</a> 的内容。</p><h2 id="第二题" tabindex="-1">第二题 <a class="header-anchor" href="#第二题" aria-label="Permalink to &quot;第二题&quot;">​</a></h2><p>假设我们有这样一份学生成绩单，所有同学的成绩都各不相同，请编写一个简单的SQL语句，查询分数排在第三名的同学的成绩：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/3618ee4c82a592bb7954c4d63d9c1dd1.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/3618ee4c82a592bb7954c4d63d9c1dd1.jpeg" alt=""></a></p><p>解析：这道题考查的是我们对查询语句的掌握情况。针对题目中的场景，可以分两步来进行查询。</p><p>第一步，按照成绩高低进行排序：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.test1</span></span>
<span class="line"><span>-&amp;gt; ORDER BY score DESC; -- DESC表示降序排列</span></span>
<span class="line"><span>+----+------+-------+</span></span>
<span class="line"><span>| id | name | score |</span></span>
<span class="line"><span>+----+------+-------+</span></span>
<span class="line"><span>| 2 | 李四 | 90.00 |</span></span>
<span class="line"><span>| 4 | 赵六 | 88.00 |</span></span>
<span class="line"><span>| 1 | 张三 | 80.00 |</span></span>
<span class="line"><span>| 3 | 王五 | 76.00 |</span></span>
<span class="line"><span>| 5 | 孙七 | 67.00 |</span></span>
<span class="line"><span>+----+------+-------+</span></span>
<span class="line"><span>5 rows in set (0.00 sec)</span></span></code></pre></div><p>第二步，找出排名第三的同学和对应的成绩。我们可以用 <a href="https://time.geekbang.org/column/article/351225" target="_blank" rel="noreferrer">第4讲</a> 里学过的对返回记录进行限定的关键字LIMIT：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.test1</span></span>
<span class="line"><span>-&amp;gt; ORDER BY score DESC</span></span>
<span class="line"><span>-&amp;gt; LIMIT 2,1;</span></span>
<span class="line"><span>+----+------+-------+</span></span>
<span class="line"><span>| id | name | score |</span></span>
<span class="line"><span>+----+------+-------+</span></span>
<span class="line"><span>| 1 | 张三 | 80.00 |</span></span>
<span class="line"><span>+----+------+-------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>在MySQL中，LIMIT后面可以跟2个参数，第一个参数表示记录的起始位置（第一个记录的位置是0），第二个参数表示返回几条记录。因此，“LIMIT 2,1”就表示从第3条记录开始，返回1条记录。这样，就可以查出排名第三的同学的成绩了。</p><h2 id="第三题" tabindex="-1">第三题 <a class="header-anchor" href="#第三题" aria-label="Permalink to &quot;第三题&quot;">​</a></h2><p>现在我们有两个表，分别是人员表（demo.person）和地址表（demo.address），要求你使用关联查询查出完整信息。无论有没有地址信息，人员的信息必须全部包含在结果集中。</p><p>人员表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/b6ed67787cebbdb0786a42c47326a390.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/b6ed67787cebbdb0786a42c47326a390.jpeg" alt=""></a></p><p>地址表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/5758763942c2a0dc59125bd73f3134ea.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/5758763942c2a0dc59125bd73f3134ea.jpeg" alt=""></a></p><p>解析： 这个是典型的外查询，咱们在 <a href="https://time.geekbang.org/column/article/353464" target="_blank" rel="noreferrer">第6讲</a> 里学过。题目要求我们查出人员表中的全部信息，而地址表中信息则可以为空，就可以用下面的查询代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT *</span></span>
<span class="line"><span>-&amp;gt; FROM demo.person AS a</span></span>
<span class="line"><span>-&amp;gt; LEFT JOIN demo.address AS b -- 左连接，确保demo.person中的记录全部包括在结果集中</span></span>
<span class="line"><span>-&amp;gt; ON (a.id=b.id);</span></span>
<span class="line"><span>+----+-------+-------+------+---------+------+-----------+</span></span>
<span class="line"><span>| id | fname | lname | id | country | city | address |</span></span>
<span class="line"><span>+----+-------+-------+------+---------+------+-----------+</span></span>
<span class="line"><span>| 1 | 张 | 三 | 1 | 中国 | 北京 | 海淀123 |</span></span>
<span class="line"><span>| 2 | 李 | 四 | 2 | 美国 | 纽约 | 奥巴尼333 |</span></span>
<span class="line"><span>| 3 | 王 | 五 | NULL | NULL | NULL | NULL |</span></span>
<span class="line"><span>+----+-------+-------+------+---------+------+-----------+</span></span>
<span class="line"><span>3 rows in set (0.02 sec)</span></span></code></pre></div><h2 id="第四题" tabindex="-1">第四题 <a class="header-anchor" href="#第四题" aria-label="Permalink to &quot;第四题&quot;">​</a></h2><p>假设有这样一个教学表（demo.teach)，里面包含了人员编号（id）、姓名（fname）和对应的老师的人员编号（teacherid）。如果一个人是学生，那么他一定有对应的老师编号，通过这个编号，就可以找到老师的信息；如果一个人是老师，那么他对应的老师编号就是空。比如说，下表中李四的老师编号是101，我们就可以通过搜索人员编号，找到101的名称是张三，那么李四的老师就是张三；而张三自己就是老师，所以他对应的老师编号是空。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/8d9de75354c0af5bc99e01767b87a57c.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/8d9de75354c0af5bc99e01767b87a57c.jpeg" alt=""></a></p><p>要求：请写一个SQL语句，查询出至少有2名学生的老师姓名。</p><p>说明一下，在刚刚的数据表中，张三有3名学生，分别是李四、王五和周八。赵六有一名学生，是孙七。因此，正确的SQL语句的查询结果应该是：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/e515868404495d2cea1c271b0d0ec440.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/e515868404495d2cea1c271b0d0ec440.jpeg" alt=""></a></p><p>解析：</p><p>针对这道题，我们可以按照这样的思路去做：</p><ol><li>通过统计学生对应的老师编号，就可以获取至少有2个学生的老师的编号。</li><li>通过关联查询和自连接获取需要的信息。所谓的自连接，就是数据表与自身进行连接。你可以认为是把数据表复制成一模一样的2个表，通过给数据表起不同的名字来区分它们，这样方便对表进行操作，然后就可以对这2个表进行连接操作了。</li><li>通过使用条件语句WHERE和HAVING对数据进行筛选：先用WHERE筛选出所有的老师编号，再用HAVING筛选出有2个以上学生的老师编号。</li></ol><p>首先，我们来获取老师编号，如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT teacherid</span></span>
<span class="line"><span>    -&amp;gt; FROM demo.teach</span></span>
<span class="line"><span>    -&amp;gt; WHERE teacherid is not NULL     -- 用WHERE筛选出所有的老师编号</span></span>
<span class="line"><span>    -&amp;gt; GROUP BY teacherid</span></span>
<span class="line"><span>    -&amp;gt; HAVING COUNT(*)&amp;gt;=2;             -- 用HAVING筛选出有2个以上学生的老师编号</span></span>
<span class="line"><span>+-----------+</span></span>
<span class="line"><span>| teacherid |</span></span>
<span class="line"><span>+-----------+</span></span>
<span class="line"><span>|       101 |</span></span>
<span class="line"><span>+-----------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>接着，通过自连接，来获取老师的姓名：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT a.id,a.fname</span></span>
<span class="line"><span>    -&amp;gt; FROM demo.teach AS a</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; (</span></span>
<span class="line"><span>    -&amp;gt;  SELECT teacherid</span></span>
<span class="line"><span>    -&amp;gt;  FROM demo.teach</span></span>
<span class="line"><span>    -&amp;gt;  WHERE teacherid IS NOT NULL</span></span>
<span class="line"><span>    -&amp;gt;  GROUP BY teacherid</span></span>
<span class="line"><span>    -&amp;gt;  HAVING COUNT(*)&amp;gt;=2</span></span>
<span class="line"><span>    -&amp;gt; ) AS b</span></span>
<span class="line"><span>    -&amp;gt; ON (a.id = b.teacherid);</span></span>
<span class="line"><span>+-----+-------+</span></span>
<span class="line"><span>| id  | fname |</span></span>
<span class="line"><span>+-----+-------+</span></span>
<span class="line"><span>| 101 | 张三  |</span></span>
<span class="line"><span>+-----+-------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><h2 id="第五题" tabindex="-1">第五题 <a class="header-anchor" href="#第五题" aria-label="Permalink to &quot;第五题&quot;">​</a></h2><p>假设某中学高三年级有多位同学，分成多个班，我们有统一记录学生成绩的表（demo.student)和班级信息表（demo.class），具体信息如下所示：</p><p>学生成绩表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/9ae0eyy03386f24d568b8507d2dd6f20.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/9ae0eyy03386f24d568b8507d2dd6f20.jpeg" alt=""></a></p><p>班级信息表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/6c4d85c4dff2c626d55fbaf9671bccb9.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/6c4d85c4dff2c626d55fbaf9671bccb9.jpeg" alt=""></a></p><p>要求：写一个SQL查询语句，查出每个班级前三名的同学。</p><p>说明一下，针对上面的数据，正确的SQL查询应该得出下面的结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/5c6fc34826c367f5a0cdf38610b26ecd.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/358668/5c6fc34826c367f5a0cdf38610b26ecd.jpeg" alt=""></a></p><p>解析：</p><ol><li>从题目给出的查询结果看，不需要考虑并列的情况。那么，现在要选出分数排名前三的同学，其实只要找出3个最好的分数以及对应的同学就可以了。</li><li>这道题需要用到我们讲过的关联查询和子查询的知识。</li><li>WHERE语句的筛选条件表达式中，也可以包括一个子查询的结果。</li></ol><p>第一步，我们假设有一个分数X，就是那个第N好的分数，算一下有多少个同学的成绩优于这个分数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT COUNT(DISTINCT b.points)</span></span>
<span class="line"><span>FROM demo.student AS b</span></span>
<span class="line"><span>WHERE b.points &amp;gt; X;</span></span></code></pre></div><p>这个查询的结果小于3的话，就代表这个分数X是排名第三的分数了。</p><p>第二步，查询出哪些同学满足成绩排名前三的这个档次：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT a.stdname,a.points</span></span>
<span class="line"><span>    -&amp;gt; FROM demo.student AS a</span></span>
<span class="line"><span>    -&amp;gt; WHERE 3 &amp;gt;                       -- 比这个成绩好的不超过3，说明这是第三好的成绩</span></span>
<span class="line"><span>    -&amp;gt; (</span></span>
<span class="line"><span>    -&amp;gt;   SELECT COUNT(DISTINCT b.points)   -- 统计一下有几个成绩</span></span>
<span class="line"><span>    -&amp;gt;   FROM demo.student AS b</span></span>
<span class="line"><span>    -&amp;gt;   WHERE b.points &amp;gt; a.points         -- 比这个成绩好</span></span>
<span class="line"><span>    -&amp;gt; );</span></span>
<span class="line"><span>+---------+--------+</span></span>
<span class="line"><span>| stdname | points |</span></span>
<span class="line"><span>+---------+--------+</span></span>
<span class="line"><span>| 张三    |     85 |</span></span>
<span class="line"><span>| 李四    |     80 |</span></span>
<span class="line"><span>| 赵六    |     90 |</span></span>
<span class="line"><span>| 周八    |     85 |</span></span>
<span class="line"><span>+---------+--------+</span></span>
<span class="line"><span>4 rows in set (0.00 sec)</span></span></code></pre></div><p>第三步，与班级表关联，按班级统计前三名同学的成绩，并且获取班级信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT c.classname,a.stdname,a.points</span></span>
<span class="line"><span>    -&amp;gt; FROM demo.student AS a</span></span>
<span class="line"><span>    -&amp;gt; JOIN demo.class AS c</span></span>
<span class="line"><span>    -&amp;gt; ON (a.classid = c.id)          -- 关联班级信息</span></span>
<span class="line"><span>    -&amp;gt; WHERE 3 &amp;gt;</span></span>
<span class="line"><span>    -&amp;gt; (</span></span>
<span class="line"><span>    -&amp;gt;   SELECT COUNT(DISTINCT b.points)</span></span>
<span class="line"><span>    -&amp;gt;   FROM demo.student AS b</span></span>
<span class="line"><span>    -&amp;gt;   WHERE b.points &amp;gt; a.points</span></span>
<span class="line"><span>    -&amp;gt;   AND b.classid = a.classid   -- 按班级分别查询</span></span>
<span class="line"><span>    -&amp;gt; )</span></span>
<span class="line"><span>    -&amp;gt; ORDER BY c.classname,a.points DESC;</span></span>
<span class="line"><span>+-----------+---------+--------+</span></span>
<span class="line"><span>| classname | stdname | points |</span></span>
<span class="line"><span>+-----------+---------+--------+</span></span>
<span class="line"><span>| 创新班    | 赵六    |     90 |</span></span>
<span class="line"><span>| 创新班    | 张三    |     85 |</span></span>
<span class="line"><span>| 创新班    | 周八    |     85 |</span></span>
<span class="line"><span>| 创新班    | 郑九    |     70 |</span></span>
<span class="line"><span>| 普通班    | 李四    |     80 |</span></span>
<span class="line"><span>| 普通班    | 王五    |     65 |</span></span>
<span class="line"><span>+-----------+---------+--------+</span></span>
<span class="line"><span>6 rows in set (0.00 sec)</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们借助几个面试题，回顾了索引的概念、查询、子查询和关联查询的知识，以及条件语句WHERE和HAVING的不同使用方法。如果你发现哪些内容掌握得还没有那么牢固，一定要及时回去复习一下。</p><p>在真正的面试中，很少有单纯考查知识点本身的题目，更多的是考查你在解决实际问题的过程中，对知识的灵活运用能力。所以，在学习每一节课时，你一定要结合我给出的实际项目，去真正实践一下，这样才能以不变应万变，在面试中有好的表现。</p>`,61)])])}const m=a(t,[["render",i]]);export{h as __pageData,m as default};
