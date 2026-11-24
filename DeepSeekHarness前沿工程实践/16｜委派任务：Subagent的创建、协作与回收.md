# 16 | 委派任务：Subagent的创建、协作与回收

你好，我是张嘉熙。

第 15 讲我们让一个 agent 能自己续跑长任务，但它分身乏术，任务里那些能独立、能并行的子任务，比如查资料、数一整个仓库的文件，还得亲力亲为。这一讲我们给它加一个能力：委派，把活交给子 agent（Subagent）。这跟续跑正好相反：续跑是纵向把一件事做深做透，委派是横向把活分给子 agent 干。委派分成三个问题：

- 怎么创建一个子 agent？

- 父 agent 和子 agent 怎么协作？

- 最后怎么回收？

答案分三段：创建，把活派出去；协作，和子 agent 互动；回收，把结果收回来、资源释放掉。

- 关于环境：本讲新增五个包：

```
@deepseek-ai/dsh-subagent（委派服务，ctx.subagents）
@deepseek-ai/dsh-subagent-spawn-in-process（spawn 提供方）
@deepseek-ai/dsh-subagent-fork-in-process（fork 提供方）
@deepseek-ai/dsh-subagent-in-process-driver（共享的进程内驱动器）
@deepseek-ai/dsh-tool-subagent（面向模型的委派工具）
进程外提供方 acp / codex / claude-code / dsh-sdk（对应 dsh-subagent-acp /
dsh-subagent-codex / dsh-subagent-claude-code / dsh-subagent-dsh-sdk）
正文点到即止，示例用不上，本讲不展开。面向模型的 dsh-tool-subagent-control
（子级消息、中断、列举）和 dsh-tool-subagent-report（子级上报）本讲不展开。
另有 peer 依赖 @deepseek-ai/dsh-jobs、@deepseek-ai/dsh-session-
projection-cache（本讲不展开）。npm install --legacy-peer-deps 装上即
```

- 可。

```
关于示例：npm run start:ch16 让父 agent 用 spawn 委派一个子 agent 去“数文件”，
```

- 子 agent 跑完返回结果，父 agent 拿到后把它释放掉。示例用假模型，不管 prompt 问什么，都固定回答“仓库里一共 42 个文件”，所以不联网、也不需要 API Key。

### 怎么创建：提供方、委派方式、深度上限

创建看着简单，但要落地，有几个关键点你要想清楚：用哪个提供方、怎么把活派出去、会不会无限往下委派。这一节我们就按这个顺序走。

```
先看第一个关键点：用哪个提供方。委派统一走 ctx.subagents 这个 seam，也就是 05
```

讲那个“可替换能力”的组织方式：一个入口、多个实现，这些“实现”就是提供方，每个提供方

```
决定子 agent 跑在哪。父 agent 只认 ctx.subagents 这一个入口，不认具体提供方，所以
```

换提供方、调用它的代码不用改。提供方可以多个共存，具体有这么几个：

提供方

- 特征

spawn（本讲示例）

- 进程内，空历史起步

选哪个，看需求：要子 agent 独立从头干，用 spawn（空历史）；要它接着父 agent 的进度往

```
下干，用 fork（带父历史）；要它在进程外跑，才用 acp / codex / claude-code / dsh-
sdk 那几个，让子 agent 在独立进程里由外部实现来跑：Codex、Claude Code、另一个
```

dsh，或任意 ACP 兼容的 agent。

示例用的是 spawn，所以子会话是全新的：

```
--- 委派：父 agent 把活交给子 agent ---
 父会话：sess-parent
 子会话是新会话：true（spawn 看不到父的历史）
 子 agent 的委派深度：1
我们逐行看这段日志：父会话：sess-parent 是父 agent 的会话 id；子会话是新会话：
true 说明子 agent 的会话独立于父 agent；子 agent 的委派深度：1
（delegationDepth）是子 agent 在委派树里的深度，比父 agent 深一层：父 agent 是顶
```

层（0）。

```javascript
第二个关键点：怎么把活派出去。我们先看一段最小调用（parent 是父 agent）：
const run = await ctx.subagents.start('spawn', {
 parent,
 prompt: [{ type: 'text', text: '数一下这个仓库里有多少个文件，直接回答。' }],
 signal: new AbortController().signal,
})
const result = await run.result   // 等它跑完，读 result 里的 output / stopReason
await run.dispose()               // 父 agent 用完子 agent 的句柄后，释放资源
```

