import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"第15讲 | synchronized和ReentrantLock有什么区别呢？","description":"","frontmatter":{},"headers":[{"level":2,"title":"典型回答","slug":"典型回答","link":"#典型回答","children":[]},{"level":2,"title":"考点分析","slug":"考点分析","link":"#考点分析","children":[]},{"level":2,"title":"知识扩展","slug":"知识扩展","link":"#知识扩展","children":[]},{"level":2,"title":"一课一练","slug":"一课一练","link":"#一课一练","children":[]}],"relativePath":"Java核心技术面试精讲/第15讲-synchronized和ReentrantLock有什么区别呢？.md","filePath":"Java核心技术面试精讲/第15讲-synchronized和ReentrantLock有什么区别呢？.md","lastUpdated":1779815890000}'),t={name:"Java核心技术面试精讲/第15讲-synchronized和ReentrantLock有什么区别呢？.md"};function i(l,n,c,o,r,d){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="第15讲-synchronized和reentrantlock有什么区别呢" tabindex="-1">第15讲 | synchronized和ReentrantLock有什么区别呢？ <a class="header-anchor" href="#第15讲-synchronized和reentrantlock有什么区别呢" aria-label="Permalink to &quot;第15讲 | synchronized和ReentrantLock有什么区别呢？&quot;">​</a></h1><p>从今天开始，我们将进入Java并发学习阶段。软件并发已经成为现代软件开发的基础能力，而Java精心设计的高效并发机制，正是构建大规模应用的基础之一，所以考察并发基本功也成为各个公司面试Java工程师的必选项。</p><p>今天我要问你的问题是， synchronized和ReentrantLock有什么区别？有人说synchronized最慢，这话靠谱吗？</p><h2 id="典型回答" tabindex="-1">典型回答 <a class="header-anchor" href="#典型回答" aria-label="Permalink to &quot;典型回答&quot;">​</a></h2><p>synchronized是Java内建的同步机制，所以也有人称其为Intrinsic Locking，它提供了互斥的语义和可见性，当一个线程已经获取当前锁时，其他试图获取的线程只能等待或者阻塞在那里。</p><p>在Java 5以前，synchronized是仅有的同步手段，在代码中， synchronized可以用来修饰方法，也可以使用在特定的代码块儿上，本质上synchronized方法等同于把方法全部语句用synchronized块包起来。</p><p>ReentrantLock，通常翻译为再入锁，是Java 5提供的锁实现，它的语义和synchronized基本相同。再入锁通过代码直接调用lock()方法获取，代码书写也更加灵活。与此同时，ReentrantLock提供了很多实用的方法，能够实现很多synchronized无法做到的细节控制，比如可以控制fairness，也就是公平性，或者利用定义条件等。但是，编码中也需要注意，必须要明确调用unlock()方法释放，不然就会一直持有该锁。</p><p>synchronized和ReentrantLock的性能不能一概而论，早期版本synchronized在很多场景下性能相差较大，在后续版本进行了较多改进，在低竞争场景中表现可能优于ReentrantLock。</p><h2 id="考点分析" tabindex="-1">考点分析 <a class="header-anchor" href="#考点分析" aria-label="Permalink to &quot;考点分析&quot;">​</a></h2><p>今天的题目是考察并发编程的常见基础题，我给出的典型回答算是一个相对全面的总结。</p><p>对于并发编程，不同公司或者面试官面试风格也不一样，有个别大厂喜欢一直追问你相关机制的扩展或者底层，有的喜欢从实用角度出发，所以你在准备并发编程方面需要一定的耐心。</p><p>我认为，锁作为并发的基础工具之一，你至少需要掌握：</p><ul><li><p>理解什么是线程安全。</p></li><li><p>synchronized、ReentrantLock等机制的基本使用与案例。</p></li></ul><p>更进一步，你还需要：</p><ul><li><p>掌握synchronized、ReentrantLock底层实现；理解锁膨胀、降级；理解偏斜锁、自旋锁、轻量级锁、重量级锁等概念。</p></li><li><p>掌握并发包中java.util.concurrent.lock各种不同实现和案例分析。</p></li></ul><h2 id="知识扩展" tabindex="-1">知识扩展 <a class="header-anchor" href="#知识扩展" aria-label="Permalink to &quot;知识扩展&quot;">​</a></h2><p>专栏前面几期穿插了一些并发的概念，有同学反馈理解起来有点困难，尤其对一些并发相关概念比较陌生，所以在这一讲，我也对会一些基础的概念进行补充。</p><p>首先，我们需要理解什么是线程安全。</p><p>我建议阅读Brain Goetz等专家撰写的《Java并发编程实战》（Java Concurrency in Practice），虽然可能稍显学究，但不可否认这是一本非常系统和全面的Java并发编程书籍。按照其中的定义，线程安全是一个多线程环境下正确性的概念，也就是保证多线程环境下 <strong>共享的</strong>、 <strong>可修改的</strong> 状态的正确性，这里的状态反映在程序中其实可以看作是数据。</p><p>换个角度来看，如果状态不是共享的，或者不是可修改的，也就不存在线程安全问题，进而可以推理出保证线程安全的两个办法：</p><ul><li><p>封装：通过封装，我们可以将对象内部状态隐藏、保护起来。</p></li><li><p>不可变：还记得我们在 <a href="http://time.geekbang.org/column/article/6906" target="_blank" rel="noreferrer">专栏第3讲</a> 强调的final和immutable吗，就是这个道理，Java语言目前还没有真正意义上的原生不可变，但是未来也许会引入。</p></li></ul><p>线程安全需要保证几个基本特性：</p><ul><li><p><strong>原子性</strong>，简单说就是相关操作不会中途被其他线程干扰，一般通过同步机制实现。</p></li><li><p><strong>可见性</strong>，是一个线程修改了某个共享变量，其状态能够立即被其他线程知晓，通常被解释为将线程本地状态反映到主内存上，volatile就是负责保证可见性的。</p></li><li><p><strong>有序性</strong>，是保证线程内串行语义，避免指令重排等。</p></li></ul><p>可能有点晦涩，那么我们看看下面的代码段，分析一下原子性需求体现在哪里。这个例子通过取两次数值然后进行对比，来模拟两次对共享状态的操作。</p><p>你可以编译并执行，可以看到，仅仅是两个线程的低度并发，就非常容易碰到former和latter不相等的情况。这是因为，在两次取值的过程中，其他线程可能已经修改了sharedState。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadSafeSample {</span></span>
<span class="line"><span>	public int sharedState;</span></span>
<span class="line"><span>	public void nonSafeAction() {</span></span>
<span class="line"><span>    	while (sharedState &amp;lt; 100000) {</span></span>
<span class="line"><span>        	int former = sharedState++;</span></span>
<span class="line"><span>        	int latter = sharedState;</span></span>
<span class="line"><span>        	if (former != latter - 1) {</span></span>
<span class="line"><span>            	System.out.printf(&quot;Observed data race, former is &quot; +</span></span>
<span class="line"><span>                    	former + &quot;, &quot; + &quot;latter is &quot; + latter);</span></span>
<span class="line"><span>        	}</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    	ThreadSafeSample sample = new ThreadSafeSample();</span></span>
<span class="line"><span>    	Thread threadA = new Thread(){</span></span>
<span class="line"><span>        	public void run(){</span></span>
<span class="line"><span>            	sample.nonSafeAction();</span></span>
<span class="line"><span>        	}</span></span>
<span class="line"><span>    	};</span></span>
<span class="line"><span>    	Thread threadB = new Thread(){</span></span>
<span class="line"><span>        	public void run(){</span></span>
<span class="line"><span>            	sample.nonSafeAction();</span></span>
<span class="line"><span>        	}</span></span>
<span class="line"><span> 	   };</span></span>
<span class="line"><span>    	threadA.start();</span></span>
<span class="line"><span>    	threadB.start();</span></span>
<span class="line"><span>    	threadA.join();</span></span>
<span class="line"><span>    	threadB.join();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是在我的电脑上的运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>C:\\&amp;gt;c:\\jdk-9\\bin\\java ThreadSafeSample</span></span>
<span class="line"><span>Observed data race, former is 13097, latter is 13099</span></span></code></pre></div><p>将两次赋值过程用synchronized保护起来，使用this作为互斥单元，就可以避免别的线程并发的去修改sharedState。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>synchronized (this) {</span></span>
<span class="line"><span>	int former = sharedState ++;</span></span>
<span class="line"><span>	int latter = sharedState;</span></span>
<span class="line"><span>	// …</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果用javap反编译，可以看到类似片段，利用monitorenter/monitorexit对实现了同步的语义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>11: astore_1</span></span>
<span class="line"><span>12: monitorenter</span></span>
<span class="line"><span>13: aload_0</span></span>
<span class="line"><span>14: dup</span></span>
<span class="line"><span>15: getfield  	#2              	// Field sharedState:I</span></span>
<span class="line"><span>18: dup_x1</span></span>
<span class="line"><span>…</span></span>
<span class="line"><span>56: monitorexit</span></span></code></pre></div><p>我会在下一讲，对synchronized和其他锁实现的更多底层细节进行深入分析。</p><p>代码中使用synchronized非常便利，如果用来修饰静态方法，其等同于利用下面代码将方法体囊括进来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>synchronized (ClassName.class) {}</span></span></code></pre></div><p>再来看看ReentrantLock。你可能好奇什么是再入？它是表示当一个线程试图获取一个它已经获取的锁时，这个获取动作就自动成功，这是对锁获取粒度的一个概念，也就是锁的持有是以线程为单位而不是基于调用次数。Java锁实现强调再入性是为了和pthread的行为进行区分。</p><p>再入锁可以设置公平性（fairness），我们可在创建再入锁时选择是否是公平的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ReentrantLock fairLock = new ReentrantLock(true);</span></span></code></pre></div><p>这里所谓的公平性是指在竞争场景中，当公平性为真时，会倾向于将锁赋予等待时间最久的线程。公平性是减少线程“饥饿”（个别线程长期等待锁，但始终无法获取）情况发生的一个办法。</p><p>如果使用synchronized，我们根本 <strong>无法进行</strong> 公平性的选择，其永远是不公平的，这也是主流操作系统线程调度的选择。通用场景中，公平性未必有想象中的那么重要，Java默认的调度策略很少会导致 “饥饿”发生。与此同时，若要保证公平性则会引入额外开销，自然会导致一定的吞吐量下降。所以，我建议 <strong>只有</strong> 当你的程序确实有公平性需要的时候，才有必要指定它。</p><p>我们再从日常编码的角度学习下再入锁。为保证锁释放，每一个lock()动作，我建议都立即对应一个try-catch-finally，典型的代码结构如下，这是个良好的习惯。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ReentrantLock fairLock = new ReentrantLock(true);// 这里是演示创建公平锁，一般情况不需要。</span></span>
<span class="line"><span>fairLock.lock();</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>	// do something</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span> 	fairLock.unlock();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ReentrantLock相比synchronized，因为可以像普通对象一样使用，所以可以利用其提供的各种便利方法，进行精细的同步操作，甚至是实现synchronized难以表达的用例，如：</p><ul><li><p>带超时的获取锁尝试。</p></li><li><p>可以判断是否有线程，或者某个特定线程，在排队等待获取锁。</p></li><li><p>可以响应中断请求。</p></li><li><p>...</p></li></ul><p>这里我特别想强调 <strong>条件变量</strong>（java.util.concurrent.Condition），如果说ReentrantLock是synchronized的替代选择，Condition则是将wait、notify、notifyAll等操作转化为相应的对象，将复杂而晦涩的同步操作转变为直观可控的对象行为。</p><p>条件变量最为典型的应用场景就是标准类库中的ArrayBlockingQueue等。</p><p>我们参考下面的源码，首先，通过再入锁获取条件变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** Condition for waiting takes */</span></span>
<span class="line"><span>private final Condition notEmpty;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/** Condition for waiting puts */</span></span>
<span class="line"><span>private final Condition notFull;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public ArrayBlockingQueue(int capacity, boolean fair) {</span></span>
<span class="line"><span>	if (capacity &amp;lt;= 0)</span></span>
<span class="line"><span>    	throw new IllegalArgumentException();</span></span>
<span class="line"><span>	this.items = new Object[capacity];</span></span>
<span class="line"><span>	lock = new ReentrantLock(fair);</span></span>
<span class="line"><span>	notEmpty = lock.newCondition();</span></span>
<span class="line"><span>	notFull =  lock.newCondition();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>两个条件变量是从 <strong>同一再入锁</strong> 创建出来，然后使用在特定操作中，如下面的take方法，判断和等待条件满足：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public E take() throws InterruptedException {</span></span>
<span class="line"><span>	final ReentrantLock lock = this.lock;</span></span>
<span class="line"><span>	lock.lockInterruptibly();</span></span>
<span class="line"><span>	try {</span></span>
<span class="line"><span>    	while (count == 0)</span></span>
<span class="line"><span>        	notEmpty.await();</span></span>
<span class="line"><span>    	return dequeue();</span></span>
<span class="line"><span>	} finally {</span></span>
<span class="line"><span>    	lock.unlock();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当队列为空时，试图take的线程的正确行为应该是等待入队发生，而不是直接返回，这是BlockingQueue的语义，使用条件notEmpty就可以优雅地实现这一逻辑。</p><p>那么，怎么保证入队触发后续take操作呢？请看enqueue实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void enqueue(E e) {</span></span>
<span class="line"><span>	// assert lock.isHeldByCurrentThread();</span></span>
<span class="line"><span>	// assert lock.getHoldCount() == 1;</span></span>
<span class="line"><span>	// assert items[putIndex] == null;</span></span>
<span class="line"><span>	final Object[] items = this.items;</span></span>
<span class="line"><span>	items[putIndex] = e;</span></span>
<span class="line"><span>	if (++putIndex == items.length) putIndex = 0;</span></span>
<span class="line"><span>	count++;</span></span>
<span class="line"><span>	notEmpty.signal(); // 通知等待的线程，非空条件已经满足</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过signal/await的组合，完成了条件判断和通知等待线程，非常顺畅就完成了状态流转。注意，signal和await成对调用非常重要，不然假设只有await动作，线程会一直等待直到被打断（interrupt）。</p><p>从性能角度，synchronized早期的实现比较低效，对比ReentrantLock，大多数场景性能都相差较大。但是在Java 6中对其进行了非常多的改进，可以参考性能 <a href="https://dzone.com/articles/synchronized-vs-lock" target="_blank" rel="noreferrer">对比</a>，在高竞争情况下，ReentrantLock仍然有一定优势。我在下一讲进行详细分析，会更有助于理解性能差异产生的内在原因。在大多数情况下，无需纠结于性能，还是考虑代码书写结构的便利性、可维护性等。</p><p>今天，作为专栏进入并发阶段的第一讲，我介绍了什么是线程安全，对比和分析了synchronized和ReentrantLock，并针对条件变量等方面结合案例代码进行了介绍。下一讲，我将对锁的进阶内容进行源码和案例分析。</p><h2 id="一课一练" tabindex="-1">一课一练 <a class="header-anchor" href="#一课一练" aria-label="Permalink to &quot;一课一练&quot;">​</a></h2><p>关于今天我们讨论的synchronized和ReentrantLock你做到心中有数了吗？思考一下，你使用过ReentrantLock中的哪些方法呢？分别解决什么问题？</p><p>请你在留言区写写你对这个问题的思考，我会选出经过认真思考的留言，送给你一份学习鼓励金，欢迎你与我一起讨论。</p><p>你的朋友是不是也在准备面试呢？你可以“请朋友读”，把今天的题目分享给好友，或许你能帮到他。</p>`,60)])])}const g=a(t,[["render",i]]);export{u as __pageData,g as default};
