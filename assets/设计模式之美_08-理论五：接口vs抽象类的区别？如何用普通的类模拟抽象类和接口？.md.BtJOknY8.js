import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"08 | 理论五：接口vs抽象类的区别？如何用普通的类模拟抽象类和接口？","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是抽象类和接口？区别在哪里？","slug":"什么是抽象类和接口-区别在哪里","link":"#什么是抽象类和接口-区别在哪里","children":[]},{"level":2,"title":"抽象类和接口能解决什么编程问题？","slug":"抽象类和接口能解决什么编程问题","link":"#抽象类和接口能解决什么编程问题","children":[]},{"level":2,"title":"如何模拟抽象类和接口两个语法概念？","slug":"如何模拟抽象类和接口两个语法概念","link":"#如何模拟抽象类和接口两个语法概念","children":[]},{"level":2,"title":"如何决定该用抽象类还是接口？","slug":"如何决定该用抽象类还是接口","link":"#如何决定该用抽象类还是接口","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/08-理论五：接口vs抽象类的区别？如何用普通的类模拟抽象类和接口？.md","filePath":"设计模式之美/08-理论五：接口vs抽象类的区别？如何用普通的类模拟抽象类和接口？.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/08-理论五：接口vs抽象类的区别？如何用普通的类模拟抽象类和接口？.md"};function i(t,s,c,o,r,g){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_08-理论五-接口vs抽象类的区别-如何用普通的类模拟抽象类和接口" tabindex="-1">08 | 理论五：接口vs抽象类的区别？如何用普通的类模拟抽象类和接口？ <a class="header-anchor" href="#_08-理论五-接口vs抽象类的区别-如何用普通的类模拟抽象类和接口" aria-label="Permalink to &quot;08 | 理论五：接口vs抽象类的区别？如何用普通的类模拟抽象类和接口？&quot;">​</a></h1><p>在面向对象编程中，抽象类和接口是两个经常被用到的语法概念，是面向对象四大特性，以及很多设计模式、设计思想、设计原则编程实现的基础。比如，我们可以使用接口来实现面向对象的抽象特性、多态特性和基于接口而非实现的设计原则，使用抽象类来实现面向对象的继承特性和模板设计模式等等。</p><p>不过，并不是所有的面向对象编程语言都支持这两个语法概念，比如，C++这种编程语言只支持抽象类，不支持接口；而像Python这样的动态编程语言，既不支持抽象类，也不支持接口。尽管有些编程语言没有提供现成的语法来支持接口和抽象类，我们仍然可以通过一些手段来模拟实现这两个语法概念。</p><p>这两个语法概念不仅在工作中经常会被用到，在面试中也经常被提及。比如，“接口和抽象类的区别是什么？什么时候用接口？什么时候用抽象类？抽象类和接口存在的意义是什么？能解决哪些编程问题？”等等。</p><p>你可以先试着回答一下，刚刚我提出的几个问题。如果你对某些问题还有些模糊不清，那也没关系，今天，我会带你把这几个问题彻底搞清楚。下面我们就一起来看！</p><h2 id="什么是抽象类和接口-区别在哪里" tabindex="-1">什么是抽象类和接口？区别在哪里？ <a class="header-anchor" href="#什么是抽象类和接口-区别在哪里" aria-label="Permalink to &quot;什么是抽象类和接口？区别在哪里？&quot;">​</a></h2><p>不同的编程语言对接口和抽象类的定义方式可能有些差别，但差别并不会很大。Java这种编程语言，既支持抽象类，也支持接口，所以，为了让你对这两个语法概念有比较直观的认识，我们拿Java这种编程语言来举例讲解。</p><p><strong>首先，我们来看一下，在Java这种编程语言中，我们是如何定义抽象类的。</strong></p><p>下面这段代码是一个比较典型的抽象类的使用场景（模板设计模式）。Logger是一个记录日志的抽象类，FileLogger和MessageQueueLogger继承Logger，分别实现两种不同的日志记录方式：记录日志到文件中和记录日志到消息队列中。FileLogger和MessageQueueLogger两个子类复用了父类Logger中的name、enabled、minPermittedLevel属性和log()方法，但因为这两个子类写日志的方式不同，它们又各自重写了父类中的doLog()方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 抽象类</span></span>
<span class="line"><span>public abstract class Logger {</span></span>
<span class="line"><span>  private String name;</span></span>
<span class="line"><span>  private boolean enabled;</span></span>
<span class="line"><span>  private Level minPermittedLevel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Logger(String name, boolean enabled, Level minPermittedLevel) {</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>    this.enabled = enabled;</span></span>
<span class="line"><span>    this.minPermittedLevel = minPermittedLevel;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void log(Level level, String message) {</span></span>
<span class="line"><span>    boolean loggable = enabled &amp;&amp; (minPermittedLevel.intValue() &amp;lt;= level.intValue());</span></span>
<span class="line"><span>    if (!loggable) return;</span></span>
<span class="line"><span>    doLog(level, message);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  protected abstract void doLog(Level level, String message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 抽象类的子类：输出日志到文件</span></span>
<span class="line"><span>public class FileLogger extends Logger {</span></span>
<span class="line"><span>  private Writer fileWriter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public FileLogger(String name, boolean enabled,</span></span>
<span class="line"><span>    Level minPermittedLevel, String filepath) {</span></span>
<span class="line"><span>    super(name, enabled, minPermittedLevel);</span></span>
<span class="line"><span>    this.fileWriter = new FileWriter(filepath);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void doLog(Level level, String mesage) {</span></span>
<span class="line"><span>    // 格式化level和message,输出到日志文件</span></span>
<span class="line"><span>    fileWriter.write(...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 抽象类的子类: 输出日志到消息中间件(比如kafka)</span></span>
<span class="line"><span>public class MessageQueueLogger extends Logger {</span></span>
<span class="line"><span>  private MessageQueueClient msgQueueClient;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public MessageQueueLogger(String name, boolean enabled,</span></span>
<span class="line"><span>    Level minPermittedLevel, MessageQueueClient msgQueueClient) {</span></span>
<span class="line"><span>    super(name, enabled, minPermittedLevel);</span></span>
<span class="line"><span>    this.msgQueueClient = msgQueueClient;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  protected void doLog(Level level, String mesage) {</span></span>
<span class="line"><span>    // 格式化level和message,输出到消息中间件</span></span>
<span class="line"><span>    msgQueueClient.send(...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面的这个例子，我们来看一下，抽象类具有哪些特性。我总结了下面三点。</p><ul><li>抽象类不允许被实例化，只能被继承。也就是说，你不能new一个抽象类的对象出来（Logger logger = new Logger(...);会报编译错误）。</li><li>抽象类可以包含属性和方法。方法既可以包含代码实现（比如Logger中的log()方法），也可以不包含代码实现（比如Logger中的doLog()方法）。不包含代码实现的方法叫作抽象方法。</li><li>子类继承抽象类，必须实现抽象类中的所有抽象方法。对应到例子代码中就是，所有继承Logger抽象类的子类，都必须重写doLog()方法。</li></ul><p><strong>刚刚我们讲了如何定义抽象类，现在我们再来看一下，在Java这种编程语言中，我们如何定义接口。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 接口</span></span>
<span class="line"><span>public interface Filter {</span></span>
<span class="line"><span>  void doFilter(RpcRequest req) throws RpcException;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 接口实现类：鉴权过滤器</span></span>
<span class="line"><span>public class AuthencationFilter implements Filter {</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void doFilter(RpcRequest req) throws RpcException {</span></span>
<span class="line"><span>    //...鉴权逻辑..</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 接口实现类：限流过滤器</span></span>
<span class="line"><span>public class RateLimitFilter implements Filter {</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void doFilter(RpcRequest req) throws RpcException {</span></span>
<span class="line"><span>    //...限流逻辑...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 过滤器使用Demo</span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>  // filters.add(new AuthencationFilter());</span></span>
<span class="line"><span>  // filters.add(new RateLimitFilter());</span></span>
<span class="line"><span>  private List&amp;lt;Filter&amp;gt; filters = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void handleRpcRequest(RpcRequest req) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      for (Filter filter : filters) {</span></span>
<span class="line"><span>        filter.doFilter(req);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch(RpcException e) {</span></span>
<span class="line"><span>      // ...处理过滤结果...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // ...省略其他处理逻辑...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这段代码是一个比较典型的接口的使用场景。我们通过Java中的interface关键字定义了一个Filter接口。AuthencationFilter和RateLimitFilter是接口的两个实现类，分别实现了对RPC请求鉴权和限流的过滤功能。</p><p>代码非常简洁。结合代码，我们再来看一下，接口都有哪些特性。我也总结了三点。</p><ul><li>接口不能包含属性（也就是成员变量）。</li><li>接口只能声明方法，方法不能包含代码实现。</li><li>类实现接口的时候，必须实现接口中声明的所有方法。</li></ul><p>前面我们讲了抽象类和接口的定义，以及各自的语法特性。从语法特性上对比，这两者有比较大的区别，比如抽象类中可以定义属性、方法的实现，而接口中不能定义属性，方法也不能包含代码实现等等。除了语法特性，从设计的角度，两者也有比较大的区别。</p><p>抽象类实际上就是类，只不过是一种特殊的类，这种类不能被实例化为对象，只能被子类继承。我们知道，继承关系是一种is-a的关系，那抽象类既然属于类，也表示一种is-a的关系。相对于抽象类的is-a关系来说，接口表示一种has-a关系，表示具有某些功能。对于接口，有一个更加形象的叫法，那就是协议（contract）。</p><h2 id="抽象类和接口能解决什么编程问题" tabindex="-1">抽象类和接口能解决什么编程问题？ <a class="header-anchor" href="#抽象类和接口能解决什么编程问题" aria-label="Permalink to &quot;抽象类和接口能解决什么编程问题？&quot;">​</a></h2><p>刚刚我们学习了抽象类和接口的定义和区别，现在我们再来学习一下，抽象类和接口存在的意义，让你知其然知其所以然。</p><p><strong>首先，我们来看一下，我们为什么需要抽象类？它能够解决什么编程问题？</strong></p><p>刚刚我们讲到，抽象类不能实例化，只能被继承。而前面的章节中，我们还讲到，继承能解决代码复用的问题。所以，抽象类也是为代码复用而生的。多个子类可以继承抽象类中定义的属性和方法，避免在子类中，重复编写相同的代码。</p><p>不过，既然继承本身就能达到代码复用的目的，\b而继承也并不要求父类一定是抽象类，那我们不使用抽象类，照样也可以实现继承和复用。从这个角度上来讲，我们貌似并不需要抽象类这种语法呀。那抽象类除了解决代码复用的问题，还有什么其他存在的意义吗？</p><p>我们还是拿之前那个打印日志的例子来讲解。我们先对上面的代码做下改造。在改造之后的代码中，Logger不再是抽象类，只是一个普通的父类，删除了Logger中log()、doLog()方法，新增了isLoggable()方法。FileLogger和MessageQueueLogger还是继承Logger父类，以达到代码复用的目的。具体的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 父类：非抽象类，就是普通的类. 删除了log(),doLog()，新增了isLoggable().</span></span>
<span class="line"><span>public class Logger {</span></span>
<span class="line"><span>  private String name;</span></span>
<span class="line"><span>  private boolean enabled;</span></span>
<span class="line"><span>  private Level minPermittedLevel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Logger(String name, boolean enabled, Level minPermittedLevel) {</span></span>
<span class="line"><span>    //...构造函数不变，代码省略...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  protected boolean isLoggable() {</span></span>
<span class="line"><span>    boolean loggable = enabled &amp;&amp; (minPermittedLevel.intValue() &amp;lt;= level.intValue());</span></span>
<span class="line"><span>    return loggable;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 子类：输出日志到文件</span></span>
<span class="line"><span>public class FileLogger extends Logger {</span></span>
<span class="line"><span>  private Writer fileWriter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public FileLogger(String name, boolean enabled,</span></span>
<span class="line"><span>    Level minPermittedLevel, String filepath) {</span></span>
<span class="line"><span>    //...构造函数不变，代码省略...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void log(Level level, String mesage) {</span></span>
<span class="line"><span>    if (!isLoggable()) return;</span></span>
<span class="line"><span>    // 格式化level和message,输出到日志文件</span></span>
<span class="line"><span>    fileWriter.write(...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 子类: 输出日志到消息中间件(比如kafka)</span></span>
<span class="line"><span>public class MessageQueueLogger extends Logger {</span></span>
<span class="line"><span>  private MessageQueueClient msgQueueClient;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public MessageQueueLogger(String name, boolean enabled,</span></span>
<span class="line"><span>    Level minPermittedLevel, MessageQueueClient msgQueueClient) {</span></span>
<span class="line"><span>    //...构造函数不变，代码省略...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void log(Level level, String mesage) {</span></span>
<span class="line"><span>    if (!isLoggable()) return;</span></span>
<span class="line"><span>    // 格式化level和message,输出到消息中间件</span></span>
<span class="line"><span>    msgQueueClient.send(...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个设计思路虽然达到了代码复用的目的，但是无法使用多态特性了。像下面这样编写代码，就会出现编译错误，因为Logger中并没有定义log()方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Logger logger = new FileLogger(&quot;access-log&quot;, true, Level.WARN, &quot;/users/wangzheng/access.log&quot;);</span></span>
<span class="line"><span>logger.log(Level.ERROR, &quot;This is a test log message.&quot;);</span></span></code></pre></div><p>你可能会说，这个问题解决起来很简单啊。我们在Logger父类中，定义一个空的log()方法，让子类重写父类的log()方法，实现自己的记录日志的逻辑，不就可以了吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Logger {</span></span>
<span class="line"><span>  // ...省略部分代码...</span></span>
<span class="line"><span>  public void log(Level level, String mesage) { // do nothing... }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class FileLogger extends Logger {</span></span>
<span class="line"><span>  // ...省略部分代码...</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void log(Level level, String mesage) {</span></span>
<span class="line"><span>    if (!isLoggable()) return;</span></span>
<span class="line"><span>    // 格式化level和message,输出到日志文件</span></span>
<span class="line"><span>    fileWriter.write(...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class MessageQueueLogger extends Logger {</span></span>
<span class="line"><span>  // ...省略部分代码...</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void log(Level level, String mesage) {</span></span>
<span class="line"><span>    if (!isLoggable()) return;</span></span>
<span class="line"><span>    // 格式化level和message,输出到消息中间件</span></span>
<span class="line"><span>    msgQueueClient.send(...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个设计思路能用，但是，它显然没有之前通过抽象类的实现思路优雅。我为什么这么说呢？主要有以下几点原因。</p><ul><li>在Logger中定义一个空的方法，会影响代码的可读性。如果我们不熟悉Logger背后的设计思想，代码注释又不怎么给力，我们在阅读Logger代码的时候，就可能对为什么定义一个空的log()方法而感到疑惑，需要查看Logger、FileLogger、MessageQueueLogger之间的继承关系，才能弄明白其设计意图。</li><li>当创建一个新的子类继承Logger父类的时候，我们有可能会忘记重新实现log()方法。之前基于抽象类的设计思路，编译器会强制要求子类重写log()方法，否则会报编译错误。你可能会说，我既然要定义一个新的Logger子类，怎么会忘记重新实现log()方法呢？我们举的例子比较简单，Logger中的方法不多，代码行数也很少。但是，如果Logger有几百行，有n多方法，除非你对Logger的设计非常熟悉，否则忘记重新实现log()方法，也不是不可能的。</li><li>Logger可以被实例化，换句话说，我们可以new一个Logger出来，并且调用空的log()方法。这也增加了类被误用的风险。当然，这个问题可以通过设置私有的构造函数的方式来解决。不过，显然没有通过抽象类来的优雅。</li></ul><p><strong>其次，我们再来看一下，我们为什么需要接口？它能够解决什么编程问题？</strong></p><p>抽象类更多的是为了代码复用，而接口就更侧重于解耦。接口是对行为的一种抽象，相当于一组协议或者契约，你可以联想类比一下API接口。调用者只需要关注抽象的接口，不需要了解具体的实现，具体的实现代码对调用者透明。接口实现了约定和实现相分离，可以降低代码间的耦合性，提高代码的可扩展性。</p><p>实际上，接口是一个比抽象类应用更加广泛、更加重要的知识点。比如，我们经常提到的“基于接口而非实现编程”，就是一条几乎天天会用到，并且能极大地提高代码的灵活性、扩展性的设计思想。关于接口这个知识点，我会单独再用一节课的时间，更加详细全面的讲解，这里就不展开了。</p><h2 id="如何模拟抽象类和接口两个语法概念" tabindex="-1">如何模拟抽象类和接口两个语法概念？ <a class="header-anchor" href="#如何模拟抽象类和接口两个语法概念" aria-label="Permalink to &quot;如何模拟抽象类和接口两个语法概念？&quot;">​</a></h2><p>在前面举的例子中，我们使用Java的接口语法实现了一个Filter过滤器。不过，如果你熟悉的是C++这种编程语言，你可能会说，C++只有抽象类，并没有接口，那从代码实现的角度上来说，是不是就无法实现Filter的设计思路了呢？</p><p>实际上，我们可以通过抽象类来模拟接口。怎么来模拟呢？这是一个不错的面试题，你可以先思考一下，然后再来看我的讲解。</p><p>我们先来回忆一下接口的定义：接口中没有成员变量，只有方法声明，没有方法实现，实现接口的类必须实现接口中的所有方法。只要满足这样几点，从设计的角度上来说，我们就可以把它叫作接口。实际上，要满足接口的这些语法特性并不难。在下面这段C++代码中，我们就用抽象类模拟了一个接口（下面这段代码实际上是策略模式中的一段代码）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Strategy { // 用抽象类模拟接口</span></span>
<span class="line"><span>  public:</span></span>
<span class="line"><span>    ~Strategy();</span></span>
<span class="line"><span>    virtual void algorithm()=0;</span></span>
<span class="line"><span>  protected:</span></span>
<span class="line"><span>    Strategy();</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>抽象类Strategy没有定义任何属性，并且所有的方法都声明为virtual类型（等同于Java中的abstract关键字），这样，所有的方法都不能有代码实现，并且所有继承这个抽象类的子类，都要实现这些方法。从语法特性上来看，这个抽象类就相当于一个接口。</p><p>不过，如果你熟悉的既不是Java，也不是C++，而是现在比较流行的动态编程语言，比如Python、Ruby等，你可能还会有疑问：在这些动态语言中，不仅没有接口的概念，也没有类似abstract、virtual这样的关键字来定义抽象类，那该如何实现上面的讲到的Filter、Logger的设计思路呢？实际上，除了用抽象类来模拟接口之外，我们还可以用普通类来模拟接口。具体的Java代码实现如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MockInteface {</span></span>
<span class="line"><span>  protected MockInteface() {}</span></span>
<span class="line"><span>  public void funcA() {</span></span>
<span class="line"><span>    throw new MethodUnSupportedException();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们知道类中的方法必须包含实现，这个不符合接口的定义。但是，我们可以让类中的方法抛出MethodUnSupportedException异常，来模拟不包含实现的接口，并且能强迫子类在继承这个父类的时候，都去主动实现父类的方法，否则就会在运行时抛出异常。我们将构造函数设置成protected属性的，这样就能避免非同包下的类去实例化MockInterface。不过，这样还是无法避免同包中的类去实例化MockInterface。为了解决这个问题，我们可以学习Google Guava中@VisibleForTesting注解的做法，自定义一个注解，人为表明不可实例化。</p><p>刚刚我们讲了如何用抽象类来模拟接口，以及如何用普通类来模拟接口，那如何用普通类来模拟抽象类呢？这个问题留给你自己思考，你可以留言说说你的实现方法。</p><p>实际上，对于动态编程语言来说，还有一种对接口支持的策略，那就是duck-typing。我们在上一节课中讲到多态的时候也有讲过，你可以再回忆一下。</p><h2 id="如何决定该用抽象类还是接口" tabindex="-1">如何决定该用抽象类还是接口？ <a class="header-anchor" href="#如何决定该用抽象类还是接口" aria-label="Permalink to &quot;如何决定该用抽象类还是接口？&quot;">​</a></h2><p>刚刚的讲解可能有些偏理论，现在，我们就从真实项目开发的角度来看一下，在代码设计、编程开发的时候，什么时候该用抽象类？什么时候该用接口？</p><p>实际上，判断的标准很简单。如果我们要表示一种is-a的关系，并且是为了解决代码复用的问题，我们就用抽象类；如果我们要表示\b一种has-a关系，并且是为了解决抽象而非代码复用的问题，那我们就可以使用接口。</p><p>从类的继承层次上来看，抽象类是一种自下而上的设计思路，先有子类的代码重复，然后再抽象成上层的父类（也就是抽象类）。而接口正好相反，它是一种自上而下的设计思路。我们在编程的时候，一般都是先设计接口，再去考虑具体的实现。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天内容就讲完了，我们一块来总结回顾一下，你需要掌握的重点内容。</p><p><strong>1.抽象类和接口的语法特性</strong></p><p>抽象类不允许被实例化，只能被继承。它可以包含属性和方法。方法既可以包含代码实现，也可以不包含代码实现。不包含代码实现的方法叫作抽象方法。子类继承抽象类，必须实现抽象类中的所有抽象方法。接口不能包含属性，只能声明方法，方法不能包含代码实现。类实现接口的时候，必须实现接口中声明的所有方法。</p><p><strong>2.抽象类和接口存在的意义</strong></p><p>抽象类是对成员变量和方法的抽象，是一种is-a关系，是为了解决代码复用问题。接口仅仅是对方法的抽象，是一种has-a关系，表示具有某一组行为特性，是为了解决解耦问题，隔离接口和具体的实现，提高代码的扩展性。</p><p><strong>3.抽象类和接口的应用场景区别</strong></p><p>什么时候该用抽象类？什么时候该用接口？实际上，判断的标准很简单。如果要表示一种is-a的关系，并且是为了解决代码复用问题，我们就用抽象类；如果要表示\b一种has-a关系，并且是为了解决抽象而非代码复用问题，那我们就用接口。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><ol><li>你熟悉的编程语言，是否有现成的语法支持接口和抽象类呢？具体是如何定义的呢？</li><li>前面我们提到，接口和抽象类是两个经常在面试中被问到的概念。学习完今天的内容之后，你是否对抽象类和接口有一个新的认识呢？如果面试官再让你聊聊接口和抽象类，你会如何回答呢？</li></ol><p>欢迎在留言区写下你的答案，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,61)])])}const v=n(l,[["render",i]]);export{u as __pageData,v as default};
