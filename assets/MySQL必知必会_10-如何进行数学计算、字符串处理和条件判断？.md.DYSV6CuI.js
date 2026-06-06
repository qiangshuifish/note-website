import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"10 | 如何进行数学计算、字符串处理和条件判断？","description":"","frontmatter":{},"headers":[{"level":2,"title":"数学函数","slug":"数学函数","link":"#数学函数","children":[]},{"level":2,"title":"字符串函数","slug":"字符串函数","link":"#字符串函数","children":[]},{"level":2,"title":"条件判断函数","slug":"条件判断函数","link":"#条件判断函数","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"MySQL必知必会/10-如何进行数学计算、字符串处理和条件判断？.md","filePath":"MySQL必知必会/10-如何进行数学计算、字符串处理和条件判断？.md","lastUpdated":1779816051000}'),i={name:"MySQL必知必会/10-如何进行数学计算、字符串处理和条件判断？.md"};function l(t,s,c,o,m,g){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_10-如何进行数学计算、字符串处理和条件判断" tabindex="-1">10 | 如何进行数学计算、字符串处理和条件判断？ <a class="header-anchor" href="#_10-如何进行数学计算、字符串处理和条件判断" aria-label="Permalink to &quot;10 | 如何进行数学计算、字符串处理和条件判断？&quot;">​</a></h1><p>你好，我是朱晓峰。</p><p>MySQL提供了很多功能强大，而且使用起来非常方便的函数，包括数学函数、字符串处理函数和条件判断函数等。</p><p>在很多场景中 ，我们都会用到这些函数，比如说，在超市项目的实际开发过程中，会有这样的需求：</p><ul><li>会员积分的规则是一元积一分，不满一元不积分，这就要用到向下取整的数学函数FLOOR()；</li><li>在打印小票的时候，收银纸的宽度是固定的，怎么才能让打印的结果清晰而整齐呢？这个时候，就要用到CONCAT()等字符串处理函数；</li><li>不同数据的处理方式不同，怎么选择正确的处理方式呢？这就会用到IF(表达式，V1，V2)这样的条件判断函数；</li><li>……</li></ul><p>这些函数对我们管理数据库、提高数据处理的效率有很大的帮助。接下来，我就带你在解决实际问题的过程中，帮你掌握使用这些函数的方法。</p><h2 id="数学函数" tabindex="-1">数学函数 <a class="header-anchor" href="#数学函数" aria-label="Permalink to &quot;数学函数&quot;">​</a></h2><p>我们先来学习下数学函数，它主要用来处理数值数据，常用的主要有3类，分别是取整函数ROUND()、CEIL()、FLOOR()，绝对值函数ABS()和求余函数MOD()。</p><p>知道了这些函数，我们来看看超市经营者的具体需求。他们提出，为了提升销量，要进行会员营销，主要是给会员积分，并以积分数量为基础，给会员一定的优惠。</p><p>积分的规则也很简单，就是消费一元积一分，不满一元不积分，那我们就需要对销售金额的数值进行取整。</p><p>这里主要用到四个表，分别是销售单明细表、销售单头表、商品信息表和会员信息表。为了方便你理解，我对表结构和数据进行了简化。</p><p>销售单明细表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/543b4ce8c0c8b1f3bb7028c911213f93.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/543b4ce8c0c8b1f3bb7028c911213f93.jpeg" alt=""></a></p><p>销售单头表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/a4df12d3469aaf2f770fbfa8fb842c33.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/a4df12d3469aaf2f770fbfa8fb842c33.jpeg" alt=""></a></p><p>商品信息表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/262121b96d4ce48e310cdff37d536203.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/262121b96d4ce48e310cdff37d536203.jpeg" alt=""></a></p><p>会员信息表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/105d12853e4b09aefd96f2423613648e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/105d12853e4b09aefd96f2423613648e.jpeg" alt=""></a></p><p>这个场景下，可以用到MySQL数学函数中的取整函数，主要有3种。</p><ul><li>向上取整CEIL(X)和CEILING(X)：返回大于等于X的最小INT型整数。</li><li>向下取整FLOOR(X)：返回小于等于X的最大INT型整数。</li><li>舍入函数ROUND(X,D)：X表示要处理的数，D表示保留的小数位数，处理的方式是四舍五入。ROUND(X)表示保留0位小数。</li></ul><p>现在积分的规则是一元积一分，不满一元不积分，显然是向下取整，那就可以用FLOOR（）函数。</p><p>首先，我们要通过关联查询，获得会员消费的相关信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt;  SELECT</span></span>
<span class="line"><span>    -&amp;gt; c.membername AS &#39;会员&#39;,   -- 从会员表获取会员名称</span></span>
<span class="line"><span>    -&amp;gt; b.transactionno AS &#39;单号&#39;,-- 从销售单头表获取单号</span></span>
<span class="line"><span>    -&amp;gt; b.transdate AS &#39;交易时间&#39;, -- 从销售单头表获取交易时间</span></span>
<span class="line"><span>    -&amp;gt; d.goodsname AS &#39;商品名称&#39;, -- 从商品信息表获取商品名称</span></span>
<span class="line"><span>    -&amp;gt; a.salesvalue AS &#39;交易金额&#39;</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt; demo.transactiondetails a</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; demo.transactionhead b ON (a.transactionid = b.transactionid)</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; demo.membermaster c ON (b.memberid = c.memberid)</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; demo.goodsmaster d ON (a.itemnumber = d.itemnumber);</span></span>
<span class="line"><span>+------+------------------+---------------------+----------+----------+</span></span>
<span class="line"><span>| 会员 | 单号             | 交易时间            | 商品名称 | 交易金额 |</span></span>
<span class="line"><span>+------+------------------+---------------------+----------+----------+</span></span>
<span class="line"><span>| 张三 | 0120201201000001 | 2020-12-01 14:25:56 | 书       |   176.22 |</span></span>
<span class="line"><span>| 张三 | 0120201201000001 | 2020-12-01 14:25:56 | 笔       |    24.75 |</span></span>
<span class="line"><span>| 李四 | 0120201202000001 | 2020-12-02 10:50:50 | 书       |   234.96 |</span></span>
<span class="line"><span>| 李四 | 0120201202000001 | 2020-12-02 10:50:50 | 笔       |    26.40 |</span></span>
<span class="line"><span>+------+------------------+---------------------+----------+----------+</span></span>
<span class="line"><span>4 rows in set (0.01 sec)</span></span></code></pre></div><p>接着，我们用FLOOR（a.salesvalue），对销售金额向下取整，获取会员积分值，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt; c.membername AS &#39;会员&#39;,</span></span>
<span class="line"><span>    -&amp;gt; b.transactionno AS &#39;单号&#39;,</span></span>
<span class="line"><span>    -&amp;gt; b.transdate AS &#39;交易时间&#39;,</span></span>
<span class="line"><span>    -&amp;gt; d.goodsname AS &#39;商品名称&#39;,</span></span>
<span class="line"><span>    -&amp;gt; a.salesvalue AS &#39;交易金额&#39;,</span></span>
<span class="line"><span>    -&amp;gt; FLOOR(a.salesvalue) AS &#39;积分&#39;  -- 使用FLOOR函数向下取整</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt; demo.transactiondetails a</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; demo.transactionhead b ON (a.transactionid = b.transactionid)</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; demo.membermaster c ON (b.memberid = c.memberid)</span></span>
<span class="line"><span>    -&amp;gt; JOIN</span></span>
<span class="line"><span>    -&amp;gt; demo.goodsmaster d ON (a.itemnumber = d.itemnumber);</span></span>
<span class="line"><span>+------+------------------+---------------------+----------+----------+------+</span></span>
<span class="line"><span>| 会员 | 单号             | 交易时间            | 商品名称 | 交易金额 | 积分 |</span></span>
<span class="line"><span>+------+------------------+---------------------+----------+----------+------+</span></span>
<span class="line"><span>| 张三 | 0120201201000001 | 2020-12-01 14:25:56 | 书       |   176.22 |  176 |</span></span>
<span class="line"><span>| 张三 | 0120201201000001 | 2020-12-01 14:25:56 | 笔       |    24.75 |   24 |</span></span>
<span class="line"><span>| 李四 | 0120201202000001 | 2020-12-02 10:50:50 | 书       |   234.96 |  234 |</span></span>
<span class="line"><span>| 李四 | 0120201202000001 | 2020-12-02 10:50:50 | 笔       |    26.40 |   26 |</span></span>
<span class="line"><span>+------+------------------+---------------------+----------+----------+------+</span></span>
<span class="line"><span>4 rows in set (0.01 sec)</span></span></code></pre></div><p>你看，通过FLOOR()，我们轻松地获得了超市经营者需要的积分数据。</p><p>类似的，如果用户的积分规则改为“不满一元积一分”，其实就是对金额数值向上取整，这个时候，我们就可以用CEIL()函数。操作方法和前面是一样的，我就不具体解释了。</p><p>最后，我再来讲一讲舍入函数ROUND（）的使用方法。</p><p>超市经营者提出，收银的时候，应收金额可以被设定四舍五入到哪一位。比如，可以设定四舍五入到元、到角，或者到分。</p><p>按照指定的位数，对小数进行四舍五入计算，这样的场景就要用到ROUND（X,D）了。它的作用是通过四舍五入，对数值X保留D位小数。</p><p>根据超市经营者的要求，我们把函数ROUND(X,D)中的保留小数的位数D设置成0、1和2。</p><p>如果要精确到分，我们可以设置保留2位小数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT ROUND(salesvalue,2) -- D设置成2，表示保留2位小数，也就是精确到分</span></span>
<span class="line"><span>-&amp;gt; FROM demo.transactiondetails</span></span>
<span class="line"><span>-&amp;gt; WHERE transactionid=1 AND itemnumber=1;</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| ROUND(salesvalue,2) |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 176.22 |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>1rows in set (0.00 sec)</span></span></code></pre></div><p>如果要精确到角，可以设置保留1位小数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT ROUND(salesvalue,1) -- D设置成1，表示保留1位小数，也就是精确到角</span></span>
<span class="line"><span>-&amp;gt; FROM demo.transactiondetails</span></span>
<span class="line"><span>-&amp;gt; WHERE transactionid=1 AND itemnumber=1;</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| ROUND(salesvalue,1) |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 176.2 |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>1 rows in set (0.00 sec</span></span></code></pre></div><p>如果要精确到元，可以设置保留0位小数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT ROUND(salesvalue,0)-- D设置成0，表示保留0位小数，也就是精确到元</span></span>
<span class="line"><span>-&amp;gt; FROM demo.transactiondetails</span></span>
<span class="line"><span>-&amp;gt; WHERE transactionid=1 AND itemnumber=1;</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| ROUND(salesvalue,0) |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 176 |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>1 rows in set (0.00 se</span></span></code></pre></div><p>除了刚刚我们所学习的函数，MySQL还支持绝对值函数ABS（）和求余函数MOD（），ABS（X）表示获取X的绝对值；MOD（X，Y）表示获取X被Y除后的余数。</p><p>这些函数使用起来都比较简单，你重点掌握它们的含义就可以了，下面我再带你学习下字符串函数。</p><h2 id="字符串函数" tabindex="-1">字符串函数 <a class="header-anchor" href="#字符串函数" aria-label="Permalink to &quot;字符串函数&quot;">​</a></h2><p>除了数学计算，我们还经常会遇到需要对字符串进行处理的场景，比如我们想要在金额前面加一个“￥”的符号，就会用到字符串拼接函数；再比如，我们需要把一组数字以字符串的形式在网上传输，就要用到类型转换函数。</p><p>常用的字符串函数有4个。</p><ul><li>CONCAT（s1,s2,...）：表示把字符串s1、s2……拼接起来，组成一个字符串。</li><li>CAST（表达式 AS CHAR）：表示将表达式的值转换成字符串。</li><li>CHAR_LENGTH（字符串）：表示获取字符串的长度。</li><li>SPACE（n）：表示获取一个由n个空格组成的字符串。</li></ul><p>接下来我还是借助超市项目中的实际应用场景，来说明一下怎么使用这些字符串函数。</p><p>顾客交了钱，完成交易之后，系统必须要打出一张小票。打印小票时，对格式有很多要求。比如说，一张小票纸，57毫米宽，大概可以打32个字符，也就是16个汉字。用户要求一条流水打2行，第一行是商品信息，第二行要包括数量、价格、折扣和金额4种信息。那么，怎么才能清晰地在小票上打印出这些信息，并且打印得整齐漂亮呢？这就涉及对字符串的处理了。</p><p>首先，我们来看一下如何打印第一行的商品信息。商品信息包括：商品名称和商品规格，而且商品规格要包含在括号里面。这样就必须把商品名称和商品规格拼接起来，变成一个字符串。</p><p>这时，我们就可以用合并字符串函数CONCAT（），如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; CONCAT(goodsname, &#39;(&#39;, specification, &#39;)&#39;) AS 商品信息 -- 这里把商品名称、括号和规格拼接起来</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.goodsmaster</span></span>
<span class="line"><span>-&amp;gt; WHERE itemnumber = 1;</span></span>
<span class="line"><span>+----------+</span></span>
<span class="line"><span>| 商品信息 |</span></span>
<span class="line"><span>+----------+</span></span>
<span class="line"><span>| 书(16开) |</span></span>
<span class="line"><span>+----------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>这样，我们就得到了商品编号是1的商品，它的商品信息是：“书（16开）”。</p><p>第二步，我们来看一下如何打印第二行。第二行包括数量、价格、折扣和金额，一共是4种信息。</p><p>因为一行最多是32个字符，我们给数量分配7个字符，价格分配7个字符，折扣分配6个字符，金额分配9个字符，加上中间3个空格，正好是32个字符。</p><p>为啥这么分配呢？我简单解释下。</p><ul><li>数量7个字符，就是小数点前面给3位，小数点后面给3位，外加小数点1位，最大999.999，基本满足零售的需求了。</li><li>同样道理，价格给7位，意思是小数点前面4位，小数点后面2位，外加小数点，这样最大可以表示9999.99。</li><li>折扣6位，小数点后面2位，小数点前面2位，加上小数点和“%”，这样是够用的。</li><li>金额9位，最大可以显示到999999.99，也够用了。</li></ul><p>分配好了各部分信息的字符串大小，我再讲一下格式处理，因为数据的取值每次都会不同，如果直接打印，会参差不齐。这里我以数量为例，来具体说明一下。因为数量比较有代表性，而且比较简单，不像金额或者折扣率那样，有时还要根据用户的需求，加上“￥”或者“%”。</p><p>第一步，把数量转换成字符串。这里我们需要用到把数值转换成字符串的CAST（）函数，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; CAST(quantity AS CHAR) -- 把decimal类型转换成字符串</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.transactiondetails</span></span>
<span class="line"><span>-&amp;gt; WHERE</span></span>
<span class="line"><span>-&amp;gt; transactionid = 1 AND itemnumber =1;</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| CAST(price AS CHAR) |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 2.000 |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>1 rows in set (0.00 sec)</span></span></code></pre></div><p>第二步，计算字符串的长度，这里我们要用到CHAR_LENGTH（）函数。</p><p>需要注意的是，虽然每个汉字打印的时候占2个字符长度，但是这个函数获取的是汉字的个数。因此，如果字符串中有汉字，函数获取的字符串长度跟实际打印的长度是不一样的，需要用空格来补齐。</p><p>我们可以通过下面的查询，获取数量字段转换成字符串后的字符串长度：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; CHAR_LENGTH(CAST(quantity AS CHAR)) AS 长度</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.transactiondetails</span></span>
<span class="line"><span>-&amp;gt; WHERE</span></span>
<span class="line"><span>-&amp;gt; transactionid = 1 AND itemnumber =1;</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 长度 |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>| 5 |</span></span>
<span class="line"><span>+---------------------+</span></span>
<span class="line"><span>1 rows in set (0.00 sec)</span></span></code></pre></div><p>第三步，用空格补齐7位长度。这时，我们要用到SPACE（）函数。</p><p>因为我们采用左对齐的方式打印（左对齐表示字符串从左边开始，右边空余的位置用空格补齐），所以就需要先拼接字符串，再在字符串的后面补齐空格：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>-&amp;gt; CONCAT(CAST(quantity AS CHAR),</span></span>
<span class="line"><span>-&amp;gt; SPACE(7 - CHAR_LENGTH(CAST(quantity AS CHAR)))) AS 数量</span></span>
<span class="line"><span>-&amp;gt; FROM</span></span>
<span class="line"><span>-&amp;gt; demo.transactiondetails</span></span>
<span class="line"><span>-&amp;gt; WHERE</span></span>
<span class="line"><span>-&amp;gt; transactionid = 1 AND itemnumber = 1;</span></span>
<span class="line"><span>+----------+</span></span>
<span class="line"><span>| 数量 |</span></span>
<span class="line"><span>+----------+</span></span>
<span class="line"><span>| 2.000 |</span></span>
<span class="line"><span>+----------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>除此以外，MySQL还支持SUBSTR（）、MID（）、TRIM（）、LTRIM（）、RTRIM（）。我画了一张图来展示它们的含义，你可以了解一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/86f0f4ebe3055db5c112784d86aa07d9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/86f0f4ebe3055db5c112784d86aa07d9.jpg" alt=""></a></p><p>一般来说，关于字符串函数，你掌握这些就足够了。不过，MySQL支持的字符串函数还有很多，如果你在实际工作中，遇到了更复杂的情况，可以参考MySQL官方的 <a href="https://dev.mysql.com/doc/refman/8.0/en/string-functions.html" target="_blank" rel="noreferrer">文档</a>。</p><h2 id="条件判断函数" tabindex="-1">条件判断函数 <a class="header-anchor" href="#条件判断函数" aria-label="Permalink to &quot;条件判断函数&quot;">​</a></h2><p>我们刚才在对商品信息字符串进行拼接的时候，会有一种例外的情况，那就是当规格为空的时候，商品信息会变成“NULL”。这个结果显然不是我们想要的，因为名称变成NULL，顾客会觉得奇怪，也不知道买了什么商品。我们希望，如果规格是空值，就不用加规格了。怎么实现呢？这就要用到条件判断函数了。</p><p>条件判断函数的主要作用，就是根据特定的条件返回不同的值，常用的有两种。</p><ul><li>IFNULL（V1，V2）：表示如果V1的值不为空值，则返回V1，否则返回V2。</li><li>IF（表达式，V1，V2）：如果表达式为真（TRUE），则返回V1，否则返回V2。</li></ul><p>我们希望规格是空的商品，拼接商品信息字符串的时候，规格不要是空。这个问题，可以通过 IFNULL(specification, &#39;&#39;)函数来解决。具体点说就是，对字段“specification”是否为空进行判断，如果为空，就返回空字符串，否则就返回商品规格specification的值。代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt; goodsname,</span></span>
<span class="line"><span>    -&amp;gt; specification,</span></span>
<span class="line"><span>    -&amp;gt; CONCAT(goodsname,&#39;(&#39;, IFNULL(specification, &#39;&#39;),&#39;)&#39;) AS 拼接 -- 用条件判断函数，如果规格是空，则括号中是空字符串</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt; demo.goodsmaster;</span></span>
<span class="line"><span>+-----------+---------------+----------+</span></span>
<span class="line"><span>| goodsname | specification | 拼接     |</span></span>
<span class="line"><span>+-----------+---------------+----------+</span></span>
<span class="line"><span>| 书        | 16开          | 书(16开) |</span></span>
<span class="line"><span>| 笔        | NULL          | 笔()     |</span></span>
<span class="line"><span>+-----------+---------------+----------+</span></span>
<span class="line"><span>2 rows in set (0.00 sec)</span></span></code></pre></div><p>结果是，如果规格为空，商品信息就变成了“商品信息（）”，好像还不错。但是也存在一点问题：商品名称后面的那个空括号“()”会让客人觉得奇怪，能不能去掉呢？</p><p>如果用IFNULL（V1，V2）函数，就不容易做到，但是没关系，我们可以尝试用另一个条件判断函数IF（表达式，V1，V2）来解决。这里表达式是ISNULL(specification)，这个函数用来判断字段&quot;specificaiton&quot;是否为空，V1是返回商品名称，V2是返回商品名称拼接规格。代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT</span></span>
<span class="line"><span>    -&amp;gt; goodsname,</span></span>
<span class="line"><span>    -&amp;gt; specification,</span></span>
<span class="line"><span>    -&amp;gt; -- 这里做判断，如果是空值，返回商品名称，否则就拼接规格</span></span>
<span class="line"><span>    -&amp;gt; IF(ISNULL(specification),</span></span>
<span class="line"><span>    -&amp;gt; goodsname,</span></span>
<span class="line"><span>    -&amp;gt; CONCAT(goodsname, &#39;(&#39;, specification, &#39;)&#39;)) AS 拼接</span></span>
<span class="line"><span>    -&amp;gt; FROM</span></span>
<span class="line"><span>    -&amp;gt; demo.goodsmaster;</span></span>
<span class="line"><span>+-----------+---------------+----------+</span></span>
<span class="line"><span>| goodsname | specification | 拼接     |</span></span>
<span class="line"><span>+-----------+---------------+----------+</span></span>
<span class="line"><span>| 书        | 16开          | 书(16开) |</span></span>
<span class="line"><span>| 笔        | NULL          | 笔       |</span></span>
<span class="line"><span>+-----------+---------------+----------+</span></span>
<span class="line"><span>2 rows in set (0.02 sec)</span></span></code></pre></div><p>这个结果就是，如果规格为空，商品信息就是商品名称；如果规格不为空，商品信息是商品名称拼接商品规格，这就达到了我们的目的。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们学习了用于提升数据处理效率的数学函数、字符串函数和条件判断函数。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/06f0cb9251af48e626b81016630f9ff7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/MySQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/356966/06f0cb9251af48e626b81016630f9ff7.jpg" alt=""></a></p><p>这些函数看起来很容易掌握，但是有很多坑。比如说，ROUND（X）是对X小数部分四舍五入，那么在“五入”的时候，返回的值是不是一定比X大呢？其实不一定，因为当X为负数时，五入的值会更小。你可以看看下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mysql&amp;gt; SELECT ROUND(-1.5);</span></span>
<span class="line"><span>+-------------+</span></span>
<span class="line"><span>| ROUND(-1.5) |</span></span>
<span class="line"><span>+-------------+</span></span>
<span class="line"><span>|          -2 |</span></span>
<span class="line"><span>+-------------+</span></span>
<span class="line"><span>1 row in set (0.00 sec)</span></span></code></pre></div><p>所以，我建议你在学习的时候， <strong>多考虑边界条件的场景，实际测试一下</strong>。就像这个问题，对于ROUND(X,0)，并没有指定X是正数，那如果是负数，会怎样呢？你去测试一下，就明白了。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这节课，我介绍了如何用FLOOR（）函数来计算会员积分，那么，如果不用FLOOR（），有没有其他办法来实现会员积分的计算呢？</p><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得今天的内容对你有所帮助，也欢迎你分享给你的朋友或同事，我们下节课见。</p>`,86)])])}const h=a(i,[["render",l]]);export{r as __pageData,h as default};
