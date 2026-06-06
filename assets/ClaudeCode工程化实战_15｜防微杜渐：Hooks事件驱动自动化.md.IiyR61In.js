import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const q=JSON.parse('{"title":"15｜防微杜渐：Hooks 事件驱动自动化","description":"","frontmatter":{},"headers":[{"level":2,"title":"Hooks 的本质——AI 时代的中间件","slug":"hooks-的本质——ai-时代的中间件","link":"#hooks-的本质——ai-时代的中间件","children":[]},{"level":2,"title":"17 种 Hook 事件——完整生命周期覆盖","slug":"_17-种-hook-事件——完整生命周期覆盖","link":"#_17-种-hook-事件——完整生命周期覆盖","children":[]},{"level":2,"title":"Hook 配置详解","slug":"hook-配置详解","link":"#hook-配置详解","children":[]},{"level":2,"title":"四种 Hook 执行类型","slug":"四种-hook-执行类型","link":"#四种-hook-执行类型","children":[]},{"level":2,"title":"PreToolUse：工具执行前的守门员","slug":"pretooluse-工具执行前的守门员","link":"#pretooluse-工具执行前的守门员","children":[]},{"level":2,"title":"PreToolUse实战案例1：阻止危险命令","slug":"pretooluse实战案例1-阻止危险命令","link":"#pretooluse实战案例1-阻止危险命令","children":[]},{"level":2,"title":"PreToolUse实战案例2：保护敏感文件","slug":"pretooluse实战案例2-保护敏感文件","link":"#pretooluse实战案例2-保护敏感文件","children":[]},{"level":2,"title":"PostToolUse：工具执行后的质量守卫","slug":"posttooluse-工具执行后的质量守卫","link":"#posttooluse-工具执行后的质量守卫","children":[]},{"level":2,"title":"PostToolUse实战案例1：自动格式化","slug":"posttooluse实战案例1-自动格式化","link":"#posttooluse实战案例1-自动格式化","children":[]},{"level":2,"title":"PostToolUse实战案例2：自动 Lint 检查","slug":"posttooluse实战案例2-自动-lint-检查","link":"#posttooluse实战案例2-自动-lint-检查","children":[]},{"level":2,"title":"PostToolUse实战案例3：审计日志","slug":"posttooluse实战案例3-审计日志","link":"#posttooluse实战案例3-审计日志","children":[]},{"level":2,"title":"总结一下","slug":"总结一下","link":"#总结一下","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"下一讲预告","slug":"下一讲预告","link":"#下一讲预告","children":[]}],"relativePath":"ClaudeCode工程化实战/15｜防微杜渐：Hooks事件驱动自动化.md","filePath":"ClaudeCode工程化实战/15｜防微杜渐：Hooks事件驱动自动化.md","lastUpdated":1779815462000}'),o={name:"ClaudeCode工程化实战/15｜防微杜渐：Hooks事件驱动自动化.md"};function t(l,s,i,c,u,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_15-防微杜渐-hooks-事件驱动自动化" tabindex="-1">15｜防微杜渐：Hooks 事件驱动自动化 <a class="header-anchor" href="#_15-防微杜渐-hooks-事件驱动自动化" aria-label="Permalink to &quot;15｜防微杜渐：Hooks 事件驱动自动化&quot;">​</a></h1><blockquote><p><strong>释题：防微杜渐。</strong> 在 Claude 执行工具前后插入自定义检查，阻止危险命令、保护敏感文件、自动格式化代码——在小问题萌芽时就防止它演变成灾难。</p></blockquote><p>你好，我是黄佳。</p><p>前面我们学习了 Skills 的完整知识体系——从知识工程到系统集成，从按需加载到跨平台通用。Skills 告诉 Claude“怎么做”，Commands 告诉 Claude“做什么”。但有一个关键问题它们都解决不了—— <strong>Claude 能不能做？</strong></p><p>今天我们进入一个全新的领域——Hooks，事件驱动自动化。它是 Claude Code 三大扩展机制中唯一能 <strong>拦截和修改</strong> Claude 行为的机制，也是工程化实践中安全防线的最后一道闸门。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/9c90ebf00b10c2424c986d2aa4f1c076.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/9c90ebf00b10c2424c986d2aa4f1c076.jpg" alt=""></a></p><p>举个例子，咖哥用 Claude Code 快速写完了代码，测试通过， <code>git push</code>，然后关机睡觉。</p><p>这种AI辅助下的快速迭代，代价有时候是灾难性的。安全漏洞、敏感信息泄露、代码格式混乱、测试没跑就上线……这些问题的共同点是： <strong>它们本可以被自动阻止</strong>。</p><p>如果有一道看不见的防线，在代码提交前自动检查敏感文件、在文件保存后自动格式化、在 Claude 完成任务时自动运行测试——那些“忘记”就不再是问题。</p><p>这道防线，就是 <strong>Hooks</strong>。</p><h2 id="hooks-的本质——ai-时代的中间件" tabindex="-1">Hooks 的本质——AI 时代的中间件 <a class="header-anchor" href="#hooks-的本质——ai-时代的中间件" aria-label="Permalink to &quot;Hooks 的本质——AI 时代的中间件&quot;">​</a></h2><p>如果你有 Web 开发经验，你一定熟悉中间件（Middleware）的概念。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请求 → 中间件1 → 中间件2 → 中间件3 → 处理函数</span></span>
<span class="line"><span>                    ↓</span></span>
<span class="line"><span>              认证、日志、限流</span></span></code></pre></div><p>中间件在请求到达最终处理函数之前插入检查和处理，实现横切关注点（Cross-cutting Concerns）。这些逻辑不属于任何一个业务功能，但又必须贯穿所有请求——认证要每个接口都检查，日志要每个操作都记录，限流要每个入口都控制。</p><p>Claude Code 的 Hooks 机制与此异曲同工，但它针对的不是 HTTP 请求，而是 <strong>AI Agent 的工具调用。</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>用户请求 → Claude 决策 → [PreToolUse Hook] → 工具执行 → [PostToolUse Hook] → 响应</span></span>
<span class="line"><span>                              ↓                            ↓</span></span>
<span class="line"><span>                         权限检查、拦截             格式化、验证、日志</span></span></code></pre></div><p><strong>Hooks 是 AI 助手的中间件——拦截、监控、增强每一次交互。</strong> 这个类比不仅是形象上的相似。Web 中间件解决的核心问题是“业务代码不应该操心安全和日志”，Hooks 解决的核心问题也一样—— <strong>Claude 不应该操心格式化和权限检查，它只管写好代码就行</strong>。安全防线、质量守卫、审计日志，全部由 Hooks 在“幕后”自动完成。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/d07b969b0b11d91fb59130ab3bd94de3.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/d07b969b0b11d91fb59130ab3bd94de3.jpg" alt=""></a></p><p>和 Commands 和 Skills 相比， <strong>Hooks 是三者中唯一能拦截和修改 Claude 行为的机制</strong>。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/13906a8b2a823e42c95142a7769d4a48.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/13906a8b2a823e42c95142a7769d4a48.jpg" alt=""></a></p><p>这三者构成了一个完整的控制谱系。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/048eeb5e4d39368293b40d66c0bd5055.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/048eeb5e4d39368293b40d66c0bd5055.jpg" alt=""></a></p><p>如果把 Claude 比作一个工程师，Commands 是你给他下达的任务指令，Skills 是他掌握的领域知识，而 Hooks 是公司的安全制度和质量规范—— <strong>不管你做什么任务、用什么知识，这些制度都在背后默默运行</strong>。</p><h2 id="_17-种-hook-事件——完整生命周期覆盖" tabindex="-1">17 种 Hook 事件——完整生命周期覆盖 <a class="header-anchor" href="#_17-种-hook-事件——完整生命周期覆盖" aria-label="Permalink to &quot;17 种 Hook 事件——完整生命周期覆盖&quot;">​</a></h2><p>截至2026年3月，根据 <a href="https://code.claude.com/docs/en/hooks-guide" target="_blank" rel="noreferrer">Anthropic 官方文档</a>，Claude Code 支持 <strong>17 种</strong> Hook 事件，覆盖了从会话启动到结束的完整生命周期：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/b4e66998aed2ce300ac39fbcbd708e76.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/b4e66998aed2ce300ac39fbcbd708e76.jpg" alt=""></a></p><p>17 个事件，乍看数量不少，但它们的设计逻辑非常清晰——按照“能否阻止”这一列来看，整个事件体系分为三大阵营。</p><ul><li><p><strong>控制点，能阻止的事件</strong>（PreToolUse、UserPromptSubmit、Stop、SubagentStop）：你可以通过它们改变 Claude 的执行路径——拦截危险操作、拒绝不合理的输入、强制 Claude 继续修复。它们是 Hooks 系统的肌肉。</p></li><li><p><strong>接管点，替代默认行为的事件</strong>（PermissionRequest）：它不是简单地阻止，而是接管了原本由用户手动处理的权限弹窗——你的脚本可以自动批准或拒绝权限请求，替代人类的决策。它是 Hooks 系统的自动驾驶。</p></li><li><p><strong>观察点，不能阻止的事件</strong>（SessionStart、PostToolUse、PostToolUseFailure、Notification、SubagentStart、PreCompact、SessionEnd）：你只能在这些时刻做记录、做反馈、做后处理，但不能改变已经发生的事情。它们是 Hooks 系统的眼睛。</p></li></ul><p>这种不对称设计是有意为之的。工具执行前可以拦截，因为操作还没发生，拦截不会造成不一致状态。工具执行后不能拦截，因为操作已经完成，你不能“取消”一个已经写入磁盘的文件。但你可以观察它、记录它、反馈它。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/07b1d5494be56d04c055d74179a8c200.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/07b1d5494be56d04c055d74179a8c200.jpg" alt=""></a></p><h2 id="hook-配置详解" tabindex="-1">Hook 配置详解 <a class="header-anchor" href="#hook-配置详解" aria-label="Permalink to &quot;Hook 配置详解&quot;">​</a></h2><p>掌握了事件体系，下面来看具体怎么配置。Hooks 可以在多个位置配置，每个位置有不同的作用域和共享策略。</p><p>最后一行值得特别关注， <strong>Hooks 可以直接定义在子代理的 frontmatter 中</strong>，只在该子代理执行期间生效。这比在全局 settings.json 中配置更精准，后面会详细讲解。</p><p>怎么选择配置位置？一个简单的判断流程：</p><ul><li><p><strong>用户级</strong>（ <code>~/.claude/settings.json</code>）：个人习惯。比如你喜欢的日志格式、桌面通知方式。这些配置只影响你自己，不需要和团队同步。</p></li><li><p><strong>项目级</strong>（ <code>.claude/settings.json</code>）：团队约定。比如代码格式化规则、敏感文件保护列表。这些配置应该提交到 git，让团队所有成员共享。</p></li><li><p><strong>本地覆盖</strong>（ <code>.claude/settings.local.json</code>）：当你需要在本地临时覆盖团队配置时使用，比如调试时关闭某个 Hook。</p></li><li><p><strong>子代理 frontmatter</strong>：子代理专属的 Hook。比如 <code>db-reader</code> 的 SQL 注入检查——这个检查只和数据库操作相关，不应该影响其他场景。</p></li></ul><p>一个典型的 Hook 配置长这样：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Bash&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/block-dangerous.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Write&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;prettier --write $CLAUDE_FILE_PATH&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个 JSON 结构有三层嵌套，初看可能有点绕。让我用树形图来拆解它的逻辑层次。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>hooks                            ← 第一层：顶层容器</span></span>
<span class="line"><span>├── PreToolUse                   ← 第二层：事件类型（什么时候触发）</span></span>
<span class="line"><span>│   └── [第一组规则]</span></span>
<span class="line"><span>│       ├── matcher: &quot;Bash&quot;      ← 第三层：匹配器（针对哪个工具）</span></span>
<span class="line"><span>│       └── hooks: [...]         ← 第三层：Hook 列表（执行什么）</span></span>
<span class="line"><span>│           └── type: &quot;command&quot;</span></span>
<span class="line"><span>│           └── command: &quot;...&quot;</span></span>
<span class="line"><span>└── PostToolUse</span></span>
<span class="line"><span>    └── [第二组规则]</span></span>
<span class="line"><span>        ├── matcher: &quot;Write&quot;</span></span>
<span class="line"><span>        └── hooks: [...]</span></span></code></pre></div><p><strong>第一层</strong> 选择“什么时候”——在工具执行前还是执行后？ <strong>第二层</strong> 选择“针对谁”——是所有工具还是特定工具？ <strong>第三层</strong> 选择“做什么”——执行脚本、调用 LLM、还是启动子代理？三层决策，层层收窄，最终精准地把正确的检查逻辑应用到正确的时机和工具上。</p><p><strong>Matcher 匹配</strong> 用于指定 Hook 应用于哪些工具。它支持四种匹配模式：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 精确匹配单个工具</span></span>
<span class="line"><span>&quot;matcher&quot;: &quot;Write&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 匹配多个工具（用竖线分隔）</span></span>
<span class="line"><span>&quot;matcher&quot;: &quot;Edit|Write|MultiEdit&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 匹配所有工具</span></span>
<span class="line"><span>&quot;matcher&quot;: &quot;*&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 空匹配（用于生命周期事件）</span></span>
<span class="line"><span>&quot;matcher&quot;: &quot;&quot;</span></span></code></pre></div><p>精确匹配是最常用的模式——你通常知道你要保护的是哪个工具。竖线分隔适合“同类工具组”的场景，比如 <code>Edit|Write|MultiEdit</code> 都涉及文件修改，用同一个保护策略。通配符 <code>*</code> 要谨慎使用，它会匹配所有工具，适合审计日志这类无差别记录的场景。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/9deae2a1ab10d8a0c1b8a1ec543fe81b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/9deae2a1ab10d8a0c1b8a1ec543fe81b.jpg" alt=""></a></p><h2 id="四种-hook-执行类型" tabindex="-1">四种 Hook 执行类型 <a class="header-anchor" href="#四种-hook-执行类型" aria-label="Permalink to &quot;四种 Hook 执行类型&quot;">​</a></h2><p>当一个Hook被触发后，其具体执行方式有四种，前三种能力和代价逐级递增，第四种面向远程服务场景。</p><p><strong>Command 类型——执行 Shell 脚本</strong></p><p>这是最常用、最可靠的类型。 <code>command</code> 可以是任何 shell 命令或脚本路径。 <code>timeout</code> 指定超时时间（毫秒），默认 60 秒。Command 类型的优势在于 <strong>确定性</strong>——同样的输入永远产生同样的输出，不存在 LLM 的随机性。一个正则表达式匹配 <code>rm -rf /</code>，要么匹配到，要么没匹配到，没有“可能”“大概”的中间地带。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>  &quot;command&quot;: &quot;./hooks/check-security.sh&quot;,</span></span>
<span class="line"><span>  &quot;timeout&quot;: 30000</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Prompt 类型——LLM 评估</strong></p><p>当规则无法用确定性脚本表达时，就需要 LLM 的判断力。Prompt 类型会用一个小型 LLM（通常是 Haiku）来评估当前情况。比如“这段代码是否有安全隐患”——这种判断需要理解代码语义，不是简单的模式匹配能解决的。但 Prompt 类型只能“看一眼就判断”，它无法主动去读取更多文件来辅助决策。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;type&quot;: &quot;prompt&quot;,</span></span>
<span class="line"><span>  &quot;prompt&quot;: &quot;Evaluate if this task was completed correctly. Check for any errors or incomplete work.&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Agent 类型——子代理评估</strong></p><p>这是最强大也最“重”的评估方式。 <strong>Agent Hook 会启动一个子代理</strong>，这个子代理可以使用 Read、Grep、Glob 等工具来验证条件——不只是“看一眼就判断”，而是可以“翻代码确认”。比如验证“所有公共 API 都有文档注释”，需要子代理实际遍历代码文件才能做出准确判断。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;type&quot;: &quot;agent&quot;,</span></span>
<span class="line"><span>  &quot;prompt&quot;: &quot;Verify that all unit tests pass. Run the test suite and check the results. $ARGUMENTS&quot;,</span></span>
<span class="line"><span>  &quot;timeout&quot;: 120</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>还有一种 <strong>HTTP 类型</strong>——它不在本地执行逻辑，而是把事件数据以 POST 请求发送到远程 HTTP 端点，由远程服务返回决策结果。适合团队共享审计服务、集中式安全扫描等场景。我们会在下一讲详细展开。</p><p>四种类型的选择策略是怎样的呢？</p><p>一句话概括： <strong>能用 command 的不用 prompt，能用 prompt 的不用 agent，需要对接远程服务时用 http</strong>。确定性规则永远比 LLM 判断更可靠，LLM 判断比子代理执行更快。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/f81d08bee3ce830e0bdf6778ba6f0d7b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/f81d08bee3ce830e0bdf6778ba6f0d7b.jpg" alt=""></a></p><h2 id="pretooluse-工具执行前的守门员" tabindex="-1">PreToolUse：工具执行前的守门员 <a class="header-anchor" href="#pretooluse-工具执行前的守门员" aria-label="Permalink to &quot;PreToolUse：工具执行前的守门员&quot;">​</a></h2><p>PreToolUse 是最强大的 Hook 事件，因为它能 <strong>阻止</strong> 工具执行。它就像机场的安检门——在你登机（工具执行）之前，先过一道检查。PreToolUse Hook 可以做三件事： <strong>允许</strong>（allow，放行）， <strong>拒绝</strong>（deny，拦截）， <strong>修改</strong>（updatedInput，改写输入参数后再执行）。</p><p>第三种能力特别有趣——你不仅能“放行或拦截”，还能“偷偷改参数”。比如用户要执行 <code>rm -rf /tmp/test</code>，你可以把它改成 <code>rm -rf /tmp/test --dry-run</code>，先看看会删什么再说。</p><p>要写出有效的 PreToolUse Hook，你需要理解它的通信协议——脚本从 stdin 读入什么数据、向 Claude 返回什么决策。我们快速过一遍，然后直接进入实战。</p><p>每个 Hook 脚本通过 stdin 接收一个 JSON 对象，包含做出判断所需的全部上下文。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;session_id&quot;: &quot;abc123&quot;,</span></span>
<span class="line"><span>  &quot;transcript_path&quot;: &quot;/path/to/transcript.jsonl&quot;,</span></span>
<span class="line"><span>  &quot;cwd&quot;: &quot;/project/root&quot;,</span></span>
<span class="line"><span>  &quot;permission_mode&quot;: &quot;default&quot;,</span></span>
<span class="line"><span>  &quot;hook_event_name&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>  &quot;tool_name&quot;: &quot;Bash&quot;,</span></span>
<span class="line"><span>  &quot;tool_input&quot;: {</span></span>
<span class="line"><span>    &quot;command&quot;: &quot;rm -rf /tmp/test&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些字段告诉你： <strong>谁</strong> 在执行（session_id）， <strong>在哪里</strong> 执行（cwd）， <strong>什么权限</strong> 模式（permission_mode），要执行 <strong>什么工具</strong>（tool_name）， <strong>什么参数</strong>（tool_input）。有了这些信息，你的脚本就能精准判断这个操作是否安全。</p><p>Hook 脚本通过退出码和 stdout JSON 告诉 Claude 下一步做什么。</p><p>最简单的方式是用退出码—— <code>exit 0</code> 表示放行， <code>exit 2</code> 表示阻止，其他非零退出码表示脚本出错但不阻止。这个区分很重要： <strong>脚本出错不应该阻止正常工作流</strong>——你的安全检查脚本因为 <code>jq</code> 没安装而报错退出码 1，这不应该阻止 Claude 执行一个完全安全的命令。只有退出码 2 才表示“我检查过了，这个操作确实危险”。</p><p>需要更精细的控制时，通过 stdout 输出 JSON 决策。官方推荐的 <code>hookSpecificOutput</code> 格式支持四种响应方式。</p><p><strong>允许执行</strong>——检查通过，放行（ <code>exit 0</code> 就等于默认允许，输出 JSON 让意图更明确）。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>    &quot;permissionDecision&quot;: &quot;allow&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>拒绝执行</strong>——发现危险操作，直接拦截。 <code>permissionDecisionReason</code> 会反馈给 Claude。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>    &quot;permissionDecision&quot;: &quot;deny&quot;,</span></span>
<span class="line"><span>    &quot;permissionDecisionReason&quot;: &quot;This command is not allowed&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>交给用户确认</strong>——操作不是明确的“安全”或“危险”，而是“需要人类判断”。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>    &quot;permissionDecision&quot;: &quot;ask&quot;,</span></span>
<span class="line"><span>    &quot;permissionDecisionReason&quot;: &quot;This command modifies production data&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>修改输入后执行</strong>——不拦截操作，而是改写参数后放行：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>    &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>    &quot;permissionDecision&quot;: &quot;allow&quot;,</span></span>
<span class="line"><span>    &quot;updatedInput&quot;: {</span></span>
<span class="line"><span>      &quot;command&quot;: &quot;rm -rf /tmp/test --dry-run&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/d4c65eb9c0e1dfeb402ebe77d27d7963.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/d4c65eb9c0e1dfeb402ebe77d27d7963.jpg" alt=""></a></p><p>这四种响应方式构成了一个连续光谱：allow → ask → deny，外加一个“暗中修正”的 updatedInput。实际设计中，优先选择最温和的响应—— <strong>能 allow 的不 ask，能 ask 的不 deny</strong>。</p><p>协议讲完了，下面进入实战。</p><p>本讲所有示例代码位于 <code>06-Hooks/projects/</code> 下两个项目中，均已配好 <code>.claude/settings.json</code>，脚本已有执行权限，可独立运行（依赖 <code>jq</code>）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/a4039736960956e8cce687a45666f580.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/a4039736960956e8cce687a45666f580.jpg" alt=""></a></p><h2 id="pretooluse实战案例1-阻止危险命令" tabindex="-1">PreToolUse实战案例1：阻止危险命令 <a class="header-anchor" href="#pretooluse实战案例1-阻止危险命令" aria-label="Permalink to &quot;PreToolUse实战案例1：阻止危险命令&quot;">​</a></h2><p>现在来写我们的第一个 Hook——阻止可能造成灾难的命令。</p><p>每个工程团队都有一些“绝对不能执行”的命令。 <code>rm -rf /</code> 会删除整个文件系统， <code>git push --force origin main</code> 会覆盖远程主分支的历史， <code>DROP DATABASE</code> 会销毁整个数据库。这些命令的共同特点是： <strong>一旦执行就无法挽回</strong>。</p><p>人在清醒状态下当然不会执行它们，但 Claude 作为 AI 有时会过于“积极”——如果用户说”清理一下项目”，Claude 可能会把 <code>rm -rf</code> 理解得过于字面。</p><p>下面这个脚本用模式匹配来拦截这些灾难性命令：（脚本位于 <code>hooks/block-dangerous.sh</code>）</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># block-dangerous.sh</span></span>
<span class="line"><span># 阻止危险的 Bash 命令</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 读取 stdin 输入</span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 提取命令</span></span>
<span class="line"><span>COMMAND=$(echo &quot;$INPUT&quot; | jq -r &#39;.tool_input.command // &quot;&quot;&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 调试输出（到 stderr，不影响 JSON 响应）</span></span>
<span class="line"><span>echo &quot;DEBUG: Checking command: $COMMAND&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 危险命令模式</span></span>
<span class="line"><span>DANGEROUS_PATTERNS=(</span></span>
<span class="line"><span>    &quot;rm -rf /&quot;</span></span>
<span class="line"><span>    &quot;rm -rf ~&quot;</span></span>
<span class="line"><span>    &quot;rm -rf \\$HOME&quot;</span></span>
<span class="line"><span>    &quot;rm -rf /*&quot;</span></span>
<span class="line"><span>    &quot;&amp;gt; /dev/sd&quot;</span></span>
<span class="line"><span>    &quot;mkfs.&quot;</span></span>
<span class="line"><span>    &quot;dd if=&quot;</span></span>
<span class="line"><span>    &quot;:(){:|:&amp;};:&quot;               # Fork bomb</span></span>
<span class="line"><span>    &quot;chmod -R 777 /&quot;</span></span>
<span class="line"><span>    &quot;git push --force origin main&quot;</span></span>
<span class="line"><span>    &quot;git push --force origin master&quot;</span></span>
<span class="line"><span>    &quot;git reset --hard origin&quot;</span></span>
<span class="line"><span>    &quot;DROP DATABASE&quot;</span></span>
<span class="line"><span>    &quot;DROP TABLE&quot;</span></span>
<span class="line"><span>    &quot;TRUNCATE&quot;</span></span>
<span class="line"><span>    &quot;curl.*| sh&quot;                # 危险的管道执行</span></span>
<span class="line"><span>    &quot;curl.*| bash&quot;</span></span>
<span class="line"><span>    &quot;wget.*| sh&quot;</span></span>
<span class="line"><span>    &quot;wget.*| bash&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查每个危险模式</span></span>
<span class="line"><span>for pattern in &quot;\${DANGEROUS_PATTERNS[&amp;#64;]}&quot;; do</span></span>
<span class="line"><span>    if [[ &quot;$COMMAND&quot; == *&quot;$pattern&quot;* ]]; then</span></span>
<span class="line"><span>        echo &quot;BLOCKED: Command matches dangerous pattern: $pattern&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span>        cat &amp;lt;&amp;lt;EOF</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>        &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>        &quot;permissionDecision&quot;: &quot;deny&quot;,</span></span>
<span class="line"><span>        &quot;permissionDecisionReason&quot;: &quot;Blocked dangerous command pattern: $pattern. This command could cause irreversible damage.&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span>        exit 2</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 命令安全，允许执行</span></span>
<span class="line"><span>echo &#39;{}&#39;</span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>让我逐段解析这个脚本的设计思路。</p><p><code>INPUT=$(cat)</code> 从 stdin 读取 Claude 传入的 JSON 数据。 <code>jq -r &#39;.tool_input.command&#39;</code> 从中提取要执行的命令字符串。 <code>// &quot;&quot;</code> 是 jq 的空值保护——如果字段不存在，返回空字符串而不是报错。</p><p><code>echo &quot;DEBUG: ...&quot; &gt;&amp;2</code> 这一行值得特别说明： <strong>调试信息必须输出到 stderr（文件描述符 2），而不是 stdout</strong>。因为 stdout 被 Claude 用来读取 JSON 决策——如果你往 stdout 打了一行调试文本，Claude 会因为 JSON 解析失败而报错。这是 Hook 脚本开发中最常见的坑。</p><p><code>DANGEROUS_PATTERNS</code> 数组定义了所有需要拦截的命令模式。</p><p>注意最后的 <code>curl.*| sh</code> 和 <code>wget.*| bash</code>。这是一种常见的攻击手法：从网络下载脚本并直接执行，绕过任何安全审查。在 AI 辅助编程场景下，如果 Claude 从某个“教程”学到了这种做法，Hook 会自动拦截。</p><p>另外， <code>exit 2</code> 是“有意阻止”， <code>exit 0</code> 是“检查通过、放行”。整个脚本的逻辑就是一个黑名单匹配，命中任何一个危险模式就拦截，否则放行。</p><p>配置方式如下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Bash&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/block-dangerous.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>光看代码不直观，接下来我们动手试一下 <strong>。</strong> 我们在 Claude Code 里实际触发一次拦截：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/8e32292dea9bc68709bba8a8b90431a6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/8e32292dea9bc68709bba8a8b90431a6.jpg" alt=""></a></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 1. 确认 jq 可用</span></span>
<span class="line"><span>which jq</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2. 进入项目目录（已配好 .claude/settings.json 和 hooks 脚本）</span></span>
<span class="line"><span>cd 06-Hooks/projects/01-safety-hooks</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 3. 启动 Claude Code</span></span>
<span class="line"><span>claude</span></span></code></pre></div><p>进入会话后，故意让 Claude 执行一个危险命令：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请帮我执行 rm -rf /tmp/test，清理一下临时文件</span></span></code></pre></div><p>Claude 会尝试调用 Bash 工具执行这条命令。此时 PreToolUse Hook 自动触发，你会在终端看到类似这样的输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>⛔ Hook blocked tool call: Blocked dangerous command pattern: rm -rf /.</span></span>
<span class="line"><span>   This command could cause irreversible damage.</span></span></code></pre></div><p>Claude 收到拦截信息后，会自动调整策略——它不会傻傻地重试被拦截的命令，而是换一种更安全的方式来完成你的请求。 <strong>整个过程你什么都不用做，防线自动运行。</strong><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/c7ec7530fe120d438c2ee17c94f6b076.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/c7ec7530fe120d438c2ee17c94f6b076.png" alt="图片"></a></p><p>你也可以用管道手动验证脚本逻辑，不需要启动 Claude：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 危险命令 → 预期 deny（exit 2）</span></span>
<span class="line"><span>echo &#39;{&quot;tool_input&quot;:{&quot;command&quot;:&quot;rm -rf /&quot;}​}&#39; | ./hooks/block-dangerous.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 安全命令 → 预期 allow（exit 0）</span></span>
<span class="line"><span>echo &#39;{&quot;tool_input&quot;:{&quot;command&quot;:&quot;git status&quot;}​}&#39; | ./hooks/block-dangerous.sh</span></span></code></pre></div><p>现在，当 Claude（或者深夜加班的你）试图执行 <code>rm -rf /</code> 或 <code>git push --force origin main</code> 时，这个 Hook 会自动拦截并给出警告。不需要你时刻“记住“检查，不需要你保持清醒，提前做好Hook配置，那么防线将永远在线。</p><h2 id="pretooluse实战案例2-保护敏感文件" tabindex="-1">PreToolUse实战案例2：保护敏感文件 <a class="header-anchor" href="#pretooluse实战案例2-保护敏感文件" aria-label="Permalink to &quot;PreToolUse实战案例2：保护敏感文件&quot;">​</a></h2><p>另一个常见需求是保护敏感文件（如.env 文件）不被 Claude 修改，即使 Claude 出于好意想“帮你整理一下配置文件”，敏感文件也绝对不能被改写。如果你的威胁模型还要求“不被读取”，可以把 matcher 扩展到 Read，但要注意这会让 Claude 在调试与配置感知场景下被频繁打断。通常项目上读 .env 看一眼字段并不致命，写入或外发才是。</p><p>这种保护需要覆盖两个维度，文件本身（.env、credentials.json 等配置文件）和密钥文件（.pem、.key、id_rsa 等加密文件）。前者包含运行时密钥，后者包含身份认证凭据。任何被改写或被纳入提交的后果都是灾难性的。</p><p>脚本位于 <code>hooks/protect-files.sh</code>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># protect-files.sh</span></span>
<span class="line"><span># 保护敏感文件不被修改</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span>FILE_PATH=$(echo &quot;$INPUT&quot; | jq -r &#39;.tool_input.file_path // &quot;&quot;&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 如果没有文件路径，跳过检查</span></span>
<span class="line"><span>if [ -z &quot;$FILE_PATH&quot; ]; then</span></span>
<span class="line"><span>    echo &#39;{}&#39;</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 敏感文件模式</span></span>
<span class="line"><span>PROTECTED_PATTERNS=(</span></span>
<span class="line"><span>    &quot;.env&quot;</span></span>
<span class="line"><span>    &quot;.env.*&quot;</span></span>
<span class="line"><span>    &quot;credentials.json&quot;</span></span>
<span class="line"><span>    &quot;secrets.yaml&quot;</span></span>
<span class="line"><span>    &quot;secrets.yml&quot;</span></span>
<span class="line"><span>    &quot;*.pem&quot;</span></span>
<span class="line"><span>    &quot;*.key&quot;</span></span>
<span class="line"><span>    &quot;id_rsa&quot;</span></span>
<span class="line"><span>    &quot;id_ed25519&quot;</span></span>
<span class="line"><span>    &quot;.ssh/config&quot;</span></span>
<span class="line"><span>    &quot;kubeconfig&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for pattern in &quot;\${PROTECTED_PATTERNS[&amp;#64;]}&quot;; do</span></span>
<span class="line"><span>    if [[ &quot;$FILE_PATH&quot; == *$pattern* ]]; then</span></span>
<span class="line"><span>        cat &amp;lt;&amp;lt;EOF</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>        &quot;hookEventName&quot;: &quot;PreToolUse&quot;,</span></span>
<span class="line"><span>        &quot;permissionDecision&quot;: &quot;deny&quot;,</span></span>
<span class="line"><span>        &quot;permissionDecisionReason&quot;: &quot;Cannot modify sensitive file: $FILE_PATH. This file may contain secrets or credentials.&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span>        exit 2</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &#39;{}&#39;</span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>这个脚本的结构和 <code>block-dangerous.sh</code> 很像，都是黑名单匹配。但注意一个细节：它检查的是 <code>tool_input.file_path</code> 而不是 <code>tool_input.command</code>。不同的工具传入不同的参数字段——Bash 工具传 <code>command</code>，Write 和 Edit 工具传 <code>file_path</code>。你的 Hook 脚本需要知道自己在拦截哪个工具，才能提取正确的字段。</p><p>配置时，这个 Hook 要同时匹配 Write 和 Edit 两个工具。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Write|Edit&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/protect-files.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个 Hook 会阻止 Claude 修改任何看起来像是敏感文件的东西。即使 Claude 误判了用户的意图，敏感文件也不会被触碰。 <strong>安全防线的价值不在于它每天拦截多少次，而在于它在那个唯一需要的瞬间不会缺席。</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/7ee1b253b71ae63c52426079bccc34cf.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/953022/7ee1b253b71ae63c52426079bccc34cf.jpg" alt=""></a></p><h2 id="posttooluse-工具执行后的质量守卫" tabindex="-1">PostToolUse：工具执行后的质量守卫 <a class="header-anchor" href="#posttooluse-工具执行后的质量守卫" aria-label="Permalink to &quot;PostToolUse：工具执行后的质量守卫&quot;">​</a></h2><p>PostToolUse 在工具 <strong>成功执行后</strong> 运行。它不能阻止已经发生的操作（文件已经写入了，命令已经执行了），但它可以做三件同样重要的事情： <strong>后处理</strong>（格式化、清理）、 <strong>反馈</strong>（向 Claude 提供 lint 结果、警告）、 <strong>记录</strong>（写入审计日志）。</p><p>PostToolUse 接收的 JSON 比 PreToolUse 多一个关键字段—— <code>tool_response</code>，即工具执行的结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;session_id&quot;: &quot;abc123&quot;,</span></span>
<span class="line"><span>  &quot;hook_event_name&quot;: &quot;PostToolUse&quot;,</span></span>
<span class="line"><span>  &quot;tool_name&quot;: &quot;Write&quot;,</span></span>
<span class="line"><span>  &quot;tool_input&quot;: {</span></span>
<span class="line"><span>    &quot;file_path&quot;: &quot;/project/src/app.js&quot;,</span></span>
<span class="line"><span>    &quot;content&quot;: &quot;...&quot;</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  &quot;tool_response&quot;: {</span></span>
<span class="line"><span>    &quot;success&quot;: true,</span></span>
<span class="line"><span>    &quot;result&quot;: &quot;File written successfully&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了 <code>tool_response</code>，你的 Hook 脚本不仅知道“Claude 想做什么”，还将知道“做的结果怎样”。</p><p>PostToolUse 最强大的能力在于通过 <code>additionalContext</code> 向 Claude 反馈信息：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>    &quot;hookEventName&quot;: &quot;PostToolUse&quot;,</span></span>
<span class="line"><span>    &quot;additionalContext&quot;: &quot;ESLint found 3 errors in the file you just wrote.&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>additionalContext</code> 的内容会被注入到 Claude 的上下文中，Claude 会看到这条反馈并据此调整行为。比如你告诉它“ESLint 发现了 3 个错误”，它就会主动去修复这些错误。 <strong>这不是简单的日志记录，而是一个闭环反馈机制——Hook 观察到问题，反馈给 Claude，Claude 自动修复。</strong></p><p>下面我们通过三个经典实战案例来体会这些能力。</p><h2 id="posttooluse实战案例1-自动格式化" tabindex="-1">PostToolUse实战案例1：自动格式化 <a class="header-anchor" href="#posttooluse实战案例1-自动格式化" aria-label="Permalink to &quot;PostToolUse实战案例1：自动格式化&quot;">​</a></h2><p>这是最受欢迎的 PostToolUse 应用——每次 Claude 写入或修改文件后，自动运行格式化工具。</p><p>为什么自动格式化如此重要？因为 Claude 的代码风格和你团队的风格规范不一定一致。</p><p>Claude 可能用 2 空格缩进，你团队用 4 空格；Claude 可能不加尾逗号，你团队的 Prettier 配置要求加。每次手动跑 <code>prettier --write</code> 太麻烦，也容易忘记。PostToolUse Hook 把这件事彻底自动化了—— <strong>Claude 只管写代码，格式化自动发生</strong>。</p><p>脚本位于 <code>hooks/auto-format.sh</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># auto-format.sh</span></span>
<span class="line"><span># 自动格式化代码文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span>FILE_PATH=$(echo &quot;$INPUT&quot; | jq -r &#39;.tool_input.file_path // &quot;&quot;&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 如果没有文件路径或文件不存在，跳过</span></span>
<span class="line"><span>if [ -z &quot;$FILE_PATH&quot; ] || [ ! -f &quot;$FILE_PATH&quot; ]; then</span></span>
<span class="line"><span>    echo &#39;{}&#39;</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;DEBUG: Formatting file: $FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取文件扩展名</span></span>
<span class="line"><span>EXTENSION=&quot;\${FILE_PATH##*.}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 根据文件类型选择格式化工具</span></span>
<span class="line"><span>case &quot;$EXTENSION&quot; in</span></span>
<span class="line"><span>    js|jsx|ts|tsx|json|md|css|scss|html)</span></span>
<span class="line"><span>        if command -v npx &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            if npx prettier --write &quot;$FILE_PATH&quot; ; then</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with Prettier&quot;}​}&#39;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Prettier formatting failed&quot;}​}&#39;</span></span>
<span class="line"><span>            fi</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Prettier not available&quot;}​}&#39;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    py)</span></span>
<span class="line"><span>        if command -v black &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            if black &quot;$FILE_PATH&quot; &amp;gt;&amp;2; then</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with Black&quot;}​}&#39;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Black formatting failed&quot;}​}&#39;</span></span>
<span class="line"><span>            fi</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    go)</span></span>
<span class="line"><span>        if command -v gofmt &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            gofmt -w &quot;$FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span>            echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with gofmt&quot;}​}&#39;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    rs)</span></span>
<span class="line"><span>        if command -v rustfmt &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            rustfmt &quot;$FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span>            echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with rustfmt&quot;}​}&#39;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        echo &#39;{}&#39;</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>这个脚本有几个值得注意的设计决策。</p><ul><li><p><strong>多语言策略</strong>：通过文件扩展名自动选择格式化工具——JavaScript/TypeScript 用 Prettier，Python 用 Black，Go 用 gofmt，Rust 用 rustfmt。这意味着在一个多语言项目中，你只需要一个 Hook 脚本就能覆盖所有文件类型。</p></li><li><p><strong>优雅降级</strong>：每种工具的调用都先用 <code>command -v</code> 检查是否安装。如果 Prettier 没装，脚本不会报错崩溃，而是优雅地跳过并通过 <code>additionalContext</code> 告诉 Claude “Prettier not available”。这很重要， <strong>Hook 的失败不应该阻碍正常工作流</strong>。</p></li><li><p><strong>反馈闭环</strong>：格式化完成后，通过 <code>additionalContext</code> 告诉 Claude 用了什么工具格式化的。这不仅是日志记录，还让 Claude 知道格式化已经发生，它不需要自己再做一次。</p></li><li><p><strong>stdout 纪律</strong>：注意脚本里所有格式化工具的调用都用  <code>&gt;&amp;2 </code> 把输出重定向到 stderr，这是 Hook 脚本必须遵守的纪律。Claude Code 会解析 stdout 当作 JSON 反馈，如果 Prettier、Black、gofmt 这些工具的运行日志混进 stdout（比如错写成  <code>2&gt;&amp;1 </code>），就会让 stdout 变成“日志 + JSON”的混合体，Claude Code 解析失败。记住一条原则：Hook 脚本的 stdout 只放结构化 JSON，所有人类可读的日志一律走 stderr。</p></li></ul><p>这个 Hook 的美妙之处在于， <strong>Claude 不需要知道项目用什么格式化工具</strong>。无论是 Prettier、Black、gofmt 还是 rustfmt，只要本地安装了，就会自动应用。这就是中间件的力量——业务逻辑（Claude 写代码）和横切关注点（格式化）完全解耦。</p><h2 id="posttooluse实战案例2-自动-lint-检查" tabindex="-1">PostToolUse实战案例2：自动 Lint 检查 <a class="header-anchor" href="#posttooluse实战案例2-自动-lint-检查" aria-label="Permalink to &quot;PostToolUse实战案例2：自动 Lint 检查&quot;">​</a></h2><p>格式化解决了“代码长什么样”的问题，Lint 检查解决的是“代码有没有问题”。两者结合，构成了一个完整的代码质量反馈循环：Claude 写代码 → 自动格式化 → 自动 Lint → 发现问题 → Claude 收到反馈 → Claude 修复。这个循环全部自动发生，无需人工介入。</p><p>脚本位于 <code>hooks/lint-check.sh</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># auto-format.sh</span></span>
<span class="line"><span># 自动格式化代码文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span>FILE_PATH=$(echo &quot;$INPUT&quot; | jq -r &#39;.tool_input.file_path // &quot;&quot;&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 如果没有文件路径或文件不存在，跳过</span></span>
<span class="line"><span>if [ -z &quot;$FILE_PATH&quot; ] || [ ! -f &quot;$FILE_PATH&quot; ]; then</span></span>
<span class="line"><span>    echo &#39;{}&#39;</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;DEBUG: Formatting file: $FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取文件扩展名</span></span>
<span class="line"><span>EXTENSION=&quot;\${FILE_PATH##*.}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 根据文件类型选择格式化工具</span></span>
<span class="line"><span>case &quot;$EXTENSION&quot; in</span></span>
<span class="line"><span>    js|jsx|ts|tsx|json|md|css|scss|html)</span></span>
<span class="line"><span>        if command -v npx &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            if npx prettier --write &quot;$FILE_PATH&quot; ; then</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with Prettier&quot;}​}&#39;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Prettier formatting failed&quot;}​}&#39;</span></span>
<span class="line"><span>            fi</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Prettier not available&quot;}​}&#39;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    py)</span></span>
<span class="line"><span>        if command -v black &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            if black &quot;$FILE_PATH&quot; &amp;gt;&amp;2; then</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with Black&quot;}​}&#39;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Black formatting failed&quot;}​}&#39;</span></span>
<span class="line"><span>            fi</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    go)</span></span>
<span class="line"><span>        if command -v gofmt &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            gofmt -w &quot;$FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span>            echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with gofmt&quot;}​}&#39;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    rs)</span></span>
<span class="line"><span>        if command -v rustfmt &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>            rustfmt &quot;$FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span>            echo &#39;{&quot;hookSpecificOutput&quot;: {&quot;hookEventName&quot;: &quot;PostToolUse&quot;, &quot;additionalContext&quot;: &quot;Formatted with rustfmt&quot;}​}&#39;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        echo &#39;{}&#39;</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>这里有三个值得展开的细节，都是写 Hook 脚本时容易踩的坑。</p><ul><li><p><strong>为什么用</strong> <code>set +e ... set -e</code> <strong>而不是</strong> <code>|| true</code>：直觉上 <code>LINT_RESULT=$(...) || true</code> 看起来很好用，失败时让脚本继续。但配合下一行 <code>LINT_EXIT_CODE=$?</code> 时会出大问题： <code>||</code> 后面的 <code>true</code> 是命令链的最后一个命令， <code>$?</code> 取到的永远是 <code>true</code> 的退出码 <code>0</code>，ESLint 的真实退出码被吞掉了。脚本会永远走&quot;No issues found&quot;分支，再多 lint 错误都看不见。正确做法是局部关闭 <code>set -e</code>：用 <code>set +e</code> 暂停&quot;遇错就退出&quot;，跑完命令立刻 <code>set -e</code> 恢复纪律，这样既不会中断脚本，又能拿到真实退出码。</p></li><li><p><strong>为什么用</strong> <code>jq -n --arg</code> <strong>而不是手工拼接</strong>：ESLint 的输出可能包含双引号、反斜杠、换行，手工拼 JSON 一定踩雷。如果你写 <code>additionalContext: &quot;ESLint found issues:\\n$ESCAPED_RESULT&quot;</code>，而 <code>$ESCAPED_RESULT</code> 是 <code>jq -Rs</code> 的输出，它本身已经带了一对外层双引号（如 <code>&quot;foo\\nbar&quot;</code>），再插进字符串就成了 <code>&quot;...:\\n&quot;foo\\nbar&quot;&quot;</code>，双引号嵌套，非法 JSON，Claude Code 解析失败。更稳的做法是把生成 JSON 的工作整体交给 <code>jq -n --arg</code>，让 jq 自己处理转义，你只管传字符串值。能用 jq 生成的 JSON 就别手工拼。</p></li><li><p><code>head -30</code> 限制了反馈的长度。ESLint 的输出可能非常长，但我们只需要把前 30 行（通常包含了最关键的错误信息）反馈给 Claude 就够了。这又是一个“高噪声处理”的应用，和我们在 <a href="https://time.geekbang.org/column/article/944525" target="_blank" rel="noreferrer">第 6 讲</a> 学到的子代理噪声过滤是同一个思路。</p></li></ul><p><strong>这创造了一个自动化的质量循环</strong>：Claude 修改文件 → PostToolUse 触发 → Lint 检查 → 发现问题 → 反馈给 Claude → Claude 自动修复 → 再次触发 PostToolUse → 再次检查.……直到所有 Lint 错误消除。整个过程无需人工介入。</p><h2 id="posttooluse实战案例3-审计日志" tabindex="-1">PostToolUse实战案例3：审计日志 <a class="header-anchor" href="#posttooluse实战案例3-审计日志" aria-label="Permalink to &quot;PostToolUse实战案例3：审计日志&quot;">​</a></h2><p>对于金融、医疗、政府等合规性要求高的场景，你可能需要记录 Claude 的所有操作—— <strong>不是为了阻止什么，而是为了事后追溯</strong>。谁在什么时间修改了什么文件？执行了什么命令？这些信息在安全事件调查和合规审计中至关重要。</p><p>脚本位于 <code>hooks/audit-log.sh</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># audit-log.sh</span></span>
<span class="line"><span># 记录所有工具调用</span></span>
<span class="line"><span></span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span>LOG_FILE=&quot;\${CLAUDE_PROJECT_DIR:-.}/.claude/audit.log&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 确保日志目录存在</span></span>
<span class="line"><span>mkdir -p &quot;$(dirname &quot;$LOG_FILE&quot;)&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 记录时间戳、工具名、输入摘要</span></span>
<span class="line"><span>TIMESTAMP=$(date -Iseconds)</span></span>
<span class="line"><span>TOOL_NAME=$(echo &quot;$INPUT&quot; | jq -r &#39;.tool_name // &quot;unknown&quot;&#39;)</span></span>
<span class="line"><span>TOOL_INPUT=$(echo &quot;$INPUT&quot; | jq -c &#39;.tool_input // {}&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;[$TIMESTAMP] $TOOL_NAME: $TOOL_INPUT&quot; &amp;gt;&amp;gt; &quot;$LOG_FILE&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 不阻止执行</span></span>
<span class="line"><span>echo &#39;{}&#39;</span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>这个脚本很短，但有几个细节值得注意。 <code>\${CLAUDE_PROJECT_DIR:-.}</code> 使用了 Bash 的默认值语法——如果 <code>CLAUDE_PROJECT_DIR</code> 环境变量存在就用它，否则用当前目录 <code>.</code>。 <code>jq -c</code> 的 <code>-c</code> 参数表示“紧凑输出”，把 JSON 压缩成一行，便于日志文件的每一行对应一次操作。</p><p><code>date -Iseconds</code> 生成 ISO 8601 格式的时间戳（如 <code>2025-03-01T14:30:00+08:00</code>），这是最标准的时间格式，方便后续用脚本解析。配置时用 <code>matcher: &quot;*&quot;</code> 匹配所有工具，这样每次工具调用都会被记录：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;*&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/audit-log.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>审计日志的价值不在当下，而在未来。当你某天需要回答“上周三 Claude 到底改了什么导致了这个 bug”时，审计日志就是你的时光机。</p><p>【新增内容】</p><p>注意，生产环境务必加一道脱敏。上面的脚本为了演示直接把整段 tool_input 写进日志——但 tool_input 在 Edit/Write 调用 .env、config/secrets.yaml、*.key 时，往往就带着真正的密钥内容。这样你的审计日志本身会变成新的泄密渠道，为了实现“事后可追溯”反而埋下了更大的事故源。</p><p>生产环境部署前最起码做三件事：</p><p>第一，对敏感路径（.env*、 <em>.key、secrets.</em>、credentials.*）只记录文件路径，不记录 content 字段；</p><p>第二，用正则扫一遍 tool_input 里疑似密钥的字符串（AKIA…、sk-…、长十六进制串）做掩码替换；</p><p>第三，把日志文件权限收紧到 chmod 600 并定期归档。</p><p>好的审计是留下追溯线索，不是复制一份明文备份。</p><h2 id="总结一下" tabindex="-1">总结一下 <a class="header-anchor" href="#总结一下" aria-label="Permalink to &quot;总结一下&quot;">​</a></h2><p>这一讲，我们学习了 Hooks 的基础概念并给出了最常用的两个事件——PreToolUse 和 PostToolUse的大量示例。</p><p>Hooks 的本质是 AI Agent 的中间件。就像 Web 开发中的中间件可以拦截 HTTP 请求一样，Hooks 可以在 Claude 执行工具前后插入自定义逻辑。</p><p>Claude 不需要知道有 Hook 在运行，它只管专注于完成任务，安全防线、质量守卫、审计日志的工作，全部由 Hooks 在&quot;幕后&quot;自动完成。</p><p>Claude Code 支持 17 种 Hook 事件，覆盖完整生命周期。它们分为控制点（能阻止）、接管点（替代默认行为）和观察点（只能记录）三大阵营。本讲重点学习了 PreToolUse（守门员）和 PostToolUse（质量守卫）。</p><p>四种 Hook 类型如下。</p><ul><li><p><code>command</code>：确定性规则，最可靠。能用脚本解决的问题不要用 LLM。</p></li><li><p><code>prompt</code>：单次 LLM 评估，需要判断力时使用。快但不能查代码。</p></li><li><p><code>agent</code>：多轮验证，需要翻代码才能决策时使用。最强也最慢。</p></li><li><p><code>http</code>：POST 事件数据到 HTTP 端点，适合对接外部服务（审计、通知、集中管控）。</p></li></ul><p>我们用两个实战案例覆盖了 PreToolUse 最常见的场景——阻止危险命令（ <code>rm -rf /</code>、 <code>git push --force origin main</code>）和保护敏感文件（ <code>.env</code>、 <code>*.pem</code>、 <code>credentials.json</code>）。两者都是黑名单匹配模式，确定性最高、可靠性最强。</p><p>PostToolUse 方面，我们学习了三个经典应用——自动格式化（根据文件类型调用 Prettier/Black/gofmt）、自动 Lint 检查（发现问题自动反馈给 Claude）、审计日志（记录所有工具调用）。PostToolUse 的 <code>additionalContext</code> 字段创造了一个闭环反馈机制——Hook 观察到问题，反馈给 Claude，Claude 自动修复。</p><p>现在回顾开头图里咖哥发生的悲剧，用一个简单的 PreToolUse Hook 就能避免。自动化不是为了替代人的判断，而是为了在人类最容易出错的时刻——疲劳、赶工、分心——提供一道可靠的防线。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>你的项目中有哪些“不能忘记”的检查？它们可以用什么类型的 Hook 实现？</p></li><li><p>PreToolUse 可以阻止操作，PostToolUse 只能反馈。为什么要这样设计？如果 PostToolUse 也能阻止操作（比如&quot;撤销已写入的文件&quot;），会带来什么问题？</p></li><li><p>PostToolUse 的 <code>additionalContext</code> 反馈机制创造了一个 Claude 自动修复的循环。这个循环有没有可能导致问题？比如 Claude 反复修改同一个文件？你会如何防范？</p></li></ol><h2 id="下一讲预告" tabindex="-1">下一讲预告 <a class="header-anchor" href="#下一讲预告" aria-label="Permalink to &quot;下一讲预告&quot;">​</a></h2><p>PreToolUse 和 PostToolUse 覆盖了“工具执行前后”的自动化需求。但还有一些更高级的场景它们解决不了：Claude 做完整个任务后如何自动验收？子代理启动和完成时如何自动注入上下文和验证质量？多个 Hook 如何组合成完整的防护系统？</p><p>下一讲，我们将学习 <strong>Hooks 高级模式与工程实践</strong>——Stop Hook 质量门控、SubAgent 事件、frontmatter Hooks、以及 Hook 工程设计方法论。</p><p>欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。</p>`,173)])])}const h=n(o,[["render",t]]);export{q as __pageData,h as default};
