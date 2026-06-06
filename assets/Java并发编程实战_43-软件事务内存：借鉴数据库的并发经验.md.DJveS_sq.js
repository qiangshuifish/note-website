import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"43 | 软件事务内存：借鉴数据库的并发经验","description":"","frontmatter":{},"headers":[{"level":2,"title":"用STM实现转账","slug":"用stm实现转账","link":"#用stm实现转账","children":[]},{"level":2,"title":"自己实现STM","slug":"自己实现stm","link":"#自己实现stm","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"Java并发编程实战/43-软件事务内存：借鉴数据库的并发经验.md","filePath":"Java并发编程实战/43-软件事务内存：借鉴数据库的并发经验.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/43-软件事务内存：借鉴数据库的并发经验.md"};function i(t,n,c,r,o,m){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_43-软件事务内存-借鉴数据库的并发经验" tabindex="-1">43 | 软件事务内存：借鉴数据库的并发经验 <a class="header-anchor" href="#_43-软件事务内存-借鉴数据库的并发经验" aria-label="Permalink to &quot;43 | 软件事务内存：借鉴数据库的并发经验&quot;">​</a></h1><p>很多同学反馈说，工作了挺长时间但是没有机会接触并发编程，实际上我们天天都在写并发程序，只不过并发相关的问题都被类似Tomcat这样的Web服务器以及MySQL这样的数据库解决了。尤其是数据库，在解决并发问题方面，可谓成绩斐然，它的 <strong>事务机制非常简单易用</strong>，能甩Java里面的锁、原子类十条街。技术无边界，很显然要借鉴一下。</p><p>其实很多编程语言都有从数据库的事务管理中获得灵感，并且总结出了一个新的并发解决方案： <strong>软件事务内存（Software Transactional Memory，简称STM）</strong>。传统的数据库事务，支持4个特性：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）和持久性（Durability），也就是大家常说的ACID，STM由于不涉及到持久化，所以只支持ACI。</p><p>STM的使用很简单，下面我们以经典的转账操作为例，看看用STM该如何实现。</p><h2 id="用stm实现转账" tabindex="-1">用STM实现转账 <a class="header-anchor" href="#用stm实现转账" aria-label="Permalink to &quot;用STM实现转账&quot;">​</a></h2><p>我们曾经在 <a href="https://time.geekbang.org/column/article/85001" target="_blank" rel="noreferrer">《05 | 一不小心就死锁了，怎么办？》</a> 这篇文章中，讲到了并发转账的例子，示例代码如下。简单地使用 synchronized 将 transfer() 方法变成同步方法并不能解决并发问题，因为还存在死锁问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class UnsafeAccount {</span></span>
<span class="line"><span>  //余额</span></span>
<span class="line"><span>  private long balance;</span></span>
<span class="line"><span>  //构造函数</span></span>
<span class="line"><span>  public UnsafeAccount(long balance) {</span></span>
<span class="line"><span>    this.balance = balance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //转账</span></span>
<span class="line"><span>  void transfer(UnsafeAccount target, long amt){</span></span>
<span class="line"><span>    if (this.balance &amp;gt; amt) {</span></span>
<span class="line"><span>      this.balance -= amt;</span></span>
<span class="line"><span>      target.balance += amt;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该转账操作若使用数据库事务就会非常简单，如下面的示例代码所示。如果所有SQL都正常执行，则通过 commit() 方法提交事务；如果SQL在执行过程中有异常，则通过 rollback() 方法回滚事务。数据库保证在并发情况下不会有死锁，而且还能保证前面我们说的原子性、一致性、隔离性和持久性，也就是ACID。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Connection conn = null;</span></span>
<span class="line"><span>try{</span></span>
<span class="line"><span>  //获取数据库连接</span></span>
<span class="line"><span>  conn = DriverManager.getConnection();</span></span>
<span class="line"><span>  //设置手动提交事务</span></span>
<span class="line"><span>  conn.setAutoCommit(false);</span></span>
<span class="line"><span>  //执行转账SQL</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  //提交事务</span></span>
<span class="line"><span>  conn.commit();</span></span>
<span class="line"><span>} catch (Exception e) {</span></span>
<span class="line"><span>  //出现异常回滚事务</span></span>
<span class="line"><span>  conn.rollback();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那如果用STM又该如何实现呢？Java语言并不支持STM，不过可以借助第三方的类库来支持， <a href="https://github.com/pveentjer/Multiverse" target="_blank" rel="noreferrer">Multiverse</a> 就是个不错的选择。下面的示例代码就是借助Multiverse实现了线程安全的转账操作，相比较上面线程不安全的UnsafeAccount，其改动并不大，仅仅是将余额的类型从 long 变成了 TxnLong ，将转账的操作放到了 atomic(()-&gt;{}) 中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Account{</span></span>
<span class="line"><span>  //余额</span></span>
<span class="line"><span>  private TxnLong balance;</span></span>
<span class="line"><span>  //构造函数</span></span>
<span class="line"><span>  public Account(long balance){</span></span>
<span class="line"><span>    this.balance = StmUtils.newTxnLong(balance);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //转账</span></span>
<span class="line"><span>  public void transfer(Account to, int amt){</span></span>
<span class="line"><span>    //原子化操作</span></span>
<span class="line"><span>    atomic(()-&amp;gt;{</span></span>
<span class="line"><span>      if (this.balance.get() &amp;gt; amt) {</span></span>
<span class="line"><span>        this.balance.decrement(amt);</span></span>
<span class="line"><span>        to.balance.increment(amt);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一个关键的atomic()方法就把并发问题解决了，这个方案看上去比传统的方案的确简单了很多，那它是如何实现的呢？数据库事务发展了几十年了，目前被广泛使用的是 <strong>MVCC</strong>（全称是Multi-Version Concurrency Control），也就是多版本并发控制。</p><p>MVCC可以简单地理解为数据库事务在开启的时候，会给数据库打一个快照，以后所有的读写都是基于这个快照的。当提交事务的时候，如果所有读写过的数据在该事务执行期间没有发生过变化，那么就可以提交；如果发生了变化，说明该事务和有其他事务读写的数据冲突了，这个时候是不可以提交的。</p><p>为了记录数据是否发生了变化，可以给每条数据增加一个版本号，这样每次成功修改数据都会增加版本号的值。MVCC的工作原理和我们曾经在 <a href="https://time.geekbang.org/column/article/89456" target="_blank" rel="noreferrer">《18 | StampedLock：有没有比读写锁更快的锁？》</a> 中提到的乐观锁非常相似。有不少STM的实现方案都是基于MVCC的，例如知名的Clojure STM。</p><p>下面我们就用最简单的代码基于MVCC实现一个简版的STM，这样你会对STM以及MVCC的工作原理有更深入的认识。</p><h2 id="自己实现stm" tabindex="-1">自己实现STM <a class="header-anchor" href="#自己实现stm" aria-label="Permalink to &quot;自己实现STM&quot;">​</a></h2><p>我们首先要做的，就是让Java中的对象有版本号，在下面的示例代码中，VersionedRef这个类的作用就是将对象value包装成带版本号的对象。按照MVCC理论，数据的每一次修改都对应着一个唯一的版本号，所以不存在仅仅改变value或者version的情况，用不变性模式就可以很好地解决这个问题，所以VersionedRef这个类被我们设计成了不可变的。</p><p>所有对数据的读写操作，一定是在一个事务里面，TxnRef这个类负责完成事务内的读写操作，读写操作委托给了接口Txn，Txn代表的是读写操作所在的当前事务， 内部持有的curRef代表的是系统中的最新值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//带版本号的对象引用</span></span>
<span class="line"><span>public final class VersionedRef&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span>  final T value;</span></span>
<span class="line"><span>  final long version;</span></span>
<span class="line"><span>  //构造方法</span></span>
<span class="line"><span>  public VersionedRef(T value, long version) {</span></span>
<span class="line"><span>    this.value = value;</span></span>
<span class="line"><span>    this.version = version;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//支持事务的引用</span></span>
<span class="line"><span>public class TxnRef&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span>  //当前数据，带版本号</span></span>
<span class="line"><span>  volatile VersionedRef curRef;</span></span>
<span class="line"><span>  //构造方法</span></span>
<span class="line"><span>  public TxnRef(T value) {</span></span>
<span class="line"><span>    this.curRef = new VersionedRef(value, 0L);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //获取当前事务中的数据</span></span>
<span class="line"><span>  public T getValue(Txn txn) {</span></span>
<span class="line"><span>    return txn.get(this);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //在当前事务中设置数据</span></span>
<span class="line"><span>  public void setValue(T value, Txn txn) {</span></span>
<span class="line"><span>    txn.set(this, value);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>STMTxn是Txn最关键的一个实现类，事务内对于数据的读写，都是通过它来完成的。STMTxn内部有两个Map：inTxnMap，用于保存当前事务中所有读写的数据的快照；writeMap，用于保存当前事务需要写入的数据。每个事务都有一个唯一的事务ID txnId，这个txnId是全局递增的。</p><p>STMTxn有三个核心方法，分别是读数据的get()方法、写数据的set()方法和提交事务的commit()方法。其中，get()方法将要读取数据作为快照放入inTxnMap，同时保证每次读取的数据都是一个版本。set()方法会将要写入的数据放入writeMap，但如果写入的数据没被读取过，也会将其放入 inTxnMap。</p><p>至于commit()方法，我们为了简化实现，使用了互斥锁，所以事务的提交是串行的。commit()方法的实现很简单，首先检查inTxnMap中的数据是否发生过变化，如果没有发生变化，那么就将writeMap中的数据写入（这里的写入其实就是TxnRef内部持有的curRef）；如果发生过变化，那么就不能将writeMap中的数据写入了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//事务接口</span></span>
<span class="line"><span>public interface Txn {</span></span>
<span class="line"><span>  &amp;lt;T&amp;gt; T get(TxnRef&amp;lt;T&amp;gt; ref);</span></span>
<span class="line"><span>  &amp;lt;T&amp;gt; void set(TxnRef&amp;lt;T&amp;gt; ref, T value);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//STM事务实现类</span></span>
<span class="line"><span>public final class STMTxn implements Txn {</span></span>
<span class="line"><span>  //事务ID生成器</span></span>
<span class="line"><span>  private static AtomicLong txnSeq = new AtomicLong(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //当前事务所有的相关数据</span></span>
<span class="line"><span>  private Map&amp;lt;TxnRef, VersionedRef&amp;gt; inTxnMap = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  //当前事务所有需要修改的数据</span></span>
<span class="line"><span>  private Map&amp;lt;TxnRef, Object&amp;gt; writeMap = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  //当前事务ID</span></span>
<span class="line"><span>  private long txnId;</span></span>
<span class="line"><span>  //构造函数，自动生成当前事务ID</span></span>
<span class="line"><span>  STMTxn() {</span></span>
<span class="line"><span>    txnId = txnSeq.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //获取当前事务中的数据</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public &amp;lt;T&amp;gt; T get(TxnRef&amp;lt;T&amp;gt; ref) {</span></span>
<span class="line"><span>    //将需要读取的数据，加入inTxnMap</span></span>
<span class="line"><span>    if (!inTxnMap.containsKey(ref)) {</span></span>
<span class="line"><span>      inTxnMap.put(ref, ref.curRef);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return (T) inTxnMap.get(ref).value;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //在当前事务中修改数据</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public &amp;lt;T&amp;gt; void set(TxnRef&amp;lt;T&amp;gt; ref, T value) {</span></span>
<span class="line"><span>    //将需要修改的数据，加入inTxnMap</span></span>
<span class="line"><span>    if (!inTxnMap.containsKey(ref)) {</span></span>
<span class="line"><span>      inTxnMap.put(ref, ref.curRef);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    writeMap.put(ref, value);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //提交事务</span></span>
<span class="line"><span>  boolean commit() {</span></span>
<span class="line"><span>    synchronized (STM.commitLock) {</span></span>
<span class="line"><span>    //是否校验通过</span></span>
<span class="line"><span>    boolean isValid = true;</span></span>
<span class="line"><span>    //校验所有读过的数据是否发生过变化</span></span>
<span class="line"><span>    for(Map.Entry&amp;lt;TxnRef, VersionedRef&amp;gt; entry : inTxnMap.entrySet()){</span></span>
<span class="line"><span>      VersionedRef curRef = entry.getKey().curRef;</span></span>
<span class="line"><span>      VersionedRef readRef = entry.getValue();</span></span>
<span class="line"><span>      //通过版本号来验证数据是否发生过变化</span></span>
<span class="line"><span>      if (curRef.version != readRef.version) {</span></span>
<span class="line"><span>        isValid = false;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果校验通过，则所有更改生效</span></span>
<span class="line"><span>    if (isValid) {</span></span>
<span class="line"><span>      writeMap.forEach((k, v) -&amp;gt; {</span></span>
<span class="line"><span>        k.curRef = new VersionedRef(v, txnId);</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return isValid;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面我们来模拟实现Multiverse中的原子化操作atomic()。atomic()方法中使用了类似于CAS的操作，如果事务提交失败，那么就重新创建一个新的事务，重新执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;FunctionalInterface</span></span>
<span class="line"><span>public interface TxnRunnable {</span></span>
<span class="line"><span>  void run(Txn txn);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//STM</span></span>
<span class="line"><span>public final class STM {</span></span>
<span class="line"><span>  //私有化构造方法</span></span>
<span class="line"><span>  private STM() {</span></span>
<span class="line"><span>  //提交数据需要用到的全局锁</span></span>
<span class="line"><span>  static final Object commitLock = new Object();</span></span>
<span class="line"><span>  //原子化提交方法</span></span>
<span class="line"><span>  public static void atomic(TxnRunnable action) {</span></span>
<span class="line"><span>    boolean committed = false;</span></span>
<span class="line"><span>    //如果没有提交成功，则一直重试</span></span>
<span class="line"><span>    while (!committed) {</span></span>
<span class="line"><span>      //创建新的事务</span></span>
<span class="line"><span>      STMTxn txn = new STMTxn();</span></span>
<span class="line"><span>      //执行业务逻辑</span></span>
<span class="line"><span>      action.run(txn);</span></span>
<span class="line"><span>      //提交事务</span></span>
<span class="line"><span>      committed = txn.commit();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}​}</span></span></code></pre></div><p>就这样，我们自己实现了STM，并完成了线程安全的转账操作，使用方法和Multiverse差不多，这里就不赘述了，具体代码如下面所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Account {</span></span>
<span class="line"><span>  //余额</span></span>
<span class="line"><span>  private TxnRef&amp;lt;Integer&amp;gt; balance;</span></span>
<span class="line"><span>  //构造方法</span></span>
<span class="line"><span>  public Account(int balance) {</span></span>
<span class="line"><span>    this.balance = new TxnRef&amp;lt;Integer&amp;gt;(balance);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //转账操作</span></span>
<span class="line"><span>  public void transfer(Account target, int amt){</span></span>
<span class="line"><span>    STM.atomic((txn)-&amp;gt;{</span></span>
<span class="line"><span>      Integer from = balance.getValue(txn);</span></span>
<span class="line"><span>      balance.setValue(from-amt, txn);</span></span>
<span class="line"><span>      Integer to = target.balance.getValue(txn);</span></span>
<span class="line"><span>      target.balance.setValue(to+amt, txn);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>STM借鉴的是数据库的经验，数据库虽然复杂，但仅仅存储数据，而编程语言除了有共享变量之外，还会执行各种I/O操作，很显然I/O操作是很难支持回滚的。所以，STM也不是万能的。目前支持STM的编程语言主要是函数式语言，函数式语言里的数据天生具备不可变性，利用这种不可变性实现STM相对来说更简单。</p><p>另外，需要说明的是，文中的“自己实现STM”部分我参考了 <a href="http://www.codecommit.com/blog/scala/software-transactional-memory-in-scala" target="_blank" rel="noreferrer">Software Transactional Memory in Scala</a> 这篇博文以及 <a href="https://github.com/epam-mooc/stm-java" target="_blank" rel="noreferrer">一个GitHub项目</a>，目前还很粗糙，并不是一个完备的MVCC。如果你对这方面感兴趣，可以参考 <a href="http://www.codecommit.com/blog/scala/improving-the-stm-multi-version-concurrency-control" target="_blank" rel="noreferrer">Improving the STM: Multi-Version Concurrency Control</a> 这篇博文，里面讲到了如何优化，你可以尝试学习下。</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,31)])])}const g=a(l,[["render",i]]);export{d as __pageData,g as default};
