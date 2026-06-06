import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"16｜实操课：给一个老项目建立完整改造前护栏的全流程演示","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备","slug":"准备","link":"#准备","children":[]},{"level":2,"title":"场景一：让 AI 当你的环境工程师","slug":"场景一-让-ai-当你的环境工程师","link":"#场景一-让-ai-当你的环境工程师","children":[]},{"level":2,"title":"场景二：摸清测试现状","slug":"场景二-摸清测试现状","link":"#场景二-摸清测试现状","children":[]},{"level":2,"title":"场景三：补出兜底测试","slug":"场景三-补出兜底测试","link":"#场景三-补出兜底测试","children":[]},{"level":2,"title":"场景四：让 CI 当你的兜底护栏","slug":"场景四-让-ci-当你的兜底护栏","link":"#场景四-让-ci-当你的兜底护栏","children":[]},{"level":2,"title":"一键跑完全流程：让 Claude Code 自主执行","slug":"一键跑完全流程-让-claude-code-自主执行","link":"#一键跑完全流程-让-claude-code-自主执行","children":[]},{"level":2,"title":"跑完之后的样子","slug":"跑完之后的样子","link":"#跑完之后的样子","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"ClaudeCode企业级老项目改造实战/16｜实操课：给一个老项目建立完整改造前护栏的全流程演示.md","filePath":"ClaudeCode企业级老项目改造实战/16｜实操课：给一个老项目建立完整改造前护栏的全流程演示.md","lastUpdated":1779815445000}'),l={name:"ClaudeCode企业级老项目改造实战/16｜实操课：给一个老项目建立完整改造前护栏的全流程演示.md"};function i(t,s,c,o,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_16-实操课-给一个老项目建立完整改造前护栏的全流程演示" tabindex="-1">16｜实操课：给一个老项目建立完整改造前护栏的全流程演示 <a class="header-anchor" href="#_16-实操课-给一个老项目建立完整改造前护栏的全流程演示" aria-label="Permalink to &quot;16｜实操课：给一个老项目建立完整改造前护栏的全流程演示&quot;">​</a></h1><p>你好，我是 Robert。</p><p>这一讲是第三部分的收尾。前面 13-15 讲每一讲做一件事，这一讲把环境搭建、测试摸底、补测试、CI 集成的所有动作在 Spring AI Alibaba Admin 上连起来跑一遍。从项目还没跑起来，到项目活了 + 测试摸清 + 必要的兜底测试补上 + CI 自动跑护栏到位。</p><p>这是一节实操课，视频演示。提示词都在下面，你可以打开 Claude Code 照着跑。跑完你的 <code>spring-ai-alibaba-admin</code> 目录里就有完整的改造前护栏。</p><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-label="Permalink to &quot;准备&quot;">​</a></h2><p>13 讲里你已经做过准备工作。如果环境还在，跳过这一节。如果是新机器或者重置过：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd spring-ai-alibaba/spring-ai-alibaba-admin</span></span></code></pre></div><p>确认 docs/ 里 12 讲跑出的资产都在（architecture.svg、api-list.md、data-model.md 等）。这一讲所有动作都依赖这些资产。</p><p>在项目根目录启动 Claude Code，后面所有提示词都在这里跑。</p><h2 id="场景一-让-ai-当你的环境工程师" tabindex="-1">场景一：让 AI 当你的环境工程师 <a class="header-anchor" href="#场景一-让-ai-当你的环境工程师" aria-label="Permalink to &quot;场景一：让 AI 当你的环境工程师&quot;">​</a></h2><p>对应 13 讲。产出依赖清单 + 安装脚本 + 启停脚本 + 应用跑起来 + 接口冒烟。</p><p><strong>提示词 1：依赖盘点</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>综合看 docs/external-deps.svg、application*.yml、pom.xml、README，</span></span>
<span class="line"><span>给我列一份这个项目运行需要的完整外部依赖清单。</span></span>
<span class="line"><span>每个依赖列出：名字、版本要求（精确到主版本）、默认端口、</span></span>
<span class="line"><span>连接信息、初始化要求（建库、配 Nacos 命名空间等）。</span></span>
<span class="line"><span>输出用表格总结。保存到 docs/env-checklist.md。</span></span></code></pre></div><p>产出： <code>docs/env-checklist.md</code></p><p>review 重点：和 docs/external-deps.svg 对得上、版本号有依据、初始化要求要细。</p><p><strong>提示词 2A：本地安装方案</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>读 docs/env-checklist.md，给我生成一份本地安装脚本，</span></span>
<span class="line"><span>保存到 scripts/install-deps.sh。</span></span>
<span class="line"><span>- 用 brew（macOS）或 apt（Linux）装中间件</span></span>
<span class="line"><span>- 包含每个中间件的初始化（建库 SQL、Nacos 配置等）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>生成完直接执行这个脚本。执行过程遵循自主修复原则：</span></span>
<span class="line"><span>任何一步失败先看报错、自己判断原因、自己修、修完重试。</span></span>
<span class="line"><span>不要每个错误都问我。同一个错误连续修 3 次还不行，停下来汇报具体卡在哪。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最终输出 scripts/install-log.md，</span></span>
<span class="line"><span>记录每个中间件最终用了什么命令装上、过程中遇到什么问题、怎么修的。</span></span></code></pre></div><p>产出： <code>scripts/install-deps.sh</code> + <code>scripts/install-log.md</code></p><p>review 重点：脚本对每个中间件包含“装 + 初始化 + 验证”三步、3 次失败兜底有效防止死循环。</p><p><strong>提示词 2B：依赖启停脚本</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 Step 2A 装好的中间件，生成三个脚本到 scripts/ 下：</span></span>
<span class="line"><span>- deps-start.sh：一键启动所有依赖中间件</span></span>
<span class="line"><span>- deps-stop.sh：一键停止所有依赖中间件</span></span>
<span class="line"><span>- deps-status.sh：查看每个中间件的运行状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>考虑混合场景：有的用 brew services 管，有的是手动 jar，</span></span>
<span class="line"><span>有的是 systemd。脚本要能处理这几种。</span></span>
<span class="line"><span>启动后等服务就绪再返回，不要&quot;启动了但还没 ready&quot;。</span></span></code></pre></div><p>产出： <code>scripts/deps-start.sh</code> / <code>deps-stop.sh</code> / <code>deps-status.sh</code></p><p>review 重点：启动顺序对（Nacos 在 OTel Collector 前、MySQL 在应用前）、status 输出清晰。</p><p><strong>提示词 2C：Docker 备选方案</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>顺手给一份 docker-compose.dev.yml，把所有依赖打包成 docker。</span></span>
<span class="line"><span>偏好 Docker 的同学可以用这个替代 Step 2A 和 2B。</span></span>
<span class="line"><span>版本号、端口、初始化脚本要齐全。保存到项目根目录。</span></span></code></pre></div><p>产出： <code>docker-compose.dev.yml</code>（备选）</p><p><strong>提示词 3：编译启动</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>中间件已经起来了（用 ./scripts/deps-status.sh 确认）。</span></span>
<span class="line"><span>现在帮我跑 mvn clean package + 启动应用。</span></span>
<span class="line"><span>启动过程遵循自主修复原则（参照 install 脚本的兜底机制：</span></span>
<span class="line"><span>连续 3 次同一错误才停下来汇报）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>启动成功后告诉我应用监听的端口、管理界面地址。</span></span>
<span class="line"><span>失败和修复的过程记到 docs/startup-log.md。</span></span></code></pre></div><p>产出：项目跑起来 + <code>docs/startup-log.md</code></p><p>review 重点：日志没报 ERROR、端口监听正常、管理界面能打开。</p><p><strong>提示词 4：接口冒烟</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>读 docs/api-list.md，挑 5 个最核心的接口（覆盖登录、Prompt、</span></span>
<span class="line"><span>Dataset、Evaluator、Trace 几大模块），用 curl 跑一遍。</span></span>
<span class="line"><span>返回 200 算通过，返回错误的列出来。</span></span>
<span class="line"><span>输出用表格总结，保存到 docs/smoke-test-result.md。</span></span></code></pre></div><p>产出： <code>docs/smoke-test-result.md</code></p><p>review 重点：选的接口真的核心、返回结构和 api-list.md 一致、错误的诚实列出来。</p><p>跑完场景一， <strong>项目活了</strong>。</p><h2 id="场景二-摸清测试现状" tabindex="-1">场景二：摸清测试现状 <a class="header-anchor" href="#场景二-摸清测试现状" aria-label="Permalink to &quot;场景二：摸清测试现状&quot;">​</a></h2><p>对应 14 讲。产出核心链路、现有测试状态、缺口清单。</p><p><strong>提示词 5：摸核心链路</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 docs/api-list.md、docs/data-model.md、CLAUDE.md，给我列出</span></span>
<span class="line"><span>这个项目最值得测的核心链路。要求：</span></span>
<span class="line"><span>- 总数不超过 8 条，宁少勿多</span></span>
<span class="line"><span>- 必须是&quot;改造时容易出问题&quot;的链路，不是所有链路</span></span>
<span class="line"><span>- 每条写：链路名、起点（哪个接口）、关键节点、终点（什么状态）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出用表格总结。保存到 docs/critical-paths.md。</span></span></code></pre></div><p>产出： <code>docs/critical-paths.md</code></p><p>review 重点：是不是真的核心（登录 / Prompt CRUD / Dataset CRUD / Evaluator 跑批 / 实验执行 / Trace 写入这种是；账号详情查询不是）。</p><p><strong>提示词 6：摸现有测试</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>扫一下项目里所有的测试目录（src/test、tests/、e2e/ 等），</span></span>
<span class="line"><span>统计现有测试情况。要求：</span></span>
<span class="line"><span>- 单元测试 / 集成测试 / E2E 各多少个文件</span></span>
<span class="line"><span>- 哪些 Controller 有对应的测试，哪些没有</span></span>
<span class="line"><span>- 哪些核心 Service 有测试，哪些没有</span></span>
<span class="line"><span>- 不要给覆盖率百分比，那是 JaCoCo 干的事</span></span>
<span class="line"><span>- 不要列出每个测试方法，只关注&quot;哪些核心链路被覆盖&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对照 docs/critical-paths.md，标出每条核心链路当前的测试覆盖</span></span>
<span class="line"><span>情况（有 / 部分 / 没有）。输出用表格总结。</span></span>
<span class="line"><span>保存到 docs/test-status.md。</span></span></code></pre></div><p>产出： <code>docs/test-status.md</code></p><p>review 重点：按链路验证，不是按文件验证，文件存在不代表链路被覆盖。</p><p><strong>提示词 7：跑一遍看实际状态</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>跑一遍 mvn test（或项目的标准测试命令），统计真实结果：</span></span>
<span class="line"><span>- 通过 / 失败 / 跳过 各多少</span></span>
<span class="line"><span>- 失败的分类：代码 bug / 测试本身坏了 / 环境问题</span></span>
<span class="line"><span>- 跑总耗时多少</span></span>
<span class="line"><span>- 不要试图修复失败的测试，只汇报状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最后给一个&quot;测试健康度&quot;的判断：绿（90% 通过）/ 黄（60-90%）/红（&amp;lt; 60%）。</span></span>
<span class="line"><span>输出用表格总结。</span></span>
<span class="line"><span>追加到 docs/test-status.md 的&quot;实际运行结果&quot;小节。</span></span></code></pre></div><p>产出：追加到 <code>docs/test-status.md</code></p><p>review 重点：失败分类要靠谱、跳过的也要算进健康度。</p><p><strong>提示词 8：算出缺口清单</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>对照 docs/critical-paths.md（应该测什么）和 docs/test-status.md</span></span>
<span class="line"><span>（现在测了什么），算出测试缺口。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>严格遵守以下原则：</span></span>
<span class="line"><span>- 总数不超过 20 项，宁少勿多</span></span>
<span class="line"><span>- 只列在核心链路上的缺口，不在主链路上的不要列</span></span>
<span class="line"><span>- 每项标 P0（改造前必须有）/ P1（有了更好）</span></span>
<span class="line"><span>- 不要追求覆盖率指标，追求&quot;关键路径有兜底&quot;</span></span>
<span class="line"><span>- 每项写：场景描述、为什么必须、建议测试类型（集成 / 单元 / Characterization Test）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出用表格总结。保存到 docs/test-gaps.md。</span></span></code></pre></div><p>产出： <code>docs/test-gaps.md</code></p><p>review 重点：P0 数量控制在 5-10 个。每个 P0 都对应明确的核心链路，P1 不超过 10 个。</p><p>跑完场景二， <strong>测试现状摸清，知道改造前必须补哪些测试了</strong>。</p><h2 id="场景三-补出兜底测试" tabindex="-1">场景三：补出兜底测试 <a class="header-anchor" href="#场景三-补出兜底测试" aria-label="Permalink to &quot;场景三：补出兜底测试&quot;">​</a></h2><p>对应 15 讲。产出补测试计划 + 一批一批补 + 跑通的测试。</p><p><strong>提示词 9：让 AI 补出测试计划</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 docs/test-gaps.md，把 P0 缺口拆成多批，每批 1-3 个</span></span>
<span class="line"><span>（最好 1 个），给我一份补测试计划。每批写：批次号、测试类型</span></span>
<span class="line"><span>（Characterization Test / 集成测试 / 单元测试）、覆盖的核心</span></span>
<span class="line"><span>链路、预期工作量。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按&quot;改造路径上的 Characterization &amp;gt; 核心链路集成 &amp;gt; 复杂逻辑</span></span>
<span class="line"><span>单元&quot;的顺序排批次。简单 CRUD 不进计划。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出用表格总结。保存到 docs/test-plan.md。</span></span></code></pre></div><p>产出： <code>docs/test-plan.md</code></p><p>review 重点：每批严格 1-3 个，不能更多、最好 1 个。批次顺序按价值优先级。简单 CRUD 真的没进计划。</p><p><strong>提示词 10：让 AI 一批一批补</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>按 docs/test-plan.md 的第 1 批，给项目补出对应的测试。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对 Characterization Test 类型：先跑一次现有代码记录实际行为，</span></span>
<span class="line"><span>再把行为转成断言。不要凭&quot;应该是什么&quot;写断言，凭&quot;实际是什么&quot;写。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对集成测试类型：需要真实启动应用 + 数据库。</span></span>
<span class="line"><span>用 SpringBootTest的方式起完整 context 跑。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>补完跑一遍 mvn test 确保都通过。</span></span>
<span class="line"><span>输出用表格总结每个测试覆盖的场景、预期结果、实际跑出来的状态。</span></span></code></pre></div><p>产出：第 1 批 1-3 个测试 + 跑通的结果</p><p>review 重点（最关键）：</p><ul><li><p>测试是不是测了“现在实际做什么”，不是“AI 觉得应该做什么”</p></li><li><p>测试覆盖的场景对不对，有没有忽略 edge case</p></li><li><p>测试都能跑通</p></li></ul><p>review 通过后开第 2 批：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>按 docs/test-plan.md 的第 2 批补测试，</span></span>
<span class="line"><span>参考第 1 批已经跑通的测试风格，保持一致。</span></span>
<span class="line"><span>其他要求同前。</span></span></code></pre></div><p>按这个节奏直到所有 P0 批次跑完。</p><p>跑完场景三， <strong>P0 测试缺口全部补上</strong>。</p><h2 id="场景四-让-ci-当你的兜底护栏" tabindex="-1">场景四：让 CI 当你的兜底护栏 <a class="header-anchor" href="#场景四-让-ci-当你的兜底护栏" aria-label="Permalink to &quot;场景四：让 CI 当你的兜底护栏&quot;">​</a></h2><p>对应 15 讲后半。产出 CI 配置 + 跑通自动化护栏。</p><p><strong>提示词 11：让 AI 分析项目当前的 CI 状态</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>扫一下项目里有没有现成的 CI 配置（看 .github/workflows/、.gitlab-ci.yml、Jenkinsfile 之类）。</span></span>
<span class="line"><span>如果有，告诉我现在跑了什么、什么时候触发、有没有跑测试。</span></span>
<span class="line"><span>如果没有，告诉我项目代码托管在哪个平台，建议用哪种 CI。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出用表格总结。</span></span></code></pre></div><p>产出：CI 现状分析</p><p><strong>提示词 12：让 AI 写完整的 CI workflow</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于上一步的分析，给我写一份完整的 CI workflow。要求：</span></span>
<span class="line"><span>- 触发条件：push 到任何分支 + 提 PR 时</span></span>
<span class="line"><span>- 运行环境：用项目对应的 JDK 版本（看 pom.xml 里 java.version）</span></span>
<span class="line"><span>- 启动需要的中间件（参考 docker-compose.dev.yml）</span></span>
<span class="line"><span>- 跑 mvn clean test，失败就 block merge</span></span>
<span class="line"><span>- 输出测试报告到 CI artifact 区方便 review</span></span>
<span class="line"><span>- 加合理的 cache（Maven 依赖缓存）让跑得快一点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出完整的 .github/workflows/test.yml（或对应平台的配置文件），</span></span>
<span class="line"><span>我直接 commit 进仓库就能跑。</span></span></code></pre></div><p>产出： <code>.github/workflows/test.yml</code> 或 <code>.gitlab-ci.yml</code></p><p>review 重点：触发条件对，中间件配置完整，JDK 版本对齐 pom.xml。</p><p><strong>提示词 13：跑通 CI</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>push 一次代码触发 CI，看能不能跑通。失败就自己 debug 自己修，</span></span>
<span class="line"><span>跟 install 脚本一样的自主修复原则（连续 3 次同错才停下来汇报）。</span></span>
<span class="line"><span>最终跑通后告诉我 CI 跑一次需要多久。</span></span></code></pre></div><p>产出：CI 第一次绿色构建</p><p>review 重点：CI 绿色 + 测试报告能下载 + 跑的时长合理（10 分钟内）。</p><p>跑完场景四， <strong>改造前的所有护栏都到位了</strong>。</p><h2 id="一键跑完全流程-让-claude-code-自主执行" tabindex="-1">一键跑完全流程：让 Claude Code 自主执行 <a class="header-anchor" href="#一键跑完全流程-让-claude-code-自主执行" aria-label="Permalink to &quot;一键跑完全流程：让 Claude Code 自主执行&quot;">​</a></h2><p>前面四个场景一个个跑，是为了让你看清每一步的产出和 review 点。真正上手之后你会希望 <strong>一次粘贴、Claude Code 自主跑完所有步骤、遇到问题自己修、跑完自己验收</strong>。</p><p>下面这段提示词就是干这个的。整段粘贴到 Claude Code，你去吃个午饭，回来就齐了。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我刚跑完第二部分，docs/ 里有架构图、模块图、依赖图、接口清单、数据模型五份资产，</span></span>
<span class="line"><span>根目录有 CLAUDE.md，.claude/skills/ 下有 docs-auto-sync skill。</span></span>
<span class="line"><span>现在帮我完整跑通改造前的护栏建立流程，</span></span>
<span class="line"><span>全程自主推进，遇到问题自己修、自己 review、自己决定下一步，</span></span>
<span class="line"><span>不要每一步都问我。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请按以下顺序执行：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第一步：环境搭建</span></span>
<span class="line"><span>- 基于 docs/external-deps.svg + application*.yml + pom.xml 生成 docs/env-checklist.md</span></span>
<span class="line"><span>- 生成本地安装脚本 scripts/install-deps.sh 并执行（遵循自主修复原则：连续 3 次同错才停）</span></span>
<span class="line"><span>- 生成依赖启停脚本 deps-start.sh / deps-stop.sh / deps-status.sh</span></span>
<span class="line"><span>- 顺手给一份 docker-compose.dev.yml 备选</span></span>
<span class="line"><span>- 跑 mvn package + 启动应用，记录 docs/startup-log.md</span></span>
<span class="line"><span>- 用 curl 跑 5 个核心接口冒烟，记录 docs/smoke-test-result.md</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第二步：测试摸底</span></span>
<span class="line"><span>- 基于已有资产列 8 条核心链路，保存到 docs/critical-paths.md</span></span>
<span class="line"><span>- 扫现有测试状态，对照核心链路标覆盖度，保存到 docs/test-status.md</span></span>
<span class="line"><span>- 跑一遍 mvn test 看真实结果，追加到 test-status.md</span></span>
<span class="line"><span>- 算出测试缺口清单 docs/test-gaps.md，P0 不超过 10 个，P1 不超过 10 个，每项标场景描述和建议类型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第三步：补 P0 测试</span></span>
<span class="line"><span>- 拆补测试计划 docs/test-plan.md，每批 1-3 个最好 1 个</span></span>
<span class="line"><span>- 按计划一批一批补，每批跑通了才进下一批</span></span>
<span class="line"><span>- Characterization Test 必须凭&quot;实际行为&quot;写断言，不凭&quot;应该&quot;</span></span>
<span class="line"><span>- 所有 P0 批次跑完确认 mvn test 全绿</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第四步：CI 集成</span></span>
<span class="line"><span>- 分析项目当前 CI 状态</span></span>
<span class="line"><span>- 写一份完整 .github/workflows/test.yml（或对应平台）</span></span>
<span class="line"><span>- push 触发一次 CI 跑通</span></span>
<span class="line"><span></span></span>
<span class="line"><span>自主原则：</span></span>
<span class="line"><span>- 每一步跑完自己 review 输出质量，不合格自己重跑</span></span>
<span class="line"><span>- 遇到失败自己 debug 自己修（除非连续 3 次同一错误）</span></span>
<span class="line"><span>- 测试别贪多，每批严格 1-3 个最好 1 个</span></span>
<span class="line"><span>- 测试断言凭实际不凭应该</span></span>
<span class="line"><span>- 所有步骤跑完后，生成一份 summary.md，列出每个产出文件、</span></span>
<span class="line"><span>  每份资产的主要内容概括、你认为还需要人工确认的地方</span></span>
<span class="line"><span>  （特别是补的测试是否都凭&quot;实际行为&quot;写的）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不要打断来问我。有判断不清的地方先做一个合理选择，</span></span>
<span class="line"><span>在 summary里标记。跑完再汇报。</span></span></code></pre></div><p>粘贴完等 Claude Code 自己跑。时间大概 1-2 小时（环境搭建快、补测试慢，主要时间花在补测试和等 mvn 编译）。</p><p><strong>为什么这段提示词这么写？</strong></p><ol><li><p><strong>所有 1-3 个、自主修复、3 次兜底等关键约束都明确写进去</strong>。这些约束在 13-15 讲反复强调，跑一键流程时 AI 默认会“贪快”批量补一堆测试，必须把约束写得很硬。</p></li><li><p><strong>测试断言凭实际不凭应该</strong>，这句话单独列出来。这是 15 讲最值钱的洞察，AI 一不留神就会按“业务直觉”补断言导致测试无效。</p></li><li><p><strong>人工确认点在 summary 里集中暴露</strong>。让 AI 把“我不确定的地方”都攒到最后，特别是测试断言这种容易踩坑的，标出来让你重点 review。</p></li></ol><h2 id="跑完之后的样子" tabindex="-1">跑完之后的样子 <a class="header-anchor" href="#跑完之后的样子" aria-label="Permalink to &quot;跑完之后的样子&quot;">​</a></h2><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring-ai-alibaba-admin/</span></span>
<span class="line"><span>├── CLAUDE.md</span></span>
<span class="line"><span>├── .claude/skills/</span></span>
<span class="line"><span>│   ├── docs-auto-sync/</span></span>
<span class="line"><span>│   │   └── SKILL.md</span></span>
<span class="line"><span>│   └── env-bootstrap/                ← 13 讲挖到的新 skill</span></span>
<span class="line"><span>│       └── SKILL.md</span></span>
<span class="line"><span>├── .github/workflows/</span></span>
<span class="line"><span>│   └── test.yml                      ← CI 护栏</span></span>
<span class="line"><span>├── scripts/</span></span>
<span class="line"><span>│   ├── install-deps.sh</span></span>
<span class="line"><span>│   ├── install-log.md</span></span>
<span class="line"><span>│   ├── deps-start.sh</span></span>
<span class="line"><span>│   ├── deps-stop.sh</span></span>
<span class="line"><span>│   └── deps-status.sh</span></span>
<span class="line"><span>├── docker-compose.dev.yml            ← Docker 备选</span></span>
<span class="line"><span>├── docs/</span></span>
<span class="line"><span>│   ├── architecture.svg              # 08 讲</span></span>
<span class="line"><span>│   ├── module-deps.svg               # 08 讲</span></span>
<span class="line"><span>│   ├── external-deps.svg             # 08 讲</span></span>
<span class="line"><span>│   ├── api-list.md                   # 09 讲</span></span>
<span class="line"><span>│   ├── data-model.md                 # 09 讲</span></span>
<span class="line"><span>│   ├── data-model-er.svg             # 09 讲</span></span>
<span class="line"><span>│   ├── env-checklist.md              # 13 讲</span></span>
<span class="line"><span>│   ├── startup-log.md                # 13 讲</span></span>
<span class="line"><span>│   ├── smoke-test-result.md          # 13 讲</span></span>
<span class="line"><span>│   ├── setup-guide.md                # 13 讲</span></span>
<span class="line"><span>│   ├── critical-paths.md             # 14 讲</span></span>
<span class="line"><span>│   ├── test-status.md                # 14 讲</span></span>
<span class="line"><span>│   ├── test-gaps.md                  # 14 讲</span></span>
<span class="line"><span>│   └── test-plan.md                  # 15 讲</span></span>
<span class="line"><span>└── src/test/                         ← P0 测试已补</span></span></code></pre></div><p>这就是一个老项目的完整 AI 协作基础设施 + 改造前护栏。每次 push 触发 CI，每天上班 deps-start，docs/ 里每份资产都对应一类共识，CLAUDE.md 是 AI 的常识门面，两个 SKILL 守着重复流程的自动化。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>第三部分到这里结束。从 13 讲让 AI 当环境工程师、到 14 讲摸清测试、到 15 讲补出兜底测试和 CI 护栏，整个“改造前准备”的方法论全部跑完。</p><p>第二部分加第三部分加起来一句话： <strong>理解了项目（脑图）、跑通了项目（环境）、护住了项目（测试 + CI）</strong>。这三件事做完，才有资格谈改造。</p><p>下一讲第四部分开始，我们终于要动手做真实需求改造了。我们会从一个模糊的业务需求出发，让 AI 帮你拆出一份能直接指导开发的技术文档。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>跑完整套流程大约花了你多少时间？最卡你的是哪一步：环境搭建、补测试、还是 CI 跑通？</p></li><li><p>这一讲产出的资产里（docs/ 14 份 + scripts/ 5 份 + .github/workflows/ 1 份 + .claude/skills/ 2 份），哪一份你觉得对你团队价值最大？为什么？</p></li></ol><p>欢迎在评论区把你的答案写出来。如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,100)])])}const g=a(l,[["render",i]]);export{u as __pageData,g as default};
