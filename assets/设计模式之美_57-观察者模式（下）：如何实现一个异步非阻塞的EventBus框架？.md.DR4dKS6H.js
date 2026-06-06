import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"57 | 观察者模式（下）：如何实现一个异步非阻塞的EventBus框架？","description":"","frontmatter":{},"headers":[{"level":2,"title":"异步非阻塞观察者模式的简易实现","slug":"异步非阻塞观察者模式的简易实现","link":"#异步非阻塞观察者模式的简易实现","children":[]},{"level":2,"title":"EventBus框架功能需求介绍","slug":"eventbus框架功能需求介绍","link":"#eventbus框架功能需求介绍","children":[]},{"level":2,"title":"手把手实现一个EventBus框架","slug":"手把手实现一个eventbus框架","link":"#手把手实现一个eventbus框架","children":[{"level":3,"title":"1.Subscribe","slug":"_1-subscribe","link":"#_1-subscribe","children":[]},{"level":3,"title":"2.ObserverAction","slug":"_2-observeraction","link":"#_2-observeraction","children":[]},{"level":3,"title":"3.ObserverRegistry","slug":"_3-observerregistry","link":"#_3-observerregistry","children":[]},{"level":3,"title":"4.EventBus","slug":"_4-eventbus","link":"#_4-eventbus","children":[]},{"level":3,"title":"5.AsyncEventBus","slug":"_5-asynceventbus","link":"#_5-asynceventbus","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/57-观察者模式（下）：如何实现一个异步非阻塞的EventBus框架？.md","filePath":"设计模式之美/57-观察者模式（下）：如何实现一个异步非阻塞的EventBus框架？.md","lastUpdated":1779822055000}'),t={name:"设计模式之美/57-观察者模式（下）：如何实现一个异步非阻塞的EventBus框架？.md"};function l(i,s,r,c,o,u){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_57-观察者模式-下-如何实现一个异步非阻塞的eventbus框架" tabindex="-1">57 | 观察者模式（下）：如何实现一个异步非阻塞的EventBus框架？ <a class="header-anchor" href="#_57-观察者模式-下-如何实现一个异步非阻塞的eventbus框架" aria-label="Permalink to &quot;57 | 观察者模式（下）：如何实现一个异步非阻塞的EventBus框架？&quot;">​</a></h1><p>上一节课中，我们学习了观察者模式的原理、实现、应用场景，重点介绍了不同应用场景下，几种不同的实现方式，包括：同步阻塞、异步非阻塞、进程内、进程间的实现方式。</p><p>同步阻塞是最经典的实现方式，主要是为了代码解耦；异步非阻塞除了能实现代码解耦之外，还能提高代码的执行效率；进程间的观察者模式解耦更加彻底，一般是基于消息队列来实现，用来实现不同进程间的被观察者和观察者之间的交互。</p><p>今天，我们聚焦于异步非阻塞的观察者模式，带你实现一个类似Google Guava EventBus的通用框架。等你学完本节课之后，你会发现，实现一个框架也并非一件难事。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="异步非阻塞观察者模式的简易实现" tabindex="-1">异步非阻塞观察者模式的简易实现 <a class="header-anchor" href="#异步非阻塞观察者模式的简易实现" aria-label="Permalink to &quot;异步非阻塞观察者模式的简易实现&quot;">​</a></h2><p>上一节课中，我们讲到，对于异步非阻塞观察者模式，如果只是实现一个简易版本，不考虑任何通用性、复用性，实际上是非常容易的。</p><p>我们有两种实现方式。其中一种是：在每个handleRegSuccess()函数中创建一个新的线程执行代码逻辑；另一种是：在UserController的register()函数中使用线程池来执行每个观察者的handleRegSuccess()函数。两种实现方式的具体代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 第一种实现方式，其他类代码不变，就没有再重复罗列</span></span>
<span class="line"><span>public class RegPromotionObserver implements RegObserver {</span></span>
<span class="line"><span>  private PromotionService promotionService; // 依赖注入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void handleRegSuccess(Long userId) {</span></span>
<span class="line"><span>    Thread thread = new Thread(new Runnable() {</span></span>
<span class="line"><span>      &amp;#64;Override</span></span>
<span class="line"><span>      public void run() {</span></span>
<span class="line"><span>        promotionService.issueNewUserExperienceCash(userId);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    thread.start();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 第二种实现方式，其他类代码不变，就没有再重复罗列</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span>  private UserService userService; // 依赖注入</span></span>
<span class="line"><span>  private List&amp;lt;RegObserver&amp;gt; regObservers = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  private Executor executor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserController(Executor executor) {</span></span>
<span class="line"><span>    this.executor = executor;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setRegObservers(List&amp;lt;RegObserver&amp;gt; observers) {</span></span>
<span class="line"><span>    regObservers.addAll(observers);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Long register(String telephone, String password) {</span></span>
<span class="line"><span>    //省略输入参数的校验代码</span></span>
<span class="line"><span>    //省略userService.register()异常的try-catch代码</span></span>
<span class="line"><span>    long userId = userService.register(telephone, password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (RegObserver observer : regObservers) {</span></span>
<span class="line"><span>      executor.execute(new Runnable() {</span></span>
<span class="line"><span>        &amp;#64;Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>          observer.handleRegSuccess(userId);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return userId;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于第一种实现方式，频繁地创建和销毁线程比较耗时，并且并发线程数无法控制，创建过多的线程会导致堆栈溢出。第二种实现方式，尽管利用了线程池解决了第一种实现方式的问题，但线程池、异步执行逻辑都耦合在了register()函数中，增加了这部分业务代码的维护成本。</p><p>如果我们的需求更加极端一点，需要在同步阻塞和异步非阻塞之间灵活切换，那就要不停地修改UserController的代码。除此之外，如果在项目中，不止一个业务模块需要用到异步非阻塞观察者模式，那这样的代码实现也无法做到复用。</p><p>我们知道，框架的作用有：隐藏实现细节，降低开发难度，做到代码复用，解耦业务与非业务代码，让程序员聚焦业务开发。针对异步非阻塞观察者模式，我们也可以将它抽象成框架来达到这样的效果，而这个框架就是我们这节课要讲的EventBus。</p><h2 id="eventbus框架功能需求介绍" tabindex="-1">EventBus框架功能需求介绍 <a class="header-anchor" href="#eventbus框架功能需求介绍" aria-label="Permalink to &quot;EventBus框架功能需求介绍&quot;">​</a></h2><p>EventBus翻译为“事件总线”，它提供了实现观察者模式的骨架代码。我们可以基于此框架，非常容易地在自己的业务场景中实现观察者模式，不需要从零开始开发。其中，Google Guava EventBus就是一个比较著名的EventBus框架，它不仅仅支持异步非阻塞模式，同时也支持同步阻塞模式</p><p>现在，我们就通过例子来看一下，Guava EventBus具有哪些功能。还是上节课那个用户注册的例子，我们用Guava EventBus重新实现一下，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UserController {</span></span>
<span class="line"><span>  private UserService userService; // 依赖注入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private EventBus eventBus;</span></span>
<span class="line"><span>  private static final int DEFAULT_EVENTBUS_THREAD_POOL_SIZE = 20;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserController() {</span></span>
<span class="line"><span>    //eventBus = new EventBus();</span><span> // 同步阻塞模式</span></span>
<span class="line"><span>    eventBus = new AsyncEventBus(Executors.newFixedThreadPool(DEFAULT_EVENTBUS_THREAD_POOL_SIZE)); // 异步非阻塞模式</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setRegObservers(List&amp;lt;Object&amp;gt; observers) {</span></span>
<span class="line"><span>    for (Object observer : observers) {</span></span>
<span class="line"><span>      eventBus.register(observer);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Long register(String telephone, String password) {</span></span>
<span class="line"><span>    //省略输入参数的校验代码</span></span>
<span class="line"><span>    //省略userService.register()异常的try-catch代码</span></span>
<span class="line"><span>    long userId = userService.register(telephone, password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    eventBus.post(userId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return userId;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RegPromotionObserver {</span></span>
<span class="line"><span>  private PromotionService promotionService; // 依赖注入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Subscribe</span></span>
<span class="line"><span>  public void handleRegSuccess(Long userId) {</span></span>
<span class="line"><span>    promotionService.issueNewUserExperienceCash(userId);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RegNotificationObserver {</span></span>
<span class="line"><span>  private NotificationService notificationService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Subscribe</span></span>
<span class="line"><span>  public void handleRegSuccess(Long userId) {</span></span>
<span class="line"><span>    notificationService.sendInboxMessage(userId, &quot;...&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>利用EventBus框架实现的观察者模式，跟从零开始编写的观察者模式相比，从大的流程上来说，实现思路大致一样，都需要定义Observer，并且通过register()函数注册Observer，也都需要通过调用某个函数（比如，EventBus中的post()函数）来给Observer发送消息（在EventBus中消息被称作事件event）。</p><p>但在实现细节方面，它们又有些区别。基于EventBus，我们不需要定义Observer接口，任意类型的对象都可以注册到EventBus中，通过@Subscribe注解来标明类中哪个函数可以接收被观察者发送的消息。</p><p>接下来，我们详细地讲一下，Guava EventBus的几个主要的类和函数。</p><ul><li>EventBus、AsyncEventBus</li></ul><p>Guava EventBus对外暴露的所有可调用接口，都封装在EventBus类中。其中，EventBus实现了同步阻塞的观察者模式，AsyncEventBus继承自EventBus，提供了异步非阻塞的观察者模式。具体使用方式如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>EventBus eventBus = new EventBus(); // 同步阻塞模式</span></span>
<span class="line"><span>EventBus eventBus = new AsyncEventBus(Executors.newFixedThreadPool(8))；// 异步阻塞模式</span></span></code></pre></div><ul><li>register()函数</li></ul><p>EventBus类提供了register()函数用来注册观察者。具体的函数定义如下所示。它可以接受任何类型（Object）的观察者。而在经典的观察者模式的实现中，register()函数必须接受实现了同一Observer接口的类对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void register(Object object);</span></span></code></pre></div><ul><li>unregister()函数</li></ul><p>相对于register()函数，unregister()函数用来从EventBus中删除某个观察者。我就不多解释了，具体的函数定义如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void unregister(Object object);</span></span></code></pre></div><ul><li>post()函数</li></ul><p>EventBus类提供了post()函数，用来给观察者发送消息。具体的函数定义如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void post(Object event);</span></span></code></pre></div><p>跟经典的观察者模式的不同之处在于，当我们调用post()函数发送消息的时候，并非把消息发送给所有的观察者，而是发送给可匹配的观察者。所谓可匹配指的是，能接收的消息类型是发送消息（post函数定义中的event）类型的父类。我举个例子来解释一下。</p><p>比如，AObserver能接收的消息类型是XMsg，BObserver能接收的消息类型是YMsg，CObserver能接收的消息类型是ZMsg。其中，XMsg是YMsg的父类。当我们如下发送消息的时候，相应能接收到消息的可匹配观察者如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>XMsg xMsg = new XMsg();</span></span>
<span class="line"><span>YMsg yMsg = new YMsg();</span></span>
<span class="line"><span>ZMsg zMsg = new ZMsg();</span></span>
<span class="line"><span>post(xMsg); =&amp;gt; AObserver接收到消息</span></span>
<span class="line"><span>post(yMsg); =&amp;gt; AObserver、BObserver接收到消息</span></span>
<span class="line"><span>post(zMsg); =&amp;gt; CObserver接收到消息</span></span></code></pre></div><p>你可能会问，每个Observer能接收的消息类型是在哪里定义的呢？我们来看下Guava EventBus最特别的一个地方，那就是@Subscribe注解。</p><ul><li>@Subscribe注解</li></ul><p>EventBus通过@Subscribe注解来标明，某个函数能接收哪种类型的消息。具体的使用代码如下所示。在DObserver类中，我们通过@Subscribe注解了两个函数f1()、f2()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public DObserver {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Subscribe</span></span>
<span class="line"><span>  public void f1(PMsg event) { //... }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Subscribe</span></span>
<span class="line"><span>  public void f2(QMsg event) { //... }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当通过register()函数将DObserver 类对象注册到EventBus的时候，EventBus会根据@Subscribe注解找到f1()和f2()，并且将两个函数能接收的消息类型记录下来（PMsg-&gt;f1，QMsg-&gt;f2）。当我们通过post()函数发送消息（比如QMsg消息）的时候，EventBus会通过之前的记录（QMsg-&gt;f2），调用相应的函数（f2）。</p><h2 id="手把手实现一个eventbus框架" tabindex="-1">手把手实现一个EventBus框架 <a class="header-anchor" href="#手把手实现一个eventbus框架" aria-label="Permalink to &quot;手把手实现一个EventBus框架&quot;">​</a></h2><p>Guava EventBus的功能我们已经讲清楚了，总体上来说，还是比较简单的。接下来，我们就重复造轮子，“山寨”一个EventBus出来。</p><p>我们重点来看，EventBus中两个核心函数register()和post()的实现原理。弄懂了它们，基本上就弄懂了整个EventBus框架。下面两张图是这两个函数的实现原理图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/211239/c3760c7f5ff8d93e0e42e5ce1a4376e1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/211239/c3760c7f5ff8d93e0e42e5ce1a4376e1.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/211239/8d5c765ed641a89fe80fd64aa61be31a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/211239/8d5c765ed641a89fe80fd64aa61be31a.jpg" alt=""></a></p><p>从图中我们可以看出，最关键的一个数据结构是Observer注册表，记录了消息类型和可接收消息函数的对应关系。当调用register()函数注册观察者的时候，EventBus通过解析@Subscribe注解，生成Observer注册表。当调用post()函数发送消息的时候，EventBus通过注册表找到相应的可接收消息的函数，然后通过Java的反射语法来动态地创建对象、执行函数。对于同步阻塞模式，EventBus在一个线程内依次执行相应的函数。对于异步非阻塞模式，EventBus通过一个线程池来执行相应的函数。</p><p>弄懂了原理，实现起来就简单多了。整个小框架的代码实现包括5个类：EventBus、AsyncEventBus、Subscribe、ObserverAction、ObserverRegistry。接下来，我们依次来看下这5个类。</p><h3 id="_1-subscribe" tabindex="-1">1.Subscribe <a class="header-anchor" href="#_1-subscribe" aria-label="Permalink to &quot;1.Subscribe&quot;">​</a></h3><p>Subscribe是一个注解，用于标明观察者中的哪个函数可以接收消息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Target(ElementType.METHOD)</span></span>
<span class="line"><span>&amp;#64;Beta</span></span>
<span class="line"><span>public &amp;#64;interface Subscribe {}</span></span></code></pre></div><h3 id="_2-observeraction" tabindex="-1">2.ObserverAction <a class="header-anchor" href="#_2-observeraction" aria-label="Permalink to &quot;2.ObserverAction&quot;">​</a></h3><p>ObserverAction类用来表示@Subscribe注解的方法，其中，target表示观察者类，method表示方法。它主要用在ObserverRegistry观察者注册表中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ObserverAction {</span></span>
<span class="line"><span>  private Object target;</span></span>
<span class="line"><span>  private Method method;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ObserverAction(Object target, Method method) {</span></span>
<span class="line"><span>    this.target = Preconditions.checkNotNull(target);</span></span>
<span class="line"><span>    this.method = method;</span></span>
<span class="line"><span>    this.method.setAccessible(true);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void execute(Object event) { // event是method方法的参数</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      method.invoke(target, event);</span></span>
<span class="line"><span>    } catch (InvocationTargetException | IllegalAccessException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_3-observerregistry" tabindex="-1">3.ObserverRegistry <a class="header-anchor" href="#_3-observerregistry" aria-label="Permalink to &quot;3.ObserverRegistry&quot;">​</a></h3><p>ObserverRegistry类就是前面讲到的Observer注册表，是最复杂的一个类，框架中几乎所有的核心逻辑都在这个类中。这个类大量使用了Java的反射语法，不过代码整体来说都不难理解，其中，一个比较有技巧的地方是CopyOnWriteArraySet的使用。</p><p>CopyOnWriteArraySet，顾名思义，在写入数据的时候，会创建一个新的set，并且将原始数据clone到新的set中，在新的set中写入数据完成之后，再用新的set替换老的set。这样就能保证在写入数据的时候，不影响数据的读取操作，以此来解决读写并发问题。除此之外，CopyOnWriteSet还通过加锁的方式，避免了并发写冲突。具体的作用你可以去查看一下CopyOnWriteSet类的源码，一目了然。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ObserverRegistry {</span></span>
<span class="line"><span>  private ConcurrentMap&amp;lt;Class&amp;lt;?&amp;gt;, CopyOnWriteArraySet&amp;lt;ObserverAction&amp;gt;&amp;gt; registry = new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void register(Object observer) {</span></span>
<span class="line"><span>    Map&amp;lt;Class&amp;lt;?&amp;gt;, Collection&amp;lt;ObserverAction&amp;gt;&amp;gt; observerActions = findAllObserverActions(observer);</span></span>
<span class="line"><span>    for (Map.Entry&amp;lt;Class&amp;lt;?&amp;gt;, Collection&amp;lt;ObserverAction&amp;gt;&amp;gt; entry : observerActions.entrySet()) {</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; eventType = entry.getKey();</span></span>
<span class="line"><span>      Collection&amp;lt;ObserverAction&amp;gt; eventActions = entry.getValue();</span></span>
<span class="line"><span>      CopyOnWriteArraySet&amp;lt;ObserverAction&amp;gt; registeredEventActions = registry.get(eventType);</span></span>
<span class="line"><span>      if (registeredEventActions == null) {</span></span>
<span class="line"><span>        registry.putIfAbsent(eventType, new CopyOnWriteArraySet&amp;lt;&amp;gt;());</span></span>
<span class="line"><span>        registeredEventActions = registry.get(eventType);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      registeredEventActions.addAll(eventActions);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public List&amp;lt;ObserverAction&amp;gt; getMatchedObserverActions(Object event) {</span></span>
<span class="line"><span>    List&amp;lt;ObserverAction&amp;gt; matchedObservers = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    Class&amp;lt;?&amp;gt; postedEventType = event.getClass();</span></span>
<span class="line"><span>    for (Map.Entry&amp;lt;Class&amp;lt;?&amp;gt;, CopyOnWriteArraySet&amp;lt;ObserverAction&amp;gt;&amp;gt; entry : registry.entrySet()) {</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; eventType = entry.getKey();</span></span>
<span class="line"><span>      Collection&amp;lt;ObserverAction&amp;gt; eventActions = entry.getValue();</span></span>
<span class="line"><span>      if (postedEventType.isAssignableFrom(eventType)) {</span></span>
<span class="line"><span>        matchedObservers.addAll(eventActions);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return matchedObservers;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private Map&amp;lt;Class&amp;lt;?&amp;gt;, Collection&amp;lt;ObserverAction&amp;gt;&amp;gt; findAllObserverActions(Object observer) {</span></span>
<span class="line"><span>    Map&amp;lt;Class&amp;lt;?&amp;gt;, Collection&amp;lt;ObserverAction&amp;gt;&amp;gt; observerActions = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    Class&amp;lt;?&amp;gt; clazz = observer.getClass();</span></span>
<span class="line"><span>    for (Method method : getAnnotatedMethods(clazz)) {</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt;[] parameterTypes = method.getParameterTypes();</span></span>
<span class="line"><span>      Class&amp;lt;?&amp;gt; eventType = parameterTypes[0];</span></span>
<span class="line"><span>      if (!observerActions.containsKey(eventType)) {</span></span>
<span class="line"><span>        observerActions.put(eventType, new ArrayList&amp;lt;&amp;gt;());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      observerActions.get(eventType).add(new ObserverAction(observer, method));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return observerActions;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private List&amp;lt;Method&amp;gt; getAnnotatedMethods(Class&amp;lt;?&amp;gt; clazz) {</span></span>
<span class="line"><span>    List&amp;lt;Method&amp;gt; annotatedMethods = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    for (Method method : clazz.getDeclaredMethods()) {</span></span>
<span class="line"><span>      if (method.isAnnotationPresent(Subscribe.class)) {</span></span>
<span class="line"><span>        Class&amp;lt;?&amp;gt;[] parameterTypes = method.getParameterTypes();</span></span>
<span class="line"><span>        Preconditions.checkArgument(parameterTypes.length == 1,</span></span>
<span class="line"><span>                &quot;Method %s has &amp;#64;Subscribe annotation but has %s parameters.&quot;</span></span>
<span class="line"><span>                        + &quot;Subscriber methods must have exactly 1 parameter.&quot;,</span></span>
<span class="line"><span>                method, parameterTypes.length);</span></span>
<span class="line"><span>        annotatedMethods.add(method);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return annotatedMethods;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_4-eventbus" tabindex="-1">4.EventBus <a class="header-anchor" href="#_4-eventbus" aria-label="Permalink to &quot;4.EventBus&quot;">​</a></h3><p>EventBus实现的是阻塞同步的观察者模式。看代码你可能会有些疑问，这明明就用到了线程池Executor啊。实际上，MoreExecutors.directExecutor()是Google Guava提供的工具类，看似是多线程，实际上是单线程。之所以要这么实现，主要还是为了跟AsyncEventBus统一代码逻辑，做到代码复用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class EventBus {</span></span>
<span class="line"><span>  private Executor executor;</span></span>
<span class="line"><span>  private ObserverRegistry registry = new ObserverRegistry();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public EventBus() {</span></span>
<span class="line"><span>    this(MoreExecutors.directExecutor());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  protected EventBus(Executor executor) {</span></span>
<span class="line"><span>    this.executor = executor;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void register(Object object) {</span></span>
<span class="line"><span>    registry.register(object);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void post(Object event) {</span></span>
<span class="line"><span>    List&amp;lt;ObserverAction&amp;gt; observerActions = registry.getMatchedObserverActions(event);</span></span>
<span class="line"><span>    for (ObserverAction observerAction : observerActions) {</span></span>
<span class="line"><span>      executor.execute(new Runnable() {</span></span>
<span class="line"><span>        &amp;#64;Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>          observerAction.execute(event);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_5-asynceventbus" tabindex="-1">5.AsyncEventBus <a class="header-anchor" href="#_5-asynceventbus" aria-label="Permalink to &quot;5.AsyncEventBus&quot;">​</a></h3><p>有了EventBus，AsyncEventBus的实现就非常简单了。为了实现异步非阻塞的观察者模式，它就不能再继续使用MoreExecutors.directExecutor()了，而是需要在构造函数中，由调用者注入线程池。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AsyncEventBus extends EventBus {</span></span>
<span class="line"><span>  public AsyncEventBus(Executor executor) {</span></span>
<span class="line"><span>    super(executor);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此，我们用了不到200行代码，就实现了一个还算凑活能用的EventBus，从功能上来讲，它跟Google Guava EventBus几乎一样。不过，如果去查看 <a href="https://github.com/google/guava" target="_blank" rel="noreferrer">Google Guava EventBus的源码</a>，你会发现，在实现细节方面，相比我们现在的实现，它其实做了很多优化，比如优化了在注册表中查找消息可匹配函数的算法。如果有时间的话，建议你去读一下它的源码。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们来一块总结回顾一下，你需要重点掌握的内容。</p><p>框架的作用有：隐藏实现细节，降低开发难度，做到代码复用，解耦业务与非业务代码，让程序员聚焦业务开发。针对异步非阻塞观察者模式，我们也可以将它抽象成框架来达到这样的效果，而这个框架就是我们这节课讲的EventBus。EventBus翻译为“事件总线”，它提供了实现观察者模式的骨架代码。我们可以基于此框架，非常容易地在自己的业务场景中实现观察者模式，不需要从零开始开发。</p><p>很多人觉得做业务开发没有技术挑战，实际上，做业务开发也会涉及很多非业务功能的开发，比如今天讲到的EventBus。在平时的业务开发中，我们要善于抽象这些非业务的、可复用的功能，并积极地把它们实现成通用的框架。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>在今天内容的第二个模块“EventBus框架功能需求介绍”中，我们用Guava EventBus重新实现了UserController，实际上，代码还是不够解耦。UserController还是耦合了很多跟观察者模式相关的非业务代码，比如创建线程池、注册Observer。为了让UserController更加聚焦在业务功能上，你有什么重构的建议吗？</p><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,70)])])}const g=n(t,[["render",l]]);export{b as __pageData,g as default};
