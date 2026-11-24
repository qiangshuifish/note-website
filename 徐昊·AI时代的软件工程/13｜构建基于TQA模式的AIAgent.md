# 13 | 构建基于TQA模式的AIAgent

你好，我是徐昊，今天我们来继续学习 AI 时代的软件工程。

上节课我们介绍了三种通过大语言模型（Large Language Model，LLM）辅助用户故事编写的形式：通过 LLM 提取不可言说的业务知识，修改用户故事以及补充完善验收条件。

这三种方式都需要使用到一种特殊的 LLM 交互模式 TQA（Thought-Question-Answer），TQA的主要用途是收集人的反馈，用以提高生成内容的质量。TQA 是从推理行动（Reason-Act，ReACT）演化出来的交互模式。那么今天我们就来学习如何构造一个 TQA 的 AI Agent。

## 推理行动（Reason-Act）

ReAct 是一种专门为了 LLM 能执行某些操作任务而设计的模式。举个例子，当 LLM 收到一个问题时，它可以选择执行一个动作来检索相关信息，然后利用检索到的信息来回答问题。通过ReAct，LLM 可以超越其常规功能，利用自然语言推理解决复杂任务。

ReAct 也是目前最热门的一个 LLM 模式。前一阵子（2023 年底）大火的 ChatGPT Plugin，还有 Microsoft 开源的 Semantic Kernel 都是基于 ReAct 模式。

一个典型的 ReAct Prompting 通常包含四个部分：

- 上下文提示：提示 LLM 当前解决问题的上下文是什么。这几乎在所有 LLM 提示模版中都会用到。目的是让 LLM 开始了解我们到底想让它做什么。

- ReAct 步骤：推理和行动规划的步骤。在所有 ReAct 提示中，思考 - 行动 - 观察（Thought-Action-Observation）是一个标准顺序。然而在具体情况中，我们会使用更为具体的“思考 ”行为。

- 推理：通过“根据现状进行思考和推理”这样的通用指令或“让我们一步步思考”这样的思维链提示来实现推理。这部分通常还会包含少样本示例（few shots example），以提供如何将理由与行动联系起来的准确提示。

- 行动：最后一个关键信息是行动指令集，LLM 可以从中选择一个行动来响应推理思考。

下面让我们看一个例子：

- Answer the following questions as best you can. You have access to the following tools:// 尽你所能地回答下面的问题，你可以使用如下的工具

- search, calculate// 搜索，计算

- Use the following format:// 回答问题时，使用下面的格式

- Question: the input question you must answer// 问题：你必须回答的用户提问Thought: you should always think about what to do

- // 思考：你应该永远思考要做什么Action: the action to take, should be one of [search, calculate]// 行动：你要采取的行动，应该是[搜索，计算]其中之一Action Input: the input to the action// 行动输入：给予工具的输入是什么Observation: the result of the action// 观察：行为的结果是什么… (this Thought/Action/Action Input/Observation can repeat N times)//…(思考 / 行动 / 行动输入 / 观察 可以循环多次）Thought: I now know the final answer// 思考：现在我知道了最终答案Final Answer: the final answer to the original input question// 最终结果：原始问题的最终结果是什么。

- Begin!// 开始！

- Question: 淘宝去年双十一的营业额，可以买多少瓶可乐Thought:

在上面这个提示词中，四部分分别对应的是：

- 上下文提示：尽可能回答用户提出的问题。

- ReAct 步骤：Thought/Action/Action Input/Observation

- 推理：就是展开解释 Thought，Action，Action Input，Observation 分别要做什么。

- 行动：Search, Calculate

如果我们在 ChatGPT 中直接使用这个提示词，会得到如下结果：

![](images/13/1.png)

可以看到，在一开始 LLM 就给出了解决问题的思路，先搜索淘宝的双十一的营业额，然后计算可以购买多少可乐。而这个思路则是根据我们提供的行动分解的。

因为我们并不能给 ChatGPT 提供可执行的行动（search，calculate），所以我们并没得到真正的结果，但是在这个过程中，ChatGPT 展示了正确的思路以及在哪个环节需要去调用什么行为。

因此，ReAct 模式也成为了 LLM 与其他工具交互的主要模式。这种由 LLM 推理并控制其他工具调用的方式，也被称作 AI Agent。现在（2024 年）主流的 LLM 框架几乎都支持构建以ReAct 为核心的 AI Agent。

我们上面例子里的提示词，就来自 LangChain 的 ReAct 模板：

- Answer the following questions as best you can. You have access to the following tools:

- {tools}

- Use the following format:

- Question: the input question you must answerThought: you should always think about what to doAction: the action to take, should be one of [{tool_names}]Action Input: the input to the actionObservation: the result of the action… (this Thought/Action/Action Input/Observation can repeat N times)Thought: I now know the final answerFinal Answer: the final answer to the original input question

- Begin!

- Question: {input}Thought:{agent_scratchpad}

而使用类似下面的代码，就可以真正运行这个 agent（当然，需要提供真实的 Tool，这部分请自行查阅 LangChain 或其他框架的文档）：

