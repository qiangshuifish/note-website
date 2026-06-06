import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"33 | 编程范式：函数式编程","description":"","frontmatter":{},"headers":[{"level":2,"title":"传统方式的写法","slug":"传统方式的写法","link":"#传统方式的写法","children":[]},{"level":2,"title":"函数式的写法","slug":"函数式的写法","link":"#函数式的写法","children":[]}],"relativePath":"左耳听风/33-编程范式：函数式编程.md","filePath":"左耳听风/33-编程范式：函数式编程.md","lastUpdated":1779819815000}'),i={name:"左耳听风/33-编程范式：函数式编程.md"};function l(t,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_33-编程范式-函数式编程" tabindex="-1">33 | 编程范式：函数式编程 <a class="header-anchor" href="#_33-编程范式-函数式编程" aria-label="Permalink to &quot;33 | 编程范式：函数式编程&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>从前三章内容中，我们了解到，虽然C语言简单灵活，能够让程序员在高级语言特性之上轻松进行底层上的微观控制，被誉为“高级语言中的汇编语言”，但其基于过程和底层的设计初衷又成了它的短板。</p><p>在程序世界中，编程工作更多的是解决业务上的问题，而不是计算机的问题，我们需要更为贴近业务、更为抽象的语言，如典型的面向对象语言C++和Java等。</p><p>C++很大程度上解决了C语言中的各种问题和不便，尤其是通过类、模板、虚函数和运行时识别等解决了C语言的泛型编程问题。然而，如何做更为抽象的泛型呢？答案就是函数式编程（Functional Programming）。</p><h1 id="函数式编程" tabindex="-1">函数式编程 <a class="header-anchor" href="#函数式编程" aria-label="Permalink to &quot;函数式编程&quot;">​</a></h1><p>相对于计算机的历史而言，函数式编程其实是一个非常古老的概念。函数式编程的基础模型来源于 λ 演算，而 λ 演算并没有被设计在计算机上执行。它是由 Alonzo Church 和 Stephen Cole Kleene 在 20 世纪 30 年代引入的一套用于研究函数定义、函数应用和递归的形式系统。</p><p>如 Alonzo 所说，像 booleans、integers 或者其他的数据结构都可以被函数取代掉。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/7fac133e887bb91f6619887e6a6dcfcd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/7fac133e887bb91f6619887e6a6dcfcd.png" alt=""></a></p><p>我们来看一下函数式编程，它的理念就来自于数学中的代数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>f(x)=5x^2+4x+3</span></span>
<span class="line"><span>g(x)=2f(x)+5=10x^2+8x+11</span></span>
<span class="line"><span>h(x)=f(x)+g(x)=15x^2+12x+14</span></span></code></pre></div><p>假设f(x)是一个函数，g(x)是第二个函数，把f(x)这个函数套下来，并展开。然后还可以定义一个由两个一元函数组合成的二元函数，还可以做递归，下面这个函数定义就是斐波那契数列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>f(x)=f(x-1)+f(x-2)</span></span></code></pre></div><p>对于函数式编程来说，它只关心 <strong>定义输入数据和输出数据相关的关系，数学表达式里面其实是在做一种映射（mapping），输入的数据和输出的数据关系是什么样的，是用函数来定义的</strong>。</p><p>函数式编程有以下特点。</p><p><strong>特征</strong></p><ul><li><strong>stateless</strong>：函数不维护任何状态。函数式编程的核心精神是stateless，简而言之就是它不能存在状态，打个比方，你给我数据我处理完扔出来。里面的数据是不变的。</li><li><strong>immutable</strong>：输入数据是不能动的，动了输入数据就有危险，所以要返回新的数据集。</li></ul><p><strong>优势</strong></p><ul><li>没有状态就没有伤害。</li><li>并行执行无伤害。</li><li>Copy-Paste重构代码无伤害。</li><li>函数的执行没有顺序上的问题。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/134bd812c06ca16d8f29bc40174055a2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/134bd812c06ca16d8f29bc40174055a2.png" alt=""></a></p><p>函数式编程还带来了以下一些好处。</p><ul><li><p><strong>惰性求值</strong>。这需要编译器的支持，表达式不在它被绑定到变量之后就立即求值，而是在该值被取用的时候求值。也就是说，语句如 <code>x:=expression;</code> (把一个表达式的结果赋值给一个变量)显式地调用这个表达式被计算并把结果放置到 <code>x</code> 中，但是先不管实际在 <code>x</code> 中的是什么，直到通过后面的表达式中到 <code>x</code> 的引用而有了对它的值的需求的时候，而后面表达式自身的求值也可以被延迟，最终为了生成让外界看到的某个符号而计算这个快速增长的依赖树。</p></li><li><p><strong>确定性</strong>。所谓确定性，就是像在数学中那样， <code>f(x) = y</code> 这个函数无论在什么场景下，都会得到同样的结果，而不是像程序中的很多函数那样。同一个参数，在不同的场景下会计算出不同的结果，这个我们称之为函数的确定性。所谓不同的场景，就是我们的函数会根据运行中的状态信息的不同而发生变化。</p></li></ul><p>我们知道，因为状态，在并行执行和copy-paste时引发bug的概率是非常高的，所以没有状态就没有伤害，就像没有依赖就没有伤害一样，并行执行无伤害，copy代码无伤害，因为没有状态，代码怎样拷都行。</p><p><strong>劣势</strong></p><ul><li>数据复制比较严重。</li></ul><blockquote><p><strong>注</strong>：有一些人可能会觉得这会对性能造成影响。其实，这个劣势不见得会导致性能不好。因为没有状态，所以代码在并行上根本不需要锁（不需要对状态修改的锁），所以可以拼命地并发，反而可以让性能很不错。比如：Erlang就是其中的代表。</p></blockquote><p>对于纯函数式（也就是完全没有状态的函数）的编程来说，各个语言支持的程度如下：</p><ul><li>完全纯函数式 Haskell</li><li>容易写纯函数 F#, Ocaml, Clojure, Scala</li><li>纯函数需要花点精力 C#, Java, JavaScript</li></ul><p>完全纯函数的语言，很容易写成函数，纯函数需要花精力。只要所谓的纯函数的问题，传进来的数据不改，改完的东西复制一份拷出去，然后没有状态显示。</p><p>但是很多人并不习惯函数式编程，因为函数式编程和过程式编程的思维方式完全不一样。过程式编程是在把具体的流程描述出来，所以可以不假思索，而函数式编程的抽象度更大，在实现方式上，有函数套函数、函数返回函数、函数里定义函数……把人搞得很糊涂。</p><h1 id="函数式编程用到的技术" tabindex="-1">函数式编程用到的技术 <a class="header-anchor" href="#函数式编程用到的技术" aria-label="Permalink to &quot;函数式编程用到的技术&quot;">​</a></h1><p>下面是函数式编程用到的一些技术。</p><ul><li><p><strong>first class function（头等函数）</strong> ：这个技术可以让你的函数就像变量一样来使用。也就是说，你的函数可以像变量一样被创建、修改，并当成变量一样传递、返回，或是在函数中嵌套函数。</p></li><li><p><strong>tail recursion optimization（尾递归优化）</strong> ： 我们知道递归的害处，那就是如果递归很深的话，stack受不了，并会导致性能大幅度下降。因此，我们使用尾递归优化技术——每次递归时都会重用stack，这样能够提升性能。当然，这需要语言或编译器的支持。Python就不支持。</p></li><li><p><strong>map &amp; reduce</strong> ：这个技术不用多说了，函数式编程最常见的技术就是对一个集合做Map和Reduce操作。这比起过程式的语言来说，在代码上要更容易阅读。（传统过程式的语言需要使用for/while循环，然后在各种变量中把数据倒过来倒过去的）这个很像C++ STL中foreach、find_if、count_if等函数的玩法。</p></li><li><p><strong>pipeline（管道）</strong>：这个技术的意思是，将函数实例成一个一个的action，然后将一组action放到一个数组或是列表中，再把数据传给这个action list，数据就像一个pipeline一样顺序地被各个函数所操作，最终得到我们想要的结果。</p></li><li><p><strong>recursing（递归）</strong> ：递归最大的好处就是简化代码，它可以把一个复杂的问题用很简单的代码描述出来。注意：递归的精髓是描述问题，而这正是函数式编程的精髓。</p></li><li><p><strong>currying（柯里化）</strong> ：将一个函数的多个参数分解成多个函数， 然后将函数多层封装起来，每层函数都返回一个函数去接收下一个参数，这可以简化函数的多个参数。在C++中，这很像STL中的bind1st或是bind2nd。</p></li><li><p><strong>higher order function（高阶函数）</strong>：所谓高阶函数就是函数当参数，把传入的函数做一个封装，然后返回这个封装函数。现象上就是函数传进传出，就像面向对象满天飞一样。这个技术用来做 Decorator 很不错。</p></li></ul><p>上面这些技术太抽象了，我们还是从一个最简单的例子开始。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 非函数式，不是pure funciton，有状态</span></span>
<span class="line"><span>int cnt;</span></span>
<span class="line"><span>void increment(){</span></span>
<span class="line"><span>    cnt++;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有个全局变量，调这个全局函数变量++，这里面是有状态的，这个状态在外部。所以，如果是多线程的话，这里面的代码是不安全的。</p><p>如果写成纯函数，应该是下面这个样子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 函数式，pure function， 无状态</span></span>
<span class="line"><span>int increment(int cnt){</span></span>
<span class="line"><span>    return cnt+1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个是你传给我什么，我就返回这个值的+1值，你会发现，代码随便拷，而且与线程无关，代码在并行时候不用锁，因为是复制了原有的数据，并返回了新的数据。</p><p>我们再来看另一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def inc(x):</span></span>
<span class="line"><span>    def incx(y):</span></span>
<span class="line"><span>        return x+y</span></span>
<span class="line"><span>    return incx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>inc2 = inc(2)</span></span>
<span class="line"><span>inc5 = inc(5)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print inc2(5) # 输出 7</span></span>
<span class="line"><span>print inc5(5) # 输出 10</span></span></code></pre></div><p>上面这段Python的代码，开始有点复杂了。我们可以看到上面那个例子 <code>inc()</code> 函数返回了另一个函数 <code>incx()</code>，于是可以用 <code>inc()</code> 函数来构造各种版本的inc函数，比如： <code>inc2()</code> 和 <code>inc5()</code>。这个技术其实就是上面所说的 currying 技术。从这个技术上，你可能体会到函数式编程的理念。</p><ul><li><p><strong>把函数当成变量来用，关注描述问题而不是怎么实现，这样可以让代码更易读</strong>。</p></li><li><p><strong>因为函数返回里面的这个函数，所以函数关注的是表达式，关注的是描述这个问题，而不是怎么实现这个事情</strong>。</p></li></ul><h1 id="lisp-语言介绍" tabindex="-1">Lisp 语言介绍 <a class="header-anchor" href="#lisp-语言介绍" aria-label="Permalink to &quot;Lisp 语言介绍&quot;">​</a></h1><p>要说函数式语言，不可避免地要说一下Lisp。</p><p>下面，我们再来看看Scheme语言（Lisp的一个方言）的函数式玩法。在Scheme里，所有的操作都是函数，包括加减乘除这样的东西。所以，一个表达式是这样的形式—— <em>（函数名 参数1 参数1）</em></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(define (plus x y)  (+ x y))</span></span>
<span class="line"><span>(define (times x y) (* x y))</span></span>
<span class="line"><span>(define (square x)  (times x x))</span></span></code></pre></div><p>上面三个函数：</p><ul><li>用内置的 <code>+</code> 函数定义了一个新的 <code>plus</code> 函数。</li><li>用内置的 <code>*</code> 函数定义了一个新的 <code>times</code> 函数。</li><li>用之前的 <code>times</code> 函数定义了一个 <code>square</code> 函数。</li></ul><p>下面这个函数定义了： f(x) = 5 * x^2 +10</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(define (f1 x) ;;; f(x) = 5 * x^2 + 10</span></span>
<span class="line"><span>    (plus 10 (times 5 (square x))))</span></span></code></pre></div><p>也可以这样定义——使用 lambda 匿名函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(define f2</span></span>
<span class="line"><span>    (lambda (x)</span></span>
<span class="line"><span>        (define plus</span></span>
<span class="line"><span>            (lambda (a b) (+ a b)))</span></span>
<span class="line"><span>        (define times</span></span>
<span class="line"><span>            (lambda (a b) (* a b)))</span></span>
<span class="line"><span>        (plus 10 (times 5 (times x x)))))</span></span></code></pre></div><p>在上面的这个代码里，我们使用 lambda 来定义函数 <code>f2</code> ，然后也同样用 lambda 定义了两个函数—— <code>plus</code> 和 <code>times</code>。 最后，由 <code>(plus 10 (times 5 (times x x)))</code> 定义了 <code>f2</code> 。</p><p>我们再来看一个阶乘的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>;;; recursion</span></span>
<span class="line"><span>(define factoral (lambda (x)</span></span>
<span class="line"><span>    (if (&lt;= x 1) 1</span></span>
<span class="line"><span>        (* x (factoral (- x 1))))))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>(newline)</span></span>
<span class="line"><span>(display(factoral 6))</span></span></code></pre></div><p>下面是另一个版本的，使用了尾递归。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>;;; another version of recursion</span></span>
<span class="line"><span>(define (factoral_x n)</span></span>
<span class="line"><span>    (define (iter product counter)</span></span>
<span class="line"><span>        (if (&lt; counter n)</span></span>
<span class="line"><span>            product</span></span>
<span class="line"><span>            (iter (* counter product) (+ counter 1))))</span></span>
<span class="line"><span>    (iter 1 1))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>(newline)</span></span>
<span class="line"><span>(display(factoral_x 5))</span></span></code></pre></div><h1 id="函数式编程的思维方式" tabindex="-1">函数式编程的思维方式 <a class="header-anchor" href="#函数式编程的思维方式" aria-label="Permalink to &quot;函数式编程的思维方式&quot;">​</a></h1><p>前面提到过多次，函数式编程关注的是：describe what to do, rather than how to do it。于是，我们把以前的过程式编程范式叫做 Imperative Programming – 指令式编程，而把函数式编程范式叫做 Declarative Programming – 声明式编程。</p><h2 id="传统方式的写法" tabindex="-1">传统方式的写法 <a class="header-anchor" href="#传统方式的写法" aria-label="Permalink to &quot;传统方式的写法&quot;">​</a></h2><p>下面我们看一下相关的示例。比如，我们有3辆车比赛，简单起见，我们分别给这3辆车70%的概率让它们可以往前走一步，一共有5次机会，然后打出每一次这3辆车的前行状态。</p><p>对于Imperative Programming来说，代码如下（Python）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from random import random</span></span>
<span class="line"><span></span></span>
<span class="line"><span>time = 5</span></span>
<span class="line"><span>car_positions = [1, 1, 1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while time:</span></span>
<span class="line"><span>    # decrease time</span></span>
<span class="line"><span>    time -= 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print &#39;&#39;</span></span>
<span class="line"><span>    for i in range(len(car_positions)):</span></span>
<span class="line"><span>        # move car</span></span>
<span class="line"><span>        if random() &gt; 0.3:</span></span>
<span class="line"><span>            car_positions[i] += 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # draw car</span></span>
<span class="line"><span>        print &#39;-&#39; * car_positions[i]</span></span></code></pre></div><p>我们可以把这两重循环变成一些函数模块，这样有利于更容易地阅读代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from random import random</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def move_cars():</span></span>
<span class="line"><span>    for i, _ in enumerate(car_positions):</span></span>
<span class="line"><span>        if random() &gt; 0.3:</span></span>
<span class="line"><span>            car_positions[i] += 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def draw_car(car_position):</span></span>
<span class="line"><span>    print &#39;-&#39; * car_position</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def run_step_of_race():</span></span>
<span class="line"><span>    global time</span></span>
<span class="line"><span>    time -= 1</span></span>
<span class="line"><span>    move_cars()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def draw():</span></span>
<span class="line"><span>    print &#39;&#39;</span></span>
<span class="line"><span>    for car_position in car_positions:</span></span>
<span class="line"><span>        draw_car(car_position)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>time = 5</span></span>
<span class="line"><span>car_positions = [1, 1, 1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while time:</span></span>
<span class="line"><span>    run_step_of_race()</span></span>
<span class="line"><span>    draw()</span></span></code></pre></div><p>上面的代码，从主循环开始，我们可以很清楚地看到程序的主干，因为我们把程序的逻辑分成了几个函数。这样一来，代码逻辑就会变成几个小碎片，于是我们读代码时要考虑的上下文就少了很多，阅读代码也会更容易。不像第一个示例，如果没有注释和说明，你还是需要花些时间理解一下。而将代码逻辑封装成了函数后，我们就相当于给每个相对独立的程序逻辑取了个名字，于是代码成了自解释的。</p><p>但是，你会发现，封装成函数后，这些函数都会依赖于共享的变量来同步其状态。于是，在读代码的过程中，每当我们进入到函数里，读到访问了一个外部的变量时，我们马上要去查看这个变量的上下文，然后还要在大脑里推演这个变量的状态， 才能知道程序的真正逻辑。也就是说，这些函数必须知道其它函数是怎么修改它们之间的共享变量的，所以，这些函数是有状态的。</p><h2 id="函数式的写法" tabindex="-1">函数式的写法 <a class="header-anchor" href="#函数式的写法" aria-label="Permalink to &quot;函数式的写法&quot;">​</a></h2><p>我们知道，有状态并不是一件很好的事情，无论是对代码重用，还是对代码的并行来说，都是有副作用的。因此，要想个方法把这些状态搞掉，于是出现了函数式编程的编程范式。下面，我们来看看函数式的方式应该怎么写？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from random import random</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def move_cars(car_positions):</span></span>
<span class="line"><span>    return map(lambda x: x + 1 if random() &gt; 0.3 else x,</span></span>
<span class="line"><span>               car_positions)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def output_car(car_position):</span></span>
<span class="line"><span>    return &#39;-&#39; * car_position</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def run_step_of_race(state):</span></span>
<span class="line"><span>    return {&#39;time&#39;: state[&#39;time&#39;] - 1,</span></span>
<span class="line"><span>            &#39;car_positions&#39;: move_cars(state[&#39;car_positions&#39;])}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def draw(state):</span></span>
<span class="line"><span>    print &#39;&#39;</span></span>
<span class="line"><span>    print &#39;\\n&#39;.join(map(output_car, state[&#39;car_positions&#39;]))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def race(state):</span></span>
<span class="line"><span>    draw(state)</span></span>
<span class="line"><span>    if state[&#39;time&#39;]:</span></span>
<span class="line"><span>        race(run_step_of_race(state))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>race({&#39;time&#39;: 5,</span></span>
<span class="line"><span>      &#39;car_positions&#39;: [1, 1, 1]})</span></span></code></pre></div><p>上面的代码依然把程序的逻辑分成了函数。不过这些函数都是函数式的，它们有三个特点：它们之间没有共享的变量；函数间通过参数和返回值来传递数据；在函数里没有临时变量。</p><p>我们还可以看到，for循环被递归取代了（见race函数）—— 递归是函数式编程中常用到的技术，正如前面所说的，递归的本质就是描述问题是什么。</p><h1 id="函数式语言的三套件" tabindex="-1">函数式语言的三套件 <a class="header-anchor" href="#函数式语言的三套件" aria-label="Permalink to &quot;函数式语言的三套件&quot;">​</a></h1><p>函数式语言有三套件， <strong>Map</strong>、 <strong>Reduce</strong> 和 <strong>Filter</strong>。这在谈C++的泛型编程时已经介绍过。下面我们来看一下Python语言中的一个示例。这个示例的需求是，我们想把一个字符串数组中的字符串都转成小写。</p><p>用常规的面向过程的方式，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 传统的非函数式</span></span>
<span class="line"><span>upname =[&#39;HAO&#39;, &#39;CHEN&#39;, &#39;COOLSHELL&#39;]</span></span>
<span class="line"><span>lowname =[]</span></span>
<span class="line"><span>for i in range(len(upname)):</span></span>
<span class="line"><span>    lowname.append( upname[i].lower() )</span></span></code></pre></div><p>如果写成函数式，用 <code>map()</code> 函数，是下面这个样子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 函数式</span></span>
<span class="line"><span>def toUpper(item):</span></span>
<span class="line"><span>      return item.upper()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>upper_name = map(toUpper, [&quot;hao&quot;, &quot;chen&quot;, &quot;coolshell&quot;])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print upper_name</span></span>
<span class="line"><span># 输出 [&#39;HAO&#39;, &#39;CHEN&#39;, &#39;COOLSHELL&#39;]</span></span></code></pre></div><p>顺便说一下，上面的例子是不是和我们C++语言中的STL的 <code>transform()</code> 函数有些像？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>string s=&quot;hello&quot;;</span></span>
<span class="line"><span>transform(s.begin(), s.end(), back_inserter(out), ::toupper);</span></span></code></pre></div><p>在上面Python的那个例子中可以看到，我们定义了一个函数toUpper，这个函数没有改变传进来的值，只是把传进来的值做个简单的操作，然后返回。然后，我们把它用在map函数中，就可以很清楚地描述出我们想要干什么，而不是去理解一个在循环中怎么实现的代码，最终在读了很多循环的逻辑后才发现是什么意思。</p><p>如果你觉得上面的代码在传统的非函数式的方式下还是很容易读的，那么我们再来看一个计算数组平均值的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 计算数组中正数的平均值</span></span>
<span class="line"><span>num =  [2, -5, 9, 7, -2, 5, 3, 1, 0, -3, 8]</span></span>
<span class="line"><span>positive_num_cnt = 0</span></span>
<span class="line"><span>positive_num_sum = 0</span></span>
<span class="line"><span>for i in range(len(num)):</span></span>
<span class="line"><span>    if num[i] &gt; 0:</span></span>
<span class="line"><span>        positive_num_cnt += 1</span></span>
<span class="line"><span>        positive_num_sum += num[i]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if positive_num_cnt &gt; 0:</span></span>
<span class="line"><span>    average = positive_num_sum / positive_num_cnt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print average</span></span></code></pre></div><p>上面的代码如果没有注释的话，你需要看一会儿才能明白，只是计算数组中正数的平均值。</p><p>我们再来看看函数式下使用 filter/reduce 函数的玩法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#计算数组中正数的平均值</span></span>
<span class="line"><span>positive_num = filter(lambda x: x&gt;0, num)</span></span>
<span class="line"><span>average = reduce(lambda x,y: x+y, positive_num) / len( positive_num )</span></span></code></pre></div><p>首先，我们使用 filter 函数把正数过滤出来（注意： <code>lambda x : x&gt;0</code> 这个lambda表达式），保存在一个新的数组中 —— <code>positive_num</code>。然后，我们使用 reduce 函数对数组 <code>positive_num</code> 求和后，再除以其个数，就得到正数的平均值了。</p><p>我们可以看到， <strong>隐藏了数组遍历并过滤数组控制流程的 filter 和 reduce， 不仅让代码更为简洁，因为代码里只有业务逻辑了，而且让我们能更容易地理解代码</strong>。</p><ol><li>对 <code>num</code> 数组 <code>filter</code> 条件 <code>x &gt; 0</code> 的数据。</li><li>然后对 <code>positive_num</code> 进行 <code>x + y</code> 操作的 reduce，即求和。</li><li>……</li></ol><p>感觉代码更亲切了，不是吗？因为：</p><ul><li>数据集、对数据的操作和返回值都放在了一起。</li><li>没有了循环体，就可以少了些临时用来控制程序执行逻辑的变量，也少了把数据倒来倒去的控制逻辑。</li><li><strong>代码变成了在描述你要干什么，而不是怎么干</strong>。</li></ul><p>当然，如果你是第一次见到 map/reduce/filter，那你可能还是会有点儿陌生和不解，这只是你不了解罢了。</p><p>对于函数式编程的思路，下图是一个比较形象的例子，面包和蔬菜map到切碎的操作上，再把结果给reduce成汉堡。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/bf01b67b872021c5e159683c61250a45.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/bf01b67b872021c5e159683c61250a45.jpg" alt=""></a></p><p>在这个图中， <strong>我们可以看到map和reduce不关心源输入数据，它们只是控制，并不是业务。控制是描述怎么干，而业务是描述要干什么</strong>。</p><h1 id="函数式的pipeline模式" tabindex="-1">函数式的pipeline模式 <a class="header-anchor" href="#函数式的pipeline模式" aria-label="Permalink to &quot;函数式的pipeline模式&quot;">​</a></h1><p>pipeline（管道）借鉴于Unix Shell的管道操作——把若干个命令串起来，前面命令的输出成为后面命令的输入，如此完成一个流式计算。（注：管道绝对是一个伟大的发明，它的设计哲学就是KISS – 让每个功能就做一件事，并把这件事做到极致，软件或程序的拼装会变得更为简单和直观。这个设计理念影响非常深远，包括今天的Web Service、云计算，以及大数据的流式计算等。）</p><p>比如，我们如下的shell命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ps auwwx | awk &#39;{print $2}&#39; | sort -n | xargs echo</span></span></code></pre></div><p>上面的例子是要查看一个用户执行的进程列表，列出来以后，然后取第二列，第二列是它的进程ID，排个序，再把它显示出来。</p><p>抽象成函数式的样子，我们就可以反过来，一层套一层。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xargs(  echo, sort(n, awk(&#39;print $2&#39;, ps(auwwx)))  )</span></span></code></pre></div><p>我们也可以把函数放进数组里面，然后顺序执行一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pids = for_each(result, [ps_auwwx, awk_p2, sort_n, xargs_echo])</span></span></code></pre></div><p>多说一句，如果我们把这些函数比作微服务，那么管道这个事是在干什么呢？其实就是在做服务的编排。像Unix这些经典的技术上的实践或理论，往往是可以反映到分布式架构的，所以，一般来说，一个好的分布式架构师，通常都是对这些传统的微观上的经典技术有非常深刻的认识，因为这些东西在方法论上都是相通的。</p><p>好了，还是让我们用一个简单的示例来看一下如何实现pipeline。</p><p>我们先来看一个程序，这个程序的process()有三个步骤：</p><ol><li>找出偶数；</li><li>乘以3；</li><li>转成字符串返回。</li></ol><p>传统的非函数式的实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def process(num):</span></span>
<span class="line"><span>    # filter out non-evens</span></span>
<span class="line"><span>    if num % 2 != 0:</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    num = num * 3</span></span>
<span class="line"><span>    num = &#39;The Number: %s&#39; % num</span></span>
<span class="line"><span>    return num</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for num in nums:</span></span>
<span class="line"><span>    print process(num)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出：</span></span>
<span class="line"><span># None</span></span>
<span class="line"><span># The Number: 6</span></span>
<span class="line"><span># None</span></span>
<span class="line"><span># The Number: 12</span></span>
<span class="line"><span># None</span></span>
<span class="line"><span># The Number: 18</span></span>
<span class="line"><span># None</span></span>
<span class="line"><span># The Number: 24</span></span>
<span class="line"><span># None</span></span>
<span class="line"><span># The Number: 30</span></span></code></pre></div><p>我们可以看到，输出的结果并不够完美，另外，代码阅读上如果没有注释，你也会比较晕。下面，我们来看看函数式的pipeline（第一种方式）应该怎么写？</p><p>第一步，我们先把三个“子需求”写成函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def even_filter(nums):</span></span>
<span class="line"><span>    for num in nums:</span></span>
<span class="line"><span>        if num % 2 == 0:</span></span>
<span class="line"><span>            yield num</span></span>
<span class="line"><span>def multiply_by_three(nums):</span></span>
<span class="line"><span>    for num in nums:</span></span>
<span class="line"><span>        yield num * 3</span></span>
<span class="line"><span>def convert_to_string(nums):</span></span>
<span class="line"><span>    for num in nums:</span></span>
<span class="line"><span>        yield &#39;The Number: %s&#39; % num</span></span></code></pre></div><p>然后，我们再把这三个函数串起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</span></span>
<span class="line"><span>pipeline = convert_to_string(multiply_by_three(even_filter(nums)))</span></span>
<span class="line"><span>for num in pipeline:</span></span>
<span class="line"><span>    print num</span></span>
<span class="line"><span># 输出：</span></span>
<span class="line"><span># The Number: 6</span></span>
<span class="line"><span># The Number: 12</span></span>
<span class="line"><span># The Number: 18</span></span>
<span class="line"><span># The Number: 24</span></span>
<span class="line"><span># The Number: 30</span></span></code></pre></div><p>上面，我们动用了Python的关键字 yield，它是一个类似 return 的关键字，只是这个函数返回的是Generator（生成器）。所谓生成器，指的是yield返回的是一个可迭代的对象，并没有真正的执行函数。也就是说，只有其返回的迭代对象被迭代时，yield函数才会真正运行，运行到yield语句时就会停住，然后等下一次的迭代。（ yield 是个比较诡异的关键字）这就是lazy evluation（懒惰加载）。</p><p>好了，根据前面的原则——“ <strong>使用Map &amp; Reduce，不要使用循环</strong>”（还记得吗？使用循环会让我们只能使用顺序型的数据结构），那我们用比较纯朴的Map &amp; Reduce吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def even_filter(nums):</span></span>
<span class="line"><span>    return filter(lambda x: x%2==0, nums)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def multiply_by_three(nums):</span></span>
<span class="line"><span>    return map(lambda x: x*3, nums)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def convert_to_string(nums):</span></span>
<span class="line"><span>    return map(lambda x: &#39;The Number: %s&#39; % x,  nums)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</span></span>
<span class="line"><span>pipeline = convert_to_string(</span></span>
<span class="line"><span>               multiply_by_three(</span></span>
<span class="line"><span>                   even_filter(nums)</span></span>
<span class="line"><span>               )</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>for num in pipeline:</span></span>
<span class="line"><span>    print num</span></span></code></pre></div><p>上面的代码是不是更容易读了，但需要嵌套使用函数，这个有点儿令人不爽，如果我们能像下面这个样子就好了（第二种方式）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipeline_func(nums, [even_filter,</span></span>
<span class="line"><span>                     multiply_by_three,</span></span>
<span class="line"><span>                     convert_to_string])</span></span></code></pre></div><p>可以看到，其实，就是对一堆函数做一个reduce， 于是，pipeline函数可以实现成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def pipeline_func(data, fns):</span></span>
<span class="line"><span>    return reduce(lambda a, x: x(a),   fns,   data)</span></span></code></pre></div><p>当然，使用Python的 <code>force</code> 函数以及decorator模式可以把上面的代码写得更像管道：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Pipe(object):</span></span>
<span class="line"><span>    def __init__(self, func):</span></span>
<span class="line"><span>        self.func = func</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __ror__(self, other):</span></span>
<span class="line"><span>        def generator():</span></span>
<span class="line"><span>            for obj in other:</span></span>
<span class="line"><span>                if obj is not None:</span></span>
<span class="line"><span>                    yield self.func(obj)</span></span>
<span class="line"><span>        return generator()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Pipe</span></span>
<span class="line"><span>def even_filter(num):</span></span>
<span class="line"><span>    return num if num % 2 == 0 else None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Pipe</span></span>
<span class="line"><span>def multiply_by_three(num):</span></span>
<span class="line"><span>    return num*3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Pipe</span></span>
<span class="line"><span>def convert_to_string(num):</span></span>
<span class="line"><span>    return &#39;The Number: %s&#39; % num</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Pipe</span></span>
<span class="line"><span>def echo(item):</span></span>
<span class="line"><span>    print item</span></span>
<span class="line"><span>    return item</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def force(sqs):</span></span>
<span class="line"><span>    for item in sqs: pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>force(nums | even_filter | multiply_by_three | convert_to_string | echo)</span></span></code></pre></div><h1 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h1><p>相对于计算机发展史，函数式编程是个非常古老的概念，它的核心思想是将运算过程尽量写成一系列嵌套的函数调用，关注的是做什么而不是怎么做，因而被称为声明式编程。以Stateless（无状态）和Immutable（不可变）为主要特点，代码简洁，易于理解，能便于进行并行执行，易于做代码重构，函数执行没有顺序上的问题，支持惰性求值，具有函数的确定性——无论在什么场景下都会得到同样的结果。</p><p>这一讲我们结合递归、map和reduce，以及pipeline等技术，对比了非函数式编程和函数式编程在解决相同问题时的不同处理思路，让你对函数式编程范式有了清晰明确的认知。并在文末引入了decorator（修饰器），使得将普通函数管道化成为一件轻而易举的事情。此时你可能有疑问，decorator到底是什么呢？怎样使用它呢？敬请关注下一章中的内容，来得到这些答案。</p><p>了解了这么多函数式编程的知识，想请你深入思考一个问题：你是偏好在命令式编程语言中使用函数式编程风格呢，还是坚持使用函数式语言编程？原因是什么？欢迎在评论区留言和我一起探讨。</p><p>以下是《编程范式游记》系列文章的目录，方便你了解这一系列内容的全貌。*</p><ul><li><a href="https://time.geekbang.org/column/article/301" target="_blank" rel="noreferrer">01 | 编程范式游记：起源</a></li><li><a href="https://time.geekbang.org/column/article/303" target="_blank" rel="noreferrer">02 | 编程范式游记：泛型编程</a></li><li><a href="https://time.geekbang.org/column/article/2017" target="_blank" rel="noreferrer">03 | 编程范式游记：类型系统和泛型的本质</a></li><li><a href="https://time.geekbang.org/column/article/2711" target="_blank" rel="noreferrer">04 | 编程范式游记：函数式编程</a></li><li><a href="https://time.geekbang.org/column/article/2723" target="_blank" rel="noreferrer">05 | 编程范式游记：修饰器模式</a></li><li><a href="https://time.geekbang.org/column/article/2729" target="_blank" rel="noreferrer">06 | 编程范式游记：面向对象编程</a></li><li><a href="https://time.geekbang.org/column/article/2741" target="_blank" rel="noreferrer">07 | 编程范式游记：基于原型的编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2748" target="_blank" rel="noreferrer">08 | 编程范式游记：Go 语言的委托模式</a></li><li><a href="https://time.geekbang.org/column/article/2751" target="_blank" rel="noreferrer">09 | 编程范式游记：编程的本质</a></li><li><a href="https://time.geekbang.org/column/article/2752" target="_blank" rel="noreferrer">10 | 编程范式游记：逻辑编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2754" target="_blank" rel="noreferrer">11 | 编程范式游记：程序世界里的编程范式</a></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/40341574317cc135385c6946a17d2818.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/2711/40341574317cc135385c6946a17d2818.jpg" alt=""></a></p><p><a href="https://time.geekbang.org/activity/sale-poster?utm_source=geektime&amp;utm_medium=chenhao&amp;utm_campaign=201803&amp;utm_content=chenhaofxbanner" target="_blank" rel="noreferrer">戳此获取你的专属海报</a></p>`,133)])])}const g=n(i,[["render",l]]);export{h as __pageData,g as default};
