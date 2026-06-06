import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"08 | 判等问题：程序里如何确定你就是你？","description":"","frontmatter":{},"headers":[{"level":2,"title":"注意equals和==的区别","slug":"注意equals和-的区别","link":"#注意equals和-的区别","children":[]},{"level":2,"title":"实现一个equals没有这么简单","slug":"实现一个equals没有这么简单","link":"#实现一个equals没有这么简单","children":[]},{"level":2,"title":"hashCode和equals要配对实现","slug":"hashcode和equals要配对实现","link":"#hashcode和equals要配对实现","children":[]},{"level":2,"title":"注意compareTo和equals的逻辑一致性","slug":"注意compareto和equals的逻辑一致性","link":"#注意compareto和equals的逻辑一致性","children":[]},{"level":2,"title":"小心Lombok生成代码的“坑”","slug":"小心lombok生成代码的-坑","link":"#小心lombok生成代码的-坑","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/08-判等问题：程序里如何确定你就是你？.md","filePath":"Java业务开发常见错误100例/08-判等问题：程序里如何确定你就是你？.md","lastUpdated":1779815815000}'),l={name:"Java业务开发常见错误100例/08-判等问题：程序里如何确定你就是你？.md"};function t(i,n,o,c,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_08-判等问题-程序里如何确定你就是你" tabindex="-1">08 | 判等问题：程序里如何确定你就是你？ <a class="header-anchor" href="#_08-判等问题-程序里如何确定你就是你" aria-label="Permalink to &quot;08 | 判等问题：程序里如何确定你就是你？&quot;">​</a></h1><p>你好，我是朱晔。今天，我来和你聊聊程序里的判等问题。</p><p>你可能会说，判等不就是一行代码的事情吗，有什么好说的。但，这一行代码如果处理不当，不仅会出现Bug，还可能会引起内存泄露等问题。涉及判等的Bug，即使是使用==这种错误的判等方式，也不是所有时候都会出问题。所以类似的判等问题不太容易发现，可能会被隐藏很久。</p><p>今天，我就equals、compareTo和Java的数值缓存、字符串驻留等问题展开讨论，希望你可以理解其原理，彻底消除业务代码中的相关Bug。</p><h2 id="注意equals和-的区别" tabindex="-1">注意equals和==的区别 <a class="header-anchor" href="#注意equals和-的区别" aria-label="Permalink to &quot;注意equals和==的区别&quot;">​</a></h2><p>在业务代码中，我们通常使用equals或== 进行判等操作。equals是方法而==是操作符，它们的使用是有区别的：</p><ul><li>对基本类型，比如int、long，进行判等，只能使用==，比较的是直接值。因为基本类型的值就是其数值。</li><li>对引用类型，比如Integer、Long和String，进行判等，需要使用equals进行内容判等。因为引用类型的直接值是指针，使用==的话，比较的是指针，也就是两个对象在内存中的地址，即比较它们是不是同一个对象，而不是比较对象的内容。</li></ul><p>这就引出了我们必须必须要知道的第一个结论： <strong>比较值的内容，除了基本类型只能使用==外，其他类型都需要使用equals</strong>。</p><p>在开篇我提到了，即使使用==对Integer或String进行判等，有些时候也能得到正确结果。这又是为什么呢？</p><p>我们用下面的测试用例深入研究下：</p><ul><li>使用==对两个值为127的直接赋值的Integer对象判等；</li><li>使用==对两个值为128的直接赋值的Integer对象判等；</li><li>使用==对一个值为127的直接赋值的Integer和另一个通过new Integer声明的值为127的对象判等；</li><li>使用==对两个通过new Integer声明的值为127的对象判等；</li><li>使用==对一个值为128的直接赋值的Integer对象和另一个值为128的int基本类型判等。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Integer a = 127; //Integer.valueOf(127)</span></span>
<span class="line"><span>Integer b = 127; //Integer.valueOf(127)</span></span>
<span class="line"><span>log.info(&quot;\\nInteger a = 127;\\n&quot; +</span></span>
<span class="line"><span>        &quot;Integer b = 127;\\n&quot; +</span></span>
<span class="line"><span>        &quot;a == b ? {}&quot;,a == b);</span><span>    // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Integer c = 128; //Integer.valueOf(128)</span></span>
<span class="line"><span>Integer d = 128; //Integer.valueOf(128)</span></span>
<span class="line"><span>log.info(&quot;\\nInteger c = 128;\\n&quot; +</span></span>
<span class="line"><span>        &quot;Integer d = 128;\\n&quot; +</span></span>
<span class="line"><span>        &quot;c == d ? {}&quot;, c == d);</span><span>   //false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Integer e = 127; //Integer.valueOf(127)</span></span>
<span class="line"><span>Integer f = new Integer(127); //new instance</span></span>
<span class="line"><span>log.info(&quot;\\nInteger e = 127;\\n&quot; +</span></span>
<span class="line"><span>        &quot;Integer f = new Integer(127);\\n&quot; +</span></span>
<span class="line"><span>        &quot;e == f ? {}&quot;, e == f);</span><span>   //false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Integer g = new Integer(127); //new instance</span></span>
<span class="line"><span>Integer h = new Integer(127); //new instance</span></span>
<span class="line"><span>log.info(&quot;\\nInteger g = new Integer(127);\\n&quot; +</span></span>
<span class="line"><span>        &quot;Integer h = new Integer(127);\\n&quot; +</span></span>
<span class="line"><span>        &quot;g == h ? {}&quot;, g == h);</span><span>  //false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Integer i = 128; //unbox</span></span>
<span class="line"><span>int j = 128;</span></span>
<span class="line"><span>log.info(&quot;\\nInteger i = 128;\\n&quot; +</span></span>
<span class="line"><span>        &quot;int j = 128;\\n&quot; +</span></span>
<span class="line"><span>        &quot;i == j ? {}&quot;, i == j);</span><span> //true</span></span></code></pre></div><p>通过运行结果可以看到，虽然看起来永远是在对127和127、128和128判等，但==却没有永远给我们true的答复。原因是什么呢？</p><p>第一个案例中，编译器会把Integer a = 127转换为Integer.valueOf(127)。查看源码可以发现，这个 <strong>转换在内部其实做了缓存，使得两个Integer指向同一个对象</strong>，所以==返回true。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static Integer valueOf(int i) {</span></span>
<span class="line"><span>    if (i &amp;gt;= IntegerCache.low &amp;&amp; i &amp;lt;= IntegerCache.high)</span></span>
<span class="line"><span>        return IntegerCache.cache[i + (-IntegerCache.low)];</span></span>
<span class="line"><span>    return new Integer(i);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二个案例中，之所以同样的代码128就返回false的原因是，默认情况下会缓存[-128, 127]的数值，而128处于这个区间之外。设置JVM参数加上-XX:AutoBoxCacheMax=1000再试试，是不是就返回true了呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static class IntegerCache {</span></span>
<span class="line"><span>    static final int low = -128;</span></span>
<span class="line"><span>    static final int high;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        // high value may be configured by property</span></span>
<span class="line"><span>        int h = 127;</span></span>
<span class="line"><span>        String integerCacheHighPropValue =</span></span>
<span class="line"><span>            sun.misc.VM.getSavedProperty(&quot;java.lang.Integer.IntegerCache.high&quot;);</span></span>
<span class="line"><span>        if (integerCacheHighPropValue != null) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                int i = parseInt(integerCacheHighPropValue);</span></span>
<span class="line"><span>                i = Math.max(i, 127);</span></span>
<span class="line"><span>                // Maximum array size is Integer.MAX_VALUE</span></span>
<span class="line"><span>                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);</span></span>
<span class="line"><span>            } catch( NumberFormatException nfe) {</span></span>
<span class="line"><span>                // If the property cannot be parsed into an int, ignore it.</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        high = h;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        cache = new Integer[(high - low) + 1];</span></span>
<span class="line"><span>        int j = low;</span></span>
<span class="line"><span>        for(int k = 0; k &amp;lt; cache.length; k++)</span></span>
<span class="line"><span>            cache[k] = new Integer(j++);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // range [-128, 127] must be interned (JLS7 5.1.7)</span></span>
<span class="line"><span>        assert IntegerCache.high &amp;gt;= 127;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第三和第四个案例中，New出来的Integer始终是不走缓存的新对象。比较两个新对象，或者比较一个新对象和一个来自缓存的对象，结果肯定不是相同的对象，因此返回false。</p><p>第五个案例中，我们把装箱的Integer和基本类型int比较，前者会先拆箱再比较，比较的肯定是数值而不是引用，因此返回true。</p><p>看到这里，对于Integer什么时候是相同对象什么时候是不同对象，就很清楚了吧。但知道这些其实意义不大，因为在大多数时候，我们并不关心Integer对象是否是同一个， <strong>只需要记得比较Integer的值请使用equals，而不是==</strong>（对于基本类型int的比较当然只能使用==）。</p><p>其实，我们应该都知道这个原则，只是有的时候特别容易忽略。以我之前遇到过的一个生产事故为例，有这么一个枚举定义了订单状态和对于状态的描述：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum StatusEnum {</span></span>
<span class="line"><span>    CREATED(1000, &quot;已创建&quot;),</span></span>
<span class="line"><span>    PAID(1001, &quot;已支付&quot;),</span></span>
<span class="line"><span>    DELIVERED(1002, &quot;已送到&quot;),</span></span>
<span class="line"><span>    FINISHED(1003, &quot;已完成&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final Integer status; //注意这里的Integer</span></span>
<span class="line"><span>    private final String desc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    StatusEnum(Integer status, String desc) {</span></span>
<span class="line"><span>        this.status = status;</span></span>
<span class="line"><span>        this.desc = desc;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在业务代码中，开发同学使用了==对枚举和入参OrderQuery中的status属性进行判等：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class OrderQuery {</span></span>
<span class="line"><span>    private Integer status;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;PostMapping(&quot;enumcompare&quot;)</span></span>
<span class="line"><span>public void enumcompare(&amp;#64;RequestBody OrderQuery orderQuery){</span></span>
<span class="line"><span>    StatusEnum statusEnum = StatusEnum.DELIVERED;</span></span>
<span class="line"><span>    log.info(&quot;orderQuery:{} statusEnum:{} result:{}&quot;, orderQuery, statusEnum, statusEnum.status == orderQuery.getStatus());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>因为枚举和入参OrderQuery中的status都是包装类型，所以通过==判等肯定是有问题的。只是这个问题比较隐晦</strong>，究其原因在于：</p><ul><li>只看枚举的定义CREATED(1000, “已创建”)，容易让人误解status值是基本类型；</li><li>因为有Integer缓存机制的存在，所以使用==判等并不是所有情况下都有问题。在这次事故中，订单状态的值从100开始增长，程序一开始不出问题，直到订单状态超过127后才出现Bug。</li></ul><p>在了解清楚为什么Integer使用==判等有时候也有效的原因之后，我们再来看看为什么String也有这个问题。我们使用几个用例来测试下：</p><ul><li>对两个直接声明的值都为1的String使用==判等；</li><li>对两个new出来的值都为2的String使用==判等；</li><li>对两个new出来的值都为3的String先进行intern操作，再使用==判等；</li><li>对两个new出来的值都为4的String通过equals判等。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String a = &quot;1&quot;;</span></span>
<span class="line"><span>String b = &quot;1&quot;;</span></span>
<span class="line"><span>log.info(&quot;\\nString a = \\&quot;1\\&quot;;\\n&quot; +</span></span>
<span class="line"><span>        &quot;String b = \\&quot;1\\&quot;;\\n&quot; +</span></span>
<span class="line"><span>        &quot;a == b ? {}&quot;, a == b);</span><span> //true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String c = new String(&quot;2&quot;);</span></span>
<span class="line"><span>String d = new String(&quot;2&quot;);</span></span>
<span class="line"><span>log.info(&quot;\\nString c = new String(\\&quot;2\\&quot;);\\n&quot; +</span></span>
<span class="line"><span>        &quot;String d = new String(\\&quot;2\\&quot;);&quot; +</span></span>
<span class="line"><span>        &quot;c == d ? {}&quot;, c == d);</span><span> //false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String e = new String(&quot;3&quot;).intern();</span></span>
<span class="line"><span>String f = new String(&quot;3&quot;).intern();</span></span>
<span class="line"><span>log.info(&quot;\\nString e = new String(\\&quot;3\\&quot;).intern();\\n&quot; +</span></span>
<span class="line"><span>        &quot;String f = new String(\\&quot;3\\&quot;).intern();\\n&quot; +</span></span>
<span class="line"><span>        &quot;e == f ? {}&quot;, e == f);</span><span> //true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String g = new String(&quot;4&quot;);</span></span>
<span class="line"><span>String h = new String(&quot;4&quot;);</span></span>
<span class="line"><span>log.info(&quot;\\nString g = new String(\\&quot;4\\&quot;);\\n&quot; +</span></span>
<span class="line"><span>        &quot;String h = new String(\\&quot;4\\&quot;);\\n&quot; +</span></span>
<span class="line"><span>        &quot;g == h ? {}&quot;, g.equals(h));</span><span> //true</span></span></code></pre></div><p>在分析这个结果之前，我先和你说说Java的字符串常量池机制。首先要明确的是其设计初衷是节省内存。当代码中出现双引号形式创建字符串对象时，JVM会先对这个字符串进行检查，如果字符串常量池中存在相同内容的字符串对象的引用，则将这个引用返回；否则，创建新的字符串对象，然后将这个引用放入字符串常量池，并返回该引用。这种机制，就是字符串驻留或池化。</p><p>再回到刚才的例子，再来分析一下运行结果：</p><ul><li>第一个案例返回true，因为Java的字符串驻留机制，直接使用双引号声明出来的两个String对象指向常量池中的相同字符串。</li><li>第二个案例，new出来的两个String是不同对象，引用当然不同，所以得到false的结果。</li><li>第三个案例，使用String提供的intern方法也会走常量池机制，所以同样能得到true。</li><li>第四个案例，通过equals对值内容判等，是正确的处理方式，当然会得到true。</li></ul><p><strong>虽然使用new声明的字符串调用intern方法，也可以让字符串进行驻留，但在业务代码中滥用intern，可能会产生性能问题</strong>。</p><p>写代码测试一下，通过循环把1到1000万之间的数字以字符串形式intern后，存入一个List：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&amp;lt;String&amp;gt; list = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;internperformance&quot;)</span></span>
<span class="line"><span>public int internperformance(&amp;#64;RequestParam(value = &quot;size&quot;, defaultValue = &quot;10000000&quot;)int size) {</span></span>
<span class="line"><span>    //-XX:+PrintStringTableStatistics</span></span>
<span class="line"><span>    //-XX:StringTableSize=10000000</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    list = IntStream.rangeClosed(1, size)</span></span>
<span class="line"><span>            .mapToObj(i-&amp;gt; String.valueOf(i).intern())</span></span>
<span class="line"><span>            .collect(Collectors.toList());</span></span>
<span class="line"><span>    log.info(&quot;size:{} took:{}&quot;, size, System.currentTimeMillis() - begin);</span></span>
<span class="line"><span>    return list.size();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在启动程序时设置JVM参数-XX:+PrintStringTableStatistic，程序退出时可以打印出字符串常量表的统计信息。调用接口后关闭程序，输出如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[11:01:57.770] [http-nio-45678-exec-2] [INFO ] [.t.c.e.d.IntAndStringEqualController:54  ] - size:10000000 took:44907</span></span>
<span class="line"><span>StringTable statistics:</span></span>
<span class="line"><span>Number of buckets       :     60013 =    480104 bytes, avg   8.000</span></span>
<span class="line"><span>Number of entries       :  10030230 = 240725520 bytes, avg  24.000</span></span>
<span class="line"><span>Number of literals      :  10030230 = 563005568 bytes, avg  56.131</span></span>
<span class="line"><span>Total footprint         :           = 804211192 bytes</span></span>
<span class="line"><span>Average bucket size     :   167.134</span></span>
<span class="line"><span>Variance of bucket size :    55.808</span></span>
<span class="line"><span>Std. dev. of bucket size:     7.471</span></span>
<span class="line"><span>Maximum bucket size     :       198</span></span></code></pre></div><p>可以看到，1000万次intern操作耗时居然超过了44秒。</p><p>其实，原因在于字符串常量池是一个固定容量的Map。如果容量太小（Number of buckets=60013）、字符串太多（1000万个字符串），那么每一个桶中的字符串数量会非常多，所以搜索起来就很慢。输出结果中的Average bucket size=167，代表了Map中桶的平均长度是167。</p><p>解决方式是，设置JVM参数-XX:StringTableSize，指定更多的桶。设置-XX:StringTableSize=10000000后，重启应用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[11:09:04.475] [http-nio-45678-exec-1] [INFO ] [.t.c.e.d.IntAndStringEqualController:54  ] - size:10000000 took:5557</span></span>
<span class="line"><span>StringTable statistics:</span></span>
<span class="line"><span>Number of buckets       :  10000000 =  80000000 bytes, avg   8.000</span></span>
<span class="line"><span>Number of entries       :  10030156 = 240723744 bytes, avg  24.000</span></span>
<span class="line"><span>Number of literals      :  10030156 = 562999472 bytes, avg  56.131</span></span>
<span class="line"><span>Total footprint         :           = 883723216 bytes</span></span>
<span class="line"><span>Average bucket size     :     1.003</span></span>
<span class="line"><span>Variance of bucket size :     1.587</span></span>
<span class="line"><span>Std. dev. of bucket size:     1.260</span></span>
<span class="line"><span>Maximum bucket size     :        10</span></span></code></pre></div><p>可以看到，1000万次调用耗时只有5.5秒，Average bucket size降到了1，效果明显。</p><p>好了，是时候给出第二原则了： <strong>没事别轻易用intern，如果要用一定要注意控制驻留的字符串的数量，并留意常量表的各项指标</strong>。</p><h2 id="实现一个equals没有这么简单" tabindex="-1">实现一个equals没有这么简单 <a class="header-anchor" href="#实现一个equals没有这么简单" aria-label="Permalink to &quot;实现一个equals没有这么简单&quot;">​</a></h2><p>如果看过Object类源码，你可能就知道，equals的实现其实是比较对象引用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean equals(Object obj) {</span></span>
<span class="line"><span>    return (this == obj);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>之所以Integer或String能通过equals实现内容判等，是因为它们都重写了这个方法。比如，String的equals的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean equals(Object anObject) {</span></span>
<span class="line"><span>    if (this == anObject) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (anObject instanceof String) {</span></span>
<span class="line"><span>        String anotherString = (String)anObject;</span></span>
<span class="line"><span>        int n = value.length;</span></span>
<span class="line"><span>        if (n == anotherString.value.length) {</span></span>
<span class="line"><span>            char v1[] = value;</span></span>
<span class="line"><span>            char v2[] = anotherString.value;</span></span>
<span class="line"><span>            int i = 0;</span></span>
<span class="line"><span>            while (n-- != 0) {</span></span>
<span class="line"><span>                if (v1[i] != v2[i])</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                i++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于自定义类型，如果不重写equals的话，默认就是使用Object基类的按引用的比较方式。我们写一个自定义类测试一下。</p><p>假设有这样一个描述点的类Point，有x、y和描述三个属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>    private int x;</span></span>
<span class="line"><span>    private int y;</span></span>
<span class="line"><span>    private final String desc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Point(int x, int y, String desc) {</span></span>
<span class="line"><span>        this.x = x;</span></span>
<span class="line"><span>        this.y = y;</span></span>
<span class="line"><span>        this.desc = desc;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>定义三个点p1、p2和p3，其中p1和p2的描述属性不同，p1和p3的三个属性完全相同，并写一段代码测试一下默认行为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Point p1 = new Point(1, 2, &quot;a&quot;);</span></span>
<span class="line"><span>Point p2 = new Point(1, 2, &quot;b&quot;);</span></span>
<span class="line"><span>Point p3 = new Point(1, 2, &quot;a&quot;);</span></span>
<span class="line"><span>log.info(&quot;p1.equals(p2) ? {}&quot;, p1.equals(p2));</span></span>
<span class="line"><span>log.info(&quot;p1.equals(p3) ? {}&quot;, p1.equals(p3));</span></span></code></pre></div><p>通过equals方法比较p1和p2、p1和p3均得到false，原因正如刚才所说，我们并没有为Point类实现自定义的equals方法，Object超类中的equals默认使用==判等，比较的是对象的引用。</p><p>我们期望的逻辑是，只要x和y这2个属性一致就代表是同一个点，所以写出了如下的改进代码，重写equals方法，把参数中的Object转换为Point比较其x和y属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class PointWrong {</span></span>
<span class="line"><span>    private int x;</span></span>
<span class="line"><span>    private int y;</span></span>
<span class="line"><span>    private final String desc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public PointWrong(int x, int y, String desc) {</span></span>
<span class="line"><span>        this.x = x;</span></span>
<span class="line"><span>        this.y = y;</span></span>
<span class="line"><span>        this.desc = desc;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public boolean equals(Object o) {</span></span>
<span class="line"><span>        PointWrong that = (PointWrong) o;</span></span>
<span class="line"><span>        return x == that.x &amp;&amp; y == that.y;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为测试改进后的Point是否可以满足需求，我们定义了三个用例：</p><ul><li>比较一个Point对象和null；</li><li>比较一个Object对象和一个Point对象；</li><li>比较两个x和y属性值相同的Point对象。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PointWrong p1 = new PointWrong(1, 2, &quot;a&quot;);</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>    log.info(&quot;p1.equals(null) ? {}&quot;, p1.equals(null));</span></span>
<span class="line"><span>} catch (Exception ex) {</span></span>
<span class="line"><span>    log.error(ex.getMessage());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Object o = new Object();</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>    log.info(&quot;p1.equals(expression) ? {}&quot;, p1.equals(o));</span></span>
<span class="line"><span>} catch (Exception ex) {</span></span>
<span class="line"><span>    log.error(ex.getMessage());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PointWrong p2 = new PointWrong(1, 2, &quot;b&quot;);</span></span>
<span class="line"><span>log.info(&quot;p1.equals(p2) ? {}&quot;, p1.equals(p2));</span></span></code></pre></div><p>通过日志中的结果可以看到，第一次比较出现了空指针异常，第二次比较出现了类型转换异常，第三次比较符合预期输出了true。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[17:54:39.120] [http-nio-45678-exec-1] [ERROR] [t.c.e.demo1.EqualityMethodController:32  ] - java.lang.NullPointerException</span></span>
<span class="line"><span>[17:54:39.120] [http-nio-45678-exec-1] [ERROR] [t.c.e.demo1.EqualityMethodController:39  ] - java.lang.ClassCastException: java.lang.Object cannot be cast to org.geekbang.time.commonmistakes.equals.demo1.EqualityMethodController$PointWrong</span></span>
<span class="line"><span>[17:54:39.120] [http-nio-45678-exec-1] [INFO ] [t.c.e.demo1.EqualityMethodController:43  ] - p1.equals(p2) ? true</span></span></code></pre></div><p><strong>通过这些失效的用例，我们大概可以总结出实现一个更好的equals应该注意的点：</strong></p><ul><li>考虑到性能，可以先进行指针判等，如果对象是同一个那么直接返回true；</li><li>需要对另一方进行判空，空对象和自身进行比较，结果一定是fasle；</li><li>需要判断两个对象的类型，如果类型都不同，那么直接返回false；</li><li>确保类型相同的情况下再进行类型强制转换，然后逐一判断所有字段。</li></ul><p>修复和改进后的equals方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public boolean equals(Object o) {</span></span>
<span class="line"><span>    if (this == o) return true;</span></span>
<span class="line"><span>    if (o == null || getClass() != o.getClass()) return false;</span></span>
<span class="line"><span>    PointRight that = (PointRight) o;</span></span>
<span class="line"><span>    return x == that.x &amp;&amp; y == that.y;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>改进后的equals看起来完美了，但还没完。我们继续往下看。</p><h2 id="hashcode和equals要配对实现" tabindex="-1">hashCode和equals要配对实现 <a class="header-anchor" href="#hashcode和equals要配对实现" aria-label="Permalink to &quot;hashCode和equals要配对实现&quot;">​</a></h2><p>我们来试试下面这个用例，定义两个x和y属性值完全一致的Point对象p1和p2，把p1加入HashSet，然后判断这个Set中是否存在p2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PointWrong p1 = new PointWrong(1, 2, &quot;a&quot;);</span></span>
<span class="line"><span>PointWrong p2 = new PointWrong(1, 2, &quot;b&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>HashSet&amp;lt;PointWrong&amp;gt; points = new HashSet&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>points.add(p1);</span></span>
<span class="line"><span>log.info(&quot;points.contains(p2) ? {}&quot;, points.contains(p2));</span></span></code></pre></div><p>按照改进后的equals方法，这2个对象可以认为是同一个，Set中已经存在了p1就应该包含p2，但结果却是false。</p><p>出现这个Bug的原因是，散列表需要使用hashCode来定位元素放到哪个桶。如果自定义对象没有实现自定义的hashCode方法，就会使用Object超类的默认实现， <strong>得到的两个hashCode是不同的，导致无法满足需求</strong>。</p><p>要自定义hashCode，我们可以直接使用Objects.hash方法来实现，改进后的Point类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class PointRight {</span></span>
<span class="line"><span>    private final int x;</span></span>
<span class="line"><span>    private final int y;</span></span>
<span class="line"><span>    private final String desc;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public boolean equals(Object o) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public int hashCode() {</span></span>
<span class="line"><span>        return Objects.hash(x, y);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>改进equals和hashCode后，再测试下之前的四个用例，结果全部符合预期。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[18:25:23.091] [http-nio-45678-exec-4] [INFO ] [t.c.e.demo1.EqualityMethodController:54  ] - p1.equals(null) ? false</span></span>
<span class="line"><span>[18:25:23.093] [http-nio-45678-exec-4] [INFO ] [t.c.e.demo1.EqualityMethodController:61  ] - p1.equals(expression) ? false</span></span>
<span class="line"><span>[18:25:23.094] [http-nio-45678-exec-4] [INFO ] [t.c.e.demo1.EqualityMethodController:67  ] - p1.equals(p2) ? true</span></span>
<span class="line"><span>[18:25:23.094] [http-nio-45678-exec-4] [INFO ] [t.c.e.demo1.EqualityMethodController:71  ] - points.contains(p2) ? true</span></span></code></pre></div><p>看到这里，你可能会觉得自己实现equals和hashCode很麻烦，实现equals有很多注意点而且代码量很大。不过，实现这两个方法也有简单的方式，一是后面要讲到的Lombok方法，二是使用IDE的代码生成功能。IDEA的类代码快捷生成菜单支持的功能如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/213604/944fe3549e4c24936e9837d0bf1e3936.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/213604/944fe3549e4c24936e9837d0bf1e3936.jpg" alt=""></a></p><h2 id="注意compareto和equals的逻辑一致性" tabindex="-1">注意compareTo和equals的逻辑一致性 <a class="header-anchor" href="#注意compareto和equals的逻辑一致性" aria-label="Permalink to &quot;注意compareTo和equals的逻辑一致性&quot;">​</a></h2><p>除了自定义类型需要确保equals和hashCode要逻辑一致外，还有一个更容易被忽略的问题，即compareTo同样需要和equals确保逻辑一致性。</p><p>我之前遇到过这么一个问题，代码里本来使用了ArrayList的indexOf方法进行元素搜索，但是一位好心的开发同学觉得逐一比较的时间复杂度是O(n)，效率太低了，于是改为了排序后通过Collections.binarySearch方法进行搜索，实现了O(log n)的时间复杂度。没想到，这么一改却出现了Bug。</p><p>我们来重现下这个问题。首先，定义一个Student类，有id和name两个属性，并实现了一个Comparable接口来返回两个id的值：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;AllArgsConstructor</span></span>
<span class="line"><span>class Student implements Comparable&amp;lt;Student&amp;gt;{</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public int compareTo(Student other) {</span></span>
<span class="line"><span>        int result = Integer.compare(other.id, id);</span></span>
<span class="line"><span>        if (result==0)</span></span>
<span class="line"><span>            log.info(&quot;this {} == other {}&quot;, this, other);</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，写一段测试代码分别通过indexOf方法和Collections.binarySearch方法进行搜索。列表中我们存放了两个学生，第一个学生id是1叫zhang，第二个学生id是2叫wang，搜索这个列表是否存在一个id是2叫li的学生：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;wrong&quot;)</span></span>
<span class="line"><span>public void wrong(){</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&amp;lt;Student&amp;gt; list = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    list.add(new Student(1, &quot;zhang&quot;));</span></span>
<span class="line"><span>    list.add(new Student(2, &quot;wang&quot;));</span></span>
<span class="line"><span>    Student student = new Student(2, &quot;li&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.info(&quot;ArrayList.indexOf&quot;);</span></span>
<span class="line"><span>    int index1 = list.indexOf(student);</span></span>
<span class="line"><span>    Collections.sort(list);</span></span>
<span class="line"><span>    log.info(&quot;Collections.binarySearch&quot;);</span></span>
<span class="line"><span>    int index2 = Collections.binarySearch(list, student);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.info(&quot;index1 = &quot; + index1);</span></span>
<span class="line"><span>    log.info(&quot;index2 = &quot; + index2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码输出的日志如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[18:46:50.226] [http-nio-45678-exec-1] [INFO ] [t.c.equals.demo2.CompareToController:28  ] - ArrayList.indexOf</span></span>
<span class="line"><span>[18:46:50.226] [http-nio-45678-exec-1] [INFO ] [t.c.equals.demo2.CompareToController:31  ] - Collections.binarySearch</span></span>
<span class="line"><span>[18:46:50.227] [http-nio-45678-exec-1] [INFO ] [t.c.equals.demo2.CompareToController:67  ] - this CompareToController.Student(id=2, name=wang) == other CompareToController.Student(id=2, name=li)</span></span>
<span class="line"><span>[18:46:50.227] [http-nio-45678-exec-1] [INFO ] [t.c.equals.demo2.CompareToController:34  ] - index1 = -1</span></span>
<span class="line"><span>[18:46:50.227] [http-nio-45678-exec-1] [INFO ] [t.c.equals.demo2.CompareToController:35  ] - index2 = 1</span></span></code></pre></div><p>我们注意到如下几点：</p><ul><li><strong>binarySearch方法内部调用了元素的compareTo方法进行比较</strong>；</li><li>indexOf的结果没问题，列表中搜索不到id为2、name是li的学生；</li><li>binarySearch返回了索引1，代表搜索到的结果是id为2，name是wang的学生。</li></ul><p>修复方式很简单，确保compareTo的比较逻辑和equals的实现一致即可。重新实现一下Student类，通过Comparator.comparing这个便捷的方法来实现两个字段的比较：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;AllArgsConstructor</span></span>
<span class="line"><span>class StudentRight implements Comparable&amp;lt;StudentRight&amp;gt;{</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public int compareTo(StudentRight other) {</span></span>
<span class="line"><span>        return Comparator.comparing(StudentRight::getName)</span></span>
<span class="line"><span>                .thenComparingInt(StudentRight::getId)</span></span>
<span class="line"><span>                .compare(this, other);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实，这个问题容易被忽略的原因在于两方面：</p><ul><li>一是，我们使用了Lombok的@Data标记了Student，@Data注解（详见 <a href="https://projectlombok.org/features/Data" target="_blank" rel="noreferrer">这里</a>）其实包含了@EqualsAndHashCode注解（详见 <a href="https://projectlombok.org/features/EqualsAndHashCode" target="_blank" rel="noreferrer">这里</a>）的作用，也就是默认情况下使用类型所有的字段（不包括static和transient字段）参与到equals和hashCode方法的实现中。因为这两个方法的实现不是我们自己实现的，所以容易忽略其逻辑。</li><li>二是，compareTo方法需要返回数值，作为排序的依据，容易让人使用数值类型的字段随意实现。</li></ul><p>我再强调下， <strong>对于自定义的类型，如果要实现Comparable，请记得equals、hashCode、compareTo三者逻辑一致</strong>。</p><h2 id="小心lombok生成代码的-坑" tabindex="-1">小心Lombok生成代码的“坑” <a class="header-anchor" href="#小心lombok生成代码的-坑" aria-label="Permalink to &quot;小心Lombok生成代码的“坑”&quot;">​</a></h2><p>Lombok的@Data注解会帮我们实现equals和hashcode方法，但是有继承关系时，Lombok自动生成的方法可能就不是我们期望的了。</p><p>我们先来研究一下其实现：定义一个Person类型，包含姓名和身份证两个字段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>class Person {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private String identity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Person(String name, String identity) {</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>        this.identity = identity;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于身份证相同、姓名不同的两个Person对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Person person1 = new Person(&quot;zhuye&quot;,&quot;001&quot;);</span></span>
<span class="line"><span>Person person2 = new Person(&quot;Joseph&quot;,&quot;001&quot;);</span></span>
<span class="line"><span>log.info(&quot;person1.equals(person2) ? {}&quot;, person1.equals(person2));</span></span></code></pre></div><p>使用equals判等会得到false。如果你希望只要身份证一致就认为是同一个人的话，可以使用@EqualsAndHashCode.Exclude注解来修饰name字段，从equals和hashCode的实现中排除name字段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;EqualsAndHashCode.Exclude</span></span>
<span class="line"><span>private String name;</span></span></code></pre></div><p>修改后得到true。打开编译后的代码可以看到，Lombok为Person生成的equals方法的实现，确实只包含了identity属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean equals(final Object o) {</span></span>
<span class="line"><span>    if (o == this) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    } else if (!(o instanceof LombokEquealsController.Person)) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        LombokEquealsController.Person other = (LombokEquealsController.Person)o;</span></span>
<span class="line"><span>        if (!other.canEqual(this)) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            Object this$identity = this.getIdentity();</span></span>
<span class="line"><span>            Object other$identity = other.getIdentity();</span></span>
<span class="line"><span>            if (this$identity == null) {</span></span>
<span class="line"><span>                if (other$identity != null) {</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else if (!this$identity.equals(other$identity)) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但到这里还没完，如果类型之间有继承，Lombok会怎么处理子类的equals和hashCode呢？我们来测试一下，写一个Employee类继承Person，并新定义一个公司属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>class Employee extends Person {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String company;</span></span>
<span class="line"><span>    public Employee(String name, String identity, String company) {</span></span>
<span class="line"><span>        super(name, identity);</span></span>
<span class="line"><span>        this.company = company;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在如下的测试代码中，声明两个Employee实例，它们具有相同的公司名称，但姓名和身份证均不同：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Employee employee1 = new Employee(&quot;zhuye&quot;,&quot;001&quot;, &quot;bkjk.com&quot;);</span></span>
<span class="line"><span>Employee employee2 = new Employee(&quot;Joseph&quot;,&quot;002&quot;, &quot;bkjk.com&quot;);</span></span>
<span class="line"><span>log.info(&quot;employee1.equals(employee2) ? {}&quot;, employee1.equals(employee2));</span></span></code></pre></div><p>很遗憾，结果是true，显然是没有考虑父类的属性，而认为这两个员工是同一人， <strong>说明@EqualsAndHashCode默认实现没有使用父类属性。</strong></p><p>为解决这个问题，我们可以手动设置callSuper开关为true，来覆盖这种默认行为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;EqualsAndHashCode(callSuper = true)</span></span>
<span class="line"><span>class Employee extends Person {</span></span></code></pre></div><p>修改后的代码，实现了同时以子类的属性company加上父类中的属性identity，作为equals和hashCode方法的实现条件（实现上其实是调用了父类的equals和hashCode）。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>现在，我们来回顾下对象判等和比较的重点内容吧。</p><p>首先，我们要注意equals和== 的区别。业务代码中进行内容的比较，针对基本类型只能使用==，针对Integer、String在内的引用类型，需要使用equals。Integer和String的坑在于，使用==判等有时也能获得正确结果。</p><p>其次，对于自定义类型，如果类型需要参与判等，那么务必同时实现equals和hashCode方法，并确保逻辑一致。如果希望快速实现equals、hashCode方法，我们可以借助IDE的代码生成功能，或使用Lombok来生成。如果类型也要参与比较，那么compareTo方法的逻辑同样需要和equals、hashCode方法一致。</p><p>最后，Lombok的@EqualsAndHashCode注解实现equals和hashCode的时候，默认使用类型所有非static、非transient的字段，且不考虑父类。如果希望改变这种默认行为，可以使用@EqualsAndHashCode.Exclude排除一些字段，并设置callSuper = true来让子类的equals和hashCode调用父类的相应方法。</p><p>在比较枚举值和POJO参数值的例子中，我们还可以注意到，使用==来判断两个包装类型的低级错误，确实容易被忽略。所以， <strong>我建议你在IDE中安装阿里巴巴的Java规约插件</strong>（详见 <a href="https://github.com/alibaba/p3c" target="_blank" rel="noreferrer">这里</a>），来及时提示我们这类低级错误：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/213604/fe020d747a35cec23e5d92c1277d02c3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/213604/fe020d747a35cec23e5d92c1277d02c3.png" alt=""></a></p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>在实现equals时，我是先通过getClass方法判断两个对象的类型，你可能会想到还可以使用instanceof来判断。你能说说这两种实现方式的区别吗？</li><li>在第三节的例子中，我演示了可以通过HashSet的contains方法判断元素是否在HashSet中，同样是Set的TreeSet其contains方法和HashSet有什么区别吗？</li></ol><p>有关对象判等、比较，你还遇到过其他坑吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把这篇文章分享给你的朋友或同事，一起交流。</p>`,122)])])}const h=s(l,[["render",t]]);export{d as __pageData,h as default};
