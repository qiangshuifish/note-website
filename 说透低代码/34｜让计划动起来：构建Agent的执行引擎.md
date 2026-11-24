# 34 | 让计划动起来：构建Agent的执行引擎

你好，我是陈旭。

在上一讲中，我们共同完成了一件极具开创性的工作：我们为 AI Agent 打造了一个能思考、会规划的“大脑”——规划器（Planner）。面对一个复杂的用户目标，比如“创建一个登录表单”，我们的 Agent 不再束手无策，而是能像一个真正的架构师那样，深思熟虑后，输出一份逻辑严密、步骤清晰的 JSON 行动计划。

现在，我们的屏幕上已经有了一份待办清单（To-Do List）。让我再把这份上一讲由“大脑”生成的杰作展示给你看：

```json
{
 "plan": [
   {
     "step": 0,
     "reasoning": "首先，我需要创建一个Form组件作为容器…",
     "tool_name": "createComponent",
     "parameters": { "parentId": "root", "componentType": "Form" }
   },
   {
     "step": 1,
     "reasoning": "接下来，在表单内部添加一个标题…",
     "tool_name": "createComponent",
     "parameters": { "parentId": "$steps.0.result.id", "componentType": "Text",
   },
   {
     "step": 2,
     "reasoning": "最后，在同一个表单中添加一个提交按钮…",
     "tool_name": "createComponent",
     "parameters": { "parentId": "$steps.0.result.id", "componentType": "Button"
   }
 ]
}
```

这份 JSON 计划，就是我们 Agent 的“思想结晶”。它结构化、有顺序，甚至还通过

```
$steps.0.result.id 这样的语法，解决了步骤之间的依赖问题。它很完美，但它目前还
```

只是静躺在那里的数据。

思想如果不付诸行动，就毫无价值。因此，今天的使命，就是将我们的 Agent 从一个“思考者”，彻底转变为一个“行动者”。我们要为它的大脑接上“神经中枢和四肢”，创建一个忠实的“执行官”——执行引擎（Execution Engine）。它将逐条阅读这份计划清单，并一丝不苟地完成所有任务，最终在我们的 Awade 低代码画布上，将用户的宏大目标变为触手可及的现实。

## 第一步：执行引擎的总体设计

在动手写代码之前，我们先来清晰地定义一下这个“执行引擎”到底需要做什么。它的核心职责，可以被分解为三个紧密相连的部分：

1. 计划解析（Plan Parsing）：这是最基础的。引擎需要能够读取整个 JSON 计划，并逐一遍历其中的每一个步骤（step）。

```
工具调度（Tool Dispatching）：计划中的 tool_name 只是一个字符串，比如
"createComponent"。引擎需要有一种机制，能根据这个字符串，准确地找到并调用我
```

- 们后端代码中对应的那个 Python 函数。

3. 上下文管理（Context Management）：这是实现复杂流程的关键。引擎必须能够保存每一

```
步执行后的返回结果，并且能理解 $steps.N.result.path 这样的引用语法，将前面步
```

- 骤的结果，动态地注入到后续步骤的参数中。

如果把整个过程画成一张流程图，它会是一个非常清晰的循环：

- 接收计划 -> 开始循环遍历计划中的每一个步骤 -> [解析当前步骤的参数 -> 根据工具名调度工具 -> 执行工具 -> 保存执行结果] -> 所有步骤完成，结束。

你看，虽然听起来很高级，但它的核心逻辑就是一个循环。我们的任务，就是用代码把这个循环中的每一个环节都精确地实现出来。

## 第二步：核心机制一，工具注册与动态调度

```
我们遇到的第一个问题是：当引擎读到 "tool_name": "createComponent" 时，它怎么
知道要去调用我们写好的那个 createComponent() 函数呢？我们总不能用一大堆
if...elif...else 来做判断吧？那样也太笨拙了，而且每次新增一个工具，都得去修改执
```

行引擎的代码。

这里，我要给你介绍一个非常经典且优雅的设计模式——工具注册表（Tool Registry）。

