# 17 | 编排机制：模型驱动Workflow与固定策略Ralph

你好，我是张嘉熙。

上一讲我们讲了一个 agent 怎么把活横向委派给子 agent 去干。可当活不再是能各自独立干的一批子任务，而是要把多个步骤按特定顺序、并发或循环地串成流程才能干完时，谁来做这层流程编排、又怎么做？

dsh 内置了两条路：Workflow 让模型现写脚本、自由编排，Ralph 把脚本写死在工具里、模型只传一个目标。两条路都靠同一个编排引擎跑脚本。要看清这一讲的内容，需要回答四个问题：

- 编排引擎是什么？

- Workflow 怎么编排？

- Ralph 怎么编排？

- Workflow 与 Ralph 有什么差异？

```bash
关于环境：本讲机制上新增四个包：@deepseek-ai/dsh-workflow（编排引擎 seam，
ctx.workflowEngine）、@deepseek-ai/dsh-workflow-worker-thread（编排引
擎实现）、@deepseek-ai/dsh-tool-workflow + @deepseek-ai/dsh-tool-
ralph（两个面向模型的编排工具）。示例还要子 agent 真去数文件 / 写工作区，得挂
bash 工具链：dsh-subprocess → dsh-subprocess-local → dsh-shell →
dsh-bash-local → dsh-shell-env → dsh-tool-bash；联网调真模型要 dsh-
llm-deepseek 及其 peer 依赖 dsh-credentials / dsh-anonymous-user-id /
dsh-launch-environment。npm install --legacy-peer-deps 一次装齐。
关于示例：npm run start:ch17:workflow 让模型现场写脚本派子 agent，npm run
start:ch17:ralph 让模型传目标跑写死的循环。两个示例都联网调真实模型，先
export DEEPSEEK_API_KEY=... 再跑；模型输出每次不同，所以文档里的输出块都标
```

- 注为“示例输出”。

### 编排引擎是什么：编排脚本的执行环境

```
ctx.workflowEngine（编排引擎）执行编排脚本：吃进脚本，吐出它 return 的值。它
下连 ctx.subagents（16 讲讲过，真正启动子 agent）；上接 workflow / ralph 两个面
```

向模型的工具，模型调用它们，它们再把脚本传给引擎。

```
Workflow 和 Ralph 共用一套引擎，引擎不区分“这是 Workflow 还是 Ralph”，只按 start()
```

收到的脚本和参数执行、吐返回值，根本不关心脚本是谁写的。两者的差别全在工具层怎么调

```
start()：Workflow 传模型现写的脚本，Ralph 传写死的 RALPH_SCRIPT。引擎对两者一视
```

同仁，所以一套引擎就够。

```
编排脚本跑在一个沙箱里：vm 模块造出的一个空 JavaScript 执行环境（里面没有 fs / net /
fetch / timers 这些 Node.js 自带能力），所以碰不到文件、网络；注意：这层隔离只是剥
```

夺了脚本随手能碰的能力、不是安全墙，不等于绝对安全。它和 07 讲的进程沙箱也不是一回

```
事：07 管的是子进程对文件系统的改动，只拦写、不拦读、不管网络；vm 管的是脚本能碰哪
```

些 Node 能力；两者都是弱隔离，都不是安全墙。脚本能对外打交道的门只有下面这几个原语：

原语

- 语义

- 启动一个子 agent，返回它的最终文本；若带 schema，返回

agent(prompt, opts?)

- 结构化对象而非纯文本

- 并发跑一组无参数函数、结果收成数组；像一道屏障，等所

parallel(thunks)

- 有任务都跑完才继续

- 把一组条目依次送过若干个阶段函数（前一个阶段的输出传

pipeline(items, ...stages)

- 给下一个阶段）

- 给脚本的叙述标一个章节标题；只写进运行事件流、不回喂

phase(title)

- 给模型，也不派活

- 给脚本的叙述追加一行文字；同样只写进运行事件流、不回

log(text)

- 喂给模型，也不派活

```
其中 agent() 派出去的子 agent 是完整 agent，照样能读写文件、访问网络，只有脚本受
```

