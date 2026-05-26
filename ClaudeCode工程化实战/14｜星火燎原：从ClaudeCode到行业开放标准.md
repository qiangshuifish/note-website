# 14｜星火燎原：从Claude Code到行业开放标准
> 释题：星火燎原。一个 Markdown 文件格式，用百天时间从一个产品特性变成行业开放标准。这不是偶然——它揭示了 AI Agent 生态中，什么样的机制能活下来，什么样的知识能跨越边界。

你好，我是黄佳。前面几讲，我们从结构设计、渐进式披露到高级模式，把 Skills 的工程能力掰开揉碎讲了个透。

但如果我们只停留在“怎么写好一个 SKILL.md”，就会错过一个更大的故事。

- 2025 年 10 月，Anthropic 在 Claude Code 里上线了 Skills。那时候没人觉得这是什么大事——不过是一个 Markdown 文件里写写指令嘛。

- 2026 年 2 月，27+ Agent 平台原生支持这个格式。52,000+ Skills 被注册。Top Skills 单个安装量突破 180,000。


**从一个产品特性到行业开放标准，Skills只用了不到百天。**

这一讲，我们来回答三个问题：第一，发生了什么；第二，为什么偏偏是 Skills 能出圈；第三，这对你作为 AI 工程师意味着什么。

我们先用一张图来完整复盘这些天里发生的事情。

![](images/952321/88dd7ddyy69ef588d01b8e32404775b7.jpg)

整个故事的转折点是 12 月 18 日——不是技术突破，而是一个 **战略决策**：Anthropic 选择把 Skills 开放。

在此之前，Skills 是 Claude Code 的竞争优势。开放意味着竞争对手可以免费使用它、甚至用它来对抗你。为什么 Anthropic 愿意这样做？

**因为标准的价值大于独占的价值。**

独占 Skills，只有 Claude Code 的用户可以用；开放 Skills，所有 Agent 平台上创建的 Skills 都兼容 Claude Code。这是典型的平台经济学——当你的格式成为行业标准，每个人创建的内容都在增强你的生态。就像 USB 标准，Intel 发明了它，但开放后全世界都在用，Intel 反而获益最大。

## 谁在用：四层采纳矩阵

知道了时间线，接下来看采纳范围。截至2026年为止的 27+ 平台并不是简单的堆砌数字，它们呈现出清晰的分层结构。

![](images/952321/12c71052yy0d9279846d0cfcbd1018cf.jpg)

当 OpenAI 的 Codex CLI 和 Google 的 Antigravity 都支持你的格式时，这已经不是“一家公司的功能”了——它是事实标准。

```plain
                    Agent Skills 采纳全景图

    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │   Anthropic                    OpenAI               │
    │   ├─ Claude Code ★(创始者)     ├─ Codex CLI         │
    │   └─ Claude.ai                └─ ChatGPT(测试中)    │
    │                                                     │
    │   Google                      Microsoft             │
    │   ├─ Antigravity              ├─ VS Code            │
    │   ├─ Gemini CLI               └─ GitHub Copilot     │
    │   └─ Gemini                                         │
    │                                                     │
    │   Block        Cursor         Windsurf    Trae      │
    │   └─ Goose     (原生支持)     (原生支持)   (原生支持) │
    │                                                     │
    │   Manus        Amp            Roo Code    Letta     │
    │   OpenCode     Kiro CLI       Droid       Kilo      │
    │                                                     │
    │                  共 27+ 平台                         │
    └─────────────────────────────────────────────────────┘

```

与此同时，Anthropic 还在 `claude.com/connectors` 上线了 Skills 目录，第三方合作伙伴发布了官方 Skill 包：

![](images/952321/1000a8e1461yy74e4b98f19916167db1.jpg)

企业级管理方面，Anthropic 的 Team/Enterprise 计划支持管理员集中配置 Skills——控制哪些 Skills 可用，同时让员工自定义自己的工作流。

## Skills 出圈的三个本质属性

刚刚我们了解了“发生了什么”，更重要的问题是“为什么”。为什么是 Skills 出圈，而不是 SubAgents、不是 Hooks、不是 Plugins？

答案藏在 Skills 的三个本质属性里。

**第一，声明式（Declarative）。** Skills 的载体是纯 Markdown 文件——YAML frontmatter 加 Markdown 正文。没有编程语言，没有 import/require，没有编译和构建步骤。这意味着什么？任何能读 Markdown 的系统都能理解一个 Skill。不需要 Python 运行时，不需要 Node.js 环境。Claude 能读，GPT 能读，Gemini 也能读——因为它们都能读 Markdown。

如果 Skills 是用 Python 类定义的（像 LangChain 的 Tool），那每个平台都需要一个 Python 运行时、兼容的 SDK、和特定的加载逻辑。切换平台就等于重写代码。

