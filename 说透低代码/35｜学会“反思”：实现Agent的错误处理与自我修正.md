# 35 | 学会“反思”：实现Agent的错误处理与自我修正

你好，我是陈旭。

欢迎来到我们智能体构建之旅的又一个新篇章。在过去的几讲里，我们一起经历了一段非常激动人心的旅程。从第 32 讲我们为智能体设计“思考框架”开始，到第 33 讲我们亲手编码，将理论变成了现实，打造出了一个能够理解复杂目标并生成结构化 JSON 行动计划的“规划器”（Planner）。那时候，我们的 Agent 终于拥有了“大脑”。

紧接着，在第 34 讲，我们更进一步，为这个“大脑”接上了强有力的“神经中枢和四肢”——执行引擎（Execution Engine）。通过精巧的工具注册与动态调度机制，以及技术含量颇高的“步骤间引用”解析器，我们成功打通了从抽象计划到具体执行的“最后一公里”。当看到控制台里打印出的执行日志，以及我们低代码平台画布上被一步步创建出来的 UI 组件时，我相信你和我一样，都感受到了那种将代码赋予生命力的成就感。至此，“观察 - 规划 - 执行”的完整闭环，在我们的手中正式形成了！

我们的 Agent 现在就像一个一丝不苟、严格遵守指令的机器人。只要给它一份完美的计划，它就能完美地执行。这固然很棒，但现实世界，尤其是软件开发的世界，从来都不是一帆风顺的。

我们来做一个小实验，直面一次失败。想象一下，一个用户对我们的低代码助手说：“嘿，帮我把那个 ID 是 non-existent-btn 的按钮变成红色。”

我们的规划器，基于它对工具的理解，会很“合理”地生成这样一个计划：

```json
{
 "plan": [
   {
     "thought": "用户的目标是修改一个按钮的颜色。我需要使用 'update_property' 工具。参数包
     "tool_name": "update_property",
     "parameters": {
       "component_id": "non-existent-btn",
       "properties": {
         "color": "red"
       }
     }
   }
 ]
}
```

这个计划看起来毫无破绽，对吧？然后，我们信心满满地将它交给上一讲构建的执行引擎。接

```
下来会发生什么？当执行引擎调用 update_property 这个 MCP 工具函数，并试图在画布
上寻找一个 ID 为 non-existent-btn 的组件时，它什么也找不到。我们的工具函数可能会
返回一个 None，或者更直接一点，抛出一个 ComponentNotFoundError 的异常。
```

然后呢？然后就是我们最不愿意见到的画面：程序执行中断，控制台打印出一长串刺眼的红色错误信息，最后以一个冷冰冰的 “CRASH” 收场。整个 Agent 因为这一个小小的、意料之中的意外，彻底罢工了。

这显然不是我们想要的智能体。一个真正的智能助手，不应该如此“脆弱”。它应该像一个经验丰富的人类开发者一样，在遇到问题时，能够分析问题、寻找原因，甚至尝试自我修复，而不是直接“躺平”。

所以，今天的使命，就是消灭这个 CRASH 信息。我们要为我们的 Agent 注入“韧性”（Resilience），教会它一项高级技能——“反思”。当它在执行任务的道路上摔倒时，我们希望它能自己拍拍尘土，搞清楚为什么会摔倒，然后换一条路，继续朝着用户的原始目标前进。

准备好了吗？让我们一起，把我们的 Agent 从一个“脆弱的执行者”，升级为一个能在逆境中寻找出路的、真正意义上的“问题解决者”。

## 第一步：改造执行引擎——从“崩溃”到“捕获”

我们首先要改变一个核心观念：失败是信息，而不是终点。在之前的模型里，一个异常（Exception）就像一个停止信号，意味着一切都结束了。现在，我们要把它看作一个情报包，一个包含了丰富上下文信息、能帮助我们诊断问题的宝贵数据源。

