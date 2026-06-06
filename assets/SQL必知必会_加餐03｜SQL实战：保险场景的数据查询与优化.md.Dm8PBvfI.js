import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"加餐03｜SQL实战：保险场景的数据查询与优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据表","slug":"数据表","link":"#数据表","children":[]},{"level":2,"title":"问题设定","slug":"问题设定","link":"#问题设定","children":[{"level":3,"title":"1. 客户分析","slug":"_1-客户分析","link":"#_1-客户分析","children":[]},{"level":3,"title":"2. 产品分析","slug":"_2-产品分析","link":"#_2-产品分析","children":[]},{"level":3,"title":"3. 保单分析","slug":"_3-保单分析","link":"#_3-保单分析","children":[]},{"level":3,"title":"4. 续保分析","slug":"_4-续保分析","link":"#_4-续保分析","children":[]},{"level":3,"title":"5. 异常分析","slug":"_5-异常分析","link":"#_5-异常分析","children":[]},{"level":3,"title":"6. 提醒效果分析","slug":"_6-提醒效果分析","link":"#_6-提醒效果分析","children":[]},{"level":3,"title":"7. 交叉分析","slug":"_7-交叉分析","link":"#_7-交叉分析","children":[]}]}],"relativePath":"SQL必知必会/加餐03｜SQL实战：保险场景的数据查询与优化.md","filePath":"SQL必知必会/加餐03｜SQL实战：保险场景的数据查询与优化.md","lastUpdated":1779816304000}'),l={name:"SQL必知必会/加餐03｜SQL实战：保险场景的数据查询与优化.md"};function i(c,s,t,r,o,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="加餐03-sql实战-保险场景的数据查询与优化" tabindex="-1">加餐03｜SQL实战：保险场景的数据查询与优化 <a class="header-anchor" href="#加餐03-sql实战-保险场景的数据查询与优化" aria-label="Permalink to &quot;加餐03｜SQL实战：保险场景的数据查询与优化&quot;">​</a></h1><p>你好，我是陈博士，今天我们来探讨一下保险续保业务的数据分析与优化。</p><p>续保业务是保险公司持续稳定发展的重要组成部分。通过深入的数据查询和分析，我们可以评估客户的续保倾向，识别潜在的流失风险，并为后续的续保策略提供决策支持。</p><p>针对该场景，我整理了5张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。</p><h2 id="数据表" tabindex="-1"><strong>数据表</strong> <a class="header-anchor" href="#数据表" aria-label="Permalink to &quot;**数据表**&quot;">​</a></h2><ul><li>客户信息表 customers</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/cd58929f9e0c9b1cfcd4ca0812c0d245.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/cd58929f9e0c9b1cfcd4ca0812c0d245.jpg" alt=""></a></p><ul><li>保险产品表 insurance_products</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/a2449943d03e3c430fbdcc275411a990.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/a2449943d03e3c430fbdcc275411a990.jpg" alt=""></a></p><ul><li>保单表 policies</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/28eafe57eef59f8efa1334b018e25958.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/28eafe57eef59f8efa1334b018e25958.jpg" alt=""></a></p><ul><li>续保记录表 renewal_records</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/9b4247e0e84abd1267ff5e85yy908cf6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/9b4247e0e84abd1267ff5e85yy908cf6.jpg" alt=""></a></p><ul><li>续保提醒记录表 renewal_reminders</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/74f440af660a378e6f15ac1f716a05e4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838086/74f440af660a378e6f15ac1f716a05e4.jpg" alt=""></a></p><h2 id="问题设定" tabindex="-1"><strong>问题设定</strong> <a class="header-anchor" href="#问题设定" aria-label="Permalink to &quot;**问题设定**&quot;">​</a></h2><p>我从客户分析、产品分析、保单分析、续保分析、异常分析、提醒效果分析、交叉分析等维度设置了一些常见的查询问题。</p><h3 id="_1-客户分析" tabindex="-1"><strong>1. 客户分析</strong> <a class="header-anchor" href="#_1-客户分析" aria-label="Permalink to &quot;**1\\. 客户分析**&quot;">​</a></h3><ul><li>查询购买保单数量最多的前10名客户及其保单数量</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    c.customer_id,</span></span>
<span class="line"><span>    c.name,</span></span>
<span class="line"><span>    c.phone,</span></span>
<span class="line"><span>    COUNT(p.policy_id) as policy_count</span></span>
<span class="line"><span>FROM customers c</span></span>
<span class="line"><span>JOIN policies p ON c.customer_id = p.customer_id</span></span>
<span class="line"><span>GROUP BY c.customer_id, c.name, c.phone</span></span>
<span class="line"><span>ORDER BY policy_count DESC</span></span>
<span class="line"><span>LIMIT 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：这里使用JOIN连接客户和保单表，GROUP BY按客户分组并统计保单数量</span></span></code></pre></div><ul><li>统计每个年龄段的客户数量及平均保费</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH customer_age AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        customer_id,</span></span>
<span class="line"><span>        FLOOR((YEAR(CURRENT_DATE) - YEAR(STR_TO_DATE(birth_date, &#39;%Y-%m-%d&#39;)))/10)*10 as age_group</span></span>
<span class="line"><span>    FROM customers</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    ca.age_group as age_range,</span></span>
<span class="line"><span>    CONCAT(ca.age_group, &#39;-&#39;, ca.age_group + 9) as age_range_display,</span></span>
<span class="line"><span>    COUNT(DISTINCT ca.customer_id) as customer_count,</span></span>
<span class="line"><span>    ROUND(AVG(p.premium_amount), 2) as avg_premium</span></span>
<span class="line"><span>FROM customer_age ca</span></span>
<span class="line"><span>JOIN policies p ON ca.customer_id = p.customer_id</span></span>
<span class="line"><span>GROUP BY ca.age_group</span></span>
<span class="line"><span>ORDER BY ca.age_group;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：WITH 关键字用于定义公用表表达式（Common Table Expressions，简称CTE），这是一种临时结果集，可以在查询中引用一次或多次。CTE 提高了查询的可读性和维护性，尤其是在复杂的查询中需要重复使用相同子查询的情况下。</span></span></code></pre></div><h3 id="_2-产品分析" tabindex="-1"><strong>2. 产品分析</strong> <a class="header-anchor" href="#_2-产品分析" aria-label="Permalink to &quot;**2\\. 产品分析**&quot;">​</a></h3><ul><li>统计各类保险产品的销售份数和保费收入</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    ip.product_id,</span></span>
<span class="line"><span>    ip.product_name,</span></span>
<span class="line"><span>    ip.product_type,</span></span>
<span class="line"><span>    COUNT(p.policy_id) as sales_count,</span></span>
<span class="line"><span>    SUM(p.premium_amount) as total_premium</span></span>
<span class="line"><span>FROM insurance_products ip</span></span>
<span class="line"><span>LEFT JOIN policies p ON ip.product_id = p.product_id</span></span>
<span class="line"><span>GROUP BY ip.product_id, ip.product_name, ip.product_type</span></span>
<span class="line"><span>ORDER BY total_premium DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用LEFT JOIN连接保险产品和保单表，确保包括所有保险产品，GROUP BY按产品分组统计销售份数和保费收入，ORDER BY按总保费降序排列。</span></span></code></pre></div><ul><li>查询续保率最高的前5个产品</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH renewal_stats AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        ip.product_id,</span></span>
<span class="line"><span>        ip.product_name,</span></span>
<span class="line"><span>        COUNT(DISTINCT p.policy_id) as total_policies,</span></span>
<span class="line"><span>        COUNT(DISTINCT CASE WHEN rr.renewal_status = &#39;成功&#39; THEN rr.renewal_id END) as successful_renewals</span></span>
<span class="line"><span>    FROM insurance_products ip</span></span>
<span class="line"><span>    JOIN policies p ON ip.product_id = p.product_id</span></span>
<span class="line"><span>    LEFT JOIN renewal_records rr ON p.policy_id = rr.policy_id</span></span>
<span class="line"><span>    GROUP BY ip.product_id, ip.product_name</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    product_id,</span></span>
<span class="line"><span>    product_name,</span></span>
<span class="line"><span>    total_policies,</span></span>
<span class="line"><span>    successful_renewals,</span></span>
<span class="line"><span>    ROUND(CAST(successful_renewals AS DECIMAL(10,2)) / NULLIF(total_policies, 0) * 100, 2) as renewal_rate</span></span>
<span class="line"><span>FROM renewal_stats</span></span>
<span class="line"><span>WHERE total_policies &amp;gt; 0</span></span>
<span class="line"><span>ORDER BY renewal_rate DESC</span></span>
<span class="line"><span>LIMIT 5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：CAST 和 NULLIF 是SQL中用于数据类型转换和条件表达式的两个函数。在这个查询中，它们一起用于确保续保率计算的准确性，并处理可能的除以零的异常。</span></span></code></pre></div><h3 id="_3-保单分析" tabindex="-1"><strong>3. 保单分析</strong> <a class="header-anchor" href="#_3-保单分析" aria-label="Permalink to &quot;**3\\. 保单分析**&quot;">​</a></h3><ul><li>查询即将到期（30 天内）的保单清单</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    p.policy_id,</span></span>
<span class="line"><span>    p.policy_number,</span></span>
<span class="line"><span>    c.name as customer_name,</span></span>
<span class="line"><span>    c.phone,</span></span>
<span class="line"><span>    ip.product_name,</span></span>
<span class="line"><span>    p.end_date,</span></span>
<span class="line"><span>    p.premium_amount</span></span>
<span class="line"><span>FROM policies p</span></span>
<span class="line"><span>JOIN customers c ON p.customer_id = c.customer_id</span></span>
<span class="line"><span>JOIN insurance_products ip ON p.product_id = ip.product_id</span></span>
<span class="line"><span>WHERE p.status = &#39;有效&#39;</span></span>
<span class="line"><span>AND STR_TO_DATE(p.end_date, &#39;%Y-%m-%d&#39;)</span></span>
<span class="line"><span>    BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)</span></span>
<span class="line"><span>ORDER BY p.end_date;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：STR_TO_DATE、CURRENT_DATE 和 DATE_ADD 是SQL中用于日期处理的函数。在这个查询中用于筛选即将到期的保单。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>STR_TO_DATE 函数用于将字符串按照指定的格式转换为日期类型。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CURRENT_DATE 函数返回当前日期，不包含时间部分。它通常用于获取今天的日期，并且在不同的数据库系统中有类似的实现方式（例如，在MySQL中就是 CURRENT_DATE() 或 CURDATE()）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DATE_ADD 函数用于向日期添加一个时间间隔。</span></span></code></pre></div><ul><li>分析保单状态分布</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    status,</span></span>
<span class="line"><span>    COUNT(*) as count,</span></span>
<span class="line"><span>    ROUND(CAST(COUNT(*) AS DECIMAL(10,2)) / SUM(COUNT(*)) OVER() * 100, 2) as percentage</span></span>
<span class="line"><span>FROM policies</span></span>
<span class="line"><span>GROUP BY status</span></span>
<span class="line"><span>ORDER BY count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用GROUP BY按保单状态分组统计数量，通过窗口函数SUM OVER()计算总数，CAST转换数据类型并计算各状态的百分比，ORDER BY按数量降序排列。</span></span></code></pre></div><h3 id="_4-续保分析" tabindex="-1"><strong>4. 续保分析</strong> <a class="header-anchor" href="#_4-续保分析" aria-label="Permalink to &quot;**4\\. 续保分析**&quot;">​</a></h3><ul><li>查询连续续保 3 次以上的客户</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH consecutive_renewals AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        p.customer_id,</span></span>
<span class="line"><span>        COUNT(rr.renewal_id) as renewal_count</span></span>
<span class="line"><span>    FROM policies p</span></span>
<span class="line"><span>    JOIN renewal_records rr ON p.policy_id = rr.policy_id</span></span>
<span class="line"><span>    WHERE rr.renewal_status = &#39;成功&#39;</span></span>
<span class="line"><span>    GROUP BY p.customer_id</span></span>
<span class="line"><span>    HAVING COUNT(rr.renewal_id) &amp;gt;= 3</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    c.customer_id,</span></span>
<span class="line"><span>    c.name,</span></span>
<span class="line"><span>    c.phone,</span></span>
<span class="line"><span>    cr.renewal_count</span></span>
<span class="line"><span>FROM consecutive_renewals cr</span></span>
<span class="line"><span>JOIN customers c ON cr.customer_id = c.customer_id</span></span>
<span class="line"><span>ORDER BY cr.renewal_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：这里使用CTE筛选出成功续保3次及以上的客户，通过GROUP BY和HAVING条件聚合续保记录，最后JOIN客户表获取详细信息并按续保次数排序。</span></span></code></pre></div><h3 id="_5-异常分析" tabindex="-1"><strong>5. 异常分析</strong> <a class="header-anchor" href="#_5-异常分析" aria-label="Permalink to &quot;**5\\. 异常分析**&quot;">​</a></h3><ul><li>查询保费异常的保单（超过平均值 2 个标准差）</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH premium_stats AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        AVG(premium_amount) as avg_premium,</span></span>
<span class="line"><span>        STDDEV(premium_amount) as stddev_premium</span></span>
<span class="line"><span>    FROM policies</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    p.policy_id,</span></span>
<span class="line"><span>    p.policy_number,</span></span>
<span class="line"><span>    c.name as customer_name,</span></span>
<span class="line"><span>    ip.product_name,</span></span>
<span class="line"><span>    p.premium_amount,</span></span>
<span class="line"><span>    ps.avg_premium,</span></span>
<span class="line"><span>    ps.stddev_premium</span></span>
<span class="line"><span>FROM policies p</span></span>
<span class="line"><span>JOIN customers c ON p.customer_id = c.customer_id</span></span>
<span class="line"><span>JOIN insurance_products ip ON p.product_id = ip.product_id</span></span>
<span class="line"><span>CROSS JOIN premium_stats ps</span></span>
<span class="line"><span>WHERE p.premium_amount &amp;gt; ps.avg_premium + (2 * ps.stddev_premium)</span></span>
<span class="line"><span>   OR p.premium_amount &amp;lt; ps.avg_premium - (2 * ps.stddev_premium)</span></span>
<span class="line"><span>ORDER BY p.premium_amount DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用CTE计算保费的平均值和标准差，通过CROSS JOIN将统计结果应用到每条保单记录，筛选出保费超过平均值±2个标准差的异常保单。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CROSS JOIN 是SQL中的一种连接类型，它返回两个表的笛卡尔积，即第一个表中的每一行与第二个表中的每一行组合。结果集中行的数量等于两个表行数的乘积。</span></span></code></pre></div><h3 id="_6-提醒效果分析" tabindex="-1"><strong>6. 提醒效果分析</strong> <a class="header-anchor" href="#_6-提醒效果分析" aria-label="Permalink to &quot;**6\\. 提醒效果分析**&quot;">​</a></h3><ul><li>统计不同提醒方式的效果（续保成功率）</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH reminder_stats AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        rm.remind_method,</span></span>
<span class="line"><span>        COUNT(DISTINCT rm.policy_id) as total_reminders,</span></span>
<span class="line"><span>        COUNT(DISTINCT CASE WHEN rr.renewal_status = &#39;成功&#39; THEN rr.renewal_id END) as successful_renewals</span></span>
<span class="line"><span>    FROM renewal_reminders rm</span></span>
<span class="line"><span>    LEFT JOIN renewal_records rr ON rm.policy_id = rr.policy_id</span></span>
<span class="line"><span>    WHERE rm.remind_status = &#39;成功&#39;</span></span>
<span class="line"><span>    GROUP BY rm.remind_method</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    remind_method,</span></span>
<span class="line"><span>    total_reminders,</span></span>
<span class="line"><span>    successful_renewals,</span></span>
<span class="line"><span>    ROUND(CAST(successful_renewals AS DECIMAL(10,2)) / NULLIF(total_reminders, 0) * 100, 2) as success_rate</span></span>
<span class="line"><span>FROM reminder_stats</span></span>
<span class="line"><span>ORDER BY success_rate DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用CTE统计每种提醒方式的总提醒数和成功续保数，通过GROUP BY分组，计算续保成功率并按成功率降序排列，确保分母不为零。</span></span></code></pre></div><ul><li>分析提醒后一周内完成续保的比例</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH reminder_conversion AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        COUNT(DISTINCT rr.renewal_id) as total_renewals,</span></span>
<span class="line"><span>        COUNT(DISTINCT CASE</span></span>
<span class="line"><span>            WHEN STR_TO_DATE(rr.renewal_date, &#39;%Y-%m-%d&#39;) &amp;lt;=</span></span>
<span class="line"><span>                 DATE_ADD(STR_TO_DATE(rm.remind_time, &#39;%Y-%m-%d %H:%i:%s&#39;), INTERVAL 7 DAY)</span></span>
<span class="line"><span>            AND rr.renewal_status = &#39;成功&#39;</span></span>
<span class="line"><span>            THEN rr.renewal_id</span></span>
<span class="line"><span>        END) as converted_renewals</span></span>
<span class="line"><span>    FROM renewal_reminders rm</span></span>
<span class="line"><span>    LEFT JOIN renewal_records rr ON rm.policy_id = rr.policy_id</span></span>
<span class="line"><span>    WHERE rm.remind_status = &#39;成功&#39;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    total_renewals,</span></span>
<span class="line"><span>    converted_renewals,</span></span>
<span class="line"><span>    ROUND(CAST(converted_renewals AS DECIMAL(10,2)) / NULLIF(total_renewals, 0) * 100, 2) as conversion_rate</span></span>
<span class="line"><span>FROM reminder_conversion;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用CTE统计提醒后一周内成功续保的数量，通过条件判断筛选符合条件的续保记录，计算转换率并确保分母不为零，最终输出总续保数、转换续保数及比率。</span></span></code></pre></div><h3 id="_7-交叉分析" tabindex="-1"><strong>7. 交叉分析</strong> <a class="header-anchor" href="#_7-交叉分析" aria-label="Permalink to &quot;**7. 交叉分析**&quot;">​</a></h3><ul><li>分析客户年龄与产品选择的关系</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH customer_age_group AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        customer_id,</span></span>
<span class="line"><span>        FLOOR((YEAR(CURRENT_DATE) - YEAR(STR_TO_DATE(birth_date, &#39;%Y-%m-%d&#39;)))/10)*10 as age_group</span></span>
<span class="line"><span>    FROM customers</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    cag.age_group,</span></span>
<span class="line"><span>    CONCAT(cag.age_group, &#39;-&#39;, cag.age_group + 9) as age_range,</span></span>
<span class="line"><span>    ip.product_type,</span></span>
<span class="line"><span>    COUNT(DISTINCT p.policy_id) as policy_count,</span></span>
<span class="line"><span>    ROUND(AVG(p.premium_amount), 2) as avg_premium</span></span>
<span class="line"><span>FROM customer_age_group cag</span></span>
<span class="line"><span>JOIN policies p ON cag.customer_id = p.customer_id</span></span>
<span class="line"><span>JOIN insurance_products ip ON p.product_id = ip.product_id</span></span>
<span class="line"><span>GROUP BY cag.age_group, ip.product_type</span></span>
<span class="line"><span>ORDER BY cag.age_group, policy_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用CTE计算客户年龄组，通过JOIN连接保单和产品表，按年龄组和产品类型分组统计保单数量及平均保费，ORDER BY按年龄组和保单数量排序展示结果。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CONCAT(cag.age_group, &#39;-&#39;, cag.age_group + 9) as age_range 这段代码使用了SQL的 CONCAT 函数来创建一个更具可读性的年龄范围字符串。</span></span></code></pre></div><p>如果你是保险行业的从业人员，这节课将对你非常有帮助。期待你的转发，我们下节课再见！</p>`,47)])])}const m=n(l,[["render",i]]);export{_ as __pageData,m as default};
