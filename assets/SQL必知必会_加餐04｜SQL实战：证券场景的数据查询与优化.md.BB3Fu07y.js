import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"加餐04｜SQL实战：证券场景的数据查询与优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据表","slug":"数据表","link":"#数据表","children":[]},{"level":2,"title":"问题设定","slug":"问题设定","link":"#问题设定","children":[{"level":3,"title":"1. 客户资产分析","slug":"_1-客户资产分析","link":"#_1-客户资产分析","children":[]},{"level":3,"title":"2. 资产配置分析","slug":"_2-资产配置分析","link":"#_2-资产配置分析","children":[]},{"level":3,"title":"3. 风险等级分析","slug":"_3-风险等级分析","link":"#_3-风险等级分析","children":[]},{"level":3,"title":"4. 产品持仓排名","slug":"_4-产品持仓排名","link":"#_4-产品持仓排名","children":[]},{"level":3,"title":"5. 客户资产变动分析","slug":"_5-客户资产变动分析","link":"#_5-客户资产变动分析","children":[]},{"level":3,"title":"6. 产品类型分布","slug":"_6-产品类型分布","link":"#_6-产品类型分布","children":[]}]}],"relativePath":"SQL必知必会/加餐04｜SQL实战：证券场景的数据查询与优化.md","filePath":"SQL必知必会/加餐04｜SQL实战：证券场景的数据查询与优化.md","lastUpdated":1779816304000}'),t={name:"SQL必知必会/加餐04｜SQL实战：证券场景的数据查询与优化.md"};function l(i,s,c,o,_,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="加餐04-sql实战-证券场景的数据查询与优化" tabindex="-1">加餐04｜SQL实战：证券场景的数据查询与优化 <a class="header-anchor" href="#加餐04-sql实战-证券场景的数据查询与优化" aria-label="Permalink to &quot;加餐04｜SQL实战：证券场景的数据查询与优化&quot;">​</a></h1><p>你好，我是陈博士。今天我们来探讨一下客户持仓配置建议业务的SQL分析。</p><p>合理的资产配置，是确保客户投资组合既能满足其财务目标，又能有效管理风险的关键。通过深入的数据查询和分析，我们可以评估客户的当前资产状况、风险承受能力以及投资偏好，从而提供个性化的资产配置建议。</p><p>针对该场景，我整理了2张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。</p><h2 id="数据表" tabindex="-1"><strong>数据表</strong> <a class="header-anchor" href="#数据表" aria-label="Permalink to &quot;**数据表**&quot;">​</a></h2><ul><li>客户持仓表 customer_positions</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838560/6c2c38a25ca4afbd6621579aaf82278e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838560/6c2c38a25ca4afbd6621579aaf82278e.jpg" alt=""></a></p><ul><li>产品配置表 product_configuration</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838560/e4a7269781ec0d2ee0d71420c06701f5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/838560/e4a7269781ec0d2ee0d71420c06701f5.jpg" alt=""></a></p><h2 id="问题设定" tabindex="-1"><strong>问题设定</strong> <a class="header-anchor" href="#问题设定" aria-label="Permalink to &quot;**问题设定**&quot;">​</a></h2><p>我从客户资产分析、资产配置分析、风险等级分析、产品持仓排名等维度设置了一些常见的查询问题，一起来看一下。</p><h3 id="_1-客户资产分析" tabindex="-1"><strong>1. 客户资产分析</strong> <a class="header-anchor" href="#_1-客户资产分析" aria-label="Permalink to &quot;**1\\. 客户资产分析**&quot;">​</a></h3><p>查询指定客户（customer_id = ‘C00001’）在特定日期（2024-12-21）的各类资产（股票、基金、固收、结构性产品、现金）具体金额是多少？总资产是多少？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    customer_id,</span></span>
<span class="line"><span>    customer_name,</span></span>
<span class="line"><span>    SUM(stock_amount) as total_stock,</span></span>
<span class="line"><span>    SUM(fund_amount) as total_fund,</span></span>
<span class="line"><span>    SUM(fixed_income_amount) as total_fixed_income,</span></span>
<span class="line"><span>    SUM(structured_amount) as total_structured,</span></span>
<span class="line"><span>    SUM(cash_amount) as total_cash,</span></span>
<span class="line"><span>    SUM(stock_amount + fund_amount + fixed_income_amount + structured_amount + cash_amount) as total_assets</span></span>
<span class="line"><span>FROM customer_positions FORCE INDEX (idx_customer_id)</span></span>
<span class="line"><span>WHERE customer_id = &#39;C00001&#39;</span></span>
<span class="line"><span>AND position_date = &#39;2024-12-21&#39;</span></span>
<span class="line"><span>GROUP BY customer_id, customer_name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明： 使用 SUM() 聚合函数计算各类资产总金额，并通过 GROUP BY 按客户分组。FORCE INDEX 提示优化查询性能，确保快速定位指定客户和日期的数据。</span></span></code></pre></div><h3 id="_2-资产配置分析" tabindex="-1"><strong>2. 资产配置分析</strong> <a class="header-anchor" href="#_2-资产配置分析" aria-label="Permalink to &quot;**2\\. 资产配置分析**&quot;">​</a></h3><p>在特定日期（2024-12-21），每个客户的股票资产占比、基金资产占、固定收益类占比、结构性产品占比、现金占比是多少？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH customer_total AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        customer_id,</span></span>
<span class="line"><span>        SUM(stock_amount + fund_amount + fixed_income_amount + structured_amount + cash_amount) as total_assets</span></span>
<span class="line"><span>    FROM customer_positions</span></span>
<span class="line"><span>    WHERE position_date = &#39;2024-12-21&#39;</span></span>
<span class="line"><span>    GROUP BY customer_id</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    cp.customer_id,</span></span>
<span class="line"><span>    cp.customer_name,</span></span>
<span class="line"><span>    ROUND(SUM(stock_amount) / ct.total_assets * 100, 2) as stock_ratio,</span></span>
<span class="line"><span>    ROUND(SUM(fund_amount) / ct.total_assets * 100, 2) as fund_ratio,</span></span>
<span class="line"><span>    ROUND(SUM(fixed_income_amount) / ct.total_assets * 100, 2) as fixed_income_ratio,</span></span>
<span class="line"><span>    ROUND(SUM(structured_amount) / ct.total_assets * 100, 2) as structured_ratio,</span></span>
<span class="line"><span>    ROUND(SUM(cash_amount) / ct.total_assets * 100, 2) as cash_ratio</span></span>
<span class="line"><span>FROM customer_positions cp</span></span>
<span class="line"><span>JOIN customer_total ct ON cp.customer_id = ct.customer_id</span></span>
<span class="line"><span>WHERE cp.position_date = &#39;2024-12-21&#39;</span></span>
<span class="line"><span>GROUP BY cp.customer_id, cp.customer_name, ct.total_assets;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用CTE预计算每位客户总资产，再通过JOIN结合明细数据计算各类资产占比。ROUND() 函数确保百分比结果的可读性。</span></span></code></pre></div><h3 id="_3-风险等级分析" tabindex="-1"><strong>3. 风险等级分析</strong> <a class="header-anchor" href="#_3-风险等级分析" aria-label="Permalink to &quot;**3\\. 风险等级分析**&quot;">​</a></h3><p>在特定日期（2024-12-21），按风险等级统计，每个风险等级有多少个客户？每个风险等级的客户平均持有多少股票、基金、固收、结构性产品和现金？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT STRAIGHT_JOIN</span></span>
<span class="line"><span>    risk_level,</span></span>
<span class="line"><span>    COUNT(DISTINCT customer_id) as customer_count,</span></span>
<span class="line"><span>    ROUND(AVG(stock_amount), 2) as avg_stock,</span></span>
<span class="line"><span>    ROUND(AVG(fund_amount), 2) as avg_fund,</span></span>
<span class="line"><span>    ROUND(AVG(fixed_income_amount), 2) as avg_fixed_income,</span></span>
<span class="line"><span>    ROUND(AVG(structured_amount), 2) as avg_structured,</span></span>
<span class="line"><span>    ROUND(AVG(cash_amount), 2) as avg_cash</span></span>
<span class="line"><span>FROM customer_positions FORCE INDEX (idx_position_date)</span></span>
<span class="line"><span>WHERE position_date = &#39;2024-12-21&#39;</span></span>
<span class="line"><span>GROUP BY risk_level</span></span>
<span class="line"><span>ORDER BY risk_level;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 COUNT(DISTINCT) 统计各风险等级客户数量，AVG() 计算各类资产的平均持有量。STRAIGHT_JOIN 提示优化查询路径，确保高效执行。</span></span></code></pre></div><h3 id="_4-产品持仓排名" tabindex="-1"><strong>4. 产品持仓排名</strong> <a class="header-anchor" href="#_4-产品持仓排名" aria-label="Permalink to &quot;**4\\. 产品持仓排名**&quot;">​</a></h3><p>在特定日期（2024-12-21），哪10个产品持有人数最多？这些产品的总持仓金额是多少？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    product_name,</span></span>
<span class="line"><span>    COUNT(DISTINCT customer_id) as holder_count,</span></span>
<span class="line"><span>    SUM(stock_amount + fund_amount + fixed_income_amount + structured_amount + cash_amount) as total_amount</span></span>
<span class="line"><span>FROM customer_positions</span></span>
<span class="line"><span>WHERE position_date = &#39;2024-12-21&#39;</span></span>
<span class="line"><span>AND product_name != &#39;现金&#39;</span></span>
<span class="line"><span>GROUP BY product_name</span></span>
<span class="line"><span>ORDER BY holder_count DESC, total_amount DESC</span></span>
<span class="line"><span>LIMIT 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过 COUNT(DISTINCT) 统计每个产品的持有人数，使用 SUM() 计算总持仓金额。ORDER BY 和 LIMIT 用于筛选出前10个最受欢迎的产品。</span></span></code></pre></div><h3 id="_5-客户资产变动分析" tabindex="-1"><strong>5. 客户资产变动分析</strong> <a class="header-anchor" href="#_5-客户资产变动分析" aria-label="Permalink to &quot;**5\\. 客户资产变动分析**&quot;">​</a></h3><p>每个客户的每日总资产是多少？相比前一日的资产变动额是多少？相比前一日的资产变动百分比是多少？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH daily_assets AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        customer_id,</span></span>
<span class="line"><span>        position_date,</span></span>
<span class="line"><span>        SUM(stock_amount + fund_amount + fixed_income_amount + structured_amount + cash_amount) as total_assets</span></span>
<span class="line"><span>    FROM customer_positions</span></span>
<span class="line"><span>    GROUP BY customer_id, position_date</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    a.customer_id,</span></span>
<span class="line"><span>    a.position_date,</span></span>
<span class="line"><span>    a.total_assets,</span></span>
<span class="line"><span>    a.total_assets - LAG(a.total_assets) OVER (PARTITION BY a.customer_id ORDER BY a.position_date) as daily_change,</span></span>
<span class="line"><span>    ROUND((a.total_assets - LAG(a.total_assets) OVER (PARTITION BY a.customer_id ORDER BY a.position_date)) /</span></span>
<span class="line"><span>          LAG(a.total_assets) OVER (PARTITION BY a.customer_id ORDER BY a.position_date) * 100, 2) as change_percentage</span></span>
<span class="line"><span>FROM daily_assets a</span></span>
<span class="line"><span>ORDER BY a.customer_id, a.position_date;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用CTE计算每日总资产，LAG() 函数获取前一日资产值，进而计算日变动额和变动百分比。PARTITION BY 和 ORDER BY 确保按客户和日期正确排序。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OVER (PARTITION BY ...) 是 SQL 中窗口函数的一部分，用于定义窗口或分区，即数据集的一个子集。它允许我们在不改变行数的情况下对数据进行分组计算，而窗口函数则在这个定义的窗口上执行累积、移动平均等操作。</span></span></code></pre></div><h3 id="_6-产品类型分布" tabindex="-1"><strong>6. 产品类型分布</strong> <a class="header-anchor" href="#_6-产品类型分布" aria-label="Permalink to &quot;**6\\. 产品类型分布**&quot;">​</a></h3><p>在特定日期（2024-12-21），查询不同类型产品的总持仓金额和客户数。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    IFNULL(pc.product_type, &#39;Unknown&#39;) as product_type,</span></span>
<span class="line"><span>    COUNT(DISTINCT cp.customer_id) as customer_count,</span></span>
<span class="line"><span>    SUM(CASE</span></span>
<span class="line"><span>        WHEN pc.product_type = &#39;STOCK&#39; THEN cp.stock_amount</span></span>
<span class="line"><span>        WHEN pc.product_type = &#39;EQUITY&#39; THEN cp.fund_amount</span></span>
<span class="line"><span>        WHEN pc.product_type = &#39;FIXED_INCOME&#39; THEN cp.fixed_income_amount</span></span>
<span class="line"><span>        WHEN pc.product_type = &#39;STRUCTURED&#39; THEN cp.structured_amount</span></span>
<span class="line"><span>        ELSE cp.cash_amount</span></span>
<span class="line"><span>    END) as total_amount</span></span>
<span class="line"><span>FROM customer_positions cp</span></span>
<span class="line"><span>LEFT JOIN product_configuration pc ON cp.product_name = pc.product_name</span></span>
<span class="line"><span>WHERE cp.position_date = &#39;2024-12-21&#39;</span></span>
<span class="line"><span>GROUP BY pc.product_type WITH ROLLUP;  -- 添加汇总行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 LEFT JOIN 关联产品配置表，通过 CASE 语句按产品类型汇总总持仓金额，COUNT(DISTINCT) 统计客户数，GROUP BY ... WITH ROLLUP 提供分类汇总和总计行。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GROUP BY ... WITH ROLLUP 是 SQL 中用于生成分组汇总报表的扩展语法。它在标准 GROUP BY 分组的基础上，为每个分组字段添加了额外的汇总行（即小计和总计），从而提供了更丰富的分析视角。</span></span></code></pre></div><p>如果你是证券行业的从业人员，这节课将对你非常有帮助。期待你的转发，我们下节课再见！</p>`,30)])])}const m=a(t,[["render",l]]);export{d as __pageData,m as default};