```
要做到这一点，我们就需要改造上一讲的 ExecutionEngine，给它的核心执行循环加上一
张“安全网”。在编程世界里，这张网最经典的形式，就是 try...except 代码块。
```

在动手改造之前，我强烈建议大家做一个小小的升级，这也是软件工程中的一个最佳实践。那

```
就是改造我们的工具函数（比如 update_property、find_components 等），让它们在
失败时，不再是简单地返回 False 或 None，而是抛出更具描述性的自定义异常。
```

比如，我们可以定义这样几个异常类：

```python
# 在mcp_tools.py或者一个专门的exceptions.py文件中
class MCPToolError(Exception):
   """所有MCP工具错误的基类"""
   pass
class ComponentNotFoundError(MCPToolError):
   """当根据ID或条件找不到组件时抛出"""
   def __init__(self, component_id=None, filters=None):
       if component_id:
           super().__init__(f"执行失败：未能在画布上找到ID为 '{component_id}' 的组件。
       else:
           super().__init__(f"执行失败：根据筛选条件 {filters} 未找到任何组件。")
class InvalidParameterError(MCPToolError):
   """当工具收到的参数无效或缺失时抛出"""
   def __init__(self, tool_name, missing_param=None, invalid_param=None):
       if missing_param:
           super().__init__(f"执行失败：调用工具 '{tool_name}' 时缺少必要参数 '{missi
       else:
           super().__init__(f"执行失败：调用工具 '{tool_name}' 时参数 '{invalid_para
```

这样做的好处是，错误信息变得“结构化”和“可识别”了。我们不再是面对一个模糊的

```
KeyError 或 AttributeError，而是能清晰地知道“哦，原来是组件没找到”。这对于后续
```

Agent 的“反思”至关重要。

在我们的 Awade 平台内部，就定义了一套非常完善的异常体系，确保每一个环节的失败都能被精确地定位和描述。

```python
好了，有了这个基础，我们就可以来修改 ExecutionEngine 的 execute_plan 方法了。
# execution_engine.py
# 假设Planner类和自定义异常已经导入
# from .planner import Planner
# from .mcp_tools import ComponentNotFoundError, InvalidParameterError
class ExecutionEngine:
   def __init__(self, tool_registry, planner):
       self.tool_registry = tool_registry
       self.planner = planner # 注意：执行引擎现在需要一个规划器的实例
   def execute_plan(self, original_goal, plan):
       step_results = []
       succeeded_steps = []
       for i, step in enumerate(plan['plan']):
           try:
               print(f"--- 开始执行步骤 {i}: {step['tool_name']} ---")
               # 1. 解析参数，处理步骤间引用
               resolved_params = self.resolve_parameters(step['parameters'], ste
               print(f"解析后参数: {resolved_params}")
               # 2. 动态调度工具函数
               tool_function = self.tool_registry[step['tool_name']]
               # 3. 执行工具并捕获结果
               result = tool_function(**resolved_params)
               print(f"步骤 {i} 执行成功，结果: {result}")
               step_results.append(result)
               succeeded_steps.append(step)
           except (ComponentNotFoundError, InvalidParameterError) as e:
               print(f"--- 步骤 {i} 执行失败！---")
               print(f"错误类型: {type(e).__name__}")
               print(f"错误信息: {e}")
               # 关键时刻：不再崩溃，而是收集情报，准备反思
               failure_context = {
                   "original_goal": original_goal,
                   "original_plan": plan,
                   "succeeded_steps": succeeded_steps,
                   "failed_step_index": i,
                   "failed_step": step,
                   "error_message": str(e)
               }
               print("--- 收集到失败上下文，准备启动重规划 ---")
               # 这里我们将调用重规划逻辑，暂时留空
               # new_plan = self.replan(failure_context)
               # ...
               return "执行因错误而中断，已尝试重规划。" # 暂时先返回
       return "所有步骤均已成功执行！"
   # resolve_parameters 方法和之前一样，此处省略
   def resolve_parameters(self, parameters, step_results):
       # ...
       pass
看到了吗？变化的核心就是那个 try...except 块。现在，当
tool_function(**resolved_params) 这行代码抛出我们预定义的
ComponentNotFoundError 或 InvalidParameterError 时，程序不会再崩溃了。
取而代之的是，它会优雅地进入 except 块。在这个块里，我们就像一个事故现场的侦探，
```