限，派出去的子 agent 不受这个限制。

```
编排引擎对外只有一个入口 start(request)，传进去的 request 是这些字段：
```

字段

- 必填作用

script

- 是要执行的脚本

meta

- 脚本的元信息（name、description 等）是

- t 都归属它（16 讲的t）并继承工作目录每个子

```
start 返回一个 WorkflowRun（运行句柄），await 它的 result 就行，不用
try/catch：失败不会抛异常，而是记在结果里。result 的字段：
```

字段

- 含义

- 脚本 return 的值（只有 completed 时才有意义），必须是纯 JSON

value

- （不能带函数、类实例或循环引用）

stopReason

- 为什么停：completed / cancelled / error

error

- 非 completed 时的失败信息

agentsStarted

- 这次一共启动了几个子 agent

### Workflow 怎么编排：模型现写脚本

```
Workflow 是模型驱动的那条路：模型现场写一段脚本、传给 workflow 工具，编排逻辑全在
```

脚本里。

```
Workflow 示例取了个最小任务：运行时在系统临时目录（os.tmpdir()）下新建一个
ch17-workspace-* 目录、往里放好 src（5 个文件）和 docs（3 个文件），提示词让
```

- 模型派两个子 agent 各数一个目录，实际路径运行时会打印在控制台。注意：真实场景Workflow 面向更大规模，一两项委派用普通 subagent 就够。

```
workflow-demo.ts 给模型的提示词就一句：
```

```
请用 workflow 工具写一段脚本：派两个子 agent，一个统计 src 目录里的文件数、一个统计 docs 目录
模型据此调了 workflow 工具，传的参数长这样，本次传 script 和 meta，args 可选没
```

传：

```json
{
 "meta": {
   "name": "count-src-docs-files",
   "description": "Fan out two subagents to count files in src/ and docs/ …",
   "whenToUse": "…",
   "phases": [
     { "title": "count-directories", "detail": "…" },
     { "title": "aggregate", "detail": "…" }
   ]
 },
 "script": "（脚本正文，见下文）"
}
工具内部调 workflowEngine.start() 时，引擎实际收到的 request 长这样，其中
script/meta 原样转、parent/signal 由工具补：
{
 "script": "（同模型传的 script）",
 "meta": "（同模型传的 meta）",
 "parent": "（当前调用 workflow 工具的 agent）",
 "signal": "（取消信号）"
}
script 的正文展开是下面这段，它就是普通 JavaScript，以顶层 await 的方式执行，所以
可以 await 子 agent 的结果、最后 return 汇总；它只干两件事：一是用 agent() 派活，
```

二是把这些活编排起来。

官方说得直白：“the agents do the work, the script only coordinates them”。

注意：这里只留关键骨架，失败兜底等次要部分省略：

```javascript
*// 模型写的脚本。ROOT 是它把工作区目录写死成的绝对路径
const ROOT = '/tmp/ch17-workspace-xxx'
// 让子 agent 返回一份对象（结构化输出），而不是一段话
const countSchema = {
 type: 'object',
 properties: {
   fileCount: { type: 'number' },  // ← 脚本最后要的"文件数"
   // … 还有 directory / exists / sampleFiles / method
 },
}
function countPrompt(dir) {  // 教子 agent：用 find 数文件、别猜
 return `Count the regular files under "${ROOT}/${dir}" …`
}
// 编排核心：parallel() 并发跑这两个 agent()，各自派一个子 agent
const [src, docs] = await parallel([
 () => agent(countPrompt('src'), { schema: countSchema }),  // schema → 子 agent
 () => agent(countPrompt('docs'), { schema: countSchema }),
])
// … 汇总（真实脚本还有失败兜底：子 agent 失败变 null → 记 agentFailed；还会拼 summary 等
**return { totalFiles: src.fileCount + docs.fileCount, perDirectory: [src, docs]
```

运行后（示例输出）：

