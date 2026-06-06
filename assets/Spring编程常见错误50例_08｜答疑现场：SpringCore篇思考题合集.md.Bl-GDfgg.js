import{_ as a,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"08｜答疑现场：Spring Core 篇思考题合集","description":"","frontmatter":{},"headers":[{"level":2,"title":"第1课","slug":"第1课","link":"#第1课","children":[]},{"level":2,"title":"第2课","slug":"第2课","link":"#第2课","children":[]},{"level":2,"title":"第3课","slug":"第3课","link":"#第3课","children":[]},{"level":2,"title":"第4课","slug":"第4课","link":"#第4课","children":[]},{"level":2,"title":"第5课","slug":"第5课","link":"#第5课","children":[]},{"level":2,"title":"第6课","slug":"第6课","link":"#第6课","children":[]},{"level":2,"title":"第7课","slug":"第7课","link":"#第7课","children":[]}],"relativePath":"Spring编程常见错误50例/08｜答疑现场：SpringCore篇思考题合集.md","filePath":"Spring编程常见错误50例/08｜答疑现场：SpringCore篇思考题合集.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/08｜答疑现场：SpringCore篇思考题合集.md"};function l(i,n,r,o,c,d){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_08-答疑现场-spring-core-篇思考题合集" tabindex="-1">08｜答疑现场：Spring Core 篇思考题合集 <a class="header-anchor" href="#_08-答疑现场-spring-core-篇思考题合集" aria-label="Permalink to &quot;08｜答疑现场：Spring Core 篇思考题合集&quot;">​</a></h1><p>你好，我是傅健。</p><p>如果你看到这篇文章，那么我真的非常开心，这说明第一章节的内容你都跟下来了，并且对于课后的思考题也有研究，在这我要手动给你点个赞。繁忙的工作中，还能为自己持续充电，保持终身学习的心态，我想我们一定是同路人。</p><p>那么到今天为止，我们已经学习了 17 个案例，解决的问题也不算少了，不知道你的感受如何？收获如何呢？</p><p>我还记得 <a href="https://time.geekbang.org/column/article/364661" target="_blank" rel="noreferrer">开篇词</a> 的留言区中有位很有趣的同学，他说：“作为一线 bug 制造者，希望能少写点 bug。” 感同身受，和 Spring 斗智斗勇的这些年，我也经常为一些问题而抓狂过，因不能及时解决而焦虑过，但最终还是觉得蛮有趣的，这个专栏也算是沉淀之作，希望能给你带来一些实际的帮助。</p><p>最初，我其实是想每节课都和你交流下上节课的思考题，但又担心大家的学习进度不一样，所以就有了这次的集中答疑，我把我的答案给到大家，你也可以对照着去看一看，也许有更好的方法，欢迎你来贡献“选项”，我们一起交流。希望大家都能在问题的解决中获得一些正向反馈，完成学习闭环。</p><h2 id="第1课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/364761" target="_blank" rel="noreferrer">第1课</a></strong> <a class="header-anchor" href="#第1课" aria-label="Permalink to &quot;**[第1课](https://time.geekbang.org/column/article/364761)**&quot;">​</a></h2><p>在案例 2 中，显示定义构造器，这会发生根据构造器参数寻找对应 Bean 的行为。这里请你思考一个问题，假设寻找不到对应的 Bean，一定会如案例 2 那样直接报错么？</p><p>实际上，答案是否定的。这里我们不妨修改下案例 2 的代码，修改后如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ServiceImpl {</span></span>
<span class="line"><span>    private List&amp;lt;String&amp;gt; serviceNames;</span></span>
<span class="line"><span>    public ServiceImpl(List&amp;lt;String&amp;gt; serviceNames){</span></span>
<span class="line"><span>        this.serviceNames = serviceNames;</span></span>
<span class="line"><span>        System.out.println(this.serviceNames);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>参考上述代码，我们的构造器参数由普通的String改成了一个List，最终运行程序会发现这并不会报错，而是输出 []。</p><p>要了解这个现象，我们可以直接定位构建构造器调用参数的代码所在地（即 ConstructorResolver#resolveAutowiredArgument）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>protected Object resolveAutowiredArgument(MethodParameter param, String beanName,</span></span>
<span class="line"><span>      &amp;#64;Nullable Set&amp;lt;String&amp;gt; autowiredBeanNames, TypeConverter typeConverter, boolean fallback) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      //根据构造器参数寻找 bean</span></span>
<span class="line"><span>      return this.beanFactory.resolveDependency(</span></span>
<span class="line"><span>            new DependencyDescriptor(param, true), beanName, autowiredBeanNames, typeConverter);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   catch (NoUniqueBeanDefinitionException ex) {</span></span>
<span class="line"><span>      throw ex;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   catch (NoSuchBeanDefinitionException ex) {</span></span>
<span class="line"><span>      //找不到 “bean” 进行fallback</span></span>
<span class="line"><span>      if (fallback) {</span></span>
<span class="line"><span>         // Single constructor or factory method -&amp;gt; let&#39;s return an empty array/collection</span></span>
<span class="line"><span>         // for e.g. a vararg or a non-null List/Set/Map parameter.</span></span>
<span class="line"><span>         if (paramType.isArray()) {</span></span>
<span class="line"><span>            return Array.newInstance(paramType.getComponentType(), 0);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else if (CollectionFactory.isApproximableCollectionType(paramType)) {</span></span>
<span class="line"><span>            return CollectionFactory.createCollection(paramType, 0);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else if (CollectionFactory.isApproximableMapType(paramType)) {</span></span>
<span class="line"><span>            return CollectionFactory.createMap(paramType, 0);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      throw ex;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当构建集合类型的参数实例寻找不到合适的 Bean 时，并不是不管不顾地直接报错，而是会尝试进行fallback。对于本案例而言，会使用下面的语句来创建一个空的集合作为构造器参数传递进去：</p><blockquote><p>CollectionFactory.createCollection(paramType, 0);</p></blockquote><p>上述代码最终调用代码如下：</p><blockquote><p>return new ArrayList&lt;&gt;(capacity);</p></blockquote><p>所以很明显，最终修改后的案例并不会报错，而是把 serviceNames 设置为一个空的 List。从这一点也可知， <strong>自动装配远比想象的要复杂</strong>。</p><h2 id="第2课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/366170" target="_blank" rel="noreferrer">第2课</a></strong> <a class="header-anchor" href="#第2课" aria-label="Permalink to &quot;**[第2课](https://time.geekbang.org/column/article/366170)**&quot;">​</a></h2><p>我们知道了通过@Qualifier可以引用想匹配的Bean，也可以直接命名属性的名称为Bean的名称来引用，这两种方式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//方式1：属性命名为要装配的bean名称</span></span>
<span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>DataService oracleDataService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//方式2：使用&amp;#64;Qualifier直接引用</span></span>
<span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>&amp;#64;Qualifier(&quot;oracleDataService&quot;)</span></span>
<span class="line"><span>DataService dataService;</span></span></code></pre></div><p>那么对于案例3的内部类引用，你觉得可以使用第1种方式做到么？例如使用如下代码：</p><blockquote><p>@Autowired</p><p>DataService studentController.InnerClassDataService;</p></blockquote><p>实际上，如果你动动手或者我们稍微敏锐点就会发现，代码本身就不能编译，因为中间含有“.”。那么还有办法能通过这种方式引用到内部类么？</p><p>查看决策谁优先的源码，最终使用属性名来匹配的执行情况可参考DefaultListableBeanFactory#matchesBeanName方法的调试视图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/371184/8658173a310332b1ca532997c4cd5337.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/371184/8658173a310332b1ca532997c4cd5337.png" alt=""></a></p><p>我们可以看到实现的关键其实是下面这行语句：</p><blockquote><p>candidateName.equals(beanName) || ObjectUtils.containsElement(getAliases(beanName), candidateName))</p></blockquote><p>很明显，我们的Bean没有被赋予别名，而鉴于属性名不可能含有“.”，所以它不可能匹配上带“.”的Bean名（即studentController.InnerClassDataService）。</p><p>综上，如果一个内部类，没有显式指定名称或者别名，试图使用属性名和Bean名称一致来引用到对应的Bean是行不通的。</p><h2 id="第3课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/366930" target="_blank" rel="noreferrer">第3课</a></strong> <a class="header-anchor" href="#第3课" aria-label="Permalink to &quot;**[第3课](https://time.geekbang.org/column/article/366930)**&quot;">​</a></h2><p>在案例2中，我们初次运行程序获取的结果如下：</p><blockquote><p>[Student(id=1, name=xie), Student(id=2, name=fang)]</p></blockquote><p>那么如何做到让学生2优先输出呢？</p><p>实际上，在案例2中，我们收集的目标类型是List，而List是可排序的，那么到底是如何排序的？在案例2的解析中，我们给出了DefaultListableBeanFactory#resolveMultipleBeans方法的代码，不过省略了一些非关键的代码，这其中就包括了排序工作，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (result instanceof List) {</span></span>
<span class="line"><span>   Comparator&amp;lt;Object&amp;gt; comparator = adaptDependencyComparator(matchingBeans);</span></span>
<span class="line"><span>   if (comparator != null) {</span></span>
<span class="line"><span>      ((List&amp;lt;?&amp;gt;) result).sort(comparator);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而针对本案例最终排序执行的是OrderComparator#doCompare方法，关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int doCompare(&amp;#64;Nullable Object o1, &amp;#64;Nullable Object o2, &amp;#64;Nullable OrderSourceProvider sourceProvider) {</span></span>
<span class="line"><span>   boolean p1 = (o1 instanceof PriorityOrdered);</span></span>
<span class="line"><span>   boolean p2 = (o2 instanceof PriorityOrdered);</span></span>
<span class="line"><span>   if (p1 &amp;&amp; !p2) {</span></span>
<span class="line"><span>      return -1;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (p2 &amp;&amp; !p1) {</span></span>
<span class="line"><span>      return 1;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   int i1 = getOrder(o1, sourceProvider);</span></span>
<span class="line"><span>   int i2 = getOrder(o2, sourceProvider);</span></span>
<span class="line"><span>   return Integer.compare(i1, i2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中getOrder的执行，获取到的order值（相当于优先级）是通过AnnotationAwareOrderComparator#findOrder来获取的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Integer findOrder(Object obj) {</span></span>
<span class="line"><span>   Integer order = super.findOrder(obj);</span></span>
<span class="line"><span>   if (order != null) {</span></span>
<span class="line"><span>      return order;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return findOrderFromAnnotation(obj);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不难看出，获取order值包含了2种方式：</p><ol><li>从@Order获取值，参考AnnotationAwareOrderComparator#findOrderFromAnnotation：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>private Integer findOrderFromAnnotation(Object obj) {</span></span>
<span class="line"><span>   AnnotatedElement element = (obj instanceof AnnotatedElement ? (AnnotatedElement) obj : obj.getClass());</span></span>
<span class="line"><span>   MergedAnnotations annotations = MergedAnnotations.from(element, SearchStrategy.TYPE_HIERARCHY);</span></span>
<span class="line"><span>   Integer order = OrderUtils.getOrderFromAnnotations(element, annotations);</span></span>
<span class="line"><span>   if (order == null &amp;&amp; obj instanceof DecoratingProxy) {</span></span>
<span class="line"><span>      return findOrderFromAnnotation(((DecoratingProxy) obj).getDecoratedClass());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return order;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>从Ordered 接口实现方法获取值，参考OrderComparator#findOrder：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Integer findOrder(Object obj) {</span></span>
<span class="line"><span>   return (obj instanceof Ordered ? ((Ordered) obj).getOrder() : null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面的分析，如果我们不能改变类继承关系（例如让Student实现Ordered接口），则可以通过使用@Order来调整顺序，具体修改代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>&amp;#64;Order(2)</span></span>
<span class="line"><span>public Student student1(){</span></span>
<span class="line"><span>    return createStudent(1, &quot;xie&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>&amp;#64;Order(1)</span></span>
<span class="line"><span>public Student student2(){</span></span>
<span class="line"><span>    return createStudent(2, &quot;fang&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在，我们就可以把原先的Bean输出顺序颠倒过来了，示例如下：</p><blockquote><p>Student(id=2, name=fang)],[Student(id=1, name=xie)</p></blockquote><h2 id="第4课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/367876" target="_blank" rel="noreferrer">第4课</a></strong> <a class="header-anchor" href="#第4课" aria-label="Permalink to &quot;**[第4课](https://time.geekbang.org/column/article/367876)**&quot;">​</a></h2><p>案例 2 中的类 LightService，当我们不在 Configuration 注解类中使用 Bean 方法将其注入 Spring 容器，而是坚持使用 @Service 将其自动注入到容器，同时实现 Closeable 接口，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.springframework.stereotype.Component;</span></span>
<span class="line"><span>import java.io.Closeable;</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class LightService implements Closeable {</span></span>
<span class="line"><span>    public void close() {</span></span>
<span class="line"><span>        System.out.println(&quot;turn off all lights);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接口方法 close() 也会在 Spring 容器被销毁的时候自动执行么？</p><p>答案是肯定的，通过案例 2 的分析，你可以知道，当 LightService 是一个实现了 Closable 接口的单例 Bean 时，会有一个 DisposableBeanAdapter 被添加进去。</p><p>而具体到执行哪一种方法？shutdown()？close()? 在代码中你能够找到答案，在 DisposableBeanAdapter 类的 inferDestroyMethodIfNecessary 中，我们可以看到有两种情况会获取到当前 Bean 类中的 close()。</p><p>第一种情况，就是我们这节课提到的当使用@Bean且使用默认的 destroyMethod 属性（INFER_METHOD）；第二种情况，是判断当前类是否实现了 AutoCloseable 接口，如果实现了，那么一定会获取此类的 close()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private String inferDestroyMethodIfNecessary(Object bean, RootBeanDefinition beanDefinition) {</span></span>
<span class="line"><span>   String destroyMethodName = beanDefinition.getDestroyMethodName();</span></span>
<span class="line"><span>   if (AbstractBeanDefinition.INFER_METHOD.equals(destroyMethodName) ||(destroyMethodName == null &amp;&amp; bean instanceof AutoCloseable)) {</span></span>
<span class="line"><span>      if (!(bean instanceof DisposableBean)) {</span></span>
<span class="line"><span>         try {</span></span>
<span class="line"><span>            return bean.getClass().getMethod(CLOSE_METHOD_NAME).getName();</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         catch (NoSuchMethodException ex) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>               return bean.getClass().getMethod(SHUTDOWN_METHOD_NAME).getName();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            catch (NoSuchMethodException ex2) {</span></span>
<span class="line"><span>               // no candidate destroy method found</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return (StringUtils.hasLength(destroyMethodName) ? destroyMethodName : null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这，相信你应该可以结合 Closable 接口和@Service（或其他@Component）让关闭方法得到执行了。</p><h2 id="第5课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/369251" target="_blank" rel="noreferrer">第5课</a></strong> <a class="header-anchor" href="#第5课" aria-label="Permalink to &quot;**[第5课](https://time.geekbang.org/column/article/369251)**&quot;">​</a></h2><p>案例2中，我们提到了通过反射来实例化类的三种方式：</p><ul><li>java.lang.Class.newInsance()</li><li>java.lang.reflect.Constructor.newInstance()</li><li>sun.reflect.ReflectionFactory.newConstructorForSerialization().newInstance()</li></ul><p>其中第三种方式不会初始化类属性，你能够写一个例子来证明这一点吗？</p><p>能证明的例子，代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import sun.reflect.ReflectionFactory;</span></span>
<span class="line"><span>import java.lang.reflect.Constructor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TestNewInstanceStyle {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static class TestObject{</span></span>
<span class="line"><span>        public String name = &quot;fujian&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        //ReflectionFactory.newConstructorForSerialization()方式</span></span>
<span class="line"><span>        ReflectionFactory reflectionFactory = ReflectionFactory.getReflectionFactory();</span></span>
<span class="line"><span>        Constructor constructor = reflectionFactory.newConstructorForSerialization(TestObject.class, Object.class.getDeclaredConstructor());</span></span>
<span class="line"><span>        constructor.setAccessible(true);</span></span>
<span class="line"><span>        TestObject testObject1 = (TestObject) constructor.newInstance();</span></span>
<span class="line"><span>        System.out.println(testObject1.name);</span></span>
<span class="line"><span>        //普通方式</span></span>
<span class="line"><span>        TestObject testObject2 = new TestObject();</span></span>
<span class="line"><span>        System.out.println(testObject2.name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果如下：</p><blockquote><p>null</p><p>fujian</p></blockquote><h2 id="第6课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/369989" target="_blank" rel="noreferrer">第6课</a></strong> <a class="header-anchor" href="#第6课" aria-label="Permalink to &quot;**[第6课](https://time.geekbang.org/column/article/369989)**&quot;">​</a></h2><p>实际上，审阅这节课两个案例的修正方案，你会发现它们虽然改动很小，但是都还不够优美。那么有没有稍微优美点的替代方案呢？如果有，你知道背后的原理及关键源码吗？顺便你也可以想想，我为什么没有用更优美的方案呢？</p><p>我们可以将“未达到执行顺序预期”的增强方法移动到一个独立的切面类，而不同的切面类可以使用 @Order 进行修饰。@Order 的 value 值越低，则执行优先级越高。以案例 2 为例，可以修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Order(1)</span></span>
<span class="line"><span>public class AopConfig1 {</span></span>
<span class="line"><span>    &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example2.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>    public void validateAuthority(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;authority check failed&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Order(2)</span></span>
<span class="line"><span>public class AopConfig2 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example2.ElectricService.charge())&quot;)</span></span>
<span class="line"><span>    public void logBeforeMethod(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        System.out.println(&quot;step into -&amp;gt;&quot;+pjp.getSignature());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述修改的核心就是将原来的 AOP 配置，切成两个类进行，并分别使用@Order标记下优先级。这样修改后，当授权失败了，则不会打印“step into -&gt;”相关日志。</p><p>为什么这样是可行的呢？这还得回溯到案例1，当时我们提出这样一个结论：AbstractAdvisorAutoProxyCreator 执行 findEligibleAdvisors（代码如下）寻找匹配的 Advisors 时，最终返回的 Advisors 顺序是由两点来决定的：candidateAdvisors 的顺序和 sortAdvisors 执行的排序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected List&amp;lt;Advisor&amp;gt; findEligibleAdvisors(Class&amp;lt;?&amp;gt; beanClass, String beanName) {</span></span>
<span class="line"><span>   List&amp;lt;Advisor&amp;gt; candidateAdvisors = findCandidateAdvisors();</span></span>
<span class="line"><span>   List&amp;lt;Advisor&amp;gt; eligibleAdvisors = findAdvisorsThatCanApply(candidateAdvisors, beanClass, beanName);</span></span>
<span class="line"><span>   extendAdvisors(eligibleAdvisors);</span></span>
<span class="line"><span>   if (!eligibleAdvisors.isEmpty()) {</span></span>
<span class="line"><span>      eligibleAdvisors = sortAdvisors(eligibleAdvisors);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return eligibleAdvisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当时影响我们案例出错的关键点都是在 candidateAdvisors 的顺序上，所以我们重点介绍了它。而对于 sortAdvisors 执行的排序并没有多少涉及，这里我可以再重点介绍下。</p><p>在实现上，sortAdvisors 的执行最终调用的是比较器 AnnotationAwareOrderComparator 类的 compare()，它调用了 getOrder() 的返回值作为排序依据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int compare(&amp;#64;Nullable Object o1, &amp;#64;Nullable Object o2) {</span></span>
<span class="line"><span>   return doCompare(o1, o2, null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private int doCompare(&amp;#64;Nullable Object o1, &amp;#64;Nullable Object o2, &amp;#64;Nullable OrderSourceProvider sourceProvider) {</span></span>
<span class="line"><span>   boolean p1 = (o1 instanceof PriorityOrdered);</span></span>
<span class="line"><span>   boolean p2 = (o2 instanceof PriorityOrdered);</span></span>
<span class="line"><span>   if (p1 &amp;&amp; !p2) {</span></span>
<span class="line"><span>      return -1;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (p2 &amp;&amp; !p1) {</span></span>
<span class="line"><span>      return 1;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   int i1 = getOrder(o1, sourceProvider);</span></span>
<span class="line"><span>   int i2 = getOrder(o2, sourceProvider);</span></span>
<span class="line"><span>   return Integer.compare(i1, i2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>继续跟踪 getOrder() 的执行细节，我们会发现对于我们的案例，这个方法会找出配置切面的 Bean 的 Order值。这里可以参考 BeanFactoryAspectInstanceFactory#getOrder 的调试视图验证这个结论：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/371184/211b5c15657881e5d0cc3cc86229a28e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/371184/211b5c15657881e5d0cc3cc86229a28e.png" alt=""></a></p><p>上述截图中，aopConfig2 即是我们配置切面的 Bean 的名称。这里再顺带提供出调用栈的截图，以便你做进一步研究：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/371184/600ac1d34422c57276d83c8ee03a36a9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/371184/600ac1d34422c57276d83c8ee03a36a9.png" alt=""></a></p><p>现在我们就知道了，将不同的增强方法放置到不同的切面配置类中，使用不同的 Order 值来修饰是可以影响顺序的。相反，如果都是在一个配置类中，自然不会影响顺序，所以这也是当初我的方案中没有重点介绍 sortAdvisors 方法的原因，毕竟当时我们给出的案例都只有一个 AOP 配置类。</p><h2 id="第7课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/370741" target="_blank" rel="noreferrer">第7课</a></strong> <a class="header-anchor" href="#第7课" aria-label="Permalink to &quot;**[第7课](https://time.geekbang.org/column/article/370741)**&quot;">​</a></h2><p>在案例 3 中，我们提到默认的事件执行是在同一个线程中执行的，即事件发布者使用的线程。参考如下日志佐证这个结论：</p><blockquote><p>2021-03-09 09:10:33.052 INFO 18104 --- [nio-8080-exec-1] c.s.p.listener.HelloWorldController : start to publish event</p><p>2021-03-09 09:10:33.055 INFO 18104 --- [nio-8080-exec-1] c.s.p.l.example3.MyFirstEventListener : com.spring.puzzle.class7.example3.MyFirstEventListener@18faf0 received: com.spring.puzzle.class7.example3.MyEvent[source=df42b08f-8ee2-44df-a957-d8464ff50c88]</p></blockquote><p>通过日志可以看出，事件的发布和执行使用的都是nio-8080-exec-1线程，但是在事件比较多时，我们往往希望事件执行得更快些，或者希望事件的执行可以异步化以不影响主线程。此时应该如何做呢？</p><p>针对上述问题中的需求，我们只需要对于事件的执行引入线程池即可。我们先来看下 Spring 对这点的支持。实际上，在案例 3 的解析中，我们已贴出了以下代码片段（位于 SimpleApplicationEventMulticaster#multicastEvent 方法中）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> //省略其他非关键代码</span></span>
<span class="line"><span> //获取 executor</span></span>
<span class="line"><span> Executor executor = getTaskExecutor();</span></span>
<span class="line"><span>   for (ApplicationListener&amp;lt;?&amp;gt; listener : getApplicationListeners(event, type)) {</span></span>
<span class="line"><span>      //如果存在 executor，则提交到 executor 中去执行</span></span>
<span class="line"><span>      if (executor != null) {</span></span>
<span class="line"><span>         executor.execute(() -&amp;gt; invokeListener(listener, event));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span> //省略其他非关键代码</span></span></code></pre></div><p>对于事件的处理，可以绑定一个 Executor 去执行，那么如何绑定？其实与这节课讲过的绑定 ErrorHandler 的方法是类似的。绑定代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//注意下面的语句只能执行一次，以避免重复创建线程池</span></span>
<span class="line"><span>ExecutorService newCachedThreadPool = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>//省略非关键代码</span></span>
<span class="line"><span>SimpleApplicationEventMulticaster simpleApplicationEventMulticaster = applicationContext.getBean(APPLICATION_EVENT_MULTICASTER_BEAN_NAME, SimpleApplicationEventMulticaster.class);</span></span>
<span class="line"><span>simpleApplicationEventMulticaster.setTaskExecutor(newCachedThreadPool );</span></span></code></pre></div><p>取出SimpleApplicationEventMulticaster，然后直接调用相关 set() 设置线程池就可以了。按这种方式修改后的程序，事件处理的日志如下：</p><blockquote><p>2021-03-09 09:25:09.917 INFO 16548 --- [nio-8080-exec-1] c.s.p.c.HelloWorldController : start to publish event</p><p>2021-03-09 09:25:09.920 INFO 16548 --- [pool-1-thread-3] c.s.p.l.example3.MyFirstEventListener : com.spring.puzzle.class7.example3.MyFirstEventListener@511056 received: com.spring.puzzle.class7.example3.MyEvent[source=cbb97bcc-b834-485c-980e-2e20de56c7e0]</p></blockquote><p>可以看出，事件的发布和处理分属不同的线程了，分别为 nio-8080-exec-1 和 pool-1-thread-3，满足了我们的需求。</p><p>以上就是这次答疑的全部内容，我们下一章节再见！</p>`,93)])])}const b=a(t,[["render",l]]);export{g as __pageData,b as default};
