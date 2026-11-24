# 14 | 工具与人设：AgentPreset预组装

你好，我是张嘉熙。

第 13 讲把六个包装成了一个会跑的 Agent。可同一个应用里，Agent 要干的活通常不一样：有的要帮用户改代码，需要的是跑命令那类工具；有的只写散文、小说，需要的是写作那类工具。人设也得跟着换，一个是严谨的程序员，一个是文艺的作家。而默认情况下，每个 Agent拿到的都是同一套工具与人设，就是第 13 讲那种进程里装一套、谁用都一样的局面。

把一套工具与人设预组装成一份并存下来，创建 Agent 时按名字取一份即可，这就是 AgentPreset（下称 preset）。

- 不同 Agent 在工具与人设上的差异，写在哪？

- 怎么造一份新的 preset？

- 怎么按名字把 preset 装到 Agent 上？

- preset 怎么既隔离、又共享？

答案分两步：前两问管认识 preset，一份目录装着一行行插件，本讲用工具与人设来演示；后两问管挂载 preset，按名字把它装到 Agent 上，每份各占一个独立的 scope（作用域，各自工具与人设的可见范围），彼此够不着。本讲就按这两步展开。

```
关于环境，本讲新增三个包：@deepseek-ai/dsh-agent-presets（preset 的发现与
挂载）、@deepseek-ai/dsh-persona（把“人设”做成一个可组装的行）、@deepseek-
ai/dsh-atomic-write（dsh-agent-presets 的 peer 依赖，本讲不展开）。已加入
本项目的 package.json，npm install --legacy-peer-deps 装上即可。
关于示例：npm run start:ch14 在临时目录里现写两份 preset（coder / writer），
```

- 用它们各组装一个 agent，再打印各自能看到的工具和人设。示例不跑对话、不联网、不需要 API Key。

### 一个目录，一份 agent.cordis.yml

第一个问题：不同 Agent 在工具与人设上的差异，写在哪？

写在一个目录里：差异就写在这个根目录下各自的子目录里。所有 preset 都放在同一个根目

```
录下，根目录是挂 AgentPresets 时用 roots 配出来的，而 AgentPresets 是本讲新包
@deepseek-ai/dsh-agent-presets 导出的主插件：
await ctx.plugin(AgentPresets, {
 default: 'coder',
 roots: [{ path: root, trust: 'user' }],  // trust：system = 应用自带，user = 用户或
})
装好之后，它在 ctx 上留下一个服务 ctx.agentPresets，官方叫它 roster（名单），既负
```

责找出这些 preset，也负责把它们常驻挂载，第四问细讲。这里先看它怎么发现这些 preset：

```
扫描根目录，list() 列出全部，resolve(id) 按名字取一个。示例第一段打印的就是
```

roster 发现的结果：

```
--- roster 发现了哪些 preset ---
 coder
 writer
打开这个根目录，里面每个子目录就是一个 preset，子目录名就是它的 id（必须符合 [a-z0-
9][a-z0-9-]*）。
```

这个 id 不只是为了方便点名。preset 决定模型看到哪些工具和人设，而模型看到的东西必须能从日志重建，会话恢复、分叉时，靠这个 id 就能还原出当时那一套。所以差异必须是一份按名字可取的目录，而不是散在代码里的一堆配置。

```
每个 preset 目录里都放一份 agent.cordis.yml，内容是插件行的列表，文件顶层直接就
```

是一个数组，每一项就是一个插件行：工具、人设、提示词段落等。列表里的每一行和你在

```
ctx.plugin(...) 里装的那些是同一类东西，只是写成了 YAML，和第 04 讲的
cordis.yml 是同一套机制，交给 Loader 就长成自己的一棵插件树：
- id: tool
 name: /abs/path/to/tool.js
 config:
   tool: run_command
- id: persona
 name: '@deepseek-ai/dsh-persona'
 config:
   text: 你是个严谨的程序员，写代码一丝不苟。
同一个目录里还可以有第二个文件 preset.yml（可选），放这份 preset 的 name 和
description。agent.cordis.yml 是个插件行数组，塞不下这类信息，所以单独成文
```

件。

```
往里看 agent.cordis.yml 的每一行：它最终都会变成一个插件实例。本讲工具与人设的
```

差异就写在其中的两行上。

```
第一行是工具行（示例里的 id: tool）：这一行的作用就是注册一个工具，示例里的
tool.js 正是这样一个本地插件，它注册的工具名来自 config.tool。工具注册表（dsh-
tools）会把这个工具记在该 preset 名下，只有加入对应 preset 的 Agent 才看得到。
另一行是人设行（示例里的 id: persona）：这一行的作用就是定一份人设，
config.text 里那段话就是内容；dsh-persona 会拿它替掉原本共用的那份默认人设。于
```

是挂了不同 preset 的 Agent，看到的人设就不一样。

补充一句，preset 的一行不局限于工具或人设，提示词段落、投影单元（把插件能力投影到模型可见上下文的单元，本讲不展开）、监听器都在官方列举里，但装法都一样：一个插件一行，都记在该 preset 名下。所以“工具、人设、提示词段落”谈不上三种行，区别只在装的东西不同。边界由官方一句话定死：preset 的能力等于它命名的那些插件（本讲不展开）。本讲用工具与人设演示，只是因为它们最常用。

### 复制整个目录：copy()

第二个问题：怎么造一份新的 preset？

```
造法有两条，看你要哪种：从零定义一份，就建目录、写一份 agent.cordis.yml，上文示
例那两份就是现写的；想在现成 preset 上改一份，就走包的 copy(from, id, name?)：
```

复制整个目录（组装、元数据、附带资产全带上，总之目录里有什么就带什么），落在配置中

