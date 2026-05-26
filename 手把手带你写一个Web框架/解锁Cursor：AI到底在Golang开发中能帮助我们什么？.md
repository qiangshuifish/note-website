# 解锁Cursor：AI到底在Golang开发中能帮助我们什么？
你好，我是轩脉刃。

距离 2021 年专栏上线，已经有 3 年时间了。这期间，互联网发生了翻天覆地的变化，Golang 编程领域也不例外。Golang 的版本从 1.16 升级到了 1.23、引入了范式，并且 Go Mod 彻底取代 Go Path 模式成为包管理器，Golang 引入了工作区模式等。而这些诸多变化，恐怕都及不上最热的 AI 带给编程领域的变化。

ChatGPT 3.5 自 2022 年问世以来，生成式 AI 彻底引发了各个行业大变革，AI 编程一直是热度很高的话题。“人人都是 AI 程序员”“使用 AI 构造一人公司”“AI 完全可以替代程序员” 等一直是大家讨论不休的话题。并且目前为止，AI 替代程序员编程已经不仅仅局限在讨论和想象层次了，国内所有大厂都有自己的 AI 代码编写工具，并已经逐步应用。

作为一线程序员，我也一直在研究 AI 到底能对 Golang 开发有什么帮助，亲身尝试过 Tabnine、GitHub Copilot、ChatGPT 等工具。近半年来，我越来越发现插件模式的 AI 编码工具已经不能很好满足我的编码需求了，我更希望的是一个以项目为单位，能按照我的需求创建、阅读、编写项目的独立 IDE。因此，我的 AI 编码工具逐渐从 GitHub Copilot + JetBrains 转为了 Cursor。

在使用 Cursor 开发 Golang 的过程中，我积攒了很多技巧，也踩了很多“坑”，想一次都分享给你。同时，我也想以 Cursor 为例，讲讲编码工具是如何赋能 Golang 编程的。

> 说明：本节使用的 Cursor 为版本 0.44.6，且开通了 pro 版的功能限制。
>
> 最新消息：截止 2024 年 12 月 22 日，Cursor 已成功完成 1 亿美元的 B 轮融资，此轮融资后的估值达到了 26 亿美元。

## 工具选择

Cursor 是几位麻省理工学院（MIT）的学生在 2022 年创立的一家公司 （cursor.Inc） 的产品，它并不是从头开始做一款 IDE，而是站在巨人的肩膀上，从 VSCode 项目 fork 出来源码，并且直接进行魔改，它不是以 VSCode 的插件形态展示，而是一个完整的兼容了 VSCode 所有插件和配置的 IDE 工具。

从插件到全新 IDE 工具，别看只是这么一小步的变化，对于编码的帮助却是巨大的。它让 AI 渗透到了编码的各种场景中，为各种场景提升效果。

总结下来，Cursor 目前提供了不同等级的编码辅助方式：

- Tab

- Inline Chat/Edit

- Chat

- Composer


了解这些辅助方式是上手使用 Cursor 的第一步。

### Tab

Tab 就是自动补全功能，我们在编写代码的过程中，Cursor 会根据上下文推测我们接下来要输出的代码是什么，并且在 IDE 中使用灰色将建议补充的代码展示出来，我们只需要使用 Tab 键就能让其自动完成。在日常编码过程中，这个功能是最常用的。

![图片](images/844259/da74282bb1fb022cf08d2fc95472cbef.png)

### Inline Chat/Edit

Inline Chat/Edit 是当我们选中 IDE 中一段代码的时候，系统会弹出 Chat/Edit 的内嵌框来针对这一段代码进行讨论和修改。它的好处是能将 Cursor 的改动限制在这一段代码中，而不会影响到其他的代码。

![图片](images/844259/863600974cc990a8528aa2176be3e9aa.png)

![图片](images/844259/f0aa247c4314c65f89321c53d9e54a2d.png)

对于 Inline Chat/Edit 的使用，Follow-up instrctions 是一个经常被忽略的功能。当 Cursor 按照提示增加的代码逻辑有一些瑕疵时，我们不要急着回滚 Cursor 的操作，而是可以使用 Follow-up instrctions 功能来追加提示和修改。Cursor 就会将两个提示词合成在一起，再进行一次变更。这个功能在无法一下子写出长且完整的 Cursor 提示词的情况下非常有效果。

![图片](images/844259/a8b688a0643280050ca1d5400cc844c9.png)

![图片](images/844259/cc1830a671b601639b623aeb95e4e37b.png)

