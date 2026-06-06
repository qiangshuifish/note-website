import{_ as s,H as a,f as e,i as t}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"28 | 新特性：Spring Boot如何使用内嵌式的Tomcat和Jetty？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Spring Boot中Web容器相关的接口","slug":"spring-boot中web容器相关的接口","link":"#spring-boot中web容器相关的接口","children":[]},{"level":2,"title":"内嵌式Web容器的创建和启动","slug":"内嵌式web容器的创建和启动","link":"#内嵌式web容器的创建和启动","children":[]},{"level":2,"title":"注册Servlet的三种方式","slug":"注册servlet的三种方式","link":"#注册servlet的三种方式","children":[]},{"level":2,"title":"Web容器的定制","slug":"web容器的定制","link":"#web容器的定制","children":[]},{"level":2,"title":"本期精华","slug":"本期精华","link":"#本期精华","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"深入拆解Tomcat&Jetty/28-新特性：SpringBoot如何使用内嵌式的Tomcat和Jetty？.md","filePath":"深入拆解Tomcat&Jetty/28-新特性：SpringBoot如何使用内嵌式的Tomcat和Jetty？.md","lastUpdated":1779821049000}'),p={name:"深入拆解Tomcat&Jetty/28-新特性：SpringBoot如何使用内嵌式的Tomcat和Jetty？.md"};function l(i,n,o,r,c,v){return a(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="_28-新特性-spring-boot如何使用内嵌式的tomcat和jetty" tabindex="-1">28 | 新特性：Spring Boot如何使用内嵌式的Tomcat和Jetty？ <a class="header-anchor" href="#_28-新特性-spring-boot如何使用内嵌式的tomcat和jetty" aria-label="Permalink to &quot;28 | 新特性：Spring Boot如何使用内嵌式的Tomcat和Jetty？&quot;">​</a></h1><p>为了方便开发和部署，Spring Boot在内部启动了一个嵌入式的Web容器。我们知道Tomcat和Jetty是组件化的设计，要启动Tomcat或者Jetty其实就是启动这些组件。在Tomcat独立部署的模式下，我们通过startup脚本来启动Tomcat，Tomcat中的Bootstrap和Catalina会负责初始化类加载器，并解析 <code>server.xml</code> 和启动这些组件。</p><p>在内嵌式的模式下，Bootstrap和Catalina的工作就由Spring Boot来做了，Spring Boot调用了Tomcat和Jetty的API来启动这些组件。那Spring Boot具体是怎么做的呢？而作为程序员，我们如何向Spring Boot中的Tomcat注册Servlet或者Filter呢？我们又如何定制内嵌式的Tomcat？今天我们就来聊聊这些话题。</p><h2 id="spring-boot中web容器相关的接口" tabindex="-1">Spring Boot中Web容器相关的接口 <a class="header-anchor" href="#spring-boot中web容器相关的接口" aria-label="Permalink to &quot;Spring Boot中Web容器相关的接口&quot;">​</a></h2><p>既然要支持多种Web容器，Spring Boot对内嵌式Web容器进行了抽象，定义了 <strong>WebServer</strong> 接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface WebServer {</span></span>
<span class="line"><span>    void start() throws WebServerException;</span></span>
<span class="line"><span>    void stop() throws WebServerException;</span></span>
<span class="line"><span>    int getPort();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>各种Web容器比如Tomcat和Jetty需要去实现这个接口。</p><p>Spring Boot还定义了一个工厂 <strong>ServletWebServerFactory</strong> 来创建Web容器，返回的对象就是上面提到的WebServer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ServletWebServerFactory {</span></span>
<span class="line"><span>    WebServer getWebServer(ServletContextInitializer... initializers);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到getWebServer有个参数，类型是 <strong>ServletContextInitializer</strong>。它表示ServletContext的初始化器，用于ServletContext中的一些配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ServletContextInitializer {</span></span>
<span class="line"><span>    void onStartup(ServletContext servletContext) throws ServletException;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里请注意，上面提到的getWebServer方法会调用ServletContextInitializer的onStartup方法，也就是说如果你想在Servlet容器启动时做一些事情，比如注册你自己的Servlet，可以实现一个ServletContextInitializer，在Web容器启动时，Spring Boot会把所有实现了ServletContextInitializer接口的类收集起来，统一调它们的onStartup方法。</p><p>为了支持对内嵌式Web容器的定制化，Spring Boot还定义了 <strong>WebServerFactoryCustomizerBeanPostProcessor</strong> 接口，它是一个BeanPostProcessor，它在postProcessBeforeInitialization过程中去寻找Spring容器中WebServerFactoryCustomizer类型的Bean，并依次调用WebServerFactoryCustomizer接口的customize方法做一些定制化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface WebServerFactoryCustomizer&lt;​T extends WebServerFactory&gt; {</span></span>
<span class="line"><span>    void customize(T factory);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="内嵌式web容器的创建和启动" tabindex="-1">内嵌式Web容器的创建和启动 <a class="header-anchor" href="#内嵌式web容器的创建和启动" aria-label="Permalink to &quot;内嵌式Web容器的创建和启动&quot;">​</a></h2><p>铺垫了这些接口，我们再来看看Spring Boot是如何实例化和启动一个Web容器的。我们知道，Spring的核心是一个ApplicationContext，它的抽象实现类AbstractApplicationContext实现了著名的 <strong>refresh</strong> 方法，它用来新建或者刷新一个ApplicationContext，在refresh方法中会调用onRefresh方法，AbstractApplicationContext的子类可以重写这个onRefresh方法，来实现特定Context的刷新逻辑，因此ServletWebServerApplicationContext就是通过重写onRefresh方法来创建内嵌式的Web容器，具体创建过程是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>protected void onRefresh() {</span></span>
<span class="line"><span>     super.onRefresh();</span></span>
<span class="line"><span>     try {</span></span>
<span class="line"><span>        //重写onRefresh方法，调用createWebServer创建和启动Tomcat</span></span>
<span class="line"><span>        createWebServer();</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     catch (Throwable ex) {</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//createWebServer的具体实现</span></span>
<span class="line"><span>private void createWebServer() {</span></span>
<span class="line"><span>    //这里WebServer是Spring Boot抽象出来的接口，具体实现类就是不同的Web容器</span></span>
<span class="line"><span>    WebServer webServer = this.webServer;</span></span>
<span class="line"><span>    ServletContext servletContext = this.getServletContext();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //如果Web容器还没创建</span></span>
<span class="line"><span>    if (webServer == null &amp;&amp; servletContext == null) {</span></span>
<span class="line"><span>        //通过Web容器工厂来创建</span></span>
<span class="line"><span>        ServletWebServerFactory factory = this.getWebServerFactory();</span></span>
<span class="line"><span>        //注意传入了一个&quot;SelfInitializer&quot;</span></span>
<span class="line"><span>        this.webServer = factory.getWebServer(new ServletContextInitializer[]{this.getSelfInitializer()});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    } else if (servletContext != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            this.getSelfInitializer().onStartup(servletContext);</span></span>
<span class="line"><span>        } catch (ServletException var4) {</span></span>
<span class="line"><span>          ...</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.initPropertySources();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再来看看getWebServer具体做了什么，以Tomcat为例，主要调用Tomcat的API去创建各种组件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public WebServer getWebServer(ServletContextInitializer... initializers) {</span></span>
<span class="line"><span>    //1.实例化一个Tomcat，可以理解为Server组件。</span></span>
<span class="line"><span>    Tomcat tomcat = new Tomcat();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //2. 创建一个临时目录</span></span>
<span class="line"><span>    File baseDir = this.baseDirectory != null ? this.baseDirectory : this.createTempDir(&quot;tomcat&quot;);</span></span>
<span class="line"><span>    tomcat.setBaseDir(baseDir.getAbsolutePath());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //3.初始化各种组件</span></span>
<span class="line"><span>    Connector connector = new Connector(this.protocol);</span></span>
<span class="line"><span>    tomcat.getService().addConnector(connector);</span></span>
<span class="line"><span>    this.customizeConnector(connector);</span></span>
<span class="line"><span>    tomcat.setConnector(connector);</span></span>
<span class="line"><span>    tomcat.getHost().setAutoDeploy(false);</span></span>
<span class="line"><span>    this.configureEngine(tomcat.getEngine());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //4. 创建定制版的&quot;Context&quot;组件。</span></span>
<span class="line"><span>    this.prepareContext(tomcat.getHost(), initializers);</span></span>
<span class="line"><span>    return this.getTomcatWebServer(tomcat);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可能好奇prepareContext方法是做什么的呢？这里的Context是指 <strong>Tomcat中的Context组件</strong>，为了方便控制Context组件的行为，Spring Boot定义了自己的TomcatEmbeddedContext，它扩展了Tomcat的StandardContext：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TomcatEmbeddedContext extends StandardContext {}</span></span></code></pre></div><h2 id="注册servlet的三种方式" tabindex="-1">注册Servlet的三种方式 <a class="header-anchor" href="#注册servlet的三种方式" aria-label="Permalink to &quot;注册Servlet的三种方式&quot;">​</a></h2><p><strong>1. Servlet注解</strong></p><p>在Spring Boot启动类上加上@ServletComponentScan注解后，使用@WebServlet、@WebFilter、@WebListener标记的Servlet、Filter、Listener就可以自动注册到Servlet容器中，无需其他代码，我们通过下面的代码示例来理解一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>@ServletComponentScan</span></span>
<span class="line"><span>public class xxxApplication</span></span>
<span class="line"><span>{}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@WebServlet(&quot;/hello&quot;)</span></span>
<span class="line"><span>public class HelloServlet extends HttpServlet {}</span></span></code></pre></div><p>在Web应用的入口类上加上@ServletComponentScan，并且在Servlet类上加上@WebServlet，这样Spring Boot会负责将Servlet注册到内嵌的Tomcat中。</p><p><strong>2. ServletRegistrationBean</strong></p><p>同时Spring Boot也提供了ServletRegistrationBean、FilterRegistrationBean和ServletListenerRegistrationBean这三个类分别用来注册Servlet、Filter、Listener。假如要注册一个Servlet，可以这样做：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Bean</span></span>
<span class="line"><span>public ServletRegistrationBean servletRegistrationBean() {</span></span>
<span class="line"><span>    return new ServletRegistrationBean(new HelloServlet(),&quot;/hello&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码实现的方法返回一个ServletRegistrationBean，并将它当作Bean注册到Spring中，因此你需要把这段代码放到Spring Boot自动扫描的目录中，或者放到@Configuration标识的类中。</p><p><strong>3. 动态注册</strong></p><p>你还可以创建一个类去实现前面提到的ServletContextInitializer接口，并把它注册为一个Bean，Spring Boot会负责调用这个接口的onStartup方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class MyServletRegister implements ServletContextInitializer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onStartup(ServletContext servletContext) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //Servlet 3.0规范新的API</span></span>
<span class="line"><span>        ServletRegistration myServlet = servletContext</span></span>
<span class="line"><span>                .addServlet(&quot;HelloServlet&quot;, HelloServlet.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        myServlet.addMapping(&quot;/hello&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        myServlet.setInitParameter(&quot;name&quot;, &quot;Hello Servlet&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里请注意两点：</p><ul><li>ServletRegistrationBean其实也是通过ServletContextInitializer来实现的，它实现了ServletContextInitializer接口。</li><li>注意到onStartup方法的参数是我们熟悉的ServletContext，可以通过调用它的addServlet方法来动态注册新的Servlet，这是Servlet 3.0以后才有的功能。</li></ul><h2 id="web容器的定制" tabindex="-1">Web容器的定制 <a class="header-anchor" href="#web容器的定制" aria-label="Permalink to &quot;Web容器的定制&quot;">​</a></h2><p>我们再来考虑一个问题，那就是如何在Spring Boot中定制Web容器。在Spring Boot 2.0中，我们可以通过两种方式来定制Web容器。</p><p><strong>第一种方式</strong> 是通过通用的Web容器工厂ConfigurableServletWebServerFactory，来定制一些Web容器通用的参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class MyGeneralCustomizer implements</span></span>
<span class="line"><span>  WebServerFactoryCustomizer&lt;​ConfigurableServletWebServerFactory&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void customize(ConfigurableServletWebServerFactory factory) {</span></span>
<span class="line"><span>        factory.setPort(8081);</span></span>
<span class="line"><span>        factory.setContextPath(&quot;/hello&quot;);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第二种方式</strong> 是通过特定Web容器的工厂比如TomcatServletWebServerFactory来进一步定制。下面的例子里，我们给Tomcat增加一个Valve，这个Valve的功能是向请求头里添加traceid，用于分布式追踪。TraceValve的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TraceValve extends ValveBase {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void invoke(Request request, Response response) throws IOException, ServletException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        request.getCoyoteRequest().getMimeHeaders().</span></span>
<span class="line"><span>        addValue(&quot;traceid&quot;).setString(&quot;1234xxxxabcd&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Valve next = getNext();</span></span>
<span class="line"><span>        if (null == next) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        next.invoke(request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>跟第一种方式类似，再添加一个定制器，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class MyTomcatCustomizer implements</span></span>
<span class="line"><span>        WebServerFactoryCustomizer&lt;​TomcatServletWebServerFactory&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void customize(TomcatServletWebServerFactory factory) {</span></span>
<span class="line"><span>        factory.setPort(8081);</span></span>
<span class="line"><span>        factory.setContextPath(&quot;/hello&quot;);</span></span>
<span class="line"><span>        factory.addEngineValves(new TraceValve() );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="本期精华" tabindex="-1">本期精华 <a class="header-anchor" href="#本期精华" aria-label="Permalink to &quot;本期精华&quot;">​</a></h2><p>今天我们学习了Spring Boot如何利用Web容器的API来启动Web容器、如何向Web容器注册Servlet，以及如何定制化Web容器，除了给Web容器配置参数，还可以增加或者修改Web容器本身的组件。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>我在文章中提到，通过ServletContextInitializer接口可以向Web容器注册Servlet，那ServletContextInitializer跟Tomcat中的ServletContainerInitializer有什么区别和联系呢？</p><p>不知道今天的内容你消化得如何？如果还有疑问，请大胆的在留言区提问，也欢迎你把你的课后思考和心得记录下来，与我和其他同学一起讨论。如果你觉得今天有所收获，欢迎你把它分享给你的朋友。</p>`,49)])])}const g=s(p,[["render",l]]);export{b as __pageData,g as default};
