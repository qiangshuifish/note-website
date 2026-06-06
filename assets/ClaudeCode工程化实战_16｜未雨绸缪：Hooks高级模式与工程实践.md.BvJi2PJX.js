import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"16｜未雨绸缪：Hooks 高级模式与工程实践","description":"","frontmatter":{},"headers":[{"level":2,"title":"Stop Hook——任务完成时的质量门控","slug":"stop-hook——任务完成时的质量门控","link":"#stop-hook——任务完成时的质量门控","children":[{"level":3,"title":"实战：自动测试门控","slug":"实战-自动测试门控","link":"#实战-自动测试门控","children":[]},{"level":3,"title":"用 Prompt 类型实现更灵活的 Stop Hook","slug":"用-prompt-类型实现更灵活的-stop-hook","link":"#用-prompt-类型实现更灵活的-stop-hook","children":[]},{"level":3,"title":"防止 Stop Hook 死循环：stop_hook_active","slug":"防止-stop-hook-死循环-stop-hook-active","link":"#防止-stop-hook-死循环-stop-hook-active","children":[]}]},{"level":2,"title":"子代理事件——SubagentStart 与 SubagentStop","slug":"子代理事件——subagentstart-与-subagentstop","link":"#子代理事件——subagentstart-与-subagentstop","children":[{"level":3,"title":"SubagentStart：为子代理注入上下文","slug":"subagentstart-为子代理注入上下文","link":"#subagentstart-为子代理注入上下文","children":[]},{"level":3,"title":"SubagentStop：验证子代理的工作成果","slug":"subagentstop-验证子代理的工作成果","link":"#subagentstop-验证子代理的工作成果","children":[]},{"level":3,"title":"实战：用 SubagentStop 验证代码审查质量","slug":"实战-用-subagentstop-验证代码审查质量","link":"#实战-用-subagentstop-验证代码审查质量","children":[]}]},{"level":2,"title":"实战项目——完整的 Hook 系统","slug":"实战项目——完整的-hook-系统","link":"#实战项目——完整的-hook-系统","children":[{"level":3,"title":"项目一：安全钩子系统","slug":"项目一-安全钩子系统","link":"#项目一-安全钩子系统","children":[]},{"level":3,"title":"项目二：质量钩子系统","slug":"项目二-质量钩子系统","link":"#项目二-质量钩子系统","children":[]}]},{"level":2,"title":"高级模式与最佳实践","slug":"高级模式与最佳实践","link":"#高级模式与最佳实践","children":[{"level":3,"title":"多 Hook 链","slug":"多-hook-链","link":"#多-hook-链","children":[]},{"level":3,"title":"环境变量","slug":"环境变量","link":"#环境变量","children":[]},{"level":3,"title":"在 Commands 和 Skills 中定义临时 Hooks","slug":"在-commands-和-skills-中定义临时-hooks","link":"#在-commands-和-skills-中定义临时-hooks","children":[]},{"level":3,"title":"子代理 frontmatter 内置 Hooks——比全局配置更精准的方案","slug":"子代理-frontmatter-内置-hooks——比全局配置更精准的方案","link":"#子代理-frontmatter-内置-hooks——比全局配置更精准的方案","children":[]},{"level":3,"title":"调试技巧","slug":"调试技巧","link":"#调试技巧","children":[]},{"level":3,"title":"异步 Hook：后台执行不阻塞","slug":"异步-hook-后台执行不阻塞","link":"#异步-hook-后台执行不阻塞","children":[]},{"level":3,"title":"HTTP Hook：对接外部服务","slug":"http-hook-对接外部服务","link":"#http-hook-对接外部服务","children":[]},{"level":3,"title":"安全最佳实践","slug":"安全最佳实践","link":"#安全最佳实践","children":[]}]},{"level":2,"title":"Hook 工程设计方法论","slug":"hook-工程设计方法论","link":"#hook-工程设计方法论","children":[{"level":3,"title":"三维决策框架","slug":"三维决策框架","link":"#三维决策框架","children":[]},{"level":3,"title":"Hook + SubAgent 组合模式","slug":"hook-subagent-组合模式","link":"#hook-subagent-组合模式","children":[]}]},{"level":2,"title":"总结一下","slug":"总结一下","link":"#总结一下","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]},{"level":2,"title":"下一讲预告","slug":"下一讲预告","link":"#下一讲预告","children":[]},{"level":2,"title":"本讲示例项目对应表","slug":"本讲示例项目对应表","link":"#本讲示例项目对应表","children":[]}],"relativePath":"ClaudeCode工程化实战/16｜未雨绸缪：Hooks高级模式与工程实践.md","filePath":"ClaudeCode工程化实战/16｜未雨绸缪：Hooks高级模式与工程实践.md","lastUpdated":1779815462000}'),o={name:"ClaudeCode工程化实战/16｜未雨绸缪：Hooks高级模式与工程实践.md"};function t(l,s,i,c,u,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_16-未雨绸缪-hooks-高级模式与工程实践" tabindex="-1">16｜未雨绸缪：Hooks 高级模式与工程实践 <a class="header-anchor" href="#_16-未雨绸缪-hooks-高级模式与工程实践" aria-label="Permalink to &quot;16｜未雨绸缪：Hooks 高级模式与工程实践&quot;">​</a></h1><blockquote><p>释题：未雨绸缪。从 Stop Hook 质量门控到 SubAgent 事件验收，从 frontmatter 精准配置到三维决策框架——每一步都设防，构建滴水不漏的 Hook 工程体系。</p></blockquote><p>你好，我是黄佳。</p><p>上一讲我们学习了 Hooks 的基础概念——中间件本质、事件体系、配置结构，以及最常用的 PreToolUse 和 PostToolUse 两大实战。PreToolUse 在工具执行前做“入口安检”，PostToolUse 在工具执行后做“过程质检”。</p><p>但还有一个关键环节我们没有覆盖： <strong>Claude 做完整个任务后，谁来验收？</strong></p><p>这就好比工厂的流水线：安检门（PreToolUse）检查原料是否合格，质检站（PostToolUse）检查每道工序的产出。但产品最终出厂前，还需要一道 <strong>终检</strong>——确认成品整体质量达标。这道终检，就是 Stop Hook。</p><p>除了 Stop Hook，这一讲中我们还会介绍子代理场景下的 SubagentStart 和 SubagentStop 事件、frontmatter 内置 Hooks 的精准控制、多 Hook 链的组合模式，以及 Hook 工程设计的系统方法论。</p><p>内容不少，我们将步步为营，把整个 Hook 体系的高级武器库全部打通。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/5e5b34df378da5c45efd48b006e6a6d2.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/5e5b34df378da5c45efd48b006e6a6d2.jpg" alt=""></a></p><h2 id="stop-hook——任务完成时的质量门控" tabindex="-1">Stop Hook——任务完成时的质量门控 <a class="header-anchor" href="#stop-hook——任务完成时的质量门控" aria-label="Permalink to &quot;Stop Hook——任务完成时的质量门控&quot;">​</a></h2><p>Stop Hook 在 Claude <strong>完成响应后</strong> 运行。如果说 PreToolUse 是入口安检，PostToolUse 是过程质检，那么 Stop Hook 就是出厂验收——在 Claude 宣布“我做完了”之后，再检查一遍交付物的质量。</p><p>Stop Hook 的核心能力是让 Claude 继续工作，Stop Hook 和其他 Hook 的最大区别。这个能力来源于它的 <code>continue</code> 字段：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;decision&quot;: &quot;block&quot;,</span></span>
<span class="line"><span>  &quot;reason&quot;: &quot;Tests are failing, please fix them&quot;,</span></span>
<span class="line"><span>  &quot;continue&quot;: true</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>continue: true</code> 意味着“不要停，继续工作”。这创造了一个自动循环：Claude 认为完成了 → Stop Hook 检查 → 发现测试失败 → 把失败信息反馈给 Claude → Claude 继续修复 → 再次完成 → 再次检查…… <strong>直到所有检查通过，Claude 才被允许真正停下来</strong>。</p><p>这种机制把质量保证从“事后检查“变成了”交付前置条件”，这样能让 Claude 不是做完了再检查，而是检查通过了才算做完。</p><h3 id="实战-自动测试门控" tabindex="-1">实战：自动测试门控 <a class="header-anchor" href="#实战-自动测试门控" aria-label="Permalink to &quot;实战：自动测试门控&quot;">​</a></h3><p>这是 Stop Hook 最经典的应用——Claude 完成任务后自动运行测试，测试不通过就不让停。</p><p>为什么要在 Stop 时运行测试而不是在每次文件修改后？因为一个功能的实现通常涉及多个文件的修改。中间状态的测试必然会失败——你改了接口但还没改实现，测试当然过不了。只有在 Claude 认为“全部完成”的时刻，再运行测试才有意义。</p><p>实战项目位于 <code>hooks/run-tests.sh</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># run-tests.sh</span></span>
<span class="line"><span># 在 Claude 完成时自动运行测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;DEBUG: Running tests before stopping...&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 确定项目目录</span></span>
<span class="line"><span>if [ -n &quot;$CLAUDE_PROJECT_DIR&quot; ]; then</span></span>
<span class="line"><span>    cd &quot;$CLAUDE_PROJECT_DIR&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检测项目类型并运行相应的测试</span></span>
<span class="line"><span>RUN_TESTS=false</span></span>
<span class="line"><span>TEST_RESULT=&quot;&quot;</span></span>
<span class="line"><span>TEST_PASSED=true</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Node.js 项目</span></span>
<span class="line"><span>if [ -f &quot;package.json&quot; ]; then</span></span>
<span class="line"><span>    RUN_TESTS=true</span></span>
<span class="line"><span>    echo &quot;DEBUG: Detected Node.js project&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if grep -q &#39;&quot;test&quot;&#39; package.json; then</span></span>
<span class="line"><span>        TEST_RESULT=$(npm test 2&amp;gt;&amp;1) || TEST_PASSED=false</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        TEST_RESULT=&quot;No test script found in package.json&quot;</span></span>
<span class="line"><span>        TEST_PASSED=true  # 没有测试不算失败</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Python 项目</span></span>
<span class="line"><span>elif [ -f &quot;pytest.ini&quot; ] || [ -f &quot;setup.py&quot; ] || [ -f &quot;pyproject.toml&quot; ]; then</span></span>
<span class="line"><span>    RUN_TESTS=true</span></span>
<span class="line"><span>    echo &quot;DEBUG: Detected Python project&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if command -v pytest &amp;&amp;gt; /dev/null; then</span></span>
<span class="line"><span>        TEST_RESULT=$(pytest 2&amp;gt;&amp;1) || TEST_PASSED=false</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Go 项目</span></span>
<span class="line"><span>elif [ -f &quot;go.mod&quot; ]; then</span></span>
<span class="line"><span>    RUN_TESTS=true</span></span>
<span class="line"><span>    TEST_RESULT=$(go test ./... 2&amp;gt;&amp;1) || TEST_PASSED=false</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Rust 项目</span></span>
<span class="line"><span>elif [ -f &quot;Cargo.toml&quot; ]; then</span></span>
<span class="line"><span>    RUN_TESTS=true</span></span>
<span class="line"><span>    TEST_RESULT=$(cargo test 2&amp;gt;&amp;1) || TEST_PASSED=false</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 如果没有检测到测试框架</span></span>
<span class="line"><span>if [ &quot;$RUN_TESTS&quot; = false ]; then</span></span>
<span class="line"><span>    echo &#39;{}&#39;</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 转义 JSON 特殊字符</span></span>
<span class="line"><span>TEST_RESULT_ESCAPED=$(echo &quot;$TEST_RESULT&quot; | head -50 | jq -Rs &#39;.&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ &quot;$TEST_PASSED&quot; = true ]; then</span></span>
<span class="line"><span>    # 测试通过，允许停止</span></span>
<span class="line"><span>    echo &#39;{&quot;decision&quot;: &quot;approve&quot;, &quot;reason&quot;: &quot;All tests passed.&quot;}&#39;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    # 测试失败，让 Claude 继续修复</span></span>
<span class="line"><span>    cat &amp;lt;&amp;lt;EOF</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    &quot;decision&quot;: &quot;block&quot;,</span></span>
<span class="line"><span>    &quot;reason&quot;: &quot;Tests are failing. Please fix the issues before stopping.&quot;,</span></span>
<span class="line"><span>    &quot;continue&quot;: true,</span></span>
<span class="line"><span>    &quot;systemMessage&quot;: $TEST_RESULT_ESCAPED</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>让我们逐段解析这个脚本的工作流程。</p><p><strong>项目类型检测</strong>：脚本通过检查特征文件来判断项目类型—— <code>package.json</code> 意味着 Node.js， <code>pyproject.toml</code> 意味着 Python， <code>go.mod</code> 意味着 Go， <code>Cargo.toml</code> 意味着 Rust。这种“约定优于配置”的检测方式让脚本能在不同类型的项目中通用，无需额外配置。</p><p><strong>容错处理</strong>： <code>grep -q &#39;&quot;test&quot;&#39; package.json</code> 先检查 package.json 中是否有 test 脚本。如果项目根本没有配置测试命令，脚本不会报错，而是报告 “No test script found” 并放行。 <strong>没有测试不等于测试失败</strong>——你不能因为项目还没写测试就阻止 Claude 完成工作。</p><p><strong>结果截断</strong>： <code>head -50</code> 只取测试输出的前 50 行。测试失败的输出可能非常长（几百行甚至几千行），但 Claude 只需要看到关键的错误信息就能定位问题。传入太多信息反而会稀释重点（这又是第 6 讲中“信噪比“思维的体现）。</p><p><strong>关键分支</strong>：测试通过时，输出 <code>additionalContext</code> 告诉 “Claude All tests passed”，脚本正常退出；测试失败时，输出 <code>&quot;decision&quot;: &quot;block&quot;</code> 加 <code>&quot;continue&quot;: true</code>，强制 Claude 继续工作。Claude 会收到测试失败的详细信息，然后自动尝试修复。</p><p>配置方式：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;Stop&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/run-tests.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意 Stop 事件没有 <code>matcher</code> 字段——因为 Stop 是生命周期事件，不针对特定工具。</p><p><strong>动手试一下</strong>——进入质量钩子项目，让 Claude 写一段会导致测试失败的代码，观察 Stop Hook 的自动门控行为：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 进入质量钩子项目（已配好 .claude/settings.json）</span></span>
<span class="line"><span>cd 06-Hooks/projects/02-quality-hooks</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 启动 Claude Code</span></span>
<span class="line"><span>claude</span></span></code></pre></div><p>进入会话后，给 Claude 一个会产生测试失败的任务：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我创建一个 Node.js 项目，写一个 add 函数和对应的测试，但故意让测试失败</span></span></code></pre></div><p>当 Claude 写完代码准备停下来时，Stop Hook 自动触发 <code>run-tests.sh</code>。如果测试失败，你会看到：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>● Stop hook returned blocking error</span></span>
<span class="line"><span>  Tests are failing. Please fix the issues before stopping.</span></span>
<span class="line"><span>  ⎿  [测试失败的详细输出...]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>● Claude 继续修复代码...</span></span></code></pre></div><p>Claude 收到失败信息后会自动修复，直到测试通过才真正停下来。如果你看到的是 <code>hook error</code> 而不是 <code>blocking error</code>，请检查 <code>jq</code> 是否可用（参见 <a href="https://time.geekbang.org/column/article/953022" target="_blank" rel="noreferrer">第 15 讲</a> 的前置依赖说明）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/0f4c558c7c11630fe83d25a18090aa90.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/0f4c558c7c11630fe83d25a18090aa90.jpg" alt=""></a></p><p>这个 Hook 实现了一个强大的保障—— <strong>Claude 不会在测试失败的情况下停止工作</strong>。它会不断尝试修复，直到所有测试通过。这在 Claude 执行复杂的重构任务时特别有价值——重构常常会破坏现有测试，而这个 Hook 确保 Claude 会把测试修好才停手。</p><h3 id="用-prompt-类型实现更灵活的-stop-hook" tabindex="-1">用 Prompt 类型实现更灵活的 Stop Hook <a class="header-anchor" href="#用-prompt-类型实现更灵活的-stop-hook" aria-label="Permalink to &quot;用 Prompt 类型实现更灵活的 Stop Hook&quot;">​</a></h3><p>Shell 脚本适合检查客观事实——测试通不通过、文件存不存在。但有时候你需要检查更“主观”的东西，包括代码风格是否合理？功能实现是否完整？有没有遗漏边界情况？这些判断需要“理解力”，不是模式匹配能解决的。</p><p>这时可以用 Prompt 类型的 Stop Hook，让一个小型 LLM（通常是 Haiku）担任代码审查员：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;Stop&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;prompt&quot;,</span></span>
<span class="line"><span>            &quot;prompt&quot;: &quot;Review the changes made in this session. Check that: 1) All requested features are implemented 2) No obvious bugs or security issues 3) Code follows project conventions. If any issues found, respond with continue: true and explain what needs to be fixed.&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这相当于在 Claude 完成工作后，让另一个 AI 做 code review。两个 AI 的视角不同——主 Claude 相当于作者，Prompt Hook 的 Haiku 担任审查者。审查者往往能发现作者忽略的问题，因为它没有“我刚写的代码当然是对的”这种认知偏见。</p><p>当然，Prompt 类型的可靠性低于 Command 类型。LLM 可能漏检，也可能误报。但作为测试门控（Command 类型）之外的 <strong>第二层防线</strong>，它能覆盖一些脚本无法检查的维度。</p><h3 id="防止-stop-hook-死循环-stop-hook-active" tabindex="-1">防止 Stop Hook 死循环：stop_hook_active <a class="header-anchor" href="#防止-stop-hook-死循环-stop-hook-active" aria-label="Permalink to &quot;防止 Stop Hook 死循环：stop\\_hook\\_active&quot;">​</a></h3><p>Stop Hook 的 <code>continue: true</code> 很强大，但也有风险——如果 Claude 一直修不好，就会进入死循环：测试失败 → Claude 修复 → 测试还是失败 → Claude 再修 → 还是失败……如此无限循环。</p><p>所幸官方提供了一个安全字段 <code>stop_hook_active</code>：当 Claude 因为 Stop Hook 而继续工作时，下一次 Stop 事件的输入中 <code>stop_hook_active</code> 会被设为 <code>true</code>。你的脚本应该检查这个字段来避免死循环：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查是否已经因为 Stop Hook 继续过了</span></span>
<span class="line"><span>if [ &quot;$(echo &quot;$INPUT&quot; | jq -r &#39;.stop_hook_active&#39;)&quot; = &quot;true&quot; ]; then</span></span>
<span class="line"><span>    # 已经重试过一次了，这次让 Claude 停下来</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 正常的测试逻辑</span></span>
<span class="line"><span>npm test 2&amp;gt;&amp;1</span></span>
<span class="line"><span>if [ $? -ne 0 ]; then</span></span>
<span class="line"><span>    echo &#39;{&quot;decision&quot;: &quot;block&quot;, &quot;reason&quot;: &quot;Tests still failing, please fix.&quot;}&#39;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span></code></pre></div><p>这个模式允许 Claude 重试一次——第一次 Stop 时检查测试，如果失败就让 Claude 继续修复；第二次 Stop 时， <code>stop_hook_active</code> 为 <code>true</code>，无论测试是否通过都让 Claude 停下来。</p><p>16-1</p><h2 id="子代理事件——subagentstart-与-subagentstop" tabindex="-1">子代理事件——SubagentStart 与 SubagentStop <a class="header-anchor" href="#子代理事件——subagentstart-与-subagentstop" aria-label="Permalink to &quot;子代理事件——SubagentStart 与 SubagentStop&quot;">​</a></h2><p>在第 3-8 讲中，我们学习了子代理的各种使用模式。现在我们从 Hook 的角度来看子代理—— <strong>如何在子代理启动和完成时自动执行检查？</strong></p><p>这两个事件把 Hooks 和 SubAgents 两大机制连接了起来，让你能在子代理的“入口”和“出口“自动插入逻辑。</p><h3 id="subagentstart-为子代理注入上下文" tabindex="-1">SubagentStart：为子代理注入上下文 <a class="header-anchor" href="#subagentstart-为子代理注入上下文" aria-label="Permalink to &quot;SubagentStart：为子代理注入上下文&quot;">​</a></h3><p><code>SubagentStart</code> 在子代理被启动时触发。它的 matcher 匹配的是 <strong>子代理类型名</strong>，而不是工具名。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/99ae26020374e49c617955283ba00c31.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/99ae26020374e49c617955283ba00c31.jpg" alt=""></a></p><p>SubagentStart 接收的输入数据包含子代理的标识信息。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;session_id&quot;: &quot;abc123&quot;,</span></span>
<span class="line"><span>  &quot;cwd&quot;: &quot;/project/root&quot;,</span></span>
<span class="line"><span>  &quot;hook_event_name&quot;: &quot;SubagentStart&quot;,</span></span>
<span class="line"><span>  &quot;agent_id&quot;: &quot;agent-def456&quot;,</span></span>
<span class="line"><span>  &quot;agent_type&quot;: &quot;code-reviewer&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>SubagentStart 不能阻止子代理启动</strong>（这是设计决策——启动子代理是主会话的明确意图，不应该被 Hook 否决），但可以通过 <code>additionalContext</code> 向子代理注入上下文信息。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hookSpecificOutput&quot;: {</span></span>
<span class="line"><span>    &quot;hookEventName&quot;: &quot;SubagentStart&quot;,</span></span>
<span class="line"><span>    &quot;additionalContext&quot;: &quot;当前分支是 feature/payment-refactor，请特别关注支付相关的代码变更&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个能力的价值在于 <strong>自动化上下文注入</strong>。比如你有一个 <code>code-reviewer</code> 子代理，每次启动时都需要知道团队的编码规范。</p><p>如果没有 SubagentStart Hook，你得在每次调用子代理时手动提醒它“请遵循 camelCase 命名规范“。有了 Hook，这个提醒将自动发生。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;SubagentStart&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;code-reviewer&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;echo &#39;{\\&quot;hookSpecificOutput\\&quot;:{\\&quot;hookEventName\\&quot;:\\&quot;SubagentStart\\&quot;,\\&quot;additionalContext\\&quot;:\\&quot;Team coding standards: use camelCase, max line length 100, always add JSDoc for public APIs\\&quot;}​}&#39;&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，每次 <code>code-reviewer</code> 子代理启动时，都会自动收到团队编码规范——不需要在每次调用时手动提醒，不需要把规范写到子代理的 prompt 里（那样会占用子代理的上下文空间）。</p><h3 id="subagentstop-验证子代理的工作成果" tabindex="-1">SubagentStop：验证子代理的工作成果 <a class="header-anchor" href="#subagentstop-验证子代理的工作成果" aria-label="Permalink to &quot;SubagentStop：验证子代理的工作成果&quot;">​</a></h3><p><code>SubagentStop</code> 在子代理完成工作后触发。它的决策控制和 <code>Stop</code> 事件完全一致—— <strong>可以阻止子代理停止，强制它继续工作</strong>。</p><p>SubagentStop 的输入数据有一个独特的字段， <code>agent_transcript_path</code>。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;session_id&quot;: &quot;abc123&quot;,</span></span>
<span class="line"><span>  &quot;cwd&quot;: &quot;/project/root&quot;,</span></span>
<span class="line"><span>  &quot;hook_event_name&quot;: &quot;SubagentStop&quot;,</span></span>
<span class="line"><span>  &quot;stop_hook_active&quot;: false,</span></span>
<span class="line"><span>  &quot;agent_id&quot;: &quot;agent-def456&quot;,</span></span>
<span class="line"><span>  &quot;agent_type&quot;: &quot;code-reviewer&quot;,</span></span>
<span class="line"><span>  &quot;transcript_path&quot;: &quot;~/.claude/projects/.../main-session.jsonl&quot;,</span></span>
<span class="line"><span>  &quot;agent_transcript_path&quot;: &quot;~/.claude/projects/.../subagents/agent-def456.jsonl&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意两个 transcript path 的区别， <code>transcript_path</code> 是主会话的对话记录， <code>agent_transcript_path</code> 是子代理自己的对话记录。这意味着你的 Hook 脚本可以 <strong>读取子代理的完整对话历史</strong> 来判断质量——不是只看最终结果，而是能看到子代理是怎么得出结论的。 SubagentStop 的决策控制和 Stop 事件一样，可以用 <code>decision: &quot;block&quot;</code> 阻止子代理完成，强制它继续工作。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;decision&quot;: &quot;block&quot;,</span></span>
<span class="line"><span>  &quot;reason&quot;: &quot;Code review is incomplete: you found 3 issues but only provided fixes for 2. Please complete the review.&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="实战-用-subagentstop-验证代码审查质量" tabindex="-1">实战：用 SubagentStop 验证代码审查质量 <a class="header-anchor" href="#实战-用-subagentstop-验证代码审查质量" aria-label="Permalink to &quot;实战：用 SubagentStop 验证代码审查质量&quot;">​</a></h3><p>下面这个脚本验证 <code>code-reviewer</code> 子代理的审查是否完整——如果它发现了问题但没有给出修复建议，就强制它继续工作。</p><p>这个需求背后的逻辑是：一个好的代码审查不仅要 <strong>发现问题</strong>，还要 <strong>提供解决方案</strong>。只说“这里有 bug，而不说建议如何修复的审查是不完整的。Hook 可以把这个“完整性要求”固化为自动检查：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># verify-review-quality.sh</span></span>
<span class="line"><span># 验证 code-reviewer 子代理的审查是否完整</span></span>
<span class="line"><span></span></span>
<span class="line"><span>INPUT=$(cat)</span></span>
<span class="line"><span>AGENT_TYPE=$(echo &quot;$INPUT&quot; | jq -r &#39;.agent_type&#39;)</span></span>
<span class="line"><span>STOP_HOOK_ACTIVE=$(echo &quot;$INPUT&quot; | jq -r &#39;.stop_hook_active&#39;)</span></span>
<span class="line"><span>TRANSCRIPT=$(echo &quot;$INPUT&quot; | jq -r &#39;.agent_transcript_path&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 只检查 code-reviewer</span></span>
<span class="line"><span>if [ &quot;$AGENT_TYPE&quot; != &quot;code-reviewer&quot; ]; then</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 防止死循环</span></span>
<span class="line"><span>if [ &quot;$STOP_HOOK_ACTIVE&quot; = &quot;true&quot; ]; then</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 读取子代理的输出，检查是否包含必要的审查要素</span></span>
<span class="line"><span>if [ -f &quot;$TRANSCRIPT&quot; ]; then</span></span>
<span class="line"><span>    HAS_ISSUES=$(grep -c &quot;issue\\|问题\\|bug\\|warning&quot; &quot;$TRANSCRIPT&quot; || true)</span></span>
<span class="line"><span>    HAS_SUGGESTIONS=$(grep -c &quot;suggest\\|建议\\|recommend&quot; &quot;$TRANSCRIPT&quot; || true)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if [ &quot;$HAS_ISSUES&quot; -gt 0 ] &amp;&amp; [ &quot;$HAS_SUGGESTIONS&quot; -eq 0 ]; then</span></span>
<span class="line"><span>        cat &amp;lt;&amp;lt;EOF</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    &quot;decision&quot;: &quot;block&quot;,</span></span>
<span class="line"><span>    &quot;reason&quot;: &quot;You found issues but didn&#39;t provide suggestions. Please add actionable suggestions for each issue.&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span>        exit 0</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>这个脚本的逻辑分为三层防护。</p><ul><li><p><strong>第一层</strong>：只检查 <code>code-reviewer</code> 类型的子代理，其他子代理直接放行。</p></li><li><p><strong>第二层</strong>：检查 <code>stop_hook_active</code>，防止死循环。</p></li><li><p><strong>第三层</strong>：读取子代理的对话记录，用关键词匹配检查是否包含问题和建议两类内容。如果只有问题没有建议，就阻止子代理完成。</p></li></ul><p>配置方式如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;SubagentStop&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;code-reviewer&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/verify-review-quality.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，用关键词匹配来判断审查质量是比较粗糙的。对于更精细的质量验证，可以用 Prompt 或 Agent 类型的 Hook，让 LLM 来评估子代理的输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;SubagentStop&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;code-reviewer&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;prompt&quot;,</span></span>
<span class="line"><span>            &quot;prompt&quot;: &quot;Evaluate this code review result: $ARGUMENTS. Check that: 1) All issues have severity levels 2) Each issue has a concrete suggestion 3) No false positives. Respond with {\\&quot;ok\\&quot;: true} or {\\&quot;ok\\&quot;: false, \\&quot;reason\\&quot;: \\&quot;what&#39;s missing\\&quot;}.&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这让 LLM 来理解审查报告的语义，而不仅仅是匹配关键词。它能判断这个建议是否具体可操作，这是脚本无法做到的。</p><h2 id="实战项目——完整的-hook-系统" tabindex="-1">实战项目——完整的 Hook 系统 <a class="header-anchor" href="#实战项目——完整的-hook-系统" aria-label="Permalink to &quot;实战项目——完整的 Hook 系统&quot;">​</a></h2><p>现在让我们把前面学到的知识组合起来，构建两个完整的 Hook 项目。单个 Hook 解决单个问题，但真正的工程价值在于 <strong>多个 Hook 组合成系统</strong>——就像单个中间件只做一件事，但中间件链条组合起来构成了完整的请求处理管线。</p><h3 id="项目一-安全钩子系统" tabindex="-1">项目一：安全钩子系统 <a class="header-anchor" href="#项目一-安全钩子系统" aria-label="Permalink to &quot;项目一：安全钩子系统&quot;">​</a></h3><p><strong>目标</strong>：保护敏感资源，防止危险操作，记录审计日志。</p><p>项目结构：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.claude/</span></span>
<span class="line"><span>├── settings.json</span></span>
<span class="line"><span>└── hooks/</span></span>
<span class="line"><span>    ├── block-dangerous.sh    # 阻止危险命令</span></span>
<span class="line"><span>    ├── protect-files.sh      # 保护敏感文件</span></span>
<span class="line"><span>    └── audit-log.sh          # 记录操作日志</span></span></code></pre></div><p><code>.claude/settings.json</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
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
<span class="line"><span>      },</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Write&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/protect-files.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Edit&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/protect-files.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ],</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>这个配置创建了一个 <strong>纵深防御</strong> 体系——三道防线各司其职，形成层层递进的安全屏障。</p><p><strong>第一道防线：命令拦截</strong>（PreToolUse → Bash）。在任何 Bash 命令执行前，检查它是否匹配危险命令模式。这是最外层的防护，拦截的是明确的“灾难性操作”—— <code>rm -rf /</code>、 <code>git push --force origin main</code>、 <code>DROP DATABASE</code> 等。</p><p><strong>第二道防线：文件保护</strong>（PreToolUse → Write|Edit）。在任何文件写入或编辑操作前，检查目标文件是否是敏感文件。这是第二层防护，拦截的是看似无害但后果严重的操作——Claude 可能只是想&quot;帮你整理配置文件&quot;，但 <code>.env</code> 绝对不能动。</p><p><strong>第三道防线：审计日志</strong>（PostToolUse → *）。所有操作完成后，无差别记录到审计日志。这不是防护，而是 <strong>事后追溯的能力</strong>。即使前两道防线有漏网之鱼，审计日志也能帮你在事后查明发生了什么。</p><p>三道防线的强度递减（拦截 → 拦截 → 记录），但覆盖面递增（Bash → Write|Edit → 所有工具）。这就是经典的纵深防御策略——不把安全寄托在任何单一防线上。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/46f1edayyc0338d10ac9403a7293a37d.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/46f1edayyc0338d10ac9403a7293a37d.jpg" alt=""></a></p><h3 id="项目二-质量钩子系统" tabindex="-1">项目二：质量钩子系统 <a class="header-anchor" href="#项目二-质量钩子系统" aria-label="Permalink to &quot;项目二：质量钩子系统&quot;">​</a></h3><p><strong>目标</strong>：自动格式化代码，检查 lint 错误，确保测试通过。</p><p>项目结构：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.claude/</span></span>
<span class="line"><span>├── settings.json</span></span>
<span class="line"><span>└── hooks/</span></span>
<span class="line"><span>    ├── auto-format.sh        # 自动格式化</span></span>
<span class="line"><span>    ├── lint-check.sh         # Lint 检查</span></span>
<span class="line"><span>    └── run-tests.sh          # 运行测试</span></span></code></pre></div><p><code>.claude/settings.json</code>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Write&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/auto-format.sh&quot;</span></span>
<span class="line"><span>          },</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/lint-check.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Edit&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/auto-format.sh&quot;</span></span>
<span class="line"><span>          },</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/lint-check.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &quot;Stop&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/run-tests.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个配置创建了一个 <strong>两阶段质量保证流水线。</strong></p><p><strong>第一阶段：逐文件质量保证</strong>（PostToolUse → Write|Edit）。每次 Claude 写入或编辑文件后，立即执行两个操作——先格式化（确保代码风格一致），再 Lint 检查（确保没有语法或逻辑问题）。注意两个 Hook 在同一个 <code>hooks</code> 数组中，它们会 <strong>按顺序执行</strong>——先格式化再 Lint，顺序不能反（否则 Lint 检查的是格式化之前的代码）。</p><p><strong>第二阶段：全局质量门控</strong>（Stop）。Claude 完成所有工作后，运行完整的测试套件。如果测试失败，Claude 会收到失败信息并继续修复，直到所有测试通过才被允许停下来。</p><p>两个阶段的分工很明确——第一阶段是&quot;边做边查&quot;，保证每个文件的局部质量；第二阶段是做完再验，保证整体功能的正确性。这正是 eesel.ai 博客所描述的效果： <strong>Hooks 确定性地运行格式化器和 linter，确保代码符合风格指南；它们还能自动执行测试套件以捕获回归问题。</strong></p><h2 id="高级模式与最佳实践" tabindex="-1">高级模式与最佳实践 <a class="header-anchor" href="#高级模式与最佳实践" aria-label="Permalink to &quot;高级模式与最佳实践&quot;">​</a></h2><p>前面的实战项目覆盖了最常见的使用场景。下面来看一些进阶技巧和最佳实践。</p><h3 id="多-hook-链" tabindex="-1">多 Hook 链 <a class="header-anchor" href="#多-hook-链" aria-label="Permalink to &quot;多 Hook 链&quot;">​</a></h3><p>可以为同一事件配置多个 Hook，它们按顺序执行：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Write&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          { &quot;type&quot;: &quot;command&quot;, &quot;command&quot;: &quot;./hooks/format.sh&quot; },</span></span>
<span class="line"><span>          { &quot;type&quot;: &quot;command&quot;, &quot;command&quot;: &quot;./hooks/lint.sh&quot; },</span></span>
<span class="line"><span>          { &quot;type&quot;: &quot;command&quot;, &quot;command&quot;: &quot;./hooks/log.sh&quot; }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>注意执行顺序和中断语义</strong>。三个 Hook 按数组顺序依次执行——先格式化，再 Lint，最后记日志。如果任何一个 Hook 返回阻止决策（比如 lint.sh 返回 <code>exit 2</code>），后续的 Hook（log.sh）不会执行。所以你应该把“不能失败”的 Hook（如日志记录）放在最前面，或者确保它们不会互相干扰。</p><h3 id="环境变量" tabindex="-1">环境变量 <a class="header-anchor" href="#环境变量" aria-label="Permalink to &quot;环境变量&quot;">​</a></h3><p>Hooks 可以访问多个环境变量，让你的脚本更灵活。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/86b046c989db1fbf0c0c887459b32c0e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/86b046c989db1fbf0c0c887459b32c0e.jpg" alt=""></a></p><p>其中 <code>CLAUDE_ENV_FILE</code> 是一个特别有用的变量。SessionStart Hook 可以向这个文件写入 <code>export</code> 语句，这些环境变量会在后续所有 Bash 命令中生效，相当于在会话开始时，就设置了全局环境。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># session-setup.sh - SessionStart hook</span></span>
<span class="line"><span>if [ -n &quot;$CLAUDE_ENV_FILE&quot; ]; then</span></span>
<span class="line"><span>    echo &#39;export NODE_ENV=development&#39; &amp;gt;&amp;gt; &quot;$CLAUDE_ENV_FILE&quot;</span></span>
<span class="line"><span>    echo &#39;export DEBUG_LOG=true&#39; &amp;gt;&amp;gt; &quot;$CLAUDE_ENV_FILE&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><p>利用 <code>CLAUDE_FILE_PATH</code> 可以让 Hook 只在特定目录下生效——比如只对 <code>src/</code> 目录下的文件运行 Lint。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span># 只在 src/ 目录执行 lint</span></span>
<span class="line"><span>if [[ &quot;$CLAUDE_FILE_PATH&quot; == */src/* ]]; then</span></span>
<span class="line"><span>    npm run lint &quot;$CLAUDE_FILE_PATH&quot;</span></span>
<span class="line"><span>fi</span></span></code></pre></div><p>这种条件过滤让 Hook 更精准，你不需要对配置文件、文档、测试文件都跑同样的检查。</p><h3 id="在-commands-和-skills-中定义临时-hooks" tabindex="-1">在 Commands 和 Skills 中定义临时 Hooks <a class="header-anchor" href="#在-commands-和-skills-中定义临时-hooks" aria-label="Permalink to &quot;在 Commands 和 Skills 中定义临时 Hooks&quot;">​</a></h3><p>前一讲我们学过，Commands 和 Skills 可以在 frontmatter 中包含临时 Hooks（仅在该命令/技能执行期间有效）。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>---</span></span>
<span class="line"><span>description: Deploy with safety checks</span></span>
<span class="line"><span>hooks:</span></span>
<span class="line"><span>  - event: PreToolUse</span></span>
<span class="line"><span>    matcher: Bash</span></span>
<span class="line"><span>    command: |</span></span>
<span class="line"><span>      if [[ &quot;$TOOL_INPUT&quot; == *&quot;production&quot;* ]]; then</span></span>
<span class="line"><span>        echo &quot;Production deployment detected&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span>      fi</span></span>
<span class="line"><span>  - event: PostToolUse</span></span>
<span class="line"><span>    matcher: Edit</span></span>
<span class="line"><span>    command: npx prettier --write &quot;$FILE_PATH&quot;</span></span>
<span class="line"><span>    once: true</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Deploy the application to staging environment.</span></span></code></pre></div><p><code>once: true</code> 表示 Hook 只触发一次。这适合“完成后运行一次测试”这类不需要重复执行的场景。注意 <code>once</code> 仅在 Skill 中可用，子代理中不支持。</p><h3 id="子代理-frontmatter-内置-hooks——比全局配置更精准的方案" tabindex="-1">子代理 frontmatter 内置 Hooks——比全局配置更精准的方案 <a class="header-anchor" href="#子代理-frontmatter-内置-hooks——比全局配置更精准的方案" aria-label="Permalink to &quot;子代理 frontmatter 内置 Hooks——比全局配置更精准的方案&quot;">​</a></h3><p>在第 3 讲中，我们学习了子代理的 frontmatter 可以定义各种配置字段。现在来看其中最强大的一个—— <code>hooks</code> 字段。</p><p>考虑这个场景：你有一个 <code>db-reader</code> 子代理，它可以执行 SQL 查询。你想在它每次执行 Bash 命令前检查 SQL 注入风险。</p><p><strong>方案一：全局 settings.json</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PreToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Bash&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/check-sql-injection.sh&quot;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>问题来了： <strong>所有</strong> Bash 命令都会被 SQL 注入检查——包括 <code>npm install</code>、 <code>git status</code>、 <code>ls -la</code> 这些和 SQL 毫无关系的命令。这既浪费性能（每次 Bash 命令多执行一个脚本），又可能误拦截（脚本中某个字符串碰巧匹配了 SQL 注入模式）。</p><p><strong>方案二：子代理 frontmatter Hooks</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>---</span></span>
<span class="line"><span>name: db-reader</span></span>
<span class="line"><span>description: Read-only database explorer for analyzing data patterns</span></span>
<span class="line"><span>tools: Read, Grep, Glob, Bash</span></span>
<span class="line"><span>permissionMode: plan</span></span>
<span class="line"><span>hooks:</span></span>
<span class="line"><span>  PreToolUse:</span></span>
<span class="line"><span>    - matcher: &quot;Bash&quot;</span></span>
<span class="line"><span>      hooks:</span></span>
<span class="line"><span>        - type: command</span></span>
<span class="line"><span>          command: &quot;./hooks/check-sql-injection.sh&quot;</span></span>
<span class="line"><span>  Stop:</span></span>
<span class="line"><span>    - hooks:</span></span>
<span class="line"><span>        - type: prompt</span></span>
<span class="line"><span>          prompt: &quot;Check if any query results contain PII (names, emails, phone numbers). If so, respond with {\\&quot;ok\\&quot;: false, \\&quot;reason\\&quot;: \\&quot;Results may contain PII, please redact before returning\\&quot;}.&quot;</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>You are a database analysis specialist. Execute read-only SQL queries to help understand data patterns.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Rules</span></span>
<span class="line"><span>- ONLY execute SELECT queries</span></span>
<span class="line"><span>- NEVER use INSERT, UPDATE, DELETE, DROP, or any data-modifying SQL</span></span>
<span class="line"><span>- Limit results to 100 rows unless explicitly requested</span></span></code></pre></div><p>这样做，SQL 注入检查只在 <code>db-reader</code> 子代理的 Bash 命令上触发。主会话和其他子代理的 Bash 命令完全不受影响。</p><p>结合下表，两种方案的差异一目了然。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/59cde0e4a4cf53882c28ba359eb7a200.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/59cde0e4a4cf53882c28ba359eb7a200.jpg" alt=""></a></p><p><strong>frontmatter Hooks 的关键规则</strong>：</p><ol><li><p><strong>支持所有事件类型</strong>：PreToolUse、PostToolUse、Stop 等都可以用。</p></li><li><p><strong>Stop 会自动转换为 SubagentStop</strong>：在子代理 frontmatter 中定义的 <code>Stop</code> Hook，实际触发的是 <code>SubagentStop</code> 事件——因为子代理完成时触发的是 SubagentStop 而非 Stop。</p></li><li><p><strong>生命周期绑定</strong>：Hook 在子代理启动时激活，子代理完成时自动清理。</p></li><li><p><strong>格式与 settings.json 一致</strong>：YAML 格式，但字段名和结构完全相同。</p></li></ol><p>为了让你加深理解，我们来看一个更复杂的例子，这是一个带安全检查的部署子代理。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>---</span></span>
<span class="line"><span>name: deploy-checker</span></span>
<span class="line"><span>description: Verify deployment readiness with safety checks</span></span>
<span class="line"><span>tools: Read, Grep, Glob, Bash</span></span>
<span class="line"><span>hooks:</span></span>
<span class="line"><span>  PreToolUse:</span></span>
<span class="line"><span>    - matcher: &quot;Bash&quot;</span></span>
<span class="line"><span>      hooks:</span></span>
<span class="line"><span>        - type: command</span></span>
<span class="line"><span>          command: |</span></span>
<span class="line"><span>            INPUT=$(cat)</span></span>
<span class="line"><span>            CMD=$(echo &quot;$INPUT&quot; | jq -r &#39;.tool_input.command // &quot;&quot;&#39;)</span></span>
<span class="line"><span>            # 阻止任何直接操作生产环境的命令</span></span>
<span class="line"><span>            if echo &quot;$CMD&quot; | grep -qi &quot;production\\|prod-db\\|deploy.*--force&quot;; then</span></span>
<span class="line"><span>              echo &#39;{&quot;hookSpecificOutput&quot;:{&quot;hookEventName&quot;:&quot;PreToolUse&quot;,&quot;permissionDecision&quot;:&quot;deny&quot;,&quot;permissionDecisionReason&quot;:&quot;Direct production operations are not allowed in this agent. Use the deployment pipeline instead.&quot;}​}&#39;</span></span>
<span class="line"><span>            fi</span></span>
<span class="line"><span>  Stop:</span></span>
<span class="line"><span>    - hooks:</span></span>
<span class="line"><span>        - type: agent</span></span>
<span class="line"><span>          prompt: &quot;Review the deployment check results. Verify that: 1) All health checks pass 2) No breaking API changes detected 3) Database migrations are backward-compatible. $ARGUMENTS&quot;</span></span>
<span class="line"><span>          timeout: 60</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>You are a deployment readiness checker...</span></span></code></pre></div><p>这个子代理有两层保护。 <strong>PreToolUse Hook</strong> 用确定性规则阻止直接操作生产环境的命令，这是“硬规则”，不需要判断力，只需要模式匹配。 <strong>Stop Hook</strong>（实际触发为 SubagentStop）用 Agent 类型验证部署检查结果——这需要判断力和代码检查能力，所以用了最强的 Agent 类型。</p><p><strong>什么时候用 frontmatter Hooks vs 全局 Hooks？</strong></p><p>判断流程很简单：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>判断流程：</span></span>
<span class="line"><span>├── 这个 Hook 是否只与特定子代理相关？</span></span>
<span class="line"><span>│   ├── 是 → frontmatter Hooks</span></span>
<span class="line"><span>│   │   例：db-reader 的 SQL 注入检查、deploy-checker 的生产环境保护</span></span>
<span class="line"><span>│   └── 否 → 全局 settings.json</span></span>
<span class="line"><span>│       例：所有 Write 操作后的格式化、所有 Bash 命令的危险命令拦截</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── 这个 Hook 是否需要随子代理定义一起分发？</span></span>
<span class="line"><span>│   ├── 是 → frontmatter Hooks</span></span>
<span class="line"><span>│   │   例：开源项目中的子代理，使用者不需要额外配置 settings.json</span></span>
<span class="line"><span>│   └── 否 → 全局 settings.json</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── 这个 Hook 是否需要在子代理外也生效？</span></span>
<span class="line"><span>    ├── 是 → 全局 settings.json</span></span>
<span class="line"><span>    └── 否 → frontmatter Hooks</span></span></code></pre></div><h3 id="调试技巧" tabindex="-1">调试技巧 <a class="header-anchor" href="#调试技巧" aria-label="Permalink to &quot;调试技巧&quot;">​</a></h3><p>Hook 脚本出问题时，调试手段和普通 Shell 脚本有所不同，因为 Hook 的 stdin/stdout 都有特殊用途。我来为你分享四个最实用的调试技巧。</p><p><strong>1. 使用 stderr 输出调试信息</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 调试信息输出到 stderr（不影响 JSON 响应）</span></span>
<span class="line"><span>echo &quot;DEBUG: Processing file $FILE_PATH&quot; &amp;gt;&amp;2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 正常输出到 stdout</span></span>
<span class="line"><span>echo &#39;{&quot;decision&quot;: &quot;allow&quot;}&#39;</span></span></code></pre></div><p>记住，stdout 是给 Claude 读的 JSON，stderr 是给你看的调试信息。混淆两者是 Hook 开发中最常见的错误。</p><p><strong>2. 手动测试 Hook 脚本</strong></p><p>不需要启动 Claude 就能测试你的 Hook——手动构造 JSON 输入，通过管道传给脚本：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 创建测试输入</span></span>
<span class="line"><span>echo &#39;{</span></span>
<span class="line"><span>  &quot;tool_name&quot;: &quot;Bash&quot;,</span></span>
<span class="line"><span>  &quot;tool_input&quot;: {</span></span>
<span class="line"><span>    &quot;command&quot;: &quot;rm -rf /tmp/test&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}&#39; | ./hooks/block-dangerous.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查退出码</span></span>
<span class="line"><span>echo &quot;Exit code: $?&quot;</span></span></code></pre></div><p>这让你能在开发过程中快速迭代——修改脚本、手动测试、检查输出，不需要每次都等 Claude 触发。</p><p><strong>3. 使用</strong> <code>claude --debug</code> <strong>查看完整执行细节</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[DEBUG] Executing hooks for PostToolUse:Write</span></span>
<span class="line"><span>[DEBUG] Found 1 hook matchers in settings</span></span>
<span class="line"><span>[DEBUG] Matched 1 hooks for query &quot;Write&quot;</span></span>
<span class="line"><span>[DEBUG] Hook command completed with status 0: &amp;lt;stdout output&amp;gt;</span></span></code></pre></div><p>也可以在会话中用 <code>Ctrl+O</code> 切换详细模式（verbose mode），在对话记录中查看 Hook 的输出。</p><p><strong>4. 常见问题排查清单</strong></p><ul><li><p><strong>Hook 不触发</strong>：检查 matcher 是否正确（区分大小写）；如果直接编辑了 settings 文件，需要在 <code>/hooks</code> 菜单中确认或重启会话才能生效。</p></li><li><p><strong>权限问题</strong>：确保脚本有执行权限—— <code>chmod +x hooks/*.sh</code></p></li><li><p><strong>JSON 解析错误</strong>：确保输出是有效 JSON。注意：如果你的 shell profile。（ <code>~/.zshrc</code> 或 <code>~/.bashrc</code>）中有无条件的 <code>echo</code> 语句，它会污染 stdout 导致 。JSON 解析失败。解决方法是用 <code>[[ $- == *i* ]]</code> 包裹 echo，只在交互式 shell 中输出。</p></li><li><p><strong>Stop Hook 死循环</strong>：检查是否遗漏了 <code>stop_hook_active</code> 判断（参见前面的&quot;防止死循环&quot;一节）。</p></li></ul><h3 id="异步-hook-后台执行不阻塞" tabindex="-1">异步 Hook：后台执行不阻塞 <a class="header-anchor" href="#异步-hook-后台执行不阻塞" aria-label="Permalink to &quot;异步 Hook：后台执行不阻塞&quot;">​</a></h3><p>默认情况下，Hook 会阻塞 Claude 的执行直到完成。这在大多数场景下是合理的——安全检查必须在操作前完成，格式化必须在下一步操作前完成。但对于耗时操作（运行完整测试套件、发送通知、调用外部 API），阻塞会显著拖慢 Claude 的响应速度。</p><p><code>async: true</code> 让 Hook 在后台运行，不阻塞主流程：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;matcher&quot;: &quot;Write|Edit&quot;,</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;command&quot;,</span></span>
<span class="line"><span>            &quot;command&quot;: &quot;./hooks/run-tests-async.sh&quot;,</span></span>
<span class="line"><span>            &quot;async&quot;: true,</span></span>
<span class="line"><span>            &quot;timeout&quot;: 300</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你需要知道 <strong>异步 Hook 的三个限制。</strong></p><ol><li><p>只有 <code>type: &quot;command&quot;</code> 支持异步，prompt 和 agent 类型不支持——因为它们需要实时影响 Claude 的决策。</p></li><li><p>异步 Hook <strong>不能阻止操作</strong>，因为操作在 Hook 完成前就已经继续了</p></li><li><p>Hook 完成后的输出会在 <strong>下一个对话轮次</strong> 传递给 Claude，这是有延迟的。</p></li></ol><p>所以异步 Hook 适合“我不需要立即知道结果”的场景，在后台跑测试、发送 Slack 通知、写日志到远程服务。</p><h3 id="http-hook-对接外部服务" tabindex="-1">HTTP Hook：对接外部服务 <a class="header-anchor" href="#http-hook-对接外部服务" aria-label="Permalink to &quot;HTTP Hook：对接外部服务&quot;">​</a></h3><p>前面讲的 command、prompt、agent 三种 Hook 类型，执行逻辑都在本地——要么跑脚本，要么调 LLM。但有些场景下，Hook 的处理逻辑不在本地，而是在一个远程服务上：团队共享的审计服务、集中式的安全扫描平台、公司内部的合规检查 API。</p><p>这时候就该用 <code>type: &quot;http&quot;</code>。HTTP Hook 把事件数据以 POST 请求发送到指定 URL，由远程服务处理后返回决策结果。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;hooks&quot;: {</span></span>
<span class="line"><span>    &quot;PostToolUse&quot;: [</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>        &quot;hooks&quot;: [</span></span>
<span class="line"><span>          {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;http&quot;,</span></span>
<span class="line"><span>            &quot;url&quot;: &quot;http://localhost:8080/hooks/tool-use&quot;,</span></span>
<span class="line"><span>            &quot;headers&quot;: {</span></span>
<span class="line"><span>              &quot;Authorization&quot;: &quot;Bearer $MY_TOKEN&quot;</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>            &quot;allowedEnvVars&quot;: [&quot;MY_TOKEN&quot;]</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>远程服务收到的 JSON 和 command Hook 从 stdin 读到的完全一样。返回的响应体也遵循相同的 JSON 格式——要阻止工具调用，在响应体里返回对应的 <code>hookSpecificOutput</code> 字段即可。注意：HTTP 状态码（如 403）不能阻止操作，必须在 2xx 响应体里用 JSON 表达决策。 <code>headers</code> 中的值支持 <code>$VAR_NAME</code> 语法做环境变量插值，但只有 <code>allowedEnvVars</code> 列表中的变量才会被解析，其他 <code>$VAR</code> 引用会保持为空。这是一个安全设计——防止意外泄露环境变量。</p><p>HTTP Hook 有一个限制，目前只能通过手动编辑 settings JSON 来配置， <code>/hooks</code> 交互菜单暂不支持添加 HTTP 类型。</p><p>四种 Hook 类型各有所长，我为你梳理了表格。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/9646561d25bd42ba3aeb3bbf832a8c93.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/9646561d25bd42ba3aeb3bbf832a8c93.jpg" alt=""></a></p><p>选择原则不变： <strong>能用 command 解决的不要用 prompt，能用 prompt 解决的不要用 agent，需要对接远程服务时用 http</strong>。</p><h3 id="安全最佳实践" tabindex="-1">安全最佳实践 <a class="header-anchor" href="#安全最佳实践" aria-label="Permalink to &quot;安全最佳实践&quot;">​</a></h3><p>最后，我们来梳理几条在生产环境中久经验证的安全建议。</p><ol><li><p><strong>使用绝对路径引用脚本</strong>：用 <code>&quot;$CLAUDE_PROJECT_DIR&quot;/.claude/hooks/xxx.sh</code>，比相对路径更可靠。相对路径在子代理中可能解析到错误的目录。</p></li><li><p><strong>最小权限原则</strong>：PreToolUse 只检查必要的条件。检查越多，误拦截的概率越高，用户绕过 Hook 的冲动也越强。</p></li><li><p><strong>快速失败</strong>：Hook 应该快速返回，避免长时间阻塞。如果确实需要耗时操作，用 <code>async: true</code>。</p></li><li><p><strong>优雅降级</strong>：格式化工具不存在时应跳过而不是报错。Hook 的失败不应该阻碍正常工作流。</p></li><li><p><strong>输入校验</strong>：永远不要盲目信任 stdin 输入，用 <code>jq</code> 解析并验证。</p></li><li><p><strong>引号包裹变量</strong>：使用 <code>&quot;$VAR&quot;</code> 而非 <code>$VAR</code>，防止路径中的空格导致问题。</p></li><li><p><strong>路径遍历防护</strong>：检查文件路径中是否有 <code>..</code>，防止恶意路径逃逸。</p></li></ol><h2 id="hook-工程设计方法论" tabindex="-1">Hook 工程设计方法论 <a class="header-anchor" href="#hook-工程设计方法论" aria-label="Permalink to &quot;Hook 工程设计方法论&quot;">​</a></h2><p>前面教的是“Hooks 能做什么、怎么配置”。</p><p>下面来回答一个更重要的工程问题： <strong>面对一个具体需求，如何系统地设计 Hook 方案？</strong></p><h3 id="三维决策框架" tabindex="-1">三维决策框架 <a class="header-anchor" href="#三维决策框架" aria-label="Permalink to &quot;三维决策框架&quot;">​</a></h3><p>设计一个 Hook 方案，我们需要想清楚三个问题。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/1ce86511f2d1296f640a577de5cb9162.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/1ce86511f2d1296f640a577de5cb9162.jpg" alt=""></a></p><p>三个维度两两正交——你可以在任何事件上使用任何类型的 Hook，配置在任何位置。但能做不等于应该做。好的工程设计是在这三个维度上找到最恰当的交叉点——用最轻量的类型解决问题，在最小的作用域内生效。</p><h3 id="hook-subagent-组合模式" tabindex="-1">Hook + SubAgent 组合模式 <a class="header-anchor" href="#hook-subagent-组合模式" aria-label="Permalink to &quot;Hook + SubAgent 组合模式&quot;">​</a></h3><p>Hooks 和 SubAgent 是两个独立的机制，但组合使用时能产生强大的协同效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/6011d15caf3cedc20f68cfb9ec59250b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/6011d15caf3cedc20f68cfb9ec59250b.jpg" alt=""></a></p><p>来看一个完整的组合案例，这是一个带质量门控的代码审查子代理。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>子代理定义（.claude/agents/code-reviewer.md）</span></span>
<span class="line"><span>├── frontmatter</span></span>
<span class="line"><span>│   ├── tools: Read, Grep, Glob</span></span>
<span class="line"><span>│   ├── permissionMode: plan</span></span>
<span class="line"><span>│   └── hooks:</span></span>
<span class="line"><span>│       └── Stop: prompt hook 检查审查是否完整</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>全局 settings.json</span></span>
<span class="line"><span>├── SubagentStart hook（matcher: code-reviewer）</span></span>
<span class="line"><span>│   └── 注入当前分支的变更列表</span></span>
<span class="line"><span>└── SubagentStop hook（matcher: code-reviewer）</span></span>
<span class="line"><span>    └── 验证审查报告格式和质量</span></span></code></pre></div><p>这三层保护各司其职：</p><ol><li><p><strong>frontmatter Hook</strong>：子代理内部的自检，检测我的输出完整是否完整。</p></li><li><p><strong>SubagentStart Hook</strong>：外部注入，给它必要的上下文。</p></li><li><p><strong>SubagentStop Hook</strong>：外部验收，判断它的工作是否达标。</p></li></ol><p>内部自检发现的是“自己知道自己漏了什么”的问题，外部验收发现的是“它觉得完成了，但其实不够好”的问题。两者视角不同，互为补充。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/d25e768ec413303dcb4a6d4d8eb848aa.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/d25e768ec413303dcb4a6d4d8eb848aa.jpg" alt=""></a></p><h2 id="总结一下" tabindex="-1">总结一下 <a class="header-anchor" href="#总结一下" aria-label="Permalink to &quot;总结一下&quot;">​</a></h2><p>这一讲我们深入学习了 Hooks 的高级特性和工程实践方法。两讲合在一起，我们完整覆盖了 Hooks 的全部知识体系。</p><p>从概念（AI 中间件）到配置（六个位置、四种类型），从核心事件（PreToolUse、PostToolUse、Stop）到高级事件（SubagentStart、SubagentStop），从单个 Hook 到组合系统，从实战脚本到工程方法论。</p><p>Hooks 是 Claude Code 扩展机制中唯一能拦截和修改 AI 行为的组件。用好它，就能在享受 AI 效率的同时，守住安全和质量的底线。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>Stop Hook 的 <code>continue: true</code> 创造了一个“修复循环”。结合 <code>stop_hook_active</code> 机制，你会如何设计一个允许最多 3 次重试的 Stop Hook？请写出伪代码。</p></li><li><p>对比全局 settings.json 和子代理 frontmatter 两种 Hook 配置方式，你的项目中哪些 Hook 适合放在全局，哪些适合放在特定子代理的 frontmatter 中？请举出具体场景。</p></li><li><p>设计一个完整的“代码提交前自动检查”Hook 方案：需要检查哪些维度？用什么事件？用 command/prompt/agent 哪种类型？为什么？</p></li><li><p>Hook + SubAgent 组合模式中，frontmatter 内部自检和 SubagentStop 外部验收各自能发现什么类型的问题？两者的视角差异在哪里？</p></li></ol><h2 id="下一讲预告" tabindex="-1">下一讲预告 <a class="header-anchor" href="#下一讲预告" aria-label="Permalink to &quot;下一讲预告&quot;">​</a></h2><p>Hooks 让 Claude 在执行工具时自动响应，但 Claude 能调用的工具毕竟有限——它能读文件、写代码、执行命令，但不能查数据库、调 API、访问第三方服务。</p><p>下一讲，我们将学习 <strong>MCP 协议与外部工具连接</strong>——通过 Model Context Protocol 把数据库、API、第三方服务变成 Claude 可调用的工具。</p><h2 id="本讲示例项目对应表" tabindex="-1">本讲示例项目对应表 <a class="header-anchor" href="#本讲示例项目对应表" aria-label="Permalink to &quot;本讲示例项目对应表&quot;">​</a></h2><p>本讲新增 1 个可运行脚本，其余 5 个脚本在上一讲已介绍（见第 15 讲对应表）。本讲的“项目一/项目二”章节将它们组合成完整系统。</p><p><strong>本讲新增的可运行脚本</strong>。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/a94006c421f20b57f0c5f523e099cf3e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/a94006c421f20b57f0c5f523e099cf3e.jpg" alt=""></a></p><p><strong>本讲的内联代码示例</strong>（演示高级模式，未独立成脚本文件）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/35791b07b79bc0997b0e2340a172279e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/954158/35791b07b79bc0997b0e2340a172279e.jpg" alt=""></a></p><p><strong>完整项目结构</strong>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>06-Hooks/projects/</span></span>
<span class="line"><span>├── 01-safety-hooks/</span></span>
<span class="line"><span>│   ├── .claude/settings.json    ← 3 条规则：PreToolUse(Bash) + PreToolUse(Write|Edit) + PostToolUse(*)</span></span>
<span class="line"><span>│   ├── hooks/</span></span>
<span class="line"><span>│   │   ├── block-dangerous.sh</span></span>
<span class="line"><span>│   │   ├── protect-files.sh</span></span>
<span class="line"><span>│   │   └── audit-log.sh</span></span>
<span class="line"><span>│   └── README.md</span></span>
<span class="line"><span>└── 02-quality-hooks/</span></span>
<span class="line"><span>    ├── .claude/settings.json    ← 3 条规则：PostToolUse(Write|Edit) + Stop</span></span>
<span class="line"><span>    ├── hooks/</span></span>
<span class="line"><span>    │   ├── auto-format.sh</span></span>
<span class="line"><span>    │   ├── lint-check.sh</span></span>
<span class="line"><span>    │   └── run-tests.sh</span></span>
<span class="line"><span>    └── README.md</span></span></code></pre></div><p>欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。</p>`,208)])])}const g=n(o,[["render",t]]);export{h as __pageData,g as default};
