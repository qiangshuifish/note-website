import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"21 |  代码重复：搞定代码重复的三个绝招","description":"","frontmatter":{},"headers":[{"level":2,"title":"利用工厂模式+模板方法模式，消除if…else和重复代码","slug":"利用工厂模式-模板方法模式-消除if-else和重复代码","link":"#利用工厂模式-模板方法模式-消除if-else和重复代码","children":[]},{"level":2,"title":"利用注解+反射消除重复代码","slug":"利用注解-反射消除重复代码","link":"#利用注解-反射消除重复代码","children":[]},{"level":2,"title":"利用属性拷贝工具消除重复代码","slug":"利用属性拷贝工具消除重复代码","link":"#利用属性拷贝工具消除重复代码","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/21-代码重复：搞定代码重复的三个绝招.md","filePath":"Java业务开发常见错误100例/21-代码重复：搞定代码重复的三个绝招.md","lastUpdated":1779815815000}'),l={name:"Java业务开发常见错误100例/21-代码重复：搞定代码重复的三个绝招.md"};function t(i,s,r,c,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_21-代码重复-搞定代码重复的三个绝招" tabindex="-1">21 | 代码重复：搞定代码重复的三个绝招 <a class="header-anchor" href="#_21-代码重复-搞定代码重复的三个绝招" aria-label="Permalink to &quot;21 |  代码重复：搞定代码重复的三个绝招&quot;">​</a></h1><p>你好，我是朱晔。今天，我来和你聊聊搞定代码重复的三个绝招。</p><p>业务同学抱怨业务开发没有技术含量，用不到设计模式、Java高级特性、OOP，平时写代码都在堆CRUD，个人成长无从谈起。每次面试官问到“请说说平时常用的设计模式”，都只能答单例模式，因为其他设计模式的确是听过但没用过；对于反射、注解之类的高级特性，也只是知道它们在写框架的时候非常常用，但自己又不写框架代码，没有用武之地。</p><p>其实，我认为不是这样的。设计模式、OOP是前辈们在大型项目中积累下来的经验，通过这些方法论来改善大型项目的可维护性。反射、注解、泛型等高级特性在框架中大量使用的原因是，框架往往需要以同一套算法来应对不同的数据结构，而这些特性可以帮助减少重复代码，提升项目可维护性。</p><p>在我看来，可维护性是大型项目成熟度的一个重要指标，而提升可维护性非常重要的一个手段就是减少代码重复。那为什么这样说呢？</p><ul><li>如果多处重复代码实现完全相同的功能，很容易修改一处忘记修改另一处，造成Bug；</li><li>有一些代码并不是完全重复，而是相似度很高，修改这些类似的代码容易改（复制粘贴）错，把原本有区别的地方改为了一样。</li></ul><p>今天，我就从业务代码中最常见的三个需求展开，和你聊聊如何使用Java中的一些高级特性、设计模式，以及一些工具消除重复代码，才能既优雅又高端。通过今天的学习，也希望改变你对业务代码没有技术含量的看法。</p><h2 id="利用工厂模式-模板方法模式-消除if-else和重复代码" tabindex="-1">利用工厂模式+模板方法模式，消除if…else和重复代码 <a class="header-anchor" href="#利用工厂模式-模板方法模式-消除if-else和重复代码" aria-label="Permalink to &quot;利用工厂模式+模板方法模式，消除if…else和重复代码&quot;">​</a></h2><p>假设要开发一个购物车下单的功能，针对不同用户进行不同处理：</p><ul><li>普通用户需要收取运费，运费是商品价格的10%，无商品折扣；</li><li>VIP用户同样需要收取商品价格10%的快递费，但购买两件以上相同商品时，第三件开始享受一定折扣；</li><li>内部用户可以免运费，无商品折扣。</li></ul><p>我们的目标是实现三种类型的购物车业务逻辑，把入参Map对象（Key是商品ID，Value是商品数量），转换为出参购物车类型Cart。</p><p>先实现针对普通用户的购物车处理逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//购物车</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class Cart {</span></span>
<span class="line"><span>    //商品清单</span></span>
<span class="line"><span>    private List&amp;lt;Item&amp;gt; items = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    //总优惠</span></span>
<span class="line"><span>    private BigDecimal totalDiscount;</span></span>
<span class="line"><span>    //商品总价</span></span>
<span class="line"><span>    private BigDecimal totalItemPrice;</span></span>
<span class="line"><span>    //总运费</span></span>
<span class="line"><span>    private BigDecimal totalDeliveryPrice;</span></span>
<span class="line"><span>    //应付总价</span></span>
<span class="line"><span>    private BigDecimal payPrice;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//购物车中的商品</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class Item {</span></span>
<span class="line"><span>    //商品ID</span></span>
<span class="line"><span>    private long id;</span></span>
<span class="line"><span>    //商品数量</span></span>
<span class="line"><span>    private int quantity;</span></span>
<span class="line"><span>    //商品单价</span></span>
<span class="line"><span>    private BigDecimal price;</span></span>
<span class="line"><span>    //商品优惠</span></span>
<span class="line"><span>    private BigDecimal couponPrice;</span></span>
<span class="line"><span>    //商品运费</span></span>
<span class="line"><span>    private BigDecimal deliveryPrice;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//普通用户购物车处理</span></span>
<span class="line"><span>public class NormalUserCart {</span></span>
<span class="line"><span>    public Cart process(long userId, Map&amp;lt;Long, Integer&amp;gt; items) {</span></span>
<span class="line"><span>        Cart cart = new Cart();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //把Map的购物车转换为Item列表</span></span>
<span class="line"><span>        List&amp;lt;Item&amp;gt; itemList = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        items.entrySet().stream().forEach(entry -&amp;gt; {</span></span>
<span class="line"><span>            Item item = new Item();</span></span>
<span class="line"><span>            item.setId(entry.getKey());</span></span>
<span class="line"><span>            item.setPrice(Db.getItemPrice(entry.getKey()));</span></span>
<span class="line"><span>            item.setQuantity(entry.getValue());</span></span>
<span class="line"><span>            itemList.add(item);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        cart.setItems(itemList);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //处理运费和商品优惠</span></span>
<span class="line"><span>        itemList.stream().forEach(item -&amp;gt; {</span></span>
<span class="line"><span>            //运费为商品总价的10%</span></span>
<span class="line"><span>            item.setDeliveryPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())).multiply(new BigDecimal(&quot;0.1&quot;)));</span></span>
<span class="line"><span>            //无优惠</span></span>
<span class="line"><span>            item.setCouponPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //计算商品总价</span></span>
<span class="line"><span>        cart.setTotalItemPrice(cart.getItems().stream().map(item -&amp;gt; item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add));</span></span>
<span class="line"><span>        //计算运费总价</span></span>
<span class="line"><span>        cart.setTotalDeliveryPrice(cart.getItems().stream().map(Item::getDeliveryPrice).reduce(BigDecimal.ZERO, BigDecimal::add));</span></span>
<span class="line"><span>        //计算总优惠</span></span>
<span class="line"><span>        cart.setTotalDiscount(cart.getItems().stream().map(Item::getCouponPrice).reduce(BigDecimal.ZERO, BigDecimal::add));</span></span>
<span class="line"><span>        //应付总价=商品总价+运费总价-总优惠</span></span>
<span class="line"><span>        cart.setPayPrice(cart.getTotalItemPrice().add(cart.getTotalDeliveryPrice()).subtract(cart.getTotalDiscount()));</span></span>
<span class="line"><span>        return cart;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后实现针对VIP用户的购物车逻辑。与普通用户购物车逻辑的不同在于，VIP用户能享受同类商品多买的折扣。所以，这部分代码只需要额外处理多买折扣部分：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class VipUserCart {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Cart process(long userId, Map&amp;lt;Long, Integer&amp;gt; items) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        itemList.stream().forEach(item -&amp;gt; {</span></span>
<span class="line"><span>            //运费为商品总价的10%</span></span>
<span class="line"><span>            item.setDeliveryPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())).multiply(new BigDecimal(&quot;0.1&quot;)));</span></span>
<span class="line"><span>            //购买两件以上相同商品，第三件开始享受一定折扣</span></span>
<span class="line"><span>            if (item.getQuantity() &amp;gt; 2) {</span></span>
<span class="line"><span>                item.setCouponPrice(item.getPrice()</span></span>
<span class="line"><span>                        .multiply(BigDecimal.valueOf(100 - Db.getUserCouponPercent(userId)).divide(new BigDecimal(&quot;100&quot;)))</span></span>
<span class="line"><span>                       .multiply(BigDecimal.valueOf(item.getQuantity() - 2)));</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                item.setCouponPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        return cart;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后是免运费、无折扣的内部用户，同样只是处理商品折扣和运费时的逻辑差异：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class InternalUserCart {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Cart process(long userId, Map&amp;lt;Long, Integer&amp;gt; items) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        itemList.stream().forEach(item -&amp;gt; {</span></span>
<span class="line"><span>            //免运费</span></span>
<span class="line"><span>            item.setDeliveryPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>            //无优惠</span></span>
<span class="line"><span>            item.setCouponPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        return cart;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对比一下代码量可以发现，三种购物车70%的代码是重复的。原因很简单，虽然不同类型用户计算运费和优惠的方式不同，但整个购物车的初始化、统计总价、总运费、总优惠和支付价格的逻辑都是一样的。</p><p>正如我们开始时提到的，代码重复本身不可怕，可怕的是漏改或改错。比如，写VIP用户购物车的同学发现商品总价计算有Bug，不应该是把所有Item的price加在一起，而是应该把所有Item的price*quantity加在一起。这时，他可能会只修改VIP用户购物车的代码，而忽略了普通用户、内部用户的购物车中，重复的逻辑实现也有相同的Bug。</p><p>有了三个购物车后，我们就需要根据不同的用户类型使用不同的购物车了。如下代码所示，使用三个if实现不同类型用户调用不同购物车的process方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;wrong&quot;)</span></span>
<span class="line"><span>public Cart wrong(&amp;#64;RequestParam(&quot;userId&quot;) int userId) {</span></span>
<span class="line"><span>    //根据用户ID获得用户类型</span></span>
<span class="line"><span>    String userCategory = Db.getUserCategory(userId);</span></span>
<span class="line"><span>    //普通用户处理逻辑</span></span>
<span class="line"><span>    if (userCategory.equals(&quot;Normal&quot;)) {</span></span>
<span class="line"><span>        NormalUserCart normalUserCart = new NormalUserCart();</span></span>
<span class="line"><span>        return normalUserCart.process(userId, items);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //VIP用户处理逻辑</span></span>
<span class="line"><span>    if (userCategory.equals(&quot;Vip&quot;)) {</span></span>
<span class="line"><span>        VipUserCart vipUserCart = new VipUserCart();</span></span>
<span class="line"><span>        return vipUserCart.process(userId, items);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //内部用户处理逻辑</span></span>
<span class="line"><span>    if (userCategory.equals(&quot;Internal&quot;)) {</span></span>
<span class="line"><span>        InternalUserCart internalUserCart = new InternalUserCart();</span></span>
<span class="line"><span>        return internalUserCart.process(userId, items);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>电商的营销玩法是多样的，以后势必还会有更多用户类型，需要更多的购物车。我们就只能不断增加更多的购物车类，一遍一遍地写重复的购物车逻辑、写更多的if逻辑吗？</p><p>当然不是，相同的代码应该只在一处出现！</p><p>如果我们熟记抽象类和抽象方法的定义的话，这时或许就会想到，是否可以把重复的逻辑定义在抽象类中，三个购物车只要分别实现不同的那份逻辑呢？</p><p>其实，这个模式就是 <strong>模板方法模式</strong>。我们在父类中实现了购物车处理的流程模板，然后把需要特殊处理的地方留空白也就是留抽象方法定义，让子类去实现其中的逻辑。由于父类的逻辑不完整无法单独工作，因此需要定义为抽象类。</p><p>如下代码所示，AbstractCart抽象类实现了购物车通用的逻辑，额外定义了两个抽象方法让子类去实现。其中，processCouponPrice方法用于计算商品折扣，processDeliveryPrice方法用于计算运费。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractCart {</span></span>
<span class="line"><span>    //处理购物车的大量重复逻辑在父类实现</span></span>
<span class="line"><span>    public Cart process(long userId, Map&amp;lt;Long, Integer&amp;gt; items) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Cart cart = new Cart();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        List&amp;lt;Item&amp;gt; itemList = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        items.entrySet().stream().forEach(entry -&amp;gt; {</span></span>
<span class="line"><span>            Item item = new Item();</span></span>
<span class="line"><span>            item.setId(entry.getKey());</span></span>
<span class="line"><span>            item.setPrice(Db.getItemPrice(entry.getKey()));</span></span>
<span class="line"><span>            item.setQuantity(entry.getValue());</span></span>
<span class="line"><span>            itemList.add(item);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        cart.setItems(itemList);</span></span>
<span class="line"><span>        //让子类处理每一个商品的优惠</span></span>
<span class="line"><span>        itemList.stream().forEach(item -&amp;gt; {</span></span>
<span class="line"><span>            processCouponPrice(userId, item);</span></span>
<span class="line"><span>            processDeliveryPrice(userId, item);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        //计算商品总价</span></span>
<span class="line"><span>        cart.setTotalItemPrice(cart.getItems().stream().map(item -&amp;gt; item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add));</span></span>
<span class="line"><span>        //计算总运费</span></span>
<span class="line"><span>cart.setTotalDeliveryPrice(cart.getItems().stream().map(Item::getDeliveryPrice).reduce(BigDecimal.ZERO, BigDecimal::add));</span></span>
<span class="line"><span>        //计算总折扣</span></span>
<span class="line"><span>cart.setTotalDiscount(cart.getItems().stream().map(Item::getCouponPrice).reduce(BigDecimal.ZERO, BigDecimal::add));</span></span>
<span class="line"><span>        //计算应付价格</span></span>
<span class="line"><span>cart.setPayPrice(cart.getTotalItemPrice().add(cart.getTotalDeliveryPrice()).subtract(cart.getTotalDiscount()));</span></span>
<span class="line"><span>        return cart;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //处理商品优惠的逻辑留给子类实现</span></span>
<span class="line"><span>    protected abstract void processCouponPrice(long userId, Item item);</span></span>
<span class="line"><span>    //处理配送费的逻辑留给子类实现</span></span>
<span class="line"><span>    protected abstract void processDeliveryPrice(long userId, Item item);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了这个抽象类，三个子类的实现就非常简单了。普通用户的购物车NormalUserCart，实现的是0优惠和10%运费的逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service(value = &quot;NormalUserCart&quot;)</span></span>
<span class="line"><span>public class NormalUserCart extends AbstractCart {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void processCouponPrice(long userId, Item item) {</span></span>
<span class="line"><span>        item.setCouponPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void processDeliveryPrice(long userId, Item item) {</span></span>
<span class="line"><span>        item.setDeliveryPrice(item.getPrice()</span></span>
<span class="line"><span>                .multiply(BigDecimal.valueOf(item.getQuantity()))</span></span>
<span class="line"><span>                .multiply(new BigDecimal(&quot;0.1&quot;)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>VIP用户的购物车VipUserCart，直接继承了NormalUserCart，只需要修改多买优惠策略：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service(value = &quot;VipUserCart&quot;)</span></span>
<span class="line"><span>public class VipUserCart extends NormalUserCart {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void processCouponPrice(long userId, Item item) {</span></span>
<span class="line"><span>        if (item.getQuantity() &amp;gt; 2) {</span></span>
<span class="line"><span>            item.setCouponPrice(item.getPrice()</span></span>
<span class="line"><span>                    .multiply(BigDecimal.valueOf(100 - Db.getUserCouponPercent(userId)).divide(new BigDecimal(&quot;100&quot;)))</span></span>
<span class="line"><span>                    .multiply(BigDecimal.valueOf(item.getQuantity() - 2)));</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            item.setCouponPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>内部用户购物车InternalUserCart是最简单的，直接设置0运费和0折扣即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service(value = &quot;InternalUserCart&quot;)</span></span>
<span class="line"><span>public class InternalUserCart extends AbstractCart {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void processCouponPrice(long userId, Item item) {</span></span>
<span class="line"><span>        item.setCouponPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void processDeliveryPrice(long userId, Item item) {</span></span>
<span class="line"><span>        item.setDeliveryPrice(BigDecimal.ZERO);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>抽象类和三个子类的实现关系图，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228964/55ec188c32805608e0f2341655c87f03.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228964/55ec188c32805608e0f2341655c87f03.png" alt=""></a></p><p>是不是比三个独立的购物车程序简单了很多呢？接下来，我们再看看如何能避免三个if逻辑。</p><p>或许你已经注意到了，定义三个购物车子类时，我们在@Service注解中对Bean进行了命名。既然三个购物车都叫XXXUserCart，那我们就可以把用户类型字符串拼接UserCart构成购物车Bean的名称，然后利用Spring的IoC容器，通过Bean的名称直接获取到AbstractCart，调用其process方法即可实现通用。</p><p>其实，这就是 <strong>工厂模式</strong>，只不过是借助Spring容器实现罢了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;right&quot;)</span></span>
<span class="line"><span>public Cart right(&amp;#64;RequestParam(&quot;userId&quot;) int userId) {</span></span>
<span class="line"><span>    String userCategory = Db.getUserCategory(userId);</span></span>
<span class="line"><span>    AbstractCart cart = (AbstractCart) applicationContext.getBean(userCategory + &quot;UserCart&quot;);</span></span>
<span class="line"><span>    return cart.process(userId, items);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>试想， 之后如果有了新的用户类型、新的用户逻辑，是不是完全不用对代码做任何修改，只要新增一个XXXUserCart类继承AbstractCart，实现特殊的优惠和运费处理逻辑就可以了？</p><p><strong>这样一来，我们就利用工厂模式+模板方法模式，不仅消除了重复代码，还避免了修改既有代码的风险</strong>。这就是设计模式中的开闭原则：对修改关闭，对扩展开放。</p><h2 id="利用注解-反射消除重复代码" tabindex="-1">利用注解+反射消除重复代码 <a class="header-anchor" href="#利用注解-反射消除重复代码" aria-label="Permalink to &quot;利用注解+反射消除重复代码&quot;">​</a></h2><p>是不是有点兴奋了，业务代码居然也能OOP了。我们再看一个三方接口的调用案例，同样也是一个普通的业务逻辑。</p><p>假设银行提供了一些API接口，对参数的序列化有点特殊，不使用JSON，而是需要我们把参数依次拼在一起构成一个大字符串。</p><ul><li>按照银行提供的API文档的顺序，把所有参数构成定长的数据，然后拼接在一起作为整个字符串。</li><li>因为每一种参数都有固定长度，未达到长度时需要做填充处理： <ul><li>字符串类型的参数不满长度部分需要以下划线右填充，也就是字符串内容靠左；</li><li>数字类型的参数不满长度部分以0左填充，也就是实际数字靠右；</li><li>货币类型的表示需要把金额向下舍入2位到分，以分为单位，作为数字类型同样进行左填充。</li></ul></li><li>对所有参数做MD5操作作为签名（为了方便理解，Demo中不涉及加盐处理）。</li></ul><p>比如，创建用户方法和支付方法的定义是这样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228964/5429e0313c1254c56abf6bc6ff4fc8a6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228964/5429e0313c1254c56abf6bc6ff4fc8a6.jpg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228964/88ceb410987e16f00b5ab5324c0f4c07.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/228964/88ceb410987e16f00b5ab5324c0f4c07.jpg" alt=""></a></p><p>代码很容易实现，直接根据接口定义实现填充操作、加签名、请求调用操作即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class BankService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建用户方法</span></span>
<span class="line"><span>    public static String createUser(String name, String identity, String mobile, int age) throws IOException {</span></span>
<span class="line"><span>        StringBuilder stringBuilder = new StringBuilder();</span></span>
<span class="line"><span>        //字符串靠左，多余的地方填充_</span></span>
<span class="line"><span>        stringBuilder.append(String.format(&quot;%-10s&quot;, name).replace(&#39; &#39;, &#39;_&#39;));</span></span>
<span class="line"><span>        //字符串靠左，多余的地方填充_</span></span>
<span class="line"><span>        stringBuilder.append(String.format(&quot;%-18s&quot;, identity).replace(&#39; &#39;, &#39;_&#39;));</span></span>
<span class="line"><span>        //数字靠右，多余的地方用0填充</span></span>
<span class="line"><span>        stringBuilder.append(String.format(&quot;%05d&quot;, age));</span></span>
<span class="line"><span>        //字符串靠左，多余的地方用_填充</span></span>
<span class="line"><span>        stringBuilder.append(String.format(&quot;%-11s&quot;, mobile).replace(&#39; &#39;, &#39;_&#39;));</span></span>
<span class="line"><span>        //最后加上MD5作为签名</span></span>
<span class="line"><span>        stringBuilder.append(DigestUtils.md2Hex(stringBuilder.toString()));</span></span>
<span class="line"><span>        return Request.Post(&quot;http://localhost:45678/reflection/bank/createUser&quot;)</span></span>
<span class="line"><span>                .bodyString(stringBuilder.toString(), ContentType.APPLICATION_JSON)</span></span>
<span class="line"><span>                .execute().returnContent().asString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //支付方法</span></span>
<span class="line"><span>    public static String pay(long userId, BigDecimal amount) throws IOException {</span></span>
<span class="line"><span>        StringBuilder stringBuilder = new StringBuilder();</span></span>
<span class="line"><span>        //数字靠右，多余的地方用0填充</span></span>
<span class="line"><span>        stringBuilder.append(String.format(&quot;%020d&quot;, userId));</span></span>
<span class="line"><span>        //金额向下舍入2位到分，以分为单位，作为数字靠右，多余的地方用0填充</span></span>
<span class="line"><span>        stringBuilder.append(String.format(&quot;%010d&quot;, amount.setScale(2, RoundingMode.DOWN).multiply(new BigDecimal(&quot;100&quot;)).longValue()));</span></span>
<span class="line"><span>        //最后加上MD5作为签名</span></span>
<span class="line"><span>        stringBuilder.append(DigestUtils.md2Hex(stringBuilder.toString()));</span></span>
<span class="line"><span>        return Request.Post(&quot;http://localhost:45678/reflection/bank/pay&quot;)</span></span>
<span class="line"><span>                .bodyString(stringBuilder.toString(), ContentType.APPLICATION_JSON)</span></span>
<span class="line"><span>                .execute().returnContent().asString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，这段代码的重复粒度更细：</p><ul><li>三种标准数据类型的处理逻辑有重复，稍有不慎就会出现Bug；</li><li>处理流程中字符串拼接、加签和发请求的逻辑，在所有方法重复；</li><li>实际方法的入参的参数类型和顺序，不一定和接口要求一致，容易出错；</li><li>代码层面针对每一个参数硬编码，无法清晰地进行核对，如果参数达到几十个、上百个，出错的概率极大。</li></ul><p>那应该如何改造这段代码呢？没错，就是要用注解和反射！</p><p>使用注解和反射这两个武器，就可以针对银行请求的所有逻辑均使用一套代码实现，不会出现任何重复。</p><p>要实现接口逻辑和逻辑实现的剥离，首先需要以POJO类（只有属性没有任何业务逻辑的数据类）的方式定义所有的接口参数。比如，下面这个创建用户API的参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class CreateUserAPI {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private String identity;</span></span>
<span class="line"><span>    private String mobile;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了接口参数定义，我们就能通过自定义注解为接口和所有参数增加一些元数据。如下所示，我们定义一个接口API的注解BankAPI，包含接口URL地址和接口说明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Target(ElementType.TYPE)</span></span>
<span class="line"><span>&amp;#64;Documented</span></span>
<span class="line"><span>&amp;#64;Inherited</span></span>
<span class="line"><span>public &amp;#64;interface BankAPI {</span></span>
<span class="line"><span>    String desc() default &quot;&quot;;</span></span>
<span class="line"><span>    String url() default &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们再定义一个自定义注解@BankAPIField，用于描述接口的每一个字段规范，包含参数的次序、类型和长度三个属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>&amp;#64;Target(ElementType.FIELD)</span></span>
<span class="line"><span>&amp;#64;Documented</span></span>
<span class="line"><span>&amp;#64;Inherited</span></span>
<span class="line"><span>public &amp;#64;interface BankAPIField {</span></span>
<span class="line"><span>    int order() default -1;</span></span>
<span class="line"><span>    int length() default -1;</span></span>
<span class="line"><span>    String type() default &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，注解就可以发挥威力了。</p><p>如下所示，我们定义了CreateUserAPI类描述创建用户接口的信息，通过为接口增加@BankAPI注解，来补充接口的URL和描述等元数据；通过为每一个字段增加@BankAPIField注解，来补充参数的顺序、类型和长度等元数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;BankAPI(url = &quot;/bank/createUser&quot;, desc = &quot;创建用户接口&quot;)</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class CreateUserAPI extends AbstractAPI {</span></span>
<span class="line"><span>    &amp;#64;BankAPIField(order = 1, type = &quot;S&quot;, length = 10)</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    &amp;#64;BankAPIField(order = 2, type = &quot;S&quot;, length = 18)</span></span>
<span class="line"><span>    private String identity;</span></span>
<span class="line"><span>    &amp;#64;BankAPIField(order = 4, type = &quot;S&quot;, length = 11) //注意这里的order需要按照API表格中的顺序</span></span>
<span class="line"><span>    private String mobile;</span></span>
<span class="line"><span>    &amp;#64;BankAPIField(order = 3, type = &quot;N&quot;, length = 5)</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另一个PayAPI类也是类似的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;BankAPI(url = &quot;/bank/pay&quot;, desc = &quot;支付接口&quot;)</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class PayAPI extends AbstractAPI {</span></span>
<span class="line"><span>    &amp;#64;BankAPIField(order = 1, type = &quot;N&quot;, length = 20)</span></span>
<span class="line"><span>    private long userId;</span></span>
<span class="line"><span>    &amp;#64;BankAPIField(order = 2, type = &quot;M&quot;, length = 10)</span></span>
<span class="line"><span>    private BigDecimal amount;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这2个类继承的AbstractAPI类是一个空实现，因为这个案例中的接口并没有公共数据可以抽象放到基类。</p><p>通过这2个类，我们可以在几秒钟内完成和API清单表格的核对。理论上，如果我们的核心翻译过程（也就是把注解和接口API序列化为请求需要的字符串的过程）没问题，只要注解和表格一致，API请求的翻译就不会有任何问题。</p><p>以上，我们通过注解实现了对API参数的描述。接下来，我们再看看反射如何配合注解实现动态的接口参数组装：</p><ul><li>第3行代码中，我们从类上获得了BankAPI注解，然后拿到其URL属性，后续进行远程调用。</li><li>第6~9行代码，使用stream快速实现了获取类中所有带BankAPIField注解的字段，并把字段按order属性排序，然后设置私有字段反射可访问。</li><li>第12~38行代码，实现了反射获取注解的值，然后根据BankAPIField拿到的参数类型，按照三种标准进行格式化，将所有参数的格式化逻辑集中在了这一处。</li><li>第41~48行代码，实现了参数加签和请求调用。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static String remoteCall(AbstractAPI api) throws IOException {</span></span>
<span class="line"><span>    //从BankAPI注解获取请求地址</span></span>
<span class="line"><span>    BankAPI bankAPI = api.getClass().getAnnotation(BankAPI.class);</span></span>
<span class="line"><span>    bankAPI.url();</span></span>
<span class="line"><span>    StringBuilder stringBuilder = new StringBuilder();</span></span>
<span class="line"><span>    Arrays.stream(api.getClass().getDeclaredFields()) //获得所有字段</span></span>
<span class="line"><span>            .filter(field -&amp;gt; field.isAnnotationPresent(BankAPIField.class)) //查找标记了注解的字段</span></span>
<span class="line"><span>            .sorted(Comparator.comparingInt(a -&amp;gt; a.getAnnotation(BankAPIField.class).order())) //根据注解中的order对字段排序</span></span>
<span class="line"><span>            .peek(field -&amp;gt; field.setAccessible(true)) //设置可以访问私有字段</span></span>
<span class="line"><span>            .forEach(field -&amp;gt; {</span></span>
<span class="line"><span>                //获得注解</span></span>
<span class="line"><span>                BankAPIField bankAPIField = field.getAnnotation(BankAPIField.class);</span></span>
<span class="line"><span>                Object value = &quot;&quot;;</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    //反射获取字段值</span></span>
<span class="line"><span>                    value = field.get(api);</span></span>
<span class="line"><span>                } catch (IllegalAccessException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                //根据字段类型以正确的填充方式格式化字符串</span></span>
<span class="line"><span>                switch (bankAPIField.type()) {</span></span>
<span class="line"><span>                    case &quot;S&quot;: {</span></span>
<span class="line"><span>                        stringBuilder.append(String.format(&quot;%-&quot; + bankAPIField.length() + &quot;s&quot;, value.toString()).replace(&#39; &#39;, &#39;_&#39;));</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    case &quot;N&quot;: {</span></span>
<span class="line"><span>                        stringBuilder.append(String.format(&quot;%&quot; + bankAPIField.length() + &quot;s&quot;, value.toString()).replace(&#39; &#39;, &#39;0&#39;));</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    case &quot;M&quot;: {</span></span>
<span class="line"><span>                        if (!(value instanceof BigDecimal))</span></span>
<span class="line"><span>                            throw new RuntimeException(String.format(&quot;{} 的 {} 必须是BigDecimal&quot;, api, field));</span></span>
<span class="line"><span>                        stringBuilder.append(String.format(&quot;%0&quot; + bankAPIField.length() + &quot;d&quot;, ((BigDecimal) value).setScale(2, RoundingMode.DOWN).multiply(new BigDecimal(&quot;100&quot;)).longValue()));</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    default:</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>    //签名逻辑</span></span>
<span class="line"><span>   stringBuilder.append(DigestUtils.md2Hex(stringBuilder.toString()));</span></span>
<span class="line"><span>    String param = stringBuilder.toString();</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    //发请求</span></span>
<span class="line"><span>    String result = Request.Post(&quot;http://localhost:45678/reflection&quot; + bankAPI.url())</span></span>
<span class="line"><span>            .bodyString(param, ContentType.APPLICATION_JSON)</span></span>
<span class="line"><span>            .execute().returnContent().asString();</span></span>
<span class="line"><span>    log.info(&quot;调用银行API {} url:{} 参数:{} 耗时:{}ms&quot;, bankAPI.desc(), bankAPI.url(), param, System.currentTimeMillis() - begin);</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到， <strong>所有处理参数排序、填充、加签、请求调用的核心逻辑，都汇聚在了remoteCall方法中</strong>。有了这个核心方法，BankService中每一个接口的实现就非常简单了，只是参数的组装，然后调用remoteCall即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//创建用户方法</span></span>
<span class="line"><span>public static String createUser(String name, String identity, String mobile, int age) throws IOException {</span></span>
<span class="line"><span>    CreateUserAPI createUserAPI = new CreateUserAPI();</span></span>
<span class="line"><span>    createUserAPI.setName(name);</span></span>
<span class="line"><span>    createUserAPI.setIdentity(identity);</span></span>
<span class="line"><span>    createUserAPI.setAge(age);</span></span>
<span class="line"><span>    createUserAPI.setMobile(mobile);</span></span>
<span class="line"><span>    return remoteCall(createUserAPI);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//支付方法</span></span>
<span class="line"><span>public static String pay(long userId, BigDecimal amount) throws IOException {</span></span>
<span class="line"><span>    PayAPI payAPI = new PayAPI();</span></span>
<span class="line"><span>    payAPI.setUserId(userId);</span></span>
<span class="line"><span>    payAPI.setAmount(amount);</span></span>
<span class="line"><span>    return remoteCall(payAPI);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实， <strong>许多涉及类结构性的通用处理，都可以按照这个模式来减少重复代码</strong>。反射给予了我们在不知晓类结构的时候，按照固定的逻辑处理类的成员；而注解给了我们为这些成员补充元数据的能力，使得我们利用反射实现通用逻辑的时候，可以从外部获得更多我们关心的数据。</p><h2 id="利用属性拷贝工具消除重复代码" tabindex="-1">利用属性拷贝工具消除重复代码 <a class="header-anchor" href="#利用属性拷贝工具消除重复代码" aria-label="Permalink to &quot;利用属性拷贝工具消除重复代码&quot;">​</a></h2><p>最后，我们再来看一种业务代码中经常出现的代码逻辑，实体之间的转换复制。</p><p>对于三层架构的系统，考虑到层之间的解耦隔离以及每一层对数据的不同需求，通常每一层都会有自己的POJO作为数据实体。比如，数据访问层的实体一般叫作DataObject或DO，业务逻辑层的实体一般叫作Domain，表现层的实体一般叫作Data Transfer Object或DTO。</p><p>这里我们需要注意的是，如果手动写这些实体之间的赋值代码，同样容易出错。</p><p>对于复杂的业务系统，实体有几十甚至几百个属性也很正常。就比如ComplicatedOrderDTO这个数据传输对象，描述的是一个订单中的几十个属性。如果我们要把这个DTO转换为一个类似的DO，复制其中大部分的字段，然后把数据入库，势必需要进行很多属性映射赋值操作。就像这样，密密麻麻的代码是不是已经让你头晕了？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ComplicatedOrderDTO orderDTO = new ComplicatedOrderDTO();</span></span>
<span class="line"><span>ComplicatedOrderDO orderDO = new ComplicatedOrderDO();</span></span>
<span class="line"><span>orderDO.setAcceptDate(orderDTO.getAcceptDate());</span></span>
<span class="line"><span>orderDO.setAddress(orderDTO.getAddress());</span></span>
<span class="line"><span>orderDO.setAddressId(orderDTO.getAddressId());</span></span>
<span class="line"><span>orderDO.setCancelable(orderDTO.isCancelable());</span></span>
<span class="line"><span>orderDO.setCommentable(orderDTO.isComplainable()); //属性错误</span></span>
<span class="line"><span>orderDO.setComplainable(orderDTO.isCommentable()); //属性错误</span></span>
<span class="line"><span>orderDO.setCancelable(orderDTO.isCancelable());</span></span>
<span class="line"><span>orderDO.setCouponAmount(orderDTO.getCouponAmount());</span></span>
<span class="line"><span>orderDO.setCouponId(orderDTO.getCouponId());</span></span>
<span class="line"><span>orderDO.setCreateDate(orderDTO.getCreateDate());</span></span>
<span class="line"><span>orderDO.setDirectCancelable(orderDTO.isDirectCancelable());</span></span>
<span class="line"><span>orderDO.setDeliverDate(orderDTO.getDeliverDate());</span></span>
<span class="line"><span>orderDO.setDeliverGroup(orderDTO.getDeliverGroup());</span></span>
<span class="line"><span>orderDO.setDeliverGroupOrderStatus(orderDTO.getDeliverGroupOrderStatus());</span></span>
<span class="line"><span>orderDO.setDeliverMethod(orderDTO.getDeliverMethod());</span></span>
<span class="line"><span>orderDO.setDeliverPrice(orderDTO.getDeliverPrice());</span></span>
<span class="line"><span>orderDO.setDeliveryManId(orderDTO.getDeliveryManId());</span></span>
<span class="line"><span>orderDO.setDeliveryManMobile(orderDO.getDeliveryManMobile()); //对象错误</span></span>
<span class="line"><span>orderDO.setDeliveryManName(orderDTO.getDeliveryManName());</span></span>
<span class="line"><span>orderDO.setDistance(orderDTO.getDistance());</span></span>
<span class="line"><span>orderDO.setExpectDate(orderDTO.getExpectDate());</span></span>
<span class="line"><span>orderDO.setFirstDeal(orderDTO.isFirstDeal());</span></span>
<span class="line"><span>orderDO.setHasPaid(orderDTO.isHasPaid());</span></span>
<span class="line"><span>orderDO.setHeadPic(orderDTO.getHeadPic());</span></span>
<span class="line"><span>orderDO.setLongitude(orderDTO.getLongitude());</span></span>
<span class="line"><span>orderDO.setLatitude(orderDTO.getLongitude()); //属性赋值错误</span></span>
<span class="line"><span>orderDO.setMerchantAddress(orderDTO.getMerchantAddress());</span></span>
<span class="line"><span>orderDO.setMerchantHeadPic(orderDTO.getMerchantHeadPic());</span></span>
<span class="line"><span>orderDO.setMerchantId(orderDTO.getMerchantId());</span></span>
<span class="line"><span>orderDO.setMerchantAddress(orderDTO.getMerchantAddress());</span></span>
<span class="line"><span>orderDO.setMerchantName(orderDTO.getMerchantName());</span></span>
<span class="line"><span>orderDO.setMerchantPhone(orderDTO.getMerchantPhone());</span></span>
<span class="line"><span>orderDO.setOrderNo(orderDTO.getOrderNo());</span></span>
<span class="line"><span>orderDO.setOutDate(orderDTO.getOutDate());</span></span>
<span class="line"><span>orderDO.setPayable(orderDTO.isPayable());</span></span>
<span class="line"><span>orderDO.setPaymentAmount(orderDTO.getPaymentAmount());</span></span>
<span class="line"><span>orderDO.setPaymentDate(orderDTO.getPaymentDate());</span></span>
<span class="line"><span>orderDO.setPaymentMethod(orderDTO.getPaymentMethod());</span></span>
<span class="line"><span>orderDO.setPaymentTimeLimit(orderDTO.getPaymentTimeLimit());</span></span>
<span class="line"><span>orderDO.setPhone(orderDTO.getPhone());</span></span>
<span class="line"><span>orderDO.setRefundable(orderDTO.isRefundable());</span></span>
<span class="line"><span>orderDO.setRemark(orderDTO.getRemark());</span></span>
<span class="line"><span>orderDO.setStatus(orderDTO.getStatus());</span></span>
<span class="line"><span>orderDO.setTotalQuantity(orderDTO.getTotalQuantity());</span></span>
<span class="line"><span>orderDO.setUpdateTime(orderDTO.getUpdateTime());</span></span>
<span class="line"><span>orderDO.setName(orderDTO.getName());</span></span>
<span class="line"><span>orderDO.setUid(orderDTO.getUid());</span></span></code></pre></div><p><strong>如果不是代码中有注释，你能看出其中的诸多问题吗</strong>？</p><ul><li>如果原始的DTO有100个字段，我们需要复制90个字段到DO中，保留10个不赋值，最后应该如何校验正确性呢？数数吗？即使数出有90行代码，也不一定正确，因为属性可能重复赋值。</li><li>有的时候字段命名相近，比如complainable和commentable，容易搞反（第7和第8行），或者对两个目标字段重复赋值相同的来源字段（比如第28行）</li><li>明明要把DTO的值赋值到DO中，却在set的时候从DO自己取值（比如第20行），导致赋值无效。</li></ul><p>这段代码并不是我随手写出来的，而是一个真实案例。有位同学就像代码中那样把经纬度赋值反了，因为落库的字段实在太多了。这个Bug很久都没发现，直到真正用到数据库中的经纬度做计算时，才发现一直以来都存错了。</p><p>修改方法很简单，可以使用类似BeanUtils这种Mapping工具来做Bean的转换，copyProperties方法还允许我们提供需要忽略的属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ComplicatedOrderDTO orderDTO = new ComplicatedOrderDTO();</span></span>
<span class="line"><span>ComplicatedOrderDO orderDO = new ComplicatedOrderDO();</span></span>
<span class="line"><span>BeanUtils.copyProperties(orderDTO, orderDO, &quot;id&quot;);</span></span>
<span class="line"><span>return orderDO;</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>正所谓“常在河边走哪有不湿鞋”，重复代码多了总有一天会出错。今天，我从几个最常见的维度，和你分享了几个实际业务场景中可能出现的重复问题，以及消除重复的方式。</p><p>第一种代码重复是，有多个并行的类实现相似的代码逻辑。我们可以考虑提取相同逻辑在父类中实现，差异逻辑通过抽象方法留给子类实现。使用类似的模板方法把相同的流程和逻辑固定成模板，保留差异的同时尽可能避免代码重复。同时，可以使用Spring的IoC特性注入相应的子类，来避免实例化子类时的大量if…else代码。</p><p>第二种代码重复是，使用硬编码的方式重复实现相同的数据处理算法。我们可以考虑把规则转换为自定义注解，作为元数据对类或对字段、方法进行描述，然后通过反射动态读取这些元数据、字段或调用方法，实现规则参数和规则定义的分离。也就是说，把变化的部分也就是规则的参数放入注解，规则的定义统一处理。</p><p>第三种代码重复是，业务代码中常见的DO、DTO、VO转换时大量字段的手动赋值，遇到有上百个属性的复杂类型，非常非常容易出错。我的建议是，不要手动进行赋值，考虑使用Bean映射工具进行。此外，还可以考虑采用单元测试对所有字段进行赋值正确性校验。</p><p>最后，我想说的是，我会把代码重复度作为评估一个项目质量的重要指标，如果一个项目几乎没有任何重复代码，那么它内部的抽象一定是非常好的。在做项目重构的时候，你也可以以消除重复为第一目标去考虑实现。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>除了模板方法设计模式是减少重复代码的一把好手，观察者模式也常用于减少代码重复（并且是松耦合方式）。Spring也提供了类似工具（点击 <a href="https://docs.spring.io/spring/docs/5.2.3.RELEASE/spring-framework-reference/core.html#context-functionality-events-annotation" target="_blank" rel="noreferrer">这里</a> 查看），你能想到有哪些应用场景吗？</li><li>关于Bean属性复制工具，除了最简单的Spring的BeanUtils工具类的使用，你还知道哪些对象映射类库吗？它们又有什么功能呢？</li></ol><p>你还有哪些消除重复代码的心得和方法吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,94)])])}const m=a(l,[["render",t]]);export{g as __pageData,m as default};
