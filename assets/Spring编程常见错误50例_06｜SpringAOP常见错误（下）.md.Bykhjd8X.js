import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"06｜Spring AOP 常见错误（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例1：错乱混合不同类型的增强","slug":"案例1-错乱混合不同类型的增强","link":"#案例1-错乱混合不同类型的增强","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：错乱混合同类型增强","slug":"案例-2-错乱混合同类型增强","link":"#案例-2-错乱混合同类型增强","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/06｜SpringAOP常见错误（下）.md","filePath":"Spring编程常见错误50例/06｜SpringAOP常见错误（下）.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/06｜SpringAOP常见错误（下）.md"};function i(l,a,c,o,r,d){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_06-spring-aop-常见错误-下" tabindex="-1">06｜Spring AOP 常见错误（下） <a class="header-anchor" href="#_06-spring-aop-常见错误-下" aria-label="Permalink to &quot;06｜Spring AOP 常见错误（下）&quot;">​</a></h1><p>你好，我是傅健。</p><p>上一节课，我们介绍了 Spring AOP 常遇到的几个问题，通过具体的源码解析，相信你对 Spring AOP 的基本原理已经有所了解了。不过，AOP 毕竟是 Spring 的核心功能之一，不可能规避那零散的两三个问题就一劳永逸了。所以这节课，我们继续聊聊 Spring AOP 中还会有哪些易错点。实际上，当一个系统采用的切面越来越多时，因为执行顺序而导致的问题便会逐步暴露出来，下面我们就重点看一下。</p><h2 id="案例1-错乱混合不同类型的增强" tabindex="-1">案例1：错乱混合不同类型的增强 <a class="header-anchor" href="#案例1-错乱混合不同类型的增强" aria-label="Permalink to &quot;案例1：错乱混合不同类型的增强&quot;">​</a></h2><p>还是沿用上节课的宿舍管理系统开发场景。</p><p>这里我们先回顾下，你就不用去翻代码了。这个宿舍管理系统保护了一个电费充值模块，它包含了一个负责电费充值的类 ElectricService，还有一个充电方法 charge()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span>    public void charge() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了在执行 charge() 之前，鉴定下调用者的权限，我们增加了针对于 Electric 的切面类 AopConfig，其中包含一个 @Before 增强。这里的增强没有做任何事情，仅仅是打印了一行日志，然后模拟执行权限校验功能（占用 1 秒钟）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//省略 imports</span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class AspectService {</span></span>
<span class="line"><span>  &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example1.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>  public void checkAuthority(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>      System.out.println(&quot;validating user authority&quot;);</span></span>
<span class="line"><span>      Thread.sleep(1000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行后，我们得到以下 log，接着一切按照预期继续执行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>validating user authority</span></span>
<span class="line"><span>Electric charging ...</span></span></code></pre></div><p>一段时间后，由于业务发展，ElectricService 中的 charge() 逻辑变得更加复杂了，我们需要仅仅针对 ElectricService 的 charge() 做性能统计。为了不影响原有的业务逻辑，我们在 AopConfig 中添加了另一个增强，代码更改后如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//省略 imports</span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class AopConfig {</span></span>
<span class="line"><span>    &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example1.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>    public void checkAuthority(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        System.out.println(&quot;validating user authority&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Around(&quot;execution(* com.spring.puzzle.class6.example1.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>    public void recordPerformance(ProceedingJoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        pjp.proceed();</span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(&quot;charge method time cost: &quot; + (end - start));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行后得到日志如下：</p><blockquote><p>validating user authority</p><p>Electric charging …</p><p>charge method time cost 1022 (ms)</p></blockquote><p>通过性能统计打印出的日志，我们可以得知 charge() 执行时间超过了 1 秒钟。然而，该方法仅打印了一行日志，它的执行不可能需要这么长时间。</p><p>因此我们很容易看出问题所在：当前 ElectricService 中 charge() 的执行时间，包含了权限验证的时间，即包含了通过 @Around 增强的 checkAuthority() 执行的所有时间。这并不符合我们的初衷，我们需要统计的仅仅是 ElectricService.charge() 的性能统计，它并不包含鉴权过程。</p><p>当然，这些都是从日志直接观察出的现象。实际上，这个问题出现的根本原因和 AOP 的执行顺序有关。针对这个案例而言，当同一个切面（Aspect）中同时包含多个不同类型的增强时（Around、Before、After、AfterReturning、AfterThrowing 等），它们的执行是有顺序的。那么顺序如何？我们不妨来解析下。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>其实一切都可以从源码中得到真相！在 <a href="https://time.geekbang.org/column/article/367876" target="_blank" rel="noreferrer">第04课</a> 我们曾经提到过，Spring 初始化单例类的一般过程，基本都是 getBean()-&gt;doGetBean()-&gt;getSingleton()，如果发现 Bean 不存在，则调用 createBean()-&gt;doCreateBean() 进行实例化。</p><p>而如果我们的代码里使用了 Spring AOP，doCreateBean() 最终会返回一个代理对象。至于代理对象如何创建，大体流程我们在上一讲已经概述过了。如果你记忆力比较好的话，应该记得在代理对象的创建过程中，我们贴出过这样一段代码（参考 AbstractAutoProxyCreator#createProxy）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object createProxy(Class&amp;lt;?&amp;gt; beanClass, &amp;#64;Nullable String beanName,</span></span>
<span class="line"><span>      &amp;#64;Nullable Object[] specificInterceptors, TargetSource targetSource) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);</span></span>
<span class="line"><span>   proxyFactory.addAdvisors(advisors);</span></span>
<span class="line"><span>   proxyFactory.setTargetSource(targetSource);</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   return proxyFactory.getProxy(getProxyClassLoader());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中 advisors 就是增强方法对象，它的顺序决定了面临多个增强时，到底先执行谁。而这个集合对象本身是由 specificInterceptors 构建出来的，而 specificInterceptors 又是由 AbstractAdvisorAutoProxyCreator#getAdvicesAndAdvisorsForBean 方法构建：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>protected Object[] getAdvicesAndAdvisorsForBean(</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; beanClass, String beanName, &amp;#64;Nullable TargetSource targetSource) {</span></span>
<span class="line"><span>   List&amp;lt;Advisor&amp;gt; advisors = findEligibleAdvisors(beanClass, beanName);</span></span>
<span class="line"><span>   if (advisors.isEmpty()) {</span></span>
<span class="line"><span>      return DO_NOT_PROXY;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return advisors.toArray();</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>简单说，其实就是根据当前的 beanClass、beanName 等信息，结合所有候选的 advisors，最终找出匹配（Eligible）的 Advisor，为什么如此？毕竟 AOP 拦截点可能会配置多个，而我们执行的方法不见得会被所有的拦截配置拦截。寻找匹配 Advisor 的逻辑参考 AbstractAdvisorAutoProxyCreator#findEligibleAdvisors：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected List&amp;lt;Advisor&amp;gt; findEligibleAdvisors(Class&amp;lt;?&amp;gt; beanClass, String beanName) {</span></span>
<span class="line"><span>   //寻找候选的 Advisor</span></span>
<span class="line"><span>   List&amp;lt;Advisor&amp;gt; candidateAdvisors = findCandidateAdvisors();</span></span>
<span class="line"><span>   //根据候选的 Advisor 和当前 bean 算出匹配的 Advisor</span></span>
<span class="line"><span>   List&amp;lt;Advisor&amp;gt; eligibleAdvisors = findAdvisorsThatCanApply(candidateAdvisors, beanClass, beanName);</span></span>
<span class="line"><span>   extendAdvisors(eligibleAdvisors);</span></span>
<span class="line"><span>   if (!eligibleAdvisors.isEmpty()) {</span></span>
<span class="line"><span>      //排序</span></span>
<span class="line"><span>      eligibleAdvisors = sortAdvisors(eligibleAdvisors);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return eligibleAdvisors;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过研读代码，最终 Advisors 的顺序是由两点决定：</p><ol><li>candidateAdvisors 的顺序；</li><li>sortAdvisors 进行的排序。</li></ol><p>这里我们可以重点看下对本案例起关键作用的 candidateAdvisors 排序。实际上，它的顺序是在 @Aspect 标记的 AopConfig Bean 构建时就决定了。具体而言，就是在初始化过程中会排序自己配置的 Advisors，并把排序结果存入了缓存（BeanFactoryAspectJAdvisorsBuilder#advisorsCache）。</p><p>后续 Bean 创建代理时，直接拿出这个排序好的候选 Advisors。候选 Advisors 排序发生在 Bean 构建这个结论时，我们也可以通过 AopConfig Bean 构建中的堆栈信息验证：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369989/611f386b14b05c2d151340d31f34e3d1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369989/611f386b14b05c2d151340d31f34e3d1.png" alt=""></a></p><p>可以看到，排序是在 Bean 的构建中进行的，而最后排序执行的关键代码位于下面的方法中（参考 ReflectiveAspectJAdvisorFactory#getAdvisorMethods）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&amp;lt;Method&amp;gt; getAdvisorMethods(Class&amp;lt;?&amp;gt; aspectClass) {</span></span>
<span class="line"><span>   final List&amp;lt;Method&amp;gt; methods = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>   ReflectionUtils.doWithMethods(aspectClass, method -&amp;gt; {</span></span>
<span class="line"><span>      // Exclude pointcuts</span></span>
<span class="line"><span>      if (AnnotationUtils.getAnnotation(method, Pointcut.class) == null) {</span></span>
<span class="line"><span>         methods.add(method);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }, ReflectionUtils.USER_DECLARED_METHODS);</span></span>
<span class="line"><span>   // 排序</span></span>
<span class="line"><span>   methods.sort(METHOD_COMPARATOR);</span></span>
<span class="line"><span>   return methods;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的重点是第九行 methods.sort(METHOD_COMPARATOR)方法。</p><p>我们来查看 METHOD_COMPARATOR 的代码，会发现它是定义在 ReflectiveAspectJAdvisorFactory 类中的静态方法块，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static {</span></span>
<span class="line"><span>   Comparator&amp;lt;Method&amp;gt; adviceKindComparator = new ConvertingComparator&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>         new InstanceComparator&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>               Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class),</span></span>
<span class="line"><span>         (Converter&amp;lt;Method, Annotation&amp;gt;) method -&amp;gt; {</span></span>
<span class="line"><span>            AspectJAnnotation&amp;lt;?&amp;gt; annotation =</span></span>
<span class="line"><span>               AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(method);</span></span>
<span class="line"><span>            return (annotation != null ? annotation.getAnnotation() : null);</span></span>
<span class="line"><span>         });</span></span>
<span class="line"><span>   Comparator&amp;lt;Method&amp;gt; methodNameComparator = new ConvertingComparator&amp;lt;&amp;gt;(Method::getName);</span></span>
<span class="line"><span>   //合并上面两者比较器</span></span>
<span class="line"><span>   METHOD_COMPARATOR = adviceKindComparator.thenComparing(methodNameComparator);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>METHOD_COMPARATOR 本质上是一个连续比较器，由 adviceKindComparator 和 methodNameComparator 这两个比较器通过 thenComparing()连接而成。</p><p>通过这个案例，我们重点了解 adviceKindComparator 这个比较器，此对象通过实例化 ConvertingComparator 类而来，而 ConvertingComparator 类是 Spring 中较为经典的一个实现。顾名思义，先转化再比较，它构造参数接受以下这两个参数：</p><ul><li>第一个参数是基准比较器，即在 adviceKindComparator 中最终要调用的比较器，在构造函数中赋值于 this.comparator；</li><li>第二个参数是一个 lambda 回调函数，用来将传递的参数转化为基准比较器需要的参数类型，在构造函数中赋值于 this.converter。</li></ul><p>查看 ConvertingComparator 比较器核心方法 compare 如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int compare(S o1, S o2) {</span></span>
<span class="line"><span>   T c1 = this.converter.convert(o1);</span></span>
<span class="line"><span>   T c2 = this.converter.convert(o2);</span></span>
<span class="line"><span>   return this.comparator.compare(c1, c2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可知，这里是先调用从构造函数中获取到的 lambda 回调函数 this.converter，将需要比较的参数进行转化。我们可以从之前的代码中找出这个转化工作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(Converter&amp;lt;Method, Annotation&amp;gt;) method -&amp;gt; {</span></span>
<span class="line"><span>   AspectJAnnotation&amp;lt;?&amp;gt; annotation =</span></span>
<span class="line"><span>      AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(method);</span></span>
<span class="line"><span>   return (annotation != null ? annotation.getAnnotation() : null);</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>转化功能的代码逻辑较为简单，就是返回传入方法（method）上标记的增强注解（Pointcut,Around,Before,After,AfterReturning 以及 AfterThrowing）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final Class&amp;lt;?&amp;gt;[] ASPECTJ_ANNOTATION_CLASSES = new Class&amp;lt;?&amp;gt;[] {</span></span>
<span class="line"><span>      Pointcut.class, Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected static AspectJAnnotation&amp;lt;?&amp;gt; findAspectJAnnotationOnMethod(Method method) {</span></span>
<span class="line"><span>   for (Class&amp;lt;?&amp;gt; clazz : ASPECTJ_ANNOTATION_CLASSES) {</span></span>
<span class="line"><span>      AspectJAnnotation&amp;lt;?&amp;gt; foundAnnotation = findAnnotation(method, (Class&amp;lt;Annotation&amp;gt;) clazz);</span></span>
<span class="line"><span>      if (foundAnnotation != null) {</span></span>
<span class="line"><span>         return foundAnnotation;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过转化后，我们获取到的待比较的数据其实就是注解了。而它们的排序依赖于 ConvertingComparator 的第一个参数，即最终会调用的基准比较器，以下是它的关键实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>new InstanceComparator&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>      Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class)</span></span></code></pre></div><p>最终我们要调用的基准比较器本质上就是一个 InstanceComparator 类，我们先重点注意下这几个增强注解的传递顺序。继续查看它的构造方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public InstanceComparator(Class&amp;lt;?&amp;gt;... instanceOrder) {</span></span>
<span class="line"><span>   Assert.notNull(instanceOrder, &quot;&#39;instanceOrder&#39; array must not be null&quot;);</span></span>
<span class="line"><span>   this.instanceOrder = instanceOrder;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>构造方法也是较为简单的，只是将传递进来的 instanceOrder 赋予了类成员变量，继续查看 InstanceComparator 比较器核心方法 compare 如下，也就是最终要调用的比较方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int compare(T o1, T o2) {</span></span>
<span class="line"><span>   int i1 = getOrder(o1);</span></span>
<span class="line"><span>   int i2 = getOrder(o2);</span></span>
<span class="line"><span>   return (i1 &amp;lt; i2 ? -1 : (i1 == i2 ? 0 : 1));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一个典型的 Comparator，代码逻辑按照 i1、i2 的升序排列，即 getOrder() 返回的值越小，排序越靠前。</p><p>查看 getOrder() 的逻辑如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int getOrder(&amp;#64;Nullable T object) {</span></span>
<span class="line"><span>   if (object != null) {</span></span>
<span class="line"><span>      for (int i = 0; i &amp;lt; this.instanceOrder.length; i++) {</span></span>
<span class="line"><span>         //instance 在 instanceOrder 中的“排号”</span></span>
<span class="line"><span>         if (this.instanceOrder[i].isInstance(object)) {</span></span>
<span class="line"><span>            return i;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return this.instanceOrder.length;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>返回当前传递的增强注解在 this.instanceOrder 中的序列值，序列值越小，则越靠前。而结合之前构造参数传递的顺序，我们很快就能判断出：最终的排序结果依次是 Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class。</p><p>到此为止，答案也呼之欲出：this.instanceOrder 的排序，即为不同类型增强的优先级， <strong>排序越靠前，优先级越高</strong>。</p><p>结合之前的讨论，我们可以得出一个结论：同一个切面中，不同类型的增强方法被调用的顺序依次为Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>从上述案例解析中，我们知道 Around 类型的增强被调用的优先级高于 Before 类型的增强，所以上述案例中性能统计所花费的时间，包含权限验证的时间，也在情理之中。</p><p>知道了原理，修正起来也就简单了。假设不允许我们去拆分类，我们可以按照下面的思路来修改：</p><ol><li>将 ElectricService.charge() 的业务逻辑全部移动到 doCharge()，在 charge() 中调用 doCharge()；</li><li>性能统计只需要拦截 doCharge()；</li><li>权限统计增强保持不变，依然拦截 charge()。</li></ol><p>ElectricService 类代码更改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    ElectricService electricService;</span></span>
<span class="line"><span>    public void charge() {</span></span>
<span class="line"><span>        electricService.doCharge();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void doCharge() {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>切面代码更改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//省略 imports</span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class AopConfig {</span></span>
<span class="line"><span>    &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example1.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>    public void checkAuthority(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        System.out.println(&quot;validating user authority&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Around(&quot;execution(* com.spring.puzzle.class6.example1.ElectricService.doCharge()) &quot;)</span></span>
<span class="line"><span>    public void recordPerformance(ProceedingJoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>    long start = System.currentTimeMillis();</span></span>
<span class="line"><span>    pjp.proceed();</span></span>
<span class="line"><span>    long end = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;charge method time cost: &quot; + (end - start));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="案例-2-错乱混合同类型增强" tabindex="-1">案例 2：错乱混合同类型增强 <a class="header-anchor" href="#案例-2-错乱混合同类型增强" aria-label="Permalink to &quot;案例 2：错乱混合同类型增强&quot;">​</a></h2><p>那学到这里，你可能还有疑问，如果同一个切面里的多个增强方法其增强都一样，那调用顺序又如何呢？我们继续看下一个案例。</p><p>这里业务逻辑类 ElectricService 没有任何变化，仅包含一个 charge()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span>    public void charge() {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>切面类 AspectService 包含两个方法，都是 Before 类型增强。</p><p>第一个方法 logBeforeMethod()，目的是在 run() 执行之前希望能输入日志，表示当前方法被调用一次，方便后期统计。另一个方法 validateAuthority()，目的是做权限验证，其作用是在调用此方法之前做权限验证，如果不符合权限限制要求，则直接抛出异常。这里为了方便演示，此方法将直接抛出异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//省略 imports</span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class AopConfig {</span></span>
<span class="line"><span>  &amp;#64;Before(&quot;execution(* com.spring.puzzle.class5.example2.ElectricService.charge())&quot;)</span></span>
<span class="line"><span>  public void logBeforeMethod(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>      System.out.println(&quot;step into -&amp;gt;&quot;+pjp.getSignature());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  &amp;#64;Before(&quot;execution(* com.spring.puzzle.class5.example2.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>  public void validateAuthority(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>      throw new RuntimeException(&quot;authority check failed&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们对代码的执行预期为：当鉴权失败时，由于 ElectricService.charge() 没有被调用，那么 run() 的调用日志也不应该被输出，即 logBeforeMethod() 不应该被调用，但事实总是出乎意料，执行结果如下：</p><blockquote><p>step into -&gt;void com.spring.puzzle.class6.example2.Electric.charge()</p><p>Exception in thread “main” java.lang.RuntimeException: authority check failed</p></blockquote><p>虽然鉴权失败，抛出了异常且 ElectricService.charge() 没有被调用，但是 logBeforeMethod() 的调用日志却被输出了，这将导致后期针对于 ElectricService.charge() 的调用数据统计严重失真。</p><p>这里我们就需要搞清楚一个问题：当同一个切面包含多个同一种类型的多个增强，且修饰的都是同一个方法时，这多个增强的执行顺序是怎样的？</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们继续从源代码中寻找真相！你应该还记得上述代码中，定义 METHOD_COMPARATOR 的静态代码块吧。</p><p>METHOD_COMPARATOR 本质是一个连续比较器，而上个案例中我们仅仅只看了第一个比较器，细心的你肯定发现了这里还有第二个比较器 methodNameComparator，任意两个比较器都可以通过其内置的 thenComparing() 连接形成一个连续比较器，从而可以让我们按照比较器的连接顺序依次比较：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static {</span></span>
<span class="line"><span>   //第一个比较器，用来按照增强类型排序</span></span>
<span class="line"><span>   Comparator&amp;lt;Method&amp;gt; adviceKindComparator = new ConvertingComparator&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>         new InstanceComparator&amp;lt;&amp;gt;(</span></span>
<span class="line"><span>               Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class),</span></span>
<span class="line"><span>         (Converter&amp;lt;Method, Annotation&amp;gt;) method -&amp;gt; {</span></span>
<span class="line"><span>            AspectJAnnotation&amp;lt;?&amp;gt; annotation =</span></span>
<span class="line"><span>               AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(method);</span></span>
<span class="line"><span>            return (annotation != null ? annotation.getAnnotation() : null);</span></span>
<span class="line"><span>         })</span></span>
<span class="line"><span>   //第二个比较器，用来按照方法名排序</span></span>
<span class="line"><span>   Comparator&amp;lt;Method&amp;gt; methodNameComparator = new ConvertingComparator&amp;lt;&amp;gt;(Method::getName);</span></span>
<span class="line"><span>   METHOD_COMPARATOR = adviceKindComparator.thenComparing(methodNameComparator);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到，在第 12 行代码中，第 2 个比较器 methodNameComparator 依然使用的是 ConvertingComparator，传递了方法名作为参数。我们基本可以猜测出该比较器是按照方法名进行排序的，这里可以进一步查看构造器方法及构造器调用的内部 comparable()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ConvertingComparator(Converter&amp;lt;S, T&amp;gt; converter) {</span></span>
<span class="line"><span>   this(Comparators.comparable(), converter);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 省略非关键代码</span></span>
<span class="line"><span>public static &amp;lt;T&amp;gt; Comparator&amp;lt;T&amp;gt; comparable() {</span></span>
<span class="line"><span>   return ComparableComparator.INSTANCE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的 ComparableComparator 实例其实极其简单，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ComparableComparator&amp;lt;T extends Comparable&amp;lt;T&amp;gt;&amp;gt; implements Comparator&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   public static final ComparableComparator INSTANCE = new ComparableComparator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public int compare(T o1, T o2) {</span></span>
<span class="line"><span>      return o1.compareTo(o2);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>答案和我们的猜测完全一致，methodNameComparator 最终调用了 String 类自身的 compareTo()，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int compareTo(String anotherString) {</span></span>
<span class="line"><span>    int len1 = value.length;</span></span>
<span class="line"><span>    int len2 = anotherString.value.length;</span></span>
<span class="line"><span>    int lim = Math.min(len1, len2);</span></span>
<span class="line"><span>    char v1[] = value;</span></span>
<span class="line"><span>    char v2[] = anotherString.value;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int k = 0;</span></span>
<span class="line"><span>    while (k &amp;lt; lim) {</span></span>
<span class="line"><span>        char c1 = v1[k];</span></span>
<span class="line"><span>        char c2 = v2[k];</span></span>
<span class="line"><span>        if (c1 != c2) {</span></span>
<span class="line"><span>            return c1 - c2;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        k++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return len1 - len2;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这，答案揭晓：如果两个方法名长度相同，则依次比较每一个字母的 ASCII 码，ASCII 码越小，排序越靠前；若长度不同，且短的方法名字符串是长的子集时，短的排序靠前。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>从上述分析我们得知，在同一个切面配置类中，针对同一个方法存在多个同类型增强时，其执行顺序仅和当前增强方法的名称有关，而不是由谁代码在先、谁代码在后来决定。了解了这点，我们就可以直接通过调整方法名的方式来修正程序：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//省略 imports</span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class AopConfig {</span></span>
<span class="line"><span>  &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example2.ElectricService.charge())&quot;)</span></span>
<span class="line"><span>  public void logBeforeMethod(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>      System.out.println(&quot;step into -&amp;gt;&quot;+pjp.getSignature());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  &amp;#64;Before(&quot;execution(* com.spring.puzzle.class6.example2.ElectricService.charge()) &quot;)</span></span>
<span class="line"><span>  public void checkAuthority(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>      throw new RuntimeException(&quot;authority check failed&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以将原来的 validateAuthority() 改为 checkAuthority()，这种情况下， <strong>对增强（Advisor）的排序，其实最后就是在比较字符 l 和 字符 c</strong>。显然易见，checkAuthority()的排序会靠前，从而被优先执行，最终问题得以解决。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过学习这两个案例，相信你对 Spring AOP 增强方法的执行顺序已经有了较为深入的理解。这里我来总结下关键点：</p><ul><li>在同一个切面配置中，如果存在多个不同类型的增强，那么其执行优先级是按照增强类型的特定顺序排列，依次的增强类型为 Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class；</li><li>在同一个切面配置中，如果存在多个相同类型的增强，那么其执行优先级是按照该增强的方法名排序，排序方式依次为比较方法名的每一个字母，直到发现第一个不相同且 ASCII 码较小的字母。</li></ul><p>同时，这节课我们也拓展了一些比较器相关的知识：</p><ul><li>任意两个比较器（Comparator）可以通过 thenComparing() 连接合成一个新的连续比较器；</li><li>比较器的比较规则有一个简单的方法可以帮助你理解，就是最终一定需要对象两两比较，而比较的过程一定是比较这两个对象的同种属性。你只要抓住这两点：比较了什么属性以及比较的结果是什么就可以了，若比较结果为正数，则按照该属性的升序排列；若为负数，则按属性降序排列。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>实际上，审阅上面两个案例的修正方案，你会发现它们虽然改动很小，但是都还不够优美。那么有没有稍微优美点的替代方案呢？如果有，你知道背后的原理及关键源码吗？顺便你也可以想想，我为什么没有用更优美的方案呢？</p><p>期待在留言区看到你的思考，我们下节课再见！</p>`,99)])])}const u=s(t,[["render",i]]);export{g as __pageData,u as default};
