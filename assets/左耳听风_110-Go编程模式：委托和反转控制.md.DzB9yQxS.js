import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"110 | Go编程模式：委托和反转控制","description":"","frontmatter":{},"headers":[{"level":2,"title":"嵌入和委托","slug":"嵌入和委托","link":"#嵌入和委托","children":[{"level":3,"title":"结构体嵌入","slug":"结构体嵌入","link":"#结构体嵌入","children":[]},{"level":3,"title":"方法重写","slug":"方法重写","link":"#方法重写","children":[]},{"level":3,"title":"嵌入结构多态","slug":"嵌入结构多态","link":"#嵌入结构多态","children":[]}]},{"level":2,"title":"反转控制","slug":"反转控制","link":"#反转控制","children":[{"level":3,"title":"实现Undo功能","slug":"实现undo功能","link":"#实现undo功能","children":[]},{"level":3,"title":"反转依赖","slug":"反转依赖","link":"#反转依赖","children":[]}]}],"relativePath":"左耳听风/110-Go编程模式：委托和反转控制.md","filePath":"左耳听风/110-Go编程模式：委托和反转控制.md","lastUpdated":1779819815000}'),l={name:"左耳听风/110-Go编程模式：委托和反转控制.md"};function t(i,n,c,o,d,r){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_110-go编程模式-委托和反转控制" tabindex="-1">110 | Go编程模式：委托和反转控制 <a class="header-anchor" href="#_110-go编程模式-委托和反转控制" aria-label="Permalink to &quot;110 | Go编程模式：委托和反转控制&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>控制反转（ <a href="https://en.wikipedia.org/wiki/Inversion_of_control" target="_blank" rel="noreferrer">Inversion of Control</a> <a href="https://en.wikipedia.org/wiki/Inversion_of_control" target="_blank" rel="noreferrer">，loC</a> ）是一种软件设计的方法，它的主要思想是把控制逻辑与业务逻辑分开，不要在业务逻辑里写控制逻辑，因为这样会让控制逻辑依赖于业务逻辑，而是反过来，让业务逻辑依赖控制逻辑。</p><p>我之前在《 <a href="https://coolshell.cn/articles/9949.html" target="_blank" rel="noreferrer">IoC/DIP其实是一种管理思想</a>》这篇文章中，举过一个开关和电灯的例子。其实，这里的开关就是控制逻辑，电器是业务逻辑。我们不要在电器中实现开关，而是要把开关抽象成一种协议，让电器都依赖它。这样的编程方式可以有效降低程序复杂度，并提升代码重用度。</p><p>面向对象的设计模式我就不提了，我们来看看Go语言使用Embed结构的一个示例。</p><h2 id="嵌入和委托" tabindex="-1">嵌入和委托 <a class="header-anchor" href="#嵌入和委托" aria-label="Permalink to &quot;嵌入和委托&quot;">​</a></h2><h3 id="结构体嵌入" tabindex="-1">结构体嵌入 <a class="header-anchor" href="#结构体嵌入" aria-label="Permalink to &quot;结构体嵌入&quot;">​</a></h3><p>在Go语言中，我们可以很轻松地把一个结构体嵌到另一个结构体中，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Widget struct {</span></span>
<span class="line"><span>    X, Y int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>type Label struct {</span></span>
<span class="line"><span>    Widget        // Embedding (delegation)</span></span>
<span class="line"><span>    Text   string // Aggregation</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个示例中，我们把 <code>Widget</code> 嵌入到了 <code>Label</code> 中，于是，我们可以这样使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>label := Label{Widget{10, 10}, &quot;State:&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>label.X = 11</span></span>
<span class="line"><span>label.Y = 12</span></span></code></pre></div><p>如果在 <code>Label</code> 结构体里出现了重名，就需要解决重名问题，例如，如果成员 <code>X</code> 重名，我们就要用 <code>label.X</code> 表明是自己的 <code>X</code> ，用 <code>label.Wedget.X</code> 表明是嵌入过来的。</p><p>有了这样的嵌入，我们就可以像UI组件一样，在结构的设计上进行层层分解了。比如，我可以新写出两个结构体 <code>Button</code> 和 <code>ListBox</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Button struct {</span></span>
<span class="line"><span>    Label // Embedding (delegation)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type ListBox struct {</span></span>
<span class="line"><span>    Widget          // Embedding (delegation)</span></span>
<span class="line"><span>    Texts  []string // Aggregation</span></span>
<span class="line"><span>    Index  int      // Aggregation</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="方法重写" tabindex="-1">方法重写 <a class="header-anchor" href="#方法重写" aria-label="Permalink to &quot;方法重写&quot;">​</a></h3><p>然后，我们需要两个接口：用Painter把组件画出来；Clicker 用于表明点击事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Painter interface {</span></span>
<span class="line"><span>    Paint()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Clicker interface {</span></span>
<span class="line"><span>    Click()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，对于 <code>Lable</code> 来说，只有 <code>Painter</code> ，没有 <code>Clicker</code>；对于 <code>Button</code> 和 <code>ListBox</code> 来说， <code>Painter</code> 和 <code>Clicker</code> 都有。</p><p>我们来看一些实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (label Label) Paint() {</span></span>
<span class="line"><span>  fmt.Printf(&quot;%p:Label.Paint(%q)\\n&quot;, &amp;label, label.Text)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//因为这个接口可以通过 Label 的嵌入带到新的结构体，</span></span>
<span class="line"><span>//所以，可以在 Button 中重载这个接口方法</span></span>
<span class="line"><span>func (button Button) Paint() { // Override</span></span>
<span class="line"><span>    fmt.Printf(&quot;Button.Paint(%s)\\n&quot;, button.Text)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (button Button) Click() {</span></span>
<span class="line"><span>    fmt.Printf(&quot;Button.Click(%s)\\n&quot;, button.Text)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (listBox ListBox) Paint() {</span></span>
<span class="line"><span>    fmt.Printf(&quot;ListBox.Paint(%q)\\n&quot;, listBox.Texts)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (listBox ListBox) Click() {</span></span>
<span class="line"><span>    fmt.Printf(&quot;ListBox.Click(%q)\\n&quot;, listBox.Texts)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说到这儿，我要重点提醒你一下， <code>Button.Paint()</code> 接口可以通过 Label 的嵌入带到新的结构体，如果 <code>Button.Paint()</code> 不实现的话，会调用 <code>Label.Paint()</code> ，所以，在 <code>Button</code> 中声明 <code>Paint()</code> 方法，相当于Override。</p><h3 id="嵌入结构多态" tabindex="-1">嵌入结构多态 <a class="header-anchor" href="#嵌入结构多态" aria-label="Permalink to &quot;嵌入结构多态&quot;">​</a></h3><p>从下面的程序中，我们可以看到整个多态是怎么执行的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>button1 := Button{Label{Widget{10, 70}, &quot;OK&quot;}​}</span></span>
<span class="line"><span>button2 := NewButton(50, 70, &quot;Cancel&quot;)</span></span>
<span class="line"><span>listBox := ListBox{Widget{10, 40},</span></span>
<span class="line"><span>    []string{&quot;AL&quot;, &quot;AK&quot;, &quot;AZ&quot;, &quot;AR&quot;}, 0}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for _, painter := range []Painter{label, listBox, button1, button2} {</span></span>
<span class="line"><span>    painter.Paint()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for _, widget := range []interface{}{label, listBox, button1, button2} {</span></span>
<span class="line"><span>  widget.(Painter).Paint()</span></span>
<span class="line"><span>  if clicker, ok := widget.(Clicker); ok {</span></span>
<span class="line"><span>    clicker.Click()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  fmt.Println() // print a empty line</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以使用接口来多态，也可以使用泛型的 <code>interface{}</code> 来多态，但是需要有一个类型转换。</p><h2 id="反转控制" tabindex="-1">反转控制 <a class="header-anchor" href="#反转控制" aria-label="Permalink to &quot;反转控制&quot;">​</a></h2><p>我们再来看一个示例。</p><p>我们有一个存放整数的数据结构，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type IntSet struct {</span></span>
<span class="line"><span>    data map[int]bool</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func NewIntSet() IntSet {</span></span>
<span class="line"><span>    return IntSet{make(map[int]bool)}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (set *IntSet) Add(x int) {</span></span>
<span class="line"><span>    set.data[x] = true</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (set *IntSet) Delete(x int) {</span></span>
<span class="line"><span>    delete(set.data, x)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (set *IntSet) Contains(x int) bool {</span></span>
<span class="line"><span>    return set.data[x]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中实现了 <code>Add()</code> 、 <code>Delete()</code> 和 <code>Contains()</code> 三个操作，前两个是写操作，后一个是读操作。</p><h3 id="实现undo功能" tabindex="-1">实现Undo功能 <a class="header-anchor" href="#实现undo功能" aria-label="Permalink to &quot;实现Undo功能&quot;">​</a></h3><p>现在，我们想实现一个 Undo 的功能。我们可以再包装一下 <code>IntSet</code> ，变成 <code>UndoableIntSet</code> ，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type UndoableIntSet struct { // Poor style</span></span>
<span class="line"><span>    IntSet    // Embedding (delegation)</span></span>
<span class="line"><span>    functions []func()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewUndoableIntSet() UndoableIntSet {</span></span>
<span class="line"><span>    return UndoableIntSet{NewIntSet(), nil}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *UndoableIntSet) Add(x int) { // Override</span></span>
<span class="line"><span>    if !set.Contains(x) {</span></span>
<span class="line"><span>        set.data[x] = true</span></span>
<span class="line"><span>        set.functions = append(set.functions, func() { set.Delete(x) })</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        set.functions = append(set.functions, nil)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *UndoableIntSet) Delete(x int) { // Override</span></span>
<span class="line"><span>    if set.Contains(x) {</span></span>
<span class="line"><span>        delete(set.data, x)</span></span>
<span class="line"><span>        set.functions = append(set.functions, func() { set.Add(x) })</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        set.functions = append(set.functions, nil)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *UndoableIntSet) Undo() error {</span></span>
<span class="line"><span>    if len(set.functions) == 0 {</span></span>
<span class="line"><span>        return errors.New(&quot;No functions to undo&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    index := len(set.functions) - 1</span></span>
<span class="line"><span>    if function := set.functions[index]; function != nil {</span></span>
<span class="line"><span>        function()</span></span>
<span class="line"><span>        set.functions[index] = nil // For garbage collection</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    set.functions = set.functions[:index]</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我来解释下这段代码。</p><ul><li>我们在 <code>UndoableIntSet</code> 中嵌入了 <code>IntSet</code> ，然后Override了 它的 <code>Add()</code> 和 <code>Delete()</code> 方法；</li><li><code>Contains()</code> 方法没有Override，所以，就被带到 <code>UndoableInSet</code> 中来了。</li><li>在Override的 <code>Add()</code> 中，记录 <code>Delete</code> 操作；</li><li>在Override的 <code>Delete()</code> 中，记录 <code>Add</code> 操作；</li><li>在新加入的 <code>Undo()</code> 中进行Undo操作。</li></ul><p>用这样的方式为已有的代码扩展新的功能是一个很好的选择。这样，就可以在重用原有代码功能和新的功能中达到一个平衡。但是，这种方式最大的问题是，Undo操作其实是一种控制逻辑，并不是业务逻辑，所以，在复用 Undo这个功能时，是有问题的，因为其中加入了大量跟 <code>IntSet</code> 相关的业务逻辑。</p><h3 id="反转依赖" tabindex="-1">反转依赖 <a class="header-anchor" href="#反转依赖" aria-label="Permalink to &quot;反转依赖&quot;">​</a></h3><p>现在我们来看另一种方法。</p><p>我们先声明一种函数接口，表示我们的Undo控制可以接受的函数签名是什么样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Undo []func()</span></span></code></pre></div><p>有了这个协议之后，我们的Undo控制逻辑就可以写成下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (undo *Undo) Add(function func()) {</span></span>
<span class="line"><span>  *undo = append(*undo, function)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (undo *Undo) Undo() error {</span></span>
<span class="line"><span>  functions := *undo</span></span>
<span class="line"><span>  if len(functions) == 0 {</span></span>
<span class="line"><span>    return errors.New(&quot;No functions to undo&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  index := len(functions) - 1</span></span>
<span class="line"><span>  if function := functions[index]; function != nil {</span></span>
<span class="line"><span>    function()</span></span>
<span class="line"><span>    functions[index] = nil // For garbage collection</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  *undo = functions[:index]</span></span>
<span class="line"><span>  return nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到这里，你不必觉得奇怪， <code>Undo</code> 本来就是一个类型，不必是一个结构体，是一个函数数组也没有什么问题。</p><p>然后，我们在IntSet里嵌入 Undo，接着在 <code>Add()</code> 和 <code>Delete()</code> 里使用刚刚的方法，就可以完成功能了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type IntSet struct {</span></span>
<span class="line"><span>    data map[int]bool</span></span>
<span class="line"><span>    undo Undo</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewIntSet() IntSet {</span></span>
<span class="line"><span>    return IntSet{data: make(map[int]bool)}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Undo() error {</span></span>
<span class="line"><span>    return set.undo.Undo()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Contains(x int) bool {</span></span>
<span class="line"><span>    return set.data[x]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Add(x int) {</span></span>
<span class="line"><span>    if !set.Contains(x) {</span></span>
<span class="line"><span>        set.data[x] = true</span></span>
<span class="line"><span>        set.undo.Add(func() { set.Delete(x) })</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        set.undo.Add(nil)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Delete(x int) {</span></span>
<span class="line"><span>    if set.Contains(x) {</span></span>
<span class="line"><span>        delete(set.data, x)</span></span>
<span class="line"><span>        set.undo.Add(func() { set.Add(x) })</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        set.undo.Add(nil)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个就是控制反转，不是由控制逻辑 <code>Undo</code> 来依赖业务逻辑 <code>IntSet</code>，而是由业务逻辑 <code>IntSet</code> 依赖 <code>Undo</code> 。这里依赖的是其实是一个协议， <strong>这个协议是一个没有参数的函数数组。</strong> 可以看到，这样一来，我们 Undo 的代码就可以复用了。</p><p>好了，这节课就到这里。如果你觉得今天的内容对你有所帮助，欢迎你帮我分享给更多人。</p>`,47)])])}const b=s(l,[["render",t]]);export{h as __pageData,b as default};