### Chat

Chat 和 Composer 是以面板的形式内嵌在 IDE 右侧的。和名字一样，在 Chat 面板中，我们可以和模型进行对话交流。这里的交流并不会影响左侧代码区的代码，在 Chat 的对话框中，我们可以问任意的问题。

![图片](images/844259/dfec12503883698fdbab88f05144c25d.png)

在 Chat 对话框中，我们就能选择这次对话聊天使用的模型。关于模型的选择，我们在后面再详细聊。

![图片](images/844259/e85884d9aede6c1c428488a81a449c69.png)

### Composer

Composer 是 Cursor 团队精心打造的一项全新功能，可以说，没有用过 Composer 就不算真正用过 Cursor。

Composer 的面板和 Chat 的面板基本一模一样。 但是 Composer 的强大之处在于其不局限于一个文件的处理，可以同时处理多个文件，同时针对多个文件进行辅助开发，甚至你可以让它从零开始帮你创建多个文件，进而构造一个项目。对于需要处理大型复杂代码库的中高级开发者而言，无论是进行代码组件的修改、变量的跨文件转换，还是统一应用样式变更，Composer 都能完美满足你的需求。

![图片](images/844259/9ab6f5340f7b9bafe468dd90b5026dda.png)

## 模型选择

Cursor 是一个集成了多种模型的 AI 编码 IDE，模型对于它来说，就像是底座引擎。Cursor 支持的模型非常多：

- claude-3.5-sonnet-20241022

- claude-3.5

- cursor-small

- gemini-2.0

- gpt-4-turbo-2024-04-09

- gpt-4o

- o1

- …


这些模型都是不同大公司来支持维护的。其中，Claude 隶属于 Anthropic 公司，Gemini 隶属于 Google 公司，GPT 隶属于 OpenAI 公司。

我使用得最多的是 Claude 3.5 模型，在很长一段时间的各种测评中，Claude 在辅助编码方面的得分一直是最高的。

