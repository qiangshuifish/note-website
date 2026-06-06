import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"24 | 业务代码写完，就意味着生产就绪了？","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备工作：配置Spring Boot Actuator","slug":"准备工作-配置spring-boot-actuator","link":"#准备工作-配置spring-boot-actuator","children":[]},{"level":2,"title":"健康检测需要触达关键组件","slug":"健康检测需要触达关键组件","link":"#健康检测需要触达关键组件","children":[]},{"level":2,"title":"对外暴露应用内部重要组件的状态","slug":"对外暴露应用内部重要组件的状态","link":"#对外暴露应用内部重要组件的状态","children":[]},{"level":2,"title":"指标Metrics是快速定位问题的“金钥匙”","slug":"指标metrics是快速定位问题的-金钥匙","link":"#指标metrics是快速定位问题的-金钥匙","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/24-业务代码写完，就意味着生产就绪了？.md","filePath":"Java业务开发常见错误100例/24-业务代码写完，就意味着生产就绪了？.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/24-业务代码写完，就意味着生产就绪了？.md"};function i(l,a,o,r,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_24-业务代码写完-就意味着生产就绪了" tabindex="-1">24 | 业务代码写完，就意味着生产就绪了？ <a class="header-anchor" href="#_24-业务代码写完-就意味着生产就绪了" aria-label="Permalink to &quot;24 | 业务代码写完，就意味着生产就绪了？&quot;">​</a></h1><p>你好，我是朱晔。今天，我们来聊聊业务代码写完，是不是就意味着生产就绪，可以直接投产了。</p><p>所谓生产就绪（Production-ready），是指应用开发完成要投入生产环境，开发层面需要额外做的一些工作。在我看来，如果应用只是开发完成了功能代码，然后就直接投产，那意味着应用其实在裸奔。在这种情况下，遇到问题因为缺乏有效的监控导致无法排查定位问题，同时很可能遇到问题我们自己都不知道，需要依靠用户反馈才知道应用出了问题。</p><p>那么，生产就绪需要做哪些工作呢？我认为，以下三方面的工作最重要。</p><p>第一， <strong>提供健康检测接口</strong>。传统采用ping的方式对应用进行探活检测并不准确。有的时候，应用的关键内部或外部依赖已经离线，导致其根本无法正常工作，但其对外的Web端口或管理端口是可以ping通的。我们应该提供一个专有的监控检测接口，并尽可能触达一些内部组件。</p><p>第二， <strong>暴露应用内部信息</strong>。应用内部诸如线程池、内存队列等组件，往往在应用内部扮演了重要的角色，如果应用或应用框架可以对外暴露这些重要信息，并加以监控，那么就有可能在诸如OOM等重大问题暴露之前发现蛛丝马迹，避免出现更大的问题。</p><p>第三， <strong>建立应用指标Metrics监控</strong>。Metrics可以翻译为度量或者指标，指的是对于一些关键信息以可聚合的、数值的形式做定期统计，并绘制出各种趋势图表。这里的指标监控，包括两个方面：一是，应用内部重要组件的指标监控，比如JVM的一些指标、接口的QPS等；二是，应用的业务数据的监控，比如电商订单量、游戏在线人数等。</p><p>今天，我就通过实际案例，和你聊聊如何快速实现这三方面的工作。</p><h2 id="准备工作-配置spring-boot-actuator" tabindex="-1">准备工作：配置Spring Boot Actuator <a class="header-anchor" href="#准备工作-配置spring-boot-actuator" aria-label="Permalink to &quot;准备工作：配置Spring Boot Actuator&quot;">​</a></h2><p>Spring Boot有一个Actuator模块，封装了诸如健康检测、应用内部信息、Metrics指标等生产就绪的功能。今天这一讲后面的内容都是基于Actuator的，因此我们需要先完成Actuator的引入和配置。</p><p>我们可以像这样在pom中通过添加依赖的方式引入Actuator：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;spring-boot-starter-actuator&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>之后，你就可以直接使用Actuator了，但还要注意一些重要的配置：</p><ul><li>如果你不希望Web应用的Actuator管理端口和应用端口重合的话，可以使用management.server.port设置独立的端口。</li><li>Actuator自带了很多开箱即用提供信息的端点（Endpoint），可以通过JMX或Web两种方式进行暴露。考虑到有些信息比较敏感，这些内置的端点默认不是完全开启的，你可以通过 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints-exposing-endpoints" target="_blank" rel="noreferrer">官网</a> 查看这些默认值。在这里，为了方便后续Demo，我们设置所有端点通过Web方式开启。</li><li>默认情况下，Actuator的Web访问方式的根地址为/actuator，可以通过management.endpoints.web.base-path参数进行修改。我来演示下，如何将其修改为/admin。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management.server.port=45679</span></span>
<span class="line"><span>management.endpoints.web.exposure.include=*</span></span>
<span class="line"><span>management.endpoints.web.base-path=/admin</span></span></code></pre></div><p>现在，你就可以访问 <a href="http://localhost:45679/admin" target="_blank" rel="noreferrer">http://localhost:45679/admin</a> ，来查看Actuator的所有功能URL了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/420d5b3d9c10934e380e555c2347834b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/420d5b3d9c10934e380e555c2347834b.png" alt=""></a></p><p>其中，大部分端点提供的是只读信息，比如查询Spring的Bean、ConfigurableEnvironment、定时任务、SpringBoot自动配置、Spring MVC映射等；少部分端点还提供了修改功能，比如优雅关闭程序、下载线程Dump、下载堆Dump、修改日志级别等。</p><p>你可以访问 <a href="https://docs.spring.io/spring-boot/docs/2.2.4.RELEASE/actuator-api//html/" target="_blank" rel="noreferrer">这里</a>，查看所有这些端点的功能，详细了解它们提供的信息以及实现的操作。此外，我再分享一个不错的Spring Boot管理工具 <a href="https://github.com/codecentric/spring-boot-admin" target="_blank" rel="noreferrer">Spring Boot Admin</a>，它把大部分Actuator端点提供的功能封装为了Web UI。</p><h2 id="健康检测需要触达关键组件" tabindex="-1">健康检测需要触达关键组件 <a class="header-anchor" href="#健康检测需要触达关键组件" aria-label="Permalink to &quot;健康检测需要触达关键组件&quot;">​</a></h2><p>在这一讲开始我们提到，健康检测接口可以让监控系统或发布工具知晓应用的真实健康状态，比ping应用端口更可靠。不过，要达到这种效果最关键的是，我们能确保健康检测接口可以探查到关键组件的状态。</p><p>好在Spring Boot Actuator帮我们预先实现了诸如数据库、InfluxDB、Elasticsearch、Redis、RabbitMQ等三方系统的健康检测指示器HealthIndicator。</p><p>通过Spring Boot的自动配置，这些指示器会自动生效。当这些组件有问题的时候，HealthIndicator会返回DOWN或OUT_OF_SERVICE状态，health端点HTTP响应状态码也会变为503，我们可以以此来配置程序健康状态监控报警。</p><p>为了演示，我们可以修改配置文件，把management.endpoint.health.show-details参数设置为always，让所有用户都可以直接查看各个组件的健康情况（如果配置为when-authorized，那么可以结合management.endpoint.health.roles配置授权的角色）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management.endpoint.health.show-details=always</span></span></code></pre></div><p>访问health端点可以看到，数据库、磁盘、RabbitMQ、Redis等组件健康状态是UP，整个应用的状态也是UP：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/3c98443ebb76b65c4231aa35086dc8be.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/3c98443ebb76b65c4231aa35086dc8be.png" alt=""></a></p><p>在了解了基本配置之后，我们考虑一下，如果程序依赖一个很重要的三方服务，我们希望这个服务无法访问的时候，应用本身的健康状态也是DOWN。</p><p>比如三方服务有一个user接口，出现异常的概率是50%：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;user&quot;)</span></span>
<span class="line"><span>public class UserServiceController {</span></span>
<span class="line"><span>    &amp;#64;GetMapping</span></span>
<span class="line"><span>    public User getUser(&amp;#64;RequestParam(&quot;userId&quot;) long id) {</span></span>
<span class="line"><span>        //一半概率返回正确响应，一半概率抛异常</span></span>
<span class="line"><span>        if (ThreadLocalRandom.current().nextInt() % 2 == 0)</span></span>
<span class="line"><span>            return new User(id, &quot;name&quot; + id);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;error&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>要实现这个user接口是否正确响应和程序整体的健康状态挂钩的话，很简单，只需定义一个UserServiceHealthIndicator实现HealthIndicator接口即可。</p><p>在health方法中，我们通过RestTemplate来访问这个user接口，如果结果正确则返回Health.up()，并把调用执行耗时和结果作为补充信息加入Health对象中。如果调用接口出现异常，则返回Health.down()，并把异常信息作为补充信息加入Health对象中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class UserServiceHealthIndicator implements HealthIndicator {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private RestTemplate restTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Health health() {</span></span>
<span class="line"><span>        long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>        long userId = 1L;</span></span>
<span class="line"><span>        User user = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //访问远程接口</span></span>
<span class="line"><span>            user = restTemplate.getForObject(&quot;http://localhost:45678/user?userId=&quot; + userId, User.class);</span></span>
<span class="line"><span>            if (user != null &amp;&amp; user.getUserId() == userId) {</span></span>
<span class="line"><span>                //结果正确，返回UP状态，补充提供耗时和用户信息</span></span>
<span class="line"><span>                return Health.up()</span></span>
<span class="line"><span>                        .withDetail(&quot;user&quot;, user)</span></span>
<span class="line"><span>                        .withDetail(&quot;took&quot;, System.currentTimeMillis() - begin)</span></span>
<span class="line"><span>                        .build();</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                //结果不正确，返回DOWN状态，补充提供耗时</span></span>
<span class="line"><span>                return Health.down().withDetail(&quot;took&quot;, System.currentTimeMillis() - begin).build();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            //出现异常，先记录异常，然后返回DOWN状态，补充提供异常信息和耗时</span></span>
<span class="line"><span>            log.warn(&quot;health check failed!&quot;, ex);</span></span>
<span class="line"><span>            return Health.down(ex).withDetail(&quot;took&quot;, System.currentTimeMillis() - begin).build();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再来看一个聚合多个HealthIndicator的案例，也就是定义一个CompositeHealthContributor来聚合多个HealthContributor，实现一组线程池的监控。</p><p>首先，在ThreadPoolProvider中定义两个线程池，其中demoThreadPool是包含一个工作线程的线程池，类型是ArrayBlockingQueue，阻塞队列的长度为10；还有一个ioThreadPool模拟IO操作线程池，核心线程数10，最大线程数50：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadPoolProvider {</span></span>
<span class="line"><span>    //一个工作线程的线程池，队列长度10</span></span>
<span class="line"><span>    private static ThreadPoolExecutor demoThreadPool = new ThreadPoolExecutor(</span></span>
<span class="line"><span>            1, 1,</span></span>
<span class="line"><span>            2, TimeUnit.SECONDS,</span></span>
<span class="line"><span>            new ArrayBlockingQueue&amp;lt;&amp;gt;(10),</span></span>
<span class="line"><span>            new ThreadFactoryBuilder().setNameFormat(&quot;demo-threadpool-%d&quot;).get());</span></span>
<span class="line"><span>    //核心线程数10，最大线程数50的线程池，队列长度50</span></span>
<span class="line"><span>    private static ThreadPoolExecutor ioThreadPool = new ThreadPoolExecutor(</span></span>
<span class="line"><span>            10, 50,</span></span>
<span class="line"><span>            2, TimeUnit.SECONDS,</span></span>
<span class="line"><span>            new ArrayBlockingQueue&amp;lt;&amp;gt;(100),</span></span>
<span class="line"><span>            new ThreadFactoryBuilder().setNameFormat(&quot;io-threadpool-%d&quot;).get());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static ThreadPoolExecutor getDemoThreadPool() {</span></span>
<span class="line"><span>        return demoThreadPool;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static ThreadPoolExecutor getIOThreadPool() {</span></span>
<span class="line"><span>        return ioThreadPool;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们定义一个接口，来把耗时很长的任务提交到这个demoThreadPool线程池，以模拟线程池队列满的情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;slowTask&quot;)</span></span>
<span class="line"><span>public void slowTask() {</span></span>
<span class="line"><span>    ThreadPoolProvider.getDemoThreadPool().execute(() -&amp;gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            TimeUnit.HOURS.sleep(1);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>做了这些准备工作后，让我们来真正实现自定义的HealthIndicator类，用于单一线程池的健康状态。</p><p>我们可以传入一个ThreadPoolExecutor，通过判断队列剩余容量来确定这个组件的健康状态，有剩余量则返回UP，否则返回DOWN，并把线程池队列的两个重要数据，也就是当前队列元素个数和剩余量，作为补充信息加入Health：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadPoolHealthIndicator implements HealthIndicator {</span></span>
<span class="line"><span>    private ThreadPoolExecutor threadPool;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ThreadPoolHealthIndicator(ThreadPoolExecutor threadPool) {</span></span>
<span class="line"><span>        this.threadPool = threadPool;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Health health() {</span></span>
<span class="line"><span>        //补充信息</span></span>
<span class="line"><span>        Map&amp;lt;String, Integer&amp;gt; detail = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        //队列当前元素个数</span></span>
<span class="line"><span>        detail.put(&quot;queue_size&quot;, threadPool.getQueue().size());</span></span>
<span class="line"><span>        //队列剩余容量</span></span>
<span class="line"><span>        detail.put(&quot;queue_remaining&quot;, threadPool.getQueue().remainingCapacity());</span></span>
<span class="line"><span>        //如果还有剩余量则返回UP，否则返回DOWN</span></span>
<span class="line"><span>        if (threadPool.getQueue().remainingCapacity() &amp;gt; 0) {</span></span>
<span class="line"><span>            return Health.up().withDetails(detail).build();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return Health.down().withDetails(detail).build();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再定义一个CompositeHealthContributor，来聚合两个ThreadPoolHealthIndicator的实例，分别对应ThreadPoolProvider中定义的两个线程池：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class ThreadPoolsHealthContributor implements CompositeHealthContributor {</span></span>
<span class="line"><span>    //保存所有的子HealthContributor</span></span>
<span class="line"><span>    private Map&amp;lt;String, HealthContributor&amp;gt; contributors = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ThreadPoolsHealthContributor() {</span></span>
<span class="line"><span>        //对应ThreadPoolProvider中定义的两个线程池</span></span>
<span class="line"><span>        this.contributors.put(&quot;demoThreadPool&quot;, new ThreadPoolHealthIndicator(ThreadPoolProvider.getDemoThreadPool()));</span></span>
<span class="line"><span>        this.contributors.put(&quot;ioThreadPool&quot;, new ThreadPoolHealthIndicator(ThreadPoolProvider.getIOThreadPool()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public HealthContributor getContributor(String name) {</span></span>
<span class="line"><span>        //根据name找到某一个HealthContributor</span></span>
<span class="line"><span>        return contributors.get(name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Iterator&amp;lt;NamedContributor&amp;lt;HealthContributor&amp;gt;&amp;gt; iterator() {</span></span>
<span class="line"><span>        //返回NamedContributor的迭代器，NamedContributor也就是Contributor实例+一个命名</span></span>
<span class="line"><span>        return contributors.entrySet().stream()</span></span>
<span class="line"><span>                .map((entry) -&amp;gt; NamedContributor.of(entry.getKey(), entry.getValue())).iterator();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>程序启动后可以看到，health接口展现了线程池和外部服务userService的健康状态，以及一些具体信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/d2721794203dcabf411e15143e342cdc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/d2721794203dcabf411e15143e342cdc.png" alt=""></a></p><p>我们看到一个demoThreadPool为DOWN导致父threadPools为DOWN，进一步导致整个程序的status为DOWN：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/bc947b0c6d4a2a71987f16f16120eb54.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/bc947b0c6d4a2a71987f16f16120eb54.png" alt=""></a></p><p>以上，就是通过自定义HealthContributor和CompositeHealthContributor，来实现监控检测触达程序内部诸如三方服务、线程池等关键组件，是不是很方便呢？</p><p>额外补充一下， <a href="https://spring.io/blog/2020/03/25/liveness-and-readiness-probes-with-spring-boot" target="_blank" rel="noreferrer">Spring Boot 2.3.0</a> 增强了健康检测的功能，细化了Liveness和Readiness两个端点，便于Spring Boot应用程序和Kubernetes整合。</p><h2 id="对外暴露应用内部重要组件的状态" tabindex="-1">对外暴露应用内部重要组件的状态 <a class="header-anchor" href="#对外暴露应用内部重要组件的状态" aria-label="Permalink to &quot;对外暴露应用内部重要组件的状态&quot;">​</a></h2><p>除了可以把线程池的状态作为整个应用程序是否健康的依据外，我们还可以通过Actuator的InfoContributor功能，对外暴露程序内部重要组件的状态数据。这里，我会用一个例子演示使用info的HTTP端点、JMX MBean这两种方式，如何查看状态数据。</p><p>我们看一个具体案例，实现一个ThreadPoolInfoContributor来展现线程池的信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class ThreadPoolInfoContributor implements InfoContributor {</span></span>
<span class="line"><span>    private static Map threadPoolInfo(ThreadPoolExecutor threadPool) {</span></span>
<span class="line"><span>        Map&amp;lt;String, Object&amp;gt; info = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        info.put(&quot;poolSize&quot;, threadPool.getPoolSize());//当前池大小</span></span>
<span class="line"><span>        info.put(&quot;corePoolSize&quot;, threadPool.getCorePoolSize());//设置的核心池大小</span></span>
<span class="line"><span>        info.put(&quot;largestPoolSize&quot;, threadPool.getLargestPoolSize());//最大达到过的池大小</span></span>
<span class="line"><span>        info.put(&quot;maximumPoolSize&quot;, threadPool.getMaximumPoolSize());//设置的最大池大小</span></span>
<span class="line"><span>        info.put(&quot;completedTaskCount&quot;, threadPool.getCompletedTaskCount());//总完成任务数</span></span>
<span class="line"><span>        return info;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void contribute(Info.Builder builder) {</span></span>
<span class="line"><span>        builder.withDetail(&quot;demoThreadPool&quot;, threadPoolInfo(ThreadPoolProvider.getDemoThreadPool()));</span></span>
<span class="line"><span>        builder.withDetail(&quot;ioThreadPool&quot;, threadPoolInfo(ThreadPoolProvider.getIOThreadPool()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>访问/admin/info接口，可以看到这些数据：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/7ed02ed4d047293fe1287e82a6bf8041.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/7ed02ed4d047293fe1287e82a6bf8041.png" alt=""></a></p><p>此外，如果设置开启JMX的话：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.jmx.enabled=true</span></span></code></pre></div><p>可以通过jconsole工具，在org.springframework.boot.Endpoint中找到Info这个MBean，然后执行info操作可以看到，我们刚才自定义的InfoContributor输出的有关两个线程池的信息：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/f7c4dd062934be5ca9a5628e7c5d0714.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/f7c4dd062934be5ca9a5628e7c5d0714.png" alt=""></a></p><p>这里，我再额外补充一点。对于查看和操作MBean，除了使用jconsole之外，你可以使用jolokia把JMX转换为HTTP协议，引入依赖：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.jolokia&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;jolokia-core&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>然后，你就可以通过jolokia，来执行org.springframework.boot:type=Endpoint,name=Info这个MBean的info操作：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/f7a128cb3efc652b63b773fdceb65f7f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/f7a128cb3efc652b63b773fdceb65f7f.png" alt=""></a></p><h2 id="指标metrics是快速定位问题的-金钥匙" tabindex="-1">指标Metrics是快速定位问题的“金钥匙” <a class="header-anchor" href="#指标metrics是快速定位问题的-金钥匙" aria-label="Permalink to &quot;指标Metrics是快速定位问题的“金钥匙”&quot;">​</a></h2><p>指标是指一组和时间关联的、衡量某个维度能力的量化数值。通过收集指标并展现为曲线图、饼图等图表，可以帮助我们快速定位、分析问题。</p><p>我们通过一个实际的案例，来看看如何通过图表快速定位问题。</p><p>有一个外卖订单的下单和配送流程，如下图所示。OrderController进行下单操作，下单操作前先判断参数，如果参数正确调用另一个服务查询商户状态，如果商户在营业的话继续下单，下单成功后发一条消息到RabbitMQ进行异步配送流程；然后另一个DeliverOrderHandler监听这条消息进行配送操作。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/d45e1e97ce1f7881a5930e5eb6648351.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/d45e1e97ce1f7881a5930e5eb6648351.png" alt=""></a></p><p>对于这样一个涉及同步调用和异步调用的业务流程，如果用户反馈下单失败，那我们如何才能快速知道是哪个环节出了问题呢？</p><p>这时，指标体系就可以发挥作用了。我们可以分别为下单和配送这两个重要操作，建立一些指标进行监控。</p><p>对于下单操作，可以建立4个指标：</p><ul><li>下单总数量指标，监控整个系统当前累计的下单量；</li><li>下单请求指标，对于每次收到下单请求，在处理之前+1；</li><li>下单成功指标，每次下单成功完成+1；</li><li>下单失败指标，下单操作处理出现异常+1，并且把异常原因附加到指标上。</li></ul><p>对于配送操作，也是建立类似的4个指标。我们可以使用Micrometer框架实现指标的收集，它也是Spring Boot Actuator选用的指标框架。它实现了各种指标的抽象，常用的有三种：</p><ul><li><strong>gauge</strong>（红色），它反映的是指标当前的值，是多少就是多少，不能累计，比如本例中的下单总数量指标，又比如游戏的在线人数、JVM当前线程数都可以认为是gauge。</li><li><strong>counter</strong>（绿色），每次调用一次方法值增加1，是可以累计的，比如本例中的下单请求指标。举一个例子，如果5秒内我们调用了10次方法，Micrometer也是每隔5秒把指标发送给后端存储系统一次，那么它可以只发送一次值，其值为10。</li><li><strong>timer</strong>（蓝色），类似counter，只不过除了记录次数，还记录耗时，比如本例中的下单成功和下单失败两个指标。</li></ul><p>所有的指标还可以附加一些tags标签，作为补充数据。比如，当操作执行失败的时候，我们就会附加一个reason标签到指标上。</p><p>Micrometer除了抽象了指标外，还抽象了存储。你可以把Micrometer理解为类似SLF4J这样的框架，只不过后者针对日志抽象，而Micrometer是针对指标进行抽象。Micrometer通过引入各种registry，可以实现无缝对接各种监控系统或时间序列数据库。</p><p>在这个案例中，我们引入了micrometer-registry-influx依赖，目的是引入Micrometer的核心依赖，以及通过Micrometer对于 <a href="https://www.influxdata.com/products/influxdb-overview/" target="_blank" rel="noreferrer">InfluxDB</a>（InfluxDB是一个时间序列数据库，其专长是存储指标数据）的绑定，以实现指标数据可以保存到InfluxDB：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;io.micrometer&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;micrometer-registry-influx&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>然后，修改配置文件，启用指标输出到InfluxDB的开关、配置InfluxDB的地址，以及设置指标每秒在客户端聚合一次，然后发送到InfluxDB：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>management.metrics.export.influx.enabled=true</span></span>
<span class="line"><span>management.metrics.export.influx.uri=http://localhost:8086</span></span>
<span class="line"><span>management.metrics.export.influx.step=1S</span></span></code></pre></div><p>接下来，我们在业务逻辑中增加相关的代码来记录指标。</p><p>下面是OrderController的实现，代码中有详细注释，我就不一一说明了。你需要注意观察如何通过Micrometer框架，来实现下单总数量、下单请求、下单成功和下单失败这四个指标，分别对应代码的第17、25、43、47行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//下单操作，以及商户服务的接口</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;order&quot;)</span></span>
<span class="line"><span>public class OrderController {</span></span>
<span class="line"><span>    //总订单创建数量</span></span>
<span class="line"><span>    private AtomicLong createOrderCounter = new AtomicLong();</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private RabbitTemplate rabbitTemplate;</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private RestTemplate restTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;PostConstruct</span></span>
<span class="line"><span>    public void init() {</span></span>
<span class="line"><span>        //注册createOrder.received指标，gauge指标只需要像这样初始化一次，直接关联到AtomicLong引用即可</span></span>
<span class="line"><span>        Metrics.gauge(&quot;createOrder.totalSuccess&quot;, createOrderCounter);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //下单接口，提供用户ID和商户ID作为入参</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;createOrder&quot;)</span></span>
<span class="line"><span>    public void createOrder(&amp;#64;RequestParam(&quot;userId&quot;) long userId, &amp;#64;RequestParam(&quot;merchantId&quot;) long merchantId) {</span></span>
<span class="line"><span>        //记录一次createOrder.received指标，这是一个counter指标，表示收到下单请求</span></span>
<span class="line"><span>        Metrics.counter(&quot;createOrder.received&quot;).increment();</span></span>
<span class="line"><span>        Instant begin = Instant.now();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            TimeUnit.MILLISECONDS.sleep(200);</span></span>
<span class="line"><span>            //模拟无效用户的情况，ID&amp;lt;10为无效用户</span></span>
<span class="line"><span>            if (userId &amp;lt; 10)</span></span>
<span class="line"><span>                throw new RuntimeException(&quot;invalid user&quot;);</span></span>
<span class="line"><span>            //查询商户服务</span></span>
<span class="line"><span>            Boolean merchantStatus = restTemplate.getForObject(&quot;http://localhost:45678/order/getMerchantStatus?merchantId=&quot; + merchantId, Boolean.class);</span></span>
<span class="line"><span>            if (merchantStatus == null || !merchantStatus)</span></span>
<span class="line"><span>                throw new RuntimeException(&quot;closed merchant&quot;);</span></span>
<span class="line"><span>            Order order = new Order();</span></span>
<span class="line"><span>            order.setId(createOrderCounter.incrementAndGet()); //gauge指标可以得到自动更新</span></span>
<span class="line"><span>            order.setUserId(userId);</span></span>
<span class="line"><span>            order.setMerchantId(merchantId);</span></span>
<span class="line"><span>            //发送MQ消息</span></span>
<span class="line"><span>            rabbitTemplate.convertAndSend(Consts.EXCHANGE, Consts.ROUTING_KEY, order);</span></span>
<span class="line"><span>            //记录一次createOrder.success指标，这是一个timer指标，表示下单成功，同时提供耗时</span></span>
<span class="line"><span>            Metrics.timer(&quot;createOrder.success&quot;).record(Duration.between(begin, Instant.now()));</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            log.error(&quot;creareOrder userId {} failed&quot;, userId, ex);</span></span>
<span class="line"><span>            //记录一次createOrder.failed指标，这是一个timer指标，表示下单失败，同时提供耗时，并且以tag记录失败原因</span></span>
<span class="line"><span>            Metrics.timer(&quot;createOrder.failed&quot;, &quot;reason&quot;, ex.getMessage()).record(Duration.between(begin, Instant.now()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //商户查询接口</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;getMerchantStatus&quot;)</span></span>
<span class="line"><span>    public boolean getMerchantStatus(&amp;#64;RequestParam(&quot;merchantId&quot;) long merchantId) throws InterruptedException {</span></span>
<span class="line"><span>        //只有商户ID为2的商户才是营业的</span></span>
<span class="line"><span>        TimeUnit.MILLISECONDS.sleep(200);</span></span>
<span class="line"><span>        return merchantId == 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当用户ID&lt;10的时候，我们模拟用户数据无效的情况，当商户ID不为2的时候我们模拟商户不营业的情况。</p><p>接下来是DeliverOrderHandler配送服务的实现。</p><p>其中，deliverOrder方法监听OrderController发出的MQ消息模拟配送。如下代码所示，第17、25、32和36行代码，实现了配送相关四个指标的记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//配送服务消息处理程序</span></span>
<span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;deliver&quot;)</span></span>
<span class="line"><span>public class DeliverOrderHandler {</span></span>
<span class="line"><span>    //配送服务运行状态</span></span>
<span class="line"><span>    private volatile boolean deliverStatus = true;</span></span>
<span class="line"><span>    private AtomicLong deliverCounter = new AtomicLong();</span></span>
<span class="line"><span>    //通过一个外部接口来改变配送状态模拟配送服务停工</span></span>
<span class="line"><span>    &amp;#64;PostMapping(&quot;status&quot;)</span></span>
<span class="line"><span>    public void status(&amp;#64;RequestParam(&quot;status&quot;) boolean status) {</span></span>
<span class="line"><span>        deliverStatus = status;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;PostConstruct</span></span>
<span class="line"><span>    public void init() {</span></span>
<span class="line"><span>        //同样注册一个gauge指标deliverOrder.totalSuccess，代表总的配送单量，只需注册一次即可</span></span>
<span class="line"><span>        Metrics.gauge(&quot;deliverOrder.totalSuccess&quot;, deliverCounter);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //监听MQ消息</span></span>
<span class="line"><span>    &amp;#64;RabbitListener(queues = Consts.QUEUE_NAME)</span></span>
<span class="line"><span>    public void deliverOrder(Order order) {</span></span>
<span class="line"><span>        Instant begin = Instant.now();</span></span>
<span class="line"><span>        //对deliverOrder.received进行递增，代表收到一次订单消息，counter类型</span></span>
<span class="line"><span>        Metrics.counter(&quot;deliverOrder.received&quot;).increment();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            if (!deliverStatus)</span></span>
<span class="line"><span>                throw new RuntimeException(&quot;deliver outofservice&quot;);</span></span>
<span class="line"><span>            TimeUnit.MILLISECONDS.sleep(500);</span></span>
<span class="line"><span>            deliverCounter.incrementAndGet();</span></span>
<span class="line"><span>            //配送成功指标deliverOrder.success，timer类型</span></span>
<span class="line"><span>            Metrics.timer(&quot;deliverOrder.success&quot;).record(Duration.between(begin, Instant.now()));</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            log.error(&quot;deliver Order {} failed&quot;, order, ex);</span></span>
<span class="line"><span>            //配送失败指标deliverOrder.failed，同样附加了失败原因作为tags，timer类型</span></span>
<span class="line"><span>            Metrics.timer(&quot;deliverOrder.failed&quot;, &quot;reason&quot;, ex.getMessage()).record(Duration.between(begin, Instant.now()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同时，我们模拟了一个配送服务整体状态的开关，调用status接口可以修改其状态。至此，我们完成了场景准备，接下来开始配置指标监控。</p><p>首先，我们来 <a href="https://grafana.com/docs/grafana/latest/installation/" target="_blank" rel="noreferrer">安装Grafana</a>。然后进入Grafana配置一个InfluxDB数据源：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/e74a6f9ac6840974413486239eb4b796.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/e74a6f9ac6840974413486239eb4b796.jpg" alt=""></a></p><p>配置好数据源之后，就可以添加一个监控面板，然后在面板中添加各种监控图表。比如，我们在一个下单次数图表中添加了下单收到、成功和失败三个指标。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/b942d8bad647e10417acbc96ed289b25.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/b942d8bad647e10417acbc96ed289b25.jpg" alt=""></a></p><p>关于这张图中的配置：</p><ul><li>红色框数据源配置，选择刚才配置的数据源。</li><li>蓝色框FROM配置，选择我们的指标名。</li><li>绿色框SELECT配置，选择我们要查询的指标字段，也可以应用一些聚合函数。在这里，我们取count字段的值，然后使用sum函数进行求和。</li><li>紫色框GROUP BY配置，我们配置了按1分钟时间粒度和reason字段进行分组，这样指标的Y轴代表QPM（每分钟请求数），且每种失败的情况都会绘制单独的曲线。</li><li>黄色框ALIAS BY配置中设置了每一个指标的别名，在别名中引用了reason这个tag。</li></ul><p>使用Grafana配置InfluxDB指标的详细方式，你可以参考 <a href="https://grafana.com/docs/grafana/latest/features/datasources/influxdb/" target="_blank" rel="noreferrer">这里</a>。其中的FROM、SELECT、GROUP BY的含义和SQL类似，理解起来应该不困难。</p><p>类似地， 我们配置出一个完整的业务监控面板，包含之前实现的8个指标：</p><ul><li>配置2个Gauge图表分别呈现总订单完成次数、总配送完成次数。</li><li>配置4个Graph图表分别呈现下单操作的次数和性能，以及配送操作的次数和性能。</li></ul><p>下面我们进入实战，使用wrk针对四种情况进行压测，然后通过曲线来分析定位问题。</p><p><strong>第一种情况是，使用合法的用户ID和营业的商户ID运行一段时间：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wrk -t 1 -c 1 -d 3600s http://localhost:45678/order/createOrder\\?userId\\=20\\&amp;merchantId\\=2</span></span></code></pre></div><p><strong>从监控面板可以一目了然地看到整个系统的运作情况。</strong> 可以看到，目前系统运行良好，不管是下单还是配送操作都是成功的，且下单操作平均处理时间400ms、配送操作则是在500ms左右，符合预期（注意，下单次数曲线中的绿色和黄色两条曲线其实是重叠在一起的，表示所有下单都成功了）：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/117071b8d4f339eceaf50c87b6e69083.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/117071b8d4f339eceaf50c87b6e69083.png" alt=""></a></p><p><strong>第二种情况是，模拟无效用户ID运行一段时间</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wrk -t 1 -c 1 -d 3600s http://localhost:45678/order/createOrder\\?userId\\=2\\&amp;merchantId\\=2</span></span></code></pre></div><p>使用无效用户下单，显然会导致下单全部失败。接下来，我们就看看从监控图中是否能看到这个现象。</p><ul><li>绿色框可以看到，下单现在出现了invalid user这条蓝色的曲线，并和绿色收到下单请求的曲线是吻合的，表示所有下单都失败了，原因是无效用户错误，说明源头并没有问题。</li><li>红色框可以看到，虽然下单都是失败的，但是下单操作时间从400ms减少为200ms了，说明下单失败之前也消耗了200ms（和代码符合）。而因为下单失败操作的响应时间减半了，反而导致吞吐翻倍了。</li><li>观察两个配送监控可以发现，配送曲线出现掉0现象，是因为下单失败导致的，下单失败MQ消息压根就不会发出。再注意下蓝色那条线，可以看到配送曲线掉0延后于下单成功曲线的掉0，原因是配送走的是异步流程，虽然从某个时刻开始下单全部失败了，但是MQ队列中还有一些之前未处理的消息。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/536ce4dad0e8bc00aa6d9ad4ff285b5b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/536ce4dad0e8bc00aa6d9ad4ff285b5b.jpg" alt=""></a></p><p><strong>第三种情况是，尝试一下因为商户不营业导致的下单失败</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>wrk -t 1 -c 1 -d 3600s http://localhost:45678/order/createOrder\\?userId\\=20\\&amp;merchantId\\=1</span></span></code></pre></div><p>我把变化的地方圈了出来，你可以自己尝试分析一下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/4cf8d97266f5063550e5db57e61c73d4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/4cf8d97266f5063550e5db57e61c73d4.jpg" alt=""></a></p><p><strong>第四种情况是，配送停止</strong>。我们通过curl调用接口，来设置配送停止开关：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>curl -X POST &#39;http://localhost:45678/deliver/status?status=false&#39;</span></span></code></pre></div><p>从监控可以看到，从开关关闭那刻开始，所有的配送消息全部处理失败了，原因是deliver outofservice，配送操作性能从500ms左右到了0ms，说明配送失败是一个本地快速失败，并不是因为服务超时等导致的失败。而且虽然配送失败，但下单操作都是正常的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/c49bfce8682d382a04bd9dd8182534bc.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/c49bfce8682d382a04bd9dd8182534bc.jpg" alt=""></a></p><p>最后希望说的是，除了手动添加业务监控指标外，Micrometer框架还帮我们自动做了很多有关JVM内部各种数据的指标。进入InfluxDB命令行客户端，你可以看到下面的这些表（指标），其中前8个是我们自己建的业务指标，后面都是框架帮我们建的JVM、各种组件状态的指标：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;gt; USE mydb</span></span>
<span class="line"><span>Using database mydb</span></span>
<span class="line"><span>&amp;gt; SHOW MEASUREMENTS</span></span>
<span class="line"><span>name: measurements</span></span>
<span class="line"><span>name</span></span>
<span class="line"><span>----</span></span>
<span class="line"><span>createOrder_failed</span></span>
<span class="line"><span>createOrder_received</span></span>
<span class="line"><span>createOrder_success</span></span>
<span class="line"><span>createOrder_totalSuccess</span></span>
<span class="line"><span>deliverOrder_failed</span></span>
<span class="line"><span>deliverOrder_received</span></span>
<span class="line"><span>deliverOrder_success</span></span>
<span class="line"><span>deliverOrder_totalSuccess</span></span>
<span class="line"><span>hikaricp_connections</span></span>
<span class="line"><span>hikaricp_connections_acquire</span></span>
<span class="line"><span>hikaricp_connections_active</span></span>
<span class="line"><span>hikaricp_connections_creation</span></span>
<span class="line"><span>hikaricp_connections_idle</span></span>
<span class="line"><span>hikaricp_connections_max</span></span>
<span class="line"><span>hikaricp_connections_min</span></span>
<span class="line"><span>hikaricp_connections_pending</span></span>
<span class="line"><span>hikaricp_connections_timeout</span></span>
<span class="line"><span>hikaricp_connections_usage</span></span>
<span class="line"><span>http_server_requests</span></span>
<span class="line"><span>jdbc_connections_max</span></span>
<span class="line"><span>jdbc_connections_min</span></span>
<span class="line"><span>jvm_buffer_count</span></span>
<span class="line"><span>jvm_buffer_memory_used</span></span>
<span class="line"><span>jvm_buffer_total_capacity</span></span>
<span class="line"><span>jvm_classes_loaded</span></span>
<span class="line"><span>jvm_classes_unloaded</span></span>
<span class="line"><span>jvm_gc_live_data_size</span></span>
<span class="line"><span>jvm_gc_max_data_size</span></span>
<span class="line"><span>jvm_gc_memory_allocated</span></span>
<span class="line"><span>jvm_gc_memory_promoted</span></span>
<span class="line"><span>jvm_gc_pause</span></span>
<span class="line"><span>jvm_memory_committed</span></span>
<span class="line"><span>jvm_memory_max</span></span>
<span class="line"><span>jvm_memory_used</span></span>
<span class="line"><span>jvm_threads_daemon</span></span>
<span class="line"><span>jvm_threads_live</span></span>
<span class="line"><span>jvm_threads_peak</span></span>
<span class="line"><span>jvm_threads_states</span></span>
<span class="line"><span>logback_events</span></span>
<span class="line"><span>process_cpu_usage</span></span>
<span class="line"><span>process_files_max</span></span>
<span class="line"><span>process_files_open</span></span>
<span class="line"><span>process_start_time</span></span>
<span class="line"><span>process_uptime</span></span>
<span class="line"><span>rabbitmq_acknowledged</span></span>
<span class="line"><span>rabbitmq_acknowledged_published</span></span>
<span class="line"><span>rabbitmq_channels</span></span>
<span class="line"><span>rabbitmq_connections</span></span>
<span class="line"><span>rabbitmq_consumed</span></span>
<span class="line"><span>rabbitmq_failed_to_publish</span></span>
<span class="line"><span>rabbitmq_not_acknowledged_published</span></span>
<span class="line"><span>rabbitmq_published</span></span>
<span class="line"><span>rabbitmq_rejected</span></span>
<span class="line"><span>rabbitmq_unrouted_published</span></span>
<span class="line"><span>spring_rabbitmq_listener</span></span>
<span class="line"><span>system_cpu_count</span></span>
<span class="line"><span>system_cpu_usage</span></span>
<span class="line"><span>system_load_average_1m</span></span>
<span class="line"><span>tomcat_sessions_active_current</span></span>
<span class="line"><span>tomcat_sessions_active_max</span></span>
<span class="line"><span>tomcat_sessions_alive_max</span></span>
<span class="line"><span>tomcat_sessions_created</span></span>
<span class="line"><span>tomcat_sessions_expired</span></span>
<span class="line"><span>tomcat_sessions_rejected</span></span></code></pre></div><p>我们可以按照自己的需求，选取其中的一些指标，在Grafana中配置应用监控面板：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/1378d9c6a66ea733cf08200d7f4b65e9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/1378d9c6a66ea733cf08200d7f4b65e9.png" alt=""></a></p><p>看到这里，通过监控图表来定位问题，是不是比日志方便了很多呢？</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我和你介绍了如何使用Spring Boot Actuaor实现生产就绪的几个关键点，包括健康检测、暴露应用信息和指标监控。</p><p>所谓磨刀不误砍柴工，健康检测可以帮我们实现负载均衡的联动；应用信息以及Actuaor提供的各种端点，可以帮我们查看应用内部情况，甚至对应用的一些参数进行调整；而指标监控，则有助于我们整体观察应用运行情况，帮助我们快速发现和定位问题。</p><p>其实，完整的应用监控体系一般由三个方面构成，包括日志Logging、指标Metrics和追踪Tracing。其中，日志和指标我相信你应该已经比较清楚了。追踪一般不涉及开发工作就没有展开阐述，我和你简单介绍一下。</p><p>追踪也叫做全链路追踪，比较有代表性的开源系统是 <a href="https://skywalking.apache.org/" target="_blank" rel="noreferrer">SkyWalking</a> 和 <a href="https://github.com/naver/pinpoint" target="_blank" rel="noreferrer">Pinpoint</a>。一般而言，接入此类系统无需额外开发，使用其提供的javaagent来启动Java程序，就可以通过动态修改字节码实现各种组件的改写，以加入追踪代码（类似AOP）。</p><p>全链路追踪的原理是：</p><ol><li>请求进入第一个组件时，先生成一个TraceID，作为整个调用链（Trace）的唯一标识；</li><li>对于每次操作，都记录耗时和相关信息形成一个Span挂载到调用链上，Span和Span之间同样可以形成树状关联，出现远程调用、跨系统调用的时候，把TraceID进行透传（比如，HTTP调用通过请求透传，MQ消息则通过消息透传）；</li><li>把这些数据汇总提交到数据库中，通过一个UI界面查询整个树状调用链。</li></ol><p>同时，我们一般会把TraceID记录到日志中，方便实现日志和追踪的关联。</p><p>我用一张图对比了日志、指标和追踪的区别和特点：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/85cabd7ecb4c6a669ff2e8930a369c4c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/231568/85cabd7ecb4c6a669ff2e8930a369c4c.jpg" alt=""></a></p><p>在我看来，完善的监控体系三者缺一不可，它们还可以相互配合，比如通过指标发现性能问题，通过追踪定位性能问题所在的应用和操作，最后通过日志定位出具体请求的明细参数。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>Spring Boot Actuator提供了大量内置端点，你觉得端点和自定义一个@RestController有什么区别呢？你能否根据 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints-custom" target="_blank" rel="noreferrer">官方文档</a>，开发一个自定义端点呢？</li><li>在介绍指标Metrics时我们看到，InfluxDB中保存了由Micrometer框架自动帮我们收集的一些应用指标。你能否参考源码中两个Grafana配置的JSON文件，把这些指标在Grafana中配置出一个完整的应用监控面板呢？</li></ol><p>应用投产之前，你还会做哪些生产就绪方面的工作呢？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,135)])])}const g=s(t,[["render",i]]);export{h as __pageData,g as default};
