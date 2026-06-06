import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"19 | Spring框架：IoC和AOP是扩展的核心","description":"","frontmatter":{},"headers":[{"level":2,"title":"单例的Bean如何注入Prototype的Bean？","slug":"单例的bean如何注入prototype的bean","link":"#单例的bean如何注入prototype的bean","children":[]},{"level":2,"title":"监控切面因为顺序问题导致Spring事务失效","slug":"监控切面因为顺序问题导致spring事务失效","link":"#监控切面因为顺序问题导致spring事务失效","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/19-Spring框架：IoC和AOP是扩展的核心.md","filePath":"Java业务开发常见错误100例/19-Spring框架：IoC和AOP是扩展的核心.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/19-Spring框架：IoC和AOP是扩展的核心.md"};function i(l,s,o,c,r,g){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_19-spring框架-ioc和aop是扩展的核心" tabindex="-1">19 | Spring框架：IoC和AOP是扩展的核心 <a class="header-anchor" href="#_19-spring框架-ioc和aop是扩展的核心" aria-label="Permalink to &quot;19 | Spring框架：IoC和AOP是扩展的核心&quot;">​</a></h1><p>你好，我是朱晔。今天，我们来聊聊Spring框架中的IoC和AOP，及其容易出错的地方。</p><p>熟悉Java的同学都知道，Spring的家族庞大，常用的模块就有Spring Data、Spring Security、Spring Boot、Spring Cloud等。其实呢，Spring体系虽然庞大，但都是围绕Spring Core展开的，而Spring Core中最核心的就是IoC（控制反转）和AOP（面向切面编程）。</p><p>概括地说，IoC和AOP的初衷是解耦和扩展。理解这两个核心技术，就可以让你的代码变得更灵活、可随时替换，以及业务组件间更解耦。在接下来的两讲中，我会与你深入剖析几个案例，带你绕过业务中通过Spring实现IoC和AOP相关的坑。</p><p>为了便于理解这两讲中的案例，我们先回顾下IoC和AOP的基础知识。</p><p>IoC，其实就是一种设计思想。使用Spring来实现IoC，意味着将你设计好的对象交给Spring容器控制，而不是直接在对象内部控制。那，为什么要让容器来管理对象呢？或许你能想到的是，使用IoC方便、可以实现解耦。但在我看来，相比于这两个原因，更重要的是IoC带来了更多的可能性。</p><p>如果以容器为依托来管理所有的框架、业务对象，我们不仅可以无侵入地调整对象的关系，还可以无侵入地随时调整对象的属性，甚至是实现对象的替换。这就使得框架开发者在程序背后实现一些扩展不再是问题，带来的可能性是无限的。比如我们要监控的对象如果是Bean，实现就会非常简单。所以，这套容器体系，不仅被Spring Core和Spring Boot大量依赖，还实现了一些外部框架和Spring的无缝整合。</p><p>AOP，体现了松耦合、高内聚的精髓，在切面集中实现横切关注点（缓存、权限、日志等），然后通过切点配置把代码注入合适的地方。切面、切点、增强、连接点，是AOP中非常重要的概念，也是我们这两讲会大量提及的。</p><p>为方便理解，我们把Spring AOP技术看作为蛋糕做奶油夹层的工序。如果我们希望找到一个合适的地方把奶油注入蛋糕胚子中，那应该如何指导工人完成操作呢？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227917/c71f2ec73901f7bcaa8332f237dfeddb.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227917/c71f2ec73901f7bcaa8332f237dfeddb.png" alt=""></a></p><ul><li>首先，我们要提醒他，只能往蛋糕胚子里面加奶油，而不能上面或下面加奶油。这就是连接点（Join point），对于Spring AOP来说，连接点就是方法执行。</li><li>然后，我们要告诉他，在什么点切开蛋糕加奶油。比如，可以在蛋糕坯子中间加入一层奶油，在中间切一次；也可以在中间加两层奶油，在1/3和2/3的地方切两次。这就是切点（Pointcut），Spring AOP中默认使用AspectJ查询表达式，通过在连接点运行查询表达式来匹配切入点。</li><li>接下来也是最重要的，我们要告诉他，切开蛋糕后要做什么，也就是加入奶油。这就是增强（Advice），也叫作通知，定义了切入切点后增强的方式，包括前、后、环绕等。Spring AOP中，把增强定义为拦截器。</li><li>最后，我们要告诉他，找到蛋糕胚子中要加奶油的地方并加入奶油。为蛋糕做奶油夹层的操作，对Spring AOP来说就是切面（Aspect），也叫作方面。切面=切点+增强。</li></ul><p>好了，理解了这几个核心概念，我们就可以继续分析案例了。</p><p>我要首先说明的是，Spring相关问题的问题比较复杂，一方面是Spring提供的IoC和AOP本就灵活，另一方面Spring Boot的自动装配、Spring Cloud复杂的模块会让问题排查变得更复杂。因此，今天这一讲，我会带你先打好基础，通过两个案例来重点聊聊IoC和AOP；然后，我会在下一讲中与你分享Spring相关的坑。</p><h2 id="单例的bean如何注入prototype的bean" tabindex="-1">单例的Bean如何注入Prototype的Bean？ <a class="header-anchor" href="#单例的bean如何注入prototype的bean" aria-label="Permalink to &quot;单例的Bean如何注入Prototype的Bean？&quot;">​</a></h2><p>我们虽然知道Spring创建的Bean默认是单例的，但当Bean遇到继承的时候，可能会忽略这一点。为什么呢？忽略这一点又会造成什么影响呢？接下来，我就和你分享一个由单例引起内存泄露的案例。</p><p>架构师一开始定义了这么一个SayService抽象类，其中维护了一个类型是ArrayList的字段data，用于保存方法处理的中间数据。每次调用say方法都会往data加入新数据，可以认为SayService是有状态，如果SayService是单例的话必然会OOM：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public abstract class SayService {</span></span>
<span class="line"><span>    List&amp;lt;String&amp;gt; data = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void say() {</span></span>
<span class="line"><span>        data.add(IntStream.rangeClosed(1, 1000000)</span></span>
<span class="line"><span>                .mapToObj(__ -&amp;gt; &quot;a&quot;)</span></span>
<span class="line"><span>                .collect(Collectors.joining(&quot;&quot;)) + UUID.randomUUID().toString());</span></span>
<span class="line"><span>        log.info(&quot;I&#39;m {} size:{}&quot;, this, data.size());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但实际开发的时候，开发同学没有过多思考就把SayHello和SayBye类加上了@Service注解，让它们成为了Bean，也没有考虑到父类是有状态的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class SayHello extends SayService {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void say() {</span></span>
<span class="line"><span>        super.say();</span></span>
<span class="line"><span>        log.info(&quot;hello&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class SayBye extends SayService {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void say() {</span></span>
<span class="line"><span>        super.say();</span></span>
<span class="line"><span>        log.info(&quot;bye&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>许多开发同学认为，@Service注解的意义在于，能通过@Autowired注解让Spring自动注入对象，就比如可以直接使用注入的List获取到SayHello和SayBye，而没想过类的生命周期：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>List&amp;lt;SayService&amp;gt; sayServiceList;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;test&quot;)</span></span>
<span class="line"><span>public void test() {</span></span>
<span class="line"><span>    log.info(&quot;====================&quot;);</span></span>
<span class="line"><span>    sayServiceList.forEach(SayService::say);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这一个点非常容易忽略。开发基类的架构师将基类设计为有状态的，但并不知道子类是怎么使用基类的；而开发子类的同学，没多想就直接标记了@Service，让类成为了Bean，通过@Autowired注解来注入这个服务。但这样设置后，有状态的基类就可能产生内存泄露或线程安全问题。</p><p>正确的方式是， <strong>在为类标记上@Service注解把类型交由容器管理前，首先评估一下类是否有状态，然后为Bean设置合适的Scope</strong>。好在上线前，架构师发现了这个内存泄露问题，开发同学也做了修改，为SayHello和SayBye两个类都标记了@Scope注解，设置了PROTOTYPE的生命周期，也就是多例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)</span></span></code></pre></div><p>但，上线后还是出现了内存泄漏，证明修改是无效的。</p><p>从日志可以看到，第一次调用和第二次调用的时候，SayBye对象都是4c0bfe9e，SayHello也是一样的问题。从日志第7到10行还可以看到，第二次调用后List的元素个数变为了2，说明父类SayService维护的List在不断增长，不断调用必然出现OOM：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[15:01:09.349] [http-nio-45678-exec-1] [INFO ] [.s.d.BeanSingletonAndOrderController:22  ] - ====================</span></span>
<span class="line"><span>[15:01:09.401] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayBye&amp;#64;4c0bfe9e size:1</span></span>
<span class="line"><span>[15:01:09.402] [http-nio-45678-exec-1] [INFO ] [t.commonmistakes.spring.demo1.SayBye:16  ] - bye</span></span>
<span class="line"><span>[15:01:09.469] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayHello&amp;#64;490fbeaa size:1</span></span>
<span class="line"><span>[15:01:09.469] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo1.SayHello           :17  ] - hello</span></span>
<span class="line"><span>[15:01:15.167] [http-nio-45678-exec-2] [INFO ] [.s.d.BeanSingletonAndOrderController:22  ] - ====================</span></span>
<span class="line"><span>[15:01:15.197] [http-nio-45678-exec-2] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayBye&amp;#64;4c0bfe9e size:2</span></span>
<span class="line"><span>[15:01:15.198] [http-nio-45678-exec-2] [INFO ] [t.commonmistakes.spring.demo1.SayBye:16  ] - bye</span></span>
<span class="line"><span>[15:01:15.224] [http-nio-45678-exec-2] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayHello&amp;#64;490fbeaa size:2</span></span>
<span class="line"><span>[15:01:15.224] [http-nio-45678-exec-2] [INFO ] [o.g.t.c.spring.demo1.SayHello           :17  ] - hello</span></span></code></pre></div><p>这就引出了单例的Bean如何注入Prototype的Bean这个问题。Controller标记了@RestController注解，而@RestController注解=@Controller注解+@ResponseBody注解，又因为@Controller标记了@Component元注解，所以@RestController注解其实也是一个Spring Bean：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//&amp;#64;RestController注解=&amp;#64;Controller注解+&amp;#64;ResponseBody注解&amp;#64;Target(ElementType.TYPE)</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Documented</span></span>
<span class="line"><span>&amp;#64;Controller</span></span>
<span class="line"><span>&amp;#64;ResponseBody</span></span>
<span class="line"><span>public &amp;#64;interface RestController {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//&amp;#64;Controller又标记了&amp;#64;Component元注解</span></span>
<span class="line"><span>&amp;#64;Target({ElementType.TYPE})</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Documented</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public &amp;#64;interface Controller {}</span></span></code></pre></div><p><strong>Bean默认是单例的，所以单例的Controller注入的Service也是一次性创建的，即使Service本身标识了prototype的范围也没用。</strong></p><p>修复方式是，让Service以代理方式注入。这样虽然Controller本身是单例的，但每次都能从代理获取Service。这样一来，prototype范围的配置才能真正生效：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE, proxyMode = ScopedProxyMode.TARGET_CLASS)</span></span></code></pre></div><p>通过日志可以确认这种修复方式有效：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[15:08:42.649] [http-nio-45678-exec-1] [INFO ] [.s.d.BeanSingletonAndOrderController:22  ] - ====================</span></span>
<span class="line"><span>[15:08:42.747] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayBye&amp;#64;3fa64743 size:1</span></span>
<span class="line"><span>[15:08:42.747] [http-nio-45678-exec-1] [INFO ] [t.commonmistakes.spring.demo1.SayBye:17  ] - bye</span></span>
<span class="line"><span>[15:08:42.871] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayHello&amp;#64;2f0b779 size:1</span></span>
<span class="line"><span>[15:08:42.872] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo1.SayHello           :17  ] - hello</span></span>
<span class="line"><span>[15:08:42.932] [http-nio-45678-exec-2] [INFO ] [.s.d.BeanSingletonAndOrderController:22  ] - ====================</span></span>
<span class="line"><span>[15:08:42.991] [http-nio-45678-exec-2] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayBye&amp;#64;7319b18e size:1</span></span>
<span class="line"><span>[15:08:42.992] [http-nio-45678-exec-2] [INFO ] [t.commonmistakes.spring.demo1.SayBye:17  ] - bye</span></span>
<span class="line"><span>[15:08:43.046] [http-nio-45678-exec-2] [INFO ] [o.g.t.c.spring.demo1.SayService         :19  ] - I&#39;m org.geekbang.time.commonmistakes.spring.demo1.SayHello&amp;#64;77262b35 size:1</span></span>
<span class="line"><span>[15:08:43.046] [http-nio-45678-exec-2] [INFO ] [o.g.t.c.spring.demo1.SayHello           :17  ] - hello</span></span></code></pre></div><p>调试一下也可以发现，注入的Service都是Spring生成的代理类：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227917/a95f7a5f3a576b3b426c7c5625b29230.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227917/a95f7a5f3a576b3b426c7c5625b29230.png" alt=""></a></p><p>当然，如果不希望走代理的话还有一种方式是，每次直接从ApplicationContext中获取Bean：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>private ApplicationContext applicationContext;</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;test2&quot;)</span></span>
<span class="line"><span>public void test2() {</span></span>
<span class="line"><span>applicationContext.getBeansOfType(SayService.class).values().forEach(SayService::say);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果细心的话，你可以发现另一个潜在的问题。这里Spring注入的SayService的List，第一个元素是SayBye，第二个元素是SayHello。但，我们更希望的是先执行Hello再执行Bye，所以注入一个List Bean时，需要进一步考虑Bean的顺序或者说优先级。</p><p>大多数情况下顺序并不是那么重要，但对于AOP，顺序可能会引发致命问题。我们继续往下看这个问题吧。</p><h2 id="监控切面因为顺序问题导致spring事务失效" tabindex="-1">监控切面因为顺序问题导致Spring事务失效 <a class="header-anchor" href="#监控切面因为顺序问题导致spring事务失效" aria-label="Permalink to &quot;监控切面因为顺序问题导致Spring事务失效&quot;">​</a></h2><p>实现横切关注点，是AOP非常常见的一个应用。我曾看到过一个不错的AOP实践，通过AOP实现了一个整合日志记录、异常处理和方法耗时打点为一体的统一切面。但后来发现，使用了AOP切面后，这个应用的声明式事务处理居然都是无效的。你可以先回顾下 <a href="https://time.geekbang.org/column/article/213295" target="_blank" rel="noreferrer">第6讲</a> 中提到的，Spring事务失效的几种可能性。</p><p>现在我们来看下这个案例，分析下AOP实现的监控组件和事务失效有什么关系，以及通过AOP实现监控组件是否还有其他坑。</p><p>首先，定义一个自定义注解Metrics，打上了该注解的方法可以实现各种监控功能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Target({ElementType.METHOD, ElementType.TYPE})</span></span>
<span class="line"><span>public &amp;#64;interface Metrics {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 在方法成功执行后打点，记录方法的执行时间发送到指标系统，默认开启</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    boolean recordSuccessMetrics() default true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 在方法成功失败后打点，记录方法的执行时间发送到指标系统，默认开启</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    boolean recordFailMetrics() default true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 通过日志记录请求参数，默认开启</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    boolean logParameters() default true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 通过日志记录方法返回值，默认开启</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    boolean logReturn() default true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 出现异常后通过日志记录异常信息，默认开启</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    boolean logException() default true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 出现异常后忽略异常返回默认值，默认关闭</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * &amp;#64;return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    boolean ignoreException() default false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，实现一个切面完成Metrics注解提供的功能。这个切面可以实现标记了@RestController注解的Web控制器的自动切入，如果还需要对更多Bean进行切入的话，再自行标记@Metrics注解。</p><blockquote><p>备注：这段代码有些长，里面还用到了一些小技巧，你需要仔细阅读代码中的注释。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class MetricsAspect {</span></span>
<span class="line"><span>    //让Spring帮我们注入ObjectMapper，以方便通过JSON序列化来记录方法入参和出参</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private ObjectMapper objectMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //实现一个返回Java基本类型默认值的工具。其实，你也可以逐一写很多if-else判断类型，然后手动设置其默认值。这里为了减少代码量用了一个小技巧，即通过初始化一个具有1个元素的数组，然后通过获取这个数组的值来获取基本类型默认值</span></span>
<span class="line"><span>    private static final Map&amp;lt;Class&amp;lt;?&amp;gt;, Object&amp;gt; DEFAULT_VALUES = Stream</span></span>
<span class="line"><span>            .of(boolean.class, byte.class, char.class, double.class, float.class, int.class, long.class, short.class)</span></span>
<span class="line"><span>            .collect(toMap(clazz -&amp;gt; (Class&amp;lt;?&amp;gt;) clazz, clazz -&amp;gt; Array.get(Array.newInstance(clazz, 1), 0)));</span></span>
<span class="line"><span>    public static &amp;lt;T&amp;gt; T getDefaultValue(Class&amp;lt;T&amp;gt; clazz) {</span></span>
<span class="line"><span>        return (T) DEFAULT_VALUES.get(clazz);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //&amp;#64;annotation指示器实现对标记了Metrics注解的方法进行匹配</span></span>
<span class="line"><span>   &amp;#64;Pointcut(&quot;within(&amp;#64;org.geekbang.time.commonmistakes.springpart1.aopmetrics.Metrics *)&quot;)</span></span>
<span class="line"><span>    public void withMetricsAnnotation() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //within指示器实现了匹配那些类型上标记了&amp;#64;RestController注解的方法</span></span>
<span class="line"><span>    &amp;#64;Pointcut(&quot;within(&amp;#64;org.springframework.web.bind.annotation.RestController *)&quot;)</span></span>
<span class="line"><span>    public void controllerBean() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Around(&quot;controllerBean() || withMetricsAnnotation())&quot;)</span></span>
<span class="line"><span>    public Object metrics(ProceedingJoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        //通过连接点获取方法签名和方法上Metrics注解，并根据方法签名生成日志中要输出的方法定义描述</span></span>
<span class="line"><span>        MethodSignature signature = (MethodSignature) pjp.getSignature();</span></span>
<span class="line"><span>        Metrics metrics = signature.getMethod().getAnnotation(Metrics.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String name = String.format(&quot;【%s】【%s】&quot;, signature.getDeclaringType().toString(), signature.toLongString());</span></span>
<span class="line"><span>        //因为需要默认对所有&amp;#64;RestController标记的Web控制器实现&amp;#64;Metrics注解的功能，在这种情况下方法上必然是没有&amp;#64;Metrics注解的，我们需要获取一个默认注解。虽然可以手动实例化一个&amp;#64;Metrics注解的实例出来，但为了节省代码行数，我们通过在一个内部类上定义&amp;#64;Metrics注解方式，然后通过反射获取注解的小技巧，来获得一个默认的&amp;#64;Metrics注解的实例</span></span>
<span class="line"><span>        if (metrics == null) {</span></span>
<span class="line"><span>            &amp;#64;Metrics</span></span>
<span class="line"><span>            final class c {}</span></span>
<span class="line"><span>            metrics = c.class.getAnnotation(Metrics.class);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //尝试从请求上下文（如果有的话）获得请求URL，以方便定位问题</span></span>
<span class="line"><span>        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();</span></span>
<span class="line"><span>        if (requestAttributes != null) {</span></span>
<span class="line"><span>            HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();</span></span>
<span class="line"><span>            if (request != null)</span></span>
<span class="line"><span>                name += String.format(&quot;【%s】&quot;, request.getRequestURL().toString());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //实现的是入参的日志输出</span></span>
<span class="line"><span>        if (metrics.logParameters())</span></span>
<span class="line"><span>            log.info(String.format(&quot;【入参日志】调用 %s 的参数是：【%s】&quot;, name, objectMapper.writeValueAsString(pjp.getArgs())));</span></span>
<span class="line"><span>        //实现连接点方法的执行，以及成功失败的打点，出现异常的时候还会记录日志</span></span>
<span class="line"><span>        Object returnValue;</span></span>
<span class="line"><span>        Instant start = Instant.now();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            returnValue = pjp.proceed();</span></span>
<span class="line"><span>            if (metrics.recordSuccessMetrics())</span></span>
<span class="line"><span>                //在生产级代码中，我们应考虑使用类似Micrometer的指标框架，把打点信息记录到时间序列数据库中，实现通过图表来查看方法的调用次数和执行时间，在设计篇我们会重点介绍</span></span>
<span class="line"><span>                log.info(String.format(&quot;【成功打点】调用 %s 成功，耗时：%d ms&quot;, name, Duration.between(start, Instant.now()).toMillis()));</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            if (metrics.recordFailMetrics())</span></span>
<span class="line"><span>                log.info(String.format(&quot;【失败打点】调用 %s 失败，耗时：%d ms&quot;, name, Duration.between(start, Instant.now()).toMillis()));</span></span>
<span class="line"><span>            if (metrics.logException())</span></span>
<span class="line"><span>                log.error(String.format(&quot;【异常日志】调用 %s 出现异常！&quot;, name), ex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            //忽略异常的时候，使用一开始定义的getDefaultValue方法，来获取基本类型的默认值</span></span>
<span class="line"><span>            if (metrics.ignoreException())</span></span>
<span class="line"><span>                returnValue = getDefaultValue(signature.getReturnType());</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                throw ex;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //实现了返回值的日志输出</span></span>
<span class="line"><span>        if (metrics.logReturn())</span></span>
<span class="line"><span>            log.info(String.format(&quot;【出参日志】调用 %s 的返回是：【%s】&quot;, name, returnValue));</span></span>
<span class="line"><span>        return returnValue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，分别定义最简单的Controller、Service和Repository，来测试MetricsAspect的功能。</p><p>其中，Service中实现创建用户的时候做了事务处理，当用户名包含test字样时会抛出异常，导致事务回滚。同时，我们为Service中的createUser标记了@Metrics注解。这样一来，我们还可以手动为类或方法标记@Metrics注解，实现Controller之外的其他组件的自动监控。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;RestController //自动进行监控</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;metricstest&quot;)</span></span>
<span class="line"><span>public class MetricsController {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private UserService userService;</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;transaction&quot;)</span></span>
<span class="line"><span>    public int transaction(&amp;#64;RequestParam(&quot;name&quot;) String name) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            userService.createUser(new UserEntity(name));</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            log.error(&quot;create user failed because {}&quot;, ex.getMessage());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return userService.getUserCount(name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class UserService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private UserRepository userRepository;</span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    &amp;#64;Metrics //启用方法监控</span></span>
<span class="line"><span>    public void createUser(UserEntity entity) {</span></span>
<span class="line"><span>        userRepository.save(entity);</span></span>
<span class="line"><span>        if (entity.getName().contains(&quot;test&quot;))</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;invalid username!&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getUserCount(String name) {</span></span>
<span class="line"><span>        return userRepository.findByName(name).size();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Repository</span></span>
<span class="line"><span>public interface UserRepository extends JpaRepository&amp;lt;UserEntity, Long&amp;gt; {</span></span>
<span class="line"><span>    List&amp;lt;UserEntity&amp;gt; findByName(String name);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用用户名“test”测试一下注册功能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[16:27:52.586] [http-nio-45678-exec-3] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :85  ] - 【入参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.MetricsController】【public int org.geekbang.time.commonmistakes.spring.demo2.MetricsController.transaction(java.lang.String)】【http://localhost:45678/metricstest/transaction】 的参数是：【[&quot;test&quot;]】</span></span>
<span class="line"><span>[16:27:52.590] [http-nio-45678-exec-3] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :85  ] - 【入参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 的参数是：【[{&quot;id&quot;:null,&quot;name&quot;:&quot;test&quot;}]】</span></span>
<span class="line"><span>[16:27:52.609] [http-nio-45678-exec-3] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :96  ] - 【失败打点】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 失败，耗时：19 ms</span></span>
<span class="line"><span>[16:27:52.610] [http-nio-45678-exec-3] [ERROR] [o.g.t.c.spring.demo2.MetricsAspect      :98  ] - 【异常日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 出现异常！</span></span>
<span class="line"><span>java.lang.RuntimeException: invalid username!</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(UserService.java:18)</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.spring.demo2.UserService$$FastClassBySpringCGLIB$$9eec91f.invoke(&amp;lt;generated&amp;gt;)</span></span>
<span class="line"><span>[16:27:52.614] [http-nio-45678-exec-3] [ERROR] [g.t.c.spring.demo2.MetricsController:21  ] - create user failed because invalid username!</span></span>
<span class="line"><span>[16:27:52.617] [http-nio-45678-exec-3] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :93  ] - 【成功打点】调用 【class org.geekbang.time.commonmistakes.spring.demo2.MetricsController】【public int org.geekbang.time.commonmistakes.spring.demo2.MetricsController.transaction(java.lang.String)】【http://localhost:45678/metricstest/transaction】 成功，耗时：31 ms</span></span>
<span class="line"><span>[16:27:52.618] [http-nio-45678-exec-3] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :108 ] - 【出参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.MetricsController】【public int org.geekbang.time.commonmistakes.spring.demo2.MetricsController.transaction(java.lang.String)】【http://localhost:45678/metricstest/transaction】 的返回是：【0】</span></span></code></pre></div><p>看起来这个切面很不错，日志中打出了整个调用的出入参、方法耗时：</p><ul><li>第1、8、9和10行分别是Controller方法的入参日志、调用Service方法出错后记录的错误信息、成功执行的打点和出参日志。因为Controller方法内部进行了try-catch处理，所以其方法最终是成功执行的。出参日志中显示最后查询到的用户数量是0，表示用户创建实际是失败的。</li><li>第2、3和4~7行分别是Service方法的入参日志、失败打点和异常日志。正是因为Service方法的异常抛到了Controller，所以整个方法才能被@Transactional声明式事务回滚。在这里，MetricsAspect捕获了异常又重新抛出，记录了异常的同时又不影响事务回滚。</li></ul><p>一段时间后，开发同学觉得默认的@Metrics配置有点不合适，希望进行两个调整：</p><ul><li>对于Controller的自动打点，不要自动记录入参和出参日志，否则日志量太大；</li><li>对于Service中的方法，最好可以自动捕获异常。</li></ul><p>于是，他就为MetricsController手动加上了@Metrics注解，设置logParameters和logReturn为false；然后为Service中的createUser方法的@Metrics注解，设置了ignoreException属性为true：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Metrics(logParameters = false, logReturn = false) //改动点1</span></span>
<span class="line"><span>public class MetricsController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class UserService {</span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    &amp;#64;Metrics(ignoreException = true) //改动点2</span></span>
<span class="line"><span>    public void createUser(UserEntity entity) {</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>代码上线后发现日志量并没有减少，更要命的是事务回滚失效了，从输出看到最后查询到了名为test的用户：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[17:01:16.549] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :75  ] - 【入参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.MetricsController】【public int org.geekbang.time.commonmistakes.spring.demo2.MetricsController.transaction(java.lang.String)】【http://localhost:45678/metricstest/transaction】 的参数是：【[&quot;test&quot;]】</span></span>
<span class="line"><span>[17:01:16.670] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :75  ] - 【入参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 的参数是：【[{&quot;id&quot;:null,&quot;name&quot;:&quot;test&quot;}]】</span></span>
<span class="line"><span>[17:01:16.885] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :86  ] - 【失败打点】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 失败，耗时：211 ms</span></span>
<span class="line"><span>[17:01:16.899] [http-nio-45678-exec-1] [ERROR] [o.g.t.c.spring.demo2.MetricsAspect      :88  ] - 【异常日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 出现异常！</span></span>
<span class="line"><span>java.lang.RuntimeException: invalid username!</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(UserService.java:18)</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.spring.demo2.UserService$$FastClassBySpringCGLIB$$9eec91f.invoke(&amp;lt;generated&amp;gt;)</span></span>
<span class="line"><span>[17:01:16.902] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :98  ] - 【出参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.UserService】【public void org.geekbang.time.commonmistakes.spring.demo2.UserService.createUser(org.geekbang.time.commonmistakes.spring.demo2.UserEntity)】【http://localhost:45678/metricstest/transaction】 的返回是：【null】</span></span>
<span class="line"><span>[17:01:17.466] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :83  ] - 【成功打点】调用 【class org.geekbang.time.commonmistakes.spring.demo2.MetricsController】【public int org.geekbang.time.commonmistakes.spring.demo2.MetricsController.transaction(java.lang.String)】【http://localhost:45678/metricstest/transaction】 成功，耗时：915 ms</span></span>
<span class="line"><span>[17:01:17.467] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.spring.demo2.MetricsAspect      :98  ] - 【出参日志】调用 【class org.geekbang.time.commonmistakes.spring.demo2.MetricsController】【public int org.geekbang.time.commonmistakes.spring.demo2.MetricsController.transaction(java.lang.String)】【http://localhost:45678/metricstest/transaction】 的返回是：【1】</span></span></code></pre></div><p>在介绍 <a href="https://time.geekbang.org/column/article/213295" target="_blank" rel="noreferrer">数据库事务</a> 时，我们分析了Spring通过TransactionAspectSupport类实现事务。在invokeWithinTransaction方法中设置断点可以发现，在执行Service的createUser方法时，TransactionAspectSupport并没有捕获到异常，所以自然无法回滚事务。原因就是， <strong>异常被MetricsAspect吃掉了</strong>。</p><p>我们知道，切面本身是一个Bean，Spring对不同切面增强的执行顺序是由Bean优先级决定的，具体规则是：</p><ul><li>入操作（Around（连接点执行前）、Before），切面优先级越高，越先执行。一个切面的入操作执行完，才轮到下一切面，所有切面入操作执行完，才开始执行连接点（方法）。</li><li>出操作（Around（连接点执行后）、After、AfterReturning、AfterThrowing），切面优先级越低，越先执行。一个切面的出操作执行完，才轮到下一切面，直到返回到调用点。</li><li>同一切面的Around比After、Before先执行。</li></ul><p>对于Bean可以通过@Order注解来设置优先级，查看@Order注解和Ordered接口源码可以发现，默认情况下Bean的优先级为最低优先级，其值是Integer的最大值。其实， <strong>值越大优先级反而越低，这点比较反直觉</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})</span></span>
<span class="line"><span>&amp;#64;Documented</span></span>
<span class="line"><span>public &amp;#64;interface Order {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   int value() default Ordered.LOWEST_PRECEDENCE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface Ordered {</span></span>
<span class="line"><span>   int HIGHEST_PRECEDENCE = Integer.MIN_VALUE;</span></span>
<span class="line"><span>   int LOWEST_PRECEDENCE = Integer.MAX_VALUE;</span></span>
<span class="line"><span>   int getOrder();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再通过一个例子，来理解下增强的执行顺序。新建一个TestAspectWithOrder10切面，通过@Order注解设置优先级为10，在内部定义@Before、@After、@Around三类增强，三个增强的逻辑只是简单的日志输出，切点是TestController所有方法；然后再定义一个类似的TestAspectWithOrder20切面，设置优先级为20：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>&amp;#64;Order(10)</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class TestAspectWithOrder10 {</span></span>
<span class="line"><span>    &amp;#64;Before(&quot;execution(* org.geekbang.time.commonmistakes.springpart1.aopmetrics.TestController.*(..))&quot;)</span></span>
<span class="line"><span>    public void before(JoinPoint joinPoint) throws Throwable {</span></span>
<span class="line"><span>        log.info(&quot;TestAspectWithOrder10 &amp;#64;Before&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;After(&quot;execution(* org.geekbang.time.commonmistakes.springpart1.aopmetrics.TestController.*(..))&quot;)</span></span>
<span class="line"><span>    public void after(JoinPoint joinPoint) throws Throwable {</span></span>
<span class="line"><span>        log.info(&quot;TestAspectWithOrder10 &amp;#64;After&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Around(&quot;execution(* org.geekbang.time.commonmistakes.springpart1.aopmetrics.TestController.*(..))&quot;)</span></span>
<span class="line"><span>    public Object around(ProceedingJoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        log.info(&quot;TestAspectWithOrder10 &amp;#64;Around before&quot;);</span></span>
<span class="line"><span>        Object o = pjp.proceed();</span></span>
<span class="line"><span>        log.info(&quot;TestAspectWithOrder10 &amp;#64;Around after&quot;);</span></span>
<span class="line"><span>        return o;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>&amp;#64;Order(20)</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class TestAspectWithOrder20 {</span></span>
<span class="line"><span>	...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用TestController的方法后，通过日志输出可以看到，增强执行顺序符合切面执行顺序的三个规则：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227917/3c687829083abebe1d6e347f5766903e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/227917/3c687829083abebe1d6e347f5766903e.png" alt=""></a></p><p>因为Spring的事务管理也是基于AOP的，默认情况下优先级最低也就是会先执行出操作，但是自定义切面MetricsAspect也同样是最低优先级，这个时候就可能出现问题：如果出操作先执行捕获了异常，那么Spring的事务处理就会因为无法捕获到异常导致无法回滚事务。</p><p>解决方式是，明确MetricsAspect的优先级，可以设置为最高优先级，也就是最先执行入操作最后执行出操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//将MetricsAspect这个Bean的优先级设置为最高</span></span>
<span class="line"><span>&amp;#64;Order(Ordered.HIGHEST_PRECEDENCE)</span></span>
<span class="line"><span>public class MetricsAspect {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>此外， <strong>我们要知道切入的连接点是方法，注解定义在类上是无法直接从方法上获取到注解的</strong>。修复方式是，改为优先从方法获取，如果获取不到再从类获取，如果还是获取不到再使用默认的注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Metrics metrics = signature.getMethod().getAnnotation(Metrics.class);</span></span>
<span class="line"><span>if (metrics == null) {</span></span>
<span class="line"><span>    metrics = signature.getMethod().getDeclaringClass().getAnnotation(Metrics.class);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过这2处修改，事务终于又可以回滚了，并且Controller的监控日志也不再出现入参、出参信息。</p><p>我再总结下这个案例。利用反射+注解+Spring AOP实现统一的横切日志关注点时，我们遇到的Spring事务失效问题，是由自定义的切面执行顺序引起的。这也让我们认识到，因为Spring内部大量利用IoC和AOP实现了各种组件，当使用IoC和AOP时，一定要考虑是否会影响其他内部组件。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我通过2个案例和你分享了Spring IoC和AOP的基本概念，以及三个比较容易出错的点。</p><p>第一，让Spring容器管理对象，要考虑对象默认的Scope单例是否适合，对于有状态的类型，单例可能产生内存泄露问题。</p><p>第二，如果要为单例的Bean注入Prototype的Bean，绝不是仅仅修改Scope属性这么简单。由于单例的Bean在容器启动时就会完成一次性初始化。最简单的解决方案是，把Prototype的Bean设置为通过代理注入，也就是设置proxyMode属性为TARGET_CLASS。</p><p>第三，如果一组相同类型的Bean是有顺序的，需要明确使用@Order注解来设置顺序。你可以再回顾下，两个不同优先级切面中@Before、@After和@Around三种增强的执行顺序，是什么样的。</p><p>最后我要说的是，文内第二个案例是一个完整的统一日志监控案例，继续修改就可以实现一个完善的、生产级的方法调用监控平台。这些修改主要是两方面：把日志打点，改为对接Metrics监控系统；把各种功能的监控开关，从注解属性获取改为通过配置系统实时获取。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>除了通过@Autowired注入Bean外，还可以使用@Inject或@Resource来注入Bean。你知道这三种方式的区别是什么吗？</li><li>当Bean产生循环依赖时，比如BeanA的构造方法依赖BeanB作为成员需要注入，BeanB也依赖BeanA，你觉得会出现什么问题呢？又有哪些解决方式呢？</li></ol><p>在下一讲中，我会继续与你探讨Spring核心的其他问题。我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,87)])])}const u=n(t,[["render",i]]);export{d as __pageData,u as default};
