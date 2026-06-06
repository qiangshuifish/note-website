import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"16 | WebRTC中的数据统计原来这么强大（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"再论 getStats","slug":"再论-getstats","link":"#再论-getstats","children":[]},{"level":2,"title":"RTCStatsReport","slug":"rtcstatsreport","link":"#rtcstatsreport","children":[]},{"level":2,"title":"RTCP 交换统计信息","slug":"rtcp-交换统计信息","link":"#rtcp-交换统计信息","children":[]},{"level":2,"title":"绘制图形","slug":"绘制图形","link":"#绘制图形","children":[{"level":3,"title":"1. 引入第三方库","slug":"_1-引入第三方库","link":"#_1-引入第三方库","children":[]},{"level":3,"title":"2. client.js 代码的实现","slug":"_2-client-js-代码的实现","link":"#_2-client-js-代码的实现","children":[]},{"level":3,"title":"3. 最终的结果","slug":"_3-最终的结果","link":"#_3-最终的结果","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考时间","slug":"思考时间","link":"#思考时间","children":[]},{"level":2,"title":"参考","slug":"参考","link":"#参考","children":[]}],"relativePath":"从0打造音视频直播系统/16-WebRTC中的数据统计原来这么强大（下）.md","filePath":"从0打造音视频直播系统/16-WebRTC中的数据统计原来这么强大（下）.md","lastUpdated":1779818563000}'),t={name:"从0打造音视频直播系统/16-WebRTC中的数据统计原来这么强大（下）.md"};function l(i,s,r,c,o,g){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_16-webrtc中的数据统计原来这么强大-下" tabindex="-1">16 | WebRTC中的数据统计原来这么强大（下） <a class="header-anchor" href="#_16-webrtc中的数据统计原来这么强大-下" aria-label="Permalink to &quot;16 | WebRTC中的数据统计原来这么强大（下）&quot;">​</a></h1><p>在 <a href="https://time.geekbang.org/column/article/118885" target="_blank" rel="noreferrer">上一篇文章</a> 中我向你介绍了 WebRTC 可以获得哪些统计信息，以及如何使用 RTCPeerConntction 对象的 getStats 方法获取想要的统计信息。</p><p>那本文我们在 <a href="https://time.geekbang.org/column/article/118885" target="_blank" rel="noreferrer">上一篇文章</a> 的基础之上，继续对 WebRTC 中的统计信息做进一步的讨论，了解它更为详细的内容。</p><h2 id="再论-getstats" tabindex="-1">再论 getStats <a class="header-anchor" href="#再论-getstats" aria-label="Permalink to &quot;再论 getStats&quot;">​</a></h2><p>现在你已经非常清楚，通过 RTCPeerConnection 对象的 getStats 方法可以很轻松地获取到各种统计信息，比如发了多少包、收了多少包、丢了多少包，等等。但实际上对于收发包这块儿的统计还可以从其他方法获取到，即通过 <strong>RTCRtpSender 的 getStats 方法和 RTCRtpReceiver 的 getStats 方法也能获取收发包的统计信息</strong>。</p><p>也就是说，除了 RTCPeerConnection 对象有 getStats 方法外，RTCRtpSender 和 RTCRtpReceiver 对象也有 getStats 方法，只不过它们只能获取到与传输相关的统计信息，而RTCPeerConnection还可以获取到其他更多的统计信息。</p><p>下面我们就来看一下它们三者之间的区别：</p><ul><li>RTCPeerConnection 对象的 getStats 方法获取的是 <strong>所有的统计信息</strong>，除了收发包的统计信息外，还有候选者、证书、编解码器等其他类型的统计信息。</li><li>RTCRtpSender对象的 getStats 方法只统计 <strong>与发送相关</strong> 的统计信息。</li><li>RTCRtpReceiver对象的 getStats 方法则只统计 <strong>与接收相关</strong> 的统计信息。</li></ul><p>通过上面的描述，我想你已经非常清楚 RTCPeerConnection 中的 getStats 方法是获取到所有的统计信息，而 RTCRtpSender 和 RTCRtpReceiver 对象中的 getStats 方法则分别统计的是发包、收包的统计信息。所以RTCPeerConnection 对象中的统计信息与 RTCRtpSender 和 RTCRtpReceiver 对象中的统计信息是 <strong>整体与局部</strong> 的关系。</p><p>下面咱们通过一段示例代码来详细看看它们之间的不同：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>var pc = new RTCPeerConnection(null);</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pc.getStats()</span></span>
<span class="line"><span>  .then( reports =&amp;gt; { //得到相关的报告</span></span>
<span class="line"><span>    reports.forEach( report =&amp;gt; { //遍历每个报告</span></span>
<span class="line"><span>      console.log(report);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }).catch( err=&amp;gt;{</span></span>
<span class="line"><span>    console.error(err);</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//从 PC 上获得 sender 对象</span></span>
<span class="line"><span>var sender = pc.getSenders()[0];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//调用sender的 getStats 方法</span></span>
<span class="line"><span>sender.getStats()</span></span>
<span class="line"><span>    .then(reports =&amp;gt; { //得到相关的报告</span></span>
<span class="line"><span>        reports.forEach(report =&amp;gt;{ //遍历每个报告</span></span>
<span class="line"><span>            if(report.type === &#39;outbound-rtp&#39;){ //如果是rtp输出流</span></span>
<span class="line"><span>            ....</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>     );</span></span>
<span class="line"><span> ...</span></span></code></pre></div><p>在上面的代码中生成了两段统计信息，一段是通过 RTCPeerConnection 对象的 getStats 方法获取到的，其结果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/5c6cdea557a8a3ec0208a2915d6a5461.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/5c6cdea557a8a3ec0208a2915d6a5461.png" alt=""></a></p><p>另一段是通过 RTCRtpSender 对象的 getStats 方法获取到的，其结果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/212a2a9124f8b643755ee63a5bafca24.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/212a2a9124f8b643755ee63a5bafca24.png" alt=""></a></p><p>通过对上面两幅图的对比你可以发现，RTCPeerConnection 对象的 getStats 方法获取到的统计信息明显要比 RTCRtpSender 对象的 getStats 方法获取到的信息多得多。这也证明了我们上面的结论，即 RTCPeerConnection 对象的 getStas 方法获取到的信息与 RTCRtpSender 对象的 getStats 方法获取的信息之间是 <strong>整体与局部</strong> 的关系。</p><h2 id="rtcstatsreport" tabindex="-1">RTCStatsReport <a class="header-anchor" href="#rtcstatsreport" aria-label="Permalink to &quot;RTCStatsReport&quot;">​</a></h2><p>我们通过 getStats API 可以获取到WebRTC各个层面的统计信息，它的返回值的类型是RTCStatsReport。</p><p>RTCStatsReport的结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface RTCStatsReport {</span></span>
<span class="line"><span>  readonly maplike&amp;lt;DOMString, object&amp;gt;;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>即 RTCStatsReport 中有一个Map，Map中的key是一个字符串，object是 RTCStats 的继承类。</p><p>RTCStats作为基类，它包括以下三个字段。</p><ul><li>id：对象的唯一标识，是一个字符串。</li><li>timestamp：时间戳，用来标识该条Report是什么时间产生的。</li><li>type：类型，是 RTCStatsType 类型，它是各种类型Report的基类。</li></ul><p>而继承自 RTCStats 的子类就特别多了，下面我挑选其中的一些子类向你做下介绍。</p><p><strong>第一种，编解码器相关</strong> 的统计信息，即RTCCodecStats。其类型定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dictionary RTCCodecStats : RTCStats {</span></span>
<span class="line"><span>             unsigned long payloadType; //数据负载类型</span></span>
<span class="line"><span>             RTCCodecType  codecType;   //编解码类型</span></span>
<span class="line"><span>             DOMString     transportId; //传输ID</span></span>
<span class="line"><span>             DOMString     mimeType;</span></span>
<span class="line"><span>             unsigned long clockRate;   //采样时钟频率</span></span>
<span class="line"><span>             unsigned long channels;    //声道数，主要用于音频</span></span>
<span class="line"><span>             DOMString     sdpFmtpLine;</span></span>
<span class="line"><span>             DOMString     implementation;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>通过 RTCCodecStats 类型的统计信息，你就可以知道现在直播过程中都支持哪些类型的编解码器，如 AAC、OPUS、H264、VP8/VP9等等。</p><p><strong>第二种，输入RTP流相关</strong> 的统计信息，即 RTCInboundRtpStreamStats。其类型定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dictionary RTCInboundRtpStreamStats : RTCReceivedRtpStreamStats {</span></span>
<span class="line"><span>            ...</span></span>
<span class="line"><span>             unsigned long        frameWidth;     //帧宽度</span></span>
<span class="line"><span>             unsigned long        frameHeight;    //帧高度</span></span>
<span class="line"><span>             double               framesPerSecond;//每秒帧数</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>             unsigned long long   bytesReceived;  //接收到的字节数</span></span>
<span class="line"><span>             ....</span></span>
<span class="line"><span>             unsigned long        packetsDuplicated; //重复的包数</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>             unsigned long        nackCount;         //丢包数</span></span>
<span class="line"><span>             ....</span></span>
<span class="line"><span>             double               jitterBufferDelay; //缓冲区延迟</span></span>
<span class="line"><span>             ....</span></span>
<span class="line"><span>             unsigned long        framesReceived;    //接收的帧数</span></span>
<span class="line"><span>             unsigned long        framesDropped;     //丢掉的帧数</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>            };</span></span></code></pre></div><p>通过 RTCInboundRtpStreamStats 类型的统计信息，你就可以从中取出接收到字节数、包数、丢包数等信息了。</p><p><strong>第三种，输出RTP流相关</strong> 的统计信息，即 RTCOutboundRtpStreamStats。其类型定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dictionary RTCOutboundRtpStreamStats : RTCSentRtpStreamStats {</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>             unsigned long long   retransmittedPacketsSent; //重传包数</span></span>
<span class="line"><span>             unsigned long long   retransmittedBytesSent; //重传字节数</span></span>
<span class="line"><span>             double               targetBitrate;  //目标码率</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>.</span></span>
<span class="line"><span>             unsigned long        frameWidth;  //帧的宽度</span></span>
<span class="line"><span>             unsigned long        frameHeight; //帧的高度</span></span>
<span class="line"><span>             double               framesPerSecond; //每秒帧数</span></span>
<span class="line"><span>             unsigned long        framesSent; //发送的总帧数</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>             unsigned long        nackCount; //丢包数</span></span>
<span class="line"><span>             ....</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>通过 RTCOutboundRtpStreamStats 类型的统计信息，你就可以从中得到目标码率、每秒发送的帧数、发送的总帧数等内容了。</p><p>在 WebRTC 1.0 规范中，一共定义了 17 种 RTCStats 类型的子类，这里我们就不一一进行说明了。关于这 17 种子类型，你可以到文末的参考中去查看。实际上，这个表格在 <a href="https://time.geekbang.org/column/article/118885" target="_blank" rel="noreferrer">上一篇文章</a> 中我已经向你做过介绍了，这里再重新温习一下。</p><p>若你对具体细节很感兴趣的话，可以通过《WebRTC1.0规范》去查看每个 RTCStats 的详细定义， <a href="https://w3c.github.io/webrtc-stats/#rtctatstype-*" target="_blank" rel="noreferrer">相关链接在这里</a>。</p><h2 id="rtcp-交换统计信息" tabindex="-1">RTCP 交换统计信息 <a class="header-anchor" href="#rtcp-交换统计信息" aria-label="Permalink to &quot;RTCP 交换统计信息&quot;">​</a></h2><p>在 <a href="https://time.geekbang.org/column/article/118885" target="_blank" rel="noreferrer">上一篇文章</a> 中，我给你留了一道思考题，不知你是否已经找到答案了？实际上在WebRTC中，上面介绍的输入/输出RTP流报告中的统计数据都是通过 RTCP 协议中的 SR、RR 消息计算而来的。</p><p>关于 RTCP 以及 RTCP 中的 SR、 RR 等相关协议内容记不清的同学可以再重新回顾一下 <a href="https://time.geekbang.org/column/article/109999" target="_blank" rel="noreferrer">《 06 | WebRTC中的RTP及RTCP详解》</a> 一文的内容。</p><p>在RTCP协议中，SR 是发送方发的，记录的是RTP流从发送到现在一共发了多少包、发送了多少字节数据，以及丢包率是多少。RR是接收方发的，记录的是RTP流从接收到现在一共收了多少包、多少字节的数据等。</p><p>通过 SR、RR 的不断交换，在通讯的双方就很容易计算出每秒钟的传输速率、丢包率等统计信息了。</p><p><strong>在使用 RTCP 交换信息时有一个主要原则，就是 RTCP 信息包在整个数据流的传输中占带宽的百分比不应超过 5%</strong>。也就是说你的媒体包发送得越多，RTCP信息包发送得也就越多。你的媒体包发得少，RTCP包也会相应减少，它们是一个联动关系。</p><h2 id="绘制图形" tabindex="-1">绘制图形 <a class="header-anchor" href="#绘制图形" aria-label="Permalink to &quot;绘制图形&quot;">​</a></h2><p>通过 getStats 方法我们现在可以获取到各种类型的统计数据了，而且在上面的 <strong>RTCP交换统计信息</strong> 中，我们也知道了 WebRTC 底层是如何获取到传输相关的统计数据的了，那么接下来我们再来看一下如何利用 RTCStatsReport 中的信息来绘制出各种分析图形，从而使监控的数据更加直观地展示出来。</p><p>在本文的例子中，我们以绘制每秒钟发送的比特率和每秒钟发送的包数为例，向你展示如何将 RTCStats 信息转化为图形。</p><p>要将 Report 转化为图形大体上分为以下几个步骤：</p><ul><li>引入第三方库 graph.js；</li><li>启动一个定时器，每秒钟绘制一次图形；</li><li>在定时器的回调函数中，读取 RTCStats 统计信息，转化为可量化参数，并将其传给 graph.js进行绘制。</li></ul><p>了解了上面的步骤后，下来我们就来实操一下吧！</p><p>第三方库 graph.js 是由 WebRTC 项目组开发的，是专门用于绘制各种图形的，它底层是通过 Canvas 来实现的。这个库非常短小，只有 600 多行代码，使用起来也非常方便，在下面的代码中会对它的使用做详细的介绍。</p><p>另外，该库的代码链接我已经放到了文章的末尾，供你参考。</p><h3 id="_1-引入第三方库" tabindex="-1">1. 引入第三方库 <a class="header-anchor" href="#_1-引入第三方库" aria-label="Permalink to &quot;1\\. 引入第三方库&quot;">​</a></h3><p>在 JavaScript 中引入第三方库也非常简单，只要使用 <code>&amp;lt;script&gt;</code> 就可以将第三方库引入进来了。具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;html&amp;gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  &amp;lt;body&amp;gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  &amp;lt;script src=&quot;js/client.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //引入第三方库 graph.js</span></span>
<span class="line"><span>  &amp;lt;script src=&quot;js/third_party/graph.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  &amp;lt;/body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/html&amp;gt;</span></span></code></pre></div><h3 id="_2-client-js-代码的实现" tabindex="-1">2. client.js 代码的实现 <a class="header-anchor" href="#_2-client-js-代码的实现" aria-label="Permalink to &quot;2\\. client.js 代码的实现&quot;">​</a></h3><p>client.js是绘制图形的核心代码，具体代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var pc = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//定义绘制比特率图形相关的变量</span></span>
<span class="line"><span>var bitrateGraph;</span></span>
<span class="line"><span>var bitrateSeries;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//定义绘制发送包图形相关的变理</span></span>
<span class="line"><span>var packetGraph;</span></span>
<span class="line"><span>var packetSeries;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pc = new RTCPeerConnection(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//bitrateSeries用于绘制点</span></span>
<span class="line"><span>bitrateSeries = new TimelineDataSeries();</span></span>
<span class="line"><span>//bitrateGraph用于将bitrateSeries绘制的点展示出来</span></span>
<span class="line"><span>bitrateGraph = new TimelineGraphView(&#39;bitrateGraph&#39;, &#39;bitrateCanvas&#39;);</span></span>
<span class="line"><span>bitrateGraph.updateEndDate(); //绘制时间轴</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//与上面一样，只不是用于绘制包相关的图</span></span>
<span class="line"><span>packetSeries = new TimelineDataSeries();</span></span>
<span class="line"><span>packetGraph = new TimelineGraphView(&#39;packetGraph&#39;, &#39;packetCanvas&#39;);</span></span>
<span class="line"><span>packetGraph.updateEndDate();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//每秒钟获取一次 Report，并更新图形</span></span>
<span class="line"><span>window.setInterval(() =&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (!pc) { //如果 pc 没有创建直接返回</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //从 pc 中获取发送者对象</span></span>
<span class="line"><span>  const sender = pc.getSenders()[0];</span></span>
<span class="line"><span>  if (!sender) {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  sender.getStats().then(res =&amp;gt; { //获取到所有的 Report</span></span>
<span class="line"><span>    res.forEach(report =&amp;gt; { //遍历每个 Report</span></span>
<span class="line"><span>      let bytes;</span></span>
<span class="line"><span>      let packets;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      //我们只对 outbound-rtp 型的 Report 做处理</span></span>
<span class="line"><span>      if (report.type === &#39;outbound-rtp&#39;) {</span></span>
<span class="line"><span>        if (report.isRemote) { //只对本地的做处理</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const now = report.timestamp;</span></span>
<span class="line"><span>        bytes = report.bytesSent; //获取到发送的字节</span></span>
<span class="line"><span>        packets = report.packetsSent; //获取到发送的包数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //因为计算的是每秒与上一秒的数据的对比，所以这里要做个判断</span></span>
<span class="line"><span>        //如果是第一次就不进行绘制</span></span>
<span class="line"><span>        if (lastResult &amp;&amp; lastResult.has(report.id)) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          //计算这一秒与上一秒之间发送数据的差值</span></span>
<span class="line"><span>          var mybytes= (bytes - lastResult.get(report.id).bytesSent);</span></span>
<span class="line"><span>          //计算走过的时间，因为定时器是秒级的，而时间戳是豪秒级的</span></span>
<span class="line"><span>          var mytime = (now - lastResult.get(report.id).timestamp);</span></span>
<span class="line"><span>          const bitrate = 8 * mybytes / mytime * 1000; //将数据转成比特位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          //绘制点</span></span>
<span class="line"><span>          bitrateSeries.addPoint(now, bitrate);</span></span>
<span class="line"><span>          //将会制的数据显示出来</span></span>
<span class="line"><span>          bitrateGraph.setDataSeries([bitrateSeries]);</span></span>
<span class="line"><span>          bitrateGraph.updateEndDate();//更新时间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          //下面是与包相关的绘制</span></span>
<span class="line"><span>          packetSeries.addPoint(now, packets -</span></span>
<span class="line"><span>                               lastResult.get(report.id).packetsSent);</span></span>
<span class="line"><span>          packetGraph.setDataSeries([packetSeries]);</span></span>
<span class="line"><span>          packetGraph.updateEndDate();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //记录上一次的报告</span></span>
<span class="line"><span>    lastResult = res;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}, 1000); //每秒钟触发一次</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span></code></pre></div><p>在该代码中，最重要的是32～89行的代码，因为这其中实现了一个定时器——每秒钟执行一次。每次定时器被触发时，都会调用sender 的 getStats 方法获取与传输相关的统计信息。</p><p>然后对获取到的 RTCStats 类型做判断，只取 RTCStats 类型为 outbound-rtp 的统计信息。最后将本次统计信息的数据与上一次信息的数据做差值，从而得到它们之间的增量，并将增量绘制出来。</p><h3 id="_3-最终的结果" tabindex="-1">3. 最终的结果 <a class="header-anchor" href="#_3-最终的结果" aria-label="Permalink to &quot;3\\. 最终的结果&quot;">​</a></h3><p>当运行上面的代码时，会绘制出下面的结果，这样看起来就一目了然了。通过这张图你可以看到，当时发送端的码率为 1.5Mbps的带宽，每秒差不多发送小200个数据包。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/4766d46db9b8c3aaece83a403f0e07ca.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/4766d46db9b8c3aaece83a403f0e07ca.png" alt=""></a></p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>在本文中，我首先向你介绍了除了可以通过 RTCPeerConnection 对象的 getStats 方法获取到各种统计信息之外，还可以通过 RTCRtpSender 或 RTCRtpReceiver 的 getStats 方法获得与传输相关的统计信息。WebRTC对这些统计信息做了非常细致的分类，按类型可细分为 17 种，关于这 17 种类型你可以查看文末参考中的表格。</p><p>在文中我还向你重点介绍了 <strong>编解码器、输入RTP流</strong> 以及 <strong>输出RTP流</strong> 相关的统计信息。</p><p>除此之外，在文中我还向你介绍了 <strong>网络传输</strong> 相关的统计信息是如何获得的，即通过 RTCP 协议中的 SR 和 RR 消息进行交换而来的。实际上，对于 RTCP 的知识我在前面 <a href="https://time.geekbang.org/column/article/109999" target="_blank" rel="noreferrer">《06 | WebRTC中的RTP及RTCP详解》</a> 一文中已经向你讲解过了，而本文所讲的内容则是 RTCP 协议的具体应用。</p><p>最后，我们通过使用第三方库 graph.js 与 getStats 方法结合，就可以将统计信息以图形的方式绘制出来，使你可以清晰地看出这些报告真正表达的意思。</p><h2 id="思考时间" tabindex="-1">思考时间 <a class="header-anchor" href="#思考时间" aria-label="Permalink to &quot;思考时间&quot;">​</a></h2><p>今天你要思考的问题是：当使用 RTCP 交换 SR/RR 信息时，如果 SR/RR包丢失了，会不会影响数据的准确性呢？为什么呢？</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/72b638952a9e9d0440e9efdb4e2f4493.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E6%89%93%E9%80%A0%E9%9F%B3%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E7%B3%BB%E7%BB%9F/images/120243/72b638952a9e9d0440e9efdb4e2f4493.png" alt=""></a></p><p><a href="https://github.com/avdance/webrtc_web/tree/master/16_getstat/getstats" target="_blank" rel="noreferrer">例子代码地址，戳这里</a></p><p><a href="https://github.com/avdance/webrtc_web/tree/master/16_getstat/getstats/js/third_party" target="_blank" rel="noreferrer">第三方库地址，戳这里</a></p>`,72)])])}const b=n(t,[["render",l]]);export{h as __pageData,b as default};
