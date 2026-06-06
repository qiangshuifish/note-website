import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"11 | Spring Web Body 转化常见错误","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：No converter found for return value of type","slug":"案例-1-no-converter-found-for-return-value-of-type","link":"#案例-1-no-converter-found-for-return-value-of-type","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：变动地返回 Body","slug":"案例-2-变动地返回-body","link":"#案例-2-变动地返回-body","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"案例 3：Required request body is missing","slug":"案例-3-required-request-body-is-missing","link":"#案例-3-required-request-body-is-missing","children":[{"level":3,"title":"案例解析","slug":"案例解析-2","link":"#案例解析-2","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-2","link":"#问题修正-2","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/11-SpringWebBody转化常见错误.md","filePath":"Spring编程常见错误50例/11-SpringWebBody转化常见错误.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/11-SpringWebBody转化常见错误.md"};function l(i,s,r,o,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_11-spring-web-body-转化常见错误" tabindex="-1">11 | Spring Web Body 转化常见错误 <a class="header-anchor" href="#_11-spring-web-body-转化常见错误" aria-label="Permalink to &quot;11 | Spring Web Body 转化常见错误&quot;">​</a></h1><p>你好，我是傅健。前面几节课我们学习了 Spring Web 开发中绕不开的 URL 和 Header 处理。这一节课，我们接着讲 Body 的处理。</p><p>实际上，在 Spring 中，对于 Body 的处理很多是借助第三方编解码器来完成的。例如常见的 JSON 解析，Spring 都是借助于 Jackson、Gson 等常见工具来完成。所以在 Body 处理中，我们遇到的很多错误都是第三方工具使用中的一些问题。</p><p>真正对于 Spring 而言，错误并不多，特别是 Spring Boot 的自动包装以及对常见问题的不断完善，让我们能犯的错误已经很少了。不过，毕竟不是每个项目都是直接基于 Spring Boot 的，所以还是会存在一些问题，接下来我们就一起梳理下。</p><h2 id="案例-1-no-converter-found-for-return-value-of-type" tabindex="-1">案例 1：No converter found for return value of type <a class="header-anchor" href="#案例-1-no-converter-found-for-return-value-of-type" aria-label="Permalink to &quot;案例 1：No converter found for return value of type&quot;">​</a></h2><p>在直接用 Spring MVC 而非 Spring Boot 来编写 Web 程序时，我们基本都会遇到 “No converter found for return value of type” 这种错误。实际上，我们编写的代码都非常简单，例如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义的数据对象</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;NoArgsConstructor</span></span>
<span class="line"><span>&amp;#64;AllArgsConstructor</span></span>
<span class="line"><span>public class Student {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private Integer age;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//定义的 API 借口</span></span>
<span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;/hi1&quot;)</span></span>
<span class="line"><span>    public Student hi1() {</span></span>
<span class="line"><span>        return new Student(&quot;xiaoming&quot;, Integer.valueOf(12));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们的 pom.xml 文件也都是最基本的必备项，关键配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;org.springframework&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;spring-webmvc&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;version&amp;gt;5.2.3.RELEASE&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>但是当我们运行起程序，执行测试代码，就会报错如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/374654/42b44dd7673c9db6828e57566a5af1b8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/374654/42b44dd7673c9db6828e57566a5af1b8.png" alt=""></a></p><p>从上述代码及配置来看，并没有什么明显的错误，可为什么会报错呢？难道框架不支持？</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>要了解这个案例出现的原因，需要我们对如何处理响应有一个初步的认识。</p><p>当我们的请求到达 Controller 层后，我们获取到了一个对象，即案例中的 new Student(“xiaoming”, Integer.valueOf(12))，那么这个对象应该怎么返回给客户端呢？</p><p>用 JSON 还是用 XML，还是其他类型编码？此时就需要一个决策，我们可以先找到这个决策的关键代码所在，参考方法 AbstractMessageConverterMethodProcessor#writeWithMessageConverters：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HttpServletRequest request = inputMessage.getServletRequest();</span></span>
<span class="line"><span>List&amp;lt;MediaType&amp;gt; acceptableTypes = getAcceptableMediaTypes(request);</span></span>
<span class="line"><span>List&amp;lt;MediaType&amp;gt; producibleTypes = getProducibleMediaTypes(request, valueType, targetType);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (body != null &amp;&amp; producibleTypes.isEmpty()) {</span></span>
<span class="line"><span>   throw new HttpMessageNotWritableException(</span></span>
<span class="line"><span>         &quot;No converter found for return value of type: &quot; + valueType);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>List&amp;lt;MediaType&amp;gt; mediaTypesToUse = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>for (MediaType requestedType : acceptableTypes) {</span></span>
<span class="line"><span>   for (MediaType producibleType : producibleTypes) {</span></span>
<span class="line"><span>      if (requestedType.isCompatibleWith(producibleType)) {</span></span>
<span class="line"><span>         mediaTypesToUse.add(getMostSpecificMediaType(requestedType, producibleType));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实际上节课我们就贴出过相关代码并分析过，所以这里只是带着你简要分析下上述代码的基本逻辑：</p><ol><li>查看请求的头中是否有 ACCEPT 头，如果没有则可以使用任何类型；</li><li>查看当前针对返回类型（即 Student 实例）可以采用的编码类型；</li><li>取上面两步获取结果的交集来决定用什么方式返回。</li></ol><p>比较代码，我们可以看出，假设第2步中就没有找到合适的编码方式，则直接报案例中的错误，具体的关键代码行如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (body != null &amp;&amp; producibleTypes.isEmpty()) {</span></span>
<span class="line"><span>   throw new HttpMessageNotWritableException(</span></span>
<span class="line"><span>         &quot;No converter found for return value of type: &quot; + valueType);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么当前可采用的编码类型是怎么决策出来的呢？我们可以进一步查看方法 AbstractMessageConverterMethodProcessor#getProducibleMediaTypes：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected List&amp;lt;MediaType&amp;gt; getProducibleMediaTypes(</span></span>
<span class="line"><span>      HttpServletRequest request, Class&amp;lt;?&amp;gt; valueClass, &amp;#64;Nullable Type targetType) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   Set&amp;lt;MediaType&amp;gt; mediaTypes =</span></span>
<span class="line"><span>         (Set&amp;lt;MediaType&amp;gt;) request.getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);</span></span>
<span class="line"><span>   if (!CollectionUtils.isEmpty(mediaTypes)) {</span></span>
<span class="line"><span>      return new ArrayList&amp;lt;&amp;gt;(mediaTypes);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else if (!this.allSupportedMediaTypes.isEmpty()) {</span></span>
<span class="line"><span>      List&amp;lt;MediaType&amp;gt; result = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>      for (HttpMessageConverter&amp;lt;?&amp;gt; converter : this.messageConverters) {</span></span>
<span class="line"><span>         if (converter instanceof GenericHttpMessageConverter &amp;&amp; targetType != null) {</span></span>
<span class="line"><span>            if (((GenericHttpMessageConverter&amp;lt;?&amp;gt;) converter).canWrite(targetType, valueClass, null)) {</span></span>
<span class="line"><span>               result.addAll(converter.getSupportedMediaTypes());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else if (converter.canWrite(valueClass, null)) {</span></span>
<span class="line"><span>            result.addAll(converter.getSupportedMediaTypes());</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return result;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      return Collections.singletonList(MediaType.ALL);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假设当前没有显式指定返回类型（例如给 GetMapping 指定 produces 属性），那么则会遍历所有已经注册的 HttpMessageConverter 查看是否支持当前类型，从而最终返回所有支持的类型。那么这些 MessageConverter 是怎么注册过来的？</p><p>在 Spring MVC（非 Spring Boot）启动后，我们都会构建 RequestMappingHandlerAdapter 类型的 Bean 来负责路由和处理请求。</p><p>具体而言，当我们使用 &lt;mvc:annotation-driven/&gt; 时，我们会通过 AnnotationDrivenBeanDefinitionParser 来构建这个 Bean。而在它的构建过程中，会决策出以后要使用哪些 HttpMessageConverter，相关代码参考 AnnotationDrivenBeanDefinitionParser#getMessageConverters：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>messageConverters.add(createConverterDefinition(ByteArrayHttpMessageConverter.class, source));</span></span>
<span class="line"><span>RootBeanDefinition stringConverterDef = createConverterDefinition(StringHttpMessageConverter.class, source);</span></span>
<span class="line"><span>stringConverterDef.getPropertyValues().add(&quot;writeAcceptCharset&quot;, false);</span></span>
<span class="line"><span>messageConverters.add(stringConverterDef);</span></span>
<span class="line"><span>messageConverters.add(createConverterDefinition(ResourceHttpMessageConverter.class, source));</span></span>
<span class="line"><span>//省略其他非关键代码</span></span>
<span class="line"><span>if (jackson2Present) {</span></span>
<span class="line"><span>   Class&amp;lt;?&amp;gt; type = MappingJackson2HttpMessageConverter.class;</span></span>
<span class="line"><span>   RootBeanDefinition jacksonConverterDef = createConverterDefinition(type, source);</span></span>
<span class="line"><span>   GenericBeanDefinition jacksonFactoryDef = createObjectMapperFactoryDefinition(source);</span></span>
<span class="line"><span>   jacksonConverterDef.getConstructorArgumentValues().addIndexedArgumentValue(0, jacksonFactoryDef);</span></span>
<span class="line"><span>   messageConverters.add(jacksonConverterDef);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else if (gsonPresent) { messageConverters.add(createConverterDefinition(GsonHttpMessageConverter.class, source));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//省略其他非关键代码</span></span></code></pre></div><p>这里我们会默认使用一些编解码器，例如 StringHttpMessageConverter，但是像 JSON、XML 等类型，若要加载编解码，则需要 jackson2Present、gsonPresent 等变量为 true。</p><p>这里我们可以选取 gsonPresent 看下何时为 true，参考下面的关键代码行：</p><blockquote><p>gsonPresent = ClassUtils.isPresent(“com.google.gson.Gson”, classLoader);</p></blockquote><p>假设我们依赖了 Gson 包，我们就可以添加上 GsonHttpMessageConverter 这种转化器。但是可惜的是，我们的案例并没有依赖上任何 JSON 的库，所以最终在候选的转换器列表里，并不存在 JSON 相关的转化器。最终候选列表示例如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/374654/d84e2d85c91fd7dd6825e14984b071d4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/374654/d84e2d85c91fd7dd6825e14984b071d4.png" alt=""></a></p><p>由此可见，并没有任何 JSON 相关的编解码器。而针对 Student 类型的返回对象，上面的这些编解码器又不符合要求，所以最终走入了下面的代码行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (body != null &amp;&amp; producibleTypes.isEmpty()) {</span></span>
<span class="line"><span>   throw new HttpMessageNotWritableException(</span></span>
<span class="line"><span>         &quot;No converter found for return value of type: &quot; + valueType);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>抛出了 “No converter found for return value of type” 这种错误，结果符合案例中的实际测试情况。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>针对这个案例，有了源码的剖析，可以看出， <strong>不是每种类型的编码器都会与生俱来，而是根据当前项目的依赖情况决定是否支持。</strong> 要解析 JSON，我们就要依赖相关的包，所以这里我们可以以 Gson 为例修正下这个问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> &amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;com.google.code.gson&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;gson&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;version&amp;gt;2.8.6&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>我们添加了 Gson 的依赖到 pom.xml。重新运行程序和测试案例，你会发现不再报错了。</p><p>另外，这里我们还可以查看下 GsonHttpMessageConverter 这种编码器是如何支持上 Student 这个对象的解析的。</p><p>通过这个案例，我们可以知道，Spring 给我们提供了很多好用的功能，但是这些功能交织到一起后，我们就很可能入坑，只有深入了解它的运行方式，才能迅速定位问题并解决问题。</p><h2 id="案例-2-变动地返回-body" tabindex="-1">案例 2：变动地返回 Body <a class="header-anchor" href="#案例-2-变动地返回-body" aria-label="Permalink to &quot;案例 2：变动地返回 Body&quot;">​</a></h2><p>案例1让我们解决了解析问题，那随着不断实践，我们可能还会发现在代码并未改动的情况下，返回结果不再和之前相同了。例如我们看下这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;PostMapping(&quot;/hi2&quot;)</span></span>
<span class="line"><span>    public Student hi2(&amp;#64;RequestBody Student student) {</span></span>
<span class="line"><span>        return student;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码接受了一个 Student 对象，然后原样返回。我们使用下面的测试请求进行测试：</p><blockquote><p>POST <a href="http://localhost:8080/springmvc3_war/app/hi2" target="_blank" rel="noreferrer">http://localhost:8080/springmvc3_war/app/hi2</a></p><p>Content-Type: application/json</p><p>{</p><p>“name”: “xiaoming”</p><p>}</p></blockquote><p>经过测试，我们会得到以下结果：</p><blockquote><p>{</p><p>“name”: “xiaoming”</p><p>}</p></blockquote><p>但是随着项目的推进，在代码并未改变时，我们可能会返回以下结果：</p><blockquote><p>{</p><p>“name”: “xiaoming”,</p><p>“age”: null</p><p>}</p></blockquote><p>即当 age 取不到值，开始并没有序列化它作为响应 Body 的一部分，后来又序列化成 null 作为 Body 返回了。</p><p>在什么情况下会如此？如何规避这个问题，保证我们的返回始终如一。</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>如果我们发现上述问题，那么很有可能是这样一种情况造成的。即在后续的代码开发中，我们直接依赖或者间接依赖了新的 JSON 解析器，例如下面这种方式就依赖了Jackson：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;groupId&amp;gt;com.fasterxml.jackson.core&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;artifactId&amp;gt;jackson-databind&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;version&amp;gt;2.9.6&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span> &amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p>当存在多个 Jackson 解析器时，我们的 Spring MVC 会使用哪一种呢？这个决定可以参考</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (jackson2Present) {</span></span>
<span class="line"><span>   Class&amp;lt;?&amp;gt; type = MappingJackson2HttpMessageConverter.class;</span></span>
<span class="line"><span>   RootBeanDefinition jacksonConverterDef = createConverterDefinition(type, source);</span></span>
<span class="line"><span>   GenericBeanDefinition jacksonFactoryDef = createObjectMapperFactoryDefinition(source);</span></span>
<span class="line"><span>   jacksonConverterDef.getConstructorArgumentValues().addIndexedArgumentValue(0, jacksonFactoryDef);</span></span>
<span class="line"><span>   messageConverters.add(jacksonConverterDef);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else if (gsonPresent) {</span></span>
<span class="line"><span>   messageConverters.add(createConverterDefinition(GsonHttpMessageConverter.class, source));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码可以看出，Jackson 是优先于 Gson 的。所以我们的程序不知不觉已经从 Gson 编解码切换成了 Jackson。所以此时， <strong>行为就不见得和之前完全一致了</strong>。</p><p>针对本案例中序列化值为 null 的字段的行为而言，我们可以分别看下它们的行为是否一致。</p><p><strong>1. 对于 Gson 而言：</strong></p><p>GsonHttpMessageConverter 默认使用new Gson()来构建 Gson，它的构造器中指明了相关配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Gson() {</span></span>
<span class="line"><span>  this(Excluder.DEFAULT, FieldNamingPolicy.IDENTITY,</span></span>
<span class="line"><span>      Collections.&amp;lt;Type, InstanceCreator&amp;lt;?&amp;gt;&amp;gt;emptyMap(), DEFAULT_SERIALIZE_NULLS,</span></span>
<span class="line"><span>      DEFAULT_COMPLEX_MAP_KEYS, DEFAULT_JSON_NON_EXECUTABLE, DEFAULT_ESCAPE_HTML,</span></span>
<span class="line"><span>      DEFAULT_PRETTY_PRINT, DEFAULT_LENIENT, DEFAULT_SPECIALIZE_FLOAT_VALUES,</span></span>
<span class="line"><span>      LongSerializationPolicy.DEFAULT, null, DateFormat.DEFAULT, DateFormat.DEFAULT,</span></span>
<span class="line"><span>      Collections.&amp;lt;TypeAdapterFactory&amp;gt;emptyList(), Collections.&amp;lt;TypeAdapterFactory&amp;gt;emptyList(),</span></span>
<span class="line"><span>      Collections.&amp;lt;TypeAdapterFactory&amp;gt;emptyList());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从DEFAULT_SERIALIZE_NULLS可以看出，它是默认不序列化 null 的。</p><p><strong>2. 对于 Jackson 而言：</strong></p><p>MappingJackson2HttpMessageConverter 使用&quot;Jackson2ObjectMapperBuilder.json().build()&quot;来构建 ObjectMapper，它默认只显式指定了下面两个配置：</p><blockquote><p>MapperFeature.DEFAULT_VIEW_INCLUSION</p><p>DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES</p></blockquote><p>Jackson 默认对于 null 的处理是做序列化的，所以本案例中 age 为 null 时，仍然被序列化了。</p><p>通过上面两种 JSON 序列化的分析可以看出， <strong>返回的内容在依赖项改变的情况下确实可能发生变化。</strong></p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>那么针对这个问题，如何修正呢？即保持在 Jackson 依赖项添加的情况下，让它和 Gson 的序列化行为一致吗？这里可以按照以下方式进行修改：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>&amp;#64;NoArgsConstructor</span></span>
<span class="line"><span>&amp;#64;AllArgsConstructor</span></span>
<span class="line"><span>&amp;#64;JsonInclude(JsonInclude.Include.NON_NULL)</span></span>
<span class="line"><span>public class Student {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    //或直接加在 age 上：&amp;#64;JsonInclude(JsonInclude.Include.NON_NULL)</span></span>
<span class="line"><span>    private Integer age;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以直接使用 @JsonInclude 这个注解，让 Jackson 和 Gson 的默认行为对于 null 的处理变成一致。</p><p>上述修改方案虽然看起来简单，但是假设有很多对象如此，万一遗漏了怎么办呢？所以可以从全局角度来修改，修改的关键代码如下：</p><blockquote><p>//ObjectMapper mapper = new ObjectMapper();</p><p>mapper.setSerializationInclusion(Include.NON_NULL);</p></blockquote><p>但是如何修改 ObjectMapper 呢？这个对象是由 MappingJackson2HttpMessageConverter 构建的，看似无法插足去修改。实际上，我们在非 Spring Boot 程序中，可以按照下面这种方式来修改：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public HelloController(RequestMappingHandlerAdapter requestMappingHandlerAdapter){</span></span>
<span class="line"><span>    List&amp;lt;HttpMessageConverter&amp;lt;?&amp;gt;&amp;gt; messageConverters =</span></span>
<span class="line"><span>            requestMappingHandlerAdapter.getMessageConverters();</span></span>
<span class="line"><span>    for (HttpMessageConverter&amp;lt;?&amp;gt; messageConverter : messageConverters) {</span></span>
<span class="line"><span>        if(messageConverter instanceof MappingJackson2HttpMessageConverter ){</span></span>
<span class="line"><span>            (((MappingJackson2HttpMessageConverter)messageConverter).getObjectMapper()).setSerializationInclusion(JsonInclude.Include.NON_NULL);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//省略其他非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们用自动注入的方式获取到 RequestMappingHandlerAdapter，然后找到 Jackson 解析器，进行配置即可。</p><p>通过上述两种修改方案，我们就能做到忽略 null 的 age 字段了。</p><h2 id="案例-3-required-request-body-is-missing" tabindex="-1">案例 3：Required request body is missing <a class="header-anchor" href="#案例-3-required-request-body-is-missing" aria-label="Permalink to &quot;案例 3：Required request body is missing&quot;">​</a></h2><p>通过案例 1，我们已经能够解析 Body 了，但是有时候，我们会有一些很好的想法。例如为了查询问题方便，在请求过来时，自定义一个 Filter 来统一输出具体的请求内容，关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReadBodyFilter implements Filter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request,</span></span>
<span class="line"><span>                         ServletResponse response, FilterChain chain)</span></span>
<span class="line"><span>            throws IOException, ServletException {</span></span>
<span class="line"><span>        String requestBody = IOUtils.toString(request.getInputStream(), &quot;utf-8&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;print request body in filter:&quot; + requestBody);</span></span>
<span class="line"><span>        chain.doFilter(request, response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们可以把这个 Filter 添加到 web.xml 并配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;filter&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;filter-name&amp;gt;myFilter&amp;lt;/filter-name&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;filter-class&amp;gt;com.puzzles.ReadBodyFilter&amp;lt;/filter-class&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/filter&amp;gt;</span></span>
<span class="line"><span>&amp;lt;filter-mapping&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;filter-name&amp;gt;myFilter&amp;lt;/filter-name&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;url-pattern&amp;gt;/app/*&amp;lt;/url-pattern&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/filter-mapping&amp;gt;</span></span></code></pre></div><p>再测试下 Controller 层中定义的接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PostMapping(&quot;/hi3&quot;)</span></span>
<span class="line"><span>public Student hi3(&amp;#64;RequestBody Student student) {</span></span>
<span class="line"><span>    return student;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行测试，我们会发现下面的日志：</p><blockquote><p>print request body in filter:{</p><p>“name”: “xiaoming”,</p><p>“age”: 10</p><p>}</p><p>25-Mar-2021 11:04:44.906 璀﹀憡 [http-nio-8080-exec-5] org.springframework.web.servlet.handler.AbstractHandlerExceptionResolver.logException Resolved [org.springframework.http.converter.HttpMessageNotReadableException: Required request body is missing: public com.puzzles.Student com.puzzles.HelloController.hi3(com.puzzles.Student)]</p></blockquote><p>可以看到，请求的 Body 确实在请求中输出了，但是后续的操作直接报错了，错误提示：Required request body is missing。</p><h3 id="案例解析-2" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-2" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>要了解这个错误的根本原因，你得知道这个错误抛出的源头。查阅请求 Body 转化的相关代码，有这样一段关键逻辑（参考 RequestResponseBodyMethodProcessor#readWithMessageConverters）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected &amp;lt;T&amp;gt; Object readWithMessageConverters(NativeWebRequest webRequest, MethodParameter parameter,</span></span>
<span class="line"><span>      Type paramType) throws IOException, HttpMediaTypeNotSupportedException, HttpMessageNotReadableException {</span></span>
<span class="line"><span>   HttpServletRequest servletRequest = webRequest.getNativeRequest(HttpServletRequest.class);</span></span>
<span class="line"><span>   ServletServerHttpRequest inputMessage = new ServletServerHttpRequest(servletRequest);</span></span>
<span class="line"><span>   //读取 Body 并进行转化</span></span>
<span class="line"><span>   Object arg = readWithMessageConverters(inputMessage, parameter, paramType);</span></span>
<span class="line"><span>   if (arg == null &amp;&amp; checkRequired(parameter)) {</span></span>
<span class="line"><span>      throw new HttpMessageNotReadableException(&quot;Required request body is missing: &quot; +</span></span>
<span class="line"><span>            parameter.getExecutable().toGenericString(), inputMessage);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return arg;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>protected boolean checkRequired(MethodParameter parameter) {</span></span>
<span class="line"><span>   RequestBody requestBody = parameter.getParameterAnnotation(RequestBody.class);</span></span>
<span class="line"><span>   return (requestBody != null &amp;&amp; requestBody.required() &amp;&amp; !parameter.isOptional());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当使用了 @RequestBody 且是必须时，如果解析出的 Body 为 null，则报错提示 Required request body is missing。</p><p>所以我们要继续追踪代码，来查询什么情况下会返回 body 为 null。关键代码参考 AbstractMessageConverterMethodArgumentResolver#readWithMessageConverters：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected &amp;lt;T&amp;gt; Object readWithMessageConverters(HttpInputMessage inputMessage, MethodParameter parameter,</span></span>
<span class="line"><span>      Type targetType){</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   Object body = NO_VALUE;</span></span>
<span class="line"><span>   EmptyBodyCheckingHttpInputMessage message;</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      message = new EmptyBodyCheckingHttpInputMessage(inputMessage);</span></span>
<span class="line"><span>      for (HttpMessageConverter&amp;lt;?&amp;gt; converter : this.messageConverters) {</span></span>
<span class="line"><span>         Class&amp;lt;HttpMessageConverter&amp;lt;?&amp;gt;&amp;gt; converterType = (Class&amp;lt;HttpMessageConverter&amp;lt;?&amp;gt;&amp;gt;) converter.getClass();</span></span>
<span class="line"><span>         GenericHttpMessageConverter&amp;lt;?&amp;gt; genericConverter =</span></span>
<span class="line"><span>               (converter instanceof GenericHttpMessageConverter ? (GenericHttpMessageConverter&amp;lt;?&amp;gt;) converter : null);</span></span>
<span class="line"><span>         if (genericConverter != null ? genericConverter.canRead(targetType, contextClass, contentType) :</span></span>
<span class="line"><span>               (targetClass != null &amp;&amp; converter.canRead(targetClass, contentType))) {</span></span>
<span class="line"><span>            if (message.hasBody()) {</span></span>
<span class="line"><span>               //省略非关键代码：读取并转化 body</span></span>
<span class="line"><span>            else {</span></span>
<span class="line"><span>               //处理没有 body 情况，默认返回 null</span></span>
<span class="line"><span>               body = getAdvice().handleEmptyBody(null, message, parameter, targetType, converterType);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   catch (IOException ex) {</span></span>
<span class="line"><span>      throw new HttpMessageNotReadableException(&quot;I/O error while reading input message&quot;, ex, inputMessage);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   return body;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当 message 没有 body 时（ message.hasBody()为 false ），则将 body 认为是 null。继续查看 message 本身的定义，它是一种包装了请求 Header 和 Body 流的 EmptyBodyCheckingHttpInputMessage 类型。其代码实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public EmptyBodyCheckingHttpInputMessage(HttpInputMessage inputMessage) throws IOException {</span></span>
<span class="line"><span>   this.headers = inputMessage.getHeaders();</span></span>
<span class="line"><span>   InputStream inputStream = inputMessage.getBody();</span></span>
<span class="line"><span>   if (inputStream.markSupported()) {</span></span>
<span class="line"><span>      //省略其他非关键代码</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      PushbackInputStream pushbackInputStream = new PushbackInputStream(inputStream);</span></span>
<span class="line"><span>      int b = pushbackInputStream.read();</span></span>
<span class="line"><span>      if (b == -1) {</span></span>
<span class="line"><span>         this.body = null;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>         this.body = pushbackInputStream;</span></span>
<span class="line"><span>         pushbackInputStream.unread(b);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public InputStream getBody() {</span></span>
<span class="line"><span>   return (this.body != null ? this.body : StreamUtils.emptyInput());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Body 为空的判断是由 pushbackInputStream.read() 其值为 -1 来判断出的，即没有数据可以读取。</p><p>看到这里，你可能会有疑问：假设有Body，read()的执行不就把数据读取走了一点么？确实如此，所以这里我使用了 pushbackInputStream.unread(b) 调用来把读取出来的数据归还回去，这样就完成了是否有 Body 的判断，又保证了 Body 的完整性。</p><p>分析到这里，再结合前面的案例，你应该能想到造成 Body 缺失的原因了吧？</p><ol><li>本身就没有 Body；</li><li>有Body，但是 Body 本身代表的流已经被前面读取过了。</li></ol><p>很明显，我们的案例属于第2种情况，即在过滤器中，我们就已经将 Body 读取完了，关键代码如下：</p><blockquote><p>//request 是 ServletRequest</p><p>String requestBody = IOUtils.toString(request.getInputStream(), “utf-8”);</p></blockquote><p>在这种情况下，作为一个普通的流，已经没有数据可以供给后面的转化器来读取了。</p><h3 id="问题修正-2" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-2" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>所以我们可以直接在过滤器中去掉 Body 读取的代码，这样后续操作就又能读到数据了。但是这样又不满足我们的需求，如果我们坚持如此怎么办呢？这里我先直接给出答案，即定义一个 RequestBodyAdviceAdapter 的 Bean：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ControllerAdvice</span></span>
<span class="line"><span>public class PrintRequestBodyAdviceAdapter extends RequestBodyAdviceAdapter {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public boolean supports(MethodParameter methodParameter, Type type, Class&amp;lt;? extends HttpMessageConverter&amp;lt;?&amp;gt;&amp;gt; aClass) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Object afterBodyRead(Object body, HttpInputMessage inputMessage,MethodParameter parameter, Type targetType,</span></span>
<span class="line"><span>            Class&amp;lt;? extends HttpMessageConverter&amp;lt;?&amp;gt;&amp;gt; converterType) {</span></span>
<span class="line"><span>        System.out.println(&quot;print request body in advice:&quot; + body);</span></span>
<span class="line"><span>        return super.afterBodyRead(body, inputMessage, parameter, targetType, converterType);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到方法 afterBodyRead 的命名，很明显，这里的 Body 已经是从数据流中转化过的。</p><p>那么它是如何工作起来的呢？我们可以查看下面的代码（参考 AbstractMessageConverterMethodArgumentResolver#readWithMessageConverters）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected &amp;lt;T&amp;gt; Object readWithMessageConverters(HttpInputMessage inputMessage, MethodParameter parameter, Type targetType){</span></span>
<span class="line"><span>  //省略其他非关键代码</span></span>
<span class="line"><span>  if (message.hasBody()) {</span></span>
<span class="line"><span>    HttpInputMessage msgToUse = getAdvice().beforeBodyRead(message,      parameter, targetType, converterType);</span></span>
<span class="line"><span>    body = (genericConverter != null ? genericConverter.read(targetType, contextClass, msgToUse) :                    ((HttpMessageConverter&amp;lt;T&amp;gt;)converter).read(targetClass, msgToUse));</span></span>
<span class="line"><span>    body = getAdvice().afterBodyRead(body, msgToUse, parameter, targetType, converterType);</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略其他非关键代码</span></span>
<span class="line"><span>   return body;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当一个 Body 被解析出来后，会调用 getAdvice() 来获取 RequestResponseBodyAdviceChain；然后在这个 Chain 中，寻找合适的 Advice 并执行。</p><p>正好我们前面定义了 PrintRequestBodyAdviceAdapter，所以它的相关方法就被执行了。从执行时机来看，此时 Body 已经解析完毕了，也就是说，传递给 PrintRequestBodyAdviceAdapter 的 Body 对象已经是一个解析过的对象，而不再是一个流了。</p><p>通过上面的 Advice 方案，我们满足了类似的需求，又保证了程序的正确执行。至于其他的一些方案，你可以来思考一下。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过这节课的学习，相信你对 Spring Web 中关于 Body 解析的常见错误已经有所了解了，这里我们再次回顾下关键知识点：</p><ol><li>不同的 Body 需要不同的编解码器，而使用哪一种是协商出来的，协商过程大体如下：</li></ol><ul><li>查看请求头中是否有 ACCEPT 头，如果没有则可以使用任何类型；</li><li>查看当前针对返回类型（即 Student 实例）可以采用的编码类型；</li><li>取上面两步获取的结果的交集来决定用什么方式返回。</li></ul><ol start="2"><li><p>在非 Spring Boot 程序中，JSON 等编解码器不见得是内置好的，需要添加相关的 JAR 才能自动依赖上，而自动依赖的实现是通过检查 Class 是否存在来实现的：当依赖上相关的 JAR 后，关键的 Class 就存在了，响应的编解码器功能也就提供上了。</p></li><li><p>不同的编解码器的实现（例如 JSON 工具 Jaskson 和 Gson）可能有一些细节上的不同，所以你一定要注意当依赖一个新的 JAR 时，是否会引起默认编解码器的改变，从而影响到一些局部行为的改变。</p></li><li><p>在尝试读取 HTTP Body 时，你要注意到 Body 本身是一个流对象，不能被多次读取。</p></li></ol><p>以上即为这节课的主要内容，希望能对你有所帮助。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>通过案例 1 的学习，我们知道直接基于 Spring MVC 而非 Spring Boot 时，是需要我们手工添加 JSON 依赖，才能解析出 JSON 的请求或者编码 JSON 响应，那么为什么基于 Spring Boot 就不需要这样做了呢？</p><p>期待你的思考，我们留言区见！</p>`,121)])])}const m=a(t,[["render",l]]);export{g as __pageData,m as default};
