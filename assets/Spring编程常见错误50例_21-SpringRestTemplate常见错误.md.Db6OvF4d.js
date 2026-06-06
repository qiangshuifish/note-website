import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"21 | Spring Rest Template 常见错误","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：参数类型是 MultiValueMap","slug":"案例-1-参数类型是-multivaluemap","link":"#案例-1-参数类型是-multivaluemap","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：当 URL 中含有特殊字符","slug":"案例-2-当-url-中含有特殊字符","link":"#案例-2-当-url-中含有特殊字符","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"案例 3：小心多次 URL Encoder","slug":"案例-3-小心多次-url-encoder","link":"#案例-3-小心多次-url-encoder","children":[{"level":3,"title":"案例解析","slug":"案例解析-2","link":"#案例解析-2","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-2","link":"#问题修正-2","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/21-SpringRestTemplate常见错误.md","filePath":"Spring编程常见错误50例/21-SpringRestTemplate常见错误.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/21-SpringRestTemplate常见错误.md"};function l(i,a,r,o,c,u){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_21-spring-rest-template-常见错误" tabindex="-1">21 | Spring Rest Template 常见错误 <a class="header-anchor" href="#_21-spring-rest-template-常见错误" aria-label="Permalink to &quot;21 | Spring Rest Template 常见错误&quot;">​</a></h1><p>你好，我是傅健。</p><p>前面几节课，我们介绍了一个 Spring 微服务使用数据库过程中可能遇到的常见错误。而实际上，除了直接使用数据库外，使用其他微服务来完成功能也是一个常见的应用场景。</p><p>一般而言，微服务之间的通信大多都是使用 HTTP 方式进行的，这自然少不了使用 HttpClient。在不使用 Spring 之前，我们一般都是直接使用 Apache HttpClient 和 Ok HttpClient 等，而一旦你引入 Spring，你就有了一个更好的选择，这就是我们这一讲的主角 RestTemplate。那么在使用它的过程中，会遇到哪些错误呢？接下来我们就来总结下。</p><h2 id="案例-1-参数类型是-multivaluemap" tabindex="-1">案例 1：参数类型是 MultiValueMap <a class="header-anchor" href="#案例-1-参数类型是-multivaluemap" aria-label="Permalink to &quot;案例 1：参数类型是 MultiValueMap&quot;">​</a></h2><p>首先，我们先来完成一个 API 接口，代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.POST)</span></span>
<span class="line"><span>    public String hi(&amp;#64;RequestParam(&quot;para1&quot;) String para1, &amp;#64;RequestParam(&quot;para2&quot;) String para2){</span></span>
<span class="line"><span>        return &quot;helloworld:&quot; + para1 + &quot;,&quot; + para2;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们想完成的功能是接受一个 Form 表单请求，读取表单定义的两个参数 para1 和 para2，然后作为响应返回给客户端。</p><p>定义完这个接口后，我们使用 RestTemplate 来发送一个这样的表单请求，代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RestTemplate template = new RestTemplate();</span></span>
<span class="line"><span>Map&amp;lt;String, Object&amp;gt; paramMap = new HashMap&amp;lt;String, Object&amp;gt;();</span></span>
<span class="line"><span>paramMap.put(&quot;para1&quot;, &quot;001&quot;);</span></span>
<span class="line"><span>paramMap.put(&quot;para2&quot;, &quot;002&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String url = &quot;http://localhost:8080/hi&quot;;</span></span>
<span class="line"><span>String result = template.postForObject(url, paramMap, String.class);</span></span>
<span class="line"><span>System.out.println(result);</span></span></code></pre></div><p>上述代码定义了一个 Map，包含了 2 个表单参数，然后使用 RestTemplate 的 postForObject 提交这个表单。</p><p>测试后你会发现事与愿违，返回提示 400 错误，即请求出错：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/e25c882b09431822921f757a387db2a6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/e25c882b09431822921f757a387db2a6.png" alt=""></a></p><p>具体而言，就是缺少 para1 表单参数。为什么会出现这个错误呢？我们提交的表单最后又成了什么？</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>在具体解析这个问题之前，我们先来直观地了解下，当我们使用上述的 RestTemplate 提交表单，最后的提交请求长什么样？这里我使用 Wireshark 抓包工具直接给你抓取出来：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/dcdc5353ae0c4315908f3d3a0994464f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/dcdc5353ae0c4315908f3d3a0994464f.png" alt=""></a></p><p>从上图可以看出，我们实际上是将定义的表单数据以 JSON 请求体（Body）的形式提交过去了，所以我们的接口处理自然取不到任何表单参数。</p><p>那么为什么会以 JSON 请求体来提交数据呢？这里我们不妨扫一眼 RestTemplate 中执行上述代码时的关键几处代码调用。</p><p>首先，我们看下上述代码的调用栈：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/e13f82051d9daeff50cc489d339f5254.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/e13f82051d9daeff50cc489d339f5254.png" alt=""></a></p><p>确实可以验证，我们最终使用的是 Jackson 工具来对表单进行了序列化。使用到 JSON 的关键之处在于其中的关键调用 RestTemplate.HttpEntityRequestCallback#doWithRequest：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void doWithRequest(ClientHttpRequest httpRequest) throws IOException {</span></span>
<span class="line"><span>   super.doWithRequest(httpRequest);</span></span>
<span class="line"><span>   Object requestBody = this.requestEntity.getBody();</span></span>
<span class="line"><span>   if (requestBody == null) {</span></span>
<span class="line"><span>       //省略其他非关键代码</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; requestBodyClass = requestBody.getClass();</span></span>
<span class="line"><span>      Type requestBodyType = (this.requestEntity instanceof RequestEntity ?</span></span>
<span class="line"><span>            ((RequestEntity&amp;lt;?&amp;gt;)this.requestEntity).getType() : requestBodyClass);</span></span>
<span class="line"><span>      HttpHeaders httpHeaders = httpRequest.getHeaders();</span></span>
<span class="line"><span>      HttpHeaders requestHeaders = this.requestEntity.getHeaders();</span></span>
<span class="line"><span>      MediaType requestContentType = requestHeaders.getContentType();</span></span>
<span class="line"><span>      for (HttpMessageConverter&amp;lt;?&amp;gt; messageConverter : getMessageConverters()) {</span></span>
<span class="line"><span>         if (messageConverter instanceof GenericHttpMessageConverter) {</span></span>
<span class="line"><span>            GenericHttpMessageConverter&amp;lt;Object&amp;gt; genericConverter =</span></span>
<span class="line"><span>                  (GenericHttpMessageConverter&amp;lt;Object&amp;gt;) messageConverter;</span></span>
<span class="line"><span>            if (genericConverter.canWrite(requestBodyType, requestBodyClass, requestContentType)) {</span></span>
<span class="line"><span>               if (!requestHeaders.isEmpty()) {</span></span>
<span class="line"><span>                  requestHeaders.forEach((key, values) -&amp;gt; httpHeaders.put(key, new LinkedList&amp;lt;&amp;gt;(values)));</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>               logBody(requestBody, requestContentType, genericConverter);</span></span>
<span class="line"><span>               genericConverter.write(requestBody, requestBodyType, requestContentType, httpRequest);</span></span>
<span class="line"><span>               return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else if (messageConverter.canWrite(requestBodyClass, requestContentType)) {</span></span>
<span class="line"><span>            if (!requestHeaders.isEmpty()) {</span></span>
<span class="line"><span>               requestHeaders.forEach((key, values) -&amp;gt; httpHeaders.put(key, new LinkedList&amp;lt;&amp;gt;(values)));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            logBody(requestBody, requestContentType, messageConverter);</span></span>
<span class="line"><span>            ((HttpMessageConverter&amp;lt;Object&amp;gt;) messageConverter).write(</span></span>
<span class="line"><span>                  requestBody, requestContentType, httpRequest);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      String message = &quot;No HttpMessageConverter for &quot; + requestBodyClass.getName();</span></span>
<span class="line"><span>      if (requestContentType != null) {</span></span>
<span class="line"><span>         message += &quot; and content type \\&quot;&quot; + requestContentType + &quot;\\&quot;&quot;;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      throw new RestClientException(message);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码看起来比较复杂，实际上功能很简单：根据当前要提交的 Body 内容，遍历当前支持的所有编解码器，如果找到合适的编解码器，就使用它来完成 Body 的转化。这里我们不妨看下 JSON 的编解码器对是否合适的判断，参考 AbstractJackson2HttpMessageConverter#canWrite：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/c3b85b4bd1606628fe630f9aa8a217b8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/c3b85b4bd1606628fe630f9aa8a217b8.png" alt=""></a></p><p>可以看出，当我们使用的 Body 是一个 HashMap 时，是可以完成 JSON 序列化的。所以在后续将这个表单序列化为请求 Body 也就不奇怪了。</p><p>但是这里你可能会有一个疑问，为什么适应表单处理的编解码器不行呢？这里我们不妨继续看下对应的编解码器判断是否支持的实现，即 FormHttpMessageConverter#canWrite：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean canWrite(Class&amp;lt;?&amp;gt; clazz, &amp;#64;Nullable MediaType mediaType) {</span></span>
<span class="line"><span>   if (!MultiValueMap.class.isAssignableFrom(clazz)) {</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (mediaType == null || MediaType.ALL.equals(mediaType)) {</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   for (MediaType supportedMediaType : getSupportedMediaTypes()) {</span></span>
<span class="line"><span>      if (supportedMediaType.isCompatibleWith(mediaType)) {</span></span>
<span class="line"><span>         return true;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码可以看出，实际上，只有当我们发送的 Body 是 MultiValueMap 才能使用表单来提交。学到这里，你可能会豁然开朗。原来使用 RestTemplate 提交表单必须是 MultiValueMap，而我们案例定义的就是普通的 HashMap，最终是按请求 Body 的方式发送出去的。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>其实上面解释了那么多，相信你肯定知道怎么去解决这个问题了，其实很简单，把案例中的 HashMap 换成一个 MultiValueMap 类型来存储表单数据即可。修正代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//错误：</span></span>
<span class="line"><span>//Map&amp;lt;String, Object&amp;gt; paramMap = new HashMap&amp;lt;String, Object&amp;gt;();</span></span>
<span class="line"><span>//paramMap.put(&quot;para1&quot;, &quot;001&quot;);</span></span>
<span class="line"><span>//paramMap.put(&quot;para2&quot;, &quot;002&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//修正代码：</span></span>
<span class="line"><span>MultiValueMap&amp;lt;String, Object&amp;gt; paramMap = new LinkedMultiValueMap&amp;lt;String, Object&amp;gt;();</span></span>
<span class="line"><span>paramMap.add(&quot;para1&quot;, &quot;001&quot;);</span></span>
<span class="line"><span>paramMap.add(&quot;para2&quot;, &quot;002&quot;);</span></span></code></pre></div><p>最终你会发现，当完成上述修改后，表单数据最终使用下面的代码进行了编码，参考 FormHttpMessageConverter#write：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void write(MultiValueMap&amp;lt;String, ?&amp;gt; map, &amp;#64;Nullable MediaType contentType, HttpOutputMessage outputMessage)</span></span>
<span class="line"><span>      throws IOException, HttpMessageNotWritableException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   if (isMultipart(map, contentType)) {</span></span>
<span class="line"><span>      writeMultipart((MultiValueMap&amp;lt;String, Object&amp;gt;) map, contentType, outputMessage);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      writeForm((MultiValueMap&amp;lt;String, Object&amp;gt;) map, contentType, outputMessage);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>发送出的数据截图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/53a9691b6ed93b4cf1768fdb2183d640.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/53a9691b6ed93b4cf1768fdb2183d640.png" alt=""></a></p><p>这样就满足我们的需求了。</p><p>实际上，假设你仔细看文档的话，你可能也会规避这个问题，文档关键行如下：</p><blockquote><p>The body of the entity, or request itself, can be a MultiValueMap to create a multipart request. The values in the MultiValueMap can be any Object representing the body of the part, or an HttpEntity</p></blockquote><p>相信不用我讲，你也能看明白它说的正是我们刚刚费尽口舌去解释的事情。很多人还会犯错的原因大多都是没有耐心去看，或者懒得去看，更喜欢去“想当然”。在Spring 的使用上，这点是大忌。</p><h2 id="案例-2-当-url-中含有特殊字符" tabindex="-1">案例 2：当 URL 中含有特殊字符 <a class="header-anchor" href="#案例-2-当-url-中含有特殊字符" aria-label="Permalink to &quot;案例 2：当 URL 中含有特殊字符&quot;">​</a></h2><p>接下来，我们再来看一个关于 RestTemplate 使用的问题。我们还是使用之前类型的接口定义，不过稍微简化一下，代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String hi(&amp;#64;RequestParam(&quot;para1&quot;) String para1){</span></span>
<span class="line"><span>        return &quot;helloworld:&quot; + para1;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不需要我多介绍，你大体应该知道我们想实现的功能是什么了吧，无非就是提供一个带“参数”的 HTTP 接口而已。</p><p>然后我们使用下面的 RestTemplate 相关代码来测试一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String url = &quot;http://localhost:8080/hi?para1=1#2&quot;;</span></span>
<span class="line"><span>HttpEntity&amp;lt;?&amp;gt; entity = new HttpEntity&amp;lt;&amp;gt;(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RestTemplate restTemplate = new RestTemplate();</span></span>
<span class="line"><span>HttpEntity&amp;lt;String&amp;gt; response = restTemplate.exchange(url, HttpMethod.GET,entity,String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>System.out.println(response.getBody());</span></span></code></pre></div><p>当你看到这段测试代码，你觉得会输出什么呢？相信你很可能觉得是：</p><blockquote><p>helloworld:1#2</p></blockquote><p>但是实际上，事与愿违，结果是：</p><blockquote><p>helloworld:1</p></blockquote><p>即服务器并不认为 #2 是 para1 的内容。如何理解这个现象呢？接下来我们可以具体解析下。</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>类似案例 1 解析的套路，在具体解析之前，我们可以先直观感受下问题出在什么地方。我们使用调试方式去查看解析后的 URL，截图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/336c87351e732cdd2e2d6e13c725628c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/336c87351e732cdd2e2d6e13c725628c.png" alt=""></a></p><p>可以看出，para1 丢掉的 #2 实际是以 Fragment 的方式被记录下来了。这里顺便科普下什么是 Fragment，这得追溯到 URL 的格式定义：</p><blockquote><p>protocol://hostname[:port]/path/[?query]#fragment</p></blockquote><p>本案例中涉及到的两个关键元素解释如下：</p><ol><li>Query（查询参数）</li></ol><p>页面加载请求数据时需要的参数，用 &amp; 符号隔开，每个参数的名和值用 = 符号隔开。</p><ol start="2"><li>Fragment（锚点）</li></ol><p>#开始，字符串，用于指定网络资源中的片断。例如一个网页中有多个名词解释，可使用 Fragment 直接定位到某一名词的解释。例如定位网页滚动的位置，可以参考下面一些使用示例：</p><blockquote><p><a href="http://example.com/data.csv#row=4" target="_blank" rel="noreferrer">http://example.com/data.csv#row=4</a> – Selects the 4th row.</p><p><a href="http://example.com/data.csv#col=2" target="_blank" rel="noreferrer">http://example.com/data.csv#col=2</a> – Selects 2nd column.</p></blockquote><p>了解了这些补充知识后，我们其实就能知道问题出在哪了。不过本着严谨的态度，我们还是翻阅下源码。首先，我们先看下 URL 解析的调用栈，示例如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/bffa69910360ebbeb23e1da5cc515f0f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/bffa69910360ebbeb23e1da5cc515f0f.png" alt=""></a></p><p>参考上述调用栈，解析 URL 的关键点在于 UriComponentsBuilder#fromUriString 实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final Pattern URI_PATTERN = Pattern.compile(</span></span>
<span class="line"><span>      &quot;^(&quot; + SCHEME_PATTERN + &quot;)?&quot; + &quot;(//(&quot; + USERINFO_PATTERN + &quot;&amp;#64;)?&quot; + HOST_PATTERN + &quot;(:&quot; + PORT_PATTERN +</span></span>
<span class="line"><span>            &quot;)?&quot; + &quot;)?&quot; + PATH_PATTERN + &quot;(\\\\?&quot; + QUERY_PATTERN + &quot;)?&quot; + &quot;(#&quot; + LAST_PATTERN + &quot;)?&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static UriComponentsBuilder fromUriString(String uri) {</span></span>
<span class="line"><span>   Matcher matcher = URI_PATTERN.matcher(uri);</span></span>
<span class="line"><span>   if (matcher.matches()) {</span></span>
<span class="line"><span>      UriComponentsBuilder builder = new UriComponentsBuilder();</span></span>
<span class="line"><span>      String scheme = matcher.group(2);</span></span>
<span class="line"><span>      String userInfo = matcher.group(5);</span></span>
<span class="line"><span>      String host = matcher.group(6);</span></span>
<span class="line"><span>      String port = matcher.group(8);</span></span>
<span class="line"><span>      String path = matcher.group(9);</span></span>
<span class="line"><span>      String query = matcher.group(11);</span></span>
<span class="line"><span>      String fragment = matcher.group(13);</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>         builder.userInfo(userInfo);</span></span>
<span class="line"><span>         builder.host(host);</span></span>
<span class="line"><span>         if (StringUtils.hasLength(port)) {</span></span>
<span class="line"><span>            builder.port(port);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         builder.path(path);</span></span>
<span class="line"><span>         builder.query(query);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (StringUtils.hasText(fragment)) {</span></span>
<span class="line"><span>         builder.fragment(fragment);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return builder;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;[&quot; + uri + &quot;] is not a valid URI&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码实现中，我们可以看到关键的几句，这里我摘取了出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String query = matcher.group(11);</span></span>
<span class="line"><span>String fragment = matcher.group(13);</span></span></code></pre></div><p>很明显，Query 和 Fragment 都有所处理。最终它们根据 URI_PATTERN 各自找到了相应的值 (1和2)，虽然这并不符合我们的原始预期。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>那么怎么解决这个问题呢? 如果你不了解 RestTemplate 提供的各种 URL 组装方法，那你肯定是有点绝望的。这里我给出了代码修正方法，你可以先看看：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String url = &quot;http://localhost:8080/hi?para1=1#2&quot;;</span></span>
<span class="line"><span>UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);</span></span>
<span class="line"><span>URI uri = builder.build().encode().toUri();</span></span>
<span class="line"><span>HttpEntity&amp;lt;?&amp;gt; entity = new HttpEntity&amp;lt;&amp;gt;(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RestTemplate restTemplate = new RestTemplate();</span></span>
<span class="line"><span>HttpEntity&amp;lt;String&amp;gt; response = restTemplate.exchange(uri, HttpMethod.GET,entity,String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>System.out.println(response.getBody());</span></span></code></pre></div><p>最终测试结果符合预期：</p><blockquote><p>helloworld:1#2</p></blockquote><p>与之前的案例代码进行比较，你会发现 URL 的组装方式发生了改变。但最终可以获取到我们预期的效果，调试视图参考如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/1176447ec6a6a370590ee13b88c17d2e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/1176447ec6a6a370590ee13b88c17d2e.png" alt=""></a></p><p>可以看出，参数 para1 对应的值变成了我们期待的&quot;1#2&quot;。</p><p>如果你想了解更多的话，还可以参考 UriComponentsBuilder#fromHttpUrl，并与之前使用的 UriComponentsBuilder#fromUriString 进行比较：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final Pattern HTTP_URL_PATTERN = Pattern.compile(</span></span>
<span class="line"><span>      &quot;^&quot; + HTTP_PATTERN + &quot;(//(&quot; + USERINFO_PATTERN + &quot;&amp;#64;)?&quot; + HOST_PATTERN + &quot;(:&quot; + PORT_PATTERN + &quot;)?&quot; + &quot;)?&quot; +</span></span>
<span class="line"><span>            PATH_PATTERN + &quot;(\\\\?&quot; + LAST_PATTERN + &quot;)?&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static UriComponentsBuilder fromHttpUrl(String httpUrl) {</span></span>
<span class="line"><span>   Assert.notNull(httpUrl, &quot;HTTP URL must not be null&quot;);</span></span>
<span class="line"><span>   Matcher matcher = HTTP_URL_PATTERN.matcher(httpUrl);</span></span>
<span class="line"><span>   if (matcher.matches()) {</span></span>
<span class="line"><span>      UriComponentsBuilder builder = new UriComponentsBuilder();</span></span>
<span class="line"><span>      String scheme = matcher.group(1);</span></span>
<span class="line"><span>      builder.scheme(scheme != null ? scheme.toLowerCase() : null);</span></span>
<span class="line"><span>      builder.userInfo(matcher.group(4));</span></span>
<span class="line"><span>      String host = matcher.group(5);</span></span>
<span class="line"><span>      if (StringUtils.hasLength(scheme) &amp;&amp; !StringUtils.hasLength(host)) {</span></span>
<span class="line"><span>         throw new IllegalArgumentException(&quot;[&quot; + httpUrl + &quot;] is not a valid HTTP URL&quot;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      builder.host(host);</span></span>
<span class="line"><span>      String port = matcher.group(7);</span></span>
<span class="line"><span>      if (StringUtils.hasLength(port)) {</span></span>
<span class="line"><span>         builder.port(port);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      builder.path(matcher.group(8));</span></span>
<span class="line"><span>      builder.query(matcher.group(10));</span></span>
<span class="line"><span>      return builder;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;[&quot; + httpUrl + &quot;] is not a valid HTTP URL&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，这里只解析了Query并没有去尝试解析 Fragment，所以最终获取到的结果符合预期。</p><p>通过这个例子我们可以知道，当 URL 中含有特殊字符时，一定要注意 URL 的组装方式，尤其是要区别下面这两种方式：</p><blockquote><p>UriComponentsBuilder#fromHttpUrl</p><p>UriComponentsBuilder#fromUriString</p></blockquote><h2 id="案例-3-小心多次-url-encoder" tabindex="-1">案例 3：小心多次 URL Encoder <a class="header-anchor" href="#案例-3-小心多次-url-encoder" aria-label="Permalink to &quot;案例 3：小心多次 URL Encoder&quot;">​</a></h2><p>接下来，我们继续看一个案例，这里完全沿用之前的接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String hi(&amp;#64;RequestParam(&quot;para1&quot;) String para1){</span></span>
<span class="line"><span>        return &quot;helloworld:&quot; + para1;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后我们可以换一种使用方式来访问这个接口，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RestTemplate restTemplate = new RestTemplate();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(&quot;http://localhost:8080/hi&quot;);</span></span>
<span class="line"><span>builder.queryParam(&quot;para1&quot;, &quot;开发测试 001&quot;);</span></span>
<span class="line"><span>String url = builder.toUriString();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ResponseEntity&amp;lt;String&amp;gt; forEntity = restTemplate.getForEntity(url, String.class);</span></span>
<span class="line"><span>System.out.println(forEntity.getBody());</span></span></code></pre></div><p>我们期待的结果是&quot;helloworld:开发测试 001&quot;，但是运行上述代码后，你会发现结果却是下面这样：</p><blockquote><p>helloworld:%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95001</p></blockquote><p>如何理解这个问题呢？</p><h3 id="案例解析-2" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-2" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>要了解这个案例，我们就需要对上述代码中关于 URL 的处理有个简单的了解。首先我们看下案例中的代码调用：</p><blockquote><p>String url = builder.toUriString();</p></blockquote><p>它执行的方式是 UriComponentsBuilder#toUriString：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public String toUriString() {</span></span>
<span class="line"><span>   return this.uriVariables.isEmpty() ?</span></span>
<span class="line"><span>         build().encode().toUriString() :</span></span>
<span class="line"><span>         buildInternal(EncodingHint.ENCODE_TEMPLATE).toUriString();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，它最终执行了 URL Encode：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final UriComponents encode() {</span></span>
<span class="line"><span>   return encode(StandardCharsets.UTF_8);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>查询调用栈，结果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/c69263f6aa82278f48e2cd9c2fb06b18.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/c69263f6aa82278f48e2cd9c2fb06b18.png" alt=""></a></p><p>而当我们把 URL 转化成 String，再通过下面的语句来发送请求时：</p><blockquote><p>//url 是一个 string</p><p>restTemplate.getForEntity(url, String.class);</p></blockquote><p>我们会发现，它会再进行一次编码：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/226c1f7dd944cba75e987535ea4b197a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/226c1f7dd944cba75e987535ea4b197a.png" alt=""></a></p><p>看到这里，你或许已经明白问题出在哪了，即我们按照案例的代码会执行 2 次编码（Encode），所以最终我们反而获取不到想要的结果了。</p><p>另外，我们还可以分别查看下两次编码后的结果，示例如下：</p><p>1 次编码后：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/ae27fbb9aa532af7f7d875e1e198595a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/ae27fbb9aa532af7f7d875e1e198595a.png" alt=""></a></p><p>2 次编码后：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/ab7042159955050800077dc390db4901.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382710/ab7042159955050800077dc390db4901.png" alt=""></a></p><h3 id="问题修正-2" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-2" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>如何修正? 直接上代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RestTemplate restTemplate = new RestTemplate();</span></span>
<span class="line"><span>UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(&quot;http://localhost:8080/hi&quot;);</span></span>
<span class="line"><span>builder.queryParam(&quot;para1&quot;, &quot;开发测试 001&quot;);</span></span>
<span class="line"><span>URI url = builder.encode().build().toUri();</span></span>
<span class="line"><span>ResponseEntity&amp;lt;String&amp;gt; forEntity = restTemplate.getForEntity(url, String.class);</span></span>
<span class="line"><span>System.out.println(forEntity.getBody());</span></span></code></pre></div><p>其实说白了，这种修正方式就是 <strong>避免多次转化而发生多次编码</strong>。这里不再赘述其内部实现，因为正确的方式并非这次解析的重点，你能意识到这个问题出在哪，我们的目的就达到了。</p><p>重新运行测试，结果符合预期：</p><blockquote><p>helloworld:开发测试 001</p></blockquote><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>这节课我们学习了 RestTemplate 使用中经常遇到的 3 个典型问题，这里再次梳理下关键知识点：</p><ol><li>当使用 RestTemplate 组装表单数据时，我们应该注意要使用 MultiValueMap 而非普通的 HashMap。否则会以 JSON 请求体的形式发送请求而非表单，正确示例如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MultiValueMap&amp;lt;String, Object&amp;gt; paramMap = new LinkedMultiValueMap&amp;lt;String, Object&amp;gt;();</span></span>
<span class="line"><span>paramMap.add(&quot;para1&quot;, &quot;001&quot;);</span></span>
<span class="line"><span>paramMap.add(&quot;para2&quot;, &quot;002&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String url = &quot;http://localhost:8080/hi&quot;;</span></span>
<span class="line"><span>String result = template.postForObject(url, paramMap, String.class);</span></span>
<span class="line"><span>System.out.println(result)</span></span></code></pre></div><ol start="2"><li>当使用 RestTemplate 发送请求时，如果带有查询（Query）参数，我们一定要注意是否含有一些特殊字符（#）。如果有的话，可以使用下面的 URL 组装方式进行规避：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String url = &quot;http://localhost:8080/hi?para1=1#2&quot;;</span></span>
<span class="line"><span>UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);</span></span>
<span class="line"><span>URI uri = builder.build().encode().toUri();</span></span></code></pre></div><ol start="3"><li>在 RestTemplate 中使用 URL，我们一定要避免多次转化而导致的多次编码问题。</li></ol><p>以上即为这节课的重点，其实都不难，先掌握了然后灵活变通就好。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>当我们比较案例 1 和案例 2，你会发现不管使用的是查询（Query）参数还是表单（Form）参数，我们的接口定义并没有什么变化，风格如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String hi(&amp;#64;RequestParam(&quot;para1&quot;) String para1){</span></span>
<span class="line"><span>        return &quot;helloworld:&quot; + para1;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那是不是 @RequestParam 本身就能处理这两种数据呢？</p><p>期待你的思考，我们留言区见！</p>`,128)])])}const d=s(t,[["render",l]]);export{h as __pageData,d as default};
