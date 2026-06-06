import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"27｜即学即练：跟踪函数调用链，理解代码更直观","description":"","frontmatter":{},"headers":[{"level":2,"title":"引子","slug":"引子","link":"#引子","children":[]},{"level":2,"title":"自动获取所跟踪函数的函数名","slug":"自动获取所跟踪函数的函数名","link":"#自动获取所跟踪函数的函数名","children":[]},{"level":2,"title":"增加Goroutine标识","slug":"增加goroutine标识","link":"#增加goroutine标识","children":[]},{"level":2,"title":"让输出的跟踪信息更具层次感","slug":"让输出的跟踪信息更具层次感","link":"#让输出的跟踪信息更具层次感","children":[]},{"level":2,"title":"利用代码生成自动注入Trace函数","slug":"利用代码生成自动注入trace函数","link":"#利用代码生成自动注入trace函数","children":[{"level":3,"title":"将Trace函数放入一个独立的module中","slug":"将trace函数放入一个独立的module中","link":"#将trace函数放入一个独立的module中","children":[]},{"level":3,"title":"自动注入Trace函数","slug":"自动注入trace函数","link":"#自动注入trace函数","children":[]},{"level":3,"title":"利用instrument工具注入跟踪代码","slug":"利用instrument工具注入跟踪代码","link":"#利用instrument工具注入跟踪代码","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/27｜即学即练：跟踪函数调用链，理解代码更直观.md","filePath":"TonyBai·Go语言第一课/27｜即学即练：跟踪函数调用链，理解代码更直观.md","lastUpdated":1779817248000}'),l={name:"TonyBai·Go语言第一课/27｜即学即练：跟踪函数调用链，理解代码更直观.md"};function i(t,n,c,r,o,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_27-即学即练-跟踪函数调用链-理解代码更直观" tabindex="-1">27｜即学即练：跟踪函数调用链，理解代码更直观 <a class="header-anchor" href="#_27-即学即练-跟踪函数调用链-理解代码更直观" aria-label="Permalink to &quot;27｜即学即练：跟踪函数调用链，理解代码更直观&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>时间过得真快！转眼间我们已经完成了这门课基础篇Go语法部分的学习。在这一部分中，我们从变量声明开始，一直学到了Go函数与方法的设计，不知道你掌握得怎么样呢？基础篇的重点是 <strong>对Go基础语法部分的理解</strong>，只有理解透了，我们才能在动手实践的环节运用自如。</p><p>同时，基础篇也是整个课程篇幅最多的部分，想必学到这里，你差不多也进入了一个“疲劳期”。为了给你的大脑“充充电”，我在这一讲，也就是基础篇的最后一讲中安排了一个小实战项目，适当放松一下，也希望你在实现这个实战项目的过程中，能对基础篇所学的内容做一个回顾与总结，夯实一下Go的语法基础。</p><h2 id="引子" tabindex="-1">引子 <a class="header-anchor" href="#引子" aria-label="Permalink to &quot;引子&quot;">​</a></h2><p>在前面的 <a href="https://time.geekbang.org/column/article/464273" target="_blank" rel="noreferrer">第23讲</a> 中，我曾留过这样的一道思考题：“除了捕捉panic、延迟释放资源外，我们日常编码中还有哪些使用defer的小技巧呢？”</p><p>这个思考题得到了同学们的热烈响应，有同学在留言区提到： <strong>使用defer可以跟踪函数的执行过程</strong>。没错！这的确是defer的一个常见的使用技巧，很多Go教程在讲解defer时也会经常使用这个用途举例。那么，我们具体是怎么用defer来实现函数执行过程的跟踪呢？这里，我给出了一个最简单的实现：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace.go</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Trace(name string) func() {</span></span>
<span class="line"><span>    println(&quot;enter:&quot;, name)</span></span>
<span class="line"><span>    return func() {</span></span>
<span class="line"><span>        println(&quot;exit:&quot;, name)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func foo() {</span></span>
<span class="line"><span>    defer Trace(&quot;foo&quot;)()</span></span>
<span class="line"><span>    bar()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bar() {</span></span>
<span class="line"><span>    defer Trace(&quot;bar&quot;)()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    defer Trace(&quot;main&quot;)()</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在讲解这段代码的原理之前，我们先看一下这段代码的执行结果，直观感受一下什么是 <strong>函数调用跟踪</strong>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enter: main</span></span>
<span class="line"><span>enter: foo</span></span>
<span class="line"><span>enter: bar</span></span>
<span class="line"><span>exit: bar</span></span>
<span class="line"><span>exit: foo</span></span>
<span class="line"><span>exit: main</span></span></code></pre></div><p>我们看到，这个Go程序的函数调用的全过程一目了然地展现在了我们面前：程序按 <code>main -&gt; foo -&gt; bar</code> 的函数调用次序执行，代码在函数的入口与出口处分别输出了跟踪日志。</p><p>那这段代码是怎么做到的呢？我们简要分析一下。</p><p>在这段实现中，我们在每个函数的入口处都使用defer设置了一个deferred函数。根据 <a href="https://time.geekbang.org/column/article/464273" target="_blank" rel="noreferrer">第23讲</a> 中讲解的defer的运作机制，Go会在defer设置deferred函数时对defer后面的表达式进行求值。</p><p>我们以foo函数中的 <code>defer Trace(&quot;foo&quot;)()</code> 这行代码为例，Go会对defer后面的表达式 <code>Trace(&quot;foo&quot;)()</code> 进行求值。由于这个表达式包含一个函数调用 <code>Trace(&quot;foo&quot;)</code>，所以这个函数会被执行。</p><p>上面的Trace函数只接受一个参数，˙这个参数代表函数名，Trace会首先打印进入某函数的日志，比如： <code>“enter: foo”</code>。然后返回一个闭包函数，这个闭包函数一旦被执行，就会输出离开某函数的日志。在foo函数中，这个由Trace函数返回的闭包函数就被设置为了deferred函数，于是当foo函数返回后，这个闭包函数就会被执行，输出 <code>“exit: foo”</code> 的日志。</p><p>搞清楚上面跟踪函数调用链的实现原理后，我们再来看看这个实现。我们会发现这里还是有一些 <strong>“瑕疵”</strong>，也就是离我们期望的“跟踪函数调用链”的实现还有一些不足之处。这里我列举了几点：</p><ul><li>调用Trace时需手动显式传入要跟踪的函数名；</li><li>如果是并发应用，不同Goroutine中函数链跟踪混在一起无法分辨；</li><li>输出的跟踪结果缺少层次感，调用关系不易识别；</li><li>对要跟踪的函数，需手动调用Trace函数。</li></ul><p>那么，这一讲我们的任务就是逐一分析并解决上面提出的这几点问题进行，经过逐步地代码演进，最终 <strong>实现一个自动注入跟踪代码，并输出有层次感的函数调用链跟踪命令行工具</strong>。</p><p>好，下面我们先来解决第一个问题。</p><h2 id="自动获取所跟踪函数的函数名" tabindex="-1">自动获取所跟踪函数的函数名 <a class="header-anchor" href="#自动获取所跟踪函数的函数名" aria-label="Permalink to &quot;自动获取所跟踪函数的函数名&quot;">​</a></h2><p>要解决“调用Trace时需要手动显式传入要跟踪的函数名”的问题，也就是要让我们的Trace函数能够自动获取到它跟踪函数的函数名信息。我们以跟踪foo为例，看看这样做能给我们带来什么好处。</p><p>在手动显式传入的情况下，我们需要用下面这个代码对foo进行跟踪：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>defer Trace(&quot;foo&quot;)()</span></span></code></pre></div><p>一旦实现了自动获取函数名，所有支持函数调用链跟踪的函数都只需使用下面调用形式的Trace函数就可以了：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>defer Trace()()</span></span></code></pre></div><p>这种一致的Trace函数调用方式也为后续的自动向代码中注入Trace函数奠定了基础。那么如何实现Trace函数对它跟踪函数名的自动获取呢？我们需要借助Go标准库runtime包的帮助。</p><p>这里，我给出了新版Trace函数的实现以及它的使用方法，我们先看一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace1/trace.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Trace() func() {</span></span>
<span class="line"><span>    pc, _, _, ok := runtime.Caller(1)</span></span>
<span class="line"><span>    if !ok {</span></span>
<span class="line"><span>        panic(&quot;not found caller&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fn := runtime.FuncForPC(pc)</span></span>
<span class="line"><span>    name := fn.Name()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    println(&quot;enter:&quot;, name)</span></span>
<span class="line"><span>    return func() { println(&quot;exit:&quot;, name) }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func foo() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    bar()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bar() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这一版Trace函数中，我们通过runtime.Caller函数获得当前Goroutine的函数调用栈上的信息，runtime.Caller的参数标识的是要获取的是哪一个栈帧的信息。当参数为0时，返回的是Caller函数的调用者的函数信息，在这里就是Trace函数。但我们需要的是Trace函数的调用者的信息，于是我们传入1。</p><p>Caller函数有四个返回值：第一个返回值代表的是程序计数（pc）；第二个和第三个参数代表对应函数所在的源文件名以及所在行数，这里我们暂时不需要；最后一个参数代表是否能成功获取这些信息，如果获取失败，我们抛出panic。</p><p>接下来，我们通过runtime.FuncForPC函数和程序计数器（PC）得到被跟踪函数的函数名称。我们运行一下改造后代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enter: main.main</span></span>
<span class="line"><span>enter: main.foo</span></span>
<span class="line"><span>enter: main.bar</span></span>
<span class="line"><span>exit: main.bar</span></span>
<span class="line"><span>exit: main.foo</span></span>
<span class="line"><span>exit: main.main</span></span></code></pre></div><p>我们看到，runtime.FuncForPC返回的名称中不仅仅包含函数名，还包含了被跟踪函数所在的包名。也就是说，我们第一个问题已经圆满解决了。</p><p>接下来，我们来解决第二个问题，也就是当程序中有多Goroutine时，Trace输出的跟踪信息混杂在一起难以分辨的问题。</p><h2 id="增加goroutine标识" tabindex="-1">增加Goroutine标识 <a class="header-anchor" href="#增加goroutine标识" aria-label="Permalink to &quot;增加Goroutine标识&quot;">​</a></h2><p>上面的Trace函数在面对只有一个Goroutine的时候，还是可以支撑的，但当程序中并发运行多个Goroutine的时候，多个函数调用链的出入口信息输出就会混杂在一起，无法分辨。</p><p>那么，接下来我们还继续对Trace函数进行改造，让它支持多Goroutine函数调用链的跟踪。我们的方案就是 <strong>在输出的函数出入口信息时，带上一个在程序每次执行时能唯一区分Goroutine的Goroutine ID</strong>。</p><p>到这里，你可能会说，Goroutine也没有ID信息啊！的确如此，Go核心团队为了避免 <a href="https://groups.google.com/g/golang-nuts/c/0HGyCOrhuuI/m/BjkXjGkMJrgJ" target="_blank" rel="noreferrer">Goroutine ID的滥用</a>，故意没有将Goroutine ID暴露给开发者。但在Go标准库的h2_bundle.go中，我们却发现了一个获取Goroutine ID的标准方法，看下面代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/net/http/h2_bundle.go</span></span>
<span class="line"><span>var http2goroutineSpace = []byte(&quot;goroutine &quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func http2curGoroutineID() uint64 {</span></span>
<span class="line"><span>    bp := http2littleBuf.Get().(*[]byte)</span></span>
<span class="line"><span>    defer http2littleBuf.Put(bp)</span></span>
<span class="line"><span>    b := *bp</span></span>
<span class="line"><span>    b = b[:runtime.Stack(b, false)]</span></span>
<span class="line"><span>    // Parse the 4707 out of &quot;goroutine 4707 [&quot;</span></span>
<span class="line"><span>    b = bytes.TrimPrefix(b, http2goroutineSpace)</span></span>
<span class="line"><span>    i := bytes.IndexByte(b, &#39; &#39;)</span></span>
<span class="line"><span>    if i &amp;lt; 0 {</span></span>
<span class="line"><span>        panic(fmt.Sprintf(&quot;No space found in %q&quot;, b))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    b = b[:i]</span></span>
<span class="line"><span>    n, err := http2parseUintBytes(b, 10, 64)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        panic(fmt.Sprintf(&quot;Failed to parse goroutine ID out of %q: %v&quot;, b, err))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return n</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，由于http2curGoroutineID不是一个导出函数，我们无法直接使用。我们可以把它复制出来改造一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace2/trace.go</span></span>
<span class="line"><span>var goroutineSpace = []byte(&quot;goroutine &quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func curGoroutineID() uint64 {</span></span>
<span class="line"><span>    b := make([]byte, 64)</span></span>
<span class="line"><span>    b = b[:runtime.Stack(b, false)]</span></span>
<span class="line"><span>    // Parse the 4707 out of &quot;goroutine 4707 [&quot;</span></span>
<span class="line"><span>    b = bytes.TrimPrefix(b, goroutineSpace)</span></span>
<span class="line"><span>    i := bytes.IndexByte(b, &#39; &#39;)</span></span>
<span class="line"><span>    if i &amp;lt; 0 {</span></span>
<span class="line"><span>        panic(fmt.Sprintf(&quot;No space found in %q&quot;, b))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    b = b[:i]</span></span>
<span class="line"><span>    n, err := strconv.ParseUint(string(b), 10, 64)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        panic(fmt.Sprintf(&quot;Failed to parse goroutine ID out of %q: %v&quot;, b, err))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return n</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里，我们改造了两个地方。一个地方是通过直接创建一个byte切片赋值给b，替代原http2curGoroutineID函数中从一个pool池获取byte切片的方式，另外一个是使用strconv.ParseUint替代了原先的http2parseUintBytes。改造后，我们就可以直接使用curGoroutineID函数来获取Goroutine的ID信息了。</p><p>好，接下来，我们在Trace函数中添加Goroutine ID信息的输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace2/trace.go</span></span>
<span class="line"><span>func Trace() func() {</span></span>
<span class="line"><span>    pc, _, _, ok := runtime.Caller(1)</span></span>
<span class="line"><span>    if !ok {</span></span>
<span class="line"><span>        panic(&quot;not found caller&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fn := runtime.FuncForPC(pc)</span></span>
<span class="line"><span>    name := fn.Name()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gid := curGoroutineID()</span></span>
<span class="line"><span>    fmt.Printf(&quot;g[%05d]: enter: [%s]\\n&quot;, gid, name)</span></span>
<span class="line"><span>    return func() { fmt.Printf(&quot;g[%05d]: exit: [%s]\\n&quot;, gid, name) }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面代码看到，我们在出入口输出的跟踪信息中加入了Goroutine ID信息，我们输出的Goroutine ID为5位数字，如果ID值不足5位，则左补零，这一切都是Printf函数的格式控制字符串“%05d”帮助我们实现的。这样对齐Goroutine ID的位数，为的是输出信息格式的一致性更好。如果你的Go程序中Goroutine的数量超过了5位数可以表示的数值范围，也可以自行调整控制字符串。</p><p>接下来，我们也要对示例进行一些调整，将这个程序由单Goroutine改为多Goroutine并发的，这样才能验证支持多Goroutine的新版Trace函数是否好用：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace2/trace.go</span></span>
<span class="line"><span>func A1() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    B1()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func B1() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    C1()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func C1() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    D()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func D() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func A2() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    B2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func B2() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    C2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func C2() {</span></span>
<span class="line"><span>    defer Trace()()</span></span>
<span class="line"><span>    D()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var wg sync.WaitGroup</span></span>
<span class="line"><span>    wg.Add(1)</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        A2()</span></span>
<span class="line"><span>        wg.Done()</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    A1()</span></span>
<span class="line"><span>    wg.Wait()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>新示例程序共有两个Goroutine，main groutine的调用链为 <code>A1 -&gt; B1 -&gt; C1 -&gt; D</code>，而另外一个Goroutine的函数调用链为 <code>A2 -&gt; B2 -&gt; C2 -&gt; D</code>。我们来看一下这个程序的执行结果是否和原代码中两个Goroutine的调用链一致：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>g[00001]: enter: [main.A1]</span></span>
<span class="line"><span>g[00001]: enter: [main.B1]</span></span>
<span class="line"><span>g[00018]: enter: [main.A2]</span></span>
<span class="line"><span>g[00001]: enter: [main.C1]</span></span>
<span class="line"><span>g[00001]: enter: [main.D]</span></span>
<span class="line"><span>g[00001]: exit: [main.D]</span></span>
<span class="line"><span>g[00001]: exit: [main.C1]</span></span>
<span class="line"><span>g[00001]: exit: [main.B1]</span></span>
<span class="line"><span>g[00001]: exit: [main.A1]</span></span>
<span class="line"><span>g[00018]: enter: [main.B2]</span></span>
<span class="line"><span>g[00018]: enter: [main.C2]</span></span>
<span class="line"><span>g[00018]: enter: [main.D]</span></span>
<span class="line"><span>g[00018]: exit: [main.D]</span></span>
<span class="line"><span>g[00018]: exit: [main.C2]</span></span>
<span class="line"><span>g[00018]: exit: [main.B2]</span></span>
<span class="line"><span>g[00018]: exit: [main.A2]</span></span></code></pre></div><p>我们看到，新示例程序输出了带有Goroutine ID的出入口跟踪信息，通过Goroutine ID我们可以快速确认某一行输出是属于哪个Goroutine的。</p><p>但由于Go运行时对Goroutine调度顺序的不确定性，各个Goroutine的输出还是会存在交织在一起的问题，这会给你查看某个Goroutine的函数调用链跟踪信息带来阻碍。这里我提供一个 <strong>小技巧</strong>：你可以将程序的输出重定向到一个本地文件中，然后通过Goroutine ID过滤出（可使用grep工具）你想查看的groutine的全部函数跟踪信息。</p><p>到这里，我们就实现了输出带有Goroutine ID的函数跟踪信息，不过，你是不是也觉得输出的函数调用链信息还是不够美观，缺少层次感，体验依旧不那么优秀呢？至少我是这么觉得的。所以下面我们就来美化一下信息的输出形式。</p><h2 id="让输出的跟踪信息更具层次感" tabindex="-1">让输出的跟踪信息更具层次感 <a class="header-anchor" href="#让输出的跟踪信息更具层次感" aria-label="Permalink to &quot;让输出的跟踪信息更具层次感&quot;">​</a></h2><p>对于程序员来说，缩进是最能体现出“层次感”的方法，如果我们将上面示例中Goroutine 00001的函数调用跟踪信息以下面的形式展示出来，函数的调用顺序是不是更加一目了然了呢？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>g[00001]:    -&amp;gt;main.A1</span></span>
<span class="line"><span>g[00001]:        -&amp;gt;main.B1</span></span>
<span class="line"><span>g[00001]:            -&amp;gt;main.C1</span></span>
<span class="line"><span>g[00001]:                -&amp;gt;main.D</span></span>
<span class="line"><span>g[00001]:                &amp;lt;-main.D</span></span>
<span class="line"><span>g[00001]:            &amp;lt;-main.C1</span></span>
<span class="line"><span>g[00001]:        &amp;lt;-main.B1</span></span>
<span class="line"><span>g[00001]:    &amp;lt;-main.A1</span></span></code></pre></div><p>那么我们就以这个形式为目标，考虑如何实现输出这种带缩进的函数调用跟踪信息。我们还是直接上代码吧：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// trace3/trace.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func printTrace(id uint64, name, arrow string, indent int) {</span></span>
<span class="line"><span>    indents := &quot;&quot;</span></span>
<span class="line"><span>    for i := 0; i &amp;lt; indent; i++ {</span></span>
<span class="line"><span>        indents += &quot;    &quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;g[%05d]:%s%s%s\\n&quot;, id, indents, arrow, name)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var mu sync.Mutex</span></span>
<span class="line"><span>var m = make(map[uint64]int)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Trace() func() {</span></span>
<span class="line"><span>    pc, _, _, ok := runtime.Caller(1)</span></span>
<span class="line"><span>    if !ok {</span></span>
<span class="line"><span>        panic(&quot;not found caller&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fn := runtime.FuncForPC(pc)</span></span>
<span class="line"><span>    name := fn.Name()</span></span>
<span class="line"><span>    gid := curGoroutineID()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mu.Lock()</span></span>
<span class="line"><span>    indents := m[gid]    // 获取当前gid对应的缩进层次</span></span>
<span class="line"><span>    m[gid] = indents + 1 // 缩进层次+1后存入map</span></span>
<span class="line"><span>    mu.Unlock()</span></span>
<span class="line"><span>    printTrace(gid, name, &quot;-&amp;gt;&quot;, indents+1)</span></span>
<span class="line"><span>    return func() {</span></span>
<span class="line"><span>        mu.Lock()</span></span>
<span class="line"><span>        indents := m[gid]    // 获取当前gid对应的缩进层次</span></span>
<span class="line"><span>        m[gid] = indents - 1 // 缩进层次-1后存入map</span></span>
<span class="line"><span>        mu.Unlock()</span></span>
<span class="line"><span>        printTrace(gid, name, &quot;&amp;lt;-&quot;, indents)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这段代码中，我们使用了一个map类型变量m来保存每个Goroutine当前的缩进信息：m的key为Goroutine的ID，值为缩进的层次。然后，考虑到Trace函数可能在并发环境中运行，根据我们在 <a href="https://time.geekbang.org/column/article/446032" target="_blank" rel="noreferrer">第16讲</a> 中提到的“map不支持并发写”的注意事项，我们增加了一个sync.Mutex实例mu用于同步对m的写操作。</p><p>这样，对于一个Goroutine来说，每次刚进入一个函数调用，我们就在输出入口跟踪信息之前，将缩进层次加一，并输出入口跟踪信息，加一后的缩进层次值也保存到map中。然后，在函数退出前，我们取出当前缩进层次值并输出出口跟踪信息，之后再将缩进层次减一后保存到map中。</p><p>除了增加缩进层次信息外，在这一版的Trace函数实现中，我们也把输出出入口跟踪信息的操作提取到了一个独立的函数printTrace中，这个函数会根据传入的Goroutine ID、函数名、箭头类型与缩进层次值，按预定的格式拼接跟踪信息并输出。</p><p>运行新版示例代码，我们会得到下面的结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>g[00001]:    -&amp;gt;main.A1</span></span>
<span class="line"><span>g[00001]:        -&amp;gt;main.B1</span></span>
<span class="line"><span>g[00001]:            -&amp;gt;main.C1</span></span>
<span class="line"><span>g[00001]:                -&amp;gt;main.D</span></span>
<span class="line"><span>g[00001]:                &amp;lt;-main.D</span></span>
<span class="line"><span>g[00001]:            &amp;lt;-main.C1</span></span>
<span class="line"><span>g[00001]:        &amp;lt;-main.B1</span></span>
<span class="line"><span>g[00001]:    &amp;lt;-main.A1</span></span>
<span class="line"><span>g[00018]:    -&amp;gt;main.A2</span></span>
<span class="line"><span>g[00018]:        -&amp;gt;main.B2</span></span>
<span class="line"><span>g[00018]:            -&amp;gt;main.C2</span></span>
<span class="line"><span>g[00018]:                -&amp;gt;main.D</span></span>
<span class="line"><span>g[00018]:                &amp;lt;-main.D</span></span>
<span class="line"><span>g[00018]:            &amp;lt;-main.C2</span></span>
<span class="line"><span>g[00018]:        &amp;lt;-main.B2</span></span>
<span class="line"><span>g[00018]:    &amp;lt;-main.A2</span></span></code></pre></div><p>显然，通过这种带有缩进层次的函数调用跟踪信息，我们可以更容易地识别某个Goroutine的函数调用关系。</p><p>到这里，我们的函数调用链跟踪已经支持了多Goroutine，并且可以输出有层次感的跟踪信息了，但对于Trace特性的使用者而言，他们依然需要手工在自己的函数中添加对Trace函数的调用。那么我们是否可以将Trace特性自动注入特定项目下的各个源码文件中呢？接下来我们继续来改进我们的Trace工具。</p><h2 id="利用代码生成自动注入trace函数" tabindex="-1">利用代码生成自动注入Trace函数 <a class="header-anchor" href="#利用代码生成自动注入trace函数" aria-label="Permalink to &quot;利用代码生成自动注入Trace函数&quot;">​</a></h2><p>要实现向目标代码中的函数/方法自动注入Trace函数，我们首先要做的就是将上面Trace函数相关的代码打包到一个module中以方便其他module导入。下面我们就先来看看将Trace函数放入一个独立的module中的步骤。</p><h3 id="将trace函数放入一个独立的module中" tabindex="-1">将Trace函数放入一个独立的module中 <a class="header-anchor" href="#将trace函数放入一个独立的module中" aria-label="Permalink to &quot;将Trace函数放入一个独立的module中&quot;">​</a></h3><p>我们创建一个名为instrument_trace的目录，进入这个目录后，通过go mod init命令创建一个名为github.com/bigwhite/instrument_trace的module：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$mkdir instrument_trace</span></span>
<span class="line"><span>$cd instrument_trace</span></span>
<span class="line"><span>$go mod init github.com/bigwhite/instrument_trace</span></span>
<span class="line"><span>go: creating new go.mod: module github.com/bigwhite/instrument_trace</span></span></code></pre></div><p>接下来，我们将最新版的trace.go放入到该目录下，将包名改为trace，并仅保留Trace函数、Trace使用的函数以及包级变量，其他函数一律删除掉。这样，一个独立的trace包就提取完毕了。</p><p><strong>作为trace包的作者，我们有义务告诉大家如何使用trace包。</strong> 在Go中，通常我们会用一个example_test.go文件来编写使用trace包的演示代码，下面就是我们为trace包提供的example_test.go文件：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// instrument_trace/example_test.go</span></span>
<span class="line"><span>package trace_test</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    trace &quot;github.com/bigwhite/instrument_trace&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func a() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>    b()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func b() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>    c()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func c() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>    d()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func d() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func ExampleTrace() {</span></span>
<span class="line"><span>    a()</span></span>
<span class="line"><span>    // Output:</span></span>
<span class="line"><span>    // g[00001]:    -&amp;gt;github.com/bigwhite/instrument_trace_test.a</span></span>
<span class="line"><span>    // g[00001]:        -&amp;gt;github.com/bigwhite/instrument_trace_test.b</span></span>
<span class="line"><span>    // g[00001]:            -&amp;gt;github.com/bigwhite/instrument_trace_test.c</span></span>
<span class="line"><span>    // g[00001]:                -&amp;gt;github.com/bigwhite/instrument_trace_test.d</span></span>
<span class="line"><span>    // g[00001]:                &amp;lt;-github.com/bigwhite/instrument_trace_test.d</span></span>
<span class="line"><span>    // g[00001]:            &amp;lt;-github.com/bigwhite/instrument_trace_test.c</span></span>
<span class="line"><span>    // g[00001]:        &amp;lt;-github.com/bigwhite/instrument_trace_test.b</span></span>
<span class="line"><span>    // g[00001]:    &amp;lt;-github.com/bigwhite/instrument_trace_test.a</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在example_test.go文件中，我们用ExampleXXX形式的函数表示一个示例，go test命令会扫描example_test.go中的以Example为前缀的函数并执行这些函数。</p><p>每个ExampleXXX函数需要包含预期的输出，就像上面ExampleTrace函数尾部那样，我们在一大段注释中提供这个函数执行后的预期输出，预期输出的内容从 <code>// Output:</code> 的下一行开始。go test会将ExampleTrace的输出与预期输出对比，如果不一致，会报测试错误。从这一点，我们可以看出example_test.go也是trace包单元测试的一部分。</p><p>现在Trace函数已经被放入到独立的包中了，接下来我们就来看看如何将它自动注入到要跟踪的函数中去。</p><h3 id="自动注入trace函数" tabindex="-1">自动注入Trace函数 <a class="header-anchor" href="#自动注入trace函数" aria-label="Permalink to &quot;自动注入Trace函数&quot;">​</a></h3><p>现在，我们在instrument_trace module下面增加一个命令行工具，这个工具可以以一个Go源文件为单位，自动向这个Go源文件中的所有函数注入Trace函数。</p><p>我们再根据 <a href="https://time.geekbang.org/column/article/429143" target="_blank" rel="noreferrer">05讲</a> 中介绍的带有可执行文件的Go项目布局，在instrument_trace module中增加cmd/instrument目录，这个工具的main包就放在这个目录下，而真正实现自动注入Trace函数的代码呢，被我们放在了instrumenter目录下。</p><p>下面是变化后的instrument_trace module的目录结构：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$tree ./instrument_trace -F</span></span>
<span class="line"><span>./instrument_trace</span></span>
<span class="line"><span>├── Makefile</span></span>
<span class="line"><span>├── cmd/</span></span>
<span class="line"><span>│   └── instrument/</span></span>
<span class="line"><span>│       └── main.go  # instrument命令行工具的main包</span></span>
<span class="line"><span>├── example_test.go</span></span>
<span class="line"><span>├── go.mod</span></span>
<span class="line"><span>├── go.sum</span></span>
<span class="line"><span>├── instrumenter/    # 自动注入逻辑的相关结构</span></span>
<span class="line"><span>│   ├── ast/</span></span>
<span class="line"><span>│   │   └── ast.go</span></span>
<span class="line"><span>│   └── instrumenter.go</span></span>
<span class="line"><span>└── trace.go</span></span></code></pre></div><p>我们先来看一下cmd/instrument/main.go源码，然后自上而下沿着main函数的调用逻辑逐一看一下这个功能的实现。下面是main.go的源码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//  instrument_trace/cmd/instrument/main.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    wrote bool</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func init() {</span></span>
<span class="line"><span>    flag.BoolVar(&amp;wrote, &quot;w&quot;, false, &quot;write result to (source) file instead of stdout&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func usage() {</span></span>
<span class="line"><span>    fmt.Println(&quot;instrument [-w] xxx.go&quot;)</span></span>
<span class="line"><span>    flag.PrintDefaults()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    fmt.Println(os.Args)</span></span>
<span class="line"><span>    flag.Usage = usage</span></span>
<span class="line"><span>    flag.Parse() // 解析命令行参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if len(os.Args) &amp;lt; 2 { // 对命令行参数个数进行校验</span></span>
<span class="line"><span>        usage()</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var file string</span></span>
<span class="line"><span>    if len(os.Args) == 3 {</span></span>
<span class="line"><span>        file = os.Args[2]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if len(os.Args) == 2 {</span></span>
<span class="line"><span>        file = os.Args[1]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if filepath.Ext(file) != &quot;.go&quot; { // 对源文件扩展名进行校验</span></span>
<span class="line"><span>        usage()</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var ins instrumenter.Instrumenter // 声明instrumenter.Instrumenter接口类型变量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建以ast方式实现Instrumenter接口的ast.instrumenter实例</span></span>
<span class="line"><span>    ins = ast.New(&quot;github.com/bigwhite/instrument_trace&quot;, &quot;trace&quot;, &quot;Trace&quot;)</span></span>
<span class="line"><span>    newSrc, err := ins.Instrument(file) // 向Go源文件所有函数注入Trace函数</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        panic(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if newSrc == nil {</span></span>
<span class="line"><span>        // add nothing to the source file. no change</span></span>
<span class="line"><span>        fmt.Printf(&quot;no trace added for %s\\n&quot;, file)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if !wrote {</span></span>
<span class="line"><span>        fmt.Println(string(newSrc))  // 将生成的新代码内容输出到stdout上</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将生成的新代码内容写回原Go源文件</span></span>
<span class="line"><span>    if err = ioutil.WriteFile(file, newSrc, 0666); err != nil {</span></span>
<span class="line"><span>        fmt.Printf(&quot;write %s error: %v\\n&quot;, file, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;instrument trace for %s ok\\n&quot;, file)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>作为命令行工具，instrument使用标准库的flag包实现对命令行参数（这里是-w）的解析，通过os.Args获取待注入的Go源文件路径。在完成对命令行参数个数与值的校验后，instrument程序声明了一个instrumenter.Instrumenter接口类型变量ins，然后创建了一个实现了Instrumenter接口类型的ast.instrumenter类型的实例，并赋值给变量ins。</p><p>instrumenter.Instrumenter接口类型的声明放在了instrumenter/instrumenter.go中：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Instrumenter interface {</span></span>
<span class="line"><span>    Instrument(string) ([]byte, error)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们看到，这个接口类型的方法列表中只有一个方法Instrument，这个方法接受一个Go源文件路径，返回注入了Trace函数的新源文件内容以及一个error类型值，作为错误状态标识。我们之所以要抽象出一个接口类型，考虑的就是注入Trace函数的实现方法不一，为后续的扩展做好预留。</p><p>在这个例子中，我们默认提供了一种自动注入Trace函数的实现，那就是ast.instrumenter，它注入Trace的实现原理是这样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/471138/5be0efb3920c39cd9f252af0b26e7ca8.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/471138/5be0efb3920c39cd9f252af0b26e7ca8.jpg" alt=""></a></p><p>从原理图中我们可以清楚地看到，在这一实现方案中，我们先将传入的Go源码转换为 <strong>抽象语法树</strong>。</p><p>在计算机科学中，抽象语法树（abstract syntax tree，AST）是源代码的抽象语法结构的树状表现形式，树上的每个节点都表示源代码中的一种结构。因为Go语言是开源编程语言，所以它的抽象语法树的操作包也和语言一起开放给了Go开发人员，我们可以基于Go标准库以及 <a href="https://golang.org/x/tools" target="_blank" rel="noreferrer">Go实验工具库</a> 提供的ast相关包，快速地构建基于AST的应用，这里的ast.instrumenter就是一个应用AST的典型例子。</p><p>一旦我们通过ast相关包解析Go源码得到相应的抽象语法树后，我们便可以操作这棵语法树，并按我们的逻辑在语法树中注入我们的Trace函数，最后我们再将修改后的抽象语法树转换为Go源码，就完成了整个自动注入的工作了。</p><p>了解了原理后，我们再看一下具体的代码实现。下面是ast.instrumenter的Instructment方法的代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// instrument_trace/instrumenter/ast/ast.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (a instrumenter) Instrument(filename string) ([]byte, error) {</span></span>
<span class="line"><span>    fset := token.NewFileSet()</span></span>
<span class="line"><span>    curAST, err := parser.ParseFile(fset, filename, nil, parser.ParseComments) // 解析Go源码，得到AST</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        return nil, fmt.Errorf(&quot;error parsing %s: %w&quot;, filename, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if !hasFuncDecl(curAST) { // 如果整个源码都不包含函数声明，则无需注入操作，直接返回。</span></span>
<span class="line"><span>        return nil, nil</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在AST上添加包导入语句</span></span>
<span class="line"><span>    astutil.AddImport(fset, curAST, a.traceImport)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 向AST上的所有函数注入Trace函数</span></span>
<span class="line"><span>    a.addDeferTraceIntoFuncDecls(curAST)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    buf := &amp;bytes.Buffer{}</span></span>
<span class="line"><span>    err = format.Node(buf, fset, curAST) // 将修改后的AST转换回Go源码</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        return nil, fmt.Errorf(&quot;error formatting new code: %w&quot;, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return buf.Bytes(), nil // 返回转换后的Go源码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过代码，我们看到Instrument方法的基本步骤与上面原理图大同小异。Instrument首先通过go/paser的ParserFile函数对传入的Go源文件中的源码进行解析，并得到对应的抽象语法树AST，然后向AST中导入Trace函数所在的包，并向这个AST的所有函数声明注入Trace函数调用。</p><p>实际的注入操作发生在instrumenter的addDeferTraceIntoFuncDecls方法中，我们来看一下这个方法的实现：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// instrument_trace/instrumenter/ast/ast.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (a instrumenter) addDeferTraceIntoFuncDecls(f *ast.File) {</span></span>
<span class="line"><span>    for _, decl := range f.Decls { // 遍历所有声明语句</span></span>
<span class="line"><span>        fd, ok := decl.(*ast.FuncDecl) // 类型断言：是否为函数声明</span></span>
<span class="line"><span>        if ok {</span></span>
<span class="line"><span>            // 如果是函数声明，则注入跟踪设施</span></span>
<span class="line"><span>            a.addDeferStmt(fd)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法的逻辑十分清晰，就是遍历语法树上所有声明语句，如果是函数声明，就调用instrumenter的addDeferStmt方法进行注入，如果不是，就直接返回。addDeferStmt方法的实现如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// instrument_trace/instrumenter/ast/ast.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (a instrumenter) addDeferStmt(fd *ast.FuncDecl) (added bool) {</span></span>
<span class="line"><span>    stmts := fd.Body.List</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 判断&quot;defer trace.Trace()()&quot;语句是否已经存在</span></span>
<span class="line"><span>    for _, stmt := range stmts {</span></span>
<span class="line"><span>        ds, ok := stmt.(*ast.DeferStmt)</span></span>
<span class="line"><span>        if !ok {</span></span>
<span class="line"><span>            // 如果不是defer语句，则继续for循环</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 如果是defer语句，则要进一步判断是否是defer trace.Trace()()</span></span>
<span class="line"><span>        ce, ok := ds.Call.Fun.(*ast.CallExpr)</span></span>
<span class="line"><span>        if !ok {</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        se, ok := ce.Fun.(*ast.SelectorExpr)</span></span>
<span class="line"><span>        if !ok {</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        x, ok := se.X.(*ast.Ident)</span></span>
<span class="line"><span>        if !ok {</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (x.Name == a.tracePkg) &amp;&amp; (se.Sel.Name == a.traceFunc) {</span></span>
<span class="line"><span>            // defer trace.Trace()()已存在，返回</span></span>
<span class="line"><span>            return false</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 没有找到&quot;defer trace.Trace()()&quot;，注入一个新的跟踪语句</span></span>
<span class="line"><span>    // 在AST上构造一个defer trace.Trace()()</span></span>
<span class="line"><span>    ds := &amp;ast.DeferStmt{</span></span>
<span class="line"><span>        Call: &amp;ast.CallExpr{</span></span>
<span class="line"><span>            Fun: &amp;ast.CallExpr{</span></span>
<span class="line"><span>                Fun: &amp;ast.SelectorExpr{</span></span>
<span class="line"><span>                    X: &amp;ast.Ident{</span></span>
<span class="line"><span>                        Name: a.tracePkg,</span></span>
<span class="line"><span>                    },</span></span>
<span class="line"><span>                    Sel: &amp;ast.Ident{</span></span>
<span class="line"><span>                        Name: a.traceFunc,</span></span>
<span class="line"><span>                    },</span></span>
<span class="line"><span>                },</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    newList := make([]ast.Stmt, len(stmts)+1)</span></span>
<span class="line"><span>    copy(newList[1:], stmts)</span></span>
<span class="line"><span>    newList[0] = ds // 注入新构造的defer语句</span></span>
<span class="line"><span>    fd.Body.List = newList</span></span>
<span class="line"><span>    return true</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>虽然addDeferStmt函数体略长，但逻辑也很清晰，就是先判断函数是否已经注入了Trace，如果有，则略过；如果没有，就构造一个Trace语句节点，并将它插入到AST中。</p><p>Instrument的最后一步就是将注入Trace后的AST重新转换为Go代码，这就是我们期望得到的带有Trace特性的Go代码了。</p><h3 id="利用instrument工具注入跟踪代码" tabindex="-1">利用instrument工具注入跟踪代码 <a class="header-anchor" href="#利用instrument工具注入跟踪代码" aria-label="Permalink to &quot;利用instrument工具注入跟踪代码&quot;">​</a></h3><p>有了instrument工具后，我们再来看看如何使用这个工具，在目标Go源文件中自动注入跟踪设施。</p><p>这里，我在instrument_trace项目的examples目录下建立了一个名为demo的项目，我们就来看看如何使用instrument工具为demo项目下的demo.go文件自动注入跟踪设施。demo.go文件内容很简单：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// instrument_trace/examples/demo/demo.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func foo() {</span></span>
<span class="line"><span>    bar()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bar() {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们首先构建一下instrument_trace下的instrument工具：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$cd instrument_trace</span></span>
<span class="line"><span>$go build github.com/bigwhite/instrument_trace/cmd/instrument</span></span>
<span class="line"><span>$instrument version</span></span>
<span class="line"><span>[instrument version]</span></span>
<span class="line"><span>instrument [-w] xxx.go</span></span>
<span class="line"><span>  -w	write result to (source) file instead of stdout</span></span></code></pre></div><p>接下来，我们使用instrument工具向examples/demo/demo.go源文件中的函数自动注入跟踪设施：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$instrument -w  examples/demo/demo.go</span></span>
<span class="line"><span>[instrument -w examples/demo/demo.go]</span></span>
<span class="line"><span>instrument trace for examples/demo/demo.go ok</span></span></code></pre></div><p>注入后的demo.go文件变为了下面这个样子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// instrument_trace/examples/demo/demo.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;github.com/bigwhite/instrument_trace&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func foo() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>    bar()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bar() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    defer trace.Trace()()</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>此时，如果我们再对已注入Trace函数的demo.go执行一次instrument命令，由于instrument会判断demo.go各个函数已经注入了Trace，demo.go的内容将保持不变。</p><p>由于github.com/bigwhite/instrument_trace并没有真正上传到github.com上，所以如果你要运行demo.go，我们可以为它配置一个下面这样的go.mod：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>// instrument_trace/examples/demo/go.mod</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>go 1.17</span></span>
<span class="line"><span></span></span>
<span class="line"><span>require github.com/bigwhite/instrument_trace v1.0.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>replace github.com/bigwhite/instrument_trace v1.0.0 =&amp;gt; ../../</span></span></code></pre></div><p>这样运行demo.go就不会遇到障碍了：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run demo.go</span></span>
<span class="line"><span>g[00001]:    -&amp;gt;main.main</span></span>
<span class="line"><span>g[00001]:        -&amp;gt;main.foo</span></span>
<span class="line"><span>g[00001]:            -&amp;gt;main.bar</span></span>
<span class="line"><span>g[00001]:            &amp;lt;-main.bar</span></span>
<span class="line"><span>g[00001]:        &amp;lt;-main.foo</span></span>
<span class="line"><span>g[00001]:    &amp;lt;-main.main</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>到这里，我们已经实现了这节课开始时设定的目标：实现一个自动注入跟踪代码并输出有层次感的函数调用链跟踪命令行工具。</p><p>回顾一下这个工具的实现思路：我们先基于defer实现了一个最简单的函数跟踪机制，然后针对这个最简单的实现提出若干问题，接下来我们逐一把这些问题解决掉了，最终将第一版相对粗糙的代码实现演进重构为一个相对完善的命令行工具。</p><p>关于这个实战项目，有两点注意事项要和你交代清楚：</p><p>第一，在代码中注入函数调用跟踪代码仅适用于日常调试代码和阅读理解代码时使用，被注入了跟踪设施的代码是不适合上生产环境的；</p><p>第二，我在这里使用到了Go核心团队不推荐使用的Goroutine id，这也是由这个实战项目的性质所决定的。如果你的代码是上生产，我建议还是尽量听从Go核心团队的建议， <strong>不要依赖Goroutine ID</strong>。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>通过instrument命令行工具对Go源文件进行注入后，defer trace.Trace()()就会成为Go源码的一部分被编译进最终的可执行文件中。我们在小结中也提到了，开启了Trace的代码不要上生产环境，这样我们在构建上生产的应用之前需要手工删掉这些Trace代码，操作起来十分繁琐易错。</p><p>所以，这里我想请你为Trace增加一个开关功能，有了这个开关后，日常开发调试过程中编译出的程序中的Trace是起作用的，但为生产环境编译出的可执行程序中虽然也包含Trace，但Trace不会真正起作用（提示：使用build tag）。</p><p>欢迎你把这节课分享给更多对Go语言感兴趣的朋友。我是Tony Bai，我们下节课见。</p><h4 id="这个项目的源码在这里" tabindex="-1"><a href="https://github.com/bigwhite/publication/tree/master/column/timegeek/go-first-course/27/instrument_trace" target="_blank" rel="noreferrer">这个项目的源码在这里！</a> <a class="header-anchor" href="#这个项目的源码在这里" aria-label="Permalink to &quot;[这个项目的源码在这里！](https://github.com/bigwhite/publication/tree/master/column/timegeek/go-first-course/27/instrument_trace)&quot;">​</a></h4>`,126)])])}const g=s(l,[["render",i]]);export{m as __pageData,g as default};
