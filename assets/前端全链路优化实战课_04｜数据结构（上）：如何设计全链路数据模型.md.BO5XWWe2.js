import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"04 | 数据结构（上）：如何设计全链路数据模型","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何定义链路日志数据结构？","slug":"如何定义链路日志数据结构","link":"#如何定义链路日志数据结构","children":[{"level":3,"title":"基本日志信息","slug":"基本日志信息","link":"#基本日志信息","children":[]},{"level":3,"title":"浏览器信息","slug":"浏览器信息","link":"#浏览器信息","children":[]},{"level":3,"title":"页面信息","slug":"页面信息","link":"#页面信息","children":[]},{"level":3,"title":"用户信息","slug":"用户信息","link":"#用户信息","children":[]},{"level":3,"title":"业务信息","slug":"业务信息","link":"#业务信息","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"前端全链路优化实战课/04｜数据结构（上）：如何设计全链路数据模型.md","filePath":"前端全链路优化实战课/04｜数据结构（上）：如何设计全链路数据模型.md","lastUpdated":1795541984000}'),i={name:"前端全链路优化实战课/04｜数据结构（上）：如何设计全链路数据模型.md"};function l(t,s,c,r,h,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_04-数据结构-上-如何设计全链路数据模型" tabindex="-1">04 | 数据结构（上）：如何设计全链路数据模型 <a class="header-anchor" href="#_04-数据结构-上-如何设计全链路数据模型" aria-label="Permalink to &quot;04 | 数据结构（上）：如何设计全链路数据模型&quot;">​</a></h1><p>你好，我是三桥。</p><p>上节课，我简单介绍了前端全链路的 3 要素和 14 条路径。在 14 条路径里面，数据指标占了一大部分，一共有 7 种不同大类的指标类型数据。那这些指标类型要怎么用起来呢？</p><p>想想咱们工作的时候，有些前端同学会觉得，要做到快速发现问题和定位问题非常困难，而且需要大量的日志记录每段代码的异常。虽然大量的记录能帮忙解决问题，但也增加了服务器成本。</p><p>我认为，要高效解决问题，就不要只关注日志的成本，相反地，我们应该设计一套更优的字段来解决日志量大和存储量多的问题。</p><p>设计的思路，我把它称为“最少字段原则”。</p><h2 id="如何定义链路日志数据结构" tabindex="-1">如何定义链路日志数据结构？ <a class="header-anchor" href="#如何定义链路日志数据结构" aria-label="Permalink to &quot;如何定义链路日志数据结构？&quot;">​</a></h2><p>做过解决方案设计的同学都知道，一份经过精心设计的数据结构，是需要在写代码前就做好规划的。这样后续的需求迭代也能有更好的扩展性。</p><p>这节课，我们首先学习如何用最少字段原则设计基础数据类型的指标。实际上，基础数据指标是全链路日志中的通用数据，也是其他 6 种指标数据类型必备的字段。</p><p>基础数据类型中一共有 17 个属性字段，又细分为 5 种类别：基本日志信息、浏览器信息、页面信息、用户信息、业务信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/04/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/04/1.png" alt=""></a></p><p>我们一个一个来说。</p><h3 id="基本日志信息" tabindex="-1">基本日志信息 <a class="header-anchor" href="#基本日志信息" aria-label="Permalink to &quot;基本日志信息&quot;">​</a></h3><p>先说基本日志数据。顾名思义，这是链路日志的必要数据，包含了唯一键值、时间、类型以及最后更新时间。</p><p>为了让你更深入地理解数据结构的定义过程，接下来的数据定义我都会用 TypeScript 语言设计。</p><p>首先，我们定义四个必要的字段，并将类型的名称命名为 BaseTrace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ./typing.d.ts</span></span>
<span class="line"><span>// 全链路日志基类</span></span>
<span class="line"><span>type BaseTrace = {</span></span>
<span class="line"><span> // 唯一ID，用户侧生成</span></span>
<span class="line"><span> traceId: string</span></span>
<span class="line"><span> // 日志类型</span></span>
<span class="line"><span> type: TraceTypes</span></span>
<span class="line"><span> // 日志产生时间</span></span>
<span class="line"><span> createdAt: string</span></span>
<span class="line"><span> // 日志最后更新时间</span></span>
<span class="line"><span> updatedAt: string</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>字段并不多，但有两个地方需要注意。</p><p>第一，traceId 作为链路日志数据的唯一键值，并非由服务端生成，而是在前端生成的。因此，我们很难保证 traceId 的唯一性。我的解决方案是，不采用自增式，而是使用 UUID 生成法。</p><p>第二，createAt 和 updateAt 字段。这两个字段的含义是日志创建时间和更新时间。从后端角度来看，这两个字段应该从后端生成的，不过在这里同样交给前端生成。因为日志的创建是在前端页面，更新时间会随着用户在页面的操作而实时更新。</p><p>这两个时间相关字段不是核心的字段，为什么我要这么改呢？因为从发现问题的角度来看，有一个优点。那就是能够通过两者的时间差，判断用户在时间范围内交互操作的完成度，这也是前端同学判断用户页面停留时间的参考值之一。</p><p>另外，有些细心的同学可能发现了，有个 type 字段，类型是 TraceTypes。没错，这个就是日志类型。我把它放在基本日志信息里面，是因为它是必需项，也是判断日志类型的核心字段。</p><p>在这里，TraceTypes 实际上是个枚举类型，我给它定义了 9 种日志类型，覆盖了全链路日志的各种场景，你可以参考下面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ./typing.d.ts</span></span>
<span class="line"><span>enum TraceTypes {</span></span>
<span class="line"><span> // PVUV</span></span>
<span class="line"><span> PAGE_VIEW = &#39;PageView&#39;,</span></span>
<span class="line"><span> // Event</span></span>
<span class="line"><span> EVENT = &#39;EVENT&#39;,</span></span>
<span class="line"><span> // 性能</span></span>
<span class="line"><span> PERF = &#39;Perf&#39;,</span></span>
<span class="line"><span> // 资源</span></span>
<span class="line"><span> RESOURCE = &#39;Resource&#39;,</span></span>
<span class="line"><span> // 动作、行为类型</span></span>
<span class="line"><span> ACTION = &#39;Action&#39;,</span></span>
<span class="line"><span> // 请求类型</span></span>
<span class="line"><span> FETCH = &#39;Fetch&#39;,</span></span>
<span class="line"><span> // 代码错误</span></span>
<span class="line"><span> CODE_ERROR = &#39;CodeError&#39;,</span></span>
<span class="line"><span> // 日志</span></span>
<span class="line"><span> CONSOLE = &#39;Console&#39;,</span></span>
<span class="line"><span> // 其它</span></span>
<span class="line"><span> CUSTOMER = &#39;Customer&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，最核心的类型是 EVENT、PERF、ACTION、FETCH 和 CODE_ERROR，分别对应的是事件、性能、行为、接口和代码异常五大类。Action 类型在这里主要是记录用户的交互行为，作为我们分析用户行为的参考。</p><h3 id="浏览器信息" tabindex="-1">浏览器信息 <a class="header-anchor" href="#浏览器信息" aria-label="Permalink to &quot;浏览器信息&quot;">​</a></h3><p>前端同学都知道，我们可以通过 window.navigator 获取很多浏览器特性和能力，例如设备、版本、环境、内核等等。但在前端全链路中，哪些浏览器特性是能够协助我们快速定位问题的呢？</p><p>我的方案是不需要太多，两个足够。分别是浏览器的 UserAgent 以及预定义的 BrowserType枚举类型。</p><p>我们先来看下定义浏览器信息的类型有哪些，参考如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ./typing.d.ts</span></span>
<span class="line"><span>enum BrowserType {</span></span>
<span class="line"><span> // 手机端浏览器</span></span>
<span class="line"><span> MOBILE = &#39;mobile&#39;,</span></span>
<span class="line"><span> // PC浏览器</span></span>
<span class="line"><span> PC = &#39;pc&#39;,</span></span>
<span class="line"><span> // webview</span></span>
<span class="line"><span> WEBVIEW = &#39;webview&#39;,</span></span>
<span class="line"><span> // 小程序</span></span>
<span class="line"><span> MINI_PROGRAM = &#39;miniProgram&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 浏览器相关字段基类</span></span>
<span class="line"><span>type BaseBrowserTrace = {</span></span>
<span class="line"><span> // 当前浏览器的UserAgent</span></span>
<span class="line"><span> ua: string</span></span>
<span class="line"><span> // 浏览器类型</span></span>
<span class="line"><span> bt: BrowserType</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为什么在众多浏览器的特性中，我选择了 UserAgent 呢？</p><p>假设啊，有个用户反馈他在前端报名页面反复点击报名按钮都没有响应，而且连续两天都没能成功报名。最后，我们发现问题的根本原因是我们只能支持微信页面打开，但用户不是在微信内打开的页面，所以无法报名。</p><p>你看，用户打开页面的载体是不可预估的。而 UserAgent 能很好地帮助我们快速判断用户的访问场景是浏览器还是微信，我们就可以判断这个交互行为是否在产品的支持范围内。</p><p>同理，BrowserType 类型也是为了快速判断用户的使用场景，只不过这是由我们提前定义好的。</p><p>什么意思呢？举个例子，这次用户反馈的问题依然是报名页面点击报名按钮无反应。因为我们提前定义了一种可能的打开方式“miniProgram”，而这个字段在日志里出现了，我们通过总结发现，BrowserType 值为 miniProgram 的用户都无法正常报名，也就是说，遇到这个问题的用户都是在微信小程序中打开的报名页面。所以我们就能快速判断是微信小程序下的报名页面存在 BUG，需要进行修复。</p><p>BrowserType 类型还有个最大的好处，就是我们能通过它在前端全链路的监控和告警中过滤和筛选我们关注的核心日志。至于怎么做，我会在后面的课程里为你详细讲解。</p><h3 id="页面信息" tabindex="-1">页面信息 <a class="header-anchor" href="#页面信息" aria-label="Permalink to &quot;页面信息&quot;">​</a></h3><p>第三个需要关注的类型是页面类型。页面类型记录的是用户访问当前页面的一些基本信息，例如页面 URL、标题等。</p><p>页面类型属性的其中一个功能是帮助我们快速判断哪些页面出现了严重 BUG。同时，在监控中通过 URL 筛选，也可以判断是通用性问题还是个例问题。</p><p>总之，URL 和标题能通过过滤或分组，把海量的链路日志进行细化或分组，帮助我们在更细的维度分析问题。</p><p>我还是以最小字段为原则去设计属性字段，字段不多，能定位问题即可。</p><p>我们用 BasePageTrace 命名页面类字段，参考下面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 页面相关字段基类</span></span>
<span class="line"><span>type BasePageTrace = {</span></span>
<span class="line"><span> // 页面ID</span></span>
<span class="line"><span> pid: string</span></span>
<span class="line"><span> // 页面标题</span></span>
<span class="line"><span> title?: string</span></span>
<span class="line"><span> // 当前页面URL</span></span>
<span class="line"><span> url: string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>相信有些同学看到这个页面类的定义后，会有两个疑问。</p><p>第一，title 属性为什么不是必填项？</p><p>其实 title 属性是否必填并不重要，为什么这么说呢？</p><p>因为在实际项目中，有些页面的 title 是固定的，也有些是千人千面的。如果是第二种，并且title 的内容很长，再加上业务相关信息，那收录这个字段确实能快速定位，但从另一个角度来看，这对我们链路日志的存储空间也是一个比较大的挑战。</p><p>所以，以最小日志为原则设计字段，title 属性就是非必选项。如果在前端项目中确实需要用到title 来定位问题，那就把 title 的内容提供上去就可以了。</p><p>第二，我新增了一个 pid 字段，也就是 pageId 的简写。这个操作怎么理解呢？</p><p>由于现在的前端项目都是基于 Vue 或 React 技术栈，最终的效果大部分都是 SPA 单页面。也就是说，用户使用我们的前端产品页面时，通常都是加载页面一次后就不会加载第二次了，页面的切换都是采用静态路由方式进行的。</p><p>而 pid 的设计方案是从用户输入网址访问页面加载成功后，直到下一次重新刷新页面前，这个时间周期范围内，只生成一次 UUID 值。</p><p>我们试想想，假设用户访问前端页面时，经过多次的交互，产生了多条链路日志，那如果我们要了解这个用户的所有链路日志，该怎么查询呢？pid 就是为这种场景来设计的，它能帮助我们快速查询某个用户当前访问一次前端页面时的所有链路日志，从而帮助前端同学判断用户在使用前端页面过程中有没有异常。</p><h3 id="用户信息" tabindex="-1">用户信息 <a class="header-anchor" href="#用户信息" aria-label="Permalink to &quot;用户信息&quot;">​</a></h3><p>好，我们再说第四个类型，用户信息。顾名思义，就是记录用户基本信息的字段。同样的，我们在设计的时候也以最小字段原则为依据。因此，像用户 ID、用户名、电子邮箱这些信息都在我们的设计范围内。</p><p>不过，我们不用 userId 命名用户 ID，采用 uid 更合适。其余字段命名则参考如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 用户相关字段基类</span></span>
<span class="line"><span>type BaseUserTrace = {</span></span>
<span class="line"><span> // 指纹ID，fingerprintId</span></span>
<span class="line"><span> fpId: string</span></span>
<span class="line"><span> // 用户ID</span></span>
<span class="line"><span> uid?: string | number</span></span>
<span class="line"><span> // 用户名称</span></span>
<span class="line"><span> userName?: string</span></span>
<span class="line"><span> // 用户邮箱</span></span>
<span class="line"><span> email?: string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同样的道理，uid、userName、email 三个字段都是非必填项。因为用户在访问一些非登录态的前端页面时，基本上不会有这三种字段值。</p><p>我们看到还有个必填项字段 fpId。这个就是指纹 ID，设计指纹 ID 的作用是把同一个用户未登录和已登录两个状态的操作日志关联起来，这样就能快速查询用户登录前后的全链路日志。</p><p>关于指纹 ID 的实现方案，我会在后面的课程为你详细讲解。</p><h3 id="业务信息" tabindex="-1">业务信息 <a class="header-anchor" href="#业务信息" aria-label="Permalink to &quot;业务信息&quot;">​</a></h3><p>最后我再来说一个开放类型，业务信息类型。既然是一个开放性业务类型，就没有任何标准答案。但我希望通过抛砖引玉，引导你思考一个问题：如何把这类型日志设计得更好。</p><p>在我带过的团队里面，有一段经历特别有趣：只有 10 人的前端团队，却要负责公司 200 个以上的前端项目。</p><p>一个团队需要维护这么多项目，既有 App 端内 H5，也有基于 Electron 的 PC 端，还有纯 B端的后台系统。</p><p>这时候的考验就是如何分类不同场景的业务。这样，前端全链路监控和告警就能更准确地触达到我们团队，并给出出现问题的关联项目。</p><p>所以，在我们实施前端全链路的时候，有个很重要的字段就是 appId，它的意义就是区分前端项目。</p><p>下面是具体代码设计。这类的类名命名，我是以 BaseAppTrace 作为类名，同时也以业务基类场景作为通用类的，可以仔细看一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum TraceLevelType {</span></span>
<span class="line"><span> // 告警级别</span></span>
<span class="line"><span> error = &#39;error&#39;,</span></span>
<span class="line"><span> // 预警级别</span></span>
<span class="line"><span> warn = &#39;warn&#39;,</span></span>
<span class="line"><span> // 普通日志</span></span>
<span class="line"><span> info = &#39;info&#39;,</span></span>
<span class="line"><span> // 调试日志</span></span>
<span class="line"><span> debug = &#39;debug&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>enum TraceClientTypes {</span></span>
<span class="line"><span> // 安卓</span></span>
<span class="line"><span> ANDROID_H5 = &#39;android&#39;,</span></span>
<span class="line"><span> // iOS</span></span>
<span class="line"><span> IOS_H5 = &#39;ios&#39;,</span></span>
<span class="line"><span> // PC端</span></span>
<span class="line"><span> PC_H5 = &#39;pc&#39;,</span></span>
<span class="line"><span> // 浏览器</span></span>
<span class="line"><span> BROWSER_H5 = &#39;browser&#39;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 业务相关字段基类</span></span>
<span class="line"><span>type BaseAppTrace = {</span></span>
<span class="line"><span> // 业务ID</span></span>
<span class="line"><span> appId: string</span></span>
<span class="line"><span> // 业务名称</span></span>
<span class="line"><span> appName?: string</span></span>
<span class="line"><span> // 客户端类型</span></span>
<span class="line"><span> clientType: TraceClientTypes</span></span>
<span class="line"><span> // 日志级别</span></span>
<span class="line"><span> level: TraceLevelType</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>很显然，我设计 BaseAppTrace 类的字段最多也就 4 个。你也可以基于此类进行字段扩展，如果确实能帮你快速定位问题，那就去补充。如果只是纯粹用于记录，那就是非必需项。</p><p>还是回到所谓的“最少原则”。一条链路日志，不应该被过度设计。业务类字段也是同样的道理。毕竟有前面提到的 AppId、fpId、uid、url 等关键字段信息，这些基础数据已经足够帮助我们实施前端全链路的全流程监控了。</p><p>最后，我们把上述介绍的 5 种类型组合成新的基础数据类型。参考下面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type BaseTraceInfo = BaseTrace &amp; BaseBrowserTrace &amp; BaseUserTrace &amp; BaseAppTrace</span></span></code></pre></div><p>好了，到这里，5 种数据类型我就都讲完了。我采用定义常量的方式，展示了一份链路日志的标准例子。一定能让你对本节课设计的数据结构有更清晰的了解。</p><p>下面是完整代码。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> exampleBaseData</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BaseTraceInfo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> traceId: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;0bdf6c8e-25c8-427d-847a-9950318a2e14&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> level: TraceLevelType.warn,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> type: TraceTypes.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ACTION</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ua: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> bt: BrowserType.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">MOBILE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fpId: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;c77a37f4&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uid: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1002</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 例如：极客邦App的命名</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> appId: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;geekbang-app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clientType: TraceClientTypes.iOS_H5,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pid: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;088c8a92-5a24-4144-9c37-310848c397e1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> url: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;https://time.geekbang.org/&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> createdAt: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> updatedAt: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>5 种类型，17 个字段，构成了一份全链路日志的基础数据。但要知道，这些只是链路日志的基本字段，还没涉及问题记录、行为记录相关的内容讨论。关于问题类型的数据结构，我会在下一节课给你拆解。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>在本节课中，我们学习了如何在前端全链路的实施过程中设计链路日志的基础属性字段。</p><p>首先，我们先将众多的基础属性字段分成 5 大类别，基本日志信息、浏览器信息、页面信息、用户信息、业务信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/04/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%89%8D%E7%AB%AF%E5%85%A8%E9%93%BE%E8%B7%AF%E4%BC%98%E5%8C%96%E5%AE%9E%E6%88%98%E8%AF%BE/images/04/2.png" alt=""></a></p><p>在这 5 大类里，咱们一共设计了 17 个属性字段帮助自己分析和解决问题，包括用于判断用户停留时间的 createAt 和 updateAt，用于判断用户场景的 ua 和 bt，用于筛选页面的 url，用于关联上下游日志的 pid，用于关联同一个用户的 fpId，用于区分前端项目的 appId 等等。</p><p>最后划个重点。咱们在设计链路日志字段中一直遵守一个原则：最少日志字段原则。这个原则的核心作用是约束。属性字段只用于协助前端同学快速定位问题，而非进行数据分析。如果一条链路日志的字段设计过多，会严重影响服务器端的存储空间，从而增加研发成本，得不偿失。</p><p>下一节课，我们继续对全链路日志剩余的业务字段进行拆解，和你一起设计实现。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>本节课我们重点在探讨如何设计一份尽可能满足项目的全链路日志基础数据，不过目前前端全链路的方案中并没有一套适用所有业务的标准答案。因此，留个思考题给你，思考一下你负责的业务场景中，除了这节课我谈到的 17 个通用字段，你认为还有哪些通用属性字段可以帮助你快速定位问题？</p><p>欢迎你在留言区和我交流。如果觉得有所收获，也可以把课程分享给更多的朋友一起学习。我们下节课见！</p>`,85)])])}const o=a(i,[["render",l]]);export{k as __pageData,o as default};
