import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"02｜过目不忘：Claude Code 记忆系统与 CLAUDE.md","description":"","frontmatter":{},"headers":[{"level":2,"title":"Claude Code记忆系统的工作原理","slug":"claude-code记忆系统的工作原理","link":"#claude-code记忆系统的工作原理","children":[]},{"level":2,"title":"Claude Code的五层记忆架构","slug":"claude-code的五层记忆架构","link":"#claude-code的五层记忆架构","children":[{"level":3,"title":"企业策略级记忆设定","slug":"企业策略级记忆设定","link":"#企业策略级记忆设定","children":[]},{"level":3,"title":"用户级内容设定","slug":"用户级内容设定","link":"#用户级内容设定","children":[]}]},{"level":2,"title":"项目级团队共享规范","slug":"项目级团队共享规范","link":"#项目级团队共享规范","children":[]},{"level":2,"title":"编写高效的 CLAUDE.md","slug":"编写高效的-claude-md","link":"#编写高效的-claude-md","children":[{"level":3,"title":"核心原则1：Less is More","slug":"核心原则1-less-is-more","link":"#核心原则1-less-is-more","children":[]},{"level":3,"title":"核心原则2：具体优于泛泛","slug":"核心原则2-具体优于泛泛","link":"#核心原则2-具体优于泛泛","children":[]},{"level":3,"title":"核心原则3：关键三问题 WHY / WHAT / HOW","slug":"核心原则3-关键三问题-why-what-how","link":"#核心原则3-关键三问题-why-what-how","children":[]},{"level":3,"title":"核心原则4：渐进式披露：不要把一切都塞进 CLAUDE.md","slug":"核心原则4-渐进式披露-不要把一切都塞进-claude-md","link":"#核心原则4-渐进式披露-不要把一切都塞进-claude-md","children":[]}]},{"level":2,"title":"CLAUDE.md 实战演练","slug":"claude-md-实战演练","link":"#claude-md-实战演练","children":[{"level":3,"title":"场景一：为新项目创建记忆","slug":"场景一-为新项目创建记忆","link":"#场景一-为新项目创建记忆","children":[]},{"level":3,"title":"场景二：优化已有的 CLAUDE.md","slug":"场景二-优化已有的-claude-md","link":"#场景二-优化已有的-claude-md","children":[]},{"level":3,"title":"场景三：记忆管理命令","slug":"场景三-记忆管理命令","link":"#场景三-记忆管理命令","children":[]}]},{"level":2,"title":"Auto Memory 解读","slug":"auto-memory-解读","link":"#auto-memory-解读","children":[]},{"level":2,"title":"本讲小结","slug":"本讲小结","link":"#本讲小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"ClaudeCode工程化实战/02｜过目不忘：ClaudeCode记忆系统与CLAUDE.md","filePath":"ClaudeCode工程化实战/02｜过目不忘：ClaudeCode记忆系统与CLAUDE.md","lastUpdated":1779815462000}'),l={name:"ClaudeCode工程化实战/02｜过目不忘：ClaudeCode记忆系统与CLAUDE.md"};function i(t,s,c,d,o,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_02-过目不忘-claude-code-记忆系统与-claude-md" tabindex="-1">02｜过目不忘：Claude Code 记忆系统与 CLAUDE.md <a class="header-anchor" href="#_02-过目不忘-claude-code-记忆系统与-claude-md" aria-label="Permalink to &quot;02｜过目不忘：Claude Code 记忆系统与 CLAUDE.md&quot;">​</a></h1><p>你好，我是黄佳。</p><p>和AI协作，不知道你有没有这样的经历。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>第一次对话：</span></span>
<span class="line"><span>你：帮我写一个用户登录接口</span></span>
<span class="line"><span>Claude：好的，这是一个基础的登录接口...（使用 Express + JavaScript）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你：我们项目用的是 Fastify 和 TypeScript</span></span>
<span class="line"><span>Claude：好的，让我重新写...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第二次对话：</span></span>
<span class="line"><span>你：帮我写一个订单创建接口</span></span>
<span class="line"><span>Claude：好的，这是一个基础的订单接口...（又用 Express + JavaScript）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你：（崩溃）我们用 Fastify 和 TypeScript！</span></span></code></pre></div><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>第一个项目：</span></span>
<span class="line"><span>你：帮我根据刚才的讨论做一套循环经济相关PPT，给老板直接看</span></span>
<span class="line"><span>Claude：好的，这是一份图文并茂，有技术深度的PPT...</span></span>
<span class="line"><span>你（看了PPT）：内容挺好的，调一下格式，16:9 ，加Speaker Notes</span></span>
<span class="line"><span>Claude：...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第二个项目：</span></span>
<span class="line"><span>你：帮我根据项目进展，做一套知识图谱的PPT，直接用于演示的标准</span></span>
<span class="line"><span>Claude：好的，这是一个份根据你的项目制作的详细知识图谱PPT...</span></span>
<span class="line"><span>你（看了PPT）：16:9 ，加Speaker Notes！</span></span></code></pre></div><p>我在刚刚开始使用Claude Code时，这种情况常见。对于小项目，我多说几次需求，倒也无所谓。但是时间长了，项目逐渐复杂的时候，如果每次新对话，Claude 都让我从零开始，如果它不记得你的项目用什么技术栈、什么代码风格、什么团队规范——那这种“失忆症”让人抓狂。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/42e4743df41a306cc58379f5bd41bb6b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/42e4743df41a306cc58379f5bd41bb6b.jpg" alt=""></a></p><p><strong>CLAUDE.md 就是治疗这种失忆症的药。</strong> 它是一份给 Claude 的“项目入职手册”——Claude 每次开始对话时，都会自动阅读这份手册，了解你的项目背景，明确它在干活时应该遵循的一系列底层规则。</p><h2 id="claude-code记忆系统的工作原理" tabindex="-1">Claude Code记忆系统的工作原理 <a class="header-anchor" href="#claude-code记忆系统的工作原理" aria-label="Permalink to &quot;Claude Code记忆系统的工作原理&quot;">​</a></h2><p>这一讲，我们就来学习Claude Code如何对抗“失忆症”，记住必要信息。</p><p>当你在项目目录启动 Claude Code 时，发生的“记忆系统初始化”过程如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/d1a847a91839b94cdd4dc7aac5fdacc0.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/d1a847a91839b94cdd4dc7aac5fdacc0.jpg" alt=""></a></p><p>这就像你给新员工一份入职手册，他读完之后就知道公司的规矩。不同的是，Claude 每次对话都会重新“入职”——所以这份手册必须简洁有效。</p><p>Claude Code 有多种方式获取项目相关知识，它们的区别如下表所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/2b3ab9a326f6816e32280d6d3801882a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/2b3ab9a326f6816e32280d6d3801882a.jpg" alt=""></a></p><p>这里的关键洞察是—— <strong>CLAUDE.md 的内容会</strong> 每次对话都加载，所以要精简。把“每次都需要”的内容放这里，把“偶尔需要”的内容放到 Skills 或文档里。</p><h2 id="claude-code的五层记忆架构" tabindex="-1">Claude Code的五层记忆架构 <a class="header-anchor" href="#claude-code的五层记忆架构" aria-label="Permalink to &quot;Claude Code的五层记忆架构&quot;">​</a></h2><p>Claude Code 支持五个层级的记忆，就像洋葱一样，从外到内，按 <strong>层级结构</strong> 组织——高层级的文件优先加载，为底层文件提供基础：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/77cc990d2b8c5d906e82e9abd17c3835.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/77cc990d2b8c5d906e82e9abd17c3835.jpg" alt=""></a></p><p>完整记忆类型表如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/02bb1bd6ba02853c3f314f66d54f8155.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/02bb1bd6ba02853c3f314f66d54f8155.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/959a4a571c8ed86d932dd11e35b1f503.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/959a4a571c8ed86d932dd11e35b1f503.jpg" alt=""></a></p><p>下面分别对每一个级别给出 <code>CLAUDE.md</code> 的说明和示例。</p><h3 id="企业策略级记忆设定" tabindex="-1">企业策略级记忆设定 <a class="header-anchor" href="#企业策略级记忆设定" aria-label="Permalink to &quot;企业策略级记忆设定&quot;">​</a></h3><p><strong>企业策略级记忆设定</strong> 的作用是组织范围内的指令，由 IT/DevOps 统一管理和部署组织。适合内容是，公司编码标准、安全策略、合规要求以及禁止使用的库或模式。通过配置管理系统（MDM、Group Policy、Ansible 等）部署，确保在所有开发者机器上一致分发。</p><p><strong>位置</strong>：</p><ul><li><p>macOS: <code>/Library/Application Support/ClaudeCode/CLAUDE.md</code></p></li><li><p>Linux: <code>/etc/claude-code/CLAUDE.md</code></p></li><li><p>Windows: <code>C:\\Program Files\\ClaudeCode\\CLAUDE.md</code></p></li></ul><p><strong>示例</strong>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 公司开发策略</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 安全要求</span></span>
<span class="line"><span>- 禁止在代码中硬编码任何密钥或敏感信息</span></span>
<span class="line"><span>- 所有 API 调用必须使用 HTTPS</span></span>
<span class="line"><span>- 用户输入必须经过验证和清理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 合规要求</span></span>
<span class="line"><span>- 所有日志必须排除 PII（个人身份信息）</span></span>
<span class="line"><span>- 数据库连接必须使用加密传输</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 禁止项</span></span>
<span class="line"><span>- 禁止使用未经审批的第三方库</span></span>
<span class="line"><span>- 禁止直接访问生产数据库</span></span></code></pre></div><p>如果你是个人或小团队，可以直接跳过企业级设定这一层，不影响任何使用。</p><h3 id="用户级内容设定" tabindex="-1">用户级内容设定 <a class="header-anchor" href="#用户级内容设定" aria-label="Permalink to &quot;用户级内容设定&quot;">​</a></h3><p><strong>用户级内容设定</strong> 承载的是你的全局偏好，即跨所有项目生效的个人偏好，如个人代码风格，沟通语言设置，通用工作习惯等。比如说我希望所有的PPT都是 16:9，黑体字。这种设置就应该放在此处。</p><p><strong>位置</strong>： <code>~/.claude/CLAUDE.md</code></p><p><strong>示例</strong>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 个人偏好</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 沟通方式</span></span>
<span class="line"><span>- 使用中文回复</span></span>
<span class="line"><span>- 代码注释使用英文</span></span>
<span class="line"><span>- 解释简洁直接，不要过多铺垫</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 通用代码风格</span></span>
<span class="line"><span>- 缩进使用 2 空格</span></span>
<span class="line"><span>- 优先使用 async/await</span></span>
<span class="line"><span>- 变量命名使用 camelCase</span></span>
<span class="line"><span>- 常量命名使用 UPPER_SNAKE_CASE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 我的常用工具</span></span>
<span class="line"><span>- 包管理器: uv</span></span>
<span class="line"><span>- 编辑器: VS Code</span></span>
<span class="line"><span>- 终端: zsh</span></span></code></pre></div><p>用户级记忆会被项目级覆盖。如果你个人喜欢 2 空格缩进，但项目要求 4 空格，那就用 4 空格。</p><h2 id="项目级团队共享规范" tabindex="-1">项目级团队共享规范 <a class="header-anchor" href="#项目级团队共享规范" aria-label="Permalink to &quot;项目级团队共享规范&quot;">​</a></h2><p>团队共享规范是团队共享的项目知识， <strong>应该提交到 Git。</strong> 适合存放的内容包括项目架构和技术栈、团队编码规范、重要的设计决策和常用命令。</p><p>位置：项目根目录的 <code>./CLAUDE.md</code></p><p>示例（一个后端 API 项目）：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 项目：订单服务 API</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 技术栈</span></span>
<span class="line"><span>- Node.js 20 + TypeScript</span></span>
<span class="line"><span>- Fastify（Web 框架）</span></span>
<span class="line"><span>- Prisma（ORM）</span></span>
<span class="line"><span>- PostgreSQL + Redis</span></span>
<span class="line"><span>- Zod（数据验证）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 目录结构</span></span>
<span class="line"><span>src/</span></span>
<span class="line"><span>├── routes/ # 路由定义</span></span>
<span class="line"><span>├── controllers/ # 请求处理</span></span>
<span class="line"><span>├── services/ # 业务逻辑</span></span>
<span class="line"><span>├── repositories/ # 数据访问</span></span>
<span class="line"><span>├── schemas/ # Zod schemas</span></span>
<span class="line"><span>└── types/ # 类型定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## API 响应格式</span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>interface ApiResponse&amp;lt;T&gt; {</span></span>
<span class="line"><span>  success: boolean;</span></span>
<span class="line"><span>  data?: T;</span></span>
<span class="line"><span>  error?: &amp;#123; code: string; message: string &amp;#125;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>编码规范</span></span>
<span class="line"><span>- TypeScript strict 模式</span></span>
<span class="line"><span>- 禁止使用 any，使用 unknown + 类型守卫</span></span>
<span class="line"><span>- 所有 API 端点必须有 Zod schema 验证</span></span>
<span class="line"><span>- 业务错误使用自定义 Error 类</span></span>
<span class="line"><span>常用命令</span></span>
<span class="line"><span>- pnpm dev - 启动开发服务器</span></span>
<span class="line"><span>- pnpm test - 运行测试</span></span>
<span class="line"><span>- pnpm prisma migrate dev - 运行数据库迁移</span></span></code></pre></div><p><strong>本地级个人工作空间</strong></p><p>个人工作空间用于记载个人工作笔记，不提交到 Git，适合内容包括本地环境配置、个人调试技巧、当前工作备注，敏感信息（测试账号等）。</p><p>位置：项目根目录的 <code>./CLAUDE.local.md</code></p><p>示例如下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 本地开发笔记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 我的环境</span></span>
<span class="line"><span>- 本地 API: http://localhost:3000</span></span>
<span class="line"><span>- 测试数据库: order_service_dev</span></span>
<span class="line"><span>- Redis: localhost:6379</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 测试账号</span></span>
<span class="line"><span>- admin@test.com / test123</span></span>
<span class="line"><span>- user@test.com / test123</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 当前工作</span></span>
<span class="line"><span>- 正在重构支付模块</span></span>
<span class="line"><span>- 参考 PR #234 的讨论</span></span>
<span class="line"><span>- 周五前完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 调试技巧</span></span>
<span class="line"><span>- 订单状态机日志: LOG_LEVEL=debug pnpm dev</span></span>
<span class="line"><span>- 查看 Redis 缓存: redis-cli KEYS &quot;order:*&quot;</span></span></code></pre></div><p>这里重点强调一下：记得把 <code>CLAUDE.local.md</code> 加入 <code>.gitignore</code>！</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>echo &quot;CLAUDE.local.md&quot; &gt;&gt; .gitignore</span></span></code></pre></div><p>当在项目越来越大，周期越来越长的时候，一个属于自己的本地记忆空间其实还蛮有用的。</p><p>我在和Claude Code多轮对话之后，Claude也会自动压缩对话历史。经过一系列提示词之后，我自己也不知道自己进行到哪一步了，想查一下以前的提示词，或者几天前和Claude Code的关键讨论，但是无处寻踪了。而拥有一个记忆空间，定期把关键内容更新就能够解决这个问题（自己更新或者让Claude帮忙更新关键点都行）。</p><p><strong>规则目录：分类组织</strong></p><p>最后说一下rules，这是一个比较高阶的技巧，初学者可以作为知识了解一下，也可以先略过不看。Rules是按主题组织的规则文件，支持 <strong>条件作用域</strong>（也就是视情况来确定是否加载该记忆内容），适合场景包括CLAUDE.md 变得太长时，不同文件类型需要不同规范时，以及前后端分离的项目。</p><p>位置： <code>.claude/rules/*.md</code></p><p>目录结构：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.claude/</span></span>
<span class="line"><span>└── rules/</span></span>
<span class="line"><span>    ├── typescript.md      # TypeScript 规范</span></span>
<span class="line"><span>    ├── testing.md         # 测试规范</span></span>
<span class="line"><span>    ├── api-design.md      # API 设计规范</span></span>
<span class="line"><span>    └── security.md        # 安全规范</span></span></code></pre></div><p>条件作用域示例： <code>.claude/rules/testing.md</code></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>---</span></span>
<span class="line"><span>paths:</span></span>
<span class="line"><span>  - &quot;src/**/*.test.ts&quot;</span></span>
<span class="line"><span>  - &quot;tests/**/*.ts&quot;</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 测试规范</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 命名</span></span>
<span class="line"><span>- 单元测试: \`*.test.ts\`</span></span>
<span class="line"><span>- 集成测试: \`*.integration.test.ts\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 结构</span></span>
<span class="line"><span>使用 Arrange-Act-Assert 模式：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>describe(&#39;OrderService&#39;, () =&amp;gt; {</span></span>
<span class="line"><span>  describe(&#39;createOrder&#39;, () =&amp;gt; {</span></span>
<span class="line"><span>    it(&#39;should create order when stock is available&#39;, async () =&amp;gt; {</span></span>
<span class="line"><span>      // Arrange</span></span>
<span class="line"><span>      const mockProduct = createMockProduct({ stock: 10 });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Act</span></span>
<span class="line"><span>      const order = await orderService.createOrder(mockProduct.id, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Assert</span></span>
<span class="line"><span>      expect(order.status).toBe(&#39;created&#39;);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 覆盖率要求</span></span>
<span class="line"><span>- 业务逻辑: &amp;gt; 80%</span></span>
<span class="line"><span>- 工具函数: &amp;gt; 90%</span></span>
<span class="line"><span>- 路由/控制器: 可以较低</span></span></code></pre></div><p>此处的关键特性是 <code>paths</code> 字段让这个规则只在编辑测试文件时生效，不会浪费其他场景的上下文空间。</p><h2 id="编写高效的-claude-md" tabindex="-1">编写高效的 CLAUDE.md <a class="header-anchor" href="#编写高效的-claude-md" aria-label="Permalink to &quot;编写高效的 CLAUDE.md&quot;">​</a></h2><p>如果你只能记住一句话，那就是 CLAUDE.md 写得好不好，直接决定了 Claude 是靠谱同事，还是每次都要重新培训的实习生。</p><p>下面我们就来讨论CLAUDE.md编写要遵循的核心原则，了解 <strong>怎么写，才值得每次都被加载进上下文。</strong></p><h3 id="核心原则1-less-is-more" tabindex="-1">核心原则1：Less is More <a class="header-anchor" href="#核心原则1-less-is-more" aria-label="Permalink to &quot;核心原则1：Less is More&quot;">​</a></h3><p>CLAUDE.md 的每一行，都会在每一次对话开始时被自动注入上下文。这意味着一件事：冗余不是无害的，而是持续消耗的。所以保持精简不是建议，而是 <strong>必须</strong>。</p><h3 id="核心原则2-具体优于泛泛" tabindex="-1">核心原则2：具体优于泛泛 <a class="header-anchor" href="#核心原则2-具体优于泛泛" aria-label="Permalink to &quot;核心原则2：具体优于泛泛&quot;">​</a></h3><p>先来看一个非常常见、但几乎没有任何效果的写法。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 项目规范</span></span>
<span class="line"><span>## 代码质量</span></span>
<span class="line"><span>请写出高质量的代码。代码应该是可读的。使用有意义的变量名。</span></span>
<span class="line"><span>保持代码整洁。遵循最佳实践。不要写重复的代码。</span></span></code></pre></div><p>这些话没有一句是错的，但问题在于——Claude 本来就知道这些。它们不会改变 Claude 的任何决策，只会白白占用上下文空间。这些话对人类尚且含糊，对模型来说，更是几乎等于什么都没说。</p><p>真正有价值的 CLAUDE.md，应该长这样。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 项目规范</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## TypeScript</span></span>
<span class="line"><span>- 使用 \`interface\` 定义对象结构，\`type\` 用于联合类型</span></span>
<span class="line"><span>- 禁止 \`any\`，使用 \`unknown\` + 类型守卫</span></span>
<span class="line"><span>- 函数参数 &amp;gt; 3 个时，使用对象参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 错误处理</span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>// 业务错误</span></span>
<span class="line"><span>throw new BusinessError(&#39;ORDER_NOT_FOUND&#39;, &#39;订单不存在&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 验证错误（Zod 自动抛出）</span></span>
<span class="line"><span>const data = orderSchema.parse(input);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// controller 中不要 try-catch</span></span>
<span class="line"><span>// 由全局错误中间件统一处理</span></span></code></pre></div><p>两者的差异非常明确。后者不是模糊要求“要高质量”，而是给出了如何做才算高质量；不是“注意错误处理”，而是具体的错误模型；不是抽象描述，而是可直接模仿的代码形态。</p><p>这里有个简单的判断标准——如果你不写，Claude 也大概率会做对，那就不要写。</p><h3 id="核心原则3-关键三问题-why-what-how" tabindex="-1">核心原则3：关键三问题 WHY / WHAT / HOW <a class="header-anchor" href="#核心原则3-关键三问题-why-what-how" aria-label="Permalink to &quot;核心原则3：关键三问题 WHY / WHAT / HOW&quot;">​</a></h3><p>一份真正“能用”的 CLAUDE.md，通常都在回答三个问题。不是一次性回答，而是 <strong>在关键地方给出明确指引</strong>。</p><h4 id="why-——-为什么要这样做" tabindex="-1">WHY —— 为什么要这样做？ <a class="header-anchor" href="#why-——-为什么要这样做" aria-label="Permalink to &quot;WHY —— 为什么要这样做？&quot;">​</a></h4><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>## 为什么使用 Zod？</span></span>
<span class="line"><span>- TypeScript 只有编译时类型检查</span></span>
<span class="line"><span>- API 输入需要运行时验证</span></span>
<span class="line"><span>- Zod 可以同时生成 TS 类型和验证逻辑</span></span>
<span class="line"><span>- 错误信息自动生成，对用户友好</span></span></code></pre></div><p>这一部分的作用，不是让 Claude “记住一个库”，而是让它理解背后的决策逻辑。当 Claude 明白了 <strong>为什么</strong>，它在面对相似但不完全相同的场景时，才更可能做出一致的判断。</p><h4 id="what-——-具体要做什么-不要做什么" tabindex="-1">WHAT —— 具体要做什么，不要做什么？ <a class="header-anchor" href="#what-——-具体要做什么-不要做什么" aria-label="Permalink to &quot;WHAT —— 具体要做什么，不要做什么？&quot;">​</a></h4><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>## 数据库操作规范</span></span>
<span class="line"><span>- 所有查询通过 Prisma ORM</span></span>
<span class="line"><span>- 复杂查询封装在 \`src/repositories/\`</span></span>
<span class="line"><span>- 禁止在 controller/service 中直接写 SQL</span></span>
<span class="line"><span>- 事务使用 \`prisma.$transaction()\`</span></span></code></pre></div><p>这一部分的重点是 <strong>边界</strong>。什么是允许的，什么是禁止的，决策应该发生在哪一层？对 Claude 来说，这比“最佳实践”四个字重要得多。</p><h4 id="how-——-按什么步骤去做" tabindex="-1">HOW —— 按什么步骤去做？ <a class="header-anchor" href="#how-——-按什么步骤去做" aria-label="Permalink to &quot;HOW —— 按什么步骤去做？&quot;">​</a></h4><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>## 创建新 API 端点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 在 \`src/schemas/\` 创建请求/响应 Zod schema</span></span>
<span class="line"><span>2. 在 \`src/routes/\` 添加路由定义</span></span>
<span class="line"><span>3. 在 \`src/controllers/\` 实现请求处理</span></span>
<span class="line"><span>4. 在 \`src/services/\` 实现业务逻辑</span></span>
<span class="line"><span>5. 在 \`tests/\` 添加测试用例</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例参考: \`src/routes/orders.ts\`</span></span></code></pre></div><p>当步骤清晰、路径明确、还有参考文件时，Claude 才会稳定复用 <strong>同一套工作流</strong>，而不是每次自由发挥。</p><h3 id="核心原则4-渐进式披露-不要把一切都塞进-claude-md" tabindex="-1">核心原则4：渐进式披露：不要把一切都塞进 CLAUDE.md <a class="header-anchor" href="#核心原则4-渐进式披露-不要把一切都塞进-claude-md" aria-label="Permalink to &quot;核心原则4：渐进式披露：不要把一切都塞进 CLAUDE.md&quot;">​</a></h3><p>CLAUDE.md 的职责是定义默认决策，而不是承载全部知识。对于非核心、但可能被用到的内容，正确的做法是引用，而不是复制。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 项目规范</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 核心</span></span>
<span class="line"><span>[精简的核心规范]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 详细文档</span></span>
<span class="line"><span>- 数据库设计: 见 \`docs/database.md\`</span></span>
<span class="line"><span>- API 规范: 见 \`docs/api-spec.md\`</span></span>
<span class="line"><span>- 部署流程: 见 \`docs/deployment.md\`</span></span></code></pre></div><p>这样做有两个好处：</p><ol><li><p>CLAUDE.md 保持轻量，启动成本低 。</p></li><li><p>当 Claude 需要进一步的细节信息时，可以按需读取引用文件。</p></li></ol><h2 id="claude-md-实战演练" tabindex="-1"><strong>CLAUDE.md</strong> 实战演练 <a class="header-anchor" href="#claude-md-实战演练" aria-label="Permalink to &quot;**CLAUDE.md** 实战演练&quot;">​</a></h2><h3 id="场景一-为新项目创建记忆" tabindex="-1">场景一：为新项目创建记忆 <a class="header-anchor" href="#场景一-为新项目创建记忆" aria-label="Permalink to &quot;场景一：为新项目创建记忆&quot;">​</a></h3><p>假设你刚接手一个 React + TypeScript 前端项目，让我们从零配置记忆。（可以参考我们课程的 <a href="https://github.com/huangjia2019/claude-code-engingeering" target="_blank" rel="noreferrer">Github Repo</a> 02-Memory目录中的示例。）</p><p><strong>Step 1：创建基础 CLAUDE.md</strong></p><p>先通过 /init 命令自动初始化 CLAUDE.md 文件，或使用下面的命令在项目根目录手动创建记忆文件。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>touch CLAUDE.md</span></span></code></pre></div><p>然后创建如下的内容。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 项目：电商平台前端</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 技术栈</span></span>
<span class="line"><span>- React 18 + TypeScript</span></span>
<span class="line"><span>- Vite 构建</span></span>
<span class="line"><span>- TanStack Query（数据获取）</span></span>
<span class="line"><span>- Zustand（状态管理）</span></span>
<span class="line"><span>- Tailwind CSS</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 目录结构</span></span>
<span class="line"><span>src/</span></span>
<span class="line"><span>├── components/ # 组件</span></span>
<span class="line"><span>│ ├── ui/ # 基础 UI</span></span>
<span class="line"><span>│ └── features/ # 功能组件</span></span>
<span class="line"><span>├── pages/ # 页面</span></span>
<span class="line"><span>├── hooks/ # 自定义 Hooks</span></span>
<span class="line"><span>├── stores/ # Zustand stores</span></span>
<span class="line"><span>├── api/ # API 调用</span></span>
<span class="line"><span>└── types/ # 类型定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 组件规范</span></span>
<span class="line"><span>- 函数组件 + Hooks</span></span>
<span class="line"><span>- Props 接口命名: \`XxxProps\`</span></span>
<span class="line"><span>- 一个组件一个目录: \`Button/index.tsx\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 状态管理</span></span>
<span class="line"><span>- 服务端状态: TanStack Query</span></span>
<span class="line"><span>- 客户端状态: Zustand</span></span>
<span class="line"><span>- 本地状态: useState</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 常用命令</span></span>
<span class="line"><span>- \`pnpm dev\` - 开发服务器</span></span>
<span class="line"><span>- \`pnpm build\` - 构建</span></span>
<span class="line"><span>- \`pnpm test\` - 测试</span></span></code></pre></div><p><strong>Step 2：创建本地记忆</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>touch CLAUDE.local.md</span></span>
<span class="line"><span>echo &quot;CLAUDE.local.md&quot; &gt;&gt; .gitignore</span></span></code></pre></div><p>然后创建如下的内容。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 本地笔记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 环境</span></span>
<span class="line"><span>- API: http://localhost:8080</span></span>
<span class="line"><span>- Mock: 使用 MSW</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 当前任务</span></span>
<span class="line"><span>- 重构购物车组件</span></span>
<span class="line"><span>- 截止: 本周五</span></span></code></pre></div><p><strong>Step 3：添加条件规则（可选）</strong></p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mkdir -p .claude/rules</span></span></code></pre></div><p>然后创建如下.claude/rules/testing.md：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>---</span></span>
<span class="line"><span>paths:</span></span>
<span class="line"><span>  - &quot;src/**/*.test.tsx&quot;</span></span>
<span class="line"><span>  - &quot;src/**/*.test.ts&quot;</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 测试规范</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 使用 Vitest + React Testing Library</span></span>
<span class="line"><span>- 测试文件放在同目录: \`Button.test.tsx\`</span></span>
<span class="line"><span>- 优先测试用户行为，而非实现细节</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>// ✅ 好</span></span>
<span class="line"><span>expect(screen.getByRole(&#39;button&#39;)).toBeEnabled();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ❌ 不好</span></span>
<span class="line"><span>expect(component.state.isLoading).toBe(false);</span></span></code></pre></div><h3 id="场景二-优化已有的-claude-md" tabindex="-1">场景二：优化已有的 CLAUDE.md <a class="header-anchor" href="#场景二-优化已有的-claude-md" aria-label="Permalink to &quot;场景二：优化已有的 CLAUDE.md&quot;">​</a></h3><p>假设你的 CLAUDE.md 已经有 500 行，Claude 开始变慢。此时就需要给它瘦个身，做一些优化了。我们可以分三步走。</p><p><strong>Step 1：识别核心内容</strong></p><p>可以问自己：哪些内容是每次对话都需要的？下面是对于项目整体的一个规划示例——目的是使CLAUDE.md 保有一个简单而清晰的结构。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/78b409e82f2626e31c205a9aea644c0c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/78b409e82f2626e31c205a9aea644c0c.jpg" alt=""></a></p><p><strong>Step 2：拆分成独立文件</strong></p><p>详细的 API 文档、数据库表结构和部署流程虽然重要，但是完全没有必要每次都读入Claude内存，可以移动到单独文件，精简原来的CLAUDE.md 。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>## 核心规范</span></span>
<span class="line"><span>[精简内容]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 详细参考</span></span>
<span class="line"><span>- API 端点清单: &amp;#64;docs/api.md</span></span>
<span class="line"><span>- 数据库 Schema: &amp;#64;prisma/schema.prisma</span></span>
<span class="line"><span>- 部署配置: &amp;#64;docs/deploy.md</span></span></code></pre></div><p><strong>Step 3：使用条件规则</strong></p><p>可以考虑进一步把测试规范、前端规范、后端规范拆分到 <code>.claude/rules/</code>，并设置 <code>paths</code> 条件。</p><h3 id="场景三-记忆管理命令" tabindex="-1">场景三：记忆管理命令 <a class="header-anchor" href="#场景三-记忆管理命令" aria-label="Permalink to &quot;场景三：记忆管理命令&quot;">​</a></h3><p>要查看当前记忆，在 Claude Code 中输入：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/memory</span></span></code></pre></div><p>就会显示当前加载的所有记忆内容和来源。</p><p>编辑记忆的命令参数如下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/memory edit         # 编辑项目级 CLAUDE.md</span></span>
<span class="line"><span>/memory edit user    # 编辑用户级记忆</span></span>
<span class="line"><span>/memory edit local   # 编辑本地级记忆</span></span></code></pre></div><p>你也可以通过自然语言指令，让 Claude 帮你更新记忆！</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你：请记住，我们项目使用 pnpm 而不是 npm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Claude：好的，我可以将这个信息添加到项目的 CLAUDE.md 中。</span></span>
<span class="line"><span>        要我现在更新吗？</span></span></code></pre></div><p>（灵活吧？聪明吧？）</p><h2 id="auto-memory-解读" tabindex="-1">Auto Memory 解读 <a class="header-anchor" href="#auto-memory-解读" aria-label="Permalink to &quot;Auto Memory 解读&quot;">​</a></h2><p>最后的一个重要知识点是，Claude Code本身拥有自动记忆功能，随着项目的演进和对话的深入，会在 ~/.claude/projects//memory/ 目录下自动生成 Auto Memory，用于记录模型在项目中学习到的模式、调试经验与结构认知。</p><p>这意味着，Claude Code 的“记忆”并不是单一文件，而是一种多层叠加的上下文注入架构：有些是人为编写的长期规则，有些是组织级强制策略，还有一些是模型自动沉淀的经验笔记。CLAUDE.md 决定“系统被告知什么”，而 Auto Memory 决定“系统在实践中学到了什么”。记忆因此成为一种结构化的工程能力，而不是简单的对话缓存。</p><h2 id="本讲小结" tabindex="-1">本讲小结 <a class="header-anchor" href="#本讲小结" aria-label="Permalink to &quot;本讲小结&quot;">​</a></h2><p>CLAUDE.md 是有层次的记忆。它的意义，是把项目规范、编码风格和团队约定中反复强调的共识，从对话中抽离出来，变成一次配置、长期生效的默认规则。</p><p>然而记忆本身是有成本的。CLAUDE.md 会在每一次对话开始时自动加载。这意味着它并不适合承载所有信息，而只适合存放每次都必须知道的内容。当记忆过多、层级混乱，Claude 的行为反而会变得迟钝甚至不稳定。因此，理解加载顺序、控制记忆体量、区分团队规范与个人偏好，并不是简单的进阶技巧，而是能否长期使用这套机制的前提。</p><p>当Claude 响应明显变慢，经常出现上下文长度警告，而且Claude“忘记”对话早期的内容时，可以采用 “.md瘦身三步法”：精简 → 拆分 → 条件规则。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/c81b252f29a7ef345eb0e99dd17ef3f7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E5%B7%A5%E7%A8%8B%E5%8C%96%E5%AE%9E%E6%88%98/images/942948/c81b252f29a7ef345eb0e99dd17ef3f7.jpg" alt=""></a></p><p>从更高的层面看，这一讲讨论的并不只是一个配置文件，而是一种新的协作方式： <strong>把隐性的经验、默认的判断和反复纠正的规则，提前固化成结构。</strong> 这样，Claude 才能从一个需要不断校准的工具，逐渐变成一个行为稳定、风格一致的协作伙伴。而当任务继续变复杂、角色继续分化时，单一记忆已经不够——这正是我们下一讲引入子代理的原因。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>1.看看你现在项目的 CLAUDE.md（如果有），有哪些内容可以精简或移出去？</p><p>2.如果团队有 5 个不同技术栈的项目，你会如何设计用户级记忆？</p><p>3.什么内容适合放在 CLAUDE.local.md 而不是 CLAUDE.md？</p><p>记忆系统可以让 Claude “知道”你的项目，但当任务变复杂时，一个 Claude 可能不够用。下一讲，我们进入 <strong>子代理（Sub-Agents）专题</strong>——学习如何把一个大脑拆成多个专职岗位，让它们各司其职、协同工作。</p><p>你将学会：</p><ul><li><p>为什么需要子代理？</p></li><li><p>隔离执行的工程价值</p></li><li><p>如何设计子代理的权限边界</p></li></ul><p>欢迎你在留言区和我交流讨论。如果这一讲对你有启发，别忘了分享给身边更多朋友。</p>`,139)])])}const g=a(l,[["render",i]]);export{h as __pageData,g as default};
