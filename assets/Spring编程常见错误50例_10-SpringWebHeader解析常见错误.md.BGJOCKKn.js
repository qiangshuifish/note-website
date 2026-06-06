import{_ as e,H as s,f as n,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"10 | Spring Web Header 解析常见错误","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：接受 Header 使用错 Map 类型","slug":"案例-1-接受-header-使用错-map-类型","link":"#案例-1-接受-header-使用错-map-类型","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：错认为 Header 名称首字母可以一直忽略大小写","slug":"案例-2-错认为-header-名称首字母可以一直忽略大小写","link":"#案例-2-错认为-header-名称首字母可以一直忽略大小写","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"案例 3：试图在 Controller 中随意自定义 CONTENT_TYPE 等","slug":"案例-3-试图在-controller-中随意自定义-content-type-等","link":"#案例-3-试图在-controller-中随意自定义-content-type-等","children":[{"level":3,"title":"案例解析","slug":"案例解析-2","link":"#案例解析-2","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-2","link":"#问题修正-2","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/10-SpringWebHeader解析常见错误.md","filePath":"Spring编程常见错误50例/10-SpringWebHeader解析常见错误.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/10-SpringWebHeader解析常见错误.md"};function l(i,a,r,o,c,d){return s(),n("div",null,[...a[0]||(a[0]=[p(`<h1 id="_10-spring-web-header-解析常见错误" tabindex="-1">10 | Spring Web Header 解析常见错误 <a class="header-anchor" href="#_10-spring-web-header-解析常见错误" aria-label="Permalink to &quot;10 | Spring Web Header 解析常见错误&quot;">​</a></h1><p>你好，我是傅健，这节课我们来聊聊 Spring Web 开发中 Header 相关的常见错误案例。</p><p>在上节课，我们梳理了 URL 相关错误。实际上，对于一个 HTTP 请求而言，URL 固然重要，但是为了便于用户使用，URL 的长度有限，所能携带的信息也因此受到了制约。</p><p>如果想提供更多的信息，Header 往往是不二之举。不言而喻，Header 是介于 URL 和 Body 之外的第二大重要组成，它提供了更多的信息以及围绕这些信息的相关能力，例如Content-Type指定了我们的请求或者响应的内容类型，便于我们去做解码。虽然 Spring 对于 Header 的解析，大体流程和 URL 相同，但是 Header 本身具有自己的特点。例如，Header 不像 URL 只能出现在请求中。所以，Header 处理相关的错误和 URL 又不尽相同。接下来我们看看具体的案例。</p><h2 id="案例-1-接受-header-使用错-map-类型" tabindex="-1">案例 1：接受 Header 使用错 Map 类型 <a class="header-anchor" href="#案例-1-接受-header-使用错-map-类型" aria-label="Permalink to &quot;案例 1：接受 Header 使用错 Map 类型&quot;">​</a></h2><p>在 Spring 中解析 Header 时，我们在多数场合中是直接按需解析的。例如，我们想使用一个名为myHeaderName的 Header，我们会书写代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi(&amp;#64;RequestHeader(&quot;myHeaderName&quot;) String name){</span></span>
<span class="line"><span>   //省略 body 处理</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>定义一个参数，标记上@RequestHeader，指定要解析的 Header 名即可。但是假设我们需要解析的 Header 很多时，按照上面的方式很明显会使得参数越来越多。在这种情况下，我们一般都会使用 Map 去把所有的 Header 都接收到，然后直接对 Map 进行处理。于是我们可能会写出下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi1&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi1(&amp;#64;RequestHeader() Map map){</span></span>
<span class="line"><span>    return map.toString();</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>粗略测试程序，你会发现一切都很好。而且上面的代码也符合针对接口编程的范式，即使用了 Map 这个接口类型。但是上面的接口定义在遇到下面的请求时，就会超出预期。请求如下：</p><blockquote><p>GET <a href="http://localhost:8080/hi1" target="_blank" rel="noreferrer">http://localhost:8080/hi1</a></p><p>myheader: h1</p><p>myheader: h2</p></blockquote><p>这里存在一个 Header 名为 myHeader，不过这个 Header 有两个值。此时我们执行请求，会发现返回的结果并不能将这两个值如数返回。结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{myheader=h1, host=localhost:8080, connection=Keep-Alive, user-agent=Apache-HttpClient/4.5.12 (Java/11.0.6), accept-encoding=gzip,deflate}</span></span></code></pre></div><p>如何理解这个常见错误及背后原理？接下来我们就具体解析下。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>实际上，当我们看到这个测试结果，大多数同学已经能反应过来了。对于一个多值的 Header，在实践中，通常有两种方式来实现，一种是采用下面的方式：</p><blockquote><p>Key: value1,value2</p></blockquote><p>而另外一种方式就是我们测试请求中的格式：</p><blockquote><p>Key:value1</p><p>Key:value2</p></blockquote><p>对于方式 1，我们使用 Map 接口自然不成问题。但是如果使用的是方式 2，我们就不能拿到所有的值。这里我们可以翻阅代码查下 Map 是如何接收到所有请求的。</p><p>对于一个 Header 的解析，主要有两种方式，分别实现在 RequestHeaderMethodArgumentResolver 和 RequestHeaderMapMethodArgumentResolver 中，它们都继承于 AbstractNamedValueMethodArgumentResolver，但是应用的场景不同，我们可以对比下它们的 supportsParameter()，来对比它们适合的场景：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/373942/f7f804ec3e447c95eafde8cc5255bee6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/373942/f7f804ec3e447c95eafde8cc5255bee6.png" alt=""></a></p><p>在上图中，左边是 RequestHeaderMapMethodArgumentResolver 的方法。通过比较可以发现，对于一个标记了 @RequestHeader 的参数，如果它的类型是 Map，则使用 RequestHeaderMapMethodArgumentResolver，否则一般使用的是 RequestHeaderMethodArgumentResolver。</p><p>在我们的案例中，很明显，参数类型定义为 Map，所以使用的自然是 RequestHeaderMapMethodArgumentResolver。接下来，我们继续查看它是如何解析 Header 的，关键代码参考 resolveArgument()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public Object resolveArgument(MethodParameter parameter, &amp;#64;Nullable ModelAndViewContainer mavContainer,</span></span>
<span class="line"><span>      NativeWebRequest webRequest, &amp;#64;Nullable WebDataBinderFactory binderFactory) throws Exception {</span></span>
<span class="line"><span>   Class&amp;lt;?&amp;gt; paramType = parameter.getParameterType();</span></span>
<span class="line"><span>   if (MultiValueMap.class.isAssignableFrom(paramType)) {</span></span>
<span class="line"><span>      MultiValueMap&amp;lt;String, String&amp;gt; result;</span></span>
<span class="line"><span>      if (HttpHeaders.class.isAssignableFrom(paramType)) {</span></span>
<span class="line"><span>         result = new HttpHeaders();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>         result = new LinkedMultiValueMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      for (Iterator&amp;lt;String&amp;gt; iterator = webRequest.getHeaderNames(); iterator.hasNext();) {</span></span>
<span class="line"><span>         String headerName = iterator.next();</span></span>
<span class="line"><span>         String[] headerValues = webRequest.getHeaderValues(headerName);</span></span>
<span class="line"><span>         if (headerValues != null) {</span></span>
<span class="line"><span>            for (String headerValue : headerValues) {</span></span>
<span class="line"><span>               result.add(headerName, headerValue);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return result;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      Map&amp;lt;String, String&amp;gt; result = new LinkedHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>      for (Iterator&amp;lt;String&amp;gt; iterator = webRequest.getHeaderNames(); iterator.hasNext();) {</span></span>
<span class="line"><span>         String headerName = iterator.next();</span></span>
<span class="line"><span>         //只取了一个“值”</span></span>
<span class="line"><span>         String headerValue = webRequest.getHeader(headerName);</span></span>
<span class="line"><span>         if (headerValue != null) {</span></span>
<span class="line"><span>            result.put(headerName, headerValue);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return result;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>针对我们的案例，这里并不是 MultiValueMap，所以我们会走入 else 分支。这个分支首先会定义一个 LinkedHashMap，然后将请求一一放置进去，并返回。其中第 29 行是去解析获取 Header 值的实际调用，在不同的容器下实现不同。例如在 Tomcat 容器下，它的执行方法参考 MimeHeaders#getValue：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public MessageBytes getValue(String name) {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; count; i++) {</span></span>
<span class="line"><span>        if (headers[i].getName().equalsIgnoreCase(name)) {</span></span>
<span class="line"><span>            return headers[i].getValue();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当一个请求出现多个同名 Header 时，我们只要匹配上任何一个即立马返回。所以在本案例中，只返回了一个 Header 的值。</p><p>其实换一个角度思考这个问题，毕竟前面已经定义的接收类型是 LinkedHashMap，它的 Value 的泛型类型是 String，也不适合去组织多个值的情况。综上，不管是结合代码还是常识，本案例的代码都不能获取到myHeader的所有值。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>现在我们要修正这个问题。在案例解析部分，其实我已经给出了答案。</p><p>在 RequestHeaderMapMethodArgumentResolver 的 resolveArgument() 中，假设我们的参数类型是 MultiValueMap，我们一般会创建一个 LinkedMultiValueMap，然后使用下面的语句来获取 Header 的值并添加到 Map 中去：</p><blockquote><p>String[] headerValues = webRequest.getHeaderValues(headerName)</p></blockquote><p>参考上面的语句，不用细究，我们也能看出，我们是可以获取多个 Header 值的。另外假设我们定义的是 HttpHeaders（也是一种 MultiValueMap），我们会直接创建一个 HttpHeaders 来存储所有的 Header。</p><p>有了上面的解析，我们可以得出这样一个结论： <strong>要完整接收到所有的Header，不能直接使用Map而应该使用MultiValueMap。</strong> 我们可以采用以下两种方式来修正这个问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//方式 1</span></span>
<span class="line"><span>&amp;#64;RequestHeader() MultiValueMap map</span></span>
<span class="line"><span>//方式 2</span></span>
<span class="line"><span>&amp;#64;RequestHeader() HttpHeaders map</span></span></code></pre></div><p>重新运行测试，你会发现结果符合预期：</p><blockquote><p>[myheader:&quot;h1&quot;, &quot;h2&quot;, host:&quot;localhost:8080&quot;, connection:&quot;Keep-Alive&quot;, user-agent:&quot;Apache-HttpClient/4.5.12 (Java/11.0.6)&quot;, accept-encoding:&quot;gzip,deflate&quot;]</p></blockquote><p>对比来说，方式 2 更值得推荐，因为它使用了大多数人常用的 Header 获取方法，例如获取 Content-Type 直接调用它的 getContentType() 即可，诸如此类，非常好用。</p><p>反思这个案例，我们为什么会犯这种错误呢？追根溯源，还是在于我们很少看到一个 Header 有多个值的情况，从而让我们疏忽地用错了接收类型。</p><h2 id="案例-2-错认为-header-名称首字母可以一直忽略大小写" tabindex="-1">案例 2：错认为 Header 名称首字母可以一直忽略大小写 <a class="header-anchor" href="#案例-2-错认为-header-名称首字母可以一直忽略大小写" aria-label="Permalink to &quot;案例 2：错认为 Header 名称首字母可以一直忽略大小写&quot;">​</a></h2><p>在 HTTP 协议中，Header 的名称是无所谓大小写的。在使用各种框架构建 Web 时，我们都会把这个事实铭记于心。我们可以验证下这个想法。例如，我们有一个 Web 服务接口如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi2(&amp;#64;RequestHeader(&quot;MyHeader&quot;) String myHeader){</span></span>
<span class="line"><span>    return myHeader;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>然后，我们使用下面的请求来测试这个接口是可以获取到对应的值的：</p><blockquote><p>GET <a href="http://localhost:8080/hi2" target="_blank" rel="noreferrer">http://localhost:8080/hi2</a></p><p>myheader: myheadervalue</p></blockquote><p>另外，结合案例1，我们知道可以使用 Map 来接收所有的 Header，那么这种方式下是否也可以忽略大小写呢？这里我们不妨使用下面的代码来比较下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi2(&amp;#64;RequestHeader(&quot;MyHeader&quot;) String myHeader, &amp;#64;RequestHeader MultiValueMap map){</span></span>
<span class="line"><span>    return myHeader + &quot; compare with : &quot; + map.get(&quot;MyHeader&quot;);</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>再次运行之前的测试请求，我们得出下面的结果：</p><blockquote><p>myheadervalue compare with : null</p></blockquote><p>综合来看，直接获取 Header 是可以忽略大小写的，但是如果从接收过来的 Map 中获取 Header 是不能忽略大小写的。稍微不注意，我们就很容易认为 Header 在任何情况下，都可以不区分大小写来获取值。</p><p>那么针对这个案例，如何去理解？</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们知道，对于&quot;@RequestHeader(&quot;MyHeader&quot;) String myHeader&quot;的定义，Spring 使用的是 RequestHeaderMethodArgumentResolver 来做解析。解析的方法参考 RequestHeaderMethodArgumentResolver#resolveName：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object resolveName(String name, MethodParameter parameter, NativeWebRequest request) throws Exception {</span></span>
<span class="line"><span>   String[] headerValues = request.getHeaderValues(name);</span></span>
<span class="line"><span>   if (headerValues != null) {</span></span>
<span class="line"><span>      return (headerValues.length == 1 ? headerValues[0] : headerValues);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述方法的关键调用&quot;request.getHeaderValues(name)&quot;去按图索骥，我们可以找到查找 Header 的最根本方法，即 org.apache.tomcat.util.http.ValuesEnumerator#findNext：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void findNext() {</span></span>
<span class="line"><span>    next=null;</span></span>
<span class="line"><span>    for(; pos&amp;lt; size; pos++ ) {</span></span>
<span class="line"><span>        MessageBytes n1=headers.getName( pos );</span></span>
<span class="line"><span>        if( n1.equalsIgnoreCase( name )) {</span></span>
<span class="line"><span>            next=headers.getValue( pos );</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    pos++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述方法中，name 即为查询的 Header 名称，可以看出这里是忽略大小写的。</p><p>而如果我们用 Map 来接收所有的 Header，我们来看下这个 Map 最后存取的 Header 和获取的方法有没有忽略大小写。</p><p>有了案例 1 的解析，针对当前的类似案例，结合具体的代码，我们很容易得出下面两个结论。</p><p><strong>1. 存取 Map 的 Header 是没有忽略大小写的</strong></p><p>参考案例 1 解析部分贴出的代码，可以看出，在存取 Header 时，需要的 key 是遍历 webRequest.getHeaderNames() 的返回结果。而这个方法的执行过程参考 org.apache.tomcat.util.http.NamesEnumerator#findNext：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void findNext() {</span></span>
<span class="line"><span>    next=null;</span></span>
<span class="line"><span>    for(; pos&amp;lt; size; pos++ ) {</span></span>
<span class="line"><span>        next=headers.getName( pos ).toString();</span></span>
<span class="line"><span>        for( int j=0; j&amp;lt;pos ; j++ ) {</span></span>
<span class="line"><span>            if( headers.getName( j ).equalsIgnoreCase( next )) {</span></span>
<span class="line"><span>                // duplicate.</span></span>
<span class="line"><span>                next=null;</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if( next!=null ) {</span></span>
<span class="line"><span>            // it&#39;s not a duplicate</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // next time findNext is called it will try the</span></span>
<span class="line"><span>    // next element</span></span>
<span class="line"><span>    pos++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里，返回结果并没有针对 Header 的名称做任何大小写忽略或转化工作。</p><p><strong>2. 从 Map 中获取的 Header 也没有忽略大小写</strong></p><p>这点可以从返回是 LinkedHashMap 类型看出，LinkedHashMap 的 get() 未忽略大小写。</p><p>接下来我们看下怎么解决。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>就从接收类型 Map 中获取 Header 时注意下大小写就可以了，修正代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi2(&amp;#64;RequestHeader(&quot;MyHeader&quot;) String myHeader, &amp;#64;RequestHeader MultiValueMap map){</span></span>
<span class="line"><span>    return myHeader + &quot; compare with : &quot; + map.get(&quot;myHeader&quot;);</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>另外，你可以思考一个问题，如果我们使用 HTTP Headers 来接收请求，那么从它里面获取 Header 是否可以忽略大小写呢？</p><p>这点你可以通过它的构造器推测出来，其构造器代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public HttpHeaders() {</span></span>
<span class="line"><span>   this(CollectionUtils.toMultiValueMap(new LinkedCaseInsensitiveMap&amp;lt;&amp;gt;(8, Locale.ENGLISH)));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，它使用的是 LinkedCaseInsensitiveMap，而不是普通的 LinkedHashMap。所以这里是可以忽略大小写的，我们不妨这样修正：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi2&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi2(&amp;#64;RequestHeader(&quot;MyHeader&quot;) String myHeader, &amp;#64;RequestHeader HttpHeaders map){</span></span>
<span class="line"><span>    return myHeader + &quot; compare with : &quot; + map.get(&quot;MyHeader&quot;);</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>再运行下程序，结果已经符合我们的预期了：</p><blockquote><p>myheadervalue compare with : [myheadervalue]</p></blockquote><p>通过这个案例，我们可以看出： <strong>在实际使用时，虽然 HTTP 协议规范可以忽略大小写，但是不是所有框架提供的接口方法都是可以忽略大小写的。</strong> 这点你一定要注意！</p><h2 id="案例-3-试图在-controller-中随意自定义-content-type-等" tabindex="-1">案例 3：试图在 Controller 中随意自定义 CONTENT_TYPE 等 <a class="header-anchor" href="#案例-3-试图在-controller-中随意自定义-content-type-等" aria-label="Permalink to &quot;案例 3：试图在 Controller 中随意自定义 CONTENT\\_TYPE 等&quot;">​</a></h2><p>和开头我们提到的 Header 和 URL 不同，Header 可以出现在返回中。正因为如此，一些应用会试图去定制一些 Header 去处理。例如使用 Spring Boot 基于 Tomcat 内置容器的开发中，存在下面这样一段代码去设置两个 Header，其中一个是常用的 CONTENT_TYPE，另外一个是自定义的，命名为 myHeader。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi3&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>public String hi3(HttpServletResponse httpServletResponse){</span></span>
<span class="line"><span>  httpServletResponse.addHeader(&quot;myheader&quot;, &quot;myheadervalue&quot;);</span></span>
<span class="line"><span>  httpServletResponse.addHeader(HttpHeaders.CONTENT_TYPE, &quot;application/json&quot;);</span></span>
<span class="line"><span>    return &quot;ok&quot;;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>运行程序测试下（访问 GET <a href="http://localhost:8080/hi3" target="_blank" rel="noreferrer">http://localhost:8080/hi3</a> ），我们会得到如下结果：</p><blockquote><p>GET <a href="http://localhost:8080/hi3" target="_blank" rel="noreferrer">http://localhost:8080/hi3</a></p><p>HTTP/1.1 200</p><p>myheader: myheadervalue</p><p>Content-Type: text/plain;charset=UTF-8</p><p>Content-Length: 2</p><p>Date: Wed, 17 Mar 2021 08:59:56 GMT</p><p>Keep-Alive: timeout=60</p><p>Connection: keep-alive</p></blockquote><p>可以看到 myHeader 设置成功了，但是 Content-Type 并没有设置成我们想要的&quot;application/json&quot;，而是&quot;text/plain;charset=UTF-8&quot;。为什么会出现这种错误？</p><h3 id="案例解析-2" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-2" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>首先我们来看下在 Spring Boot 使用内嵌 Tomcat 容器时，尝试添加 Header 会执行哪些关键步骤。</p><p>第一步我们可以查看 org.apache.catalina.connector.Response#addHeader 方法，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void addHeader(String name, String value, Charset charset) {</span></span>
<span class="line"><span>    //省略其他非关键代码</span></span>
<span class="line"><span>    char cc=name.charAt(0);</span></span>
<span class="line"><span>    if (cc==&#39;C&#39; || cc==&#39;c&#39;) {</span></span>
<span class="line"><span>        //判断是不是 Content-Type，如果是不要把这个 Header 作为 header 添加到 org.apache.coyote.Response</span></span>
<span class="line"><span>        if (checkSpecialHeader(name, value))</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    getCoyoteResponse().addHeader(name, value, charset);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>参考代码及注释，正常添加一个 Header 是可以添加到 Header 集里面去的，但是如果这是一个 Content-Type，则事情会变得不一样。它并不会如此做，而是去做另外一件事，即通过 Response#checkSpecialHeader 的调用来设置 org.apache.coyote.Response#contentType 为 application/json，关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean checkSpecialHeader(String name, String value) {</span></span>
<span class="line"><span>    if (name.equalsIgnoreCase(&quot;Content-Type&quot;)) {</span></span>
<span class="line"><span>        setContentType(value);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终我们获取到的 Response 如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/373942/5f6e7b91eedcbdc98c124cac6f00f85e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/373942/5f6e7b91eedcbdc98c124cac6f00f85e.png" alt=""></a></p><p>从上图可以看出，Headers 里并没有 Content-Type，而我们设置的 Content-Type 已经作为 coyoteResponse 成员的值了。当然也不意味着后面一定不会返回，我们可以继续跟踪后续执行。</p><p>在案例代码返回ok后，我们需要对返回结果进行处理，执行方法为RequestResponseBodyMethodProcessor#handleReturnValue，关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public void handleReturnValue(&amp;#64;Nullable Object returnValue, MethodParameter returnType,</span></span>
<span class="line"><span>      ModelAndViewContainer mavContainer, NativeWebRequest webRequest)</span></span>
<span class="line"><span>      throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   mavContainer.setRequestHandled(true);</span></span>
<span class="line"><span>   ServletServerHttpRequest inputMessage = createInputMessage(webRequest);</span></span>
<span class="line"><span>   ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //对返回值(案例中为“ok”)根据返回类型做编码转化处理</span></span>
<span class="line"><span>   writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而在上述代码的调用中，writeWithMessageConverters 会根据返回值及类型做转化，同时也会做一些额外的事情。它的一些关键实现步骤参考下面几步：</p><p><strong>1. 决定用哪一种 MediaType 返回</strong></p><p>参考下面的关键代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   //决策返回值是何种 MediaType</span></span>
<span class="line"><span>   MediaType selectedMediaType = null;</span></span>
<span class="line"><span>   MediaType contentType = outputMessage.getHeaders().getContentType();</span></span>
<span class="line"><span>   boolean isContentTypePreset = contentType != null &amp;&amp; contentType.isConcrete();</span></span>
<span class="line"><span>   //如果 header 中有 contentType，则用其作为选择的 selectedMediaType。</span></span>
<span class="line"><span>   if (isContentTypePreset) {</span></span>
<span class="line"><span>      selectedMediaType = contentType;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //没有，则根据“Accept”头、返回值等核算用哪一种</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      HttpServletRequest request = inputMessage.getServletRequest();</span></span>
<span class="line"><span>      List&amp;lt;MediaType&amp;gt; acceptableTypes = getAcceptableMediaTypes(request);</span></span>
<span class="line"><span>      List&amp;lt;MediaType&amp;gt; producibleTypes = getProducibleMediaTypes(request, valueType, targetType);</span></span>
<span class="line"><span>      //省略其他非关键代码</span></span>
<span class="line"><span>      List&amp;lt;MediaType&amp;gt; mediaTypesToUse = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>      for (MediaType requestedType : acceptableTypes) {</span></span>
<span class="line"><span>         for (MediaType producibleType : producibleTypes) {</span></span>
<span class="line"><span>            if (requestedType.isCompatibleWith(producibleType)) {</span></span>
<span class="line"><span> mediaTypesToUse.add(getMostSpecificMediaType(requestedType, producibleType));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //省略其他关键代码</span></span>
<span class="line"><span>      for (MediaType mediaType : mediaTypesToUse) {</span></span>
<span class="line"><span>         if (mediaType.isConcrete()) {</span></span>
<span class="line"><span>            selectedMediaType = mediaType;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>        //省略其他关键代码</span></span>
<span class="line"><span>      }</span></span></code></pre></div><p>​这里我解释一下，上述代码是先根据是否具有 Content-Type 头来决定返回的 MediaType，通过前面的分析它是一种特殊的 Header，在 Controller 层并没有被添加到 Header 中去，所以在这里只能根据返回的类型、请求的 Accept 等信息协商出最终用哪种 MediaType。</p><p>实际上这里最终使用的是 MediaType#TEXT_PLAIN。这里还需要补充说明下，没有选择 JSON 是因为在都支持的情况下，TEXT_PLAIN 默认优先级更高，参考代码 WebMvcConfigurationSupport#addDefaultHttpMessageConverters 可以看出转化器是有优先顺序的，所以用上述代码中的 getProducibleMediaTypes() 遍历 Converter 来收集可用 MediaType 也是有顺序的。</p><p><strong>2. 选择消息转化器并完成转化</strong></p><p>决定完 MediaType 信息后，即可去选择转化器并执行转化，关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (HttpMessageConverter&amp;lt;?&amp;gt; converter : this.messageConverters) {</span></span>
<span class="line"><span>   GenericHttpMessageConverter genericConverter = (converter instanceof GenericHttpMessageConverter ?</span></span>
<span class="line"><span>         (GenericHttpMessageConverter&amp;lt;?&amp;gt;) converter : null);</span></span>
<span class="line"><span>   if (genericConverter != null ?</span></span>
<span class="line"><span>         ((GenericHttpMessageConverter) converter).canWrite(targetType, valueType, selectedMediaType) :</span></span>
<span class="line"><span>         converter.canWrite(valueType, selectedMediaType)) {</span></span>
<span class="line"><span>      //省略其他非关键代码</span></span>
<span class="line"><span>      if (body != null) {</span></span>
<span class="line"><span>        //省略其他非关键代码</span></span>
<span class="line"><span>         if (genericConverter != null) {</span></span>
<span class="line"><span>            genericConverter.write(body, targetType, selectedMediaType, outputMessage);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         else {</span></span>
<span class="line"><span>            ((HttpMessageConverter) converter).write(body, selectedMediaType, outputMessage);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //省略其他非关键代码</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如代码所示，即结合 targetType（String）、valueType（String）、selectedMediaType（MediaType#TEXT_PLAIN）三个信息来决策可以使用哪种消息 Converter。常见候选 Converter 可以参考下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/373942/a33b9282baac597d1f3acf74a6874ce6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/373942/a33b9282baac597d1f3acf74a6874ce6.png" alt=""></a></p><p>最终，本案例选择的是 StringHttpMessageConverter，在最终调用父类方法 AbstractHttpMessageConverter#write 执行转化时，会尝试添加 Content-Type。具体代码参考 AbstractHttpMessageConverter#addDefaultHeaders：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void addDefaultHeaders(HttpHeaders headers, T t, &amp;#64;Nullable MediaType contentType) throws IOException {</span></span>
<span class="line"><span>   if (headers.getContentType() == null) {</span></span>
<span class="line"><span>      MediaType contentTypeToUse = contentType;</span></span>
<span class="line"><span>      if (contentType == null || contentType.isWildcardType() || contentType.isWildcardSubtype()) {</span></span>
<span class="line"><span>         contentTypeToUse = getDefaultContentType(t);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else if (MediaType.APPLICATION_OCTET_STREAM.equals(contentType)) {</span></span>
<span class="line"><span>         MediaType mediaType = getDefaultContentType(t);</span></span>
<span class="line"><span>         contentTypeToUse = (mediaType != null ? mediaType : contentTypeToUse);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (contentTypeToUse != null) {</span></span>
<span class="line"><span>         if (contentTypeToUse.getCharset() == null) {</span></span>
<span class="line"><span>            //尝试添加字符集</span></span>
<span class="line"><span>            Charset defaultCharset = getDefaultCharset();</span></span>
<span class="line"><span>            if (defaultCharset != null) {</span></span>
<span class="line"><span>               contentTypeToUse = new MediaType(contentTypeToUse, defaultCharset);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         headers.setContentType(contentTypeToUse);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略其他非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合案例，参考代码，我们可以看出，我们使用的是 MediaType#TEXT_PLAIN 作为 Content-Type 的 Header，毕竟之前我们添加 Content-Type 这个 Header 并没有成功。最终运行结果也就不出意外了，即&quot;Content-Type: text/plain;charset=UTF-8&quot;。</p><p>通过案例分析可以总结出，虽然我们在 Controller 设置了 Content-Type，但是它是一种特殊的 Header，所以 <strong>在 Spring Boot 基于内嵌 Tomcat 开发时并不一定能设置成功，最终返回的 Content-Type 是根据实际的返回值及类型等多个因素来决定的。</strong></p><h3 id="问题修正-2" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-2" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>针对这个问题，如果想设置成功，我们就必须让其真正的返回就是 JSON 类型，这样才能刚好生效。而且从上面的分析也可以看出，返回符合预期也并非是在 Controller 设置的功劳。不过围绕目标，我们也可以这样去修改下：</p><p><strong>1. 修改请求中的 Accept 头，约束返回类型</strong></p><p>参考代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GET http://localhost:8080/hi3</span></span>
<span class="line"><span>Accept:application/json</span></span></code></pre></div><p>即带上 Accept 头，这样服务器在最终决定 MediaType 时，会选择 Accept 的值。具体执行可参考方法 AbstractMessageConverterMethodProcessor#getAcceptableMediaTypes。</p><p><strong>2. 标记返回类型</strong></p><p>主动显式指明类型，修改方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(path = &quot;/hi3&quot;, method = RequestMethod.GET, produces = {&quot;application/json&quot;})</span></span></code></pre></div><p>即使用 produces 属性来指明即可。这样的方式影响的是可以返回的 Media 类型，一旦设置，下面的方法就可以只返回一个指明的类型了。参考 AbstractMessageConverterMethodProcessor#getProducibleMediaTypes：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected List&amp;lt;MediaType&amp;gt; getProducibleMediaTypes(</span></span>
<span class="line"><span>      HttpServletRequest request, Class&amp;lt;?&amp;gt; valueClass, &amp;#64;Nullable Type targetType) {</span></span>
<span class="line"><span>   Set&amp;lt;MediaType&amp;gt; mediaTypes =</span></span>
<span class="line"><span>         (Set&amp;lt;MediaType&amp;gt;) request.getAttribute(HandlerMapping.PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);</span></span>
<span class="line"><span>   if (!CollectionUtils.isEmpty(mediaTypes)) {</span></span>
<span class="line"><span>      return new ArrayList&amp;lt;&amp;gt;(mediaTypes);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略其他非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述两种方式，一个修改了 getAcceptableMediaTypes 返回值，一个修改了 getProducibleMediaTypes，这样就可以控制最终协商的结果为 JSON 了。从而影响后续的执行结果。</p><p>不过这里需要额外注意的是，虽然我们最终结果返回的 Content-Type 头是 JSON 了，但是对于内容的加工，仍然采用的是 StringHttpMessageConverter，感兴趣的话你可以自己去研究下原因。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过这节课的学习，我们了解到了在 Spring 解析Header中的一些常见错误及其背后的深层原因。这里带你回顾下重点：</p><ol><li>要完整接收到所有的 Header，不能直接使用Map而应该使用MultiValueMap。常见的两种方式如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//方式 1</span></span>
<span class="line"><span>&amp;#64;RequestHeader() MultiValueMap map</span></span>
<span class="line"><span>//方式 2：专用于Header的MultiValueMap子类型</span></span>
<span class="line"><span>&amp;#64;RequestHeader() HttpHeaders map</span></span></code></pre></div><p>深究原因，Spring在底层解析Header时如果接收参数是Map，则当请求的Header是多Value时，只存下了其中一个Value。</p><ol start="2"><li><p>在 HTTP 协议规定中，Header 的名称是无所谓大小写的。但是这并不意味着所有能获取到Header的途径，最终得到的Header名称都是统一大小写的。</p></li><li><p>不是所有的Header在响应中都能随意指定，虽然表面看起来能生效，但是最后返回给客户端的仍然不是你指定的值。例如，在Tomcat下，CONTENT_TYPE这个Header就是这种情况。</p></li></ol><p>以上即为这一讲的核心知识点，希望你以后在解析Header时会更有信心。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在案例 3 中，我们以 Content-Type 为例，提到在 Controller 层中随意自定义常用头有时候会失效。那么这个结论是不是普适呢？即在使用其他内置容器或者在其他开发框架下，是不是也会存在一样的问题？</p><p>期待你的思考，我们留言区见！</p>`,132)])])}const g=e(t,[["render",l]]);export{h as __pageData,g as default};
