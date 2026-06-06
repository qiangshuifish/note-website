import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const v=JSON.parse('{"title":"15 | Java语法糖与Java编译器","description":"","frontmatter":{},"headers":[{"level":2,"title":"自动装箱与自动拆箱","slug":"自动装箱与自动拆箱","link":"#自动装箱与自动拆箱","children":[]},{"level":2,"title":"泛型与类型擦除","slug":"泛型与类型擦除","link":"#泛型与类型擦除","children":[]},{"level":2,"title":"桥接方法","slug":"桥接方法","link":"#桥接方法","children":[]},{"level":2,"title":"其他语法糖","slug":"其他语法糖","link":"#其他语法糖","children":[]},{"level":2,"title":"总结与实践","slug":"总结与实践","link":"#总结与实践","children":[]}],"relativePath":"深入拆解Java虚拟机/15-Java语法糖与Java编译器.md","filePath":"深入拆解Java虚拟机/15-Java语法糖与Java编译器.md","lastUpdated":1779821039000}'),l={name:"深入拆解Java虚拟机/15-Java语法糖与Java编译器.md"};function i(t,a,c,r,o,d){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_15-java语法糖与java编译器" tabindex="-1">15 | Java语法糖与Java编译器 <a class="header-anchor" href="#_15-java语法糖与java编译器" aria-label="Permalink to &quot;15 | Java语法糖与Java编译器&quot;">​</a></h1><p>在前面的篇章中，我们多次提到了Java语法和Java字节码的差异之处。这些差异之处都是通过Java编译器来协调的。今天我们便来列举一下Java编译器的协调工作。</p><h2 id="自动装箱与自动拆箱" tabindex="-1">自动装箱与自动拆箱 <a class="header-anchor" href="#自动装箱与自动拆箱" aria-label="Permalink to &quot;自动装箱与自动拆箱&quot;">​</a></h2><p>首先要提到的便是Java的自动装箱（auto-boxing）和自动拆箱（auto-unboxing）。</p><p>我们知道，Java语言拥有8个基本类型，每个基本类型都有对应的包装（wrapper）类型。</p><p>之所以需要包装类型，是因为许多Java核心类库的API都是面向对象的。举个例子，Java核心类库中的容器类，就只支持引用类型。</p><p>当需要一个能够存储数值的容器类时，我们往往定义一个存储包装类对象的容器。</p><p>对于基本类型的数值来说，我们需要先将其转换为对应的包装类，再存入容器之中。在Java程序中，这个转换可以是显式，也可以是隐式的，后者正是Java中的自动装箱。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int foo() {</span></span>
<span class="line"><span>  ArrayList&lt;​Integer&gt; list = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>  list.add(0);</span></span>
<span class="line"><span>  int result = list.get(0);</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上图中的Java代码为例。我构造了一个Integer类型的ArrayList，并且向其中添加一个int值0。然后，我会获取该ArrayList的第0个元素，并作为int值返回给调用者。这段代码对应的Java字节码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int foo();</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>     0: new java/util/ArrayList</span></span>
<span class="line"><span>     3: dup</span></span>
<span class="line"><span>     4: invokespecial java/util/ArrayList.&quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>     7: astore_1</span></span>
<span class="line"><span>     8: aload_1</span></span>
<span class="line"><span>     9: iconst_0</span></span>
<span class="line"><span>    10: invokestatic java/lang/Integer.valueOf:(I)Ljava/lang/Integer;</span></span>
<span class="line"><span>    13: invokevirtual java/util/ArrayList.add:(Ljava/lang/Object;)Z</span></span>
<span class="line"><span>    16: pop</span></span>
<span class="line"><span>    17: aload_1</span></span>
<span class="line"><span>    18: iconst_0</span></span>
<span class="line"><span>    19: invokevirtual java/util/ArrayList.get:(I)Ljava/lang/Object;</span></span>
<span class="line"><span>    22: checkcast java/lang/Integer</span></span>
<span class="line"><span>    25: invokevirtual java/lang/Integer.intValue:()I</span></span>
<span class="line"><span>    28: istore_2</span></span>
<span class="line"><span>    29: iload_2</span></span>
<span class="line"><span>    30: ireturn</span></span></code></pre></div><p>当向泛型参数为Integer的ArrayList添加int值时，便需要用到自动装箱了。在上面字节码偏移量为10的指令中，我们调用了Integer.valueOf方法，将int类型的值转换为Integer类型，再存储至容器类中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static Integer valueOf(int i) {</span></span>
<span class="line"><span>    if (i &gt;= IntegerCache.low &amp;&amp; i &lt;= IntegerCache.high)</span></span>
<span class="line"><span>        return IntegerCache.cache[i + (-IntegerCache.low)];</span></span>
<span class="line"><span>    return new Integer(i);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这是Integer.valueOf的源代码。可以看到，当请求的int值在某个范围内时，我们会返回缓存了的Integer对象；而当所请求的int值在范围之外时，我们则会新建一个Integer对象。</p><p>在介绍反射的那一篇中，我曾经提到参数java.lang.Integer.IntegerCache.high。这个参数将影响这里面的IntegerCache.high。</p><p>也就是说，我们可以通过配置该参数，扩大Integer缓存的范围。Java虚拟机参数-XX:+AggressiveOpts也会将IntegerCache.high调整至20000。</p><p>奇怪的是，Java并不支持对IntegerCache.low的更改，也就是说，对于小于-128的整数，我们无法直接使用由Java核心类库所缓存的Integer对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>25: invokevirtual java/lang/Integer.intValue:()I</span></span></code></pre></div><p>当从泛型参数为Integer的ArrayList取出元素时，我们得到的实际上也是Integer对象。如果应用程序期待的是一个int值，那么就会发生自动拆箱。</p><p>在我们的例子中，自动拆箱对应的是字节码偏移量为25的指令。该指令将调用Integer.intValue方法。这是一个实例方法，直接返回Integer对象所存储的int值。</p><h2 id="泛型与类型擦除" tabindex="-1">泛型与类型擦除 <a class="header-anchor" href="#泛型与类型擦除" aria-label="Permalink to &quot;泛型与类型擦除&quot;">​</a></h2><p>你可能已经留意到了，在前面例子生成的字节码中，往ArrayList中添加元素的add方法，所接受的参数类型是Object；而从ArrayList中获取元素的get方法，其返回类型同样也是Object。</p><p>前者还好，但是对于后者，在字节码中我们需要进行向下转换，将所返回的Object强制转换为Integer，方能进行接下来的自动拆箱。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>13: invokevirtual java/util/ArrayList.add:(Ljava/lang/Object;)Z</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>19: invokevirtual java/util/ArrayList.get:(I)Ljava/lang/Object;</span></span>
<span class="line"><span>22: checkcast java/lang/Integer</span></span></code></pre></div><p>之所以会出现这种情况，是因为Java泛型的类型擦除。这是个什么概念呢？简单地说，那便是Java程序里的泛型信息，在Java虚拟机里全部都丢失了。这么做主要是为了兼容引入泛型之前的代码。</p><p>当然，并不是每一个泛型参数被擦除类型后都会变成Object类。对于限定了继承类的泛型参数，经过类型擦除后，所有的泛型参数都将变成所限定的继承类。也就是说，Java编译器将选取该泛型所能指代的所有类中层次最高的那个，作为替换泛型的类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class GenericTest&lt;​T extends Number&gt; {</span></span>
<span class="line"><span>  T foo(T t) {</span></span>
<span class="line"><span>    return t;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举个例子，在上面这段Java代码中，我定义了一个T extends Number的泛型参数。它所对应的字节码如下所示。可以看到，foo方法的方法描述符所接收参数的类型以及返回类型都为Number。方法描述符是Java虚拟机识别方法调用的目标方法的关键。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>T foo(T);</span></span>
<span class="line"><span>  descriptor: (Ljava/lang/Number;)Ljava/lang/Number;</span></span>
<span class="line"><span>  flags: (0x0000)</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    stack=1, locals=2, args_size=2</span></span>
<span class="line"><span>       0: aload_1</span></span>
<span class="line"><span>       1: areturn</span></span>
<span class="line"><span>  Signature: (TT;)TT;</span></span></code></pre></div><p>不过，字节码中仍存在泛型参数的信息，如方法声明里的T foo(T)，以及方法签名（Signature）中的“(TT;)TT;”。这类信息主要由Java编译器在编译他类时使用。</p><p>既然泛型会被类型擦除，那么我们还有必要用它吗？</p><p>我认为是有必要的。Java编译器可以根据泛型参数判断程序中的语法是否正确。举例来说，尽管经过类型擦除后，ArrayList.add方法所接收的参数是Object类型，但是往泛型参数为Integer类型的ArrayList中添加字符串对象，Java编译器是会报错的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ArrayList&lt;​Integer&gt; list = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>list.add(&quot;0&quot;); // 编译出错</span></span></code></pre></div><h2 id="桥接方法" tabindex="-1">桥接方法 <a class="header-anchor" href="#桥接方法" aria-label="Permalink to &quot;桥接方法&quot;">​</a></h2><p>泛型的类型擦除带来了不少问题。其中一个便是方法重写。在第四篇的课后实践中，我留了这么一段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Merchant&lt;​T extends Customer&gt; {</span></span>
<span class="line"><span>  public double actionPrice(T customer) {</span></span>
<span class="line"><span>    return 0.0d;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class VIPOnlyMerchant extends Merchant&lt;​VIP&gt; {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public double actionPrice(VIP customer) {</span></span>
<span class="line"><span>    return 0.0d;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>VIPOnlyMerchant中的actionPrice方法是符合Java语言的方法重写的，毕竟都使用@Override来注解了。然而，经过类型擦除后，父类的方法描述符为(LCustomer;)D，而子类的方法描述符为(LVIP;)D。这显然不符合Java虚拟机关于方法重写的定义。</p><p>为了保证编译而成的Java字节码能够保留重写的语义，Java编译器额外添加了一个桥接方法。该桥接方法在字节码层面重写了父类的方法，并将调用子类的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class VIPOnlyMerchant extends Merchant&lt;​VIP&gt;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>  public double actionPrice(VIP);</span></span>
<span class="line"><span>    descriptor: (LVIP;)D</span></span>
<span class="line"><span>    flags: (0x0001) ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>         0: dconst_0</span></span>
<span class="line"><span>         1: dreturn</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public double actionPrice(Customer);</span></span>
<span class="line"><span>    descriptor: (LCustomer;)D</span></span>
<span class="line"><span>    flags: (0x1041) ACC_PUBLIC, ACC_BRIDGE, ACC_SYNTHETIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: aload_1</span></span>
<span class="line"><span>         2: checkcast class VIP</span></span>
<span class="line"><span>         5: invokevirtual actionPrice:(LVIP;)D</span></span>
<span class="line"><span>         8: dreturn</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 这个桥接方法等同于</span></span>
<span class="line"><span>public double actionPrice(Customer customer) {</span></span>
<span class="line"><span>  return actionPrice((VIP) customer);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在我们的例子中，VIPOnlyMerchant类将包含一个桥接方法actionPrice(Customer)，它重写了父类的同名同方法描述符的方法。该桥接方法将传入的Customer参数强制转换为VIP类型，再调用原本的actionPrice(VIP)方法。</p><p>当一个声明类型为Merchant，实际类型为VIPOnlyMerchant的对象，调用actionPrice方法时，字节码里的符号引用指向的是Merchant.actionPrice(Customer)方法。Java虚拟机将动态绑定至VIPOnlyMerchant类的桥接方法之中，并且调用其actionPrice(VIP)方法。</p><p>需要注意的是，在javap的输出中，该桥接方法的访问标识符除了代表桥接方法的ACC_BRIDGE之外，还有ACC_SYNTHETIC。它表示该方法对于Java源代码来说是不可见的。当你尝试通过传入一个声明类型为Customer的对象作为参数，调用VIPOnlyMerchant类的actionPrice方法时，Java编译器会报错，并且提示参数类型不匹配。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    Customer customer = new VIP();</span></span>
<span class="line"><span>    new VIPOnlyMerchant().actionPrice(customer); // 编译出错</span></span></code></pre></div><p>当然，如果你实在想要调用这个桥接方法，那么你可以选择使用反射机制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Merchant {</span></span>
<span class="line"><span>  public Number actionPrice(Customer customer) {</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class NaiveMerchant extends Merchant {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public Double actionPrice(Customer customer) {</span></span>
<span class="line"><span>    return 0.0D;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>除了前面介绍的泛型重写会生成桥接方法之外，如果子类定义了一个与父类参数类型相同的方法，其返回类型为父类方法返回类型的子类，那么Java编译器也会为其生成桥接方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class NaiveMerchant extends Merchant</span></span>
<span class="line"><span>  public java.lang.Double actionPrice(Customer);</span></span>
<span class="line"><span>    descriptor: (LCustomer;)Ljava/lang/Double;</span></span>
<span class="line"><span>    flags: (0x0001) ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=2, locals=2, args_size=2</span></span>
<span class="line"><span>         0: dconst_0</span></span>
<span class="line"><span>         1: invokestatic Double.valueOf:(D)Ljava/lang/Double;</span></span>
<span class="line"><span>         4: areturn</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public java.lang.Number actionPrice(Customer);</span></span>
<span class="line"><span>    descriptor: (LCustomer;)Ljava/lang/Number;</span></span>
<span class="line"><span>    flags: (0x1041) ACC_PUBLIC, ACC_BRIDGE, ACC_SYNTHETIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=2, locals=2, args_size=2</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: aload_1</span></span>
<span class="line"><span>         2: invokevirtual actionPrice:(LCustomer;)Ljava/lang/Double;</span></span>
<span class="line"><span>         5: areturn</span></span></code></pre></div><p>我之前曾提到过，class文件里允许出现两个同名、同参数类型但是不同返回类型的方法。这里的原方法和桥接方法便是其中一个例子。由于该桥接方法同样标注了ACC_SYNTHETIC，因此，当在Java程序中调用NaiveMerchant.actionPrice时，我们只会调用到原方法。</p><h2 id="其他语法糖" tabindex="-1">其他语法糖 <a class="header-anchor" href="#其他语法糖" aria-label="Permalink to &quot;其他语法糖&quot;">​</a></h2><p>在前面的篇章中，我已经介绍过了变长参数、try-with-resources以及在同一catch代码块中捕获多种异常等语法糖。下面我将列举另外两个常见的语法糖。</p><p>foreach循环允许Java程序在for循环里遍历数组或者Iterable对象。对于数组来说，foreach循环将从0开始逐一访问数组中的元素，直至数组的末尾。其等价的代码如下面所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void foo(int[] array) {</span></span>
<span class="line"><span>  for (int item : array) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 等同于</span></span>
<span class="line"><span>public void bar(int[] array) {</span></span>
<span class="line"><span>  int[] myArray = array;</span></span>
<span class="line"><span>  int length = myArray.length;</span></span>
<span class="line"><span>  for (int i = 0; i &lt; length; i++) {</span></span>
<span class="line"><span>    int item = myArray[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于Iterable对象来说，foreach循环将调用其iterator方法，并且用它的hasNext以及next方法来遍历该Iterable对象中的元素。其等价的代码如下面所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void foo(ArrayList&lt;​Integer&gt; list) {</span></span>
<span class="line"><span>  for (Integer item : list) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 等同于</span></span>
<span class="line"><span>public void bar(ArrayList&lt;​Integer&gt; list) {</span></span>
<span class="line"><span>  Iterator&lt;​Integer&gt; iterator = list.iterator();</span></span>
<span class="line"><span>  while (iterator.hasNext()) {</span></span>
<span class="line"><span>    Integer item = iterator.next();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>字符串switch编译而成的字节码看起来非常复杂，但实际上就是一个哈希桶。由于每个case所截获的字符串都是常量值，因此，Java编译器会将原来的字符串switch转换为int值switch，比较所输入的字符串的哈希值。</p><p>由于字符串哈希值很容易发生碰撞，因此，我们还需要用String.equals逐个比较相同哈希值的字符串。</p><p>如果你感兴趣的话，可以自己利用javap分析字符串switch编译而成的字节码。</p><h2 id="总结与实践" tabindex="-1">总结与实践 <a class="header-anchor" href="#总结与实践" aria-label="Permalink to &quot;总结与实践&quot;">​</a></h2><p>今天我主要介绍了Java编译器对几个语法糖的处理。</p><p>基本类型和其包装类型之间的自动转换，也就是自动装箱、自动拆箱，是通过加入[Wrapper].valueOf（如Integer.valueOf）以及[Wrapper].[primitive]Value（如Integer.intValue）方法调用来实现的。</p><p>Java程序中的泛型信息会被擦除。具体来说，Java编译器将选取该泛型所能指代的所有类中层次最高的那个，作为替换泛型的具体类。</p><p>由于Java语义与Java字节码中关于重写的定义并不一致，因此Java编译器会生成桥接方法作为适配器。此外，我还介绍了foreach循环以及字符串switch的编译。</p><p>今天的实践环节，你可以探索一下Java 10的var关键字，是否保存了泛型信息？是否支持自动装拆箱？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public void foo() {</span></span>
<span class="line"><span>    var value = 1;</span></span>
<span class="line"><span>    var list = new ArrayList&lt;​Integer&gt;();</span></span>
<span class="line"><span>    list.add(value);</span></span>
<span class="line"><span>    // list.add(&quot;1&quot;); 这一句能够编译吗？</span></span>
<span class="line"><span>  }</span></span></code></pre></div>`,64)])])}const h=s(l,[["render",i]]);export{v as __pageData,h as default};
