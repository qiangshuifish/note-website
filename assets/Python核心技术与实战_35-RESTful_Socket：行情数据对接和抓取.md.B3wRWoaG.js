import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const q=JSON.parse('{"title":"35 | RESTful & Socket：行情数据对接和抓取","description":"","frontmatter":{},"headers":[{"level":2,"title":"行情数据","slug":"行情数据","link":"#行情数据","children":[]},{"level":2,"title":"Websocket介绍","slug":"websocket介绍","link":"#websocket介绍","children":[]},{"level":2,"title":"行情抓取模块","slug":"行情抓取模块","link":"#行情抓取模块","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/35-RESTful&Socket：行情数据对接和抓取.md","filePath":"Python核心技术与实战/35-RESTful&Socket：行情数据对接和抓取.md","lastUpdated":1779816143000}'),t={name:"Python核心技术与实战/35-RESTful&Socket：行情数据对接和抓取.md"};function o(l,s,i,c,u,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_35-restful-socket-行情数据对接和抓取" tabindex="-1">35 | RESTful &amp; Socket：行情数据对接和抓取 <a class="header-anchor" href="#_35-restful-socket-行情数据对接和抓取" aria-label="Permalink to &quot;35 | RESTful &amp; Socket：行情数据对接和抓取&quot;">​</a></h1><p>你好，我是景霄。</p><p>上一节课，我们介绍了交易所的交易模式，数字货币交易所RESTful接口的常见概念，以及如何调用RESTful接口进行订单操作。众所周知，买卖操作的前提，是你需要已知市场的最新情况。这节课里，我将介绍交易系统底层另一个最重要的部分，行情数据的对接和抓取。</p><p>行情数据，最重要的是实时性和有效性。市场的情况瞬息万变，合适的买卖时间窗口可能只有几秒。在高频交易里，合适的买卖机会甚至在毫秒级别。要知道，一次从北京发往美国的网络请求，即使是光速传播，都需要几百毫秒的延迟。更别提用Python这种解释型语言，建立HTTP连接导致的时间消耗。</p><p>经过上节课的学习，你对交易应该有了基本的了解，这也是我们今天学习的基础。接下来，我们先从交易所撮合模式讲起，然后介绍行情数据有哪些；之后，我将带你基于Websocket的行情数据来抓取模块。</p><h2 id="行情数据" tabindex="-1">行情数据 <a class="header-anchor" href="#行情数据" aria-label="Permalink to &quot;行情数据&quot;">​</a></h2><p>回顾上一节我们提到的，交易所是一个买方、卖方之间的公开撮合平台。买卖方把需要/可提供的商品数量和愿意出/接受的价格提交给交易所，交易所按照公平原则进行撮合交易。</p><p>那么撮合交易是怎么进行的呢？假设你是一个人肉比特币交易所，大量的交易订单往你这里汇总，你应该如何选择才能让交易公平呢？</p><p>显然，最直观的操作就是，把买卖订单分成两个表，按照价格由高到低排列。下面的图，就是买入和卖出的委托表。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/6bade6ffe3b8d439b7826cbe6d84a22d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/6bade6ffe3b8d439b7826cbe6d84a22d.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/0d7f5bcbb766097b84b7ad36d2b26a4c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/0d7f5bcbb766097b84b7ad36d2b26a4c.png" alt=""></a></p><p>如果最高的买入价格小于最低的卖出价格，那就不会有任何交易发生。这通常是你看到的委托列表的常态。</p><p>如果最高的买入价格和最低的卖出价格相同，那么就尝试进行撮合。比如BTC在9002.01就会发生撮合，最后按照9002.01的价格，成交0.0330个BTC。当然，交易完成后，小林未完成部分的订单（余下0.1126 - 0.0330 = 0.0796 个 BTC 未卖出），还会继续在委托表里。</p><p>不过你可能会想，如果买入和卖出的价格有交叉，那么成交价格又是什么呢？事实上，这种情况并不会发生。我们来试想一下下面这样的场景。</p><p>如果你尝试给一个委托列表里加入一个新买入订单，它的价格比所有已有的最高买入价格高，也比所有的卖出价格高。那么此时，它会直接从最低的卖出价格撮合。等到最低价格的卖出订单吃完了，它便开始吃价格第二低的卖出订单，直到这个买入订单完全成交。反之亦然。所以，委托列表价格不会出现交叉。</p><p>当然，请注意，这里我说的只是限价订单的交易方式。而对于市价订单，交易规则会有一些轻微的区别，这里我就不详细解释了，主要是让你有个概念。</p><p>其实说到这里，所谓的“交易所行情”概念就呼之欲出了。交易所主要有两种行情数据：委托账本（Order Book）和活动行情（Tick data）。</p><p>我们把委托表里的具体用户隐去，相同价格的订单合并，就得到了下面这种委托账本。我们主要观察右边的数字部分，其中：</p><ul><li>上半部分里，第一列红色数字代表BTC的卖出价格，中间一列数字是这个价格区间的订单BTC总量，最右边一栏是从最低卖出价格到当前价格区间的积累订单量。</li><li>中间的大字部分，9994.10 USD是当前的市场价格，也就是上一次成交交易的价格。</li><li>下面绿色部分的含义与上半部分类似，不过指的是买入委托和对应的数量。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/740e88e95dcab334652f8761ca58171e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/740e88e95dcab334652f8761ca58171e.png" alt=""></a></p><p>Gemini的委托账本，来自 <a href="https://cryptowat.ch" target="_blank" rel="noreferrer">https://cryptowat.ch</a></p><p>这张图中，最低的卖出价格比最高的买入价格要高 6.51 USD，这个价差通常被称为Spread。这里验证了我们前面提到的，委托账本的价格永不交叉； 同时，Spread很小也能说明这是一个非常活跃的交易所。</p><p>每一次撮合发生，意味着一笔交易（Trade）的发生。卖方买方都很开心，于是交易所也很开心地通知行情数据的订阅者：刚才发生了一笔交易，交易的价格是多少，成交数量是多少。这个数据就是活动行情Tick。</p><p>有了这些数据，我们也就掌握了这个交易所的当前状态，可以开始搞事情了。</p><h2 id="websocket介绍" tabindex="-1">Websocket介绍 <a class="header-anchor" href="#websocket介绍" aria-label="Permalink to &quot;Websocket介绍&quot;">​</a></h2><p>在本文的开头我们提到过：行情数据很讲究时效性。所以，行情从交易所产生到传播给我们的程序之间的延迟，应该越低越好。通常，交易所也提供了REST的行情数据抓取接口。比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import requests</span></span>
<span class="line"><span>import timeit</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_orderbook():</span></span>
<span class="line"><span>  orderbook = requests.get(&quot;https://api.gemini.com/v1/book/btcusd&quot;).json()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>n = 10</span></span>
<span class="line"><span>latency = timeit.timeit(&#39;get_orderbook()&#39;, setup=&#39;from __main__ import get_orderbook&#39;, number=n) * 1.0 / n</span></span>
<span class="line"><span>print(&#39;Latency is {} ms&#39;.format(latency * 1000))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>###### 输出 #######</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Latency is 196.67642089999663 ms</span></span></code></pre></div><p>我在美国纽约附近城市的一个服务器上测试了这段代码，你可以看到，平均每次访问orderbook的延迟有0.25秒左右。显然，如果在国内，这个延迟只会更大。按理说，这两个美国城市的距离很短，为什么延迟会这么大呢？</p><p>这是因为，REST接口本质上是一个HTTP接口，在这之下是TCP/TLS套接字（Socket）连接。每一次REST请求，通常都会重新建立一次TCP/TLS握手；然后，在请求结束之后，断开这个链接。这个过程，比我们想象的要慢很多。</p><p>举个例子来验证这一点，在同一个城市我们试验一下。我从纽约附近的服务器和Gemini在纽约的服务器进行连接，TCP/SSL握手花了多少时间呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>curl -w &quot;TCP handshake: %{time_connect}s, SSL handshake: %{time_appconnect}s\\n&quot; -so /dev/null https://www.gemini.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span>TCP handshake: 0.072758s, SSL handshake: 0.119409s</span></span></code></pre></div><p>结果显示，HTTP连接构建的过程，就占了一大半时间！也就是说，我们每次用REST请求，都要浪费一大半的时间在和服务器建立连接上，这显然是非常低效的。很自然的你会想到，我们能否实现一次连接、多次通信呢？</p><p>事实上，Python的某些HTTP请求库，也可以支持重用底层的TCP/SSL连接。但那种方法，一来比较复杂，二来也需要服务器的支持。该怎么办呢？其实，在有WebSocket的情况下，我们完全不需要舍近求远。</p><p>我先来介绍一下WebSocket。WebSocket是一种在单个TCP/TLS连接上，进行全双工、双向通信的协议。WebSocket可以让客户端与服务器之间的数据交换变得更加简单高效，服务端也可以主动向客户端推送数据。在WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就可以直接创建持久性的连接，并进行双向数据传输。</p><p>概念听着很痛快，不过还是有些抽象。为了让你快速理解刚刚的这段话，我们还是来看两个简单的例子。二话不说，先看一段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import websocket</span></span>
<span class="line"><span>import thread</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 在接收到服务器发送消息时调用</span></span>
<span class="line"><span>def on_message(ws, message):</span></span>
<span class="line"><span>    print(&#39;Received: &#39; + message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 在和服务器建立完成连接时调用</span></span>
<span class="line"><span>def on_open(ws):</span></span>
<span class="line"><span>    # 线程运行函数</span></span>
<span class="line"><span>    def gao():</span></span>
<span class="line"><span>        # 往服务器依次发送0-4，每次发送完休息0.01秒</span></span>
<span class="line"><span>        for i in range(5):</span></span>
<span class="line"><span>            time.sleep(0.01)</span></span>
<span class="line"><span>            msg=&quot;{0}&quot;.format(i)</span></span>
<span class="line"><span>            ws.send(msg)</span></span>
<span class="line"><span>            print(&#39;Sent: &#39; + msg)</span></span>
<span class="line"><span>        # 休息1秒用于接收服务器回复的消息</span></span>
<span class="line"><span>        time.sleep(1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 关闭Websocket的连接</span></span>
<span class="line"><span>        ws.close()</span></span>
<span class="line"><span>        print(&quot;Websocket closed&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 在另一个线程运行gao()函数</span></span>
<span class="line"><span>    thread.start_new_thread(gao, ())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    ws = websocket.WebSocketApp(&quot;ws://echo.websocket.org/&quot;,</span></span>
<span class="line"><span>                              on_message = on_message,</span></span>
<span class="line"><span>                              on_open = on_open)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ws.run_forever()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 输出 #####</span></span>
<span class="line"><span>Sent: 0</span></span>
<span class="line"><span>Sent: 1</span></span>
<span class="line"><span>Received: 0</span></span>
<span class="line"><span>Sent: 2</span></span>
<span class="line"><span>Received: 1</span></span>
<span class="line"><span>Sent: 3</span></span>
<span class="line"><span>Received: 2</span></span>
<span class="line"><span>Sent: 4</span></span>
<span class="line"><span>Received: 3</span></span>
<span class="line"><span>Received: 4</span></span>
<span class="line"><span>Websocket closed</span></span></code></pre></div><p>这段代码尝试和 <code>wss://echo.websocket.org</code> 建立连接。当连接建立的时候，就会启动一条线程，连续向服务器发送5条消息。</p><p>通过输出可以看出，我们在连续发送的同时，也在不断地接受消息。这并没有像REST一样，每发送一个请求，要等待服务器完成请求、完全回复之后，再进行下一个请求。换句话说， <strong>我们在请求的同时也在接受消息</strong>，这也就是前面所说的”全双工“。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/7bbb7936b56dcae7f1e5dfbc644b4fb6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/7bbb7936b56dcae7f1e5dfbc644b4fb6.png" alt=""></a></p><p>REST（HTTP）单工请求响应的示意图</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/9d4072dedfd5944a08e3bbee5059194c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/110734/9d4072dedfd5944a08e3bbee5059194c.png" alt=""></a></p><p>Websocket全双工请求响应的示意图</p><p>再来看第二段代码。为了解释”双向“，我们来看看获取Gemini的委托账单的例子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import ssl</span></span>
<span class="line"><span>import websocket</span></span>
<span class="line"><span>import json</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 全局计数器</span></span>
<span class="line"><span>count = 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def on_message(ws, message):</span></span>
<span class="line"><span>    global count</span></span>
<span class="line"><span>    print(message)</span></span>
<span class="line"><span>    count -= 1</span></span>
<span class="line"><span>    # 接收了5次消息之后关闭websocket连接</span></span>
<span class="line"><span>    if count == 0:</span></span>
<span class="line"><span>        ws.close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    ws = websocket.WebSocketApp(</span></span>
<span class="line"><span>        &quot;wss://api.gemini.com/v1/marketdata/btcusd?top_of_book=true&amp;offers=true&quot;,</span></span>
<span class="line"><span>        on_message=on_message)</span></span>
<span class="line"><span>    ws.run_forever(sslopt={&quot;cert_reqs&quot;: ssl.CERT_NONE})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>###### 输出 #######</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;update&quot;,&quot;eventId&quot;:7275473603,&quot;socket_sequence&quot;:0,&quot;events&quot;:[{&quot;type&quot;:&quot;change&quot;,&quot;reason&quot;:&quot;initial&quot;,&quot;price&quot;:&quot;11386.12&quot;,&quot;delta&quot;:&quot;1.307&quot;,&quot;remaining&quot;:&quot;1.307&quot;,&quot;side&quot;:&quot;ask&quot;}]}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;update&quot;,&quot;eventId&quot;:7275475120,&quot;timestamp&quot;:1562380981,&quot;timestampms&quot;:1562380981991,&quot;socket_sequence&quot;:1,&quot;events&quot;:[{&quot;type&quot;:&quot;change&quot;,&quot;side&quot;:&quot;ask&quot;,&quot;price&quot;:&quot;11386.62&quot;,&quot;remaining&quot;:&quot;1&quot;,&quot;reason&quot;:&quot;top-of-book&quot;}]}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;update&quot;,&quot;eventId&quot;:7275475271,&quot;timestamp&quot;:1562380982,&quot;timestampms&quot;:1562380982387,&quot;socket_sequence&quot;:2,&quot;events&quot;:[{&quot;type&quot;:&quot;change&quot;,&quot;side&quot;:&quot;ask&quot;,&quot;price&quot;:&quot;11386.12&quot;,&quot;remaining&quot;:&quot;1.3148&quot;,&quot;reason&quot;:&quot;top-of-book&quot;}]}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;update&quot;,&quot;eventId&quot;:7275475838,&quot;timestamp&quot;:1562380986,&quot;timestampms&quot;:1562380986270,&quot;socket_sequence&quot;:3,&quot;events&quot;:[{&quot;type&quot;:&quot;change&quot;,&quot;side&quot;:&quot;ask&quot;,&quot;price&quot;:&quot;11387.16&quot;,&quot;remaining&quot;:&quot;0.072949&quot;,&quot;reason&quot;:&quot;top-of-book&quot;}]}</span></span>
<span class="line"><span>{&quot;type&quot;:&quot;update&quot;,&quot;eventId&quot;:7275475935,&quot;timestamp&quot;:1562380986,&quot;timestampms&quot;:1562380986767,&quot;socket_sequence&quot;:4,&quot;events&quot;:[{&quot;type&quot;:&quot;change&quot;,&quot;side&quot;:&quot;ask&quot;,&quot;price&quot;:&quot;11389.22&quot;,&quot;remaining&quot;:&quot;0.06204196&quot;,&quot;reason&quot;:&quot;top-of-book&quot;}]}</span></span></code></pre></div><p>可以看到，在和Gemini建立连接后，我们并没有向服务器发送任何消息，没有任何请求，但是服务器却源源不断地向我们推送数据。这可比REST接口“每请求一次获得一次回复”的沟通方式高效多了！</p><p>因此，相对于REST来说，Websocket是一种更加实时、高效的数据交换方式。当然缺点也很明显：因为请求和回复是异步的，这让我们程序的状态控制逻辑更加复杂。这一点，后面的内容里我们会有更深刻的体会。</p><h2 id="行情抓取模块" tabindex="-1">行情抓取模块 <a class="header-anchor" href="#行情抓取模块" aria-label="Permalink to &quot;行情抓取模块&quot;">​</a></h2><p>有了 Websocket 的基本概念，我们就掌握了和交易所连接的第二种方式。</p><p>事实上，Gemini 提供了两种 Websocket 接口，一种是 Public 接口，一种为 Private 接口。</p><p>Public 接口，即公开接口，提供 orderbook 服务，即每个人都能看到的当前挂单价和深度，也就是我们这节课刚刚详细讲过的 orderbook。</p><p>而 Private 接口，和我们上节课讲的挂单操作有关，订单被完全执行、被部分执行等等其他变动，你都会得到通知。</p><p>我们以 orderbook 爬虫为例，先来看下如何抓取 orderbook 信息。下面的代码详细写了一个典型的爬虫，同时使用了类进行封装，希望你不要忘记我们这门课的目的，了解 Python 是如何应用于工程实践中的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import copy</span></span>
<span class="line"><span>import json</span></span>
<span class="line"><span>import ssl</span></span>
<span class="line"><span>import time</span></span>
<span class="line"><span>import websocket</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class OrderBook(object):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    BIDS = &#39;bid&#39;</span></span>
<span class="line"><span>    ASKS = &#39;ask&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __init__(self, limit=20):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self.limit = limit</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # (price, amount)</span></span>
<span class="line"><span>        self.bids = {}</span></span>
<span class="line"><span>        self.asks = {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self.bids_sorted = []</span></span>
<span class="line"><span>        self.asks_sorted = []</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def insert(self, price, amount, direction):</span></span>
<span class="line"><span>        if direction == self.BIDS:</span></span>
<span class="line"><span>            if amount == 0:</span></span>
<span class="line"><span>                if price in self.bids:</span></span>
<span class="line"><span>                    del self.bids[price]</span></span>
<span class="line"><span>            else:</span></span>
<span class="line"><span>                self.bids[price] = amount</span></span>
<span class="line"><span>        elif direction == self.ASKS:</span></span>
<span class="line"><span>            if amount == 0:</span></span>
<span class="line"><span>                if price in self.asks:</span></span>
<span class="line"><span>                    del self.asks[price]</span></span>
<span class="line"><span>            else:</span></span>
<span class="line"><span>                self.asks[price] = amount</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            print(&#39;WARNING: unknown direction {}&#39;.format(direction))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def sort_and_truncate(self):</span></span>
<span class="line"><span>        # sort</span></span>
<span class="line"><span>        self.bids_sorted = sorted([(price, amount) for price, amount in self.bids.items()], reverse=True)</span></span>
<span class="line"><span>        self.asks_sorted = sorted([(price, amount) for price, amount in self.asks.items()])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # truncate</span></span>
<span class="line"><span>        self.bids_sorted = self.bids_sorted[:self.limit]</span></span>
<span class="line"><span>        self.asks_sorted = self.asks_sorted[:self.limit]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # copy back to bids and asks</span></span>
<span class="line"><span>        self.bids = dict(self.bids_sorted)</span></span>
<span class="line"><span>        self.asks = dict(self.asks_sorted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def get_copy_of_bids_and_asks(self):</span></span>
<span class="line"><span>        return copy.deepcopy(self.bids_sorted), copy.deepcopy(self.asks_sorted)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Crawler:</span></span>
<span class="line"><span>    def __init__(self, symbol, output_file):</span></span>
<span class="line"><span>        self.orderbook = OrderBook(limit=10)</span></span>
<span class="line"><span>        self.output_file = output_file</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self.ws = websocket.WebSocketApp(&#39;wss://api.gemini.com/v1/marketdata/{}&#39;.format(symbol),</span></span>
<span class="line"><span>                                         on_message = lambda ws, message: self.on_message(message))</span></span>
<span class="line"><span>        self.ws.run_forever(sslopt={&#39;cert_reqs&#39;: ssl.CERT_NONE})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def on_message(self, message):</span></span>
<span class="line"><span>        # 对收到的信息进行处理，然后送给 orderbook</span></span>
<span class="line"><span>        data = json.loads(message)</span></span>
<span class="line"><span>        for event in data[&#39;events&#39;]:</span></span>
<span class="line"><span>            price, amount, direction = float(event[&#39;price&#39;]), float(event[&#39;remaining&#39;]), event[&#39;side&#39;]</span></span>
<span class="line"><span>            self.orderbook.insert(price, amount, direction)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 整理 orderbook，排序，只选取我们需要的前几个</span></span>
<span class="line"><span>        self.orderbook.sort_and_truncate()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 输出到文件</span></span>
<span class="line"><span>        with open(self.output_file, &#39;a+&#39;) as f:</span></span>
<span class="line"><span>            bids, asks = self.orderbook.get_copy_of_bids_and_asks()</span></span>
<span class="line"><span>            output = {</span></span>
<span class="line"><span>                &#39;bids&#39;: bids,</span></span>
<span class="line"><span>                &#39;asks&#39;: asks,</span></span>
<span class="line"><span>                &#39;ts&#39;: int(time.time() * 1000)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            f.write(json.dumps(output) + &#39;\\n&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    crawler = Crawler(symbol=&#39;BTCUSD&#39;, output_file=&#39;BTCUSD.txt&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>###### 输出 #######</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{&quot;bids&quot;: [[11398.73, 0.96304843], [11398.72, 0.98914437], [11397.32, 1.0], [11396.13, 2.0], [11395.95, 2.0], [11395.87, 1.0], [11394.09, 0.11803397], [11394.08, 1.0], [11393.59, 0.1612581], [11392.96, 1.0]], &quot;asks&quot;: [[11407.42, 1.30814001], [11407.92, 1.0], [11409.48, 2.0], [11409.66, 2.0], [11412.15, 0.525], [11412.42, 1.0], [11413.77, 0.11803397], [11413.99, 0.5], [11414.28, 1.0], [11414.72, 1.0]], &quot;ts&quot;: 1562558996535}</span></span>
<span class="line"><span>{&quot;bids&quot;: [[11398.73, 0.96304843], [11398.72, 0.98914437], [11397.32, 1.0], [11396.13, 2.0], [11395.95, 2.0], [11395.87, 1.0], [11394.09, 0.11803397], [11394.08, 1.0], [11393.59, 0.1612581], [11392.96, 1.0]], &quot;asks&quot;: [[11407.42, 1.30814001], [11407.92, 1.0], [11409.48, 2.0], [11409.66, 2.0], [11412.15, 0.525], [11412.42, 1.0], [11413.77, 0.11803397], [11413.99, 0.5], [11414.28, 1.0], [11414.72, 1.0]], &quot;ts&quot;: 1562558997377}</span></span>
<span class="line"><span>{&quot;bids&quot;: [[11398.73, 0.96304843], [11398.72, 0.98914437], [11397.32, 1.0], [11396.13, 2.0], [11395.95, 2.0], [11395.87, 1.0], [11394.09, 0.11803397], [11394.08, 1.0], [11393.59, 0.1612581], [11392.96, 1.0]], &quot;asks&quot;: [[11407.42, 1.30814001], [11409.48, 2.0], [11409.66, 2.0], [11412.15, 0.525], [11412.42, 1.0], [11413.77, 0.11803397], [11413.99, 0.5], [11414.28, 1.0], [11414.72, 1.0]], &quot;ts&quot;: 1562558997765}</span></span>
<span class="line"><span>{&quot;bids&quot;: [[11398.73, 0.96304843], [11398.72, 0.98914437], [11397.32, 1.0], [11396.13, 2.0], [11395.95, 2.0], [11395.87, 1.0], [11394.09, 0.11803397], [11394.08, 1.0], [11393.59, 0.1612581], [11392.96, 1.0]], &quot;asks&quot;: [[11407.42, 1.30814001], [11409.48, 2.0], [11409.66, 2.0], [11412.15, 0.525], [11413.77, 0.11803397], [11413.99, 0.5], [11414.28, 1.0], [11414.72, 1.0]], &quot;ts&quot;: 1562558998638}</span></span>
<span class="line"><span>{&quot;bids&quot;: [[11398.73, 0.97131753], [11398.72, 0.98914437], [11397.32, 1.0], [11396.13, 2.0], [11395.95, 2.0], [11395.87, 1.0], [11394.09, 0.11803397], [11394.08, 1.0], [11393.59, 0.1612581], [11392.96, 1.0]], &quot;asks&quot;: [[11407.42, 1.30814001], [11409.48, 2.0], [11409.66, 2.0], [11412.15, 0.525], [11413.77, 0.11803397], [11413.99, 0.5], [11414.28, 1.0], [11414.72, 1.0]], &quot;ts&quot;: 1562558998645}</span></span>
<span class="line"><span>{&quot;bids&quot;: [[11398.73, 0.97131753], [11398.72, 0.98914437], [11397.32, 1.0], [11396.13, 2.0], [11395.87, 1.0], [11394.09, 0.11803397], [11394.08, 1.0], [11393.59, 0.1612581], [11392.96, 1.0]], &quot;asks&quot;: [[11407.42, 1.30814001], [11409.48, 2.0], [11409.66, 2.0], [11412.15, 0.525], [11413.77, 0.11803397], [11413.99, 0.5], [11414.28, 1.0], [11414.72, 1.0]], &quot;ts&quot;: 1562558998748}</span></span></code></pre></div><p>代码比较长，接下来我们具体解释一下。</p><p>这段代码的最开始，封装了一个叫做 orderbook 的 class，专门用来存放与之相关的数据结构。其中的 bids 和 asks 两个字典，用来存储当前时刻下的买方挂单和卖方挂单。</p><p>此外，我们还专门维护了一个排过序的 bids_sorted 和 asks_sorted。构造函数有一个参数 limit，用来指示 orderbook 的 bids 和 asks 保留多少条数据。对于很多策略，top 5 的数据往往足够，这里我们选择的是前 10 个。</p><p>再往下看，insert() 函数用于向 orderbook 插入一条数据。需要注意，这里的逻辑是，如果某个 price 对应的 amount 是 0，那么意味着这一条数据已经不存在了，删除即可。insert 的数据可能是乱序的，因此在需要的时候，我们要对 bids 和 asks 进行排序，然后选取前面指定数量的数据。这其实就是 sort_and_truncate() 函数的作用，调用它来对 bids 和 asks 排序后截取，最后保存回 bids 和 asks。</p><p>接下来的 get_copy_of_bids_and_asks()函数，用来返回排过序的 bids 和 asks 数组。这里使用深拷贝，是因为如果直接返回，将会返回 bids_sorted 和 asks_sorted 的指针；那么，在下一次调用 sort_and_truncate() 函数的时候，两个数组的内容将会被改变，这就造成了潜在的 bug。</p><p>最后来看一下 Crawler 类。构造函数声明 orderbook，然后定义 Websocket 用来接收交易所数据。这里需要注意的一点是，回调函数 on_message() 是一个类成员函数。因此，应该你注意到了，它的第一个参数是 self，这里如果直接写成 <code>on_message = self.on_message</code> 将会出错。</p><p>为了避免这个问题，我们需要将函数再次包装一下。这里我使用了前面学过的匿名函数，来传递中间状态，注意我们只需要 message，因此传入 message 即可。</p><p>剩下的部分就很清晰了，on_message 回调函数在收到一个新的 tick 时，先将信息解码，枚举收到的所有改变；然后插入 orderbook，排序；最后连同 timestamp 一并输出即可。</p><p>虽然这段代码看起来挺长，但是经过我这么一分解，是不是发现都是学过的知识点呢？这也是我一再强调基础的原因，如果对你来说哪部分内容变得陌生了（比如面向对象编程的知识点），一定要记得及时往前复习，这样你学起新的更复杂的东西，才能轻松很多。</p><p>回到正题。刚刚的代码，主要是为了抓取 orderbook 的信息。事实上，Gemini 交易所在建立数据流 Websocket 的时候，第一条信息往往非常大，因为里面包含了那个时刻所有的 orderbook 信息。这就叫做初始数据。之后的消息，都是基于初始数据进行修改的，直接处理即可。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课我们继承上一节，从委托账本讲起，然后讲述了 WebSocket 的定义、工作机制和使用方法，最后以一个例子收尾，带你学会如何爬取 Orderbook 的信息。希望你在学习这节课的内容时，能够和上节课的内容联系起来，仔细思考 Websocket 和 RESTFul 的区别，并试着总结网络编程中不同模型的适用范围。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后给你留一道思考题。WebSocket 会丢包吗？如果丢包的话， Orderbook 爬虫又会发生什么？这一点应该如何避免呢？欢迎留言和我讨论，也欢迎你把这篇文章分享出去。</p>`,67)])])}const b=n(t,[["render",o]]);export{q as __pageData,b as default};
