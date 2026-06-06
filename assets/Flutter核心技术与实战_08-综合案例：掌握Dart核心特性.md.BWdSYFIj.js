import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"08 | 综合案例：掌握Dart核心特性","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例介绍","slug":"案例介绍","link":"#案例介绍","children":[]},{"level":2,"title":"类抽象改造","slug":"类抽象改造","link":"#类抽象改造","children":[]},{"level":2,"title":"方法改造","slug":"方法改造","link":"#方法改造","children":[]},{"level":2,"title":"对象初始化方式的优化","slug":"对象初始化方式的优化","link":"#对象初始化方式的优化","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/08-综合案例：掌握Dart核心特性.md","filePath":"Flutter核心技术与实战/08-综合案例：掌握Dart核心特性.md","lastUpdated":1779815654000}'),l={name:"Flutter核心技术与实战/08-综合案例：掌握Dart核心特性.md"};function i(t,n,c,o,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_08-综合案例-掌握dart核心特性" tabindex="-1">08 | 综合案例：掌握Dart核心特性 <a class="header-anchor" href="#_08-综合案例-掌握dart核心特性" aria-label="Permalink to &quot;08 | 综合案例：掌握Dart核心特性&quot;">​</a></h1><p>你好，我是陈航。</p><p>在前两篇文章中，我首先与你一起学习了Dart程序的基本结构和语法，认识了Dart语言世界的基本构成要素，也就是类型系统，以及它们是怎么表示信息的。然后，我带你学习了Dart面向对象设计的基本思路，知道了函数、类与运算符这些其他编程语言中常见的概念，在Dart中的差异及典型用法，理解了Dart是怎么处理信息的。</p><p>可以看到，Dart吸纳了其他编程语言的优点，在关于如何表达以及处理信息上，既简单又简洁，而且又不失强大。俗话说，纸上得来终觉浅，绝知此事要躬行。那么今天，我就用一个综合案例，把前面学习的关于Dart的零散知识串起来，希望你可以动手试验一下这个案例，借此掌握如何用Dart编程。</p><p>有了前面学习的知识点，再加上今天的综合案例练习，我认为你已经掌握了Dart最常用的80%的特性，可以在基本没有语言障碍的情况下去使用Flutter了。至于剩下的那20%的特性，因为使用较少，所以我不会在本专栏做重点讲解。如果你对这部分内容感兴趣的话，可以访问 <a href="https://dart.dev/tutorials" target="_blank" rel="noreferrer">官方文档</a> 去做进一步了解。</p><p>此外，关于Dart中的异步和并发，我会在后面的第23篇文章“单线程模型怎么保证UI运行流畅？”中进行深入介绍。</p><h2 id="案例介绍" tabindex="-1">案例介绍 <a class="header-anchor" href="#案例介绍" aria-label="Permalink to &quot;案例介绍&quot;">​</a></h2><p>今天，我选择的案例是，先用Dart写一段购物车程序，但先不使用Dart独有的特性。然后，我们再以这段程序为起点，逐步加入Dart语言特性，将其改造为一个符合Dart设计思想的程序。你可以在这个改造过程中，进一步体会到Dart的魅力所在。</p><p>首先，我们来看看在不使用任何Dart语法特性的情况下，一个有着基本功能的购物车程序长什么样子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义商品Item类</span></span>
<span class="line"><span>class Item {</span></span>
<span class="line"><span>  double price;</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  Item(name, price) {</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>    this.price = price;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//定义购物车类</span></span>
<span class="line"><span>class ShoppingCart {</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  DateTime date;</span></span>
<span class="line"><span>  String code;</span></span>
<span class="line"><span>  List&lt;​Item&gt; bookings;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  price() {</span></span>
<span class="line"><span>    double sum = 0.0;</span></span>
<span class="line"><span>    for(var i in bookings) {</span></span>
<span class="line"><span>      sum += i.price;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ShoppingCart(name, code) {</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>    this.code = code;</span></span>
<span class="line"><span>    this.date = DateTime.now();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  getInfo() {</span></span>
<span class="line"><span>    return &#39;购物车信息:&#39; +</span></span>
<span class="line"><span>          &#39;\\n-----------------------------&#39; +</span></span>
<span class="line"><span>          &#39;\\n用户名: &#39; + name+</span></span>
<span class="line"><span>          &#39;\\n优惠码: &#39; + code +</span></span>
<span class="line"><span>          &#39;\\n总价: &#39; + price().toString() +</span></span>
<span class="line"><span>          &#39;\\n日期: &#39; + date.toString() +</span></span>
<span class="line"><span>          &#39;\\n-----------------------------&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  ShoppingCart sc = ShoppingCart(&#39;张三&#39;, &#39;123456&#39;);</span></span>
<span class="line"><span>  sc.bookings = [Item(&#39;苹果&#39;,10.0), Item(&#39;鸭梨&#39;,20.0)];</span></span>
<span class="line"><span>  print(sc.getInfo());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段程序中，我定义了商品Item类，以及购物车ShoppingCart类。它们分别包含了一个初始化构造方法，将main函数传入的参数信息赋值给对象内部属性。而购物车的基本信息，则通过ShoppingCart类中的getInfo方法输出。在这个方法中，我采用字符串拼接的方式，将各类信息进行格式化组合后，返回给调用者。</p><p>运行这段程序，不出意外，购物车对象sc包括的用户名、优惠码、总价与日期在内的基本信息都会被打印到命令行中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>购物车信息:</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>用户名: 张三</span></span>
<span class="line"><span>优惠码: 123456</span></span>
<span class="line"><span>总价: 30.0</span></span>
<span class="line"><span>日期: 2019-06-01 17:17:57.004645</span></span>
<span class="line"><span>-----------------------------</span></span></code></pre></div><p>这段程序的功能非常简单：我们初始化了一个购物车对象，然后给购物车对象进行加购操作，最后打印出基本信息。可以看到，在不使用Dart语法任何特性的情况下，这段代码与Java、C++甚至JavaScript没有明显的语法差异。</p><p>在关于如何表达以及处理信息上，Dart保持了既简单又简洁的风格。那接下来， <strong>我们就先从表达信息入手，看看Dart是如何优化这段代码的。</strong></p><h2 id="类抽象改造" tabindex="-1">类抽象改造 <a class="header-anchor" href="#类抽象改造" aria-label="Permalink to &quot;类抽象改造&quot;">​</a></h2><p>我们先来看看Item类与ShoppingCart类的初始化部分。它们在构造函数中的初始化工作，仅仅是将main函数传入的参数进行属性赋值。</p><p>在其他编程语言中，在构造函数的函数体内，将初始化参数赋值给实例变量的方式非常常见。而在Dart里，我们可以利用语法糖以及初始化列表，来简化这样的赋值过程，从而直接省去构造函数的函数体：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Item {</span></span>
<span class="line"><span>  double price;</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  Item(this.name, this.price);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ShoppingCart {</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  DateTime date;</span></span>
<span class="line"><span>  String code;</span></span>
<span class="line"><span>  List&lt;​Item&gt; bookings;</span></span>
<span class="line"><span>  price() {...}</span></span>
<span class="line"><span>  //删掉了构造函数函数体</span></span>
<span class="line"><span>  ShoppingCart(this.name, this.code) : date = DateTime.now();</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这一下就省去了7行代码！通过这次改造，我们有两个新的发现：</p><ul><li>首先，Item类与ShoppingCart类中都有一个name属性，在Item中表示商品名称，在ShoppingCart中则表示用户名；</li><li>然后，Item类中有一个price属性，ShoppingCart中有一个price方法，它们都表示当前的价格。</li></ul><p>考虑到name属性与price属性（方法）的名称与类型完全一致，在信息表达上的作用也几乎一致，因此我可以在这两个类的基础上，再抽象出一个新的基类Meta，用于存放price属性与name属性。</p><p>同时，考虑到在ShoppingCart类中，price属性仅用做计算购物车中商品的价格（而不是像Item类那样用于数据存取），因此在继承了Meta类后，我改写了ShoppingCart类中price属性的get方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Meta {</span></span>
<span class="line"><span>  double price;</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  Meta(this.name, this.price);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Item extends Meta{</span></span>
<span class="line"><span>  Item(name, price) : super(name, price);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ShoppingCart extends Meta{</span></span>
<span class="line"><span>  DateTime date;</span></span>
<span class="line"><span>  String code;</span></span>
<span class="line"><span>  List&lt;​Item&gt; bookings;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  double get price {...}</span></span>
<span class="line"><span>  ShoppingCart(name, this.code) : date = DateTime.now(),super(name,0);</span></span>
<span class="line"><span>  getInfo() {...}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过这次类抽象改造，程序中各个类的依赖关系变得更加清晰了。不过，目前这段程序中还有两个冗长的方法显得格格不入，即ShoppingCart类中计算价格的price属性get方法，以及提供购物车基本信息的getInfo方法。接下来，我们分别来改造这两个方法。</p><h2 id="方法改造" tabindex="-1">方法改造 <a class="header-anchor" href="#方法改造" aria-label="Permalink to &quot;方法改造&quot;">​</a></h2><p>我们先看看price属性的get方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>double get price {</span></span>
<span class="line"><span>  double sum = 0.0;</span></span>
<span class="line"><span>  for(var i in bookings) {</span></span>
<span class="line"><span>    sum += i.price;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个方法里，我采用了其他语言常见的求和算法，依次遍历bookings列表中的Item对象，累积相加求和。</p><p>而在Dart中，这样的求和运算我们只需重载Item类的“+”运算符，并通过对列表对象进行归纳合并操作即可实现（你可以想象成，把购物车中的所有商品都合并成了一个商品套餐对象）。</p><p>另外，由于函数体只有一行，所以我们可以使用Dart的箭头函数来进一步简化实现函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Item extends Meta{</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  //重载了+运算符，合并商品为套餐商品</span></span>
<span class="line"><span>  Item operator+(Item item) =&gt; Item(name + item.name, price + item.price);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ShoppingCart extends Meta{</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  //把迭代求和改写为归纳合并</span></span>
<span class="line"><span>  double get price =&gt; bookings.reduce((value, element) =&gt; value + element).price;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  getInfo() {...}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，这段代码又简洁了很多！接下来，我们再看看getInfo方法如何优化。</p><p>在getInfo方法中，我们将ShoppingCart类的基本信息通过字符串拼接的方式，进行格式化组合，这在其他编程语言中非常常见。而在Dart中，我们可以通过对字符串插入变量或表达式，并使用多行字符串声明的方式，来完全抛弃不优雅的字符串拼接，实现字符串格式化组合。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>getInfo () =&gt; &#39;&#39;&#39;</span></span>
<span class="line"><span>购物车信息:</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>  用户名: $name</span></span>
<span class="line"><span>  优惠码: $code</span></span>
<span class="line"><span>  总价: $price</span></span>
<span class="line"><span>  Date: $date</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>&#39;&#39;&#39;;</span></span></code></pre></div><p>在去掉了多余的字符串转义和拼接代码后，getInfo方法看着就清晰多了。</p><p>在优化完了ShoppingCart类与Item类的内部实现后，我们再来看看main函数，从调用方的角度去分析程序还能在哪些方面做优化。</p><h2 id="对象初始化方式的优化" tabindex="-1">对象初始化方式的优化 <a class="header-anchor" href="#对象初始化方式的优化" aria-label="Permalink to &quot;对象初始化方式的优化&quot;">​</a></h2><p>在main函数中，我们使用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ShoppingCart sc = ShoppingCart(&#39;张三&#39;, &#39;123456&#39;) ;</span></span></code></pre></div><p>初始化了一个使用‘123456’优惠码、名为‘张三’的用户所使用的购物车对象。而这段初始化方法的调用，我们可以从两个方面优化：</p><ul><li>首先，在对ShoppingCart的构造函数进行了大量简写后，我们希望能够提供给调用者更明确的初始化方法调用方式，让调用者以“参数名:参数键值对”的方式指定调用参数，让调用者明确传递的初始化参数的意义。在Dart中，这样的需求，我们在声明函数时，可以通过给参数增加{}实现。</li><li>其次，对一个购物车对象来说，一定会有一个有用户名，但不一定有优惠码的用户。因此，对于购物车对象的初始化，我们还需要提供一个不含优惠码的初始化方法，并且需要确定多个初始化方法与父类的初始化方法之间的正确调用顺序。</li></ul><p>按照这样的思路，我们开始对ShoppingCart进行改造。</p><p>需要注意的是，由于优惠码可以为空，我们还需要对getInfo方法进行兼容处理。在这里，我用到了a??b运算符，这个运算符能够大量简化在其他语言中三元表达式(a != null)? a : b的写法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class ShoppingCart extends Meta{</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  //默认初始化方法，转发到withCode里</span></span>
<span class="line"><span>  ShoppingCart({name}) : this.withCode(name:name, code:null);</span></span>
<span class="line"><span>  //withCode初始化方法，使用语法糖和初始化列表进行赋值，并调用父类初始化方法</span></span>
<span class="line"><span>  ShoppingCart.withCode({name, this.code}) : date = DateTime.now(), super(name,0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //??运算符表示为code不为null，则用原值，否则使用默认值&quot;没有&quot;</span></span>
<span class="line"><span>  getInfo () =&gt; &#39;&#39;&#39;</span></span>
<span class="line"><span>购物车信息:</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>  用户名: $name</span></span>
<span class="line"><span>  优惠码: \${code??&quot;没有&quot;}</span></span>
<span class="line"><span>  总价: $price</span></span>
<span class="line"><span>  Date: $date</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>&#39;&#39;&#39;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  ShoppingCart sc = ShoppingCart.withCode(name:&#39;张三&#39;, code:&#39;123456&#39;);</span></span>
<span class="line"><span>  sc.bookings = [Item(&#39;苹果&#39;,10.0), Item(&#39;鸭梨&#39;,20.0)];</span></span>
<span class="line"><span>  print(sc.getInfo());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ShoppingCart sc2 = ShoppingCart(name:&#39;李四&#39;);</span></span>
<span class="line"><span>  sc2.bookings = [Item(&#39;香蕉&#39;,15.0), Item(&#39;西瓜&#39;,40.0)];</span></span>
<span class="line"><span>  print(sc2.getInfo());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这段程序，张三和李四的购物车信息都会被打印到命令行中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>购物车信息:</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>  用户名: 张三</span></span>
<span class="line"><span>  优惠码: 123456</span></span>
<span class="line"><span>  总价: 30.0</span></span>
<span class="line"><span>  Date: 2019-06-01 19:59:30.443817</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>购物车信息:</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>  用户名: 李四</span></span>
<span class="line"><span>  优惠码: 没有</span></span>
<span class="line"><span>  总价: 55.0</span></span>
<span class="line"><span>  Date: 2019-06-01 19:59:30.451747</span></span>
<span class="line"><span>-----------------------------</span></span></code></pre></div><p>关于购物车信息的打印，我们是通过在main函数中获取到购物车对象的信息后，使用全局的print函数打印的，我们希望把打印信息的行为封装到ShoppingCart类中。而对于打印信息的行为而言，这是一个非常通用的功能，不止ShoppingCart类需要，Item对象也可能需要。</p><p>因此，我们需要把打印信息的能力单独封装成一个单独的类PrintHelper。但，ShoppingCart类本身已经继承自Meta类，考虑到Dart并不支持多继承，我们怎样才能实现PrintHelper类的复用呢？</p><p>这就用到了我在上一篇文章中提到的“混入”（Mixin），相信你还记得只要在使用时加上with关键字即可。</p><p>我们来试着增加PrintHelper类，并调整ShoppingCart的声明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract class PrintHelper {</span></span>
<span class="line"><span>  printInfo() =&gt; print(getInfo());</span></span>
<span class="line"><span>  getInfo();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ShoppingCart extends Meta with PrintHelper{</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过Mixin的改造，我们终于把所有购物车的行为都封装到ShoppingCart内部了。而对于调用方而言，还可以使用级联运算符“..”，在同一个对象上连续调用多个函数以及访问成员变量。使用级联操作符可以避免创建临时变量，让代码看起来更流畅：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>  ShoppingCart.withCode(name:&#39;张三&#39;, code:&#39;123456&#39;)</span></span>
<span class="line"><span>  ..bookings = [Item(&#39;苹果&#39;,10.0), Item(&#39;鸭梨&#39;,20.0)]</span></span>
<span class="line"><span>  ..printInfo();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ShoppingCart(name:&#39;李四&#39;)</span></span>
<span class="line"><span>  ..bookings = [Item(&#39;香蕉&#39;,15.0), Item(&#39;西瓜&#39;,40.0)]</span></span>
<span class="line"><span>  ..printInfo();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>很好！通过Dart独有的语法特性，我们终于把这段购物车代码改造成了简洁、直接而又强大的Dart风格程序。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这就是今天分享的全部内容了。在今天，我们以一个与Java、C++甚至JavaScript没有明显语法差异的购物车雏形为起步，逐步将它改造成了一个符合Dart设计思想的程序。</p><p>首先，我们使用构造函数语法糖及初始化列表，简化了成员变量的赋值过程。然后，我们重载了“+”运算符，并采用归纳合并的方式实现了价格计算，并且使用多行字符串和内嵌表达式的方式，省去了无谓的字符串拼接。最后，我们重新梳理了类之间的继承关系，通过mixin、多构造函数，可选命名参数等手段，优化了对象初始化调用方式。</p><p>下面是今天购物车综合案例的完整代码，希望你在IDE中多多练习，体会这次的改造过程，从而对Dart那些使代码变得更简洁、直接而强大的关键语法特性产生更深刻的印象。同时，改造前后的代码，你也可以在GitHub的 <a href="https://github.com/cyndibaby905/08_Dart_Sample" target="_blank" rel="noreferrer">Dart_Sample</a> 中找到：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Meta {</span></span>
<span class="line"><span>  double price;</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  //成员变量初始化语法糖</span></span>
<span class="line"><span>  Meta(this.name, this.price);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Item extends Meta{</span></span>
<span class="line"><span>  Item(name, price) : super(name, price);</span></span>
<span class="line"><span>  //重载+运算符，将商品对象合并为套餐商品</span></span>
<span class="line"><span>  Item operator+(Item item) =&gt; Item(name + item.name, price + item.price);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>abstract class PrintHelper {</span></span>
<span class="line"><span>  printInfo() =&gt; print(getInfo());</span></span>
<span class="line"><span>  getInfo();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//with表示以非继承的方式复用了另一个类的成员变量及函数</span></span>
<span class="line"><span>class ShoppingCart extends Meta with PrintHelper{</span></span>
<span class="line"><span>  DateTime date;</span></span>
<span class="line"><span>  String code;</span></span>
<span class="line"><span>  List&lt;​Item&gt; bookings;</span></span>
<span class="line"><span>  //以归纳合并方式求和</span></span>
<span class="line"><span>  double get price =&gt; bookings.reduce((value, element) =&gt; value + element).price;</span></span>
<span class="line"><span>  //默认初始化函数，转发至withCode函数</span></span>
<span class="line"><span>  ShoppingCart({name}) : this.withCode(name:name, code:null);</span></span>
<span class="line"><span>  //withCode初始化方法，使用语法糖和初始化列表进行赋值，并调用父类初始化方法</span></span>
<span class="line"><span>  ShoppingCart.withCode({name, this.code}) : date = DateTime.now(), super(name,0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //??运算符表示为code不为null，则用原值，否则使用默认值&quot;没有&quot;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  getInfo() =&gt; &#39;&#39;&#39;</span></span>
<span class="line"><span>购物车信息:</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>  用户名: $name</span></span>
<span class="line"><span>  优惠码: \${code??&quot;没有&quot;}</span></span>
<span class="line"><span>  总价: $price</span></span>
<span class="line"><span>  Date: $date</span></span>
<span class="line"><span>-----------------------------</span></span>
<span class="line"><span>&#39;&#39;&#39;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  ShoppingCart.withCode(name:&#39;张三&#39;, code:&#39;123456&#39;)</span></span>
<span class="line"><span>  ..bookings = [Item(&#39;苹果&#39;,10.0), Item(&#39;鸭梨&#39;,20.0)]</span></span>
<span class="line"><span>  ..printInfo();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ShoppingCart(name:&#39;李四&#39;)</span></span>
<span class="line"><span>  ..bookings = [Item(&#39;香蕉&#39;,15.0), Item(&#39;西瓜&#39;,40.0)]</span></span>
<span class="line"><span>  ..printInfo();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你扩展购物车程序的实现，使得我们的购物车可以支持：</p><ol><li>商品数量属性；</li><li>购物车信息增加商品列表信息（包括商品名称，数量及单价）输出，实现小票的基本功能。</li></ol><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,64)])])}const m=s(l,[["render",i]]);export{g as __pageData,m as default};
