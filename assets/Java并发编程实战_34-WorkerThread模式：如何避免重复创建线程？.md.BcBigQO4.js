import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"34 | Worker Thread模式：如何避免重复创建线程？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Worker Thread模式及其实现","slug":"worker-thread模式及其实现","link":"#worker-thread模式及其实现","children":[]},{"level":2,"title":"正确地创建线程池","slug":"正确地创建线程池","link":"#正确地创建线程池","children":[]},{"level":2,"title":"避免线程死锁","slug":"避免线程死锁","link":"#避免线程死锁","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/34-WorkerThread模式：如何避免重复创建线程？.md","filePath":"Java并发编程实战/34-WorkerThread模式：如何避免重复创建线程？.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/34-WorkerThread模式：如何避免重复创建线程？.md"};function t(i,a,r,c,o,h){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_34-worker-thread模式-如何避免重复创建线程" tabindex="-1">34 | Worker Thread模式：如何避免重复创建线程？ <a class="header-anchor" href="#_34-worker-thread模式-如何避免重复创建线程" aria-label="Permalink to &quot;34 | Worker Thread模式：如何避免重复创建线程？&quot;">​</a></h1><p>在 <a href="https://time.geekbang.org/column/article/95098" target="_blank" rel="noreferrer">上一篇文章</a> 中，我们介绍了一种最简单的分工模式——Thread-Per-Message模式，对应到现实世界，其实就是委托代办。这种分工模式如果用Java Thread实现，频繁地创建、销毁线程非常影响性能，同时无限制地创建线程还可能导致OOM，所以在Java领域使用场景就受限了。</p><p>要想有效避免线程的频繁创建、销毁以及OOM问题，就不得不提今天我们要细聊的，也是Java领域使用最多的Worker Thread模式。</p><h2 id="worker-thread模式及其实现" tabindex="-1">Worker Thread模式及其实现 <a class="header-anchor" href="#worker-thread模式及其实现" aria-label="Permalink to &quot;Worker Thread模式及其实现&quot;">​</a></h2><p>Worker Thread模式可以类比现实世界里车间的工作模式：车间里的工人，有活儿了，大家一起干，没活儿了就聊聊天等着。你可以参考下面的示意图来理解，Worker Thread模式中 <strong>Worker Thread对应到现实世界里，其实指的就是车间里的工人</strong>。不过这里需要注意的是，车间里的工人数量往往是确定的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95525/9d0082376427a97644ad7219af6922c3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95525/9d0082376427a97644ad7219af6922c3.png" alt=""></a></p><p>车间工作示意图</p><p>那在编程领域该如何模拟车间的这种工作模式呢？或者说如何去实现Worker Thread模式呢？通过上面的图，你很容易就能想到用阻塞队列做任务池，然后创建固定数量的线程消费阻塞队列中的任务。其实你仔细想会发现，这个方案就是Java语言提供的线程池。</p><p>线程池有很多优点，例如能够避免重复创建、销毁线程，同时能够限制创建线程的上限等等。学习完上一篇文章后你已经知道，用Java的Thread实现Thread-Per-Message模式难以应对高并发场景，原因就在于频繁创建、销毁Java线程的成本有点高，而且无限制地创建线程还可能导致应用OOM。线程池，则恰好能解决这些问题。</p><p>那我们还是以echo程序为例，看看如何用线程池来实现。</p><p>下面的示例代码是用线程池实现的echo服务端，相比于Thread-Per-Message模式的实现，改动非常少，仅仅是创建了一个最多线程数为500的线程池es，然后通过es.execute()方法将请求处理的任务提交给线程池处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExecutorService es = Executors</span></span>
<span class="line"><span>  .newFixedThreadPool(500);</span></span>
<span class="line"><span>final ServerSocketChannel ssc =</span></span>
<span class="line"><span>  ServerSocketChannel.open().bind(</span></span>
<span class="line"><span>    new InetSocketAddress(8080));</span></span>
<span class="line"><span>//处理请求</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    // 接收请求</span></span>
<span class="line"><span>    SocketChannel sc = ssc.accept();</span></span>
<span class="line"><span>    // 将请求处理任务提交给线程池</span></span>
<span class="line"><span>    es.execute(()-&amp;gt;{</span></span>
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
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  ssc.close();</span></span>
<span class="line"><span>  es.shutdown();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="正确地创建线程池" tabindex="-1">正确地创建线程池 <a class="header-anchor" href="#正确地创建线程池" aria-label="Permalink to &quot;正确地创建线程池&quot;">​</a></h2><p>Java的线程池既能够避免无限制地 <strong>创建线程</strong> 导致OOM，也能避免无限制地 <strong>接收任务</strong> 导致OOM。只不过后者经常容易被我们忽略，例如在上面的实现中，就被我们忽略了。所以强烈建议你 <strong>用创建有界的队列来接收任务</strong>。</p><p>当请求量大于有界队列的容量时，就需要合理地拒绝请求。如何合理地拒绝呢？这需要你结合具体的业务场景来制定，即便线程池默认的拒绝策略能够满足你的需求，也同样建议你 <strong>在创建线程池时，清晰地指明拒绝策略</strong>。</p><p>同时，为了便于调试和诊断问题，我也强烈建议你 <strong>在实际工作中给线程赋予一个业务相关的名字</strong>。</p><p>综合以上这三点建议，echo程序中创建线程可以使用下面的示例代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExecutorService es = new ThreadPoolExecutor(</span></span>
<span class="line"><span>  50, 500,</span></span>
<span class="line"><span>  60L, TimeUnit.SECONDS,</span></span>
<span class="line"><span>  //注意要创建有界队列</span></span>
<span class="line"><span>  new LinkedBlockingQueue&amp;lt;Runnable&amp;gt;(2000),</span></span>
<span class="line"><span>  //建议根据业务需求实现ThreadFactory</span></span>
<span class="line"><span>  r-&amp;gt;{</span></span>
<span class="line"><span>    return new Thread(r, &quot;echo-&quot;+ r.hashCode());</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  //建议根据业务需求实现RejectedExecutionHandler</span></span>
<span class="line"><span>  new ThreadPoolExecutor.CallerRunsPolicy());</span></span></code></pre></div><h2 id="避免线程死锁" tabindex="-1">避免线程死锁 <a class="header-anchor" href="#避免线程死锁" aria-label="Permalink to &quot;避免线程死锁&quot;">​</a></h2><p>使用线程池过程中，还要注意一种 <strong>线程死锁</strong> 的场景。如果提交到相同线程池的任务不是相互独立的，而是有依赖关系的，那么就有可能导致线程死锁。实际工作中，我就亲历过这种线程死锁的场景。具体现象是 <strong>应用每运行一段时间偶尔就会处于无响应的状态，监控数据看上去一切都正常，但是实际上已经不能正常工作了</strong>。</p><p>这个出问题的应用，相关的逻辑精简之后，如下图所示，该应用将一个大型的计算任务分成两个阶段，第一个阶段的任务会等待第二阶段的子任务完成。在这个应用里，每一个阶段都使用了线程池，而且两个阶段使用的还是同一个线程池。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95525/f807b0935133b315870d2d7db5477db8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95525/f807b0935133b315870d2d7db5477db8.png" alt=""></a></p><p>应用业务逻辑示意图</p><p>我们可以用下面的示例代码来模拟该应用，如果你执行下面的这段代码，会发现它永远执行不到最后一行。执行过程中没有任何异常，但是应用已经停止响应了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//L1、L2阶段共用的线程池</span></span>
<span class="line"><span>ExecutorService es = Executors.</span></span>
<span class="line"><span>  newFixedThreadPool(2);</span></span>
<span class="line"><span>//L1阶段的闭锁</span></span>
<span class="line"><span>CountDownLatch l1=new CountDownLatch(2);</span></span>
<span class="line"><span>for (int i=0; i&amp;lt;2; i++){</span></span>
<span class="line"><span>  System.out.println(&quot;L1&quot;);</span></span>
<span class="line"><span>  //执行L1阶段任务</span></span>
<span class="line"><span>  es.execute(()-&amp;gt;{</span></span>
<span class="line"><span>    //L2阶段的闭锁</span></span>
<span class="line"><span>    CountDownLatch l2=new CountDownLatch(2);</span></span>
<span class="line"><span>    //执行L2阶段子任务</span></span>
<span class="line"><span>    for (int j=0; j&amp;lt;2; j++){</span></span>
<span class="line"><span>      es.execute(()-&amp;gt;{</span></span>
<span class="line"><span>        System.out.println(&quot;L2&quot;);</span></span>
<span class="line"><span>        l2.countDown();</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //等待L2阶段任务执行完</span></span>
<span class="line"><span>    l2.await();</span></span>
<span class="line"><span>    l1.countDown();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//等着L1阶段任务执行完</span></span>
<span class="line"><span>l1.await();</span></span>
<span class="line"><span>System.out.println(&quot;end&quot;);</span></span></code></pre></div><p>当应用出现类似问题时，首选的诊断方法是查看线程栈。下图是上面示例代码停止响应后的线程栈，你会发现线程池中的两个线程全部都阻塞在 <code>l2.await();</code> 这行代码上了，也就是说，线程池里所有的线程都在等待L2阶段的任务执行完，那L2阶段的子任务什么时候能够执行完呢？永远都没那一天了，为什么呢？因为线程池里的线程都阻塞了，没有空闲的线程执行L2阶段的任务了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95525/43c663eedd5b0b75b6c3022e26eb1583.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/95525/43c663eedd5b0b75b6c3022e26eb1583.png" alt=""></a></p><p>原因找到了，那如何解决就简单了，最简单粗暴的办法就是将线程池的最大线程数调大，如果能够确定任务的数量不是非常多的话，这个办法也是可行的，否则这个办法就行不通了。其实 <strong>这种问题通用的解决方案是为不同的任务创建不同的线程池</strong>。对于上面的这个应用，L1阶段的任务和L2阶段的任务如果各自都有自己的线程池，就不会出现这种问题了。</p><p>最后再次强调一下： <strong>提交到相同线程池中的任务一定是相互独立的，否则就一定要慎重</strong>。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>我们曾经说过，解决并发编程里的分工问题，最好的办法是和现实世界做对比。对比现实世界构建编程领域的模型，能够让模型更容易理解。上一篇我们介绍的Thread-Per-Message模式，类似于现实世界里的委托他人办理，而今天介绍的Worker Thread模式则类似于车间里工人的工作模式。如果你在设计阶段，发现对业务模型建模之后，模型非常类似于车间的工作模式，那基本上就能确定可以在实现阶段采用Worker Thread模式来实现。</p><p>Worker Thread模式和Thread-Per-Message模式的区别有哪些呢？从现实世界的角度看，你委托代办人做事，往往是和代办人直接沟通的；对应到编程领域，其实现也是主线程直接创建了一个子线程，主子线程之间是可以直接通信的。而车间工人的工作方式则是完全围绕任务展开的，一个具体的任务被哪个工人执行，预先是无法知道的；对应到编程领域，则是主线程提交任务到线程池，但主线程并不关心任务被哪个线程执行。</p><p>Worker Thread模式能避免线程频繁创建、销毁的问题，而且能够限制线程的最大数量。Java语言里可以直接使用线程池来实现Worker Thread模式，线程池是一个非常基础和优秀的工具类，甚至有些大厂的编码规范都不允许用new Thread()来创建线程的，必须使用线程池。</p><p>不过使用线程池还是需要格外谨慎的，除了今天重点讲到的如何正确创建线程池、如何避免线程死锁问题，还需要注意前面我们曾经提到的ThreadLocal内存泄露问题。同时对于提交到线程池的任务，还要做好异常处理，避免异常的任务从眼前溜走，从业务的角度看，有时没有发现异常的任务后果往往都很严重。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>小灰同学写了如下的代码，本义是异步地打印字符串“QQ”，请问他的实现是否有问题呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ExecutorService pool = Executors</span></span>
<span class="line"><span>  .newSingleThreadExecutor();</span></span>
<span class="line"><span>pool.submit(() -&amp;gt; {</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    String qq=pool.submit(()-&amp;gt;&quot;QQ&quot;).get();</span></span>
<span class="line"><span>    System.out.println(qq);</span></span>
<span class="line"><span>  } catch (Exception e) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,38)])])}const g=s(l,[["render",t]]);export{u as __pageData,g as default};
