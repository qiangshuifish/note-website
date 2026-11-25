import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"05 | 数据结构（下）：如何设计页面业务问题相关的数据结构？","description":"","frontmatter":{},"headers":[{"level":2,"title":"异常信息类型","slug":"异常信息类型","link":"#异常信息类型","children":[{"level":3,"title":"通用数据字段","slug":"通用数据字段","link":"#通用数据字段","children":[]},{"level":3,"title":"代码异常类型","slug":"代码异常类型","link":"#代码异常类型","children":[]},{"level":3,"title":"网络请求类型","slug":"网络请求类型","link":"#网络请求类型","children":[]},{"level":3,"title":"其余类型字段（Promise、资源、自定义、PV/UV）","slug":"其余类型字段-promise、资源、自定义、pv-uv","link":"#其余类型字段-promise、资源、自定义、pv-uv","children":[]}]},{"level":2,"title":"网页指标类型","slug":"网页指标类型","link":"#网页指标类型","children":[]},{"level":2,"title":"操作行为类型","slug":"操作行为类型","link":"#操作行为类型","children":[]},{"level":2,"title":"整合一份完整的链路日志","slug":"整合一份完整的链路日志","link":"#整合一份完整的链路日志","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"前端全链路优化实战课/05｜数据结构（下）：如何设计页面业务问题相关的数据结构？.md","filePath":"前端全链路优化实战课/05｜数据结构（下）：如何设计页面业务问题相关的数据结构？.md","lastUpdated":1795541984000}'),i={name:"前端全链路优化实战课/05｜数据结构（下）：如何设计页面业务问题相关的数据结构？.md"};function l(t,s,c,r,o,h){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_05-数据结构-下-如何设计页面业务问题相关的数据结构" tabindex="-1">05 | 数据结构（下）：如何设计页面业务问题相关的数据结构？ <a class="header-anchor" href="#_05-数据结构-下-如何设计页面业务问题相关的数据结构" aria-label="Permalink to &quot;05 | 数据结构（下）：如何设计页面业务问题相关的数据结构？&quot;">​</a></h1><p>你好，我是三桥。</p><p>上节课，我们重点学习了如何根据最少字段的原则设计链路日志格式的 17 个通用字段。</p><p>然而，这些字段并不包含问题信息。假如我们希望提前发现问题，又该怎么把问题涉及的信息提前存储在链路日志里面呢？这节课，我们一起设计记录问题的字段方案。</p><p>我从代码维度把日志分成了异常信息、性能数据、操作行为三套数据模型，如下图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/05/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/05/1.png" alt=""></a></p><p>基于这三套数据模型，我们分别用 data 字段记录异常信息、perf 字段记录页面性能信息以及breadcrumbs 字段记录用户操作行为。参考代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 完整的全链路日志</span></span>
<span class="line"><span>type TraceData = BaseTraceInfo &amp; {</span></span>
<span class="line"><span> // 记录错误信息</span></span>
<span class="line"><span> data?: TraceTypeData</span></span>
<span class="line"><span> // 记录操作行为</span></span>
<span class="line"><span> breadcrumbs?: TraceBreadcrumbs</span></span>
<span class="line"><span> // 记录性能信息</span></span>
<span class="line"><span> perf?: TracePerf[]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于这三个字段的用法，我会在本节课的最后跟大家探讨。我们先从异常信息类型说起。</p><h2 id="异常信息类型" tabindex="-1">异常信息类型 <a class="header-anchor" href="#异常信息类型" aria-label="Permalink to &quot;异常信息类型&quot;">​</a></h2><p>虽然前端异常情况有很多，但总结下来，实际主要就是 6 种情况。</p><ol><li><p>代码异常。不仅包括脚本失败，还应该包含 trycatch 中的 catch 异常。</p></li><li><p>Promise 异常。这主要是由异步代码引起的逻辑问题。</p></li><li><p>网络请求。通常来说，发起 http 请求都无法保证 100% 的成功率。</p></li><li><p>资源异常信息。和网络请求同理，但这里的重点在于监控图片和一些外部资源的请求状态。</p></li><li><p>PV/UV 日志。用于记录用户访问的次数和频率，它也是唯一的非异常日志。</p></li><li><p>自定义日志。目的是在一些特殊场景下记录日志，以便快速定位问题。</p></li></ol><p>我们仍然以最少字段为原则，通过抽象化的方法，将通用数据字段和特殊字段组合，设计这 6种场景。</p><p>最后得出下面的字段设计图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/05/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/05/2.png" alt=""></a></p><h3 id="通用数据字段" tabindex="-1">通用数据字段 <a class="header-anchor" href="#通用数据字段" aria-label="Permalink to &quot;通用数据字段&quot;">​</a></h3><p>要成为一名合格的前端工程师，其中一项重要的能力是抽象思维。对于异常信息，我们需要进行抽象化处理。数据的抽象化通常包括一些最常见且最关键的字段属性，如标识、名称、信息、时间。</p><p>还是遵循最少字段设计原则，我们看一下已经设计好的抽象结构代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type TraceBaseData = {</span></span>
<span class="line"><span> // id</span></span>
<span class="line"><span> dataId: number</span></span>
<span class="line"><span> // 日志信息名称</span></span>
<span class="line"><span> name: string</span></span>
<span class="line"><span> // 问题级别</span></span>
<span class="line"><span> level: TraceDataSeverity</span></span>
<span class="line"><span> // 异常信息</span></span>
<span class="line"><span> message: string</span></span>
<span class="line"><span> // 发生时间</span></span>
<span class="line"><span> time: number</span></span>
<span class="line"><span> // 问题类型</span></span>
<span class="line"><span> type: TraceDataTypes</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过最少字段原则的设计，我们可以看到有 6 个字段。先说其中的 4 个，dataId、name、message 以及 time。</p><ul><li><p>dataId。这个字段不是指唯一键值，而是对异常信息进行哈希后得出的字符串。如果有大量相同字符串，那就说明存在通用异常问题。</p></li><li><p>name。这是为异常日志提供的一个名称字段。</p></li><li><p>message。这个字段的核心作用是记录异常信息的详情或者描述。</p></li><li><p>time。顾名思义，就是时间。指事件触发的时刻。</p></li></ul><p>这 4 个字段比较好理解，我着重说另外两个，问题级别 level 以及问题类型 type。</p><p>问题级别定义的是一条异常日志的严重程度。比如，在前端代码请求接口后，如果结果返回的状态码为 400 或 500，我们可以将该问题级别定义为高危或极其严重，如果频繁出现这种结果，那就说明用户已经无法使用功能，但我们可以在前端链路里提前发现。</p><p>可能有同学会想了，上一节也有提到 level 字段了，那这里的问题级别 level 和它有什么区别呢？实际上，这两者是不同维度的级别。基础数据的 level 是以日志完整维度划分的级别，而这里的 level 是以问题维度划分的级别。也就是说，在监控中，我们可以通过设置两个 level维度级别选择性地监控。</p><p>为了尽可能覆盖更多的问题级别，我们给 level 字段定义了 8 种级别，也就是TraceDataSeverity 枚举类型代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>declare enum TraceDataSeverity {</span></span>
<span class="line"><span> // 其他</span></span>
<span class="line"><span> Else = &#39;else&#39;,</span></span>
<span class="line"><span> // 错误级别</span></span>
<span class="line"><span> Error = &#39;error&#39;,</span></span>
<span class="line"><span> // 告警级别</span></span>
<span class="line"><span> Warning = &#39;warning&#39;,</span></span>
<span class="line"><span> // 日志级别</span></span>
<span class="line"><span> Info = &#39;info&#39;,</span></span>
<span class="line"><span> // 调试级别</span></span>
<span class="line"><span> Debug = &#39;debug&#39;,</span></span>
<span class="line"><span> // 低危级别</span></span>
<span class="line"><span> Low = &#39;low&#39;,</span></span>
<span class="line"><span> // 普通级别</span></span>
<span class="line"><span> Normal = &#39;normal&#39;,</span></span>
<span class="line"><span> // 高危级别</span></span>
<span class="line"><span> High = &#39;high&#39;,</span></span>
<span class="line"><span> // 极其严重</span></span>
<span class="line"><span> Critical = &#39;critical&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>特别强调的是，High 和 Critical 属于最高级别。出现这类日志的时候，前端同学需要立即关注，并且分析是否存在线上故障。</p><p>再说说另一个字段 type，它描述的是错误日志类型。这个类型里我一共定义了 10 种枚举值。</p><p>其中，6 种枚举值分别对应的是前端脚本类型 JAVASCRIPT、请求类型 HTTP、资源RESOURCE、路由 ROUTE、性能 PERF、调试 LOG。</p><p>其中，Promise 是我们经常用来实现大量的业务逻辑的。而基于异步的特性，我们可以在捕获异常的时候使用 PROMISE。UNKNOW 则用于一些未知异常的捕获。此外，我们还额外定义了两个枚举值 Vue 和 React，方便前端组件代码在异常时标记对应的技术栈。</p><p>最后，我们使用 TraceDataTypes 枚举名字定义类型。参考如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>declare enum TraceDataTypes {</span></span>
<span class="line"><span> UNKNOWN = &#39;UNKNOWN&#39;,</span></span>
<span class="line"><span> JAVASCRIPT = &#39;JAVASCRIPT&#39;,</span></span>
<span class="line"><span> LOG = &#39;LOG&#39;,</span></span>
<span class="line"><span> HTTP = &#39;HTTP&#39;,</span></span>
<span class="line"><span> VUE = &#39;VUE&#39;,</span></span>
<span class="line"><span> REACT = &#39;REACT&#39;,</span></span>
<span class="line"><span> RESOURCE = &#39;RESOURCE&#39;,</span></span>
<span class="line"><span> PROMISE = &#39;PROMISE&#39;,</span></span>
<span class="line"><span> ROUTE = &#39;ROUTE&#39;,</span></span>
<span class="line"><span> PERF = &#39;PERF&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="代码异常类型" tabindex="-1">代码异常类型 <a class="header-anchor" href="#代码异常类型" aria-label="Permalink to &quot;代码异常类型&quot;">​</a></h3><p>有了通用的抽象数据模型后，再定义上层数据模型。先来看看代码异常类型。</p><p>咱们都知道，当前端代码异常报错时会抛出异常，控制台也会输出堆栈信息。堆栈信息是我们前端同学分析代码位置、快速发现问题的主要信息来源。所以，代码异常类型还需要扩展一个记录堆栈信息的字段，stack。</p><p>好了，现在我们得到了获取代码异常信息的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码异常错误信息</span></span>
<span class="line"><span>type TractDataCodeError = TraceBaseData &amp; {</span></span>
<span class="line"><span> stack: []</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="网络请求类型" tabindex="-1">网络请求类型 <a class="header-anchor" href="#网络请求类型" aria-label="Permalink to &quot;网络请求类型&quot;">​</a></h3><p>网络请求类型的作用是追踪前端向后端接口发起请求的状态。相对于脚本错误类型，它需要更多扩展字段，但考虑到最少字段原则，我们仅设计出必要的 6 个字段就可以了，包括接口地址、请求方法、请求参数、响应状态、执行耗时、脚本请求类型。</p><p>最终，我们得到网络请求类型的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 请求类信息</span></span>
<span class="line"><span>type TraceDataFetch = TraceBaseData &amp; {</span></span>
<span class="line"><span> // 执行时间，用于统计耗时</span></span>
<span class="line"><span> elapsedTime: number</span></span>
<span class="line"><span> // 请求方法</span></span>
<span class="line"><span> method: &#39;POST&#39; | &#39;GET&#39;</span></span>
<span class="line"><span> // 请求类型</span></span>
<span class="line"><span> httpType: &#39;fetch&#39; | &#39;xhr&#39;</span></span>
<span class="line"><span> // 请求地址</span></span>
<span class="line"><span> url: string</span></span>
<span class="line"><span> // 请求参数</span></span>
<span class="line"><span> body: string</span></span>
<span class="line"><span> // 响应状态</span></span>
<span class="line"><span> status: number</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="其余类型字段-promise、资源、自定义、pv-uv" tabindex="-1">其余类型字段（Promise、资源、自定义、PV/UV） <a class="header-anchor" href="#其余类型字段-promise、资源、自定义、pv-uv" aria-label="Permalink to &quot;其余类型字段（Promise、资源、自定义、PV/UV）&quot;">​</a></h3><p>剩余的其它数据类型，包括 Promise 类型、资源类型以及自定义日志类型。</p><p>由于公共字段已经满足全链路概念的能力，所以，基于最少字段原则，对于 Promise 和Resource，我不会再扩展过多的字段。</p><p>至于自定义日志类型，我会增加一个 tag 字段作为对上层业务内容的补充，既可以当成标签使用，也可以当作一段需要标记的字符串。还有 PV/UV 统计类日志，也只补充一个用于 SPA 的静态路由字段，记录用户当前所在的页面。</p><p>这些类型字段的设计，我们都会定义新的命名作为类型名称，之后在代码中定义数据变量的时候也会更方便。</p><p>参考代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Promise类型</span></span>
<span class="line"><span>type TraceDataPromise = TraceBaseData</span></span>
<span class="line"><span>// 资源类型</span></span>
<span class="line"><span>type TraceDataResource = TraceBaseData</span></span>
<span class="line"><span>// 普通日志</span></span>
<span class="line"><span>type TraceDataLog = TraceBaseData &amp; {</span></span>
<span class="line"><span> tag: string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// PV/UV</span></span>
<span class="line"><span>type TraceDataPageView = TraceBaseData &amp; {</span></span>
<span class="line"><span> route: string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，在真实项目中，如果有非常重要的字段能协助定位问题，也是可以扩展的。记得不要盲目增加、过度增加就好。</p><h2 id="网页指标类型" tabindex="-1">网页指标类型 <a class="header-anchor" href="#网页指标类型" aria-label="Permalink to &quot;网页指标类型&quot;">​</a></h2><p>学习完异常信息类型的定义后，接下来我们来学习下如何记录页面性能数据。</p><p>相信很多前端同学听到收集页面性能数据，就会联想到 Performance 对象。不过我并不推荐使用 Performance，这里我会使用 WebVitals 来评估页面性能。关于为何选择 WebVitals，我会在后面的小课中详细讲解。</p><p>由于我们用到 WebVitals 网页指标，设计字段的时候就需要参考 WebVitals 提供的能力，例如指标值、指标衡量等字段。最后我们设计了出 6 个指标、12 个属性值的数据模型，参考如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// webVitals性能收集信息对象</span></span>
<span class="line"><span>type TracePerf = {</span></span>
<span class="line"><span> id: string</span></span>
<span class="line"><span> LCP?: number</span></span>
<span class="line"><span> LCPRating?: TracePerfRating</span></span>
<span class="line"><span> FID?: number</span></span>
<span class="line"><span> FIDRating?: TracePerfRating</span></span>
<span class="line"><span> FCP?: number</span></span>
<span class="line"><span> FCPRating?: TracePerfRating</span></span>
<span class="line"><span> TTFB?: number</span></span>
<span class="line"><span> TTFBRating?: TracePerfRating</span></span>
<span class="line"><span> CLS?: number</span></span>
<span class="line"><span> CLSRating?: TracePerfRating</span></span>
<span class="line"><span> INP?: number</span></span>
<span class="line"><span> INPRating?: TracePerfRating</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>设计 12 个指标属性的目的，是为了更清晰地知道每个指标值的实际情况，不用做二次处理，就能直接在监控和通知上使用。</p><p>另外，由于这 6 个网页指标的计算时机存在差异，不可能在同一时刻获取，所以我把 12 个指标属性定义为非必选项属性。</p><h2 id="操作行为类型" tabindex="-1">操作行为类型 <a class="header-anchor" href="#操作行为类型" aria-label="Permalink to &quot;操作行为类型&quot;">​</a></h2><p>最后我们探讨一下用户的操作行为类型。在真实项目中，行为数据的记录通常都是自动化的，比如用户点击一次按钮，程序就会自动识别用户的点击操作，把相应的行为数据记录下来。</p><p>先来看下如何定义操作行为的类型。一共有 5 个属性字段，参考代码如下。</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 基类行为日志类型</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TraceBaseAction</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 动作名称</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> name:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 动作参数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> level:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TraceDataSeverity</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 动作时间</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time: string</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 日志类型</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> type</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> BreadcrumbTypes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 行为分类</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> category:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> BreadcrumbsCategorys</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 行为日志</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TraceAction</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TraceBaseAction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp; {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 行为动作相关的信息，可以是DOM，可以是错误信息，可以是自定义信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> message?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 请求参数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> request?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> any</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 请求结果内容</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> response?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> any</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 错误堆栈信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> stack?:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> string</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>其中 level 字段跟 TraceBaseData 类型的 level 字段一样，因为它们都是定义问题严重性的，而且两个字段是同步的。</p><p>另外，type 和 category 看着很像，实际上是有区别的。</p><p>type 字段定义了 TraceBreadcrumbTypes 枚举类型，它和 TraceDataTypes 枚举类型很接近，但不完全相同，比如 TraceDataTypes 枚举则包含有 PERF 值和 LOG 值，而 category 字段主要定义行为日志的类别，比如用户点击、请求、日志输出、组件生命周期等。</p><p>所以，type 的定位是异常信息的类别，category 则是行为日志类别，两者是不相同的。</p><p>这两个枚举类型的代码定义如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>declare enum BreadcrumbsCategorys {</span></span>
<span class="line"><span> Http = &#39;http&#39;,</span></span>
<span class="line"><span> User = &#39;user&#39;,</span></span>
<span class="line"><span> Debug = &#39;debug&#39;,</span></span>
<span class="line"><span> Exception = &#39;exception&#39;,</span></span>
<span class="line"><span> Lifecycle = &#39;lifecycle&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>declare enum BreadcrumbTypes {</span></span>
<span class="line"><span> ROUTE = &#39;Route&#39;,</span></span>
<span class="line"><span> CLICK = &#39;UI.Click&#39;,</span></span>
<span class="line"><span> CONSOLE = &#39;Console&#39;,</span></span>
<span class="line"><span> FETCH = &#39;Fetch&#39;,</span></span>
<span class="line"><span> UNHANDLEDREJECTION = &#39;Unhandledrejection&#39;,</span></span>
<span class="line"><span> RESOURCE = &#39;Resource&#39;,</span></span>
<span class="line"><span> CODE_ERROR = &#39;Code Error&#39;,</span></span>
<span class="line"><span> CUSTOMER = &#39;Customer&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="整合一份完整的链路日志" tabindex="-1">整合一份完整的链路日志 <a class="header-anchor" href="#整合一份完整的链路日志" aria-label="Permalink to &quot;整合一份完整的链路日志&quot;">​</a></h2><p>至此，我们探讨完了最常见的异常信息数据类型。那我们应该如何把这节课记录的问题信息和上节课的基础数据结构整合在一起，形成一份完整的链路日志呢？</p><p>首先，为了确保两者之间的字段命名不重复，我的方案是新增 data 字段来记录日志，让记录问题信息和基础数据字段不在同一层级，参考前面的 TraceData 类型代码定义。</p><p>其次，由于性能数据是通过对象的方式存储每个网页指标的，它不是一种异常或错误信息，因此也要新增 perf 字段。</p><p>最后，用户行为类型。它和记录问题信息、性能数据不同，是贯穿用户整个行为过程的一个快照。所以我们也扩展一个字段 breadcrumbs 记录行为信息。</p><p>最终，一份完整的链路日志类型就定义完毕，我们用 TraceData 命名，代码参考如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 一份错误信息的类型集合</span></span>
<span class="line"><span>type TraceTypeData = TraceDataFetch | TractDataCodeError | TraceDataPromise | Tra</span></span>
<span class="line"><span>// 操作行为日志</span></span>
<span class="line"><span>type TraceBreadcrumbs = TraceAction[]</span></span>
<span class="line"><span>// 完整的全链路日志</span></span>
<span class="line"><span>type TraceData = BaseTraceInfo &amp; {</span></span>
<span class="line"><span> // 记录错误信息</span></span>
<span class="line"><span> data?: TraceTypeData</span></span>
<span class="line"><span> // 记录操作行为</span></span>
<span class="line"><span> breadcrumbs?: TraceBreadcrumbs</span></span>
<span class="line"><span> // 记录性能信息</span></span>
<span class="line"><span> perf?: TracePerf[]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有一个问题，为什么 data、breadcrumbs 以及 perf 都是非必要字段呢？</p><p>你看，如果当前日志是记录性能的，那么 data 和 breadcrumbs 其实就没必要收集了，对不对？同样的，在正常情况下，如果有异常日志，perf 字段也没必要记录，因为关联意义不大。同时，有了 breadcrumbs 的设计，日志量会非常庞大，而从实际情况来看，只有需要定位问题的时候，我们才需要用户的上下文操作信息。所以，breadcrumbs 字段可以根据实际情况来设定是否需要上报到服务器端。</p><p>好了，现在我们以极客时间移动端 H5 请求一个接口作为例子，写一份请求正常状态的完整日志。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace data json</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> &quot;traceId&quot;: &quot;0bdf6c8e-25c8-427d-847a-9950318a2e14&quot;,</span></span>
<span class="line"><span> &quot;level&quot;: &quot;warn&quot;,</span></span>
<span class="line"><span> &quot;type&quot;: &quot;Action&quot;,</span></span>
<span class="line"><span> &quot;ua&quot;: &quot;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTM</span></span>
<span class="line"><span> &quot;bt&quot;: &quot;mobile&quot;,</span></span>
<span class="line"><span> &quot;fpId&quot;: &quot;c77a37f4&quot;,</span></span>
<span class="line"><span> &quot;uid&quot;: 1002,</span></span>
<span class="line"><span> &quot;appId&quot;: &quot;geekbang-h5&quot;,</span></span>
<span class="line"><span> &quot;clientType&quot;: &quot;browser&quot;,</span></span>
<span class="line"><span> &quot;pid&quot;: &quot;088c8a92-5a24-4144-9c37-310848c397e1&quot;,</span></span>
<span class="line"><span> &quot;url&quot;: &quot;https://time.geekbang.org/&quot;,</span></span>
<span class="line"><span> &quot;createdAt&quot;: &quot;2024-03-13T15:35:30.292Z&quot;,</span></span>
<span class="line"><span> &quot;updatedAt&quot;: &quot;2024-03-13T15:35:30.292Z&quot;,</span></span>
<span class="line"><span> &quot;data&quot;: {</span></span>
<span class="line"><span>   &quot;dataId&quot;: 2384780,</span></span>
<span class="line"><span>   &quot;name&quot;: &quot;fetch-api&quot;,</span></span>
<span class="line"><span>   &quot;level&quot;: &quot;info&quot;,</span></span>
<span class="line"><span>   &quot;message&quot;: &quot;success&quot;,</span></span>
<span class="line"><span>   &quot;time&quot;: 1710345961943,</span></span>
<span class="line"><span>   &quot;type&quot;: &quot;HTTP&quot;,</span></span>
<span class="line"><span>   &quot;elapsedTime&quot;: 166.34,</span></span>
<span class="line"><span>   &quot;method&quot;: &quot;POST&quot;,</span></span>
<span class="line"><span>   &quot;httpType&quot;: &quot;fetch&quot;,</span></span>
<span class="line"><span>   &quot;url&quot;: &quot;https://time.geekbang.org/serv/v3/product/infos&quot;,</span></span>
<span class="line"><span>   &quot;body&quot;: &quot;{\\&quot;ids\\&quot;:[100035801,100002401,100024001,100007001,100003901,10002960</span></span>
<span class="line"><span>   &quot;status&quot;: 0</span></span>
<span class="line"><span> },</span></span>
<span class="line"><span> &quot;breadcrumbs&quot;: [</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     &quot;name&quot;: &quot;fetch-api&quot;,</span></span>
<span class="line"><span>     &quot;level&quot;: &quot;info&quot;,</span></span>
<span class="line"><span>     &quot;time&quot;: &quot;string&quot;,</span></span>
<span class="line"><span>     &quot;type&quot;: &quot;Fetch&quot;,</span></span>
<span class="line"><span>     &quot;category&quot;: &quot;hhtp&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这份代码相当于拆解了一份完整链路日志。将通用基础数据结构、异常信息类型、操作行为类型、性能数据类型结合，我们可以整理成一套如下的链路日志关系图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/05/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/05/3.png" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我们进一步探讨了前端全链路日志中记录问题字段的设计。</p><p>需要强调的是，我们仍然是以最少字段为原则去设计的。从记录问题的维度考虑，我们可以把众多的信息字段分成三大类，异常信息类、网页指标类和操作行为类。</p><p>异常信息类型的主要作用是在程序代码异常的时候，把异常堆栈信息记录下来，然后提供给前端同学做分析。其中，代码异常和网络请求是我们最常见也是最重要的两种场景，是影响用户体验的核心问题，需要特别重视。</p><p>网页指标类型，是基于 WebVitals 的理论设计出的 6 个核心指标，由于考虑到每个页面指标的获取并不同步，所以，提前定义 12 个字段属性更合适。</p><p>除了记录异常和性能，用户的操作行为也非常重要。我们基于最少原则和行为特性，设计出了6 个字段，以保证能够还原出用户交互的一个快照，帮助我们快速了解用户的真实情况。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>此刻，我希望你能对自己的前端项目经验进行一些反思。在你所参与的前端项目中，最常遇到到的线上问题是关于哪一类业务的？在没有链路日志和监控的情况下，你又是如何通过埋点解决这些问题的呢？</p><p>欢迎你在留言区和我交流。如果觉得有所收获，也可以把课程分享给更多的朋友一起学习。我们下节课见！</p>`,88)])])}const k=a(i,[["render",l]]);export{d as __pageData,k as default};
