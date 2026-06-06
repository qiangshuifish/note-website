import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"36 | 生产者-消费者模式：用流水线思想提高效率","description":"","frontmatter":{},"headers":[{"level":2,"title":"生产者-消费者模式的优点","slug":"生产者-消费者模式的优点","link":"#生产者-消费者模式的优点","children":[]},{"level":2,"title":"支持批量执行以提升性能","slug":"支持批量执行以提升性能","link":"#支持批量执行以提升性能","children":[]},{"level":2,"title":"支持分阶段提交以提升性能","slug":"支持分阶段提交以提升性能","link":"#支持分阶段提交以提升性能","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/36-生产者-消费者模式：用流水线思想提高效率.md","filePath":"Java并发编程实战/36-生产者-消费者模式：用流水线思想提高效率.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/36-生产者-消费者模式：用流水线思想提高效率.md"};function i(t,s,c,r,o,g){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_36-生产者-消费者模式-用流水线思想提高效率" tabindex="-1">36 | 生产者-消费者模式：用流水线思想提高效率 <a class="header-anchor" href="#_36-生产者-消费者模式-用流水线思想提高效率" aria-label="Permalink to &quot;36 | 生产者-消费者模式：用流水线思想提高效率&quot;">​</a></h1><p>前面我们在 <a href="https://time.geekbang.org/column/article/95525" target="_blank" rel="noreferrer">《34 | Worker Thread模式：如何避免重复创建线程？》</a> 中讲到，Worker Thread模式类比的是工厂里车间工人的工作模式。但其实在现实世界，工厂里还有一种流水线的工作模式，类比到编程领域，就是 <strong>生产者-消费者模式</strong>。</p><p>生产者-消费者模式在编程领域的应用也非常广泛，前面我们曾经提到，Java线程池本质上就是用生产者-消费者模式实现的，所以每当使用线程池的时候，其实就是在应用生产者-消费者模式。</p><p>当然，除了在线程池中的应用，为了提升性能，并发编程领域很多地方也都用到了生产者-消费者模式，例如Log4j2中异步Appender内部也用到了生产者-消费者模式。所以今天我们就来深入地聊聊生产者-消费者模式，看看它具体有哪些优点，以及如何提升系统的性能。</p><h2 id="生产者-消费者模式的优点" tabindex="-1">生产者-消费者模式的优点 <a class="header-anchor" href="#生产者-消费者模式的优点" aria-label="Permalink to &quot;生产者-消费者模式的优点&quot;">​</a></h2><p>生产者-消费者模式的核心是一个 <strong>任务队列</strong>，生产者线程生产任务，并将任务添加到任务队列中，而消费者线程从任务队列中获取任务并执行。下面是生产者-消费者模式的一个示意图，你可以结合它来理解。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/96168/df72a9769cec7a25dc9093e160dbbb15.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/96168/df72a9769cec7a25dc9093e160dbbb15.png" alt=""></a></p><p>生产者-消费者模式示意图</p><p>从架构设计的角度来看，生产者-消费者模式有一个很重要的优点，就是 <strong>解耦</strong>。解耦对于大型系统的设计非常重要，而解耦的一个关键就是组件之间的依赖关系和通信方式必须受限。在生产者-消费者模式中，生产者和消费者没有任何依赖关系，它们彼此之间的通信只能通过任务队列，所以 <strong>生产者-消费者模式是一个不错的解耦方案</strong>。</p><p>除了架构设计上的优点之外，生产者-消费者模式还有一个重要的优点就是 <strong>支持异步，并且能够平衡生产者和消费者的速度差异</strong>。在生产者-消费者模式中，生产者线程只需要将任务添加到任务队列而无需等待任务被消费者线程执行完，也就是说任务的生产和消费是异步的，这是与传统的方法之间调用的本质区别，传统的方法之间调用是同步的。</p><p>你或许会有这样的疑问，异步化处理最简单的方式就是创建一个新的线程去处理，那中间增加一个“ <strong>任务队列</strong>”究竟有什么用呢？我觉得主要还是用于 <strong>平衡生产者和消费者的速度差异</strong>。我们假设生产者的速率很慢，而消费者的速率很高，比如是1:3，如果生产者有3个线程，采用创建新的线程的方式，那么会创建3个子线程，而采用生产者-消费者模式，消费线程只需要1个就可以了。Java语言里，Java线程和操作系统线程是一一对应的，线程创建得太多，会增加上下文切换的成本，所以Java线程不是越多越好，适量即可。而 <strong>生产者-消费者模式恰好能支持你用适量的线程</strong>。</p><h2 id="支持批量执行以提升性能" tabindex="-1">支持批量执行以提升性能 <a class="header-anchor" href="#支持批量执行以提升性能" aria-label="Permalink to &quot;支持批量执行以提升性能&quot;">​</a></h2><p>前面我们在 <a href="https://time.geekbang.org/column/article/95098" target="_blank" rel="noreferrer">《33 | Thread-Per-Message模式：最简单实用的分工方法》</a> 中讲过轻量级的线程，如果使用轻量级线程，就没有必要平衡生产者和消费者的速度差异了，因为轻量级线程本身就是廉价的，那是否意味着生产者-消费者模式在性能优化方面就无用武之地了呢？当然不是，有一类并发场景应用生产者-消费者模式就有奇效，那就是 <strong>批量执行</strong> 任务。</p><p>例如，我们要在数据库里INSERT 1000条数据，有两种方案：第一种方案是用1000个线程并发执行，每个线程INSERT一条数据；第二种方案是用1个线程，执行一个批量的SQL，一次性把1000条数据INSERT进去。这两种方案，显然是第二种方案效率更高，其实这样的应用场景就是我们上面提到的批量执行场景。</p><p>在 <a href="https://time.geekbang.org/column/article/95847" target="_blank" rel="noreferrer">《35 | 两阶段终止模式：如何优雅地终止线程？》</a> 文章中，我们提到一个监控系统动态采集的案例，其实最终回传的监控数据还是要存入数据库的（如下图）。但被监控系统往往有很多，如果每一条回传数据都直接INSERT到数据库，那么这个方案就是上面提到的第一种方案：每个线程INSERT一条数据。很显然，更好的方案是批量执行SQL，那如何实现呢？这就要用到生产者-消费者模式了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/96168/155d861702a047bd20b5708e06c6fd29.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/96168/155d861702a047bd20b5708e06c6fd29.png" alt=""></a></p><p>动态采集功能示意图</p><p>利用生产者-消费者模式实现批量执行SQL非常简单：将原来直接INSERT数据到数据库的线程作为生产者线程，生产者线程只需将数据添加到任务队列，然后消费者线程负责将任务从任务队列中批量取出并批量执行。</p><p>在下面的示例代码中，我们创建了5个消费者线程负责批量执行SQL，这5个消费者线程以 <code>while(true){}</code> 循环方式批量地获取任务并批量地执行。需要注意的是，从任务队列中获取批量任务的方法pollTasks()中，首先是以阻塞方式获取任务队列中的一条任务，而后则是以非阻塞的方式获取任务；之所以首先采用阻塞方式，是因为如果任务队列中没有任务，这样的方式能够避免无谓的循环。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//任务队列</span></span>
<span class="line"><span>BlockingQueue&amp;lt;Task&amp;gt; bq=new</span></span>
<span class="line"><span>  LinkedBlockingQueue&amp;lt;&amp;gt;(2000);</span></span>
<span class="line"><span>//启动5个消费者线程</span></span>
<span class="line"><span>//执行批量任务</span></span>
<span class="line"><span>void start() {</span></span>
<span class="line"><span>  ExecutorService es=executors</span></span>
<span class="line"><span>    .newFixedThreadPool(5);</span></span>
<span class="line"><span>  for (int i=0; i&amp;lt;5; i++) {</span></span>
<span class="line"><span>    es.execute(()-&amp;gt;{</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>          //获取批量任务</span></span>
<span class="line"><span>          List&amp;lt;Task&amp;gt; ts=pollTasks();</span></span>
<span class="line"><span>          //执行批量任务</span></span>
<span class="line"><span>          execTasks(ts);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//从任务队列中获取批量任务</span></span>
<span class="line"><span>List&amp;lt;Task&amp;gt; pollTasks()</span></span>
<span class="line"><span>    throws InterruptedException{</span></span>
<span class="line"><span>  List&amp;lt;Task&amp;gt; ts=new LinkedList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  //阻塞式获取一条任务</span></span>
<span class="line"><span>  Task t = bq.take();</span></span>
<span class="line"><span>  while (t != null) {</span></span>
<span class="line"><span>    ts.add(t);</span></span>
<span class="line"><span>    //非阻塞式获取一条任务</span></span>
<span class="line"><span>    t = bq.poll();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return ts;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//批量执行任务</span></span>
<span class="line"><span>execTasks(List&amp;lt;Task&amp;gt; ts) {</span></span>
<span class="line"><span>  //省略具体代码无数</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="支持分阶段提交以提升性能" tabindex="-1">支持分阶段提交以提升性能 <a class="header-anchor" href="#支持分阶段提交以提升性能" aria-label="Permalink to &quot;支持分阶段提交以提升性能&quot;">​</a></h2><p>利用生产者-消费者模式还可以轻松地支持一种分阶段提交的应用场景。我们知道写文件如果同步刷盘性能会很慢，所以对于不是很重要的数据，我们往往采用异步刷盘的方式。我曾经参与过一个项目，其中的日志组件是自己实现的，采用的就是异步刷盘方式，刷盘的时机是：</p><ol><li>ERROR级别的日志需要立即刷盘；</li><li>数据积累到500条需要立即刷盘；</li><li>存在未刷盘数据，且5秒钟内未曾刷盘，需要立即刷盘。</li></ol><p>这个日志组件的异步刷盘操作本质上其实就是一种 <strong>分阶段提交</strong>。下面我们具体看看用生产者-消费者模式如何实现。在下面的示例代码中，可以通过调用 <code>info()</code> 和 <code>error()</code> 方法写入日志，这两个方法都是创建了一个日志任务LogMsg，并添加到阻塞队列中，调用 <code>info()</code> 和 <code>error()</code> 方法的线程是生产者；而真正将日志写入文件的是消费者线程，在Logger这个类中，我们只创建了1个消费者线程，在这个消费者线程中，会根据刷盘规则执行刷盘操作，逻辑很简单，这里就不赘述了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Logger {</span></span>
<span class="line"><span>  //任务队列</span></span>
<span class="line"><span>  final BlockingQueue&amp;lt;LogMsg&amp;gt; bq</span></span>
<span class="line"><span>    = new BlockingQueue&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  //flush批量</span></span>
<span class="line"><span>  static final int batchSize=500;</span></span>
<span class="line"><span>  //只需要一个线程写日志</span></span>
<span class="line"><span>  ExecutorService es =</span></span>
<span class="line"><span>    Executors.newFixedThreadPool(1);</span></span>
<span class="line"><span>  //启动写日志线程</span></span>
<span class="line"><span>  void start(){</span></span>
<span class="line"><span>    File file=File.createTempFile(</span></span>
<span class="line"><span>      &quot;foo&quot;, &quot;.log&quot;);</span></span>
<span class="line"><span>    final FileWriter writer=</span></span>
<span class="line"><span>      new FileWriter(file);</span></span>
<span class="line"><span>    this.es.execute(()-&amp;gt;{</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        //未刷盘日志数量</span></span>
<span class="line"><span>        int curIdx = 0;</span></span>
<span class="line"><span>        long preFT=System.currentTimeMillis();</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>          LogMsg log = bq.poll(</span></span>
<span class="line"><span>            5, TimeUnit.SECONDS);</span></span>
<span class="line"><span>          //写日志</span></span>
<span class="line"><span>          if (log != null) {</span></span>
<span class="line"><span>            writer.write(log.toString());</span></span>
<span class="line"><span>            ++curIdx;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          //如果不存在未刷盘数据，则无需刷盘</span></span>
<span class="line"><span>          if (curIdx &amp;lt;= 0) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          //根据规则刷盘</span></span>
<span class="line"><span>          if (log!=null &amp;&amp; log.level==LEVEL.ERROR ||</span></span>
<span class="line"><span>              curIdx == batchSize ||</span></span>
<span class="line"><span>              System.currentTimeMillis()-preFT&amp;gt;5000){</span></span>
<span class="line"><span>            writer.flush();</span></span>
<span class="line"><span>            curIdx = 0;</span></span>
<span class="line"><span>            preFT=System.currentTimeMillis();</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }catch(Exception e){</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          writer.flush();</span></span>
<span class="line"><span>          writer.close();</span></span>
<span class="line"><span>        }catch(IOException e){</span></span>
<span class="line"><span>          e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //写INFO级别日志</span></span>
<span class="line"><span>  void info(String msg) {</span></span>
<span class="line"><span>    bq.put(new LogMsg(</span></span>
<span class="line"><span>      LEVEL.INFO, msg));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //写ERROR级别日志</span></span>
<span class="line"><span>  void error(String msg) {</span></span>
<span class="line"><span>    bq.put(new LogMsg(</span></span>
<span class="line"><span>      LEVEL.ERROR, msg));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//日志级别</span></span>
<span class="line"><span>enum LEVEL {</span></span>
<span class="line"><span>  INFO, ERROR</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class LogMsg {</span></span>
<span class="line"><span>  LEVEL level;</span></span>
<span class="line"><span>  String msg;</span></span>
<span class="line"><span>  //省略构造函数实现</span></span>
<span class="line"><span>  LogMsg(LEVEL lvl, String msg){}</span></span>
<span class="line"><span>  //省略toString()实现</span></span>
<span class="line"><span>  String toString(){}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>Java语言提供的线程池本身就是一种生产者-消费者模式的实现，但是线程池中的线程每次只能从任务队列中消费一个任务来执行，对于大部分并发场景这种策略都没有问题。但是有些场景还是需要自己来实现，例如需要批量执行以及分阶段提交的场景。</p><p>生产者-消费者模式在分布式计算中的应用也非常广泛。在分布式场景下，你可以借助分布式消息队列（MQ）来实现生产者-消费者模式。MQ一般都会支持两种消息模型，一种是点对点模型，一种是发布订阅模型。这两种模型的区别在于，点对点模型里一个消息只会被一个消费者消费，和Java的线程池非常类似（Java线程池的任务也只会被一个线程执行）；而发布订阅模型里一个消息会被多个消费者消费，本质上是一种消息的广播，在多线程编程领域，你可以结合观察者模式实现广播功能。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>在日志组件异步刷盘的示例代码中，写日志的线程以 <code>while(true){}</code> 的方式执行，你有哪些办法可以优雅地终止这个线程呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.writer.execute(()-&amp;gt;{</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    //未刷盘日志数量</span></span>
<span class="line"><span>    int curIdx = 0;</span></span>
<span class="line"><span>    long preFT=System.currentTimeMillis();</span></span>
<span class="line"><span>    while (true) {</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } catch(Exception e) {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,32)])])}const u=n(l,[["render",i]]);export{h as __pageData,u as default};