```
start(name, request) 这个调用，分两段：先发布，run（句柄）到手；再执行，子
agent 接着跑自己的轮次。到手的是句柄而不是结果，结果要等子 agent 跑完、await
run.result 才拿到。
```

这么分是刻意的：发布这一刻，所有权（ownership）从提供方转给父 agent：发布前由提供方负责组合（compose），发布后由父 agent 持有句柄、负责 dispose。这是“谁拥有”，不是“谁在跑”；子 agent 的轮次一直是它自己在跑。同时“建没建成”也就定了：成了句柄到手，败

```
了 start() 直接拒绝，没有中间态。
取消也分两段：request 里带的 signal（取消信号）在发布前中止会让 start() 回滚后
```

拒绝，发布后中止只取消剩余轮次，已返回的句柄仍能 dispose。

```
start(name, request) 有两个参数：name 选提供方，request 是请求对象，字段如
```

下：

字段

- 必填作用

prompt

- 交给子 agent 的活是

parent

- 是谁委派的

signal

- 是取消信号

outputSchema

- 要求子 agent 返回结构化结果，落到 result.structured否

maxDepth

- 否本次委派的深度上限

toolFilter

- 限制子 agent 能用的工具否

persona

- 给子 agent 单独的人设否

```
表格里 outputSchema、maxDepth、toolFilter、persona 这四个字段，对应四种能
力，不是想要就有，还得提供方支持；不支持的，start() 会在创建前就拒绝，而不是等跑
```

到一半才报错。

```
其中 parent 不只是一个引用：对进程内提供方（spawn / fork），子 agent 从它那儿继承工
作目录（cwd）、谱系（lineage）、模型；委派深度（delegationDepth）也由它决定。
而工具、人设的继承则是 start() 内部自动做的：进程内提供方创建子 agent 时，会执行组
合自父级（composeFrom() 方法），让它默认继承父级已挂载的 preset（dsh 里预设好的工
具 + 人设）；表格里的 persona、toolFilter 就是在这个默认基础上做覆盖：persona
顶掉人设、toolFilter 裁掉部分工具。
上面这些是给父 agent 代码用的；面向模型，dsh-tool-subagent 把 start() 包成
subagent 工具，底下还是同一个 seam。
```

第三个关键点：会不会无限往下委派。委派会成树：父 agent 能同时委派多个子 agent，子agent 还能再委派孙子。不封顶的话，一个子 agent 能无限往下委派，整棵委派树会失控地疯

```
长。所以委派有深度上限：dsh-tool-subagent 的 maxDepth（默认 3，父 agent 下面最
```

多再有子、孙、曾孙三层），到顶后工具仍可见，但每次启动都会被拒、返回出错结果。

```
这个深度记在会话头（SessionHeader，会话的元数据）里、重启不丢；否则子 agent 重启
后会忘了自己第几层、把自己当顶层，maxDepth 封顶就失效了。进程外提供方例外：它们
在自己的进程里管递归预算（配 maxDepth: 'provider-managed'），不在这里卡。
```

把这三个关键点合起来看，委派是异步、有界的：父 agent 发出去的是活，结果异步回传；跑

```
在哪由 seam 换、跑多深由 maxDepth 锁定。
```

### 怎么协作：单向等待与双向互动

活交出去之后，父 agent 和子 agent 怎么协作，两种子 agent 不一样。

一次性（one-shot）子 agent 就是前面说的：父 agent 只等结果，中间不掺和。

可继续子 agent（continuable，它的创建本讲不展开）则不然，父 agent 和子 agent 是双向互动的：

```
followup() 继续派活，哪怕它已经停下来，也会被重新唤醒接着干；正在跑时，新活先
```

- 排队等它这一轮结束。

```
interrupt() 中断当前这一轮，只停这一轮，排队里的活还在，之后还能接着跑。
reportFrom() 主动报告，子 agent 有事自己上报给父 agent。
```

这种协作一直持续到它结束。

### 怎么回收：结果回传与资源释放

委派不是终点，还得回收。回收有两件事：结果回传、资源释放。

```
回传的结果是一个对象（run.result），三个字段：
```

字段

- 含义

output

- 子 agent 最终说的话

structured

- 可选的机器可读结果（指定了 outputSchema 才有）

stopReason

- 它为什么停：completed / aborted / error / max-tokens / refusal

