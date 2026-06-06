import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const f=JSON.parse('{"title":"29｜接口：为什么nil接口不等于nil？","description":"","frontmatter":{},"headers":[{"level":2,"title":"接口的静态特性与动态特性","slug":"接口的静态特性与动态特性","link":"#接口的静态特性与动态特性","children":[]},{"level":2,"title":"nil error值 != nil","slug":"nil-error值-nil","link":"#nil-error值-nil","children":[]},{"level":2,"title":"接口类型变量的内部表示","slug":"接口类型变量的内部表示","link":"#接口类型变量的内部表示","children":[{"level":3,"title":"第一种：nil接口变量","slug":"第一种-nil接口变量","link":"#第一种-nil接口变量","children":[]},{"level":3,"title":"第二种：空接口类型变量","slug":"第二种-空接口类型变量","link":"#第二种-空接口类型变量","children":[]},{"level":3,"title":"第三种：非空接口类型变量","slug":"第三种-非空接口类型变量","link":"#第三种-非空接口类型变量","children":[]},{"level":3,"title":"第四种：空接口类型变量与非空接口类型变量的等值比较","slug":"第四种-空接口类型变量与非空接口类型变量的等值比较","link":"#第四种-空接口类型变量与非空接口类型变量的等值比较","children":[]}]},{"level":2,"title":"输出接口类型变量内部表示的详细信息","slug":"输出接口类型变量内部表示的详细信息","link":"#输出接口类型变量内部表示的详细信息","children":[]},{"level":2,"title":"接口类型的装箱（boxing）原理","slug":"接口类型的装箱-boxing-原理","link":"#接口类型的装箱-boxing-原理","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/29｜接口：为什么nil接口不等于nil？.md","filePath":"TonyBai·Go语言第一课/29｜接口：为什么nil接口不等于nil？.md","lastUpdated":1779817248000}'),i={name:"TonyBai·Go语言第一课/29｜接口：为什么nil接口不等于nil？.md"};function l(t,n,c,r,o,u){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_29-接口-为什么nil接口不等于nil" tabindex="-1">29｜接口：为什么nil接口不等于nil？ <a class="header-anchor" href="#_29-接口-为什么nil接口不等于nil" aria-label="Permalink to &quot;29｜接口：为什么nil接口不等于nil？&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>上一讲我们学习了Go接口的基础知识与设计惯例，知道Go接口是构建Go应用骨架的重要元素。从语言设计角度来看，Go语言的接口（interface）和并发（concurrency）原语是我最喜欢的两类Go语言语法元素。Go语言核心团队的技术负责人Russ Cox也曾说过这样一句话：“ <strong>如果要从Go语言中挑选出一个特性放入其他语言，我会选择接口</strong>”，这句话足以说明接口这一语法特性在这位Go语言大神心目中的地位。</p><p>为什么接口在Go中有这么高的地位呢？这是因为 <strong>接口是Go这门静态语言中唯一“动静兼备”的语法特性</strong>。而且，接口“动静兼备”的特性给Go带来了强大的表达能力，但同时也给Go语言初学者带来了不少困惑。要想真正解决这些困惑，我们必须深入到Go运行时层面，看看Go语言在运行时是如何表示接口类型的。在这一讲中，我就带着你一起深入到接口类型的运行时表示层面看看。</p><p>好，在解惑之前，我们先来看看接口的静态与动态特性，看看“动静皆备”到底是什么意思。</p><h2 id="接口的静态特性与动态特性" tabindex="-1">接口的静态特性与动态特性 <a class="header-anchor" href="#接口的静态特性与动态特性" aria-label="Permalink to &quot;接口的静态特性与动态特性&quot;">​</a></h2><p>接口的 <strong>静态特性</strong> 体现在 <strong>接口类型变量具有静态类型</strong>，比如 <code>var err error</code> 中变量err的静态类型为error。拥有静态类型，那就意味着编译器会在编译阶段对所有接口类型变量的赋值操作进行类型检查，编译器会检查右值的类型是否实现了该接口方法集合中的所有方法。如果不满足，就会报错：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var err error = 1 // cannot use 1 (type int) as type error in assignment: int does not implement error (missing Error method)</span></span></code></pre></div><p>而接口的 <strong>动态特性</strong>，就体现在接口类型变量在运行时还存储了右值的真实类型信息，这个右值的真实类型被称为接口类型变量的 <strong>动态类型</strong>。你看一下下面示例代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var err error</span></span>
<span class="line"><span>err = errors.New(&quot;error1&quot;)</span></span>
<span class="line"><span>fmt.Printf(&quot;%T\\n&quot;, err)  // *errors.errorString</span></span></code></pre></div><p>我们可以看到，这个示例通过errros.New构造了一个错误值，赋值给了error接口类型变量err，并通过fmt.Printf函数输出接口类型变量err的动态类型为*errors.errorString。</p><p>那接口的这种“动静皆备”的特性，又带来了什么好处呢？</p><p>首先，接口类型变量在程序运行时可以被赋值为不同的动态类型变量，每次赋值后，接口类型变量中存储的动态类型信息都会发生变化，这让Go语言可以像动态语言（比如Python）那样拥有使用 <a href="https://en.wikipedia.org/wiki/Duck_typing" target="_blank" rel="noreferrer">Duck Typing（鸭子类型）</a> 的灵活性。所谓鸭子类型，就是指某类型所表现出的特性（比如是否可以作为某接口类型的右值），不是由其基因（比如C++中的父类）决定的，而是由类型所表现出来的行为（比如类型拥有的方法）决定的。</p><p>比如下面的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type QuackableAnimal interface {</span></span>
<span class="line"><span>    Quack()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Duck struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (Duck) Quack() {</span></span>
<span class="line"><span>    println(&quot;duck quack!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Dog struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (Dog) Quack() {</span></span>
<span class="line"><span>    println(&quot;dog quack!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Bird struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (Bird) Quack() {</span></span>
<span class="line"><span>    println(&quot;bird quack!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func AnimalQuackInForest(a QuackableAnimal) {</span></span>
<span class="line"><span>    a.Quack()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    animals := []QuackableAnimal{new(Duck), new(Dog), new(Bird)}</span></span>
<span class="line"><span>    for _, animal := range animals {</span></span>
<span class="line"><span>        AnimalQuackInForest(animal)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子中，我们用接口类型QuackableAnimal来代表具有“会叫”这一特征的动物，而Duck、Bird和Dog类型各自都具有这样的特征，于是我们可以将这三个类型的变量赋值给QuackableAnimal接口类型变量a。每次赋值，变量a中存储的动态类型信息都不同，Quack方法的执行结果将根据变量a中存储的动态类型信息而定。</p><p>这里的Duck、Bird、Dog都是“鸭子类型”，但它们之间并没有什么联系，之所以能作为右值赋值给QuackableAnimal类型变量，只是因为他们表现出了QuackableAnimal所要求的特征罢了。</p><p>不过，与动态语言不同的是，Go接口还可以保证“动态特性”使用时的安全性。比如，编译器在编译期就可以捕捉到将int类型变量传给QuackableAnimal接口类型变量这样的明显错误，决不会让这样的错误遗漏到运行时才被发现。</p><p>接口类型的动静特性让我们看到了接口类型的强大，但在日常使用过程中，很多人都会产生各种困惑，其中最经典的一个困惑莫过于“nil的error值不等于nil”了。下面我们来详细看一下。</p><h2 id="nil-error值-nil" tabindex="-1">nil error值 != nil <a class="header-anchor" href="#nil-error值-nil" aria-label="Permalink to &quot;nil error值 != nil&quot;">​</a></h2><p>这里我们直接来看一段改编自 <a href="https://go.dev/doc/faq#nil_error" target="_blank" rel="noreferrer">GO FAQ中的例子</a> 的代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type MyError struct {</span></span>
<span class="line"><span>    error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var ErrBad = MyError{</span></span>
<span class="line"><span>    error: errors.New(&quot;bad things happened&quot;),</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func bad() bool {</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func returnsError() error {</span></span>
<span class="line"><span>    var p *MyError = nil</span></span>
<span class="line"><span>    if bad() {</span></span>
<span class="line"><span>        p = &amp;ErrBad</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return p</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    err := returnsError()</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        fmt.Printf(&quot;error occur: %+v\\n&quot;, err)</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(&quot;ok&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个例子中，我们的关注点集中在returnsError这个函数上面。这个函数定义了一个 <code>*MyError</code> 类型的变量p，初值为nil。如果函数bad返回false，returnsError函数就会直接将p（此时p = nil）作为返回值返回给调用者，之后调用者会将returnsError函数的返回值（error接口类型）与nil进行比较，并根据比较结果做出最终处理。</p><p>如果你是一个初学者，我猜你的的思路大概是这样的：p为nil，returnsError返回p，那么main函数中的err就等于nil，于是程序输出 <strong>ok</strong> 后退出。</p><p>但真实的运行结果是什么样的呢？我们来看一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>error occur: &amp;lt;nil&amp;gt;</span></span></code></pre></div><p>我们看到，示例程序并未如我们前面预期的那样输出ok。程序显然是进入了错误处理分支，输出了err的值。那这里就有一个问题了：明明returnsError函数返回的p值为nil，为什么却满足了 <code>if err != nil</code> 的条件进入错误处理分支呢？</p><p>要想弄清楚这个问题，我们需要进一步了解接口类型变量的内部表示。</p><h2 id="接口类型变量的内部表示" tabindex="-1">接口类型变量的内部表示 <a class="header-anchor" href="#接口类型变量的内部表示" aria-label="Permalink to &quot;接口类型变量的内部表示&quot;">​</a></h2><p>接口类型“动静兼备”的特性也决定了它的变量的内部表示绝不像一个静态类型变量（如int、float64）那样简单，我们可以在 <code>$GOROOT/src/runtime/runtime2.go</code> 中找到接口类型变量在运行时的表示：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/runtime2.go</span></span>
<span class="line"><span>type iface struct {</span></span>
<span class="line"><span>    tab  *itab</span></span>
<span class="line"><span>    data unsafe.Pointer</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type eface struct {</span></span>
<span class="line"><span>    _type *_type</span></span>
<span class="line"><span>    data  unsafe.Pointer</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，在运行时层面，接口类型变量有两种内部表示： <code>iface</code> 和 <code>eface</code>，这两种表示分别用于不同的接口类型变量：</p><ul><li>eface用于表示没有方法的空接口（empty interface）类型变量，也就是interface{}类型的变量；</li><li>iface用于表示其余拥有方法的接口interface类型变量。</li></ul><p>这两个结构的共同点是它们都有两个指针字段，并且第二个指针字段的功能相同，都是指向当前赋值给该接口类型变量的动态类型变量的值。</p><p>那它们的不同点在哪呢？就在于eface表示的空接口类型并没有方法列表，因此它的第一个指针字段指向一个 <code>_type</code> 类型结构，这个结构为该接口类型变量的动态类型的信息，它的定义是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/type.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type _type struct {</span></span>
<span class="line"><span>    size       uintptr</span></span>
<span class="line"><span>    ptrdata    uintptr // size of memory prefix holding all pointers</span></span>
<span class="line"><span>    hash       uint32</span></span>
<span class="line"><span>    tflag      tflag</span></span>
<span class="line"><span>    align      uint8</span></span>
<span class="line"><span>    fieldAlign uint8</span></span>
<span class="line"><span>    kind       uint8</span></span>
<span class="line"><span>    // function for comparing objects of this type</span></span>
<span class="line"><span>    // (ptr to object A, ptr to object B) -&amp;gt; ==?</span></span>
<span class="line"><span>    equal func(unsafe.Pointer, unsafe.Pointer) bool</span></span>
<span class="line"><span>    // gcdata stores the GC type data for the garbage collector.</span></span>
<span class="line"><span>    // If the KindGCProg bit is set in kind, gcdata is a GC program.</span></span>
<span class="line"><span>    // Otherwise it is a ptrmask bitmap. See mbitmap.go for details.</span></span>
<span class="line"><span>    gcdata    *byte</span></span>
<span class="line"><span>    str       nameOff</span></span>
<span class="line"><span>    ptrToThis typeOff</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而iface除了要存储动态类型信息之外，还要存储接口本身的信息（接口的类型信息、方法列表信息等）以及动态类型所实现的方法的信息，因此iface的第一个字段指向一个 <code>itab</code> 类型结构。itab结构的定义如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/runtime2.go</span></span>
<span class="line"><span>type itab struct {</span></span>
<span class="line"><span>    inter *interfacetype</span></span>
<span class="line"><span>    _type *_type</span></span>
<span class="line"><span>    hash  uint32 // copy of _type.hash. Used for type switches.</span></span>
<span class="line"><span>    _     [4]byte</span></span>
<span class="line"><span>    fun   [1]uintptr // variable sized. fun[0]==0 means _type does not implement inter.</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们也可以看到，itab结构中的第一个字段 <code>inter</code> 指向的interfacetype结构，存储着这个接口类型自身的信息。你看一下下面这段代码表示的interfacetype类型定义， 这个interfacetype结构由类型信息（typ）、包路径名（pkgpath）和接口方法集合切片（mhdr）组成。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/type.go</span></span>
<span class="line"><span>type interfacetype struct {</span></span>
<span class="line"><span>    typ     _type</span></span>
<span class="line"><span>    pkgpath name</span></span>
<span class="line"><span>    mhdr    []imethod</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>itab结构中的字段 <code>_type</code> 则存储着这个接口类型变量的动态类型的信息，字段 <code>fun</code> 则是动态类型已实现的接口方法的调用地址数组。</p><p>下面我们再结合例子用图片来直观展现eface和iface的结构。首先我们看一个用eface表示的空接口类型变量的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type T struct {</span></span>
<span class="line"><span>    n int</span></span>
<span class="line"><span>    s string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var t = T {</span></span>
<span class="line"><span>        n: 17,</span></span>
<span class="line"><span>        s: &quot;hello, interface&quot;,</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    var ei interface{} = t // Go运行时使用eface结构表示ei</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子中的空接口类型变量ei在Go运行时的表示是这样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/473414/2d8f103e2973d2e31c9f4237e6799eae.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/473414/2d8f103e2973d2e31c9f4237e6799eae.jpg" alt="图片"></a></p><p>我们看到空接口类型的表示较为简单，图中上半部分_type字段指向它的动态类型T的类型信息，下半部分的data则是指向一个T类型的实例值。</p><p>我们再来看一个更复杂的用iface表示非空接口类型变量的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type T struct {</span></span>
<span class="line"><span>    n int</span></span>
<span class="line"><span>    s string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (T) M1() {}</span></span>
<span class="line"><span>func (T) M2() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type NonEmptyInterface interface {</span></span>
<span class="line"><span>    M1()</span></span>
<span class="line"><span>    M2()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var t = T{</span></span>
<span class="line"><span>        n: 18,</span></span>
<span class="line"><span>        s: &quot;hello, interface&quot;,</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    var i NonEmptyInterface = t</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和eface比起来，iface的表示稍微复杂些。我也画了一幅表示上面NonEmptyInterface接口类型变量在Go运行时表示的示意图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/473414/369810ba10b9b8792d8edfd8e931b344.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/TonyBai%C2%B7Go%E8%AF%AD%E8%A8%80%E7%AC%AC%E4%B8%80%E8%AF%BE/images/473414/369810ba10b9b8792d8edfd8e931b344.jpg" alt=""></a></p><p>由上面的这两幅图，我们可以看出，每个接口类型变量在运行时的表示都是由两部分组成的，针对不同接口类型我们可以简化记作： <code>eface(_type, data)</code> 和 <code>iface(tab, data)</code>。</p><p>而且，虽然eface和iface的第一个字段有所差别，但tab和_type可以统一看作是动态类型的类型信息。Go语言中每种类型都会有唯一的_type信息，无论是内置原生类型，还是自定义类型都有。Go运行时会为程序内的全部类型建立只读的共享_type信息表，因此拥有相同动态类型的同类接口类型变量的_type/tab信息是相同的。</p><p>而接口类型变量的data部分则是指向一个动态分配的内存空间，这个内存空间存储的是赋值给接口类型变量的动态类型变量的值。未显式初始化的接口类型变量的值为 <code>nil</code>，也就是这个变量的_type/tab和data都为nil。</p><p>也就是说，我们判断两个接口类型变量是否相等，只需判断_type/tab以及data是否都相等即可。两个接口变量的_type/tab不同时，即两个接口变量的动态类型不相同时，两个接口类型变量一定不等。</p><p>当两个接口变量的_type/tab相同时，对data的相等判断要有区分。当接口变量的动态类型为指针类型时(*T)，Go不会再额外分配内存存储指针值，而会将动态类型的指针值直接存入data字段中，这样data值的相等性决定了两个接口类型变量是否相等；当接口变量的动态类型为非指针类型(T)时，我们判断的将不是data指针的值是否相等，而是判断data指针指向的内存空间所存储的数据值是否相等，若相等，则两个接口类型变量相等。</p><p>不过，通过肉眼去辨别接口类型变量是否相等总是困难一些，我们可以引入一些 <strong>helper函数</strong>。借助这些函数，我们可以清晰地输出接口类型变量的内部表示，这样就可以一目了然地看出两个变量是否相等了。</p><p>由于eface和iface是runtime包中的非导出结构体定义，我们不能直接在包外使用，所以也就无法直接访问到两个结构体中的数据。不过，Go语言提供了println预定义函数，可以用来输出eface或iface的两个指针字段的值。</p><p>在编译阶段，编译器会根据要输出的参数的类型将println替换为特定的函数，这些函数都定义在 <code>$GOROOT/src/runtime/print.go</code> 文件中，而针对eface和iface类型的打印函数实现如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/print.go</span></span>
<span class="line"><span>func printeface(e eface) {</span></span>
<span class="line"><span>    print(&quot;(&quot;, e._type, &quot;,&quot;, e.data, &quot;)&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func printiface(i iface) {</span></span>
<span class="line"><span>    print(&quot;(&quot;, i.tab, &quot;,&quot;, i.data, &quot;)&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，printeface和printiface会输出各自的两个指针字段的值。下面我们就来使用println函数输出各类接口类型变量的内部表示信息，并结合输出结果，解析接口类型变量的等值比较操作。</p><h3 id="第一种-nil接口变量" tabindex="-1">第一种：nil接口变量 <a class="header-anchor" href="#第一种-nil接口变量" aria-label="Permalink to &quot;第一种：nil接口变量&quot;">​</a></h3><p>我们前面提过，未赋初值的接口类型变量的值为nil，这类变量也就是nil接口变量，我们来看这类变量的内部表示输出的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func printNilInterface() {</span></span>
<span class="line"><span>	// nil接口变量</span></span>
<span class="line"><span>	var i interface{} // 空接口类型</span></span>
<span class="line"><span>	var err error     // 非空接口类型</span></span>
<span class="line"><span>	println(i)</span></span>
<span class="line"><span>	println(err)</span></span>
<span class="line"><span>	println(&quot;i = nil:&quot;, i == nil)</span></span>
<span class="line"><span>	println(&quot;err = nil:&quot;, err == nil)</span></span>
<span class="line"><span>	println(&quot;i = err:&quot;, i == err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这个函数，输出结果是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(0x0,0x0)</span></span>
<span class="line"><span>(0x0,0x0)</span></span>
<span class="line"><span>i = nil: true</span></span>
<span class="line"><span>err = nil: true</span></span>
<span class="line"><span>i = err: true</span></span></code></pre></div><p>我们看到，无论是空接口类型还是非空接口类型变量，一旦变量值为nil，那么它们内部表示均为 <code>(0x0,0x0)</code>，也就是类型信息、数据值信息均为空。因此上面的变量i和err等值判断为true。</p><h3 id="第二种-空接口类型变量" tabindex="-1">第二种：空接口类型变量 <a class="header-anchor" href="#第二种-空接口类型变量" aria-label="Permalink to &quot;第二种：空接口类型变量&quot;">​</a></h3><p>下面是空接口类型变量的内部表示输出的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  func printEmptyInterface() {</span></span>
<span class="line"><span>      var eif1 interface{} // 空接口类型</span></span>
<span class="line"><span>      var eif2 interface{} // 空接口类型</span></span>
<span class="line"><span>      var n, m int = 17, 18</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      eif1 = n</span></span>
<span class="line"><span>      eif2 = m</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      println(&quot;eif1:&quot;, eif1)</span></span>
<span class="line"><span>      println(&quot;eif2:&quot;, eif2)</span></span>
<span class="line"><span>      println(&quot;eif1 = eif2:&quot;, eif1 == eif2) // false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      eif2 = 17</span></span>
<span class="line"><span>      println(&quot;eif1:&quot;, eif1)</span></span>
<span class="line"><span>      println(&quot;eif2:&quot;, eif2)</span></span>
<span class="line"><span>      println(&quot;eif1 = eif2:&quot;, eif1 == eif2) // true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      eif2 = int64(17)</span></span>
<span class="line"><span>      println(&quot;eif1:&quot;, eif1)</span></span>
<span class="line"><span>      println(&quot;eif2:&quot;, eif2)</span></span>
<span class="line"><span>      println(&quot;eif1 = eif2:&quot;, eif1 == eif2) // false</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>这个例子的运行输出结果是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>eif1: (0x10ac580,0xc00007ef48)</span></span>
<span class="line"><span>eif2: (0x10ac580,0xc00007ef40)</span></span>
<span class="line"><span>eif1 = eif2: false</span></span>
<span class="line"><span>eif1: (0x10ac580,0xc00007ef48)</span></span>
<span class="line"><span>eif2: (0x10ac580,0x10eb3d0)</span></span>
<span class="line"><span>eif1 = eif2: true</span></span>
<span class="line"><span>eif1: (0x10ac580,0xc00007ef48)</span></span>
<span class="line"><span>eif2: (0x10ac640,0x10eb3d8)</span></span>
<span class="line"><span>eif1 = eif2: false</span></span></code></pre></div><p>我们按顺序分析一下这个输出结果。</p><p>首先，代码执行到第11行时，eif1与eif2已经分别被赋值整型值17与18，这样eif1和eif2的动态类型的类型信息是相同的（都是0x10ac580），但data指针指向的内存块中存储的值不同，一个是17，一个是18，于是eif1不等于eif2。</p><p>接着，代码执行到第16行的时候，eif2已经被重新赋值为17，这样eif1和eif2不仅存储的动态类型的类型信息是相同的（都是0x10ac580），data指针指向的内存块中存储值也相同了，都是17，于是eif1等于eif2。</p><p>然后，代码执行到第21行时，eif2已经被重新赋值了int64类型的数值17。这样，eif1和eif2存储的动态类型的类型信息就变成不同的了，一个是int，一个是int64，即便data指针指向的内存块中存储值是相同的，最终eif1与eif2也是不相等的。</p><p>从输出结果中我们可以总结一下： <strong>对于空接口类型变量，只有_type和data所指数据内容一致的情况下，两个空接口类型变量之间才能划等号</strong>。另外，Go在创建eface时一般会为data重新分配新内存空间，将动态类型变量的值复制到这块内存空间，并将data指针指向这块内存空间。因此我们多数情况下看到的data指针值都是不同的。</p><h3 id="第三种-非空接口类型变量" tabindex="-1">第三种：非空接口类型变量 <a class="header-anchor" href="#第三种-非空接口类型变量" aria-label="Permalink to &quot;第三种：非空接口类型变量&quot;">​</a></h3><p>这里，我们也直接来看一个非空接口类型变量的内部表示输出的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type T int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (t T) Error() string {</span></span>
<span class="line"><span>    return &quot;bad error&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func printNonEmptyInterface() {</span></span>
<span class="line"><span>    var err1 error // 非空接口类型</span></span>
<span class="line"><span>    var err2 error // 非空接口类型</span></span>
<span class="line"><span>    err1 = (*T)(nil)</span></span>
<span class="line"><span>    println(&quot;err1:&quot;, err1)</span></span>
<span class="line"><span>    println(&quot;err1 = nil:&quot;, err1 == nil)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    err1 = T(5)</span></span>
<span class="line"><span>    err2 = T(6)</span></span>
<span class="line"><span>    println(&quot;err1:&quot;, err1)</span></span>
<span class="line"><span>    println(&quot;err2:&quot;, err2)</span></span>
<span class="line"><span>    println(&quot;err1 = err2:&quot;, err1 == err2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    err2 = fmt.Errorf(&quot;%d\\n&quot;, 5)</span></span>
<span class="line"><span>    println(&quot;err1:&quot;, err1)</span></span>
<span class="line"><span>    println(&quot;err2:&quot;, err2)</span></span>
<span class="line"><span>    println(&quot;err1 = err2:&quot;, err1 == err2)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子的运行输出结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>err1: (0x10ed120,0x0)</span></span>
<span class="line"><span>err1 = nil: false</span></span>
<span class="line"><span>err1: (0x10ed1a0,0x10eb310)</span></span>
<span class="line"><span>err2: (0x10ed1a0,0x10eb318)</span></span>
<span class="line"><span>err1 = err2: false</span></span>
<span class="line"><span>err1: (0x10ed1a0,0x10eb310)</span></span>
<span class="line"><span>err2: (0x10ed0c0,0xc000010050)</span></span>
<span class="line"><span>err1 = err2: false</span></span></code></pre></div><p>我们看到上面示例中每一轮通过println输出的err1和err2的tab和data值，要么data值不同，要么tab与data值都不同。</p><p>和空接口类型变量一样，只有tab和data指的数据内容一致的情况下，两个非空接口类型变量之间才能划等号。这里我们要注意err1下面的赋值情况：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>err1 = (*T)(nil)</span></span></code></pre></div><p>针对这种赋值，println输出的err1是（0x10ed120, 0x0），也就是非空接口类型变量的类型信息并不为空，数据指针为空，因此它与nil（0x0,0x0）之间不能划等号。</p><p>现在我们再回到我们开头的那个问题，你是不是已经豁然开朗了呢？开头的问题中，从returnsError返回的error接口类型变量err的数据指针虽然为空，但它的类型信息（iface.tab）并不为空，而是*MyError对应的类型信息，这样err与nil（0x0,0x0）相比自然不相等，这就是我们开头那个问题的答案解析，现在你明白了吗？</p><h3 id="第四种-空接口类型变量与非空接口类型变量的等值比较" tabindex="-1">第四种：空接口类型变量与非空接口类型变量的等值比较 <a class="header-anchor" href="#第四种-空接口类型变量与非空接口类型变量的等值比较" aria-label="Permalink to &quot;第四种：空接口类型变量与非空接口类型变量的等值比较&quot;">​</a></h3><p>下面是非空接口类型变量和空接口类型变量之间进行比较的例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func printEmptyInterfaceAndNonEmptyInterface() {</span></span>
<span class="line"><span>	var eif interface{} = T(5)</span></span>
<span class="line"><span>	var err error = T(5)</span></span>
<span class="line"><span>	println(&quot;eif:&quot;, eif)</span></span>
<span class="line"><span>	println(&quot;err:&quot;, err)</span></span>
<span class="line"><span>	println(&quot;eif = err:&quot;, eif == err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	err = T(6)</span></span>
<span class="line"><span>	println(&quot;eif:&quot;, eif)</span></span>
<span class="line"><span>	println(&quot;err:&quot;, err)</span></span>
<span class="line"><span>	println(&quot;eif = err:&quot;, eif == err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个示例的输出结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>eif: (0x10b3b00,0x10eb4d0)</span></span>
<span class="line"><span>err: (0x10ed380,0x10eb4d8)</span></span>
<span class="line"><span>eif = err: true</span></span>
<span class="line"><span>eif: (0x10b3b00,0x10eb4d0)</span></span>
<span class="line"><span>err: (0x10ed380,0x10eb4e0)</span></span>
<span class="line"><span>eif = err: false</span></span></code></pre></div><p>你可以看到，空接口类型变量和非空接口类型变量内部表示的结构有所不同（第一个字段：_type vs. tab)，两者似乎一定不能相等。但Go在进行等值比较时，类型比较使用的是eface的_type和iface的tab._type，因此就像我们在这个例子中看到的那样，当eif和err都被赋值为 <code>T(5)</code> 时，两者之间是划等号的。</p><p>好了，到这里，我们已经学完了各类接口类型变量在运行时层的表示。我们可以通过println可以查看这个表示信息，从中我们也知道了接口变量只有在类型信息与值信息都一致的情况下才能划等号。</p><h2 id="输出接口类型变量内部表示的详细信息" tabindex="-1">输出接口类型变量内部表示的详细信息 <a class="header-anchor" href="#输出接口类型变量内部表示的详细信息" aria-label="Permalink to &quot;输出接口类型变量内部表示的详细信息&quot;">​</a></h2><p>不过，println输出的接口类型变量的内部表示信息，在一般情况下都是足够的，但有些时候又显得过于简略，比如在上面最后一个例子中，如果仅凭 <code>eif: (0x10b3b00,0x10eb4d0)</code> 和 <code>err: (0x10ed380,0x10eb4d8)</code> 的输出，我们是无法想到两个变量是相等的。</p><p>那这时如果我们能输出接口类型变量内部表示的详细信息（比如：tab._type），那势必可以取得事半功倍的效果。接下来我们就看看这要怎么做。</p><p>前面提到过，eface和iface以及组成它们的itab和_type都是runtime包下的非导出结构体，我们无法在外部直接引用它们。但我们发现，组成eface、iface的类型都是基本数据类型，我们完全可以通过 <strong>“复制代码”</strong> 的方式将它们拿到runtime包外面来。</p><p>不过，这里要注意，由于runtime中的eface、iface，或者它们的组成可能会随着Go版本的变化发生变化，因此这个方法不具备跨版本兼容性。也就是说，基于Go 1.17版本复制的代码，可能仅适用于使用Go 1.17版本编译。这里我们就以Go 1.17版本为例看看：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// dumpinterface.go</span></span>
<span class="line"><span>type eface struct {</span></span>
<span class="line"><span>    _type *_type</span></span>
<span class="line"><span>    data  unsafe.Pointer</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type tflag uint8</span></span>
<span class="line"><span>type nameOff int32</span></span>
<span class="line"><span>type typeOff int32</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type _type struct {</span></span>
<span class="line"><span>    size       uintptr</span></span>
<span class="line"><span>    ptrdata    uintptr // size of memory prefix holding all pointers</span></span>
<span class="line"><span>    hash       uint32</span></span>
<span class="line"><span>    tflag      tflag</span></span>
<span class="line"><span>    align      uint8</span></span>
<span class="line"><span>    fieldAlign uint8</span></span>
<span class="line"><span>    kind       uint8</span></span>
<span class="line"><span>    // function for comparing objects of this type</span></span>
<span class="line"><span>    // (ptr to object A, ptr to object B) -&amp;gt; ==?</span></span>
<span class="line"><span>    equal func(unsafe.Pointer, unsafe.Pointer) bool</span></span>
<span class="line"><span>    // gcdata stores the GC type data for the garbage collector.</span></span>
<span class="line"><span>    // If the KindGCProg bit is set in kind, gcdata is a GC program.</span></span>
<span class="line"><span>    // Otherwise it is a ptrmask bitmap. See mbitmap.go for details.</span></span>
<span class="line"><span>    gcdata    *byte</span></span>
<span class="line"><span>    str       nameOff</span></span>
<span class="line"><span>    ptrToThis typeOff</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type iface struct {</span></span>
<span class="line"><span>    tab  *itab</span></span>
<span class="line"><span>    data unsafe.Pointer</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type itab struct {</span></span>
<span class="line"><span>    inter *interfacetype</span></span>
<span class="line"><span>    _type *_type</span></span>
<span class="line"><span>    hash  uint32 // copy of _type.hash. Used for type switches.</span></span>
<span class="line"><span>    _     [4]byte</span></span>
<span class="line"><span>    fun   [1]uintptr // variable sized. fun[0]==0 means _type does not implement inter.</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const ptrSize = unsafe.Sizeof(uintptr(0))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func dumpEface(i interface{}) {</span></span>
<span class="line"><span>    ptrToEface := (*eface)(unsafe.Pointer(&amp;i))</span></span>
<span class="line"><span>    fmt.Printf(&quot;eface: %+v\\n&quot;, *ptrToEface)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ptrToEface._type != nil {</span></span>
<span class="line"><span>        // dump _type info</span></span>
<span class="line"><span>        fmt.Printf(&quot;\\t _type: %+v\\n&quot;, *(ptrToEface._type))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ptrToEface.data != nil {</span></span>
<span class="line"><span>        // dump data</span></span>
<span class="line"><span>        switch i.(type) {</span></span>
<span class="line"><span>        case int:</span></span>
<span class="line"><span>            dumpInt(ptrToEface.data)</span></span>
<span class="line"><span>        case float64:</span></span>
<span class="line"><span>            dumpFloat64(ptrToEface.data)</span></span>
<span class="line"><span>        case T:</span></span>
<span class="line"><span>            dumpT(ptrToEface.data)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // other cases ... ...</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Printf(&quot;\\t unsupported data type\\n&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;\\n&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func dumpItabOfIface(ptrToIface unsafe.Pointer) {</span></span>
<span class="line"><span>    p := (*iface)(ptrToIface)</span></span>
<span class="line"><span>    fmt.Printf(&quot;iface: %+v\\n&quot;, *p)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if p.tab != nil {</span></span>
<span class="line"><span>        // dump itab</span></span>
<span class="line"><span>        fmt.Printf(&quot;\\t itab: %+v\\n&quot;, *(p.tab))</span></span>
<span class="line"><span>        // dump inter in itab</span></span>
<span class="line"><span>        fmt.Printf(&quot;\\t\\t inter: %+v\\n&quot;, *(p.tab.inter))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // dump _type in itab</span></span>
<span class="line"><span>        fmt.Printf(&quot;\\t\\t _type: %+v\\n&quot;, *(p.tab._type))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // dump fun in tab</span></span>
<span class="line"><span>        funPtr := unsafe.Pointer(&amp;(p.tab.fun))</span></span>
<span class="line"><span>        fmt.Printf(&quot;\\t\\t fun: [&quot;)</span></span>
<span class="line"><span>        for i := 0; i &amp;lt; len((*(p.tab.inter)).mhdr); i++ {</span></span>
<span class="line"><span>            tp := (*uintptr)(unsafe.Pointer(uintptr(funPtr) + uintptr(i)*ptrSize))</span></span>
<span class="line"><span>            fmt.Printf(&quot;0x%x(%d),&quot;, *tp, *tp)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        fmt.Printf(&quot;]\\n&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func dumpDataOfIface(i interface{}) {</span></span>
<span class="line"><span>    // this is a trick as the data part of eface and iface are same</span></span>
<span class="line"><span>    ptrToEface := (*eface)(unsafe.Pointer(&amp;i))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ptrToEface.data != nil {</span></span>
<span class="line"><span>        // dump data</span></span>
<span class="line"><span>        switch i.(type) {</span></span>
<span class="line"><span>        case int:</span></span>
<span class="line"><span>            dumpInt(ptrToEface.data)</span></span>
<span class="line"><span>        case float64:</span></span>
<span class="line"><span>            dumpFloat64(ptrToEface.data)</span></span>
<span class="line"><span>        case T:</span></span>
<span class="line"><span>            dumpT(ptrToEface.data)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // other cases ... ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Printf(&quot;\\t unsupported data type\\n&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Printf(&quot;\\n&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func dumpT(dataOfIface unsafe.Pointer) {</span></span>
<span class="line"><span>    var p *T = (*T)(dataOfIface)</span></span>
<span class="line"><span>    fmt.Printf(&quot;\\t data: %+v\\n&quot;, *p)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>... ...</span></span></code></pre></div><p>这里我挑选了关键部分，省略了部分代码。上面这个dumpinterface.go中提供了三个主要函数:</p><ul><li>dumpEface: 用于输出空接口类型变量的内部表示信息；</li><li>dumpItabOfIface: 用于输出非空接口类型变量的tab字段信息；</li><li>dumpDataOfIface: 用于输出非空接口类型变量的data字段信息；</li></ul><p>我们利用这三个函数来输出一下前面printEmptyInterfaceAndNonEmptyInterface函数中的接口类型变量的信息：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;unsafe&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type T int</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (t T) Error() string {</span></span>
<span class="line"><span>    return &quot;bad error&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var eif interface{} = T(5)</span></span>
<span class="line"><span>    var err error = T(5)</span></span>
<span class="line"><span>    println(&quot;eif:&quot;, eif)</span></span>
<span class="line"><span>    println(&quot;err:&quot;, err)</span></span>
<span class="line"><span>    println(&quot;eif = err:&quot;, eif == err)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    dumpEface(eif)</span></span>
<span class="line"><span>    dumpItabOfIface(unsafe.Pointer(&amp;err))</span></span>
<span class="line"><span>    dumpDataOfIface(err)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这个示例代码，我们得到了这个输出结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>eif: (0x10b38c0,0x10e9b30)</span></span>
<span class="line"><span>err: (0x10eb690,0x10e9b30)</span></span>
<span class="line"><span>eif = err: true</span></span>
<span class="line"><span>eface: {_type:0x10b38c0 data:0x10e9b30}</span></span>
<span class="line"><span>	 _type: {size:8 ptrdata:0 hash:1156555957 tflag:15 align:8 fieldAlign:8 kind:2 equal:0x10032e0 gcdata:0x10e9a60 str:4946 ptrToThis:58496}</span></span>
<span class="line"><span>	 data: bad error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>iface: {tab:0x10eb690 data:0x10e9b30}</span></span>
<span class="line"><span>	 itab: {inter:0x10b5e20 _type:0x10b38c0 hash:1156555957 _:[0 0 0 0] fun:[17454976]}</span></span>
<span class="line"><span>		 inter: {typ:{size:16 ptrdata:16 hash:235953867 tflag:7 align:8 fieldAlign:8 kind:20 equal:0x10034c0 gcdata:0x10d2418 str:3666 ptrToThis:26848} pkgpath:{bytes:&amp;lt;nil&amp;gt;} mhdr:[{name:2592 ityp:43520}]}</span></span>
<span class="line"><span>		 _type: {size:8 ptrdata:0 hash:1156555957 tflag:15 align:8 fieldAlign:8 kind:2 equal:0x10032e0 gcdata:0x10e9a60 str:4946 ptrToThis:58496}</span></span>
<span class="line"><span>		 fun: [0x10a5780(17454976),]</span></span>
<span class="line"><span>	 data: bad error</span></span></code></pre></div><p>从输出结果中，我们看到eif的_type（0x10b38c0）与err的tab._type（0x10b38c0）是一致的，data指针所指内容（“bad error”）也是一致的，因此 <code>eif == err</code> 表达式的结果为true。</p><p>再次强调一遍，上面这个实现可能仅在Go 1.17版本上测试通过，并且在输出iface或eface的data部分内容时只列出了int、float64和T类型的数据读取实现，没有列出全部类型的实现，你可以根据自己的需要实现其余数据类型。dumpinterface.go的完整代码你可以在 <a href="https://github.com/bigwhite/publication/tree/master/column/timegeek/go-first-course/29" target="_blank" rel="noreferrer">这里</a> 找到。</p><p>我们现在已经知道了，接口类型有着复杂的内部结构，所以我们将一个类型变量值赋值给一个接口类型变量值的过程肯定不会像 <code>var i int = 5</code> 那么简单，那么接口类型变量赋值的过程是怎样的呢？其实接口类型变量赋值是一个“装箱”的过程。</p><h2 id="接口类型的装箱-boxing-原理" tabindex="-1">接口类型的装箱（boxing）原理 <a class="header-anchor" href="#接口类型的装箱-boxing-原理" aria-label="Permalink to &quot;接口类型的装箱（boxing）原理&quot;">​</a></h2><p><strong>装箱（boxing）</strong> 是编程语言领域的一个基础概念，一般是指把一个值类型转换成引用类型，比如在支持装箱概念的Java语言中，将一个int变量转换成Integer对象就是一个装箱操作。</p><p>在Go语言中，将任意类型赋值给一个接口类型变量也是 <strong>装箱</strong> 操作。有了前面对接口类型变量内部表示的学习，我们知道 <strong>接口类型的装箱实际就是创建一个eface或iface的过程</strong>。接下来我们就来简要描述一下这个过程，也就是接口类型的装箱原理。</p><p>我们基于下面这个例子中的接口装箱操作来说明：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// interface_internal.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  type T struct {</span></span>
<span class="line"><span>      n int</span></span>
<span class="line"><span>      s string</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  func (T) M1() {}</span></span>
<span class="line"><span>  func (T) M2() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  type NonEmptyInterface interface {</span></span>
<span class="line"><span>      M1()</span></span>
<span class="line"><span>      M2()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  func main() {</span></span>
<span class="line"><span>      var t = T{</span></span>
<span class="line"><span>          n: 17,</span></span>
<span class="line"><span>          s: &quot;hello, interface&quot;,</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      var ei interface{}</span></span>
<span class="line"><span>      ei = t</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      var i NonEmptyInterface</span></span>
<span class="line"><span>      i = t</span></span>
<span class="line"><span>      fmt.Println(ei)</span></span>
<span class="line"><span>      fmt.Println(i)</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这个例子中，对ei和i两个接口类型变量的赋值都会触发装箱操作，要想知道Go在背后做了些什么，我们需要“下沉”一层，也就是要输出上面Go代码对应的汇编代码：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go tool compile -S interface_internal.go &amp;gt; interface_internal.s</span></span></code></pre></div><p>对应 <code>ei = t</code> 一行的汇编如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    0x0026 00038 (interface_internal.go:24) MOVQ    $17, &quot;&quot;..autotmp_15+104(SP)</span></span>
<span class="line"><span>    0x002f 00047 (interface_internal.go:24) LEAQ    go.string.&quot;hello, interface&quot;(SB), CX</span></span>
<span class="line"><span>    0x0036 00054 (interface_internal.go:24) MOVQ    CX, &quot;&quot;..autotmp_15+112(SP)</span></span>
<span class="line"><span>    0x003b 00059 (interface_internal.go:24) MOVQ    $16, &quot;&quot;..autotmp_15+120(SP)</span></span>
<span class="line"><span>    0x0044 00068 (interface_internal.go:24) LEAQ    type.&quot;&quot;.T(SB), AX</span></span>
<span class="line"><span>    0x004b 00075 (interface_internal.go:24) LEAQ    &quot;&quot;..autotmp_15+104(SP), BX</span></span>
<span class="line"><span>    0x0050 00080 (interface_internal.go:24) PCDATA  $1, $0</span></span>
<span class="line"><span>    0x0050 00080 (interface_internal.go:24) CALL    runtime.convT2E(SB)</span></span></code></pre></div><p>对应i = t一行的汇编如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    0x005f 00095 (interface_internal.go:27) MOVQ    $17, &quot;&quot;..autotmp_15+104(SP)</span></span>
<span class="line"><span>    0x0068 00104 (interface_internal.go:27) LEAQ    go.string.&quot;hello, interface&quot;(SB), CX</span></span>
<span class="line"><span>    0x006f 00111 (interface_internal.go:27) MOVQ    CX, &quot;&quot;..autotmp_15+112(SP)</span></span>
<span class="line"><span>    0x0074 00116 (interface_internal.go:27) MOVQ    $16, &quot;&quot;..autotmp_15+120(SP)</span></span>
<span class="line"><span>    0x007d 00125 (interface_internal.go:27) LEAQ    go.itab.&quot;&quot;.T,&quot;&quot;.NonEmptyInterface(SB), AX</span></span>
<span class="line"><span>    0x0084 00132 (interface_internal.go:27) LEAQ    &quot;&quot;..autotmp_15+104(SP), BX</span></span>
<span class="line"><span>    0x0089 00137 (interface_internal.go:27) PCDATA  $1, $1</span></span>
<span class="line"><span>    0x0089 00137 (interface_internal.go:27) CALL    runtime.convT2I(SB)</span></span></code></pre></div><p>在将动态类型变量赋值给接口类型变量语句对应的汇编代码中，我们看到了 <code>convT2E</code> 和 <code>convT2I</code> 两个runtime包的函数。这两个函数的实现位于 <code>$GOROOT/src/runtime/iface.go</code> 中：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/iface.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func convT2E(t *_type, elem unsafe.Pointer) (e eface) {</span></span>
<span class="line"><span>    if raceenabled {</span></span>
<span class="line"><span>        raceReadObjectPC(t, elem, getcallerpc(), funcPC(convT2E))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if msanenabled {</span></span>
<span class="line"><span>        msanread(elem, t.size)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    x := mallocgc(t.size, t, true)</span></span>
<span class="line"><span>    typedmemmove(t, x, elem)</span></span>
<span class="line"><span>    e._type = t</span></span>
<span class="line"><span>    e.data = x</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func convT2I(tab *itab, elem unsafe.Pointer) (i iface) {</span></span>
<span class="line"><span>    t := tab._type</span></span>
<span class="line"><span>    if raceenabled {</span></span>
<span class="line"><span>        raceReadObjectPC(t, elem, getcallerpc(), funcPC(convT2I))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if msanenabled {</span></span>
<span class="line"><span>        msanread(elem, t.size)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    x := mallocgc(t.size, t, true)</span></span>
<span class="line"><span>    typedmemmove(t, x, elem)</span></span>
<span class="line"><span>    i.tab = tab</span></span>
<span class="line"><span>    i.data = x</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>convT2E用于将任意类型转换为一个eface，convT2I用于将任意类型转换为一个iface。两个函数的实现逻辑相似，主要思路就是根据传入的类型信息（convT2E的_type和convT2I的tab._type）分配一块内存空间，并将elem指向的数据拷贝到这块内存空间中，最后传入的类型信息作为返回值结构中的类型信息，返回值结构中的数据指针（data）指向新分配的那块内存空间。</p><p>由此我们也可以看出，经过装箱后，箱内的数据，也就是存放在新分配的内存空间中的数据与原变量便无瓜葛了，比如下面这个例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>	var n int = 61</span></span>
<span class="line"><span>	var ei interface{} = n</span></span>
<span class="line"><span>	n = 62  // n的值已经改变</span></span>
<span class="line"><span>	fmt.Println(&quot;data in box:&quot;, ei) // 输出仍是61</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么convT2E和convT2I函数的类型信息是从何而来的呢？</p><p>其实这些都依赖Go编译器的工作。编译器知道每个要转换为接口类型变量（toType）和动态类型变量的类型（fromType），它会根据这一对类型选择适当的convT2X函数，并在生成代码时使用选出的convT2X函数参与装箱操作。</p><p>不过，装箱是一个有性能损耗的操作，因此Go也在不断对装箱操作进行优化，包括对常见类型如整型、字符串、切片等提供系列快速转换函数：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/iface.go</span></span>
<span class="line"><span>func convT16(val any) unsafe.Pointer     // val must be uint16-like</span></span>
<span class="line"><span>func convT32(val any) unsafe.Pointer     // val must be uint32-like</span></span>
<span class="line"><span>func convT64(val any) unsafe.Pointer     // val must be uint64-like</span></span>
<span class="line"><span>func convTstring(val any) unsafe.Pointer // val must be a string</span></span>
<span class="line"><span>func convTslice(val any) unsafe.Pointer  // val must be a slice</span></span></code></pre></div><p>这些函数去除了typedmemmove操作，增加了零值快速返回等特性。</p><p>同时Go建立了staticuint64s区域，对255以内的小整数值进行装箱操作时 <a href="https://github.com/golang/go/issues/17725" target="_blank" rel="noreferrer">不再分配新内存</a>，而是利用staticuint64s区域的内存空间，下面是staticuint64s的定义：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/runtime/iface.go</span></span>
<span class="line"><span>// staticuint64s is used to avoid allocating in convTx for small integer values.</span></span>
<span class="line"><span>var staticuint64s = [...]uint64{</span></span>
<span class="line"><span>    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,</span></span>
<span class="line"><span>    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,</span></span>
<span class="line"><span>	... ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天的课讲到这里就结束了，现在我们一起来回顾一下吧。</p><p>接口类型作为参与构建Go应用骨架的重要参与者，在Go语言中有着很高的地位。它这个地位的取得离不开它拥有的“动静兼备”的语法特性。Go接口的动态特性让Go拥有与动态语言相近的灵活性，而静态特性又在编译阶段保证了这种灵活性的安全。</p><p>要更好地理解Go接口的这两种特性，我们需要深入到Go接口在运行时的表示层面上去。接口类型变量在运行时表示为eface和iface，eface用于表示空接口类型变量，iface用于表示非空接口类型变量。只有两个接口类型变量的类型信息（eface._type/iface.tab._type）相同，且数据指针（eface.data/iface.data）所指数据相同时，两个接口类型变量才是相等的。</p><p>我们可以通过println输出接口类型变量的两部分指针变量的值。而且，通过拷贝runtime包eface和iface相关类型源码，我们还可以自定义输出eface/iface详尽信息的函数，不过要注意的是，由于runtime层代码的演进，这个函数可能不具备在Go版本间的移植性。</p><p>最后，接口类型变量的赋值本质上是一种装箱操作，装箱操作是由Go编译器和运行时共同完成的，有一定的性能开销，对于性能敏感的系统来说，我们应该尽量避免或减少这类装箱操作。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>像nil error值 != nil那个例子中的“坑”你在日常编码时有遇到过吗？可以和我们分享一下吗？另外，我们这节课中的这个例子如何修改，才能让它按我们最初的预期结果输出呢？</p><p>欢迎在留言区分享你的经验和想法。也欢迎你把这节课分享给更多对Go接口感兴趣的朋友。我是Tony Bai，我们下节课见。</p>`,140)])])}const g=a(i,[["render",l]]);export{f as __pageData,g as default};
