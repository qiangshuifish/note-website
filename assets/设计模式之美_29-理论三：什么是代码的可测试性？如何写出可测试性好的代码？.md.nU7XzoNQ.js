import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"29 | 理论三：什么是代码的可测试性？如何写出可测试性好的代码？","description":"","frontmatter":{},"headers":[{"level":2,"title":"编写可测试代码案例实战","slug":"编写可测试代码案例实战","link":"#编写可测试代码案例实战","children":[]},{"level":2,"title":"其他常见的Anti-Patterns","slug":"其他常见的anti-patterns","link":"#其他常见的anti-patterns","children":[{"level":3,"title":"1.未决行为","slug":"_1-未决行为","link":"#_1-未决行为","children":[]},{"level":3,"title":"2.全局变量","slug":"_2-全局变量","link":"#_2-全局变量","children":[]},{"level":3,"title":"3.静态方法","slug":"_3-静态方法","link":"#_3-静态方法","children":[]},{"level":3,"title":"4.复杂继承","slug":"_4-复杂继承","link":"#_4-复杂继承","children":[]},{"level":3,"title":"5.高耦合代码","slug":"_5-高耦合代码","link":"#_5-高耦合代码","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/29-理论三：什么是代码的可测试性？如何写出可测试性好的代码？.md","filePath":"设计模式之美/29-理论三：什么是代码的可测试性？如何写出可测试性好的代码？.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/29-理论三：什么是代码的可测试性？如何写出可测试性好的代码？.md"};function i(t,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_29-理论三-什么是代码的可测试性-如何写出可测试性好的代码" tabindex="-1">29 | 理论三：什么是代码的可测试性？如何写出可测试性好的代码？ <a class="header-anchor" href="#_29-理论三-什么是代码的可测试性-如何写出可测试性好的代码" aria-label="Permalink to &quot;29 | 理论三：什么是代码的可测试性？如何写出可测试性好的代码？&quot;">​</a></h1><p>在上一节课中，我们对单元测试做了介绍，讲了“什么是单元测试？为什么要编写单元测试？如何编写单元测试？实践中单元测试为什么难贯彻执行？”这样几个问题。</p><p>实际上，写单元测试并不难，也不需要太多技巧，相反，写出可测试的代码反倒是件非常有挑战的事情。所以，今天，我们就再来聊一聊代码的可测试性，主要包括这样几个问题：</p><ul><li>什么是代码的可测试性？</li><li>如何写出可测试的代码？</li><li>有哪些常见的不好测试的代码？</li></ul><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="编写可测试代码案例实战" tabindex="-1">编写可测试代码案例实战 <a class="header-anchor" href="#编写可测试代码案例实战" aria-label="Permalink to &quot;编写可测试代码案例实战&quot;">​</a></h2><p>刚刚提到的这几个关于代码可测试性的问题，我准备通过一个实战案例来讲解。具体的被测试代码如下所示。</p><p>其中，Transaction是经过我抽象简化之后的一个电商系统的交易类，用来记录每笔订单交易的情况。Transaction类中的execute()函数负责执行转账操作，将钱从买家的钱包转到卖家的钱包中。真正的转账操作是通过调用WalletRpcService RPC服务来完成的。除此之外，代码中还涉及一个分布式锁DistributedLock单例类，用来避免Transaction并发执行，导致用户的钱被重复转出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Transaction {</span></span>
<span class="line"><span>  private String id;</span></span>
<span class="line"><span>  private Long buyerId;</span></span>
<span class="line"><span>  private Long sellerId;</span></span>
<span class="line"><span>  private Long productId;</span></span>
<span class="line"><span>  private String orderId;</span></span>
<span class="line"><span>  private Long createTimestamp;</span></span>
<span class="line"><span>  private Double amount;</span></span>
<span class="line"><span>  private STATUS status;</span></span>
<span class="line"><span>  private String walletTransactionId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // ...get() methods...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Transaction(String preAssignedId, Long buyerId, Long sellerId, Long productId, String orderId) {</span></span>
<span class="line"><span>    if (preAssignedId != null &amp;&amp; !preAssignedId.isEmpty()) {</span></span>
<span class="line"><span>      this.id = preAssignedId;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      this.id = IdGenerator.generateTransactionId();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!this.id.startWith(&quot;t_&quot;)) {</span></span>
<span class="line"><span>      this.id = &quot;t_&quot; + preAssignedId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.buyerId = buyerId;</span></span>
<span class="line"><span>    this.sellerId = sellerId;</span></span>
<span class="line"><span>    this.productId = productId;</span></span>
<span class="line"><span>    this.orderId = orderId;</span></span>
<span class="line"><span>    this.status = STATUS.TO_BE_EXECUTD;</span></span>
<span class="line"><span>    this.createTimestamp = System.currentTimestamp();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean execute() throws InvalidTransactionException {</span></span>
<span class="line"><span>    if ((buyerId == null || (sellerId == null || amount &amp;lt; 0.0) {</span></span>
<span class="line"><span>      throw new InvalidTransactionException(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (status == STATUS.EXECUTED) return true;</span></span>
<span class="line"><span>    boolean isLocked = false;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      isLocked = RedisDistributedLock.getSingletonIntance().lockTransction(id);</span></span>
<span class="line"><span>      if (!isLocked) {</span></span>
<span class="line"><span>        return false; // 锁定未成功，返回false，job兜底执行</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (status == STATUS.EXECUTED) return true; // double check</span></span>
<span class="line"><span>      long executionInvokedTimestamp = System.currentTimestamp();</span></span>
<span class="line"><span>      if (executionInvokedTimestamp - createdTimestap &amp;gt; 14days) {</span></span>
<span class="line"><span>        this.status = STATUS.EXPIRED;</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      WalletRpcService walletRpcService = new WalletRpcService();</span></span>
<span class="line"><span>      String walletTransactionId = walletRpcService.moveMoney(id, buyerId, sellerId, amount);</span></span>
<span class="line"><span>      if (walletTransactionId != null) {</span></span>
<span class="line"><span>        this.walletTransactionId = walletTransactionId;</span></span>
<span class="line"><span>        this.status = STATUS.EXECUTED;</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        this.status = STATUS.FAILED;</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      if (isLocked) {</span></span>
<span class="line"><span>       RedisDistributedLock.getSingletonIntance().unlockTransction(id);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对比上一节课中的Text类的代码，这段代码要复杂很多。如果让你给这段代码编写单元测试，你会如何来写呢？你可以先试着思考一下，然后再来看我下面的分析。</p><p>在Transaction类中，主要逻辑集中在execute()函数中，所以它是我们测试的重点对象。为了尽可能全面覆盖各种正常和异常情况，针对这个函数，我设计了下面6个测试用例。</p><ol><li>正常情况下，交易执行成功，回填用于对账（交易与钱包的交易流水）用的walletTransactionId，交易状态设置为EXECUTED，函数返回true。</li><li>buyerId、sellerId为null、amount小于0，返回InvalidTransactionException。</li><li>交易已过期（createTimestamp超过14天），交易状态设置为EXPIRED，返回false。</li><li>交易已经执行了（status==EXECUTED），不再重复执行转钱逻辑，返回true。</li><li>钱包（WalletRpcService）转钱失败，交易状态设置为FAILED，函数返回false。</li><li>交易正在执行着，不会被重复执行，函数直接返回false。</li></ol><p>测试用例设计完了。现在看起来似乎一切进展顺利。但是，事实是，当我们将测试用例落实到具体的代码实现时，你就会发现有很多行不通的地方。对于上面的测试用例，第2个实现起来非常简单，我就不做介绍了。我们重点来看其中的1和3。测试用例4、5、6跟3类似，留给你自己来实现。</p><p>现在，我们就来看测试用例1的代码实现。具体如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void testExecute() {</span></span>
<span class="line"><span>  Long buyerId = 123L;</span></span>
<span class="line"><span>  Long sellerId = 234L;</span></span>
<span class="line"><span>  Long productId = 345L;</span></span>
<span class="line"><span>  Long orderId = 456L;</span></span>
<span class="line"><span>  Transction transaction = new Transaction(null, buyerId, sellerId, productId, orderId);</span></span>
<span class="line"><span>  boolean executedResult = transaction.execute();</span></span>
<span class="line"><span>  assertTrue(executedResult);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>execute()函数的执行依赖两个外部的服务，一个是RedisDistributedLock，一个WalletRpcService。这就导致上面的单元测试代码存在下面几个问题。</p><ul><li>如果要让这个单元测试能够运行，我们需要搭建Redis服务和Wallet RPC服务。搭建和维护的成本比较高。</li><li>我们还需要保证将伪造的transaction数据发送给Wallet RPC服务之后，能够正确返回我们期望的结果，然而Wallet RPC服务有可能是第三方（另一个团队开发维护的）的服务，并不是我们可控的。换句话说，并不是我们想让它返回什么数据就返回什么。</li><li>Transaction的执行跟Redis、RPC服务通信，需要走网络，耗时可能会比较长，对单元测试本身的执行性能也会有影响。</li><li>网络的中断、超时、Redis、RPC服务的不可用，都会影响单元测试的执行。</li></ul><p>我们回到单元测试的定义上来看一下。单元测试主要是测试程序员自己编写的代码逻辑的正确性，并非是端到端的集成测试，它不需要测试所依赖的外部系统（分布式锁、Wallet RPC服务）的逻辑正确性。所以，如果代码中依赖了外部系统或者不可控组件，比如，需要依赖数据库、网络通信、文件系统等，那我们就需要将被测代码与外部系统解依赖，而这种解依赖的方法就叫作“mock”。所谓的mock就是用一个“假”的服务替换真正的服务。mock的服务完全在我们的控制之下，模拟输出我们想要的数据。</p><p>那如何来mock服务呢？mock的方式主要有两种，手动mock和利用框架mock。利用框架mock仅仅是为了简化代码编写，每个框架的mock方式都不大一样。我们这里只展示手动mock。</p><p>我们通过继承WalletRpcService类，并且重写其中的moveMoney()函数的方式来实现mock。具体的代码实现如下所示。通过mock的方式，我们可以让moveMoney()返回任意我们想要的数据，完全在我们的控制范围内，并且不需要真正进行网络通信。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MockWalletRpcServiceOne extends WalletRpcService {</span></span>
<span class="line"><span>  public String moveMoney(Long id, Long fromUserId, Long toUserId, Double amount) {</span></span>
<span class="line"><span>    return &quot;123bac&quot;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MockWalletRpcServiceTwo extends WalletRpcService {</span></span>
<span class="line"><span>  public String moveMoney(Long id, Long fromUserId, Long toUserId, Double amount) {</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在我们再来看，如何用MockWalletRpcServiceOne、MockWalletRpcServiceTwo来替换代码中的真正的WalletRpcService呢？</p><p>因为WalletRpcService是在execute()函数中通过new的方式创建的，我们无法动态地对其进行替换。也就是说，Transaction类中的execute()方法的可测试性很差，需要通过重构来让其变得更容易测试。该如何重构这段代码呢？</p><p>在 <a href="https://time.geekbang.org/column/article/177444" target="_blank" rel="noreferrer">第19节</a> 中，我们讲到，依赖注入是实现代码可测试性的最有效的手段。我们可以应用依赖注入，将WalletRpcService对象的创建反转给上层逻辑，在外部创建好之后，再注入到Transaction类中。重构之后的Transaction类的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Transaction {</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>  // 添加一个成员变量及其set方法</span></span>
<span class="line"><span>  private WalletRpcService walletRpcService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setWalletRpcService(WalletRpcService walletRpcService) {</span></span>
<span class="line"><span>    this.walletRpcService = walletRpcService;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>  public boolean execute() {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    // 删除下面这一行代码</span></span>
<span class="line"><span>    // WalletRpcService walletRpcService = new WalletRpcService();</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在，我们就可以在单元测试中，非常容易地将WalletRpcService替换成MockWalletRpcServiceOne或WalletRpcServiceTwo了。重构之后的代码对应的单元测试如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void testExecute() {</span></span>
<span class="line"><span>  Long buyerId = 123L;</span></span>
<span class="line"><span>  Long sellerId = 234L;</span></span>
<span class="line"><span>  Long productId = 345L;</span></span>
<span class="line"><span>  Long orderId = 456L;</span></span>
<span class="line"><span>  Transction transaction = new Transaction(null, buyerId, sellerId, productId, orderId);</span></span>
<span class="line"><span>  // 使用mock对象来替代真正的RPC服务</span></span>
<span class="line"><span>  transaction.setWalletRpcService(new MockWalletRpcServiceOne()):</span></span>
<span class="line"><span>  boolean executedResult = transaction.execute();</span></span>
<span class="line"><span>  assertTrue(executedResult);</span></span>
<span class="line"><span>  assertEquals(STATUS.EXECUTED, transaction.getStatus());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>WalletRpcService的mock和替换问题解决了，我们再来看RedisDistributedLock。它的mock和替换要复杂一些，主要是因为RedisDistributedLock是一个单例类。单例相当于一个全局变量，我们无法mock（无法继承和重写方法），也无法通过依赖注入的方式来替换。</p><p>如果RedisDistributedLock是我们自己维护的，可以自由修改、重构，那我们可以将其改为非单例的模式，或者定义一个接口，比如IDistributedLock，让RedisDistributedLock实现这个接口。这样我们就可以像前面WalletRpcService的替换方式那样，替换RedisDistributedLock为MockRedisDistributedLock了。但如果RedisDistributedLock不是我们维护的，我们无权去修改这部分代码，这个时候该怎么办呢？</p><p>我们可以对transaction上锁这部分逻辑重新封装一下。具体代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TransactionLock {</span></span>
<span class="line"><span>  public boolean lock(String id) {</span></span>
<span class="line"><span>    return RedisDistributedLock.getSingletonIntance().lockTransction(id);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void unlock() {</span></span>
<span class="line"><span>    RedisDistributedLock.getSingletonIntance().unlockTransction(id);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Transaction {</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>  private TransactionLock lock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setTransactionLock(TransactionLock lock) {</span></span>
<span class="line"><span>    this.lock = lock;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean execute() {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      isLocked = lock.lock();</span></span>
<span class="line"><span>      //...</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      if (isLocked) {</span></span>
<span class="line"><span>        lock.unlock();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>针对重构过的代码，我们的单元测试代码修改为下面这个样子。这样，我们就能在单元测试代码中隔离真正的RedisDistributedLock分布式锁这部分逻辑了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void testExecute() {</span></span>
<span class="line"><span>  Long buyerId = 123L;</span></span>
<span class="line"><span>  Long sellerId = 234L;</span></span>
<span class="line"><span>  Long productId = 345L;</span></span>
<span class="line"><span>  Long orderId = 456L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  TransactionLock mockLock = new TransactionLock() {</span></span>
<span class="line"><span>    public boolean lock(String id) {</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void unlock() {}</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Transction transaction = new Transaction(null, buyerId, sellerId, productId, orderId);</span></span>
<span class="line"><span>  transaction.setWalletRpcService(new MockWalletRpcServiceOne());</span></span>
<span class="line"><span>  transaction.setTransactionLock(mockLock);</span></span>
<span class="line"><span>  boolean executedResult = transaction.execute();</span></span>
<span class="line"><span>  assertTrue(executedResult);</span></span>
<span class="line"><span>  assertEquals(STATUS.EXECUTED, transaction.getStatus());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此，测试用例1就算写好了。我们通过依赖注入和mock，让单元测试代码不依赖任何不可控的外部服务。你可以照着这个思路，自己写一下测试用例4、5、6。</p><p>现在，我们再来看测试用例3：交易已过期（createTimestamp超过14天），交易状态设置为EXPIRED，返回false。针对这个单元测试用例，我们还是先把代码写出来，然后再来分析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void testExecute_with_TransactionIsExpired() {</span></span>
<span class="line"><span>  Long buyerId = 123L;</span></span>
<span class="line"><span>  Long sellerId = 234L;</span></span>
<span class="line"><span>  Long productId = 345L;</span></span>
<span class="line"><span>  Long orderId = 456L;</span></span>
<span class="line"><span>  Transction transaction = new Transaction(null, buyerId, sellerId, productId, orderId);</span></span>
<span class="line"><span>  transaction.setCreatedTimestamp(System.currentTimestamp() - 14days);</span></span>
<span class="line"><span>  boolean actualResult = transaction.execute();</span></span>
<span class="line"><span>  assertFalse(actualResult);</span></span>
<span class="line"><span>  assertEquals(STATUS.EXPIRED, transaction.getStatus());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码看似没有任何问题。我们将transaction的创建时间createdTimestamp设置为14天前，也就是说，当单元测试代码运行的时候，transaction一定是处于过期状态。但是，如果在Transaction类中，并没有暴露修改createdTimestamp成员变量的set方法（也就是没有定义setCreatedTimestamp()函数）呢？</p><p>你可能会说，如果没有createTimestamp的set方法，我就重新添加一个呗！实际上，这违反了类的封装特性。在Transaction类的设计中，createTimestamp是在交易生成时（也就是构造函数中）自动获取的系统时间，本来就不应该人为地轻易修改，所以，暴露createTimestamp的set方法，虽然带来了灵活性，但也带来了不可控性。因为，我们无法控制使用者是否会调用set方法重设createTimestamp，而重设createTimestamp并非我们的预期行为。</p><p>那如果没有针对createTimestamp的set方法，那测试用例3又该如何实现呢？实际上，这是一类比较常见的问题，就是代码中包含跟“时间”有关的“未决行为”逻辑。我们一般的处理方式是将这种未决行为逻辑重新封装。针对Transaction类，我们只需要将交易是否过期的逻辑，封装到isExpired()函数中即可，具体的代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Transaction {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  protected boolean isExpired() {</span></span>
<span class="line"><span>    long executionInvokedTimestamp = System.currentTimestamp();</span></span>
<span class="line"><span>    return executionInvokedTimestamp - createdTimestamp &amp;gt; 14days;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean execute() throws InvalidTransactionException {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>      if (isExpired()) {</span></span>
<span class="line"><span>        this.status = STATUS.EXPIRED;</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>针对重构之后的代码，测试用例3的代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void testExecute_with_TransactionIsExpired() {</span></span>
<span class="line"><span>  Long buyerId = 123L;</span></span>
<span class="line"><span>  Long sellerId = 234L;</span></span>
<span class="line"><span>  Long productId = 345L;</span></span>
<span class="line"><span>  Long orderId = 456L;</span></span>
<span class="line"><span>  Transction transaction = new Transaction(null, buyerId, sellerId, productId, orderId) {</span></span>
<span class="line"><span>    protected boolean isExpired() {</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  boolean actualResult = transaction.execute();</span></span>
<span class="line"><span>  assertFalse(actualResult);</span></span>
<span class="line"><span>  assertEquals(STATUS.EXPIRED, transaction.getStatus());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过重构，Transaction代码的可测试性提高了。之前罗列的所有测试用例，现在我们都顺利实现了。不过，Transaction类的构造函数的设计还有点不妥。为了方便你查看，我把构造函数的代码重新copy了一份贴到这里。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public Transaction(String preAssignedId, Long buyerId, Long sellerId, Long productId, String orderId) {</span></span>
<span class="line"><span>    if (preAssignedId != null &amp;&amp; !preAssignedId.isEmpty()) {</span></span>
<span class="line"><span>      this.id = preAssignedId;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      this.id = IdGenerator.generateTransactionId();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!this.id.startWith(&quot;t_&quot;)) {</span></span>
<span class="line"><span>      this.id = &quot;t_&quot; + preAssignedId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.buyerId = buyerId;</span></span>
<span class="line"><span>    this.sellerId = sellerId;</span></span>
<span class="line"><span>    this.productId = productId;</span></span>
<span class="line"><span>    this.orderId = orderId;</span></span>
<span class="line"><span>    this.status = STATUS.TO_BE_EXECUTD;</span></span>
<span class="line"><span>    this.createTimestamp = System.currentTimestamp();</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>我们发现，构造函数中并非只包含简单赋值操作。交易id的赋值逻辑稍微复杂。我们最好也要测试一下，以保证这部分逻辑的正确性。为了方便测试，我们可以把id赋值这部分逻辑单独抽象到一个函数中，具体的代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public Transaction(String preAssignedId, Long buyerId, Long sellerId, Long productId, String orderId) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>    fillTransactionId(preAssignId);</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  protected void fillTransactionId(String preAssignedId) {</span></span>
<span class="line"><span>    if (preAssignedId != null &amp;&amp; !preAssignedId.isEmpty()) {</span></span>
<span class="line"><span>      this.id = preAssignedId;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      this.id = IdGenerator.generateTransactionId();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!this.id.startWith(&quot;t_&quot;)) {</span></span>
<span class="line"><span>      this.id = &quot;t_&quot; + preAssignedId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>到此为止，我们一步一步将Transaction从不可测试代码重构成了测试性良好的代码。不过，你可能还会有疑问，Transaction类中isExpired()函数就不用测试了吗？对于isExpired()函数，逻辑非常简单，肉眼就能判定是否有bug，是可以不用写单元测试的。</p><p>实际上，可测试性差的代码，本身代码设计得也不够好，很多地方都没有遵守我们之前讲到的设计原则和思想，比如“基于接口而非实现编程”思想、依赖反转原则等。重构之后的代码，不仅可测试性更好，而且从代码设计的角度来说，也遵从了经典的设计原则和思想。这也印证了我们之前说过的，代码的可测试性可以从侧面上反应代码设计是否合理。除此之外，在平时的开发中，我们也要多思考一下，这样编写代码，是否容易编写单元测试，这也有利于我们设计出好的代码。</p><h2 id="其他常见的anti-patterns" tabindex="-1">其他常见的Anti-Patterns <a class="header-anchor" href="#其他常见的anti-patterns" aria-label="Permalink to &quot;其他常见的Anti-Patterns&quot;">​</a></h2><p>刚刚我们通过一个实战案例，讲解了如何利用依赖注入来提高代码的可测试性，以及编写单元测试中最复杂的一部分内容：如何通过mock、二次封装等方式解依赖外部服务。现在，我们再来总结一下，有哪些典型的、常见的测试性不好的代码，也就是我们常说的Anti-Patterns。</p><h3 id="_1-未决行为" tabindex="-1">1.未决行为 <a class="header-anchor" href="#_1-未决行为" aria-label="Permalink to &quot;1.未决行为&quot;">​</a></h3><p>所谓的未决行为逻辑就是，代码的输出是随机或者说不确定的，比如，跟时间、随机数有关的代码。对于这一点，在刚刚的实战案例中我们已经讲到，你可以利用刚才讲到的方法，试着重构一下下面的代码，并且为它编写单元测试。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  public long caculateDelayDays(Date dueTime) {</span></span>
<span class="line"><span>    long currentTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    if (dueTime.getTime() &amp;gt;= currentTimestamp) {</span></span>
<span class="line"><span>      return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    long delayTime = currentTimestamp - dueTime.getTime();</span></span>
<span class="line"><span>    long delayDays = delayTime / 86400;</span></span>
<span class="line"><span>    return delayDays;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-全局变量" tabindex="-1">2.全局变量 <a class="header-anchor" href="#_2-全局变量" aria-label="Permalink to &quot;2.全局变量&quot;">​</a></h3><p>前面我们讲过，全局变量是一种面向过程的编程风格，有种种弊端。实际上，滥用全局变量也让编写单元测试变得困难。我举个例子来解释一下。</p><p>RangeLimiter表示一个[-5, 5]的区间，position初始在0位置，move()函数负责移动position。其中，position是一个静态全局变量。RangeLimiterTest类是为其设计的单元测试，不过，这里面存在很大的问题，你可以先自己分析一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RangeLimiter {</span></span>
<span class="line"><span>  private static AtomicInteger position = new AtomicInteger(0);</span></span>
<span class="line"><span>  public static final int MAX_LIMIT = 5;</span></span>
<span class="line"><span>  public static final int MIN_LIMIT = -5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean move(int delta) {</span></span>
<span class="line"><span>    int currentPos = position.addAndGet(delta);</span></span>
<span class="line"><span>    boolean betweenRange = (currentPos &amp;lt;= MAX_LIMIT) &amp;&amp; (currentPos &amp;gt;= MIN_LIMIT);</span></span>
<span class="line"><span>    return betweenRange;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RangeLimiterTest {</span></span>
<span class="line"><span>  public void testMove_betweenRange() {</span></span>
<span class="line"><span>    RangeLimiter rangeLimiter = new RangeLimiter();</span></span>
<span class="line"><span>    assertTrue(rangeLimiter.move(1));</span></span>
<span class="line"><span>    assertTrue(rangeLimiter.move(3));</span></span>
<span class="line"><span>    assertTrue(rangeLimiter.move(-5));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void testMove_exceedRange() {</span></span>
<span class="line"><span>    RangeLimiter rangeLimiter = new RangeLimiter();</span></span>
<span class="line"><span>    assertFalse(rangeLimiter.move(6));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的单元测试有可能会运行失败。假设单元测试框架顺序依次执行testMove_betweenRange()和testMove_exceedRange()两个测试用例。在第一个测试用例执行完成之后，position的值变成了-1；再执行第二个测试用例的时候，position变成了5，move()函数返回true，assertFalse语句判定失败。所以，第二个测试用例运行失败。</p><p>当然，如果RangeLimiter类有暴露重设（reset）position值的函数，我们可以在每次执行单元测试用例之前，把position重设为0，这样就能解决刚刚的问题。</p><p>不过，每个单元测试框架执行单元测试用例的方式可能是不同的。有的是顺序执行，有的是并发执行。对于并发执行的情况，即便我们每次都把position重设为0，也并不奏效。如果两个测试用例并发执行，第16、17、18、23这四行代码可能会交叉执行，影响到move()函数的执行结果。</p><h3 id="_3-静态方法" tabindex="-1">3.静态方法 <a class="header-anchor" href="#_3-静态方法" aria-label="Permalink to &quot;3.静态方法&quot;">​</a></h3><p>前面我们也提到，静态方法跟全局变量一样，也是一种面向过程的编程思维。在代码中调用静态方法，有时候会导致代码不易测试。主要原因是静态方法也很难mock。但是，这个要分情况来看。只有在这个静态方法执行耗时太长、依赖外部资源、逻辑复杂、行为未决等情况下，我们才需要在单元测试中mock这个静态方法。除此之外，如果只是类似Math.abs()这样的简单静态方法，并不会影响代码的可测试性，因为本身并不需要mock。</p><h3 id="_4-复杂继承" tabindex="-1">4.复杂继承 <a class="header-anchor" href="#_4-复杂继承" aria-label="Permalink to &quot;4.复杂继承&quot;">​</a></h3><p>我们前面提到，相比组合关系，继承关系的代码结构更加耦合、不灵活，更加不易扩展、不易维护。实际上，继承关系也更加难测试。这也印证了代码的可测试性跟代码质量的相关性。</p><p>如果父类需要mock某个依赖对象才能进行单元测试，那所有的子类、子类的子类……在编写单元测试的时候，都要mock这个依赖对象。对于层次很深（在继承关系类图中表现为纵向深度）、结构复杂（在继承关系类图中表现为横向广度）的继承关系，越底层的子类要mock的对象可能就会越多，这样就会导致，底层子类在写单元测试的时候，要一个一个mock很多依赖对象，而且还需要查看父类代码，去了解该如何mock这些依赖对象。</p><p>如果我们利用组合而非继承来组织类之间的关系，类之间的结构层次比较扁平，在编写单元测试的时候，只需要mock类所组合依赖的对象即可。</p><h3 id="_5-高耦合代码" tabindex="-1">5.高耦合代码 <a class="header-anchor" href="#_5-高耦合代码" aria-label="Permalink to &quot;5.高耦合代码&quot;">​</a></h3><p>如果一个类职责很重，需要依赖十几个外部对象才能完成工作，代码高度耦合，那我们在编写单元测试的时候，可能需要mock这十几个依赖的对象。不管是从代码设计的角度来说，还是从编写单元测试的角度来说，这都是不合理的。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p><strong>1.什么是代码的可测试性？</strong></p><p>粗略地讲，所谓代码的可测试性，就是针对代码编写单元测试的难易程度。对于一段代码，如果很难为其编写单元测试，或者单元测试写起来很费劲，需要依靠单元测试框架中很高级的特性，那往往就意味着代码设计得不够合理，代码的可测试性不好。</p><p><strong>2.编写可测试性代码的最有效手段</strong></p><p>依赖注入是编写可测试性代码的最有效手段。通过依赖注入，我们在编写单元测试的时候，可以通过mock的方法解依赖外部服务，这也是我们在编写单元测试的过程中最有技术挑战的地方。</p><p><strong>3.常见的Anti-Patterns</strong></p><p>常见的测试不友好的代码有下面这5种：</p><ul><li>代码中包含未决行为逻辑</li><li>滥用可变全局变量</li><li>滥用静态方法</li><li>使用复杂的继承关系</li><li>高度耦合的代码</li></ul><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><ol><li>实战案例中的void fillTransactionId(String preAssignedId)函数中包含一处静态函数调用：IdGenerator.generateTransactionId()，这是否会影响到代码的可测试性？在写单元测试的时候，我们是否需要mock这个函数？</li><li>我们今天讲到，依赖注入是提高代码可测试性的最有效的手段。所以，依赖注入，就是不要在类内部通过new的方式创建对象，而是要通过外部创建好之后传递给类使用。那是不是所有的对象都不能在类内部创建呢？哪种类型的对象可以在类内部创建并且不影响代码的可测试性？你能举几个例子吗？</li></ol><p>欢迎在留言区写下你的答案，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,80)])])}const m=n(l,[["render",i]]);export{g as __pageData,m as default};