**第二，自包含（Self-contained）。** 一个 Skill 就是一个文件夹。它不依赖任何外部注册中心，不需要在某个平台注册，不需要安装特定的 runtime，不需要配置 API key，不需要连接外部服务。复制这个文件夹到任何支持 Skills 的 Agent 环境，它就能工作。这就是为什么 Git 是 Skills 的天然分发渠道—— `git clone` 就是“安装”。

**第三，知识本位（Knowledge-centric）。** Skills 的价值不在格式——格式只是Markdown；不在工具——工具是 Agent 自带的；不在运行时——运行时是 Agent 平台提供的。价值在内容本身，在“怎么做某件事”的知识，在可操作的领域智慧。一份好的“如何做代码审查”的 SOP，不管是 Claude 读还是 GPT 读还是 Gemini 读，知识本身都是有价值的。

这三个属性合在一起，天然具备跨平台复用的属性：

```plain
声明式     → 任何 LLM 都能读
自包含     → 任何文件系统都能存
知识本位   → 知识的价值不绑定平台

```

![](images/952321/9e7f59e8007f183ff83e1853e387d89d.jpg)

## 为什么 SubAgents 不能出圈

理解了 Skills 为什么能出圈，再看 SubAgents 为什么不能——两者的对比揭示了一个深层的架构原理。

![](images/952321/bc2bd32c8fceba4200aae4cbf9d0b9f9.jpg)

根本原因在于：Skills 封装的是 **知识（Knowledge）**，SubAgents 封装的是 **行为（Behavior）**。

![](images/952321/55848f07b8d6cc2aa951f419ed0cd38f.jpg)

用一个简单的类比来说：Skills 像一本烹饪书，不管你用什么厨房（Claude / GPT / Gemini），只要能读懂食谱，就能做菜，换厨房带上书就行；SubAgents 像一位厨师，厨师的技能绑定在人身上，你不能把“厨师”复制到另一家餐厅的系统里，你能做的是给新厨师一本食谱。

如果把 Claude Code 的所有机制排列起来看可移植性，规律非常清晰。

![](images/952321/2f8bdef00a03bac25a6dae8645e08371.jpg)

**越接近“纯知识”的机制越容易跨平台，越接近“运行时行为”的机制越绑定平台。** Skills 是最纯粹的知识封装，所以它出圈了。

## Agentic AI Foundation——AI 时代的 W3C

Skills 出圈的背后，是一个更大的行业趋势：Agent 标准化运动。

2025 年 12 月 9 日，Anthropic、OpenAI 和 Block（原 Square）在 Linux Foundation 下联合成立了 **Agentic AI Foundation (AAIF)**。如果你熟悉 Web 标准的历史，这就是 AI 时代的 W3C——让不同厂商的 Agent 能用同一套标准互操作。

AAIF 有三大创始项目，每个解决 Agent 生态的一个核心问题。

```plain
┌─────────────────────────────────────────────────────────┐
│                 Agentic AI Foundation                     │
│                                                          │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│    │     MCP       │  │    goose      │  │  AGENTS.md   │  │
│    │  (Anthropic)  │  │   (Block)     │  │  (OpenAI)    │  │
│    │              │  │              │  │              │  │
│    │  Agent 如何   │  │  Agent 如何   │  │  Agent 如何   │  │
│    │  连接工具？   │  │  落地执行？   │  │  理解项目？   │  │
│    │              │  │              │  │              │  │
│    │  = 工具接口   │  │  = 执行框架   │  │  = 项目上下文  │  │
│    │    标准       │  │    参考实现   │  │    标准       │  │
│    └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│    Platinum: AWS, Anthropic, Block, Bloomberg,            │
│              Cloudflare, Google, Microsoft, OpenAI        │
│                                                          │
│    Gold:     Cisco, Datadog, Docker, IBM, JetBrains,     │
│              Oracle, Salesforce, SAP, Shopify, ...        │
│                                                          │
│    共 50+ 企业会员                                        │
└─────────────────────────────────────────────────────────┘

```

Agent Skills 不是 AAIF 的三大创始项目之一——它是 Anthropic 在 AAIF 成立 9 天后独立发布的开放标准。但它与 AAIF 生态密切关联。

MCP 提供工具能力，Skills 提供使用知识——Agent 同时需要两者。goose 原生支持加载 Agent Skills。AGENTS.md 是项目的通用规则和指南，Skills 是特定领域的专业知识——前者是常驻全局上下文（push），后者是按需加载领域知识（pull）。

