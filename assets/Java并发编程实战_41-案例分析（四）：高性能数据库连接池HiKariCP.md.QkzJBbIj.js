import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"41 | 案例分析（四）：高性能数据库连接池HiKariCP","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是数据库连接池","slug":"什么是数据库连接池","link":"#什么是数据库连接池","children":[]},{"level":2,"title":"FastList解决了哪些性能问题","slug":"fastlist解决了哪些性能问题","link":"#fastlist解决了哪些性能问题","children":[]},{"level":2,"title":"ConcurrentBag解决了哪些性能问题","slug":"concurrentbag解决了哪些性能问题","link":"#concurrentbag解决了哪些性能问题","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"Java并发编程实战/41-案例分析（四）：高性能数据库连接池HiKariCP.md","filePath":"Java并发编程实战/41-案例分析（四）：高性能数据库连接池HiKariCP.md","lastUpdated":1779815850000}'),t={name:"Java并发编程实战/41-案例分析（四）：高性能数据库连接池HiKariCP.md"};function i(l,n,c,r,o,d){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_41-案例分析-四-高性能数据库连接池hikaricp" tabindex="-1">41 | 案例分析（四）：高性能数据库连接池HiKariCP <a class="header-anchor" href="#_41-案例分析-四-高性能数据库连接池hikaricp" aria-label="Permalink to &quot;41 | 案例分析（四）：高性能数据库连接池HiKariCP&quot;">​</a></h1><p>实际工作中，我们总会难免和数据库打交道；只要和数据库打交道，就免不了使用数据库连接池。业界知名的数据库连接池有不少，例如c3p0、DBCP、Tomcat JDBC Connection Pool、Druid等，不过最近最火的是HiKariCP。</p><p><strong>HiKariCP号称是业界跑得最快的数据库连接池</strong>，这两年发展得顺风顺水，尤其是Springboot 2.0将其作为 <strong>默认数据库连接池</strong> 后，江湖一哥的地位已是毋庸置疑了。那它为什么那么快呢？今天咱们就重点聊聊这个话题。</p><h2 id="什么是数据库连接池" tabindex="-1">什么是数据库连接池 <a class="header-anchor" href="#什么是数据库连接池" aria-label="Permalink to &quot;什么是数据库连接池&quot;">​</a></h2><p>在详细分析HiKariCP高性能之前，我们有必要先简单介绍一下什么是数据库连接池。本质上，数据库连接池和线程池一样，都属于池化资源，作用都是避免重量级资源的频繁创建和销毁，对于数据库连接池来说，也就是避免数据库连接频繁创建和销毁。如下图所示，服务端会在运行期持有一定数量的数据库连接，当需要执行SQL时，并不是直接创建一个数据库连接，而是从连接池中获取一个；当SQL执行完，也并不是将数据库连接真的关掉，而是将其归还到连接池中。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/98491/0b106876824e43d11750334e86556519.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/98491/0b106876824e43d11750334e86556519.png" alt=""></a></p><p>数据库连接池示意图</p><p>在实际工作中，我们都是使用各种持久化框架来完成数据库的增删改查，基本上不会直接和数据库连接池打交道，为了能让你更好地理解数据库连接池的工作原理，下面的示例代码并没有使用任何框架，而是原生地使用HiKariCP。执行数据库操作基本上是一系列规范化的步骤：</p><ol><li>通过数据源获取一个数据库连接；</li><li>创建Statement；</li><li>执行SQL；</li><li>通过ResultSet获取SQL执行结果；</li><li>释放ResultSet；</li><li>释放Statement；</li><li>释放数据库连接。</li></ol><p>下面的示例代码，通过 <code>ds.getConnection()</code> 获取一个数据库连接时，其实是向数据库连接池申请一个数据库连接，而不是创建一个新的数据库连接。同样，通过 <code>conn.close()</code> 释放一个数据库连接时，也不是直接将连接关闭，而是将连接归还给数据库连接池。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//数据库连接池配置</span></span>
<span class="line"><span>HikariConfig config = new HikariConfig();</span></span>
<span class="line"><span>config.setMinimumIdle(1);</span></span>
<span class="line"><span>config.setMaximumPoolSize(2);</span></span>
<span class="line"><span>config.setConnectionTestQuery(&quot;SELECT 1&quot;);</span></span>
<span class="line"><span>config.setDataSourceClassName(&quot;org.h2.jdbcx.JdbcDataSource&quot;);</span></span>
<span class="line"><span>config.addDataSourceProperty(&quot;url&quot;, &quot;jdbc:h2:mem:test&quot;);</span></span>
<span class="line"><span>// 创建数据源</span></span>
<span class="line"><span>DataSource ds = new HikariDataSource(config);</span></span>
<span class="line"><span>Connection conn = null;</span></span>
<span class="line"><span>Statement stmt = null;</span></span>
<span class="line"><span>ResultSet rs = null;</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  // 获取数据库连接</span></span>
<span class="line"><span>  conn = ds.getConnection();</span></span>
<span class="line"><span>  // 创建Statement</span></span>
<span class="line"><span>  stmt = conn.createStatement();</span></span>
<span class="line"><span>  // 执行SQL</span></span>
<span class="line"><span>  rs = stmt.executeQuery(&quot;select * from abc&quot;);</span></span>
<span class="line"><span>  // 获取结果</span></span>
<span class="line"><span>  while (rs.next()) {</span></span>
<span class="line"><span>    int id = rs.getInt(1);</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>} catch(Exception e) {</span></span>
<span class="line"><span>   e.printStackTrace();</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  //关闭ResultSet</span></span>
<span class="line"><span>  close(rs);</span></span>
<span class="line"><span>  //关闭Statement</span></span>
<span class="line"><span>  close(stmt);</span></span>
<span class="line"><span>  //关闭Connection</span></span>
<span class="line"><span>  close(conn);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//关闭资源</span></span>
<span class="line"><span>void close(AutoCloseable rs) {</span></span>
<span class="line"><span>  if (rs != null) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      rs.close();</span></span>
<span class="line"><span>    } catch (SQLException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a href="https://github.com/brettwooldridge/HikariCP/wiki/Down-the-Rabbit-Hole" target="_blank" rel="noreferrer">HiKariCP官方网站</a> 解释了其性能之所以如此之高的秘密。微观上HiKariCP程序编译出的字节码执行效率更高，站在字节码的角度去优化Java代码，HiKariCP的作者对性能的执着可见一斑，不过遗憾的是他并没有详细解释都做了哪些优化。而宏观上主要是和两个数据结构有关，一个是FastList，另一个是ConcurrentBag。下面我们来看看它们是如何提升HiKariCP的性能的。</p><h2 id="fastlist解决了哪些性能问题" tabindex="-1">FastList解决了哪些性能问题 <a class="header-anchor" href="#fastlist解决了哪些性能问题" aria-label="Permalink to &quot;FastList解决了哪些性能问题&quot;">​</a></h2><p>按照规范步骤，执行完数据库操作之后，需要依次关闭ResultSet、Statement、Connection，但是总有粗心的同学只是关闭了Connection，而忘了关闭ResultSet和Statement。为了解决这种问题，最好的办法是当关闭Connection时，能够自动关闭Statement。为了达到这个目标，Connection就需要跟踪创建的Statement，最简单的办法就是将创建的Statement保存在数组ArrayList里，这样当关闭Connection的时候，就可以依次将数组中的所有Statement关闭。</p><p>HiKariCP觉得用ArrayList还是太慢，当通过 <code>conn.createStatement()</code> 创建一个Statement时，需要调用ArrayList的add()方法加入到ArrayList中，这个是没有问题的；但是当通过 <code>stmt.close()</code> 关闭Statement的时候，需要调用 ArrayList的remove()方法来将其从ArrayList中删除，这里是有优化余地的。</p><p>假设一个Connection依次创建6个Statement，分别是S1、S2、S3、S4、S5、S6，按照正常的编码习惯，关闭Statement的顺序一般是逆序的，关闭的顺序是：S6、S5、S4、S3、S2、S1，而ArrayList的remove(Object o)方法是顺序遍历查找，逆序删除而顺序查找，这样的查找效率就太慢了。如何优化呢？很简单，优化成逆序查找就可以了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/98491/4b5e2ef70e46b087b139b331578a82a6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/98491/4b5e2ef70e46b087b139b331578a82a6.png" alt=""></a></p><p>逆序删除示意图</p><p>HiKariCP中的FastList相对于ArrayList的一个优化点就是将 <code>remove(Object element)</code> 方法的 <strong>查找顺序变成了逆序查找</strong>。除此之外，FastList还有另一个优化点，是 <code>get(int index)</code> 方法没有对index参数进行越界检查，HiKariCP能保证不会越界，所以不用每次都进行越界检查。</p><p>整体来看，FastList的优化点还是很简单的。下面我们再来聊聊HiKariCP中的另外一个数据结构ConcurrentBag，看看它又是如何提升性能的。</p><h2 id="concurrentbag解决了哪些性能问题" tabindex="-1">ConcurrentBag解决了哪些性能问题 <a class="header-anchor" href="#concurrentbag解决了哪些性能问题" aria-label="Permalink to &quot;ConcurrentBag解决了哪些性能问题&quot;">​</a></h2><p>如果让我们自己来实现一个数据库连接池，最简单的办法就是用两个阻塞队列来实现，一个用于保存空闲数据库连接的队列idle，另一个用于保存忙碌数据库连接的队列busy；获取连接时将空闲的数据库连接从idle队列移动到busy队列，而关闭连接时将数据库连接从busy移动到idle。这种方案将并发问题委托给了阻塞队列，实现简单，但是性能并不是很理想。因为Java SDK中的阻塞队列是用锁实现的，而高并发场景下锁的争用对性能影响很大。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//忙碌队列</span></span>
<span class="line"><span>BlockingQueue&amp;lt;Connection&amp;gt; busy;</span></span>
<span class="line"><span>//空闲队列</span></span>
<span class="line"><span>BlockingQueue&amp;lt;Connection&amp;gt; idle;</span></span></code></pre></div><p>HiKariCP并没有使用Java SDK中的阻塞队列，而是自己实现了一个叫做ConcurrentBag的并发容器。ConcurrentBag的设计最初源自C#，它的一个核心设计是使用ThreadLocal避免部分并发问题，不过HiKariCP中的ConcurrentBag并没有完全参考C#的实现，下面我们来看看它是如何实现的。</p><p>ConcurrentBag中最关键的属性有4个，分别是：用于存储所有的数据库连接的共享队列sharedList、线程本地存储threadList、等待数据库连接的线程数waiters以及分配数据库连接的工具handoffQueue。其中，handoffQueue用的是Java SDK提供的SynchronousQueue，SynchronousQueue主要用于线程之间传递数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//用于存储所有的数据库连接</span></span>
<span class="line"><span>CopyOnWriteArrayList&amp;lt;T&amp;gt; sharedList;</span></span>
<span class="line"><span>//线程本地存储中的数据库连接</span></span>
<span class="line"><span>ThreadLocal&amp;lt;List&amp;lt;Object&amp;gt;&amp;gt; threadList;</span></span>
<span class="line"><span>//等待数据库连接的线程数</span></span>
<span class="line"><span>AtomicInteger waiters;</span></span>
<span class="line"><span>//分配数据库连接的工具</span></span>
<span class="line"><span>SynchronousQueue&amp;lt;T&amp;gt; handoffQueue;</span></span></code></pre></div><p>当线程池创建了一个数据库连接时，通过调用ConcurrentBag的add()方法加入到ConcurrentBag中，下面是add()方法的具体实现，逻辑很简单，就是将这个连接加入到共享队列sharedList中，如果此时有线程在等待数据库连接，那么就通过handoffQueue将这个连接分配给等待的线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//将空闲连接添加到队列</span></span>
<span class="line"><span>void add(final T bagEntry){</span></span>
<span class="line"><span>  //加入共享队列</span></span>
<span class="line"><span>  sharedList.add(bagEntry);</span></span>
<span class="line"><span>  //如果有等待连接的线程，</span></span>
<span class="line"><span>  //则通过handoffQueue直接分配给等待的线程</span></span>
<span class="line"><span>  while (waiters.get() &amp;gt; 0</span></span>
<span class="line"><span>    &amp;&amp; bagEntry.getState() == STATE_NOT_IN_USE</span></span>
<span class="line"><span>    &amp;&amp; !handoffQueue.offer(bagEntry)) {</span></span>
<span class="line"><span>      yield();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过ConcurrentBag提供的borrow()方法，可以获取一个空闲的数据库连接，borrow()的主要逻辑是：</p><ol><li>首先查看线程本地存储是否有空闲连接，如果有，则返回一个空闲的连接；</li><li>如果线程本地存储中无空闲连接，则从共享队列中获取。</li><li>如果共享队列中也没有空闲的连接，则请求线程需要等待。</li></ol><p>需要注意的是，线程本地存储中的连接是可以被其他线程窃取的，所以需要用CAS方法防止重复分配。在共享队列中获取空闲连接，也采用了CAS方法防止重复分配。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>T borrow(long timeout, final TimeUnit timeUnit){</span></span>
<span class="line"><span>  // 先查看线程本地存储是否有空闲连接</span></span>
<span class="line"><span>  final List&amp;lt;Object&amp;gt; list = threadList.get();</span></span>
<span class="line"><span>  for (int i = list.size() - 1; i &amp;gt;= 0; i--) {</span></span>
<span class="line"><span>    final Object entry = list.remove(i);</span></span>
<span class="line"><span>    final T bagEntry = weakThreadLocals</span></span>
<span class="line"><span>      ? ((WeakReference&amp;lt;T&amp;gt;) entry).get()</span></span>
<span class="line"><span>      : (T) entry;</span></span>
<span class="line"><span>    //线程本地存储中的连接也可以被窃取，</span></span>
<span class="line"><span>    //所以需要用CAS方法防止重复分配</span></span>
<span class="line"><span>    if (bagEntry != null</span></span>
<span class="line"><span>      &amp;&amp; bagEntry.compareAndSet(STATE_NOT_IN_USE, STATE_IN_USE)) {</span></span>
<span class="line"><span>      return bagEntry;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 线程本地存储中无空闲连接，则从共享队列中获取</span></span>
<span class="line"><span>  final int waiting = waiters.incrementAndGet();</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    for (T bagEntry : sharedList) {</span></span>
<span class="line"><span>      //如果共享队列中有空闲连接，则返回</span></span>
<span class="line"><span>      if (bagEntry.compareAndSet(STATE_NOT_IN_USE, STATE_IN_USE)) {</span></span>
<span class="line"><span>        return bagEntry;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //共享队列中没有连接，则需要等待</span></span>
<span class="line"><span>    timeout = timeUnit.toNanos(timeout);</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>      final long start = currentTime();</span></span>
<span class="line"><span>      final T bagEntry = handoffQueue.poll(timeout, NANOSECONDS);</span></span>
<span class="line"><span>      if (bagEntry == null</span></span>
<span class="line"><span>        || bagEntry.compareAndSet(STATE_NOT_IN_USE, STATE_IN_USE)) {</span></span>
<span class="line"><span>          return bagEntry;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //重新计算等待时间</span></span>
<span class="line"><span>      timeout -= elapsedNanos(start);</span></span>
<span class="line"><span>    } while (timeout &amp;gt; 10_000);</span></span>
<span class="line"><span>    //超时没有获取到连接，返回null</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    waiters.decrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>释放连接需要调用ConcurrentBag提供的requite()方法，该方法的逻辑很简单，首先将数据库连接状态更改为STATE_NOT_IN_USE，之后查看是否存在等待线程，如果有，则分配给等待线程；如果没有，则将该数据库连接保存到线程本地存储里。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//释放连接</span></span>
<span class="line"><span>void requite(final T bagEntry){</span></span>
<span class="line"><span>  //更新连接状态</span></span>
<span class="line"><span>  bagEntry.setState(STATE_NOT_IN_USE);</span></span>
<span class="line"><span>  //如果有等待的线程，则直接分配给线程，无需进入任何队列</span></span>
<span class="line"><span>  for (int i = 0; waiters.get() &amp;gt; 0; i++) {</span></span>
<span class="line"><span>    if (bagEntry.getState() != STATE_NOT_IN_USE</span></span>
<span class="line"><span>      || handoffQueue.offer(bagEntry)) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    } else if ((i &amp; 0xff) == 0xff) {</span></span>
<span class="line"><span>      parkNanos(MICROSECONDS.toNanos(10));</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      yield();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //如果没有等待的线程，则进入线程本地存储</span></span>
<span class="line"><span>  final List&amp;lt;Object&amp;gt; threadLocalList = threadList.get();</span></span>
<span class="line"><span>  if (threadLocalList.size() &amp;lt; 50) {</span></span>
<span class="line"><span>    threadLocalList.add(weakThreadLocals</span></span>
<span class="line"><span>      ? new WeakReference&amp;lt;&amp;gt;(bagEntry)</span></span>
<span class="line"><span>      : bagEntry);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>HiKariCP中的FastList和ConcurrentBag这两个数据结构使用得非常巧妙，虽然实现起来并不复杂，但是对于性能的提升非常明显，根本原因在于这两个数据结构适用于数据库连接池这个特定的场景。FastList适用于逆序删除场景；而ConcurrentBag通过ThreadLocal做一次预分配，避免直接竞争共享资源，非常适合池化资源的分配。</p><p>在实际工作中，我们遇到的并发问题千差万别，这时选择合适的并发数据结构就非常重要了。当然能选对的前提是对特定场景的并发特性有深入的了解，只有了解到无谓的性能消耗在哪里，才能对症下药。</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,38)])])}const h=a(t,[["render",i]]);export{g as __pageData,h as default};
