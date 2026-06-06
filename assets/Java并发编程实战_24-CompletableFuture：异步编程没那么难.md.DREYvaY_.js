import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"24 | CompletableFuture：异步编程没那么难","description":"","frontmatter":{},"headers":[{"level":2,"title":"CompletableFuture的核心优势","slug":"completablefuture的核心优势","link":"#completablefuture的核心优势","children":[]},{"level":2,"title":"创建CompletableFuture对象","slug":"创建completablefuture对象","link":"#创建completablefuture对象","children":[]},{"level":2,"title":"如何理解CompletionStage接口","slug":"如何理解completionstage接口","link":"#如何理解completionstage接口","children":[{"level":3,"title":"1. 描述串行关系","slug":"_1-描述串行关系","link":"#_1-描述串行关系","children":[]},{"level":3,"title":"2. 描述AND汇聚关系","slug":"_2-描述and汇聚关系","link":"#_2-描述and汇聚关系","children":[]},{"level":3,"title":"3. 描述OR汇聚关系","slug":"_3-描述or汇聚关系","link":"#_3-描述or汇聚关系","children":[]},{"level":3,"title":"4. 异常处理","slug":"_4-异常处理","link":"#_4-异常处理","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/24-CompletableFuture：异步编程没那么难.md","filePath":"Java并发编程实战/24-CompletableFuture：异步编程没那么难.md","lastUpdated":1779815850000}'),t={name:"Java并发编程实战/24-CompletableFuture：异步编程没那么难.md"};function l(i,a,o,c,r,u){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_24-completablefuture-异步编程没那么难" tabindex="-1">24 | CompletableFuture：异步编程没那么难 <a class="header-anchor" href="#_24-completablefuture-异步编程没那么难" aria-label="Permalink to &quot;24 | CompletableFuture：异步编程没那么难&quot;">​</a></h1><p>前面我们不止一次提到，用多线程优化性能，其实不过就是将串行操作变成并行操作。如果仔细观察，你还会发现在串行转换成并行的过程中，一定会涉及到异步化，例如下面的示例代码，现在是串行的，为了提升性能，我们得把它们并行化，那具体实施起来该怎么做呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//以下两个方法都是耗时操作</span></span>
<span class="line"><span>doBizA();</span></span>
<span class="line"><span>doBizB();</span></span></code></pre></div><p>还是挺简单的，就像下面代码中这样，创建两个子线程去执行就可以了。你会发现下面的并行方案，主线程无需等待doBizA()和doBizB()的执行结果，也就是说doBizA()和doBizB()两个操作已经被异步化了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>new Thread(()-&amp;gt;doBizA())</span></span>
<span class="line"><span>  .start();</span></span>
<span class="line"><span>new Thread(()-&amp;gt;doBizB())</span></span>
<span class="line"><span>  .start();</span></span></code></pre></div><p><strong>异步化</strong>，是并行方案得以实施的基础，更深入地讲其实就是： <strong>利用多线程优化性能这个核心方案得以实施的基础</strong>。看到这里，相信你应该就能理解异步编程最近几年为什么会大火了，因为优化性能是互联网大厂的一个核心需求啊。Java在1.8版本提供了CompletableFuture来支持异步编程，CompletableFuture有可能是你见过的最复杂的工具类了，不过功能也着实让人感到震撼。</p><h2 id="completablefuture的核心优势" tabindex="-1">CompletableFuture的核心优势 <a class="header-anchor" href="#completablefuture的核心优势" aria-label="Permalink to &quot;CompletableFuture的核心优势&quot;">​</a></h2><p>为了领略CompletableFuture异步编程的优势，这里我们用CompletableFuture重新实现前面曾提及的烧水泡茶程序。首先还是需要先完成分工方案，在下面的程序中，我们分了3个任务：任务1负责洗水壶、烧开水，任务2负责洗茶壶、洗茶杯和拿茶叶，任务3负责泡茶。其中任务3要等待任务1和任务2都完成后才能开始。这个分工如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/b33f823a4124c1220d8bd6d91b877e78.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/b33f823a4124c1220d8bd6d91b877e78.png" alt=""></a></p><p>烧水泡茶分工方案</p><p>下面是代码实现，你先略过runAsync()、supplyAsync()、thenCombine()这些不太熟悉的方法，从大局上看，你会发现：</p><ol><li>无需手工维护线程，没有繁琐的手工维护线程的工作，给任务分配线程的工作也不需要我们关注；</li><li>语义更清晰，例如 <code>f3 = f1.thenCombine(f2, ()-&gt;{})</code> 能够清晰地表述“任务3要等待任务1和任务2都完成后才能开始”；</li><li>代码更简练并且专注于业务逻辑，几乎所有代码都是业务逻辑相关的。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//任务1：洗水壶-&amp;gt;烧开水</span></span>
<span class="line"><span>CompletableFuture&amp;lt;Void&amp;gt; f1 =</span></span>
<span class="line"><span>  CompletableFuture.runAsync(()-&amp;gt;{</span></span>
<span class="line"><span>  System.out.println(&quot;T1:洗水壶...&quot;);</span></span>
<span class="line"><span>  sleep(1, TimeUnit.SECONDS);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  System.out.println(&quot;T1:烧开水...&quot;);</span></span>
<span class="line"><span>  sleep(15, TimeUnit.SECONDS);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>//任务2：洗茶壶-&amp;gt;洗茶杯-&amp;gt;拿茶叶</span></span>
<span class="line"><span>CompletableFuture&amp;lt;String&amp;gt; f2 =</span></span>
<span class="line"><span>  CompletableFuture.supplyAsync(()-&amp;gt;{</span></span>
<span class="line"><span>  System.out.println(&quot;T2:洗茶壶...&quot;);</span></span>
<span class="line"><span>  sleep(1, TimeUnit.SECONDS);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  System.out.println(&quot;T2:洗茶杯...&quot;);</span></span>
<span class="line"><span>  sleep(2, TimeUnit.SECONDS);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  System.out.println(&quot;T2:拿茶叶...&quot;);</span></span>
<span class="line"><span>  sleep(1, TimeUnit.SECONDS);</span></span>
<span class="line"><span>  return &quot;龙井&quot;;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>//任务3：任务1和任务2完成后执行：泡茶</span></span>
<span class="line"><span>CompletableFuture&amp;lt;String&amp;gt; f3 =</span></span>
<span class="line"><span>  f1.thenCombine(f2, (__, tf)-&amp;gt;{</span></span>
<span class="line"><span>    System.out.println(&quot;T1:拿到茶叶:&quot; + tf);</span></span>
<span class="line"><span>    System.out.println(&quot;T1:泡茶...&quot;);</span></span>
<span class="line"><span>    return &quot;上茶:&quot; + tf;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>//等待任务3执行结果</span></span>
<span class="line"><span>System.out.println(f3.join());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void sleep(int t, TimeUnit u) {</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    u.sleep(t);</span></span>
<span class="line"><span>  }catch(InterruptedException e){}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 一次执行结果：</span></span>
<span class="line"><span>T1:洗水壶...</span></span>
<span class="line"><span>T2:洗茶壶...</span></span>
<span class="line"><span>T1:烧开水...</span></span>
<span class="line"><span>T2:洗茶杯...</span></span>
<span class="line"><span>T2:拿茶叶...</span></span>
<span class="line"><span>T1:拿到茶叶:龙井</span></span>
<span class="line"><span>T1:泡茶...</span></span>
<span class="line"><span>上茶:龙井</span></span></code></pre></div><p>领略CompletableFuture异步编程的优势之后，下面我们详细介绍CompletableFuture的使用，首先是如何创建CompletableFuture对象。</p><h2 id="创建completablefuture对象" tabindex="-1">创建CompletableFuture对象 <a class="header-anchor" href="#创建completablefuture对象" aria-label="Permalink to &quot;创建CompletableFuture对象&quot;">​</a></h2><p>创建CompletableFuture对象主要靠下面代码中展示的这4个静态方法，我们先看前两个。在烧水泡茶的例子中，我们已经使用了 <code>runAsync(Runnable runnable)</code> 和 <code>supplyAsync(Supplier&amp;lt;U&gt; supplier)</code>，它们之间的区别是：Runnable 接口的run()方法没有返回值，而Supplier接口的get()方法是有返回值的。</p><p>前两个方法和后两个方法的区别在于：后两个方法可以指定线程池参数。</p><p>默认情况下CompletableFuture会使用公共的ForkJoinPool线程池，这个线程池默认创建的线程数是CPU的核数（也可以通过JVM option:-Djava.util.concurrent.ForkJoinPool.common.parallelism来设置ForkJoinPool线程池的线程数）。如果所有CompletableFuture共享一个线程池，那么一旦有任务执行一些很慢的I/O操作，就会导致线程池中所有线程都阻塞在I/O操作上，从而造成线程饥饿，进而影响整个系统的性能。所以，强烈建议你要 <strong>根据不同的业务类型创建不同的线程池，以避免互相干扰</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//使用默认线程池</span></span>
<span class="line"><span>static CompletableFuture&amp;lt;Void&amp;gt;</span></span>
<span class="line"><span>  runAsync(Runnable runnable)</span></span>
<span class="line"><span>static &amp;lt;U&amp;gt; CompletableFuture&amp;lt;U&amp;gt;</span></span>
<span class="line"><span>  supplyAsync(Supplier&amp;lt;U&amp;gt; supplier)</span></span>
<span class="line"><span>//可以指定线程池</span></span>
<span class="line"><span>static CompletableFuture&amp;lt;Void&amp;gt;</span></span>
<span class="line"><span>  runAsync(Runnable runnable, Executor executor)</span></span>
<span class="line"><span>static &amp;lt;U&amp;gt; CompletableFuture&amp;lt;U&amp;gt;</span></span>
<span class="line"><span>  supplyAsync(Supplier&amp;lt;U&amp;gt; supplier, Executor executor)</span></span></code></pre></div><p>创建完CompletableFuture对象之后，会自动地异步执行runnable.run()方法或者supplier.get()方法，对于一个异步操作，你需要关注两个问题：一个是异步操作什么时候结束，另一个是如何获取异步操作的执行结果。因为CompletableFuture类实现了Future接口，所以这两个问题你都可以通过Future接口来解决。另外，CompletableFuture类还实现了CompletionStage接口，这个接口内容实在是太丰富了，在1.8版本里有40个方法，这些方法我们该如何理解呢？</p><h2 id="如何理解completionstage接口" tabindex="-1">如何理解CompletionStage接口 <a class="header-anchor" href="#如何理解completionstage接口" aria-label="Permalink to &quot;如何理解CompletionStage接口&quot;">​</a></h2><p>我觉得，你可以站在分工的角度类比一下工作流。任务是有时序关系的，比如有 <strong>串行关系、并行关系、汇聚关系</strong> 等。这样说可能有点抽象，这里还举前面烧水泡茶的例子，其中洗水壶和烧开水就是串行关系，洗水壶、烧开水和洗茶壶、洗茶杯这两组任务之间就是并行关系，而烧开水、拿茶叶和泡茶就是汇聚关系。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/e18181998b82718da811ce5807f0ad9f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/e18181998b82718da811ce5807f0ad9f.png" alt=""></a></p><p>串行关系</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/ea8e1a41a02b0104b421c58b25343bd2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/ea8e1a41a02b0104b421c58b25343bd2.png" alt=""></a></p><p>并行关系</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/3f1a5421333dd6d5c278ffd5299dc33b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/91569/3f1a5421333dd6d5c278ffd5299dc33b.png" alt=""></a></p><p>汇聚关系</p><p>CompletionStage接口可以清晰地描述任务之间的这种时序关系，例如前面提到的 <code>f3 = f1.thenCombine(f2, ()-&gt;{})</code> 描述的就是一种汇聚关系。烧水泡茶程序中的汇聚关系是一种 AND 聚合关系，这里的AND指的是所有依赖的任务（烧开水和拿茶叶）都完成后才开始执行当前任务（泡茶）。既然有AND聚合关系，那就一定还有OR聚合关系，所谓OR指的是依赖的任务只要有一个完成就可以执行当前任务。</p><p>在编程领域，还有一个绕不过去的山头，那就是异常处理，CompletionStage接口也可以方便地描述异常处理。</p><p>下面我们就来一一介绍，CompletionStage接口如何描述串行关系、AND聚合关系、OR聚合关系以及异常处理。</p><h3 id="_1-描述串行关系" tabindex="-1">1. 描述串行关系 <a class="header-anchor" href="#_1-描述串行关系" aria-label="Permalink to &quot;1\\. 描述串行关系&quot;">​</a></h3><p>CompletionStage接口里面描述串行关系，主要是thenApply、thenAccept、thenRun和thenCompose这四个系列的接口。</p><p>thenApply系列函数里参数fn的类型是接口Function&lt;T, R&gt;，这个接口里与CompletionStage相关的方法是 <code>R apply(T t)</code>，这个方法既能接收参数也支持返回值，所以thenApply系列方法返回的是 <code>CompletionStage&amp;lt;R&gt;</code>。</p><p>而thenAccept系列方法里参数consumer的类型是接口 <code>Consumer&amp;lt;T&gt;</code>，这个接口里与CompletionStage相关的方法是 <code>void accept(T t)</code>，这个方法虽然支持参数，但却不支持回值，所以thenAccept系列方法返回的是 <code>CompletionStage&amp;lt;Void&gt;</code>。</p><p>thenRun系列方法里action的参数是Runnable，所以action既不能接收参数也不支持返回值，所以thenRun系列方法返回的也是 <code>CompletionStage&amp;lt;Void&gt;</code>。</p><p>这些方法里面Async代表的是异步执行fn、consumer或者action。其中，需要你注意的是thenCompose系列方法，这个系列的方法会新创建出一个子流程，最终结果和thenApply系列是相同的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletionStage&amp;lt;R&amp;gt; thenApply(fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; thenApplyAsync(fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; thenAccept(consumer);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; thenAcceptAsync(consumer);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; thenRun(action);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; thenRunAsync(action);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; thenCompose(fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; thenComposeAsync(fn);</span></span></code></pre></div><p>通过下面的示例代码，你可以看一下thenApply()方法是如何使用的。首先通过supplyAsync()启动一个异步流程，之后是两个串行操作，整体看起来还是挺简单的。不过，虽然这是一个异步流程，但任务①②③却是串行执行的，②依赖①的执行结果，③依赖②的执行结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletableFuture&amp;lt;String&amp;gt; f0 =</span></span>
<span class="line"><span>  CompletableFuture.supplyAsync(</span></span>
<span class="line"><span>    () -&amp;gt; &quot;Hello World&quot;)      //①</span></span>
<span class="line"><span>  .thenApply(s -&amp;gt; s + &quot; QQ&quot;)  //②</span></span>
<span class="line"><span>  .thenApply(String::toUpperCase);//③</span></span>
<span class="line"><span></span></span>
<span class="line"><span>System.out.println(f0.join());</span></span>
<span class="line"><span>//输出结果</span></span>
<span class="line"><span>HELLO WORLD QQ</span></span></code></pre></div><h3 id="_2-描述and汇聚关系" tabindex="-1">2. 描述AND汇聚关系 <a class="header-anchor" href="#_2-描述and汇聚关系" aria-label="Permalink to &quot;2\\. 描述AND汇聚关系&quot;">​</a></h3><p>CompletionStage接口里面描述AND汇聚关系，主要是thenCombine、thenAcceptBoth和runAfterBoth系列的接口，这些接口的区别也是源自fn、consumer、action这三个核心参数不同。它们的使用你可以参考上面烧水泡茶的实现程序，这里就不赘述了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletionStage&amp;lt;R&amp;gt; thenCombine(other, fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; thenCombineAsync(other, fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; thenAcceptBoth(other, consumer);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; thenAcceptBothAsync(other, consumer);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; runAfterBoth(other, action);</span></span>
<span class="line"><span>CompletionStage&amp;lt;Void&amp;gt; runAfterBothAsync(other, action);</span></span></code></pre></div><h3 id="_3-描述or汇聚关系" tabindex="-1">3. 描述OR汇聚关系 <a class="header-anchor" href="#_3-描述or汇聚关系" aria-label="Permalink to &quot;3\\. 描述OR汇聚关系&quot;">​</a></h3><p>CompletionStage接口里面描述OR汇聚关系，主要是applyToEither、acceptEither和runAfterEither系列的接口，这些接口的区别也是源自fn、consumer、action这三个核心参数不同。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletionStage applyToEither(other, fn);</span></span>
<span class="line"><span>CompletionStage applyToEitherAsync(other, fn);</span></span>
<span class="line"><span>CompletionStage acceptEither(other, consumer);</span></span>
<span class="line"><span>CompletionStage acceptEitherAsync(other, consumer);</span></span>
<span class="line"><span>CompletionStage runAfterEither(other, action);</span></span>
<span class="line"><span>CompletionStage runAfterEitherAsync(other, action);</span></span></code></pre></div><p>下面的示例代码展示了如何使用applyToEither()方法来描述一个OR汇聚关系。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletableFuture&amp;lt;String&amp;gt; f1 =</span></span>
<span class="line"><span>  CompletableFuture.supplyAsync(()-&amp;gt;{</span></span>
<span class="line"><span>    int t = getRandom(5, 10);</span></span>
<span class="line"><span>    sleep(t, TimeUnit.SECONDS);</span></span>
<span class="line"><span>    return String.valueOf(t);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CompletableFuture&amp;lt;String&amp;gt; f2 =</span></span>
<span class="line"><span>  CompletableFuture.supplyAsync(()-&amp;gt;{</span></span>
<span class="line"><span>    int t = getRandom(5, 10);</span></span>
<span class="line"><span>    sleep(t, TimeUnit.SECONDS);</span></span>
<span class="line"><span>    return String.valueOf(t);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CompletableFuture&amp;lt;String&amp;gt; f3 =</span></span>
<span class="line"><span>  f1.applyToEither(f2,s -&amp;gt; s);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>System.out.println(f3.join());</span></span></code></pre></div><h3 id="_4-异常处理" tabindex="-1">4. 异常处理 <a class="header-anchor" href="#_4-异常处理" aria-label="Permalink to &quot;4\\. 异常处理&quot;">​</a></h3><p>虽然上面我们提到的fn、consumer、action它们的核心方法都 <strong>不允许抛出可检查异常，但是却无法限制它们抛出运行时异常</strong>，例如下面的代码，执行 <code>7/0</code> 就会出现除零错误这个运行时异常。非异步编程里面，我们可以使用try{}catch{}来捕获并处理异常，那在异步编程里面，异常该如何处理呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletableFuture&amp;lt;Integer&amp;gt;</span></span>
<span class="line"><span>  f0 = CompletableFuture.</span></span>
<span class="line"><span>    .supplyAsync(()-&amp;gt;(7/0))</span></span>
<span class="line"><span>    .thenApply(r-&amp;gt;r*10);</span></span>
<span class="line"><span>System.out.println(f0.join());</span></span></code></pre></div><p>CompletionStage接口给我们提供的方案非常简单，比try{}catch{}还要简单，下面是相关的方法，使用这些方法进行异常处理和串行操作是一样的，都支持链式编程方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletionStage exceptionally(fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; whenComplete(consumer);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; whenCompleteAsync(consumer);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; handle(fn);</span></span>
<span class="line"><span>CompletionStage&amp;lt;R&amp;gt; handleAsync(fn);</span></span></code></pre></div><p>下面的示例代码展示了如何使用exceptionally()方法来处理异常，exceptionally()的使用非常类似于try{}catch{}中的catch{}，但是由于支持链式编程方式，所以相对更简单。既然有try{}catch{}，那就一定还有try{}finally{}，whenComplete()和handle()系列方法就类似于try{}finally{}中的finally{}，无论是否发生异常都会执行whenComplete()中的回调函数consumer和handle()中的回调函数fn。whenComplete()和handle()的区别在于whenComplete()不支持返回结果，而handle()是支持返回结果的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CompletableFuture&amp;lt;Integer&amp;gt;</span></span>
<span class="line"><span>  f0 = CompletableFuture</span></span>
<span class="line"><span>    .supplyAsync(()-&amp;gt;(7/0))</span></span>
<span class="line"><span>    .thenApply(r-&amp;gt;r*10)</span></span>
<span class="line"><span>    .exceptionally(e-&amp;gt;0);</span></span>
<span class="line"><span>System.out.println(f0.join());</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>曾经一提到异步编程，大家脑海里都会随之浮现回调函数，例如在JavaScript里面异步问题基本上都是靠回调函数来解决的，回调函数在处理异常以及复杂的异步任务关系时往往力不从心，对此业界还发明了个名词： <strong>回调地狱</strong>（Callback Hell）。应该说在前些年，异步编程还是声名狼藉的。</p><p>不过最近几年，伴随着 <a href="http://reactivex.io/intro.html" target="_blank" rel="noreferrer">ReactiveX</a> 的发展（Java语言的实现版本是RxJava），回调地狱已经被完美解决了，异步编程已经慢慢开始成熟，Java语言也开始官方支持异步编程：在1.8版本提供了CompletableFuture，在Java 9版本则提供了更加完备的Flow API，异步编程目前已经完全工业化。因此，学好异步编程还是很有必要的。</p><p>CompletableFuture已经能够满足简单的异步编程需求，如果你对异步编程感兴趣，可以重点关注RxJava这个项目，利用RxJava，即便在Java 1.6版本也能享受异步编程的乐趣。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>创建采购订单的时候，需要校验一些规则，例如最大金额是和采购员级别相关的。有同学利用CompletableFuture实现了这个校验的功能，逻辑很简单，首先是从数据库中把相关规则查出来，然后执行规则校验。你觉得他的实现是否有问题呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//采购订单</span></span>
<span class="line"><span>PurchersOrder po;</span></span>
<span class="line"><span>CompletableFuture&amp;lt;Boolean&amp;gt; cf =</span></span>
<span class="line"><span>  CompletableFuture.supplyAsync(()-&amp;gt;{</span></span>
<span class="line"><span>    //在数据库中查询规则</span></span>
<span class="line"><span>    return findRuleByJdbc();</span></span>
<span class="line"><span>  }).thenApply(r -&amp;gt; {</span></span>
<span class="line"><span>    //规则校验</span></span>
<span class="line"><span>    return check(po, r);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>Boolean isOk = cf.join();</span></span></code></pre></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,63)])])}const g=n(t,[["render",l]]);export{h as __pageData,g as default};
