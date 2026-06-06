import{_ as s,H as a,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"30 | 生产者消费者模式：电商库存设计优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"Object的wait/notify/notifyAll实现生产者消费者","slug":"object的wait-notify-notifyall实现生产者消费者","link":"#object的wait-notify-notifyall实现生产者消费者","children":[]},{"level":2,"title":"Lock中Condition的await/signal/signalAll实现生产者消费者","slug":"lock中condition的await-signal-signalall实现生产者消费者","link":"#lock中condition的await-signal-signalall实现生产者消费者","children":[]},{"level":2,"title":"BlockingQueue实现生产者消费者","slug":"blockingqueue实现生产者消费者","link":"#blockingqueue实现生产者消费者","children":[]},{"level":2,"title":"生产者消费者优化电商库存设计","slug":"生产者消费者优化电商库存设计","link":"#生产者消费者优化电商库存设计","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Java性能调优实战/30-生产者消费者模式：电商库存设计优化.md","filePath":"Java性能调优实战/30-生产者消费者模式：电商库存设计优化.md","lastUpdated":1779815864000}'),l={name:"Java性能调优实战/30-生产者消费者模式：电商库存设计优化.md"};function e(i,n,c,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[t(`<h1 id="_30-生产者消费者模式-电商库存设计优化" tabindex="-1">30 | 生产者消费者模式：电商库存设计优化 <a class="header-anchor" href="#_30-生产者消费者模式-电商库存设计优化" aria-label="Permalink to &quot;30 | 生产者消费者模式：电商库存设计优化&quot;">​</a></h1><p>你好，我是刘超。</p><p>生产者消费者模式，在之前的一些案例中，我们是有使用过的，相信你有一定的了解。这个模式是一个十分经典的多线程并发协作模式，生产者与消费者是通过一个中间容器来解决强耦合关系，并以此来实现不同的生产与消费速度，从而达到缓冲的效果。</p><p>使用生产者消费者模式，可以提高系统的性能和吞吐量，今天我们就来看看该模式的几种实现方式，还有其在电商库存中的应用。</p><h2 id="object的wait-notify-notifyall实现生产者消费者" tabindex="-1">Object的wait/notify/notifyAll实现生产者消费者 <a class="header-anchor" href="#object的wait-notify-notifyall实现生产者消费者" aria-label="Permalink to &quot;Object的wait/notify/notifyAll实现生产者消费者&quot;">​</a></h2><p>在 <a href="https://time.geekbang.org/column/article/102974" target="_blank" rel="noreferrer">第16讲</a> 中，我就曾介绍过使用Object的wait/notify/notifyAll实现生产者消费者模式，这种方式是基于Object的wait/notify/notifyAll与对象监视器（Monitor）实现线程间的等待和通知。</p><p>还有，在 <a href="https://time.geekbang.org/column/article/101244" target="_blank" rel="noreferrer">第12讲</a> 中我也详细讲解过Monitor的工作原理，借此我们可以得知，这种方式实现的生产者消费者模式是基于内核来实现的，有可能会导致大量的上下文切换，所以性能并不是最理想的。</p><h2 id="lock中condition的await-signal-signalall实现生产者消费者" tabindex="-1">Lock中Condition的await/signal/signalAll实现生产者消费者 <a class="header-anchor" href="#lock中condition的await-signal-signalall实现生产者消费者" aria-label="Permalink to &quot;Lock中Condition的await/signal/signalAll实现生产者消费者&quot;">​</a></h2><p>相对Object类提供的wait/notify/notifyAll方法实现的生产者消费者模式，我更推荐使用java.util.concurrent包提供的Lock &amp;&amp; Condition实现的生产者消费者模式。</p><p>在接口Condition类中定义了await/signal/signalAll 方法，其作用与Object的wait/notify/notifyAll方法类似，该接口类与显示锁Lock配合，实现对线程的阻塞和唤醒操作。</p><p>我在 <a href="https://time.geekbang.org/column/article/101651" target="_blank" rel="noreferrer">第13讲</a> 中详细讲到了显示锁，显示锁ReentrantLock或ReentrantReadWriteLock都是基于AQS实现的，而在AQS中有一个内部类ConditionObject实现了Condition接口。</p><p>我们知道AQS中存在一个同步队列（CLH队列），当一个线程没有获取到锁时就会进入到同步队列中进行阻塞，如果被唤醒后获取到锁，则移除同步队列。</p><p>除此之外，AQS中还存在一个条件队列，通过addWaiter方法，可以将await()方法调用的线程放入到条件队列中，线程进入等待状态。当调用signal以及signalAll 方法后，线程将会被唤醒，并从条件队列中删除，之后进入到同步队列中。条件队列是通过一个单向链表实现的，所以Condition支持多个等待队列。</p><p>由上可知，Lock中Condition的await/signal/signalAll实现的生产者消费者模式，是基于Java代码层实现的，所以在性能和扩展性方面都更有优势。</p><p>下面来看一个案例，我们通过一段代码来实现一个商品库存的生产和消费。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LockConditionTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private LinkedList&amp;lt;String&amp;gt; product = new LinkedList&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private int maxInventory = 10; // 最大库存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private Lock lock = new ReentrantLock();// 资源锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private Condition condition = lock.newCondition();// 库存非满和非空条件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 新增商品库存</span></span>
<span class="line"><span>	 * &amp;#64;param e</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void produce(String e) {</span></span>
<span class="line"><span>		lock.lock();</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			while (product.size() == maxInventory) {</span></span>
<span class="line"><span>				condition.await();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			product.add(e);</span></span>
<span class="line"><span>			System.out.println(&quot;放入一个商品库存，总库存为：&quot; + product.size());</span></span>
<span class="line"><span>			condition.signalAll();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		} catch (Exception ex) {</span></span>
<span class="line"><span>			ex.printStackTrace();</span></span>
<span class="line"><span>		} finally {</span></span>
<span class="line"><span>			lock.unlock();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费商品</span></span>
<span class="line"><span>	 * &amp;#64;return</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public String consume() {</span></span>
<span class="line"><span>		String result = null;</span></span>
<span class="line"><span>		lock.lock();</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			while (product.size() == 0) {</span></span>
<span class="line"><span>				condition.await();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			result = product.removeLast();</span></span>
<span class="line"><span>			System.out.println(&quot;消费一个商品，总库存为：&quot; + product.size());</span></span>
<span class="line"><span>			condition.signalAll();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		} catch (Exception e) {</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		} finally {</span></span>
<span class="line"><span>			lock.unlock();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		return result;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 生产者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private class Producer implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 20; i++) {</span></span>
<span class="line"><span>				produce(&quot;商品&quot; + i);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private class Customer implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 20; i++) {</span></span>
<span class="line"><span>				consume();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		LockConditionTest lc = new LockConditionTest();</span></span>
<span class="line"><span>		new Thread(lc.new Producer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Customer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Producer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Customer()).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看完案例，请你思考下，我们对此还有优化的空间吗？</p><p>从代码中应该不难发现，生产者和消费者都在竞争同一把锁，而实际上两者没有同步关系，由于Condition能够支持多个等待队列以及不响应中断， 所以我们可以将生产者和消费者的等待条件和锁资源分离，从而进一步优化系统并发性能，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	private LinkedList&amp;lt;String&amp;gt; product = new LinkedList&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span>	private AtomicInteger inventory = new AtomicInteger(0);//实时库存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private int maxInventory = 10; // 最大库存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private Lock consumerLock = new ReentrantLock();// 资源锁</span></span>
<span class="line"><span>	private Lock productLock = new ReentrantLock();// 资源锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private Condition notEmptyCondition = consumerLock.newCondition();// 库存满和空条件</span></span>
<span class="line"><span>	private Condition notFullCondition = productLock.newCondition();// 库存满和空条件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 新增商品库存</span></span>
<span class="line"><span>	 * &amp;#64;param e</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void produce(String e) {</span></span>
<span class="line"><span>		productLock.lock();</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			while (inventory.get() == maxInventory) {</span></span>
<span class="line"><span>				notFullCondition.await();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			product.add(e);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			System.out.println(&quot;放入一个商品库存，总库存为：&quot; + inventory.incrementAndGet());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if(inventory.get()&amp;lt;maxInventory) {</span></span>
<span class="line"><span>				notFullCondition.signalAll();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		} catch (Exception ex) {</span></span>
<span class="line"><span>			ex.printStackTrace();</span></span>
<span class="line"><span>		} finally {</span></span>
<span class="line"><span>			productLock.unlock();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if(inventory.get()&amp;gt;0) {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				consumerLock.lockInterruptibly();</span></span>
<span class="line"><span>				notEmptyCondition.signalAll();</span></span>
<span class="line"><span>			} catch (InterruptedException e1) {</span></span>
<span class="line"><span>				// TODO Auto-generated catch block</span></span>
<span class="line"><span>				e1.printStackTrace();</span></span>
<span class="line"><span>			}finally {</span></span>
<span class="line"><span>				consumerLock.unlock();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费商品</span></span>
<span class="line"><span>	 * &amp;#64;return</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public String consume() {</span></span>
<span class="line"><span>		String result = null;</span></span>
<span class="line"><span>		consumerLock.lock();</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			while (inventory.get() == 0) {</span></span>
<span class="line"><span>				notEmptyCondition.await();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			result = product.removeLast();</span></span>
<span class="line"><span>			System.out.println(&quot;消费一个商品，总库存为：&quot; + inventory.decrementAndGet());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if(inventory.get()&amp;gt;0) {</span></span>
<span class="line"><span>				notEmptyCondition.signalAll();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		} catch (Exception e) {</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		} finally {</span></span>
<span class="line"><span>			consumerLock.unlock();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if(inventory.get()&amp;lt;maxInventory) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				productLock.lockInterruptibly();</span></span>
<span class="line"><span>				notFullCondition.signalAll();</span></span>
<span class="line"><span>			} catch (InterruptedException e1) {</span></span>
<span class="line"><span>				// TODO Auto-generated catch block</span></span>
<span class="line"><span>				e1.printStackTrace();</span></span>
<span class="line"><span>			}finally {</span></span>
<span class="line"><span>				productLock.unlock();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return result;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 生产者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private class Producer implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 20; i++) {</span></span>
<span class="line"><span>				produce(&quot;商品&quot; + i);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private class Customer implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 20; i++) {</span></span>
<span class="line"><span>				consume();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		LockConditionTest2 lc = new LockConditionTest2();</span></span>
<span class="line"><span>		new Thread(lc.new Producer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Customer()).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们分别创建 productLock 以及 consumerLock 两个锁资源，前者控制生产者线程并行操作，后者控制消费者线程并发运行；同时也设置两个条件变量，一个是notEmptyCondition，负责控制消费者线程状态，一个是notFullCondition，负责控制生产者线程状态。这样优化后，可以减少消费者与生产者的竞争，实现两者并发执行。</p><p>我们这里是基于LinkedList来存取库存的，虽然LinkedList是非线程安全，但我们新增是操作头部，而消费是操作队列的尾部，理论上来说没有线程安全问题。而库存的实际数量inventory是基于AtomicInteger（CAS锁）线程安全类实现的，既可以保证原子性，也可以保证消费者和生产者之间是可见的。</p><h2 id="blockingqueue实现生产者消费者" tabindex="-1">BlockingQueue实现生产者消费者 <a class="header-anchor" href="#blockingqueue实现生产者消费者" aria-label="Permalink to &quot;BlockingQueue实现生产者消费者&quot;">​</a></h2><p>相对前两种实现方式，BlockingQueue实现是最简单明了的，也是最容易理解的。</p><p>因为BlockingQueue是线程安全的，且从队列中获取或者移除元素时，如果队列为空，获取或移除操作则需要等待，直到队列不为空；同时，如果向队列中添加元素，假设此时队列无可用空间，添加操作也需要等待。所以BlockingQueue非常适合用来实现生产者消费者模式。还是以一个案例来看下它的优化，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BlockingQueueTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private int maxInventory = 10; // 最大库存</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private BlockingQueue&amp;lt;String&amp;gt; product = new LinkedBlockingQueue&amp;lt;&amp;gt;(maxInventory);//缓存队列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 新增商品库存</span></span>
<span class="line"><span>	 * &amp;#64;param e</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void produce(String e) {</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			product.put(e);</span></span>
<span class="line"><span>			System.out.println(&quot;放入一个商品库存，总库存为：&quot; + product.size());</span></span>
<span class="line"><span>		} catch (InterruptedException e1) {</span></span>
<span class="line"><span>			// TODO Auto-generated catch block</span></span>
<span class="line"><span>			e1.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费商品</span></span>
<span class="line"><span>	 * &amp;#64;return</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public String consume() {</span></span>
<span class="line"><span>		String result = null;</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			result = product.take();</span></span>
<span class="line"><span>			System.out.println(&quot;消费一个商品，总库存为：&quot; + product.size());</span></span>
<span class="line"><span>		} catch (InterruptedException e) {</span></span>
<span class="line"><span>			// TODO Auto-generated catch block</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		return result;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 生产者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private class Producer implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 20; i++) {</span></span>
<span class="line"><span>				produce(&quot;商品&quot; + i);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private class Customer implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 20; i++) {</span></span>
<span class="line"><span>				consume();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		BlockingQueueTest lc = new BlockingQueueTest();</span></span>
<span class="line"><span>		new Thread(lc.new Producer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Customer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Producer()).start();</span></span>
<span class="line"><span>		new Thread(lc.new Customer()).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个案例中，我们创建了一个LinkedBlockingQueue，并设置队列大小。之后我们创建一个消费方法consume()，方法里面调用LinkedBlockingQueue中的take()方法，消费者通过该方法获取商品，当队列中商品数量为零时，消费者将进入等待状态；我们再创建一个生产方法produce()，方法里面调用LinkedBlockingQueue中的put()方法，生产方通过该方法往队列中放商品，如果队列满了，生产者就将进入等待状态。</p><h2 id="生产者消费者优化电商库存设计" tabindex="-1">生产者消费者优化电商库存设计 <a class="header-anchor" href="#生产者消费者优化电商库存设计" aria-label="Permalink to &quot;生产者消费者优化电商库存设计&quot;">​</a></h2><p>了解完生产者消费者模式的几种常见实现方式，接下来我们就具体看看该模式是如何优化电商库存设计的。</p><p>电商系统中经常会有抢购活动，在这类促销活动中，抢购商品的库存实际是存在库存表中的。为了提高抢购性能，我们通常会将库存存放在缓存中，通过缓存中的库存来实现库存的精确扣减。在提交订单并付款之后，我们还需要再去扣除数据库中的库存。如果遇到瞬时高并发，我们还都去操作数据库的话，那么在单表单库的情况下，数据库就很可能会出现性能瓶颈。</p><p>而我们库存表如果要实现分库分表，势必会增加业务的复杂度。试想一个商品的库存分别在不同库的表中，我们在扣除库存时，又该如何判断去哪个库中扣除呢？</p><p>如果随意扣除表中库存，那么就会出现有些表已经扣完了，有些表中还有库存的情况，这样的操作显然是不合理的，此时就需要额外增加逻辑判断来解决问题。</p><p>在不分库分表的情况下，为了提高订单中扣除库存业务的性能以及吞吐量，我们就可以采用生产者消费者模式来实现系统的性能优化。</p><p>创建订单等于生产者，存放订单的队列则是缓冲容器，而从队列中消费订单则是数据库扣除库存操作。其中存放订单的队列可以极大限度地缓冲高并发给数据库带来的压力。</p><p>我们还可以基于消息队列来实现生产者消费者模式，如今RabbitMQ、RocketMQ都实现了事务，我们只需要将订单通过事务提交到MQ中，扣除库存的消费方只需要通过消费MQ来逐步操作数据库即可。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>使用生产者消费者模式来缓冲高并发数据库扣除库存压力，类似这样的例子其实还有很多。</p><p>例如，我们平时使用消息队列来做高并发流量削峰，也是基于这个原理。抢购商品时，如果所有的抢购请求都直接进入判断是否有库存和冻结缓存库存等逻辑业务中，由于这些逻辑业务操作会增加资源消耗，就可能会压垮应用服务。此时，为了保证系统资源使用的合理性，我们可以通过一个消息队列来缓冲瞬时的高并发请求。</p><p>生产者消费者模式除了可以做缓冲优化系统性能之外，它还可以应用在处理一些执行任务时间比较长的场景中。</p><p>例如导出报表业务，用户在导出一种比较大的报表时，通常需要等待很长时间，这样的用户体验是非常差的。通常我们可以固定一些报表内容，比如用户经常需要在今天导出昨天的销量报表，或者在月初导出上个月的报表，我们就可以提前将报表导出到本地或内存中，这样用户就可以在很短的时间内直接下载报表了。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>我们可以用生产者消费者模式来实现瞬时高并发的流量削峰，然而这样做虽然缓解了消费方的压力，但生产方则会因为瞬时高并发，而发生大量线程阻塞。面对这样的情况，你知道有什么方式可以优化线程阻塞所带来的性能问题吗？</p><p>期待在留言区看到你的见解。也欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他一起讨论。</p>`,42)])])}const k=s(l,[["render",e]]);export{m as __pageData,k as default};
