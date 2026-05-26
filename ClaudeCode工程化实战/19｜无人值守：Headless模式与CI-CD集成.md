# 19｜无人值守：Headless 模式与 CI/CD 集成
> 释题：无人值守。当 Claude Code 脱离人的实时操控，以守护进程般的姿态嵌入流水线，开发团队获得的不只是效率提升，而是一种全新的人机协作节奏。

你好，我是黄佳。

之前，我们庖丁解牛，深入剖析了 Claude Code 的工具系统——十几个精选的原语工具覆盖五个原子操作，通过涌现产生无限复杂能力。工具系统回答了一个核心问题： **Claude Code 能做什么。** 但不管工具有多强大，有一个前提始终没变：你得坐在终端前面，实时和 Claude 对话。

这一讲，我们要打破这个前提。我们要让 Claude Code 在完全没有人工干预的情况下自动运行——在 CI/CD 流水线中审查代码，在 pre-commit hook 里检查提交，在定时任务中生成报告。这就是 Headless 模式的核心：从“有人值守”到“无人值守”。

## 凌晨三点的代码审查

这是一个分布在三个时区的远程团队：美国西海岸、欧洲、亚洲。当亚洲的小王在早上 9 点提交 PR 时，美国的 Tech Lead 还在睡觉。当美国的同事审查完代码时，小王已经下班了。每个 PR 的审查周期动辄 24-48 小时，不是因为审查本身需要那么长时间，而是因为 **人的作息时间不同步**。

有一天，团队配置了一个 GitHub Action：每当 PR 创建或更新时，Claude Code 会自动进行初步审查——检查代码风格、潜在 Bug、安全问题。当人类审查者醒来时，他们看到的不是一片空白的 PR，而是已经有一份详细的 AI 审查报告。

**PR 的平均审查周期从 36 小时缩短到了 8 小时。**

这就是 Headless 模式的价值：让 Claude Code 在 **没有人工干预的情况下自动工作**。它并不是取代人类审查者，而是在人类不在线的时候先行一步，把基础工作做好。这样我们打开 PR 时，就可以直接从 AI 的审查报告出发，聚焦于需要人类判断力的高层问题——架构合理性、业务逻辑正确性、团队规范一致性，而不是把时间花在检查缩进和命名规范上。

## Headless 模式核心机制

在前面的章节中，我们一直在终端里与 Claude 对话——你输入一句话，Claude 响应，你再输入，它再响应。这是 **交互模式**。交互模式的好处是灵活，你可以随时调整方向、追问细节、确认操作。但它有一个根本限制——需要一个人类一直坐在屏幕前面。

然而，软件工程中有大量任务天然不需要实时对话。CI/CD 流水线在每次提交时自动运行，Pre-commit Hook 在提交前自动检查，定时任务在每天凌晨自动生成报告。这些场景需要的是 **非交互模式**，也就是 Headless 模式。