> 具体可以参考他们在 2024 年 6 月份发布的 [测评报告](https://www.anthropic.com/news/claude-3-5-sonnet)。

Cursor 的联合创始人 Aman Sanger 在 Lex Fridman 10 月的播客上对 Anthropic 大加称赞：“得益于对用户需求更深入的理解，最新版的 Claude 3.5 Sonnet 可以说是当前 **最佳** 的编程工具。”

为了让模型的回答更符合我们的要求，我们会在每次请求中设置 System Prompt。在 Cursor 中，我们也可以为模型设置一些默认提示词，这些提示词能有效规范模型的行为，称为 rule。

Cursor 的 rule 设置包括全局 rule 和项目 .cursorrules。在配置文件中，我们设置全局 rule，而对于不同项目，我们可以在项目中创建 .cursorrules 文件，为该项目设置特定的提示词。最终使用的提示词，是这两个地方的提示词合并后送入模型中的。

因此，全局提示词应尽量设置为通用的，与具体语言项目无关；而项目的 .cursorrules 提示词则应尽量包含项目的特性。以下是我使用的全局 rule：

```plain
1. Bug Fixes:
   - Analyze the problem thoroughly before suggesting fixes
   - Provide precise, targeted solutions
   - Explain the root cause of the bug

2. Keep It Simple:
   - Prioritize readability and maintainability
   - Avoid over-engineering solutions
   - Use standard libraries and patterns when possible

3. Code Changes:
   - Propose a clear plan before making changes
   - Do not alter unrelated files

Remember to always consider the context and specific requirements of each project.
Remember use chinese reply all question.

```

这个全局 rule 主要是为了提示 Cursor，尽量生成无 Bug 且简单可维护的代码，并且不要修改与需求无关的代码，同时尽量使用中文回答所有问题。

关于项目的提示词，每个项目，每个语言都不一样，这里无法给出一个统一的提示词。建议你参考 [https://cursor.directory/](https://cursor.directory/) 网站，其中对各种语言都有提示词的模板。比如 Golang 的提示词可以参考： [https://cursor.directory/go-api-standard-library-1-22](https://cursor.directory/go-api-standard-library-1-22)。

## 神秘的 @ 符号

在 Cursor 使用过程中，我们在 Chat 和 Composer 面板中输入 @ 符号，就会弹出很多关联的信息。 **了解并熟练使用这些信息，是使用好 Cursor 的关键**。下面我结合实际的场景来演示下这些 @ 符号都可以怎么使用。

![图片](images/844259/4a262d699fa7960f9da2767309089424.png)

### Files

Files 表示我们可以在描述中具体说明哪个文件或者哪些文件。

比如，我们现在需要 Composer 来修改 api\_goroutine.go 这个文件，将其中的所有函数都带上注释说明。

![图片](images/844259/ff1f8d3c8639f4fd4f22ef900951d300.png)

### Folders

Folder 能准确代表一个文件夹，我们可以这样描述：在某个文件夹下增加一个模块，具体参考某个文件夹内容等。这样就能将我们的改动限定在具体的文件夹中了。

![图片](images/844259/6ca327546402cd277813f6dd9f34a071.png)

我们看到，Composer 自动在 module 文件夹下创建了 student 文件夹，并参考 demo 实现了 5 个文件，实现了 DDD 业务模型，效果如下：

![图片](images/844259/275690758b8d7c2843dd6207263ab9dd.png)

### Code

Code 能具体代表某个函数，这是我使用最多的逻辑。我们为某个函数写个单元测试，修改调试某个函数，只要在提示词中使用 Code，就能很方便将 Cursor 的改动限定在某个函数中。

![图片](images/844259/9ec80b5155bd90787b1a07a4c074ayyd.png)

### Docs

Docs 是一个很强大的能力。我们在开发过程中经常需要引用一些第三方的接口，而这些第三方的接口是有官方文档的。比如下面我要创建一个gohade 框架的 provider，我们希望 Cursor 先阅读下官方文档 [https://github.com/gohade/hade/blob/main/docs/guide/provider.md](https://github.com/gohade/hade/blob/main/docs/guide/provider.md)，并参考这篇文档创建一个 student provider。我们可以在配置文件中的 Docs 部分先增加这个文档源，并命名为 hade\_provider\_md。

![图片](images/844259/ce7002d306fca2896ba8f35483fb216c.png)

![图片](images/844259/a8f68cc6dfde892ff4caf7901b74846c.png)

然后在 Composer 中输入这样的提示词：

![图片](images/844259/d190543a1eaa98yy136138f5c4750254.png)

最后的结果如下：

![图片](images/844259/08fa8905220140e7d47408913b444357.png)

### Git

Git 也是非常好用的一个功能。你能用 @Git 来引出某个 commit、某个 merge，然后可以让 Cursor 对它们进行 codereview，并提出优化建议，提示词如下：

```plain
这次更新 @reorg space_cache 有哪些变动，做一下总结，并且提出一些优化建议

```

输出结果如下：

![图片](images/844259/3accaff1191d09bc1baf6f31222b798d.png)

### Notepad

在实际项目开发过程中，我们实际上是为了某个“需求”来提交多次的开发。那么这个需求就是我们的最终目标，我们需要完整描述它，也就是你想做什么，希望用什么框架来做。这就是 Cursor 提供的 Notepad 的功能。

我们可以使用 cmd+shift + i 打开 Notepad 面板，或者使用命令面板打开 Notepad 视图，创建一个新的 Notepad。

![图片](images/844259/d03a918b21ef0542bf9b48fc27d92a35.png)

我们可以在 Notepad 上描述完整的需求，比如：

```plain
 我想要创建一个教学系统，表结构有 teacher，student，使用 gohade 进行实现。

 这个教学系统符合 gohade 框架的设计。

 教学系统有前台和后台。

 前台使用vue，后台使用 go。

 teacher 的服务提供完整的provider，provider 中有增删改查操作。

 student 的服务提供完整的provider，provider 中有完整的增删改查操作。

```

这个需求当然是越精确越好。后面我们的每个命令都可以按照这个需求作为目标，来一步步实现。比如现在我们要实现 teacher 的 provider，就可以直接用提示词：

```plain
请按照 @system 思路，创建一个 teacher 的 provider。

```

它就会按照我们专栏中 Hade 框架的逻辑，创建一个teacher 的 provider 了。

![图片](images/844259/d02b7e7c7fffdca19ec17ec24ccfef69.png)

我们通过不断更新和使用 Notepad，来告诉 Cursor 我们的目标，能有效保证模型每次生成的代码都是朝着我们的“需求”前进的。

### Suggested

这个功能我用得比较少。当你输入一个单词的时候，Cursor 会根据你的输入猜测你想改动哪个文件，并且在列表中给出建议。但是实际上，如果你有明确的修改目标，这个功能用得就不多了。

![图片](images/844259/ea46b697ca0f4c0c202c12d235d1e80b.png)

### Codebase

Codebase 就代表整个项目，Cursor 不会将你的整个项目代码放到云上，但是以上的 Files、Folder、Code 又能很精准地定位到你项目中的某行代码，原理就是这个 Codebase。

它将你的项目代码向量化存储索引。每次你改动了项目中的代码，这 Codebase 就会重建。我们可以在 Cursor 的设置项中看到 Codebase 的 sync 进度。

![图片](images/844259/98ec771c7c4136795b0a2c4003c01dc2.png)

当我们在 Composer 中 @Codebase 的时候，就是希望 Cursor 能索引整个项目。这个对于大型的重构，或者阅读整个项目非常有用。

比如我要修改 Teacher 中的某个字段的类型，会涉及修改多个文件，当我将 Codebase 应用在提示词中的时候，模型就会去索引使用 Teacher 结构的文件，并且让模型分析这些使用的地方，给出修改建议。

提示词可以是：帮我分析下整个项目 @Codebase，告诉我有哪些文件使用了 @Teacher 这个数据结构，我需要将 CreateAt 属性修改为 time.Time。

![图片](images/844259/f16acfe13d87288a902b4da062f72ba2.png)

### Web

我们都知道，模型是需要预训练的，所以它里面的知识可能是旧的，那么我要如何获取互联网上最新的信息呢？这就要使用到 Web 了。

比如我想将项目中 Go 的版本升级到最新，我需要知道目前互联网上最新的版本是多少，那我就可以在 Composer 中使用 Web 这个提示词，告诉 Cursor 先去 Web 上查找下最新的 Go 版本，再做具体的操作。

提示词可以是：请问 @Web 最新的 Go 版本是多少，我想将我的项目 Go 升级为这个最新版本，要做哪些改动？

![图片](images/844259/da699898e0f8c854e0f3d7dc434afebe.png)

## Cursor 如何赋能 Golang 编程

我们说了这么多，基本把 Cursor 的常用用法都说清楚了。但是再厉害的武器，不知道如何使用它，也只是一堆废铁。那在 Golang 的业务开发过程中，我们该如何使用 Cursor 来提升效率呢？有哪些场景可以使用 Cursor 呢？

作为一名深度使用 Cursor 开发 Golang 业务长达半年的用户，我将以亲身使用经验告诉你，Cursor 是如何赋能 Golang 编程的。

### 场景 1：批量操作

我这里说的批量操作场景指的并不是 IDE 中已经有的重命名函数、变量名这种简单的批量操作需求，而是一种模糊的批量操作场景，即一种更高维度的批量操作，我说几个例子你就明白了。

首先是批量增加注释。

一个文件夹中有很多函数，我在编写的时候忘记给函数增加注释了，在最后提交的时候，我希望为每个函数增加下注释。这时候我们可以在 Composer 中这样描述：

```plain
请帮我给 @lib 文件夹中的每个对外可见的函数增加注释，
要求注释以函数名开头，并且用中文描述。

```

这样，就不需要你手动一个个函数修改，也不需要你理解函数内容，就能在多个文件中，为所有对外可见的函数增加符合规范的注释。

然后是批量修改日志。

在实际开发过程中，我的日志描述不是很标准，事先并没有思考很清楚，在代码 cr 的时候，leader 建议我给这个需求文件夹下的每个日志输出增加 \[key\_step\] 的前缀。我不需要在一个个日志输出的地方修改，只需要在 Composer 中增加一句简单描述：

```plain
请帮我给 @lib 文件夹中的每个日志增加[key_step]的前缀，方便于进行日志的业务分析。

```

你不用写一句代码，Cursor 就会修改这个文件夹中的每行日志，你所做的仅仅是点击下 accept all 按钮。

### 场景2：单元测试

Golang 是强类型语言，相较于弱类型语言，每个变量在定义时就决定了类型，其实很便于写单元测试。但是往往由于工期原因，我们在写一个函数或者类的时候，并不会为其写单元测试。

不过， **时间在 Cursor 面前永远不是问题**。

我们写完一个类、一个方法，在 Composer 中告诉 Cursor：

```plain
请帮我为 code @TeacherProvider 写单元测试，
要求使用table-driven 方法构造单测用例，
单元测试单独放一个文件中

```

一段完善的、可运行的单元测试，就输出在我们面前了。

更美好的事情还在后面。当我们后续做业务迭代的时候，修改了某个类的结构或者修改了某个方法的输入参数和输出参数。我们可以让 Cursor 帮忙修改下测试用例。

```plain
我已经修改了 code @TeacherProvider 的结构，增加了一个Name 字段。
要求更改测试用例 @TestTeacherProvider 函数，增加 Name 字段的测试逻辑。
具体的 Name 赋值逻辑可以参考 code @TeacherProvider 的实现

```

### 场景3：源码阅读

我在实际工作中，经常需要阅读别人写的 Golang 函数，梳理一个很长的历史代码逻辑是很繁琐且耗时的事情。这个时候，我们希望的是有人能帮忙先读一下某个函数的实现逻辑，并且将逻辑用图形形式输出，辅助我理解。

这个情况我一般会使用 Chat：

```plain
帮忙阅读一下 code @TeacherProvidor.Process 函数，
其中使用到的下一级别的函数逻辑可以在 @codebase 中查找。
绘制出这个函数的核心调用链路，用 markdown 的 mermaid 绘制出一个代码的流程图，
并将绘制的 markdown 放在 readme.md 文件中

```

于是，Cursor 就会绘制出类似如下的代码流程图。

![](images/844259/228fcf1e72c51567abc5ca76cf2eb394.jpg)

跟着图再阅读代码，是不是就简单很多了？

### 场景4：代码改写

当已经有了旧实现方式，为了达成目的而使用新实现方式时，Cursor 就能很准确地参考旧的实现意图来实现新的方式。

这样说还是有点抽象，我举几个我实际遇到的情景。

情景一，现在我有一个库文件，其中有 10+ 个方法，原本是使用 Redis 的 lua 脚本实现某个逻辑。但在使用过程中发现了一个问题： Redis 多 slot 的问题导致 lua 脚本不可使用。经过紧急讨论，我们决定用 Redis 的 pipeline 替换原先的 lua。但棘手的是，留给我们重构的时间只有一个晚上了。

还是那句话，时间在 Cursor 面前不是问题。

我给 Cursor 的提示词如下：

```plain
将 file @redis_op.go 文件中的涉及 lua 操作的函数都改写为使用 pipline 来操作redis。
其中要求：
1 新改写的 pipline 逻辑和之前的 lua 脚本逻辑是一致的
2 为新写的 pipline 逻辑增加测试用例

```

一行命令下去，这 10+个方法在几分钟内都替换为 pipeline 的实现。我要做的只是验证测试。

情景二，我写了一段代码，是在 for 循环中调用 go() { Foo() } 的 RPC函数。这其实在高并发情况下可能会导致 goroutine 数量变多，我希望能控制 goroutine 的数量，于是就使用了如下脚本：

```plain
帮我把 code @TeacherProvider.List 函数重构下，
我希望最多只能出现 4 个 goroutine
任务通过 channel 传递给这4 个 goroutine。
这样我们就能控制 goroutine 数量了。

```

Cursor 就帮我实现了一个简单的 goroutine 的协程池：

![图片](images/844259/71ea7cb87afe4086f31f553bc76579d3.png)

我之前已经定义好 List 中的业务逻辑，所以 Cursor 只是修改了其中的并行度。对于这种有业务逻辑，只需要更新并发处理逻辑的任务，Cursor 一般能一次完美通过。

## 总结

现在，相信你对 Cursor 这个工具已经有了一个比较全面的认识。它不仅仅是一个简单的代码补全工具，而是一个真正能帮助我们提升开发效率的 AI 助手。

从最基础的 Tab 补全，到强大的 Composer 多文件编辑，再到各种 @ 符号的巧妙运用，Cursor 为我们提供了一整套完整的 AI 辅助开发解决方案。特别是它那些神奇的 @ 符号功能，真是让人越用越上瘾：想查最新文档用 @Web；要改多个文件用 @Codebase；需要参考文档就 @Docs。简直不要太方便！

不过，工具再好，也需要我们花时间去熟悉和掌握。建议你可以先从最基础的 Tab 补全开始用起，慢慢过渡到 Chat 和 Composer，等对这些基础功能熟悉了，再去尝试那些高级的 @ 符号功能。相信随着使用的深入，你一定会和我一样，爱上这个强大的 AI 编程助手。

最后我想说，AI 工具确实能帮我们提升效率，但它终究只是个工具。作为开发者，我们还是要不断学习，提升自己的编程能力。毕竟，能让 AI 产出更好代码的前提，是我们自己得先懂得什么是好代码，对吧？

好了，希望这篇文章能帮助你更好地使用 Cursor 做些 Golang 开发，如果你有什么使用心得，也欢迎在留言区和我一起交流分享！