有条不紊地收集所有用于“反思”的关键情报：

1. 用户的原始目标（Original Goal）：Agent 需要时刻牢记最终要去哪里。

2. 完整的原始计划（Original Plan）：这是失败的“第一版草稿”，包含了 Agent 最初的思考路径。

3. 执行成功的步骤历史（Succeeded Steps）：已经完成了哪些工作？这很重要，因为它们可能已经改变了画布的状态。

4. 导致失败的步骤详情（Failed Step）：具体是哪一步、哪个工具、用了什么参数导致了问题？

5. 具体的错误信息（Error Message）从异常对象中提取出的、人类可读的错误描述，比如“未能在画布上找到 ID 为 non-existent-btn 的组件”。

```
当所有这些信息被整齐地收集到一个名为 failure_context 的字典里时，我们就拥有了一
```

份详尽的“事故报告”。这张报告，将成为我们 Agent 进行自我修正和“反思”的唯一依据。

## 第二步：设计“自我修正”的思考框架（Re-Planning Meta-Prompt）

好了，我们已经成功捕获了失败，并拿到了一份“事故报告”。接下来该怎么办？我们的执行引擎本身并不具备创造性思考的能力，它不知道如何根据这份报告来解决问题。这时候，它需要向我们那个聪明的大脑——大模型（LLM）求助。

但是，我们不能直接把这份乱糟糟的报告丢给 LLM 说：“嘿，出错了，你看着办吧。” 这样大概率得不到有用的回应。我们需要设计一个全新的、专门用于“重规划”（Re-Planning）的元提示（Meta-Prompt）。这个提示的核心任务，就是把“事故报告”清晰、结构化地呈现给 LLM，并引导它像一个专家一样去思考解决方案。

这个“修正模式”下的元提示，会比我们最初的规划提示更复杂，因为它包含了更多的动态上下文。让我们来一起设计一下它的结构：

```
REPLANNING_PROMPT_TEMPLATE = """
# 角色扮演
```

- 你是一位经验丰富的软件调试专家和解决问题的能手。你的一个自动化代理在执行一个计划时遇到了错误。现在

```
# 事故报告 (Failure Context)
```

- 以下是关于这次执行失败的详细报告：

```
## 1. 用户的原始目标
{original_goal}
## 2. 完整的原始计划
json
{original_plan}
## 3. 已成功执行的步骤
json
{succeeded_steps}
## 4. 失败的步骤详情
- 步骤索引: {failed_step_index}
- 失败的步骤:
json
{failed_step}
## 5. 具体的错误信息
"{error_message}"
# 当前快照 (Updated Awareness)
```

- 在上述步骤执行后（包括失败的步骤之前所有成功的步骤），低代码画布的最新状态如下。这是你决策的主要依

```
{current_page_state}
# 可用工具清单
```

- 你可以使用以下工具来构建新的计划：

```
{tools_description}
# 新的任务指令 (The New Task)
```

- 你的任务是：

```
1.  **分析**：仔细分析上述“事故报告”和“当前快照”。理解为什么会发生错误。
2.  **规划**：基于你的分析，生成一个全新的、修正后的行动计划。这个新计划的目标是绕过或解决当前遇
3.  **策略**：新计划应该从你认为最合适的步骤开始。它可以是全新的，也可以是利用之前成功步骤的结果
# 输出契约
你必须严格按照以下JSON格式返回你的新计划，不要包含任何额外的解释或注释。
{
 "plan": [
   {
     "thought": "在这里写下你关于这一步的思考过程。",
     "tool_name": "tool_name_1",
     "parameters": {{...}}
   },
   ...
 ]
}
"""
```

