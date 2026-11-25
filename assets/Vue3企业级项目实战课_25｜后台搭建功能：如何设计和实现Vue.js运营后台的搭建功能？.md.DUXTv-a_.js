import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const c=JSON.parse('{"title":"25 | 后台搭建功能：如何设计和实现Vue.js运营后台的搭建功能？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何设计页面搭建的数据格式","slug":"如何设计页面搭建的数据格式","link":"#如何设计页面搭建的数据格式","children":[]},{"level":2,"title":"如何设计页面搭建的功能链路","slug":"如何设计页面搭建的功能链路","link":"#如何设计页面搭建的功能链路","children":[]},{"level":2,"title":"如何做页面搭建的技术方案设计","slug":"如何做页面搭建的技术方案设计","link":"#如何做页面搭建的技术方案设计","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Vue3企业级项目实战课/25｜后台搭建功能：如何设计和实现Vue.js运营后台的搭建功能？.md","filePath":"Vue3企业级项目实战课/25｜后台搭建功能：如何设计和实现Vue.js运营后台的搭建功能？.md","lastUpdated":1795535737000}'),e={name:"Vue3企业级项目实战课/25｜后台搭建功能：如何设计和实现Vue.js运营后台的搭建功能？.md"};function t(l,s,E,h,k,r){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_25-后台搭建功能-如何设计和实现vue-js运营后台的搭建功能" tabindex="-1">25 | 后台搭建功能：如何设计和实现Vue.js运营后台的搭建功能？ <a class="header-anchor" href="#_25-后台搭建功能-如何设计和实现vue-js运营后台的搭建功能" aria-label="Permalink to &quot;25 | 后台搭建功能：如何设计和实现Vue.js运营后台的搭建功能？&quot;">​</a></h1><p>你好，我是杨文坚。</p><p>在课程项目“运营搭建平台”的功能分析中，我们把平台功能分成三大功能维度，“用户维度”“物料维度”和“页面维度”。</p><p>页面的数据结构，其实就是物料数据源的组成，上节课我们用 JSON Schema 来描述物料数据源，等于描述了页面的数据结构。物料维度相关的内容和技术实现就告一段落。从今天开始，我们进入页面功能维度的学习。</p><p>页面功能维度，是我们运营搭建平台项目最后一个功能维度，也是最重要、最复杂的功能维度。</p><p>页面功能维度可以分成五大功能模块，“页面搭建”“页面编译和运行”“页面发布流程”“页面版本管理”和“页面渲染方式”，按照业务逻辑的操作顺序，先有“页面搭建”，才能生产页面数据，从而带动后续的功能操作。所以，这节课我们就来学习运营搭建平台的“页面搭建”功能。</p><h2 id="如何设计页面搭建的数据格式" tabindex="-1">如何设计页面搭建的数据格式 <a class="header-anchor" href="#如何设计页面搭建的数据格式" aria-label="Permalink to &quot;如何设计页面搭建的数据格式&quot;">​</a></h2><p>之前我们说过，页面是由物料组成的，物料是由 Vue.js 组件和数据源组成的，而数据源构成页面的数据结构。所以，不管是页面还是物料，最底层的构成元素就是“数据”和“静态资源”，页面的搭建，也是围绕着“数据”和“静态资源”来实现的。</p><p>那么，我们要做的事情就是页面的数据格式设计。</p><p>不过设计搭建页面的数据格式之前，我们要先对页面布局结构做设计。毕竟，页面不是简单的物料叠加组合，而是根据有规范的排列规则，来排列物料。这个排列规律就是布局设计。当布局设计出来后，我们根据布局里的“坑位”来填充物料，就能形成一张完整的页面。</p><p>那么要如何做布局设计呢？</p><p>首先，我们要做“布局规范”的选择。在前端领域里，页面布局规范有很多种，比如网格布局、绝对定位布局、流式布局等等。在常见的搭建场景中，现在比较主流的布局规范是网格布局。</p><p>网格布局，顾名思义就是把页面网格化，页面由“行”和“列”两种模块元素组成。一个或多个“列布局”模块沿着水平方向，横向组成一个“行布局”模块，一个或多个“行布局”模块沿着垂直方向，纵向组成页面。</p><p>有网格布局的规范选择，接下来就是要做布局的数据设计了。我这里画了一张图辅助你理解。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/1.png" alt=""></a></p><p>网格布局，你可以直接理解成“行列布局”，那么布局数据的格式就是“页面数据”嵌套了“行数据”，“行数据”里嵌套了“列数据”。</p><p>我们可以基于 TypeScript 来设计页面布局数据格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 列布局</span></span>
<span class="line"><span>interface LayoutColumn {</span></span>
<span class="line"><span> name?: string;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 行布局</span></span>
<span class="line"><span>interface LayoutRow {</span></span>
<span class="line"><span> columns: LayoutColumn[];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 布局</span></span>
<span class="line"><span>interface Layout {</span></span>
<span class="line"><span> rows: LayoutRow[];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>设计了布局的基本数据格式后，还要考虑布局尺寸问题。我们都知道，用浏览器访问页面，常规浏览的视角是页面从上到下，也就是说页面的高度是动态变化的。</p><p>这就意味着，在网格布局中，页面的每一行高度，我们可以根据列布局中物料的高度弹性变化，但是页面的宽度就要做限制，每一行的宽度，受到顶级布局宽度的限制，带动着行里的每一列就要分割限制的宽度。这时候布局数据的 TypeScript 数据类型可以扩展添加宽度属性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 列布局</span></span>
<span class="line"><span>interface LayoutColumn {</span></span>
<span class="line"><span> name?: string;</span></span>
<span class="line"><span> width: string | number;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 行布局</span></span>
<span class="line"><span>interface LayoutRow {</span></span>
<span class="line"><span> columns: LayoutColumn[];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 布局</span></span>
<span class="line"><span>interface Layout {</span></span>
<span class="line"><span> width: number | string;</span></span>
<span class="line"><span> rows: LayoutRow[];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在我们有了完整的布局数据格式，接下来就要把物料填充到网格布局中的每一列中。</p><p>怎么操作呢？在布局数据中直接添加“物料数据格式”到“列数据格式”？理论上可以这么做，但是在“列数据”中添加“物料数据”，会导致整个“页面布局数据”的数据层级太多，实际 JSON 的“数据深度”太大。</p><p>我们可以在每一个列数据中留下一个 uuid，代表每一个物料模块，然后在布局数据格式的同个层级中，定义一个模块的 Map 对象数据，来包含所有物料模块数据格式。模块 Map 对象数据的键值 Key 就是每列的 uuid，指向所引用的列。</p><p>模块数据可以这么设计，每个独立的物料模块中，包含了物料组件的名称，版本号和物料数据源。看具体的 TypeScript 代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 物料模块</span></span>
<span class="line"><span>interface LayoutModule {</span></span>
<span class="line"><span> materialName: string;</span></span>
<span class="line"><span> materialVersion: string;</span></span>
<span class="line"><span> materialData: Record&lt;​string, any&gt;; // 物料数据源</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 物料模块Map</span></span>
<span class="line"><span>interface LayoutModuleMap {</span></span>
<span class="line"><span> [uuid: string]: LayoutModule; // uuid指向每一列里的uuid</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到了这里，我们有了网格布局数据格式，也有物料模块数据格式，把他们整合起来，就是完整的页面布局数据。</p><p>看完整的 TypeScript 数据类型代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 列布局</span></span>
<span class="line"><span>interface LayoutColumn {</span></span>
<span class="line"><span> uuid: string; // 列唯一的uuid，指向物料模块的uuid</span></span>
<span class="line"><span> name?: string;</span></span>
<span class="line"><span> width: string | number;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 行布局</span></span>
<span class="line"><span>interface LayoutRow {</span></span>
<span class="line"><span> uuid: string; // 行唯一的uuid</span></span>
<span class="line"><span> columns: LayoutColumn[];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 布局</span></span>
<span class="line"><span>interface Layout {</span></span>
<span class="line"><span> width: number | string;</span></span>
<span class="line"><span> rows: LayoutRow[];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 物料模块</span></span>
<span class="line"><span>interface LayoutModule {</span></span>
<span class="line"><span> materialName: string;</span></span>
<span class="line"><span> materialVersion: string;</span></span>
<span class="line"><span> materialData: Record&lt;​string, any&gt;; // 物料数据源</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 物料模块Map</span></span>
<span class="line"><span>interface LayoutModuleMap {</span></span>
<span class="line"><span> [uuid: string]: LayoutModule;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 完整的页面布局数据</span></span>
<span class="line"><span>interface PageLayoutData {</span></span>
<span class="line"><span> layout: Layout;</span></span>
<span class="line"><span> moduleMap: LayoutModuleMap;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>基于这段完整的页面布局数据的 TypeScript 类型，我来实现一个页面搭建的 JSON 对象数据例子。</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &quot;layout&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   &quot;rows&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;uuid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;7a3dbfa7-29ca-4765-bd58-7a91abda7721&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;columns&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;其它广告位1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;uuid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2be63a53-8a16-43ba-8640-a1ab24bdbae3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;width&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;其它广告位2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;uuid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;0184e8ed-7df4-4742-9bb4-b8dfa1a0aca7&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;width&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">400</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;uuid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;0fdbe663-51d8-4038-9d0d-bdeed0c6eb71&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       &quot;columns&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;促销商品模块&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;uuid&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;26148a93-e66a-4448-b6a4-4bddbce9ae4f&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           &quot;width&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   &quot;width&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> &quot;moduleMap&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   &quot;26148a93-e66a-4448-b6a4-4bddbce9ae4f&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialData&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {},</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;@my/material-product-list&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialVersion&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;0.9.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   &quot;2be63a53-8a16-43ba-8640-a1ab24bdbae3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialData&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {},</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;@my/material-banner-slides&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialVersion&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;0.9.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   &quot;0184e8ed-7df4-4742-9bb4-b8dfa1a0aca7&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialData&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {},</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;@my/material-banner-slides&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     &quot;materialVersion&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;0.9.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>为了统一描述，这里的“布局数据”和“物料模块数据”整合后的数据，我们就统称为“页面布局数据”。</p><p>我们已经设计了用于页面搭建的“页面布局数据”，我也举例模拟搭建页面的 JSON 对象数据，接下来就可以实现页面搭建了。</p><p>页面搭建的实现原理，就是要基于“搭建页面数据”，再结合“物料组件资源”，也就是物料的JavaScript 和 CSS 静态资源文件，来完成页面的搭建功能。按照我们之前的功能实现套路，首先要做功能逻辑链路设计，然后基于功能逻辑设计来做技术方案设计，最后落地成实际代码。那么，要如何设计页面搭建的功能链路呢？</p><h2 id="如何设计页面搭建的功能链路" tabindex="-1">如何设计页面搭建的功能链路 <a class="header-anchor" href="#如何设计页面搭建的功能链路" aria-label="Permalink to &quot;如何设计页面搭建的功能链路&quot;">​</a></h2><p>从页面布局数据的分析步骤可以看出，实现一个搭建的页面，需要先制定页面的布局，然后再向布局中填充物料。所以页面搭建功能链路，就是从布局到物料的操作过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/2.png" alt=""></a></p><p>我们能很清晰地把页面搭建功能链路分成五个步骤。</p><ul><li><p>第一步：操作页面的行列布局</p></li><li><p>第二步：填充物料模块到列布局中</p></li><li><p>第三步：编辑物料的数据源</p></li><li><p>第四步：发布页面布局数据</p></li><li><p>第五步：支持重新编辑页面布局数据</p></li></ul><p>我们分析一下功能链路上每一步的操作逻辑。</p><p>第一步，操作页面的行列布局。这一步，主要功能是支持添加“行布局”，在新增“行布局”时候，支持定义所在“行布局”中的“列布局”。这里的定义“列布局”包括了“列”的个数和每一列分割的宽度。具体操作界面就像这样。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/3.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/4.png" alt=""></a></p><p>这两张图就是课程的代码案例，实现了行布局的新增和列布局的定义。</p><p>从上面页面布局数据定义过程中，我们可以知道，“列”是整个页面布局中的最小单位，也就是说，最终物料是填充到“列布局”中的。</p><p>所以，第二步，填充物料模块到“列布局”中，我们先进行物料的查询，查询验证成功后就填充到“列布局”中。具体操作界面就像这样。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/5.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/6.png" alt=""></a></p><p>第三步，编辑物料的数据源。在这个步骤中，支持对每一列中的物料模块，进行数据源的编辑。根据已填充的物料组件，显示对应的数据源编辑表单，编辑对应的数据源。具体操作界面我也截图了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/7.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/8.png" alt=""></a></p><p>截图展示了根据对应的物料，显示对应的数据源编辑表单。当提交了数据源给物料后，渲染出新的效果。</p><p>第四步，发布页面布局数据。这一步也就是提交完整的页面布局数据（布局和物料模块数据），存储到数据中，支持下次编辑。发布成功后，跳转到页面列表页面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/9.png" alt=""></a></p><p>第五步，支持编辑页面布局数据。这一步中，支持对已发布的页面数据进行重新修改，基本复用了上面的所有功能点，包括编辑行列布局、填充物料组件、编辑物料数据源和发布修改数据。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/10.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/10.png" alt=""></a></p><p>到这里，我们就完成了页面搭建的功能逻辑链路的设计，是不是逻辑很清晰。</p><p>接下来，我们就要把这些功能逻辑设计进行技术层面的“翻译”，也就是技术方案的设计。</p><h2 id="如何做页面搭建的技术方案设计" tabindex="-1">如何做页面搭建的技术方案设计 <a class="header-anchor" href="#如何做页面搭建的技术方案设计" aria-label="Permalink to &quot;如何做页面搭建的技术方案设计&quot;">​</a></h2><p>按照我们之前的套路，功能的技术方案设计，其实就是根据功能逻辑设计的步骤，对应找到合适的或者熟悉的技术实现方式。那我们就根据上面的功能逻辑设计的步骤，来定制技术方案。</p><p>第一步，操作页面的行列布局。这一步骤中，主要是实现布局的操控。首先，是“行布局”的操控，我们可以基于 Vue.js 的响应式数据来实现“行布局”的“增删改”操作。然后是“列布局”的定义，我们在行布局的新增时候，就可以用动态表单来实现对应“列布局”的宽度定义。</p><p>“列布局”还可以用我们之前课程中实现的“拖拽布局组件”来支持“列布局”的位置拖拽。说到这里，你可能有疑问，为什么“行布局”不用“拖拽布局组件”，而是直接操作响应式数据来控制呢？</p><p>这是因为行布局是垂直排列的，超出浏览器屏幕高度就会出现页面滚动，不方便拖拽，所以用数据来操控实现更合适。如果硬要“拖拽布局组件”来实现，就要改造“拖拽布局组件”的深层嵌套操作。这会增大工作量，而且在超长页面中，拖拽操作也对用户不友好，开发收益不大。</p><p>具体的列布局拖拽效果就像这样。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/11.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/25/11.png" alt=""></a></p><p>第二步，填充物料模块到“列”布局中。这里就用到我们之间课程中，组件库相关的“对话框组件”和“动态表单组件”。今天的代码案例中，我已经改造了“对话框组件”，让它支持渲染嵌套子组件。最终技术逻辑是弹出一个对话框，嵌套一个动态表单来进行填充物料。</p><p>在这个步骤中，我们还要基于选中的填充物料，把对应组件的静态资源，也就是 JavaScript和 CSS 文件进行加载，并且渲染到对应“列布局中”。</p><p>在代码案例中，我选用了物料 Vue.js 组件的 AMD 模块，进行组件动态加载和动态渲染。主要是封装了一个动态渲染物料模块的 JSX 组件。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// packages/work-front/src/pages/manage/modules/page-editor.tsx</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import * as Vue from &#39;vue&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 动态初始化AMD 运行时环境</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">async function initAMDEnv(params: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> materialName: string;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> materialVersion: string;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const { materialName, materialVersion } = params;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (!window.requirejs) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   await loadScript(&#39;/public/cdn/pkg/requirejs/2.3.6/require.js&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const paths: Record&lt;​string, string&gt; = {};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 注册Vue的AMD模块，AMD和当前应用共用同一个Vue.js运行时</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> window.define(&#39;vue&#39;, [], () =&gt; Vue);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> paths[materialName] = \`/public/cdn/material/\${materialName}/\${materialVersion}/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> window.requirejs.config({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   paths</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 创建动态物料预览模块 的 Vue.js组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">function createEditModule(params: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> materialName?: string;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> materialVersion?: string;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> materialData?: any;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 省略其它参数...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const { materialName, materialVersion, materialData } = params;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 物料挂载的 &quot;外壳组件&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const EditModule: DefineComponent = defineComponent({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   setup() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     const container = ref&lt;​HTMLElement&gt;();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     onMounted(async () =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       if (!(materialName </span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">&amp;&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> materialVersion)) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         return;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       const params = {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         name: materialName,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         version: materialVersion</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       // 初始化 AMD 运行时环境</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       await initAMDEnv({ materialName, materialVersion });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       // 加载物料样式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       await loadMaterialStyle(params);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       window.require( [&#39;vue&#39;, materialName],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         (Vue: any, MaterialComponent: any) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           // 这里拿到的Vue是跟当前应用是同一个Vue.js运行时</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           // 动态加载物料组件的AMD模块</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           const App = Vue.h(MaterialComponent, materialData || {});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           const app = Vue.createApp(App, {});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           // 在&quot;外壳组件&quot;中动态挂载物料的AMD格式Vue.js组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           app.mount(container.value);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     // 中间省略其它代码 ....</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     return () =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       return (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​div style={​{ width }​} class=&quot;module-page-edit-module&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           {/* 中间省略其它代码 ....   */}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;page-edit-module-content&quot; ref={container}&gt;&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> return EditModule;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>从代码和注释，你可以看出，填充物料的技术实现，就是动态渲染物料的 Vue.js 组件。核心步骤是先初始化 AMD 运行时环境，然后动态加载 AMD 格式组件，再生成动态的外壳组件，最后在外壳组件里，挂载物料的 Vue.js 组件。</p><p>第三步，编辑物料的数据源。这一步骤，可以直接复用上节课编辑物料数据源的表单组件，结合对话框组件一起使用，实现动态获取数据源的 JSON Schema，动态渲染数据源表单，最后实现编辑数据源的功能。</p><p>第四步，发布页面布局数据。这要开发对应的 HTTP 服务接口，支持提交数据到服务端，并且存储到数据库中。具体技术实现都是重复性的 SQL 操作和 Node.js 逻辑代码实现，可以复制修改之前物料操作的代码，对数据库中的页面数据进行“增改查”操作。</p><p>第五步，支持编辑页面布局数据。这一步最简单，基于上述四个步骤实现的功能，添加默认数据填充和提交数据接口的修改。</p><p>到这里，基于页面搭建的功能逻辑设计，我们就实现了技术方案设计，最终的完整实现代码，你可以看课程对应的代码案例。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>通过今天的学习，相信你已经掌握了页面搭建的功能实现操作。从功能实现视角总结。</p><ul><li><p>页面搭建流程主要分成两个部分，第一是要先做布局设计，第二是填充物料到布局中。所以页面搭建是围绕着“操作布局”和“填充物料”来进行的。</p></li><li><p>页面搭建核心点是“操作布局”和“填充物料”，底层核心数据就是“布局数据”和“填充的物料模块数据”。所以页面搭建的数据设计，首先要考虑到“布局”和“布局填充”的数据。</p></li></ul><p>我们再从技术视角总结一下。</p><ul><li><p>页面搭建过程中，对布局和物料的编辑等操作，会遇到大量表单场景，技术方案选择动态表单，能大大提高开发效率。</p></li><li><p>拖拽技术不一定能适用所有页面搭建功能，要考虑到页面超长出现浏览器滚动场景，拖拽操作就体验不友好。</p></li><li><p>页面布局操作，涉及大量的数据设计和数据操作，所以类似搭建项目，要尽量使用TypeScript 进行开发，限制数据类型格式。</p></li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>留给作业给你，在今天中的页面搭建技术方案设计中，为什么渲染物料组件考虑用 AMD 模块格式，而不选用 ESM 模块格式呢?</p><p>期待能在留言区看到你的想法。通过今天的学习，希望你能掌握页面搭建的实现要点，举一反三，不管之后遇到什么样的搭建场景，都能游刃有余地按照套路进行功能实现和技术思考。下节课见。</p><p>完整的代码在这里</p>`,83)])])}const g=a(e,[["render",t]]);export{c as __pageData,g as default};
