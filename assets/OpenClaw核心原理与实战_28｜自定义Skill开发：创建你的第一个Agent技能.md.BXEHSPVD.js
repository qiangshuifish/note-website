import{_ as a,H as n,f as i,i as e}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"28 | 自定义Skill开发：创建你的第一个Agent技能","description":"","frontmatter":{},"headers":[{"level":2,"title":"SKILL.md 格式：一个文件的完整解剖","slug":"skill-md-格式-一个文件的完整解剖","link":"#skill-md-格式-一个文件的完整解剖","children":[{"level":3,"title":"财报摘要","slug":"财报摘要","link":"#财报摘要","children":[]}]},{"level":2,"title":"Important Notes","slug":"important-notes","link":"#important-notes","children":[]},{"level":2,"title":"name: stock-checkerrequires:  # ❌ 错误位置！应该在 metadata.openclaw 下面bins: [\\"curl\\"]","slug":"name-stock-checkerrequires-❌-错误位置-应该在-metadata-openclaw-下面bins-curl","link":"#name-stock-checkerrequires-❌-错误位置-应该在-metadata-openclaw-下面bins-curl","children":[]},{"level":2,"title":"When to Use：告诉 LLM 在什么场景下应该调用这个 Skill。写得越具体，LLM 的判","slug":"when-to-use-告诉-llm-在什么场景下应该调用这个-skill。写得越具体-llm-的判","link":"#when-to-use-告诉-llm-在什么场景下应该调用这个-skill。写得越具体-llm-的判","children":[]},{"level":2,"title":"Commands：提供具体的命令模板。LLM 会参考这些模板，用 exec 工具执行实际的","slug":"commands-提供具体的命令模板。llm-会参考这些模板-用-exec-工具执行实际的","link":"#commands-提供具体的命令模板。llm-会参考这些模板-用-exec-工具执行实际的","children":[]},{"level":2,"title":"Important Notes：约束和注意事项。比如免责声明、数据来源说明等。","slug":"important-notes-约束和注意事项。比如免责声明、数据来源说明等。","link":"#important-notes-约束和注意事项。比如免责声明、数据来源说明等。","children":[]},{"level":2,"title":"name: code-reviewerdescription: \\"代码审查最佳实践\\"","slug":"name-code-reviewerdescription-代码审查最佳实践","link":"#name-code-reviewerdescription-代码审查最佳实践","children":[]},{"level":2,"title":"When to Use","slug":"when-to-use","link":"#when-to-use","children":[]},{"level":2,"title":"Review Checklist","slug":"review-checklist","link":"#review-checklist","children":[]},{"level":2,"title":"Output Format","slug":"output-format","link":"#output-format","children":[]},{"level":2,"title":"Important Notes","slug":"important-notes-1","link":"#important-notes-1","children":[]},{"level":2,"title":"name: data-analyzerdescription: \\"CSV数据分析和可视化\\"metadata:openclaw:requires:bins: [\\"python3\\"]","slug":"name-data-analyzerdescription-csv数据分析和可视化-metadata-openclaw-requires-bins-python3","link":"#name-data-analyzerdescription-csv数据分析和可视化-metadata-openclaw-requires-bins-python3","children":[]},{"level":2,"title":"When to Use","slug":"when-to-use-1","link":"#when-to-use-1","children":[]},{"level":2,"title":"Commands","slug":"commands","link":"#commands","children":[{"level":3,"title":"数据分析","slug":"数据分析","link":"#数据分析","children":[]},{"level":3,"title":"数据可视化","slug":"数据可视化","link":"#数据可视化","children":[]}]},{"level":2,"title":"Supported Chart Types","slug":"supported-chart-types","link":"#supported-chart-types","children":[]}],"relativePath":"OpenClaw核心原理与实战/28｜自定义Skill开发：创建你的第一个Agent技能.md","filePath":"OpenClaw核心原理与实战/28｜自定义Skill开发：创建你的第一个Agent技能.md","lastUpdated":1795533128000}'),l={name:"OpenClaw核心原理与实战/28｜自定义Skill开发：创建你的第一个Agent技能.md"};function p(t,s,c,h,o,r){return n(),i("div",null,[...s[0]||(s[0]=[e(`<h1 id="_28-自定义skill开发-创建你的第一个agent技能" tabindex="-1">28 | 自定义Skill开发：创建你的第一个Agent技能 <a class="header-anchor" href="#_28-自定义skill开发-创建你的第一个agent技能" aria-label="Permalink to &quot;28 | 自定义Skill开发：创建你的第一个Agent技能&quot;">​</a></h1><p>你好，我是 Henry，欢迎来到《OpenClaw 核心原理与实战》。</p><p>在演练场（一）中，我们学会了通过配置文件驱动 OpenClaw 工作：安装部署、多 Agent 配置、社区 Skill 生态活用、综合工作台搭建。那部分核心理念是“配置驱动、零代码上手”，面向的是使用者角色。</p><p>但在实际业务中内置 Skill 不能完全满足你的场景需求，这时候你就需要从使用者升级为创造者。演练场（二）要解决的就是这个问题：从使用现有能力到创造新能力。</p><p>而 Skill 是这条路上最好的起点。因为 Skill 的开发门槛低，我们先学 Skill，建立信心和基本认知，再过渡到 Plugin 开发。本节课你将掌握 SKILL.md 的完整格式，从零创建三种类型的Skill，理解加载优先级和门控机制。学完这节课，你就能为任何业务场景量身打造 Agent 技能。</p><h2 id="skill-md-格式-一个文件的完整解剖" tabindex="-1">SKILL.md 格式：一个文件的完整解剖 <a class="header-anchor" href="#skill-md-格式-一个文件的完整解剖" aria-label="Permalink to &quot;SKILL.md 格式：一个文件的完整解剖&quot;">​</a></h2><p>为什么我们还要先讲格式，Skill 不就是写个 Markdown 吗？其实 SKILL.md 的格式有很多细节，决定了 Skill 能不能被正确加载、能不能在合适的环境中生效。特别是 frontmatter 中的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>metadata.openclaw 嵌套结构，以及门控字段的含义。所以我们先把格式讲透，然后再动</span></span></code></pre></div><p>手写。</p><p>这里，我们以 A 股行情查询 Skill 为例进行完整解析，用一个完整的示例来逐字段解析SKILL.md 的结构：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">name:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stock-checker</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">description:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;查询A股实时行情和基本面数据&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">homepage:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://github.com/your-org/stock-checker</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">metadata:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> openclaw:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   emoji:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   requires:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     bins:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;curl&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;python3&quot;]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     env:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;STOCK_API_KEY&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   always:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># A股行情查询</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## When to Use</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户询问某只股票的价格、涨跌</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户想了解某公司的财报数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户需要对比多只股票</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## Commands</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">### 实时行情</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`\`\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bash</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://api.example.com/stock/{code}?key=\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">STOCK_API_KEY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> python3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sys, json</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">data</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> = json.load(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sys.stdin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">(f\\</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;股票: {data[&#39;name&#39;]} ({data[&#39;code&#39;]})</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">print(f</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">最新价: {data[&#39;price&#39;]} 涨跌幅: {data[&#39;change&#39;]}%</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;</span></span></code></pre></div><h3 id="财报摘要" tabindex="-1">财报摘要 <a class="header-anchor" href="#财报摘要" aria-label="Permalink to &quot;财报摘要&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://api.example.com/finance/{code}?key=\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">STOCK_API_KEY</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot;</span></span></code></pre></div><h2 id="important-notes" tabindex="-1">Important Notes <a class="header-anchor" href="#important-notes" aria-label="Permalink to &quot;Important Notes&quot;">​</a></h2><ul><li>数据仅供参考，不构成投资建议</li><li>交易时间外数据为上一交易日收盘数据</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>frontmatter 部分解析：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/28/1.png)</span></span></code></pre></div><p>一个需要特别注意的点是，requires 必须嵌套在 metadata.openclaw 下，不是</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>frontmatter 的顶层字段。如果你写成这样：</span></span></code></pre></div><hr><h2 id="name-stock-checkerrequires-❌-错误位置-应该在-metadata-openclaw-下面bins-curl" tabindex="-1">name: stock-checker requires: # ❌ 错误位置！应该在 metadata.openclaw 下面 bins: [&quot;curl&quot;] <a class="header-anchor" href="#name-stock-checkerrequires-❌-错误位置-应该在-metadata-openclaw-下面bins-curl" aria-label="Permalink to &quot;name: stock-checker
requires:  # ❌ 错误位置！应该在 metadata.openclaw 下面
 bins: [&quot;curl&quot;]&quot;">​</a></h2><p>Skill 能加载，但门控检查会失效，系统找不到 requires 字段，认为没有依赖要求，跳过所 有检查。结果是 Skill 在缺少 curl 的环境中也能被加载，但运行时会报错。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Markdown 正文部分解析：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>正文是注入 Agent System Prompt 的核心内容。LLM 会读到这些文字，并据此决定何时使用以及怎么使用这个 Skill。所以正文的写法直接影响 Skill 的效果。</span></span></code></pre></div><h2 id="when-to-use-告诉-llm-在什么场景下应该调用这个-skill。写得越具体-llm-的判" tabindex="-1">When to Use：告诉 LLM 在什么场景下应该调用这个 Skill。写得越具体，LLM 的判 <a class="header-anchor" href="#when-to-use-告诉-llm-在什么场景下应该调用这个-skill。写得越具体-llm-的判" aria-label="Permalink to &quot;When to Use：告诉 LLM 在什么场景下应该调用这个 Skill。写得越具体，LLM 的判&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 断越准确。</span></span></code></pre></div><h2 id="commands-提供具体的命令模板。llm-会参考这些模板-用-exec-工具执行实际的" tabindex="-1">Commands：提供具体的命令模板。LLM 会参考这些模板，用 exec 工具执行实际的 <a class="header-anchor" href="#commands-提供具体的命令模板。llm-会参考这些模板-用-exec-工具执行实际的" aria-label="Permalink to &quot;Commands：提供具体的命令模板。LLM 会参考这些模板，用 exec 工具执行实际的&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 命令。</span></span></code></pre></div><h2 id="important-notes-约束和注意事项。比如免责声明、数据来源说明等。" tabindex="-1">Important Notes：约束和注意事项。比如免责声明、数据来源说明等。 <a class="header-anchor" href="#important-notes-约束和注意事项。比如免责声明、数据来源说明等。" aria-label="Permalink to &quot;Important Notes：约束和注意事项。比如免责声明、数据来源说明等。&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>门控部分解析：</span></span></code></pre></div><p>除了 bins 和 env，metadata.openclaw.requires 还支持更多门控条件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>![](images/28/2.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>还有两个特殊标记：</span></span></code></pre></div><p>always: true：跳过所有门控检查，始终加载。适合不依赖外部工具的纯提示词 Skill。 配置覆写：config.skills.entries.&lt;​name&gt;.enabled 可以强制启用或禁用某个</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- Skill。</span></span></code></pre></div><p>门控机制的核心目的是自动适应环境。比如 Linux 系统不需要加载 Apple Notes Skill（os: [&quot;macos&quot;]），没有安装 gh CLI 的环境不需要加载 GitHub Skill（bins: [&quot;gh&quot;]）。这比手</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>动管理启用 / 禁用列表要智能得多。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 三种 Skill 类型实战：从简单到复杂</span></span>
