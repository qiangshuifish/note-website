import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"09 | 主题方案和基础组件：如何设计组件库的主题方案？","description":"","frontmatter":{},"headers":[{"level":2,"title":"组件库的主题方案设计需要做什么准备？","slug":"组件库的主题方案设计需要做什么准备","link":"#组件库的主题方案设计需要做什么准备","children":[]},{"level":2,"title":"如何实现组件库主题方案？","slug":"如何实现组件库主题方案","link":"#如何实现组件库主题方案","children":[]},{"level":2,"title":"如何开发一个多状态的按钮组件？","slug":"如何开发一个多状态的按钮组件","link":"#如何开发一个多状态的按钮组件","children":[]},{"level":2,"title":"如何对多状态的按钮组件进行主题控制？","slug":"如何对多状态的按钮组件进行主题控制","link":"#如何对多状态的按钮组件进行主题控制","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Vue3企业级项目实战课/09｜主题方案和基础组件：如何设计组件库的主题方案？.md","filePath":"Vue3企业级项目实战课/09｜主题方案和基础组件：如何设计组件库的主题方案？.md","lastUpdated":1795535737000}'),l={name:"Vue3企业级项目实战课/09｜主题方案和基础组件：如何设计组件库的主题方案？.md"};function e(t,s,h,r,k,E){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_09-主题方案和基础组件-如何设计组件库的主题方案" tabindex="-1">09 | 主题方案和基础组件：如何设计组件库的主题方案？ <a class="header-anchor" href="#_09-主题方案和基础组件-如何设计组件库的主题方案" aria-label="Permalink to &quot;09 | 主题方案和基础组件：如何设计组件库的主题方案？&quot;">​</a></h1><p>你好，我是杨文坚。</p><p>在上一节课的 Vue.js 3.x 自研组件库的开发入门中我提到，组件库有一个重要的作用，就是“可定制化主题”。那么，什么是“可定制化主题”呢？</p><p>如果你在电商企业中进行业务功能的前端页面开发，原有使用的组件库是蓝色风格的样式，但是想在节假日里快速转变成红色风格的组件样式，再比如，如果你开发的页面是亮色系的效果，哪天产品经理需要前端快速实现暗色系的黑夜效果，提升用户夜间的使用体验，那么，你会怎么做前端页面的改造呢？</p><p>这些场景，都要处理前端页面整体颜色以及视觉风格的变化，这类“变化”在前端开发中一般定义为“主题”的控制，也就是“可定制化主题”。</p><p>作为负责业务需求的前端开发者，一般都尽量专注业务功能点的开发，页面的主题风格定制能力通常是在组件库中管理。那么，组件库的前端开发者，就需要提供一套能控制组件的主题风格的组件库，提供给业务前端开发者直接使用。这样，业务前端开发者不需要关心组件库的主题方案如何实现，只需要根据组件库的使用规范“开箱即用”就好。</p><p>那么，如何设计组件库的主题实现呢？我们先来看看主题方案设计需要做什么准备。</p><h2 id="组件库的主题方案设计需要做什么准备" tabindex="-1">组件库的主题方案设计需要做什么准备？ <a class="header-anchor" href="#组件库的主题方案设计需要做什么准备" aria-label="Permalink to &quot;组件库的主题方案设计需要做什么准备？&quot;">​</a></h2><p>既然是方案设计，首先要做的是方案的规范准备，这里主题的方案设计需要准备以下两种规范：</p><ul><li><p>颜色的设计规范；</p></li><li><p>CSS 的开发规范。</p></li></ul><p>前面我们提到，页面主题的变化主要是整体颜色视觉风格的变化。而且，使用组件库开发，业务功能页面控制主题是通过组件库的内置主题系统来控制的。所以，我们主题方案设计的第一步就是需要设计好组件库的颜色规范。</p><p>这里要明确一点，颜色规范设计通常不是前端开发者的职责工作，而是设计师的工作。但是前端作为设计稿和实现代码之间的“桥梁”，需要做好设计稿的沟通和讨论。不过，设计师一般对颜色规范设计的流程比较严格，也有很多讲究。所以，作为前端开发者，我们有必要简单了解这些颜色规范设计的过程。</p><p>第一步是颜色种类的选择。一般设计师会选择几种大类型的颜色，例如红色、蓝色和绿色等。然后根据业务需要挑选这几类型中的一个基准色号。</p><p>第二步，基于上一步选择好的基准色号，进行颜色梯度的处理，例如颜色亮度和饱和度从浅到深的梯度处理。举个例子，灰色的颜色梯度处理如下图片所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/1.png" alt=""></a></p><p>最后一步，也就是第三步，根据不同颜色的颜色梯度，进行语义化使用处理。我们拿上述灰色每个梯度的颜色来“语义化处理”，将“灰色 1 号”作为页面背景颜色，“灰色 10 号”作为页面的字体颜色。效果如下述所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/2.png" alt=""></a></p><p>到这里，你可能会有疑惑，如果只是前端程序员自发建设组件库，没有设计师参与设计，要如何做颜色的设计规范呢？</p><p>这类无设计师的情况你也不用担心，有很多开源组件库都提供了现成的颜色设计规范。例如Ant Design 官方团队的颜色规范、Element Plus 官方团队的颜色规范都可以直接参考。</p><p>当然，这些颜色的设计规范都是面向设计师的，前端开发者在其中只是参与讨论，最终还是需要设计师来拍板敲定颜色的设计规范。</p><p>但接下来的将颜色规范的设计内容转变成代码的部分，就是前端开发者能拍板的领域了。</p><p>前端开发中对组件库的主题开发和控制主要基于 CSS 来处理的，所以在开发之前，我们要制定 CSS 的开发规范。</p><p>首先，我们要选择 CSS 的预处理器语言来开发，主要利用 CSS 预处理器语言的“可编程的逻辑语法”来编写 CSS。目前主流的 CSS 的预处理器语言有 Less 和 Sass，两者语法比较类似。</p><ul><li><p>Less，对 CSS 原始语法增加了少许方便的扩展，例如函数、运算等语法，学习更容易</p></li><li><p>预处理器 Sass，语法更加丰富和全面。</p></li></ul><p>两种预处理器语言都有很多开源组件库都在使用，例如 Ant Design 使用了 Less，ElementPlus 选择了 Sass。这里我们主要选择 Less 来开发组件库的 CSS 代码，主要是考虑到 Less简单易用，能满足绝大部分的开发需要。</p><p>我们可以用 Less 里的变量语法来管理所有的颜色梯度，如下述代码所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@gray-1: #f5f5f5;</span></span>
<span class="line"><span>@gray-2: #f0f0f0;</span></span>
<span class="line"><span>@gray-3: #d9d9d9;</span></span>
<span class="line"><span>@gray-4: #bfbfbf;</span></span>
<span class="line"><span>@gray-5: #8c8c8c;</span></span>
<span class="line"><span>@gray-6: #595959;</span></span>
<span class="line"><span>@gray-7: #434343;</span></span>
<span class="line"><span>@gray-8: #262626;</span></span>
<span class="line"><span>@gray-9: #1f1f1f;</span></span>
<span class="line"><span>@gray-10: #141414;</span></span></code></pre></div><p>不过，虽然我们已经有了 Less 作为预处理器语法来管理 CSS 代码，例如主题颜色梯度都用了 Less 变量语法来管理，但接下来我们还要管理具体组件的主题样式上面，而且还要语义化控制到具体某个组件的某个维度的颜色。</p><p>什么是语义化颜色呢？一个按钮的背景颜色是“蓝色 1 号”，语义化颜色就是将“蓝色 1 号”语义化给了按钮背景颜色。但是实际中，组件语义化的内容维度是有很多层次的。</p><p>一个按钮的颜色，有背景颜色、字体颜色和边框颜色这一整套颜色体系，在按钮默认状态、点击状态和禁用状态时，背景、字体和边框颜色又需要独立的一套新的颜色体系。这个时候，就有三套颜色体系。如果再叠加一个按钮类型，例如是“实心颜色”的按钮和“空心颜色”的按钮，就演变成 3x2 的 6 种颜色体系。</p><p>你想，就这一个按钮组件，都有 6 种颜色体系，那如何做好 CSS 的语义化代码管理和维护呢？如果再来一个“白天”和“黑夜”模式的主题切换颜色功能，那要如何管理呢？</p><p>这个时候就需要用到 CSS Variable 来管理语义化的组件颜色了。</p><p>什么是 CSS Variable 呢？就是 CSS 自定义属性，也可以称作 CSS 变量或者级联变量，主要是 CSS 代码在浏览器中，定义一个 CSS 属性（或者称为“变量”）后，这个 CSS 属性就可以在页面中全局其它 CSS 代码中使用，甚至是覆盖重写。例如下面代码所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: my</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vue;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@white: #ffffff;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@black: #</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">222222</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@gray</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #bfbfbf;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:root {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 页面背景颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @white;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 页面字体颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">text</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @black;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 页面通用边框颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">border</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @gray</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">box {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-page-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-page-text-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>这里的代码是用 Less 来管理颜色梯度，再用 CSS Variable 来使用颜色梯度的 Less 变量，同时语义化来管理不同维度的语义化颜色。CSS Variable 更多的用法可以参考这个官方文档。</p><p>我们现在有了颜色设计规范和 CSS 开发规范，最后要面临的问题就是“如何实现组件库的主题方案”了，我下面就用一个最简单的案例来实现一个主题方案，示范一下。</p><h2 id="如何实现组件库主题方案" tabindex="-1">如何实现组件库主题方案？ <a class="header-anchor" href="#如何实现组件库主题方案" aria-label="Permalink to &quot;如何实现组件库主题方案？&quot;">​</a></h2><p>在讲解组件库的主题方案前，我们先看看效果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/3.png" alt=""></a></p><p>在这张动图中，我实现了一个组件 Box，设置了组件语义化的背景色和字体色，切换主题的时候，就用 className 的优先级来控制语义化的 CSS Variable，也就是用新主题的颜色样式覆盖掉原有的默认主题的颜色样式，达到动态切换主题。</p><p>具体代码如下述所示。Box 组件的 Less 代码：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: my</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vue;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@white: #ffffff;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@black: #</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">222222</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@gray</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #bfbfbf;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ...</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 默认明亮主题颜色</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:root {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 页面背景颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @white;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 页面字体颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">text</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @black;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:root {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 暗黑主题颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">theme</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dark {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 页面背景颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @black;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 页面字体颜色</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   --</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@{prefix-name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">page</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">text</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">color: @white;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">box {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-page-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-page-text-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Box 组件的 Vue 代码：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​div :class=&quot;{ [baseClassName]: true }&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​slot v-if=&quot;$slots.default&quot;&gt;&lt;​/slot&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme/index&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const baseClassName = \`\${prefixName}-box\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>Box 组件的使用代码：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Box</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;example&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div :style=&quot;{ padding: 10, fontSize: 24 }&quot;&gt;这是一个主题演示案例&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​button @click=&quot;onClick&quot;&gt;点击换主题色&lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { Box } from &#39;../src&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../src/theme/index&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const onClick = () =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const darkThemeName = \`\${prefixName}-theme-dark\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> const html = document.querySelector(&#39;html&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> if (html?.classList.contains(darkThemeName)) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   html?.classList.remove(darkThemeName);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   html?.classList.add(darkThemeName);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​style&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">html,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">body {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> width: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.example {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> padding: 100px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> box-sizing: border-box;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> text-align: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/style&gt;</span></span></code></pre></div><p>通过上述“明亮主题”和“暗黑主题”的切换代码和演示案例，你会发现，组件库的主题方案设计核心就是颜色规范 + CSS Variable 控制。是不是很简单？</p><p>其实，理论上是可以这么简单理解的，但是实际在组件库的每个组件开发过程中，我们要做好组件内部的主题方案的实现，还是有点“复杂度”的。</p><p>这个“复杂度”体现在不同组件的使用场景不同，不同组件的主题方案都要“因地制宜”来实现。具体情况，我给你演示一个基础的组件实现，你就知道了。接下来我就给你演示一下，如何开发一个常见的多状态的按钮组件。</p><h2 id="如何开发一个多状态的按钮组件" tabindex="-1">如何开发一个多状态的按钮组件？ <a class="header-anchor" href="#如何开发一个多状态的按钮组件" aria-label="Permalink to &quot;如何开发一个多状态的按钮组件？&quot;">​</a></h2><p>在开发组件前，还是先演示一下最终的效果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/4.png" alt=""></a></p><p>上面动图中，演示的是常见组件库里实现的按钮组件，具备多种组件的状态维度，这里维度分成按钮类型、按钮变种（种类）和按钮禁用状态。其中按钮类型有 Default、Primary，Success、Warn 和 Danger 这五类，按钮变种有 Contented 和 Outlined 两类，按钮禁用状态有 Enabled 和 Disabled 两类。</p><p>总的来讲，上述按钮有这三种维度状态，也就是类型、变种和是否禁用。那么，如何实现这个三种维度的叠加管理呢？分解成这三个步骤：</p><ul><li><p>第一步，基础按钮组件样式的开发；</p></li><li><p>第二步，实现按钮不同维度组合的样式；</p></li><li><p>第三步，组件的使用状态叠加。</p></li></ul><p>第一步，基础按钮组件的样式开发，也就是实现一个按钮的“底座”，后续可以基于这个底座做各类维度叠加的样式开发，具体代码如下述所示。</p><p>Less 代码：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">relative</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> display: inline</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-block</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> font</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-weight</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">400</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> white</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">space: nowrap;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> text-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">align: center;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> cursor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: pointer;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> user</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-select</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">none</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> touch</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-action</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: manipulation;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> height: 32px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> padding: 4px 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> font</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 14px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> border</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">radius: 2px;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> box-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sizing: border</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> border</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">width: 1px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>注意了，我这里将所有颜色梯度规范代码全部放了在本节课源码里的./packages/components/theme/variable.less 文件中管理，也用了同样的 variable.less 文件来管理 CSS 的公共命名前缀。</p><p>Vue 代码：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :class=&quot;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     [baseClassName]: true,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​slot v-if=&quot;$slots.default&quot;&gt;&lt;​/slot&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme/index&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const baseClassName = \`\${prefixName}-button\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>这里也要注意，我这里将 className 的公共命名前缀放在./packages/components/theme/index.ts 中管理，前缀名称跟./packages/components/theme/variable.less 里保持一致，方便后续统一更换。</p><p>第二步，实现按钮不同维度组合的样式，也就是我们要根据不同状态维度的组合来实现样式的叠加。我先将按钮的不同维度的样式的 className 做个统一的管理，其中按钮类型和按钮变种统一管理，形成 5 x 3 的 15 个基础按钮样式。</p><p>具体 CSS Variable 语义化，如下面所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>:root {</span></span>
<span class="line"><span> // 按钮 default-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-color: @gray-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-border-color: @gray-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-bg-color: @gray-6;</span></span>
<span class="line"><span> // 按钮 primary-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-color: @blue-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-border-color: @blue-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-bg-color: @blue-6;</span></span>
<span class="line"><span> // 按钮 success-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-color: @green-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-border-color: @green-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-bg-color: @green-6;</span></span>
<span class="line"><span> // 按钮 warning-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-color: @gold-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-border-color: @gold-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-bg-color: @gold-6;</span></span>
<span class="line"><span> // 按钮 danger-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-color: @red-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-border-color: @red-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-bg-color: @red-6;</span></span>
<span class="line"><span> // 按钮 default-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-color: @gray-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-border-color: @gray-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-bg-color: @gray-1;</span></span>
<span class="line"><span> // 按钮 primary-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-color: @blue-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-border-color: @blue-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-bg-color: @blue-1;</span></span>
<span class="line"><span> // 按钮 success-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-color: @green-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-border-color: @green-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-bg-color: @green-1;</span></span>
<span class="line"><span> // 按钮 warning-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-color: @gold-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-border-color: @gold-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-bg-color: @gold-1;</span></span>
<span class="line"><span> // 按钮 danger-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-color: @red-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-border-color: @red-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-bg-color: @red-1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>具体 className 组合实现如下述所示：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@import </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;../../theme/variable.less&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // ....</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // contented</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-default-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">contained {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-default-contained-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-default-contained-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-default-contained-border-color)&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">primary</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">contained {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-primary-contained-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-primary-contained-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-primary-contained-border-color)&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">success</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">contained {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-success-contained-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-success-contained-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-success-contained-border-color)&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">warning</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">contained {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-warning-contained-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-warning-contained-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-warning-contained-border-color)&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">danger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">contained {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-danger-contained-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-danger-contained-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-danger-contained-border-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // outlined</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-default-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">outlined {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-default-outlined-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-default-outlined-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-default-outlined-border-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">primary</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">outlined {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-primary-outlined-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-primary-outlined-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-primary-outlined-border-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">success</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">outlined {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-success-outlined-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-success-outlined-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-success-outlined-border-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">warning</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">outlined {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-warning-outlined-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-warning-outlined-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-warning-outlined-border-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.@{prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">danger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">outlined {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-danger-outlined-bg-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-danger-outlined-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">~</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;var(--@{prefix-name}-btn-danger-outlined-border-color)&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Vue 代码实现如下：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :class=&quot;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     [baseClassName]: true,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     [btnClassName]: true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​slot v-if=&quot;$slots.default&quot;&gt;&lt;​/slot&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme/index&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import type { ButtonType, ButtonVariant } from &#39;./types&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const props = withDefaults(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> defineProps&lt;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   type?: ButtonType;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   variant?: ButtonVariant;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt;(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   type: &#39;default&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   variant: &#39;contained&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   disabled: false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const baseClassName = \`\${prefixName}-button\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const btnClassName = \`\${baseClassName}-\${props.type}-\${props.variant}\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>实现后的效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/5.png" alt=""></a></p><p>接下来实现按钮禁用的样式，主要也是通过添加 className，利用其添加在后面，优先级更高来覆盖样式，具体实现代码如下：</p><p>Less 代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@import &#39;../../theme/variable.less&#39;;</span></span>
<span class="line"><span>.@{prefix-name}-button {</span></span>
<span class="line"><span> // ...</span></span>
<span class="line"><span> &amp;.@{prefix-name}-button-disabled {</span></span>
<span class="line"><span>   opacity: 0.5;</span></span>
<span class="line"><span>   cursor: not-allowed;</span></span>
<span class="line"><span>   &amp;:hover {</span></span>
<span class="line"><span>     opacity: 0.5;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Vue 代码改造后如下：</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :class=&quot;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     [baseClassName]: true,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     [btnClassName]: true,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     [disabledClassName]: props.disabled</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​slot v-if=&quot;$slots.default&quot;&gt;&lt;​/slot&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/template&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script setup lang=&quot;ts&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { prefixName } from &#39;../theme/index&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import type { ButtonType, ButtonVariant } from &#39;./types&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const props = withDefaults(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> defineProps&lt;{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   type?: ButtonType;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   variant?: ButtonVariant;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   disabled?: boolean;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt;(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   type: &#39;default&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   variant: &#39;contained&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   disabled: false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const baseClassName = \`\${prefixName}-button\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const btnClassName = \`\${baseClassName}-\${props.type}-\${props.variant}\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const disabledClassName = \`\${baseClassName}-disabled\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>实现上述代码后，使用该按钮组件枚举所有按钮状态叠加效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Vue3%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98%E8%AF%BE/images/09/6.png" alt=""></a></p><p>第三步，就是实现按钮其他状态叠加，例如鼠标悬浮时候（Hover）等状态，也是添加对应的CSS Variable，然后在 Less 里使用对应变量。因为这里实现都是一些重复性的代码操作，所以我就不多讲了，留给你来实现或者你可以后续看本课程的完整源码案例。</p><p>到了这一步，我们就已经实现了一个多状态的 Vue.js 3.x 按钮组件，可以通过传入不同的Props 来控制显示不同的状态样式和状态叠加的样式。</p><p>讲到这，你是不是已经觉得“复杂度”有所提升了？其实这个按钮组件的复杂度基本就到此为止了，也就是说这个按钮的“基础底座”已经实现了。</p><p>我们接下来要做的就是基于已有的“底座”，也就是已经实现好的按钮语义化的 className 和CSS Variable，来配置主题控制和样式主题的切换效果。</p><h2 id="如何对多状态的按钮组件进行主题控制" tabindex="-1">如何对多状态的按钮组件进行主题控制？ <a class="header-anchor" href="#如何对多状态的按钮组件进行主题控制" aria-label="Permalink to &quot;如何对多状态的按钮组件进行主题控制？&quot;">​</a></h2><p>通过上述的规范设计阶段，我们应该知道，主题核心就是颜色梯度的控制，我们在处理按钮组件的不同颜色的时候，只是选择某个颜色的某个梯度号。也就是说，当我们想按钮主题风格时候，只需要控制“颜色”和“梯度”就行了，再覆盖对应的 CSS Variable，就能实现主题快速切换，不需要关注其他。</p><p>我这里具体拆解成两步：</p><ul><li><p>第一步，对按钮不同状态维度组合选择对应色板的颜色梯度；</p></li><li><p>第二步，将选好的颜色用新 className 来覆盖原来的 CSS Variable。</p></li></ul><p>刚刚实现按钮组件是默认的“明亮”模式的主题，我现在针对按钮组件按钮的所有维度状态，快速实现一个“暗黑”主题的颜色效果。这里可以直接切换颜色“梯度”，直接从取梯度号的镜像号数，例如“蓝色 2 号”的就换成“蓝色 8 号”来替换。</p><p>然后按照第二步的操作，全部替换到对应的 CSS Variable，根据 className 优先级操作，来覆盖主题样式，具体代码如下述所示：</p><p>明亮主题 Less 代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@import &quot;./variable.less&quot;;</span></span>
<span class="line"><span>:root {</span></span>
<span class="line"><span> // 按钮 default-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-color: @gray-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-border-color: @gray-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-bg-color: @gray-6;</span></span>
<span class="line"><span> // 按钮 default-contained: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-color-hover: @gray-2;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-border-color-hover: @gray-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-contained-bg-color-hover: @gray-8;</span></span>
<span class="line"><span> // 按钮 primary-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-color: @blue-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-border-color: @blue-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-bg-color: @blue-6;</span></span>
<span class="line"><span> // 按钮 primary-contained: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-color-hover: @blue-2;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-border-color-hover: @blue-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-contained-bg-color-hover: @blue-8;</span></span>
<span class="line"><span> // 按钮 success-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-color: @green-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-border-color: @green-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-bg-color: @green-6;</span></span>
<span class="line"><span> // 按钮 success-contained: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-color-hover: @green-2;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-border-color-hover: @green-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-contained-bg-color-hover: @green-8;</span></span>
<span class="line"><span> // 按钮 warning-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-color: @gold-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-border-color: @gold-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-bg-color: @gold-6;</span></span>
<span class="line"><span> // 按钮 warning-contained: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-color-hover: @gold-2;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-border-color-hover: @gold-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-contained-bg-color-hover: @gold-8;</span></span>
<span class="line"><span> // 按钮 danger-contained: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-color: @red-1;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-border-color: @red-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-bg-color: @red-6;</span></span>
<span class="line"><span> // 按钮 danger-contained: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-color-hover: @red-2;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-border-color-hover: @red-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-contained-bg-color-hover: @red-8;</span></span>
<span class="line"><span> // 按钮 default-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-color: @gray-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-border-color: @gray-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-bg-color: @gray-1;</span></span>
<span class="line"><span> // 按钮 default-outlined: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-color-hover: @gray-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-border-color-hover: @gray-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-default-outlined-bg-color-hover: @gray-2;</span></span>
<span class="line"><span> // 按钮 primary-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-color: @blue-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-border-color: @blue-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-bg-color: @blue-1;</span></span>
<span class="line"><span> // 按钮 primary-outlined: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-color-hover: @blue-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-border-color-hover: @blue-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-primary-outlined-bg-color-hover: @blue-2;</span></span>
<span class="line"><span> // 按钮 success-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-color: @green-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-border-color: @green-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-bg-color: @green-1;</span></span>
<span class="line"><span> // 按钮 success-outlined: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-color-hover: @green-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-border-color-hover: @green-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-success-outlined-bg-color-hover: @green-2;</span></span>
<span class="line"><span> // 按钮 warning-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-color: @gold-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-border-color: @gold-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-bg-color: @gold-1;</span></span>
<span class="line"><span> // 按钮 warning-outlined: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-color-hover: @gold-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-border-color-hover: @gold-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-warning-outlined-bg-color-hover: @gold-2;</span></span>
<span class="line"><span> // 按钮 danger-outlined: 默认状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-color: @red-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-border-color: @red-6;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-bg-color: @red-1;</span></span>
<span class="line"><span> // 按钮 danger-outlined: Hover状态</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-color-hover: @red-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-border-color-hover: @red-8;</span></span>
<span class="line"><span> --@{prefix-name}-btn-danger-outlined-bg-color-hover: @red-2</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>暗黑主题 Less 代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@import &quot;../variable.less&quot;;</span></span>
<span class="line"><span>:root {</span></span>
<span class="line"><span> &amp;.@{prefix-name}-theme-dark {</span></span>
<span class="line"><span>   // 按钮 default-contained: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-contained-color: @gray-9;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-contained-border-color: @gray-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-contained-bg-color: @gray-4;</span></span>
<span class="line"><span>   // 按钮 default-contained: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-contained-color-hover: @gray-8;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-contained-border-color-hover: @gray-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-contained-bg-color-hover: @gray-2;</span></span>
<span class="line"><span>   // 按钮 primary-contained: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-contained-color: @blue-9;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-contained-border-color: @blue-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-contained-bg-color: @blue-4;</span></span>
<span class="line"><span>   // 按钮 primary-contained: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-contained-color-hover: @blue-8;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-contained-border-color-hover: @blue-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-contained-bg-color-hover: @blue-2;</span></span>
<span class="line"><span>   // 按钮 success-contained: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-contained-color: @green-9;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-contained-border-color: @green-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-contained-bg-color: @green-4;</span></span>
<span class="line"><span>   // 按钮 success-contained: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-contained-color-hover: @green-8;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-contained-border-color-hover: @green-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-contained-bg-color-hover: @green-2;</span></span>
<span class="line"><span>   // 按钮 warning-contained: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-contained-color: @gold-9;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-contained-border-color: @gold-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-contained-bg-color: @gold-4;</span></span>
<span class="line"><span>   // 按钮 warning-contained: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-contained-color-hover: @gold-8;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-contained-border-color-hover: @gold-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-contained-bg-color-hover: @gold-2;</span></span>
<span class="line"><span>   // 按钮 danger-contained: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-contained-color: @red-9;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-contained-border-color: @red-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-contained-bg-color: @red-4;</span></span>
<span class="line"><span>   // 按钮 danger-contained: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-contained-color-hover: @red-8;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-contained-border-color-hover: @red-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-contained-bg-color-hover: @red-2;</span></span>
<span class="line"><span>   // 按钮 default-outlined: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-outlined-color: @gray-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-outlined-border-color: @gray-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-outlined-bg-color: @gray-9;</span></span>
<span class="line"><span>   // 按钮 default-outlined: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-outlined-color-hover: @gray-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-outlined-border-color-hover: @gray-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-default-outlined-bg-color-hover: @gray-8;</span></span>
<span class="line"><span>   // 按钮 primary-outlined: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-outlined-color: @blue-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-outlined-border-color: @blue-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-outlined-bg-color: @blue-9;</span></span>
<span class="line"><span>   // 按钮 primary-outlined: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-outlined-color-hover: @blue-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-outlined-border-color-hover: @blue-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-primary-outlined-bg-color-hover: @blue-8;</span></span>
<span class="line"><span>   // 按钮 success-outlined: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-outlined-color: @green-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-outlined-border-color: @green-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-outlined-bg-color: @green-9;</span></span>
<span class="line"><span>   // 按钮 success-outlined: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-outlined-color-hover: @green-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-outlined-border-color-hover: @green-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-success-outlined-bg-color-hover: @green-8;</span></span>
<span class="line"><span>   // 按钮 warning-outlined: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-outlined-color: @gold-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-outlined-border-color: @gold-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-outlined-bg-color: @gold-9;</span></span>
<span class="line"><span>   // 按钮 warning-outlined: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-outlined-color-hover: @gold-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-outlined-border-color-hover: @gold-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-warning-outlined-bg-color-hover: @gold-8;</span></span>
<span class="line"><span>   // 按钮 danger-outlined: 默认状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-outlined-color: @red-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-outlined-border-color: @red-4;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-outlined-bg-color: @red-9;</span></span>
<span class="line"><span>   // 按钮 danger-outlined: Hover状态</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-outlined-color-hover: @red-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-outlined-border-color-hover: @red-2;</span></span>
<span class="line"><span>   --@{prefix-name}-btn-danger-outlined-bg-color-hover: @red-8;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终效果下述所示：</p><p>好了，至此，我们就基于主题方案实现了 Vue.js 3.x 组件库的一个基础组件——按钮组件的功能和主题效果。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课的核心是带你学会 Vue.js 3.x 自研组件库的主题方案设计，以及结合主题方案来开发一个基础组件，了解组件库主题方案实现的完整流程。</p><p>简单来说，组件库的主题方案实现就是三点：</p><ul><li><p>梳理组件库用到的基本颜色和对应的颜色梯度，用 Less 或其他 CSS 预处理器语言来编写；</p></li><li><p>每个组件通过 CSS Variable 来控制各种语义化颜色，例如按钮的背景颜色；</p></li><li><p>主题控制是利用 CSS Varibale 来修改覆盖每个组件里语义化的“颜色”和“梯度号”。</p></li></ul><p>最后我们也通过一个实际的按钮组件，演示了这三点的开发流程，完整实现了一个基础组件按钮组件及主题切换的功能，你可以多动手试一试。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>为什么主题控制只考虑颜色，不考虑组件的尺寸的形状控制呢？</p><p>欢迎留言参与讨论，我会在章节末统一点评，期待见到你的身影。下一讲见。</p><p>完整的代码在这里</p>`,103)])])}const c=a(l,[["render",e]]);export{o as __pageData,c as default};
