import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const c=JSON.parse('{"title":"11 | DPlayer播放器综合应用：怎样实现自己的第一个视频播放器？","description":"","frontmatter":{},"headers":[{"level":2,"title":"视频播放器的前世今生","slug":"视频播放器的前世今生","link":"#视频播放器的前世今生","children":[]},{"level":2,"title":"为什么选择 DPlayer 来做项目中的视频播放器？","slug":"为什么选择-dplayer-来做项目中的视频播放器","link":"#为什么选择-dplayer-来做项目中的视频播放器","children":[]},{"level":2,"title":"怎么样使用 DPlayer？","slug":"怎么样使用-dplayer","link":"#怎么样使用-dplayer","children":[]},{"level":2,"title":"视频详情页面的实现","slug":"视频详情页面的实现","link":"#视频详情页面的实现","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python实战·从0到1搭建直播视频平台/11｜DPlayer播放器综合应用：怎样实现自己的第一个视频播放器？.md","filePath":"Python实战·从0到1搭建直播视频平台/11｜DPlayer播放器综合应用：怎样实现自己的第一个视频播放器？.md","lastUpdated":1795533265000}'),l={name:"Python实战·从0到1搭建直播视频平台/11｜DPlayer播放器综合应用：怎样实现自己的第一个视频播放器？.md"};function t(e,s,h,E,k,d){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_11-dplayer播放器综合应用-怎样实现自己的第一个视频播放器" tabindex="-1">11 | DPlayer播放器综合应用：怎样实现自己的第一个视频播放器？ <a class="header-anchor" href="#_11-dplayer播放器综合应用-怎样实现自己的第一个视频播放器" aria-label="Permalink to &quot;11 | DPlayer播放器综合应用：怎样实现自己的第一个视频播放器？&quot;">​</a></h1><p>你好，我是 Barry。</p><p>这节课，我们一起来学习如何在视频平台中实现自己的第一个视频播放器。</p><p>在视频网站中，播放器是不可或缺的存在，我们在日常开发中，用的大多是网页开发，很少用到播放器。相信通过这节课的学习，你对播放器的理解和使用会更上一个台阶。</p><p>今天，我将带你从“Hello World”起，探索如何使用前端技术在网页上播放视频。在开始实战之前，让我们先了解一下网页上播放视频的由来。</p><h2 id="视频播放器的前世今生" tabindex="-1">视频播放器的前世今生 <a class="header-anchor" href="#视频播放器的前世今生" aria-label="Permalink to &quot;视频播放器的前世今生&quot;">​</a></h2><p>说到播放器，就不得不提到 HTML5 的一些新的特性了。我们都知道 HTML5 在老版本的基础上加入了很多新特性，比如后面这些特性。</p><ul><li><p>用于绘画的 canvas 元素。</p></li><li><p>用于媒介回放的 video 和 audio 元素。</p></li><li><p>对本地离线存储更好的支持。</p></li><li><p>新的特殊内容元素，比如 article、footer、header、nav、section。</p></li><li><p>新的表单控件，比如 calendar、date、time、email、url、search。</p></li></ul><p>可以看到，其中一个重要的特性就是支持 video 标签在网页上播放视频。</p><p>下面这行代码就可以实现一个简单的 HTML5 的视频播放器 demo。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​video src=&quot;movie.ogg&quot; controls=&quot;controls&quot;&gt;&lt;​/video&gt;</span></span></code></pre></div><p>标签上还可以设置其他的属性，常见的属性如下。</p><ul><li><p>autoplay：其值为 autoplay，如果出现该属性，则视频在就绪后马上播放。</p></li><li><p>controls：其值为 controls，如果出现该属性，则向用户显示控件，比如播放按钮。</p></li><li><p>height：其值为 pixels，表示视频播放器的高度。</p></li><li><p>loop：其值为 loop，如果出现该属性，则当媒介文件完成播放后再次开始播放。</p></li><li><p>muted：其值为 muted，它规定视频的音频输出应该被静音。</p></li><li><p>poster：其值为 URL，它规定视频下载时显示的图像，或者用户点击播放按钮前显示的图像。</p></li><li><p>preload：其值为 preload，如果出现该属性，则视频在页面加载时进行加载，并预备播放。如果使用 “autoplay”，则忽略该属性。</p></li><li><p>src：其值为 url，要播放的视频的 URL。</p></li><li><p>width：其值为 pixels，表示视频播放器的宽度。</p></li></ul><p>这样一个基础的视频播放器就完成啦！但可能有的同学又问了，这个视频播放器的功能有点丑，功能还有点少？</p><p>是的，HTML 版的播放器只具备最基本的功能，且各种浏览器的兼容性也不是很好。所以企业真正用它来做商业化的并不多。企业中主流的视频播放器包括 VideoJS 和 DPlayer。DPlayer支持弹幕，文档看起来更方便。</p><p>所以，接下来我们就重点聊聊 DPlayer 视频播放器，包括百度、腾讯、小红书等在内的很多中国企业都在使用。</p><h2 id="为什么选择-dplayer-来做项目中的视频播放器" tabindex="-1">为什么选择 DPlayer 来做项目中的视频播放器？ <a class="header-anchor" href="#为什么选择-dplayer-来做项目中的视频播放器" aria-label="Permalink to &quot;为什么选择 DPlayer 来做项目中的视频播放器？&quot;">​</a></h2><p>DPlayer 是一个 HTML5 视频播放器，并且支持弹幕、清晰度切换、实时视频（HTTP LiveStreaming，M3U8 格式）以及 FLV 格式。</p><p>此外，它还有以下优点。</p><ul><li><p>良好的跨浏览器样式，更美观。</p></li><li><p>支持流媒体格式。</p></li><li><p>没有浏览器兼容问题。</p></li></ul><p>简单来说呢，原生的 video 标签有很多功能需要我们手动去扩展。而这些事情 DPlayer 已经帮我们做好了。我们只需要引用一下别人造好的轮子，就可以开心地跑代码啦。</p><p>现在，我们已经全面认识了 DPlayer，下面我们就一起来实操应用一下。</p><h2 id="怎么样使用-dplayer" tabindex="-1">怎么样使用 DPlayer？ <a class="header-anchor" href="#怎么样使用-dplayer" aria-label="Permalink to &quot;怎么样使用 DPlayer？&quot;">​</a></h2><p>我们先来看一下一些 DPlayer 常用的属性配置。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/11/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/11/1.png" alt=""></a></p><p>DPlayer 可以在 HTML 中使用，也可以在框架中使用，二者大同小异。我们先来学习它在HTML 中的使用。</p><p>把大象装冰箱总共分三步，把 DPlayer 装到网页上也要三步走。</p><p>第一步，引入 Dplayer。</p><p>你可以在 GitHub 上的 DPlayer 项目里下载 js 文件。</p><p>打开这个链接，找到 DPlayer.min.js ，右键链接另存为把文件下载下来。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script src=&quot;dist/DPlayer.min.js(你的本地路径)&quot;&gt;&lt;​/script&gt;</span></span></code></pre></div><p>第二步，在 HTML 中定义挂载的元素，这里需要定义一个 ID，方便后面通过 ID 进行挂载。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div id=&quot;player1&quot;&gt;&lt;​/div&gt;</span></span></code></pre></div><p>第三步，在 js 中把播放器属性设置好，并挂载到上一步定义好的元素上。</p><p>我们这里用 container 属性来挂载元素，把 autoplay 设置为不自动播放，然后用 theme 属性给播放器加上主题颜色。loop 为 true，代表循环播放；lang 为 zh，代表语言为中文；preload值为 auto，代表自动预加载。</p><p>video 里是视频的信息，url 是视频的链接，pic 是封面图片的链接。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​script&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">var dp = new DPlayer({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   container: document.getElementById(&#39;player1&#39;),                       // 可选，</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   autoplay: false,                                                   // 可选，自动</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   theme: &#39;#FADFA3&#39;,                                                  // 可选，主题</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   loop: true,                                                        // 可选，循环</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   lang: &#39;zh&#39;,                                                        // 可选，语言</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   preload: &#39;auto&#39;,                                                   // 可选，预加</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   video: {                                                           // 必需，视频</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       url: &#39;若能绽放光芒.mp4&#39;,                                         // 必填，视频</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       pic: &#39;若能绽放光芒.png&#39;                                          // 可选，视频</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/script&gt;</span></span></code></pre></div><p>通过上面的实践应用，就可以实现在 HTML 中使用 DPlayer 播放器，那接下来我们继续来看一下在 Node 中该如何使用。</p><p>其实要在 Node 框架中使用 DPlayer 的方法也是相同的。</p><p>第一步，安装 Dplayer 依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ npm install dplayer --save</span></span></code></pre></div><p>第二步，在 HTML 中定义挂载的元素。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div id=&quot;player1&quot; class=&quot;dplayer&quot;&gt;&lt;​/div&gt;</span></span></code></pre></div><p>第三步，在 js 中把播放器属性设置好，并挂载到上一步定义好的元素上。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DPlayer </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;dplayer&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">const dp </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> new DPlayer(options)</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">;</span></span></code></pre></div><p>这样我们的视频播放器就基本完成了。</p><p>如果我们要处理一些业务逻辑，需要在对应的代码执行模块去操作播放器，这时候我们还需要用到一些 API。下面我给你介绍几种最常用的 API。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.play() : 播放视频。</span></span>
<span class="line"><span>dp.pause(): 暂停视频。</span></span>
<span class="line"><span>dp.seek(time: number) ：跳转到特定时间。例如：</span></span>
<span class="line"><span>dp.seek(100);</span></span>
<span class="line"><span>dp.toggle(): 切换播放和暂停。</span></span>
<span class="line"><span>dp.notice(text: string, time: number): 显示通知，它的时间的单位为毫秒，默</span></span></code></pre></div><ul><li>认时间为 2000 毫秒，默认透明度为 0.8。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.switchQuality(index: number): 切换清晰度。</span></span>
<span class="line"><span>dp.speed(rate: number): 设置视频速度。</span></span></code></pre></div><ul><li>设置视频音量</li></ul><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">volume</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.video.currentTime: 返回视频当前播放时间。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.video.duration: 返回视频总时间。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.video.paused: 返回视频是否暂停。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.danmaku：弹幕功能。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.danmaku.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">send</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(danmaku, callback: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 提交一个新弹幕</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">danmaku</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">send</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;dplayer is amazing&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;#b7daff&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;right&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// should be \`top\` \`bottom\` or \`right\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   },</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;success&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dp.danmaku.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">opacity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(percentage: number)：设置弹幕透明度，透明度值在 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 到 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span></code></pre></div><ul><li>之间。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.danmaku.opacity(0.5);</span></span>
<span class="line"><span>dp.danmaku.clear(): 清除所有弹幕。</span></span>
<span class="line"><span>dp.danmaku.hide(): 隐藏弹幕。</span></span>
<span class="line"><span>dp.danmaku.show() ：显示弹幕。</span></span></code></pre></div><ul><li>如果想进入全屏，我们就通过后面的方式来实现。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.fullScreen.request(&#39;web&#39;);</span></span></code></pre></div><ul><li>退出全屏则是通过后面的方式。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.fullScreen.cancel(&#39;web&#39;);</span></span></code></pre></div><p>其他属性和 API 你可以参考官方文档。</p><p>现在，相信你已经对 DPlayer 有所了解啦，是不是感觉 so easy!</p><p>可以说，我们轻轻松松就已经成功了一半了。俗话说百说不如一练。下面我们来尝试结合业务，实现一个视频详情页。你可以跟着我一起实现自己的视频详情页面。</p><h2 id="视频详情页面的实现" tabindex="-1">视频详情页面的实现 <a class="header-anchor" href="#视频详情页面的实现" aria-label="Permalink to &quot;视频详情页面的实现&quot;">​</a></h2><p>我们先来看一下成品的效果图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/11/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/11/2.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/11/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E5%AE%9E%E6%88%98%C2%B7%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0/images/11/3.png" alt=""></a></p><p>视频详情页是由首页的视频列表页点击进入的，链接上会带上当前视频的 ID。</p><p>页面中的功能如下。</p><ol><li><p>播放器，用来观看视频。</p></li><li><p>评论、关注、点赞、收藏。</p></li><li><p>推荐视频、排行榜。</p></li></ol><p>我们先来构思一下页面的布局。</p><p>我们把整个页面分为上下两部分，每个部分又以左右结构来呈现。上面从左至右分别是视频播放器、推荐视频，下面依次是评论和排行榜。</p><p>接下来我们一步步实现这个构想。我们的页面使用的是 Vue + ElementUI + DPlayer 技术。</p><p>首先，我们用 Element 的栅格来实现布局。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;top&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-row :gutter=&quot;20&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-col :span=&quot;20&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​div&gt;这里是播放器&lt;​/div&gt;&lt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​div&gt;这里是推荐视频&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;bottom&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​el-row :gutter=&quot;20&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-col :span=&quot;20&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​div&gt;这里是评论&lt;​/div&gt;&lt;​/e</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​el-col :span=&quot;4&quot;&gt;&lt;​div class=&quot;grid-content bg-purple&quot;&gt;&lt;​div&gt;这里是排行榜&lt;​/div&gt;&lt;/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;​/el-row&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span></code></pre></div><p>不管从首页视频列表，还是从二级页面视频列表跳转到视频详情页，在请求的链接中都会带上视频的 ID。当我们点击列表中的视频进入页面时，会首先向后端发送请求，通过 ID 获取到视频的信息。</p><p>接下来，我们在 Vue 的 data 里定义一些一会儿要用的数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data() {</span></span>
<span class="line"><span>   return {</span></span>
<span class="line"><span>     info: {},             // 视频信息</span></span>
<span class="line"><span>     recommend_list: [],   // 推荐列表</span></span>
<span class="line"><span>     ranking_list: [],     // 排行榜</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在框架中，通常使用 Axios 来发送 HTTP 请求。举个例子，我们现在要请求的是 “/video/info”这个地址的数据，是 get 请求。那么代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.$axios.get(&quot;/video/info&quot;).then((data) =&gt; {</span></span>
<span class="line"><span>     console.log(data);</span></span>
<span class="line"><span>     this.info= data.data;</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>返回的数据结构应该是下面的样子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  {</span></span>
<span class="line"><span>       title: &quot;全程高能！此视频无人能存活到最后！&quot;,  //视频标题</span></span>
<span class="line"><span>       url:&quot;http://www.baidu.com/123.mp4&quot;,     //视频url</span></span>
<span class="line"><span>       play_times: 1000,                       //播放次数</span></span>
<span class="line"><span>       like_times: 10000,                      //点赞数</span></span>
<span class="line"><span>       collect_times:1000,                     //收藏数</span></span>
<span class="line"><span>       auther: {                               //视频作者的信息</span></span>
<span class="line"><span>         userId：&quot;10001&quot;，                      //作者id</span></span>
<span class="line"><span>         avatar:&quot;http://www.baidu.com/1.jpg&quot;,  //作者头像</span></span>
<span class="line"><span>         nickName: &quot;天线宝宝&quot;                   //作者昵称</span></span>
<span class="line"><span>         hasFollow: false                      //当前用户是否关注了作者</span></span>
<span class="line"><span>       },</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>接下来，我们把视频 URL 配置到视频播放器上，这样视频就可以播放了。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> dp</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DPlayer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> video: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.info</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><p>那刚刚我们学过的 API 要什么时候使用呢？我给你举几个例子。</p><p>如果用户离开前，我们要记录用户看了多长时间的视频，发送给后端来统计用户行为，就要用到刚刚我讲过的播放器 API。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.video.currentTime()</span></span></code></pre></div><p>同理，假设用户点击了页面上的广告需要暂停视频，看完广告后又再播放视频，这时就要用到播放和暂停 API。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dp.play()</span></span>
<span class="line"><span>dp.pause()</span></span></code></pre></div><p>然后，我们在页面上把视频的信息展示给用户，包括视频标题、作者、点赞数、评论等等。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​div class=&quot;left-container&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;​div id=&quot;dplayer&quot;&gt;&lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     &lt;​div class=&quot;video-bottom-area&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​span class=&quot;play-times&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​span&gt;{​{ info.play_times }​}&lt;​/span&gt;次播放量</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​span class=&quot;play-times&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​span&gt;{​{ info.play_times }​}&lt;​/span&gt;个赞</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​span class=&quot;play-times&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​span&gt;{​{ info.play_times }​}&lt;​/span&gt;次收藏</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​div class=&quot;auther-info rt clear&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;lf&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​img :src=&quot;info.auther.photoUrl&quot; alt /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​p class=&quot;author-name&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             {​{ info.auther.nickName }​}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             v-show=&quot;!info.auther.hasFollow&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             class=&quot;button-primary rt&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             关注</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​button</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             v-show=&quot;info.auther.hasFollow&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             class=&quot;button-primary rt&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             取消关注</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/button&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/div&gt;</span></span></code></pre></div><p>接下来，我们分别请求排行榜和推荐列表的接口，展示在页面上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.$axios.get(&quot;/video/recommend&quot;).then((data) =&gt; {</span></span>
<span class="line"><span>     console.log(data);</span></span>
<span class="line"><span>     this.recommend_list = data.data.rows;</span></span>
<span class="line"><span>   });</span></span>
<span class="line"><span>this.$axios.get(&quot;/video/ranking&quot;).then((data) =&gt; {</span></span>
<span class="line"><span>     console.log(data);</span></span>
<span class="line"><span>     this.ranking_list = data.data.rows;</span></span>
<span class="line"><span>   });</span></span></code></pre></div><p>列表这里我们用到的数据结构是数组，每个元素是列表上的一项。返回的数据结构如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1.recommend_list:{</span></span>
<span class="line"><span> status: 200,</span></span>
<span class="line"><span> message: &#39;success&#39;,</span></span>
<span class="line"><span> data: {</span></span>
<span class="line"><span>   total: 5,</span></span>
<span class="line"><span>   rows: [{</span></span>
<span class="line"><span>     id: &#39;10001&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/similar1.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;炉石传说&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;10002&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/similar2.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;小猪佩奇&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;10003&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/similar3.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;小恐龙&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;10004&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/similar4.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;小兔兔&#39;</span></span>
<span class="line"><span>   },{</span></span>
<span class="line"><span>     id: &#39;10005&#39;,</span></span>
<span class="line"><span>     image: &#39;./static/similar5.jpg&#39;,</span></span>
<span class="line"><span>     name: &#39;小喵咪&#39;</span></span>
<span class="line"><span>   }]</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>2.ranking_list:{</span></span>
<span class="line"><span> status: 200,</span></span>
<span class="line"><span> message: &#39;success&#39;,</span></span>
<span class="line"><span> data: {</span></span>
<span class="line"><span>   total: 10,</span></span>
<span class="line"><span>   &#39;rows&#39;: [{</span></span>
<span class="line"><span>       img: &quot;./static/1.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;这才是大学生该有的快乐生活！&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/2.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;ChatGPT会抢走哪些工作？我算是玩明白了…&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/3.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;92岁的世界最高龄模特，纵横T台76年 …&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/4.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;泳装芭芭拉“冲”呀！&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/5.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;EOE单曲《和你在一起》首次披露舞台！&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/1.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;如何30秒快速清空大脑停止胡思乱想？&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/2.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;《将军》他翻唱一直可以的&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/3.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;一个初中生花光压岁钱cos的W&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/4.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;1天学费1200！不听劝裸辞去学馒头了！&quot;,</span></span>
<span class="line"><span>     },{</span></span>
<span class="line"><span>       img: &quot;./static/5.jpg&quot;,</span></span>
<span class="line"><span>       title: &quot;【原神】当小绫华开始阴阳怪气&quot;,</span></span>
<span class="line"><span>     }]</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>右侧的排行榜和右下方的推荐，都是其他视频详情页的链接入口。我们只需要分别向后端服务器请求到要展示的标题和图片，在用户点击的时候进行跳转并更换视频 ID 就可以了。</p><p>后面是推荐列表的参考代码。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​ul class=&quot;recommend-list&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​li</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           v-for=&quot;(item, index) in recommend_list&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           :key=&quot;index&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           :style=&quot;{ backgroundImage: \`url(\${item.image})\` }&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​div class=&quot;mask&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​p&gt;{​{ item.name }​}&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/div&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/ul&gt;</span></span></code></pre></div><p>接下来是排行榜的参考代码。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​div class=&quot;ranking-list&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​p class=&quot;sub-title&quot;&gt;排行榜&lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​li v-for=&quot;(item, index) in ranking_list&quot; :key=&quot;index&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​span&gt;{​{index + 1}​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">             &lt;​span&gt;{​{ item.title }​}&lt;​/span&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           &lt;​/p&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         &lt;​/li&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       &lt;​/ul&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;​/div&gt;</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这样，我们就实现了一个自己的视频播放页，大功告成！下面我们来回顾一下这节课的重点内容。</p><p>这节课，我们先是了解了原生 HTML 的 Video 播放器，学习了它的常见属性。但 HTML 版的播放器的兼容性并不是很好，并不适合企业进行商业化的应用，我们也借此引出了企业中常用的两种播放器：VideoJS 和 DPlayer。</p><p>接着，我们学习了 DPlayer 的常用属性和 API，以及如何在 HTML 框架中使用它，借此，我们可以轻松应对不同场景下的播放器需求。</p><p>在工作中，企业的选型可能会有所不同，我们只需要掌握使用一款播放器的思路，其他组件也是一通百通的。这个思路可以总结为下面三步。</p><ol><li><p>引用（HTML 中需要引用文件，框架中需要 npm install 安装依赖包）。</p></li><li><p>在 HTML 中定义挂载的元素。</p></li><li><p>在 js 中把播放器属性设置好，并挂载到上一步定义好的元素上。</p></li></ol><p>在学习了播放器应用的思路和方法之后，我们还一起通过视频详情页这个模块进行了实操。在这个环节，我们除了要实现基本的视频功能外，还要考虑业务逻辑设计、页面的布局、页面的功能模块等核心要素。相信经过这部分内容的学习，你对 DPlayer 的掌握会更加全面，在技术、业务逻辑和项目实现这些方面也会有所进步。</p><p>最后，我们还一起熟悉了实际项目中后端数据的请求方式，并结合实际的前端数据需求，对后端数据格式进行了设计、封装，这也是我们这节课非常重要的部分，也是为学习后端部分做的一个小的铺垫。</p><p>这节课的内容到这里就结束了。下节课，我们会更进一步，去看看视频的互动功能，敬请期待。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>如果我们想要在用户点击视频暂停的时候，弹出一个弹窗，你有什么好的实现方法？</p><p>欢迎你在留言区和我交流互动，如果觉得这节课对你有启发的话，也推荐你把它分享给更多朋友。</p>`,110)])])}const g=a(l,[["render",t]]);export{c as __pageData,g as default};
