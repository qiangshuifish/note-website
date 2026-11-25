import{_ as a,H as i,f as n,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"10 | 详情页实现：如何实现需求定制化？","description":"","frontmatter":{},"headers":[{"level":2,"title":"个人中心需求分析","slug":"个人中心需求分析","link":"#个人中心需求分析","children":[]},{"level":2,"title":"个人中心的代码实现","slug":"个人中心的代码实现","link":"#个人中心的代码实现","children":[{"level":3,"title":"页面数据的获取与判断","slug":"页面数据的获取与判断","link":"#页面数据的获取与判断","children":[]}]},{"level":2,"title":"数据格式案例","slug":"数据格式案例","link":"#数据格式案例","children":[]},{"level":2,"title":"视频详情需求分析","slug":"视频详情需求分析","link":"#视频详情需求分析","children":[]},{"level":2,"title":"视频详情页的功能实现","slug":"视频详情页的功能实现","link":"#视频详情页的功能实现","children":[{"level":3,"title":"展示区实现","slug":"展示区实现","link":"#展示区实现","children":[]},{"level":3,"title":"功能区实现","slug":"功能区实现","link":"#功能区实现","children":[]},{"level":3,"title":"点赞和收藏功能实现","slug":"点赞和收藏功能实现","link":"#点赞和收藏功能实现","children":[]},{"level":3,"title":"评论功能的实现","slug":"评论功能的实现","link":"#评论功能的实现","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python实战·从0到1搭建直播视频平台/10｜详情页实现：如何实现需求定制化？.md","filePath":"Python实战·从0到1搭建直播视频平台/10｜详情页实现：如何实现需求定制化？.md","lastUpdated":1795533265000}'),l={name:"Python实战·从0到1搭建直播视频平台/10｜详情页实现：如何实现需求定制化？.md"};function t(e,s,h,E,k,r){return i(),n("div",null,[...s[0]||(s[0]=[p(`<h1 id="_10-详情页实现-如何实现需求定制化" tabindex="-1">10 | 详情页实现：如何实现需求定制化？ <a class="header-anchor" href="#_10-详情页实现-如何实现需求定制化" aria-label="Permalink to &quot;10 | 详情页实现：如何实现需求定制化？&quot;">​</a></h1><p>你好，我是 Barry。</p><p>在日常开发中我们会接到各式各样的功能需求，那么如何根据业务特点选择合适的实现方式呢？</p><p>如果你稍微思考一下，就会发现里面有很多需求要点要提前考虑，比如说，页面开发过程中，实现的时候用组件，还是手写 CSS？功能设计怎样才合理？功能代码实现又要如何完成呢？</p><p>这节课，我们就结合在线视频平台里两个重要的定制化模块——个人中心和视频详情页，帮你系统强化一下功能需求分析和技术选择判断等综合能力。掌握了这套分析思考方法，相信你未来应对其他模块开发的时候，也会更加得心应手。</p><p>这节课的代码量非常大，所以要认真听我的讲解，不要掉队哦。</p><h2 id="个人中心需求分析" tabindex="-1">个人中心需求分析 <a class="header-anchor" href="#个人中心需求分析" aria-label="Permalink to &quot;个人中心需求分析&quot;">​</a></h2><p>个人中心，几乎是所有应用都必备的一个模块，大多用来处理与用户相关的功能。每个平台的定位不同，个人中心也有很多定制化的需求。</p><p>那么，做视频平台的个人中心和其他通用的产品有什么不同呢？为了解决这个问题，我们需要先完成视频平台个人中心模块的需求分析，才能理清思路。</p><p>首先，除了常规的个人信息管理需求外，用户在浏览平台内视频的时候，还会进行点赞，收藏等动作，所以个人中心要满足用户的收藏和点赞内容的管理。</p><p>另外，别忘了我们的平台是 UGC 的，用户还有发布自己内容的需求。因此，个人中心还有一块比较重要的内容就是用户的关注数、粉丝数以及作品数，除了这三项基本数据，你也可以想一想还有什么关键数据。</p><p>现在，我们就可以按重要程度整理出视频平台的个人中心应该具备哪些功能了。</p><ul><li><p>必须满足个人信息管理的需求。</p></li><li><p>能够呈现用户相关喜好记录，例如点赞、收藏内容的管理。</p></li><li><p>能够展示用户在平台内重点关注的一些数据。</p></li></ul><p>明确了方向，我们还需要继续细化一下，想清楚这些功能都安排在哪里才更符合用户的习惯。这里分享一个小技巧，我们不妨以终为始，代入用户的视角，想象一下他们如何使用个人中心。</p><p>首先，个人中心入口我们安排在平台首页头部右上方，用户点击自己的头像就会出现下拉列表，里面就包括个人中心、创作中心等等这些菜单栏。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/1.png" alt=""></a></p><p>接下来，用户点击个人中心就能跳转到个人中心的界面。对应前面的功能分析，这个界面大致分三个部分。</p><ul><li><p>个人基础信息管理，包括用户名、头像信息和个人资料信息，支持用户灵活修改。</p></li><li><p>用户喜好的记录，我们需要分别展示点赞、收藏、关注的数据。</p></li><li><p>重要数据信息，比如用户发布视频的播放数据、粉丝数据、活跃度等。</p></li></ul><p>具体呈现哪些数据，我们可以分成基础必备项和定制项来考虑。</p><p>基础必备项就是必须具备的数据指标，比如对于发布视频内容的用户，我们需要给他们展示视频播放量、粉丝数、视频点赞数等等。定制项更加考验我们的创造力和业务理解能力，需要根据特定场景定制化设计。比如为了帮助内容创作者把控内容，就可以设计粉丝活跃度这样的指标。</p><h2 id="个人中心的代码实现" tabindex="-1">个人中心的代码实现 <a class="header-anchor" href="#个人中心的代码实现" aria-label="Permalink to &quot;个人中心的代码实现&quot;">​</a></h2><p>接下来我们看看这些功能需求应该如何实现。具体的实现代码是后面这样。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;user-wrapper rt&quot; v-if=&quot;user.user_id&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//这里的v-if主要是判断当前用户是否已登陆</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-dropdown trigger=&quot;click&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   //img标签主要用于展示头像，onerror的作用是，当无法加载的时候默认提供一张图片</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​img</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :src=&quot;user.avatar_url || $store.state.userAvatar&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :onerror=&quot;$store.state.defaultAvatar&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       alt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​i class=&quot;el-icon-caret-bottom el-icon--right&quot;&gt;&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   //以下是对el-dropdown-menu组件的应用</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-dropdown-menu slot=&quot;dropdown&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-dropdown-item class=&quot;clearfix&quot; @click.native=&quot;goHome&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;个人中心&lt;​/el-dropdown-item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-dropdown-item class=&quot;clearfix&quot; @click.native=&quot;goAdmin&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;创作中心&lt;​/el-dropdown-item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-dropdown-item class=&quot;clearfix&quot; @click.native=&quot;goData&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;数据中心&lt;​/el-dropdown-item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-dropdown-item class=&quot;clearfix&quot; @click.native=&quot;goInfo&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;我的资料&lt;​/el-dropdown-item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-dropdown-item class=&quot;clearfix&quot; @click.native=&quot;goPublic&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;发布视频&lt;​/el-dropdown-item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-dropdown-item class=&quot;clearfix&quot; @click.native=&quot;onLogout&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;退出&lt;​/el-dropdown-item</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/el-dropdown-menu&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/el-dropdown&gt;</span></span></code></pre></div><p>style 部分的代码是后面这样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.user-wrapper {</span></span>
<span class="line"><span>   img {</span></span>
<span class="line"><span>     width: 40px;</span></span>
<span class="line"><span>     height: 40px;</span></span>
<span class="line"><span>     border-radius: 50%;</span></span>
<span class="line"><span>     vertical-align: middle;</span></span>
<span class="line"><span>     cursor: pointer;</span></span>
<span class="line"><span>     margin-right: -5px;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   span {</span></span>
<span class="line"><span>     vertical-align: middle;</span></span>
<span class="line"><span>     font-size: 12px;</span></span>
<span class="line"><span>     cursor: pointer;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>对照代码，我们来梳理一下个几个比较重要的部分。第一个部分是 el-dropdown 组件，也就是我们 Element 的组件。应对“用户点击自己的头像就会出现下拉列表”这样的展示需求，用官方提供的下拉列表组件来呈现是更加合适的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/2.png" alt=""></a></p><p>课后你可以通过这个链接查看官网的具体案例和对应界面，自己练习巩固一下。</p><p>进入个人中心之后，整体的页面布局切为上下两块。当然这个布局格式比较灵活，你也可以自己发挥设计一下，通过代码实现尝试不同的风格。</p><p>我们回到项目里的实现，我先用假数据呈现效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/3.png" alt=""></a></p><p>黄色框内是主要展示用户个人的关注、粉丝、文章数，同时还有修改资料的功能。</p><p>蓝色框内主要用来展示用户相关的点赞、收藏、关注的详情，我们切换不同的 Tab，就可以查看相应的内容，每一条内容都详细地展示了视频相关数据。我们也可以通过右侧的删除操作来调整内容。</p><p>接下来看一下具体的代码实现。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;user-data&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​p class=&quot;nick-name&quot;&gt;{​{userInfo.nickName}​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​p&gt;{​{followList.length}​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​p&gt;关注&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​p&gt;{​{userInfo.fansNum||0}​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​p&gt;粉丝&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​p&gt;{​{articleList.length}​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​p&gt;文章&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div v-if=&quot;isUserCenter&quot; class=&quot;handle-buttons&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​button class=&quot;button-default&quot; @click=&quot;goInfo&quot;&gt;修改资料&lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span></code></pre></div><p>CSS 样式部分是后面这样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.user-data {</span></span>
<span class="line"><span> display: inline-block;</span></span>
<span class="line"><span> vertical-align: middle;</span></span>
<span class="line"><span> .nick-name {</span></span>
<span class="line"><span>   font-size: 16px;</span></span>
<span class="line"><span>   font-weight: bold;</span></span>
<span class="line"><span>   text-align: center;</span></span>
<span class="line"><span>   margin-bottom: 16px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>.user-data {</span></span>
<span class="line"><span> display: inline-block;</span></span>
<span class="line"><span> vertical-align: middle;</span></span>
<span class="line"><span> .nick-name {</span></span>
<span class="line"><span>   font-size: 16px;</span></span>
<span class="line"><span>   font-weight: bold;</span></span>
<span class="line"><span>   text-align: center;</span></span>
<span class="line"><span>   margin-bottom: 16px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>ul {</span></span>
<span class="line"><span> li {</span></span>
<span class="line"><span>   display: inline-block;</span></span>
<span class="line"><span>   border-right: 1px solid @border-color;</span></span>
<span class="line"><span>   text-align: center;</span></span>
<span class="line"><span>   padding: 0 10px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> li:last-child {</span></span>
<span class="line"><span>   border: none;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.handle-buttons {</span></span>
<span class="line"><span> display: inline-block;</span></span>
<span class="line"><span> vertical-align: middle;</span></span>
<span class="line"><span> margin-left: 50px;</span></span>
<span class="line"><span> button {</span></span>
<span class="line"><span>   width: 100px;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们这里依然用列表标签 &lt;​li&gt; 实现蓝色功能区，同时结合了 v-for 指令，遍历出我的点赞、我的收藏、我的关注三个 Tabs，我们把这三个类别放到 tabList 列表中，所以这里需要关注tabList 中的内容。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​ul v-if=&quot;isUserCenter&quot; class=&quot;tab-list&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​li</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v-for=&quot;(item,index) in tabList&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :key=&quot;index&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   :class=&quot;index==active?&#39;active&#39;:&#39;&#39;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @click=&quot;active=index&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &gt;{​{item.name}​}&lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//值的初始化，这一部分写在&lt;​script&gt;内</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tabList: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   name: &quot;我的点赞&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   total: 0, //默认的内容条数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   name: &quot;我的收藏&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   total: 0,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   name: &quot;我的关注&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   total: 0,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span></code></pre></div><p>每一个分区展示的内容，都是通过指令 v-show 判断 active 值的变换来展示的。</p><p>我们继续往下看，后面是详细的代码实现，可以看到 active 值的变换是通过指令 v-show 来判断的。</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​div v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">show</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;active==0&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​ul class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;article-list&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​li v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-for=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;(item,index) in articleList&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @click</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;goDetail(item.articleId)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :ke</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​div</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​p class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;article-title&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{​{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">articleTitle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}​}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​div class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;article-content&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">html</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;item.articleDetails&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​p</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">         &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2020</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">07</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">22</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">00</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">         &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;rt&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​i class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;icon-play&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{​{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">play_times</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}​}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​i class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;icon-good&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{​{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">good</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}​}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​i class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;icon-heart&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{​{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">like</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}​}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​i class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;icon-star&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{​{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}​}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">         &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{​{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">item</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">author</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}​}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​img :src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;item.photoUrl&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> alt </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​i class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;el-icon-delete&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @click.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">stop=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;onDelete(item.articleId,index)&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;&lt;/</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">     &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">span</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">li</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ul</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span></code></pre></div><p>这里的 articleList 代表的就是“我的点赞”内容的数量，通过 v-for 遍历依次展示每一条点赞的内容。标签主要展示了视频的详情内容。其中的字段定义我们可以灵活定义，但是一定要明确含义，并且要与你在数据库定义的字段一致。在请求后端接口返回数据之后，就可以直接在页面显示对应的信息了。</p><p>另外两个模块（我的收藏和我的关注）实现思路和刚才讲过的模块差不多。</p><p>我们重点需要关注两点。第一，不同模块展示的内容不同、数据字段也不同，这样才能区别开来；第二就是关注页面展示内容的数据格式，想清楚怎么样组合封装更好处理，这也是我们字段定义和开发过程中要重点关注的。</p><h3 id="页面数据的获取与判断" tabindex="-1">页面数据的获取与判断 <a class="header-anchor" href="#页面数据的获取与判断" aria-label="Permalink to &quot;页面数据的获取与判断&quot;">​</a></h3><p>接下来，我们结合例子分析一下如何处理数据的获取和判断。比如视频详情页里要展示的内容比较多，就需要我们提前梳理清数据的逻辑，才能全面展示页面内容。</p><p>我画了一张导图来分个类，这样比较清晰。可以看到，从后端返回来的数据里，一部分是我们直接能用的，另一部分则是需要判断处理后才能在页面展示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/4.png" alt=""></a></p><p>为什么做这样的区分呢？其实这关系到内容如何呈现。可以直接用的数据，我们只要定义好数据格式，在页面中直接填充或遍历填充即可。</p><p>但是需要判断处理的数据，数据的初始值和接口返回的数据是两个状态。我举个例子你会更容易理解，比如在页面加载的时候，点赞的图标状态值默认就是 false，它的图标就是灰色的。等到前端拿到接口的值，发现状态值是 true，这时候它就要变成红色了。所以，我们就要在标签展示的代码里实现数据的判断。</p><h2 id="数据格式案例" tabindex="-1">数据格式案例 <a class="header-anchor" href="#数据格式案例" aria-label="Permalink to &quot;数据格式案例&quot;">​</a></h2><p>数据格式案例是我们在页面呈现内容的时候展示的信息，这样的封装有利于在页面展示，同时也是后端接口返回来的数据格式。因此，我们之后在做接口开发的时候，就需要把数据格式封装好。</p><p>我们结合具体案例来看看，在视频右侧的相似视频数据格式应该是什么样子的。结合代码里的注释，相信你可以看懂其中的含义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data: {</span></span>
<span class="line"><span>   total: 5,</span></span>
<span class="line"><span>   &#39;rows&#39;: [{</span></span>
<span class="line"><span>     id: &#39;1&#39;, //视频id</span></span>
<span class="line"><span>     image: &#39;./static/1.jpg&#39;, //视频封面</span></span>
<span class="line"><span>     name: &#39;@name&#39; //视频名称</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;2&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/2.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;@name&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;3&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/3.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;@name&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;4&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/4.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;@name&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;5&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/5.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;@name&#39;</span></span>
<span class="line"><span>   }]</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>以上就是个人中心模块的界面代码实现和数据格式的内容。你会发现数据的格式和页面样式的设计在代码实现上是息息相关的，所以在设计过程中，一定要全方位考虑。</p><h2 id="视频详情需求分析" tabindex="-1">视频详情需求分析 <a class="header-anchor" href="#视频详情需求分析" aria-label="Permalink to &quot;视频详情需求分析&quot;">​</a></h2><p>接下来我们来学习另一个经典案例——视频详情模块的实现。</p><p>我们从视频详情模块的需求分析入手。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/5.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/6.png" alt=""></a></p><p>借鉴前面个人中心需求的分析思路，我们分析一下用户需要在这个页面完成哪些操作。</p><p>首先，最核心的功能自然是视频播放器了，主要满足用户观看视频的需求。其次，为了增强视频的互动性，应该支持用户对视频进行点赞、收藏、评论，关注等操作。最后是推荐列表，我们希望界面中具备相似或推荐视频列表，增强用户与平台的黏性。</p><p>至于页面设计，需要注意的是页面要与整个平台的设计风格统一，在此基础上还要满足我们前面提到的功能。</p><h2 id="视频详情页的功能实现" tabindex="-1">视频详情页的功能实现 <a class="header-anchor" href="#视频详情页的功能实现" aria-label="Permalink to &quot;视频详情页的功能实现&quot;">​</a></h2><p>用户在视频列表中点击任意项目的视频以后，就会进入视频详情页。</p><p>结合前面的分析，我们把详情页面划分为两个功能区。上半部分是展示区，用来展示当前播放的视频和一些推荐视频列表，供用户观看和选择。下半部分就是功能区，用来满足用户互动相关功能，增强观看体验。</p><h3 id="展示区实现" tabindex="-1">展示区实现 <a class="header-anchor" href="#展示区实现" aria-label="Permalink to &quot;展示区实现&quot;">​</a></h3><p>视频详情页的展示区还可以继续分割成两个部分。</p><p>第一部分是视频详情页最主要的播放器。第二部分是相似视频推荐，可以放在播放器右侧，展示一些与播放视频相似主题的视频，增强用户的黏性。</p><p>后面是具体代码实现。在代码实现部分，我们首先要关注在布局上的 CSS 实现和组件的使用，这一部分就是对 CSS 实践应用的考量。另外，这个部分有助于我们练习 v-show 等指令的应用，重点就是利用状态值的变化来灵活控制展示的内容。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​p class=&quot;video-title&quot;&gt;{​{ info.title }​}&lt;​/p&gt; //视频的标题</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;video-container&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​div class=&quot;left-container&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div id=&quot;dplayer&quot;&gt;&lt;​/div&gt; //播放器展位，播放器后边会重点讲解</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div class=&quot;video-bottom-area&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span class=&quot;play-times&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       //视频相关数据</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​span&gt;{​{ info.play_times }​}&lt;​/span&gt;次播放量&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span class=&quot;play-times&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​span&gt;{​{ info.play_times }​}&lt;​/span</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;个赞</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​span class=&quot;play-times&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​span&gt;{​{ info.play_times }​}&lt;​/span</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;次收藏</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​div class=&quot;auther-info rt clear&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;lf&quot; @click=&quot;goHome(info.auther.userId)&quot;&gt; //点击头像或名字直接跳转</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​img :src=&quot;info.auther.photoUrl || $store.state.userAvatar&quot; alt /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​p class=&quot;author-name&quot; @click=&quot;goHome(info.auther.userId)&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         {​{ info.auther.nickName }​}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       //关注按钮，点击按钮关注作者</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         v-show=&quot;!info.auther.hasFollow&quot; //这里用到v-show判断是否已经关注，如果没有关注</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         class=&quot;button-primary rt&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         @click=&quot;followUser(info.auther.userId)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         关注</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         v-show=&quot;info.auther.hasFollow&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         class=&quot;button-primary rt&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         @click=&quot;followUser(info.auther.userId)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         取消关注</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span></code></pre></div><p>CSS 样式我也写在下面了，你可以直接参考，我把你可能觉得陌生的属性都加了注释。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.video-title {</span></span>
<span class="line"><span> font-size: 20px;</span></span>
<span class="line"><span> font-weight: bold;</span></span>
<span class="line"><span> padding-bottom: 20px;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.video-container {</span></span>
<span class="line"><span> display: flex;</span></span>
<span class="line"><span> justify-content: center; //用于设置或检索弹性盒子元素在主轴</span></span>
<span class="line"><span> .left-container {</span></span>
<span class="line"><span>   width: 880px;</span></span>
<span class="line"><span>   position: relative;</span></span>
<span class="line"><span>   box-shadow: 0 0 8px #e5e9ef;  //设置多个阴影效果</span></span>
<span class="line"><span>   video {</span></span>
<span class="line"><span>     width: 100%;</span></span>
<span class="line"><span>     height: 440px;</span></span>
<span class="line"><span>     border: 0;</span></span>
<span class="line"><span>     background: #000;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   #canvas {</span></span>
<span class="line"><span>     position: absolute;</span></span>
<span class="line"><span>     left: 0;</span></span>
<span class="line"><span>     top: 0;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   .video-bottom-area {</span></span>
<span class="line"><span>     padding: 20px;</span></span>
<span class="line"><span>     .auther-info {</span></span>
<span class="line"><span>       width: 140px;</span></span>
<span class="line"><span>       &gt; div:first-child {//组合选择器，既满足是div元素，又满足是父级元素的“第一个孩子”</span></span>
<span class="line"><span>         text-align: center;</span></span>
<span class="line"><span>         img {</span></span>
<span class="line"><span>           width: 60px;</span></span>
<span class="line"><span>           height: 60px;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       .author-name {</span></span>
<span class="line"><span>         font-size: 14px;</span></span>
<span class="line"><span>         font-weight: bold;</span></span>
<span class="line"><span>         margin-bottom: 8px;</span></span>
<span class="line"><span>         text-align: center;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       button {</span></span>
<span class="line"><span>         height: 28px;</span></span>
<span class="line"><span>         line-height: 28px;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     .play-times {</span></span>
<span class="line"><span>       line-height: 60px;</span></span>
<span class="line"><span>       margin-left: 20px;</span></span>
<span class="line"><span>       color: #707070;</span></span>
<span class="line"><span>       span {</span></span>
<span class="line"><span>         margin-right: 5px;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     .bullet-input {</span></span>
<span class="line"><span>       margin-bottom: 20px;</span></span>
<span class="line"><span>       padding-top: 10px;</span></span>
<span class="line"><span>       .el-input {</span></span>
<span class="line"><span>         width: 360px;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       p {</span></span>
<span class="line"><span>         cursor: pointer;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>进行到这里，我们完成了展示区的视频播放器页面设计与开发。你既可以参考课程配套代码尝试开发，也可以加一些自己的想法做更多尝试。</p><h3 id="功能区实现" tabindex="-1">功能区实现 <a class="header-anchor" href="#功能区实现" aria-label="Permalink to &quot;功能区实现&quot;">​</a></h3><p>接下来我们看看功能区，功能区主要用来满足后面这三类需求。</p><ul><li><p>点赞和收藏功能：如果用户喜欢某个视频或者作者，可以收藏和点赞。</p></li><li><p>评论功能：对视频做评论，满足用户的互动需求。</p></li><li><p>关注功能：如果用户对视频的作者非常喜爱，可以直接点击关注按钮关注作者。</p></li></ul><h3 id="点赞和收藏功能实现" tabindex="-1">点赞和收藏功能实现 <a class="header-anchor" href="#点赞和收藏功能实现" aria-label="Permalink to &quot;点赞和收藏功能实现&quot;">​</a></h3><p>先来看看我做的这一版的效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/10/7.png" alt=""></a></p><p>截图左侧框起来的部分，黄色图标代表收藏，红色图标代表点赞。当用户点击时，图标会由灰色分别变为黄色和红色。</p><p>实现逻辑的关键点就是通过 v-show 标签指令判断 hasCollect 值。我们重点去关注点赞和收藏的实现方法，在功能开发上点赞和收藏的实现逻辑是保持一致的。</p><p>在点击的时候会发生状态值的传递，未关注状态下点击按钮则向后端传值 1。用户点击关注按钮的时候不但修改了状态，同时数据库也会记录当前用户已经对该视频点赞。</p><p>当该用户再进入该页面，就可以直接获取收藏的状态。那时图标就不再是灰色状态，而会直接展示黄色。</p><p>你可以再仔细看看后面的具体代码，结合代码来加深理解。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;handler-wrapper&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​img</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   src=&quot;@/assets/image/VideoDetail/star-default.png&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v-show=&quot;!hasCollect&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @click=&quot;onCollect(1)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   alt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​img</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   src=&quot;@/assets/image/VideoDetail/star-active.png&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v-show=&quot;hasCollect&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @click=&quot;onCollect(0)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   alt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​img</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   src=&quot;@/assets/image/VideoDetail/like-default.png&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v-show=&quot;!hasLike&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @click=&quot;onLike(1)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   alt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​img</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   src=&quot;@/assets/image/VideoDetail/like-active.png&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   v-show=&quot;hasLike&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   alt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @click=&quot;onLike(0)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">methods:{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">onCollect(mode) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     //验证是否登陆</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     if (!this.authLogin()) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       return false;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     //TODO:请求接口，收藏或取消收藏</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     if (mode === 1) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       this.$axios</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         .post(&quot;接口地址&quot;, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           userId: this.user.userId,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           articleId: this.$route.params.id,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         .then((data) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           this.hasCollect = true;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           console.log(data);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           this.$message({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             type: &quot;success&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             message: &quot;收藏成功&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       this.$axios</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         .post(&quot;接口地址&quot;, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           userId: this.user.userId,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           articleId: this.$route.params.id,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         .then((data) =&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           this.hasCollect = false;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           this.$message({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             type: &quot;success&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             message: &quot;取消收藏成功&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           console.log(data);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​style&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//css样式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.video-detail {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> padding: 40px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .handler-wrapper {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   position: fixed;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   left: 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   top: 300px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   img {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     width: 50px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     background: #fff;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     padding: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     border-radius: 50%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     box-shadow: @box-shadow;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     display: block;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     margin: 30px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/style&gt;</span></span></code></pre></div><h3 id="评论功能的实现" tabindex="-1">评论功能的实现 <a class="header-anchor" href="#评论功能的实现" aria-label="Permalink to &quot;评论功能的实现&quot;">​</a></h3><p>接下来我们看看如何实现评论功能。</p><p>发起评论</p><p>首先，我们需要有一个输入框，用来记录用户输入的评论内容。</p><p>用户点击提交就完成了评论的动作，这时评论区就会实时呈现评论内容，并且每条信息都支持评论和回复。</p><p>在这个过程中，重点需要记录某条信息是在哪一条评论下回复的内容。因此，我们需要提前设计好数据格式。这一点我之前讲数据格式案例时已经说过了，如果你记不清了可以回顾一下。</p><p>我把这部分代码实现的核心内容贴在了后面，完整代码你可以查看代码库。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;comment&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​p class=&quot;sub-title&quot;&gt;评论&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div class=&quot;textarea-wrapper&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   //评论输入框选用Element组件el-input，重点要把type设置成textarea</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   //案例应用，也可参考官网https://element.eleme.cn/#/zh-CN/component/input</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​el-input</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       type=&quot;textarea&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       :autosize=&quot;{ minRows: 4 }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       placeholder=&quot;请输入评论内容&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       v-model=&quot;textarea&quot; //textarea是输入的评论内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       @focus=&quot;authLogin&quot; 当点击输入框时验证用户是否登录，这里也可设置在提交方法内</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &gt;&lt;​/el-input&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​button class=&quot;button-default&quot; @click=&quot;onReply&quot;&gt;提交评论&lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​ul class=&quot;reply-list&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   //评论内容展示区，详细字段描述看上面数据格式案例</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   //这里遍历commentList的值</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​li v-for=&quot;(item, index) in commentList&quot; :key=&quot;index&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;user-wrraper&quot; @click=&quot;goHome(item.id)&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​img :src=&quot;item.userPhoto || $store.state.userAvatar&quot; alt /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​p&gt;{​{ item.nickName }​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;reply-data&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​p&gt;{​{ item.replyData }​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​p class=&quot;reply-info&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​span&gt;{​{ item.timestamp | format_timestamp }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​span</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             class=&quot;handle-reply&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             @click=&quot;item.showTextarea = !item.showTextarea&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &gt;回复&lt;​/span</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           //评论的支持与不赞成数量</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​span class=&quot;rt&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;icon-good&quot;&gt;&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​span&gt;{​{ item.good &gt; 0 ? item.good : &quot;&quot; }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​i class=&quot;icon-bad&quot;&gt;&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​span&gt;{​{ item.bad &gt; 0 ? item.bad : &quot;&quot; }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       //嵌套用户评论回复</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       //这里遍历replyList的值</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​div class=&quot;user-reply&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​ul class=&quot;reply-list&quot; v-show=&quot;item.replyList.length &gt; 0&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​li v-for=&quot;(reply, index) in item.replyList&quot; :key=&quot;index&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;user-wrraper&quot; @click=&quot;goHome(reply.id)&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​img</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               :src=&quot;reply.userPhoto || $store.state.userAvatar&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               alt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​p&gt;{​{ reply.nickName }​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;reply-data&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​p&gt;@{​{ reply.toUser }​}：{​{ reply.replyData }​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​p class=&quot;reply-info&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​span&gt;{​{ reply.timestamp | format_timestamp }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​span</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 class=&quot;handle-reply&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 @click=&quot;handleReply(reply)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &gt;回复&lt;​/span</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​span class=&quot;rt&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​i class=&quot;icon-good&quot;&gt;&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​span&gt;{​{ reply.good &gt; 0 ? reply.good : &quot;&quot; }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​i class=&quot;icon-bad&quot;&gt;&lt;​/i&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 &lt;​span&gt;{​{ reply.bad &gt; 0 ? reply.bad : &quot;&quot; }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span></code></pre></div><p>对已发表评论进行点评</p><p>为了让视频的互动性更强，我们还可以设计对已发表评论做点评的功能，效果你可以参考后面的截图。</p><p>这部分实现起来也不难，代码是后面这样。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">//在点击评论下的回复按钮，showTextarea的值会变成true，这时候用户可以看到评论内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;textarea-wrapper&quot; v-show=&quot;item.showTextarea&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​img :src=&quot;user.photoUrl || $store.state.userAvatar&quot; alt /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-input</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     type=&quot;textarea&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     :autosize=&quot;{ minRows: 2 }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     placeholder=&quot;请输入回复内容&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     v-model=&quot;item.textarea&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     @focus=&quot;authLogin&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &gt;&lt;​/el-input&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     class=&quot;button-default&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     @click=&quot;onReplyUser(item, index)&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     提交评论</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/div&gt;</span></span></code></pre></div><p>具体 methods 里面的方法重点就是调用接口时进行传值，我整理了一张表格，帮你把不同方法的值梳理清楚。</p><p>CSS 样式内容我放到最后了，你可以参考我的样式实现，也可以通过自己的方式来做，都没问题，重点是对技术的应用。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​style&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.reply-list {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     margin-top: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     li {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       padding: 20px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       display: block;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       border-bottom: 1px solid @border-color;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       img {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         width: 60px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         border-radius: 50%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .user-wrraper {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         text-align: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         margin-right: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         cursor: pointer;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .user-wrraper,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .reply-data {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         display: inline-block;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         vertical-align: middle;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         color: #666666;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .reply-data {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         font-size: 14px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         width: calc(100% - 100px);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &gt; p:first-child {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           height: 60px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           padding-top: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           box-sizing: border-box;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .reply-info {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         font-size: 12px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         .handle-reply {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           margin-left: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           cursor: pointer;</span></span>
<span class="line"><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">           &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:hover {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             color: #00a1d6;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &gt; span:last-child {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           font-size: 14px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           line-height: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .user-reply {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         padding-left: 80px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         li {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           padding: 12px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           img {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             width: 40px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             height: 40px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           border: 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           .reply-data {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &gt; p:first-child {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               height: 40px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               padding-top: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               box-sizing: border-box;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             i {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               width: 16px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               height: 16px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .textarea-wrapper {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         width: 640px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         margin-top: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         box-sizing: border-box;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         border-radius: 4px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         padding: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         background: #f2f2f2;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         img {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           margin-right: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           vertical-align: middle;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         .el-textarea {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           width: 400px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           vertical-align: middle;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         button {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           display: inline-block;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           vertical-align: middle;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           margin: 0 0 0 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/style&gt;</span></span></code></pre></div><p>我们再来看看评论数据格式是什么样子的。后面是具体代码实现，你需要重点关注代码里的注释，还有每条数据间的层级关系。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>commentList: [</span></span>
<span class="line"><span>       {</span></span>
<span class="line"><span>         id: &quot;111&quot;, //评论ID</span></span>
<span class="line"><span>         nickName: &quot;chloe&quot;, //作者</span></span>
<span class="line"><span>         replyData: &quot;lallla&quot;,  //评论内容</span></span>
<span class="line"><span>         good: 100, //好评数</span></span>
<span class="line"><span>         bad: 1, //差评数</span></span>
<span class="line"><span>         showTextarea: false, //是否暂时输入框</span></span>
<span class="line"><span>         timestamp: 1600670910515, //评论发布时间</span></span>
<span class="line"><span>         replyList: [ //这里是层级关系，对上一条评论的评论情况</span></span>
<span class="line"><span>           {</span></span>
<span class="line"><span>             id: &quot;111&quot;,</span></span>
<span class="line"><span>             nickName: &quot;tom&quot;,</span></span>
<span class="line"><span>             toUser: &quot;chloe&quot;,</span></span>
<span class="line"><span>             replyData: &quot;大师兄说得对&quot;,</span></span>
<span class="line"><span>             good: 2,</span></span>
<span class="line"><span>             bad: 0,</span></span>
<span class="line"><span>             showTextarea: false,</span></span>
<span class="line"><span>             textarea: &quot;&quot;,</span></span>
<span class="line"><span>             timestamp: 1600670910515,</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>         ]</span></span>
<span class="line"><span>       },</span></span>
<span class="line"><span>       {</span></span>
<span class="line"><span>         id: &quot;222&quot;,</span></span>
<span class="line"><span>         nickName: &quot;jeny&quot;,</span></span>
<span class="line"><span>         good: 500,</span></span>
<span class="line"><span>         bad: 9,</span></span>
<span class="line"><span>         replyData: &quot;好棒哇哇哇哇哇&quot;,</span></span>
<span class="line"><span>         showTextarea: false,</span></span>
<span class="line"><span>         replyList: [],</span></span>
<span class="line"><span>         timestamp: 1600670910515</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>     ]</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天的内容告一段落，我们回顾总结一下这节课的要点。</p><p>应对不同需求功能，需要前期做好规划，具体要从页面布局、呈现内容、用户功能、数据格式去考虑，这四个维度缺一不可。这里我再单独强调一下变量数据格式，它会直接影响我们页面展示的内容，明确变量数据格式不但有助于我们提高开发效率，也会让整体模块的呈现更加平滑。</p><p>另外，除了实现基础功能需求，我们还要重点关注用户的体验，让用户与平台建立粘性，增强用户对平台的喜爱程度，这样也是平台的价值体现。</p><p>页面的实现时候，我们要巧妙应用组件来助阵。这样不仅显示很美观，同时也能让我们的开发效率更高。除了课程中使用的组件，课后你不妨去官方文档上了解更多，最好可以实际操作一下，这样才能让掌握得更加扎实。</p><p>这节课我多次介绍了 v-show、v-if 此类的指令。用好指令能让我们很好地控制页面内容展示，且无须写出冗杂的代码，通过状态值的判断就能巧妙地呈现展示内容，这也是我们在开发过程中非常重要的思想。</p><p>相信这节课学完，你的业务理解能力和代码实力又会实现一次大的飞跃。希望你可以耐心把每一个知识点吃透。</p><p>今天我们只讲了播放器的展位，那平台中的播放器我们该如何选型，使用过程中又要重点关注哪些核心要素呢？下节课我们一起来探索，敬请期待。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>我们一起来讨论一下，关于用户个人中心的“我的点赞”和“我的收藏”视频列表，是否有必要做分页？</p><p>欢迎你在留言区和我交流互动，或者记录下自己的学习心得，我们一起学习进步。</p>`,115)])])}const c=a(l,[["render",t]]);export{d as __pageData,c as default};
