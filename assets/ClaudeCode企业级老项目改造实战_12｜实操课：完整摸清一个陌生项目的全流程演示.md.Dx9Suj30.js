import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"12｜实操课：完整摸清一个陌生项目的全流程演示","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备","slug":"准备","link":"#准备","children":[]},{"level":2,"title":"场景一：画三张全景图","slug":"场景一-画三张全景图","link":"#场景一-画三张全景图","children":[]},{"level":2,"title":"场景二：梳理接口和数据模型","slug":"场景二-梳理接口和数据模型","link":"#场景二-梳理接口和数据模型","children":[]},{"level":2,"title":"场景三：生成 CLAUDE.md","slug":"场景三-生成-claude-md","link":"#场景三-生成-claude-md","children":[]},{"level":2,"title":"场景四：挖出第一个 SKILL","slug":"场景四-挖出第一个-skill","link":"#场景四-挖出第一个-skill","children":[]},{"level":2,"title":"一键跑完全流程：让 Claude Code 自主执行","slug":"一键跑完全流程-让-claude-code-自主执行","link":"#一键跑完全流程-让-claude-code-自主执行","children":[]},{"level":2,"title":"跑完之后的样子","slug":"跑完之后的样子","link":"#跑完之后的样子","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"ClaudeCode企业级老项目改造实战/12｜实操课：完整摸清一个陌生项目的全流程演示.md","filePath":"ClaudeCode企业级老项目改造实战/12｜实操课：完整摸清一个陌生项目的全流程演示.md","lastUpdated":1779815445000}'),l={name:"ClaudeCode企业级老项目改造实战/12｜实操课：完整摸清一个陌生项目的全流程演示.md"};function i(t,s,d,c,o,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_12-实操课-完整摸清一个陌生项目的全流程演示" tabindex="-1">12｜实操课：完整摸清一个陌生项目的全流程演示 <a class="header-anchor" href="#_12-实操课-完整摸清一个陌生项目的全流程演示" aria-label="Permalink to &quot;12｜实操课：完整摸清一个陌生项目的全流程演示&quot;">​</a></h1><p>你好，我是 Robert。</p><p>这一讲是第二部分的结尾。前面 06-11 讲每一讲做一件事，这一讲把 08 到 11 的动作在 Spring AI Alibaba Admin 上连起来跑一遍，从 <code>git clone</code> 到 <code>docs/</code> 五份资产齐全、CLAUDE.md 写好、第一个 SKILL 装进去。</p><p>这是一节实操课，文中配有视频。提示词都在下面，你可以打开 Claude Code 照着跑。跑完，你的 <code>spring-ai-alibaba-admin</code> 目录里就有完整的 AI 协作基础设施了。</p><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-label="Permalink to &quot;准备&quot;">​</a></h2><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>git clone https://github.com/alibaba/spring-ai-alibaba.git</span></span>
<span class="line"><span>cd spring-ai-alibaba/spring-ai-alibaba-admin</span></span>
<span class="line"><span>mkdir -p docs</span></span>
<span class="line"><span>mkdir -p .claude/skills</span></span></code></pre></div><p>在这个目录下启动 Claude Code，后面所有提示词都在这里跑。</p><h2 id="场景一-画三张全景图" tabindex="-1">场景一：画三张全景图 <a class="header-anchor" href="#场景一-画三张全景图" aria-label="Permalink to &quot;场景一：画三张全景图&quot;">​</a></h2><p>对应 08 讲。产出 <code>docs/</code> 下的三张 SVG。</p><p><strong>提示词 1：架构图</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>读一下这个项目的 README 和顶层目录，给我画一张架构图。</span></span>
<span class="line"><span>前端、后端、数据库、中间件分层画，核心模块写一句话职责。</span></span>
<span class="line"><span>周边基础设施用一个方框概括就行，不用展开。</span></span>
<span class="line"><span>保存到 docs/architecture.svg。</span></span></code></pre></div><p>产出： <code>docs/architecture.svg</code></p><p>review 重点：有没有体现前后端分离、OpenTelemetry trace 链路有没有画上、server-start 有没有漏。</p><p><strong>提示词 2：模块依赖图</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>看一下项目的 pom.xml，画一张内部模块依赖图。</span></span>
<span class="line"><span>只画项目自己的模块，外部库不画。有循环依赖用红色标出来。</span></span>
<span class="line"><span>保存到 docs/module-deps.svg。</span></span></code></pre></div><p>产出： <code>docs/module-deps.svg</code></p><p>review 重点：start 依赖 runtime 和 openapi、两者都依赖 core，方向不能倒。frontend 不应该出现在这张图里。</p><p><strong>提示词 3：外部依赖图</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>综合看 pom.xml、application.yml 和 README，帮我梳理这个项目。</span></span>
<span class="line"><span>对外依赖了什么。分成三类：关键 Java 依赖、中间件、外部 API。</span></span>
<span class="line"><span>画出来，每类用不同颜色。保存到 docs/external-deps.svg。</span></span></code></pre></div><p>产出： <code>docs/external-deps.svg</code></p><p>review 重点：MySQL、Nacos、OTel Collector 都要在，外部模型 API（DashScope、OpenAI、DeepSeek）不能漏。</p><h2 id="场景二-梳理接口和数据模型" tabindex="-1">场景二：梳理接口和数据模型 <a class="header-anchor" href="#场景二-梳理接口和数据模型" aria-label="Permalink to &quot;场景二：梳理接口和数据模型&quot;">​</a></h2><p>对应 09 讲。产出接口清单和数据模型文档。</p><p><strong>提示词 4：REST 接口清单</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>扫一下这个项目里所有的 Controller，给我整理一份 REST 接口清单。</span></span>
<span class="line"><span>每个接口列出方法、路径、一句话说明、主要入参、返回结构。</span></span>
<span class="line"><span>按模块分组。保存到 docs/api-list.md。</span></span></code></pre></div><p>产出： <code>docs/api-list.md</code></p><p>review 重点：server-core、server-openapi、server-runtime 三个模块的 Controller 都要扫到。对外接口和内部接口分开标注。</p><p><strong>提示词 5：数据模型</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>看项目的 entity 类、DTO、数据库建表 SQL，给我梳理核心数据模型。</span></span>
<span class="line"><span>每个模型列出字段、类型、一句话说明。标出主键、外键、枚举值。</span></span>
<span class="line"><span>关键模型之间的关系画一张简单的 ER 图。</span></span>
<span class="line"><span>保存到 docs/data-model.md 和 docs/data-model-er.svg。</span></span></code></pre></div><p>产出： <code>docs/data-model.md</code> + <code>docs/data-model-er.svg</code></p><p>review 重点：以 DB 层为准、entity 和 DTO 分开说、通过 <code>findBy</code> 反查出隐式外键关系。</p><p><strong>提示词 6：两份资产互相校对</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>对照 docs/api-list.md 和 docs/data-model.md，</span></span>
<span class="line"><span>看接口里提到的每个实体在数据模型里是不是都有定义。</span></span>
<span class="line"><span>有不一致的地方列出来。</span></span>
<span class="line"><span>然后验证不一致的地方并修复。</span></span></code></pre></div><p>产出：一份不一致点清单，AI 自动修正两份资产，直到自洽。</p><p>跑完这一步， <code>docs/</code> 里有五份资产：architecture.svg、module-deps.svg、external-deps.svg、api-list.md、data-model.md + data-model-er.svg。</p><h2 id="场景三-生成-claude-md" tabindex="-1">场景三：生成 CLAUDE.md <a class="header-anchor" href="#场景三-生成-claude-md" aria-label="Permalink to &quot;场景三：生成 CLAUDE.md&quot;">​</a></h2><p>对应 10 讲。产出项目根目录的 CLAUDE.md。</p><p><strong>提示词 7：基于 docs/ 生成 CLAUDE.md 初稿</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>读 docs/ 下的所有资产，给我生成一份 CLAUDE.md 初稿。</span></span>
<span class="line"><span>精简：项目定位、核心架构、关键模块、关键约定、怎么跑，</span></span>
<span class="line"><span>外加两节空着的：禁区、历史包袱。</span></span>
<span class="line"><span>架构图、接口清单、数据模型的详细内容不要复制进来，</span></span>
<span class="line"><span>用链接指向 docs/ 就好。保存到项目根目录的 CLAUDE.md。</span></span></code></pre></div><p>产出：项目根目录 <code>CLAUDE.md</code>（前五节 AI 生成、禁区和历史包袱留空）</p><p><strong>手写禁区和历史包袱</strong>。这两节 AI 填不出来，必须自己写。没思路就列一两条暂时占位，后面改造中踩到坑了再补。</p><p>review 重点：总长度不超过 300 行、没有重复 docs/ 的内容（都用链接指向）、禁区和历史包袱两节有真实内容。</p><h2 id="场景四-挖出第一个-skill" tabindex="-1">场景四：挖出第一个 SKILL <a class="header-anchor" href="#场景四-挖出第一个-skill" aria-label="Permalink to &quot;场景四：挖出第一个 SKILL&quot;">​</a></h2><p>对应 11 讲。三步挖掘法：让 AI 分析项目、出 Top 3 候选、选一个生成完整 SKILL。</p><p><strong>提示词 8：让 AI 分析项目重复流程</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>扫一下当前项目（包括 git log、CLAUDE.md、docs/、README、CONTRIBUTING、.github/），</span></span>
<span class="line"><span>找出团队反复在做的操作流程。</span></span>
<span class="line"><span>判断标准是三特征：可复制、可参数化、可自动化。</span></span>
<span class="line"><span>三个都满足才算值得做 SKILL 的候选。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>把找到的候选列出来，每个写明：流程名、为什么是反复的、能参数化的部分、</span></span>
<span class="line"><span>是什么、起点和终点是什么。最后给我用一个表格总结。</span></span></code></pre></div><p>产出：5-10 项候选清单。</p><p><strong>提示词 9：让 AI 出 Top 3 推荐</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>从上面的清单里挑 3 个最高优先级的，给我做成候选 SKILL。</span></span>
<span class="line"><span>每个候选写：name（英文）、description、预期 steps、allowed-tools。</span></span>
<span class="line"><span>优先级判断标准：频率高、痛点深、自动化收益大。用表格总结，包含类型和理由。</span></span></code></pre></div><p>产出：三个候选 SKILL。预期 Top 3 大概率包含“技术文档自动更新”（docs-auto-sync），因为它的频率最高、痛点最深、自动化收益最大。</p><p><strong>提示词 10：生成完整 SKILL.md</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于上面的候选，生成 docs-auto-sync 的完整 SKILL.md。要求：</span></span>
<span class="line"><span>- 名字 docs-auto-sync</span></span>
<span class="line"><span>- description 写清楚什么场景触发、产出是什么</span></span>
<span class="line"><span>- steps 清晰可执行</span></span>
<span class="line"><span>- allowed-tools 限制到最小</span></span>
<span class="line"><span>- 重要：只汇报不一致的地方，不要自动改文件，让人决定怎么处理</span></span>
<span class="line"><span>保存到 .claude/skills/docs-auto-sync/SKILL.md。</span></span></code></pre></div><p>产出： <code>.claude/skills/docs-auto-sync/SKILL.md</code></p><p><strong>完全退出 Claude Code 再重新启动</strong>，让 SKILL 生效。</p><p>测试 SKILL 是否可用：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我刚改完一批 Controller，帮我看看文档还对不对得上。</span></span></code></pre></div><p>Claude Code 应该自动加载 <code>docs-auto-sync</code> 这个 Skill 并按步骤跑。</p><h2 id="一键跑完全流程-让-claude-code-自主执行" tabindex="-1">一键跑完全流程：让 Claude Code 自主执行 <a class="header-anchor" href="#一键跑完全流程-让-claude-code-自主执行" aria-label="Permalink to &quot;一键跑完全流程：让 Claude Code 自主执行&quot;">​</a></h2><p>前面四个场景一个个跑，是为了让你看清每一步的产出和 review 点。真正上手之后，你会希望 <strong>一次粘贴、Claude Code 自主跑完所有步骤、遇到问题自己修、跑完自己验收</strong>。</p><p>下面这段提示词就是干这个的。整段粘贴到 Claude Code，你去喝杯咖啡，回来就齐了。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我刚 clone 了 Spring AI Alibaba Admin。现在帮我完整摸清这个项目，</span></span>
<span class="line"><span>产出一整套 AI 协作基础设施。整个过程你自主推进，遇到问题自己修、</span></span>
<span class="line"><span>自己 review、自己决定下一步，不要每一步都问我。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请按以下顺序执行：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第一步：画三张全景图，保存到 docs/</span></span>
<span class="line"><span>- architecture.svg（分层架构图，核心模块写一句话职责）</span></span>
<span class="line"><span>- module-deps.svg（内部模块依赖，循环依赖红色标出）</span></span>
<span class="line"><span>- external-deps.svg（Java 依赖 + 中间件 + 外部 API 三类）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第二步：梳理接口和数据模型</span></span>
<span class="line"><span>- docs/api-list.md（REST 接口清单,按模块分组,对外/内部区分）</span></span>
<span class="line"><span>- docs/data-model.md 和 docs/data-model-er.svg（以 DB 层为准）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第三步：对照以上两份，列出不一致的地方并修正，直到自洽</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第四步：基于 docs/ 下的所有产出，生成项目根目录的 CLAUDE.md</span></span>
<span class="line"><span>- 前五节（项目定位、核心架构、关键模块、关键约定、怎么跑）你自己基于 docs/ 生成</span></span>
<span class="line"><span>- 禁区和历史包袱两节留空，写&quot;待 Robert 补充&quot;占位</span></span>
<span class="line"><span>- 整体控制在 300 行以内，不要把 docs/ 的内容复制进来</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第五步：基于这个项目挖出最高优先级的一个 SKILL，生成完整的 SKILL.md</span></span>
<span class="line"><span>- 优先选&quot;技术文档自动更新&quot;（docs-auto-sync），解决代码改了但文档没跟上的问题</span></span>
<span class="line"><span>- 保存到 .claude/skills/docs-auto-sync/SKILL.md</span></span>
<span class="line"><span>- 只读不写（allowed-tools: Read, Grep）</span></span>
<span class="line"><span>- 步骤清晰，不自动修正，只报告</span></span>
<span class="line"><span></span></span>
<span class="line"><span>自主原则：</span></span>
<span class="line"><span>- 每一步跑完自己 review 输出质量，不合格自己重跑</span></span>
<span class="line"><span>- 图里有漏、有错、有不清晰的地方，主动补充或重画</span></span>
<span class="line"><span>- 遇到项目特有的细节（比如多模块、前后端分离），自己处理</span></span>
<span class="line"><span>- 所有步骤跑完后，生成一份 summary，列出每个产出文件、</span></span>
<span class="line"><span>  每份资产的主要内容概括、你认为还需要人工确认的地方</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不要打断来问我。有判断不清的地方先做一个合理选择，</span></span>
<span class="line"><span>在最后的 summary 里标记出来。跑完再汇报。</span></span></code></pre></div><p>粘贴完等 Claude Code 自己跑。时间大概 15-30 分钟，取决于你的模型速度和项目大小。</p><p><strong>为什么这段提示词这么写？</strong></p><p>第一， <strong>明确告诉 AI 自主</strong>。“不要每一步都问我”是关键一句。老项目改造里 AI 默认会频繁确认，这在探索阶段合理，但一键流程里会打断节奏。明确授权自主决策，AI 才会真的一口气跑完。</p><p>第二， <strong>把 review 责任交给 AI</strong>。“每一步跑完自己 review 输出质量，不合格自己重跑”，这一句让 AI 对产出负责，不是产出完就丢给你。</p><p>第三， <strong>用 summary 替代中途打断</strong>。让 AI 把“我不确定的地方”都攒到最后，一次性给你。你花 5 分钟读 summary 做决策，比中间被打断十次效率高得多。</p><p>第四， <strong>占位禁区和历史包袱</strong>。这两节 AI 不该填，所以让它写“待 Robert 补充”占位，避免 AI 瞎编。</p><h2 id="跑完之后的样子" tabindex="-1">跑完之后的样子 <a class="header-anchor" href="#跑完之后的样子" aria-label="Permalink to &quot;跑完之后的样子&quot;">​</a></h2><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring-ai-alibaba-admin/</span></span>
<span class="line"><span>├── CLAUDE.md                          ← 项目常识 + 禁区 + 历史包袱</span></span>
<span class="line"><span>├── .claude/skills/</span></span>
<span class="line"><span>│   └── docs-auto-sync/</span></span>
<span class="line"><span>│       └── SKILL.md                   ← 第一个自己挖的 skill</span></span>
<span class="line"><span>└── docs/</span></span>
<span class="line"><span>    ├── architecture.svg               ← 架构图</span></span>
<span class="line"><span>    ├── module-deps.svg                ← 模块依赖图</span></span>
<span class="line"><span>    ├── external-deps.svg              ← 外部依赖图</span></span>
<span class="line"><span>    ├── api-list.md                    ← REST 接口清单</span></span>
<span class="line"><span>    ├── data-model.md                  ← 数据模型说明</span></span>
<span class="line"><span>    └── data-model-er.svg              ← ER 图</span></span></code></pre></div><p>这就是一个老项目的 AI 协作基础设施。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>第二部分结束。从 06 讲八步心法到 11 讲第一个 SKILL，整个“了解项目”的方法论在 Spring AI Alibaba Admin 上跑完一遍。</p><p>接下来从 13 讲开始第三部分： <strong>编译 + 测试 + 建立护栏</strong>。理解了项目还不够，要能跑起来、能验证、能兜底。有了这些，我们到第四部分才能安心动手做真实的需求改造。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>跑完整套流程大约花了你多少时间？在你自己公司的项目上跑一遍，你估计会花多久？</p></li><li><p>这一讲产出的 7 份资产里（5 份 docs + 1 份 CLAUDE.md + 1 份 SKILL），你觉得哪一份对你团队价值最大？为什么？</p></li></ol><p>欢迎在评论区把你的答案写出来。如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,76)])])}const u=a(l,[["render",i]]);export{g as __pageData,u as default};
