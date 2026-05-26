# 17｜海纳百川：MCP 协议与外部工具连接
> 释题：海纳百川。一个开放协议，让 Claude Code 从只能操作本地文件的工具，进化为能连接整个数字世界的智能枢纽——数据库、API、云服务，百川归海，一协议通。

你好，我是黄佳。

前面两讲我们学习了 Hooks——事件驱动自动化的安全闸门。Hooks 让我们能在 Claude 执行工具前后插入自定义检查，解决了“能不能做”的问题。但即使有了 Memory 的记忆、SubAgents 的分工、Skills 的领域能力、Commands 的标准流程、Hooks 的安全防护，Claude Code 的所有能力，始终被锁在一个边界内——本地文件系统。今天我们就来打破这个边界。

Claude 能读文件、写代码、执行命令，这些你已经非常熟悉。但面对下面这些需求时，它就无能为力了：

- 帮我查一下数据库里上个月的销售数据

- 把这个 Issue 同步到 GitHub

- 从 Notion 里读取产品需求文档

- 检查一下 Sentry 上最近的错误日志


这不是 Claude 不够聪明，而是它缺少与外部世界连接的通道。读代码、写代码、跑命令——本质都是本地文件系统交互。而企业开发的真实场景中，数据库、版本控制系统、项目管理平台、监控系统才是日常主战场。如果 Claude 无法触及这些系统，它就只能做一个聪明但孤立的本地助手。

