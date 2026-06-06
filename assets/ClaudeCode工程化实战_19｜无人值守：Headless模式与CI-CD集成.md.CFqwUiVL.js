import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"19｜无人值守：Headless 模式与 CI/CD 集成","description":"","frontmatter":{},"headers":[{"level":2,"title":"凌晨三点的代码审查","slug":"凌晨三点的代码审查","link":"#凌晨三点的代码审查","children":[]},{"level":2,"title":"Headless 模式核心机制","slug":"headless-模式核心机制","link":"#headless-模式核心机制","children":[]},{"level":2,"title":"输出格式与管道集成","slug":"输出格式与管道集成","link":"#输出格式与管道集成","children":[{"level":3,"title":"Text 格式","slug":"text-格式","link":"#text-格式","children":[]},{"level":3,"title":"JSON 格式","slug":"json-格式","link":"#json-格式","children":[]},{"level":3,"title":"Stream-JSON 格式","slug":"stream-json-格式","link":"#stream-json-格式","children":[]},{"level":3,"title":"Unix 管道集成","slug":"unix-管道集成","link":"#unix-管道集成","children":[]},{"level":3,"title":"批量处理模式","slug":"批量处理模式","link":"#批量处理模式","children":[]}]},{"level":2,"title":"GitHub Actions 集成","slug":"github-actions-集成","link":"#github-actions-集成","children":[{"level":3,"title":"自动化 PR 审查","slug":"自动化-pr-审查","link":"#自动化-pr-审查","children":[]},{"level":3,"title":"自动修复 Lint 错误","slug":"自动修复-lint-错误","link":"#自动修复-lint-错误","children":[]}]},{"level":2,"title":"Pre-commit Hook 集成","slug":"pre-commit-hook-集成","link":"#pre-commit-hook-集成","children":[{"level":3,"title":"基本 Pre-commit Hook","slug":"基本-pre-commit-hook","link":"#基本-pre-commit-hook","children":[]},{"level":3,"title":"自动生成 Commit Message","slug":"自动生成-commit-message","link":"#自动生成-commit-message","children":[]},{"level":3,"title":"使用 pre-commit 框架","slug":"使用-pre-commit-框架","link":"#使用-pre-commit-框架","children":[]}]},{"level":2,"title":"实战项目：完整的 CI/CD 审查系统","slug":"实战项目-完整的-ci-cd-审查系统","link":"#实战项目-完整的-ci-cd-审查系统","children":[]},{"level":2,"title":"安全与成本控制","slug":"安全与成本控制","link":"#安全与成本控制","children":[]},{"level":2,"title":"其它 CI 平台集成","slug":"其它-ci-平台集成","link":"#其它-ci-平台集成","children":[]},{"level":2,"title":"总结一下","slug":"总结一下","link":"#总结一下","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"下一讲预告","slug":"下一讲预告","link":"#下一讲预告","children":[]}],"relativePath":"ClaudeCode工程化实战/19｜无人值守：Headless模式与CI-CD集成.md","filePath":"ClaudeCode工程化实战/19｜无人值守：Headless模式与CI-CD集成.md","lastUpdated":1779815462000}'),l={name:"ClaudeCode工程化实战/19｜无人值守：Headless模式与CI-CD集成.md"};function t(i,s,o,c,u,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_19-无人值守-headless-模式与-ci-cd-集成" tabindex="-1">19｜无人值守：Headless 模式与 CI/CD 集成 <a class="header-anchor" href="#_19-无人值守-headless-模式与-ci-cd-集成" aria-label="Permalink to &quot;19｜无人值守：Headless 模式与 CI/CD 集成&quot;">​</a></h1><blockquote><p>释题：无人值守。当 Claude Code 脱离人的实时操控，以守护进程般的姿态嵌入流水线，开发团队获得的不只是效率提升，而是一种全新的人机协作节奏。</p></blockquote><p>你好，我是黄佳。</p><p>之前，我们庖丁解牛，深入剖析了 Claude Code 的工具系统——十几个精选的原语工具覆盖五个原子操作，通过涌现产生无限复杂能力。工具系统回答了一个核心问题： <strong>Claude Code 能做什么。</strong> 但不管工具有多强大，有一个前提始终没变：你得坐在终端前面，实时和 Claude 对话。</p><p>这一讲，我们要打破这个前提。我们要让 Claude Code 在完全没有人工干预的情况下自动运行——在 CI/CD 流水线中审查代码，在 pre-commit hook 里检查提交，在定时任务中生成报告。这就是 Headless 模式的核心：从“有人值守”到“无人值守”。</p><h2 id="凌晨三点的代码审查" tabindex="-1">凌晨三点的代码审查 <a class="header-anchor" href="#凌晨三点的代码审查" aria-label="Permalink to &quot;凌晨三点的代码审查&quot;">​</a></h2><p>这是一个分布在三个时区的远程团队：美国西海岸、欧洲、亚洲。当亚洲的小王在早上 9 点提交 PR 时，美国的 Tech Lead 还在睡觉。当美国的同事审查完代码时，小王已经下班了。每个 PR 的审查周期动辄 24-48 小时，不是因为审查本身需要那么长时间，而是因为 <strong>人的作息时间不同步</strong>。</p><p>有一天，团队配置了一个 GitHub Action：每当 PR 创建或更新时，Claude Code 会自动进行初步审查——检查代码风格、潜在 Bug、安全问题。当人类审查者醒来时，他们看到的不是一片空白的 PR，而是已经有一份详细的 AI 审查报告。</p><p><strong>PR 的平均审查周期从 36 小时缩短到了 8 小时。</strong></p><p>这就是 Headless 模式的价值：让 Claude Code 在 <strong>没有人工干预的情况下自动工作</strong>。它并不是取代人类审查者，而是在人类不在线的时候先行一步，把基础工作做好。这样我们打开 PR 时，就可以直接从 AI 的审查报告出发，聚焦于需要人类判断力的高层问题——架构合理性、业务逻辑正确性、团队规范一致性，而不是把时间花在检查缩进和命名规范上。</p><h2 id="headless-模式核心机制" tabindex="-1">Headless 模式核心机制 <a class="header-anchor" href="#headless-模式核心机制" aria-label="Permalink to &quot;Headless 模式核心机制&quot;">​</a></h2><p>在前面的章节中，我们一直在终端里与 Claude 对话——你输入一句话，Claude 响应，你再输入，它再响应。这是 <strong>交互模式</strong>。交互模式的好处是灵活，你可以随时调整方向、追问细节、确认操作。但它有一个根本限制——需要一个人类一直坐在屏幕前面。</p><p>然而，软件工程中有大量任务天然不需要实时对话。CI/CD 流水线在每次提交时自动运行，Pre-commit Hook 在提交前自动检查，定时任务在每天凌晨自动生成报告。这些场景需要的是 <strong>非交互模式</strong>，也就是 Headless 模式。</p><blockquote><p><a href="https://code.claude.com/docs/en/headless" target="_blank" rel="noreferrer">Anthropic 官方文档</a> 说：Claude Code 包含 Headless 模式，用于 CI、pre-commit hooks、构建脚本和自动化等非交互式场景。</p></blockquote><p>Headless 这个词来自“无头浏览器”（Headless Browser）的概念——没有图形界面，但功能完整。同样，Headless 模式下的 Claude Code 没有交互式终端界面，但拥有和交互模式完全相同的代码分析能力、工具调用能力和推理能力。唯一的区别是：输入变成了一次性的 prompt，输出变成了 stdout 上的文本或 JSON，不再有来回对话。</p><p>启用 Headless 模式的关键是 <code>-p</code>（或 <code>--print</code>）标志。这个标志的名字很直观，print，意思是“把结果打印出来就行，不要打开交互界面”。理解这一点很重要，因为 <code>-p</code> 不只改变了输出方式，更重要的是它改变了 Claude Code 的整个运行模型—— <strong>从“持续对话”变成了“单次执行”</strong>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 基本 headless 执行</span></span>
<span class="line"><span>claude -p &quot;解释这段代码是做什么的&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 从 stdin 读取输入</span></span>
<span class="line"><span>cat code.py | claude -p &quot;分析这段代码&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 结合文件内容</span></span>
<span class="line"><span>claude -p &quot;找出这个文件中的 Bug&quot; &amp;lt; buggy.js</span></span></code></pre></div><p><code>-p</code> 告诉 Claude Code：不要打开交互界面，直接执行任务，把结果输出到 stdout，然后退出。这种“执行即退出”的模式，正是脚本和流水线所需要的——它们不需要等待用户输入，只需要一个确定性的输入-输出流程。</p><p>下表清晰地展示了两种模式在各个维度上的差异。理解这些差异，有助于你判断什么场景适合用交互模式，什么场景应该切换到 Headless。我给你一个简单的判断标准：如果任务需要人类在过程中做决策，用交互模式；如果任务的输入和期望输出在启动前就能完全确定，用 Headless。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/a1ebayy885dbc87acef4f347a42337e5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/a1ebayy885dbc87acef4f347a42337e5.jpg" alt=""></a></p><p>Headless 模式提供了一组命令行参数来精细控制执行行为。这些参数是你在自动化脚本和 CI 配置中最常用的控制手段。特别值得注意的是 <code>--allowedTools</code> 和 <code>--max-turns</code> 这两个参数，它们是安全防护的第一道防线，能有效限制 Claude 在无人监管环境中的行为边界。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/c9f508faa846b65d2488960bd8424ce4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/c9f508faa846b65d2488960bd8424ce4.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/5e9f73ce1cd9b75c0b7ecca7a4cfaf0b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/5e9f73ce1cd9b75c0b7ecca7a4cfaf0b.jpg" alt=""></a></p><h2 id="输出格式与管道集成" tabindex="-1">输出格式与管道集成 <a class="header-anchor" href="#输出格式与管道集成" aria-label="Permalink to &quot;输出格式与管道集成&quot;">​</a></h2><p>Headless 模式支持三种输出格式，适用于不同的自动化场景。选择哪种格式，取决于你的下游消费者是谁——是人类读者、是程序解析器、还是实时监控系统。</p><h3 id="text-格式" tabindex="-1">Text 格式 <a class="header-anchor" href="#text-格式" aria-label="Permalink to &quot;Text 格式&quot;">​</a></h3><p>Text 是默认格式，也是最简单的格式。适用场景为日志记录、简单脚本、人工审查。它直接输出 Claude 的回复文本，没有任何元数据包装。如果你只是想在终端里看结果，或者将结果写入日志文件，Text 格式就够了。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude -p &quot;生成一个 Python hello world 函数&quot; --output-format text</span></span></code></pre></div><p>输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Here&#39;s a simple hello world function:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def hello_world():</span></span>
<span class="line"><span>    print(&quot;Hello, World!&quot;)</span></span></code></pre></div><h3 id="json-格式" tabindex="-1">JSON 格式 <a class="header-anchor" href="#json-格式" aria-label="Permalink to &quot;JSON 格式&quot;">​</a></h3><p>当你需要在程序中解析 Claude 的输出时，JSON 格式是更好的选择。它不仅包含回复文本本身，还包含执行的元数据——耗时多久、花了多少钱、用了多少 tokens。这些元数据对于成本监控和性能调优至关重要。在生产环境的 CI/CD 流水线中，你几乎总是应该使用 JSON 格式，因为它让你能够用程序化的方式验证执行结果、追踪成本、检测异常。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude -p &quot;列出当前目录文件&quot; --output-format json</span></span></code></pre></div><p>输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;type&quot;: &quot;result&quot;,</span></span>
<span class="line"><span>  &quot;subtype&quot;: &quot;success&quot;,</span></span>
<span class="line"><span>  &quot;session_id&quot;: &quot;abc123&quot;,</span></span>
<span class="line"><span>  &quot;is_error&quot;: false,</span></span>
<span class="line"><span>  &quot;duration_ms&quot;: 1500,</span></span>
<span class="line"><span>  &quot;duration_api_ms&quot;: 1200,</span></span>
<span class="line"><span>  &quot;num_turns&quot;: 1,</span></span>
<span class="line"><span>  &quot;total_cost_usd&quot;: 0.005,</span></span>
<span class="line"><span>  &quot;usage&quot;: {</span></span>
<span class="line"><span>    &quot;input_tokens&quot;: 150,</span></span>
<span class="line"><span>    &quot;output_tokens&quot;: 200</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  &quot;result&quot;: &quot;文件列表：\\n- file1.py\\n- file2.js\\n...&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是一个 Python 解析示例。这段代码展示了如何在脚本中调用 Claude Code 并提取结构化结果。注意 <code>subprocess.run</code> 的用法——它是在 Python 中调用外部命令的标准方式， <code>capture_output=True</code> 确保我们能拿到 stdout 的内容。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import subprocess</span></span>
<span class="line"><span>import json</span></span>
<span class="line"><span></span></span>
<span class="line"><span>result = subprocess.run(</span></span>
<span class="line"><span>    [&quot;claude&quot;, &quot;-p&quot;, &quot;列出文件&quot;, &quot;--output-format&quot;, &quot;json&quot;],</span></span>
<span class="line"><span>    capture_output=True,</span></span>
<span class="line"><span>    text=True</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>data = json.loads(result.stdout)</span></span>
<span class="line"><span>print(f&quot;结果: {data[&#39;result&#39;]}&quot;)</span></span>
<span class="line"><span>print(f&quot;耗时: {data[&#39;duration_ms&#39;]}ms&quot;)</span></span>
<span class="line"><span>print(f&quot;费用: \${data[&#39;total_cost_usd&#39;]}&quot;)</span></span></code></pre></div><h3 id="stream-json-格式" tabindex="-1">Stream-JSON 格式 <a class="header-anchor" href="#stream-json-格式" aria-label="Permalink to &quot;Stream-JSON 格式&quot;">​</a></h3><p>对于长时间运行的任务，你可能不想等到执行完成才看到输出，因此这种格式适用于实时进度显示、长时间任务监控、流式处理。Stream-JSON 格式以 JSONL（每行一个 JSON 对象）的方式实时输出执行过程中的每个事件——Claude 的每段回复、每次工具调用、每个工具返回结果。</p><p>这种格式特别适合需要实时进度显示的场景，比如在 CI 日志中实时展示 Claude 正在做什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude -p &quot;分析代码&quot; --output-format stream-json</span></span></code></pre></div><p>输出里（每行一个事件）：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;type&quot;:&quot;assistant&quot;,&quot;message&quot;:{&quot;role&quot;:&quot;assistant&quot;,&quot;content&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;正在分析...&quot;}]}​}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;tool_use&quot;,&quot;tool&quot;:&quot;Read&quot;,&quot;input&quot;:{&quot;file_path&quot;:&quot;/path/to/file&quot;}​}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;tool_result&quot;,&quot;tool&quot;:&quot;Read&quot;,&quot;result&quot;:&quot;file content...&quot;}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;assistant&quot;,&quot;message&quot;:{&quot;role&quot;:&quot;assistant&quot;,&quot;content&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;分析完成。&quot;}]}​}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;result&quot;,&quot;session_id&quot;:&quot;abc123&quot;,&quot;is_error&quot;:false,&quot;result&quot;:&quot;最终结果&quot;}</span></span></code></pre></div><p>下面这段 Bash 脚本展示了如何逐行读取 Stream JSON 输出，并根据事件类型做出不同响应。你可以在此基础上扩展，比如在检测到 tool use 事件时，更新进度条，在检测到 result 事件时触发下游通知。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude -p &quot;分析代码&quot; --output-format stream-json | while IFS= read -r line; do</span></span>
<span class="line"><span>  type=$(echo &quot;$line&quot; | jq -r &#39;.type&#39;)</span></span>
<span class="line"><span>  if [ &quot;$type&quot; = &quot;result&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;最终结果: $(echo &quot;$line&quot; | jq -r &#39;.result&#39;)&quot;</span></span>
<span class="line"><span>  elif [ &quot;$type&quot; = &quot;tool_use&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;正在使用工具: $(echo &quot;$line&quot; | jq -r &#39;.tool&#39;)&quot;</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span>done</span></span></code></pre></div><h3 id="unix-管道集成" tabindex="-1">Unix 管道集成 <a class="header-anchor" href="#unix-管道集成" aria-label="Permalink to &quot;Unix 管道集成&quot;">​</a></h3><p>Claude Code 的一个独特优势是它可以 <strong>无缝融入 Unix 管道</strong>，成为你工具链中的一环。这不是一个附加功能，而是一种设计哲学——Claude Code 遵循 Unix“小工具、大组合”的传统，通过标准输入输出与其他命令行工具互联互通。</p><p>基本管道用法如 <a href="https://www.anthropic.com/engineering/claude-code-best-practices" target="_blank" rel="noreferrer">Anthropic 工程博客</a> 所述：</p><blockquote><p>“Claude Code 可以作为 Unix 风格的工具，允许你直接将数据管道到它（如 <code>cat foo.txt | claude -p &quot;query&quot;</code>），这对于处理日志或 CSV 特别有用。”</p></blockquote><p>管道的核心思想是：前一个命令的输出，成为后一个命令的输入。当 Claude Code 站在管道中间时，它接收上游数据，用 AI 理解和处理这些数据，然后把结果传给下游。这意味着你可以把 Claude 插入到任何现有的 Shell 工作流中，而不需要改变工作流的结构。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 分析日志文件</span></span>
<span class="line"><span>cat server.log | claude -p &quot;找出所有错误并总结原因&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 解析 JSON</span></span>
<span class="line"><span>curl https://api.example.com/data | claude -p &quot;提取所有用户的邮箱地址&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 代码转换</span></span>
<span class="line"><span>cat old-code.js | claude -p &quot;将这段 JavaScript 转换为 TypeScript&quot;</span></span></code></pre></div><p>管道的真正威力在于 <strong>组合</strong>。下面这些例子展示了 Claude Code 如何与 <code>find</code>、 <code>git</code>、 <code>grep</code> 等经典 Unix 工具协作。每个组合都解决了一个真实的开发场景——批量检查类型提示、总结提交变更、将散落的 TODO 转换为规范的 Issue 格式。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 结合 find 和 xargs 批量处理</span></span>
<span class="line"><span>find src -name &quot;*.py&quot; | xargs -I {} claude -p &quot;检查 {} 中的类型提示是否完整&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 结合 git 工作流</span></span>
<span class="line"><span>git diff HEAD~1 | claude -p &quot;总结这次提交的变更&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 结合 grep 预过滤</span></span>
<span class="line"><span>grep -r &quot;TODO&quot; src/ | claude -p &quot;将这些 TODO 转换为 GitHub Issue 格式&quot;</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/9f50056b8d868b32478127874fa3cce4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/9f50056b8d868b32478127874fa3cce4.jpg" alt=""></a></p><p>Claude 不仅可以接收管道输入，它的输出同样可以 <strong>通过管道流向下游</strong>。这样你就能构建完整的自动化链路：数据获取 -&gt; AI 分析 -&gt; 结果处理 -&gt; 通知或存储。</p><p>下面的例子展示了三种典型的下游处理模式——用 <code>jq</code> 解析 JSON 结果、直接写入文件以及发送邮件通知。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Claude 输出 -&amp;gt; jq 解析 -&amp;gt; 下游处理</span></span>
<span class="line"><span>claude -p &quot;列出所有函数名&quot; --output-format json | jq -r &#39;.result&#39; | sort | uniq</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Claude 生成代码 -&amp;gt; 直接写入文件</span></span>
<span class="line"><span>claude -p &quot;生成一个 Express 路由处理函数&quot; --output-format text &amp;gt; routes/user.js</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Claude 分析 -&amp;gt; 发送通知</span></span>
<span class="line"><span>claude -p &quot;检查是否有安全漏洞&quot; --output-format json | \\</span></span>
<span class="line"><span>  jq -r &#39;.result&#39; | \\</span></span>
<span class="line"><span>  mail -s &quot;安全扫描报告&quot; security&amp;#64;company.com</span></span></code></pre></div><h3 id="批量处理模式" tabindex="-1">批量处理模式 <a class="header-anchor" href="#批量处理模式" aria-label="Permalink to &quot;批量处理模式&quot;">​</a></h3><p>当你需要对大量文件执行相同的 AI 分析任务时，批量处理模式就派上用场了。 <a href="https://smartscope.blog/en/generative-ai/claude/claude-code-batch-processing/" target="_blank" rel="noreferrer">SmartScope 博客</a> 详细介绍了这种模式：</p><blockquote><p>Claude Code 的批处理（headless 模式）允许你直接从命令行执行 AI 功能，无需使用交互式 UI。通过集成到 CI/CD 流水线和自动化脚本中，你可以高效执行大规模处理任务。</p></blockquote><p>下面是一个批量代码审查脚本。它遍历 <code>src</code> 目录下的所有 TypeScript 文件，对每个文件运行 Claude 审查，并将结果保存到独立的报告文件中。注意 <code>--max-turns 3</code> 的设置——对于单文件审查，3 轮通常就足够了，这样既能保证审查质量，又能控制成本和耗时。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># batch-review.sh - 批量代码审查</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RESULTS_DIR=&quot;review-results&quot;</span></span>
<span class="line"><span>mkdir -p &quot;$RESULTS_DIR&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 遍历所有源文件</span></span>
<span class="line"><span>find src -name &quot;*.ts&quot; | while IFS= read -r file; do</span></span>
<span class="line"><span>  echo &quot;Reviewing: $file&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  OUTPUT_FILE=&quot;$RESULTS_DIR/$(basename &quot;$file&quot;).review.md&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  claude -p &quot;Review $file for bugs and best practices. Be concise.&quot; \\</span></span>
<span class="line"><span>    --output-format text \\</span></span>
<span class="line"><span>    --max-turns 3 \\</span></span>
<span class="line"><span>    --allowedTools Read &amp;gt; &quot;$OUTPUT_FILE&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  echo &quot;  -&amp;gt; $OUTPUT_FILE&quot;</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;Reviews complete. Results in $RESULTS_DIR/&quot;</span></span></code></pre></div><h2 id="github-actions-集成" tabindex="-1">GitHub Actions 集成 <a class="header-anchor" href="#github-actions-集成" aria-label="Permalink to &quot;GitHub Actions 集成&quot;">​</a></h2><p>GitHub Actions 是 Headless 模式最常见的应用场景。GitHub 是最大的代码托管平台，而 Actions 是它的原生 CI/CD 系统。Claude Code 与 GitHub Actions 的集成，让“AI驱动的代码审查”不再停留于概念，而是几行YAML配置就能实现。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/433d256b69e3931b4b9f5253f0062c9a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/433d256b69e3931b4b9f5253f0062c9a.jpg" alt=""></a></p><p>Anthropic 提供了 <a href="https://github.com/anthropics/claude-code-action" target="_blank" rel="noreferrer">官方 GitHub Action</a>，让集成变得极其简单。相比于手动安装 Claude Code 然后编写 Shell 命令调用，官方 Action 封装了安装、认证、权限管理等底层细节，你只需要提供 API Key 和 prompt 就能开始使用。</p><blockquote><p>Claude Code GitHub Actions 为你的 GitHub 工作流带来 AI 驱动的自动化。只需在任何 PR 或 Issue 中 @claude，Claude 就能分析你的代码、创建 Pull Request、实现功能、修复 Bug——同时遵循你的项目规范。</p></blockquote><p>官方 Action 支持两种模式，分别对应不同的使用场景。 <strong>Tag Mode</strong> 适合开发者主动请求帮助的场景——你在 PR 评论中 @claude，它就会响应。 <strong>Agent Mode</strong> 适合完全自动化的场景——每次 PR 创建时自动触发，不需要人工干预。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/cceb2473d0b8709b5c3530287fb1a4e9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/cceb2473d0b8709b5c3530287fb1a4e9.jpg" alt=""></a></p><p><strong>Tag Mode 示例</strong>：</p><p>在 PR 评论中输入 <code>@claude 帮我审查这段代码</code>，Claude 会自动响应并提供审查意见。</p><p><strong>Agent Mode 示例</strong>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- uses: anthropics/claude-code-action&amp;#64;v1</span></span>
<span class="line"><span>  with:</span></span>
<span class="line"><span>    anthropic_api_key: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span>
<span class="line"><span>    prompt: &quot;审查这个 PR 的所有变更，检查安全漏洞&quot;</span></span></code></pre></div><p>最简单的设置方式是在 Claude Code 终端中运行 <code>/install-github-app</code>，它会引导你完成整个配置过程，包括创建 GitHub App、配置 Webhook、设置权限等。</p><p>如果你更喜欢手动配置，或者需要定制化的工作流，可以按以下步骤操作。</p><p>第一步是在 GitHub 仓库的 Settings -&gt; Secrets -&gt; Actions 中添加 <code>ANTHROPIC_API_KEY</code>——这是唯一需要的密钥。</p><p>第二步是创建工作流文件，定义触发条件和执行步骤。创建 <code>.github/workflows/claude.yml</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name: Claude Code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>on:</span></span>
<span class="line"><span>  issue_comment:</span></span>
<span class="line"><span>    types: [created]</span></span>
<span class="line"><span>  pull_request_review_comment:</span></span>
<span class="line"><span>    types: [created]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>jobs:</span></span>
<span class="line"><span>  claude:</span></span>
<span class="line"><span>    runs-on: ubuntu-latest</span></span>
<span class="line"><span>    # 只在 &amp;#64;claude 提及时触发</span></span>
<span class="line"><span>    if: contains(github.event.comment.body, &#39;&amp;#64;claude&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    permissions:</span></span>
<span class="line"><span>      contents: read</span></span>
<span class="line"><span>      pull-requests: write</span></span>
<span class="line"><span>      issues: write</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    steps:</span></span>
<span class="line"><span>      - uses: actions/checkout&amp;#64;v4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - uses: anthropics/claude-code-action&amp;#64;v1</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          anthropic_api_key: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span></code></pre></div><p>这份配置只有二十几行，但它实现了一个完整的 AI 审查工作流：监听 PR 和 Issue 中的评论，在检测到 @claude 提及时触发，检出代码，然后让 Claude 分析并回复。 <code>permissions</code> 部分遵循最小权限原则—— <code>contents: read</code> 只允许读取代码， <code>pull-requests: write</code> 和 <code>issues: write</code> 允许发表评论。</p><h3 id="自动化-pr-审查" tabindex="-1">自动化 PR 审查 <a class="header-anchor" href="#自动化-pr-审查" aria-label="Permalink to &quot;自动化 PR 审查&quot;">​</a></h3><p>自动化 PR 审查是最常见的用例——每次 PR 创建或更新时自动审查。和上面的 Tag Mode 不同，这里不需要任何人工触发，PR 一创建就会自动开始审查。这个工作流稍微复杂一些，因为它需要获取变更文件列表、构建审查 prompt、运行 Claude、然后将结果发布为 PR 评论。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name: Claude PR Review</span></span>
<span class="line"><span></span></span>
<span class="line"><span>on:</span></span>
<span class="line"><span>  pull_request:</span></span>
<span class="line"><span>    types: [opened, synchronize, reopened]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 取消正在运行的重复工作流</span></span>
<span class="line"><span>concurrency:</span></span>
<span class="line"><span>  group: \${ { github.workflow } }-\${​{ github.event.pull_request.number }​}</span></span>
<span class="line"><span>  cancel-in-progress: true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>jobs:</span></span>
<span class="line"><span>  review:</span></span>
<span class="line"><span>    runs-on: ubuntu-latest</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    permissions:</span></span>
<span class="line"><span>      contents: read</span></span>
<span class="line"><span>      pull-requests: write</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    steps:</span></span>
<span class="line"><span>      - name: Checkout code</span></span>
<span class="line"><span>        uses: actions/checkout&amp;#64;v4</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          fetch-depth: 0  # 需要完整历史以获取 diff</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Setup Node.js</span></span>
<span class="line"><span>        uses: actions/setup-node&amp;#64;v4</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          node-version: &quot;20&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Install Claude Code</span></span>
<span class="line"><span>        run: npm install -g &amp;#64;anthropic-ai/claude-code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Get changed files</span></span>
<span class="line"><span>        id: changed</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          FILES=$(git diff --name-only origin/\${​{ github.base_ref }​}...HEAD)</span></span>
<span class="line"><span>          echo &quot;files=$(echo &quot;$FILES&quot; | tr &#39;\\n&#39; &#39; &#39;)&quot; &amp;gt;&amp;gt; $GITHUB_OUTPUT</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Run Claude Review</span></span>
<span class="line"><span>        env:</span></span>
<span class="line"><span>          ANTHROPIC_API_KEY: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          claude -p &quot;Review this PR for code quality, bugs, security issues.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          Changed files: \${​{ steps.changed.outputs.files }​}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          Provide specific, actionable feedback with file:line references.&quot; \\</span></span>
<span class="line"><span>            --output-format json \\</span></span>
<span class="line"><span>            --max-turns 10 \\</span></span>
<span class="line"><span>            --allowedTools Read,Grep,Glob &amp;gt; review.json</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Post Review Comment</span></span>
<span class="line"><span>        uses: actions/github-script&amp;#64;v7</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          script: |</span></span>
<span class="line"><span>            const fs = require(&#39;fs&#39;);</span></span>
<span class="line"><span>            const review = JSON.parse(fs.readFileSync(&#39;review.json&#39;, &#39;utf8&#39;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            const comment = \`## Claude Code Review\\n\\n\${review.result}\\n\\n---\\n*Automated review by Claude Code*\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            await github.rest.issues.createComment({</span></span>
<span class="line"><span>              issue_number: context.issue.number,</span></span>
<span class="line"><span>              owner: context.repo.owner,</span></span>
<span class="line"><span>              repo: context.repo.repo,</span></span>
<span class="line"><span>              body: comment</span></span>
<span class="line"><span>            });</span></span></code></pre></div><p>这个工作流有几个值得注意的设计决策。</p><ul><li><p><code>fetch-depth: 0</code> 确保 checkout 时拉取完整的 git 历史，这样才能正确计算 diff。</p></li><li><p><code>concurrency</code> 配置确保同一个 PR 上不会同时运行多个审查，当开发者快速连续推送多个 commit 时，旧的审查会被取消，只保留最新的。</p></li><li><p><code>--allowedTools Read,Grep,Glob</code> 限制 Claude 只能使用只读工具，确保审查过程不会意外修改任何文件。</p></li></ul><h3 id="自动修复-lint-错误" tabindex="-1">自动修复 Lint 错误 <a class="header-anchor" href="#自动修复-lint-错误" aria-label="Permalink to &quot;自动修复 Lint 错误&quot;">​</a></h3><p>除了只读审查，Headless 模式还可以用于自动修复。</p><p>下面的工作流展示了一个更激进的用例：当 lint 检查失败时，让 Claude 自动修复错误并提交。这种模式适合风格类的 lint 规则（缩进、分号、import 排序等），对于逻辑类的 lint 规则则需要更谨慎。注意这里没有设置 <code>--allowedTools</code>，因为 Claude 需要读写文件来完成修复。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name: Auto Fix Lint Errors</span></span>
<span class="line"><span></span></span>
<span class="line"><span>on:</span></span>
<span class="line"><span>  push:</span></span>
<span class="line"><span>    branches: [main, develop]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>jobs:</span></span>
<span class="line"><span>  fix:</span></span>
<span class="line"><span>    runs-on: ubuntu-latest</span></span>
<span class="line"><span>    permissions:</span></span>
<span class="line"><span>      contents: write</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    steps:</span></span>
<span class="line"><span>      - uses: actions/checkout&amp;#64;v4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Setup</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          npm ci</span></span>
<span class="line"><span>          npm install -g &amp;#64;anthropic-ai/claude-code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Run lint</span></span>
<span class="line"><span>        id: lint</span></span>
<span class="line"><span>        continue-on-error: true</span></span>
<span class="line"><span>        run: npm run lint 2&amp;gt;&amp;1 | tee lint-output.txt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Fix with Claude</span></span>
<span class="line"><span>        if: steps.lint.outcome == &#39;failure&#39;</span></span>
<span class="line"><span>        env:</span></span>
<span class="line"><span>          ANTHROPIC_API_KEY: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          claude -p &quot;Fix the lint errors in lint-output.txt. Make minimal changes.&quot; \\</span></span>
<span class="line"><span>            --max-turns 20</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Commit fixes</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          git config user.name &quot;Claude Bot&quot;</span></span>
<span class="line"><span>          git config user.email &quot;claude&amp;#64;bot.local&quot;</span></span>
<span class="line"><span>          git add -A</span></span>
<span class="line"><span>          git diff --staged --quiet || git commit -m &quot;fix: auto-fix lint errors&quot;</span></span>
<span class="line"><span>          git push</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/9d25d1dff7c9eddc1596d46cba6e9c80.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/9d25d1dff7c9eddc1596d46cba6e9c80.jpg" alt=""></a></p><h2 id="pre-commit-hook-集成" tabindex="-1">Pre-commit Hook 集成 <a class="header-anchor" href="#pre-commit-hook-集成" aria-label="Permalink to &quot;Pre-commit Hook 集成&quot;">​</a></h2><p>Pre-commit Hook 是另一个常见的 Headless 应用场景。与 CI/CD 流水线不同，Pre-commit Hook 运行在开发者的本地机器上，在代码提交之前进行检查。它的优势是即时反馈——你不需要等到代码推送到远端才知道有问题，在 <code>git commit</code> 的那一刻就能得到 AI 的审查意见。</p><h3 id="基本-pre-commit-hook" tabindex="-1">基本 Pre-commit Hook <a class="header-anchor" href="#基本-pre-commit-hook" aria-label="Permalink to &quot;基本 Pre-commit Hook&quot;">​</a></h3><p>下面这个 Hook 脚本在每次 <code>git commit</code> 时自动运行。它获取暂存区的文件列表，让 Claude 快速检查有没有明显问题。如果 Claude 回复“OK”，提交正常进行；如果发现问题，提交会被阻止，并显示问题列表。注意 <code>--max-turns 3</code> 和 <code>--allowedTools Read,Grep</code> 的设置——pre-commit hook 需要快速完成，不能让开发者等太久，所以限制了执行轮次，并且只允许只读操作。</p><p>我们创建 <code>.git/hooks/pre-commit</code>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># Pre-commit hook: Claude Code 快速审查</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取暂存的文件</span></span>
<span class="line"><span>STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -z &quot;$STAGED_FILES&quot; ]; then</span></span>
<span class="line"><span>  exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;Running Claude Code review on staged files...&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 运行审查（只读工具，快速模式）</span></span>
<span class="line"><span># 关键：让 Claude 用唯一 sentinel 表达&quot;通过&quot;，不要让它输出 &quot;OK&quot;——</span></span>
<span class="line"><span># 因为 &quot;OK&quot; 是常见英语词，会在 &quot;looks ok&quot; / &quot;blocked&quot; / &quot;okay&quot; 等中误命中。</span></span>
<span class="line"><span>RESULT=$(claude -p &quot;Quick review these staged files for obvious issues:</span></span>
<span class="line"><span>$STAGED_FILES</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Focus on: syntax errors, security issues, obvious bugs.</span></span>
<span class="line"><span>Reply with &#39;OK&#39; if no issues, or list the problems.&quot; \\</span></span>
<span class="line"><span>  --output-format text \\</span></span>
<span class="line"><span>  --max-turns 3 \\</span></span>
<span class="line"><span>  --allowedTools Read,Grep)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查结果</span></span>
<span class="line"><span>if echo &quot;$RESULT&quot; | grep -qi &quot;OK&quot;; then</span></span>
<span class="line"><span>  echo &quot;Claude review passed&quot;</span></span>
<span class="line"><span>  exit 0</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>  echo &quot;Claude found issues:&quot;</span></span>
<span class="line"><span>  echo &quot;$RESULT&quot;</span></span>
<span class="line"><span>  echo &quot;&quot;</span></span>
<span class="line"><span>  echo &quot;Commit blocked. Fix the issues or use --no-verify to skip.&quot;</span></span>
<span class="line"><span>  exit 1</span></span>
<span class="line"><span>fi</span></span></code></pre></div><p>然后设置权限：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>chmod +x .git/hooks/pre-commit</span></span></code></pre></div><h3 id="自动生成-commit-message" tabindex="-1">自动生成 Commit Message <a class="header-anchor" href="#自动生成-commit-message" aria-label="Permalink to &quot;自动生成 Commit Message&quot;">​</a></h3><p>另一个实用的 Hook 是自动生成 commit message。很多开发者在写 commit message 时都很头疼——要么写得太笼统（ix bug），要么干脆放弃思考（update）。这个 Hook 可以利用 Claude 分析 diff 内容，帮我们自动生成符合 Conventional Commits 规范的 commit message。</p><p>创建 <code>.git/hooks/prepare-commit-msg</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># 自动生成 commit message</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 如果用户通过 -m 提供了 commit message，跳过</span></span>
<span class="line"><span># $1 表示 commit message 的来源：message(-m)、template、merge、squash</span></span>
<span class="line"><span>if [ -n &quot;$1&quot; ]; then</span></span>
<span class="line"><span>  exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取 diff</span></span>
<span class="line"><span>DIFF=$(git diff --cached)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -z &quot;$DIFF&quot; ]; then</span></span>
<span class="line"><span>  exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 生成 commit message</span></span>
<span class="line"><span>MESSAGE=$(claude -p &quot;Generate a concise commit message for these changes:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$DIFF</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Format: &amp;lt;type&amp;gt;: &amp;lt;description&amp;gt;</span></span>
<span class="line"><span>Types: feat, fix, docs, style, refactor, test, chore</span></span>
<span class="line"><span>Reply with ONLY the commit message, nothing else.&quot; \\</span></span>
<span class="line"><span>  --output-format text \\</span></span>
<span class="line"><span>  --max-turns 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将生成的 message 写入文件开头，保留 Git 的注释模板</span></span>
<span class="line"><span>TEMP_FILE=$(mktemp)</span></span>
<span class="line"><span>echo &quot;$MESSAGE&quot; &amp;gt; &quot;$TEMP_FILE&quot;</span></span>
<span class="line"><span>echo &quot;&quot; &amp;gt;&amp;gt; &quot;$TEMP_FILE&quot;</span></span>
<span class="line"><span>cat &quot;$1&quot; &amp;gt;&amp;gt; &quot;$TEMP_FILE&quot;</span></span>
<span class="line"><span>mv &quot;$TEMP_FILE&quot; &quot;$1&quot;</span></span></code></pre></div><h3 id="使用-pre-commit-框架" tabindex="-1">使用 pre-commit 框架 <a class="header-anchor" href="#使用-pre-commit-框架" aria-label="Permalink to &quot;使用 pre-commit 框架&quot;">​</a></h3><p>如果你的团队使用 <a href="https://pre-commit.com/" target="_blank" rel="noreferrer">pre-commit</a> 框架来管理 Git hooks，可以将 Claude 审查集成为框架中的一个 hook。这样的好处是，hook 的安装和更新由框架统一管理，团队成员不需要手动拷贝 hook 脚本。</p><p>配置 <code>.pre-commit-config.yaml</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>repos:</span></span>
<span class="line"><span>  - repo: local</span></span>
<span class="line"><span>    hooks:</span></span>
<span class="line"><span>      - id: claude-review</span></span>
<span class="line"><span>        name: Claude Code Review</span></span>
<span class="line"><span>        entry: bash -c &#39;claude -p &quot;Review staged changes for issues&quot; --max-turns 3 --output-format text&#39;</span></span>
<span class="line"><span>        language: system</span></span>
<span class="line"><span>        types: [python, javascript, typescript]</span></span>
<span class="line"><span>        stages: [pre-commit]</span></span></code></pre></div><h2 id="实战项目-完整的-ci-cd-审查系统" tabindex="-1">实战项目：完整的 CI/CD 审查系统 <a class="header-anchor" href="#实战项目-完整的-ci-cd-审查系统" aria-label="Permalink to &quot;实战项目：完整的 CI/CD 审查系统&quot;">​</a></h2><p>前面我们分别学习了 Headless 模式的各个组件——输出格式、管道集成、GitHub Actions、Pre-commit Hook。现在让我们把它们组装成一个完整的自动化审查系统。这个系统涵盖了从本地开发到远程 CI 的完整链路。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/dc120ec7e1a9e4c3dd49c9a99d013049.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/dc120ec7e1a9e4c3dd49c9a99d013049.jpg" alt=""></a></p><p>下面的目录结构展示了一个完整的 CI/CD 审查系统需要哪些文件。 <code>.github/workflows/</code> 下是 GitHub Actions 配置， <code>scripts/</code> 下是本地审查脚本， <code>.git/hooks/</code> 下是 pre-commit hook， <code>CLAUDE.md</code> 则为所有环节提供统一的审查规范。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>my-project/</span></span>
<span class="line"><span>├── .github/</span></span>
<span class="line"><span>│   └── workflows/</span></span>
<span class="line"><span>│       └── claude-review.yml    # GitHub Action 配置</span></span>
<span class="line"><span>├── scripts/</span></span>
<span class="line"><span>│   └── review.sh                # 本地审查脚本</span></span>
<span class="line"><span>├── .git/</span></span>
<span class="line"><span>│   └── hooks/</span></span>
<span class="line"><span>│       └── pre-commit           # Pre-commit Hook</span></span>
<span class="line"><span>└── CLAUDE.md                    # Claude 记忆文件</span></span></code></pre></div><p>CLAUDE.md 在 Headless 模式中扮演着关键角色。无论是 pre-commit hook 还是 GitHub Actions 中的 Claude，都会读取项目根目录的 CLAUDE.md 来了解审查规范。这意味着你可以通过一份配置文件，统一所有环节的审查标准。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 代码审查规范</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 审查重点</span></span>
<span class="line"><span>1. 代码质量：命名规范、DRY 原则、复杂度</span></span>
<span class="line"><span>2. 安全问题：输入验证、SQL 注入、XSS</span></span>
<span class="line"><span>3. 性能问题：N+1 查询、内存泄漏</span></span>
<span class="line"><span>4. 测试覆盖：关键路径必须有测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 输出格式</span></span>
<span class="line"><span>- Critical: 必须修复</span></span>
<span class="line"><span>- Warning: 应该修复</span></span>
<span class="line"><span>- Suggestion: 建议改进</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 禁止操作</span></span>
<span class="line"><span>- 不要修改 .env 文件</span></span>
<span class="line"><span>- 不要执行 npm publish</span></span>
<span class="line"><span>- 不要修改数据库迁移文件</span></span></code></pre></div><p><code>scripts/review.sh</code> 是一个独立的本地审查脚本，开发者可以在任何时候手动运行它来审查代码。它与 CI 中的审查使用相同的 Claude 能力，但运行在本地环境中。脚本包含了完整的错误处理、检查 API Key 是否设置、Claude Code 是否安装以及结果保存功能，每次审查的报告都会保存为带时间戳的 Markdown 文件。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># review.sh - 本地代码审查脚本</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span>TARGET=\${1:-.}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查 API Key</span></span>
<span class="line"><span>if [ -z &quot;$ANTHROPIC_API_KEY&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;Error: ANTHROPIC_API_KEY not set&quot;</span></span>
<span class="line"><span>    exit 1</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查 Claude Code</span></span>
<span class="line"><span>if ! command -v claude &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>    echo &quot;Error: Claude Code not installed&quot;</span></span>
<span class="line"><span>    echo &quot;Install with: npm install -g &amp;#64;anthropic-ai/claude-code&quot;</span></span>
<span class="line"><span>    exit 1</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;Starting code review for: $TARGET&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 构建文件列表</span></span>
<span class="line"><span>if [ -d &quot;$TARGET&quot; ]; then</span></span>
<span class="line"><span>    FILES=$(find &quot;$TARGET&quot; -type f \\( -name &quot;*.ts&quot; -o -name &quot;*.js&quot; -o -name &quot;*.py&quot; \\) | head -20)</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    FILES=&quot;$TARGET&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;Files to review:&quot;</span></span>
<span class="line"><span>echo &quot;$FILES&quot;</span></span>
<span class="line"><span>echo &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 运行审查</span></span>
<span class="line"><span>PROMPT=&quot;Review the following code files:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$FILES</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Analyze for:</span></span>
<span class="line"><span>1. Code quality and readability</span></span>
<span class="line"><span>2. Potential bugs and edge cases</span></span>
<span class="line"><span>3. Security vulnerabilities</span></span>
<span class="line"><span>4. Performance issues</span></span>
<span class="line"><span>5. Best practices violations</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Provide a detailed report with file:line references.&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RESULT=$(claude -p &quot;$PROMPT&quot; \\</span></span>
<span class="line"><span>    --output-format text \\</span></span>
<span class="line"><span>    --max-turns 15 \\</span></span>
<span class="line"><span>    --allowedTools Read,Grep,Glob)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出结果</span></span>
<span class="line"><span>echo &quot;============================================&quot;</span></span>
<span class="line"><span>echo &quot;               REVIEW REPORT                &quot;</span></span>
<span class="line"><span>echo &quot;============================================&quot;</span></span>
<span class="line"><span>echo &quot;$RESULT&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 保存到文件</span></span>
<span class="line"><span>REPORT_FILE=&quot;review-report-$(date +%Y%m%d-%H%M%S).md&quot;</span></span>
<span class="line"><span>cat &amp;gt; &quot;$REPORT_FILE&quot; &amp;lt;&amp;lt; EOF</span></span>
<span class="line"><span># Code Review Report</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Date**: $(date)</span></span>
<span class="line"><span>**Target**: $TARGET</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$RESULT</span></span>
<span class="line"><span></span></span>
<span class="line"><span>*Generated by Claude Code*</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;&quot;</span></span>
<span class="line"><span>echo &quot;Report saved to: $REPORT_FILE&quot;</span></span></code></pre></div><p>【新修订内容】</p><p>下面是生产级的 GitHub Action 配置。目前这个版本增加了变更文件计数、结构化的审查 prompt、以及关键问题检测逻辑。如果 Claude 给出 <code>request_changes</code> 结论，工作流将以失败状态退出，从而阻止 PR 合并。</p><p>设计要点包括以下几条。</p><ul><li><p>Verdict 用唯一 sentinel token（request_changes），不能用“Approved / Needs Changes / Request Changes”这种单词列表，否则 grep 会把 prompt 模板里列出的选项当成实际结论，几乎每次都误判。</p></li><li><p>多行变量通过 env: 传，不通过 \${​{ }​} 直接拼进 shell，避免命令注入。</p></li><li><p>wc -l 在空 diff 时返回 1，改用 grep -c .。</p></li><li><p>claude 失败时显式报错，不要让 set -eo pipefail 静默挂掉。</p></li><li><p>下游全部从 review.md 文件读，不通过 \${​{ steps.review.outputs.result }​} 把多行 markdown 拼进 shell / JS。</p></li></ul><p>完整文件参见 <code>.github/workflows/claude-review.yml</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name: Claude PR Review</span></span>
<span class="line"><span></span></span>
<span class="line"><span>on:</span></span>
<span class="line"><span>  pull_request:</span></span>
<span class="line"><span>    types: [opened, synchronize, reopened]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>concurrency:</span></span>
<span class="line"><span>  group: \${ { github.workflow } }-\${​{ github.event.pull_request.number }​}</span></span>
<span class="line"><span>  cancel-in-progress: true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>jobs:</span></span>
<span class="line"><span>  review:</span></span>
<span class="line"><span>    runs-on: ubuntu-latest</span></span>
<span class="line"><span>    permissions:</span></span>
<span class="line"><span>      contents: read</span></span>
<span class="line"><span>      pull-requests: write</span></span>
<span class="line"><span>    steps:</span></span>
<span class="line"><span>      - uses: actions/checkout&amp;#64;v4</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          fetch-depth: 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - uses: actions/setup-node&amp;#64;v4</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          node-version: &quot;20&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Install Claude Code</span></span>
<span class="line"><span>        run: npm install -g &amp;#64;anthropic-ai/claude-code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Get changed files</span></span>
<span class="line"><span>        id: changed</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          FILES=$(git diff --name-only &quot;origin/\${​{ github.base_ref }​}...HEAD&quot; || true)</span></span>
<span class="line"><span>          # grep -c . 在空字符串时返回 0；wc -l 会把空字符串错误地计成 1</span></span>
<span class="line"><span>          COUNT=$(echo &quot;$FILES&quot; | grep -c . || true)</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            echo &quot;files&amp;lt;&amp;lt;CHANGED_FILES_EOF_SENTINEL&quot;</span></span>
<span class="line"><span>            echo &quot;$FILES&quot;</span></span>
<span class="line"><span>            echo &quot;CHANGED_FILES_EOF_SENTINEL&quot;</span></span>
<span class="line"><span>          } &amp;gt;&amp;gt; &quot;$GITHUB_OUTPUT&quot;</span></span>
<span class="line"><span>          echo &quot;count=$COUNT&quot; &amp;gt;&amp;gt; &quot;$GITHUB_OUTPUT&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Run Claude Review</span></span>
<span class="line"><span>        id: review</span></span>
<span class="line"><span>        env:</span></span>
<span class="line"><span>          ANTHROPIC_API_KEY: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span>
<span class="line"><span>          # 通过 env 传变量，避免 \${​{ }​} 直接拼进 shell 导致命令注入</span></span>
<span class="line"><span>          CHANGED_FILES: \${​{ steps.changed.outputs.files }​}</span></span>
<span class="line"><span>          CHANGED_COUNT: \${​{ steps.changed.outputs.count }​}</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          PROMPT=&quot;Review this Pull Request.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          ## Changed Files (\${CHANGED_COUNT} files)</span></span>
<span class="line"><span>          \${CHANGED_FILES}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          ## Review Focus</span></span>
<span class="line"><span>          1. Code Quality: clean code, naming, DRY</span></span>
<span class="line"><span>          2. Bugs: edge cases, error handling</span></span>
<span class="line"><span>          3. Security: input validation, secrets, injection</span></span>
<span class="line"><span>          4. Performance: inefficient code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          ## Output Format</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          ### Summary</span></span>
<span class="line"><span>          [1-2 sentence overview]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          ### Issues Found</span></span>
<span class="line"><span>          - 🔴 Critical: &amp;lt;file&amp;gt;:&amp;lt;line&amp;gt; — &amp;lt;description&amp;gt;</span></span>
<span class="line"><span>          - 🟡 Warning: &amp;lt;file&amp;gt;:&amp;lt;line&amp;gt; — &amp;lt;description&amp;gt;</span></span>
<span class="line"><span>          - 🔵 Suggestion: &amp;lt;file&amp;gt;:&amp;lt;line&amp;gt; — &amp;lt;description&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          ### Verdict</span></span>
<span class="line"><span>          Output EXACTLY ONE sentinel token on its own line — do not echo</span></span>
<span class="line"><span>          the option list:</span></span>
<span class="line"><span>          &amp;lt;VERDICT&amp;gt;approved&amp;lt;/VERDICT&amp;gt;</span></span>
<span class="line"><span>          &amp;lt;VERDICT&amp;gt;needs_changes&amp;lt;/VERDICT&amp;gt;</span></span>
<span class="line"><span>          &amp;lt;VERDICT&amp;gt;request_changes&amp;lt;/VERDICT&amp;gt;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          if ! claude -p &quot;$PROMPT&quot; \\</span></span>
<span class="line"><span>            --output-format json \\</span></span>
<span class="line"><span>            --max-turns 10 \\</span></span>
<span class="line"><span>            --allowedTools Read,Grep,Glob &amp;gt; review.json 2&amp;gt; claude.err; then</span></span>
<span class="line"><span>            echo &quot;::error::Claude command failed&quot;</span></span>
<span class="line"><span>            cat claude.err</span></span>
<span class="line"><span>            exit 1</span></span>
<span class="line"><span>          fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          if ! jq empty review.json 2&amp;gt;/dev/null; then</span></span>
<span class="line"><span>            echo \\&quot;::error::review.json is not valid JSON\\&quot;</span></span>
<span class="line"><span>            cat review.json</span></span>
<span class="line"><span>            exit 1</span></span>
<span class="line"><span>          fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          jq -r &#39;.result // empty&#39; review.json &amp;gt; review.md</span></span>
<span class="line"><span>          if [ ! -s review.md ]; then</span></span>
<span class="line"><span>            echo \\&quot;::error::Claude returned empty result\\&quot;</span></span>
<span class="line"><span>            cat review.json</span></span>
<span class="line"><span>            exit 1</span></span>
<span class="line"><span>          fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Post Review Comment</span></span>
<span class="line"><span>        uses: actions/github-script&amp;#64;v7</span></span>
<span class="line"><span>        with:</span></span>
<span class="line"><span>          script: |</span></span>
<span class="line"><span>            const fs = require(&#39;fs&#39;);</span></span>
<span class="line"><span>            const review = fs.readFileSync(&#39;review.md&#39;, &#39;utf8&#39;);</span></span>
<span class="line"><span>            // 把 verdict sentinel 从 PR 评论里隐藏，纯展示用</span></span>
<span class="line"><span>            const visible = review.replace(/&amp;lt;VERDICT&amp;gt;[^&amp;lt;]+&amp;lt;\\/VERDICT&amp;gt;/g, &#39;&#39;).trim();</span></span>
<span class="line"><span>            const body = [</span></span>
<span class="line"><span>              &#39;## 🤖 Claude Code Review&#39;,</span></span>
<span class="line"><span>              &#39;&#39;,</span></span>
<span class="line"><span>              visible,</span></span>
<span class="line"><span>              &#39;&#39;,</span></span>
<span class="line"><span>              &#39;---&#39;,</span></span>
<span class="line"><span>              &#39;*Automated review by Claude Code*&#39;</span></span>
<span class="line"><span>            ].join(&#39;\\n&#39;);</span></span>
<span class="line"><span>            await github.rest.issues.createComment({</span></span>
<span class="line"><span>              issue_number: context.issue.number,</span></span>
<span class="line"><span>              owner: context.repo.owner,</span></span>
<span class="line"><span>              repo: context.repo.repo,</span></span>
<span class="line"><span>              body,</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      - name: Enforce verdict</span></span>
<span class="line"><span>        run: |</span></span>
<span class="line"><span>          # 用唯一 sentinel token 判断，不会和 prompt 模板字符串冲突</span></span>
<span class="line"><span>          if grep -q &quot;&amp;lt;VERDICT&amp;gt;request_changes&amp;lt;/VERDICT&amp;gt;&quot; review.md; then</span></span>
<span class="line"><span>            echo &quot;::error::Code review verdict: request_changes&quot;</span></span>
<span class="line"><span>            exit 1</span></span>
<span class="line"><span>          fi</span></span>
<span class="line"><span>          if grep -q &quot;&amp;lt;VERDICT&amp;gt;needs_changes&amp;lt;/VERDICT&amp;gt;&quot; review.md; then</span></span>
<span class="line"><span>            echo &quot;::warning::Code review verdict: needs_changes (non-blocking)&quot;</span></span>
<span class="line"><span>          fi</span></span></code></pre></div><blockquote><p><strong>勘误</strong>：本讲早期版本的这个示例用“Approved / Needs Changes / Request Changes”做 verdict，再用 <code>grep -qF &quot;Request Changes&quot;</code> 判定，结果 grep 把 prompt 模板里列出的选项也当成结论，导致 workflow 几乎每次都被自己的 verdict 检查触发 exit 1。感谢 Geek_122fe2 朋友的 bug 报告。</p></blockquote><h2 id="安全与成本控制" tabindex="-1">安全与成本控制 <a class="header-anchor" href="#安全与成本控制" aria-label="Permalink to &quot;安全与成本控制&quot;">​</a></h2><p>在 CI/CD 中运行 AI 代理，安全是绕不开的话题。与人类开发者不同，AI 代理不会主动判断“这个操作是否安全”，它只会尽力完成你给它的任务。所以安全的责任在配置端——你需要通过参数和权限设置，确保 Claude 只能做你允许它做的事。</p><p>根据 <a href="https://www.eesel.ai/blog/claude-code-automation" target="_blank" rel="noreferrer">eesel.ai 的指南</a>，在 CI/CD 中运行 Claude Code 时应该限制权限。 <strong>最小权限原则</strong> 的核心思想是：只给 Claude 完成任务所需的最少权限，不多给一分。对于只读审查任务，只允许 Read、Grep、Glob 三个工具就够了；如果不需要执行任意命令，明确禁用 Bash 工具；对于简单任务，限制执行轮次以防止无限循环。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 只读操作</span></span>
<span class="line"><span>claude -p &quot;分析代码&quot; --allowedTools Read,Grep,Glob</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 禁用危险工具</span></span>
<span class="line"><span>claude -p &quot;任务&quot; --disallowedTools Bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 限制执行轮次</span></span>
<span class="line"><span>claude -p &quot;快速任务&quot; --max-turns 3</span></span></code></pre></div><p>API Key 是访问 Claude 服务的凭证，泄露它意味着别人可以用你的账号消耗 API 额度。在 CI/CD 配置中， <strong>永远不要硬编码 API Key</strong>，而是使用平台提供的 Secrets 管理机制。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 不要这样做</span></span>
<span class="line"><span>env:</span></span>
<span class="line"><span>  ANTHROPIC_API_KEY: &quot;sk-ant-xxx&quot;  # 硬编码</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 正确做法</span></span>
<span class="line"><span>env:</span></span>
<span class="line"><span>  ANTHROPIC_API_KEY: \${​{ secrets.ANTHROPIC_API_KEY }​}</span></span></code></pre></div><p><a href="https://skywork.ai/blog/how-to-integrate-claude-code-ci-cd-guide-2025/" target="_blank" rel="noreferrer">Skywork AI 的指南</a> 中有这样的警告：</p><blockquote><p>在 CI/CD 流水线中使用无人监督的 Claude Code 自动化的主要风险是：AI 可能引入细微 Bug、误解核心目标，或在尝试完成任务时增加技术债务。最好从有监督的任务开始，并在让 AI 对生产代码库进行无监督修改之前加入人工审查步骤。</p></blockquote><p>这段警告值得反复阅读。AI 代理在无人监管环境中的最大风险不是“做错事”，而是看起来做对了，但引入了微妙的问题。一个 AI 自动修复的 Bug 可能通过了所有现有测试，但在某个边缘条件下引入了新的问题。比如 AI 可能自动“优化”了一段缓存逻辑，代码更简洁了，也通过了所有测试。但它不小心去掉了一个过期清除的判断逻辑，结果缓存数据长期不更新，线上就会悄悄变脏。</p><p>建议采用渐进式采纳策略。</p><ol><li><p><strong>从只读开始</strong>：先让 Claude 只做审查，不做修改。</p></li><li><p><strong>人工审批</strong>：Claude 的修改建议需要人工确认后才能合并。</p></li><li><p><strong>限制范围</strong>：不要让 Claude 自动修改核心业务逻辑。</p></li><li><p><strong>审计日志</strong>：记录所有 Claude 的操作。</p></li></ol><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/56cd235f412dab9b4a0cfb5c07966966.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/959884/56cd235f412dab9b4a0cfb5c07966966.jpg" alt=""></a></p><p>每次 CI 运行都会消耗 API tokens，而 tokens 意味着真金白银。在高频迭代的项目中，如果每次推送都触发完整的 AI 审查，成本可能会快速累积。通过合理的触发条件和并发控制，可以在保持审查覆盖率的同时有效控制成本。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 只在特定条件下运行</span></span>
<span class="line"><span>on:</span></span>
<span class="line"><span>  pull_request:</span></span>
<span class="line"><span>    types: [opened]  # 不包括 synchronize，减少运行次数</span></span>
<span class="line"><span>    paths:</span></span>
<span class="line"><span>      - &#39;src/**&#39;     # 只在 src 目录变更时运行</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 限制并发</span></span>
<span class="line"><span>concurrency:</span></span>
<span class="line"><span>  group: claude-\${​{ github.event.pull_request.number }​}</span></span>
<span class="line"><span>  cancel-in-progress: true</span></span></code></pre></div><h2 id="其它-ci-平台集成" tabindex="-1">其它 CI 平台集成 <a class="header-anchor" href="#其它-ci-平台集成" aria-label="Permalink to &quot;其它 CI 平台集成&quot;">​</a></h2><p>虽然 GitHub Actions 有官方支持，但 Headless 模式可以在任何 CI 平台上工作。因为 Headless 模式的本质就是命令行调用——只要平台能运行 <code>npm install</code> 和 <code>claude -p</code>，就能集成。下面是三个主流 CI 平台的配置示例。</p><p><strong>GitLab CI：</strong> GitLab CI 使用 <code>.gitlab-ci.yml</code> 配置文件，语法与 GitHub Actions 的 YAML 不同但概念相似。注意变量引用方式的差异——GitLab 使用 <code>$VARIABLE_NAME</code>，而不是 GitHub 的 <code>\${​{ secrets.VARIABLE_NAME }​}</code>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>claude-review:</span></span>
<span class="line"><span>  image: node:20</span></span>
<span class="line"><span>  script:</span></span>
<span class="line"><span>    - npm install -g &amp;#64;anthropic-ai/claude-code</span></span>
<span class="line"><span>    - claude -p &quot;Review the changes in this MR&quot; --output-format text</span></span>
<span class="line"><span>  variables:</span></span>
<span class="line"><span>    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY</span></span>
<span class="line"><span>  only:</span></span>
<span class="line"><span>    - merge_requests</span></span></code></pre></div><p><strong>CircleCI：</strong> CircleCI 使用 <code>config.yml</code>，放在 <code>.circleci/</code> 目录下。它的配置结构是 jobs -&gt; steps，与 GitHub Actions 的 jobs -&gt; steps 概念对应。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>version: 2.1</span></span>
<span class="line"><span>jobs:</span></span>
<span class="line"><span>  review:</span></span>
<span class="line"><span>    docker:</span></span>
<span class="line"><span>      - image: cimg/node:20.0</span></span>
<span class="line"><span>    steps:</span></span>
<span class="line"><span>      - checkout</span></span>
<span class="line"><span>      - run:</span></span>
<span class="line"><span>          name: Install Claude Code</span></span>
<span class="line"><span>          command: npm install -g &amp;#64;anthropic-ai/claude-code</span></span>
<span class="line"><span>      - run:</span></span>
<span class="line"><span>          name: Run Review</span></span>
<span class="line"><span>          command: |</span></span>
<span class="line"><span>            claude -p &quot;Review this code&quot; --output-format text</span></span>
<span class="line"><span>          environment:</span></span>
<span class="line"><span>            ANTHROPIC_API_KEY: \${ANTHROPIC_API_KEY}</span></span></code></pre></div><p><strong>Jenkins：</strong> Jenkins 使用 Groovy DSL 定义 Pipeline，风格与上面两个 YAML 驱动的系统截然不同。但核心逻辑是一样的，安装 Claude Code，设置环境变量，运行 headless 命令。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipeline {</span></span>
<span class="line"><span>    agent any</span></span>
<span class="line"><span>    environment {</span></span>
<span class="line"><span>        ANTHROPIC_API_KEY = credentials(&#39;anthropic-api-key&#39;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    stages {</span></span>
<span class="line"><span>        stage(&#39;Review&#39;) {</span></span>
<span class="line"><span>            steps {</span></span>
<span class="line"><span>                sh &#39;npm install -g &amp;#64;anthropic-ai/claude-code&#39;</span></span>
<span class="line"><span>                sh &#39;claude -p &quot;Review this code&quot; --output-format text&#39;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结一下" tabindex="-1">总结一下 <a class="header-anchor" href="#总结一下" aria-label="Permalink to &quot;总结一下&quot;">​</a></h2><p>这一讲我们学习了 Claude Code 的 Headless 模式，让 AI 助手在无人值守的情况下自动工作。</p><p>Headless 模式的核心是 <code>-p</code> 标志。它告诉 Claude Code 不要打开交互界面，直接执行任务并输出结果。配合 <code>--output-format</code> 可以选择 text、json 或 stream-json 三种输出格式，分别适用于人类阅读、程序解析和实时监控。</p><p>Claude Code 的一个独特优势是它能无缝融入 Unix 管道。你可以用 <code>cat file | claude -p &quot;分析&quot;</code> 将文件内容传给 Claude，也可以将 Claude 的输出通过管道传给其他工具。这种设计让 Claude 成为你工具链中的一环，而不是一个孤立的应用。</p><p>GitHub Actions 是 Headless 模式最常见的应用场景。Anthropic 提供了官方 Action，支持 @claude 提及触发和自动化 prompt 两种模式。通过配置工作流，你可以实现 PR 自动审查、lint 错误自动修复、文档自动生成等功能。</p><p>安全是 CI/CD 集成的关键考量。应该限制 Claude 可用的工具（用 <code>--allowedTools</code>）、控制执行轮次（用 <code>--max-turns</code>）、使用 Secrets 管理 API Key，并在让 Claude 自动修改代码前加入人工审查步骤。</p><p>Headless 模式让 Claude Code 从一个“需要人坐在终端前”的工具，进化为可以 7x24 小时自动工作的智能助手。开篇故事中，那个跨时区团队的 PR 审查周期从 36 小时缩短到 8 小时，正是这种进化的体现。</p><p>最后说个题外话（但我们在工程里要引起重视），最近发生的源码泄露事件，再次提醒我们，CI/CD发布管道是安全链中最薄弱的环节。面对“无人值守”的诱惑，要有设计完善的、真正启用的防护和审核机制兜底。更多关于这个热点事件的启示和架构探讨，可以移步去看我这周三发布的 <a href="https://time.geekbang.org/column/article/963248" target="_blank" rel="noreferrer">加餐</a>，期待你在评论区分享交流。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>你的团队有哪些重复性的代码审查任务可以用 Headless 模式自动化？试着列出三个具体场景，并为每个场景设计 <code>--allowedTools</code> 和 <code>--max-turns</code> 的参数组合。</p></li><li><p>如果 Claude 在 CI 中自动修复了一个 Bug，但修复方式不是最优的，你会如何处理？请从流程设计的角度思考，如何在“自动化效率”和“代码质量控制”之间找到平衡点。</p></li><li><p>Headless 模式不保存会话状态。如果你需要在多个 CI 步骤之间保持上下文（例如第一步分析代码，第二步根据分析结果生成测试），你会怎么设计？提示：考虑 <code>--session-id</code> 参数和文件系统中间状态的组合使用。</p></li><li><p>对比 Pre-commit Hook 和 GitHub Actions 两种集成方式的优缺点。在什么场景下你会选择只用其中一种？在什么场景下你会同时使用两种？</p></li></ol><h2 id="下一讲预告" tabindex="-1">下一讲预告 <a class="header-anchor" href="#下一讲预告" aria-label="Permalink to &quot;下一讲预告&quot;">​</a></h2><p>Headless 模式解决了无人值守的问题，但这背后藏着一个更尖锐的问题： <strong>没人盯着的时候，谁来定规矩？</strong></p><p>下一讲，我们将深入 <strong>Rules 规则系统</strong>——Claude Code 中两种截然不同的规则：写在 CLAUDE.md 和 <code>.claude/rules/</code> 里的 <strong>指令规则</strong> 是软约束，引导 Claude 的行为风格；写在 settings.json 里的 <strong>权限规则</strong> 是硬约束，在客户端强制执行。一个是员工手册，一个是门禁系统。理解它们的区别和协同，是构建可靠 AI 工作流的关键。</p><p>欢迎你在留言区参与讨论，如果这节课对你有启发，别忘了分享给身边更多朋友。</p>`,157)])])}const g=n(l,[["render",t]]);export{h as __pageData,g as default};
