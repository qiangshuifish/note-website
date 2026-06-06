import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"答疑篇：代码篇思考题集锦（一）","description":"","frontmatter":{},"headers":[{"level":3,"title":"01 | 使用了并发工具类库，线程安全就高枕无忧了吗？","slug":"_01-使用了并发工具类库-线程安全就高枕无忧了吗","link":"#_01-使用了并发工具类库-线程安全就高枕无忧了吗","children":[]},{"level":3,"title":"02 | 代码加锁：不要让“锁”事成为烦心事","slug":"_02-代码加锁-不要让-锁-事成为烦心事","link":"#_02-代码加锁-不要让-锁-事成为烦心事","children":[]},{"level":3,"title":"03 | 线程池：业务代码最常用也最容易犯错的组件","slug":"_03-线程池-业务代码最常用也最容易犯错的组件","link":"#_03-线程池-业务代码最常用也最容易犯错的组件","children":[]},{"level":3,"title":"04 | 连接池：别让连接池帮了倒忙","slug":"_04-连接池-别让连接池帮了倒忙","link":"#_04-连接池-别让连接池帮了倒忙","children":[]},{"level":3,"title":"05 | HTTP调用：你考虑到超时、重试、并发了吗？","slug":"_05-http调用-你考虑到超时、重试、并发了吗","link":"#_05-http调用-你考虑到超时、重试、并发了吗","children":[]},{"level":3,"title":"06 | 20%的业务代码的Spring声明式事务，可能都没处理正确","slug":"_06-20-的业务代码的spring声明式事务-可能都没处理正确","link":"#_06-20-的业务代码的spring声明式事务-可能都没处理正确","children":[]}],"relativePath":"Java业务开发常见错误100例/答疑篇：代码篇思考题集锦（一）.md","filePath":"Java业务开发常见错误100例/答疑篇：代码篇思考题集锦（一）.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/答疑篇：代码篇思考题集锦（一）.md"};function l(i,a,o,r,c,g){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="答疑篇-代码篇思考题集锦-一" tabindex="-1">答疑篇：代码篇思考题集锦（一） <a class="header-anchor" href="#答疑篇-代码篇思考题集锦-一" aria-label="Permalink to &quot;答疑篇：代码篇思考题集锦（一）&quot;">​</a></h1><p>你好，我是朱晔。</p><p>在回复《Java 业务开发常见错误100例》这门课留言的过程中，我看到有些同学特别想看一看咱们这个课程所有思考题的答案。因此呢，我特地将这个课程涉及的思考题进行了梳理，把其中的67个问题的答案或者说解题思路，详细地写了出来，并整理成了一个“答疑篇”模块。</p><p>我把这些问题拆分为了6篇分别更新，你可以根据自己的时间来学习，以保证学习效果。你可以通过这些回答，再来回顾下这些知识点，以求温故而知新；同时，你也可以对照着我的回答，对比下自己的解题思路，看看有没有什么不一样的地方，并留言给我。</p><p>今天是答疑篇的第一讲，我们一起来分析下咱们这门课前6讲的课后思考题。这些题目涉及了并发工具、代码加锁、线程池、连接池、HTTP调用和Spring声明式事务的12道思考题。</p><p>接下来，我们就一一具体分析吧。</p><h3 id="_01-使用了并发工具类库-线程安全就高枕无忧了吗" tabindex="-1"><a href="https://time.geekbang.org/column/article/209494" target="_blank" rel="noreferrer">01 | 使用了并发工具类库，线程安全就高枕无忧了吗？</a> <a class="header-anchor" href="#_01-使用了并发工具类库-线程安全就高枕无忧了吗" aria-label="Permalink to &quot;[01 \\| 使用了并发工具类库，线程安全就高枕无忧了吗？](https://time.geekbang.org/column/article/209494)&quot;">​</a></h3><p><strong>问题1：</strong> ThreadLocalRandom是Java 7引入的一个生成随机数的类。你觉得可以把它的实例设置到静态变量中，在多线程情况下重用吗？</p><p>答：不能。</p><p><a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ThreadLocalRandom.html" target="_blank" rel="noreferrer">ThreadLocalRandom文档</a> 里有这么一条：</p><blockquote><p>Usages of this class should typically be of the form: ThreadLocalRandom.current().nextX(…) (where X is Int, Long, etc). When all usages are of this form, it is never possible to accidently share a ThreadLocalRandom across multiple threads.</p></blockquote><p>那为什么规定要ThreadLocalRandom.current().nextX(…)这样来使用呢？我来分析下原因吧。</p><p>current()的时候初始化一个初始化种子到线程，每次nextseed再使用之前的种子生成新的种子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UNSAFE.putLong(t = Thread.currentThread(), SEED, r = UNSAFE.getLong(t, SEED) + GAMMA);</span></span></code></pre></div><p>如果你通过主线程调用一次current生成一个ThreadLocalRandom的实例保存起来，那么其它线程来获取种子的时候必然取不到初始种子，必须是每一个线程自己用的时候初始化一个种子到线程。你可以在nextSeed方法设置一个断点来测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UNSAFE.getLong(Thread.currentThread(),SEED);</span></span></code></pre></div><p><strong>问题2：</strong> ConcurrentHashMap还提供了putIfAbsent方法，你能否通过查阅 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentHashMap.html" target="_blank" rel="noreferrer">JDK文档</a>，说说computeIfAbsent和putIfAbsent方法的区别？</p><p>答：computeIfAbsent和putIfAbsent这两个方法，都是判断值不存在的时候为Map进行赋值的原子方法，它们的区别具体包括以下三个方面：</p><ol><li>当Key存在的时候，如果Value的获取比较昂贵的话，putIfAbsent方法就会白白浪费时间在获取这个昂贵的Value上（这个点特别注意），而computeIfAbsent则会因为传入的是Lambda表达式而不是实际值不会有这个问题。</li><li>Key不存在的时候，putIfAbsent会返回null，这时候我们要小心空指针；而computeIfAbsent会返回计算后的值，不存在空指针的问题。</li><li>当Key不存在的时候，putIfAbsent允许put null进去，而computeIfAbsent不能（当然了，此条针对HashMap，ConcurrentHashMap不允许put null value进去）。</li></ol><p>我写了一段代码来证明这三点，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes/blob/master/src/main/java/org/geekbang/time/commonmistakes/concurrenttool/ciavspia/CommonMistakesApplication.java" target="_blank" rel="noreferrer">这里</a> 的GitHub链接查看。</p><h3 id="_02-代码加锁-不要让-锁-事成为烦心事" tabindex="-1"><a href="https://time.geekbang.org/column/article/209520" target="_blank" rel="noreferrer">02 | 代码加锁：不要让“锁”事成为烦心事</a> <a class="header-anchor" href="#_02-代码加锁-不要让-锁-事成为烦心事" aria-label="Permalink to &quot;[02 \\| 代码加锁：不要让“锁”事成为烦心事](https://time.geekbang.org/column/article/209520)&quot;">​</a></h3><p><strong>问题1：</strong> 在这一讲开头的例子里，我们为变量a、b都使用了volatile关键字进行修饰，你知道volatile关键字的作用吗？我之前遇到过这样一个坑：我们开启了一个线程无限循环来跑一些任务，有一个bool类型的变量来控制循环的退出，默认为true代表执行，一段时间后主线程将这个变量设置为了false。如果这个变量不是volatile修饰的，子线程可以退出吗？你能否解释其中的原因呢？</p><p>答：不能退出。比如下面的代码，3秒后另一个线程把b设置为false，但是主线程无法退出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static boolean b = true;</span></span>
<span class="line"><span>public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            TimeUnit.SECONDS.sleep(3);</span></span>
<span class="line"><span>        } catch (InterruptedException e) { }</span></span>
<span class="line"><span>        b =false;</span></span>
<span class="line"><span>    }).start();</span></span>
<span class="line"><span>    while (b) {</span></span>
<span class="line"><span>        TimeUnit.MILLISECONDS.sleep(0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    System.out.println(&quot;done&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实，这是可见性的问题。</p><p>虽然另一个线程把b设置为了false，但是这个字段在CPU缓存中，另一个线程（主线程）还是读不到最新的值。使用volatile关键字，可以让数据刷新到主内存中去。准确来说，让数据刷新到主内存中去是两件事情：</p><ol><li>将当前处理器缓存行的数据，写回到系统内存；</li><li>这个写回内存的操作会导致其他CPU里缓存了该内存地址的数据变为无效。</li></ol><p>当然，使用AtomicBoolean等关键字来修改变量b也行。但相比volatile来说，AtomicBoolean等关键字除了确保可见性，还提供了CAS方法，具有更多的功能，在本例的场景中用不到。</p><p><strong>问题2：</strong> 关于代码加锁还有两个坑，一是加锁和释放没有配对的问题，二是分布式锁自动释放导致的重复逻辑执行的问题。你有什么方法来发现和解决这两个问题吗？</p><p>答：针对加解锁没有配对的问题，我们可以用一些代码质量工具或代码扫描工具（比如Sonar）来帮助排查。这个问题在编码阶段就能发现。</p><p>针对分布式锁超时自动释放问题，可以参考Redisson的RedissonLock的 <a href="https://github.com/redisson/redisson/blob/e11c1e14ba50bc5938184fb96d9b72782e591df7/redisson/src/main/java/org/redisson/RedissonLock.java#L265" target="_blank" rel="noreferrer">锁续期机制</a>。锁续期是每次续一段时间，比如30秒，然后10秒执行一次续期。虽然是无限次续期，但即使客户端崩溃了也没关系，不会无限期占用锁，因为崩溃后无法自动续期自然最终会超时。</p><h3 id="_03-线程池-业务代码最常用也最容易犯错的组件" tabindex="-1"><a href="https://time.geekbang.org/column/article/210337" target="_blank" rel="noreferrer">03 | 线程池：业务代码最常用也最容易犯错的组件</a> <a class="header-anchor" href="#_03-线程池-业务代码最常用也最容易犯错的组件" aria-label="Permalink to &quot;[03 \\| 线程池：业务代码最常用也最容易犯错的组件](https://time.geekbang.org/column/article/210337)&quot;">​</a></h3><p><strong>问题1：</strong> 在讲线程池的管理策略时我们提到，或许一个激进创建线程的弹性线程池更符合我们的需求，你能给出相关的实现吗？实现后再测试一下，是否所有的任务都可以正常处理完成呢？</p><p>答：我们按照文中提到的两个思路来实现一下激进线程池：</p><ol><li>由于线程池在工作队列满了无法入队的情况下会扩容线程池，那么我们可以重写队列的 offer 方法，造成这个队列已满的假象；</li><li>由于我们 Hack 了队列，在达到了最大线程后势必会触发拒绝策略，那么我们还需要实现一个自定义的拒绝策略处理程序，这个时候再把任务真正插入队列。</li></ol><p>完整的实现代码以及相应的测试代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;better&quot;)</span></span>
<span class="line"><span>public int better() throws InterruptedException {</span></span>
<span class="line"><span>    //这里开始是激进线程池的实现</span></span>
<span class="line"><span>    BlockingQueue&amp;lt;Runnable&amp;gt; queue = new LinkedBlockingQueue&amp;lt;Runnable&amp;gt;(10) {</span></span>
<span class="line"><span>        &amp;#64;Override</span></span>
<span class="line"><span>        public boolean offer(Runnable e) {</span></span>
<span class="line"><span>            //先返回false，造成队列满的假象，让线程池优先扩容</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ThreadPoolExecutor threadPool = new ThreadPoolExecutor(</span></span>
<span class="line"><span>            2, 5,</span></span>
<span class="line"><span>            5, TimeUnit.SECONDS,</span></span>
<span class="line"><span>            queue, new ThreadFactoryBuilder().setNameFormat(&quot;demo-threadpool-%d&quot;).get(), (r, executor) -&amp;gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //等出现拒绝后再加入队列</span></span>
<span class="line"><span>            //如果希望队列满了阻塞线程而不是抛出异常，那么可以注释掉下面三行代码，修改为executor.getQueue().put(r);</span></span>
<span class="line"><span>            if (!executor.getQueue().offer(r, 0, TimeUnit.SECONDS)) {</span></span>
<span class="line"><span>                throw new RejectedExecutionException(&quot;ThreadPool queue full, failed to offer &quot; + r.toString());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            Thread.currentThread().interrupt();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    //激进线程池实现结束</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    printStats(threadPool);</span></span>
<span class="line"><span>    //每秒提交一个任务，每个任务耗时10秒执行完成，一共提交20个任务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //任务编号计数器</span></span>
<span class="line"><span>    AtomicInteger atomicInteger = new AtomicInteger();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    IntStream.rangeClosed(1, 20).forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            TimeUnit.SECONDS.sleep(1);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int id = atomicInteger.incrementAndGet();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            threadPool.submit(() -&amp;gt; {</span></span>
<span class="line"><span>                log.info(&quot;{} started&quot;, id);</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    TimeUnit.SECONDS.sleep(10);</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                log.info(&quot;{} finished&quot;, id);</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            log.error(&quot;error submitting task {}&quot;, id, ex);</span></span>
<span class="line"><span>            atomicInteger.decrementAndGet();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    TimeUnit.SECONDS.sleep(60);</span></span>
<span class="line"><span>    return atomicInteger.intValue();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用这个激进的线程池可以处理完这20个任务，因为我们优先开启了更多线程来处理任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[10:57:16.092] [demo-threadpool-4] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:157 ] - 20 finished</span></span>
<span class="line"><span>[10:57:17.062] [pool-8-thread-1] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:22  ] - =========================</span></span>
<span class="line"><span>[10:57:17.062] [pool-8-thread-1] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:23  ] - Pool Size: 5</span></span>
<span class="line"><span>[10:57:17.062] [pool-8-thread-1] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:24  ] - Active Threads: 0</span></span>
<span class="line"><span>[10:57:17.062] [pool-8-thread-1] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:25  ] - Number of Tasks Completed: 20</span></span>
<span class="line"><span>[10:57:17.062] [pool-8-thread-1] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:26  ] - Number of Tasks in Queue: 0</span></span>
<span class="line"><span>[10:57:17.062] [pool-8-thread-1] [INFO ] [o.g.t.c.t.t.ThreadPoolOOMController:28  ] - =========================</span></span></code></pre></div><p><strong>问题2：</strong> 在讲“务必确认清楚线程池本身是不是复用”时，我们改进了ThreadPoolHelper使其能够返回复用的线程池。如果我们不小心每次都创建了这样一个自定义的线程池（10核心线程，50最大线程，2秒回收的），反复执行测试接口线程，最终可以被回收吗？会出现OOM问题吗？</p><p>答：会因为创建过多线程导致OOM，因为默认情况下核心线程不会回收，并且ThreadPoolExecutor也回收不了。</p><p>我们可以看看它的源码，工作线程Worker是内部类，只要它活着，换句话说就是线程在跑，就会阻止ThreadPoolExecutor回收：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadPoolExecutor extends AbstractExecutorService {</span></span>
<span class="line"><span>    private final class Worker</span></span>
<span class="line"><span>        extends AbstractQueuedSynchronizer</span></span>
<span class="line"><span>        implements Runnable</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>因此，我们不能认为ThreadPoolExecutor没有引用，就能回收。</p><h3 id="_04-连接池-别让连接池帮了倒忙" tabindex="-1"><a href="https://time.geekbang.org/column/article/211388" target="_blank" rel="noreferrer">04 | 连接池：别让连接池帮了倒忙</a> <a class="header-anchor" href="#_04-连接池-别让连接池帮了倒忙" aria-label="Permalink to &quot;[04 \\| 连接池：别让连接池帮了倒忙](https://time.geekbang.org/column/article/211388)&quot;">​</a></h3><p><strong>问题1：</strong> 有了连接池之后，获取连接是从连接池获取，没有足够连接时连接池会创建连接。这时，获取连接操作往往有两个超时时间：一个是从连接池获取连接的最长等待时间，通常叫作请求连接超时connectRequestTimeout，或连接等待超时connectWaitTimeout；一个是连接池新建TCP连接三次握手的连接超时，通常叫作连接超时connectTimeout。针对JedisPool、Apache HttpClient和Hikari数据库连接池，你知道如何设置这2个参数吗？</p><p>答：假设我们希望设置连接超时5s、请求连接超时10s，下面我来演示下，如何配置Hikari、Jedis和HttpClient的两个超时参数。</p><p>针对Hikari，设置两个超时时间的方式，是修改数据库连接字符串中的connectTimeout属性和配置文件中的hikari配置的connection-timeout：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.datasource.hikari.connection-timeout=10000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>spring.datasource.url=jdbc:mysql://localhost:6657/common_mistakes?connectTimeout=5000&amp;characterEncoding=UTF-8&amp;useSSL=false&amp;rewriteBatchedStatements=true</span></span></code></pre></div><p>针对Jedis，是设置JedisPoolConfig的MaxWaitMillis属性和设置创建JedisPool时的timeout属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>JedisPoolConfig config = new JedisPoolConfig();</span></span>
<span class="line"><span>config.setMaxWaitMillis(10000);</span></span>
<span class="line"><span>try (JedisPool jedisPool = new JedisPool(config, &quot;127.0.0.1&quot;, 6379, 5000);</span></span>
<span class="line"><span>     Jedis jedis = jedisPool.getResource()) {</span></span>
<span class="line"><span>    return jedis.set(&quot;test&quot;, &quot;test&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>针对HttpClient，是设置RequestConfig的ConnectionRequestTimeout和ConnectTimeout属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RequestConfig requestConfig = RequestConfig.custom()</span></span>
<span class="line"><span>        .setConnectTimeout(5000)</span></span>
<span class="line"><span>        .setConnectionRequestTimeout(10000)</span></span>
<span class="line"><span>        .build();</span></span>
<span class="line"><span>HttpGet httpGet = new HttpGet(&quot;http://127.0.0.1:45678/twotimeoutconfig/test&quot;);</span></span>
<span class="line"><span>httpGet.setConfig(requestConfig);</span></span>
<span class="line"><span>try (CloseableHttpResponse response = httpClient.execute(httpGet)) {</span></span>
<span class="line"><span>    return EntityUtils.toString(response.getEntity());</span></span>
<span class="line"><span>} catch (Exception ex) {</span></span>
<span class="line"><span>    ex.printStackTrace();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return null;</span></span></code></pre></div><p>也可以直接参考我放在 <a href="https://github.com/JosephZhu1983/java-common-mistakes/tree/master/src/main/java/org/geekbang/time/commonmistakes/connectionpool/twotimeoutconfig" target="_blank" rel="noreferrer">GitHub</a> 上的源码。</p><p><strong>问题2：</strong> 对于带有连接池的SDK的使用姿势，最主要的是鉴别其内部是否实现了连接池，如果实现了连接池要尽量复用Client。对于NoSQL中的MongoDB来说，使用MongoDB Java驱动时，MongoClient类应该是每次都创建还是复用呢？你能否在 <a href="https://mongodb.github.io/mongo-java-driver/3.12/" target="_blank" rel="noreferrer">官方文档</a> 中找到答案呢？</p><p>答：官方文档里有这么一段话：</p><blockquote><p>Typically you only create one MongoClient instance for a given MongoDB deployment (e.g. standalone, replica set, or a sharded cluster) and use it across your application. However, if you do create multiple instances:</p><p>All resource usage limits (e.g. max connections, etc.) apply per MongoClient instance.</p><p>To dispose of an instance, call MongoClient.close() to clean up resources.</p></blockquote><p>MongoClient类应该尽可能复用（一个MongoDB部署只使用一个MongoClient），不过复用不等于在任何情况下就只用一个。正如文档里所说，每一个MongoClient示例有自己独立的资源限制。</p><h3 id="_05-http调用-你考虑到超时、重试、并发了吗" tabindex="-1"><a href="https://time.geekbang.org/column/article/213273" target="_blank" rel="noreferrer">05 | HTTP调用：你考虑到超时、重试、并发了吗？</a> <a class="header-anchor" href="#_05-http调用-你考虑到超时、重试、并发了吗" aria-label="Permalink to &quot;[05 \\| HTTP调用：你考虑到超时、重试、并发了吗？](https://time.geekbang.org/column/article/213273)&quot;">​</a></h3><p><strong>问题1：</strong> 在“配置连接超时和读取超时参数的学问”这一节中，我们强调了要注意连接超时和读取超时参数的配置，大多数的HTTP客户端也都有这两个参数。有读就有写，但为什么我们很少看到“写入超时”的概念呢？</p><p>答：其实写入操作只是将数据写入TCP的发送缓冲区，已经发送到网络的数据依然需要暂存在发送缓冲区中，只有收到对方的ack后，操作系统内核才从缓冲区中清除这一部分数据，为后续发送数据腾出空间。</p><p>如果接收端从socket读取数据的速度太慢，可能会导致发送端发送缓冲区满，导致写入操作阻塞，产生写入超时。但是，因为有滑动窗口的控制，通常不太容易发生发送缓冲区满导致写入超时的情况。相反，读取超时包含了服务端处理数据执行业务逻辑的时间，所以读取超时是比较容易发生的。</p><p>这也就是为什么我们一般都会比较重视读取超时而不是写入超时的原因了。</p><p><strong>问题2：</strong> 除了Ribbon的AutoRetriesNextServer重试机制，Nginx也有类似的重试功能。你了解Nginx相关的配置吗？</p><p>答：关于Nginx的重试功能，你可以参考 <a href="http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream" target="_blank" rel="noreferrer">这里</a>，了解下Nginx的proxy_next_upstream配置。</p><p>proxy_next_upstream，用于指定在什么情况下Nginx会将请求转移到其他服务器上。其默认值是proxy_next_upstream error timeout，即发生网络错误以及超时，才会重试其他服务器。也就是说，默认情况下，服务返回500状态码是不会重试的。</p><p>如果我们想在请求返回500状态码时也进行重试，可以配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>proxy_next_upstream error timeout http_500;</span></span></code></pre></div><p>需要注意的是，proxy_next_upstream配置中有一个选项non_idempotent，一定要小心开启。通常情况下，如果请求使用非等幂方法（POST、PATCH），请求失败后不会再到其他服务器进行重试。但是，加上non_idempotent这个选项后，即使是非幂等请求类型（例如POST请求），发生错误后也会重试。</p><h3 id="_06-20-的业务代码的spring声明式事务-可能都没处理正确" tabindex="-1"><a href="https://time.geekbang.org/column/article/213295" target="_blank" rel="noreferrer">06 | 20%的业务代码的Spring声明式事务，可能都没处理正确</a> <a class="header-anchor" href="#_06-20-的业务代码的spring声明式事务-可能都没处理正确" aria-label="Permalink to &quot;[06 \\| 20%的业务代码的Spring声明式事务，可能都没处理正确](https://time.geekbang.org/column/article/213295)&quot;">​</a></h3><p><strong>问题1：</strong> 考虑到Demo的简洁，这一讲中所有数据访问使用的都是Spring Data JPA。国内大多数互联网业务项目是使用MyBatis进行数据访问的，使用MyBatis配合Spring的声明式事务也同样需要注意这一讲中提到的这些点。你可以尝试把今天的Demo改为MyBatis做数据访问实现，看看日志中是否可以体现出这些坑？</p><p>答：使用mybatis-spring-boot-starter无需做任何配置，即可使MyBatis整合Spring的声明式事务。在GitHub上的课程 <a href="https://github.com/JosephZhu1983/java-common-mistakes/tree/master/src/main/java/org/geekbang/time/commonmistakes/transaction/nested" target="_blank" rel="noreferrer">源码</a> 中，我更新了一个使用MyBatis配套嵌套事务的例子，实现的效果是主方法出现异常，子方法的嵌套事务也会回滚。</p><p>我来和你解释下这个例子中的核心代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional</span></span>
<span class="line"><span>public void createUser(String name) {</span></span>
<span class="line"><span>    createMainUser(name);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        subUserService.createSubUser(name);</span></span>
<span class="line"><span>    } catch (Exception ex) {</span></span>
<span class="line"><span>        log.error(&quot;create sub user error:{}&quot;, ex.getMessage());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果createSubUser是NESTED模式，这里抛出异常会导致嵌套事务无法“提交”</span></span>
<span class="line"><span>    throw new RuntimeException(&quot;create main user error&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>子方法使用了NESTED事务传播模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional(propagation = Propagation.NESTED)</span></span>
<span class="line"><span>public void createSubUser(String name) {</span></span>
<span class="line"><span>    userDataMapper.insert(name, &quot;sub&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行日志如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/260695/cda8d69f99c0063046a085a39d520c0e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/260695/cda8d69f99c0063046a085a39d520c0e.png" alt=""></a></p><p>每个NESTED事务执行前，会将当前操作保存下来，叫做savepoint（保存点）。NESTED事务在外部事务提交以后自己才会提交，如果当前NESTED事务执行失败，则回滚到之前的保存点。</p><p><strong>问题2：</strong> 在讲“小心 Spring 的事务可能没有生效”时我们提到，如果要针对private方法启用事务，动态代理方式的AOP不可行，需要使用静态织入方式的AOP，也就是在编译期间织入事务增强代码，可以配置Spring框架使用AspectJ来实现AOP。你能否参阅Spring的文档“ <a href="https://docs.spring.io/spring/docs/current/spring-framework-reference/data-access.html#transaction-declarative-aspectj" target="_blank" rel="noreferrer">Using @Transactional with AspectJ</a>”试试呢？注意：AspectJ配合lombok使用，还可能会踩一些坑。</p><p>答：我们需要加入aspectj的依赖和配置aspectj-maven-plugin插件，并且需要设置Spring开启AspectJ事务管理模式。具体的实现方式，包括如下4步。</p><p>第一步，引入spring-aspects依赖：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.springframework&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;spring-aspects&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>第二步，加入lombok和aspectj插件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;plugin&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.projectlombok&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;lombok-maven-plugin&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;version&amp;gt;1.18.0.0&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;executions&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;execution&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;phase&amp;gt;generate-sources&amp;lt;/phase&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;goals&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;goal&amp;gt;delombok&amp;lt;/goal&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/goals&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/execution&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/executions&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;addOutputDirectory&amp;gt;false&amp;lt;/addOutputDirectory&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;sourceDirectory&amp;gt;src/main/java&amp;lt;/sourceDirectory&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/configuration&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/plugin&amp;gt;</span></span>
<span class="line"><span>&amp;lt;plugin&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.codehaus.mojo&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;aspectj-maven-plugin&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;version&amp;gt;1.10&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;complianceLevel&amp;gt;1.8&amp;lt;/complianceLevel&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;source&amp;gt;1.8&amp;lt;/source&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;aspectLibraries&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;aspectLibrary&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;groupId&amp;gt;org.springframework&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;artifactId&amp;gt;spring-aspects&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/aspectLibrary&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/aspectLibraries&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/configuration&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;executions&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;execution&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;goals&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;goal&amp;gt;compile&amp;lt;/goal&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;goal&amp;gt;test-compile&amp;lt;/goal&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/goals&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/execution&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/executions&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/plugin&amp;gt;</span></span></code></pre></div><p>使用delombok插件的目的是，把代码中的Lombok注解先编译为代码，这样AspectJ编译不会有问题，同时需要设置中的sourceDirectory为delombok目录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;sourceDirectory&amp;gt;\${project.build.directory}/generated-sources/delombok&amp;lt;/sourceDirectory&amp;gt;</span></span></code></pre></div><p>第三步，设置@EnableTransactionManagement注解，开启事务管理走AspectJ模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;SpringBootApplication</span></span>
<span class="line"><span>&amp;#64;EnableTransactionManagement(mode = AdviceMode.ASPECTJ)</span></span>
<span class="line"><span>public class CommonMistakesApplication {</span></span></code></pre></div><p>第四步，使用Maven编译项目，编译后查看createUserPrivate方法的源码，可以发现AspectJ帮我们做编译时织入（Compile Time Weaving）：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/260695/11da9146b324e47fcd96631d47db961d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/260695/11da9146b324e47fcd96631d47db961d.png" alt=""></a></p><p>运行程序，观察日志可以发现createUserPrivate（私有）方法同样应用了事务，出异常后事务回滚：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[14:21:39.155] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:370 ] - Creating new transaction with name [org.geekbang.time.commonmistakes.transaction.transactionproxyfailed.UserService.createUserPrivate]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT</span></span>
<span class="line"><span>[14:21:39.155] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:393 ] - Opened new EntityManager [SessionImpl(1087443072&amp;lt;open&amp;gt;)] for JPA transaction</span></span>
<span class="line"><span>[14:21:39.158] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:421 ] - Exposing JPA transaction as JDBC [org.springframework.orm.jpa.vendor.HibernateJpaDialect$HibernateConnectionHandle&amp;#64;4e16e6ea]</span></span>
<span class="line"><span>[14:21:39.159] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:356 ] - Found thread-bound EntityManager [SessionImpl(1087443072&amp;lt;open&amp;gt;)] for JPA transaction</span></span>
<span class="line"><span>[14:21:39.159] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:471 ] - Participating in existing transaction</span></span>
<span class="line"><span>[14:21:39.173] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:834 ] - Initiating transaction rollback</span></span>
<span class="line"><span>[14:21:39.173] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:555 ] - Rolling back JPA transaction on EntityManager [SessionImpl(1087443072&amp;lt;open&amp;gt;)]</span></span>
<span class="line"><span>[14:21:39.176] [http-nio-45678-exec-2] [DEBUG] [o.s.orm.jpa.JpaTransactionManager:620 ] - Closing JPA EntityManager [SessionImpl(1087443072&amp;lt;open&amp;gt;)] after transaction</span></span>
<span class="line"><span>[14:21:39.176] [http-nio-45678-exec-2] [ERROR] [o.g.t.c.t.t.UserService:28  ] - create user failed because invalid username!</span></span>
<span class="line"><span>[14:21:39.177] [http-nio-45678-exec-2] [DEBUG] [o.s.o.j.SharedEntityManagerCreator$SharedEntityManagerInvocationHandler:305 ] - Creating new EntityManager for shared EntityManager invocation</span></span></code></pre></div><p>以上，就是咱们这门课前6讲的思考题答案了。</p><p>关于这些题目，以及背后涉及的知识点，如果你还有哪里感觉不清楚的，欢迎在评论区与我留言，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,95)])])}const u=n(t,[["render",l]]);export{d as __pageData,u as default};
