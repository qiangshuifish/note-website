import{_ as s,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"92 | 项目实战一：设计实现一个支持各种算法的限流框架（实现）","description":"","frontmatter":{},"headers":[{"level":2,"title":"V1版本功能需求","slug":"v1版本功能需求","link":"#v1版本功能需求","children":[]},{"level":2,"title":"最小原型代码","slug":"最小原型代码","link":"#最小原型代码","children":[]},{"level":2,"title":"Review最小原型代码","slug":"review最小原型代码","link":"#review最小原型代码","children":[]},{"level":2,"title":"重构最小原型代码","slug":"重构最小原型代码","link":"#重构最小原型代码","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/92-项目实战一：设计实现一个支持各种算法的限流框架（实现）.md","filePath":"设计模式之美/92-项目实战一：设计实现一个支持各种算法的限流框架（实现）.md","lastUpdated":1779822055000}'),e={name:"设计模式之美/92-项目实战一：设计实现一个支持各种算法的限流框架（实现）.md"};function l(t,n,c,r,o,u){return a(),p("div",null,[...n[0]||(n[0]=[i(`<h1 id="_92-项目实战一-设计实现一个支持各种算法的限流框架-实现" tabindex="-1">92 | 项目实战一：设计实现一个支持各种算法的限流框架（实现） <a class="header-anchor" href="#_92-项目实战一-设计实现一个支持各种算法的限流框架-实现" aria-label="Permalink to &quot;92 | 项目实战一：设计实现一个支持各种算法的限流框架（实现）&quot;">​</a></h1><p>上一节课，我们介绍了如何通过合理的设计，来实现功能性需求的同时，满足易用、易扩展、灵活、低延迟、高容错等非功能性需求。在设计的过程中，我们也借鉴了之前讲过的一些开源项目的设计思想。比如，我们借鉴了Spring的低侵入松耦合、约定优于配置等设计思想，还借鉴了MyBatis通过MyBatis-Spring类库将框架的易用性做到极致等设计思路。</p><p>今天，我们讲解这样一个问题，针对限流框架的开发，如何做高质量的代码实现。说的具体点就是，如何利用之前讲过的设计思想、原则、模式、编码规范、重构技巧等，写出易读、易扩展、易维护、灵活、简洁、可复用、易测试的代码。</p><p>话不多少，让我们正式开始今天的学习吧！</p><h2 id="v1版本功能需求" tabindex="-1">V1版本功能需求 <a class="header-anchor" href="#v1版本功能需求" aria-label="Permalink to &quot;V1版本功能需求&quot;">​</a></h2><p>我们前面提到，优秀的代码是重构出来的，复杂的代码是慢慢堆砌出来的。小步快跑、逐步迭代是我比较推崇的开发模式。所以，针对限流框架，我们也不用想一下子就做得大而全。况且，在专栏有限的篇幅内，我们也不可能将一个大而全的代码阐述清楚。所以，我们可以先实现一个包含核心功能、基本功能的V1版本。</p><p>针对上两节课中给出的需求和设计，我们重新梳理一下，看看有哪些功能要放到V1版本中实现。</p><p>在V1版本中，对于接口类型，我们只支持HTTP接口（也就URL）的限流，暂时不支持RPC等其他类型的接口限流。对于限流规则，我们只支持本地文件配置，配置文件格式只支持YAML。对于限流算法，我们只支持固定时间窗口算法。对于限流模式，我们只支持单机限流。</p><p>尽管功能“裁剪”之后，V1版本实现起来简单多了，但在编程开发的同时，我们还是要考虑代码的扩展性，预留好扩展点。这样，在接下来的新版本开发中，我们才能够轻松地扩展新的限流算法、限流模式、限流规则格式和数据源。</p><h2 id="最小原型代码" tabindex="-1">最小原型代码 <a class="header-anchor" href="#最小原型代码" aria-label="Permalink to &quot;最小原型代码&quot;">​</a></h2><p>上节课我们讲到，项目实战中的实现等于面向对象设计加实现。而面向对象设计与实现一般可以分为四个步骤：划分职责识别类、定义属性和方法、定义类之间的交互关系、组装类并提供执行入口。在 <a href="https://time.geekbang.org/column/article/171767" target="_blank" rel="noreferrer">第14讲</a> 中，我还带你用这个方法，设计和实现了一个接口鉴权框架。如果你印象不深刻了，可以回过头去再看下。</p><p>不过，我们前面也讲到，在平时的工作中，大部分程序员都是边写代码边做设计，边思考边重构，并不会严格地按照步骤，先做完类的设计再去写代码。而且，如果想一下子就把类设计得很好、很合理，也是比较难的。过度追求完美主义，只会导致迟迟下不了手，连第一行代码也敲不出来。所以，我的习惯是，先完全不考虑设计和代码质量，先把功能完成，先把基本的流程走通，哪怕所有的代码都写在一个类中也无所谓。然后，我们再针对这个MVP代码（最小原型代码）做优化重构，比如，将代码中比较独立的代码块抽离出来，定义成独立的类或函数。</p><p>我们按照先写MVP代码的思路，把代码实现出来。它的目录结构如下所示。代码非常简单，只包含5个类，接下来，我们针对每个类一一讲解一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>com.xzg.ratelimiter</span></span>
<span class="line"><span>  --RateLimiter</span></span>
<span class="line"><span>com.xzg.ratelimiter.rule</span></span>
<span class="line"><span>  --ApiLimit</span></span>
<span class="line"><span>  --RuleConfig</span></span>
<span class="line"><span>  --RateLimitRule</span></span>
<span class="line"><span>com.xzg.ratelimiter.alg</span></span>
<span class="line"><span>  --RateLimitAlg</span></span></code></pre></div><p><strong>我们先来看下RateLimiter类。</strong> 代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RateLimiter {</span></span>
<span class="line"><span>  private static final Logger log = LoggerFactory.getLogger(RateLimiter.class);</span></span>
<span class="line"><span>  // 为每个api在内存中存储限流计数器</span></span>
<span class="line"><span>  private ConcurrentHashMap&amp;lt;String, RateLimitAlg&amp;gt; counters = new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  private RateLimitRule rule;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public RateLimiter() {</span></span>
<span class="line"><span>    // 将限流规则配置文件ratelimiter-rule.yaml中的内容读取到RuleConfig中</span></span>
<span class="line"><span>    InputStream in = null;</span></span>
<span class="line"><span>    RuleConfig ruleConfig = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      in = this.getClass().getResourceAsStream(&quot;/ratelimiter-rule.yaml&quot;);</span></span>
<span class="line"><span>      if (in != null) {</span></span>
<span class="line"><span>        Yaml yaml = new Yaml();</span></span>
<span class="line"><span>        ruleConfig = yaml.loadAs(in, RuleConfig.class);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      if (in != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          in.close();</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>          log.error(&quot;close file error:{}&quot;, e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将限流规则构建成支持快速查找的数据结构RateLimitRule</span></span>
<span class="line"><span>    this.rule = new RateLimitRule(ruleConfig);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean limit(String appId, String url) throws InternalErrorException {</span></span>
<span class="line"><span>    ApiLimit apiLimit = rule.getLimit(appId, url);</span></span>
<span class="line"><span>    if (apiLimit == null) {</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取api对应在内存中的限流计数器（rateLimitCounter）</span></span>
<span class="line"><span>    String counterKey = appId + &quot;:&quot; + apiLimit.getApi();</span></span>
<span class="line"><span>    RateLimitAlg rateLimitCounter = counters.get(counterKey);</span></span>
<span class="line"><span>    if (rateLimitCounter == null) {</span></span>
<span class="line"><span>      RateLimitAlg newRateLimitCounter = new RateLimitAlg(apiLimit.getLimit());</span></span>
<span class="line"><span>      rateLimitCounter = counters.putIfAbsent(counterKey, newRateLimitCounter);</span></span>
<span class="line"><span>      if (rateLimitCounter == null) {</span></span>
<span class="line"><span>        rateLimitCounter = newRateLimitCounter;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 判断是否限流</span></span>
<span class="line"><span>    return rateLimitCounter.tryAcquire();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>RateLimiter类用来串联整个限流流程。它先读取限流规则配置文件，映射为内存中的Java对象（RuleConfig），然后再将这个中间结构构建成一个支持快速查询的数据结构（RateLimitRule）。除此之外，这个类还提供供用户直接使用的最顶层接口（limit()接口）。</p><p><strong>我们再来看下RuleConfig和ApiLimit两个类。</strong> 代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RuleConfig {</span></span>
<span class="line"><span>  private List&amp;lt;AppRuleConfig&amp;gt; configs;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public List&amp;lt;AppRuleConfig&amp;gt; getConfigs() {</span></span>
<span class="line"><span>    return configs;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setConfigs(List&amp;lt;AppRuleConfig&amp;gt; configs) {</span></span>
<span class="line"><span>    this.configs = configs;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class AppRuleConfig {</span></span>
<span class="line"><span>    private String appId;</span></span>
<span class="line"><span>    private List&amp;lt;ApiLimit&amp;gt; limits;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AppRuleConfig() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AppRuleConfig(String appId, List&amp;lt;ApiLimit&amp;gt; limits) {</span></span>
<span class="line"><span>      this.appId = appId;</span></span>
<span class="line"><span>      this.limits = limits;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //...省略getter、setter方法...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ApiLimit {</span></span>
<span class="line"><span>  private static final int DEFAULT_TIME_UNIT = 1; // 1 second</span></span>
<span class="line"><span>  private String api;</span></span>
<span class="line"><span>  private int limit;</span></span>
<span class="line"><span>  private int unit = DEFAULT_TIME_UNIT;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ApiLimit() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ApiLimit(String api, int limit) {</span></span>
<span class="line"><span>    this(api, limit, DEFAULT_TIME_UNIT);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ApiLimit(String api, int limit, int unit) {</span></span>
<span class="line"><span>    this.api = api;</span></span>
<span class="line"><span>    this.limit = limit;</span></span>
<span class="line"><span>    this.unit = unit;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // ...省略getter、setter方法...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码中，我们可以看出来，RuleConfig类嵌套了另外两个类AppRuleConfig和ApiLimit。这三个类跟配置文件的三层嵌套结构完全对应。我把对应关系标注在了下面的示例中，你可以对照着代码看下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>configs:          &amp;lt;!--对应RuleConfig--&amp;gt;</span></span>
<span class="line"><span>- appId: app-1    &amp;lt;!--对应AppRuleConfig--&amp;gt;</span></span>
<span class="line"><span>  limits:</span></span>
<span class="line"><span>  - api: /v1/user &amp;lt;!--对应ApiLimit--&amp;gt;</span></span>
<span class="line"><span>    limit: 100</span></span>
<span class="line"><span>    unit：60</span></span>
<span class="line"><span>  - api: /v1/order</span></span>
<span class="line"><span>    limit: 50</span></span>
<span class="line"><span>- appId: app-2</span></span>
<span class="line"><span>  limits:</span></span>
<span class="line"><span>  - api: /v1/user</span></span>
<span class="line"><span>    limit: 50</span></span>
<span class="line"><span>  - api: /v1/order</span></span>
<span class="line"><span>    limit: 50</span></span></code></pre></div><p><strong>我们再来看下RateLimitRule这个类。</strong></p><p>你可能会好奇，有了RuleConfig来存储限流规则，为什么还要RateLimitRule类呢？这是因为，限流过程中会频繁地查询接口对应的限流规则，为了尽可能地提高查询速度，我们需要将限流规则组织成一种支持按照URL快速查询的数据结构。考虑到URL的重复度比较高，且需要按照前缀来匹配，我们这里选择使用Trie树这种数据结构。我举了个例子解释一下，如下图所示。左边的限流规则对应到Trie树，就是图中右边的样子。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/243961/1cf3743dd97fe52ccae5ef62c604976b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/243961/1cf3743dd97fe52ccae5ef62c604976b.jpg" alt=""></a></p><p>RateLimitRule的实现代码比较多，我就不在这里贴出来了，我只给出它的定义，如下所示。如果你感兴趣的话，可以自己实现一下，也可以参看我的另一个专栏《数据结构与算法之美》的 <a href="https://time.geekbang.org/column/article/80388?utm_term=zeusNGLWQ&amp;utm_source=xiangqingye&amp;utm_medium=geektime&amp;utm_campaign=end&amp;utm_content=xiangqingyelink1104" target="_blank" rel="noreferrer">第55讲</a>。在那节课中，我们对各种接口匹配算法有非常详细的讲解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RateLimitRule {</span></span>
<span class="line"><span>  public RateLimitRule(RuleConfig ruleConfig) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ApiLimit getLimit(String appId, String api) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>最后，我们看下RateLimitAlg这个类。</strong></p><p>这个类是限流算法实现类。它实现了最简单的固定时间窗口限流算法。每个接口都要在内存中对应一个RateLimitAlg对象，记录在当前时间窗口内已经被访问的次数。RateLimitAlg类的代码如下所示。对于代码的算法逻辑，你可以看下上节课中对固定时间窗口限流算法的讲解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RateLimitAlg {</span></span>
<span class="line"><span>  /* timeout for {&amp;#64;code Lock.tryLock() }. */</span></span>
<span class="line"><span>  private static final long TRY_LOCK_TIMEOUT = 200L;  // 200ms.</span></span>
<span class="line"><span>  private Stopwatch stopwatch;</span></span>
<span class="line"><span>  private AtomicInteger currentCount = new AtomicInteger(0);</span></span>
<span class="line"><span>  private final int limit;</span></span>
<span class="line"><span>  private Lock lock = new ReentrantLock();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public RateLimitAlg(int limit) {</span></span>
<span class="line"><span>    this(limit, Stopwatch.createStarted());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;VisibleForTesting</span></span>
<span class="line"><span>  protected RateLimitAlg(int limit, Stopwatch stopwatch) {</span></span>
<span class="line"><span>    this.limit = limit;</span></span>
<span class="line"><span>    this.stopwatch = stopwatch;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean tryAcquire() throws InternalErrorException {</span></span>
<span class="line"><span>    int updatedCount = currentCount.incrementAndGet();</span></span>
<span class="line"><span>    if (updatedCount &amp;lt;= limit) {</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      if (lock.tryLock(TRY_LOCK_TIMEOUT, TimeUnit.MILLISECONDS)) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          if (stopwatch.elapsed(TimeUnit.MILLISECONDS) &amp;gt; TimeUnit.SECONDS.toMillis(1)) {</span></span>
<span class="line"><span>            currentCount.set(0);</span></span>
<span class="line"><span>            stopwatch.reset();</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>          updatedCount = currentCount.incrementAndGet();</span></span>
<span class="line"><span>          return updatedCount &amp;lt;= limit;</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>          lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        throw new InternalErrorException(&quot;tryAcquire() wait lock too long:&quot; + TRY_LOCK_TIMEOUT + &quot;ms&quot;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch (InterruptedException e) {</span></span>
<span class="line"><span>      throw new InternalErrorException(&quot;tryAcquire() is interrupted by lock-time-out.&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="review最小原型代码" tabindex="-1">Review最小原型代码 <a class="header-anchor" href="#review最小原型代码" aria-label="Permalink to &quot;Review最小原型代码&quot;">​</a></h2><p>刚刚给出的MVP代码，虽然总共也就200多行，但已经实现了V1版本中规划的功能。不过，从代码质量的角度来看，它还有很多值得优化的地方。现在，我们现在站在一个Code Reviewer的角度，来分析一下这段代码的设计和实现。</p><p>结合SOLID、DRY、KISS、LOD、基于接口而非实现编程、高内聚松耦合等经典的设计思想和原则，以及编码规范，我们从代码质量评判标准的角度重点剖析一下，这段代码在可读性、扩展性等方面的表现。其他方面的表现，比如复用性、可测试性等，这些你可以比葫芦画瓢，自己来进行分析。</p><p><strong>首先，我们来看下代码的可读性。</strong></p><p>影响代码可读性的因素有很多。我们重点关注目录设计（package包）是否合理、模块划分是否清晰、代码结构是否高内聚低耦合，以及是否符合统一的编码规范这几点。</p><p>因为涉及的代码不多，目录结构前面也给出了，总体来说比较简单，所以目录设计、包的划分没有问题。</p><p>按照上节课中的模块划分，RuleConfig、ApiLimit、RateLimitRule属于“限流规则”模块，负责限流规则的构建和查询。RateLimitAlg属于“限流算法”模块，提供了基于内存的单机固定时间窗口限流算法。RateLimiter类属于“集成使用”模块，作为最顶层类，组装其他类，提供执行入口（也就是调用入口）。不过，RateLimiter类作为执行入口，我们希望它只负责组装工作，而不应该包含具体的业务逻辑，所以，RateLimiter类中，从配置文件中读取限流规则这块逻辑，应该拆分出来设计成独立的类。</p><p>如果我们把类与类之间的依赖关系图画出来，你会发现，它们之间的依赖关系很简单，每个类的职责也比较单一，所以类的设计满足单一职责原则、LOD迪米特法则、高内聚松耦合的要求。</p><p>从编码规范上来讲，没有超级大的类、函数、代码块。类、函数、变量的命名基本能达意，也符合最小惊奇原则。虽然，有些命名不能一眼就看出是干啥的，有些命名采用了缩写，比如RateLimitAlg，但是我们起码能猜个八九不离十，结合注释（限于篇幅注释都没有写，并不代表不需要写），很容易理解和记忆。</p><p>总结一下，在最小原型代码中，目录设计、代码结构、模块划分、类的设计还算合理清晰，基本符合编码规范，代码的可读性不错！</p><p><strong>其次，我们再来看下代码的扩展性。</strong></p><p>实际上，这段代码最大的问题就是它的扩展性，也是我们最关注的，毕竟后续还有更多版本的迭代开发。编写可扩展代码，关键是要建立扩展意识。这就像下象棋，我们要多往前想几步，为以后做准备。在写代码的时候，我们要时刻思考，这段代码如果要扩展新的功能，那是否可以在尽量少改动代码的情况下完成，还是需要要大动干戈，推倒重写。</p><p>具体到MVP代码，不易扩展的最大原因是，没有遵循基于接口而非实现的编程思想，没有接口抽象意识。比如，RateLimitAlg类只是实现了固定时间窗口限流算法，也没有提炼出更加抽象的算法接口。如果我们要替换其他限流算法，就要改动比较多的代码。其他类的设计也有同样的问题，比如RateLimitRule。</p><p>除此之外，在RateLimiter类中，配置文件的名称、路径，是硬编码在代码中的。尽管我们说约定优于配置，但也要兼顾灵活性，能够让用户在需要的时候，自定义配置文件名称、路径。而且，配置文件的格式只支持Yaml，之后扩展其他格式，需要对这部分代码做很大的改动。</p><h2 id="重构最小原型代码" tabindex="-1">重构最小原型代码 <a class="header-anchor" href="#重构最小原型代码" aria-label="Permalink to &quot;重构最小原型代码&quot;">​</a></h2><p>根据刚刚对MVP代码的剖析，我们发现，它的可读性没有太大问题，问题主要在于可扩展性。主要的修改点有两个，一个是将RateLimiter中的规则配置文件的读取解析逻辑拆出来，设计成独立的类，另一个是参照基于接口而非实现编程思想，对于RateLimitRule、RateLimitAlg类提炼抽象接口。</p><p>按照这个修改思路，我们对代码进行重构。重构之后的目录结构如下所示。我对每个类都稍微做了说明，你可以对比着重构前的目录结构来看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 重构前：</span></span>
<span class="line"><span>com.xzg.ratelimiter</span></span>
<span class="line"><span>  --RateLimiter</span></span>
<span class="line"><span>com.xzg.ratelimiter.rule</span></span>
<span class="line"><span>  --ApiLimit</span></span>
<span class="line"><span>  --RuleConfig</span></span>
<span class="line"><span>  --RateLimitRule</span></span>
<span class="line"><span>com.xzg.ratelimiter.alg</span></span>
<span class="line"><span>  --RateLimitAlg</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 重构后：</span></span>
<span class="line"><span>com.xzg.ratelimiter</span></span>
<span class="line"><span>  --RateLimiter(有所修改)</span></span>
<span class="line"><span>com.xzg.ratelimiter.rule</span></span>
<span class="line"><span>  --ApiLimit(不变)</span></span>
<span class="line"><span>  --RuleConfig(不变)</span></span>
<span class="line"><span>  --RateLimitRule(抽象接口)</span></span>
<span class="line"><span>  --TrieRateLimitRule(实现类，就是重构前的RateLimitRule）</span></span>
<span class="line"><span>com.xzg.ratelimiter.rule.parser</span></span>
<span class="line"><span>  --RuleConfigParser(抽象接口)</span></span>
<span class="line"><span>  --YamlRuleConfigParser(Yaml格式配置文件解析类)</span></span>
<span class="line"><span>  --JsonRuleConfigParser(Json格式配置文件解析类)</span></span>
<span class="line"><span>com.xzg.ratelimiter.rule.datasource</span></span>
<span class="line"><span>  --RuleConfigSource(抽象接口)</span></span>
<span class="line"><span>  --FileRuleConfigSource(基于本地文件的配置类)</span></span>
<span class="line"><span>com.xzg.ratelimiter.alg</span></span>
<span class="line"><span>  --RateLimitAlg(抽象接口)</span></span>
<span class="line"><span>  --FixedTimeWinRateLimitAlg(实现类，就是重构前的RateLimitAlg)</span></span></code></pre></div><p>其中，RateLimiter类重构之后的代码如下所示。代码的改动集中在构造函数中，通过调用RuleConfigSource来实现了限流规则配置文件的加载。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RateLimiter {</span></span>
<span class="line"><span>  private static final Logger log = LoggerFactory.getLogger(RateLimiter.class);</span></span>
<span class="line"><span>  // 为每个api在内存中存储限流计数器</span></span>
<span class="line"><span>  private ConcurrentHashMap&amp;lt;String, RateLimitAlg&amp;gt; counters = new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  private RateLimitRule rule;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public RateLimiter() {</span></span>
<span class="line"><span>    //改动主要在这里：调用RuleConfigSource类来实现配置加载</span></span>
<span class="line"><span>    RuleConfigSource configSource = new FileRuleConfigSource();</span></span>
<span class="line"><span>    RuleConfig ruleConfig = configSource.load();</span></span>
<span class="line"><span>    this.rule = new TrieRateLimitRule(ruleConfig);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean limit(String appId, String url) throws InternalErrorException, InvalidUrlException {</span></span>
<span class="line"><span>    //...代码不变...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再来看下，从RateLimiter中拆分出来的限流规则加载的逻辑，现在是如何设计的。这部分涉及的类主要是下面几个。我把关键代码也贴在了下面。其中，各个Parser和RuleConfigSource类的设计有点类似策略模式，如果要添加新的格式的解析，只需要实现对应的Parser类，并且添加到FileRuleConfig类的PARSER_MAP中就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>com.xzg.ratelimiter.rule.parser</span></span>
<span class="line"><span>  --RuleConfigParser(抽象接口)</span></span>
<span class="line"><span>  --YamlRuleConfigParser(Yaml格式配置文件解析类)</span></span>
<span class="line"><span>  --JsonRuleConfigParser(Json格式配置文件解析类)</span></span>
<span class="line"><span>com.xzg.ratelimiter.rule.datasource</span></span>
<span class="line"><span>  --RuleConfigSource(抽象接口)</span></span>
<span class="line"><span>  --FileRuleConfigSource(基于本地文件的配置类)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface RuleConfigParser {</span></span>
<span class="line"><span>  RuleConfig parse(String configText);</span></span>
<span class="line"><span>  RuleConfig parse(InputStream in);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface RuleConfigSource {</span></span>
<span class="line"><span>  RuleConfig load();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class FileRuleConfigSource implements RuleConfigSource {</span></span>
<span class="line"><span>  private static final Logger log = LoggerFactory.getLogger(FileRuleConfigSource.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static final String API_LIMIT_CONFIG_NAME = &quot;ratelimiter-rule&quot;;</span></span>
<span class="line"><span>  public static final String YAML_EXTENSION = &quot;yaml&quot;;</span></span>
<span class="line"><span>  public static final String YML_EXTENSION = &quot;yml&quot;;</span></span>
<span class="line"><span>  public static final String JSON_EXTENSION = &quot;json&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static final String[] SUPPORT_EXTENSIONS =</span></span>
<span class="line"><span>      new String[] {YAML_EXTENSION, YML_EXTENSION, JSON_EXTENSION};</span></span>
<span class="line"><span>  private static final Map&amp;lt;String, RuleConfigParser&amp;gt; PARSER_MAP = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    PARSER_MAP.put(YAML_EXTENSION, new YamlRuleConfigParser());</span></span>
<span class="line"><span>    PARSER_MAP.put(YML_EXTENSION, new YamlRuleConfigParser());</span></span>
<span class="line"><span>    PARSER_MAP.put(JSON_EXTENSION, new JsonRuleConfigParser());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public RuleConfig load() {</span></span>
<span class="line"><span>    for (String extension : SUPPORT_EXTENSIONS) {</span></span>
<span class="line"><span>      InputStream in = null;</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        in = this.getClass().getResourceAsStream(&quot;/&quot; + getFileNameByExt(extension));</span></span>
<span class="line"><span>        if (in != null) {</span></span>
<span class="line"><span>          RuleConfigParser parser = PARSER_MAP.get(extension);</span></span>
<span class="line"><span>          return parser.parse(in);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        if (in != null) {</span></span>
<span class="line"><span>          try {</span></span>
<span class="line"><span>            in.close();</span></span>
<span class="line"><span>          } catch (IOException e) {</span></span>
<span class="line"><span>            log.error(&quot;close file error:{}&quot;, e);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private String getFileNameByExt(String extension) {</span></span>
<span class="line"><span>    return API_LIMIT_CONFIG_NAME + &quot;.&quot; + extension;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>优秀的代码是重构出来的，复杂的代码是慢慢堆砌出来的。小步快跑、逐步迭代是我比较推崇的开发模式。追求完美主义会让我们迟迟无法下手。所以，为了克服这个问题，一方面，我们可以规划多个小版本来开发，不断迭代优化；另一方面，在编程实现的过程中，我们可以先实现MVP代码，以此来优化重构。</p><p>如何对MVP代码优化重构呢？我们站在Code Reviewer的角度，结合SOLID、DRY、KISS、LOD、基于接口而非实现编程、高内聚松耦合等经典的设计思想和原则，以及编码规范，从代码质量评判标准的角度，来剖析代码在可读性、扩展性、可维护性、灵活、简洁、复用性、可测试性等方面的表现，并且针对性地去优化不足。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><ol><li>针对MVP代码，如果让你做code review，你还能发现哪些问题？如果让你做重构，你还会做哪些修改和优化？</li><li>如何重构代码，支持自定义限流规则配置文件名和路径？如果你熟悉Java，你可以去了解一下Spring的设计思路，看看如何借鉴到限流框架中来解决这个问题？</li></ol><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,58)])])}const d=s(e,[["render",l]]);export{m as __pageData,d as default};
