# 13 | 装配与驱动：Agent与AgentLoop

你好，我是张嘉熙。

核心篇（第 05–12 讲）讲的是 dsh 会什么，编排篇讲的是怎么在 dsh 里把这些能力编排起来。这一讲先做第一步：把本讲要装的六个包组装成一个 Agent，再驱动起来。

- 在 dsh 里，Agent 是怎么组成的？

- 组装好之后，从哪一刻算一个 Agent？

- 一个轮次是怎么跑的？

- 循环怎么一轮轮跑下去？

前两问管装配，装出来的是 Agent；后两问管驱动，靠的是 Agent Loop。这一讲就按这个顺序往下走：先装 Agent，再装上 Agent Loop，让它自己跑起来。

```
关于环境：本讲新增两个包：@deepseek-ai/dsh-agent-loop（循环驱动，具体实现）
和 @deepseek-ai/dsh-settings（它的 peer 依赖），已加入本项目的
package.json，npm install --legacy-peer-deps 装上即可。注意 peer 依赖必
须显式写进 package.json，漏了会报 ERR_MODULE_NOT_FOUND，dsh-settings 正是
```

- 这种。

```
关于示例：npm run start:ch13 跑一次完整轮次（含一次工具调用）与两轮之间的衔
```

- 接。示例用一个按脚本回答的假模型适配器，不需要任何 API Key。

### Agent 的组装：六个包的装配与 Agent 构成

第一个问题：在 dsh 里，Agent 是怎么组成的？

```
本讲要装的六个包见下表，每个包装好后会在 ctx 上挂一个服务（最后一列）。简洁起见我们
统一省略前缀：包 dsh-llm 与其引用 ctx.llm 都写作 llm，dsh-agent-loop 与
ctx.agent-loop 都写作 agent-loop。两者的对应关系见下表：
```

包名

- 职责引用方式

dsh-llm

- 把请求发给模型、把响应流成 chunkctx.llm

dsh-session

- ctx.sessions会话日志：每一步都记进只追加的日志

dsh-system-prompt

- ctx.systemPrompt组装请求前缀（人设、提示词段落、工具表）

dsh-tools

- ctx.tools工具注册表与分发流水线

dsh-agent

