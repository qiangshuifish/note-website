import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"18 | 当反射、注解和泛型遇到OOP时，会有哪些坑？","description":"","frontmatter":{},"headers":[{"level":2,"title":"反射调用方法不是以传参决定重载","slug":"反射调用方法不是以传参决定重载","link":"#反射调用方法不是以传参决定重载","children":[]},{"level":2,"title":"泛型经过类型擦除多出桥接方法的坑","slug":"泛型经过类型擦除多出桥接方法的坑","link":"#泛型经过类型擦除多出桥接方法的坑","children":[]},{"level":2,"title":"注解可以继承吗？","slug":"注解可以继承吗","link":"#注解可以继承吗","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/18-当反射、注解和泛型遇到OOP时，会有哪些坑？.md","filePath":"Java业务开发常见错误100例/18-当反射、注解和泛型遇到OOP时，会有哪些坑？.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/18-当反射、注解和泛型遇到OOP时，会有哪些坑？.md"};function l(i,a,o,c,d,r){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_18-当反射、注解和泛型遇到oop时-会有哪些坑" tabindex="-1">18 | 当反射、注解和泛型遇到OOP时，会有哪些坑？ <a class="header-anchor" href="#_18-当反射、注解和泛型遇到oop时-会有哪些坑" aria-label="Permalink to &quot;18 | 当反射、注解和泛型遇到OOP时，会有哪些坑？&quot;">​</a></h1><p>你好，我是朱晔。今天，我们聊聊Java高级特性的话题，看看反射、注解和泛型遇到重载和继承时可能会产生的坑。</p><p>你可能说，业务项目中几乎都是增删改查，用到反射、注解和泛型这些高级特性的机会少之又少，没啥好学的。但我要说的是，只有学好、用好这些高级特性，才能开发出更简洁易读的代码，而且几乎所有的框架都使用了这三大高级特性。比如，要减少重复代码，就得用到反射和注解（详见第21讲）。</p><p>如果你从来没用过反射、注解和泛型，可以先通过官网有一个大概了解：</p><ul><li><a href="https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html" target="_blank" rel="noreferrer">Java Reflection API</a> &amp; <a href="https://docs.oracle.com/javase/tutorial/reflect/index.html" target="_blank" rel="noreferrer">Reflection Tutorials</a>；</li><li><a href="https://docs.oracle.com/javase/8/docs/technotes/guides/language/annotations.html" target="_blank" rel="noreferrer">Annotations</a> &amp; <a href="https://docs.oracle.com/javase/tutorial/java/annotations/index.html" target="_blank" rel="noreferrer">Lesson: Annotations</a>；</li><li><a href="https://docs.oracle.com/javase/8/docs/technotes/guides/language/generics.html" target="_blank" rel="noreferrer">Generics</a> &amp; <a href="https://docs.oracle.com/javase/tutorial/java/generics/index.html" target="_blank" rel="noreferrer">Lesson: Generics</a>。</li></ul><p>接下来，我们就通过几个案例，看看这三大特性结合OOP使用时会有哪些坑吧。</p><h2 id="反射调用方法不是以传参决定重载" tabindex="-1">反射调用方法不是以传参决定重载 <a class="header-anchor" href="#反射调用方法不是以传参决定重载" aria-label="Permalink to &quot;反射调用方法不是以传参决定重载&quot;">​</a></h2><p>反射的功能包括，在运行时动态获取类和类成员定义，以及动态读取属性调用方法。也就是说，针对类动态调用方法，不管类中字段和方法怎么变动，我们都可以用相同的规则来读取信息和执行方法。因此，几乎所有的ORM（对象关系映射）、对象映射、MVC框架都使用了反射。</p><p>反射的起点是Class类，Class类提供了各种方法帮我们查询它的信息。你可以通过这个 <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html" target="_blank" rel="noreferrer">文档</a>，了解每一个方法的作用。</p><p>接下来，我们先看一个反射调用方法遇到重载的坑：有两个叫age的方法，入参分别是基本类型int和包装类型Integer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class ReflectionIssueApplication {</span></span>
<span class="line"><span>	private void age(int age) {</span></span>
<span class="line"><span>	    log.info(&quot;int age = {}&quot;, age);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private void age(Integer age) {</span></span>
<span class="line"><span>	    log.info(&quot;Integer age = {}&quot;, age);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果不通过反射调用，走哪个重载方法很清晰，比如传入36走int参数的重载方法，传入Integer.valueOf(“36”)走Integer重载：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ReflectionIssueApplication application = new ReflectionIssueApplication();</span></span>
<span class="line"><span>application.age(36);</span></span>
<span class="line"><span>application.age(Integer.valueOf(&quot;36&quot;));</span></span></code></pre></div><p><strong>但使用反射时的误区是，认为反射调用方法还是根据入参确定方法重载</strong>。比如，使用getDeclaredMethod来获取age方法，然后传入Integer.valueOf(“36”)：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>getClass().getDeclaredMethod(&quot;age&quot;, Integer.TYPE).invoke(this, Integer.valueOf(&quot;36&quot;));</span></span></code></pre></div><p>输出的日志证明，走的是int重载方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>14:23:09.801 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo1.ReflectionIssueApplication - int age = 36</span></span></code></pre></div><p>其实，要通过反射进行方法调用，第一步就是通过方法签名来确定方法。具体到这个案例，getDeclaredMethod传入的参数类型Integer.TYPE代表的是int，所以实际执行方法时无论传的是包装类型还是基本类型，都会调用int入参的age方法。</p><p>把Integer.TYPE改为Integer.class，执行的参数类型就是包装类型的Integer。这时，无论传入的是Integer.valueOf(“36”)还是基本类型的36：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>getClass().getDeclaredMethod(&quot;age&quot;, Integer.class).invoke(this, Integer.valueOf(&quot;36&quot;));</span></span>
<span class="line"><span>getClass().getDeclaredMethod(&quot;age&quot;, Integer.class).invoke(this, 36);</span></span></code></pre></div><p>都会调用Integer为入参的age方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>14:25:18.028 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo1.ReflectionIssueApplication - Integer age = 36</span></span>
<span class="line"><span>14:25:18.029 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo1.ReflectionIssueApplication - Integer age = 36</span></span></code></pre></div><p>现在我们非常清楚了，反射调用方法，是以反射获取方法时传入的方法名称和参数类型来确定调用方法的。接下来，我们再来看一下反射、泛型擦除和继承结合在一起会碰撞出什么坑。</p><h2 id="泛型经过类型擦除多出桥接方法的坑" tabindex="-1">泛型经过类型擦除多出桥接方法的坑 <a class="header-anchor" href="#泛型经过类型擦除多出桥接方法的坑" aria-label="Permalink to &quot;泛型经过类型擦除多出桥接方法的坑&quot;">​</a></h2><p>泛型是一种风格或范式，一般用于强类型程序设计语言，允许开发者使用类型参数替代明确的类型，实例化时再指明具体的类型。它是代码重用的有效手段，允许把一套代码应用到多种数据类型上，避免针对每一种数据类型实现重复的代码。</p><p>Java 编译器对泛型应用了强大的类型检测，如果代码违反了类型安全就会报错，可以在编译时暴露大多数泛型的编码错误。但总有一部分编码错误，比如泛型类型擦除的坑，在运行时才会暴露。接下来，我就和你分享一个案例吧。</p><p>有一个项目希望在类字段内容变动时记录日志，于是开发同学就想到定义一个泛型父类，并在父类中定义一个统一的日志记录方法，子类可以通过继承重用这个方法。代码上线后业务没啥问题，但总是出现日志重复记录的问题。开始时，我们怀疑是日志框架的问题，排查到最后才发现是泛型的问题，反复修改多次才解决了这个问题。</p><p>父类是这样的：有一个泛型占位符T；有一个AtomicInteger计数器，用来记录value字段更新的次数，其中value字段是泛型T类型的，setValue方法每次为value赋值时对计数器进行+1操作。我重写了toString方法，输出value字段的值和计数器的值：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Parent&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span>    //用于记录value更新的次数，模拟日志记录的逻辑</span></span>
<span class="line"><span>    AtomicInteger updateCount = new AtomicInteger();</span></span>
<span class="line"><span>    private T value;</span></span>
<span class="line"><span>    //重写toString，输出值和值更新次数</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return String.format(&quot;value: %s updateCount: %d&quot;, value, updateCount.get());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置值</span></span>
<span class="line"><span>    public void setValue(T value) {</span></span>
<span class="line"><span>        this.value = value;</span></span>
<span class="line"><span>        updateCount.incrementAndGet();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>子类Child1的实现是这样的：继承父类，但没有提供父类泛型参数；定义了一个参数为String的setValue方法，通过super.setValue调用父类方法实现日志记录。我们也能明白，开发同学这么设计是希望覆盖父类的setValue实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Child1 extends Parent {</span></span>
<span class="line"><span>    public void setValue(String value) {</span></span>
<span class="line"><span>        System.out.println(&quot;Child1.setValue called&quot;);</span></span>
<span class="line"><span>        super.setValue(value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在实现的时候，子类方法的调用是通过反射进行的。实例化Child1类型后，通过getClass().getMethods方法获得所有的方法；然后按照方法名过滤出setValue方法进行调用，传入字符串test作为参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Child1 child1 = new Child1();</span></span>
<span class="line"><span>Arrays.stream(child1.getClass().getMethods())</span></span>
<span class="line"><span>        .filter(method -&amp;gt; method.getName().equals(&quot;setValue&quot;))</span></span>
<span class="line"><span>        .forEach(method -&amp;gt; {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                method.invoke(child1, &quot;test&quot;);</span></span>
<span class="line"><span>            } catch (Exception e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>System.out.println(child1.toString());</span></span></code></pre></div><p>运行代码后可以看到，虽然Parent的value字段正确设置了test，但父类的setValue方法调用了两次，计数器也显示2而不是1：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Child1.setValue called</span></span>
<span class="line"><span>Parent.setValue called</span></span>
<span class="line"><span>Parent.setValue called</span></span>
<span class="line"><span>value: test updateCount: 2</span></span></code></pre></div><p>显然，两次Parent的setValue方法调用，是因为getMethods方法找到了两个名为setValue的方法，分别是父类和子类的setValue方法。</p><p>这个案例中，子类方法重写父类方法失败的原因，包括两方面：</p><ul><li>一是，子类没有指定String泛型参数，父类的泛型方法setValue(T value)在泛型擦除后是setValue(Object value)，子类中入参是String的setValue方法被当作了新方法；</li><li>二是， <strong>子类的setValue方法没有增加@Override注解，因此编译器没能检测到重写失败的问题。这就说明，重写子类方法时，标记@Override是一个好习惯</strong>。</li></ul><p>但是，开发同学认为问题出在反射API使用不当，却没意识到重写失败。他查文档后发现，getMethods方法能获得当前类和父类的所有public方法，而getDeclaredMethods只能获得当前类所有的public、protected、package和private方法。</p><p>于是，他就用getDeclaredMethods替代了getMethods：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Arrays.stream(child1.getClass().getDeclaredMethods())</span></span>
<span class="line"><span>    .filter(method -&amp;gt; method.getName().equals(&quot;setValue&quot;))</span></span>
<span class="line"><span>    .forEach(method -&amp;gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            method.invoke(child1, &quot;test&quot;);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span></code></pre></div><p>这样虽然能解决重复记录日志的问题，但没有解决子类方法重写父类方法失败的问题，得到如下输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Child1.setValue called</span></span>
<span class="line"><span>Parent.setValue called</span></span>
<span class="line"><span>value: test updateCount: 1</span></span></code></pre></div><p>其实这治标不治本，其他人使用Child1时还是会发现有两个setValue方法，非常容易让人困惑。</p><p>幸好，架构师在修复上线前发现了这个问题，让开发同学重新实现了Child2，继承Parent的时候提供了String作为泛型T类型，并使用@Override关键字注释了setValue方法，实现了真正有效的方法重写：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Child2 extends Parent&amp;lt;String&amp;gt; {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void setValue(String value) {</span></span>
<span class="line"><span>        System.out.println(&quot;Child2.setValue called&quot;);</span></span>
<span class="line"><span>        super.setValue(value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但很可惜，修复代码上线后，还是出现了日志重复记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Child2.setValue called</span></span>
<span class="line"><span>Parent.setValue called</span></span>
<span class="line"><span>Child2.setValue called</span></span>
<span class="line"><span>Parent.setValue called</span></span>
<span class="line"><span>value: test updateCount: 2</span></span></code></pre></div><p>可以看到，这次是Child2类的setValue方法被调用了两次。开发同学惊讶地说，肯定是反射出Bug了，通过getDeclaredMethods查找到的方法一定是来自Child2类本身；而且，怎么看Child2类中也只有一个setValue方法，为什么还会重复呢？</p><p>调试一下可以发现，Child2类其实有2个setValue方法，入参分别是String和Object。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/225596/81116d6f11440f92757e4fe775df71b8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/225596/81116d6f11440f92757e4fe775df71b8.png" alt=""></a></p><p>如果不通过反射来调用方法，我们确实很难发现这个问题。 <strong>其实，这就是泛型类型擦除导致的问题</strong>。我们来分析一下。</p><p>我们知道，Java的泛型类型在编译后擦除为Object。虽然子类指定了父类泛型T类型是String，但编译后T会被擦除成为Object，所以父类setValue方法的入参是Object，value也是Object。如果子类Child2的setValue方法要覆盖父类的setValue方法，那入参也必须是Object。所以，编译器会为我们生成一个所谓的bridge桥接方法，你可以使用javap命令来反编译编译后的Child2类的class字节码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>javap -c /Users/zhuye/Documents/common-mistakes/target/classes/org/geekbang/time/commonmistakes/advancedfeatures/demo3/Child2.class</span></span>
<span class="line"><span>Compiled from &quot;GenericAndInheritanceApplication.java&quot;</span></span>
<span class="line"><span>class org.geekbang.time.commonmistakes.advancedfeatures.demo3.Child2 extends org.geekbang.time.commonmistakes.advancedfeatures.demo3.Parent&amp;lt;java.lang.String&amp;gt; {</span></span>
<span class="line"><span>  org.geekbang.time.commonmistakes.advancedfeatures.demo3.Child2();</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: aload_0</span></span>
<span class="line"><span>       1: invokespecial #1                  // Method org/geekbang/time/commonmistakes/advancedfeatures/demo3/Parent.&quot;&amp;lt;init&amp;gt;&quot;:()V</span></span>
<span class="line"><span>       4: return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setValue(java.lang.String);</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;</span></span>
<span class="line"><span>       3: ldc           #3                  // String Child2.setValue called</span></span>
<span class="line"><span>       5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V</span></span>
<span class="line"><span>       8: aload_0</span></span>
<span class="line"><span>       9: aload_1</span></span>
<span class="line"><span>      10: invokespecial #5                  // Method org/geekbang/time/commonmistakes/advancedfeatures/demo3/Parent.setValue:(Ljava/lang/Object;)V</span></span>
<span class="line"><span>      13: return</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setValue(java.lang.Object);</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: aload_0</span></span>
<span class="line"><span>       1: aload_1</span></span>
<span class="line"><span>       2: checkcast     #6                  // class java/lang/String</span></span>
<span class="line"><span>       5: invokevirtual #7                  // Method setValue:(Ljava/lang/String;)V</span></span>
<span class="line"><span>       8: return</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，入参为Object的setValue方法在内部调用了入参为String的setValue方法（第27行），也就是代码里实现的那个方法。如果编译器没有帮我们实现这个桥接方法，那么Child2子类重写的是父类经过泛型类型擦除后、入参是Object的setValue方法。这两个方法的参数，一个是String一个是Object，明显不符合Java的语义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Parent {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AtomicInteger updateCount = new AtomicInteger();</span></span>
<span class="line"><span>    private Object value;</span></span>
<span class="line"><span>    public void setValue(Object value) {</span></span>
<span class="line"><span>        System.out.println(&quot;Parent.setValue called&quot;);</span></span>
<span class="line"><span>        this.value = value;</span></span>
<span class="line"><span>        updateCount.incrementAndGet();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Child2 extends Parent {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void setValue(String value) {</span></span>
<span class="line"><span>        System.out.println(&quot;Child2.setValue called&quot;);</span></span>
<span class="line"><span>        super.setValue(value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用jclasslib工具打开Child2类，同样可以看到入参为Object的桥接方法上标记了public + synthetic + bridge三个属性。synthetic代表由编译器生成的不可见代码，bridge代表这是泛型类型擦除后生成的桥接代码：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/225596/b5e30fb0ade19d71cd7fad1730e85808.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/225596/b5e30fb0ade19d71cd7fad1730e85808.png" alt=""></a></p><p>知道这个问题之后，修改方式就明朗了，可以使用method的isBridge方法，来判断方法是不是桥接方法：</p><ul><li>通过getDeclaredMethods方法获取到所有方法后，必须同时根据方法名setValue和非isBridge两个条件过滤，才能实现唯一过滤；</li><li>使用Stream时，如果希望只匹配0或1项的话，可以考虑配合ifPresent来使用findFirst方法。</li></ul><p>修复代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Arrays.stream(child2.getClass().getDeclaredMethods())</span></span>
<span class="line"><span>        .filter(method -&amp;gt; method.getName().equals(&quot;setValue&quot;) &amp;&amp; !method.isBridge())</span></span>
<span class="line"><span>        .findFirst().ifPresent(method -&amp;gt; {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        method.invoke(chi2, &quot;test&quot;);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>这样就可以得到正确输出了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Child2.setValue called</span></span>
<span class="line"><span>Parent.setValue called</span></span>
<span class="line"><span>value: test updateCount: 1</span></span></code></pre></div><p><strong>最后小结下，使用反射查询类方法清单时，我们要注意两点</strong>：</p><ul><li>getMethods和getDeclaredMethods是有区别的，前者可以查询到父类方法，后者只能查询到当前类。</li><li>反射进行方法调用要注意过滤桥接方法。</li></ul><h2 id="注解可以继承吗" tabindex="-1">注解可以继承吗？ <a class="header-anchor" href="#注解可以继承吗" aria-label="Permalink to &quot;注解可以继承吗？&quot;">​</a></h2><p>注解可以为Java代码提供元数据，各种框架也都会利用注解来暴露功能，比如Spring框架中的@Service、@Controller、@Bean注解，Spring Boot的@SpringBootApplication注解。</p><p>框架可以通过类或方法等元素上标记的注解，来了解它们的功能或特性，并以此来启用或执行相应的功能。通过注解而不是API调用来配置框架，属于声明式交互，可以简化框架的配置工作，也可以和框架解耦。</p><p>开发同学可能会认为，类继承后，类的注解也可以继承，子类重写父类方法后，父类方法上的注解也能作用于子类，但这些观点其实是错误或者说是不全面的。我们来验证下吧。</p><p>首先，定义一个包含value属性的MyAnnotation注解，可以标记在方法或类上：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public &amp;#64;interface MyAnnotation {</span></span>
<span class="line"><span>    String value();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，定义一个标记了@MyAnnotation注解的父类Parent，设置value为Class字符串；同时这个类的foo方法也标记了@MyAnnotation注解，设置value为Method字符串。接下来，定义一个子类Child继承Parent父类，并重写父类的foo方法，子类的foo方法和类上都没有@MyAnnotation注解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;MyAnnotation(value = &quot;Class&quot;)</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>static class Parent {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;MyAnnotation(value = &quot;Method&quot;)</span></span>
<span class="line"><span>    public void foo() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>static class Child extends Parent {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void foo() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再接下来，通过反射分别获取Parent和Child的类和方法的注解信息，并输出注解的value属性的值（如果注解不存在则输出空字符串）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static String getAnnotationValue(MyAnnotation annotation) {</span></span>
<span class="line"><span>    if (annotation == null) return &quot;&quot;;</span></span>
<span class="line"><span>    return annotation.value();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static void wrong() throws NoSuchMethodException {</span></span>
<span class="line"><span>    //获取父类的类和方法上的注解</span></span>
<span class="line"><span>    Parent parent = new Parent();</span></span>
<span class="line"><span>    log.info(&quot;ParentClass:{}&quot;, getAnnotationValue(parent.getClass().getAnnotation(MyAnnotation.class)));</span></span>
<span class="line"><span>    log.info(&quot;ParentMethod:{}&quot;, getAnnotationValue(parent.getClass().getMethod(&quot;foo&quot;).getAnnotation(MyAnnotation.class)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //获取子类的类和方法上的注解</span></span>
<span class="line"><span>    Child child = new Child();</span></span>
<span class="line"><span>    log.info(&quot;ChildClass:{}&quot;, getAnnotationValue(child.getClass().getAnnotation(MyAnnotation.class)));</span></span>
<span class="line"><span>    log.info(&quot;ChildMethod:{}&quot;, getAnnotationValue(child.getClass().getMethod(&quot;foo&quot;).getAnnotation(MyAnnotation.class)));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>17:34:25.495 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ParentClass:Class</span></span>
<span class="line"><span>17:34:25.501 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ParentMethod:Method</span></span>
<span class="line"><span>17:34:25.504 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ChildClass:</span></span>
<span class="line"><span>17:34:25.504 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ChildMethod:</span></span></code></pre></div><p>可以看到，父类的类和方法上的注解都可以正确获得，但是子类的类和方法却不能。这说明， <strong>子类以及子类的方法，无法自动继承父类和父类方法上的注解</strong>。</p><p>如果你详细了解过注解应该知道，在注解上标记@Inherited元注解可以实现注解的继承。那么，把@MyAnnotation注解标记了@Inherited，就可以一键解决问题了吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Inherited</span></span>
<span class="line"><span>public &amp;#64;interface MyAnnotation {</span></span>
<span class="line"><span>    String value();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重新运行代码输出如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>17:44:54.831 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ParentClass:Class</span></span>
<span class="line"><span>17:44:54.837 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ParentMethod:Method</span></span>
<span class="line"><span>17:44:54.838 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ChildClass:Class</span></span>
<span class="line"><span>17:44:54.838 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ChildMethod:</span></span></code></pre></div><p>可以看到，子类可以获得父类上的注解；子类foo方法虽然是重写父类方法，并且注解本身也支持继承，但还是无法获得方法上的注解。</p><p>如果你再仔细阅读一下 <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Inherited.html" target="_blank" rel="noreferrer">@Inherited的文档</a> 就会发现，@Inherited只能实现类上的注解继承。要想实现方法上注解的继承，你可以通过反射在继承链上找到方法上的注解。但，这样实现起来很繁琐，而且需要考虑桥接方法。</p><p>好在Spring提供了AnnotatedElementUtils类，来方便我们处理注解的继承问题。这个类的findMergedAnnotation工具方法，可以帮助我们找出父类和接口、父类方法和接口方法上的注解，并可以处理桥接方法，实现一键找到继承链的注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Child child = new Child();</span></span>
<span class="line"><span>log.info(&quot;ChildClass:{}&quot;, getAnnotationValue(AnnotatedElementUtils.findMergedAnnotation(child.getClass(), MyAnnotation.class)));</span></span>
<span class="line"><span>log.info(&quot;ChildMethod:{}&quot;, getAnnotationValue(AnnotatedElementUtils.findMergedAnnotation(child.getClass().getMethod(&quot;foo&quot;), MyAnnotation.class)));</span></span></code></pre></div><p>修改后，可以得到如下输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>17:47:30.058 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ChildClass:Class</span></span>
<span class="line"><span>17:47:30.059 [main] INFO org.geekbang.time.commonmistakes.advancedfeatures.demo2.AnnotationInheritanceApplication - ChildMethod:Method</span></span></code></pre></div><p>可以看到，子类foo方法也获得了父类方法上的注解。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我和你分享了使用Java反射、注解和泛型高级特性配合OOP时，可能会遇到的一些坑。</p><p>第一，反射调用方法并不是通过调用时的传参确定方法重载，而是在获取方法的时候通过方法名和参数类型来确定的。遇到方法有包装类型和基本类型重载的时候，你需要特别注意这一点。</p><p>第二，反射获取类成员，需要注意getXXX和getDeclaredXXX方法的区别，其中XXX包括Methods、Fields、Constructors、Annotations。这两类方法，针对不同的成员类型XXX和对象，在实现上都有一些细节差异，详情请查看 <a href="https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html" target="_blank" rel="noreferrer">官方文档</a>。今天提到的getDeclaredMethods方法无法获得父类定义的方法，而getMethods方法可以，只是差异之一，不能适用于所有的XXX。</p><p>第三，泛型因为类型擦除会导致泛型方法T占位符被替换为Object，子类如果使用具体类型覆盖父类实现，编译器会生成桥接方法。这样既满足子类方法重写父类方法的定义，又满足子类实现的方法有具体的类型。使用反射来获取方法清单时，你需要特别注意这一点。</p><p>第四，自定义注解可以通过标记元注解@Inherited实现注解的继承，不过这只适用于类。如果要继承定义在接口或方法上的注解，可以使用Spring的工具类AnnotatedElementUtils，并注意各种getXXX方法和findXXX方法的区别，详情查看 <a href="https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/annotation/AnnotatedElementUtils.html" target="_blank" rel="noreferrer">Spring的文档</a>。</p><p>最后，我要说的是。编译后的代码和原始代码并不完全一致，编译器可能会做一些优化，加上还有诸如AspectJ等编译时增强框架，使用反射动态获取类型的元数据可能会和我们编写的源码有差异，这点需要特别注意。你可以在反射中多写断言，遇到非预期的情况直接抛异常，避免通过反射实现的业务逻辑不符合预期。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>泛型类型擦除后会生成一个bridge方法，这个方法同时又是synthetic方法。除了泛型类型擦除，你知道还有什么情况编译器会生成synthetic方法吗？</li><li>关于注解继承问题，你觉得Spring的常用注解@Service、@Controller是否支持继承呢？</li></ol><p>你还遇到过与Java高级特性相关的其他坑吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,101)])])}const h=s(t,[["render",l]]);export{u as __pageData,h as default};
