import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"60 | 策略模式（上）：如何避免冗长的if-else/switch分支判断代码？","description":"","frontmatter":{},"headers":[{"level":2,"title":"策略模式的原理与实现","slug":"策略模式的原理与实现","link":"#策略模式的原理与实现","children":[{"level":3,"title":"1.策略的定义","slug":"_1-策略的定义","link":"#_1-策略的定义","children":[]},{"level":3,"title":"2.策略的创建","slug":"_2-策略的创建","link":"#_2-策略的创建","children":[]},{"level":3,"title":"3.策略的使用","slug":"_3-策略的使用","link":"#_3-策略的使用","children":[]}]},{"level":2,"title":"如何利用策略模式避免分支判断？","slug":"如何利用策略模式避免分支判断","link":"#如何利用策略模式避免分支判断","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/60-策略模式（上）：如何避免冗长的if-else-switch分支判断代码？.md","filePath":"设计模式之美/60-策略模式（上）：如何避免冗长的if-else-switch分支判断代码？.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/60-策略模式（上）：如何避免冗长的if-else-switch分支判断代码？.md"};function t(i,s,c,r,o,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_60-策略模式-上-如何避免冗长的if-else-switch分支判断代码" tabindex="-1">60 | 策略模式（上）：如何避免冗长的if-else/switch分支判断代码？ <a class="header-anchor" href="#_60-策略模式-上-如何避免冗长的if-else-switch分支判断代码" aria-label="Permalink to &quot;60 | 策略模式（上）：如何避免冗长的if-else/switch分支判断代码？&quot;">​</a></h1><p>上两节课中，我们学习了模板模式。模板模式主要起到代码复用和扩展的作用。除此之外，我们还讲到了回调，它跟模板模式的作用类似，但使用起来更加灵活。它们之间的主要区别在于代码实现，模板模式基于继承来实现，回调基于组合来实现。</p><p>今天，我们开始学习另外一种行为型模式，策略模式。在实际的项目开发中，这个模式也比较常用。最常见的应用场景是，利用它来避免冗长的if-else或switch分支判断。不过，它的作用还不止如此。它也可以像模板模式那样，提供框架的扩展点等等。</p><p>对于策略模式，我们分两节课来讲解。今天，我们讲解策略模式的原理和实现，以及如何用它来避免分支判断逻辑。下一节课，我会通过一个具体的例子，来详细讲解策略模式的应用场景以及真正的设计意图。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="策略模式的原理与实现" tabindex="-1">策略模式的原理与实现 <a class="header-anchor" href="#策略模式的原理与实现" aria-label="Permalink to &quot;策略模式的原理与实现&quot;">​</a></h2><p>策略模式，英文全称是Strategy Design Pattern。在GoF的《设计模式》一书中，它是这样定义的：</p><blockquote><p>Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.</p></blockquote><p>翻译成中文就是：定义一族算法类，将每个算法分别封装起来，让它们可以互相替换。策略模式可以使算法的变化独立于使用它们的客户端（这里的客户端代指使用算法的代码）。</p><p>我们知道，工厂模式是解耦对象的创建和使用，观察者模式是解耦观察者和被观察者。策略模式跟两者类似，也能起到解耦的作用，不过，它解耦的是策略的定义、创建、使用这三部分。接下来，我就详细讲讲一个完整的策略模式应该包含的这三个部分。</p><h3 id="_1-策略的定义" tabindex="-1">1.策略的定义 <a class="header-anchor" href="#_1-策略的定义" aria-label="Permalink to &quot;1.策略的定义&quot;">​</a></h3><p>策略类的定义比较简单，包含一个策略接口和一组实现这个接口的策略类。因为所有的策略类都实现相同的接口，所以，客户端代码基于接口而非实现编程，可以灵活地替换不同的策略。示例代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Strategy {</span></span>
<span class="line"><span>  void algorithmInterface();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ConcreteStrategyA implements Strategy {</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void  algorithmInterface() {</span></span>
<span class="line"><span>    //具体的算法...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ConcreteStrategyB implements Strategy {</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void  algorithmInterface() {</span></span>
<span class="line"><span>    //具体的算法...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-策略的创建" tabindex="-1">2.策略的创建 <a class="header-anchor" href="#_2-策略的创建" aria-label="Permalink to &quot;2.策略的创建&quot;">​</a></h3><p>因为策略模式会包含一组策略，在使用它们的时候，一般会通过类型（type）来判断创建哪个策略来使用。为了封装创建逻辑，我们需要对客户端代码屏蔽创建细节。我们可以把根据type创建策略的逻辑抽离出来，放到工厂类中。示例代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class StrategyFactory {</span></span>
<span class="line"><span>  private static final Map&amp;lt;String, Strategy&amp;gt; strategies = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    strategies.put(&quot;A&quot;, new ConcreteStrategyA());</span></span>
<span class="line"><span>    strategies.put(&quot;B&quot;, new ConcreteStrategyB());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static Strategy getStrategy(String type) {</span></span>
<span class="line"><span>    if (type == null || type.isEmpty()) {</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;type should not be empty.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return strategies.get(type);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>一般来讲，如果策略类是无状态的，不包含成员变量，只是纯粹的算法实现，这样的策略对象是可以被共享使用的，不需要在每次调用getStrategy()的时候，都创建一个新的策略对象。针对这种情况，我们可以使用上面这种工厂类的实现方式，事先创建好每个策略对象，缓存到工厂类中，用的时候直接返回。</p><p>相反，如果策略类是有状态的，根据业务场景的需要，我们希望每次从工厂方法中，获得的都是新创建的策略对象，而不是缓存好可共享的策略对象，那我们就需要按照如下方式来实现策略工厂类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class StrategyFactory {</span></span>
<span class="line"><span>  public static Strategy getStrategy(String type) {</span></span>
<span class="line"><span>    if (type == null || type.isEmpty()) {</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;type should not be empty.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (type.equals(&quot;A&quot;)) {</span></span>
<span class="line"><span>      return new ConcreteStrategyA();</span></span>
<span class="line"><span>    } else if (type.equals(&quot;B&quot;)) {</span></span>
<span class="line"><span>      return new ConcreteStrategyB();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_3-策略的使用" tabindex="-1">3.策略的使用 <a class="header-anchor" href="#_3-策略的使用" aria-label="Permalink to &quot;3.策略的使用&quot;">​</a></h3><p>刚刚讲了策略的定义和创建，现在，我们再来看一下，策略的使用。</p><p>我们知道，策略模式包含一组可选策略，客户端代码一般如何确定使用哪个策略呢？最常见的是运行时动态确定使用哪种策略，这也是策略模式最典型的应用场景。</p><p>这里的“运行时动态”指的是，我们事先并不知道会使用哪个策略，而是在程序运行期间，根据配置、用户输入、计算结果等这些不确定因素，动态决定使用哪种策略。接下来，我们通过一个例子来解释一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 策略接口：EvictionStrategy</span></span>
<span class="line"><span>// 策略类：LruEvictionStrategy、FifoEvictionStrategy、LfuEvictionStrategy...</span></span>
<span class="line"><span>// 策略工厂：EvictionStrategyFactory</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserCache {</span></span>
<span class="line"><span>  private Map&amp;lt;String, User&amp;gt; cacheData = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  private EvictionStrategy eviction;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserCache(EvictionStrategy eviction) {</span></span>
<span class="line"><span>    this.eviction = eviction;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 运行时动态确定，根据配置文件的配置决定使用哪种策略</span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    EvictionStrategy evictionStrategy = null;</span></span>
<span class="line"><span>    Properties props = new Properties();</span></span>
<span class="line"><span>    props.load(new FileInputStream(&quot;./config.properties&quot;));</span></span>
<span class="line"><span>    String type = props.getProperty(&quot;eviction_type&quot;);</span></span>
<span class="line"><span>    evictionStrategy = EvictionStrategyFactory.getEvictionStrategy(type);</span></span>
<span class="line"><span>    UserCache userCache = new UserCache(evictionStrategy);</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 非运行时动态确定，在代码中指定使用哪种策略</span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>    EvictionStrategy evictionStrategy = new LruEvictionStrategy();</span></span>
<span class="line"><span>    UserCache userCache = new UserCache(evictionStrategy);</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面的代码中，我们也可以看出，“非运行时动态确定”，也就是第二个Application中的使用方式，并不能发挥策略模式的优势。在这种应用场景下，策略模式实际上退化成了“面向对象的多态特性”或“基于接口而非实现编程原则”。</p><h2 id="如何利用策略模式避免分支判断" tabindex="-1">如何利用策略模式避免分支判断？ <a class="header-anchor" href="#如何利用策略模式避免分支判断" aria-label="Permalink to &quot;如何利用策略模式避免分支判断？&quot;">​</a></h2><p>实际上，能够移除分支判断逻辑的模式不仅仅有策略模式，后面我们要讲的状态模式也可以。对于使用哪种模式，具体还要看应用场景来定。 策略模式适用于根据不同类型的动态，决定使用哪种策略这样一种应用场景。</p><p>我们先通过一个例子来看下，if-else或switch-case分支判断逻辑是如何产生的。具体的代码如下所示。在这个例子中，我们没有使用策略模式，而是将策略的定义、创建、使用直接耦合在一起。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class OrderService {</span></span>
<span class="line"><span>  public double discount(Order order) {</span></span>
<span class="line"><span>    double discount = 0.0;</span></span>
<span class="line"><span>    OrderType type = order.getType();</span></span>
<span class="line"><span>    if (type.equals(OrderType.NORMAL)) { // 普通订单</span></span>
<span class="line"><span>      //...省略折扣计算算法代码</span></span>
<span class="line"><span>    } else if (type.equals(OrderType.GROUPON)) { // 团购订单</span></span>
<span class="line"><span>      //...省略折扣计算算法代码</span></span>
<span class="line"><span>    } else if (type.equals(OrderType.PROMOTION)) { // 促销订单</span></span>
<span class="line"><span>      //...省略折扣计算算法代码</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return discount;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如何来移除掉分支判断逻辑呢？那策略模式就派上用场了。我们使用策略模式对上面的代码重构，将不同类型订单的打折策略设计成策略类，并由工厂类来负责创建策略对象。具体的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 策略的定义</span></span>
<span class="line"><span>public interface DiscountStrategy {</span></span>
<span class="line"><span>  double calDiscount(Order order);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 省略NormalDiscountStrategy、GrouponDiscountStrategy、PromotionDiscountStrategy类代码...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 策略的创建</span></span>
<span class="line"><span>public class DiscountStrategyFactory {</span></span>
<span class="line"><span>  private static final Map&amp;lt;OrderType, DiscountStrategy&amp;gt; strategies = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    strategies.put(OrderType.NORMAL, new NormalDiscountStrategy());</span></span>
<span class="line"><span>    strategies.put(OrderType.GROUPON, new GrouponDiscountStrategy());</span></span>
<span class="line"><span>    strategies.put(OrderType.PROMOTION, new PromotionDiscountStrategy());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static DiscountStrategy getDiscountStrategy(OrderType type) {</span></span>
<span class="line"><span>    return strategies.get(type);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 策略的使用</span></span>
<span class="line"><span>public class OrderService {</span></span>
<span class="line"><span>  public double discount(Order order) {</span></span>
<span class="line"><span>    OrderType type = order.getType();</span></span>
<span class="line"><span>    DiscountStrategy discountStrategy = DiscountStrategyFactory.getDiscountStrategy(type);</span></span>
<span class="line"><span>    return discountStrategy.calDiscount(order);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重构之后的代码就没有了if-else分支判断语句了。实际上，这得益于策略工厂类。在工厂类中，我们用Map来缓存策略，根据type直接从Map中获取对应的策略，从而避免if-else分支判断逻辑。等后面讲到使用状态模式来避免分支判断逻辑的时候，你会发现，它们使用的是同样的套路。本质上都是借助“查表法”，根据type查表（代码中的strategies就是表）替代根据type分支判断。</p><p>但是，如果业务场景需要每次都创建不同的策略对象，我们就要用另外一种工厂类的实现方式了。具体的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DiscountStrategyFactory {</span></span>
<span class="line"><span>  public static DiscountStrategy getDiscountStrategy(OrderType type) {</span></span>
<span class="line"><span>    if (type == null) {</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;Type should not be null.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (type.equals(OrderType.NORMAL)) {</span></span>
<span class="line"><span>      return new NormalDiscountStrategy();</span></span>
<span class="line"><span>    } else if (type.equals(OrderType.GROUPON)) {</span></span>
<span class="line"><span>      return new GrouponDiscountStrategy();</span></span>
<span class="line"><span>    } else if (type.equals(OrderType.PROMOTION)) {</span></span>
<span class="line"><span>      return new PromotionDiscountStrategy();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这种实现方式相当于把原来的if-else分支逻辑，从OrderService类中转移到了工厂类中，实际上并没有真正将它移除。关于这个问题如何解决，我今天先暂时卖个关子。你可以在留言区说说你的想法，我在下一节课中再讲解。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>策略模式定义一族算法类，将每个算法分别封装起来，让它们可以互相替换。策略模式可以使算法的变化独立于使用它们的客户端（这里的客户端代指使用算法的代码）。</p><p>策略模式用来解耦策略的定义、创建、使用。实际上，一个完整的策略模式就是由这三个部分组成的。</p><ul><li>策略类的定义比较简单，包含一个策略接口和一组实现这个接口的策略类。</li><li>策略的创建由工厂类来完成，封装策略创建的细节。</li><li>策略模式包含一组策略可选，客户端代码如何选择使用哪个策略，有两种确定方法：编译时静态确定和运行时动态确定。其中，“运行时动态确定”才是策略模式最典型的应用场景。</li></ul><p>除此之外，我们还可以通过策略模式来移除if-else分支判断。实际上，这得益于策略工厂类，更本质上点讲，是借助“查表法”，根据type查表替代根据type分支判断。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>今天我们讲到，在策略工厂类中，如果每次都要返回新的策略对象，我们还是需要在工厂类中编写if-else分支判断逻辑，那这个问题该如何解决呢？</p><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,44)])])}const h=n(l,[["render",t]]);export{d as __pageData,h as default};
