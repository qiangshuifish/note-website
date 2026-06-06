import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"30｜实操课：测试部署全流程演示","description":"","frontmatter":{},"headers":[{"level":2,"title":"真实体验，我先说三句话","slug":"真实体验-我先说三句话","link":"#真实体验-我先说三句话","children":[]},{"level":2,"title":"场景一：识别核心链路，写入CLAUDE.md","slug":"场景一-识别核心链路-写入claude-md","link":"#场景一-识别核心链路-写入claude-md","children":[]},{"level":2,"title":"场景二：单测执行——看Claude Code如何纠正一份错误的计划","slug":"场景二-单测执行——看claude-code如何纠正一份错误的计划","link":"#场景二-单测执行——看claude-code如何纠正一份错误的计划","children":[]},{"level":2,"title":"场景三：集成测试——测试驱动修复","slug":"场景三-集成测试——测试驱动修复","link":"#场景三-集成测试——测试驱动修复","children":[]},{"level":2,"title":"场景四：部署——咨询先行","slug":"场景四-部署——咨询先行","link":"#场景四-部署——咨询先行","children":[]},{"level":2,"title":"场景五：可观测性——从黑盒到透明","slug":"场景五-可观测性——从黑盒到透明","link":"#场景五-可观测性——从黑盒到透明","children":[]},{"level":2,"title":"四条核心动作","slug":"四条核心动作","link":"#四条核心动作","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"ClaudeCode企业级全链路开发实战/30｜实操课：测试部署全流程演示.md","filePath":"ClaudeCode企业级全链路开发实战/30｜实操课：测试部署全流程演示.md","lastUpdated":1779815375000}'),l={name:"ClaudeCode企业级全链路开发实战/30｜实操课：测试部署全流程演示.md"};function i(c,a,t,o,d,r){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_30-实操课-测试部署全流程演示" tabindex="-1">30｜实操课：测试部署全流程演示 <a class="header-anchor" href="#_30-实操课-测试部署全流程演示" aria-label="Permalink to &quot;30｜实操课：测试部署全流程演示&quot;">​</a></h1><p>你好，我是Robert。</p><p>27到29讲做了三件事：建质量体系、打包成可交付形态、加可观测性让系统从黑盒变透明。这一讲把它们放到真实操作里跑一遍。</p><p>建议先看完前三节课，再看这节实操课。图文讲明白为什么，视频展示做起来是什么感觉。</p><h2 id="真实体验-我先说三句话" tabindex="-1">真实体验，我先说三句话 <a class="header-anchor" href="#真实体验-我先说三句话" aria-label="Permalink to &quot;真实体验，我先说三句话&quot;">​</a></h2><p>第一句：这三讲的方法论，我自己总结是“先想清楚，再动手”。但想清楚这件事本身，Claude Code能帮你做大半。27讲的核心链路分析，Claude Code识别出来的风险点比我自己想的更全——有一个 <code>KnowledgeNodeExecutor</code> 里的O(n) 线性搜索是它在做清单分析时主动发现的，我没要求它找。这种“你没问它也说”的时刻，是我觉得用对了的信号。</p><p>第二句：28讲的部署，健康检查接口这个遗漏是Claude Code在咨询环节提醒我的。我没想到，它问了。如果我直接让它写Dockerfile，它永远不会主动说“你这个接口还没有”。咨询模式和执行模式是两种节奏，分开用效果差很多。</p><p>第三句：29讲的Grafana Dashboard，Claude Code在生成完后主动说 <code>DistributionSummary</code> 缺 <code>_bucket</code>，面板会空白。这个问题我不一定能发现。执行后自检这件事，Claude Code不是每次都做，但在这几讲里它做了，我觉得值得单独说一下。</p><p>下面展开五个场景。</p><h2 id="场景一-识别核心链路-写入claude-md" tabindex="-1">场景一：识别核心链路，写入CLAUDE.md <a class="header-anchor" href="#场景一-识别核心链路-写入claude-md" aria-label="Permalink to &quot;场景一：识别核心链路，写入CLAUDE.md&quot;">​</a></h2><p>所有测试的起点是知道测什么。先让Claude Code读完整个项目，输出核心链路清单和风险地图，你来确认，写进CLAUDE.md。</p><p>提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我分析这个系统，输出三个清单：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 核心链路清单（3-5条）</span></span>
<span class="line"><span>   每条链路：名称、涉及的模块和类、为什么是核心链路</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 风险集中区域</span></span>
<span class="line"><span>   哪些模块/方法最容易出问题、出了问题影响最大</span></span>
<span class="line"><span>   每个风险点：风险类型（安全/并发/性能/数据一致性）、可能的失败场景</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 测试重心建议</span></span>
<span class="line"><span>   基于前两条，测试精力应该往哪放</span></span>
<span class="line"><span>   哪些地方必须有测试覆盖，哪些可以先跳过</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出格式：结构化的 CLAUDE.md 片段，我直接复制进去。</span></span></code></pre></div><p>Claude Code读完代码后给出了5条核心链路和7个风险点，其中2个高危： <code>doStreamChat()</code> 里工作流路径抛 <code>RuntimeException</code> 时user消息落库但assistant消息缺失，以及 <code>selectRecentBySessionId</code> 的SQL取的是最旧消息而非最新。</p><p>拿到结果，对照自己的理解检查一遍。AI的分析基于代码结构，你的判断来自业务理解，两者对比才能确认这份地图是准的。确认后写进CLAUDE.md。这份地图会影响后面每一步：单测规范基于它生成，集成测试的P0优先级基于它划定。</p><p>接下来让Claude Code生成单测规范，同样基于这份地图，不是泛泛的通用规范。</p><p>提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 CLAUDE.md 中的核心链路和风险地图，帮我生成 Hify 项目的单元测试规范。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>规范需要覆盖：</span></span>
<span class="line"><span>1. 哪些代码必须写单测（结合核心链路判断）</span></span>
<span class="line"><span>2. 哪些代码不写单测、用集成测试替代（结合 Hify 的外部依赖特点）</span></span>
<span class="line"><span>3. 测试命名规范：should_[期望结果]_when_[输入条件]</span></span>
<span class="line"><span>4. 测试结构：Given-When-Then</span></span>
<span class="line"><span>5. mock 使用规范：什么时候 mock，什么时候不 mock</span></span>
<span class="line"><span>6. 断言规范：用 AssertJ，断言要有意义</span></span>
<span class="line"><span>7. 禁止事项：哪些写法不允许出现</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出格式：直接输出 CLAUDE.md 片段，我复制进去就能用。</span></span></code></pre></div><p>规范里有一条禁止事项特别值得关注：禁止在测试里写业务逻辑，不要重复计算期望值，直接写字面量。这是AI写测试时最常见的坏味道，它会把被测的计算逻辑在测试里再实现一遍，测试通过只能说明两段逻辑一样错。规范明确写出来，后续Claude Code写任何测试代码都会自动遵守。</p><h2 id="场景二-单测执行——看claude-code如何纠正一份错误的计划" tabindex="-1">场景二：单测执行——看Claude Code如何纠正一份错误的计划 <a class="header-anchor" href="#场景二-单测执行——看claude-code如何纠正一份错误的计划" aria-label="Permalink to &quot;场景二：单测执行——看Claude Code如何纠正一份错误的计划&quot;">​</a></h2><p>有了规范，先手动走一遍 <code>ProviderService</code> 的单测，跑通之后固化为SKILL。</p><p>先规划，不直接写代码：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>深度分析 ProviderService 的 createProvider 方法。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>告诉我：</span></span>
<span class="line"><span>1. 这个方法有哪些执行路径（正常路径 + 异常路径）</span></span>
<span class="line"><span>2. 每条路径的关键变量是什么</span></span>
<span class="line"><span>3. 哪些边界条件最容易出错</span></span>
<span class="line"><span></span></span>
<span class="line"><span>基于分析，给我一份测试计划：测哪些场景、每个场景验证什么断言。</span></span>
<span class="line"><span>先给计划，不要写代码。</span></span></code></pre></div><p>Claude Code给出了完整的执行路径树和11个测试场景，分P0/P1/P2三档。</p><p>然后我发了一份故意有三处错误的测试计划：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>测试计划确认如下：</span></span>
<span class="line"><span>- 正常创建：provider name 唯一，验证返回 id 且数据库有记录</span></span>
<span class="line"><span>- 重复名称：抛出 BizException，错误码 PROVIDER_NAME_DUPLICATE</span></span>
<span class="line"><span>- apiKey 格式校验：不符合格式，抛出 BizException</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按这个计划写单元测试。</span></span>
<span class="line"><span>约束：用 &amp;#64;MockBean mock 掉，只写单元测试。</span></span></code></pre></div><p>Claude Code没有照着错误的计划直接写代码，而是先指出了三个问题：</p><ul><li><p>“验证数据库有记录”在单测里做不到， <code>insert()</code> 被mock掉后数据不会真正写库，只能验证 <code>insert()</code> 被调用了一次。</p></li><li><p>“apiKey格式校验”在代码里根本不存在，这条测试没有被测对象。</p></li><li><p><code>@MockBean</code> 需要启动Spring Context，和“只写单元测试”冲突，应该用 <code>@Mock + @InjectMocks + @ExtendWith(MockitoExtension.class)</code>。</p></li></ul><p>高风险的任务先咨询再执行——测试计划、架构方案、接口设计，先让Claude Code过一遍，不要直接让它写代码。</p><p>确认后Claude Code生成两个文件，流程固化为SKILL放在 <code>.claude/skills/unit-test.md</code>，以后 <code>/单测AgentService.createAgent</code>，Claude Code自动走完整流程。</p><h2 id="场景三-集成测试——测试驱动修复" tabindex="-1">场景三：集成测试——测试驱动修复 <a class="header-anchor" href="#场景三-集成测试——测试驱动修复" aria-label="Permalink to &quot;场景三：集成测试——测试驱动修复&quot;">​</a></h2><p>集成测试是Hify的主力：Spring Boot Test完整启动，mock掉外部API，打真实HTTP请求，走完从Controller到数据库的完整链路。</p><p>先规划清单：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 CLAUDE.md 中的核心链路和风险地图，帮我规划 Hify 的集成测试清单。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试范围：Spring Boot Test + MockMvc，mock 掉 LLM API 和 MCP Server，</span></span>
<span class="line"><span>测试 Hify 自身从 Controller 到数据库的完整链路。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按优先级分三档：</span></span>
<span class="line"><span>P0：核心链路，必须覆盖</span></span>
<span class="line"><span>P1：主要功能，应该覆盖</span></span>
<span class="line"><span>P2：边缘场景，有余力再做</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每条给出：测什么、验证什么、为什么这个优先级。</span></span>
<span class="line"><span>不要写代码，先给清单。</span></span></code></pre></div><p>Claude Code先检查了 <code>application-mock.yml</code>，发现H2内存库和 <code>MockProviderAdapter</code> 已经就位，不需要额外搭建技术基础。</p><p>清单里有一条IT-P0-03（对话上下文多轮正确性）值得单独演示，因为它对应一个已知bug：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>写 IT-P0-03：对话上下文多轮正确性。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这条测试对应一个已知 bug，先写测试，测试应该是红的，然后再修 bug。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试步骤：</span></span>
<span class="line"><span>1. 同一 session 依次发 3 条消息（&quot;第一条&quot;、&quot;第二条&quot;、&quot;第三条&quot;）</span></span>
<span class="line"><span>2. 在第 3 条发送时，拦截 MockProviderAdapter 收到的 ChatRequest</span></span>
<span class="line"><span></span></span>
<span class="line"><span>验证 MockProviderAdapter 第 3 次收到的 messages 数组：</span></span>
<span class="line"><span>① 包含&quot;第一条&quot;和&quot;第二条&quot;的历史消息</span></span>
<span class="line"><span>② 历史消息按时间升序排列（先旧后新，符合 LLM 期望）</span></span>
<span class="line"><span>③ 最后一条是&quot;第三条&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这条测试现在应该失败，因为 selectRecentBySessionId 的 SQL 是</span></span>
<span class="line"><span>ORDER BY created_at ASC LIMIT，取的是最旧的消息而非最新的。</span></span>
<span class="line"><span>测试变红之后，再去修 SQL，修完测试变绿。</span></span></code></pre></div><p>先写测试让它红，验证SQL取的确实是最旧消息；然后修SQL（ <code>ASC</code> 改 <code>DESC</code>）；测试从红变绿，bug才算真正被修复。这是测试驱动修复，不是修完再补测试。</p><p>流程固化为 <code>.claude/skills/integration-test.md</code>，后续 <code>/集成测试Agent模块</code>，流程自动复用。</p><h2 id="场景四-部署——咨询先行" tabindex="-1">场景四：部署——咨询先行 <a class="header-anchor" href="#场景四-部署——咨询先行" aria-label="Permalink to &quot;场景四：部署——咨询先行&quot;">​</a></h2><p>本地部署、Docker部署、K8s部署，三种形态的顺序是从简单到复杂。但先做任何一个之前，咨询环节不能跳过。</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Hify 是一个 Spring Boot + Vue 的 AI 应用，</span></span>
<span class="line"><span>后端调用外部 LLM API，依赖 MySQL、Redis、pgvector，</span></span>
<span class="line"><span>目标用户是企业内部团队，规模从几人到几十人不等。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>我想把它做成可交付的形态，方便部署到不同环境。</span></span>
<span class="line"><span>帮我分析应该支持哪些部署形态，以及每种形态需要提前准备什么。</span></span>
<span class="line"><span>不要写任何代码，先给我分析。</span></span></code></pre></div><p>Claude Code给出三种形态对比和建议优先级，还主动问了四个确认问题。第四个是我没想到的：当前有没有健康检查接口？tar.gz、Docker、K8s三种形态都需要它。没有就先补。</p><p>补接口的提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮 Hify 加一个健康检查接口 GET /api/v1/health，</span></span>
<span class="line"><span>返回 HTTP 200 和 {&quot;code&quot;:0,&quot;data&quot;:&quot;ok&quot;}。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这个接口会被三个地方用到：</span></span>
<span class="line"><span>- 本地部署：启动后 curl 确认服务起来了</span></span>
<span class="line"><span>- Docker：healthcheck 指令</span></span>
<span class="line"><span>- K8s：liveness 和 readiness 探针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接口本身只需要返回 ok，不需要检查数据库连接。</span></span></code></pre></div><p>Claude Code先扫描项目，发现 <code>HealthController.java</code> 已经存在，但格式不一致。它主动给出两个选项，而不是自作主张改全局格式。这是咨询模式和执行模式结合的正确节奏。</p><p>本地部署提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮 Hify 生成本地部署的打包脚本。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>- 产物是一个 tar 包，包含：后端 jar、前端 dist 目录、start.sh、stop.sh、配置模板 application.yml</span></span>
<span class="line"><span>- 目标机器已有 Java 环境，不需要打包 JDK</span></span>
<span class="line"><span>- start.sh 支持通过环境变量或配置文件注入 MySQL、Redis、pgvector 的连接信息</span></span>
<span class="line"><span>- stop.sh 优雅停止，等待进程退出</span></span>
<span class="line"><span>- Makefile 加 package 命令，一键打包</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不需要包含 MySQL、Redis、pgvector，它们是外部服务。</span></span></code></pre></div><p>Claude Code先读了现有的 <code>start.sh</code>，发现是开发模式（跑 <code>mvn build + npm dev server</code>），告诉你需要完全重写，而不是在上面改。新的 <code>start.sh</code> 启动后轮询 <code>/api/v1/health</code>，就绪了打印成功，失败了打印最后30行日志告诉你哪里出了问题。</p><p>Docker部署提示词分三步走：先后端Dockerfile，再前端Dockerfile，最后 <code>docker-compose.yml</code>。前端的提示词有两个关键约束不能省：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 Hify 前端的 Dockerfile。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>情况说明：</span></span>
<span class="line"><span>- Vue 3 项目，npm run build 打包</span></span>
<span class="line"><span>- 用 Nginx 托管静态文件</span></span>
<span class="line"><span>- 前端需要把 /api 请求反向代理到后端</span></span>
<span class="line"><span></span></span>
<span class="line"><span>特别注意：</span></span>
<span class="line"><span>- Hify 有流式响应（SSE），Nginx 需要关闭缓冲</span></span>
<span class="line"><span>- LLM 调用可能很慢，超时时间要够长</span></span></code></pre></div><p><code>proxy_buffering off</code> 是SSE的关键。不说这个约束，Claude Code生成的Nginx配置会把事件攒批后一次性发出，用户看不到打字机效果。</p><p>K8s的核心提示词和验收不在这里展开，源码里都有，部署顺序看29讲的执行命令就够了。</p><h2 id="场景五-可观测性——从黑盒到透明" tabindex="-1">场景五：可观测性——从黑盒到透明 <a class="header-anchor" href="#场景五-可观测性——从黑盒到透明" aria-label="Permalink to &quot;场景五：可观测性——从黑盒到透明&quot;">​</a></h2><p>可观测性这个领域知识面很广，先咨询不是因为你不懂，是因为有些架构决策改晚了代价极高。</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Hify 是一个 Spring Boot + Vue 的 AI 应用，模块化单体架构，部署在 K8s 上。</span></span>
<span class="line"><span>核心功能是 LLM 对话，依赖 MySQL、Redis、pgvector，调用外部 LLM API 和 MCP Server。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>我想加可观测性，帮我分析：</span></span>
<span class="line"><span>1. 应该做哪些，为什么</span></span>
<span class="line"><span>2. 哪些一期不需要做，理由是什么</span></span>
<span class="line"><span>3. 有没有什么需要提前考虑的架构决策</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不要写代码，先给分析。</span></span></code></pre></div><p>Claude Code给出了三个架构决策：Actuator要独立端口隔离（改晚了要动K8s Service和Nginx）；traceId要趁早进MDC（改晚了要改所有日志打点代码）；日志字段规范要趁早定（改晚了所有告警规则都要跟着改）。这三个决策你不一定自己想的到，但它们决定了后续扩展的成本。</p><p>结构化日志的提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮 Hify 配置结构化日志，同时引入 OpenTelemetry 生成 traceId。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求：</span></span>
<span class="line"><span>1. 日志格式是 JSON，包含 timestamp、level、traceId、thread、logger、message</span></span>
<span class="line"><span>2. 同一次请求的所有日志共享同一个 traceId，可以用 traceId 过滤出完整链路</span></span>
<span class="line"><span>3. traceId 通过 OpenTelemetry 生成，为后续链路追踪预留扩展点</span></span>
<span class="line"><span>4. 对话链路的关键节点要有日志：请求进入、LLM 调用开始/结束、工具调用、异常</span></span>
<span class="line"><span>5. 日志输出到 stdout，由 K8s 采集</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不需要接 Jaeger 或 Zipkin，一期只用 traceId 串联日志。</span></span></code></pre></div><p>Claude Code读项目后发现三个问题：MDC在新线程（ <code>llmExecutor</code>）里会丢失； <code>logback-spring.xml</code> 是手拼JSON字符串，有转义风险； <code>ChatServiceImpl</code> 日志稀疏。这三个问题都是提示词里没说的，Claude Code自己读代码发现的。新建了 <code>MdcTaskWrapper</code> 解决跨线程丢失，所有提交到 <code>llmExecutor</code> 的任务都用它包一层。</p><p>Grafana Dashboard的提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我生成 Hify 的 Grafana Dashboard JSON。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Hify 暴露了以下指标：</span></span>
<span class="line"><span>- hify_chat_requests_total（label: agent_id）</span></span>
<span class="line"><span>- hify_chat_duration_ms（DistributionSummary，label: agent_id）</span></span>
<span class="line"><span>- hify_llm_calls_total（label: provider, model, success）</span></span>
<span class="line"><span>- hify_llm_duration_ms（DistributionSummary，label: provider, model）</span></span>
<span class="line"><span>- hify_circuit_breaker_state（label: provider，0=CLOSED 1=OPEN 2=HALF_OPEN）</span></span>
<span class="line"><span>- hify_mcp_tool_calls_total（label: tool, success）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Dashboard 需要包含以下面板：</span></span>
<span class="line"><span>1. 对话量（QPS 曲线，按 agent_id 分组）</span></span>
<span class="line"><span>2. 对话延迟（P50/P95/P99）</span></span>
<span class="line"><span>3. LLM 调用成功率（按 provider 分组）</span></span>
<span class="line"><span>4. LLM 调用延迟（P95，按 provider 分组）</span></span>
<span class="line"><span>5. 熔断器状态（各 Provider 当前状态）</span></span>
<span class="line"><span>6. MCP 工具调用成功率</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出完整的 Grafana Dashboard JSON，我直接导入使用。</span></span></code></pre></div><p>Claude Code在生成前主动发现指标名有误；生成后主动发现 <code>DistributionSummary</code> 缺 <code>_bucket</code>，询问是否补加 <code>.publishPercentileHistogram(true)</code>。两步缺一不可，没有第一步，Dashboard指标对不上；没有第二步，P95/P99面板全是空白，你都不知道为什么。</p><p>告警策略的提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 Hify 当前暴露的指标，帮我梳理告警策略。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Hify 的业务背景：企业内部智能客服，工作时间使用，非 24 小时高可用场景。</span></span>
<span class="line"><span>用户规模：几十人并发。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>帮我整理：</span></span>
<span class="line"><span>1. 哪些指标需要告警</span></span>
<span class="line"><span>2. 每条告警的阈值建议和触发条件</span></span>
<span class="line"><span>3. 告警级别（P0 立即响应 / P1 30 分钟内 / P2 次日处理）</span></span>
<span class="line"><span>4. 理由</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不要写 Grafana 配置，先给策略清单。</span></span></code></pre></div><p>Claude Code给出的清单里有专门的“不建议告警”部分：熔断器HALF_OPEN状态是正常恢复流程，加了只会误判；非工作时间的任何P1/P2，内部工具夜间无人使用不需要on-call。告警太多会产生疲劳，不建议告警这部分和正面清单同样重要。</p><h2 id="四条核心动作" tabindex="-1">四条核心动作 <a class="header-anchor" href="#四条核心动作" aria-label="Permalink to &quot;四条核心动作&quot;">​</a></h2><p>这三讲反复出现了几个模式，值得单独记下来。</p><p><strong>先咨询，再执行。</strong> 部署形态讨论里发现健康检查遗漏，可观测性讨论里给出三个高代价架构决策，测试分析里识别风险地图。这些信息如果直接让Claude Code执行，它永远不会主动告诉你。</p><p><strong>Claude Code先读代码再动手。</strong> 每个执行步骤里，Claude Code在写代码之前都先扫了项目。发现 <code>start.sh</code> 是开发模式需要重写，发现MDC跨线程丢失，发现熔断器不走Resilience4j Registry，发现健康检查接口已存在但格式不一致。这些问题如果直接执行，会产生能跑但有缺陷的代码。</p><p><strong>执行后会自检。</strong> Grafana Dashboard生成完后，Claude Code主动发现 <code>DistributionSummary</code> 缺 <code>_bucket</code>。测试计划有问题，执行前先指出。端口写错了，按实际配置生成而不是按提示词盲目执行。</p><p><strong>先写失败的测试，再修bug。</strong> IT-P0-03是这三讲里我觉得最重要的一条操作：测试变红才证明你找对了问题，变绿才证明你真正修好了。这个顺序不能反过来。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>测试部署篇结束了。Hify从能跑的代码，变成了有质量保障、可交付、可观测的系统。</p><p>这三讲做完，你手上有四样东西：核心链路地图写进了CLAUDE.md，单测SKILL和集成测试SKILL各就位一个，三种部署形态都能跑，Grafana大盘和告警策略都配好了。</p><p>后面怎么用，你来定。如果你工作里有一个老项目，现在可以用场景一的提示词跑一遍，让Claude Code识别核心链路，对比你自己的判断，看两者有没有差异。差异的地方，往往就是你接下来该把精力放进去的地方。</p><p>期待你与我分享自己的体验。如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,77)])])}const g=s(l,[["render",i]]);export{h as __pageData,g as default};
