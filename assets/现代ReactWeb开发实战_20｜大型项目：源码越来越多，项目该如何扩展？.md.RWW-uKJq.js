import{_ as a,H as n,f as p,i}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"20 | 大型项目：源码越来越多，项目该如何扩展？","description":"","frontmatter":{},"headers":[{"level":2,"title":"几种典型的 React 项目文件目录结构","slug":"几种典型的-react-项目文件目录结构","link":"#几种典型的-react-项目文件目录结构","children":[{"level":3,"title":"单文件结构","slug":"单文件结构","link":"#单文件结构","children":[]},{"level":3,"title":"单目录结构","slug":"单目录结构","link":"#单目录结构","children":[]},{"level":3,"title":"按文件职能划分目录结构","slug":"按文件职能划分目录结构","link":"#按文件职能划分目录结构","children":[]},{"level":3,"title":"按组件划分目录结构","slug":"按组件划分目录结构","link":"#按组件划分目录结构","children":[]},{"level":3,"title":"按业务功能划分目录结构","slug":"按业务功能划分目录结构","link":"#按业务功能划分目录结构","children":[]},{"level":3,"title":"如何选取合适的文件目录结构？","slug":"如何选取合适的文件目录结构","link":"#如何选取合适的文件目录结构","children":[]}]},{"level":2,"title":"前端应用逻辑架构的功用","slug":"前端应用逻辑架构的功用","link":"#前端应用逻辑架构的功用","children":[]},{"level":2,"title":"大中型 React 项目推荐的文件目录结构","slug":"大中型-react-项目推荐的文件目录结构","link":"#大中型-react-项目推荐的文件目录结构","children":[{"level":3,"title":"模块导入路径过长怎么办？","slug":"模块导入路径过长怎么办","link":"#模块导入路径过长怎么办","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"现代ReactWeb开发实战/20｜大型项目：源码越来越多，项目该如何扩展？.md","filePath":"现代ReactWeb开发实战/20｜大型项目：源码越来越多，项目该如何扩展？.md","lastUpdated":1795558962000}'),e={name:"现代ReactWeb开发实战/20｜大型项目：源码越来越多，项目该如何扩展？.md"};function l(t,s,c,h,o,d){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_20-大型项目-源码越来越多-项目该如何扩展" tabindex="-1">20 | 大型项目：源码越来越多，项目该如何扩展？ <a class="header-anchor" href="#_20-大型项目-源码越来越多-项目该如何扩展" aria-label="Permalink to &quot;20 | 大型项目：源码越来越多，项目该如何扩展？&quot;">​</a></h1><p>你好，我是宋一玮，欢迎回到 React 应用开发的学习。</p><p>上节课提到，为了应对大中型 React 项目的复杂应用逻辑，我们会分为局部和整体两个部分来学习。对于作为局部的组件逻辑，可以通过抽象来简化组件的设计和开发。我们学习了 React中的自定义 Hooks 和组件组合这两种抽象方式，也学习了在这两种抽象基础上的代码复用，尤其是高阶组件的写法。</p><p>从局部到整体，复杂度会在代码量上直观地展现出来。在前端工程化和团队协作的基础上，大型 React 项目代码量上 10 万很常见。项目从最初的几行代码到如今的数十万代码，你可能会遇到如下问题：</p><ul><li><p>新功能的组件、Hooks、样式要不要分文件写，源文件都放到哪里？</p></li><li><p>Redux 的 action、reducer、store 都写到哪里？</p></li><li><p>公共的代码放到哪里？</p></li><li><p>代码文件多到找不到怎么办？</p></li></ul><p>这节课我们会继续讨论 React 应用的整体逻辑，看看大中型 React 项目在代码增多后，整体扩展上会遇到的挑战，以及如何应对这些挑战。</p><h2 id="几种典型的-react-项目文件目录结构" tabindex="-1">几种典型的 React 项目文件目录结构 <a class="header-anchor" href="#几种典型的-react-项目文件目录结构" aria-label="Permalink to &quot;几种典型的 React 项目文件目录结构&quot;">​</a></h2><p>项目源码的文件目录结构并不等同于应用的整体逻辑，但却可以作为把握应用整体逻辑的一张“地图”。一个良好的文件目录结构是自解释的，可以帮助新接触项目的开发者快速熟悉代码逻辑。</p><p>React 应用项目有以下五种典型的文件目录结构：</p><ul><li><p>单文件结构；</p></li><li><p>单目录结构；</p></li><li><p>按文件职能划分目录结构；</p></li><li><p>按组件划分目录结构；</p></li><li><p>按业务功能划分目录结构。</p></li></ul><p>接下来我们分别看一下。</p><h3 id="单文件结构" tabindex="-1">单文件结构 <a class="header-anchor" href="#单文件结构" aria-label="Permalink to &quot;单文件结构&quot;">​</a></h3><p>是的，你没看错，单文件结构就是指，在单个 React 组件文件中开发所有业务逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你肯定亲眼见过这种结构，比如在第 3 节课里 CRA 创建的 oh-my-kanban 项目，不算样</span></span>
<span class="line"><span>式的话，我们当时把所有代码都写在了 src/app.js 中。需要注意的是，这种结构只适合代</span></span></code></pre></div><p>码演示或微型的 React 项目。</p><h3 id="单目录结构" tabindex="-1">单目录结构 <a class="header-anchor" href="#单目录结构" aria-label="Permalink to &quot;单目录结构&quot;">​</a></h3><p>比起单文件结构，这种结构拆分了组件文件，拆分的文件都放在同一个目录下。前面第 12</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>节课末尾，oh-my-kanban 项目完成大重构第一步时的项目结构就是这样。目录树结构（有</span></span></code></pre></div><p>省略）如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src</span></span>
<span class="line"><span>├── App.css</span></span>
<span class="line"><span>├── App.js</span></span>
<span class="line"><span>├── KanbanBoard.js</span></span>
<span class="line"><span>├── KanbanCard.js</span></span>
<span class="line"><span>├── KanbanColumn.js</span></span>
<span class="line"><span>├── KanbanNewCard.js</span></span>
<span class="line"><span>├── index.css</span></span>
<span class="line"><span>└── index.js</span></span></code></pre></div><p>单目录结构比起单文件结构，能支撑更多组件以及相关逻辑，适合微型 React 项目。</p><h3 id="按文件职能划分目录结构" tabindex="-1">按文件职能划分目录结构 <a class="header-anchor" href="#按文件职能划分目录结构" aria-label="Permalink to &quot;按文件职能划分目录结构&quot;">​</a></h3><p>顾名思义，在这种结构下，组件文件放一个目录，自定义 Hooks 文件放一个目录，context 文件放一个目录，如果使用了 Redux 的话，actions、reducers、store 各占一个目录（或者Redux Toolkit 的 slices 和 store 目录）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在第 13 节课，oh-my-kanban 项目完成大重构后，加入的第一个 context 就放到了独立的</span></span>
<span class="line"><span>src/context 目录。不只 JS 项目，在第 18 节课，我们尝试为 TS 项目加入的类型定义</span></span>
<span class="line"><span>src/types/KanbanCard.types.ts ，也放到了专门的 types 目录下。目录树结构（有</span></span></code></pre></div><p>省略）如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src</span></span>
<span class="line"><span>├── components</span></span>
<span class="line"><span>│   ├── App.css</span></span>
<span class="line"><span>│   ├── App.tsx</span></span>
<span class="line"><span>│   ├── KanbanBoard.tsx</span></span>
<span class="line"><span>│   ├── KanbanCard.tsx</span></span>
<span class="line"><span>│   ├── KanbanColumn.tsx</span></span>
<span class="line"><span>│   └── KanbanNewCard.tsx</span></span>
<span class="line"><span>├── context</span></span>
<span class="line"><span>│   └── AdminContext.ts</span></span>
<span class="line"><span>├── hooks</span></span>
<span class="line"><span>│   └── useFetchCards.ts</span></span>
<span class="line"><span>├── types</span></span>
<span class="line"><span>│   └── KanbanCard.types.ts</span></span>
<span class="line"><span>├── index.css</span></span>
<span class="line"><span>└── index.tsx</span></span></code></pre></div><p>按文件职能划分目录结构的优点在于，可以快速定位任何一种类型的源码，在源码之间导入导出也比较方便：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">components</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">App.tsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> AdminContext </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../context/AdminContext&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>当其中某个或者某几个目录中的文件数不断增多时，这种结构的缺点就暴露出来了：不容易定</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>位到直接相关的源文件。比如 hooks/useFetchCards.ts 目前只有</span></span>
<span class="line"><span>components/App.tsx 在用，这从目录结构上是看不出来的，必须进到源码里去看，当</span></span>
<span class="line"><span>components 目录下的文件足够多时，要花些功夫才能确认这两个文件的关联关系。</span></span></code></pre></div><h3 id="按组件划分目录结构" tabindex="-1">按组件划分目录结构 <a class="header-anchor" href="#按组件划分目录结构" aria-label="Permalink to &quot;按组件划分目录结构&quot;">​</a></h3><p>这种目录结构为每个组件都划分了一个独立、平级的目录，只要跟这个组件强相关，都往这个目录里招呼。这种设计出于两个考虑：</p><ul><li><p>React 的基本开发单元是组件；</p></li><li><p>同一组件的相关代码要尽量共置（Colocation，这里翻译成“托管”不太合适）。目录树结构的例子如下：</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src</span></span>
<span class="line"><span>├── components</span></span>
<span class="line"><span>│   ├── App</span></span>
<span class="line"><span>│   │   ├── AdminContext.js</span></span>
<span class="line"><span>│   │   ├── App.css</span></span>
<span class="line"><span>│   │   ├── App.jsx</span></span>
<span class="line"><span>│   │   ├── App.test.jsx</span></span>
<span class="line"><span>│   │   ├── index.js</span></span>
<span class="line"><span>│   │   └── useFetchCards.js</span></span>
<span class="line"><span>│   ├── KanbanBoard</span></span>
<span class="line"><span>│   │   ├── KanbanBoard.css</span></span>
<span class="line"><span>│   │   ├── KanbanBoard.jsx</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   ├── KanbanCard</span></span>
<span class="line"><span>│   │   ├── KanbanCard.css</span></span>
<span class="line"><span>│   │   ├── KanbanCard.jsx</span></span>
<span class="line"><span>│   │   ├── KanbanNewCard.jsx</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   └── KanbanColumn</span></span>
<span class="line"><span>│       ├── KanbanColumn.css</span></span>
<span class="line"><span>│       ├── KanbanColumn.jsx</span></span>
<span class="line"><span>│       └── index.js</span></span>
<span class="line"><span>├── index.css</span></span>
<span class="line"><span>└── index.jsx</span></span>
<span class="line"><span>在每个目录中都有一个 index.js ，负责把当前目录的组件重新导出（Re-export）到目录外</span></span></code></pre></div><p>面去，这样其他组件在导入这个组件时，不需要关心目录里都有哪些实现，只关注作为入口的</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">index.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 就行。入口文件示意代码如下：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">//</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> src/components/KanbanCard/index.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> as</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> KanbanCard</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> }</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./KanbanCard.jsx&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> as</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> KanbanNewCard</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> }</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./KanbanNewCard.jsx&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>这种目录结构的优势在于，能为特定组件提供一定的封装性，在它专属的目录中能找到它强相关的所有代码。但它也有不足，面对一些跨组件复用的逻辑，可能会出现放到哪个组件目录都不太合适的窘境。</p><h3 id="按业务功能划分目录结构" tabindex="-1">按业务功能划分目录结构 <a class="header-anchor" href="#按业务功能划分目录结构" aria-label="Permalink to &quot;按业务功能划分目录结构&quot;">​</a></h3><p>按业务功能划分目录结构，它与我们刚刚讲过的结构都不同，意味着目录划分的主要依据不再是具体框架中的某个具体技术概念（包括 React 的组件、Hooks、context，也包括 Redux 的action、reducer、store）。这使得按业务功能划分目录结构成为一个框架无关的方案，也就是说，其他框架的应用也可以利用这种目录结构。</p><p>目录树结构的例子如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src</span></span>
<span class="line"><span>├── features</span></span>
<span class="line"><span>│   ├── admin</span></span>
<span class="line"><span>│   │   ├── AdminContext.js</span></span>
<span class="line"><span>│   │   ├── AdminDashboard.jsx</span></span>
<span class="line"><span>│   │   ├── AdminSettings.jsx</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   ├── kanban</span></span>
<span class="line"><span>│   │   ├── KanbanBoard.jsx</span></span>
<span class="line"><span>│   │   ├── KanbanCard.jsx</span></span>
<span class="line"><span>│   │   ├── KanbanColumn.jsx</span></span>
<span class="line"><span>│   │   ├── KanbanNewCard.jsx</span></span>
<span class="line"><span>│   │   ├── index.js</span></span>
<span class="line"><span>│   │   └── useFetchCards.js</span></span>
<span class="line"><span>│   ├── login</span></span>
<span class="line"><span>│   │   ├── Login.css</span></span>
<span class="line"><span>│   │   ├── Login.jsx</span></span>
<span class="line"><span>│   │   ├── LoginForm.jsx</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   └── user</span></span>
<span class="line"><span>│       ├── Password.jsx</span></span>
<span class="line"><span>│       ├── UserProfile.jsx</span></span>
<span class="line"><span>│       ├── UserSettings.jsx</span></span>
<span class="line"><span>│       └── index.js</span></span>
<span class="line"><span>├── index.css</span></span>
<span class="line"><span>└── index.jsx</span></span></code></pre></div><p>按业务功能划分目录结构可以说，它是这五种结构中最适合大中型 React 项目的。它既强调了相关源文件的共置，也在增加业务功能时具有良好的可扩展性。但它也具有与按组件划分目录结构类似的缺点，面对一些跨业务功能复用的逻辑，放在哪个业务目录下都不太合适。</p><h3 id="如何选取合适的文件目录结构" tabindex="-1">如何选取合适的文件目录结构？ <a class="header-anchor" href="#如何选取合适的文件目录结构" aria-label="Permalink to &quot;如何选取合适的文件目录结构？&quot;">​</a></h3><p>可以参考以下表格：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%B0%E4%BB%A3ReactWeb%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/20/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%B0%E4%BB%A3ReactWeb%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/20/1.png" alt=""></a></p><h2 id="前端应用逻辑架构的功用" tabindex="-1">前端应用逻辑架构的功用 <a class="header-anchor" href="#前端应用逻辑架构的功用" aria-label="Permalink to &quot;前端应用逻辑架构的功用&quot;">​</a></h2><p>当提到 React 应用的整体逻辑时，不知你是否还记得第 2 节课这张应用逻辑架构图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%B0%E4%BB%A3ReactWeb%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/20/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%B0%E4%BB%A3ReactWeb%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/20/2.png" alt=""></a></p><p>我工作早些年间，流行的开发流程是瀑布式开发（Waterfall Model），当时的概要设计阶段和详细设计阶段，对设计文档尤其是架构图的要求非常严格（我画的这种五颜六色的图……基本会被驳回重画）。近些年软件行业追求效率，敏捷开发已经成为主流，但敏捷开发并没有拒绝文档化，也绝不应该被当作拒绝架构设计的借口。</p><p>无论是否精确、美观，这样的架构图有助于我们把握项目的整体走向，对于大中型 React 项目而言是一个值得的先期投入。</p><p>也许你会问：“架构图应该是由架构师来画吧？”</p><p>我会这样理解这个事情：架构设计是一项工作、一项技能，而架构师是一个职位，两者间没有直接的等号。以我个人的经历举例，我参加工作后画的第一张架构图，那是在工作第二年。后来那张图有幸被用到了几场技术评审中，在与技术 Leaders 交流的过程中起了大作用，反过来也让我学到了很多。当然，这纯粹是我的个人理解，具体情况因人而异。</p><p>你的下一个问题大概是：“好的，我知道架构图有用了，那具体来说，画架构图对文件目录结构有什么用？”</p><p>因为前面提到了：</p><ul><li>项目源码的文件目录结构并不等同于应用的整体逻辑，但却可以作为把握应用整体逻辑的一张“地图”。</li></ul><p>那么应用逻辑架构图就可以当作是“地图”的“地图”。</p><p>下面马上来了解一下，我们为大中型 React 项目推荐的文件目录结构，也看看跟上面的应用逻辑架构图有什么样的对应关系。</p><h2 id="大中型-react-项目推荐的文件目录结构" tabindex="-1">大中型 React 项目推荐的文件目录结构 <a class="header-anchor" href="#大中型-react-项目推荐的文件目录结构" aria-label="Permalink to &quot;大中型 React 项目推荐的文件目录结构&quot;">​</a></h2><p>当 React 项目规模属于中型或大型时，文件目录结构需要满足以下几个目标：</p><ul><li><p>便于横向扩展（即增加新功能点或视图）；</p></li><li><p>易于定位相关代码；</p></li><li><p>鼓励代码复用；</p></li><li><p>有利于团队协作。</p></li></ul><p>为了满足上面的目标，我推荐你以按业务功能划分为主，结合按组件、按文件职能的方式，划分目录结构。</p><p>参考的目录树结构（有省略）如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src</span></span>
<span class="line"><span>├── components</span></span>
<span class="line"><span>│   ├── Button</span></span>
<span class="line"><span>│   ├── Dialog</span></span>
<span class="line"><span>│   ├── ErrorBoundary</span></span>
<span class="line"><span>│   ├── Form</span></span>
<span class="line"><span>│   │   ├── Form.css</span></span>
<span class="line"><span>│   │   ├── FormField.jsx</span></span>
<span class="line"><span>│   │   ├── Form.jsx</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   ├── ...</span></span>
<span class="line"><span>│   └── Tooltip</span></span>
<span class="line"><span>├── context</span></span>
<span class="line"><span>│   ├── ...</span></span>
<span class="line"><span>│   └── UserContext.js</span></span>
<span class="line"><span>├── features</span></span>
<span class="line"><span>│   ├── admin</span></span>
<span class="line"><span>│   ├── dashboard</span></span>
<span class="line"><span>│   │   ├── activies</span></span>
<span class="line"><span>│   │   │   └── ActivityList.jsx</span></span>
<span class="line"><span>│   │   ├── charts</span></span>
<span class="line"><span>│   │   │   └── ...</span></span>
<span class="line"><span>│   │   ├── news</span></span>
<span class="line"><span>│   │   │   ├── news.png</span></span>
<span class="line"><span>│   │   │   ├── NewsDetail.jsx</span></span>
<span class="line"><span>│   │   │   └── NewsList.jsx</span></span>
<span class="line"><span>│   │   ├── Dashboard.css</span></span>
<span class="line"><span>│   │   ├── Dashboard.jsx</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   ├── kanban</span></span>
<span class="line"><span>│   │   ├── KanbanBoard.jsx</span></span>
<span class="line"><span>│   │   ├── index.js</span></span>
<span class="line"><span>│   │   └── useFetchCards.js</span></span>
<span class="line"><span>│   ├── home</span></span>
<span class="line"><span>│   ├── login</span></span>
<span class="line"><span>│   ├── ...</span></span>
<span class="line"><span>│   └── user</span></span>
<span class="line"><span>├── hooks</span></span>
<span class="line"><span>│   ├── ...</span></span>
<span class="line"><span>│   └── useLocation.js</span></span>
<span class="line"><span>├── servies</span></span>
<span class="line"><span>│   ├── kanbanService.js</span></span>
<span class="line"><span>│   ├── ...</span></span>
<span class="line"><span>│   └── userService.js</span></span>
<span class="line"><span>├── index.css</span></span>
<span class="line"><span>└── index.jsx</span></span>
<span class="line"><span>对应上面的例子，首先建立 features 目录， features 下面的一级目录都对应一个相对完</span></span></code></pre></div><p>整的业务功能，目录中有实现这一功能的各类代码。</p><p>对于部分体量比较大的功能，可以根据需要在一级目录下加入二级目录，每个二级目录都对应一个相对独立的子功能（业务），目录内部是实现子功能的各类代码。必要时还可以加入三</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>级、四级目录，但总体目录层级不应过深。所以我们说，在 features 目录，可以从横向、</span></span></code></pre></div><p>纵向两个方向扩展功能点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在 features 目录之外，为公用的代码建立一系列职能型的目录，包括可重用组件的</span></span>
<span class="line"><span>components 目录、可重用 Hooks 的 hooks 目录； context 目录的主要目的不是重用，</span></span>
<span class="line"><span>而是跨业务功能使用 context； services 目录下，集中定义了整个应用会用到的远程服务，</span></span></code></pre></div><p>避免四散到各个业务模块中，甚至硬编码（Hardcode）。这些公用代码的目录层级不宜太深，以一到二级为主。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>从代码的导入导出关系来看，在 features 目录下，原则上同级目录间的文件不应互相导</span></span>
<span class="line"><span>入，二级、三级目录只应被直接上一级目录导入，不能反过来被下一级目录导入。features</span></span>
<span class="line"><span>目录的代码可以导入公用目录的代码，反过来公用目录的代码不能导入features 目录的代</span></span></code></pre></div><p>码。在任何时候都应该避免循环导入（Circular Import）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%B0%E4%BB%A3ReactWeb%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/20/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%8E%B0%E4%BB%A3ReactWeb%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/20/3.png" alt=""></a></p><p>来对应一下前面的逻辑架构图：</p><ul><li><p>图中的功能模块 1、功能模块 2 再到功能模块 m 这一行，可以对应到 features 目录；</p></li><li><p>图中的服务器通信、前端路由、表单处理、错误处理这一行，可以分别对应到公用的services 目录、hooks 目录、components 目录；</p></li><li><p>虽然在目录结构中没有体现，但用户认证、用户授权、前端监控等，也可以放到公用目录中实现。</p></li></ul><p>这节课到目前为止讲到的目录结构，都是以单个 React 项目为前提的。</p><p>根据实际项目需要，也有很多 React 项目使用了多项目或者 monorepo 的方式来开发和扩展，虽然编译构建、CI/CD 更加复杂了，但更有利于多个团队的协作，提高整体开发效率。在这样的实践中，可以把追加功能点到同一个 React 项目（或 monorepo 的包）看作纵向扩展，把特定模块、可复用组件和逻辑抽取为独立 React 项目（或 monorepo 的包）看作横向扩展。</p><h3 id="模块导入路径过长怎么办" tabindex="-1">模块导入路径过长怎么办？ <a class="header-anchor" href="#模块导入路径过长怎么办" aria-label="Permalink to &quot;模块导入路径过长怎么办？&quot;">​</a></h3><p>在大中型 React 项目中，有时会遇到这样的 import 语句：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">a</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">b</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">c</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">d</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">f</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">g</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">MyComponent.jsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Dialog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../../../../../../../../components/Dialog&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>这种情况，首先要确定 MyComponent.jsx 是否真有必要放到这么深的路径下。如果发现这在项目中是个普遍情况，那可以利用 Node.js 的Subpath Imports功能（Vite 中尚未支持），或是由前端构建工具提供的非标准的 module 别名（Alias）功能。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Subpath Imports</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Dialog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;#components/Dialog&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Alias</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Dialog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@components/Dialog&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天这节课，我们了解了如何从整体层面应对大中型 React 应用逻辑的扩展，学习了 5 种典型的 React 项目文件目录结构，对比了它们各自的优劣势和适用项目规模。</p><p>然后学习了以按业务功能划分为主，结合按组件、按文件职能划分的目录结构的方式，来应对大中型 React 项目。同时也强调了前端应用逻辑架构对应用逻辑扩展的指导作用。</p><p>专栏的第三模块到目前为止，我们已经学习了大中型 React 项目的数据流、局部和整体逻辑的相关实践。</p><p>下节课我们会暂时从应用业务开发中跳出来，了解一下常见的 React 性能问题和优化方案。这些性能优化方案对各种规模的 React 应用基本都适用，目标都是保证优秀的用户体验。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>其实在业界，React 项目中经常会有一个名叫 common 的目录。如果在这节课里讲到的，</span></span>
<span class="line"><span>大中型 React 项目推荐的文件目录结构中，设置一个这样的 common 目录，你会往这个目</span></span></code></pre></div><ul><li>录里放什么文件？不放什么文件？为什么？</li></ul><ol start="2"><li>在第 5 节课的思考题中：</li></ol><ul><li>除了浏览器，你在电脑上最常用的桌面应用是什么？是不是 macOS 的 Finder 或 Windows的资源管理器？如果是的话就好办了。请你尝试把 Finder 或资源管理器当作要用 React 开发的 Web 应用，按自己的理解做一遍组件拆分。</li></ul><p>现在已知 Finder 或资源管理器是大型 React 项目，请你为这个项目设计一套文件目录结构，记得把自己在第 5 节课设计的组件文件都放进去。</p>`,92)])])}const g=a(e,[["render",l]]);export{k as __pageData,g as default};
