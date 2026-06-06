import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"加餐02｜SQL实战：银行场景的数据查询与优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据表","slug":"数据表","link":"#数据表","children":[]},{"level":2,"title":"","slug":"","link":"#","children":[]},{"level":2,"title":"问题设定","slug":"问题设定","link":"#问题设定","children":[{"level":3,"title":"客户信息查询","slug":"客户信息查询","link":"#客户信息查询","children":[]},{"level":3,"title":"产品信息查询","slug":"产品信息查询","link":"#产品信息查询","children":[]},{"level":3,"title":"贷款信息查询","slug":"贷款信息查询","link":"#贷款信息查询","children":[]},{"level":3,"title":"综合查询","slug":"综合查询","link":"#综合查询","children":[]},{"level":3,"title":"聚合查询","slug":"聚合查询","link":"#聚合查询","children":[]}]}],"relativePath":"SQL必知必会/加餐02｜SQL实战：银行场景的数据查询与优化.md","filePath":"SQL必知必会/加餐02｜SQL实战：银行场景的数据查询与优化.md","lastUpdated":1779816304000}'),l={name:"SQL必知必会/加餐02｜SQL实战：银行场景的数据查询与优化.md"};function i(t,a,c,o,d,r){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="加餐02-sql实战-银行场景的数据查询与优化" tabindex="-1">加餐02｜SQL实战：银行场景的数据查询与优化 <a class="header-anchor" href="#加餐02-sql实战-银行场景的数据查询与优化" aria-label="Permalink to &quot;加餐02｜SQL实战：银行场景的数据查询与优化&quot;">​</a></h1><p>你好，我是陈博士。今天我们来看下银行贷款业务的数据查询与优化。</p><p>贷款业务是银行的重要工作之一。通过数据查询，可以了解客户的信用风险，对后续审批贷款进行决策。同时在日常运营中，也需要做各种数据报表和统计，以便了解不同时期、不同类型用户、不同产品的经营业绩和风险情况。</p><p>针对该场景，我整理了3张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。</p><h2 id="数据表" tabindex="-1">数据表 <a class="header-anchor" href="#数据表" aria-label="Permalink to &quot;数据表&quot;">​</a></h2><ul><li>客户信息表 customer</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/837307/651aec6416d34f6fe7f2e1efaf7d098b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/837307/651aec6416d34f6fe7f2e1efaf7d098b.jpg" alt="图片"></a></p><ul><li>产品信息表 product</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/837307/acb459a209237a10b3fdf2833e411e96.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/837307/acb459a209237a10b3fdf2833e411e96.jpg" alt="图片"></a></p><ul><li>贷款信息表 loan</li></ul><h2 id="" tabindex="-1"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/837307/4c8f64b404c5c12b35d1f5b68becb68c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/837307/4c8f64b404c5c12b35d1f5b68becb68c.jpg" alt="图片"></a> <a class="header-anchor" href="#" aria-label="Permalink to &quot;![图片](images/837307/4c8f64b404c5c12b35d1f5b68becb68c.jpg)&quot;">​</a></h2><h2 id="问题设定" tabindex="-1">问题设定 <a class="header-anchor" href="#问题设定" aria-label="Permalink to &quot;问题设定&quot;">​</a></h2><p>我从客户信息查询、产品信息查询、贷款信息查询、综合查询、聚合查询等维度，设置了一些常见的查询问题。我们一起来看一下。</p><h3 id="客户信息查询" tabindex="-1"><strong>客户信息查询</strong> <a class="header-anchor" href="#客户信息查询" aria-label="Permalink to &quot;**客户信息查询**&quot;">​</a></h3><p>查询身份号为 478116535425961877 的用户贷款的情况。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT c.name, c.id_number, l.loan_type, l.loan_amount, l.loan_term, l.loan_issue_date, l.loan_status</span></span>
<span class="line"><span>FROM customer c</span></span>
<span class="line"><span>JOIN loan l ON c.customer_id = l.customer_id</span></span>
<span class="line"><span>WHERE c.id_number = &#39;478116535425961877&#39;;</span></span></code></pre></div><p>说明：使用JOIN连接customer和loan表，通过ON指定连接条件，WHERE子句筛选特定身份证号的用户贷款信息。</p><p>查询信用评分在 [600-700] 之间，贷款总额最多的TOP10用户。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT c.customer_id,</span></span>
<span class="line"><span>       c.name,</span></span>
<span class="line"><span>       c.credit_score,</span></span>
<span class="line"><span>       SUM(l.loan_amount) AS total_loan_amount</span></span>
<span class="line"><span>FROM customer c</span></span>
<span class="line"><span>JOIN loan l ON c.customer_id = l.customer_id</span></span>
<span class="line"><span>WHERE c.credit_score BETWEEN 600 AND 700</span></span>
<span class="line"><span>GROUP BY c.customer_id</span></span>
<span class="line"><span>ORDER BY total_loan_amount DESC</span></span>
<span class="line"><span>LIMIT 10;</span></span></code></pre></div><p>说明：这里BETWEEN是包括边界的。也就是说，BETWEEN 600 AND 700，会包括边界值 600 和 700。</p><h3 id="产品信息查询" tabindex="-1"><strong>产品信息查询</strong> <a class="header-anchor" href="#产品信息查询" aria-label="Permalink to &quot;**产品信息查询**&quot;">​</a></h3><p>查询所有消费贷产品的名称。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT product_name</span></span>
<span class="line"><span>FROM product</span></span>
<span class="line"><span>WHERE product_category = &#39;消费贷&#39;</span></span></code></pre></div><p>按产品类别统计各类贷款产品的数量。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT product_category, COUNT(*) AS product_count</span></span>
<span class="line"><span>FROM product</span></span>
<span class="line"><span>GROUP BY product_category</span></span></code></pre></div><p>说明：使用GROUP BY按产品类别分组，COUNT(*) 统计每组的贷款产品数量，从而得出各类贷款产品的总数。</p><h3 id="贷款信息查询" tabindex="-1"><strong>贷款信息查询</strong> <a class="header-anchor" href="#贷款信息查询" aria-label="Permalink to &quot;**贷款信息查询**&quot;">​</a></h3><p>查询2024年之前尚未结清的房贷产品A的贷款。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT l.loan_id,</span></span>
<span class="line"><span>       l.customer_id,</span></span>
<span class="line"><span>       l.loan_amount,</span></span>
<span class="line"><span>       l.loan_term,</span></span>
<span class="line"><span>       l.loan_issue_date,</span></span>
<span class="line"><span>       l.loan_application_date,</span></span>
<span class="line"><span>       l.loan_status,</span></span>
<span class="line"><span>       l.loan_channel,</span></span>
<span class="line"><span>       l.interest_rate,</span></span>
<span class="line"><span>       l.loan_balance</span></span>
<span class="line"><span>FROM loan l</span></span>
<span class="line"><span>JOIN product p ON l.product_id = p.product_id</span></span>
<span class="line"><span>WHERE p.product_name = &#39;房贷产品A&#39;</span></span>
<span class="line"><span>  AND l.loan_status != &#39;已结清&#39;</span></span>
<span class="line"><span>  AND YEAR(l.loan_application_date) &amp;lt; 2024</span></span></code></pre></div><p>说明：YEAR() 是一个SQL函数，用于从日期中提取年份。</p><p>查询在2024-05-01到2024-05-07之间内申请的贷款。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT loan_id,</span></span>
<span class="line"><span>       customer_id,</span></span>
<span class="line"><span>       product_id,</span></span>
<span class="line"><span>       loan_amount,</span></span>
<span class="line"><span>       loan_term,</span></span>
<span class="line"><span>       loan_application_date,</span></span>
<span class="line"><span>       loan_status</span></span>
<span class="line"><span>FROM loan</span></span>
<span class="line"><span>WHERE loan_application_date BETWEEN &#39;2024-05-01&#39; AND &#39;2024-05-07&#39;</span></span></code></pre></div><p>说明：这里的 BETWEEN 也是包含 2024-05-01 和 2024-05-07 的日期的。</p><h3 id="综合查询" tabindex="-1"><strong>综合查询</strong> <a class="header-anchor" href="#综合查询" aria-label="Permalink to &quot;**综合查询**&quot;">​</a></h3><p>查询每个贷款产品的平均放款利率。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT p.product_name,</span></span>
<span class="line"><span>       AVG(l.interest_rate) AS avg_interest_rate</span></span>
<span class="line"><span>FROM loan l</span></span>
<span class="line"><span>JOIN product p ON l.product_id = p.product_id</span></span>
<span class="line"><span>GROUP BY p.product_name</span></span></code></pre></div><p>说明：在使用GROUP BY进行分组操作的时候，我们可以使用 AVG计算每组贷款产品的平均放款利率。</p><p>统计不同就业状态下客户的贷款情况。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT c.employment_status,</span></span>
<span class="line"><span>       COUNT(l.loan_id) AS total_loans,</span></span>
<span class="line"><span>       SUM(l.loan_amount) AS total_loan_amount,</span></span>
<span class="line"><span>       AVG(l.loan_amount) AS avg_loan_amount</span></span>
<span class="line"><span>FROM customer c</span></span>
<span class="line"><span>JOIN loan l ON c.customer_id = l.customer_id</span></span>
<span class="line"><span>GROUP BY c.employment_status</span></span></code></pre></div><p>说明：通过JOIN连接customer和loan表，GROUP BY按就业状态分组，使用聚合函数COUNT、SUM和AVG分别统计贷款数量、总额和平均金额。</p><p>查询贷款余额超过10万、且信用评分低于600、且最近3个月有借款记录的客户列表。</p><p>说明：DATE_SUB() 是日期计算的SQL函数，它从给定的日期中减去指定的时间间隔。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT c.customer_id,</span></span>
<span class="line"><span>       c.name,</span></span>
<span class="line"><span>       c.credit_score,</span></span>
<span class="line"><span>       l.loan_balance,</span></span>
<span class="line"><span>       l.loan_application_date</span></span>
<span class="line"><span>FROM customer c</span></span>
<span class="line"><span>JOIN loan l ON c.customer_id = l.customer_id</span></span>
<span class="line"><span>WHERE l.loan_balance &amp;gt; 100000</span></span>
<span class="line"><span>      AND c.credit_score &amp;lt; 600</span></span>
<span class="line"><span>      AND l.loan_application_date &amp;gt;= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)</span></span></code></pre></div><p>函数有两个参数：第一个是日期表达式，第二个是表示时间间隔的INTERVAL表达式。</p><h3 id="聚合查询" tabindex="-1"><strong>聚合查询</strong> <a class="header-anchor" href="#聚合查询" aria-label="Permalink to &quot;**聚合查询**&quot;">​</a></h3><p>统计2024年每月贷款发放量及总金额。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT MONTH(loan_issue_date) AS loan_month,</span></span>
<span class="line"><span>       COUNT(loan_id) AS total_loans,</span></span>
<span class="line"><span>       SUM(loan_amount) AS total_loan_amount</span></span>
<span class="line"><span>FROM loan</span></span>
<span class="line"><span>WHERE YEAR(loan_issue_date) = 2024</span></span>
<span class="line"><span>GROUP BY MONTH(loan_issue_date)</span></span>
<span class="line"><span>ORDER BY loan_month</span></span></code></pre></div><p>说明：使用WHERE筛选2024年的贷款记录，GROUP BY按月份分组，COUNT和SUM分别统计每月贷款数量和总金额，ORDER BY按月份排序。</p><p>分析不同信用评分段客户的平均月收入。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>  CASE</span></span>
<span class="line"><span>    WHEN credit_score BETWEEN 300 AND 399 THEN &#39;300-399&#39;</span></span>
<span class="line"><span>    WHEN credit_score BETWEEN 400 AND 499 THEN &#39;400-499&#39;</span></span>
<span class="line"><span>    WHEN credit_score BETWEEN 500 AND 599 THEN &#39;500-599&#39;</span></span>
<span class="line"><span>    WHEN credit_score BETWEEN 600 AND 699 THEN &#39;600-699&#39;</span></span>
<span class="line"><span>    WHEN credit_score BETWEEN 700 AND 799 THEN &#39;700-799&#39;</span></span>
<span class="line"><span>    WHEN credit_score BETWEEN 800 AND 899 THEN &#39;800-899&#39;</span></span>
<span class="line"><span>    WHEN credit_score &amp;gt;= 900 THEN &#39;900+&#39;</span></span>
<span class="line"><span>  END AS credit_score_range,</span></span>
<span class="line"><span>  AVG(income) AS average_income</span></span>
<span class="line"><span>FROM customer</span></span>
<span class="line"><span>GROUP BY credit_score_range</span></span>
<span class="line"><span>ORDER BY credit_score_range</span></span></code></pre></div><p>说明：CASE 表达式在SQL中用于实现条件逻辑，类似于编程语言中的 if-else 或 switch-case 语句。它允许你在查询中执行复杂的逻辑判断，并基于这些判断返回不同的值。</p><p>CASE 表达式有两种形式：简单 CASE 和搜索 CASE。</p><p>在这个查询中使用的是搜索 CASE，它可以根据一个或多个布尔表达式的真假来决定返回哪个结果，即：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CASE</span></span>
<span class="line"><span>    WHEN condition1 THEN result1</span></span>
<span class="line"><span>    WHEN condition2 THEN result2</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ELSE else_result</span></span>
<span class="line"><span>END</span></span></code></pre></div><p>分析贷款期限与还款表现之间的关系。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>  loan_term,</span></span>
<span class="line"><span>  COUNT(loan_id) AS total_loans,</span></span>
<span class="line"><span>  SUM(CASE WHEN loan_status = &#39;已结清&#39; THEN 1 ELSE 0 END) AS loans_paid_off,</span></span>
<span class="line"><span>  SUM(CASE WHEN loan_status IN (&#39;申请中&#39;, &#39;已放款&#39;) THEN 1 ELSE 0 END) AS loans_active,</span></span>
<span class="line"><span>  ROUND(SUM(CASE WHEN loan_status = &#39;已结清&#39; THEN 1 ELSE 0 END) / COUNT(loan_id) * 100, 2) AS percentage_paid_off,</span></span>
<span class="line"><span>  ROUND(SUM(CASE WHEN loan_status IN (&#39;申请中&#39;, &#39;已放款&#39;) THEN 1 ELSE 0 END) / COUNT(loan_id) * 100, 2) AS percentage_active</span></span>
<span class="line"><span>FROM loan</span></span>
<span class="line"><span>GROUP BY loan_term</span></span>
<span class="line"><span>ORDER BY loan_term;</span></span></code></pre></div><p>说明：SUM 和 CASE 联合使用是一种非常强大的SQL技巧，它允许你根据特定条件对数据进行有条件的聚合。这种组合通常用于在同一个查询中创建多个聚合统计，如计数、求和等，并且可以根据不同的逻辑来定制这些统计。</p><p>SUM 和 CASE 联合使用的语法：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SUM(CASE WHEN condition THEN value ELSE 0 END)</span></span></code></pre></div><p>在这个查询中：</p><ul><li><p>贷款总数： <code>COUNT(loan_id)</code> 统计每个贷款期限内的总贷款数量。</p></li><li><p>已结清贷款数量： <code>SUM(CASE WHEN loan_status = &#39;已结清&#39; THEN 1 ELSE 0 END)</code> 对于状态为“已结清”的每条记录，返回1，然后对这些1求和，得到该贷款期限内已结清的贷款数量。</p></li><li><p>活跃贷款数量： <code>SUM(CASE WHEN loan_status IN (&#39;申请中&#39;, &#39;已放款&#39;) THEN 1 ELSE 0 END)</code> 对于状态为“申请中”或“已放款”的每条记录，返回1，然后对这些1求和，得到该贷款期限内活跃的贷款数量。</p></li><li><p>计算百分比：使用类似的 SUM 和 CASE 结构，来计算已结清贷款和活跃贷款的比例，并用 <code>ROUND()</code> 函数保留两位小数。</p></li></ul><p>这段SQL查询，按照贷款期限进行分组，统计了不同贷款期限下的主要特征，包括：贷款总数、已结清贷款数量、活跃贷款数量、计算百分比（已结清贷款百分比、活跃贷款百分比）。这样更方便观察不同贷款期限下的比例关系，更好地进行趋势识别和风险评估。</p><p>如果你是金融行业的从业人员，这节课将对你非常有帮助。期待你的转发，我们下节课再见！</p>`,63)])])}const h=s(l,[["render",i]]);export{E as __pageData,h as default};
