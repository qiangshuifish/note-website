import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"45 | 工厂模式（下）：如何设计实现一个Dependency Injection框架？","description":"","frontmatter":{},"headers":[{"level":2,"title":"工厂模式和DI容器有何区别？","slug":"工厂模式和di容器有何区别","link":"#工厂模式和di容器有何区别","children":[]},{"level":2,"title":"DI容器的核心功能有哪些？","slug":"di容器的核心功能有哪些","link":"#di容器的核心功能有哪些","children":[]},{"level":2,"title":"如何实现一个简单的DI容器？","slug":"如何实现一个简单的di容器","link":"#如何实现一个简单的di容器","children":[{"level":3,"title":"1.最小原型设计","slug":"_1-最小原型设计","link":"#_1-最小原型设计","children":[]},{"level":3,"title":"2.提供执行入口","slug":"_2-提供执行入口","link":"#_2-提供执行入口","children":[]},{"level":3,"title":"3.配置文件解析","slug":"_3-配置文件解析","link":"#_3-配置文件解析","children":[]},{"level":3,"title":"4.核心工厂类设计","slug":"_4-核心工厂类设计","link":"#_4-核心工厂类设计","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/45-工厂模式（下）：如何设计实现一个DependencyInjection框架？.md","filePath":"设计模式之美/45-工厂模式（下）：如何设计实现一个DependencyInjection框架？.md","lastUpdated":1779822055000}'),i={name:"设计模式之美/45-工厂模式（下）：如何设计实现一个DependencyInjection框架？.md"};function t(l,n,c,o,r,g){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_45-工厂模式-下-如何设计实现一个dependency-injection框架" tabindex="-1">45 | 工厂模式（下）：如何设计实现一个Dependency Injection框架？ <a class="header-anchor" href="#_45-工厂模式-下-如何设计实现一个dependency-injection框架" aria-label="Permalink to &quot;45 | 工厂模式（下）：如何设计实现一个Dependency Injection框架？&quot;">​</a></h1><p>在上一节课我们讲到，当创建对象是一个“大工程”的时候，我们一般会选择使用工厂模式，来封装对象复杂的创建过程，将对象的创建和使用分离，让代码更加清晰。那何为“大工程”呢？上一节课中我们讲了两种情况，一种是创建过程涉及复杂的if-else分支判断，另一种是对象创建需要组装多个其他类对象或者需要复杂的初始化过程。</p><p>今天，我们再来讲一个创建对象的“大工程”，依赖注入框架，或者叫依赖注入容器（Dependency Injection Container），简称DI容器。在今天的讲解中，我会带你一块搞清楚这样几个问题：DI容器跟我们讲的工厂模式又有何区别和联系？DI容器的核心功能有哪些，以及如何实现一个简单的DI容器？</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="工厂模式和di容器有何区别" tabindex="-1">工厂模式和DI容器有何区别？ <a class="header-anchor" href="#工厂模式和di容器有何区别" aria-label="Permalink to &quot;工厂模式和DI容器有何区别？&quot;">​</a></h2><p>实际上，DI容器底层最基本的设计思路就是基于工厂模式的。DI容器相当于一个大的工厂类，负责在程序启动的时候，根据配置（要创建哪些类对象，每个类对象的创建需要依赖哪些其他类对象）事先创建好对象。当应用程序需要使用某个类对象的时候，直接从容器中获取即可。正是因为它持有一堆对象，所以这个框架才被称为“容器”。</p><p>DI容器相对于我们上节课讲的工厂模式的例子来说，它处理的是更大的对象创建工程。上节课讲的工厂模式中，一个工厂类只负责某个类对象或者某一组相关类对象（继承自同一抽象类或者接口的子类）的创建，而DI容器负责的是整个应用中所有类对象的创建。</p><p>除此之外，DI容器负责的事情要比单纯的工厂模式要多。比如，它还包括配置的解析、对象生命周期的管理。接下来，我们就详细讲讲，一个简单的DI容器应该包含哪些核心功能。</p><h2 id="di容器的核心功能有哪些" tabindex="-1">DI容器的核心功能有哪些？ <a class="header-anchor" href="#di容器的核心功能有哪些" aria-label="Permalink to &quot;DI容器的核心功能有哪些？&quot;">​</a></h2><p>总结一下，一个简单的DI容器的核心功能一般有三个：配置解析、对象创建和对象生命周期管理。</p><p><strong>首先，我们来看配置解析。</strong></p><p>在上节课讲的工厂模式中，工厂类要创建哪个类对象是事先确定好的，并且是写死在工厂类代码中的。作为一个通用的框架来说，框架代码跟应用代码应该是高度解耦的，DI容器事先并不知道应用会创建哪些对象，不可能把某个应用要创建的对象写死在框架代码中。所以，我们需要通过一种形式，让应用告知DI容器要创建哪些对象。这种形式就是我们要讲的配置。</p><p>我们将需要由DI容器来创建的类对象和创建类对象的必要信息（使用哪个构造函数以及对应的构造函数参数都是什么等等），放到配置文件中。容器读取配置文件，根据配置文件提供的信息来创建对象。</p><p>下面是一个典型的Spring容器的配置文件。Spring容器读取这个配置文件，解析出要创建的两个对象：rateLimiter和redisCounter，并且得到两者的依赖关系：rateLimiter依赖redisCounter。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RateLimiter {</span></span>
<span class="line"><span>  private RedisCounter redisCounter;</span></span>
<span class="line"><span>  public RateLimiter(RedisCounter redisCounter) {</span></span>
<span class="line"><span>    this.redisCounter = redisCounter;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public void test() {</span></span>
<span class="line"><span>    System.out.println(&quot;Hello World!&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RedisCounter {</span></span>
<span class="line"><span>  private String ipAddress;</span></span>
<span class="line"><span>  private int port;</span></span>
<span class="line"><span>  public RedisCounter(String ipAddress, int port) {</span></span>
<span class="line"><span>    this.ipAddress = ipAddress;</span></span>
<span class="line"><span>    this.port = port;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>配置文件beans.xml：</span></span>
<span class="line"><span>&amp;lt;beans&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;bean id=&quot;rateLimiter&quot; class=&quot;com.xzg.RateLimiter&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;constructor-arg ref=&quot;redisCounter&quot;/&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/bean&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;lt;bean id=&quot;redisCounter&quot; class=&quot;com.xzg.redisCounter&quot;&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;constructor-arg type=&quot;String&quot; value=&quot;127.0.0.1&quot;&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;constructor-arg type=&quot;int&quot; value=1234&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/bean&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/beans&amp;gt;</span></span></code></pre></div><p><strong>其次，我们再来看对象创建。</strong></p><p>在DI容器中，如果我们给每个类都对应创建一个工厂类，那项目中类的个数会成倍增加，这会增加代码的维护成本。要解决这个问题并不难。我们只需要将所有类对象的创建都放到一个工厂类中完成就可以了，比如BeansFactory。</p><p>你可能会说，如果要创建的类对象非常多，BeansFactory中的代码会不会线性膨胀（代码量跟创建对象的个数成正比）呢？实际上并不会。待会讲到DI容器的具体实现的时候，我们会讲“反射”这种机制，它能在程序运行的过程中，动态地加载类、创建对象，不需要事先在代码中写死要创建哪些对象。所以，不管是创建一个对象还是十个对象，BeansFactory工厂类代码都是一样的。</p><p><strong>最后，我们来看对象的生命周期管理。</strong></p><p>上一节课我们讲到，简单工厂模式有两种实现方式，一种是每次都返回新创建的对象，另一种是每次都返回同一个事先创建好的对象，也就是所谓的单例对象。在Spring框架中，我们可以通过配置scope属性，来区分这两种不同类型的对象。scope=prototype表示返回新创建的对象，scope=singleton表示返回单例对象。</p><p>除此之外，我们还可以配置对象是否支持懒加载。如果lazy-init=true，对象在真正被使用到的时候（比如：BeansFactory.getBean(“userService”)）才被被创建；如果lazy-init=false，对象在应用启动的时候就事先创建好。</p><p>不仅如此，我们还可以配置对象的init-method和destroy-method方法，比如init-method=loadProperties()，destroy-method=updateConfigFile()。DI容器在创建好对象之后，会主动调用init-method属性指定的方法来初始化对象。在对象被最终销毁之前，DI容器会主动调用destroy-method属性指定的方法来做一些清理工作，比如释放数据库连接池、关闭文件。</p><h2 id="如何实现一个简单的di容器" tabindex="-1">如何实现一个简单的DI容器？ <a class="header-anchor" href="#如何实现一个简单的di容器" aria-label="Permalink to &quot;如何实现一个简单的DI容器？&quot;">​</a></h2><p>实际上，用Java语言来实现一个简单的DI容器，核心逻辑只需要包括这样两个部分：配置文件解析、根据配置文件通过“反射”语法来创建对象。</p><h3 id="_1-最小原型设计" tabindex="-1">1.最小原型设计 <a class="header-anchor" href="#_1-最小原型设计" aria-label="Permalink to &quot;1.最小原型设计&quot;">​</a></h3><p>因为我们主要是讲解设计模式，所以，在今天的讲解中，我们只实现一个DI容器的最小原型。像Spring框架这样的DI容器，它支持的配置格式非常灵活和复杂。为了简化代码实现，重点讲解原理，在最小原型中，我们只支持下面配置文件中涉及的配置语法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>配置文件beans.xml</span></span>
<span class="line"><span>&amp;lt;beans&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;bean id=&quot;rateLimiter&quot; class=&quot;com.xzg.RateLimiter&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;constructor-arg ref=&quot;redisCounter&quot;/&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/bean&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;lt;bean id=&quot;redisCounter&quot; class=&quot;com.xzg.redisCounter&quot; scope=&quot;singleton&quot; lazy-init=&quot;true&quot;&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;constructor-arg type=&quot;String&quot; value=&quot;127.0.0.1&quot;&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;constructor-arg type=&quot;int&quot; value=1234&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/bean&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/bean</span></span></code></pre></div><p>最小原型的使用方式跟Spring框架非常类似，示例代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    ApplicationContext applicationContext = new ClassPathXmlApplicationContext(</span></span>
<span class="line"><span>            &quot;beans.xml&quot;);</span></span>
<span class="line"><span>    RateLimiter rateLimiter = (RateLimiter) applicationContext.getBean(&quot;rateLimiter&quot;);</span></span>
<span class="line"><span>    rateLimiter.test();</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-提供执行入口" tabindex="-1">2.提供执行入口 <a class="header-anchor" href="#_2-提供执行入口" aria-label="Permalink to &quot;2.提供执行入口&quot;">​</a></h3><p>前面我们讲到，面向对象设计的最后一步是：组装类并提供执行入口。在这里，执行入口就是一组暴露给外部使用的接口和类。</p><p>通过刚刚的最小原型使用示例代码，我们可以看出，执行入口主要包含两部分：ApplicationContext和ClassPathXmlApplicationContext。其中，ApplicationContext是接口，ClassPathXmlApplicationContext是接口的实现类。两个类具体实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ApplicationContext {</span></span>
<span class="line"><span>  Object getBean(String beanId);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ClassPathXmlApplicationContext implements ApplicationContext {</span></span>
<span class="line"><span>  private BeansFactory beansFactory;</span></span>
<span class="line"><span>  private BeanConfigParser beanConfigParser;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ClassPathXmlApplicationContext(String configLocation) {</span></span>
<span class="line"><span>    this.beansFactory = new BeansFactory();</span></span>
<span class="line"><span>    this.beanConfigParser = new XmlBeanConfigParser();</span></span>
<span class="line"><span>    loadBeanDefinitions(configLocation);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void loadBeanDefinitions(String configLocation) {</span></span>
<span class="line"><span>    InputStream in = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      in = this.getClass().getResourceAsStream(&quot;/&quot; + configLocation);</span></span>
<span class="line"><span>      if (in == null) {</span></span>
<span class="line"><span>        throw new RuntimeException(&quot;Can not find config file: &quot; + configLocation);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      List&amp;lt;BeanDefinition&amp;gt; beanDefinitions = beanConfigParser.parse(in);</span></span>
<span class="line"><span>      beansFactory.addBeanDefinitions(beanDefinitions);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      if (in != null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          in.close();</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>          // TODO: log error</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public Object getBean(String beanId) {</span></span>
<span class="line"><span>    return beansFactory.getBean(beanId);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面的代码中，我们可以看出，ClassPathXmlApplicationContext负责组装BeansFactory和BeanConfigParser两个类，串联执行流程：从classpath中加载XML格式的配置文件，通过BeanConfigParser解析为统一的BeanDefinition格式，然后，BeansFactory根据BeanDefinition来创建对象。</p><h3 id="_3-配置文件解析" tabindex="-1">3.配置文件解析 <a class="header-anchor" href="#_3-配置文件解析" aria-label="Permalink to &quot;3.配置文件解析&quot;">​</a></h3><p>配置文件解析主要包含BeanConfigParser接口和XmlBeanConfigParser实现类，负责将配置文件解析为BeanDefinition结构，以便BeansFactory根据这个结构来创建对象。</p><p>配置文件的解析比较繁琐，不涉及我们专栏要讲的理论知识，不是我们讲解的重点，所以这里我只给出两个类的大致设计思路，并未给出具体的实现代码。如果感兴趣的话，你可以自行补充完整。具体的代码框架如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface BeanConfigParser {</span></span>
<span class="line"><span>  List&amp;lt;BeanDefinition&amp;gt; parse(InputStream inputStream);</span></span>
<span class="line"><span>  List&amp;lt;BeanDefinition&amp;gt; parse(String configContent);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class XmlBeanConfigParser implements BeanConfigParser {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public List&amp;lt;BeanDefinition&amp;gt; parse(InputStream inputStream) {</span></span>
<span class="line"><span>    String content = null;</span></span>
<span class="line"><span>    // TODO:...</span></span>
<span class="line"><span>    return parse(content);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public List&amp;lt;BeanDefinition&amp;gt; parse(String configContent) {</span></span>
<span class="line"><span>    List&amp;lt;BeanDefinition&amp;gt; beanDefinitions = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    // TODO:...</span></span>
<span class="line"><span>    return beanDefinitions;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class BeanDefinition {</span></span>
<span class="line"><span>  private String id;</span></span>
<span class="line"><span>  private String className;</span></span>
<span class="line"><span>  private List&amp;lt;ConstructorArg&amp;gt; constructorArgs = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  private Scope scope = Scope.SINGLETON;</span></span>
<span class="line"><span>  private boolean lazyInit = false;</span></span>
<span class="line"><span>  // 省略必要的getter/setter/constructors</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public boolean isSingleton() {</span></span>
<span class="line"><span>    return scope.equals(Scope.SINGLETON);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static enum Scope {</span></span>
<span class="line"><span>    SINGLETON,</span></span>
<span class="line"><span>    PROTOTYPE</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class ConstructorArg {</span></span>
<span class="line"><span>    private boolean isRef;</span></span>
<span class="line"><span>    private Class type;</span></span>
<span class="line"><span>    private Object arg;</span></span>
<span class="line"><span>    // 省略必要的getter/setter/constructors</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_4-核心工厂类设计" tabindex="-1">4.核心工厂类设计 <a class="header-anchor" href="#_4-核心工厂类设计" aria-label="Permalink to &quot;4.核心工厂类设计&quot;">​</a></h3><p>最后，我们来看，BeansFactory是如何设计和实现的。这也是我们这个DI容器最核心的一个类了。它负责根据从配置文件解析得到的BeanDefinition来创建对象。</p><p>如果对象的scope属性是singleton，那对象创建之后会缓存在singletonObjects这样一个map中，下次再请求此对象的时候，直接从map中取出返回，不需要重新创建。如果对象的scope属性是prototype，那每次请求对象，BeansFactory都会创建一个新的对象返回。</p><p>实际上，BeansFactory创建对象用到的主要技术点就是Java中的反射语法：一种动态加载类和创建对象的机制。我们知道，JVM在启动的时候会根据代码自动地加载类、创建对象。至于都要加载哪些类、创建哪些对象，这些都是在代码中写死的，或者说提前写好的。但是，如果某个对象的创建并不是写死在代码中，而是放到配置文件中，我们需要在程序运行期间，动态地根据配置文件来加载类、创建对象，那这部分工作就没法让JVM帮我们自动完成了，我们需要利用Java提供的反射语法自己去编写代码。</p><p>搞清楚了反射的原理，BeansFactory的代码就不难看懂了。具体代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BeansFactory {</span></span>
<span class="line"><span>  private ConcurrentHashMap&amp;lt;String, Object&amp;gt; singletonObjects = new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  private ConcurrentHashMap&amp;lt;String, BeanDefinition&amp;gt; beanDefinitions = new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addBeanDefinitions(List&amp;lt;BeanDefinition&amp;gt; beanDefinitionList) {</span></span>
<span class="line"><span>    for (BeanDefinition beanDefinition : beanDefinitionList) {</span></span>
<span class="line"><span>      this.beanDefinitions.putIfAbsent(beanDefinition.getId(), beanDefinition);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (BeanDefinition beanDefinition : beanDefinitionList) {</span></span>
<span class="line"><span>      if (beanDefinition.isLazyInit() == false &amp;&amp; beanDefinition.isSingleton()) {</span></span>
<span class="line"><span>        createBean(beanDefinition);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Object getBean(String beanId) {</span></span>
<span class="line"><span>    BeanDefinition beanDefinition = beanDefinitions.get(beanId);</span></span>
<span class="line"><span>    if (beanDefinition == null) {</span></span>
<span class="line"><span>      throw new NoSuchBeanDefinitionException(&quot;Bean is not defined: &quot; + beanId);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return createBean(beanDefinition);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;VisibleForTesting</span></span>
<span class="line"><span>  protected Object createBean(BeanDefinition beanDefinition) {</span></span>
<span class="line"><span>    if (beanDefinition.isSingleton() &amp;&amp; singletonObjects.contains(beanDefinition.getId())) {</span></span>
<span class="line"><span>      return singletonObjects.get(beanDefinition.getId());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Object bean = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      Class beanClass = Class.forName(beanDefinition.getClassName());</span></span>
<span class="line"><span>      List&amp;lt;BeanDefinition.ConstructorArg&amp;gt; args = beanDefinition.getConstructorArgs();</span></span>
<span class="line"><span>      if (args.isEmpty()) {</span></span>
<span class="line"><span>        bean = beanClass.newInstance();</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        Class[] argClasses = new Class[args.size()];</span></span>
<span class="line"><span>        Object[] argObjects = new Object[args.size()];</span></span>
<span class="line"><span>        for (int i = 0; i &amp;lt; args.size(); ++i) {</span></span>
<span class="line"><span>          BeanDefinition.ConstructorArg arg = args.get(i);</span></span>
<span class="line"><span>          if (!arg.getIsRef()) {</span></span>
<span class="line"><span>            argClasses[i] = arg.getType();</span></span>
<span class="line"><span>            argObjects[i] = arg.getArg();</span></span>
<span class="line"><span>          } else {</span></span>
<span class="line"><span>            BeanDefinition refBeanDefinition = beanDefinitions.get(arg.getArg());</span></span>
<span class="line"><span>            if (refBeanDefinition == null) {</span></span>
<span class="line"><span>              throw new NoSuchBeanDefinitionException(&quot;Bean is not defined: &quot; + arg.getArg());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            argClasses[i] = Class.forName(refBeanDefinition.getClassName());</span></span>
<span class="line"><span>            argObjects[i] = createBean(refBeanDefinition);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        bean = beanClass.getConstructor(argClasses).newInstance(argObjects);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch (ClassNotFoundException | IllegalAccessException</span></span>
<span class="line"><span>            | InstantiationException | NoSuchMethodException | InvocationTargetException e) {</span></span>
<span class="line"><span>      throw new BeanCreationFailureException(&quot;&quot;, e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (bean != null &amp;&amp; beanDefinition.isSingleton()) {</span></span>
<span class="line"><span>      singletonObjects.putIfAbsent(beanDefinition.getId(), bean);</span></span>
<span class="line"><span>      return singletonObjects.get(beanDefinition.getId());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return bean;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们来一块总结回顾一下，你需要重点掌握的内容。</p><p>DI容器在一些软件开发中已经成为了标配，比如Spring IOC、Google Guice。但是，大部分人可能只是把它当作一个黑盒子来使用，并未真正去了解它的底层是如何实现的。当然，如果只是做一些简单的小项目，简单会用就足够了，但是，如果我们面对的是非常复杂的系统，当系统出现问题的时候，对底层原理的掌握程度，决定了我们排查问题的能力，直接影响到我们排查问题的效率。</p><p>今天，我们讲解了一个简单的DI容器的实现原理，其核心逻辑主要包括：配置文件解析，以及根据配置文件通过“反射”语法来创建对象。其中，创建对象的过程就应用到了我们在学的工厂模式。对象创建、组装、管理完全有DI容器来负责，跟具体业务代码解耦，让程序员聚焦在业务代码的开发上。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>BeansFactory类中的createBean()函数是一个递归函数。当构造函数的参数是ref类型时，会递归地创建ref属性指向的对象。如果我们在配置文件中错误地配置了对象之间的依赖关系，导致存在循环依赖，那BeansFactory的createBean()函数是否会出现堆栈溢出？又该如何解决这个问题呢？</p><p>你可以可以在留言区说一说，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,51)])])}const m=a(i,[["render",t]]);export{d as __pageData,m as default};
