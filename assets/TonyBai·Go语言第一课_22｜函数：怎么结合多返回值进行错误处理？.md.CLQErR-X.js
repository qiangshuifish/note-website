import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"22｜函数：怎么结合多返回值进行错误处理？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Go语言是如何进行错误处理的？","slug":"go语言是如何进行错误处理的","link":"#go语言是如何进行错误处理的","children":[]},{"level":2,"title":"error类型与错误值构造","slug":"error类型与错误值构造","link":"#error类型与错误值构造","children":[]},{"level":2,"title":"策略一：透明错误处理策略","slug":"策略一-透明错误处理策略","link":"#策略一-透明错误处理策略","children":[]},{"level":2,"title":"策略二：“哨兵”错误处理策略","slug":"策略二-哨兵-错误处理策略","link":"#策略二-哨兵-错误处理策略","children":[]},{"level":2,"title":"策略三：错误值类型检视策略","slug":"策略三-错误值类型检视策略","link":"#策略三-错误值类型检视策略","children":[]},{"level":2,"title":"策略四：错误行为特征检视策略","slug":"策略四-错误行为特征检视策略","link":"#策略四-错误行为特征检视策略","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/22｜函数：怎么结合多返回值进行错误处理？.md","filePath":"TonyBai·Go语言第一课/22｜函数：怎么结合多返回值进行错误处理？.md","lastUpdated":1779817248000}'),r={name:"TonyBai·Go语言第一课/22｜函数：怎么结合多返回值进行错误处理？.md"};function i(l,s,t,o,c,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_22-函数-怎么结合多返回值进行错误处理" tabindex="-1">22｜函数：怎么结合多返回值进行错误处理？ <a class="header-anchor" href="#_22-函数-怎么结合多返回值进行错误处理" aria-label="Permalink to &quot;22｜函数：怎么结合多返回值进行错误处理？&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>上一节课，我们开始了Go函数的学习，对Go语言中的函数已经有了基础的了解。那么，今天这节课，我们要再进一步，学习怎么做好函数设计。</p><p>在上节课的函数声明部分，我们提到，多返回值是Go语言函数，区别于其他主流静态编程语言中函数的一个重要特点。同时，它也是Go语言设计者建构Go语言错误处理机制的基础，而错误处理设计也是做函数设计的一个重要环节。</p><p>所以今天这节课，我们将会从Go语言的错误处理机制入手，围绕Go语言错误处理机制的原理、Go错误处理的常见策略，来学习一下如何结合函数的多返回值机制进行错误处理的设计。</p><p>这会让你建立起Go编码的统一错误处理思维，写出更健壮的、让你自己更有信心的Go代码。</p><p>要想做好错误处理设计，我们首先要先来了解Go语言错误设计的基本思路与原理。</p><h2 id="go语言是如何进行错误处理的" tabindex="-1">Go语言是如何进行错误处理的？ <a class="header-anchor" href="#go语言是如何进行错误处理的" aria-label="Permalink to &quot;Go语言是如何进行错误处理的？&quot;">​</a></h2><p>采用什么错误处理方式，其实是一门编程语言在设计早期就要确定下来的基本机制，它在很大程度上影响着编程语言的语法形式、语言实现的难易程度，以及语言后续的演进方向。</p><p>我们前面已经多次提到，Go语言继承了“先祖”C语言的很多语法特性，在错误处理机制上也不例外，Go语言错误处理机制也是在C语言错误处理机制基础上的再创新。</p><p>那么这里，我们依然从源头讲起，先看看前辈C语言的错误处理机制。在C语言中，我们通常用一个类型为整型的函数返回值作为错误状态标识，函数调用者会基于值比较的方式，对这一代表错误状态的返回值进行检视。通常，这个返回值为0，就代表函数调用成功；如果这个返回值是其它值，那就代表函数调用出现错误。也就是说，函数调用者需要根据这个返回值代表的错误状态，来决定后续执行哪条错误处理路径上的代码。</p><p>C语言的这种简单的、 <strong>基于错误值比较</strong> 的错误处理机制有什么优点呢？</p><p>首先，它让每个开发人员必须显式地去关注和处理每个错误，经过显式错误处理的代码会更健壮，也会让开发人员对这些代码更有信心。</p><p>另外，你也可以发现，这些错误就是普通的值，所以我们不需要用额外的语言机制去处理它们，我们只需利用已有的语言机制，像处理其他普通类型值一样的去处理错误就可以了，这也让代码更容易调试，更容易针对每个错误处理的决策分支进行测试覆盖。C语言错误处理机制的这种简单与显式结合的特征，和Go语言设计哲学十分契合，于是Go语言设计者决定继承C语言这种错误处理机制。</p><p>不过C语言这种错误处理机制也有一些弊端。比如，由于C语言中的函数最多仅支持一个返回值，很多开发者会把这单一的返回值“一值多用”。什么意思呢？就是说，一个返回值，不仅要承载函数要返回给调用者的信息，又要承载函数调用的最终错误状态。比如C标准库中的 <code>fprintf</code> 函数的返回值就承载了两种含义。在正常情况下，它的返回值表示输出到FILE流中的字符数量，但如果出现错误，这个返回值就变成了一个负数，代表具体的错误值：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// stdio.h</span></span>
<span class="line"><span>int fprintf(FILE * restrict stream, const char * restrict format, ...);</span></span></code></pre></div><p>特别是当返回值为其他类型，比如字符串的时候，我们还很难将它与错误状态融合到一起。这个时候，很多C开发人员要么使用输出参数，承载要返回给调用者的信息，要么自定义一个包含返回信息与错误状态的结构体，作为返回值类型。大家做法不一，就很难形成统一的错误处理策略。</p><p>为了避免这种情况，Go函数增加了 <strong>多返回值机制</strong>，来支持错误状态与返回信息的分离，并建议开发者把要返回给调用者的信息和错误状态标识，分别放在不同的返回值中。</p><p>我们继续以上面C语言中的fprintf函数为例，Go标准库中有一个和功能等同的 <code>fmt.Fprintf</code> 的函数，这个函数就是使用一个独立的表示错误状态的返回值（如下面代码中的err），解决了fprintf函数中错误状态值与返回信息耦合在一起的问题：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// fmt包</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Fprintf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">w</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> io</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Writer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">format</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">a</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ...interface</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}) (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">n</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">err</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>我们看到，在fmt.Fprintf中，返回值n用来表示写入io.Writer中的字节个数，返回值err表示这个函数调用的最终状态，如果成功，err值就为nil，不成功就为特定的错误值。</p><p>另外我们还可以看到，fmt.Fprintf函数声明中代表错误状态的变量err的类型，并不是一个传统使用的整数类型，而是用了一个名为error的类型。</p><p>虽然，在Go语言中，我们依然可以像传统的C语言那样，用一个整型值来表示错误状态，但 <strong>Go语言惯用法</strong>，是使用error这个接口类型表示错误，并且按惯例，我们通常将error类型返回值放在返回值列表的末尾，就像fmt.Fprintf函数声明中那样。</p><p>那么error接口类型究竟如何表示错误？我们又该如何构造一个满足error接口类型的错误值呢？我们继续向下看。</p><h2 id="error类型与错误值构造" tabindex="-1">error类型与错误值构造 <a class="header-anchor" href="#error类型与错误值构造" aria-label="Permalink to &quot;error类型与错误值构造&quot;">​</a></h2><p>error接口是Go原生内置的类型，它的定义如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/builtin/builtin.go</span></span>
<span class="line"><span>type error interface {</span></span>
<span class="line"><span>    Error() string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>任何实现了error的Error方法的类型的实例，都可以作为错误值赋值给error接口变量。那这里，问题就来了： <strong>难道为了构造一个错误值，我们还需要自定义一个新类型来实现error接口吗</strong>？</p><p>Go语言的设计者显然也想到了这一点，他们在标准库中提供了两种方便Go开发者构造错误值的方法： <code>errors.New</code> 和 <code>fmt.Errorf</code> 。使用这两种方法，我们可以轻松构造出一个满足error接口的错误值，就像下面代码这样：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>err := errors.New(&quot;your first demo error&quot;)</span></span>
<span class="line"><span>errWithCtx = fmt.Errorf(&quot;index %d is out of bounds&quot;, i)</span></span></code></pre></div><p>这两种方法实际上返回的是同一个实现了error接口的类型的实例，这个未导出的类型就是 <code>errors.errorString</code>，它的定义是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/errors/errors.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type errorString struct {</span></span>
<span class="line"><span>    s string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (e *errorString) Error() string {</span></span>
<span class="line"><span>    return e.s</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>大多数情况下，使用这两种方法构建的错误值就可以满足我们的需求了。但我们也要看到，虽然这两种构建错误值的方法很方便，但它们给错误处理者提供的错误上下文（Error Context）只限于以字符串形式呈现的信息，也就是Error方法返回的信息。</p><p>但在一些场景下，错误处理者需要从错误值中提取出更多信息，帮助他选择错误处理路径，显然这两种方法就不能满足了。这个时候，我们可以自定义错误类型来满足这一需求。比如：标准库中的net包就定义了一种携带额外错误上下文的错误类型：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/net/net.go</span></span>
<span class="line"><span>type OpError struct {</span></span>
<span class="line"><span>    Op string</span></span>
<span class="line"><span>    Net string</span></span>
<span class="line"><span>    Source Addr</span></span>
<span class="line"><span>    Addr Addr</span></span>
<span class="line"><span>    Err error</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，错误处理者就可以根据这个类型的错误值提供的额外上下文信息，比如Op、Net、Source等，做出错误处理路径的选择，比如下面标准库中的代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/net/http/server.go</span></span>
<span class="line"><span>func isCommonNetReadError(err error) bool {</span></span>
<span class="line"><span>    if err == io.EOF {</span></span>
<span class="line"><span>        return true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if neterr, ok := err.(net.Error); ok &amp;&amp; neterr.Timeout() {</span></span>
<span class="line"><span>        return true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if oe, ok := err.(*net.OpError); ok &amp;&amp; oe.Op == &quot;read&quot; {</span></span>
<span class="line"><span>        return true</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，上面这段代码利用类型断言，判断error类型变量err的动态类型是否为 *net.OpError或 net.Error。如果err的动态类型是 *net.OpError，那么类型断言就会返回这个动态类型的值（存储在oe中），代码就可以通过判断它的Op字段是否为&quot;read&quot;来判断它是否为CommonNetRead类型的错误。</p><p>不过这里，你不用过多了解类型断言（Type Assertion）到底是什么，你只需要知道通过类型断言，我们可以判断接口类型的动态类型，以及获取它动态类型的值接可以了。后面我们在讲解接口类型的时候还会再细讲。</p><p>那么，使用error类型，而不是传统意义上的整型或其他类型作为错误类型，有什么好处呢？至少有这三点好处：</p><p><strong>第一点：统一了错误类型。</strong></p><p>如果不同开发者的代码、不同项目中的代码，甚至标准库中的代码，都统一以error接口变量的形式呈现错误类型，就能在提升代码可读性的同时，还更容易形成统一的错误处理策略。这个我们下面会细讲。</p><p><strong>第二点：错误是值。</strong></p><p>我们构造的错误都是值，也就是说，即便赋值给error这个接口类型变量，我们也可以像整型值那样对错误做“==”和“!=”的逻辑比较，函数调用者检视错误时的体验保持不变。</p><p><strong>第三点：易扩展，支持自定义错误上下文。</strong></p><p>虽然错误以error接口变量的形式统一呈现，但我们很容易通过自定义错误类型来扩展我们的错误上下文，就像前面的Go标准库的OpError类型那样。</p><p>error接口是错误值的提供者与错误值的检视者之间的契约。error接口的实现者负责提供错误上下文，供负责错误处理的代码使用。这种错误具体上下文与作为错误值类型的error接口类型的解耦，也体现了Go组合设计哲学中“正交”的理念。</p><p>到这里，我们已经基本了解了Go错误处理机制、统一的错误值类型，以及错误值构造方法。在这些基础上，我们可以再进一步，学习Go语言的几种错误处理的惯用策略，学习这些策略将有助于我们提升函数错误处理设计的能力。</p><h2 id="策略一-透明错误处理策略" tabindex="-1">策略一：透明错误处理策略 <a class="header-anchor" href="#策略一-透明错误处理策略" aria-label="Permalink to &quot;策略一：透明错误处理策略&quot;">​</a></h2><p>简单来说，Go语言中的错误处理，就是根据函数/方法返回的error类型变量中携带的错误值信息做决策，并选择后续代码执行路径的过程。</p><p>这样，最简单的错误策略莫过于完全不关心返回错误值携带的具体上下文信息，只要发生错误就进入唯一的错误处理执行路径，比如下面这段代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>err := doSomething()</span></span>
<span class="line"><span>if err != nil {</span></span>
<span class="line"><span>    // 不关心err变量底层错误值所携带的具体上下文信息</span></span>
<span class="line"><span>    // 执行简单错误处理逻辑并返回</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这也是Go语言中 <strong>最常见的错误处理策略</strong>，80%以上的Go错误处理情形都可以归类到这种策略下。在这种策略下，由于错误处理方并不关心错误值的上下文，所以错误值的构造方（如上面的函数 <code>doSomething</code>）可以直接使用Go标准库提供的两个基本错误值构造方法 <code>errors.New</code> 和 <code> fmt.Errorf</code> 来构造错误值，就像下面这样：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func doSomething(...) error {</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>    return errors.New(&quot;some error occurred&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样构造出的错误值代表的上下文信息，对错误处理方是透明的，因此这种策略称为 <strong>“透明错误处理策略”</strong>。在错误处理方不关心错误值上下文的前提下，透明错误处理策略能最大程度地减少错误处理方与错误值构造方之间的耦合关系。</p><h2 id="策略二-哨兵-错误处理策略" tabindex="-1">策略二：“哨兵”错误处理策略 <a class="header-anchor" href="#策略二-哨兵-错误处理策略" aria-label="Permalink to &quot;策略二：“哨兵”错误处理策略&quot;">​</a></h2><p>当错误处理方不能只根据“透明的错误值”就做出错误处理路径选取的情况下，错误处理方会尝试对返回的错误值进行检视，于是就有可能出现下面代码中的 <strong>反模式</strong>：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data, err := b.Peek(1)</span></span>
<span class="line"><span>if err != nil {</span></span>
<span class="line"><span>    switch err.Error() {</span></span>
<span class="line"><span>    case &quot;bufio: negative count&quot;:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    case &quot;bufio: buffer full&quot;:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    case &quot;bufio: invalid use of UnreadByte&quot;:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>简单来说，反模式就是，错误处理方以透明错误值所能提供的唯一上下文信息（描述错误的字符串），作为错误处理路径选择的依据。但这种“反模式”会造成严重的 <strong>隐式耦合</strong>。这也就意味着，错误值构造方不经意间的一次错误描述字符串的改动，都会造成错误处理方处理行为的变化，并且这种通过字符串比较的方式，对错误值进行检视的性能也很差。</p><p>那这有什么办法吗？Go标准库采用了定义导出的（Exported）“哨兵”错误值的方式，来辅助错误处理方检视（inspect）错误值并做出错误处理分支的决策，比如下面的bufio包中定义的“哨兵错误”：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/bufio/bufio.go</span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    ErrInvalidUnreadByte = errors.New(&quot;bufio: invalid use of UnreadByte&quot;)</span></span>
<span class="line"><span>    ErrInvalidUnreadRune = errors.New(&quot;bufio: invalid use of UnreadRune&quot;)</span></span>
<span class="line"><span>    ErrBufferFull        = errors.New(&quot;bufio: buffer full&quot;)</span></span>
<span class="line"><span>    ErrNegativeCount     = errors.New(&quot;bufio: negative count&quot;)</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>下面的代码片段利用了上面的哨兵错误，进行错误处理分支的决策：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data, err := b.Peek(1)</span></span>
<span class="line"><span>if err != nil {</span></span>
<span class="line"><span>    switch err {</span></span>
<span class="line"><span>    case bufio.ErrNegativeCount:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    case bufio.ErrBufferFull:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    case bufio.ErrInvalidUnreadByte:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        // ... ...</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以看到，一般“哨兵”错误值变量以ErrXXX格式命名。和透明错误策略相比，“哨兵”策略让错误处理方在有检视错误值的需求时候，可以“有的放矢”。</p><p>不过，对于API的开发者而言，暴露“哨兵”错误值也意味着这些错误值和包的公共函数/方法一起成为了API的一部分。一旦发布出去，开发者就要对它进行很好的维护。而“哨兵”错误值也让使用这些值的错误处理方对它产生了依赖。</p><p>从Go 1.13版本开始，标准库errors包提供了Is函数用于错误处理方对错误值的检视。Is函数类似于把一个error类型变量与“哨兵”错误值进行比较，比如下面代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 类似 if err == ErrOutOfBounds{ … }</span></span>
<span class="line"><span>if errors.Is(err, ErrOutOfBounds) {</span></span>
<span class="line"><span>    // 越界的错误处理</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不同的是，如果error类型变量的底层错误值是一个包装错误（Wrapped Error），errors.Is方法会沿着该包装错误所在错误链（Error Chain)，与链上所有被包装的错误（Wrapped Error）进行比较，直至找到一个匹配的错误为止。下面是Is函数应用的一个例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var ErrSentinel = errors.New(&quot;the underlying sentinel error&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	err1 := fmt.Errorf(&quot;wrap sentinel: %w&quot;, ErrSentinel)</span></span>
<span class="line"><span>	err2 := fmt.Errorf(&quot;wrap err1: %w&quot;, err1)</span></span>
<span class="line"><span>    println(err2 == ErrSentinel) //false</span></span>
<span class="line"><span>	if errors.Is(err2, ErrSentinel) {</span></span>
<span class="line"><span>		println(&quot;err2 is ErrSentinel&quot;)</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	println(&quot;err2 is not ErrSentinel&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个例子中，我们通过fmt.Errorf函数，并且使用%w创建包装错误变量err1和err2，其中err1实现了对ErrSentinel这个“哨兵错误值”的包装，而err2又对err1进行了包装，这样就形成了一条错误链。位于错误链最上层的是err2，位于最底层的是ErrSentinel。之后，我们再分别通过值比较和errors.Is这两种方法，判断err2与ErrSentinel的关系。运行上述代码，我们会看到如下结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>false</span></span>
<span class="line"><span>err2 is ErrSentinel</span></span></code></pre></div><p>我们看到，通过比较操作符对err2与ErrSentinel进行比较后，我们发现这二者并不相同。而errors.Is函数则会沿着err2所在错误链，向下找到被包装到最底层的“哨兵”错误值 <code>ErrSentinel</code>。</p><p>所以，如果你使用的是Go 1.13及后续版本，我建议你尽量使用 <code>errors.Is</code> 方法去检视某个错误值是否就是某个预期错误值，或者包装了某个特定的“哨兵”错误值。</p><h2 id="策略三-错误值类型检视策略" tabindex="-1">策略三：错误值类型检视策略 <a class="header-anchor" href="#策略三-错误值类型检视策略" aria-label="Permalink to &quot;策略三：错误值类型检视策略&quot;">​</a></h2><p>上面我们看到，基于Go标准库提供的错误值构造方法构造的“哨兵”错误值，除了让错误处理方可以“有的放矢”的进行值比较之外，并没有提供其他有效的错误上下文信息。那如果遇到错误处理方需要错误值提供更多的“错误上下文”的情况，上面这些错误处理策略和错误值构造方式都无法满足。</p><p>这种情况下，我们需要通过自定义错误类型的构造错误值的方式，来提供更多的“错误上下文”信息。并且，由于错误值都通过error接口变量统一呈现，要得到底层错误类型携带的错误上下文信息，错误处理方需要使用Go提供的 <strong>类型断言机制</strong>（Type Assertion）或 <strong>类型选择机制</strong>（Type Switch），这种错误处理方式，我称之为 <strong>错误值类型检视策略</strong>。</p><p>我们来看一个标准库中的例子加深下理解，这个json包中自定义了一个 <code>UnmarshalTypeError</code> 的错误类型：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/encoding/json/decode.go</span></span>
<span class="line"><span>type UnmarshalTypeError struct {</span></span>
<span class="line"><span>    Value  string</span></span>
<span class="line"><span>    Type   reflect.Type</span></span>
<span class="line"><span>    Offset int64</span></span>
<span class="line"><span>    Struct string</span></span>
<span class="line"><span>    Field  string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>错误处理方可以通过错误类型检视策略，获得更多错误值的错误上下文信息，下面就是利用这一策略的json包的一个方法的实现：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/encoding/json/decode.go</span></span>
<span class="line"><span>func (d *decodeState) addErrorContext(err error) error {</span></span>
<span class="line"><span>    if d.errorContext.Struct != nil || len(d.errorContext.FieldStack) &amp;gt; 0 {</span></span>
<span class="line"><span>        switch err := err.(type) {</span></span>
<span class="line"><span>        case *UnmarshalTypeError:</span></span>
<span class="line"><span>            err.Struct = d.errorContext.Struct.Name()</span></span>
<span class="line"><span>            err.Field = strings.Join(d.errorContext.FieldStack, &quot;.&quot;)</span></span>
<span class="line"><span>            return err</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，这段代码通过类型switch语句得到了err变量代表的动态类型和值，然后在匹配的case分支中利用错误上下文信息进行处理。</p><p>这里，一般自定义导出的错误类型以 <code>XXXError</code> 的形式命名。和“哨兵”错误处理策略一样，错误值类型检视策略，由于暴露了自定义的错误类型给错误处理方，因此这些错误类型也和包的公共函数/方法一起，成为了API的一部分。一旦发布出去，开发者就要对它们进行很好的维护。而它们也让使用这些类型进行检视的错误处理方对其产生了依赖。</p><p>从Go 1.13版本开始，标准库errors包提供了 <code>As</code> 函数给错误处理方检视错误值。 <code>As</code> 函数类似于通过类型断言判断一个error类型变量是否为特定的自定义错误类型，如下面代码所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 类似 if e, ok := err.(*MyError); ok { … }</span></span>
<span class="line"><span>var e *MyError</span></span>
<span class="line"><span>if errors.As(err, &amp;e) {</span></span>
<span class="line"><span>    // 如果err类型为*MyError，变量e将被设置为对应的错误值</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不同的是，如果error类型变量的动态错误值是一个包装错误， <code>errors.As</code> 函数会沿着该包装错误所在错误链，与链上所有被包装的错误的类型进行比较，直至找到一个匹配的错误类型，就像errors.Is函数那样。下面是 <code>As</code> 函数应用的一个例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type MyError struct {</span></span>
<span class="line"><span>    e string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (e *MyError) Error() string {</span></span>
<span class="line"><span>    return e.e</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var err = &amp;MyError{&quot;MyError error demo&quot;}</span></span>
<span class="line"><span>    err1 := fmt.Errorf(&quot;wrap err: %w&quot;, err)</span></span>
<span class="line"><span>    err2 := fmt.Errorf(&quot;wrap err1: %w&quot;, err1)</span></span>
<span class="line"><span>    var e *MyError</span></span>
<span class="line"><span>    if errors.As(err2, &amp;e) {</span></span>
<span class="line"><span>        println(&quot;MyError is on the chain of err2&quot;)</span></span>
<span class="line"><span>        println(e == err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    println(&quot;MyError is not on the chain of err2&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行上述代码会得到：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MyError is on the chain of err2</span></span>
<span class="line"><span>true</span></span></code></pre></div><p>我们看到， <code>errors.As</code> 函数沿着err2所在错误链向下找到了被包装到最深处的错误值，并将err2与其类型 <code> * MyError</code> 成功匹配。匹配成功后，errors.As会将匹配到的错误值存储到As函数的第二个参数中，这也是为什么 <code>println(e == err)</code> 输出true的原因。</p><p>所以，如果你使用的是Go 1.13及后续版本，请尽量使用 <code>errors.As</code> 方法去检视某个错误值是否是某自定义错误类型的实例。</p><h2 id="策略四-错误行为特征检视策略" tabindex="-1">策略四：错误行为特征检视策略 <a class="header-anchor" href="#策略四-错误行为特征检视策略" aria-label="Permalink to &quot;策略四：错误行为特征检视策略&quot;">​</a></h2><p>不知道你注意到没有，在前面我们已经讲过的三种策略中，其实只有第一种策略，也就是“透明错误处理策略”，有效降低了错误的构造方与错误处理方两者之间的耦合。虽然前面的策略二和策略三，都是我们实际编码中有效的错误处理策略，但其实使用这两种策略的代码，依然在错误的构造方与错误处理方两者之间建立了耦合。</p><p>那么除了“透明错误处理策略”外，我们是否还有手段可以降低错误处理方与错误值构造方的耦合呢？</p><p>在Go标准库中，我们发现了这样一种错误处理方式： <strong>将某个包中的错误类型归类，统一提取出一些公共的错误行为特征，并将这些错误行为特征放入一个公开的接口类型中</strong>。这种方式也被叫做错误行为特征检视策略。</p><p>以标准库中的 <code>net包</code> 为例，它将包内的所有错误类型的公共行为特征抽象并放入 <code>net.Error</code> 这个接口中，如下面代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/net/net.go</span></span>
<span class="line"><span>type Error interface {</span></span>
<span class="line"><span>    error</span></span>
<span class="line"><span>    Timeout() bool</span></span>
<span class="line"><span>    Temporary() bool</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，net.Error接口包含两个用于判断错误行为特征的方法：Timeout用来判断是否是超时（Timeout）错误，Temporary用于判断是否是临时（Temporary）错误。</p><p>而错误处理方只需要依赖这个公共接口，就可以检视具体错误值的错误行为特征信息，并根据这些信息做出后续错误处理分支选择的决策。</p><p>这里，我们再看一个http包使用错误行为特征检视策略进行错误处理的例子，加深下理解：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/net/http/server.go</span></span>
<span class="line"><span>func (srv *Server) Serve(l net.Listener) error {</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>    for {</span></span>
<span class="line"><span>        rw, e := l.Accept()</span></span>
<span class="line"><span>        if e != nil {</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &amp;lt;-srv.getDoneChan():</span></span>
<span class="line"><span>                return ErrServerClosed</span></span>
<span class="line"><span>            default:</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if ne, ok := e.(net.Error); ok &amp;&amp; ne.Temporary() {</span></span>
<span class="line"><span>                // 注：这里对临时性(temporary)错误进行处理</span></span>
<span class="line"><span>                ... ...</span></span>
<span class="line"><span>                time.Sleep(tempDelay)</span></span>
<span class="line"><span>                continue</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return e</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面代码中，Accept方法实际上返回的错误类型为 <code>*OpError</code>，它是net包中的一个自定义错误类型，它实现了错误公共特征接口 <code>net.Error</code>，如下代码所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/net/net.go</span></span>
<span class="line"><span>type OpError struct {</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>    // Err is the error that occurred during the operation.</span></span>
<span class="line"><span>    Err error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type temporary interface {</span></span>
<span class="line"><span>    Temporary() bool</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (e *OpError) Temporary() bool {</span></span>
<span class="line"><span>  if ne, ok := e.Err.(*os.SyscallError); ok {</span></span>
<span class="line"><span>      t, ok := ne.Err.(temporary)</span></span>
<span class="line"><span>      return ok &amp;&amp; t.Temporary()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  t, ok := e.Err.(temporary)</span></span>
<span class="line"><span>  return ok &amp;&amp; t.Temporary()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因此，OpError实例可以被错误处理方通过 <code>net.Error</code> 接口的方法，判断它的行为是否满足Temporary或Timeout特征。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天的课讲到这里就结束了。在这一讲中，我们重点讲解了Go函数设计中的一个重要环节： <strong>错误处理设计</strong>，希望通过这节课的内容，能帮助你建立起代码设计的意识，提高函数设计的水平。</p><p>Go语言继承了C语言的基于值比较的错误处理机制，但又在C语言的基础上做出了优化，也就是说，Go函数通过支持多返回值，消除了C语言中将错误状态值与返回给函数调用者的信息耦合在一起的弊端。</p><p>Go语言还统一错误类型为error接口类型，并提供了多种快速构建可赋值给error类型的错误值的函数，包括errors.New、fmt.Errorf等，我们还讲解了使用统一error作为错误类型的优点，你要深刻理解这一点。</p><p>基于Go错误处理机制、统一的错误值类型以及错误值构造方法的基础上，Go语言形成了多种错误处理的惯用策略，包括透明错误处理策略、“哨兵”错误处理策略、错误值类型检视策略以及错误行为特征检视策略等。这些策略都有适用的场合，但 <strong>没有某种单一的错误处理策略可以适合所有项目或所有场合</strong>。</p><p>在错误处理策略选择上，我有一些个人的建议，你可以参考一下：</p><ul><li>请尽量使用“透明错误”处理策略，降低错误处理方与错误值构造方之间的耦合；</li><li>如果可以从众多错误类型中提取公共的错误行为特征，那么请尽量使用“错误行为特征检视策略”;</li><li>在上述两种策略无法实施的情况下，再使用“哨兵”策略和“错误值类型检视”策略；</li><li>Go 1.13及后续版本中，尽量用 <code>errors.Is</code> 和 <code>errors.As</code> 函数替换原先的错误检视比较语句。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>这节课，我们列出了一些惯用的错误处理策略，当然，Go社区关于错误处理策略的讨论可能不止这些，你还见过哪些比较实用的错误处理策略吗？不妨在留言区和我们探讨一下吧。</p><p>欢迎你把这节课分享给更多对Go语言的错误处理机制感兴趣的朋友。我是Tony Bai，我们下节课见。</p>`,113)])])}const g=n(r,[["render",i]]);export{u as __pageData,g as default};
