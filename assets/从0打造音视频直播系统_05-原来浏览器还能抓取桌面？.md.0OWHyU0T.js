import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"05 | 原来浏览器还能抓取桌面？","description":"","frontmatter":{},"headers":[{"level":2,"title":"在WebRTC 处理过程中的位置","slug":"在webrtc-处理过程中的位置","link":"#在webrtc-处理过程中的位置","children":[]},{"level":2,"title":"共享桌面的基本原理","slug":"共享桌面的基本原理","link":"#共享桌面的基本原理","children":[]},{"level":2,"title":"如何共享桌面","slug":"如何共享桌面","link":"#如何共享桌面","children":[{"level":3,"title":"1. 抓取桌面","slug":"_1-抓取桌面","link":"#_1-抓取桌面","children":[]},{"level":3,"title":"2. 桌面的展示","slug":"_2-桌面的展示","link":"#_2-桌面的展示","children":[]},{"level":3,"title":"3. 录制桌面","slug":"_3-录制桌面","link":"#_3-录制桌面","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考时间","slug":"思考时间","link":"#思考时间","children":[]}],"relativePath":"从0打造音视频直播系统/05-原来浏览器还能抓取桌面？.md","filePath":"从0打造音视频直播系统/05-原来浏览器还能抓取桌面？.md","lastUpdated":1779818563000}'),t={name:"从0打造音视频直播系统/05-原来浏览器还能抓取桌面？.md"};function l(i,a,r,o,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_05-原来浏览器还能抓取桌面" tabindex="-1">05 | 原来浏览器还能抓取桌面？ <a class="header-anchor" href="#_05-原来浏览器还能抓取桌面" aria-label="Permalink to &quot;05 | 原来浏览器还能抓取桌面？&quot;">​</a></h1><p>无论是做音视频会议，还是做远程教育， <strong>共享桌面</strong> 都是一个必备功能。如果说在 PC 或 Mac 端写个共享桌面程序你不会有太多感受，但通过浏览器也可以共享桌面是不是觉得就有些神奇了呢？</p><p>WebRTC的愿景就是要让这些看似神奇的事情，不知不觉地发生在我们身边。</p><p>你可以想象一下，假如浏览器有了共享桌面功能，这会使得浏览器有更广阔的应用空间，一个最直接的例子就是我们可以直接通过浏览器进行远程办公、远程协助等工作，而不用再下载共享桌面的应用了，这大大提高了我们的工作效率。</p><h2 id="在webrtc-处理过程中的位置" tabindex="-1">在WebRTC 处理过程中的位置 <a class="header-anchor" href="#在webrtc-处理过程中的位置" aria-label="Permalink to &quot;在WebRTC 处理过程中的位置&quot;">​</a></h2><p>在正式进行主题之前，我们还是来看看本文在整个 WebRTC 处理过程中的位置，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/109973/c536a1dd0ed50008d2ada594e052d6a0.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/109973/c536a1dd0ed50008d2ada594e052d6a0.png" alt=""></a></p><p>WebRTC处理过程图</p><p>没错，它仍然属于音视频采集的范畴，但是这次采集的不是音视频数据而是桌面。不过这也没什么关系， <strong>桌面也可以当作一种特殊的视频数据来看待</strong>。</p><h2 id="共享桌面的基本原理" tabindex="-1">共享桌面的基本原理 <a class="header-anchor" href="#共享桌面的基本原理" aria-label="Permalink to &quot;共享桌面的基本原理&quot;">​</a></h2><p>共享桌面的基本原理其实非常简单，我们可以分“两头”来说明：</p><ul><li>对于 <strong>共享者</strong>，每秒钟抓取多次屏幕（可以是3次、5次等），每次抓取的屏幕都与上一次抓取的屏幕做比较，取它们的差值，然后对差值进行压缩；如果是第一次抓屏或切幕的情况，即本次抓取的屏幕与上一次抓取屏幕的变化率超过80%时，就做全屏的帧内压缩，其过程与JPEG图像压缩类似（有兴趣的可以自行学习）。最后再将压缩后的数据通过传输模块传送到观看端；数据到达观看端后，再进行解码，这样即可还原出整幅图片并显示出来。</li><li>对于 <strong>远程控制端</strong>，当用户通过鼠标点击共享桌面的某个位置时，会首先计算出鼠标实际点击的位置，然后将其作为参数，通过信令发送给共享端。共享端收到信令后，会模拟本地鼠标，即调用相关的 API，完成最终的操作。一般情况下，当操作完成后，共享端桌面也发生了一些变化，此时就又回到上面共享者的流程了，我就不再赘述了。</li></ul><p>通过上面的描述，可以总结出共享桌面的处理过程为： <strong>抓屏、压缩编码、传输、解码、显示、控制</strong> 这几步，你应该可以看出它与音视频的处理过程几乎是一模一样的。</p><p>对于共享桌面，很多人比较熟悉的可能是 <strong>RDP（Remote Desktop Protocal）协议</strong>，它是 Windows 系统下的共享桌面协议；还有一种更通用的远程桌面控制协议—— <strong>VNC（Virtual Network Console）</strong>，它可以实现在不同的操作系统上共享远程桌面，像TeamViewer、RealVNC都是使用的该协议。</p><p>以上的远程桌面协议一般分为桌面数据处理与信令控制两部分。</p><ul><li><strong>桌面数据</strong>：包括了桌面的抓取(采集)、编码（压缩）、传输、解码和渲染。</li><li><strong>信令控制</strong>：包括键盘事件、鼠标事件以及接收到这些事件消息后的相关处理等。</li></ul><p>其实在WebRTC中也可以实现共享远程桌面的功能。但由于共享桌面与音视频处理的流程是类似的，且 <strong>WebRTC 的远程桌面</strong> 又不需要远程控制，所以其 <strong>处理过程使用了视频的方式，而非传统意义上的RDP/VNC等远程桌面协议</strong>。</p><p>下面我们就按顺序来具体分析一下，在桌面数据处理的各个环节中，WebRTC使用的方式与RDP/VNC等真正的远程桌面协议的异同点吧。</p><p><strong>第一个环节，共享端桌面数据的采集</strong>。WebRTC 对于桌面的采集与RDP/VNC使用的技术是相同的，都是利用各平台所提供的相关API进行桌面的抓取。以 Windows 为例，可以使用下列 API 进行桌面的抓取。</p><ul><li><strong>BitBlt</strong>：XP 系统下经常使用，在 vista之后，开启DWM模式后，速度极慢。</li><li><strong>Hook</strong>：一种黑客技术，实现稍复杂。</li><li><strong>DirectX</strong>：由于DirectX 9/10/11 之间差别比较大，容易出现兼容问题。最新的 WebRTC都是使用的这种方式</li><li><strong>GetWindowDC</strong>：可以通过它来抓取窗口。</li></ul><p><strong>第二个环节，共享端桌面数据的编码</strong>。WebRTC 对桌面的编码使用的是视频编码技术，即 H264/VP8等；但RDP/VNC则不一样，它们使用的是图像压缩技术。使用视频编码技术的好处是压缩率高，而坏处是在网络不好的情况下会有模糊等问题。</p><p><strong>第三个环节，传输</strong>。编码后的桌面数据会通过流媒体传输协议发送到观看端。对于WebRTC来说，当网络有问题时，数据是可以丢失的。但对于 RDP/VNC 来说，桌面数据一定不能丢失。</p><p><strong>第四个环节，观看端解码</strong>。WebRTC 对收到的桌面数据通过视频解码技术解码，而 RDP/VNC 使用的是图像解码技术（可对比第二个环节）。</p><p><strong>第五个环节，观看端渲染</strong>。一般会通过 OpenGL/D3D等GPU进行渲染，这个 WebRTC 与 RDP/VNC 都是类似的。</p><p>通过以上的讲解，相信你应该已经对共享远程桌面有一个基本的认知了，并且也知道在浏览器下使用WebRTC 共享远程桌面，你只需要会使用浏览器提供的API即可。</p><p><strong>因此本文的目标就是：你只需要学会和掌握浏览器提供的抓取屏幕的API就可以了</strong>。至于编码、传输、解码等相关知识，我会在后面的文章中陆续为你讲解。</p><h2 id="如何共享桌面" tabindex="-1">如何共享桌面 <a class="header-anchor" href="#如何共享桌面" aria-label="Permalink to &quot;如何共享桌面&quot;">​</a></h2><p>学习完共享桌面相关的理论知识，接下来，就让我们实践起来，一起来学习如何通过浏览器来抓取桌面吧！</p><h3 id="_1-抓取桌面" tabindex="-1">1. 抓取桌面 <a class="header-anchor" href="#_1-抓取桌面" aria-label="Permalink to &quot;1\\. 抓取桌面&quot;">​</a></h3><p>首先我们先来了解一下在浏览器下抓取桌面的API的基本格式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var promise = navigator.mediaDevices.getDisplayMedia(constraints);</span></span></code></pre></div><p>这个API你看着是不是似曾相识？没错，它与前面 <a href="https://time.geekbang.org/column/article/107948" target="_blank" rel="noreferrer">《01 | 原来通过浏览器访问摄像头这么容易》</a> 一文中介绍的采集视频的 API 基本上是一样的，我们可以再看一下采集视频的 API 的样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var promise = navigator.mediaDevices.getUserMedia(constraints);</span></span></code></pre></div><p>二者唯一的区别就是：一个是 <strong>getDisaplayMedia</strong>，另一个是 <strong>getUserMedia</strong>。</p><p>这两个API都需要一个 <strong>constraints</strong> 参数来对采集的桌面/视频做一些限制。但需要注意的是，在采集视频时，参数 <strong>constraints</strong> 也是可以对音频做限制的，而在桌面采集的参数里却不能对音频进行限制了，也就是说，不能在采集桌面的同时采集音频。 <strong>这一点要特别注意</strong>。</p><p>下面我们就来看一下 <strong>如何通过 getDisplayMedia API 来采集桌面</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//得到桌面数据流</span></span>
<span class="line"><span>function getDeskStream(stream){</span></span>
<span class="line"><span>        localStream = stream;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//抓取桌面</span></span>
<span class="line"><span>function shareDesktop(){</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //只有在 PC 下才能抓取桌面</span></span>
<span class="line"><span>        if(IsPC()){</span></span>
<span class="line"><span>                //开始捕获桌面数据</span></span>
<span class="line"><span>                navigator.mediaDevices.getDisplayMedia({video: true})</span></span>
<span class="line"><span>                        .then(getDeskStream)</span></span>
<span class="line"><span>                        .catch(handleError);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span></code></pre></div><p>通过上面的方法，就可以获得桌面数据了，让我们来看一下效果图吧：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/109973/ad24096591c33c5049fcc275491597c2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/109973/ad24096591c33c5049fcc275491597c2.png" alt=""></a></p><p>Chrome浏览器共享桌面图</p><h3 id="_2-桌面的展示" tabindex="-1">2. 桌面的展示 <a class="header-anchor" href="#_2-桌面的展示" aria-label="Permalink to &quot;2\\. 桌面的展示&quot;">​</a></h3><p>桌面采集后，就可以通过 HTML 中的 <code>&amp;lt;video&gt;</code> 标签将采集到的桌面展示出来，具体代码如下所示。</p><p>首先，在 HTML 中增加下面的代码，其中 <code>&amp;lt;video&gt;</code> 标签用于播放抓取的桌面内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>&amp;lt;video autoplay playsinline id=&quot;deskVideo&quot;&amp;gt;&amp;lt;/video&amp;gt;</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>下面的 JavaScript 则将桌面内容与 <code>&amp;lt;video&gt;</code> 标签联接到一起：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> ...</span></span>
<span class="line"><span> var deskVideo = document.querySelect(&quot;video/deskVideo&quot;);</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> function getDeskStream(stream){</span></span>
<span class="line"><span>        localStream = stream;</span></span>
<span class="line"><span>        deskVideo.srcObject = stream;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> ...</span></span></code></pre></div><p>在 JavaScript中调用 <strong>getDisplayMedia</strong> 方法抓取桌面数据，当桌面数据被抓到之后，会触发 getDeskStream 函数。我们再在该函数中将获取到的 stream 与video 标签联系起来，这样当数据获取到时就从播放器里显示出来了。</p><h3 id="_3-录制桌面" tabindex="-1">3. 录制桌面 <a class="header-anchor" href="#_3-录制桌面" aria-label="Permalink to &quot;3\\. 录制桌面&quot;">​</a></h3><p>录制本地桌面与 <a href="https://time.geekbang.org/column/article/109105" target="_blank" rel="noreferrer">《04 | 可以把采集到的音视频数据录制下来吗？》</a> 一文中所讲的录制本地视频的过程是一样的。首先通过 <strong>getDisplayMedia</strong> 方法获取到本地桌面数据，然后将该流当作参数传给 MediaRecorder 对象，并实现 <strong>ondataavailable</strong> 事件，最终将音视频流录制下来。</p><p>具体代码如下所示，我们先看一下 HTML 部分：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;html&amp;gt;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    &amp;lt;button id=&quot;record&quot;&amp;gt;Start Record&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/html&amp;gt;</span></span></code></pre></div><p>上面的 HTML 代码片段定义了一个开启录制的 <strong>button</strong>，当用户点击该 button 后，就触发下面的JavaScript 代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var buffer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function handleDataAvailable(e){</span></span>
<span class="line"><span>        if(e &amp;&amp; e.data &amp;&amp; e.data.size &amp;gt; 0){</span></span>
<span class="line"><span>                buffer.push(e.data);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function startRecord(){</span></span>
<span class="line"><span>        //定义一个数组，用于缓存桌面数据，最终将数据存储到文件中</span></span>
<span class="line"><span>        buffer = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        var options = {</span></span>
<span class="line"><span>                mimeType: &#39;video/webm;codecs=vp8&#39;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(!MediaRecorder.isTypeSupported(options.mimeType)){</span></span>
<span class="line"><span>                console.error(\`\${options.mimeType} is not supported!\`);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try{</span></span>
<span class="line"><span>                //创建录制对象，用于将桌面数据录制下来</span></span>
<span class="line"><span>                mediaRecorder = new MediaRecorder(localStream, options);</span></span>
<span class="line"><span>        }catch(e){</span></span>
<span class="line"><span>                console.error(&#39;Failed to create MediaRecorder:&#39;, e);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //当捕获到桌面数据后，该事件触发</span></span>
<span class="line"><span>        mediaRecorder.ondataavailable = handleDataAvailable;</span></span>
<span class="line"><span>        mediaRecorder.start(10);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span></code></pre></div><p>当用户点击 <strong>Record</strong> 按钮的时候，就会调用 <strong>startRecord</strong> 函数。在该函数中首先判断浏览器是否支持指定的多媒体格式，如webm。 如果支持的话，再创建 <strong>MediaRecorder</strong> 对象，将桌面流录制成指定的媒体格式文件。</p><p>当从localStream获取到数据后，会触发 <strong>ondataavailable</strong> 事件。也就是会调用 handleDataAvailable 方法，最终将数据存放到Blob中。</p><p>至于将Blob保存成文件就比较容易了，我们在前面的文章 <a href="https://time.geekbang.org/column/article/109105" target="_blank" rel="noreferrer">《04 | 可以把采集到的音视频数据录制下来吗？》</a> 中都有讲解过，所以这里就不再赘述了！</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>本文我向你讲解了如何通过浏览器提供的 API 来抓取桌面，并将它显示出来，以及如何通过前面所讲的 <strong>MediaRecorder</strong> 对象将桌面录制下来。</p><p>其实，真正的商用客户端录制并不是录制音视频流，而是录制桌面流。这样即使是多人互动的场景，在有多路视频流的情况下，录制桌面的同时就将桌面上显示的所有视频一起录制下来了，这样问题是不是一下就简单了？</p><p>比较遗憾的是，关于我们上述录制桌面的API，目前很多浏览器支持得还不够好，只有 Chrome 浏览器相对比较完善。不过现在WebRTC 1.0规范已经出来了，相信在不久的将来，各浏览器都会实现这个API的。</p><h2 id="思考时间" tabindex="-1">思考时间 <a class="header-anchor" href="#思考时间" aria-label="Permalink to &quot;思考时间&quot;">​</a></h2><p>为什么使用视频的编码方式就容易出现桌面模糊的现象呢？有什么办法可以解决该问题吗？</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p><p><a href="https://github.com/avdance/webrtc_web/tree/master/05_desktop/recorder" target="_blank" rel="noreferrer">所做Demo的GitHub链接（有需要可以点这里）</a></p>`,64)])])}const u=s(t,[["render",l]]);export{h as __pageData,u as default};
