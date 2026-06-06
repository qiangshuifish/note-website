import{_ as a,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"14 | Spring Web 过滤器使用常见错误（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例1：@WebFilter过滤器使用@Order无效","slug":"案例1-webfilter过滤器使用-order无效","link":"#案例1-webfilter过滤器使用-order无效","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例2：过滤器被多次执行","slug":"案例2-过滤器被多次执行","link":"#案例2-过滤器被多次执行","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/14-SpringWeb过滤器使用常见错误（下）.md","filePath":"Spring编程常见错误50例/14-SpringWeb过滤器使用常见错误（下）.md","lastUpdated":1779817075000}'),i={name:"Spring编程常见错误50例/14-SpringWeb过滤器使用常见错误（下）.md"};function t(l,n,r,o,c,d){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_14-spring-web-过滤器使用常见错误-下" tabindex="-1">14 | Spring Web 过滤器使用常见错误（下） <a class="header-anchor" href="#_14-spring-web-过滤器使用常见错误-下" aria-label="Permalink to &quot;14 | Spring Web 过滤器使用常见错误（下）&quot;">​</a></h1><p>你好，我是傅健。</p><p>通过上节课的两个案例，我们了解了容器运行时过滤器的工作原理，那么这节课我们还是通过两个错误案例，来学习下容器启动时过滤器初始化以及排序注册等相关逻辑。了解了它们，你会对如何使用好过滤器更有信心。下面，我们具体来看一下。</p><h2 id="案例1-webfilter过滤器使用-order无效" tabindex="-1">案例1：@WebFilter过滤器使用@Order无效 <a class="header-anchor" href="#案例1-webfilter过滤器使用-order无效" aria-label="Permalink to &quot;案例1：@WebFilter过滤器使用@Order无效&quot;">​</a></h2><p>假设我们还是基于Spring Boot去开发上节课的学籍管理系统，这里我们简单复习下上节课用到的代码。</p><p>首先，创建启动程序的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;SpringBootApplication</span></span>
<span class="line"><span>&amp;#64;ServletComponentScan</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SpringApplication.run(Application.class, args);</span></span>
<span class="line"><span>        log.info(&quot;启动成功&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现的Controller代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Controller</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class StudentController {</span></span>
<span class="line"><span>    &amp;#64;PostMapping(&quot;/regStudent/{name)}&quot;)</span></span>
<span class="line"><span>    &amp;#64;ResponseBody</span></span>
<span class="line"><span>    public String saveUser(String name) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;......用户注册成功&quot;);</span></span>
<span class="line"><span>        return &quot;success&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码提供了一个 Restful 接口 &quot;/regStudent&quot;。该接口只有一个参数 name，注册成功会返回&quot;success&quot;。</p><p>现在，我们来实现两个新的过滤器，代码如下：</p><p>AuthFilter：例如，限制特定IP地址段（例如校园网内）的用户方可注册为新用户，当然这里我们仅仅Sleep 1秒来模拟这个过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;WebFilter</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Order(2)</span></span>
<span class="line"><span>public class AuthFilter implements Filter {</span></span>
<span class="line"><span>    &amp;#64;SneakyThrows</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {</span></span>
<span class="line"><span>        if(isPassAuth()){</span></span>
<span class="line"><span>            System.out.println(&quot;通过授权&quot;);</span></span>
<span class="line"><span>            chain.doFilter(request, response);</span></span>
<span class="line"><span>        }else{</span></span>
<span class="line"><span>            System.out.println(&quot;未通过授权&quot;);</span></span>
<span class="line"><span>            ((HttpServletResponse)response).sendError(401);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private boolean isPassAuth() throws InterruptedException {</span></span>
<span class="line"><span>        System.out.println(&quot;执行检查权限&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>TimeCostFilter：计算注册学生的执行耗时，需要包括授权过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;WebFilter</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Order(1)</span></span>
<span class="line"><span>public class TimeCostFilter implements Filter {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {</span></span>
<span class="line"><span>        System.out.println(&quot;#开始计算接口耗时&quot;);</span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        chain.doFilter(request, response);</span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        long time = end - start;</span></span>
<span class="line"><span>        System.out.println(&quot;#执行时间(ms)：&quot; + time);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述代码中，我们使用了@Order，期望TimeCostFilter先被执行，因为TimeCostFilter设计的初衷是统计这个接口的性能，所以是需要统计AuthFilter执行的授权过程的。</p><p>全部代码实现完毕，执行结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>执行检查权限</span></span>
<span class="line"><span>通过授权</span></span>
<span class="line"><span>#开始计算接口耗时</span></span>
<span class="line"><span>......用户注册成功</span></span>
<span class="line"><span>#执行时间(ms)：33</span></span></code></pre></div><p>从结果来看，执行时间并不包含授权过程，所以这并不符合我们的预期，毕竟我们是加了@Order的。但是如果我们交换Order指定的值，你会发现也不见效果，为什么会如此？难道Order不能用来排序WebFilter么？下面我们来具体解析下这个问题及其背后的原理。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>通过上节课的学习，我们得知：当一个请求来临时，会执行到 StandardWrapperValve 的 invoke()，这个方法会创建 ApplicationFilterChain，并通过ApplicationFilterChain#doFilter() 触发过滤器执行，并最终执行到内部私有方法internalDoFilter()， 我们可以尝试在internalDoFilter()中寻找一些启示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void internalDoFilter(ServletRequest request,</span></span>
<span class="line"><span>                              ServletResponse response)</span></span>
<span class="line"><span>    throws IOException, ServletException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Call the next filter if there is one</span></span>
<span class="line"><span>    if (pos &amp;lt; n) {</span></span>
<span class="line"><span>        ApplicationFilterConfig filterConfig = filters[pos++];</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Filter filter = filterConfig.getFilter();</span></span></code></pre></div><p>从上述代码我们得知：过滤器的执行顺序是由类成员变量Filters决定的，而Filters变量则是createFilterChain()在容器启动时顺序遍历StandardContext中的成员变量FilterMaps获得的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static ApplicationFilterChain createFilterChain(ServletRequest request,</span></span>
<span class="line"><span>        Wrapper wrapper, Servlet servlet) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>    // Acquire the filter mappings for this Context</span></span>
<span class="line"><span>    StandardContext context = (StandardContext) wrapper.getParent();</span></span>
<span class="line"><span>    FilterMap filterMaps[] = context.findFilterMaps();</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>    // Add the relevant path-mapped filters to this filter chain</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; filterMaps.length; i++) {</span></span>
<span class="line"><span>        if (!matchDispatcher(filterMaps[i] ,dispatcher)) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!matchFiltersURL(filterMaps[i], requestPath))</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        ApplicationFilterConfig filterConfig = (ApplicationFilterConfig)</span></span>
<span class="line"><span>            context.findFilterConfig(filterMaps[i].getFilterName());</span></span>
<span class="line"><span>        if (filterConfig == null) {</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        filterChain.addFilter(filterConfig);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>    // Return the completed filter chain</span></span>
<span class="line"><span>    return filterChain;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面继续查找对StandardContext成员变量FilterMaps的写入引用，我们找到了addFilterMapBefore()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void addFilterMapBefore(FilterMap filterMap) {</span></span>
<span class="line"><span>    validateFilterMap(filterMap);</span></span>
<span class="line"><span>    // Add this filter mapping to our registered set</span></span>
<span class="line"><span>    filterMaps.addBefore(filterMap);</span></span>
<span class="line"><span>    fireContainerEvent(&quot;addFilterMap&quot;, filterMap);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这，我们已经知道过滤器的执行顺序是由StandardContext类成员变量FilterMaps的顺序决定，而FilterMaps则是一个包装过的数组，所以我们只要进一步弄清楚 <strong>FilterMaps中各元素的排列顺序</strong> 即可。</p><p>我们继续在addFilterMapBefore()中加入断点，尝试从调用栈中找到一些线索：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>addFilterMapBefore:2992, StandardContext</span></span>
<span class="line"><span>addMappingForUrlPatterns:107, ApplicationFilterRegistration</span></span>
<span class="line"><span>configure:229, AbstractFilterRegistrationBean</span></span>
<span class="line"><span>configure:44, AbstractFilterRegistrationBean</span></span>
<span class="line"><span>register:113, DynamicRegistrationBean</span></span>
<span class="line"><span>onStartup:53, RegistrationBean</span></span>
<span class="line"><span>selfInitialize:228, ServletWebServerApplicationContext</span></span>
<span class="line"><span>// 省略非关键代码</span></span></code></pre></div><p>可知，Spring从selfInitialize()一直依次调用到addFilterMapBefore()，稍微分析下selfInitialize()，我们可以了解到，这里是通过调用getServletContextInitializerBeans()，获取所有的ServletContextInitializer类型的Bean，并调用该Bean的onStartup()，从而一步步以调用栈显示的顺序，最终调用到 addFilterMapBefore()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void selfInitialize(ServletContext servletContext) throws ServletException {</span></span>
<span class="line"><span>   prepareWebApplicationContext(servletContext);</span></span>
<span class="line"><span>   registerApplicationScope(servletContext);</span></span>
<span class="line"><span>   WebApplicationContextUtils.registerEnvironmentBeans(getBeanFactory(), servletContext);</span></span>
<span class="line"><span>   for (ServletContextInitializer beans : getServletContextInitializerBeans()) {</span></span>
<span class="line"><span>      beans.onStartup(servletContext);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么上述的selfInitialize()又从何处调用过来呢？这里你可以先想想，我会在思考题中给你做进一步解释。</p><p>现在我们继续查看selfInitialize()的细节。</p><p>首先，查看上述代码中的getServletContextInitializerBeans()，因为此方法返回的ServletContextInitializer类型的Bean集合顺序决定了addFilterMapBefore()调用的顺序，从而决定了FilterMaps内元素的顺序，最终决定了过滤器的执行顺序。</p><p>getServletContextInitializerBeans()的实现非常简单，只是返回了ServletContextInitializerBeans类的一个实例，参考代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Collection&amp;lt;ServletContextInitializer&amp;gt; getServletContextInitializerBeans() {</span></span>
<span class="line"><span>   return new ServletContextInitializerBeans(getBeanFactory());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述方法的返回值是个Collection，可见ServletContextInitializerBeans类是一个集合类，它继承了AbstractCollection抽象类。也因为如此，上述selfInitialize()才可以遍历 ServletContextInitializerBeans的实例对象。</p><p>既然ServletContextInitializerBeans是集合类，那么我们就可以先查看其iterator()，看看它遍历的是什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public Iterator&amp;lt;ServletContextInitializer&amp;gt; iterator() {</span></span>
<span class="line"><span>   return this.sortedList.iterator();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>此集合类对外暴露的集合遍历元素为sortedList成员变量，也就是说，上述selfInitialize()最终遍历的即为sortedList成员变量。</p><p>到这，我们可以进一步确定下结论：selfInitialize()中是通过getServletContextInitializerBeans()获取到的ServletContextInitializer类型的Beans集合，即为ServletContextInitializerBeans的类型成员变量sortedList。反过来说， <strong>sortedList中的过滤器Bean元素顺序，决定了最终过滤器的执行顺序</strong>。</p><p>现在我们继续查看ServletContextInitializerBeans的构造方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ServletContextInitializerBeans(ListableBeanFactory beanFactory,</span></span>
<span class="line"><span>      Class&amp;lt;? extends ServletContextInitializer&amp;gt;... initializerTypes) {</span></span>
<span class="line"><span>   this.initializers = new LinkedMultiValueMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>   this.initializerTypes = (initializerTypes.length != 0) ? Arrays.asList(initializerTypes)</span></span>
<span class="line"><span>         : Collections.singletonList(ServletContextInitializer.class);</span></span>
<span class="line"><span>   addServletContextInitializerBeans(beanFactory);</span></span>
<span class="line"><span>   addAdaptableBeans(beanFactory);</span></span>
<span class="line"><span>   List&amp;lt;ServletContextInitializer&amp;gt; sortedInitializers = this.initializers.values().stream()</span></span>
<span class="line"><span>         .flatMap((value) -&amp;gt; value.stream().sorted(AnnotationAwareOrderComparator.INSTANCE))</span></span>
<span class="line"><span>         .collect(Collectors.toList());</span></span>
<span class="line"><span>   this.sortedList = Collections.unmodifiableList(sortedInitializers);</span></span>
<span class="line"><span>   logMappings(this.initializers);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过第8行，可以得知：我们关心的类成员变量this.sortedList，其元素顺序是由类成员变量this.initializers的values通过比较器AnnotationAwareOrderComparator进行排序的。</p><p>继续查看AnnotationAwareOrderComparator比较器，忽略比较器调用的细节过程，其最终是通过两种方式获取比较器需要的order值，来决定sortedInitializers的排列顺序：</p><ul><li>待排序的对象元素自身实现了Order接口，则直接通过getOrder()获取order值；</li><li>否则执行OrderUtils.findOrder()获取该对象类@Order的属性。</li></ul><p>这里多解释一句，因为this.initializers的values类型为ServletContextInitializer，其实现了Ordered接口，所以这里的比较器显然是使用了getOrder()获取比较器所需的order值，对应的类成员变量即为order。</p><p>继续查看this.initializers中的元素在何处被添加，我们最终得知，addServletContextInitializerBeans()以及addAdaptableBeans()这两个方法均构建了ServletContextInitializer子类的实例，并添加到了this.initializers成员变量中。在这里，我们只研究addServletContextInitializerBeans，毕竟我们使用的添加过滤器方式（使用@WebFilter标记）最终只会通过这个方法生效。</p><p>在这个方法中，Spring通过getOrderedBeansOfType()实例化了所有ServletContextInitializer的子类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void addServletContextInitializerBeans(ListableBeanFactory beanFactory) {</span></span>
<span class="line"><span>   for (Class&amp;lt;? extends ServletContextInitializer&amp;gt; initializerType : this.initializerTypes) {</span></span>
<span class="line"><span>      for (Entry&amp;lt;String, ? extends ServletContextInitializer&amp;gt; initializerBean : getOrderedBeansOfType(beanFactory,</span></span>
<span class="line"><span>            initializerType)) {</span></span>
<span class="line"><span>         addServletContextInitializerBean(initializerBean.getKey(), initializerBean.getValue(), beanFactory);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据其不同类型，调用addServletContextInitializerBean()，我们可以看出ServletContextInitializer的子类包括了ServletRegistrationBean、FilterRegistrationBean以及ServletListenerRegistrationBean，正好对应了Servlet的三大要素。</p><p>而这里我们只需要关心对应于Filter的FilterRegistrationBean，显然，FilterRegistrationBean是ServletContextInitializer的子类（实现了Ordered接口），同样由 <strong>成员变量order的值决定其执行的优先级。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void addServletContextInitializerBean(String beanName, ServletContextInitializer initializer,</span></span>
<span class="line"><span>      ListableBeanFactory beanFactory) {</span></span>
<span class="line"><span>   if (initializer instanceof ServletRegistrationBean) {</span></span>
<span class="line"><span>      Servlet source = ((ServletRegistrationBean&amp;lt;?&amp;gt;) initializer).getServlet();</span></span>
<span class="line"><span>      addServletContextInitializerBean(Servlet.class, beanName, initializer, beanFactory, source);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (initializer instanceof FilterRegistrationBean) {</span></span>
<span class="line"><span>      Filter source = ((FilterRegistrationBean&amp;lt;?&amp;gt;) initializer).getFilter();</span></span>
<span class="line"><span>      addServletContextInitializerBean(Filter.class, beanName, initializer, beanFactory, source);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (initializer instanceof DelegatingFilterProxyRegistrationBean) {</span></span>
<span class="line"><span>      String source = ((DelegatingFilterProxyRegistrationBean) initializer).getTargetBeanName();</span></span>
<span class="line"><span>      addServletContextInitializerBean(Filter.class, beanName, initializer, beanFactory, source);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (initializer instanceof ServletListenerRegistrationBean) {</span></span>
<span class="line"><span>      EventListener source = ((ServletListenerRegistrationBean&amp;lt;?&amp;gt;) initializer).getListener();</span></span>
<span class="line"><span>      addServletContextInitializerBean(EventListener.class, beanName, initializer, beanFactory, source);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      addServletContextInitializerBean(ServletContextInitializer.class, beanName, initializer, beanFactory,</span></span>
<span class="line"><span>            initializer);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终添加到this.initializers成员变量中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void addServletContextInitializerBean(Class&amp;lt;?&amp;gt; type, String beanName, ServletContextInitializer initializer,</span></span>
<span class="line"><span>      ListableBeanFactory beanFactory, Object source) {</span></span>
<span class="line"><span>   this.initializers.add(type, initializer);</span></span>
<span class="line"><span>// 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上述代码，我们再次看到了FilterRegistrationBean。但问题来了，我们没有定义FilterRegistrationBean，那么这里的FilterRegistrationBean是在哪里被定义的呢？其order类成员变量是否有特定的取值逻辑？</p><p>不妨回想下上节课的案例1，它是在WebFilterHandler类的doHandle()动态构建了FilterRegistrationBean的BeanDefinition：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class WebFilterHandler extends ServletComponentHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   WebFilterHandler() {</span></span>
<span class="line"><span>      super(WebFilter.class);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public void doHandle(Map&amp;lt;String, Object&amp;gt; attributes, AnnotatedBeanDefinition beanDefinition,</span></span>
<span class="line"><span>         BeanDefinitionRegistry registry) {</span></span>
<span class="line"><span>      BeanDefinitionBuilder builder = BeanDefinitionBuilder.rootBeanDefinition(FilterRegistrationBean.class);</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;asyncSupported&quot;, attributes.get(&quot;asyncSupported&quot;));</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;dispatcherTypes&quot;, extractDispatcherTypes(attributes));</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;filter&quot;, beanDefinition);</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;initParameters&quot;, extractInitParameters(attributes));</span></span>
<span class="line"><span>      String name = determineName(attributes, beanDefinition);</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;name&quot;, name);</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;servletNames&quot;, attributes.get(&quot;servletNames&quot;));</span></span>
<span class="line"><span>      builder.addPropertyValue(&quot;urlPatterns&quot;, extractUrlPatterns(attributes));</span></span>
<span class="line"><span>      registry.registerBeanDefinition(name, builder.getBeanDefinition());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 省略非关键代码</span></span></code></pre></div><p>这里我再次贴出了WebFilterHandler中doHandle()的逻辑（即通过 BeanDefinitionBuilder动态构建了FilterRegistrationBean类型的BeanDefinition）。然而遗憾的是， <strong>此处并没有设置order的值，更没有根据@Order指定的值去设置。</strong></p><p>到这里我们终于看清楚了问题的本质，所有被@WebFilter注解的类，最终都会在此处被包装为FilterRegistrationBean类的BeanDefinition。虽然FilterRegistrationBean也拥有Ordered接口，但此处却并没有填充值，因为这里所有的属性都是从@WebFilter对应的属性获取的，而@WebFilter本身没有指定可以辅助排序的属性。</p><p>现在我们来总结下，过滤器的执行顺序是由下面这个串联决定的：</p><blockquote><p>RegistrationBean中order属性的值-&gt;</p><p>ServletContextInitializerBeans类成员变量sortedList中元素的顺序-&gt;</p><p>ServletWebServerApplicationContext 中selfInitialize()遍历FilterRegistrationBean的顺序-&gt;</p><p>addFilterMapBefore()调用的顺序-&gt;</p><p>filterMaps内元素的顺序-&gt;</p><p>过滤器的执行顺序</p></blockquote><p>可见，RegistrationBean中order属性的值最终可以决定过滤器的执行顺序。但是可惜的是：当使用@WebFilter时，构建的FilterRegistrationBean并没有依据@Order的值去设置order属性，所以@Order失效了。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>现在，我们理清了Spring启动Web服务之前的一些必要类的初始化流程，同时也弄清楚了@Order和@WebFilter同时使用失效的原因，但这个问题想要解决却并非那么简单。</p><p>这里我先提供给你一个常见的做法，即实现自己的FilterRegistrationBean来配置添加过滤器，不再使用@WebFilter。具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>public class FilterConfiguration {</span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public FilterRegistrationBean authFilter() {</span></span>
<span class="line"><span>        FilterRegistrationBean registration = new FilterRegistrationBean();</span></span>
<span class="line"><span>        registration.setFilter(new AuthFilter());</span></span>
<span class="line"><span>        registration.addUrlPatterns(&quot;/*&quot;);</span></span>
<span class="line"><span>        registration.setOrder(2);</span></span>
<span class="line"><span>        return registration;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean</span></span>
<span class="line"><span>    public FilterRegistrationBean timeCostFilter() {</span></span>
<span class="line"><span>        FilterRegistrationBean registration = new FilterRegistrationBean();</span></span>
<span class="line"><span>        registration.setFilter(new TimeCostFilter());</span></span>
<span class="line"><span>        registration.addUrlPatterns(&quot;/*&quot;);</span></span>
<span class="line"><span>        registration.setOrder(1);</span></span>
<span class="line"><span>        return registration;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照我们查看的源码中的逻辑，虽然WebFilterHandler中doHandle()构建了FilterRegistrationBean类型的BeanDefinition，但 <strong>没有设置order的值</strong>。</p><p>所以在这里，我们直接手工实例化了FilterRegistrationBean实例，而且设置了其setOrder()。同时不要忘记去掉AuthFilter和TimeCostFilter类中的@WebFilter，这样问题就得以解决了。</p><h2 id="案例2-过滤器被多次执行" tabindex="-1">案例2：过滤器被多次执行 <a class="header-anchor" href="#案例2-过滤器被多次执行" aria-label="Permalink to &quot;案例2：过滤器被多次执行&quot;">​</a></h2><p>我们继续沿用上面的案例代码，要解决排序问题，可能有人就想了是不是有其他的解决方案呢？比如我们能否在两个过滤器中增加@Component，从而让@Order生效呢？代码如下。</p><p>AuthFilter：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;WebFilter</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Order(2)</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class AuthFilter implements Filter {</span></span>
<span class="line"><span>    &amp;#64;SneakyThrows</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain){</span></span>
<span class="line"><span>        if(isPassAuth()){</span></span>
<span class="line"><span>            System.out.println(&quot;通过授权&quot;);</span></span>
<span class="line"><span>            chain.doFilter(request, response);</span></span>
<span class="line"><span>        }else{</span></span>
<span class="line"><span>            System.out.println(&quot;未通过授权&quot;);</span></span>
<span class="line"><span>            ((HttpServletResponse)response).sendError(401);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private boolean isPassAuth() throws InterruptedException {</span></span>
<span class="line"><span>        System.out.println(&quot;执行检查权限&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>TimeCostFilter类如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;WebFilter</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Order(1)</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class TimeCostFilter implements Filter {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {</span></span>
<span class="line"><span>        System.out.println(&quot;#开始计算接口耗时&quot;);</span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        chain.doFilter(request, response);</span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        long time = end - start;</span></span>
<span class="line"><span>        System.out.println(&quot;#执行时间(ms)：&quot; + time);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终执行结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#开始计算接口耗时</span></span>
<span class="line"><span>执行检查权限</span></span>
<span class="line"><span>通过授权</span></span>
<span class="line"><span>执行检查权限</span></span>
<span class="line"><span>通过授权</span></span>
<span class="line"><span>#开始计算接口耗时</span></span>
<span class="line"><span>......用户注册成功</span></span>
<span class="line"><span>#执行时间(ms)：73</span></span>
<span class="line"><span>#执行时间(ms)：2075</span></span></code></pre></div><p>更改 AuthFilter 类中的Order值为0，继续测试，得到结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>执行检查权限</span></span>
<span class="line"><span>通过授权</span></span>
<span class="line"><span>#开始计算接口耗时</span></span>
<span class="line"><span>执行检查权限</span></span>
<span class="line"><span>通过授权</span></span>
<span class="line"><span>#开始计算接口耗时</span></span>
<span class="line"><span>......用户注册成功</span></span>
<span class="line"><span>#执行时间(ms)：96</span></span>
<span class="line"><span>#执行时间(ms)：1100</span></span></code></pre></div><p>显然，通过Order的值，我们已经可以随意调整Filter的执行顺序，但是我们会惊奇地发现，过滤器本身被执行了2次，这明显不符合我们的预期！那么如何理解这个现象呢？</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>从案例1中我们已经得知被@WebFilter的过滤器，会在WebServletHandler类中被重新包装为FilterRegistrationBean类的BeanDefinition，而并非是Filter类型。</p><p>而当我们在自定义过滤器中增加@Component时，我们可以大胆猜测下：理论上Spring会根据当前类再次包装一个新的过滤器，因而doFIlter()被执行两次。因此看似奇怪的测试结果，也在情理之中了。</p><p>我们继续从源码中寻找真相，继续查阅ServletContextInitializerBeans的构造方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ServletContextInitializerBeans(ListableBeanFactory beanFactory,</span></span>
<span class="line"><span>      Class&amp;lt;? extends ServletContextInitializer&amp;gt;... initializerTypes) {</span></span>
<span class="line"><span>   this.initializers = new LinkedMultiValueMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>   this.initializerTypes = (initializerTypes.length != 0) ? Arrays.asList(initializerTypes)</span></span>
<span class="line"><span>         : Collections.singletonList(ServletContextInitializer.class);</span></span>
<span class="line"><span>   addServletContextInitializerBeans(beanFactory);</span></span>
<span class="line"><span>   addAdaptableBeans(beanFactory);</span></span>
<span class="line"><span>   List&amp;lt;ServletContextInitializer&amp;gt; sortedInitializers = this.initializers.values().stream()</span></span>
<span class="line"><span>         .flatMap((value) -&amp;gt; value.stream().sorted(AnnotationAwareOrderComparator.INSTANCE))</span></span>
<span class="line"><span>         .collect(Collectors.toList());</span></span>
<span class="line"><span>   this.sortedList = Collections.unmodifiableList(sortedInitializers);</span></span>
<span class="line"><span>   logMappings(this.initializers);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上一个案例中，我们关注了addServletContextInitializerBeans()，了解了它的作用是实例化并注册了所有FilterRegistrationBean类型的过滤器（严格说，是实例化并注册了所有的ServletRegistrationBean、FilterRegistrationBean以及ServletListenerRegistrationBean，但这里我们只关注FilterRegistrationBean）。</p><p>而第7行的addAdaptableBeans()，其作用则是实例化所有实现Filter接口的类（严格说，是实例化并注册了所有实现Servlet、Filter以及EventListener接口的类），然后再逐一包装为FilterRegistrationBean。</p><p>之所以Spring能够直接实例化FilterRegistrationBean类型的过滤器，这是因为：</p><ul><li>WebFilterHandler相关类通过扫描@WebFilter，动态构建了FilterRegistrationBean类型的BeanDefinition，并注册到Spring；</li><li>或者我们自己使用@Bean来显式实例化FilterRegistrationBean并注册到Spring，如案例1中的解决方案。</li></ul><p>但Filter类型的过滤器如何才能被Spring直接实例化呢？相信你已经有答案了： <strong>任何通过@Component修饰的的类，都可以自动注册到Spring，且能被Spring直接实例化。</strong></p><p>现在我们直接查看addAdaptableBeans()，其调用了addAsRegistrationBean()，其beanType为Filter.class：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void addAdaptableBeans(ListableBeanFactory beanFactory) {</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>   addAsRegistrationBean(beanFactory, Filter.class, new FilterRegistrationBeanAdapter());</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>继续查看最终调用到的方法addAsRegistrationBean()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private &amp;lt;T, B extends T&amp;gt; void addAsRegistrationBean(ListableBeanFactory beanFactory, Class&amp;lt;T&amp;gt; type,</span></span>
<span class="line"><span>      Class&amp;lt;B&amp;gt; beanType, RegistrationBeanAdapter&amp;lt;T&amp;gt; adapter) {</span></span>
<span class="line"><span>   List&amp;lt;Map.Entry&amp;lt;String, B&amp;gt;&amp;gt; entries = getOrderedBeansOfType(beanFactory, beanType, this.seen);</span></span>
<span class="line"><span>   for (Entry&amp;lt;String, B&amp;gt; entry : entries) {</span></span>
<span class="line"><span>      String beanName = entry.getKey();</span></span>
<span class="line"><span>      B bean = entry.getValue();</span></span>
<span class="line"><span>      if (this.seen.add(bean)) {</span></span>
<span class="line"><span>         // One that we haven&#39;t already seen</span></span>
<span class="line"><span>         RegistrationBean registration = adapter.createRegistrationBean(beanName, bean, entries.size());</span></span>
<span class="line"><span>         int order = getOrder(bean);</span></span>
<span class="line"><span>         registration.setOrder(order);</span></span>
<span class="line"><span>         this.initializers.add(type, registration);</span></span>
<span class="line"><span>         if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>            logger.trace(&quot;Created &quot; + type.getSimpleName() + &quot; initializer for bean &#39;&quot; + beanName + &quot;&#39;; order=&quot;</span></span>
<span class="line"><span>                  + order + &quot;, resource=&quot; + getResourceDescription(beanName, beanFactory));</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>主要逻辑如下：</p><ul><li>通过getOrderedBeansOfType()创建了所有 Filter 子类的实例，即所有实现Filter接口且被@Component修饰的类；</li><li>依次遍历这些Filter类实例，并通过RegistrationBeanAdapter将这些类包装为RegistrationBean；</li><li>获取Filter类实例的Order值，并设置到包装类 RegistrationBean中；</li><li>将RegistrationBean添加到this.initializers。</li></ul><p>到这，我们了解到，当过滤器同时被@WebFilter和@Component修饰时，会导致两个FilterRegistrationBean实例的产生。addServletContextInitializerBeans()和addAdaptableBeans()最终都会创建FilterRegistrationBean的实例，但不同的是：</p><ul><li>@WebFilter会让addServletContextInitializerBeans()实例化，并注册所有动态生成的FilterRegistrationBean类型的过滤器；</li><li>@Component会让addAdaptableBeans()实例化所有实现Filter接口的类，然后再逐一包装为FilterRegistrationBean类型的过滤器。</li></ul><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>解决这个问题提及的顺序问题，自然可以继续参考案例1的问题修正部分。另外我们也可以去掉@WebFilter保留@Component的方式进行修改，修改后的Filter示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//&amp;#64;WebFilter</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Order(1)</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class TimeCostFilter implements Filter {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>这节课我们分析了过滤器在Spring框架中注册、包装以及实例化的整个流程，最后我们再次回顾下重点。</p><p>@WebFilter和@Component的相同点是：</p><ul><li>它们最终都被包装并实例化成为了FilterRegistrationBean；</li><li>它们最终都是在 ServletContextInitializerBeans的构造器中开始被实例化。</li></ul><p>@WebFilter和@Component的不同点是：</p><ul><li>被@WebFilter修饰的过滤器会被提前在BeanFactoryPostProcessors扩展点包装成FilterRegistrationBean类型的BeanDefinition，然后在ServletContextInitializerBeans.addServletContextInitializerBeans() 进行实例化；而使用@Component修饰的过滤器类，是在ServletContextInitializerBeans.addAdaptableBeans() 中被实例化成Filter类型后，再包装为RegistrationBean类型。</li><li>被@WebFilter修饰的过滤器不会注入Order属性，但被@Component修饰的过滤器会在ServletContextInitializerBeans.addAdaptableBeans() 中注入Order属性。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这节课的两个案例，它们都是在Tomcat容器启动时发生的，但你了解Spring是如何整合Tomcat，使其在启动时注册这些过滤器吗？</p><p>期待你的思考，我们留言区见！</p>`,110)])])}const h=a(i,[["render",t]]);export{u as __pageData,h as default};
