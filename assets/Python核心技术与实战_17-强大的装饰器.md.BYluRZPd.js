import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"17 | 强大的装饰器","description":"","frontmatter":{},"headers":[{"level":2,"title":"函数->装饰器","slug":"函数-装饰器","link":"#函数-装饰器","children":[{"level":3,"title":"函数核心回顾","slug":"函数核心回顾","link":"#函数核心回顾","children":[]},{"level":3,"title":"简单的装饰器","slug":"简单的装饰器","link":"#简单的装饰器","children":[]},{"level":3,"title":"带有参数的装饰器","slug":"带有参数的装饰器","link":"#带有参数的装饰器","children":[]},{"level":3,"title":"带有自定义参数的装饰器","slug":"带有自定义参数的装饰器","link":"#带有自定义参数的装饰器","children":[]},{"level":3,"title":"原函数还是原函数吗？","slug":"原函数还是原函数吗","link":"#原函数还是原函数吗","children":[]},{"level":3,"title":"类装饰器","slug":"类装饰器","link":"#类装饰器","children":[]},{"level":3,"title":"装饰器的嵌套","slug":"装饰器的嵌套","link":"#装饰器的嵌套","children":[]}]},{"level":2,"title":"装饰器用法实例","slug":"装饰器用法实例","link":"#装饰器用法实例","children":[{"level":3,"title":"身份认证","slug":"身份认证","link":"#身份认证","children":[]},{"level":3,"title":"日志记录","slug":"日志记录","link":"#日志记录","children":[]},{"level":3,"title":"输入合理性检查","slug":"输入合理性检查","link":"#输入合理性检查","children":[]},{"level":3,"title":"缓存","slug":"缓存","link":"#缓存","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/17-强大的装饰器.md","filePath":"Python核心技术与实战/17-强大的装饰器.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/17-强大的装饰器.md"};function i(c,s,t,r,o,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_17-强大的装饰器" tabindex="-1">17 | 强大的装饰器 <a class="header-anchor" href="#_17-强大的装饰器" aria-label="Permalink to &quot;17 | 强大的装饰器&quot;">​</a></h1><p>你好，我是景霄。这节课，我们一起来学习装饰器。</p><p>装饰器一直以来都是Python中很有用、很经典的一个feature，在工程中的应用也十分广泛，比如日志、缓存等等的任务都会用到。然而，在平常工作生活中，我发现不少人，尤其是初学者，常常因为其相对复杂的表示，对装饰器望而生畏，认为它“too fancy to learn”，实际并不如此。</p><p>今天这节课，我会以前面所讲的函数、闭包为切入点，引出装饰器的概念、表达和基本用法，最后，再通过实际工程中的例子，让你再次加深理解。</p><p>接下来，让我们进入正文一起学习吧！</p><h2 id="函数-装饰器" tabindex="-1">函数-&gt;装饰器 <a class="header-anchor" href="#函数-装饰器" aria-label="Permalink to &quot;函数-&gt;装饰器&quot;">​</a></h2><h3 id="函数核心回顾" tabindex="-1">函数核心回顾 <a class="header-anchor" href="#函数核心回顾" aria-label="Permalink to &quot;函数核心回顾&quot;">​</a></h3><p>引入装饰器之前，我们首先一起来复习一下，必须掌握的函数的几个核心概念。</p><p>第一点，我们要知道，在Python中，函数是一等公民（first-class citizen），函数也是对象。我们可以把函数赋予变量，比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def func(message):</span></span>
<span class="line"><span>    print(&#39;Got a message: {}&#39;.format(message))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>send_message = func</span></span>
<span class="line"><span>send_message(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Got a message: hello world</span></span></code></pre></div><p>这个例子中，我们把函数func赋予了变量send_message，这样之后你调用send_message，就相当于是调用函数func()。</p><p>第二点，我们可以把函数当作参数，传入另一个函数中，比如下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def get_message(message):</span></span>
<span class="line"><span>    return &#39;Got a message: &#39; + message</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def root_call(func, message):</span></span>
<span class="line"><span>    print(func(message))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>root_call(get_message, &#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Got a message: hello world</span></span></code></pre></div><p>这个例子中，我们就把函数get_message以参数的形式，传入了函数root_call()中然后调用它。</p><p>第三点，我们可以在函数里定义函数，也就是函数的嵌套。这里我同样举了一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def func(message):</span></span>
<span class="line"><span>    def get_message(message):</span></span>
<span class="line"><span>        print(&#39;Got a message: {}&#39;.format(message))</span></span>
<span class="line"><span>    return get_message(message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Got a message: hello world</span></span></code></pre></div><p>这段代码中，我们在函数func()里又定义了新的函数get_message()，调用后作为func()的返回值返回。</p><p>第四点，要知道，函数的返回值也可以是函数对象（闭包），比如下面这个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def func_closure():</span></span>
<span class="line"><span>    def get_message(message):</span></span>
<span class="line"><span>        print(&#39;Got a message: {}&#39;.format(message))</span></span>
<span class="line"><span>    return get_message</span></span>
<span class="line"><span></span></span>
<span class="line"><span>send_message = func_closure()</span></span>
<span class="line"><span>send_message(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Got a message: hello world</span></span></code></pre></div><p>这里，函数func_closure()的返回值是函数对象get_message本身，之后，我们将其赋予变量send_message，再调用send_message(‘hello world’)，最后输出了 <code>&#39;Got a message: hello world&#39;</code>。</p><h3 id="简单的装饰器" tabindex="-1">简单的装饰器 <a class="header-anchor" href="#简单的装饰器" aria-label="Permalink to &quot;简单的装饰器&quot;">​</a></h3><p>简单的复习之后，我们接下来学习今天的新知识——装饰器。按照习惯，我们可以先来看一个装饰器的简单例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_decorator(func):</span></span>
<span class="line"><span>    def wrapper():</span></span>
<span class="line"><span>        print(&#39;wrapper of decorator&#39;)</span></span>
<span class="line"><span>        func()</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def greet():</span></span>
<span class="line"><span>    print(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>greet = my_decorator(greet)</span></span>
<span class="line"><span>greet()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>wrapper of decorator</span></span>
<span class="line"><span>hello world</span></span></code></pre></div><p>这段代码中，变量greet指向了内部函数wrapper()，而内部函数wrapper()中又会调用原函数greet()，因此，最后调用greet()时，就会先打印 <code>&#39;wrapper of decorator&#39;</code>，然后输出 <code>&#39;hello world&#39;</code>。</p><p>这里的函数my_decorator()就是一个装饰器，它把真正需要执行的函数greet()包裹在其中，并且改变了它的行为，但是原函数greet()不变。</p><p>事实上，上述代码在Python中有更简单、更优雅的表示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_decorator(func):</span></span>
<span class="line"><span>    def wrapper():</span></span>
<span class="line"><span>        print(&#39;wrapper of decorator&#39;)</span></span>
<span class="line"><span>        func()</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;my_decorator</span></span>
<span class="line"><span>def greet():</span></span>
<span class="line"><span>    print(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>greet()</span></span></code></pre></div><p>这里的 <code>@</code>，我们称之为语法糖， <code>@my_decorator</code> 就相当于前面的 <code>greet=my_decorator(greet)</code> 语句，只不过更加简洁。因此，如果你的程序中有其它函数需要做类似的装饰，你只需在它们的上方加上 <code>@decorator</code> 就可以了，这样就大大提高了函数的重复利用和程序的可读性。</p><h3 id="带有参数的装饰器" tabindex="-1">带有参数的装饰器 <a class="header-anchor" href="#带有参数的装饰器" aria-label="Permalink to &quot;带有参数的装饰器&quot;">​</a></h3><p>你或许会想到，如果原函数greet()中，有参数需要传递给装饰器怎么办？</p><p>一个简单的办法，是可以在对应的装饰器函数wrapper()上，加上相应的参数，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_decorator(func):</span></span>
<span class="line"><span>    def wrapper(message):</span></span>
<span class="line"><span>        print(&#39;wrapper of decorator&#39;)</span></span>
<span class="line"><span>        func(message)</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;my_decorator</span></span>
<span class="line"><span>def greet(message):</span></span>
<span class="line"><span>    print(message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>greet(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>wrapper of decorator</span></span>
<span class="line"><span>hello world</span></span></code></pre></div><p>不过，新的问题来了。如果我另外还有一个函数，也需要使用my_decorator()装饰器，但是这个新的函数有两个参数，又该怎么办呢？比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;my_decorator</span></span>
<span class="line"><span>def celebrate(name, message):</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>事实上，通常情况下，我们会把 <code>*args</code> 和 <code>**kwargs</code>，作为装饰器内部函数wrapper()的参数。 <code>*args</code> 和 <code>**kwargs</code>，表示接受任意数量和类型的参数，因此装饰器就可以写成下面的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def my_decorator(func):</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        print(&#39;wrapper of decorator&#39;)</span></span>
<span class="line"><span>        func(*args, **kwargs)</span></span>
<span class="line"><span>    return wrapper</span></span></code></pre></div><h3 id="带有自定义参数的装饰器" tabindex="-1">带有自定义参数的装饰器 <a class="header-anchor" href="#带有自定义参数的装饰器" aria-label="Permalink to &quot;带有自定义参数的装饰器&quot;">​</a></h3><p>其实，装饰器还有更大程度的灵活性。刚刚说了，装饰器可以接受原函数任意类型和数量的参数，除此之外，它还可以接受自己定义的参数。</p><p>举个例子，比如我想要定义一个参数，来表示装饰器内部函数被执行的次数，那么就可以写成下面这种形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def repeat(num):</span></span>
<span class="line"><span>    def my_decorator(func):</span></span>
<span class="line"><span>        def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>            for i in range(num):</span></span>
<span class="line"><span>                print(&#39;wrapper of decorator&#39;)</span></span>
<span class="line"><span>                func(*args, **kwargs)</span></span>
<span class="line"><span>        return wrapper</span></span>
<span class="line"><span>    return my_decorator</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;repeat(4)</span></span>
<span class="line"><span>def greet(message):</span></span>
<span class="line"><span>    print(message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>greet(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出：</span></span>
<span class="line"><span>wrapper of decorator</span></span>
<span class="line"><span>hello world</span></span>
<span class="line"><span>wrapper of decorator</span></span>
<span class="line"><span>hello world</span></span>
<span class="line"><span>wrapper of decorator</span></span>
<span class="line"><span>hello world</span></span>
<span class="line"><span>wrapper of decorator</span></span>
<span class="line"><span>hello world</span></span></code></pre></div><h3 id="原函数还是原函数吗" tabindex="-1">原函数还是原函数吗？ <a class="header-anchor" href="#原函数还是原函数吗" aria-label="Permalink to &quot;原函数还是原函数吗？&quot;">​</a></h3><p>现在，我们再来看个有趣的现象。还是之前的例子，我们试着打印出greet()函数的一些元信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>greet.__name__</span></span>
<span class="line"><span>## 输出</span></span>
<span class="line"><span>&#39;wrapper&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>help(greet)</span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>Help on function wrapper in module __main__:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>wrapper(*args, **kwargs)</span></span></code></pre></div><p>你会发现，greet()函数被装饰以后，它的元信息变了。元信息告诉我们“它不再是以前的那个greet()函数，而是被wrapper()函数取代了”。</p><p>为了解决这个问题，我们通常使用内置的装饰器 <code>@functools.wrap</code>，它会帮助保留原函数的元信息（也就是将原函数的元信息，拷贝到对应的装饰器函数里）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import functools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def my_decorator(func):</span></span>
<span class="line"><span>    &amp;#64;functools.wraps(func)</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        print(&#39;wrapper of decorator&#39;)</span></span>
<span class="line"><span>        func(*args, **kwargs)</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;my_decorator</span></span>
<span class="line"><span>def greet(message):</span></span>
<span class="line"><span>    print(message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>greet.__name__</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>&#39;greet&#39;</span></span></code></pre></div><h3 id="类装饰器" tabindex="-1">类装饰器 <a class="header-anchor" href="#类装饰器" aria-label="Permalink to &quot;类装饰器&quot;">​</a></h3><p>前面我们主要讲了函数作为装饰器的用法，实际上，类也可以作为装饰器。类装饰器主要依赖于函数 <code>__call__()</code>，每当你调用一个类的示例时，函数 <code>__call__()</code> 就会被执行一次。</p><p>我们来看下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Count:</span></span>
<span class="line"><span>    def __init__(self, func):</span></span>
<span class="line"><span>        self.func = func</span></span>
<span class="line"><span>        self.num_calls = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __call__(self, *args, **kwargs):</span></span>
<span class="line"><span>        self.num_calls += 1</span></span>
<span class="line"><span>        print(&#39;num of calls is: {}&#39;.format(self.num_calls))</span></span>
<span class="line"><span>        return self.func(*args, **kwargs)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Count</span></span>
<span class="line"><span>def example():</span></span>
<span class="line"><span>    print(&quot;hello world&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>example()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>num of calls is: 1</span></span>
<span class="line"><span>hello world</span></span>
<span class="line"><span></span></span>
<span class="line"><span>example()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>num of calls is: 2</span></span>
<span class="line"><span>hello world</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span></code></pre></div><p>这里，我们定义了类Count，初始化时传入原函数func()，而 <code>__call__()</code> 函数表示让变量num_calls自增1，然后打印，并且调用原函数。因此，在我们第一次调用函数example()时，num_calls的值是1，而在第二次调用时，它的值变成了2。</p><h3 id="装饰器的嵌套" tabindex="-1">装饰器的嵌套 <a class="header-anchor" href="#装饰器的嵌套" aria-label="Permalink to &quot;装饰器的嵌套&quot;">​</a></h3><p>回顾刚刚讲的例子，基本都是一个装饰器的情况，但实际上，Python也支持多个装饰器，比如写成下面这样的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;decorator1</span></span>
<span class="line"><span>&amp;#64;decorator2</span></span>
<span class="line"><span>&amp;#64;decorator3</span></span>
<span class="line"><span>def func():</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>它的执行顺序从里到外，所以上面的语句也等效于下面这行代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>decorator1(decorator2(decorator3(func)))</span></span></code></pre></div><p>这样， <code>&#39;hello world&#39;</code> 这个例子，就可以改写成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import functools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def my_decorator1(func):</span></span>
<span class="line"><span>    &amp;#64;functools.wraps(func)</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        print(&#39;execute decorator1&#39;)</span></span>
<span class="line"><span>        func(*args, **kwargs)</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def my_decorator2(func):</span></span>
<span class="line"><span>    &amp;#64;functools.wraps(func)</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        print(&#39;execute decorator2&#39;)</span></span>
<span class="line"><span>        func(*args, **kwargs)</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;my_decorator1</span></span>
<span class="line"><span>&amp;#64;my_decorator2</span></span>
<span class="line"><span>def greet(message):</span></span>
<span class="line"><span>    print(message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>greet(&#39;hello world&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出</span></span>
<span class="line"><span>execute decorator1</span></span>
<span class="line"><span>execute decorator2</span></span>
<span class="line"><span>hello world</span></span></code></pre></div><h2 id="装饰器用法实例" tabindex="-1">装饰器用法实例 <a class="header-anchor" href="#装饰器用法实例" aria-label="Permalink to &quot;装饰器用法实例&quot;">​</a></h2><p>到此，装饰器的基本概念及用法我就讲完了，接下来，我将结合实际工作中的几个例子，带你加深对它的理解。</p><h3 id="身份认证" tabindex="-1">身份认证 <a class="header-anchor" href="#身份认证" aria-label="Permalink to &quot;身份认证&quot;">​</a></h3><p>首先是最常见的身份认证的应用。这个很容易理解，举个最常见的例子，你登录微信，需要输入用户名密码，然后点击确认，这样，服务器端便会查询你的用户名是否存在、是否和密码匹配等等。如果认证通过，你就可以顺利登录；如果不通过，就抛出异常并提示你登录失败。</p><p>再比如一些网站，你不登录也可以浏览内容，但如果你想要发布文章或留言，在点击发布时，服务器端便会查询你是否登录。如果没有登录，就不允许这项操作等等。</p><p>我们来看一个大概的代码示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import functools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def authenticate(func):</span></span>
<span class="line"><span>    &amp;#64;functools.wraps(func)</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        request = args[0]</span></span>
<span class="line"><span>        if check_user_logged_in(request): # 如果用户处于登录状态</span></span>
<span class="line"><span>            return func(*args, **kwargs) # 执行函数post_comment()</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            raise Exception(&#39;Authentication failed&#39;)</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;authenticate</span></span>
<span class="line"><span>def post_comment(request, ...)</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>这段代码中，我们定义了装饰器authenticate；而函数post_comment()，则表示发表用户对某篇文章的评论。每次调用这个函数前，都会先检查用户是否处于登录状态，如果是登录状态，则允许这项操作；如果没有登录，则不允许。</p><h3 id="日志记录" tabindex="-1">日志记录 <a class="header-anchor" href="#日志记录" aria-label="Permalink to &quot;日志记录&quot;">​</a></h3><p>日志记录同样是很常见的一个案例。在实际工作中，如果你怀疑某些函数的耗时过长，导致整个系统的latency（延迟）增加，所以想在线上测试某些函数的执行时间，那么，装饰器就是一种很常用的手段。</p><p>我们通常用下面的方法来表示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import time</span></span>
<span class="line"><span>import functools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def log_execution_time(func):</span></span>
<span class="line"><span>    &amp;#64;functools.wraps(func)</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        start = time.perf_counter()</span></span>
<span class="line"><span>        res = func(*args, **kwargs)</span></span>
<span class="line"><span>        end = time.perf_counter()</span></span>
<span class="line"><span>        print(&#39;{} took {} ms&#39;.format(func.__name__, (end - start) * 1000))</span></span>
<span class="line"><span>        return res</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;log_execution_time</span></span>
<span class="line"><span>def calculate_similarity(items):</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>这里，装饰器log_execution_time记录某个函数的运行时间，并返回其执行结果。如果你想计算任何函数的执行时间，在这个函数上方加上 <code>@log_execution_time</code> 即可。</p><h3 id="输入合理性检查" tabindex="-1">输入合理性检查 <a class="header-anchor" href="#输入合理性检查" aria-label="Permalink to &quot;输入合理性检查&quot;">​</a></h3><p>再来看今天要讲的第三个应用，输入合理性检查。</p><p>在大型公司的机器学习框架中，我们调用机器集群进行模型训练前，往往会用装饰器对其输入（往往是很长的JSON文件）进行合理性检查。这样就可以大大避免，输入不正确对机器造成的巨大开销。</p><p>它的写法往往是下面的格式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import functools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def validation_check(input):</span></span>
<span class="line"><span>    &amp;#64;functools.wraps(func)</span></span>
<span class="line"><span>    def wrapper(*args, **kwargs):</span></span>
<span class="line"><span>        ... # 检查输入是否合法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;validation_check</span></span>
<span class="line"><span>def neural_network_training(param1, param2, ...):</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>其实在工作中，很多情况下都会出现输入不合理的现象。因为我们调用的训练模型往往很复杂，输入的文件有成千上万行，很多时候确实也很难发现。</p><p>试想一下，如果没有输入的合理性检查，很容易出现“模型训练了好几个小时后，系统却报错说输入的一个参数不对，成果付之一炬”的现象。这样的“惨案”，大大减缓了开发效率，也对机器资源造成了巨大浪费。</p><h3 id="缓存" tabindex="-1">缓存 <a class="header-anchor" href="#缓存" aria-label="Permalink to &quot;缓存&quot;">​</a></h3><p>最后，我们来看缓存方面的应用。关于缓存装饰器的用法，其实十分常见，这里我以Python内置的LRU cache为例来说明（如果你不了解 <a href="https://en.wikipedia.org/wiki/Cache_replacement_policies#Examples" target="_blank" rel="noreferrer">LRU cache</a>，可以点击链接自行查阅）。</p><p>LRU cache，在Python中的表示形式是 <code>@lru_cache</code>。 <code>@lru_cache</code> 会缓存进程中的函数参数和结果，当缓存满了以后，会删除least recenly used 的数据。</p><p>正确使用缓存装饰器，往往能极大地提高程序运行效率。为什么呢？我举一个常见的例子来说明。</p><p>大型公司服务器端的代码中往往存在很多关于设备的检查，比如你使用的设备是安卓还是iPhone，版本号是多少。这其中的一个原因，就是一些新的feature，往往只在某些特定的手机系统或版本上才有（比如Android v200+）。</p><p>这样一来，我们通常使用缓存装饰器，来包裹这些检查函数，避免其被反复调用，进而提高程序运行效率，比如写成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;lru_cache</span></span>
<span class="line"><span>def check(param1, param2, ...) # 检查用户设备类型，版本号等等</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我们一起学习了装饰器的概念及用法。 <strong>所谓的装饰器，其实就是通过装饰器函数，来修改原函数的一些功能，使得原函数不需要修改。</strong></p><blockquote><p>Decorators is to modify the behavior of the function through a wrapper so we don’t have to actually modify the function.</p></blockquote><p>而实际工作中，装饰器通常运用在身份认证、日志记录、输入合理性检查以及缓存等多个领域中。合理使用装饰器，往往能极大地提高程序的可读性以及运行效率。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>那么，你平时工作中，通常会在哪些情况下使用装饰器呢？欢迎留言和我讨论，也欢迎你把这篇文章分享给你的同事、朋友，一起在交流中进步。</p>`,91)])])}const g=a(l,[["render",i]]);export{u as __pageData,g as default};