这里有一个关键发现：AGENTS.md 与 Skills 的关系，完美映射到我们讲过的 CLAUDE.md 与 Skills 的关系（参考 [第 9 讲](https://time.geekbang.org/column/article/945937)）。

![](images/952321/7de335f201d02633dd156c4bc5477419.jpg)

**这不是巧合。** Claude Code 的架构设计就是这套标准的原型。你学的不是一个产品的用法，而是行业标准的第一手实践。

## skills.sh——Skills 的 npm

有了标准，自然就需要分发机制。2026 年 1 月 20 日，Vercel 推出了 **skills.sh**——Agent Skills 的包管理器和目录服务。如果 Agent Skills 是“代码包”，那 skills.sh 就是“npm”。

```plain
# 安装一个 Skill
npx skills add vercel-labs/next-app-creation

# 交互式搜索和发现 Skills
npx skills find

# 更新本地已安装的 Skills
npx skills update

```

生态数据如下表所示：

![](images/952321/c14303cd3214f6aaed7853f965dcd037.jpg)

skills.sh 的核心理念是把 Agent 推理与执行分离——给 Agent 一组预定义的、可审计的命令，而不是让它动态生成 shell 逻辑。

```plain
传统方式（Agent 自由执行）：
  Agent → 推理"我需要构建这个项目" → 自己生成 npm build 命令 → 执行
  问题：不可预测、不可审计

Skills 方式（Agent 调用预定义 Skill）：
  Agent → 触发 "build-project" Skill → Skill 内置标准构建流程 → 执行
  优势：可预测、可审计、可复用

```

如果你在本课程中创建了有价值的 Skill，你可以通过 skills.sh 发布到全球生态。你在课程项目中创建的 `.claude/skills/api-generating/SKILL.md`，任何人都可以通过 `npx skills add your-username/api-generating` 安装使用。你学到的 Skill 工程能力不仅在 Claude Code 中有用——它是跨平台的、行业标准级别的能力。

## Push vs Pull 大辩论：AGENTS.md vs Skills

有了行业标准和分发机制，一个自然的问题浮出水面：既然 AGENTS.md（Push）和 Skills（Pull）是互补的，那什么时候该用哪个？

2026 年 2 月 2 日，Vercel 发布了一篇引发广泛讨论的博文—— **AGENTS.md outperforms skills in our agent evals**。他们对 Build、Lint、Test 三类任务做了严格的对照实验。

![](images/952321/06a721d281360f37525yy2a85e0b2d25.jpg)

表面结论是，一个静态 Markdown 文件打败了按需检索的 Skill 系统。但这个结论需要更深层的分析。

![](images/952321/e4bce88fbf88c97c0yy2fd90c0c0bbe1.jpg)

**这个权衡，你在第 9 讲就学过了**——CLAUDE.md vs Skills 就是同一个 Push vs Pull 的设计决策。如下图所示。

![](images/952321/dd76331e66a5f2e2b6eb739a968d52b8.jpg)

Vercel 的测试场景是 Build / Lint / Test——这些是每个项目都需要的高频操作。对于高频操作，Push 模型当然更好：把构建指南放在 AGENTS.md 里，Agent 每次都能看到。

但如果你的场景是 15 个不同领域的 Skills（安全审查、API 文档、数据分析、性能优化……），每次只需要其中 1-2 个，全部 Push 进上下文等于 120KB+ 的 token 消耗。那 Pull 模型就是唯一可行的选择。

```plain
场景矩阵：

                    知识量少（&lt;8KB）     知识量大（&gt;50KB）
                    ─────────────     ─────────────
  每次都需要          Push (AGENTS.md)    Push + 压缩
  偶尔才需要          都行               Pull (Skills)

```

正确的工程决策不是二选一，而是组合使用。AGENTS.md / CLAUDE.md 放每次都需要的、少量的项目规则（构建命令、测试命令、代码风格）；Skills 放特定场景才需要的、详细的领域知识（安全审查清单、API 文档模板、财务分析 SOP）。行业共识正在形成——AGENTS.md 和 Skills 是互补的，不是竞争的。

![](images/952321/9dfa6f632d066e00a594747d76022bce.jpg)

## 企业本体论升维：从内部 SOP 到行业标准协议

在第 9 讲中，我们建立了一个企业本体论映射：Skills 等于企业的 SOP / 操作手册。这个映射在企业内部是准确的——Skills 就是一家企业的标准操作程序，指导内部员工（Agent）如何执行特定任务。

但 Skills 出圈后，这个映射需要升维。

![](images/952321/ba105de4586ff4aa21eaa2cb996da8f8.jpg)

如果把这个升维后的映射完整展开，会形成一幅更完整的对照图。

![](images/952321/c2a7dfbdc6a419420267d37e7265ab5d.jpg)

这个升维对你作为 AI 工程师有三个实际意义。

**第一，学一次，到处用。** 你在 Claude Code 中精心设计的 Skill——精准的 description、合理的分层、强约束措辞——可以直接用在 Cursor、Copilot、Codex CLI 中。因为它就是一个符合行业标准的 Markdown 文件。

**第二，你的 Skill 工程能力是行业级能力。** 学会如何设计好的 SKILL.md不再是“如何用好 Claude Code”的必要条件，而是“如何为 AI Agent 生态编写标准化知识包”的问题。这就像 2015 年学 REST API 设计——不是学某个框架，而是学行业通用技能。

**第三，Skills 是 AI 时代的 package.json。** 就像 `package.json` 定义了一个 Node.js 项目的依赖和行为， `SKILL.md` 正在成为定义 AI Agent 能力的标准格式。不同的是， `package.json` 是给机器读的 JSON，而 `SKILL.md` 是给 AI 读的 Markdown——因为 AI 的“运行时”就是自然语言。

## 从 Skills 出圈看 AI 工程的趋势

最后，让我们从 Skills 出圈这个事件中，提取三个更大的趋势。

**趋势一：声明式大于命令式。** Skills 出圈证明了在 AI Agent 生态中，声明式知识包比命令式代码更具生命力。因为 AI 的“编译器”就是 LLM——它能直接“编译”自然语言为行动。

```plain
传统软件：代码（命令式） → 编译器 → 机器执行
AI Agent：知识（声明式） → LLM   → Agent 执行

```

**趋势二：标准化大于平台锁定。** AAIF 的成立标志着 AI Agent 行业从平台战争走向标准协作。Anthropic 开放 MCP 和 Skills，OpenAI 开放 AGENTS.md，Block 开放 goose——竞争对手在工具层竞争，在标准层合作。

**趋势三：知识复用大于模型竞争。** 当所有平台的 Agent 都能用同一套 Skills，模型的差异化不再来自“Agent 知道什么”，而来自“Agent 推理有多好”。知识被标准化抽取出来后，模型竞争回归到推理能力的本质。

![](images/952321/474d46d2b4bc376931d271234cc807ea.jpg)

## 总结一下

如果我们把这段历史抽离时间线来看，它揭示的其实不是一个产品成功案例，而是一种“知识形态的进化”。在传统软件时代，能力的边界由代码决定，代码必须依附于某种语言、某种运行时、某种平台生态，因此能力天然带有锁定属性。

而在 Agent 时代，运行时变成了大模型，执行逻辑不再需要通过编译器翻译成机器指令，而是通过语言理解直接转化为行动。于是，知识第一次具备了“可执行性”。当一段结构化的自然语言可以稳定地驱动行为，它就不再只是说明书，而成为一种可以迁移、可以复用、可以标准化的能力单元。

Skills 的出圈并非因为 Anthropic 推广得足够快，而是因为它踩中了这一结构性转折点——它把“领域经验”从平台实现中剥离出来，使其成为独立于运行时的资产。当知识可以脱离具体系统而存在，并通过标准协议在不同 Agent 之间流通时，软件生态的重心便开始从代码复用转向知识复用。

这种变化意味着，未来竞争的焦点不再只是模型参数规模或工具调用效率，而是谁能将复杂领域智慧提炼为可迁移的知识结构。 **这一百天的进展只是一个缩影，它标志着 AI 工程正在从“构建系统”转向“组织知识”，从编写逻辑转向设计认知**。

## 思考题

1. **可移植性自测**：拿你在本课程中创建的任何一个 Skill（比如 api-generating 的 SKILL.md），假设你要把它迁移到 Cursor 或 GitHub Copilot 中使用——哪些部分可以直接复用？哪些需要修改？ `allowed-tools`、 `context: fork` 这些 Claude Code 特有的 frontmatter 字段在其他平台怎么处理？

2. **Push vs Pull 设计决策**：你的项目有 8 个 Skills，总知识量约 80KB。根据 Vercel 的实验数据和课程讲的“500 行法则”，你如何设计 AGENTS.md（或 CLAUDE.md）与 Skills 的分工？哪些放 Push？哪些放 Pull？画出你的知识分配方案。

3. **标准化价值分析**：假设你是一家 200 人技术团队的架构师。你的团队在 Claude Code、Cursor 和 GitHub Copilot 三个平台上都有开发者。用这一讲的“企业本体论升维”框架，设计一套跨平台的 Skill 资产管理策略。

4. **批判性思考**：Vercel 实验发现 Skills “56% 的时间不被触发”。结合第 9 讲关于 description 设计的知识和强约束措辞的经验，你认为这个问题的根因是什么？是 Skills 机制本身的缺陷，还是 Skill 设计的问题？提出你的改进方案。


## 下一讲预告

Skills 专题到此结束。从第 9 讲的基础结构到第 14 讲的行业出圈，我们完成了 Skills 系统的完整旅程。

下一讲，我们将进入一个全新的领域—— **Hooks（事件驱动钩子）**。如果说 Skills 是“什么时候用什么知识”，那 Hooks 就是“什么事件触发什么动作”。它是 Claude Code 自动化能力的最后一块拼图。

欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。