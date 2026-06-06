import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"33 | Thread-Per-Message模式：最简单实用的分工方法","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何理解Thread-Per-Message模式","slug":"如何理解thread-per-message模式","link":"#如何理解thread-per-message模式","children":[]},{"level":2,"title":"用Thread实现Thread-Per-Message模式","slug":"用thread实现thread-per-message模式","link":"#用thread实现thread-per-message模式","children":[]},{"level":2,"title":"用Fiber实现Thread-Per-Message模式","slug":"用fiber实现thread-per-message模式","link":"#用fiber实现thread-per-message模式","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/33-Thread-Per-Message模式：最简单实用的分工方法.md","filePath":"Java并发编程实战/33-Thread-Per-Message模式：最简单实用的分工方法.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/33-Thread-Per-Message模式：最简单实用的分工方法.md"};function r(t,a,i,c,o,h){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_33-thread-per-message模式-最简单实用的分工方法" tabindex="-1">33 | Thread-Per-Message模式：最简单实用的分工方法 <a class="header-anchor" href="#_33-thread-per-message模式-最简单实用的分工方法" aria-label="Permalink to &quot;33 | Thread-Per-Message模式：最简单实用的分工方法&quot;">​</a></h1><p>我们曾经把并发编程领域的问题总结为三个核心问题：分工、同步和互斥。其中，同步和互斥相关问题更多地源自微观，而分工问题则是源自宏观。我们解决问题，往往都是从宏观入手，在编程领域，软件的设计过程也是先从概要设计开始，而后才进行详细设计。同样， <strong>解决并发编程问题，首要问题也是解决宏观的分工问题</strong>。</p><p>并发编程领域里，解决分工问题也有一系列的设计模式，比较常用的主要有Thread-Per-Message模式、Worker Thread模式、生产者-消费者模式等等。今天我们重点介绍Thread-Per-Message模式。</p><h2 id="如何理解thread-per-message模式" tabindex="-1">如何理解Thread-Per-Message模式 <a class="header-anchor" href="#如何理解thread-per-message模式" aria-label="Permalink to &quot;如何理解Thread-Per-Message模式&quot;">​</a></h2><p>现实世界里，很多事情我们都需要委托他人办理，一方面受限于我们的能力，总有很多搞不定的事，比如教育小朋友，搞不定怎么办呢？只能委托学校老师了；另一方面受限于我们的时间，比如忙着写Bug，哪有时间买别墅呢？只能委托房产中介了。委托他人代办有一个非常大的好处，那就是可以专心做自己的事了。</p><p>在编程领域也有很多类似的需求，比如写一个HTTP Server，很显然只能在主线程中接收请求，而不能处理HTTP请求，因为如果在主线程中处理HTTP请求的话，那同一时间只能处理一个请求，太慢了！怎么办呢？可以利用代办的思路，创建一个子线程，委托子线程去处理HTTP请求。</p><p>这种委托他人办理的方式，在并发编程领域被总结为一种设计模式，叫做 <strong>Thread-Per-Message模式</strong>，简言之就是为每个任务分配一个独立的线程。这是一种最简单的分工方法，实现起来也非常简单。</p><h2 id="用thread实现thread-per-message模式" tabindex="-1">用Thread实现Thread-Per-Message模式 <a class="header-anchor" href="#用thread实现thread-per-message模式" aria-label="Permalink to &quot;用Thread实现Thread-Per-Message模式&quot;">​</a></h2><p>Thread-Per-Message模式的一个最经典的应用场景是 <strong>网络编程里服务端的实现</strong>，服务端为每个客户端请求创建一个独立的线程，当线程处理完请求后，自动销毁，这是一种最简单的并发处理网络请求的方法。</p><p>网络编程里最简单的程序当数echo程序了，echo程序的服务端会原封不动地将客户端的请求发送回客户端。例如，客户端发送TCP请求&quot;Hello World&quot;，那么服务端也会返回&quot;Hello World&quot;。</p><p>下面我们就以echo程序的服务端为例，介绍如何实现Thread-Per-Message模式。</p><p>在Java语言中，实现echo程序的服务端还是很简单的。只需要30行代码就能够实现，示例代码如下，我们为每个请求都创建了一个Java线程，核心代码是：new Thread(()-&gt;{...}).start()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final ServerSocketChannel  =</span></span>
<span class="line"><span>  ServerSocketChannel.open().bind(</span></span>
<span class="line"><span>    new InetSocketAddress(8080));</span></span>
<span class="line"><span>//处理请求</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    // 接收请求</span></span>
<span class="line"><span>    SocketChannel sc = ssc.accept();</span></span>
<span class="line"><span>    // 每个请求都创建一个线程</span></span>
<span class="line"><span>    new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        // 读Socket</span></span>
<span class="line"><span>        ByteBuffer rb = ByteBuffer</span></span>
<span class="line"><span>          .allocateDirect(1024);</span></span>
<span class="line"><span>        sc.read(rb);</span></span>
<span class="line"><span>        //模拟处理请求</span></span>
<span class="line"><span>        Thread.sleep(2000);</span></span>
<span class="line"><span>        // 写Socket</span></span>
<span class="line"><span>        ByteBuffer wb =</span></span>
<span class="line"><span>          (ByteBuffer)rb.flip();</span></span>
<span class="line"><span>        sc.write(wb);</span></span>
<span class="line"><span>        // 关闭Socket</span></span>
<span class="line"><span>        sc.close();</span></span>
<span class="line"><span>      }catch(Exception e){</span></span>
<span class="line"><span>        throw new UncheckedIOException(e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }).start();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  ssc.close();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果你熟悉网络编程，相信你一定会提出一个很尖锐的问题：上面这个echo服务的实现方案是不具备可行性的。原因在于Java中的线程是一个重量级的对象，创建成本很高，一方面创建线程比较耗时，另一方面线程占用的内存也比较大。所以，为每个请求创建一个新的线程并不适合高并发场景。</p><p>于是，你开始质疑Thread-Per-Message模式，而且开始重新思索解决方案，这时候很可能你会想到Java提供的线程池。你的这个思路没有问题，但是引入线程池难免会增加复杂度。其实你完全可以换一个角度来思考这个问题，语言、工具、框架本身应该是帮助我们更敏捷地实现方案的，而不是用来否定方案的，Thread-Per-Message模式作为一种最简单的分工方案，Java语言支持不了，显然是Java语言本身的问题。</p><p>Java语言里，Java线程是和操作系统线程一一对应的，这种做法本质上是将Java线程的调度权完全委托给操作系统，而操作系统在这方面非常成熟，所以这种做法的好处是稳定、可靠，但是也继承了操作系统线程的缺点：创建成本高。为了解决这个缺点，Java并发包里提供了线程池等工具类。这个思路在很长一段时间里都是很稳妥的方案，但是这个方案并不是唯一的方案。</p><p>业界还有另外一种方案，叫做 <strong>轻量级线程</strong>。这个方案在Java领域知名度并不高，但是在其他编程语言里却叫得很响，例如Go语言、Lua语言里的协程，本质上就是一种轻量级的线程。轻量级的线程，创建的成本很低，基本上和创建一个普通对象的成本相似；并且创建的速度和内存占用相比操作系统线程至少有一个数量级的提升，所以基于轻量级线程实现Thread-Per-Message模式就完全没有问题了。</p><p>Java语言目前也已经意识到轻量级线程的重要性了，OpenJDK有个Loom项目，就是要解决Java语言的轻量级线程问题，在这个项目中，轻量级线程被叫做 <strong>Fiber</strong>。下面我们就来看看基于Fiber如何实现Thread-Per-Message模式。</p><h2 id="用fiber实现thread-per-message模式" tabindex="-1">用Fiber实现Thread-Per-Message模式 <a class="header-anchor" href="#用fiber实现thread-per-message模式" aria-label="Permalink to &quot;用Fiber实现Thread-Per-Message模式&quot;">​</a></h2><p>Loom项目在设计轻量级线程时，充分考量了当前Java线程的使用方式，采取的是尽量兼容的态度，所以使用上还是挺简单的。用Fiber实现echo服务的示例代码如下所示，对比Thread的实现，你会发现改动量非常小，只需要把new Thread(()-&gt;{...}).start()换成 Fiber.schedule(()-&gt;{})就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final ServerSocketChannel ssc =</span></span>
<span class="line"><span>  ServerSocketChannel.open().bind(</span></span>
<span class="line"><span>    new InetSocketAddress(8080));</span></span>
<span class="line"><span>//处理请求</span></span>
<span class="line"><span>try{</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    // 接收请求</span></span>
<span class="line"><span>    final SocketChannel sc =</span></span>
<span class="line"><span>      ssc.accept();</span></span>
<span class="line"><span>    Fiber.schedule(()-&amp;gt;{</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        // 读Socket</span></span>
<span class="line"><span>        ByteBuffer rb = ByteBuffer</span></span>
<span class="line"><span>          .allocateDirect(1024);</span></span>
<span class="line"><span>        sc.read(rb);</span></span>
<span class="line"><span>        //模拟处理请求</span></span>
<span class="line"><span>        LockSupport.parkNanos(2000*1000000);</span></span>
<span class="line"><span>        // 写Socket</span></span>
<span class="line"><span>        ByteBuffer wb =</span></span>
<span class="line"><span>          (ByteBuffer)rb.flip()</span></span>
<span class="line"><span>        sc.write(wb);</span></span>
<span class="line"><span>        // 关闭Socket</span></span>
<span class="line"><span>        sc.close();</span></span>
<span class="line"><span>      } catch(Exception e){</span></span>
<span class="line"><span>        throw new UncheckedIOException(e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }//while</span></span>
<span class="line"><span>}finally{</span></span>
<span class="line"><span>  ssc.close();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那使用Fiber实现的echo服务是否能够达到预期的效果呢？我们可以在Linux环境下做一个简单的实验，步骤如下：</p><ol><li>首先通过 <code>ulimit -u 512</code> 将用户能创建的最大进程数（包括线程）设置为512；</li><li>启动Fiber实现的echo程序；</li><li>利用压测工具ab进行压测：ab -r -c 20000 -n 200000 <a href="http://xn--IP-im8ckc884ihkivx9c:8080/" target="_blank" rel="noreferrer">http://测试机IP地址:8080/</a></li></ol><p>压测执行结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Concurrency Level:      20000</span></span>
<span class="line"><span>Time taken for tests:   67.718 seconds</span></span>
<span class="line"><span>Complete requests:      200000</span></span>
<span class="line"><span>Failed requests:        0</span></span>
<span class="line"><span>Write errors:           0</span></span>
<span class="line"><span>Non-2xx responses:      200000</span></span>
<span class="line"><span>Total transferred:      16400000 bytes</span></span>
<span class="line"><span>HTML transferred:       0 bytes</span></span>
<span class="line"><span>Requests per second:    2953.41 [#/sec] (mean)</span></span>
<span class="line"><span>Time per request:       6771.844 [ms] (mean)</span></span>
<span class="line"><span>Time per request:       0.339 [ms] (mean, across all concurrent requests)</span></span>
<span class="line"><span>Transfer rate:          236.50 [Kbytes/sec] received</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Connection Times (ms)</span></span>
<span class="line"><span>              min  mean[+/-sd] median   max</span></span>
<span class="line"><span>Connect:        0  557 3541.6      1   63127</span></span>
<span class="line"><span>Processing:  2000 2010  31.8   2003    2615</span></span>
<span class="line"><span>Waiting:     1986 2008  30.9   2002    2615</span></span>
<span class="line"><span>Total:       2000 2567 3543.9   2004   65293</span></span></code></pre></div><p>你会发现即便在20000并发下，该程序依然能够良好运行。同等条件下，Thread实现的echo程序512并发都抗不过去，直接就OOM了。</p><p>如果你通过Linux命令 <code>top -Hp pid</code> 查看Fiber实现的echo程序的进程信息，你可以看到该进程仅仅创建了16（不同CPU核数结果会不同）个操作系统线程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95098/aebe9691be206fb88f45e4f763bcb7e9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95098/aebe9691be206fb88f45e4f763bcb7e9.png" alt=""></a></p><p>如果你对Loom项目感兴趣，也想上手试一把，可以下载源代码自己构建，构建方法可以参考 <a href="https://wiki.openjdk.java.net/display/loom/Main" target="_blank" rel="noreferrer">Project Loom的相关资料</a>，不过需要注意的是构建之前一定要把代码分支切换到Fibers。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>并发编程领域的分工问题，指的是如何高效地拆解任务并分配给线程。前面我们在并发工具类模块中已经介绍了不少解决分工问题的工具类，例如Future、CompletableFuture 、CompletionService、Fork/Join计算框架等，这些工具类都能很好地解决特定应用场景的问题，所以，这些工具类曾经是Java语言引以为傲的。不过这些工具类都继承了Java语言的老毛病：太复杂。</p><p>如果你一直从事Java开发，估计你已经习以为常了，习惯性地认为这个复杂度是正常的。不过这个世界时刻都在变化，曾经正常的复杂度，现在看来也许就已经没有必要了，例如Thread-Per-Message模式如果使用线程池方案就会增加复杂度。</p><p>Thread-Per-Message模式在Java领域并不是那么知名，根本原因在于Java语言里的线程是一个重量级的对象，为每一个任务创建一个线程成本太高，尤其是在高并发领域，基本就不具备可行性。不过这个背景条件目前正在发生巨变，Java语言未来一定会提供轻量级线程，这样基于轻量级线程实现Thread-Per-Message模式就是一个非常靠谱的选择。</p><p>当然，对于一些并发度没那么高的异步场景，例如定时任务，采用Thread-Per-Message模式是完全没有问题的。实际工作中，我就见过完全基于Thread-Per-Message模式实现的分布式调度框架，这个框架为每个定时任务都分配了一个独立的线程。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>使用Thread-Per-Message模式会为每一个任务都创建一个线程，在高并发场景中，很容易导致应用OOM，那有什么办法可以快速解决呢？</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,37)])])}const b=s(l,[["render",r]]);export{g as __pageData,b as default};