```
--- 子 agent 内部：每一步都留在它自己的会话里 ---
子 agent #1（会话 …）
 第 1 步：等模型回话
   调工具 bash({"command":"find \"…/src\" -type f | wc -l", …})
   工具返回：5
 第 2 步：等模型回话
   调工具 bash({"command":"find src -type f | head -5 …", …})
   工具返回：src/sub/deep/nested.rs、src/utils.py、src/lib/io.py、src/lib/core.py、
 第 3 步：等模型回话
   调工具 structured_output({"directory":"src","exists":true,"fileCount":5,"sampl
   工具返回：Structured output recorded.
子 agent #2（会话 …）
 第 1 步：等模型回话
   调工具 bash({"command":"find \"…/docs\" -type f | wc -l", …})
   工具返回：3
 第 2 步：等模型回话
   调工具 structured_output({"directory":"docs","exists":true,"fileCount":3,"samp
   工具返回：Structured output recorded.
--- 编排结果（脚本 return 的值）---
workflow "count-src-docs-files" completed (2 agents).
Return value:
{
 "perDirectory": [
   { "directory": "src", "fileCount": 5 },
   { "directory": "docs", "fileCount": 3 }
 ],
 "totalFiles": 8,
 "summary": "src/ has 5 files, docs/ has 3 files, total 8 files."
}
```

为省篇幅这里只留关键字段。return 的具体字段由模型写的脚本决定、每次不同，上面是某次

```
示例，常见字段如 fileCount / perDirectory / totalFiles / summary 等。
Workflow 的核心：编排是模型现写的一段脚本，脚本里用 agent() 派活、
parallel()/pipeline() 编排。比如“并发审查这 10 个文件”，它会写 parallel() 一次
派十个；“先审计再修复”，它会写 pipeline() 串起两个阶段。
```

### Ralph 怎么编排：工具写死脚本

```
Ralph 是另一条路：编排脚本写死在 ralph 工具的源码里（@deepseek-ai/dsh-tool-
ralph 包顶部的 RALPH_SCRIPT 常量），模型改不了它，只能传一个不可变目标
（objective）和轮次上限（maxRounds）。这个脚本每轮把目标交给一个全新子 agent。
```

注意，Ralph 不是 15 讲的 Goal：Goal 是单个 agent 围绕目标续跑，Ralph 是每轮换一个全新子 agent、跨轮接力。

```
“Ralph”这个名字的来源，官方没明说，但官方术语 Ralph loop 强调每轮全新子 agent，
```

- 合理推测对应 Geoffrey Huntley 提出的 Ralph Loop（拉尔夫循环，取自《辛普森一家》里那个笨拙却执着的 Ralph Wiggum），核心是“每轮重置上下文、锲而不舍地重跑”。

```
ralph-demo.ts 给模型的提示词就一句：
请用 ralph 工具：目标是把本次示例整理成一份要点笔记写进工作区；请显式传 maxRounds=2。
模型据此调了 ralph 工具，传的参数长这样，本次传 objective 和 maxRounds：
{
 "objective": "在工作区写出一份中文要点笔记 NOTES.md……",
 "maxRounds": 2
}
工具内部调 workflowEngine.start() 时，引擎实际收到的 request 长这样，其中
script 写死、args 装模型传的东西：
{
 "script": "RALPH_SCRIPT（写死的循环脚本，见下面骨架）",
 "meta": { "name": "ralph-loop", … },
 "parent": "（当前调用 ralph 工具的 agent）",
 "args": { "objective": "在工作区写出一份中文要点笔记 NOTES.md……", "maxRounds": 2, "m
 "subagentProvider": "spawn",
 "maxTotalAgents": 2,
 "signal": "（取消信号）"
}
注意：meta 也和 script 一样是写死的 RALPH_META，其中 name 固定 ralph-loop，不
```

是模型传的。