2024 年 11 月，Anthropic 推出了一项开源协议，彻底改变了这个局面——Model Context Protocol (MCP)，AI 时代的USB-C 接口（参见佳哥之前推出的专栏 [《MCP & A2A 前沿实战》](https://time.geekbang.org/column/intro/101053801)）。

## MCP——AI 的 USB-C 接口

在 MCP 出现之前，如果你想让 AI 助手连接外部服务，通常有两种选择：

1. **自定义开发**：为每个服务写专门的集成代码

2. **平台绑定**：依赖特定平台提供的插件（如 ChatGPT Plugins）


这带来了严重的碎片化问题。假设市场上有 M 个 AI 助手和 N 个外部服务，那么理论上需要 M × N 个专用适配器。每一对组合都需要单独开发、单独维护、单独调试：

![](images/955015/1a71310130f2fa3359ef325cfaed2cb2.jpg)

MCP 的出现改变了这一切。正如 [Anthropic 官方博客](https://www.anthropic.com/news/model-context-protocol) 所描述的：

> 把 MCP 想象成 AI 应用的 USB-C 接口。就像 USB-C 提供了连接设备与各种外设的标准化方式，MCP 提供了连接 AI 模型与各种数据源和工具的标准化方式。 有了 MCP，M × N 的问题变成了 M + N：

![](images/955015/4feef448c583abc385f42ea2afdac01a.jpg)

一个协议，通用连接。每个 AI 助手只需要实现一次 MCP Client，每个服务只需要实现一次 MCP Server，然后任意组合即可工作。

![](images/955015/66e77ba71666a2cf1d5021e3b9a85167.jpg)

MCP 的诞生源于一个简单的痛点。据 [Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol) 记载，MCP 协议由 Anthropic 的两位工程师 David Soria Parra 和 Justin Spahr-Summers 构思并开发：

> 2024 年 7 月，我在做内部开发工具…作为一个开发工具背景的人，我很快就欣赏到 Claude Desktop 的强大——比如 Artifacts 功能——但也对它功能集有限、无法扩展感到沮丧。
>
> 这个痛点在当时并非个例。每一个试图将 AI 助手集成到真实工作流中的工程师都面临同样的困境。David 和 Justin 的洞察在于：这个问题不应该由每个开发者各自解决，而应该由一个开放协议统一解决——就像 HTTP 统一了 Web、LSP 统一了 IDE 语言支持那样。

MCP 发布后，迅速获得了行业认可：

- **2025 年 3 月**： [OpenAI 正式采纳 MCP](https://en.wikipedia.org/wiki/Model_Context_Protocol)，将其集成到 ChatGPT 桌面应用和 Agents SDK 中

- **2025 年 9 月**：Google 宣布为 Gemini 提供官方 MCP 支持

- **2025 年 12 月**：Anthropic 将 MCP [捐赠给 Linux 基金会下的 Agentic AI Foundation (AAIF)](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)

- **AAIF 创始成员**：OpenAI、Google、Microsoft、Amazon Web Services、Cloudflare、Bloomberg


截至 2025 年底，MCP 生态已经达到惊人的规模。

- **9700 万** 月度 SDK 下载量

- **10000+** 公开 MCP 服务器（PulseMCP 目录收录 10,400+，MCP.so 收录 18,500+）

- **75+** 官方 Claude 连接器


![](images/955015/5c04e8ccf1b94ba97df7c231c9f69b18.jpg)

## MCP 架构与核心概念

MCP 采用经典的客户端-服务器架构。Claude Code 充当 MCP Client，负责发现和调用工具；MCP Server 则暴露工具和资源，作为外部服务的代理。两者之间通过 JSON-RPC 2.0 协议通信。

![](images/955015/0bd8713656afef7c538ebf568ff03b88.jpg)

这个架构的关键组件如下表所示。

![](images/955015/1990fb9c666f40139b02d17d9bcbb5db.jpg)

MCP 复用了 [Language Server Protocol (LSP)](https://en.wikipedia.org/wiki/Language_Server_Protocol) 的消息流思想。如果你用过 VS Code，你已经间接体验过这种架构——编辑器的智能提示、跳转定义等功能，都是通过 LSP 与语言服务器通信实现的。MCP 做了同样的事情，只不过它服务的不是代码编辑器，而是 AI Agent。

MCP Server 并不只是简单地“暴露一个函数”。它可以向 Client 提供三种不同类型的能力。

![](images/955015/76ef47995dbb4a63481dea6bc04dee07.jpg)

Tools 是最常用的能力类型——它让 Claude 能够“做事情“。Resources 提供只读数据，让 Claude 能够“看到东西”而不仅仅依赖你粘贴的文本。Prompts 则是一种便捷机制，让服务器预定义好特定场景的交互模板。

Claude Code 会在启动时自动发现所有配置的 MCP Server 及其提供的能力。当你说“帮我查一下数据库里的用户数量”时，Claude 会自动找到数据库 MCP Server，调用对应的查询工具，解析结果并返回给你。整个过程对用户完全透明。

## MCP的三种传输方式

MCP 支持三种传输方式，适用于不同场景。

**Stdio 传输（本地进程）** 是最简单的方式。MCP Server 作为本地子进程启动，通过标准输入（stdin）接收请求，通过标准输出（stdout）返回响应。零网络开销、零配置复杂度，适合本地工具和开发测试：

```plain
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["&#64;modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}

```

第二种方式是 **HTTP 传输（推荐用于远程）**。当 MCP Server 运行在远程服务器上时的推荐方式。通过标准 HTTP 请求/响应通信，支持 TLS 加密和 Bearer Token 认证。GitHub、Notion、Sentry 等云服务通常直接提供 HTTP 类型的 MCP 端点：

```plain
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}

```

第三种我们也很熟悉了， **SSE 传输（Server-Sent Events）**——基于 HTTP 的单向推送技术，建立持久连接，服务器可以主动向客户端推送数据。适合实时监控和流式数据场景。在实践中使用较少，大多数场景用 stdio 或 HTTP 就够了。

这几种方式怎么选呢？原则是， **本地用 stdio，远程用 HTTP，实时用 SSE**。如果你拿不定主意，先试 stdio（本地服务器）或 HTTP（远程服务），这两个覆盖了 95% 的场景。

![](images/955015/26a0b1a0bb07daab29efd2a54d27bfcc.jpg)

![](images/955015/cb985ac7dece83d76c1e6d3b26ba7523.jpg)

## MCP的配置与管理

MCP 配置有三个 scope，对应三个不同的物理落点。注意，MCP 配置走的是和 `settings.json` 完全独立的体系—— `mcpServers` 不是 `settings.json` / `settings.local.json` 的合法顶级键，写进去会被静默忽略。

![](images/955015/3469756e21251f842b24f9c5f27fc2a2.jpg)

- **团队共享的服务配置** 放到 `&lt;项目根>/.mcp.json`——提交到 git，团队成员共享。

- **个人常用服务**，如果是跨项目的，放到 `~/.claude.json` 顶级的 `mcpServers`（user scope）。

- **敏感凭证 / 项目私有 MCP** 落在 `~/.claude.json` 的 `projects.&lt;path>.mcpServers`（local scope），不入 git，但不要手写这一段，使用 `claude mcp add` 命令默认写到这里。


不论使用哪种传输方式，MCP 配置都遵循同一个 JSON 结构。 `mcpServers` 是顶层键，每个子键是服务器名称（可自由命名）。 `type` 指定传输方式，剩余字段根据传输类型不同——stdio 需要 `command` 和 `args`，HTTP/SSE 需要 `url` 和 `headers`：

```plain
{
  "mcpServers": {
    "server-name": {
      "type": "stdio | sse | http",
      "command": "...",        // stdio 专用
      "args": ["..."],         // stdio 专用
      "url": "...",            // sse/http 专用
      "headers": {},           // sse/http 专用
      "env": {}                // 环境变量
    }
  }
}

```

![图片](images/955015/a6a50223ca68aa3030f18a8d85c0981c.png) Claude Code 里面的 MCP 配置示例

在配置文件中硬编码敏感信息是危险的。MCP 配置支持通过 `${}` 语法引用环境变量： `${VAR_NAME}` 直接引用，变量不存在会报错； `${VAR_NAME:-default}` 在变量不存在时使用默认值：

```plain
{
  "mcpServers": {
    "secure-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-API-Key": "${API_KEY:-default-key}"
      }
    }
  }
}

```

Claude Code 提供了命令行工具来管理 MCP 服务器，这比手动编辑 JSON 更方便。

```plain
# 添加 HTTP 服务器
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 添加 stdio 服务器
claude mcp add filesystem -- npx &#64;modelcontextprotocol/server-filesystem /path

# 添加到用户级别（所有项目可用）
claude mcp add --transport http --scope user github https://api.githubcopilot.com/mcp/

# 带认证头添加
claude mcp add --transport http --header "Authorization: Bearer ${TOKEN}" api https://api.example.com/mcp

# 列出所有服务器
claude mcp list

# 查看服务器详情
claude mcp get github

# 移除服务器
claude mcp remove github

```

## 实战：连接主流 MCP 服务

理论讲了不少，接下来咱们动手练练。MCP 的生态已经非常成熟，从官方基础服务到第三方热门服务，覆盖了开发者日常所需的各个场景。

Anthropic 维护了一套 [官方 MCP 服务器集合](https://github.com/modelcontextprotocol/servers)，覆盖最常见的开发需求。这些服务器经过官方测试和维护，是入门 MCP 的最佳起点。

![](images/955015/4896aa2e92390c9ee458cf9b597e15e7.jpg)

社区也贡献了大量高质量的第三方 MCP 服务器。以下是开发者最常用、真正能跑的几个。

- [GitHub MCP](https://github.com/github/github-mcp-server)

- [Context7](https://github.com/upstash/context7)

- [Notion MCP](https://developers.notion.com/docs/mcp)

- [Brave Search](https://github.com/nicobailey/brave-search-mcp)

- [Sentry MCP](https://docs.sentry.io/product/sentry-mcp/)


![](images/955015/6c99719525ebaea88d98d44cbe92bde5.jpg)

我们来介绍几个最典型的配置，更多的实际实用的MCP工具，咱们可以继续在留言区分享。

### 实战 1：Context7——实时技术文档

Context7 是开发者社区最火的 MCP 服务器之一。它的价值在于，当你让 Claude 帮你写代码时，Claude 可以实时拉取你用的库的最新文档，而不是依赖训练数据中可能过时的知识。

配置极其简单，一行命令搞定。

```plain
claude mcp add context7 -- npx -y &#64;upstash/context7-mcp&#64;latest

```

或者在 `.mcp.json` 中手动配置：

```plain
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "&#64;upstash/context7-mcp&#64;latest"]
    }
  }
}

```

配置完成后，你可以在提示中加上 `use context7` 关键词，Claude 就会自动去拉取最新的官方文档：

```plain
帮我用 Next.js 15 的 App Router 写一个带认证的 API 路由 use context7

```

Claude会输出：

```plain
先查一下 Next.js 15 的最新文档...
[调用 context7 MCP server → resolve_library_id → get_library_docs]
根据最新文档，Next.js 15 的 App Router API 路由写法如下...

```

不需要 API Key，不需要付费，开箱即用。这就是为什么它成了开发者的“标配”MCP。

### 实战 2：GitHub MCP——仓库操作

GitHub 官方推出的 MCP 服务器，支持完整的仓库管理操作：创建 Issue、管理 PR、搜索代码、查看 CI/CD 状态。

**方式一：HTTP 远程连接**（推荐，GitHub 官方托管）

```plain
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}

```

**方式二：stdio 本地运行**（更灵活，可定制参数）

```plain
claude mcp add github -- docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_TOKEN} \
  ghcr.io/github/github-mcp-server

```

配置好之后，你可以直接在终端里操作 GitHub：

```plain
发现一个登录页面的 Bug，当用户输入超长密码时会崩溃，帮我创建一个 Issue

```

Claude输出如下。

```plain
让我在 GitHub 上创建这个 Issue...
[调用 GitHub MCP server → create_issue]

已创建 Issue #142: "Login page crashes with extremely long password"
- Labels: bug, high-priority
- URL: https://github.com/your-org/your-repo/issues/142

```

GITHUB\_TOKEN 需要事先创建。到 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens，勾选你需要的仓库权限即可。

### 实战 3：Notion MCP——文档集成

Notion 官方开源了 MCP 服务器，让 Claude 可以直接读写你的 Notion 工作区。

```plain
{
  "mcpServers": {
    "notion": {
      "type": "http",
      "url": "https://mcp.notion.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTION_API_KEY}"
      }
    }
  }
}

```

NOTION\_API\_KEY 在 [Notion Developers](https://www.notion.so/profile/integrations) 创建 Internal Integration 后获取。记得在 Notion 页面的 Connections 里添加你创建的 Integration，否则 Claude 看不到页面内容。

```plain
从 Notion 里读取"Q1 产品路线图"，帮我提取其中的技术任务

```

Claude输出如下。

```plain
读取 Notion 文档...
[调用 Notion MCP server → search → get_page]

从 "Q1 产品路线图" 提取的技术任务：
1. 用户认证系统升级（2月前）
   - 支持 OAuth 2.0
   - 添加双因素认证
2. 搜索功能优化（3月前）
   - 实现全文搜索
   - 添加搜索建议

```

### 实战 4：数据库——查询与分析

连接数据库是 MCP 最实用的场景之一。 `@bytebase/dbhub` 支持 PostgreSQL、MySQL、SQLite 等多种数据库：

```plain
{
  "mcpServers": {
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "&#64;bytebase/dbhub", "--dsn", "${DATABASE_URL}"]
    }
  }
}

```

`DATABASE_URL` 格式为 `postgresql://user:password@localhost:5432/mydb`。建议使用只读账户，防止 Claude 误操作修改数据。

```plain
帮我查一下数据库里上个月的订单数量和总金额

```

Claude输出如下。

```plain
查询数据库...
[调用 database MCP server → run_query]

上个月（2025年12月）的订单统计：
- 订单数量：1,234 笔
- 总金额：¥456,789.00
- 平均客单价：¥370.21

```

把上面几个服务组合到一起，你就拥有了一个连接多个系统的完整工具箱。

以下是一个面向全栈开发者的 `.mcp.json` 配置：

```plain
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "&#64;upstash/context7-mcp&#64;latest"]
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "notion": {
      "type": "http",
      "url": "https://mcp.notion.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTION_API_KEY}"
      }
    },
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "&#64;bytebase/dbhub", "--dsn", "${DATABASE_URL}"]
    },
    "fetch": {
      "type": "stdio",
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    }
  }
}

```

对应的 `.env` 文件（绝对不要提交到版本控制）：

```plain
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://readonly:password&#64;localhost:5432/mydb
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx

```

有了这个配置，你在终端里的对话可以跨越多个系统而不中断上下文。你可以一边讨论代码中的 Bug，一边查数据库确认问题，一边创建 GitHub Issue，一边翻 Notion 需求文档——Claude 全程保持上下文，不需要你在五个工具间来回切换。

![](images/955015/037bbb7069f48c373aef35cb976c680c.jpg)![](images/955015/3f87d8a92d2c698609f93f7c28836454.jpg)

## 创建自定义 MCP 服务器

当现有的 MCP 服务器无法满足需求时，你可以创建自己的。MCP 官方提供了 TypeScript 和 Python 两套 SDK，开发一个基本的 MCP Server 只需要几十行代码。

### TypeScript SDK

TypeScript SDK 是使用最广泛的 MCP 开发工具。安装依赖：

```plain
npm install &#64;modelcontextprotocol/sdk zod

```

下面是一个完整的 Todo 管理 MCP Server（ `src/index.ts`）。它定义了三个工具（添加、列出、完成待办）和一个资源（统计信息）。注意每个工具都有名称、描述、参数 schema 和处理函数——Claude 通过描述来决定何时调用这个工具：

```plain
import { McpServer } from "&#64;modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "&#64;modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 内存存储
const todos: { id: string; text: string; done: boolean }[] = [];

// 创建 MCP 服务器
const server = new McpServer({
  name: "my-todo-server",
  version: "1.0.0",
});

// 定义工具：添加待办
server.tool(
  "todo_add",
  "Add a new todo item",
  {
    text: z.string().describe("The todo text"),
  },
  async ({ text }) =&gt; {
    const todo = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      done: false,
    };
    todos.push(todo);

    return {
      content: [
        {
          type: "text",
          text: `Added todo: ${todo.id} - ${todo.text}`,
        },
      ],
    };
  }
);

// 定义工具：列出待办
server.tool(
  "todo_list",
  "List all todo items",
  {},
  async () =&gt; {
    const text = todos.length === 0
      ? "No todos found."
      : todos
          .map((t) =&gt; `[${t.done ? "x" : " "}] ${t.id}: ${t.text}`)
          .join("\n");

    return {
      content: [{ type: "text", text: `Todos:\n${text}` }],
    };
  }
);

// 定义工具：完成待办
server.tool(
  "todo_complete",
  "Mark a todo as completed",
  {
    id: z.string().describe("The todo ID"),
  },
  async ({ id }) =&gt; {
    const todo = todos.find((t) =&gt; t.id === id);
    if (!todo) {
      return {
        content: [{ type: "text", text: `Todo not found: ${id}` }],
        isError: true,
      };
    }

    todo.done = true;
    return {
      content: [{ type: "text", text: `Completed: ${todo.text}` }],
    };
  }
);

// 定义资源：统计信息
server.resource(
  "stats",
  "stats://current",
  async (uri) =&gt; {
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({
            total: todos.length,
            completed: todos.filter((t) =&gt; t.done).length,
            pending: todos.filter((t) =&gt; !t.done).length,
          }, null, 2),
        },
      ],
    };
  }
);

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server started");
}

main().catch(console.error);

```

### Python SDK

Python 版本使用装饰器风格，对 Python 开发者来说更加自然。

```plain
pip install mcp
from mcp.server.fastmcp import FastMCP

server = FastMCP("my-todo-server")

todos = []

&#64;server.tool("todo_add")
async def add_todo(text: str) -&gt; str:
    """Add a new todo item"""
    import random
    import string
    todo_id = ''.join(random.choices(string.ascii_lowercase, k=7))
    todos.append({"id": todo_id, "text": text, "done": False})
    return f"Added todo: {todo_id} - {text}"

&#64;server.tool("todo_list")
async def list_todos() -&gt; str:
    """List all todo items"""
    if not todos:
        return "No todos found."
    return "\n".join(
        f"[{'x' if t['done'] else ' '}] {t['id']}: {t['text']}"
        for t in todos
    )

&#64;server.tool("todo_complete")
async def complete_todo(id: str) -&gt; str:
    """Mark a todo as completed"""
    for todo in todos:
        if todo["id"] == id:
            todo["done"] = True
            return f"Completed: {todo['text']}"
    return f"Todo not found: {id}"

if __name__ == "__main__":
    server.run()

```

### 配置自定义服务器

写完代码后在 `.mcp.json` 中注册。TypeScript 版本先编译再运行，Python 版本直接运行：

**TypeScript 版本：**

```plain
{
  "mcpServers": {
    "my-todo": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp-server/build/index.js"]
    }
  }
}

```

**Python 版本：**

```plain
{
  "mcpServers": {
    "my-todo": {
      "type": "stdio",
      "command": "python",
      "args": ["./mcp-server/server.py"]
    }
  }
}

```

## 5条MCP安全原则

MCP 的强大能力也带来了安全风险。它本质上是在给 AI Agent 开放访问外部系统的权限。正如 [Anthropic 官方警告](https://code.claude.com/docs/en/mcp) 里说的：

> 使用第三方 MCP 服务器需自担风险。Anthropic 未验证所有服务器的正确性和安全性。
>
> 这里给出五条MCP使用的安全原则。

**1\. 验证服务器来源**——只使用官方或知名来源的 MCP 服务器。一个恶意的 MCP Server 可以在你不知情的情况下读取敏感文件、窃取环境变量中的密钥。

**2\. 限制权限范围**——遵循最小权限原则，只给必要的目录和资源访问：

```plain
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "&#64;modelcontextprotocol/server-filesystem",
        "/safe/directory/only"
      ]
    }
  }
}

```

**3\. 使用只读凭证**——对于数据库等关键系统，永远不要给 MCP Server 写权限——除非你明确需要 Claude 修改数据。 **4\. 保护敏感凭证**——绝对不要在配置文件中硬编码 Token。使用环境变量引用，将敏感值存在不提交到 git 的文件中。

**5\. 审计 MCP 服务器代码**——对于开源服务器，在使用前检查其代码：它请求哪些权限？它如何处理用户数据？花十分钟审计代码，可能帮你避免一次严重的安全事故。

![图片](images/955015/b19c952d151228c2ff36e40dc548c37e.png)

![](images/955015/10d293b9f6474fca5741596c277a0f80.jpg)

## 调试与故障排除

MCP 配置好之后，可能不会一次就跑通。Claude Code 内置了调试工具：

```plain
# 列出所有配置的服务器
claude mcp list

# 查看服务器详细信息
claude mcp get my-server

# 启用调试模式查看 MCP 连接详情
claude --debug

```

常见问题速查表如下。

![](images/955015/00feb48bd28c519af480fa0ab7d96647.jpg)

MCP 工具可能产生大量输出。因此在Token的控制方面，Claude Code 对 MCP 输出提供了两级保护。

![](images/955015/7fbb1997774a2d9258deb08ae4ed6620.jpg)

如果需要处理大量数据，可以通过环境变量调整上限。但更好的做法是在 MCP Server 端做分页或摘要：

```plain
export MAX_MCP_OUTPUT_TOKENS=50000

```

## 总结一下

这一讲我们学习了 Model Context Protocol (MCP)——AI 时代的 USB-C 接口。

MCP 解决了 AI 助手与外部世界连接的碎片化问题——从 M × N 个适配器简化为 M + N 个。它采用 Client-Server 架构，支持三种传输方式（stdio、HTTP、SSE），配置文件可版本控制并团队共享。

生态系统是 MCP 最大的优势。官方提供文件系统、HTTP 请求、Git、PostgreSQL 等基础服务器；第三方则覆盖了 GitHub、Notion等主流服务。我们动手配置了几个最典型的 MCP 服务。当然，强大的能力也带来安全风险，我们给出了五条安全原则。更多的MCP相关细节，可以阅读我在极客时间的 [MCP专栏](https://time.geekbang.org/column/intro/101053801?utm_campaign=guanwang&utm_content=0511&utm_medium=geektime&utm_source=pinpaizhuanqu&utm_term=guanwang&tab=catalog)。

写到这里，我们看到 MCP 让 Claude Code 从一个“只能操作本地文件”的工具，进化为“能连接整个数字世界”的智能助手。但这里有个有趣的问题——我感觉前面的基础篇课程中缺失了重要一环，就是Claude Code 内置的那些工具本身：Read、Write、Bash、Grep……这些“原生工具”是怎么组织的，以至于产生了那么强大的效果？这也值得我们好好思考思考。

## 思考题

1. 请你分享分享你在工作和个人项目中使用过哪些好用的MCP。

2. MCP 被称为AI 的 USB-C。这个类比在哪些方面贴切？有哪些方面可能不太准确？你可以从协议治理、版本兼容性、物理层 vs. 逻辑层等多个角度分析。

3. 如果你要为公司内部系统创建一个 MCP 服务器，你会如何设计它的权限模型？考虑多租户隔离、操作审计日志、读写权限分级等维度。

4. MCP 服务器可能产生大量输出（比如数据库查询返回几万行）。除了截断，还有哪些方式可以优化这个问题？从服务器端分页、客户端摘要、流式处理等方向思考。

5. 在团队协作场景中， `.mcp.json`（版本控制）和 `.claude/settings.local.json`（本地保存）的分工策略是什么？如果一个 MCP Server 既需要团队共享配置，又需要个人私有凭证，你会怎么设计？


## 下一讲预告

MCP 让我们能连接外部世界，但 Claude Code 自身的工具系统——Read、Write、Bash、Grep、Glob、Agent……这十几个内置工具是怎么组织的？它们的权限如何控制？和 MCP 扩展的工具又是什么关系？

第 18 讲，我们将深入剖析 Claude Code 的 **工具系统（Tools）全貌**——从 Agentic Loop 的三个阶段、15+ 内置工具的分类与风险等级、五种软件工程原子操作，到工具的权限控制体系。这一节是新加进来的，我认为相当重要（本应放在基础篇，不过，因为目前大家知识体系已经全面，放在这里我们理解起来更深入），因为理解了工具系统，你才能真正理解 Claude Code 这台“AI 引擎”是如何运转的。

欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。