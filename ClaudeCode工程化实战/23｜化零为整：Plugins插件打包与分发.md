# 23｜化零为整：Plugins 插件打包与分发
> 释题：化零为整。把散落各处的 Commands、Skills、Agents、Hooks、MCP 配置打包成一个可安装、可升级、可分享的插件——项目“团队能力包”将完整演示这个过程。

你好，我是黄佳。

至此你基本上已经掌握了 Claude Code 全局的方方面面。而上两讲我们又通过Agent SDK，先用 Python/TypeScript 代码驱动 Claude 执行任务，再深入探索了多轮对话和流式处理等高级模式。此时此刻，你已经掌握了从交互式使用到代码驱动的全部能力。

最后，还剩下一个问题我们还没有回答， **这些能力怎么传递给别人？**（课程群用户也提到了工作场景中这类困惑“我项目很多同事在维护， 一人好几个 Skill，工作流除了他们自己知道怎么用，别人都不知道”。）

你写了一个好用的 `/review` 命令，同事想用，你说“把这个文件复制到 `.claude/commands/` 下面”。你配了一个安全扫描代理，新人想用，你说“把 `agents/` 目录拷过去，然后再配一下 MCP 服务器”。你设了一套 Hooks 自动格式化，团队想统一，你说“把 `settings.json` 里的 hooks 配置合并进去”。

一个两个还行，十个八个就乱了。文件散落在各处，版本无法追踪，配置因人而异。 **你从独行侠变成了布道者，但效率反而更低了。** 这就是本讲要解决的问题。插件系统让你把所有的工具、命令、配置、规范打包成一个整体。新人入职时，只需要一条命令：

```plain
/plugin install &#64;our-company/dev-toolkit

```

数据库连接、测试命令、代码审查规范、Git 工作流全部就位。 **30 分钟的入职培训变成了 30 秒的安装命令。**

这就是插件的终极价值， **把知识变成资产，把重复变成复用，把个人经验变成团队能力。**

## 理解插件：Claude Code 的“应用商店“

如果说 Claude Code 是一把瑞士军刀，那么 **插件就是可以插拔的工具模块**。插件是一种轻量级的打包和分享方式，可以组合斜杠命令、子代理、MCP 服务器和 Hooks。你可以用一条命令安装插件，在终端和 VS Code 中都能使用。

一个插件可以包含以下五类组件，每一类我们在前面的课程中都已经深入学习过。

![图片](images/966900/2eee295269ca9f1d76a646d3yy46b23a.jpg)

插件的价值不在于它引入了新的机制，而在于它提供了一个标准化的打包和分发方式。你在前 20 讲里学到的所有扩展能力，都可以通过插件系统组合、封装、传递给他人。

在没有插件之前，团队协作依赖的是文档、脚本和口耳相传。让我们对比一下这两种方式的差异。

![图片](images/966900/9e37ce8c4284b217a8b6962508ccd6b6.jpg)

手动配置的根本问题不是麻烦——麻烦只是表象。根本问题是 **不一致**。当 15 个人各自配置时，你得到的是 15 种微妙不同的开发环境。插件把“约定”变成了“约束”，从“应该这样做“变成“只能这样做”。