```javascript
下面是 RALPH_SCRIPT 的关键骨架：
*// 写死在 ralph 工具里的循环脚本（RALPH_SCRIPT 关键骨架）
const reportSchema = { /* … status: continue|complete|blocked 三选一 */ }
let previous  // 上一份交接（第一轮是 undefined）
for (let round = 1; round <= args.maxRounds; round++) {
 const prompt = [
   'You are one fresh worker … no parent conversation and no prior child session
   'Immutable objective:\n' + args.objective,          // 模型传的不可变目标
   'The shared workspace … is the long-term memory and source of truth',  // 共享
   'Previous structured handoff:\n' + (previous === undefined ? '(none — this is
   // …（其余次要文案省略）
 ].join('\n\n')
 const report = await agent(prompt, { schema: reportSchema })  // agent() 原语：派
 if (report.status === 'complete') return { status: 'complete', roundsStarted: r
 if (report.status === 'blocked') return { status: 'blocked', roundsStarted: rou
 // … 子 agent 失败（agent() 返回 null）→ 转成 round-failed 返回（此处省略）
 previous = report  // continue：这份报告作为下一轮的交接
}
**return { status: 'budget-limited', roundsStarted: args.maxRounds, report: previ
```

运行后（示例输出）：

```
--- 模型传了什么（ralph 工具收到的参数）---
 {"objective":"在工作区写出一份中文要点笔记 NOTES.md……","maxRounds":2}
--- 每一轮：开一个全新子 agent，它内部发生了什么 ---
第 1 轮的子 agent（会话 …）
 第 1 步：等模型回话
   调工具 bash({"command":"pwd; ls -la; …","description":"Inspect workspace…"})
   工具返回：…（工作区里还没有 NOTES.md）
 第 2 步：等模型回话
   调工具 bash({"command":"cat > NOTES.md <<'EOF' … EOF", …})
   工具返回：written（NOTES.md 写入成功）
 第 3 步：等模型回话
   调工具 structured_output({"status":"complete","summary":"已创建 NOTES.md……","ev
   工具返回：Structured output recorded.
--- 收手：ralph 工具返回的终态 ---
 Ralph worker reported completion after 1 round.
 Final report:
 { "status": "complete", … }
--- 共享工作区里留下了什么（每轮都写进这一份）---
 NOTES.md：
   # 本次示例要点笔记
   …
```

对着这个输出逐条看，Ralph 的机制就清楚了。这个示例的目标一轮就能完成，所以只跑 1 轮

```
就 complete 收手；多轮才看得到的机制，比如每轮换新、跨轮交接，输出里看不到，要看
脚本骨架，每轮重开一个全新子 agent，把上一轮的 report 作为 previous 交接给下一
```

轮：

```
传入什么：模型只传了目标（objective）和轮次上限（maxRounds）。
```

- 每轮一个全新子 agent：脚本每轮都开一个新子 agent，谁也不继承谁。为什么偏要全新？因为让同一个子 agent 带着完整历史跑，上下文会越滚越大、越滚越杂、越跑越偏。

- 跨轮只靠两样：共享工作区 + 交接，并排看最清楚：

对比

- 共享工作区交接

- 每轮传的结构化报告（status / summary / evidence /共用的工作目录 cwd

是什么

- nextSteps / blocker）

作用

- 存实际产物（跨轮保留）报上一轮情况

可信度

- 事实来源自报（需核实）

- maxHandoffChars（字符数）

上限

- 无

```
最后成功完成：这次第 1 轮就报了 complete，循环立刻收手，工具返回 Ralph worker
reported completion after 1 round。
只跑一轮并不奇怪：maxRounds=2 是轮次上限（保险丝），不是“必须跑满”，模型一轮判断目
标已完成就报 complete 收手，这正是 Ralph 与“手动派 subagent”的区别，收手由写死的循
```

环判定，而非你逐轮手动决定。想亲眼看多轮接力，把目标设成一轮完不成的任务，或把

```
maxRounds 调到小于任务所需轮数、让轮次耗尽触发 budget-limited 终态即可。
```

Ralph 的核心：编排是写死在工具里的一段脚本，模型只传一个目标。无论目标换成什么，脚

```
本都是同一个 for 循环，每轮派一个全新子 agent、靠共享工作区 + 交接跨轮，反复推进。
```

### Workflow 与 Ralph：差异对比

- Workflow

对比维度

