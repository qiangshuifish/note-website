import{_ as a,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"玩转Go语言I/O：掌握Reader与Writer的使用技巧","description":"","frontmatter":{},"headers":[{"level":2,"title":"Go I/O的核心抽象","slug":"go-i-o的核心抽象","link":"#go-i-o的核心抽象","children":[]},{"level":2,"title":"从Reader读取数据","slug":"从reader读取数据","link":"#从reader读取数据","children":[]},{"level":2,"title":"向Writer写入数据","slug":"向writer写入数据","link":"#向writer写入数据","children":[]},{"level":2,"title":"Reader与Writer间的数据传递","slug":"reader与writer间的数据传递","link":"#reader与writer间的数据传递","children":[{"level":3,"title":"Reader -> Writer","slug":"reader-writer","link":"#reader-writer","children":[]},{"level":3,"title":"Reader -> 多个Writer","slug":"reader-多个writer","link":"#reader-多个writer","children":[]},{"level":3,"title":"多个Reader -> Writer","slug":"多个reader-writer","link":"#多个reader-writer","children":[]},{"level":3,"title":"Writer -> Reader","slug":"writer-reader","link":"#writer-reader","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/玩转Go语言I-O：掌握Reader与Writer的使用技巧.md","filePath":"TonyBai·Go语言第一课/玩转Go语言I-O：掌握Reader与Writer的使用技巧.md","lastUpdated":1779817248000}'),i={name:"TonyBai·Go语言第一课/玩转Go语言I-O：掌握Reader与Writer的使用技巧.md"};function r(t,n,l,o,c,d){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="玩转go语言i-o-掌握reader与writer的使用技巧" tabindex="-1">玩转Go语言I/O：掌握Reader与Writer的使用技巧 <a class="header-anchor" href="#玩转go语言i-o-掌握reader与writer的使用技巧" aria-label="Permalink to &quot;玩转Go语言I/O：掌握Reader与Writer的使用技巧&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>在 <a href="https://time.geekbang.org/column/article/426740" target="_blank" rel="noreferrer">第2讲</a> 中，我们学习了Go语言面向工程的设计哲学， <strong>Go的设计者们希望：Go不仅是一门语言，更是一种更好的软件开发方式和编程环境</strong>。于是，Go提供了一个“开箱即用”的标准库，这也是Go在早期广受开发者青睐的重要原因之一。</p><p>Go语言的标准库功能强大，涵盖了很多常用的功能，如字符串处理、文件操作、日志打印、网络通信、Web编程、并发编程、数据编解码以及加解密等。此外，Go团队发布的 <a href="https://go.dev/doc/go1compat" target="_blank" rel="noreferrer">Go1兼容性承诺</a> 也包含了对标准库包的覆盖，这有助于保持代码的稳定性和兼容性，让开发人员编写代码时更专注于解决实际问题。</p><p>在众多标准库包中，io包尤为特殊，因为它 <strong>定义了整个Go语言的I/O模型</strong>，并通过定义Reader和Writer接口，提供了 <strong>统一的I/O抽象</strong>。这使得不同数据源和输出目标可以一致的方式交互，解耦具体实现与使用逻辑。开发者可以轻松替换输入输出实现，并通过组合构建复杂的I/O逻辑。</p><p>这一节，我们就来系统聊聊Go语言I/O模型，以及io包中Reader与Writer的使用技巧，帮助你更好地理解和运用Go I/O模型。</p><h2 id="go-i-o的核心抽象" tabindex="-1">Go I/O的核心抽象 <a class="header-anchor" href="#go-i-o的核心抽象" aria-label="Permalink to &quot;Go I/O的核心抽象&quot;">​</a></h2><p>Go标准库的io包通过两个核心接口：Writer和Reader，奠定了Go I/O模型的基础，它们也是Go语言中最重要的抽象之一。</p><p>下面是io包中Writer和Reader接口的定义：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//$GOROOT/src/io/io.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Writer interface {</span></span>
<span class="line"><span>    Write(p []byte) (n int, err error)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Reader interface {</span></span>
<span class="line"><span>    Read(p []byte) (n int, err error)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到：Writer接口对写入数据的操作进行了抽象，它只有一个Write方法，该方法接受一个字节切片作为参数，并将字节切片中的数据写入到实现Writer接口的不同目标中（比如文件、网络连接、内存等），并返回写入的字节数和可能的错误。</p><p>Reader接口则对读取数据的操作进行了抽象，它只有一个Read方法，该方法可以从实现了Reader接口的不同数据源（比如文件、网络连接、内存等）中读取数据，并将数据存入其字节切片类型的参数中，最后返回读取的字节数和可能的错误。</p><p><strong>io包的这种抽象提供了灵活的</strong> <strong>、</strong> <strong>可组合的方式来处理I/O操作，使得不同类型的数据源和数据接收方可以通过相同的接口进行数据交互。</strong> 当我们要向Go代码提供数据源时，只需将其封装为Reader接口的实现，也就是上面的Read方法即可，这样就可以使用Go标准库以及第三方库中已有的支持从Reader读取数据的包。而当我们要向某个目标写入数据时，就将其封装为Writer，即上面的Write方法，这样就可以使用Go标准库以及第三方库中已有的所有支持向Writer写入数据的包。</p><p>Go标准库提供了多种封装好的Reader和Writer的实现，用于处理不同的数据源和目标，你可以根据需求选择合适的。</p><ul><li><p>os.File：用于从文件读取和写入文件的Reader和Writer实现。</p></li><li><p>bytes.Buffer：用于在内存中读取和写入数据的Reader和Writer实现。</p></li><li><p>strings.Reader：用于从字符串中读取数据的Reader实现。</p></li><li><p>bufio.Reader：提供了带缓冲区的读取功能，可以提高读取效率。</p></li><li><p>bufio.Writer：提供了带缓冲区的写入功能，可以减少写入操作次数，提高写入效率。</p></li><li><p>compress/gzip包中的gzip.Reader和gzip.Writer：用于读取和写入gzip压缩文件的Reader和Writer实现。</p></li><li><p>encoding/json包中的json.Decoder和json.Encoder：用于读取和写入JSON格式数据的Reader和Writer实现。</p></li><li><p>net/http包中的http.Request.Body和http.Response.Body：用于读取HTTP请求和响应的Reader实现。</p></li><li><p>net.TCPConn和net.UDPConn：用于读取和写入TCP和UDP网络连接的Reader和Writer实现。</p></li></ul><p>现在记不住没关系，我们后续也会使用到其中一些Reader和Writer的实现，帮助你理解记忆。下面，我们先来看看如何使用Reader读取数据。</p><h2 id="从reader读取数据" tabindex="-1">从Reader读取数据 <a class="header-anchor" href="#从reader读取数据" aria-label="Permalink to &quot;从Reader读取数据&quot;">​</a></h2><p>io包提供了多种函数用于从Reader读取数据，其中最常用的函数是ReadFull和ReadAll。我们先来看看ReadFull函数，它的函数原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func ReadFull(r Reader, buf []byte) (n int, err error)</span></span></code></pre></div><p>ReadFull函数会从Reader类型的参数r中精确地读取len(buf)个字节到buf中，并返回读取到的字节数和可能的错误。如果读取的数据长度小于len(buf)，那么它会阻塞直到读满或出现错误（比如EOF或unexpected EOF）。下面是ReadFull函数的使用示例，我们看看在不同情况下ReadFull读取的数据和返回的错误码情况：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//io/readfull.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 1. 正常读取</span></span>
<span class="line"><span>    reader := strings.NewReader(&quot;Hello, World!&quot;) // length = 13</span></span>
<span class="line"><span>    buf := make([]byte, 10)                      // 创建大小为10的缓冲区</span></span>
<span class="line"><span>    n, err := io.ReadFull(reader, buf)</span></span>
<span class="line"><span>    fmt.Printf(&quot;正常读取：Read %d bytes: %s, error=%v\\n&quot;, n, string(buf), err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2. 恰好读完</span></span>
<span class="line"><span>    reader1 := strings.NewReader(&quot;Hello, World!&quot;) // length = 13</span></span>
<span class="line"><span>    buf1 := make([]byte, 13)</span></span>
<span class="line"><span>    n, err = io.ReadFull(reader1, buf1)</span></span>
<span class="line"><span>    fmt.Printf(&quot;恰好读完：Read %d bytes: %s, error=%v\\n&quot;, n, string(buf1), err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3. 读取不足</span></span>
<span class="line"><span>    reader2 := strings.NewReader(&quot;Hello, World!&quot;) // length = 13</span></span>
<span class="line"><span>    buf2 := make([]byte, 15)                      // 创建大小为15的缓冲区</span></span>
<span class="line"><span>    n, err = io.ReadFull(reader2, buf2)</span></span>
<span class="line"><span>    fmt.Printf(&quot;读取不足：Read %d bytes: %s, error=%v\\n&quot;, n, string(buf2), err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 4. 未读到任何数据</span></span>
<span class="line"><span>    reader3 := strings.NewReader(&quot;&quot;) // length = 0</span></span>
<span class="line"><span>    buf3 := make([]byte, 15)         // 创建大小为15的缓冲区</span></span>
<span class="line"><span>    n, err = io.ReadFull(reader3, buf3)</span></span>
<span class="line"><span>    fmt.Printf(&quot;未读到任何数据：Read %d bytes: %s, error=%v\\n&quot;, n, string(buf3), err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述示例的运行结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run readfull.go</span></span>
<span class="line"><span>正常读取：Read 10 bytes: Hello, Wor, error=&amp;lt;nil&amp;gt;</span></span>
<span class="line"><span>恰好读完：Read 13 bytes: Hello, World!, error=&amp;lt;nil&amp;gt;</span></span>
<span class="line"><span>读取不足：Read 13 bytes: Hello, World!, error=unexpected EOF</span></span>
<span class="line"><span>未读到任何数据：Read 0 bytes: , error=EOF</span></span></code></pre></div><p>ReadAll函数则意如其名，它会尝试将实现了Reader接口的数据源中所有数据都读取出来，其原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func ReadAll(r Reader) ([]byte, error)</span></span></code></pre></div><p>和ReadFull函数不同，ReadAll不需要调用者传入用于存储读出数据的Buffer，因为ReadAll和开发者都无法知道数据源中究竟有多少数据。下面是 ReadAll函数使用的示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// io/readall.go</span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 1. 正常读取</span></span>
<span class="line"><span>    reader := strings.NewReader(&quot;Hello, World!&quot;) // length = 13</span></span>
<span class="line"><span>    buf, err := io.ReadAll(reader)</span></span>
<span class="line"><span>    fmt.Printf(&quot;正常读取：Read %d bytes: %s, error=%v\\n&quot;, len(buf), string(buf), err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2. 未读到任何数据</span></span>
<span class="line"><span>    reader1 := strings.NewReader(&quot;&quot;) // length = 0</span></span>
<span class="line"><span>    buf1, err := io.ReadAll(reader1)</span></span>
<span class="line"><span>    fmt.Printf(&quot;未读到任何数据：Read %d bytes: %s, error=%v\\n&quot;, len(buf1), string(buf1), err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该示例的运行结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run readall.go</span></span>
<span class="line"><span>正常读取：Read 13 bytes: Hello, World!, error=&amp;lt;nil&amp;gt;</span></span>
<span class="line"><span>未读到任何数据：Read 0 bytes: , error=&amp;lt;nil&amp;gt;</span></span></code></pre></div><p>接下来，我们再来看看如何向Writer写入数据。和从Reader读取数据一样，它也是构建复杂I/O操作逻辑的基础。</p><h2 id="向writer写入数据" tabindex="-1">向Writer写入数据 <a class="header-anchor" href="#向writer写入数据" aria-label="Permalink to &quot;向Writer写入数据&quot;">​</a></h2><p>在向Writer写入数据方面，io包提供的可以“直接”写Writer的函数只有WriteString这一个，像Copy/CopyBuffer/CopyN等在Reader和Writer之间进行数据传递的函数我们会在后面介绍。Go标准库的其他包，比如fmt，倒是提供了其它一些可以直接写Writer的函数，比如Fprint系列函数。</p><p>我们先来看看可以直接写Writer的WriteString函数，它的函数原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/io/io.go</span></span>
<span class="line"><span>func WriteString(w Writer, s string) (n int, err error)</span></span></code></pre></div><p>下面是WriteString函数的一个使用示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// io/writestring.go</span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    writer := os.Stdout</span></span>
<span class="line"><span>    data := &quot;Hello, World!\\n&quot;</span></span>
<span class="line"><span>    n, err := io.WriteString(writer, data)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;Written %d bytes\\n&quot;, n)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里os.Stdout是一个os.File类型的指针，它实现了io.Writer接口，可以作为参数传给WriteString。WriteString将一个字符串变量data的内容直接写入Writer，即输出到控制台标准输出上，然后返回写入Writer的字节数和相应的错误值。</p><p>上述示例运行结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run writestring.go</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>Written 14 bytes</span></span></code></pre></div><p>fmt包提供的Fprint系列函数也支持直接Writer写入数据，其中的Fprintf还可以采用格式化写入方式，下面是这一系列的三个函数的原型：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/fmt/print.go</span></span>
<span class="line"><span>func Fprint(w io.Writer, a ...any) (n int, err error)</span></span>
<span class="line"><span>func Fprintf(w io.Writer, format string, a ...any) (n int, err error)</span></span>
<span class="line"><span>func Fprintln(w io.Writer, a ...any) (n int, err error)</span></span></code></pre></div><p>接着，我们来实现一个等价于上面WriteString的示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// io/fprintf.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    writer := os.Stdout</span></span>
<span class="line"><span>    data := &quot;Hello, World!&quot;</span></span>
<span class="line"><span>    n, err := fmt.Fprint(writer, data, &quot;\\n&quot;)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;Fprint: written %d bytes\\n&quot;, n)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    n, err = fmt.Fprintf(writer, &quot;%s\\n&quot;, data)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;Fprintf: written %d bytes\\n&quot;, n)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    n, err = fmt.Fprintln(writer, data)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;Fprintln: written %d bytes\\n&quot;, n)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们分别用Fprint、Fprintf和Fprintln实现了与WriteString等同的功能，该示例输出如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run fprintf.go</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>Fprint: written 14 bytes</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>Fprintf: written 14 bytes</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>Fprintln: written 14 bytes</span></span></code></pre></div><h2 id="reader与writer间的数据传递" tabindex="-1">Reader与Writer间的数据传递 <a class="header-anchor" href="#reader与writer间的数据传递" aria-label="Permalink to &quot;Reader与Writer间的数据传递&quot;">​</a></h2><p>通过Reader和Writer两个抽象类型，我们能够灵活进行复杂的数据传递。常见的数据传递场景包括：</p><ul><li><p>Reader -&gt; Writer</p></li><li><p>Reader -&gt; 多个Writer</p></li><li><p>多个Reader -&gt; Writer</p></li><li><p>多个Reader -&gt; 多个Writer</p></li><li><p>Writer -&gt; Reader</p></li></ul><p>接下来，我们就逐一看看如果利用io包实现上述的数据传递场景。</p><h3 id="reader-writer" tabindex="-1">Reader -&gt; Writer <a class="header-anchor" href="#reader-writer" aria-label="Permalink to &quot;Reader -&gt; Writer&quot;">​</a></h3><p>将数据从一个Reader读取出来，然后写入一个Writer中，这是最常见的数据传递场景。io包提供了Copy函数，可以十分方便地实现这个功能。下面是Copy函数的原型：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/io/io.go</span></span>
<span class="line"><span>func Copy(dst Writer, src Reader) (written int64, err error)</span></span></code></pre></div><p>我们用Copy函数将一个数据源中的字符串数据“传递”到标准输出上：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// io/reader2writer.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    writer := os.Stdout</span></span>
<span class="line"><span>    data := &quot;Hello, World!\\n&quot;</span></span>
<span class="line"><span>    reader := strings.NewReader(data)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // reader -&amp;gt; writer</span></span>
<span class="line"><span>    n, err := io.Copy(writer, reader)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;written %d bytes\\n&quot;, n)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个示例的输出结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run reader2writer.go</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>written 14 bytes</span></span></code></pre></div><h3 id="reader-多个writer" tabindex="-1">Reader -&gt; 多个Writer <a class="header-anchor" href="#reader-多个writer" aria-label="Permalink to &quot;Reader -&gt; 多个Writer&quot;">​</a></h3><p>有时候，我们需要将一个数据源中的数据传递给多个目标，比如将一个数据源中的字符串数据写入到标准输出的同时，也写一份到特定的文件中。io包提供的MultiWriter可以帮助我们实现这个场景功能。io.MultiWriter的函数原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/io/io.go</span></span>
<span class="line"><span>func MultiWriter(writers ...Writer) Writer</span></span></code></pre></div><p>MultiWriter函数可以将多个Writer“整合”为一个Writer，然后我们再通过Copy函数可以将Reader数据传递给这个“整合”后的Writer，后者再将数据复制分发给其“整合”的多个Writer，就像如下的示意图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/668c88496cd70f15cc0b00f378eb38f2.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/668c88496cd70f15cc0b00f378eb38f2.jpg" alt=""></a></p><p>下面是该示例的实现代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//io/reader2multiwriter.go</span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    data := &quot;Hello, World!\\n&quot;</span></span>
<span class="line"><span>    reader := strings.NewReader(data)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    writer1 := os.Stdout</span></span>
<span class="line"><span>    writer2, err := os.Create(&quot;writer2.txt&quot;)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;创建目标文件错误:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer writer2.Close()</span></span>
<span class="line"><span>    writer := io.MultiWriter(writer1, writer2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // reader -&amp;gt; multi writer</span></span>
<span class="line"><span>    n, err := io.Copy(writer, reader)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;written %d bytes\\n&quot;, n)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个示例有两个写入目标：writer1代表控制体标准输出，writer2则代表writer2.txt文件。我们通过io.MultiWriter函数将它们整合为一个writer变量，然后通过io.Copy函数实现了从数据源读取数据并写入writer变量的功能。该示例的运行结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run reader2multiwriter.go</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>written 14 bytes</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$cat writer2.txt</span></span>
<span class="line"><span>Hello, World!</span></span></code></pre></div><p>我们看到，“Hello, World!”被同时成功写到标准输出与文件“writer2.txt”中了。</p><h3 id="多个reader-writer" tabindex="-1">多个Reader -&gt; Writer <a class="header-anchor" href="#多个reader-writer" aria-label="Permalink to &quot;多个Reader -&gt; Writer&quot;">​</a></h3><p>日常编码中可能有这样的场景，即将位于多个Reader中的数据片段，按顺序整合为一个Reader，再写入Writer，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/9df2d5f95281d431e1a60391yyd8f628.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/9df2d5f95281d431e1a60391yyd8f628.jpg" alt=""></a></p><p>io包提供了MultiReader函数可以帮助我们按顺序将多个Reader“整合”为一个Reader，MultiReader函数的原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//$GOROOT/src/io/io.go</span></span>
<span class="line"><span>func MultiReader(readers ...Reader) Reader</span></span></code></pre></div><p>MultiReader函数将多个输入Reader串联在一起，形成一个逻辑上的连续数据流。当读取这个Reader时， <strong>它会按顺序从每个输入Reader中读取数据</strong>，直到所有输入Reader都返回了EOF。如果在读取过程中任何一个输入Reader返回了错误，Read函数会立即返回该错误，并且后续的读取操作将被中止。这种机制使得我们可以方便地将多个输入数据源串联起来，以便按照顺序连续读取数据，简化了顺序处理多个数据源的任务。</p><p>下面是一个使用MultiReader进行多Reader读取的示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//io/multireader2writer.go</span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    reader1 := strings.NewReader(&quot;Hello, &quot;)</span></span>
<span class="line"><span>    reader2 := strings.NewReader(&quot;World!\\n&quot;)</span></span>
<span class="line"><span>    reader3, err := os.Open(&quot;reader3.txt&quot;)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer reader3.Close()</span></span>
<span class="line"><span>    multiReader := io.MultiReader(reader1, reader2, reader3)</span></span>
<span class="line"><span>    // 将合并后的内容写到标准输出</span></span>
<span class="line"><span>    writer := os.Stdout</span></span>
<span class="line"><span>    _, err = io.Copy(writer, multiReader)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个示例中，通过MultiReader整合后的multiReader被读取数据并写入os.Stdout代表的writer。multiReader会依次从代表内存数据的reader1和reader2中读取数据，再从代表文件数据的reader3中，将数据从reader3.txt文件中读出。下面是示例运行的结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$cat reader3.txt</span></span>
<span class="line"><span>Welcome to the example.</span></span>
<span class="line"><span>$go run multireader2writer.go</span></span>
<span class="line"><span>Hello, World!</span></span>
<span class="line"><span>Welcome to the example.</span></span></code></pre></div><h3 id="writer-reader" tabindex="-1">Writer -&gt; Reader <a class="header-anchor" href="#writer-reader" aria-label="Permalink to &quot;Writer -&gt; Reader&quot;">​</a></h3><p>我们再来看最后一种复杂的I/O操作场景。有时候，我们需要在某个函数中对输入的内容进行拦截处理，并将处理后的内容再作为一个数据源，即封装为一个Reader供后续程序使用，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/e72191c45749a0ef3f93b41cbe44536c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/e72191c45749a0ef3f93b41cbe44536c.jpg" alt=""></a></p><p>io包提供了Pipe函数，可以用于实现拦截处理的Writer，并将处理后的内容重新包装为Reader，就像真实世界的一个管道那样：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/dffc7f0c3c03934190cd99d487900720.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/dffc7f0c3c03934190cd99d487900720.jpg" alt=""></a></p><p>io.Pipe函数的原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//$GOROOT/src/io/pipe.go</span></span>
<span class="line"><span>func Pipe() (*PipeReader, *PipeWriter)</span></span></code></pre></div><p>io.Pipe函数在内存中创建一个同步的数据管道，返回一个io.Reader和一个io.Writer，用于在不同的goroutine之间传递数据。即通过将io.Pipe返回的Writer传递给一个goroutine作为数据写入操作，而将返回的Reader传递给另一个goroutine作为数据读取操作。</p><p>我们经常连接这些管道来构建数据流水线，形成流式处理机制。这是一种非常好用的数据处理模式，示意图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/d5aa12e2fede857e24067e7e5e6c52ef.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/d5aa12e2fede857e24067e7e5e6c52ef.jpg" alt=""></a></p><p>下面我们就用Pipe函数来构建一个简单的数据处理流水线：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/4a9d91c17438e17549e45eae86af6274.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/839791/4a9d91c17438e17549e45eae86af6274.jpg" alt=""></a></p><p>下面是示例代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// io/writer2reader.go</span></span>
<span class="line"><span>type CapWriter struct {</span></span>
<span class="line"><span>    writer io.Writer</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewCapWriter(w io.Writer) *CapWriter {</span></span>
<span class="line"><span>    return &amp;CapWriter{writer: w}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (cw *CapWriter) Write(p []byte) (n int, err error) {</span></span>
<span class="line"><span>    // 将写入的数据转换为大写</span></span>
<span class="line"><span>    upper := strings.ToUpper(string(p))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将转换后的数据写入底层的 Writer</span></span>
<span class="line"><span>    return cw.writer.Write([]byte(upper))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type ReverseWriter struct {</span></span>
<span class="line"><span>    writer io.Writer</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewReverseWriter(w io.Writer) *ReverseWriter {</span></span>
<span class="line"><span>    return &amp;ReverseWriter{writer: w}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (rw *ReverseWriter) Write(p []byte) (n int, err error) {</span></span>
<span class="line"><span>    // 将写入的数据进行翻转</span></span>
<span class="line"><span>    reversed := reverseString(string(p))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将翻转后的数据写入底层的 Writer</span></span>
<span class="line"><span>    return rw.writer.Write([]byte(reversed))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func reverseString(s string) string {</span></span>
<span class="line"><span>    runes := []rune(s)</span></span>
<span class="line"><span>    n := len(runes)</span></span>
<span class="line"><span>    for i := 0; i &amp;lt; n/2; i++ {</span></span>
<span class="line"><span>        runes[i], runes[n-1-i] = runes[n-1-i], runes[i]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return string(runes)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 创建第一个 Pipe，获取对应的 Reader 和 Writer</span></span>
<span class="line"><span>    reader1, writer1 := io.Pipe()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建 CapWriter，将其与第一个 Pipe 返回的 Writer 整合</span></span>
<span class="line"><span>    capWriter := NewCapWriter(writer1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建第二个 Pipe，获取对应的 Reader 和 Writer</span></span>
<span class="line"><span>    reader2, writer2 := io.Pipe()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建 ReverseWriter，将其与第二个 Pipe 返回的 Writer 整合</span></span>
<span class="line"><span>    reverseWriter := NewReverseWriter(writer2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 启动一个 goroutine，向 CapWriter 写入数据</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer writer1.Close()</span></span>
<span class="line"><span>        for i := 0; i &amp;lt; 5; i++ {</span></span>
<span class="line"><span>            data := []byte(&quot;hello, world!\\n&quot;)</span></span>
<span class="line"><span>            _, err := capWriter.Write(data)</span></span>
<span class="line"><span>            if err != nil {</span></span>
<span class="line"><span>                fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            time.Sleep(time.Second) //每秒写入一次</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 启动另一个 goroutine，从第二个 Pipe 返回的 Reader 中读取数据并处理</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer writer2.Close()</span></span>
<span class="line"><span>        io.Copy(reverseWriter, reader1)</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从第二个 Pipe 返回的 Reader 中读取翻转后的数据并处理</span></span>
<span class="line"><span>    n, err := io.Copy(os.Stdout, reader2)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fmt.Printf(&quot;\\nRead %d bytes\\n&quot;, n)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 关闭 Reader2</span></span>
<span class="line"><span>    err = reader2.Close()</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述示例中，我们创建了两个Pipe：一个用于将数据转换为大写的CapWriter，另一个用于将数据翻转的ReverseWriter。我们在两个goroutine中同时操作这两个Pipe，实现了流水线式的处理。在第一个goroutine中，我们将数据写入CapWriter；在第二个goroutine中，我们从第一个Pipe返回的Reader中读取数据，并将数据翻转后写入ReverseWriter。最后，在主goroutine中，我们从第二个Pipe返回的Reader中读取翻转后的数据，并输出到控制台上。</p><p>下面是示例的运行结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run writer2reader.go</span></span>
<span class="line"><span>!DLROW ,OLLEH</span></span>
<span class="line"><span>!DLROW ,OLLEH</span></span>
<span class="line"><span>!DLROW ,OLLEH</span></span>
<span class="line"><span>!DLROW ,OLLEH</span></span>
<span class="line"><span>!DLROW ,OLLEH</span></span>
<span class="line"><span>Read 70 bytes</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这一节，我们详细探讨了Go语言中的I/O模型，重点介绍了io包中的核心抽象：Reader和Writer接口。这两个抽象类型为数据的输入和输出提供了一种统一的操作方式，使得不同的数据源和目标能够灵活交互。</p><p>我们还讨论了多种常见的数据传递场景，包括从Reader到Writer、多个Reader到Writer、多个Reader到多个Writer，以及Writer到Reader的操作。通过示例代码，我们知道了使用io包提供的函数（如MultiWriter、MultiReader、Pipe等）和将这些接口灵活组合高效处理数据的方法，相信你也能从中感受到Go I/O模型的强大与灵活！</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>学完之后，建议你回顾一下自己工作中的代码，寻找可以改造为Reader和Writer的地方。动手实践一下，看看这些抽象如何帮助你提升代码的灵活性和可维护性。</p><p>如果你有新的想法，欢迎留言与我分享。我是Tony Bai，我们下一节见。</p>`,99)])])}const h=a(i,[["render",r]]);export{g as __pageData,h as default};
