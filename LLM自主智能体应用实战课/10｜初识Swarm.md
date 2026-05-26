# 10｜初识Swarm
你好，我是李锟。

在学习了 MetaGPT 和 AutoGPT 两个很不相同的开发框架之后，我们今天开始学习第三个多 Agent 应用开发框架——Swarm。Swarm 是一个非常轻量级、非常精益的开发框架，学习门槛很低，很容易上手，因此这两课学习起来会更加轻松愉快。

学习过 [01 课](https://time.geekbang.org/column/article/838710) 之后，相信你已经理解了我特别喜欢这种轻量级的开发框架的原因。Swarm 是所有多 Agent 开发框架中最轻量级的，正是我喜欢的类型。不过，轻量级不代表它只是一个玩具，没有实用性，很快你就会看到它的威力。

Swarm 比 MetaGPT 更轻量级，只依赖 Python。可以使用 Python 3.12 及以上版本，以下所有 Python 代码我都是使用 Python 3.12 开发的。

## Python 项目初始化

为了学习 Swarm，我们首先初始化一个 Python 项目。在 Linux 主机的终端窗口执行以下命令：

```plain
mkdir -p ~/work/learn_swarm
cd ~/work/learn_swarm
touch README.md
# 创建poetry虚拟环境，一路回车即可
poetry init

```

因为众所周知的原因，建议使用国内的 Python 库镜像服务器，例如上海交大的镜像服务器：

```plain
poetry source add --priority=primary mirrors https://mirror.sjtu.edu.cn/pypi/web/simple

```

如果上海交大镜像服务器的访问速度很慢，也可以使用其他镜像服务器，你可以自己搜索其他镜像服务器的地址。

然后安装一些常用的 Python 库：

```plain
poetry add pysocks socksio

```

Swarm 项目是 OpenAI 内部开发人员为开源社区贡献的，核心开发人员是 OpenAI 公司的员工 Ilan Bigio 等人，于2024年10月15日开源。官方文档不多，和 [项目的源代码](https://github.com/openai/swarm) 一起，也在 GitHub上，主要就是其 GitHub 项目根目录的 README.md。

## 介绍 Swarm 的前身和 Assistants API

关于多 Agent 编排（multi-agent orchestration，即多 Agent 协作）的设计思想， Ilan Bigio 在2024年10月10日发布过一个教程： [Orchestrating Agents: Routines and Handoffs](https://cookbook.openai.com/examples/orchestrating_agents)，这个教程可以在 Jupyter Notebook 中运行和调试，感兴趣的话你可以读一下。

这个教程里的示例代码正是 Swarm 的前身，Ilan 和同事们在跑通了这个教程里多 Agent 协作的例子之后，将实现代码进一步提炼成一个轻量级的多 Agent 开发框架，并且贡献给开源社区，那就是 Swarm。

如果读过 Ilan 写的这个教程，就可以理解 Swarm 高度依赖 OpenAI 在 2023 年11月7日推出的 Assistants API，这一点与 MetaGPT、AutoGPT 是不同的。如果使用 Swarm 开发应用，选择LLM 时必须注意选择支持 Assistants API 的 LLM。幸运的是，我们常用的一些开源 LLM，包括阿里巴巴的 qwen2.5、Meta 的 llama3.1、Google 的 gemma2 都已经支持 Assistants API。你可以参考 [Assistants API 的官方文档](https://platform.openai.com/docs/assistants/overview)，最新的版本是第二版。

这里我们用一句话解释 Assistants API： **Assistants API 赋予了 LLM 调用外部工具（tools）的能力，而不是奢望由 LLM 自己搞定一切**。外部工具可以包罗万象，从精确的数学计算到访问社交媒体、搜索引擎、订票网站、本地数据库等等。Assistants API 可以说让 LLM 如虎添翼，不仅强化了 LLM 的大脑，也为 LLM 装上了健壮的四肢。例如，由 LLM 驱动的通用型工业机器人，配置了操控各种设备的工具，可以完成比传统的专用型工业机器人多得多的任务。使用这种通用型工业机器人生产不同的产品，只需要为其配置不同的工具和技能即可。

不使用 Assistants API 当然也可以实现 Autonomous Agent 应用了，例如我们在前面看到的，使用开源的 qwen2.5-math 来解决计算问题（验证 24 点表达式是否正确）。不过充分使用 Assistants API 的应用会更加灵巧。在下一课我们实现 Swarm 版本的 24 点游戏智能体应用时，不再使用 qwen2.5-math，而是基于 qwen2.5 的 Assistants API 和我们自己实现的验证函数来做计算，判断表达式是否正确。

## 安装 Swarm 并运行第一个例子

与 AutoGPT 类似，Swarm 目前也没有发布官方的 Python 库，只能使用源代码来安装。执行以下命令安装 Swarm：

```plain
cd ~/work
git clone https://github.com/openai/swarm.git
cd learn_swarm
# poetry add --editable "../swarm"
poetry install --no-root && poetry run pip install -e "../swarm" --config-settings editable_mode=compat

```

接下来我们运行一个简单的例子，验证 Swarm 是否可以正常工作。

在 Swarm 官方文档的例子中，LLM 默认使用的是 OpenAI 的 LLM，例如 GPT-4o-mini。没有 OpenAI 账号或者无法科学上网的话，可以使用通过 ollama 部署的 qwen2.5。因此在运行第一个例子之前，我们需要先搞清楚如何配置 Swarm，让它使用开源的 qwen2.5。

在 Swarm 的官方文档中并未提及如何使用开源 LLM 的问题，不过这难不倒我们，解决起来其实非常容易。在 [02 课](https://time.geekbang.org/column/article/838713) 我曾经提到过，ollama 提供了与 OpenAI 完全兼容的 API。Swarm 依赖的是 OpenAI 官方的 OpenAI 库，那么只需要配置一下 API 地址和 api key，就可以使用 OpenAI 库访问通过 ollama 部署的开源 LLM 了。为此我们需要做几件事。

1. 将官方例子中的 gpt-4o-mini 改为 qwen2.5。

2. 编辑一个 bash 脚本 run\_swarm\_app，使用此 bash 脚本来运行例子代码。


```plain
#!/bin/sh

export OPENAI_API_KEY="ollama"
export OPENAI_BASE_URL="http://127.0.0.1:11434/v1"

poetry run python $*

```

3. 上面 bash 脚本中的 OPENAI\_API\_KEY、OPENAI\_BASE\_URL 两个环境变量也可以设置在 ~/.profile 文件中，这样每次登录 Linux 主机后会自动设置两个环境变量。

在 ~/work/learn\_swarm 目录中创建第一个代码示例，保存为 test\_swarm.py。

```plain
from swarm import Swarm, Agent

client = Swarm()

def transfer_to_agent_b():
    return agent_b

agent_a = Agent(
    name="Agent A",
    instructions="You are a helpful agent.",
    model="qwen2.5",
    functions=[transfer_to_agent_b],
)

agent_b = Agent(
    name="Agent B",
    instructions="Only speak in Haikus.",
    model="qwen2.5",
)

response = client.run(
    agent=agent_a,
    messages=[{"role": "user", "content": "I want to talk to agent B."}],
)

print(response.messages[-1]["content"])

```

使用 bash 脚本 run\_swarm\_app 运行这个例子：

```plain
run_swarm_app test_swarm.py

```

如果看到以下输出内容，说明 Swarm 已经能够正常工作了。

```plain
Seeking B now,
Whispers through digital link,
New path, new voice.

```

## Swarm官方文档导读

第一个例子运行成功之后，我再带你对 Swarm 的官方文档做个导读。Swarm 的官方文档内容不多，很快就能读完。

### Swarm的核心概念

Swarm 最核心的两个概念是 **Agent（智能体）和 Handoff（移交）**。可以用一句话来概括它们之间的关系：智能体包含了指令和工具，可以随时选择将对话移交给另一个智能体。

为什么要选择 Swarm 呢？在官方文档里是这样说的：

Swarm 探索的是轻量级、可扩展和高度可定制的设计模式。类似 Swarm 的开发方法最适用于处理大量独立功能和指令的情况，因为这些功能和指令很难被编写为单个提示词。

对于需要完全托管线程（fully-hosted threads）、内置内存管理（built in memory management）、检索（retrieval）等功能的开发人员来说，Assistants API 是一个不错的选择。 不过，对于想了解多 Agent 编排（multi-agent orchestration）的开发人员来说，Swarm 是一种很好的教育资源。 Swarm 几乎完全在客户端上运行，与（OpenAI 的）Chat Completions API 一样，不会在调用之间存储状态。

从这段描述可以理解，在 Swarm 中固化了一组代表着多 Agent 应用开发最佳实践的 **设计模式**，基于这些设计模式可以解决单个提示词无法解决的复杂问题。Swarm 以 Assistants API 作为基础，并且提供了一些方便使用的组件，大幅降低了使用 Assistants API 的门槛。我的建议是，以后任何时候需要通过 Assistants API 来配置和调用外部工具，都应该首选使用 Swarm，而不是自己手写代码。

下面我们继续学习官方文档中的细节，以下内容需要结合前面第一个例子的代码来学习。

### Swarm 实现详解

#### Swarm 的 run() 函数

关于 Swarm 的 run() 函数，文档中是这样描述的：Swarm 的 run() 函数类似于 Chat Completions API 中的 chat.completions.create() 函数–它接收消息并返回消息，调用之间不保存任何状态。 但重要的是，它还能处理 Agent 相关函数的执行、移交、上下文变量引用，并且能在返回用户之前进行多次循环。

Swarm 的 client.run() 的核心是实现以下循环：

- 从当前 Agent 中调用 LLM 的 Chat Completions API。

- 若 LLM 返回的响应消息中有新的函数调用（message.tool\_calls 不为空），表示需调用外部工具，执行相应的工具调用并将工具调用的结果附加到会话历史。

- 必要时可切换 Agent。

- 必要时可更新上下文变量。

- 若 LLM 返回的响应消息中没有新的函数调用（message.tool\_calls 为空），表示无需调用外部工具，则返回。


一旦 client.run() 完成（在可能多次调用 Agent 和工具后），它将返回一个包含所有相关更新状态的 Response。 具体来说，响应中包括了新的消息、最后调用的 Agent 以及最新的上下文变量。 你可以将这些值（加上新的用户消息）传递给下一次执行的 client.run()，以便在中断的地方继续交互，就像 chat.completions.create() 所做的那样（run\_demo\_loop 函数在 /swarm/repl/repl.py 中实现了一个完整执行循环的示例）。

从这些内容可以理解，Swarm 类中的 run() 函数是 Swarm 的核心实现。因此我强烈建议你都去读一下 run() 函数的代码，其实现位于 Swarm 源代码的 “/swarm/core.py” 文件中。在下一课中我会对 run() 函数做一些增强。

#### Agent

关于 Agent，文档中说道：一个 Agent 简单地封装了一组指令和一组功能（加上下面的一些附加设置），并具有将执行权移交给另一个 Agent 的能力。

虽然将 Agent 人格化为“做 xxx 的人”很有诱惑力，但它也可以用来表示由一组指令和功能定义的非常具体的工作流或步骤，例如，一组步骤、复杂的检索、数据转换的单一步骤等。 这样，智能体应用就可以实现为一个由“agents”“workflows”（工作流）和“tasks”（任务）组成的网络，所有这些都可以由相同的 **原语**（primitive）来表示。

Agent 包括了 name、model、instructions、functions、tool\_choice 5 个字段。这里我们需要详细介绍的是 instructions 和 functions 两个字段。

Agent 的 **instructions**（指令）字段会直接转换为对话的系统提示词（作为第一条信息）。 在任何时候，只有当前活动的 Agent 的 instructions 会出现。例如，如果有 Agent 切换，系统提示会改变，但聊天记录不会改变。

```plain
agent = Agent(
   instructions="You are a helpful agent."
)

```

instructions 可以是普通的字符串，也可以是返回字符串的函数。instructions 函数可以选择接收一个 context\_variables（上下文变量）参数，该参数将由传入 client.run() 的 context\_variables 填充。

```plain
def instructions(context_variables):
   user_name = context_variables["user_name"]
   return f"Help the user, {user_name}, do whatever they want."

agent = Agent(
   instructions=instructions
)
response = client.run(
   agent=agent,
   messages=[{"role":"user", "content": "Hi!"}],
   context_variables={"user_name":"John"}
)
print(response.messages[-1]["content"])

```

在下一课中，我们将会看到 instructions 函数的具体使用。

#### Functions (函数)

接下来需要深入理解的是 Agent 的 functions 字段以及与之相关的外部函数。

文档中说道：

- Swarm 的 Agent 可以直接调用 Python 函数。

- 函数通常返回一个字符串（返回值将被尝试转换为字符串）。

- 如果函数返回一个 Agent，执行权将被转移给该 Agent。

- 如果函数定义了 context\_variables（上下文变量）参数，它将由传入 client.run() 的 context\_variables 填充。


```plain
def greet(context_variables, language):
   user_name = context_variables["user_name"]
   greeting = "Hola" if language.lower() == "spanish" else "Hello"
   print(f"{greeting}, {user_name}!")
   return "Done"

agent = Agent(
   functions=[greet]
)

client.run(
   agent=agent,
   messages=[{"role": "user", "content": "Usa greet() por favor."}],
   context_variables={"user_name": "John"}
)

```

- 如果 Agent 函数调用出错（错误的函数、参数错误、运行出错），错误响应会被附加在聊天中，以便 Agent 能够优雅地恢复。

- 如果 Agent 调用了多个函数，它们将会按顺序执行。


一个 Agent 可以通过在函数中返回的方式移交给另一个 Agent。

```plain
sales_agent = Agent(name="Sales Agent")

def transfer_to_sales():
   return sales_agent

agent = Agent(functions=[transfer_to_sales])

response = client.run(agent, [{"role":"user", "content":"Transfer me to sales."}])
print(response.agent.name)

```

它还可以通过返回一个更完整的结果对象来更新上下文变量。 该对象还可以包含一个值和一个 Agent，以避免需要用一个函数来返回一个值、更新 Agent 和更新上下文变量（或三者的任何子集）。

```plain
sales_agent = Agent(name="Sales Agent")

def talk_to_sales():
   print("Hello, World!")
   return Result(
       value="Done",
       agent=sales_agent,
       context_variables={"department": "sales"}
   )

agent = Agent(functions=[talk_to_sales])

response = client.run(
   agent=agent,
   messages=[{"role": "user", "content": "Transfer me to sales"}],
   context_variables={"user_name": "John"}
)
print(response.agent.name)
print(response.context_variables)

```

Swarm 会自动将函数转换为 JSON 模式（Schema），并将其传递给 Chat Completions 的 tools（client.chat.completions.create() 的 tools 参数）。

- 函数中的 docstring（文档字符串）会被转换为函数描述。

- 没有默认值的参数会被设置为 required（必需的）。

- 类型提示会被映射到参数类型（默认为字符串）。

- 尚未明确支持每个参数的描述（per-parameter descriptions），但如果只是添加到 docstring 中，也会有类似的效果（将来可能会添加 docstring 参数解析功能）。


这节课的开头我已经介绍过，Swarm 高度依赖 Assistants API。为每个 Agent 配置的外部函数就是基于 Assistants API 实现的。外部函数可谓是 Swarm 应用的灵魂，不开发外部函数，就不是真正的 Swarm 应用。

#### 流式交互

与 openai 库相同，Swarm 也支持与 LLM 的流式交互（streaming）。

```plain
stream = client.run(agent, messages, stream=True)
for chunk in stream:
   print(chunk)

```

Swarm 使用了与 [Chat Completions API streaming](https://platform.openai.com/docs/api-reference/streaming) 相同的事件。你可以参考 “/swarm/repl/repl.py” 中的 process\_and\_print\_streaming\_response 这个例子。

Swarm 还新增了两个事件类型：

- {“delim”: “start”} 和 {“delim”: “end”}，用于在每次 Agent 处理单个消息（响应或函数调用）时发出信号。 这有助于识别 Agent 之间的切换。

- {“response”: Response} 将在流的末尾返回一个 Response 对象，其中包含汇总（完整）的响应，方便使用。


对于流式交互的支持在开发 ChatBot 类应用时非常有用，不过对于开发 Autonomous Agent 应用来说用处不是很大。

### Swarm 应用的性能评估

性能评估对于任何项目都至关重要，Swarm 开发团队鼓励开发人员开发自己的评估套件来测试其 Swarm 应用的性能。 作为参考，Swarm 开发团队通过 airline、weather\_agent 和 triage\_agent 这几个例子展示了评估 Swarm 应用性能的方法。 详情可以参阅这些例子目录中的 README.md。

Swarm 官方提供的例子在项目源代码的 “/examples” 目录下，这些例子对于进一步深入学习和评估 Swarm 非常重要。

### 一个有用的工具

开发者还可以使用 run\_demo\_loop 来测试自己的 Swarm 应用。这个工具会在命令行上运行 一个 REPL，同样也支持流式交互。

```plain
from swarm.repl import run_demo_loop
...
run_demo_loop(agent, stream=True)

```

## 总结时刻

从目前的阶段看来，Swarm 是最轻量级、最易学易用的多 Agent 应用开发框架。很多资深开发人员常常轻视甚至鄙视轻量级的开发框架，以使用复杂的开发框架、增加应用的复杂度为荣。这种思维其实是极其有害的，完全不符合敏捷、精益的要求。

其实资深开发人员应该追求的是保持同理心，帮助用户解决业务中遇到的各种痛点，高效地解决用户真正关心的业务问题。资深开发人员应该围绕这个目标来选择最适合的开发框架，而不是一味地 Design by Buzzwords，人为添加大量不必要的复杂性，延迟项目或产品的上线时间。

Swarm 这样的轻量级开发框架，非常适合快速开发各种原型应用或 PoC 应用，这也是我选择它的主要原因。我们需要的是剑宗模式注重效率的实用主义，在解决用户最关心的困难问题中快速学习进步，而不是气宗模式的那种教条主义。

在下一课中，我们将再次撸起袖子，使用 Swarm 来实现 24 点游戏智能体应用。对于本节课的有些内容暂时不理解也没有关系，因为在下一课我们实现 Swarm 版 24 点游戏智能体应用时，会用到这节课讲过的大多数知识。

## 思考题

通过 LLM 的 Assistants API 来实现外部工具的调用，与不通过 Assistants API 实现外部工具的调用相比，有哪些优点？

期待你的分享。如果今天的内容对你有所帮助，也期待你转发给你的同事或者朋友，大家一起学习，共同进步。我们下节课再见！