import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"17｜答疑现场：Spring Web 篇思考题合集","description":"","frontmatter":{},"headers":[{"level":2,"title":"第9课","slug":"第9课","link":"#第9课","children":[]},{"level":2,"title":"第10课","slug":"第10课","link":"#第10课","children":[]},{"level":2,"title":"第11课","slug":"第11课","link":"#第11课","children":[]},{"level":2,"title":"第12课","slug":"第12课","link":"#第12课","children":[]},{"level":2,"title":"第13课","slug":"第13课","link":"#第13课","children":[]},{"level":2,"title":"第14课","slug":"第14课","link":"#第14课","children":[]},{"level":2,"title":"第15课","slug":"第15课","link":"#第15课","children":[]},{"level":2,"title":"第16课","slug":"第16课","link":"#第16课","children":[]}],"relativePath":"Spring编程常见错误50例/17｜答疑现场：SpringWeb篇思考题合集.md","filePath":"Spring编程常见错误50例/17｜答疑现场：SpringWeb篇思考题合集.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/17｜答疑现场：SpringWeb篇思考题合集.md"};function i(l,a,o,r,c,g){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_17-答疑现场-spring-web-篇思考题合集" tabindex="-1">17｜答疑现场：Spring Web 篇思考题合集 <a class="header-anchor" href="#_17-答疑现场-spring-web-篇思考题合集" aria-label="Permalink to &quot;17｜答疑现场：Spring Web 篇思考题合集&quot;">​</a></h1><p>你好，我是傅健。</p><p>欢迎来到第二次答疑现场，恭喜你，已经完成了三分之二的课程。到今天为止，我们已经解决了 38 个线上问题，不知道你在工作中有所应用了吗？老话说得好，“纸上得来终觉浅，绝知此事要躬行”。希望你能用行动把知识从“我的”变成“你的”。</p><p>闲话少叙，接下来我就开始逐一解答第二章的课后思考题了，有任何想法欢迎到留言区补充。</p><h2 id="第9课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/373215" target="_blank" rel="noreferrer">第9课</a></strong> <a class="header-anchor" href="#第9课" aria-label="Permalink to &quot;**[第9课](https://time.geekbang.org/column/article/373215)**&quot;">​</a></h2><p>关于 URL 解析，其实还有许多让我们惊讶的地方，例如案例 2 的部分代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi2(&amp;#64;RequestParam(&quot;name&quot;) String name){</span></span>
<span class="line"><span>    return name;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在上述代码的应用中，我们可以使用 <a href="http://localhost:8080/hi2?name=xiaoming&amp;name=hanmeimei" target="_blank" rel="noreferrer">http://localhost:8080/hi2?name=xiaoming&amp;name=hanmeimei</a> 来测试下，结果会返回什么呢？你猜会是 <a href="http://localhost:8080/hi2?name=xiaoming&amp;name=hanmeimei" target="_blank" rel="noreferrer">xiaoming&amp;name=hanmeimei</a> 么？</p><p>针对这个测试，返回的结果其实是&quot;xiaoming,hanmeimei&quot;。这里我们可以追溯到请求参数的解析代码，参考 org.apache.tomcat.util.http.Parameters#addParameter：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void addParameter( String key, String value )</span></span>
<span class="line"><span>        throws IllegalStateException {</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>    ArrayList&amp;lt;String&amp;gt; values = paramHashValues.get(key);</span></span>
<span class="line"><span>    if (values == null) {</span></span>
<span class="line"><span>        values = new ArrayList&amp;lt;&amp;gt;(1);</span></span>
<span class="line"><span>        paramHashValues.put(key, values);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    values.add(value);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出当使用 <a href="http://localhost:8080/hi2?name=xiaoming&amp;name=hanmeimei" target="_blank" rel="noreferrer">name=xiaoming&amp;name=hanmeimei</a> 这种形式访问时，name 解析出的参数值是一个 ArrayList 集合，它包含了所有的值（此处为xiaoming和hanmeimei）。但是这个数组在最终是需要转化给我们的 String 类型的。转化执行可参考其对应转化器 ArrayToStringConverter 所做的转化，关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object convert(&amp;#64;Nullable Object source, TypeDescriptor sourceType, TypeDescriptor targetType) {</span></span>
<span class="line"><span>   return this.helperConverter.convert(Arrays.asList(ObjectUtils.toObjectArray(source)), sourceType, targetType);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中 helperConverter 为 CollectionToStringConverter，它使用了 &quot;,&quot; 作为分隔将集合转化为 String 类型，分隔符定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final String DELIMITER = &quot;,&quot;;</span></span></code></pre></div><p>通过上述分析可知，对于参数解析，解析出的结果其实是一个数组，只是在最终转化时，可能因不同需求转化为不同的类型，从而呈现出不同的值，有时候反倒让我们很惊讶。分析了这么多，我们可以改下代码，测试下刚才的源码解析出的一些结论，代码修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi2(&amp;#64;RequestParam(&quot;name&quot;) String[] name){</span></span>
<span class="line"><span>    return Arrays.toString(name);</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这里我们将接收类型改为 String 数组，然后我们重新测试，会发现结果为 [xiaoming, hanmeimei]，这就更好理解和接受了。</p><h2 id="第10课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/373942" target="_blank" rel="noreferrer">第10课</a></strong> <a class="header-anchor" href="#第10课" aria-label="Permalink to &quot;**[第10课](https://time.geekbang.org/column/article/373942)**&quot;">​</a></h2><p>在案例 3 中，我们以 Content-Type 为例，提到在 Controller 层中随意自定义常用头有时候会失效。那么这个结论是不是普适呢？即在使用其他内置容器或者在其他开发框架下，是不是也会存在一样的问题？</p><p>实际上，答案是否定的。这里我们不妨修改下案例 3 的 pom.xml。修改的目标是让其不要使用默认的内嵌 Tomcat 容器，而是 Jetty 容器。具体修改示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>        &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;exclusions&amp;gt;</span></span>
<span class="line"><span>                  &amp;lt;exclusion&amp;gt;</span></span>
<span class="line"><span>                    &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>                    &amp;lt;artifactId&amp;gt;spring-boot-starter-tomcat&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>                 &amp;lt;/exclusion&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/exclusions&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;!-- 使用 Jetty --&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;artifactId&amp;gt;spring-boot-starter-jetty&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>经过上面的修改后，我们再次运行测试程序，我们会发现 Content-Type 确实可以设置成我们想要的样子，具体如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/9ec8c83f80f2a3c620869f1f84d6c308.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/9ec8c83f80f2a3c620869f1f84d6c308.png" alt=""></a></p><p>同样是执行 addHeader()，但是因为置换了容器，所以调用的方法实际是 Jetty 的方法，具体参考 org.eclipse.jetty.server.Response#addHeader：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void addHeader(String name, String value)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>    if (HttpHeader.CONTENT_TYPE.is(name))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        setContentType(value);</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>    _fields.add(name, value);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述代码中，setContentType() 最终是完成了 Header 的添加。这点和 Tomcat 完全不同。具体可参考其实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setContentType(String contentType)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        //省略其他非关键代码</span></span>
<span class="line"><span>        if (HttpGenerator.__STRICT || _mimeType == null)</span></span>
<span class="line"><span>            //添加CONTENT_TYPE</span></span>
<span class="line"><span>            _fields.put(HttpHeader.CONTENT_TYPE, _contentType);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            _contentType = _mimeType.asString();</span></span>
<span class="line"><span>            _fields.put(_mimeType.getContentTypeField());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再次对照案例 3 给出的部分代码，在这里，直接贴出关键一段（具体参考 AbstractMessageConverterMethodProcessor#writeWithMessageConverters）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MediaType selectedMediaType = null;</span></span>
<span class="line"><span>MediaType contentType = outputMessage.getHeaders().getContentType();</span></span>
<span class="line"><span>boolean isContentTypePreset = contentType != null &amp;&amp; contentType.isConcrete();</span></span>
<span class="line"><span>if (isContentTypePreset) {</span></span>
<span class="line"><span>    selectedMediaType = contentType;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>//根据请求 Accept 头和注解指定的返回类型（RequestMapping#produces）协商用何种 MediaType.</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//省略其他代码：else</span></span></code></pre></div><p>从上述代码可以看出，最终选择的 MediaType 已经不需要协商了，这是因为在Jetty容器中，Header 里面添加进了contentType，所以可以拿出来直接使用。而之前介绍的Tomcat容器没有把contentType添加进Header里，所以在上述代码中，它不能走入isContentTypePreset 为 true 的分支。此时，它只能根据请求 Accept 头和注解指定的返回类型等信息协商用何种 MediaType。</p><p>追根溯源，主要在于不同的容器对于 addHeader() 的实现不同。这里我们不妨再深入探讨下。首先，回顾我们案例 3 代码中的方法定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import javax.servlet.http.HttpServletResponse;</span></span>
<span class="line"><span>public String hi3(HttpServletResponse httpServletResponse)</span></span></code></pre></div><p>虽然都是接口 HttpServletResponse，但是在 Jetty 容器下，会被装配成 org.eclipse.jetty.server.Response，而在 Tomcat 容器下，会被装配成 org.apache.catalina.connector.Response。所以调用的方法才会发生不同。</p><p>如何理解这个现象？容器是通信层，而 Spring Boot 在这其中只是中转，所以在 Spring Boot 中，HTTP Servlet Response 来源于最原始的通信层提供的对象，这样也就合理了。</p><p>通过这个思考题，我们可以看出：对于很多技术的使用，一些结论并不是一成不变的。可能只是换下容器，结论就会失效。所以，只有洞悉其原理，才能从根本上避免各种各样的麻烦，而不仅仅是凭借一些结论去“刻舟求剑”。</p><h2 id="第11课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/374654" target="_blank" rel="noreferrer">第11课</a></strong> <a class="header-anchor" href="#第11课" aria-label="Permalink to &quot;**[第11课](https://time.geekbang.org/column/article/374654)**&quot;">​</a></h2><p>通过案例 1 的学习，我们知道直接基于 Spring MVC 而非 Spring Boot 时，是需要我们手工添加 JSON 依赖，才能解析出 JSON 的请求或者编码 JSON 响应，那么为什么基于 Spring Boot 就不需要这样做了呢？</p><p>实际上，当我们使用 Spring Boot 时，我们都会添加相关依赖项：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependencies&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/dependency&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependencies&amp;gt;</span></span></code></pre></div><p>而这个依赖项会间接把 Jackson 添加进去，依赖关系参考下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/622d8593721b8614154dc7aa61af115e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/622d8593721b8614154dc7aa61af115e.png" alt=""></a></p><p>后续 Jackson 编解码器的添加，和普通 Spring MVC 关键逻辑相同：都是判断相关类是否存在。不过这里可以稍微总结下，判断相关类是否存在有两种风格：</p><ol><li>直接使用反射来判断</li></ol><p>例如前文介绍的关键语句：</p><blockquote><p>ClassUtils.isPresent(&quot;com.fasterxml.jackson.databind.ObjectMapper&quot;, null)</p></blockquote><ol start="2"><li>使用 @ConditionalOnClass 参考 JacksonHttpMessageConvertersConfiguration 的实现：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.springframework.boot.autoconfigure.http;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Configuration(proxyBeanMethods = false)</span></span>
<span class="line"><span>class JacksonHttpMessageConvertersConfiguration {</span></span>
<span class="line"><span>   &amp;#64;Configuration(proxyBeanMethods = false)</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnClass(ObjectMapper.class)</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnBean(ObjectMapper.class)</span></span>
<span class="line"><span>   &amp;#64;ConditionalOnProperty(name = HttpMessageConvertersAutoConfiguration.PREFERRED_MAPPER_PROPERTY,</span></span>
<span class="line"><span>         havingValue = &quot;jackson&quot;, matchIfMissing = true)</span></span>
<span class="line"><span>   static class MappingJackson2HttpMessageConverterConfiguration {</span></span>
<span class="line"><span>      &amp;#64;Bean</span></span>
<span class="line"><span>      &amp;#64;ConditionalOnMissingBean(value = MappingJackson2HttpMessageConverter.class）</span></span>
<span class="line"><span>      //省略部分非关键代码</span></span>
<span class="line"><span>      MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter(ObjectMapper objectMapper) {</span></span>
<span class="line"><span>         return new MappingJackson2HttpMessageConverter(objectMapper);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上即为判断某个类是否存在的两种方法。</p><h2 id="第12课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/375554" target="_blank" rel="noreferrer">第12课</a></strong> <a class="header-anchor" href="#第12课" aria-label="Permalink to &quot;**[第12课](https://time.geekbang.org/column/article/375554)**&quot;">​</a></h2><p>在上面的学籍管理系统中，我们还存在一个接口，负责根据学生的学号删除他的信息，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;students/{id}&quot;, method = RequestMethod.DELETE)</span></span>
<span class="line"><span>public void deleteStudent(&amp;#64;PathVariable(&quot;id&quot;) &amp;#64;Range(min = 1,max = 10000) String id){</span></span>
<span class="line"><span>    log.info(&quot;delete student: {}&quot;,id);</span></span>
<span class="line"><span>    //省略业务代码</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这个学生的编号是从请求的Path中获取的，而且它做了范围约束，必须在1到10000之间。那么你能找出负责解出 ID 的解析器（HandlerMethodArgumentResolver）是哪一种吗？校验又是如何触发的？</p><p>按照案例1的案例解析思路，我们可以轻松地找到负责解析ID值的解析器是PathVariableMethodArgumentResolver，它的匹配要求参考如下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public boolean supportsParameter(MethodParameter parameter) {</span></span>
<span class="line"><span>   if (!parameter.hasParameterAnnotation(PathVariable.class)) {</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (Map.class.isAssignableFrom(parameter.nestedIfOptional().getNestedParameterType())) {</span></span>
<span class="line"><span>       PathVariable pathVariable = parameter.getParameterAnnotation(PathVariable.class);</span></span>
<span class="line"><span>       return (pathVariable != null &amp;&amp; StringUtils.hasText(pathVariable.value()));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   //要返回true，必须标记&amp;#64;PathVariable注解</span></span>
<span class="line"><span>   return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>查看上述代码，当String类型的方法参数ID标记@PathVariable时，它就能符合上PathVariableMethodArgumentResolver的匹配条件。</p><p>翻阅这个解析类的实现，我们很快就可以定位到具体的解析方法，但是当我们顺藤摸瓜去找Validation时，却无蛛丝马迹，这点完全不同于案例1中的解析器RequestResponseBodyMethodProcessor。那么它的校验到底是怎么触发的？你可以把这个问题当做课后作业去思考下，这里仅仅给出一个提示，实际上，对于这种直接标记在方法参数上的校验是通过AOP拦截来做校验的。</p><h2 id="第13课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/376115" target="_blank" rel="noreferrer">第13课</a></strong> <a class="header-anchor" href="#第13课" aria-label="Permalink to &quot;**[第13课](https://time.geekbang.org/column/article/376115)**&quot;">​</a></h2><p>在案例2中，我们提到一定要避免在过滤器中调用多次FilterChain#doFilter()。那么假设一个过滤器因为疏忽，在某种情况下，这个方法一次也没有调用，会出现什么情况呢？</p><p>这样的过滤器可参考改造后的DemoFilter：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>public class DemoFilter implements Filter {</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {</span></span>
<span class="line"><span>        System.out.println(&quot;do some logic&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于这样的情况，如果不了解Filter的实现逻辑，我们可能觉得，它最终会执行到Controller层的业务逻辑，最多是忽略掉排序在这个过滤器之后的一些过滤器而已。但是实际上，结果要严重得多。</p><p>以我们的改造案例为例，我们执行HTTP请求添加用户返回是成功的：</p><blockquote><p>POST <a href="http://localhost:8080/regStudent/fujian" target="_blank" rel="noreferrer">http://localhost:8080/regStudent/fujian</a></p><p>HTTP/1.1 200</p><p>Content-Length: 0</p><p>Date: Tue, 13 Apr 2021 11:37:43 GMT</p><p>Keep-Alive: timeout=60</p><p>Connection: keep-alive</p></blockquote><p>但是实际上，我们的Controller层压根没有执行。这里给你解释下原因，还是贴出之前解析过的过滤器执行关键代码（ApplicationFilterChain#internalDoFilter）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void internalDoFilter(ServletRequest request,</span></span>
<span class="line"><span>                              ServletResponse response){</span></span>
<span class="line"><span>    if (pos &amp;lt; n) {</span></span>
<span class="line"><span>        // pos会递增</span></span>
<span class="line"><span>        ApplicationFilterConfig filterConfig = filters[pos++];</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Filter filter = filterConfig.getFilter();</span></span>
<span class="line"><span>            // 省略非关键代码</span></span>
<span class="line"><span>            // 执行filter</span></span>
<span class="line"><span>            filter.doFilter(request, response, this);</span></span>
<span class="line"><span>            // 省略非关键代码</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 省略非关键代码</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>        // 执行真正实际业务</span></span>
<span class="line"><span>        servlet.service(request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当我们的过滤器DemoFilter被执行，而它没有在其内部调用FilterChain#doFilter时，我们会执行到上述代码中的return语句。这不仅导致后续过滤器执行不到，也会导致能执行业务的servlet.service(request, response)执行不了。此时，我们的Controller层逻辑并未执行就不稀奇了。</p><p>相反，正是因为每个过滤器都显式调用了FilterChain#doFilter，才有机会让最后一个过滤器在调用FilterChain#doFilter时，能看到 pos = n 这种情况。而这种情况下，return就走不到了，能走到的是业务逻辑（servlet.service(request, response)）。</p><h2 id="第14课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/377167" target="_blank" rel="noreferrer">第14课</a></strong> <a class="header-anchor" href="#第14课" aria-label="Permalink to &quot;**[第14课](https://time.geekbang.org/column/article/377167)**&quot;">​</a></h2><p>这节课的两个案例，它们都是在Tomcat容器启动时发生的，但你了解Spring是如何整合Tomcat，使其在启动时注册这些过滤器吗？</p><p>当我们调用下述关键代码行启动Spring时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SpringApplication.run(Application.class, args);</span></span></code></pre></div><p>会创建一个具体的 ApplicationContext 实现，以ServletWebServerApplicationContext为例，它会调用onRefresh()来与Tomcat或Jetty等容器集成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>protected void onRefresh() {</span></span>
<span class="line"><span>   super.onRefresh();</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      createWebServer();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   catch (Throwable ex) {</span></span>
<span class="line"><span>      throw new ApplicationContextException(&quot;Unable to start web server&quot;, ex);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>查看上述代码中的createWebServer()实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void createWebServer() {</span></span>
<span class="line"><span>   WebServer webServer = this.webServer;</span></span>
<span class="line"><span>   ServletContext servletContext = getServletContext();</span></span>
<span class="line"><span>   if (webServer == null &amp;&amp; servletContext == null) {</span></span>
<span class="line"><span>      ServletWebServerFactory factory = getWebServerFactory();</span></span>
<span class="line"><span>      this.webServer = factory.getWebServer(getSelfInitializer());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第6行，执行factory.getWebServer()会启动Tomcat，其中这个方法调用传递了参数getSelfInitializer()，它返回的是一个特殊格式回调方法this::selfInitialize用来添加Filter等，它是当Tomcat启动后才调用的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void selfInitialize(ServletContext servletContext) throws ServletException {</span></span>
<span class="line"><span>   prepareWebApplicationContext(servletContext);</span></span>
<span class="line"><span>   registerApplicationScope(servletContext);</span></span>
<span class="line"><span>   WebApplicationContextUtils.registerEnvironmentBeans(getBeanFactory(), servletContext);</span></span>
<span class="line"><span>   for (ServletContextInitializer beans : getServletContextInitializerBeans()) {</span></span>
<span class="line"><span>      beans.onStartup(servletContext);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那说了这么多，你可能对这个过程还不够清楚，这里我额外贴出了两段调用栈帮助你理解。</p><ol><li>启动Spring Boot时，启动Tomcat：</li></ol><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/c6943e5093cc8c68f88decd2df235938.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/c6943e5093cc8c68f88decd2df235938.png" alt=""></a></p><ol start="2"><li>Tomcat启动后回调selfInitialize：</li></ol><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/80975a6eea602239e90e73db4316c550.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/80975a6eea602239e90e73db4316c550.png" alt=""></a></p><p>相信通过上述调用栈，你能更清晰地理解Tomcat启动和Filter添加的时机了。</p><h2 id="第15课" tabindex="-1"><strong><a href="https://time.geekbang.org/column/article/378170" target="_blank" rel="noreferrer">第15课</a></strong> <a class="header-anchor" href="#第15课" aria-label="Permalink to &quot;**[第15课](https://time.geekbang.org/column/article/378170)**&quot;">​</a></h2><p>通过案例 1 的学习，我们知道在 Spring Boot 开启 Spring Security 时，访问需要授权的 API 会自动跳转到如下登录页面，你知道这个页面是如何产生的么？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/b9808555a78fb2447d7abbb1d67b91dd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/b9808555a78fb2447d7abbb1d67b91dd.png" alt=""></a></p><p>实际上，在 Spring Boot 启用 Spring Security 后，匿名访问一个需要授权的 API 接口时，我们会发现这个接口授权会失败，从而进行 302 跳转，跳转的关键代码可参考 ExceptionTranslationFilter 调用的 LoginUrlAuthenticationEntryPoint#commence 方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void commence(HttpServletRequest request, HttpServletResponse response,</span></span>
<span class="line"><span>      AuthenticationException authException) throws IOException, ServletException {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   redirectUrl = buildRedirectUrlToLoginPage(request, response, authException);</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   redirectStrategy.sendRedirect(request, response, redirectUrl);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>具体的跳转情况可参考 Chrome 的开发工具：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/f6676902da707c3976838eb9e74a9f32.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/378689/f6676902da707c3976838eb9e74a9f32.png" alt=""></a></p><p>在跳转后，新的请求最终看到的效果图是由下面的代码生产的 HTML 页面，参考 DefaultLoginPageGeneratingFilter#generateLoginPageHtml：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private String generateLoginPageHtml(HttpServletRequest request, boolean loginError,</span></span>
<span class="line"><span>      boolean logoutSuccess) {</span></span>
<span class="line"><span>   String errorMsg = &quot;Invalid credentials&quot;;</span></span>
<span class="line"><span>   //省略部分非关键代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   StringBuilder sb = new StringBuilder();</span></span>
<span class="line"><span>   sb.append(&quot;&amp;lt;!DOCTYPE html&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;&amp;lt;html lang=\\&quot;en\\&quot;&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;  &amp;lt;head&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;meta charset=\\&quot;utf-8\\&quot;&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;meta name=\\&quot;viewport\\&quot; content=\\&quot;width=device-width, initial-scale=1, shrink-to-fit=no\\&quot;&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;meta name=\\&quot;description\\&quot; content=\\&quot;\\&quot;&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;meta name=\\&quot;author\\&quot; content=\\&quot;\\&quot;&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;title&amp;gt;Please sign in&amp;lt;/title&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;link href=\\&quot;https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\\&quot; rel=\\&quot;stylesheet\\&quot; integrity=\\&quot;sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\\&quot; crossorigin=\\&quot;anonymous\\&quot;&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;    &amp;lt;link href=\\&quot;https://getbootstrap.com/docs/4.0/examples/signin/signin.css\\&quot; rel=\\&quot;stylesheet\\&quot; crossorigin=\\&quot;anonymous\\&quot;/&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;  &amp;lt;/head&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;  &amp;lt;body&amp;gt;\\n&quot;</span></span>
<span class="line"><span>         + &quot;     &amp;lt;div class=\\&quot;container\\&quot;&amp;gt;\\n&quot;);</span></span>
<span class="line"><span>   //省略部分非关键代码</span></span>
<span class="line"><span>   sb.append(&quot;&amp;lt;/div&amp;gt;\\n&quot;);</span></span>
<span class="line"><span>   sb.append(&quot;&amp;lt;/body&amp;gt;&amp;lt;/html&amp;gt;&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   return sb.toString();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上即为登录页面的呈现过程，可以看出基本都是由各种 Filter 来完成的。</p><h2 id="第16课" tabindex="-1"><strong>第16课</strong> <a class="header-anchor" href="#第16课" aria-label="Permalink to &quot;**第16课**&quot;">​</a></h2><p>这节课的两个案例，在第一次发送请求的时候，会遍历对应的资源处理器和异常处理器，并注册到 DispatcherServlet 对应的类成员变量中，你知道它是如何被触发的吗？</p><p>实现了 FrameworkServlet 的 onRefresh() 接口，这个接口会在WebApplicationContext初始化时被回调：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DispatcherServlet extends FrameworkServlet {</span></span>
<span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>protected void onRefresh(ApplicationContext context) {</span></span>
<span class="line"><span>   initStrategies(context);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Initialize the strategy objects that this servlet uses.</span></span>
<span class="line"><span> * &amp;lt;p&amp;gt;May be overridden in subclasses in order to initialize further strategy objects.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>protected void initStrategies(ApplicationContext context) {</span></span>
<span class="line"><span>   initMultipartResolver(context);</span></span>
<span class="line"><span>   initLocaleResolver(context);</span></span>
<span class="line"><span>   initThemeResolver(context);</span></span>
<span class="line"><span>   initHandlerMappings(context);</span></span>
<span class="line"><span>   initHandlerAdapters(context);</span></span>
<span class="line"><span>   initHandlerExceptionResolvers(context);</span></span>
<span class="line"><span>   initRequestToViewNameTranslator(context);</span></span>
<span class="line"><span>   initViewResolvers(context);</span></span>
<span class="line"><span>   initFlashMapManager(context);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上就是这次答疑的全部内容，我们下一章节再见！</p>`,98)])])}const h=n(t,[["render",i]]);export{u as __pageData,h as default};