让我们来仔细剖析一下这个精心设计的元提示：

① 角色扮演（切换模式）：我们明确告诉 LLM，它现在的身份不是一个普通的规划者，而是一个“调试专家”。这种角色设定能有效地引导模型进入解决问题的心智模式。

② 事故报告（Failure Context）：这是提示的核心。我们没有用大段的自然语言去描述发生了什么，而是将之前收集到的所有情报，通过结构化的方式（标题、JSON 代码块）嵌入到提示中。这使得信息一目了然，LLM 可以精确地知道原始目标、原始计划、成功历史、失败步骤和错误信息。

③ 当前快照（Updated Awareness）：这一点至关重要，也是最容易被忽略的！在执行失败之前，可能已经有一些步骤成功执行了，这意味着画布的状态可能已经发生了改变。我们必须

```
在重规划之前，再次调用观察工具（如 get_page_outline 和
summarize_page_state），获取最新的页面状态。否则，LLM 就像是在看一张过时的地图
```

做决策，很可能会做出错误的规划。

④ 新的任务指令（The New Task）：我们在这里给出了非常明确的指令——分析、规划、并给出策略建议。我们甚至举了个例子，提示它如果组件没找到，可以先搜索或询问用户。这就像在给一个初级程序员指导，能大大提高 LLM 给出高质量计划的概率。

⑤ 输出契约：和之前一样，我们严格要求它返回结构化的 JSON，确保后续程序可以解析。

这个“重规划元提示”，本质上就是教会 Agent 如何向 LLM“打小报告”。当 Agent 把这份内容详实、逻辑清晰的报告提交上去后，LLM 就能扮演一个资深顾问的角色，给出真正有建设性的指导意见。

## 第三步：实现“重规划”循环（Re-Planning Loop）

现在，我们有了捕获错误的机制，也有了用于反思的思考框架（元提示）。最后一步，就是将

```
这两者连接起来，形成一个完整的闭环。我们需要让 ExecutionEngine 和 Planner 能够
```

互相调用，构建一个“执行 -> 失败 -> 重规划 -> 再次执行”的动态循环。

```
首先，我们需要在 ExecutionEngine 的 except 块中，调用 Planner 来执行重规划。我
```

们来补全之前留空的代码。

```python
# execution_engine.py (续)
from .planner import Planner
from .observation_tools import get_page_outline # 假设观察工具在这里
from .summarize import summarize_page_state # 假设状态摘要工具在这里
class ExecutionEngine:
   def __init__(self, tool_registry, planner):
       # ... (之前的内容)
   def replan(self, failure_context):
       """根据失败上下文进行重规划"""
       print("--- 正在调用规划器进行自我修正 ---")
       # 1. 获取最新的画布状态 (关键的“当前快照”)
       current_state_raw = get_page_outline()
       current_state_summary = summarize_page_state(current_state_raw)
       # 2. 填充重规划的元提示模板
       prompt = REPLANNING_PROMPT_TEMPLATE.format(
           original_goal=failure_context['original_goal'],
           original_plan=json.dumps(failure_context['original_plan'], indent=2,
           succeeded_steps=json.dumps(failure_context['succeeded_steps'], indent
           failed_step_index=failure_context['failed_step_index'],
           failed_step=json.dumps(failure_context['failed_step'], indent=2, ensu
           error_message=failure_context['error_message'],
           current_page_state=current_state_summary,
           tools_description=self.planner.get_tools_description() # 假设Planner有
       )
       # 3. 调用规划器生成新计划
       new_plan_json = self.planner.generate_plan_from_prompt(prompt) # Planner需
       if new_plan_json:
           print("--- 已生成新的修正计划 ---")
           print(json.dumps(new_plan_json, indent=2, ensure_ascii=False))
           return new_plan_json
       else:
           print("--- 重规划失败，无法生成新计划 ---")
           return None
   def execute_plan(self, original_goal, plan):
       # ... (try块之前的内容)
       for i, step in enumerate(plan['plan']):
           try:
               # ... (try块内部的执行逻辑)
           except (ComponentNotFoundError, InvalidParameterError) as e:
               # ... (收集failure_context)
               # 调用重规划
               new_plan = self.replan(failure_context)
               if new_plan:
                   print("--- 准备使用新计划继续执行 ---")
                   # 决策点：这里我们采用简单策略，用新计划完全替换旧计划，然后重新开始
                   # 注意：这里我们直接递归调用execute_plan。
                   # 为避免无限循环，需要增加一个重试次数的限制。
                   # return self.execute_plan(original_goal, new_plan)
                   # 为了教学清晰，我们先只返回，不进入递归
                   return f"执行失败，但已成功生成新计划。请手动使用新计划再次执行。"
               else:
                   return "执行失败，且重规划也失败。任务终止。"
       return "所有步骤均已成功执行！"
这里的架构闭环非常清晰：execute_plan 在 except 块中调用 replan，而 replan 方法
则调用 self.planner 来生成新计划。
在 replan 方法中，我们严格按照上一节设计的元提示，填充了所有必需的信息，特别是重
新获取了 current_page_state，然后将这个巨大的、信息量十足的 prompt 交给了规划
```

