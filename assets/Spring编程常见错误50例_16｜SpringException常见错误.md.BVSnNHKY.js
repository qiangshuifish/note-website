import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"16｜Spring Exception 常见错误","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：小心过滤器异常","slug":"案例-1-小心过滤器异常","link":"#案例-1-小心过滤器异常","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：特殊的 404 异常","slug":"案例-2-特殊的-404-异常","link":"#案例-2-特殊的-404-异常","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/16｜SpringException常见错误.md","filePath":"Spring编程常见错误50例/16｜SpringException常见错误.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/16｜SpringException常见错误.md"};function l(i,n,o,r,c,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_16-spring-exception-常见错误" tabindex="-1">16｜Spring Exception 常见错误 <a class="header-anchor" href="#_16-spring-exception-常见错误" aria-label="Permalink to &quot;16｜Spring Exception 常见错误&quot;">​</a></h1><p>你好，我是傅健。</p><p>今天，我们来学习 Spring 的异常处理机制。Spring 提供了一套健全的异常处理框架，以便我们在开发应用的时候对异常进行处理。但是，我们也会在使用的时候遇到一些麻烦，接下来我将通过两个典型的错误案例，带着你结合源码进行深入了解。</p><h2 id="案例-1-小心过滤器异常" tabindex="-1">案例 1：小心过滤器异常 <a class="header-anchor" href="#案例-1-小心过滤器异常" aria-label="Permalink to &quot;案例 1：小心过滤器异常&quot;">​</a></h2><p>为了方便讲解，我们还是沿用之前在事务处理中用到的学生注册的案例，来讨论异常处理的问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Controller</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class StudentController {</span></span>
<span class="line"><span>    public StudentController(){</span></span>
<span class="line"><span>        System.out.println(&quot;construct&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;PostMapping(&quot;/regStudent/{name}&quot;)</span></span>
<span class="line"><span>    &amp;#64;ResponseBody</span></span>
<span class="line"><span>    public String saveUser(String name) throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;......用户注册成功&quot;);</span></span>
<span class="line"><span>        return &quot;success&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>​为了保证安全，这里需要给请求加一个保护，通过验证 Token 的方式来验证请求的合法性。这个 Token 需要在每次发送请求的时候带在请求的 header 中，header 的 key 是 Token。</p><p>为了校验这个 Token，我们引入了一个 Filter 来处理这个校验工作，这里我使用了一个最简单的 Token：111111。</p><p>当 Token 校验失败时，就会抛出一个自定义的 NotAllowException，交由 Spring 处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;WebFilter</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class PermissionFilter implements Filter {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {</span></span>
<span class="line"><span>        HttpServletRequest httpServletRequest = (HttpServletRequest) request;</span></span>
<span class="line"><span>        String token = httpServletRequest.getHeader(&quot;token&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!&quot;111111&quot;.equals(token)) {</span></span>
<span class="line"><span>            System.out.println(&quot;throw NotAllowException&quot;);</span></span>
<span class="line"><span>            throw new NotAllowException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        chain.doFilter(request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void init(FilterConfig filterConfig) throws ServletException {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void destroy() {</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>NotAllowException 就是一个简单的 RuntimeException 的子类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class NotAllowException extends RuntimeException {</span></span>
<span class="line"><span>    public NotAllowException() {</span></span>
<span class="line"><span>        super();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同时，新增了一个 RestControllerAdvice 来处理这个异常，处理方式也很简单，就是返回一个 403 的 resultCode：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestControllerAdvice</span></span>
<span class="line"><span>public class NotAllowExceptionHandler {</span></span>
<span class="line"><span>    &amp;#64;ExceptionHandler(NotAllowException.class)</span></span>
<span class="line"><span>    &amp;#64;ResponseBody</span></span>
<span class="line"><span>    public String handle() {</span></span>
<span class="line"><span>        System.out.println(&quot;403&quot;);</span></span>
<span class="line"><span>        return &quot;{\\&quot;resultCode\\&quot;: 403}&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了验证一下失败的情况，我们模拟了一个请求，在 HTTP 请求头里加上一个 Token，值为 111，这样就会引发错误了，我们可以看看会不会被 NotAllowExceptionHandler 处理掉。</p><p>然而，在控制台上，我们只看到了下面这样的输出，这其实就说明了 NotAllowExceptionHandler 并没有生效。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>throw NotAllowException</span></span></code></pre></div><p>想下问题出在哪呢？我们不妨对 Spring 的异常处理过程先做一个了解。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们先来回顾一下 <a href="https://time.geekbang.org/column/article/376115" target="_blank" rel="noreferrer">第13课</a> 讲过的过滤器执行流程图，这里我细化了一下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/3f1fa1106a733b137ee965850c9276fe.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/3f1fa1106a733b137ee965850c9276fe.png" alt=""></a></p><p>从这张图中可以看出，当所有的过滤器被执行完毕以后，Spring 才会进入 Servlet 相关的处理，而 DispatcherServlet 才是整个 Servlet 处理的核心，它是前端控制器设计模式的实现，提供 Spring Web MVC 的集中访问点并负责职责的分派。正是在这里，Spring 处理了请求和处理器之间的对应关系，以及这个案例我们所关注的问题——统一异常处理。</p><p>其实说到这里，我们已经了解到过滤器内异常无法被统一处理的大致原因，就是因为异常处理发生在上图的红色区域，即DispatcherServlet中的doDispatch()，而此时，过滤器已经全部执行完毕了。</p><p>下面我们将深入分析 Spring Web 对异常统一处理的逻辑，深刻理解其内部原理。</p><p><strong>首先我们来了解下ControllerAdvice是如何被Spring加载并对外暴露的。</strong> 在Spring Web 的核心配置类 WebMvcConfigurationSupport 中，被 @Bean 修饰的 handlerExceptionResolver()，会调用addDefaultHandlerExceptionResolvers() 来添加默认的异常解析器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public HandlerExceptionResolver handlerExceptionResolver(</span></span>
<span class="line"><span>      &amp;#64;Qualifier(&quot;mvcContentNegotiationManager&quot;) ContentNegotiationManager contentNegotiationManager) {</span></span>
<span class="line"><span>   List&amp;lt;HandlerExceptionResolver&amp;gt; exceptionResolvers = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>   configureHandlerExceptionResolvers(exceptionResolvers);</span></span>
<span class="line"><span>   if (exceptionResolvers.isEmpty()) {</span></span>
<span class="line"><span>      addDefaultHandlerExceptionResolvers(exceptionResolvers, contentNegotiationManager);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   extendHandlerExceptionResolvers(exceptionResolvers);</span></span>
<span class="line"><span>   HandlerExceptionResolverComposite composite = new HandlerExceptionResolverComposite();</span></span>
<span class="line"><span>   composite.setOrder(0);</span></span>
<span class="line"><span>   composite.setExceptionResolvers(exceptionResolvers);</span></span>
<span class="line"><span>   return composite;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终按照下图的调用栈，Spring 实例化了ExceptionHandlerExceptionResolver类。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/73278f8a4366654e5b94783395d0eac1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/73278f8a4366654e5b94783395d0eac1.png" alt=""></a></p><p>从源码中我们可以看出，ExceptionHandlerExceptionResolver 类实现了InitializingBean接口，并覆写了afterPropertiesSet()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void afterPropertiesSet() {</span></span>
<span class="line"><span>   // Do this first, it may add ResponseBodyAdvice beans</span></span>
<span class="line"><span>   initExceptionHandlerAdviceCache();</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>并在 initExceptionHandlerAdviceCache() 中完成了所有 ControllerAdvice 中的ExceptionHandler 的初始化。其具体操作，就是查找所有 @ControllerAdvice 注解的 Bean，把它们放到成员变量 exceptionHandlerAdviceCache 中。</p><p>在我们这个案例里，就是指 NotAllowExceptionHandler 这个异常处理器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void initExceptionHandlerAdviceCache() {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   List&amp;lt;ControllerAdviceBean&amp;gt; adviceBeans = ControllerAdviceBean.findAnnotatedBeans(getApplicationContext());</span></span>
<span class="line"><span>   for (ControllerAdviceBean adviceBean : adviceBeans) {</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; beanType = adviceBean.getBeanType();</span></span>
<span class="line"><span>      if (beanType == null) {</span></span>
<span class="line"><span>         throw new IllegalStateException(&quot;Unresolvable type for ControllerAdviceBean: &quot; + adviceBean);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      ExceptionHandlerMethodResolver resolver = new ExceptionHandlerMethodResolver(beanType);</span></span>
<span class="line"><span>      if (resolver.hasExceptionMappings()) {</span></span>
<span class="line"><span>         this.exceptionHandlerAdviceCache.put(adviceBean, resolver);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span> //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这，我们可以总结一下，WebMvcConfigurationSupport 中的handlerExceptionResolver() 实例化并注册了一个ExceptionHandlerExceptionResolver 的实例，而所有被 @ControllerAdvice 注解修饰的异常处理器，都会在 ExceptionHandlerExceptionResolver 实例化的时候自动扫描并装载在其类成员变量 exceptionHandlerAdviceCache 中。</p><p>当第一次请求发生时，DispatcherServlet 中的 initHandlerExceptionResolvers() 将获取所有注册到 Spring 的 HandlerExceptionResolver 类型的实例，而ExceptionHandlerExceptionResolver 恰好实现了 HandlerExceptionResolver 接口，这些 HandlerExceptionResolver 类型的实例则会被写入到类成员变量handlerExceptionResolvers中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void initHandlerExceptionResolvers(ApplicationContext context) {</span></span>
<span class="line"><span>   this.handlerExceptionResolvers = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   if (this.detectAllHandlerExceptionResolvers) {</span></span>
<span class="line"><span>      // Find all HandlerExceptionResolvers in the ApplicationContext, including ancestor contexts.</span></span>
<span class="line"><span>      Map&amp;lt;String, HandlerExceptionResolver&amp;gt; matchingBeans = BeanFactoryUtils</span></span>
<span class="line"><span>            .beansOfTypeIncludingAncestors(context, HandlerExceptionResolver.class, true, false);</span></span>
<span class="line"><span>      if (!matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>         this.handlerExceptionResolvers = new ArrayList&amp;lt;&amp;gt;(matchingBeans.values());</span></span>
<span class="line"><span>         // We keep HandlerExceptionResolvers in sorted order.</span></span>
<span class="line"><span>         AnnotationAwareOrderComparator.sort(this.handlerExceptionResolvers);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>接着我们再来了解下ControllerAdvice是如何被Spring消费并处理异常的。</strong> 下文贴出的是核心类 DispatcherServlet 中的核心方法 doDispatch() 的部分代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      ModelAndView mv = null;</span></span>
<span class="line"><span>      Exception dispatchException = null;</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>         //省略非关键代码</span></span>
<span class="line"><span>         //查找当前请求对应的 handler，并执行</span></span>
<span class="line"><span>         //省略非关键代码</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (Exception ex) {</span></span>
<span class="line"><span>         dispatchException = ex;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (Throwable err) {</span></span>
<span class="line"><span>         dispatchException = new NestedServletException(&quot;Handler dispatch failed&quot;, err);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span></code></pre></div><p>Spring 在执行用户请求时，当在“查找”和“执行”请求对应的 handler 过程中发生异常，就会把异常赋值给 dispatchException，再交给 processDispatchResult() 进行处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void processDispatchResult(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>      &amp;#64;Nullable HandlerExecutionChain mappedHandler, &amp;#64;Nullable ModelAndView mv,</span></span>
<span class="line"><span>      &amp;#64;Nullable Exception exception) throws Exception {</span></span>
<span class="line"><span>   boolean errorView = false;</span></span>
<span class="line"><span>   if (exception != null) {</span></span>
<span class="line"><span>      if (exception instanceof ModelAndViewDefiningException) {</span></span>
<span class="line"><span>         mv = ((ModelAndViewDefiningException) exception).getModelAndView();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>         Object handler = (mappedHandler != null ? mappedHandler.getHandler() : null);</span></span>
<span class="line"><span>         mv = processHandlerException(request, response, handler, exception);</span></span>
<span class="line"><span>         errorView = (mv != null);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span></code></pre></div><p>进一步处理后，即当 Exception 不为 null 时，继续交给 processHandlerException处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected ModelAndView processHandlerException(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>      &amp;#64;Nullable Object handler, Exception ex) throws Exception {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   ModelAndView exMv = null;</span></span>
<span class="line"><span>   if (this.handlerExceptionResolvers != null) {</span></span>
<span class="line"><span>      for (HandlerExceptionResolver resolver : this.handlerExceptionResolvers) {</span></span>
<span class="line"><span>         exMv = resolver.resolveException(request, response, handler, ex);</span></span>
<span class="line"><span>         if (exMv != null) {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，processHandlerException 会从类成员变量 handlerExceptionResolvers 中获取有效的异常解析器，对异常进行解析。</p><p>显然，这里的 handlerExceptionResolvers 一定包含我们声明的NotAllowExceptionHandler#NotAllowException 的异常处理器的 ExceptionHandlerExceptionResolver 包装类。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>为了利用 Spring MVC 的异常处理机制，我们需要对 Filter 做一些改造。手动捕获异常，并将异常 HandlerExceptionResolver 进行解析处理。</p><p>我们可以这样修改 PermissionFilter，注入 HandlerExceptionResolver：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>&amp;#64;Qualifier(&quot;handlerExceptionResolver&quot;)</span></span>
<span class="line"><span>private HandlerExceptionResolver resolver;</span></span></code></pre></div><p>然后，在 doFilter 里捕获异常并交给 HandlerExceptionResolver 处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {</span></span>
<span class="line"><span>        HttpServletRequest httpServletRequest = (HttpServletRequest) request;</span></span>
<span class="line"><span>        HttpServletResponse httpServletResponse = (HttpServletResponse) response;</span></span>
<span class="line"><span>        String token = httpServletRequest.getHeader(&quot;token&quot;);</span></span>
<span class="line"><span>        if (!&quot;111111&quot;.equals(token)) {</span></span>
<span class="line"><span>            System.out.println(&quot;throw NotAllowException&quot;);</span></span>
<span class="line"><span>            resolver.resolveException(httpServletRequest, httpServletResponse, null, new NotAllowException());</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        chain.doFilter(request, response);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>当我们尝试用错误的 Token 请求，控制台得到了以下信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>throw NotAllowException</span></span>
<span class="line"><span>403</span></span></code></pre></div><p>返回的 JSON 是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;resultCode&quot;: 403}</span></span></code></pre></div><p>再换成正确的 Token 请求，这些错误信息就都没有了，到这，问题解决了。</p><h2 id="案例-2-特殊的-404-异常" tabindex="-1">案例 2：特殊的 404 异常 <a class="header-anchor" href="#案例-2-特殊的-404-异常" aria-label="Permalink to &quot;案例 2：特殊的 404 异常&quot;">​</a></h2><p>继续沿用学生注册的案例，为了防止一些异常的访问，我们需要记录所有 404 状态的访问记录，并返回一个我们的自定义结果。</p><p>一般使用 RESTful 接口时我们会统一返回 JSON 数据，返回值格式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;resultCode&quot;: 404}</span></span></code></pre></div><p>但是 Spring 对 404 异常是进行了默认资源映射的，并不会返回我们想要的结果，也不会对这种错误做记录。</p><p>于是我们添加了一个 ExceptionHandlerController，它被声明成@RestControllerAdvice来全局捕获 Spring MVC 中抛出的异常。</p><p>ExceptionHandler 的作用正是用来捕获指定的异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestControllerAdvice</span></span>
<span class="line"><span>public class MyExceptionHandler {</span></span>
<span class="line"><span>    &amp;#64;ResponseStatus(HttpStatus.NOT_FOUND)</span></span>
<span class="line"><span>    &amp;#64;ExceptionHandler(Exception.class)</span></span>
<span class="line"><span>    &amp;#64;ResponseBody</span></span>
<span class="line"><span>    public String handle404() {</span></span>
<span class="line"><span>        System.out.println(&quot;404&quot;);</span></span>
<span class="line"><span>        return &quot;{\\&quot;resultCode\\&quot;: 404}&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们尝试发送一个错误的 URL 请求到之前实现过的 /regStudent 接口，并把请求地址换成 /regStudent1，得到了以下结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;timestamp&quot;:&quot;2021-05-19T22:24:01.559+0000&quot;,&quot;status&quot;:404,&quot;error&quot;:&quot;Not Found&quot;,&quot;message&quot;:&quot;No message available&quot;,&quot;path&quot;:&quot;/regStudent1&quot;}</span></span></code></pre></div><p>很显然，这个结果不是我们想要的，看起来应该是 Spring 默认的返回结果。那是什么原因导致 Spring 没有使用我们定义的异常处理器呢？</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们可以从异常处理的核心处理代码开始分析，DispatcherServlet 中的 doDispatch() 核心代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        //省略非关键代码</span></span>
<span class="line"><span>         mappedHandler = getHandler(processedRequest);</span></span>
<span class="line"><span>         if (mappedHandler == null) {</span></span>
<span class="line"><span>            noHandlerFound(processedRequest, response);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先调用 getHandler() 获取当前请求的处理器，如果获取不到，则调用noHandlerFound()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void noHandlerFound(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>   if (this.throwExceptionIfNoHandlerFound) {</span></span>
<span class="line"><span>      throw new NoHandlerFoundException(request.getMethod(), getRequestUri(request),</span></span>
<span class="line"><span>            new ServletServerHttpRequest(request).getHeaders());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      response.sendError(HttpServletResponse.SC_NOT_FOUND);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>noHandlerFound() 的逻辑非常简单，如果 throwExceptionIfNoHandlerFound 属性为 true，则直接抛出 NoHandlerFoundException 异常，反之则会进一步获取到对应的请求处理器执行，并将执行结果返回给客户端。</p><p>到这，真相离我们非常近了，我们只需要将 throwExceptionIfNoHandlerFound 默认设置为 true 即可，这样就会抛出 NoHandlerFoundException 异常，从而被 doDispatch()内的 catch 俘获。进而就像案例1介绍的一样，最终能够执行我们自定义的异常处理器MyExceptionHandler。</p><p>于是，我们开始尝试，因为 throwExceptionIfNoHandlerFound 对应的 Spring 配置项为 throw-exception-if-no-handler-found，我们将其加入到 application.properties 配置文件中，设置其值为 true。</p><p>设置完毕后，重启服务并再次尝试，你会发现结果没有任何变化，这个问题也没有被解决。</p><p>实际上这里还存在另一个坑，在 Spring Web 的 WebMvcAutoConfiguration 类中，其默认添加的两个 ResourceHandler，一个是用来处理请求路径/webjars/* <em>*</em>，而另一个是/**。</p><p>即便当前请求没有定义任何对应的请求处理器，getHandler() 也一定会获取到一个 Handler 来处理当前请求，因为第二个匹配 /** 路径的 ResourceHandler 决定了任何请求路径都会被其处理。mappedHandler == null 判断条件永远不会成立，显然就不可能走到 noHandlerFound()，那么就不会抛出 NoHandlerFoundException 异常，也无法被后续的异常处理器进一步处理。</p><p>下面让我们通过源码进一步了解下这个默认被添加的 ResourceHandler 的详细逻辑 。</p><p><strong>首先我们来了解下ControllerAdvice是如何被Spring加载并对外暴露的。</strong></p><p>同样是在 WebMvcConfigurationSupport 类中，被 @Bean 修饰的 resourceHandlerMapping()，它新建了 ResourceHandlerRegistry 类实例，并通过 addResourceHandlers() 将 ResourceHandler 注册到 ResourceHandlerRegistry 类实例中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>public HandlerMapping resourceHandlerMapping(</span></span>
<span class="line"><span>      &amp;#64;Qualifier(&quot;mvcUrlPathHelper&quot;) UrlPathHelper urlPathHelper,</span></span>
<span class="line"><span>      &amp;#64;Qualifier(&quot;mvcPathMatcher&quot;) PathMatcher pathMatcher,</span></span>
<span class="line"><span>      &amp;#64;Qualifier(&quot;mvcContentNegotiationManager&quot;) ContentNegotiationManager contentNegotiationManager,</span></span>
<span class="line"><span>      &amp;#64;Qualifier(&quot;mvcConversionService&quot;) FormattingConversionService conversionService,</span></span>
<span class="line"><span>      &amp;#64;Qualifier(&quot;mvcResourceUrlProvider&quot;) ResourceUrlProvider resourceUrlProvider) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   Assert.state(this.applicationContext != null, &quot;No ApplicationContext set&quot;);</span></span>
<span class="line"><span>   Assert.state(this.servletContext != null, &quot;No ServletContext set&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ResourceHandlerRegistry registry = new ResourceHandlerRegistry(this.applicationContext,</span></span>
<span class="line"><span>         this.servletContext, contentNegotiationManager, urlPathHelper);</span></span>
<span class="line"><span>   addResourceHandlers(registry);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   AbstractHandlerMapping handlerMapping = registry.getHandlerMapping();</span></span>
<span class="line"><span>   if (handlerMapping == null) {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   handlerMapping.setPathMatcher(pathMatcher);</span></span>
<span class="line"><span>   handlerMapping.setUrlPathHelper(urlPathHelper);</span></span>
<span class="line"><span>   handlerMapping.setInterceptors(getInterceptors(conversionService, resourceUrlProvider));</span></span>
<span class="line"><span>   handlerMapping.setCorsConfigurations(getCorsConfigurations());</span></span>
<span class="line"><span>   return handlerMapping;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终通过 ResourceHandlerRegistry 类实例中的 getHandlerMapping() 返回了 SimpleUrlHandlerMapping 实例，它装载了所有 ResourceHandler 的集合并注册到了 Spring 容器中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected AbstractHandlerMapping getHandlerMapping() {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   Map&amp;lt;String, HttpRequestHandler&amp;gt; urlMap = new LinkedHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>   for (ResourceHandlerRegistration registration : this.registrations) {</span></span>
<span class="line"><span>      for (String pathPattern : registration.getPathPatterns()) {</span></span>
<span class="line"><span>         ResourceHttpRequestHandler handler = registration.getRequestHandler();</span></span>
<span class="line"><span>         //省略非关键代码</span></span>
<span class="line"><span>         urlMap.put(pathPattern, handler);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return new SimpleUrlHandlerMapping(urlMap, this.order);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们查看以下调用栈截图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/a220a653ddb4394caeee6f2721b35697.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/a220a653ddb4394caeee6f2721b35697.png" alt=""></a></p><p>可以了解到，当前方法中的 addResourceHandlers() 最终执行到了 WebMvcAutoConfiguration 类中的 addResourceHandlers()，通过这个方法，我们可以知道当前有哪些 ResourceHandler 的集合被注册到了Spring容器中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void addResourceHandlers(ResourceHandlerRegistry registry) {</span></span>
<span class="line"><span>   if (!this.resourceProperties.isAddMappings()) {</span></span>
<span class="line"><span>      logger.debug(&quot;Default resource handling disabled&quot;);</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   Duration cachePeriod = this.resourceProperties.getCache().getPeriod();</span></span>
<span class="line"><span>   CacheControl cacheControl = this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl();</span></span>
<span class="line"><span>   if (!registry.hasMappingForPattern(&quot;/webjars/**&quot;)) {</span></span>
<span class="line"><span>      customizeResourceHandlerRegistration(registry.addResourceHandler(&quot;/webjars/**&quot;)</span></span>
<span class="line"><span>            .addResourceLocations(&quot;classpath:/META-INF/resources/webjars/&quot;)</span></span>
<span class="line"><span>            .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   String staticPathPattern = this.mvcProperties.getStaticPathPattern();</span></span>
<span class="line"><span>   if (!registry.hasMappingForPattern(staticPathPattern)) {</span></span>
<span class="line"><span>      customizeResourceHandlerRegistration(registry.addResourceHandler(staticPathPattern)</span></span>
<span class="line"><span>            .addResourceLocations(getResourceLocations(this.resourceProperties.getStaticLocations()))</span></span>
<span class="line"><span>            .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从而验证我们一开始得出的结论，此处添加了两个 ResourceHandler，一个是用来处理请求路径/webjars/* <em>*</em>， 而另一个是/**。</p><p>这里你可以注意一下方法最开始的判断语句，如果 this.resourceProperties.isAddMappings() 为 false，那么会直接返回，后续的两个 ResourceHandler 也不会被添加。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   if (!this.resourceProperties.isAddMappings()) {</span></span>
<span class="line"><span>      logger.debug(&quot;Default resource handling disabled&quot;);</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>   }</span></span></code></pre></div><p>​至此，有两个 ResourceHandler 被实例化且注册到了 Spirng 容器中，一个处理路径为/webjars/* <em>*</em> 的请求，另一个处理路径为 /**的请求 。</p><p>同样，当第一次请求发生时，DispatcherServlet 中的 initHandlerMappings() 将会获取所有注册到 Spring 的 HandlerMapping 类型的实例，而 SimpleUrlHandlerMapping 恰好实现了 HandlerMapping 接口，这些 SimpleUrlHandlerMapping 类型的实例则会被写入到类成员变量 handlerMappings 中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void initHandlerMappings(ApplicationContext context) {</span></span>
<span class="line"><span>   this.handlerMappings = null;</span></span>
<span class="line"><span>//省略非关键代码</span></span>
<span class="line"><span>   if (this.detectAllHandlerMappings) {</span></span>
<span class="line"><span>      // Find all HandlerMappings in the ApplicationContext, including ancestor contexts.</span></span>
<span class="line"><span>      Map&amp;lt;String, HandlerMapping&amp;gt; matchingBeans =</span></span>
<span class="line"><span>            BeanFactoryUtils.beansOfTypeIncludingAncestors(context, HandlerMapping.class, true, false);</span></span>
<span class="line"><span>      if (!matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>         this.handlerMappings = new ArrayList&amp;lt;&amp;gt;(matchingBeans.values());</span></span>
<span class="line"><span>         // We keep HandlerMappings in sorted order.</span></span>
<span class="line"><span>         AnnotationAwareOrderComparator.sort(this.handlerMappings);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接着我们再来了解下被包装为 handlerMappings 的 ResourceHandler 是如何被 Spring 消费并处理的。</p><p>我们来回顾一下 DispatcherServlet 中的 doDispatch() 核心代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>        //省略非关键代码</span></span>
<span class="line"><span>         mappedHandler = getHandler(processedRequest);</span></span>
<span class="line"><span>         if (mappedHandler == null) {</span></span>
<span class="line"><span>            noHandlerFound(processedRequest, response);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的 getHandler() 将会遍历成员变量 handlerMappings：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {</span></span>
<span class="line"><span>   if (this.handlerMappings != null) {</span></span>
<span class="line"><span>      for (HandlerMapping mapping : this.handlerMappings) {</span></span>
<span class="line"><span>         HandlerExecutionChain handler = mapping.getHandler(request);</span></span>
<span class="line"><span>         if (handler != null) {</span></span>
<span class="line"><span>            return handler;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为此处有一个 SimpleUrlHandlerMapping，它会拦截所有路径的请求：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/4a4b314b45744ec2e194743e19d1204e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378676/4a4b314b45744ec2e194743e19d1204e.png" alt=""></a></p><p>所以最终在 doDispatch() 的 getHandler() 将会获取到此 handler，从而 mappedHandler==null 条件不能得到满足，因而无法走到 noHandlerFound()，不会抛出 NoHandlerFoundException 异常，进而无法被后续的异常处理器进一步处理。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>那如何解决这个问题呢？还记得 WebMvcAutoConfiguration 类中 addResourceHandlers() 的前两行代码吗？如果 this.resourceProperties.isAddMappings() 为 false，那么此处直接返回，后续的两个 ResourceHandler 也不会被添加。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void addResourceHandlers(ResourceHandlerRegistry registry) {</span></span>
<span class="line"><span>   if (!this.resourceProperties.isAddMappings()) {</span></span>
<span class="line"><span>      logger.debug(&quot;Default resource handling disabled&quot;);</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其调用 ResourceProperties 中的 isAddMappings() 的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isAddMappings() {</span></span>
<span class="line"><span>   return this.addMappings;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这，答案也就呼之欲出了，增加两个配置文件如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.resources.add-mappings=false</span></span>
<span class="line"><span>spring.mvc.throwExceptionIfNoHandlerFound=true</span></span></code></pre></div><p>修改 MyExceptionHandler 的 @ExceptionHandler 为 NoHandlerFoundException 即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ExceptionHandler(NoHandlerFoundException.class)</span></span></code></pre></div><p>这个案例在真实的产线环境遇到的概率还是比较大的，知道如何解决是第一步，了解其内部原理则更为重要。而且当你进一步去研读代码后，你会发现这里的解决方案并不会只有这一种，而剩下的就留给你去探索了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过以上两个案例的介绍，相信你对 Spring MVC 的异常处理机制，已经有了进一步的了解，这里我们再次回顾下重点：</p><ul><li>DispatcherServlet 类中的 doDispatch() 是整个 Servlet 处理的核心，它不仅实现了请求的分发，也提供了异常统一处理等等一系列功能；</li><li>WebMvcConfigurationSupport 是 Spring Web 中非常核心的一个配置类，无论是异常处理器的包装注册（HandlerExceptionResolver），还是资源处理器的包装注册（SimpleUrlHandlerMapping），都是依靠这个类来完成的。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这节课的两个案例，在第一次发送请求的时候，会遍历对应的资源处理器和异常处理器，并注册到 DispatcherServlet 对应的类成员变量中，你知道它是如何被触发的吗？</p><p>期待你的思考，我们留言区见！</p>`,117)])])}const g=s(t,[["render",l]]);export{h as __pageData,g as default};