<span class="line"><span></span></span>
<span class="line"><span>现在你已经理解了 SKILL.md 的格式，接下来我们实际动手创建三种不同类型的 Skill。不同的业务场景需要不同复杂度的 Skill，有的只需要给 LLM 一段行为指引（不涉及外部工具），有的需要调用命令行工具，有的需要配合脚本文件做复杂处理。我们从简到繁递进，找到最适合自己场景的类型。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 类型一：纯提示词 Skill（最简单）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>适用场景：不需要调用任何外部工具，只需要引导 LLM 的行为模式。比如：代码审查规范、文档写作风格、客户服务话术。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>代码审查助手实战示例：</span></span></code></pre></div><hr><h2 id="name-code-reviewerdescription-代码审查最佳实践" tabindex="-1">name: code-reviewer description: &quot;代码审查最佳实践&quot; <a class="header-anchor" href="#name-code-reviewerdescription-代码审查最佳实践" aria-label="Permalink to &quot;name: code-reviewer
description: &quot;代码审查最佳实践&quot;&quot;">​</a></h2><h1 id="code-review-assistant" tabindex="-1">Code Review Assistant <a class="header-anchor" href="#code-review-assistant" aria-label="Permalink to &quot;Code Review Assistant&quot;">​</a></h1><h2 id="when-to-use" tabindex="-1">When to Use <a class="header-anchor" href="#when-to-use" aria-label="Permalink to &quot;When to Use&quot;">​</a></h2><ul><li>用户请求代码审查</li><li>用户提交 PR 需要 review</li><li>用户要求检查代码质量</li></ul><h2 id="review-checklist" tabindex="-1">Review Checklist <a class="header-anchor" href="#review-checklist" aria-label="Permalink to &quot;Review Checklist&quot;">​</a></h2><ol><li>检查命名规范：变量、函数、类名是否符合项目约定</li><li>检查错误处理：异常是否被正确捕获和处理</li><li>检查安全隐患：SQL 注入、XSS、硬编码密钥</li><li>检查性能问题：N+1 查询、无限循环风险、内存泄漏</li><li>检查测试覆盖：核心逻辑是否有单元测试</li></ol><h2 id="output-format" tabindex="-1">Output Format <a class="header-anchor" href="#output-format" aria-label="Permalink to &quot;Output Format&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 对每个文件，按以下格式输出：</span></span></code></pre></div><ul><li>✅ 通过项</li><li>⚠️ 建议改进项（附修改建议）</li><li>❌ 必须修改项（附理由和修改示范） 关键点：这个 Skill 没有 metadata.openclaw.requires，因为它不依赖任何外部工具。 没有门控字段意味着它在任何环境都能加载，也不需要设置 always: true。 纯提示词 Skill 和直接写提示词 Agent 的 instructions 好处： 复用性：instructions 是 Agent 级别的，一个 Agent 一份。Skill 是全局的，多个 Agent</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 都能共享。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 模块化：当你有 10 种专业规范（代码审查、文档审核、安全检查、性能优化……），全写</span></span></code></pre></div><p>在 instructions 里会让配置臃肿不堪。拆成独立 Skill，每个 Skill 专注一件事，清晰得</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 多。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 类型二：带命令的 Skill（中等难度）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>适用场景：需要调用命令行工具完成特定任务。比如，查询 API、执行脚本、操作文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>汇率查询 Skill 实战示例：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>name: currency-converter</span></span>
<span class="line"><span>description: &quot;实时汇率查询和货币转换&quot;</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> openclaw:</span></span>
<span class="line"><span>   requires:</span></span>
<span class="line"><span>     bins: [&quot;curl&quot;]</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span># Currency Converter</span></span>
<span class="line"><span>## When to Use</span></span>
<span class="line"><span>- 用户需要查询汇率</span></span>
<span class="line"><span>- 用户需要货币转换</span></span>
<span class="line"><span>- 用户比较不同币种的价值</span></span>
<span class="line"><span>## Commands</span></span>
<span class="line"><span>### 查询汇率</span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span>curl -s &quot;https://api.exchangerate-api.com/v4/latest/{FROM}&quot; | \\</span></span>
<span class="line"><span> python3 -c &quot;import sys,json; d=json.load(sys.stdin); print(f&#39;1 {d[\\&quot;base\\&quot;]} =</span></span></code></pre></div><h2 id="important-notes-1" tabindex="-1">Important Notes <a class="header-anchor" href="#important-notes-1" aria-label="Permalink to &quot;Important Notes&quot;">​</a></h2><ul><li>汇率数据来自 exchangerate-api.com，可能有数分钟延迟</li><li>{FROM} 和 {TO} 需替换为实际的货币代码（如 USD、CNY、EUR） Skill 声明了 requires.bins: [&quot;curl&quot;]。当 OpenClaw 启动加载 Skill 时，门控机制会检 查系统中是否安装了 curl，如果没有，这个 Skill 会被静默跳过，不会注入到 System</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Prompt 中。这避免了 Agent 尝试执行不存在的命令。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Commands 部分的写法注意事项：</span></span></code></pre></div><p>命令模板中的 {FROM}、{TO} 是占位符，LLM 会根据用户的实际请求替换为具体值。你</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 不需要写变量解析逻辑，LLM 天然擅长做这种替换。</span></span></code></pre></div><p>命令中可以引用环境变量（\${STOCK_API_KEY}）。如果你在 requires.env 中声明了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 依赖，门控系统会在加载前检查变量是否存在。</span></span></code></pre></div><p>管道操作（|）是常用模式，用 curl 获取数据，用 python3 或 jq 解析和格式化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>### 类型三：带脚本的 Skill（复杂）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>适用场景：需要多步骤处理、复杂数据分析、调用多个脚本，命令行单行写不下了，需要独立的脚本文件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：CSV 数据分析 Skill</span></span>
<span class="line"><span></span></span>
<span class="line"><span>首先看目录结构：</span></span></code></pre></div><p>skills/ └── data-analyzer/ ├── SKILL.md └── scripts/ ├── analyze.py └── visualize.py</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>SKILL.md 内容：</span></span></code></pre></div><hr><h2 id="name-data-analyzerdescription-csv数据分析和可视化-metadata-openclaw-requires-bins-python3" tabindex="-1">name: data-analyzer description: &quot;CSV数据分析和可视化&quot; metadata: openclaw: requires: bins: [&quot;python3&quot;] <a class="header-anchor" href="#name-data-analyzerdescription-csv数据分析和可视化-metadata-openclaw-requires-bins-python3" aria-label="Permalink to &quot;name: data-analyzer
description: &quot;CSV数据分析和可视化&quot;
metadata:
 openclaw:
   requires:
     bins: [&quot;python3&quot;]&quot;">​</a></h2><h1 id="data-analyzer" tabindex="-1">Data Analyzer <a class="header-anchor" href="#data-analyzer" aria-label="Permalink to &quot;Data Analyzer&quot;">​</a></h1><h2 id="when-to-use-1" tabindex="-1">When to Use <a class="header-anchor" href="#when-to-use-1" aria-label="Permalink to &quot;When to Use&quot;">​</a></h2><ul><li>用户提供了 CSV 文件需要分析</li><li>用户需要数据统计摘要</li><li>用户需要数据可视化图表</li></ul><h2 id="commands" tabindex="-1">Commands <a class="header-anchor" href="#commands" aria-label="Permalink to &quot;Commands&quot;">​</a></h2><h3 id="数据分析" tabindex="-1">数据分析 <a class="header-anchor" href="#数据分析" aria-label="Permalink to &quot;数据分析&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /path/to/skills/data-analyzer/scripts/analyze.py</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;{file_path}&quot;</span></span></code></pre></div><h3 id="数据可视化" tabindex="-1">数据可视化 <a class="header-anchor" href="#数据可视化" aria-label="Permalink to &quot;数据可视化&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /path/to/skills/data-analyzer/scripts/visualize.py</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;{file_path}&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;{chart_</span></span></code></pre></div><h2 id="supported-chart-types" tabindex="-1">Supported Chart Types <a class="header-anchor" href="#supported-chart-types" aria-label="Permalink to &quot;Supported Chart Types&quot;">​</a></h2><ul><li>bar: 柱状图</li><li>line: 折线图</li><li>pie: 饼图</li><li>scatter: 散点图</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>需要注意的要点：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 脚本路径必须用绝对路径。因为 Skill 的 Markdown 内容会被注入到 System Prompt 中，LLM 执行命令时的工作目录可能不是 Skill 所在目录。如果用相对路径</span></span></code></pre></div><p>（scripts/analyze.py），命令大概率会找不到文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>2. 脚本文件的维护和部署需要额外注意。纯 Markdown 的 Skill 只有一个文件，复制到任何地方都能工作，但带脚本的 Skill 需要确保脚本文件也跟着部署到正确位置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 什么时候该从“带命令”升级到“带脚本”？经验法则：如果你的命令行超过 3 行管道操作，或者需要复杂的错误处理逻辑，就应该抽成独立脚本。脚本可以做单元测试、可以有异常处理、可以输出结构化结果，这些都是内联命令做不到的。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>上面我们讲解完三种类型的 Skill 的案例，但是我们实际开发过程中，好了一个 Skill，放到了项目目录下，但 Agent 好像完全忽略了它。这是初学者最常遇到的问题。原因通常有两个：一是放错了目录（不在加载路径中），二是被同名的更高优先级 Skill 覆盖了。要诊断这类问题，我们首先要理解 OpenClaw 的六级加载优先级，下面我们重点讲解 Skill 的加载优先级和调试细节。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Skill 加载优先级与调试：为什么我的 Skill 没生效？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OpenClaw 通过六级加载优先级来加载 Skill，后加载的同名 Skill 会覆盖先加载的，详细优先级如下：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/28/3.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>整体采用越贴近用户的来源优先级越高。这个设计优势是可以实现实际业务场景中两类问题：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 在工作区 Skill（优先级 6）中覆盖内置 Skill（优先级 2）。比如内置的 GitHub Skill 用的是通用的 PR 审查流程，你可以在工作区写一个同名的 GitHub Skill，使用公司定制的审查规范。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 全局安装一个通用 Skill（优先级 3），然后在特定项目中用项目级 Skill（优先级 5）做定制化调整。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>下面我们通过一个案例，来一步步创建并验证 Skill 加载。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1：确认放置目录</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对于日常开发，推荐把自定义 Skill 放在工作区 skills 目录：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span># 创建 Skill 目录</span></span>
<span class="line"><span>mkdir -p skills/stock-checker</span></span>
<span class="line"><span># 创建 SKILL.md</span></span>
<span class="line"><span>cat &gt; skills/stock-checker/SKILL.md &lt;&lt; &#39;EOF&#39;</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>name: stock-checker</span></span>
<span class="line"><span>description: &quot;查询A股实时行情&quot;</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span> openclaw:</span></span>
<span class="line"><span>   emoji: &quot;&quot;</span></span>
<span class="line"><span>   requires:</span></span>
<span class="line"><span>     bins: [&quot;curl&quot;]</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span># A股行情查询</span></span>
<span class="line"><span>## When to Use</span></span>
<span class="line"><span>- 用户询问股票价格或涨跌</span></span>
<span class="line"><span>- 用户想了解某公司财报数据</span></span>
<span class="line"><span>## Commands</span></span>
<span class="line"><span>### 实时行情</span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span>curl -s &quot;wttr.in/{city}?format=3&quot;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Step 2：验证 Skill 是否被加载</span></span></code></pre></div><h1 id="查看已加载的-skill-列表" tabindex="-1">查看已加载的 Skill 列表 <a class="header-anchor" href="#查看已加载的-skill-列表" aria-label="Permalink to &quot;查看已加载的 Skill 列表&quot;">​</a></h1><p>openclaw skills list</p><h1 id="你应该能看到类似输出" tabindex="-1">你应该能看到类似输出： <a class="header-anchor" href="#你应该能看到类似输出" aria-label="Permalink to &quot;你应该能看到类似输出：&quot;">​</a></h1><h1 id="stock-checker-—-查询a股实时行情-workspace" tabindex="-1">stock-checker — 查询A股实时行情 [workspace] <a class="header-anchor" href="#stock-checker-—-查询a股实时行情-workspace" aria-label="Permalink to &quot;stock-checker — 查询A股实时行情 [workspace]&quot;">​</a></h1><h1 id="requires-bins-curl-✅" tabindex="-1">requires: bins(curl) ✅ <a class="header-anchor" href="#requires-bins-curl-✅" aria-label="Permalink to &quot;requires: bins(curl) ✅&quot;">​</a></h1><p>其中，[workspace] 标记表示这个 Skill 来自工作区目录（优先级 6）。requires: bins(curl) ✅ 表示门控检查通过了，系统中存在 curl 命令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Step 3：测试门控是否正确</span></span></code></pre></div><h1 id="专门检查某个-skill-的门控状态" tabindex="-1">专门检查某个 Skill 的门控状态 <a class="header-anchor" href="#专门检查某个-skill-的门控状态" aria-label="Permalink to &quot;专门检查某个 Skill 的门控状态&quot;">​</a></h1><p>openclaw skills check stock-checker</p><h1 id="输出会告诉你每个门控条件的检查结果" tabindex="-1">输出会告诉你每个门控条件的检查结果： <a class="header-anchor" href="#输出会告诉你每个门控条件的检查结果" aria-label="Permalink to &quot;输出会告诉你每个门控条件的检查结果：&quot;">​</a></h1><h1 id="✅-bins-curl-found-at-usr-bin-curl" tabindex="-1">✅ bins: curl (found at /usr/bin/curl) <a class="header-anchor" href="#✅-bins-curl-found-at-usr-bin-curl" aria-label="Permalink to &quot;✅ bins: curl (found at /usr/bin/curl)&quot;">​</a></h1><h1 id="✅-env-stock-api-key-set" tabindex="-1">✅ env: STOCK_API_KEY (set) <a class="header-anchor" href="#✅-env-stock-api-key-set" aria-label="Permalink to &quot;✅ env: STOCK_API_KEY (set)&quot;">​</a></h1><h1 id="或者" tabindex="-1">或者： <a class="header-anchor" href="#或者" aria-label="Permalink to &quot;或者：&quot;">​</a></h1><h1 id="❌-env-stock-api-key-not-set-—-skill-will-be-skipped" tabindex="-1">❌ env: STOCK_API_KEY (not set) — Skill will be skipped <a class="header-anchor" href="#❌-env-stock-api-key-not-set-—-skill-will-be-skipped" aria-label="Permalink to &quot;❌ env: STOCK_API_KEY (not set) — Skill will be skipped&quot;">​</a></h1><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>如果门控检查失败，你有两个解决办法：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 设置缺少的环境变量或安装缺少的工具</span></span></code></pre></div><p>如果这个 Skill 不依赖该工具也能工作，从 requires 中移除对应条件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>实际加载过程中，为了防止 System Prompt 被无限膨胀，Skill 系统有以下加载限制：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/28/4.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如果你的 Skill 内容特别长（超过 2000 字），考虑精简。记住，Skill 的内容会被注入到System Prompt 中，内容越多，消耗的上下文窗口越大，留给对话内容的空间就越小。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 总结</span></span>
<span class="line"><span></span></span>
<span class="line"><span>本节课我们的核心知识点如下：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/28/5.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你现在能做到：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 从零创建一个符合规范的 SKILL.md 文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 根据业务需求选择合适的 Skill 类型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 将 Skill 放到正确的目录并验证加载</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 排查 Skill 未生效的常见问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 为你的实际业务场景定制专属 Skill</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 思考题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请创建一个贴合你实际业务的自定义 Skill（如行业术语助手、公司规范检查器、内部 API 查</span></span></code></pre></div><p>询工具），放入工作区 skills/ 目录并验证加载和使用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>欢迎你在留言区与我交流！如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</span></span></code></pre></div>`,93)])])}const u=a(l,[["render",p]]);export{k as __pageData,u as default};