器。

```
在 execute_plan 的最后，我们面临一个决策点：拿到新计划后该怎么办？
```

- 简单策略（推荐）：这是最稳妥、最容易实现的。我们直接用新计划完全替换掉旧计划，然后从新计划的第一步重新开始执行。这就像是把旧的执行绪扔掉，开启一个全新的执行绪。为了避免 Agent 陷入“失败 - 重规划 - 失败”的无限循环，通常会在这里加一个计数器，比如最多允许重规划 3 次。

- 复杂策略（选讲）：更高级的做法是尝试将新计划与旧计划中已成功的步骤进行合并。但这非常复杂，需要处理很多边界情况，对于入门来说不推荐。

通过这个循环，我们的 Agent 就拥有了从失败中恢复的能力。它不再是一个线性的执行者，而是一个具备了动态调整能力的系统。

## 端到端演练：一次优雅的“失败后恢复”

现在，让我们回到本讲开头那个注定会失败的场景，看看注入了“韧性”的 Agent 会如何表现。

用户输入：“帮我把那个 ID 是 non-existent-btn 的按钮变成红色。”

### 第一：执行与失败

```
规划：Planner 生成了我们熟悉的计划，目标是 update_property 一个不存在的按钮。
执行：ExecutionEngine 开始执行。控制台打印：“— 开始执行步骤 0: update_property
```

- —”。

```
失败：update_property 工具在画布上找不到组件，于是 raise
ComponentNotFoundError("执行失败：未能在画布上找到ID为 'non-existent-
btn' 的组件。")。
捕获：except 块被触发！程序没有崩溃。控制台打印：“— 步骤 0 执行失败！—”。
```

### 第二：反思与重规划

```
收集情报：except 块开始工作，控制台会打印出它收集到的“事故报告”：
--- 收集到失败上下文，准备启动重规划 ---
{
 "original_goal": "帮我把那个ID是‘non-existent-btn’的按钮变成红色。",
 "original_plan": { ... },
 "succeeded_steps": [],
 "failed_step_index": 0,
 "failed_step": { "tool_name": "update_property", ... },
 "error_message": "执行失败：未能在画布上找到ID为 'non-existent-btn' 的组件。"
}
调用规划器：replan 方法被调用。它会先获取当前空白画布的状态，然后将所有信息填入
REPLANNING_PROMPT_TEMPLATE，形成一个巨大的 prompt。
```

3. LLM 的“思考”：大模型接收到这份详尽的报告。它会分析道：“哦，原始目标是改按钮颜色。计划第一步就失败了，错误是‘组件未找到’。看来是用户给的 ID 不对或者这个按钮根本不存在。一个好的策略不是直接放弃，而是先帮用户找到他可能想要的按钮，然后向他确

