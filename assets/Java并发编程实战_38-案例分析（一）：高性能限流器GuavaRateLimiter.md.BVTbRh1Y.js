import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"38 | 案例分析（一）：高性能限流器Guava RateLimiter","description":"","frontmatter":{},"headers":[{"level":2,"title":"经典限流算法：令牌桶算法","slug":"经典限流算法-令牌桶算法","link":"#经典限流算法-令牌桶算法","children":[]},{"level":2,"title":"Guava如何实现令牌桶算法","slug":"guava如何实现令牌桶算法","link":"#guava如何实现令牌桶算法","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"Java并发编程实战/38-案例分析（一）：高性能限流器GuavaRateLimiter.md","filePath":"Java并发编程实战/38-案例分析（一）：高性能限流器GuavaRateLimiter.md","lastUpdated":1779815850000}'),i={name:"Java并发编程实战/38-案例分析（一）：高性能限流器GuavaRateLimiter.md"};function l(t,n,c,r,o,g){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_38-案例分析-一-高性能限流器guava-ratelimiter" tabindex="-1">38 | 案例分析（一）：高性能限流器Guava RateLimiter <a class="header-anchor" href="#_38-案例分析-一-高性能限流器guava-ratelimiter" aria-label="Permalink to &quot;38 | 案例分析（一）：高性能限流器Guava RateLimiter&quot;">​</a></h1><p>从今天开始，我们就进入案例分析模块了。 这个模块我们将分析四个经典的开源框架，看看它们是如何处理并发问题的，通过这四个案例的学习，相信你会对如何解决并发问题有个更深入的认识。</p><p>首先我们来看看 <strong>Guava RateLimiter是如何解决高并发场景下的限流问题的</strong>。Guava是Google开源的Java类库，提供了一个工具类RateLimiter。我们先来看看RateLimiter的使用，让你对限流有个感官的印象。假设我们有一个线程池，它每秒只能处理两个任务，如果提交的任务过快，可能导致系统不稳定，这个时候就需要用到限流。</p><p>在下面的示例代码中，我们创建了一个流速为2个请求/秒的限流器，这里的流速该怎么理解呢？直观地看，2个请求/秒指的是每秒最多允许2个请求通过限流器，其实在Guava中，流速还有更深一层的意思：是一种匀速的概念，2个请求/秒等价于1个请求/500毫秒。</p><p>在向线程池提交任务之前，调用 <code>acquire()</code> 方法就能起到限流的作用。通过示例代码的执行结果，任务提交到线程池的时间间隔基本上稳定在500毫秒。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//限流器流速：2个请求/秒</span></span>
<span class="line"><span>RateLimiter limiter =</span></span>
<span class="line"><span>  RateLimiter.create(2.0);</span></span>
<span class="line"><span>//执行任务的线程池</span></span>
<span class="line"><span>ExecutorService es = Executors</span></span>
<span class="line"><span>  .newFixedThreadPool(1);</span></span>
<span class="line"><span>//记录上一次执行时间</span></span>
<span class="line"><span>prev = System.nanoTime();</span></span>
<span class="line"><span>//测试执行20次</span></span>
<span class="line"><span>for (int i=0; i&amp;lt;20; i++){</span></span>
<span class="line"><span>  //限流器限流</span></span>
<span class="line"><span>  limiter.acquire();</span></span>
<span class="line"><span>  //提交任务异步执行</span></span>
<span class="line"><span>  es.execute(()-&amp;gt;{</span></span>
<span class="line"><span>    long cur=System.nanoTime();</span></span>
<span class="line"><span>    //打印时间间隔：毫秒</span></span>
<span class="line"><span>    System.out.println(</span></span>
<span class="line"><span>      (cur-prev)/1000_000);</span></span>
<span class="line"><span>    prev = cur;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输出结果：</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>500</span></span>
<span class="line"><span>499</span></span>
<span class="line"><span>499</span></span>
<span class="line"><span>500</span></span>
<span class="line"><span>499</span></span></code></pre></div><h2 id="经典限流算法-令牌桶算法" tabindex="-1">经典限流算法：令牌桶算法 <a class="header-anchor" href="#经典限流算法-令牌桶算法" aria-label="Permalink to &quot;经典限流算法：令牌桶算法&quot;">​</a></h2><p>Guava的限流器使用上还是很简单的，那它是如何实现的呢？Guava采用的是 <strong>令牌桶算法</strong>，其 <strong>核心是要想通过限流器，必须拿到令牌</strong>。也就是说，只要我们能够限制发放令牌的速率，那么就能控制流速了。令牌桶算法的详细描述如下：</p><ol><li>令牌以固定的速率添加到令牌桶中，假设限流的速率是 r/秒，则令牌每 1/r 秒会添加一个；</li><li>假设令牌桶的容量是 b ，如果令牌桶已满，则新的令牌会被丢弃；</li><li>请求能够通过限流器的前提是令牌桶中有令牌。</li></ol><p>这个算法中，限流的速率 r 还是比较容易理解的，但令牌桶的容量 b 该怎么理解呢？b 其实是burst的简写，意义是 <strong>限流器允许的最大突发流量</strong>。比如b=10，而且令牌桶中的令牌已满，此时限流器允许10个请求同时通过限流器，当然只是突发流量而已，这10个请求会带走10个令牌，所以后续的流量只能按照速率 r 通过限流器。</p><p>令牌桶这个算法，如何用Java实现呢？很可能你的直觉会告诉你生产者-消费者模式：一个生产者线程定时向阻塞队列中添加令牌，而试图通过限流器的线程则作为消费者线程，只有从阻塞队列中获取到令牌，才允许通过限流器。</p><p>这个算法看上去非常完美，而且实现起来非常简单，如果并发量不大，这个实现并没有什么问题。可实际情况却是使用限流的场景大部分都是高并发场景，而且系统压力已经临近极限了，此时这个实现就有问题了。问题就出在定时器上，在高并发场景下，当系统压力已经临近极限的时候，定时器的精度误差会非常大，同时定时器本身会创建调度线程，也会对系统的性能产生影响。</p><p>那还有什么好的实现方式呢？当然有，Guava的实现就没有使用定时器，下面我们就来看看它是如何实现的。</p><h2 id="guava如何实现令牌桶算法" tabindex="-1">Guava如何实现令牌桶算法 <a class="header-anchor" href="#guava如何实现令牌桶算法" aria-label="Permalink to &quot;Guava如何实现令牌桶算法&quot;">​</a></h2><p>Guava实现令牌桶算法，用了一个很简单的办法，其关键是 <strong>记录并动态计算下一令牌发放的时间</strong>。下面我们以一个最简单的场景来介绍该算法的执行过程。假设令牌桶的容量为 b=1，限流速率 r = 1个请求/秒，如下图所示，如果当前令牌桶中没有令牌，下一个令牌的发放时间是在第3秒，而在第2秒的时候有一个线程T1请求令牌，此时该如何处理呢？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/391179821a55fc798c9c17a6991c1dce.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/391179821a55fc798c9c17a6991c1dce.png" alt=""></a></p><p>线程T1请求令牌示意图</p><p>对于这个请求令牌的线程而言，很显然需要等待1秒，因为1秒以后（第3秒）它就能拿到令牌了。此时需要注意的是，下一个令牌发放的时间也要增加1秒，为什么呢？因为第3秒发放的令牌已经被线程T1预占了。处理之后如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/1a4069c830e18de087ba7f490aa78087.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/1a4069c830e18de087ba7f490aa78087.png" alt=""></a></p><p>线程T1请求结束示意图</p><p>假设T1在预占了第3秒的令牌之后，马上又有一个线程T2请求令牌，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/2cf695d0888a93e1e2d020d9514f5a2e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/2cf695d0888a93e1e2d020d9514f5a2e.png" alt=""></a></p><p>线程T2请求令牌示意图</p><p>很显然，由于下一个令牌产生的时间是第4秒，所以线程T2要等待两秒的时间，才能获取到令牌，同时由于T2预占了第4秒的令牌，所以下一令牌产生时间还要增加1秒，完全处理之后，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/68c09a96049aacda7936c52b801c22f7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/68c09a96049aacda7936c52b801c22f7.png" alt=""></a></p><p>线程T2请求结束示意图</p><p>上面线程T1、T2都是在 <strong>下一令牌产生时间之前</strong> 请求令牌，如果线程在 <strong>下一令牌产生时间之后</strong> 请求令牌会如何呢？假设在线程T1请求令牌之后的5秒，也就是第7秒，线程T3请求令牌，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/e3125d72eb3d84eabf6de6ab987e695c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/e3125d72eb3d84eabf6de6ab987e695c.png" alt=""></a></p><p>线程T3请求令牌示意图</p><p>由于在第5秒已经产生了一个令牌，所以此时线程T3可以直接拿到令牌，而无需等待。在第7秒，实际上限流器能够产生3个令牌，第5、6、7秒各产生一个令牌。由于我们假设令牌桶的容量是1，所以第6、7秒产生的令牌就丢弃了，其实等价地你也可以认为是保留的第7秒的令牌，丢弃的第5、6秒的令牌，也就是说第7秒的令牌被线程T3占有了，于是下一令牌的的产生时间应该是第8秒，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/baf159d05b2abf650839e29a2399a4fc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/97231/baf159d05b2abf650839e29a2399a4fc.png" alt=""></a></p><p>线程T3请求结束示意图</p><p>通过上面简要地分析，你会发现，我们 <strong>只需要记录一个下一令牌产生的时间，并动态更新它，就能够轻松完成限流功能</strong>。我们可以将上面的这个算法代码化，示例代码如下所示，依然假设令牌桶的容量是1。关键是 <strong>reserve()方法</strong>，这个方法会为请求令牌的线程预分配令牌，同时返回该线程能够获取令牌的时间。其实现逻辑就是上面提到的：如果线程请求令牌的时间在下一令牌产生时间之后，那么该线程立刻就能够获取令牌；反之，如果请求时间在下一令牌产生时间之前，那么该线程是在下一令牌产生的时间获取令牌。由于此时下一令牌已经被该线程预占，所以下一令牌产生的时间需要加上1秒。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SimpleLimiter {</span></span>
<span class="line"><span>  //下一令牌产生时间</span></span>
<span class="line"><span>  long next = System.nanoTime();</span></span>
<span class="line"><span>  //发放令牌间隔：纳秒</span></span>
<span class="line"><span>  long interval = 1000_000_000;</span></span>
<span class="line"><span>  //预占令牌，返回能够获取令牌的时间</span></span>
<span class="line"><span>  synchronized long reserve(long now){</span></span>
<span class="line"><span>    //请求时间在下一令牌产生时间之后</span></span>
<span class="line"><span>    //重新计算下一令牌产生时间</span></span>
<span class="line"><span>    if (now &amp;gt; next){</span></span>
<span class="line"><span>      //将下一令牌产生时间重置为当前时间</span></span>
<span class="line"><span>      next = now;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //能够获取令牌的时间</span></span>
<span class="line"><span>    long at=next;</span></span>
<span class="line"><span>    //设置下一令牌产生时间</span></span>
<span class="line"><span>    next += interval;</span></span>
<span class="line"><span>    //返回线程需要等待的时间</span></span>
<span class="line"><span>    return Math.max(at, 0L);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //申请令牌</span></span>
<span class="line"><span>  void acquire() {</span></span>
<span class="line"><span>    //申请令牌时的时间</span></span>
<span class="line"><span>    long now = System.nanoTime();</span></span>
<span class="line"><span>    //预占令牌</span></span>
<span class="line"><span>    long at=reserve(now);</span></span>
<span class="line"><span>    long waitTime=max(at-now, 0);</span></span>
<span class="line"><span>    //按照条件等待</span></span>
<span class="line"><span>    if(waitTime &amp;gt; 0) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        TimeUnit.NANOSECONDS</span></span>
<span class="line"><span>          .sleep(waitTime);</span></span>
<span class="line"><span>      }catch(InterruptedException e){</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果令牌桶的容量大于1，又该如何处理呢？按照令牌桶算法，令牌要首先从令牌桶中出，所以我们需要按需计算令牌桶中的数量，当有线程请求令牌时，先从令牌桶中出。具体的代码实现如下所示。我们增加了一个 <strong>resync()方法</strong>，在这个方法中，如果线程请求令牌的时间在下一令牌产生时间之后，会重新计算令牌桶中的令牌数， <strong>新产生的令牌的计算公式是：(now-next)/interval</strong>，你可对照上面的示意图来理解。reserve()方法中，则增加了先从令牌桶中出令牌的逻辑，不过需要注意的是，如果令牌是从令牌桶中出的，那么next就无需增加一个 interval 了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SimpleLimiter {</span></span>
<span class="line"><span>  //当前令牌桶中的令牌数量</span></span>
<span class="line"><span>  long storedPermits = 0;</span></span>
<span class="line"><span>  //令牌桶的容量</span></span>
<span class="line"><span>  long maxPermits = 3;</span></span>
<span class="line"><span>  //下一令牌产生时间</span></span>
<span class="line"><span>  long next = System.nanoTime();</span></span>
<span class="line"><span>  //发放令牌间隔：纳秒</span></span>
<span class="line"><span>  long interval = 1000_000_000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //请求时间在下一令牌产生时间之后,则</span></span>
<span class="line"><span>  // 1.重新计算令牌桶中的令牌数</span></span>
<span class="line"><span>  // 2.将下一个令牌发放时间重置为当前时间</span></span>
<span class="line"><span>  void resync(long now) {</span></span>
<span class="line"><span>    if (now &amp;gt; next) {</span></span>
<span class="line"><span>      //新产生的令牌数</span></span>
<span class="line"><span>      long newPermits=(now-next)/interval;</span></span>
<span class="line"><span>      //新令牌增加到令牌桶</span></span>
<span class="line"><span>      storedPermits=min(maxPermits,</span></span>
<span class="line"><span>        storedPermits + newPermits);</span></span>
<span class="line"><span>      //将下一个令牌发放时间重置为当前时间</span></span>
<span class="line"><span>      next = now;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //预占令牌，返回能够获取令牌的时间</span></span>
<span class="line"><span>  synchronized long reserve(long now){</span></span>
<span class="line"><span>    resync(now);</span></span>
<span class="line"><span>    //能够获取令牌的时间</span></span>
<span class="line"><span>    long at = next;</span></span>
<span class="line"><span>    //令牌桶中能提供的令牌</span></span>
<span class="line"><span>    long fb=min(1, storedPermits);</span></span>
<span class="line"><span>    //令牌净需求：首先减掉令牌桶中的令牌</span></span>
<span class="line"><span>    long nr = 1 - fb;</span></span>
<span class="line"><span>    //重新计算下一令牌产生时间</span></span>
<span class="line"><span>    next = next + nr*interval;</span></span>
<span class="line"><span>    //重新计算令牌桶中的令牌</span></span>
<span class="line"><span>    this.storedPermits -= fb;</span></span>
<span class="line"><span>    return at;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //申请令牌</span></span>
<span class="line"><span>  void acquire() {</span></span>
<span class="line"><span>    //申请令牌时的时间</span></span>
<span class="line"><span>    long now = System.nanoTime();</span></span>
<span class="line"><span>    //预占令牌</span></span>
<span class="line"><span>    long at=reserve(now);</span></span>
<span class="line"><span>    long waitTime=max(at-now, 0);</span></span>
<span class="line"><span>    //按照条件等待</span></span>
<span class="line"><span>    if(waitTime &amp;gt; 0) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        TimeUnit.NANOSECONDS</span></span>
<span class="line"><span>          .sleep(waitTime);</span></span>
<span class="line"><span>      }catch(InterruptedException e){</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>经典的限流算法有两个，一个是 <strong>令牌桶算法（Token Bucket）</strong>，另一个是 <strong>漏桶算法（Leaky Bucket）</strong>。令牌桶算法是定时向令牌桶发送令牌，请求能够从令牌桶中拿到令牌，然后才能通过限流器；而漏桶算法里，请求就像水一样注入漏桶，漏桶会按照一定的速率自动将水漏掉，只有漏桶里还能注入水的时候，请求才能通过限流器。令牌桶算法和漏桶算法很像一个硬币的正反面，所以你可以参考令牌桶算法的实现来实现漏桶算法。</p><p>上面我们介绍了Guava是如何实现令牌桶算法的，我们的示例代码是对Guava RateLimiter的简化，Guava RateLimiter扩展了标准的令牌桶算法，比如还能支持预热功能。对于按需加载的缓存来说，预热后缓存能支持5万TPS的并发，但是在预热前5万TPS的并发直接就把缓存击垮了，所以如果需要给该缓存限流，限流器也需要支持预热功能，在初始阶段，限制的流速 r 很小，但是动态增长的。预热功能的实现非常复杂，Guava构建了一个积分函数来解决这个问题，如果你感兴趣，可以继续深入研究。</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,40)])])}const h=a(i,[["render",l]]);export{u as __pageData,h as default};
