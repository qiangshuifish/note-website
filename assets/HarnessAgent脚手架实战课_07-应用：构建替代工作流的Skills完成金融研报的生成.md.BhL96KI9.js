import{_ as a,H as n,f as l,i as p}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"07-应用：构建替代工作流的Skills完成金融研报的生成","description":"","frontmatter":{},"headers":[{"level":2,"title":"从单独调用工具进阶到以 skills 为主","slug":"从单独调用工具进阶到以-skills-为主","link":"#从单独调用工具进阶到以-skills-为主","children":[]},{"level":2,"title":"AI Agent 应用开发思路转变","slug":"ai-agent-应用开发思路转变","link":"#ai-agent-应用开发思路转变","children":[]},{"level":2,"title":"新思路下的金融研报生成项目开发方法","slug":"新思路下的金融研报生成项目开发方法","link":"#新思路下的金融研报生成项目开发方法","children":[{"level":3,"title":"Skill 的设计与实现","slug":"skill-的设计与实现","link":"#skill-的设计与实现","children":[]}]},{"level":2,"title":"阶段 1: 数据采集","slug":"阶段-1-数据采集","link":"#阶段-1-数据采集","children":[]},{"level":2,"title":"阶段 2: 指标计算","slug":"阶段-2-指标计算","link":"#阶段-2-指标计算","children":[]},{"level":2,"title":"阶段 3: 分析与可视化","slug":"阶段-3-分析与可视化","link":"#阶段-3-分析与可视化","children":[]},{"level":2,"title":"阶段 4: 报告撰写","slug":"阶段-4-报告撰写","link":"#阶段-4-报告撰写","children":[]},{"level":2,"title":"状态管理","slug":"状态管理","link":"#状态管理","children":[]}],"relativePath":"HarnessAgent脚手架实战课/07-应用：构建替代工作流的Skills完成金融研报的生成.md","filePath":"HarnessAgent脚手架实战课/07-应用：构建替代工作流的Skills完成金融研报的生成.md","lastUpdated":1795487647000}'),i={name:"HarnessAgent脚手架实战课/07-应用：构建替代工作流的Skills完成金融研报的生成.md"};function e(t,s,c,o,h,d){return n(),l("div",null,[...s[0]||(s[0]=[p(`<h1 id="_07-应用-构建替代工作流的skills完成金融研报的生成" tabindex="-1">07-应用：构建替代工作流的Skills完成金融研报的生成 <a class="header-anchor" href="#_07-应用-构建替代工作流的skills完成金融研报的生成" aria-label="Permalink to &quot;07-应用：构建替代工作流的Skills完成金融研报的生成&quot;">​</a></h1><p>你好，我是邢云阳。</p><p>在前面的课程中，我们演示了如何将业务逻辑封装为自定义工具，并交由 ClaudeSDKClient调用。然而，正如我们在前文所探讨的，Claude Code 的设计哲学强调：Agent 的工具集应当遵循“少而精”的原则，优先保留具备通用能力的工具。这是因为工具数量的膨胀会不可避免地挤占宝贵的上下文窗口，进而影响模型的推理质量与响应效率。</p><h2 id="从单独调用工具进阶到以-skills-为主" tabindex="-1">从单独调用工具进阶到以 skills 为主 <a class="header-anchor" href="#从单独调用工具进阶到以-skills-为主" aria-label="Permalink to &quot;从单独调用工具进阶到以 skills 为主&quot;">​</a></h2><p>为了化解这一矛盾，Claude Code 官方在架构层面进行了两阶段的优化探索。</p><p>第一阶段是引入工具的渐进式加载机制，其核心是 MCP Tool Search。当注册的工具定义占据上下文窗口超过 10% 的阈值时，系统会自动触发该机制。此时，系统不再一次性将所有工具的完整定义注入上下文，而是仅加载工具的简要名称与描述。只有当模型判断确实需要调用某个工具时，才会按需检索并加载其详细的参数与调用说明。这种“按需获取”的策略，大幅降低了常驻上下文的开销。</p><p>第二阶段则是 Skills（技能） 机制的推出。Skills 同样采用了渐进式加载的设计思路，但其加载的内容并非工具定义，而是指导模型完成特定任务的步骤说明、业务规范以及参考文档等。换言之，Skills 将“如何做一件事”的方法论从上下文中剥离出来，仅在模型需要执行具体任务时才动态载入。这不仅进一步释放了上下文空间，也让 Agent 的能力扩展变得更加灵活与高效。这样说可能你暂时没什么感觉，后续我们演示 Skill 封装实例的时候，你就明白我的意思了。</p><p>通过这两个阶段的演进，Claude Code 在保持工具丰富性的同时，有效控制了上下文窗口的占用，为构建复杂而高效的 Agent 提供了更为稳健的基础。</p><h2 id="ai-agent-应用开发思路转变" tabindex="-1">AI Agent 应用开发思路转变 <a class="header-anchor" href="#ai-agent-应用开发思路转变" aria-label="Permalink to &quot;AI Agent 应用开发思路转变&quot;">​</a></h2><p>这种开发思路的转变，标志着 Agent 项目构建逻辑的进阶。</p><p>回顾去年，我们在启动一个 Agent 项目时，往往陷入“框架先行”的工程惯性中。开发者首先需要选定一个底层脚手架（如 LangGraph），随后投入大量精力去设计复杂的图节点、处理上下文传递以及编排循环逻辑，最后才是编写具体的工具。这种模式虽然工程化程度高，但整体代码量庞大，且系统往往显得僵硬。</p><p>而今年的最佳实践则转向了“业务先行”。开发者的首要任务不再是挑选框架，而是审视业务本身：是否存在固定的业务流程？这些流程是否可以被提炼并封装为 Skills？一旦完成业务逻辑的 Skill 化，后续的开发便变得极为轻量。</p><p>即便是非技术背景的开发者，也能熟练地将这些 Skills 安装到 OpenClaw（龙虾）、ClaudeCode 或 Codex 等终端工具中，快速完成功能闭环。当然，对于需要深度定制的 Agent 产品而言，我们不能直接使用这些封装好的终端，而是需要通过使用具备同等底层能力的脚手架（如 Claude Agent SDK）来实现相同的架构效果。</p><h2 id="新思路下的金融研报生成项目开发方法" tabindex="-1">新思路下的金融研报生成项目开发方法 <a class="header-anchor" href="#新思路下的金融研报生成项目开发方法" aria-label="Permalink to &quot;新思路下的金融研报生成项目开发方法&quot;">​</a></h2><p>以去年我们探讨过的 LangGraph 金融研报生成项目为例，这种思路的转换尤为明显。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/HarnessAgent%E8%84%9A%E6%89%8B%E6%9E%B6%E5%AE%9E%E6%88%98%E8%AF%BE/images/07-%25E5%25BA%2594%25E7%2594%25A8/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/HarnessAgent%E8%84%9A%E6%89%8B%E6%9E%B6%E5%AE%9E%E6%88%98%E8%AF%BE/images/07-%25E5%25BA%2594%25E7%2594%25A8/1.png" alt=""></a></p><p>如上图所示，该项目从数据抓取到最终研报生成的全过程，本质上是一个高度固定的线性工作流，并不涉及复杂的并行处理或环形依赖。面对这类场景，我们完全无需再搭建沉重的图结构，而是可以直接编写一个 Skill ，或者更简单一点——直接采用计划模式，写一段步骤清晰的系统提示词，将标准化的研报生成流程固化下来，交由 Agent 自主调度执行。</p><p>进一步深入到具体的数据抓取环节，通过上节课的学习，我们知道，这一过程通常需要依次调用多个接口来获取资产负债表等财务数据。这些底层工具本身并不复杂，例如上一小节提到的资产负债表抓取工具，其核心逻辑仅仅是调用 AKShare 接口并将数据持久化到本地。</p><p>对于这类高频且标准化的操作，我们同样可以将其封装为一个 Skill。在 Skill 的定义中，我们可以明确列出需要抓取的数据字段，并将具体的抓取代码以脚本的形式存放在 Skill 的 scripts目录下。借助 Claude Agent SDK 原生的代码执行能力，Agent 可以直接运行这些脚本。这种“将执行逻辑代码化、将编排逻辑 Skill 化”的做法，不仅大幅提升了开发效率，更通过消除模型在简单逻辑上的推理不确定性，显著提高了任务执行的准确度。</p><h3 id="skill-的设计与实现" tabindex="-1">Skill 的设计与实现 <a class="header-anchor" href="#skill-的设计与实现" aria-label="Permalink to &quot;Skill 的设计与实现&quot;">​</a></h3><p>那针对这个项目，我们可以将每一块业务都设计为一个 Skill，保证 Skill 的功能的独立性。下面的表格展示了我设计的 Skill 及其功能。</p><p>Skill</p><ul><li><p>功能具体实现业务</p></li><li><p>通过联网搜索识别与待分析公司具体业务和市值</p></li></ul><p>competitor_research</p><ul><li>竞争对手分析的公司</li></ul><p>financial_data_collection</p><ul><li>财务数据采集采集指定公司三大表等财务数据</li></ul><p>financial_ratio_calculation</p><ul><li>财务比率计算根据采集到的财务数据，计算利润率等财务指标</li></ul><p>这些 Skill，并不是我手工写出的。而是通过 Claude Code 结合 Skill-Creator 这个 Skill 自动编写出之后，我又针对不合理的地方（比如业务流程不符合我们预期）略微做的修改。</p><p>那想要让 Claude Code 能够写出符合业务的 Skill，必然需要让其理解之前 LangGraph 的那一套代码。这套代码由于代码量相比一些百万行级的大型项目来说，只能算是一个小项目，因此我们直接让 Claude Code 去分析与理解代码的结构与功能等等，Claude Code 也可以做得很好。之后可以根据其分析结果，让其设计一下需要生成哪几个 Skill 。</p><p>那如果是代码量比较大的项目，我们使用这种“一句话”的 Vibe Coding 式的分析，就比较难分析全面。此时，我们应先针对项目生成功能文档、设计文档等，基于这些文档再去分析。在这里，我为大家推荐一个工具，名字叫做 zread_cli。该工具是一个命令行工具，可以通过 AI 直接阅读代码库，然后生成非常全面的结构化 Wiki 文档。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/HarnessAgent%E8%84%9A%E6%89%8B%E6%9E%B6%E5%AE%9E%E6%88%98%E8%AF%BE/images/07-%25E5%25BA%2594%25E7%2594%25A8/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/HarnessAgent%E8%84%9A%E6%89%8B%E6%9E%B6%E5%AE%9E%E6%88%98%E8%AF%BE/images/07-%25E5%25BA%2594%25E7%2594%25A8/2.png" alt=""></a></p><p>Skill 由于内容比较多，并且也比较偏业务，我就挑选其中一个展示一下，其他的就不在课程中贴内容展示了，我会将其传到我的 Github 上，感兴趣的同学可以下载后自行查看。</p><p>下面展示 financial_data_collection 这个 skill。首先是标签部分：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name: financial-data-collection</span></span>
<span class="line"><span>description: |</span></span>
<span class="line"><span> 采集中国 A 股和港股上市公司的财务数据，包括资产负债表、利润表、现金流量表和财务指标。</span></span>
<span class="line"><span> 当用户提到财务数据、财报、三大报表、财务指标、akshare、上市公司财务、股票财务数据、</span></span>
<span class="line"><span> 竞争对手财务数据、年报数据、采集财务数据等任何与财务数据采集相关的需求时，务必使用此 skill。</span></span>
<span class="line"><span> 本 skill 提供标准化脚本，将数据保存为 utf-8-sig 编码的 CSV，供后续计算和分析使用。</span></span></code></pre></div><p>标签部分，描述了在什么场景或者用户提到什么关键词时会用这个 skill，标签内容的好坏，直接决定 agent 后期是否能调到这个 skill。</p><p>接下来是 skill 的正文部分，首先需要写清楚用途与使用场景：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>**# 财务数据采集技能 (Financial Data Collection)**</span></span>
<span class="line"><span>**## 用途**</span></span>
<span class="line"><span>本 skill 用于采集中国 A 股和港股上市公司的财务数据，具体包括：</span></span>
<span class="line"><span>- ****资产负债表****：资产、负债、所有者权益等科目</span></span>
<span class="line"><span>- ****利润表****：营业收入、成本、利润等科目</span></span>
<span class="line"><span>- ****现金流量表****：经营、投资、筹资活动现金流</span></span>
<span class="line"><span>- ****财务指标****：盈利能力、偿债能力、运营能力、成长能力等综合指标</span></span>
<span class="line"><span>采集结果以标准化 CSV 格式保存，可直接用于后续的财务指标计算、趋势分析、对比分析和估值建模。</span></span>
<span class="line"><span>**## 何时使用此 skill**</span></span>
<span class="line"><span>只要用户任务涉及以下内容，就应当使用本 skill：</span></span>
<span class="line"><span>- 采集/获取/下载上市公司财务数据</span></span>
<span class="line"><span>- 三大报表、年报、财务报表</span></span>
<span class="line"><span>- 财务指标、财务比率</span></span>
<span class="line"><span>- 贵州茅台、五粮液等具体公司财务数据</span></span>
<span class="line"><span>- 竞争对手财务数据对比</span></span>
<span class="line"><span>- 使用 akshare 获取财经数据</span></span>
<span class="line"><span>- 为财务分析、研报生成准备数据</span></span></code></pre></div><p>这一部分相当于标签的扩展版，是当 agent 通过标签选择调用该 skill 时，提供给 Agent 的更详细信息，让 Agent 进一步确认该 skill 是否符合业务需求。</p><p>之后是，脚本的使用说明。由于抓取这些财务数据，需要使用 akshare 库的接口，因此，在skill 的 scripts 文件夹中，预设了 akshare 脚本。我们需要告诉 Agent，脚本怎么使用，具体内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>**## 输入要求**</span></span>
<span class="line"><span>调用主脚本 \`scripts/collect_financial_data.py\` 时需要以下参数：</span></span>
<span class="line"><span>| 参数 | 必填 | 说明 | 示例 |</span></span>
<span class="line"><span>|---|---|---|---|</span></span>
<span class="line"><span>| \`--code\` | 是 | 股票代码（纯数字，不要带 SH/SZ/ HK 前缀） | \`600519\` |</span></span>
<span class="line"><span>| \`--name\` | 是 | 公司名称（用于日志和报告） | \`贵州茅台\` |</span></span>
<span class="line"><span>| \`--market\` | 是 | 市场类型 | \`A股\` 或 \`港股\` |</span></span>
<span class="line"><span>| \`--years\` | 是 | 分析年份，可多个 | \`2022 2023 2024\` |</span></span>
<span class="line"><span>| \`--output-dir\` | 否 | 输出目录 | 默认 \`/workspace/data/financial_statements\` |</span></span>
<span class="line"><span>| \`--sleep\` | 否 | 请求间隔秒数 | 默认 \`0.5\` |</span></span>
<span class="line"><span>| \`--retries\` | 否 | 失败重试次数 | 默认 \`3\` |</span></span>
<span class="line"><span>| \`--verbose\` | 否 | 是否输出详细日志 | 默认关闭 |</span></span>
<span class="line"><span>**## 快速开始**</span></span>
<span class="line"><span>**### 1. 安装依赖**</span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span>pip install -r skills/financial_data_collection/requirements.txt</span></span></code></pre></div><p><strong>### 2. 采集单公司数据</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> skills/financial_data_collection/scripts/collect_financial_data.py</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --code</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 600519</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 贵州茅台</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --market</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> A股</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --years</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2022</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2023</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2024</span></span></code></pre></div><p><strong>### 3. 采集竞争对手数据</strong> 对每一家竞争对手公司分别执行上述命令，仅替换 <code>--code</code>、<code>--name</code> 参数即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 例如：</span></span></code></pre></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> skills/financial_data_collection/scripts/collect_financial_data.py</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --code</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> skills/financial_data_collection/scripts/collect_financial_data.py</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --code</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> skills/financial_data_collection/scripts/collect_financial_data.py</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --code</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>再然后是具体的执行步骤，这些步骤涵盖了抓取财务数据的顺序步骤，具体内容如下：</span></span></code></pre></div><p><strong>## 工作流建议</strong> 对于一份完整的财务研报，建议按以下顺序使用本 skill：</p><ol><li>先使用本 skill 采集目标公司的多年度财务数据</li><li>再使用本 skill 采集所有竞争对手公司的多年度财务数据</li><li>检查每个公司是否都生成了 4 × N 个 CSV 文件（N 为年数）</li><li>阅读 <code>{code}_collection_summary.json</code> 确认无严重错误</li><li>将输出目录交给下一个 skill（财务指标计算）继续处理</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>这个 skill 的主要内容就是这些，有了这个例子是不是觉得 skill 也没什么神秘的？skill 核心就是描述清楚场景用途，然后定义好 CLI，以及 CLI 对应的脚本。这也是目前 Skill + CLI 取代MCP 的经典范式。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 工具的设计</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在上面的 Skill 中，有需要用到联网搜索功能的，比如搜索行业竞争对手等等。虽然 ClaudeAgent SDK 已经带了 WebSearch 工具，但是只有使用其原版 Claude 模型的用户才可以使用，作为我们接入国内模型的用户是不能用的。因此，我们需要自己去实现一个。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>我们这就来学习工具的设计。实现方案呢，还是采用第 4 节课讲过的博查方案，这是目前国内联网搜索精准度比较高的方案。具体实现代码细节，则是按照第 6 节课讲解的方式，将具体业务函数加上 @tool，然后封装为 MCP（Claude Agent SDK 规定了，想新加工具必须封装为MCP）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 系统提示词的设计</span></span>
<span class="line"><span></span></span>
<span class="line"><span>由于没有了 LangGraph 工作流做研报生成步骤的强行编排。我们只能依靠系统提示词来让模型按照我们希望的顺序来完成任务。我设计的系统提示词如下：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 你是一位金融研报项目协调员。用户会提供股票代码、公司名称、市场和分析年份。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 你的工作流程（按顺序执行）：</span></span></code></pre></div><h2 id="阶段-1-数据采集" tabindex="-1">阶段 1: 数据采集 <a class="header-anchor" href="#阶段-1-数据采集" aria-label="Permalink to &quot;阶段 1: 数据采集&quot;">​</a></h2><ul><li>调用 competitor_research skill 研究竞争对手和行业</li><li>调用 financial_data_collection skill 采集所有公司的财务报表</li></ul><h2 id="阶段-2-指标计算" tabindex="-1">阶段 2: 指标计算 <a class="header-anchor" href="#阶段-2-指标计算" aria-label="Permalink to &quot;阶段 2: 指标计算&quot;">​</a></h2><ul><li>调用 financial_ratio_calculation skill 计算所有公司的财务比率</li></ul><h2 id="阶段-3-分析与可视化" tabindex="-1">阶段 3: 分析与可视化 <a class="header-anchor" href="#阶段-3-分析与可视化" aria-label="Permalink to &quot;阶段 3: 分析与可视化&quot;">​</a></h2><ul><li>调用 financial_visualization skill 生成趋势图和对比图</li><li>调用 valuation_modeling skill 生成估值报告</li></ul><h2 id="阶段-4-报告撰写" tabindex="-1">阶段 4: 报告撰写 <a class="header-anchor" href="#阶段-4-报告撰写" aria-label="Permalink to &quot;阶段 4: 报告撰写&quot;">​</a></h2><ul><li>调用 report_writing skill（隐式遵循其写作规范）</li><li>调用 report_assembly skill 组装最终研报</li></ul><h2 id="状态管理" tabindex="-1">状态管理 <a class="header-anchor" href="#状态管理" aria-label="Permalink to &quot;状态管理&quot;">​</a></h2><p>所有中间产物都保存在文件系统中，你通过 read/glob 工具检查产物是否存在。 如果某个 skill 失败，记录警告并尝试继续。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>之后将系统提示词写入到 ClaudeAgentOptions 的 system_prompt 变量中。</span></span></code></pre></div><p>options = ClaudeAgentOptions( system_prompt=SYSTEM_PROMPT, )</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>### 将 Skill 加入到 Agent 中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最后，我们需要将 Skill 加入到 Agent 程序中，使得 Agent 运行时，能够选到这些 SKill。具体的步骤也很简单。我们首先在 Agent 的工作目录下建立一个.claude/skills/ 文件夹，之后将前面生成的 Skill 文件夹放入到该文件夹中。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>之后在 ClaudeAgentOptions 中加入如下代码：</span></span></code></pre></div><p>options = ClaudeAgentOptions( cwd=&quot;/path/to/project&quot;, # 你当前的工作目录 skills=&quot;all&quot;, # 启用所有加载到的 SKill allowed_tools=[&quot;Read&quot;, &quot;Write&quot;, &quot;Bash&quot;，&quot;Glob&quot;, &quot;mcp__tools__bochasearch&quot;], )</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>代码第 2 行设置工作目录，在这个项目的场景中，主要是为了让 Agent 可以准确地找到位于工作目录下的 SKill。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>代码第 3 行表示可以让 Agent 使用所有在工作目录的 .claude/skills/ 文件夹下的 Skill。如果仅仅想要挑选其中的某些 Skill，则代码可以写成 skills=[&quot;competitor_research&quot;,&quot;financial_data_collection&quot;]。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>代码第 4 行是授权使用了一些必备工具，其中包括我们自己定义的博查搜索工具。其他代码与之前一样保持不变。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这样，我们这个基于 Claude Agent SDK + SKills 的项目就开发完了。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最后可以使用提示词“生成青岛啤酒 SH600600 的 2025 年金融研报”进行测试。测试的部分截图如下：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>首先，Agent 会确认和梳理一下当前的任务，以及任务的步骤：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/07-应用/3.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>之后 Agent 便会依次调用系统提示词中规定好的 Skills ，执行任务。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/07-应用/4.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在这个过程中，会不断有中间产物被写入到文件中。最终生成一份图文并茂的研报。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>强烈建议你亲自动手试一下，上手后你就能发现，整个过程非常丝滑流畅。而且，有时遇到一些数据分析或者生成问题时，Agent 还可以现场写代码去补救，从而帮助我们解决问题。尽管整个过程涉及到大量的数据，我们也没有去关心上下文的问题，Agent 内部就自动处理好了。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这便是用好脚手架，站在巨人的肩膀上的优势。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 总结</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这节课，我们在几乎没怎么写传统代码的情况下，借助 Claude Agent SDK + Skills 的架构以及 Vibe Coding 的方式，完成了金融研报生成项目的重构。相比过去使用 LangGraph 构建的版本，该版本在代码量上大幅减少，关于 Agent 的代码非常少，但是在灵活性与可复用性上却大幅增加。通过将业务模块沉淀成为 Skill，我们可以做到一处编写，多处使用。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>此外，原本大量封装的业务工具，也基本都被转成了 Skill 中的脚本。这些脚本可以被 ClaudeAgent SDK 直接执行，大幅提升效率以及准确性。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这些都是今年以来，做 Agent 项目出现的典型变化，传统代码不再是主旋律了。我们编写提示词，编写 Skill，其实就是在写“代码”。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 思考题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>虽然 Claude Agent SDK 可以自动帮我们解决上下文的问题。但在该项目中，7 个 Skill 挤到一个 Agent 中，也还是有点太臃肿了。我们应如何优化这个问题呢？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>欢迎你在留言区展示你的思考过程，我们一起探讨。如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给其他朋友，我们下节课再见！</span></span></code></pre></div>`,66)])])}const g=a(i,[["render",e]]);export{r as __pageData,g as default};
