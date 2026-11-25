import{_ as n,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"30 | 业务场景定制开发实战：从需求到落地的完整开发流程","description":"","frontmatter":{},"headers":[{"level":2,"title":"需求分析：“智能运营助手”的技术拆解","slug":"需求分析-智能运营助手-的技术拆解","link":"#需求分析-智能运营助手-的技术拆解","children":[]},{"level":2,"title":"技术方案选型","slug":"技术方案选型","link":"#技术方案选型","children":[]},{"level":2,"title":"模块实现：Skill、Plugin、配置实战","slug":"模块实现-skill、plugin、配置实战","link":"#模块实现-skill、plugin、配置实战","children":[{"level":3,"title":"销售趋势分析","slug":"销售趋势分析","link":"#销售趋势分析","children":[]},{"level":3,"title":"热销商品排行","slug":"热销商品排行","link":"#热销商品排行","children":[]}]},{"level":2,"title":"Output Format","slug":"output-format","link":"#output-format","children":[]},{"level":2,"title":"集成测试与优化","slug":"集成测试与优化","link":"#集成测试与优化","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"OpenClaw核心原理与实战/30｜业务场景定制开发实战：从需求到落地的完整开发流程.md","filePath":"OpenClaw核心原理与实战/30｜业务场景定制开发实战：从需求到落地的完整开发流程.md","lastUpdated":1795533128000}'),e={name:"OpenClaw核心原理与实战/30｜业务场景定制开发实战：从需求到落地的完整开发流程.md"};function l(t,s,o,c,r,h){return a(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_30-业务场景定制开发实战-从需求到落地的完整开发流程" tabindex="-1">30 | 业务场景定制开发实战：从需求到落地的完整开发流程 <a class="header-anchor" href="#_30-业务场景定制开发实战-从需求到落地的完整开发流程" aria-label="Permalink to &quot;30 | 业务场景定制开发实战：从需求到落地的完整开发流程&quot;">​</a></h1><p>你好，我是 Henry，欢迎来到《OpenClaw 核心原理与实战》。</p><p>前面我们分别学会了两种扩展方式：Skill 和 Plugin，具备了 OpenClaw 扩展开发的两把武器。但在真实工作中，你面对的需求不是“写一个 Skill”或者“写一个 Plugin”这样的技术任务，而是像这样的需求：</p><ul><li>“我们需要一个智能运营助手，能帮团队自动拉取每日销售数据、监控竞品价格、推荐促销策略、自动回复客户常见问题。”</li></ul><p>作为开发者，你需要把它拆解成技术方案，然后用合适的工具来实现。今天我们这节的核心是从业务需求到技术落地的完整流程，怎么选择技术方案，怎么让 Skill、Plugin 和配置协同工作，教你上手做项目。</p><p>下面我们针对智能运营助手案例进行展开，首先我们讲解怎么分析需求。</p><h2 id="需求分析-智能运营助手-的技术拆解" tabindex="-1">需求分析：“智能运营助手”的技术拆解 <a class="header-anchor" href="#需求分析-智能运营助手-的技术拆解" aria-label="Permalink to &quot;需求分析：“智能运营助手”的技术拆解&quot;">​</a></h2><p>让我们把需求具体化，某电商团队需要一个运营助手，具备以下四项核心能力：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/1.png" alt=""></a></p><h2 id="技术方案选型" tabindex="-1">技术方案选型 <a class="header-anchor" href="#技术方案选型" aria-label="Permalink to &quot;技术方案选型&quot;">​</a></h2><p>明确了需求，我们需要基于需求进行技术方案选型，我们需要考虑一个核心问题：用 Skill、Plugin 还是纯配置来实现？选型的依据是什么？我们学过的三种工具的能力边界：</p><ul><li><p>Skill：适合“行为指引”，告诉 Agent 遇到什么场景该怎么做、该执行什么命令</p></li><li><p>Plugin：适合“能力注册”，注册新工具、接入 Hook、启动后台服务</p></li><li><p>配置：适合“架构编排”，多 Agent 定义、路由规则、权限策略、会话隔离</p></li></ul><p>根据我们学过的能力边界，我们设计四项需求的技术映射如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/2.png" alt=""></a></p><p>架构设计图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/3.png" alt=""></a></p><p>下面开始按模块逐个实现。</p><h2 id="模块实现-skill、plugin、配置实战" tabindex="-1">模块实现：Skill、Plugin、配置实战 <a class="header-anchor" href="#模块实现-skill、plugin、配置实战" aria-label="Permalink to &quot;模块实现：Skill、Plugin、配置实战&quot;">​</a></h2><p>我们首先实现 Skill 部分，再实现 Plugin 核心能力，最后实现架构编排配置。</p><p>模块一：销售数据分析 Skill</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">name:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sales-analyzer</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">description:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;电商销售数据分析&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">metadata:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> openclaw:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   emoji:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   requires:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     bins:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;python3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;curl&quot;]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     env:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;SHOP_API_KEY&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;SHOP_API_URL&quot;]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 销售数据分析</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## When to Use</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户需要查看每日/每周/每月销售报告</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户询问某个品类的销售趋势</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户需要对比不同时间段的销售数据</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## Commands</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">### 每日报告生成</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`\`\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bash</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> scripts/daily_report.py </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">--date</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;{date}&quot; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">--api-key</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SHOP_API_KEY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot;</span></span></code></pre></div><h3 id="销售趋势分析" tabindex="-1">销售趋势分析 <a class="header-anchor" href="#销售趋势分析" aria-label="Permalink to &quot;销售趋势分析&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> scripts/trend_analysis.py</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --days</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {n}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --category</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;{category}&quot;</span></span></code></pre></div><h3 id="热销商品排行" tabindex="-1">热销商品排行 <a class="header-anchor" href="#热销商品排行" aria-label="Permalink to &quot;热销商品排行&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SHOP_API_URL</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}/top-products?period={period}&amp;limit=10&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Authorization: Bearer \${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SHOP_API_KEY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot;</span></span></code></pre></div><h2 id="output-format" tabindex="-1">Output Format <a class="header-anchor" href="#output-format" aria-label="Permalink to &quot;Output Format&quot;">​</a></h2><ul><li>用表格展示关键指标（GMV、订单量、客单价、转化率）</li><li>同比/环比用 📈📉 标注涨跌</li><li>结尾附简要分析和建议</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>核心包含三个部分：</span></span></code></pre></div><p>门控声明了 bins: [&quot;python3&quot;, &quot;curl&quot;] 和 env: [&quot;SHOP_API_KEY&quot;]：只有在这</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 些依赖都满足的环境中，Skill 才会被加载。避免在没有数据分析能力的环境中误加载。</span></span></code></pre></div><p>脚本使用相对路径 scripts/：在实际部署中需要替换为绝对路径。这里用相对路径是为</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 了示例清晰，真实使用时务必用绝对路径。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. Output Format 部分：告诉 LLM 怎么组织输出格式。这部分只在分析场景下有用，不需要</span></span></code></pre></div><p>在所有对话中占用上下文，比在 Agent 的 instructions 里写要好。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>模块二：竞品监控 Plugin</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这是整个项目中最复杂的模块，它需要注册工具和启动后台服务。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>import { definePluginEntry } from &quot;openclaw/plugin-sdk/core&quot;;</span></span>
<span class="line"><span>export default definePluginEntry({</span></span>
<span class="line"><span> id: &quot;competitor-monitor&quot;,</span></span>
<span class="line"><span> name: &quot;Competitor Price Monitor&quot;,</span></span>
<span class="line"><span> register(api) {</span></span>
<span class="line"><span>   // 1. 注册竞品查询工具</span></span>
<span class="line"><span>   api.registerTool(</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>       name: &quot;check_competitor_price&quot;,</span></span>
<span class="line"><span>       description: &quot;查询竞品价格并与我方对比&quot;,</span></span>
<span class="line"><span>       inputSchema: {</span></span>
<span class="line"><span>         type: &quot;object&quot;,</span></span>
<span class="line"><span>         properties: {</span></span>
<span class="line"><span>           product: {</span></span>
<span class="line"><span>             type: &quot;string&quot;,</span></span>
<span class="line"><span>             description: &quot;商品名称或SKU&quot;</span></span>
<span class="line"><span>           },</span></span>
<span class="line"><span>           competitors: {</span></span>
<span class="line"><span>             type: &quot;array&quot;,</span></span>
<span class="line"><span>             items: { type: &quot;string&quot; },</span></span>
<span class="line"><span>             description: &quot;竞品平台列表（如 jd, taobao, pdd）&quot;</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>         },</span></span>
<span class="line"><span>         required: [&quot;product&quot;]</span></span>
<span class="line"><span>       },</span></span>
<span class="line"><span>       async execute(params) {</span></span>
<span class="line"><span>         const { product, competitors } = params;</span></span>
<span class="line"><span>         const results = await fetchCompetitorPrices(</span></span>
<span class="line"><span>           product,</span></span>
<span class="line"><span>           competitors || [&quot;jd&quot;, &quot;taobao&quot;, &quot;pdd&quot;]</span></span>
<span class="line"><span>         );</span></span>
<span class="line"><span>         return {</span></span>
<span class="line"><span>           type: &quot;text&quot;,</span></span>
<span class="line"><span>           text: formatPriceComparison(results)</span></span>
<span class="line"><span>         };</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     },</span></span>
<span class="line"><span>     { names: [&quot;check_competitor_price&quot;] }</span></span>
<span class="line"><span>   );</span></span>
<span class="line"><span>   // 2. 注册后台定时检查服务</span></span>
<span class="line"><span>   api.registerService({</span></span>
<span class="line"><span>     id: &quot;price-alert&quot;,</span></span>
<span class="line"><span>     async start() {</span></span>
<span class="line"><span>       console.log(&quot;竞品价格监控服务已启动&quot;);</span></span>
<span class="line"><span>       // 每 6 小时检查一次竞品价格变动</span></span>
<span class="line"><span>       setInterval(async () =&gt; {</span></span>
<span class="line"><span>         try {</span></span>
<span class="line"><span>           const alerts = await checkPriceChanges();</span></span>
<span class="line"><span>           if (alerts.length &gt; 0) {</span></span>
<span class="line"><span>             // 通过消息通知运营团队</span></span>
<span class="line"><span>             await notifyOperator(alerts);</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>         } catch (error) {</span></span>
<span class="line"><span>           console.error(&quot;价格检查失败:&quot;, error);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>       }, 6 * 60 * 60 * 1000);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   });</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>// === 辅助函数 ===</span></span>
<span class="line"><span>async function fetchCompetitorPrices(</span></span>
<span class="line"><span> product: string,</span></span>
<span class="line"><span> competitors: string[]</span></span>
<span class="line"><span>) {</span></span>
<span class="line"><span> // 调用竞品价格 API</span></span>
<span class="line"><span> const results = [];</span></span>
<span class="line"><span> for (const comp of competitors) {</span></span>
<span class="line"><span>   const resp = await fetch(</span></span>
<span class="line"><span>     \`\${process.env.COMPETITOR_API_URL}/price?product=\${encodeURIComponent(produ</span></span>
<span class="line"><span>     { headers: { Authorization: \`Bearer \${process.env.COMPETITOR_API_KEY}\` } }</span></span>
<span class="line"><span>   );</span></span>
<span class="line"><span>   if (resp.ok) {</span></span>
<span class="line"><span>     results.push(await resp.json());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return results;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function formatPriceComparison(results: any[]): string {</span></span>
<span class="line"><span> if (results.length === 0) return &quot;未找到竞品价格数据&quot;;</span></span>
<span class="line"><span> let output = &quot; 竞品价格对比：\\n\\n&quot;;</span></span>
<span class="line"><span> output += &quot;| 平台 | 价格 | 与我方差价 |\\n&quot;;</span></span>
<span class="line"><span> output += &quot;|:---|:---|:---|\\n&quot;;</span></span>
<span class="line"><span> for (const r of results) {</span></span>
<span class="line"><span>   const diff = r.price - r.ourPrice;</span></span>
<span class="line"><span>   const arrow = diff &gt; 0 ? &quot;📈 高&quot; : diff &lt; 0 ? &quot;📉 低&quot; : &quot;➡️ 持平&quot;;</span></span>
<span class="line"><span>   output += \`| \${r.platform} | ¥\${r.price} | \${arrow} ¥\${Math.abs(diff)} |\\n\`;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return output;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>async function checkPriceChanges() {</span></span>
<span class="line"><span> // 查询所有监控商品的价格变动</span></span>
<span class="line"><span> const resp = await fetch(</span></span>
<span class="line"><span>   \`\${process.env.COMPETITOR_API_URL}/alerts\`,</span></span>
<span class="line"><span>   { headers: { Authorization: \`Bearer \${process.env.COMPETITOR_API_KEY}\` } }</span></span>
<span class="line"><span> );</span></span>
<span class="line"><span> return resp.ok ? await resp.json() : [];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>async function notifyOperator(alerts: any[]) {</span></span>
<span class="line"><span> // 通过 OpenClaw 的消息系统通知运营</span></span>
<span class="line"><span> console.log(\`发现 \${alerts.length} 个价格异动！\`);</span></span>
<span class="line"><span> // 实际实现中通过 OpenClaw 消息 API 发送通知</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>核心包含三个部分：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>registerTool 用于手动查询：运营人员可以随时通过对话让 Agent 查询竞品价格。</span></span>
<span class="line"><span>registerService 用于自动监控：后台服务每 6 小时自动检查一次，发现异常主动通知</span></span></code></pre></div><ul><li>而非被动等待，这正是 Plugin 相比 Skill 的优势。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>服务注册在 register 阶段而非 activate 阶段：后台服务的启动不依赖其他 Plugin 的</span></span>
<span class="line"><span>注册完成，用 register 阶段即可。如果服务启动时需要查询“系统中有没有 memory-core</span></span>
<span class="line"><span>工具”，则应放在 activate 阶段。</span></span></code></pre></div><p>模块三：多 Agent 配置编排</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>通过 openclaw.yaml 定义 Agent、绑定通道、配置权限，把所有模块串起来。</span></span>
<span class="line"><span># openclaw.yaml — 智能运营助手</span></span>
<span class="line"><span>providers:</span></span>
<span class="line"><span> default: openai</span></span>
<span class="line"><span> openai:</span></span>
<span class="line"><span>   apiKey: &quot;\${OPENAI_API_KEY}&quot;</span></span>
<span class="line"><span>agents:</span></span>
<span class="line"><span> list:</span></span>
<span class="line"><span>   # Agent 1: 数据分析师 — 处理数据分析和竞品监控</span></span>
<span class="line"><span>   - id: analyst</span></span>
<span class="line"><span>     model: claude-sonnet-4-20250514</span></span>
<span class="line"><span>     identity:</span></span>
<span class="line"><span>       name: &quot;数据分析师小A&quot;</span></span>
<span class="line"><span>       instructions: |</span></span>
<span class="line"><span>         你是一位电商数据分析专家。你的职责包括：</span></span>
<span class="line"><span>         1. 根据销售数据生成分析报告</span></span>
<span class="line"><span>         2. 监控竞品价格并给出应对建议</span></span>
<span class="line"><span>         3. 基于历史数据推荐促销策略</span></span>
<span class="line"><span>         回复风格：专业但不晦涩，用数据说话，给出可执行的建议。</span></span>
<span class="line"><span>     subagents:</span></span>
<span class="line"><span>       allowAgents: [&quot;reporter&quot;]  # 可生成报告子 Agent</span></span>
<span class="line"><span>     tools:</span></span>
<span class="line"><span>       allow: [&quot;*&quot;]</span></span>
<span class="line"><span>   # Agent 2: 客服小助 — 自动回复客户常见问题</span></span>
<span class="line"><span>   - id: customer-bot</span></span>
<span class="line"><span>     model: deepseek-chat       # 客服用更经济的模型</span></span>
<span class="line"><span>     identity:</span></span>
<span class="line"><span>       name: &quot;客服小助&quot;</span></span>
<span class="line"><span>       instructions: |</span></span>
<span class="line"><span>         你是一位友好的电商客服。回答客户关于订单、退换货、物流的常见问题。</span></span>
<span class="line"><span>         如果遇到无法处理的复杂问题，告知客户将转接人工客服。</span></span>
<span class="line"><span>     tools:</span></span>
<span class="line"><span>       allow:</span></span>
<span class="line"><span>         - web_search</span></span>
<span class="line"><span>         - memory_search</span></span>
<span class="line"><span>         - message</span></span>
<span class="line"><span>       deny:</span></span>
<span class="line"><span>         - exec               # 客服 Agent 绝对禁止执行命令</span></span>
<span class="line"><span>         - write              # 禁止写文件</span></span>
<span class="line"><span>         - sessions_spawn     # 禁止创建子 Agent</span></span>
<span class="line"><span># 路由绑定 — 不同通道绑定不同 Agent</span></span>
<span class="line"><span>bindings:</span></span>
<span class="line"><span> - agentId: analyst</span></span>
<span class="line"><span>   match:</span></span>
<span class="line"><span>     channel: telegram</span></span>
<span class="line"><span>     peer:</span></span>
<span class="line"><span>       kind: group</span></span>
<span class="line"><span>       id: &quot;ops_group&quot;        # 运营团队 Telegram 群</span></span>
<span class="line"><span> - agentId: customer-bot</span></span>
<span class="line"><span>   match:</span></span>
<span class="line"><span>     channel: feishu            # 飞书客服通道</span></span>
<span class="line"><span># 工具全局策略</span></span>
<span class="line"><span>tools:</span></span>
<span class="line"><span> profile: &quot;coding&quot;</span></span>
<span class="line"><span> deny: [&quot;group:automation&quot;]     # 全局禁止 cron/gateway</span></span></code></pre></div><p>两个 Agent 的职责完全不同，所以配置策略也截然不同：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/4.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Agents 的路由绑定匹配规则包含 agentId、channel、peer 三个维度，这里的设计是运营</span></span></code></pre></div><p>团队在 Telegram 群里的消息 → 路由到 analyst，飞书通道的所有消息 → 路由到 customer-bot。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>权限配置方面，客服 Agent 的 deny 列表体现了一个核心原则：deny 优先于 allow，每层只</span></span>
<span class="line"><span>能收紧不能放宽。即使全局 Profile 包含了 exec，customer-bot 的 Agent 级 deny 也会把</span></span></code></pre></div><p>它过滤掉。这确保了即使客服 Agent 被 Prompt Injection，也无法执行任何命令。</p><h2 id="集成测试与优化" tabindex="-1">集成测试与优化 <a class="header-anchor" href="#集成测试与优化" aria-label="Permalink to &quot;集成测试与优化&quot;">​</a></h2><p>所有模块实现完成后，我们进入测试验收阶段，逐项验证可以遵照如下流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/5.png" alt=""></a></p><p>在实际运行中，Token 成本可能是最大的运营开销，以下是两个实用的优化策略。</p><p>策略一：模型分级</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>agents:</span></span>
<span class="line"><span> list:</span></span>
<span class="line"><span>   - id: analyst</span></span>
<span class="line"><span>     model:</span></span>
<span class="line"><span>       primary: claude-sonnet-4-20250514     # 主力模型</span></span>
<span class="line"><span>       fallbacks: [deepseek-chat]         # 降级备选</span></span></code></pre></div><p>七重容错策略，模型 fallback 是关键一环。当主力模型不可用或响应过慢时，自动降级到备选模型。既保障了可用性，也为高峰期提供了成本缓冲。</p><p>策略二：精简 Skill 内容</p><p>每个加载的 Skill 都会占用 System Prompt 的空间，如果分析师 Agent 加载了 20 个 Skill 但只</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">常用 5 个，剩下 15 个就是浪费的上下文空间。可以通过配置 config.skills.entries.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​name&gt;.enabled: false 禁用不需要的 Skill。</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>经过今天的实战，从示例到业务我们可以提炼出一个通用的决策框架：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/6.png" alt=""></a></p><p>贯穿全文核心知识点如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/OpenClaw%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AE%9E%E6%88%98/images/30/7.png" alt=""></a></p><p>Skill、Plugin、配置编排三者协作。Skill 做前端，Plugin 做后端，Skill 提供面向 LLM 的行为指引，Plugin 提供底层能力；配置做架构，代码做实现，用 YAML 编排 Agent 和路由，用代码实现具体逻辑；先 Skill 后 Plugin，能用 Skill 解决的不要用 Plugin，降低复杂度。通过本节课，你现在能做到：</p><ul><li><p>面对业务需求做出合理的技术拆解</p></li><li><p>综合运用 Skill + Plugin + 配置完成项目</p></li><li><p>为不同角色的 Agent 配置差异化策略</p></li><li><p>进行集成测试和成本优化</p></li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>针对你的实际业务场景，设计并实现一个包含至少 1 个 Skill + 1 个 Plugin 的定制方案。要求：提交技术方案设计文档（需求拆解 + 选型理由）和完整配置文件。</p><p>欢迎你在留言区与我交流！如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,66)])])}const d=n(e,[["render",l]]);export{g as __pageData,d as default};
