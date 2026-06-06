import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"34 | 编程范式：修饰器模式","description":"","frontmatter":{},"headers":[],"relativePath":"左耳听风/34-编程范式：修饰器模式.md","filePath":"左耳听风/34-编程范式：修饰器模式.md","lastUpdated":1779819815000}'),l={name:"左耳听风/34-编程范式：修饰器模式.md"};function t(i,n,c,o,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_34-编程范式-修饰器模式" tabindex="-1">34 | 编程范式：修饰器模式 <a class="header-anchor" href="#_34-编程范式-修饰器模式" aria-label="Permalink to &quot;34 | 编程范式：修饰器模式&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>在上一讲中，我们领略了函数式编程的趣味和魅力，主要讲了函数式编程的主要技术。还记得有哪些吗？递归、Map、Reduce、Filter等，并利用Python的Decorator和Generator功能，将多个函数组合成了管道。</p><p>此时，你心中可能会有个疑问，这个decorator又是怎样工作的呢？这就是本文中要讲述的内容，“Decorator模式”，又叫“修饰器模式”，或是“装饰器模式”。</p><h1 id="python的decorator" tabindex="-1">Python的Decorator <a class="header-anchor" href="#python的decorator" aria-label="Permalink to &quot;Python的Decorator&quot;">​</a></h1><p>Python的Decorator在使用上和Java的Annotation（以及C#的Attribute）很相似，就是在方法名前面加一个@XXX注解来为这个方法装饰一些东西。但是，Java/C#的Annotation也很让人望而却步，太过于复杂了。你要玩它，需要先了解一堆Annotation的类库文档，感觉几乎就是在学另外一门语言。</p><p>而Python使用了一种相对于Decorator Pattern和Annotation来说非常优雅的方法，这种方法不需要你去掌握什么复杂的OO模型或是Annotation的各种类库规定，完全就是语言层面的玩法：一种函数式编程的技巧。</p><p>这是我最喜欢的一个模式了，也是一个挺好玩儿的东西，这个模式动用了函数式编程的一个技术——用一个函数来构造另一个函数。</p><p>好了，我们先来点感性认识，看一个Python修饰器的Hello World代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def hello(fn):</span></span>
<span class="line"><span>    def wrapper():</span></span>
<span class="line"><span>        print &quot;hello, %s&quot; % fn.__name__</span></span>
<span class="line"><span>        fn()</span></span>
<span class="line"><span>        print &quot;goodbye, %s&quot; % fn.__name__</span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@hello</span></span>
<span class="line"><span>def Hao():</span></span>
<span class="line"><span>    print &quot;i am Hao Chen&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Hao()</span></span></code></pre></div><p>代码的执行结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ python hello.py</span></span>
<span class="line"><span>hello, Hao</span></span>
<span class="line"><span>i am Hao Chen</span></span>
<span class="line"><span>goodbye, Hao</span></span></code></pre></div><p>你可以看到如下的东西：</p><ol><li><p>函数 <code>Hao</code> 前面有个@hello的“注解”， <code>hello</code> 就是我们前面定义的函数 <code>hello</code>；</p></li><li><p>在 <code>hello</code> 函数中，其需要一个 <code>fn</code> 的参数（这就是用来做回调的函数）；</p></li><li><p>hello函数中返回了一个inner函数 <code>wrapper</code>，这个 <code>wrapper</code> 函数回调了传进来的 <code>fn</code>，并在回调前后加了两条语句。</p></li></ol><p>对于Python的这个@注解语法糖（Syntactic sugar）来说，当你在用某个@decorator来修饰某个函数 <code>func</code> 时，如下所示:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@decorator</span></span>
<span class="line"><span>def func():</span></span>
<span class="line"><span>    pass</span></span></code></pre></div><p>其解释器会解释成下面这样的语句：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func = decorator(func)</span></span></code></pre></div><p>嘿！这不就是把一个函数当参数传到另一个函数中，然后再回调吗？是的。但是，我们需要注意，那里还有一个赋值语句，把decorator这个函数的返回值赋值回了原来的 <code>func</code>。</p><p>我们再来看一个带参数的玩法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def makeHtmlTag(tag, *args, **kwds):</span></span>
<span class="line"><span>    def real_decorator(fn):</span></span>
<span class="line"><span>        css_class = &quot; class=&#39;{0}&#39;&quot;.format(kwds[&quot;css_class&quot;]) \\</span></span>
<span class="line"><span>                                     if &quot;css_class&quot; in kwds else &quot;&quot;</span></span>
<span class="line"><span>        def wrapped(*args, **kwds):</span></span>
<span class="line"><span>            return &quot;&lt;&quot;+tag+css_class+&quot;&gt;&quot; + fn(*args, **kwds) + &quot;&lt;/&quot;+tag+&quot;&gt;&quot;</span></span>
<span class="line"><span>        return wrapped</span></span>
<span class="line"><span>    return real_decorator</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@makeHtmlTag(tag=&quot;b&quot;, css_class=&quot;bold_css&quot;)</span></span>
<span class="line"><span>@makeHtmlTag(tag=&quot;i&quot;, css_class=&quot;italic_css&quot;)</span></span>
<span class="line"><span>def hello():</span></span>
<span class="line"><span>    return &quot;hello world&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print hello()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出：</span></span>
<span class="line"><span># &lt;​b class=&#39;bold_css&#39;&gt;&lt;​i class=&#39;italic_css&#39;&gt;hello world&lt;​/i&gt;&lt;​/b&gt;</span></span></code></pre></div><p>在上面这个例子中，我们可以看到： <code>makeHtmlTag</code> 有两个参数。所以，为了让 <code>hello = makeHtmlTag(arg1, arg2)(hello)</code> 成功， <code>makeHtmlTag</code> 必需返回一个decorator（这就是为什么我们在 <code>makeHtmlTag</code> 中加入了 <code>real_decorator()</code>）。</p><p>这样一来，我们就可以进入到decorator的逻辑中去了——decorator得返回一个wrapper，wrapper里回调 <code>hello</code>。看似那个 <code>makeHtmlTag()</code> 写得层层叠叠，但是，已经了解了本质的我们觉得写得很自然。</p><p>我们再来看一个为其它函数加缓存的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from functools import wraps</span></span>
<span class="line"><span>def memoization(fn):</span></span>
<span class="line"><span>    cache = {}</span></span>
<span class="line"><span>    miss = object()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @wraps(fn)</span></span>
<span class="line"><span>    def wrapper(*args):</span></span>
<span class="line"><span>        result = cache.get(args, miss)</span></span>
<span class="line"><span>        if result is miss:</span></span>
<span class="line"><span>            result = fn(*args)</span></span>
<span class="line"><span>            cache[args] = result</span></span>
<span class="line"><span>        return result</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@memoization</span></span>
<span class="line"><span>def fib(n):</span></span>
<span class="line"><span>    if n &lt; 2:</span></span>
<span class="line"><span>        return n</span></span>
<span class="line"><span>    return fib(n - 1) + fib(n - 2)</span></span></code></pre></div><p>上面这个例子中，是一个斐波那契数列的递归算法。我们知道，这个递归是相当没有效率的，因为会重复调用。比如：我们要计算fib(5)，于是其分解成 <code>fib(4) + fib(3)</code>，而 <code>fib(4)</code> 分解成 <code>fib(3) + fib(2)</code>， <code>fib(3)</code> 又分解成 <code>fib(2) + fib(1)</code>……你可以看到，基本上来说， <code>fib(3)</code>、 <code>fib(2)</code>、 <code>fib(1)</code> 在整个递归过程中被调用了至少两次。</p><p>而我们用decorator，在调用函数前查询一下缓存，如果没有才调用，有了就从缓存中返回值。一下子，这个递归从二叉树式的递归成了线性的递归。 <code>wraps</code> 的作用是保证 <code>fib</code> 的函数名不被 <code>wrapper</code> 所取代。</p><p>除此之外，Python还支持类方式的decorator。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class myDecorator(object):</span></span>
<span class="line"><span>    def __init__(self, fn):</span></span>
<span class="line"><span>        print &quot;inside myDecorator.__init__()&quot;</span></span>
<span class="line"><span>        self.fn = fn</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __call__(self):</span></span>
<span class="line"><span>        self.fn()</span></span>
<span class="line"><span>        print &quot;inside myDecorator.__call__()&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@myDecorator</span></span>
<span class="line"><span>def aFunction():</span></span>
<span class="line"><span>    print &quot;inside aFunction()&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print &quot;Finished decorating aFunction()&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>aFunction()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出：</span></span>
<span class="line"><span># inside myDecorator.__init__()</span></span>
<span class="line"><span># Finished decorating aFunction()</span></span>
<span class="line"><span># inside aFunction()</span></span>
<span class="line"><span># inside myDecorator.__call__()</span></span></code></pre></div><p>上面这个示例展示了，用类的方式声明一个decorator。我们可以看到这个类中有两个成员：</p><ol><li>一个是 <code>__init__()</code>，这个方法是在我们给某个函数decorate时被调用，所以，需要有一个 <code>fn</code> 的参数，也就是被decorate的函数。</li><li>一个是 <code>__call__()</code>，这个方法是在我们调用被decorate的函数时被调用的。</li></ol><p>从上面的输出中，可以看到整个程序的执行顺序，这看上去要比“函数式”的方式更易读一些。</p><p>我们来看一个实际点的例子，下面这个示例展示了通过URL的路由来调用相关注册的函数示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MyApp():</span></span>
<span class="line"><span>    def __init__(self):</span></span>
<span class="line"><span>        self.func_map = {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def register(self, name):</span></span>
<span class="line"><span>        def func_wrapper(func):</span></span>
<span class="line"><span>            self.func_map[name] = func</span></span>
<span class="line"><span>            return func</span></span>
<span class="line"><span>        return func_wrapper</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def call_method(self, name=None):</span></span>
<span class="line"><span>        func = self.func_map.get(name, None)</span></span>
<span class="line"><span>        if func is None:</span></span>
<span class="line"><span>            raise Exception(&quot;No function registered against - &quot; + str(name))</span></span>
<span class="line"><span>        return func()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app = MyApp()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.register(&#39;/&#39;)</span></span>
<span class="line"><span>def main_page_func():</span></span>
<span class="line"><span>    return &quot;This is the main page.&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.register(&#39;/next_page&#39;)</span></span>
<span class="line"><span>def next_page_func():</span></span>
<span class="line"><span>    return &quot;This is the next page.&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print app.call_method(&#39;/&#39;)</span></span>
<span class="line"><span>print app.call_method(&#39;/next_page&#39;)</span></span></code></pre></div><p>注意：上面这个示例中decorator类不是真正的decorator，其中也没有 <code>__call__()</code>，并且，wrapper返回了原函数。所以，原函数没有发生任何变化。</p><h1 id="go语言的decorator" tabindex="-1">Go语言的Decorator <a class="header-anchor" href="#go语言的decorator" aria-label="Permalink to &quot;Go语言的Decorator&quot;">​</a></h1><p>Python有语法糖，所以写出来的代码比较酷。但是对于没有修饰器语法糖这类语言，写出来的代码会是怎么样的？我们来看一下Go语言的代码。</p><p>还是从一个Hello World开始。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func decorator(f func(s string)) func(s string) {</span></span>
<span class="line"><span>    return func(s string) {</span></span>
<span class="line"><span>        fmt.Println(&quot;Started&quot;)</span></span>
<span class="line"><span>        f(s)</span></span>
<span class="line"><span>        fmt.Println(&quot;Done&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Hello(s string) {</span></span>
<span class="line"><span>    fmt.Println(s)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    decorator(Hello)(&quot;Hello, World!&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，我们动用了一个高阶函数 <code>decorator()</code>，在调用的时候，先把 <code>Hello()</code> 函数传进去，然后其返回一个匿名函数。这个匿名函数中除了运行了自己的代码，也调用了被传入的 <code>Hello()</code> 函数。</p><p>这个玩法和Python的异曲同工，只不过，Go并不支持像Python那样的@decorator语法糖。所以，在调用上有些难看。当然，如果要想让代码容易读一些，你可以这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>hello := decorator(Hello)</span></span>
<span class="line"><span>hello(&quot;Hello&quot;)</span></span></code></pre></div><p>我们再来看一个为函数log消耗时间的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type SumFunc func(int64, int64) int64</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func getFunctionName(i interface{}) string {</span></span>
<span class="line"><span>    return runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func timedSumFunc(f SumFunc) SumFunc {</span></span>
<span class="line"><span>    return func(start, end int64) int64 {</span></span>
<span class="line"><span>        defer func(t time.Time) {</span></span>
<span class="line"><span>            fmt.Printf(&quot;--- Time Elapsed (%s): %v ---\\n&quot;,</span></span>
<span class="line"><span>                getFunctionName(f), time.Since(t))</span></span>
<span class="line"><span>        }(time.Now())</span></span>
<span class="line"><span>        return f(start, end)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Sum1(start, end int64) int64 {</span></span>
<span class="line"><span>    var sum int64</span></span>
<span class="line"><span>    sum = 0</span></span>
<span class="line"><span>    if start &gt; end {</span></span>
<span class="line"><span>        start, end = end, start</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for i := start; i &lt;= end; i++ {</span></span>
<span class="line"><span>        sum += i</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Sum2(start, end int64) int64 {</span></span>
<span class="line"><span>    if start &gt; end {</span></span>
<span class="line"><span>        start, end = end, start</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return (end - start + 1) * (end + start) / 2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sum1 := timedSumFunc(Sum1)</span></span>
<span class="line"><span>    sum2 := timedSumFunc(Sum2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fmt.Printf(&quot;%d, %d\\n&quot;, sum1(-10000, 10000000), sum2(-10000, 10000000))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于上面的代码：</p><ul><li><p>有两个 Sum 函数， <code>Sum1()</code> 函数就是简单地做个循环， <code>Sum2()</code> 函数动用了数据公式。（注意： <code>start</code> 和 <code>end</code> 有可能有负数的情况。）</p></li><li><p>代码中使用了Go语言的反射机制来获取函数名。</p></li><li><p>修饰器函数是 <code>timedSumFunc()</code>。</p></li></ul><p>再来看一个 HTTP 路由的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func WithServerHeader(h http.HandlerFunc) http.HandlerFunc {</span></span>
<span class="line"><span>    return func(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>        log.Println(&quot;---&gt;WithServerHeader()&quot;)</span></span>
<span class="line"><span>        w.Header().Set(&quot;Server&quot;, &quot;HelloServer v0.0.1&quot;)</span></span>
<span class="line"><span>        h(w, r)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithAuthCookie(h http.HandlerFunc) http.HandlerFunc {</span></span>
<span class="line"><span>    return func(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>        log.Println(&quot;---&gt;WithAuthCookie()&quot;)</span></span>
<span class="line"><span>        cookie := &amp;http.Cookie{Name: &quot;Auth&quot;, Value: &quot;Pass&quot;, Path: &quot;/&quot;}</span></span>
<span class="line"><span>        http.SetCookie(w, cookie)</span></span>
<span class="line"><span>        h(w, r)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithBasicAuth(h http.HandlerFunc) http.HandlerFunc {</span></span>
<span class="line"><span>    return func(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>        log.Println(&quot;---&gt;WithBasicAuth()&quot;)</span></span>
<span class="line"><span>        cookie, err := r.Cookie(&quot;Auth&quot;)</span></span>
<span class="line"><span>        if err != nil || cookie.Value != &quot;Pass&quot; {</span></span>
<span class="line"><span>            w.WriteHeader(http.StatusForbidden)</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        h(w, r)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithDebugLog(h http.HandlerFunc) http.HandlerFunc {</span></span>
<span class="line"><span>    return func(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>        log.Println(&quot;---&gt;WithDebugLog&quot;)</span></span>
<span class="line"><span>        r.ParseForm()</span></span>
<span class="line"><span>        log.Println(r.Form)</span></span>
<span class="line"><span>        log.Println(&quot;path&quot;, r.URL.Path)</span></span>
<span class="line"><span>        log.Println(&quot;scheme&quot;, r.URL.Scheme)</span></span>
<span class="line"><span>        log.Println(r.Form[&quot;url_long&quot;])</span></span>
<span class="line"><span>        for k, v := range r.Form {</span></span>
<span class="line"><span>            log.Println(&quot;key:&quot;, k)</span></span>
<span class="line"><span>            log.Println(&quot;val:&quot;, strings.Join(v, &quot;&quot;))</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        h(w, r)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func hello(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>    log.Printf(&quot;Received Request %s from %s\\n&quot;, r.URL.Path, r.RemoteAddr)</span></span>
<span class="line"><span>    fmt.Fprintf(w, &quot;Hello, World! &quot;+r.URL.Path)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码中，我们写了多个函数。有写HTTP响应头的，有写认证Cookie的，有检查认证Cookie的，有打日志的……在使用过程中，我们可以把其嵌套起来使用，在修饰过的函数上继续修饰，这样就可以拼装出更复杂的功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v1/hello&quot;, WithServerHeader(WithAuthCookie(hello)))</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v2/hello&quot;, WithServerHeader(WithBasicAuth(hello)))</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v3/hello&quot;, WithServerHeader(WithBasicAuth(WithDebugLog(hello))))</span></span>
<span class="line"><span>    err := http.ListenAndServe(&quot;:8080&quot;, nil)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(&quot;ListenAndServe: &quot;, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，如果一层套一层不好看的话，我们可以使用pipeline的玩法，需要先写一个工具函数——用来遍历并调用各个decorator：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type HttpHandlerDecorator func(http.HandlerFunc) http.HandlerFunc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Handler(h http.HandlerFunc, decors ...HttpHandlerDecorator) http.HandlerFunc {</span></span>
<span class="line"><span>    for i := range decors {</span></span>
<span class="line"><span>        d := decors[len(decors)-1-i] // iterate in reverse</span></span>
<span class="line"><span>        h = d(h)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return h</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们就可以像下面这样使用了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http.HandleFunc(&quot;/v4/hello&quot;, Handler(hello,</span></span>
<span class="line"><span>                WithServerHeader, WithBasicAuth, WithDebugLog))</span></span></code></pre></div><p>这样的代码是不是更易读了一些？pipeline的功能也就出来了。</p><p>不过，对于Go的修饰器模式，还有一个小问题——好像无法做到泛型，就像上面那个计算时间的函数一样，它的代码耦合了需要被修饰的函数的接口类型，无法做到非常通用。如果这个事解决不了，那么，这个修饰器模式还是有点不好用的。</p><p>因为Go语言不像Python和Java，Python是动态语言，而Java有语言虚拟机，所以它们可以干许多比较变态的事儿，然而Go语言是一个静态的语言，这意味着其类型需要在编译时就要搞定，否则无法编译。不过，Go语言支持的最大的泛型是interface{}，还有比较简单的Reflection机制，在上面做做文章，应该还是可以搞定的。</p><p>废话不说，下面是我用Reflection机制写的一个比较通用的修饰器（为了便于阅读，我删除了出错判断代码）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Decorator(decoPtr, fn interface{}) (err error) {</span></span>
<span class="line"><span>    var decoratedFunc, targetFunc reflect.Value</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    decoratedFunc = reflect.ValueOf(decoPtr).Elem()</span></span>
<span class="line"><span>    targetFunc = reflect.ValueOf(fn)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    v := reflect.MakeFunc(targetFunc.Type(),</span></span>
<span class="line"><span>        func(in []reflect.Value) (out []reflect.Value) {</span></span>
<span class="line"><span>            fmt.Println(&quot;before&quot;)</span></span>
<span class="line"><span>            out = targetFunc.Call(in)</span></span>
<span class="line"><span>            fmt.Println(&quot;after&quot;)</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    decoratedFunc.Set(v)</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码动用了 <code>reflect.MakeFunc()</code> 函数制作出了一个新的函数，其中的 <code>targetFunc.Call(in)</code> 调用了被修饰的函数。关于Go语言的反射机制，推荐官方文章——《 <a href="https://blog.golang.org/laws-of-reflection" target="_blank" rel="noreferrer">The Laws of Reflection</a>》，在这里我不多说了。</p><p>上面这个 <code>Decorator()</code> 需要两个参数：</p><ul><li>第一个是出参 <code>decoPtr</code> ，就是完成修饰后的函数。</li><li>第二个是入参 <code>fn</code> ，就是需要修饰的函数。</li></ul><p>这样写是不是有些二？的确是的。不过，这是我个人在Go语言里所能写出来的最好的代码了。如果你知道更优雅的写法，请你一定告诉我！</p><p>好的，让我们来看一下使用效果。首先，假设我们有两个需要修饰的函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func foo(a, b, c int) int {</span></span>
<span class="line"><span>    fmt.Printf(&quot;%d, %d, %d \\n&quot;, a, b, c)</span></span>
<span class="line"><span>    return a + b + c</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bar(a, b string) string {</span></span>
<span class="line"><span>    fmt.Printf(&quot;%s, %s \\n&quot;, a, b)</span></span>
<span class="line"><span>    return a + b</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们可以这样做：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type MyFoo func(int, int, int) int</span></span>
<span class="line"><span>var myfoo MyFoo</span></span>
<span class="line"><span>Decorator(&amp;myfoo, foo)</span></span>
<span class="line"><span>myfoo(1, 2, 3)</span></span></code></pre></div><p>你会发现，使用 <code>Decorator()</code> 时，还需要先声明一个函数签名，感觉好傻啊。一点都不泛型，不是吗？谁叫这是有类型的静态编译的语言呢？</p><p>嗯。如果你不想声明函数签名，那么也可以这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mybar := bar</span></span>
<span class="line"><span>Decorator(&amp;mybar, bar)</span></span>
<span class="line"><span>mybar(&quot;hello,&quot;, &quot;world!&quot;)</span></span></code></pre></div><p>好吧，看上去不是那么得漂亮，但是it does work。看样子Go语言目前本身的特性无法做成像Java或Python那样，对此，我们只能多求Go语言多放糖了！</p><h1 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h1><p>好了，讲了那么多的例子，看了那么多的代码，我估计你可能有点晕，让我们来做个小结吧。</p><p>通过上面Python和Go修饰器的例子，我们可以看到，所谓的修饰器模式其实是在做下面的几件事。</p><ul><li><p>表面上看，修饰器模式就是扩展现有的一个函数的功能，让它可以干一些其他的事，或是在现有的函数功能上再附加上一些别的功能。</p></li><li><p>除了我们可以感受到 <strong>函数式编程</strong> 下的代码扩展能力，我们还能感受到函数的互相和随意拼装带来的好处。</p></li><li><p>但是深入看一下，我们不难发现，Decorator这个函数其实是可以修饰几乎所有的函数的。于是，这种可以通用于其它函数的编程方式，可以很容易地将一些非业务功能的、属于控制类型的代码给抽象出来（所谓的控制类型的代码就是像for-loop，或是打日志，或是函数路由，或是求函数运行时间之类的非业务功能性的代码）。</p></li></ul><p>以下是《编程范式游记》系列文章的目录，方便你了解这一系列内容的全貌。</p><ul><li><a href="https://time.geekbang.org/column/article/301" target="_blank" rel="noreferrer">01 | 编程范式游记：起源</a></li><li><a href="https://time.geekbang.org/column/article/303" target="_blank" rel="noreferrer">02 | 编程范式游记：泛型编程</a></li><li><a href="https://time.geekbang.org/column/article/2017" target="_blank" rel="noreferrer">03 | 编程范式游记：类型系统和泛型的本质</a></li><li><a href="https://time.geekbang.org/column/article/2711" target="_blank" rel="noreferrer">04 | 编程范式游记：函数式编程</a></li><li><a href="https://time.geekbang.org/column/article/2723" target="_blank" rel="noreferrer">05 | 编程范式游记：修饰器模式</a></li><li><a href="https://time.geekbang.org/column/article/2729" target="_blank" rel="noreferrer">06 | 编程范式游记：面向对象编程</a></li><li><a href="https://time.geekbang.org/column/article/2741" target="_blank" rel="noreferrer">07 | 编程范式游记：基于原型的编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2748" target="_blank" rel="noreferrer">08 | 编程范式游记：Go 语言的委托模式</a></li><li><a href="https://time.geekbang.org/column/article/2751" target="_blank" rel="noreferrer">09 | 编程范式游记：编程的本质</a></li><li><a href="https://time.geekbang.org/column/article/2752" target="_blank" rel="noreferrer">10 | 编程范式游记：逻辑编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2754" target="_blank" rel="noreferrer">11 | 编程范式游记：程序世界里的编程范式</a></li></ul>`,77)])])}const g=s(l,[["render",t]]);export{h as __pageData,g as default};
