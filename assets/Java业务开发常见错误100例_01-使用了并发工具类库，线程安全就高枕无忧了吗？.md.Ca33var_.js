import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"01 | 使用了并发工具类库，线程安全就高枕无忧了吗？","description":"","frontmatter":{},"headers":[{"level":2,"title":"没有意识到线程重用导致用户信息错乱的Bug","slug":"没有意识到线程重用导致用户信息错乱的bug","link":"#没有意识到线程重用导致用户信息错乱的bug","children":[]},{"level":2,"title":"使用了线程安全的并发工具，并不代表解决了所有线程安全问题","slug":"使用了线程安全的并发工具-并不代表解决了所有线程安全问题","link":"#使用了线程安全的并发工具-并不代表解决了所有线程安全问题","children":[]},{"level":2,"title":"没有充分了解并发工具的特性，从而无法发挥其威力","slug":"没有充分了解并发工具的特性-从而无法发挥其威力","link":"#没有充分了解并发工具的特性-从而无法发挥其威力","children":[]},{"level":2,"title":"没有认清并发工具的使用场景，因而导致性能问题","slug":"没有认清并发工具的使用场景-因而导致性能问题","link":"#没有认清并发工具的使用场景-因而导致性能问题","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/01-使用了并发工具类库，线程安全就高枕无忧了吗？.md","filePath":"Java业务开发常见错误100例/01-使用了并发工具类库，线程安全就高枕无忧了吗？.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/01-使用了并发工具类库，线程安全就高枕无忧了吗？.md"};function l(i,a,o,r,c,u){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_01-使用了并发工具类库-线程安全就高枕无忧了吗" tabindex="-1">01 | 使用了并发工具类库，线程安全就高枕无忧了吗？ <a class="header-anchor" href="#_01-使用了并发工具类库-线程安全就高枕无忧了吗" aria-label="Permalink to &quot;01 | 使用了并发工具类库，线程安全就高枕无忧了吗？&quot;">​</a></h1><p>你好，我是朱晔。作为课程的第一讲，我今天要和你聊聊使用并发工具类库相关的话题。</p><p>在代码审核讨论的时候，我们有时会听到有关线程安全和并发工具的一些片面的观点和结论，比如“把HashMap改为ConcurrentHashMap，就可以解决并发问题了呀”“要不我们试试无锁的CopyOnWriteArrayList吧，性能更好”。事实上，这些说法都不太准确。</p><p>的确，为了方便开发者进行多线程编程，现代编程语言会提供各种并发工具类。但如果我们没有充分了解它们的使用场景、解决的问题，以及最佳实践的话，盲目使用就可能会导致一些坑，小则损失性能，大则无法确保多线程情况下业务逻辑的正确性。</p><p>我需要先说明下，这里的并发工具类是指用来解决多线程环境下并发问题的工具类库。一般而言并发工具包括同步器和容器两大类，业务代码中使用并发容器的情况会多一些，我今天分享的例子也会侧重并发容器。</p><p>接下来，我们就看看在使用并发工具时，最常遇到哪些坑，以及如何解决、避免这些坑吧。</p><h2 id="没有意识到线程重用导致用户信息错乱的bug" tabindex="-1">没有意识到线程重用导致用户信息错乱的Bug <a class="header-anchor" href="#没有意识到线程重用导致用户信息错乱的bug" aria-label="Permalink to &quot;没有意识到线程重用导致用户信息错乱的Bug&quot;">​</a></h2><p>之前有业务同学和我反馈，在生产上遇到一个诡异的问题，有时获取到的用户信息是别人的。查看代码后，我发现他使用了ThreadLocal来缓存获取到的用户信息。</p><p>我们知道，ThreadLocal适用于变量在线程间隔离，而在方法或类间共享的场景。如果用户信息的获取比较昂贵（比如从数据库查询用户信息），那么在ThreadLocal中缓存数据是比较合适的做法。但，这么做为什么会出现用户信息错乱的Bug呢？</p><p>我们看一个具体的案例吧。</p><p>使用Spring Boot创建一个Web应用程序，使用ThreadLocal存放一个Integer的值，来暂且代表需要在线程中保存的用户信息，这个值初始是null。在业务逻辑中，我先从ThreadLocal获取一次值，然后把外部传入的参数设置到ThreadLocal中，来模拟从当前上下文获取到用户信息的逻辑，随后再获取一次值，最后输出两次获得的值和线程名称。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final ThreadLocal&amp;lt;Integer&amp;gt; currentUser = ThreadLocal.withInitial(() -&amp;gt; null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;wrong&quot;)</span></span>
<span class="line"><span>public Map wrong(&amp;#64;RequestParam(&quot;userId&quot;) Integer userId) {</span></span>
<span class="line"><span>    //设置用户信息之前先查询一次ThreadLocal中的用户信息</span></span>
<span class="line"><span>    String before  = Thread.currentThread().getName() + &quot;:&quot; + currentUser.get();</span></span>
<span class="line"><span>    //设置用户信息到ThreadLocal</span></span>
<span class="line"><span>    currentUser.set(userId);</span></span>
<span class="line"><span>    //设置用户信息之后再查询一次ThreadLocal中的用户信息</span></span>
<span class="line"><span>    String after  = Thread.currentThread().getName() + &quot;:&quot; + currentUser.get();</span></span>
<span class="line"><span>    //汇总输出两次查询结果</span></span>
<span class="line"><span>    Map result = new HashMap();</span></span>
<span class="line"><span>    result.put(&quot;before&quot;, before);</span></span>
<span class="line"><span>    result.put(&quot;after&quot;, after);</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按理说，在设置用户信息之前第一次获取的值始终应该是null，但我们要意识到，程序运行在Tomcat中，执行程序的线程是Tomcat的工作线程，而Tomcat的工作线程是基于线程池的。</p><p><strong>顾名思义，线程池会重用固定的几个线程，一旦线程重用，那么很可能首次从ThreadLocal获取的值是之前其他用户的请求遗留的值。这时，ThreadLocal中的用户信息就是其他用户的信息。</strong></p><p>为了更快地重现这个问题，我在配置文件中设置一下Tomcat的参数，把工作线程池最大线程数设置为1，这样始终是同一个线程在处理请求：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server.tomcat.max-threads=1</span></span></code></pre></div><p>运行程序后先让用户1来请求接口，可以看到第一和第二次获取到用户ID分别是null和1，符合预期：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/4b8f38415d03423132c7a3608ebe2430.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/4b8f38415d03423132c7a3608ebe2430.png" alt=""></a></p><p>随后用户2来请求接口，这次就出现了Bug，第一和第二次获取到用户ID分别是1和2，显然第一次获取到了用户1的信息，原因就是Tomcat的线程池重用了线程。从图中可以看到，两次请求的线程都是同一个线程：http-nio-8080-exec-1。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/a9ccd42716d807687b3acff9a0baf2db.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/a9ccd42716d807687b3acff9a0baf2db.png" alt=""></a></p><p>这个例子告诉我们，在写业务代码时，首先要理解代码会跑在什么线程上：</p><ul><li>我们可能会抱怨学多线程没用，因为代码里没有开启使用多线程。但其实，可能只是我们没有意识到，在Tomcat这种Web服务器下跑的业务代码，本来就运行在一个多线程环境（否则接口也不可能支持这么高的并发）， <strong>并不能认为没有显式开启多线程就不会有线程安全问题</strong>。</li><li>因为线程的创建比较昂贵，所以Web服务器往往会使用线程池来处理请求，这就意味着线程会被重用。这时， <strong>使用类似ThreadLocal工具来存放一些数据时，需要特别注意在代码运行完后，显式地去清空设置的数据</strong>。如果在代码中使用了自定义的线程池，也同样会遇到这个问题。</li></ul><p>理解了这个知识点后，我们修正这段代码的方案是，在代码的finally代码块中，显式清除ThreadLocal中的数据。这样一来，新的请求过来即使使用了之前的线程也不会获取到错误的用户信息了。修正后的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;right&quot;)</span></span>
<span class="line"><span>public Map right(&amp;#64;RequestParam(&quot;userId&quot;) Integer userId) {</span></span>
<span class="line"><span>    String before  = Thread.currentThread().getName() + &quot;:&quot; + currentUser.get();</span></span>
<span class="line"><span>    currentUser.set(userId);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        String after = Thread.currentThread().getName() + &quot;:&quot; + currentUser.get();</span></span>
<span class="line"><span>        Map result = new HashMap();</span></span>
<span class="line"><span>        result.put(&quot;before&quot;, before);</span></span>
<span class="line"><span>        result.put(&quot;after&quot;, after);</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        //在finally代码块中删除ThreadLocal中的数据，确保数据不串</span></span>
<span class="line"><span>        currentUser.remove();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重新运行程序可以验证，再也不会出现第一次查询用户信息查询到之前用户请求的Bug：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/0dfe40fca441b58d491fc799d120a7cc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/0dfe40fca441b58d491fc799d120a7cc.png" alt=""></a></p><p>ThreadLocal是利用独占资源的方式，来解决线程安全问题，那如果我们确实需要有资源在线程之间共享，应该怎么办呢？这时，我们可能就需要用到线程安全的容器了。</p><h2 id="使用了线程安全的并发工具-并不代表解决了所有线程安全问题" tabindex="-1">使用了线程安全的并发工具，并不代表解决了所有线程安全问题 <a class="header-anchor" href="#使用了线程安全的并发工具-并不代表解决了所有线程安全问题" aria-label="Permalink to &quot;使用了线程安全的并发工具，并不代表解决了所有线程安全问题&quot;">​</a></h2><p>JDK 1.5后推出的ConcurrentHashMap，是一个高性能的线程安全的哈希表容器。“线程安全”这四个字特别容易让人误解，因为 <strong>ConcurrentHashMap只能保证提供的原子性读写操作是线程安全的。</strong></p><p>我在相当多的业务代码中看到过这个误区，比如下面这个场景。有一个含900个元素的Map，现在再补充100个元素进去，这个补充操作由10个线程并发进行。开发人员误以为使用了ConcurrentHashMap就不会有线程安全问题，于是不加思索地写出了下面的代码：在每一个线程的代码逻辑中先通过size方法拿到当前元素数量，计算ConcurrentHashMap目前还需要补充多少元素，并在日志中输出了这个值，然后通过putAll方法把缺少的元素添加进去。</p><p>为方便观察问题，我们输出了这个Map一开始和最后的元素个数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//线程个数</span></span>
<span class="line"><span>private static int THREAD_COUNT = 10;</span></span>
<span class="line"><span>//总元素数量</span></span>
<span class="line"><span>private static int ITEM_COUNT = 1000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//帮助方法，用来获得一个指定元素数量模拟数据的ConcurrentHashMap</span></span>
<span class="line"><span>private ConcurrentHashMap&amp;lt;String, Long&amp;gt; getData(int count) {</span></span>
<span class="line"><span>    return LongStream.rangeClosed(1, count)</span></span>
<span class="line"><span>            .boxed()</span></span>
<span class="line"><span>            .collect(Collectors.toConcurrentMap(i -&amp;gt; UUID.randomUUID().toString(), Function.identity(),</span></span>
<span class="line"><span>                    (o1, o2) -&amp;gt; o1, ConcurrentHashMap::new));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;wrong&quot;)</span></span>
<span class="line"><span>public String wrong() throws InterruptedException {</span></span>
<span class="line"><span>    ConcurrentHashMap&amp;lt;String, Long&amp;gt; concurrentHashMap = getData(ITEM_COUNT - 100);</span></span>
<span class="line"><span>    //初始900个元素</span></span>
<span class="line"><span>    log.info(&quot;init size:{}&quot;, concurrentHashMap.size());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ForkJoinPool forkJoinPool = new ForkJoinPool(THREAD_COUNT);</span></span>
<span class="line"><span>    //使用线程池并发处理逻辑</span></span>
<span class="line"><span>    forkJoinPool.execute(() -&amp;gt; IntStream.rangeClosed(1, 10).parallel().forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        //查询还需要补充多少个元素</span></span>
<span class="line"><span>        int gap = ITEM_COUNT - concurrentHashMap.size();</span></span>
<span class="line"><span>        log.info(&quot;gap size:{}&quot;, gap);</span></span>
<span class="line"><span>        //补充元素</span></span>
<span class="line"><span>        concurrentHashMap.putAll(getData(gap));</span></span>
<span class="line"><span>    }));</span></span>
<span class="line"><span>    //等待所有任务完成</span></span>
<span class="line"><span>    forkJoinPool.shutdown();</span></span>
<span class="line"><span>    forkJoinPool.awaitTermination(1, TimeUnit.HOURS);</span></span>
<span class="line"><span>    //最后元素个数会是1000吗？</span></span>
<span class="line"><span>    log.info(&quot;finish size:{}&quot;, concurrentHashMap.size());</span></span>
<span class="line"><span>    return &quot;OK&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>访问接口后程序输出的日志内容如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/2eaf5cd1b910b2678aca15fee6144070.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/2eaf5cd1b910b2678aca15fee6144070.png" alt=""></a></p><p>从日志中可以看到：</p><ul><li>初始大小900符合预期，还需要填充100个元素。</li><li>worker1线程查询到当前需要填充的元素为36，竟然还不是100的倍数。</li><li>worker13线程查询到需要填充的元素数是负的，显然已经过度填充了。</li><li>最后HashMap的总项目数是1536，显然不符合填充满1000的预期。</li></ul><p>针对这个场景，我们可以举一个形象的例子。ConcurrentHashMap就像是一个大篮子，现在这个篮子里有900个桔子，我们期望把这个篮子装满1000个桔子，也就是再装100个桔子。有10个工人来干这件事儿，大家先后到岗后会计算还需要补多少个桔子进去，最后把桔子装入篮子。</p><p>ConcurrentHashMap这个篮子本身，可以确保多个工人在装东西进去时，不会相互影响干扰，但无法确保工人A看到还需要装100个桔子但是还未装的时候，工人B就看不到篮子中的桔子数量。更值得注意的是，你往这个篮子装100个桔子的操作不是原子性的，在别人看来可能会有一个瞬间篮子里有964个桔子，还需要补36个桔子。</p><p>回到ConcurrentHashMap，我们需要注意 <strong>ConcurrentHashMap对外提供的方法或能力的限制</strong>：</p><ul><li>使用了ConcurrentHashMap，不代表对它的多个操作之间的状态是一致的，是没有其他线程在操作它的，如果需要确保需要手动加锁。</li><li>诸如size、isEmpty和containsValue等聚合方法，在并发情况下可能会反映ConcurrentHashMap的中间状态。因此在并发情况下，这些方法的返回值只能用作参考，而不能用于流程控制。显然，利用size方法计算差异值，是一个流程控制。</li><li>诸如putAll这样的聚合方法也不能确保原子性，在putAll的过程中去获取数据可能会获取到部分数据。</li></ul><p>代码的修改方案很简单，整段逻辑加锁即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;right&quot;)</span></span>
<span class="line"><span>public String right() throws InterruptedException {</span></span>
<span class="line"><span>    ConcurrentHashMap&amp;lt;String, Long&amp;gt; concurrentHashMap = getData(ITEM_COUNT - 100);</span></span>
<span class="line"><span>    log.info(&quot;init size:{}&quot;, concurrentHashMap.size());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ForkJoinPool forkJoinPool = new ForkJoinPool(THREAD_COUNT);</span></span>
<span class="line"><span>    forkJoinPool.execute(() -&amp;gt; IntStream.rangeClosed(1, 10).parallel().forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        //下面的这段复合逻辑需要锁一下这个ConcurrentHashMap</span></span>
<span class="line"><span>        synchronized (concurrentHashMap) {</span></span>
<span class="line"><span>            int gap = ITEM_COUNT - concurrentHashMap.size();</span></span>
<span class="line"><span>            log.info(&quot;gap size:{}&quot;, gap);</span></span>
<span class="line"><span>            concurrentHashMap.putAll(getData(gap));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }));</span></span>
<span class="line"><span>    forkJoinPool.shutdown();</span></span>
<span class="line"><span>    forkJoinPool.awaitTermination(1, TimeUnit.HOURS);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.info(&quot;finish size:{}&quot;, concurrentHashMap.size());</span></span>
<span class="line"><span>    return &quot;OK&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重新调用接口，程序的日志输出结果符合预期：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/1151b5b87f27073725060b76c56d95b8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/1151b5b87f27073725060b76c56d95b8.png" alt=""></a></p><p>可以看到，只有一个线程查询到了需要补100个元素，其他9个线程查询到不需要补元素，最后Map大小为1000。</p><p>到了这里，你可能又要问了，使用ConcurrentHashMap全程加锁，还不如使用普通的HashMap呢。</p><p>其实不完全是这样。</p><p>ConcurrentHashMap提供了一些原子性的简单复合逻辑方法，用好这些方法就可以发挥其威力。这就引申出代码中常见的另一个问题：在使用一些类库提供的高级工具类时，开发人员可能还是按照旧的方式去使用这些新类，因为没有使用其特性，所以无法发挥其威力。</p><h2 id="没有充分了解并发工具的特性-从而无法发挥其威力" tabindex="-1">没有充分了解并发工具的特性，从而无法发挥其威力 <a class="header-anchor" href="#没有充分了解并发工具的特性-从而无法发挥其威力" aria-label="Permalink to &quot;没有充分了解并发工具的特性，从而无法发挥其威力&quot;">​</a></h2><p>我们来看一个使用Map来统计Key出现次数的场景吧，这个逻辑在业务代码中非常常见。</p><ul><li>使用ConcurrentHashMap来统计，Key的范围是10。</li><li>使用最多10个并发，循环操作1000万次，每次操作累加随机的Key。</li><li>如果Key不存在的话，首次设置值为1。</li></ul><p>代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//循环次数</span></span>
<span class="line"><span>private static int LOOP_COUNT = 10000000;</span></span>
<span class="line"><span>//线程数量</span></span>
<span class="line"><span>private static int THREAD_COUNT = 10;</span></span>
<span class="line"><span>//元素数量</span></span>
<span class="line"><span>private static int ITEM_COUNT = 10;</span></span>
<span class="line"><span>private Map&amp;lt;String, Long&amp;gt; normaluse() throws InterruptedException {</span></span>
<span class="line"><span>    ConcurrentHashMap&amp;lt;String, Long&amp;gt; freqs = new ConcurrentHashMap&amp;lt;&amp;gt;(ITEM_COUNT);</span></span>
<span class="line"><span>    ForkJoinPool forkJoinPool = new ForkJoinPool(THREAD_COUNT);</span></span>
<span class="line"><span>    forkJoinPool.execute(() -&amp;gt; IntStream.rangeClosed(1, LOOP_COUNT).parallel().forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        //获得一个随机的Key</span></span>
<span class="line"><span>        String key = &quot;item&quot; + ThreadLocalRandom.current().nextInt(ITEM_COUNT);</span></span>
<span class="line"><span>                synchronized (freqs) {</span></span>
<span class="line"><span>                    if (freqs.containsKey(key)) {</span></span>
<span class="line"><span>                        //Key存在则+1</span></span>
<span class="line"><span>                        freqs.put(key, freqs.get(key) + 1);</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                        //Key不存在则初始化为1</span></span>
<span class="line"><span>                        freqs.put(key, 1L);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>    ));</span></span>
<span class="line"><span>    forkJoinPool.shutdown();</span></span>
<span class="line"><span>    forkJoinPool.awaitTermination(1, TimeUnit.HOURS);</span></span>
<span class="line"><span>    return freqs;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们吸取之前的教训，直接通过锁的方式锁住Map，然后做判断、读取现在的累计值、加1、保存累加后值的逻辑。这段代码在功能上没有问题，但无法充分发挥ConcurrentHashMap的威力，改进后的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Map&amp;lt;String, Long&amp;gt; gooduse() throws InterruptedException {</span></span>
<span class="line"><span>    ConcurrentHashMap&amp;lt;String, LongAdder&amp;gt; freqs = new ConcurrentHashMap&amp;lt;&amp;gt;(ITEM_COUNT);</span></span>
<span class="line"><span>    ForkJoinPool forkJoinPool = new ForkJoinPool(THREAD_COUNT);</span></span>
<span class="line"><span>    forkJoinPool.execute(() -&amp;gt; IntStream.rangeClosed(1, LOOP_COUNT).parallel().forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        String key = &quot;item&quot; + ThreadLocalRandom.current().nextInt(ITEM_COUNT);</span></span>
<span class="line"><span>                //利用computeIfAbsent()方法来实例化LongAdder，然后利用LongAdder来进行线程安全计数</span></span>
<span class="line"><span>                freqs.computeIfAbsent(key, k -&amp;gt; new LongAdder()).increment();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>    ));</span></span>
<span class="line"><span>    forkJoinPool.shutdown();</span></span>
<span class="line"><span>    forkJoinPool.awaitTermination(1, TimeUnit.HOURS);</span></span>
<span class="line"><span>    //因为我们的Value是LongAdder而不是Long，所以需要做一次转换才能返回</span></span>
<span class="line"><span>    return freqs.entrySet().stream()</span></span>
<span class="line"><span>            .collect(Collectors.toMap(</span></span>
<span class="line"><span>                    e -&amp;gt; e.getKey(),</span></span>
<span class="line"><span>                    e -&amp;gt; e.getValue().longValue())</span></span>
<span class="line"><span>            );</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段改进后的代码中，我们巧妙利用了下面两点：</p><ul><li>使用ConcurrentHashMap的原子性方法computeIfAbsent来做复合逻辑操作，判断Key是否存在Value，如果不存在则把Lambda表达式运行后的结果放入Map作为Value，也就是新创建一个LongAdder对象，最后返回Value。</li><li>由于computeIfAbsent方法返回的Value是LongAdder，是一个线程安全的累加器，因此可以直接调用其increment方法进行累加。</li></ul><p><strong>这样在确保线程安全的情况下达到极致性能，把之前7行代码替换为了1行。</strong></p><p>我们通过一个简单的测试比较一下修改前后两段代码的性能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;good&quot;)</span></span>
<span class="line"><span>public String good() throws InterruptedException {</span></span>
<span class="line"><span>    StopWatch stopWatch = new StopWatch();</span></span>
<span class="line"><span>    stopWatch.start(&quot;normaluse&quot;);</span></span>
<span class="line"><span>    Map&amp;lt;String, Long&amp;gt; normaluse = normaluse();</span></span>
<span class="line"><span>    stopWatch.stop();</span></span>
<span class="line"><span>    //校验元素数量</span></span>
<span class="line"><span>    Assert.isTrue(normaluse.size() == ITEM_COUNT, &quot;normaluse size error&quot;);</span></span>
<span class="line"><span>    //校验累计总数</span></span>
<span class="line"><span>    Assert.isTrue(normaluse.entrySet().stream()</span></span>
<span class="line"><span>                    .mapToLong(item -&amp;gt; item.getValue()).reduce(0, Long::sum) == LOOP_COUNT</span></span>
<span class="line"><span>            , &quot;normaluse count error&quot;);</span></span>
<span class="line"><span>    stopWatch.start(&quot;gooduse&quot;);</span></span>
<span class="line"><span>    Map&amp;lt;String, Long&amp;gt; gooduse = gooduse();</span></span>
<span class="line"><span>    stopWatch.stop();</span></span>
<span class="line"><span>    Assert.isTrue(gooduse.size() == ITEM_COUNT, &quot;gooduse size error&quot;);</span></span>
<span class="line"><span>    Assert.isTrue(gooduse.entrySet().stream()</span></span>
<span class="line"><span>                    .mapToLong(item -&amp;gt; item.getValue())</span></span>
<span class="line"><span>                    .reduce(0, Long::sum) == LOOP_COUNT</span></span>
<span class="line"><span>            , &quot;gooduse count error&quot;);</span></span>
<span class="line"><span>    log.info(stopWatch.prettyPrint());</span></span>
<span class="line"><span>    return &quot;OK&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段测试代码并无特殊之处，使用StopWatch来测试两段代码的性能，最后跟了一个断言判断Map中元素的个数以及所有Value的和，是否符合预期来校验代码的正确性。测试结果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/751d484ecd8c3114c15588e7fff3263a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/751d484ecd8c3114c15588e7fff3263a.png" alt=""></a></p><p>可以看到， <strong>优化后的代码，相比使用锁来操作ConcurrentHashMap的方式，性能提升了10倍</strong>。</p><p>你可能会问，computeIfAbsent为什么如此高效呢？</p><p>答案就在源码最核心的部分，也就是Java自带的Unsafe实现的CAS。它在虚拟机层面确保了写入数据的原子性，比加锁的效率高得多：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    static final &amp;lt;K,V&amp;gt; boolean casTabAt(Node&amp;lt;K,V&amp;gt;[] tab, int i,</span></span>
<span class="line"><span>                                        Node&amp;lt;K,V&amp;gt; c, Node&amp;lt;K,V&amp;gt; v) {</span></span>
<span class="line"><span>        return U.compareAndSetObject(tab, ((long)i &amp;lt;&amp;lt; ASHIFT) + ABASE, c, v);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>像ConcurrentHashMap这样的高级并发工具的确提供了一些高级API，只有充分了解其特性才能最大化其威力，而不能因为其足够高级、酷炫盲目使用。</p><h2 id="没有认清并发工具的使用场景-因而导致性能问题" tabindex="-1">没有认清并发工具的使用场景，因而导致性能问题 <a class="header-anchor" href="#没有认清并发工具的使用场景-因而导致性能问题" aria-label="Permalink to &quot;没有认清并发工具的使用场景，因而导致性能问题&quot;">​</a></h2><p>除了ConcurrentHashMap这样通用的并发工具类之外，我们的工具包中还有些针对特殊场景实现的生面孔。一般来说，针对通用场景的通用解决方案，在所有场景下性能都还可以，属于“万金油”；而针对特殊场景的特殊实现，会有比通用解决方案更高的性能，但一定要在它针对的场景下使用，否则可能会产生性能问题甚至是Bug。</p><p>之前在排查一个生产性能问题时，我们发现一段简单的非数据库操作的业务逻辑，消耗了超出预期的时间，在修改数据时操作本地缓存比回写数据库慢许多。查看代码发现，开发同学使用了CopyOnWriteArrayList来缓存大量的数据，而数据变化又比较频繁。</p><p>CopyOnWrite是一个时髦的技术，不管是Linux还是Redis都会用到。 <strong>在Java中，CopyOnWriteArrayList虽然是一个线程安全的ArrayList，但因为其实现方式是，每次修改数据时都会复制一份数据出来，所以有明显的适用场景，即读多写少或者说希望无锁读的场景。</strong></p><p>如果我们要使用CopyOnWriteArrayList，那一定是因为场景需要而不是因为足够酷炫。如果读写比例均衡或者有大量写操作的话，使用CopyOnWriteArrayList的性能会非常糟糕。</p><p>我们写一段测试代码，来比较下使用CopyOnWriteArrayList和普通加锁方式ArrayList的读写性能吧。在这段代码中我们针对并发读和并发写分别写了一个测试方法，测试两者一定次数的写或读操作的耗时。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//测试并发写的性能</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;write&quot;)</span></span>
<span class="line"><span>public Map testWrite() {</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; copyOnWriteArrayList = new CopyOnWriteArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; synchronizedList = Collections.synchronizedList(new ArrayList&amp;lt;&amp;gt;());</span></span>
<span class="line"><span>    StopWatch stopWatch = new StopWatch();</span></span>
<span class="line"><span>    int loopCount = 100000;</span></span>
<span class="line"><span>    stopWatch.start(&quot;Write:copyOnWriteArrayList&quot;);</span></span>
<span class="line"><span>    //循环100000次并发往CopyOnWriteArrayList写入随机元素</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).parallel().forEach(__ -&amp;gt; copyOnWriteArrayList.add(ThreadLocalRandom.current().nextInt(loopCount)));</span></span>
<span class="line"><span>    stopWatch.stop();</span></span>
<span class="line"><span>    stopWatch.start(&quot;Write:synchronizedList&quot;);</span></span>
<span class="line"><span>    //循环100000次并发往加锁的ArrayList写入随机元素</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).parallel().forEach(__ -&amp;gt; synchronizedList.add(ThreadLocalRandom.current().nextInt(loopCount)));</span></span>
<span class="line"><span>    stopWatch.stop();</span></span>
<span class="line"><span>    log.info(stopWatch.prettyPrint());</span></span>
<span class="line"><span>    Map result = new HashMap();</span></span>
<span class="line"><span>    result.put(&quot;copyOnWriteArrayList&quot;, copyOnWriteArrayList.size());</span></span>
<span class="line"><span>    result.put(&quot;synchronizedList&quot;, synchronizedList.size());</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//帮助方法用来填充List</span></span>
<span class="line"><span>private void addAll(List&amp;lt;Integer&amp;gt; list) {</span></span>
<span class="line"><span>    list.addAll(IntStream.rangeClosed(1, 1000000).boxed().collect(Collectors.toList()));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//测试并发读的性能</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;read&quot;)</span></span>
<span class="line"><span>public Map testRead() {</span></span>
<span class="line"><span>    //创建两个测试对象</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; copyOnWriteArrayList = new CopyOnWriteArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; synchronizedList = Collections.synchronizedList(new ArrayList&amp;lt;&amp;gt;());</span></span>
<span class="line"><span>    //填充数据</span></span>
<span class="line"><span>    addAll(copyOnWriteArrayList);</span></span>
<span class="line"><span>    addAll(synchronizedList);</span></span>
<span class="line"><span>    StopWatch stopWatch = new StopWatch();</span></span>
<span class="line"><span>    int loopCount = 1000000;</span></span>
<span class="line"><span>    int count = copyOnWriteArrayList.size();</span></span>
<span class="line"><span>    stopWatch.start(&quot;Read:copyOnWriteArrayList&quot;);</span></span>
<span class="line"><span>    //循环1000000次并发从CopyOnWriteArrayList随机查询元素</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).parallel().forEach(__ -&amp;gt; copyOnWriteArrayList.get(ThreadLocalRandom.current().nextInt(count)));</span></span>
<span class="line"><span>    stopWatch.stop();</span></span>
<span class="line"><span>    stopWatch.start(&quot;Read:synchronizedList&quot;);</span></span>
<span class="line"><span>    //循环1000000次并发从加锁的ArrayList随机查询元素</span></span>
<span class="line"><span>    IntStream.range(0, loopCount).parallel().forEach(__ -&amp;gt; synchronizedList.get(ThreadLocalRandom.current().nextInt(count)));</span></span>
<span class="line"><span>    stopWatch.stop();</span></span>
<span class="line"><span>    log.info(stopWatch.prettyPrint());</span></span>
<span class="line"><span>    Map result = new HashMap();</span></span>
<span class="line"><span>    result.put(&quot;copyOnWriteArrayList&quot;, copyOnWriteArrayList.size());</span></span>
<span class="line"><span>    result.put(&quot;synchronizedList&quot;, synchronizedList.size());</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行程序可以看到， <strong>大量写的场景（10万次add操作），</strong> <strong>CopyOnWriteArray几乎比同步的ArrayList慢一百倍</strong>：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/9789fe2019a1267b7883606b60e498b4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/9789fe2019a1267b7883606b60e498b4.png" alt=""></a></p><p>而在大量读的场景下（100万次get操作），CopyOnWriteArray又比同步的ArrayList快五倍以上：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/30ba652fb3295c58b03f51de0a132436.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/209494/30ba652fb3295c58b03f51de0a132436.png" alt=""></a></p><p>你可能会问，为何在大量写的场景下，CopyOnWriteArrayList会这么慢呢？</p><p>答案就在源码中。以add方法为例，每次add时，都会用Arrays.copyOf创建一个新数组，频繁add时内存的申请释放消耗会很大：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /**</span></span>
<span class="line"><span>     * Appends the specified element to the end of this list.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;param e element to be appended to this list</span></span>
<span class="line"><span>     * &amp;#64;return {&amp;#64;code true} (as specified by {&amp;#64;link Collection#add})</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean add(E e) {</span></span>
<span class="line"><span>        synchronized (lock) {</span></span>
<span class="line"><span>            Object[] elements = getArray();</span></span>
<span class="line"><span>            int len = elements.length;</span></span>
<span class="line"><span>            Object[] newElements = Arrays.copyOf(elements, len + 1);</span></span>
<span class="line"><span>            newElements[len] = e;</span></span>
<span class="line"><span>            setArray(newElements);</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我主要与你分享了，开发人员使用并发工具来解决线程安全问题时容易犯的四类错。</p><p>一是，只知道使用并发工具，但并不清楚当前线程的来龙去脉，解决多线程问题却不了解线程。比如，使用ThreadLocal来缓存数据，以为ThreadLocal在线程之间做了隔离不会有线程安全问题，没想到线程重用导致数据串了。请务必记得，在业务逻辑结束之前清理ThreadLocal中的数据。</p><p>二是，误以为使用了并发工具就可以解决一切线程安全问题，期望通过把线程不安全的类替换为线程安全的类来一键解决问题。比如，认为使用了ConcurrentHashMap就可以解决线程安全问题，没对复合逻辑加锁导致业务逻辑错误。如果你希望在一整段业务逻辑中，对容器的操作都保持整体一致性的话，需要加锁处理。</p><p>三是，没有充分了解并发工具的特性，还是按照老方式使用新工具导致无法发挥其性能。比如，使用了ConcurrentHashMap，但没有充分利用其提供的基于CAS安全的方法，还是使用锁的方式来实现逻辑。你可以阅读一下 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html" target="_blank" rel="noreferrer">ConcurrentHashMap的文档</a>，看一下相关原子性操作API是否可以满足业务需求，如果可以则优先考虑使用。</p><p>四是，没有了解清楚工具的适用场景，在不合适的场景下使用了错误的工具导致性能更差。比如，没有理解CopyOnWriteArrayList的适用场景，把它用在了读写均衡或者大量写操作的场景下，导致性能问题。对于这种场景，你可以考虑是用普通的List。</p><p>其实，这四类坑之所以容易踩到，原因可以归结为，我们在使用并发工具的时候，并没有充分理解其可能存在的问题、适用场景等。所以最后， <strong>我还要和你分享两点建议</strong>：</p><ol><li>一定要认真阅读官方文档（比如Oracle JDK文档）。充分阅读官方文档，理解工具的适用场景及其API的用法，并做一些小实验。了解之后再去使用，就可以避免大部分坑。</li><li>如果你的代码运行在多线程环境下，那么就会有并发问题，并发问题不那么容易重现，可能需要使用压力测试模拟并发场景，来发现其中的Bug或性能问题。</li></ol><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>今天我们多次用到了ThreadLocalRandom，你觉得是否可以把它的实例设置到静态变量中，在多线程情况下重用呢？</li><li>ConcurrentHashMap还提供了putIfAbsent方法，你能否通过查阅 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html" target="_blank" rel="noreferrer">JDK文档</a>，说说computeIfAbsent和putIfAbsent方法的区别？</li></ol><p>你在使用并发工具时，还遇到过其他坑吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把这篇文章分享给你的朋友或同事，一起交流。</p>`,93)])])}const d=n(t,[["render",l]]);export{h as __pageData,d as default};