```
stopReason 这五个值里，只有 completed 是干成了，其余四个都是没干成，output 可
能不完整。所以父 agent 判成败得看 stopReason，不能光看 output。
失败本身不会让 run.result reject：它照常完成，只是 stopReason 是非 completed
值。只有一种情况会 reject：基础设施故障，那种故障没法归进 stopReason 的五个值，所
```

以连结果对象都拿不到。

```
示例里子 agent 跑完一轮，stopReason 是 completed，output 是它的最终文本：
--- 子 agent 的结果 ---
 stopReason: completed
output: 仓库里一共42 个文件。
```

子 agent 的中间过程不进父 agent 的会话，父 agent 只拿最终结果。

这个结果怎么回到父 agent 手里，两种子 agent 不一样。一次性子 agent，父 agent 直接

```
await 句柄的 result。
可继续子 agent 则是父 agent 不 await，等子 agent 结束时，ctx.subagents 服务往父
agent 的消息队列投一条结果通知：开头是一句总结，说明它为什么停，比如 Background
subagent <id> finished...</id>，后面接子 agent 的最终输出。投完通知，
ctx.subagents 才把子 agent 从父 agent 名下拿掉。
```

这个先后不是随便定的：通知得在子 agent 被拿掉之前投进父 agent 的消息队列。这个子agent 被拿掉，父 agent 名下没子 agent 了，就会被判定“可以结束了”、接着被

```
ctx.subagents 回收；回收之后，通知就无处可投了。
另一件事是资源释放。一次性子 agent 靠句柄的 dispose()：它先取消剩余工作，等子
```

agent 彻底停下来，再释放资源，整个过程幂等。无论子 agent 干成没干成，父 agent 都要调它，这是资源一定被释放的兜底。示例最后就是这一步：

```
--- 回收 ---
 子 agent 已 dispose（回收完成）
可继续子 agent 的释放不靠父 agent 手动调 dispose()，而是 ctx.subagents 自动跟踪
```

它的驻留期（官方术语 Activation）来释放。

驻留期是什么？可继续子 agent 的会话是持久的（进程重启不丢），但每次运行要在进程里重建一个实例，实例在进程里 resident（驻留）的这段时间，就是它的驻留期。

可继续子 agent 的释放，只释放这个进程内实例，会话还在；而一次性子 agent 的

```
dispose()，连会话一起删了。
驻留期由 ctx.subagents 自动判定，三个状态：running（在跑）、waiting（自己停下
来了，还有子没释放）、settled（自己停下来了，子都释放干净了）。走到 settled，
ctx.subagents 就释放这个子 agent 的句柄、把它的驻留期从进程里移除。
```

### 本讲小结

```
我们看清了委派的三个环节：start() 把活派出去，和子 agent 互动，再把结果收回来、资
```

源释放掉，正好是标题中的三个词。

```
创建：ctx.subagents 一个 seam、多个提供方（spawn 空历史、fork 带父历史）；
start() 先发布、句柄到手；子 agent 组合自父级（composeFrom()）继承工具和人设，
还能换人设、裁工具；委派深度（delegationDepth）记在会话头里、重启不丢，
maxDepth 封顶。
协作：一次性子 agent，父 agent 只等结果；可继续子 agent 双向互动（followup() 续
派、interrupt() 中断、reportFrom() 上报）。
回收：一次性子 agent 直接 await 结果、dispose() 释放（幂等，取消剩余工作、等彻底
```

停下来）；可继续子 agent 结果以通知回传（在释放前）、驻留期走到头才释放。

这背后真正的变化是一个 agent 不再只能亲力亲为，它能把活委派给子 agent，还能换人设、裁工具，覆盖子 agent 的默认继承。委派不是“放出去就不管”：深度有封顶、回收子先于父，整棵委派树不会失控疯长，最终收得干净。

注：本讲 GitHub 链接

### 思考题

```
动手实操：打开 subagent-demo.ts，直接改代码、重跑 npm run start:ch16 验证。
给 start('spawn', ...) 的 request 里加一个 maxDepth: 0，重跑，看委派是不是被
```

- 拒、报错（子 agent 的深度 1 超过了上限 0）。

```
在 run.dispose() 之前，再委派第二个子 agent（调一次 await
ctx.subagents.start('spawn', ...)），重跑，看两个子 agent 的
delegationDepth 是不是都是 1（说明它们是兄弟、不是父子）。
```

欢迎把你的运行结果分享出来。如果你觉得这节课对你有帮助，也欢迎分享给其他朋友，我们下节课再见！
