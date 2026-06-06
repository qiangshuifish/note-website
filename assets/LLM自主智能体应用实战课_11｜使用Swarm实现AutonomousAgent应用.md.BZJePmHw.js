import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"11｜使用Swarm实现Autonomous Agent应用","description":"","frontmatter":{},"headers":[{"level":2,"title":"角色建模和工作流设计","slug":"角色建模和工作流设计","link":"#角色建模和工作流设计","children":[]},{"level":2,"title":"实现第一版","slug":"实现第一版","link":"#实现第一版","children":[{"level":3,"title":"实现 Agent 的外部函数","slug":"实现-agent-的外部函数","link":"#实现-agent-的外部函数","children":[]},{"level":3,"title":"实现 Agent 的提示词模板","slug":"实现-agent-的提示词模板","link":"#实现-agent-的提示词模板","children":[]},{"level":3,"title":"创建 Agent 对象实例","slug":"创建-agent-对象实例","link":"#创建-agent-对象实例","children":[]},{"level":3,"title":"实现 Agent 的业务函数","slug":"实现-agent-的业务函数","link":"#实现-agent-的业务函数","children":[]},{"level":3,"title":"在 main 函数中实现完整的工作流","slug":"在-main-函数中实现完整的工作流","link":"#在-main-函数中实现完整的工作流","children":[]}]},{"level":2,"title":"第一版我们漏掉了什么？","slug":"第一版我们漏掉了什么","link":"#第一版我们漏掉了什么","children":[]},{"level":2,"title":"实现第二版","slug":"实现第二版","link":"#实现第二版","children":[{"level":3,"title":"修改 Agent 的外部函数实现","slug":"修改-agent-的外部函数实现","link":"#修改-agent-的外部函数实现","children":[]},{"level":3,"title":"为 Swarm 打补丁","slug":"为-swarm-打补丁","link":"#为-swarm-打补丁","children":[]},{"level":3,"title":"修改 Agent 的业务函数","slug":"修改-agent-的业务函数","link":"#修改-agent-的业务函数","children":[]},{"level":3,"title":"修改 main 函数","slug":"修改-main-函数","link":"#修改-main-函数","children":[]}]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"LLM自主智能体应用实战课/11｜使用Swarm实现AutonomousAgent应用.md","filePath":"LLM自主智能体应用实战课/11｜使用Swarm实现AutonomousAgent应用.md","lastUpdated":1779815961000}'),t={name:"LLM自主智能体应用实战课/11｜使用Swarm实现AutonomousAgent应用.md"};function l(o,s,i,r,c,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_11-使用swarm实现autonomous-agent应用" tabindex="-1">11｜使用Swarm实现Autonomous Agent应用 <a class="header-anchor" href="#_11-使用swarm实现autonomous-agent应用" aria-label="Permalink to &quot;11｜使用Swarm实现Autonomous Agent应用&quot;">​</a></h1><p>你好，我是李锟。</p><p>在上节课中，我们安装好了 Swarm，运行了第一个例子，然后一起学习了 Swarm 的官方文档。这节课我们把上节课学到的新知识投入实战，基于 Swarm 开发我们的 24 点游戏智能体应用。</p><p>我们之前已经基于 MetaGPT、AutoGPT 实现过两次这个应用，这节课要做的工作就是将之前的设计移植到 Swarm。</p><h2 id="角色建模和工作流设计" tabindex="-1">角色建模和工作流设计 <a class="header-anchor" href="#角色建模和工作流设计" aria-label="Permalink to &quot;角色建模和工作流设计&quot;">​</a></h2><p>首先我们要做的工作还是针对 Swarm 来做角色建模和工作流设计。</p><p>从概念上讲，Swarm 应用中的概念其实更接近 AutoGPT。Swarm 的两个核心概念是 Agent（智能体）和 Handoff（移交），Agent 与 AutoGPT 的 Agent 对应，Handoff 对应着 AutoGPT Builder 图形界面中两个 Agent 之间的那些连接关系（连接线以及相关的输入、输出数据）。因此 Swarm 版 24 点游戏智能体应用的角色建模和工作流设计与 AutoGPT 版完全相同，同样也划分为 4 个 Agent： <strong>GameDealer</strong>、 <strong>MathProdigy</strong>、 <strong>GameJudger</strong>、 <strong>GamePlayer</strong>。</p><p>我直接把 08 课中的流程图复制过来。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/LLM%E8%87%AA%E4%B8%BB%E6%99%BA%E8%83%BD%E4%BD%93%E5%BA%94%E7%94%A8%E5%AE%9E%E6%88%98%E8%AF%BE/images/842497/bc46948cd46f8529ea921f306374c584.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/LLM%E8%87%AA%E4%B8%BB%E6%99%BA%E8%83%BD%E4%BD%93%E5%BA%94%E7%94%A8%E5%AE%9E%E6%88%98%E8%AF%BE/images/842497/bc46948cd46f8529ea921f306374c584.png" alt="图片"></a></p><p>因为 Swarm 的每一个 Agent 在运行 client.run() 时都需要访问 LLM，而我们之前在实现 MetaGPT、AutoGPT 版的 24 点游戏智能体应用时，MathProdigy 和 GamePlayer 这两个 Agent（或 Role）是没有访问 LLM 的。对于 MathProdigy 和 GamePlayer，貌似最直接的方式是不使用 Swarm 的 Agent，而是用自定义的类来实现。这样做确实也能实现 24 点游戏智能体应用，不过为了展示 Swarm 调用外部函数（外部工具）的能力，也为了代码的一致性，我决定把它们 4 个全部实现为 Swarm 的 Agent。</p><h2 id="实现第一版" tabindex="-1">实现第一版 <a class="header-anchor" href="#实现第一版" aria-label="Permalink to &quot;实现第一版&quot;">​</a></h2><p>总体的设计思路确定了，接下来我们需要先做一些基础性工作。我们按照自底向上的方式来做开发。</p><h3 id="实现-agent-的外部函数" tabindex="-1">实现 Agent 的外部函数 <a class="header-anchor" href="#实现-agent-的外部函数" aria-label="Permalink to &quot;实现 Agent 的外部函数&quot;">​</a></h3><p>我们需要先确定给这 4 个 Agent 提供几个函数。基于前面课程中的实现经验，GameDealer 可以完全基于 qwen2.5 的能力来实现发牌功能，因此不需要提供外部函数。然而 qwen2.5 独立解决 24 点表达式目前来说还非常困难，因此 MathProdigy 需要一个外部函数的支持。</p><p>上节课我已经提到过，我们将会基于 qwen2.5 的 Assistants API 和我们自己实现的验证函数来做计算，判断表达式是否正确，因此 GameJudger 也需要一个外部函数。GamePlayer 需要接受人类用户的输入，无疑也需要一个外部函数。所以，我们一共需要 3 个外部函数，分别命名为 get_24_points_expression_func、check_24_points_expression_func、get_human_reply_func，这 3 个函数的实现如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def get_24_points_expression_func(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Resolve the expression of 24 points game, return an arithmetic expression.</span></span>
<span class="line"><span>    Keyword arguments:</span></span>
<span class="line"><span>      last_cards_posted: an array of 4 integers between 1 to 13.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    point_list = json.loads(last_cards_posted)</span></span>
<span class="line"><span>    if len(point_list) == 0:</span></span>
<span class="line"><span>        return &quot;expression not found&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    expressions = get_cached_expressions(point_list)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    result = &quot;expression not found&quot;</span></span>
<span class="line"><span>    if len(expressions) &amp;gt; 0:</span></span>
<span class="line"><span>        random_idx = random.randint(0, len(expressions)-1)</span></span>
<span class="line"><span>        expression = f&quot;&#39;{expressions[random_idx]}&#39;&quot;.replace(&quot;&#39;&quot;, &quot;&quot;)</span></span>
<span class="line"><span>        print(f&quot;The resolved 24 points expression is &#39;{expression}&#39;&quot;)</span></span>
<span class="line"><span>        return expression</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &quot;expression not found&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def check_24_points_expression_func(expression: str, last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Check if the result of an arithmetic expression is equal 24, return &#39;Correct&#39; or &#39;Wrong&#39;.</span></span>
<span class="line"><span>    Keyword arguments:</span></span>
<span class="line"><span>      expression: an arithmetic expression</span></span>
<span class="line"><span>      last_cards_posted: an array of 4 integers between 1 to 13.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    result = eval(expression.replace(&quot;&#39;&quot;, &quot;&quot;))</span></span>
<span class="line"><span>    if abs(result - 24) &amp;lt; 0.001:</span></span>
<span class="line"><span>        return &quot;Correct&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &quot;Wrong&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_human_reply_func(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Get a human reply for an an array formated as string. The replay should be &#39;deal&#39;, &#39;help&#39;, &#39;exit&#39; or an an arithmetic expression.</span></span>
<span class="line"><span>    Keyword arguments:</span></span>
<span class="line"><span>      last_cards_posted: an array of 4 integers between 1 to 13.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    PROMPT_TEMPLATE: str = &quot;&quot;&quot;</span></span>
<span class="line"><span>    Cards the dealer just posted: {content}</span></span>
<span class="line"><span>    Please give an expression for the four operations that results in 24.</span></span>
<span class="line"><span>    Type &#39;help&#39; if you feel it&#39;s difficult.</span></span>
<span class="line"><span>    Type &#39;deal&#39; if you want the dealer to deal cards again.</span></span>
<span class="line"><span>    Type &#39;exit&#39; if you want to exit this game, type &#39;exit&#39;.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    point_list = json.loads(last_cards_posted)</span></span>
<span class="line"><span>    card_list = get_random_card_list(point_list)</span></span>
<span class="line"><span>    cards_content = f&quot;{​{&#39;card_list&#39;: {card_list}, &#39;point_list&#39;: {point_list}​}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    prompt = PROMPT_TEMPLATE.format(content=cards_content)</span></span>
<span class="line"><span>    human_reply = input(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {&quot;human_reply&quot;: f&quot;{human_reply}&quot;}</span></span></code></pre></div><p>在这 3 个函数实现中调用的一些 helper 函数，在文件 game_helper.py 中。与 MetaGPT、AutoGPT 版本中的 helper 函数基本上是一样的。</p><h3 id="实现-agent-的提示词模板" tabindex="-1">实现 Agent 的提示词模板 <a class="header-anchor" href="#实现-agent-的提示词模板" aria-label="Permalink to &quot;实现 Agent 的提示词模板&quot;">​</a></h3><p>从上节课的学习中，我们可以理解，Swarm 的每个 Agent 访问 LLM 时提供的提示词主要划分为 <strong>系统提示词</strong> 和 <strong>用户提示词</strong> 两大类。系统提示词可以由创建 Agent 对象时 <strong>instructions</strong> 参数对应的函数提供，我写了一个 get_instruction() 函数来提供 4 个 Agent 的系统提示词。与此对应，我还写了一个对应的 get_user_prompt() 函数来提供 4 个 Agent 的用户提示词。提示词模板和这两个函数的实现如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>instruction_template_dict = {</span></span>
<span class="line"><span>    &quot;GameDealer&quot;: &quot;&quot;&quot;</span></span>
<span class="line"><span>        Generate 4 random natural numbers between 1 and 13, include 1 and 13. Just return 4 numbers in an array, don&#39;t include other content. The returned array should not be repeated with the following arrays:</span></span>
<span class="line"><span>        {old_arrays}</span></span>
<span class="line"><span>        &quot;&quot;&quot;,</span></span>
<span class="line"><span>    &quot;MathProdigy&quot;: &quot;&quot;&quot;You are a helpful agent. &quot;&quot;&quot;,</span></span>
<span class="line"><span>    &quot;GameJudger&quot;: &quot;&quot;&quot;You are a helpful agent. &quot;&quot;&quot;,</span></span>
<span class="line"><span>    &quot;GamePlayer&quot;: &quot;&quot;&quot;You are a helpful agent. &quot;&quot;&quot;,</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>user_prompt_template_dict = {</span></span>
<span class="line"><span>    &quot;GameDealer&quot;: &quot;&quot;&quot;generate an array&quot;&quot;&quot;,</span></span>
<span class="line"><span>    &quot;MathProdigy&quot;: &quot;&quot;&quot;</span></span>
<span class="line"><span>        What&#39;s the 24 points expression of {last_cards_posted} ?</span></span>
<span class="line"><span>        If the result is &#39;expression not found&#39;, just return &#39;expression not found&#39;.</span></span>
<span class="line"><span>        If the result is an arithmetic expression, just return the expression itself and do not add anything else.</span></span>
<span class="line"><span>        &quot;&quot;&quot;,</span></span>
<span class="line"><span>    &quot;GameJudger&quot;: &quot;&quot;&quot;</span></span>
<span class="line"><span>        Cards posted is &#39;{last_cards_posted}&#39;, what&#39;s the check result of {expression} ? Just return the check result itself such as &#39;Correct&#39; or &#39;Wrong&#39;, and do not add anything else such as &#39;The check result is ...&#39;.</span></span>
<span class="line"><span>    &quot;&quot;&quot;,</span></span>
<span class="line"><span>    &quot;GamePlayer&quot;: &quot;&quot;&quot;</span></span>
<span class="line"><span>        What&#39;s the human reply of {last_cards_posted} ? Just return the human reply itself and do not add anything else, such as &#39;The human reply ...&#39;.</span></span>
<span class="line"><span>    &quot;&quot;&quot;,</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_instruction(context_variables):</span></span>
<span class="line"><span>    global instruction_template_dict</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    agent_name = context_variables[&quot;agent_name&quot;]</span></span>
<span class="line"><span>    instruction_template = instruction_template_dict[agent_name]</span></span>
<span class="line"><span>    instruction = instruction_template</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if agent_name == &quot;GameDealer&quot;:</span></span>
<span class="line"><span>        last_cards_posted = context_variables[&quot;old_arrays&quot;]</span></span>
<span class="line"><span>        instruction = instruction_template.format(old_arrays=last_cards_posted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return instruction</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_user_prompt(context_variables):</span></span>
<span class="line"><span>    global user_prompt_template_dict</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    agent_name = context_variables[&quot;agent_name&quot;]</span></span>
<span class="line"><span>    user_prompt_template = user_prompt_template_dict[agent_name]</span></span>
<span class="line"><span>    user_prompt = user_prompt_template</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if agent_name == &quot;MathProdigy&quot;:</span></span>
<span class="line"><span>        last_cards_posted = context_variables[&quot;last_cards_posted&quot;]</span></span>
<span class="line"><span>        user_prompt = user_prompt_template.format(last_cards_posted=last_cards_posted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    elif agent_name == &quot;GameJudger&quot;:</span></span>
<span class="line"><span>        expression = context_variables[&quot;expression&quot;]</span></span>
<span class="line"><span>        last_cards_posted = context_variables[&quot;last_cards_posted&quot;]</span></span>
<span class="line"><span>        user_prompt = user_prompt_template.format(expression=expression,last_cards_posted=last_cards_posted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    elif agent_name == &quot;GamePlayer&quot;:</span></span>
<span class="line"><span>        last_cards_posted = context_variables[&quot;last_cards_posted&quot;]</span></span>
<span class="line"><span>        user_prompt = user_prompt_template.format(last_cards_posted=last_cards_posted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return user_prompt</span></span></code></pre></div><p>需要特别注意的是每个 Agent 的提示词模板的设计，目标是为了让与之交互的 LLM 准确实现我们期望的行为，即确保 LLM 准确调用给每个 Agent 配置的函数，而且确保 LLM 返回结果的格式是我们期望的格式。其中的 context_variables 是上节课介绍过的上下文变量，在每一次运行 client.run() 时传入。</p><p>你可能注意到了，只有 GameDealer 具体要做的事情是实现为系统提示词，其他 3 个 Agent 具体要做的事情都实现为用户提示词。这样做是有原因的，而且针对不同的 LLM 类型，实现方式未必是相同的。对于我们使用的 qwen2.5 来说，精确描述的用户提示词的效果是最好的，特别是在配置有外部函数的情况下。如果使用系统提示词，未必每次都能执行期望的函数调用。GameDealer 并未配置外部函数，所以具体要做的事情实现为系统提示词即可。</p><h3 id="创建-agent-对象实例" tabindex="-1">创建 Agent 对象实例 <a class="header-anchor" href="#创建-agent-对象实例" aria-label="Permalink to &quot;创建 Agent 对象实例&quot;">​</a></h3><p>接下来我们创建 4 个 Agent 对象实例。我们分别给这 4 个 Agent 对象实例取名为 Bill、Gauss、Peter、David 以示区别。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>agent_bill = Agent(</span></span>
<span class="line"><span>    name=&quot;GameDealer&quot;,</span></span>
<span class="line"><span>    instructions=get_instruction,</span></span>
<span class="line"><span>    model=&quot;qwen2.5&quot;,</span></span>
<span class="line"><span>    functions=[],</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>agent_gauss = Agent(</span></span>
<span class="line"><span>    name=&quot;MathProdigy&quot;,</span></span>
<span class="line"><span>    instructions=get_instruction,</span></span>
<span class="line"><span>    model=&quot;qwen2.5&quot;,</span></span>
<span class="line"><span>    functions=[get_24_points_expression_func],</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>agent_peter = Agent(</span></span>
<span class="line"><span>    name=&quot;GameJudger&quot;,</span></span>
<span class="line"><span>    instructions=get_instruction,</span></span>
<span class="line"><span>    model=&quot;qwen2.5&quot;,</span></span>
<span class="line"><span>    functions=[check_24_points_expression_func],</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>agent_david = Agent(</span></span>
<span class="line"><span>    name=&quot;GamePlayer&quot;,</span></span>
<span class="line"><span>    instructions=get_instruction,</span></span>
<span class="line"><span>    model=&quot;qwen2.5&quot;,</span></span>
<span class="line"><span>    functions=[get_human_reply_func],</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>注意：每个 Agent 对象实例在创建时都需要设置 model=“qwen2.5”，因为默认的 model 是 OpenAI 自家的 GPT-4o。</p><h3 id="实现-agent-的业务函数" tabindex="-1">实现 Agent 的业务函数 <a class="header-anchor" href="#实现-agent-的业务函数" aria-label="Permalink to &quot;实现 Agent 的业务函数&quot;">​</a></h3><p>完成了以上基础工作，我们再给每个 Agent 实现一个业务函数。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def deal_cards(old_arrays: List[int]) -&amp;gt; str:</span></span>
<span class="line"><span>    global client, agent_bill</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print(f&quot;used old_arrays is :{old_arrays}&quot;)</span></span>
<span class="line"><span>    context_var_dict = {</span></span>
<span class="line"><span>        &quot;agent_name&quot;:&quot;GameDealer&quot;,</span></span>
<span class="line"><span>        &quot;old_arrays&quot;: f&quot;{old_arrays}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    response = client.run(</span></span>
<span class="line"><span>        agent=agent_bill,</span></span>
<span class="line"><span>        messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: get_user_prompt(context_var_dict)}],</span></span>
<span class="line"><span>        context_variables=context_var_dict</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cards_posted = response.messages[-1][&quot;content&quot;]</span></span>
<span class="line"><span>    print(cards_posted)</span></span>
<span class="line"><span>    return cards_posted</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def machine_give_expression(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    global client, agent_gauss</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    context_var_dict = {</span></span>
<span class="line"><span>        &quot;agent_name&quot;:&quot;MathProdigy&quot;,</span></span>
<span class="line"><span>        &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    response = client.run(</span></span>
<span class="line"><span>        agent=agent_gauss,</span></span>
<span class="line"><span>        messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: get_user_prompt(context_var_dict)}],</span></span>
<span class="line"><span>        context_variables=context_var_dict</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    expression = response.messages[-1][&quot;content&quot;]</span></span>
<span class="line"><span>    print(expression)</span></span>
<span class="line"><span>    return expression</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def check_expression(expression: str, last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    global client, agent_peter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    context_var_dict = {</span></span>
<span class="line"><span>        &quot;agent_name&quot;:&quot;GameJudger&quot;,</span></span>
<span class="line"><span>        &quot;expression&quot;: f&quot;{expression}&quot;,</span></span>
<span class="line"><span>        &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    response = client.run(</span></span>
<span class="line"><span>        agent=agent_peter,</span></span>
<span class="line"><span>        messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: get_user_prompt(context_var_dict)}],</span></span>
<span class="line"><span>        context_variables=context_var_dict</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    check_result = response.messages[-1][&quot;content&quot;]</span></span>
<span class="line"><span>    print(check_result)</span></span>
<span class="line"><span>    return check_result</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_human_reply(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    global client, agent_david</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    context_var_dict = {</span></span>
<span class="line"><span>        &quot;agent_name&quot;:&quot;GamePlayer&quot;,</span></span>
<span class="line"><span>        &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    response = client.run(</span></span>
<span class="line"><span>        agent=agent_david,</span></span>
<span class="line"><span>        messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: get_user_prompt(context_var_dict)}],</span></span>
<span class="line"><span>        context_variables=context_var_dict</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    human_reply = response.messages[-1][&quot;content&quot;]</span></span>
<span class="line"><span>    print(human_reply)</span></span>
<span class="line"><span>    return human_reply</span></span></code></pre></div><p>这 4 个函数的功能，和 08 课 AutoGPT 版本中对应的同名 Block 的功能是一致的，这里就不赘述了。</p><h3 id="在-main-函数中实现完整的工作流" tabindex="-1">在 main 函数中实现完整的工作流 <a class="header-anchor" href="#在-main-函数中实现完整的工作流" aria-label="Permalink to &quot;在 main 函数中实现完整的工作流&quot;">​</a></h3><p>最后，我们在一个 main 函数内实现完整的工作流。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def main_func():</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    old_arrays = []</span></span>
<span class="line"><span>    last_cards_posted = deal_cards(old_arrays)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while True:</span></span>
<span class="line"><span>        human_reply = get_human_reply(last_cards_posted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if human_reply == &quot;deal&quot;:</span></span>
<span class="line"><span>            old_arrays.append(json.loads(last_cards_posted))</span></span>
<span class="line"><span>            last_cards_posted = deal_cards(old_arrays)</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        elif human_reply == &quot;help&quot;:</span></span>
<span class="line"><span>            expression = machine_give_expression(last_cards_posted)</span></span>
<span class="line"><span>        elif human_reply == &quot;exit&quot;:</span></span>
<span class="line"><span>            print(&quot;Bye bye, have a good day!&quot;)</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            expression = human_reply</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if expression != &quot;expression not found&quot;:</span></span>
<span class="line"><span>            check_result = check_expression(expression, last_cards_posted)</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            check_result = &quot;Correct&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if check_result == &quot;Correct&quot;:</span></span>
<span class="line"><span>            old_arrays.append(json.loads(last_cards_posted))</span></span>
<span class="line"><span>            last_cards_posted = deal_cards(old_arrays)</span></span></code></pre></div><p>完整的代码实现，在课程代码 play_24_points_game_v1.py 中。运行起来体验一下吧。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ~/work/learn_swarm</span></span>
<span class="line"><span>run_swarm_app play_24_points_game_v1.py</span></span></code></pre></div><h2 id="第一版我们漏掉了什么" tabindex="-1">第一版我们漏掉了什么？ <a class="header-anchor" href="#第一版我们漏掉了什么" aria-label="Permalink to &quot;第一版我们漏掉了什么？&quot;">​</a></h2><p>从 Swarm 版 24 点游戏智能体应用第一版的实现来看，实现一个 Swarm 应用是非常简单直接的，比实现 MetaGPT、AutoGPT 应用都要简单。这个工作是如此轻松惬意，真是太棒了！</p><p>不过，事后隐隐会感觉到在第一版实现中似乎缺了点重要的东西，那么究竟是什么东西呢？</p><p>前面我讲过 Swarm 有两个核心概念 Agent 和 Handoff。第一版实现中确实使用了 Agent，也实现了函数调用，但是完全没有用到 Handoff，所有的工作流都是用手写代码实现的。这样做当然是不完善的，然而第一版的实现仍然是很有价值的，也完全符合我经常提到的 KISS 原则。我们来继续做一些改进，开发使用了 Handoff 的第二版实现。</p><p>根据上节课我们学习过的 <a href="https://github.com/openai/swarm" target="_blank" rel="noreferrer">Swarm 的官方文档</a>，外部函数既可以返回一个字符串，也可以返回一个 Result 对象，例如：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def talk_to_sales():</span></span>
<span class="line"><span>   print(&quot;Hello, World!&quot;)</span></span>
<span class="line"><span>   return Result(</span></span>
<span class="line"><span>       value=&quot;Done&quot;,</span></span>
<span class="line"><span>       agent=sales_agent,</span></span>
<span class="line"><span>       context_variables={&quot;department&quot;: &quot;sales&quot;}</span></span>
<span class="line"><span>   )</span></span></code></pre></div><p>Result 对象有 3 个参数：</p><ul><li><p>agent 是 client.run() 中下一个要调用的 Agent。</p></li><li><p>value 是传给下一个 Agent 的内容。</p></li><li><p>context_variables 是 client.run() 中调用下一个 Agent 时传入的上下文变量。</p></li></ul><p>既然如此，我们要做的就是把第一版中的外部函数做些修改，在必要的情况下返回一个 Result 对象，而不是返回一个字符串。</p><h2 id="实现第二版" tabindex="-1">实现第二版 <a class="header-anchor" href="#实现第二版" aria-label="Permalink to &quot;实现第二版&quot;">​</a></h2><p>第二版实现是建立在第一版实现的基础之上的，接下来我介绍一些需要做哪些改动。</p><h3 id="修改-agent-的外部函数实现" tabindex="-1">修改 Agent 的外部函数实现 <a class="header-anchor" href="#修改-agent-的外部函数实现" aria-label="Permalink to &quot;修改 Agent 的外部函数实现&quot;">​</a></h3><p>3 个外部函数中 check_24_points_expression_func() 函数无需修改，其他两个函数需要修改，以下是修改之后的版本：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def get_24_points_expression_func(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Resolve the expression of 24 points game, return an arithmetic expression.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Keyword arguments:</span></span>
<span class="line"><span>      last_cards_posted: an array of 4 integers between 1 to 13.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    point_list = json.loads(last_cards_posted)</span></span>
<span class="line"><span>    if len(point_list) == 0:</span></span>
<span class="line"><span>        return &quot;expression not found&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    expressions = get_cached_expressions(point_list)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if len(expressions) &amp;gt; 0:</span></span>
<span class="line"><span>        random_idx = random.randint(0, len(expressions)-1)</span></span>
<span class="line"><span>        expression = f&quot;&#39;{expressions[random_idx]}&#39;&quot;.replace(&quot;&#39;&quot;, &quot;&quot;)</span></span>
<span class="line"><span>        print(f&quot;The resolved 24 points expression is &#39;{expression}&#39;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        context_var_dict = {</span></span>
<span class="line"><span>            &quot;agent_name&quot;:&quot;GameJudger&quot;,</span></span>
<span class="line"><span>            &quot;expression&quot;: f&quot;{expression}&quot;,</span></span>
<span class="line"><span>            &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        user_prompt = get_user_prompt(context_var_dict)</span></span>
<span class="line"><span>        return Result(</span></span>
<span class="line"><span>            value=user_prompt,</span></span>
<span class="line"><span>            agent=agent_peter,</span></span>
<span class="line"><span>            context_variables=context_var_dict</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &quot;expression not found&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_human_reply_func(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Get a human reply for an an array formated as string. The replay should be &#39;deal&#39;, &#39;help&#39;, &#39;exit&#39; or an an arithmetic expression.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Keyword arguments:</span></span>
<span class="line"><span>      last_cards_posted: an array of 4 integers between 1 to 13.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    PROMPT_TEMPLATE: str = &quot;&quot;&quot;</span></span>
<span class="line"><span>    Cards the dealer just posted: {content}</span></span>
<span class="line"><span>    Please give an expression for the four operations that results in 24.</span></span>
<span class="line"><span>    Type &#39;help&#39; if you feel it&#39;s difficult.</span></span>
<span class="line"><span>    Type &#39;deal&#39; if you want the dealer to deal cards again.</span></span>
<span class="line"><span>    Type &#39;exit&#39; if you want to exit this game, type &#39;exit&#39;.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    point_list = json.loads(last_cards_posted)</span></span>
<span class="line"><span>    card_list = get_random_card_list(point_list)</span></span>
<span class="line"><span>    cards_content = f&quot;{​{&#39;card_list&#39;: {card_list}, &#39;point_list&#39;: {point_list}​}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    prompt = PROMPT_TEMPLATE.format(content=cards_content)</span></span>
<span class="line"><span>    human_reply = input(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if human_reply == &quot;help&quot;:</span></span>
<span class="line"><span>        context_var_dict = {</span></span>
<span class="line"><span>            &quot;agent_name&quot;:&quot;MathProdigy&quot;,</span></span>
<span class="line"><span>            &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        user_prompt = get_user_prompt(context_var_dict)</span></span>
<span class="line"><span>        return Result(</span></span>
<span class="line"><span>            value=user_prompt,</span></span>
<span class="line"><span>            agent=agent_gauss,</span></span>
<span class="line"><span>            context_variables=context_var_dict</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    elif human_reply != &quot;deal&quot; and human_reply != &quot;exit&quot;:</span></span>
<span class="line"><span>        context_var_dict = {</span></span>
<span class="line"><span>            &quot;agent_name&quot;:&quot;GameJudger&quot;,</span></span>
<span class="line"><span>            &quot;expression&quot;: f&quot;{human_reply}&quot;,</span></span>
<span class="line"><span>            &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        user_prompt = get_user_prompt(context_var_dict)</span></span>
<span class="line"><span>        return Result(</span></span>
<span class="line"><span>            value=user_prompt,</span></span>
<span class="line"><span>            agent=agent_peter,</span></span>
<span class="line"><span>            context_variables=context_var_dict</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return human_reply</span></span></code></pre></div><h3 id="为-swarm-打补丁" tabindex="-1">为 Swarm 打补丁 <a class="header-anchor" href="#为-swarm-打补丁" aria-label="Permalink to &quot;为 Swarm 打补丁&quot;">​</a></h3><p>接下来我们可以写一些简单的代码来测试修改后的外部函数。例如通过 client.run() 调用 agent_david，我期望的行为是：</p><ul><li><p>若用户输入 “help”，client.run() 自动调用 agent_gauss 给出 24 点表达式，然后自动调用 agent_peter 来做表达式的验证。</p></li><li><p>若用户自己给出了 24 点表达式，client.run() 自动调用 agent_peter 来做表达式的验证。</p></li></ul><p>然而在测试修改后的外部函数时，我发现应用运行时的行为并不能达到我的预期。开发过程又被卡住了！不过没什么大不了，关关难过关关过咯。😃</p><p>Swarm 的官方文档写的很简略，似乎在应用层面我没有什么可以继续做的事情了。那么我需要搞清楚在 Swarm 的 client.run() 中究竟做了些什么事情。好在 Swarm 是开源的，代码量很少，遇到问题完全可以 DIY（这就是我很多次强调选择“轻量级开发框架”的优点）。</p><p>通过跟踪 client.run() 内部的实现，我发现无法顺利调用下一个 Agent 及其对应外函数的原因，是 client.run() 中第二轮与 LLM 交互时，最后一条消息的 “role” 属性为 “tool”，而 qwen2.5 对由 tool 发来的消息比较冷淡，除非最后一条消息的 “role” 属性为 “user”，才会积极回应，返回我期望的回复（包括了调用外部函数的指示）。</p><p>client.run() 的实现位于 Swarm 的 “/swarm/core.py” 文件 (~/work/swarm/swarm/core.py) 内。我对 client.run() 的实现做了一点修改，在 while 循环最后面 “if partial_response.agent:” 判断语句下添加了以下代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>            history.extend(partial_response.messages)</span></span>
<span class="line"><span>            context_variables.update(partial_response.context_variables)</span></span>
<span class="line"><span>            if partial_response.agent:</span></span>
<span class="line"><span>                active_agent = partial_response.agent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                # 以下为新增代码</span></span>
<span class="line"><span>                new_user_msg = copy.copy(partial_response.messages[-1])</span></span>
<span class="line"><span>                if new_user_msg[&#39;role&#39;] == &#39;tool&#39;:</span></span>
<span class="line"><span>                    new_user_msg[&#39;role&#39;] = &#39;user&#39;</span></span>
<span class="line"><span>                    del new_user_msg[&#39;tool_call_id&#39;]</span></span>
<span class="line"><span>                    del new_user_msg[&#39;tool_name&#39;]</span></span>
<span class="line"><span>                    history.append(new_user_msg)</span></span></code></pre></div><p>注意：在修改 Swarm 的 core.py 前，需要先对 core.py 的原文件做一下备份。</p><p>新增代码做的事情比较简单，若在对话过程中发生了 Agent 切换，且发现对话历史 (chat history) 中最后一条消息的 role 为 “tool”，则在对话历史中添加一条新的 user 消息，消息内容与上一条 tool 消息相同。这样就可以触发 qwen2.5 返回期望的响应。</p><h3 id="修改-agent-的业务函数" tabindex="-1">修改 Agent 的业务函数 <a class="header-anchor" href="#修改-agent-的业务函数" aria-label="Permalink to &quot;修改 Agent 的业务函数&quot;">​</a></h3><p>使用修改后的外部函数之后，只需要通过 client.run() 分别调用 agent_bill 和 agent_david 两个 Agent，而不再需要调用 agent_gauss、agent_peter。因此第一版实现中的 4 个业务函数，现在只需要 2 个即可。agent_bill 对应的业务函数 deal_cards() 保持不变，其他 3 个业务函数现在合并为一个新的业务函数 run_game_one_turn()，其实现如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def run_game_one_turn(last_cards_posted: str) -&amp;gt; str:</span></span>
<span class="line"><span>    global client, agent_david</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    context_var_dict = {</span></span>
<span class="line"><span>        &quot;agent_name&quot;:&quot;GamePlayer&quot;,</span></span>
<span class="line"><span>        &quot;last_cards_posted&quot;: f&quot;{last_cards_posted}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    response = client.run(</span></span>
<span class="line"><span>        agent=agent_david,</span></span>
<span class="line"><span>        messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: get_user_prompt(context_var_dict)}],</span></span>
<span class="line"><span>        context_variables=context_var_dict</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    result = response.messages[-1][&quot;content&quot;]</span></span>
<span class="line"><span>    return result</span></span></code></pre></div><h3 id="修改-main-函数" tabindex="-1">修改 main 函数 <a class="header-anchor" href="#修改-main-函数" aria-label="Permalink to &quot;修改 main 函数&quot;">​</a></h3><p>新的 main 函数实现如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def main_func():</span></span>
<span class="line"><span>    old_arrays = []</span></span>
<span class="line"><span>    last_cards_posted = deal_cards(old_arrays)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while True:</span></span>
<span class="line"><span>        result = run_game_one_turn(last_cards_posted)</span></span>
<span class="line"><span>        print(f&quot;In this turn, cards posted is &#39;{last_cards_posted}&#39;, result is &#39;{result}&#39;.&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if result == &quot;expression not found&quot; or result == &quot;Correct&quot; or result == &quot;deal&quot;:</span></span>
<span class="line"><span>            old_arrays.append(json.loads(last_cards_posted))</span></span>
<span class="line"><span>            last_cards_posted = deal_cards(old_arrays)</span></span>
<span class="line"><span>        elif result == &quot;exit&quot;:</span></span>
<span class="line"><span>            print(&quot;Bye bye, have a good day!&quot;)</span></span>
<span class="line"><span>            break</span></span></code></pre></div><p>完整的代码实现，在课程代码 play_24_points_game_v2.py 中。运行方式如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ~/work/learn_swarm</span></span>
<span class="line"><span>run_swarm_app play_24_points_game_v2.py</span></span></code></pre></div><p>从上述代码中可以看出，第二版实现中的业务函数和 main 函数更加简练易懂。通过 Handoff 来实现工作流，比不用 Handoff 而是完全手写的方式要更加灵活，代码更加简练、更容易维护。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>在这节课中，我们使用本课程中学习到的第三个多 Agent 应用开发框架 Swarm 实现了 24 点游戏智能体应用。不仅巩固了上节课的学习成果，还让我们很好地掌握了 Assistants API 的使用方法。善用 Assistants API，会使我们的 LLM 应用更加灵巧。我们使用的 qwen2.5 是最优秀的国产开源 LLM，对 Assistants API 也有很好的支持，如果你对具体细节感兴趣的话可以阅读一下 qwen2.5 的官方文档： <a href="https://qwen.readthedocs.io/en/latest/framework/function_call.html" target="_blank" rel="noreferrer">Function Calling</a>。</p><p>从最近这两节课的学习中，想必你已经体验到 Swarm 这个超轻量级开发框架的魅力。轻量级并不代表简陋，虽然 Swarm 开发团队在官方文档中说 Swarm 目前只能用于教学场景，然而 Swarm 非常灵活，也非常实用，其实加以扩充之后也可以用于生产环境。始终坚持用更简单、更有效率的方式来实现真实的业务需求，才能确保我们在激烈竞争的环境中立于不败之地。</p><p>这一课学习完成之后，我们已经掌握了三个很棒的多 Agent 开发框架的使用方法，也在开发 24 点游戏智能体应用的过程中积累了不少实战经验。这些经验为我们继续深入探索开发多 Agent 协作的 Autonomous Agent 应用奠定了坚实的基础。开发 Autonomous AI 应用，其实就是 AI 领域几十年以来的一个重要目标，未来会有非常广阔的应用场景。</p><p>在下一课中我将开启一个全新的领域，带你学习一个 <strong>自动提示词工程</strong> 开发框架 DSPy 。这也是 LLM 应用开发方面一个方兴未艾的领域。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>第二版的实现还有什么不足之处，还可以继续改进吗？假如为 GameDealer 也设置一个外部函数，将其与 GamePlayer 连接起来，main 函数是不是会更加简练？</p><p>期待你的分享。如果今天的内容对你有所帮助，也期待你转发给你的同事或者朋友，大家一起学习，共同进步。我们下节课再见！</p>`,76)])])}const g=n(t,[["render",l]]);export{_ as __pageData,g as default};