根据 [Claude Plugins 社区](https://claude-plugins.dev/) 的统计，目前已有超过 10,000 个插件和 50,000 个 Agent Skills 可供使用。插件来源包括三个层级。

1. **官方市场**：Anthropic 维护的 [claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

2. **社区市场**：开发者贡献的公开插件

3. **企业市场**：公司内部的私有插件


![图片](images/966900/907ac6b2a120cfe25d959a3933eaf851.png)

有人说，Claude Code 的插件市场就像是 AI 辅助开发工作流的 npm。去中心化的来源，任何人都可以托管市场，一条命令安装。这个类比非常精准。npm 改变了 JavaScript 生态的协作方式，让开发者不再重复造轮子。Claude Code 的插件系统正在对 AI 辅助开发做同样的事情，把个人的最佳实践变成社区的公共资产。

## 插件的目录结构

根据 [官方文档](https://code.claude.com/docs/en/plugins)，插件的标准结构如下。理解这个结构是创建插件的第一步，因为 Claude Code 依赖固定的目录约定来发现和加载各类组件：

```plain
my-plugin/
├── .claude-plugin/
│   └── plugin.json        # 插件元数据（必需）
├── commands/              # 斜杠命令（可选）
│   ├── review.md
│   └── deploy.md
├── agents/                # 子代理（可选）
│   ├── security-scanner.md
│   └── code-reviewer.md
├── skills/                # Agent Skills（可选）
│   └── react-patterns/
│       └── SKILL.md
├── hooks/                 # Hooks 配置（可选）
│   └── hooks.json
├── .mcp.json              # MCP 服务器配置（可选）
└── README.md              # 插件文档

```

**咖哥发言**：只有 `plugin.json` 放在 `.claude-plugin/` 目录内，其他所有目录（commands、agents、skills、hooks）都在插件根目录下。注意不要把 commands 等目录也放进 `.claude-plugin/` 里。

## plugin.json：插件的身份证

每个插件必须有 `.claude-plugin/plugin.json` 文件。这个文件的作用类似于 npm 的 `package.json`——它定义了插件的身份、版本和描述信息，是 Claude Code 识别和管理插件的唯一入口：

```plain
{
  "name": "team-toolkit",
  "version": "1.0.0",
  "description": "团队标准开发工具包：代码审查、测试、部署一体化",
  "author": "DevOps Team",
  "repository": "https://github.com/our-company/team-toolkit",
  "license": "MIT",
  "keywords": ["team", "devops", "workflow", "code-review"]
}

```

各字段的含义和说明如下表。

![图片](images/966900/5fdd8f7bb2ed001a0ae21aa68da77078.jpg)

![图片](images/966900/6885a58422265398d439f7b081505d7f.jpg)

## 添加斜杠命令

命令是插件中用户感知最直接的组件。在 `commands/` 目录下创建 Markdown 文件，文件名（不含 `.md`）即为命令名。命令文件的格式与我们在 [第 10 讲](https://time.geekbang.org/column/article/946297) 中学习的 Slash Commands 完全一致，frontmatter 定义元数据，正文定义行为指令。

**commands/review.md**

````plain
---
name: review
description: 对当前文件或目录进行代码审查
---

当用户运行 `/review [target]` 时，执行代码审查。

## 审查流程

1. 如果指定了 target，审查该文件或目录
2. 如果没有指定，审查当前打开的文件
3. 如果没有上下文，询问用户

## 审查要点

- 代码质量：命名规范、DRY 原则、复杂度
- 潜在 Bug：边界条件、空值处理、类型错误
- 安全问题：输入验证、敏感数据、注入风险
- 性能问题：不必要的循环、内存泄漏
- 最佳实践：框架惯例、设计模式

## 输出格式

```markdown
## 代码审查报告

**文件**: {file_path}
**审查时间**: {timestamp}

### 发现的问题

🔴 **严重** (必须修复)
- [问题描述] (行号)

🟡 **警告** (建议修复)
- [问题描述] (行号)

🔵 **建议** (可选改进)
- [问题描述] (行号)

### 总结

[1-2 句总结]

````

安装插件后，命令会带上插件名称作为 **命名空间**，避免不同插件的命令冲突。这个机制与编程语言中的模块命名空间是同一个思路。

- 插件名： `team-toolkit`

- 命令文件： `commands/review.md`

- 实际命令： `/team-toolkit:review`


如果只有一个命令或命令名唯一，也可以直接用 `/review`。Claude Code 会自动解析，优先匹配唯一命令名。

命令可以接受 **参数**，使用 `$ARGUMENTS` 占位符接收用户输入。在 Markdown 中说明参数格式，让 Claude 知道如何解析。下面这个 TODO 命令展示了如何设计一个支持优先级和指派人的参数化命令：

**commands/todo.md**

```plain
---
name: todo
description: 添加 TODO 注释，支持优先级和指派人
---

用法：`/todo [优先级] [消息] [@指派人]`

## 参数

- `优先级`（可选）：
  - `!` 或 `high` → 高优先级
  - `?` 或 `discuss` → 待讨论
  - 默认 → 普通优先级

- `消息`：TODO 的内容

- `@指派人`（可选）：指定负责人

## 示例
/todo 修复登录验证 → // TODO: 修复登录验证
/todo ! 紧急修复安全漏洞 → // TODO [HIGH]: 紧急修复安全漏洞
/todo ? 是否需要缓存 @john → // TODO [DISCUSS @john]: 是否需要缓存

## 行为

1. 自动检测当前文件的语言，使用正确的注释格式
2. 插入到光标位置或相关代码附近
3. 如果没有文件上下文，询问位置

```

## 添加子代理

子代理是插件中的“专业助手”。在 `agents/` 目录下创建 Markdown 文件，每个文件定义一个具有特定职责、工具权限和行为准则的代理。这与我们在第 3-8 讲学习的子代理概念完全一致，区别在于现在它被打包进了插件，可以随插件一起安装和分发。

下面是一个安全扫描代理的完整定义。注意它只使用了 Read、Grep、Glob 三个只读工具——遵循我们在第 4 讲强调的最小权限原则。

**agents/security-scanner.md**

````plain
---
name: security-scanner
description: 扫描代码中的安全漏洞
tools: Read, Grep, Glob
model: sonnet
---

你是一个安全专家，专门识别代码中的安全漏洞。

## 扫描范围

重点检查：
1. **注入漏洞**：SQL 注入、命令注入、XSS
2. **认证问题**：弱密码、硬编码凭证、会话管理
3. **数据暴露**：敏感信息日志、不安全传输
4. **访问控制**：权限检查、路径遍历
5. **依赖风险**：已知漏洞的依赖包

## 工作流程

1. 使用 Glob 获取所有源代码文件
2. 使用 Grep 搜索可疑模式
3. 使用 Read 深入分析可疑代码
4. 生成结构化报告

## 输出格式

```markdown
# 安全扫描报告

**扫描时间**: {timestamp}
**扫描范围**: {directory}

## 发现的漏洞

### 🔴 高危 (立即修复)

#### [漏洞名称]
- **文件**: path/to/file.js:42
- **类型**: SQL Injection
- **描述**: [详细描述]
- **修复建议**: [具体建议]

### 🟡 中危 (尽快修复)
...

### 🔵 低危 (建议修复)
...

## 统计

- 高危: X 个
- 中危: Y 个
- 低危: Z 个

## 注意事项
- 只报告有实际证据的问题，不要臆测
- 提供具体的修复建议，不只是指出问题
- 如果不确定是否是漏洞，标注为"疑似"

````

代理的 frontmatter 支持以下配置字段。其中 `model` 字段值得特别关注，对于只做扫描和分析的代理，使用 sonnet 模型就够了；对于需要快速修复简单问题的代理，haiku 更合适，速度更快、成本更低。

![图片](images/966900/fdbcbf627f457ab68a5776a37c81364f.jpg)

与安全扫描代理不同，快速修复代理需要写入权限（Edit 工具），因为它的职责是直接修改代码。但它被严格限定在“小问题”范围内——拼写错误、缺失导入、简单语法错误。任何复杂的架构变更或安全问题都不在它的职责范围内，这是通过 prompt 中的明确边界来约束的。

**agents/quick-fix.md**

````plain
---
name: quick-fix
description: 快速修复小问题：拼写错误、缺失导入、简单 bug
tools: Read, Edit, Grep, Glob
model: haiku
---

你是快速修复专家。你的任务是**又快又准**地修复小问题。

## 你处理的问题

- 拼写错误
- 缺失的 import/require
- 简单语法错误
- 明显的空值检查遗漏
- 缺失的 return 语句
- Off-by-one 错误

## 你不处理的问题

- 架构变更
- 复杂重构
- 性能优化
- 安全问题（上报这些！）

## 工作流程

1. **识别问题**：阅读错误信息或用户描述
2. **定位问题**：找到确切的位置
3. **最小修复**：只改必要的代码
4. **验证语法**：确保不引入新错误

## 输出格式

\```markdown
## 已修复

**文件**: path/to/file.js
**行号**: 42
**问题**: 变量名拼写错误

\```diff
- const usrName = user.name;
+ const userName = user.name;
\```

**完成。** 修正了变量名拼写。
\```

## 原则

- **快**：不要过度解释
- **小**：最小化修改
- **诚实**：问题复杂就直说，不要硬修

````

## 添加 Skills

Skills 放在 `skills/` 目录下，每个 Skill 是一个子目录。这与我们在第 9-14 讲学习的 Skills 系统完全一致，包含一个 `SKILL.md` 主文件，以及可选的 `chapters/` 子目录用于渐进式披露。当 Skill 的知识量较大时，章节化结构可以避免一次性加载所有内容，节省上下文窗口。

```plain
skills/
└── react-patterns/
    ├── SKILL.md           # 主文件
    └── chapters/          # 可选：分章节
        ├── hooks.md
        ├── context.md
        └── performance.md

```

下面是一个 React 最佳实践 Skill 的示例。注意 `description` 字段的写法，它不是给人看的说明文档，而是给 Claude 看的触发器。当用户的请求与 description 中的关键词匹配时，Claude 会自动加载这个 Skill。

**skills/react-patterns/SKILL.md**

````plain
---
name: React 最佳实践
description: React 组件设计模式、Hooks 使用指南、性能优化技巧
---

# React 最佳实践

本技能包含 React 开发的最佳实践，帮助你编写高质量的 React 代码。

## 目录

- [Hooks 使用指南](./chapters/hooks.md)
- [Context 最佳实践](./chapters/context.md)
- [性能优化](./chapters/performance.md)

## 核心原则

1. **组件单一职责**：一个组件做一件事
2. **状态提升最小化**：状态放在需要它的最近公共祖先
3. **避免过早优化**：先让它工作，再让它快
4. **优先组合而非继承**：使用 children 和 render props

## 快速参考

### 自定义 Hook 命名

```javascript
// 好的命名
useUser()
useLocalStorage()
useDebounce()

// 不好的命名
fetchUser()      // 不是 use 开头
useData()        // 太模糊

## 组件文件结构
ComponentName/
├── index.ts           # 导出
├── ComponentName.tsx  # 组件实现
├── ComponentName.test.tsx
├── ComponentName.styles.ts
└── types.ts           # 类型定义

````

## 添加 Hooks

Hooks 是插件中的自动触发器。在 `hooks/` 目录下创建 `hooks.json` 配置文件，定义在 Claude 执行工具前后自动运行的检查脚本。这与 Hooks 事件驱动机制（参考 [第 15 讲](https://time.geekbang.org/column/article/953022)）完全一致，只是现在它被封装在插件中，随插件安装自动生效。

**hooks/hooks.json**

```plain
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "Bash",
      "command": ["bash", "./hooks/check-bash.sh"]
    },
    {
      "event": "PostToolUse",
      "matcher": "Write",
      "command": ["bash", "./hooks/auto-format.sh"]
    },
    {
      "event": "PostToolUse",
      "matcher": "Edit",
      "command": ["bash", "./hooks/auto-format.sh"]
    }
  ]
}

```

这个配置做了两件事，在每次 Bash 命令执行前检查是否包含危险模式（PreToolUse），在每次文件写入或编辑后自动格式化代码（PostToolUse）。

下面是两个 Hook 脚本的完整实现。第一个脚本是安全守门员，它从 stdin 读取 Claude 即将执行的 Bash 命令，与危险模式列表逐一比对，发现匹配就拒绝执行。这是一道看不见的防线，防止 Claude 在深夜加班时不小心执行了 `rm -rf /` 等危险命令。

**hooks/check-bash.sh**

```plain
#!/bin/bash
# 检查 Bash 命令是否安全

# 从 stdin 读取输入
INPUT=$(cat)

# 提取命令
COMMAND=&lt;!--§§MATH_0§§-->INPUT" | jq -r '.tool_input.command // empty')

# 危险模式列表
DANGEROUS_PATTERNS=(
    "rm -rf /"
    "rm -rf ~"
    "sudo rm"
    "> /dev/"
    "chmod 777"
    "curl.*|.*sh"
    "wget.*|.*sh"
)

# 检查每个危险模式
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if echo "&lt;!--§§MATH_1§§-->pattern"; then
        # 输出拒绝决定
        cat &lt;&lt; EOF
{
  "decision": "deny",
  "reason": "Blocked potentially dangerous command pattern: $pattern"
}
EOF
        exit 0
    fi
done

# 允许执行
echo '{"decision": "allow"}'

```

第二个脚本是自动格式化器，它检测被写入文件的扩展名，自动调用对应的格式化工具。Python 文件用 black，JavaScript/TypeScript 用 prettier，Go 文件用 gofmt。这样团队成员不需要记住各种格式化命令，也不会因为忘记格式化而产生风格不一致的代码。

**hooks/auto-format.sh**

```plain
#!/bin/bash
# 文件写入后自动格式化

INPUT=$(cat)
FILE_PATH=&lt;!--§§MATH_2§§-->INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# 根据文件类型格式化
case "$FILE_PATH" in
    *.py)
        if command -v black &> /dev/null; then
            black "$FILE_PATH" 2>/dev/null
        fi
        ;;
    *.js|*.ts|*.jsx|*.tsx)
        if command -v prettier &> /dev/null; then
            prettier --write "$FILE_PATH" 2>/dev/null
        fi
        ;;
    *.go)
        if command -v gofmt &> /dev/null; then
            gofmt -w "$FILE_PATH" 2>/dev/null
        fi
        ;;
esac

echo '{"decision": "allow"}'

```

## 添加 MCP 服务器

MCP（Model Context Protocol）是插件中最强大也最敏感的组件。它让 Claude 能够连接数据库、调用 API、访问文件系统等外部资源。在插件根目录创建 `.mcp.json` 文件来配置 MCP 服务器。

**.mcp.json**

```plain
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "${HOME}/projects"
      }
    }
  }
}

```

MCP 配置中可以使用 `${VAR_NAME}` 引用环境变量。这是一个关键的设计决策——不要在配置文件中硬编码数据库密码或 API Token。用户安装插件后，需要在自己的环境中设置这些变量：

```plain
export DATABASE_URL="postgres://user:pass@localhost/db"
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"

```

![图片](images/966900/43aa3c1a1784259a99976565b3b7985c.jpg)

&gt; 一个简单的判断标准：如果你不敢把 `.mcp.json` 里的连接信息发到公开频道，那说明这个配置有泄露风险，需要改用环境变量。

## 实战项目：团队能力包

前面我们逐一介绍了插件的各个组件。现在，让我们把它们组合在一起，构建一个完整的团队能力包插件。

项目背景是假设你在一个使用以下技术栈的团队：

- **前端**：React + TypeScript

- **后端**：Node.js + PostgreSQL

- **测试**：Jest + Cypress

- **部署**：Docker + Kubernetes


你要创建一个插件，包含代码审查命令、测试运行命令、部署命令、安全扫描代理、快速修复代理、React 最佳实践 Skill、安全检查 Hook，以及数据库查询 MCP。这些组件覆盖了开发流程的各个环节——从编码到审查，从测试到部署，从安全到知识沉淀。

![图片](images/966900/e51c04415024f2df4799bc27b9d88b6e.png)

下面是这个团队能力包的完整目录树。每个文件的内容我们在前面的章节中都已经详细介绍过，这里把它们按照插件规范组织在一起。

```plain
team-toolkit/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── review.md
│   ├── test.md
│   └── deploy.md
├── agents/
│   ├── security-scanner.md
│   └── quick-fix.md
├── skills/
│   └── react-patterns/
│       ├── SKILL.md
│       └── chapters/
│           ├── hooks.md
│           ├── context.md
│           └── performance.md
├── hooks/
│   ├── hooks.json
│   ├── check-bash.sh
│   └── auto-format.sh
├── .mcp.json
└── README.md

```

**plugin.json**

团队能力包的 plugin.json 如下

```plain
{
  "name": "team-toolkit",
  "version": "2.0.0",
  "description": "团队标准开发工具包：代码审查、测试、部署、安全扫描一体化",
  "author": "Platform Team",
  "repository": "https://github.com/our-company/team-toolkit",
  "license": "MIT",
  "keywords": [
    "team",
    "devops",
    "code-review",
    "testing",
    "deployment",
    "security"
  ]
}

```

**代码审查命令**

这是团队能力包中最常用的命令。它不仅检查代码质量，还覆盖了 TypeScript 类型安全、React 特定规范和安全问题。审查报告的结构化输出让团队成员能快速定位和修复问题。

**commands/review.md**

````plain
---
name: review
description: 对代码进行全面审查，输出结构化报告
---

当用户运行 `/review [target]` 时，执行代码审查。

## 审查维度

1. **代码质量**
   - 命名规范（camelCase/PascalCase）
   - DRY 原则（重复代码）
   - 函数长度（建议 &lt; 30 行）
   - 圈复杂度（建议 &lt; 10）

2. **TypeScript 特定**
   - 类型安全（避免 any）
   - 空值处理（可选链、空值合并）
   - 接口设计

3. **React 特定**
   - Hooks 规则
   - 组件拆分
   - 状态管理

4. **安全**
   - 输入验证
   - XSS 防护
   - 敏感数据处理

5. **测试**
   - 测试覆盖率
   - 边界条件

## 输出格式

\```markdown
# 代码审查报告

**目标**: {target}
**时间**: {timestamp}
**审查者**: Claude (team-toolkit v2.0.0)

## 总览

| 类别 | 发现 | 严重性 |
|------|------|--------|
| 代码质量 | X | 中 |
| 安全 | Y | 高 |
| 性能 | Z | 低 |

## 必须修复

### [问题标题]
**文件**: path/to/file.ts:42
**类型**: 安全漏洞

**问题**:
[详细描述]

**修复建议**:
\```typescript
// 建议的修复代码
\```

## 建议修复
...

## 可选改进
...

## 亮点

[做得好的地方]

---
*由 team-toolkit 生成*
\```

````

**测试命令**

测试命令不只是运行测试，它还会分析失败原因，判断是代码 bug 还是测试过时，并提供具体的修复建议。这个命令的 `--fix` 选项让 Claude 尝试自动修复失败的测试，把“发现问题”和“解决问题”合二为一。

**commands/test.md**

````plain
---
name: test
description: 运行测试并分析结果，失败时提供修复建议
---

用法：`/test [scope] [options]`

## 参数

- `scope`（可选）：
  - `unit` - 只运行单元测试
  - `e2e` - 只运行端到端测试
  - `all` - 运行全部（默认）

- `options`：
  - `--fix` - 尝试自动修复失败的测试
  - `--coverage` - 生成覆盖率报告

## 工作流程

1. 运行指定范围的测试
2. 收集测试结果
3. 对失败的测试：
   - 分析失败原因
   - 检查是代码 bug 还是测试过时
   - 提供修复建议
4. 如果指定了 --fix，尝试自动修复

## 输出格式

\```markdown
# 测试报告

## 结果

| 指标 | 值 |
|------|------|
| 总计 | 150 |
| 通过 | 147 |
| 失败 | 3 |
| 跳过 | 0 |
| 覆盖率 | 85% |

## 失败的测试

### test_user_creation
**文件**: tests/user.test.ts:42
**错误**: AssertionError: expected 'active' but got 'pending'

**分析**: User 模型的默认状态在 commit abc123 中从 'active' 改为 'pending'，但测试未更新。

**建议**: 更新测试以期望 'pending' 状态。

\```diff
- expect(user.status).toBe('active');
+ expect(user.status).toBe('pending');
\```

---
*由 team-toolkit 生成*
\```

````

**部署命令**

部署是最需要规范化的操作之一。手动部署时，每个人的步骤可能不同，遗漏检查项的风险很高。这个命令把部署流程固化为标准步骤，并内置了安全检查，确保没有硬编码密钥、没有已知漏洞的依赖、所有环境变量都已配置。

**commands/deploy.md**

````plain
---
name: deploy
description: 部署应用到指定环境
---

用法：`/deploy [environment]`

## 环境

- `staging` - 测试环境（默认）
- `production` - 生产环境（需要额外确认）

## 部署流程

### Staging

1. 运行 lint 检查
2. 运行单元测试
3. 构建 Docker 镜像
4. 推送到 staging 集群
5. 运行冒烟测试
6. 报告部署状态

### Production

1. 确认 staging 部署成功
2. 确认所有测试通过
3. 请求用户确认
4. 创建 Git tag
5. 构建生产镜像
6. 蓝绿部署到生产集群
7. 健康检查
8. 报告部署状态

## 安全检查

部署前自动检查：
- [ ] 没有硬编码的密钥
- [ ] 依赖没有已知漏洞
- [ ] 所有环境变量已配置

## 回滚

如果部署失败，自动提供回滚命令：
\```
kubectl rollout undo deployment/app -n production
\```

````

**团队能力包的 README.md**

README 是插件的门面。它决定了用户是否愿意安装你的插件，也是安装后的第一份参考文档。一个好的 README 应该让用户在 30 秒内了解插件能做什么、怎么安装、怎么使用。

````plain
# Team Toolkit

团队标准开发工具包，提供代码审查、测试、部署、安全扫描一体化解决方案。

## 安装

\```bash
/plugin install team-toolkit@our-company
\```

## 功能

### 命令

| 命令 | 说明 |
|------|------|
| `/review [target]` | 代码审查 |
| `/test [scope]` | 运行测试 |
| `/deploy [env]` | 部署应用 |

### 代理

| 代理 | 说明 |
|------|------|
| `security-scanner` | 安全漏洞扫描 |
| `quick-fix` | 快速修复小问题 |

### Skills

| Skill | 说明 |
|-------|------|
| `react-patterns` | React 最佳实践 |

### MCP 服务器

| 服务器 | 说明 |
|--------|------|
| `postgres` | 数据库查询 |
| `github` | GitHub API |

## 环境变量

\```bash
# 数据库连接（用于 postgres MCP）
export DATABASE_URL="postgres://..."

# GitHub Token（用于 github MCP）
export GITHUB_TOKEN="ghp_..."
\```

## 更新日志

### v2.0.0

- 新增：`/deploy` 命令
- 新增：`security-scanner` 代理
- 改进：`/review` 输出格式
- 修复：Hook 脚本兼容性问题

### v1.0.0

- 初始版本

## 贡献

欢迎提交 PR！请确保：
1. 代码通过 lint 检查
2. 更新相关文档
3. 添加测试（如适用）

## 许可证

MIT

````

## 发布与分发

插件开发完成后，下一步是让别人能够使用它。Claude Code 的插件分发基于 Git，插件本质上就是一个 Git 仓库。

在发布前，使用 `--plugin-dir` 参数从本地目录加载插件进行测试。这个步骤很重要，它让你在不发布的情况下验证所有组件是否正常工作。

```plain
claude --plugin-dir ./team-toolkit

```

加载成功后，你可以测试所有命令（ `/team-toolkit:review`、 `/team-toolkit:test`、 `/team-toolkit:deploy`），确认代理和 Skills 是否被正确识别，以及 Hooks 是否在预期时机触发。

插件发布就是推送到远程 Git 仓库。使用 Git tag 标记版本号，让用户可以安装特定版本。

```plain
cd team-toolkit
git init
git add .
git commit -m "Initial release v1.0.0"
git tag v1.0.0
git remote add origin https://github.com/our-company/team-toolkit
git push -u origin main --tags

```

## 创建私有市场

如果你的团队有多个插件需要管理，可以创建一个私有市场。私有市场本身也是一个 Git 仓库，包含一个 `marketplace.json` 文件，列出所有可用的插件及其版本。

**marketplace.json**

```plain
{
  "name": "Our Company Plugins",
  "description": "内部插件市场",
  "plugins": [
    {
      "name": "team-toolkit",
      "description": "团队标准开发工具包",
      "repository": "https://github.com/our-company/team-toolkit",
      "version": "2.0.0"
    },
    {
      "name": "db-tools",
      "description": "数据库操作工具",
      "repository": "https://github.com/our-company/db-tools",
      "version": "1.2.0"
    }
  ]
}

```

用户可以添加你的市场，然后从中安装插件：

```plain
/plugin marketplace add our-company/claude-plugins

```

然后就可以安装市场中的插件：

```plain
/plugin install team-toolkit@our-company

```

发布新版本时，需要同步更新四个地方：

1. 更新 `plugin.json` 中的版本号

2. 更新 `README.md` 中的更新日志

3. 创建新的 Git tag

4. 如果有私有市场，更新 `marketplace.json`


用户更新插件只需一条命令：

```plain
/plugin update team-toolkit

```

## Plugins最佳实践

经过前面的实战，让我们提炼几条插件设计的核心原则。

**单一职责**，一个插件应该解决一类问题。不要创建万能插件，这与软件工程中的单一职责原则是同一个道理：职责越集中，维护越容易，复用越灵活。

```plain
好的：
- db-tools — 数据库操作
- git-workflow — Git 工作流
- security-check — 安全检查

不好的：
- everything-plugin — 什么都有

```

**渐进式复杂度**，从简单开始，逐步添加功能。不要试图在第一个版本就做到完美。每个版本解决一个明确的问题，让用户有时间适应和反馈。

```plain
v1.0.0: 基础的代码审查命令
v1.1.0: 添加安全扫描代理
v1.2.0: 添加 React Skill
v2.0.0: 添加 MCP 集成

```

**最小权限**，只请求必要的工具权限。一个只做分析的代理不需要 Write 和 Edit 工具，一个只做查询的 MCP 不需要写入权限。

```plain
# 只需要读取的代理
tools: Read, Grep, Glob

# 不要这样（权限过大）
tools: Read, Write, Edit, Bash, Task

```

**文档是第一优先级**，没有文档的插件是没有价值的。你可能觉得代码和配置“不言自明“，但安装你插件的用户不这么想。他们需要知道每个命令怎么用、每个环境变量什么意思、出了问题怎么排查。文档中 **必须包含** 安装方法、每个命令的用法和示例、环境变量说明、更新日志； **最好包含** 使用场景、常见问题和贡献指南。

**版本管理**——使用语义化版本（Semantic Versioning），让用户清楚每次更新的影响范围。

![图片](images/966900/7172f9ea57cdb5796da29df821ff573a.jpg)

![图片](images/966900/272028995ed06998f0f10ea3f3aa8f91.jpg)

![图片](images/966900/2c3e8a760f037ecebbb451ed24f434be.png)

## 总结一下

这一讲，我们学习了 Claude Code 插件系统的完整内容，并构建了一个“团队能力包”插件。

插件是 Claude Code 扩展能力的标准打包方式。它可以包含斜杠命令（快捷操作）、子代理（专业助手）、Skills（领域知识）、Hooks（自动化行为）和 MCP 服务器（外部工具连接）。这些组件打包在一起，用户只需一条命令就能安装全部功能。

插件的目录结构是固定的： `.claude-plugin/plugin.json` 是必需的元数据文件， `commands/`、 `agents/`、 `skills/`、 `hooks/` 目录存放各类组件， `.mcp.json` 配置外部工具连接。所有组件目录都在插件根目录下，只有 `plugin.json` 在 `.claude-plugin/` 内。

发布插件就是推送 Git 仓库。你可以发布到公开的社区市场，也可以创建私有市场供团队使用。用户通过 `/plugin marketplace add` 添加市场，通过 `/plugin install` 安装插件。

设计插件时要遵循单一职责、最小权限、文档优先的原则。一个好的插件应该专注于解决一类问题，只请求必要的权限，并提供完整的使用文档。版本管理使用语义化版本，让用户清楚每次更新的影响。

回顾这一讲的内容，你会发现一个有趣的模式。Commands、Agents、Skills、Hooks、MCP，这些我们在前 20 讲中逐一学习的独立组件，在插件系统中被统一成了一个整体。这不是简单的“打包”，而是一种系统级的思维转变：从“我有一堆好用的工具”到“我有一个可安装的解决方案”。这个转变的意义在于，它让你的工程经验变得可传递、可版本化、可持续迭代。把知识变成资产，把重复变成复用，把个人经验变成团队能力。

## 思考题

1. 回顾你日常工作中最耗时的重复任务，哪些可以用本课程学到的技术自动化？试着列出三个具体场景，并说明你会用哪些组件（Commands、Agents、Skills、Hooks、MCP）来实现。

2. 如果你要为团队创建一个插件，你会包含哪些组件？为什么？请给出完整的 `plugin.json` 和目录结构设计。

3. 插件的“单一职责”原则在实践中如何把握？如果团队的代码审查、测试、部署高度耦合，应该做成一个插件还是三个插件？请分析利弊。

4. Claude Code 的能力边界在哪里？有哪些任务你认为仍然应该由人类完成，而不应该被封装进插件？


## 课程总结：从使用者到驾驭者

恭喜你完成了《Claude Code 工程化实战》全部内容！

让我们回顾这段旅程。

**第一部分：基础篇（第 1-2 讲）**

我们从 Claude Code 全景导览开始，理解了它不只是命令行助手，而是可扩展的 AI Agent 框架。然后学习了 CLAUDE.md 记忆系统，让 Claude 记住项目规范和团队约定。

**第二部分：子代理专题（第 3-8 讲）**

我们深入学习了子代理的核心概念，把“一个大脑”拆成多个“专职岗位”。通过代码审查员、测试运行器、日志分析器、多视角探索、Bug 修复流水线和 Agent Teams 等实战项目，掌握了隔离执行、权限边界和上下文管理。

**第三部分：Skills 技能系统（第 9-14 讲）**

我们理解了 SKILL.md 的触发机制——description 不是说明文档，而是触发器。学习了渐进式披露架构，用目录页、章节、附录三层结构把 token 利用率提升 98%。通过 API 生成器等项目，掌握了构建完整领域能力包的方法。最后，我们见证了 Skills 从 Claude Code 的产品特性出圈成为行业开放标准的过程。

**第四部分：核心组件和机制（第 15-18 讲）**

我们学习了 Hooks 实现事件驱动自动化（基础篇和高级篇），MCP 连接数据库、API 和第三方服务。这些扩展机制让 Claude Code 成为一个可编程、可定制的平台。

**第五部分：生产化与工程化（第 19-23讲）**

我们学习了 Headless 模式让 Claude 在 CI/CD 中无人值守运行，Agent SDK 让你用代码驱动 AI 执行任务（基础篇和高级篇），最后用 Plugins 把所有能力打包成可复用的资产。

![图片](images/966900/3b436bbc7af58888c734e83fe8c39c63.jpg)

**你现在掌握的能力已经有这么多了！**

- **Memory系统**：让 Claude 理解你的项目

- **SubAgents**：分而治之，各司其职

- **Skills**：领域知识，按需加载

- **Commands**：团队标准，一键执行

- **Hooks**：自动化行为，无需手动

- **MCP**：连接万物，扩展边界

- **Headless**：自动运行，无人值守

- **Rules**：规则权限，有章可循

- **Agent SDK**：代码驱动，完全掌控

- **Plugins**：打包分发，复用共享


**你已经从 Claude Code 的使用者成长为驾驭者。**

这门课程教给你的是框架和模式，真正的掌握来自实践。

佳哥在这里建议你：

1. **从小处开始**：做一个又一个项目，体验Claude Code的价值

2. **逐步深入**：遇到重复任务，尝试用子代理或 Skill 解决

3. **持续积累**：把好用的配置打包成插件，形成你的工具箱

4. **分享交流**：把你的插件和心得分享给团队或社区（咱们的群），在反馈中进步


AI 正在重塑软件开发的方式。Claude Code 不是要替代开发者，而是要 **增强** 开发者。它处理重复，你做创造；它执行任务，你做决策；它是工具，你是主人。 **人机协作的未来已经到来，而咱们已经准备好驾驭它。**

感谢你的学习，祝你在 AI 辅助开发的道路上越走越远。不过还没完呢，我们还有结束语和20道测试题，别忘了看，也别忘了给佳哥和你自己点赞！