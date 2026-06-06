import{_ as a,H as n,f as i,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"05 | ArrayList还是LinkedList？使用不当性能差千倍","description":"","frontmatter":{},"headers":[{"level":2,"title":"初识List接口","slug":"初识list接口","link":"#初识list接口","children":[]},{"level":2,"title":"ArrayList是如何实现的？","slug":"arraylist是如何实现的","link":"#arraylist是如何实现的","children":[{"level":3,"title":"1.ArrayList实现类","slug":"_1-arraylist实现类","link":"#_1-arraylist实现类","children":[]},{"level":3,"title":"2.ArrayList属性","slug":"_2-arraylist属性","link":"#_2-arraylist属性","children":[]},{"level":3,"title":"3.ArrayList构造函数","slug":"_3-arraylist构造函数","link":"#_3-arraylist构造函数","children":[]},{"level":3,"title":"4.ArrayList新增元素","slug":"_4-arraylist新增元素","link":"#_4-arraylist新增元素","children":[]},{"level":3,"title":"5.ArrayList删除元素","slug":"_5-arraylist删除元素","link":"#_5-arraylist删除元素","children":[]},{"level":3,"title":"6.ArrayList遍历元素","slug":"_6-arraylist遍历元素","link":"#_6-arraylist遍历元素","children":[]}]},{"level":2,"title":"LinkedList是如何实现的？","slug":"linkedlist是如何实现的","link":"#linkedlist是如何实现的","children":[{"level":3,"title":"1.LinkedList实现类","slug":"_1-linkedlist实现类","link":"#_1-linkedlist实现类","children":[]},{"level":3,"title":"2.LinkedList属性","slug":"_2-linkedlist属性","link":"#_2-linkedlist属性","children":[]},{"level":3,"title":"3.LinkedList新增元素","slug":"_3-linkedlist新增元素","link":"#_3-linkedlist新增元素","children":[]},{"level":3,"title":"4.LinkedList删除元素","slug":"_4-linkedlist删除元素","link":"#_4-linkedlist删除元素","children":[]},{"level":3,"title":"5.LinkedList遍历元素","slug":"_5-linkedlist遍历元素","link":"#_5-linkedlist遍历元素","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Java性能调优实战/05-ArrayList还是LinkedList？使用不当性能差千倍.md","filePath":"Java性能调优实战/05-ArrayList还是LinkedList？使用不当性能差千倍.md","lastUpdated":1779815864000}'),p={name:"Java性能调优实战/05-ArrayList还是LinkedList？使用不当性能差千倍.md"};function t(l,s,r,c,d,o){return n(),i("div",null,[...s[0]||(s[0]=[e(`<h1 id="_05-arraylist还是linkedlist-使用不当性能差千倍" tabindex="-1">05 | ArrayList还是LinkedList？使用不当性能差千倍 <a class="header-anchor" href="#_05-arraylist还是linkedlist-使用不当性能差千倍" aria-label="Permalink to &quot;05 | ArrayList还是LinkedList？使用不当性能差千倍&quot;">​</a></h1><p>你好，我是刘超。</p><p>集合作为一种存储数据的容器，是我们日常开发中使用最频繁的对象类型之一。JDK为开发者提供了一系列的集合类型，这些集合类型使用不同的数据结构来实现。因此，不同的集合类型，使用场景也不同。</p><p>很多同学在面试的时候，经常会被问到集合的相关问题，比较常见的有ArrayList和LinkedList的区别。</p><p>相信大部分同学都能回答上：“ArrayList是基于数组实现，LinkedList是基于链表实现。”</p><p>而在回答使用场景的时候，我发现大部分同学的答案是：“ArrayList和LinkedList在新增、删除元素时，LinkedList的效率要高于 ArrayList，而在遍历的时候，ArrayList的效率要高于LinkedList。”这个回答是否准确呢？今天这一讲就带你验证。</p><h2 id="初识list接口" tabindex="-1">初识List接口 <a class="header-anchor" href="#初识list接口" aria-label="Permalink to &quot;初识List接口&quot;">​</a></h2><p>在学习List集合类之前，我们先来通过这张图，看下List集合类的接口和类的实现关系：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/98145/54f564eb63a2c74723a82540668fc009.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/98145/54f564eb63a2c74723a82540668fc009.jpg" alt=""></a></p><p>我们可以看到ArrayList、Vector、LinkedList集合类继承了AbstractList抽象类，而AbstractList实现了List接口，同时也继承了AbstractCollection抽象类。ArrayList、Vector、LinkedList又根据自我定位，分别实现了各自的功能。</p><p>ArrayList和Vector使用了数组实现，这两者的实现原理差不多，LinkedList使用了双向链表实现。基础铺垫就到这里，接下来，我们就详细地分析下ArrayList和LinkedList的源码实现。</p><h2 id="arraylist是如何实现的" tabindex="-1">ArrayList是如何实现的？ <a class="header-anchor" href="#arraylist是如何实现的" aria-label="Permalink to &quot;ArrayList是如何实现的？&quot;">​</a></h2><p>ArrayList很常用，先来几道测试题，自检下你对ArrayList的了解程度。</p><p><strong>问题1：</strong> 我们在查看ArrayList的实现类源码时，你会发现对象数组elementData使用了transient修饰，我们知道transient关键字修饰该属性，则表示该属性不会被序列化，然而我们并没有看到文档中说明ArrayList不能被序列化，这是为什么？</p><p><strong>问题2：</strong> 我们在使用ArrayList进行新增、删除时，经常被提醒“使用ArrayList做新增删除操作会影响效率”。那是不是ArrayList在大量新增元素的场景下效率就一定会变慢呢？</p><p><strong>问题3：</strong> 如果让你使用for循环以及迭代循环遍历一个ArrayList，你会使用哪种方式呢？原因是什么？</p><p>如果你对这几道测试都没有一个全面的了解，那就跟我一起从数据结构、实现原理以及源码角度重新认识下ArrayList吧。</p><h3 id="_1-arraylist实现类" tabindex="-1">1.ArrayList实现类 <a class="header-anchor" href="#_1-arraylist实现类" aria-label="Permalink to &quot;1.ArrayList实现类&quot;">​</a></h3><p>ArrayList实现了List接口，继承了AbstractList抽象类，底层是数组实现的，并且实现了自增扩容数组大小。</p><p>ArrayList还实现了Cloneable接口和Serializable接口，所以他可以实现克隆和序列化。</p><p>ArrayList还实现了RandomAccess接口。你可能对这个接口比较陌生，不知道具体的用处。通过代码我们可以发现，这个接口其实是一个空接口，什么也没有实现，那ArrayList为什么要去实现它呢？</p><p>其实RandomAccess接口是一个标志接口，他标志着“只要实现该接口的List类，都能实现快速随机访问”。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ArrayList&amp;lt;E&amp;gt; extends AbstractList&amp;lt;E&amp;gt;</span></span>
<span class="line"><span>        implements List&amp;lt;E&amp;gt;, RandomAccess, Cloneable, java.io.Serializable</span></span></code></pre></div><h3 id="_2-arraylist属性" tabindex="-1">2.ArrayList属性 <a class="header-anchor" href="#_2-arraylist属性" aria-label="Permalink to &quot;2.ArrayList属性&quot;">​</a></h3><p>ArrayList属性主要由数组长度size、对象数组elementData、初始化容量default_capacity等组成， 其中初始化容量默认大小为10。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  //默认初始化容量</span></span>
<span class="line"><span>    private static final int DEFAULT_CAPACITY = 10;</span></span>
<span class="line"><span>    //对象数组</span></span>
<span class="line"><span>    transient Object[] elementData;</span></span>
<span class="line"><span>    //数组长度</span></span>
<span class="line"><span>    private int size;</span></span></code></pre></div><p>从ArrayList属性来看，它没有被任何的多线程关键字修饰，但elementData被关键字transient修饰了。这就是我在上面提到的第一道测试题：transient关键字修饰该字段则表示该属性不会被序列化，但ArrayList其实是实现了序列化接口，这到底是怎么回事呢？</p><p>这还得从“ArrayList是基于数组实现“开始说起，由于ArrayList的数组是基于动态扩增的，所以并不是所有被分配的内存空间都存储了数据。</p><p>如果采用外部序列化法实现数组的序列化，会序列化整个数组。ArrayList为了避免这些没有存储数据的内存空间被序列化，内部提供了两个私有方法writeObject以及readObject来自我完成序列化与反序列化，从而在序列化与反序列化数组时节省了空间和时间。</p><p>因此使用transient修饰数组，是防止对象数组被其他外部方法序列化。</p><h3 id="_3-arraylist构造函数" tabindex="-1">3.ArrayList构造函数 <a class="header-anchor" href="#_3-arraylist构造函数" aria-label="Permalink to &quot;3.ArrayList构造函数&quot;">​</a></h3><p>ArrayList类实现了三个构造函数，第一个是创建ArrayList对象时，传入一个初始化值；第二个是默认创建一个空数组对象；第三个是传入一个集合类型进行初始化。</p><p>当ArrayList新增元素时，如果所存储的元素已经超过其已有大小，它会计算元素大小后再进行动态扩容，数组的扩容会导致整个数组进行一次内存复制。因此，我们在初始化ArrayList时，可以通过第一个构造函数合理指定数组初始大小，这样有助于减少数组的扩容次数，从而提高系统性能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public ArrayList(int initialCapacity) {</span></span>
<span class="line"><span>        //初始化容量不为零时，将根据初始化值创建数组大小</span></span>
<span class="line"><span>        if (initialCapacity &amp;gt; 0) {</span></span>
<span class="line"><span>            this.elementData = new Object[initialCapacity];</span></span>
<span class="line"><span>        } else if (initialCapacity == 0) {//初始化容量为零时，使用默认的空数组</span></span>
<span class="line"><span>            this.elementData = EMPTY_ELEMENTDATA;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;Illegal Capacity: &quot;+</span></span>
<span class="line"><span>                                               initialCapacity);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ArrayList() {</span></span>
<span class="line"><span>        //初始化默认为空数组</span></span>
<span class="line"><span>        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="_4-arraylist新增元素" tabindex="-1">4.ArrayList新增元素 <a class="header-anchor" href="#_4-arraylist新增元素" aria-label="Permalink to &quot;4.ArrayList新增元素&quot;">​</a></h3><p>ArrayList新增元素的方法有两种，一种是直接将元素加到数组的末尾，另外一种是添加元素到任意位置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public boolean add(E e) {</span></span>
<span class="line"><span>        ensureCapacityInternal(size + 1);  // Increments modCount!!</span></span>
<span class="line"><span>        elementData[size++] = e;</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void add(int index, E element) {</span></span>
<span class="line"><span>        rangeCheckForAdd(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ensureCapacityInternal(size + 1);  // Increments modCount!!</span></span>
<span class="line"><span>        System.arraycopy(elementData, index, elementData, index + 1,</span></span>
<span class="line"><span>                         size - index);</span></span>
<span class="line"><span>        elementData[index] = element;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>两个方法的相同之处是在添加元素之前，都会先确认容量大小，如果容量够大，就不用进行扩容；如果容量不够大，就会按照原来数组的1.5倍大小进行扩容，在扩容之后需要将数组复制到新分配的内存地址。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private void ensureExplicitCapacity(int minCapacity) {</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        if (minCapacity - elementData.length &amp;gt; 0)</span></span>
<span class="line"><span>            grow(minCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void grow(int minCapacity) {</span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        int oldCapacity = elementData.length;</span></span>
<span class="line"><span>        int newCapacity = oldCapacity + (oldCapacity &amp;gt;&amp;gt; 1);</span></span>
<span class="line"><span>        if (newCapacity - minCapacity &amp;lt; 0)</span></span>
<span class="line"><span>            newCapacity = minCapacity;</span></span>
<span class="line"><span>        if (newCapacity - MAX_ARRAY_SIZE &amp;gt; 0)</span></span>
<span class="line"><span>            newCapacity = hugeCapacity(minCapacity);</span></span>
<span class="line"><span>        // minCapacity is usually close to size, so this is a win:</span></span>
<span class="line"><span>        elementData = Arrays.copyOf(elementData, newCapacity);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>当然，两个方法也有不同之处，添加元素到任意位置，会导致在该位置后的所有元素都需要重新排列，而将元素添加到数组的末尾，在没有发生扩容的前提下，是不会有元素复制排序过程的。</p><p>这里你就可以找到第二道测试题的答案了。如果我们在初始化时就比较清楚存储数据的大小，就可以在ArrayList初始化时指定数组容量大小，并且在添加元素时，只在数组末尾添加元素，那么ArrayList在大量新增元素的场景下，性能并不会变差，反而比其他List集合的性能要好。</p><h3 id="_5-arraylist删除元素" tabindex="-1">5.ArrayList删除元素 <a class="header-anchor" href="#_5-arraylist删除元素" aria-label="Permalink to &quot;5.ArrayList删除元素&quot;">​</a></h3><p>ArrayList的删除方法和添加任意位置元素的方法是有些相同的。ArrayList在每一次有效的删除元素操作之后，都要进行数组的重组，并且删除的元素位置越靠前，数组重组的开销就越大。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public E remove(int index) {</span></span>
<span class="line"><span>        rangeCheck(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        E oldValue = elementData(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int numMoved = size - index - 1;</span></span>
<span class="line"><span>        if (numMoved &amp;gt; 0)</span></span>
<span class="line"><span>            System.arraycopy(elementData, index+1, elementData, index,</span></span>
<span class="line"><span>                             numMoved);</span></span>
<span class="line"><span>        elementData[--size] = null; // clear to let GC do its work</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return oldValue;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="_6-arraylist遍历元素" tabindex="-1">6.ArrayList遍历元素 <a class="header-anchor" href="#_6-arraylist遍历元素" aria-label="Permalink to &quot;6.ArrayList遍历元素&quot;">​</a></h3><p>由于ArrayList是基于数组实现的，所以在获取元素的时候是非常快捷的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public E get(int index) {</span></span>
<span class="line"><span>        rangeCheck(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return elementData(index);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    E elementData(int index) {</span></span>
<span class="line"><span>        return (E) elementData[index];</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h2 id="linkedlist是如何实现的" tabindex="-1">LinkedList是如何实现的？ <a class="header-anchor" href="#linkedlist是如何实现的" aria-label="Permalink to &quot;LinkedList是如何实现的？&quot;">​</a></h2><p>虽然LinkedList与ArrayList都是List类型的集合，但LinkedList的实现原理却和ArrayList大相径庭，使用场景也不太一样。</p><p>LinkedList是基于双向链表数据结构实现的，LinkedList定义了一个Node结构，Node结构中包含了3个部分：元素内容item、前指针prev以及后指针next，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> private static class Node&amp;lt;E&amp;gt; {</span></span>
<span class="line"><span>        E item;</span></span>
<span class="line"><span>        Node&amp;lt;E&amp;gt; next;</span></span>
<span class="line"><span>        Node&amp;lt;E&amp;gt; prev;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Node(Node&amp;lt;E&amp;gt; prev, E element, Node&amp;lt;E&amp;gt; next) {</span></span>
<span class="line"><span>            this.item = element;</span></span>
<span class="line"><span>            this.next = next;</span></span>
<span class="line"><span>            this.prev = prev;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>总结一下，LinkedList就是由Node结构对象连接而成的一个双向链表。在JDK1.7之前，LinkedList中只包含了一个Entry结构的header属性，并在初始化的时候默认创建一个空的Entry，用来做header，前后指针指向自己，形成一个循环双向链表。</p><p>在JDK1.7之后，LinkedList做了很大的改动，对链表进行了优化。链表的Entry结构换成了Node，内部组成基本没有改变，但LinkedList里面的header属性去掉了，新增了一个Node结构的first属性和一个Node结构的last属性。这样做有以下几点好处：</p><ul><li>first/last属性能更清晰地表达链表的链头和链尾概念；</li><li>first/last方式可以在初始化LinkedList的时候节省new一个Entry；</li><li>first/last方式最重要的性能优化是链头和链尾的插入删除操作更加快捷了。</li></ul><p>这里同ArrayList的讲解一样，我将从数据结构、实现原理以及源码分析等几个角度带你深入了解LinkedList。</p><h3 id="_1-linkedlist实现类" tabindex="-1">1.LinkedList实现类 <a class="header-anchor" href="#_1-linkedlist实现类" aria-label="Permalink to &quot;1.LinkedList实现类&quot;">​</a></h3><p>LinkedList类实现了List接口、Deque接口，同时继承了AbstractSequentialList抽象类，LinkedList既实现了List类型又有Queue类型的特点；LinkedList也实现了Cloneable和Serializable接口，同ArrayList一样，可以实现克隆和序列化。</p><p>由于LinkedList存储数据的内存地址是不连续的，而是通过指针来定位不连续地址，因此，LinkedList不支持随机快速访问，LinkedList也就不能实现RandomAccess接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LinkedList&amp;lt;E&amp;gt;</span></span>
<span class="line"><span>    extends AbstractSequentialList&amp;lt;E&amp;gt;</span></span>
<span class="line"><span>    implements List&amp;lt;E&amp;gt;, Deque&amp;lt;E&amp;gt;, Cloneable, java.io.Serializable</span></span></code></pre></div><h3 id="_2-linkedlist属性" tabindex="-1">2.LinkedList属性 <a class="header-anchor" href="#_2-linkedlist属性" aria-label="Permalink to &quot;2.LinkedList属性&quot;">​</a></h3><p>我们前面讲到了LinkedList的两个重要属性first/last属性，其实还有一个size属性。我们可以看到这三个属性都被transient修饰了，原因很简单，我们在序列化的时候不会只对头尾进行序列化，所以LinkedList也是自行实现readObject和writeObject进行序列化与反序列化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  transient int size = 0;</span></span>
<span class="line"><span>    transient Node&amp;lt;E&amp;gt; first;</span></span>
<span class="line"><span>    transient Node&amp;lt;E&amp;gt; last;</span></span></code></pre></div><h3 id="_3-linkedlist新增元素" tabindex="-1">3.LinkedList新增元素 <a class="header-anchor" href="#_3-linkedlist新增元素" aria-label="Permalink to &quot;3.LinkedList新增元素&quot;">​</a></h3><p>LinkedList添加元素的实现很简洁，但添加的方式却有很多种。默认的add (Ee)方法是将添加的元素加到队尾，首先是将last元素置换到临时变量中，生成一个新的Node节点对象，然后将last引用指向新节点对象，之前的last对象的前指针指向新节点对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public boolean add(E e) {</span></span>
<span class="line"><span>        linkLast(e);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void linkLast(E e) {</span></span>
<span class="line"><span>        final Node&amp;lt;E&amp;gt; l = last;</span></span>
<span class="line"><span>        final Node&amp;lt;E&amp;gt; newNode = new Node&amp;lt;&amp;gt;(l, e, null);</span></span>
<span class="line"><span>        last = newNode;</span></span>
<span class="line"><span>        if (l == null)</span></span>
<span class="line"><span>            first = newNode;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            l.next = newNode;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>LinkedList也有添加元素到任意位置的方法，如果我们是将元素添加到任意两个元素的中间位置，添加元素操作只会改变前后元素的前后指针，指针将会指向添加的新元素，所以相比ArrayList的添加操作来说，LinkedList的性能优势明显。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public void add(int index, E element) {</span></span>
<span class="line"><span>        checkPositionIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (index == size)</span></span>
<span class="line"><span>            linkLast(element);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            linkBefore(element, node(index));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void linkBefore(E e, Node&amp;lt;E&amp;gt; succ) {</span></span>
<span class="line"><span>        // assert succ != null;</span></span>
<span class="line"><span>        final Node&amp;lt;E&amp;gt; pred = succ.prev;</span></span>
<span class="line"><span>        final Node&amp;lt;E&amp;gt; newNode = new Node&amp;lt;&amp;gt;(pred, e, succ);</span></span>
<span class="line"><span>        succ.prev = newNode;</span></span>
<span class="line"><span>        if (pred == null)</span></span>
<span class="line"><span>            first = newNode;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            pred.next = newNode;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><h3 id="_4-linkedlist删除元素" tabindex="-1">4.LinkedList删除元素 <a class="header-anchor" href="#_4-linkedlist删除元素" aria-label="Permalink to &quot;4.LinkedList删除元素&quot;">​</a></h3><p>在LinkedList删除元素的操作中，我们首先要通过循环找到要删除的元素，如果要删除的位置处于List的前半段，就从前往后找；若其位置处于后半段，就从后往前找。</p><p>这样做的话，无论要删除较为靠前或较为靠后的元素都是非常高效的，但如果List拥有大量元素，移除的元素又在List的中间段，那效率相对来说会很低。</p><h3 id="_5-linkedlist遍历元素" tabindex="-1">5.LinkedList遍历元素 <a class="header-anchor" href="#_5-linkedlist遍历元素" aria-label="Permalink to &quot;5.LinkedList遍历元素&quot;">​</a></h3><p>LinkedList的获取元素操作实现跟LinkedList的删除元素操作基本类似，通过分前后半段来循环查找到对应的元素。但是通过这种方式来查询元素是非常低效的，特别是在for循环遍历的情况下，每一次循环都会去遍历半个List。</p><p>所以在LinkedList循环遍历时，我们可以使用iterator方式迭代循环，直接拿到我们的元素，而不需要通过循环查找List。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>前面我们已经从源码的实现角度深入了解了ArrayList和LinkedList的实现原理以及各自的特点。如果你能充分理解这些内容，很多实际应用中的相关性能问题也就迎刃而解了。</p><p>就像如果现在还有人跟你说，“ArrayList和LinkedList在新增、删除元素时，LinkedList的效率要高于ArrayList，而在遍历的时候，ArrayList的效率要高于LinkedList”，你还会表示赞同吗？</p><p>现在我们不妨通过几组测试来验证一下。这里因为篇幅限制，所以我就直接给出测试结果了，对应的测试代码你可以访问 <a href="https://github.com/nickliuchao/collection" target="_blank" rel="noreferrer">Github</a> 查看和下载。</p><p><strong>1.ArrayList和LinkedList新增元素操作测试</strong></p><ul><li>从集合头部位置新增元素</li><li>从集合中间位置新增元素</li><li>从集合尾部位置新增元素</li></ul><p>测试结果(花费时间)：</p><ul><li>ArrayList&gt;LinkedList</li><li>ArrayList&lt;LinkedList</li><li>ArrayList&lt;LinkedList</li></ul><p>通过这组测试，我们可以知道LinkedList添加元素的效率未必要高于ArrayList。</p><p>由于ArrayList是数组实现的，而数组是一块连续的内存空间，在添加元素到数组头部的时候，需要对头部以后的数据进行复制重排，所以效率很低；而LinkedList是基于链表实现，在添加元素的时候，首先会通过循环查找到添加元素的位置，如果要添加的位置处于List的前半段，就从前往后找；若其位置处于后半段，就从后往前找。因此LinkedList添加元素到头部是非常高效的。</p><p>同上可知，ArrayList在添加元素到数组中间时，同样有部分数据需要复制重排，效率也不是很高；LinkedList将元素添加到中间位置，是添加元素最低效率的，因为靠近中间位置，在添加元素之前的循环查找是遍历元素最多的操作。</p><p>而在添加元素到尾部的操作中，我们发现，在没有扩容的情况下，ArrayList的效率要高于LinkedList。这是因为ArrayList在添加元素到尾部的时候，不需要复制重排数据，效率非常高。而LinkedList虽然也不用循环查找元素，但LinkedList中多了new对象以及变换指针指向对象的过程，所以效率要低于ArrayList。</p><p>说明一下，这里我是基于ArrayList初始化容量足够，排除动态扩容数组容量的情况下进行的测试，如果有动态扩容的情况，ArrayList的效率也会降低。</p><p><strong>2.ArrayList和LinkedList删除元素操作测试</strong></p><ul><li>从集合头部位置删除元素</li><li>从集合中间位置删除元素</li><li>从集合尾部位置删除元素</li></ul><p>测试结果(花费时间)：</p><ul><li>ArrayList&gt;LinkedList</li><li>ArrayList&lt;LinkedList</li><li>ArrayList&lt;LinkedList</li></ul><p>ArrayList和LinkedList删除元素操作测试的结果和添加元素操作测试的结果很接近，这是一样的原理，我在这里就不重复讲解了。</p><p><strong>3.ArrayList和LinkedList遍历元素操作测试</strong></p><ul><li>for(;;)循环</li><li>迭代器迭代循环</li></ul><p>测试结果(花费时间)：</p><ul><li>ArrayList&lt;LinkedList</li><li>ArrayList≈LinkedList</li></ul><p>我们可以看到，LinkedList的for循环性能是最差的，而ArrayList的for循环性能是最好的。</p><p>这是因为LinkedList基于链表实现的，在使用for循环的时候，每一次for循环都会去遍历半个List，所以严重影响了遍历的效率；ArrayList则是基于数组实现的，并且实现了RandomAccess接口标志，意味着ArrayList可以实现快速随机访问，所以for循环效率非常高。</p><p>LinkedList的迭代循环遍历和ArrayList的迭代循环遍历性能相当，也不会太差，所以在遍历LinkedList时，我们要切忌使用for循环遍历。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>我们通过一个使用for循环遍历删除操作ArrayList数组的例子，思考下ArrayList数组的删除操作应该注意的一些问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ArrayList&amp;lt;String&amp;gt; list = new ArrayList&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span>        list.add(&quot;a&quot;);</span></span>
<span class="line"><span>        list.add(&quot;a&quot;);</span></span>
<span class="line"><span>        list.add(&quot;b&quot;);</span></span>
<span class="line"><span>        list.add(&quot;b&quot;);</span></span>
<span class="line"><span>        list.add(&quot;c&quot;);</span></span>
<span class="line"><span>        list.add(&quot;c&quot;);</span></span>
<span class="line"><span>        remove(list);//删除指定的“b”元素</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for(int i=0; i&amp;lt;list.size(); i++)(&quot;c&quot;)()()(s : list)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            System.out.println(&quot;element : &quot; + s)list.get(i)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>从上面的代码来看，我定义了一个ArrayList数组，里面添加了一些元素，然后我通过remove删除指定的元素。请问以下两种写法，哪种是正确的？</p><p>写法1：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void remove(ArrayList&amp;lt;String&amp;gt; list)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        Iterator&amp;lt;String&amp;gt; it = list.iterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (it.hasNext()) {</span></span>
<span class="line"><span>            String str = it.next();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (str.equals(&quot;b&quot;)) {</span></span>
<span class="line"><span>                it.remove();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>写法2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void remove(ArrayList&amp;lt;String&amp;gt; list)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        for (String s : list)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            if (s.equals(&quot;b&quot;))</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                list.remove(s);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>期待在留言区看到你的答案。也欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他一起学习。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/98145/bbe343640d6b708832c4133ec53ed967.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/98145/bbe343640d6b708832c4133ec53ed967.jpg" alt="unpreview"></a></p>`,108)])])}const u=a(p,[["render",t]]);export{h as __pageData,u as default};
