# 13｜DSPy贴身实战
你好， 我是李锟。

在上节课中，我们通过 DSPy 的官方入门教程的 [Learn DSPy](https://dspy.ai/learn/) 栏目学习了 DSPy 的核心概念，并且通过一些简单的例子代码展示了 DSPy 的基本用法。除了入门教程外，DSPy 团队还在 [Tutorials](https://dspy.ai/tutorials/) 栏目下给出了一些更为详细的例子，以便开发者全面体验使用 DSPy 的开发过程。在这节课中，我们将带着要解决的业务需求，有针对性地学习 Tutorials 栏目下的例子。

在前面的课程中，我们已经分别使用 MetaGPT、AutoGPT、Swarm 三种开发框架实现了 24 点游戏智能体应用。在这三个实现中，有一个遗留的难题始终未能解决，那就是通过所使用的基础 LLM 直接给出满足 24 点游戏要求的表达式。

之前未能解决这个问题的根本原因在于，为了让基础 LLM 直接给出 24 点表达式，手工编写的提示词需要使用 CoT (思维链)、ToT (思维树) 等模式，写起来会非常复杂。而且这样的提示词还很脆弱，并非一直能够稳定工作 (稳定给出符合要求的表达式)。有一种拳头打在棉花上面，使不上力气的感觉。因此我们放弃了走这条路，而是使用自己手写的函数库给出 24 点表达式。

通过上节课的学习，我们已经理解到：DSPy 率先开创的 **自动提示词工程** 开发方法，正是为了解决上述手工提示词工程存在的这些问题而产生的。那么有人肯定会自然地想到，使用 DSPy 的自动提示词工程，也许有可能解决这个长时间未能解决的遗留问题。这个想法是正确的，下面我们就着手使用 DSPy 来解决这个问题。

## 使用 dspy.ChainOfThought 模块给出 24 点表达式

要求基础 LLM 给出 24 点表达式，这个问题本质上是一个较为复杂的 **数学推理问题**。那么我们首先需要寻找并学习的，就是在 Tutorials 栏目下与此类问题最相关的例子。如我们所愿，在 Tutorials 栏目下恰好有这样一个详细的例子 [Tutorial: Math Reasoning](https://dspy.ai/tutorials/math/)。

在这个例子里面使用的 DSPy 模块是 dspy.ChainOfThought（思维链模块），我们在上节课中已经看到过，与数学推理有关的任务通常都使用这个模块。在详细讲解这个例子之前，我们首先使用 dspy.ChainOfThought 模块来测试一些基础 LLM 是否能够直接给出 24 点表达式。

我们来写一个简单的测试程序，保存为 test\_llm\_give\_expression.py。

```plain
import dspy
import fire

qwen7b = dspy.LM(
    'ollama_chat/qwen2.5',
    api_base='http://localhost:11434',
    api_key='',
    temperature=1.0,
    num_retries=1000)

qwen7b_math = dspy.LM(
    'ollama_chat/qwen2-math',
    api_base='http://localhost:11434',
    api_key='',
    temperature=1.0,
    num_retries=1000)

o1_mini = dspy.LM(
    'openai/o1-mini',
    api_key='sk-xxxxxx',
    temperature=1.0,
    max_tokens=5000,
    num_retries=1000)

model_dict = {
    "qwen7b": qwen7b,
    "qwen7b_math": qwen7b_math,
    "o1_mini": o1_mini,
}

def main(model="o1_mini", point_list="1,3,6,11"):
    global model_dict
    PROMPT_TEMPLATE = """
        Use the following four natural numbers {point_list} to form a four-rule operation expression. This expression calculates a value equal to 24, where only the four natural numbers and add, subtract, multiply, divide symbols and parentheses. The expression can only have four natural numbers given in the expression, and all four natural numbers must be included.
        Please simply return an expression that meets the above requirements, don't include '= 24'.
    """

    dspy.configure(lm=model_dict[model])
    question = PROMPT_TEMPLATE.format(point_list=f"[{point_list}]")

    module = dspy.ChainOfThought("question -&gt; answer")
    result = module(question=question)
    print(result)

if __name__ == "__main__":
    fire.Fire(main)

```

上面代码中需要注意几点：

- 我配置了 3 个基础 LLM：使用 ollama 部署的 qwen2.5、qwen2-math 和位于云端的 OpenAI 公司的 o1-mini。你还可以自行添加更多的 LLM。

- 使用 OpenAI 公司的 LLM 需要注册 OpenAI 公司的账号，给账号充值并创建一个 api\_key。运行程序之前还要先解决 Linux 主机科学上网的问题，这里不便详谈。上面代码中 o1-mini 模型的参数 api\_key=‘sk-xxxxxx’ 需要替换为你自己 OpenAI 账号的 api\_key，max\_tokens 必须设置为 >= 5000。

- 我没有使用第 4 课中部署的 qwen2.5-math，而是使用了一个新的模型 qwen2-math。这是因为第 4 课中部署的 qwen2.5-math 对 JSON 格式输出支持的不够好，无法与 dspy.ChainOfThought 模块配合工作。使用 ollama 部署 qwen2-math 的方法是 ```ollama run``qwen``2-math```。

- LLM 的 temperature 参数必须设置为 1.0，因为需要进行精确的数学推理和计算，不需要 LLM 有任何天马行空的创造性。

- LLM 的 num\_retries 参数应设置为一个很大的值，例如 1000。这样当 DSPy 与 基础 LLM 交互发生错误时（尤其是与网络访问相关的错误），可以自动重试，默认情况下不会重试。


上面代码中我传递给 dspy.ChainOfThought 模块的提示词直接给出了我要求这个模块完成的任务：使用 4 个自然数构造一个结果值等于 24 的四则运算表达式。并且要求在给出的表达式必须包括所有 4 个自然数，而且只能包括这 4 个自然数。我并没有告诉 LLM 如何去做（如何开展推理来构造这个 24 点表达式，采取 CoT 还是 ToT），而只需要告诉 LLM 需要做什么，以及返回结果的格式要求。至于如何做推理，完全封装在 dspy.ChainOfThought 模块的内部实现中，我们可以理解为一种黑魔法。

首先我们来测试一下业界公认非常擅长数学推理的 o1\_mini 。

```plain
poetry run python test_llm_give_expression.py o1_mini "1,3,7,13"

```

程序的输出结果如下：

```plain
Prediction(
    reasoning='To achieve the target value of 24 using the numbers 1, 3, 7, and 13 with addition, subtraction, multiplication, division, and parentheses, the simplest approach is to add all the numbers together:\n13 + 7 + 3 + 1 = 24.',
    answer='13 + 7 + 3 + 1'
)

```

结果是正确的，看起来不错。再使用其他 4 个自然数组合对 o1\_mini 做些测试，大多数时候 o1\_mini 都能给出正确的表达式。太棒了！看来 o1\_mini 可以轻松解决给出 24 点表达式这个困难问题。果然是世界级的学霸！

当我使用 “1,3,7,11” 测试时，程序的输出结果为：

```plain
Prediction(
    reasoning='After evaluating various combinations of the numbers 1, 3, 7, and 11 using addition, subtraction, multiplication, division, and parentheses, there is no valid expression that equals 24 while using each number exactly once under the given constraints.',
    answer='No valid expression can be formed with the numbers 1, 3, 7, and 11 to equal 24 using only addition, subtraction, multiplication, division, and parentheses.'
)

```

这个结果也是正确的，因为并非所有的 4 个自然数组合都能获得满足条件的 24 点表达式。o1\_mini 并不像其他那些学渣 LLM 那样，假装自信地给出一个错误的 24 点表达式（LLM 的幻觉），而是非常诚实地承认对于当前的 4 个自然数组合，无法给出 24 点表达式。对于数学推理 + 计算相关的任务，这恰恰是我们需要的，否则会因为 LLM 固有的幻觉，导致应用中存在很多隐藏的 bug。对就是对，错就是错，在数学推理方面我们不需要任何二义性。

接下来我们再分别测试一下开源的 LLM qwen2.5 和 qwen2-math：

```plain
poetry run python test_llm_give_expression.py qwen7b "2,3,3,6"
poetry run python test_llm_give_expression.py qwen7b_math "2,3,3,6"

```

使用多个自然数组合测试后发现，qwen2.5 和 qwen2-math 大多数情况下给出的 24 点表达式都是错误的，仅在少数情况下能够给出正确的表达式。而且在部署在本地的 qwen2.5 和 qwen2-math 运行起来的速度也比云端的 o1\_mini 慢很多（取决于 Linux 主机的硬件配置）。

既然 o1\_mini 的表现已经满足了我们的业务需求，我们可以到此结束。基于 dspy.ChainOfThought 模块和 o1\_mini 重新实现 24 点游戏智能体应用。然而这样做显然不够理想，首先使用 o1\_mini 有较高的成本，其次我们并未利用上节课中介绍过的 DSPy 的优化功能，对 dspy.ChainOfThought 模块展开优化，以便通过这个模块更深入挖掘 qwen2.5 和 qwen2-math 的潜力。

接下来我们把上节课学到的那些知识应用于实战，来尝试对 dspy.ChainOfThought 模块做优化。

## 安装例子代码依赖的数学库、给 DSPy 打补丁

具体的优化方法就在这个教程 [Tutorial: Math Reasoning](https://dspy.ai/tutorials/math/) 中，我们先来通读一下这个教程，并且把教程中的例子代码运行起来。

在例子代码中的使用了 [MATH](https://arxiv.org/abs/2103.03874) 基准测试数据集来做优化。在加载这个数据集之前，需要安装例子代码依赖的一个数学库 math。

```plain
cd ~/work
git clone https://github.com/hendrycks/math.git
cd learn_dspy
poetry install --no-root && poetry run pip install -e "../math" --config-settings editable_mode=compat

```

另外还需要给 DSPy 库打个补丁，在终端窗口进入 DSPy 安装目录的子目录，然后编辑其中的 math.py。

```plain
cd ~/work/dspy/dspy/datasets
vi math.py

```

将 math.py 中的 `ds = load_dataset("lighteval/MATH", subset)` 修改为 `ds = load_dataset("DigitalLearningGmbH/MATH-lighteval", subset)`。之所以需要做这个修改，是因为 MATH 数据集的网址发生了变化，而 DSPy 库代码没有来得及做更新。

## 优化 dspy.ChainOfThought 模块

教程 [Tutorial: Math Reasoning](https://dspy.ai/tutorials/math/) 中说道：

> 最后，让我们来优化我们的模块。 由于我们需要强大的推理能力，我们将使用大型 gpt-4o 作为教师模型（用于在优化时引导小型 LM 的推理），但不作为处理提示词的模型（用于制作指令）或（训练后）执行任务的模型。 gpt-4o 将只被调用少量次数。直接参与优化和生成（优化）程序的模型将是 gpt-4o-mini。
>
> 我们还将指定 max\_bootstrapped\_demos=4，这意味着我们希望在提示中最多使用四个引导示例；指定 max\_labeled\_demos=4，这意味着在引导示例和预标签示例之间，我们希望最多使用四个示例。

这个教程的例子代码中使用了两个 LLM：OpenAI 的 gpt-4o 和 gpt-4o-mini。我对教程的代码做了一些修改，将其中的 gpt-4o 和 gpt-4o-mini 分别改成了 o1-mini 和 qwen2.5。因为在前面我对 o1-mini 给出 24 点表达式的表现非常满意，所以我希望使用 o1-mini 来指导 dspy.ChainOfThought 模块 + qwen2.5 的优化。

修改过的代码如下，将代码保存为 do\_module\_optimize.py。

```plain
import dspy

from dspy.datasets import MATH

qwen7b = dspy.LM(
    'ollama_chat/qwen2.5',
    api_base='http://localhost:11434',
    api_key='',
    temperature=1.0,
    cache=False,
    num_retries=1000)

o1_mini = dspy.LM(
    'openai/o1-mini',
    api_key='sk-xxxxxx',
    temperature=1.0,
    max_tokens=5000,
    cache=False,
    num_retries=1000)

dspy.configure(lm=qwen7b)

dataset = MATH(subset='algebra')
print(len(dataset.train), len(dataset.dev))

module = dspy.ChainOfThought("question -&gt; answer")

THREADS = 24
kwargs = dict(num_threads=THREADS, display_progress=True, display_table=5)
evaluate = dspy.Evaluate(devset=dataset.dev, metric=dataset.metric, **kwargs)

kwargs = dict(num_threads=THREADS, teacher_settings=dict(lm=o1_mini), prompt_model=qwen7b)
optimizer = dspy.MIPROv2(metric=dataset.metric, auto="medium", **kwargs)

kwargs = dict(requires_permission_to_run=False, max_bootstrapped_demos=4, max_labeled_demos=4)
optimized_module = optimizer.compile(module, trainset=dataset.train, **kwargs)

optimized_module.save("optimized_module.json")

```

上面代码中需要注意几点：

- 创建 LM 对象时增加了一个参数 cache=False，这样做是为了避免因为 LM 的缓存而导致的一些错误。缺点是会增加访问 LM 的次数（消耗更多 token 数）。对于访问部署在云端的商业 LLM，因此会增加一些成本。

- 加载的数据集为 MATH 数据集的 algebra（代数）子集，优化之后将会增强 qwen2.5 回答代数问题的能力。

- 使用的优化器为 dspy.MIPROv2，上节课中我们曾经介绍过。因为我们问的问题大多都是 0-shot 类的问题，也就是在提示词中没有包括任何示例。

- 优化的结果保存在 optimized\_module.json 文件中。


在终端窗口中执行优化程序：

```plain
cd ~/work/learn_dspy
poetry run python do_optimize.py

```

执行优化程序花费的时间很长，具体时间长度取决于 Linux 主机的硬件配置。按照我在 [第 2 课](https://time.geekbang.org/column/article/838713) 中给出的硬件配置，也需要超过 4 个小时。如果执行了 15 分钟还没有报任何错误，就不必一直等着了，可以去做些其他事情。

BTW，如果 Linux 主机位于云端，ssh 连接长时间无操作会被自动断掉，导致优化程序被系统 kill。为了防止这种情况出现，可以使用 nohup 命令来执行优化程序，具体用法你可以自行搜索。

如果优化程序执行过程中没有报任何错误，就会得到一个 optimized\_module.json 文件。这个文件不大，可以打开文件看看内容。

## 使用优化后的 dspy.ChainOfThought 模块

接下来我们写个程序测试一下优化的结果，保存为 test\_optimized\_module.py。

```plain
import dspy
import fire

qwen7b = dspy.LM(
    'ollama_chat/qwen2.5',
    api_base='http://localhost:11434',
    api_key='',
    temperature=1.0,
    num_retries=1000)

dspy.configure(lm=qwen7b)

def main():
    PROMPT_TEMPLATE = """
        The doctor has told Cal O'Ree that during his ten weeks of working out at the gym, he can expect each week's weight loss to be 1% of his weight at the end of the previous week. His weight at the beginning of the workouts is 244 pounds. How many pounds does he expect to weigh at the end of the ten weeks? Express your answer to the nearest whole number.
    """
    question = PROMPT_TEMPLATE

    module = dspy.ChainOfThought("question -&gt; answer")
    module.load("optimized_module.json")
    result = module(question=question)
    print(result})

if __name__ == "__main__":
    fire.Fire(main)

```

从这段代码可以看到，与前面的 test\_llm\_give\_expression.py 相比增加了一行代码：

```plain
module.load("optimized_module.json")

```

用来加载优化的结果。

执行测试程序：

```plain
poetry run python test_optimized_module.py

```

得到了如下输出：

```plain
Prediction(
    reasoning="Cal O'Ree is expected to lose 1% of his weight each week. Therefore, at the end of each week, he will weigh 99% of his weight from the previous week.\n\nStarting weight: 244 pounds\n\nLet \\( W_n \\) be Cal's weight at the end of week \\( n \\).\n\n\\[ W_0 = 244 \\]\n\\[ W_{n+1} = W_n \\times (1 - 0.01) = W_n \\times 0.99 \\]\n\nThe formula for his weight after \\( n \\) weeks is:\n\\[ W_n = 244 \\times (0.99)^n \\]\n\nWe need to find the weight at the end of ten weeks, which means we need to calculate \\( W_{10} \\):\n\\[ W_{10} = 244 \\times (0.99)^{10} \\]\n\nNow, let's compute this using a calculator:\n\\[ W_{10} \\approx 244 \\times 0.9043816 \\approx 220.578 \\]\n\nRounding to the nearest whole number gives us:\n\\[ W_{10} \\approx 221 \\]\n\nSo, Cal O'Ree is expected to weigh approximately 221 pounds at the end of ten weeks.",
    answer='221'
)

```

输出中的 221 是正确的答案。

可以将 module.load() 这一行注释掉，然后再执行一遍测试程序，以便与未优化的 dspy,ChainOfThought 模块的表现做一下对比。

有趣的是，未优化的 dspy,ChainOfThought 模块 + qwen2.5 同样也得到了 221 这个结果，只是 answer 内容非常啰嗦而已。所以从这个特定例子来看，似乎优化的效果不是非常明显。不过如果我们把 qwen2.5:7b 换成能力更差的 llama3.2:3b，优化的效果可能就会很明显了。

有人肯定忍不住会质疑：有更强大的 LM 不用，而使用更弱的 LM，完全不合逻辑！其实在很多资源受限的场合，需要使用更小的 LM（文件尺寸更小，推理速度更快），例如在一些嵌入设备、智能手机的运行环境中。因此通过一个强大的 LM 来对一个较弱的 LM 做优化，提升较弱 LM 在某些特定领域的能力，这其实是一件非常有价值的工作。

最后我把对 llama3.2:3b 的优化这个任务，留给你课下自行尝试。

## 未完成的后续工作

这节课我们并未直接解决如何使用 o1\_mini 来优化 qwen2.5，让 qwen2.5 能够完美地给出 24 点表达式。解决的方法与上述方法是类似的，关键是我们要构造一个符合 24 点游戏要求的自定义数据集（提示词示例的集合），替换掉优化程序中使用的 MATH 数据集。

为了使用 qwen2.5 给出 24 点表达式，后续我们需要做的工作如下：

- 仿照 MATH 数据集的格式，构造符合 24 点游戏要求的自定义数据集。数据集划分为 dev 和 train 两部分，分别对应测试集和训练集。

- 实现自定义数据集的 metric 函数（度量指标），用来衡量 LM 返回结果的质量，以便 DSPy 做优化。

- 将 do\_module\_optimize.py 中的数据集替换为自定义数据集，重新运行优化程序。

- 测试优化之后 dspy.ChainOfThought 模块 + qwen2.5 的表现。


上述 4 个步骤不是一次性瀑布式的，如果最后一步表现不佳，还可以反复迭代多次。

在学习了本节课介绍的 [Tutorial: Math Reasoning](https://dspy.ai/tutorials/math/) 这个教程后，建议你课下继续学习 [Tutorial: Agents](https://dspy.ai/tutorials/agents/) 教程，这个教程中使用的 dspy.ReAct 模块同样也是一个非常有用的模块。

## 总结时刻

DSPy 的相关内容很丰富，上节课我们对 DSPy 做了一个俯瞰，以便尽快掌握一个全貌。在这节课我们落下地面，走进 DSPy，通过贴身实战来学习掌握 DSPy。带着要解决的业务需求来学习新的技术，是最佳的学习方式。这节课我们正是从要解决的一个技术难题——要求 LLM 直接给出 24 点表达式入手，开展我们的学习。

我们首先尝试使用 dspy.ChainOfThought 模块和不同 LLM 组合给出 24 点表达式，并且发现 OpenAI 的 o1\_mini 在不做任何优化的情况下，已经足以完成这个任务。

接下来我们学习了 [Tutorial: Math Reasoning](https://dspy.ai/tutorials/math/) 这个教程，并且运行了其中的例子代码，仅仅修改了例子代码中使用的 LLM。通过学习这个教程，我们掌握了优化 DSPy 模块的方法和步骤。

虽然本节课并未达到我们的最终目标——使用 dspy.ChainOfThought 模块 + qwen2.5 完美地给出 24 点表达式。但是我们在这里学习到的知识，为我们实现这个最终目标指明了清晰的方向。根据你的反馈，未来我们也可以考虑增加关于 DSPy 的课程。

本节课是我们这套课程入门篇的最后一课。本节课学习结束，你已经很好地掌握了 MetaGPT、AutoGPT、Swarm、DSPy 四种开发框架的使用方法，打下了一个非常坚实的基础。下节课我们将进入这套课程的进阶篇的第一课，暂别纯技术（代码 + 算法），从产品经理和业务架构师角度，介绍设计复杂 Autonomous Agent 应用的要点，以及需要避免的各种陷阱。

## 思考题

1. 总结一下，对 DSPy 的模块做优化，需要做哪些工作，有哪些注意事项？

2. 除了 qwen2.5（默认为7b版本）外，还可以使用其他 ollama 支持的开源 LLM 跑一下优化程序，看看哪个 LLM 表现更好。可选择的开源 LLM：llama3.2、gemma2、glm4、deepseek-v2，另外还可以测试一下 qwen2.5:14b。


欢迎你把你试验的结果分享到留言区，和我一起交流，如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给其他朋友，我们下节课再见！