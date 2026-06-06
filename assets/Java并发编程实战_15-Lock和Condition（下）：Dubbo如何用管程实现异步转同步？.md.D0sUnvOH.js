import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"15 | Lock和Condition（下）：Dubbo如何用管程实现异步转同步？","description":"","frontmatter":{},"headers":[{"level":2,"title":"同步与异步","slug":"同步与异步","link":"#同步与异步","children":[]},{"level":2,"title":"Dubbo源码分析","slug":"dubbo源码分析","link":"#dubbo源码分析","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/15-Lock和Condition（下）：Dubbo如何用管程实现异步转同步？.md","filePath":"Java并发编程实战/15-Lock和Condition（下）：Dubbo如何用管程实现异步转同步？.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/15-Lock和Condition（下）：Dubbo如何用管程实现异步转同步？.md"};function i(o,n,t,c,r,u){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_15-lock和condition-下-dubbo如何用管程实现异步转同步" tabindex="-1">15 | Lock和Condition（下）：Dubbo如何用管程实现异步转同步？ <a class="header-anchor" href="#_15-lock和condition-下-dubbo如何用管程实现异步转同步" aria-label="Permalink to &quot;15 | Lock和Condition（下）：Dubbo如何用管程实现异步转同步？&quot;">​</a></h1><p>在上一篇文章中，我们讲到Java SDK并发包里的Lock有别于synchronized隐式锁的三个特性：能够响应中断、支持超时和非阻塞地获取锁。那今天我们接着再来详细聊聊Java SDK并发包里的Condition， <strong>Condition实现了管程模型里面的条件变量</strong>。</p><p>在 <a href="https://time.geekbang.org/column/article/86089" target="_blank" rel="noreferrer">《08 | 管程：并发编程的万能钥匙》</a> 里我们提到过Java 语言内置的管程里只有一个条件变量，而Lock&amp;Condition实现的管程是支持多个条件变量的，这是二者的一个重要区别。</p><p>在很多并发场景下，支持多个条件变量能够让我们的并发程序可读性更好，实现起来也更容易。例如，实现一个阻塞队列，就需要两个条件变量。</p><p><strong>那如何利用两个条件变量快速实现阻塞队列呢？</strong></p><p>一个阻塞队列，需要两个条件变量，一个是队列不空（空队列不允许出队），另一个是队列不满（队列已满不允许入队），这个例子我们前面在介绍 <a href="https://time.geekbang.org/column/article/86089" target="_blank" rel="noreferrer">管程</a> 的时候详细说过，这里就不再赘述。相关的代码，我这里重新列了出来，你可以温故知新一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BlockedQueue&amp;lt;T&amp;gt;{</span></span>
<span class="line"><span>  final Lock lock =</span></span>
<span class="line"><span>    new ReentrantLock();</span></span>
<span class="line"><span>  // 条件变量：队列不满</span></span>
<span class="line"><span>  final Condition notFull =</span></span>
<span class="line"><span>    lock.newCondition();</span></span>
<span class="line"><span>  // 条件变量：队列不空</span></span>
<span class="line"><span>  final Condition notEmpty =</span></span>
<span class="line"><span>    lock.newCondition();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 入队</span></span>
<span class="line"><span>  void enq(T x) {</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      while (队列已满){</span></span>
<span class="line"><span>        // 等待队列不满</span></span>
<span class="line"><span>        notFull.await();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 省略入队操作...</span></span>
<span class="line"><span>      //入队后,通知可出队</span></span>
<span class="line"><span>      notEmpty.signal();</span></span>
<span class="line"><span>    }finally {</span></span>
<span class="line"><span>      lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 出队</span></span>
<span class="line"><span>  void deq(){</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      while (队列已空){</span></span>
<span class="line"><span>        // 等待队列不空</span></span>
<span class="line"><span>        notEmpty.await();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 省略出队操作...</span></span>
<span class="line"><span>      //出队后，通知可入队</span></span>
<span class="line"><span>      notFull.signal();</span></span>
<span class="line"><span>    }finally {</span></span>
<span class="line"><span>      lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，这里你需要注意，Lock和Condition实现的管程， <strong>线程等待和通知需要调用await()、signal()、signalAll()</strong>，它们的语义和wait()、notify()、notifyAll()是相同的。但是不一样的是，Lock&amp;Condition实现的管程里只能使用前面的await()、signal()、signalAll()，而后面的wait()、notify()、notifyAll()只有在synchronized实现的管程里才能使用。如果一不小心在Lock&amp;Condition实现的管程里调用了wait()、notify()、notifyAll()，那程序可就彻底玩儿完了。</p><p>Java SDK并发包里的Lock和Condition不过就是管程的一种实现而已，管程你已经很熟悉了，那Lock和Condition的使用自然是小菜一碟。下面我们就来看看在知名项目Dubbo中，Lock和Condition是怎么用的。不过在开始介绍源码之前，我还先要介绍两个概念：同步和异步。</p><h2 id="同步与异步" tabindex="-1">同步与异步 <a class="header-anchor" href="#同步与异步" aria-label="Permalink to &quot;同步与异步&quot;">​</a></h2><p>我们平时写的代码，基本都是同步的。但最近几年，异步编程大火。那同步和异步的区别到底是什么呢？ <strong>通俗点来讲就是调用方是否需要等待结果，如果需要等待结果，就是同步；如果不需要等待结果，就是异步</strong>。</p><p>比如在下面的代码里，有一个计算圆周率小数点后100万位的方法 <code>pai1M()</code>，这个方法可能需要执行俩礼拜，如果调用 <code>pai1M()</code> 之后，线程一直等着计算结果，等俩礼拜之后结果返回，就可以执行 <code>printf(&quot;hello world&quot;)</code> 了，这个属于同步；如果调用 <code>pai1M()</code> 之后，线程不用等待计算结果，立刻就可以执行 <code>printf(&quot;hello world&quot;)</code>，这个就属于异步。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 计算圆周率小说点后100万位</span></span>
<span class="line"><span>String pai1M() {</span></span>
<span class="line"><span>  //省略代码无数</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pai1M()</span></span>
<span class="line"><span>printf(&quot;hello world&quot;)</span></span></code></pre></div><p>同步，是Java代码默认的处理方式。如果你想让你的程序支持异步，可以通过下面两种方式来实现：</p><ol><li>调用方创建一个子线程，在子线程中执行方法调用，这种调用我们称为异步调用；</li><li>方法实现的时候，创建一个新的线程执行主要逻辑，主线程直接return，这种方法我们一般称为异步方法。</li></ol><h2 id="dubbo源码分析" tabindex="-1">Dubbo源码分析 <a class="header-anchor" href="#dubbo源码分析" aria-label="Permalink to &quot;Dubbo源码分析&quot;">​</a></h2><p>其实在编程领域，异步的场景还是挺多的，比如TCP协议本身就是异步的，我们工作中经常用到的RPC调用， <strong>在TCP协议层面，发送完RPC请求后，线程是不会等待RPC的响应结果的</strong>。可能你会觉得奇怪，平时工作中的RPC调用大多数都是同步的啊？这是怎么回事呢？</p><p>其实很简单，一定是有人帮你做了异步转同步的事情。例如目前知名的RPC框架Dubbo就给我们做了异步转同步的事情，那它是怎么做的呢？下面我们就来分析一下Dubbo的相关源码。</p><p>对于下面一个简单的RPC调用，默认情况下sayHello()方法，是个同步方法，也就是说，执行service.sayHello(“dubbo”)的时候，线程会停下来等结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DemoService service = 初始化部分省略</span></span>
<span class="line"><span>String message =</span></span>
<span class="line"><span>  service.sayHello(&quot;dubbo&quot;);</span></span>
<span class="line"><span>System.out.println(message);</span></span></code></pre></div><p>如果此时你将调用线程dump出来的话，会是下图这个样子，你会发现调用线程阻塞了，线程状态是TIMED_WAITING。本来发送请求是异步的，但是调用线程却阻塞了，说明Dubbo帮我们做了异步转同步的事情。通过调用栈，你能看到线程是阻塞在DefaultFuture.get()方法上，所以可以推断：Dubbo异步转同步的功能应该是通过DefaultFuture这个类实现的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/88487/a924d23fc43d31267473f2dc91396ec5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/88487/a924d23fc43d31267473f2dc91396ec5.png" alt=""></a></p><p>调用栈信息</p><p>不过为了理清前后关系，还是有必要分析一下调用DefaultFuture.get()之前发生了什么。DubboInvoker的108行调用了DefaultFuture.get()，这一行很关键，我稍微修改了一下列在了下面。这一行先调用了request(inv, timeout)方法，这个方法其实就是发送RPC请求，之后通过调用get()方法等待RPC返回结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DubboInvoker{</span></span>
<span class="line"><span>  Result doInvoke(Invocation inv){</span></span>
<span class="line"><span>    // 下面这行就是源码中108行</span></span>
<span class="line"><span>    // 为了便于展示，做了修改</span></span>
<span class="line"><span>    return currentClient</span></span>
<span class="line"><span>      .request(inv, timeout)</span></span>
<span class="line"><span>      .get();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>DefaultFuture这个类是很关键，我把相关的代码精简之后，列到了下面。不过在看代码之前，你还是有必要重复一下我们的需求：当RPC返回结果之前，阻塞调用线程，让调用线程等待；当RPC返回结果后，唤醒调用线程，让调用线程重新执行。不知道你有没有似曾相识的感觉，这不就是经典的等待-通知机制吗？这个时候想必你的脑海里应该能够浮现出管程的解决方案了。有了自己的方案之后，我们再来看看Dubbo是怎么实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建锁与条件变量</span></span>
<span class="line"><span>private final Lock lock</span></span>
<span class="line"><span>    = new ReentrantLock();</span></span>
<span class="line"><span>private final Condition done</span></span>
<span class="line"><span>    = lock.newCondition();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用方通过该方法等待结果</span></span>
<span class="line"><span>Object get(int timeout){</span></span>
<span class="line"><span>  long start = System.nanoTime();</span></span>
<span class="line"><span>  lock.lock();</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>	while (!isDone()) {</span></span>
<span class="line"><span>	  done.await(timeout);</span></span>
<span class="line"><span>      long cur=System.nanoTime();</span></span>
<span class="line"><span>	  if (isDone() ||</span></span>
<span class="line"><span>          cur-start &amp;gt; timeout){</span></span>
<span class="line"><span>	    break;</span></span>
<span class="line"><span>	  }</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>	lock.unlock();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (!isDone()) {</span></span>
<span class="line"><span>	throw new TimeoutException();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return returnFromResponse();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// RPC结果是否已经返回</span></span>
<span class="line"><span>boolean isDone() {</span></span>
<span class="line"><span>  return response != null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// RPC结果返回时调用该方法</span></span>
<span class="line"><span>private void doReceived(Response res) {</span></span>
<span class="line"><span>  lock.lock();</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    response = res;</span></span>
<span class="line"><span>    if (done != null) {</span></span>
<span class="line"><span>      done.signal();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    lock.unlock();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用线程通过调用get()方法等待RPC返回结果，这个方法里面，你看到的都是熟悉的“面孔”：调用lock()获取锁，在finally里面调用unlock()释放锁；获取锁后，通过经典的在循环中调用await()方法来实现等待。</p><p>当RPC结果返回时，会调用doReceived()方法，这个方法里面，调用lock()获取锁，在finally里面调用unlock()释放锁，获取锁后通过调用signal()来通知调用线程，结果已经返回，不用继续等待了。</p><p>至此，Dubbo里面的异步转同步的源码就分析完了，有没有觉得还挺简单的？最近这几年，工作中需要异步处理的越来越多了，其中有一个主要原因就是有些API本身就是异步API。例如websocket也是一个异步的通信协议，如果基于这个协议实现一个简单的RPC，你也会遇到异步转同步的问题。现在很多公有云的API本身也是异步的，例如创建云主机，就是一个异步的API，调用虽然成功了，但是云主机并没有创建成功，你需要调用另外一个API去轮询云主机的状态。如果你需要在项目内部封装创建云主机的API，你也会面临异步转同步的问题，因为同步的API更易用。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>Lock&amp;Condition是管程的一种实现，所以能否用好Lock和Condition要看你对管程模型理解得怎么样。管程的技术前面我们已经专门用了一篇文章做了介绍，你可以结合着来学，理论联系实践，有助于加深理解。</p><p>Lock&amp;Condition实现的管程相对于synchronized实现的管程来说更加灵活、功能也更丰富。</p><p>结合我自己的经验，我认为了解原理比了解实现更能让你快速学好并发编程，所以没有介绍太多Java SDK并发包里锁和条件变量是如何实现的。但如果你对实现感兴趣，可以参考 <a href="time://mall?url=https%3A%2F%2Fh5.youzan.com%2Fv2%2Fgoods%2F35z7jjvd4r4oo" target="_blank" rel="noreferrer">《Java并发编程的艺术》</a> 一书的第5章《Java中的锁》，里面详细介绍了实现原理，我觉得写得非常好。</p><p>另外，专栏里对DefaultFuture的代码缩减了很多，如果你感兴趣，也可以去看看完整版。</p><p>Dubbo的源代码在 <a href="https://github.com/apache/incubator-dubbo" target="_blank" rel="noreferrer">Github上</a>，DefaultFuture的路径是：incubator-dubbo/dubbo-remoting/dubbo-remoting-api/src/main/java/org/apache/dubbo/remoting/exchange/support/DefaultFuture.java。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>DefaultFuture里面唤醒等待的线程，用的是signal()，而不是signalAll()，你来分析一下，这样做是否合理呢？</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,39)])])}const h=a(l,[["render",i]]);export{b as __pageData,h as default};
