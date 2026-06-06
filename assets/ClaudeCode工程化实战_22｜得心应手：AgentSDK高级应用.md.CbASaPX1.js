import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"22｜得心应手：Agent SDK 高级应用","description":"","frontmatter":{},"headers":[{"level":2,"title":"在 Agent 中注入和使用自定义工具","slug":"在-agent-中注入和使用自定义工具","link":"#在-agent-中注入和使用自定义工具","children":[{"level":3,"title":"使用 @tool 装饰器定义工具","slug":"使用-tool-装饰器定义工具","link":"#使用-tool-装饰器定义工具","children":[]},{"level":3,"title":"创建 SDK MCP 服务器承载工具","slug":"创建-sdk-mcp-服务器承载工具","link":"#创建-sdk-mcp-服务器承载工具","children":[]},{"level":3,"title":"注入并使用自定义工具","slug":"注入并使用自定义工具","link":"#注入并使用自定义工具","children":[]},{"level":3,"title":"使用 Pydantic 进行参数验证","slug":"使用-pydantic-进行参数验证","link":"#使用-pydantic-进行参数验证","children":[]}]},{"level":2,"title":"Agent SDK Hooks 系统概述","slug":"agent-sdk-hooks-系统概述","link":"#agent-sdk-hooks-系统概述","children":[{"level":3,"title":"PreToolUse Hook：执行前拦截","slug":"pretooluse-hook-执行前拦截","link":"#pretooluse-hook-执行前拦截","children":[]},{"level":3,"title":"PreToolUse Hook：修改输入参数","slug":"pretooluse-hook-修改输入参数","link":"#pretooluse-hook-修改输入参数","children":[]},{"level":3,"title":"PostToolUse Hook：执行后处理","slug":"posttooluse-hook-执行后处理","link":"#posttooluse-hook-执行后处理","children":[]},{"level":3,"title":"canUseTool 回调：运行时权限控制","slug":"canusetool-回调-运行时权限控制","link":"#canusetool-回调-运行时权限控制","children":[]},{"level":3,"title":"Hooks 与 canUseTool 的选择","slug":"hooks-与-canusetool-的选择","link":"#hooks-与-canusetool-的选择","children":[]}]},{"level":2,"title":"Agent SDK 权限管理：四道防线","slug":"agent-sdk-权限管理-四道防线","link":"#agent-sdk-权限管理-四道防线","children":[{"level":3,"title":"权限模式：全局基调","slug":"权限模式-全局基调","link":"#权限模式-全局基调","children":[]},{"level":3,"title":"工具白名单与黑名单","slug":"工具白名单与黑名单","link":"#工具白名单与黑名单","children":[]}]},{"level":2,"title":"流式会话：为什么以及怎么用","slug":"流式会话-为什么以及怎么用","link":"#流式会话-为什么以及怎么用","children":[{"level":3,"title":"处理权限请求","slug":"处理权限请求","link":"#处理权限请求","children":[]},{"level":3,"title":"中断和取消","slug":"中断和取消","link":"#中断和取消","children":[]},{"level":3,"title":"动态切换设置","slug":"动态切换设置","link":"#动态切换设置","children":[]}]},{"level":2,"title":"实战项目：自动化测试修复 Agent","slug":"实战项目-自动化测试修复-agent","link":"#实战项目-自动化测试修复-agent","children":[{"level":3,"title":"自定义工具：测试运行器","slug":"自定义工具-测试运行器","link":"#自定义工具-测试运行器","children":[]},{"level":3,"title":"Hooks 配置：安全控制","slug":"hooks-配置-安全控制","link":"#hooks-配置-安全控制","children":[]}]},{"level":2,"title":"生产环境最佳实践","slug":"生产环境最佳实践","link":"#生产环境最佳实践","children":[{"level":3,"title":"成本控制","slug":"成本控制","link":"#成本控制","children":[]},{"level":3,"title":"错误重试","slug":"错误重试","link":"#错误重试","children":[]},{"level":3,"title":"超时处理","slug":"超时处理","link":"#超时处理","children":[]},{"level":3,"title":"审计日志","slug":"审计日志","link":"#审计日志","children":[]}]},{"level":2,"title":"总结一下","slug":"总结一下","link":"#总结一下","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"下一讲预告","slug":"下一讲预告","link":"#下一讲预告","children":[]}],"relativePath":"ClaudeCode工程化实战/22｜得心应手：AgentSDK高级应用.md","filePath":"ClaudeCode工程化实战/22｜得心应手：AgentSDK高级应用.md","lastUpdated":1779815462000}'),t={name:"ClaudeCode工程化实战/22｜得心应手：AgentSDK高级应用.md"};function l(o,s,i,c,u,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_22-得心应手-agent-sdk-高级应用" tabindex="-1">22｜得心应手：Agent SDK 高级应用 <a class="header-anchor" href="#_22-得心应手-agent-sdk-高级应用" aria-label="Permalink to &quot;22｜得心应手：Agent SDK 高级应用&quot;">​</a></h1><blockquote><p>释题：得心应手。当你掌握了自定义工具、Hooks 拦截、权限分层和流式会话这些高级能力之后，构建一个像自动化测试修复 Agent 这样的生产级应用，便如得心应手般自然流畅。</p></blockquote><p>你好，我是黄佳。</p><p>上一讲我们学习了 Agent SDK 的基础用法，包括如何创建 Agent、发送查询、处理响应，以及单次调用模式的核心 API。有了这些基础，你已经可以让 Claude 在程序中跑起来了。但要在真实的工程环境中使用它，仅靠基础 API 还远远不够。你需要扩展 Agent 的能力边界，需要在关键节点插入安全控制，需要管理多轮交互的上下文状态，更需要一套完整的生产级运维策略。</p><p>这一讲，我们就来深入 Agent SDK 的高级特性。我会带你从自定义工具开始，逐步走过 Hooks 系统、四层权限管理、流式会话，最终完成一个完整的实战项目——自动化测试修复 Agent。这个 Agent 能自动运行测试、分析失败原因、提出修复方案，甚至在获得确认后自动修复代码。</p><p>一个中型电商项目在每次提交代码前，CI 会运行完整的测试套件，大约 200 个测试用例。大部分时候测试都能通过，但偶尔会有几个测试失败。问题是，测试失败的原因千奇百怪。有时是代码逻辑错误，有时是测试本身过时了，有时是环境配置问题，有时是 Mock 数据不对。</p><p>每次失败，我们都要重复后面的流程。</p><ol><li><p>阅读测试输出，找到失败的测试</p></li><li><p>打开对应的测试文件，理解测试逻辑</p></li><li><p>打开被测试的代码，分析失败原因</p></li><li><p>决定是修复代码还是修复测试</p></li><li><p>修改，重新运行，验证</p></li></ol><p>这个过程短则十分钟，长则一小时。</p><p>那么能否构建一个测试修复 Agent，它能自动运行测试、分析失败原因、提出修复方案，甚至在获得确认后自动修复代码呢？这样一个曾经需要 30 分钟的修复工作，现在只需要 3 分钟的人工确认。</p><p>这一讲，我们就来构建这样一个 Agent。</p><h2 id="在-agent-中注入和使用自定义工具" tabindex="-1">在 Agent 中注入和使用自定义工具 <a class="header-anchor" href="#在-agent-中注入和使用自定义工具" aria-label="Permalink to &quot;在 Agent 中注入和使用自定义工具&quot;">​</a></h2><p>Claude Agent SDK 内置了文件操作、命令执行、网络搜索等工具。但在实际项目中，你往往需要领域特定的能力：</p><ul><li><p>查询数据库</p></li><li><p>调用内部 API</p></li><li><p>发送通知</p></li><li><p>执行特定的业务逻辑</p></li></ul><p>这就是自定义工具的价值，让 Agent 能够调用你定义的函数。SDK 的自定义工具本质上是运行在你应用进程内的 MCP 服务器。与需要单独进程的常规 MCP 服务器不同，SDK 工具直接在你的 Python 应用中运行，消除了进程管理和 IPC 开销。这种设计让工具调用的延迟极低，同时还能共享应用的内存空间和数据库连接池等资源。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/1c2c34c1594169400c375165df27bb35.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/1c2c34c1594169400c375165df27bb35.jpg" alt="图片"></a></p><p>上图中的架构就是 <strong>Agent → MCP Server → Tools 的三层解耦调用链</strong>。</p><p>左侧的 Agent（大模型 + 记忆 + 推理）并不直接调用具体工具，而是通过统一的 <code>tool_use</code> 请求，将意图表达为标准化的工具调用（如 <code>mcp__{server}__{tool}</code>）。中间的 MCP Server 相当于一个“工具路由中枢”，负责根据命名规范解析请求、完成权限控制与路由分发，并调用对应的工具函数。</p><p>右侧的各类自定义工具只专注于执行具体能力（如查询、搜索、发送等），执行完成后将结果返回给 MCP Server，再统一回传给 Agent。通过标准命名 + 中间层路由，实现 Agent 与工具的解耦、可扩展和可治理，从而让系统可以像“插 USB 设备”一样动态接入新能力。</p><h3 id="使用-tool-装饰器定义工具" tabindex="-1"><strong>使用 @tool 装饰器定义工具</strong> <a class="header-anchor" href="#使用-tool-装饰器定义工具" aria-label="Permalink to &quot;**使用 @tool 装饰器定义工具**&quot;">​</a></h3><p><code>@tool</code> 装饰器是定义自定义工具的最简单方式。你只需要指定工具名称、描述和参数，然后把业务逻辑写在函数体内。SDK 会自动将这个函数注册为一个可被 Agent 调用的工具，Agent 在推理过程中会根据工具描述决定何时调用它。</p><p>下面的例子定义了一个天气查询工具。注意返回值必须是包含 <code>content</code> 列表的字典，这是 MCP 协议要求的标准格式。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import tool</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;tool(</span></span>
<span class="line"><span>    name=&quot;get_weather&quot;,</span></span>
<span class="line"><span>    description=&quot;Get current weather for a city&quot;,</span></span>
<span class="line"><span>    parameters={&quot;city&quot;: str, &quot;units&quot;: str}</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>async def get_weather(args):</span></span>
<span class="line"><span>    city = args[&quot;city&quot;]</span></span>
<span class="line"><span>    units = args.get(&quot;units&quot;, &quot;celsius&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 调用天气 API（示例）</span></span>
<span class="line"><span>    weather = await fetch_weather_api(city, units)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        &quot;content&quot;: [</span></span>
<span class="line"><span>            {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: f&quot;Weather in {city}: {weather}&quot;}</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>下面是 <code>@tool</code> 装饰器的三个核心参数，每个参数都直接影响 Agent 的调用行为。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/86d2594dd9010e5ce9811553fd5dc782.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/86d2594dd9010e5ce9811553fd5dc782.jpg" alt="图片"></a></p><p>其中 <code>description</code> 尤为关键，它不是给人看的注释，而是给 AI 看的使用指南。写得清晰准确，Agent 才能在正确的时机调用正确的工具。</p><h3 id="创建-sdk-mcp-服务器承载工具" tabindex="-1"><strong>创建 SDK MCP 服务器承载工具</strong> <a class="header-anchor" href="#创建-sdk-mcp-服务器承载工具" aria-label="Permalink to &quot;**创建 SDK MCP 服务器承载工具**&quot;">​</a></h3><p>定义好工具函数之后，下一步是创建一个 MCP 服务器来承载它们。你可以把多个工具注册到同一个服务器中，服务器会统一管理这些工具的生命周期和调用路由。</p><p>下面的例子创建了一个包含两个工具的服务器。注意 <code>@tool</code> 装饰器的简写形式，当参数简单时，可以直接用位置参数传入名称、描述和参数字典。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import tool, create_sdk_mcp_server</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;tool(&quot;greet&quot;, &quot;Greet a user by name&quot;, {&quot;name&quot;: str})</span></span>
<span class="line"><span>async def greet_user(args):</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        &quot;content&quot;: [</span></span>
<span class="line"><span>            {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: f&quot;Hello, {args[&#39;name&#39;]}!&quot;}</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;tool(&quot;calculate&quot;, &quot;Perform a calculation&quot;, {&quot;expression&quot;: str})</span></span>
<span class="line"><span>async def calculate(args):</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        result = eval(args[&quot;expression&quot;])  # 生产环境请用安全的表达式解析器</span></span>
<span class="line"><span>        return {</span></span>
<span class="line"><span>            &quot;content&quot;: [</span></span>
<span class="line"><span>                {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: f&quot;Result: {result}&quot;}</span></span>
<span class="line"><span>            ]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        return {</span></span>
<span class="line"><span>            &quot;content&quot;: [</span></span>
<span class="line"><span>                {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: f&quot;Error: {e}&quot;}</span></span>
<span class="line"><span>            ],</span></span>
<span class="line"><span>            &quot;isError&quot;: True</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建 MCP 服务器</span></span>
<span class="line"><span>server = create_sdk_mcp_server(</span></span>
<span class="line"><span>    name=&quot;my-tools&quot;,</span></span>
<span class="line"><span>    version=&quot;1.0.0&quot;,</span></span>
<span class="line"><span>    tools=[greet_user, calculate]</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>服务器创建后，还不能直接使用。你需要把它注入到 Agent 的配置中，Agent 才能“看到”并调用这些工具。</p><h3 id="注入并使用自定义工具" tabindex="-1"><strong>注入并使用自定义工具</strong> <a class="header-anchor" href="#注入并使用自定义工具" aria-label="Permalink to &quot;**注入并使用自定义工具**&quot;">​</a></h3><p>将 MCP 服务器注入 Agent 的方式很直观，通过 <code>mcp_servers</code> 选项传入服务器实例，然后在 <code>allowed_tools</code> 中声明允许使用的工具。工具名称遵循 <code>mcp__{服务器名}__{工具名}</code> 的命名格式，这个双下划线的命名规则确保了不同服务器之间的工具名不会冲突。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    mcp_servers={&quot;tools&quot;: server},</span></span>
<span class="line"><span>    # 工具名称格式：mcp__{服务器名}__{工具名}</span></span>
<span class="line"><span>    allowed_tools=[</span></span>
<span class="line"><span>        &quot;mcp__tools__greet&quot;,</span></span>
<span class="line"><span>        &quot;mcp__tools__calculate&quot;</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>    await client.query(&quot;Say hello to Alice and calculate 2 + 3 * 4&quot;)</span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        print(msg)</span></span></code></pre></div><p>当 Agent 收到上面的提示时，它会自动识别出需要调用两个工具：先用 <code>greet</code> 向 Alice 打招呼，再用 <code>calculate</code> 计算表达式。这种自动编排能力正是 Agent SDK 的核心价值。</p><h3 id="使用-pydantic-进行参数验证" tabindex="-1"><strong>使用 Pydantic 进行参数验证</strong> <a class="header-anchor" href="#使用-pydantic-进行参数验证" aria-label="Permalink to &quot;**使用 Pydantic 进行参数验证**&quot;">​</a></h3><p>对于简单工具，字典式参数定义已经够用。但当参数变得复杂——比如有默认值、范围限制、可选字段时，Pydantic 模型是更好的选择。它不仅提供自动验证，还能生成更详细的 JSON Schema 供 Agent 参考，从而提高参数传递的准确性。</p><p>下面的例子定义了一个数据库查询工具。Pydantic 模型中的 <code>Field</code> 描述会被自动转换为工具参数说明， <code>ge</code> 和 <code>le</code> 约束则确保 Agent 传入的 <code>limit</code> 值在合理范围内。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from pydantic import BaseModel, Field</span></span>
<span class="line"><span>from claude_agent_sdk import tool</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class DatabaseQueryParams(BaseModel):</span></span>
<span class="line"><span>    &quot;&quot;&quot;数据库查询参数&quot;&quot;&quot;</span></span>
<span class="line"><span>    table: str = Field(..., description=&quot;Table name&quot;)</span></span>
<span class="line"><span>    columns: list[str] = Field(default=[&quot;*&quot;], description=&quot;Columns to select&quot;)</span></span>
<span class="line"><span>    where: str | None = Field(default=None, description=&quot;WHERE clause&quot;)</span></span>
<span class="line"><span>    limit: int = Field(default=100, ge=1, le=1000, description=&quot;Max rows&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;tool(</span></span>
<span class="line"><span>    name=&quot;query_database&quot;,</span></span>
<span class="line"><span>    description=&quot;Execute a SELECT query on the database&quot;,</span></span>
<span class="line"><span>    parameters=DatabaseQueryParams</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>async def query_database(args: DatabaseQueryParams):</span></span>
<span class="line"><span>    # args 已经通过 Pydantic 验证</span></span>
<span class="line"><span>    query = f&quot;SELECT {&#39;, &#39;.join(args.columns)} FROM {args.table}&quot;</span></span>
<span class="line"><span>    if args.where:</span></span>
<span class="line"><span>        query += f&quot; WHERE {args.where}&quot;</span></span>
<span class="line"><span>    query += f&quot; LIMIT {args.limit}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 执行查询</span></span>
<span class="line"><span>    results = await db.execute(query)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        &quot;content&quot;: [</span></span>
<span class="line"><span>            {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: f&quot;Query: {query}\\nResults: {results}&quot;}</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/32f886b2b38431abcfb036baf52b69ae.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/32f886b2b38431abcfb036baf52b69ae.jpg" alt="图片"></a></p><p>下面是一个存在 SQL 注入风险的工具调用示例以及相应的调整。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 危险：直接执行 SQL</span></span>
<span class="line"><span>&amp;#64;tool(&quot;run_sql&quot;, &quot;Run any SQL&quot;, {&quot;sql&quot;: str})</span></span>
<span class="line"><span>async def run_sql(args):</span></span>
<span class="line"><span>    return await db.execute(args[&quot;sql&quot;])  # SQL 注入风险！</span></span></code></pre></div><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 安全：限制操作类型</span></span>
<span class="line"><span>&amp;#64;tool(&quot;query_users&quot;, &quot;Query user table&quot;, {&quot;user_id&quot;: int})</span></span>
<span class="line"><span>async def query_users(args):</span></span>
<span class="line"><span>    return await db.execute(</span></span>
<span class="line"><span>        &quot;SELECT * FROM users WHERE id = ?&quot;,</span></span>
<span class="line"><span>        [args[&quot;user_id&quot;]]</span></span>
<span class="line"><span>    )</span></span></code></pre></div><p>这个安全示例的核心在于， <strong>不要把工具当“能力接口”，而要当“受控权限边界”来设计</strong>。</p><p>危险版本把任意 SQL 执行权直接暴露给 Agent，相当于让一个不完全可信的系统拥有数据库 root 权限，一旦被误导或注入就可能造成严重破坏；而安全版本通过限制操作范围（只允许查询特定表）、使用参数化查询、防止注入，并对参数进行类型约束，把“无限能力”收敛为“可控动作”。本质上，这体现的是 Agent 系统的一个关键原则， <strong>模型可以自由推理，但工具必须严格受限</strong>。</p><h2 id="agent-sdk-hooks-系统概述" tabindex="-1">Agent SDK Hooks 系统概述 <a class="header-anchor" href="#agent-sdk-hooks-系统概述" aria-label="Permalink to &quot;Agent SDK Hooks 系统概述&quot;">​</a></h2><p>Hooks 让你能够在 Agent 执行的各个阶段插入自定义逻辑。如果说自定义工具是扩展了 Agent 能做什么，那么 Hooks 就是控制 Agent 怎么做。它们提供对 Agent 行为的确定性控制——不是建议 Agent 遵守某个规则，而是在系统层面强制执行。</p><p>下表列出了 SDK 支持的所有 Hook 事件。每个事件对应 Agent 执行流程中的一个关键节点，你可以在这些节点插入安全检查、日志记录、数据转换等逻辑。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/693575fbf72a41fa657f82a55f3091a5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/693575fbf72a41fa657f82a55f3091a5.jpg" alt="图片"></a></p><h3 id="pretooluse-hook-执行前拦截" tabindex="-1"><strong>PreToolUse Hook：执行前拦截</strong> <a class="header-anchor" href="#pretooluse-hook-执行前拦截" aria-label="Permalink to &quot;**PreToolUse Hook：执行前拦截**&quot;">​</a></h3><p>PreToolUse 是最常用的 Hook，它在工具执行前触发。你可以在这里做三件事，允许执行、拒绝执行、或修改输入参数。这给了你对 Agent 行为的完全控制权。</p><p>下面的例子展示了一个 Bash 命令安全检查器。它会拦截所有 Bash 工具调用，检查命令是否包含危险模式（如 <code>rm -rf</code>、 <code>sudo</code>），如果发现危险则拒绝执行。对于不在白名单中的命令，它会要求用户手动确认。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeAgentOptions, HookMatcher</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def check_bash_command(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;检查 Bash 命令是否安全&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = input_data[&quot;tool_name&quot;]</span></span>
<span class="line"><span>    tool_input = input_data[&quot;tool_input&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if tool_name == &quot;Bash&quot;:</span></span>
<span class="line"><span>        command = tool_input.get(&quot;command&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 阻止危险命令</span></span>
<span class="line"><span>        dangerous_patterns = [&quot;rm -rf&quot;, &quot;sudo&quot;, &quot;chmod 777&quot;, &quot;&amp;gt; /dev/&quot;]</span></span>
<span class="line"><span>        for pattern in dangerous_patterns:</span></span>
<span class="line"><span>            if pattern in command:</span></span>
<span class="line"><span>                return {</span></span>
<span class="line"><span>                    &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>                        &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>                        &quot;permissionDecision&quot;: &quot;deny&quot;,</span></span>
<span class="line"><span>                        &quot;permissionDecisionReason&quot;: f&quot;Blocked dangerous command: {pattern}&quot;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 只允许特定命令</span></span>
<span class="line"><span>        allowed_prefixes = [&quot;npm&quot;, &quot;python&quot;, &quot;git&quot;, &quot;pytest&quot;, &quot;ls&quot;, &quot;cat&quot;]</span></span>
<span class="line"><span>        if not any(command.strip().startswith(p) for p in allowed_prefixes):</span></span>
<span class="line"><span>            return {</span></span>
<span class="line"><span>                &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>                    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>                    &quot;permissionDecision&quot;: &quot;ask&quot;,</span></span>
<span class="line"><span>                    &quot;permissionDecisionReason&quot;: f&quot;Command requires approval: {command}&quot;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {}  # 允许执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    hooks={</span></span>
<span class="line"><span>        &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;Bash&quot;, hooks=[check_bash_command])</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>注意 <code>HookMatcher</code> 的 <code>matcher</code> 参数，它指定这个 Hook 只对 <code>Bash</code> 工具生效。你也可以用 <code>&quot;*&quot;</code> 来匹配所有工具。</p><h3 id="pretooluse-hook-修改输入参数" tabindex="-1"><strong>PreToolUse Hook：修改输入参数</strong> <a class="header-anchor" href="#pretooluse-hook-修改输入参数" aria-label="Permalink to &quot;**PreToolUse Hook：修改输入参数**&quot;">​</a></h3><p>从 Claude Code v2.0.10 开始，PreToolUse Hook 获得了一个强大的新能力——修改工具输入。这意味着你可以在工具执行前对参数进行转换、规范化或补充，而 Agent 对此完全无感知。</p><p>一个典型的应用场景是路径规范化。Agent 生成的文件路径有时是相对路径，但你的工具可能要求绝对路径。通过 PreToolUse Hook，你可以在调用发生前自动完成转换，避免工具报错。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async def normalize_file_paths(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;规范化文件路径&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = input_data[&quot;tool_name&quot;]</span></span>
<span class="line"><span>    tool_input = input_data[&quot;tool_input&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if tool_name in [&quot;Read&quot;, &quot;Write&quot;, &quot;Edit&quot;]:</span></span>
<span class="line"><span>        file_path = tool_input.get(&quot;file_path&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 将相对路径转为绝对路径</span></span>
<span class="line"><span>        if not file_path.startswith(&quot;/&quot;):</span></span>
<span class="line"><span>            import os</span></span>
<span class="line"><span>            absolute_path = os.path.abspath(file_path)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            return {</span></span>
<span class="line"><span>                &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>                    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>                    &quot;permissionDecision&quot;: &quot;allow&quot;,</span></span>
<span class="line"><span>                    &quot;updatedInput&quot;: {</span></span>
<span class="line"><span>                        **tool_input,</span></span>
<span class="line"><span>                        &quot;file_path&quot;: absolute_path</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    hooks={</span></span>
<span class="line"><span>        &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;*&quot;, hooks=[normalize_file_paths])</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>返回值中的 <code>updatedInput</code> 字段就是修改后的工具输入。SDK 会用它替换原始输入，然后继续执行工具。</p><h3 id="posttooluse-hook-执行后处理" tabindex="-1"><strong>PostToolUse Hook：执行后处理</strong> <a class="header-anchor" href="#posttooluse-hook-执行后处理" aria-label="Permalink to &quot;**PostToolUse Hook：执行后处理**&quot;">​</a></h3><p>PostToolUse 在工具执行成功后触发，适合做日志记录、结果格式化、自动化后处理等工作。与 PreToolUse 不同，PostToolUse 无法改变已经发生的工具调用，但它可以基于调用结果执行额外操作。</p><p>下面展示了两个实用的 PostToolUse Hook。第一个记录所有工具的使用日志，用于审计和调试。第二个在文件写入后自动运行代码格式化工具，确保 Agent 生成的代码符合团队代码风格规范。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import logging</span></span>
<span class="line"><span>from datetime import datetime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>logger = logging.getLogger(__name__)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def log_tool_usage(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;记录工具使用日志&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = input_data[&quot;tool_name&quot;]</span></span>
<span class="line"><span>    tool_input = input_data.get(&quot;tool_input&quot;, {})</span></span>
<span class="line"><span>    tool_response = input_data.get(&quot;tool_response&quot;, {})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    logger.info(f&quot;[{datetime.now().isoformat()}] Tool: {tool_name}&quot;)</span></span>
<span class="line"><span>    logger.info(f&quot;  Input: {tool_input}&quot;)</span></span>
<span class="line"><span>    logger.info(f&quot;  Response: {str(tool_response)[:200]}...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def auto_format_code(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;文件写入后自动格式化&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = input_data[&quot;tool_name&quot;]</span></span>
<span class="line"><span>    tool_input = input_data.get(&quot;tool_input&quot;, {})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if tool_name in [&quot;Write&quot;, &quot;Edit&quot;]:</span></span>
<span class="line"><span>        file_path = tool_input.get(&quot;file_path&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 根据文件类型运行格式化</span></span>
<span class="line"><span>        if file_path.endswith(&quot;.py&quot;):</span></span>
<span class="line"><span>            import subprocess</span></span>
<span class="line"><span>            subprocess.run([&quot;black&quot;, file_path], capture_output=True)</span></span>
<span class="line"><span>        elif file_path.endswith((&quot;.ts&quot;, &quot;.js&quot;)):</span></span>
<span class="line"><span>            import subprocess</span></span>
<span class="line"><span>            subprocess.run([&quot;prettier&quot;, &quot;--write&quot;, file_path], capture_output=True)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    hooks={</span></span>
<span class="line"><span>        &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;*&quot;, hooks=[log_tool_usage]),</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;Write&quot;, hooks=[auto_format_code]),</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;Edit&quot;, hooks=[auto_format_code])</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>自动格式化这个 Hook 特别实用。Agent 生成的代码虽然逻辑正确，但缩进、换行、引号风格可能不符合项目规范。有了这个 Hook，你再也不需要手动跑格式化了。</p><h3 id="canusetool-回调-运行时权限控制" tabindex="-1"><strong>canUseTool 回调：运行时权限控制</strong> <a class="header-anchor" href="#canusetool-回调-运行时权限控制" aria-label="Permalink to &quot;**canUseTool 回调：运行时权限控制**&quot;">​</a></h3><p>除了 Hooks，SDK 还提供了 <code>canUseTool</code> 回调作为另一种权限控制方式。它比 Hooks 更简单，只负责回答一个问题：“这个工具调用是否被允许？”不涉及输入修改、日志记录等复杂逻辑，适合纯粹的权限判断场景。</p><p>下面的例子展示了一个保护敏感文件和限制网络操作的 <code>canUseTool</code> 回调。当 Agent 试图读写受保护的文件或执行网络命令时，回调会返回拒绝并附带原因说明。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 受保护的文件列表</span></span>
<span class="line"><span>PROTECTED_FILES = [</span></span>
<span class="line"><span>    &quot;.env&quot;,</span></span>
<span class="line"><span>    &quot;secrets.json&quot;,</span></span>
<span class="line"><span>    &quot;config/production.yaml&quot;,</span></span>
<span class="line"><span>    &quot;database/migrations/&quot;</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def can_use_tool(tool_name: str, tool_input: dict) -&amp;gt; dict:</span></span>
<span class="line"><span>    &quot;&quot;&quot;运行时权限检查&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 检查文件操作</span></span>
<span class="line"><span>    if tool_name in [&quot;Write&quot;, &quot;Edit&quot;, &quot;Read&quot;]:</span></span>
<span class="line"><span>        file_path = tool_input.get(&quot;file_path&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for protected in PROTECTED_FILES:</span></span>
<span class="line"><span>            if protected in file_path:</span></span>
<span class="line"><span>                return {</span></span>
<span class="line"><span>                    &quot;allowed&quot;: False,</span></span>
<span class="line"><span>                    &quot;reason&quot;: f&quot;Access to {protected} is not allowed&quot;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 检查 Bash 命令</span></span>
<span class="line"><span>    if tool_name == &quot;Bash&quot;:</span></span>
<span class="line"><span>        command = tool_input.get(&quot;command&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 禁止网络操作</span></span>
<span class="line"><span>        network_commands = [&quot;curl&quot;, &quot;wget&quot;, &quot;nc&quot;, &quot;ssh&quot;]</span></span>
<span class="line"><span>        for cmd in network_commands:</span></span>
<span class="line"><span>            if cmd in command:</span></span>
<span class="line"><span>                return {</span></span>
<span class="line"><span>                    &quot;allowed&quot;: False,</span></span>
<span class="line"><span>                    &quot;reason&quot;: f&quot;Network command &#39;{cmd}&#39; is not allowed&quot;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {&quot;allowed&quot;: True}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    can_use_tool=can_use_tool</span></span>
<span class="line"><span>)</span></span></code></pre></div><h3 id="hooks-与-canusetool-的选择" tabindex="-1">Hooks 与 canUseTool 的选择 <a class="header-anchor" href="#hooks-与-canusetool-的选择" aria-label="Permalink to &quot;Hooks 与 canUseTool 的选择&quot;">​</a></h3><p>Hooks 和 canUseTool 都能控制工具的使用权限，但它们的能力范围差异很大。理解这个差异对于选择合适的机制至关重要。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/6cf0452a683f7fc998656ab0182be042.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/6cf0452a683f7fc998656ab0182be042.jpg" alt=""></a></p><p>简单来说，只需要权限检查，用 <code>canUseTool</code>；需要修改输入、记录日志、执行后处理，用 Hooks。在实际项目中，两者经常配合使用， <code>canUseTool</code> 负责快速的权限判断，Hooks 负责更复杂的拦截和处理逻辑。</p><h2 id="agent-sdk-权限管理-四道防线" tabindex="-1">Agent SDK 权限管理：四道防线 <a class="header-anchor" href="#agent-sdk-权限管理-四道防线" aria-label="Permalink to &quot;Agent SDK 权限管理：四道防线&quot;">​</a></h2><p>安全是构建生产级 Agent 的核心议题。Agent SDK 提供了四种互补的权限控制机制， <strong>权限模式、canUseTool 回调、Hooks、settings.json 中的权限规则。</strong> 它们构成了一个分层防御体系。</p><p>让我逐一介绍这四道防线。</p><h3 id="权限模式-全局基调" tabindex="-1"><strong>权限模式：全局基调</strong> <a class="header-anchor" href="#权限模式-全局基调" aria-label="Permalink to &quot;**权限模式：全局基调**&quot;">​</a></h3><p>权限模式是最粗粒度的控制，它设定了整个会话的安全基调。一共有四种模式可选，从宽松到严格，你需要根据使用场景选择合适的模式。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    permission_mode=&quot;acceptEdits&quot;  # 自动接受文件编辑</span></span>
<span class="line"><span>)</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/5953eba4afcb0ab4ce98fdacc54032be.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/5953eba4afcb0ab4ce98fdacc54032be.jpg" alt="图片"></a></p><h3 id="工具白名单与黑名单" tabindex="-1"><strong>工具白名单与黑名单</strong> <a class="header-anchor" href="#工具白名单与黑名单" aria-label="Permalink to &quot;**工具白名单与黑名单**&quot;">​</a></h3><p>第二道防线是工具级别的准入控制。通过 <code>allowed_tools</code> 和 <code>disallowed_tools</code>，你可以精确控制 Agent 能使用哪些工具。这比权限模式更细粒度，你可以允许文件读取但禁止网络搜索，或者只允许运行特定的 Bash 命令。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    # 只允许这些工具</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Grep&quot;, &quot;Glob&quot;, &quot;Bash(pytest:*)&quot;],</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 禁用这些工具</span></span>
<span class="line"><span>    disallowed_tools=[&quot;Task&quot;, &quot;WebSearch&quot;]</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>注意 <code>Bash(pytest:*)</code> 这个语法，它表示只允许以 <code>pytest</code> 开头的 Bash 命令。这种细粒度的 Bash 命令过滤是生产环境中非常实用的安全特性。</p><p>第三道防线是运行时 <strong>动态权限检查（</strong> <code>canUseTool</code> <strong>）</strong>，第四道防线是最 <strong>细粒度的 Hooks 控制</strong>。它们的工作原理在前面已经详细讲解过，这里不再赘述。</p><p>在实际项目中，这四道防线应该配合使用，形成纵深防御。下面的代码展示了一个完整的四层安全配置。请注意每一层防线各司其职：权限模式设定基调，白名单限制工具集， <code>canUseTool</code> 保护敏感资源，Hooks 提供细粒度控制和审计。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    # 第一道：权限模式</span></span>
<span class="line"><span>    permission_mode=&quot;acceptEdits&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 第二道：工具白名单</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Write&quot;, &quot;Edit&quot;, &quot;Bash&quot;, &quot;Grep&quot;, &quot;Glob&quot;],</span></span>
<span class="line"><span>    disallowed_tools=[&quot;WebSearch&quot;],  # 禁止网络搜索</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 第三道：运行时检查</span></span>
<span class="line"><span>    can_use_tool=can_use_tool,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 第四道：Hooks</span></span>
<span class="line"><span>    hooks={</span></span>
<span class="line"><span>        &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;Bash&quot;, hooks=[check_bash_command]),</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;*&quot;, hooks=[log_all_tools])</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>        &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;Write&quot;, hooks=[auto_format])</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span></code></pre></div><h2 id="流式会话-为什么以及怎么用" tabindex="-1">流式会话：为什么以及怎么用 <a class="header-anchor" href="#流式会话-为什么以及怎么用" aria-label="Permalink to &quot;流式会话：为什么以及怎么用&quot;">​</a></h2><p>到目前为止，我们的示例都使用的是单次查询模式——发送一个请求，接收一个响应。但在生产环境中，你往往需要多轮对话、中途干预、动态调整参数。这就是流式会话（Streaming Session）的价值。流式输入模式是使用 Claude Agent SDK 的首选方式。它允许 Agent 作为长时间运行的进程，接收用户输入、处理中断、显示权限请求、管理会话。</p><p>下表清晰展示了两种模式的差异。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/df1200f2e19b515bf88b5ded19184456.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/df1200f2e19b515bf88b5ded19184456.jpg" alt="图片"></a></p><p>流式会话的核心优势是保持上下文。在同一个 <code>async with</code> 块内，你可以发送多次查询，每次查询都能“看到”之前的对话历史。这让 Agent 能够执行复杂的多步骤任务，而不需要你手动管理上下文。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def streaming_session():</span></span>
<span class="line"><span>    options = ClaudeAgentOptions(</span></span>
<span class="line"><span>        allowed_tools=[&quot;Read&quot;, &quot;Write&quot;, &quot;Bash&quot;],</span></span>
<span class="line"><span>        permission_mode=&quot;default&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>        # 第一轮对话</span></span>
<span class="line"><span>        await client.query(&quot;列出当前目录的 Python 文件&quot;)</span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;text&quot;:</span></span>
<span class="line"><span>                print(msg.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 继续对话（保持上下文）</span></span>
<span class="line"><span>        await client.query(&quot;分析第一个文件的代码质量&quot;)</span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;text&quot;:</span></span>
<span class="line"><span>                print(msg.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 再次继续</span></span>
<span class="line"><span>        await client.query(&quot;修复发现的问题&quot;)</span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            print(msg)</span></span></code></pre></div><p>这三轮对话共享同一个会话上下文。Agent 在第二轮能引用第一轮列出的文件，在第三轮能基于第二轮的分析结果执行修复。</p><h3 id="处理权限请求" tabindex="-1"><strong>处理权限请求</strong> <a class="header-anchor" href="#处理权限请求" aria-label="Permalink to &quot;**处理权限请求**&quot;">​</a></h3><p>在流式模式中，当 Agent 试图执行需要权限的操作时，SDK 不会自动处理，而是将权限请求发送给你的代码。你可以根据工具类型、命令内容等信息做出自动决策，也可以将决策权交给用户。</p><p>下面的例子展示了一种混合策略：对于测试命令自动批准，对于其他命令则询问用户。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async def handle_permission_request(request):</span></span>
<span class="line"><span>    &quot;&quot;&quot;处理权限请求&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = request.get(&quot;tool_name&quot;)</span></span>
<span class="line"><span>    tool_input = request.get(&quot;tool_input&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print(f&quot;\\nPermission Request:&quot;)</span></span>
<span class="line"><span>    print(f&quot;   Tool: {tool_name}&quot;)</span></span>
<span class="line"><span>    print(f&quot;   Input: {tool_input}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 自动决策或询问用户</span></span>
<span class="line"><span>    if tool_name == &quot;Bash&quot;:</span></span>
<span class="line"><span>        command = tool_input.get(&quot;command&quot;, &quot;&quot;)</span></span>
<span class="line"><span>        if command.startswith(&quot;npm test&quot;) or command.startswith(&quot;pytest&quot;):</span></span>
<span class="line"><span>            return {&quot;approved&quot;: True}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 询问用户</span></span>
<span class="line"><span>    response = input(&quot;   Approve? (y/n): &quot;)</span></span>
<span class="line"><span>    return {&quot;approved&quot;: response.lower() == &quot;y&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>    await client.query(&quot;运行测试并修复失败的测试&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        if msg.type == &quot;permission_request&quot;:</span></span>
<span class="line"><span>            decision = await handle_permission_request(msg)</span></span>
<span class="line"><span>            await client.respond_to_permission(msg.id, decision)</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            print(msg)</span></span></code></pre></div><h3 id="中断和取消" tabindex="-1"><strong>中断和取消</strong> <a class="header-anchor" href="#中断和取消" aria-label="Permalink to &quot;**中断和取消**&quot;">​</a></h3><p>流式会话支持在任意时刻中断 Agent 的执行。这在 Agent 陷入无意义循环、执行时间过长、或用户改变主意时非常有用。调用 <code>client.interrupt()</code> 后，Agent 会停止当前操作，但会话上下文仍然保留，你可以继续发送新的查询。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import asyncio</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def interruptible_session():</span></span>
<span class="line"><span>    async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>        await client.query(&quot;分析整个代码库&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            async for msg in client.receive_response():</span></span>
<span class="line"><span>                print(msg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                # 检查是否需要中断</span></span>
<span class="line"><span>                if should_interrupt():</span></span>
<span class="line"><span>                    await client.interrupt()</span></span>
<span class="line"><span>                    print(&quot;Task interrupted by user&quot;)</span></span>
<span class="line"><span>                    break</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except asyncio.CancelledError:</span></span>
<span class="line"><span>            print(&quot;Session cancelled&quot;)</span></span></code></pre></div><h3 id="动态切换设置" tabindex="-1"><strong>动态切换设置</strong> <a class="header-anchor" href="#动态切换设置" aria-label="Permalink to &quot;**动态切换设置**&quot;">​</a></h3><p>流式模式还有一个独特的能力：在会话中途动态切换设置。最典型的场景是“先分析后执行”模式，先用只读模式让 Agent 分析问题并制定计划，用户确认后再切换到可编辑模式执行修改。这种两阶段工作流在生产环境中非常常见，它既保证了安全性，又保持了效率。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>    # 开始时使用只读模式</span></span>
<span class="line"><span>    await client.update_options(permission_mode=&quot;planMode&quot;)</span></span>
<span class="line"><span>    await client.query(&quot;分析代码并制定修复计划&quot;)</span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        print(msg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 用户确认后，切换到可编辑模式</span></span>
<span class="line"><span>    await client.update_options(permission_mode=&quot;acceptEdits&quot;)</span></span>
<span class="line"><span>    await client.query(&quot;执行刚才的修复计划&quot;)</span></span>
<span class="line"><span>    async for msg in client.receive_response():</span></span>
<span class="line"><span>        print(msg)</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/b02f59d405e34c7805dfyy247a70d727.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/b02f59d405e34c7805dfyy247a70d727.jpg" alt=""></a></p><h2 id="实战项目-自动化测试修复-agent" tabindex="-1">实战项目：自动化测试修复 Agent <a class="header-anchor" href="#实战项目-自动化测试修复-agent" aria-label="Permalink to &quot;实战项目：自动化测试修复 Agent&quot;">​</a></h2><p>现在，让我们把前面学到的所有高级特性组合起来，构建开篇故事中的测试修复 Agent。这个项目会用到自定义工具（运行测试）、Hooks（安全控制）、流式会话（两阶段工作流）和四层权限管理。</p><p>这个项目的项目需求是构建一个 Agent来完成下面的任务。</p><ol><li><p>运行测试套件，捕获失败信息</p></li><li><p>分析失败原因</p></li><li><p>提出修复方案</p></li><li><p>在确认后执行修复</p></li><li><p>重新运行测试验证</p></li></ol><h3 id="自定义工具-测试运行器" tabindex="-1"><strong>自定义工具：测试运行器</strong> <a class="header-anchor" href="#自定义工具-测试运行器" aria-label="Permalink to &quot;**自定义工具：测试运行器**&quot;">​</a></h3><p>首先，我们需要一个能够运行测试并返回结构化结果的自定义工具。这个工具会调用 pytest，解析 JSON 报告，提取失败测试的详细信息（测试名称、错误信息），然后以标准 MCP 格式返回给 Agent。</p><p>Agent 拿到这些结构化数据后，就能精确定位需要分析的文件和代码行。</p><p>我们还额外定义了一个 <code>get_test_history</code> 工具，用于查询最近的测试运行历史。这能帮助 Agent 判断测试失败是偶发性的还是持续性的，从而做出更准确的修复决策。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import tool, create_sdk_mcp_server</span></span>
<span class="line"><span>import subprocess</span></span>
<span class="line"><span>import json</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;tool(</span></span>
<span class="line"><span>    name=&quot;run_tests&quot;,</span></span>
<span class="line"><span>    description=&quot;Run the test suite and return results&quot;,</span></span>
<span class="line"><span>    parameters={</span></span>
<span class="line"><span>        &quot;test_path&quot;: str,  # 可选：指定测试路径</span></span>
<span class="line"><span>        &quot;verbose&quot;: bool    # 可选：详细输出</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>async def run_tests(args):</span></span>
<span class="line"><span>    &quot;&quot;&quot;运行 pytest 测试&quot;&quot;&quot;</span></span>
<span class="line"><span>    test_path = args.get(&quot;test_path&quot;, &quot;tests/&quot;)</span></span>
<span class="line"><span>    verbose = args.get(&quot;verbose&quot;, False)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cmd = [&quot;pytest&quot;, test_path, &quot;--tb=short&quot;, &quot;-q&quot;]</span></span>
<span class="line"><span>    if verbose:</span></span>
<span class="line"><span>        cmd.append(&quot;-v&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 添加 JSON 输出</span></span>
<span class="line"><span>    cmd.extend([&quot;--json-report&quot;, &quot;--json-report-file=test-results.json&quot;])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        result = subprocess.run(</span></span>
<span class="line"><span>            cmd,</span></span>
<span class="line"><span>            capture_output=True,</span></span>
<span class="line"><span>            text=True,</span></span>
<span class="line"><span>            timeout=300  # 5 分钟超时</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 读取 JSON 报告</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            with open(&quot;test-results.json&quot;) as f:</span></span>
<span class="line"><span>                report = json.load(f)</span></span>
<span class="line"><span>        except:</span></span>
<span class="line"><span>            report = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        output = {</span></span>
<span class="line"><span>            &quot;stdout&quot;: result.stdout,</span></span>
<span class="line"><span>            &quot;stderr&quot;: result.stderr,</span></span>
<span class="line"><span>            &quot;return_code&quot;: result.returncode,</span></span>
<span class="line"><span>            &quot;success&quot;: result.returncode == 0</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if report:</span></span>
<span class="line"><span>            output[&quot;summary&quot;] = {</span></span>
<span class="line"><span>                &quot;total&quot;: report.get(&quot;summary&quot;, {}).get(&quot;total&quot;, 0),</span></span>
<span class="line"><span>                &quot;passed&quot;: report.get(&quot;summary&quot;, {}).get(&quot;passed&quot;, 0),</span></span>
<span class="line"><span>                &quot;failed&quot;: report.get(&quot;summary&quot;, {}).get(&quot;failed&quot;, 0),</span></span>
<span class="line"><span>                &quot;errors&quot;: report.get(&quot;summary&quot;, {}).get(&quot;errors&quot;, 0)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            output[&quot;failed_tests&quot;] = [</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    &quot;name&quot;: t[&quot;nodeid&quot;],</span></span>
<span class="line"><span>                    &quot;message&quot;: t.get(&quot;call&quot;, {}).get(&quot;longrepr&quot;, &quot;&quot;)</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                for t in report.get(&quot;tests&quot;, [])</span></span>
<span class="line"><span>                if t.get(&quot;outcome&quot;) == &quot;failed&quot;</span></span>
<span class="line"><span>            ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return {</span></span>
<span class="line"><span>            &quot;content&quot;: [</span></span>
<span class="line"><span>                {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: json.dumps(output, indent=2)}</span></span>
<span class="line"><span>            ]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except subprocess.TimeoutExpired:</span></span>
<span class="line"><span>        return {</span></span>
<span class="line"><span>            &quot;content&quot;: [</span></span>
<span class="line"><span>                {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: &quot;Error: Test execution timed out after 5 minutes&quot;}</span></span>
<span class="line"><span>            ],</span></span>
<span class="line"><span>            &quot;isError&quot;: True</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        return {</span></span>
<span class="line"><span>            &quot;content&quot;: [</span></span>
<span class="line"><span>                {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: f&quot;Error running tests: {e}&quot;}</span></span>
<span class="line"><span>            ],</span></span>
<span class="line"><span>            &quot;isError&quot;: True</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;tool(</span></span>
<span class="line"><span>    name=&quot;get_test_history&quot;,</span></span>
<span class="line"><span>    description=&quot;Get recent test run history&quot;,</span></span>
<span class="line"><span>    parameters={&quot;limit&quot;: int}</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>async def get_test_history(args):</span></span>
<span class="line"><span>    &quot;&quot;&quot;获取测试历史（示例实现）&quot;&quot;&quot;</span></span>
<span class="line"><span>    limit = args.get(&quot;limit&quot;, 5)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 实际实现中，这里会从数据库或日志读取</span></span>
<span class="line"><span>    history = [</span></span>
<span class="line"><span>        {&quot;timestamp&quot;: &quot;2025-01-18 10:00&quot;, &quot;passed&quot;: 198, &quot;failed&quot;: 2},</span></span>
<span class="line"><span>        {&quot;timestamp&quot;: &quot;2025-01-18 09:30&quot;, &quot;passed&quot;: 200, &quot;failed&quot;: 0},</span></span>
<span class="line"><span>        {&quot;timestamp&quot;: &quot;2025-01-18 09:00&quot;, &quot;passed&quot;: 195, &quot;failed&quot;: 5}</span></span>
<span class="line"><span>    ][:limit]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        &quot;content&quot;: [</span></span>
<span class="line"><span>            {&quot;type&quot;: &quot;text&quot;, &quot;text&quot;: json.dumps(history, indent=2)}</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建测试工具服务器</span></span>
<span class="line"><span>test_tools_server = create_sdk_mcp_server(</span></span>
<span class="line"><span>    name=&quot;test-tools&quot;,</span></span>
<span class="line"><span>    version=&quot;1.0.0&quot;,</span></span>
<span class="line"><span>    tools=[run_tests, get_test_history]</span></span>
<span class="line"><span>)</span></span></code></pre></div><h3 id="hooks-配置-安全控制" tabindex="-1"><strong>Hooks 配置：安全控制</strong> <a class="header-anchor" href="#hooks-配置-安全控制" aria-label="Permalink to &quot;**Hooks 配置：安全控制**&quot;">​</a></h3><p>测试修复 Agent 需要修改源代码文件，这是一个高风险操作。我们通过 Hooks 实现两个关键的安全控制：第一，限制 Agent 只能修改 <code>tests/</code>、 <code>src/</code>、 <code>lib/</code> 目录下的文件，禁止修改 <code>setup.py</code>、 <code>pyproject.toml</code> 等项目配置文件；第二，记录所有文件修改操作到日志文件，便于事后审计和回滚。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 允许修改的文件模式</span></span>
<span class="line"><span>ALLOWED_EDIT_PATTERNS = [</span></span>
<span class="line"><span>    &quot;tests/&quot;,</span></span>
<span class="line"><span>    &quot;src/&quot;,</span></span>
<span class="line"><span>    &quot;lib/&quot;</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 禁止修改的文件</span></span>
<span class="line"><span>FORBIDDEN_FILES = [</span></span>
<span class="line"><span>    &quot;setup.py&quot;,</span></span>
<span class="line"><span>    &quot;pyproject.toml&quot;,</span></span>
<span class="line"><span>    &quot;requirements.txt&quot;,</span></span>
<span class="line"><span>    &quot;.github/&quot;,</span></span>
<span class="line"><span>    &quot;conftest.py&quot;</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def check_file_modification(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;检查文件修改权限&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = input_data[&quot;tool_name&quot;]</span></span>
<span class="line"><span>    tool_input = input_data[&quot;tool_input&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if tool_name in [&quot;Write&quot;, &quot;Edit&quot;]:</span></span>
<span class="line"><span>        file_path = tool_input.get(&quot;file_path&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 检查禁止列表</span></span>
<span class="line"><span>        for forbidden in FORBIDDEN_FILES:</span></span>
<span class="line"><span>            if forbidden in file_path:</span></span>
<span class="line"><span>                return {</span></span>
<span class="line"><span>                    &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>                        &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>                        &quot;permissionDecision&quot;: &quot;deny&quot;,</span></span>
<span class="line"><span>                        &quot;permissionDecisionReason&quot;: f&quot;Modification of {forbidden} is not allowed&quot;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 检查允许列表</span></span>
<span class="line"><span>        allowed = any(file_path.startswith(p) for p in ALLOWED_EDIT_PATTERNS)</span></span>
<span class="line"><span>        if not allowed:</span></span>
<span class="line"><span>            return {</span></span>
<span class="line"><span>                &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>                    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>                    &quot;permissionDecision&quot;: &quot;ask&quot;,</span></span>
<span class="line"><span>                    &quot;permissionDecisionReason&quot;: f&quot;File {file_path} is outside allowed directories&quot;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def log_modifications(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;记录所有修改&quot;&quot;&quot;</span></span>
<span class="line"><span>    tool_name = input_data[&quot;tool_name&quot;]</span></span>
<span class="line"><span>    tool_input = input_data[&quot;tool_input&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if tool_name in [&quot;Write&quot;, &quot;Edit&quot;]:</span></span>
<span class="line"><span>        file_path = tool_input.get(&quot;file_path&quot;, &quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 记录到修改日志</span></span>
<span class="line"><span>        with open(&quot;modification-log.txt&quot;, &quot;a&quot;) as f:</span></span>
<span class="line"><span>            from datetime import datetime</span></span>
<span class="line"><span>            f.write(f&quot;[{datetime.now().isoformat()}] {tool_name}: {file_path}\\n&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {}</span></span></code></pre></div><p>这两个 Hook 分别挂载在 <code>PreToolUse</code> 和 <code>PostToolUse</code> 事件上，前者在文件修改前做准入检查，后者在修改成功后记录审计日志。</p><p>下面是完整的测试修复 Agent 代码。它综合运用了自定义工具、Hooks、流式会话和动态权限切换，实现了“先分析后修复”的两阶段工作流。第一阶段使用 <code>default</code> 权限模式，Agent 只分析不修改；用户确认修复方案后，切换到 <code>acceptEdits</code> 模式执行修复。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/usr/bin/env python3</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>自动化测试修复 Agent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>运行测试、分析失败、修复代码、验证修复。</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import asyncio</span></span>
<span class="line"><span>from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, HookMatcher</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 导入自定义工具和 Hooks（见上文定义）</span></span>
<span class="line"><span># from tools import test_tools_server</span></span>
<span class="line"><span># from hooks import check_file_modification, log_modifications</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def run_test_fixer():</span></span>
<span class="line"><span>    &quot;&quot;&quot;运行测试修复 Agent&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 配置选项</span></span>
<span class="line"><span>    options = ClaudeAgentOptions(</span></span>
<span class="line"><span>        # 模型选择</span></span>
<span class="line"><span>        model=&quot;sonnet&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # MCP 服务器</span></span>
<span class="line"><span>        mcp_servers={&quot;test-tools&quot;: test_tools_server},</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 允许的工具</span></span>
<span class="line"><span>        allowed_tools=[</span></span>
<span class="line"><span>            &quot;Read&quot;,</span></span>
<span class="line"><span>            &quot;Write&quot;,</span></span>
<span class="line"><span>            &quot;Edit&quot;,</span></span>
<span class="line"><span>            &quot;Grep&quot;,</span></span>
<span class="line"><span>            &quot;Glob&quot;,</span></span>
<span class="line"><span>            &quot;Bash(pytest:*)&quot;,  # 只允许 pytest 命令</span></span>
<span class="line"><span>            &quot;mcp__test-tools__run_tests&quot;,</span></span>
<span class="line"><span>            &quot;mcp__test-tools__get_test_history&quot;</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 权限模式：先分析，确认后再修改</span></span>
<span class="line"><span>        permission_mode=&quot;default&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 最大轮次</span></span>
<span class="line"><span>        max_turns=30,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # Hooks</span></span>
<span class="line"><span>        hooks={</span></span>
<span class="line"><span>            &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>                HookMatcher(matcher=&quot;Write&quot;, hooks=[check_file_modification]),</span></span>
<span class="line"><span>                HookMatcher(matcher=&quot;Edit&quot;, hooks=[check_file_modification])</span></span>
<span class="line"><span>            ],</span></span>
<span class="line"><span>            &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>                HookMatcher(matcher=&quot;Write&quot;, hooks=[log_modifications]),</span></span>
<span class="line"><span>                HookMatcher(matcher=&quot;Edit&quot;, hooks=[log_modifications])</span></span>
<span class="line"><span>            ]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 系统提示</span></span>
<span class="line"><span>    system_prompt = &quot;&quot;&quot;你是一个专业的测试修复助手。你的任务是：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.运行测试套件，识别失败的测试</span></span>
<span class="line"><span>2.分析每个失败测试的原因</span></span>
<span class="line"><span>3.确定是代码 bug 还是测试本身的问题</span></span>
<span class="line"><span>4.提出具体的修复方案</span></span>
<span class="line"><span>5.在获得确认后执行修复</span></span>
<span class="line"><span>6.重新运行测试验证修复</span></span>
<span class="line"><span></span></span>
<span class="line"><span>修复原则：</span></span>
<span class="line"><span>- 最小化修改：只改必要的代码</span></span>
<span class="line"><span>- 优先修复代码：除非测试本身有问题</span></span>
<span class="line"><span>- 保持测试覆盖：不要删除测试来&quot;修复&quot;问题</span></span>
<span class="line"><span>- 记录修改：说明每个修改的原因</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出格式：</span></span>
<span class="line"><span>- 先运行测试，报告结果</span></span>
<span class="line"><span>- 对每个失败的测试，分析原因</span></span>
<span class="line"><span>- 提出修复方案，等待确认</span></span>
<span class="line"><span>- 执行修复后，重新验证</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    async with ClaudeSDKClient(options=options) as client:</span></span>
<span class="line"><span>        print(&quot;Test Fixer Agent Started&quot;)</span></span>
<span class="line"><span>        print(&quot;=&quot; * 50)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 第一阶段：运行测试并分析</span></span>
<span class="line"><span>        print(&quot;\\nPhase 1: Running tests and analyzing failures...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        await client.query(f&quot;&quot;&quot;{system_prompt}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请开始：</span></span>
<span class="line"><span>1. 首先运行测试套件</span></span>
<span class="line"><span>2. 分析所有失败的测试</span></span>
<span class="line"><span>3. 为每个失败提出修复方案</span></span>
<span class="line"><span></span></span>
<span class="line"><span>注意：在这个阶段只分析，不要修改任何文件。</span></span>
<span class="line"><span>&quot;&quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        analysis_result = []</span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;text&quot;:</span></span>
<span class="line"><span>                print(msg.text)</span></span>
<span class="line"><span>                analysis_result.append(msg.text)</span></span>
<span class="line"><span>            elif msg.type == &quot;tool_use&quot;:</span></span>
<span class="line"><span>                print(f&quot;  [Tool] {msg.tool_name}...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 等待用户确认</span></span>
<span class="line"><span>        print(&quot;\\n&quot; + &quot;=&quot; * 50)</span></span>
<span class="line"><span>        print(&quot;Analysis complete. Review the proposed fixes above.&quot;)</span></span>
<span class="line"><span>        confirm = input(&quot;Proceed with fixes? (y/n): &quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if confirm.lower() != &quot;y&quot;:</span></span>
<span class="line"><span>            print(&quot;Aborted by user&quot;)</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 第二阶段：执行修复</span></span>
<span class="line"><span>        print(&quot;\\nPhase 2: Applying fixes...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 切换到接受编辑模式</span></span>
<span class="line"><span>        await client.update_options(permission_mode=&quot;acceptEdits&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        await client.query(&quot;&quot;&quot;</span></span>
<span class="line"><span>现在请执行你提出的修复方案。</span></span>
<span class="line"><span>修复完成后，重新运行测试验证。</span></span>
<span class="line"><span>&quot;&quot;&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        async for msg in client.receive_response():</span></span>
<span class="line"><span>            if msg.type == &quot;text&quot;:</span></span>
<span class="line"><span>                print(msg.text)</span></span>
<span class="line"><span>            elif msg.type == &quot;tool_use&quot;:</span></span>
<span class="line"><span>                print(f&quot;  [Tool] {msg.tool_name}: {msg.tool_input.get(&#39;file_path&#39;, msg.tool_input.get(&#39;command&#39;, &#39;&#39;))}&quot;)</span></span>
<span class="line"><span>            elif msg.type == &quot;result&quot;:</span></span>
<span class="line"><span>                print(f&quot;\\nCompleted in {msg.duration_ms/1000:.1f}s&quot;)</span></span>
<span class="line"><span>                print(f&quot;   Cost: \${msg.total_cost_usd:.4f}&quot;)</span></span>
<span class="line"><span>                print(f&quot;   Turns: {msg.num_turns}&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    asyncio.run(run_test_fixer())</span></span></code></pre></div><p>执行测试修复 Agent ，可以看到它自动完成了从运行测试、分析失败、到修复代码、验证结果的完整流程。整个过程中，Agent 精准识别了两个失败测试的根因，一个是模型默认值变更，一个是 API 路径更新，并提出了合理的修复方案。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ python test_fixer.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Test Fixer Agent Started</span></span>
<span class="line"><span>==================================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 1: Running tests and analyzing failures...</span></span>
<span class="line"><span>  [Tool] mcp__test-tools__run_tests...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Test Results:</span></span>
<span class="line"><span>- Total: 200</span></span>
<span class="line"><span>- Passed: 198</span></span>
<span class="line"><span>- Failed: 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Failed Tests Analysis:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. tests/test_user.py::test_user_creation</span></span>
<span class="line"><span>   Error: AssertionError: expected &#39;active&#39; but got &#39;pending&#39;</span></span>
<span class="line"><span>   Analysis: The User model&#39;s default status was changed from &#39;active&#39; to &#39;pending&#39;</span></span>
<span class="line"><span>             in commit abc123, but the test wasn&#39;t updated.</span></span>
<span class="line"><span>   Proposed Fix: Update the test to expect &#39;pending&#39; status, OR restore the</span></span>
<span class="line"><span>                 default to &#39;active&#39; if that was unintentional.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. tests/test_api.py::test_get_user_endpoint</span></span>
<span class="line"><span>   Error: 404 Not Found</span></span>
<span class="line"><span>   Analysis: The endpoint path was changed from /api/user to /api/users (plural)</span></span>
<span class="line"><span>             but the test still uses the old path.</span></span>
<span class="line"><span>   Proposed Fix: Update the test to use /api/users</span></span>
<span class="line"><span></span></span>
<span class="line"><span>==================================================</span></span>
<span class="line"><span>Analysis complete. Review the proposed fixes above.</span></span>
<span class="line"><span>Proceed with fixes? (y/n): y</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 2: Applying fixes...</span></span>
<span class="line"><span>  [Tool] Edit: tests/test_user.py</span></span>
<span class="line"><span>  [Tool] Edit: tests/test_api.py</span></span>
<span class="line"><span>  [Tool] mcp__test-tools__run_tests...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>All tests passed! (200/200)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Completed in 45.3s</span></span>
<span class="line"><span>   Cost: $0.0821</span></span>
<span class="line"><span>   Turns: 12</span></span></code></pre></div><h2 id="生产环境最佳实践" tabindex="-1">生产环境最佳实践 <a class="header-anchor" href="#生产环境最佳实践" aria-label="Permalink to &quot;生产环境最佳实践&quot;">​</a></h2><p>本课的最后，我们来介绍一系列的生产环境中应用SDK的的最佳实践。</p><h3 id="成本控制" tabindex="-1"><strong>成本控制</strong> <a class="header-anchor" href="#成本控制" aria-label="Permalink to &quot;**成本控制**&quot;">​</a></h3><p>将 Agent 部署到生产环境时，成本控制是第一个需要关注的问题。Agent 的每一轮工具调用都会消耗 token，而不受控的 Agent 可能在一次任务中消耗大量 API 额度。以下策略能帮助你有效控制成本：选择合适的模型（简单任务用 Haiku 而非 Sonnet）、限制最大轮次、限制工具集（减少不必要的操作），以及在运行时监控累计成本。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from claude_agent_sdk import ClaudeAgentOptions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    # 使用更便宜的模型处理简单任务</span></span>
<span class="line"><span>    model=&quot;haiku&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 限制轮次</span></span>
<span class="line"><span>    max_turns=20,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 限制工具（减少不必要的操作）</span></span>
<span class="line"><span>    allowed_tools=[&quot;Read&quot;, &quot;Grep&quot;, &quot;Glob&quot;],  # 只读</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 监控成本</span></span>
<span class="line"><span>async for msg in client.receive_response():</span></span>
<span class="line"><span>    if msg.type == &quot;result&quot;:</span></span>
<span class="line"><span>        if msg.total_cost_usd &amp;gt; 0.50:</span></span>
<span class="line"><span>            logger.warning(f&quot;High cost query: \${msg.total_cost_usd}&quot;)</span></span></code></pre></div><h3 id="错误重试" tabindex="-1"><strong>错误重试</strong> <a class="header-anchor" href="#错误重试" aria-label="Permalink to &quot;**错误重试**&quot;">​</a></h3><p>网络波动、API 限流、临时性服务中断——这些问题在生产环境中不可避免。一个健壮的 Agent 应用需要内置重试机制。下面的实现使用指数退避策略：第一次失败后等 1 秒重试，第二次等 2 秒，第三次等 4 秒。这种策略既避免了对 API 的过度请求，又在大多数临时性故障中能自动恢复。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import asyncio</span></span>
<span class="line"><span>from claude_agent_sdk import ClaudeAgentError</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def resilient_query(client, prompt, max_retries=3):</span></span>
<span class="line"><span>    &quot;&quot;&quot;带重试的查询&quot;&quot;&quot;</span></span>
<span class="line"><span>    for attempt in range(max_retries):</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            await client.query(prompt)</span></span>
<span class="line"><span>            results = []</span></span>
<span class="line"><span>            async for msg in client.receive_response():</span></span>
<span class="line"><span>                results.append(msg)</span></span>
<span class="line"><span>                if msg.type == &quot;error&quot;:</span></span>
<span class="line"><span>                    raise ClaudeAgentError(msg.error)</span></span>
<span class="line"><span>            return results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        except ClaudeAgentError as e:</span></span>
<span class="line"><span>            if attempt &amp;lt; max_retries - 1:</span></span>
<span class="line"><span>                wait_time = 2 ** attempt  # 指数退避</span></span>
<span class="line"><span>                logger.warning(f&quot;Attempt {attempt + 1} failed, retrying in {wait_time}s...&quot;)</span></span>
<span class="line"><span>                await asyncio.sleep(wait_time)</span></span>
<span class="line"><span>            else:</span></span>
<span class="line"><span>                raise</span></span></code></pre></div><h3 id="超时处理" tabindex="-1"><strong>超时处理</strong> <a class="header-anchor" href="#超时处理" aria-label="Permalink to &quot;**超时处理**&quot;">​</a></h3><p>Agent 任务可能因为各种原因卡住，等待一个永远不会返回的 API 调用，或者陷入无意义的推理循环。设置合理的超时时间是防止资源浪费的重要手段。Python 3.11 引入的 <code>asyncio.timeout</code> 上下文管理器，让超时处理变得非常优雅。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import asyncio</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def query_with_timeout(client, prompt, timeout=300):</span></span>
<span class="line"><span>    &quot;&quot;&quot;带超时的查询&quot;&quot;&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        await client.query(prompt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        async with asyncio.timeout(timeout):</span></span>
<span class="line"><span>            results = []</span></span>
<span class="line"><span>            async for msg in client.receive_response():</span></span>
<span class="line"><span>                results.append(msg)</span></span>
<span class="line"><span>            return results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except asyncio.TimeoutError:</span></span>
<span class="line"><span>        await client.interrupt()</span></span>
<span class="line"><span>        logger.error(f&quot;Query timed out after {timeout}s&quot;)</span></span>
<span class="line"><span>        raise</span></span></code></pre></div><h3 id="审计日志" tabindex="-1"><strong>审计日志</strong> <a class="header-anchor" href="#审计日志" aria-label="Permalink to &quot;**审计日志**&quot;">​</a></h3><p>在企业环境中，所有 Agent 操作都应该被记录下来。审计日志不仅用于调试，更是合规要求。下面的 <code>AuditLogger</code> 以 JSONL 格式（每行一个 JSON 对象）记录所有工具调用，包括时间戳、工具名称、输入参数和调用 ID。这种格式便于后续用 ELK Stack 或 Splunk 等日志分析工具处理。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import json</span></span>
<span class="line"><span>from datetime import datetime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class AuditLogger:</span></span>
<span class="line"><span>    def __init__(self, log_file=&quot;agent-audit.jsonl&quot;):</span></span>
<span class="line"><span>        self.log_file = log_file</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def log(self, event_type, data):</span></span>
<span class="line"><span>        entry = {</span></span>
<span class="line"><span>            &quot;timestamp&quot;: datetime.now().isoformat(),</span></span>
<span class="line"><span>            &quot;event&quot;: event_type,</span></span>
<span class="line"><span>            &quot;data&quot;: data</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        with open(self.log_file, &quot;a&quot;) as f:</span></span>
<span class="line"><span>            f.write(json.dumps(entry) + &quot;\\n&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>audit = AuditLogger()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def audited_tool_usage(input_data, tool_use_id, context):</span></span>
<span class="line"><span>    &quot;&quot;&quot;审计所有工具使用&quot;&quot;&quot;</span></span>
<span class="line"><span>    audit.log(&quot;tool_use&quot;, {</span></span>
<span class="line"><span>        &quot;tool&quot;: input_data[&quot;tool_name&quot;],</span></span>
<span class="line"><span>        &quot;input&quot;: input_data[&quot;tool_input&quot;],</span></span>
<span class="line"><span>        &quot;tool_use_id&quot;: tool_use_id</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>    return {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options = ClaudeAgentOptions(</span></span>
<span class="line"><span>    hooks={</span></span>
<span class="line"><span>        &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>            HookMatcher(matcher=&quot;*&quot;, hooks=[audited_tool_usage])</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>)</span></span></code></pre></div><h2 id="总结一下" tabindex="-1">总结一下 <a class="header-anchor" href="#总结一下" aria-label="Permalink to &quot;总结一下&quot;">​</a></h2><p>这一讲我们深入学习了 Claude Agent SDK 的高级特性，并构建了一个完整的生产级 Agent。</p><p>自定义工具让 Agent 能够调用你定义的函数。使用 <code>@tool</code> 装饰器定义工具，使用 <code>create_sdk_mcp_server</code> 创建承载工具的 MCP 服务器，然后通过 <code>mcp_servers</code> 选项注入到 Agent 中。工具命名遵循 <code>mcp__{服务器名}__{工具名}</code> 格式。设计工具时要遵循单一职责、清晰描述、安全优先的原则。</p><p>Hooks 系统让你能够在 Agent 执行的各个阶段插入自定义逻辑。PreToolUse 在工具执行前触发，可以允许、拒绝或修改工具输入；PostToolUse 在工具执行后触发，适合日志记录和后处理。 <code>canUseTool</code> 是另一种权限控制方式，更简单但功能有限。</p><p>权限管理是构建安全 Agent 的关键。SDK 提供四道防线：权限模式（全局设置）、工具白名单/黑名单（工具级别）、canUseTool 回调（运行时检查）、Hooks（最细粒度控制）。这四道防线应该配合使用，形成分层防御。</p><p>流式会话是生产级应用的首选模式。它支持多轮对话、中断执行、动态切换权限、自定义权限请求处理。相比单次 <code>query()</code> 调用，流式会话提供了更丰富的交互能力和更精细的控制。</p><p>实战项目展示了如何将这些特性组合起来。测试修复 Agent 使用自定义工具运行测试、使用 Hooks 控制文件修改权限、使用流式会话实现两阶段工作流（先分析后修复）。这个模式可以推广到许多类似场景，代码审查、文档生成、数据处理等。</p><p>下面，我想送给大家一份生产级 Agent 上线清单，把 Agent 部署到生产环境前，你可以过一遍这个清单。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/0112f01b4yy4253b253e22f987cb9289.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/966254/0112f01b4yy4253b253e22f987cb9289.jpg" alt="图片"></a></p><p>希望大家利用好Agent SDK，设计出功能强大，可用而又可靠的Agent系统！</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>如果你要构建一个代码重构 Agent，你会定义哪些自定义工具？如何设计安全策略？</p></li><li><p>PreToolUse Hook 可以修改工具输入。这个能力有什么应用场景？有什么风险？</p></li><li><p>流式会话允许中途切换权限模式。你能想到什么场景需要这个能力？</p></li><li><p>本文中我们列出了哪些生产环境最佳实践，除此之外你还能想到哪些重要的实践方法和注意事项。</p></li></ol><h2 id="下一讲预告" tabindex="-1">下一讲预告 <a class="header-anchor" href="#下一讲预告" aria-label="Permalink to &quot;下一讲预告&quot;">​</a></h2><p>到这里，我们已经学习了 Claude Code 的所有核心能力：记忆系统、子代理、Skills、命令、Hooks、MCP、Headless 模式、Agent SDK。每一种能力都是独立的积木块，但真正的工程价值在于把它们组合成可复用、可分享的整体。</p><p>下一讲，我们将学习 Plugins 插件打包与分发——把这些能力组合成可复用的插件，实现团队资产沉淀与共享。你将学会插件的目录结构和 manifest 文件、如何打包 Commands、Skills、Agents、Hooks，以及插件的发布和安装流程。我们还会动手构建一个完整的&quot;团队能力包&quot;，把前面所学的一切打包成一个开箱即用的插件。</p><p>欢迎你在留言区参与讨论，如果这节课对你有启发，别忘了分享给身边更多朋友。</p>`,151)])])}const g=n(t,[["render",l]]);export{d as __pageData,g as default};
