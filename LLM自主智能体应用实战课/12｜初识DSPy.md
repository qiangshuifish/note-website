# 12｜初识DSPy
你好，我是李锟。

从这节课开始，我将用两节课的篇幅，带你学习一类全新的 LLM 应用开发框架—— **自动提示词工程** 开发框架，这是 LLM 应用开发方面一个方兴未艾的领域。我选择的开发框架是由美国斯坦福大学 NLP 课题组发布的 DSPy，这是世界上第一个自动提示词工程开发框架。

DSPy 是 Declarative Self-improving Python （声明式自我改进 Python）的缩写。开发者可以编写 **组合式 Python 代码**，然后使用 DSPy 来教 (所使用的) LLM 生成高质量的输出结果，而不是为 LLM 编写脆弱的提示词。

DSPy 的研究工作于2022年2月在斯坦福 NLP 课题组启动，第一个版本于2022年12月作为 DSP 发布，并于2023年10月发展成为 DSPy。

在学习 DSPy 之前，我们有必要先搞清楚 DSPy 致力于解决什么问题。

## DSPy 要解决的问题

与之前我们学习过的支持多 Agent 协作的应用开发框架相比，DSPy 要解决的是一个更深层次的问题。

在我们之前实现的那个 24 点游戏智能体应用中，使用的提示词不多，而且相对来说是很简单的。我们到目前为止只使用了一种 LLM，即阿里巴巴开源的 qwen2.5。对于这个较为简单的应用来说，手工编写提示词是足够了。然而当应用的复杂性大幅提高之后，手工提示词的缺点就会变得越来越突出，其压力甚至让团队无法承担。

目前，使用 LM (语言模型，包括大模型和小模型) 构建应用程序不仅很复杂，而且很脆弱。LM 对于提供给它的提示词非常敏感，因此典型的工作流管道（pipeline）通常使用提示词来实现，而提示词则是通过反复试验手工编写的。要构建可靠的 AI 系统，就必须快速迭代。但是维护提示词会让快速迭代非常艰难：每次更改 LM、度量指标（metrics）或管道（pipeline）时，都会迫使开发者对提示词或数据进行修补，否则就会削弱应用的性能。

好的提示词非常重要，我们确实需要培养一些真正的 **提示词专家**，他们熟悉各种提示词的编写策略，例如 CoT 思维链、ToT 思维树等等，熟悉为各种流行的 LLM 编写提示词的技巧，善于绕开特定 LLM 提示词的陷阱（由于特定 LLM 不完善造成的）。

然而，如果只依赖这一条路，这种开发方式是 **可持续** 的吗？事倍功半还是事半功倍？培养提示词专家这件事看起来相当艰巨，容易成为一种玄学。一旦一位提示词专家离职了，可能很长时间无法招到或培养出同等水平的提示词专家。项目中的提示词日积月累，越来越多、越来越复杂，维护修改提示词需要投入更多人力，成本越来越高。貌似这是一条不归路，整个团队的生活都会越来越艰难，就像走在看不到边界的泥泞沼泽之中。

在 01 课中我曾经提到过，开发 Autonomous Agent 应用的技术基础是深度强化学习 DRL（Deep Reinforcement Learning），那么是否有可能把开发 LLM 应用转化为类似 DRL 的 **优化和迭代** 过程呢？

DSPy 其实走的就是这条路，它其实是一个 **机器学习框架**。如果你之前有一些深度学习方面的知识，对于优化基于深度学习的 AI 应用有一些经验，理解掌握 DSPy 会更加容易。DSPy 就是将开发 LLM 应用转化成一个对 DRL 系统进行持续优化的过程。一个 DSPy 应用的开发过程，更像是一个 AI 应用的开发过程，而不像一个普通业务系统的开发过程。

官方文档中是这样说的：

> DSPy 是用于编写代码而非编写提示词的 LLM 应用开发框架。它允许开发者通过快速迭代构建模块化的 AI 系统，并提供优化提示词和模型权重的算法，无论开发者是在构建简单的 **分类器**、复杂的 **RAG 管道**（RAG pipelines）还是 **智能体循环**（Agent loops）。

在发布形式上，DSPy 也是一个方便使用的库，可以被嵌入在其他 LLM 应用开发框架之中，包括 ChatBot 开发框架和 Autonomous Agent 开发框架。我们优先关注的是如何将 DSPy 应用在我们的 Autonomous Agent 应用开发场景之中，最终目标是获得一个灵活而健壮的 Autonomous Agent 应用。

