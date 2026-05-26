# 08｜群策群力：Agent Teams多会话协作架构
![](images/945358/e49107ce955f759ecedd2923675dfe4d.png)

你好，我是黄佳。欢迎来到 Claude Code 工程化实战的第 8 讲。这一讲也是SubAgent部分的终章。

前面四讲我们深入学习了子代理（Sub-Agents）——从核心概念到只读型、高噪声处理，再到并行探索和流水线编排的实操案例。今天我们要探索一个更进阶的（也是新鲜出炉的）协作模式： **Agent Teams（智能体团队）**。

> **注意**：Agent Teams 是 Claude Code 的实验性功能，默认关闭。需要在相关级别的设置文件中（如用户级设置 ~/.claude/settings.json 或 项目级设置 project\_folder/.claude/settings.json）添加 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 环境变量来启用。Claud Code官方说，这个实验性功能可能存在已知限制（具体限制可以参考官网实时更新的 [说明](https://code.claude.com/docs/en/agent-teams)，搜索“limitations”关键字），生产环境请谨慎评估。

![](images/945358/7e4207bae5ec09564408772c32ffd20e.jpg)

## Sub-Agents vs Agent Teams：从“任务委托”到“团队协作”

在前几讲中介绍的子代理工作模式虽然也各有差异，但是基本模式一致。都是主对话像老板一样，把任务 **委派** 给各个专职员工（子代理）。这种模式解决了上下文污染、权限边界、任务并行等问题。但它有一个根本性的限制： **子代理只能向主对话汇报，不能互相交流。**

![](images/945358/e16fc5958229a18c5e7e37b5b5091314.jpg)

这在很多场景下足够好用。但我们在实际生产环境中可能会遇到更复杂、更诡异的场景：比如 **多假设并行验证。**

你的系统出现了一个奇怪 bug——用户登录后偶尔会话丢失，没有明确的规律。你怀疑可能是：

- 假设 A：JWT token 过期时间计算有问题

- 假设 B：Redis session 存储的竞态条件

- 假设 C：负载均衡器的 sticky session 配置


如果用子代理，情况可能是这样。

![](images/945358/01d8fb446e4cb8b70ab1d504753d212f.jpg)

如果子代理 B 能看到子代理 C 的发现，它可能会说：等等，Redis 连接数上限问题可能是因为 sticky session 5 分钟后切换了服务器，导致新的 Redis 连接被创建。

**这正是 Agent Teams 要解决的问题——让代理之间能够直接交流、互相挑战、协作推进。**

Agent Teams 让你可以协调多个 Claude Code 实例作为一个团队工作。一个会话作为 **Team Lead（团队领导）**，协调工作、分配任务、综合结果。 **Teammates（队友）** 各自独立工作，每个都有自己的上下文窗口，并且可以直接互相通信。

![](images/945358/f15cffe029cdb4a021968c9bf5369a70.jpg)

因此我们说，“Agent Teams模式”与“主会话-子代理模式”最本质的区别是， **Teammates 可以互相发消息、共享发现、挑战彼此的结论。**

## 创建和使用 Agent Teams

刚才说了，Agent Teams 默认是关闭的，启用方式是在 `settings.json` 中设置环境变量：

```plain
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}

```

或者在 shell 环境中设置：

```plain
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

```

在 Claude Code 中可以通过下面两种方式创建团队。

![](images/945358/403517e39d0d294f54572b3078045f94.jpg)

**两种方式你都保持控制权**——Claude 不会未经你批准就创建 team。

启用后，用自然语言告诉 Claude 创建团队并描述任务：

```plain
我在设计一个 CLI 工具来追踪代码库中的 TODO 注释。
创建一个 agent team 从不同角度探索这个问题：
一个 teammate 负责 UX，一个负责技术架构（用最好的模型），一个扮演审评质疑者（用普通模型）。

```

Claude 会建团队，生成指定的 Teammates让它们探索问题，然后综合各方发现，完成后清理团队。

团队成功创建后，一个 Agent Team 由以下组件构成。

![](images/945358/6278cf7d69d04aeb2e8ddeeee600bb3e.jpg)

团队和任务相关的数据会存储在本地。

- **团队配置**： `~/.claude/teams/{team-name}/config.json`

- **任务列表**： `~/.claude/tasks/{team-name}/`


团队配置包含 `members` 数组，记录每个 Teammate 的名称、agent ID 和类型。Teammates 可以读取这个文件来发现其他团队成员。这些都是Claude Code自行搞定的，不需要我们操心去存放。

Agent Teams 支持两种显示模式：

![](images/945358/0fc8d9fd4155a600cc98eb26a226baf8.jpg)

完成工作后，Lead 会向Teammate发送关闭请求，Teammate 可以批准（优雅退出）或拒绝（并解释原因）。

![](images/945358/ee210a4f07af7b8d96028e9b707b0136.jpg)

![图片](images/945358/569fed0cb067cde765fe553bac0d34d1.png)

最后，全部工作收尾，Lead 会清理团队，移除共享的团队资源。需要注意，如果出现需要用户人工指示清理的化，清理前先关闭所有 Teammates，而且应该只让 Lead 执行清理（Teammates 的 team 上下文可能不正确）。

## 实战项目：全栈 Bug 猎人

这里，我为本讲配套了一个完整的工程化实战项目，位于项目目录 `03-SubAgents/projects/06-agent-teams-bug-hunt/`。

项目场景是一个 Express.js 电商应用（ShopStream），其中刻意植入了多个相互关联 bug。用户报告了三个看似独立的症状：会话丢失、API 变慢、数据泄漏。真相是这些症状由相互 bug 的级联故障造成：

```plain
Bug 1: DB 连接池太小（db.js）
    ↓ 连接耗尽
Bug 2: Redis Session 不处理重连（middleware/session.js）
    ↓ Session 写入静默失败
Bug 3: 订单查询 N+1 问题（routes/orders.js）
    ↓ 大量连接被占用 → 加剧 Bug 1
Bug 4: 缓存竞态条件（middleware/cache.js）
    ↓ 缓存 key 缺少用户标识 → 数据泄漏
    ... ...

```

那么为什么这里需要 Agent Teams 呢？

因为单独调查者容易“锚定”，找到一个 bug 后就满意了，不继续挖掘。而bug 之间的关联需要跨视角发现，只有Session 侦探和数据库侦探各自的发现互相对照，才能看到级联效应。此外，架构侦探可以把其他侦探的发现串联起来，通过辩论机制产出更完整的根因链。

项目中具体的文件内容和说明如下。

![](images/945358/f0ec886eb17df2e65afaf623a47499b1.jpg)

下面，我带着你一起动手试一下。我们启用 Agent Teams，用 team-prompt.md 中的指令启动团队，观察四个侦探如何各自调查、分享发现、互相挑战，最终拼出完整的级联故障链。

把team-prompt.md中介绍的某一种启动模式（我设计了多个Teams协同模式，这里只展示竞争假设模式）拷贝到Claude Code命令行中，启动Teams即可。

```plain
阅读 bug-report.md 中描述的三个症状。然后创建一个 agent team 来调查这些问题。

生成 4 个 investigator teammates：
- "Session 侦探"：假设根因在 Session/Redis 层。重点审查 middleware/session.js 和 server.js 中的 session 配置。
- "数据库侦探"：假设根因在数据库连接和查询层。重点审查 db.js 和 routes/ 下所有路由的数据库操作。
- "缓存侦探"：假设根因在缓存机制。重点审查 middleware/cache.js 以及缓存与用户隔离相关的逻辑。
- "架构侦探"：不预设假设，从整体架构角度分析各组件的交互。重点关注错误处理、资源管理和并发安全。

每个 teammate 的 prompt 中包含：
1. buggy-app/ 目录包含完整的应用代码
2. 他们需要用 Read/Grep/Glob 工具审查代码
3. 找到可疑问题后，要发消息告诉其他 teammates
4. 如果其他 teammate 的发现与自己的发现有关联，要主动指出
5. 特别注意：三个症状可能不是独立的，要寻找它们之间的因果关系

要求所有 teammates 在完成初步调查后互相分享发现，并尝试挑战彼此的结论。

最终综合所有发现，生成一份按照 findings-template.md 格式的调查报告。

```

我们用自然语言启动Teams。

![图片](images/945358/a84f2e71346e5fb18392eyyccc36a052.png)

Claude Code根据指示，阅读项目中相关的配置文档，开始创建Teams。

![图片](images/945358/f72e27d378811e7aabcbcb9abd79a4ce.png)

团队创建成功，Teams开始启动工作了。

![图片](images/945358/f709294f5330a99d7707f840c7279a13.png)

一段时间后，4位 Bug 侦探完成了任务，Leader认为可以生产综合报告了。

![图片](images/945358/faebd4yy93298dbf21f7b29daa5fbe25.png)

报告完成，leader要关闭teams了。

![图片](images/945358/92829f7f6417c7f0c3a88d8bec4e9e01.png)

显示调查结果总览。

![图片](images/945358/1c6d20aef927958e82e7eb120e390598.png)

**等等！有一位侦探发现，事儿还没完**，还需要更多的根因分析和补充说明。于是它又开始更新报告……

![图片](images/945358/569fed0cb067cde765fe553bac0d34d1.png)

终于完成了任务，全部Bug被发现！

![图片](images/945358/1edd0552563dc17ecec438a78eb0c337.png)

## 四大协作设计模式

Agent Teams 最强大的地方在于它支持的协作模式。我从官方文档和工程实践中提炼出四种核心设计模式。

### 模式一：竞争假设（Competing Hypotheses）

这种模式适用于根因不明确，需要从多个方向同时验证的场景。

单个 Agent 调查时容易“锚定”——找到一个合理解释后就停止探索，可能错过真正的根因。此时，让多个 Teammates 各自持有不同假设，并要求它们互相挑战、试图推翻对方的理论。

```plain
用户报告应用在发送一条消息后就退出了，而不是保持连接。
生成 5 个 agent teammates 调查不同的假设。
让它们互相对话，试图推翻对方的理论，像科学辩论一样。
将最终共识更新到 findings 文档。

```

该模式架构如下：

![](images/945358/b11efd96dab512c14e6008e0d8fb0a72.jpg)

想一想，这种模式的工程价值在哪里？

- 避免锚定效应——多个独立调查者，各自寻找证据支持自己的假设。

- 辩论机制迫使每个假设必须经受挑战才能“存活”。

- 最终“存活”的假设更可能是真正的根因。


为什么辩论结构是此处的关键机制？顺序调查会受到锚定偏见的影响，一旦第一个理论被探索，后续调查会不自觉地偏向它。多个独立调查者主动互相反驳，幸存下来的理论更可能是真正的根因。

### 模式二：分层评审（Parallel Review）

这种模式适用于代码审查、PR Review 等需要从多个维度同时评估的任务。

因为单个 reviewer 容易聚焦于某一类问题（比如只看代码风格），而忽略其他维度。让多个 Teammates 各自负责不同的审查维度，同时工作。

```plain
创建一个 agent team 来审查 PR #142。生成三个 reviewer：
- 一个专注安全隐患
- 一个检查性能影响
- 一个验证测试覆盖
让它们各自审查并汇报发现。

```

该模式架构如下：

![](images/945358/6acbf41ed06d3658e52d825c857bea95.jpg)

这种模式的工程价值有哪些呢？

- 每个维度都得到充分关注，不会因为注意力分散而遗漏。

- 并行执行，时间成本不增加

- 不同专家可能发现关联问题（Security Reviewer 发现的输入验证问题可能影响 Performance）


### 模式三：模块化开发（Module Ownership）

这种模式适用于新功能开发，涉及多个独立模块（前端、后端、数据库、测试）的场景。

由于让一个 Agent 依次开发容易混淆上下文，多个子代理并行又无法协调接口。因此，让每个 Teammate 拥有一个模块，通过共享任务列表协调工作。

该模式架构如下：

![](images/945358/766d16b099c22b7ba9822f0845c0d69a.jpg)

这种模式的关键机制是：

- 任务依赖：任务可以声明依赖其他任务，被阻塞的任务不能被认领。

- 自动解锁：当依赖任务完成后，被阻塞的任务自动变为可认领。

- 文件所有权：每个 Teammate 负责不同的文件，避免冲突。


### 模式四：规划-审批（Plan Approval）

这种模式适用于复杂或高风险任务，需要在实施前确认方案。

如果直接让 Teammate 开干，可能因方向错误导致返工。因此要求 Teammate 在实施前先提交计划，Lead 审批通过后才能执行。

```plain
生成一个 architect teammate 来重构认证模块。
要求在修改任何代码前先提交计划等待审批。

```

该模式工作流如下。

![](images/945358/723d64913d2e7950604dd98dd85044a0.jpg)

控制 Lead 的审批标准：

```plain
生成一个 architect teammate 来重构认证模块。
要求在修改任何代码前先提交计划等待审批。
只批准包含测试计划的方案。
拒绝任何修改数据库 schema 的方案。

```

Lead 会根据你提供的标准自主做出批准/拒绝决策。你影响 Lead 判断的方式是在 prompt 中给出明确的标准，比如“只批准包含测试覆盖的方案”或“拒绝修改数据库 schema 的方案”。

好，本讲主要内容就到这里，关于更多Teams的当前局限，权限配置等等，请参考 [官网文档](https://code.claude.com/docs/en/agent-teams) 中的说明，我就不一一赘述了。不过呢，结束之前，下面再给出两个重要小内容。

## Sub-Agents vs Agent Teams：选型决策树

你可能还有这样的疑惑：到底Sub-Agents 和 Agent Teams这两种架构如何选择？

这里给出一个选型决策树。

```plain
你的任务需要多个 workers 吗？
├── 否 → 直接在主对话或用单个子代理
└── 是 → Workers 需要互相通信吗？
    ├── 否 → Sub-Agents
    │   └── 特点：
    │       • 更低 token 成本
    │       • 更简单的协调
    │       • 适合：并行探索、流水线编排
    │
    └── 是 → Agent Teams
        └── 特点：
            • 支持讨论和挑战
            • 共享任务列表
            • 适合：竞争假设、协作开发、多角度审查

```

我们用一张表格厘清两种模式的差异。

![](images/945358/f0c0e760794924353028e8d99bb37c58.jpg)

一句话总结，核心判断标准是你的 workers 是否需要互相通信？Sub-Agents是快速、廉价的“派出去-带回来”模式，如果 **只需汇报结果** ，就选 Sub-Agents；Agent Teams是复杂、协作的“组队讨论”模式，如果 **需要互相讨论、挑战、协调** ，就选 Agent Teams。

## Token 成本考量

最后说说成本。Claude指出，Agent Teams 使用的 token 显著高于单会话或子代理，因为每个 Teammate 是独立的 Claude 实例，有独立的上下文窗口。消息通信消耗额外 token，而且团队越大，成本越高。

因此，适合 Agent Teams 的任务特征包括：

- 并行探索能带来真正的价值；

- 讨论和挑战能提高结果质量；

- 任务复杂度值得额外成本。


不适合 Agent Teams 的任务特征包括：

- 常规任务，单会话就够；

- 任务之间没有协作需求以及预算有限的场景。


## 本讲小结

Agent Teams 让多个 Claude Code 实例作为团队协作，Teammates 可以互相通信，而不只是向主对话汇报。其核心组件包括 Lead（协调者）， Teammates（执行者）， Task List（共享任务）， Mailbox（消息系统）。

我们给出了一个实操案例，同时介绍了4大Teams应用模式。

![](images/945358/4584aa6698af626a3bbcf52cbaa827b6.jpg)

这里也给出Claude Code总结的Teams最佳实践。

1. 给 Teammates 足够的上下文。Teammates 不继承 Lead 的对话历史，所以生成时要给足信息。

2. 合理拆分任务粒度。太小的话协调开销超过收益，过大则Teammate 工作太久无检查点，增加返工风险。任务最好是自包含的单元，产出明确的交付物（一个函数、一个测试文件、一份审查报告）。每个 Teammate 5-6 个任务比较合适。让所有人保持忙碌，也便于 Lead 在某人卡住时重新分配。

3. 避免文件冲突。两个 Teammates 编辑同一个文件会导致覆盖。拆分工作时确保每个 Teammate 拥有不同的文件集。

4. 监控并引导。不要让 team 无人看管运行太久。定期检查进度，纠正偏离方向的 Teammate，在发现问题时及时综合。

5. 从研究和审查任务开始。如果你刚接触 Agent Teams，从边界清晰、不写代码的任务开始，如审查 PR、调研技术方案、调查 bug等，这些任务能展示并行探索的价值，又避免了并行写代码的协调挑战。

6. 让 Lead 等待 Teammates 完成。有时 Lead 会在 Teammates 完成前就自己开始下一步工作。如果发现这种情况，可以在命令行提示“等待你的 teammates 完成任务后再继续”。


## 思考题

1. 回顾你之前用子代理做的任务。有哪些场景如果用 Agent Teams 的“竞争假设”模式可能效果更好？

2. 在”模块化开发“模式中，如果两个 Teammates 需要修改同一个接口文件（比如定义 API 契约），你会如何处理文件冲突问题？

3. 对比 Sub-Agents 的“流水线编排”和 Agent Teams 的规划-审批模式。两者解决的问题有什么不同？在什么场景下你会选择哪个？

4. 假设你要用 Agent Teams 做一次技术方案评审——有三个 Teammates 分别代表“性能优先”“可维护性优先”“快速交付优先”三种立场。设计一下你会给 Lead 什么指令，让这场讨论产出高质量的决策。

5. 在“全栈 Bug 猎人”项目中，四个 bug 的级联关系是如何被发现的？如果用子代理（而非 Agent Teams）调查这些 bug，你预期会有什么不同的结果？具体到哪些关联会被遗漏？


## 下一讲预告

至此我们终于完成了子代理和 Agent Teams 的学习，我们对 Claude Code 的“多代理协作能力”已经有了完整的理解。从下一讲开始，我们将进入新的主题： **Skills 技能系统**。

欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。