- 模型写的 script（脚本）+ meta（元信息

模型传什么

- （脚本参数，可选）

- 模型自由编排：agent() / parallel() / pip

编排逻辑

- 便组合

子 agent 怎么派

- 脚本里 agent() 按需派

子 agent 是否带历史

- 默认 spawn（空历史），可换 fork（带父

跨轮记忆

- 无（脚本一次跑完，不迭代）

- 子 agent 失败，agent() 返回 null，脚本

失败处理

工具返回值（同为 { runId, agentsStarted, result }）

- result 是脚本 return 的纯 JSON

- 一批彼此独立的子任务，一次编排完，子

适用任务

- （官方例子：审计多文件、迁移、多角度性验证）

- 明确要 workflow 或大规模编排时才用

使用策略

- subagent 就够，16 讲）

说到底，两者是两条不同的路：Workflow 把编排交给模型现场写，Ralph 把编排写死在工具

```
里。前者每次重新生成，后者永远不变，变的只是 objective 和 maxRounds，表里其余维
```

度都是这两条路各自的展开。

### 本讲小结

```
两种编排机制都建立在 16 讲的 subagent 之上：脚本里每一次 agent()，底层就是一次
```

subagent 委派，只是由一段脚本驱动，Workflow 的脚本是模型现写的、Ralph 的脚本是写死的循环，而非模型逐轮手动委派。两者是并列、不是嵌套关系，能同时装上、模型按需调用。

```
Workflow 是模型驱动的动态编排策略：模型现场写脚本，用 agent() 原语派活、
parallel() / pipeline() 原语编排，灵活、通用；代价是依赖模型、每次不同难评审。
Ralph 是写死的固定策略：脚本写死在 RALPH_SCRIPT 里，模型只传 objective +
maxRounds，每轮用 agent() 原语派一个全新子 agent；跨轮只靠两样：共享工作区（长期
```

记忆）+ 交接（报告传递），朝一个目标反复迭代，每轮干净重启，不会越跑越偏；代价是不能一次派多个子 agent 并行、完成只靠子 agent 自报（无独立评估）。

```
这背后真正的变化是，编排引擎统一封装：workflowEngine 把“怎么跑编排脚本”统一封装
```

一次，Workflow / Ralph 共用这一套，不用各自重造。编排引擎与编排策略解耦：编排策略（脚本）由工具决定，加新工具不用改编排引擎。

加上前面几讲，编排篇收口了：AgentLoop 让一个 agent 跑起来，Preset 定它的工具与人设，Goal 让它自己续跑，Subagent 让它委派子 agent，Workflow / Ralph 把多个子 agent 编排起来。

下一讲进入新的实战篇：构建规则自进化系统，从用 DSH 扩展点搭规则引擎开始，一路走到让 Agent 从异常请求里长出候选规则、评测确认后形成闭环。

注：本讲 GitHub 链接

### 思考题

动手实操：两个示例各对应一个文件，直接改代码、重跑验证。

```
Workflow（workflow-demo.ts）：把提示词改成“请用 workflow 工具写一段脚本：顺序
```

- 地数，先派一个子 agent 统计 src 的文件数，把结果拼进下一个提示，再派一个子 agent

```
统计 docs 的文件数，最后汇总返回”，重跑 npm run start:ch17:workflow，对比这
```

- 一回写出的脚本和上一回并行版的差异。

```
Ralph（ralph-demo.ts）：把提示词里的目标从“把本次示例整理成一份要点笔记写进工
作区”改成“数一下工作区根目录有几个文件、把结果写进 count.txt”，重跑 npm run
start:ch17:ralph。注意终态应该还是第 1 轮就 complete，变的是子 agent 内部调
```

- 的命令，这次去数文件、写 count.txt，而非写 NOTES.md。这正说明 Ralph 的循环脚本一行没改，换目标只是换子 agent 要干的活，循环本身（每轮全新子 agent、跨轮交接、收手判定）完全不变。

欢迎把你的运行结果分享出来。如果你觉得这节课对你有帮助，也欢迎分享给其他朋友，我们下节课再见！
