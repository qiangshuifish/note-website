import{_ as i,H as a,f as n,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"第13章异步组件与函数式组件","description":"","frontmatter":{},"headers":[{"level":2,"title":"13.1　异步组件要解决的问题","slug":"_13-1-异步组件要解决的问题","link":"#_13-1-异步组件要解决的问题","children":[]},{"level":2,"title":"13.2　异步组件的实现原理","slug":"_13-2-异步组件的实现原理","link":"#_13-2-异步组件的实现原理","children":[{"level":3,"title":"13.2.1　封装 defineAsyncComponent 函数","slug":"_13-2-1-封装-defineasynccomponent-函数","link":"#_13-2-1-封装-defineasynccomponent-函数","children":[]},{"level":3,"title":"13.2.2　超时与 Error 组件","slug":"_13-2-2-超时与-error-组件","link":"#_13-2-2-超时与-error-组件","children":[]},{"level":3,"title":"13.2.3　延迟与 Loading 组件","slug":"_13-2-3-延迟与-loading-组件","link":"#_13-2-3-延迟与-loading-组件","children":[]},{"level":3,"title":"13.2.4　重试机制","slug":"_13-2-4-重试机制","link":"#_13-2-4-重试机制","children":[]}]},{"level":2,"title":"13.3　函数式组件","slug":"_13-3-函数式组件","link":"#_13-3-函数式组件","children":[]},{"level":2,"title":"13.4　总结","slug":"_13-4-总结","link":"#_13-4-总结","children":[]}],"relativePath":"Vue.js设计与实现/第13章异步组件与函数式组件.md","filePath":"Vue.js设计与实现/第13章异步组件与函数式组件.md","lastUpdated":1795535580000}'),l={name:"Vue.js设计与实现/第13章异步组件与函数式组件.md"};function t(e,s,h,k,E,r){return a(),n("div",null,[...s[0]||(s[0]=[p(`<h1 id="第13章异步组件与函数式组件" tabindex="-1">第13章异步组件与函数式组件 <a class="header-anchor" href="#第13章异步组件与函数式组件" aria-label="Permalink to &quot;第13章异步组件与函数式组件&quot;">​</a></h1><p>在第 12 章中，我们详细讨论了组件的基本含义与实现。本章，我们将继续讨论组件的两个重要概念，即异步组件和函数式组件。在异步组件中，“异步”二字指的是，以异步的方式加载并渲染一个组件。这在代码分割、服务端下发组件等场景中尤为重要。而函数式组件允许使用一个普通函数定义组件，并使用该函数的返回值作为组件要渲染的内容。函数式组件的特点是：无状态、编写简单且直观。在 Vue.js 2 中，相比有状态组件来说，函数式组件具有明显的性能优势。但在 Vue.js 3 中，函数式组件与有状态组件的性能差距不大，都非常好。正如 Vue.jsRFC 的原文所述：“在 Vue.js 3 中使用函数式组件，主要是因为它的简单性，而不是因为它的性能好。”</p><h2 id="_13-1-异步组件要解决的问题" tabindex="-1">13.1　异步组件要解决的问题 <a class="header-anchor" href="#_13-1-异步组件要解决的问题" aria-label="Permalink to &quot;13.1　异步组件要解决的问题&quot;">​</a></h2><p>从根本上来说，异步组件的实现不需要任何框架层面的支持，用户完全可以自行实现。渲染App 组件到页面的示例如下：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> App </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;App.vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">createApp(App).mount(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;#app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>上面这段代码所展示的就是同步渲染。我们可以轻易地将其修改为异步渲染，如下面的代码所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> loader</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;App.vue&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">loader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">App</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  createApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(App).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;#app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>这里我们使用动态导入语句 import() 来加载组件，它会返回一个 Promise 实例。组件加</span></span>
<span class="line"><span>载成功后，会调用 createApp 函数完成挂载，这样就实现了以异步的方式来渲染页面。</span></span></code></pre></div><p>上面的例子实现了整个页面的异步渲染。通常一个页面会由多个组件构成，每个组件负责渲染页面的一部分。那么，如果只想异步渲染部分页面，要怎么办呢？这时，只需要有能力异步加</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">载某一个组件就可以了。假设下面的代码是 App.vue 组件的代码：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">CompA</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;​component :is=&quot;asyncComp&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { shallowRef } from &#39;vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import CompA from &#39;CompA.vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;export default {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">components: { CompA },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const asyncComp = shallowRef(null)&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pre&gt;&lt;​code&gt; // 异步加载 CompB 组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import(&#39;CompB.vue&#39;).then(CompB =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncComp.value = CompB)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  asyncComp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/code&gt;&lt;​/pre&gt; // 异步加载 CompB 组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import(&#39;CompB.vue&#39;).then(CompB =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncComp.value = CompB)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  asyncComp</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>从这段代码的模板中可以看出，页面由 &lt;​CompA /&gt; 组件和动态组件 &lt;​component&gt; 构成。</span></span>
<span class="line"><span>其中，CompA 组件是同步渲染的，而动态组件绑定了 asyncComp 变量。再看脚本块，我们</span></span>
<span class="line"><span>通过动态导入语句 import() 来异步加载 CompB 组件，当加载成功后，将 asyncComp 变</span></span>
<span class="line"><span>量的值设置为 CompB。这样就实现了 CompB 组件的异步加载和渲染。</span></span></code></pre></div><p>不过，虽然用户可以自行实现组件的异步加载和渲染，但整体实现还是比较复杂的，因为一个完善的异步组件的实现，所涉及的内容要比上面的例子复杂得多。通常在异步加载组件时，我们还要考虑以下几个方面。</p><ul><li><p>如果组件加载失败或加载超时，是否要渲染 Error 组件？</p></li><li><p>组件在加载时，是否要展示占位的内容？例如渲染一个 Loading 组件。</p></li><li><p>组件加载的速度可能很快，也可能很慢，是否要设置一个延迟展示 Loading 组件的时间？如果组件在 200ms 内没有加载成功才展示 Loading 组件，这样可以避免由组件加载过快所导致的闪烁。</p></li><li><p>组件加载失败后，是否需要重试？</p></li></ul><p>为了替用户更好地解决上述问题，我们需要在框架层面为异步组件提供更好的封装支持，与之对应的能力如下。</p><ul><li><p>允许用户指定加载出错时要渲染的组件。</p></li><li><p>允许用户指定 Loading 组件，以及展示该组件的延迟时间。</p></li><li><p>允许用户设置加载组件的超时时长。</p></li><li><p>组件加载失败时，为用户提供重试的能力。</p></li></ul><p>以上这些内容就是异步组件真正要解决的问题。</p><h2 id="_13-2-异步组件的实现原理" tabindex="-1">13.2　异步组件的实现原理 <a class="header-anchor" href="#_13-2-异步组件的实现原理" aria-label="Permalink to &quot;13.2　异步组件的实现原理&quot;">​</a></h2><h3 id="_13-2-1-封装-defineasynccomponent-函数" tabindex="-1">13.2.1　封装 defineAsyncComponent 函数 <a class="header-anchor" href="#_13-2-1-封装-defineasynccomponent-函数" aria-label="Permalink to &quot;13.2.1　封装 defineAsyncComponent 函数&quot;">​</a></h3><p>异步组件本质上是通过封装手段来实现友好的用户接口，从而降低用户层面的使用复杂度，如下面的用户代码所示：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​template</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  &lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">AsyncComp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​/template</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​script</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> default {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  components:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 使用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> defineAsyncComponent</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 定义一个异步组件，它接收一个加载器作为参数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    AsyncComp:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> defineAsyncComponent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&#39;CompA&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">​/script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">在上面这段代码中，我们使用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> defineAsyncComponent</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 来定义异步组件，并直接使用</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">components</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 组件选项来注册它。这样，在模板中就可以像使用普通组件一样使用异步组件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">了。可以看到，使用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> defineAsyncComponent</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数定义异步组件的方式，比我们在</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 13.1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 节</span></span></code></pre></div><p>中自行实现的异步组件方案要简单直接得多。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">defineAsyncComponent 是一个高阶组件，它最基本的实现如下：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// defineAsyncComponent 函数用于定义一个异步组件，接收一个异步组件加载器作为参数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function defineAsyncComponent(loader) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 一个变量，用来存储异步加载的组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let InnerComp = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 返回一个包装组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    name: &#39;AsyncComponentWrapper&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 异步组件是否加载成功</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      const loaded = ref(false)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 执行加载器函数，返回一个 Promise 实例</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 加载成功后，将加载成功的组件赋值给 InnerComp，并将 loaded 标记为 true，代表加载成</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loader().then(c =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pre&gt;&lt;​code&gt;   return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果异步组件加载成功，则渲染该组件，否则渲染一个占位内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    return loaded.value ? { type: InnerComp } : { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/code&gt;&lt;​/pre&gt;   return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果异步组件加载成功，则渲染该组件，否则渲染一个占位内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    return loaded.value ? { type: InnerComp } : { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>这里有以下几个关键点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>defineAsyncComponent 函数本质上是一个高阶组件，它的返回值是一个包装组件。</span></span></code></pre></div><ul><li><p>包装组件会根据加载器的状态来决定渲染什么内容。如果加载器成功地加载了组件，则渲染被加载的组件，否则会渲染一个占位内容。</p></li><li><p>通常占位内容是一个注释节点。组件没有被加载成功时，页面中会渲染一个注释节点来占位。但这里我们使用了一个空文本节点来占位。</p></li></ul><h3 id="_13-2-2-超时与-error-组件" tabindex="-1">13.2.2　超时与 Error 组件 <a class="header-anchor" href="#_13-2-2-超时与-error-组件" aria-label="Permalink to &quot;13.2.2　超时与 Error 组件&quot;">​</a></h3><p>异步组件通常以网络请求的形式进行加载。前端发送一个 HTTP 请求，请求下载组件的JavaScript 资源，或者从服务端直接获取组件数据。既然存在网络请求，那么必然要考虑网速较慢的情况，尤其是在弱网环境下，加载一个组件可能需要很长时间。因此，我们需要为用户提供指定超时时长的能力，当加载组件的时间超过了指定时长后，会触发超时错误。这时如果用户配置了 Error 组件，则会渲染该组件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>首先，我们来设计用户接口。为了让用户能够指定超时时长，defineAsyncComponent 函</span></span></code></pre></div><p>数需要接收一个配置对象作为参数：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> AsyncComp</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineAsyncComponent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  loader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;CompA.vue&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  timeout: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 超时时长，其单位为 ms</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  errorComponent: MyErrorComp </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 指定出错时要渲染的组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">loader：指定异步组件的加载器。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">timeout：单位为 ms，指定超时时长。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">errorComponent：指定一个 Error 组件，当错误发生时会渲染它。</span></span></code></pre></div><p>设计好用户接口后，我们就可以给出具体实现了，如下面的代码所示：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function defineAsyncComponent(options) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // options 可以是配置项，也可以是加载器</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (typeof options === &#39;function&#39;) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果 options 是加载器，则将其格式化为配置项形式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    options = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loader: options</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;const { loader } = options&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;let InnerComp = null&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: ‘AsyncComponentWrapper’,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const loaded = ref(false)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 代表是否超时，默认为 false，即没有超时</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const timeout = ref(false)&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pre&gt;&lt;​code&gt;   loader().then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let timer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.timeout) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果指定了超时时长，则开启一个定时器计时</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    timer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 超时后将 timeout 设置为 true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      timeout.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.timeout)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 包装组件被卸载时清除定时器</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  onUmounted(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clearTimeout(timer))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 占位内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const placeholder = { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    if (loaded.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 如果组件异步加载成功，则渲染被加载的组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: InnerComp }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (timeout.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 如果加载超时，并且用户指定了 Error 组件，则渲染该组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return options.errorComponent ? { type: options.errorComponent } : placeho</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    return placeholder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/code&gt;&lt;​/pre&gt;   loader().then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let timer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.timeout) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果指定了超时时长，则开启一个定时器计时</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    timer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 超时后将 timeout 设置为 true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      timeout.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.timeout)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 包装组件被卸载时清除定时器</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  onUmounted(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clearTimeout(timer))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 占位内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const placeholder = { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    if (loaded.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 如果组件异步加载成功，则渲染被加载的组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: InnerComp }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (timeout.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 如果加载超时，并且用户指定了 Error 组件，则渲染该组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return options.errorComponent ? { type: options.errorComponent } : placeho</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    return placeholder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>整体实现并不复杂，关键点如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>需要一个标志变量来标识异步组件的加载是否已经超时，即 timeout.value。</span></span>
<span class="line"><span>开始加载组件的同时，开启一个定时器进行计时。当加载超时后，将 timeout.value 的</span></span>
<span class="line"><span>值设置为 true，代表加载已经超时。这里需要注意的是，当包装组件被卸载时，需要清除</span></span></code></pre></div><ul><li>定时器。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>包装组件根据 loaded 变量的值以及 timeout 变量的值来决定具体的渲染内容。如果异</span></span></code></pre></div><ul><li>步组件加载成功，则渲染被加载的组件；如果异步组件加载超时，并且用户指定了 Error 组件，则渲染 Error 组件。</li></ul><p>这样，我们就实现了对加载超时的兼容，以及对 Error 组件的支持。除此之外，我们希望有更加完善的机制来处理异步组件加载过程中发生的错误，超时只是错误的原因之一。基于此，我们还希望为用户提供以下能力。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>当错误发生时，把错误对象作为 Error 组件的 props 传递过去，以便用户后续能自行进行</span></span></code></pre></div><ul><li><p>更细粒度的处理。</p></li><li><p>除了超时之外，有能力处理其他原因导致的加载错误，例如网络失败等。</p></li></ul><p>为了实现这两个目标，我们需要对代码做一些调整，如下所示：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function defineAsyncComponent(options) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (typeof options === &#39;function&#39;) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    options = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loader: options</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;const { loader } = options&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;let InnerComp = null&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: ‘AsyncComponentWrapper’,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const loaded = ref(false)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 定义 error，当错误发生时，用来存储错误对象</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const error = shallowRef(null)&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pre&gt;&lt;​code&gt;   loader()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 添加 catch 语句来捕获加载过程中的错误</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .catch((err) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> error.value = err)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let timer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.timeout) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    timer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 超时后创建一个错误对象，并复制给 error.value</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      const err = new Error(\`Async component timed out after $ms.\`)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      error.value = err</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.timeout)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const placeholder = { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    if (loaded.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: InnerComp }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (error.value </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;amp;&amp;amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> options.errorComponent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 只有当错误存在且用户配置了 errorComponent 时才展示 Error 组件，同时将 error 作为</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: options.errorComponent, props: { error: error.value } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return placeholder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/code&gt;&lt;​/pre&gt;   loader()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 添加 catch 语句来捕获加载过程中的错误</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .catch((err) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> error.value = err)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let timer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.timeout) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    timer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 超时后创建一个错误对象，并复制给 error.value</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      const err = new Error(\`Async component timed out after $ms.\`)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      error.value = err</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.timeout)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const placeholder = { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    if (loaded.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: InnerComp }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (error.value </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;amp;&amp;amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> options.errorComponent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 只有当错误存在且用户配置了 errorComponent 时才展示 Error 组件，同时将 error 作为</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: options.errorComponent, props: { error: error.value } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return placeholder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">观察上面的代码，我们对之前的实现做了一些调整。首先，为加载器添加 catch 语句来捕获</span></span></code></pre></div><p>所有加载错误。接着，当加载超时后，我们会创建一个新的错误对象，并将其赋值给</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>error.value 变量。在组件渲染时，只要 error.value 的值存在，且用户配置了</span></span>
<span class="line"><span>errorComponent 组件，就直接渲染 errorComponent 组件并将 error.value 的值作为</span></span>
<span class="line"><span>该组件的 props 传递。这样，用户就可以在自己的 Error 组件上，通过定义名为 error 的</span></span>
<span class="line"><span>props 来接收错误对象，从而实现细粒度的控制。</span></span></code></pre></div><h3 id="_13-2-3-延迟与-loading-组件" tabindex="-1">13.2.3　延迟与 Loading 组件 <a class="header-anchor" href="#_13-2-3-延迟与-loading-组件" aria-label="Permalink to &quot;13.2.3　延迟与 Loading 组件&quot;">​</a></h3><p>异步加载的组件受网络影响较大，加载过程可能很慢，也可能很快。这时我们就会很自然地想到，对于第一种情况，我们能否通过展示 Loading 组件来提供更好的用户体验。这样，用户就不会有“卡死”的感觉了。这是一个好想法，但展示 Loading 组件的时机是一个需要仔细考虑的问题。通常，我们会从加载开始的那一刻起就展示 Loading 组件。但在网络状况良好的情况下，异步组件的加载速度会非常快，这会导致 Loading 组件刚完成渲染就立即进入卸载阶段，于是出现闪烁的情况。对于用户来说这是非常不好的体验。因此，我们需要为 Loading 组件设置一个延迟展示的时间。例如，当超过 200ms 没有完成加载，才展示 Loading 组件。这样，对于在 200ms 内能够完成加载的情况来说，就避免了闪烁问题的出现。</p><p>不过，我们首先要考虑的仍然是用户接口的设计，如下面的代码所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>defineAsyncComponent({</span></span>
<span class="line"><span>  loader: () =&gt; new Promise(r =&gt; { /* ... */ }),</span></span>
<span class="line"><span>  // 延迟 200ms 展示 Loading 组件</span></span>
<span class="line"><span>  delay: 200,</span></span>
<span class="line"><span>  // Loading 组件</span></span>
<span class="line"><span>  loadingComponent: {</span></span>
<span class="line"><span>    setup() {</span></span>
<span class="line"><span>      return () =&gt; {</span></span>
<span class="line"><span>        return { type: &#39;h2&#39;, children: &#39;Loading...&#39; }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>delay，用于指定延迟展示 Loading 组件的时长。</span></span>
<span class="line"><span>loadingComponent，类似于 errorComponent 选项，用于配置 Loading 组件。</span></span></code></pre></div><p>用户接口设计完成后，我们就可以着手实现了。延迟时间与 Loading 组件的具体实现如下：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function defineAsyncComponent(options) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (typeof options === &#39;function&#39;) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    options = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loader: options</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;const { loader } = options&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;let InnerComp = null&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: ‘AsyncComponentWrapper’,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const loaded = ref(false)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const error = shallowRef(null)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 一个标志，代表是否正在加载，默认为 false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const loading = ref(false)&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pre&gt;&lt;​code&gt;   let loadingTimer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 如果配置项中存在 delay，则开启一个定时器计时，当延迟到时后将 loading.value 设置为 tru</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.delay) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loadingTimer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.delay);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果配置项中没有 delay，则直接标记为加载中</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  loader()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .catch((err) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> error.value = err)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .finally(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 加载完毕后，无论成功与否都要清除延迟定时器</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      clearTimeout(loadingTimer)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let timer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.timeout) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    timer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      const err = new Error(\`Async component timed out after $ms.\`)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      error.value = err</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.timeout)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const placeholder = { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    if (loaded.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: InnerComp }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (error.value </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;amp;&amp;amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> options.errorComponent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: options.errorComponent, props: { error: error.value } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (loading.value </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;amp;&amp;amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> options.loadingComponent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 如果异步组件正在加载，并且用户指定了 Loading 组件，则渲染 Loading 组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: options.loadingComponent }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return placeholder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/code&gt;&lt;​/pre&gt;   let loadingTimer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 如果配置项中存在 delay，则开启一个定时器计时，当延迟到时后将 loading.value 设置为 tru</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.delay) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loadingTimer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.delay);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    // 如果配置项中没有 delay，则直接标记为加载中</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  loader()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .catch((err) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> error.value = err)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .finally(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 加载完毕后，无论成功与否都要清除延迟定时器</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      clearTimeout(loadingTimer)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  let timer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.timeout) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    timer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      const err = new Error(\`Async component timed out after $ms.\`)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      error.value = err</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.timeout)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const placeholder = { type: Text, children: &#39;&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  return () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    if (loaded.value) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: InnerComp }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (error.value </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;amp;&amp;amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> options.errorComponent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: options.errorComponent, props: { error: error.value } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else if (loading.value </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;amp;&amp;amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> options.loadingComponent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      // 如果异步组件正在加载，并且用户指定了 Loading 组件，则渲染 Loading 组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return { type: options.loadingComponent }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      return placeholder</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>整体实现思路类似于超时时长与 Error 组件，有以下几个关键点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>需要一个标记变量 loading 来代表组件是否正在加载。</span></span>
<span class="line"><span>如果用户指定了延迟时间，则开启延迟定时器。定时器到时后，再将 loading.value 的</span></span>
<span class="line"><span>值设置为 true。</span></span></code></pre></div><ul><li><p>无论组件加载成功与否，都要清除延迟定时器，否则会出现组件已经加载成功，但仍然展示Loading 组件的问题。</p></li><li><p>在渲染函数中，如果组件正在加载，并且用户指定了 Loading 组件，则渲染该 Loading 组件。</p></li></ul><p>另外有一点需要注意，当异步组件加载成功后，会卸载 Loading 组件并渲染异步加载的组件。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">为了支持 Loading 组件的卸载，我们需要修改 unmount 函数，如以下代码所示：</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> unmount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">vnode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (vnode.type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Fragment) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    vnode.children.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">c</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> unmount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(c))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">typeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> vnode.type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;object&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 对于组件的卸载，本质上是要卸载组件所渲染的内容，即 subTree</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    unmount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(vnode.component.subTree)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> parent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> vnode.el.parentNode</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (parent) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    parent.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">removeChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(vnode.el)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">对于组件的卸载，本质上是要卸载组件所渲染的内容，即 subTree。所以在上面的代码中，</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">我们通过组件实例的 vnode.component 属性得到组件实例，再递归地调用 unmount 函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">完成 vnode.component.subTree 的卸载。</span></span></code></pre></div><h3 id="_13-2-4-重试机制" tabindex="-1">13.2.4　重试机制 <a class="header-anchor" href="#_13-2-4-重试机制" aria-label="Permalink to &quot;13.2.4　重试机制&quot;">​</a></h3><p>重试指的是当加载出错时，有能力重新发起加载组件的请求。在加载组件的过程中，发生错误的情况非常常见，尤其是在网络不稳定的情况下。因此，提供开箱即用的重试机制，会提升用户的开发体验。</p><p>异步组件加载失败后的重试机制，与请求服务端接口失败后的重试机制一样。所以，我们先来</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>讨论接口请求失败后的重试机制是如何实现的。为此，我们需要封装一个 fetch 函数，用来</span></span></code></pre></div><p>模拟接口请求：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fetch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> new</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">resolve,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 请求会在</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 秒后失败</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    setTimeout((</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      reject(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&#39;err&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, 1000);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">假设调用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fetch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数会发送</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> HTTP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 请求，并且该请求会在</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 秒后失败。为了实现失败后的重</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">试，我们需要封装一个</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> load</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数，如下面的代码所示：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> load</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数接收一个</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> onError</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 回调函数</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> load</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onError</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 请求接口，得到</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  const</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fetch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 捕获错误</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> p.catch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">err</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 当错误发生时，返回一个新的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例，并调用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> onError</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 回调，</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 同时将</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> retry</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数作为</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> onError</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 回调的参数</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> new</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">resolve,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> retry</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数，用来执行重试的函数，执行该函数会重新调用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> load</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数并发送请求</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      const</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> retry</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">load(onError</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      const</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fail</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () =&gt; reject(err)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      onError(retry,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">load</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数内部调用了</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fetch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数来发送请求，并得到一个</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例。接着，添加</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">catch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 语句块来捕获该实例的错误。当捕获到错误时，我们有两种选择：要么抛出错误，要</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">么返回一个新的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例，并把该实例的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolve</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 和</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reject</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 方法暴露给用户，让用</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">户来决定下一步应该怎么做。这里，我们将新的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Promise</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 实例的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolve</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 和</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reject</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 分别</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">封装为</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> retry</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数和</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> fail</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 函数，并将它们作为</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> onError</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 回调函数的参数。这样，用户就</span></span></code></pre></div><p>可以在错误发生时主动选择重试或直接抛出错误。下面的代码展示了用户是如何进行重试加载的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 调用 load 函数加载资源</span></span>
<span class="line"><span>load(</span></span>
<span class="line"><span>  // onError 回调</span></span>
<span class="line"><span>  (retry) =&gt; {</span></span>
<span class="line"><span>    // 失败后重试</span></span>
<span class="line"><span>    retry()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>).then(res =&gt; {</span></span>
<span class="line"><span>  // 成功</span></span>
<span class="line"><span>  console.log(res)</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>基于这个原理，我们可以很容易地将它整合到异步组件的加载流程中。具体实现如下：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function defineAsyncComponent(options) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (typeof options === &#39;function&#39;) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    options = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loader: options</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;const { loader } = options&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;let InnerComp = null&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;// 记录重试次数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">let retries = 0</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 封装 load 函数用来加载异步组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function load() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">return loader()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 捕获加载器的错误</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.catch((err) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 如果用户指定了 onError 回调，则将控制权交给用户</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">if (options.onError) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 返回一个新的 Promise 实例</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">return new Promise((resolve, reject) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 重试</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const retry = () =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">resolve(load())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">retries++</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 失败</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const fail = () =&gt; reject(err)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 作为 onError 回调函数的参数，让用户来决定下一步怎么做</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">options.onError(retry, fail, retries)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">throw error</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;return {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: ‘AsyncComponentWrapper’,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const loaded = ref(false)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const error = shallowRef(null)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const loading = ref(false)&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​pre&gt;&lt;​code&gt;   let loadingTimer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.delay) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loadingTimer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.delay);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 调用 load 函数加载组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  load()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .catch((err) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      error.value = err</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .finally(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      clearTimeout(loadingTimer)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/code&gt;&lt;​/pre&gt;   let loadingTimer = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (options.delay) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loadingTimer = setTimeout(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }, options.delay);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loading.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 调用 load 函数加载组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  load()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .then(c =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      InnerComp = c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loaded.value = true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .catch((err) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      error.value = err</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    .finally(() =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      loading.value = false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      clearTimeout(loadingTimer)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>如上面的代码及注释所示，其整体思路与普通接口请求的重试机制类似。</p><h2 id="_13-3-函数式组件" tabindex="-1">13.3　函数式组件 <a class="header-anchor" href="#_13-3-函数式组件" aria-label="Permalink to &quot;13.3　函数式组件&quot;">​</a></h2><p>函数式组件的实现相对容易。一个函数式组件本质上就是一个普通函数，该函数的返回值是虚拟 DOM。本章章首曾提到：“在 Vue.js 3 中使用函数式组件，主要是因为它的简单性，而不是因为它的性能好。”这是因为在 Vue.js 3 中，即使是有状态组件，其初始化性能消耗也非常小。</p><p>在用户接口层面，一个函数式组件就是一个返回虚拟 DOM 的函数，如下面的代码所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyFuncComp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">props</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { type: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;h1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, children: props.title }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">函数式组件没有自身状态，但它仍然可以接收由外部传入的 props。为了给函数式组件定义</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">props，我们需要在组件函数上添加静态的 props 属性，如下面的代码所示：</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyFuncComp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">props</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { type: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;h1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, children: props.title }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 定义 props</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">MyFuncComp.props </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  title: String</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>在有状态组件的基础上，实现函数式组件将变得非常简单，因为挂载组件的逻辑可以复用</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mountComponent 函数。为此，我们需要在 patch 函数内支持函数类型的 vnode.type，</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">如下面 patch 函数的代码所示：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function patch(n1, n2, container, anchor) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  if (n1 </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n1.type !== n2.type) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    unmount(n1)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    n1 = null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;const { type } = n2&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">if (typeof type === ‘string’) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} else if (type === Text) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} else if (type === Fragment) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} else if (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// type 是对象 --&gt; 有状态组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// type 是函数 --&gt; 函数式组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">typeof type === ‘object’ || typeof type === ‘function’</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// component</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">if (!n1) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mountComponent(n2, container, anchor)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">patchComponent(n1, n2, anchor)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">在 patch 函数内部，通过检测 vnode.type 的类型来判断组件的类型：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">如果 vnode.type 是一个对象，则它是一个有状态组件，并且 vnode.type 是组件选项</span></span></code></pre></div><ul><li>对象；</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">如果 vnode.type 是一个函数，则它是一个函数式组件。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">但无论是有状态组件，还是函数式组件，我们都可以通过 mountComponent 函数来完成挂</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">载，也都可以通过 patchComponent 函数来完成更新。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">下面是修改后的 mountComponent 函数，它支持挂载函数式组件：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function mountComponent(vnode, container, anchor) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  // 检查是否是函数式组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  const isFunctional = typeof vnode.type === &#39;function&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​p&gt;let componentOptions = vnode.type</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">if (isFunctional) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 如果是函数式组件，则将 vnode.type 作为渲染函数，将 vnode.type.props 作为 props 选项定义</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">componentOptions = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">render: vnode.type,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">props: vnode.type.props</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">可以看到，实现对函数式组件的兼容非常简单。首先，在 mountComponent 函数内检查组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">的类型，如果是函数式组件，则直接将组件函数作为组件选项对象的 render 选项，并将组</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">件函数的静态 props 属性作为组件的 props 选项即可，其他逻辑保持不变。当然，出于更</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">加严谨的考虑，我们需要通过 isFunctional 变量实现选择性地执行初始化逻辑，因为对于</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">函数式组件来说，它无须初始化 data 以及生命周期钩子。从这一点可以看出，函数式组件的</span></span></code></pre></div><p>初始化性能消耗小于有状态组件。</p><h2 id="_13-4-总结" tabindex="-1">13.4　总结 <a class="header-anchor" href="#_13-4-总结" aria-label="Permalink to &quot;13.4　总结&quot;">​</a></h2><p>在本章中，我们首先讨论了异步组件要解决的问题。异步组件在页面性能、拆包以及服务端下发组件等场景中尤为重要。从根本上来说，异步组件的实现可以完全在用户层面实现，而无须框架支持。但一个完善的异步组件仍需要考虑诸多问题，例如：</p><ul><li><p>允许用户指定加载出错时要渲染的组件；</p></li><li><p>允许用户指定 Loading 组件，以及展示该组件的延迟时间；</p></li><li><p>允许用户设置加载组件的超时时长；</p></li><li><p>组件加载失败时，为用户提供重试的能力。</p></li></ul><p>因此，框架有必要内建异步组件的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Vue.js 3 提供了 defineAsyncComponent 函数，用来定义异步组件。</span></span></code></pre></div><p>接着，我们讲解了异步组件的加载超时问题，以及当加载错误发生时，如何指定 Error 组件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>通过为 defineAsyncComponent 函数指定选项参数，允许用户通过 timeout 选项设置超</span></span>
<span class="line"><span>时时长。当加载超时后，会触发加载错误，这时会渲染用户通过 errorComponent 选项指定</span></span></code></pre></div><p>的 Error 组件。</p><p>在加载异步组件的过程中，受网络状况的影响较大。当网络状况较差时，加载过程可能很漫长。为了提供更好的用户体验，我们需要在加载时展示 Loading 组件。所以，我们设计了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>loadingComponent 选项，以允许用户配置自定义的 Loading 组件。但展示 Loading 组件</span></span></code></pre></div><p>的时机是一个需要仔细考虑的问题。为了避免 Loading 组件导致的闪烁问题，我们还需要设计</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>一个接口，让用户能指定延迟展示 Loading 组件的时间，即 delay 选项。</span></span></code></pre></div><p>在加载组件的过程中，发生错误的情况非常常见。所以，我们设计了组件加载发生错误后的重试机制。在讲解异步组件的重试加载机制时，我们类比了接口请求发生错误时的重试机制，两者的思路类似。</p><p>最后，我们讨论了函数式组件。它本质上是一个函数，其内部实现逻辑可以复用有状态组件的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>实现逻辑。为了给函数式组件定义 props，我们允许开发者在函数式组件的主函数上添加静</span></span>
<span class="line"><span>态的 props 属性。出于更加严谨的考虑，函数式组件没有自身状态，也没有生命周期的概</span></span></code></pre></div><p>念。所以，在初始化函数式组件时，需要选择性地复用有状态组件的初始化逻辑。</p>`,92)])])}const o=i(l,[["render",t]]);export{g as __pageData,o as default};