- Agent 接口 + 注册表 + agent/* 事件词汇ctx.agents

dsh-agent-loop

- ctx.agentLoop驱动器：唯一含循环逻辑的包

```
最后两行要合起来看：dsh-agent 提供 Agent 的接口、注册表与事件词汇，不含循环逻辑；
跑循环的是 dsh-agent-loop，它是 dsh 里唯一含循环逻辑的包。两者是单向依赖，
agent-loop 用 dsh-agent 的接口与事件词汇（源码里直接 import 它），反过来 dsh-
agent 不依赖循环。
六个包各自把自己注册成一个 ctx.* 服务，谁需要谁就在插件上声明依赖。agent-loop 依赖
哪几个服务，npm run start:ch13 的第一段就会把这份清单打出来。
组装一个运行环境，代码就是这一串：ctx.plugin() 一次装一个插件（插件由对应的包导
```

出），注释标注的是它挂上来的引用方式：

```javascript
const ctx = new Context()
await ctx.plugin(LlmRuntime)        // ctx.llm
await ctx.plugin(SessionStore)      // ctx.sessions
await ctx.plugin(SystemPrompt, {})  // ctx.systemPrompt
await ctx.plugin(ToolRuntime)       // ctx.tools
await ctx.plugin(AgentRegistry)     // ctx.agents
await ctx.plugin(AgentLoop, { agents: [] })  // ctx.agentLoop
```

这个顺序只是自然的写法，不强制。inject 声明的依赖由框架持续跟踪，服务没就绪时插件会先挂起、等它上线才激活（第 2 讲的响应式依赖），所以调换次序也能跑通。

```
六个插件装好，这台机器就就绪了；往注册表（ctx.agents）里登记一个 agent，它就能跑
起来。先看这个 agent 身上有什么：核心的五样（其中 agent.status 和 agent.inbox
后面讲循环时会再碰到；另有 agent.options 记它用哪个 provider／model，本讲不涉
```

及）：

组成部分

- 含义

- agent 的身份，与它的会话共用同一个 SessionId（不一致会

一个id agent id

```
以上是 agent 身上带的数据。再看 agent 能干什么。Agent 接口本身很小，值得整个记住，
```

后面几讲都是靠这几个方法去驱动 agent 的：

方法

- 作用

agent.followup(message)

- 排下一轮，等当前轮次跑完再开；会唤醒 agent

- 本轮内插一步，下次请求前生效；只在闲着时唤醒

agent.steer(message)

- （已经在跑就直接插到下一步）

agent.inject(message)

- 往上下文补一条；不唤醒 agent

- followup / steer / inject 的统一形式；target 指定进哪

agent.send(message, target, wakeup)

- 条队，wakeup 决定是否唤醒

agent.cancel(cause, options?)

- 中止 agent 的运行；方法名是 cancel，不是 abort

- 返回 Promise，等 agent 把手里的活干完、真正闲下

agent.whenIdle()

- 来才 resolve；判断"跑完"要用这个方法，不能靠猜

- 借 agent 的驱动上下文执行一个维护任务；第 10 讲

agent.runMaintenance(task)

- 的 compactNow 就走这条路

```
上面七个方法里，前三个最容易记混——followup 排下一轮，steer 插下一步，inject
```

只补上下文、不唤醒。

### Agent 的生灭：announce 时诞生，disposed 时退场

第二个问题：组装好之后，从哪一刻算一个 Agent？

日常有两条入口，都能让它诞生：

```
写业务用 agents.create(options)：交给注册的 factory 去构造（不走 register）：
setup、enter(agent, owner)、announce(agent)、启动循环一并做完，返回
AgentHandle；agent 就在 announce(agent) 发出 agent/created 的那一刻诞生。
手上已经有一个 agent 对象时，用 register(agent)：它拆开是两下：enter(agent,
owner) 只把它登记进注册表，外界还不知情；announce(agent) 发出
agent/created，对外宣告它诞生。
两条路殊途同归，都是 enter(agent, owner) 之后 announce(agent)，区别只在谁去
调：create 由 factory 在内部调，register 是你自己调。而让它诞生的始终是后一步——
announce() 那一声 agent/created。
```

诞生只是第一环：整条生命线，示例一次打全。

```
--- 注册表：agent 不止一条，得知道自己在问谁 ---
 ctx.agents.list()：1 个 agent
 ctx.agents.roots()：1 个（没有父级的那些）
 ctx.agents.get('sess-loop') 就是它本人：true
...
--- 收尾：只拆循环这一个 fiber，看 agent 怎么退场 ---
 生命周期事件：created(sess-loop) → session-start(source=startup) → disposed(sess-
 ctx.agents.list()：1 → 0
后半段那串 created → session-start → disposed，就是它的生命周期：三个一次性
的里程碑（注意，没有配对的 session-end：收尾就发 disposed）。agent/status 则
在 idle 与 running 之间来回切换，前面每轮日志末尾的 running → idle 就是它。四个
```

事件分别在什么时候发、意味着什么，看这张表：

事件

- 什么时候发含义

agent/created

- announce(agent) 时它正式诞生

agent/session start

- 第次真要跑之前它要开始干活了

```
disposed 的次序：让循环停下来 → 撤销这个 agent 注册的东西（工具、提示词、监听器，
就是前面 agent.ctx 里那些）→ 把它从注册表里移除，随后发出 agent/disposed。示例
收尾那两行正是证据：disposed(sess-loop)、ctx.agents.list()：1 → 0。
上面是它的生与死，而这两件事都挂在注册表（ctx.agents）上：enter 登记、
announce 发布，是生；注销时发 agent/disposed、把它移除，是灭。
```

### 一个 turn：请求、工具、再请求

第三个问题：一个轮次是怎么跑的？

要看清一轮是怎么跑的，先看一个 turn（轮次）长什么样。一个 turn 是“一条提示词对应的一

```
整趟处理”，从 turn/start 开始、到 turn/end 结束。
```

turn 里的每一次模型请求叫一个 step（步骤）。示例里第 1 轮，模型先请求工具（第一个step），拿到结果后又答了一次（第二个 step），所以是两个 step；第 2 轮它直接给出答案，没有工具，就只有一个 step。

```
第 1 轮是怎么开始的？示例里就这两行：followup() 把提示词排进队列，whenIdle() 等
它跑完。问的是“帮我把「你好」回显一遍”，正好用上 echo 工具，先要一次工具、拿到回显
```

结果、再给答案，第 1 轮的两个 step 就是这么来的：

```
agent.followup(createUserMessage({ content: [{ type: 'text', text: '帮我把「你好」回
await agent.whenIdle()
跑 npm run start:ch13，先是装配的结果，接着是第 1 轮留在日志里的账：
--- 装配：一轮要流的几个包 ---
 llm → sessions → system-prompt → tools → agents → agent-loop
 循环声明它依赖哪些服务（AgentLoop.inject）：agents, sessions, llm, tools, systemPromp
 一次最多并行几个工具调用：10
--- 第 1 轮：模型先要工具，再给答案 ---
 seq 0  agent/inbox/spliced
 seq 1  turn/start
 seq 2  agent/inbox/spliced
 seq 3  step/start
 seq 4  user/message
 seq 5  request/header
 seq 6  request/context
 seq 7  assistant/chunk
 seq 8  assistant/chunk
 seq 9  assistant/chunk
 seq 10  assistant/chunk
 seq 11  assistant/message
 seq 12  tool/call
 seq 13  tool/result
 seq 14  step/end
 seq 15  step/start
 seq 16  assistant/chunk
 seq 17  assistant/chunk
 seq 18  assistant/chunk
 seq 19  assistant/chunk
 seq 20  assistant/message
 seq 21  step/end
 seq 22  turn/end
 agent/status 变化：running → idle
```

顺着 seq 把这段读一遍，这一轮的骨架就出来了：

```
agent/inbox/spliced（seq 0、2）：队列的入队（seq 0）与取出（seq 2）都是持久事
件，取出发生在下一步 turn/start 之后。第 08 讲说过“进日志即冻结”：谁在什么时候
```

- 把哪条提示词放进来、又在哪里被取走，账上都有。

```
turn/start（seq 1）：轮次先开账，再动手；后面所有事实都归属于它。
step/start + user/message + request/header + request/context（seq 3–
```

- 6）：这一步要发给谁、带上什么。这份上下文不是另存的一份数据，而是从日志现算出来

- 的（第 08 讲的投影），所以每次请求前都重算，插话、压缩也都能在发出前生效。

```
request/header 是这次调用的配置（provider、model，连同渲染好的系统提示词与工
具 schema），request/context 记的是这次用的路由与容量（provider、model、
contextWindow），只在它们变化时才记一条。
assistant/chunk ×4（seq 7–10）：模型是流式的，分片先记进日志再组装。所以哪怕
```

- 进程中途崩了，已经吐出来的半截也在账上。

```
assistant/message（seq 11）：流组装完的完整消息。
tool/call → tool/result（seq 12–13）：模型要工具，工具执行，结果记进日志，成
```

- 为一条持久事实；模型看到的那一版是从日志投影出来的（第 12 讲讲过：超了阈值，模型看到的就换成预览加指引）。

```
step/end → step/start（seq 14–15）：第一个 step 结束，因为第一次请求里有工具
```

- 调用，循环不停，带着工具结果再发一次请求。

```
assistant/message（seq 20）→ step/end（seq 21）→ turn/end（seq 22）：这
次模型没有要工具，turn 到此为止，状态回到 idle。
一句话记住这条流程：turn/start 开账 → 每个 step 都是“组装请求 → 流式响应 → 记进日
志 → 要不要工具” → 既没有工具、也没有新的 steering（steer() 插进来的输入）才
turn/end。
```

### 循环怎么一轮轮跑：跑、停、等

第四个问题：循环怎么一轮轮跑下去？

```
什么时候跑：被叫起来才跑。循环不会自己往下走，followup 或 steer 才会把它从 idle
叫起来（inject 不叫，它的内容只是排在那儿）；叫起来之后它检查队列，有活就开新一
轮，没活就回到 idle。第 2 轮演示的正是这个：
--- 第 2 轮：同一个 agent 再来一次 ---
 seq 23  agent/inbox/spliced
 seq 24  turn/start
 seq 25  agent/inbox/spliced
 seq 26  step/start
 seq 27  user/message
 seq 28  assistant/chunk
 seq 29  assistant/chunk
 seq 30  assistant/chunk
 seq 31  assistant/chunk
 seq 32  assistant/message
 seq 33  step/end
 seq 34  turn/end
 agent/status 变化：running → idle
 surface 消息数：4 → 6
两轮的事件形状几乎一样，差别在两处：起点不同，第 2 轮是又一条 followup 排进队列，
把它从 idle 重新叫起来；长度也不同，第 1 轮有工具调用，多出一个 step，第 2 轮直接给
```

答案就收尾了。

```
队列 agent.inbox 里有两条队，各有名字与分工：
```

队名

- 等待的输入放入的方法

next-turn

- followup()（唤醒）等着各开一轮的提示词

next-step

- steer()（只在闲着时唤醒）、inject()（不唤醒）等着下一个步骤边界的输入

放进去之后，循环在两个时机来取：开新一轮时（轮次边界），一次取走“一条排队的提示词 +

```
全部 next-step 输入”；同一轮的步骤之间，只取 next-step 输入。所以 inject 进去的
内容不会自己触发运行，它不唤醒 agent，会一直留在 next-step 里，直到下一次
followup 或 steer 唤醒循环时才被一起取走。
什么时候停：循环不设上限。跑完队列只是回到 idle 等着，不算停。那什么时候才真的停？
外部想让它停，只有一条路：agent.cancel(cause)，主动叫停，中止正在跑的轮次、连排
着的输入一起清掉；注意，whenIdle() 完全不干预，只等它自己把手里的活干完、闲下
```

来。

等在哪：三个等待点。循环里会等的地方就这三处，记住它们，就知道 agent 的时间主要花在哪：

等待点

- 等待的内容等待

模型流（llm.stream）

- provider 把 chunk 吐完for a

工具分发（executeToolCalls）

- 所有工具执行完并行

- 四个监听器跑完：agent/pre-step（改这一步要发的消息）、agent/request（改这次的调用配置）、agent/request-error（返回 retry 就重试，不处理即终

四类扩展点

- 三个态）、agent/turn-stopping（turn 要关了，可再插一步让它继续）

### 本讲小结

```
今天这一讲，我们先把零件组装成一个 Agent：六个包按 inject 声明依赖；装出来的 Agent
由五样组成，从 announce(agent) 发出 agent/created 那一刻起才算一个 Agent；它的
```

生灭都挂在注册表上。

```
再装上 AgentLoop 驱动它自己跑：一个轮次从 turn/start 开账，跑成一个个 step（组装
```

请求 → 流式响应 → 记进日志 → 要不要工具），直到没有工具、没有新 steering 才

```
turn/end；跑完之后还跑不跑，看有没有新的 followup 或 steer 把它叫起来。叫起来后
```

再看队列里有没有活。

这背后真正的变化是：你不再把 Agent 当成一个现成的东西，而是知道它是怎么装起来的；也知道它是怎么一轮轮驱动下去的。

到这里，你已经知道一个 Agent 是怎么装起来、又怎么被驱动起来了。接下来的问题是：同一份 dsh，怎么让不同会话各有各的一套？下一讲，我们讲 Agent Preset。

注：本讲 GitHub 链接

### 思考题

```
动手实操：打开 agent-loop-demo.ts，把假模型适配器改成“前三次都要工具”，也就是第
1、2、3 次 stream() 各 yield 一个 tool-call 块（工具名还是 echo），第 4 次才给文字
答案。重跑 npm run start:ch13，回答两个问题：
第 1 轮里出现了几个 step/start？turn/end 落在第几条 seq？
这期间 agent/status 变过几次？
别把它改成“每次都要工具”：那会让 await agent.whenIdle() 永不返回、日志无限增
长。这正是官方 README 那条“没有内置轮次预算”：想让它停，得自己挂 agent/turn-
stopping 监听器、或在工具执行处抛错，循环不会自己叫停。
小改动：在 main() 里、收尾（拆掉循环那个 fiber）之前，也就是第 2 轮跑完、agent 正空
闲的时候，用两种方式各排一条：先 agent.followup(createUserMessage({
content: [{ type: 'text', text: 'A：下一轮再答我' }], source: { kind:
'user' } }))，紧接着 agent.steer(createUserMessage({ content: [{ type:
'text', text: 'B：这一步就插进来' }], source: { kind: 'user' } }))，最后
await agent.whenIdle()。
先猜：两条消息会落进同一个 turn/start 之后，还是分属两个轮次？再重跑，数一数日志
里 agent/inbox/spliced 的位置来验证你的猜测。提示：想想这两条队分别在什么时候被
```

取走，答案可能与直觉不同。

欢迎把你的运行结果分享出来。如果你觉得这节课对你有帮助，也欢迎分享给其他朋友，我们下节课再见！