这个模式的思路非常简单：我们创建一个全局的“注册表”，它通常就是一个 Python 字典。然后，我们把所有可供 Agent 使用的工具函数，都“注册”到这个表里。注册的方式，就是以工具的字符串名称为“键”（key），以函数对象本身为“值”（value）。

让我们来看一小段代码，你马上就能明白它的巧妙之处。

```python
# 假设我们已经在其他地方定义好了这些工具函数
def createComponent(parentId: str, componentType: str, properties: dict = None):
   # ... 创建组件的逻辑 ...
   print(f"正在调用 'createComponent'，在父组件 '{parentId}' 中创建 '{componentType}
   # 返回一个包含新组件ID的结果，用于后续步骤引用
   new_id = f"new_{componentType.lower()}_{parentId}"
   return {"id": new_id, "status": "success"}
def updateProperty(componentId: str, propertyName: str, propertyValue):
   # ... 更新属性的逻辑 ...
   print(f"正在调用 'updateProperty'，更新组件 '{componentId}' 的属性 '{propertyName
   return {"id": componentId, "status": "updated"}
# 1. 创建一个Python字典，作为我们的工具注册表
tool_registry = {
   "createComponent": createComponent,
   "updateProperty": updateProperty,
   # 以后有新工具，加在这里就行了，比如：
   # "find_components": find_components,
}
# 2. 模拟从计划中获取一个步骤
step = {
   "tool_name": "createComponent",
   "parameters": { "parentId": "root", "componentType": "Form" }
}
# 3. 核心的动态调度逻辑
tool_name_string = step['tool_name']
function_to_call = tool_registry.get(tool_name_string)
if function_to_call:
   # 如果找到了函数，就执行它！
   function_to_call(**step['parameters'])
else:
   print(f"错误：未在注册表中找到名为 '{tool_name_string}' 的工具。")
看到了吗？通过 tool_registry[tool_name_string] 这一行代码，我们轻而易举地就
```

实现了从字符串到可执行函数的动态查找。这种方式完全是数据驱动的，未来我们增加、删除

```
或修改任何工具，都只需要维护 tool_registry 这个字典就可以了，执行引擎的核心代码
```

完全不需要改动。这就是“开闭原则”的一个完美体现。

## 第三步：核心机制二，实现“步骤间引用”解析器

解决了工具调度，我们迎来了整个执行引擎中技术含量最高，也是最有趣的部分：如何解析

```
$steps.0.result.id 这样的引用？
```

我们需要编写一个“引用解析器”（Reference Parser）。这个解析器的任务，就是在执行每一步之前，检查它的参数，把所有“占位符”都替换成真实的“值”。

```
我为你设计了这样一个函数：_resolve_parameters(parameters, step_results)。
它接收两个参数：当前步骤的原始参数字典（parameters），以及一个存储了前面所有步骤
执行结果的列表（step_results）。
它的实现思路需要用到递归，因为参数的结构可能是嵌套的（比如 properties 对象内部也
```

可能包含引用）。

```python
import re
def _get_value_from_path(obj, path):
   """一个辅助函数，用于根据路径字符串（如 'result.id'）从对象中取值"""
   keys = path.split('.')
   for key in keys:
       if isinstance(obj, dict):
           obj = obj.get(key)
       else:
           return None # 路径不匹配
   return obj
def _resolve_parameters(params: dict, step_results: list) -> dict:
   """
   递归地解析参数字典，将所有 "$steps." 引用替换为真实值。
   """
   # 创建一个参数的深拷贝，避免修改原始计划
   resolved_params = json.loads(json.dumps(params))
   # 定义用于匹配 $steps.N.path 的正则表达式
   ref_pattern = re.compile(r"^<!--§§MATH_0§§-->")
   def _recursive_resolve(current_obj):
       """递归遍历并替换"""
       if isinstance(current_obj, dict):
           for key, value in current_obj.items():
               current_obj[key] = _recursive_resolve(value)
       elif isinstance(current_obj, list):
           for i, item in enumerate(current_obj):
               current_obj[i] = _recursive_resolve(item)
       elif isinstance(current_obj, str):
           match = ref_pattern.match(current_obj)
           if match:
               step_index = int(match.group(1))
               result_path = match.group(2)
               if step_index < len(step_results):
                   # 从过往的步骤结果中查找
                   source_result = step_results[step_index]
                   # 根据路径获取真实值
                   real_value = _get_value_from_path(source_result, result_path)
                   print(f"成功解析引用 '{current_obj}' -> '{real_value}'")
                   return real_value
               else:
                   print(f"错误：尝试引用一个尚未执行的步骤结果 '{current_obj}'")
                   return None # 或抛出异常
       return current_obj
   return _recursive_resolve(resolved_params)
这段代码的核心是 _recursive_resolve 这个内部函数。它会深入到参数字典的“毛细血管”
中，一旦发现某个字符串值符合我们定义的 $steps. 格式，就会立刻触发解析逻辑：提取步
骤索引 N 和结果路径 path，然后从 step_results 列表中找到对应步骤的结果，再根据路
```