DSPy 只依赖 Python，可以使用 Python 3.12 及以上版本。以下所有 Python 代码我都是使用 Python 3.12 开发的。

## Python 项目初始化

为了学习 DSPy，我们首先初始化一个 Python 项目。在 Linux 主机的终端窗口执行以下命令：

```plain
mkdir -p ~/work/learn_dspy
cd ~/work/learn_dspy
touch README.md
# 创建poetry虚拟环境，一路回车即可
poetry init

```

因为众所周知的原因，建议你使用国内的 Python 库镜像服务器，例如上海交大的镜像服务器：

```plain
poetry source add --priority=primary mirrors https://mirror.sjtu.edu.cn/pypi/web/simple

```

如果上海交大镜像服务器的访问速度很慢，也可以使用其他镜像服务器，你可以自己搜索其他镜像服务器的地址。

然后安装一些常用的 Python 库：

```plain
poetry add pysocks socksio

```

DSPy的开发团队负责人是 [Omar Khattab](https://twitter.com/lateinteraction)，DSPy 项目的 [源代码](https://github.com/stanfordnlp/dspy) 和 [官方文档](https://dspy.ai) 你可以点击链接查看。

## 安装 DSPy 并运行第一个例子

与 MetaGPT 类似，DSPy 有两种安装方式，官方 Python 库安装和源代码安装。为了体验 DSPy 团队的最新研发成果，在课程中我推荐选择使用源代码来安装。执行以下命令安装 DSPy：

```plain
cd ~/work
git clone https://github.com/stanfordnlp/dspy.git
cd learn_dspy
# poetry add --editable "../dspy"
poetry install --no-root && poetry run pip install -e "../dspy" --config-settings editable_mode=compat

```

接下来我们运行一个简单的例子，验证 DSPy 是否可以正常工作。

DSPy 直接支持通过 ollama 部署的各种开源 LLM，因此使用 qwen2.5 非常简单，指定一下模型名称即可。将以下代码保存为 test\_dspy.py：

```plain
import dspy

lm = dspy.LM('ollama_chat/qwen2.5', api_base='http://localhost:11434', api_key='')
dspy.configure(lm=lm)

math = dspy.ChainOfThought("question -&gt; answer: float")
response = math(question="Two dice are tossed. What is the probability that the sum equals two?")
print(response)

```

运行第一个例子：

```plain
cd ~/work/learn_dspy
poetry run python test_dspy.py

```

如果没有报任何错误，就表示 DSPy 已经安装成功，并且成功调用了 qwen2.5。

虽然这个例子只是为了验证 DSPy 可以正常工作，不过我还是先做个简单解释。在这个例子中，我创建了一个 dspy.ChainOfThought 类型的问答模块 math，然后向 math 模块提出了一个问题：掷出两个骰子，总和等于2的概率是多少？在我的机器上的运行结果如下：

```plain
Prediction(
    reasoning='When two dice are tossed, there are 36 possible outcomes since each die has 6 faces. The only way to get a sum of 2 is if both dice show a 1 (1+1). Therefore, the probability is 1 out of 36.',
    answer=0.027777777777777776
)

```

在 math 模块的运行结果里面，qwen2.5 给出了推理的依据：当两个骰子被掷出时，有36种可能的结果，因为每个骰子都有6个面。得到2之和的唯一方法是：两个骰子都显示一个1 (1+1)。因此，概率是1/36。

这个答案是正确的，看起来有些神奇是吧？

## DSPy 官方文档导读

与之前几种开发框架的学习方式类似，我在这里对如何阅读 DSPy 官方文档做一个导读。这节课我们先从空中俯瞰一下 DSPy 的全貌。

DSPy 的官方文档按照栏目划分成了 4 块：

- [Get Started](https://dspy.ai/)：DSPy 的概述；

- [Learn DSPy](https://dspy.ai/learn/)：学习 DSPy 开发的入门教程；

- [Tutorials](https://dspy.ai/tutorials/)：一些更加具体的教程；

- [API Reference](https://dspy.ai/api/adapters/Adapter/)：API 参考手册。


对于初学者，只需要先读一下前两个栏目，然后编写一些代码，有了一些开发经验之后再继续阅读后面两个栏目。

顺便说一下，在 DSPy 项目的源代码中，也有很多例子： [https://github.com/stanfordnlp/dspy/tree/main/examples](https://github.com/stanfordnlp/dspy/tree/main/examples)

项目的源代码中的这些例子都是基于 DSPy 2.4 版开发的，已经不适用于最新的 DSPy 2.6 版，因此都被标注为已废弃。上述 Tutorials 教程中的例子才是最新的例子，适用于 DSPy 2.6 版。

### DSPy 的核心概念

模块（module）和 优化器（optimizer）是 DSPy 的两个核心概念。

#### DSPy 模块

DSPy 的模块用于帮助开发者将 AI 相关行为描述为代码，而不是字符串（即提示词）。

以下是一个最简单的模块 dspy.Predict 的例子：

```plain
sentence = "it's a charming and often affecting journey."  # example from the SST-2 dataset.

# 1) Declare with a signature.
classify = dspy.Predict('sentence -&gt; sentiment: bool')

# 2) Call with input argument(s).
response = classify(sentence=sentence)

# 3) Access the output.
print(response.sentiment)

```

在这段代码中，我们创建了一个 dspy.Predict 类型的模块 classify，用来判断一段自然语言的情感是积极的还是消极的。

对于模块来说，最重要的概念是模块的 **签名**（Signature）。签名代表了你希望使用 LM 完成某项任务的行为提示。前面运行过的第一个例子中的 “question -> answer: float” 就是一个最简单的字符串形式的签名，指明了这个 dspy.ChainOfThought() 类型的模块，是一个完成问答任务的模块，其输出结果应该是一个浮点数。

```plain
math = dspy.ChainOfThought("question -&gt; answer: float")

```

签名是 DSPy 模块输入/输出行为的 **声明性规范**。签名允许你告诉 LM 它需要做什么，而不是指定 LM 具体如何去做。模块的签名有两种实现方式：使用 **内联的字符串** 和使用 **自定义的类**，详见官方文档。

关于模块，Learn DSPy 教程中说到：

- DSPy 模块是使用 LM 的应用程序的构件，每个内置模块都抽象了一种提示词技术，例如思维链或 ReAct。最重要的是，它们经过了泛化，支持处理任何签名。

- DSPy 模块具有可学习的参数（即构成提示词和 LM 模型权重的小部件），可以被调用以处理输入并返回输出。

- 多个模块可以组成更大的模块（程序）。DSPy 模块的灵感直接来源于 PyTorch 中的 NN 模块，但应用在 LM 程序。


#### Optimizer（优化器）

DSPy 的优化器（optimizers，前身叫提词器 teleprompters）是一种算法，可以对 DSPy 程序的参数（即提示词和/或 LM 模型权重）做调优，以最大限度地提高开发者指定的度量指标，例如准确性。

以下是最常用的优化器 BootstrapFewShotWithRandomSearch 的例子。

```plain
from dspy.teleprompt import BootstrapFewShotWithRandomSearch

# Set up the optimizer: we want to "bootstrap" (i.e., self-generate) 8-shot examples of your program's steps.
# The optimizer will repeat this 10 times (plus some initial attempts) before selecting its best attempt on the devset.
config = dict(max_bootstrapped_demos=4, max_labeled_demos=4, num_candidate_programs=10, num_threads=4)

teleprompter = BootstrapFewShotWithRandomSearch(metric=YOUR_METRIC_HERE, **config)
optimized_program = teleprompter.compile(YOUR_PROGRAM_HERE, trainset=YOUR_TRAINSET_HERE)

```

所有优化器都共享这个通用的编程接口，只是在关键字参数（超参数）上有些不同。

典型的 DSPy 优化器需要三样东西：

- 你的 DSPy 程序。这可能是一个单一模块，如 dspy.Predict，也可能是一个复杂的多模块程序。

- 你的度量指标。这是一个评估程序输出的函数，并给程序打分，分数越高越好。

- 少量训练输入。这可能是个非常小的集合（即只有 5 或 10 个例子）且不完整（只有程序的输入，没有任何标注）。


### 学习 DSPy

理解了 DSPy 的两个核心概念，接下来我们大致浏览一下 [Learn DSPy](https://dspy.ai/learn/) 这个入门教程。

在 DSPy 中构建 AI 系统可以划分为三个阶段：

1. **DSPy 编程**：定义你的任务、任务的限制条件、探索一些示例，并以此来指导你的初始管道设计\*\*。

2. \*\*DSPy 评估：一旦你的系统开始工作，在这个阶段你可以收集初始开发集、定义 DSPy 度量指标（metrics），并使用这些度量指标更系统地迭代你的系统。

3. **DSPy 优化**：一旦有了评估系统的方法，你就可以使用 DSPy 优化器来调优程序中的提示词或模型权重。


接下来我分别介绍一下这三个阶段的要点。

#### DSPy 编程

在编程阶段需要完成两个工作：定义任务（defining your task）和定义初始管道（define your initial pipeline）。

DSPy 将一个 LM 应用的工作流视为由一系列管道组成。对于一个 DSPy 应用，建立正确的控制流（即管道设置）是至关重要的。

管道其实是开发企业应用时最常见的设计模式之一，LM 应用也可以按照这种模式来设计和建造。随着学习的深入，在后面我们会理解采用管道这种设计模式对于自动化优化的巨大优势。

#### DSPy 评估

在评估阶段需要完成三个工作：

- 收集初始开发集（an initial development set）

- 定义系统的度量指标（metrics）

- 使用度量指标对应用做性能评估


一旦有了初始系统，就应该收集初始开发集，以便更系统地完善它。

接下来，你应该定义你的系统的 DSPy 度量指标，即评价系统输出好坏的指标是什么？度量指标是一个函数，它可以从数据中提取示例，并获取系统的输出结果，然后返回一个得分。

一旦有了度量指标，就可以对应用做性能评估。以下是使用 DSPy 内置的评估工具，利用度量指标做性能评估的例子。

```plain
from dspy.evaluate import Evaluate

# Set up the evaluator, which can be re-used in your code.
evaluator = Evaluate(devset=YOUR_DEVSET, num_threads=1, display_progress=True, display_table=5)

# Launch evaluation.
evaluator(YOUR_PROGRAM, metric=YOUR_METRIC)

```

#### DSPy 优化

一旦有了一个系统和评估此系统的方法，就可以使用 DSPy 优化器来对程序中的提示词或模型权重进行调优。

如果在这个过程中，你不喜欢最终程序或度量指标中的某些部分，就可以回到步骤 1（DSPy 编程），开始下一轮迭代。迭代开发是关键，DSPy 为开发者提供了渐进式开发的工具。对于数据、程序结构、断言、度量指标、优化的步骤，都可以开展迭代。

DSPy 有很多种类的优化器，在 Learn DSPy 教程中给出了选择何种优化器的指南：

- 如果例子很少（10 个左右），可以从 BootstrapFewShot 开始。

- 如果数据较多（50 个或更多），可以尝试 BootstrapFewShotWithRandomSearch。

- 如果只希望进行指令优化（即希望保持 0 次提示），可以使用配置为 0 次优化的 MIPROv2 进行优化。

- 如果你愿意使用更多的推理调用来执行更长时间的优化运行（例如 40 次试验或更多），并且有足够的数据（例如 200 个示例或更多，以防止过度拟合），那么请尝试使用 MIPROv2。

- 如果你已经能够使用其中一个大型 LM（例如 7B 参数或以上），并且需要一个非常高效的程序，那么请使用 BootstrapFinetune 对小型 LM 进行微调，以完成你的任务。


## 总结时刻

这节课我初步介绍了自动提示词工程开发框架 DSPy，包括 DSPy 致力于解决的问题、DSPy 的两个核心概念模块和优化器、构建 DSPy 应用的三个阶段。

手工提示词工程并非不再重要，在很多简单的场景中，手工提示词工程仍然很有用。但是我们必须认识到手工提示词工程的巨大缺陷，不能把自己未来的赌注完全下在这“华山”一条路上。学习并熟练掌握自动提示词工程开发框架，可以与手工提示词工程形成良好互补。在很多复杂的场景中起到事半功倍的神奇效果，极大提高 LLM 应用的健壮性、可维护性和可移植性。

DSPy 的内容很丰富，这节课中只是先做了一个概览。在下节课中，我们将进入实战环节，使用 DSPy 来实现 24 点游戏智能体应用。因为 24 点游戏智能体应用中使用到的提示词比较简单，基于 DSPy 实现这个应用并不困难，但是无法充分展示 DSPy 的优势。因此我只是简单展示一下 DSPy 版本的 24点游戏智能体应用的实现，然后介绍 DSPy 的一些高级使用技巧。

## 思考题

根据你已掌握的知识和开发经验，说说手工提示词工程的缺点主要有哪些？

期待你的分享。如果今天的内容对你有所帮助，也期待你转发给你的同事或者朋友，大家一起学习，共同进步。我们下节课再见！