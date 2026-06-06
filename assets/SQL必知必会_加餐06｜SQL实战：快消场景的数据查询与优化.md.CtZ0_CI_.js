import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"加餐06｜SQL实战：快消场景的数据查询与优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据表","slug":"数据表","link":"#数据表","children":[]},{"level":2,"title":"问题设定","slug":"问题设定","link":"#问题设定","children":[{"level":3,"title":"门店分析","slug":"门店分析","link":"#门店分析","children":[]},{"level":3,"title":"销售分析","slug":"销售分析","link":"#销售分析","children":[]},{"level":3,"title":"产品分析","slug":"产品分析","link":"#产品分析","children":[]},{"level":3,"title":"会员分析","slug":"会员分析","link":"#会员分析","children":[]},{"level":3,"title":"订单分析","slug":"订单分析","link":"#订单分析","children":[]},{"level":3,"title":"组合分析","slug":"组合分析","link":"#组合分析","children":[]}]}],"relativePath":"SQL必知必会/加餐06｜SQL实战：快消场景的数据查询与优化.md","filePath":"SQL必知必会/加餐06｜SQL实战：快消场景的数据查询与优化.md","lastUpdated":1779816304000}'),l={name:"SQL必知必会/加餐06｜SQL实战：快消场景的数据查询与优化.md"};function i(t,s,o,c,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="加餐06-sql实战-快消场景的数据查询与优化" tabindex="-1">加餐06｜SQL实战：快消场景的数据查询与优化 <a class="header-anchor" href="#加餐06-sql实战-快消场景的数据查询与优化" aria-label="Permalink to &quot;加餐06｜SQL实战：快消场景的数据查询与优化&quot;">​</a></h1><p>你好，我是陈博士。今天我们来看下麦当劳如何通过数据查询与分析来优化其业务运营。</p><p>麦当劳每天处理大量的交易，涉及数以百万计的顾客订单。有效的数据分析不仅有助于理解顾客消费行为和偏好，还能够为管理层提供决策支持。</p><p>针对该场景，我整理了5张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。</p><h2 id="数据表" tabindex="-1"><strong>数据表</strong> <a class="header-anchor" href="#数据表" aria-label="Permalink to &quot;**数据表**&quot;">​</a></h2><ul><li><p><strong>订单表 orders</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/0f331b0d7d23b90fd78ce6cbb0d69cb1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/0f331b0d7d23b90fd78ce6cbb0d69cb1.jpg" alt=""></a></p></li><li><p><strong>订单明细表 order_details</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/05f2a4bc77b0aa12aed302dbb18f77a1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/05f2a4bc77b0aa12aed302dbb18f77a1.jpg" alt=""></a></p></li><li><p><strong>产品表 products</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/374ec704448b03f990a0d7a9fyy402e5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/374ec704448b03f990a0d7a9fyy402e5.jpg" alt=""></a></p></li><li><p><strong>门店表 stores</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/6832ccaba343ab13b05c1a4d95c576fa.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/6832ccaba343ab13b05c1a4d95c576fa.jpg" alt=""></a></p></li><li><p><strong>会员表 (members)</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/f8eaba74a4a4219a693e12911ae646a0.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839602/f8eaba74a4a4219a693e12911ae646a0.jpg" alt=""></a></p></li></ul><h2 id="问题设定" tabindex="-1"><strong>问题设定</strong> <a class="header-anchor" href="#问题设定" aria-label="Permalink to &quot;**问题设定**&quot;">​</a></h2><p>我从门店分析、销售分析、产品分析、会员分析、订单分析、组合分析等维度设置了一些常见的查询问题，一起来看一下。</p><h3 id="门店分析" tabindex="-1"><strong>门店分析</strong> <a class="header-anchor" href="#门店分析" aria-label="Permalink to &quot;**门店分析**&quot;">​</a></h3><ul><li>各城市门店数量分布</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> SELECT city, COUNT(*) as store_count</span></span>
<span class="line"><span>FROM stores</span></span>
<span class="line"><span>GROUP BY city</span></span>
<span class="line"><span>ORDER BY store_count DESC</span></span>
<span class="line"><span>LIMIT 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 GROUP BY 对城市进行分组，COUNT(*) 统计各城市门店数量，ORDER BY 和 LIMIT 限制结果，展示门店数量最多的前10个城市。</span></span></code></pre></div><ul><li>查找最近30天新开业的门店</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT store_name, city, address, created_time</span></span>
<span class="line"><span>FROM stores</span></span>
<span class="line"><span>WHERE created_time &amp;gt;= DATE_SUB(CURDATE(), INTERVAL 30 DAY)</span></span>
<span class="line"><span>ORDER BY created_time DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 DATE_SUB 和 CURDATE() 函数计算最近30天的时间范围，WHERE 子句筛选新开业的门店，ORDER BY 按创建时间降序排列。</span></span></code></pre></div><ul><li>统计各省份的门店数量</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT province, COUNT(*) as store_count</span></span>
<span class="line"><span>FROM stores</span></span>
<span class="line"><span>GROUP BY province</span></span>
<span class="line"><span>ORDER BY store_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 GROUP BY province 对省份进行分组，COUNT(*) 统计每个省份的门店数量，ORDER BY store_count DESC 按门店数量降序排列，展示各省份的门店分布情况。</span></span></code></pre></div><h3 id="销售分析" tabindex="-1"><strong>销售分析</strong> <a class="header-anchor" href="#销售分析" aria-label="Permalink to &quot;**销售分析**&quot;">​</a></h3><ul><li>统计最近30天各门店的销售额</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT s.store_name,</span></span>
<span class="line"><span>       COUNT(o.order_id) as order_count,</span></span>
<span class="line"><span>       SUM(o.payment_amount) as total_sales</span></span>
<span class="line"><span>FROM orders o</span></span>
<span class="line"><span>JOIN stores s ON o.store_id = s.store_id</span></span>
<span class="line"><span>WHERE o.created_time &amp;gt;= DATE_SUB(CURDATE(), INTERVAL 30 DAY)</span></span>
<span class="line"><span>GROUP BY s.store_id, s.store_name</span></span>
<span class="line"><span>ORDER BY total_sales DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过JOIN 连接订单和门店表，使用 WHERE 筛选最近30天的数据，GROUP BY 按门店分组，SUM 和 COUNT 分别计算销售额和订单数。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DATE_SUB 是 SQL 中用于日期运算的函数之一，主要用于从给定日期中减去一个时间间隔。它对于筛选特定时间段的数据非常有用。</span></span></code></pre></div><ul><li>统计各支付方式的使用比例</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    payment_method,</span></span>
<span class="line"><span>    COUNT(*) as use_count,</span></span>
<span class="line"><span>    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as percentage</span></span>
<span class="line"><span>FROM orders</span></span>
<span class="line"><span>GROUP BY payment_method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 GROUP BY payment_method 分组统计每种支付方式的使用次数，通过子查询计算总订单数，ROUND 函数计算并格式化各支付方式的使用比例。</span></span></code></pre></div><ul><li>按小时统计订单量分布</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    HOUR(created_time) as hour,</span></span>
<span class="line"><span>    COUNT(*) as order_count</span></span>
<span class="line"><span>FROM orders</span></span>
<span class="line"><span>GROUP BY HOUR(created_time)</span></span>
<span class="line"><span>ORDER BY hour;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 HOUR(created_time) 提取订单创建时间的小时部分，GROUP BY 按小时分组统计订单量，ORDER BY hour 按小时顺序排列，展示每小时的订单分布情况。</span></span></code></pre></div><h3 id="产品分析" tabindex="-1"><strong>产品分析</strong> <a class="header-anchor" href="#产品分析" aria-label="Permalink to &quot;**产品分析**&quot;">​</a></h3><ul><li>销量TOP10的产品</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    p.product_name,</span></span>
<span class="line"><span>    p.category_id,</span></span>
<span class="line"><span>    SUM(od.quantity) as total_quantity,</span></span>
<span class="line"><span>    SUM(od.subtotal) as total_amount</span></span>
<span class="line"><span>FROM order_details od</span></span>
<span class="line"><span>JOIN products p ON od.product_id = p.product_id</span></span>
<span class="line"><span>GROUP BY p.product_id, p.product_name, p.category_id</span></span>
<span class="line"><span>ORDER BY total_quantity DESC</span></span>
<span class="line"><span>LIMIT 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过 JOIN 连接订单明细和产品表，使用 GROUP BY 按产品分组，SUM 计算总销量和总金额，ORDER BY total_quantity DESC 按销量排序，LIMIT 10 展示销量最高的10个产品。</span></span></code></pre></div><ul><li>各品类销售占比</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    p.category_id,</span></span>
<span class="line"><span>    COUNT(DISTINCT od.order_id) as order_count,</span></span>
<span class="line"><span>    SUM(od.quantity) as total_quantity,</span></span>
<span class="line"><span>    SUM(od.subtotal) as total_amount,</span></span>
<span class="line"><span>    ROUND(SUM(od.subtotal) * 100.0 / (SELECT SUM(subtotal) FROM order_details), 2) as sales_percentage</span></span>
<span class="line"><span>FROM order_details od</span></span>
<span class="line"><span>JOIN products p ON od.product_id = p.product_id</span></span>
<span class="line"><span>GROUP BY p.category_id</span></span>
<span class="line"><span>ORDER BY total_amount DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：ROUND(SUM(od.subtotal) * 100.0 / (SELECT SUM(subtotal) FROM order_details), 2) 这个表达式用于计算每个类别的销售额占总销售额的百分比，并将结果保留两位小数。</span></span></code></pre></div><h3 id="会员分析" tabindex="-1"><strong>会员分析</strong> <a class="header-anchor" href="#会员分析" aria-label="Permalink to &quot;**会员分析**&quot;">​</a></h3><ul><li>会员等级分布</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    member_level,</span></span>
<span class="line"><span>    COUNT(*) as member_count,</span></span>
<span class="line"><span>    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM members), 2) as percentage</span></span>
<span class="line"><span>FROM members</span></span>
<span class="line"><span>GROUP BY member_level;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 GROUP BY member_level 按会员等级分组，COUNT(*) 统计各等级会员数量，通过子查询计算总会员数，ROUND 函数计算并格式化各等级会员占比。</span></span></code></pre></div><ul><li>最近30天新增会员数</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    DATE(register_time) as register_date,</span></span>
<span class="line"><span>    COUNT(*) as new_member_count</span></span>
<span class="line"><span>FROM members</span></span>
<span class="line"><span>WHERE register_time &amp;gt;= DATE_SUB(CURDATE(), INTERVAL 30 DAY)</span></span>
<span class="line"><span>GROUP BY DATE(register_time)</span></span>
<span class="line"><span>ORDER BY register_date;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 DATE(register_time) 提取注册日期，WHERE 筛选最近30天的数据，GROUP BY DATE(register_time) 按天统计新增会员数，ORDER BY register_date 按日期排序展示。</span></span></code></pre></div><ul><li>会员消费行为分析</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    m.member_level,</span></span>
<span class="line"><span>    COUNT(DISTINCT o.member_id) as active_members,</span></span>
<span class="line"><span>    COUNT(o.order_id) as total_orders,</span></span>
<span class="line"><span>    ROUND(COUNT(o.order_id) * 1.0 / COUNT(DISTINCT o.member_id), 2) as avg_orders_per_member,</span></span>
<span class="line"><span>    ROUND(AVG(o.payment_amount), 2) as avg_amount_per_order,</span></span>
<span class="line"><span>    ROUND(SUM(o.payment_amount) * 1.0 / COUNT(DISTINCT o.member_id), 2) as avg_amount_per_member</span></span>
<span class="line"><span>FROM orders o</span></span>
<span class="line"><span>JOIN members m ON o.member_id = m.member_id</span></span>
<span class="line"><span>GROUP BY m.member_level;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过 JOIN 连接订单和会员表，按会员等级分组，统计活跃会员数、总订单数、平均每人订单数、平均每笔订单金额及平均每人消费金额，全面分析会员消费行为。</span></span></code></pre></div><h3 id="订单分析" tabindex="-1"><strong>订单分析</strong> <a class="header-anchor" href="#订单分析" aria-label="Permalink to &quot;**订单分析**&quot;">​</a></h3><ul><li>订单完成率</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    order_status,</span></span>
<span class="line"><span>    COUNT(*) as order_count,</span></span>
<span class="line"><span>    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as percentage</span></span>
<span class="line"><span>FROM orders</span></span>
<span class="line"><span>GROUP BY order_status;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 GROUP BY order_status 按订单状态分组，统计各状态的订单数量，通过子查询计算总订单数，ROUND 函数计算并格式化各状态订单的占比，分析订单完成率。</span></span></code></pre></div><ul><li>平均订单处理时间（分钟）</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    AVG(TIMESTAMPDIFF(MINUTE, created_time, payment_time)) as avg_payment_time,</span></span>
<span class="line"><span>    AVG(TIMESTAMPDIFF(MINUTE, payment_time, complete_time)) as avg_process_time,</span></span>
<span class="line"><span>    AVG(TIMESTAMPDIFF(MINUTE, created_time, complete_time)) as avg_total_time</span></span>
<span class="line"><span>FROM orders</span></span>
<span class="line"><span>WHERE order_status = 3;  -- 已完成的订单</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 TIMESTAMPDIFF 计算订单各阶段的时间差（分钟），AVG 求平均值，WHERE order_status = 3 筛选已完成订单，统计平均支付时间、处理时间和总时间。</span></span></code></pre></div><ul><li>各时段订单量和金额分布</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    CASE</span></span>
<span class="line"><span>        WHEN HOUR(created_time) BETWEEN 6 AND 9 THEN &#39;早餐&#39;</span></span>
<span class="line"><span>        WHEN HOUR(created_time) BETWEEN 10 AND 13 THEN &#39;午餐&#39;</span></span>
<span class="line"><span>        WHEN HOUR(created_time) BETWEEN 14 AND 16 THEN &#39;下午茶&#39;</span></span>
<span class="line"><span>        WHEN HOUR(created_time) BETWEEN 17 AND 20 THEN &#39;晚餐&#39;</span></span>
<span class="line"><span>        ELSE &#39;夜宵&#39;</span></span>
<span class="line"><span>    END as meal_period,</span></span>
<span class="line"><span>    COUNT(*) as order_count,</span></span>
<span class="line"><span>    ROUND(AVG(payment_amount), 2) as avg_amount,</span></span>
<span class="line"><span>    SUM(payment_amount) as total_amount</span></span>
<span class="line"><span>FROM orders</span></span>
<span class="line"><span>GROUP BY meal_period</span></span>
<span class="line"><span>ORDER BY order_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 CASE 语句按小时划分订单到不同的用餐时段，GROUP BY meal_period 统计各时段的订单量和金额，ORDER BY order_count DESC 按订单量降序排列，分析各时段的业务表现。</span></span></code></pre></div><h3 id="组合分析" tabindex="-1"><strong>组合分析</strong> <a class="header-anchor" href="#组合分析" aria-label="Permalink to &quot;**组合分析**&quot;">​</a></h3><ul><li>查找经常一起购买的产品组合</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    p1.product_name as product1,</span></span>
<span class="line"><span>    p2.product_name as product2,</span></span>
<span class="line"><span>    COUNT(*) as combination_count</span></span>
<span class="line"><span>FROM order_details od1</span></span>
<span class="line"><span>JOIN order_details od2 ON od1.order_id = od2.order_id AND od1.product_id &amp;lt; od2.product_id</span></span>
<span class="line"><span>JOIN products p1 ON od1.product_id = p1.product_id</span></span>
<span class="line"><span>JOIN products p2 ON od2.product_id = p2.product_id</span></span>
<span class="line"><span>GROUP BY p1.product_id, p2.product_id, p1.product_name, p2.product_name</span></span>
<span class="line"><span>HAVING combination_count &amp;gt; 10</span></span>
<span class="line"><span>ORDER BY combination_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过自连接 order_details 表匹配同一订单中的不同产品，使用 JOIN 连接产品表获取产品名称，GROUP BY 和 HAVING 筛选并统计购买次数超过10次的产品组合，按组合频率排序。</span></span></code></pre></div><ul><li>会员消费升级分析（比较首次消费和最近一次消费）</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH first_last_orders AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        member_id,</span></span>
<span class="line"><span>        MIN(created_time) as first_order_time,</span></span>
<span class="line"><span>        MAX(created_time) as last_order_time</span></span>
<span class="line"><span>    FROM orders</span></span>
<span class="line"><span>    GROUP BY member_id</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    m.member_level,</span></span>
<span class="line"><span>    ROUND(AVG(first_order.payment_amount), 2) as avg_first_amount,</span></span>
<span class="line"><span>    ROUND(AVG(last_order.payment_amount), 2) as avg_last_amount,</span></span>
<span class="line"><span>    ROUND(AVG(last_order.payment_amount - first_order.payment_amount), 2) as avg_amount_increase</span></span>
<span class="line"><span>FROM first_last_orders fl</span></span>
<span class="line"><span>JOIN orders first_order ON fl.member_id = first_order.member_id</span></span>
<span class="line"><span>    AND fl.first_order_time = first_order.created_time</span></span>
<span class="line"><span>JOIN orders last_order ON fl.member_id = last_order.member_id</span></span>
<span class="line"><span>    AND fl.last_order_time = last_order.created_time</span></span>
<span class="line"><span>JOIN members m ON fl.member_id = m.member_id</span></span>
<span class="line"><span>GROUP BY m.member_level;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 WITH 子句获取每个会员的首次和最近一次消费时间，通过 JOIN 连接订单表和会员表，计算各会员等级的首次与最近一次平均消费金额及其增长，分析消费升级趋势。</span></span></code></pre></div><p>如果你是快消行业的从业人员，这节课将对你非常有帮助。</p><p>本次的课程迭代到这里就结束了，期待再会。如果你有更多SQL相关的学习需求，欢迎你留言给我，我们一起探讨！</p>`,48)])])}const _=a(l,[["render",i]]);export{m as __pageData,_ as default};
