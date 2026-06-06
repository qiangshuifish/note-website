import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"21｜登堂入室 ：通过Agent SDK 掌控 Claude Code","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是 Agent SDK","slug":"什么是-agent-sdk","link":"#什么是-agent-sdk","children":[{"level":3,"title":"SDK 能力一览","slug":"sdk-能力一览","link":"#sdk-能力一览","children":[]},{"level":3,"title":"安装与环境配置","slug":"安装与环境配置","link":"#安装与环境配置","children":[]}]},{"level":2,"title":"两种使用方式","slug":"两种使用方式","link":"#两种使用方式","children":[]},{"level":2,"title":"ClaudeAgentOptions 配置详解","slug":"claudeagentoptions-配置详解","link":"#claudeagentoptions-配置详解","children":[]},{"level":2,"title":"权限模式详解","slug":"权限模式详解","link":"#权限模式详解","children":[]},{"level":2,"title":"消息类型与响应处理","slug":"消息类型与响应处理","link":"#消息类型与响应处理","children":[]},{"level":2,"title":"会话管理","slug":"会话管理","link":"#会话管理","children":[]},{"level":2,"title":"实战项目——代码分析 Agent","slug":"实战项目——代码分析-agent","link":"#实战项目——代码分析-agent","children":[]},{"level":2,"title":"错误处理与监控","slug":"错误处理与监控","link":"#错误处理与监控","children":[]},{"level":2,"title":"成本监控与控制","slug":"成本监控与控制","link":"#成本监控与控制","children":[]},{"level":2,"title":"总结一下","slug":"总结一下","link":"#总结一下","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"下一讲预告","slug":"下一讲预告","link":"#下一讲预告","children":[]}],"relativePath":"ClaudeCode工程化实战/21｜登堂入室：通过AgentSDK掌控ClaudeCode.md","filePath":"ClaudeCode工程化实战/21｜登堂入室：通过AgentSDK掌控ClaudeCode.md","lastUpdated":1779815462000}'),l={name:"ClaudeCode工程化实战/21｜登堂入室：通过AgentSDK掌控ClaudeCode.md"};function t(i,s,o,c,u,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_21-登堂入室-通过agent-sdk-掌控-claude-code" tabindex="-1">21｜登堂入室 ：通过Agent SDK 掌控 Claude Code <a class="header-anchor" href="#_21-登堂入室-通过agent-sdk-掌控-claude-code" aria-label="Permalink to &quot;21｜登堂入室 ：通过Agent SDK 掌控 Claude Code&quot;">​</a></h1><blockquote><p>释题：登堂入室。从 CLI 到 Headless，你一直站在 Claude Code 的“门外”，通过命令行传入指令、拿回结果。Agent SDK 让你真正走进内堂用 <code>query()</code> 和 <code>ClaudeSDKClient</code> 像调用函数一样驱动 AI Agent，从使用者变成构建者。</p></blockquote><p>你好，我是黄佳。</p><p>上一讲我们学习了 Rules 规则系统，指令规则定义 Claude 该怎么做，权限规则定义 Claude 能做什么。两套规则协同运作，构成了完整的行为约束体系。但不管是 Headless 模式还是规则系统，本质上你还是在通过配置和命令行驱动 Claude Code，能做的事情有限：传一段 Prompt 进去，拿一段文本出来。</p><p>今天我们要更进一步，学习 Claude Agent SDK——它把 Claude Code 的所有能力封装成了可编程的接口。你可以用 Python 或 TypeScript 编写代码，像调用普通函数一样调用 AI Agent。</p><p>如果已经在 CI/CD 中大量使用 Claude Code：PR 自动审查、文档生成、代码分析。一切都运行得很好，有一天领导说：“我们想做一个功能，让用户在我们的产品里上传代码，然后 AI 自动分析并给出报告。”</p><p>思考思考，之前我们用的是命令行 + Headless 模式，但这次需要的是 <strong>在自己的应用里调用 Claude Code 的能力</strong>。现在你需要的不是一个命令行工具，而是一个 <strong>可编程的 SDK</strong>。命令行工具像一把螺丝刀，你手动拧一颗螺丝、拧两颗螺丝，够用。但当你要在流水线上每小时拧一千颗螺丝时，你需要的是一台电动螺丝机——一个能被程序控制的接口。</p><p>这就是 Claude Agent SDK 的价值——它把 Claude Code 的所有能力封装成了可编程的接口。你可以用 Python 或 TypeScript 编写代码，像调用普通函数一样调用 AI Agent。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/468625e7e51fd6ddf004a9ab0b9d0a3f.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/468625e7e51fd6ddf004a9ab0b9d0a3f.jpg" alt=""></a></p><p>从配置驱动到代码驱动，是从“使用者”到“构建者”的关键一步。</p><h2 id="什么是-agent-sdk" tabindex="-1">什么是 Agent SDK <a class="header-anchor" href="#什么是-agent-sdk" aria-label="Permalink to &quot;什么是 Agent SDK&quot;">​</a></h2><p>Claude Agent SDK 提供了 <strong>可编程的 Claude Code</strong>。它不是一个新的模型 API，而是对 Claude Code 这个 Agent 系统的完整封装。你通过 SDK 调用的不是一个简单的文本生成接口，而是一个完整的 Agent 循环——Claude 会自主决定使用哪些工具、读取哪些文件、执行哪些命令，然后把结果返回给你。</p><p>正如 Anthropic 官方文档所述：</p><blockquote><p>Claude Agent SDK 让你能够构建自主运行的 AI Agent——它们可以读取文件、执行命令、搜索网络、编辑代码等。SDK 提供了驱动 Claude Code 的相同工具、代理循环和上下文管理能力。</p></blockquote><p>简单来说，这三种方式形成了一个递进关系：CLI 是手动操作，Headless 是自动化脚本，SDK 是可编程集成。每一步都在降低人工干预的程度，提升集成的灵活性。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/58eaa16e20968156faafc65814d46af8.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/58eaa16e20968156faafc65814d46af8.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/b0569f9757943d81ef5bc243ff9b368b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/b0569f9757943d81ef5bc243ff9b368b.jpg" alt=""></a></p><p>Agent SDK 支持两种语言。</p><ul><li><p><strong>Python</strong>： <code>pip install claude-agent-sdk</code></p></li><li><p><strong>TypeScript</strong>： <code>npm install @anthropic-ai/claude-agent-sdk</code></p></li></ul><p>两种语言的 API 设计保持一致，功能完全相同。这一讲以 Python 为主，同时提供 TypeScript 对照。选择哪种语言取决于你的技术栈——如果你的后端是 Django 或 FastAPI，用 Python；如果是 Express 或 Next.js，用 TypeScript。</p><h3 id="sdk-能力一览" tabindex="-1">SDK 能力一览 <a class="header-anchor" href="#sdk-能力一览" aria-label="Permalink to &quot;SDK 能力一览&quot;">​</a></h3><p>下面这张表列出了 Agent SDK 赋予你的全部能力。每一项都对应 Claude Code 本身的一种工具，SDK 让你可以在自己的代码中精确控制这些工具的使用。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/447c5ba9dfaf1ce2cc300796da2c0617.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/447c5ba9dfaf1ce2cc300796da2c0617.jpg" alt=""></a></p><p>理解了这张表，你就能回答前面问题了：用户上传代码后，Agent 可以用 Read 读取文件、用 Grep 搜索模式、用 Glob 遍历目录、用 Bash 运行测试——所有这些操作都在你的应用后端自动完成，用户只需要等待报告生成。</p><h3 id="安装与环境配置" tabindex="-1">安装与环境配置 <a class="header-anchor" href="#安装与环境配置" aria-label="Permalink to &quot;安装与环境配置&quot;">​</a></h3><p>在开始编写代码之前，你需要安装 SDK 并配置好环境。这个过程很简单，但有几个关键点需要注意。</p><p>Python 安装要求 Python 3.10 及以上版本。之所以有这个版本要求，是因为 SDK 大量使用了 <code>async/await</code> 语法和 <code>match/case</code> 模式匹配等现代 Python 特性。如果你的系统 Python 版本较低，建议使用 <code>pyenv</code> 或 <code>conda</code> 管理多个 Python 版本。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 要求 Python 3.10+</span></span>
<span class="line"><span>pip install claude-agent-sdk</span></span></code></pre></div><p>安装完成后，用一段简单的代码验证安装是否成功：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import query</span></span>
<span class="line"><span>print(&quot;Claude Agent SDK installed successfully!&quot;)</span></span></code></pre></div><p>TypeScript 方面，SDK 以 npm 包的形式分发，兼容 Node.js 18+ 环境：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npm install &amp;#64;anthropic-ai/claude-agent-sdk</span></span></code></pre></div><p>验证安装：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { query } from &#39;&amp;#64;anthropic-ai/claude-agent-sdk&#39;;</span></span>
<span class="line"><span>console.log(&quot;Claude Agent SDK installed successfully!&quot;);</span></span></code></pre></div><p>SDK 需要 Anthropic API Key 才能运行。这个 Key 是你与 Anthropic 服务器通信的凭证，所有的模型调用和 Token 消耗都会计入这个 Key 对应的账户。</p><p>最常见的配置方式是通过环境变量：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export ANTHROPIC_API_KEY=&quot;sk-ant-api03-...&quot;</span></span></code></pre></div><p>或者在代码中设置，适用于需要动态切换 Key 的场景（比如多租户 SaaS 应用，每个客户有自己的 Key）：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import os</span></span>
<span class="line"><span>os.environ[&quot;ANTHROPIC_API_KEY&quot;] = &quot;sk-ant-api03-...&quot;</span></span></code></pre></div><p>如果你在 CI/CD 中使用，可以用 Secrets 管理：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>env:</span></span>
<span class="line"><span>  ANTHROPIC_API_KEY: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span></code></pre></div><h2 id="两种使用方式" tabindex="-1">两种使用方式 <a class="header-anchor" href="#两种使用方式" aria-label="Permalink to &quot;两种使用方式&quot;">​</a></h2><p>Agent SDK 提供了两种使用方式，适用于不同场景。理解它们的区别是正确使用 SDK 的第一步。你可以把它们类比为 Python 中的 <code>requests.get()</code> 和 <code>requests.Session()</code>，前者是无状态的一次性调用，后者是有状态的会话管理。</p><p><strong>query() 函数：简洁高效</strong></p><p><code>query()</code> 是最简单的方式，适合轻量级用例。它接收一个 Prompt 字符串，返回一个异步迭代器，你可以逐条接收 Agent 产生的消息。整个过程不需要手动管理连接、配置选项或处理会话状态，SDK 帮你搞定一切。</p><p>这种设计的好处是显而易见的：当你只想快速验证一个想法、写一个脚本、或者做一次性的分析时，不需要写二十行初始化代码。一个函数调用就够了。</p><p><strong>Python：</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import query</span></span>
<span class="line"><span>import asyncio</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def main():</span></span>
<span class="line"><span>    # 简单查询</span></span>
<span class="line"><span>    async for message in query(&quot;解释什么是递归&quot;):</span></span>
<span class="line"><span>        if message.type == &quot;text&quot;:</span></span>
<span class="line"><span>            print(message.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.run(main())</span></span></code></pre></div><p><strong>TypeScript：</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { query } from &#39;&amp;#64;anthropic-ai/claude-agent-sdk&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async function main() {</span></span>
<span class="line"><span>  for await (const message of query(&quot;解释什么是递归&quot;)) {</span></span>
<span class="line"><span>    if (message.type === &#39;text&#39;) {</span></span>
<span class="line"><span>      console.log(message.text);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main();</span></span></code></pre></div><p><code>query()</code> 的特点是：</p><ul><li><p>一行代码即可调用</p></li><li><p>自动处理工具调用循环</p></li><li><p>适合单次、简单的任务</p></li></ul><p><strong>ClaudeSDKClient 类：完整控制</strong></p><p>当你需要更精细的控制时，比如限制 Agent 只能使用特定工具、设置最大执行轮次、管理多轮会话，就需要使用 <code>ClaudeSDKClient</code>。它提供了完整的配置能力，让你可以像搭积木一样组合 Agent 的行为。</p><p>与开箱即用的 <code>query()</code> 不同， <code>ClaudeSDKClient</code> 要求你显式地创建客户端、配置选项、管理连接生命周期。这种显式性是刻意为之的，在生产环境中，你需要明确知道 Agent 能做什么、不能做什么、在什么条件下停止。隐式的默认值在生产中往往是 Bug 的温床。</p><p><strong>Python：</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions</span></span>
<span class="line"><span>import asyncio</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def main():</span></span>
<span class="line"><span>    options = ClaudeAgentOptions(</span></span>
<span class="line"><span>        allowed_tools=[&quot;Read&quot;, &quot;Grep&quot;, &quot;Glob&quot;],</span></span>
<span class="line"><span>        max_turns=10,</span></span>
<span class="line"><span>        permission_mode=&quot;plan&quot;  # 只读模式</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>        await client.query(&quot;分析 src/ 目录的代码结构&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        async for message in client.receive_response():</span></span>
<span class="line"><span>            if message.type == &quot;text&quot;:</span></span>
<span class="line"><span>                print(message.text)</span></span>
<span class="line"><span>            elif message.type == &quot;tool_use&quot;:</span></span>
<span class="line"><span>                print(f&quot;Using tool: {message.tool_name}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.run(main())</span></span></code></pre></div><p><strong>TypeScript：</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { ClaudeSDKClient, ClaudeAgentOptions } from &#39;&amp;#64;anthropic-ai/claude-agent-sdk&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async function main() {</span></span>
<span class="line"><span>  const options: ClaudeAgentOptions = {</span></span>
<span class="line"><span>    allowedTools: [&#39;Read&#39;, &#39;Grep&#39;, &#39;Glob&#39;],</span></span>
<span class="line"><span>    maxTurns: 10,</span></span>
<span class="line"><span>    permissionMode: &#39;plan&#39;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const client = new ClaudeSDKClient(options);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    await client.connect();</span></span>
<span class="line"><span>    await client.query(&quot;分析 src/ 目录的代码结构&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for await (const message of client.receiveResponse()) {</span></span>
<span class="line"><span>      if (message.type === &#39;text&#39;) {</span></span>
<span class="line"><span>        console.log(message.text);</span></span>
<span class="line"><span>      } else if (message.type === &#39;toolUse&#39;) {</span></span>
<span class="line"><span>        console.log(\`Using: \${message.toolName}\`);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    await client.disconnect();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main();</span></span></code></pre></div><p><code>ClaudeSDKClient</code> 的特点是：</p><ul><li><p>完整的配置控制</p></li><li><p>支持自定义工具</p></li><li><p>支持 Hooks</p></li><li><p>支持会话恢复</p></li></ul><p>选择哪种方式取决于你的具体场景。下面这张表可以帮你快速判断。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/127842f6c949d6fa59be8d380ca8e7e9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/127842f6c949d6fa59be8d380ca8e7e9.jpg" alt=""></a></p><p>一个简单的经验法则是，如果你在终端里用一行命令就能完成的事情，用 <code>query()</code>；如果你需要在代码里做任何“配置”或“控制”，用 <code>ClaudeSDKClient</code>。</p><p>在实际项目中，常见的演进路径是先用 <code>query()</code> 快速验证想法，然后在功能成型后迁移到 <code>ClaudeSDKClient</code> 进行工程化。两种方式的消息格式完全兼容，迁移成本很低。</p><h2 id="claudeagentoptions-配置详解" tabindex="-1">ClaudeAgentOptions 配置详解 <a class="header-anchor" href="#claudeagentoptions-配置详解" aria-label="Permalink to &quot;ClaudeAgentOptions 配置详解&quot;">​</a></h2><p><code>ClaudeAgentOptions</code> 是控制 Agent 行为的核心配置类。你可以把它理解为 Agent 的“说明书”，它告诉 Agent 该用什么模型、能用什么工具、最多跑几轮、在什么目录下工作。每一个配置项都会直接影响 Agent 的行为和成本。</p><p>下面是完整的配置项。不需要一次记住所有配置，你可以先关注最常用的四个： <code>allowed_tools</code>、 <code>permission_mode</code>、 <code>max_turns</code>、 <code>model</code>。其余的在需要时查阅即可。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeAgentOptions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    # === 模型选择 ===</span></span>
<span class="line"><span>    model=&quot;sonnet&quot;,  # &quot;sonnet&quot; | &quot;opus&quot; | &quot;haiku&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === 工具控制 ===</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Write&quot;, &quot;Bash&quot;, &quot;Grep&quot;, &quot;Glob&quot;],</span></span>
<span class="line"><span>    disallowed_tools=[&quot;Task&quot;],</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === 权限模式 ===</span></span>
<span class="line"><span>    permission_mode=&quot;default&quot;,  # &quot;default&quot; | &quot;acceptEdits&quot; | &quot;plan&quot; | &quot;bypass&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === 执行控制 ===</span></span>
<span class="line"><span>    max_turns=20,</span></span>
<span class="line"><span>    cwd=&quot;/path/to/project&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === 输出格式 ===</span></span>
<span class="line"><span>    output_format=&quot;stream-json&quot;,  # &quot;text&quot; | &quot;json&quot; | &quot;stream-json&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === 会话管理 ===</span></span>
<span class="line"><span>    continue_conversation=True,</span></span>
<span class="line"><span>    resume=&quot;session-id&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === 系统提示 ===</span></span>
<span class="line"><span>    system_prompt=&quot;You are a helpful coding assistant.&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === MCP 服务器 ===</span></span>
<span class="line"><span>    mcp_servers={</span></span>
<span class="line"><span>        &quot;my-server&quot;: {...}</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # === Hooks ===</span></span>
<span class="line"><span>    hooks={</span></span>
<span class="line"><span>        &quot;PreToolUse&quot;: [...],</span></span>
<span class="line"><span>        &quot;PostToolUse&quot;: [...]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span></code></pre></div><h2 id="权限模式详解" tabindex="-1">权限模式详解 <a class="header-anchor" href="#权限模式详解" aria-label="Permalink to &quot;权限模式详解&quot;">​</a></h2><p>权限模式决定了 Agent 执行操作时的确认行为。这是安全性与自动化程度之间的一个权衡——你给 Agent 越多的自主权，它就能越快地完成任务，但风险也越高。</p><p>选择权限模式时，问自己一个问题：如果 Agent 做了一件错事，最坏的结果是什么？如果最坏结果“改错了一个文件，我 <code>git checkout</code> 恢复一下”，那可以放宽权限；如果最坏结果是“删除了生产数据库”，那必须严格控制。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/5ac340ffeef62c4db2027334bcb38e5a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/5ac340ffeef62c4db2027334bcb38e5a.jpg" alt=""></a></p><p>下面的代码展示了两种典型场景下的权限配置。代码审查只需要读取代码，不需要任何修改能力，所以用 <code>plan</code> 模式加上只读工具；自动修复则需要编辑文件的能力，但不需要执行任意命令，所以用 <code>acceptEdits</code> 模式搭配 <code>Read/Write/Edit</code> 工具。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 代码审查场景：只读</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    permission_mode=&quot;plan&quot;,</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Grep&quot;, &quot;Glob&quot;]</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 自动修复场景：接受编辑</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    permission_mode=&quot;acceptEdits&quot;,</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Write&quot;, &quot;Edit&quot;]</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>你可以精确控制 Agent 能使用哪些工具。SDK 提供了两种控制方式，白名单（ <code>allowed_tools</code>）和黑名单（ <code>disallowed_tools</code>）。</p><p>白名单是“只允许这些”，黑名单是“除了这些都允许”。在安全敏感的场景中，推荐使用白名单，明确列出 Agent 能用的工具，而不是试图列出所有它不能用的工具。</p><p><strong>内置工具列表</strong>：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/36a6b1151da4bf0cbf162fa8e0070c1e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/36a6b1151da4bf0cbf162fa8e0070c1e.jpg" alt=""></a></p><p>下面展示了三种不同的工具限制策略。注意第三个例子——你可以用 <code>Bash(git:*)</code> 这样的语法来限制 Bash 工具只能执行特定前缀的命令，这比完全禁用 Bash 更加灵活。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 只允许读取操作</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Grep&quot;, &quot;Glob&quot;]</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 禁用危险工具</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    disallowed_tools=[&quot;Bash&quot;, &quot;Write&quot;]</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 限制 Bash 命令（只允许 git 和 npm）</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    allowed_tools=[&quot;Bash(git:*)&quot;, &quot;Bash(npm:*)&quot;]</span></span>
<span class="line"><span>)</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/8c29cfdedf15f3d73140c015689e1926.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/8c29cfdedf15f3d73140c015689e1926.jpg" alt=""></a></p><h2 id="消息类型与响应处理" tabindex="-1">消息类型与响应处理 <a class="header-anchor" href="#消息类型与响应处理" aria-label="Permalink to &quot;消息类型与响应处理&quot;">​</a></h2><p>理解消息类型是正确处理 Agent 响应的关键。Agent 不是一次性返回结果的——它是一个异步流，在执行过程中会源源不断地产生不同类型的消息。你的代码需要根据消息类型分别处理，就像处理不同类型的网络事件一样。</p><p>Agent 在执行过程中会产生五种类型的消息。</p><p><code>text</code> 是 Claude 生成的文本内容，比如分析结论、代码解释； <code>tool_use</code> 表示 Agent 正在调用某个工具； <code>tool_result</code> 是工具执行后返回的结果； <code>error</code> 表示执行过程中遇到了错误； <code>result</code> 是最终的汇总消息，包含执行时间、成本等元数据。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async for message in client.receive_response():</span></span>
<span class="line"><span>    match message.type:</span></span>
<span class="line"><span>        case &quot;text&quot;:</span></span>
<span class="line"><span>            # 文本响应</span></span>
<span class="line"><span>            print(message.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &quot;tool_use&quot;:</span></span>
<span class="line"><span>            # 工具调用（Agent 正在使用工具）</span></span>
<span class="line"><span>            print(f&quot;Tool: {message.tool_name}&quot;)</span></span>
<span class="line"><span>            print(f&quot;Input: {message.tool_input}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &quot;tool_result&quot;:</span></span>
<span class="line"><span>            # 工具执行结果</span></span>
<span class="line"><span>            print(f&quot;Result: {message.result}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &quot;error&quot;:</span></span>
<span class="line"><span>            # 错误信息</span></span>
<span class="line"><span>            print(f&quot;Error: {message.error}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &quot;result&quot;:</span></span>
<span class="line"><span>            # 最终结果（任务完成）</span></span>
<span class="line"><span>            print(f&quot;Final: {message.result}&quot;)</span></span>
<span class="line"><span>            print(f&quot;Cost: \${message.total_cost_usd}&quot;)</span></span></code></pre></div><p>当任务完成时，你会收到一个 <code>result</code> 类型的消息。这是整个 Agent 执行过程的“成绩单”，包含了你在生产环境中最关心的信息：这次调用花了多少钱、用了多少 Token、跑了多少轮、耗时多长。这些数据是你做成本监控和性能优化的基础。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;type&quot;: &quot;result&quot;,</span></span>
<span class="line"><span>    &quot;subtype&quot;: &quot;success&quot;,</span></span>
<span class="line"><span>    &quot;session_id&quot;: &quot;abc123&quot;,</span></span>
<span class="line"><span>    &quot;is_error&quot;: False,</span></span>
<span class="line"><span>    &quot;num_turns&quot;: 5,</span></span>
<span class="line"><span>    &quot;duration_ms&quot;: 12000,</span></span>
<span class="line"><span>    &quot;duration_api_ms&quot;: 10000,</span></span>
<span class="line"><span>    &quot;total_cost_usd&quot;: 0.05,</span></span>
<span class="line"><span>    &quot;usage&quot;: {</span></span>
<span class="line"><span>        &quot;input_tokens&quot;: 5000,</span></span>
<span class="line"><span>        &quot;output_tokens&quot;: 2000</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;result&quot;: &quot;任务完成...&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在实际项目中，你通常不会只是把消息打印到终端，你需要把它们收集起来，形成结构化的结果，供后续的业务逻辑使用。</p><p>下面这个模式是项目中反复验证过的“最佳实践”：把所有消息分类收集到一个字典中，最后返回完整的结构化结果。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async def run_agent(prompt: str) -&amp;gt; dict:</span></span>
<span class="line"><span>    &quot;&quot;&quot;运行 Agent 并返回结构化结果&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    result = {</span></span>
<span class="line"><span>        &quot;output&quot;: [],</span></span>
<span class="line"><span>        &quot;tools_used&quot;: [],</span></span>
<span class="line"><span>        &quot;metadata&quot;: {}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async with ClaudeSDKClient(options) as client:</span></span>
<span class="line"><span>        await client.query(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;text&quot;:</span></span>
<span class="line"><span>                result[&quot;output&quot;].append(msg.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            elif msg.type == &quot;tool_use&quot;:</span></span>
<span class="line"><span>                result[&quot;tools_used&quot;].append({</span></span>
<span class="line"><span>                    &quot;tool&quot;: msg.tool_name,</span></span>
<span class="line"><span>                    &quot;input&quot;: msg.tool_input</span></span>
<span class="line"><span>                })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            elif msg.type == &quot;result&quot;:</span></span>
<span class="line"><span>                result[&quot;metadata&quot;] = {</span></span>
<span class="line"><span>                    &quot;session_id&quot;: msg.session_id,</span></span>
<span class="line"><span>                    &quot;duration_ms&quot;: msg.duration_ms,</span></span>
<span class="line"><span>                    &quot;cost_usd&quot;: msg.total_cost_usd,</span></span>
<span class="line"><span>                    &quot;turns&quot;: msg.num_turns</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            elif msg.type == &quot;error&quot;:</span></span>
<span class="line"><span>                result[&quot;error&quot;] = msg.error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return result</span></span></code></pre></div><p>这个模式的好处是，调用方可以直接从 <code>result[&quot;output&quot;]</code> 获取 Agent 的文本输出，从 <code>result[&quot;tools_used&quot;]</code> 获取工具调用记录（用于审计），从 <code>result[&quot;metadata&quot;]</code> 获取成本和性能数据（用于监控）。</p><h2 id="会话管理" tabindex="-1">会话管理 <a class="header-anchor" href="#会话管理" aria-label="Permalink to &quot;会话管理&quot;">​</a></h2><p>你让 Agent 分析一个项目的代码结构，分析完之后想让它基于分析结果生成文档。如果没有会话管理，Agent 在第二次调用时完全不记得它之前分析过什么，你得重新传一遍所有上下文。</p><p>因此，通过会话管理保持对话上下文，或者恢复之前的会话。这对于长时间运行的任务或需要分阶段完成的工作特别有用。</p><p>在同一个 <code>ClaudeSDKClient</code> 实例中，你可以进行多轮对话。Agent 会自动记住之前的上下文——它知道自己读过哪些文件、执行过哪些命令、做过哪些分析。每次新的 <code>query()</code> 调用都是在之前的上下文基础上继续，而不是从零开始。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async with ClaudeSDKClient() as client:</span></span>
<span class="line"><span>    # 第一次查询</span></span>
<span class="line"><span>    await client.query(&quot;创建一个 Python 项目结构&quot;)</span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        print(msg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 获取会话 ID</span></span>
<span class="line"><span>    session_id = client.session_id</span></span>
<span class="line"><span>    print(f&quot;Session ID: {session_id}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 继续对话（Agent 记得之前的上下文）</span></span>
<span class="line"><span>    await client.query(&quot;在项目中添加一个 requirements.txt 文件&quot;)</span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        print(msg)</span></span></code></pre></div><p>有时候你需要在不同的程序运行之间保持对话连续性。比如，你的 Agent 在一次 CI 运行中分析了代码，你想在下一次 CI 运行中让它继续从上次的结论出发。这时候就需要保存 <code>session_id</code>，然后在下次启动时通过 <code>resume</code> 参数恢复会话。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 保存会话 ID</span></span>
<span class="line"><span>saved_session_id = &quot;abc123&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 稍后恢复</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    resume=saved_session_id</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>    # 在之前的上下文中继续</span></span>
<span class="line"><span>    await client.query(&quot;继续刚才的任务&quot;)</span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        print(msg)</span></span></code></pre></div><p>下面是一个完整的会话持久化方案。它把 <code>session_id</code> 保存到本地 JSON 文件中，支持按名称存取多个会话。这个方案适用于开发环境和小型项目。</p><p>在生产环境中，你可能需要把会话 ID 存到 Redis 或数据库中，并设置过期时间——长时间不活跃的会话应该被清理，否则会累积大量上下文，导致 Token 消耗急剧增加。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import json</span></span>
<span class="line"><span>from pathlib import Path</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SESSIONS_FILE = Path(&quot;sessions.json&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def save_session(name: str, session_id: str):</span></span>
<span class="line"><span>    &quot;&quot;&quot;保存会话&quot;&quot;&quot;</span></span>
<span class="line"><span>    sessions = {}</span></span>
<span class="line"><span>    if SESSIONS_FILE.exists():</span></span>
<span class="line"><span>        sessions = json.loads(SESSIONS_FILE.read_text())</span></span>
<span class="line"><span>    sessions[name] = session_id</span></span>
<span class="line"><span>    SESSIONS_FILE.write_text(json.dumps(sessions, indent=2))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def load_session(name: str) -&amp;gt; str | None:</span></span>
<span class="line"><span>    &quot;&quot;&quot;加载会话&quot;&quot;&quot;</span></span>
<span class="line"><span>    if not SESSIONS_FILE.exists():</span></span>
<span class="line"><span>        return None</span></span>
<span class="line"><span>    sessions = json.loads(SESSIONS_FILE.read_text())</span></span>
<span class="line"><span>    return sessions.get(name)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 使用</span></span>
<span class="line"><span>async def main():</span></span>
<span class="line"><span>    # 尝试恢复会话</span></span>
<span class="line"><span>    session_id = load_session(&quot;project-review&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    options = ClaudeAgentOptions(</span></span>
<span class="line"><span>        resume=session_id  # None 则开始新会话</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>        await client.query(&quot;继续代码审查&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;result&quot;:</span></span>
<span class="line"><span>                # 保存会话以便下次恢复</span></span>
<span class="line"><span>                save_session(&quot;project-review&quot;, msg.session_id)</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/0c48b962981b293cd5b7c4e0efe54366.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/0c48b962981b293cd5b7c4e0efe54366.jpg" alt=""></a></p><h2 id="实战项目——代码分析-agent" tabindex="-1">实战项目——代码分析 Agent <a class="header-anchor" href="#实战项目——代码分析-agent" aria-label="Permalink to &quot;实战项目——代码分析 Agent&quot;">​</a></h2><p>理论讲了不少，需要结合实战消化一下，让我们动手构建一个完整的代码分析 Agent。这个项目综合运用了前面讲过的所有知识点： <code>ClaudeSDKClient</code> 的创建和配置、权限模式的选择、工具白名单的设置、消息类型的处理、元数据的收集。</p><p>我们的项目需求是，构建一个 Agent，能够完成以下任务。</p><ol><li><p>扫描指定目录的代码</p></li><li><p>识别项目结构和技术栈</p></li><li><p>发现潜在问题</p></li><li><p>生成分析报告</p></li></ol><p>这是一个典型的“只读分析”场景——Agent 只需要读取代码，不需要修改任何文件。因此我们使用 <code>plan</code> 权限模式，配合 <code>Read/Grep/Glob</code> 三个只读工具。这样即使 Agent 的 Prompt 被注入了恶意指令（比如“删除所有文件”），它也没有能力执行。</p><p>下面是完整的代码实现。代码分为三个部分： <code>analyze_codebase()</code> 函数负责调用 Agent 并收集结果， <code>format_report()</code> 函数负责把结果格式化为可读的报告， <code>main()</code> 函数负责处理命令行参数和文件输出。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/usr/bin/env python3</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>代码分析 Agent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>使用 Claude Agent SDK 构建一个自动代码分析工具。</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import asyncio</span></span>
<span class="line"><span>import sys</span></span>
<span class="line"><span>from datetime import datetime</span></span>
<span class="line"><span>from pathlib import Path</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def analyze_codebase(directory: str) -&amp;gt; dict:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    使用 Claude Agent SDK 分析代码库</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Args:</span></span>
<span class="line"><span>        directory: 要分析的目录路径</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Returns:</span></span>
<span class="line"><span>        包含分析结果的字典</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    # 配置 Agent 选项</span></span>
<span class="line"><span>    options = ClaudeAgentOptions(</span></span>
<span class="line"><span>        # 只允许读取操作，确保安全</span></span>
<span class="line"><span>        allowed_tools=[&quot;Read&quot;, &quot;Grep&quot;, &quot;Glob&quot;],</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 使用只读模式</span></span>
<span class="line"><span>        permission_mode=&quot;plan&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 限制执行轮次</span></span>
<span class="line"><span>        max_turns=25,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 设置工作目录</span></span>
<span class="line"><span>        cwd=directory,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 使用 Sonnet 模型（平衡性能和成本）</span></span>
<span class="line"><span>        model=&quot;sonnet&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 构建分析提示</span></span>
<span class="line"><span>    prompt = f&quot;&quot;&quot;请分析 {directory} 目录中的代码库。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 分析任务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. **项目结构**</span></span>
<span class="line"><span>   - 识别主要目录和文件</span></span>
<span class="line"><span>   - 确定项目类型（Web 应用、API、CLI 工具等）</span></span>
<span class="line"><span>   - 列出使用的技术栈</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. **代码质量**</span></span>
<span class="line"><span>   - 检查代码组织是否合理</span></span>
<span class="line"><span>   - 识别重复代码</span></span>
<span class="line"><span>   - 评估命名规范</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. **潜在问题**</span></span>
<span class="line"><span>   - 查找可能的 bug</span></span>
<span class="line"><span>   - 识别安全隐患</span></span>
<span class="line"><span>   - 发现性能问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. **改进建议**</span></span>
<span class="line"><span>   - 提出具体的改进方案</span></span>
<span class="line"><span>   - 优先级排序</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 输出格式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请以 Markdown 格式输出报告，包含上述所有部分。</span></span>
<span class="line"><span>在每个问题后注明文件和行号。</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 收集结果</span></span>
<span class="line"><span>    result = {</span></span>
<span class="line"><span>        &quot;directory&quot;: directory,</span></span>
<span class="line"><span>        &quot;timestamp&quot;: datetime.now().isoformat(),</span></span>
<span class="line"><span>        &quot;report&quot;: [],</span></span>
<span class="line"><span>        &quot;tools_used&quot;: [],</span></span>
<span class="line"><span>        &quot;metadata&quot;: {}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>            await client.query(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            async for message in client.receive_response():</span></span>
<span class="line"><span>                match message.type:</span></span>
<span class="line"><span>                    case &quot;text&quot;:</span></span>
<span class="line"><span>                        result[&quot;report&quot;].append(message.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    case &quot;tool_use&quot;:</span></span>
<span class="line"><span>                        tool_info = f&quot;{message.tool_name}: {message.tool_input.get(&#39;file_path&#39;, message.tool_input.get(&#39;pattern&#39;, &#39;&#39;))}&quot;</span></span>
<span class="line"><span>                        result[&quot;tools_used&quot;].append(tool_info)</span></span>
<span class="line"><span>                        print(f&quot;  [scanning] {tool_info}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    case &quot;result&quot;:</span></span>
<span class="line"><span>                        result[&quot;metadata&quot;] = {</span></span>
<span class="line"><span>                            &quot;duration_ms&quot;: message.duration_ms,</span></span>
<span class="line"><span>                            &quot;total_cost_usd&quot;: message.total_cost_usd,</span></span>
<span class="line"><span>                            &quot;num_turns&quot;: message.num_turns,</span></span>
<span class="line"><span>                            &quot;input_tokens&quot;: message.usage.get(&quot;input_tokens&quot;, 0),</span></span>
<span class="line"><span>                            &quot;output_tokens&quot;: message.usage.get(&quot;output_tokens&quot;, 0)</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    case &quot;error&quot;:</span></span>
<span class="line"><span>                        print(f&quot;  [error] {message.error}&quot;)</span></span>
<span class="line"><span>                        result[&quot;error&quot;] = message.error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        result[&quot;error&quot;] = str(e)</span></span>
<span class="line"><span>        print(f&quot;Error during analysis: {e}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return result</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def format_report(result: dict) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;格式化分析报告&quot;&quot;&quot;</span></span>
<span class="line"><span>    lines = [</span></span>
<span class="line"><span>        &quot;=&quot; * 60,</span></span>
<span class="line"><span>        &quot;           CODE ANALYSIS REPORT&quot;,</span></span>
<span class="line"><span>        &quot;=&quot; * 60,</span></span>
<span class="line"><span>        &quot;&quot;,</span></span>
<span class="line"><span>        f&quot;Directory: {result[&#39;directory&#39;]}&quot;,</span></span>
<span class="line"><span>        f&quot;Timestamp: {result[&#39;timestamp&#39;]}&quot;,</span></span>
<span class="line"><span>        &quot;&quot;</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if result.get(&quot;error&quot;):</span></span>
<span class="line"><span>        lines.extend([</span></span>
<span class="line"><span>            &quot;WARNING: Analysis encountered an error:&quot;,</span></span>
<span class="line"><span>            result[&quot;error&quot;],</span></span>
<span class="line"><span>            &quot;&quot;</span></span>
<span class="line"><span>        ])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lines.extend([</span></span>
<span class="line"><span>        &quot;-&quot; * 60,</span></span>
<span class="line"><span>        &quot;                   REPORT&quot;,</span></span>
<span class="line"><span>        &quot;-&quot; * 60,</span></span>
<span class="line"><span>        &quot;&quot;</span></span>
<span class="line"><span>    ])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 添加报告内容</span></span>
<span class="line"><span>    report_text = &quot;\\n&quot;.join(result.get(&quot;report&quot;, []))</span></span>
<span class="line"><span>    lines.append(report_text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 添加元数据</span></span>
<span class="line"><span>    if result.get(&quot;metadata&quot;):</span></span>
<span class="line"><span>        meta = result[&quot;metadata&quot;]</span></span>
<span class="line"><span>        lines.extend([</span></span>
<span class="line"><span>            &quot;&quot;,</span></span>
<span class="line"><span>            &quot;-&quot; * 60,</span></span>
<span class="line"><span>            &quot;                 STATISTICS&quot;,</span></span>
<span class="line"><span>            &quot;-&quot; * 60,</span></span>
<span class="line"><span>            f&quot;Duration: {meta.get(&#39;duration_ms&#39;, 0) / 1000:.2f}s&quot;,</span></span>
<span class="line"><span>            f&quot;Cost: \${meta.get(&#39;total_cost_usd&#39;, 0):.4f}&quot;,</span></span>
<span class="line"><span>            f&quot;Turns: {meta.get(&#39;num_turns&#39;, 0)}&quot;,</span></span>
<span class="line"><span>            f&quot;Tokens: {meta.get(&#39;input_tokens&#39;, 0)} in / {meta.get(&#39;output_tokens&#39;, 0)} out&quot;,</span></span>
<span class="line"><span>            &quot;=&quot; * 60</span></span>
<span class="line"><span>        ])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &quot;\\n&quot;.join(lines)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def main():</span></span>
<span class="line"><span>    &quot;&quot;&quot;主函数&quot;&quot;&quot;</span></span>
<span class="line"><span>    if len(sys.argv) &amp;lt; 2:</span></span>
<span class="line"><span>        print(&quot;Usage: python code_analyzer.py &amp;lt;directory&amp;gt;&quot;)</span></span>
<span class="line"><span>        print(&quot;Example: python code_analyzer.py ./src&quot;)</span></span>
<span class="line"><span>        sys.exit(1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    directory = sys.argv[1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if not Path(directory).is_dir():</span></span>
<span class="line"><span>        print(f&quot;Error: {directory} is not a valid directory&quot;)</span></span>
<span class="line"><span>        sys.exit(1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print(f&quot;Analyzing codebase: {directory}&quot;)</span></span>
<span class="line"><span>    print(&quot;   This may take a few minutes...&quot;)</span></span>
<span class="line"><span>    print()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 运行分析</span></span>
<span class="line"><span>    result = await analyze_codebase(directory)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 输出报告</span></span>
<span class="line"><span>    report = format_report(result)</span></span>
<span class="line"><span>    print(report)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 保存报告到文件</span></span>
<span class="line"><span>    report_file = f&quot;analysis-report-{datetime.now().strftime(&#39;%Y%m%d-%H%M%S&#39;)}.md&quot;</span></span>
<span class="line"><span>    with open(report_file, &quot;w&quot;) as f:</span></span>
<span class="line"><span>        f.write(report)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print(f&quot;\\nReport saved to: {report_file}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    asyncio.run(main())</span></span></code></pre></div><p>运行这个代码分析 Agent 时，你会看到它逐步扫描文件、搜索模式、阅读代码，最终生成一份结构化的报告。注意 STATISTICS 部分——它告诉你这次分析花了多少钱、用了多少 Token，这些数据对于生产环境的成本预估至关重要。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ python code_analyzer.py ./src</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Analyzing codebase: ./src</span></span>
<span class="line"><span>   This may take a few minutes...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  [scanning] Glob: **/*</span></span>
<span class="line"><span>  [scanning] Read: ./src/index.ts</span></span>
<span class="line"><span>  [scanning] Read: ./src/utils/helpers.ts</span></span>
<span class="line"><span>  [scanning] Grep: TODO</span></span>
<span class="line"><span>  [scanning] Read: ./src/config.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>============================================================</span></span>
<span class="line"><span>           CODE ANALYSIS REPORT</span></span>
<span class="line"><span>============================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Directory: ./src</span></span>
<span class="line"><span>Timestamp: 2025-01-18T10:30:45.123456</span></span>
<span class="line"><span></span></span>
<span class="line"><span>------------------------------------------------------------</span></span>
<span class="line"><span>                   REPORT</span></span>
<span class="line"><span>------------------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 项目结构</span></span>
<span class="line"><span></span></span>
<span class="line"><span>这是一个 TypeScript Web 应用项目，使用 Express 框架...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 代码质量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>代码组织良好，遵循模块化原则...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 潜在问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. **安全隐患** (src/auth.ts:42)</span></span>
<span class="line"><span>   - SQL 查询使用字符串拼接，存在注入风险</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. **性能问题** (src/data.ts:78)</span></span>
<span class="line"><span>   - 循环内多次查询数据库，建议使用批量查询</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 改进建议</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. [高优先级] 使用参数化查询替代字符串拼接</span></span>
<span class="line"><span>2. [中优先级] 添加请求限流中间件</span></span>
<span class="line"><span>3. [低优先级] 考虑添加单元测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>------------------------------------------------------------</span></span>
<span class="line"><span>                 STATISTICS</span></span>
<span class="line"><span>------------------------------------------------------------</span></span>
<span class="line"><span>Duration: 15.32s</span></span>
<span class="line"><span>Cost: $0.0523</span></span>
<span class="line"><span>Turns: 8</span></span>
<span class="line"><span>Tokens: 12543 in / 2891 out</span></span>
<span class="line"><span>============================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Report saved to: analysis-report-20250118-103045.md</span></span></code></pre></div><p>前面的代码分析 Agent 是用 Python 实现的。如果你的项目是 Node.js/TypeScript 技术栈，下面提供了完整的 TypeScript 版本。两个版本的功能完全一致，只是语法和类型系统不同。</p><p>TypeScript 版本有一个 Python 没有的优势——类型安全。 <code>AnalysisResult</code> 接口明确定义了返回值的结构，如果你漏写了某个字段或者类型不匹配，编译器会在运行前就告诉你。这在大型项目中特别有价值。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { query, ClaudeAgentOptions } from &#39;&amp;#64;anthropic-ai/claude-agent-sdk&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async function main() {</span></span>
<span class="line"><span>  const options: ClaudeAgentOptions = {</span></span>
<span class="line"><span>    allowedTools: [&#39;Read&#39;, &#39;Grep&#39;, &#39;Glob&#39;],</span></span>
<span class="line"><span>    maxTurns: 10,</span></span>
<span class="line"><span>    permissionMode: &#39;plan&#39;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for await (const message of query(&quot;分析代码结构&quot;, options)) {</span></span>
<span class="line"><span>    switch (message.type) {</span></span>
<span class="line"><span>      case &#39;text&#39;:</span></span>
<span class="line"><span>        console.log(message.text);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      case &#39;toolUse&#39;:</span></span>
<span class="line"><span>        console.log(\`Using: \${message.toolName}\`);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      case &#39;result&#39;:</span></span>
<span class="line"><span>        console.log(\`Done! Cost: $\${message.totalCostUsd}\`);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main();</span></span></code></pre></div><p>完整的 TypeScript Agent如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {</span></span>
<span class="line"><span>  ClaudeSDKClient,</span></span>
<span class="line"><span>  ClaudeAgentOptions,</span></span>
<span class="line"><span>  Message</span></span>
<span class="line"><span>} from &#39;&amp;#64;anthropic-ai/claude-agent-sdk&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>interface AnalysisResult {</span></span>
<span class="line"><span>  output: string[];</span></span>
<span class="line"><span>  toolsUsed: string[];</span></span>
<span class="line"><span>  metadata: {</span></span>
<span class="line"><span>    sessionId?: string;</span></span>
<span class="line"><span>    durationMs?: number;</span></span>
<span class="line"><span>    costUsd?: number;</span></span>
<span class="line"><span>    turns?: number;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  error?: string;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async function analyzeCodebase(directory: string): Promise&amp;lt;AnalysisResult&amp;gt; {</span></span>
<span class="line"><span>  const options: ClaudeAgentOptions = {</span></span>
<span class="line"><span>    allowedTools: [&#39;Read&#39;, &#39;Grep&#39;, &#39;Glob&#39;],</span></span>
<span class="line"><span>    permissionMode: &#39;plan&#39;,</span></span>
<span class="line"><span>    maxTurns: 25,</span></span>
<span class="line"><span>    cwd: directory,</span></span>
<span class="line"><span>    model: &#39;sonnet&#39;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const result: AnalysisResult = {</span></span>
<span class="line"><span>    output: [],</span></span>
<span class="line"><span>    toolsUsed: [],</span></span>
<span class="line"><span>    metadata: {}</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const client = new ClaudeSDKClient(options);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    await client.connect();</span></span>
<span class="line"><span>    await client.query(\`分析 \${directory} 目录的代码结构\`);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for await (const message of client.receiveResponse()) {</span></span>
<span class="line"><span>      switch (message.type) {</span></span>
<span class="line"><span>        case &#39;text&#39;:</span></span>
<span class="line"><span>          result.output.push(message.text);</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &#39;toolUse&#39;:</span></span>
<span class="line"><span>          result.toolsUsed.push(\`\${message.toolName}: \${JSON.stringify(message.toolInput)}\`);</span></span>
<span class="line"><span>          console.log(\`  [scanning] \${message.toolName}\`);</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &#39;result&#39;:</span></span>
<span class="line"><span>          result.metadata = {</span></span>
<span class="line"><span>            sessionId: message.sessionId,</span></span>
<span class="line"><span>            durationMs: message.durationMs,</span></span>
<span class="line"><span>            costUsd: message.totalCostUsd,</span></span>
<span class="line"><span>            turns: message.numTurns</span></span>
<span class="line"><span>          };</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case &#39;error&#39;:</span></span>
<span class="line"><span>          result.error = message.error;</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    await client.disconnect();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用</span></span>
<span class="line"><span>async function main() {</span></span>
<span class="line"><span>  const directory = process.argv[2] || &#39;.&#39;;</span></span>
<span class="line"><span>  console.log(\`Analyzing: \${directory}\`);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const result = await analyzeCodebase(directory);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  console.log(&#39;\\nReport:&#39;);</span></span>
<span class="line"><span>  console.log(result.output.join(&#39;\\n&#39;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  console.log(&#39;\\nStatistics:&#39;);</span></span>
<span class="line"><span>  console.log(\`Duration: \${result.metadata.durationMs}ms\`);</span></span>
<span class="line"><span>  console.log(\`Cost: $\${result.metadata.costUsd}\`);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main().catch(console.error);</span></span></code></pre></div><h2 id="错误处理与监控" tabindex="-1">错误处理与监控 <a class="header-anchor" href="#错误处理与监控" aria-label="Permalink to &quot;错误处理与监控&quot;">​</a></h2><p>在开发阶段，代码能跑通就行。但在生产环境中，错误处理和监控是不可或缺的。Agent 调用涉及网络通信、模型推理、工具执行三个层面，每一层都可能出错。一个健壮的 Agent 应用必须能优雅地处理这些错误，而不是在用户面前崩溃。</p><p>Agent SDK 中的错误分为两类：一类是 SDK 层面的错误（如 API Key 无效、网络超时），抛出 <code>ClaudeAgentError</code> 异常；另一类是 Agent 执行层面的错误（如工具调用失败、权限被拒绝），通过消息流中的 <code>error</code> 类型消息返回。你需要同时处理这两类错误。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentError</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def safe_query(prompt: str):</span></span>
<span class="line"><span>    &quot;&quot;&quot;带错误处理的查询&quot;&quot;&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        async with ClaudeSDKClient() as client:</span></span>
<span class="line"><span>            await client.query(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            async for msg in client.receive_response():</span></span>
<span class="line"><span>                if msg.type == &quot;error&quot;:</span></span>
<span class="line"><span>                    # Agent 内部错误</span></span>
<span class="line"><span>                    print(f&quot;Agent error: {msg.error}&quot;)</span></span>
<span class="line"><span>                    return None</span></span>
<span class="line"><span>                elif msg.type == &quot;text&quot;:</span></span>
<span class="line"><span>                    print(msg.text)</span></span>
<span class="line"><span>                elif msg.type == &quot;result&quot;:</span></span>
<span class="line"><span>                    return msg.result</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except ClaudeAgentError as e:</span></span>
<span class="line"><span>        # SDK 错误（如 API 连接失败）</span></span>
<span class="line"><span>        print(f&quot;SDK error: {e}&quot;)</span></span>
<span class="line"><span>        return None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        # 未预期的错误</span></span>
<span class="line"><span>        print(f&quot;Unexpected error: {e}&quot;)</span></span>
<span class="line"><span>        return None</span></span></code></pre></div><h2 id="成本监控与控制" tabindex="-1">成本监控与控制 <a class="header-anchor" href="#成本监控与控制" aria-label="Permalink to &quot;成本监控与控制&quot;">​</a></h2><p>每一次 Agent 调用都会消耗 Token，产生费用。在生产环境中，如果不对成本进行监控，很容易拿到一份让你惊吓的高额账单，一个失控的 Agent 循环可能在几分钟内消耗数十美元。下面的代码展示了如何在每次调用后检查成本，并在超过预设阈值时发出告警。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import logging</span></span>
<span class="line"><span></span></span>
<span class="line"><span>logging.basicConfig(level=logging.INFO)</span></span>
<span class="line"><span>logger = logging.getLogger(__name__)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def monitored_query(prompt: str, cost_limit: float = 0.10):</span></span>
<span class="line"><span>    &quot;&quot;&quot;带成本监控的查询&quot;&quot;&quot;</span></span>
<span class="line"><span>    async with ClaudeSDKClient() as client:</span></span>
<span class="line"><span>        await client.query(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        turn_count = 0</span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;tool_use&quot;:</span></span>
<span class="line"><span>                turn_count += 1</span></span>
<span class="line"><span>                logger.info(f&quot;Turn {turn_count}: {msg.tool_name}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if msg.type == &quot;result&quot;:</span></span>
<span class="line"><span>                cost = msg.total_cost_usd</span></span>
<span class="line"><span>                logger.info(f&quot;Completed in {msg.duration_ms}ms, cost: \${cost}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if cost &amp;gt; cost_limit:</span></span>
<span class="line"><span>                    logger.warning(f&quot;Cost exceeded limit: \${cost} &amp;gt; \${cost_limit}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                return msg</span></span></code></pre></div><p>控制 Agent 成本的核心手段有三个： <strong>限制轮次</strong>、 <strong>选择更便宜的模型</strong>、 <strong>限制工具</strong>。这三个手段可以组合使用，根据具体场景找到性能和成本的最佳平衡点。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 1. 限制轮次</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    max_turns=10  # 最多 10 轮</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2. 使用更便宜的模型</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    model=&quot;haiku&quot;  # Haiku 比 Sonnet 便宜得多</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 3. 限制工具（减少读取的文件数）</span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Glob&quot;],  # 不用 Grep</span></span>
<span class="line"><span>    max_turns=5</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>在生产环境运行 Agent，监控关键指标：</p><ul><li><p><strong>成本</strong>：每次调用花了多少钱</p></li><li><p><strong>耗时</strong>：任务执行了多长时间</p></li><li><p><strong>轮次</strong>：Agent 循环了多少次</p></li><li><p><strong>错误率</strong>：多少任务失败了</p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/a7a818b892ce2a7107812808a5ccb1d1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/a7a818b892ce2a7107812808a5ccb1d1.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/abc3d33315f355b57c4f29c80c42e79a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/965077/abc3d33315f355b57c4f29c80c42e79a.jpg" alt=""></a></p><h2 id="总结一下" tabindex="-1">总结一下 <a class="header-anchor" href="#总结一下" aria-label="Permalink to &quot;总结一下&quot;">​</a></h2><p>这一讲我们学习了 Claude Agent SDK——用代码驱动 Claude Code 的能力。通过 Agent SDK，你可以在自己的应用中调用 Claude Code 的能力，为用户提供智能代码分析服务。从命令行工具到可编程 SDK，Claude Code 的应用边界被大大拓展。</p><p>SDK 提供了两种使用方式。 <code>query()</code> 函数是最简单的方式，一行代码就能调用 AI Agent，适合快速原型和简单任务。 <code>ClaudeSDKClient</code> 类提供完整控制，支持自定义工具、Hooks、会话管理和精细的权限控制，适合构建生产级应用。</p><p><code>ClaudeAgentOptions</code> 是控制 Agent 行为的核心。</p><ul><li><p>通过 <code>allowed_tools</code> 和 <code>disallowed_tools</code> 可以精确控制 Agent 能使用哪些工具；</p></li><li><p>通过 <code>permission_mode</code> 可以设置权限级别，从完全只读的 <code>plan</code> 模式到自动接受编辑的 <code>acceptEdits</code> 模式；</p></li><li><p>通过 <code>max_turns</code> 可以限制执行轮次，控制成本。</p></li></ul><p>响应处理是使用 SDK 的关键技能。Agent 返回的消息包括 <code>text</code>（文本输出）、 <code>tool_use</code>（工具调用）、 <code>tool_result</code>（工具结果）、 <code>error</code>（错误）和 <code>result</code>（最终结果）几种类型。 <code>result</code> 消息包含丰富的元数据，如执行时间、成本、Token 使用量等。</p><p>会话管理让 Agent 能够保持上下文。你可以在一个会话中进行多轮对话，也可以保存 <code>session_id</code> 以便后续恢复会话。这对于长时间运行的任务或需要分阶段完成的工作特别有用。</p><p>从这一讲的学习中，你应该能感受到 Agent SDK 的设计哲学—— <strong>简单的事情简单做，复杂的事情做得到</strong>。 <code>query()</code> 满足 80% 的轻量级场景， <code>ClaudeSDKClient</code> 覆盖剩下 20% 的生产级需求。这种“渐进式复杂度”（Progressive Complexity）是优秀 SDK 的标志。不要一上来就用最复杂的方式——先从 <code>query()</code> 开始，遇到瓶颈再升级。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>你的项目中有哪些场景适合用 Agent SDK 实现？是代码分析、文档生成，还是自动化测试？请列出至少两个具体场景，并说明你会选择 <code>query()</code> 还是 <code>ClaudeSDKClient</code>。</p></li><li><p>如果你要构建一个面向用户的 AI 代码助手，你会如何设计权限模型？考虑一下，不同用户角色（免费用户 vs. 付费用户）是否应该有不同的工具权限？</p></li><li><p>会话管理能保持上下文，但也会累积 Token 消耗。你会如何平衡上下文保持和成本控制？提示：考虑会话过期策略、上下文摘要、分段式任务设计。</p></li><li><p>代码分析 Agent 使用了 <code>plan</code> 模式限制为只读。如果你想让它在发现问题后自动修复，你会如何修改配置？需要改变哪些选项？会引入哪些新的风险？</p></li></ol><h2 id="下一讲预告" tabindex="-1">下一讲预告 <a class="header-anchor" href="#下一讲预告" aria-label="Permalink to &quot;下一讲预告&quot;">​</a></h2><p>这一讲我们学习了 Agent SDK 的基础用法： <code>query()</code>、 <code>ClaudeSDKClient</code>、配置选项、消息处理。但 SDK 的真正威力在于 <strong>可扩展性</strong>，你可以添加自定义工具、编写 Hooks、实现复杂的权限控制、处理实时流式输出。</p><p>下一讲，我们将学习 <strong>Agent SDK 高级应用</strong>——从基础走向生产。</p><p>你将学会：</p><ul><li><p>使用 <code>@tool</code> 装饰器创建自定义工具，让 Agent 具备专属能力</p></li><li><p>编写 PreToolUse 和 PostToolUse Hooks，在 SDK 层面实现安全拦截</p></li><li><p>实现 <code>canUseTool</code> 运行时权限回调，根据上下文动态决定是否允许某个操作</p></li><li><p>处理 Streaming 流式会话，实现实时进度展示</p></li><li><p>构建一个完整的“自动化测试修复 Agent”，串联整个 SDK 高级特性</p></li></ul><p>欢迎你在留言区参与讨论，如果这节课对你有启发，别忘了分享给身边更多朋友。</p>`,147)])])}const q=n(l,[["render",t]]);export{g as __pageData,q as default};
