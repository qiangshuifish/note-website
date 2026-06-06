import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"导读｜5分钟轻松了解一个HTTP请求的处理过程","description":"","frontmatter":{},"headers":[],"relativePath":"Spring编程常见错误50例/导读｜5分钟轻松了解一个HTTP请求的处理过程.md","filePath":"Spring编程常见错误50例/导读｜5分钟轻松了解一个HTTP请求的处理过程.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/导读｜5分钟轻松了解一个HTTP请求的处理过程.md"};function l(i,s,c,r,o,g){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="导读-5分钟轻松了解一个http请求的处理过程" tabindex="-1">导读｜5分钟轻松了解一个HTTP请求的处理过程 <a class="header-anchor" href="#导读-5分钟轻松了解一个http请求的处理过程" aria-label="Permalink to &quot;导读｜5分钟轻松了解一个HTTP请求的处理过程&quot;">​</a></h1><p>你好，我是傅健。</p><p>上一章节我们学习了自动注入、AOP 等 Spring 核心知识运用上的常见错误案例。然而，我们 <strong>使用 Spring 大多还是为了开发一个 Web 应用程序</strong>，所以从这节课开始，我们将学习Spring Web 的常见错误案例。</p><p>在这之前，我想有必要先给你简单介绍一下 Spring Web 最核心的流程，这可以让我们后面的学习进展更加顺利一些。</p><p>那什么是 Spring Web 最核心的流程呢？无非就是一个 HTTP 请求的处理过程。这里我以 Spring Boot 的使用为例，以尽量简单的方式带你梳理下。</p><p>首先，回顾下我们是怎么添加一个 HTTP 接口的，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String hi(){</span></span>
<span class="line"><span>         return &quot;helloworld&quot;;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这是我们最喜闻乐见的一个程序，但是对于很多程序员而言，其实完全不知道为什么这样就工作起来了。毕竟，不知道原理，它也能工作起来。</p><p>但是，假设你是一个严谨且有追求的人，你大概率是有好奇心去了解它的。而且相信我，这个问题面试也可能会问到。我们一起来看看它背后的故事。</p><p>其实仔细看这段程序，你会发现一些 <strong>关键的“元素”</strong>：</p><ol><li>请求的 Path: hi</li><li>请求的方法：Get</li><li>对应方法的执行：hi()</li></ol><p>那么，假设让你自己去实现 HTTP 的请求处理，你可能会写出这样一段伪代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HttpRequestHandler{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Map&amp;lt;RequestKey, Method&amp;gt; mapper = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object handle(HttpRequest httpRequest){</span></span>
<span class="line"><span>         RequestKey requestKey = getRequestKey(httpRequest);</span></span>
<span class="line"><span>         Method method = this.mapper.getValue(requestKey);</span></span>
<span class="line"><span>         Object[] args = resolveArgsAccordingToMethod(httpRequest, method);</span></span>
<span class="line"><span>         return method.invoke(controllerObject, args);</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么现在需要哪些组件来完成一个请求的对应和执行呢？</p><ol><li>需要有一个地方（例如 Map）去维护从 HTTP path/method 到具体执行方法的映射；</li><li>当一个请求来临时，根据请求的关键信息来获取对应的需要执行的方法；</li><li>根据方法定义解析出调用方法的参数值，然后通过反射调用方法，获取返回结果。</li></ol><p>除此之外，你还需要一个东西，就是利用底层通信层来解析出你的 HTTP 请求。只有解析出请求了，才能知道 path/method 等信息，才有后续的执行，否则也是“巧妇难为无米之炊”了。</p><p>所以综合来看，你大体上需要这些过程才能完成一个请求的解析和处理。那么接下来我们就按照处理顺序分别看下 Spring Boot 是如何实现的，对应的一些关键实现又长什么样。</p><p>首先，解析 HTTP 请求。对于 Spring 而言，它本身并不提供通信层的支持，它是依赖于Tomcat、Jetty等容器来完成通信层的支持，例如当我们引入Spring Boot时，我们就间接依赖了Tomcat。依赖关系图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/bf28efcd2d8dc920dddbe4dabaeefb71.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/bf28efcd2d8dc920dddbe4dabaeefb71.png" alt=""></a></p><p>另外，正是这种自由组合的关系，让我们可以做到直接置换容器而不影响功能。例如我们可以通过下面的配置从默认的Tomcat切换到Jetty：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>       &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>       &amp;lt;exclusions&amp;gt;</span></span>
<span class="line"><span>             &amp;lt;exclusion&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;artifactId&amp;gt;spring-boot-starter-tomcat&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>             &amp;lt;/exclusion&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/exclusions&amp;gt;-</span></span>
<span class="line"><span>    &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;!-- Use Jetty instead --&amp;gt;</span></span>
<span class="line"><span> &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;artifactId&amp;gt;spring-boot-starter-jetty&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>依赖了Tomcat后，Spring Boot在启动的时候，就会把Tomcat启动起来做好接收连接的准备。</p><p>关于Tomcat如何被启动，你可以通过下面的调用栈来大致了解下它的过程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/456dc47793b0f99c9c2d193027f0ed44.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/456dc47793b0f99c9c2d193027f0ed44.png" alt=""></a></p><p>说白了，就是调用下述代码行就会启动Tomcat：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SpringApplication.run(Application.class, args);</span></span></code></pre></div><p>那为什么使用的是Tomcat？你可以看下面这个类，或许就明白了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryConfiguration</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ServletWebServerFactoryConfiguration {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Configuration(proxyBeanMethods = false)</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnClass({ Servlet.class, Tomcat.class, UpgradeProtocol.class })</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)</span></span>
<span class="line"><span>   public static class EmbeddedTomcat {</span></span>
<span class="line"><span>      &amp;#64;Bean</span></span>
<span class="line"><span>      public TomcatServletWebServerFactory tomcatServletWebServerFactory(</span></span>
<span class="line"><span>         //省略非关键代码</span></span>
<span class="line"><span>         return factory;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Configuration(proxyBeanMethods = false)</span></span>
<span class="line"><span>&amp;#64;ConditionalOnClass({ Servlet.class, Server.class, Loader.class, WebAppContext.class })</span></span>
<span class="line"><span>&amp;#64;ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)</span></span>
<span class="line"><span>public static class EmbeddedJetty {</span></span>
<span class="line"><span>   &amp;#64;Bean</span></span>
<span class="line"><span>   public JettyServletWebServerFactory JettyServletWebServerFactory(</span></span>
<span class="line"><span>         ObjectProvider&amp;lt;JettyServerCustomizer&amp;gt; serverCustomizers) {</span></span>
<span class="line"><span>       //省略非关键代码</span></span>
<span class="line"><span>      return factory;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//省略其他容器配置</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>前面我们默认依赖了Tomcat内嵌容器的JAR，所以下面的条件会成立，进而就依赖上了Tomcat：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   &amp;#64;ConditionalOnClass({ Servlet.class, Tomcat.class, UpgradeProtocol.class })</span></span></code></pre></div><p>有了Tomcat后，当一个HTTP请求访问时，会触发Tomcat底层提供的NIO通信来完成数据的接收，这点我们可以从下面的代码（org.apache.tomcat.util.net.NioEndpoint.Poller#run）中看出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public void run() {</span></span>
<span class="line"><span>    while (true) {</span></span>
<span class="line"><span>         //省略其他非关键代码</span></span>
<span class="line"><span>         //轮询注册的兴趣事件</span></span>
<span class="line"><span>         if (wakeupCounter.getAndSet(-1) &amp;gt; 0) {</span></span>
<span class="line"><span>               keyCount = selector.selectNow();</span></span>
<span class="line"><span>         } else {</span></span>
<span class="line"><span>               keyCount = selector.select(selectorTimeout);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //省略其他非关键代码</span></span>
<span class="line"><span>        Iterator&amp;lt;SelectionKey&amp;gt; iterator =</span></span>
<span class="line"><span>            keyCount &amp;gt; 0 ? selector.selectedKeys().iterator() : null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (iterator != null &amp;&amp; iterator.hasNext()) {</span></span>
<span class="line"><span>            SelectionKey sk = iterator.next();</span></span>
<span class="line"><span>            NioSocketWrapper socketWrapper = (NioSocketWrapper)</span></span>
<span class="line"><span>            //处理事件</span></span>
<span class="line"><span>            processKey(sk, socketWrapper);</span></span>
<span class="line"><span>            //省略其他非关键代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>       //省略其他非关键代码</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码会完成请求事件的监听和处理，最终在processKey中把请求事件丢入线程池去处理。请求事件的接收具体调用栈如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/f4b3febfced888415038f4b7cccb2fe3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/f4b3febfced888415038f4b7cccb2fe3.png" alt=""></a></p><p>线程池对这个请求的处理的调用栈如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/99021847afb18bf522860cf2a42aa3e0.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/99021847afb18bf522860cf2a42aa3e0.png" alt=""></a></p><p>在上述调用中，最终会进入Spring Boot的处理核心，即DispatcherServlet（上述调用栈没有继续截取完整调用，所以未显示）。可以说，DispatcherServlet是用来处理HTTP请求的中央调度入口程序，为每一个 Web 请求映射一个请求的处理执行体（API controller/method）。</p><p>我们可以看下它的核心是什么？它本质上就是一种Servlet，所以它是由下面的Servlet核心方法触发：</p><blockquote><p>javax.servlet.http.HttpServlet#service(javax.servlet.ServletRequest, javax.servlet.ServletResponse)</p></blockquote><p>最终它执行到的是下面的doService()，这个方法完成了请求的分发和处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span>      doDispatch(request, response);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看下它是如何分发和执行的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span> // 省略其他非关键代码</span></span>
<span class="line"><span> // 1. 分发：Determine handler for the current request.</span></span>
<span class="line"><span>  HandlerExecutionChain mappedHandler = getHandler(processedRequest);</span></span>
<span class="line"><span></span></span>
<span class="line"><span> // 省略其他非关键代码</span></span>
<span class="line"><span> //Determine handler adapter for the current request.</span></span>
<span class="line"><span>  HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span> // 省略其他非关键代码</span></span>
<span class="line"><span> // 2. 执行：Actually invoke the handler.</span></span>
<span class="line"><span>  mv = ha.handle(processedRequest, response, mappedHandler.getHandler());</span></span>
<span class="line"><span></span></span>
<span class="line"><span> // 省略其他非关键代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述代码中，很明显有两个关键步骤：</p><p><strong>1. 分发，即根据请求寻找对应的执行方法</strong></p><p>寻找方法参考DispatcherServlet#getHandler，具体的查找远比开始给出的Map查找来得复杂，但是无非还是一个根据请求寻找候选执行方法的过程，这里我们可以通过一个调试视图感受下这种对应关系：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/58f9b4c2ac68e8648f441381f1ff88dc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/58f9b4c2ac68e8648f441381f1ff88dc.png" alt=""></a></p><p>这里的关键映射Map，其实就是上述调试视图中的RequestMappingHandlerMapping。</p><p><strong>2. 执行，反射执行寻找到的执行方法</strong></p><p>这点可以参考下面的调试视图来验证这个结论，参考代码org.springframework.web.method.support.InvocableHandlerMethod#doInvoke：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/6d83528c381441a11bfc111f0f645794.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/6d83528c381441a11bfc111f0f645794.png" alt=""></a></p><p>最终我们是通过反射来调用执行方法的。</p><p>通过上面的梳理，你应该基本了解了一个HTTP请求是如何执行的。但是你可能会产生这样一个疑惑：Handler的映射是如何构建出来的呢？</p><p>说白了，核心关键就是RequestMappingHandlerMapping这个Bean的构建过程。</p><p>它的构建完成后，会调用afterPropertiesSet来做一些额外的事，这里我们可以先看下它的调用栈：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/f106c25aed5f62fce28d589390891b16.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/372003/f106c25aed5f62fce28d589390891b16.png" alt=""></a></p><p>其中关键的操作是AbstractHandlerMethodMapping#processCandidateBean方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void processCandidateBean(String beanName) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   if (beanType != null &amp;&amp; isHandler(beanType)) {</span></span>
<span class="line"><span>      detectHandlerMethods(beanName);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>isHandler(beanType)的实现参考以下关键代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>protected boolean isHandler(Class&amp;lt;?&amp;gt; beanType) {</span></span>
<span class="line"><span>   return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class) ||</span></span>
<span class="line"><span>         AnnotatedElementUtils.hasAnnotation(beanType, RequestMapping.class));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里你会发现，判断的关键条件是，是否标记了合适的注解（Controller或者RequestMapping）。只有标记了，才能添加到Map信息。换言之，Spring在构建RequestMappingHandlerMapping时，会处理所有标记Controller和RequestMapping的注解，然后解析它们构建出请求到处理的映射关系。</p><p>以上即为Spring Boot处理一个HTTP请求的核心过程，无非就是绑定一个内嵌容器（Tomcat/Jetty/其他）来接收请求，然后为请求寻找一个合适的方法，最后反射执行它。当然，这中间还会掺杂无数的细节，不过这不重要，抓住这个核心思想对你接下来理解Spring Web中各种类型的错误案例才是大有裨益的！</p>`,62)])])}const m=a(t,[["render",l]]);export{h as __pageData,m as default};
