# 07｜安装画图工具：给 Claude Code 装上画图 Skill
你好，我是 Robert。

上一讲的八步心法里，第 4 步是“画项目全景”。这一讲按理说应该开始画 Spring AI Alibaba Admin 的架构图了，但动笔之前我想先停一下，因为我意识到一件事： **在讲怎么画之前，得先让 Claude Code 真的能画图**。

你试过没有？打开 Claude Code，跟它说“帮我画一张项目架构图”，它大概率会给你一段 mermaid 源码，让你自己去 mermaid.live 或者别的地方渲染。

![](images/975826/72e5fff871a6fbe82c81881ce3408f5a.png)

这不是 Claude Code 的问题，是 **它出厂时没带画图能力**，但给它装上很容易。装好之后，它能直接给你出 PNG、SVG、PDF，能在浏览器里实时预览。

学完这一讲，你会有两样东西： **一个装好画图能力的 Claude Code**，以及 **一张“什么场景用什么图”的心智地图**。

## 花一分钟认识 SKILL

讲画图之前，先花点时间讲 SKILL 是什么。Claude Code 启动时会做一件事： **扫两个目录**。一个是你的用户目录 `~/.claude/skills/`，另一个是项目根目录 `.claude/skills/`。扫到的每个 SKILL 会被加载进上下文，成为 Claude Code 的“知识库”。

**一个 SKILL 长什么样？** 就是一个文件夹，里面一个 `SKILL.md` 文件，再可选地带一些 reference 文档或辅助脚本。SKILL.md 是关键，它告诉 Claude Code 这个 SKILL 干什么、什么时候用、用什么工具。Claude Code 看完就知道自己多了一项能力。

**怎么装？** 一般两种方式。

1. Plugin 方式：Claude Code 内置了 plugin marketplace 机制，在 Claude Code 里输入 `/plugin marketplace add 某个 github 仓库`，再 `/plugin install` 就好。这种装法自动处理依赖、自动配置 MCP server，最省事。

2. 手动 clone：直接 `git clone` 到 `~/.claude/skills/` 或项目的 `.claude/skills/` 下，重启 Claude Code 就生效。这种方式更透明，适合你想看看 SKILL 里面是什么、想自己改改的场景。


就这么简单。不是黑盒，是一个文件夹。 **哪里找好的 SKILL？**

- Anthropic 官方 plugin marketplace：在 Claude Code 里 `/plugin marketplace list` 能看到官方收录的。

- GitHub 搜 claude-code skills 或 claude skill：社区项目很多。

- 第三方聚合站：比如 skillsdirectory.com、fastmcp.me 收录了大量可用 SKILL 和它们的安装命令。


提醒一下：这一讲你装的是别人写好的 SKILL，就像你用 npm 装别人的 package。11 讲会讲怎么自己写 SKILL.md，把你项目里反复出现的模式沉淀下来给 Claude Code。消费者和生产者都会教，这一讲先做消费者。好了，SKILL 讲完，接下来看四类必备图。

## 工具怎么选？安装 claude-mermaid

工具层面，我推荐这样的配置：

1. **mermaid**：90% 的场景用它。Claude Code、Cursor、GitHub、Notion、VS Code 原生都支持，AI 生成 mermaid 代码的能力也最强。这一讲主讲 mermaid。

2. **plantuml**：偶尔需要画更复杂的 UML 图（比如详细的类图、复杂的时序图带 frame 结构），plantuml 比 mermaid 表达力强。但语法稍重，AI 生成时容易出错。

3. **drawio（diagrams.net）**：画“最终交付的架构图”时用。drawio 出来的图好看、正式、适合放到文档和汇报材料里。但不适合让 AI 快速生成，更适合你拿到 AI 的 mermaid 初稿后，用 drawio 精修。


**我的日常流程是这样**：用 mermaid 快速迭代、反复改、留在项目 `docs/` 里；最终要交付到外部（PPT、正式文档）的那一两张，用 drawio 精修。plantuml 用得少，偶尔做复杂时序图用一次。这一讲装的就是 mermaid 能力，plantuml 和 drawio 需要时再装，装法类似。

mermaid 能力现在有一个特别成熟的方案，叫 **claude-mermaid**（作者 veelenga）。它是一个 MCP Server + Plugin 一体的方案。 **装法有两步，少一步就用不了。**

