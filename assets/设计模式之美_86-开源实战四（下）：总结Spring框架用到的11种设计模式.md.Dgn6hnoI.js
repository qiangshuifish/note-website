import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"86 | 开源实战四（下）：总结Spring框架用到的11种设计模式","description":"","frontmatter":{},"headers":[{"level":2,"title":"适配器模式在Spring中的应用","slug":"适配器模式在spring中的应用","link":"#适配器模式在spring中的应用","children":[]},{"level":2,"title":"策略模式在Spring中的应用","slug":"策略模式在spring中的应用","link":"#策略模式在spring中的应用","children":[]},{"level":2,"title":"组合模式在Spring中的应用","slug":"组合模式在spring中的应用","link":"#组合模式在spring中的应用","children":[]},{"level":2,"title":"装饰器模式在Spring中的应用","slug":"装饰器模式在spring中的应用","link":"#装饰器模式在spring中的应用","children":[]},{"level":2,"title":"工厂模式在Spring中的应用","slug":"工厂模式在spring中的应用","link":"#工厂模式在spring中的应用","children":[]},{"level":2,"title":"其他模式在Spring中的应用","slug":"其他模式在spring中的应用","link":"#其他模式在spring中的应用","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/86-开源实战四（下）：总结Spring框架用到的11种设计模式.md","filePath":"设计模式之美/86-开源实战四（下）：总结Spring框架用到的11种设计模式.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/86-开源实战四（下）：总结Spring框架用到的11种设计模式.md"};function i(t,n,c,r,o,g){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_86-开源实战四-下-总结spring框架用到的11种设计模式" tabindex="-1">86 | 开源实战四（下）：总结Spring框架用到的11种设计模式 <a class="header-anchor" href="#_86-开源实战四-下-总结spring框架用到的11种设计模式" aria-label="Permalink to &quot;86 | 开源实战四（下）：总结Spring框架用到的11种设计模式&quot;">​</a></h1><p>上一节课，我们讲解了Spring中支持扩展功能的两种设计模式：观察者模式和模板模式。这两种模式能够帮助我们创建扩展点，让框架的使用者在不修改源码的情况下，基于扩展点定制化框架功能。</p><p>实际上，Spring框架中用到的设计模式非常多，不下十几种。我们今天就总结罗列一下它们。限于篇幅，我不可能对每种设计模式都进行非常详细的讲解。有些前面已经讲过的或者比较简单的，我就点到为止。如果有什么不是很懂的地方，你可以通过阅读源码，查阅之前的理论讲解，自己去搞定它。如果一直跟着我的课程学习，相信你现在已经具备这样的学习能力。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="适配器模式在spring中的应用" tabindex="-1">适配器模式在Spring中的应用 <a class="header-anchor" href="#适配器模式在spring中的应用" aria-label="Permalink to &quot;适配器模式在Spring中的应用&quot;">​</a></h2><p>在Spring MVC中，定义一个Controller最常用的方式是，通过@Controller注解来标记某个类是Controller类，通过@RequesMapping注解来标记函数对应的URL。不过，定义一个Controller远不止这一种方法。我们还可以通过让类实现Controller接口或者Servlet接口，来定义一个Controller。针对这三种定义方式，我写了三段示例代码，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 方法一：通过&amp;#64;Controller、&amp;#64;RequestMapping来定义</span></span>
<span class="line"><span>&amp;#64;Controller</span></span>
<span class="line"><span>public class DemoController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(&quot;/employname&quot;)</span></span>
<span class="line"><span>    public ModelAndView getEmployeeName() {</span></span>
<span class="line"><span>        ModelAndView model = new ModelAndView(&quot;Greeting&quot;);</span></span>
<span class="line"><span>        model.addObject(&quot;message&quot;, &quot;Dinesh&quot;);</span></span>
<span class="line"><span>        return model;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 方法二：实现Controller接口 + xml配置文件:配置DemoController与URL的对应关系</span></span>
<span class="line"><span>public class DemoController implements Controller {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse resp) throws Exception {</span></span>
<span class="line"><span>        ModelAndView model = new ModelAndView(&quot;Greeting&quot;);</span></span>
<span class="line"><span>        model.addObject(&quot;message&quot;, &quot;Dinesh Madhwal&quot;);</span></span>
<span class="line"><span>        return model;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 方法三：实现Servlet接口 + xml配置文件:配置DemoController类与URL的对应关系</span></span>
<span class="line"><span>public class DemoServlet extends HttpServlet {</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {</span></span>
<span class="line"><span>    this.doPost(req, resp);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {</span></span>
<span class="line"><span>    resp.getWriter().write(&quot;Hello World.&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在应用启动的时候，Spring容器会加载这些Controller类，并且解析出URL对应的处理函数，封装成Handler对象，存储到HandlerMapping对象中。当有请求到来的时候，DispatcherServlet从HanderMapping中，查找请求URL对应的Handler，然后调用执行Handler对应的函数代码，最后将执行结果返回给客户端。</p><p>但是，不同方式定义的Controller，其函数的定义（函数名、入参、返回值等）是不统一的。如上示例代码所示，方法一中的函数的定义很随意、不固定，方法二中的函数定义是handleRequest()、方法三中的函数定义是service()（看似是定义了doGet()、doPost()，实际上，这里用到了模板模式，Servlet中的service()调用了doGet()或doPost()方法，DispatcherServlet调用的是service()方法）。DispatcherServlet需要根据不同类型的Controller，调用不同的函数。下面是具体的伪代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Handler handler = handlerMapping.get(URL);</span></span>
<span class="line"><span>if (handler instanceof Controller) {</span></span>
<span class="line"><span>  ((Controller)handler).handleRequest(...);</span></span>
<span class="line"><span>} else if (handler instanceof Servlet) {</span></span>
<span class="line"><span>  ((Servlet)handler).service(...);</span></span>
<span class="line"><span>} else if (hanlder 对应通过注解来定义的Controller) {</span></span>
<span class="line"><span>  反射调用方法...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码中我们可以看出，这种实现方式会有很多if-else分支判断，而且，如果要增加一个新的Controller的定义方法，我们就要在DispatcherServlet类代码中，对应地增加一段如上伪代码所示的if逻辑。这显然不符合开闭原则。</p><p>实际上，我们可以利用是适配器模式对代码进行改造，让其满足开闭原则，能更好地支持扩展。在 <a href="https://time.geekbang.org/column/article/205912" target="_blank" rel="noreferrer">第51节课</a> 中，我们讲到，适配器其中一个作用是“统一多个类的接口设计”。利用适配器模式，我们将不同方式定义的Controller类中的函数，适配为统一的函数定义。这样，我们就能在DispatcherServlet类代码中，移除掉if-else分支判断逻辑，调用统一的函数。</p><p>刚刚讲了大致的设计思路，我们再具体看下Spring的代码实现。</p><p>Spring定义了统一的接口HandlerAdapter，并且对每种Controller定义了对应的适配器类。这些适配器类包括：AnnotationMethodHandlerAdapter、SimpleControllerHandlerAdapter、SimpleServletHandlerAdapter等。源码我贴到了下面，你可以结合着看下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface HandlerAdapter {</span></span>
<span class="line"><span>  boolean supports(Object var1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ModelAndView handle(HttpServletRequest var1, HttpServletResponse var2, Object var3) throws Exception;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  long getLastModified(HttpServletRequest var1, Object var2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 对应实现Controller接口的Controller</span></span>
<span class="line"><span>public class SimpleControllerHandlerAdapter implements HandlerAdapter {</span></span>
<span class="line"><span>  public SimpleControllerHandlerAdapter() {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean supports(Object handler) {</span></span>
<span class="line"><span>    return handler instanceof Controller;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {</span></span>
<span class="line"><span>    return ((Controller)handler).handleRequest(request, response);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public long getLastModified(HttpServletRequest request, Object handler) {</span></span>
<span class="line"><span>    return handler instanceof LastModified ? ((LastModified)handler).getLastModified(request) : -1L;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 对应实现Servlet接口的Controller</span></span>
<span class="line"><span>public class SimpleServletHandlerAdapter implements HandlerAdapter {</span></span>
<span class="line"><span>  public SimpleServletHandlerAdapter() {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean supports(Object handler) {</span></span>
<span class="line"><span>    return handler instanceof Servlet;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {</span></span>
<span class="line"><span>    ((Servlet)handler).service(request, response);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public long getLastModified(HttpServletRequest request, Object handler) {</span></span>
<span class="line"><span>    return -1L;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//AnnotationMethodHandlerAdapter对应通过注解实现的Controller，</span></span>
<span class="line"><span>//代码太多了，我就不贴在这里了</span></span></code></pre></div><p>在DispatcherServlet类中，我们就不需要区分对待不同的Controller对象了，统一调用HandlerAdapter的handle()函数就可以了。按照这个思路实现的伪代码如下所示。你看，这样就没有烦人的if-else逻辑了吧？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 之前的实现方式</span></span>
<span class="line"><span>Handler handler = handlerMapping.get(URL);</span></span>
<span class="line"><span>if (handler instanceof Controller) {</span></span>
<span class="line"><span>  ((Controller)handler).handleRequest(...);</span></span>
<span class="line"><span>} else if (handler instanceof Servlet) {</span></span>
<span class="line"><span>  ((Servlet)handler).service(...);</span></span>
<span class="line"><span>} else if (hanlder 对应通过注解来定义的Controller) {</span></span>
<span class="line"><span>  反射调用方法...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 现在实现方式</span></span>
<span class="line"><span>HandlerAdapter handlerAdapter = handlerMapping.get(URL);</span></span>
<span class="line"><span>handlerAdapter.handle(...);</span></span></code></pre></div><h2 id="策略模式在spring中的应用" tabindex="-1">策略模式在Spring中的应用 <a class="header-anchor" href="#策略模式在spring中的应用" aria-label="Permalink to &quot;策略模式在Spring中的应用&quot;">​</a></h2><p>我们前面讲到，Spring AOP是通过动态代理来实现的。熟悉Java的同学应该知道，具体到代码实现，Spring支持两种动态代理实现方式，一种是JDK提供的动态代理实现方式，另一种是Cglib提供的动态代理实现方式。</p><p>前者需要被代理的类有抽象的接口定义，后者不需要（这两种动态代理实现方式的更多区别请自行百度研究吧）。针对不同的被代理类，Spring会在运行时动态地选择不同的动态代理实现方式。这个应用场景实际上就是策略模式的典型应用场景。</p><p>我们前面讲过，策略模式包含三部分，策略的定义、创建和使用。接下来，我们具体看下，这三个部分是如何体现在Spring源码中的。</p><p>在策略模式中，策略的定义这一部分很简单。我们只需要定义一个策略接口，让不同的策略类都实现这一个策略接口。对应到Spring源码，AopProxy是策略接口，JdkDynamicAopProxy、CglibAopProxy是两个实现了AopProxy接口的策略类。其中，AopProxy接口的定义如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface AopProxy {</span></span>
<span class="line"><span>  Object getProxy();</span></span>
<span class="line"><span>  Object getProxy(ClassLoader var1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在策略模式中，策略的创建一般通过工厂方法来实现。对应到Spring源码，AopProxyFactory是一个工厂类接口，DefaultAopProxyFactory是一个默认的工厂类，用来创建AopProxy对象。两者的源码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface AopProxyFactory {</span></span>
<span class="line"><span>  AopProxy createAopProxy(AdvisedSupport var1) throws AopConfigException;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {</span></span>
<span class="line"><span>  public DefaultAopProxyFactory() {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {</span></span>
<span class="line"><span>    if (!config.isOptimize() &amp;&amp; !config.isProxyTargetClass() &amp;&amp; !this.hasNoUserSuppliedProxyInterfaces(config)) {</span></span>
<span class="line"><span>      return new JdkDynamicAopProxy(config);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; targetClass = config.getTargetClass();</span></span>
<span class="line"><span>      if (targetClass == null) {</span></span>
<span class="line"><span>        throw new AopConfigException(&quot;TargetSource cannot determine target class: Either an interface or a target is required for proxy creation.&quot;);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        return (AopProxy)(!targetClass.isInterface() &amp;&amp; !Proxy.isProxyClass(targetClass) ? new ObjenesisCglibAopProxy(config) : new JdkDynamicAopProxy(config));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //用来判断用哪个动态代理实现方式</span></span>
<span class="line"><span>  private boolean hasNoUserSuppliedProxyInterfaces(AdvisedSupport config) {</span></span>
<span class="line"><span>    Class&amp;lt;?&amp;gt;[] ifcs = config.getProxiedInterfaces();</span></span>
<span class="line"><span>    return ifcs.length == 0 || ifcs.length == 1 &amp;&amp; SpringProxy.class.isAssignableFrom(ifcs[0]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>策略模式的典型应用场景，一般是通过环境变量、状态值、计算结果等动态地决定使用哪个策略。对应到Spring源码中，我们可以参看刚刚给出的DefaultAopProxyFactory类中的createAopProxy()函数的代码实现。其中，第10行代码是动态选择哪种策略的判断条件。</p><h2 id="组合模式在spring中的应用" tabindex="-1">组合模式在Spring中的应用 <a class="header-anchor" href="#组合模式在spring中的应用" aria-label="Permalink to &quot;组合模式在Spring中的应用&quot;">​</a></h2><p>上节课讲到Spring“再封装、再抽象”设计思想的时候，我们提到了Spring Cache。Spring Cache提供了一套抽象的Cache接口。使用它我们能够\b统一不同缓存实现（Redis、Google Guava…）的不同的访问方式。Spring中针对不同缓存实现的不同缓存访问类，都依赖这个接口，比如：EhCacheCache、GuavaCache、NoOpCache、RedisCache、JCacheCache、ConcurrentMapCache、CaffeineCache。Cache接口的源码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Cache {</span></span>
<span class="line"><span>  String getName();</span></span>
<span class="line"><span>  Object getNativeCache();</span></span>
<span class="line"><span>  Cache.ValueWrapper get(Object var1);</span></span>
<span class="line"><span>  &amp;lt;T&amp;gt; T get(Object var1, Class&amp;lt;T&amp;gt; var2);</span></span>
<span class="line"><span>  &amp;lt;T&amp;gt; T get(Object var1, Callable&amp;lt;T&amp;gt; var2);</span></span>
<span class="line"><span>  void put(Object var1, Object var2);</span></span>
<span class="line"><span>  Cache.ValueWrapper putIfAbsent(Object var1, Object var2);</span></span>
<span class="line"><span>  void evict(Object var1);</span></span>
<span class="line"><span>  void clear();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class ValueRetrievalException extends RuntimeException {</span></span>
<span class="line"><span>    private final Object key;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ValueRetrievalException(Object key, Callable&amp;lt;?&amp;gt; loader, Throwable ex) {</span></span>
<span class="line"><span>      super(String.format(&quot;Value for key &#39;%s&#39; could not be loaded using &#39;%s&#39;&quot;, key, loader), ex);</span></span>
<span class="line"><span>      this.key = key;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object getKey() {</span></span>
<span class="line"><span>      return this.key;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public interface ValueWrapper {</span></span>
<span class="line"><span>    Object get();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在实际的开发中，一个项目有可能会用到多种不同的缓存，比如既用到Google Guava缓存，也用到Redis缓存。除此之外，同一个缓存实例，也可以根据业务的不同，分割成多个小的逻辑缓存单元（或者叫作命名空间）。</p><p>为了管理多个缓存，Spring还提供了缓存管理功能。不过，它包含的功能很简单，主要有这样两部分：一个是根据缓存名字（创建Cache对象的时候要设置name属性）获取Cache对象；另一个是获取管理器管理的所有缓存的名字列表。对应的Spring源码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface CacheManager {</span></span>
<span class="line"><span>  Cache getCache(String var1);</span></span>
<span class="line"><span>  Collection&amp;lt;String&amp;gt; getCacheNames();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>刚刚给出的是CacheManager接口的定义，那如何来实现这两个接口呢？实际上，这就要用到了我们之前讲过的组合模式。</p><p>我们前面讲过，组合模式主要应用在能表示成树形结构的一组数据上。树中的结点分为叶子节点和中间节点两类。对应到Spring源码，EhCacheManager、SimpleCacheManager、NoOpCacheManager、RedisCacheManager等表示叶子节点，CompositeCacheManager表示中间节点。</p><p>叶子节点包含的是它所管理的Cache对象，中间节点包含的是其他CacheManager管理器，既可以是CompositeCacheManager，也可以是具体的管理器，比如EhCacheManager、RedisManager等。</p><p>我把CompositeCacheManger的代码贴到了下面，你可以结合着讲解一块看下。其中，getCache()、getCacheNames()两个函数的实现都用到了递归。这正是树形结构最能发挥优势的地方。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CompositeCacheManager implements CacheManager, InitializingBean {</span></span>
<span class="line"><span>  private final List&amp;lt;CacheManager&amp;gt; cacheManagers = new ArrayList();</span></span>
<span class="line"><span>  private boolean fallbackToNoOpCache = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public CompositeCacheManager() {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public CompositeCacheManager(CacheManager... cacheManagers) {</span></span>
<span class="line"><span>    this.setCacheManagers(Arrays.asList(cacheManagers));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setCacheManagers(Collection&amp;lt;CacheManager&amp;gt; cacheManagers) {</span></span>
<span class="line"><span>    this.cacheManagers.addAll(cacheManagers);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setFallbackToNoOpCache(boolean fallbackToNoOpCache) {</span></span>
<span class="line"><span>    this.fallbackToNoOpCache = fallbackToNoOpCache;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void afterPropertiesSet() {</span></span>
<span class="line"><span>    if (this.fallbackToNoOpCache) {</span></span>
<span class="line"><span>      this.cacheManagers.add(new NoOpCacheManager());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Cache getCache(String name) {</span></span>
<span class="line"><span>    Iterator var2 = this.cacheManagers.iterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Cache cache;</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>      if (!var2.hasNext()) {</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      CacheManager cacheManager = (CacheManager)var2.next();</span></span>
<span class="line"><span>      cache = cacheManager.getCache(name);</span></span>
<span class="line"><span>    } while(cache == null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return cache;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Collection&amp;lt;String&amp;gt; getCacheNames() {</span></span>
<span class="line"><span>    Set&amp;lt;String&amp;gt; names = new LinkedHashSet();</span></span>
<span class="line"><span>    Iterator var2 = this.cacheManagers.iterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while(var2.hasNext()) {</span></span>
<span class="line"><span>      CacheManager manager = (CacheManager)var2.next();</span></span>
<span class="line"><span>      names.addAll(manager.getCacheNames());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return Collections.unmodifiableSet(names);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="装饰器模式在spring中的应用" tabindex="-1">装饰器模式在Spring中的应用 <a class="header-anchor" href="#装饰器模式在spring中的应用" aria-label="Permalink to &quot;装饰器模式在Spring中的应用&quot;">​</a></h2><p>我们知道，缓存一般都是配合数据库来使用的。如果写缓存成功，但数据库事务回滚了，那缓存中就会有脏数据。为了解决这个问题，我们需要将缓存的写操作和数据库的写操作，放到同一个事务中，要么都成功，要么都失败。</p><p>实现这样一个功能，Spring使用到了装饰器模式。TransactionAwareCacheDecorator增加了对事务的支持，在事务提交、回滚的时候分别对Cache的数据进行处理。</p><p>TransactionAwareCacheDecorator实现Cache接口，并且将所有的操作都委托给targetCache来实现，对其中的写操作添加了事务功能。这是典型的装饰器模式的应用场景和代码实现，我就不多作解释了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TransactionAwareCacheDecorator implements Cache {</span></span>
<span class="line"><span>  private final Cache targetCache;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public TransactionAwareCacheDecorator(Cache targetCache) {</span></span>
<span class="line"><span>    Assert.notNull(targetCache, &quot;Target Cache must not be null&quot;);</span></span>
<span class="line"><span>    this.targetCache = targetCache;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Cache getTargetCache() {</span></span>
<span class="line"><span>    return this.targetCache;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getName() {</span></span>
<span class="line"><span>    return this.targetCache.getName();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Object getNativeCache() {</span></span>
<span class="line"><span>    return this.targetCache.getNativeCache();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ValueWrapper get(Object key) {</span></span>
<span class="line"><span>    return this.targetCache.get(key);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &amp;lt;T&amp;gt; T get(Object key, Class&amp;lt;T&amp;gt; type) {</span></span>
<span class="line"><span>    return this.targetCache.get(key, type);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public &amp;lt;T&amp;gt; T get(Object key, Callable&amp;lt;T&amp;gt; valueLoader) {</span></span>
<span class="line"><span>    return this.targetCache.get(key, valueLoader);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void put(final Object key, final Object value) {</span></span>
<span class="line"><span>    if (TransactionSynchronizationManager.isSynchronizationActive()) {</span></span>
<span class="line"><span>      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {</span></span>
<span class="line"><span>        public void afterCommit() {</span></span>
<span class="line"><span>          TransactionAwareCacheDecorator.this.targetCache.put(key, value);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      this.targetCache.put(key, value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ValueWrapper putIfAbsent(Object key, Object value) {</span></span>
<span class="line"><span>    return this.targetCache.putIfAbsent(key, value);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void evict(final Object key) {</span></span>
<span class="line"><span>    if (TransactionSynchronizationManager.isSynchronizationActive()) {</span></span>
<span class="line"><span>      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {</span></span>
<span class="line"><span>        public void afterCommit() {</span></span>
<span class="line"><span>          TransactionAwareCacheDecorator.this.targetCache.evict(key);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      this.targetCache.evict(key);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void clear() {</span></span>
<span class="line"><span>    if (TransactionSynchronizationManager.isSynchronizationActive()) {</span></span>
<span class="line"><span>      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {</span></span>
<span class="line"><span>        public void afterCommit() {</span></span>
<span class="line"><span>          TransactionAwareCacheDecorator.this.targetCache.clear();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      this.targetCache.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="工厂模式在spring中的应用" tabindex="-1">工厂模式在Spring中的应用 <a class="header-anchor" href="#工厂模式在spring中的应用" aria-label="Permalink to &quot;工厂模式在Spring中的应用&quot;">​</a></h2><p>在Spring中，工厂模式最经典的应用莫过于实现IOC容器，对应的Spring源码主要是BeanFactory类和ApplicationContext相关类（AbstractApplicationContext、ClassPathXmlApplicationContext、FileSystemXmlApplicationContext…）。除此之外，在理论部分，我还带你手把手实现了一个简单的IOC容器。你可以回过头去再看下。</p><p>在Spring中，创建Bean的方式有很多种，比如前面提到的纯构造函数、无参构造函数加setter方法。我写了一个例子来说明这两种创建方式，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Student {</span></span>
<span class="line"><span>  private long id;</span></span>
<span class="line"><span>  private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Student(long id, String name) {</span></span>
<span class="line"><span>    this.id = id;</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setId(long id) {</span></span>
<span class="line"><span>    this.id = id;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setName(String name) {</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用构造函数来创建Bean</span></span>
<span class="line"><span>&amp;lt;bean id=&quot;student&quot; class=&quot;com.xzg.cd.Student&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;constructor-arg name=&quot;id&quot; value=&quot;1&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;constructor-arg name=&quot;name&quot; value=&quot;wangzheng&quot;/&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/bean&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用无参构造函数+setter方法来创建Bean</span></span>
<span class="line"><span>&amp;lt;bean id=&quot;student&quot; class=&quot;com.xzg.cd.Student&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;property name=&quot;id&quot; value=&quot;1&quot;&amp;gt;&amp;lt;/property&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;property name=&quot;name&quot; value=&quot;wangzheng&quot;&amp;gt;&amp;lt;/property&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/bean&amp;gt;</span></span></code></pre></div><p>实际上，除了这两种创建Bean的方式之外，我们还可以通过工厂方法来创建Bean。还是刚刚这个例子，用这种方式来创建Bean的话就是下面这个样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class StudentFactory {</span></span>
<span class="line"><span>  private static Map&amp;lt;Long, Student&amp;gt; students = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static{</span></span>
<span class="line"><span>    map.put(1, new Student(1,&quot;wang&quot;));</span></span>
<span class="line"><span>    map.put(2, new Student(2,&quot;zheng&quot;));</span></span>
<span class="line"><span>    map.put(3, new Student(3,&quot;xzg&quot;));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static Student getStudent(long id){</span></span>
<span class="line"><span>    return students.get(id);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 通过工厂方法getStudent(2)来创建BeanId=&quot;zheng&quot;&quot;的Bean</span></span>
<span class="line"><span>&amp;lt;bean id=&quot;zheng&quot; class=&quot;com.xzg.cd.StudentFactory&quot; factory-method=&quot;getStudent&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;constructor-arg value=&quot;2&quot;&amp;gt;&amp;lt;/constructor-arg&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/bean&amp;gt;</span></span></code></pre></div><h2 id="其他模式在spring中的应用" tabindex="-1">其他模式在Spring中的应用 <a class="header-anchor" href="#其他模式在spring中的应用" aria-label="Permalink to &quot;其他模式在Spring中的应用&quot;">​</a></h2><p>前面的几个模式在Spring中的应用讲解的都比较详细，接下来的几个模式，大部分都是我们之前讲过的，这里只是简单总结一下，点到为止，如果你对哪块有遗忘，可以回过头去看下理论部分的讲解。</p><p>SpEL，全称叫Spring Expression Language，是Spring中常用来编写配置的表达式语言。它定义了一系列的语法规则。我们只要按照这些语法规则来编写表达式，Spring就能解析出表达式的含义。实际上，这就是我们前面讲到的解释器模式的典型应用场景。</p><p>因为解释器模式没有一个非常固定的代码实现结构，而且Spring中SpEL相关的代码也比较多，所以这里就不带你一块阅读源码了。如果感兴趣或者项目中正好要实现类似的功能的时候，你可以再去阅读、借鉴它的代码实现。代码主要集中在spring-expresssion这个模块下面。</p><p>前面讲到单例模式的时候，我提到过，单例模式有很多弊端，比如单元测试不友好等。应对策略就是通过IOC容器来管理对象，通过IOC容器来实现对象的唯一性的控制。实际上，这样实现的单例并非真正的单例，它的唯一性的作用范围仅仅在同一个IOC容器内。</p><p>除此之外，Spring还用到了观察者模式、模板模式、职责链模式、代理模式。其中，观察者模式、模板模式在上一节课已经详细讲过了。</p><p>实际上，在Spring中，只要后缀带有Template的类，基本上都是模板类，而且大部分都是用Callback回调来实现的，比如JdbcTemplate、RedisTemplate等。剩下的两个模式在Spring中的应用应该人尽皆知了。职责链模式在Spring中的应用是拦截器（Interceptor），代理模式经典应用是AOP。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>我们今天提到的设计模式有11种，它们分别是适配器模式、策略模式、组合模式、装饰器模式、工厂模式、单例模式、解释器模式、观察者模式、模板模式、职责链模式、代理模式，基本上占了23种设计模式的一半。这还只是我所知道的，实际上，Spring用到的设计模式可能还要更多。你看，设计模式并非“花拳绣腿”吧，它在实际的项目开发中，确实有很多应用，确实可以发挥很大的作用。</p><p>还是那句话，对于今天的内容，你不需要去记忆哪个类用到了哪个设计模式。你只需要跟着我的讲解，把每个设计模式在Spring中的应用场景，搞懂就可以了。看到类似的代码，能够立马识别出它用到了哪种设计模式；看到类似的应用场景，能够立马反映出要用哪种模式去解决，这样就说明你已经掌握得足够好了。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>我们前面讲到，除了纯构造函数、构造函数加setter方法和工厂方法之外，还有另外一个经常用来创建对象的模式，Builder模式。如果我们让Spring支持通过Builder模式来创建Bean，应该如何来编写代码和配置呢？你可以设计一下吗？</p><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,62)])])}const u=a(l,[["render",i]]);export{h as __pageData,u as default};
