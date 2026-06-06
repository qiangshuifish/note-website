import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"25 | CompletionService：如何批量执行异步任务？","description":"","frontmatter":{},"headers":[{"level":2,"title":"利用CompletionService实现询价系统","slug":"利用completionservice实现询价系统","link":"#利用completionservice实现询价系统","children":[]},{"level":2,"title":"CompletionService接口说明","slug":"completionservice接口说明","link":"#completionservice接口说明","children":[]},{"level":2,"title":"利用CompletionService实现Dubbo中的Forking Cluster","slug":"利用completionservice实现dubbo中的forking-cluster","link":"#利用completionservice实现dubbo中的forking-cluster","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/25-CompletionService：如何批量执行异步任务？.md","filePath":"Java并发编程实战/25-CompletionService：如何批量执行异步任务？.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/25-CompletionService：如何批量执行异步任务？.md"};function t(i,n,c,o,r,u){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_25-completionservice-如何批量执行异步任务" tabindex="-1">25 | CompletionService：如何批量执行异步任务？ <a class="header-anchor" href="#_25-completionservice-如何批量执行异步任务" aria-label="Permalink to &quot;25 | CompletionService：如何批量执行异步任务？&quot;">​</a></h1><p>在 <a href="https://time.geekbang.org/column/article/91292" target="_blank" rel="noreferrer">《23 | Future：如何用多线程实现最优的“烧水泡茶”程序？》</a> 的最后，我给你留了道思考题，如何优化一个询价应用的核心代码？如果采用“ThreadPoolExecutor+Future”的方案，你的优化结果很可能是下面示例代码这样：用三个线程异步执行询价，通过三次调用Future的get()方法获取询价结果，之后将询价结果保存在数据库中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建线程池</span></span>
<span class="line"><span>ExecutorService executor =</span></span>
<span class="line"><span>  Executors.newFixedThreadPool(3);</span></span>
<span class="line"><span>// 异步向电商S1询价</span></span>
<span class="line"><span>Future&amp;lt;Integer&amp;gt; f1 =</span></span>
<span class="line"><span>  executor.submit(</span></span>
<span class="line"><span>    ()-&amp;gt;getPriceByS1());</span></span>
<span class="line"><span>// 异步向电商S2询价</span></span>
<span class="line"><span>Future&amp;lt;Integer&amp;gt; f2 =</span></span>
<span class="line"><span>  executor.submit(</span></span>
<span class="line"><span>    ()-&amp;gt;getPriceByS2());</span></span>
<span class="line"><span>// 异步向电商S3询价</span></span>
<span class="line"><span>Future&amp;lt;Integer&amp;gt; f3 =</span></span>
<span class="line"><span>  executor.submit(</span></span>
<span class="line"><span>    ()-&amp;gt;getPriceByS3());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 获取电商S1报价并保存</span></span>
<span class="line"><span>r=f1.get();</span></span>
<span class="line"><span>executor.execute(()-&amp;gt;save(r));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 获取电商S2报价并保存</span></span>
<span class="line"><span>r=f2.get();</span></span>
<span class="line"><span>executor.execute(()-&amp;gt;save(r));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 获取电商S3报价并保存</span></span>
<span class="line"><span>r=f3.get();</span></span>
<span class="line"><span>executor.execute(()-&amp;gt;save(r));</span></span></code></pre></div><p>上面的这个方案本身没有太大问题，但是有个地方的处理需要你注意，那就是如果获取电商S1报价的耗时很长，那么即便获取电商S2报价的耗时很短，也无法让保存S2报价的操作先执行，因为这个主线程都阻塞在了 <code>f1.get()</code> 操作上。这点小瑕疵你该如何解决呢？</p><p>估计你已经想到了，增加一个阻塞队列，获取到S1、S2、S3的报价都进入阻塞队列，然后在主线程中消费阻塞队列，这样就能保证先获取到的报价先保存到数据库了。下面的示例代码展示了如何利用阻塞队列实现先获取到的报价先保存到数据库。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建阻塞队列</span></span>
<span class="line"><span>BlockingQueue&amp;lt;Integer&amp;gt; bq =</span></span>
<span class="line"><span>  new LinkedBlockingQueue&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>//电商S1报价异步进入阻塞队列</span></span>
<span class="line"><span>executor.execute(()-&amp;gt;</span></span>
<span class="line"><span>  bq.put(f1.get()));</span></span>
<span class="line"><span>//电商S2报价异步进入阻塞队列</span></span>
<span class="line"><span>executor.execute(()-&amp;gt;</span></span>
<span class="line"><span>  bq.put(f2.get()));</span></span>
<span class="line"><span>//电商S3报价异步进入阻塞队列</span></span>
<span class="line"><span>executor.execute(()-&amp;gt;</span></span>
<span class="line"><span>  bq.put(f3.get()));</span></span>
<span class="line"><span>//异步保存所有报价</span></span>
<span class="line"><span>for (int i=0; i&amp;lt;3; i++) {</span></span>
<span class="line"><span>  Integer r = bq.take();</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt;save(r));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="利用completionservice实现询价系统" tabindex="-1">利用CompletionService实现询价系统 <a class="header-anchor" href="#利用completionservice实现询价系统" aria-label="Permalink to &quot;利用CompletionService实现询价系统&quot;">​</a></h2><p>不过在实际项目中，并不建议你这样做，因为Java SDK并发包里已经提供了设计精良的CompletionService。利用CompletionService不但能帮你解决先获取到的报价先保存到数据库的问题，而且还能让代码更简练。</p><p>CompletionService的实现原理也是内部维护了一个阻塞队列，当任务执行结束就把任务的执行结果加入到阻塞队列中，不同的是CompletionService是把任务执行结果的Future对象加入到阻塞队列中，而上面的示例代码是把任务最终的执行结果放入了阻塞队列中。</p><p><strong>那到底该如何创建CompletionService呢？</strong></p><p>CompletionService接口的实现类是ExecutorCompletionService，这个实现类的构造方法有两个，分别是：</p><ol><li><code>ExecutorCompletionService(Executor executor)</code>；</li><li><code>ExecutorCompletionService(Executor executor, BlockingQueue&amp;lt;Future&amp;lt;V&gt;&gt; completionQueue)</code>。</li></ol><p>这两个构造方法都需要传入一个线程池，如果不指定completionQueue，那么默认会使用无界的LinkedBlockingQueue。任务执行结果的Future对象就是加入到completionQueue中。</p><p>下面的示例代码完整地展示了如何利用CompletionService来实现高性能的询价系统。其中，我们没有指定completionQueue，因此默认使用无界的LinkedBlockingQueue。之后通过CompletionService接口提供的submit()方法提交了三个询价操作，这三个询价操作将会被CompletionService异步执行。最后，我们通过CompletionService接口提供的take()方法获取一个Future对象（前面我们提到过，加入到阻塞队列中的是任务执行结果的Future对象），调用Future对象的get()方法就能返回询价操作的执行结果了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建线程池</span></span>
<span class="line"><span>ExecutorService executor =</span></span>
<span class="line"><span>  Executors.newFixedThreadPool(3);</span></span>
<span class="line"><span>// 创建CompletionService</span></span>
<span class="line"><span>CompletionService&amp;lt;Integer&amp;gt; cs = new</span></span>
<span class="line"><span>  ExecutorCompletionService&amp;lt;&amp;gt;(executor);</span></span>
<span class="line"><span>// 异步向电商S1询价</span></span>
<span class="line"><span>cs.submit(()-&amp;gt;getPriceByS1());</span></span>
<span class="line"><span>// 异步向电商S2询价</span></span>
<span class="line"><span>cs.submit(()-&amp;gt;getPriceByS2());</span></span>
<span class="line"><span>// 异步向电商S3询价</span></span>
<span class="line"><span>cs.submit(()-&amp;gt;getPriceByS3());</span></span>
<span class="line"><span>// 将询价结果异步保存到数据库</span></span>
<span class="line"><span>for (int i=0; i&amp;lt;3; i++) {</span></span>
<span class="line"><span>  Integer r = cs.take().get();</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt;save(r));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="completionservice接口说明" tabindex="-1">CompletionService接口说明 <a class="header-anchor" href="#completionservice接口说明" aria-label="Permalink to &quot;CompletionService接口说明&quot;">​</a></h2><p>下面我们详细地介绍一下CompletionService接口提供的方法，CompletionService接口提供的方法有5个，这5个方法的方法签名如下所示。</p><p>其中，submit()相关的方法有两个。一个方法参数是 <code>Callable&amp;lt;V&gt; task</code>，前面利用CompletionService实现询价系统的示例代码中，我们提交任务就是用的它。另外一个方法有两个参数，分别是 <code>Runnable task</code> 和 <code>V result</code>，这个方法类似于ThreadPoolExecutor的 <code>&amp;lt;T&gt; Future&amp;lt;T&gt; submit(Runnable task, T result)</code> ，这个方法在 <a href="https://time.geekbang.org/column/article/91292" target="_blank" rel="noreferrer">《23 | Future：如何用多线程实现最优的“烧水泡茶”程序？》</a> 中我们已详细介绍过，这里不再赘述。</p><p>CompletionService接口其余的3个方法，都是和阻塞队列相关的，take()、poll()都是从阻塞队列中获取并移除一个元素；它们的区别在于如果阻塞队列是空的，那么调用 take() 方法的线程会被阻塞，而 poll() 方法会返回 null 值。 <code>poll(long timeout, TimeUnit unit)</code> 方法支持以超时的方式获取并移除阻塞队列头部的一个元素，如果等待了 timeout unit时间，阻塞队列还是空的，那么该方法会返回 null 值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Future&amp;lt;V&amp;gt; submit(Callable&amp;lt;V&amp;gt; task);</span></span>
<span class="line"><span>Future&amp;lt;V&amp;gt; submit(Runnable task, V result);</span></span>
<span class="line"><span>Future&amp;lt;V&amp;gt; take()</span></span>
<span class="line"><span>  throws InterruptedException;</span></span>
<span class="line"><span>Future&amp;lt;V&amp;gt; poll();</span></span>
<span class="line"><span>Future&amp;lt;V&amp;gt; poll(long timeout, TimeUnit unit)</span></span>
<span class="line"><span>  throws InterruptedException;</span></span></code></pre></div><h2 id="利用completionservice实现dubbo中的forking-cluster" tabindex="-1">利用CompletionService实现Dubbo中的Forking Cluster <a class="header-anchor" href="#利用completionservice实现dubbo中的forking-cluster" aria-label="Permalink to &quot;利用CompletionService实现Dubbo中的Forking Cluster&quot;">​</a></h2><p>Dubbo中有一种叫做 <strong>Forking的集群模式</strong>，这种集群模式下，支持 <strong>并行地调用多个查询服务，只要有一个成功返回结果，整个服务就可以返回了</strong>。例如你需要提供一个地址转坐标的服务，为了保证该服务的高可用和性能，你可以并行地调用3个地图服务商的API，然后只要有1个正确返回了结果r，那么地址转坐标这个服务就可以直接返回r了。这种集群模式可以容忍2个地图服务商服务异常，但缺点是消耗的资源偏多。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>geocoder(addr) {</span></span>
<span class="line"><span>  //并行执行以下3个查询服务，</span></span>
<span class="line"><span>  r1=geocoderByS1(addr);</span></span>
<span class="line"><span>  r2=geocoderByS2(addr);</span></span>
<span class="line"><span>  r3=geocoderByS3(addr);</span></span>
<span class="line"><span>  //只要r1,r2,r3有一个返回</span></span>
<span class="line"><span>  //则返回</span></span>
<span class="line"><span>  return r1|r2|r3;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>利用CompletionService可以快速实现 Forking 这种集群模式，比如下面的示例代码就展示了具体是如何实现的。首先我们创建了一个线程池executor 、一个CompletionService对象cs和一个 <code>Future&amp;lt;Integer&gt;</code> 类型的列表 futures，每次通过调用CompletionService的submit()方法提交一个异步任务，会返回一个Future对象，我们把这些Future对象保存在列表futures中。通过调用 <code>cs.take().get()</code>，我们能够拿到最快返回的任务执行结果，只要我们拿到一个正确返回的结果，就可以取消所有任务并且返回最终结果了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建线程池</span></span>
<span class="line"><span>ExecutorService executor =</span></span>
<span class="line"><span>  Executors.newFixedThreadPool(3);</span></span>
<span class="line"><span>// 创建CompletionService</span></span>
<span class="line"><span>CompletionService&amp;lt;Integer&amp;gt; cs =</span></span>
<span class="line"><span>  new ExecutorCompletionService&amp;lt;&amp;gt;(executor);</span></span>
<span class="line"><span>// 用于保存Future对象</span></span>
<span class="line"><span>List&amp;lt;Future&amp;lt;Integer&amp;gt;&amp;gt; futures =</span></span>
<span class="line"><span>  new ArrayList&amp;lt;&amp;gt;(3);</span></span>
<span class="line"><span>//提交异步任务，并保存future到futures</span></span>
<span class="line"><span>futures.add(</span></span>
<span class="line"><span>  cs.submit(()-&amp;gt;geocoderByS1()));</span></span>
<span class="line"><span>futures.add(</span></span>
<span class="line"><span>  cs.submit(()-&amp;gt;geocoderByS2()));</span></span>
<span class="line"><span>futures.add(</span></span>
<span class="line"><span>  cs.submit(()-&amp;gt;geocoderByS3()));</span></span>
<span class="line"><span>// 获取最快返回的任务执行结果</span></span>
<span class="line"><span>Integer r = 0;</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  // 只要有一个成功返回，则break</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; 3; ++i) {</span></span>
<span class="line"><span>    r = cs.take().get();</span></span>
<span class="line"><span>    //简单地通过判空来检查是否成功返回</span></span>
<span class="line"><span>    if (r != null) {</span></span>
<span class="line"><span>      break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  //取消所有任务</span></span>
<span class="line"><span>  for(Future&amp;lt;Integer&amp;gt; f : futures)</span></span>
<span class="line"><span>    f.cancel(true);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 返回结果</span></span>
<span class="line"><span>return r;</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>当需要批量提交异步任务的时候建议你使用CompletionService。CompletionService将线程池Executor和阻塞队列BlockingQueue的功能融合在了一起，能够让批量异步任务的管理更简单。除此之外，CompletionService能够让异步任务的执行结果有序化，先执行完的先进入阻塞队列，利用这个特性，你可以轻松实现后续处理的有序性，避免无谓的等待，同时还可以快速实现诸如Forking Cluster这样的需求。</p><p>CompletionService的实现类ExecutorCompletionService，需要你自己创建线程池，虽看上去有些啰嗦，但好处是你可以让多个ExecutorCompletionService的线程池隔离，这种隔离性能避免几个特别耗时的任务拖垮整个应用的风险。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>本章使用CompletionService实现了一个询价应用的核心功能，后来又有了新的需求，需要计算出最低报价并返回，下面的示例代码尝试实现这个需求，你看看是否存在问题呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建线程池</span></span>
<span class="line"><span>ExecutorService executor =</span></span>
<span class="line"><span>  Executors.newFixedThreadPool(3);</span></span>
<span class="line"><span>// 创建CompletionService</span></span>
<span class="line"><span>CompletionService&amp;lt;Integer&amp;gt; cs = new</span></span>
<span class="line"><span>  ExecutorCompletionService&amp;lt;&amp;gt;(executor);</span></span>
<span class="line"><span>// 异步向电商S1询价</span></span>
<span class="line"><span>cs.submit(()-&amp;gt;getPriceByS1());</span></span>
<span class="line"><span>// 异步向电商S2询价</span></span>
<span class="line"><span>cs.submit(()-&amp;gt;getPriceByS2());</span></span>
<span class="line"><span>// 异步向电商S3询价</span></span>
<span class="line"><span>cs.submit(()-&amp;gt;getPriceByS3());</span></span>
<span class="line"><span>// 将询价结果异步保存到数据库</span></span>
<span class="line"><span>// 并计算最低报价</span></span>
<span class="line"><span>AtomicReference&amp;lt;Integer&amp;gt; m =</span></span>
<span class="line"><span>  new AtomicReference&amp;lt;&amp;gt;(Integer.MAX_VALUE);</span></span>
<span class="line"><span>for (int i=0; i&amp;lt;3; i++) {</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt;{</span></span>
<span class="line"><span>    Integer r = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      r = cs.take().get();</span></span>
<span class="line"><span>    } catch (Exception e) {}</span></span>
<span class="line"><span>    save(r);</span></span>
<span class="line"><span>    m.set(Integer.min(m.get(), r));</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return m;</span></span></code></pre></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,32)])])}const d=s(l,[["render",t]]);export{g as __pageData,d as default};
