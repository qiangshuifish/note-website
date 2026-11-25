import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"19 | 智能客服系统搭建：如何基于OpenClaw构建RAG智能客服？","description":"","frontmatter":{},"headers":[{"level":2,"title":"理解 RAG：让 Agent 基于知识库回答","slug":"理解-rag-让-agent-基于知识库回答","link":"#理解-rag-让-agent-基于知识库回答","children":[]},{"level":2,"title":"准备知识库：把 FAQ 喂给客服 Agent","slug":"准备知识库-把-faq-喂给客服-agent","link":"#准备知识库-把-faq-喂给客服-agent","children":[]},{"level":2,"title":"创建客服 Skill：定义行为规范和转人工边界","slug":"创建客服-skill-定义行为规范和转人工边界","link":"#创建客服-skill-定义行为规范和转人工边界","children":[{"level":3,"title":"创建 Skill 文件","slug":"创建-skill-文件","link":"#创建-skill-文件","children":[]},{"level":3,"title":"让 Skill 生效","slug":"让-skill-生效","link":"#让-skill-生效","children":[]}]},{"level":2,"title":"配置客服 Agent：让 RAG 链路跑通","slug":"配置客服-agent-让-rag-链路跑通","link":"#配置客服-agent-让-rag-链路跑通","children":[]},{"level":2,"title":"验证客服核心链路","slug":"验证客服核心链路","link":"#验证客服核心链路","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"OpenClaw核心原理与实战/19｜智能客服系统搭建：如何基于OpenClaw构建RAG智能客服？.md","filePath":"OpenClaw核心原理与实战/19｜智能客服系统搭建：如何基于OpenClaw构建RAG智能客服？.md","lastUpdated":1795533128000}'),l={name:"OpenClaw核心原理与实战/19｜智能客服系统搭建：如何基于OpenClaw构建RAG智能客服？.md"};function i(t,s,c,o,h,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_19-智能客服系统搭建-如何基于openclaw构建rag智能客服" tabindex="-1">19 | 智能客服系统搭建：如何基于OpenClaw构建RAG智能客服？ <a class="header-anchor" href="#_19-智能客服系统搭建-如何基于openclaw构建rag智能客服" aria-label="Permalink to &quot;19 | 智能客服系统搭建：如何基于OpenClaw构建RAG智能客服？&quot;">​</a></h1><p>你好，我是 Henry，欢迎来到《OpenClaw 核心原理与实战》。</p><p>前两节课我们完成了环境搭建和多 Agent 配置，Agent 已经能在聊天窗口里回复消息了。但如果你直接把通用助手拉去当客服，很快就会遇到三个致命问题：</p><ol><li><p>回答不准，没有你的业务知识。用户问“你们的退货政策是什么”，Agent 编了一个看似合理但和你公司实际政策完全不符的回答。它没有读过你的 FAQ 文档，只能靠常识猜。</p></li><li><p>记不住人，每次都是第一次见面。同一个用户上午问了产品功能、下午又来问价格，Agent完全不记得上午的对话，更别提跨天的连续服务了。</p></li><li><p>不知道边界，该停不停。涉及退款争议、账号被盗、用户投诉等敏感问题时，Agent 还在滔滔不绝地回答，不知道该引导用户联系人工。</p></li></ol><p>这三个问题的根本原因是一样的：Agent 有推理能力，但缺少业务知识、客户记忆和行为边界。</p><p>今天要做的，就是用 OpenClaw 的三个核心机制来逐一解决。Memory 知识库解决回答不准，Memory 客户记忆解决记不住人，Skill 行为指引解决不知道边界。三者协同，构成一个完整的 RAG（检索增强生成）智能客服系统。</p><p>最终实现的效果就可以很具体了，用户在 Telegram 里问“你们的退货政策是什么”，Agent 从知识库中检索到准确答案回复；用户情绪激动说要投诉，Agent 安抚后引导转人工。全程零代码，配置驱动。</p><h2 id="理解-rag-让-agent-基于知识库回答" tabindex="-1">理解 RAG：让 Agent 基于知识库回答 <a class="header-anchor" href="#理解-rag-让-agent-基于知识库回答" aria-label="Permalink to &quot;理解 RAG：让 Agent 基于知识库回答&quot;">​</a></h2><p>为什么先讲 RAG 而不是直接动手实践？因为 RAG 是今天整条链路的底层原理，后面写知识库文件、配置 Memory 检索、Skill 里的检索知识库步骤，全都建立在这个原理之上。花两分钟搞懂它，后面每一步你就都知道为什么了。</p><p>RAG（Retrieval-Augmented Generation，检索增强生成）的原理非常直白：先搜后答。不是让 LLM 凭空生成，而是先从知识库里搜到相关内容，再把搜到的内容连同用户问题一起交给LLM，让它基于这些内容来回答。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>用户提问：&quot;你们的退货政策是什么？&quot;</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>① 检索（Retrieval）：从知识库中搜索&quot;退货政策&quot;相关片段</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>② 注入（Augment）：把搜到的片段放进 LLM 的上下文</span></span>
<span class="line"><span> ↓</span></span>
<span class="line"><span>③ 生成（Generate）：LLM 基于这些片段回答——而不是自己编</span></span></code></pre></div><p>在 OpenClaw 中实现 RAG，不需要额外搭建向量数据库或检索引擎。为什么？因为OpenClaw 的 Memory 系统天然就是一个 RAG 引擎，它使用混合搜索（BM25 关键词搜索 +</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>向量语义搜索），把你写入的知识自动分块、向量化、建索引。Agent 通过 memory_search</span></span></code></pre></div><p>工具就能检索。</p><p>换句话说：你把 FAQ 写进 Memory 文件 → OpenClaw 自动建索引 → Agent 用memory_search 检索 → LLM 基于检索结果回答。这就是一个完整的 RAG 链路，全部内置，零外部依赖。</p><p>原理清楚了。接下来要做的第一件事是，把业务知识灌进 Memory。这是 RAG 链路的起点，没有知识，检索无从谈起。</p><h2 id="准备知识库-把-faq-喂给客服-agent" tabindex="-1">准备知识库：把 FAQ 喂给客服 Agent <a class="header-anchor" href="#准备知识库-把-faq-喂给客服-agent" aria-label="Permalink to &quot;准备知识库：把 FAQ 喂给客服 Agent&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>OpenClaw 的 Memory 系统从工作目录下的 MEMORY.md 和 memory/ 目录读取知识。我们只</span></span></code></pre></div><p>需要把 FAQ 和业务规则写成 Markdown 文件，放到正确的位置即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在你的 OpenClaw 工作目录下创建 MEMORY.md，详细案例内容如下：</span></span>
<span class="line"><span># 客服知识库</span></span>
<span class="line"><span>## 公司与产品信息</span></span>
<span class="line"><span>- 公司名称：XX 科技有限公司</span></span>
<span class="line"><span>- 旗舰产品：XX 智能音箱（售价 ¥599）、XX 智能手表（售价 ¥1299）</span></span>
<span class="line"><span>- 官方商城：https://shop.xx.com</span></span>
<span class="line"><span>- 客服热线：400-888-XXXX（工作日 9:00-18:00）</span></span>
<span class="line"><span>## 退货退款政策</span></span>
<span class="line"><span>- 7天无理由退货：收货后7天内，商品需未拆封、不影响二次销售</span></span>
<span class="line"><span>- 质量问题退货：收货后30天内，需提供问题照片或视频</span></span>
<span class="line"><span>- 退款时效：审核通过后 3-5 个工作日原路退回</span></span>
<span class="line"><span>- 不支持退货的情况：已拆封的定制产品、赠品、积分兑换商品</span></span>
<span class="line"><span>## 保修政策</span></span>
<span class="line"><span>- 标准保修期：购买之日起 12 个月</span></span>
<span class="line"><span>- 延保服务：可额外购买 12 个月延保（¥99）</span></span>
<span class="line"><span>- 保修范围：非人为损坏的硬件故障</span></span>
<span class="line"><span>- 不在保修范围内：进水、摔落、私自拆解</span></span>
<span class="line"><span>## 常见故障排查</span></span>
<span class="line"><span>### 音箱无法联网</span></span>
<span class="line"><span>1. 确认 Wi-Fi 密码是否正确</span></span>
<span class="line"><span>2. 确认路由器是否支持 2.4GHz（不支持 5GHz）</span></span>
<span class="line"><span>3. 重置设备：长按顶部按钮 10 秒</span></span>
<span class="line"><span>4. 仍无法解决请联系客服热线</span></span>
<span class="line"><span>### 手表无法充电</span></span>
<span class="line"><span>1. 检查充电底座触点是否有异物</span></span>
<span class="line"><span>2. 更换充电线或适配器尝试</span></span>
<span class="line"><span>3. 确认手表背面触点是否清洁</span></span>
<span class="line"><span>4. 仍无法解决请联系客服热线</span></span>
<span class="line"><span>### 如何申请发票</span></span>
<span class="line"><span>- 在订单详情页点击&quot;申请发票&quot;</span></span>
<span class="line"><span>- 支持电子发票（即时开具）和纸质发票（5 个工作日邮寄）</span></span>
<span class="line"><span>- 发票抬头修改需在下单前完成</span></span>
<span class="line"><span>这份 MEMORY.md 覆盖了客服最常见的四类问题：产品信息、退货政策、保修政策、故障排</span></span></code></pre></div><p>查。把它放到工作目录后，OpenClaw 启动时会自动完成三件事：</p><ol><li><p>分块：按段落将长文档切成若干片段（chunk）</p></li><li><p>向量化：用 Embedding 模型将每个片段转成向量，捕捉语义信息</p></li><li><p>建索引：将向量和原文存入 SQLite 数据库，建立向量索引和全文索引</p></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>之后 Agent 调用 memory_search(&quot;退货政策&quot;) 时，系统同时执行关键词搜索（精确匹配</span></span></code></pre></div><p>“退货政策”这几个字）和语义搜索（理解退货和退款是相关概念），两路结果加权合并，返回最相关的片段。</p><p>关键认知：你不需要做任何索引构建操作，写好 Markdown 放进去就行。后续你修改了退货政策，改完文件重启 OpenClaw，索引自动更新。</p><p>现在，知识库准备好了，Agent 有了可搜索的业务知识。但 Agent 光有知识还不够，一个合格的客服需要知道：该用什么语气回答？遇到退款争议怎么处理？什么时候必须转人工？这些行为规范不在知识库里，它们需要通过 Skill 来定义。</p><h2 id="创建客服-skill-定义行为规范和转人工边界" tabindex="-1">创建客服 Skill：定义行为规范和转人工边界 <a class="header-anchor" href="#创建客服-skill-定义行为规范和转人工边界" aria-label="Permalink to &quot;创建客服 Skill：定义行为规范和转人工边界&quot;">​</a></h2><p>为什么知识库和 Skill 要分开？因为它们解决的是不同层面的问题。知识库回答的是“事实是什么”（退货政策是 7 天内），Skill 回答的是“该怎么做”（遇到投诉要转人工、回复要用“您”、每次结尾问“还有其他问题吗”）。前者是知识，后者是行为规范。</p><h3 id="创建-skill-文件" tabindex="-1">创建 Skill 文件 <a class="header-anchor" href="#创建-skill-文件" aria-label="Permalink to &quot;创建 Skill 文件&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mkdir</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.openclaw/skills/customer-service</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">创建</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.openclaw/skills/customer-service/SKILL.md，详细内容如下：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">name:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> customer-service</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">description:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;基于知识库的智能客服——检索知识、回答问题、引导转人工&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">metadata:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> openclaw:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   emoji:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 智能客服</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## When to Use</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户咨询产品信息、价格、功能</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户询问退货、退款、保修等售后问题</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户反馈产品故障，需要排障指导</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 用户提出投诉或需要人工帮助</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 执行步骤</span></span></code></pre></div><ul><li>收到客户问题时，严格按以下三步执行：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>### 第一步：检索知识库</span></span>
<span class="line"><span>- 使用 memory_search 工具检索与用户问题相关的知识</span></span>
<span class="line"><span>- 如果检索到匹配内容，基于检索结果回答（严禁编造）</span></span>
<span class="line"><span>- 如果检索不到，诚实告知&quot;这个问题我暂时无法确认&quot;，并引导联系人工</span></span>
<span class="line"><span>### 第二步：判断问题类型并执行对应策略</span></span>
<span class="line"><span>**常规咨询**（产品信息、价格、功能）</span></span>
<span class="line"><span>→ 直接基于知识库回答，简洁明了</span></span>
<span class="line"><span>**售后问题**（退货、退款、保修）</span></span>
<span class="line"><span>→ 基于知识库回答 + 主动提供具体操作步骤</span></span>
<span class="line"><span>**故障排查**（设备异常、功能不正常）</span></span>
<span class="line"><span>→ 按知识库中的排障步骤逐步引导用户操作</span></span>
<span class="line"><span>**以下情况必须转人工（不要自行处理）：**</span></span>
<span class="line"><span>- 用户明确要求&quot;转人工&quot;</span></span>
<span class="line"><span>- 涉及退款金额争议或订单纠纷</span></span>
<span class="line"><span>- 涉及账号安全（被盗、异常登录）</span></span>
<span class="line"><span>- 用户情绪明显激动、表达不满或投诉</span></span>
<span class="line"><span>- 知识库中找不到答案的复杂问题</span></span>
<span class="line"><span>### 第三步：按话术规范回复</span></span></code></pre></div><ul><li>常规回答格式：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[回答内容]</span></span></code></pre></div><ul><li><p>还有其他问题吗？😊</p></li><li><p>转人工格式：</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[先安抚用户情绪]</span></span></code></pre></div><ul><li>这个问题我帮您转接人工客服，以确保给您最准确的处理。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>📞 客服热线：400-888-XXXX（工作日 9:00-18:00）</span></span>
<span class="line"><span>## 话术规范</span></span>
<span class="line"><span>- 称呼用户为&quot;您&quot;，语气亲切、耐心、专业</span></span>
<span class="line"><span>- 回答简洁明了，避免长篇大论（200字以内，排障步骤除外）</span></span>
<span class="line"><span>- 不确定的信息说&quot;我帮您确认一下&quot;，不编造</span></span>
<span class="line"><span>- 客户提供的个人信息（姓名、订单号）用 memory_write 记录</span></span>
<span class="line"><span>## Important Notes</span></span>
<span class="line"><span>- 所有回答必须基于知识库检索结果，严禁编造产品信息和政策</span></span>
<span class="line"><span>- 遇到用户不满时，先安抚情绪再引导转人工，不要急于解释</span></span>
<span class="line"><span>- 客户信息存入记忆后，下次该客户再来时主动问候</span></span></code></pre></div><h3 id="让-skill-生效" tabindex="-1">让 Skill 生效 <a class="header-anchor" href="#让-skill-生效" aria-label="Permalink to &quot;让 Skill 生效&quot;">​</a></h3><p>我们创建完成 Skill 需要重启 OpenClaw：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/.openclaw/skills/ 下的 Skill 文件会被 OpenClaw 自动扫描加载，注入到 Agent 的</span></span></code></pre></div><p>System Prompt 中。</p><p>到这里，知识库（MEMORY.md）解决了 Agent 知道什么，Skill 解决了 Agent 怎么当客服。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>但和上节课的投研助手案例一样，Skill 只是手册，Agent 有没有 memory_search 工具可</span></span></code></pre></div><p>用？Memory 系统是否开启？客户之间的会话是否隔离？这些需要通过配置来落实。</p><h2 id="配置客服-agent-让-rag-链路跑通" tabindex="-1">配置客服 Agent：让 RAG 链路跑通 <a class="header-anchor" href="#配置客服-agent-让-rag-链路跑通" aria-label="Permalink to &quot;配置客服 Agent：让 RAG 链路跑通&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Agent 到底有没有这个工具、Memory 系统是否启用，取决于 openclaw.yaml。知识库是弹</span></span></code></pre></div><p>药，Skill 是战术手册，配置是武器装备。三者齐了，才能上阵。详细的配置案例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># openclaw.yaml — RAG 智能客服配置</span></span>
<span class="line"><span>providers:</span></span>
<span class="line"><span> anthropic:</span></span>
<span class="line"><span>   apiKey: &quot;\${ANTHROPIC_API_KEY}&quot;</span></span>
<span class="line"><span>agents:</span></span>
<span class="line"><span> list:</span></span>
<span class="line"><span>   - id: support</span></span>
<span class="line"><span>     model: claude-sonnet-4-20250514</span></span>
<span class="line"><span>     identity:</span></span>
<span class="line"><span>       name: &quot;客服小助&quot;</span></span>
<span class="line"><span>       instructions: |</span></span>
<span class="line"><span>         你是 XX 科技的智能客服助手。</span></span>
<span class="line"><span>         - 回答问题时，严格按照 customer-service Skill 的流程执行</span></span>
<span class="line"><span>         - 所有回答必须基于知识库检索结果，不编造信息</span></span>
<span class="line"><span>         - 遇到转人工规则中的情况，立即引导转人工，不自行处理</span></span>
<span class="line"><span>         - 主动记住客户信息（称呼、产品型号、历史问题）</span></span>
<span class="line"><span>     tools:</span></span>
<span class="line"><span>       allow:</span></span>
<span class="line"><span>         - memory_search     # 检索知识库——RAG 的核心</span></span>
<span class="line"><span>         - memory_write      # 记录客户信息和反馈</span></span>
<span class="line"><span>         - web_search        # 搜索产品更新等补充信息</span></span>
<span class="line"><span>         - message           # 发送消息</span></span>
<span class="line"><span>       deny:</span></span>
<span class="line"><span>         - exec              # 客服不需要执行命令</span></span>
<span class="line"><span>         - write             # 客服不需要写文件</span></span>
<span class="line"><span>         - edit              # 客服不需要编辑文件</span></span>
<span class="line"><span>     memorySearch:</span></span>
<span class="line"><span>       enabled: true         # 开启 Memory——RAG 链路的前提</span></span>
<span class="line"><span>       maxResults: 5</span></span>
<span class="line"><span>session:</span></span>
<span class="line"><span> dmScope: &quot;per-peer&quot;          # 每个客户独立会话</span></span>
<span class="line"><span>channels:</span></span>
<span class="line"><span> telegram:</span></span>
<span class="line"><span>   accountId: &quot;\${TELEGRAM_BOT_TOKEN}&quot;</span></span></code></pre></div><p>这个配置里关键设置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>memorySearch.enabled: true+memory_search，是 RAG 链路的两个开关。</span></span>
<span class="line"><span>前者让 OpenClaw 在启动时加载 MEMORY.md 并建索引，后者让 Agent 在对话中能调用检索</span></span></code></pre></div><p>工具。两个都开了，RAG 链路才完整：用户问退货政策 → Agent 调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>memory_search(&quot;退货政策&quot;) → Memory 引擎返回相关片段 → LLM 基于片段回答。</span></span>
<span class="line"><span>memory_write，记住客户，实现连续服务。</span></span></code></pre></div><p>客服场景和投研助手场景的 Memory 用法有一个重要区别：投研助手主要存分析结论（Agent产生的知识），客服助手主要存客户信息（用户提供的信息，姓名、订单号、历史问题）。目的是让客户下次来时，Agent 能说“张先生您好，上次您反馈的音箱联网问题解决了吗？”，这种记忆信息，是智能客服和传统 FAQ 机器人的核心区别。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dmScope: &quot;per-peer&quot;，客户之间的会话隔离。</span></span>
<span class="line"><span>客服场景下多个客户同时在线，A 客户的订单信息绝不能出现在 B 客户的对话里。per-peer</span></span></code></pre></div><p>模式让每个客户拥有独立的 Session Key，天然隔离。</p><p>工具白名单，客服场景的最小权限。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>客服 Agent 只有 4 个工具。exec（命令执行）、write（文件写入）、edit（文件编辑）全</span></span></code></pre></div><p>部禁止。客服不需要这些能力，开放了反而增加被 Prompt 注入攻击的风险面。</p><p>上面配置了所有必要设置，现在需要重启 OpenClaw 使配置生效：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker-compose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span></span></code></pre></div><h2 id="验证客服核心链路" tabindex="-1">验证客服核心链路 <a class="header-anchor" href="#验证客服核心链路" aria-label="Permalink to &quot;验证客服核心链路&quot;">​</a></h2><p>接下来是验证，发真实的消息，看整条 RAG 客服链路能不能跑通。</p><p>在 Telegram 中给 Agent 发消息：</p><ul><li>你们的退货政策是什么？</li></ul><p>Agent 背后的执行链路：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>① 消息进入 → 路由到 support Agent</span></span>
<span class="line"><span>② Skill 触发 → 匹配&quot;售后问题&quot;</span></span>
<span class="line"><span>③ 第一步：调用 memory_search(&quot;退货政策&quot;)</span></span>
<span class="line"><span>  → Memory 引擎执行混合搜索</span></span>
<span class="line"><span>  → 返回 MEMORY.md 中&quot;退货退款政策&quot;段落</span></span>
<span class="line"><span>④ 第二步：判断为&quot;售后问题&quot; → 基于检索结果回答</span></span>
<span class="line"><span>⑤ 第三步：按话术规范格式回复</span></span></code></pre></div><p>预期收到类似回复：</p><ul><li>您好！我们的退货政策如下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>📦 7天无理由退货：收货后7天内，商品需未拆封且不影响二次销售</span></span>
<span class="line"><span>🔧 质量问题退货：收货后30天内，需提供问题照片或视频</span></span>
<span class="line"><span>💰 退款时效：审核通过后 3-5 个工作日原路退回</span></span>
<span class="line"><span>⚠️ 不支持退货的情况：已拆封的定制产品、赠品、积分兑换商品</span></span></code></pre></div><ul><li>还有其他问题吗？😊</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>调优方法：如果检索结果不够精准，可以优化 MEMORY.md 的写法，用更清晰的标题（## 退</span></span></code></pre></div><p>货退款政策）、更结构化的条目（用列表而非长段落）。Memory 的混合搜索对标题和关键词特别敏感。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>回顾今天的完整链路，我们围绕一个核心问题，怎样让 Agent 基于企业知识库做客服。</p><p>第一步，理解 RAG 原理。先搜后答，Agent 的回答基于知识库检索结果，而不是自己编造。OpenClaw 的 Memory 系统天然就是 RAG 引擎，写 Markdown 进去，自动分块、向量化、建索引。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>第二步，准备知识库。把 FAQ、产品信息、售后政策、故障排查步骤写成 MEMORY.md。关键</span></span></code></pre></div><p>认知：不需要手动建索引，写好文件放进去就行。</p><p>第三步，创建客服 Skill。定义了三步工作流（检索知识 → 判断类型 → 规范回复），五条转人工规则——在客服场景中，知道什么时候“不回答”比“回答得好”更重要。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>第四步，配置 Agent。开启 memorySearch 让 RAG 链路跑通，memory_write 让 Agent</span></span>
<span class="line"><span>记住客户，per-peer 隔离不同客户的会话，白名单模式最小化安全风险。</span></span></code></pre></div><p>这四步我们可以总结为客服类型的助手构建方式：</p><p>构建 RAG 智能客服 = 灌知识（MEMORY.md） + 写规范（SKILL.md） + 改配置（开记忆、控权限、隔会话） + 接通道。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请用你自己公司的业务知识替换 MEMORY.md 的内容（产品 FAQ、售后政策、常见问题等），</span></span></code></pre></div><p>配置客服 Agent 并在聊天通道中完成三项验证测试（知识库问答、投诉转人工、客户记忆）。最后提交 MEMORY.md + SKILL.md + openclaw.yaml。</p><p>欢迎你在留言区与我交流！如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,86)])])}const k=a(l,[["render",i]]);export{g as __pageData,k as default};
