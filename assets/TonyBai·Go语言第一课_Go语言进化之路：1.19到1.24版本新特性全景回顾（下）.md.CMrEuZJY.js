import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"Go语言进化之路：1.19到1.24版本新特性全景回顾（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"工具链","slug":"工具链","link":"#工具链","children":[{"level":3,"title":"重新明确向后兼容与向前兼容性","slug":"重新明确向后兼容与向前兼容性","link":"#重新明确向后兼容与向前兼容性","children":[]},{"level":3,"title":"go work支持vendor","slug":"go-work支持vendor","link":"#go-work支持vendor","children":[]},{"level":3,"title":"go mod init不再care其他vendor工具的配置文件","slug":"go-mod-init不再care其他vendor工具的配置文件","link":"#go-mod-init不再care其他vendor工具的配置文件","children":[]},{"level":3,"title":"支持Telemetry（遥测）","slug":"支持telemetry-遥测","link":"#支持telemetry-遥测","children":[]},{"level":3,"title":"go.mod新增tool指示符，支持对tool的依赖管理","slug":"go-mod新增tool指示符-支持对tool的依赖管理","link":"#go-mod新增tool指示符-支持对tool的依赖管理","children":[]},{"level":3,"title":"Go run生成的可执行文件支持缓存","slug":"go-run生成的可执行文件支持缓存","link":"#go-run生成的可执行文件支持缓存","children":[]},{"level":3,"title":"go build支持-json","slug":"go-build支持-json","link":"#go-build支持-json","children":[]},{"level":3,"title":"go工具链支持HTTP扩展认证：GOAUTH","slug":"go工具链支持http扩展认证-goauth","link":"#go工具链支持http扩展认证-goauth","children":[]}]},{"level":2,"title":"标准库","slug":"标准库","link":"#标准库","children":[{"level":3,"title":"支持wrap multiple errors","slug":"支持wrap-multiple-errors","link":"#支持wrap-multiple-errors","children":[]},{"level":3,"title":"增加slices、maps和cmp","slug":"增加slices、maps和cmp","link":"#增加slices、maps和cmp","children":[]},{"level":3,"title":"新增unique包","slug":"新增unique包","link":"#新增unique包","children":[]},{"level":3,"title":"log/slog包","slug":"log-slog包","link":"#log-slog包","children":[]},{"level":3,"title":"math/rand/v2：标准库的第一个v2版本包","slug":"math-rand-v2-标准库的第一个v2版本包","link":"#math-rand-v2-标准库的第一个v2版本包","children":[]},{"level":3,"title":"增强http.ServeMux表达能力","slug":"增强http-servemux表达能力","link":"#增强http-servemux表达能力","children":[]},{"level":3,"title":"Timer/Ticker变化","slug":"timer-ticker变化","link":"#timer-ticker变化","children":[]},{"level":3,"title":"crypto：增加hkdf、pbkdf2、sha3等密码学包","slug":"crypto-增加hkdf、pbkdf2、sha3等密码学包","link":"#crypto-增加hkdf、pbkdf2、sha3等密码学包","children":[]},{"level":3,"title":"支持限制目录的文件系统访问","slug":"支持限制目录的文件系统访问","link":"#支持限制目录的文件系统访问","children":[]},{"level":3,"title":"使用runtime.AddCleanup替代SetFinalizer","slug":"使用runtime-addcleanup替代setfinalizer","link":"#使用runtime-addcleanup替代setfinalizer","children":[]},{"level":3,"title":"不易出错的新Benchmark函数","slug":"不易出错的新benchmark函数","link":"#不易出错的新benchmark函数","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/Go语言进化之路：1.19到1.24版本新特性全景回顾（下）.md","filePath":"TonyBai·Go语言第一课/Go语言进化之路：1.19到1.24版本新特性全景回顾（下）.md","lastUpdated":1779817248000}'),l={name:"TonyBai·Go语言第一课/Go语言进化之路：1.19到1.24版本新特性全景回顾（下）.md"};function o(i,n,t,r,c,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="go语言进化之路-1-19到1-24版本新特性全景回顾-下" tabindex="-1">Go语言进化之路：1.19到1.24版本新特性全景回顾（下） <a class="header-anchor" href="#go语言进化之路-1-19到1-24版本新特性全景回顾-下" aria-label="Permalink to &quot;Go语言进化之路：1.19到1.24版本新特性全景回顾（下）&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>上一节我们讲了1.19到1.24版本中，关于语言语法和编译器运行方面的新特性，这一节我们继续来看工具和标准库方面的新特性。</p><h2 id="工具链" tabindex="-1">工具链 <a class="header-anchor" href="#工具链" aria-label="Permalink to &quot;工具链&quot;">​</a></h2><p>Go工具链是Go语言生态的重要组成部分，Go团队持续在工具链方面进行投入，以提升开发者的开发体验和使用效率。下面我们来看看在这些版本中，Go工具链都有哪些重要的改进。</p><h3 id="重新明确向后兼容与向前兼容性" tabindex="-1">重新明确向后兼容与向前兼容性 <a class="header-anchor" href="#重新明确向后兼容与向前兼容性" aria-label="Permalink to &quot;重新明确向后兼容与向前兼容性&quot;">​</a></h3><p>Go 1.21在工具链方面最值得关注的就是Go团队对向后兼容（Backwards Compatibility）和向前兼容（Forwards Compatibility）的重新思考和新措施。</p><p>所谓向后兼容就是用新版Go编译器可以编译遗留的历史Go代码，并且可以正常运行。比如用Go 1.21版本编译器编译基于Go 1.5版本编写的Go代码。Go在这方面做得一直很好，并提出了 <a href="https://go.dev/doc/go1compat" target="_blank" rel="noreferrer">Go1兼容性承诺</a>。</p><p>而向前兼容指的是用旧版编译器编译新版本Go的代码，比如用Go 1.19版本编译器编译基于Go 1.21版本编写的Go代码。显而易见，如果Go代码中使用了Go 1.21引入的新语法特性，那么Go 1.19编译Go代码时会失败。</p><p>下面我们就来看一看，Go 1.21中对于Go工具链的向前和向后兼容做了哪些明确和增强。</p><h4 id="向后兼容" tabindex="-1">向后兼容 <a class="header-anchor" href="#向后兼容" aria-label="Permalink to &quot;向后兼容&quot;">​</a></h4><p>为了提高向后兼容性的体验，从Go 1.21版本开始，Go扩展和规范化了GODEBUG的使用。其大致思路如下：</p><ul><li><p>对于每个在Go1兼容性承诺范围内且可能会破坏（break）现有代码的新特性/新改变（比如panic(nil)语义的改变）加入时，Go会向GODEBUG设置中添加一个新选项（比如GODEBUG=panicnil=1），以保留采用原语义进行编译的兼容能力。</p></li><li><p>GODEBUG中新增的选项将至少保留两年（4个Go release版本），对于一些影响重大的GODEBUG选项（比如http2client和http2server），保留的时间可能更长，甚至一直保留。</p></li><li><p>GODEBUG的选项设置与go.mod的go version匹配。例如，即便你现在的工具链是Go 1.21，如果go.mod中的go version为1.20，那么GODEBUG控制的新特性语义将不起作用，依旧保持Go 1.20时的行为。除非你将go.mod中的go version升级为go 1.21.0。下面的例子就展示了这一点：</p></li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-evolution/tools/godebug/go.mod</span></span>
<span class="line"><span>module demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>go 1.20</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// go-evolution/tools/godebug/panicnil.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func foo() {</span></span>
<span class="line"><span>    defer func() {</span></span>
<span class="line"><span>        if e := recover(); e != nil {</span></span>
<span class="line"><span>            fmt.Println(&quot;recover panic from&quot;, e)</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        fmt.Println(&quot;panic is nil&quot;)</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    panic(nil)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    foo()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子中go.mod中的go version为Go 1.20，我们用Go 1.21去编译运行该示例，得到如下结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run panicnil.go</span></span>
<span class="line"><span>panic is nil</span></span></code></pre></div><p>我们看到，即便用Go 1.21编译，由于go.mod中go version为Go 1.20，Go 1.21对panic(nil)的语义变更并未生效。</p><p>如果我们将go.mod中的go version改为Go 1.21.0，再运行该示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run panicnil.go</span></span>
<span class="line"><span>recover panic from panic called with nil argument</span></span></code></pre></div><p>我们看到，这次示例中的panic(nil)语义发生了变化，匹配了Go 1.21对panic(nil)语义的改变。</p><p>在Go 1.21中，除了使用GODEBUG=panicnil=1来恢复原先语义外，还可以在main包中使用//go:debug指示符：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-evolution/tools/godebug/panicnil.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//go:debug panicnil=1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 省略... ...</span></span></code></pre></div><p>使用//go:debug指示符后，即便使用Go 1.21编译，panic(nil)也会恢复到之前的语义。很多Gopher说，历经这么多版本，GODEBUG究竟有多少开关选项已经记不住了。没关系，Go官方文档为Gopher提供了 <a href="https://go.dev/doc/godebug#history" target="_blank" rel="noreferrer">GODEBUG演进历史的文档</a>，方便我们在使用时查阅。</p><p>这样，Go 1.21以后，GODEBUG就成为了一种标准兼容机制，用于应对那些处于Go 1兼容性承诺范围内，但又可能对现有代码造成破坏的change。</p><h4 id="向前兼容" tabindex="-1">向前兼容 <a class="header-anchor" href="#向前兼容" aria-label="Permalink to &quot;向前兼容&quot;">​</a></h4><p>说完向后兼容，我们再来看看向前兼容，即用老编译器编译新版本代码。</p><p>有人会说，老编译器编译新版本代码能否编译通过并运行正常，要看新版本代码中是否使用了新版本的特性。比如用Go 1.16版本编译带泛型语法的Go 1.18代码肯定无法编译通过啊，升级一下编译器版本不就行了吗。向前兼容性的问题可能没有你想象的这么简单。</p><p>如果当前代码中没有使用Go 1.18中的泛型语法，使用Go 1.16就可以正常编译，但编译出的程序的运行时行为是否正常，就要看Go 1.18中看似与Go 1.16版本代码兼容的部分是否有语义上的改变。如果存在这种语义上的改变，进而导致程序在生产中实际行为与预期行为不同，那可能比编译失败所造成的损失更大。因此，Go团队希望在向前兼容方面提供更精细化、更准确的管理手段。</p><p>从Go 1.21开始，go.mod文件中的go line会被当成一个 <strong>约束规则</strong>。go line中的Go版本号被解释为 <strong>用于编译该module时使用的最小Go语言版本</strong>，只有这个版本或其高于它的版本才能保证具有该module所需的Go语法语义。</p><p>Go始终允许用低版本Go工具链，来编译go line中版本号高于该工具链版本的Go代码，这是为了避免不必要的编译失败给开发者带来的情绪影响。试想一下，如果你被告知Go版本太旧无法编译程序，肯定不会感到开心。</p><p>但在Go 1.21之前，旧版本工具链编译新代码，有时候会构建成功（比如代码中没有使用新版本引入的新语法特性），有时会因代码中的新语法特性而构建失败。这种割裂的体验是Go团队不希望看到的，于是Go团队希望 <a href="https://go.dev/blog/toolchain" target="_blank" rel="noreferrer">将工具链的管理也纳入到Go命令中</a>。</p><p>Go 1.21中一个最直观的变化，就是当用Go 1.21编译一个go line为Go 1.21.1的module时，如果本地不存在Go 1.21.1工具链，Go 1.21不会报错，而是去尝试下载Go 1.21.1工具链到本地。如果下载成功，就会用Go 1.21.1来编译这个module：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run panicnil.go // 将go.mod中的go line改为1.21.1后</span></span>
<span class="line"><span>go: downloading go1.21.1 (darwin/amd64)</span></span>
<span class="line"><span>go: download go1.21.1 for darwin/amd64: toolchain not available</span></span></code></pre></div><p>不过，Go 1.21自动下载新版工具链后，并不会将它安装到GOPATH/bin或覆盖当前本地安装的工具链。它会将下载的新版本工具链当作Go module，这继承了module管理的所有安全和隐私优势，然后Go会从module缓存中运行下载后的工具链module。</p><p>除此之外，Go 1.21还在go.mod中引入了 <a href="https://go.dev/doc/toolchain" target="_blank" rel="noreferrer">toolchain指示符</a> 以及GOTOOLCHAIN环境变量。一个包含了toolchain指示符的go.mod的内容如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go.mod</span></span>
<span class="line"><span>module m</span></span>
<span class="line"><span></span></span>
<span class="line"><span>go 1.21.0</span></span>
<span class="line"><span>toolchain go1.21.4</span></span></code></pre></div><p>这个go.mod中的go line含义是当其他go module依赖m时，需要至少使用Go 1.21.0版本的工具链。而m模块的作者编译m时，需要一个更新的工具链，即Go 1.21.4。</p><p>我们知道，通过go get example.com/module@v1.2.1可以更新go.mod中的require block。在Go 1.21版本中，我们可以使用go get go@1.21.1更新go.mod中的go line中的go version。当然以此类推，我们也可以通过go get toolchain@go1.21.1更新go.mod中的toolchain line中的工具链版本号。</p><p>Go工具链最终版本的选择规则较为繁琐，受到local安装的Go工具链版本、GOTOOLCHAIN环境变量的设置以及go.mod中的toolchain line的综合影响，你可以参考 <a href="https://go.dev/doc/toolchain" target="_blank" rel="noreferrer">toolchain文档</a> 理解，这里就不引述了。</p><h3 id="go-work支持vendor" tabindex="-1">go work支持vendor <a class="header-anchor" href="#go-work支持vendor" aria-label="Permalink to &quot;go work支持vendor&quot;">​</a></h3><p>在Go 1.22版本中，我们通过go work vendor可以将workspace中的依赖放到vendor⽬录下。在构建时，如果workspace下有vendor⽬录，那么默认的构建是go build -mod=vendor，即基于vendor的构建。</p><h3 id="go-mod-init不再care其他vendor工具的配置文件" tabindex="-1">go mod init不再care其他vendor工具的配置文件 <a class="header-anchor" href="#go-mod-init不再care其他vendor工具的配置文件" aria-label="Permalink to &quot;go mod init不再care其他vendor工具的配置文件&quot;">​</a></h3><p>从Go 1.22版本开始，go mod init不再尝试将其他vendor工具（例如Gopkg.lock ）的配置文件导入到go module依赖文件(go.mod)中了，也就是说从Go 1.22版本开始，go module出现之前的那些gopath时代的依赖管理工具正式退出并成为历史了。</p><h3 id="支持telemetry-遥测" tabindex="-1">支持Telemetry（遥测） <a class="header-anchor" href="#支持telemetry-遥测" aria-label="Permalink to &quot;支持Telemetry（遥测）&quot;">​</a></h3><p>Go团队在Go 1.23版本工具链中正式加入了Telemetry。Telemetry可以帮助Go团队改进Go语言和工具，了解Go工具链使用情况和问题并提供比GitHub问题或年度用户调查更详细、及时的数据。</p><p>Go Telemetry由Telemetry模式控制，有三种可能的值：</p><ul><li><p>local（默认）：收集数据并存储在本地计算机上，但不上传。</p></li><li><p>on：收集数据，并可能根据采样上传。</p></li><li><p>off：不收集也不上传数据。</p></li></ul><p>你可以通过go env GOTELEMETRY查看当前模式，通过go telemetry on|off|local来选择使用哪种模式。</p><p>Go Telemetry使用计数器来收集数据，它主要有两类计数器。基本计数器用来记录命名事件的次数，栈计数器用来记录事件次数和发生时的调用栈。</p><p>计数器数据写入本地文件系统（存储路径可通过go env GOTELEMETRYDIR查看）的内存映射文件中：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 在我的macOS上</span></span>
<span class="line"><span>$go env GOTELEMETRYDIR</span></span>
<span class="line"><span>/Users/tonybai/Library/Application Support/go/telemetry</span></span></code></pre></div><p>大约每周一次，计数器数据会被汇总成报告，存储在本地目录中。如果启用了上传（on），只有经过批准的计数器子集会被上传到telemetry.go.dev。</p><p>访问telemetry.go.dev网站可以查看由公开上传数据合并的报告和生成的图表。这些报告和图表可以帮助Go团队了解工具的使用情况、性能表现，从而有针对性地改进。</p><p>为了Go演进路线的精准，也希望你能多多支持，在下载Go 1.23版本后，简单地执行“go telemetry on”，你就可以为Go做贡献了。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go telemetry on</span></span>
<span class="line"><span>Telemetry uploading is now enabled and data will be periodically sent to</span></span>
<span class="line"><span>https://telemetry.go.dev/. Uploaded data is used to help improve the Go</span></span>
<span class="line"><span>toolchain and related tools, and it will be published as part of a public</span></span>
<span class="line"><span>dataset.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>For more details, see https://telemetry.go.dev/privacy.</span></span>
<span class="line"><span>This data is collected in accordance with the Google Privacy Policy</span></span>
<span class="line"><span>(https://policies.google.com/privacy).</span></span>
<span class="line"><span></span></span>
<span class="line"><span>To disable telemetry uploading, but keep local data collection, run</span></span>
<span class="line"><span>“go telemetry local”.</span></span>
<span class="line"><span>To disable both collection and uploading, run “go telemetry off”.</span></span></code></pre></div><h3 id="go-mod新增tool指示符-支持对tool的依赖管理" tabindex="-1">go.mod新增tool指示符，支持对tool的依赖管理 <a class="header-anchor" href="#go-mod新增tool指示符-支持对tool的依赖管理" aria-label="Permalink to &quot;go.mod新增tool指示符，支持对tool的依赖管理&quot;">​</a></h3><p>我们日常编写Go项目代码时常常会依赖一些使用Go编写的工具，比如golang.org/x/tools/cmd/stringer或github.com/kyleconroy/sqlc。我们希望所有项目合作者都使用相同版本的工具，以避免在不同时间、不同环境中输出不同的结果。因此，Go社区希望通过go.mod将工具的版本以及依赖管理起来。</p><p>在Go 1.24版本之前，Go Wiki推荐一种来自社区的最佳实践：tools.go。阐述这种实践最好的一个示例来自Go modules by example中的一个文档： <a href="https://github.com/go-modules-by-example/index/blob/master/010_tools/README.md" target="_blank" rel="noreferrer">Tools as dependencies</a>，其大致思路是将项目依赖的Go工具以“项目依赖”的方式存放到tools.go文件（放到go module根目录下）中。以golang.org/x/tools/cmd/stringer为例，tools.go的内容大致如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//go:build tools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package tools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    _ &quot;golang.org/x/tools/cmd/stringer&quot;</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>然后在同一目录下安装stringer或直接go run：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go install golang.org/x/tools/cmd/stringer</span></span></code></pre></div><p>在安装stringer时，go.mod会记录下对stringer的依赖以及对应的版本，后续go.mod提交到项目repo中，所有项目成员就都可以使用相同版本的Stringer了。</p><p>tools.go实践虽然能解决问题，但还是存在一些不便：</p><ul><li><p>配置繁琐：需要手动创建tools.go文件，并添加特定的构建标签来排除它。</p></li><li><p>使用不便：运行工具时可能需要额外的脚本或配置（每次手敲go run golang.org/x/tools/cmd/stringer的确有些不便）。</p></li></ul><p>Go开发者期望 <strong>工具依赖</strong> 也能够无缝地与其他项目依赖（包依赖）统一管理，并纳入go.mod的版本控制体系。为此，Go 1.24设计并实现了下面几点：</p><ul><li><p>go.mod引入tool directive，用于显式声明项目所需的工具。</p></li><li><p>tool directive与其他依赖项统一纳入go.mod文件，方便管理和版本控制。</p></li><li><p>扩展go install和go get命令，支持安装、更新和卸载工具。</p></li></ul><p>来看一个示例，首先我们初始化一个module：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go mod init demo</span></span>
<span class="line"><span>go: creating new go.mod: module demo</span></span>
<span class="line"><span>$ cat go.mod</span></span>
<span class="line"><span>module demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>go 1.24</span></span></code></pre></div><p>编辑go.mod，加入下面内容：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat go.mod</span></span>
<span class="line"><span>module demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>go 1.24</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tool golang.org/x/tools/cmd/stringer</span></span></code></pre></div><p>安装tool前需要go get它的依赖，否则go install会报错：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go install tool</span></span>
<span class="line"><span>no required module provides package golang.org/x/tools/cmd/stringer; to add it:</span></span>
<span class="line"><span>    go get golang.org/x/tools/cmd/stringer</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$go get golang.org/x/tools/cmd/stringer</span></span>
<span class="line"><span>go: downloading golang.org/x/tools v0.28.0</span></span>
<span class="line"><span>go: downloading golang.org/x/sync v0.10.0</span></span>
<span class="line"><span>go: downloading golang.org/x/mod v0.22.0</span></span>
<span class="line"><span>go: added golang.org/x/mod v0.22.0</span></span>
<span class="line"><span>go: added golang.org/x/sync v0.10.0</span></span>
<span class="line"><span>go: added golang.org/x/tools v0.28.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ cat go.mod</span></span>
<span class="line"><span>module demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>go 1.24</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tool golang.org/x/tools/cmd/stringer</span></span>
<span class="line"><span></span></span>
<span class="line"><span>require (</span></span>
<span class="line"><span>    golang.org/x/mod v0.22.0 // indirect</span></span>
<span class="line"><span>    golang.org/x/sync v0.10.0 // indirect</span></span>
<span class="line"><span>    golang.org/x/tools v0.28.0 // indirect</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>我们看到，go.mod中require了stringer的依赖。接下来，我们便可以用go install安装stringer了：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ ls -l \`which stringer\` // old版本的stringer</span></span>
<span class="line"><span>-rwxr-xr-x 1 root root 6500561 1月  23 2024 /root/go/bin/stringer</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ gotip install tool</span></span>
<span class="line"><span>$ ls -l \`which stringer\`</span></span>
<span class="line"><span>-rwxr-xr-x 1 root root 7303970 12月  9 21:41 /root/go/bin/stringer</span></span></code></pre></div><p>使用stringer时也无需手工敲入那么长的命令（go run golang.org/x/tools/cmd/stringer），只需使用gotip tool stringer即可：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go tool stringer</span></span>
<span class="line"><span>Usage of stringer:</span></span>
<span class="line"><span>    stringer [flags] -type T [directory]</span></span>
<span class="line"><span>    stringer [flags] -type T files... # Must be a single package</span></span>
<span class="line"><span>For more information, see:</span></span>
<span class="line"><span>    https://pkg.go.dev/golang.org/x/tools/cmd/stringer</span></span>
<span class="line"><span>Flags:</span></span>
<span class="line"><span>  -linecomment</span></span>
<span class="line"><span>        use line comment text as printed text when present</span></span>
<span class="line"><span>  -output string</span></span>
<span class="line"><span>        output file name; default srcdir/&amp;lt;type&amp;gt;_string.go</span></span>
<span class="line"><span>  -tags string</span></span>
<span class="line"><span>        comma-separated list of build tags to apply</span></span>
<span class="line"><span>  -trimprefix prefix</span></span>
<span class="line"><span>        trim the prefix from the generated constant names</span></span>
<span class="line"><span>  -type string</span></span>
<span class="line"><span>        comma-separated list of type names; must be set</span></span></code></pre></div><p>go tool stringer就相当于go run golang.org/x/tools/cmd/stringer@v0.28.0了（注：v0.28.0是当前golang.org/x/tools的版本）。</p><h3 id="go-run生成的可执行文件支持缓存" tabindex="-1">Go run生成的可执行文件支持缓存 <a class="header-anchor" href="#go-run生成的可执行文件支持缓存" aria-label="Permalink to &quot;Go run生成的可执行文件支持缓存&quot;">​</a></h3><p>Go 1.24 之前，cmd/go仅缓存编译后的包文件（build actions），而不缓存链接后的二进制文件（link actions）。不缓存二进制文件很大原因在于，二进制文件比单个包对象文件大得多，并且它们不像包文件那样被经常重用。</p><p>不过Go 1.24支持了对依赖工具的管理，以及让go tool支持自定义工具执行，go run以及像上面那种go tool stringer（本质上也是go run golang.org/x/tools/cmd/stringer@v0.28.0）的编译链接的结果会被缓存到go build cache中。这也是上面不同项目依赖同一工具不同版本时不会相互覆盖，以及首次使用go tool执行依赖工具较慢的原因。第一次go tool执行会执行编译链接过程，之后的运行就会从缓存中直接找到缓存的文件并执行了。</p><p>不过缓存可执行文件会显著增大go build cache的磁盘空间占用，因此该功能特性也规定了，在 <a href="https://github.com/golang/go/issues/68872" target="_blank" rel="noreferrer">缓存执行定期清理</a> 的时候， <strong>可执行文件缓存会优先于包缓存被清理掉</strong>。</p><h3 id="go-build支持-json" tabindex="-1">go build支持-json <a class="header-anchor" href="#go-build支持-json" aria-label="Permalink to &quot;go build支持-json&quot;">​</a></h3><p>Go 1.24版本之前，Go已经支持了go test -json命令，旨在为测试过程提供结构化的JSON输出，便于工具解析和处理测试结果。然而，当测试或导入的包在构建过程中失败时，构建错误信息会与测试的JSON输出交织在一起，导致工具难以准确地将构建错误与受影响的测试包关联起来。这增加了工具处理go test -json输出的复杂性。</p><p>为了解决这个问题，Go 1.24提出了为go build命令（包括go install）添加-json标志的建议，以便生成与go test -json兼容的结构化JSON输出。go test -json也得到了优化，如今test出现构建错误时，go test -json也会以json格式输出构建错误信息，与test结果的json内容可以很好地融合在一起。当然，你也可以通过GODEBUG=gotestjsonbuildtext=1继续让go test -json输出文本格式的构建错误信息，以保持与Go 1.24之前的情况一致。</p><h3 id="go工具链支持http扩展认证-goauth" tabindex="-1">go工具链支持HTTP扩展认证：GOAUTH <a class="header-anchor" href="#go工具链支持http扩展认证-goauth" aria-label="Permalink to &quot;go工具链支持HTTP扩展认证：GOAUTH&quot;">​</a></h3><p>在Go语言中，go get命令用于从远程代码仓库获取依赖包。通常，这些依赖包的导入路径是通过HTTP请求获取的，服务器会返回一个包含元标签（meta tag）的HTML页面，指示如何获取该包的源代码。</p><p>然而，对于需要身份验证的私有仓库，go get无法直接工作。因为go get使用的是net/http.DefaultClient，它不知道如何处理需要身份验证的URL。具体来说，当go get尝试获取一个私有仓库的URL时，由于没有提供身份验证信息，服务器会返回401或403错误，导致go get无法继续执行。这个问题在企业环境中尤为常见，因为许多公司使用私有代码托管服务，而这些服务通常需要身份验证。</p><p>Go 1.24为上述情况提供了一种方案，让go get能够支持需要身份验证的私有仓库，使得用户可以通过go get命令获取私有仓库中的代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go get git.mycompany.com/private-repo</span></span></code></pre></div><p>即使 <a href="https://git.mycompany.com/private-repo" target="_blank" rel="noreferrer">https://git.mycompany.com/private-repo</a> 需要身份验证，go get也能够正常工作。</p><p>方案采用了一种类似于Git凭证助手的机制，并通过新增的Go环境变量GOAUTH来指定一个或多个认证命令。go get在执行时会调用这些命令，获取身份验证信息，并在后续的HTTP请求中使用这些信息。</p><p>GOAUTH环境变量可以包含一个或多个认证命令，每个命令由空格分隔的参数列表组成，命令之间用分号分隔。go get会在每次需要进行HTTP请求时，首先检查缓存中的认证信息，如果没有匹配的认证信息，则会调用GOAUTH命令来获取新的认证信息。</p><p>通过go help goauth可以查看GOAUTH的详细用法，在Go 1.24中它支持如下认证命令：</p><ul><li><p>off：禁用GOAUTH功能。</p></li><li><p>netrc：从NETRC或用户主目录中的.netrc文件中获取访问凭证，这也是 <strong>GOAUTH的默认值</strong>。</p></li><li><p>git dir：在指定目录dir中运行git credential fill并使用其凭证。go命令将运行git credential approve/reject来更新凭证助手的缓存。</p></li><li><p>command：执行给定的命令（以空格分隔的参数列表），并将提供的头信息附加到 HTTPS 请求中。该命令必须按照以下格式生成输出：</p></li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Response      = { CredentialSet } .</span></span>
<span class="line"><span>CredentialSet = URLLine { URLLine } BlankLine { HeaderLine } BlankLine .</span></span>
<span class="line"><span>URLLine       = /* URL that starts with &quot;https://&quot; */ &#39;\\n&#39; .</span></span>
<span class="line"><span>HeaderLine    = /* HTTP Request header */ &#39;\\n&#39; .</span></span>
<span class="line"><span>BlankLine     = &#39;\\n&#39; .</span></span></code></pre></div><p>最后我们再来看看标准库的重要变化。</p><h2 id="标准库" tabindex="-1">标准库 <a class="header-anchor" href="#标准库" aria-label="Permalink to &quot;标准库&quot;">​</a></h2><p>Go的标准库功能丰富，是Go语言成功的重要原因之一。在过去的三年中，Go标准库在诸多方面都得到了增强，这里仅列出一些我觉得重要的变化。</p><h3 id="支持wrap-multiple-errors" tabindex="-1">支持wrap multiple errors <a class="header-anchor" href="#支持wrap-multiple-errors" aria-label="Permalink to &quot;支持wrap multiple errors&quot;">​</a></h3><p>Go 1.20引入了一种新机制，可以将多个错误包装（wrap)成一个错误。这使得从打包后的错误中，可以一次性获取相关错误信息。该机制包括一个(匿名)接口和一个函数：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface {</span></span>
<span class="line"><span>    Unwrap() []error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Join(errs ...error) error</span></span></code></pre></div><p>同时增强了像fmt.Errorf这样的函数的语义，当在Errorf中使用多个%w verb时，比如：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>e := errors.Errorf(&quot;%w, %w, %w&quot;, e1, e2, e3)</span></span></code></pre></div><p>Errorf将返回一个将e1, e2, e3打包完，且实现了上述带有Unwrap() []error方法的接口的错误类型实例。</p><p>Join函数的语义是将传入的所有error打包成一个错误类型实例，该实例同样实现了上述带有Unwrap() []error方法的接口，且该错误实例的类型的Error方法会返回换行符间隔的错误列表。我们来看下面这个例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;errors&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type MyError struct {</span></span>
<span class="line"><span>    s string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (e *MyError) Error() string {</span></span>
<span class="line"><span>    return e.s</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    e1 := errors.New(&quot;error1&quot;)</span></span>
<span class="line"><span>    e2 := errors.New(&quot;error2&quot;)</span></span>
<span class="line"><span>    e3 := errors.New(&quot;error3&quot;)</span></span>
<span class="line"><span>    e4 := &amp;MyError{</span></span>
<span class="line"><span>        s: &quot;error4&quot;,</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    e := fmt.Errorf(&quot;%w, %w, %w, %w&quot;, e1, e2, e3, e4)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fmt.Printf(&quot;e = %s\\n&quot;, e.Error()) // error1 error2, error3, error4</span></span>
<span class="line"><span>    fmt.Println(errors.Is(e, e1)) // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var ne *MyError</span></span>
<span class="line"><span>    fmt.Println(errors.As(e, &amp;ne)) // true</span></span>
<span class="line"><span>    fmt.Println(ne == e4) // true</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们首先在Go 1.19编译运行上面程序：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>e = error1 %!w(*errors.errorString=&amp;{error2}), %!w(*errors.errorString=&amp;{error3}), %!w(*main.MyError=&amp;{error4})</span></span>
<span class="line"><span>false</span></span>
<span class="line"><span>false</span></span>
<span class="line"><span>false</span></span></code></pre></div><p>显然Go 1.19的fmt.Errorf函数尚不支持多%w verb。而Go 1.20编译上面程序的运行结果为：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>e = error1 error2, error3, error4</span></span>
<span class="line"><span>true</span></span>
<span class="line"><span>true</span></span>
<span class="line"><span>true</span></span></code></pre></div><p>将fmt.Errorf一行换为：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>e := errors.Join(e1, e2, e3, e4)</span></span></code></pre></div><p>再运行一次的结果为：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>e = error1</span></span>
<span class="line"><span>error2</span></span>
<span class="line"><span>error3</span></span>
<span class="line"><span>error4</span></span>
<span class="line"><span>true</span></span>
<span class="line"><span>true</span></span>
<span class="line"><span>true</span></span></code></pre></div><p>即Join函数打包后的错误类型实例类型的Error方法会返回换行符间隔的错误列表。</p><h3 id="增加slices、maps和cmp" tabindex="-1">增加slices、maps和cmp <a class="header-anchor" href="#增加slices、maps和cmp" aria-label="Permalink to &quot;增加slices、maps和cmp&quot;">​</a></h3><p>在Go实验库“孵化”了一年多的几个泛型包：slices、maps和cmp，终于在Go 1.21版本中正式加入到标准库中了。</p><p>slices切片包提供了针对切片的常用操作，slices包使用了泛型函数，可处理任何元素类型的切片。同理，maps包与slices包地位相似，只不过操作对象换成了map类型变量，它可以处理任意类型键和元素类型的map。</p><p>cmp包是slices包依赖的包，这个包非常简单且内聚，它仅提供了与compare和ordered相关的约束类型定义与简单泛型函数：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// cmp包</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Ordered interface {</span></span>
<span class="line"><span>    ~int | ~int8 | ~int16 | ~int32 | ~int64 |</span></span>
<span class="line"><span>        ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |</span></span>
<span class="line"><span>        ~float32 | ~float64 |</span></span>
<span class="line"><span>        ~string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Less[T Ordered](x, y T) bool {</span></span>
<span class="line"><span>    return (isNaN(x) &amp;&amp; !isNaN(y)) || x &amp;lt; y</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Compare[T Ordered](x, y T) int {</span></span>
<span class="line"><span>    ... ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func isNaN[T Ordered](x T) bool {</span></span>
<span class="line"><span>    return x != x</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上三个包没有太多可说的，都是一些utils类的函数，你在日常开发中记得用就可以了。基于泛型的实现以及unified中间代码的优化，这些函数的性能相对于基于interface实现的通用工具函数要高出一些。</p><p>Go 1.23增加自定义迭代器后，标准库还在maps、slices等包中增加了函数迭代器的实用函数。其中slices包增加了：All、Values、Backward、Collect、AppendSeq、Sortted、SortedFunc、SortedStableFunc和Chunk。maps包增加了All、Keys、Values、Insert和Collect。</p><h3 id="新增unique包" tabindex="-1">新增unique包 <a class="header-anchor" href="#新增unique包" aria-label="Permalink to &quot;新增unique包&quot;">​</a></h3><p>unique包的灵感来自于第三方包 <a href="https://github.com/go4org/intern" target="_blank" rel="noreferrer">go4.org/intern</a>，也是为了弥补Go语言缺乏对 <a href="https://en.wikipedia.org/wiki/Interning_(computer_science)" target="_blank" rel="noreferrer">interning</a> 内置支持的空缺。</p><p>根据Wikipedia的描述，interning是按需重复使用具有同等值对象的技术，减少创建新对象的动作。这种创建模式经常用于不同编程语言中的数和字符串，可以避免不必要的对象重复分配的开销。</p><p>Go unique包即是Go的interning机制的实现，unique包提供了一种高效的值去重和快速比较的机制，可以用于优化某些特定场景下的程序性能。</p><p>unique包提供给开发人员的API接口非常简单，Make用来创建Handle实例，Handle的方法Value用于获取值的拷贝。下面是一个使用unique包的典型示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-evolution/stdlib/unique/main.go</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;unique&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 创建唯一Handle</span></span>
<span class="line"><span>    s1 := unique.Make(&quot;hello&quot;)</span></span>
<span class="line"><span>    s2 := unique.Make(&quot;world&quot;)</span></span>
<span class="line"><span>    s3 := unique.Make(&quot;hello&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // s1和s3是相等的，因为它们是同一个字符串值</span></span>
<span class="line"><span>    fmt.Println(s1 == s3) // true</span></span>
<span class="line"><span>    fmt.Println(s1 == s2) // false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从Handle获取原始值</span></span>
<span class="line"><span>    fmt.Println(s1.Value()) // hello</span></span>
<span class="line"><span>    fmt.Println(s2.Value()) // world</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码和输出结果都不难理解，这里就不多解释了。</p><h3 id="log-slog包" tabindex="-1">log/slog包 <a class="header-anchor" href="#log-slog包" aria-label="Permalink to &quot;log/slog包&quot;">​</a></h3><p>Go 1.21版本标准库正式加入了log/slog包，这是Go官方的结构化日志包。如果仅是想以最快速的方式开始使用slog，那么下面可以算是slog的&quot;hello, world&quot;版本：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;log/slog&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    slog.Info(&quot;my first slog msg&quot;, &quot;greeting&quot;, &quot;hello, slog&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这段程序，会得到下面输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run main.go</span></span>
<span class="line"><span>2025/01/05 05:01:36 INFO my first slog msg greeting=&quot;hello, slog&quot;</span></span></code></pre></div><p>我们看到，默认情况下slog输出的格式仅是普通text格式，而并非结构化的JSON格式，也不是以key=value形式呈现的文本。</p><p>slog提供了以JSON格式输出的JSONHandler和以key=value形式呈现的文本形式的TextHandler。不过要使用这两种Handler进行日志输出，我们需要显式创建它们：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>h := slog.NewTextHandler(os.Stderr, nil)</span></span>
<span class="line"><span>l := slog.New(h)</span></span>
<span class="line"><span>l.Info(&quot;greeting&quot;, &quot;name&quot;, &quot;tony&quot;)</span></span>
<span class="line"><span>l.Error(&quot;oops&quot;, &quot;err&quot;, net.ErrClosed, &quot;status&quot;, 500)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>h1 := slog.NewJSONHandler(os.Stderr, nil)</span></span>
<span class="line"><span>l1 := slog.New(h1)</span></span>
<span class="line"><span>l1.Info(&quot;greeting&quot;, &quot;name&quot;, &quot;tony&quot;)</span></span>
<span class="line"><span>l1.Error(&quot;oops&quot;, &quot;err&quot;, net.ErrClosed, &quot;status&quot;, 500)</span></span></code></pre></div><p>上述代码分别创建了一个使用TextHandler的slog.Logger实例，以及一个使用JSONHandler的slog.Logger实例，执行这段代码后将输出如下日志：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run main.go</span></span>
<span class="line"><span>time=2025-01-05T05:34:27.370+08:00 level=INFO msg=greeting name=tony</span></span>
<span class="line"><span>time=2025-01-05T05:34:27.370+08:00 level=ERROR msg=oops err=&quot;use of closed network connection&quot; status=500</span></span>
<span class="line"><span>{&quot;time&quot;:&quot;2025-01-05T05:34:27.370306+08:00&quot;,&quot;level&quot;:&quot;INFO&quot;,&quot;msg&quot;:&quot;greeting&quot;,&quot;name&quot;:&quot;tony&quot;}</span></span>
<span class="line"><span>{&quot;time&quot;:&quot;2025-01-05T05:34:27.370315+08:00&quot;,&quot;level&quot;:&quot;ERROR&quot;,&quot;msg&quot;:&quot;oops&quot;,&quot;err&quot;:&quot;use of closed network connection&quot;,&quot;status&quot;:500}</span></span></code></pre></div><p>如果觉得每次还得使用l或l1来调用Info、Error等输出日志的函数不便利，可以将l或l1设置为Default Logger，这样无论在任何包内都可以直接调用slog包级函数，如Info、Error等直接输出日志。</p><p>当然，slog还支持自定义HandlerOption、动态调整日志级别、自定义后端Handler等，这里就不展开了。</p><p>按官方benchmark结果，log/slog的性能要高于Go社区常用的结构化日志包，比如zap等。即便如此，log在go应用中带来的延迟依旧不可忽视。slog的 <a href="https://go.googlesource.com/proposal/+/master/design/56345-structured-logging.md" target="_blank" rel="noreferrer">proposal design</a> 中给出了一些关于性能的考量和tip，你可以在日后使用slog时借鉴：</p><ul><li><p>使用Logger.With避免重复格式化公共属性字段，这使得处理程序可以缓存格式化结果。</p></li><li><p>将昂贵的计算推迟到日志输出时再进行，例如传递指针而不是格式化后的字符串。这可以避免在禁用的日志行上进行不必要的工作。</p></li><li><p>对于昂贵的值，可以实现LogValuer接口，这样在输出时可以进行lazy加载计算。</p></li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// log/slog/value.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// A LogValuer is any Go value that can convert itself into a Value for logging.</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// This mechanism may be used to defer expensive operations until they are</span></span>
<span class="line"><span>// needed, or to expand a single value into a sequence of components.</span></span>
<span class="line"><span>type LogValuer interface {</span></span>
<span class="line"><span>    LogValue() Value</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，内置的Handler已经处理了原子写入的加锁，自定义Handler应该实现自己的加锁。</p><h3 id="math-rand-v2-标准库的第一个v2版本包" tabindex="-1">math/rand/v2：标准库的第一个v2版本包 <a class="header-anchor" href="#math-rand-v2-标准库的第一个v2版本包" aria-label="Permalink to &quot;math/rand/v2：标准库的第一个v2版本包&quot;">​</a></h3><p>Go 1.22中新增了math/rand/v2包，这里之所以将它列为Go 1.22版本标准库的⼀次重要变化，是因为这是标准库第一次为某个包建⽴v2版本，按照Russ Cox的说法，这次math/rand/v2包的创建，算是为标准库中其他可能的v2包“探探路”，找找落地路径。</p><p>关于math/rand/v2包相对于原math/rand包的变化有很多，具体可以参考 <a href="https://go.dev/issue/61716" target="_blank" rel="noreferrer">issue 61716</a> 中的设计与讨论。</p><h3 id="增强http-servemux表达能力" tabindex="-1">增强http.ServeMux表达能力 <a class="header-anchor" href="#增强http-servemux表达能力" aria-label="Permalink to &quot;增强http.ServeMux表达能力&quot;">​</a></h3><p>在Go 1.22版本中，http.ServeMux的表达能力得到了大幅提升，从原先只支持静态路由，到新版本中支持如下一些特性：</p><ul><li><p><code>&quot;/index.html&quot;</code> 路由将匹配任何主机和方法的路径 <code>&quot;/index.html&quot;</code>。</p></li><li><p><code>&quot;GET /static/&quot;</code> 将匹配路径以 <code>&quot;/static/&quot;</code> 开头的GET请求。</p></li><li><p><code>&quot;example.com/&quot;</code> 可以与任何指向主机为 <code>&quot;example.com&quot;</code> 的请求匹配。</p></li><li><p><code>&quot;example.com/{$}&quot;</code> 会匹配主机为 <code>&quot;example.com&quot;</code>、路径为 <code>&quot;/&quot;</code> 的请求，即 <code>&quot;example.com/&quot;</code>。</p></li><li><p><code>&quot;/b/{bucket}/o/{objectname…}&quot;</code> 匹配第一段为 <code>&quot;b&quot;</code>、第三段为 <code>&quot;o&quot;</code> 的路径。名称 <code>&quot;bucket&quot;</code> 表示第二段， <code>&quot;objectname&quot;</code> 表示路径的其余部分。</p></li></ul><p>并且新版ServeMux在路由匹配性能方面也不输众多开源HTTP路由框架太多，后续建立Go Web或API类新项目时，可以考虑首选新版ServeMux来进行路由匹配了，减少对外部的一个依赖。</p><h3 id="timer-ticker变化" tabindex="-1">Timer/Ticker变化 <a class="header-anchor" href="#timer-ticker变化" aria-label="Permalink to &quot;Timer/Ticker变化&quot;">​</a></h3><p>timer/ticker的stop/reset问题一直困扰Go团队，Go 1.23的两个重要fix期望能从根本上解决这个问题。</p><p>首先，Timer/Ticker的GC不再需要Stop（ <a href="https://github.com/golang/go/issues/61542" target="_blank" rel="noreferrer">issue 61542</a>）。程序不再引用的Timer和Ticker将立即有资格进行垃圾回收，即使它们的Stop方法尚未被调用。Go的早期版本直到触发后才会收集未停止的Timer，并且从未收集未停止的Ticker。</p><p>其次，Timer/Ticker的Stop/Reset后不再接收旧值（ <a href="https://github.com/golang/go/issues/37196" target="_blank" rel="noreferrer">issue 37196</a>）。与Timer或Ticker关联的计时器channel现在改为无缓冲的了，即容量为0。此更改的主要效果是Go现在保证任何对Reset或Stop方法的调用，调用之前不会发送或接收任何陈旧值。Go的早期版本使用带有缓冲区的channel，因此很难正确使用Reset和Stop。此更改的一个明显效果是计时器channel的len和cap现在返回0而不是1，这可能会影响轮询长度以确定是否在计时器channel上接收的程序。通过GODEBUG设置asynctimerchan=1可恢复异步通道行为。</p><h3 id="crypto-增加hkdf、pbkdf2、sha3等密码学包" tabindex="-1">crypto：增加hkdf、pbkdf2、sha3等密码学包 <a class="header-anchor" href="#crypto-增加hkdf、pbkdf2、sha3等密码学包" aria-label="Permalink to &quot;crypto：增加hkdf、pbkdf2、sha3等密码学包&quot;">​</a></h3><p>Go密码学团队维护的密码学包分布在Go标准库crypto目录和golang.org/x/crypto下面。Go密码学小组负责人 <a href="https://github.com/golang/go/issues/65269" target="_blank" rel="noreferrer">Roland Shoemaker认为当前这种“分割”的状态会带来一些问题</a>：</p><ul><li><p>用户困惑：用户经常对为什么某些加密库在x/crypto模块中，另一些在标准库中，而感到困惑。这种困惑可能导致用户不愿意依赖x/crypto模块中的代码，因为他们误以为x/crypto中的代码是“实验性”的，质量或API稳定性不如标准库。</p></li><li><p>复杂的安全补丁流程：标准库依赖于x/crypto模块中的多个包（目前有7个），这些包需要被vendored。这种依赖关系增加了安全补丁的复杂性，因为需要一个特殊的第三方流程来处理这些包的补丁，而不是像标准库或x/crypto模块那样直接处理。</p></li><li><p>开发周期不一致：理论上，x/crypto模块是一个可以快速开发新加密算法或协议的地方，因为这些算法或协议的规范可能还在变化中。然而，实际上，x/crypto模块并没有被这样使用。如果开始这样做，反而会强化用户对x/crypto模块的误解。</p></li><li><p>特定包的快速开发需求：例如x/crypto/ssh包最近经历了非常快速的开发，许多用户希望立即使用新引入的功能和修复。如果将这个包移入标准库，可能会因为标准库的发布周期较慢而产生摩擦。</p></li></ul><p>为此Shoemaker提议，将x/crypto下的包放到标准库crypto目录下，以简化Go语言加密库的管理和维护，提高用户对这些库的信任和使用率。方案的大致思路和步骤如下：</p><ul><li><p>将x/crypto模块中的大部分包直接迁移到标准库的crypto/目录下，迁移过程应在单个标准库发布周期内完成，尽量接近发布周期的末尾，以避免需要同步两个版本的包。</p></li><li><p>迁移后，冻结x/crypto模块和标准库中的对应包，直到标准库重新开放，只接受标准库版本的更改。</p></li><li><p>使用构建标签（build tags）来区分迁移前后的版本，允许用户在不更新到最新Go版本的情况下继续使用x/crypto模块。</p></li><li><p>在迁移后的两个主要版本中（例如，假设在Go 1.24中完成迁移，则在Go 1.26中），移除旧的构建标签实现，只保留转发到标准库版本的包装器。</p></li><li><p>一些包由于其更新周期与标准库不一致，或者已经冻结/弃用，将不会迁移到标准库中。例如，x/crypto/x509roots包需要根据任意时间表进行更新，因此应移至独立的模块golang.org/x/x509roots。</p></li><li><p>一些已经弃用或冻结的包（如twofish、cast5、tea等）将保留在x/crypto模块中，并在v1版本中标记为冻结。</p></li><li><p>x/crypto/ssh包由于其快速的开发周期，可能会在迁移时带来一些麻烦。虽然可以考虑将其推迟迁移，但最终仍建议将其移入标准库。</p></li></ul><p>基于上述方案，Go 1.24版本中，Go密码学团队完成了hkdf、pbkdf2、sha3和mlkem等包的迁移。当然，这次迁移与 <a href="https://github.com/golang/go/issues/69536" target="_blank" rel="noreferrer">Go密码学包要进行FIPS 140-3认证</a> 也有着直接的联系。这里面值得一提的是mklem包，它实现了 <a href="https://doi.org/10.6028/NIST.FIPS.203" target="_blank" rel="noreferrer">NIST FIPS 203</a> 中指定的抗量子密钥封装方法ML-KEM（以前称为Kyber），也是Go密码学包中第一个 <a href="https://en.wikipedia.org/wiki/Post-quantum_cryptography" target="_blank" rel="noreferrer">后量子密码学</a> 包。</p><h3 id="支持限制目录的文件系统访问" tabindex="-1">支持限制目录的文件系统访问 <a class="header-anchor" href="#支持限制目录的文件系统访问" aria-label="Permalink to &quot;支持限制目录的文件系统访问&quot;">​</a></h3><p>目录遍历漏洞（Directory Traversal Vulnerabilities）和符号链接遍历漏洞（Symlink Traversal Vulnerabilities）是常见的安全漏洞。攻击者通过提供相对路径（如&quot;…/…/…/etc/passwd&quot;）或创建符号链接，诱使程序访问其本不应访问的文件，从而导致安全问题。例如， <a href="https://nvd.nist.gov/vuln/detail/CVE-2024-3400" target="_blank" rel="noreferrer">CVE-2024-3400</a> 是一个最近的真实案例，展示了目录遍历漏洞如何导致远程代码执行。</p><p>在Go中，虽然可以通过filepath.IsLocal等函数来验证文件名，但防御符号链接遍历攻击较为困难。现有的os.Open和os.Create等函数在处理不受信任的文件名时，容易受到这些攻击的影响。</p><p>为了解决这些问题，Go 1.24在os包中添加几个新的函数和方法，以安全地打开文件并防止目录遍历和符号链接遍历攻击。</p><p>最初，该提案提出新增一些安全访问文件系统的API函数。在讨论过程中，Russ Cox提出了一个更为简洁的方案，避免了引入大量新的 API，而是通过引入一个新的类型Dir来表示受限的文件系统根目录。这个方案最终奠定了该提案的最终实现。</p><p>最终，Go在os包中引入了一个新的Root类型，并基于该类型提供了在特定目录内执行文件系统操作的能力。os.OpenRoot函数打开一个目录并返回一个os.Root。os.Root上的方法仅限于在该目录内操作，并且不允许路径引用目录外的位置，包括跟随符号链接指向目录外的路径。下面是一些Root类型的常用方法：</p><ul><li><p>os.Root.Open打开一个文件以供读取</p></li><li><p>os.Root.Create创建一个文件</p></li><li><p>os.Root.OpenFile是通用的打开调用</p></li><li><p>os.Root.Mkdir创建一个目录</p></li></ul><p>下面我们用一个示例来对比通过os.Root进行的文件系统操作与传统文件系统操作的差异：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-evolution/stdlib/osroot/main.go</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 使用 os.Root 访问相对路径</span></span>
<span class="line"><span>    root, err := os.OpenRoot(&quot;.&quot;) // 打开当前目录作为根目录</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error opening root:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer root.Close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 尝试访问相对路径 &quot;../passwd&quot;</span></span>
<span class="line"><span>    file, err := root.Open(&quot;../passwd&quot;)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error opening file with os.Root:&quot;, err)</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        fmt.Println(&quot;Successfully opened file with os.Root&quot;)</span></span>
<span class="line"><span>        file.Close()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 传统的 os.OpenFile 方式</span></span>
<span class="line"><span>    // 尝试访问相对路径 &quot;../passwd&quot;</span></span>
<span class="line"><span>    file2, err := os.OpenFile(&quot;../passwd&quot;, os.O_RDONLY, 0644)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error opening file with os.OpenFile:&quot;, err)</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        fmt.Println(&quot;Successfully opened file with os.OpenFile&quot;)</span></span>
<span class="line"><span>        file2.Close()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行上述代码，我们得到：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$gotip run main.go</span></span>
<span class="line"><span>Error opening file with os.Root: openat ../passwd: path escapes from parent</span></span>
<span class="line"><span>Successfully opened file with os.OpenFile</span></span></code></pre></div><p>我们看到，当代码通过os.Root返回的目录来尝试访问相对路径&quot;…/passwd&quot;时，由于os.Root限制了操作仅限于根目录内，因此会返回错误。</p><p>从安全角度来看，在Go 1.24发布之后，建议更多地使用这种安全操作文件系统的方式，特别是当你的文件操作都局限在一个目录下时。</p><h3 id="使用runtime-addcleanup替代setfinalizer" tabindex="-1">使用runtime.AddCleanup替代SetFinalizer <a class="header-anchor" href="#使用runtime-addcleanup替代setfinalizer" aria-label="Permalink to &quot;使用runtime.AddCleanup替代SetFinalizer&quot;">​</a></h3><p>Go 1.24版本之前，Go提供了runtime.SetFinalizer函数用于对象的终结处理。然而，SetFinalizer的使用存在许多问题和限制，Michael Knyszek总结了下面几点：</p><ul><li><p>SetFinalizer必须引用分配的第一个字：这要求程序员了解什么是“分配”，而这一概念在语言中通常不暴露。</p></li><li><p>每个对象只能有一个终结器，也就是说不能为同一个对象设置多个终结器。</p></li><li><p>引用循环问题：如果对象参与了引用循环，且该对象有终结器，那么该对象将不会被释放，终结器也不会运行。</p></li><li><p>GC周期问题：有终结器的对象至少需要两个GC周期才能被释放。</p></li></ul><p>后面两个问题主要源于SetFinalizer允许对象复活（object resurrection），这使得对象的清理变得复杂且不可靠。</p><p>为了解决上述问题，，Michael Knyszek提出了一个新的API runtime.AddCleanup，并建议正式弃用runtime.SetFinalizer。AddCleanup的设计目标是解决SetFinalizer的诸多问题，特别是避免对象复活，从而允许对象的及时清理，并支持对象的循环清理。AddCleanup函数的原型如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func AddCleanup[T, S any](ptr *T, cleanup func(S), arg S) Cleanup</span></span></code></pre></div><p>AddCleanup函数将一个清理函数附加到ptr。当ptr不再可达时，运行时会在一个单独的goroutine中调用 cleanup(arg)。AddCleanup的一个典型的用法如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>f, _ := Open(...)</span></span>
<span class="line"><span>runtime.AddCleanup(f, func(fd uintptr) { syscall.Close(fd) }, f.Fd())</span></span></code></pre></div><p>通常，ptr是一个包装底层资源的对象（例如上面典型用法中的那个包装操作系统文件描述符的File对象），arg是底层资源（例如操作系统文件描述符），而清理函数释放底层资源（例如，通过调用close系统调用）。</p><p>AddCleanup对ptr的约束很少，支持为同一个指针附加多个清理函数。不过，如果ptr可以从cleanup或arg中可达，ptr将永远不会被回收，清理函数也永远不会运行。作为一种简单的保护措施，如果arg等于ptr，AddCleanup会引发panic。清理函数的运行顺序没有指定。特别是当几个对象相互指向并且同时变得不可达时，它们的清理函数都可以运行，并且可以以任何顺序运行。即使对象形成一个循环也是如此。</p><p>cleanup(arg)调用并不总是保证运行，特别是它不保证在程序退出之前能运行。清理函数可能在对象变得不可达时立即运行。为了正确使用清理函数，程序必须确保对象在清理函数安全运行之前保持可达。存储在全局变量中的对象，或者可以通过从全局变量跟踪指针找到的对象，是可达的。函数参数或方法接收者可能在函数最后一次提到它的地方变得不可达。为了确保清理函数不会过早调用，我们可以将对象传递给KeepAlive函数，以保证对象在保持可达的最后一个点之后依然可达。</p><p>到这里，也许一些读者想到了RAII（Resource Acquisition Is Initialization），RAII的核心思想是将资源的获取和释放与对象的生命周期绑定在一起，从而确保资源在对象不再使用时能够被正确释放。似乎AddCleanup可以用于实现Go版本的RAII，下面是一个示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-evolution/stdlib/addcleanup/main.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;runtime&quot;</span></span>
<span class="line"><span>    &quot;syscall&quot;</span></span>
<span class="line"><span>    &quot;time&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type FileResource struct {</span></span>
<span class="line"><span>    file *os.File</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewFileResource(filename string) (*FileResource, error) {</span></span>
<span class="line"><span>    file, err := os.Open(filename)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        return nil, err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 使用 AddCleanup 注册清理函数</span></span>
<span class="line"><span>    fd := file.Fd()</span></span>
<span class="line"><span>    runtime.AddCleanup(file, func(fd uintptr) {</span></span>
<span class="line"><span>        fmt.Println(&quot;Closing file descriptor:&quot;, fd)</span></span>
<span class="line"><span>        syscall.Close(int(fd))</span></span>
<span class="line"><span>    }, fd)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &amp;FileResource{file: file}, nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    fileResource, err := NewFileResource(&quot;example.txt&quot;)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Println(&quot;Error opening file:&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 模拟使用 fileResource</span></span>
<span class="line"><span>    _ = fileResource</span></span>
<span class="line"><span>    fmt.Println(&quot;File opened successfully&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 当 fileResource 不再被引用时，AddCleanup 会自动关闭文件</span></span>
<span class="line"><span>    fileResource = nil</span></span>
<span class="line"><span>    runtime.GC() // 强制触发 GC，以便清理 fileResource</span></span>
<span class="line"><span>    time.Sleep(time.Second * 5)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行上述代码得到如下结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$gotip run main.go</span></span>
<span class="line"><span>File opened successfully</span></span>
<span class="line"><span>Closing file descriptor: 3</span></span></code></pre></div><p>的确，在Go中，runtime.AddCleanup可以用来模拟RAII机制。但与传统的RAII有一些不同，在Go中，资源获取通常是通过显式的函数调用来完成的，例如打开文件等，而不是像C++那样在构造函数中隐式完成。并且，资源的释放由Go GC回收对象时触发。如果要实现C++那样的RAII，需要我们自行做一些封装。</p><h3 id="不易出错的新benchmark函数" tabindex="-1">不易出错的新Benchmark函数 <a class="header-anchor" href="#不易出错的新benchmark函数" aria-label="Permalink to &quot;不易出错的新Benchmark函数&quot;">​</a></h3><p>在Go语言中，基准测试（Benchmarking）是通过testing.B类型的b.N来实现的。b.N表示基准测试需要执行的迭代次数。然而，这种设计存在一些问题：</p><ul><li><p>容易忘记使用b.N：在某些情况下，开发者可能会忘记使用b.N，导致基准测试无法正确执行。</p></li><li><p>误用b.N：开发者可能会错误地将b.N用于其他目的，例如调整算法输入的大小，而不是作为迭代次数。</p></li><li><p>复杂的计时器管理：基准测试框架无法知道b.N循环何时开始，因此如果基准测试有复杂的设置（setup），开发者需要手动调用ResetTimer来重置计时器，这提高了开发人员使用benchmark函数的门槛，还非常容易出错。</p></li></ul><p>为了解决上述问题，Austin Clements提议在testing.B中添加一个新的方法Loop，并鼓励开发者使用Loop而不是b.N：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (b *B) Loop() bool</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Benchmark(b *testing.B) {</span></span>
<span class="line"><span>    ...(setup)</span></span>
<span class="line"><span>    for b.Loop() {</span></span>
<span class="line"><span>        // … benchmark body …</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...(cleanup)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>显然新Loop方法以及基于新Loopfang方法的“新Benchmark”函数有如下优点：</p><ul><li><p>避免误用b.N：Loop方法明确地用于基准测试的迭代，开发者无法将其用于其他目的。</p></li><li><p>自动计时器管理：基准测试框架可以仅记录发生在基准测试操作期间(即for循环内部)的时间和其他指标，因此开发者不再需要手动调用ResetTimer或担心setup的复杂性了。</p></li><li><p>减少重复设置：Loop方法可以在内部处理迭代启动（ramp-up），这意味着基准测试之前的setup只会执行一次，而不是在每次启动步骤中重复执行。这对于具有复杂设置的基准测试来说，可以节省大量时间。</p></li><li><p>防止编译器优化：对Go编译器来说，Loop方法本身就是一个的明显信号，可阻止某些优化（如内联），以确保基准测试结果的有效性。</p></li><li><p>支持更丰富的统计分析：将来，Loop方法可以收集值分布而不是仅仅平均值，从而提供更深入的基准测试结果分析。</p></li></ul><p>这里也 <strong>强烈建议你在Go 1.24及以后的版本中，使用基于B.Loop的新基准测试函数</strong>。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，到这里我们的Go语言演化与新特性全景回顾就全部结束了!</p><p>我们看到，从Go 1.19到Go 1.24版本，Go语言除了在语言语法方面继续秉承一贯的“保守”风格外，在编译器、运行时、工具链和标准库等多个方面都进行了显著的改进。这些改进不仅提升了Go语言的性能和易用性，也为Go语言在未来的发展奠定了坚实的基础。</p><p>Go已经走上了自己黄金十年的演进主流，随着Go语言生态的不断成熟，相信Go语言在未来会变得更加强大。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>建议你亲自动手实践一下这两节讲的Go新特性，体验这些变化带来的好处。如果有关于这些新特性的想法，欢迎在留言区与我一起分享和交流。</p><p>我是Tony Bai，我们下一节见。</p>`,206)])])}const h=s(l,[["render",o]]);export{u as __pageData,h as default};
