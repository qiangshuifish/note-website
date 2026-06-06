import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"Go语言几个鲜为人知的细节","description":"","frontmatter":{},"headers":[{"level":2,"title":"导出标识符：不仅仅是首字母大写那么简单","slug":"导出标识符-不仅仅是首字母大写那么简单","link":"#导出标识符-不仅仅是首字母大写那么简单","children":[{"level":3,"title":"导出标识符的定义","slug":"导出标识符的定义","link":"#导出标识符的定义","children":[]},{"level":3,"title":"访问非导出类型的导出字段和方法","slug":"访问非导出类型的导出字段和方法","link":"#访问非导出类型的导出字段和方法","children":[]},{"level":3,"title":"非导出类型实现接口","slug":"非导出类型实现接口","link":"#非导出类型实现接口","children":[]},{"level":3,"title":"嵌入字段中的非导出类型","slug":"嵌入字段中的非导出类型","link":"#嵌入字段中的非导出类型","children":[]},{"level":3,"title":"泛型与非导出类型","slug":"泛型与非导出类型","link":"#泛型与非导出类型","children":[]}]},{"level":2,"title":"gcflags和ldflags：编译和链接的秘密武器","slug":"gcflags和ldflags-编译和链接的秘密武器","link":"#gcflags和ldflags-编译和链接的秘密武器","children":[]},{"level":2,"title":"包文件选择的规则","slug":"包文件选择的规则","link":"#包文件选择的规则","children":[{"level":3,"title":"表象","slug":"表象","link":"#表象","children":[]},{"level":3,"title":"文件选择机制","slug":"文件选择机制","link":"#文件选择机制","children":[]},{"level":3,"title":"示例分析","slug":"示例分析","link":"#示例分析","children":[]}]},{"level":2,"title":"默认的链接方式：静态还是动态？","slug":"默认的链接方式-静态还是动态","link":"#默认的链接方式-静态还是动态","children":[{"level":3,"title":"默认的静态链接","slug":"默认的静态链接","link":"#默认的静态链接","children":[]},{"level":3,"title":"一些例外","slug":"一些例外","link":"#一些例外","children":[]},{"level":3,"title":"控制链接方式","slug":"控制链接方式","link":"#控制链接方式","children":[]}]},{"level":2,"title":"未使用的符号会包含在最终的可执行文件中吗？","slug":"未使用的符号会包含在最终的可执行文件中吗","link":"#未使用的符号会包含在最终的可执行文件中吗","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/Go语言几个鲜为人知的细节.md","filePath":"TonyBai·Go语言第一课/Go语言几个鲜为人知的细节.md","lastUpdated":1779817248000}'),l={name:"TonyBai·Go语言第一课/Go语言几个鲜为人知的细节.md"};function i(t,s,o,c,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="go语言几个鲜为人知的细节" tabindex="-1">Go语言几个鲜为人知的细节 <a class="header-anchor" href="#go语言几个鲜为人知的细节" aria-label="Permalink to &quot;Go语言几个鲜为人知的细节&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>今天我要带你进行一次深度探险，探索Go语言中那些鲜为人知却至关重要的细节。不了解这些细节不会影响你的日常编码，但在构建和优化Go程序时，如果遇到一些令人费解的现象，这些细节就很可能有了用武之地。</p><p>在本次探索中，我们将聚焦于导出标识符的微妙之处、gcflags和ldflags的神秘力量、包文件选择的智慧、默认链接方式的探索，以及那些未使用的符号的命运。这五个关键方面，每个都足以写成一篇长文，但今天，我将它们巧妙地编织在一起，带你进行一次全面的探索之旅。</p><p>我们先来看看导出标识符，它可不仅仅是首字母大写那么简单!</p><h2 id="导出标识符-不仅仅是首字母大写那么简单" tabindex="-1">导出标识符：不仅仅是首字母大写那么简单 <a class="header-anchor" href="#导出标识符-不仅仅是首字母大写那么简单" aria-label="Permalink to &quot;导出标识符：不仅仅是首字母大写那么简单&quot;">​</a></h2><p>在Go语言中，导出标识符通常被简单理解为以大写字母开头的标识符。但实际上，这个概念背后隐藏着更多有趣的细节。我们先来重温一下导出标识符的定义。</p><h3 id="导出标识符的定义" tabindex="-1">导出标识符的定义 <a class="header-anchor" href="#导出标识符的定义" aria-label="Permalink to &quot;导出标识符的定义&quot;">​</a></h3><p>Go语言规范明确指出，一个标识符要成为导出标识符，必须满足两个条件：一是标识符名称的首字母为Unicode大写字母；二是该标识符必须在包块中声明，或者是字段名或方法名。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/842942/1d4d5811b4de85db8dd295a1d559fb6f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/842942/1d4d5811b4de85db8dd295a1d559fb6f.png" alt="图片"></a></p><blockquote><p>注：上图中Unicode字符类别Lu（Uppercase Letter）包含所有的大写字母。这一类别不仅包括英文大写字母，还涵盖多种语言的大写字符，例如希腊字母、阿拉伯字母、希伯来字母和西里尔字母等。然而，我非常 <strong>不建议你使用非英文大写字母来表示导出标识符</strong>，因为这可能会挑战我们的认知习惯。</p></blockquote><p>这个定义的第一点很容易理解。例如，一个名为MyFunction的函数或MyType的类型就是导出标识符。但第二点往往容易被忽视，一个类型的字段名和方法名可以是导出的，但 <strong>并不要求其关联的类型本身也必须是导出的</strong>。这为我们提供了进一步探索Go导出标识符细节的机会。接下来，我们就用具体示例看看是否可以在包外访问非导出类型的导出字段以及导出方法。</p><h3 id="访问非导出类型的导出字段和方法" tabindex="-1">访问非导出类型的导出字段和方法 <a class="header-anchor" href="#访问非导出类型的导出字段和方法" aria-label="Permalink to &quot;访问非导出类型的导出字段和方法&quot;">​</a></h3><p>即使一个类型本身是非导出的（即以小写字母开头），其内部的导出字段和方法依然可以在外部包中被访问。</p><p>我们来看一个例子，假设现在有一个非导出类型myStruct，它有一个导出字段Field：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/field/mypackage/mypackage.go</span></span>
<span class="line"><span>package mypackage</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type myStruct struct {</span></span>
<span class="line"><span>    Field string // 导出的字段</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewMyStruct(value string) *myStruct {</span></span>
<span class="line"><span>    return &amp;myStruct{Field: value}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *myStruct) M1() {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在另一个包中，我们可以通过NewMyStruct函数获取非导出类型myStruct的实例，并访问其导出字段Field和导出方法M1：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/field/main.go</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;demo/mypackage&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    ms := mypackage.NewMyStruct(&quot;Hello&quot;)</span></span>
<span class="line"><span>    fmt.Println(ms.Field) // 可以访问 Field</span></span>
<span class="line"><span>    ms.M1() // 可以调用 M1</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这种机制为库的开发者提供了更大的灵活性，可以让他们暴露类型的某些部分，隐藏其他部分，从而更好地控制API的使用。</p><h3 id="非导出类型实现接口" tabindex="-1">非导出类型实现接口 <a class="header-anchor" href="#非导出类型实现接口" aria-label="Permalink to &quot;非导出类型实现接口&quot;">​</a></h3><p>更有趣的是，非导出类型可以实现外部包中定义的接口。这意味着，即使类型本身对外部不可见，但仍然可以遵循并实现外部定义的行为契约。下面是一个示例，我们来看一下。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/interface/mypackage/mypackage.go</span></span>
<span class="line"><span>package mypackage</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type myStruct struct {</span></span>
<span class="line"><span>    Field string // 导出的字段</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// NewMyStruct1是一个导出的函数，返回myStruct的指针</span></span>
<span class="line"><span>func NewMyStruct1(value string) *myStruct {</span></span>
<span class="line"><span>    return &amp;myStruct{Field: value}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// NewMyStruct1是一个导出的函数，返回myStruct类型变量</span></span>
<span class="line"><span>func NewMyStruct2(value string) myStruct {</span></span>
<span class="line"><span>    return myStruct{Field: value}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *myStruct) M1() {</span></span>
<span class="line"><span>    fmt.Println(&quot;invoke *myStruct&#39;s M1&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m myStruct) M2() {</span></span>
<span class="line"><span>    fmt.Println(&quot;invoke myStruct&#39;s M2&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// go-details/unexported-identifiers/interface/main.go</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;demo/mypackage&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个导出的接口</span></span>
<span class="line"><span>type MyInterface interface {</span></span>
<span class="line"><span>    M1()</span></span>
<span class="line"><span>    M2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var mi MyInterface</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 通过导出的函数获取myStruct的指针</span></span>
<span class="line"><span>    ms1 := mypackage.NewMyStruct1(&quot;Hello1&quot;)</span></span>
<span class="line"><span>    mi = ms1</span></span>
<span class="line"><span>    mi.M1()</span></span>
<span class="line"><span>    mi.M2()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 通过导出的函数获取myStruct类型变量</span></span>
<span class="line"><span>    //ms2 := mypackage.NewMyStruct2(&quot;Hello2&quot;)</span></span>
<span class="line"><span>    //mi = ms2</span><span> // compile error: mypackage.myStruct does not implement MyInterface</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个示例的main.go中，我们定义了一个接口MyInterface，它的方法集合中有两个方法：M1和M2。根据类型方法集合的判定规则，*myStruct类型实现了MyInterface的所有方法，而myStruct类型则不满足，没有实现M1方法。我们在interface目录下编译运行这个示例，看看是否与预期一致：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run main.go</span></span>
<span class="line"><span>invoke *myStruct&#39;s M1</span></span>
<span class="line"><span>invoke myStruct&#39;s M2</span></span></code></pre></div><p>如果我们去掉上面代码中对ms2的注释，将得到Compiler error: mypackage.myStruct does not implement MyInterface。</p><blockquote><p>注：关于一个类型的方法集合的判定规则，可以参考专栏 <a href="https://time.geekbang.org/column/article/466221" target="_blank" rel="noreferrer">第</a> <a href="https://time.geekbang.org/column/article/466221" target="_blank" rel="noreferrer">25讲</a>。</p></blockquote><p>接下来，我们再来考虑一个场景，即非导出类型用作嵌入字段的情况，看看该类型的导出方法和导出字段是否会promote到外部类型中。</p><h3 id="嵌入字段中的非导出类型" tabindex="-1">嵌入字段中的非导出类型 <a class="header-anchor" href="#嵌入字段中的非导出类型" aria-label="Permalink to &quot;嵌入字段中的非导出类型&quot;">​</a></h3><p>我们改造一下示例，新版的带有嵌入字段的结构见下面mypackage包代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/embeded_field/mypackage/mypackage.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package mypackage</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type nonExported struct {</span></span>
<span class="line"><span>    Field string // 导出的字段</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Exported 是导出的结构体，嵌入了nonExported</span></span>
<span class="line"><span>type Exported struct {</span></span>
<span class="line"><span>    nonExported // 嵌入非导出结构体</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewExported(value string) *Exported {</span></span>
<span class="line"><span>    return &amp;Exported{</span></span>
<span class="line"><span>        nonExported: nonExported{</span></span>
<span class="line"><span>            Field: value,</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// M1是导出的函数</span></span>
<span class="line"><span>func (n *nonExported) M1() {</span></span>
<span class="line"><span>    fmt.Println(&quot;invoke nonExported&#39;s M1&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// M2是导出的函数</span></span>
<span class="line"><span>func (e *Exported) M2() {</span></span>
<span class="line"><span>    fmt.Println(&quot;invoke Exported&#39;s M2&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里新增一个导出类型Exported，它嵌入了一个非导出类型nonExported，后者拥有导出字段Field，以及两个导出方法M1。我们也给Exported类型定义了一个方法M2。</p><p>下面，我们再来看看main.go中是如何使用Exported的。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/embeded_field/main.go</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;demo/mypackage&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个导出的接口</span></span>
<span class="line"><span>type MyInterface interface {</span></span>
<span class="line"><span>    M1()</span></span>
<span class="line"><span>    M2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    ms := mypackage.NewExported(&quot;Hello&quot;)</span></span>
<span class="line"><span>    fmt.Println(ms.Field) // 访问嵌入的非导出结构体的导出字段</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ms.M1() // 访问嵌入的非导出结构体的导出方法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var mi MyInterface = ms</span></span>
<span class="line"><span>    mi.M1()</span></span>
<span class="line"><span>    mi.M2()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在embedded_field目录下编译运行这个示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run main.go</span></span>
<span class="line"><span>Hello</span></span>
<span class="line"><span>invoke nonExported&#39;s M1</span></span>
<span class="line"><span>invoke nonExported&#39;s M1</span></span>
<span class="line"><span>invoke Exported&#39;s M2</span></span></code></pre></div><p>我们看到，作为嵌入字段的非导出类型的导出字段与方法会被自动promote到外部类型中，通过外部类型的变量可以直接访问这些字段，调用这些导出方法。这些方法还可以作为外部类型方法集中的一员，来满足特定接口类型（如上面代码中的MyInterface）的条件。</p><p>在Go 1.18引入泛型之后，非导出类型也可以用作泛型函数和泛型类型的类型实参，这进一步扩展了非导出类型的应用范围。接下来，我们就一起看看非导出类型在泛型中的应用。</p><h3 id="泛型与非导出类型" tabindex="-1">泛型与非导出类型 <a class="header-anchor" href="#泛型与非导出类型" aria-label="Permalink to &quot;泛型与非导出类型&quot;">​</a></h3><p>和前面一样，我们先定义用于该示例的带有导出字段和导出方法的非导出类型，代码如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/generics/mypackage/mypackage.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package mypackage</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个非导出的结构体</span></span>
<span class="line"><span>type nonExported struct {</span></span>
<span class="line"><span>    Field string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 导出的方法</span></span>
<span class="line"><span>func (n *nonExported) M1() {</span></span>
<span class="line"><span>    fmt.Println(&quot;invoke nonExported&#39;s M1&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (n *nonExported) M2() {</span></span>
<span class="line"><span>    fmt.Println(&quot;invoke nonExported&#39;s M2&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 导出的函数，用于创建非导出类型的实例</span></span>
<span class="line"><span>func NewNonExported(value string) *nonExported {</span></span>
<span class="line"><span>    return &amp;nonExported{Field: value}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在，我们要将其用于泛型函数。下面定义了泛型函数UseNonExportedAsTypeArgument，它的类型参数使用MyInterface作为约束，而上面的nonExported显然满足该约束，我们通过构造函数NewNonExported获得非导出类型的实例，然后将其传递给UseNonExportedAsTypeArgument，Go会通过泛型的类型参数自动推导机制推断出类型实参的类型，代码如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/unexported-identifiers/generics/main.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;demo/mypackage&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个用作约束的接口</span></span>
<span class="line"><span>type MyInterface interface {</span></span>
<span class="line"><span>    M1()</span></span>
<span class="line"><span>    M2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func UseNonExportedAsTypeArgument[T MyInterface](item T) {</span></span>
<span class="line"><span>    item.M1()</span></span>
<span class="line"><span>    item.M2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个带有泛型参数的新类型</span></span>
<span class="line"><span>type GenericType[T MyInterface] struct {</span></span>
<span class="line"><span>    Item T</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewGenericType[T MyInterface](item T) GenericType[T] {</span></span>
<span class="line"><span>    return GenericType[T]{Item: item}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 创建非导出类型的实例</span></span>
<span class="line"><span>    n := mypackage.NewNonExported(&quot;Hello&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 调用泛型函数，传入实现了MyInterface的非导出类型</span></span>
<span class="line"><span>    UseNonExportedAsTypeArgument(n) // ok</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // g := GenericType{Item: n}</span><span> // compiler error: cannot use generic type GenericType[T MyInterface] without instantiation</span></span>
<span class="line"><span>    g := NewGenericType(n)</span></span>
<span class="line"><span>    g.Item.M1()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但目前Go泛型还不支持对泛型类型的类型参数的自动推导，所以直接通过g := GenericType{Item: n} 来初始化一个泛型类型变量将导致编译错误！我们需要借助泛型函数的推导机制将非导出类型与泛型类型结合，参考上面示例中的NewGenericType函数，通过泛型函数支持的类型参数的自动推导，间接获得GenericType的类型实参。在generics目录下编译运行这个示例，便可得到我们预期的结果，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go run main.go</span></span>
<span class="line"><span>invoke nonExported&#39;s M1</span></span>
<span class="line"><span>invoke nonExported&#39;s M2</span></span>
<span class="line"><span>invoke nonExported&#39;s M1</span></span></code></pre></div><p>通过探讨这些细节，我们可以看到，Go语言的导出机制远比表面上看到的要复杂和精妙。它不仅仅是一种可见性控制手段，更是一种强大的设计工具，允许开发者构建出灵活且易于维护的代码结构。</p><h2 id="gcflags和ldflags-编译和链接的秘密武器" tabindex="-1">gcflags和ldflags：编译和链接的秘密武器 <a class="header-anchor" href="#gcflags和ldflags-编译和链接的秘密武器" aria-label="Permalink to &quot;gcflags和ldflags：编译和链接的秘密武器&quot;">​</a></h2><p>在Go语言的构建过程中，gcflags和ldflags是两个强大的工具。它们允许开发者向Go编译器和链接器传递额外的参数，从而精细地控制构建过程。不过，Go build文档中关于gcflags和ldflags的说明很短小精悍，如下所示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go help build</span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span>    -gcflags &#39;[pattern=]arg list&#39;</span></span>
<span class="line"><span>        arguments to pass on each go tool compile invocation.</span></span>
<span class="line"><span>    -ldflags &#39;[pattern=]arg list&#39;</span></span>
<span class="line"><span>        arguments to pass on each go tool link invocation.</span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>The -asmflags, -gccgoflags, -gcflags, and -ldflags flags accept a space-separated list of arguments to pass to an underlying tool during the build. To embed spaces in an element in the list, surround it with either single or double quotes. The argument list may be preceded by a package pattern and an equal sign, which restricts the use of that argument list to the building of packages matching that pattern (see &#39;go help packages&#39; for a description of package patterns). Without a pattern, the argument list applies only to the packages named on the command line. The flags may be repeated with different patterns in order to specify different arguments for different sets of packages. If a package matches patterns given in multiple flags, the latest match on the command line wins. For example, &#39;go build -gcflags=-S fmt&#39; prints the disassembly only for package fmt, while &#39;go build -gcflags=all=-S fmt&#39; prints the disassembly for fmt and all its dependencies.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>... ...</span></span></code></pre></div><p>以gcflags为例，多数Go初学者初次看到关于gcflags的说明，都无法知道到底有哪些arg可用，以及究竟如何使用gcflags，而 <a href="https://pkg.go.dev/cmd/go" target="_blank" rel="noreferrer">Go cmd文档</a> 中关于gcflags的内容也仅限于上述这些。</p><p>基于此，我将经常遇到的主要问题总结为下面两条：</p><ul><li><p>gcflags的完整参数选项列表在哪里可以找到？</p></li><li><p>gcflags的使用模式，尤其是go help build输出的内容中的package pattern该如何正确使用？</p></li></ul><p>我们先来看看如何 <strong>查找gcflags可用的全部参数选项。</strong> go help build不行， <a href="https://pkg.go.dev/cmd/go" target="_blank" rel="noreferrer">go command的Web文档</a> 中没有！甚至 <a href="https://pkg.go.dev/cmd/compile" target="_blank" rel="noreferrer">Go tool compile的Web文档</a> 中列举的gcflag的参数列表也是不全的（或者说文档没有及时同步最新的参数列表变化）。其实，答案远在天边，近在眼前！如下命令就可以让gcflag可用的参数选项完整列表尽收眼底：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go tool compile -h</span></span>
<span class="line"><span>usage: compile [options] file.go...</span></span>
<span class="line"><span>  -%    debug non-static initializers</span></span>
<span class="line"><span>  -+    compiling runtime</span></span>
<span class="line"><span>  -B    disable bounds checking</span></span>
<span class="line"><span>  -C    disable printing of columns in error messages</span></span>
<span class="line"><span>  -D path</span></span>
<span class="line"><span>        set relative path for local imports</span></span>
<span class="line"><span>  -E    debug symbol export</span></span>
<span class="line"><span>  -I directory</span></span>
<span class="line"><span>        add directory to import search path</span></span>
<span class="line"><span>  -K    debug missing line numbers</span></span>
<span class="line"><span>  -L    also show actual source file names in error messages for positions affected by //line directives</span></span>
<span class="line"><span>  -N    disable optimizations</span></span>
<span class="line"><span>  -S    print assembly listing</span></span>
<span class="line"><span>  -V    print version and exit</span></span>
<span class="line"><span>  -W    debug parse tree after type checking</span></span>
<span class="line"><span>  -asan</span></span>
<span class="line"><span>        build code compatible with C/C++ address sanitizer</span></span>
<span class="line"><span>  -asmhdr file</span></span>
<span class="line"><span>        write assembly header to file</span></span>
<span class="line"><span>... ...</span></span></code></pre></div><blockquote><p>注：如果你要查看ldflags的完整参数选项列表，你可以使用go tool link -h。</p></blockquote><p>接下来，我们再来看第二个问题： <strong>-gcflags的使用模式</strong>。根据go help build的输出，我们知道-gcflags的使用形式如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-gcflags &#39;[pattern=]arg list&#39;</span></span></code></pre></div><p>其中：</p><ul><li><p>[pattern=]（可选）：包模式（package pattern），用于作用范围控制，即限定参数仅应用于特定的包。如果省略此部分，则参数仅适用于命令行中指定的包。</p></li><li><p>arg list：参数选项列表，多个参数以空格分隔。</p></li></ul><p>想要使用好gcflags，并不一样要深入理解包模式。但在一些复杂项目中，我们可能会通过包模式精确控制调试和优化，那在这种情况下，对包模式有深入理解还是大有裨益的。</p><p>包模式是一种通过匹配规则指定目标包的方式，常见的包模式有以下几种：</p><ul><li><p>./…：匹配当前目录及其所有子目录中的包。</p></li><li><p>/DIR/…：匹配/DIR及其子目录中的包。</p></li><li><p>cmd/…：匹配Go仓库中cmd目录下的所有命令包。</p></li><li><p>github.com/user/repo/…：匹配该GitHub仓库中的所有包。</p></li><li><p>all：GOPATH模式下，匹配的是所有GOPATH路径中的包，Go module模式下，all匹配主模块及其所有依赖的包（包括测试依赖）。</p></li><li><p>std：仅匹配标准库包。</p></li><li><p>cmd：匹配Go仓库中的Go命令及其内部包(internal)。</p></li></ul><p>基于上述关于gcflags使用形式以及包模式的说明，我们通过几个示例来直观理解一下gcflags的用法。</p><ul><li>对单个包设置参数：参数-S仅作用于fmt包，显示其反汇编代码。</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -gcflags=-S fmt</span></span></code></pre></div><ul><li>对特定模式（比如all/std等）的包设置参数：在Go module模式下，参数-N和-l应用于当前主模块所有包及其依赖，禁用优化和内联。</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -gcflags=&#39;all=-N -l&#39;</span></span></code></pre></div><ul><li>对不同包模式设置不同参数：Go build命令行中可以 <strong>多次使用-gcflags</strong>，如下命令中的第一个gcflags对fmt包启用反汇编输出（-S），第二个gcflags对net/http包禁用优化（-N）。</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -gcflags=&#39;fmt=-S&#39; -gcflags=&#39;net/http=-N&#39;</span></span></code></pre></div><ul><li>模式的优先级：如下命令中，两个gcflags都匹配了fmt包，或者说两个gcflags的作用范围都包含了fmt包，这种情况下哪些参数会对fmt包生效呢？Go规定：当一个包匹配多个模式时，以最后一个匹配的参数为准。所以在这个例子中，fmt包将只应用-S参数，而其他包应用-N参数。</li></ul><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -gcflags=&#39;all=-N&#39; -gcflags=&#39;fmt=-S&#39;</span></span></code></pre></div><p>到这里，你应该能掌握查看gcflags完整参数列表的方法，以及gcflags的使用模式了。有了对这些细节的把握，你在后续构建和调试Go项目时能更加得心应手。</p><h2 id="包文件选择的规则" tabindex="-1">包文件选择的规则 <a class="header-anchor" href="#包文件选择的规则" aria-label="Permalink to &quot;包文件选择的规则&quot;">​</a></h2><p>了解了编译器和链接器的参数使用后，我们再来看看Go编译的基本单元：包。在Go语言中，一个包通常由一个目录下的多个 .go文件组成。但是，并非所有的文件都会被编译到最终的包中。Go编译器会根据一套规则来选择需要编译的文件，那这套规则是怎样的呢？下面我们就来学习一下包文件选择的细节。</p><h3 id="表象" tabindex="-1">表象 <a class="header-anchor" href="#表象" aria-label="Permalink to &quot;表象&quot;">​</a></h3><p>在Go工程中，通常一个目录对应一个Go包，每个Go包下可以存在多个以 .go为后缀的Go源文件，这些源文件只能具有唯一的包名（测试源文件除外）。以标准库fmt包为例，它的目录下的源文件列表如下（以Go 1.23.0源码为例）：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ls $GOROOT/src/fmt</span></span>
<span class="line"><span>doc.go                export_test.go          print.go            stringer_example_test.go</span></span>
<span class="line"><span>errors.go            fmt_test.go         scan.go             stringer_test.go</span></span>
<span class="line"><span>errors_test.go            format.go           scan_test.go</span></span>
<span class="line"><span>example_test.go            gostringer_example_test.go  state_test.go</span></span></code></pre></div><p>在这些文件中，哪些最终进入到了fmt包的目标文件（fmt.a）中呢？ <strong>贴心的Go工具链</strong> 为我们提供了如下的查看方法：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go list -f &#39;{​{.GoFiles}​}&#39; fmt</span></span>
<span class="line"><span>[doc.go errors.go format.go print.go scan.go]</span></span></code></pre></div><p>对于独立于目标ARCH和OS的fmt包来说，其Go源文件的选择似乎要简单一些。我们看到，除了包测试文件（xxx_test.go），其他文件都被编译到了最终的fmt包中。</p><p>我们再来看一个与目标ARCH和OS相关性较高的net包。除去子目录，这个包目录下的Go源文件数量大约有220多个，但在 <strong>macOS/amd64</strong> 下通过go list查看最终进入net包目标文件的文件，大约只有几十个：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go list -f &#39;{​{.GoFiles}​}&#39; net</span></span>
<span class="line"><span>[addrselect.go cgo_darwin.go cgo_unix.go cgo_unix_syscall.go conf.go dial.go dnsclient.go dnsclient_unix.go dnsconfig.go dnsconfig_unix.go error_posix.go error_unix.go fd_posix.go fd_unix.go file.go file_unix.go hook.go hook_unix.go hosts.go interface.go interface_bsd.go interface_darwin.go ip.go iprawsock.go iprawsock_posix.go ipsock.go ipsock_posix.go lookup.go lookup_unix.go mac.go mptcpsock_stub.go net.go netcgo_off.go netgo_off.go nss.go parse.go pipe.go port.go port_unix.go rawconn.go rlimit_unix.go sendfile_unix_alt.go sock_bsd.go sock_posix.go sockaddr_posix.go sockopt_bsd.go sockopt_posix.go sockoptip_bsdvar.go sockoptip_posix.go splice_stub.go sys_cloexec.go tcpsock.go tcpsock_posix.go tcpsock_unix.go tcpsockopt_darwin.go tcpsockopt_posix.go udpsock.go udpsock_posix.go unixsock.go unixsock_posix.go unixsock_readmsg_cloexec.go writev_unix.go]</span></span></code></pre></div><p>接下来，我们跳出Go标准库，来看一个自定义的示例：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$tree -F buildconstraints/demo1</span></span>
<span class="line"><span>buildconstraints/demo1</span></span>
<span class="line"><span>├── foo/</span></span>
<span class="line"><span>│   ├── f1_android.go</span></span>
<span class="line"><span>│   ├── f2_linux.go</span></span>
<span class="line"><span>│   └── f3_darwin.go</span></span>
<span class="line"><span>└── go.mod</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// go-details/buildconstraints/demo1/foo/f1_android.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//go:build linux</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package foo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func F1() {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// go-details/buildconstraints/demo1/foo/f2_linux.go</span></span>
<span class="line"><span>//go:build android</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package foo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func F2() {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// go-details/buildconstraints/demo1/foo/f3_darwin.go</span></span>
<span class="line"><span>//go:build android</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package foo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func F3() {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在GOOS=android下构建buildconstraints/demo1/foo这个包，哪些文件会被选出来呢？我们先看下面的输出结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$GOOS=android go list -f &#39;{​{.GoFiles}​}&#39; github.com/bigwhite/demo1/foo</span></span>
<span class="line"><span>[f1_android.go f2_linux.go]</span></span></code></pre></div><p>如果说前两个示例还好理解，那这第三个示例很可能会让很多开发者有些“发懵”。别急，上面三个示例都是表象。接下来，我们仔细探索一下Go构建时的文件选择机制。</p><h3 id="文件选择机制" tabindex="-1">文件选择机制 <a class="header-anchor" href="#文件选择机制" aria-label="Permalink to &quot;文件选择机制&quot;">​</a></h3><p>Go包构建时选择源文件的机制还是蛮繁琐的，我们需要从源码入手梳理出主要逻辑。在Go 1.23版本中，Go包构建过程源文件选择逻辑的代码位于 $GOROOT/src/go/build/build.go 中。这个源文件有2k多行，不过不用担心，我替你把主要调用逻辑梳理出来了，如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/842942/227f6b5c7eeb5966c82b4467975fc48d.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/842942/227f6b5c7eeb5966c82b4467975fc48d.jpg" alt=""></a></p><p>函数Import调用Default.Import去获取包的详细信息，信息用build.Package结构表示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/go/build/build.go</span></span>
<span class="line"><span>// A Package describes the Go package found in a directory.</span></span>
<span class="line"><span>  type Package struct {</span></span>
<span class="line"><span>      Dir           string   // directory containing package sources</span></span>
<span class="line"><span>      Name          string   // package name</span></span>
<span class="line"><span>      ImportComment string   // path in import comment on package statement</span></span>
<span class="line"><span>      Doc           string   // documentation synopsis</span></span>
<span class="line"><span>      ImportPath    string   // import path of package (&quot;&quot; if unknown)</span></span>
<span class="line"><span>      Root          string   // root of Go tree where this package lives</span></span>
<span class="line"><span>      SrcRoot       string   // package source root directory (&quot;&quot; if unknown)</span></span>
<span class="line"><span>      PkgRoot       string   // package install root directory (&quot;&quot; if unknown)</span></span>
<span class="line"><span>      PkgTargetRoot string   // architecture dependent install root directory (&quot;&quot; if unknown)</span></span>
<span class="line"><span>      BinDir        string   // command install directory (&quot;&quot; if unknown)</span></span>
<span class="line"><span>      Goroot        bool     // package found in Go root</span></span>
<span class="line"><span>      PkgObj        string   // installed .a file</span></span>
<span class="line"><span>      AllTags       []string // tags that can influence file selection in this directory</span></span>
<span class="line"><span>      ConflictDir   string   // this directory shadows Dir in $GOPATH</span></span>
<span class="line"><span>      BinaryOnly    bool     // cannot be rebuilt from source (has //go:binary-only-package comment)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Source files</span></span>
<span class="line"><span>      GoFiles           []string // .go source files (excluding CgoFiles, TestGoFiles, XTestGoFiles)</span></span>
<span class="line"><span>      ... ...</span></span></code></pre></div><p>其中的GoFiles就是参与Go包编译的源文件列表。Default是默认的上下文信息，包括构建所需的默认goenv中几个环境变量，比如GOARCH、GOOS等的值：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Default is the default Context for builds.</span></span>
<span class="line"><span>// It uses the GOARCH, GOOS, GOROOT, and GOPATH environment variables</span></span>
<span class="line"><span>// if set, or else the compiled code&#39;s GOARCH, GOOS, and GOROOT.</span></span>
<span class="line"><span>var Default Context = defaultContext()</span></span></code></pre></div><p>Context的Import方法代码行数很多，对于要了解文件选择细节的我们来说，最重要的调用是Context的matchFile方法。matchFile正是那个 <strong>用于确定某个Go源文件是否应该被选入最终包文件中的方法</strong>。</p><p>它内部的逻辑可以分为两个主要步骤。第一步是 <strong>调用Context的goodOSArchFile方法对Go源文件的名字进行判定</strong>，goodOSArchFile方法的判定也有两个子步骤。</p><p>首先是判断名字中的OS和ARCH是否在Go支持的OS和ARCH列表中。当前Go支持的OS和ARCH在syslist.go文件中有如下定义：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/go/build/syslist.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// knownArch is the list of past, present, and future known GOARCH values.</span></span>
<span class="line"><span>// Do not remove from this list, as it is used for filename matching.</span></span>
<span class="line"><span>var knownArch = map[string]bool{</span></span>
<span class="line"><span>    &quot;386&quot;:         true,</span></span>
<span class="line"><span>    &quot;amd64&quot;:       true,</span></span>
<span class="line"><span>    &quot;amd64p32&quot;:    true,</span></span>
<span class="line"><span>    &quot;arm&quot;:         true,</span></span>
<span class="line"><span>    &quot;armbe&quot;:       true,</span></span>
<span class="line"><span>    &quot;arm64&quot;:       true,</span></span>
<span class="line"><span>    &quot;arm64be&quot;:     true,</span></span>
<span class="line"><span>    &quot;loong64&quot;:     true,</span></span>
<span class="line"><span>    &quot;mips&quot;:        true,</span></span>
<span class="line"><span>    &quot;mipsle&quot;:      true,</span></span>
<span class="line"><span>    &quot;mips64&quot;:      true,</span></span>
<span class="line"><span>    &quot;mips64le&quot;:    true,</span></span>
<span class="line"><span>    &quot;mips64p32&quot;:   true,</span></span>
<span class="line"><span>    &quot;mips64p32le&quot;: true,</span></span>
<span class="line"><span>    &quot;ppc&quot;:         true,</span></span>
<span class="line"><span>    &quot;ppc64&quot;:       true,</span></span>
<span class="line"><span>    &quot;ppc64le&quot;:     true,</span></span>
<span class="line"><span>    &quot;riscv&quot;:       true,</span></span>
<span class="line"><span>    &quot;riscv64&quot;:     true,</span></span>
<span class="line"><span>    &quot;s390&quot;:        true,</span></span>
<span class="line"><span>    &quot;s390x&quot;:       true,</span></span>
<span class="line"><span>    &quot;sparc&quot;:       true,</span></span>
<span class="line"><span>    &quot;sparc64&quot;:     true,</span></span>
<span class="line"><span>    &quot;wasm&quot;:        true,</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// knownOS is the list of past, present, and future known GOOS values.</span></span>
<span class="line"><span>// Do not remove from this list, as it is used for filename matching.</span></span>
<span class="line"><span>// If you add an entry to this list, look at unixOS, below.</span></span>
<span class="line"><span>var knownOS = map[string]bool{</span></span>
<span class="line"><span>    &quot;aix&quot;:       true,</span></span>
<span class="line"><span>    &quot;android&quot;:   true,</span></span>
<span class="line"><span>    &quot;darwin&quot;:    true,</span></span>
<span class="line"><span>    &quot;dragonfly&quot;: true,</span></span>
<span class="line"><span>    &quot;freebsd&quot;:   true,</span></span>
<span class="line"><span>    &quot;hurd&quot;:      true,</span></span>
<span class="line"><span>    &quot;illumos&quot;:   true,</span></span>
<span class="line"><span>    &quot;ios&quot;:       true,</span></span>
<span class="line"><span>    &quot;js&quot;:        true,</span></span>
<span class="line"><span>    &quot;linux&quot;:     true,</span></span>
<span class="line"><span>    &quot;nacl&quot;:      true,</span></span>
<span class="line"><span>    &quot;netbsd&quot;:    true,</span></span>
<span class="line"><span>    &quot;openbsd&quot;:   true,</span></span>
<span class="line"><span>    &quot;plan9&quot;:     true,</span></span>
<span class="line"><span>    &quot;solaris&quot;:   true,</span></span>
<span class="line"><span>    &quot;wasip1&quot;:    true,</span></span>
<span class="line"><span>    &quot;windows&quot;:   true,</span></span>
<span class="line"><span>    &quot;zos&quot;:       true,</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们也可以通过下面命令查看：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go tool dist list</span></span>
<span class="line"><span>aix/ppc64</span></span>
<span class="line"><span>android/386</span></span>
<span class="line"><span>android/amd64</span></span>
<span class="line"><span>android/arm</span></span>
<span class="line"><span>android/arm64</span></span>
<span class="line"><span>darwin/amd64</span></span>
<span class="line"><span>darwin/arm64</span></span>
<span class="line"><span>dragonfly/amd64</span></span>
<span class="line"><span>freebsd/386</span></span>
<span class="line"><span>freebsd/amd64</span></span>
<span class="line"><span>freebsd/arm</span></span>
<span class="line"><span>freebsd/arm64</span></span>
<span class="line"><span>freebsd/riscv64</span></span>
<span class="line"><span>illumos/amd64</span></span>
<span class="line"><span>ios/amd64</span></span>
<span class="line"><span>ios/arm64</span></span>
<span class="line"><span>js/wasm</span></span>
<span class="line"><span>linux/386</span></span>
<span class="line"><span>linux/amd64</span></span>
<span class="line"><span>linux/arm</span></span>
<span class="line"><span>linux/arm64</span></span>
<span class="line"><span>linux/loong64</span></span>
<span class="line"><span>linux/mips</span></span>
<span class="line"><span>linux/mips64</span></span>
<span class="line"><span>linux/mips64le</span></span>
<span class="line"><span>linux/mipsle</span></span>
<span class="line"><span>linux/ppc64</span></span>
<span class="line"><span>linux/ppc64le</span></span>
<span class="line"><span>linux/riscv64</span></span>
<span class="line"><span>linux/s390x</span></span>
<span class="line"><span>netbsd/386</span></span>
<span class="line"><span>netbsd/amd64</span></span>
<span class="line"><span>netbsd/arm</span></span>
<span class="line"><span>netbsd/arm64</span></span>
<span class="line"><span>openbsd/386</span></span>
<span class="line"><span>openbsd/amd64</span></span>
<span class="line"><span>openbsd/arm</span></span>
<span class="line"><span>openbsd/arm64</span></span>
<span class="line"><span>openbsd/ppc64</span></span>
<span class="line"><span>openbsd/riscv64</span></span>
<span class="line"><span>plan9/386</span></span>
<span class="line"><span>plan9/amd64</span></span>
<span class="line"><span>plan9/arm</span></span>
<span class="line"><span>solaris/amd64</span></span>
<span class="line"><span>wasip1/wasm</span></span>
<span class="line"><span>windows/386</span></span>
<span class="line"><span>windows/amd64</span></span>
<span class="line"><span>windows/arm</span></span>
<span class="line"><span>windows/arm64</span></span></code></pre></div><blockquote><p>注：像sock_bsd.go、sock_posix.go这样的Go源文件，虽然它们的文件名中包含posix、bsd等字样，但这些文件实际上只是普通的Go源文件。其文件名本身并不会影响Go包在构建时选择文件的结果。</p></blockquote><p>然后是调用matchTag，来判定该Go源文件名字中的OS和ARCH是否与当前上下文信息中的OS和ARCH匹配。Go支持的源文件名组成格式如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  //  name_$(GOOS).*</span></span>
<span class="line"><span>  //  name_$(GOARCH).*</span></span>
<span class="line"><span>  //  name_$(GOOS)_$(GOARCH).*</span></span>
<span class="line"><span>  //  name_$(GOOS)_test.*</span></span>
<span class="line"><span>  //  name_$(GOARCH)_test.*</span></span>
<span class="line"><span>  //  name_$(GOOS)_$(GOARCH)_test.*</span></span></code></pre></div><p>不过，如下三种情况例外：</p><ul><li><p>如果上下文中的GOOS=android，那么文件名字中OS值为linux的Go源文件也算是匹配的。</p></li><li><p>如果上下文中的GOOS=illumos，那么文件名字中OS值为solaris的Go源文件也算是匹配的。</p></li><li><p>如果上下文中的GOOS=ios，那么文件名字中OS值为darwin的Go源文件也算是匹配的。</p></li></ul><p>此外，还有一个特殊处理，那就是当文件名字中OS值为unix时，该源文件可以匹配下面上下文中GOOS的值：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/go/build/syslist.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// unixOS is the set of GOOS values matched by the &quot;unix&quot; build tag.</span></span>
<span class="line"><span>// This is not used for filename matching.</span></span>
<span class="line"><span>// This list also appears in cmd/dist/build.go and</span></span>
<span class="line"><span>// cmd/go/internal/imports/build.go.</span></span>
<span class="line"><span>var unixOS = map[string]bool{</span></span>
<span class="line"><span>    &quot;aix&quot;:       true,</span></span>
<span class="line"><span>    &quot;android&quot;:   true,</span></span>
<span class="line"><span>    &quot;darwin&quot;:    true,</span></span>
<span class="line"><span>    &quot;dragonfly&quot;: true,</span></span>
<span class="line"><span>    &quot;freebsd&quot;:   true,</span></span>
<span class="line"><span>    &quot;hurd&quot;:      true,</span></span>
<span class="line"><span>    &quot;illumos&quot;:   true,</span></span>
<span class="line"><span>    &quot;ios&quot;:       true,</span></span>
<span class="line"><span>    &quot;linux&quot;:     true,</span></span>
<span class="line"><span>    &quot;netbsd&quot;:    true,</span></span>
<span class="line"><span>    &quot;openbsd&quot;:   true,</span></span>
<span class="line"><span>    &quot;solaris&quot;:   true,</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>这里面列出的OS都是所谓的“类Unix”操作系统。</p></blockquote><p>如果goodOSArchFile方法返回文件名匹配成功，那么 <strong>第二步就是调用Context的shouldBuild方法对Go源文件中的build constraints进行判定。</strong> 这个判定过程也是调用matchTag完成的，因此规则与上面对matchTag的说明一致。如果判定match成功，那么该源文件将会被Go编译器编译到最终的Go包目标文件中去。</p><p>最后，我再结合之前“表象”中提到的那个自定义示例，详细判定一下为何最终会输出相应的结果。</p><h3 id="示例分析" tabindex="-1">示例分析 <a class="header-anchor" href="#示例分析" aria-label="Permalink to &quot;示例分析&quot;">​</a></h3><p>在go-details/buildconstraints/demo1/foo包目录中，一共有三个Go源文件：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$tree -F foo</span></span>
<span class="line"><span>foo</span></span>
<span class="line"><span>├── f1_android.go</span></span>
<span class="line"><span>├── f2_linux.go</span></span>
<span class="line"><span>└── f3_darwin.go</span></span></code></pre></div><p>注意：当前我的系统为 <strong>darwin/amd64</strong>，但我们使用了GOOS=android的环境变量。我们顺着刚才梳理出来的文件选择判定的主逻辑，逐一过一遍这三个文件。</p><p>对于f1_android.go，先用goodOSArchFile判定文件名是否匹配。当GOOS=android时，文件名中的OS为android，文件名匹配成功，然后用shouldBuild判定文件中的build constraints是否匹配。</p><p>如果该文件的约束为linux，我们在上面matchTag的三个例外规则里提到过，当GOOS=android时，如果build constraints是linux，是可以匹配的。因此，f1_android.go将出现在最终编译文件列表中。</p><p>对于f2_linux.go，先用goodOSArchFile判定文件名是否匹配。当GOOS=android时，文件名中的OS为linux，linux显然在Go支持的OS列表中，并且根据matchTag的例外规则，当GOOS=android时，文件名中的OS为linux时是可以匹配的。</p><p>然后用shouldBuild判定文件中的build constraints是否匹配。该文件的约束为android，与GOOS相同，可以匹配。因此，f2_linux.go将出现在最终编译文件列表中。</p><p>对于f3_darwin.go，先用goodOSArchFile判定文件名是否匹配。当GOOS=android时，文件名中的OS为darwin，虽然darwin在Go支持的OS列表中，但darwin与GOOS=android并不匹配。</p><p>因此在goodOSArchFile这步中，f3_darwin.go就被“淘汰”掉了！即便f3_darwin.go中的build constraints为android，f3_darwin.go也不会出现在最终编译文件列表中。</p><p>如果再增加一个如下的源文件f4_unix.go，它是否会出现在最终的包编译文件列表中呢？</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//go:build android</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func F4() {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这就作为思考题留给你了，也欢迎你在评论区留言，说说你的思考结果。</p><p>通过以上这些规则，Go语言实现了灵活而强大的文件选择机制，使得我们可以轻松地编写跨平台的代码。并且，理解这些内部机制不仅能帮助开发者优化构建过程，还能有效避免潜在的错误。</p><h2 id="默认的链接方式-静态还是动态" tabindex="-1">默认的链接方式：静态还是动态？ <a class="header-anchor" href="#默认的链接方式-静态还是动态" aria-label="Permalink to &quot;默认的链接方式：静态还是动态？&quot;">​</a></h2><p>接下来，我们再来看两个与Go构建有关的细节，先来看Go默认的链接方式！你知道在默认情况下，Go程序究竟是静态链接还是动态链接的吗？如果你还不是很确定，就和我一起继续探索吧！</p><h3 id="默认的静态链接" tabindex="-1">默认的静态链接 <a class="header-anchor" href="#默认的静态链接" aria-label="Permalink to &quot;默认的静态链接&quot;">​</a></h3><p>实际上，尽管CGO_ENABLED的默认值为1， <strong>但在大多数情况下，Go编译器会尽可能地采用静态链接</strong>。这意味着Go程序会将所有依赖的代码（包括标准库）都打包到最终的可执行文件中，而不依赖于外部的动态链接库。</p><p>例如，一个简单的“Hello, World”程序，即使在 <code>CGO_ENABLED=1</code> 的情况下，默认也是静态链接的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    fmt.Println(&quot;hello, world&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以编译并检查这个程序来验证一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go build -o helloworld</span></span>
<span class="line"><span>$ file helloworld</span></span>
<span class="line"><span>helloworld: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, not stripped</span></span></code></pre></div><p>可以看到，这个程序是静态链接的。</p><h3 id="一些例外" tabindex="-1">一些例外 <a class="header-anchor" href="#一些例外" aria-label="Permalink to &quot;一些例外&quot;">​</a></h3><p>然而，凡事总有例外。在某些情况下，Go编译器也会生成动态链接的可执行文件。接下来，我列举三种常见情况。</p><p><strong>第一种是使用了某些标准库包的C实现。</strong> 某些标准库包，如 <code>net</code> 和 <code>os/user</code>，在某些操作系统上有纯Go实现和C实现两个版本。当CGO_ENABLED=1且目标平台支持C实现时，Go编译器会优先选择C实现，这将导致动态链接。</p><p>例如，如果我们稍微修改一下前面的程序，导入os/user包：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    _ &quot;os/user&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    fmt.Println(&quot;hello, world&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再次编译并检查，就可以看到这次生成的可执行文件是动态链接的。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go build -o helloworld</span></span>
<span class="line"><span>$ file helloworld</span></span>
<span class="line"><span>helloworld: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, not stripped</span></span></code></pre></div><p><strong>第二种情况是显式使用了cgo。</strong> 如果代码中显式使用了cgo来调用外部的C代码，那么最终的可执行文件通常会是动态链接的。</p><p><strong>第三种情况是使用了依赖cgo的第三方包。</strong> 如果你的代码依赖的第三方包中使用了cgo，那么最终的可执行文件也可能是动态链接的。</p><h3 id="控制链接方式" tabindex="-1">控制链接方式 <a class="header-anchor" href="#控制链接方式" aria-label="Permalink to &quot;控制链接方式&quot;">​</a></h3><p>如果出现了上面三种例外情况，但是我们仍需要静态链接，又应该怎么做呢？我们一个一个来看！</p><p>针对第一种例外情况，即使在使用了 <code>os/user</code> 或 <code>net</code> 的情况下，我们也可以设置 <code>CGO_ENABLED=0</code> 来禁用cgo：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ CGO_ENABLED=0 go build -o helloworld</span></span>
<span class="line"><span>$ file helloworld</span></span>
<span class="line"><span>helloworld: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, not stripped</span></span></code></pre></div><p>对于显式使用了cgo的情况，如果外部C库提供了静态库（ <code>.a</code> 文件），我们也可以通过适当设置CGO_LDFLAGS来实现静态链接：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 在调用cgo的代码中使用LDFLAGS静态链接第三方的C库</span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span>#cgo LDFLAGS: -static -L my-c-lib -lmylib</span></span>
<span class="line"><span>... ...</span></span></code></pre></div><p>最麻烦的当数第三种例外了，即依赖使用cgo的外部Go包。要想在这种情况下实现静态链接，我们需要找出Go依赖所有外部C库的 .a文件（静态共享库）。</p><p>以一个使用了go-sqlite3包的代码为例，go-sqlite3是SQLite库的go binding，它依赖SQLite库，同时所有第三方C库都依赖libc。为了静态编译这个示例代码，我们要准备SQLite和libc的 .a文件：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$yum install -y gcc glibc-static sqlite-devel</span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>已安装:</span></span>
<span class="line"><span>  sqlite-devel.x86_64 0:3.7.17-8.el7_7.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>更新完毕:</span></span>
<span class="line"><span>  glibc-static.x86_64 0:2.17-326.el7_9.3</span></span></code></pre></div><p>接下来，我们就能以静态链接的方式编译该代码了，下面是一个go build命令的参考：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -tags &#39;sqlite_omit_load_extension&#39; -ldflags &#39;-linkmode external -extldflags &quot;-static&quot;&#39; demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$file ./demo</span></span>
<span class="line"><span>./demo: ELF 64-bit LSB executable, x86-64, version 1 (GNU/Linux), statically linked, for GNU/Linux 2.6.32, BuildID[sha1]=c779f5c3eaa945d916de059b56d94c23974ce61c, not stripped</span></span></code></pre></div><p>这里命令行中的 <code>-tags &#39;sqlite_omit_load_extension&#39;</code> 用于禁用SQLite3的动态加载功能，确保更好的静态链接兼容性。而 <code>-ldflags &#39;-linkmode external -extldflags &quot;-static&quot;&#39;</code> 的含义是使用外部链接器（比如gcc linker），并强制静态链接所有库。</p><h2 id="未使用的符号会包含在最终的可执行文件中吗" tabindex="-1">未使用的符号会包含在最终的可执行文件中吗？ <a class="header-anchor" href="#未使用的符号会包含在最终的可执行文件中吗" aria-label="Permalink to &quot;未使用的符号会包含在最终的可执行文件中吗？&quot;">​</a></h2><p>我们知道，无论是GOPATH时代，还是Go module时代，Go的编译单元始终是包（package）。一个包（无论包中包含多少个Go源文件）会作为一个编译单元被编译为一个目标文件（.a），然后Go链接器会将多个目标文件链接在一起生成可执行文件。因此如果一个包被依赖，那么它就会进入到Go二进制文件中，它内部的符号也会进入到Go二进制文件中。</p><p>那么问题来了！是否被依赖包中的所有符号都会被放到最终的可执行文件中？我们以最简单的Hello World（前面示例中的代码）为例，它依赖fmt包，并调用了fmt包的Println函数，我们看看Println这个符号是否会出现在最终的可执行文件中：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$nm -a helloworld-default | grep &quot;Println&quot;</span></span>
<span class="line"><span>000000000048eba0 T fmt.(*pp).doPrintln</span></span></code></pre></div><p>居然没有！我们初步怀疑是inline优化在作祟。接下来，关闭优化再来试试：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -o helloworld-default-noinline -gcflags=&#39;-l -N&#39; main.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$nm -a helloworld-default-noinline | grep &quot;Println&quot;</span></span>
<span class="line"><span>000000000048ec00 T fmt.(*pp).doPrintln</span></span>
<span class="line"><span>0000000000489ee0 T fmt.Println</span></span></code></pre></div><p>的确如此！不过当使用&quot;fmt.&quot;去过滤helloworld-default-noinline的所有符号时，我们发现fmt包的一些常见符号并未包含在其中，比如Printf、Fprintf、Scanf等。</p><p>这是因为Go编译器的一个重要特性：死码消除（Dead Code Elimination），即编译器会将未使用的代码和数据从最终的二进制文件中剔除。</p><p>解决了这个问题，我们再来探讨一个衍生问题： <strong>如果Go源码使用空导入方式导入了一个包，那么这个包是否会被编译到Go二进制文件中呢</strong>？其实道理是一样的，如果用到了里面的符号，就会存在，否则不会。</p><p>以空导入os/user为例，即便在CGO_ENABLED=0的情况下，因为没有使用os/user中的任何符号，在最终的二进制文件中也不会包含user包：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$CGO_ENABLED=0 go build -o helloworld-with-os-user-noinline -gcflags=&#39;-l -N&#39; main-with-os-user.go</span></span>
<span class="line"><span>[root&amp;#64;iZ2ze18rmx2avqb5xgb4omZ helloworld]# nm -a helloworld-with-os-user-noinline |grep user</span></span>
<span class="line"><span>0000000000551ac0 B runtime.userArenaState</span></span></code></pre></div><p>但是，如果是带有init函数的包，且init函数中调用了同包其他符号的情况呢？我们以expvar包为例看一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// go-details/go-compilation/main-with-expvar.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    _ &quot;expvar&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    fmt.Println(&quot;hello, world&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>编译并查看一下其中的符号：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -o helloworld-with-expvar-noinline -gcflags=&#39;-l -N&#39; main-with-expvar.go</span></span>
<span class="line"><span>$nm -a helloworld-with-expvar-noinline|grep expvar</span></span>
<span class="line"><span>0000000000556480 T expvar.appendJSONQuote</span></span>
<span class="line"><span>00000000005562e0 T expvar.cmdline</span></span>
<span class="line"><span>00000000005561c0 T expvar.expvarHandler</span></span>
<span class="line"><span>00000000005568e0 T expvar.(*Func).String</span></span>
<span class="line"><span>0000000000555ee0 T expvar.Func.String</span></span>
<span class="line"><span>00000000005563a0 T expvar.init.0</span></span>
<span class="line"><span>00000000006e0560 D expvar..inittask</span></span>
<span class="line"><span>0000000000704550 d expvar..interfaceSwitch.0</span></span>
<span class="line"><span>... ...</span></span></code></pre></div><p>除此之外，一个包即便没有init函数，但也有需要初始化的全局变量，比如crypto包的hashes：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/crypto/crypto.go</span></span>
<span class="line"><span>var hashes = make([]func() hash.Hash, maxHash)</span></span></code></pre></div><p>crypto包的相关符号如何也会进入最终的可执行文件中，不妨自己动手试试。下面是我得到的一些输出：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go build -o helloworld-with-crypto-noinline -gcflags=&#39;-l -N&#39; main-with-crypto.go</span></span>
<span class="line"><span>$nm -a helloworld-with-crypto-noinline|grep crypto</span></span>
<span class="line"><span>00000000005517b0 B crypto.hashes</span></span>
<span class="line"><span>000000000048ee60 T crypto.init</span></span>
<span class="line"><span>0000000000547280 D crypto..inittask</span></span></code></pre></div><p>有人会问：os/user包也有一些全局变量啊，为什么这些符号没有被包含在可执行文件中呢？比如：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/os/user/user.go</span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    userImplemented      = true</span></span>
<span class="line"><span>    groupImplemented     = true</span></span>
<span class="line"><span>    groupListImplemented = true</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>这就涉及Go包初始化的逻辑了。我们看到crypto包包含在可执行文件中的符号有crypto.init和crypto…inittask，显然这不是crypto包代码中的符号，而是Go编译器为crypto包自动生成的init函数和inittask结构。</p><p>Go编译器会为每个包生成一个init函数，即使包中没有显式定义init函数，同时 <a href="https://go.dev/src/cmd/compile/internal/pkginit/init.go" target="_blank" rel="noreferrer">每个包都会有一个inittask结构</a>，用于运行时的包初始化系统。当然这么说也不够精确，如果一个包没有init函数、需要初始化的全局变量或其他需要运行时初始化的内容，则编译器不会为其生成init函数和inittask，比如上面的os/user包。</p><p>os/user包确实有上述全局变量的定义，但是这些变量是在编译期就可以确定值的常量布尔值，而且未被包外引用或在包内用于影响控制流。Go编译器足够智能，能够判断出这些初始化是“无副作用的”，不需要在运行时进行初始化，只有真正需要运行时初始化的包才会生成init和inittask。</p><p>这也解释了，为什么空导入os/user包时没有相关的init和inittask符号，而crypto、expvar包有init.0和inittask符号。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我们一起走过了一段充满惊喜的旅程，探索了Go语言中那些鲜为人知却至关重要的细节。从导出标识符的微妙之处，到 <code>gcflags</code> 和 <code>ldflags</code> 的强大力量，再到包文件选择的智慧，以及默认链接方式的探索，最后到那些未使用的符号的命运，每一个主题都让我们对Go语言的理解更加深入。</p><p>当然，这些知识不仅仅是一些琐碎的细节，它们是构建高效、健壮且易于维护的Go程序的基础。</p><ul><li>理解了导出标识符的真正含义，我们可以更好地设计包的接口，实现信息隐藏和封装。</li><li>掌握了 <code>gcflags</code> 和 <code>ldflags</code>，我们就拥有了精细调控编译和链接过程的能力，可以针对不同的需求进行优化。</li><li>了解了包文件选择的规则，我们就能更轻松地编写跨平台的代码。</li><li>明白了默认的链接方式，我们就可以更好地控制程序的依赖和部署。</li><li>认识到死代码消除的机制，则有助于我们编写出更简洁、高效的代码。</li></ul><p>我希望这次的探险能够激发你对Go语言更深层次的兴趣。Go语言就像一个宝藏，总有新的领域等待我们去探索，总有新的知识等待我们去发现。每一次的深入挖掘，都会让我们对这门语言有更多的了解和喜爱。</p><p>最后，再次感谢你的陪伴。希望这篇加餐能够成为你Go语言学习之旅中一块有益的垫脚石。如果你有任何问题或者想要进一步探讨的内容，欢迎随时与我交流。让我们在Go语言的世界里继续探索，不断前行！</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>学完这一节后，建议你使用我给出的示例，自己动手从头探索一下今天讲的细节。如果有新的想法，欢迎在留言区一起分享和交流。</p>`,186)])])}const h=n(l,[["render",i]]);export{g as __pageData,h as default};
