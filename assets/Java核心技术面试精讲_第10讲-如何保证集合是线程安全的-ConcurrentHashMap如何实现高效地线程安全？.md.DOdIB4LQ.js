import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"第10讲 | 如何保证集合是线程安全的? ConcurrentHashMap如何实现高效地线程安全？","description":"","frontmatter":{},"headers":[{"level":2,"title":"典型回答","slug":"典型回答","link":"#典型回答","children":[]},{"level":2,"title":"考点分析","slug":"考点分析","link":"#考点分析","children":[]},{"level":2,"title":"知识扩展","slug":"知识扩展","link":"#知识扩展","children":[]},{"level":2,"title":"一课一练","slug":"一课一练","link":"#一课一练","children":[]}],"relativePath":"Java核心技术面试精讲/第10讲-如何保证集合是线程安全的-ConcurrentHashMap如何实现高效地线程安全？.md","filePath":"Java核心技术面试精讲/第10讲-如何保证集合是线程安全的-ConcurrentHashMap如何实现高效地线程安全？.md","lastUpdated":1779815890000}'),l={name:"Java核心技术面试精讲/第10讲-如何保证集合是线程安全的-ConcurrentHashMap如何实现高效地线程安全？.md"};function t(i,a,c,r,o,h){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="第10讲-如何保证集合是线程安全的-concurrenthashmap如何实现高效地线程安全" tabindex="-1">第10讲 | 如何保证集合是线程安全的? ConcurrentHashMap如何实现高效地线程安全？ <a class="header-anchor" href="#第10讲-如何保证集合是线程安全的-concurrenthashmap如何实现高效地线程安全" aria-label="Permalink to &quot;第10讲 | 如何保证集合是线程安全的? ConcurrentHashMap如何实现高效地线程安全？&quot;">​</a></h1><p>我在之前两讲介绍了Java集合框架的典型容器类，它们绝大部分都不是线程安全的，仅有的线程安全实现，比如Vector、Stack，在性能方面也远不尽如人意。幸好Java语言提供了并发包（java.util.concurrent），为高度并发需求提供了更加全面的工具支持。</p><p>今天我要问你的问题是，如何保证容器是线程安全的？ConcurrentHashMap如何实现高效地线程安全？</p><h2 id="典型回答" tabindex="-1">典型回答 <a class="header-anchor" href="#典型回答" aria-label="Permalink to &quot;典型回答&quot;">​</a></h2><p>Java提供了不同层面的线程安全支持。在传统集合框架内部，除了Hashtable等同步容器，还提供了所谓的同步包装器（Synchronized Wrapper），我们可以调用Collections工具类提供的包装方法，来获取一个同步的包装容器（如Collections.synchronizedMap），但是它们都是利用非常粗粒度的同步方式，在高并发情况下，性能比较低下。</p><p>另外，更加普遍的选择是利用并发包提供的线程安全容器类，它提供了：</p><ul><li><p>各种并发容器，比如ConcurrentHashMap、CopyOnWriteArrayList。</p></li><li><p>各种线程安全队列（Queue/Deque），如ArrayBlockingQueue、SynchronousQueue。</p></li><li><p>各种有序容器的线程安全版本等。</p></li></ul><p>具体保证线程安全的方式，包括有从简单的synchronize方式，到基于更加精细化的，比如基于分离锁实现的ConcurrentHashMap等并发实现等。具体选择要看开发的场景需求，总体来说，并发包内提供的容器通用场景，远优于早期的简单同步实现。</p><h2 id="考点分析" tabindex="-1">考点分析 <a class="header-anchor" href="#考点分析" aria-label="Permalink to &quot;考点分析&quot;">​</a></h2><p>谈到线程安全和并发，可以说是Java面试中必考的考点，我上面给出的回答是一个相对宽泛的总结，而且ConcurrentHashMap等并发容器实现也在不断演进，不能一概而论。</p><p>如果要深入思考并回答这个问题及其扩展方面，至少需要：</p><ul><li><p>理解基本的线程安全工具。</p></li><li><p>理解传统集合框架并发编程中Map存在的问题，清楚简单同步方式的不足。</p></li><li><p>梳理并发包内，尤其是ConcurrentHashMap采取了哪些方法来提高并发表现。</p></li><li><p>最好能够掌握ConcurrentHashMap自身的演进，目前的很多分析资料还是基于其早期版本。</p></li></ul><p>今天我主要是延续专栏之前两讲的内容，重点解读经常被同时考察的HashMap和ConcurrentHashMap。今天这一讲并不是对并发方面的全面梳理，毕竟这也不是专栏一讲可以介绍完整的，算是个开胃菜吧，类似CAS等更加底层的机制，后面会在Java进阶模块中的并发主题有更加系统的介绍。</p><h2 id="知识扩展" tabindex="-1">知识扩展 <a class="header-anchor" href="#知识扩展" aria-label="Permalink to &quot;知识扩展&quot;">​</a></h2><p>1.为什么需要ConcurrentHashMap？</p><p>Hashtable本身比较低效，因为它的实现基本就是将put、get、size等各种方法加上“synchronized”。简单来说，这就导致了所有并发操作都要竞争同一把锁，一个线程在进行同步操作时，其他线程只能等待，大大降低了并发操作的效率。</p><p>前面已经提过HashMap不是线程安全的，并发情况会导致类似CPU占用100%等一些问题，那么能不能利用Collections提供的同步包装器来解决问题呢？</p><p>看看下面的代码片段，我们发现同步包装器只是利用输入Map构造了另一个同步版本，所有操作虽然不再声明成为synchronized方法，但是还是利用了“this”作为互斥的mutex，没有真正意义上的改进！</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static class SynchronizedMap&amp;lt;K,V&amp;gt;</span></span>
<span class="line"><span>    implements Map&amp;lt;K,V&amp;gt;, Serializable {</span></span>
<span class="line"><span>    private final Map&amp;lt;K,V&amp;gt; m;     // Backing Map</span></span>
<span class="line"><span>    final Object      mutex;        // Object on which to synchronize</span></span>
<span class="line"><span>    // …</span></span>
<span class="line"><span>    public int size() {</span></span>
<span class="line"><span>        synchronized (mutex) {return m.size();}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> // …</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，Hashtable或者同步包装版本，都只是适合在非高度并发的场景下。</p><p>2.ConcurrentHashMap分析</p><p>我们再来看看ConcurrentHashMap是如何设计实现的，为什么它能大大提高并发效率。</p><p>首先，我这里强调， <strong>ConcurrentHashMap的设计实现其实一直在演化</strong>，比如在Java 8中就发生了非常大的变化（Java 7其实也有不少更新），所以，我这里将比较分析结构、实现机制等方面，对比不同版本的主要区别。</p><p>早期ConcurrentHashMap，其实现是基于：</p><ul><li><p>分离锁，也就是将内部进行分段（Segment），里面则是HashEntry的数组，和HashMap类似，哈希相同的条目也是以链表形式存放。</p></li><li><p>HashEntry内部使用volatile的value字段来保证可见性，也利用了不可变对象的机制以改进利用Unsafe提供的底层能力，比如volatile access，去直接完成部分操作，以最优化性能，毕竟Unsafe中的很多操作都是JVM intrinsic优化过的。</p></li></ul><p>你可以参考下面这个早期ConcurrentHashMap内部结构的示意图，其核心是利用分段设计，在进行并发操作的时候，只需要锁定相应段，这样就有效避免了类似Hashtable整体同步的问题，大大提高了性能。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E9%9D%A2%E8%AF%95%E7%B2%BE%E8%AE%B2/images/8137/d45bcf9a34da2ef1ef335532b0198bd9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E9%9D%A2%E8%AF%95%E7%B2%BE%E8%AE%B2/images/8137/d45bcf9a34da2ef1ef335532b0198bd9.png" alt=""></a></p><p>在构造的时候，Segment的数量由所谓的concurrencyLevel决定，默认是16，也可以在相应构造函数直接指定。注意，Java需要它是2的幂数值，如果输入是类似15这种非幂值，会被自动调整到16之类2的幂数值。</p><p>具体情况，我们一起看看一些Map基本操作的 <a href="http://hg.openjdk.java.net/jdk7/jdk7/jdk/file/9b8c96f96a0f/src/share/classes/java/util/concurrent/ConcurrentHashMap.java" target="_blank" rel="noreferrer">源码</a>，这是JDK 7比较新的get代码。针对具体的优化部分，为方便理解，我直接注释在代码段里，get操作需要保证的是可见性，所以并没有什么同步逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V get(Object key) {</span></span>
<span class="line"><span>        Segment&amp;lt;K,V&amp;gt; s; // manually integrate access methods to reduce overhead</span></span>
<span class="line"><span>        HashEntry&amp;lt;K,V&amp;gt;[] tab;</span></span>
<span class="line"><span>        int h = hash(key.hashCode());</span></span>
<span class="line"><span>       //利用位操作替换普通数学运算</span></span>
<span class="line"><span>       long u = (((h &amp;gt;&amp;gt;&amp;gt; segmentShift) &amp; segmentMask) &amp;lt;&amp;lt; SSHIFT) + SBASE;</span></span>
<span class="line"><span>        // 以Segment为单位，进行定位</span></span>
<span class="line"><span>        // 利用Unsafe直接进行volatile access</span></span>
<span class="line"><span>        if ((s = (Segment&amp;lt;K,V&amp;gt;)UNSAFE.getObjectVolatile(segments, u)) != null &amp;&amp;</span></span>
<span class="line"><span>            (tab = s.table) != null) {</span></span>
<span class="line"><span>           //省略</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>而对于put操作，首先是通过二次哈希避免哈希冲突，然后以Unsafe调用方式，直接获取相应的Segment，然后进行线程安全的put操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public V put(K key, V value) {</span></span>
<span class="line"><span>        Segment&amp;lt;K,V&amp;gt; s;</span></span>
<span class="line"><span>        if (value == null)</span></span>
<span class="line"><span>            throw new NullPointerException();</span></span>
<span class="line"><span>        // 二次哈希，以保证数据的分散性，避免哈希冲突</span></span>
<span class="line"><span>        int hash = hash(key.hashCode());</span></span>
<span class="line"><span>        int j = (hash &amp;gt;&amp;gt;&amp;gt; segmentShift) &amp; segmentMask;</span></span>
<span class="line"><span>        if ((s = (Segment&amp;lt;K,V&amp;gt;)UNSAFE.getObject          // nonvolatile; recheck</span></span>
<span class="line"><span>             (segments, (j &amp;lt;&amp;lt; SSHIFT) + SBASE)) == null) //  in ensureSegment</span></span>
<span class="line"><span>            s = ensureSegment(j);</span></span>
<span class="line"><span>        return s.put(key, hash, value, false);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>其核心逻辑实现在下面的内部方法中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final V put(K key, int hash, V value, boolean onlyIfAbsent) {</span></span>
<span class="line"><span>            // scanAndLockForPut会去查找是否有key相同Node</span></span>
<span class="line"><span>            // 无论如何，确保获取锁</span></span>
<span class="line"><span>            HashEntry&amp;lt;K,V&amp;gt; node = tryLock() ? null :</span></span>
<span class="line"><span>                scanAndLockForPut(key, hash, value);</span></span>
<span class="line"><span>            V oldValue;</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                HashEntry&amp;lt;K,V&amp;gt;[] tab = table;</span></span>
<span class="line"><span>                int index = (tab.length - 1) &amp; hash;</span></span>
<span class="line"><span>                HashEntry&amp;lt;K,V&amp;gt; first = entryAt(tab, index);</span></span>
<span class="line"><span>                for (HashEntry&amp;lt;K,V&amp;gt; e = first;;) {</span></span>
<span class="line"><span>                    if (e != null) {</span></span>
<span class="line"><span>                        K k;</span></span>
<span class="line"><span>                        // 更新已有value...</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    else {</span></span>
<span class="line"><span>                        // 放置HashEntry到特定位置，如果超过阈值，进行rehash</span></span>
<span class="line"><span>                        // ...</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                unlock();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return oldValue;</span></span>
<span class="line"><span>        }</span></span></code></pre></div><p>所以，从上面的源码清晰的看出，在进行并发写操作时：</p><ul><li><p>ConcurrentHashMap会获取再入锁，以保证数据一致性，Segment本身就是基于ReentrantLock的扩展实现，所以，在并发修改期间，相应Segment是被锁定的。</p></li><li><p>在最初阶段，进行重复性的扫描，以确定相应key值是否已经在数组里面，进而决定是更新还是放置操作，你可以在代码里看到相应的注释。重复扫描、检测冲突是ConcurrentHashMap的常见技巧。</p></li><li><p>我在专栏上一讲介绍HashMap时，提到了可能发生的扩容问题，在ConcurrentHashMap中同样存在。不过有一个明显区别，就是它进行的不是整体的扩容，而是单独对Segment进行扩容，细节就不介绍了。</p></li></ul><p>另外一个Map的size方法同样需要关注，它的实现涉及分离锁的一个副作用。</p><p>试想，如果不进行同步，简单的计算所有Segment的总值，可能会因为并发put，导致结果不准确，但是直接锁定所有Segment进行计算，就会变得非常昂贵。其实，分离锁也限制了Map的初始化等操作。</p><p>所以，ConcurrentHashMap的实现是通过重试机制（RETRIES_BEFORE_LOCK，指定重试次数2），来试图获得可靠值。如果没有监控到发生变化（通过对比Segment.modCount），就直接返回，否则获取锁进行操作。</p><p>下面我来对比一下， <strong>在Java 8和之后的版本中，ConcurrentHashMap发生了哪些变化呢？</strong></p><ul><li><p>总体结构上，它的内部存储变得和我在专栏上一讲介绍的HashMap结构非常相似，同样是大的桶（bucket）数组，然后内部也是一个个所谓的链表结构（bin），同步的粒度要更细致一些。</p></li><li><p>其内部仍然有Segment定义，但仅仅是为了保证序列化时的兼容性而已，不再有任何结构上的用处。</p></li><li><p>因为不再使用Segment，初始化操作大大简化，修改为lazy-load形式，这样可以有效避免初始开销，解决了老版本很多人抱怨的这一点。</p></li><li><p>数据存储利用volatile来保证可见性。</p></li><li><p>使用CAS等操作，在特定场景进行无锁并发操作。</p></li><li><p>使用Unsafe、LongAdder之类底层手段，进行极端情况的优化。</p></li></ul><p>先看看现在的数据存储内部实现，我们可以发现Key是final的，因为在生命周期中，一个条目的Key发生变化是不可能的；与此同时val，则声明为volatile，以保证可见性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> static class Node&amp;lt;K,V&amp;gt; implements Map.Entry&amp;lt;K,V&amp;gt; {</span></span>
<span class="line"><span>        final int hash;</span></span>
<span class="line"><span>        final K key;</span></span>
<span class="line"><span>        volatile V val;</span></span>
<span class="line"><span>        volatile Node&amp;lt;K,V&amp;gt; next;</span></span>
<span class="line"><span>        // …</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>我这里就不再介绍get方法和构造函数了，相对比较简单，直接看并发的put是如何实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final V putVal(K key, V value, boolean onlyIfAbsent) { if (key == null || value == null) throw new NullPointerException();</span></span>
<span class="line"><span>    int hash = spread(key.hashCode());</span></span>
<span class="line"><span>    int binCount = 0;</span></span>
<span class="line"><span>    for (Node&amp;lt;K,V&amp;gt;[] tab = table;;) {</span></span>
<span class="line"><span>        Node&amp;lt;K,V&amp;gt; f; int n, i, fh; K fk; V fv;</span></span>
<span class="line"><span>        if (tab == null || (n = tab.length) == 0)</span></span>
<span class="line"><span>            tab = initTable();</span></span>
<span class="line"><span>        else if ((f = tabAt(tab, i = (n - 1) &amp; hash)) == null) {</span></span>
<span class="line"><span>            // 利用CAS去进行无锁线程安全操作，如果bin是空的</span></span>
<span class="line"><span>            if (casTabAt(tab, i, null, new Node&amp;lt;K,V&amp;gt;(hash, key, value)))</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if ((fh = f.hash) == MOVED)</span></span>
<span class="line"><span>            tab = helpTransfer(tab, f);</span></span>
<span class="line"><span>        else if (onlyIfAbsent // 不加锁，进行检查</span></span>
<span class="line"><span>                 &amp;&amp; fh == hash</span></span>
<span class="line"><span>                 &amp;&amp; ((fk = f.key) == key || (fk != null &amp;&amp; key.equals(fk)))</span></span>
<span class="line"><span>                 &amp;&amp; (fv = f.val) != null)</span></span>
<span class="line"><span>            return fv;</span></span>
<span class="line"><span>        else {</span></span>
<span class="line"><span>            V oldVal = null;</span></span>
<span class="line"><span>            synchronized (f) {</span></span>
<span class="line"><span>                   // 细粒度的同步修改操作...</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // Bin超过阈值，进行树化</span></span>
<span class="line"><span>            if (binCount != 0) {</span></span>
<span class="line"><span>                if (binCount &amp;gt;= TREEIFY_THRESHOLD)</span></span>
<span class="line"><span>                    treeifyBin(tab, i);</span></span>
<span class="line"><span>                if (oldVal != null)</span></span>
<span class="line"><span>                    return oldVal;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    addCount(1L, binCount);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>初始化操作实现在initTable里面，这是一个典型的CAS使用场景，利用volatile的sizeCtl作为互斥手段：如果发现竞争性的初始化，就spin在那里，等待条件恢复；否则利用CAS设置排他标志。如果成功则进行初始化；否则重试。</p><p>请参考下面代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final Node&amp;lt;K,V&amp;gt;[] initTable() {</span></span>
<span class="line"><span>    Node&amp;lt;K,V&amp;gt;[] tab; int sc;</span></span>
<span class="line"><span>    while ((tab = table) == null || tab.length == 0) {</span></span>
<span class="line"><span>        // 如果发现冲突，进行spin等待</span></span>
<span class="line"><span>        if ((sc = sizeCtl) &amp;lt; 0)</span></span>
<span class="line"><span>            Thread.yield();</span></span>
<span class="line"><span>        // CAS成功返回true，则进入真正的初始化逻辑</span></span>
<span class="line"><span>        else if (U.compareAndSetInt(this, SIZECTL, sc, -1)) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                if ((tab = table) == null || tab.length == 0) {</span></span>
<span class="line"><span>                    int n = (sc &amp;gt; 0) ? sc : DEFAULT_CAPACITY;</span></span>
<span class="line"><span>                    &amp;#64;SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>                    Node&amp;lt;K,V&amp;gt;[] nt = (Node&amp;lt;K,V&amp;gt;[])new Node&amp;lt;?,?&amp;gt;[n];</span></span>
<span class="line"><span>                    table = tab = nt;</span></span>
<span class="line"><span>                    sc = n - (n &amp;gt;&amp;gt;&amp;gt; 2);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                sizeCtl = sc;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return tab;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当bin为空时，同样是没有必要锁定，也是以CAS操作去放置。</p><p>你有没有注意到，在同步逻辑上，它使用的是synchronized，而不是通常建议的ReentrantLock之类，这是为什么呢？现代JDK中，synchronized已经被不断优化，可以不再过分担心性能差异，另外，相比于ReentrantLock，它可以减少内存消耗，这是个非常大的优势。</p><p>与此同时，更多细节实现通过使用Unsafe进行了优化，例如tabAt就是直接利用getObjectAcquire，避免间接调用的开销。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final &amp;lt;K,V&amp;gt; Node&amp;lt;K,V&amp;gt; tabAt(Node&amp;lt;K,V&amp;gt;[] tab, int i) {</span></span>
<span class="line"><span>    return (Node&amp;lt;K,V&amp;gt;)U.getObjectAcquire(tab, ((long)i &amp;lt;&amp;lt; ASHIFT) + ABASE);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再看看，现在是如何实现size操作的。 <a href="http://hg.openjdk.java.net/jdk/jdk/file/12fc7bf488ec/src/java.base/share/classes/java/util/concurrent/ConcurrentHashMap.java" target="_blank" rel="noreferrer">阅读代码</a> 你会发现，真正的逻辑是在sumCount方法中， 那么sumCount做了什么呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final long sumCount() {</span></span>
<span class="line"><span>    CounterCell[] as = counterCells; CounterCell a;</span></span>
<span class="line"><span>    long sum = baseCount;</span></span>
<span class="line"><span>    if (as != null) {</span></span>
<span class="line"><span>        for (int i = 0; i &amp;lt; as.length; ++i) {</span></span>
<span class="line"><span>            if ((a = as[i]) != null)</span></span>
<span class="line"><span>                sum += a.value;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们发现，虽然思路仍然和以前类似，都是分而治之的进行计数，然后求和处理，但实现却基于一个奇怪的CounterCell。 难道它的数值，就更加准确吗？数据一致性是怎么保证的？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final class CounterCell {</span></span>
<span class="line"><span>    volatile long value;</span></span>
<span class="line"><span>    CounterCell(long x) { value = x; }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实，对于CounterCell的操作，是基于java.util.concurrent.atomic.LongAdder进行的，是一种JVM利用空间换取更高效率的方法，利用了 <a href="http://hg.openjdk.java.net/jdk/jdk/file/12fc7bf488ec/src/java.base/share/classes/java/util/concurrent/atomic/Striped64.java" target="_blank" rel="noreferrer">Striped64</a> 内部的复杂逻辑。这个东西非常小众，大多数情况下，建议还是使用AtomicLong，足以满足绝大部分应用的性能需求。</p><p>今天我从线程安全问题开始，概念性的总结了基本容器工具，分析了早期同步容器的问题，进而分析了Java 7和Java 8中ConcurrentHashMap是如何设计实现的，希望ConcurrentHashMap的并发技巧对你在日常开发可以有所帮助。</p><h2 id="一课一练" tabindex="-1">一课一练 <a class="header-anchor" href="#一课一练" aria-label="Permalink to &quot;一课一练&quot;">​</a></h2><p>关于今天我们讨论的题目你做到心中有数了吗？留一个道思考题给你，在产品代码中，有没有典型的场景需要使用类似ConcurrentHashMap这样的并发容器呢？</p><p>请你在留言区写写你对这个问题的思考，我会选出经过认真思考的留言，送给你一份学习鼓励金，欢迎你与我一起讨论。</p><p>你的朋友是不是也在准备面试呢？你可以“请朋友读”，把今天的题目分享给好友，或许你能帮到他。</p>`,62)])])}const m=n(l,[["render",t]]);export{d as __pageData,m as default};
