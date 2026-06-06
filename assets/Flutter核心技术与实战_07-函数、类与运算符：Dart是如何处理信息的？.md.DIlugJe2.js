import{_ as s,H as a,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"07 | 函数、类与运算符：Dart是如何处理信息的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"函数","slug":"函数","link":"#函数","children":[]},{"level":2,"title":"类","slug":"类","link":"#类","children":[{"level":3,"title":"类的定义及初始化","slug":"类的定义及初始化","link":"#类的定义及初始化","children":[]},{"level":3,"title":"复用","slug":"复用","link":"#复用","children":[]}]},{"level":2,"title":"运算符","slug":"运算符","link":"#运算符","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/07-函数、类与运算符：Dart是如何处理信息的？.md","filePath":"Flutter核心技术与实战/07-函数、类与运算符：Dart是如何处理信息的？.md","lastUpdated":1779815654000}'),e={name:"Flutter核心技术与实战/07-函数、类与运算符：Dart是如何处理信息的？.md"};function i(t,n,o,r,c,d){return a(),p("div",null,[...n[0]||(n[0]=[l(`<h1 id="_07-函数、类与运算符-dart是如何处理信息的" tabindex="-1">07 | 函数、类与运算符：Dart是如何处理信息的？ <a class="header-anchor" href="#_07-函数、类与运算符-dart是如何处理信息的" aria-label="Permalink to &quot;07 | 函数、类与运算符：Dart是如何处理信息的？&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我通过一个基本hello word的示例，带你体验了Dart的基础语法与类型变量，并与其他编程语言的特性进行对比，希望可以帮助你快速建立起对Dart的初步印象。</p><p>其实，编程语言虽然千差万别，但归根结底，它们的设计思想无非就是回答两个问题：</p><ul><li>如何表示信息；</li><li>如何处理信息。</li></ul><p>在上一篇文章中，我们已经解决了Dart如何表示信息的问题，今天这篇文章我就着重和你分享它是如何处理信息的。</p><p>作为一门真正面向对象的编程语言，Dart将处理信息的过程抽象为了对象，以结构化的方式将功能分解，而函数、类与运算符就是抽象中最重要的手段。</p><p>接下来，我就从函数、类与运算符的角度，来进一步和你讲述Dart面向对象设计的基本思路。</p><h2 id="函数" tabindex="-1">函数 <a class="header-anchor" href="#函数" aria-label="Permalink to &quot;函数&quot;">​</a></h2><p>函数是一段用来独立地完成某个功能的代码。我在上一篇文章中和你提到，在Dart中，所有类型都是对象类型，函数也是对象，它的类型叫作Function。这意味着函数也可以被定义为变量，甚至可以被定义为参数传递给另一个函数。</p><p>在下面这段代码示例中，我定义了一个判断整数是否为0的isZero函数，并把它传递了给另一个printInfo函数，完成格式化打印出判断结果的功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool isZero(int number) { //判断整数是否为0</span></span>
<span class="line"><span>  return number == 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void printInfo(int number,Function check) { //用check函数来判断整数是否为0</span></span>
<span class="line"><span>  print(&quot;$number is Zero: \${check(number)}&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Function f = isZero;</span></span>
<span class="line"><span>int x = 10;</span></span>
<span class="line"><span>int y = 0;</span></span>
<span class="line"><span>printInfo(x,f);  // 输出 10 is Zero: false</span></span>
<span class="line"><span>printInfo(y,f);  // 输出 0 is Zero: true</span></span></code></pre></div><p>如果函数体只有一行表达式，就比如上面示例中的isZero和printInfo函数，我们还可以像JavaScript语言那样用箭头函数来简化这个函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool isZero(int number) =&gt; number == 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void printInfo(int number,Function check) =&gt; print(&quot;$number is Zero: \${check(number)}&quot;);</span></span></code></pre></div><p>有时，一个函数中可能需要传递多个参数。那么，如何让这类函数的参数声明变得更加优雅、可维护，同时降低调用者的使用成本呢？</p><p>C++与Java的做法是，提供函数的重载，即提供同名但参数不同的函数。但 <strong>Dart认为重载会导致混乱，因此从设计之初就不支持重载，而是提供了可选命名参数和可选参数</strong>。</p><p>具体方式是，在声明函数时：</p><ul><li>给参数增加{}，以paramName: value的方式指定调用参数，也就是可选命名参数；</li><li>给参数增加[]，则意味着这些参数是可以忽略的，也就是可选参数。</li></ul><p>在使用这两种方式定义函数时，我们还可以在参数未传递时设置默认值。我以一个只有两个参数的简单函数为例，来和你说明这两种方式的具体用法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//要达到可选命名参数的用法，那就在定义函数的时候给参数加上 {}</span></span>
<span class="line"><span>void enable1Flags({bool bold, bool hidden}) =&gt; print(&quot;$bold , $hidden&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//定义可选命名参数时增加默认值</span></span>
<span class="line"><span>void enable2Flags({bool bold = true, bool hidden = false}) =&gt; print(&quot;$bold ,$hidden&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//可忽略的参数在函数定义时用[]符号指定</span></span>
<span class="line"><span>void enable3Flags(bool bold, [bool hidden]) =&gt; print(&quot;$bold ,$hidden&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//定义可忽略参数时增加默认值</span></span>
<span class="line"><span>void enable4Flags(bool bold, [bool hidden = false]) =&gt; print(&quot;$bold ,$hidden&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//可选命名参数函数调用</span></span>
<span class="line"><span>enable1Flags(bold: true, hidden: false); //true, false</span></span>
<span class="line"><span>enable1Flags(bold: true); //true, null</span></span>
<span class="line"><span>enable2Flags(bold: false); //false, false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//可忽略参数函数调用</span></span>
<span class="line"><span>enable3Flags(true, false); //true, false</span></span>
<span class="line"><span>enable3Flags(true,); //true, null</span></span>
<span class="line"><span>enable4Flags(true); //true, false</span></span>
<span class="line"><span>enable4Flags(true,true); // true, true</span></span></code></pre></div><p><strong>这里我要和你强调的是，在Flutter中会大量用到可选命名参数的方式，你一定要记住它的用法。</strong></p><h2 id="类" tabindex="-1">类 <a class="header-anchor" href="#类" aria-label="Permalink to &quot;类&quot;">​</a></h2><p>类是特定类型的数据和方法的集合，也是创建对象的模板。与其他语言一样，Dart为类概念提供了内置支持。</p><h3 id="类的定义及初始化" tabindex="-1">类的定义及初始化 <a class="header-anchor" href="#类的定义及初始化" aria-label="Permalink to &quot;类的定义及初始化&quot;">​</a></h3><p>Dart是面向对象的语言，每个对象都是一个类的实例，都继承自顶层类型Object。在Dart中，实例变量与实例方法、类变量与类方法的声明与Java类似，我就不再过多展开了。</p><p>值得一提的是，Dart中并没有public、protected、private这些关键字，我们只要在声明变量与方法时，在前面加上“_”即可作为private方法使用。如果不加“_”，则默认为public。不过， <strong>“_”的限制范围并不是类访问级别的，而是库访问级别</strong>。</p><p>接下来，我们以一个具体的案例看看 <strong>Dart是如何定义和使用类的。</strong></p><p>我在Point类中，定义了两个成员变量x和y，通过构造函数语法糖进行初始化，成员函数printInfo的作用是打印它们的信息；而类变量factor，则在声明时就已经赋好了默认值0，类函数printZValue会打印出它的信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>  num x, y;</span></span>
<span class="line"><span>  static num factor = 0;</span></span>
<span class="line"><span>  //语法糖，等同于在函数体内：this.x = x;this.y = y;</span></span>
<span class="line"><span>  Point(this.x,this.y);</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x, $y)&#39;);</span></span>
<span class="line"><span>  static void printZValue() =&gt; print(&#39;$factor&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var p = new Point(100,200); // new 关键字可以省略</span></span>
<span class="line"><span>p.printInfo();  // 输出(100, 200);</span></span>
<span class="line"><span>Point.factor = 10;</span></span>
<span class="line"><span>Point.printZValue(); // 输出10</span></span></code></pre></div><p>有时候类的实例化需要根据参数提供多种初始化方式。除了可选命名参数和可选参数之外，Dart还提供了 <strong>命名构造函数</strong> 的方式，使得类的实例化过程语义更清晰。</p><p>此外， <strong>与C++类似，Dart支持初始化列表</strong>。在构造函数的函数体真正执行之前，你还有机会给实例变量赋值，甚至重定向至另一个构造函数。</p><p>如下面实例所示，Point类中有两个构造函数Point.bottom与Point，其中：Point.bottom将其成员变量的初始化重定向到了Point中，而Point则在初始化列表中为z赋上了默认值0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>  num x, y, z;</span></span>
<span class="line"><span>  Point(this.x, this.y) : z = 0; // 初始化变量z</span></span>
<span class="line"><span>  Point.bottom(num x) : this(x, 0); // 重定向构造函数</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x,$y,$z)&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var p = Point.bottom(100);</span></span>
<span class="line"><span>p.printInfo(); // 输出(100,0,0)</span></span></code></pre></div><h3 id="复用" tabindex="-1">复用 <a class="header-anchor" href="#复用" aria-label="Permalink to &quot;复用&quot;">​</a></h3><p>在面向对象的编程语言中，将其他类的变量与方法纳入本类中进行复用的方式一般有两种： <strong>继承父类和接口实现</strong>。当然，在Dart也不例外。</p><p>在Dart中，你可以对同一个父类进行继承或接口实现：</p><ul><li>继承父类意味着，子类由父类派生，会自动获取父类的成员变量和方法实现，子类可以根据需要覆写构造函数及父类方法；</li><li>接口实现则意味着，子类获取到的仅仅是接口的成员变量符号和方法符号，需要重新实现成员变量，以及方法的声明和初始化，否则编译器会报错。</li></ul><p>接下来，我以一个例子和你说明 <strong>在Dart中继承和接口的差别</strong>。</p><p>Vector通过继承Point的方式增加了成员变量，并覆写了printInfo的实现；而Coordinate，则通过接口实现的方式，覆写了Point的变量定义及函数实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>  num x = 0, y = 0;</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x,$y)&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Vector继承自Point</span></span>
<span class="line"><span>class Vector extends Point{</span></span>
<span class="line"><span>  num z = 0;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x,$y,$z)&#39;); //覆写了printInfo实现</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Coordinate是对Point的接口实现</span></span>
<span class="line"><span>class Coordinate implements Point {</span></span>
<span class="line"><span>  num x = 0, y = 0; //成员变量需要重新声明</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x,$y)&#39;); //成员函数需要重新声明实现</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var xxx = Vector();</span></span>
<span class="line"><span>xxx</span></span>
<span class="line"><span>  ..x = 1</span></span>
<span class="line"><span>  ..y = 2</span></span>
<span class="line"><span>  ..z = 3; //级联运算符，等同于xxx.x=1; xxx.y=2;xxx.z=3;</span></span>
<span class="line"><span>xxx.printInfo(); //输出(1,2,3)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var yyy = Coordinate();</span></span>
<span class="line"><span>yyy</span></span>
<span class="line"><span>  ..x = 1</span></span>
<span class="line"><span>  ..y = 2; //级联运算符，等同于yyy.x=1; yyy.y=2;</span></span>
<span class="line"><span>yyy.printInfo(); //输出(1,2)</span></span>
<span class="line"><span>print (yyy is Point); //true</span></span>
<span class="line"><span>print(yyy is Coordinate); //true</span></span></code></pre></div><p>可以看出，子类Coordinate采用接口实现的方式，仅仅是获取到了父类Point的一个“空壳子”，只能从语义层面当成接口Point来用，但并不能复用Point的原有实现。那么， <strong>我们是否能够找到方法去复用Point的对应方法实现呢？</strong></p><p>也许你很快就想到了，我可以让Coordinate继承Point，来复用其对应的方法。但，如果Coordinate还有其他的父类，我们又该如何处理呢？</p><p>其实， <strong>除了继承和接口实现之外，Dart还提供了另一种机制来实现类的复用，即“混入”（Mixin）</strong>。混入鼓励代码重用，可以被视为具有实现方法的接口。这样一来，不仅可以解决Dart缺少对多重继承的支持问题，还能够避免由于多重继承可能导致的歧义（菱形问题）。</p><blockquote><p>备注：继承歧义，也叫菱形问题，是支持多继承的编程语言中一个相当棘手的问题。当B类和C类继承自A类，而D类继承自B类和C类时会产生歧义。如果A中有一个方法在B和C中已经覆写，而D没有覆写它，那么D继承的方法的版本是B类，还是C类的呢？</p></blockquote><p><strong>要使用混入，只需要with关键字即可。</strong> 我们来试着改造Coordinate的实现，把类中的变量声明和函数实现全部删掉：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Coordinate with Point {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var yyy = Coordinate();</span></span>
<span class="line"><span>print (yyy is Point); //true</span></span>
<span class="line"><span>print(yyy is Coordinate); //true</span></span></code></pre></div><p>可以看到，通过混入，一个类里可以以非继承的方式使用其他类中的变量与方法，效果正如你想象的那样。</p><h2 id="运算符" tabindex="-1">运算符 <a class="header-anchor" href="#运算符" aria-label="Permalink to &quot;运算符&quot;">​</a></h2><p>Dart和绝大部分编程语言的运算符一样，所以你可以用熟悉的方式去执行程序代码运算。不过， <strong>Dart多了几个额外的运算符，用于简化处理变量实例缺失（即null）的情况</strong>。</p><ul><li><strong>?.</strong> 运算符：假设Point类有printInfo()方法，p是Point的一个可能为null的实例。那么，p调用成员方法的安全代码，可以简化为p?.printInfo() ，表示p为null的时候跳过，避免抛出异常。</li><li><strong>??=</strong> 运算符：如果a为null，则给a赋值value，否则跳过。这种用默认值兜底的赋值语句在Dart中我们可以用a ??= value表示。</li><li><strong>??</strong> 运算符：如果a不为null，返回a的值，否则返回b。在Java或者C++中，我们需要通过三元表达式(a != null)? a : b来实现这种情况。而在Dart中，这类代码可以简化为a ?? b。</li></ul><p><strong>在Dart中，一切都是对象，就连运算符也是对象成员函数的一部分。</strong></p><p>对于系统的运算符，一般情况下只支持基本数据类型和标准库中提供的类型。而对于用户自定义的类，如果想支持基本操作，比如比较大小、相加相减等，则需要用户自己来定义关于这个运算符的具体实现。</p><p><strong>Dart提供了类似C++的运算符覆写机制</strong>，使得我们不仅可以覆写方法，还可以覆写或者自定义运算符。</p><p>接下来，我们一起看一个Vector类中自定义“+”运算符和覆写&quot;==&quot;运算符的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Vector {</span></span>
<span class="line"><span>  num x, y;</span></span>
<span class="line"><span>  Vector(this.x, this.y);</span></span>
<span class="line"><span>  // 自定义相加运算符，实现向量相加</span></span>
<span class="line"><span>  Vector operator +(Vector v) =&gt;  Vector(x + v.x, y + v.y);</span></span>
<span class="line"><span>  // 覆写相等运算符，判断向量相等</span></span>
<span class="line"><span>  bool operator == (dynamic v) =&gt; x == v.x &amp;&amp; y == v.y;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>final x = Vector(3, 3);</span></span>
<span class="line"><span>final y = Vector(2, 2);</span></span>
<span class="line"><span>final z = Vector(1, 1);</span></span>
<span class="line"><span>print(x == (y + z)); //  输出true</span></span></code></pre></div><p>operator是Dart的关键字，与运算符一起使用，表示一个类成员运算符函数。在理解时，我们应该把operator和运算符作为整体，看作是一个成员函数名。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>函数、类与运算符是Dart处理信息的抽象手段。从今天的学习中你可以发现，Dart面向对象的设计吸纳了其他编程语言的优点，表达和处理信息的方式既简单又简洁，但又不失强大。</p><p>通过这两篇文章的内容，相信你已经了解了Dart的基本设计思路，熟悉了在Flutter开发中常用的语法特性，也已经具备了快速上手实践的能力。</p><p>接下来，我们简单回顾一下今天的内容，以便加深记忆与理解。</p><p>首先，我们认识了函数。函数也是对象，可以被定义为变量，或者参数。Dart不支持函数重载，但提供了可选命名参数和可选参数的方式，从而解决了函数声明时需要传递多个参数的可维护性。</p><p>然后，我带你学习了类。类提供了数据和函数的抽象复用能力，可以通过继承（父类继承，接口实现）和非继承（Mixin）方式实现复用。在类的内部，关于成员变量，Dart提供了包括命名构造函数和初始化列表在内的两种初始化方式。</p><p>最后，需要注意的是，运算符也是对象成员函数的一部分，可以覆写或者自定义。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，请你思考以下两个问题。</p><ol><li>你是怎样理解父类继承，接口实现和混入的？我们应该在什么场景下使用它们？</li><li>在父类继承的场景中，父类子类之间的构造函数执行顺序是怎样的？如果父类有多个构造函数，子类也有多个构造函数，如何从代码层面确保父类子类之间构造函数的正确调用？</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>  num x, y;</span></span>
<span class="line"><span>  Point() : this.make(0,0);</span></span>
<span class="line"><span>  Point.left(x) : this.make(x,0);</span></span>
<span class="line"><span>  Point.right(y) : this.make(0,y);</span></span>
<span class="line"><span>  Point.make(this.x, this.y);</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x,$y)&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Vector extends Point{</span></span>
<span class="line"><span>  num z = 0;</span></span>
<span class="line"><span>/*5个构造函数</span></span>
<span class="line"><span>  Vector</span></span>
<span class="line"><span>  Vector.left;</span></span>
<span class="line"><span>  Vector.middle</span></span>
<span class="line"><span>  Vector.right</span></span>
<span class="line"><span>  Vector.make</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void printInfo() =&gt; print(&#39;($x,$y,$z)&#39;); //覆写了printInfo实现</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎将你的答案留言告诉我，我们一起讨论。感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,68)])])}const g=s(e,[["render",i]]);export{h as __pageData,g as default};