> [Anthropic 官方文档](https://code.claude.com/docs/en/headless) 说：Claude Code 包含 Headless 模式，用于 CI、pre-commit hooks、构建脚本和自动化等非交互式场景。

Headless 这个词来自“无头浏览器”（Headless Browser）的概念——没有图形界面，但功能完整。同样，Headless 模式下的 Claude Code 没有交互式终端界面，但拥有和交互模式完全相同的代码分析能力、工具调用能力和推理能力。唯一的区别是：输入变成了一次性的 prompt，输出变成了 stdout 上的文本或 JSON，不再有来回对话。

启用 Headless 模式的关键是 `-p`（或 `--print`）标志。这个标志的名字很直观，print，意思是“把结果打印出来就行，不要打开交互界面”。理解这一点很重要，因为 `-p` 不只改变了输出方式，更重要的是它改变了 Claude Code 的整个运行模型—— **从“持续对话”变成了“单次执行”**。

```plain
# 基本 headless 执行
claude -p "解释这段代码是做什么的"

# 从 stdin 读取输入
cat code.py | claude -p "分析这段代码"

# 结合文件内容
claude -p "找出这个文件中的 Bug" &lt; buggy.js

```

`-p` 告诉 Claude Code：不要打开交互界面，直接执行任务，把结果输出到 stdout，然后退出。这种“执行即退出”的模式，正是脚本和流水线所需要的——它们不需要等待用户输入，只需要一个确定性的输入-输出流程。

下表清晰地展示了两种模式在各个维度上的差异。理解这些差异，有助于你判断什么场景适合用交互模式，什么场景应该切换到 Headless。我给你一个简单的判断标准：如果任务需要人类在过程中做决策，用交互模式；如果任务的输入和期望输出在启动前就能完全确定，用 Headless。

![](images/959884/a1ebayy885dbc87acef4f347a42337e5.jpg)

Headless 模式提供了一组命令行参数来精细控制执行行为。这些参数是你在自动化脚本和 CI 配置中最常用的控制手段。特别值得注意的是 `--allowedTools` 和 `--max-turns` 这两个参数，它们是安全防护的第一道防线，能有效限制 Claude 在无人监管环境中的行为边界。

![](images/959884/c9f508faa846b65d2488960bd8424ce4.jpg)

![](images/959884/5e9f73ce1cd9b75c0b7ecca7a4cfaf0b.jpg)

## 输出格式与管道集成

Headless 模式支持三种输出格式，适用于不同的自动化场景。选择哪种格式，取决于你的下游消费者是谁——是人类读者、是程序解析器、还是实时监控系统。

### Text 格式

Text 是默认格式，也是最简单的格式。适用场景为日志记录、简单脚本、人工审查。它直接输出 Claude 的回复文本，没有任何元数据包装。如果你只是想在终端里看结果，或者将结果写入日志文件，Text 格式就够了。

```plain
claude -p "生成一个 Python hello world 函数" --output-format text

```

输出：

```plain
Here's a simple hello world function:

def hello_world():
    print("Hello, World!")

```

### JSON 格式

当你需要在程序中解析 Claude 的输出时，JSON 格式是更好的选择。它不仅包含回复文本本身，还包含执行的元数据——耗时多久、花了多少钱、用了多少 tokens。这些元数据对于成本监控和性能调优至关重要。在生产环境的 CI/CD 流水线中，你几乎总是应该使用 JSON 格式，因为它让你能够用程序化的方式验证执行结果、追踪成本、检测异常。

```plain
claude -p "列出当前目录文件" --output-format json

```

输出：

```plain
{
  "type": "result",
  "subtype": "success",
  "session_id": "abc123",
  "is_error": false,
  "duration_ms": 1500,
  "duration_api_ms": 1200,
  "num_turns": 1,
  "total_cost_usd": 0.005,
  "usage": {
    "input_tokens": 150,
    "output_tokens": 200
  },
  "result": "文件列表：\n- file1.py\n- file2.js\n..."
}

```

下面是一个 Python 解析示例。这段代码展示了如何在脚本中调用 Claude Code 并提取结构化结果。注意 `subprocess.run` 的用法——它是在 Python 中调用外部命令的标准方式， `capture_output=True` 确保我们能拿到 stdout 的内容。

```plain
import subprocess
import json

result = subprocess.run(
    ["claude", "-p", "列出文件", "--output-format", "json"],
    capture_output=True,
    text=True
)

data = json.loads(result.stdout)
print(f"结果: {data['result']}")
print(f"耗时: {data['duration_ms']}ms")
print(f"费用: ${data['total_cost_usd']}")

```

### Stream-JSON 格式

对于长时间运行的任务，你可能不想等到执行完成才看到输出，因此这种格式适用于实时进度显示、长时间任务监控、流式处理。Stream-JSON 格式以 JSONL（每行一个 JSON 对象）的方式实时输出执行过程中的每个事件——Claude 的每段回复、每次工具调用、每个工具返回结果。

这种格式特别适合需要实时进度显示的场景，比如在 CI 日志中实时展示 Claude 正在做什么。

```
claude -p "分析代码" --output-format stream-json

```

输出里（每行一个事件）：

```plain
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"正在分析..."}]}}
{"type":"tool_use","tool":"Read","input":{"file_path":"/path/to/file"}}
{"type":"tool_result","tool":"Read","result":"file content..."}
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"分析完成。"}]}}
{"type":"result","session_id":"abc123","is_error":false,"result":"最终结果"}

```

下面这段 Bash 脚本展示了如何逐行读取 Stream JSON 输出，并根据事件类型做出不同响应。你可以在此基础上扩展，比如在检测到 tool use 事件时，更新进度条，在检测到 result 事件时触发下游通知。

```plain
claude -p "分析代码" --output-format stream-json | while IFS= read -r line; do
  type=$(echo "$line" | jq -r '.type')
  if [ "$type" = "result" ]; then
    echo "最终结果: $(echo "$line" | jq -r '.result')"
  elif [ "$type" = "tool_use" ]; then
    echo "正在使用工具: $(echo "$line" | jq -r '.tool')"
  fi
done

```

### Unix 管道集成

Claude Code 的一个独特优势是它可以 **无缝融入 Unix 管道**，成为你工具链中的一环。这不是一个附加功能，而是一种设计哲学——Claude Code 遵循 Unix“小工具、大组合”的传统，通过标准输入输出与其他命令行工具互联互通。

基本管道用法如 [Anthropic 工程博客](https://www.anthropic.com/engineering/claude-code-best-practices) 所述：

> “Claude Code 可以作为 Unix 风格的工具，允许你直接将数据管道到它（如 `cat foo.txt | claude -p "query"`），这对于处理日志或 CSV 特别有用。”

管道的核心思想是：前一个命令的输出，成为后一个命令的输入。当 Claude Code 站在管道中间时，它接收上游数据，用 AI 理解和处理这些数据，然后把结果传给下游。这意味着你可以把 Claude 插入到任何现有的 Shell 工作流中，而不需要改变工作流的结构。

```plain
# 分析日志文件
cat server.log | claude -p "找出所有错误并总结原因"

# 解析 JSON
curl https://api.example.com/data | claude -p "提取所有用户的邮箱地址"

# 代码转换
cat old-code.js | claude -p "将这段 JavaScript 转换为 TypeScript"

```

管道的真正威力在于 **组合**。下面这些例子展示了 Claude Code 如何与 `find`、 `git`、 `grep` 等经典 Unix 工具协作。每个组合都解决了一个真实的开发场景——批量检查类型提示、总结提交变更、将散落的 TODO 转换为规范的 Issue 格式。

```plain
# 结合 find 和 xargs 批量处理
find src -name "*.py" | xargs -I {} claude -p "检查 {} 中的类型提示是否完整"

# 结合 git 工作流
git diff HEAD~1 | claude -p "总结这次提交的变更"

# 结合 grep 预过滤
grep -r "TODO" src/ | claude -p "将这些 TODO 转换为 GitHub Issue 格式"

```

![](images/959884/9f50056b8d868b32478127874fa3cce4.jpg)

Claude 不仅可以接收管道输入，它的输出同样可以 **通过管道流向下游**。这样你就能构建完整的自动化链路：数据获取 -\> AI 分析 -> 结果处理 -> 通知或存储。

下面的例子展示了三种典型的下游处理模式——用 `jq` 解析 JSON 结果、直接写入文件以及发送邮件通知。

```plain
# Claude 输出 -&gt; jq 解析 -&gt; 下游处理
claude -p "列出所有函数名" --output-format json | jq -r '.result' | sort | uniq

# Claude 生成代码 -&gt; 直接写入文件
claude -p "生成一个 Express 路由处理函数" --output-format text &gt; routes/user.js

# Claude 分析 -&gt; 发送通知
claude -p "检查是否有安全漏洞" --output-format json | \
  jq -r '.result' | \
  mail -s "安全扫描报告" security&#64;company.com

```

### 批量处理模式

当你需要对大量文件执行相同的 AI 分析任务时，批量处理模式就派上用场了。 [SmartScope 博客](https://smartscope.blog/en/generative-ai/claude/claude-code-batch-processing/) 详细介绍了这种模式：

> Claude Code 的批处理（headless 模式）允许你直接从命令行执行 AI 功能，无需使用交互式 UI。通过集成到 CI/CD 流水线和自动化脚本中，你可以高效执行大规模处理任务。

下面是一个批量代码审查脚本。它遍历 `src` 目录下的所有 TypeScript 文件，对每个文件运行 Claude 审查，并将结果保存到独立的报告文件中。注意 `--max-turns 3` 的设置——对于单文件审查，3 轮通常就足够了，这样既能保证审查质量，又能控制成本和耗时。

```plain
#!/bin/bash
# batch-review.sh - 批量代码审查

RESULTS_DIR="review-results"
mkdir -p "$RESULTS_DIR"

# 遍历所有源文件
find src -name "*.ts" | while IFS= read -r file; do
  echo "Reviewing: $file"

  OUTPUT_FILE="$RESULTS_DIR/$(basename "$file").review.md"

  claude -p "Review $file for bugs and best practices. Be concise." \
    --output-format text \
    --max-turns 3 \
    --allowedTools Read &gt; "$OUTPUT_FILE"

  echo "  -&gt; $OUTPUT_FILE"
done

echo "Reviews complete. Results in $RESULTS_DIR/"

```

## GitHub Actions 集成

GitHub Actions 是 Headless 模式最常见的应用场景。GitHub 是最大的代码托管平台，而 Actions 是它的原生 CI/CD 系统。Claude Code 与 GitHub Actions 的集成，让“AI驱动的代码审查”不再停留于概念，而是几行YAML配置就能实现。

![](images/959884/433d256b69e3931b4b9f5253f0062c9a.jpg)

Anthropic 提供了 [官方 GitHub Action](https://github.com/anthropics/claude-code-action)，让集成变得极其简单。相比于手动安装 Claude Code 然后编写 Shell 命令调用，官方 Action 封装了安装、认证、权限管理等底层细节，你只需要提供 API Key 和 prompt 就能开始使用。

> Claude Code GitHub Actions 为你的 GitHub 工作流带来 AI 驱动的自动化。只需在任何 PR 或 Issue 中 @claude，Claude 就能分析你的代码、创建 Pull Request、实现功能、修复 Bug——同时遵循你的项目规范。

官方 Action 支持两种模式，分别对应不同的使用场景。 **Tag Mode** 适合开发者主动请求帮助的场景——你在 PR 评论中 @claude，它就会响应。 **Agent Mode** 适合完全自动化的场景——每次 PR 创建时自动触发，不需要人工干预。

![](images/959884/cceb2473d0b8709b5c3530287fb1a4e9.jpg)

**Tag Mode 示例**：

在 PR 评论中输入 `@claude 帮我审查这段代码`，Claude 会自动响应并提供审查意见。

**Agent Mode 示例**：

```plain
- uses: anthropics/claude-code-action&#64;v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "审查这个 PR 的所有变更，检查安全漏洞"

```

最简单的设置方式是在 Claude Code 终端中运行 `/install-github-app`，它会引导你完成整个配置过程，包括创建 GitHub App、配置 Webhook、设置权限等。

如果你更喜欢手动配置，或者需要定制化的工作流，可以按以下步骤操作。

第一步是在 GitHub 仓库的 Settings -> Secrets -> Actions 中添加 `ANTHROPIC_API_KEY`——这是唯一需要的密钥。

第二步是创建工作流文件，定义触发条件和执行步骤。创建 `.github/workflows/claude.yml`：

```plain
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude:
    runs-on: ubuntu-latest
    # 只在 &#64;claude 提及时触发
    if: contains(github.event.comment.body, '&#64;claude')

    permissions:
      contents: read
      pull-requests: write
      issues: write

    steps:
      - uses: actions/checkout&#64;v4

      - uses: anthropics/claude-code-action&#64;v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}

```

这份配置只有二十几行，但它实现了一个完整的 AI 审查工作流：监听 PR 和 Issue 中的评论，在检测到 @claude 提及时触发，检出代码，然后让 Claude 分析并回复。 `permissions` 部分遵循最小权限原则—— `contents: read` 只允许读取代码， `pull-requests: write` 和 `issues: write` 允许发表评论。

### 自动化 PR 审查

自动化 PR 审查是最常见的用例——每次 PR 创建或更新时自动审查。和上面的 Tag Mode 不同，这里不需要任何人工触发，PR 一创建就会自动开始审查。这个工作流稍微复杂一些，因为它需要获取变更文件列表、构建审查 prompt、运行 Claude、然后将结果发布为 PR 评论。

```plain
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

# 取消正在运行的重复工作流
concurrency:
  group: ${ { github.workflow } }-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  review:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout&#64;v4
        with:
          fetch-depth: 0  # 需要完整历史以获取 diff

      - name: Setup Node.js
        uses: actions/setup-node&#64;v4
        with:
          node-version: "20"

      - name: Install Claude Code
        run: npm install -g &#64;anthropic-ai/claude-code

      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD)
          echo "files=$(echo "$FILES" | tr '\n' ' ')" &gt;&gt; $GITHUB_OUTPUT

      - name: Run Claude Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review this PR for code quality, bugs, security issues.

          Changed files: ${{ steps.changed.outputs.files }}

          Provide specific, actionable feedback with file:line references." \
            --output-format json \
            --max-turns 10 \
            --allowedTools Read,Grep,Glob &gt; review.json

      - name: Post Review Comment
        uses: actions/github-script&#64;v7
        with:
          script: |
            const fs = require('fs');
            const review = JSON.parse(fs.readFileSync('review.json', 'utf8'));

            const comment = `## Claude Code Review\n\n${review.result}\n\n---\n*Automated review by Claude Code*`;

            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });

```

这个工作流有几个值得注意的设计决策。

- `fetch-depth: 0` 确保 checkout 时拉取完整的 git 历史，这样才能正确计算 diff。

- `concurrency` 配置确保同一个 PR 上不会同时运行多个审查，当开发者快速连续推送多个 commit 时，旧的审查会被取消，只保留最新的。

- `--allowedTools Read,Grep,Glob` 限制 Claude 只能使用只读工具，确保审查过程不会意外修改任何文件。


### 自动修复 Lint 错误

除了只读审查，Headless 模式还可以用于自动修复。

下面的工作流展示了一个更激进的用例：当 lint 检查失败时，让 Claude 自动修复错误并提交。这种模式适合风格类的 lint 规则（缩进、分号、import 排序等），对于逻辑类的 lint 规则则需要更谨慎。注意这里没有设置 `--allowedTools`，因为 Claude 需要读写文件来完成修复。

```plain
name: Auto Fix Lint Errors

on:
  push:
    branches: [main, develop]

jobs:
  fix:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout&#64;v4

      - name: Setup
        run: |
          npm ci
          npm install -g &#64;anthropic-ai/claude-code

      - name: Run lint
        id: lint
        continue-on-error: true
        run: npm run lint 2&gt;&1 | tee lint-output.txt

      - name: Fix with Claude
        if: steps.lint.outcome == 'failure'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Fix the lint errors in lint-output.txt. Make minimal changes." \
            --max-turns 20

      - name: Commit fixes
        run: |
          git config user.name "Claude Bot"
          git config user.email "claude&#64;bot.local"
          git add -A
          git diff --staged --quiet || git commit -m "fix: auto-fix lint errors"
          git push

```

![](images/959884/9d25d1dff7c9eddc1596d46cba6e9c80.jpg)

## Pre-commit Hook 集成

Pre-commit Hook 是另一个常见的 Headless 应用场景。与 CI/CD 流水线不同，Pre-commit Hook 运行在开发者的本地机器上，在代码提交之前进行检查。它的优势是即时反馈——你不需要等到代码推送到远端才知道有问题，在 `git commit` 的那一刻就能得到 AI 的审查意见。

### 基本 Pre-commit Hook

下面这个 Hook 脚本在每次 `git commit` 时自动运行。它获取暂存区的文件列表，让 Claude 快速检查有没有明显问题。如果 Claude 回复“OK”，提交正常进行；如果发现问题，提交会被阻止，并显示问题列表。注意 `--max-turns 3` 和 `--allowedTools Read,Grep` 的设置——pre-commit hook 需要快速完成，不能让开发者等太久，所以限制了执行轮次，并且只允许只读操作。

我们创建 `.git/hooks/pre-commit`。

```plain
#!/bin/bash
# Pre-commit hook: Claude Code 快速审查

# 获取暂存的文件
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

echo "Running Claude Code review on staged files..."

# 运行审查（只读工具，快速模式）
# 关键：让 Claude 用唯一 sentinel 表达"通过"，不要让它输出 "OK"——
# 因为 "OK" 是常见英语词，会在 "looks ok" / "blocked" / "okay" 等中误命中。
RESULT=$(claude -p "Quick review these staged files for obvious issues:
$STAGED_FILES

Focus on: syntax errors, security issues, obvious bugs.
Reply with 'OK' if no issues, or list the problems." \
  --output-format text \
  --max-turns 3 \
  --allowedTools Read,Grep)

# 检查结果
if echo "$RESULT" | grep -qi "OK"; then
  echo "Claude review passed"
  exit 0
else
  echo "Claude found issues:"
  echo "$RESULT"
  echo ""
  echo "Commit blocked. Fix the issues or use --no-verify to skip."
  exit 1
fi

```

然后设置权限：

```plain
chmod +x .git/hooks/pre-commit

```

### 自动生成 Commit Message

另一个实用的 Hook 是自动生成 commit message。很多开发者在写 commit message 时都很头疼——要么写得太笼统（ix bug），要么干脆放弃思考（update）。这个 Hook 可以利用 Claude 分析 diff 内容，帮我们自动生成符合 Conventional Commits 规范的 commit message。

创建 `.git/hooks/prepare-commit-msg`：

```plain
#!/bin/bash
# 自动生成 commit message

# 如果用户通过 -m 提供了 commit message，跳过
# $1 表示 commit message 的来源：message(-m)、template、merge、squash
if [ -n "$1" ]; then
  exit 0
fi

# 获取 diff
DIFF=$(git diff --cached)

if [ -z "$DIFF" ]; then
  exit 0
fi

# 生成 commit message
MESSAGE=$(claude -p "Generate a concise commit message for these changes:

$DIFF

Format: &lt;type&gt;: &lt;description&gt;
Types: feat, fix, docs, style, refactor, test, chore
Reply with ONLY the commit message, nothing else." \
  --output-format text \
  --max-turns 1)

# 将生成的 message 写入文件开头，保留 Git 的注释模板
TEMP_FILE=$(mktemp)
echo "$MESSAGE" &gt; "$TEMP_FILE"
echo "" &gt;&gt; "$TEMP_FILE"
cat "$1" &gt;&gt; "$TEMP_FILE"
mv "$TEMP_FILE" "$1"

```

### 使用 pre-commit 框架

如果你的团队使用 [pre-commit](https://pre-commit.com/) 框架来管理 Git hooks，可以将 Claude 审查集成为框架中的一个 hook。这样的好处是，hook 的安装和更新由框架统一管理，团队成员不需要手动拷贝 hook 脚本。

配置 `.pre-commit-config.yaml`：

```plain
repos:
  - repo: local
    hooks:
      - id: claude-review
        name: Claude Code Review
        entry: bash -c 'claude -p "Review staged changes for issues" --max-turns 3 --output-format text'
        language: system
        types: [python, javascript, typescript]
        stages: [pre-commit]

```

## 实战项目：完整的 CI/CD 审查系统

前面我们分别学习了 Headless 模式的各个组件——输出格式、管道集成、GitHub Actions、Pre-commit Hook。现在让我们把它们组装成一个完整的自动化审查系统。这个系统涵盖了从本地开发到远程 CI 的完整链路。

![](images/959884/dc120ec7e1a9e4c3dd49c9a99d013049.jpg)

下面的目录结构展示了一个完整的 CI/CD 审查系统需要哪些文件。 `.github/workflows/` 下是 GitHub Actions 配置， `scripts/` 下是本地审查脚本， `.git/hooks/` 下是 pre-commit hook， `CLAUDE.md` 则为所有环节提供统一的审查规范。

```plain
my-project/
├── .github/
│   └── workflows/
│       └── claude-review.yml    # GitHub Action 配置
├── scripts/
│   └── review.sh                # 本地审查脚本
├── .git/
│   └── hooks/
│       └── pre-commit           # Pre-commit Hook
└── CLAUDE.md                    # Claude 记忆文件

```

CLAUDE.md 在 Headless 模式中扮演着关键角色。无论是 pre-commit hook 还是 GitHub Actions 中的 Claude，都会读取项目根目录的 CLAUDE.md 来了解审查规范。这意味着你可以通过一份配置文件，统一所有环节的审查标准。

```plain
# 代码审查规范

## 审查重点
1. 代码质量：命名规范、DRY 原则、复杂度
2. 安全问题：输入验证、SQL 注入、XSS
3. 性能问题：N+1 查询、内存泄漏
4. 测试覆盖：关键路径必须有测试

## 输出格式
- Critical: 必须修复
- Warning: 应该修复
- Suggestion: 建议改进

## 禁止操作
- 不要修改 .env 文件
- 不要执行 npm publish
- 不要修改数据库迁移文件

```

`scripts/review.sh` 是一个独立的本地审查脚本，开发者可以在任何时候手动运行它来审查代码。它与 CI 中的审查使用相同的 Claude 能力，但运行在本地环境中。脚本包含了完整的错误处理、检查 API Key 是否设置、Claude Code 是否安装以及结果保存功能，每次审查的报告都会保存为带时间戳的 Markdown 文件。

```plain
#!/bin/bash
# review.sh - 本地代码审查脚本

set -e

TARGET=${1:-.}

# 检查 API Key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Error: ANTHROPIC_API_KEY not set"
    exit 1
fi

# 检查 Claude Code
if ! command -v claude &&gt; /dev/null; then
    echo "Error: Claude Code not installed"
    echo "Install with: npm install -g &#64;anthropic-ai/claude-code"
    exit 1
fi

echo "Starting code review for: $TARGET"

# 构建文件列表
if [ -d "$TARGET" ]; then
    FILES=$(find "$TARGET" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" \) | head -20)
else
    FILES="$TARGET"
fi

echo "Files to review:"
echo "$FILES"
echo ""

# 运行审查
PROMPT="Review the following code files:

$FILES

Analyze for:
1. Code quality and readability
2. Potential bugs and edge cases
3. Security vulnerabilities
4. Performance issues
5. Best practices violations

Provide a detailed report with file:line references."

RESULT=$(claude -p "$PROMPT" \
    --output-format text \
    --max-turns 15 \
    --allowedTools Read,Grep,Glob)

# 输出结果
echo "============================================"
echo "               REVIEW REPORT                "
echo "============================================"
echo "$RESULT"

# 保存到文件
REPORT_FILE="review-report-$(date +%Y%m%d-%H%M%S).md"
cat &gt; "$REPORT_FILE" &lt;&lt; EOF
# Code Review Report

**Date**: $(date)
**Target**: $TARGET

$RESULT

*Generated by Claude Code*
EOF

echo ""
echo "Report saved to: $REPORT_FILE"

```

【新修订内容】

下面是生产级的 GitHub Action 配置。目前这个版本增加了变更文件计数、结构化的审查 prompt、以及关键问题检测逻辑。如果 Claude 给出 `request_changes` 结论，工作流将以失败状态退出，从而阻止 PR 合并。

设计要点包括以下几条。

- Verdict 用唯一 sentinel token（request\_changes），不能用“Approved / Needs Changes / Request Changes”这种单词列表，否则 grep 会把 prompt 模板里列出的选项当成实际结论，几乎每次都误判。

- 多行变量通过 env: 传，不通过 ${​{ }​} 直接拼进 shell，避免命令注入。

- wc -l 在空 diff 时返回 1，改用 grep -c .。

- claude 失败时显式报错，不要让 set -eo pipefail 静默挂掉。

- 下游全部从 review.md 文件读，不通过 ${​{ steps.review.outputs.result }​} 把多行 markdown 拼进 shell / JS。


完整文件参见 `.github/workflows/claude-review.yml`：

```plain
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: ${ { github.workflow } }-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout&#64;v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node&#64;v4
        with:
          node-version: "20"

      - name: Install Claude Code
        run: npm install -g &#64;anthropic-ai/claude-code

      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only "origin/${{ github.base_ref }}...HEAD" || true)
          # grep -c . 在空字符串时返回 0；wc -l 会把空字符串错误地计成 1
          COUNT=$(echo "$FILES" | grep -c . || true)
          {
            echo "files&lt;&lt;CHANGED_FILES_EOF_SENTINEL"
            echo "$FILES"
            echo "CHANGED_FILES_EOF_SENTINEL"
          } &gt;&gt; "$GITHUB_OUTPUT"
          echo "count=$COUNT" &gt;&gt; "$GITHUB_OUTPUT"

      - name: Run Claude Review
        id: review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          # 通过 env 传变量，避免 ${{ }} 直接拼进 shell 导致命令注入
          CHANGED_FILES: ${{ steps.changed.outputs.files }}
          CHANGED_COUNT: ${{ steps.changed.outputs.count }}
        run: |
          PROMPT="Review this Pull Request.

          ## Changed Files (${CHANGED_COUNT} files)
          ${CHANGED_FILES}

          ## Review Focus
          1. Code Quality: clean code, naming, DRY
          2. Bugs: edge cases, error handling
          3. Security: input validation, secrets, injection
          4. Performance: inefficient code

          ## Output Format

          ### Summary
          [1-2 sentence overview]

          ### Issues Found
          - 🔴 Critical: &lt;file&gt;:&lt;line&gt; — &lt;description&gt;
          - 🟡 Warning: &lt;file&gt;:&lt;line&gt; — &lt;description&gt;
          - 🔵 Suggestion: &lt;file&gt;:&lt;line&gt; — &lt;description&gt;

          ### Verdict
          Output EXACTLY ONE sentinel token on its own line — do not echo
          the option list:
          &lt;VERDICT&gt;approved&lt;/VERDICT&gt;
          &lt;VERDICT&gt;needs_changes&lt;/VERDICT&gt;
          &lt;VERDICT&gt;request_changes&lt;/VERDICT&gt;"

          if ! claude -p "$PROMPT" \
            --output-format json \
            --max-turns 10 \
            --allowedTools Read,Grep,Glob &gt; review.json 2&gt; claude.err; then
            echo "::error::Claude command failed"
            cat claude.err
            exit 1
          fi

          if ! jq empty review.json 2&gt;/dev/null; then
            echo \"::error::review.json is not valid JSON\"
            cat review.json
            exit 1
          fi

          jq -r '.result // empty' review.json &gt; review.md
          if [ ! -s review.md ]; then
            echo \"::error::Claude returned empty result\"
            cat review.json
            exit 1
          fi

      - name: Post Review Comment
        uses: actions/github-script&#64;v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            // 把 verdict sentinel 从 PR 评论里隐藏，纯展示用
            const visible = review.replace(/&lt;VERDICT&gt;[^&lt;]+&lt;\/VERDICT&gt;/g, '').trim();
            const body = [
              '## 🤖 Claude Code Review',
              '',
              visible,
              '',
              '---',
              '*Automated review by Claude Code*'
            ].join('\n');
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body,
            });

      - name: Enforce verdict
        run: |
          # 用唯一 sentinel token 判断，不会和 prompt 模板字符串冲突
          if grep -q "&lt;VERDICT&gt;request_changes&lt;/VERDICT&gt;" review.md; then
            echo "::error::Code review verdict: request_changes"
            exit 1
          fi
          if grep -q "&lt;VERDICT&gt;needs_changes&lt;/VERDICT&gt;" review.md; then
            echo "::warning::Code review verdict: needs_changes (non-blocking)"
          fi

```

> **勘误**：本讲早期版本的这个示例用“Approved / Needs Changes / Request Changes”做 verdict，再用 `grep -qF "Request Changes"` 判定，结果 grep 把 prompt 模板里列出的选项也当成结论，导致 workflow 几乎每次都被自己的 verdict 检查触发 exit 1。感谢 Geek\_122fe2 朋友的 bug 报告。

## 安全与成本控制

在 CI/CD 中运行 AI 代理，安全是绕不开的话题。与人类开发者不同，AI 代理不会主动判断“这个操作是否安全”，它只会尽力完成你给它的任务。所以安全的责任在配置端——你需要通过参数和权限设置，确保 Claude 只能做你允许它做的事。

根据 [eesel.ai 的指南](https://www.eesel.ai/blog/claude-code-automation)，在 CI/CD 中运行 Claude Code 时应该限制权限。 **最小权限原则** 的核心思想是：只给 Claude 完成任务所需的最少权限，不多给一分。对于只读审查任务，只允许 Read、Grep、Glob 三个工具就够了；如果不需要执行任意命令，明确禁用 Bash 工具；对于简单任务，限制执行轮次以防止无限循环。

```plain
# 只读操作
claude -p "分析代码" --allowedTools Read,Grep,Glob

# 禁用危险工具
claude -p "任务" --disallowedTools Bash

# 限制执行轮次
claude -p "快速任务" --max-turns 3

```

API Key 是访问 Claude 服务的凭证，泄露它意味着别人可以用你的账号消耗 API 额度。在 CI/CD 配置中， **永远不要硬编码 API Key**，而是使用平台提供的 Secrets 管理机制。

```plain
# 不要这样做
env:
  ANTHROPIC_API_KEY: "sk-ant-xxx"  # 硬编码

# 正确做法
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

```

[Skywork AI 的指南](https://skywork.ai/blog/how-to-integrate-claude-code-ci-cd-guide-2025/) 中有这样的警告：

> 在 CI/CD 流水线中使用无人监督的 Claude Code 自动化的主要风险是：AI 可能引入细微 Bug、误解核心目标，或在尝试完成任务时增加技术债务。最好从有监督的任务开始，并在让 AI 对生产代码库进行无监督修改之前加入人工审查步骤。

这段警告值得反复阅读。AI 代理在无人监管环境中的最大风险不是“做错事”，而是看起来做对了，但引入了微妙的问题。一个 AI 自动修复的 Bug 可能通过了所有现有测试，但在某个边缘条件下引入了新的问题。比如 AI 可能自动“优化”了一段缓存逻辑，代码更简洁了，也通过了所有测试。但它不小心去掉了一个过期清除的判断逻辑，结果缓存数据长期不更新，线上就会悄悄变脏。

建议采用渐进式采纳策略。

1. **从只读开始**：先让 Claude 只做审查，不做修改。

2. **人工审批**：Claude 的修改建议需要人工确认后才能合并。

3. **限制范围**：不要让 Claude 自动修改核心业务逻辑。

4. **审计日志**：记录所有 Claude 的操作。


![](images/959884/56cd235f412dab9b4a0cfb5c07966966.jpg)

每次 CI 运行都会消耗 API tokens，而 tokens 意味着真金白银。在高频迭代的项目中，如果每次推送都触发完整的 AI 审查，成本可能会快速累积。通过合理的触发条件和并发控制，可以在保持审查覆盖率的同时有效控制成本。

```plain
# 只在特定条件下运行
on:
  pull_request:
    types: [opened]  # 不包括 synchronize，减少运行次数
    paths:
      - 'src/**'     # 只在 src 目录变更时运行

# 限制并发
concurrency:
  group: claude-${{ github.event.pull_request.number }}
  cancel-in-progress: true

```

## 其它 CI 平台集成

虽然 GitHub Actions 有官方支持，但 Headless 模式可以在任何 CI 平台上工作。因为 Headless 模式的本质就是命令行调用——只要平台能运行 `npm install` 和 `claude -p`，就能集成。下面是三个主流 CI 平台的配置示例。

**GitLab CI：** GitLab CI 使用 `.gitlab-ci.yml` 配置文件，语法与 GitHub Actions 的 YAML 不同但概念相似。注意变量引用方式的差异——GitLab 使用 `$VARIABLE_NAME`，而不是 GitHub 的 `${​{ secrets.VARIABLE_NAME }​}`。

```plain
claude-review:
  image: node:20
  script:
    - npm install -g &#64;anthropic-ai/claude-code
    - claude -p "Review the changes in this MR" --output-format text
  variables:
    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY
  only:
    - merge_requests

```

**CircleCI：** CircleCI 使用 `config.yml`，放在 `.circleci/` 目录下。它的配置结构是 jobs -> steps，与 GitHub Actions 的 jobs -> steps 概念对应。

```plain
version: 2.1
jobs:
  review:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run:
          name: Install Claude Code
          command: npm install -g &#64;anthropic-ai/claude-code
      - run:
          name: Run Review
          command: |
            claude -p "Review this code" --output-format text
          environment:
            ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}

```

**Jenkins：** Jenkins 使用 Groovy DSL 定义 Pipeline，风格与上面两个 YAML 驱动的系统截然不同。但核心逻辑是一样的，安装 Claude Code，设置环境变量，运行 headless 命令。

```plain
pipeline {
    agent any
    environment {
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }
    stages {
        stage('Review') {
            steps {
                sh 'npm install -g &#64;anthropic-ai/claude-code'
                sh 'claude -p "Review this code" --output-format text'
            }
        }
    }
}

```

## 总结一下

这一讲我们学习了 Claude Code 的 Headless 模式，让 AI 助手在无人值守的情况下自动工作。

Headless 模式的核心是 `-p` 标志。它告诉 Claude Code 不要打开交互界面，直接执行任务并输出结果。配合 `--output-format` 可以选择 text、json 或 stream-json 三种输出格式，分别适用于人类阅读、程序解析和实时监控。

Claude Code 的一个独特优势是它能无缝融入 Unix 管道。你可以用 `cat file | claude -p "分析"` 将文件内容传给 Claude，也可以将 Claude 的输出通过管道传给其他工具。这种设计让 Claude 成为你工具链中的一环，而不是一个孤立的应用。

GitHub Actions 是 Headless 模式最常见的应用场景。Anthropic 提供了官方 Action，支持 @claude 提及触发和自动化 prompt 两种模式。通过配置工作流，你可以实现 PR 自动审查、lint 错误自动修复、文档自动生成等功能。

安全是 CI/CD 集成的关键考量。应该限制 Claude 可用的工具（用 `--allowedTools`）、控制执行轮次（用 `--max-turns`）、使用 Secrets 管理 API Key，并在让 Claude 自动修改代码前加入人工审查步骤。

Headless 模式让 Claude Code 从一个“需要人坐在终端前”的工具，进化为可以 7x24 小时自动工作的智能助手。开篇故事中，那个跨时区团队的 PR 审查周期从 36 小时缩短到 8 小时，正是这种进化的体现。

最后说个题外话（但我们在工程里要引起重视），最近发生的源码泄露事件，再次提醒我们，CI/CD发布管道是安全链中最薄弱的环节。面对“无人值守”的诱惑，要有设计完善的、真正启用的防护和审核机制兜底。更多关于这个热点事件的启示和架构探讨，可以移步去看我这周三发布的 [加餐](https://time.geekbang.org/column/article/963248)，期待你在评论区分享交流。

## 思考题

1. 你的团队有哪些重复性的代码审查任务可以用 Headless 模式自动化？试着列出三个具体场景，并为每个场景设计 `--allowedTools` 和 `--max-turns` 的参数组合。

2. 如果 Claude 在 CI 中自动修复了一个 Bug，但修复方式不是最优的，你会如何处理？请从流程设计的角度思考，如何在“自动化效率”和“代码质量控制”之间找到平衡点。

3. Headless 模式不保存会话状态。如果你需要在多个 CI 步骤之间保持上下文（例如第一步分析代码，第二步根据分析结果生成测试），你会怎么设计？提示：考虑 `--session-id` 参数和文件系统中间状态的组合使用。

4. 对比 Pre-commit Hook 和 GitHub Actions 两种集成方式的优缺点。在什么场景下你会选择只用其中一种？在什么场景下你会同时使用两种？


## 下一讲预告

Headless 模式解决了无人值守的问题，但这背后藏着一个更尖锐的问题： **没人盯着的时候，谁来定规矩？**

下一讲，我们将深入 **Rules 规则系统**——Claude Code 中两种截然不同的规则：写在 CLAUDE.md 和 `.claude/rules/` 里的 **指令规则** 是软约束，引导 Claude 的行为风格；写在 settings.json 里的 **权限规则** 是硬约束，在客户端强制执行。一个是员工手册，一个是门禁系统。理解它们的区别和协同，是构建可靠 AI 工作流的关键。

欢迎你在留言区参与讨论，如果这节课对你有启发，别忘了分享给身边更多朋友。