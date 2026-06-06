import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"113 | Go编程模式：修饰器","description":"","frontmatter":{},"headers":[{"level":2,"title":"简单示例","slug":"简单示例","link":"#简单示例","children":[]},{"level":2,"title":"HTTP 相关的一个示例","slug":"http-相关的一个示例","link":"#http-相关的一个示例","children":[]},{"level":2,"title":"多个修饰器的 Pipeline","slug":"多个修饰器的-pipeline","link":"#多个修饰器的-pipeline","children":[]},{"level":2,"title":"泛型的修饰器","slug":"泛型的修饰器","link":"#泛型的修饰器","children":[]}],"relativePath":"左耳听风/113-Go编程模式：修饰器.md","filePath":"左耳听风/113-Go编程模式：修饰器.md","lastUpdated":1779819815000}'),l={name:"左耳听风/113-Go编程模式：修饰器.md"};function t(i,n,c,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_113-go编程模式-修饰器" tabindex="-1">113 | Go编程模式：修饰器 <a class="header-anchor" href="#_113-go编程模式-修饰器" aria-label="Permalink to &quot;113 | Go编程模式：修饰器&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>之前，我写过一篇文章《 <a href="https://coolshell.cn/articles/11265.html" target="_blank" rel="noreferrer">Python修饰器的函数式编程</a>》，这种模式可以很轻松地把一些函数装配到另外一些函数上，让你的代码更加简单，也可以让一些“小功能型”的代码复用性更高，让代码中的函数可以像乐高玩具那样自由地拼装。</p><p>所以，一直以来，我都对修饰器（Decoration）这种编程模式情有独钟，这节课，我们就来聊聊Go语言的修饰器编程模式。</p><p>如果你看过我刚说的文章，就一定知道，这是一种函数式编程的玩法——用一个高阶函数来包装一下。</p><p>多唠叨一句，关于函数式编程，我之前还写过一篇文章《 <a href="https://coolshell.cn/articles/10822.html" target="_blank" rel="noreferrer">函数式编程</a>》，这篇文章主要是想通过详细介绍从过程式编程的思维方式过渡到函数式编程的思维方式，带动更多的人玩函数式编程。所以，如果你想了解一下函数式编程，那么可以点击链接阅读一下这篇文章。其实，Go语言的修饰器编程模式，也就是函数式编程的模式。</p><p>不过，要提醒你注意的是，Go 语言的“糖”不多，而且又是强类型的静态无虚拟机的语言，所以，没有办法做到像 Java 和 Python 那样写出优雅的修饰器的代码。当然，也许是我才疏学浅，如果你知道更多的写法，请你一定告诉我。先谢过了。</p><h2 id="简单示例" tabindex="-1">简单示例 <a class="header-anchor" href="#简单示例" aria-label="Permalink to &quot;简单示例&quot;">​</a></h2><p>我们先来看一个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func decorator(f func(s string)) func(s string) {</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span>        decorator(Hello)(&quot;Hello, World!&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，我们动用了一个高阶函数 <code>decorator()</code>，在调用的时候，先把 <code>Hello()</code> 函数传进去，然后会返回一个匿名函数。这个匿名函数中除了运行了自己的代码，也调用了被传入的 <code>Hello()</code> 函数。</p><p>这个玩法和 Python 的异曲同工，只不过，有些遗憾的是，Go 并不支持像 Python 那样的 <code>@decorator</code> 语法糖。所以，在调用上有些难看。当然，如果你想让代码更容易读，你可以这样写：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>hello := decorator(Hello)</span></span>
<span class="line"><span>hello(&quot;Hello&quot;)</span></span></code></pre></div><p>我们再来看一个计算运行时间的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>  &quot;fmt&quot;</span></span>
<span class="line"><span>  &quot;reflect&quot;</span></span>
<span class="line"><span>  &quot;runtime&quot;</span></span>
<span class="line"><span>  &quot;time&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type SumFunc func(int64, int64) int64</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func getFunctionName(i interface{}) string {</span></span>
<span class="line"><span>  return runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func timedSumFunc(f SumFunc) SumFunc {</span></span>
<span class="line"><span>  return func(start, end int64) int64 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    defer func(t time.Time) {</span></span>
<span class="line"><span>      fmt.Printf(&quot;--- Time Elapsed (%s): %v ---\\n&quot;,</span></span>
<span class="line"><span>          getFunctionName(f), time.Since(t))</span></span>
<span class="line"><span>    }(time.Now())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return f(start, end)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Sum1(start, end int64) int64 {</span></span>
<span class="line"><span>  var sum int64</span></span>
<span class="line"><span>  sum = 0</span></span>
<span class="line"><span>  if start &gt; end {</span></span>
<span class="line"><span>    start, end = end, start</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for i := start; i &lt;= end; i++ {</span></span>
<span class="line"><span>    sum += i</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Sum2(start, end int64) int64 {</span></span>
<span class="line"><span>  if start &gt; end {</span></span>
<span class="line"><span>    start, end = end, start</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return (end - start + 1) * (end + start) / 2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  sum1 := timedSumFunc(Sum1)</span></span>
<span class="line"><span>  sum2 := timedSumFunc(Sum2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  fmt.Printf(&quot;%d, %d\\n&quot;, sum1(-10000, 10000000), sum2(-10000, 10000000))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于这段代码，有几点我要说明一下：</p><ol><li>有两个 Sum 函数， <code>Sum1()</code> 函数就是简单地做个循环， <code>Sum2()</code> 函数动用了数据公式（注意：start 和 end 有可能有负数）；</li><li>代码中使用了 Go 语言的反射机制来获取函数名；</li><li>修饰器函数是 <code>timedSumFunc()</code>。</li></ol><p>运行后输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run time.sum.go</span></span>
<span class="line"><span>--- Time Elapsed (main.Sum1): 3.557469ms ---</span></span>
<span class="line"><span>--- Time Elapsed (main.Sum2): 291ns ---</span></span>
<span class="line"><span>49999954995000, 49999954995000</span></span></code></pre></div><h2 id="http-相关的一个示例" tabindex="-1">HTTP 相关的一个示例 <a class="header-anchor" href="#http-相关的一个示例" aria-label="Permalink to &quot;HTTP 相关的一个示例&quot;">​</a></h2><p>接下来，我们再看一个处理 HTTP 请求的相关例子。</p><p>先看一个简单的 HTTP Server 的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;net/http&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithServerHeader(h http.HandlerFunc) http.HandlerFunc {</span></span>
<span class="line"><span>    return func(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>        log.Println(&quot;---&gt;WithServerHeader()&quot;)</span></span>
<span class="line"><span>        w.Header().Set(&quot;Server&quot;, &quot;HelloServer v0.0.1&quot;)</span></span>
<span class="line"><span>        h(w, r)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func hello(w http.ResponseWriter, r *http.Request) {</span></span>
<span class="line"><span>    log.Printf(&quot;Recieved Request %s from %s\\n&quot;, r.URL.Path, r.RemoteAddr)</span></span>
<span class="line"><span>    fmt.Fprintf(w, &quot;Hello, World! &quot;+r.URL.Path)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v1/hello&quot;, WithServerHeader(hello))</span></span>
<span class="line"><span>    err := http.ListenAndServe(&quot;:8080&quot;, nil)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(&quot;ListenAndServe: &quot;, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码中使用到了修饰器模式， <code>WithServerHeader()</code> 函数就是一个 Decorator，它会传入一个 <code>http.HandlerFunc</code>，然后返回一个改写的版本。这个例子还是比较简单的，用 <code>WithServerHeader()</code> 就可以加入一个 Response 的 Header。</p><p>所以，这样的函数我们可以写出好多。如下所示，有写 HTTP 响应头的，有写认证 Cookie 的，有检查认证Cookie的，有打日志的……</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;net/http&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithServerHeader(h http.HandlerFunc) http.HandlerFunc {</span></span>
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
<span class="line"><span>    log.Printf(&quot;Recieved Request %s from %s\\n&quot;, r.URL.Path, r.RemoteAddr)</span></span>
<span class="line"><span>    fmt.Fprintf(w, &quot;Hello, World! &quot;+r.URL.Path)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v1/hello&quot;, WithServerHeader(WithAuthCookie(hello)))</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v2/hello&quot;, WithServerHeader(WithBasicAuth(hello)))</span></span>
<span class="line"><span>    http.HandleFunc(&quot;/v3/hello&quot;, WithServerHeader(WithBasicAuth(WithDebugLog(hello))))</span></span>
<span class="line"><span>    err := http.ListenAndServe(&quot;:8080&quot;, nil)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(&quot;ListenAndServe: &quot;, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="多个修饰器的-pipeline" tabindex="-1">多个修饰器的 Pipeline <a class="header-anchor" href="#多个修饰器的-pipeline" aria-label="Permalink to &quot;多个修饰器的 Pipeline&quot;">​</a></h2><p>在使用上，需要对函数一层层地套起来，看上去好像不是很好看，如果需要修饰器比较多的话，代码就会比较难看了。不过，我们可以重构一下。</p><p>重构时，我们需要先写一个工具函数，用来遍历并调用各个修饰器：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type HttpHandlerDecorator func(http.HandlerFunc) http.HandlerFunc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Handler(h http.HandlerFunc, decors ...HttpHandlerDecorator) http.HandlerFunc {</span></span>
<span class="line"><span>    for i := range decors {</span></span>
<span class="line"><span>        d := decors[len(decors)-1-i] // iterate in reverse</span></span>
<span class="line"><span>        h = d(h)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return h</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们就可以像下面这样使用了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http.HandleFunc(&quot;/v4/hello&quot;, Handler(hello,</span></span>
<span class="line"><span>                WithServerHeader, WithBasicAuth, WithDebugLog))</span></span></code></pre></div><p>这样的代码是不是更易读了一些？Pipeline 的功能也就出来了。</p><h2 id="泛型的修饰器" tabindex="-1">泛型的修饰器 <a class="header-anchor" href="#泛型的修饰器" aria-label="Permalink to &quot;泛型的修饰器&quot;">​</a></h2><p>不过，对于 Go 的修饰器模式，还有一个小问题，那就是好像无法做到泛型。比如上面那个计算时间的函数，其代码耦合了需要被修饰的函数的接口类型，无法做到非常通用。如果这个问题解决不了，那么，这个修饰器模式还是有点不好用的。</p><p>因为 Go 语言不像 Python 和 Java，Python是动态语言，而 Java 有语言虚拟机，所以它们可以实现一些比较“变态”的事。但是，Go 语言是一个静态的语言，这就意味着类型需要在编译时就搞定，否则无法编译。不过，Go 语言支持的最大的泛型是 <code>interface{}</code> ，还有比较简单的 Reflection 机制，在上面做做文章，应该还是可以搞定的。</p><p>废话不说，下面是我用 Reflection 机制写的一个比较通用的修饰器（为了便于阅读，我删除了出错判断代码）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Decorator(decoPtr, fn interface{}) (err error) {</span></span>
<span class="line"><span>    var decoratedFunc, targetFunc reflect.Value</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    decoratedFunc = reflect.ValueOf(decoPtr).Elem()</span></span>
<span class="line"><span>    targetFunc = reflect.ValueOf(fn)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    v := reflect.MakeFunc(targetFunc.Type(),</span></span>
<span class="line"><span>            func(in []reflect.Value) (out []reflect.Value) {</span></span>
<span class="line"><span>                fmt.Println(&quot;before&quot;)</span></span>
<span class="line"><span>                out = targetFunc.Call(in)</span></span>
<span class="line"><span>                fmt.Println(&quot;after&quot;)</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    decoratedFunc.Set(v)</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码动用了 <code>reflect.MakeFunc()</code> 函数，创造了一个新的函数，其中的 <code>targetFunc.Call(in)</code> 调用了被修饰的函数。关于 Go 语言的反射机制，你可以阅读下官方文章 <a href="https://blog.golang.org/laws-of-reflection" target="_blank" rel="noreferrer"><em>The Laws of Reflection</em></a>，我就不多说了。</p><p>这个 <code>Decorator()</code> 需要两个参数：</p><ul><li>第一个是出参 <code>decoPtr</code> ，就是完成修饰后的函数；</li><li>第二个是入参 <code>fn</code> ，就是需要修饰的函数。</li></ul><p>这样写是不是有些“傻”？的确是的。不过，这是我个人在 Go 语言里所能写出来的最好的代码了。如果你知道更多优雅的写法，请你要一定告诉我！</p><p>好了，让我们来看一下使用效果。首先，假设我们有两个需要修饰的函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func foo(a, b, c int) int {</span></span>
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
<span class="line"><span>myfoo(1, 2, 3)</span></span></code></pre></div><p>你会发现，使用 <code>Decorator()</code> 时，还需要先声明一个函数签名，感觉好傻啊，一点都不泛型，不是吗？</p><p>如果你不想声明函数签名，就可以这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mybar := bar</span></span>
<span class="line"><span>Decorator(&amp;mybar, bar)</span></span>
<span class="line"><span>mybar(&quot;hello,&quot;, &quot;world!&quot;)</span></span></code></pre></div><p>好吧，看上去不是那么漂亮，但是 it works。</p><p>看样子 Go 语言目前本身的特性无法做成像 Java 或 Python 那样，对此，我们只能期待Go 语言多放“糖”了！</p><p>Again， 如果你有更好的写法，请你一定要告诉我。</p><p>好了，这节课就到这里。如果你觉得今天的内容对你有所帮助，欢迎你帮我分享给更多人。</p>`,53)])])}const g=s(l,[["render",t]]);export{h as __pageData,g as default};