1. 装 claude-mermaid 命令本身：

```plain
npm install -g claude-mermaid

```

这步装的是真正干渲染活的 Node 程序。没有它，后面的 Plugin 只是空壳。Node 版本需要 20 或更高， `node -v` 确认一下。

2. 在 Claude Code 里装 Plugin：

```plain
/plugin marketplace add veelenga/claude-mermaid
/plugin install claude-mermaid&#64;claude-mermaid

```

这步装的是 Skill 定义和 MCP 配置。装完后， **完全退出 Claude Code 再重新启动**（不是 reload），让 MCP Server 起来。如果安装遇到问题，可以直接让 Claude Code 帮忙解决即可。

**验证**：

装完你可以试一句：画个最简单的用户登录流程图，保存到当前目录。效果图如下：

![](images/975826/d5b5f3912cdf6ac38fdab9d79469c8c1.png)

## 了解老项目需要的四类必备图

如下图所示，老项目改造过程里会反复需要的图就那么四类。

![](images/975826/4988f6a73079f332af67b2df561c511d.png)

**第一类：架构图**

用方框和箭头展示系统的骨架。前端、后端、数据库、中间件、外部服务之间的关系。颗粒度粗，一张图把整个系统的样子说清楚。用在 08 讲画项目全景、10 讲 CLAUDE.md 的“项目架构”小节、13 讲编译运行时理清依赖、第四部分改造时判断影响范围。

**第二类：模块依赖图**

有向图，节点是项目里的模块或包，边是依赖关系。让你一眼看出，哪个模块是底层、哪个是上层、有没有循环依赖。用在 08 讲画模块依赖、后面任何时候你想知道“改这个模块会拖动谁”的时候。

**第三类：时序图**

用时间轴展示多个参与者之间的交互。用户 → 前端 → Controller → Service → DB，一次请求从上到下走一遍。用在09 讲梳理接口时画“一次 API 调用的完整生命周期”、复现 bug 时画“问题路径”、第四部分改造时对照“改造前 vs 改造后的调用链”。

**第四类：数据库 schema 图（ER 图）**

表和表之间的外键关系。主键、外键、关联方向一目了然。用在 09 讲梳理数据模型、改造涉及 DB 的任何时候、给接手同事讲数据关系的时候。

这四类图基本覆盖老项目改造的全部场景。还有一些图，比如状态图、类图、部署图，用到的概率低，等真碰到再说。

## 四类图的画法：提示词 \+ 坑

### 架构图

最常用的一类。用 mermaid 的 `graph TD`（从上往下）或 `graph LR`（从左往右）。下面的提示词我在Spring AI Alibaba Admin 项目的源码中尝试执行。

**提示词**：

```plain
帮我画一张这个项目的架构图。前端、后端、数据库、外部服务分层画出来。
每个模块写名字加一句话职责。别画实现细节，服务级就够了。
保存成 ./docs/architecture.svg，dark 主题。

```

效果：

![](images/975826/cc4e5c990c7c820583138cd1b35805cf.png)

**常见坑和技巧**：

坑一：AI 容易把所有模块堆一起，一团乱麻。跟它说“分层”，mermaid 的 `subgraph` 会帮你分组。

坑二：AI 容易把日志、监控、配置中心这些周边也画进去，主干被淹没。多说一句“周边基础设施用一个方框概括就行，别展开”。

坑三：AI 画完一张图就停，不主动迭代。第一张出来直接说“把 XX 模块展开再画一张”。 **迭代是常态，一次画成很少**。

### 模块依赖图

mermaid 的 `graph LR` 或 `flowchart` 足够了。关键是 **让 AI 基于真实数据生成**，不要编。

**提示词**：

```plain
看一下我的 pom.xml，画一张项目内部模块之间的依赖图。
外部库不画。有循环依赖用红色标出来。
保存成 ./docs/module-deps.svg。

```

效果：

![](images/975826/110ef8283461288aff685c311b0ceac8.png)

**关键点**：要求它“看 pom.xml”，说清楚让它读真实文件。不说它可能根据项目名脑补。

### 时序图

mermaid 的 `sequenceDiagram`。画一次 API 调用的完整生命周期最顺手。

**提示词**：

