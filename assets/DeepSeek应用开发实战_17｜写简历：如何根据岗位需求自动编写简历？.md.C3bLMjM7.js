import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"17 | 写简历：如何根据岗位需求自动编写简历？","description":"","frontmatter":{},"headers":[{"level":2,"title":"写简历","slug":"写简历","link":"#写简历","children":[{"level":3,"title":"获取岗位源数据","slug":"获取岗位源数据","link":"#获取岗位源数据","children":[]},{"level":3,"title":"完善简历","slug":"完善简历","link":"#完善简历","children":[]},{"level":3,"title":"根据模板进一步完善","slug":"根据模板进一步完善","link":"#根据模板进一步完善","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"DeepSeek应用开发实战/17｜写简历：如何根据岗位需求自动编写简历？.md","filePath":"DeepSeek应用开发实战/17｜写简历：如何根据岗位需求自动编写简历？.md","lastUpdated":1795486824000}'),l={name:"DeepSeek应用开发实战/17｜写简历：如何根据岗位需求自动编写简历？.md"};function e(t,s,h,c,o,d){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_17-写简历-如何根据岗位需求自动编写简历" tabindex="-1">17 | 写简历：如何根据岗位需求自动编写简历？ <a class="header-anchor" href="#_17-写简历-如何根据岗位需求自动编写简历" aria-label="Permalink to &quot;17 | 写简历：如何根据岗位需求自动编写简历？&quot;">​</a></h1><p>你好，我是邢云阳。</p><p>上节课，我们写了一个工具，让 AI 可以访问我们本地的文件系统拿到简历信息，之后用这份完整简历测试了匹配岗位的效果。效果很不错，但却出现了大模型上下文长度不足导致最后的求职建议给不全的问题。</p><p>因此我们又借助 RAG 技术合理浓缩了简历。这个过程我们是顺势而为的，出现问题就解决问题，可能思路跳转得会有点快，不过大家也能从中学到更多知识点，而不仅仅是学会怎么调用DeepSeek。希望你在课后也可以多多实践，加深理解。</p><p>这节课，是我们求职助手篇的最后一节课。都说 DeepSeek 写作能力强，这节课我们就来试试成色，让 DeepSeek 根据岗位需求，辅助我们编写简历。</p><h2 id="写简历" tabindex="-1">写简历 <a class="header-anchor" href="#写简历" aria-label="Permalink to &quot;写简历&quot;">​</a></h2><h3 id="获取岗位源数据" tabindex="-1">获取岗位源数据 <a class="header-anchor" href="#获取岗位源数据" aria-label="Permalink to &quot;获取岗位源数据&quot;">​</a></h3><p>在之前匹配工作时，我们是根据岗位列表匹配的，也就是这个页面的信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/17/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/DeepSeek%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/17/1.png" alt=""></a></p><p>实际上这个页面呢，信息量是有限的，只包含了岗位名称、要求技能、经验以及薪资待遇，公司名称等等主要信息，看不到公司情况、该岗位的详细要求描述这些信息，这样对我们写简历的帮助有限。</p><p>因此我们可以结合求职助手匹配到的三个岗位，进入到岗位详情页，把详细信息抓下来，或者手工复制下来都可以。比如我就想投递阿里云的 AI 应用开发专家 TAM 这个岗位，那就把该岗位的详细信息抓下来，组成这样的格式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 岗位名称: AI应用开发专家TAM</span></span>
<span class="line"><span>公司名称: 阿里云</span></span>
<span class="line"><span>岗位要求: 岗位职责:</span></span>
<span class="line"><span>1. 基于阿里云大模型，支撑阿里云客户构建创新AI应用。帮助客户进行大模型的微调、再训练、模型评测、提</span></span>
<span class="line"><span>2. 负责帮助客户治理企业已有数据资产，进行数据集建设和知识工程加工。</span></span>
<span class="line"><span>3. 负责结合行业特点和业务场景，完成算法的工程化实现，沉淀可复用的AI应用资产。</span></span>
<span class="line"><span>4. 调研最新业界和学术界成果，对前沿AI应用方向进行持续探索。</span></span></code></pre></div><ul><li>任职要求：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 研究生及以上学历，计算机相关专业</span></span>
<span class="line"><span>2. 精通Python、JAVA或C++开发语言，3年以上算法开发经验，掌握数据处理、知识工程、算法选型、算法优</span></span>
<span class="line"><span>3. 参与过完整的算法实现项目，有云计算&amp;大模型对口行业实战算法项目经验加分</span></span>
<span class="line"><span>4. 有国产GPU适配经验者优先</span></span></code></pre></div><ul><li>加分项：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 有阿里云ACE认证者优先</span></span>
<span class="line"><span>2. 熟练使用阿里云AI大模型、AI开发平台产品、大数据产品者优先</span></span>
<span class="line"><span>3. 具备流利的英语会话能力者优先</span></span>
<span class="line"><span>技能要求: Golang,Java,PostgreSQL,机器学习经验,Redis,Numpy,PyTorch,MySQL,MongoDB,架构设</span></span>
<span class="line"><span>薪资待遇: 30-50K</span></span></code></pre></div><p>之后，就可以根据这个内容，帮我们完善简历了。</p><h3 id="完善简历" tabindex="-1">完善简历 <a class="header-anchor" href="#完善简历" aria-label="Permalink to &quot;完善简历&quot;">​</a></h3><p>完善简历重点在于 prompt 的编写，内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ResumePrompt = &quot;&quot;&quot;</span></span>
<span class="line"><span>你是一个 AI 简历助手。我会给你提供我的简历以及某公司的详细岗位要求。你的任务是根据公司的岗位要求</span></span></code></pre></div><ul><li>简历：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{resume}</span></span></code></pre></div><ul><li>岗位要求：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{input}</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span></code></pre></div><p>我这里给出了简历以及岗位要求，让大模型根据公司的要求帮我完善简历。</p><p>我们结合上节课的从本地导入 docx 文件的代码来完成这一次的代码。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> load_doc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() -&gt; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">list</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   word</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">UnstructuredWordDocumentLoader(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;E:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">AI</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\\\</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">个人简历.docx&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   docs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">word.load()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> docs</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fix_resume</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   prompt</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PromptTemplate.from_template(ResumePrompt2)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   llm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">DeepSeekR1()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   docs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">load_doc()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   chain</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;resume&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">lambda</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> _: docs,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;input&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:RunnablePassthrough()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> prompt </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> llm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> StrOutputParser()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ret</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">chain.invoke(load_jobs())</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ret)</span></span></code></pre></div><p>我是将岗位需求抓下来后，放在了 job.txt 中。之后在 fix_resume 方法中，首先导入 prompt模板，然后初始化 DeepSeek 客户端，之后重点代码就在于构建 chain。chain 其实很好理解，就类似于管道操作。比如在 Linux 中，我们常用到 grep 命令过滤字段，就像这样：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cat</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> job.txt</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> AI</span></span></code></pre></div><p>这条命令的意思是，首先使用 cat job.txt 获取 job.txt 文件的内容，然后把内容通过管道 | 传递给 grep AI 这个命令进行过滤，这样就会只显示出 job.txt 中包含 AI 的内容。</p><p>回到我们代码中的 chain，这个 chain 的意思是首先通过 “input”:RunnablePassthrough()，为prompt 模板中的 input 字段赋值，这个值是 chain.invoke 赋的。之后把 input 的值传递给了prompt，然后把 prompt 传递给 llm 大模型，最后把大模型的返回结果传递给StrOutputParser()，让其将大模型的返回结果解析成字符串输出。</p><p>我们看一下代码输出结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>以下是针对阿里云AI应用开发专家TAM岗位的简历优化建议（关键修改部分用【】标注）：</span></span>
<span class="line"><span>张小明 | 10年AI应用开发经验</span></span>
<span class="line"><span>所在地：上海 | 联系方式：zhangxiaoming@x.xxx</span></span>
<span class="line"><span>求职意向：阿里云AI应用开发专家TAM</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 教育背景</span></span>
<span class="line"><span>山东大学 计算机科学与技术 学士（2011-2015）</span></span></code></pre></div><ul><li>【补充】主修课程：机器学习基础、分布式系统、自然语言处理导论</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>【新增】阿里云ACE认证（2023）</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 核心优势</span></span>
<span class="line"><span>- 10年阿里云AI产品全栈开发经验，主导3个千万级AI产品落地</span></span>
<span class="line"><span>- 兼具AI算法工程化能力（RAG/微调/模型优化）与云原生架构设计能力</span></span>
<span class="line"><span>- 深度参与客户侧AI应用开发，累计支持20+企业客户AI转型</span></span>
<span class="line"><span>- 国产GPU适配项目组成员（2024）</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 工作经历</span></span>
<span class="line"><span>**阿里云 | 云原生研发工程师（2015-2025）**</span></span>
<span class="line"><span>AI产品技术负责人（2022-2025）</span></span>
<span class="line"><span>- 主导AI套件开发，支撑客户完成【大模型微调（平均精度提升18%）】、【知识库构建（处理PB级企业数</span></span>
<span class="line"><span>据）】、【生产级RAG系统部署】</span></span>
<span class="line"><span>- 设计AI Agent开发框架，实现【客户业务场景算法工程化模板】沉淀，提升交付效率40%</span></span>
<span class="line"><span>- 构建企业数据治理方案，通过【智能ETL管道】完成非结构化数据向量化处理，支持500+客户知识工程需</span></span></code></pre></div><ul><li>求</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- 牵头国产GPU适配项目，优化CUDA算子实现，达成【训练效率提升25%】的技术突破</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 重点项目</span></span>
<span class="line"><span>**云原生智算平台（2025）**</span></span>
<span class="line"><span>- 开发AI应用全生命周期管理平台，集成【模型微调工具链】、【自动化评测系统】、【智能提示词工厂</span></span></code></pre></div><ul><li>】等核心模块</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- 实现客户侧算法快速部署能力，支持【TensorFlow/PyTorch框架无缝迁移】，日均处理300+推理任务</span></span>
<span class="line"><span>- 构建多租户数据隔离方案，通过【知识图谱引擎】实现企业数据资产智能治理</span></span>
<span class="line"><span>**K8s AIOPS平台（2024）**</span></span>
<span class="line"><span>- 研发基于大模型的智能运维系统，设计【自然语言指令解析引擎】，准确率达92%</span></span>
<span class="line"><span>- 开发集群健康诊断算法，通过【时序预测模型】实现故障提前预警，降低客户运维成本35%</span></span>
<span class="line"><span>- 集成阿里云日志服务/SLS，构建【跨云可观测性解决方案】</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 技术栈</span></span>
<span class="line"><span>**语言**：Python（精通）、Golang（精通）、Java（熟练）</span></span>
<span class="line"><span>**AI技能**：大模型微调（LoRA/P-Tuning）、RAG系统设计、PyTorch/TensorFlow工程化</span></span>
<span class="line"><span>**云原生**：Kubernetes（CKA认证）、Serverless架构、Service Mesh</span></span>
<span class="line"><span>**数据处理**：PostgreSQL向量检索、Elasticsearch、Spark数据处理流水线</span></span>
<span class="line"><span>**语言能力**：英语流利（技术文档撰写/国际会议演讲）</span></span></code></pre></div><p>可以看到，DeepSeek 还是帮我们完善了很多与岗位相关的内容的。这样我们就可以根据简历内容再调整一下，把自己确实不会的去掉，避免面试时被问到但不会的尴尬。</p><h3 id="根据模板进一步完善" tabindex="-1">根据模板进一步完善 <a class="header-anchor" href="#根据模板进一步完善" aria-label="Permalink to &quot;根据模板进一步完善&quot;">​</a></h3><p>不过我认为这份简历感觉还是略显简单，尤其是项目部分，几句话就写完了，无法给人留下深刻的印象。因此我们可以在提示词中加一个模板，让其在项目经历等关键部分，按照模板进行改写。完善后的提示词如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ResumePrompt2 = &quot;&quot;&quot;</span></span>
<span class="line"><span>你是一个 AI 简历助手。我会给你提供我的简历以及某公司的详细岗位要求。你的任务是根据公司的岗位要求</span></span></code></pre></div><ul><li><p>此外，我还会给你一个简历模板，模板中会包含简历中部分内容的大纲，当你匹配到我的简历中有模板提及的内</p></li><li><p>简历：</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{resume}</span></span></code></pre></div><ul><li>简历模板：专业技能</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> 请在此描述符合职位要求的技能，尤其是编程技能</span></span></code></pre></div><ul><li>项目经验</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(1) 项目描述</span></span>
<span class="line"><span>(2) 我在项目中的角色</span></span>
<span class="line"><span>(3) 项目规模</span></span>
<span class="line"><span>(4) 技术堆栈</span></span>
<span class="line"><span>(5) 已开发模块的描述</span></span>
<span class="line"><span>(6) 解决难题的经验</span></span></code></pre></div><ul><li>岗位要求：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{input}</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span></code></pre></div><p>效果：</p><ul><li>以下是按照您提供的模板和岗位要求优化后的简历（注：部分内容需您补充完善）：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>=====================</span></span>
<span class="line"><span>**张小明**</span></span>
<span class="line"><span>所在地：上海 | 求职意向：AI应用开发专家 | 工作年限：10年</span></span>
<span class="line"><span>联系方式：zhangxiaoming@x.xxx</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 专业技能</span></span>
<span class="line"><span>- **AI开发**：精通大模型微调、RAG技术优化、AI Agent架构设计，主导过企业级AI应用资产沉淀</span></span>
<span class="line"><span>- **编程能力**：精通Python/Golang（10年+），熟悉Java/C++，熟悉PyTorch/TensorFlow框架</span></span>
<span class="line"><span>- **云原生**：Kubernetes专家（5年+），主导过容器化大数据平台、AI智算平台架构设计</span></span>
<span class="line"><span>- **数据处理**：掌握数据治理、知识工程全流程，熟悉MySQL/PostgreSQL/MongoDB数据库技术</span></span>
<span class="line"><span>- **行业经验**：阿里云AI套件核心开发者，熟悉阿里云AI开发平台及大数据产品生态</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 项目经验</span></span>
<span class="line"><span>#### 云原生智算平台（2025）</span></span>
<span class="line"><span>**项目描述**：阿里云AI应用支撑平台，集成大模型部署、API管理、RAG增强、微调服务等功能，支撑500+</span></span>
<span class="line"><span>**担任角色**：技术负责人（团队15人）</span></span>
<span class="line"><span>**技术栈**：Python/Golang/K8s/PostgreSQL/PyTorch/阿里云PAI</span></span>
<span class="line"><span>**核心成果**：</span></span>
<span class="line"><span>1. 设计大模型微调模块，实现客户私有数据适配效率提升60%</span></span>
<span class="line"><span>2. 开发知识工程加工系统，支持非结构化数据自动向量化存储</span></span>
<span class="line"><span>3. 构建RAG服务治理体系，实现多源数据检索响应速度优化40%</span></span>
<span class="line"><span>**解决难题**：突破混合云环境下GPU资源动态调度技术，获阿里云ACE技术创新奖</span></span>
<span class="line"><span>#### K8s AIOPS平台（2024）</span></span>
<span class="line"><span>**项目描述**：基于大模型的智能运维系统，日均处理10万+集群操作请求</span></span>
<span class="line"><span>**担任角色**：架构设计师</span></span>
<span class="line"><span>**技术栈**：Python/K8s/NLP/Redis/阿里云ECS</span></span>
<span class="line"><span>**核心模块**：</span></span>
<span class="line"><span>1. 开发自然语言指令解析引擎，准确率达92%</span></span>
<span class="line"><span>2. 构建集群健康度评估模型，故障预测准确率提升35%</span></span>
<span class="line"><span>3. 设计国产GPU适配层，支持多种异构计算资源调度</span></span>
<span class="line"><span>#### 容器大数据平台（2023）</span></span>
<span class="line"><span>**项目描述**：云原生大数据基础设施，支持快速部署Spark/Flink等组件</span></span>
<span class="line"><span>**技术亮点**：</span></span>
<span class="line"><span>- 实现k8s原生作业提交接口，资源利用率提升50%</span></span>
<span class="line"><span>- 开发数据血缘追踪模块，获国家技术专利（专利号需补充）</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 工作经历</span></span>
<span class="line"><span>**阿里云 | 云原生研发工程师**（2015-2025）</span></span>
<span class="line"><span>- 主导AI套件产品线研发，年服务客户超2000家</span></span>
<span class="line"><span>- 完成10+重点客户AI应用落地，沉淀可复用解决方案23套</span></span>
<span class="line"><span>- 推动国产GPU在云原生环境的适配验证，节省硬件成本40%</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 教育背景</span></span>
<span class="line"><span>山东大学 | 计算机科学与技术 | 学士（2011-2015）</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>### 附加信息</span></span>
<span class="line"><span>- 英语：CET-4（可补充具体英语项目对接经验）</span></span>
<span class="line"><span>- 认证：阿里云ACE认证（如有请补充）</span></span>
<span class="line"><span>- 认证：阿里云ACE认证（如有请补充）</span></span>
<span class="line"><span>- 技术专利：容器化数据治理系统（申请号需补充）</span></span></code></pre></div><p>可以看到，DeepSeek 还是努力按照我们的要求进行改写了。但其实由于我们的简历太过简单，项目描述只有一句话，因此大模型很难参考其内容，把项目写得太丰富。这其实也说明了，提示词质量的重要性，毕竟简历在这里也是提示词的一部分。大家可以课后拿一份自己的求职简历，做一下测试。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我们做了一件轻松且有意思的事，那就是让 DeepSeek 根据详细岗位需求帮我编写或者完善一份简历。</p><p>代码部分可以说非常非常简单，如果你对 LangChain 不熟，纯使用前置课程那种调用 SDK 的方式也能完成，主要技术点其实就是 prompt 的编写。prompt 编写看似很简单，实则是有技巧的，这也是 prompt 工程时这个职业诞生的原因。在未来的 AI 开发中，prompt 编写将是基本功，得 prompt 得天下。</p><p>这节课的代码，我已经上传到 GitHub，链接是Geek02/class17/resume at main ·xingyunyang01/Geek02，你可以课后下载代码自己测试一下。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在第 15 课的求职助手中，AI 曾在匹配到合适岗位后，给出了一些求职建议。我们是否可以结合这些建议，进一步完善简历呢？</p><p>欢迎你在留言区展示你的思考结果，我们一起来讨论。如果你觉得这节课的内容对你有帮助的话，也欢迎你分享给其他朋友，我们下节课再见！</p>`,62)])])}const g=a(l,[["render",e]]);export{r as __pageData,g as default};
