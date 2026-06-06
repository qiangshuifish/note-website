import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"109 | Go编程模式：Functional Options","description":"","frontmatter":{},"headers":[{"level":2,"title":"配置选项问题","slug":"配置选项问题","link":"#配置选项问题","children":[]},{"level":2,"title":"配置对象方案","slug":"配置对象方案","link":"#配置对象方案","children":[]},{"level":2,"title":"Builder模式","slug":"builder模式","link":"#builder模式","children":[]},{"level":2,"title":"Functional Options","slug":"functional-options","link":"#functional-options","children":[]},{"level":2,"title":"参考文档","slug":"参考文档","link":"#参考文档","children":[]}],"relativePath":"左耳听风/109-Go编程模式：FunctionalOptions.md","filePath":"左耳听风/109-Go编程模式：FunctionalOptions.md","lastUpdated":1779819815000}'),l={name:"左耳听风/109-Go编程模式：FunctionalOptions.md"};function i(t,n,o,c,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_109-go编程模式-functional-options" tabindex="-1">109 | Go编程模式：Functional Options <a class="header-anchor" href="#_109-go编程模式-functional-options" aria-label="Permalink to &quot;109 | Go编程模式：Functional Options&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>这节课，我们来讨论一下Functional Options这个编程模式。这是一个函数式编程的应用案例，编程技巧也很好，是目前Go语言中最流行的一种编程模式。</p><p>但是，在正式讨论这个模式之前，我们先来看看要解决什么样的问题。</p><h2 id="配置选项问题" tabindex="-1">配置选项问题 <a class="header-anchor" href="#配置选项问题" aria-label="Permalink to &quot;配置选项问题&quot;">​</a></h2><p>在编程中，我们经常需要对一个对象（或是业务实体）进行相关的配置。比如下面这个业务实体（注意，这只是一个示例）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Server struct {</span></span>
<span class="line"><span>    Addr     string</span></span>
<span class="line"><span>    Port     int</span></span>
<span class="line"><span>    Protocol string</span></span>
<span class="line"><span>    Timeout  time.Duration</span></span>
<span class="line"><span>    MaxConns int</span></span>
<span class="line"><span>    TLS      *tls.Config</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个 <code>Server</code> 对象中，我们可以看到：</p><ul><li>要有侦听的IP地址 <code>Addr</code> 和端口号 <code>Port</code> ，这两个配置选项是必填的（当然，IP地址和端口号都可以有默认值，不过这里我们用于举例，所以是没有默认值，而且不能为空，需要是必填的）。</li><li>然后，还有协议 <code>Protocol</code> 、 <code>Timeout</code> 和 <code>MaxConns</code> 字段，这几个字段是不能为空的，但是有默认值的，比如，协议是TCP，超时 <code>30</code> 秒 和 最大链接数 <code>1024</code> 个。</li><li>还有一个 <code>TLS</code> ，这个是安全链接，需要配置相关的证书和私钥。这个是可以为空的。</li></ul><p>所以，针对这样的配置，我们需要有多种不同的创建不同配置 <code>Server</code> 的函数签名，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewDefaultServer(addr string, port int) (*Server, error) {</span></span>
<span class="line"><span>  return &amp;Server{addr, port, &quot;tcp&quot;, 30 * time.Second, 100, nil}, nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewTLSServer(addr string, port int, tls *tls.Config) (*Server, error) {</span></span>
<span class="line"><span>  return &amp;Server{addr, port, &quot;tcp&quot;, 30 * time.Second, 100, tls}, nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewServerWithTimeout(addr string, port int, timeout time.Duration) (*Server, error) {</span></span>
<span class="line"><span>  return &amp;Server{addr, port, &quot;tcp&quot;, timeout, 100, nil}, nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewTLSServerWithMaxConnAndTimeout(addr string, port int, maxconns int, timeout time.Duration, tls *tls.Config) (*Server, error) {</span></span>
<span class="line"><span>  return &amp;Server{addr, port, &quot;tcp&quot;, 30 * time.Second, maxconns, tls}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为Go语言不支持重载函数，所以，你得用不同的函数名来应对不同的配置选项。</p><h2 id="配置对象方案" tabindex="-1">配置对象方案 <a class="header-anchor" href="#配置对象方案" aria-label="Permalink to &quot;配置对象方案&quot;">​</a></h2><p>要解决这个问题，最常见的方式是使用一个配置对象，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Config struct {</span></span>
<span class="line"><span>    Protocol string</span></span>
<span class="line"><span>    Timeout  time.Duration</span></span>
<span class="line"><span>    Maxconns int</span></span>
<span class="line"><span>    TLS      *tls.Config</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们把那些非必输的选项都移到一个结构体里，这样一来， <code>Server</code> 对象就会变成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Server struct {</span></span>
<span class="line"><span>    Addr string</span></span>
<span class="line"><span>    Port int</span></span>
<span class="line"><span>    Conf *Config</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>于是，我们就只需要一个 <code>NewServer()</code> 的函数了，在使用前需要构造 <code>Config</code> 对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewServer(addr string, port int, conf *Config) (*Server, error) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Using the default configuratrion</span></span>
<span class="line"><span>srv1, _ := NewServer(&quot;localhost&quot;, 9000, nil)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>conf := ServerConfig{Protocol:&quot;tcp&quot;, Timeout: 60*time.Duration}</span></span>
<span class="line"><span>srv2, _ := NewServer(&quot;locahost&quot;, 9000, &amp;conf)</span></span></code></pre></div><p>这段代码算是不错了，大多数情况下，我们可能就止步于此了。但是，对于有洁癖的、有追求的程序员来说，他们会看到其中不太好的一点，那就是 <code>Config</code> 并不是必需的，所以，你需要判断是否是 <code>nil</code> 或是 Empty—— <code>Config{}</code> 会让我们的代码感觉不太干净。</p><h2 id="builder模式" tabindex="-1">Builder模式 <a class="header-anchor" href="#builder模式" aria-label="Permalink to &quot;Builder模式&quot;">​</a></h2><p>如果你是一个Java程序员，熟悉设计模式的一定会很自然地使用Builder模式。比如下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>User user = new User.Builder()</span></span>
<span class="line"><span>  .name(&quot;Hao Chen&quot;)</span></span>
<span class="line"><span>  .email(&quot;haoel@hotmail.com&quot;)</span></span>
<span class="line"><span>  .nickname(&quot;左耳朵&quot;)</span></span>
<span class="line"><span>  .build();</span></span></code></pre></div><p>仿照这个模式，我们可以把刚刚的代码改写成下面的样子（注：下面的代码没有考虑出错处理，其中关于出错处理的更多内容，你可以再回顾下 <a href="https://time.geekbang.org/column/article/332602" target="_blank" rel="noreferrer">上节课</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//使用一个builder类来做包装</span></span>
<span class="line"><span>type ServerBuilder struct {</span></span>
<span class="line"><span>  Server</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (sb *ServerBuilder) Create(addr string, port int) *ServerBuilder {</span></span>
<span class="line"><span>  sb.Server.Addr = addr</span></span>
<span class="line"><span>  sb.Server.Port = port</span></span>
<span class="line"><span>  //其它代码设置其它成员的默认值</span></span>
<span class="line"><span>  return sb</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (sb *ServerBuilder) WithProtocol(protocol string) *ServerBuilder {</span></span>
<span class="line"><span>  sb.Server.Protocol = protocol</span></span>
<span class="line"><span>  return sb</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (sb *ServerBuilder) WithMaxConn( maxconn int) *ServerBuilder {</span></span>
<span class="line"><span>  sb.Server.MaxConns = maxconn</span></span>
<span class="line"><span>  return sb</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (sb *ServerBuilder) WithTimeOut( timeout time.Duration) *ServerBuilder {</span></span>
<span class="line"><span>  sb.Server.Timeout = timeout</span></span>
<span class="line"><span>  return sb</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (sb *ServerBuilder) WithTLS( tls *tls.Config) *ServerBuilder {</span></span>
<span class="line"><span>  sb.Server.TLS = tls</span></span>
<span class="line"><span>  return sb</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (sb *ServerBuilder) Build() (Server) {</span></span>
<span class="line"><span>  return  sb.Server</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样一来，就可以使用这样的方式了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sb := ServerBuilder{}</span></span>
<span class="line"><span>server, err := sb.Create(&quot;127.0.0.1&quot;, 8080).</span></span>
<span class="line"><span>  WithProtocol(&quot;udp&quot;).</span></span>
<span class="line"><span>  WithMaxConn(1024).</span></span>
<span class="line"><span>  WithTimeOut(30*time.Second).</span></span>
<span class="line"><span>  Build()</span></span></code></pre></div><p>这种方式也很清楚，不需要额外的Config类，使用链式的函数调用的方式来构造一个对象，只需要多加一个Builder类。你可能会觉得，这个Builder类似乎有点多余，我们似乎可以直接在 <code>Server</code> 上进行这样的 Builder 构造，的确是这样的。但是，在处理错误的时候可能就有点麻烦，不如一个包装类更好一些。</p><p>如果我们想省掉这个包装的结构体，就要请出Functional Options上场了：函数式编程。</p><h2 id="functional-options" tabindex="-1">Functional Options <a class="header-anchor" href="#functional-options" aria-label="Permalink to &quot;Functional Options&quot;">​</a></h2><p>首先，我们定义一个函数类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Option func(*Server)</span></span></code></pre></div><p>然后，我们可以使用函数式的方式定义一组如下的函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Protocol(p string) Option {</span></span>
<span class="line"><span>    return func(s *Server) {</span></span>
<span class="line"><span>        s.Protocol = p</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func Timeout(timeout time.Duration) Option {</span></span>
<span class="line"><span>    return func(s *Server) {</span></span>
<span class="line"><span>        s.Timeout = timeout</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func MaxConns(maxconns int) Option {</span></span>
<span class="line"><span>    return func(s *Server) {</span></span>
<span class="line"><span>        s.MaxConns = maxconns</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func TLS(tls *tls.Config) Option {</span></span>
<span class="line"><span>    return func(s *Server) {</span></span>
<span class="line"><span>        s.TLS = tls</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这组代码传入一个参数，然后返回一个函数，返回的这个函数会设置自己的 <code>Server</code> 参数。例如，当我们调用其中的一个函数 <code>MaxConns(30)</code> 时，其返回值是一个 <code>func(s* Server) { s.MaxConns = 30 }</code> 的函数。</p><p>这个叫高阶函数。在数学上，这有点像是计算长方形面积的公式为： <code>rect(width, height) = width * height;</code> 这个函数需要两个参数，我们包装一下，就可以变成计算正方形面积的公式： <code>square(width) = rect(width, width)</code> 。也就是说， <code>squre(width)</code> 返回了另外一个函数，这个函数就是 <code>rect(w,h)</code> ，只不过它的两个参数是一样的，即： <code>f(x) = g(x, x)</code>。</p><p>好了，现在我们再定一个 <code>NewServer()</code> 的函数，其中，有一个可变参数 <code>options</code> ，它可以传出多个上面的函数，然后使用一个for-loop来设置我们的 <code>Server</code> 对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewServer(addr string, port int, options ...func(*Server)) (*Server, error) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  srv := Server{</span></span>
<span class="line"><span>    Addr:     addr,</span></span>
<span class="line"><span>    Port:     port,</span></span>
<span class="line"><span>    Protocol: &quot;tcp&quot;,</span></span>
<span class="line"><span>    Timeout:  30 * time.Second,</span></span>
<span class="line"><span>    MaxConns: 1000,</span></span>
<span class="line"><span>    TLS:      nil,</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for _, option := range options {</span></span>
<span class="line"><span>    option(&amp;srv)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>  return &amp;srv, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>于是，我们在创建 <code>Server</code> 对象的时候，就可以像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>s1, _ := NewServer(&quot;localhost&quot;, 1024)</span></span>
<span class="line"><span>s2, _ := NewServer(&quot;localhost&quot;, 2048, Protocol(&quot;udp&quot;))</span></span>
<span class="line"><span>s3, _ := NewServer(&quot;0.0.0.0&quot;, 8080, Timeout(300*time.Second), MaxConns(1000))</span></span></code></pre></div><p>怎么样，是不是高度整洁和优雅？这不但解决了“使用 <code>Config</code> 对象方式的需要有一个config参数，但在不需要的时候，是放 <code>nil</code> 还是放 <code>Config{}</code>”的选择困难问题，也不需要引用一个Builder的控制对象，直接使用函数式编程，在代码阅读上也很优雅。</p><p>所以，以后，你要玩类似的代码时，我强烈推荐你使用Functional Options这种方式，这种方式至少带来了6个好处：</p><ul><li>直觉式的编程；</li><li>高度的可配置化；</li><li>很容易维护和扩展；</li><li>自文档；</li><li>新来的人很容易上手；</li><li>没有什么令人困惑的事（是nil 还是空）。</li></ul><h2 id="参考文档" tabindex="-1">参考文档 <a class="header-anchor" href="#参考文档" aria-label="Permalink to &quot;参考文档&quot;">​</a></h2><ul><li><a href="http://commandcenter.blogspot.com.au/2014/01/self-referential-functions-and-design.html" target="_blank" rel="noreferrer">Self referential functions and design</a>， by Rob Pike</li></ul><p>好了，这节课就到这里。如果你觉得今天的内容对你有所帮助，欢迎你帮我分享给更多人。</p>`,46)])])}const v=s(l,[["render",i]]);export{h as __pageData,v as default};
