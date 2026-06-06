import{_ as n,H as s,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"19 | 如何用协程来优化多线程业务？","description":"","frontmatter":{},"headers":[{"level":2,"title":"线程实现模型","slug":"线程实现模型","link":"#线程实现模型","children":[{"level":3,"title":"1:1线程模型","slug":"_1-1线程模型","link":"#_1-1线程模型","children":[]},{"level":3,"title":"N:1线程模型","slug":"n-1线程模型","link":"#n-1线程模型","children":[]},{"level":3,"title":"N:M线程模型","slug":"n-m线程模型","link":"#n-m线程模型","children":[]}]},{"level":2,"title":"协程的实现原理","slug":"协程的实现原理","link":"#协程的实现原理","children":[]},{"level":2,"title":"Kilim协程框架","slug":"kilim协程框架","link":"#kilim协程框架","children":[]},{"level":2,"title":"协程与线程的性能比较","slug":"协程与线程的性能比较","link":"#协程与线程的性能比较","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Java性能调优实战/19-如何用协程来优化多线程业务？.md","filePath":"Java性能调优实战/19-如何用协程来优化多线程业务？.md","lastUpdated":1779815864000}'),e={name:"Java性能调优实战/19-如何用协程来优化多线程业务？.md"};function l(i,a,c,r,o,u){return s(),p("div",null,[...a[0]||(a[0]=[t(`<h1 id="_19-如何用协程来优化多线程业务" tabindex="-1">19 | 如何用协程来优化多线程业务？ <a class="header-anchor" href="#_19-如何用协程来优化多线程业务" aria-label="Permalink to &quot;19 | 如何用协程来优化多线程业务？&quot;">​</a></h1><p>你好，我是刘超。</p><p>近一两年，国内很多互联网公司开始使用或转型Go语言，其中一个很重要的原因就是Go语言优越的性能表现，而这个优势与Go实现的轻量级线程Goroutines（协程Coroutine）不无关系。那么Go协程的实现与Java线程的实现有什么区别呢？</p><h2 id="线程实现模型" tabindex="-1">线程实现模型 <a class="header-anchor" href="#线程实现模型" aria-label="Permalink to &quot;线程实现模型&quot;">​</a></h2><p>了解协程和线程的区别之前，我们不妨先来了解下底层实现线程几种方式，为后面的学习打个基础。</p><p>实现线程主要有三种方式：轻量级进程和内核线程一对一相互映射实现的1:1线程模型、用户线程和内核线程实现的N:1线程模型以及用户线程和轻量级进程混合实现的N:M线程模型。</p><h3 id="_1-1线程模型" tabindex="-1">1:1线程模型 <a class="header-anchor" href="#_1-1线程模型" aria-label="Permalink to &quot;1:1线程模型&quot;">​</a></h3><p>以上我提到的内核线程（Kernel-Level Thread, KLT）是由操作系统内核支持的线程，内核通过调度器对线程进行调度，并负责完成线程的切换。</p><p>我们知道在Linux操作系统编程中，往往都是通过fork()函数创建一个子进程来代表一个内核中的线程。一个进程调用fork()函数后，系统会先给新的进程分配资源，例如，存储数据和代码的空间。然后把原来进程的所有值都复制到新的进程中，只有少数值与原来进程的值（比如PID）不同，这相当于复制了一个主进程。</p><p>采用fork()创建子进程的方式来实现并行运行，会产生大量冗余数据，即占用大量内存空间，又消耗大量CPU时间用来初始化内存空间以及复制数据。</p><p>如果是一份一样的数据，为什么不共享主进程的这一份数据呢？这时候轻量级进程（Light Weight Process，即LWP）出现了。</p><p>相对于fork()系统调用创建的线程来说，LWP使用clone()系统调用创建线程，该函数是将部分父进程的资源的数据结构进行复制，复制内容可选，且没有被复制的资源可以通过指针共享给子进程。因此，轻量级进程的运行单元更小，运行速度更快。LWP是跟内核线程一对一映射的，每个LWP都是由一个内核线程支持。</p><h3 id="n-1线程模型" tabindex="-1">N:1线程模型 <a class="header-anchor" href="#n-1线程模型" aria-label="Permalink to &quot;N:1线程模型&quot;">​</a></h3><p>1:1线程模型由于跟内核是一对一映射，所以在线程创建、切换上都存在用户态和内核态的切换，性能开销比较大。除此之外，它还存在局限性，主要就是指系统的资源有限，不能支持创建大量的LWP。</p><p>N:1线程模型就可以很好地解决1:1线程模型的这两个问题。</p><p>该线程模型是在用户空间完成了线程的创建、同步、销毁和调度，已经不需要内核的帮助了，也就是说在线程创建、同步、销毁的过程中不会产生用户态和内核态的空间切换，因此线程的操作非常快速且低消耗。</p><h3 id="n-m线程模型" tabindex="-1">N:M线程模型 <a class="header-anchor" href="#n-m线程模型" aria-label="Permalink to &quot;N:M线程模型&quot;">​</a></h3><p>N:1线程模型的缺点在于操作系统不能感知用户态的线程，因此容易造成某一个线程进行系统调用内核线程时被阻塞，从而导致整个进程被阻塞。</p><p>N:M线程模型是基于上述两种线程模型实现的一种混合线程管理模型，即支持用户态线程通过LWP与内核线程连接，用户态的线程数量和内核态的LWP数量是N:M的映射关系。</p><p><strong>了解完这三个线程模型，你就可以清楚地了解到Go协程的实现与Java线程的实现有什么区别了。</strong></p><p>JDK 1.8 Thread.java 中 Thread#start 方法的实现，实际上是通过Native调用start0方法实现的；在Linux下， JVM Thread的实现是基于pthread_create实现的，而pthread_create实际上是调用了clone()完成系统调用创建线程的。</p><p>所以，目前Java在Linux操作系统下采用的是用户线程加轻量级线程，一个用户线程映射到一个内核线程，即1:1线程模型。由于线程是通过内核调度，从一个线程切换到另一个线程就涉及到了上下文切换。</p><p>而Go语言是使用了N:M线程模型实现了自己的调度器，它在N个内核线程上多路复用（或调度）M个协程，协程的上下文切换是在用户态由协程调度器完成的，因此不需要陷入内核，相比之下，这个代价就很小了。</p><h2 id="协程的实现原理" tabindex="-1">协程的实现原理 <a class="header-anchor" href="#协程的实现原理" aria-label="Permalink to &quot;协程的实现原理&quot;">​</a></h2><p>协程不只在Go语言中实现了，其实目前大部分语言都实现了自己的一套协程，包括C#、erlang、python、lua、javascript、ruby等。</p><p>相对于协程，你可能对进程和线程更为熟悉。进程一般代表一个应用服务，在一个应用服务中可以创建多个线程，而协程与进程、线程的概念不一样，我们可以将协程看作是一个类函数或者一块函数中的代码，我们可以在一个主线程里面轻松创建多个协程。</p><p>程序调用协程与调用函数不一样的是，协程可以通过暂停或者阻塞的方式将协程的执行挂起，而其它协程可以继续执行。这里的挂起只是在程序中（用户态）的挂起，同时将代码执行权转让给其它协程使用，待获取执行权的协程执行完成之后，将从挂起点唤醒挂起的协程。 协程的挂起和唤醒是通过一个调度器来完成的。</p><p>结合下图，你可以更清楚地了解到基于N:M线程模型实现的协程是如何工作的。</p><p>假设程序中默认创建两个线程为协程使用，在主线程中创建协程ABCD…，分别存储在就绪队列中，调度器首先会分配一个工作线程A执行协程A，另外一个工作线程B执行协程B，其它创建的协程将会放在队列中进行排队等待。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/104521/9b0a301337fa868eab1b9d32e6fcbd72.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/104521/9b0a301337fa868eab1b9d32e6fcbd72.jpg" alt=""></a></p><p>当协程A调用暂停方法或被阻塞时，协程A会进入到挂起队列，调度器会调用等待队列中的其它协程抢占线程A执行。当协程A被唤醒时，它需要重新进入到就绪队列中，通过调度器抢占线程，如果抢占成功，就继续执行协程A，失败则继续等待抢占线程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/104521/bebdfb057a9243e640515900eec4ed94.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/104521/bebdfb057a9243e640515900eec4ed94.jpg" alt=""></a></p><p>相比线程，协程少了由于同步资源竞争带来的CPU上下文切换，I/O密集型的应用比较适合使用，特别是在网络请求中，有较多的时间在等待后端响应，协程可以保证线程不会阻塞在等待网络响应中，充分利用了多核多线程的能力。而对于CPU密集型的应用，由于在多数情况下CPU都比较繁忙，协程的优势就不是特别明显了。</p><h2 id="kilim协程框架" tabindex="-1">Kilim协程框架 <a class="header-anchor" href="#kilim协程框架" aria-label="Permalink to &quot;Kilim协程框架&quot;">​</a></h2><p>虽然这么多的语言都实现了协程，但目前Java原生语言暂时还不支持协程。不过你也不用泄气，我们可以通过协程框架在Java中使用协程。</p><p>目前Kilim协程框架在Java中应用得比较多，通过这个框架，开发人员就可以低成本地在Java中使用协程了。</p><p>在Java中引入 <a href="https://github.com/kilim/kilim" target="_blank" rel="noreferrer">Kilim</a> ，和我们平时引入第三方组件不太一样，除了引入jar包之外，还需要通过Kilim提供的织入（Weaver）工具对Java代码编译生成的字节码进行增强处理，比如，识别哪些方式是可暂停的，对相关的方法添加上下文处理。通常有以下四种方式可以实现这种织入操作：</p><ul><li>在编译时使用maven插件；</li><li>在运行时调用kilim.tools.Weaver工具；</li><li>在运行时使用kilim.tools.Kilim invoking调用Kilim的类文件；</li><li>在main函数添加 if (kilim.tools.Kilim.trampoline(false,args)) return。</li></ul><p>Kilim框架包含了四个核心组件，分别为：任务载体（Task）、任务上下文（Fiber）、任务调度器（Scheduler）以及通信载体（Mailbox）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/104521/20e81165d99c5fc1a55424156e15ff13.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/104521/20e81165d99c5fc1a55424156e15ff13.jpg" alt=""></a></p><p>Task对象主要用来执行业务逻辑，我们可以把这个比作多线程的Thread，与Thread类似，Task中也有一个run方法，不过在Task中方法名为execute，我们可以将协程里面要做的业务逻辑操作写在execute方法中。</p><p>与Thread实现的线程一样，Task实现的协程也有状态，包括：Ready、Running、Pausing、Paused以及Done总共五种。Task对象被创建后，处于Ready状态，在调用execute()方法后，协程处于Running状态，在运行期间，协程可以被暂停，暂停中的状态为Pausing，暂停后的状态为Paused，暂停后的协程可以被再次唤醒。协程正常结束后的状态为Done。</p><p>Fiber对象与Java的线程栈类似，主要用来维护Task的执行堆栈，Fiber是实现N:M线程映射的关键。</p><p>Scheduler是Kilim实现协程的核心调度器，Scheduler负责分派Task给指定的工作者线程WorkerThread执行，工作者线程WorkerThread默认初始化个数为机器的CPU个数。</p><p>Mailbox对象类似一个邮箱，协程之间可以依靠邮箱来进行通信和数据共享。协程与线程最大的不同就是，线程是通过共享内存来实现数据共享，而协程是使用了通信的方式来实现了数据共享，主要就是为了避免内存共享数据而带来的线程安全问题。</p><h2 id="协程与线程的性能比较" tabindex="-1">协程与线程的性能比较 <a class="header-anchor" href="#协程与线程的性能比较" aria-label="Permalink to &quot;协程与线程的性能比较&quot;">​</a></h2><p>接下来，我们通过一个简单的生产者和消费者的案例，来对比下协程和线程的性能。可通过 <a href="https://github.com/nickliuchao/coroutine" target="_blank" rel="noreferrer">Github</a> 下载本地运行代码。</p><p>Java多线程实现源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyThread {</span></span>
<span class="line"><span>	private static Integer count = 0;//</span></span>
<span class="line"><span>	private static final Integer FULL = 10; //最大生产数量</span></span>
<span class="line"><span>	private static String LOCK = &quot;lock&quot;; //资源锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span>		MyThread test1 = new MyThread();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		long start = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		List&amp;lt;Thread&amp;gt; list = new ArrayList&amp;lt;Thread&amp;gt;();</span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; 1000; i++) {//创建五个生产者线程</span></span>
<span class="line"><span>			Thread thread = new Thread(test1.new Producer());</span></span>
<span class="line"><span>			thread.start();</span></span>
<span class="line"><span>			list.add(thread);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; 1000; i++) {//创建五个消费者线程</span></span>
<span class="line"><span>			Thread thread = new Thread(test1.new Consumer());</span></span>
<span class="line"><span>			thread.start();</span></span>
<span class="line"><span>			list.add(thread);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			for (Thread thread : list) {</span></span>
<span class="line"><span>				thread.join();//等待所有线程执行完</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		} catch (InterruptedException e) {</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		long end = System.currentTimeMillis();</span></span>
<span class="line"><span>		System.out.println(&quot;子线程执行时长：&quot; + (end - start));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    //生产者</span></span>
<span class="line"><span>	class Producer implements Runnable {</span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 10; i++) {</span></span>
<span class="line"><span>				synchronized (LOCK) {</span></span>
<span class="line"><span>					while (count == FULL) {//当数量满了时</span></span>
<span class="line"><span>						try {</span></span>
<span class="line"><span>							LOCK.wait();</span></span>
<span class="line"><span>						} catch (Exception e) {</span></span>
<span class="line"><span>							e.printStackTrace();</span></span>
<span class="line"><span>						}</span></span>
<span class="line"><span>					}</span></span>
<span class="line"><span>					count++;</span></span>
<span class="line"><span>					System.out.println(Thread.currentThread().getName() + &quot;生产者生产，目前总共有&quot; + count);</span></span>
<span class="line"><span>					LOCK.notifyAll();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    //消费者</span></span>
<span class="line"><span>	class Consumer implements Runnable {</span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			for (int i = 0; i &amp;lt; 10; i++) {</span></span>
<span class="line"><span>				synchronized (LOCK) {</span></span>
<span class="line"><span>					while (count == 0) {//当数量为零时</span></span>
<span class="line"><span>						try {</span></span>
<span class="line"><span>							LOCK.wait();</span></span>
<span class="line"><span>						} catch (Exception e) {</span></span>
<span class="line"><span>						}</span></span>
<span class="line"><span>					}</span></span>
<span class="line"><span>					count--;</span></span>
<span class="line"><span>					System.out.println(Thread.currentThread().getName() + &quot;消费者消费，目前总共有&quot; + count);</span></span>
<span class="line"><span>					LOCK.notifyAll();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Kilim协程框架实现源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Coroutine  {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		static Map&amp;lt;Integer, Mailbox&amp;lt;Integer&amp;gt;&amp;gt; mailMap = new HashMap&amp;lt;Integer, Mailbox&amp;lt;Integer&amp;gt;&amp;gt;();//为每个协程创建一个信箱，由于协程中不能多个消费者共用一个信箱，需要为每个消费者提供一个信箱，这也是协程通过通信来保证共享变量的线程安全的一种方式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (kilim.tools.Kilim.trampoline(false,args)) return;</span></span>
<span class="line"><span>		Properties propes = new Properties();</span></span>
<span class="line"><span>		propes.setProperty(&quot;kilim.Scheduler.numThreads&quot;, &quot;1&quot;);//设置一个线程</span></span>
<span class="line"><span>		System.setProperties(propes);</span></span>
<span class="line"><span>		long startTime = System.currentTimeMillis();</span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; 1000; i++) {//创建一千生产者</span></span>
<span class="line"><span>			Mailbox&amp;lt;Integer&amp;gt; mb = new Mailbox&amp;lt;Integer&amp;gt;(1, 10);</span></span>
<span class="line"><span>			new Producer(i, mb).start();</span></span>
<span class="line"><span>			mailMap.put(i, mb);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; 1000; i++) {//创建一千个消费者</span></span>
<span class="line"><span>			new Consumer(mailMap.get(i)).start();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		Task.idledown();//开始运行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		 long endTime = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	     System.out.println( Thread.currentThread().getName()  + &quot;总计花费时长：&quot; + (endTime- startTime));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//生产者</span></span>
<span class="line"><span>public class Producer extends Task&amp;lt;Object&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	Integer count = null;</span></span>
<span class="line"><span>	Mailbox&amp;lt;Integer&amp;gt; mb = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public Producer(Integer count, Mailbox&amp;lt;Integer&amp;gt; mb) {</span></span>
<span class="line"><span>		this.count = count;</span></span>
<span class="line"><span>		this.mb = mb;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void execute() throws Pausable {</span></span>
<span class="line"><span>		count = count*10;</span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; 10; i++) {</span></span>
<span class="line"><span>			mb.put(count);//当空间不足时，阻塞协程线程</span></span>
<span class="line"><span>			System.out.println(Thread.currentThread().getName() + &quot;生产者生产，目前总共有&quot; + mb.size() + &quot;生产了：&quot; + count);</span></span>
<span class="line"><span>			count++;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//消费者</span></span>
<span class="line"><span>public class Consumer extends Task&amp;lt;Object&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	Mailbox&amp;lt;Integer&amp;gt; mb = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public Consumer(Mailbox&amp;lt;Integer&amp;gt; mb) {</span></span>
<span class="line"><span>		this.mb = mb;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 执行</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void execute() throws Pausable {</span></span>
<span class="line"><span>		Integer c = null;</span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; 10000; i++)  {</span></span>
<span class="line"><span>			c = mb.get();//获取消息，阻塞协程线程</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (c == null) {</span></span>
<span class="line"><span>				System.out.println(&quot;计数&quot;);</span></span>
<span class="line"><span>			}else {</span></span>
<span class="line"><span>				System.out.println(Thread.currentThread().getName() + &quot;消费者消费，目前总共有&quot; + mb.size() + &quot;消费了：&quot; + c);</span></span>
<span class="line"><span>				c = null;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个案例中，我创建了1000个生产者和1000个消费者，每个生产者生产10个产品，1000个消费者同时消费产品。我们可以看到两个例子运行的结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>多线程执行时长：2761</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>协程执行时长：1050</span></span></code></pre></div><p>通过上述性能对比，我们可以发现：在有严重阻塞的场景下，协程的性能更胜一筹。其实，I/O阻塞型场景也就是协程在Java中的主要应用。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>协程和线程密切相关，协程可以认为是运行在线程上的代码块，协程提供的挂起操作会使协程暂停执行，而不会导致线程阻塞。</p><p>协程又是一种轻量级资源，即使创建了上千个协程，对于系统来说也不是很大的负担，但如果在程序中创建上千个线程，那系统可真就压力山大了。可以说，协程的设计方式极大地提高了线程的使用率。</p><p>通过今天的学习，当其他人侃侃而谈Go语言在网络编程中的优势时，相信你不会一头雾水。学习Java的我们也不要觉得，协程离我们很遥远了。协程是一种设计思想，不仅仅局限于某一门语言，况且Java已经可以借助协程框架实现协程了。</p><p>但话说回来，协程还是在Go语言中的应用较为成熟，在Java中的协程目前还不是很稳定，重点是缺乏大型项目的验证，可以说Java的协程设计还有很长的路要走。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在Java中，除了Kilim框架，你知道还有其它协程框架也可以帮助Java实现协程吗？你使用过吗？</p><p>期待在留言区看到你的见解。也欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他一起讨论。</p>`,65)])])}const m=n(e,[["render",l]]);export{d as __pageData,m as default};