```
第一个 trust: 'user' 的根目录下。
```

调用方只给“来源 id、新 id、可选显示名”：只传名字，不传内容，副本能做什么就跟它的来源一模一样，不会更多。

```
复制出的 preset.yml 会被重写：description 保留来源的，之后可以自己改；name 不
```

保留。副本默认用 id 当显示名，不会和来源重名。

```
示例最后演示的正是 copy()，从 coder 复制出一份 coder2：
--- 创作 = 复制：copy() 出一个新的 ---
 coder
 coder2
 writer
```

### setup 里 mount

第三个问题：怎么按名字把 preset 装到 Agent 上？

```javascript
答案是 ctx.agentPresets.mount(agentCtx, id)，但它只能放在
setup(agentCtx) 钩子里（就是下面 ctx.agents.create(...) 里的 setup）：
const on = async (id: string, presetId?: string): Promise<agent> =>
 (await ctx.agents.create({
   sessionId: SessionId(id),
   setup: async (agentCtx: Context) => void (await ctx.agentPresets.mount(agentC
 })).agent</agent>
必须在这里，是因为 setup 是 Agent 还没发布的时候，这时挂载失败，整次创建就回滚，不
```

会留下一个装到一半的 Agent。哪些情况会被拒？一行没装成的插件（模块坏了，或等不到它要的服务），或传入的 agentCtx 本身不在任何 scope 层级里。示例用它各挂载一个 agent：

```
--- 用不同 preset 各挂载一个 agent ---
 sess-coder: 工具 [run_command]，人设 "你是个严谨的程序员，写代码一丝不苟。"
 sess-writer: 工具 [write_poem]，人设 "你是个文艺的作家，出口成章。"
```

### 各挂各的 scope

第四个问题：preset 怎么既隔离、又共享？

每份 preset 都挂在以自己 id 命名的独立 scope 里，彼此够不着。挂载时用的 scope key 是个

```
对象，长这样：{ agentPreset: 'coder' }、{ agentPreset: 'writer' }，一份
```

preset 一个 key。

一个 agent 把它的 scope key 认父到其中一份（认父：把 agent 的 scope key 挂到 preset 的

```
scope 下面），就只看得到它认的那份：coder Agent 找不到 write_poem，writer Agent 也找
不到 run_command。
认父之后怎么取，靠的是 dsh-scope 的父链（dsh-scope 是 dsh-agent-presets 的
```

peer 依赖，本讲不展开）。scope 一层套一层，取的时候从里到外找：agent → preset →global，越靠里的越优先。这条链只属于这一个 Agent，只连它认的那份 preset，够不到别的。

至于同一份 preset 下的多个 Agent，它们共享的是同一份实例：每份 preset 只挂载一次，挂在一个常驻 scope 里，preset 里的插件只实例化一次，所有加入它的 agent 都能访问到这些插件。它们之间互不串扰，靠的是共享同一批插件，但各自的状态分开存（每个 agent 的状态挂在自己的 scope 下，互不影响），而不是每个 Agent 单独装一份。

这个常驻 scope 是进程级的，比任何 agent 都活得久。一个 Agent 退出，不影响其他加入者。还有一层：你改了 preset 文件，正在跑的 Agent 也不受影响。文件每改一次，就算新一代；已经挂上的 Agent 留在改动前那一代，改动只送达后来创建的 Agent。

最后用两个例子收个尾：没加入任何 preset 的宿主，一个工具都看不到；再来一个也用 coderpreset 的 agent，看到的还是同一套工具：

```
--- 宿主 ctx（没挂任何 preset）---
 host: 工具 [无]，人设 "部署默认人设"
--- 再来一个也用 coder 的 agent ---
 sess-coder-2: 工具 [run_command]，人设 "你是个严谨的程序员，写代码一丝不苟。"
 两个 coder 会话看到同一套工具：true
```

### 本讲小结

我们看清了：同一份 dsh 能让不同 Agent 用上不同的工具与人设，靠的是 preset（预组装）。

```
差异写在哪？一个目录 + 一份 agent.cordis.yml，里面一行一个插件。
怎么造一份新的？两条路：手写文件，即建目录写 agent.cordis.yml，或者用 copy()
```

复制既有的一份。

```
怎么挂载？只能放在创建 Agent 的 setup(agentCtx) 钩子里：Agent 还没发布时挂载，失
```

败就整次创建回滚。

怎么既隔离、又共享？每份 preset 各占一个以自己 id 命名的独立 scope，彼此够不着。Agent 认父到其中一份，就只看得到那一份。同一份 preset 下的多个 Agent 则共享常驻的那一份实例，靠各自状态分开存互不干扰。宿主 ctx 没加入任何 preset，一个都看不到。

这背后真正的变化是每个 Agent 不再共用一套工具与人设，而是各挂一份可命名、可复制的预组装；多份 preset 各归各的 scope、彼此够不着，同一份下的多个 Agent 又共享一份常驻实例。下一讲，我们让一个 agent 自己续跑一个长任务：Goal。

注：本讲 GitHub 链接

### 思考题

```
动手实操：打开 preset-demo.ts。
把 coder 那一份的工具名从 run_command 改成 run_code，重跑。会发生什么？
sess-coder 建成了吗？这个 demo 没写 try/catch，失败会以未捕获异常终止进程，
报错埋在堆栈的 reason / [cause] 字段里。
```

```
在 main() 末尾补一行，用不传第二个参数的 on() 组装一个 agent 并打印它。它默认挂
```

- 了哪个 preset？

欢迎把你的运行结果分享出来。如果你觉得这节课对你有帮助，也欢迎分享给其他朋友，我们下节课再见！
