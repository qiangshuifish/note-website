# 23｜使用Agent SDK实现Autonomous Agent应用
你好，我是李锟

这门课程于 2025 年 3 月初刚刚完成，不到一周之后 OpenAI 就发布了新的开源 Autonomous Agent 开发框架 Agent SDK。Agent SDK 可以看作是 OpenAI 去年发布的 Swarm 的升级版本，具有 Swarm 的所有功能。在这门课程中我已经讲解过 Swarm，我觉得很有必要及时补充关于 Agent SDK 的内容。此外，在这门课程中我讲解过的 MetaGPT、AutoGPT、DSPy 也都还在发展的过程中，后续也会有不少新的开发成果值得介绍。

近期还有一个很重要的技术动向是，越来越多的 Autonomous Agent 开发框架都开始支持 [MCP 规范](https://www.claudemcp.com/zh) (Model Context Protocol，模型上下文协议)。晚些时候我也会介绍 MCP 相关内容，这节课我们先聚焦在 Agent SDK 上面。

## Agent SDK 官方文档导读

Agent SDK 的官方文档在这里： [https://openai.github.io/openai-agents-python/](https://openai.github.io/openai-agents-python/)

与之前的学习步骤相同，首先我们需要粗略浏览一下 Agent SDK 的官方文档。与其去读很多关于 Agent SDK 的二手、三手文章，亲自去读官方文档是更好的学习方法。

大致浏览一下官方文档，就会感到 Agent SDK 的功能比 Swarm 丰富了很多，文档也详细的多。这说明 OpenAI 对于开源的态度发生了很大变化，比去年要认真的多，这是很好的事情。

因为我们已经学习过 Swarm，我在这里对比一下 Agent SDK 与 Swarm 的相同点和不同点。

Swarm 的基础概念是 Agent、Handoff，Agent SDK 在原先 Agent 和 Handoff 之外，还添加了一个 Guardrail。Agent SDK 官方文档中对这三个概念的介绍为：

- Agent（代理）：即配备指令和工具的 LLM。
- Handoff（移交）：允许代理委托其他代理执行特定任务。
- Guardrail（护栏）：对代理的输入、输出进行校验。

后面我会用一个例子来展示 Guardrail 的使用方法。

与 Swarm 相同，Agent SDK 仍然是基于 Assistant API 来实现的，因此与 Swarm 一样无法使用不支持 Assistant API 的基础 LLM，例如 o1、o1-mini、qwen2.5-math、deepseek-r1 这些数学推理模型。不过阿里云新发布的数学推理模型 qwq:32b 是支持 Assistant API 的，因此可以与 Agent SDK 配合使用。

在 Agent SDK 中，可以为 Agent 配置一些 Tools（工具）。除了像 Swarm 那样支持 Python 函数作为 Tools 外，还支持把另一个 Agent 当作 Tools 来调用。这样就可以实现类似 AutoGPT Platform 中那种分层的 Agent 体系架构。

然而需要特别注意的是，Agent SDK 中 Handoff 的用法其实与 Swarm 中的 Handoff 用法是不同的，也可以理解为 **Agent SDK 重新定义了 Handoff 这个概念及其用法**。

在 Swarm 中，是通过在 Python 函数中返回一个 Result 对象，这个对象指定另一个 Agent，从而将对话的控制权移交给另一个 Agent。具体代码请参考 [第 11 课](https://time.geekbang.org/column/article/842497) 的内容。

在 Agent SDK 中，不再支持 Swarm 中的这种用法。而是在创建某个 Agent 时，明确指定 handoffs 参数，这个参数可以设置多个 Agent，依靠基础 LLM 的理解能力，动态决定将对话控制权移交给哪个 Agent。同样后面我也会用一个例子来展示这些不同的用法。

此外，Agent SDK 还有很多 [支持跟踪调试的功能](https://openai.github.io/openai-agents-python/ref/tracing/traces/)。这些功能对于排查错误非常有帮助，建议课后花时间仔细看一下。

比起 Swarm 仅有很少的例子，Agent SDK 提供了比较丰富的使用例子。Agent SDK 官方还提供了一些开箱即用的工具和组件。

Swarm 项目主页的开头已修改为：

> Swarm is now replaced by the OpenAI Agents SDK, which is a production-ready evolution of Swarm. The Agents SDK features key improvements and will be actively maintained by the OpenAI team.
>
> We recommend migrating to the Agents SDK for all production use cases.

建议所有的人都迁移到 Agent SDK。并且在 Agent SDK 项目主页中还承诺 Agent SDK 以后会持续发展下去，这也是一个好消息。

> We’re committed to continuing to build the Agents SDK as an open source framework so others in the community can expand on our approach.

浏览过 Agent SDK 的官方文档，我们马上进入实战环节。

## Agent SDK 实战

### Python 项目初始化

为了学习 Agent SDK，我们首先初始化一个 Python 项目。在 Linux 主机的终端窗口执行以下命令：

```plain
mkdir -p ~/work/learn_agent_sdk
cd ~/work/learn_agent_sdk
touch README.md
# 创建poetry虚拟环境，一路回车即可
poetry init

```

因为众所周知的原因，建议使用国内的 Python 库镜像服务器，例如上海交大的镜像服务器：

```plain
poetry source add --priority=primary mirrors https://mirror.sjtu.edu.cn/pypi/web/simple

```

如果上海交大镜像服务器的访问速度很慢，也可以使用其他镜像服务器，你可以自己搜索其他镜像服务器的地址。

Agent SDK 既可以使用源代码来安装，也可以使用官方发布的库来安装。官方发布的库名叫 openai-agents。我在这里还是使用源代码来安装，这样在必要时修改其源代码（打补丁）会很方便。

执行以下命令安装 Agent SDK：

```plain
cd ~/work
git clone https://github.com/openai/openai-agents-python.git
cd learn_agent_sdk
# poetry add --editable "../openai-agents-python"
poetry install --no-root && poetry run pip install -e "../openai-agents-python" --config-settings editable_mode=compat

```

与使用 Swarm 类似，首先我们需要解决 Agent SDK 如何调用 OpenAI 之外其他厂商 LLM 的问题。Agent SDK 是使用 OpenAI API 来调用基础 LLM，所以其他基础 LLM 只要支持 OpenAI API，就可以通过 Agent SDK 来使用。我在这里还是继续使用在前面课程中通过 Ollama 部署的开源 LLM qwen2.5:7b，部署方法在 [第 02 课](https://time.geekbang.org/column/article/838713) 中有介绍。

编辑一个 bash 脚本 run\_agent\_sdk\_app，使用此 bash 脚本来运行例子代码。

```plain
#!/bin/sh

export EXAMPLE_API_KEY="ollama"
export EXAMPLE_BASE_URL="http://127.0.0.1:11434/v1"

poetry run python $*

```

EXAMPLE\_API\_KEY、EXAMPLE\_BASE\_URL 这两个环境变量分别对应 OpenAI API 的 api\_key 和 base\_url。Ollama 的后台服务会部署一个 OpenAI API 兼容的 API。

### 测试 Guardrail 的例子

接下来我们编写一个测试 Guardrails 用法的例子 test\_guardrail.py。

```plain
import asyncio
import os

from pydantic import BaseModel
from agents import Agent, InputGuardrail,GuardrailFunctionOutput, Runner
from agents.models.openai_provider import OpenAIProvider

API_KEY = os.getenv("EXAMPLE_API_KEY")
BASE_URL = os.getenv("EXAMPLE_BASE_URL")

provider = OpenAIProvider(
        api_key=API_KEY,
        base_url=BASE_URL,
        use_responses=False
    )
model = provider.get_model("qwen2.5")

class HomeworkOutput(BaseModel):
    is_homework: bool
    reasoning: str

guardrail_agent = Agent(
    name="Guardrail check",
    instructions="Check if the user is asking about homework.",
    output_type=HomeworkOutput,
    model=model
)

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

calendar_agent = Agent(
    name="Calendar extractor",
    instructions="Extract calendar events from text",
    output_type=CalendarEvent,
    model=model
)

math_tutor_agent = Agent(
    name="Math Tutor",
    handoff_description="Specialist agent for math questions",
    instructions="You provide help with math problems. Explain your reasoning at each step and include examples",
    model=model
)

history_tutor_agent = Agent(
    name="History Tutor",
    handoff_description="Specialist agent for historical questions",
    instructions="You provide assistance with historical queries. Explain important events and context clearly.",
    model=model
)

async def homework_guardrail(ctx, agent, input_data):
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
    final_output = result.final_output_as(HomeworkOutput)
    return GuardrailFunctionOutput(
        output_info=final_output,
        tripwire_triggered=not final_output.is_homework,
    )

triage_agent = Agent(
    name="Triage Agent",
    instructions="You determine which agent to use based on the user's homework question",
    handoffs=[history_tutor_agent, math_tutor_agent, calendar_agent],
    input_guardrails=[
        InputGuardrail(guardrail_function=homework_guardrail),
    ],
    model=model
)

async def main():
    result = await Runner.run(triage_agent, "I need to write a composition about what is life. This is the homework of my English class.")
    print(result.final_output)

    result = await Runner.run(triage_agent, "What is life?")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())

```

使用刚才编写的 bash 脚本运行这个例子：

```plain
run_agent_sdk_app test_guardrail.py

```

在这个例子的代码中，需要注意的内容包括：

1. 为 qwen2.5 创建一个 model 对象。之后创建每个 Agent 时，指定使用这个 model 对象作为基础 LLM。

2. 使用一个专门的 triage\_agent 来做任务的分发。

3. 使用 homework\_guardrail() 函数作为 Agent 的 InputGuardrail，验证用户输入的内容是否与家庭作业有关。
   - 如果输入内容与家庭作业有关，则按照其类型分别调用 history\_tutor\_agent、math\_tutor\_agent、calendar\_agent 这三个子 Agent。这三个子 Agent 作为 triage\_agent 的 handoffs 参数来设置。

   - 如果输入内容与家庭作业无关，则会抛出异常。例如例子里面，如果只输入 What is life?，而不明确说明这是与家庭作业有关，triage\_agent 不认为这个输入内容与家庭作业有关，所以会抛出异常。
4. 除了设置 InputGuardrail 对 Agent 的输入做校验外，还可以设置 OutputGuardrail 对 Agent 的输出做校验。若校验不通过，同样会抛出异常。结合使用 InputGuardrail 和 OutputGuardrail，可以确保 Agent 的输入、输出满足设计要求，并且在出现错误的输入、输出时及时发现，然后可以选择中断处理、报警或自动修复。


我在这门课程入门篇中讲解的几个 Autonomous Agent 开发框架，都是使用这些框架来实现一个 24 点游戏智能体应用。坚持以实例驱动的方式开展学习，这是我们这门课程的最大特点。接下来，我会使用 Agent SDK 重新实现 24 点游戏智能体应用。

### 使用 Agent SDK 实现 24 点游戏智能体

我们在 [第 11 课](https://time.geekbang.org/column/article/842497) 中已经使用 Swarm 实现了 24 点游戏智能体应用的两个版本。在这里需要做的就是把这两个版本都移植到 Agent SDK。

第一个版本 play\_24\_points\_game\_v1.py 移植起来比较简单，因为其中并没有使用 Handoff。这个版本没多少好说的，大家可以从 [课程的 gitee 仓库](https://gitee.com/mozilla88/autonomous_agent) 下载运行，并且与 Swarm 的对应版本进行对照。以下是分别使用 Swarm 和 Agent SDK 实现 24 点游戏智能体应用代码地址：

- [Swarm 第一版实现](https://gitee.com/mozilla88/autonomous_agent/blob/master/lesson_11/play_24_points_game_v1.py)

- [Swarm 第二版实现](https://gitee.com/mozilla88/autonomous_agent/blob/master/lesson_11/play_24_points_game_v1.py)

- [Agent SDK 第一版实现](https://gitee.com/mozilla88/autonomous_agent/blob/master/lesson_11/play_24_points_game_v1.py)

- [Agent SDK 第二版实现](https://gitee.com/mozilla88/autonomous_agent/blob/master/lesson_11/play_24_points_game_v1.py)


我详细说一下第二个版本 play\_24\_points\_game\_v2.py，移植第二个版本的过程更复杂一些，值得分享给你。

虽然 Agent SDK 仍然是一个轻量级开发框架，因为 Agent SDK 中的 Agent 封装比 Swarm 中的 Agent 更重，在 Agent 的提示词中需要对输出的格式做出明确要求。否则 Agent 返回的结果会出现很多不同的格式，还需要手写代码对各式各样的输出格式做解析，这是极为繁琐的工作。例如我使用如下提示词片段，要求 Agent SDK 返回一个符合 Python 字典格式的结果：

```plain
If the result is an arithmetic expression, return the expression follow this Python dictionary format:{{"expression": "result"}}, just return this Python dictionary and do not add anything else.

```

此外我还对 check\_24\_points\_expression\_func()、get\_human\_reply\_func() 两个函数的 docstring 做了修改，使得 docstring 的表述更加明确。这些函数的 docstring 表述越明确，就越有助于 Agent SDK 中的 Agent 对象准确选择对应的函数（通过 tools 参数设置）。

代码结构与对应的 Swarm 第二版实现相同，改动最大的是 get\_human\_reply\_func() 和 run\_game\_one\_turn() 两个函数。

get\_human\_reply\_func() 函数的内容为：

```plain
&#64;function_tool
def get_human_reply_func(last_cards_posted: str) -&gt; str:
    """Interact with a human user and get a reply from the human user. The replay should be 'deal', 'help', 'exit' or an an arithmetic expression.

    Keyword arguments:
      last_cards_posted: an array of 4 integers between 1 to 13.
    """

    PROMPT_TEMPLATE: str = """
    Cards the dealer just posted: {content}
    Please give an expression for the four operations that results in 24.
    Type 'help' if you feel it's difficult.
    Type 'deal' if you want the dealer to deal cards again.
    Type 'exit' if you want to exit this game, type 'exit'.
    """

    point_list = json.loads(last_cards_posted)
    card_list = get_random_card_list(point_list)
    cards_content = f"{{'card_list': {card_list}, 'point_list': {point_list}}}"

    prompt = PROMPT_TEMPLATE.format(content=cards_content)
    human_reply = input(prompt)

    return human_reply

```

run\_game\_one\_turn() 函数的内容为：

```plain
async def run_game_one_turn(last_cards_posted: str) -&gt; tuple:
    global agent_david

    context_var_dict = {
        "agent_name":"GamePlayer",
        "last_cards_posted": f"{last_cards_posted}"
    }
    context = CustomContext(context_variables=context_var_dict)
    response = await Runner.run(
        agent_david,
        [{"role": "user", "content": get_user_prompt(context_var_dict)}],
        context=context
    )

    human_reply = eval(response.final_output)['human_reply']

    if human_reply == "deal" or human_reply == "exit":
        return human_reply, None

    result_expression = "expression not found"
    if human_reply == "help":
        context_var_dict = {
            "agent_name":"MathProdigy",
            "last_cards_posted": f"{last_cards_posted}"
        }
        context = CustomContext(context_variables=context_var_dict)
        response = await Runner.run(
            triage_agent,
            [{"role": "user", "content": get_user_prompt(context_var_dict)}],
            context=context
        )

        result = response.final_output
        if "expression not found" in result:
            return "expression not found", "Correct"
        else:
            result_expression = eval(result)['expression']

    else:
        result_expression = human_reply

    context_var_dict = {
        "agent_name":"GameJudger",
        "expression": f"{result_expression}",
        "last_cards_posted": f"{last_cards_posted}"
    }

    context = CustomContext(context_variables=context_var_dict)
    response = await Runner.run(
        triage_agent,
        [{"role": "user", "content": get_user_prompt(context_var_dict)}],
        context=context
    )

    result = eval(response.final_output)['check_result']
    return result_expression, result

```

为了充分展示 Handoff 在 Agent SDK 中新的用法，我通过一个新的 triage\_agent 来分发不同的任务，而不是像在第一版中直接调用 agent\_gauss 和 agent\_peter。

triage\_agent 相关的代码如下：

```plain
async def on_handoff_gauss(ctx: RunContextWrapper[None]):
    # print(f"in on_handoff_gauss(), context_variables is {ctx.context.context_variables} ")
    pass

async def on_handoff_peter(ctx: RunContextWrapper[None]):
    # print(f"in on_handoff_peter(), context_variables is {ctx.context.context_variables} ")
    pass

handoff_gauss = handoff(
    agent=agent_gauss,
    on_handoff=on_handoff_gauss,
    tool_name_override="help_agent",
    tool_description_override="an agent who can help user to calculate 24 points expression",
)

handoff_peter = handoff(
    agent=agent_peter,
    on_handoff=on_handoff_peter,
    tool_name_override="judge_agent",
    tool_description_override="an agent who can judge whether the 24 points expression is correct",
)

triage_agent = Agent[CustomContext](
    name="Triage Agent",
    handoff_description="A triage agent that can delegate a customer's request to the appropriate agent.",
    instructions=(
        f"{RECOMMENDED_PROMPT_PREFIX} "
        "You are a helpful triaging agent. You can use your tools to delegate questions to other appropriate agents."
    ),
    handoffs=[
        handoff_gauss,
        handoff_peter,
    ],
)

```

提供给 triage\_agent 的提示词是通过 get\_user\_prompt() 函数获得的，与对应的 Swarm 第二版实现中相同。triage\_agent 会根据不同的提示词决定是调用 agent\_gauss 给出 24 点游戏表达式，还是调用 agent\_peter 判断表达式是否正确。这里似乎有点黑魔法的味道。:)

在这个例子的代码中，需要注意的内容包括：

- Swarm 中 Agent 的 functions 参数，在 Agent SDK 中改名为 tools。

- 用作 tools 的函数，需要加上 @function\_tool 标注。

- 所有的函数前都加上 async 关键词，支持异步调用。

- handoffs 参数是一个数组，数组成员可以是 Agent 或者 Handoff 对象。使用 Handoff 对象的优点是可以对调用相关 Agent 的输入、输出内容做出修改。这里用了两个 Handoff 对象 handoff\_gauss 和 handoff\_peter。


使用 bash 脚本运行一下 24 点游戏智能体应用：

```plain
run_agent_sdk_app play_24_points_game_v2.py

```

## 对于 Agent SDK 的点评

我先说说优点，Agent SDK 仍然是一个轻量级的开发框架，复杂度不高，易学易用。而且得到了 OpenAI 官方的明确支持，这比去年发布的实验性的 Swarm 要好很多，可以期待 Agent SDK 今年会有很大的进步。

接下来说说缺点。尽管 Agent SDK 与 Swarm 相比，扩充了很多功能，然而其仍然存在以下不足：

- Agent SDK 的工作流处理非常依赖 Assistant API 和基础 LLM 的理解能力。有些比较简单的工作流应用，这样做有些“杀鸡用牛刀”的感觉。而那些很复杂的工作流，依赖 LLM 的理解能力又存在不可靠的问题（因为某些基础 LLM 存在幻觉），可能有些开发者宁愿先通过硬编码的方式手写工作流，而不是完全信任 LLM 的判断和选择。

- Agent SDK 缺乏像 AutoGPT Platform 中 Agent Builder 那样图形化的开发工具，开发者必须手工编写代码实现各种工作流。

- 因为核心开发人员主要在 OpenAI 内部，对于其他厂商的基础 LLM，可能没有做过充分的测试。但是一个开源的 LLM 应用开发框架，理应对不同厂商的基础 LLM 一视同仁。

- 目前官方还不支持 MCP 规范。不过已经有了第三方的 MCP 扩展，例如以下这个项目：
  - [OpenAI Agents SDK - MCP Extension](https://github.com/lastmile-ai/openai-agents-mcp)

## 总结时刻

这节课中，我延续了这门课程一贯坚持的实例驱动的教学方法，通过可运行的实例系统讲解了 OpenAI 最新发布的 Agent SDK 开发框架的使用方法。

OpenAI 宣称，包括 Agent SDK 在内的这些新工具简化了核心智能体（Agent）逻辑、编排和交互，使开发人员更容易开始构建智能体应用。

从设计上来看，Agent SDK 是一个还算不错的 Autonomous Agent 开发框架，设计水平也达到此类框架的中上游。然而 Agent SDK 仍然不是银弹，一个月前突然爆火的 Manus 同样也不是银弹。作为开发者，我们必须保持开放的心态，从要解决的应用需求出发，在实战中学习这些开发框架。而不要人云亦云，动辄对某个新出现的开发框架、开发工具喜大普奔。同时多学习掌握几个不同的开发框架也是很重要的，不要过早把自己绑死在某个开发框架上面。而应该针对具体的应用需求和运行环境，选择最适合的开发框架。

我在这门课程中讲解的所有 Autonomous Agent 开发框架都是轻量级的，同时掌握多种开发框架并不是很困难。不同的开发框架都是我们工具箱中的有用工具，它们百花齐放、展开激烈竞争，对于 LLM 应用的开发者来说是非常有利的。今年必然会成为 Autonomous Agent 应用开发的黄金之年。

## 思考题

Agent SDK 中的 Handoff 和 Swarm 中的 Handoff 有哪些不同？做出这些改变有什么优点？

期待你的分享，我们留言区见！