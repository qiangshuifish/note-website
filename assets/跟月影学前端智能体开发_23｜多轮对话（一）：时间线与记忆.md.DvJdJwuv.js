import{_ as i,H as a,f as n,i as l}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"23 | 多轮对话（一）：时间线与记忆","description":"","frontmatter":{},"headers":[{"level":2,"title":"时间线（Timeline）","slug":"时间线-timeline","link":"#时间线-timeline","children":[]},{"level":2,"title":"记忆（memory）","slug":"记忆-memory","link":"#记忆-memory","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"跟月影学前端智能体开发/23｜多轮对话（一）：时间线与记忆.md","filePath":"跟月影学前端智能体开发/23｜多轮对话（一）：时间线与记忆.md","lastUpdated":1795560976000}'),p={name:"跟月影学前端智能体开发/23｜多轮对话（一）：时间线与记忆.md"};function t(h,s,e,k,E,r){return a(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="_23-多轮对话-一-时间线与记忆" tabindex="-1">23 | 多轮对话（一）：时间线与记忆 <a class="header-anchor" href="#_23-多轮对话-一-时间线与记忆" aria-label="Permalink to &quot;23 | 多轮对话（一）：时间线与记忆&quot;">​</a></h1><p>你好，我是月影。</p><p>接下来，我们就要正式进入复杂多轮对话的实现环节，这是 AI 应用里很复杂、很具有挑战的一部分。不过不要担心，跟住我的节奏，你就能掌握其中精髓。</p><p>在具体实现之前，我们要先定义一些概念。</p><ul><li><p>会话（session）：用来标记一轮面试，我们用同一个会话表示一个面试，相同会话的Agent（智能体）之间才能共享和交换数据。</p></li><li><p>记忆（memory）：用来记录之前的内容，根据前一节设计的 MoE 模型，我们会用一个Agent 来专门负责记忆。在真正的应用中，记忆是需要存储的，通常采用 redis、数据库等</p></li><li><p>方式进行存储。但为了同学们实操方便，在这里我们将它简化为存储在内存的对象中，不影响对基本原理的理解。</p></li><li><p>时间线（timeline)：这是一份配置，用来控制面试流程，它的每个节点包含起、止时间，和在该区间内的整体目标（objective）。在实际代码里，我们还会有一个控制器来操纵时间线，让 AI 有一定的自主权。你可能会想 AI 为什么要控制时间线，这个问题我先抛出来供你思考，我们后面深入讲解的时候再解释。</p></li><li><p>目的表（purpose table）：这也是一份配置表，用于思考的 Agent 根据时间线和记忆，参考目的表来筛选出当前轮次的目的，根据目的来生成一组具体的行动方针（actions），对话 Agent 会根据候选人的回答和行动方针，参考目的表来进行下一轮的提问。</p></li></ul><p>下面是一个典型的对话、分析和思考配合过程的示意图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%89%8D%E7%AB%AF%E6%99%BA%E8%83%BD%E4%BD%93%E5%BC%80%E5%8F%91/images/23/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%89%8D%E7%AB%AF%E6%99%BA%E8%83%BD%E4%BD%93%E5%BC%80%E5%8F%91/images/23/1.png" alt=""></a></p><p>根据上面的示意图，当 AI 询问“你能描述一下 JavaScript 的事件循环吗？”之后，等待候选人回答的期间，AI 将制定如下行动方针：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- 如果你觉得用户回答得很完美，那么你从purpose列表中选一个其他方向的问题</span></span>
<span class="line"><span>- 如果你觉得用户回答得还可以，但你想继续深入，那么你从purpose列表中选一个同方向的问题继续深入</span></span>
<span class="line"><span>- 如果你觉得……</span></span></code></pre></div><p>这里需要强调的是，就是整体 Agent 协同的过程是一个异步过程。仔细看上面的图，当 AI 询问一个问题时，候选人开始回答，同时 AI 开始准备下一步的策略，生成行动方针。注意行动方针并不考虑候选人实际是如何回答的，而是将候选人任何一种回答的可能性都考虑进去，并针对该可能性制定计划（即行动方针）。正是这样的诀窍，大大提升了面试流程的思考和对话并行能力，极大提高了面试流程的实时性。</p><h2 id="时间线-timeline" tabindex="-1">时间线（Timeline） <a class="header-anchor" href="#时间线-timeline" aria-label="Permalink to &quot;时间线（Timeline）&quot;">​</a></h2><p>前面已经提到过，面试整体要遵循一定的节奏，所以我们可以通过配置时间线，来让 AI 针对不同的时间点思考不同的面试对策。这一点和真正的面试官是一样的，我们在真实的面试中，面试官也会考虑如何安排整体时间，从而把握整个面试节奏。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">在</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Server</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 端，时间线是一份配置文件，我们创建</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  timeline.config.ts</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ，内容如下：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/*</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 定义面试过程的时间线</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 0~3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 自我介绍</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 3~10</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 项目讨论</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 10~17</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 技术讨论</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 17～25</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 代码和算法讨论</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 25~30</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 非技术问题讨论</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 30~32</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 反问</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 32</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分钟以上</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 结束</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">interface</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TimelineStep</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> startTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> endTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> focus:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 聚焦的问题，例如项目、技术、代码、算法、非技术问题</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> prompt:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 提示语</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">interface</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TimelineConfig</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> steps:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TimelineStep[]</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const timelineConfig: TimelineConfig = {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> steps:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     startTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     endTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 3,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     focus:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;自我介绍&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     prompt:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当前在自我介绍阶段，你要求候选人提供简历或者自我介绍，简历和介绍内容包括：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">1.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 个人信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">2.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 教育背景</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">3.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 工作经历</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">4.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 项目经历</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">5.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 擅长的技术</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">6.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 自我评价</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">你首先根据</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&lt;​memory&gt;的信息，判断候选人是否完成了介绍，如果没有完成，你询问并收集候选人缺失的信息，</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }, {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     startTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 3,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     endTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 10,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     focus:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;项目讨论&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     prompt:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当前在项目讨论阶段，你要求候选人讨论他/她在项目中的表现。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">你首先根据</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&lt;​memory&gt;的信息，回顾 interviewSummary，针对你感兴趣的项目经历或技术细节，深入询问候</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }, {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     startTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 10,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     endTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 17,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     focus:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;技术讨论&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     prompt:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当前在技术讨论阶段，你要求候选人讨论他/她在技术方面的表现。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">如果你之前在和候选人讨论TA过往项目，你可以收尾，然后开始讨论前端工程师的技术栈和基础知识。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">首先根据候选人应聘的岗位描述，判断对前端技术的总体要求，并结合</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&lt;​memory&gt;的信息，针对你感兴趣的技术</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">注意整体节奏遵循先JS（包括Node.js如果岗位要求或候选人简历提到的话）、再CSS/HTML、然后是框架和库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">你通过</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&lt;​memory&gt;中的askedQuestions回溯之前的问题，以把控整体节奏。</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">     \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }, {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     startTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 17,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     endTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 25,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     focus:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;代码和算法讨论&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     prompt:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当前在代码和算法讨论阶段，你要求候选人讨论他/她在代码和算法方面的表现。</span></span></code></pre></div><ul><li>如果你之前在和候选人讨论前端技术栈和基础知识，你可以收尾，然后开始讨论代码问题和算法题。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>首先根据候选人应聘的岗位描述，判断对代码和算法的总体要求，并结合&lt;​memory&gt;的信息，针对你感兴趣的代</span></span></code></pre></div><ul><li>整体节奏上你先出一道简单的代码题，让候选人说出代码运行结果，然后你再出一道算法题，让候选人说出算法</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你通过&lt;​memory&gt;中的askedQuestions回溯之前的问题，以把控整体节奏。</span></span>
<span class="line"><span>\`</span></span>
<span class="line"><span>   }, {</span></span>
<span class="line"><span>     startTime: 25,</span></span>
<span class="line"><span>     endTime: 30,</span></span>
<span class="line"><span>     focus: &#39;非技术问题讨论&#39;,</span></span>
<span class="line"><span>     prompt: \`当前在非技术问题讨论阶段，你要求候选人讨论他/她在软素质方面的表现。</span></span></code></pre></div><ul><li>如果你之前在和候选人讨论代码和算法，你可以收尾，然后开始讨论非技术问题。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>首先根据候选人应聘的岗位描述，判断对软素质的总体要求，并结合&lt;​memory&gt;的信息，针对你感兴趣的软素质</span></span></code></pre></div><ul><li>整体节奏上你按照价值观、团队沟通协作、项目管理、时间管理、学习能力、沟通表达能力、解决问题能力、自</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你通过&lt;​memory&gt;中的askedQuestions回溯之前的问题，以把控整体节奏。</span></span>
<span class="line"><span>\`</span></span>
<span class="line"><span>   }, {</span></span>
<span class="line"><span>     startTime: 30,</span></span>
<span class="line"><span>     endTime: 32,</span></span>
<span class="line"><span>     focus: &#39;反问&#39;,</span></span>
<span class="line"><span>     prompt: \`当前在反问阶段，你要求候选人反问面试官，补充判断候选人对岗位是否有兴趣。</span></span></code></pre></div><ul><li>候选人提问后，你进行回答，如果候选人说没有问题了，你可以结束面试。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`</span></span>
<span class="line"><span>   }, {</span></span>
<span class="line"><span>     startTime: 32,</span></span>
<span class="line"><span>     endTime: Infinity,</span></span>
<span class="line"><span>     focus: &#39;结束&#39;,</span></span>
<span class="line"><span>     prompt: \`当前在结束阶段，你礼貌地与候选人沟通，结束面试。\`</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> ]</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在这里，我们适当缩减了面试整体时间，将面试节奏把控在大约 35 分钟之内，这是为了体验和测试方便。在真实产品中，我们可以根据需要调整时间节奏，延长面试的总体时间。</p><p>我们先看一下上面的代码，TimelineConfig 是一份配置数据，它的 steps 是一个 TimelineStep数组，数组中每一个元素表示当前时间下的面试阶段配置，它由以下属性构成：</p><ul><li><p>startTime 当前阶段开始时间，以分钟为单位</p></li><li><p>endTime 当前阶段结束时间，以分钟为单位</p></li><li><p>focus 当前面试阶段聚焦的问题</p></li><li><p>prompt 当前面试阶段的主要策略提示词</p></li></ul><p>在实际使用的时候，我们将根据前端传入的时间参数来控制当前具体的阶段。当然，这是一种简易的办法，根据产品特点的不同，还有其他决定时间的方式。</p><p>因为我们的产品主要卖点是模拟面试，所以可以采用简单的方式，不用担心用户自己更改了传入的参数，而如果产品最终的用途是替代真正的面试官完成真实面试，那么考虑到安全性，可能我们就要用服务端的时间来计算具体的 Timeline 阶段了。</p><p>配套地，在前端我们通过实现一个 UI 组件来展示 Timeline。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">我们封装一个 Vue 组件。首先创建  src/components/Timeline.vue ，内容如下：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { ref, defineProps, defineEmits, watch, onBeforeUnmount } from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const props = defineProps&lt;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> currentTime: number;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> totalDuration: number;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> started: boolean;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const emit = defineEmits([&#39;updateTime&#39;]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const timePoints = ref&lt;​number[]&gt;([]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const startTime = ref&lt;​number&gt;(0);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const intervalId = ref&lt;​number | null&gt;(null);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 生成时间点数组，从0到总时长，每5分钟一个刻度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">for (let i = 0; i &lt;= props.totalDuration; i += 5) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> timePoints.value.push(i);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 监听started状态变化</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">watch(() =&gt; props.started, (newValue) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (newValue </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> !intervalId.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   // 记录开始时间</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   startTime.value = Date.now();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   // 启动计时器，每秒更新一次时间</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   intervalId.value = window.setInterval(() =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     const elapsedMinutes = (Date.now() - startTime.value) / 60000;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     // 确保不超过总时长</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     const newTime = Math.min(elapsedMinutes, props.totalDuration);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     if (newTime !== props.currentTime) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       emit(&#39;updateTime&#39;, newTime);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }, 1000);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 组件卸载时清除计时器</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">onBeforeUnmount(() =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (intervalId.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   clearInterval(intervalId.value);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​div class=&quot;timeline-container&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div class=&quot;timeline&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​div</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       v-for=&quot;time in timePoints&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :key=&quot;time&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       class=&quot;time-point&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :class=&quot;{ active: time === currentTime }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;time-marker&quot;&gt;&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;time-label&quot;&gt;{​{ time }​}分钟&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​div</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       class=&quot;current-time-indicator&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :class=&quot;{ active: intervalId != null }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :style=&quot;{ top: \`\${(currentTime / totalDuration) * 100}%\` }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​style scoped&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.timeline-container {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> width: 160px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> padding: 20px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> display: flex;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> justify-content: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> box-sizing: border-box;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.timeline {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position: relative;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> width: 2px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background-color: #ddd;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> display: flex;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> flex-direction: column;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> justify-content: space-between;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.time-point {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position: relative;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cursor: pointer;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> display: flex;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> align-items: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.time-marker {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> width: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 2px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background-color: #ddd;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position: absolute;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> left: 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.time-label {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position: absolute;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> left: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> font-size: 12px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> color: #666;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> white-space: nowrap;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.time-point.active .time-marker {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background-color: #646cff;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.time-point.active .time-label {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> color: #646cff;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> font-weight: bold;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.current-time-indicator {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position: absolute;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> width: 12px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 12px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> border-radius: 50%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background-color: brown;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> left: -5px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> transform: translateY(-50%);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.current-time-indicator.active {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background-color: #646cff;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/style&gt;</span></span></code></pre></div><p>在上面的代码中，我们创建了一个 Timeline 的 UI，它通过开关控制是否开启计时，具体实现上是用 watch 方法监听 props.started 状态。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 监听started状态变化</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">watch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> props.started, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">newValue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (newValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;&amp;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> !</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">intervalId.value) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 记录开始时间</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   startTime.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Date.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 启动计时器，每秒更新一次时间</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   intervalId.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> window.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setInterval</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> elapsedMinutes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Date.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> startTime.value) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 60000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     // 确保不超过总时长</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> newTime</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Math.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">min</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(elapsedMinutes, props.totalDuration);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (newTime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> props.currentTime) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">       emit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;updateTime&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, newTime);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><p>当计时开启后，Timeline 会启动计时器，即通过 window.setInterval 定时器动态更新时间，并且通过 updateTime 方法将更新的时间发给父级组件，这样父级组件调用 AI 对话的时候，就可以将具体的时间参数传给 Server 端。</p><p>在 UI 方面，通过更新元素的样式来控制小圆点在时间轴中的位置：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​div</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   class=&quot;current-time-indicator&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :class=&quot;{ active: intervalId != null }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :style=&quot;{ top: \`\${(currentTime / totalDuration) * 100}%\` }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &gt;&lt;​/div&gt;</span></span></code></pre></div><p>最终的 UI 效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%89%8D%E7%AB%AF%E6%99%BA%E8%83%BD%E4%BD%93%E5%BC%80%E5%8F%91/images/23/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%89%8D%E7%AB%AF%E6%99%BA%E8%83%BD%E4%BD%93%E5%BC%80%E5%8F%91/images/23/2.png" alt=""></a></p><p>图里面的动态效果展示得不太明显，但是你可以看到随着候选人发送消息后，面试正式开始，左侧时间轴的蓝色小圆点就开始缓慢向下移动了。</p><p>这个页面的其他部分功能还没有实现，所以我发送消息后，AI 并没有回复，我们先不用管它，在后续章节里，我们再逐步完善，到时候也会详细讲解右侧这一部分的前端逻辑和实现。</p><h2 id="记忆-memory" tabindex="-1">记忆（memory） <a class="header-anchor" href="#记忆-memory" aria-label="Permalink to &quot;记忆（memory）&quot;">​</a></h2><p>现在我们先回过头来看一下记忆（memory）模块。</p><p>在 AI 智能体和应用的设计中，记忆（memory）是一个非常重要的特性，因为我们很多时候必须让 AI 能够记住之前发生的事情，从而进行下一步的动作。就拿面试官应用来说，如果 AI 没有记忆，那它就很可能问重复的问题，这就和真实的面试过程不符了。</p><p>一般来说，记忆又分为长期记忆和短期记忆。通常情况下，短期记忆是通过聊天上下文，由大模型自己管理的；而长期记忆，则是通过记录和整理文本（知识库）、向量数据库等方式实现，对于不同的应用，有不同的要求。</p><p>对我们的产品而言，如果不考虑多轮面试，那么最重要的还是短期记忆。不过我们不能依靠默认的聊天上下文，这是因为，面试过程比较长，对话上下文比较复杂，而且面试有比较严格的流程，只依赖单纯的聊天上下文，是达不到效果的。</p><p>所以我们用另外一种短期记忆的方式，即结构化短期记忆。</p><p>其实结构化短期记忆的实现非常简单，也就是我们不是简单记录聊天上下文，在下一次对话时提交之前的聊天记录，而是用一个负责记忆的智能体，来整理记录每轮聊天之后的内容，将其记录为 JSON 数据，这对应了我们前面说的 MoE 结构中信息分析记录的部分。</p><p>在这一节里，我们先不说它的具体逻辑实现，只定义它的数据结构。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">我们将</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Memory</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 定义如下，首先创建</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  lib/service/memory.ts</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ，内容如下。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> interface InterviewMemory {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> sessionId:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> conversationIndex:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> number,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 当前记忆的对话轮次，因为是异步更新的，需要用这个来匹配对话</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lastConversation:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 上一轮对话内容</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 候选人的基本信息和自我介绍</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> candidateIntroduction:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 面试官已经问过的问题（按顺序记录）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> askedQuestions:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string[]</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 对候选人各项能力的评价</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> candidateEvaluation:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   technicalSkills:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;       </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 技术能力评价</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   problemSolving:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;        </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 问题解决能力</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   communication:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;         </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 沟通表达能力</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   codingStyle?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;          </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 可选：编码风格或代码质量</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   overallImpression:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;     </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 总体印象</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> };</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 面试摘要：总结整个过程，比如面试重点、表现亮点或不足</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> interviewSummary:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 特别备注：如迟到、网络问题、态度问题、需进一步确认的信息等</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> additionalNotes:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string[]</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lastUpdateTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> function createInterviewMemory(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sessionId:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): InterviewMemory {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   sessionId,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   conversationIndex:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   lastConversation:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   candidateIntroduction:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   askedQuestions:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [],</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   candidateEvaluation:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     technicalSkills:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     problemSolving:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     communication:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     codingStyle:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     overallImpression:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   interviewSummary:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   additionalNotes:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [],</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   lastUpdateTime:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Date.now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>根据上面的代码，我们记忆的数据格式如下。</p><ul><li><p>sessionId：会话 ID，在一场面试中唯一，同样的会话 ID 将同一场面试中的对话、记忆和思考关联起来。</p></li><li><p>conversationIndex：对话轮次，多轮对话中我们会异步更新记忆，所以当前记忆已经更新到第几轮对话了，需要记录下来，这样我们才能匹配记忆的“版本”，具体内容在后续章节中会详细说明。</p></li><li><p>lastCoversation：上一轮对话内容，我们记录下较少的历史聊天上下文，因为有了 memory不需要记录太多轮。</p></li><li><p>candidateInstruction：候选人介绍，在自我介绍和项目讨论阶段主要更新这部分记忆。</p></li><li><p>askedQuestions：已经问过的问题，这个列表很重要，AI 要记住问过的问题，以免重复询问。</p></li><li><p>candidateEvaluation：候选人评价，通过几个维度对候选人做出评价，在每一轮面试中分析智能体会根据评价制定后续提问策略，面试结束后，负责给出评价的智能体也需要根据这部分内容给出最终的评价。</p></li><li><p>interviewSummary：面试摘要，每轮面试对话后都会更新摘要，记录面试过程里比较重要的信息。</p></li><li><p>additionalNotes；特别备注，面试过程中需要额外留意的信息，面试官的自我提醒。</p></li><li><p>lastUpdateTime：记忆最后更新时间。</p></li></ul><p>以上就是整体的记忆表，在每一轮对话后，负责记录的智能体就会将需要更新的信息更新到该表中，智能体提问前，也会通过将记忆信息放入系统提示词中，控制下一轮的询问。</p><p>具体详细的流程我们后续的章节中会一一展开细说。</p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这一节里，我们具体了解了时间线（Timeline）和记忆（Memory）的概念定义和数据结构，它们是后续实现核心工作流的重要对象。</p><p>另外，我们还实现了时间线的前端 UI 组件。下一节课，我们还会继续探索，看看如何用时间线搭配记忆，来实现节奏合理的高质量面试对话。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><p>这节课虽然没有涉及 UI 核心功能，但对于前端工程师来说，交互体验也特别重要。</p><p>时间线 UI 组件还有些细节值得优化，你可以考虑在它之上加入一些小功能，比如鼠标移动到时间线小圆点上时，具体显示对应的时间，以及对时间线上某个时间点设置一个倒计时，这样就可以在面试中候选人需要较长时间的思考时提醒对方（比如写代码环节里，设置一个 10 分钟的提醒）。</p><p>你可以动手试试看，将你的改进分享到评论区。</p>`,59)])])}const F=i(p,[["render",t]]);export{g as __pageData,F as default};
