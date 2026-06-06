import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"17｜海纳百川：MCP 协议与外部工具连接","description":"","frontmatter":{},"headers":[{"level":2,"title":"MCP——AI 的 USB-C 接口","slug":"mcp——ai-的-usb-c-接口","link":"#mcp——ai-的-usb-c-接口","children":[]},{"level":2,"title":"MCP 架构与核心概念","slug":"mcp-架构与核心概念","link":"#mcp-架构与核心概念","children":[]},{"level":2,"title":"MCP的三种传输方式","slug":"mcp的三种传输方式","link":"#mcp的三种传输方式","children":[]},{"level":2,"title":"MCP的配置与管理","slug":"mcp的配置与管理","link":"#mcp的配置与管理","children":[]},{"level":2,"title":"实战：连接主流 MCP 服务","slug":"实战-连接主流-mcp-服务","link":"#实战-连接主流-mcp-服务","children":[{"level":3,"title":"实战 1：Context7——实时技术文档","slug":"实战-1-context7——实时技术文档","link":"#实战-1-context7——实时技术文档","children":[]},{"level":3,"title":"实战 2：GitHub MCP——仓库操作","slug":"实战-2-github-mcp——仓库操作","link":"#实战-2-github-mcp——仓库操作","children":[]},{"level":3,"title":"实战 3：Notion MCP——文档集成","slug":"实战-3-notion-mcp——文档集成","link":"#实战-3-notion-mcp——文档集成","children":[]},{"level":3,"title":"实战 4：数据库——查询与分析","slug":"实战-4-数据库——查询与分析","link":"#实战-4-数据库——查询与分析","children":[]}]},{"level":2,"title":"创建自定义 MCP 服务器","slug":"创建自定义-mcp-服务器","link":"#创建自定义-mcp-服务器","children":[{"level":3,"title":"TypeScript SDK","slug":"typescript-sdk","link":"#typescript-sdk","children":[]},{"level":3,"title":"Python SDK","slug":"python-sdk","link":"#python-sdk","children":[]},{"level":3,"title":"配置自定义服务器","slug":"配置自定义服务器","link":"#配置自定义服务器","children":[]}]},{"level":2,"title":"5条MCP安全原则","slug":"_5条mcp安全原则","link":"#_5条mcp安全原则","children":[]},{"level":2,"title":"调试与故障排除","slug":"调试与故障排除","link":"#调试与故障排除","children":[]},{"level":2,"title":"总结一下","slug":"总结一下","link":"#总结一下","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"下一讲预告","slug":"下一讲预告","link":"#下一讲预告","children":[]}],"relativePath":"ClaudeCode工程化实战/17｜海纳百川：MCP协议与外部工具连接.md","filePath":"ClaudeCode工程化实战/17｜海纳百川：MCP协议与外部工具连接.md","lastUpdated":1779815462000}'),t={name:"ClaudeCode工程化实战/17｜海纳百川：MCP协议与外部工具连接.md"};function o(l,s,i,c,u,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_17-海纳百川-mcp-协议与外部工具连接" tabindex="-1">17｜海纳百川：MCP 协议与外部工具连接 <a class="header-anchor" href="#_17-海纳百川-mcp-协议与外部工具连接" aria-label="Permalink to &quot;17｜海纳百川：MCP 协议与外部工具连接&quot;">​</a></h1><blockquote><p>释题：海纳百川。一个开放协议，让 Claude Code 从只能操作本地文件的工具，进化为能连接整个数字世界的智能枢纽——数据库、API、云服务，百川归海，一协议通。</p></blockquote><p>你好，我是黄佳。</p><p>前面两讲我们学习了 Hooks——事件驱动自动化的安全闸门。Hooks 让我们能在 Claude 执行工具前后插入自定义检查，解决了“能不能做”的问题。但即使有了 Memory 的记忆、SubAgents 的分工、Skills 的领域能力、Commands 的标准流程、Hooks 的安全防护，Claude Code 的所有能力，始终被锁在一个边界内——本地文件系统。今天我们就来打破这个边界。</p><p>Claude 能读文件、写代码、执行命令，这些你已经非常熟悉。但面对下面这些需求时，它就无能为力了：</p><ul><li><p>帮我查一下数据库里上个月的销售数据</p></li><li><p>把这个 Issue 同步到 GitHub</p></li><li><p>从 Notion 里读取产品需求文档</p></li><li><p>检查一下 Sentry 上最近的错误日志</p></li></ul><p>这不是 Claude 不够聪明，而是它缺少与外部世界连接的通道。读代码、写代码、跑命令——本质都是本地文件系统交互。而企业开发的真实场景中，数据库、版本控制系统、项目管理平台、监控系统才是日常主战场。如果 Claude 无法触及这些系统，它就只能做一个聪明但孤立的本地助手。</p><p>2024 年 11 月，Anthropic 推出了一项开源协议，彻底改变了这个局面——Model Context Protocol (MCP)，AI 时代的USB-C 接口（参见佳哥之前推出的专栏 <a href="https://time.geekbang.org/column/intro/101053801" target="_blank" rel="noreferrer">《MCP &amp; A2A 前沿实战》</a>）。</p><h2 id="mcp——ai-的-usb-c-接口" tabindex="-1">MCP——AI 的 USB-C 接口 <a class="header-anchor" href="#mcp——ai-的-usb-c-接口" aria-label="Permalink to &quot;MCP——AI 的 USB-C 接口&quot;">​</a></h2><p>在 MCP 出现之前，如果你想让 AI 助手连接外部服务，通常有两种选择：</p><ol><li><p><strong>自定义开发</strong>：为每个服务写专门的集成代码</p></li><li><p><strong>平台绑定</strong>：依赖特定平台提供的插件（如 ChatGPT Plugins）</p></li></ol><p>这带来了严重的碎片化问题。假设市场上有 M 个 AI 助手和 N 个外部服务，那么理论上需要 M × N 个专用适配器。每一对组合都需要单独开发、单独维护、单独调试：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/1a71310130f2fa3359ef325cfaed2cb2.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/1a71310130f2fa3359ef325cfaed2cb2.jpg" alt=""></a></p><p>MCP 的出现改变了这一切。正如 <a href="https://www.anthropic.com/news/model-context-protocol" target="_blank" rel="noreferrer">Anthropic 官方博客</a> 所描述的：</p><blockquote><p>把 MCP 想象成 AI 应用的 USB-C 接口。就像 USB-C 提供了连接设备与各种外设的标准化方式，MCP 提供了连接 AI 模型与各种数据源和工具的标准化方式。 有了 MCP，M × N 的问题变成了 M + N：</p></blockquote><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/4feef448c583abc385f42ea2afdac01a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/4feef448c583abc385f42ea2afdac01a.jpg" alt=""></a></p><p>一个协议，通用连接。每个 AI 助手只需要实现一次 MCP Client，每个服务只需要实现一次 MCP Server，然后任意组合即可工作。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/66e77ba71666a2cf1d5021e3b9a85167.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/66e77ba71666a2cf1d5021e3b9a85167.jpg" alt=""></a></p><p>MCP 的诞生源于一个简单的痛点。据 <a href="https://en.wikipedia.org/wiki/Model_Context_Protocol" target="_blank" rel="noreferrer">Wikipedia</a> 记载，MCP 协议由 Anthropic 的两位工程师 David Soria Parra 和 Justin Spahr-Summers 构思并开发：</p><blockquote><p>2024 年 7 月，我在做内部开发工具…作为一个开发工具背景的人，我很快就欣赏到 Claude Desktop 的强大——比如 Artifacts 功能——但也对它功能集有限、无法扩展感到沮丧。</p><p>这个痛点在当时并非个例。每一个试图将 AI 助手集成到真实工作流中的工程师都面临同样的困境。David 和 Justin 的洞察在于：这个问题不应该由每个开发者各自解决，而应该由一个开放协议统一解决——就像 HTTP 统一了 Web、LSP 统一了 IDE 语言支持那样。</p></blockquote><p>MCP 发布后，迅速获得了行业认可：</p><ul><li><p><strong>2025 年 3 月</strong>： <a href="https://en.wikipedia.org/wiki/Model_Context_Protocol" target="_blank" rel="noreferrer">OpenAI 正式采纳 MCP</a>，将其集成到 ChatGPT 桌面应用和 Agents SDK 中</p></li><li><p><strong>2025 年 9 月</strong>：Google 宣布为 Gemini 提供官方 MCP 支持</p></li><li><p><strong>2025 年 12 月</strong>：Anthropic 将 MCP <a href="https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation" target="_blank" rel="noreferrer">捐赠给 Linux 基金会下的 Agentic AI Foundation (AAIF)</a></p></li><li><p><strong>AAIF 创始成员</strong>：OpenAI、Google、Microsoft、Amazon Web Services、Cloudflare、Bloomberg</p></li></ul><p>截至 2025 年底，MCP 生态已经达到惊人的规模。</p><ul><li><p><strong>9700 万</strong> 月度 SDK 下载量</p></li><li><p><strong>10000+</strong> 公开 MCP 服务器（PulseMCP 目录收录 10,400+，MCP.so 收录 18,500+）</p></li><li><p><strong>75+</strong> 官方 Claude 连接器</p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/5c04e8ccf1b94ba97df7c231c9f69b18.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/5c04e8ccf1b94ba97df7c231c9f69b18.jpg" alt=""></a></p><h2 id="mcp-架构与核心概念" tabindex="-1">MCP 架构与核心概念 <a class="header-anchor" href="#mcp-架构与核心概念" aria-label="Permalink to &quot;MCP 架构与核心概念&quot;">​</a></h2><p>MCP 采用经典的客户端-服务器架构。Claude Code 充当 MCP Client，负责发现和调用工具；MCP Server 则暴露工具和资源，作为外部服务的代理。两者之间通过 JSON-RPC 2.0 协议通信。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/0bd8713656afef7c538ebf568ff03b88.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/0bd8713656afef7c538ebf568ff03b88.jpg" alt=""></a></p><p>这个架构的关键组件如下表所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/1990fb9c666f40139b02d17d9bcbb5db.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/1990fb9c666f40139b02d17d9bcbb5db.jpg" alt=""></a></p><p>MCP 复用了 <a href="https://en.wikipedia.org/wiki/Language_Server_Protocol" target="_blank" rel="noreferrer">Language Server Protocol (LSP)</a> 的消息流思想。如果你用过 VS Code，你已经间接体验过这种架构——编辑器的智能提示、跳转定义等功能，都是通过 LSP 与语言服务器通信实现的。MCP 做了同样的事情，只不过它服务的不是代码编辑器，而是 AI Agent。</p><p>MCP Server 并不只是简单地“暴露一个函数”。它可以向 Client 提供三种不同类型的能力。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/76ef47995dbb4a63481dea6bc04dee07.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/76ef47995dbb4a63481dea6bc04dee07.jpg" alt=""></a></p><p>Tools 是最常用的能力类型——它让 Claude 能够“做事情“。Resources 提供只读数据，让 Claude 能够“看到东西”而不仅仅依赖你粘贴的文本。Prompts 则是一种便捷机制，让服务器预定义好特定场景的交互模板。</p><p>Claude Code 会在启动时自动发现所有配置的 MCP Server 及其提供的能力。当你说“帮我查一下数据库里的用户数量”时，Claude 会自动找到数据库 MCP Server，调用对应的查询工具，解析结果并返回给你。整个过程对用户完全透明。</p><h2 id="mcp的三种传输方式" tabindex="-1">MCP的三种传输方式 <a class="header-anchor" href="#mcp的三种传输方式" aria-label="Permalink to &quot;MCP的三种传输方式&quot;">​</a></h2><p>MCP 支持三种传输方式，适用于不同场景。</p><p><strong>Stdio 传输（本地进程）</strong> 是最简单的方式。MCP Server 作为本地子进程启动，通过标准输入（stdin）接收请求，通过标准输出（stdout）返回响应。零网络开销、零配置复杂度，适合本地工具和开发测试：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;filesystem&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;npx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;&amp;#64;modelcontextprotocol/server-filesystem&quot;, &quot;/home/user/projects&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二种方式是 <strong>HTTP 传输（推荐用于远程）</strong>。当 MCP Server 运行在远程服务器上时的推荐方式。通过标准 HTTP 请求/响应通信，支持 TLS 加密和 Bearer Token 认证。GitHub、Notion、Sentry 等云服务通常直接提供 HTTP 类型的 MCP 端点：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;github&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;https://api.githubcopilot.com/mcp/&quot;,</span></span>
<span class="line"><span>      &quot;headers&quot;: {</span></span>
<span class="line"><span>        &quot;Authorization&quot;: &quot;Bearer \${GITHUB_TOKEN}&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第三种我们也很熟悉了， <strong>SSE 传输（Server-Sent Events）</strong>——基于 HTTP 的单向推送技术，建立持久连接，服务器可以主动向客户端推送数据。适合实时监控和流式数据场景。在实践中使用较少，大多数场景用 stdio 或 HTTP 就够了。</p><p>这几种方式怎么选呢？原则是， <strong>本地用 stdio，远程用 HTTP，实时用 SSE</strong>。如果你拿不定主意，先试 stdio（本地服务器）或 HTTP（远程服务），这两个覆盖了 95% 的场景。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/26a0b1a0bb07daab29efd2a54d27bfcc.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/26a0b1a0bb07daab29efd2a54d27bfcc.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/cb985ac7dece83d76c1e6d3b26ba7523.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/cb985ac7dece83d76c1e6d3b26ba7523.jpg" alt=""></a></p><h2 id="mcp的配置与管理" tabindex="-1">MCP的配置与管理 <a class="header-anchor" href="#mcp的配置与管理" aria-label="Permalink to &quot;MCP的配置与管理&quot;">​</a></h2><p>MCP 配置有三个 scope，对应三个不同的物理落点。注意，MCP 配置走的是和 <code>settings.json</code> 完全独立的体系—— <code>mcpServers</code> 不是 <code>settings.json</code> / <code>settings.local.json</code> 的合法顶级键，写进去会被静默忽略。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/3469756e21251f842b24f9c5f27fc2a2.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/3469756e21251f842b24f9c5f27fc2a2.jpg" alt=""></a></p><ul><li><p><strong>团队共享的服务配置</strong> 放到 <code>&amp;lt;项目根&gt;/.mcp.json</code>——提交到 git，团队成员共享。</p></li><li><p><strong>个人常用服务</strong>，如果是跨项目的，放到 <code>~/.claude.json</code> 顶级的 <code>mcpServers</code>（user scope）。</p></li><li><p><strong>敏感凭证 / 项目私有 MCP</strong> 落在 <code>~/.claude.json</code> 的 <code>projects.&amp;lt;path&gt;.mcpServers</code>（local scope），不入 git，但不要手写这一段，使用 <code>claude mcp add</code> 命令默认写到这里。</p></li></ul><p>不论使用哪种传输方式，MCP 配置都遵循同一个 JSON 结构。 <code>mcpServers</code> 是顶层键，每个子键是服务器名称（可自由命名）。 <code>type</code> 指定传输方式，剩余字段根据传输类型不同——stdio 需要 <code>command</code> 和 <code>args</code>，HTTP/SSE 需要 <code>url</code> 和 <code>headers</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;server-name&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio | sse | http&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;...&quot;,</span><span>        // stdio 专用</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;...&quot;],</span><span>         // stdio 专用</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;...&quot;,</span><span>            // sse/http 专用</span></span>
<span class="line"><span>      &quot;headers&quot;: {},</span><span>           // sse/http 专用</span></span>
<span class="line"><span>      &quot;env&quot;: {}</span><span>                // 环境变量</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/a6a50223ca68aa3030f18a8d85c0981c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/a6a50223ca68aa3030f18a8d85c0981c.png" alt="图片"></a> Claude Code 里面的 MCP 配置示例</p><p>在配置文件中硬编码敏感信息是危险的。MCP 配置支持通过 <code>\${}</code> 语法引用环境变量： <code>\${VAR_NAME}</code> 直接引用，变量不存在会报错； <code>\${VAR_NAME:-default}</code> 在变量不存在时使用默认值：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;secure-api&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;https://api.example.com/mcp&quot;,</span></span>
<span class="line"><span>      &quot;headers&quot;: {</span></span>
<span class="line"><span>        &quot;Authorization&quot;: &quot;Bearer \${API_TOKEN}&quot;,</span></span>
<span class="line"><span>        &quot;X-API-Key&quot;: &quot;\${API_KEY:-default-key}&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Claude Code 提供了命令行工具来管理 MCP 服务器，这比手动编辑 JSON 更方便。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 添加 HTTP 服务器</span></span>
<span class="line"><span>claude mcp add --transport http github https://api.githubcopilot.com/mcp/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 添加 stdio 服务器</span></span>
<span class="line"><span>claude mcp add filesystem -- npx &amp;#64;modelcontextprotocol/server-filesystem /path</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 添加到用户级别（所有项目可用）</span></span>
<span class="line"><span>claude mcp add --transport http --scope user github https://api.githubcopilot.com/mcp/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 带认证头添加</span></span>
<span class="line"><span>claude mcp add --transport http --header &quot;Authorization: Bearer \${TOKEN}&quot; api https://api.example.com/mcp</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 列出所有服务器</span></span>
<span class="line"><span>claude mcp list</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查看服务器详情</span></span>
<span class="line"><span>claude mcp get github</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 移除服务器</span></span>
<span class="line"><span>claude mcp remove github</span></span></code></pre></div><h2 id="实战-连接主流-mcp-服务" tabindex="-1">实战：连接主流 MCP 服务 <a class="header-anchor" href="#实战-连接主流-mcp-服务" aria-label="Permalink to &quot;实战：连接主流 MCP 服务&quot;">​</a></h2><p>理论讲了不少，接下来咱们动手练练。MCP 的生态已经非常成熟，从官方基础服务到第三方热门服务，覆盖了开发者日常所需的各个场景。</p><p>Anthropic 维护了一套 <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noreferrer">官方 MCP 服务器集合</a>，覆盖最常见的开发需求。这些服务器经过官方测试和维护，是入门 MCP 的最佳起点。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/4896aa2e92390c9ee458cf9b597e15e7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/4896aa2e92390c9ee458cf9b597e15e7.jpg" alt=""></a></p><p>社区也贡献了大量高质量的第三方 MCP 服务器。以下是开发者最常用、真正能跑的几个。</p><ul><li><p><a href="https://github.com/github/github-mcp-server" target="_blank" rel="noreferrer">GitHub MCP</a></p></li><li><p><a href="https://github.com/upstash/context7" target="_blank" rel="noreferrer">Context7</a></p></li><li><p><a href="https://developers.notion.com/docs/mcp" target="_blank" rel="noreferrer">Notion MCP</a></p></li><li><p><a href="https://github.com/nicobailey/brave-search-mcp" target="_blank" rel="noreferrer">Brave Search</a></p></li><li><p><a href="https://docs.sentry.io/product/sentry-mcp/" target="_blank" rel="noreferrer">Sentry MCP</a></p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/6c99719525ebaea88d98d44cbe92bde5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/6c99719525ebaea88d98d44cbe92bde5.jpg" alt=""></a></p><p>我们来介绍几个最典型的配置，更多的实际实用的MCP工具，咱们可以继续在留言区分享。</p><h3 id="实战-1-context7——实时技术文档" tabindex="-1">实战 1：Context7——实时技术文档 <a class="header-anchor" href="#实战-1-context7——实时技术文档" aria-label="Permalink to &quot;实战 1：Context7——实时技术文档&quot;">​</a></h3><p>Context7 是开发者社区最火的 MCP 服务器之一。它的价值在于，当你让 Claude 帮你写代码时，Claude 可以实时拉取你用的库的最新文档，而不是依赖训练数据中可能过时的知识。</p><p>配置极其简单，一行命令搞定。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude mcp add context7 -- npx -y &amp;#64;upstash/context7-mcp&amp;#64;latest</span></span></code></pre></div><p>或者在 <code>.mcp.json</code> 中手动配置：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;context7&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;npx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;-y&quot;, &quot;&amp;#64;upstash/context7-mcp&amp;#64;latest&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>配置完成后，你可以在提示中加上 <code>use context7</code> 关键词，Claude 就会自动去拉取最新的官方文档：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我用 Next.js 15 的 App Router 写一个带认证的 API 路由 use context7</span></span></code></pre></div><p>Claude会输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>先查一下 Next.js 15 的最新文档...</span></span>
<span class="line"><span>[调用 context7 MCP server → resolve_library_id → get_library_docs]</span></span>
<span class="line"><span>根据最新文档，Next.js 15 的 App Router API 路由写法如下...</span></span></code></pre></div><p>不需要 API Key，不需要付费，开箱即用。这就是为什么它成了开发者的“标配”MCP。</p><h3 id="实战-2-github-mcp——仓库操作" tabindex="-1">实战 2：GitHub MCP——仓库操作 <a class="header-anchor" href="#实战-2-github-mcp——仓库操作" aria-label="Permalink to &quot;实战 2：GitHub MCP——仓库操作&quot;">​</a></h3><p>GitHub 官方推出的 MCP 服务器，支持完整的仓库管理操作：创建 Issue、管理 PR、搜索代码、查看 CI/CD 状态。</p><p><strong>方式一：HTTP 远程连接</strong>（推荐，GitHub 官方托管）</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;github&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;https://api.githubcopilot.com/mcp/&quot;,</span></span>
<span class="line"><span>      &quot;headers&quot;: {</span></span>
<span class="line"><span>        &quot;Authorization&quot;: &quot;Bearer \${GITHUB_TOKEN}&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>方式二：stdio 本地运行</strong>（更灵活，可定制参数）</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude mcp add github -- docker run -i --rm \\</span></span>
<span class="line"><span>  -e GITHUB_PERSONAL_ACCESS_TOKEN=\${GITHUB_TOKEN} \\</span></span>
<span class="line"><span>  ghcr.io/github/github-mcp-server</span></span></code></pre></div><p>配置好之后，你可以直接在终端里操作 GitHub：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>发现一个登录页面的 Bug，当用户输入超长密码时会崩溃，帮我创建一个 Issue</span></span></code></pre></div><p>Claude输出如下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>让我在 GitHub 上创建这个 Issue...</span></span>
<span class="line"><span>[调用 GitHub MCP server → create_issue]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>已创建 Issue #142: &quot;Login page crashes with extremely long password&quot;</span></span>
<span class="line"><span>- Labels: bug, high-priority</span></span>
<span class="line"><span>- URL: https://github.com/your-org/your-repo/issues/142</span></span></code></pre></div><p>GITHUB_TOKEN 需要事先创建。到 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens，勾选你需要的仓库权限即可。</p><h3 id="实战-3-notion-mcp——文档集成" tabindex="-1">实战 3：Notion MCP——文档集成 <a class="header-anchor" href="#实战-3-notion-mcp——文档集成" aria-label="Permalink to &quot;实战 3：Notion MCP——文档集成&quot;">​</a></h3><p>Notion 官方开源了 MCP 服务器，让 Claude 可以直接读写你的 Notion 工作区。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;notion&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;https://mcp.notion.com/mcp&quot;,</span></span>
<span class="line"><span>      &quot;headers&quot;: {</span></span>
<span class="line"><span>        &quot;Authorization&quot;: &quot;Bearer \${NOTION_API_KEY}&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>NOTION_API_KEY 在 <a href="https://www.notion.so/profile/integrations" target="_blank" rel="noreferrer">Notion Developers</a> 创建 Internal Integration 后获取。记得在 Notion 页面的 Connections 里添加你创建的 Integration，否则 Claude 看不到页面内容。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>从 Notion 里读取&quot;Q1 产品路线图&quot;，帮我提取其中的技术任务</span></span></code></pre></div><p>Claude输出如下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>读取 Notion 文档...</span></span>
<span class="line"><span>[调用 Notion MCP server → search → get_page]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>从 &quot;Q1 产品路线图&quot; 提取的技术任务：</span></span>
<span class="line"><span>1. 用户认证系统升级（2月前）</span></span>
<span class="line"><span>   - 支持 OAuth 2.0</span></span>
<span class="line"><span>   - 添加双因素认证</span></span>
<span class="line"><span>2. 搜索功能优化（3月前）</span></span>
<span class="line"><span>   - 实现全文搜索</span></span>
<span class="line"><span>   - 添加搜索建议</span></span></code></pre></div><h3 id="实战-4-数据库——查询与分析" tabindex="-1">实战 4：数据库——查询与分析 <a class="header-anchor" href="#实战-4-数据库——查询与分析" aria-label="Permalink to &quot;实战 4：数据库——查询与分析&quot;">​</a></h3><p>连接数据库是 MCP 最实用的场景之一。 <code>@bytebase/dbhub</code> 支持 PostgreSQL、MySQL、SQLite 等多种数据库：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;database&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;npx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;-y&quot;, &quot;&amp;#64;bytebase/dbhub&quot;, &quot;--dsn&quot;, &quot;\${DATABASE_URL}&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>DATABASE_URL</code> 格式为 <code>postgresql://user:password@localhost:5432/mydb</code>。建议使用只读账户，防止 Claude 误操作修改数据。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我查一下数据库里上个月的订单数量和总金额</span></span></code></pre></div><p>Claude输出如下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>查询数据库...</span></span>
<span class="line"><span>[调用 database MCP server → run_query]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>上个月（2025年12月）的订单统计：</span></span>
<span class="line"><span>- 订单数量：1,234 笔</span></span>
<span class="line"><span>- 总金额：¥456,789.00</span></span>
<span class="line"><span>- 平均客单价：¥370.21</span></span></code></pre></div><p>把上面几个服务组合到一起，你就拥有了一个连接多个系统的完整工具箱。</p><p>以下是一个面向全栈开发者的 <code>.mcp.json</code> 配置：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;context7&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;npx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;-y&quot;, &quot;&amp;#64;upstash/context7-mcp&amp;#64;latest&quot;]</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;github&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;https://api.githubcopilot.com/mcp/&quot;,</span></span>
<span class="line"><span>      &quot;headers&quot;: {</span></span>
<span class="line"><span>        &quot;Authorization&quot;: &quot;Bearer \${GITHUB_TOKEN}&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;notion&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>      &quot;url&quot;: &quot;https://mcp.notion.com/mcp&quot;,</span></span>
<span class="line"><span>      &quot;headers&quot;: {</span></span>
<span class="line"><span>        &quot;Authorization&quot;: &quot;Bearer \${NOTION_API_KEY}&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;database&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;npx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;-y&quot;, &quot;&amp;#64;bytebase/dbhub&quot;, &quot;--dsn&quot;, &quot;\${DATABASE_URL}&quot;]</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;fetch&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;uvx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;mcp-server-fetch&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对应的 <code>.env</code> 文件（绝对不要提交到版本控制）：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx</span></span>
<span class="line"><span>DATABASE_URL=postgresql://readonly:password&amp;#64;localhost:5432/mydb</span></span>
<span class="line"><span>NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx</span></span></code></pre></div><p>有了这个配置，你在终端里的对话可以跨越多个系统而不中断上下文。你可以一边讨论代码中的 Bug，一边查数据库确认问题，一边创建 GitHub Issue，一边翻 Notion 需求文档——Claude 全程保持上下文，不需要你在五个工具间来回切换。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/037bbb7069f48c373aef35cb976c680c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/037bbb7069f48c373aef35cb976c680c.jpg" alt=""></a><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/3f87d8a92d2c698609f93f7c28836454.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/3f87d8a92d2c698609f93f7c28836454.jpg" alt=""></a></p><h2 id="创建自定义-mcp-服务器" tabindex="-1">创建自定义 MCP 服务器 <a class="header-anchor" href="#创建自定义-mcp-服务器" aria-label="Permalink to &quot;创建自定义 MCP 服务器&quot;">​</a></h2><p>当现有的 MCP 服务器无法满足需求时，你可以创建自己的。MCP 官方提供了 TypeScript 和 Python 两套 SDK，开发一个基本的 MCP Server 只需要几十行代码。</p><h3 id="typescript-sdk" tabindex="-1">TypeScript SDK <a class="header-anchor" href="#typescript-sdk" aria-label="Permalink to &quot;TypeScript SDK&quot;">​</a></h3><p>TypeScript SDK 是使用最广泛的 MCP 开发工具。安装依赖：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npm install &amp;#64;modelcontextprotocol/sdk zod</span></span></code></pre></div><p>下面是一个完整的 Todo 管理 MCP Server（ <code>src/index.ts</code>）。它定义了三个工具（添加、列出、完成待办）和一个资源（统计信息）。注意每个工具都有名称、描述、参数 schema 和处理函数——Claude 通过描述来决定何时调用这个工具：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { McpServer } from &quot;&amp;#64;modelcontextprotocol/sdk/server/mcp.js&quot;;</span></span>
<span class="line"><span>import { StdioServerTransport } from &quot;&amp;#64;modelcontextprotocol/sdk/server/stdio.js&quot;;</span></span>
<span class="line"><span>import { z } from &quot;zod&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 内存存储</span></span>
<span class="line"><span>const todos: { id: string; text: string; done: boolean }[] = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 创建 MCP 服务器</span></span>
<span class="line"><span>const server = new McpServer({</span></span>
<span class="line"><span>  name: &quot;my-todo-server&quot;,</span></span>
<span class="line"><span>  version: &quot;1.0.0&quot;,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义工具：添加待办</span></span>
<span class="line"><span>server.tool(</span></span>
<span class="line"><span>  &quot;todo_add&quot;,</span></span>
<span class="line"><span>  &quot;Add a new todo item&quot;,</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    text: z.string().describe(&quot;The todo text&quot;),</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  async ({ text }) =&amp;gt; {</span></span>
<span class="line"><span>    const todo = {</span></span>
<span class="line"><span>      id: Math.random().toString(36).substring(2, 9),</span></span>
<span class="line"><span>      text,</span></span>
<span class="line"><span>      done: false,</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    todos.push(todo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      content: [</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>          type: &quot;text&quot;,</span></span>
<span class="line"><span>          text: \`Added todo: \${todo.id} - \${todo.text}\`,</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>      ],</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义工具：列出待办</span></span>
<span class="line"><span>server.tool(</span></span>
<span class="line"><span>  &quot;todo_list&quot;,</span></span>
<span class="line"><span>  &quot;List all todo items&quot;,</span></span>
<span class="line"><span>  {},</span></span>
<span class="line"><span>  async () =&amp;gt; {</span></span>
<span class="line"><span>    const text = todos.length === 0</span></span>
<span class="line"><span>      ? &quot;No todos found.&quot;</span></span>
<span class="line"><span>      : todos</span></span>
<span class="line"><span>          .map((t) =&amp;gt; \`[\${t.done ? &quot;x&quot; : &quot; &quot;}] \${t.id}: \${t.text}\`)</span></span>
<span class="line"><span>          .join(&quot;\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      content: [{ type: &quot;text&quot;, text: \`Todos:\\n\${text}\` }],</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义工具：完成待办</span></span>
<span class="line"><span>server.tool(</span></span>
<span class="line"><span>  &quot;todo_complete&quot;,</span></span>
<span class="line"><span>  &quot;Mark a todo as completed&quot;,</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    id: z.string().describe(&quot;The todo ID&quot;),</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  async ({ id }) =&amp;gt; {</span></span>
<span class="line"><span>    const todo = todos.find((t) =&amp;gt; t.id === id);</span></span>
<span class="line"><span>    if (!todo) {</span></span>
<span class="line"><span>      return {</span></span>
<span class="line"><span>        content: [{ type: &quot;text&quot;, text: \`Todo not found: \${id}\` }],</span></span>
<span class="line"><span>        isError: true,</span></span>
<span class="line"><span>      };</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    todo.done = true;</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      content: [{ type: &quot;text&quot;, text: \`Completed: \${todo.text}\` }],</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义资源：统计信息</span></span>
<span class="line"><span>server.resource(</span></span>
<span class="line"><span>  &quot;stats&quot;,</span></span>
<span class="line"><span>  &quot;stats://current&quot;,</span></span>
<span class="line"><span>  async (uri) =&amp;gt; {</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      contents: [</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>          uri: uri.href,</span></span>
<span class="line"><span>          mimeType: &quot;application/json&quot;,</span></span>
<span class="line"><span>          text: JSON.stringify({</span></span>
<span class="line"><span>            total: todos.length,</span></span>
<span class="line"><span>            completed: todos.filter((t) =&amp;gt; t.done).length,</span></span>
<span class="line"><span>            pending: todos.filter((t) =&amp;gt; !t.done).length,</span></span>
<span class="line"><span>          }, null, 2),</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>      ],</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 启动服务器</span></span>
<span class="line"><span>async function main() {</span></span>
<span class="line"><span>  const transport = new StdioServerTransport();</span></span>
<span class="line"><span>  await server.connect(transport);</span></span>
<span class="line"><span>  console.error(&quot;MCP Server started&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main().catch(console.error);</span></span></code></pre></div><h3 id="python-sdk" tabindex="-1">Python SDK <a class="header-anchor" href="#python-sdk" aria-label="Permalink to &quot;Python SDK&quot;">​</a></h3><p>Python 版本使用装饰器风格，对 Python 开发者来说更加自然。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip install mcp</span></span>
<span class="line"><span>from mcp.server.fastmcp import FastMCP</span></span>
<span class="line"><span></span></span>
<span class="line"><span>server = FastMCP(&quot;my-todo-server&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>todos = []</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;server.tool(&quot;todo_add&quot;)</span></span>
<span class="line"><span>async def add_todo(text: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Add a new todo item&quot;&quot;&quot;</span></span>
<span class="line"><span>    import random</span></span>
<span class="line"><span>    import string</span></span>
<span class="line"><span>    todo_id = &#39;&#39;.join(random.choices(string.ascii_lowercase, k=7))</span></span>
<span class="line"><span>    todos.append({&quot;id&quot;: todo_id, &quot;text&quot;: text, &quot;done&quot;: False})</span></span>
<span class="line"><span>    return f&quot;Added todo: {todo_id} - {text}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;server.tool(&quot;todo_list&quot;)</span></span>
<span class="line"><span>async def list_todos() -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;List all todo items&quot;&quot;&quot;</span></span>
<span class="line"><span>    if not todos:</span></span>
<span class="line"><span>        return &quot;No todos found.&quot;</span></span>
<span class="line"><span>    return &quot;\\n&quot;.join(</span></span>
<span class="line"><span>        f&quot;[{&#39;x&#39; if t[&#39;done&#39;] else &#39; &#39;}] {t[&#39;id&#39;]}: {t[&#39;text&#39;]}&quot;</span></span>
<span class="line"><span>        for t in todos</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;server.tool(&quot;todo_complete&quot;)</span></span>
<span class="line"><span>async def complete_todo(id: str) -&amp;gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;Mark a todo as completed&quot;&quot;&quot;</span></span>
<span class="line"><span>    for todo in todos:</span></span>
<span class="line"><span>        if todo[&quot;id&quot;] == id:</span></span>
<span class="line"><span>            todo[&quot;done&quot;] = True</span></span>
<span class="line"><span>            return f&quot;Completed: {todo[&#39;text&#39;]}&quot;</span></span>
<span class="line"><span>    return f&quot;Todo not found: {id}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    server.run()</span></span></code></pre></div><h3 id="配置自定义服务器" tabindex="-1">配置自定义服务器 <a class="header-anchor" href="#配置自定义服务器" aria-label="Permalink to &quot;配置自定义服务器&quot;">​</a></h3><p>写完代码后在 <code>.mcp.json</code> 中注册。TypeScript 版本先编译再运行，Python 版本直接运行：</p><p><strong>TypeScript 版本：</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;my-todo&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;node&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;./mcp-server/build/index.js&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Python 版本：</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;my-todo&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;python&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [&quot;./mcp-server/server.py&quot;]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="_5条mcp安全原则" tabindex="-1">5条MCP安全原则 <a class="header-anchor" href="#_5条mcp安全原则" aria-label="Permalink to &quot;5条MCP安全原则&quot;">​</a></h2><p>MCP 的强大能力也带来了安全风险。它本质上是在给 AI Agent 开放访问外部系统的权限。正如 <a href="https://code.claude.com/docs/en/mcp" target="_blank" rel="noreferrer">Anthropic 官方警告</a> 里说的：</p><blockquote><p>使用第三方 MCP 服务器需自担风险。Anthropic 未验证所有服务器的正确性和安全性。</p><p>这里给出五条MCP使用的安全原则。</p></blockquote><p><strong>1. 验证服务器来源</strong>——只使用官方或知名来源的 MCP 服务器。一个恶意的 MCP Server 可以在你不知情的情况下读取敏感文件、窃取环境变量中的密钥。</p><p><strong>2. 限制权限范围</strong>——遵循最小权限原则，只给必要的目录和资源访问：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;mcpServers&quot;: {</span></span>
<span class="line"><span>    &quot;filesystem&quot;: {</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;stdio&quot;,</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;npx&quot;,</span></span>
<span class="line"><span>      &quot;args&quot;: [</span></span>
<span class="line"><span>        &quot;&amp;#64;modelcontextprotocol/server-filesystem&quot;,</span></span>
<span class="line"><span>        &quot;/safe/directory/only&quot;</span></span>
<span class="line"><span>      ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>3. 使用只读凭证</strong>——对于数据库等关键系统，永远不要给 MCP Server 写权限——除非你明确需要 Claude 修改数据。 <strong>4. 保护敏感凭证</strong>——绝对不要在配置文件中硬编码 Token。使用环境变量引用，将敏感值存在不提交到 git 的文件中。</p><p><strong>5. 审计 MCP 服务器代码</strong>——对于开源服务器，在使用前检查其代码：它请求哪些权限？它如何处理用户数据？花十分钟审计代码，可能帮你避免一次严重的安全事故。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/b19c952d151228c2ff36e40dc548c37e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/b19c952d151228c2ff36e40dc548c37e.png" alt="图片"></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/10d293b9f6474fca5741596c277a0f80.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/10d293b9f6474fca5741596c277a0f80.jpg" alt=""></a></p><h2 id="调试与故障排除" tabindex="-1">调试与故障排除 <a class="header-anchor" href="#调试与故障排除" aria-label="Permalink to &quot;调试与故障排除&quot;">​</a></h2><p>MCP 配置好之后，可能不会一次就跑通。Claude Code 内置了调试工具：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 列出所有配置的服务器</span></span>
<span class="line"><span>claude mcp list</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查看服务器详细信息</span></span>
<span class="line"><span>claude mcp get my-server</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 启用调试模式查看 MCP 连接详情</span></span>
<span class="line"><span>claude --debug</span></span></code></pre></div><p>常见问题速查表如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/00feb48bd28c519af480fa0ab7d96647.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/00feb48bd28c519af480fa0ab7d96647.jpg" alt=""></a></p><p>MCP 工具可能产生大量输出。因此在Token的控制方面，Claude Code 对 MCP 输出提供了两级保护。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/7fbb1997774a2d9258deb08ae4ed6620.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/955015/7fbb1997774a2d9258deb08ae4ed6620.jpg" alt=""></a></p><p>如果需要处理大量数据，可以通过环境变量调整上限。但更好的做法是在 MCP Server 端做分页或摘要：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export MAX_MCP_OUTPUT_TOKENS=50000</span></span></code></pre></div><h2 id="总结一下" tabindex="-1">总结一下 <a class="header-anchor" href="#总结一下" aria-label="Permalink to &quot;总结一下&quot;">​</a></h2><p>这一讲我们学习了 Model Context Protocol (MCP)——AI 时代的 USB-C 接口。</p><p>MCP 解决了 AI 助手与外部世界连接的碎片化问题——从 M × N 个适配器简化为 M + N 个。它采用 Client-Server 架构，支持三种传输方式（stdio、HTTP、SSE），配置文件可版本控制并团队共享。</p><p>生态系统是 MCP 最大的优势。官方提供文件系统、HTTP 请求、Git、PostgreSQL 等基础服务器；第三方则覆盖了 GitHub、Notion等主流服务。我们动手配置了几个最典型的 MCP 服务。当然，强大的能力也带来安全风险，我们给出了五条安全原则。更多的MCP相关细节，可以阅读我在极客时间的 <a href="https://time.geekbang.org/column/intro/101053801?utm_campaign=guanwang&amp;utm_content=0511&amp;utm_medium=geektime&amp;utm_source=pinpaizhuanqu&amp;utm_term=guanwang&amp;tab=catalog" target="_blank" rel="noreferrer">MCP专栏</a>。</p><p>写到这里，我们看到 MCP 让 Claude Code 从一个“只能操作本地文件”的工具，进化为“能连接整个数字世界”的智能助手。但这里有个有趣的问题——我感觉前面的基础篇课程中缺失了重要一环，就是Claude Code 内置的那些工具本身：Read、Write、Bash、Grep……这些“原生工具”是怎么组织的，以至于产生了那么强大的效果？这也值得我们好好思考思考。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>请你分享分享你在工作和个人项目中使用过哪些好用的MCP。</p></li><li><p>MCP 被称为AI 的 USB-C。这个类比在哪些方面贴切？有哪些方面可能不太准确？你可以从协议治理、版本兼容性、物理层 vs. 逻辑层等多个角度分析。</p></li><li><p>如果你要为公司内部系统创建一个 MCP 服务器，你会如何设计它的权限模型？考虑多租户隔离、操作审计日志、读写权限分级等维度。</p></li><li><p>MCP 服务器可能产生大量输出（比如数据库查询返回几万行）。除了截断，还有哪些方式可以优化这个问题？从服务器端分页、客户端摘要、流式处理等方向思考。</p></li><li><p>在团队协作场景中， <code>.mcp.json</code>（版本控制）和 <code>.claude/settings.local.json</code>（本地保存）的分工策略是什么？如果一个 MCP Server 既需要团队共享配置，又需要个人私有凭证，你会怎么设计？</p></li></ol><h2 id="下一讲预告" tabindex="-1">下一讲预告 <a class="header-anchor" href="#下一讲预告" aria-label="Permalink to &quot;下一讲预告&quot;">​</a></h2><p>MCP 让我们能连接外部世界，但 Claude Code 自身的工具系统——Read、Write、Bash、Grep、Glob、Agent……这十几个内置工具是怎么组织的？它们的权限如何控制？和 MCP 扩展的工具又是什么关系？</p><p>第 18 讲，我们将深入剖析 Claude Code 的 <strong>工具系统（Tools）全貌</strong>——从 Agentic Loop 的三个阶段、15+ 内置工具的分类与风险等级、五种软件工程原子操作，到工具的权限控制体系。这一节是新加进来的，我认为相当重要（本应放在基础篇，不过，因为目前大家知识体系已经全面，放在这里我们理解起来更深入），因为理解了工具系统，你才能真正理解 Claude Code 这台“AI 引擎”是如何运转的。</p><p>欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。</p>`,153)])])}const g=a(t,[["render",o]]);export{h as __pageData,g as default};
