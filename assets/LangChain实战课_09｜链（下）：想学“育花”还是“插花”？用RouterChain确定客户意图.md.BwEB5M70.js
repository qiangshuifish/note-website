import{_ as n,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"09 | 链（下）：想学“育花”还是“插花”？用RouterChain确定客户意图","description":"","frontmatter":{},"headers":[{"level":2,"title":"任务设定","slug":"任务设定","link":"#任务设定","children":[]},{"level":2,"title":"整体框架","slug":"整体框架","link":"#整体框架","children":[]},{"level":2,"title":"具体实现","slug":"具体实现","link":"#具体实现","children":[{"level":3,"title":"构建提示信息的模板","slug":"构建提示信息的模板","link":"#构建提示信息的模板","children":[]},{"level":3,"title":"初始化语言模型","slug":"初始化语言模型","link":"#初始化语言模型","children":[]},{"level":3,"title":"构建目标链","slug":"构建目标链","link":"#构建目标链","children":[]},{"level":3,"title":"构建路由链","slug":"构建路由链","link":"#构建路由链","children":[]}]}],"relativePath":"LangChain实战课/09｜链（下）：想学“育花”还是“插花”？用RouterChain确定客户意图.md","filePath":"LangChain实战课/09｜链（下）：想学“育花”还是“插花”？用RouterChain确定客户意图.md","lastUpdated":1795530794000}'),e={name:"LangChain实战课/09｜链（下）：想学“育花”还是“插花”？用RouterChain确定客户意图.md"};function l(t,s,o,c,h,r){return a(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_09-链-下-想学-育花-还是-插花-用routerchain确定客户意图" tabindex="-1">09 | 链（下）：想学“育花”还是“插花”？用RouterChain确定客户意图 <a class="header-anchor" href="#_09-链-下-想学-育花-还是-插花-用routerchain确定客户意图" aria-label="Permalink to &quot;09 | 链（下）：想学“育花”还是“插花”？用RouterChain确定客户意图&quot;">​</a></h1><p>你好，我是黄佳。欢迎来到 LangChain 实战课！</p><p>上一节课中，我带着你学习了 Chain 的基本概念，还使用了 LLMChain 和 SequencialChain，这一节课，我们再来看看其他类型的一些 Chain 的用法。</p><h2 id="任务设定" tabindex="-1">任务设定 <a class="header-anchor" href="#任务设定" aria-label="Permalink to &quot;任务设定&quot;">​</a></h2><p>首先，还是先看一下今天要完成一个什么样的任务。</p><p>这里假设咱们的鲜花运营智能客服 ChatBot 通常会接到两大类问题。</p><ol><li><p>鲜花养护（保持花的健康、如何浇水、施肥等）</p></li><li><p>鲜花装饰（如何搭配花、如何装饰场地等）</p></li></ol><p>你的需求是，如果接到的是第一类问题，你要给 ChatBot A 指示；如果接到第二类的问题，你要给 ChatBot B 指示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/LangChain%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/LangChain%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/1.png" alt=""></a></p><p>我们可以根据这两个场景来构建两个不同的目标链。遇到不同类型的问题，LangChain 会通过RouterChain 来自动引导大语言模型选择不同的模板。</p><p>当然我们的运营过程会遇到更多种类的问题，你只需要通过同样的方法扩充逻辑即可。</p><h2 id="整体框架" tabindex="-1">整体框架 <a class="header-anchor" href="#整体框架" aria-label="Permalink to &quot;整体框架&quot;">​</a></h2><p>RouterChain，也叫路由链，能动态选择用于给定输入的下一个链。我们会根据用户的问题内容，首先使用路由器链确定问题更适合哪个处理模板，然后将问题发送到该处理模板进行回答。如果问题不适合任何已定义的处理模板，它会被发送到默认链。</p><p>在这里，我们会用 LLMRouterChain 和 MultiPromptChain（也是一种路由链）组合实现路由功能，该 MultiPromptChain 会调用 LLMRouterChain 选择与给定问题最相关的提示，然后使用该提示回答问题。</p><p>具体步骤如下：</p><ol><li><p>构建处理模板：为鲜花护理和鲜花装饰分别定义两个字符串模板。</p></li><li><p>提示信息：使用一个列表来组织和存储这两个处理模板的关键信息，如模板的键、描述和实际内容。</p></li><li><p>初始化语言模型：导入并实例化语言模型。</p></li><li><p>构建目标链：根据提示信息中的每个模板构建了对应的 LLMChain，并存储在一个字典中。</p></li><li><p>构建 LLM 路由链：这是决策的核心部分。首先，它根据提示信息构建了一个路由模板，然后使用这个模板创建了一个 LLMRouterChain。</p></li><li><p>构建默认链：如果输入不适合任何已定义的处理模板，这个默认链会被触发。</p></li><li><p>构建多提示链：使用 MultiPromptChain 将 LLM 路由链、目标链和默认链组合在一起，形成一个完整的决策系统。</p></li></ol><h2 id="具体实现" tabindex="-1">具体实现 <a class="header-anchor" href="#具体实现" aria-label="Permalink to &quot;具体实现&quot;">​</a></h2><p>下面，就是用路由链自动选择处理模板的具体代码实现。</p><h3 id="构建提示信息的模板" tabindex="-1">构建提示信息的模板 <a class="header-anchor" href="#构建提示信息的模板" aria-label="Permalink to &quot;构建提示信息的模板&quot;">​</a></h3><p>首先，我们针对两种场景，构建两个提示信息的模板。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 构建两个场景的模板</span></span>
<span class="line"><span>flower_care_template = &quot;&quot;&quot;你是一个经验丰富的园丁，擅长解答关于养花育花的问题。</span></span>
<span class="line"><span>                       下面是需要你来回答的问题:</span></span>
<span class="line"><span>                       {input}&quot;&quot;&quot;</span></span>
<span class="line"><span>flower_deco_template = &quot;&quot;&quot;你是一位网红插花大师，擅长解答关于鲜花装饰的问题。</span></span>
<span class="line"><span>                       下面是需要你来回答的问题:</span></span>
<span class="line"><span>                       {input}&quot;&quot;&quot;</span></span>
<span class="line"><span># 构建提示信息</span></span>
<span class="line"><span>prompt_infos = [</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>       &quot;key&quot;: &quot;flower_care&quot;,</span></span>
<span class="line"><span>       &quot;description&quot;: &quot;适合回答关于鲜花护理的问题&quot;,</span></span>
<span class="line"><span>       &quot;template&quot;: flower_care_template,</span></span>
<span class="line"><span>   },</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>       &quot;key&quot;: &quot;flower_decoration&quot;,</span></span>
<span class="line"><span>       &quot;description&quot;: &quot;适合回答关于鲜花装饰的问题&quot;,</span></span>
<span class="line"><span>       &quot;template&quot;: flower_deco_template,</span></span>
<span class="line"><span>   }]</span></span></code></pre></div><h3 id="初始化语言模型" tabindex="-1">初始化语言模型 <a class="header-anchor" href="#初始化语言模型" aria-label="Permalink to &quot;初始化语言模型&quot;">​</a></h3><p>接下来，我们初始化语言模型。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 初始化语言模型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> langchain.llms </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> OpenAI</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> os</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">os.environ[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;OPENAI_API_KEY&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;你的OpenAI Key&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">llm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> OpenAI()</span></span></code></pre></div><h3 id="构建目标链" tabindex="-1">构建目标链 <a class="header-anchor" href="#构建目标链" aria-label="Permalink to &quot;构建目标链&quot;">​</a></h3><p>下面，我们循环 prompt_infos 这个列表，构建出两个目标链，分别负责处理不同的问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 构建目标链</span></span>
<span class="line"><span>from langchain.chains.llm import LLMChain</span></span>
<span class="line"><span>from langchain.prompts import PromptTemplate</span></span>
<span class="line"><span>chain_map = {}</span></span>
<span class="line"><span>for info in prompt_infos:</span></span>
<span class="line"><span>   prompt = PromptTemplate(template=info[&#39;template&#39;],</span></span>
<span class="line"><span>                           input_variables=[&quot;input&quot;])</span></span>
<span class="line"><span>   print(&quot;目标提示:\\n&quot;,prompt)</span></span>
<span class="line"><span>   chain = LLMChain(llm=llm, prompt=prompt,verbose=True)</span></span>
<span class="line"><span>   chain_map[info[&quot;key&quot;]] = chain</span></span></code></pre></div><p>这里，目标链提示是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>目标提示:</span></span>
<span class="line"><span>input_variables=[&#39;input&#39;]</span></span>
<span class="line"><span>output_parser=None partial_variables={}</span></span>
<span class="line"><span>template=&#39;你是一个经验丰富的园丁，擅长解答关于养花育花的问题。\\n                        下</span></span>
<span class="line"><span>{input}&#39; template_format=&#39;f-string&#39;</span></span>
<span class="line"><span>validate_template=True</span></span>
<span class="line"><span>目标提示:</span></span>
<span class="line"><span>input_variables=[&#39;input&#39;]</span></span>
<span class="line"><span>output_parser=None partial_variables={}</span></span>
<span class="line"><span>template=&#39;你是一位网红插花大师，擅长解答关于鲜花装饰的问题。\\n                        下面</span></span>
<span class="line"><span>{input}&#39; template_format=&#39;f-string&#39;</span></span>
<span class="line"><span>validate_template=True</span></span></code></pre></div><p>对于每个场景，我们创建一个 LLMChain（语言模型链）。每个链会根据其场景模板生成对应的提示，然后将这个提示送入语言模型获取答案。</p><h3 id="构建路由链" tabindex="-1">构建路由链 <a class="header-anchor" href="#构建路由链" aria-label="Permalink to &quot;构建路由链&quot;">​</a></h3><p>下面，我们构建路由链，负责查看用户输入的问题，确定问题的类型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 构建路由链</span></span>
<span class="line"><span>from langchain.chains.router.llm_router import LLMRouterChain, RouterOutputParser</span></span>
<span class="line"><span>from langchain.chains.router.multi_prompt_prompt import MULTI_PROMPT_ROUTER_TEMPL</span></span>
<span class="line"><span>destinations = [f&quot;{p[&#39;key&#39;]}: {p[&#39;description&#39;]}&quot; for p in prompt_infos]</span></span>
<span class="line"><span>router_template = RounterTemplate.format(destinations=&quot;\\n&quot;.join(destinations))</span></span>
<span class="line"><span>print(&quot;路由模板:\\n&quot;,router_template)</span></span>
<span class="line"><span>router_prompt = PromptTemplate(</span></span>
<span class="line"><span>   template=router_template,</span></span>
<span class="line"><span>   input_variables=[&quot;input&quot;],</span></span>
<span class="line"><span>   output_parser=RouterOutputParser(),)</span></span>
<span class="line"><span>print(&quot;路由提示:\\n&quot;,router_prompt)</span></span>
<span class="line"><span>router_chain = LLMRouterChain.from_llm(llm,</span></span>
<span class="line"><span>                                      router_prompt,</span></span>
<span class="line"><span>verbose=True)</span></span></code></pre></div><p>输出：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">路由模板:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Given a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">raw</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> input </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">language</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> model </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">select</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> the model prompt best suited f</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> FORMATTING </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a markdown code snippet </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">with</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">JSON</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> object</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> formatted </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> look </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">like</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`\`\`json</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&amp;#123;&amp;#123;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;destination&quot;: string </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">name of the prompt to use or &quot;DEFAULT&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;next_inputs&quot;: string </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">a potentially modified version of the original input</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}​}</span></span></code></pre></div><p>REMEMBER: &quot;destination&quot; MUST be one of the candidate prompt names specified below REMEMBER: &quot;next_inputs&quot; can just be the original input if you don&#39;t think any mod &lt;&lt; CANDIDATE PROMPTS &gt;&gt; flower_care: 适合回答关于鲜花护理的问题 flower_decoration: 适合回答关于鲜花装饰的问题 &lt;&lt; INPUT &gt;&gt; {input} &lt;&lt; OUTPUT &gt;&gt; 路由提示: input_variables=[&#39;input&#39;] output_parser=RouterOutputParser(default_destination=&#39;D partial_variables={} template=&#39;Given a raw text input to a language model select the model prompt best &lt;&lt; FORMATTING &gt;&gt;\\n Return a markdown code snippet with a JSON object formatted to look like:\\n\`\`\`jso REMEMBER: &quot;destination&quot; MUST be one of the candidate prompt names specified below REMEMBER: &quot;next_inputs&quot; can just be the original input if you don&#39;t think any mo flower_care: 适合回答关于鲜花护理的问题\\n flower_decoration: 适合回答关于鲜花装饰的问题\\n\\n &lt;&lt; INPUT &gt;&gt;\\n{input}\\n\\n&lt;&lt; OUTPUT &gt;&gt;\\n&#39; template_format=&#39;f-string&#39; validate_template=True</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>这里我说一下路由器链是如何构造提示信息，来引导大模型查看用户输入的问题并确定问题的类型的。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>先看路由模板部分，这段模板字符串是一个指导性的说明，目的是引导语言模型正确处理用户的输入，并将其定向到适当的模型提示。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 路由模板的解释</span></span>
<span class="line"><span></span></span>
<span class="line"><span>路由模板是路由功能得以实现的核心。我们来详细分解一下这个模板的每个部分。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>引言</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- Given a raw text input to a language model select the model prompt best suited for theinput.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这是一个简单的引导语句，告诉模型你将给它一个输入，它需要根据这个输入选择最适合的模型提示。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- You will be given the names of the available prompts and a description of what the promptis best suited for.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这里进一步提醒模型，它将获得各种模型提示的名称和描述。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- You may also revise the original input if you think that revising it will ultimately lead to abetter response from the language model.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这是一个可选的步骤，告诉模型它可以更改原始输入以获得更好的响应。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>格式说明 (&lt;&lt; FORMATTING &gt;&gt;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>指导模型如何格式化其输出，使其以特定的方式返回结果。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- Return a markdown code snippet with a JSON object formatted to look like:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>表示模型的输出应该是一个 Markdown 代码片段，其中包含一个特定格式的 JSON 对象。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>下面的代码块显示了期望的 JSON 结构，其中 destination 是模型选择的提示名称（或“DEFAULT”），而 next_inputs 是可能被修订的原始输入。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>额外的说明和要求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- REMEMBER: “destination” MUST be one of the candidate prompt names specified belowOR it can be “DEFAULT”…</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这是一个重要的指导，提醒模型 “destination” 字段的值必须是下面列出的提示之一或是“DEFAULT”。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- REMEMBER: “next_inputs” can just be the original input if you don’t think anymodifications are needed.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这再次强调，除非模型认为有必要，否则原始输入不需要修改。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>候选提示 (&lt;&lt; CANDIDATE PROMPTS &gt;&gt;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>列出了两个示例模型提示及其描述：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- “flower_care: 适合回答关于鲜花护理的问题”，适合处理与花卉护理相关的问题。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- “flower_decoration: 适合回答关于鲜花装饰的问题”，适合处理与花卉装饰相关的问题。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输入 / 输出部分</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- &lt;&lt; INPUT &gt;&gt;\\n{input}\\n\\n&lt;&lt; OUTPUT &gt;&gt;\\n：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这部分为模型提供了一个格式化的框架，其中它将接收一个名为 {input} 的输入，并在此后的部分输出结果。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>总的来说，这个模板的目的是让模型知道如何处理用户的输入，并根据提供的提示列表选择一个最佳的模型提示来回应。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 路由提示的解释</span></span>
<span class="line"><span></span></span>
<span class="line"><span>路由提示 (router_prompt）则根据路由模板，生成了具体传递给 LLM 的路由提示信息。</span></span></code></pre></div><p>其中 input_variables 指定模板接收的输入变量名，这里只有 &quot;input&quot;。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- output_parser 是一个用于解析模型输出的对象，它有一个默认的目的地和一个指向下一输入的键。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- template 是实际的路由模板，用于给模型提供指示。这就是刚才详细解释的模板内容。</span></span></code></pre></div><p>template_format 指定模板的格式，这里是 &quot;f-string&quot;。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- validate_template 是一个布尔值，如果为 True，则会在使用模板前验证其有效性。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>简而言之，这个构造允许你将用户的原始输入送入路由器，然后路由器会决定将该输入发送到哪个具体的模型提示，或者是否需要对输入进行修订以获得最佳的响应。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 构建默认链</span></span>
<span class="line"><span></span></span>
<span class="line"><span>除了处理目标链和路由链之外，我们还需要准备一个默认链。如果路由链没有找到适合的链，那么，就以默认链进行处理。</span></span></code></pre></div><h1 id="构建默认链" tabindex="-1">构建默认链 <a class="header-anchor" href="#构建默认链" aria-label="Permalink to &quot;构建默认链&quot;">​</a></h1><p>from langchain.chains import ConversationChain default_chain = ConversationChain(llm=llm, output_key=&quot;text&quot;, verbose=True)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>### 构建多提示链</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最后，我们使用 MultiPromptChain 类把前几个链整合在一起，实现路由功能。这个MultiPromptChain 类是一个多路选择链，它使用一个 LLM 路由器链在多个提示之间进行选择。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MultiPromptChain 中有三个关键元素。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- router_chain（类型 RouterChain）：这是用于决定目标链和其输入的链。当给定某个输入时，这个 router_chain 决定哪一个 destination_chain 应该被选中，以及传给它的具体输入是什么。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- destination_chains（类型 Mapping[str, LLMChain]）：这是一个映射，将名称映射到可以将输入路由到的候选链。例如，你可能有多种处理文本输入的方法（或“链”），每种方法针对</span></span></code></pre></div><p>特定类型的问题。destination_chains 可以是这样一个字典：{&#39;weather&#39;: weather_chain, &#39;news&#39;: news_chain}。在这里，weather_chain 可能专门处理与</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>- 天气相关的问题，而 news_chain 处理与新闻相关的问题。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- default_chain（类型 LLMChain）：当 router_chain 无法将输入映射到 destination_chains中的任何一个链时，LLMChain 将使用此默认链。这是一个备选方案，确保即使路由器不能决定正确的链，也总有一个链可以处理输入。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>它的工作流程如下：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 输入首先传递给 router_chain。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. router_chain 根据某些标准或逻辑决定应该使用哪一个 destination_chain。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 输入随后被路由到选定的 destination_chain，该链进行处理并返回结果。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 如果 router_chain 不能决定正确的 destination_chain，则输入会被传递给 default_chain。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这样，MultiPromptChain 就为我们提供了一个在多个处理链之间动态路由输入的机制，以得到最相关或最优的输出。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>实现代码如下：</span></span></code></pre></div><h1 id="构建多提示链" tabindex="-1">构建多提示链 <a class="header-anchor" href="#构建多提示链" aria-label="Permalink to &quot;构建多提示链&quot;">​</a></h1><p>from langchain.chains.router import MultiPromptChain chain = MultiPromptChain( router_chain=router_chain, destination_chains=chain_map, default_chain=default_chain, verbose=True)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>## 运行路由链</span></span>
<span class="line"><span></span></span>
<span class="line"><span>好了，至此我们的链路已经准备好了。现在开始提出各种问题，测试一下我们的链。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试 A：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(chain.run(“如何为玫瑰浇水？”))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/09/2.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试 B：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(chain.run(“如何为婚礼场地装饰花朵？”))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/09/3.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>测试 C：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(chain.run(“如何考入哈佛大学？”))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![](images/09/4.png)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这三个测试，分别被路由到了三个不同的目标链，其中两个是我们预设的“专家类型”目标链，而第三个问题：如何考入哈佛大学？被模型一眼看穿，并不属于任何鲜花运营业务场景，路由链把它抛入了一个 “default chain” —— ConversationChain 去解决。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 总结时刻</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在这个示例中，我们看到了 LLMRouterChain 以及 MultiPromptChain。其中，LLMRouterChain 继承自 RouterChain；而 MultiPromptChain 则继承自 MultiRouteChain。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>整体上，我们通过 MultiPromptChain 把其他链组织起来，完成了路由功能。</span></span></code></pre></div><p>chain = MultiPromptChain( router_chain=router_chain, destination_chains=chain_map, default_chain=default_chain, verbose=True)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>在 LangChain 的 chains -&gt; router -&gt; base.py 文件中，可以看到 RouterChain 和MultiRouteChain 的代码实现。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 思考题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 通过 verbose=True 这个选项的设定，在输出时显示了链的开始和结束日志，从而得到其相互调用流程。请你尝试把该选项设置为 False，看一看输出结果有何不同。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 在这个例子中，我们使用了 ConversationChain 作为 default_chain，这个 Chain 是LLMChain 的子类，你能否把这个 Chain 替换为 LLMChain？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>期待在留言区看到你的分享。如果你觉得内容对你有帮助，也欢迎分享给有需要的朋友！最后如果你学有余力，可以进一步学习下面的延伸阅读。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 延伸阅读</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 代码，RouterChain 和 MultiRouteChain 的实现细节</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 代码，MultiPromptChain 的实现细节</span></span></code></pre></div>`,51)])])}const k=n(e,[["render",l]]);export{d as __pageData,k as default};