```
认。嗯，我可以用 find_components 工具来找一下页面上所有的按钮，然后用一个新工
具 ask_user_for_clarification 来提问。”
```

4. 生成新计划：基于上述思考，LLM 返回一个全新的、修正后的 JSON 计划。控制台打印：

```
--- 已生成新的修正计划 ---
{
 "plan": [
   {
     "thought": "由于无法找到ID为 'non-existent-btn' 的按钮，我首先需要找出页面上所有可用
     "tool_name": "find_components",
     "parameters": {
       "filters": [{ "property": "type", "value": "Button" }]
     }
   },
   {
     "thought": "在找到所有按钮后，我需要向用户提问，让他从找到的按钮中选择一个。我将使用 'a
     "tool_name": "ask_user_for_clarification",
     "parameters": {
       "question": "抱歉，我没有找到ID为 'non-existent-btn' 的按钮。不过，我在页面上找到
     }
   }
 ]
}
```

### 第三：恢复执行

```
接收新计划：execute_plan 方法拿到了这个新计划。
智能交互：引擎开始执行这个新计划。第一步，find_components 成功运行，找到了页
面上所有按钮。第二步，一个假设的 ask_user_for_clarification 工具被调用，它
```

- 会在我们的 Chatbot 界面上弹出一个问题：“抱歉，我没有找到 ID 为 non-existent-btn 的按钮…”。

看到了吗？这是一个多么优雅的转变！一个原本会导致程序崩溃的硬性错误，被我们的 Agent巧妙地转化成了一次与用户的智能交互。它不仅解决了当前的问题，还展现了更高层次的智能和“情商”。这就是“反思”的力量。

## 小结

今天，我们为我们的 Agent 安装了至关重要的“免疫系统”。通过构建“捕获 - 反思 - 重规划”的闭环，我们的 Agent 终于摆脱了“脆弱”的标签。它不再是一个只能盲目执行理想计划的机器人，而是一个能在逆境中分析问题、寻找出路，并从失败中学习和恢复的、真正意义上的问题解决者。

我们通过改造执行引擎实现了错误的“捕获”，通过设计全新的元提示构建了“反思”的框架，最后通过让规划器和执行引擎协同工作，打通了“重规划”的循环。这个过程，不仅是代码层面的升级，更是我们对智能体本质理解的一次深化。

至此，我们已经构建了一个相当完备的、具备初步智能的低代码 Agent。它能观察、能规划、能行动，更重要的是，它还学会了在失败后进行反思。我们一起走过的这几讲，就像是创造了一个数字生命的成长史，从拥有大脑，到拥有四肢，再到拥有韧性。

当然，这远非终点。我们构建的 Agent 依然只是一个“初号机”，未来的探索方向广阔无垠。

- 增强工具集：我们可以为它集成更多强大的工具，比如调用外部 API、操作数据库、读写文件，让它的能力边界不断扩大。

- 优化规划能力：目前的规划还比较朴素，我们可以引入成本、效率等维度的考量，让它在多个可行计划中选择最优的一个。

```
更高级的人机协作：像 ask_user_for_clarification 这样的交互式修正工具，预示
```

- 着 Agent 可以和用户进行更深入、更自然的协作，共同完成任务。

## 思考题

在我们的“重规划”循环中，我们选择用新计划完全替换旧计划的简单策略。你能设想一下，在哪些场景下，这种策略可能不是最优的吗？请你设计一种更高级的“计划合并”或“部分重试”策略，并描述它的执行逻辑和可能遇到的挑战。

我们的低代码专栏，随着这个具备反思能力的 Agent 的诞生，已经成功地迈入了激动人心的AI Native 时代。未来的低代码平台，将不再仅仅是拖拽组件的工具，而是一个个有智能、有韧性的开发伙伴。

我是陈旭，感谢你与我一同见证这个智能体的成长。我们下一讲再见。
