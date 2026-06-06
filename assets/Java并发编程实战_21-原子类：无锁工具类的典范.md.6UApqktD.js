import{_ as a,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"21 | 原子类：无锁工具类的典范","description":"","frontmatter":{},"headers":[{"level":2,"title":"无锁方案的实现原理","slug":"无锁方案的实现原理","link":"#无锁方案的实现原理","children":[]},{"level":2,"title":"看Java如何实现原子化的count += 1","slug":"看java如何实现原子化的count-1","link":"#看java如何实现原子化的count-1","children":[]},{"level":2,"title":"原子类概览","slug":"原子类概览","link":"#原子类概览","children":[{"level":3,"title":"1. 原子化的基本数据类型","slug":"_1-原子化的基本数据类型","link":"#_1-原子化的基本数据类型","children":[]},{"level":3,"title":"2. 原子化的对象引用类型","slug":"_2-原子化的对象引用类型","link":"#_2-原子化的对象引用类型","children":[]},{"level":3,"title":"3. 原子化数组","slug":"_3-原子化数组","link":"#_3-原子化数组","children":[]},{"level":3,"title":"4. 原子化对象属性更新器","slug":"_4-原子化对象属性更新器","link":"#_4-原子化对象属性更新器","children":[]},{"level":3,"title":"5. 原子化的累加器","slug":"_5-原子化的累加器","link":"#_5-原子化的累加器","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"Java并发编程实战/21-原子类：无锁工具类的典范.md","filePath":"Java并发编程实战/21-原子类：无锁工具类的典范.md","lastUpdated":1779815850000}'),l={name:"Java并发编程实战/21-原子类：无锁工具类的典范.md"};function t(i,n,c,o,d,r){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_21-原子类-无锁工具类的典范" tabindex="-1">21 | 原子类：无锁工具类的典范 <a class="header-anchor" href="#_21-原子类-无锁工具类的典范" aria-label="Permalink to &quot;21 | 原子类：无锁工具类的典范&quot;">​</a></h1><p>前面我们多次提到一个累加器的例子，示例代码如下。在这个例子中，add10K()这个方法不是线程安全的，问题就出在变量count的可见性和count+=1的原子性上。可见性问题可以用volatile来解决，而原子性问题我们前面一直都是采用的互斥锁方案。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>  long count = 0;</span></span>
<span class="line"><span>  void add10K() {</span></span>
<span class="line"><span>    int idx = 0;</span></span>
<span class="line"><span>    while(idx++ &amp;lt; 10000) {</span></span>
<span class="line"><span>      count += 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实对于简单的原子性问题，还有一种 <strong>无锁方案</strong>。Java SDK并发包将这种无锁方案封装提炼之后，实现了一系列的原子类。不过，在深入介绍原子类的实现之前，我们先看看如何利用原子类解决累加器问题，这样你会对原子类有个初步的认识。</p><p>在下面的代码中，我们将原来的long型变量count替换为了原子类AtomicLong，原来的 <code>count +=1</code> 替换成了 count.getAndIncrement()，仅需要这两处简单的改动就能使add10K()方法变成线程安全的，原子类的使用还是挺简单的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>  AtomicLong count =</span></span>
<span class="line"><span>    new AtomicLong(0);</span></span>
<span class="line"><span>  void add10K() {</span></span>
<span class="line"><span>    int idx = 0;</span></span>
<span class="line"><span>    while(idx++ &amp;lt; 10000) {</span></span>
<span class="line"><span>      count.getAndIncrement();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>无锁方案相对互斥锁方案，最大的好处就是 <strong>性能</strong>。互斥锁方案为了保证互斥性，需要执行加锁、解锁操作，而加锁、解锁操作本身就消耗性能；同时拿不到锁的线程还会进入阻塞状态，进而触发线程切换，线程切换对性能的消耗也很大。 相比之下，无锁方案则完全没有加锁、解锁的性能消耗，同时还能保证互斥性，既解决了问题，又没有带来新的问题，可谓绝佳方案。那它是如何做到的呢？</p><h2 id="无锁方案的实现原理" tabindex="-1">无锁方案的实现原理 <a class="header-anchor" href="#无锁方案的实现原理" aria-label="Permalink to &quot;无锁方案的实现原理&quot;">​</a></h2><p>其实原子类性能高的秘密很简单，硬件支持而已。CPU为了解决并发问题，提供了CAS指令（CAS，全称是Compare And Swap，即“比较并交换”）。CAS指令包含3个参数：共享变量的内存地址A、用于比较的值B和共享变量的新值C；并且只有当内存中地址A处的值等于B时，才能将内存中地址A处的值更新为新值C。 <strong>作为一条CPU指令，CAS指令本身是能够保证原子性的</strong>。</p><p>你可以通过下面CAS指令的模拟代码来理解CAS的工作原理。在下面的模拟程序中有两个参数，一个是期望值expect，另一个是需要写入的新值newValue， <strong>只有当目前count的值和期望值expect相等时，才会将count更新为newValue</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SimulatedCAS{</span></span>
<span class="line"><span>  int count；</span></span>
<span class="line"><span>  synchronized int cas(</span></span>
<span class="line"><span>    int expect, int newValue){</span></span>
<span class="line"><span>    // 读目前count的值</span></span>
<span class="line"><span>    int curValue = count;</span></span>
<span class="line"><span>    // 比较目前count值是否==期望值</span></span>
<span class="line"><span>    if(curValue == expect){</span></span>
<span class="line"><span>      // 如果是，则更新count的值</span></span>
<span class="line"><span>      count = newValue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 返回写入前的值</span></span>
<span class="line"><span>    return curValue;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你仔细地再次思考一下这句话，“ <strong>只有当目前count的值和期望值expect相等时，才会将count更新为newValue。</strong>”要怎么理解这句话呢？</p><p>对于前面提到的累加器的例子， <code>count += 1</code> 的一个核心问题是：基于内存中count的当前值A计算出来的count+=1为A+1，在将A+1写入内存的时候，很可能此时内存中count已经被其他线程更新过了，这样就会导致错误地覆盖其他线程写入的值（如果你觉得理解起来还有困难，建议你再重新看看 <a href="https://time.geekbang.org/column/article/83682" target="_blank" rel="noreferrer">《01 | 可见性、原子性和有序性问题：并发编程Bug的源头》</a>）。也就是说，只有当内存中count的值等于期望值A时，才能将内存中count的值更新为计算结果A+1，这不就是CAS的语义吗！</p><p>使用CAS来解决并发问题，一般都会伴随着自旋，而所谓自旋，其实就是循环尝试。例如，实现一个线程安全的 <code>count += 1</code> 操作，“CAS+自旋”的实现方案如下所示，首先计算newValue = count+1，如果cas(count,newValue)返回的值不等于count，则意味着线程在执行完代码①处之后，执行代码②处之前，count的值被其他线程更新过。那此时该怎么处理呢？可以采用自旋方案，就像下面代码中展示的，可以重新读count最新的值来计算newValue并尝试再次更新，直到成功。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SimulatedCAS{</span></span>
<span class="line"><span>  volatile int count;</span></span>
<span class="line"><span>  // 实现count+=1</span></span>
<span class="line"><span>  addOne(){</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>      newValue = count+1; //①</span></span>
<span class="line"><span>    }while(count !=</span></span>
<span class="line"><span>      cas(count,newValue) //②</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 模拟实现CAS，仅用来帮助理解</span></span>
<span class="line"><span>  synchronized int cas(</span></span>
<span class="line"><span>    int expect, int newValue){</span></span>
<span class="line"><span>    // 读目前count的值</span></span>
<span class="line"><span>    int curValue = count;</span></span>
<span class="line"><span>    // 比较目前count值是否==期望值</span></span>
<span class="line"><span>    if(curValue == expect){</span></span>
<span class="line"><span>      // 如果是，则更新count的值</span></span>
<span class="line"><span>      count= newValue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 返回写入前的值</span></span>
<span class="line"><span>    return curValue;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面的示例代码，想必你已经发现了，CAS这种无锁方案，完全没有加锁、解锁操作，即便两个线程完全同时执行addOne()方法，也不会有线程被阻塞，所以相对于互斥锁方案来说，性能好了很多。</p><p>但是在CAS方案中，有一个问题可能会常被你忽略，那就是 <strong>ABA</strong> 的问题。什么是ABA问题呢？</p><p>前面我们提到“如果cas(count,newValue)返回的值 <strong>不等于</strong> count，意味着线程在执行完代码①处之后，执行代码②处之前，count的值被其他线程 <strong>更新过</strong>”，那如果cas(count,newValue)返回的值 <strong>等于</strong> count，是否就能够认为count的值没有被其他线程 <strong>更新过</strong> 呢？显然不是的，假设count原本是A，线程T1在执行完代码①处之后，执行代码②处之前，有可能count被线程T2更新成了B，之后又被T3更新回了A，这样线程T1虽然看到的一直是A，但是其实已经被其他线程更新过了，这就是ABA问题。</p><p>可能大多数情况下我们并不关心ABA问题，例如数值的原子递增，但也不能所有情况下都不关心，例如原子化的更新对象很可能就需要关心ABA问题，因为两个A虽然相等，但是第二个A的属性可能已经发生变化了。所以在使用CAS方案的时候，一定要先check一下。</p><h2 id="看java如何实现原子化的count-1" tabindex="-1">看Java如何实现原子化的count += 1 <a class="header-anchor" href="#看java如何实现原子化的count-1" aria-label="Permalink to &quot;看Java如何实现原子化的count += 1&quot;">​</a></h2><p>在本文开始部分，我们使用原子类AtomicLong的getAndIncrement()方法替代了 <code>count += 1</code>，从而实现了线程安全。原子类AtomicLong的getAndIncrement()方法内部就是基于CAS实现的，下面我们来看看Java是如何使用CAS来实现原子化的 <code>count += 1</code> 的。</p><p>在Java 1.8版本中，getAndIncrement()方法会转调unsafe.getAndAddLong()方法。这里this和valueOffset两个参数可以唯一确定共享变量的内存地址。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final long getAndIncrement() {</span></span>
<span class="line"><span>  return unsafe.getAndAddLong(</span></span>
<span class="line"><span>    this, valueOffset, 1L);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>unsafe.getAndAddLong()方法的源码如下，该方法首先会在内存中读取共享变量的值，之后循环调用compareAndSwapLong()方法来尝试设置共享变量的值，直到成功为止。compareAndSwapLong()是一个native方法，只有当内存中共享变量的值等于expected时，才会将共享变量的值更新为x，并且返回true；否则返回fasle。compareAndSwapLong的语义和CAS指令的语义的差别仅仅是返回值不同而已。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final long getAndAddLong(</span></span>
<span class="line"><span>  Object o, long offset, long delta){</span></span>
<span class="line"><span>  long v;</span></span>
<span class="line"><span>  do {</span></span>
<span class="line"><span>    // 读取内存中的值</span></span>
<span class="line"><span>    v = getLongVolatile(o, offset);</span></span>
<span class="line"><span>  } while (!compareAndSwapLong(</span></span>
<span class="line"><span>      o, offset, v, v + delta));</span></span>
<span class="line"><span>  return v;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//原子性地将变量更新为x</span></span>
<span class="line"><span>//条件是内存中的值等于expected</span></span>
<span class="line"><span>//更新成功则返回true</span></span>
<span class="line"><span>native boolean compareAndSwapLong(</span></span>
<span class="line"><span>  Object o, long offset,</span></span>
<span class="line"><span>  long expected,</span></span>
<span class="line"><span>  long x);</span></span></code></pre></div><p>另外，需要你注意的是，getAndAddLong()方法的实现，基本上就是CAS使用的经典范例。所以请你再次体会下面这段抽象后的代码片段，它在很多无锁程序中经常出现。Java提供的原子类里面CAS一般被实现为compareAndSet()，compareAndSet()的语义和CAS指令的语义的差别仅仅是返回值不同而已，compareAndSet()里面如果更新成功，则会返回true，否则返回false。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>do {</span></span>
<span class="line"><span>  // 获取当前值</span></span>
<span class="line"><span>  oldV = xxxx；</span></span>
<span class="line"><span>  // 根据当前值计算新值</span></span>
<span class="line"><span>  newV = ...oldV...</span></span>
<span class="line"><span>}while(!compareAndSet(oldV,newV);</span></span></code></pre></div><h2 id="原子类概览" tabindex="-1">原子类概览 <a class="header-anchor" href="#原子类概览" aria-label="Permalink to &quot;原子类概览&quot;">​</a></h2><p>Java SDK并发包里提供的原子类内容很丰富，我们可以将它们分为五个类别： <strong>原子化的基本数据类型、原子化的对象引用类型、原子化数组、原子化对象属性更新器</strong> 和 <strong>原子化的累加器</strong>。这五个类别提供的方法基本上是相似的，并且每个类别都有若干原子类，你可以通过下面的原子类组成概览图来获得一个全局的印象。下面我们详细解读这五个类别。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/90515/007a32583fbf519469462fe61805eb4a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/images/90515/007a32583fbf519469462fe61805eb4a.png" alt=""></a></p><p>原子类组成概览图</p><h3 id="_1-原子化的基本数据类型" tabindex="-1">1. 原子化的基本数据类型 <a class="header-anchor" href="#_1-原子化的基本数据类型" aria-label="Permalink to &quot;1\\. 原子化的基本数据类型&quot;">​</a></h3><p>相关实现有AtomicBoolean、AtomicInteger和AtomicLong，提供的方法主要有以下这些，详情你可以参考SDK的源代码，都很简单，这里就不详细介绍了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>getAndIncrement() //原子化i++</span></span>
<span class="line"><span>getAndDecrement() //原子化的i--</span></span>
<span class="line"><span>incrementAndGet() //原子化的++i</span></span>
<span class="line"><span>decrementAndGet() //原子化的--i</span></span>
<span class="line"><span>//当前值+=delta，返回+=前的值</span></span>
<span class="line"><span>getAndAdd(delta)</span></span>
<span class="line"><span>//当前值+=delta，返回+=后的值</span></span>
<span class="line"><span>addAndGet(delta)</span></span>
<span class="line"><span>//CAS操作，返回是否成功</span></span>
<span class="line"><span>compareAndSet(expect, update)</span></span>
<span class="line"><span>//以下四个方法</span></span>
<span class="line"><span>//新值可以通过传入func函数来计算</span></span>
<span class="line"><span>getAndUpdate(func)</span></span>
<span class="line"><span>updateAndGet(func)</span></span>
<span class="line"><span>getAndAccumulate(x,func)</span></span>
<span class="line"><span>accumulateAndGet(x,func)</span></span></code></pre></div><h3 id="_2-原子化的对象引用类型" tabindex="-1">2. 原子化的对象引用类型 <a class="header-anchor" href="#_2-原子化的对象引用类型" aria-label="Permalink to &quot;2\\. 原子化的对象引用类型&quot;">​</a></h3><p>相关实现有AtomicReference、AtomicStampedReference和AtomicMarkableReference，利用它们可以实现对象引用的原子化更新。AtomicReference提供的方法和原子化的基本数据类型差不多，这里不再赘述。不过需要注意的是，对象引用的更新需要重点关注ABA问题，AtomicStampedReference和AtomicMarkableReference这两个原子类可以解决ABA问题。</p><p>解决ABA问题的思路其实很简单，增加一个版本号维度就可以了，这个和我们在 <a href="https://time.geekbang.org/column/article/89456" target="_blank" rel="noreferrer">《18 | StampedLock：有没有比读写锁更快的锁？》</a> 介绍的乐观锁机制很类似，每次执行CAS操作，附加再更新一个版本号，只要保证版本号是递增的，那么即便A变成B之后再变回A，版本号也不会变回来（版本号递增的）。AtomicStampedReference实现的CAS方法就增加了版本号参数，方法签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>boolean compareAndSet(</span></span>
<span class="line"><span>  V expectedReference,</span></span>
<span class="line"><span>  V newReference,</span></span>
<span class="line"><span>  int expectedStamp,</span></span>
<span class="line"><span>  int newStamp)</span></span></code></pre></div><p>AtomicMarkableReference的实现机制则更简单，将版本号简化成了一个Boolean值，方法签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>boolean compareAndSet(</span></span>
<span class="line"><span>  V expectedReference,</span></span>
<span class="line"><span>  V newReference,</span></span>
<span class="line"><span>  boolean expectedMark,</span></span>
<span class="line"><span>  boolean newMark)</span></span></code></pre></div><h3 id="_3-原子化数组" tabindex="-1">3. 原子化数组 <a class="header-anchor" href="#_3-原子化数组" aria-label="Permalink to &quot;3\\. 原子化数组&quot;">​</a></h3><p>相关实现有AtomicIntegerArray、AtomicLongArray和AtomicReferenceArray，利用这些原子类，我们可以原子化地更新数组里面的每一个元素。这些类提供的方法和原子化的基本数据类型的区别仅仅是：每个方法多了一个数组的索引参数，所以这里也不再赘述了。</p><h3 id="_4-原子化对象属性更新器" tabindex="-1">4. 原子化对象属性更新器 <a class="header-anchor" href="#_4-原子化对象属性更新器" aria-label="Permalink to &quot;4\\. 原子化对象属性更新器&quot;">​</a></h3><p>相关实现有AtomicIntegerFieldUpdater、AtomicLongFieldUpdater和AtomicReferenceFieldUpdater，利用它们可以原子化地更新对象的属性，这三个方法都是利用反射机制实现的，创建更新器的方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &amp;lt;U&amp;gt;</span></span>
<span class="line"><span>AtomicXXXFieldUpdater&amp;lt;U&amp;gt;</span></span>
<span class="line"><span>newUpdater(Class&amp;lt;U&amp;gt; tclass,</span></span>
<span class="line"><span>  String fieldName)</span></span></code></pre></div><p>需要注意的是， <strong>对象属性必须是volatile类型的，只有这样才能保证可见性</strong>；如果对象属性不是volatile类型的，newUpdater()方法会抛出IllegalArgumentException这个运行时异常。</p><p>你会发现newUpdater()的方法参数只有类的信息，没有对象的引用，而更新 <strong>对象</strong> 的属性，一定需要对象的引用，那这个参数是在哪里传入的呢？是在原子操作的方法参数中传入的。例如compareAndSet()这个原子操作，相比原子化的基本数据类型多了一个对象引用obj。原子化对象属性更新器相关的方法，相比原子化的基本数据类型仅仅是多了对象引用参数，所以这里也不再赘述了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>boolean compareAndSet(</span></span>
<span class="line"><span>  T obj,</span></span>
<span class="line"><span>  int expect,</span></span>
<span class="line"><span>  int update)</span></span></code></pre></div><h3 id="_5-原子化的累加器" tabindex="-1">5. 原子化的累加器 <a class="header-anchor" href="#_5-原子化的累加器" aria-label="Permalink to &quot;5\\. 原子化的累加器&quot;">​</a></h3><p>DoubleAccumulator、DoubleAdder、LongAccumulator和LongAdder，这四个类仅仅用来执行累加操作，相比原子化的基本数据类型，速度更快，但是不支持compareAndSet()方法。如果你仅仅需要累加操作，使用原子化的累加器性能会更好。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>无锁方案相对于互斥锁方案，优点非常多，首先性能好，其次是基本不会出现死锁问题（但可能出现饥饿和活锁问题，因为自旋会反复重试）。Java提供的原子类大部分都实现了compareAndSet()方法，基于compareAndSet()方法，你可以构建自己的无锁数据结构，但是 <strong>建议你不要这样做，这个工作最好还是让大师们去完成</strong>，原因是无锁算法没你想象的那么简单。</p><p>Java提供的原子类能够解决一些简单的原子性问题，但你可能会发现，上面我们所有原子类的方法都是针对一个共享变量的，如果你需要解决多个变量的原子性问题，建议还是使用互斥锁方案。原子类虽好，但使用要慎之又慎。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>下面的示例代码是合理库存的原子化实现，仅实现了设置库存上限setUpper()方法，你觉得setUpper()方法的实现是否正确呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SafeWM {</span></span>
<span class="line"><span>  class WMRange{</span></span>
<span class="line"><span>    final int upper;</span></span>
<span class="line"><span>    final int lower;</span></span>
<span class="line"><span>    WMRange(int upper,int lower){</span></span>
<span class="line"><span>    //省略构造函数实现</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  final AtomicReference&amp;lt;WMRange&amp;gt;</span></span>
<span class="line"><span>    rf = new AtomicReference&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>      new WMRange(0,0)</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  // 设置库存上限</span></span>
<span class="line"><span>  void setUpper(int v){</span></span>
<span class="line"><span>    WMRange nr;</span></span>
<span class="line"><span>    WMRange or = rf.get();</span></span>
<span class="line"><span>    do{</span></span>
<span class="line"><span>      // 检查参数合法性</span></span>
<span class="line"><span>      if(v &amp;lt; or.lower){</span></span>
<span class="line"><span>        throw new IllegalArgumentException();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      nr = new</span></span>
<span class="line"><span>        WMRange(v, or.lower);</span></span>
<span class="line"><span>    }while(!rf.compareAndSet(or, nr));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,57)])])}const h=a(l,[["render",t]]);export{g as __pageData,h as default};
