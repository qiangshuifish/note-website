# 01｜登台远望：Claude Code 底层技术全景导览
你好，我是黄佳。让我们正式开启第一课的学习。

在我们的旅程正式启航之际，请你先思考第一个问题：你眼中的 Claude Code 是什么？

我们可能会得到很多个不同的答案：

- 一个能读懂代码的 AI 助手

- 命令行里的 ChatGPT

- 帮我写代码的工具

- 比 GitHub Copilot 更强大的东西


这些答案都对，但都不完整。

**Claude Code 的真正身份是：一个可编程、可扩展、可组合的 AI Agent 框架。**

它不只是一个“工具“，而是一个“平台”——你可以在上面构建自己的 AI 工作流。就像你不会说 “VS Code 是一个文本编辑器”（它是，但远不止于此），Claude Code 也远不只是一个 AI 助手。

这一讲，我们将站在高处，俯瞰 Claude Code 的完整技术栈。当你理解了全貌，后面学习每一个组件时，都会知道它在整个系统中的位置。

## Claude Code 5 分钟快速上手

我们先花几分钟，把Claude Code用起来。第一步，在 [这里](https://code.claude.com/docs/en/desktop) 下载匹配你系统的Claude Code版本。

![图片](images/942438/be7cb0f8db5355c3f7bb4be105ec40ec.png)

安装过程非常简单，跟着官方的说明就好。

```plain
# macOS / Linux / WSL（推荐，自动更新）
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# 或使用 Homebrew（需手动更新）
brew install --cask claude-code

```

然后进入操作系统的命令行，输入claude这个命令就可以开始对话了。

```plain
claude              # 首次运行会提示登录

```

Claude Code是付费软件，需要在Claude网站开账户。它所支持的账户类型包括：

- Claude Pro / Max / Teams / Enterprise（推荐）
- Claude Console（API 访问，需预付费）

![](images/942438/a55a1ae6c6ff1e9d34480d29cb40d7a0.jpg)

### 【新增内容】API Key + 中转

如果你不想订阅 Max，可以用 Console API Key（按 Token 付费）。

国内直连 Anthropic API 不通，但 Claude Code 支持自定义 API 端点：

export ANTHROPIC\_BASE\_URL=https://your-relay-service.com/v1

export ANTHROPIC\_API\_KEY=sk-xxx

中转服务（API Relay）在国内有很多选择，也可以用 OpenRouter 作为更稳定的中间层——它聚合了 Anthropic、OpenAI、Google 等多家模型 API，支持国内访问。注意：中转服务存在 Key 泄露和服务中断风险，选择信誉好的平台，不要用来处理敏感代码。

### 【新增内容】同生态位的其它开源替代

如果你暂时搞不定网络和支付， **下面这些工具和 Claude Code 是同一个物种**——终端 AI Agent，同一套 Agentic Loop 内核，本课程的概念框架几乎可以迁移。

![](images/942438/8dd5652d7ff0f5076d9d00yy388d4477.jpg)

其中，OpenCode 是最好的平替，支持 DeepSeek、Qwen、Kimi、GLM 等国内模型的 API。

安装简单，就一行命令 `curl -fsSL https://opencode.ai/install | bash`，配上 DeepSeek API Key 就能用。OpenCode 的规则系统（AGENTS.md）、命令、Agent、MCP 都借鉴了 Claude Code 的设计，本课程的概念框架几乎可以迁移（这点最近我筹备行动营时，使用OpenCode做了验证）。

其他备选方案：

> 1. [Cursor](https://cursor.com)：基于 VS Code 的 AI 编辑器，内置 Claude 和 GPT 模型，支持国内网络，有免费额度，其体验最接近 Claude Code 的 IDE 集成方案。
> 2. Cline（VS Code 插件）：开源的 AI 编码助手插件：支持多种 LLM 后端，包括国内的 DeepSeek、Qwen 等，可以自己配置 API，灵活度高。
> 3. [Windsurf](https://codeium.com/windsurf)：Codeium 推出的 AI IDE，有免费版，支持 agentic 编码。
> 4. 通义灵码（阿里云）：国产 AI 编程助手，IDE 插件形式，完全国内可用，无需翻墙。
> 5. 自建方案：使用 Cline + DeepSeek API（国内可直接访问）；或者使用 Cline + 本地部署的开源模型（如 Qwen-Coder）

本课程的知识框架（Memory、SubAgents、Skills、Hooks 等概念）对于理解和使用其他 AI 编码工具同样适用。当然，如果你有稳定的网络环境，Claude Code 仍然是目前 agentic coding 体验最好的工具之一。

### 【新增内容】多账户、多模型怎么切换？

群里被问得最多的配置问题就是：我装了Claude Code怎么换国产模型，项目和个人的配置不同怎么来回切？手动改环境变量太麻烦了。

这里推荐社区工具 **CC Switch**（ [github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)）。跨平台桌面 \+ CLI 一体化，已迭代到 v3.x，腾讯云社区、知乎、CSDN 均有教程，是目前社区里最主流的 Claude Code 模型切换工具。

命令行安装：npx @songhe/cc-switch

它做了三件事： **模型切换**、 **MCP 管理** 和 **Skills 管理**。

模型切换方面，内置了 Anthropic Claude、OpenAI GPT、DeepSeek、Qwen、GLM（智谱）、MiniMax、Kimi 等模型模板。点击 “Add Provider”添加配置，选中后点“Enable”就切换，本质上是帮你改写项目级 `.claude/settings.json` 中的 API 配置。支持 Claude Code、Codex CLI、OpenCode、Gemini CLI 多种终端 Agent。在 Claude API 和国产模型之间一键切换，不用手动改环境变量。

MCP 管理方面，内置常用 MCP 服务器模板，交互式添加。还支持"Shared Config Snippet"在不同 Provider 间共享通用配置。

如果你需要的是 **多账户切换 \+ 代理管理**——比如同时管理 Max 订阅和 Console API Key、配置 OpenRouter 代理——可以看一下 [CCS](https://github.com/kaitranntt/ccs)（Claude Code Switch）。它支持 300+ 模型 via OpenRouter，有可视化 Dashboard，适合需要多账户轮转的重度用户。

**一句话总结：CC Switch 管“用哪个模型 + 哪个 MCP”，CCS 管“哪个账户 + 哪个代理”。** 选一个你顺手的就行，核心功能都是改 `settings.json`。

下面是最基本的命令行（Command Line）交互方式，以及常用命令的速查表。

```plain
cd /path/to/your/project   # 进入项目目录
claude                      # 启动交互模式

# 然后你可以：
&gt; 这个项目是做什么的？              # 了解项目
&gt; 帮我加一个 hello world 函数      # 修改代码（会请求确认）
&gt; 提交我的更改                      # Git 操作

```

![](images/942438/1db6daaf19a9e4fyy867aaf5b4acd145.jpg)

除了在命令行中直接使用Claude命令之外，另一种更为常见的方式就是和VS Code浏览器中，甚至是其它AI Coder中（如Cursor），把 Coding IDE和Claude Code 命令行集成使用。这样既可以享受 IDE 的便利，又可以利用命令行的强大，一举两得。

## 从使用者到驾驭者

总结一下上面的使用步骤：

```plain
用户 → 输入问题 → Claude 回答 → 完成

```

你问，它答。就像用计算器，输入数字，得到结果。大多数人使用 Claude Code的方式，就止步于此了。

Claude Code可以生成代码，从0开始做项目，整理文件，甚至优化你的操作系统……虽然能做到这些也已经很强大了，但这仍然只是 **被动使用**！

而 Claude Code 还支持另一种模式：

```plain
用户 → 配置 Agent → Agent 自主工作 → 自动完成任务

```

这是 **主动驾驭**——你设计，它执行。就像我们编写程序，程序自动运行。

举个例子：

![](images/942438/4b2f74d224498bfc75faea1c22c32b9c.jpg)

**这门课的目标，把你从被动使用者变成主动驾驭者。**

你肯定会说，佳哥，我当然想走得更远一些，从被动使用者晋级为主动驾驭者， **那成为驾驭者需要理解什么？**

用学开车打个比方：

- **使用者**：知道方向盘转哪边车往哪走，油门让车动，刹车让车停。

- **驾驭者**：理解发动机、变速箱、刹车系统的工作原理，能改装车辆。


对于 Claude Code：

- **使用者**：知道怎么提问，怎么让 Claude 帮你写代码。

- **驾驭者**：理解记忆系统、子代理、技能包、钩子的工作原理，能构建自定义工作流。


我们现在这一讲就是“驾驭者入门”——让你看到 Claude Code 引擎盖下面的东西。

## Claude Code底层技术全景图

Claude Code 的底层能力从技术上拆解可以分为四个层次：基础层、扩展层、集成层和编程接口层。

![](images/942438/97f666c51958b16be8910a4139ff0891.jpg)

让我从下往上解释每一层。

### 基础层：Memory（记忆系统）

基础层也可以称为是Claude Code的长期记忆系统，它的核心文件是 `CLAUDE.md`。

比如入职一家新公司，第一天你会收到一份新员工手册，告诉你：

- 公司的代码风格是什么。

- Git 提交信息怎么写。

- 项目的架构是怎样的。

- 有哪些不能碰的“禁区”。


而 `CLAUDE.md` 就是 Claude 的“新员工手册”。

因此，我强烈建议每一个人都为你的Claude创建 `CLAUDE.md`，以提供给它一系列最基本的信息。

例如，当我们要开始一个新的电商项目，我创建了下面的 `CLAUDE.md` 文件。

```plain
# Project: E-commerce Platform

## Tech Stack
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL

## Code Style
- Use functional components
- Prefer async/await over .then()
- Maximum line length: 100 characters

## Important Rules
- NEVER commit to main directly
- Always run tests before pushing

```

Claude 每次开始对话时，都会读取这个文件。这样它就“记住”了你的项目规范，不需要每次重复说明。

Claude Code并不是只有一个 `CLAUDE.md` 记忆文件，全局、项目和项目的特定模块都可以拥有属于自己的记忆文件（或者也可以叫配置文件）。

```plain
~/.claude/CLAUDE.md           # 全局（所有项目共用）
    ↓
项目根目录/CLAUDE.md          # 项目级（当前项目）
    ↓
项目根目录/.claude/rules/*.md # 模块级（特定目录）

```

我们可以把这些文件视为Claude Code系统记忆的不同层级。

### 扩展层：四大核心组件

这一层是 Claude Code 的能力中心，包含Commands（斜杠命令）、Skills（技能）、SubAgents（子代理）、Hooks（钩子）四个核心组件。

#### Commands（斜杠命令）

斜杠命令是Claude Code内置或用户自定义的一系列核心能力，其触发方式是用户手动输入 `/command`

```plain
用户输入: /review

Claude 执行: 根据 .claude/commands/review.md 的指令审查代码

```

Commands适合 **标准化操作**——团队统一的 commit 格式、固定的部署流程等。

#### Skills（技能）

技能则代表着AI的一系列专属能力组合，其触发方式是Claude 自动判断（语义推理）是否激活相应技能。Skills可以是Claude Code内置的，也可以由用户自己设定。

```plain
用户说: "帮我看看这段代码有没有安全问题"

Claude 思考: 这是代码安全审查任务 → 激活 security-review Skill

Claude 执行: 按照 Skill 中定义的流程审查代码

```

很多人第一次听到 Skills这个概念，都会觉得 “这不就是个高级一点的 tool 吗？Agent 直接 call tool 不就行了？”

我的回答是：的确像，但并不等价。原因在于Tools 是外部能力接口，Skills是模型内部的“行为模式 + 触发逻辑”。如果 Tool 是函数调用，Skill 就是把 if-else、prompt、策略和调用顺序，全部折叠进一个文档的整体封装，是对一个专有能力集的全面定义。

如果说Tool解决的是 **我能不能做**；而Skill解决的是 **我该不该做、怎么做、做到什么程度。** 那么又一个问题来了：什么时候该用 Skill？什么时候该用 Commands？

Commands 是显式、可复用、可审计、通过斜杠命令固定触发的操作指令集，是相对固化的标准流程。

而当一个能力具备强烈的“领域感”（安全、架构、性能）、判断依赖上下文而非关键词 ，执行路径可能变化 ，需要“像专家一样行事”时，就用 Skill，而不是 Command。

拿刚才的例子来说——当用户问“帮我看看这段代码有没有安全问题”。Claude 的隐式判断流程是这样的。

```plain
1️⃣ 这是代码吗？——是
2️⃣ 这是哪一类代码？——Node.js 后端
3️⃣ 上下文是否涉及用户输入？——是
4️⃣ 是否存在鉴权逻辑？——是
5️⃣ 是否值得深入做安全审查？——是

```

做完这些判断之后，就会自动激活 security-review Skill。

在 Skill 内部，是“像专家一样”的行为说明，它不会跑固定 checklist，而是根据语言选择重点、根据上下文跳过无关项、在发现高风险点时主动深挖、在安全风险低时明确告诉你“为什么没问题” —— 这不是流程执行，这是专家判断。

#### SubAgents（子代理）

子代理是除了Skills之外的另一个大杀器，用于独立完成专项任务。其触发方式可以由 Claude 决定或用户指定。

```plain
主 Claude: 这个任务需要跑大量测试，让我创建一个子代理来处理。

子代理（test-runner）: 执行测试，只把结果汇报给主 Claude

```

SubAgents 适合 **隔离执行**——高噪声任务（比如在大量日志中寻找出错信息，在大量文档中检索相关资源）、需要特定权限的任务。

![](images/942438/2bc37afc780319697e9a3733e0a0c748.jpg)

#### Hooks（钩子）

钩子是在特定事件触发时自动执行的脚本，其触发方式是事件自动触发。

```plain
事件: Claude 即将执行 Edit 工具

Hook: 自动检查是否有安全敏感内容

结果: 如果发现问题，阻止执行并警告

```

Hooks 适合 **自动化检查**——格式化、安全检查、日志记录等。

### 集成层：连接外部世界

上面这四大核心组件之上，是集成层，负责链接外部世界。集成层包含Headless（无头模式）和MCP（Model Context Protocol）两大技术。

#### Headless（无头模式）

无头模式让 Claude Code 在没有人工交互的情况下运行，适合 **CI/CD 集成**——自动代码审查、自动修复、自动生成变更日志等。

```plain
# GitHub Actions 中
- name: Auto-fix code issues
  run: claude --headless "Fix all linting errors in src/"

```

#### MCP（Model Context Protocol）

MCP 让 Claude 连接外部工具和服务，适合 **工具连接**——可以把任何外部系统变成 Claude 可调用的工具。

```plain
Claude → MCP → 数据库
Claude → MCP → Jira
Claude → MCP → 自定义 API

```

### 编程接口层：Agent SDK

当配置式的扩展不够用时，你可以用代码来驱动 Claude。这种方式适合 **构建自定义 Agent**——完全控制执行流程、自定义工具、复杂工作流。

```plain
from claude_sdk import ClaudeSDKClient

client = ClaudeSDKClient()

# 执行任务
result = client.query(
    prompt="Review this code for security issues",
    tools=["Read", "Grep"],
    max_turns=10
)

```

## 组件关系和技术选型指南

在真实的系统中，这些组件不是孤立存在的——它们相互协作，共同完成复杂任务。

### 触发方式

首先看触发方式，也就是 **这些组件是怎么被激活的？** 不同组件的触发方式决定了它们的使用场景。

![](images/942438/5e4c6e3408de80c964d3ba910366db1b.jpg)

**为什么“确定性”很重要？**

如果我们要设计一个生产系统：

- 如果你需要“每次都必须执行”的操作（比如代码格式化），你需要 **100% 确定性**——选择 Commands 或 Hooks。

- 如果你希望 Claude “智能判断何时使用”（比如识别到安全问题时自动深入分析），你可以接受 **概率性**——选择 Skills。

- 如果任务可能很重，你希望“既可以手动触发，也可以让 Claude 自己决定”，你需要 **可控性**——选择 SubAgents。


这个表格会在你做技术选型时反复用到。

### 数据流向

理解了触发方式，我们来看数据是怎么在系统中流动的。这张图展示了一个典型请求的生命周期：

![](images/942438/f2bf832eb5444774d2f7e3ee29c22a04.jpg)

让我结合一个具体场景来解释这个流程——当用户输入“帮我修复 src/api.js 中的安全漏洞”之后，Claude 可能的处理流程如下。

1. Memory 层：Claude 首先加载 `CLAUDE.md`，了解到这是一个 Node.js 项目，团队要求所有安全修复必须附带测试。

2. 扩展层分发：

   a 用户没有输入斜杠命令，所以 Commands 不参与。

   b. Claude 识别出“安全漏洞”关键词，激活 `security-review` Skill。

   c. Skill 指示 Claude 创建一个子代理来执行测试。

3. Hooks 监控：Claude 准备执行 `Edit` 工具修改代码时，Hooks 自动运行预检查脚本，确保没有引入新的安全问题。

4. 工具执行：通过 Read、Edit 等工具完成代码修改。

5. MCP 连接：如果配置了 Jira MCP，还可以自动更新相关的 ticket 状态。


关键洞察： **Memory 是基础设施，始终存在；扩展层是能力中心，按需激活；Hooks 是守门人，监控一切。**

### Plugins：打包容器

当你开发了一套好用的 Commands、Skills、Hooks 组合，想要分享给团队或社区时，就需要 Plugins。

**Plugins 不是一种新能力，而是打包机制**——就像 npm 包把一堆 JavaScript 文件打包在一起，Plugin 把一组相关的 Claude Code 扩展打包在一起。

```plain
my-team-plugin/
├── commands/           # 斜杠命令
│   └── review.md
├── skills/             # 技能
│   └── security-check/
│       └── SKILL.md
├── agents/             # 子代理
│   └── test-runner.md
├── hooks/              # 钩子
│   └── pre-edit.sh
└── plugin.json         # 插件配置

```

下面是一个典型的 **Plugins** 使用场景：

> 你是团队的技术 Lead，花了两周时间打磨出一套完美的代码审查流程：一个 `/review` 命令触发审查，一个 `code-quality` Skill 自动分析代码质量，一个 `test-runner` 子代理执行测试，还有一个 Hook 确保所有修改都有对应的测试。

> 与其让团队成员手动复制这些文件，不如打包成一个 Plugin，新成员只需一条命令就能获得完整的工作流。

Plugin 的价值在于 **可复用、可版本化、可分发**。在第 16 讲我们还会详细讲解如何创建和发布 Plugins。

### 技术选型指南

目前，理论知识已经足够了，但当你面对一个真实需求时，如何选择正确的技术？下面这是我总结的决策流程：

![](images/942438/a9d52fb4b7947b3ebff1844b62148ba0.jpg)

让我用几个真实问题来演示这个决策树的使用。

问题 1：我希望团队成员都用统一的 commit message 格式。

- 这是一种“能力”吗？是的，是生成规范 commit message 的能力。

- 希望手动触发还是自动识别？手动触发更合适，因为不是每次对话都需要 commit。

- **答案：** 适合用 **Commands**（创建一个 `/commit` 命令）。


问题 2：每当 Claude 要修改代码时，我想自动检查是否符合我们的安全规范。

- 这是一种“能力“吗？不是，这是一种“检查机制”。

- 需要在工具执行时自动检查？ 对，在 Edit 工具执行前检查。

- **答案：** 适合用 **Hooks**（创建一个 pre-Edit hook）


问题 3：我想让 Claude 能够查询我们内部的知识库。

- 这是一种“能力”吗？ 不完全是，这是“连接外部数据源”。

- 需要连接外部系统？ 知识库是一个外部系统

- **答案：** 适合用 **MCP**（创建一个知识库 MCP server）。


为了帮助你快速匹配，我也准备了一份场景 VS 方案的速查表。

![](images/942438/d704a4daffc7192a173d54ac579c83f7.jpg)

### 组合使用

真实世界的问题很少能用单一技术解决。Claude Code 的强大之处在于 **组件可组合**——每个组件做好自己的事，组合起来完成复杂任务。

假设你想实现这样一个流程：每当有人提交 PR，自动进行代码审查，发现问题就评论，没问题就通过。这需要组合多种技术：

```plain
1. Headless 模式在 CI 中触发
   └── GitHub Actions 监听 PR 事件，调用 claude --headless

2. 调用 code-review SubAgent
   └── 隔离审查任务，避免污染主流程上下文

3. SubAgent 使用 security-check Skill
   └── 自动识别安全相关代码，应用专业审查规则

4. Hooks 记录审查日志
   └── 每次工具调用都记录，便于审计和调试

5. 结果通过 MCP 发送到 Slack
   └── 审查完成后通知相关人员

```

这五个步骤涉及五种不同的技术，但组合在一起就是一个完整的自动化流程。这就是可组合的威力。

![](images/942438/2c4abef46504ba10c23bea1ba4205e5f.jpg)

## 总结一下

这一讲我们站在高处，俯瞰了 Claude Code 的完整技术栈。

首先，我希望你记住最重要的一个认知转变： **Claude Code （以及其它AI Coder）不只是一个聊天工具，而是一个可编程的 AI Agent 框架**。它有自己的记忆系统、有可以分工协作的子代理、有按需加载的技能包、有事件驱动的钩子机制。理解这一点，你才能真正发挥它的潜力。

其次，我们梳理了整个技术栈的四层架构。最底层是 **Memory**，让 Claude 记住你的项目；往上是 **扩展层**，包括 Commands、Skills、SubAgents 和 Hooks 四大核心组件；再往上是 **集成层**，Headless 让它融入 CI/CD，MCP 让它连接外部世界；最顶层是 **Agent SDK**，给你完全的编程控制能力。每一层都有明确的职责，相互配合又互不干扰。

然后，我们学习了 **技术选型的方法**。面对一个需求，你需要问自己：这是能力问题还是流程问题？需要确定性触发还是智能识别？需要隔离执行还是集中处理？顺着决策树走下来，答案往往就清晰了。

最后，也是最有价值的一点： **这些组件是可以组合的**。单独的 Command 只是一个命令，单独的 Skill 只是一个能力包，但当你把 Headless + SubAgent + Skill + Hook + MCP 组合在一起，就变成了一个完整的自动化流程。这种组合的灵活性，才是 Claude Code 真正的威力所在。

从这一讲开始，你已经迈出了成为 **驾驭者** 的第一步，这已经超越了 90% 的 Claude Code 使用者。接下来的课程里，我们会逐一深入每个组件，把这张全景图上的每个区域都走一遍。

## 思考题

1. 回顾你目前使用 Claude Code 的方式，属于“被动使用”还是“主动驾驭”？

2. 你的工作中有哪些重复性任务可以通过 Commands 或 Skills 自动化？

3. 如果要构建一个“自动代码审查 \+ 自动修复 \+ 自动提交 PR”的流程，你会组合哪些技术？


## 彩蛋

最后，加一个彩蛋，方便你直观了解 Claude Code 扩展层的四大核心组件。

### Claude Code 扩展层 · 四大核心组件对照表

![](images/942438/3a10cf15bb6f0bc0a1b7bceea17c9e9f.jpg)

理解了全景之后，下一讲我们从最基础的组件—— **Memory 记忆系统** 开始学习，让 Claude 从“每次都要重新解释”变成“一次配置，永久生效”。

你将学会：

- 如何用 CLAUDE.md 让 Claude “记住”你的项目规范。

- 全局、项目、模块三级记忆系统的设计。

- 最佳实践：什么该写进 CLAUDE.md，什么不该写进去。


欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。