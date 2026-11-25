import{_ as n,H as a,f as i,i as l}from"./chunks/framework.BH2BK_3i.js";const c=JSON.parse('{"title":"15 | 直播中心搭建（一）：如何通过Video.js配置直播中心？","description":"","frontmatter":{},"headers":[{"level":2,"title":"直播中心功能梳理","slug":"直播中心功能梳理","link":"#直播中心功能梳理","children":[{"level":3,"title":"中心入口","slug":"中心入口","link":"#中心入口","children":[]},{"level":3,"title":"直播列表","slug":"直播列表","link":"#直播列表","children":[]},{"level":3,"title":"直播详情","slug":"直播详情","link":"#直播详情","children":[]}]},{"level":2,"title":"直播相关页面布局实现","slug":"直播相关页面布局实现","link":"#直播相关页面布局实现","children":[{"level":3,"title":"直播视频列表页的实现","slug":"直播视频列表页的实现","link":"#直播视频列表页的实现","children":[]},{"level":3,"title":"直播详情页的实现","slug":"直播详情页的实现","link":"#直播详情页的实现","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python实战·从0到1搭建直播视频平台/15｜直播中心搭建（一）：如何通过Video.js配置直播中心？.md","filePath":"Python实战·从0到1搭建直播视频平台/15｜直播中心搭建（一）：如何通过Video.js配置直播中心？.md","lastUpdated":1795533265000}'),t={name:"Python实战·从0到1搭建直播视频平台/15｜直播中心搭建（一）：如何通过Video.js配置直播中心？.md"};function p(e,s,E,h,o,k){return a(),i("div",null,[...s[0]||(s[0]=[l(`<h1 id="_15-直播中心搭建-一-如何通过video-js配置直播中心" tabindex="-1">15 | 直播中心搭建（一）：如何通过Video.js配置直播中心？ <a class="header-anchor" href="#_15-直播中心搭建-一-如何通过video-js配置直播中心" aria-label="Permalink to &quot;15 | 直播中心搭建（一）：如何通过Video.js配置直播中心？&quot;">​</a></h1><p>你好，我是 Barry。</p><p>在前面的几节课，我们完成了视频平台整体功能前端的搭建与开发，实现了平台大部分的功能。</p><p>从这节课起，我们更上一层楼，一起来学习实践直播中心的搭建与配置。直播中心是视频平台中较为核心的功能模块，近几年，随着直播的大火，很多的公司开始进军直播行业，对相关人才的需求也在与日俱增。</p><p>直播中心应该具备哪些功能？界面设计该怎么做？业务逻辑又该如何编排？接下来，我们一起来揭秘，从 0 到 1 一步步设计和实现一个直播中心模块。</p><h2 id="直播中心功能梳理" tabindex="-1">直播中心功能梳理 <a class="header-anchor" href="#直播中心功能梳理" aria-label="Permalink to &quot;直播中心功能梳理&quot;">​</a></h2><p>直播中心的核心功能就是视频直播，让用户在平台内通过直播形式把自己期望展示的内容呈现出来。直播的种类一定是非常多元的，比方说营销带货、直播上课、生活日常、游戏直播等等形式。丰富的直播种类可以覆盖到更多用户的偏好，让用户对视频平台更加喜爱。</p><p>我们这就一起来梳理一下，用户在直播中心的操作动线以及中心内整体的功能设计。我用思维框架图的方式整理了整个直播中心的大框架，你可以先看一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/1.png" alt=""></a></p><h3 id="中心入口" tabindex="-1">中心入口 <a class="header-anchor" href="#中心入口" aria-label="Permalink to &quot;中心入口&quot;">​</a></h3><p>整个直播中心作为一个功能模块，我们首先要关注的就是用户操作动线。用户操作的起点自然是直播的入口，我们在哪里呈现入口呢？</p><p>这里我们要考虑到，这一模块的使用包括两种角色。</p><p>一种角色是作为直播的观众。用户在平台首页可以看到直播中心入口，点击进入直播列表，直播列表主要呈现的就是当前正在直播的所有视频，并且要分类别展示。用户可以点击任意视频，进入到直播的详情页。</p><p>另一种角色就是主播。主播需要在平台内直接发起直播。因为发起直播属于常用功能，我们把它归类为与用户维度紧密相关的功能模块，所以把该入口放在用户个人下拉列表中，用户可以直接操作，发起直播功能。</p><p>两个入口的位置如下图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/2.png" alt=""></a></p><h3 id="直播列表" tabindex="-1">直播列表 <a class="header-anchor" href="#直播列表" aria-label="Permalink to &quot;直播列表&quot;">​</a></h3><p>直播列表是直播中心的必备功能，你也可以把它理解为平台的直播视频区。它的作用是呈现正在直播的视频，便于用户根据自己的喜好查看选择。</p><p>在这里我们需要做两个功能模块。第一区块用于展示热门直播，向用户推荐一些优质高粉丝量的直播视频，供用户选择观看。</p><p>第二区块是直播分类展区，我们需要分类展示直播视频，大致分区可以和视频首页的分区保持一致。这是因为，全部视频放在一起呈现显得非常冗杂，而分类展示更容易让用户清晰地锁定自己喜欢的类别。</p><h3 id="直播详情" tabindex="-1">直播详情 <a class="header-anchor" href="#直播详情" aria-label="Permalink to &quot;直播详情&quot;">​</a></h3><p>当用户点击查看自己喜欢的直播视频后，就会从列表页面跳转到直播详情页面，这个功能逻辑与视频列表到视频详情列表的功能逻辑相似，但是呈现的效果和功能是完全不同的。</p><p>在视频直播详情页，我们主要展示的就是直播介绍、主播的相关信息和直播内容，并设置相关的互动功能（例如弹幕、点赞），这样我们就能满足用户对直播的功能需求。当然，还有一些能提升用户使用体验的特色功能，比方说在这里放一些同类型热度较高的直播视频列表，方便用户可在详情页里实现直播内容的切换，而不用回退到首页再进入其他直播视频。</p><p>好，我们已经从用户视角对整个直播中心模块做了功能梳理，现在整个功能动线就非常清晰了，接下来我们一起来看看具体功能的实现。</p><h2 id="直播相关页面布局实现" tabindex="-1">直播相关页面布局实现 <a class="header-anchor" href="#直播相关页面布局实现" aria-label="Permalink to &quot;直播相关页面布局实现&quot;">​</a></h2><p>这里我给准备了一张直播界面的样例图作为参考，接下来我们一起看看怎样实现相应的功能开发吧。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/3.png" alt=""></a></p><h3 id="直播视频列表页的实现" tabindex="-1">直播视频列表页的实现 <a class="header-anchor" href="#直播视频列表页的实现" aria-label="Permalink to &quot;直播视频列表页的实现&quot;">​</a></h3><p>我们把整个页面切割成上下两个部分。上半部分用来展示在游客访问列表时热度比较高的直播。因此，这一部分我们需要设定一个窗口位，而且我们还要考虑到整个页面动态适配的问题，这样才能保证播放器可以根据不同尺寸大小进行适配，具体可以采用 Element 的 Layout组件来实现，</p><p>Layout 组件主要用于做页面布局，可以按我们设定好的参数对页面进行切割分块。</p><p>整体页面的块数一共是 24 份，你可以随意切割，只要相加起来的和为 24 就可以。Layout 组件相比传统的 CSS 设定尺寸的模式会更加便捷。</p><p>为了让你明白它的实现方法，我们直接来看后面的官方案例。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//这个是整体一块</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;24&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-dark&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//分割成两块，各占12</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;12&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;12&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//分割成三块，各占8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;8&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;8&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;8&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//分割成四块，各占6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;6&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;6&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;6&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;6&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//分割成六块，各占4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple-light&quot;&gt;&lt;​/div&gt;&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-row&gt;</span></span></code></pre></div><p>具体的参数说明你可以直接参考 Layout 官网 API，这里我们重点需要关注的就是利用Layout 去实现自适应，这部分需要用到后面的参数设置来实现。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/4.png" alt=""></a></p><p>具体实现代码是后面这样。</p><ul><li><p>xs 表示页面在手机展示，屏幕宽度小于 768px</p></li><li><p>sm 表示页面在平板展示，屏幕宽度等于或者大于 768px</p></li><li><p>md 表示页面在 PC 桌面展示，屏幕宽度大于或者等于 768px</p></li><li><p>lg 表示页面在大桌面展示，屏幕宽度大于或者等于 992px</p></li><li><p>xl 表示页面在超大屏幕展示，屏幕宽度大于等于 1200px</p></li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​el-row :gutter=&quot;10&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :xs=&quot;8&quot; :sm=&quot;6&quot; :md=&quot;4&quot; :lg=&quot;3&quot; :xl=&quot;1&quot;&gt;&lt;​div class=&quot;grid-content bg-pur</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :xs=&quot;4&quot; :sm=&quot;6&quot; :md=&quot;8&quot; :lg=&quot;9&quot; :xl=&quot;11&quot;&gt;&lt;​div class=&quot;grid-content bg-pu</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :xs=&quot;4&quot; :sm=&quot;6&quot; :md=&quot;8&quot; :lg=&quot;9&quot; :xl=&quot;11&quot;&gt;&lt;​div class=&quot;grid-content bg-pu</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-col :xs=&quot;8&quot; :sm=&quot;6&quot; :md=&quot;4&quot; :lg=&quot;3&quot; :xl=&quot;1&quot;&gt;&lt;​div class=&quot;grid-content bg-pur</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-row&gt;</span></span></code></pre></div><p>观察前面的代码，相信你可以看出每一行设置的值分别代表了在不同屏幕大小下显示的宽度。同时我们再次验证了在每一种尺寸下，页面横向块数总和加起来总是等于 24，这一点我们在编写的过程中一定要注意。</p><p>借鉴前面的思路，我们继续思考——如果想让播放器能够适应不同屏幕尺寸应该如何实现。具体代码实现是后面这样。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;player&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     &lt;!-- gutter用于间隔列距 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-row :gutter=&quot;10&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     //这里我们应对各类大小，统一设置大小为4个单位</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-col :xs=&quot;4&quot; :sm=&quot;4&quot; :md=&quot;4&quot; :lg=&quot;4&quot; :xl=&quot;6&quot;&gt;这里可以为空，用来占位&lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-col :xs=&quot;16&quot; :sm=&quot;16&quot; :md=&quot;16&quot; :lg=&quot;16&quot; :xl=&quot;12&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;wenzi&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         //当用户鼠标悬浮到页面中央，显示&quot;进入直播间&quot;的字样</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​p @click=&quot;goOnline&quot;&gt;进入直播间&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       &lt;!-- 播放的实现采用组件 -videojs --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​video-player</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         class=&quot;video-player vjs-custom-skin&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         ref=&quot;videoPlayer&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         :playsinline=&quot;true&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         :options=&quot;playerOptions&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         @play=&quot;onPlayerPlay($event)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         @pause=&quot;onPlayerPause($event)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         style=&quot;height:100%&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;&lt;​/video-player&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-col :xs=&quot;4&quot; :sm=&quot;4&quot; :md=&quot;4&quot; :lg=&quot;4&quot; :xl=&quot;6&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       这里我们可以放一些推荐视频，或空着占位</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span></code></pre></div><p>后面是对应的 CSS 代码，其中的重点属性我都做了注释，结合注释你就能明白代码的含义和作用了。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​style&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.player {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> //这是背景图</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background: url(&quot;../../../assets/image/onlineB.png&quot;) no-repeat;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> background-size: 100% 100%; //让图片全部展开 铺满整个区域 图片不满的情况</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .wenzi {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   width: 200px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   height: 300px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   position: absolute; //绝对定位属性</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   left: 48%; //通过距左侧和上侧的距离</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   top: 48%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   p {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     color: #298ce9;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     font-size: 19px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     position: absolute;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     z-index: 9999;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     font-weight: bolder;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     opacity: 0; //透明度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     cursor: pointer;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> //当鼠标悬浮在文字上时，改变层叠级别和透明度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .wenzi:hover p {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   z-index: 9999; //值越高，图层越位于上层</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   opacity: 1; //值越大，透明度越低，以此组合最终把字样展示出来</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/style&gt;</span></span></code></pre></div><p>到这里，我们已经完成了热度直播推荐模块内容呈现的代码设计和实现。你也可以自己发挥想象，对展示的内容进行设计。</p><p>直播分类列表页和首页展示的布局样式一致，我们只需要根据类别来区分就可以了。如果你希望巩固一下自己的 CSS 和 Element 组件库应用能力，课后可以自己试着设计实现一下。</p><h3 id="直播详情页的实现" tabindex="-1">直播详情页的实现 <a class="header-anchor" href="#直播详情页的实现" aria-label="Permalink to &quot;直播详情页的实现&quot;">​</a></h3><p>接下来就是直播详情页的实现。我们同样要提前设计好这一部分都需要展示哪些内容。</p><p>结合详情页面的展示需求，在整个页面最为核心的是两部分：第一部分用来展示主播信息；第二部分就是视频播放器。当然，这个页面里我们也可以展示主播的介绍、个人动态等信息。</p><p>后面是直播详情页的效果预览图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/15/5.png" alt=""></a></p><p>页面的适配我们依旧使用 Layout 组件来实现。</p><p>为了展示主播的基本信息，我们还会应用到一些 Element 的组件，例如头像组件 avatar、标签组件 tag、标签页组件 Tabs，还有大量的 Element 图标 icon。至于样式修饰还是应用 CSS相关属性来实现。你可以参考后面的具体代码实现和详细注释。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;player&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-row :gutter=&quot;10&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​el-col :xs=&quot;3&quot; :sm=&quot;4&quot; :md=&quot;4&quot; :lg=&quot;4&quot; :xl=&quot;4&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​div class=&quot;left&quot;&gt;这里可以放你想展示的内容，考虑到界面的整洁，这一部分非必需&lt;​/div</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       // 下面的模块用于展示直播内容，依旧用Layout做适配</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​el-col :xs=&quot;18&quot; :sm=&quot;16&quot; :md=&quot;16&quot; :lg=&quot;16&quot; :xl=&quot;16&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​el-card class=&quot;card&quot; shadow=&quot;hover&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;onlineT&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             //这里应用的是Element的头像组件，直接对应src放上对应的图片地址即可</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​el-avatar src=&quot;&quot;&gt;&lt;​/el-avatar&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              //以下所有的展示信息都可自定义，只需改变图标和文字描述，当然对应展示的内容是动态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​el-tag class=&quot;online-tag&quot; size=&quot;mini&quot; type=&quot;warning&quot;&gt;直播中&lt;​/el-tag</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​p&gt;一起来体验游戏的魅力&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-share&quot;&gt;分享&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-warning&quot;&gt;举报&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-s-custom&quot;&gt;粉丝 {​{fansNum}​}万&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;line-two&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​el-tag class=&quot;online-lv&quot; effect=&quot;dark&quot; size=&quot;mini&quot; type=&quot;danger&quot;&gt;L</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​p&gt;Barry&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-present&quot;&gt;{​{presentNum}​}&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-star-on&quot;&gt;收藏&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-video-camera-solid&quot;&gt;回放&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-s-flag&quot;&gt;粉丝群&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;el-icon-s-data&quot;&gt;数据&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/el-card&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​div style=&quot;height:80%&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         //这是播放器，后面我们会详细讲解</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​video-player</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             class=&quot;video-player vjs-custom-skin&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             ref=&quot;videoPlayer&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             :playsinline=&quot;false&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             :options=&quot;playerOptions&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             @play=&quot;onPlayerPlay($event)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             @pause=&quot;onPlayerPause($event)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &gt;&lt;​/video-player&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​el-col :xs=&quot;3&quot; :sm=&quot;4&quot; :md=&quot;4&quot; :lg=&quot;4&quot; :xl=&quot;4&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​div&gt;这里可放置内容，也可占空位&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div style=&quot;margin-top:40px&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-row :gutter=&quot;20&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​el-col :span=&quot;16&quot; :offset=&quot;4&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​el-card shadow=&quot;always&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         //这里用到tabs组件，分别展示主播简介和生活动态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         //组件使用较为简单，具体详情也可直接了解element官网</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​el-tabs type=&quot;border-card&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​el-tab-pane&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​span slot=&quot;label&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​i class=&quot;el-icon-user-solid&quot;&gt;主播简介&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               这里是主播的的介绍，</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​br /&gt;吃鸡、王者、战地、CS样样精通</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​br /&gt;个人获得各个赛区的冠军</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​br /&gt;每晚8：00准时开播</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​/el-tab-pane&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​el-tab-pane&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​span slot=&quot;label&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​i class=&quot;el-icon-trophy-1&quot;&gt;个人动态&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 //可用于类似朋友圈信息展示</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​p style=&quot;font-size:16px;color:red;padding-bottom:10px&quot;&gt;今天天</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​img src=&quot;图片地址&quot; alt=&quot;动态图片&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​hr&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​p style=&quot;font-size:16px;color:red;padding-bottom:10px&quot;&gt;努力登</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   &lt;​img src=&quot;图片地址&quot; alt=&quot;登顶&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​/el-tab-pane&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/el-tabs&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/el-card&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/el-col&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span></code></pre></div><p>对应的 CSS 样式是后面这样，你可以和前面代码的 class 值一一对应。具体的代码用途和属性相信你通过注释就能弄明白。</p><p>这里我提供的代码只是参考，掌握了思路以后，你可以灵活应用，还可以自己尝试来实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.player {</span></span>
<span class="line"><span> //背景图展示</span></span>
<span class="line"><span> background: url(&quot;../../../assets/image/onlineB.png&quot;) no-repeat;</span></span>
<span class="line"><span> background-size: 100% 100%; //让图片全部展开 铺满整个区域 图片不满的情况</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.card {</span></span>
<span class="line"><span> background-color: transparent;</span></span>
<span class="line"><span> border-radius: 20px; //设置card圆角</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.onlineT {</span></span>
<span class="line"><span> width: 100%;</span></span>
<span class="line"><span> color: #f2f2f2;</span></span>
<span class="line"><span> padding-left: 10px;</span></span>
<span class="line"><span> img {</span></span>
<span class="line"><span>   width: 40px;</span></span>
<span class="line"><span>   height: 40px;</span></span>
<span class="line"><span>   border-radius: 50%;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .online-tag {</span></span>
<span class="line"><span>   margin-left: 40px;</span></span>
<span class="line"><span>   size: 5px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-share {</span></span>
<span class="line"><span>   font-size: 14px;</span></span>
<span class="line"><span>   float: right;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-warning {</span></span>
<span class="line"><span>   font-size: 14px;</span></span>
<span class="line"><span>   float: right;</span></span>
<span class="line"><span>   padding-right: 10px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-s-custom {</span></span>
<span class="line"><span>   font-size: 14px;</span></span>
<span class="line"><span>   float: right;</span></span>
<span class="line"><span>   padding-right: 10px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-video-play {</span></span>
<span class="line"><span>   content: &quot;\\E7C0&quot;; //Emoji表情符</span></span>
<span class="line"><span>   font-size: 30px;</span></span>
<span class="line"><span>   color: aqua;</span></span>
<span class="line"><span>   margin-left: 40px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> p {</span></span>
<span class="line"><span>   font-size: 18px;</span></span>
<span class="line"><span>   font-weight: bold;</span></span>
<span class="line"><span>   padding: 0 0 0 20px;</span></span>
<span class="line"><span>   color: rgb(231, 157, 18);</span></span>
<span class="line"><span>   display: inline-block;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//以下就是基础应用，你可以完成理解</span></span>
<span class="line"><span>.line-two {</span></span>
<span class="line"><span> width: 500px;</span></span>
<span class="line"><span> color: #f2f2f2;</span></span>
<span class="line"><span> padding: 10px 10px 0 100px;</span></span>
<span class="line"><span> p {</span></span>
<span class="line"><span>   display: inline-block;</span></span>
<span class="line"><span>   font-size: 10px;</span></span>
<span class="line"><span>   margin-left: 6%;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> i {</span></span>
<span class="line"><span>   font-size: 17px;</span></span>
<span class="line"><span>   font-weight: bolder;</span></span>
<span class="line"><span>   margin-left: 10px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-present {</span></span>
<span class="line"><span>   font-size: 17px;</span></span>
<span class="line"><span>   font-weight: bolder;</span></span>
<span class="line"><span>   margin-left: 10px;</span></span>
<span class="line"><span>   color: #f56c6c;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-star-on {</span></span>
<span class="line"><span>   color: greenyellow;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-video-camera-solid {</span></span>
<span class="line"><span>   color: cadetblue;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-s-flag {</span></span>
<span class="line"><span>   color: #f56c6c;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> .el-icon-s-data {</span></span>
<span class="line"><span>   color: blue;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>进行到这里，我们把用户从点击直播中心到观看直播的全部流程都顺下来了。经过这个完整的链路，我们已经实现了游客维度的直播间页面呈现。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好，我们一起来总结回顾一下这节课的重点内容。</p><p>设计直播模块的时候，我们一定要对用户的整个操作动线非常清晰。关键是入口设置、直播列表以及直播详情这三部分，每一个页面都扮演着不同的角色。在这个过程中，我们一定要考虑得非常全面，除了实现基础功能，还要尽量提升用户使用直播功能的体验。</p><p>在页面的实现过程中，你会发现我们应用到了很多 Element 组件来实现布局，例如通过Layout 组件来完成页面适配，这能帮助我们告别冗杂的 CSS 编写，你也可以将其应用在其他任何页面上。</p><p>另外，我们又一次用到 Element 的其他组件来完成互动或展示的需求，加深了对这些组件的熟悉程度。善用组件不但能提高实现效率，还会让页面更美观。以后你遇到相关的样式呈现，就完全可以借助成熟的组件来实现。</p><p>最后我再提醒一下，这节课里我准备了大量代码，但直播模块的呈现方法并不唯一，你也可以发挥自己的想象做一些探索，毕竟自己动手能更快地提高你应用前端语言的能力。</p><p>完成了游客端的页面开发，我们又该如何实现直播的功能，下节课起我们就来探索这个问题，敬请期待。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在 Layout 组件中，如果我们不想使用 &lt;​el-col&gt; 来实现空的内容占位，还有什么好的方式？</p><p>欢迎你在留言区和我交流互动，如果这节课对你有帮助，别忘了分享给身边的朋友。</p>`,67)])])}const r=n(t,[["render",p]]);export{c as __pageData,r as default};
