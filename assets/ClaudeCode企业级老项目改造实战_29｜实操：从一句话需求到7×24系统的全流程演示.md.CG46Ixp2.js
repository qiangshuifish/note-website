import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"29 | 实操：从一句话需求到7×24系统的全流程演示","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备","slug":"准备","link":"#准备","children":[]},{"level":2,"title":"场景一：第一次翻译，从一句话到完整设计文档","slug":"场景一-第一次翻译-从一句话到完整设计文档","link":"#场景一-第一次翻译-从一句话到完整设计文档","children":[]},{"level":2,"title":"场景二：跑通 Hermes 验证机制","slug":"场景二-跑通-hermes-验证机制","link":"#场景二-跑通-hermes-验证机制","children":[]},{"level":2,"title":"场景三：让代码长出来，5 个 Tool ＋ Skill 骨架","slug":"场景三-让代码长出来-5-个-tool-skill-骨架","link":"#场景三-让代码长出来-5-个-tool-skill-骨架","children":[]},{"level":2,"title":"场景四：填业务层","slug":"场景四-填业务层","link":"#场景四-填业务层","children":[]},{"level":2,"title":"一键跑完整流程：让 Claude Code 自主执行","slug":"一键跑完整流程-让-claude-code-自主执行","link":"#一键跑完整流程-让-claude-code-自主执行","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"ClaudeCode企业级老项目改造实战/29｜实操：从一句话需求到7×24系统的全流程演示.md","filePath":"ClaudeCode企业级老项目改造实战/29｜实操：从一句话需求到7×24系统的全流程演示.md","lastUpdated":1795530109000}'),l={name:"ClaudeCode企业级老项目改造实战/29｜实操：从一句话需求到7×24系统的全流程演示.md"};function i(t,s,o,c,h,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_29-实操-从一句话需求到7×24系统的全流程演示" tabindex="-1">29 | 实操：从一句话需求到7×24系统的全流程演示 <a class="header-anchor" href="#_29-实操-从一句话需求到7×24系统的全流程演示" aria-label="Permalink to &quot;29 | 实操：从一句话需求到7×24系统的全流程演示&quot;">​</a></h1><p>你好，我是 Robert。</p><p>这一讲是第六部分的收尾。前面 24-28 每一讲做一段，这一讲把“接到一句话需求”到“7×24 系统跑起来”的所有动作连起来跑一遍。从 leader 给你“用 Hermes Agent 实现 7×24 混沌测试”这一句话，到完整设计文档 ＋ 完整方案文档 ＋ 5 个 Tool ＋ Skill ＋ 业务层 ＋ 真实运转。</p><p>这是一节实操课，视频演示。提示词都在下面，你可以打开 Claude Code 照着跑。跑完你的项目里就有一次完整的“基于开源项目二次开发”的闭环。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E4%BC%81%E4%B8%9A%E7%BA%A7%E8%80%81%E9%A1%B9%E7%9B%AE%E6%94%B9%E9%80%A0%E5%AE%9E%E6%88%98/images/29/1.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/ClaudeCode%E4%BC%81%E4%B8%9A%E7%BA%A7%E8%80%81%E9%A1%B9%E7%9B%AE%E6%94%B9%E9%80%A0%E5%AE%9E%E6%88%98/images/29/1.jpeg" alt=""></a></p><p>还有一件事必须开篇就说：25 讲第二次翻译时我做过一次反问，把“自研 Claude API tooluse”路径砍掉，改成基于 Hermes 重写。这个反问留下了一条新的硬约束：任何方案文档跑出来之前，先反问“路径选对了吗”。这一讲的工作流第二步就是这件事。</p><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-label="Permalink to &quot;准备&quot;">​</a></h2><p>24-28 讲的准备工作都做完了：26 讲把 Hermes 装好了，Claude Code 跑起来，24 讲建立对Hermes 的顶层认知，25 讲完成方案文档（本讲会重新跑一份）。</p><p>如果你跳过了前面直接看这一讲，先回到 26 讲跑一遍 Hello World，确保 Hermes 装好且能扩展。否则后面所有提示词的“基于 Hermes”都没有素材。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 进入 Hermes 仓库目录,所有提示词都在这里跑</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> hermes</span></span></code></pre></div><h2 id="场景一-第一次翻译-从一句话到完整设计文档" tabindex="-1">场景一：第一次翻译，从一句话到完整设计文档 <a class="header-anchor" href="#场景一-第一次翻译-从一句话到完整设计文档" aria-label="Permalink to &quot;场景一：第一次翻译，从一句话到完整设计文档&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>对应 25 讲。产出 docs/design.md（完整设计文档，与具体技术栈无关）。</span></span></code></pre></div><p>提示词 1：把一句话需求展开成设计文档</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我把这个一句话需求展开成完整的技术设计文档:用 AI Agent 给 RobustMQ</span></span>
<span class="line"><span>实现 7×24 不间断跑混沌测试的系统,自动起集群、注入故障、跑多语言 SDK、</span></span></code></pre></div><ul><li>收日志、出报告。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>这一步先别谈具体技术框架,把＂为什么要做、做什么、不做什么、用什么思路、</span></span></code></pre></div><ul><li>覆盖什么场景、产出什么＂讲清楚。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>有几个我自己一时拍不准的关键选择,你列出来给我看,每个给两三个选项和</span></span>
<span class="line"><span>影响,我来拍。</span></span>
<span class="line"><span>不要复述,要展开。</span></span></code></pre></div><p>review 重点：六块都有内容（为什么／做什么／不做什么／思路／场景／产出），AI 列出来的“待我拍板的选择”至少 3 个，每个带选项和影响，不是空泛的“由你决定”。</p><p>提示词 2：反问补漏</p><p>跑完上面提示词，你会发现 AI 给的设计文档总有几处空洞，把空洞挑出来反问：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你这版有几处空洞:</span></span>
<span class="line"><span>1. 场景优先级没分。混沌测试持续跑,得有 P0/P1/P2 这种分级,</span></span>
<span class="line"><span>  按触发频率匹配。补一下。</span></span>
<span class="line"><span>2. 测试报告对内还是对外?这件事影响存储、Dashboard、脱敏一系列设计。</span></span>
<span class="line"><span>  给我两三个选项,我来拍。</span></span>
<span class="line"><span>3. SDK 矩阵不够系统。具体覆盖哪些语言、每种语言哪几个版本、</span></span>
<span class="line"><span>  怎么切换版本,展开。</span></span>
<span class="line"><span>别又冒新选择,把这版补完整。</span></span></code></pre></div><p>review 重点：反问是“你这里漏了，补上”，不是追问。AI 不会主动告诉你它漏了什么，得你自己有一份“完整设计文档该长什么样”的预期，拿这份预期去比对它给的版本，差了什么就反问什么。预期从哪来？从你的工作经验里来。</p><p>提示词 3：整合成正式 PRD</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于前面两轮讨论,把所有产出整合成一份完整的技术设计文档,</span></span></code></pre></div><ul><li>能拿出去给社区评审的那种。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>至少包括:</span></span>
<span class="line"><span>1. 背景和目标(为什么做)</span></span>
<span class="line"><span>2. 系统设计思路(全流程 AI 自动化)</span></span>
<span class="line"><span>3. 工具集清单(7 个工具函数,每个的签名和职责)</span></span>
<span class="line"><span>4. 场景库分级(P0/P1/P2)</span></span>
<span class="line"><span>5. SDK 矩阵(完整两张表:MQTT 和 mq9)</span></span>
<span class="line"><span>6. 协议兼容性归因表(测试发现问题→具体在哪里改)</span></span>
<span class="line"><span>7. 测试记录公开度决策</span></span>
<span class="line"><span>保存到 docs/design.md。</span></span></code></pre></div><p>review 重点：协议兼容性归因表（不同 SDK 不一致 ／ 特定版本失败 ／ 全部失败 → 三种归因）有没有写进文档。这张表 28 讲报告模板会反复用。</p><p>跑完场景一，你手上有完整设计文档。这份文档跟具体技术栈无关。20-30 分钟。</p><h2 id="场景二-跑通-hermes-验证机制" tabindex="-1">场景二：跑通 Hermes 验证机制 <a class="header-anchor" href="#场景二-跑通-hermes-验证机制" aria-label="Permalink to &quot;场景二：跑通 Hermes 验证机制&quot;">​</a></h2><p>对应 26 讲。这一步是动手命令，不是 AI 提示词。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装 Hermes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fsSL</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://res1.hermesagent.org.cn/install.sh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 跟它聊一聊,感受手感</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hermes</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 你能帮我做什么</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 帮我看看磁盘空间占用,列出最大的 5 个目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">然后写一个最小</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Skill</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 验证机制。在</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.hermes/skills/hello-world/</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 下新建</span></span></code></pre></div><p>SKILL.md，写一个返回当前时间的 Skill。跑通就行，这一步只是验证 Hermes 真的能扩展，不是这一讲的重点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>review 重点：hermes /skills 能看到 hello-world 出现在列表里，能看到说明 Hermes 加</span></span></code></pre></div><p>载机制活着，后面正式项目就照同样的机制写。</p><p>跑完场景二，Hermes 验证完毕。20-30 分钟。</p><h2 id="场景三-让代码长出来-5-个-tool-skill-骨架" tabindex="-1">场景三：让代码长出来，5 个 Tool ＋ Skill 骨架 <a class="header-anchor" href="#场景三-让代码长出来-5-个-tool-skill-骨架" aria-label="Permalink to &quot;场景三：让代码长出来，5 个 Tool ＋ Skill 骨架&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>对应 27 讲。产出 ~/.hermes/skills/robustmq-chaos-test/ 下的 5 个 Tool ＋ 1 个</span></span></code></pre></div><p>SKILL.md。</p><p>按 25 讲方案的依赖顺序：cluster → observability → client → chaos → report → SKILL。</p><p>提示词 4：cluster.py（完整模板）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/tools/cluster.py。</span></span>
<span class="line"><span>这是混沌测试 Skill 套件的第一个 Tool,负责在本地起停 RobustMQ 测试集群。</span></span>
<span class="line"><span>按 docs/solution.md 的决策:不引入 Docker,直接 spawn 多个 RobustMQ 进程。</span></span>
<span class="line"><span>action 支持 start / stop / status 三种。</span></span>
<span class="line"><span>start: 用 subprocess 拉起 3 个 RobustMQ broker 进程,每个用独立端口</span></span>
<span class="line"><span>(broker-1: 1883, broker-2: 2883, broker-3: 3883)和独立数据目录。</span></span>
<span class="line"><span>数据目录用 tempfile.mkdtemp 创建,记下来 stop 时清理。</span></span>
<span class="line"><span>启动后 curl http://127.0.0.1:1883/health 确认健康,失败立即 kill 全部</span></span>
<span class="line"><span>并返回 {&quot;status&quot;: &quot;failed&quot;}。</span></span>
<span class="line"><span>成功返回 {&quot;status&quot;: &quot;running&quot;, &quot;endpoint&quot;: &quot;127.0.0.1:1883&quot;,</span></span>
<span class="line"><span>&quot;data_dirs&quot;: [...]}。</span></span>
<span class="line"><span>stop: kill 所有 broker 进程,清理 data_dirs。</span></span>
<span class="line"><span>status: 返回当前运行的进程数和 endpoint。</span></span>
<span class="line"><span>RobustMQ 二进制路径通过 ROBUSTMQ_HOME 环境变量取,没设置就 fail-fast</span></span>
<span class="line"><span>返回 error,别用默认值兜底。</span></span>
<span class="line"><span>handler 函数签名 (args: dict, **_) -&gt; str,失败返回 {&quot;error&quot;: &quot;...&quot;}</span></span>
<span class="line"><span>别抛异常,Agent 循环见到异常会中断。</span></span></code></pre></div><p>提示词的关键设计是三件事：接口签名、硬约束、已有依赖。</p><p>review 重点：不引入 Docker，ROBUSTMQ_HOME 没默认值是 fail-fast，临时目录 stop 时清理，失败返回 error 不抛异常。这四条任何一条没做到，回提示词补一句重跑。</p><p>提示词 5：observability.py</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/tools/observability.py。</span></span>
<span class="line"><span>负责从 RobustMQ 集群收集观测数据,后面 chaos 故障注入和 client SDK</span></span></code></pre></div><ul><li>测试都会调它打快照。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>action 支持 collect_logs / collect_metrics / snapshot 三种。</span></span>
<span class="line"><span>collect_logs 从 broker 进程的 log 文件抓最近 100 行,按节点返回。</span></span>
<span class="line"><span>collect_metrics 调 RobustMQ 的 /metrics 端点,返回 connections /</span></span>
<span class="line"><span>messages_in / messages_out / errors。</span></span>
<span class="line"><span>snapshot 一次性收 logs + metrics 加时间戳,用于故障前后对比。</span></span></code></pre></div><p>提示词 6：client.py</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/tools/client.py。</span></span>
<span class="line"><span>负责调度多语言 SDK 跑测试。按 solution.md 决策:不用 Docker 隔离,</span></span>
<span class="line"><span>用本地版本管理工具切换。服务器上预装了 pyenv / gvm / rustup /</span></span>
<span class="line"><span>sdkman / nvm。</span></span>
<span class="line"><span>action 是 run,参数 sdk(python/go/rust/java)、version、scenario、</span></span>
<span class="line"><span>cluster_endpoint。</span></span>
<span class="line"><span>内部:</span></span>
<span class="line"><span>1. 用版本管理工具切换到指定版本</span></span>
<span class="line"><span>2. 进入 sdk_clients/&lt;​sdk&gt;/ 目录跑入口脚本</span></span>
<span class="line"><span>3. 入口脚本通过 CLUSTER_ENDPOINT 环境变量接收集群地址,stdout 最后</span></span>
<span class="line"><span>  一行必须输出约定 JSON({sent, received, lost, p99_ms, errors})</span></span>
<span class="line"><span>4. 解析最后一行 JSON,exit code 表示通过失败</span></span>
<span class="line"><span>注意:解析最后一行 JSON 失败,单独记 status=script_format_error,</span></span></code></pre></div><ul><li>别跟测试失败混在一起算。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>不传 sdk 时,用 ThreadPoolExecutor 并发跑全部语言。并发逻辑放 Python 里,</span></span>
<span class="line"><span>别用 Hermes 的 delegate 机制。</span></span></code></pre></div><p>提示词 7：chaos.py</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/tools/chaos.py。</span></span>
<span class="line"><span>负责故障注入和恢复。按 solution.md 决策:Chaosd 主 + tc/kill 补。</span></span>
<span class="line"><span>action 支持 inject / recover。</span></span>
<span class="line"><span>inject: 接收 fault_type、target、duration_seconds 和具体参数,调</span></span>
<span class="line"><span>Chaosd HTTP API 注入。返回 {&quot;fault_id&quot;: &quot;...&quot;, &quot;status&quot;: &quot;active&quot;}。</span></span>
<span class="line"><span>recover: 按 fault_id 撤销故障。</span></span>
<span class="line"><span>第一版只实现 broker-kill 和 network-delay 两种,其他先返回</span></span>
<span class="line"><span>not_implemented。</span></span>
<span class="line"><span>Chaosd 端点配置在 ~/.hermes/skills/robustmq-chaos-test/config.yml 里</span></span>
<span class="line"><span>读,don&#39;t hardcode。</span></span></code></pre></div><p>提示词 8：report.py</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/tools/report.py。</span></span>
<span class="line"><span>负责整合整轮测试结果,生成报告并提交到 GitHub。</span></span>
<span class="line"><span>action 是 generate_and_push,接收 run_data dict。</span></span>
<span class="line"><span>内部:</span></span>
<span class="line"><span>1. 用 Jinja2 模板渲染 Markdown 报告。模板路径 templates/report.md.j2,</span></span>
<span class="line"><span>  下一步会写。</span></span>
<span class="line"><span>2. 用 json.dumps 写 JSON 报告。绝对别调 LLM 生成 JSON。</span></span>
<span class="line"><span>3. git push 到 GitHub 公开仓库 test-reports。仓库地址从 config.yml 读。</span></span>
<span class="line"><span>  git push 用 Deploy Key,通过 GIT_SSH_COMMAND 指定 ~/.ssh/</span></span>
<span class="line"><span>  test-reports-deploy。</span></span>
<span class="line"><span>4. 返回 {&quot;json_path&quot;, &quot;markdown_path&quot;, &quot;github_url&quot;, &quot;run_passed&quot;}。</span></span>
<span class="line"><span>run_passed 字段的逻辑:核心场景全过 + 非核心场景通过率 ≥ 75%。</span></span>
<span class="line"><span>写新报告时清理 30 天前的本地临时文件。</span></span></code></pre></div><p>提示词 9：SKILL.md 骨架</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/SKILL.md。</span></span>
<span class="line"><span>5 个 Tool 已经写好了,Skill 的任务是告诉 Agent 在 cron 触发或手动触发</span></span>
<span class="line"><span>时,按什么顺序调这些 Tool。</span></span>
<span class="line"><span>5 个 Tool 是 cluster / observability / client / chaos / report。每个</span></span>
<span class="line"><span>Tool 的接口签名见下面贴的接口表。直接照着调,别编不存在的字段。</span></span>
<span class="line"><span>骨架按这几节来:</span></span>
<span class="line"><span>- frontmatter,name=robustmq-chaos-test,requires_tools 列全 5 个</span></span>
<span class="line"><span>- When to Use,讲清 cron 触发(&quot;按 P0 跑一轮...&quot; 这种)和手动 CLI 触发</span></span>
<span class="line"><span> (hermes &quot;按 P1 跑一轮 mq9 故障场景&quot;)各自怎么识别</span></span>
<span class="line"><span>- 测试前置检查,确认无残留进程</span></span>
<span class="line"><span>- 单场景执行五步:基线 snapshot → 注入故障 → 故障期间跑 SDK 测试</span></span>
<span class="line"><span> (只记录不判断)→ 等故障窗口结束自动恢复 → 自愈验证(pass/fail</span></span>
<span class="line"><span> 唯一依据)</span></span>
<span class="line"><span>- 通过失败判断,exit_code=0 且 lost=0 且 p99_ms&lt;500</span></span>
<span class="line"><span>- 报告归档,直接调 report 的 generate_and_push,它会处理 git push</span></span>
<span class="line"><span>- Pitfalls</span></span>
<span class="line"><span>具体场景(broker-kill 用什么 target、network-delay 多少毫秒之类)</span></span>
<span class="line"><span>这步先留白,下一步再用一个新提示词把场景填进去。</span></span>
<span class="line"><span>[贴 5 个 Tool parameters schema]</span></span></code></pre></div><p>review 重点（这一段是 Skill 的灵魂）：Tool 接口完整喂给 AI。如果你不把 Tool 接口贴给AI，AI 会编出根本不存在的 Tool 调用，Skill 加载之后跑就报错。</p><p>这一步的代码没有写到这里，Claude Code 跑出来的真实代码我都放在 GitHub 仓库里。读到哪个 Tool 想看代码，直接去仓库对应文件看。</p><p>跑完场景三，5 个 Tool 加 1 个 Skill 骨架。每个 Tool 跑一次单点验证：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ hermes</span></span>
<span class="line"><span>&gt; 调用 cluster 起一个测试集群</span></span></code></pre></div><p>Agent 真的去调了、返回结果回来，这个 Tool 就活着。某个 Tool 调不通也别慌，九成是description 没写清楚或 parameters schema 不合法，回提示词改两句重跑就行。</p><p>跑完场景三，代码层就齐了。1.5-2 小时。</p><h2 id="场景四-填业务层" tabindex="-1">场景四：填业务层 <a class="header-anchor" href="#场景四-填业务层" aria-label="Permalink to &quot;场景四：填业务层&quot;">​</a></h2><p>对应 28 讲。产出场景库、报告模板、config.yml、Deploy Key ＋ GitHub 仓库、cron.yml。</p><p>提示词 10：写第一个场景库文件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我在 ~/.hermes/skills/robustmq-chaos-test/scenarios/mqtt/ 下</span></span>
<span class="line"><span>写第一个场景 p0-broker-kill-leader.md。</span></span>
<span class="line"><span>格式:Markdown,自然语言描述,Agent 读完知道按 SKILL.md 的＂单场景五步＂</span></span>
<span class="line"><span>怎么调 Tool。</span></span>
<span class="line"><span>具体内容:</span></span>
<span class="line"><span>- 场景名:p0-broker-kill-leader</span></span>
<span class="line"><span>- 协议:MQTT</span></span>
<span class="line"><span>- 优先级:P0(每次触发都跑)</span></span>
<span class="line"><span>- 集群:3 节点 RobustMQ,broker-1 是 Leader</span></span>
<span class="line"><span>- 故障:用 chaos.py inject broker-kill,target=broker-1,duration=30 秒</span></span>
<span class="line"><span>- SDK 矩阵:从 config.yml 读 P0 档的 SDK 列表</span></span>
<span class="line"><span>- 验证:故障期间只记录,Chaosd recover 后等 broker-1 健康检查 200,</span></span>
<span class="line"><span> 再等 60 秒,跑完整 SDK 矩阵的 basic-pubsub</span></span>
<span class="line"><span>- 通过标准:exit_code=0,lost=0,p99_ms&lt;500</span></span>
<span class="line"><span>- 失败处理:记录到 report,继续下一场景</span></span>
<span class="line"><span>写完不要解释,我直接看文件。</span></span></code></pre></div><p>review 重点：故障类型和参数跟 chaos.py 接口对得上；通过标准的字段名（exit_code ／lost ／ p99_ms）跟 client.py 返回的 JSON 对得上。第一个场景写完套同样模板写其他场景。</p><p>提示词 11：报告 Jinja2 模板</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>帮我写 ~/.hermes/skills/robustmq-chaos-test/templates/report.md.j2,</span></span>
<span class="line"><span>Jinja2 模板。</span></span>
<span class="line"><span>输入是 report.py 传进来的 run_data,字段包括:run_id / started_at /</span></span>
<span class="line"><span>ended_at / cluster_info / scenarios(每个 scenario 含 fault_info /</span></span>
<span class="line"><span>sdk_results / passed)。</span></span>
<span class="line"><span>模板要点:</span></span>
<span class="line"><span>- 顶部一段 summary,Run ID + 起止时间 + 整体 pass/fail</span></span>
<span class="line"><span>- 每个 scenario 一个二级标题,展开 fault 信息和 SDK 矩阵结果</span></span>
<span class="line"><span>- SDK 结果用 Markdown 表格</span></span>
<span class="line"><span>- 底部一段＂协议兼容性归因＂,按 docs/design.md 那张归因表的逻辑套</span></span>
<span class="line"><span> (不同 SDK 不一致 → 协议实现问题;特定版本失败 → 版本兼容问题;</span></span>
<span class="line"><span> 全部失败 → broker 端问题)</span></span>
<span class="line"><span>- 别在模板里调 LLM,纯 Jinja2 语法</span></span>
<span class="line"><span>模板长度控制在 80 行以内。</span></span></code></pre></div><p>review 重点：底部那段“协议兼容性归因”是这一讲设计文档对应到报告的真实落点。如果三种归因都不命中，模板要标“待人工分析”，AI 在边界 case 上偷懒，这里要手动收一下。</p><p>提示词 12：套件配置 config.yml</p><p>直接抄（按 solution.md 决策填值）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ~/.hermes/skills/robustmq-chaos-test/config.yml</span></span>
<span class="line"><span>chaosd:</span></span>
<span class="line"><span> endpoint: &quot;http://127.0.0.1:31767&quot;</span></span>
<span class="line"><span>sdk_matrix:</span></span>
<span class="line"><span> p0:</span></span>
<span class="line"><span>   - {sdk: python, version: &quot;3.11&quot;, scenarios: [basic-pubsub]}</span></span>
<span class="line"><span>   - {sdk: go,     version: &quot;1.21&quot;, scenarios: [basic-pubsub]}</span></span>
<span class="line"><span> p1:</span></span>
<span class="line"><span>   - {sdk: python, versions: [&quot;3.10&quot;, &quot;3.11&quot;, &quot;3.12&quot;],</span></span>
<span class="line"><span>      scenarios: [basic-pubsub, failover]}</span></span>
<span class="line"><span>   - {sdk: rust,   version: &quot;1.70&quot;, scenarios: [basic-pubsub, failover]}</span></span>
<span class="line"><span> p2:</span></span>
<span class="line"><span>   - {sdk: python, versions: [&quot;3.10&quot;, &quot;3.11&quot;, &quot;3.12&quot;]}</span></span>
<span class="line"><span>   - {sdk: go,     versions: [&quot;1.20&quot;, &quot;1.21&quot;]}</span></span>
<span class="line"><span>   - {sdk: rust,   versions: [&quot;1.70&quot;, &quot;1.75&quot;]}</span></span>
<span class="line"><span>   - {sdk: java,   versions: [&quot;11&quot;, &quot;17&quot;, &quot;21&quot;]}</span></span>
<span class="line"><span>github:</span></span>
<span class="line"><span> reports_repo: &quot;git@github.com:&lt;​your-org&gt;/test-reports.git&quot;</span></span>
<span class="line"><span> deploy_key_path: &quot;~/.ssh/test-reports-deploy&quot;</span></span>
<span class="line"><span> branch: &quot;main&quot;</span></span></code></pre></div><p>review 重点：P0 档刻意只放 2 个 SDK，P0 是基础保障线，跑得越快越好，大矩阵留给 P1／P2。</p><p>提示词 13：GitHub Deploy Key ＋ test-reports 仓库</p><p>这一步是动手命令，不是 AI 提示词。三步搞定。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 第一步:生成 ed25519 密钥对(空 passphrase 给自动化用)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh-keygen</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ed25519</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ~/.ssh/test-reports-deploy</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   -C</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;robustmq-chaos-test deploy key&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -N</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 第二步:在 GitHub 上创建 public 仓库 test-reports,然后:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Settings → Deploy keys → Add deploy key</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 把 ~/.ssh/test-reports-deploy.pub 内容贴进去,勾 Allow write access</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 第三步:初始化仓库</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">GIT_SSH_COMMAND</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ssh -i ~/.ssh/test-reports-deploy&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> clone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> git@github.com:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">​your-or</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">g</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/test-reports.git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /tmp/test-reports-init</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /tmp/test-reports-init</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;# RobustMQ Quality Reports&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> README.md</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> README.md</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">GIT_SSH_COMMAND</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ssh -i ~/.ssh/test-reports-deploy&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;init&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;&amp; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span></span></code></pre></div><p>review 重点：勾 Allow write access 不能漏（默认是只读）。第三步 push 成功这一刻 DeployKey 链路就活了。</p><p>提示词 14：cron.yml 三档调度</p><p>直接抄：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ~/.hermes/cron.yml</span></span>
<span class="line"><span>jobs:</span></span>
<span class="line"><span> - name: p0-mqtt-basic</span></span>
<span class="line"><span>   schedule: &quot;0 */2 * * *&quot;</span></span>
<span class="line"><span>   prompt: &quot;按 P0 跑一轮 MQTT 基础场景&quot;</span></span>
<span class="line"><span> - name: p0-mq9-basic</span></span>
<span class="line"><span>   schedule: &quot;30 */2 * * *&quot;</span></span>
<span class="line"><span>   prompt: &quot;按 P0 跑一轮 mq9 基础场景&quot;</span></span>
<span class="line"><span> - name: p1-daily-fault</span></span>
<span class="line"><span>   schedule: &quot;0 3 * * *&quot;</span></span>
<span class="line"><span>   prompt: &quot;按 P1 跑一轮故障场景,MQTT 和 mq9 都跑&quot;</span></span>
<span class="line"><span> - name: p2-weekly-matrix</span></span>
<span class="line"><span>   schedule: &quot;0 4 * * 0&quot;</span></span>
<span class="line"><span>   prompt: &quot;按 P2 跑一轮完整 SDK 矩阵&quot;</span></span></code></pre></div><p>review 重点：P0 MQTT 和 mq9 错开 30 分钟避免资源冲突。频率配置直接来自 design.md的 P0／P1／P2 分级。</p><p>跑完场景四，业务层就位。1 小时。</p><h2 id="一键跑完整流程-让-claude-code-自主执行" tabindex="-1">一键跑完整流程：让 Claude Code 自主执行 <a class="header-anchor" href="#一键跑完整流程-让-claude-code-自主执行" aria-label="Permalink to &quot;一键跑完整流程：让 Claude Code 自主执行&quot;">​</a></h2><p>前面四个场景一个个跑，是为了让你看清每一步的产出和 review 点。真正上手之后你会希望一次粘贴，Claude Code 自主跑完整流程，关键决策点停下来等你判断。</p><p>下面这段提示词就是干这个的。整段粘贴到 Claude Code，关键决策点会停下来等你输入。</p><p>注意：一键流程不管装 Hermes 和点 GitHub UI（这两件需要人动手）。它从“已经摸过Hermes、Hermes 已装好”这一步开始，跑到“5 个 Tool ＋ Skill ＋ 业务层全部就位”结束，最后停下来等你跑验证。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我刚拿到一个新需求:[把 leader 的一句话需求填这里,比如&quot;用 Hermes Agent</span></span>
<span class="line"><span>实现一个 7×24 跑混沌测试的 AI 系统&quot;]</span></span>
<span class="line"><span>完整跑通改造流程,全程自主推进,遇到关键决策点停下来等我,</span></span>
<span class="line"><span>不要每一步都问我。请按以下顺序执行:</span></span>
<span class="line"><span>第零步:第二次翻译反问(必做,不能跳)</span></span>
<span class="line"><span>- 这一步是这套工作流最关键的硬约束</span></span>
<span class="line"><span>- 等第一次翻译跑出方案文档之后,先停下来反问&quot;路径选对了吗&quot;</span></span>
<span class="line"><span>- 拿出我跑场景一时摸出来的 Hermes 认知,对比&quot;自研&quot;和&quot;用 Hermes&quot;</span></span>
<span class="line"><span> 两条路径,告诉我每条要做什么、工程量多大</span></span>
<span class="line"><span>- 等我反馈&quot;按 Hermes 路径走&quot;之后才能进第二次翻译</span></span>
<span class="line"><span>第一步:第一次翻译,从一句话到设计文档</span></span>
<span class="line"><span>- 把一句话需求展开成完整设计文档</span></span>
<span class="line"><span>- 列出待我拍板的关键选择(场景分级、报告公开度、SDK 矩阵)</span></span>
<span class="line"><span>- 停下来等我反馈</span></span>
<span class="line"><span>我反馈完后:</span></span>
<span class="line"><span>- 按反馈补完整,整合成正式 docs/design.md</span></span>
<span class="line"><span>第二步:执行第零步的反问</span></span>
<span class="line"><span>- 见第零步说明</span></span>
<span class="line"><span>我反馈&quot;用 Hermes 路径&quot;之后:</span></span>
<span class="line"><span>第三步:第二次翻译,基于 Hermes 重写方案</span></span>
<span class="line"><span>- 整体架构 + Skill 设计 + 7 个 Tool 实现要点 + 场景库 + 触发 +</span></span>
<span class="line"><span> 报告系统 + 关键决策记录 + 实施步骤</span></span>
<span class="line"><span>- 跑完后反问收紧:Skill 边界 / 故障注入选型 / GitHub 凭据</span></span>
<span class="line"><span>- 停下来等我审核 docs/solution.md 第 7 节决策记录</span></span>
<span class="line"><span>我反馈完后:</span></span>
<span class="line"><span>- 把决策落定到 solution.md</span></span>
<span class="line"><span>第四步:代码层,5 个 Tool + Skill 骨架</span></span>
<span class="line"><span>- 按依赖顺序:cluster → observability → client → chaos → report →</span></span>
<span class="line"><span> SKILL.md</span></span>
<span class="line"><span>- 每个 Tool 写完跑一次单点验证 (hermes &quot;调用 X&quot;)</span></span>
<span class="line"><span>- 任何 Tool 调不通,停下来报错给我</span></span>
<span class="line"><span>第五步:业务层</span></span>
<span class="line"><span>- 写第一个场景库文件,然后告诉我接下来要写哪些场景,等我反馈</span></span>
<span class="line"><span>- 写报告 Jinja2 模板</span></span>
<span class="line"><span>- 填 config.yml(SDK 矩阵根据需求决定档位)</span></span>
<span class="line"><span>- 提醒我手动生成 Deploy Key + 创建 GitHub 仓库(我自己做)</span></span>
<span class="line"><span>- 装 cron.yml 三档调度</span></span>
<span class="line"><span>第六步:跑通验证</span></span>
<span class="line"><span>- hermes /skills 和 /tools 看加载是否成功</span></span>
<span class="line"><span>- 用对话跑一次 P0 场景,7 轮调用全部展示给我</span></span>
<span class="line"><span>- 看 GitHub 仓库,确认报告 push 成功</span></span>
<span class="line"><span>自主原则:</span></span>
<span class="line"><span>- 每步跑完自己 review 输出质量,不合格自己重跑</span></span>
<span class="line"><span>- 失败自己 debug 自己修(除非连续 3 次同一错误)</span></span>
<span class="line"><span>- 接口签名 + 硬约束 + 已有依赖,提示词里都要交代</span></span>
<span class="line"><span>- Tool 提示词重传约束,Skill 提示词重喂 Tool 接口</span></span>
<span class="line"><span>- 结构化的东西用代码生成,JSON 别交给 LLM 写</span></span>
<span class="line"><span>- 关键决策点停下来等我,不要替我拍板</span></span>
<span class="line"><span>跑完输出 summary.md,列每个产出文件 + 我应该重点 review 的地方。</span></span></code></pre></div><p>粘贴完等 Claude Code 跑。整个流程 4-5 小时（含你的几次 review）。你不在的时间它在跑，你回来的时间它停在那里等你判断。</p><p>为什么这段提示词这么写？</p><ol><li><p>第零步“路径反问”摆在第零位强制等待。这是这套工作流相比 21 讲护栏的最关键差异。21讲是“先点产品看现状”，这一讲是“第一次翻译跑完先反问路径”。两个第零步是一类硬约束，都来自一次真实翻车留下的工程教训。</p></li><li><p>关键决策点显式让 AI 停下来。第一次翻译的关键选择（场景分级、报告公开度、SDK 矩阵）、路径选择（自研 vs Hermes）、第 7 节决策点 review、业务层场景库决策，这四个决策点 AI 不能替你拍。</p></li><li><p>所有硬约束都明确写进提示词。接口签名 ＋ 硬约束 ＋ 已有依赖、Tool 提示词重传约束、Skill 提示词重喂接口、结构化的东西用代码生成不交给 LLM。这些约束散落在 24-28 讲，一键流程里要全部明确写出来。</p></li><li><p>summary.md 集中暴露 review 点。AI 不能完全替你思考，但可以把“我不确定的地方”集中到 summary 让你重点看。</p></li></ol><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>第六部分到这里结束。从 24 讲摸 Hermes、25 讲两次翻译、26 讲 Hello World、27 讲让代码长出来、28 讲填业务层让系统活起来，整套“基于开源项目二次开发”的方法论全部跑完。</p><p>这次跑完留下了一条最值钱的教训：第二次翻译之前，先反问“路径选对了吗”。AI 顺着你的提问给的方案不一定是最优的，你刚摸过的那个开源项目，可能已经把方案里 80% 的工程都做了，你不用自己撸。这条教训已经写进 25 讲方案文档，下次类似工作流 AI 会主动提醒你做。这一讲的提示词清单和一键工作流里“第零步反问”也是这条教训的产物。</p><p>整门课到这里也接近尾声。一个工程师在 AI 时代能交付的最值钱的东西，不是写代码的能力，是把方向定准、把约束讲清楚、把模糊变具体的能力。AI 给你一个 80 分的初稿，你要做的不是改成 95 分，是先判断初稿是不是建立在对的方向上。方向不对，改 100 遍也是错的。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>跑完整套流程大约花了你多少时间？最卡你的是哪一步：摸 Hermes、第一次翻译、第二次翻译反问、代码层 Tool 编写、业务层场景库、还是跑通验证？</p><p>欢迎在留言区写下你的复盘，我们一起把“接到一句话需求 ＋ 基于开源项目二次开发”这件事磨成肌肉记忆。如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！</p>`,100)])])}const k=a(l,[["render",i]]);export{u as __pageData,k as default};
