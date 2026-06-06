import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"22 | Spring Test 常见错误","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：资源文件扫描不到","slug":"案例-1-资源文件扫描不到","link":"#案例-1-资源文件扫描不到","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：容易出错的Mock","slug":"案例-2-容易出错的mock","link":"#案例-2-容易出错的mock","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/22-SpringTest常见错误.md","filePath":"Spring编程常见错误50例/22-SpringTest常见错误.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/22-SpringTest常见错误.md"};function i(l,s,o,c,r,g){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_22-spring-test-常见错误" tabindex="-1">22 | Spring Test 常见错误 <a class="header-anchor" href="#_22-spring-test-常见错误" aria-label="Permalink to &quot;22 | Spring Test 常见错误&quot;">​</a></h1><p>你好，我是傅健。</p><p>前面我们介绍了许多 Spring 常用知识点上的常见应用错误。当然或许这些所谓的常用，你仍然没有使用，例如对于 Spring Data 的使用，有的项目确实用不到。那么这一讲，我们聊聊 Spring Test，相信你肯定绕不开对它的使用，除非你不使用 Spring 来开发程序，或者你使用了 Spring 但是你不写测试。但话说回来，后者的情况就算你想如此，你的老板也不会同意吧。</p><p>那么在 Spring Test 的应用上，有哪些常见错误呢？这里我给你梳理了两个典型，闲话少叙，我们直接进入这一讲的学习。</p><h2 id="案例-1-资源文件扫描不到" tabindex="-1">案例 1：资源文件扫描不到 <a class="header-anchor" href="#案例-1-资源文件扫描不到" aria-label="Permalink to &quot;案例 1：资源文件扫描不到&quot;">​</a></h2><p>首先，我们来写一个 HelloWorld 版的 Spring Boot 程序以做测试备用。</p><p>先来定义一个 Controller：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    HelloWorldService helloWorldService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;hi&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public String hi() throws Exception{</span></span>
<span class="line"><span>        return  helloWorldService.toString() ;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当访问 <a href="http://localhost:8080/hi" target="_blank" rel="noreferrer">http://localhost:8080/hi</a> 时，上述接口会打印自动注入的HelloWorldService类型的 Bean。而对于这个 Bean 的定义，我们这里使用配置文件的方式进行。</p><ol><li>定义 HelloWorldService，具体到 HelloWorldService 的实现并非本讲的重点，所以我们可以简单实现如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HelloWorldService {</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>定义一个 spring.xml，在这个 XML 中定义 HelloWorldService 的Bean，并把这个 spring.xml 文件放置在/src/main/resources 中：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>       xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>       xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;bean id=&quot;helloWorldService&quot; class=&quot;com.spring.puzzle.others.test.example1.HelloWorldService&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/bean&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/beans&amp;gt;</span></span></code></pre></div><ol start="3"><li>定义一个 Configuration 引入上述定义 XML，具体实现方式如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;ImportResource(locations = {&quot;spring.xml&quot;})</span></span>
<span class="line"><span>public class Config {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成上述步骤后，我们就可以使用 main() 启动起来。测试这个接口，一切符合预期。那么接下来，我们来写一个测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;SpringBootTest()</span></span>
<span class="line"><span>class ApplicationTests {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    public HelloController helloController;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Test</span></span>
<span class="line"><span>    public void testController() throws Exception {</span></span>
<span class="line"><span>        String response = helloController.hi();</span></span>
<span class="line"><span>        Assert.notNull(response, &quot;not null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>​当我们运行上述测试的时候，会发现测试失败了，报错如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/75bc072e10604b31bfb6971935f0d0e3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/75bc072e10604b31bfb6971935f0d0e3.png" alt=""></a></p><p>为什么单独运行应用程序没有问题，但是运行测试就不行了呢？我们需要研究一下 Spring 的源码，来找找答案。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>在了解这个问题的根本原因之前，我们先从调试的角度来对比下启动程序和测试加载spring.xml的不同之处。</p><ol><li>启动程序加载spring.xml</li></ol><p>首先看下调用栈：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/566ddaef5170e3dbe5481e4c40d341e1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/566ddaef5170e3dbe5481e4c40d341e1.png" alt=""></a></p><p>可以看出，它最终以 ClassPathResource 形式来加载，这个资源的情况如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/db7fe332174277d302452d4d47d003a5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/db7fe332174277d302452d4d47d003a5.png" alt=""></a></p><p>而具体到加载实现，它使用的是 ClassPathResource#getInputStream 来加载spring.xml文件：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/6d170e626a21f201d22b7fed27840f2e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/6d170e626a21f201d22b7fed27840f2e.png" alt=""></a></p><p>从上述调用及代码实现，可以看出最终是可以加载成功的。</p><ol start="2"><li>测试加载spring.xml</li></ol><p>首先看下调用栈：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/05a89da2411a02e48e2da091d666yye6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/05a89da2411a02e48e2da091d666yye6.png" alt=""></a></p><p>可以看出它是按 ServletContextResource 来加载的，这个资源的情况如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/fc6238c6716053fdfa993aa235e4a18f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/fc6238c6716053fdfa993aa235e4a18f.png" alt=""></a></p><p>具体到实现，它最终使用的是 MockServletContext#getResourceAsStream 来加载文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Nullable</span></span>
<span class="line"><span>public InputStream getResourceAsStream(String path) {</span></span>
<span class="line"><span>    String resourceLocation = this.getResourceLocation(path);</span></span>
<span class="line"><span>    Resource resource = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        resource = this.resourceLoader.getResource(resourceLocation);</span></span>
<span class="line"><span>        return !resource.exists() ? null : resource.getInputStream();</span></span>
<span class="line"><span>    } catch (IOException | InvalidPathException var5) {</span></span>
<span class="line"><span>        if (this.logger.isWarnEnabled()) {</span></span>
<span class="line"><span>            this.logger.warn(&quot;Could not open InputStream for resource &quot; + (resource != null ? resource : resourceLocation), var5);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>​你可以继续跟踪它的加载位置相关代码，即 getResourceLocation()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected String getResourceLocation(String path) {</span></span>
<span class="line"><span>    if (!path.startsWith(&quot;/&quot;)) {</span></span>
<span class="line"><span>        path = &quot;/&quot; + path;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //加上前缀：/src/main/resources</span></span>
<span class="line"><span>    String resourceLocation = this.getResourceBasePathLocation(path);</span></span>
<span class="line"><span>    if (this.exists(resourceLocation)) {</span></span>
<span class="line"><span>        return resourceLocation;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //{&quot;classpath:META-INF/resources&quot;, &quot;classpath:resources&quot;, &quot;classpath:static&quot;, &quot;classpath:public&quot;};</span></span>
<span class="line"><span>        String[] var3 = SPRING_BOOT_RESOURCE_LOCATIONS;</span></span>
<span class="line"><span>        int var4 = var3.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for(int var5 = 0; var5 &amp;lt; var4; ++var5) {</span></span>
<span class="line"><span>            String prefix = var3[var5];</span></span>
<span class="line"><span>            resourceLocation = prefix + path;</span></span>
<span class="line"><span>            if (this.exists(resourceLocation)) {</span></span>
<span class="line"><span>                return resourceLocation;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return super.getResourceLocation(path);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你会发现，它尝试从下面的一些位置进行加载：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>classpath:META-INF/resources</span></span>
<span class="line"><span>classpath:resources</span></span>
<span class="line"><span>classpath:static</span></span>
<span class="line"><span>classpath:public</span></span>
<span class="line"><span>src/main/webapp</span></span></code></pre></div><p>如果你仔细看这些目录，你还会发现，这些目录都没有spring.xml。或许你认为源文件src/main/resource下面不是有一个 spring.xml 么？那上述位置中的classpath:resources不就能加载了么？</p><p>那你肯定是忽略了一点：当程序运行起来后，src/main/resource 下的文件最终是不带什么resource的。关于这点，你可以直接查看编译后的目录（本地编译后是 target\\classes 目录），示例如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/d65bc6eb7f3bef8c110d5a06f69649ca.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/d65bc6eb7f3bef8c110d5a06f69649ca.png" alt=""></a></p><p>所以，最终我们在所有的目录中都找不到spring.xml，并且会报错提示加载不了文件。报错的地方位于 ServletContextResource#getInputStream 中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public InputStream getInputStream() throws IOException {</span></span>
<span class="line"><span>   InputStream is = this.servletContext.getResourceAsStream(this.path);</span></span>
<span class="line"><span>   if (is == null) {</span></span>
<span class="line"><span>      throw new FileNotFoundException(&quot;Could not open &quot; + getDescription());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return is;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>从上述案例解析中，我们了解到了报错的原因，那么如何修正这个问题？这里我们可以采用两种方式。</p><ol><li>在加载目录上放置 spring.xml</li></ol><p>就本案例而言，加载目录有很多，所以修正方式也不少，我们可以建立一个 src/main/webapp，然后把 spring.xml 复制一份进去就可以了。也可以在/src/main/resources 下面再建立一个 resources 目录，然后放置进去也可以。</p><ol start="2"><li>在 @ImportResource 使用classpath加载方式</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>//&amp;#64;ImportResource(locations = {&quot;spring.xml&quot;})</span></span>
<span class="line"><span>&amp;#64;ImportResource(locations = {&quot;classpath:spring.xml&quot;})</span></span>
<span class="line"><span>public class Config {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里，我们可以通过 Spring 的官方文档简单了解下不同加载方式的区别，参考 <a href="https://docs.spring.io/spring-framework/docs/2.5.x/reference/resources.html" target="_blank" rel="noreferrer">https://docs.spring.io/spring-framework/docs/2.5.x/reference/resources.html</a>：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/4f24754d1308a887069cfb7661b5fa43.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/4f24754d1308a887069cfb7661b5fa43.png" alt=""></a></p><p>很明显，我们一般都不会使用本案例的方式（即locations = {“spring.xml”}，无任何“前缀”的方式），毕竟它已经依赖于使用的 ApplicationContext。而 classPath 更为普适些，而一旦你按上述方式修正后，你会发现它加载的资源已经不再是 ServletContextResource，而是和应用程序一样的 ClassPathResource，这样自然可以加载到了。</p><p>所以说到底，表面上看，这个问题是关于测试的案例，但是实际上是 ImportResource 的使用问题。不过通过这个案例，你也会明白，很多用法真的只能在某个特定场合才能工作起来，你只是比较幸运而已。</p><h2 id="案例-2-容易出错的mock" tabindex="-1">案例 2：容易出错的Mock <a class="header-anchor" href="#案例-2-容易出错的mock" aria-label="Permalink to &quot;案例 2：容易出错的Mock&quot;">​</a></h2><p>接下来，我们再来看一个非功能性的错误案例。有时候，我们会发现 Spring Test 运行起来非常缓慢，寻根溯源之后，你会发现主要是因为很多测试都启动了Spring Context，示例如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/7c789e27d23301bd4ba96f03474cce4a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/7c789e27d23301bd4ba96f03474cce4a.png" alt=""></a></p><p>那么为什么有的测试会多次启动 Spring Context？在具体解析这个问题之前，我们先模拟写一个案例来复现这个问题。</p><p>我们先在 Spring Boot 程序中写几个被测试类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ServiceOne {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ServiceTwo {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后分别写出对应的测试类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;SpringBootTest()</span></span>
<span class="line"><span>class ServiceOneTests {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;MockBean</span></span>
<span class="line"><span>    ServiceOne serviceOne;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Test</span></span>
<span class="line"><span>    public void test(){</span></span>
<span class="line"><span>        System.out.println(serviceOne);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;SpringBootTest()</span></span>
<span class="line"><span>class ServiceTwoTests {</span></span>
<span class="line"><span>    &amp;#64;MockBean</span></span>
<span class="line"><span>    ServiceTwo serviceTwo;</span></span>
<span class="line"><span>    &amp;#64;Test</span></span>
<span class="line"><span>    public void test(){</span></span>
<span class="line"><span>        System.out.println(serviceTwo);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>​在上述测试类中，我们都使用了@MockBean。写完这些程序，批量运行测试，你会发现Spring Context 果然会被运行多次。那么如何理解这个现象，是错误还是符合预期？接下来我们具体来解析下。</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>当我们运行一个测试的时候，正常情况是不会重新创建一个 Spring Context 的。这是因为 Spring Test 使用了 Context 的缓存以避免重复创建 Context。那么这个缓存是怎么维护的呢？我们可以通过DefaultCacheAwareContextLoaderDelegate#loadContext来看下 Context 的获取和缓存逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ApplicationContext loadContext(MergedContextConfiguration mergedContextConfiguration) {</span></span>
<span class="line"><span>    synchronized(this.contextCache) {</span></span>
<span class="line"><span>        ApplicationContext context = this.contextCache.get(mergedContextConfiguration);</span></span>
<span class="line"><span>        if (context == null) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                context = this.loadContextInternal(mergedContextConfiguration);</span></span>
<span class="line"><span>                //省略非关键代码</span></span>
<span class="line"><span>                this.contextCache.put(mergedContextConfiguration, context);</span></span>
<span class="line"><span>            } catch (Exception var6) {</span></span>
<span class="line"><span>            //省略非关键代码</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else if (logger.isDebugEnabled()) {</span></span>
<span class="line"><span>            //省略非关键代码</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.contextCache.logStatistics();</span></span>
<span class="line"><span>        return context;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码可以看出，缓存的 Key 是 MergedContextConfiguration。所以一个测试要不要启动一个新的 Context，就取决于根据这个测试 Class 构建的 MergedContextConfiguration 是否相同。而是否相同取决于它的 hashCode() 实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int hashCode() {</span></span>
<span class="line"><span>    int result = Arrays.hashCode(this.locations);</span></span>
<span class="line"><span>    result = 31 * result + Arrays.hashCode(this.classes);</span></span>
<span class="line"><span>    result = 31 * result + this.contextInitializerClasses.hashCode();</span></span>
<span class="line"><span>    result = 31 * result + Arrays.hashCode(this.activeProfiles);</span></span>
<span class="line"><span>    result = 31 * result + Arrays.hashCode(this.propertySourceLocations);</span></span>
<span class="line"><span>    result = 31 * result + Arrays.hashCode(this.propertySourceProperties);</span></span>
<span class="line"><span>    result = 31 * result + this.contextCustomizers.hashCode();</span></span>
<span class="line"><span>    result = 31 * result + (this.parent != null ? this.parent.hashCode() : 0);</span></span>
<span class="line"><span>    result = 31 * result + nullSafeClassName(this.contextLoader).hashCode();</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述方法，你可以看出只要上述元素中的任何一个不同都会导致一个 Context 会重新创建出来。关于这个缓存机制和 Key 的关键因素你可以参考 Spring 的官方文档，也有所提及，这里我直接给出了链接，你可以对照着去阅读。</p><p>点击获取： <a href="https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-ctx-management-caching" target="_blank" rel="noreferrer">https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-ctx-management-caching</a></p><p>现在回到本案例，为什么会创建一个新的 Context 而不是复用？根源在于两个测试的contextCustomizers这个元素的不同。如果你不信的话，你可以调试并对比下。</p><p>ServiceOneTests 的 MergedContextConfiguration 示例如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/20c269e533ec2dcea7bc73d3f0a2f027.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/20c269e533ec2dcea7bc73d3f0a2f027.png" alt=""></a></p><p>ServiceTwoTests 的 MergedContextConfiguration 示例如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/16e4abd8e908897a38d21d5057b960b1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/383756/16e4abd8e908897a38d21d5057b960b1.png" alt=""></a></p><p>很明显，MergedContextConfiguration（即 Context Cache 的 Key）的 ContextCustomizer 是不同的，所以 Context 没有共享起来。而追溯到 ContextCustomizer 的创建，我们可以具体来看下。</p><p>当我们运行一个测试（testClass）时，我们会使用 MockitoContextCustomizerFactory#createContextCustomizer 来创建一个 ContextCustomizer，代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MockitoContextCustomizerFactory implements ContextCustomizerFactory {</span></span>
<span class="line"><span>    MockitoContextCustomizerFactory() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ContextCustomizer createContextCustomizer(Class&amp;lt;?&amp;gt; testClass, List&amp;lt;ContextConfigurationAttributes&amp;gt; configAttributes) {</span></span>
<span class="line"><span>        DefinitionsParser parser = new DefinitionsParser();</span></span>
<span class="line"><span>        parser.parse(testClass);</span></span>
<span class="line"><span>        return new MockitoContextCustomizer(parser.getDefinitions());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>创建的过程是由 DefinitionsParser 来解析这个测试 Class（例如案例中的 ServiceOneTests），如果这个测试 Class 中包含了 MockBean 或者 SpyBean 标记的情况，则将对应标记的情况转化为 MockDefinition，最终添加到 ContextCustomizer 中。解析的过程参考 DefinitionsParser#parse：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void parse(Class&amp;lt;?&amp;gt; source) {</span></span>
<span class="line"><span>    this.parseElement(source);</span></span>
<span class="line"><span>    ReflectionUtils.doWithFields(source, this::parseElement);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void parseElement(AnnotatedElement element) {</span></span>
<span class="line"><span>    MergedAnnotations annotations = MergedAnnotations.from(element, SearchStrategy.SUPERCLASS);</span></span>
<span class="line"><span>//MockBean 处理    annotations.stream(MockBean.class).map(MergedAnnotation::synthesize).forEach((annotation) -&amp;gt; {</span></span>
<span class="line"><span>        this.parseMockBeanAnnotation(annotation, element);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>//SpyBean 处理    annotations.stream(SpyBean.class).map(MergedAnnotation::synthesize).forEach((annotation) -&amp;gt; {</span></span>
<span class="line"><span>        this.parseSpyBeanAnnotation(annotation, element);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void parseMockBeanAnnotation(MockBean annotation, AnnotatedElement element) {</span></span>
<span class="line"><span>    Set&amp;lt;ResolvableType&amp;gt; typesToMock = this.getOrDeduceTypes(element, annotation.value());</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>    Iterator var4 = typesToMock.iterator();</span></span>
<span class="line"><span>    while(var4.hasNext()) {</span></span>
<span class="line"><span>        ResolvableType typeToMock = (ResolvableType)var4.next();</span></span>
<span class="line"><span>        MockDefinition definition = new MockDefinition(annotation.name(), typeToMock, annotation.extraInterfaces(), annotation.answer(), annotation.serializable(), annotation.reset(), QualifierDefinition.forElement(element));</span></span>
<span class="line"><span>        //添加到 DefinitionsParser#definitions</span></span>
<span class="line"><span>        this.addDefinition(element, definition, &quot;mock&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那说了这么多，Spring Context 重新创建的根本原因还是在于使用了@MockBean 且不同，从而导致构建的 MergedContextConfiguration 不同，而 MergedContextConfiguration 正是作为 Cache 的 Key，Key 不同，Context 不能被复用，所以被重新创建了。这就是为什么在案例介绍部分，你会看到多次 Spring Context 的启动过程。而正因为“重启”，测试速度变缓慢了。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>到这，你会发现其实这种缓慢的根源是使用了@MockBean 带来的一个正常现象。但是假设你非要去提速下，那么你可以尝试使用 Mockito 去手工实现类似的功能。当然你也可以尝试使用下面的方式来解决，即把相关的 MockBean 都定义到一个地方去。例如针对本案例，修正方案如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ServiceTests {</span></span>
<span class="line"><span>    &amp;#64;MockBean</span></span>
<span class="line"><span>    ServiceOne serviceOne;</span></span>
<span class="line"><span>    &amp;#64;MockBean</span></span>
<span class="line"><span>    ServiceTwo serviceTwo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;SpringBootTest()</span></span>
<span class="line"><span>class ServiceOneTests extends ServiceTests{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Test</span></span>
<span class="line"><span>    public void test(){</span></span>
<span class="line"><span>        System.out.println(serviceOne);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;SpringBootTest()</span></span>
<span class="line"><span>class ServiceTwoTests  extends ServiceTests{</span></span>
<span class="line"><span>    &amp;#64;Test</span></span>
<span class="line"><span>    public void test(){</span></span>
<span class="line"><span>        System.out.println(serviceTwo);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重新运行测试，你会发现 Context 只会被创建一次，速度也有所提升了。相信，你也明白这么改能工作的原因了，现在每个测试对应的 Context 缓存 Key 已经相同了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过以上两个案例，相信你对 Spring Test 已经有了进一步的了解，最后总结下重点。</p><p>在使用 Spring Test 的时候，一定要注意资源文件的加载方式是否正确。例如，你使用的是绝对路径，形式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ImportResource(locations = {&quot;spring.xml&quot;})</span></span></code></pre></div><p>那么它可能在不同的场合实现不同，不一定能加载到你想要的文件，所以我并不推荐你在使用 @ImportResource 时，使用绝对路径指定资源。</p><p>另外，@MockBean 可能会导致 Spring Context 反复新建，从而让测试变得缓慢，从根源上看，这是属于正常现象。不过你一定要意识到这点，否则，你可能会遇到各种难以理解的现象。</p><p>而假设你需要加速，你可以尝试多种方法，例如，你可以把依赖 Mock 的 Bean 声明在一个统一的地方。当然，你要格外注意这样是否还能满足你的测试需求。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在案例 1 中，我们解释了为什么测试程序加载不到 spring.xml 文件，根源在于当使用下面的语句加载文件时，它们是采用不同的 Resource 形式来加载的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ImportResource(locations = {&quot;spring.xml&quot;})</span></span></code></pre></div><p>具体而言，应用程序加载使用的是 ClassPathResource，测试加载使用的是 ServletContextResource，那么这是怎么造成的呢？</p><p>期待你的思考，我们留言区见！</p>`,99)])])}const d=n(t,[["render",i]]);export{u as __pageData,d as default};