径取出真实值，完成替换。

有了这个强大的解析器，我们的执行引擎就拥有了处理“上下文”的能力，计划中的各个步骤终于可以“沟通”和“协作”了。

## 第四步：编码实现执行引擎主循环

现在，两大核心机制——工具注册表和引用解析器——都已就位。是时候将它们组装起来，构

```
建我们 ExecutionEngine 类的完整骨架了。
```

这个类的代码，几乎就是我们第一步设计的那个流程图的直接翻译，你会发现它非常直观。

```python
class ExecutionEngine:
   def __init__(self, tool_registry: dict):
       """
       初始化执行引擎，需要传入一个工具注册表。
       """
       self.tool_registry = tool_registry
       # 将我们前面写的解析器函数作为引擎的一个方法
       self._resolve_parameters = _resolve_parameters
   def execute_plan(self, plan: dict):
       """
       执行一个完整的JSON行动计划。
       """
       if 'plan' not in plan or not isinstance(plan['plan'], list):
           print("错误：计划格式不正确，缺少 'plan' 列表。")
           return
       # 用于存储每一步成功执行后的结果
       step_results = []
       print("---"" 开始执行行动计划 ---")
       for i, step in enumerate(plan['plan']):
           print(f">>>>> 正在执行步骤 {i}: {step.get('reasoning', '')}")
           # 1. 解析参数，处理步骤间的引用
           try:
               resolved_params = self._resolve_parameters(step['parameters'], st
           except Exception as e:
               print(f"!! 步骤 {i} 参数解析失败: {e}")
               break # 参数解析失败，终止执行
           # 2. 动态调度工具函数
           tool_name = step['tool_name']
           tool_function = self.tool_registry.get(tool_name)
           if not tool_function:
               print(f"!! 步骤 {i} 失败：未找到工具 '{tool_name}'。")
               break # 找不到工具，终止执行
           # 3. 执行工具并捕获结果
           try:
               result = tool_function(**resolved_params)
               step_results.append(result)
               print(f"<<<<< 步骤 {i} 执行成功，返回结果: {result}")
           except Exception as e:
               print(f"!! 步骤 {i} 执行时出错: {e}")
               break # 工具执行出错，终止执行
       print("\n---"" 行动计划执行完毕 ---")
       return step_results
请仔细看 execute_plan 这个方法。它完美地体现了我们的设计：一个 for 循环遍历所有
步骤，循环体内，依次调用 _resolve_parameters 来准备参数，从 tool_registry 中
动态获取函数，最后通过 try...except 块来安全地执行并保存结果。三大核心职责被清晰
```

地整合在了一个简单的循环中。

## 端到端演练：让计划真正动起来！

理论和代码都已就绪，现在，让我们进行一次完整的端到端演练，亲眼见证这个引擎是如何工作的。这，将是我们“观察 - 规划 - 执行”三部曲的高光时刻！

我们需要做的，就是把我们今天写的所有东西串联起来。

