import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"27｜AI 写代码，保证质量不靠运气，靠体系","description":"","frontmatter":{},"headers":[{"level":2,"title":"方法论","slug":"方法论","link":"#方法论","children":[{"level":3,"title":"判断：哪些代码该给AI写，哪些自己把关","slug":"判断-哪些代码该给ai写-哪些自己把关","link":"#判断-哪些代码该给ai写-哪些自己把关","children":[]},{"level":3,"title":"Review：按核心链路看，双模型互补","slug":"review-按核心链路看-双模型互补","link":"#review-按核心链路看-双模型互补","children":[]},{"level":3,"title":"单测边界：先问该不该测，再问怎么测","slug":"单测边界-先问该不该测-再问怎么测","link":"#单测边界-先问该不该测-再问怎么测","children":[]}]},{"level":2,"title":"Hify实操","slug":"hify实操","link":"#hify实操","children":[{"level":3,"title":"1. 识别核心链路，写入CLAUDE.md","slug":"_1-识别核心链路-写入claude-md","link":"#_1-识别核心链路-写入claude-md","children":[]},{"level":3,"title":"2. 生成单测规范，写入CLAUDE.md","slug":"_2-生成单测规范-写入claude-md","link":"#_2-生成单测规范-写入claude-md","children":[]},{"level":3,"title":"3. 分析哪些模块需要单测，给出清单","slug":"_3-分析哪些模块需要单测-给出清单","link":"#_3-分析哪些模块需要单测-给出清单","children":[]},{"level":3,"title":"4. 单测：模型管理模块 & 固化为SKILL","slug":"_4-单测-模型管理模块-固化为skill","link":"#_4-单测-模型管理模块-固化为skill","children":[]},{"level":3,"title":"5. 集成测试 & 固化为SKILL","slug":"_5-集成测试-固化为skill","link":"#_5-集成测试-固化为skill","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"ClaudeCode企业级全链路开发实战/27｜AI写代码，保证质量不靠运气，靠体系.md","filePath":"ClaudeCode企业级全链路开发实战/27｜AI写代码，保证质量不靠运气，靠体系.md","lastUpdated":1779815375000}'),l={name:"ClaudeCode企业级全链路开发实战/27｜AI写代码，保证质量不靠运气，靠体系.md"};function i(t,s,o,c,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_27-ai-写代码-保证质量不靠运气-靠体系" tabindex="-1">27｜AI 写代码，保证质量不靠运气，靠体系 <a class="header-anchor" href="#_27-ai-写代码-保证质量不靠运气-靠体系" aria-label="Permalink to &quot;27｜AI 写代码，保证质量不靠运气，靠体系&quot;">​</a></h1><p>你好，我是Robert。</p><p>Anthropic公开说过：Claude Code自身的代码，全部由AI编写，工程师只负责review。在我看来，这句话有一个没说出来的前提： <strong>他们敢这么做，不是因为AI不会出错，而是因为有一套完整的质量保障体系</strong>。</p><p>在说这套体系之前，我想先说清楚一个判断。</p><p>现在很多新闻告诉我们：写好SDD，直接扔给AI，它跑一个晚上就把整个项目搞定了。我的个人体感是：做不到，至少现在做不到。</p><p>不是AI能力不够，而是这句话偷换了一个概念： <strong>保证代码质量的不是AI，是体系。AI只是体系的执行者</strong>。</p><p>这两件事的区别很大。</p><ul><li><p><strong>“AI帮你保证质量”</strong> 的意思是：你把代码交给AI，它会自动发现所有问题，自动写出正确的测试，自动保证系统稳定。这是不现实的。AI写代码时专注于功能实现，它不会主动质疑自己的安全模型，不会想到“这个接口的权限校验是不是有漏洞”，不会考虑并发场景下的数据一致性。</p></li><li><p><strong>“体系保证质量，AI协助执行”</strong> 的意思是：你先建立质量保障体系， <strong>识别核心链路</strong>、 <strong>划定测试边界</strong>、 <strong>制定review策略</strong>，然后让AI在这个体系里高效执行。体系是你建的，AI是执行者。</p></li></ul><p>一个项目的质量由四个层次组成。</p><ol><li><p><strong>核心链路识别</strong>：哪些是系统的核心路径，哪些是风险集中的地方。这个判断必须由人来做，AI辅助分析。做错了，后面所有测试都是在错误的地方使劲。</p></li><li><p><strong>单元测试</strong>：覆盖纯逻辑，不依赖外部系统。这部分独立性强、模式固定，AI能规划得很好，可以大比例交给AI执行。但要注意：AI偏逻辑完备，测试用例容易过多，你要把握边界，砍掉不必要的。</p></li><li><p><strong>集成测试</strong>：功能维度的端到端验证，从Controller到数据库的完整链路。mock策略要你来定，执行让AI来做，一个场景跑通再写下一个。</p></li><li><p><strong>混沌测试</strong>：故障注入验证韧性，是质量体系的天花板。单测和集成测试验证“正常情况下对不对”，混沌测试验证“出问题时垮不垮”，节点宕机、网络分区、磁盘打满、慢消费者积压。这一层在项目维护阶段才有意义，但要从架构阶段就知道它在哪里。</p></li></ol><p>所以，正确的工作方式不是告诉AI：“给我写测试用例，保证代码不出问题”，然后等它跑完。而是你来拆解项目，划定边界，AI在你划定的边界里执行。</p><p>这一讲围绕就这个思路展开。本节课分两部分： <strong>方法论说清楚怎么想</strong>， <strong>实操给你能直接用的提示词和流程</strong>。</p><h2 id="方法论" tabindex="-1">方法论 <a class="header-anchor" href="#方法论" aria-label="Permalink to &quot;方法论&quot;">​</a></h2><h3 id="判断-哪些代码该给ai写-哪些自己把关" tabindex="-1">判断：哪些代码该给AI写，哪些自己把关 <a class="header-anchor" href="#判断-哪些代码该给ai写-哪些自己把关" aria-label="Permalink to &quot;判断：哪些代码该给AI写，哪些自己把关&quot;">​</a></h3><p>质量保障的起点不是测试，是判断。我有两个观点：</p><ul><li>适合给AI写的：有规范、有模式、有标准答案的代码。</li></ul><p>CRUD接口、适配器、DTO转换、工具类、配置类、测试代码，这类代码逻辑清晰，有套路可循。AI写出来和有经验的程序员写的差不多，而且更快。Hify整门课80% 以上的代码属于这类，全部放手给AI。</p><ul><li>不适合给AI写的：需要深度判断、没有标准答案的代码。</li></ul><p>架构设计、核心数据模型的取舍、安全边界的划定、性能瓶颈处的核心逻辑，这类代码AI能写出来，也能跑， <strong>但方向可能是错的</strong>，而且你不一定能从代码本身看出来。错的方向比写错的代码危险得多，因为它表面上没问题。</p><p>Hify里的分工就是这样：Provider的CRUD、适配层的格式转换、前端的管理页面，全部放手给AI。04讲的数据模型设计、13讲的领域理解、整套架构的模块拆分，这些是自己做的，AI只是辅助分析。</p><p>做出上面的这个判断不难。有经验的工程师看一眼系统，基本知道哪里容易出问题。核心链路、核心功能、核心模块等这些是要把关的地方，也是review和测试的重心所在。判断做对了，精力分配就对了。</p><h3 id="review-按核心链路看-双模型互补" tabindex="-1">Review：按核心链路看，双模型互补 <a class="header-anchor" href="#review-按核心链路看-双模型互补" aria-label="Permalink to &quot;Review：按核心链路看，双模型互补&quot;">​</a></h3><p>代码量大，逐行review不现实， <strong>核心链路review才是正确姿势。</strong></p><p>这里有一个前提：结构组织要合理，review才有抓手。模块清晰、分层合理、CLAUDE.md写清楚规范，结构好了，你知道核心链路在哪几个文件里，review变成有目的的阅读，而不是大海捞针。所以到这里你会发现，我们在前面的课程沉淀了很多内容到CLAUDE.md中的作用来了。</p><p><strong>Hify的核心链路是对话链路， <code>ChatServiceImpl</code> 里从用户发消息到LLM返回的完整流程。所以需要重点关注这条链路。</strong></p><p>我在平时编码，有个习惯：就是双模型互补。</p><p>就是Claude Code写完核心模块，把代码喂给ChatGPT review。两个模型训练方式不同，盲点不同，互补效果很好。</p><p>所以我其实不推荐你买Claude Code，大家去买Cursor也可以。因为Cursor集成了ChatGPT、Claude Code、Kimi等等多个模型，很适合多模型review。</p><p>双模型review的提示词可以这么给：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你是一位有十年经验的 Java 后端工程师，正在做代码 review。</span></span>
<span class="line"><span>以下是 Hify 对话链路的核心代码，请从这几个维度给出意见：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 安全性：权限校验是否完整，有没有越权访问的可能</span></span>
<span class="line"><span>2. 静默失败：有没有 catch 块吞掉了异常，调用方感知不到失败</span></span>
<span class="line"><span>3. 边界条件：null 处理、空列表、并发场景有没有遗漏</span></span>
<span class="line"><span>4. 性能隐患：N+1 查询、不必要的阻塞调用、大对象</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不需要夸代码写得好。直接说问题，每个问题给出具体位置和修复建议。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>代码如下：</span></span>
<span class="line"><span>[粘贴核心链路代码]</span></span></code></pre></div><p>加“不需要夸代码写得好”是因为模型有讨好倾向，不说这句会先说一堆好话再说问题。举个例子，我把 <code>ChatServiceImpl</code> 喂给ChatGPT，它发现了12个问题，4个高危：</p><ol><li><p>越权访问他人会话： <code>ChatController</code> 所有带sessionId的接口，只验证session存在，不验证session属于谁。用户A知道用户B的sessionId（连续自增ID，极易枚举），可以读取B的全部对话历史、向B的会话发消息、删除B的会话。</p></li><li><p>对话历史取的是最旧的消息： <code>ChatMessageMapper</code> 的SQL是 <code>ORDER BY created_at ASC LIMIT #{limit}</code>。对话有100条时，取的是最早的20条，不是最近的20条。长对话用户发新消息，LLM看到的是几十轮之前的历史。</p></li><li><p>MCP工具调用失败静默返回mock数据： <code>executeToolCall</code> 里catch所有异常后返回硬编码的mock数据。MCP Server超时、认证失败、工具不存在，全都返回一样的假数据，调用方完全感知不到失败。</p></li><li><p>Redis read-modify-write无锁： <code>updateContext</code> 是get → add → set的操作序列，没有任何锁。两个并发请求同时读到旧的context，各自追加后写回，后写的覆盖前写的，一条对话记录永久丢失。</p></li></ol><p>从效果来看，还是挺好的，确实找出了实际问题。为什么呢？ <strong>Claude Code写代码时专注于功能实现，它不会主动质疑自己的安全模型</strong>。ChatGPT扮演reviewer时，视角完全不同，它在找问题，不是在完成功能。从实践来看，这个操作的实际效果挺好的。</p><h3 id="单测边界-先问该不该测-再问怎么测" tabindex="-1">单测边界：先问该不该测，再问怎么测 <a class="header-anchor" href="#单测边界-先问该不该测-再问怎么测" aria-label="Permalink to &quot;单测边界：先问该不该测，再问怎么测&quot;">​</a></h3><p>让AI决定测什么是错的起点。AI偏逻辑完备，倾向覆盖所有路径，包括mock掉外部依赖之后意义不大的场景。</p><ul><li><p><strong>值得写单测的</strong>：输入固定输出就固定、不依赖任何外部系统。Hify里是两类：纯函数逻辑（ <code>buildMessages()</code> 上下文拼装、 <code>ConditionNodeExecutor.execute()</code> 条件判断、 <code>ExecutionContext.resolve()</code> 模板替换）和边界清晰的工具类（ <code>NodeConfigParser.parse()</code>、 <code>Result.ok()</code> / <code>Result.fail()</code>）。</p></li><li><p><strong>不值得写单测的</strong>：核心是外部调用的代码（ <code>OpenAiAdapter</code>，用MockWebServer做HTTP级集成测试更有价值）；逻辑在SQL里的代码（ <code>selectRecentBySessionId</code> 的排序bug只有H2集成测试能发现）；深度依赖Spring容器的代码（ <code>ChatServiceImpl</code> 有12个外部依赖，mock完之后剩下的只是调用顺序）。</p></li></ul><p>判断三问：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 有没有 IO（DB/HTTP/Redis/文件）？</span></span>
<span class="line"><span>   有 → 考虑集成测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 去掉外部依赖，剩下的逻辑有复杂度吗？</span></span>
<span class="line"><span>   没有 → 不值得测</span></span>
<span class="line"><span>   有 → 可以单测</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 改动频率高？出错影响大？</span></span>
<span class="line"><span>   是 → 值得做</span></span>
<span class="line"><span>   否 → 优先级放低</span></span></code></pre></div><h2 id="hify实操" tabindex="-1">Hify实操 <a class="header-anchor" href="#hify实操" aria-label="Permalink to &quot;Hify实操&quot;">​</a></h2><p>接下来我们根据这些方法论，对Hify进行测试，主要分为五步。</p><h3 id="_1-识别核心链路-写入claude-md" tabindex="-1">1. 识别核心链路，写入CLAUDE.md <a class="header-anchor" href="#_1-识别核心链路-写入claude-md" aria-label="Permalink to &quot;1\\. 识别核心链路，写入CLAUDE.md&quot;">​</a></h3><p><strong>所有测试的起点不是写代码，是知道测什么</strong>。先让AI读完整个项目，输出核心链路清单和风险地图，你来确认，写进CLAUDE.md。后面的单测和集成测试都基于这份地图来做。</p><p>提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我分析这个系统，输出三个清单：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 核心链路清单（3-5条）</span></span>
<span class="line"><span>   每条链路：名称、涉及的模块和类、为什么是核心链路</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 风险集中区域</span></span>
<span class="line"><span>   哪些模块/方法最容易出问题、出了问题影响最大</span></span>
<span class="line"><span>   每个风险点说明：风险类型（安全/并发/性能/数据一致性）、可能的失败场景</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 测试重心建议</span></span>
<span class="line"><span>   基于前两条，测试精力应该往哪放</span></span>
<span class="line"><span>   哪些地方必须有测试覆盖，哪些可以先跳过</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出格式：结构化的 CLAUDE.md 片段，我直接复制进去。</span></span></code></pre></div><p>Claude Code读完代码后，输出的核心链路清单和风险地图相当准确。以Hify为例，它识别出了5条核心链路：</p><ul><li><p><strong>流式对话链路（最高优先级）</strong>： <code>ChatServiceImpl.doStreamChat()</code> 串联了12个外部依赖，RAG检索、Function Calling两轮LLM、Redis/MySQL双写全部在一个方法里。</p></li><li><p><strong>Function Calling两轮链路</strong>：tool_calls分支是Hify区别于普通聊天的核心能力，失败时静默fallback mock数据，调用方无法感知。</p></li><li><p><strong>消息上下文管理链路</strong>： <code>loadContext()</code> + <code>updateContext()</code> + SQL，多轮对话的正确性依赖它，有已知bug（SQL取最旧而非最新消息）。</p></li><li><p><strong>工作流执行链路</strong>： <code>WorkflowEngine.pickNext()</code> 有fallback-to-first-edge兜底逻辑会掩盖配置错误，CONDITION节点走错分支时静默终止无报错。</p></li><li><p><strong>MCP工具接入链路</strong>：每次对话同步串行探测所有绑定的MCP Server（5s超时 × Server数量），3个Server = 15s阻塞。</p></li></ul><p>风险地图识别出了7个风险点，其中2个高危：</p><ul><li><p><code>ChatServiceImpl.doStreamChat()</code>，工作流路径抛RuntimeException时user消息落库但assistant消息缺失，对话历史出现孤儿消息；MCP工具调用任何异常均fallback mock数据，LLM基于假数据生成回答，用户无感知。</p></li><li><p><code>ChatMessageMapper.selectRecentBySessionId()</code>，SQL是 <code>ORDER BY created_at ASC LIMIT #{limit}</code>，长对话时取的是最早的消息而非最近的，LLM拿到过时上下文，对话质量急剧下降。短对话时完全无症状，只在用户深度使用时暴露。</p></li></ul><p>这时候你就要做的一件事，就是： <strong>拿到结果，对照自己对系统的理解，检查AI有没有遗漏或判断错的地方。AI的分析基于代码结构，你的判断来自业务理解，两者对比才能确认这份地图是准的。</strong></p><p>确认后写进CLAUDE.md。这份地图会影响后面每一步，单测规范基于它生成，集成测试的P0优先级基于它划定，混沌测试的场景设计也基于它。</p><h3 id="_2-生成单测规范-写入claude-md" tabindex="-1">2. 生成单测规范，写入CLAUDE.md <a class="header-anchor" href="#_2-生成单测规范-写入claude-md" aria-label="Permalink to &quot;2\\. 生成单测规范，写入CLAUDE.md&quot;">​</a></h3><p>有了核心链路地图，单测规范就有了依据。让AI基于Step 0的结果生成规范，针对Hify这个具体项目，而不是泛泛的通用规范。</p><p>提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 CLAUDE.md 中的核心链路和风险地图，帮我生成 Hify 项目的单元测试规范。</span></span>
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
<span class="line"><span>输出格式：直接输出 CLAUDE.md 片段，我复制进去就能用。</span></span></code></pre></div><p>Claude Code先检查了项目的测试依赖，发现根pom里没有任何测试框架：零测试基础设施。所以它的规范里第一节就是依赖配置。</p><p>这个细节很重要：不是泛泛说“用JUnit 5”，而是 <strong>先看你现在有什么，再告诉你缺什么</strong>。</p><p>规范里有几个值得关注的判断。关于“不写单测”的范围，它给出了具体理由而不是笼统结论： <code>ChatServiceImpl</code> 整体不写，因为有12个外部依赖，mock掉之后测的是假数据流转； <code>OpenAiAdapter</code> 不写单测，因为核心是HTTP构造和SSE流解析，与网络协议深度耦合，用MockWebServer做HTTP级集成测试更有价值。</p><p>关于mock使用规范，它强调一个原则： <strong>只mock跨越本类边界的依赖，不mock标准库、不mock被测类自身</strong>。举了一个反例， <code>@Mock ObjectMapper objectMapper</code>，直接new即可，不需要mock。</p><p>禁止事项里有一条特别有用： <strong>禁止在测试里写业务逻辑，不要重复计算期望值，直接写字符串字面量</strong>。这是AI写测试时最常见的坏味道，它会把被测的计算逻辑在测试里再实现一遍，测试通过只能说明两段逻辑一样错。</p><p>生成后加进CLAUDE.md的“测试规范”节，此后Claude Code写任何测试代码都会自动遵守。</p><h3 id="_3-分析哪些模块需要单测-给出清单" tabindex="-1">3. 分析哪些模块需要单测，给出清单 <a class="header-anchor" href="#_3-分析哪些模块需要单测-给出清单" aria-label="Permalink to &quot;3\\. 分析哪些模块需要单测，给出清单&quot;">​</a></h3><p>规范写好了，让AI读完所有相关代码，对照规范输出清单。注意提示词里要让它先读代码再分析，不是凭感觉判断。</p><p>提示词：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 CLAUDE.md 中的单测规范和核心链路地图，分析 Hify 以下模块，</span></span>
<span class="line"><span>给出&quot;值得写单测/不值得写单测&quot;的清单。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对每个类/方法，输出：</span></span>
<span class="line"><span>1. 是否值得写单测（是/否）</span></span>
<span class="line"><span>2. 理由（一句话）</span></span>
<span class="line"><span>3. 如果值得测，列出 2-3 个最重要的测试场景</span></span>
<span class="line"><span></span></span>
<span class="line"><span>用表格输出，按模块分组。不要写测试代码，先给清单。</span></span></code></pre></div><p>Claude Code读完代码后给出了27个判断目标，结论是17个值得写、10个不值得写。你要做的一件事，拿到清单做最终取舍。 <strong>清单告诉你重心在哪，但优先级你来定</strong>。</p><p>Claude Code建议的写测试顺序是：先修复已知bug（SQL问题）同步写回归测试锁住正确行为，再给纯函数写单测，最后做集成测试链路。这个顺序是合理的，先堵已知漏洞，再建体系。</p><h3 id="_4-单测-模型管理模块-固化为skill" tabindex="-1">4. 单测：模型管理模块 &amp; 固化为SKILL <a class="header-anchor" href="#_4-单测-模型管理模块-固化为skill" aria-label="Permalink to &quot;4\\. 单测：模型管理模块 &amp; 固化为SKILL&quot;">​</a></h3><p>有了清单，开始做。先手动走一遍Provider的单测，跑通之后把流程固化成Skill。这里完整展示和Claude Code的交互过程，包括它主动纠正我的两个地方，这才是真实的节奏。</p><h4 id="先规划-不直接写代码" tabindex="-1">先规划，不直接写代码 <a class="header-anchor" href="#先规划-不直接写代码" aria-label="Permalink to &quot;先规划，不直接写代码&quot;">​</a></h4><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>深度分析 ProviderService 的 createProvider 方法。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>告诉我：</span></span>
<span class="line"><span>1. 这个方法有哪些执行路径（正常路径 + 异常路径）</span></span>
<span class="line"><span>2. 每条路径的关键变量是什么</span></span>
<span class="line"><span>3. 哪些边界条件最容易出错</span></span>
<span class="line"><span></span></span>
<span class="line"><span>基于分析，给我一份测试计划：测哪些场景、每个场景验证什么断言。</span></span>
<span class="line"><span>先给计划，不要写代码。Claude Code</span></span></code></pre></div><p>Claude Code读完代码，画出了完整的执行路径树：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>create(request)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├─ checkNameUnique(name, null)</span></span>
<span class="line"><span>    │   ├─ 路径 A：DB 查到同名 → 抛 BizException(PROVIDER_NAME_DUPLICATE) ✗</span></span>
<span class="line"><span>    │   └─ 路径 B：name 不重复 → 继续</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├─ new Provider()，逐字段赋值</span></span>
<span class="line"><span>    │   └─ description == null → 写入 &quot;&quot;（空字符串兜底）</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├─ provider.setEnabled(1)（硬编码，调用方无法控制）</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └─ providerMapper.insert(provider)</span></span>
<span class="line"><span>        ├─ 路径 C：insert 成功 → id/时间戳由 MyBatis-Plus 回填 ✓</span></span>
<span class="line"><span>        └─ 路径 D：insert 失败 → RuntimeException 穿透到 GlobalExceptionHandler ✗</span></span></code></pre></div><p>同时发现了三个边界条件值得关注： <code>checkNameUnique</code> 里没有显式过滤软删除记录（依赖MyBatis-Plus <code>@TableLogic</code> 自动追加）； <code>description</code> 传全空格 <code>&quot; &quot;</code> 时原样入库没有trim； <code>@CacheEvict(allEntries=true)</code> 的范围过宽，清空了整个provider-cache而不只是list缓存。</p><p>测试计划给出了11个场景，分P0/P1/P2三档，还有两条标注了“只能用集成测试验证”。</p><h4 id="reveiw测试计划-做筛选" tabindex="-1">reveiw测试计划，做筛选 <a class="header-anchor" href="#reveiw测试计划-做筛选" aria-label="Permalink to &quot;reveiw测试计划，做筛选&quot;">​</a></h4><p>拿到计划，我砍掉了P2的场景，留下核心的四条，然后发给Claude Code让它写代码：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>测试计划确认如下：</span></span>
<span class="line"><span>- 正常创建：provider name 唯一，验证返回 id 且数据库有记录</span></span>
<span class="line"><span>- 重复名称：抛出 BizException，错误码 PROVIDER_NAME_DUPLICATE</span></span>
<span class="line"><span>- 必填字段为空：name 为 null，抛出 ConstraintViolationException</span></span>
<span class="line"><span>- apiKey 格式校验：不符合格式，抛出 BizException</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按这个计划写单元测试。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>技术约束：</span></span>
<span class="line"><span>- ProviderService 依赖 ProviderMapper，用 &amp;#64;MockBean mock 掉</span></span>
<span class="line"><span>- 用 AssertJ 做断言，不用 assertTrue</span></span>
<span class="line"><span>- 每个场景一个独立测试方法，方法名遵循 CLAUDE.md 规范</span></span>
<span class="line"><span>- 不要写集成测试，只写单元测试</span></span></code></pre></div><p>这是这一步最值得关注的地方。Claude Code没有照着计划直接生成代码，而是先指出了三个问题：</p><ul><li><p><strong>“验证返回id且数据库有记录”在单元测试里做不到后半句</strong>。 <code>providerMapper.insert()</code> 被mock掉后，数据不会真正写库，“数据库有记录”只能在集成测试里验证。单元测试能验证的是： <code>insert()</code> 被调用了一次，且传入的provider对象字段正确。</p></li><li><p><strong>“apiKey格式校验”在代码里根本不存在</strong>。 <code>authConfig</code> 是 <code>Map&amp;lt;String, Object&gt;</code>，只有 <code>@NotNull</code> 约束，没有任何格式校验逻辑。这条测试没有被测对象，应该改成 “authConfig为null时Bean Validation拦截”。</p></li><li><p><strong><code>@MockBean</code> 和“只写单元测试”冲突</strong>。 <code>@MockBean</code> 需要启动Spring Context，属于集成测试范畴。真正的单元测试应该用 <code>@Mock + @InjectMocks + @ExtendWith(MockitoExtension.class)</code>，毫秒级启动。</p></li></ul><p>值得一提的是：上面的三个点有点太细节了，但是我希望你看到的是Claude Code输出的是什么样子的提示，而不是写了什么。你应该学的是它的思维，而不是具体的输出。</p><h4 id="单测流程固化为skill" tabindex="-1">单测流程固化为SKILL <a class="header-anchor" href="#单测流程固化为skill" aria-label="Permalink to &quot;单测流程固化为SKILL&quot;">​</a></h4><p>最后流程跑通，固化为SKILL：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我刚才做了 ProviderService 的单元测试，完整流程是：</span></span>
<span class="line"><span>1. 读代码，分析执行路径和边界条件</span></span>
<span class="line"><span>2. 输出测试计划（不写代码）</span></span>
<span class="line"><span>3. 我确认计划，CC 主动指出计划里的技术问题，调整后再执行</span></span>
<span class="line"><span>4. Service 业务逻辑和 DTO 约束规则分两个测试文件</span></span>
<span class="line"><span>5. 跑测试，失败了分析是测试写错还是实现有 bug</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请把这个流程固化成一个 SKILL.md 文件。</span></span>
<span class="line"><span>让我以后对任何 Service 方法用 /单测 命令触发，CC 自动按这个流程走。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SKILL.md 要包含：</span></span>
<span class="line"><span>- 触发方式</span></span>
<span class="line"><span>- 读代码的步骤（先读被测类，再读依赖的 DTO 和 ErrorCode）</span></span>
<span class="line"><span>- 测试计划的输出格式（执行路径树 + 边界条件 + 分优先级的场景表）</span></span>
<span class="line"><span>- 写代码前的技术确认清单（mock 方式、断言库、是否有 Bean Validation 相关场景）</span></span>
<span class="line"><span>- 测试文件拆分原则（Service 逻辑和 DTO 约束分开）</span></span>
<span class="line"><span>- 跑测试和处理失败的步骤</span></span></code></pre></div><p>固化后放在 <code>.claude/skills/unit-test.md</code>。下次对任何方法直接 <code>/单测AgentService.createAgent</code>，Claude Code自动走完整流程，包括主动检查计划里的技术问题。</p><h3 id="_5-集成测试-固化为skill" tabindex="-1">5. 集成测试 &amp; 固化为SKILL <a class="header-anchor" href="#_5-集成测试-固化为skill" aria-label="Permalink to &quot;5\\. 集成测试 &amp; 固化为SKILL&quot;">​</a></h3><p>集成测试是Hify的主力。Spring Boot Test完整启动，mock掉外部API，打真实HTTP请求，走完从Controller到数据库的完整链路。还是先规划集成测试清单：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于 CLAUDE.md 中的核心链路和风险地图，帮我规划 Hify 的集成测试清单。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试范围：Spring Boot Test + MockMvc，mock 掉 LLM API 和 MCP Server，</span></span>
<span class="line"><span>测试 Hify 自身从 Controller 到数据库的完整链路。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按优先级分三档：</span></span>
<span class="line"><span>P0，核心链路，必须覆盖</span></span>
<span class="line"><span>P1，主要功能，应该覆盖</span></span>
<span class="line"><span>P2，边缘场景，有余力再做</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每条给出：测什么、验证什么、为什么这个优先级。</span></span>
<span class="line"><span>不要写代码，先给清单。</span></span></code></pre></div><p>Claude Code先检查了项目的配置文件，发现已经有 <code>application-mock.yml</code>，H2内存库 + MockProviderAdapter替换真实LLM调用，不需要Redis。技术基础已经就位，不需要额外搭建。</p><p>Claude Code给出了13条清单，P0五条值得细说：</p><ul><li><p><strong>完整对话链路</strong>：普通问答，验证SSE流包含 <code>type=delta</code> 事件且content非空，最后一个事件是 <code>type=done</code>，MySQL里有user和assistant两条记录，且assistant消息内容与delta事件拼起来一致。</p></li><li><p><strong>Function Calling两轮链路</strong>：MockProviderAdapter第一轮返回 <code>finish_reason=tool_calls</code>，mock McpService返回工具结果，第二轮返回最终回答。验证SSE流正常结束，MySQL只落一条assistant消息（不是两条）， <code>McpService.callTool()</code> 被调用一次。重点是验证工具调用失败时不影响SSE流正常结束，这正是review环节发现的高危问题：工具失败静默fallback mock数据。</p></li><li><p><strong>对话上下文多轮正确性</strong>：同一session发3条消息，验证第3条调用时传给LLM的messages数组包含前两轮历史，且顺序正确。这条直接对应Step 0识别的已知bug，SQL取的是最旧消息而非最新。Claude Code建议先写这条测试，再去修bug，修完后测试从红变绿。这是测试驱动修复，不是修完再补测试。</p></li><li><p><strong>Provider CRUD完整链路</strong>：创建 → 查详情 → 更新 → 删除，每步验证数据库状态，包括软删除后list接口不再返回该记录。</p></li><li><p><strong>会话隔离</strong>：跨session越权访问，设计有点反直觉。当前代码没有userId隔离，测试会通过，但通过意味着越权访问可行。Claude Code的建议是先记录现状，等加了权限校验之后这条测试会变红，变红才是对的。先用测试锁住现状，再推动修复。</p></li></ul><p>测试数据策略：每个测试类用 <code>@Sql</code> 插入独立数据，用 <code>@Transactional</code> 回滚，不依赖全局种子数据。SQL文件按场景分文件放在 <code>src/test/resources/sql/</code> 下，不要把所有测试数据堆进一个文件。</p><h4 id="模型管理集成测试" tabindex="-1">模型管理集成测试 <a class="header-anchor" href="#模型管理集成测试" aria-label="Permalink to &quot;模型管理集成测试&quot;">​</a></h4><p>清单确认后，从最简单的模块开始写。Provider CRUD是前置依赖，后面所有对话链路测试都需要先有Provider数据，先把这块跑通。</p><p>发给Claude Code的指令如下：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>按 P0 清单，先写1～4：Provider CRUD 完整链路的集成测试。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>技术基础：用现有的 mock profile（H2 内存库 + application-mock.yml），</span></span>
<span class="line"><span>不需要新建 application-test.yml。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试场景（6 个，先写完跑通再继续）：</span></span>
<span class="line"><span>1. POST /api/v1/providers 创建：合法请求，验证 body.code=200 且 body.data.id 有值</span></span>
<span class="line"><span>2. POST /api/v1/providers 重复名称：验证 body.code=2001（PROVIDER_NAME_DUPLICATE）</span></span>
<span class="line"><span>3. GET /api/v1/providers/{id} 查询存在的记录：验证返回完整字段</span></span>
<span class="line"><span>4. GET /api/v1/providers/{id} 查询不存在的记录：验证 body.code=2000</span></span>
<span class="line"><span>5. PUT /api/v1/providers/{id} 更新：验证数据库里的 name 确实变了</span></span>
<span class="line"><span>6. DELETE /api/v1/providers/{id} 删除：验证数据库里 deleted=1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>约束：</span></span>
<span class="line"><span>- &amp;#64;SpringBootTest(webEnvironment = RANDOM_PORT) + MockMvc</span></span>
<span class="line"><span>- 每个测试方法用 &amp;#64;Sql 插入独立数据，用 &amp;#64;Transactional + &amp;#64;Rollback 回滚</span></span>
<span class="line"><span>- Hify 所有接口 HTTP 状态码都返回 200，错误码在 body.code 里</span></span>
<span class="line"><span>- 用 AssertJ 做断言</span></span></code></pre></div><p>注意提示词里加了“Hify所有接口HTTP状态码都返回200”，如果不说，Claude Code默认会断言HTTP 400/404，而Hify的错误响应格式不是这样。这类项目约定要在指令里明确说清楚，不能靠Claude Code猜。</p><h4 id="对话链路集成测试" tabindex="-1">对话链路集成测试 <a class="header-anchor" href="#对话链路集成测试" aria-label="Permalink to &quot;对话链路集成测试&quot;">​</a></h4><p>Provider CRUD跑通后，写对话链路。分三个场景递进，一个跑通再写下一个。接下来内容有点多有点细，我就不展开细节了，你主要看提示词。</p><p>场景一：纯对话</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>写 01：完整对话链路，普通问答。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>前置：复用 Provider CRUD 测试里的测试基类和 &amp;#64;Sql 数据准备方式。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试步骤：</span></span>
<span class="line"><span>1. &amp;#64;Sql 插入 provider + model_config + agent + chat_session 数据</span></span>
<span class="line"><span>2. POST /api/v1/chat/sessions/{sessionId}/messages，body: {content: &quot;你好&quot;}</span></span>
<span class="line"><span>3. 收集 SSE 事件流（text/event-stream）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>验证：</span></span>
<span class="line"><span>① SSE 流包含至少一个 type=delta 的事件，content 非空</span></span>
<span class="line"><span>② 最后一个事件是 type=done</span></span>
<span class="line"><span>③ 查询 chat_message 表，role=user 和 role=assistant 各有一条记录</span></span>
<span class="line"><span>④ assistant 消息的 content 与所有 delta 事件的 content 拼接结果一致</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MockProviderAdapter 已经在 mock profile 里替换了真实 LLM，不需要额外 mock。</span></span>
<span class="line"><span>先写场景一，跑通再写场景二。</span></span></code></pre></div><p>场景二：Function Calling两轮链路</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>写02：Function Calling 两轮链路。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在场景一基础上，Agent 绑定一个 mock MCP Server：</span></span>
<span class="line"><span>- &amp;#64;Sql 数据里加入 mcp_server + agent_tool 关联</span></span>
<span class="line"><span>- &amp;#64;MockBean McpService，配置 listToolsDetail() 返回一个工具 schema</span></span>
<span class="line"><span>- MockProviderAdapter 第一轮返回 finish_reason=tool_calls 的响应</span></span>
<span class="line"><span>- McpService.callTool() mock 返回工具执行结果</span></span>
<span class="line"><span>- MockProviderAdapter 第二轮收到 tool_result 后返回最终回答</span></span>
<span class="line"><span></span></span>
<span class="line"><span>验证：</span></span>
<span class="line"><span>① SSE 流正常结束，最后事件是 type=done</span></span>
<span class="line"><span>② MySQL 只有一条 assistant 消息（两轮 LLM 只落一次）</span></span>
<span class="line"><span>③ verify(mcpService).callTool(any(), eq(&quot;check_refund_eligibility&quot;), any())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>重点验证工具调用失败时：mcpService.callTool() 改为抛 RuntimeException，</span></span>
<span class="line"><span>验证 SSE 流仍然正常结束，不挂起，这是 review 环节发现的高危问题。</span></span></code></pre></div><p>场景三：对话上下文多轮正确性（先写测试，再修bug）</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>写03：对话上下文多轮正确性。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这条测试对应一个已知 bug，先写测试，测试应该是红的，然后再修 bug。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试步骤：</span></span>
<span class="line"><span>1. 同一 session 依次发 3 条消息（&quot;第一条&quot;、&quot;第二条&quot;、&quot;第三条&quot;）</span></span>
<span class="line"><span>2. 在第 3 条发送时，拦截 MockProviderAdapter 收到的 ChatRequest</span></span>
<span class="line"><span></span></span>
<span class="line"><span>验证 MockProviderAdapter 第 3 次收到的 messages 数组：</span></span>
<span class="line"><span>① 包含&quot;第一条&quot;和&quot;第二条&quot;的历史消息（验证多轮上下文传递）</span></span>
<span class="line"><span>② 历史消息按时间升序排列（先旧后新，符合 LLM 期望）</span></span>
<span class="line"><span>③ 最后一条是&quot;第三条&quot;（当前用户输入）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这条测试现在应该失败，因为 selectRecentBySessionId 的 SQL 是</span></span>
<span class="line"><span>ORDER BY created_at ASC LIMIT，取的是最旧的消息而非最新的。</span></span>
<span class="line"><span>测试变红之后，再去修 SQL，修完测试变绿。</span></span></code></pre></div><h4 id="集成测试流程固化为skill" tabindex="-1">集成测试流程固化为SKILL <a class="header-anchor" href="#集成测试流程固化为skill" aria-label="Permalink to &quot;集成测试流程固化为SKILL&quot;">​</a></h4><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我刚才做了 Provider CRUD 和对话链路的集成测试，完整流程是：</span></span>
<span class="line"><span>1. 先规划测试清单（不写代码），基于 CLAUDE.md 的核心链路地图分 P0/P1/P2</span></span>
<span class="line"><span>2. CC 先读配置文件确认技术基础（H2/mock profile）再给清单</span></span>
<span class="line"><span>3. 从最简单的场景开始，跑通后再写下一个，不批量生成</span></span>
<span class="line"><span>4. 每个测试类用 &amp;#64;Sql 独立数据 + &amp;#64;Transactional 回滚，不共享数据</span></span>
<span class="line"><span>5. mock 策略：外部 API mock 掉，DB 用真实 H2</span></span>
<span class="line"><span>6. 对于已知 bug，先写失败的测试，再修 bug，让测试从红变绿</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请把这个流程固化成 SKILL.md 文件。</span></span>
<span class="line"><span>以后对任何模块用 /集成测试 命令触发，CC 自动按这个流程走。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SKILL.md 要包含：</span></span>
<span class="line"><span>- 触发方式</span></span>
<span class="line"><span>- 读配置文件的步骤（先确认 mock profile / H2 配置）</span></span>
<span class="line"><span>- 测试清单规划的输出格式（表格含 IT 编号/场景/验证点/优先级）</span></span>
<span class="line"><span>- 标准的 mock 策略决策表</span></span>
<span class="line"><span>- 测试基类模板（&amp;#64;SpringBootTest + mock profile + MockMvc 标准配置）</span></span>
<span class="line"><span>- 场景递进原则（从最简单开始）</span></span>
<span class="line"><span>- 已知 bug 的处理方式（先写红测试，再修 bug）</span></span></code></pre></div><p>固化后放在 <code>.claude/skills/integration-test.md</code>。下次写Agent模块的集成测试，直接：</p><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>./integration-test agent模块</span></span></code></pre></div><p>流程自动复用，包括先读配置、分优先级规划、递进执行这些步骤。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这一讲做完，你手上有四样东西：</p><ol><li><p><strong>方法论</strong>：质量保证是一个体系，不是AI能直接闭环的。</p></li><li><p><strong>CLAUDE.md里的核心链路地图和单测规范</strong>：所有模块共享的判断基础，后续所有测试都从这里出发。</p></li><li><p><strong>单测SKILL</strong>：任何Service方法一键触发，Claude Code自动走完整流程，包括主动检查计划里的技术问题。</p></li><li><p><strong>集成测试SKILL</strong>：任何模块一键触发，流程自动复用。</p></li></ol><p>这套体系解决的是前三层： <strong>核心链路识别、单元测试、集成测试</strong>。第四层混沌测试，故障注入验证系统在真实混乱条件下能不能撑住，这一讲没有展开，但它是存在的。当系统进入维护阶段、有了真实用户负载之后，混沌测试是质量体系的下一个自然延伸。</p><p>80-90% 的代码可以放心给AI写，前提是你知道剩下的10-20% 在哪里，哪些地方要自己把关。</p><p>体系是工具，判断力才是核心。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>按照这一讲的判断框架，审视你现在工作中的一个项目：哪些代码适合给AI写，哪些需要自己把关？核心链路是哪几条？用Step 0的提示词让Claude Code帮你识别，再对比你自己的判断，看两者有没有差异。</p></li><li><p>双模型review的提示词可以针对场景调整。如果要review的是安全敏感的代码，比如Hify的鉴权逻辑，review维度应该怎么变？试着写一个专门针对安全review的提示词。</p></li><li><p>混沌测试的场景设计依赖对系统风险的理解。基于Step 0生成的风险地图，Hify最应该优先验证哪三个混沌场景？为什么？</p></li></ol><p>期待你的分享！如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,118)])])}const g=a(l,[["render",i]]);export{h as __pageData,g as default};
