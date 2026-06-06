import{_ as a,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"20 | Spring框架：框架帮我们做了很多工作也带来了复杂度","description":"","frontmatter":{},"headers":[{"level":2,"title":"Feign AOP切不到的诡异案例","slug":"feign-aop切不到的诡异案例","link":"#feign-aop切不到的诡异案例","children":[]},{"level":2,"title":"Spring程序配置的优先级问题","slug":"spring程序配置的优先级问题","link":"#spring程序配置的优先级问题","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/20-Spring框架：框架帮我们做了很多工作也带来了复杂度.md","filePath":"Java业务开发常见错误100例/20-Spring框架：框架帮我们做了很多工作也带来了复杂度.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/20-Spring框架：框架帮我们做了很多工作也带来了复杂度.md"};function i(l,n,r,o,c,g){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_20-spring框架-框架帮我们做了很多工作也带来了复杂度" tabindex="-1">20 | Spring框架：框架帮我们做了很多工作也带来了复杂度 <a class="header-anchor" href="#_20-spring框架-框架帮我们做了很多工作也带来了复杂度" aria-label="Permalink to &quot;20 | Spring框架：框架帮我们做了很多工作也带来了复杂度&quot;">​</a></h1><p>你好，我是朱晔。今天，我们聊聊Spring框架给业务代码带来的复杂度，以及与之相关的坑。</p><p>在上一讲，通过AOP实现统一的监控组件的案例，我们看到了IoC和AOP配合使用的威力：当对象由Spring容器管理成为Bean之后，我们不但可以通过容器管理配置Bean的属性，还可以方便地对感兴趣的方法做AOP。</p><p>不过，前提是对象必须是Bean。你可能会觉得这个结论很明显，也很容易理解啊。但就和上一讲提到的Bean默认是单例一样，理解起来简单，实践的时候却非常容易踩坑。其中原因，一方面是，理解Spring的体系结构和使用方式有一定曲线；另一方面是，Spring多年发展堆积起来的内部结构非常复杂，这也是更重要的原因。</p><p>在我看来，Spring框架内部的复杂度主要表现为三点：</p><ul><li>第一，Spring框架借助IoC和AOP的功能，实现了修改、拦截Bean的定义和实例的灵活性，因此真正执行的代码流程并不是串行的。</li><li>第二，Spring Boot根据当前依赖情况实现了自动配置，虽然省去了手动配置的麻烦，但也因此多了一些黑盒、提升了复杂度。</li><li>第三，Spring Cloud模块多版本也多，Spring Boot 1.x和2.x的区别也很大。如果要对Spring Cloud或Spring Boot进行二次开发的话，考虑兼容性的成本会很高。</li></ul><p>今天，我们就通过配置AOP切入Spring Cloud Feign组件失败、Spring Boot程序的文件配置被覆盖这两个案例，感受一下Spring的复杂度。我希望这一讲的内容，能帮助你面对Spring这个复杂框架出现的问题时，可以非常自信地找到解决方案。</p><h2 id="feign-aop切不到的诡异案例" tabindex="-1">Feign AOP切不到的诡异案例 <a class="header-anchor" href="#feign-aop切不到的诡异案例" aria-label="Permalink to &quot;Feign AOP切不到的诡异案例&quot;">​</a></h2><p>我曾遇到过这么一个案例：使用Spring Cloud做微服务调用，为方便统一处理Feign，想到了用AOP实现，即使用within指示器匹配feign.Client接口的实现进行AOP切入。</p><p>代码如下，通过@Before注解在执行方法前打印日志，并在代码中定义了一个标记了@FeignClient注解的Client类，让其成为一个Feign接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//测试Feign</span></span>
<span class="line"><span>&amp;#64;FeignClient(name = &quot;client&quot;)</span></span>
<span class="line"><span>public interface Client {</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;/feignaop/server&quot;)</span></span>
<span class="line"><span>    String api();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//AOP切入feign.Client的实现</span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class WrongAspect {</span></span>
<span class="line"><span>    &amp;#64;Before(&quot;within(feign.Client+)&quot;)</span></span>
<span class="line"><span>    public void before(JoinPoint pjp) {</span></span>
<span class="line"><span>        log.info(&quot;within(feign.Client+) pjp {}, args:{}&quot;, pjp, pjp.getArgs());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//配置扫描Feign</span></span>
<span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;EnableFeignClients(basePackages = &quot;org.geekbang.time.commonmistakes.spring.demo4.feign&quot;)</span></span>
<span class="line"><span>public class Config {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过Feign调用服务后可以看到日志中有输出，的确实现了feign.Client的切入，切入的是execute方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[15:48:32.850] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo4.WrongAspect        :20  ] - within(feign.Client+) pjp execution(Response feign.Client.execute(Request,Options)), args:[GET http://client/feignaop/server HTTP/1.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Binary data, feign.Request$Options&amp;#64;5c16561a]</span></span></code></pre></div><p>一开始这个项目使用的是客户端的负载均衡，也就是让Ribbon来做负载均衡，代码没啥问题。后来因为后端服务通过Nginx实现服务端负载均衡，所以开发同学把@FeignClient的配置设置了URL属性，直接通过一个固定URL调用后端服务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;FeignClient(name = &quot;anotherClient&quot;,url = &quot;http://localhost:45678&quot;)</span></span>
<span class="line"><span>public interface ClientWithUrl {</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;/feignaop/server&quot;)</span></span>
<span class="line"><span>    String api();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但这样配置后，之前的AOP切面竟然失效了，也就是within(feign.Client+)无法切入ClientWithUrl的调用了。</p><p>为了还原这个场景，我写了一段代码，定义两个方法分别通过Client和ClientWithUrl这两个Feign进行接口调用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>private Client client;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>private ClientWithUrl clientWithUrl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;client&quot;)</span></span>
<span class="line"><span>public String client() {</span></span>
<span class="line"><span>    return client.api();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;clientWithUrl&quot;)</span></span>
<span class="line"><span>public String clientWithUrl() {</span></span>
<span class="line"><span>    return clientWithUrl.api();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，调用Client后AOP有日志输出，调用ClientWithUrl后却没有：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[15:50:32.850] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo4.WrongAspect        :20  ] - within(feign.Client+) pjp execution(Response feign.Client.execute(Request,Options)), args:[GET http://client/feignaop/server HTTP/1.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Binary data, feign.Request$Options&amp;#64;5c16561</span></span></code></pre></div><p>这就很费解了。难道为Feign指定了URL，其实现就不是feign.Clinet了吗？</p><p>要明白原因，我们需要分析一下FeignClient的创建过程，也就是分析FeignClientFactoryBean类的getTarget方法。源码第4行有一个if判断，当URL没有内容也就是为空或者不配置时调用loadBalance方法，在其内部通过FeignContext从容器获取feign.Client的实例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;T&amp;gt; T getTarget() {</span></span>
<span class="line"><span>	FeignContext context = this.applicationContext.getBean(FeignContext.class);</span></span>
<span class="line"><span>	Feign.Builder builder = feign(context);</span></span>
<span class="line"><span>	if (!StringUtils.hasText(this.url)) {</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>		return (T) loadBalance(builder, context,</span></span>
<span class="line"><span>				new HardCodedTarget&amp;lt;&amp;gt;(this.type, this.name, this.url));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	...</span></span>
<span class="line"><span>	String url = this.url + cleanPath();</span></span>
<span class="line"><span>	Client client = getOptional(context, Client.class);</span></span>
<span class="line"><span>	if (client != null) {</span></span>
<span class="line"><span>		if (client instanceof LoadBalancerFeignClient) {</span></span>
<span class="line"><span>			// not load balancing because we have a url,</span></span>
<span class="line"><span>			// but ribbon is on the classpath, so unwrap</span></span>
<span class="line"><span>			client = ((LoadBalancerFeignClient) client).getDelegate();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		builder.client(client);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>protected &amp;lt;T&amp;gt; T loadBalance(Feign.Builder builder, FeignContext context,</span></span>
<span class="line"><span>		HardCodedTarget&amp;lt;T&amp;gt; target) {</span></span>
<span class="line"><span>	Client client = getOptional(context, Client.class);</span></span>
<span class="line"><span>	if (client != null) {</span></span>
<span class="line"><span>		builder.client(client);</span></span>
<span class="line"><span>		Targeter targeter = get(context, Targeter.class);</span></span>
<span class="line"><span>		return targeter.target(this, builder, context, target);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>protected &amp;lt;T&amp;gt; T getOptional(FeignContext context, Class&amp;lt;T&amp;gt; type) {</span></span>
<span class="line"><span>	return context.getInstance(this.contextId, type);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调试一下可以看到，client是LoadBalanceFeignClient，已经是经过代理增强的，明显是一个Bean：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/0510e28cd764aaf7f1b4b4ca03049ffd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/0510e28cd764aaf7f1b4b4ca03049ffd.png" alt=""></a></p><p>所以，没有指定URL的@FeignClient对应的LoadBalanceFeignClient，是可以通过feign.Client切入的。</p><p>在我们上面贴出来的源码的16行可以看到，当URL不为空的时候，client设置为了LoadBalanceFeignClient的delegate属性。其原因注释中有提到，因为有了URL就不需要客户端负载均衡了，但因为Ribbon在classpath中，所以需要从LoadBalanceFeignClient提取出真正的Client。断点调试下可以看到，这时client是一个ApacheHttpClient：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/1b872a900be7327f74bc09bde4c54230.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/1b872a900be7327f74bc09bde4c54230.png" alt=""></a></p><p>那么，这个ApacheHttpClient是从哪里来的呢？这里，我教你一个小技巧：如果你希望知道一个类是怎样调用栈初始化的，可以在构造方法中设置一个断点进行调试。这样，你就可以在IDE的栈窗口看到整个方法调用栈，然后点击每一个栈帧看到整个过程。</p><p>用这种方式，我们可以看到，是HttpClientFeignLoadBalancedConfiguration类实例化的ApacheHttpClient：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/7b712acf6d7062ae82f1fd04b954ff9a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/7b712acf6d7062ae82f1fd04b954ff9a.png" alt=""></a></p><p>进一步查看HttpClientFeignLoadBalancedConfiguration的源码可以发现，LoadBalancerFeignClient这个Bean在实例化的时候，new出来一个ApacheHttpClient作为delegate放到了LoadBalancerFeignClient中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>&amp;#64;ConditionalOnMissingBean(Client.class)</span></span>
<span class="line"><span>public Client feignClient(CachingSpringLoadBalancerFactory cachingFactory,</span></span>
<span class="line"><span>      SpringClientFactory clientFactory, HttpClient httpClient) {</span></span>
<span class="line"><span>   ApacheHttpClient delegate = new ApacheHttpClient(httpClient);</span></span>
<span class="line"><span>   return new LoadBalancerFeignClient(delegate, cachingFactory, clientFactory);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public LoadBalancerFeignClient(Client delegate,</span></span>
<span class="line"><span>      CachingSpringLoadBalancerFactory lbClientFactory,</span></span>
<span class="line"><span>      SpringClientFactory clientFactory) {</span></span>
<span class="line"><span>   this.delegate = delegate;</span></span>
<span class="line"><span>   this.lbClientFactory = lbClientFactory;</span></span>
<span class="line"><span>   this.clientFactory = clientFactory;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>显然，ApacheHttpClient是new出来的，并不是Bean，而LoadBalancerFeignClient是一个Bean。</p><p>有了这个信息，我们再来捋一下，为什么within(feign.Client+)无法切入设置过URL的@FeignClient ClientWithUrl：</p><ul><li>表达式声明的是切入feign.Client的实现类。</li><li>Spring只能切入由自己管理的Bean。</li><li><strong>虽然LoadBalancerFeignClient和ApacheHttpClient都是feign.Client接口的实现，但是HttpClientFeignLoadBalancedConfiguration的自动配置只是把前者定义为Bean，后者是new出来的、作为了LoadBalancerFeignClient的delegate，不是Bean</strong>。</li><li>在定义了FeignClient的URL属性后，我们获取的是LoadBalancerFeignClient的delegate，它不是Bean。</li></ul><p>因此，定义了URL的FeignClient采用within(feign.Client+)无法切入。</p><p>那，如何解决这个问题呢？有一位同学提出，修改一下切点表达式，通过@FeignClient注解来切：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Before(&quot;&amp;#64;within(org.springframework.cloud.openfeign.FeignClient)&quot;)</span></span>
<span class="line"><span>public void before(JoinPoint pjp){</span></span>
<span class="line"><span>    log.info(&quot;&amp;#64;within(org.springframework.cloud.openfeign.FeignClient) pjp {}, args:{}&quot;, pjp, pjp.getArgs());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>修改后通过日志看到，AOP的确切成功了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[15:53:39.093] [http-nio-45678-exec-3] [INFO ] [o.g.t.c.spring.demo4.Wrong2Aspect       :17  ] - &amp;#64;within(org.springframework.cloud.openfeign.FeignClient) pjp execution(String org.geekbang.time.commonmistakes.spring.demo4.feign.ClientWithUrl.api()), args:[]</span></span></code></pre></div><p>但仔细一看就会发现， <strong>这次切入的是ClientWithUrl接口的API方法，并不是client.Feign接口的execute方法，显然不符合预期</strong>。</p><p>这位同学犯的错误是，没有弄清楚真正希望切的是什么对象。@FeignClient注解标记在Feign Client接口上，所以切的是Feign定义的接口，也就是每一个实际的API接口。而通过feign.Client接口切的是客户端实现类，切到的是通用的、执行所有Feign调用的execute方法。</p><p>那么问题来了，ApacheHttpClient不是Bean无法切入，切Feign接口本身又不符合要求。怎么办呢？</p><p>经过一番研究发现，ApacheHttpClient其实有机会独立成为Bean。查看HttpClientFeignConfiguration的源码可以发现，当没有ILoadBalancer类型的时候，自动装配会把ApacheHttpClient设置为Bean。</p><p>这么做的原因很明确，如果我们不希望做客户端负载均衡的话，应该不会引用Ribbon组件的依赖，自然没有LoadBalancerFeignClient，只有ApacheHttpClient：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;ConditionalOnClass(ApacheHttpClient.class)</span></span>
<span class="line"><span>&amp;#64;ConditionalOnMissingClass(&quot;com.netflix.loadbalancer.ILoadBalancer&quot;)</span></span>
<span class="line"><span>&amp;#64;ConditionalOnMissingBean(CloseableHttpClient.class)</span></span>
<span class="line"><span>&amp;#64;ConditionalOnProperty(value = &quot;feign.httpclient.enabled&quot;, matchIfMissing = true)</span></span>
<span class="line"><span>protected static class HttpClientFeignConfiguration {</span></span>
<span class="line"><span>	&amp;#64;Bean</span></span>
<span class="line"><span>	&amp;#64;ConditionalOnMissingBean(Client.class)</span></span>
<span class="line"><span>	public Client feignClient(HttpClient httpClient) {</span></span>
<span class="line"><span>		return new ApacheHttpClient(httpClient);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那，把pom.xml中的ribbon模块注释之后，是不是可以解决问题呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;groupId&amp;gt;org.springframework.cloud&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;artifactId&amp;gt;spring-cloud-starter-netflix-ribbon&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>但，问题并没解决，启动出错误了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Caused by: java.lang.IllegalArgumentException: Cannot subclass final class feign.httpclient.ApacheHttpClient</span></span>
<span class="line"><span>	at org.springframework.cglib.proxy.Enhancer.generateClass(Enhancer.java:657)</span></span>
<span class="line"><span>	at org.springframework.cglib.core.DefaultGeneratorStrategy.generate(DefaultGeneratorStrategy.java:25)</span></span></code></pre></div><p>这里，又涉及了Spring实现动态代理的两种方式：</p><ul><li>JDK动态代理，通过反射实现，只支持对实现接口的类进行代理；</li><li>CGLIB动态字节码注入方式，通过继承实现代理，没有这个限制。</li></ul><p><strong>Spring Boot 2.x默认使用CGLIB的方式，但通过继承实现代理有个问题是，无法继承final的类。因为，ApacheHttpClient类就是定义为了final</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class ApacheHttpClient implements Client {</span></span></code></pre></div><p>为解决这个问题，我们把配置参数proxy-target-class的值修改为false，以切换到使用JDK动态代理的方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.aop.proxy-target-class=false</span></span></code></pre></div><p>修改后执行clientWithUrl接口可以看到，通过within(feign.Client+)方式可以切入feign.Client子类了。以下日志显示了@within和within的两次切入：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[16:29:55.303] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo4.Wrong2Aspect       :16  ] - &amp;#64;within(org.springframework.cloud.openfeign.FeignClient) pjp execution(String org.geekbang.time.commonmistakes.spring.demo4.feign.ClientWithUrl.api()), args:[]</span></span>
<span class="line"><span>[16:29:55.310] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo4.WrongAspect        :15  ] - within(feign.Client+) pjp execution(Response feign.Client.execute(Request,Options)), args:[GET http://localhost:45678/feignaop/server HTTP/1.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Binary data, feign.Request$Options&amp;#64;387550b0]</span></span></code></pre></div><p>这下我们就明白了，Spring Cloud使用了自动装配来根据依赖装配组件，组件是否成为Bean决定了AOP是否可以切入，在尝试通过AOP切入Spring Bean的时候要注意。</p><p>加上上一讲的两个案例，我就把IoC和AOP相关的坑点和你说清楚了。除此之外，我们在业务开发时，还有一个绕不开的点是，Spring程序的配置问题。接下来，我们就具体看看吧。</p><h2 id="spring程序配置的优先级问题" tabindex="-1">Spring程序配置的优先级问题 <a class="header-anchor" href="#spring程序配置的优先级问题" aria-label="Permalink to &quot;Spring程序配置的优先级问题&quot;">​</a></h2><p>我们知道，通过配置文件application.properties，可以实现Spring Boot应用程序的参数配置。但我们可能不知道的是，Spring程序配置是有优先级的，即当两个不同的配置源包含相同的配置项时，其中一个配置项很可能会被覆盖掉。这，也是为什么我们会遇到些看似诡异的配置失效问题。</p><p>我们来通过一个实际案例，研究下配置源以及配置源的优先级问题。</p><p>对于Spring Boot应用程序，一般我们会通过设置management.server.port参数，来暴露独立的actuator管理端口。这样做更安全，也更方便监控系统统一监控程序是否健康。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management.server.port=45679</span></span></code></pre></div><p>有一天程序重新发布后，监控系统显示程序离线。但排查下来发现，程序是正常工作的，只是actuator管理端口的端口号被改了，不是配置文件中定义的45679了。</p><p>后来发现，运维同学在服务器上定义了两个环境变量MANAGEMENT_SERVER_IP和MANAGEMENT_SERVER_PORT，目的是方便监控Agent把监控数据上报到统一的管理服务上：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MANAGEMENT_SERVER_IP=192.168.0.2</span></span>
<span class="line"><span>MANAGEMENT_SERVER_PORT=12345</span></span></code></pre></div><p>问题就是出在这里。MANAGEMENT_SERVER_PORT覆盖了配置文件中的management.server.port，修改了应用程序本身的端口。当然，监控系统也就无法通过老的管理端口访问到应用的health端口了。如下图所示，actuator的端口号变成了12345：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/b287b7ad823a39bb604fa69e02c720e6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/b287b7ad823a39bb604fa69e02c720e6.png" alt=""></a></p><p>到这里坑还没完，为了方便用户登录，需要在页面上显示默认的管理员用户名，于是开发同学在配置文件中定义了一个user.name属性，并设置为defaultadminname：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>user.name=defaultadminname</span></span></code></pre></div><p>后来发现，程序读取出来的用户名根本就不是配置文件中定义的。这，又是咋回事？</p><p>带着这个问题，以及之前环境变量覆盖配置文件配置的问题，我们写段代码看看，从Spring中到底能读取到几个management.server.port和user.name配置项。</p><p>要想查询Spring中所有的配置，我们需要以环境Environment接口为入口。接下来，我就与你说说Spring通过环境Environment抽象出的Property和Profile：</p><ul><li>针对Property，又抽象出各种PropertySource类代表配置源。一个环境下可能有多个配置源，每个配置源中有诸多配置项。在查询配置信息时，需要按照配置源优先级进行查询。</li><li>Profile定义了场景的概念。通常，我们会定义类似dev、test、stage和prod等环境作为不同的Profile，用于按照场景对Bean进行逻辑归属。同时，Profile和配置文件也有关系，每个环境都有独立的配置文件，但我们只会激活某一个环境来生效特定环境的配置文件。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/2c68da94d31182cad34c965f878196c0.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/2c68da94d31182cad34c965f878196c0.png" alt=""></a></p><p>接下来，我们重点看看Property的查询过程。</p><p>对于非Web应用，Spring对于Environment接口的实现是StandardEnvironment类。我们通过Spring注入StandardEnvironment后循环getPropertySources获得的PropertySource，来查询所有的PropertySource中key是user.name或management.server.port的属性值；然后遍历getPropertySources方法，获得所有配置源并打印出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>private StandardEnvironment env;</span></span>
<span class="line"><span>&amp;#64;PostConstruct</span></span>
<span class="line"><span>public void init(){</span></span>
<span class="line"><span>    Arrays.asList(&quot;user.name&quot;, &quot;management.server.port&quot;).forEach(key -&amp;gt; {</span></span>
<span class="line"><span>         env.getPropertySources().forEach(propertySource -&amp;gt; {</span></span>
<span class="line"><span>                    if (propertySource.containsProperty(key)) {</span></span>
<span class="line"><span>                        log.info(&quot;{} -&amp;gt; {} 实际取值：{}&quot;, propertySource, propertySource.getProperty(key), env.getProperty(key));</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&quot;配置优先级：&quot;);</span></span>
<span class="line"><span>    env.getPropertySources().stream().forEach(System.out::println);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们研究下输出的日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2020-01-15 16:08:34.054  INFO 40123 --- [           main] o.g.t.c.s.d.CommonMistakesApplication    : ConfigurationPropertySourcesPropertySource {name=&#39;configurationProperties&#39;} -&amp;gt; zhuye 实际取值：zhuye</span></span>
<span class="line"><span>2020-01-15 16:08:34.054  INFO 40123 --- [           main] o.g.t.c.s.d.CommonMistakesApplication    : PropertiesPropertySource {name=&#39;systemProperties&#39;} -&amp;gt; zhuye 实际取值：zhuye</span></span>
<span class="line"><span>2020-01-15 16:08:34.054  INFO 40123 --- [           main] o.g.t.c.s.d.CommonMistakesApplication    : OriginTrackedMapPropertySource {name=&#39;applicationConfig: [classpath:/application.properties]&#39;} -&amp;gt; defaultadminname 实际取值：zhuye</span></span>
<span class="line"><span>2020-01-15 16:08:34.054  INFO 40123 --- [           main] o.g.t.c.s.d.CommonMistakesApplication    : ConfigurationPropertySourcesPropertySource {name=&#39;configurationProperties&#39;} -&amp;gt; 12345 实际取值：12345</span></span>
<span class="line"><span>2020-01-15 16:08:34.054  INFO 40123 --- [           main] o.g.t.c.s.d.CommonMistakesApplication    : OriginAwareSystemEnvironmentPropertySource {name=&#39;&#39;} -&amp;gt; 12345 实际取值：12345</span></span>
<span class="line"><span>2020-01-15 16:08:34.054  INFO 40123 --- [           main] o.g.t.c.s.d.CommonMistakesApplication    : OriginTrackedMapPropertySource {name=&#39;applicationConfig: [classpath:/application.properties]&#39;} -&amp;gt; 45679 实际取值：12345</span></span>
<span class="line"><span>配置优先级：</span></span>
<span class="line"><span>ConfigurationPropertySourcesPropertySource {name=&#39;configurationProperties&#39;}</span></span>
<span class="line"><span>StubPropertySource {name=&#39;servletConfigInitParams&#39;}</span></span>
<span class="line"><span>ServletContextPropertySource {name=&#39;servletContextInitParams&#39;}</span></span>
<span class="line"><span>PropertiesPropertySource {name=&#39;systemProperties&#39;}</span></span>
<span class="line"><span>OriginAwareSystemEnvironmentPropertySource {name=&#39;systemEnvironment&#39;}</span></span>
<span class="line"><span>RandomValuePropertySource {name=&#39;random&#39;}</span></span>
<span class="line"><span>OriginTrackedMapPropertySource {name=&#39;applicationConfig: [classpath:/application.properties]&#39;}</span></span>
<span class="line"><span>MapPropertySource {name=&#39;springCloudClientHostInfo&#39;}</span></span>
<span class="line"><span>MapPropertySource {name=&#39;defaultProperties&#39;}</span></span></code></pre></div><ul><li>有三处定义了user.name：第一个是configurationProperties，值是zhuye；第二个是systemProperties，代表系统配置，值是zhuye；第三个是applicationConfig，也就是我们的配置文件，值是配置文件中定义的defaultadminname。</li><li>同样地，也有三处定义了management.server.port：第一个是configurationProperties，值是12345；第二个是systemEnvironment代表系统环境，值是12345；第三个是applicationConfig，也就是我们的配置文件，值是配置文件中定义的45679。</li><li>第7到16行的输出显示，Spring中有9个配置源，值得关注是ConfigurationPropertySourcesPropertySource、PropertiesPropertySource、OriginAwareSystemEnvironmentPropertySource和我们的配置文件。</li></ul><p>那么，Spring真的是按这个顺序查询配置吗？最前面的configurationProperties，又是什么？为了回答这2个问题，我们需要分析下源码。我先说明下，下面源码分析的逻辑有些复杂，你可以结合着下面的整体流程图来理解：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/3e6dc6456f6d1354da58fb260775c0f9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/3e6dc6456f6d1354da58fb260775c0f9.png" alt=""></a></p><p>Demo中注入的StandardEnvironment，继承的是AbstractEnvironment（图中紫色类）。AbstractEnvironment的源码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractEnvironment implements ConfigurableEnvironment {</span></span>
<span class="line"><span>	private final MutablePropertySources propertySources = new MutablePropertySources();</span></span>
<span class="line"><span>	private final ConfigurablePropertyResolver propertyResolver =</span></span>
<span class="line"><span>			new PropertySourcesPropertyResolver(this.propertySources);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public String getProperty(String key) {</span></span>
<span class="line"><span>		return this.propertyResolver.getProperty(key);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到：</p><ul><li>MutablePropertySources类型的字段propertySources，看起来代表了所有配置源；</li><li>getProperty方法，通过PropertySourcesPropertyResolver类进行查询配置；</li><li>实例化PropertySourcesPropertyResolver的时候，传入了当前的MutablePropertySources。</li></ul><p>接下来，我们继续分析MutablePropertySources和PropertySourcesPropertyResolver。先看看MutablePropertySources的源码（图中蓝色类）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MutablePropertySources implements PropertySources {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private final List&amp;lt;PropertySource&amp;lt;?&amp;gt;&amp;gt; propertySourceList = new CopyOnWriteArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void addFirst(PropertySource&amp;lt;?&amp;gt; propertySource) {</span></span>
<span class="line"><span>		removeIfPresent(propertySource);</span></span>
<span class="line"><span>		this.propertySourceList.add(0, propertySource);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	public void addLast(PropertySource&amp;lt;?&amp;gt; propertySource) {</span></span>
<span class="line"><span>		removeIfPresent(propertySource);</span></span>
<span class="line"><span>		this.propertySourceList.add(propertySource);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	public void addBefore(String relativePropertySourceName, PropertySource&amp;lt;?&amp;gt; propertySource) {</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>		int index = assertPresentAndGetIndex(relativePropertySourceName);</span></span>
<span class="line"><span>		addAtIndex(index, propertySource);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    public void addAfter(String relativePropertySourceName, PropertySource&amp;lt;?&amp;gt; propertySource) {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       int index = assertPresentAndGetIndex(relativePropertySourceName);</span></span>
<span class="line"><span>       addAtIndex(index + 1, propertySource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private void addAtIndex(int index, PropertySource&amp;lt;?&amp;gt; propertySource) {</span></span>
<span class="line"><span>       removeIfPresent(propertySource);</span></span>
<span class="line"><span>       this.propertySourceList.add(index, propertySource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以发现：</p><ul><li>propertySourceList字段用来真正保存PropertySource的List，且这个List是一个CopyOnWriteArrayList。</li><li>类中定义了addFirst、addLast、addBefore、addAfter等方法，来精确控制PropertySource加入propertySourceList的顺序。这也说明了顺序的重要性。</li></ul><p>继续看下PropertySourcesPropertyResolver（图中绿色类）的源码，找到真正查询配置的方法getProperty。</p><p>这里，我们重点看一下第9行代码：遍历的propertySources是PropertySourcesPropertyResolver构造方法传入的，再结合AbstractEnvironment的源码可以发现，这个propertySources正是AbstractEnvironment中的MutablePropertySources对象。遍历时，如果发现配置源中有对应的Key值，则使用这个值。因此，MutablePropertySources中配置源的次序尤为重要。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class PropertySourcesPropertyResolver extends AbstractPropertyResolver {</span></span>
<span class="line"><span>	private final PropertySources propertySources;</span></span>
<span class="line"><span>	public PropertySourcesPropertyResolver(&amp;#64;Nullable PropertySources propertySources) {</span></span>
<span class="line"><span>		this.propertySources = propertySources;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	protected &amp;lt;T&amp;gt; T getProperty(String key, Class&amp;lt;T&amp;gt; targetValueType, boolean resolveNestedPlaceholders) {</span></span>
<span class="line"><span>		if (this.propertySources != null) {</span></span>
<span class="line"><span>			for (PropertySource&amp;lt;?&amp;gt; propertySource : this.propertySources) {</span></span>
<span class="line"><span>				if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>					logger.trace(&quot;Searching for key &#39;&quot; + key + &quot;&#39; in PropertySource &#39;&quot; +</span></span>
<span class="line"><span>							propertySource.getName() + &quot;&#39;&quot;);</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>				Object value = propertySource.getProperty(key);</span></span>
<span class="line"><span>				if (value != null) {</span></span>
<span class="line"><span>					if (resolveNestedPlaceholders &amp;&amp; value instanceof String) {</span></span>
<span class="line"><span>						value = resolveNestedPlaceholders((String) value);</span></span>
<span class="line"><span>					}</span></span>
<span class="line"><span>					logKeyFound(key, propertySource, value);</span></span>
<span class="line"><span>					return convertValueIfNecessary(value, targetValueType);</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>回到之前的问题，在查询所有配置源的时候，我们注意到处在第一位的是ConfigurationPropertySourcesPropertySource，这是什么呢？</p><p>其实，它不是一个实际存在的配置源，扮演的是一个代理的角色。但通过调试你会发现，我们获取的值竟然是由它提供并且返回的，且没有循环遍历后面的PropertySource：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/7380c93e743e3fc41d8cc58b77895bfb.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/7380c93e743e3fc41d8cc58b77895bfb.png" alt=""></a></p><p>继续查看ConfigurationPropertySourcesPropertySource（图中红色类）的源码可以发现，getProperty方法其实是通过findConfigurationProperty方法查询配置的。如第25行代码所示，这其实还是在遍历所有的配置源：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class ConfigurationPropertySourcesPropertySource extends PropertySource&amp;lt;Iterable&amp;lt;ConfigurationPropertySource&amp;gt;&amp;gt;</span></span>
<span class="line"><span>		implements OriginLookup&amp;lt;String&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ConfigurationPropertySourcesPropertySource(String name, Iterable&amp;lt;ConfigurationPropertySource&amp;gt; source) {</span></span>
<span class="line"><span>		super(name, source);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public Object getProperty(String name) {</span></span>
<span class="line"><span>		ConfigurationProperty configurationProperty = findConfigurationProperty(name);</span></span>
<span class="line"><span>		return (configurationProperty != null) ? configurationProperty.getValue() : null;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	private ConfigurationProperty findConfigurationProperty(String name) {</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			return findConfigurationProperty(ConfigurationPropertyName.of(name, true));</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		catch (Exception ex) {</span></span>
<span class="line"><span>			return null;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	private ConfigurationProperty findConfigurationProperty(ConfigurationPropertyName name) {</span></span>
<span class="line"><span>		if (name == null) {</span></span>
<span class="line"><span>			return null;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		for (ConfigurationPropertySource configurationPropertySource : getSource()) {</span></span>
<span class="line"><span>			ConfigurationProperty configurationProperty = configurationPropertySource.getConfigurationProperty(name);</span></span>
<span class="line"><span>			if (configurationProperty != null) {</span></span>
<span class="line"><span>				return configurationProperty;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return null;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调试可以发现，这个循环遍历（getSource()的结果）的配置源，其实是SpringConfigurationPropertySources（图中黄色类），其中包含的配置源列表就是之前看到的9个配置源，而第一个就是ConfigurationPropertySourcesPropertySource。看到这里，我们的第一感觉是会不会产生死循环，它在遍历的时候怎么排除自己呢？</p><p>同时观察configurationProperty可以看到，这个ConfigurationProperty其实类似代理的角色，实际配置是从系统属性中获得的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/9551d5b5acada84262b7ddeae989750a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/9551d5b5acada84262b7ddeae989750a.png" alt=""></a></p><p>继续查看SpringConfigurationPropertySources可以发现，它返回的迭代器是内部类SourcesIterator，在fetchNext方法获取下一个项时，通过isIgnored方法排除了ConfigurationPropertySourcesPropertySource（源码第38行）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SpringConfigurationPropertySources implements Iterable&amp;lt;ConfigurationPropertySource&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private final Iterable&amp;lt;PropertySource&amp;lt;?&amp;gt;&amp;gt; sources;</span></span>
<span class="line"><span>	private final Map&amp;lt;PropertySource&amp;lt;?&amp;gt;, ConfigurationPropertySource&amp;gt; cache = new ConcurrentReferenceHashMap&amp;lt;&amp;gt;(16,</span></span>
<span class="line"><span>			ReferenceType.SOFT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	SpringConfigurationPropertySources(Iterable&amp;lt;PropertySource&amp;lt;?&amp;gt;&amp;gt; sources) {</span></span>
<span class="line"><span>		Assert.notNull(sources, &quot;Sources must not be null&quot;);</span></span>
<span class="line"><span>		this.sources = sources;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public Iterator&amp;lt;ConfigurationPropertySource&amp;gt; iterator() {</span></span>
<span class="line"><span>		return new SourcesIterator(this.sources.iterator(), this::adapt);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private static class SourcesIterator implements Iterator&amp;lt;ConfigurationPropertySource&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		&amp;#64;Override</span></span>
<span class="line"><span>		public boolean hasNext() {</span></span>
<span class="line"><span>			return fetchNext() != null;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		private ConfigurationPropertySource fetchNext() {</span></span>
<span class="line"><span>			if (this.next == null) {</span></span>
<span class="line"><span>				if (this.iterators.isEmpty()) {</span></span>
<span class="line"><span>					return null;</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>				if (!this.iterators.peek().hasNext()) {</span></span>
<span class="line"><span>					this.iterators.pop();</span></span>
<span class="line"><span>					return fetchNext();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>				PropertySource&amp;lt;?&amp;gt; candidate = this.iterators.peek().next();</span></span>
<span class="line"><span>				if (candidate.getSource() instanceof ConfigurableEnvironment) {</span></span>
<span class="line"><span>					push((ConfigurableEnvironment) candidate.getSource());</span></span>
<span class="line"><span>					return fetchNext();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>				if (isIgnored(candidate)) {</span></span>
<span class="line"><span>					return fetchNext();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>				this.next = this.adapter.apply(candidate);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			return this.next;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		private void push(ConfigurableEnvironment environment) {</span></span>
<span class="line"><span>			this.iterators.push(environment.getPropertySources().iterator());</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		private boolean isIgnored(PropertySource&amp;lt;?&amp;gt; candidate) {</span></span>
<span class="line"><span>			return (candidate instanceof StubPropertySource</span></span>
<span class="line"><span>					|| candidate instanceof ConfigurationPropertySourcesPropertySource);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们已经了解了ConfigurationPropertySourcesPropertySource是所有配置源中的第一个，实现了对PropertySourcesPropertyResolver中遍历逻辑的“劫持”，并且知道了其遍历逻辑。最后一个问题是，它如何让自己成为第一个配置源呢？</p><p>再次运用之前我们学到的那个小技巧，来查看实例化ConfigurationPropertySourcesPropertySource的地方：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/f43c15a2f491d88a0383023a42cebd5d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227918/f43c15a2f491d88a0383023a42cebd5d.png" alt=""></a></p><p>可以看到，ConfigurationPropertySourcesPropertySource类是由ConfigurationPropertySources的attach方法实例化的。查阅源码可以发现，这个方法的确从环境中获得了原始的MutablePropertySources，把自己加入成为一个元素：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class ConfigurationPropertySources {</span></span>
<span class="line"><span>	public static void attach(Environment environment) {</span></span>
<span class="line"><span>		MutablePropertySources sources = ((ConfigurableEnvironment) environment).getPropertySources();</span></span>
<span class="line"><span>		PropertySource&amp;lt;?&amp;gt; attached = sources.get(ATTACHED_PROPERTY_SOURCE_NAME);</span></span>
<span class="line"><span>		if (attached == null) {</span></span>
<span class="line"><span>			sources.addFirst(new ConfigurationPropertySourcesPropertySource(ATTACHED_PROPERTY_SOURCE_NAME,</span></span>
<span class="line"><span>					new SpringConfigurationPropertySources(sources)));</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而这个attach方法，是Spring应用程序启动时准备环境的时候调用的。在SpringApplication的run方法中调用了prepareEnvironment方法，然后又调用了ConfigurationPropertySources.attach方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SpringApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public ConfigurableApplicationContext run(String... args) {</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);</span></span>
<span class="line"><span>			ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);</span></span>
<span class="line"><span>			...</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	private ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners,</span></span>
<span class="line"><span>			ApplicationArguments applicationArguments) {</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>		ConfigurationPropertySources.attach(environment);</span></span>
<span class="line"><span>		...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到这里你是否彻底理清楚Spring劫持PropertySourcesPropertyResolver的实现方式，以及配置源有优先级的原因了呢？如果你想知道Spring各种预定义的配置源的优先级，可以参考 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config" target="_blank" rel="noreferrer">官方文档</a>。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我用两个业务开发中的实际案例，带你进一步学习了Spring的AOP和配置优先级这两大知识点。现在，你应该也感受到Spring实现的复杂度了。</p><p>对于AOP切Feign的案例，我们在实现功能时走了一些弯路。Spring Cloud会使用Spring Boot的特性，根据当前引入包的情况做各种自动装配。如果我们要扩展Spring的组件，那么只有清晰了解Spring自动装配的运作方式，才能鉴别运行时对象在Spring容器中的情况，不能想当然认为代码中能看到的所有Spring的类都是Bean。</p><p>对于配置优先级的案例，分析配置源优先级时，如果我们以为看到PropertySourcesPropertyResolver就看到了真相，后续进行扩展开发时就可能会踩坑。我们一定要注意， <strong>分析Spring源码时，你看到的表象不一定是实际运行时的情况，还需要借助日志或调试工具来理清整个过程</strong>。如果没有调试工具，你可以借助 <a href="https://time.geekbang.org/column/article/216830" target="_blank" rel="noreferrer">第11讲</a> 用到的Arthas，来分析代码调用路径。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>除了我们这两讲用到execution、within、@within、@annotation四个指示器外，Spring AOP还支持this、target、args、@target、@args。你能说说后面五种指示器的作用吗？</li><li>Spring的Environment中的PropertySources属性可以包含多个PropertySource，越往前优先级越高。那，我们能否利用这个特点实现配置文件中属性值的自动赋值呢？比如，我们可以定义%%MYSQL.URL%%、%%MYSQL.USERNAME%%和%%MYSQL.PASSWORD%%，分别代表数据库连接字符串、用户名和密码。在配置数据源时，我们只要设置其值为占位符，框架就可以自动根据当前应用程序名application.name，统一把占位符替换为真实的数据库信息。这样，生产的数据库信息就不需要放在配置文件中了，会更安全。</li></ol><p>关于Spring Core、Spring Boot和Spring Cloud，你还遇到过其他坑吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,123)])])}const h=a(t,[["render",i]]);export{d as __pageData,h as default};
