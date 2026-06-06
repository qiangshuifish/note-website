import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"19 | 错误处理（下）：如何设计错误包？","description":"","frontmatter":{},"headers":[{"level":2,"title":"错误包需要具有哪些功能？","slug":"错误包需要具有哪些功能","link":"#错误包需要具有哪些功能","children":[]},{"level":2,"title":"错误包实现","slug":"错误包实现","link":"#错误包实现","children":[]},{"level":2,"title":"如何记录错误？","slug":"如何记录错误","link":"#如何记录错误","children":[]},{"level":2,"title":"一个错误码的具体实现","slug":"一个错误码的具体实现","link":"#一个错误码的具体实现","children":[]},{"level":2,"title":"错误码实际使用方法示例","slug":"错误码实际使用方法示例","link":"#错误码实际使用方法示例","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/19-错误处理（下）：如何设计错误包？.md","filePath":"Go语言项目开发实战/19-错误处理（下）：如何设计错误包？.md","lastUpdated":1779815754000}'),r={name:"Go语言项目开发实战/19-错误处理（下）：如何设计错误包？.md"};function t(o,s,l,i,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_19-错误处理-下-如何设计错误包" tabindex="-1">19 | 错误处理（下）：如何设计错误包？ <a class="header-anchor" href="#_19-错误处理-下-如何设计错误包" aria-label="Permalink to &quot;19 | 错误处理（下）：如何设计错误包？&quot;">​</a></h1><p>你好，我是孔令飞。</p><p>在Go项目开发中，错误是我们必须要处理的一个事项。除了我们上一讲学习过的错误码，处理错误也离不开错误包。</p><p>业界有很多优秀的、开源的错误包可供选择，例如Go标准库自带的 <code>errors</code> 包、 <code>github.com/pkg/errors</code> 包。但是这些包目前还不支持业务错误码，很难满足生产级应用的需求。所以，在实际开发中，我们有必要开发出适合自己错误码设计的错误包。当然，我们也没必要自己从0开发，可以基于一些优秀的包来进行二次封装。</p><p>这一讲里，我们就来一起看看，如何设计一个错误包来适配上一讲我们设计的错误码，以及一个错误码的具体实现。</p><h2 id="错误包需要具有哪些功能" tabindex="-1">错误包需要具有哪些功能？ <a class="header-anchor" href="#错误包需要具有哪些功能" aria-label="Permalink to &quot;错误包需要具有哪些功能？&quot;">​</a></h2><p>要想设计一个优秀的错误包，我们首先得知道一个优秀的错误包需要具备哪些功能。在我看来，至少需要有下面这六个功能：</p><p><strong>首先，应该能支持错误堆栈。</strong> 我们来看下面一段代码，假设保存在 <a href="https://github.com/marmotedu/gopractise-demo/blob/master/errors/bad.go" target="_blank" rel="noreferrer">bad.go</a> 文件中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;fmt&quot;</span></span>
<span class="line"><span>	&quot;log&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	if err := funcA(); err != nil {</span></span>
<span class="line"><span>		log.Fatalf(&quot;call func got failed: %v&quot;, err)</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	log.Println(&quot;call func success&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func funcA() error {</span></span>
<span class="line"><span>	if err := funcB(); err != nil {</span></span>
<span class="line"><span>		return err</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return fmt.Errorf(&quot;func called error&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func funcB() error {</span></span>
<span class="line"><span>	return fmt.Errorf(&quot;func called error&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行上面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run bad.go</span></span>
<span class="line"><span>2021/07/02 08:06:55 call func got failed: func called error</span></span>
<span class="line"><span>exit status 1</span></span></code></pre></div><p>这时我们想定位问题，但不知道具体是哪行代码报的错误，只能靠猜，还不一定能猜到。为了解决这个问题，我们可以加一些Debug信息，来协助我们定位问题。这样做在测试环境是没问题的，但是在线上环境，一方面修改、发布都比较麻烦，另一方面问题可能比较难重现。这时候我们会想，要是能打印错误的堆栈就好了。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2021/07/02 14:17:03 call func got failed: func called error</span></span>
<span class="line"><span>main.funcB</span></span>
<span class="line"><span>	/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/good.go:27</span></span>
<span class="line"><span>main.funcA</span></span>
<span class="line"><span>	/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/good.go:19</span></span>
<span class="line"><span>main.main</span></span>
<span class="line"><span>	/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/good.go:10</span></span>
<span class="line"><span>runtime.main</span></span>
<span class="line"><span>	/home/colin/go/go1.16.2/src/runtime/proc.go:225</span></span>
<span class="line"><span>runtime.goexit</span></span>
<span class="line"><span>	/home/colin/go/go1.16.2/src/runtime/asm_amd64.s:1371</span></span>
<span class="line"><span>exit status 1</span></span></code></pre></div><p>通过上面的错误输出，我们可以很容易地知道是哪行代码报的错，从而极大提高问题定位的效率，降低定位的难度。所以，在我看来，一个优秀的errors包，首先需要支持错误堆栈。</p><p><strong>其次，能够支持不同的打印格式。</strong> 例如 <code>%+v</code>、 <code>%v</code>、 <code>%s</code> 等格式，可以根据需要打印不同丰富度的错误信息。</p><p><strong>再次，能支持Wrap/Unwrap功能，也就是在已有的错误上，追加一些新的信息。</strong> 例如 <code>errors.Wrap(err, &quot;open file failed&quot;)</code> 。Wrap通常用在调用函数中，调用函数可以基于被调函数报错时的错误Wrap一些自己的信息，丰富报错信息，方便后期的错误定位，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func funcA() error {</span></span>
<span class="line"><span>    if err := funcB(); err != nil {</span></span>
<span class="line"><span>        return errors.Wrap(err, &quot;call funcB failed&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return errors.New(&quot;func called error&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func funcB() error {</span></span>
<span class="line"><span>    return errors.New(&quot;func called error&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里要注意，不同的错误类型，Wrap函数的逻辑也可以不同。另外，在调用Wrap时，也会生成一个错误堆栈节点。我们既然能够嵌套error，那有时候还可能需要获取被嵌套的error，这时就需要错误包提供 <code>Unwrap</code> 函数。</p><p><strong>还有，错误包应该有 <code>Is</code> 方法</strong>。在实际开发中，我们经常需要判断某个error是否是指定的error。在Go 1.13之前，也就是没有wrapping error的时候，我们要判断error是不是同一个，可以使用如下方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if err == os.ErrNotExist {</span></span>
<span class="line"><span>	// normal code</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是现在，因为有了wrapping error，这样判断就会有问题。因为你根本不知道返回的err是不是一个嵌套的error，嵌套了几层。这种情况下，我们的错误包就需要提供 <code>Is</code> 函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Is(err, target error) bool</span></span></code></pre></div><p>当err和target是同一个，或者err是一个wrapping error的时候，如果target也包含在这个嵌套error链中，返回true，否则返回fasle。</p><p><strong>另外，错误包应该支持</strong> <code>As</code> <strong>函数。</strong></p><p>在Go 1.13之前，没有wrapping error的时候，我们要把error转为另外一个error，一般都是使用type assertion或者type switch，也就是类型断言。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if perr, ok := err.(*os.PathError); ok {</span></span>
<span class="line"><span>	fmt.Println(perr.Path)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是现在，返回的err可能是嵌套的error，甚至好几层嵌套，这种方式就不能用了。所以，我们可以通过实现 <code>As</code> 函数来完成这种功能。现在我们把上面的例子，用 <code>As</code> 函数实现一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var perr *os.PathError</span></span>
<span class="line"><span>if errors.As(err, &amp;perr) {</span></span>
<span class="line"><span>	fmt.Println(perr.Path)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样就可以完全实现类型断言的功能，而且还更强大，因为它可以处理wrapping error。</p><p><strong>最后，能够支持两种错误创建方式：非格式化创建和格式化创建。</strong> 例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>errors.New(&quot;file not found&quot;)</span></span>
<span class="line"><span>errors.Errorf(&quot;file %s not found&quot;, &quot;iam-apiserver&quot;)</span></span></code></pre></div><p>上面，我们介绍了一个优秀的错误包应该具备的功能。一个好消息是，Github上有不少实现了这些功能的错误包，其中 <code>github.com/pkg/errors</code> 包最受欢迎。所以，我基于 <code>github.com/pkg/errors</code> 包进行了二次封装，用来支持上一讲所介绍的错误码。</p><h2 id="错误包实现" tabindex="-1">错误包实现 <a class="header-anchor" href="#错误包实现" aria-label="Permalink to &quot;错误包实现&quot;">​</a></h2><p>明确优秀的错误包应该具备的功能后，我们来看下错误包的实现。实现的源码存放在 <a href="https://github.com/marmotedu/errors" target="_blank" rel="noreferrer">github.com/marmotedu/errors</a>。</p><p>我通过在文件 <a href="https://github.com/marmotedu/errors/blob/master/errors.go#L299" target="_blank" rel="noreferrer">github.com/pkg/errors/errors.go</a> 中增加新的 <code>withCode</code> 结构体，来引入一种新的错误类型，该错误类型可以记录错误码、stack、cause和具体的错误信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type withCode struct {</span></span>
<span class="line"><span>    err   error // error 错误</span></span>
<span class="line"><span>    code  int // 业务错误码</span></span>
<span class="line"><span>    cause error // cause error</span></span>
<span class="line"><span>    *stack</span><span> // 错误堆栈</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面，我们通过一个示例，来了解下 <code>github.com/marmotedu/errors</code> 所提供的功能。假设下述代码保存在 <code>errors.go</code> 文件中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/marmotedu/errors&quot;</span></span>
<span class="line"><span>	code &quot;github.com/marmotedu/sample-code&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	if err := bindUser(); err != nil {</span></span>
<span class="line"><span>		// %s: Returns the user-safe error string mapped to the error code or the error message if none is specified.</span></span>
<span class="line"><span>		fmt.Println(&quot;====================&amp;gt; %s &amp;lt;====================&quot;)</span></span>
<span class="line"><span>		fmt.Printf(&quot;%s\\n\\n&quot;, err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// %v: Alias for %s.</span></span>
<span class="line"><span>		fmt.Println(&quot;====================&amp;gt; %v &amp;lt;====================&quot;)</span></span>
<span class="line"><span>		fmt.Printf(&quot;%v\\n\\n&quot;, err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// %-v: Output caller details, useful for troubleshooting.</span></span>
<span class="line"><span>		fmt.Println(&quot;====================&amp;gt; %-v &amp;lt;====================&quot;)</span></span>
<span class="line"><span>		fmt.Printf(&quot;%-v\\n\\n&quot;, err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// %+v: Output full error stack details, useful for debugging.</span></span>
<span class="line"><span>		fmt.Println(&quot;====================&amp;gt; %+v &amp;lt;====================&quot;)</span></span>
<span class="line"><span>		fmt.Printf(&quot;%+v\\n\\n&quot;, err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// %#-v: Output caller details, useful for troubleshooting with JSON formatted output.</span></span>
<span class="line"><span>		fmt.Println(&quot;====================&amp;gt; %#-v &amp;lt;====================&quot;)</span></span>
<span class="line"><span>		fmt.Printf(&quot;%#-v\\n\\n&quot;, err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// %#+v: Output full error stack details, useful for debugging with JSON formatted output.</span></span>
<span class="line"><span>		fmt.Println(&quot;====================&amp;gt; %#+v &amp;lt;====================&quot;)</span></span>
<span class="line"><span>		fmt.Printf(&quot;%#+v\\n\\n&quot;, err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// do some business process based on the error type</span></span>
<span class="line"><span>		if errors.IsCode(err, code.ErrEncodingFailed) {</span></span>
<span class="line"><span>			fmt.Println(&quot;this is a ErrEncodingFailed error&quot;)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if errors.IsCode(err, code.ErrDatabase) {</span></span>
<span class="line"><span>			fmt.Println(&quot;this is a ErrDatabase error&quot;)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// we can also find the cause error</span></span>
<span class="line"><span>		fmt.Println(errors.Cause(err))</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bindUser() error {</span></span>
<span class="line"><span>	if err := getUser(); err != nil {</span></span>
<span class="line"><span>		// Step3: Wrap the error with a new error message and a new error code if needed.</span></span>
<span class="line"><span>		return errors.WrapC(err, code.ErrEncodingFailed, &quot;encoding user &#39;Lingfei Kong&#39; failed.&quot;)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func getUser() error {</span></span>
<span class="line"><span>	if err := queryDatabase(); err != nil {</span></span>
<span class="line"><span>		// Step2: Wrap the error with a new error message.</span></span>
<span class="line"><span>		return errors.Wrap(err, &quot;get user failed.&quot;)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func queryDatabase() error {</span></span>
<span class="line"><span>	// Step1. Create error with specified error code.</span></span>
<span class="line"><span>	return errors.WithCode(code.ErrDatabase, &quot;user &#39;Lingfei Kong&#39; not found.&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，通过 <a href="https://github.com/marmotedu/errors/blob/v1.0.2/errors.go#L306" target="_blank" rel="noreferrer">WithCode</a> 函数来创建新的withCode类型的错误；通过 <a href="https://github.com/marmotedu/errors/blob/v1.0.2/errors.go#L314" target="_blank" rel="noreferrer">WrapC</a> 来将一个error封装成一个withCode类型的错误；通过 <a href="https://github.com/marmotedu/errors/blob/v1.0.2/code.go#L121" target="_blank" rel="noreferrer">IsCode</a> 来判断一个error链中是否包含指定的code。</p><p>withCode错误实现了一个 <code>func (w *withCode) Format(state fmt.State, verb rune)</code> 方法，该方法用来打印不同格式的错误信息，见下表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/393022/18a93313e017d4f3b21370099d011c5c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/393022/18a93313e017d4f3b21370099d011c5c.png" alt=""></a></p><p>例如， <code>%+v</code> 会打印以下错误信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>get user failed. - #1 [/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/errortrack_errors.go:19 (main.getUser)] (100101) Database error; user &#39;Lingfei Kong&#39; not found. - #0 [/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/errortrack_errors.go:26 (main.queryDatabase)] (100101) Database error</span></span></code></pre></div><p>那么你可能会问，这些错误信息中的 <code>100101</code> 错误码，还有 <code>Database error</code> 这种对外展示的报错信息等等，是从哪里获取的？这里我简单解释一下。</p><p>首先， <code>withCode</code> 中包含了int类型的错误码，例如 <code>100101</code>。</p><p>其次，当使用 <code>github.com/marmotedu/errors</code> 包的时候，需要调用 <code>Register</code> 或者 <code>MustRegister</code>，将一个Coder注册到 <code>github.com/marmotedu/errors</code> 开辟的内存中，数据结构为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var codes = map[int]Coder{}</span></span></code></pre></div><p>Coder是一个接口，定义为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Coder interface {</span></span>
<span class="line"><span>    // HTTP status that should be used for the associated error code.</span></span>
<span class="line"><span>    HTTPStatus() int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // External (user) facing error text.</span></span>
<span class="line"><span>    String() string</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Reference returns the detail documents for user.</span></span>
<span class="line"><span>    Reference() string</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Code returns the code of the coder</span></span>
<span class="line"><span>    Code() int</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样 <code>withCode</code> 的 <code>Format</code> 方法，就能够通过 <code>withCode</code> 中的code字段获取到对应的Coder，并通过Coder提供的HTTPStatus、String、Reference、Code函数，来获取 <code>withCode</code> 中code的详细信息，最后格式化打印。</p><p>这里要注意，我们实现了两个注册函数： <code>Register</code> 和 <code>MustRegister</code>，二者唯一区别是：当重复定义同一个错误Code时， <code>MustRegister</code> 会panic，这样可以防止后面注册的错误覆盖掉之前注册的错误。在实际开发中，建议使用 <code>MustRegister</code>。</p><p><code>XXX()</code> 和 <code>MustXXX()</code> 的函数命名方式，是一种Go代码设计技巧，在Go代码中经常使用，例如Go标准库中 <code>regexp</code> 包提供的 <code>Compile</code> 和 <code>MustCompile</code> 函数。和 <code>XXX</code> 相比， <code>MustXXX</code> 会在某种情况不满足时panic。因此使用 <code>MustXXX</code> 的开发者看到函数名就会有一个心理预期：使用不当，会造成程序panic。</p><p>最后，我还有一个建议：在实际的生产环境中，我们可以使用JSON格式打印日志，JSON格式的日志可以非常方便的供日志系统解析。我们可以根据需要，选择 <code>%#-v</code> 或 <code>%#+v</code> 两种格式。</p><p>错误包在代码中，经常被调用，所以我们要保证错误包一定要是高性能的，否则很可能会影响接口的性能。这里，我们再来看下 <code>github.com/marmotedu/errors</code> 包的性能。</p><p>在这里，我们把这个错误包跟go标准库的 <code>errors</code> 包，以及 <code>github.com/pkg/errors</code> 包进行对比，来看看它们的性能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$  go test -test.bench=BenchmarkErrors -benchtime=&quot;3s&quot;</span></span>
<span class="line"><span>goos: linux</span></span>
<span class="line"><span>goarch: amd64</span></span>
<span class="line"><span>pkg: github.com/marmotedu/errors</span></span>
<span class="line"><span>BenchmarkErrors/errors-stack-10-8         	57658672	        61.8 ns/op	      16 B/op	       1 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/pkg/errors-stack-10-8     	 2265558	      1547 ns/op	     320 B/op	       3 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/marmot/errors-stack-10-8  	 1903532	      1772 ns/op	     360 B/op	       5 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/errors-stack-100-8        	 4883659	       734 ns/op	      16 B/op	       1 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/pkg/errors-stack-100-8    	 1202797	      2881 ns/op	     320 B/op	       3 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/marmot/errors-stack-100-8 	 1000000	      3116 ns/op	     360 B/op	       5 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/errors-stack-1000-8       	  505636	      7159 ns/op	      16 B/op	       1 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/pkg/errors-stack-1000-8   	  327681	     10646 ns/op	     320 B/op	       3 allocs/op</span></span>
<span class="line"><span>BenchmarkErrors/marmot/errors-stack-1000-8         	  304160	     11896 ns/op	     360 B/op	       5 allocs/op</span></span>
<span class="line"><span>PASS</span></span>
<span class="line"><span>ok  	github.com/marmotedu/errors	39.200s</span></span></code></pre></div><p>可以看到 <code>github.com/marmotedu/errors</code> 和 <code>github.com/pkg/errors</code> 包的性能基本持平。在对比性能时，重点关注 <strong>ns/op</strong>，也即每次error操作耗费的纳秒数。另外，我们还需要测试不同error嵌套深度下的error操作性能，嵌套越深，性能越差。例如：在嵌套深度为10的时候， <code>github.com/pkg/errors</code> 包ns/op值为1547， <code>github.com/marmotedu/errors</code> 包ns/op值为1772。可以看到，二者性能基本保持一致。</p><p>具体性能数据对比见下表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/393022/a6a794d7523bc1edfa459d3a49f9685e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/393022/a6a794d7523bc1edfa459d3a49f9685e.png" alt=""></a></p><p>我们是通过 <a href="https://github.com/marmotedu/errors/blob/v1.0.2/bench_test.go#L39" target="_blank" rel="noreferrer">BenchmarkErrors</a> 测试函数来测试error包性能的，你感兴趣可以打开链接看看。</p><h2 id="如何记录错误" tabindex="-1">如何记录错误？ <a class="header-anchor" href="#如何记录错误" aria-label="Permalink to &quot;如何记录错误？&quot;">​</a></h2><p>上面，我们一起看了怎么设计一个优秀的错误包，那如何用我们设计的错误包来记录错误呢？</p><p>根据我的开发经验，我推荐两种记录错误的方式，可以帮你快速定位问题。</p><p>方式一：通过 <code>github.com/marmotedu/errors</code> 包提供的错误堆栈能力，来跟踪错误。</p><p>具体你可以看看下面的代码示例。以下代码保存在 <a href="https://github.com/marmotedu/gopractise-demo/blob/master/errors/errortrack_errors.go" target="_blank" rel="noreferrer">errortrack_errors.go</a> 中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/marmotedu/errors&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	code &quot;github.com/marmotedu/sample-code&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	if err := getUser(); err != nil {</span></span>
<span class="line"><span>		fmt.Printf(&quot;%+v\\n&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func getUser() error {</span></span>
<span class="line"><span>	if err := queryDatabase(); err != nil {</span></span>
<span class="line"><span>		return errors.Wrap(err, &quot;get user failed.&quot;)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func queryDatabase() error {</span></span>
<span class="line"><span>	return errors.WithCode(code.ErrDatabase, &quot;user &#39;Lingfei Kong&#39; not found.&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行上述的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run errortrack_errors.go</span></span>
<span class="line"><span>get user failed. - #1 [/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/errortrack_errors.go:19 (main.getUser)] (100101) Database error; user &#39;Lingfei Kong&#39; not found. - #0 [/home/colin/workspace/golang/src/github.com/marmotedu/gopractise-demo/errors/errortrack_errors.go:26 (main.queryDatabase)] (100101) Database error</span></span></code></pre></div><p>可以看到，打印的日志中打印出了详细的错误堆栈，包括错误发生的函数、文件名、行号和错误信息，通过这些错误堆栈，我们可以很方便地定位问题。</p><p>你使用这种方法时，我推荐的用法是，在错误最开始处使用 <code>errors.WithCode()</code> 创建一个 withCode类型的错误。上层在处理底层返回的错误时，可以根据需要，使用Wrap函数基于该错误封装新的错误信息。如果要包装的error不是用 <code>github.com/marmotedu/errors</code> 包创建的，建议用 <code>errors.WithCode()</code> 新建一个error。</p><p>方式二：在错误产生的最原始位置调用日志包记录函数，打印错误信息，其他位置直接返回（当然，也可以选择性的追加一些错误信息，方便故障定位）。示例代码（保存在 <a href="https://github.com/marmotedu/gopractise-demo/blob/master/errors/errortrack_log.go" target="_blank" rel="noreferrer">errortrack_log.go</a>）如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/marmotedu/errors&quot;</span></span>
<span class="line"><span>	&quot;github.com/marmotedu/log&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	code &quot;github.com/marmotedu/sample-code&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	if err := getUser(); err != nil {</span></span>
<span class="line"><span>		fmt.Printf(&quot;%v\\n&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func getUser() error {</span></span>
<span class="line"><span>	if err := queryDatabase(); err != nil {</span></span>
<span class="line"><span>		return err</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func queryDatabase() error {</span></span>
<span class="line"><span>	opts := &amp;log.Options{</span></span>
<span class="line"><span>		Level:            &quot;info&quot;,</span></span>
<span class="line"><span>		Format:           &quot;console&quot;,</span></span>
<span class="line"><span>		EnableColor:      true,</span></span>
<span class="line"><span>		EnableCaller:     true,</span></span>
<span class="line"><span>		OutputPaths:      []string{&quot;test.log&quot;, &quot;stdout&quot;},</span></span>
<span class="line"><span>		ErrorOutputPaths: []string{},</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	log.Init(opts)</span></span>
<span class="line"><span>	defer log.Flush()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	err := errors.WithCode(code.ErrDatabase, &quot;user &#39;Lingfei Kong&#39; not found.&quot;)</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		log.Errorf(&quot;%v&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行以上代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run errortrack_log.go</span></span>
<span class="line"><span>2021-07-03 14:37:31.597	ERROR	errors/errortrack_log.go:41	Database error</span></span>
<span class="line"><span>Database error</span></span></code></pre></div><p>当错误发生时，调用log包打印错误。通过log包的caller功能，可以定位到log语句的位置，也就是定位到错误发生的位置。你使用这种方式来打印日志时，我有两个建议。</p><ul><li>只在错误产生的最初位置打印日志，其他地方直接返回错误，一般不需要再对错误进行封装。</li><li>当代码调用第三方包的函数时，第三方包函数出错时打印错误信息。比如：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if err := os.Chdir(&quot;/root&quot;); err != nil {</span></span>
<span class="line"><span>    log.Errorf(&quot;change dir failed: %v&quot;, err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="一个错误码的具体实现" tabindex="-1">一个错误码的具体实现 <a class="header-anchor" href="#一个错误码的具体实现" aria-label="Permalink to &quot;一个错误码的具体实现&quot;">​</a></h2><p>接下来，我们看一个依据上一讲介绍的错误码规范的具体错误码实现 <code>github.com/marmotedu/sample-code</code>。</p><p><code>sample-code</code> 实现了两类错误码，分别是通用错误码（ <a href="https://github.com/marmotedu/sample-code/blob/master/base.go" target="_blank" rel="noreferrer">sample-code/base.go</a>）和业务模块相关的错误码（ <a href="https://github.com/marmotedu/sample-code/blob/master/apiserver.go" target="_blank" rel="noreferrer">sample-code/apiserver.go</a>）。</p><p>首先，我们来看通用错误码的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 通用: 基本错误</span></span>
<span class="line"><span>// Code must start with 1xxxxx</span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>    // ErrSuccess - 200: OK.</span></span>
<span class="line"><span>    ErrSuccess int = iota + 100001</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ErrUnknown - 500: Internal server error.</span></span>
<span class="line"><span>    ErrUnknown</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ErrBind - 400: Error occurred while binding the request body to the struct.</span></span>
<span class="line"><span>    ErrBind</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ErrValidation - 400: Validation failed.</span></span>
<span class="line"><span>    ErrValidation</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ErrTokenInvalid - 401: Token invalid.</span></span>
<span class="line"><span>    ErrTokenInvalid</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>在代码中，我们通常使用整型常量（ErrSuccess）来代替整型错误码（100001），因为使用ErrSuccess时，一看就知道它代表的错误类型，可以方便开发者使用。</p><p>错误码用来指代一个错误类型，该错误类型需要包含一些有用的信息，例如对应的HTTP Status Code、对外展示的Message，以及跟该错误匹配的帮助文档。所以，我们还需要实现一个Coder来承载这些信息。这里，我们定义了一个实现了 <code>github.com/marmotedu/errors.Coder</code> 接口的 <code>ErrCode</code> 结构体：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ErrCode implements \`github.com/marmotedu/errors\`.Coder interface.</span></span>
<span class="line"><span>type ErrCode struct {</span></span>
<span class="line"><span>    // C refers to the code of the ErrCode.</span></span>
<span class="line"><span>    C int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // HTTP status that should be used for the associated error code.</span></span>
<span class="line"><span>    HTTP int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // External (user) facing error text.</span></span>
<span class="line"><span>    Ext string</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Ref specify the reference document.</span></span>
<span class="line"><span>    Ref string</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到 <code>ErrCode</code> 结构体包含了以下信息：</p><ul><li>int类型的业务码。</li><li>对应的HTTP Status Code。</li><li>暴露给外部用户的消息。</li><li>错误的参考文档。</li></ul><p>下面是一个具体的Coder示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>coder := &amp;ErrCode{</span></span>
<span class="line"><span>    C:    100001,</span></span>
<span class="line"><span>    HTTP: 200,</span></span>
<span class="line"><span>    Ext:  &quot;OK&quot;,</span></span>
<span class="line"><span>    Ref:  &quot;https://github.com/marmotedu/sample-code/blob/master/README.md&quot;,</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们就可以调用 <code>github.com/marmotedu/errors</code> 包提供的 <code>Register</code> 或者 <code>MustRegister</code> 函数，将Coder注册到 <code>github.com/marmotedu/errors</code> 包维护的内存中。</p><p>一个项目有很多个错误码，如果每个错误码都手动调用 <code>MustRegister</code> 函数会很麻烦，这里我们通过代码自动生成的方法，来生成register函数调用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//go:generate codegen -type=int</span></span>
<span class="line"><span>//go:generate codegen -type=int -doc -output ./error_code_generated.md</span></span></code></pre></div><p><code>//go:generate codegen -type=int</code> 会调用 <a href="https://github.com/marmotedu/iam/tree/master/tools/codegen" target="_blank" rel="noreferrer">codegen</a> 工具，生成 <a href="https://github.com/marmotedu/sample-code/blob/master/sample_code_generated.go" target="_blank" rel="noreferrer">sample_code_generated.go</a> 源码文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func init() {</span></span>
<span class="line"><span>	register(ErrSuccess, 200, &quot;OK&quot;)</span></span>
<span class="line"><span>	register(ErrUnknown, 500, &quot;Internal server error&quot;)</span></span>
<span class="line"><span>	register(ErrBind, 400, &quot;Error occurred while binding the request body to the struct&quot;)</span></span>
<span class="line"><span>	register(ErrValidation, 400, &quot;Validation failed&quot;)</span></span>
<span class="line"><span>    // other register function call</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/code/code.go#L58" target="_blank" rel="noreferrer">register</a> 调用放在init函数中，在加载程序的时候被初始化。</p><p>这里要注意，在注册的时候，我们会检查HTTP Status Code，只允许定义200、400、401、403、404、500这6个HTTP错误码。这里通过程序保证了错误码是符合HTTP Status Code使用要求的。</p><p><code>//go:generate codegen -type=int -doc -output ./error_code_generated.md</code> 会生成错误码描述文档 <a href="https://github.com/marmotedu/sample-code/blob/master/error_code_generated.md" target="_blank" rel="noreferrer">error_code_generated.md</a>。当我们提供API文档时，也需要记着提供一份错误码描述文档，这样客户端才可以根据错误码，知道请求是否成功，以及具体发生哪类错误，好针对性地做一些逻辑处理。</p><p><code>codegen</code> 工具会根据错误码注释生成 <code>sample_code_generated.go</code> 和 <code>error_code_generated.md</code> 文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ErrSuccess - 200: OK.</span></span>
<span class="line"><span> ErrSuccess int = iota + 100001</span></span></code></pre></div><p>codegen工具之所以能够生成 <code>sample_code_generated.go</code> 和 <code>error_code_generated.md</code>，是因为我们的错误码注释是有规定格式的： <code>// &amp;lt;错误码整型常量&gt; - &amp;lt;对应的HTTP Status Code&gt;: &amp;lt;External Message&gt;.</code>。</p><p>codegen工具可以在IAM项目根目录下，执行以下命令来安装：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ make tools.install.codegen</span></span></code></pre></div><p>安装完 <code>codegen</code> 工具后，可以在 <code>github.com/marmotedu/sample-code</code> 包根目录下执行 <code>go generate</code> 命令，来生成 <code>sample_code_generated.go</code> 和 <code>error_code_generated.md</code>。这里有个技巧需要你注意：生成的文件建议统一用 <code>xxxx_generated.xx</code> 来命名，这样通过 <code>generated</code> ，我们就知道这个文件是代码自动生成的，有助于我们理解和使用。</p><p>在实际的开发中，我们可以将错误码独立成一个包，放在 <code>internal/pkg/code/</code> 目录下，这样可以方便整个应用调用。例如IAM的错误码就放在IAM项目根目录下的 <a href="https://github.com/marmotedu/iam/tree/master/internal/pkg/code" target="_blank" rel="noreferrer">internal/pkg/code/</a> 目录下。</p><p>我们的错误码是分服务和模块的，所以这里建议你把相同的服务放在同一个Go源文件中，例如IAM的错误码存放文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ls base.go apiserver.go authzserver.go</span></span>
<span class="line"><span>apiserver.go  authzserver.go  base.go</span></span></code></pre></div><p>一个应用中会有多个服务，例如IAM应用中，就包含了iam-apiserver、iam-authz-server、iam-pump三个服务。这些服务有一些通用的错误码，为了便于维护，可以将这些通用的错误码统一放在base.go源码文件中。其他的错误码，我们可以按服务分别放在不同的文件中：iam-apiserver服务的错误码统一放在apiserver.go文件中；iam-authz-server的错误码统一存放在authzserver.go文件中。其他服务以此类推。</p><p>另外，同一个服务中不同模块的错误码，可以按以下格式来组织：相同模块的错误码放在同一个const代码块中，不同模块的错误码放在不同的const代码块中。每个const代码块的开头注释就是该模块的错误码定义。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// iam-apiserver: user errors.</span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>    // ErrUserNotFound - 404: User not found.</span></span>
<span class="line"><span>    ErrUserNotFound int = iota + 110001</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ErrUserAlreadyExist - 400: User already exist.</span></span>
<span class="line"><span>    ErrUserAlreadyExist</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// iam-apiserver: secret errors.</span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>    // ErrEncrypt - 400: Secret reach the max count.</span></span>
<span class="line"><span>    ErrReachMaxCount int = iota + 110101</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //  ErrSecretNotFound - 404: Secret not found.</span></span>
<span class="line"><span>    ErrSecretNotFound</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>最后，我们还需要将错误码定义记录在项目的文件中，供开发者查阅、遵守和使用，例如IAM项目的错误码定义记录文档为 <a href="https://github.com/marmotedu/iam/blob/master/docs/guide/zh-CN/api/code_specification.md" target="_blank" rel="noreferrer">code_specification.md</a>。这个文档中记录了错误码说明、错误描述规范和错误记录规范等。</p><h2 id="错误码实际使用方法示例" tabindex="-1">错误码实际使用方法示例 <a class="header-anchor" href="#错误码实际使用方法示例" aria-label="Permalink to &quot;错误码实际使用方法示例&quot;">​</a></h2><p>上面，我讲解了错误包和错误码的实现方式，那你一定想知道在实际开发中我们是如何使用的。这里，我就举一个在gin web框架中使用该错误码的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Response defines project response format which in marmotedu organization.</span></span>
<span class="line"><span>type Response struct {</span></span>
<span class="line"><span>    Code      errors.Code \`json:&quot;code,omitempty&quot;\`</span></span>
<span class="line"><span>    Message   string      \`json:&quot;message,omitempty&quot;\`</span></span>
<span class="line"><span>    Reference string      \`json:&quot;reference,omitempty&quot;\`</span></span>
<span class="line"><span>    Data      interface{} \`json:&quot;data,omitempty&quot;\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// WriteResponse used to write an error and JSON data into response.</span></span>
<span class="line"><span>func WriteResponse(c *gin.Context, err error, data interface{}) {</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        coder := errors.ParseCoder(err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        c.JSON(coder.HTTPStatus(), Response{</span></span>
<span class="line"><span>            Code:      coder.Code(),</span></span>
<span class="line"><span>            Message:   coder.String(),</span></span>
<span class="line"><span>            Reference: coder.Reference(),</span></span>
<span class="line"><span>            Data:      data,</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    c.JSON(http.StatusOK, Response{Data: data})</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func GetUser(c *gin.Context) {</span></span>
<span class="line"><span>    log.Info(&quot;get user function called.&quot;, &quot;X-Request-Id&quot;, requestid.Get(c))</span></span>
<span class="line"><span>    // Get the user by the \`username\` from the database.</span></span>
<span class="line"><span>    user, err := store.Client().Users().Get(c.Param(&quot;username&quot;), metav1.GetOptions{})</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        core.WriteResponse(c, errors.WithCode(code.ErrUserNotFound, err.Error()), nil)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    core.WriteResponse(c, nil, user)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，通过 <code>WriteResponse</code> 统一处理错误。在 <code>WriteResponse</code> 函数中，如果 <code>err != nil</code>，则从error中解析出Coder，并调用Coder提供的方法，获取错误相关的Http Status Code、int类型的业务码、暴露给用户的信息、错误的参考文档链接，并返回JSON格式的信息。如果 <code>err == nil</code> 则返回200和数据。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>记录错误是应用程序必须要做的一件事情，在实际开发中，我们通常会封装自己的错误包。一个优秀的错误包，应该能够支持错误堆栈、不同的打印格式、Wrap/Unwrap/Is/As等函数，并能够支持格式化创建error。</p><p>根据这些错误包设计要点，我基于 <code>github.com/pkg/errors</code> 包设计了IAM项目的错误包 <code>github.com/marmotedu/errors</code> ，该包符合我们上一讲设计的错误码规范。</p><p>另外，本讲也给出了一个具体的错误码实现 sample-code ， sample-code 支持业务Code码、HTTP Status Code、错误参考文档、可以对内对外展示不同的错误信息。</p><p>最后，因为错误码注释是有固定格式的，所以我们可以通过codegen工具解析错误码的注释，生成register函数调用和错误码文档。这种做法也体现了我一直强调的low code思想，可以提高开发效率，减少人为失误。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>在这门课里，我们定义了base、iam-apiserver服务的错误码，请试着定义iam-authz-server服务的错误码，并生成错误码文档。</li><li>思考下，这门课的错误包和错误码设计能否满足你当前的项目需求，如果觉得不能满足，可以在留言区分享你的看法。</li></ol><p>欢迎你在留言区与我交流讨论，我们下一讲见。</p>`,122)])])}const h=a(r,[["render",t]]);export{g as __pageData,h as default};