```python
if __name__ == '__main__':
   # 准备工作 1: 定义我们的工具函数（这里用简化版）
   def createComponent(parentId: str, componentType: str, properties: dict = Non
       print(f"  [执行] 调用 'createComponent', 在父组件 '{parentId}' 中创建 '{compo
       new_id = f"new_{componentType.lower()}_{parentId}"
       # 必须返回一个包含ID的字典，以便后续步骤引用
       return {"id": new_id, "status": "success"}
   # 准备工作 2: 创建并填充工具注册表
   tool_registry = {
       "createComponent": createComponent,
   }
   # 准备工作 3: 实例化执行引擎
   engine = ExecutionEngine(tool_registry)
   # 准备工作 4: 加载上一讲生成的JSON计划
   login_form_plan = {
     "plan": [
       {"step": 0, "reasoning": "创建Form容器", "tool_name": "createComponent", "
       {"step": 1, "reasoning": "创建标题", "tool_name": "createComponent", "para
       {"step": 2, "reasoning": "创建按钮", "tool_name": "createComponent", "para
     ]
   }
   # 开始执行！
   final_results = engine.execute_plan(login_form_plan)
```

当你运行这段代码，你的控制台将会依次打印出以下内容：

```
---"" 开始执行行动计划 ---
>>>>> 正在执行步骤 0: 创建Form容器
 [执行] 调用 'createComponent', 在父组件 'root' 中创建 'Form'...
<<<<< 步骤 0 执行成功，返回结果: {'id': 'new_form_root', 'status': 'success'}
>>>>> 正在执行步骤 1: 创建标题
成功解析引用 '$steps.0.result.id' -> 'new_form_root'
 [执行] 调用 'createComponent', 在父组件 'new_form_root' 中创建 'Text'...
<<<<< 步骤 1 执行成功，返回结果: {'id': 'new_text_new_form_root', 'status': 'success'
>>>>> 正在执行步骤 2: 创建按钮
成功解析引用 '$steps.0.result.id' -> 'new_form_root'
 [执行] 调用 'createComponent', 在父组件 'new_form_root' 中创建 'Button'...
<<<<< 步骤 2 执行成功，返回结果: {'id': 'new_button_new_form_root', 'status': 'succes
---"" 行动计划执行完毕 ---
```

请仔细观察这个输出！它就像是火箭发射的指挥中心屏幕。我们能清晰地看到引擎按部就班地执行每一步。最关键的是，在执行第 1 步和第 2 步时，它成功地打印出了“成功解析引用…”，

```
并将 $steps.0.result.id 替换成了第 0 步返回的真实 ID 'new_form_root'。
```

在这一刻，虽然我们只是在打印日志，但在一个真实的 Awade 平台中，用户将会在屏幕上看到一个表单被创建出来，紧接着一个标题和一个按钮被精准地添加到这个表单内部。一个抽象的 JSON 计划，就这样被我们的执行引擎，转化为了具体、可见、可交互的 UI 界面。

## 小结

今天，我们为我们的智能体装上了强有力的“四肢”——执行引擎。通过“工具注册表”和“引用解析器”这两大核心机制，我们成功打通了从抽象计划到具体执行的“最后一公里”。

至此，我们构建智能 Agent 的“观察 - 规划 - 执行”（Observe-Plan-Act）的完整闭环，正式形成！我们的 Agent 现在能看、能想、也能干了，它已经是一个初具形态的、真正意义上的智能体。

但是，我们的故事还远未结束。你可能已经注意到了，我们今天的执行引擎是一个“一帆风顺”的理想模型。它假设计划中的每一步都必然成功。可现实世界充满了意外，如果计划中的某一步执行失败了（比如网络超时、组件 ID 不存在、API 返回错误等），我们脆弱的系统就会立刻崩溃。

如何让我们的 Agent 在面对失败时，不那么“玻璃心”，甚至能像人类一样“自我反思”和“修正计划”？这，将是我们下一讲要挑战的、更高级的主题——实现 Agent 的错误处理与自我修正。

## 思考题

```
我们今天的 _resolve_parameters 函数，只支持了从 step_results 中取值。如果我们
```

想让它变得更强大，比如支持一些简单的“内联计算”或者“环境变量”，该如何扩展我们的引用语法和解析器呢？

例如，我们是否可以设计一种语法，让 Agent 能引用当前的环境信息，比如 ？

欢迎把你的设计思路写在评论区，我们一起为引擎添加更酷的特性。

我是陈旭，我们下一讲再见。
