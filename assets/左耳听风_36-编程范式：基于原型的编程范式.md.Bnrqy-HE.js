import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"36 | 编程范式：基于原型的编程范式","description":"","frontmatter":{},"headers":[],"relativePath":"左耳听风/36-编程范式：基于原型的编程范式.md","filePath":"左耳听风/36-编程范式：基于原型的编程范式.md","lastUpdated":1779819815000}'),t={name:"左耳听风/36-编程范式：基于原型的编程范式.md"};function o(l,a,c,i,r,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_36-编程范式-基于原型的编程范式" tabindex="-1">36 | 编程范式：基于原型的编程范式 <a class="header-anchor" href="#_36-编程范式-基于原型的编程范式" aria-label="Permalink to &quot;36 | 编程范式：基于原型的编程范式&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>基于原型（Prototype）的编程其实也是面向对象编程的一种方式。没有class化的，直接使用对象。又叫，基于实例的编程。其主流的语言就是JavaScript，与传统的面向对象编程的比较如下：</p><ul><li><p>在基于类的编程当中，对象总共有两种类型。类定义了对象的基本布局和函数特性，而接口是“可以使用的”对象，它基于特定类的样式。在此模型中，类表现为行为和结构的集合，对所有接口来说这些类的行为和结构都是相同的。因而，区分规则首先是基于行为和结构，而后才是状态。</p></li><li><p>原型编程的主张者经常争论说，基于类的语言提倡使用一个关注分类和类之间关系的开发模型。与此相对，原型编程看起来提倡程序员关注一系列对象实例的行为，而之后才关心如何将这些对象划分到最近的使用方式相似的原型对象，而不是分成类。</p></li></ul><p>因为如此，很多基于原型的系统提倡运行时进行原型的修改，而只有极少数基于类的面向对象系统（比如第一个动态面向对象的系统Smalltalk）允许类在程序运行时被修改。</p><ul><li><p>在基于类的语言中，一个新的实例通过类构造器和构造器可选的参数来构造，结果实例由类选定的行为和布局创建模型。</p></li><li><p>在基于原型的系统中构造对象有两种方法，通过复制已有的对象或者通过扩展空对象创建。很多基于原型的系统提倡运行时进行原型的修改，而基于类的面向对象系统只有动态语言允许类在运行时被修改（Common Lisp、Dylan、Objective-C、Perl、Python、Ruby和Smalltalk）。</p></li></ul><h1 id="javascript的原型概念" tabindex="-1">JavaScript的原型概念 <a class="header-anchor" href="#javascript的原型概念" aria-label="Permalink to &quot;JavaScript的原型概念&quot;">​</a></h1><p>这里，我们主要以JavaScript举例，面向对象里面要有个Class。但是JavaScript觉得不是这样的，它就是要基于原型编程，就不要Class，就直接在对象上改就行了，基于编程的修改，直接对类型进行修改。</p><p>我们先来看一个示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var foo = {name: &quot;foo&quot;, one: 1, two: 2};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var bar = {three: 3};</span></span></code></pre></div><p>每个对象都有一个 <code>__proto__</code> 的属性，这个就是“原型”。对于上面的两个对象，如果我们把 <code>foo</code> 赋值给 <code>bar.__proto__</code>，那就意味着， <code>bar</code> 的原型就成了 <code>foo</code> 的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bar.__proto__ = foo; // foo is now the prototype of bar.</span></span></code></pre></div><p>于是，我们就可以在 <code>bar</code> 里面访问 <code>foo</code> 的属性了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// If we try to access foo&#39;s properties from bar</span></span>
<span class="line"><span>// from now on, we&#39;ll succeed.</span></span>
<span class="line"><span>bar.one // Resolves to 1.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// The child object&#39;s properties are also accessible.</span></span>
<span class="line"><span>bar.three // Resolves to 3.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Own properties shadow prototype properties</span></span>
<span class="line"><span>bar.name = &quot;bar&quot;;</span></span>
<span class="line"><span>foo.name; // unaffected, resolves to &quot;foo&quot;</span></span>
<span class="line"><span>bar.name; // Resolves to &quot;bar&quot;</span></span></code></pre></div><p>需要解释一下JavaScript的两个东西，一个是 <code>__proto__</code>，另一个是 <code>prototype</code>，这两个东西很容易混淆。这里说明一下：</p><ul><li><p><strong><code>__proto__</code></strong> 主要是安放在一个实际的对象中，用它来产生一个链接，一个原型链，用于寻找方法名或属性，等等。</p></li><li><p><strong><code>prototype</code></strong> 是用 <code>new</code> 来创建一个对象时构造 <code>__proto__</code> 用的。它是构造函数的一个属性。</p></li></ul><p>在JavaScript中，对象有两种表现形式， 一种是 <code>Object</code> ( <a href="http://www.ecma-international.org/ecma-262/5.1/#sec-15.2" target="_blank" rel="noreferrer">ES5关于Object的文档</a>)，一种是 <code>Function</code> （ <a href="http://www.ecma-international.org/ecma-262/5.1/#sec-15.2" target="_blank" rel="noreferrer">ES5关于Function的文档</a>）。</p><p>我们可以简单地认为， <code>__proto__</code> 是所有对象用于链接原型的一个指针，而 <code>prototype</code> 则是 Function 对象的属性，其主要是用来当需要 <code>new</code> 一个对象时让 <code>__proto__</code> 指针所指向的地方。 对于超级对象 <code>Function</code> 而言， <code>Function.__proto__</code> 就是 <code>Function.prototype</code>。</p><p>比如我们有如下的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var a = {</span></span>
<span class="line"><span>  x: 10,</span></span>
<span class="line"><span>  calculate: function (z) {</span></span>
<span class="line"><span>    return this.x + this.y + z;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var b = {</span></span>
<span class="line"><span>  y: 20,</span></span>
<span class="line"><span>  __proto__: a</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var c = {</span></span>
<span class="line"><span>  y: 30,</span></span>
<span class="line"><span>  __proto__: a</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// call the inherited method</span></span>
<span class="line"><span>b.calculate(30); // 60</span></span>
<span class="line"><span>c.calculate(40); // 80</span></span></code></pre></div><p>其中的“原型链”如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2741/a67686c883e8077da6779ae956efdcec.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2741/a67686c883e8077da6779ae956efdcec.png" alt=""></a></p><p>注意：ES5 中，规定原型继承需要使用 <code>Object.create()</code> 函数。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var b = Object.create(a, {y: {value: 20}​});</span></span>
<span class="line"><span>var c = Object.create(a, {y: {value: 30}​});</span></span></code></pre></div><p>好了，我们再来看一段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 一种构造函数写法</span></span>
<span class="line"><span>function Foo(y) {</span></span>
<span class="line"><span>  this.y = y;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 修改 Foo 的 prototype，加入一个成员变量 x</span></span>
<span class="line"><span>Foo.prototype.x = 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 修改 Foo 的 prototype，加入一个成员函数 calculate</span></span>
<span class="line"><span>Foo.prototype.calculate = function (z) {</span></span>
<span class="line"><span>  return this.x + this.y + z;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 现在，我们用 Foo 这个原型来创建 b 和 c</span></span>
<span class="line"><span>var b = new Foo(20);</span></span>
<span class="line"><span>var c = new Foo(30);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用原型中的方法，可以得到正确的值</span></span>
<span class="line"><span>b.calculate(30); // 60</span></span>
<span class="line"><span>c.calculate(40); // 80</span></span></code></pre></div><p>那么，在内存中的布局是怎么样的呢？大概是下面这个样子。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2741/6ca465981ae68f4a055f9ca4f16fdffa.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2741/6ca465981ae68f4a055f9ca4f16fdffa.png" alt=""></a></p><p>这个图应该可以让你很好地看明白 <code>__proto__</code> 和 <code>prototype</code> 的差别了。</p><p>我们可以测试一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>b.__proto__ === Foo.prototype, // true</span></span>
<span class="line"><span>c.__proto__ === Foo.prototype, // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>b.constructor === Foo, // true</span></span>
<span class="line"><span>c.constructor === Foo, // true</span></span>
<span class="line"><span>Foo.prototype.constructor === Foo, // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>b.calculate === b.__proto__.calculate, // true</span></span>
<span class="line"><span>b.__proto__.calculate === Foo.prototype.calculate // true</span></span></code></pre></div><p>这里需要说明的是：</p><p><strong><code>Foo.prototype</code> 自动创建了一个属性 <code>constructor</code>，这是一个指向函数自己的一个reference。这样一来，对于实例 <code>b</code> 或 <code>c</code> 来说，就能访问到这个继承的 <code>constructor</code> 了。</strong></p><p>有了这些基本概念，我们就可以讲一下JavaScript的面向对象编程了。</p><blockquote><p>注： 上面示例和图示来源于 <a href="http://dmitrysoshnikov.com/ecmascript/javascript-the-core/" target="_blank" rel="noreferrer">JavaScript, The Core</a> 一文。</p></blockquote><h1 id="javascript原型编程的面向对象" tabindex="-1">JavaScript原型编程的面向对象 <a class="header-anchor" href="#javascript原型编程的面向对象" aria-label="Permalink to &quot;JavaScript原型编程的面向对象&quot;">​</a></h1><p>我们再来重温一下上面讲述的内容：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function Person(){}</span></span>
<span class="line"><span>var p = new Person();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Person.prototype.name = &quot;Hao Chen&quot;;</span></span>
<span class="line"><span>Person.prototype.sayHello = function(){</span></span>
<span class="line"><span>    console.log(&quot;Hi, I am &quot; + this.name);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(p.name); // &quot;Hao Chen&quot;</span></span>
<span class="line"><span>p.sayHello(); // &quot;Hi, I am Hao Chen&quot;</span></span></code></pre></div><p>在上面这个例子中：</p><ul><li>我们先生成了一个空的函数对象 <code>Person()</code>；</li><li>然后将这个空的函数对象 <code>new</code> 出另一个对象，存在 <code>p</code> 中；</li><li>这时再改变 <code>Person.prototype</code>，让其有一个 <code>name</code> 的属性和一个 <code>sayHello()</code> 的方法；</li><li>我们发现，另外那个 <code>p</code> 的对象也跟着一起改变了。</li></ul><p>注意一下：</p><ul><li>当创建 <code>function Person(){}</code> 时， <code>Person.__proto__</code> 指向 <code>Function.prototype</code>;</li><li>当创建 <code>var p = new Person()</code> 时， <code>p.__proto__</code> 指向 <code>Person.prototype</code>;</li><li>当修改了 <code>Person.prototype</code> 的内容后， <code>p.__proto__</code> 的内容也就被改变了。</li></ul><p>好了，我们再来看一下“原型编程”中面向对象的编程玩法。</p><p>首先，我们定义一个 <code>Person</code> 类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Define human class</span></span>
<span class="line"><span>var Person = function (fullName, email) {</span></span>
<span class="line"><span>  this.fullName = fullName;</span></span>
<span class="line"><span>  this.email = email;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  this.speak = function(){</span></span>
<span class="line"><span>    console.log(&quot;I speak English!&quot;);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  this.introduction = function(){</span></span>
<span class="line"><span>    console.log(&quot;Hi, I am &quot; + this.fullName);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这个对象中，包含了：</p><ul><li>属性： <code>fullName</code> 和 <code>email</code>；</li><li>方法： <code>speak()</code> 和 <code>introduction()</code>。</li></ul><p>其实，所谓的方法也是属性。</p><p>然后，我们可以定义一个 <code>Student</code> 对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Define Student class</span></span>
<span class="line"><span>var Student = function(fullName, email, school, courses) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Person.call(this, fullName, email);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Initialize our Student properties</span></span>
<span class="line"><span>  this.school = school;</span></span>
<span class="line"><span>  this.courses = courses;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // override the &quot;introduction&quot; method</span></span>
<span class="line"><span>  this.introduction= function(){</span></span>
<span class="line"><span>	console.log(&quot;Hi, I am &quot; + this.fullName +</span></span>
<span class="line"><span>				&quot;. I am a student of &quot; + this.school +</span></span>
<span class="line"><span>				&quot;, I study &quot;+ this.courses +&quot;.&quot;);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Add a &quot;exams&quot; method</span></span>
<span class="line"><span>  this.takeExams = function(){</span></span>
<span class="line"><span>    console.log(&quot;This is my exams time!&quot;);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在上面的代码中：</p><ul><li><p>使用了 <code>Person.call(this, fullName, email)</code>， <code>call()</code> 或 <code>apply()</code> 都是为了动态改变 <code>this</code> 所指向的对象的内容而出现的。这里的 <code>this</code> 就是 <code>Student</code>。</p></li><li><p>上面的例子中，我们重载了 <code>introduction()</code> 方法，并新增加了一个 <code>takeExams()</code> 的方法。</p></li></ul><p>虽然，我们这样定义了 <code>Student</code>，但是它还没有和 <code>Person</code> 发生继承关系。为了要让它们发生关系，我们就需要修改 <code>Student</code> 的原型。</p><p>我们可以简单粗暴地做赋值： <code>Student.__proto__ = Person.prototype</code> ，但是，这太粗暴了。</p><p>我们还是使用比较规范的方式：</p><ul><li><p>先用 <code>Object.create()</code> 来将 <code>Person.prototype</code> 和 <code>Student.prototype</code> 关联上。</p></li><li><p>然后，修改一下构造函数 <code>Student.prototype.constructor = Student;</code>。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Create a Student.prototype object that inherits</span></span>
<span class="line"><span>// from Person.prototype.</span></span>
<span class="line"><span>Student.prototype = Object.create(Person.prototype);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Set the &quot;constructor&quot; property to refer to Student</span></span>
<span class="line"><span>Student.prototype.constructor = Student;</span></span></code></pre></div><p>这样，我们就可以这样使用了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var student = new Student(&quot;Hao Chen&quot;,</span></span>
<span class="line"><span>						  &quot;haoel@hotmail.com&quot;,</span></span>
<span class="line"><span>						  &quot;XYZ University&quot;,</span></span>
<span class="line"><span>						  &quot;Computer Science&quot;);</span></span>
<span class="line"><span>student.introduction();</span></span>
<span class="line"><span>student.speak();</span></span>
<span class="line"><span>student.takeExams();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Check that instanceof works correctly</span></span>
<span class="line"><span>console.log(student instanceof Person);  // true</span></span>
<span class="line"><span>console.log(student instanceof Student); // true</span></span></code></pre></div><p>上述就是基于原型的面向对象编程的玩法了。</p><blockquote><p>注：在ECMAScript标准的第四版开始寻求使JavaScript提供基于类的构造，且ECMAScript第六版有提供&quot;class&quot;(类)作为原有的原型架构之上的语法糖，提供构建对象与处理继承时的另一种语法。</p></blockquote><h1 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h1><p>我们可以看到，这种玩法就是一种委托的方式。在使用委托的基于原型的语言中，运行时语言可以“仅仅通过序列的指针找到匹配”这样的方式来定位属性或者寻找正确的数据。所有这些创建行为、共享的行为需要的是委托指针。</p><p>不像是基于类的面向对象语言中类和接口的关系，原型和它的分支之间的关系并不要求子对象有相似的内存结构，因为如此，子对象可以继续修改而无需像基于类的系统那样整理结构。还有一个要提到的地方是，不仅仅是数据，方法也能被修改。因为这个原因，大多数基于原型的语言把数据和方法提作“slots”。</p><p>这种在对象里面直接修改的玩法，虽然这个特性可以带来运行时的灵活性，我们可以在运行时修改一个prototype，给它增加甚至删除属性和方法。但是其带来了执行的不确定性，也有安全性的问题，而代码还变得不可预测，这有点黑科技的味道了。因为这些不像静态类型系统，没有一个不可变的契约对代码的确定性有保证，所以，需要使用者来自己保证。</p><p>以下是《编程范式游记》系列文章的目录，方便你了解这一系列内容的全貌。</p><ul><li><a href="https://time.geekbang.org/column/article/301" target="_blank" rel="noreferrer">01 | 编程范式游记：起源</a></li><li><a href="https://time.geekbang.org/column/article/303" target="_blank" rel="noreferrer">02 | 编程范式游记：泛型编程</a></li><li><a href="https://time.geekbang.org/column/article/2017" target="_blank" rel="noreferrer">03 | 编程范式游记：类型系统和泛型的本质</a></li><li><a href="https://time.geekbang.org/column/article/2711" target="_blank" rel="noreferrer">04 | 编程范式游记：函数式编程</a></li><li><a href="https://time.geekbang.org/column/article/2723" target="_blank" rel="noreferrer">05 | 编程范式游记：修饰器模式</a></li><li><a href="https://time.geekbang.org/column/article/2729" target="_blank" rel="noreferrer">06 | 编程范式游记：面向对象编程</a></li><li><a href="https://time.geekbang.org/column/article/2741" target="_blank" rel="noreferrer">07 | 编程范式游记：基于原型的编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2748" target="_blank" rel="noreferrer">08 | 编程范式游记：Go 语言的委托模式</a></li><li><a href="https://time.geekbang.org/column/article/2751" target="_blank" rel="noreferrer">09 | 编程范式游记：编程的本质</a></li><li><a href="https://time.geekbang.org/column/article/2752" target="_blank" rel="noreferrer">10 | 编程范式游记：逻辑编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2754" target="_blank" rel="noreferrer">11 | 编程范式游记：程序世界里的编程范式</a></li></ul>`,67)])])}const g=s(t,[["render",o]]);export{h as __pageData,g as default};
