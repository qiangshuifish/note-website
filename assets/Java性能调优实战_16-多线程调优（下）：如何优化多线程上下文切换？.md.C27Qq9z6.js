import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"16 | 多线程调优（下）：如何优化多线程上下文切换？","description":"","frontmatter":{},"headers":[{"level":2,"title":"竞争锁优化","slug":"竞争锁优化","link":"#竞争锁优化","children":[{"level":3,"title":"1.减少锁的持有时间","slug":"_1-减少锁的持有时间","link":"#_1-减少锁的持有时间","children":[]},{"level":3,"title":"2.降低锁的粒度","slug":"_2-降低锁的粒度","link":"#_2-降低锁的粒度","children":[]},{"level":3,"title":"3.非阻塞乐观锁替代竞争锁","slug":"_3-非阻塞乐观锁替代竞争锁","link":"#_3-非阻塞乐观锁替代竞争锁","children":[]}]},{"level":2,"title":"wait/notify优化","slug":"wait-notify优化","link":"#wait-notify优化","children":[{"level":3,"title":"wait/notify的使用导致了较多的上下文切换","slug":"wait-notify的使用导致了较多的上下文切换","link":"#wait-notify的使用导致了较多的上下文切换","children":[]},{"level":3,"title":"优化wait/notify的使用，减少上下文切换","slug":"优化wait-notify的使用-减少上下文切换","link":"#优化wait-notify的使用-减少上下文切换","children":[]}]},{"level":2,"title":"合理地设置线程池大小，避免创建过多线程","slug":"合理地设置线程池大小-避免创建过多线程","link":"#合理地设置线程池大小-避免创建过多线程","children":[]},{"level":2,"title":"使用协程实现非阻塞等待","slug":"使用协程实现非阻塞等待","link":"#使用协程实现非阻塞等待","children":[]},{"level":2,"title":"减少Java虚拟机的垃圾回收","slug":"减少java虚拟机的垃圾回收","link":"#减少java虚拟机的垃圾回收","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Java性能调优实战/16-多线程调优（下）：如何优化多线程上下文切换？.md","filePath":"Java性能调优实战/16-多线程调优（下）：如何优化多线程上下文切换？.md","lastUpdated":1779815864000}'),l={name:"Java性能调优实战/16-多线程调优（下）：如何优化多线程上下文切换？.md"};function t(i,n,o,c,r,h){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_16-多线程调优-下-如何优化多线程上下文切换" tabindex="-1">16 | 多线程调优（下）：如何优化多线程上下文切换？ <a class="header-anchor" href="#_16-多线程调优-下-如何优化多线程上下文切换" aria-label="Permalink to &quot;16 | 多线程调优（下）：如何优化多线程上下文切换？&quot;">​</a></h1><p>你好，我是刘超。</p><p>通过上一讲的讲解，相信你对上下文切换已经有了一定的了解了。如果是单个线程，在 CPU 调用之后，那么它基本上是不会被调度出去的。如果可运行的线程数远大于 CPU 数量，那么操作系统最终会将某个正在运行的线程调度出来，从而使其它线程能够使用 CPU ，这就会导致上下文切换。</p><p>还有，在多线程中如果使用了竞争锁，当线程由于等待竞争锁而被阻塞时，JVM 通常会将这个线程挂起，并允许它被交换出去。如果频繁地发生阻塞，CPU 密集型的程序就会发生更多的上下文切换。</p><p>那么问题来了，我们知道在某些场景下使用多线程是非常必要的，但多线程编程给系统带来了上下文切换，从而增加的性能开销也是实打实存在的。那么我们该如何优化多线程上下文切换呢？这就是我今天要和你分享的话题，我将重点介绍几种常见的优化方法。</p><h2 id="竞争锁优化" tabindex="-1">竞争锁优化 <a class="header-anchor" href="#竞争锁优化" aria-label="Permalink to &quot;竞争锁优化&quot;">​</a></h2><p>大多数人在多线程编程中碰到性能问题，第一反应多是想到了锁。</p><p>多线程对锁资源的竞争会引起上下文切换，还有锁竞争导致的线程阻塞越多，上下文切换就越频繁，系统的性能开销也就越大。由此可见，在多线程编程中，锁其实不是性能开销的根源，竞争锁才是。</p><p>第11～13讲中我曾集中讲过锁优化，我们知道锁的优化归根结底就是减少竞争。这讲中我们就再来总结下锁优化的一些方式。</p><h3 id="_1-减少锁的持有时间" tabindex="-1">1.减少锁的持有时间 <a class="header-anchor" href="#_1-减少锁的持有时间" aria-label="Permalink to &quot;1.减少锁的持有时间&quot;">​</a></h3><p>我们知道，锁的持有时间越长，就意味着有越多的线程在等待该竞争资源释放。如果是Synchronized同步锁资源，就不仅是带来线程间的上下文切换，还有可能会增加进程间的上下文切换。</p><p>在第12讲中，我曾分享过一些更具体的方法，例如，可以将一些与锁无关的代码移出同步代码块，尤其是那些开销较大的操作以及可能被阻塞的操作。</p><ul><li>优化前</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public synchronized void mySyncMethod(){</span></span>
<span class="line"><span>        businesscode1();</span></span>
<span class="line"><span>        mutextMethod();</span></span>
<span class="line"><span>        businesscode2();</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ul><li>优化后</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void mySyncMethod(){</span></span>
<span class="line"><span>        businesscode1();</span></span>
<span class="line"><span>        synchronized(this)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            mutextMethod();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        businesscode2();</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="_2-降低锁的粒度" tabindex="-1">2.降低锁的粒度 <a class="header-anchor" href="#_2-降低锁的粒度" aria-label="Permalink to &quot;2.降低锁的粒度&quot;">​</a></h3><p>同步锁可以保证对象的原子性，我们可以考虑将锁粒度拆分得更小一些，以此避免所有线程对一个锁资源的竞争过于激烈。具体方式有以下两种：</p><ul><li>锁分离</li></ul><p>与传统锁不同的是，读写锁实现了锁分离，也就是说读写锁是由“读锁”和“写锁”两个锁实现的，其规则是可以共享读，但只有一个写。</p><p>这样做的好处是，在多线程读的时候，读读是不互斥的，读写是互斥的，写写是互斥的。而传统的独占锁在没有区分读写锁的时候，读写操作一般是：读读互斥、读写互斥、写写互斥。所以在读远大于写的多线程场景中，锁分离避免了在高并发读情况下的资源竞争，从而避免了上下文切换。</p><ul><li>锁分段</li></ul><p>我们在使用锁来保证集合或者大对象原子性时，可以考虑将锁对象进一步分解。例如，我之前讲过的 Java1.8 之前版本的 ConcurrentHashMap 就使用了锁分段。</p><h3 id="_3-非阻塞乐观锁替代竞争锁" tabindex="-1">3.非阻塞乐观锁替代竞争锁 <a class="header-anchor" href="#_3-非阻塞乐观锁替代竞争锁" aria-label="Permalink to &quot;3.非阻塞乐观锁替代竞争锁&quot;">​</a></h3><p>volatile关键字的作用是保障可见性及有序性，volatile的读写操作不会导致上下文切换，因此开销比较小。 但是，volatile不能保证操作变量的原子性，因为没有锁的排他性。</p><p>而 CAS 是一个原子的 if-then-act 操作，CAS 是一个无锁算法实现，保障了对一个共享变量读写操作的一致性。CAS 操作中有 3 个操作数，内存值 V、旧的预期值 A和要修改的新值 B，当且仅当 A 和 V 相同时，将 V 修改为 B，否则什么都不做，CAS 算法将不会导致上下文切换。Java 的 Atomic 包就使用了 CAS 算法来更新数据，就不需要额外加锁。</p><p>上面我们了解了如何从编码层面去优化竞争锁，那么除此之外，JVM内部其实也对Synchronized同步锁做了优化，我在12讲中有详细地讲解过，这里简单回顾一下。</p><p>在JDK1.6中，JVM将Synchronized同步锁分为了偏向锁、轻量级锁、自旋锁以及重量级锁，优化路径也是按照以上顺序进行。JIT 编译器在动态编译同步块的时候，也会通过锁消除、锁粗化的方式来优化该同步锁。</p><h2 id="wait-notify优化" tabindex="-1">wait/notify优化 <a class="header-anchor" href="#wait-notify优化" aria-label="Permalink to &quot;wait/notify优化&quot;">​</a></h2><p>在 Java 中，我们可以通过配合调用 Object 对象的 wait()方法和 notify()方法或 notifyAll() 方法来实现线程间的通信。</p><p>在线程中调用 wait()方法，将阻塞等待其它线程的通知（其它线程调用notify()方法或notifyAll()方法），在线程中调用 notify()方法或 notifyAll()方法，将通知其它线程从 wait()方法处返回。</p><p>下面我们通过wait() / notify()来实现一个简单的生产者和消费者的案例，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class WaitNotifyTest {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Vector&amp;lt;Integer&amp;gt; pool=new Vector&amp;lt;Integer&amp;gt;();</span></span>
<span class="line"><span>        Producer producer=new Producer(pool, 10);</span></span>
<span class="line"><span>        Consumer consumer=new Consumer(pool);</span></span>
<span class="line"><span>        new Thread(producer).start();</span></span>
<span class="line"><span>        new Thread(consumer).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 生产者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	class Producer implements Runnable{</span></span>
<span class="line"><span>	    private Vector&amp;lt;Integer&amp;gt; pool;</span></span>
<span class="line"><span>	    private Integer size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    public Producer(Vector&amp;lt;Integer&amp;gt;  pool, Integer size) {</span></span>
<span class="line"><span>	        this.pool = pool;</span></span>
<span class="line"><span>	        this.size = size;</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    public void run() {</span></span>
<span class="line"><span>	        for(;;){</span></span>
<span class="line"><span>	            try {</span></span>
<span class="line"><span>	                System.out.println(&quot;生产一个商品 &quot;);</span></span>
<span class="line"><span>	                produce(1);</span></span>
<span class="line"><span>	            } catch (InterruptedException e) {</span></span>
<span class="line"><span>	                // TODO Auto-generated catch block</span></span>
<span class="line"><span>	                e.printStackTrace();</span></span>
<span class="line"><span>	            }</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span>	    private void produce(int i) throws InterruptedException{</span></span>
<span class="line"><span>	        while(pool.size()==size){</span></span>
<span class="line"><span>	            synchronized (pool) {</span></span>
<span class="line"><span>	                System.out.println(&quot;生产者等待消费者消费商品,当前商品数量为&quot;+pool.size());</span></span>
<span class="line"><span>	                pool.wait();//等待消费者消费</span></span>
<span class="line"><span>	            }</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	        synchronized (pool) {</span></span>
<span class="line"><span>	            pool.add(i);</span></span>
<span class="line"><span>	            pool.notifyAll();//生产成功，通知消费者消费</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 消费者</span></span>
<span class="line"><span>	 * &amp;#64;author admin</span></span>
<span class="line"><span>	 *</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	class Consumer implements Runnable{</span></span>
<span class="line"><span>	    private Vector&amp;lt;Integer&amp;gt;  pool;</span></span>
<span class="line"><span>	    public Consumer(Vector&amp;lt;Integer&amp;gt;  pool) {</span></span>
<span class="line"><span>	        this.pool = pool;</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    public void run() {</span></span>
<span class="line"><span>	        for(;;){</span></span>
<span class="line"><span>	            try {</span></span>
<span class="line"><span>	                System.out.println(&quot;消费一个商品&quot;);</span></span>
<span class="line"><span>	                consume();</span></span>
<span class="line"><span>	            } catch (InterruptedException e) {</span></span>
<span class="line"><span>	                // TODO Auto-generated catch block</span></span>
<span class="line"><span>	                e.printStackTrace();</span></span>
<span class="line"><span>	            }</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    private void consume() throws InterruptedException{</span></span>
<span class="line"><span>	        synchronized (pool) {</span></span>
<span class="line"><span>	            while(pool.isEmpty()) {</span></span>
<span class="line"><span>	                System.out.println(&quot;消费者等待生产者生产商品,当前商品数量为&quot;+pool.size());</span></span>
<span class="line"><span>	                pool.wait();//等待生产者生产商品</span></span>
<span class="line"><span>	            }</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	        synchronized (pool) {</span></span>
<span class="line"><span>	            pool.remove(0);</span></span>
<span class="line"><span>	            pool.notifyAll();//通知生产者生产商品</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="wait-notify的使用导致了较多的上下文切换" tabindex="-1">wait/notify的使用导致了较多的上下文切换 <a class="header-anchor" href="#wait-notify的使用导致了较多的上下文切换" aria-label="Permalink to &quot;wait/notify的使用导致了较多的上下文切换&quot;">​</a></h3><p>结合以下图片，我们可以看到，在消费者第一次申请到锁之前，发现没有商品消费，此时会执行 Object.wait() 方法，这里会导致线程挂起，进入阻塞状态，这里为一次上下文切换。</p><p>当生产者获取到锁并执行notifyAll()之后，会唤醒处于阻塞状态的消费者线程，此时这里又发生了一次上下文切换。</p><p>被唤醒的等待线程在继续运行时，需要再次申请相应对象的内部锁，此时等待线程可能需要和其它新来的活跃线程争用内部锁，这也可能会导致上下文切换。</p><p>如果有多个消费者线程同时被阻塞，用notifyAll()方法，将会唤醒所有阻塞的线程。而某些商品依然没有库存，过早地唤醒这些没有库存的商品的消费线程，可能会导致线程再次进入阻塞状态，从而引起不必要的上下文切换。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/102974/601517ef35af63a9e470b8531124bc0a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/102974/601517ef35af63a9e470b8531124bc0a.jpg" alt=""></a></p><h3 id="优化wait-notify的使用-减少上下文切换" tabindex="-1">优化wait/notify的使用，减少上下文切换 <a class="header-anchor" href="#优化wait-notify的使用-减少上下文切换" aria-label="Permalink to &quot;优化wait/notify的使用，减少上下文切换&quot;">​</a></h3><p>首先，我们在多个不同消费场景中，可以使用 Object.notify() 替代 Object.notifyAll()。 因为Object.notify() 只会唤醒指定线程，不会过早地唤醒其它未满足需求的阻塞线程，所以可以减少相应的上下文切换。</p><p>其次，在生产者执行完 Object.notify() / notifyAll()唤醒其它线程之后，应该尽快地释放内部锁，以避免其它线程在唤醒之后长时间地持有锁处理业务操作，这样可以避免被唤醒的线程再次申请相应内部锁的时候等待锁的释放。</p><p>最后，为了避免长时间等待，我们常会使用Object.wait (long）设置等待超时时间，但线程无法区分其返回是由于等待超时还是被通知线程唤醒，从而导致线程再次尝试获取锁操作，增加了上下文切换。</p><p>这里我建议使用Lock锁结合Condition 接口替代Synchronized内部锁中的 wait / notify，实现等待／通知。这样做不仅可以解决上述的Object.wait(long) 无法区分的问题，还可以解决线程被过早唤醒的问题。</p><p>Condition 接口定义的 await 方法 、signal 方法和 signalAll 方法分别相当于 Object.wait()、 Object.notify()和 Object.notifyAll()。</p><h2 id="合理地设置线程池大小-避免创建过多线程" tabindex="-1">合理地设置线程池大小，避免创建过多线程 <a class="header-anchor" href="#合理地设置线程池大小-避免创建过多线程" aria-label="Permalink to &quot;合理地设置线程池大小，避免创建过多线程&quot;">​</a></h2><p>线程池的线程数量设置不宜过大，因为一旦线程池的工作线程总数超过系统所拥有的处理器数量，就会导致过多的上下文切换。更多关于如何合理设置线程池数量的内容，我将在第18讲中详解。</p><p>还有一种情况就是，在有些创建线程池的方法里，线程数量设置不会直接暴露给我们。比如，用 Executors.newCachedThreadPool() 创建的线程池，该线程池会复用其内部空闲的线程来处理新提交的任务，如果没有，再创建新的线程（不受 MAX_VALUE 限制），这样的线程池如果碰到大量且耗时长的任务场景，就会创建非常多的工作线程，从而导致频繁的上下文切换。因此，这类线程池就只适合处理大量且耗时短的非阻塞任务。</p><h2 id="使用协程实现非阻塞等待" tabindex="-1">使用协程实现非阻塞等待 <a class="header-anchor" href="#使用协程实现非阻塞等待" aria-label="Permalink to &quot;使用协程实现非阻塞等待&quot;">​</a></h2><p>相信很多人一听到协程（Coroutines），马上想到的就是Go语言。协程对于大部分 Java 程序员来说可能还有点陌生，但其在 Go 中的使用相对来说已经很成熟了。</p><p>协程是一种比线程更加轻量级的东西，相比于由操作系统内核来管理的进程和线程，协程则完全由程序本身所控制，也就是在用户态执行。协程避免了像线程切换那样产生的上下文切换，在性能方面得到了很大的提升。协程在多线程业务上的运用，我会在第18讲中详述。</p><h2 id="减少java虚拟机的垃圾回收" tabindex="-1">减少Java虚拟机的垃圾回收 <a class="header-anchor" href="#减少java虚拟机的垃圾回收" aria-label="Permalink to &quot;减少Java虚拟机的垃圾回收&quot;">​</a></h2><p>我们在上一讲讲上下文切换的诱因时，曾提到过“垃圾回收会导致上下文切换”。</p><p>很多 JVM 垃圾回收器（serial收集器、ParNew收集器）在回收旧对象时，会产生内存碎片，从而需要进行内存整理，在这个过程中就需要移动存活的对象。而移动内存对象就意味着这些对象所在的内存地址会发生变化，因此在移动对象前需要暂停线程，在移动完成后需要再次唤醒该线程。因此减少 JVM 垃圾回收的频率可以有效地减少上下文切换。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>上下文切换是多线程编程性能消耗的原因之一，而竞争锁、线程间的通信以及过多地创建线程等多线程编程操作，都会给系统带来上下文切换。除此之外，I/O阻塞以及JVM的垃圾回收也会增加上下文切换。</p><p>总的来说，过于频繁的上下文切换会影响系统的性能，所以我们应该避免它。另外，我们还可以将上下文切换也作为系统的性能参考指标，并将该指标纳入到服务性能监控，防患于未然。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>除了我总结中提到的线程间上下文切换的一些诱因，你还知道其它诱因吗？对应的优化方法又是什么？</p><p>期待在留言区看到你的分享。也欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他一起讨论。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/102974/bbe343640d6b708832c4133ec53ed967.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/102974/bbe343640d6b708832c4133ec53ed967.jpg" alt="unpreview"></a></p>`,61)])])}const b=a(l,[["render",t]]);export{u as __pageData,b as default};
