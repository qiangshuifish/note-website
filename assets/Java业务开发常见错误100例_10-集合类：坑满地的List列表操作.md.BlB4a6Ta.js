import{_ as a,H as n,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"10 | 集合类：坑满地的List列表操作","description":"","frontmatter":{},"headers":[{"level":2,"title":"使用Arrays.asList把数据转换为List的三个坑","slug":"使用arrays-aslist把数据转换为list的三个坑","link":"#使用arrays-aslist把数据转换为list的三个坑","children":[]},{"level":2,"title":"使用List.subList进行切片操作居然会导致OOM？","slug":"使用list-sublist进行切片操作居然会导致oom","link":"#使用list-sublist进行切片操作居然会导致oom","children":[]},{"level":2,"title":"一定要让合适的数据结构做合适的事情","slug":"一定要让合适的数据结构做合适的事情","link":"#一定要让合适的数据结构做合适的事情","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/10-集合类：坑满地的List列表操作.md","filePath":"Java业务开发常见错误100例/10-集合类：坑满地的List列表操作.md","lastUpdated":1779815815000}'),e={name:"Java业务开发常见错误100例/10-集合类：坑满地的List列表操作.md"};function i(l,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_10-集合类-坑满地的list列表操作" tabindex="-1">10 | 集合类：坑满地的List列表操作 <a class="header-anchor" href="#_10-集合类-坑满地的list列表操作" aria-label="Permalink to &quot;10 | 集合类：坑满地的List列表操作&quot;">​</a></h1><p>你好，我是朱晔。今天，我来和你说说List列表操作有哪些坑。</p><p>Pascal之父尼克劳斯 · 维尔特（Niklaus Wirth），曾提出一个著名公式“程序=数据结构+算法”。由此可见，数据结构的重要性。常见的数据结构包括List、Set、Map、Queue、Tree、Graph、Stack等，其中List、Set、Map、Queue可以从广义上统称为集合类数据结构。</p><p>现代编程语言一般都会提供各种数据结构的实现，供我们开箱即用。Java也是一样，比如提供了集合类的各种实现。Java的集合类包括Map和Collection两大类。Collection包括List、Set和Queue三个小类，其中List列表集合是最重要也是所有业务代码都会用到的。所以，今天我会重点介绍List的内容，而不会集中介绍Map以及Collection中其他小类的坑。</p><p>今天，我们就从把数组转换为List集合、对List进行切片操作、List搜索的性能问题等几个方面着手，来聊聊其中最可能遇到的一些坑。</p><h2 id="使用arrays-aslist把数据转换为list的三个坑" tabindex="-1">使用Arrays.asList把数据转换为List的三个坑 <a class="header-anchor" href="#使用arrays-aslist把数据转换为list的三个坑" aria-label="Permalink to &quot;使用Arrays.asList把数据转换为List的三个坑&quot;">​</a></h2><p>Java 8中Stream流式处理的各种功能，大大减少了集合类各种操作（投影、过滤、转换）的代码量。所以，在业务开发中，我们常常会把原始的数组转换为List类数据结构，来继续展开各种Stream操作。</p><p>你可能也想到了，使用Arrays.asList方法可以把数组一键转换为List，但其实没这么简单。接下来，就让我们看看其中的缘由，以及使用Arrays.asList把数组转换为List的几个坑。</p><p>在如下代码中，我们初始化三个数字的int[]数组，然后使用Arrays.asList把数组转换为List：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int[] arr = {1, 2, 3};</span></span>
<span class="line"><span>List list = Arrays.asList(arr);</span></span>
<span class="line"><span>log.info(&quot;list:{} size:{} class:{}&quot;, list, list.size(), list.get(0).getClass());</span></span></code></pre></div><p>但，这样初始化的List并不是我们期望的包含3个数字的List。通过日志可以发现，这个List包含的其实是一个int数组，整个List的元素个数是1，元素类型是整数数组。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>12:50:39.445 [main] INFO org.geekbang.time.commonmistakes.collection.aslist.AsListApplication - list:[[I&amp;#64;1c53fd30] size:1 class:class [I</span></span></code></pre></div><p>其原因是，只能是把int装箱为Integer，不可能把int数组装箱为Integer数组。我们知道，Arrays.asList方法传入的是一个泛型T类型可变参数，最终int数组整体作为了一个对象成为了泛型类型T：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &amp;lt;T&amp;gt; List&amp;lt;T&amp;gt; asList(T... a) {</span></span>
<span class="line"><span>    return new ArrayList&amp;lt;&amp;gt;(a);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>直接遍历这样的List必然会出现Bug，修复方式有两种，如果使用Java8以上版本可以使用Arrays.stream方法来转换，否则可以把int数组声明为包装类型Integer数组：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int[] arr1 = {1, 2, 3};</span></span>
<span class="line"><span>List list1 = Arrays.stream(arr1).boxed().collect(Collectors.toList());</span></span>
<span class="line"><span>log.info(&quot;list:{} size:{} class:{}&quot;, list1, list1.size(), list1.get(0).getClass());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Integer[] arr2 = {1, 2, 3};</span></span>
<span class="line"><span>List list2 = Arrays.asList(arr2);</span></span>
<span class="line"><span>log.info(&quot;list:{} size:{} class:{}&quot;, list2, list2.size(), list2.get(0).getClass());</span></span></code></pre></div><p>修复后的代码得到如下日志，可以看到List具有三个元素，元素类型是Integer：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>13:10:57.373 [main] INFO org.geekbang.time.commonmistakes.collection.aslist.AsListApplication - list:[1, 2, 3] size:3 class:class java.lang.Integer</span></span></code></pre></div><p>可以看到第一个坑是， <strong>不能直接使用Arrays.asList来转换基本类型数组</strong>。那么，我们获得了正确的List，是不是就可以像普通的List那样使用了呢？我们继续往下看。</p><p>把三个字符串1、2、3构成的字符串数组，使用Arrays.asList转换为List后，将原始字符串数组的第二个字符修改为4，然后为List增加一个字符串5，最后数组和List会是怎样呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String[] arr = {&quot;1&quot;, &quot;2&quot;, &quot;3&quot;};</span></span>
<span class="line"><span>List list = Arrays.asList(arr);</span></span>
<span class="line"><span>arr[1] = &quot;4&quot;;</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>    list.add(&quot;5&quot;);</span></span>
<span class="line"><span>} catch (Exception ex) {</span></span>
<span class="line"><span>    ex.printStackTrace();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>log.info(&quot;arr:{} list:{}&quot;, Arrays.toString(arr), list);</span></span></code></pre></div><p>可以看到，日志里有一个UnsupportedOperationException，为List新增字符串5的操作失败了，而且把原始数组的第二个元素从2修改为4后，asList获得的List中的第二个元素也被修改为4了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java.lang.UnsupportedOperationException</span></span>
<span class="line"><span>	at java.util.AbstractList.add(AbstractList.java:148)</span></span>
<span class="line"><span>	at java.util.AbstractList.add(AbstractList.java:108)</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.collection.aslist.AsListApplication.wrong2(AsListApplication.java:41)</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.collection.aslist.AsListApplication.main(AsListApplication.java:15)</span></span>
<span class="line"><span>13:15:34.699 [main] INFO org.geekbang.time.commonmistakes.collection.aslist.AsListApplication - arr:[1, 4, 3] list:[1, 4, 3]</span></span></code></pre></div><p>这里，又引出了两个坑。</p><p>第二个坑， <strong>Arrays.asList返回的List不支持增删操作。</strong> Arrays.asList返回的List并不是我们期望的java.util.ArrayList，而是Arrays的内部类ArrayList。ArrayList内部类继承自AbstractList类，并没有覆写父类的add方法，而父类中add方法的实现，就是抛出UnsupportedOperationException。相关源码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &amp;lt;T&amp;gt; List&amp;lt;T&amp;gt; asList(T... a) {</span></span>
<span class="line"><span>    return new ArrayList&amp;lt;&amp;gt;(a);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static class ArrayList&amp;lt;E&amp;gt; extends AbstractList&amp;lt;E&amp;gt;</span></span>
<span class="line"><span>    implements RandomAccess, java.io.Serializable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    private final E[] a;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ArrayList(E[] array) {</span></span>
<span class="line"><span>        a = Objects.requireNonNull(array);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public E set(int index, E element) {</span></span>
<span class="line"><span>        E oldValue = a[index];</span></span>
<span class="line"><span>        a[index] = element;</span></span>
<span class="line"><span>        return oldValue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public abstract class AbstractList&amp;lt;E&amp;gt; extends AbstractCollection&amp;lt;E&amp;gt; implements List&amp;lt;E&amp;gt; {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>public void add(int index, E element) {</span></span>
<span class="line"><span>        throw new UnsupportedOperationException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第三个坑， <strong>对原始数组的修改会影响到我们获得的那个List</strong>。看一下ArrayList的实现，可以发现ArrayList其实是直接使用了原始的数组。所以，我们要特别小心，把通过Arrays.asList获得的List交给其他方法处理，很容易因为共享了数组，相互修改产生Bug。</p><p>修复方式比较简单，重新new一个ArrayList初始化Arrays.asList返回的List即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String[] arr = {&quot;1&quot;, &quot;2&quot;, &quot;3&quot;};</span></span>
<span class="line"><span>List list = new ArrayList(Arrays.asList(arr));</span></span>
<span class="line"><span>arr[1] = &quot;4&quot;;</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>    list.add(&quot;5&quot;);</span></span>
<span class="line"><span>} catch (Exception ex) {</span></span>
<span class="line"><span>    ex.printStackTrace();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>log.info(&quot;arr:{} list:{}&quot;, Arrays.toString(arr), list);</span></span></code></pre></div><p>修改后的代码实现了原始数组和List的“解耦”，不再相互影响。同时，因为操作的是真正的ArrayList，add也不再出错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>13:34:50.829 [main] INFO org.geekbang.time.commonmistakes.collection.aslist.AsListApplication - arr:[1, 4, 3] list:[1, 2, 3, 5]</span></span></code></pre></div><h2 id="使用list-sublist进行切片操作居然会导致oom" tabindex="-1">使用List.subList进行切片操作居然会导致OOM？ <a class="header-anchor" href="#使用list-sublist进行切片操作居然会导致oom" aria-label="Permalink to &quot;使用List.subList进行切片操作居然会导致OOM？&quot;">​</a></h2><p>业务开发时常常要对List做切片处理，即取出其中部分元素构成一个新的List，我们通常会想到使用List.subList方法。但，和Arrays.asList的问题类似，List.subList返回的子List不是一个普通的ArrayList。这个子List可以认为是原始List的视图，会和原始List相互影响。如果不注意，很可能会因此产生OOM问题。接下来，我们就一起分析下其中的坑。</p><p>如下代码所示，定义一个名为data的静态List来存放Integer的List，也就是说data的成员本身是包含了多个数字的List。循环1000次，每次都从一个具有10万个Integer的List中，使用subList方法获得一个只包含一个数字的子List，并把这个子List加入data变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static List&amp;lt;List&amp;lt;Integer&amp;gt;&amp;gt; data = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private static void oom() {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 1000; i++) {</span></span>
<span class="line"><span>        List&amp;lt;Integer&amp;gt; rawList = IntStream.rangeClosed(1, 100000).boxed().collect(Collectors.toList());</span></span>
<span class="line"><span>        data.add(rawList.subList(0, 1));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可能会觉得，这个data变量里面最终保存的只是1000个具有1个元素的List，不会占用很大空间，但程序运行不久就出现了OOM：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;main&quot; java.lang.OutOfMemoryError: Java heap space</span></span>
<span class="line"><span>	at java.util.Arrays.copyOf(Arrays.java:3181)</span></span>
<span class="line"><span>	at java.util.ArrayList.grow(ArrayList.java:265)</span></span></code></pre></div><p><strong>出现OOM的原因是，循环中的1000个具有10万个元素的List始终得不到回收，因为它始终被subList方法返回的List强引用。</strong> 那么，返回的子List为什么会强引用原始的List，它们又有什么关系呢？我们再继续做实验观察一下这个子List的特性。</p><p>首先初始化一个包含数字1到10的ArrayList，然后通过调用subList方法取出2、3、4；随后删除这个SubList中的元素数字3，并打印原始的ArrayList；最后为原始的ArrayList增加一个元素数字0，遍历SubList输出所有元素：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&amp;lt;Integer&amp;gt; list = IntStream.rangeClosed(1, 10).boxed().collect(Collectors.toList());</span></span>
<span class="line"><span>List&amp;lt;Integer&amp;gt; subList = list.subList(1, 4);</span></span>
<span class="line"><span>System.out.println(subList);</span></span>
<span class="line"><span>subList.remove(1);</span></span>
<span class="line"><span>System.out.println(list);</span></span>
<span class="line"><span>list.add(0);</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>    subList.forEach(System.out::println);</span></span>
<span class="line"><span>} catch (Exception ex) {</span></span>
<span class="line"><span>    ex.printStackTrace();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码运行后得到如下输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[2, 3, 4]</span></span>
<span class="line"><span>[1, 2, 4, 5, 6, 7, 8, 9, 10]</span></span>
<span class="line"><span>java.util.ConcurrentModificationException</span></span>
<span class="line"><span>	at java.util.ArrayList$SubList.checkForComodification(ArrayList.java:1239)</span></span>
<span class="line"><span>	at java.util.ArrayList$SubList.listIterator(ArrayList.java:1099)</span></span>
<span class="line"><span>	at java.util.AbstractList.listIterator(AbstractList.java:299)</span></span>
<span class="line"><span>	at java.util.ArrayList$SubList.iterator(ArrayList.java:1095)</span></span>
<span class="line"><span>	at java.lang.Iterable.forEach(Iterable.java:74)</span></span></code></pre></div><p>可以看到两个现象：</p><ul><li>原始List中数字3被删除了，说明删除子List中的元素影响到了原始List；</li><li>尝试为原始List增加数字0之后再遍历子List，会出现ConcurrentModificationException。</li></ul><p>我们分析下ArrayList的源码，看看为什么会是这样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ArrayList&amp;lt;E&amp;gt; extends AbstractList&amp;lt;E&amp;gt;</span></span>
<span class="line"><span>        implements List&amp;lt;E&amp;gt;, RandomAccess, Cloneable, java.io.Serializable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    protected transient int modCount = 0;</span></span>
<span class="line"><span>	private void ensureExplicitCapacity(int minCapacity) {</span></span>
<span class="line"><span>        modCount++;</span></span>
<span class="line"><span>        // overflow-conscious code</span></span>
<span class="line"><span>        if (minCapacity - elementData.length &amp;gt; 0)</span></span>
<span class="line"><span>            grow(minCapacity);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>	public void add(int index, E element) {</span></span>
<span class="line"><span>		rangeCheckForAdd(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		ensureCapacityInternal(size + 1);  // Increments modCount!!</span></span>
<span class="line"><span>		System.arraycopy(elementData, index, elementData, index + 1,</span></span>
<span class="line"><span>		                 size - index);</span></span>
<span class="line"><span>		elementData[index] = element;</span></span>
<span class="line"><span>		size++;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public List&amp;lt;E&amp;gt; subList(int fromIndex, int toIndex) {</span></span>
<span class="line"><span>		subListRangeCheck(fromIndex, toIndex, size);</span></span>
<span class="line"><span>		return new SubList(this, offset, fromIndex, toIndex);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private class SubList extends AbstractList&amp;lt;E&amp;gt; implements RandomAccess {</span></span>
<span class="line"><span>		private final AbstractList&amp;lt;E&amp;gt; parent;</span></span>
<span class="line"><span>		private final int parentOffset;</span></span>
<span class="line"><span>		private final int offset;</span></span>
<span class="line"><span>		int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		SubList(AbstractList&amp;lt;E&amp;gt; parent,</span></span>
<span class="line"><span>	        int offset, int fromIndex, int toIndex) {</span></span>
<span class="line"><span>		    this.parent = parent;</span></span>
<span class="line"><span>		    this.parentOffset = fromIndex;</span></span>
<span class="line"><span>		    this.offset = offset + fromIndex;</span></span>
<span class="line"><span>		    this.size = toIndex - fromIndex;</span></span>
<span class="line"><span>		    this.modCount = ArrayList.this.modCount;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        public E set(int index, E element) {</span></span>
<span class="line"><span>            rangeCheck(index);</span></span>
<span class="line"><span>            checkForComodification();</span></span>
<span class="line"><span>            return l.set(index+offset, element);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public ListIterator&amp;lt;E&amp;gt; listIterator(final int index) {</span></span>
<span class="line"><span>		            checkForComodification();</span></span>
<span class="line"><span>		            ...</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		private void checkForComodification() {</span></span>
<span class="line"><span>		    if (ArrayList.this.modCount != this.modCount)</span></span>
<span class="line"><span>		        throw new ConcurrentModificationException();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第一，ArrayList维护了一个叫作modCount的字段，表示集合结构性修改的次数。所谓结构性修改，指的是影响List大小的修改，所以add操作必然会改变modCount的值。</p><p>第二，分析第21到24行的subList方法可以看到，获得的List其实是 <strong>内部类SubList</strong>，并不是普通的ArrayList，在初始化的时候传入了this。</p><p>第三，分析第26到39行代码可以发现，这个SubList中的parent字段就是原始的List。SubList初始化的时候，并没有把原始List中的元素复制到独立的变量中保存。我们可以认为SubList是原始List的视图，并不是独立的List。双方对元素的修改会相互影响，而且SubList强引用了原始的List，所以大量保存这样的SubList会导致OOM。</p><p>第四，分析第47到55行代码可以发现，遍历SubList的时候会先获得迭代器，比较原始ArrayList modCount的值和SubList当前modCount的值。获得了SubList后，我们为原始List新增了一个元素修改了其modCount，所以判等失败抛出ConcurrentModificationException异常。</p><p>既然SubList相当于原始List的视图，那么避免相互影响的修复方式有两种：</p><ul><li>一种是，不直接使用subList方法返回的SubList，而是重新使用new ArrayList，在构造方法传入SubList，来构建一个独立的ArrayList；</li><li>另一种是，对于Java 8使用Stream的skip和limit API来跳过流中的元素，以及限制流中元素的个数，同样可以达到SubList切片的目的。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//方式一：</span></span>
<span class="line"><span>List&amp;lt;Integer&amp;gt; subList = new ArrayList&amp;lt;&amp;gt;(list.subList(1, 4));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//方式二：</span></span>
<span class="line"><span>List&amp;lt;Integer&amp;gt; subList = list.stream().skip(1).limit(3).collect(Collectors.toList());</span></span></code></pre></div><p>修复后代码输出如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[2, 3, 4]</span></span>
<span class="line"><span>[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>4</span></span></code></pre></div><p>可以看到，删除SubList的元素不再影响原始List，而对原始List的修改也不会再出现List迭代异常。</p><h2 id="一定要让合适的数据结构做合适的事情" tabindex="-1">一定要让合适的数据结构做合适的事情 <a class="header-anchor" href="#一定要让合适的数据结构做合适的事情" aria-label="Permalink to &quot;一定要让合适的数据结构做合适的事情&quot;">​</a></h2><p>在介绍 <a href="https://time.geekbang.org/column/article/209494" target="_blank" rel="noreferrer">并发工具</a> 时，我提到要根据业务场景选择合适的并发工具或容器。在使用List集合类的时候，不注意使用场景也会遇见两个常见误区。</p><p><strong>第一个误区是，使用数据结构不考虑平衡时间和空间</strong>。</p><p>首先，定义一个只有一个int类型订单号字段的Order类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;NoArgsConstructor</span></span>
<span class="line"><span>&amp;#64;AllArgsConstructor</span></span>
<span class="line"><span>static class Order {</span></span>
<span class="line"><span>    private int orderId;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，定义一个包含elementCount和loopCount两个参数的listSearch方法，初始化一个具有elementCount个订单对象的ArrayList，循环loopCount次搜索这个ArrayList，每次随机搜索一个订单号：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static Object listSearch(int elementCount, int loopCount) {</span></span>
<span class="line"><span>    List&amp;lt;Order&amp;gt; list = IntStream.rangeClosed(1, elementCount).mapToObj(i -&amp;gt; new Order(i)).collect(Collectors.toList());</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        int search = ThreadLocalRandom.current().nextInt(elementCount);</span></span>
<span class="line"><span>        Order result = list.stream().filter(order -&amp;gt; order.getOrderId() == search).findFirst().orElse(null);</span></span>
<span class="line"><span>        Assert.assertTrue(result != null &amp;&amp; result.getOrderId() == search);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    return list;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>随后，定义另一个mapSearch方法，从一个具有elementCount个元素的Map中循环loopCount次查找随机订单号。Map的Key是订单号，Value是订单对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static Object mapSearch(int elementCount, int loopCount) {</span></span>
<span class="line"><span>    Map&amp;lt;Integer, Order&amp;gt; map = IntStream.rangeClosed(1, elementCount).boxed().collect(Collectors.toMap(Function.identity(), i -&amp;gt; new Order(i)));</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        int search = ThreadLocalRandom.current().nextInt(elementCount);</span></span>
<span class="line"><span>        Order result = map.get(search);</span></span>
<span class="line"><span>        Assert.assertTrue(result != null &amp;&amp; result.getOrderId() == search);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    return map;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们知道，搜索ArrayList的时间复杂度是O(n)，而HashMap的get操作的时间复杂度是O(1)。 <strong>所以，要对大List进行单值搜索的话，可以考虑使用HashMap，其中Key是要搜索的值，Value是原始对象，会比使用ArrayList有非常明显的性能优势。</strong></p><p>如下代码所示，对100万个元素的ArrayList和HashMap，分别调用listSearch和mapSearch方法进行1000次搜索：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int elementCount = 1000000;</span></span>
<span class="line"><span>int loopCount = 1000;</span></span>
<span class="line"><span>StopWatch stopWatch = new StopWatch();</span></span>
<span class="line"><span>stopWatch.start(&quot;listSearch&quot;);</span></span>
<span class="line"><span>Object list = listSearch(elementCount, loopCount);</span></span>
<span class="line"><span>System.out.println(ObjectSizeCalculator.getObjectSize(list));</span></span>
<span class="line"><span>stopWatch.stop();</span></span>
<span class="line"><span>stopWatch.start(&quot;mapSearch&quot;);</span></span>
<span class="line"><span>Object map = mapSearch(elementCount, loopCount);</span></span>
<span class="line"><span>stopWatch.stop();</span></span>
<span class="line"><span>System.out.println(ObjectSizeCalculator.getObjectSize(map));</span></span>
<span class="line"><span>System.out.println(stopWatch.prettyPrint());</span></span></code></pre></div><p>可以看到，仅仅是1000次搜索，listSearch方法耗时3.3秒，而mapSearch耗时仅仅108毫秒。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>20861992</span></span>
<span class="line"><span>72388672</span></span>
<span class="line"><span>StopWatch &#39;&#39;: running time = 3506699764 ns</span></span>
<span class="line"><span>---------------------------------------------</span></span>
<span class="line"><span>ns         %     Task name</span></span>
<span class="line"><span>---------------------------------------------</span></span>
<span class="line"><span>3398413176  097%  listSearch</span></span>
<span class="line"><span>108286588  003%  mapSearch</span></span></code></pre></div><p>即使我们要搜索的不是单值而是条件区间，也可以尝试使用HashMap来进行“搜索性能优化”。如果你的条件区间是固定的话，可以提前把HashMap按照条件区间进行分组，Key就是不同的区间。</p><p>的确，如果业务代码中有频繁的大ArrayList搜索，使用HashMap性能会好很多。类似，如果要对大ArrayList进行去重操作，也不建议使用contains方法，而是可以考虑使用HashSet进行去重。说到这里，还有一个问题，使用HashMap是否会牺牲空间呢？</p><p>为此，我们使用ObjectSizeCalculator工具打印ArrayList和HashMap的内存占用，可以看到ArrayList占用内存21M，而HashMap占用的内存达到了72M，是List的三倍多。进一步使用MAT工具分析堆可以再次证明，ArrayList在内存占用上性价比很高，77%是实际的数据（如第1个图所示，16000000/20861992）， <strong>而HashMap的“含金量”只有22%</strong>（如第2个图所示，16000000/72386640）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/216778/1e8492040dd4b1af6114a6eeba06e524.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/216778/1e8492040dd4b1af6114a6eeba06e524.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/216778/53d53e3ce2efcb081f8d9fa496cb8ec7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/216778/53d53e3ce2efcb081f8d9fa496cb8ec7.png" alt=""></a></p><p>所以，在应用内存吃紧的情况下，我们需要考虑是否值得使用更多的内存消耗来换取更高的性能。这里我们看到的是平衡的艺术，空间换时间，还是时间换空间，只考虑任何一个方面都是不对的。</p><p><strong>第二个误区是，过于迷信教科书的大O时间复杂度</strong>。</p><p>数据结构中要实现一个列表，有基于连续存储的数组和基于指针串联的链表两种方式。在Java中，有代表性的实现是ArrayList和LinkedList，前者背后的数据结构是数组，后者则是（双向）链表。</p><p>在选择数据结构的时候，我们通常会考虑每种数据结构不同操作的时间复杂度，以及使用场景两个因素。查看 <a href="https://www.bigocheatsheet.com/" target="_blank" rel="noreferrer">这里</a>，你可以看到数组和链表大O时间复杂度的显著差异：</p><ul><li>对于数组，随机元素访问的时间复杂度是O(1)，元素插入操作是O(n)；</li><li>对于链表，随机元素访问的时间复杂度是O(n)，元素插入操作是O(1)。</li></ul><p>那么，在大量的元素插入、很少的随机访问的业务场景下，是不是就应该使用LinkedList呢？接下来，我们写一段代码测试下两者随机访问和插入的性能吧。</p><p>定义四个参数一致的方法，分别对元素个数为elementCount的LinkedList和ArrayList，循环loopCount次，进行随机访问和增加元素到随机位置的操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//LinkedList访问</span></span>
<span class="line"><span>private static void linkedListGet(int elementCount, int loopCount) {</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; list = IntStream.rangeClosed(1, elementCount).boxed().collect(Collectors.toCollection(LinkedList::new));</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).forEach(i -&amp;gt; list.get(ThreadLocalRandom.current().nextInt(elementCount)));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//ArrayList访问</span></span>
<span class="line"><span>private static void arrayListGet(int elementCount, int loopCount) {</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; list = IntStream.rangeClosed(1, elementCount).boxed().collect(Collectors.toCollection(ArrayList::new));</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).forEach(i -&amp;gt; list.get(ThreadLocalRandom.current().nextInt(elementCount)));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//LinkedList插入</span></span>
<span class="line"><span>private static void linkedListAdd(int elementCount, int loopCount) {</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; list = IntStream.rangeClosed(1, elementCount).boxed().collect(Collectors.toCollection(LinkedList::new));</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).forEach(i -&amp;gt; list.add(ThreadLocalRandom.current().nextInt(elementCount),1));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//ArrayList插入</span></span>
<span class="line"><span>private static void arrayListAdd(int elementCount, int loopCount) {</span></span>
<span class="line"><span>    List&amp;lt;Integer&amp;gt; list = IntStream.rangeClosed(1, elementCount).boxed().collect(Collectors.toCollection(ArrayList::new));</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, loopCount).forEach(i -&amp;gt; list.add(ThreadLocalRandom.current().nextInt(elementCount),1));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试代码如下，10万个元素，循环10万次：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int elementCount = 100000;</span></span>
<span class="line"><span>int loopCount = 100000;</span></span>
<span class="line"><span>StopWatch stopWatch = new StopWatch();</span></span>
<span class="line"><span>stopWatch.start(&quot;linkedListGet&quot;);</span></span>
<span class="line"><span>linkedListGet(elementCount, loopCount);</span></span>
<span class="line"><span>stopWatch.stop();</span></span>
<span class="line"><span>stopWatch.start(&quot;arrayListGet&quot;);</span></span>
<span class="line"><span>arrayListGet(elementCount, loopCount);</span></span>
<span class="line"><span>stopWatch.stop();</span></span>
<span class="line"><span>System.out.println(stopWatch.prettyPrint());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StopWatch stopWatch2 = new StopWatch();</span></span>
<span class="line"><span>stopWatch2.start(&quot;linkedListAdd&quot;);</span></span>
<span class="line"><span>linkedListAdd(elementCount, loopCount);</span></span>
<span class="line"><span>stopWatch2.stop();</span></span>
<span class="line"><span>stopWatch2.start(&quot;arrayListAdd&quot;);</span></span>
<span class="line"><span>arrayListAdd(elementCount, loopCount);</span></span>
<span class="line"><span>stopWatch2.stop();</span></span>
<span class="line"><span>System.out.println(stopWatch2.prettyPrint());</span></span></code></pre></div><p>运行结果可能会让你大跌眼镜。在随机访问方面，我们看到了ArrayList的绝对优势，耗时只有11毫秒，而LinkedList耗时6.6秒，这符合上面我们所说的时间复杂度； <strong>但，随机插入操作居然也是LinkedList落败，耗时9.3秒，ArrayList只要1.5秒</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>---------------------------------------------</span></span>
<span class="line"><span>ns         %     Task name</span></span>
<span class="line"><span>---------------------------------------------</span></span>
<span class="line"><span>6604199591  100%  linkedListGet</span></span>
<span class="line"><span>011494583  000%  arrayListGet</span></span>
<span class="line"><span></span></span>
<span class="line"><span>StopWatch &#39;&#39;: running time = 10729378832 ns</span></span>
<span class="line"><span>---------------------------------------------</span></span>
<span class="line"><span>ns         %     Task name</span></span>
<span class="line"><span>---------------------------------------------</span></span>
<span class="line"><span>9253355484  086%  linkedListAdd</span></span>
<span class="line"><span>1476023348  014%  arrayListAdd</span></span></code></pre></div><p>翻看LinkedList源码发现，插入操作的时间复杂度是O(1)的前提是，你已经有了那个要插入节点的指针。但，在实现的时候，我们需要先通过循环获取到那个节点的Node，然后再执行插入操作。前者也是有开销的，不可能只考虑插入操作本身的代价：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void add(int index, E element) {</span></span>
<span class="line"><span>    checkPositionIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (index == size)</span></span>
<span class="line"><span>        linkLast(element);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        linkBefore(element, node(index));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Node&amp;lt;E&amp;gt; node(int index) {</span></span>
<span class="line"><span>    // assert isElementIndex(index);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (index &amp;lt; (size &amp;gt;&amp;gt; 1)) {</span></span>
<span class="line"><span>        Node&amp;lt;E&amp;gt; x = first;</span></span>
<span class="line"><span>        for (int i = 0; i &amp;lt; index; i++)</span></span>
<span class="line"><span>            x = x.next;</span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        Node&amp;lt;E&amp;gt; x = last;</span></span>
<span class="line"><span>        for (int i = size - 1; i &amp;gt; index; i--)</span></span>
<span class="line"><span>            x = x.prev;</span></span>
<span class="line"><span>        return x;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，对于插入操作，LinkedList的时间复杂度其实也是O(n)。继续做更多实验的话你会发现，在各种常用场景下，LinkedList几乎都不能在性能上胜出ArrayList。</p><p>讽刺的是，LinkedList的作者约书亚 · 布洛克（Josh Bloch），在其推特上回复别人时说，虽然LinkedList是我写的但我从来不用，有谁会真的用吗？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/216778/122a469eb03f16ab61d893ec57b34acc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/216778/122a469eb03f16ab61d893ec57b34acc.png" alt=""></a></p><p>这告诉我们，任何东西理论上和实际上是有差距的，请勿迷信教科书的理论，最好在下定论之前实际测试一下。抛开算法层面不谈，由于CPU缓存、内存连续性等问题，链表这种数据结构的实现方式对性能并不友好，即使在它最擅长的场景都不一定可以发挥威力。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我分享了若干和List列表相关的错误案例，基本都是由“想当然”导致的。</p><p>第一，想当然认为，Arrays.asList和List.subList得到的List是普通的、独立的ArrayList，在使用时出现各种奇怪的问题。</p><ul><li>Arrays.asList得到的是Arrays的内部类ArrayList，List.subList得到的是ArrayList的内部类SubList，不能把这两个内部类转换为ArrayList使用。</li><li>Arrays.asList直接使用了原始数组，可以认为是共享“存储”，而且不支持增删元素；List.subList直接引用了原始的List，也可以认为是共享“存储”，而且对原始List直接进行结构性修改会导致SubList出现异常。</li><li>对Arrays.asList和List.subList容易忽略的是，新的List持有了原始数据的引用，可能会导致原始数据也无法GC的问题，最终导致OOM。</li></ul><p>第二，想当然认为，Arrays.asList一定可以把所有数组转换为正确的List。当传入基本类型数组的时候，List的元素是数组本身，而不是数组中的元素。</p><p>第三，想当然认为，内存中任何集合的搜索都是很快的，结果在搜索超大ArrayList的时候遇到性能问题。我们考虑利用HashMap哈希表随机查找的时间复杂度为O(1)这个特性来优化性能，不过也要考虑HashMap存储空间上的代价，要平衡时间和空间。</p><p>第四，想当然认为，链表适合元素增删的场景，选用LinkedList作为数据结构。在真实场景中读写增删一般是平衡的，而且增删不可能只是对头尾对象进行操作，可能在90%的情况下都得不到性能增益，建议使用之前通过性能测试评估一下。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><p>最后，我给你留下与ArrayList在删除元素方面的坑有关的两个思考题吧。</p><ol><li>调用类型是Integer的ArrayList的remove方法删除元素，传入一个Integer包装类的数字和传入一个int基本类型的数字，结果一样吗？</li><li>循环遍历List，调用remove方法删除元素，往往会遇到ConcurrentModificationException异常，原因是什么，修复方式又是什么呢？</li></ol><p>你还遇到过与集合类相关的其他坑吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把这篇文章分享给你的朋友或同事，一起交流。</p>`,105)])])}const g=a(e,[["render",i]]);export{m as __pageData,g as default};