```plain
帮我画 POST /api/prompts/create 这个接口的调用链时序图。
先去 grep 真实代码，从 Controller 一路追到 DB。
标清楚每一步是哪个类哪个方法，保存成 ./docs/sequence-create-prompt.svg。

```

效果：

![](images/975826/c032012c64eb43a7113a0717f75f7ea6.png)

**关键点**：一句“先 grep 真实代码”。不让它读代码，它就会根据接口名瞎猜调用链。

### 数据库 schema 图

mermaid 的 `erDiagram`。

**提示词**：

```plain
看项目里的建表 SQL（db/migration 或 resources 里），画一张 ER 图。
主键、外键、表之间的关系标清楚。保存成 ./docs/schema.svg。

```

效果：

![](images/975826/383e6f576229bd57fe48473a8a8d1312.png)

**关键点**：让它读真实 DDL 或 JPA entity，别根据表名猜字段。

## 让图真的好看：3 个细节

画出来 vs 画得好看是两回事。好看的图是你能一直留下来的，丑的图画完一次就丢。关注 3 个细节：

1. **加颜色**：同类模块一个色系。核心模块用冷色（蓝、紫），周边模块用暖色（灰、琥珀），外部系统用中性色。mermaid 里用 `classDef` 定义样式，批量应用。

2. **留白**：不要把每个节点都塞满字。每个方框一行标题 \+ 一句话描述足够，其他放到配套文档里讲。图是索引，不是百科。

3. **固定方向**：架构图要么自上而下（ `TD`），要么自左向右（ `LR`），选一个就不要换。整个项目的所有架构图保持同一方向，你扫一眼就能对照。


## 最后一个提醒：AI 画的图一定有错

装好工具、背熟提示词之后，你还需要守住一件事：AI 画的图一定有错。可能把一个已经废弃的模块画成核心，可能把一个重要的异步通道漏掉，可能把 3 个表的关系画反。可能把 Controller 的一个重载方法当成两个独立接口。

AI 基于它读到的代码画图， **它读到的不等于全貌**。老项目里那些代码之外的东西（隐性约定、历史包袱、对接方特殊需求）它看不见。

所以这一讲讲完画图能力，上一讲讲的八步心法第 8 步还要守住： **AI 画初稿，你 review，修正完存到项目 `docs/` 目录**。

这个修正过的图叫 `ARCHITECTURE.md` 里的那张架构图，或者项目 docs 里的那张数据流图。它是你理解这个项目的存档，下次打开项目或者新同事接手，这张图就是入门的第一份资料。图会过时，但存档过的图比脑子里的理解可靠得多。

## 小结

这一讲讲清楚了 5 件事。

1. **讲了 SKILL 生态**：Claude Code 不是出厂即定型的工具。 `~/.claude/skills/` 和项目的 `.claude/skills/` 是扩展点，装一个 SKILL 就多一项能力。这一讲做消费者，11 讲做生产者。

2. **装上了画图能力**：用 claude-mermaid 这套方案，Claude Code 能实时出 PNG / SVG / PDF，支持多种主题、浏览器实时预览。装法一行命令。

3. **四类图的对应场景**：架构图讲系统骨架、模块依赖图讲模块关系、时序图讲调用链、ER 图讲数据结构。老项目改造里反复需要这四类，其他类型偶尔用到再说。

4. **工具策略**：mermaid 为主（90% 场景），plantuml 和 drawio 兜底（复杂 UML 或精修交付图）。

5. **硬守的一条线**：AI 画的图一定有错。你要 review，要修正，要存档到项目 docs 里。画图这件事不是“AI 画完就完”，是“AI 起稿 + 你把关 + 留下资产”。


装好画图能力，下一讲我们真正动手，用这几类图给 Spring AI Alibaba Admin 画出完整的项目全景。

## 思考题

1. 你现在电脑上装的 Claude Code（或其他 AI 编程工具）装过几个 SKILL / Plugin？如果装过，它们解决了你什么具体问题？如果一个也没装，是没需求，还是不知道可以装？

2. 回想你最近接手或维护的项目，哪一类图（架构、依赖、时序、ER）你最缺？缺的原因是没画，还是画过但丢了？如果让你从零给那个项目补一张图，你会从哪一类开始？


欢迎在评论区把你的答案写出来。如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！