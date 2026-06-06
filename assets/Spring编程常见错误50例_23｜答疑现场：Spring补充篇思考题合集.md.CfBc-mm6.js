import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"23｜答疑现场：Spring 补充篇思考题合集","description":"","frontmatter":{},"headers":[{"level":2,"title":"第18课","slug":"第18课","link":"#第18课","children":[]},{"level":2,"title":"第19课","slug":"第19课","link":"#第19课","children":[]},{"level":2,"title":"第20课","slug":"第20课","link":"#第20课","children":[]},{"level":2,"title":"第21课","slug":"第21课","link":"#第21课","children":[]},{"level":2,"title":"第22课","slug":"第22课","link":"#第22课","children":[]}],"relativePath":"Spring编程常见错误50例/23｜答疑现场：Spring补充篇思考题合集.md","filePath":"Spring编程常见错误50例/23｜答疑现场：Spring补充篇思考题合集.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/23｜答疑现场：Spring补充篇思考题合集.md"};function i(l,a,o,r,c,u){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_23-答疑现场-spring-补充篇思考题合集" tabindex="-1">23｜答疑现场：Spring 补充篇思考题合集 <a class="header-anchor" href="#_23-答疑现场-spring-补充篇思考题合集" aria-label="Permalink to &quot;23｜答疑现场：Spring 补充篇思考题合集&quot;">​</a></h1><p>你好，我是傅健。</p><p>欢迎来到第三次答疑现场，恭喜你，到了这，终点已近在咫尺。到今天为止，我们已经解决了 50 个线上问题，是不是很有成就感了？但要想把学习所得真正为你所用还要努力练习呀，这就像理论与实践之间永远有道鸿沟需要我们去跨越一样。那么接下来，话不多说，我们就开始逐一解答第三章的课后思考题了，有任何想法欢迎到留言区补充。</p><h2 id="第18课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/380565" target="_blank" rel="noreferrer">第18课</a></strong> <a class="header-anchor" href="#第18课" aria-label="Permalink to &quot;**[第18课](https://time.geekbang.org/column/article/380565)**&quot;">​</a></h2><p>在案例 1 中使用 Spring Data Redis 时，我们提到了 StringRedisTemplate 和 RedisTemplate。那么它们是如何被创建起来的呢？</p><p>实际上，当我们依赖 spring-boot-starter 时，我们就间接依赖了 spring-boot -autoconfigure。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/384537/d07f1bc8f4aab19a834a347bb189abc1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/384537/d07f1bc8f4aab19a834a347bb189abc1.png" alt=""></a></p><p>在这个 JAR 中，存在下面这样的一个类，即 RedisAutoConfiguration。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Configuration(proxyBeanMethods = false)</span></span>
<span class="line"><span>&amp;#64;ConditionalOnClass(RedisOperations.class)</span></span>
<span class="line"><span>&amp;#64;EnableConfigurationProperties(RedisProperties.class)</span></span>
<span class="line"><span>&amp;#64;Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })</span></span>
<span class="line"><span>public class RedisAutoConfiguration {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Bean</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnMissingBean(name = &quot;redisTemplate&quot;)</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnSingleCandidate(RedisConnectionFactory.class)</span></span>
<span class="line"><span>   public RedisTemplate&amp;lt;Object, Object&amp;gt; redisTemplate(RedisConnectionFactory redisConnectionFactory) {</span></span>
<span class="line"><span>      RedisTemplate&amp;lt;Object, Object&amp;gt; template = new RedisTemplate&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>      template.setConnectionFactory(redisConnectionFactory);</span></span>
<span class="line"><span>      return template;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Bean</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnMissingBean</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnSingleCandidate(RedisConnectionFactory.class)</span></span>
<span class="line"><span>   public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {</span></span>
<span class="line"><span>      StringRedisTemplate template = new StringRedisTemplate();</span></span>
<span class="line"><span>      template.setConnectionFactory(redisConnectionFactory);</span></span>
<span class="line"><span>      return template;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码可以看出，当存在RedisOperations这个类时，就会创建 StringRedisTemplate 和 RedisTemplate 这两个 Bean。顺便说句，这个 RedisOperations 是位于 Spring Data Redis 这个 JAR 中。</p><p>再回到开头，RedisAutoConfiguration 是如何被发现的呢？实际上，它被配置在</p><p>spring-boot-autoconfigure 的 META-INF/spring.factories 中，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>org.springframework.boot.autoconfigure.EnableAutoConfiguration=\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.data.r2dbc.R2dbcRepositoriesAutoConfiguration,\\</span></span>
<span class="line"><span>org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,\\</span></span></code></pre></div><p>那么它是如何被加载进去的呢？我们的应用启动程序标记了@SpringBootApplication，这个注解继承了下面这个注解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//省略其他非关键代码</span></span>
<span class="line"><span>&amp;#64;Import(AutoConfigurationImportSelector.class)</span></span>
<span class="line"><span>public &amp;#64;interface EnableAutoConfiguration {</span></span>
<span class="line"><span>   //省略其他非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当它使用了 AutoConfigurationImportSelector 这个类，这个类就会导入在META-INF/spring.factories定义的 RedisAutoConfiguration。那么 import 动作是什么时候执行的呢？实际上是在启动应用程序时触发的，调用堆栈信息如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/384537/e0b20b79f19ff796973973ac1b1fd07f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/384537/e0b20b79f19ff796973973ac1b1fd07f.png" alt=""></a></p><p>结合上面的堆栈和相关源码，我们不妨可以总结下 RedisTemplate 被创建的过程。</p><p>当 Spring 启动时，会通过 ConfigurationClassPostProcessor 尝试处理所有标记@Configuration 的类，具体到每个配置类的处理是通过 ConfigurationClassParser 来完成的。</p><p>在这个完成过程中，它会使用 ConfigurationClassParser.DeferredImportSelectorHandler 来完成对 Import 的处理。AutoConfigurationImportSelector 就是其中一种Import，它被 @EnableAutoConfiguration 这个注解间接引用。它会加载&quot;META-INF/spring.factories&quot;中定义的 RedisAutoConfiguration，此时我们就会发现 StringRedisTemplate 和 RedisTemplate 这两个 Bean 了。</p><h2 id="第19课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/381193" target="_blank" rel="noreferrer">第19课</a></strong> <a class="header-anchor" href="#第19课" aria-label="Permalink to &quot;**[第19课](https://time.geekbang.org/column/article/381193)**&quot;">​</a></h2><p>RuntimeException 是 Exception 的子类，如果用 rollbackFor=Exception.class，那对 RuntimeException 也会生效。如果我们需要对 Exception 执行回滚操作，但对于 RuntimeException 不执行回滚操作，应该怎么做呢？</p><p>我们可以同时为 @Transactional 指定rollbackFor 和noRollbackFor 属性，具体代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional(rollbackFor = Exception.class, noRollbackFor = RuntimeException.class)</span></span>
<span class="line"><span>public void doSaveStudent(Student student) throws Exception {</span></span>
<span class="line"><span>    studentMapper.saveStudent(student);</span></span>
<span class="line"><span>    if (student.getRealname().equals(&quot;小明&quot;)) {</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;该用户已存在&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="第20课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/382150" target="_blank" rel="noreferrer">第20课</a></strong> <a class="header-anchor" href="#第20课" aria-label="Permalink to &quot;**[第20课](https://time.geekbang.org/column/article/382150)**&quot;">​</a></h2><p>结合案例2，请你思考这样一个问题：在这个案例中，我们在 CardService类方法上声明了这样的事务传播属性，@Transactional(propagation = Propagation.REQUIRES_NEW)，如果使用 Spring 的默认声明行不行，为什么？</p><p>答案是不行。我们前面说过，Spring 默认的事务传播类型是 REQUIRED，在有外部事务的情况下，内部事务则会加入原有的事务。如果我们声明成 REQUIRED，当我们要操作 card 数据的时候，持有的依然还会是原来的 DataSource。</p><h2 id="第21课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/382710" target="_blank" rel="noreferrer">第21课</a></strong> <a class="header-anchor" href="#第21课" aria-label="Permalink to &quot;**[第21课](https://time.geekbang.org/column/article/382710)**&quot;">​</a></h2><p>当我们比较案例 1 和案例 2，你会发现不管使用的是查询（Query）参数还是表单（Form）参数，我们的接口定义并没有什么变化，风格如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String hi(&amp;#64;RequestParam(&quot;para1&quot;) String para1){</span></span>
<span class="line"><span>        return &quot;helloworld:&quot; + para1;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那是不是 @RequestParam 本身就能处理这两种数据呢？</p><p>不考虑实现原理，如果我们仔细看下 @RequestParam 的 API 文档，你就会发现@RequestParam 不仅能处理表单参数，也能处理查询参数。API 文档如下：</p><blockquote><p>In Spring MVC, &quot;request parameters&quot; map to query parameters, form data, and parts in multipart requests. This is because the Servlet API combines query parameters and form data into a single map called &quot;parameters&quot;, and that includes automatic parsing of the request body.</p></blockquote><p>稍微深入一点的话，我们还可以从源码上看看具体实现。</p><p>不管是使用 Query 参数还是用 Form 参数来访问，对于案例程序而言，解析的关键逻辑都是类似的，都是通过下面的调用栈完成参数的解析：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/384537/bda0bfac82ae819955004d20372f6884.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/384537/bda0bfac82ae819955004d20372f6884.png" alt=""></a></p><p>这里可以看出，负责解析的都是 RequestParamMethodArgumentResolver，解析最后的调用也都是一样的方法。在 org.apache.catalina.connector.Request#parseParameters 这个方法中，对于 From 的解析是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (!(&quot;application/x-www-form-urlencoded&quot;.equals(contentType))) {</span></span>
<span class="line"><span>    success = true;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//走到这里，说明是 Form: &quot;application/x-www-form-urlencoded&quot;</span></span>
<span class="line"><span>int len = getContentLength();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (len &amp;gt; 0) {</span></span>
<span class="line"><span>    int maxPostSize = connector.getMaxPostSize();</span></span>
<span class="line"><span>    if ((maxPostSize &amp;gt;= 0) &amp;&amp; (len &amp;gt; maxPostSize)) {</span></span>
<span class="line"><span>       //省略非关键代码</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    byte[] formData = null;</span></span>
<span class="line"><span>    if (len &amp;lt; CACHED_POST_LEN) {</span></span>
<span class="line"><span>        if (postData == null) {</span></span>
<span class="line"><span>            postData = new byte[CACHED_POST_LEN];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        formData = postData;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        formData = new byte[len];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (readPostBody(formData, len) != len) {</span></span>
<span class="line"><span>            parameters.setParseFailedReason(FailReason.REQUEST_BODY_INCOMPLETE);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>          //省略非关键代码</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>//把 Form 数据添加到 parameter 里面去</span></span>
<span class="line"><span>parameters.processParameters(formData, 0, len);</span></span></code></pre></div><p>Form 的数据最终存储在 Parameters#paramHashValues 中。</p><p>而对于查询参数的处理，同样是在 org.apache.catalina.connector.Request#parseParameters 中，不过处理它的代码行在 Form 前面一些，关键调用代码行如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>parameters.handleQueryParameters();</span></span></code></pre></div><p>最终它也是通过 org.apache.tomcat.util.http.Parameters#processParameters 来完成数据的添加。自然，它存储的位置也是 Parameters#paramHashValues 中。</p><p>综上可知，虽然使用的是一个固定的注解 @RequestParam，但是它能处理表单和查询参数，因为它们都会存储在同一个位置：Parameters#paramHashValues。</p><h2 id="第22课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/383756" target="_blank" rel="noreferrer">第22课</a></strong> <a class="header-anchor" href="#第22课" aria-label="Permalink to &quot;**[第22课](https://time.geekbang.org/column/article/383756)**&quot;">​</a></h2><p>在案例 1 中，我们解释了为什么测试程序加载不到 spring.xml 文件，根源在于当使用下面的语句加载文件时，它们是采用不同的 Resource 形式来加载的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ImportResource(locations = {&quot;spring.xml&quot;})</span></span></code></pre></div><p>具体而言，应用程序加载使用的是 ClassPathResource，测试加载使用的是 ServletContextResource，那么这是怎么造成的呢？</p><p>实际上，以何种类型的Resource加载是由 DefaultResourceLoader#getResource 来决定的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public Resource getResource(String location) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   if (location.startsWith(&quot;/&quot;)) {</span></span>
<span class="line"><span>      return getResourceByPath(location);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (location.startsWith(CLASSPATH_URL_PREFIX)) {</span></span>
<span class="line"><span>      return new ClassPathResource(location.substring(CLASSPATH_URL_PREFIX.length()), getClassLoader());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>         // Try to parse the location as a URL...</span></span>
<span class="line"><span>         URL url = new URL(location);</span></span>
<span class="line"><span>         return (ResourceUtils.isFileURL(url) ? new FileUrlResource(url) : new UrlResource(url));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (MalformedURLException ex) {</span></span>
<span class="line"><span>         // No URL -&amp;gt; resolve as resource path.</span></span>
<span class="line"><span>         return getResourceByPath(location);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合上述代码，你可以看出，当使用下面语句时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ImportResource(locations = {&quot;classpath:spring.xml&quot;})</span></span></code></pre></div><p>走入的分支是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   //CLASSPATH_URL_PREFIX:classpath</span></span>
<span class="line"><span>   else if (location.startsWith(CLASSPATH_URL_PREFIX)) {</span></span>
<span class="line"><span>      return new ClassPathResource(location.substring(CLASSPATH_URL_PREFIX.length()), getClassLoader());</span></span>
<span class="line"><span>   }</span></span></code></pre></div><p>即创建的是 ClassPathResource。</p><p>而当使用下面语句时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ImportResource(locations = {&quot;spring.xml&quot;})</span></span></code></pre></div><p>走入的分支是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>      try {</span></span>
<span class="line"><span>         // 按 URL 加载</span></span>
<span class="line"><span>         URL url = new URL(location);</span></span>
<span class="line"><span>         return (ResourceUtils.isFileURL(url) ? new FileUrlResource(url) : new UrlResource(url));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (MalformedURLException ex) {</span></span>
<span class="line"><span>         // 按路径加载</span></span>
<span class="line"><span>         return getResourceByPath(location);</span></span>
<span class="line"><span>      }</span></span></code></pre></div><p>先尝试按 URL 加载，很明显这里会失败，因为字符串spring.xml并非一个 URL。随后使用 getResourceByPath()来加载，它会执行到下面的 WebApplicationContextResourceLoader#getResourceByPath()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> private static class WebApplicationContextResourceLoader extends ClassLoaderFilesResourcePatternResolver.ApplicationContextResourceLoader {</span></span>
<span class="line"><span>    private final WebApplicationContext applicationContext;</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>    protected Resource getResourceByPath(String path) {</span></span>
<span class="line"><span>        return (Resource)(this.applicationContext.getServletContext() != null ? new ServletContextResource(this.applicationContext.getServletContext(), path) : super.getResourceByPath(path));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，这个时候其实已经和 ApplicationContext 息息相关了。在我们的案例中，最终返回的是 ServletContextResource。</p><p>相信看到这里，你就能明白为什么一个小小的改动会导致生成的Resource不同了。无非还是因为你定义了不同的格式，不同的格式创建的资源不同，加载逻辑也不同。至于后续是如何加载的，你可以回看全文。</p><p>以上就是这次答疑的全部内容，我们下节课再见！</p>`,63)])])}const h=s(t,[["render",i]]);export{d as __pageData,h as default};