```python
import openai
import os
from langchain.llms import OpenAI
from langchain.agents import load_tools
from langchain.agents import initialize_agent
from dotenv import load_dotenv
load_dotenv()
os.environ["OPENAI_API_KEY"] = getpass()
from langchain import OpenAI, Wikipedia
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
tools = [
   Tool(
       name="Search",
       func=...,
       description="useful for when you need to ask with search"
   ),
   Tool(
       name="Calculate",
       func=...,
       description="useful for when you need to calculate"
   )
]
llm = OpenAI(temperature=0, model_name="gpt-3.5-turbo")
react = initialize_agent(tools, llm, agent=AgentType.REACT_DOCSTORE, verbose=True
react.run("淘宝去年双十一的营业额，可以买多少瓶可乐")
```

需要注意一点，目前与推理有关的提示词受基础语料的影响极大，因而不同语言编写的提示词推理效果有显著差异。对于 ChatGPT 而言，ReAct 形式的提示词，用英语编写会有更好的结果。

## 想 - 问 - 答（Thought-Question-Answer）

理解了推理行动模式，那么想 - 问 - 答只不过提供了不同的响应步骤而已。那么用于验收条件编写的 TQA 提示词是这样的：

- You are a business analyst who is familiar with specification by example. I’m the domainexpert.// 你是一个业务分析师，而我是领域专家

- ===CONTEXT{context}===END OF CONTEXT

- ===USER STORY{story}===END OF USER STORY

- Explain the user story as scenarios. Use the following format:// 使用 场景 解释用户故事，并遵循如下格式

- Thought: you should always think about what is still uncertain about the user story. Ignoretechnical concerns.// 思考：你应该考虑用户故事中不清晰的部分。但忽略技术细节Question: the question to ask to clarify the user story// 问题：提出问题帮助你澄清这个用户故事Answer: the answer I responded to the question// 回答：我给出答案… (this Thought/Question/Answer repeat at least 3 times, at most 10 times)//（Thought/Question/Answer 重复至少 3 次而不多于 10 次）Thought: I know enough to explain the user story// 思考：我已经对这个用户故事了解了足够多的内容Scenarios: List all possible scenarios with concrete example inGiven/When/Then style// 场景：列出所有场景。使用 Given/When/Then 的格式表述{history}{input}

这是一个典型的 ReAct 形式的提示词，四部分分别对应的是：

- 上下文提示：你是一个业务分析师，而我是领域专家。与一般的 ReAct 不同，我们的上下文提示中，还包含了业务背景和具体的用户故事。

- ReAct 步骤：Thought/Question/Answer

- 推理：就是展开解释 Thought，Question，Answer 分别要做什么。

- 行动：行动只有一个，就是 Answer（向人来问问题）。

此外，因为是连续发问，我们不希望 LLM 反复询问同一个问题，也需要保持记录之前提问的内容，所以包含了历史记录（{history}）。

同样，如果我们将这个提示词展开直接放入 ChatGPT，并不会得到我们想要的效果：

![](images/13/2.png)

可以看到 ChatGPT 进入了自问自答模式，并没有给人机会来提供真正的答案。想要实现人与LLM 的互动问答，需要使用 LLM API 中的停止序列（Stop Sequence）。在模型生成内容的过程中，如果碰到指定的停止序列，模型就会停在那个位置。例如句子或列表的结尾，或者是问答环节中提问的部分。

显而易见，在 TQA 中，停止序列是 “Answer:”，也就是碰到需要等待用户给予反馈的时候停下，等用户输入完成之后，再继续后续的推理和任务。

对于不同的 LLM API 而言，停止序列的设定各有不同，请详细阅读文档。然后在前面给出的Agent 例子中，替换提示词模板，就可以实现一个基于 TQA 的 Agent 了。

## 小结

一旦我们理解了 ReAct 和 TQA 背后的实现机制，对于它们是如何发出提问，并根据提问继续完成后续任务就有了充分的理解。这里我们需要注意的是，在 TQA 模式中，起到关键作用的除了 ReAct 之外，还有上下文和历史记录部分。

这也对应了我们在上一节课提到了三种回答方式：

1. 模板中 {context} 表示了业务整体的解决方案：如果 LLM 提出的问题，包含了对于基础概念或流程的误解，那么我们要重新修改业务背景说明，也就是修改了模板中表示业务上下文的部分。

2. 模版中 {story} 表示了当前的用户故事：如果 LLM 提出的问题，包含了对于操作的误解，那么我们要重新修改用户故事，也就是修改了模板中表示用户故事的部分。

3. 模版中 {history} 表示之前回答过的历史记录：如果 LLM 提出的问题，仅仅是关于交互细节的，那么我们只需要在会话中回答这些细节就可以了，这些细节会被记入历史记录。

因而 TQA 一个很好的例子，它展示了我们如何在交互过程中利用特定的文本结构，构成有效的反馈。

## 思考题

请根据不同的用户故事场景（前台，API），改写 TQA 模板，增加 LLM 反馈的内容。

欢迎你在留言区分享自己的思考或疑惑，我们会把精彩内容置顶供大家学习讨论。
