import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"05｜Spring AOP 常见错误（上）","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例1：this调用的当前类方法无法被拦截","slug":"案例1-this调用的当前类方法无法被拦截","link":"#案例1-this调用的当前类方法无法被拦截","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例2：直接访问被拦截类的属性抛空指针异常","slug":"案例2-直接访问被拦截类的属性抛空指针异常","link":"#案例2-直接访问被拦截类的属性抛空指针异常","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/05｜SpringAOP常见错误（上）.md","filePath":"Spring编程常见错误50例/05｜SpringAOP常见错误（上）.md","lastUpdated":1779817075000}'),i={name:"Spring编程常见错误50例/05｜SpringAOP常见错误（上）.md"};function t(l,s,c,r,o,g){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_05-spring-aop-常见错误-上" tabindex="-1">05｜Spring AOP 常见错误（上） <a class="header-anchor" href="#_05-spring-aop-常见错误-上" aria-label="Permalink to &quot;05｜Spring AOP 常见错误（上）&quot;">​</a></h1><p>你好，我是傅健。这节课开始，我们聊聊Spring AOP使用中常遇到的一些问题。</p><p>Spring AOP是Spring中除了依赖注入外（DI）最为核心的功能，顾名思义，AOP即Aspect Oriented Programming，翻译为面向切面编程。</p><p>而Spring AOP则利用CGlib和JDK动态代理等方式来实现运行期动态方法增强，其目的是将与业务无关的代码单独抽离出来，使其逻辑不再与业务代码耦合，从而降低系统的耦合性，提高程序的可重用性和开发效率。因而AOP便成为了日志记录、监控管理、性能统计、异常处理、权限管理、统一认证等各个方面被广泛使用的技术。</p><p>追根溯源，我们之所以能无感知地在容器对象方法前后任意添加代码片段，那是由于Spring在运行期帮我们把切面中的代码逻辑动态“织入”到了容器对象方法内，所以说 <strong>AOP本质上就是一个代理模式</strong>。然而在使用这种代理模式时，我们常常会用不好，那么这节课我们就来解析下有哪些常见的问题，以及背后的原理是什么。</p><h2 id="案例1-this调用的当前类方法无法被拦截" tabindex="-1">案例1：this调用的当前类方法无法被拦截 <a class="header-anchor" href="#案例1-this调用的当前类方法无法被拦截" aria-label="Permalink to &quot;案例1：this调用的当前类方法无法被拦截&quot;">​</a></h2><p>假设我们正在开发一个宿舍管理系统，这个模块包含一个负责电费充值的类ElectricService，它含有一个充电方法charge()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void charge() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>        this.pay();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void pay() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Pay with alipay ...&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个电费充值方法charge()中，我们会使用支付宝进行充值。因此在这个方法中，我加入了pay()方法。为了模拟pay()方法调用耗时，代码执行了休眠1秒，并在charge()方法里使用 this.pay()的方式调用这种支付方法。</p><p>但是因为支付宝支付是第三方接口，我们需要记录下接口调用时间。这时候我们就引入了一个@Around的增强 ，分别记录在pay()方法执行前后的时间，并计算出执行pay()方法的耗时。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class AopConfig {</span></span>
<span class="line"><span>    &amp;#64;Around(&quot;execution(* com.spring.puzzle.class5.example1.ElectricService.pay()) &quot;)</span></span>
<span class="line"><span>    public void recordPayPerformance(ProceedingJoinPoint joinPoint) throws Throwable {</span></span>
<span class="line"><span>        long start = System.currentTimeMillis();</span></span>
<span class="line"><span>        joinPoint.proceed();</span></span>
<span class="line"><span>        long end = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(&quot;Pay method time cost（ms）: &quot; + (end - start));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后我们再通过定义一个Controller来提供电费充值接口，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class HelloWorldController {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    ElectricService electricService;</span></span>
<span class="line"><span>    &amp;#64;RequestMapping(path = &quot;charge&quot;, method = RequestMethod.GET)</span></span>
<span class="line"><span>    public void charge() throws Exception{</span></span>
<span class="line"><span>          electricService.charge();</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成代码后，我们访问上述接口，会发现这段计算时间的切面并没有执行到，输出日志如下：</p><blockquote><p>Electric charging ...</p><p>Pay with alipay ...</p></blockquote><p>回溯之前的代码可知，在@Around的切面类中，我们很清晰地定义了切面对应的方法，但是却没有被执行到。这说明了在类的内部，通过this方式调用的方法，是没有被Spring AOP增强的。这是为什么呢？我们来分析一下。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们可以从源码中找到真相。首先来设置个断点，调试看看this对应的对象是什么样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/e0f4b047228fac437d57f56dcd18185f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/e0f4b047228fac437d57f56dcd18185f.png" alt=""></a></p><p>可以看到，this对应的就是一个普通的ElectricService对象，并没有什么特别的地方。再看看在Controller层中自动装配的ElectricService对象是什么样：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/b24f00b4b96c46983295da05180174f9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/b24f00b4b96c46983295da05180174f9.png" alt=""></a></p><p>可以看到，这是一个被Spring增强过的Bean，所以执行charge()方法时，会执行记录接口调用时间的增强操作。而this对应的对象只是一个普通的对象，并没有做任何额外的增强。</p><p>为什么this引用的对象只是一个普通对象呢？这还要从Spring AOP增强对象的过程来看。但在此之前，有些基础我需要在这里强调下。</p><p><strong>1. Spring AOP的实现</strong></p><p>Spring AOP的底层是动态代理。而创建代理的方式有两种， <strong>JDK的方式和CGLIB的方式</strong>。JDK动态代理只能对实现了接口的类生成代理，而不能针对普通类。而CGLIB是可以针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法，来实现代理对象。具体区别可参考下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/99c74d82d811ec567b28a24ccd6e85a1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/99c74d82d811ec567b28a24ccd6e85a1.png" alt=""></a></p><p><strong>2. 如何使用Spring AOP</strong></p><p>在Spring Boot中，我们一般只要添加以下依赖就可以直接使用AOP功能：</p><blockquote><p>&lt;dependency&gt;</p><p>&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</p><p>&lt;artifactId&gt;spring-boot-starter-aop&lt;/artifactId&gt;</p><p>&lt;/dependency&gt;</p></blockquote><p>而对于非Spring Boot程序，除了添加相关AOP依赖项外，我们还常常会使用@EnableAspectJAutoProxy来开启AOP功能。这个注解类引入（Import）AspectJAutoProxyRegistrar，它通过实现ImportBeanDefinitionRegistrar的接口方法来完成AOP相关Bean的准备工作。</p><p>补充完最基本的Spring底层知识和使用知识后，我们具体看下创建代理对象的过程。先来看下调用栈：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/1fb3735e51a8e06833f065a175517c2a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/1fb3735e51a8e06833f065a175517c2a.png" alt=""></a></p><p>创建代理对象的时机就是创建一个Bean的时候，而创建的的关键工作其实是由AnnotationAwareAspectJAutoProxyCreator完成的。它本质上是一种BeanPostProcessor。所以它的执行是在完成原始Bean构建后的初始化Bean（initializeBean）过程中。而它到底完成了什么工作呢？我们可以看下它的postProcessAfterInitialization方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object postProcessAfterInitialization(&amp;#64;Nullable Object bean, String beanName) {</span></span>
<span class="line"><span>   if (bean != null) {</span></span>
<span class="line"><span>      Object cacheKey = getCacheKey(bean.getClass(), beanName);</span></span>
<span class="line"><span>      if (this.earlyProxyReferences.remove(cacheKey) != bean) {</span></span>
<span class="line"><span>         return wrapIfNecessary(bean, beanName, cacheKey);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return bean;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的关键方法是wrapIfNecessary，顾名思义， <strong>在需要使用AOP时，它会把创建的原始的Bean对象wrap成代理对象作为Bean返回</strong>。具体到这个wrap过程，可参考下面的关键代码行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>   Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);</span></span>
<span class="line"><span>   if (specificInterceptors != DO_NOT_PROXY) {</span></span>
<span class="line"><span>      this.advisedBeans.put(cacheKey, Boolean.TRUE);</span></span>
<span class="line"><span>      Object proxy = createProxy(</span></span>
<span class="line"><span>            bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));</span></span>
<span class="line"><span>      this.proxyTypes.put(cacheKey, proxy.getClass());</span></span>
<span class="line"><span>      return proxy;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，第6行的createProxy调用是创建代理对象的关键。具体到执行过程，它首先会创建一个代理工厂，然后将通知器（advisors）、被代理对象等信息加入到代理工厂，最后通过这个代理工厂来获取代理对象。一些关键过程参考下面的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object createProxy(Class&amp;lt;?&amp;gt; beanClass, &amp;#64;Nullable String beanName,</span></span>
<span class="line"><span>      &amp;#64;Nullable Object[] specificInterceptors, TargetSource targetSource) {</span></span>
<span class="line"><span>  // 省略非关键代码</span></span>
<span class="line"><span>  ProxyFactory proxyFactory = new ProxyFactory();</span></span>
<span class="line"><span>  if (!proxyFactory.isProxyTargetClass()) {</span></span>
<span class="line"><span>   if (shouldProxyTargetClass(beanClass, beanName)) {</span></span>
<span class="line"><span>      proxyFactory.setProxyTargetClass(true);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   else {</span></span>
<span class="line"><span>      evaluateProxyInterfaces(beanClass, proxyFactory);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);</span></span>
<span class="line"><span>  proxyFactory.addAdvisors(advisors);</span></span>
<span class="line"><span>  proxyFactory.setTargetSource(targetSource);</span></span>
<span class="line"><span>  customizeProxyFactory(proxyFactory);</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>  return proxyFactory.getProxy(getProxyClassLoader());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过这样一个过程，一个代理对象就被创建出来了。我们从Spring中获取到的对象都是这个代理对象，所以具有AOP功能。而之前直接使用this引用到的只是一个普通对象，自然也就没办法实现AOP的功能了。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>从上述案例解析中，我们知道， <strong>只有引用的是被动态代理创建出来的对象，才会被Spring增强，具备AOP该有的功能</strong>。那什么样的对象具备这样的条件呢？</p><p>有两种。一种是被@Autowired注解的，于是我们的代码可以改成这样，即通过@Autowired的方式，在类的内部，自己引用自己：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    ElectricService electricService;</span></span>
<span class="line"><span>    public void charge() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>        //this.pay();</span></span>
<span class="line"><span>        electricService.pay();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void pay() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Pay with alipay ...&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另一种方法就是直接从AopContext获取当前的Proxy。那你可能会问了，AopContext是什么？简单说，它的核心就是通过一个ThreadLocal来将Proxy和线程绑定起来，这样就可以随时拿出当前线程绑定的Proxy。</p><p>不过使用这种方法有个小前提，就是需要在@EnableAspectJAutoProxy里加一个配置项exposeProxy = true，表示将代理对象放入到ThreadLocal，这样才可以直接通过 AopContext.currentProxy()的方式获取到，否则会报错如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/0e42f3129e1c098b0f860f1f7f2e6298.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/0e42f3129e1c098b0f860f1f7f2e6298.png" alt=""></a></p><p>按这个思路，我们修改下相关代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.springframework.aop.framework.AopContext;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span>    public void charge() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>        ElectricService electric = ((ElectricService) AopContext.currentProxy());</span></span>
<span class="line"><span>        electric.pay();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void pay() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Pay with alipay ...&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同时，不要忘记修改EnableAspectJAutoProxy注解的exposeProxy属性，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;SpringBootApplication</span></span>
<span class="line"><span>&amp;#64;EnableAspectJAutoProxy(exposeProxy = true)</span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这两种方法的效果其实是一样的，最终我们打印出了期待的日志，到这，问题顺利解决了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Electric charging ...</span></span>
<span class="line"><span>Pay with alipay ...</span></span>
<span class="line"><span>Pay method time cost(ms): 1005</span></span></code></pre></div><h2 id="案例2-直接访问被拦截类的属性抛空指针异常" tabindex="-1">案例2：直接访问被拦截类的属性抛空指针异常 <a class="header-anchor" href="#案例2-直接访问被拦截类的属性抛空指针异常" aria-label="Permalink to &quot;案例2：直接访问被拦截类的属性抛空指针异常&quot;">​</a></h2><p>接上一个案例，在宿舍管理系统中，我们使用了charge()方法进行支付。在统一结算的时候我们会用到一个管理员用户付款编号，这时候就用到了几个新的类。</p><p>User类，包含用户的付款编号信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class User {</span></span>
<span class="line"><span>    private String payNum;</span></span>
<span class="line"><span>    public User(String payNum) {</span></span>
<span class="line"><span>        this.payNum = payNum;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String getPayNum() {</span></span>
<span class="line"><span>        return payNum;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void setPayNum(String payNum) {</span></span>
<span class="line"><span>        this.payNum = payNum;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AdminUserService类，包含一个管理员用户（User），其付款编号为202101166；另外，这个服务类有一个login()方法，用来登录系统。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class AdminUserService {</span></span>
<span class="line"><span>    public final User adminUser = new User(&quot;202101166&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void login() {</span></span>
<span class="line"><span>        System.out.println(&quot;admin user login...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们需要修改ElectricService类实现这个需求：在电费充值时，需要管理员登录并使用其编号进行结算。完整代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.springframework.beans.factory.annotation.Autowired;</span></span>
<span class="line"><span>import org.springframework.stereotype.Service;</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class ElectricService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private AdminUserService adminUserService;</span></span>
<span class="line"><span>    public void charge() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;Electric charging ...&quot;);</span></span>
<span class="line"><span>        this.pay();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void pay() throws Exception {</span></span>
<span class="line"><span>        adminUserService.login();</span></span>
<span class="line"><span>        String payNum = adminUserService.adminUser.getPayNum();</span></span>
<span class="line"><span>        System.out.println(&quot;User pay num : &quot; + payNum);</span></span>
<span class="line"><span>        System.out.println(&quot;Pay with alipay ...&quot;);</span></span>
<span class="line"><span>        Thread.sleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码完成后，执行charge()操作，一切正常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Electric charging ...</span></span>
<span class="line"><span>admin user login...</span></span>
<span class="line"><span>User pay num : 202101166</span></span>
<span class="line"><span>Pay with alipay ...</span></span></code></pre></div><p>这时候，由于安全需要，就需要管理员在登录时，记录一行日志以便于以后审计管理员操作。所以我们添加一个AOP相关配置类，具体如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class AopConfig {</span></span>
<span class="line"><span>    &amp;#64;Before(&quot;execution(* com.spring.puzzle.class5.example2.AdminUserService.login(..)) &quot;)</span></span>
<span class="line"><span>    public void logAdminLogin(JoinPoint pjp) throws Throwable {</span></span>
<span class="line"><span>        System.out.println(&quot;! admin login ...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>添加这段代码后，我们执行charge()操作，发现不仅没有相关日志，而且在执行下面这一行代码的时候直接抛出了NullPointerException：</p><blockquote><p>String payNum = dminUserService.user.getPayNum();</p></blockquote><p>本来一切正常的代码，因为引入了一个AOP切面，抛出了NullPointerException。这会是什么原因呢？我们先debug一下，来看看加入AOP后调用的对象是什么样子。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/cd48479a45c2b06621c2e07a33f519a2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/cd48479a45c2b06621c2e07a33f519a2.png" alt=""></a></p><p>可以看出，加入AOP后，我们的对象已经是一个代理对象了，如果你眼尖的话，就会发现在上图中，属性adminUser确实为null。为什么会这样？为了解答这个诡异的问题，我们需要进一步理解Spring使用CGLIB生成Proxy的原理。</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们在上一个案例中解析了创建Spring Proxy的大体过程，在这里，我们需要进一步研究一下通过Proxy创建出来的是一个什么样的对象。正常情况下，AdminUserService只是一个普通的对象，而AOP增强过的则是一个AdminUserService $$EnhancerBySpringCGLIB$$xxxx。</p><p>这个类实际上是AdminUserService的一个子类。它会overwrite所有public和protected方法，并在内部将调用委托给原始的AdminUserService实例。</p><p>从具体实现角度看，CGLIB中AOP的实现是基于org.springframework.cglib.proxy包中 Enhancer和MethodInterceptor两个接口来实现的。</p><p><strong>整个过程，我们可以概括为三个步骤：</strong></p><ul><li>定义自定义的MethodInterceptor负责委托方法执行；</li><li>创建Enhance并设置Callback为上述MethodInterceptor；</li><li>enhancer.create()创建代理。</li></ul><p>接下来，我们来具体分析一下Spring的相关实现源码。</p><p>在上个案例分析里，我们简要提及了Spring的动态代理对象的初始化机制。在得到Advisors之后，会通过ProxyFactory.getProxy获取代理对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object getProxy(ClassLoader classLoader) {</span></span>
<span class="line"><span>	return createAopProxy().getProxy(classLoader);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，我们以CGLIB的Proxy的实现类CglibAopProxy为例，来看看具体的流程：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object getProxy(&amp;#64;Nullable ClassLoader classLoader) {</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>    // 创建及配置 Enhancer</span></span>
<span class="line"><span>    Enhancer enhancer = createEnhancer();</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>    // 获取Callback：包含DynamicAdvisedInterceptor，亦是MethodInterceptor</span></span>
<span class="line"><span>    Callback[] callbacks = getCallbacks(rootClass);</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>    // 生成代理对象并创建代理（设置 enhancer 的 callback 值）</span></span>
<span class="line"><span>    return createProxyClassAndInstance(enhancer, callbacks);</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的几个关键步骤大体符合之前提及的三个步骤，其中最后一步一般都会执行到CglibAopProxy子类ObjenesisCglibAopProxy的createProxyClassAndInstance()方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object createProxyClassAndInstance(Enhancer enhancer, Callback[] callbacks) {</span></span>
<span class="line"><span>   //创建代理类Class</span></span>
<span class="line"><span>   Class&amp;lt;?&amp;gt; proxyClass = enhancer.createClass();</span></span>
<span class="line"><span>   Object proxyInstance = null;</span></span>
<span class="line"><span>   //spring.objenesis.ignore默认为false</span></span>
<span class="line"><span>   //所以objenesis.isWorthTrying()一般为true</span></span>
<span class="line"><span>   if (objenesis.isWorthTrying()) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>         // 创建实例</span></span>
<span class="line"><span>         proxyInstance = objenesis.newInstance(proxyClass, enhancer.getUseCache());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (Throwable ex) {</span></span>
<span class="line"><span>          // 省略非关键代码</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (proxyInstance == null) {</span></span>
<span class="line"><span>       // 尝试普通反射方式创建实例</span></span>
<span class="line"><span>       try {</span></span>
<span class="line"><span>          Constructor&amp;lt;?&amp;gt; ctor = (this.constructorArgs != null ?</span></span>
<span class="line"><span>                proxyClass.getDeclaredConstructor(this.constructorArgTypes) :</span></span>
<span class="line"><span>                proxyClass.getDeclaredConstructor());</span></span>
<span class="line"><span>          ReflectionUtils.makeAccessible(ctor);</span></span>
<span class="line"><span>          proxyInstance = (this.constructorArgs != null ?</span></span>
<span class="line"><span>                ctor.newInstance(this.constructorArgs) : ctor.newInstance());</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>   ((Factory) proxyInstance).setCallbacks(callbacks);</span></span>
<span class="line"><span>   return proxyInstance;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们可以了解到，Spring会默认尝试使用objenesis方式实例化对象，如果失败则再次尝试使用常规方式实例化对象。现在，我们可以进一步查看objenesis方式实例化对象的流程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/422160a6fd0c3ee1af8b05769a015834.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/422160a6fd0c3ee1af8b05769a015834.png" alt=""></a></p><p>参照上述截图所示调用栈，objenesis方式最后使用了JDK的ReflectionFactory.newConstructorForSerialization()完成了代理对象的实例化。而如果你稍微研究下这个方法，你会惊讶地发现，这种方式创建出来的对象是不会初始化类成员变量的。</p><p>所以说到这里，聪明的你可能已经觉察到真相已经暴露了，我们这个案例的核心是代理类实例的默认构建方式很特别。在这里，我们可以总结和对比下通过反射来实例化对象的方式，包括：</p><ul><li>java.lang.Class.newInsance()</li><li>java.lang.reflect.Constructor.newInstance()</li><li>sun.reflect.ReflectionFactory.newConstructorForSerialization().newInstance()</li></ul><p>前两种初始化方式都会同时初始化类成员变量，但是最后一种通过ReflectionFactory.newConstructorForSerialization().newInstance()实例化类则不会初始化类成员变量，这就是当前问题的最终答案了。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>了解了问题的根本原因后，修正起来也就不困难了。既然是无法直接访问被拦截类的成员变量，那我们就换个方式，在UserService里写个getUser()方法，从内部访问获取变量。</p><p>我们在AdminUserService里加了个getUser()方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public User getUser() {</span></span>
<span class="line"><span>    return user;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ElectricService里通过getUser()获取User对象：</p><blockquote><p>//原来出错的方式：</p><p>//String payNum = = adminUserService.adminUser.getPayNum();</p><p>//修改后的方式：</p><p>String payNum = adminUserService.getAdminUser().getPayNum();</p></blockquote><p>运行下来，一切正常，可以看到管理员登录日志了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Electric charging ...</span></span>
<span class="line"><span>! admin login ...</span></span>
<span class="line"><span>admin user login...</span></span>
<span class="line"><span>User pay num : 202101166</span></span>
<span class="line"><span>Pay with alipay ...</span></span></code></pre></div><p>但你有没有产生另一个困惑呢？既然代理类的类属性不会被初始化，那为什么可以通过在AdminUserService里写个getUser()方法来获取代理类实例的属性呢？</p><p>我们再次回顾createProxyClassAndInstance的代码逻辑，创建代理类后，我们会调用setCallbacks来设置拦截后需要注入的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object createProxyClassAndInstance(Enhancer enhancer, Callback[] callbacks) {</span></span>
<span class="line"><span>   Class&amp;lt;?&amp;gt; proxyClass = enhancer.createClass();</span></span>
<span class="line"><span>   Object proxyInstance = null;</span></span>
<span class="line"><span>   if (objenesis.isWorthTrying()) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>         proxyInstance = objenesis.newInstance(proxyClass, enhancer.getUseCache());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>   ((Factory) proxyInstance).setCallbacks(callbacks);</span></span>
<span class="line"><span>   return proxyInstance;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过代码调试和分析，我们可以得知上述的callbacks中会存在一种服务于AOP的DynamicAdvisedInterceptor，它的接口是MethodInterceptor（callback的子接口），实现了拦截方法intercept()。我们可以看下它是如何实现这个方法的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {</span></span>
<span class="line"><span>   // 省略非关键代码</span></span>
<span class="line"><span>    TargetSource targetSource = this.advised.getTargetSource();</span></span>
<span class="line"><span>    // 省略非关键代码</span></span>
<span class="line"><span>      if (chain.isEmpty() &amp;&amp; Modifier.isPublic(method.getModifiers())) {</span></span>
<span class="line"><span>         Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);</span></span>
<span class="line"><span>         retVal = methodProxy.invoke(target, argsToUse);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>         // We need to create a method invocation...</span></span>
<span class="line"><span>         retVal = new CglibMethodInvocation(proxy, target, method, args, targetClass, chain, methodProxy).proceed();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      retVal = processReturnType(proxy, target, method, retVal);</span></span>
<span class="line"><span>      return retVal;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当代理类方法被调用，会被Spring拦截，从而进入此intercept()，并在此方法中获取被代理的原始对象。而在原始对象中，类属性是被实例化过且存在的。因此代理类是可以通过方法拦截获取被代理对象实例的属性。</p><p>说到这里，我们已经解决了问题。但如果你看得仔细，就会发现，其实你改变一个属性，也可以让产生的代理对象的属性值不为null。例如修改启动参数spring.objenesis.ignore如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/83e34cbd460ac74c5d623905dce0497e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/83e34cbd460ac74c5d623905dce0497e.png" alt=""></a></p><p>此时再调试程序，你会发现adminUser已经不为null了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/3b2dd77392c3b439d0a182f5817045b1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/369251/3b2dd77392c3b439d0a182f5817045b1.png" alt=""></a></p><p>所以这也是解决这个问题的一种方法，相信聪明的你已经能从前文贴出的代码中找出它能够工作起来的原理了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过以上两个案例的介绍，相信你对Spring AOP动态代理的初始化机制已经有了进一步的了解，这里总结重点如下：</p><ol><li><p>使用AOP，实际上就是让Spring自动为我们创建一个Proxy，使得调用者能无感知地调用指定方法。而Spring有助于我们在运行期里动态织入其它逻辑，因此，AOP本质上就是一个动态代理。</p></li><li><p>我们只有访问这些代理对象的方法，才能获得AOP实现的功能，所以通过this引用是无法正确使用AOP功能的。在不能改变代码结果前提下，我们可以通过@Autowired、AopContext.currentProxy()等方式获取相应的代理对象来实现所需的功能。</p></li><li><p>我们一般不能直接从代理类中去拿被代理类的属性，这是因为除非我们显示设置spring.objenesis.ignore为true，否则代理类的属性是不会被Spring初始化的，我们可以通过在被代理类中增加一个方法来间接获取其属性。</p></li></ol><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>第二个案例中，我们提到了通过反射来实例化类的三种方式：</p><ul><li>java.lang.Class.newInsance()</li><li>java.lang.reflect.Constructor.newInstance()</li><li>sun.reflect.ReflectionFactory.newConstructorForSerialization().newInstance()</li></ul><p>其中第三种方式不会初始化类属性，你能够写一个例子来证明这一点吗？</p><p>期待你的思考，我们留言区见！</p>`,115)])])}const u=n(i,[["render",t]]);export{d as __pageData,u as default};
