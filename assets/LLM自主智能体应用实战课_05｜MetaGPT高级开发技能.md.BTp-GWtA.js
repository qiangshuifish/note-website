import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"05｜MetaGPT高级开发技能","description":"","frontmatter":{},"headers":[{"level":2,"title":"DataInterpreter","slug":"datainterpreter","link":"#datainterpreter","children":[{"level":3,"title":"使用 DataInterpreter 重新实现 24 点游戏智能体","slug":"使用-datainterpreter-重新实现-24-点游戏智能体","link":"#使用-datainterpreter-重新实现-24-点游戏智能体","children":[]}]},{"level":2,"title":"AFlow 初体验","slug":"aflow-初体验","link":"#aflow-初体验","children":[{"level":3,"title":"AFlow 致力于解决的问题","slug":"aflow-致力于解决的问题","link":"#aflow-致力于解决的问题","children":[]},{"level":3,"title":"体验 AFlow 的例子","slug":"体验-aflow-的例子","link":"#体验-aflow-的例子","children":[]}]},{"level":2,"title":"MetaGPT 1.0 版展望","slug":"metagpt-1-0-版展望","link":"#metagpt-1-0-版展望","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"LLM自主智能体应用实战课/05｜MetaGPT高级开发技能.md","filePath":"LLM自主智能体应用实战课/05｜MetaGPT高级开发技能.md","lastUpdated":1779815961000}'),t={name:"LLM自主智能体应用实战课/05｜MetaGPT高级开发技能.md"};function l(r,a,i,o,c,u){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_05-metagpt高级开发技能" tabindex="-1">05｜MetaGPT高级开发技能 <a class="header-anchor" href="#_05-metagpt高级开发技能" aria-label="Permalink to &quot;05｜MetaGPT高级开发技能&quot;">​</a></h1><p>你好，我是李锟</p><p>在上节课中第二版的24点游戏智能体实现中，我们分别调用 qwen2.5 和 qwen2.5-math 来实现随机发牌（DealCards）和检查表达式是否正确（CheckExpression）的任务。自己手写这些代码当然也不难，不过此类任务千变万化，针对每个新的任务都要重写一套代码，似乎不够 AI。难道我们做 AI 开发就是所谓的“我负责人工，你负责智能”？！</p><p>其实 MetaGPT 开发团队已经开发了一个通用的多功能组件，这两个任务都可以交给这个通用组件来完成，这个组件叫做 DataInterpreter（数据解释器）。</p><h2 id="datainterpreter" tabindex="-1">DataInterpreter <a class="header-anchor" href="#datainterpreter" aria-label="Permalink to &quot;DataInterpreter&quot;">​</a></h2><p>什么是数据解释器呢？我们看一下 <a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/intro.html" target="_blank" rel="noreferrer">数据解释器的官方文档</a> 的描述：</p><blockquote><p>数据解释器是一个通过编写代码来解决数据相关问题的智能体。它能理解用户需求，制定计划，编写执行代码，并在必要时使用工具。这些能力使它能够处理广泛的场景，请查看论文和下面的示例列表。</p></blockquote><p>这段描述比较简略，不是很清晰，只能让人有一种不明觉厉的印象。不过这个不是大问题，MetaGPT 团队在项目中给出了很多使用 DataInterpreter 的例子，包括了以下这些：</p><ul><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/data_visualization.html" target="_blank" rel="noreferrer">数据可视化</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/machine_learning.html" target="_blank" rel="noreferrer">机器学习建模</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/machine_learning_with_tools.html" target="_blank" rel="noreferrer">使用工具进行机器学习建模</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/image_removebg.html" target="_blank" rel="noreferrer">图像背景移除</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/solve_mathematical_problems.html" target="_blank" rel="noreferrer">解决数学问题</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/ocr_receipt.html" target="_blank" rel="noreferrer">票据OCR</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/imitate_webpage.html" target="_blank" rel="noreferrer">工具使用：网页仿写</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/crawl_webpage.html" target="_blank" rel="noreferrer">工具使用：网页爬取</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/text2image.html" target="_blank" rel="noreferrer">工具使用：文转图</a></p></li><li><p><a href="https://docs.deepwisdom.ai/main/zh/guide/use_cases/agent/interpreter/email_summary.html" target="_blank" rel="noreferrer">工具使用：邮件总结与回复</a></p></li></ul><p>有了可运行的例子代码，事情就好办多了。有一句话叫“一图胜千言”，其实对于我们程序员来说，有一些可运行的例子代码（包括验收测试代码）比什么都宝贵。</p><p>对于 24 点游戏智能体这个应用而言，要解决的 3 个问题，其中有两个都是数学问题。所以我们先看一下上述例子中“解决数学问题”的这个，其余的例子可以留待日后再仔细阅读。</p><p>这个例子的代码如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import asyncio</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from metagpt.roles.di.data_interpreter import DataInterpreter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def main(requirement: str = &quot;&quot;):</span></span>
<span class="line"><span>    di = DataInterpreter()</span></span>
<span class="line"><span>    await di.run(requirement)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    requirement = &quot;Solve this math problem: The greatest common divisor of positive integers m and n is 6. The least common multiple of m and n is 126. What is the least possible value of m + n?&quot;</span></span>
<span class="line"><span>    # answer: 60 (m = 18, n = 42)</span></span>
<span class="line"><span>    asyncio.run(main(requirement))</span></span></code></pre></div><p>这段代码很短，看起来很简单直观。在代码中创建了一个 DataInterpreter 对象实例，然后给它一段提示词，让它解决一个数学问题：正整数 m 和 n 的最大公约数是 6，m 和 n 的最小共同倍数是 126。m + n 的最小可能值是多少？</p><p>将这段代码保存为 solve_math_problems.py，然后使用 poetry 执行：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>poetry run python solve_math_problems.py</span></span></code></pre></div><p>执行过程中，在终端窗口输出了 DataInterpreter 对象解决问题的详细步骤和过程。</p><p>从输出内容中我们可以得知，DataInterpreter 对象首先分析交给它的任务（提示词），确定解决此问题的需要完成哪些任务，所需要完成的任务按照以下格式输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        &quot;task_id&quot;: &quot;1&quot;,</span></span>
<span class="line"><span>        &quot;dependent_task_ids&quot;: [],</span></span>
<span class="line"><span>        &quot;instruction&quot;: &quot;Determine the possible values of m and n based on their GCD and LCM&quot;,</span></span>
<span class="line"><span>        &quot;task_type&quot;: &quot;other&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>接下来，DataInterpreter 对象确定如何编写代码来实现这个任务，并且编写了以下代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from sympy import symbols, Eq,solve</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Given values</span></span>
<span class="line"><span>gcd_m_n = 6</span></span>
<span class="line"><span>lcm_m_n = 126</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Let m = 6a and n = 6b where a and b are coprime (i.e., gcd(a, b) = 1)</span></span>
<span class="line"><span># Then lcm(m, n) = 6ab = 126 =&amp;gt; ab = 21</span></span>
<span class="line"><span># We need to find all pairs (a, b) such that gcd(a, b) = 1 and a * b = 21</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Possible factor pairs of 21: (1, 21), (3, 7)                        # Check which pairs are coprime</span></span>
<span class="line"><span>pairs = [(1, 21), (3, 7)]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Calculate m and n for each pair and find the minimum value of m + n  possible_values = []</span></span>
<span class="line"><span>for a, b in pairs:</span></span>
<span class="line"><span>    if gcd_m_n * a &amp;gt; 0 and gcd_m_n * b &amp;gt; 0:  # Ensure positive integers</span></span>
<span class="line"><span>        m = gcd_m_n * a</span></span>
<span class="line"><span>        n = gcd_m_n * b</span></span>
<span class="line"><span>        possible_values.append(m + n)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The least possible value of m + n</span></span>
<span class="line"><span>min_value = min(possible_values)</span></span>
<span class="line"><span>print(min_value)</span></span></code></pre></div><p>最后，DataInterpreter 对象执行编写的代码，输出上述数学问题的结果为 60。结果是正确的。</p><p>从这个例子我们可以了解到，DataInterpreter 对象解决问题的步骤通常分为 3 个阶段。</p><ol><li><p>制定计划，确定需要完成的任务。</p></li><li><p>根据计划编写代码。</p></li><li><p>执行编写的代码。</p></li></ol><p>在每一个阶段 DataInterpreter 对象都需要与基础 LLM 进行交互。DataInterpreter 对象的能力表现，最终还是依赖于所使用的基础 LLM 的能力。好消息是，我们在前面几节课中使用的 qwen2.5，是一个能力很强的开源 LLM，即使我们前面所使用的默认的 7b 版本，也足以完成很多复杂的任务。</p><p>既然 DataInterpreter 是一个可重用的通用组件，那么我们可以将它包装在我们自己的代码里面来调用。接下来我们使用 DataInterpreter 来重新实现 24点游戏智能体应用。</p><h3 id="使用-datainterpreter-重新实现-24-点游戏智能体" tabindex="-1">使用 DataInterpreter 重新实现 24 点游戏智能体 <a class="header-anchor" href="#使用-datainterpreter-重新实现-24-点游戏智能体" aria-label="Permalink to &quot;使用 DataInterpreter 重新实现 24 点游戏智能体&quot;">​</a></h3><p>我修改了上节课的代码实现，新的实现为 24 点游戏智能体应用的第三版。保存在 game_judger_v3.py 和 play_24_points_game_v3.py 中。主要的修改都位于 game_judger_v3.py 中。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def extract_result(llm_resp: str):</span></span>
<span class="line"><span>    search_obj = re.search(r&#39;&quot;result&quot;: &quot;(.*)&quot;&#39;, llm_resp, re.M | re.I)</span></span>
<span class="line"><span>    if search_obj is None:</span></span>
<span class="line"><span>        print(f&quot;search pattern not found!!&quot;)</span></span>
<span class="line"><span>        result = None</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        result = search_obj.group(1).replace(&quot;\\\\n&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return result</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def extract_numbers_from_di(llm_resp: str) -&amp;gt; list:</span></span>
<span class="line"><span>    result = extract_result(llm_resp)</span></span>
<span class="line"><span>    if result is None:</span></span>
<span class="line"><span>        rsp = []</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        rsp = eval(result)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return rsp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def get_random_number_with_di(old_arrays: list[int] = []) -&amp;gt; list:</span></span>
<span class="line"><span>    PROMPT_TEMPLATE: str = &quot;&quot;&quot;</span></span>
<span class="line"><span>    Generate 4 random natural numbers between 1 and 13, include 1 and 13. Just return 4 numbers in an array, don&#39;t include other content. The returned array should not be repeated with the following arrays:</span></span>
<span class="line"><span>    {old_arrays}</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    requirement = PROMPT_TEMPLATE.format(old_arrays=old_arrays)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    _print_level = &quot;ERROR&quot;</span></span>
<span class="line"><span>    di = DataInterpreter()</span></span>
<span class="line"><span>    result = await di.run(requirement)</span></span>
<span class="line"><span>    _print_level = &quot;INFO&quot;</span></span>
<span class="line"><span>    number_list = extract_numbers_from_di(result.content)</span></span>
<span class="line"><span>    return number_list</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def extract_check_result_from_di(llm_resp: str) -&amp;gt; str:</span></span>
<span class="line"><span>    result = extract_result(llm_resp)</span></span>
<span class="line"><span>    if result is None:</span></span>
<span class="line"><span>        rsp = False</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        rsp = eval(result)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if rsp:</span></span>
<span class="line"><span>        return &quot;Correct&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &quot;Wrong&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def check_expression_with_di(expression: str):</span></span>
<span class="line"><span>    PROMPT_TEMPLATE: str = &quot;&quot;&quot;</span></span>
<span class="line"><span>    Calculate the result of this conditional expression &#39;abs(({expression}) - 24) &amp;lt; 0.1&#39;.</span></span>
<span class="line"><span>    Just return &quot;True&quot; or &quot;False&quot;, don&#39;t return other content.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    requirement = PROMPT_TEMPLATE.format(expression=expression)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    di = DataInterpreter()</span></span>
<span class="line"><span>    result = await di.run(requirement)</span></span>
<span class="line"><span>    return result.content</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class DealCards(Action):</span></span>
<span class="line"><span>    name: str = &quot;DealCards&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async def run(self, context: str):</span></span>
<span class="line"><span>        old_arrays = get_old_point_arrays(context)</span></span>
<span class="line"><span>        print(f&quot;used old_arrays is :{old_arrays}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        rsp = await get_random_number_with_di(old_arrays)</span></span>
<span class="line"><span>        return f&quot;{​{\\&quot;point_list\\&quot;: {rsp}​}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CheckExpression(Action):</span></span>
<span class="line"><span>    name: str = &quot;CheckExpression&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async def run(self, expression: str):</span></span>
<span class="line"><span>        if expression == &quot;expression not found&quot;:</span></span>
<span class="line"><span>            return &quot;Correct&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        rsp = await check_expression_with_di(expression)</span></span>
<span class="line"><span>        check_result = extract_check_result_from_di(rsp)</span></span>
<span class="line"><span>        return check_result</span></span></code></pre></div><p>上述代码中，在 get_random_number_with_di() 和 check_expression_with_di() 两个函数中均使用了 DataInterpreter 对象，分别实现 <strong>发牌</strong>（生成 4 个整数）和 <strong>检查表达式是否正确</strong> 的功能。DealCards 和 CheckExpression 两个 Action 的实现修改为分别调用上述两个函数。而调用 DataInterpreter 的提示词，与上节课第二版实现中直接调用基础 LLM（qwen2.5 和 qweb2.5-math）的提示词是相同的。</p><p>在第三版中还有一个有趣的改动，我们不再需要使用 qwen2.5-math 这个专门用于做数学计算的基础 LLM 了。使用 DataInterpreter 对象之后，qwen2.5 已经足以完成任务。因为在第三版实现中，并非要求基础 LLM 直接给出计算的结果，而是要它先编写代码，然后通过执行代码来给出计算的结果。</p><p>我们在终端窗口把第三版 24 点游戏智能体应用运行起来看看效果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>poetry run python play_24_points_game_v3.py</span></span></code></pre></div><p>BTW，我曾经试图使用 DataInterpreter 对象来解决上节课中第三个最复杂的问题，即使用基础 LLM 直接给出满足 24 点游戏要求的表达式。不过我尝试了很多不同的提示词，DataInterpreter 对象都未能给出正确的表达式。DataInterpreter 目前的实现看来还不是很强大，另外目前的实现基本上还是瀑布式的单轮工作流程，未来需要增加对于迭代的支持。这个问题可以留到日后再继续尝试解决。</p><p>从目前的完成度和质量来看，DataInterpreter 还只能算是一个半成品。期待 DataInterpreter 的能力在即将发布的 MetaGPT 1.0 版本中得到进一步增强。另外DataInterpreter 类目前的内部实现存在一个严重问题，其方法粒度较大，导致在创建该类的子类时，很难在子类的方法内重用父类的方法，往往只能将代码全部复制到子类方法内进行修改，这不符合面向对象编程的一些要求。这个问题也是亟待解决的一个重要问题，我已经反馈给 MetaGPT 开发团队。</p><p>介绍完了 DataInterpreter，接下来我再介绍一下 AFlow。</p><h2 id="aflow-初体验" tabindex="-1">AFlow 初体验 <a class="header-anchor" href="#aflow-初体验" aria-label="Permalink to &quot;AFlow 初体验&quot;">​</a></h2><p>MetaGPT 团队是一个非常有探索精神的团队，他们一个最新的重大研发成果是所谓的 <strong>AFlow</strong>。这个专业术语来自于一篇发表在 arXiv 网站上的论文，标题为 <a href="https://arxiv.org/abs/2410.10762" target="_blank" rel="noreferrer">AFLOW: AUTOMATING AGENTIC WORKFLOW GENERATION</a>（自动化智能体工作流生成）。为了便于国内的开发者深入学习，我已经将这篇论文全文翻译为中文，可以从这里下载 <a href="https://gitee.com/mozilla88/autonomous_agent/blob/master/lesson_05/aflow/2410.10762v1_cn.pdf" target="_blank" rel="noreferrer">AFlow 论文中文版</a>。</p><p>AFlow 这个领域目前还处于研究阶段，因此有很强的学术性。但是 AFlow 已经引起了业界的广泛关注，所以在关于 MetaGPT 的最后一课中，我感觉有必要给你介绍一下。</p><p>在国内的一些 LLM 应用开发教程中，作者喜欢抛出来很多论文给读者去阅读。然而我很不喜欢这种教学方法，我认为无法以通俗的语言来讲解新技术，显然是能力不足的体现。而那些无法以通俗的语言讲清楚的技术，大多数也不是非常重要，很可能只是某种屠龙之技。用很多论文或者数学公式对读者狂轰滥炸，是我相当鄙视的行为。</p><p>尽管如此，但对于 AFlow 这个重要的新生事物来说，花些时间通读一下相关论文，我感觉还是很有必要的。论文比较长，因为课程的篇幅限制，我无法在这里详细讲解论文的内容。只是介绍一下 AFlow 究竟解决了什么问题，并且带你初步体验一下 AFlow。</p><h3 id="aflow-致力于解决的问题" tabindex="-1">AFlow 致力于解决的问题 <a class="header-anchor" href="#aflow-致力于解决的问题" aria-label="Permalink to &quot;AFlow 致力于解决的问题&quot;">​</a></h3><p>在各种支持多 Agent 协作的 Autonomous Agent 开发框架之中，为了达到业务目标而实现的工作流有两种实现方式。</p><p>第一种最简单直接的方式是通过手工来实现。为了便于实现工作流，有些开发框架还会为开发者提供一些图形化的设计工具（在 AutoGPT 中我们即将看到），以便提高工作效率。工作流中的每个环节（一个 Action）可以通过与 LLM 交互来实现，例如在最近两节课的 24 点游戏智能体应用中我们实现的那些 Action。单纯从工作流实现来说，这种方式其实跟 15 年前的那些 <strong>工作流引擎</strong> 的实现方式差别不大。</p><p>这种手工方式是最理想的工作流实现方式吗？很遗憾，并不是。简单的工作流确实可以这样手工实现，对于复杂的工作流来说，完全依赖手工实现的工作流，很有可能并非是最优的工作流。为了达到相同的业务目标，可能还会有更优的工作流，无论从执行效率还是从成本上（例如与云端商业 LLM 交互所产生的成本）来说都是更好的。</p><p>那么究竟什么工作流才是最优的？开发者非常需要有一套工具和开发框架来开展探索。于是就有了第二种实现工作流的方式，那就是针对要达到的业务目标 <strong>自动生成工作流</strong>，并且对自动生成的多种工作流开展性能评估和优化，选择出其中最优的工作流。</p><p>我们已经进入了 AI 和 LLM 时代，一种很自然的思路是充分挖掘基础 LLM 的能力，利用 LLM 来为我们做分析和计划，自动生成工作流。AFlow 正是一套利用 LLM 来自动生成工作流，并且对工作流做性能评估和优化，得到最优工作流的开发框架。</p><p>在 MetaGPT 项目 <a href="https://github.com/geekan/MetaGPT/tree/main/examples/aflow" target="_blank" rel="noreferrer">AFlow 例子页面</a> 的文档中，对于 AFlow 的定义是这样的：</p><blockquote><p>AFlow 是一套自动生成和优化智能体工作流（Agentic Workflow）的开发框架。它在代码表示的工作流程空间中使用蒙特卡洛树搜索来寻找高效的工作流，用机器的努力取代人工开发。 我们的方法显示了在各种任务中超越手工工作流实现的潜力。</p></blockquote><p>在未来的 MetaGPT 1.0 版本中，AFlow 将会成为系统的一个核心的组件。与目前 0.8.1 版中仅能通过手工方式实现简单的工作流相比，MetaGPT 1.0 将会提供强大得多的对于复杂工作流的支持。</p><p>自动生成智能体的工作流，这个方向看似是天马行空的科幻，在我看来其实有非常重要的意义，并不是象牙塔内的纯学术性研究。所以我建议你持续关注 AFlow 这个研究方向，并且投入足够的精力开展学习，未来一定会有很大收获。</p><h3 id="体验-aflow-的例子" tabindex="-1">体验 AFlow 的例子 <a class="header-anchor" href="#体验-aflow-的例子" aria-label="Permalink to &quot;体验 AFlow 的例子&quot;">​</a></h3><p>接下来我们体验一下 MetaGPT 项目中一些 AFlow 的例子。在 MetaGPT 项目的最新代码里面，新增了一些关于 <a href="https://github.com/geekan/MetaGPT/tree/main/examples/aflow" target="_blank" rel="noreferrer">AFlow 的例子</a>。本着实例驱动的一贯原则，我们还是先把这些例子跑起来看看。</p><p>为了运行 AFlow 的例子，我们需要首先在 MetaGPT 的配置文件中再增加几个 LLM。编辑 MetaGPT 的配置文件 ~/.metagpt/config2.yaml，在后面加入以下内容：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>models:</span></span>
<span class="line"><span> &quot;qwen2.5&quot;:</span></span>
<span class="line"><span>   api_type: &quot;ollama&quot;</span></span>
<span class="line"><span>   base_url: &quot;http://127.0.0.1:11434/api&quot;</span></span>
<span class="line"><span>   temperature: 0.5</span></span>
<span class="line"><span> &quot;qwen2.5:14b&quot;:</span></span>
<span class="line"><span>   api_type: &quot;ollama&quot;</span></span>
<span class="line"><span>   base_url: &quot;http://127.0.0.1:11434/api&quot;</span></span>
<span class="line"><span>   temperature: 0.5</span></span>
<span class="line"><span> &quot;llama3.1&quot;:</span></span>
<span class="line"><span>   api_type: &quot;ollama&quot;</span></span>
<span class="line"><span>   base_url: &quot;http://127.0.0.1:11434/api&quot;</span></span>
<span class="line"><span>   temperature: 0.5</span></span>
<span class="line"><span> &quot;gemma2&quot;:</span></span>
<span class="line"><span>   api_type: &quot;ollama&quot;</span></span>
<span class="line"><span>   base_url: &quot;http://127.0.0.1:11434/api&quot;</span></span>
<span class="line"><span>   temperature: 0.5</span></span>
<span class="line"><span> &quot;gpt-3.5-turbo&quot;:</span></span>
<span class="line"><span>   api_type: &quot;openai&quot;</span></span>
<span class="line"><span>   base_url: &quot;https://api.openai.com/v1&quot;</span></span>
<span class="line"><span>   api_key: &quot;sk-xxxxxxxx&quot;</span></span>
<span class="line"><span>   temperature: 0.5</span></span>
<span class="line"><span> &quot;gpt-4o&quot;:</span></span>
<span class="line"><span>   api_type: &quot;openai&quot;</span></span>
<span class="line"><span>   base_url: &quot;https://api.openai.com/v1&quot;</span></span>
<span class="line"><span>   api_key: &quot;sk-xxxxxxxx&quot;</span></span>
<span class="line"><span>   temperature: 0.5</span></span></code></pre></div><p>新增的这段配置在默认的 LLM 之外，添加了几个通过模型名称来调用的 LLM。包括位于云端的 OpenAI 的 gpt-3.5-turbo 和 gpt-4o，还有通过 ollama 部署在本地 Linux 主机上的开源 LLM qwen2.5、qwen2.5:14b、llama3.1、gemma2。如何通过 ollama 部署开源 LLM，可以参考 <a href="https://time.geekbang.org/column/article/838713" target="_blank" rel="noreferrer">02 课</a> 的介绍，这里我就不赘述了。</p><p>然后我们还需要从这个 <a href="https://drive.google.com/uc?export=download&amp;id=1UBoW4WBWjX2gs4I_jq3ALdXeLdwDJMdP" target="_blank" rel="noreferrer">地址</a> 下载一些初始化数据。将下载的初始化数据保存在 Linux 主机的 ~/Downloads/initial_rounds.tar.gz，然后在终端窗口内执行。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ~/work/MetaGPT/metagpt/ext/aflow/scripts/optimized</span></span>
<span class="line"><span>tar zxvf ~/Downloads/initial_rounds.tar.gz</span></span></code></pre></div><p>接下来我们就可以运行第一个 AFlow 的例子了。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ~/work/learn_metagpt</span></span>
<span class="line"><span>poetry run python -m examples.aflow.optimize --dataset MATH --opt_model_name gpt-4o --exec_model_name gpt-4o</span></span></code></pre></div><p>上面的 bash 脚本中：</p><ul><li><p>–dataset MATH 代表使用 MATH 数据集。</p></li><li><p>–opt_model_name、–exec_model_name 分别是用来做优化的 LLM 和用来做执行的 LLM。通常做优化的 LLM 能力比做执行的 LLM 更强些，两个 LLM 也可以相同。默认的 LLM 为 claude-3-5-sonnet-20240620。</p></li></ul><p>因为 AFlow 是一个前沿研究领域，所以 AFlow 的例子对于基础 LLM 的能力要求是非常高的，可以把 AFlow 的例子作为测试基础 LLM 能力的一种手段。我测试过 OpenAI 的 gpt-3.5-turbo、gpt-4o 在 MATH 数据集上跑 AFlow 工作流优化都没有问题，可以顺利跑完 MATH 数据集上的所有优化。使用 Anthropic 的 LLM 估计也没有问题（在上面例子里执行的 examples.aflow.optimize 中默认使用的 LLM 就是 Anthropic 的 claude-3-5-sonnet-20240620），不过我没亲自有测试。</p><p>开源的 LLM 我测试过通过 ollama 部署的 qwen2.5、qwen2.5:14b、llama3.1、gemma2，qwen2.5 和 gemma2 执行中会出错退出，qwen2.5:14b、llama3.1 执行的时间非常长，看起来难以胜任自动工作流生成这个任务。MetaGPT 团队在 AFlow 这个研发方向上也是以 OpenAI 和 Anthropic 的云端商业 LLM 为主，暂时并没有计划支持开源 LLM。不过未来在 OpenAI 和 Anthropic 的 LLM 产生了最优的工作流之后，是可以在开源 LLM 之上运行的。我们可以持续关注未来将出现的更强大的开源 LLM，估计在未来不长的时间里，也会出现足以支持 AFlow 例子流畅运行的开源 LLM。</p><h2 id="metagpt-1-0-版展望" tabindex="-1">MetaGPT 1.0 版展望 <a class="header-anchor" href="#metagpt-1-0-版展望" aria-label="Permalink to &quot;MetaGPT 1.0 版展望&quot;">​</a></h2><p>根据从 MetaGPT 的 Discord 群内开发团队成员那里了解到的信息，在今年（2025年）2 月即将发布 MetaGPT 1.0 正式版。在 <a href="https://github.com/geekan/MetaGPT/blob/main/docs/ROADMAP.md" target="_blank" rel="noreferrer">MetaGPT 项目的路线图</a> 中列出了很多开发团队计划实现的功能，这些功能目前大多都已经完成了，全部完成后，就可以发布 1.0 版了。</p><p>另外从吴承霖老师那里了解到，在 MetaGPT 1.0 中将会重新设计实现对于工作流的支持，目前这种基于 pub-sub（发布订阅）模式的简单事件机制会被废弃，换成一套强大得多的工作流支持，包括支持通过 AFlow 来做工作流的自动生成和优化。不过关于这个方面目前尚未发布任何相关的文档，所以需要等 1～2 个月后 1.0 版正式发布之后，我们才能一窥庐山之真面目。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>在这节课中，我先讲解了 MetaGPT 中的一个很强大的组件 DataInterpreter，并且基于 DataInterpreter 实现了 24 点游戏智能体应用的第三版。然后我们对于 AFlow 的自动化智能体工作流生成这个 Autonomous Agent 应用开发的前沿研究方向有了一个初步的了解，并且体验了 MetaGPT 项目中的 Aflow 例子。最后对未来即将发布的 MetaGPT 1.0 版做了一些简单的介绍和展望。</p><p>MetaGPT 是一个非常有活力的年轻团队，无论在项目的开发、论文的发布方面都很活跃。吴承霖老师在我看来更多地是一个稳健的工程派（恰好正是我的菜），而不是那种喜欢躲在象牙塔内的学院派。国内的开发团队如果计划开发复杂的 Autonomous Agent 应用，我推荐的首选开发框架就是 MetaGPT。</p><p>我们对于 MetaGPT 的学习暂时告一段落，在下节课中，我们将开始学习一个新的开发框架——AutoGPT，也是世界上第一个 Autonomous Agent 应用开发框架。</p><p>课程代码： <a href="https://gitee.com/mozilla88/autonomous_agent/tree/master/lesson_05" target="_blank" rel="noreferrer">https://gitee.com/mozilla88/autonomous_agent/tree/master/lesson_05</a></p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你阅读 DataInterpreter 的实现代码，熟悉其工作流程。思考一下 DataInterpreter 还有哪些可以改进的方向。欢迎你把自己的思考分享到留言区，我们一起交流讨论，也欢迎你把这节课的内容分享给需要的朋友，我们下节课再见！</p>`,74)])])}const h=n(t,[["render",l]]);export{m as __pageData,h as default};
