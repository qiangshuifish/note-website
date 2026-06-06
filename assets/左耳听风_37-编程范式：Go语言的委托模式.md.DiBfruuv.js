import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"37 | 编程范式：Go语言的委托模式","description":"","frontmatter":{},"headers":[],"relativePath":"左耳听风/37-编程范式：Go语言的委托模式.md","filePath":"左耳听风/37-编程范式：Go语言的委托模式.md","lastUpdated":1779819815000}'),l={name:"左耳听风/37-编程范式：Go语言的委托模式.md"};function t(i,n,c,o,d,r){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_37-编程范式-go语言的委托模式" tabindex="-1">37 | 编程范式：Go语言的委托模式 <a class="header-anchor" href="#_37-编程范式-go语言的委托模式" aria-label="Permalink to &quot;37 | 编程范式：Go语言的委托模式&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>我们再来看Go语言这个模式，Go语言的这个模式挺好玩儿的。声明一个struct，跟C很一样，然后直接把这个struct类型放到另一个struct里。</p><h1 id="委托的简单示例" tabindex="-1">委托的简单示例 <a class="header-anchor" href="#委托的简单示例" aria-label="Permalink to &quot;委托的简单示例&quot;">​</a></h1><p>我们来看几个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Widget struct {</span></span>
<span class="line"><span>    X, Y int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Label struct {</span></span>
<span class="line"><span>    Widget        // Embedding (delegation)</span></span>
<span class="line"><span>    Text   string // Aggregation</span></span>
<span class="line"><span>    X int         // Override</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (label Label) Paint() {</span></span>
<span class="line"><span>	// [0xc4200141e0] - Label.Paint(&quot;State&quot;)</span></span>
<span class="line"><span>    fmt.Printf(&quot;[%p] - Label.Paint(%q)\\n&quot;,</span></span>
<span class="line"><span>    	&amp;label, label.Text)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由上面可知：</p><ul><li><p>我们声明了一个 <code>Widget</code>，其有 <code>X</code> 和 <code>Y</code>；</p></li><li><p>然后用它来声明一个 <code>Label</code>，直接把 <code>Widget</code> 委托进去；</p></li><li><p>然后再给 <code>Label</code> 声明并实现了一个 <code>Paint()</code> 方法。</p></li></ul><p>于是，我们就可以这样编程了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>label := Label{Widget{10, 10}, &quot;State&quot;, 100}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// X=100, Y=10, Text=State, Widget.X=10</span></span>
<span class="line"><span>fmt.Printf(&quot;X=%d, Y=%d, Text=%s Widget.X=%d\\n&quot;,</span></span>
<span class="line"><span>	label.X, label.Y, label.Text,</span></span>
<span class="line"><span>	label.Widget.X)</span></span>
<span class="line"><span>fmt.Println()</span></span>
<span class="line"><span>// {Widget:{X:10 Y:10} Text:State X:100}</span></span>
<span class="line"><span>// {​{10 10} State 100}</span></span>
<span class="line"><span>fmt.Printf(&quot;%+v\\n%v\\n&quot;, label, label)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>label.Paint()</span></span></code></pre></div><p>我们可以看到，如果有成员变量重名，则需要手动地解决冲突。</p><p>我们继续扩展代码。</p><p>先来一个 <code>Button</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Button struct {</span></span>
<span class="line"><span>    Label // Embedding (delegation)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewButton(x, y int, text string) Button {</span></span>
<span class="line"><span>    return Button{Label{Widget{x, y}, text, x}​}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (button Button) Paint() { // Override</span></span>
<span class="line"><span>    fmt.Printf(&quot;[%p] - Button.Paint(%q)\\n&quot;,</span></span>
<span class="line"><span>    	&amp;button, button.Text)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (button Button) Click() {</span></span>
<span class="line"><span>    fmt.Printf(&quot;[%p] - Button.Click()\\n&quot;, &amp;button)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再来一个 <code>ListBox</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type ListBox struct {</span></span>
<span class="line"><span>    Widget          // Embedding (delegation)</span></span>
<span class="line"><span>    Texts  []string // Aggregation</span></span>
<span class="line"><span>    Index  int      // Aggregation</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (listBox ListBox) Paint() {</span></span>
<span class="line"><span>    fmt.Printf(&quot;[%p] - ListBox.Paint(%q)\\n&quot;,</span></span>
<span class="line"><span>    	&amp;listBox, listBox.Texts)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (listBox ListBox) Click() {</span></span>
<span class="line"><span>    fmt.Printf(&quot;[%p] - ListBox.Click()\\n&quot;, &amp;listBox)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，声明两个接口用于多态：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Painter interface {</span></span>
<span class="line"><span>    Paint()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Clicker interface {</span></span>
<span class="line"><span>    Click()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>于是我们就可以这样泛型地使用（注意其中的两个for循环）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>button1 := Button{Label{Widget{10, 70}, &quot;OK&quot;, 10}​}</span></span>
<span class="line"><span>button2 := NewButton(50, 70, &quot;Cancel&quot;)</span></span>
<span class="line"><span>listBox := ListBox{Widget{10, 40},</span></span>
<span class="line"><span>    []string{&quot;AL&quot;, &quot;AK&quot;, &quot;AZ&quot;, &quot;AR&quot;}, 0}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fmt.Println()</span></span>
<span class="line"><span>//[0xc4200142d0] - Label.Paint(&quot;State&quot;)</span></span>
<span class="line"><span>//[0xc420014300] - ListBox.Paint([&quot;AL&quot; &quot;AK&quot; &quot;AZ&quot; &quot;AR&quot;])</span></span>
<span class="line"><span>//[0xc420014330] - Button.Paint(&quot;OK&quot;)</span></span>
<span class="line"><span>//[0xc420014360] - Button.Paint(&quot;Cancel&quot;)</span></span>
<span class="line"><span>for _, painter := range []Painter{label, listBox, button1, button2} {</span></span>
<span class="line"><span>	painter.Paint()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fmt.Println()</span></span>
<span class="line"><span>//[0xc420014450] - ListBox.Click()</span></span>
<span class="line"><span>//[0xc420014480] - Button.Click()</span></span>
<span class="line"><span>//[0xc4200144b0] - Button.Click()</span></span>
<span class="line"><span>for _, widget := range []interface{}{label, listBox, button1, button2} {</span></span>
<span class="line"><span>    if clicker, ok := widget.(Clicker); ok {</span></span>
<span class="line"><span>    	clicker.Click()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h1 id="一个-undo-的委托重构" tabindex="-1">一个 Undo 的委托重构 <a class="header-anchor" href="#一个-undo-的委托重构" aria-label="Permalink to &quot;一个 Undo 的委托重构&quot;">​</a></h1><p>上面这个是 Go 语言中的委托和接口多态的编程方式，其实是面向对象和原型编程综合的玩法。这个玩法可不可以玩得更有意思呢？这是可以的。</p><p>首先，我们先声明一个数据容器，其中有 <code>Add()</code>、 <code>Delete()</code> 和 <code>Contains()</code> 方法。还有一个转字符串的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type IntSet struct {</span></span>
<span class="line"><span>    data map[int]bool</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewIntSet() IntSet {</span></span>
<span class="line"><span>    return IntSet{make(map[int]bool)}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Add(x int) {</span></span>
<span class="line"><span>    set.data[x] = true</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Delete(x int) {</span></span>
<span class="line"><span>    delete(set.data, x)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Contains(x int) bool {</span></span>
<span class="line"><span>    return set.data[x]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) String() string { // Satisfies fmt.Stringer interface</span></span>
<span class="line"><span>    if len(set.data) == 0 {</span></span>
<span class="line"><span>        return &quot;{}&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ints := make([]int, 0, len(set.data))</span></span>
<span class="line"><span>    for i := range set.data {</span></span>
<span class="line"><span>        ints = append(ints, i)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    sort.Ints(ints)</span></span>
<span class="line"><span>    parts := make([]string, 0, len(ints))</span></span>
<span class="line"><span>    for _, i := range ints {</span></span>
<span class="line"><span>        parts = append(parts, fmt.Sprint(i))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return &quot;{&quot; + strings.Join(parts, &quot;,&quot;) + &quot;}&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们如下使用这个数据容器：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ints := NewIntSet()</span></span>
<span class="line"><span>for _, i := range []int{1, 3, 5, 7} {</span></span>
<span class="line"><span>    ints.Add(i)</span></span>
<span class="line"><span>    fmt.Println(ints)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>for _, i := range []int{1, 2, 3, 4, 5, 6, 7} {</span></span>
<span class="line"><span>    fmt.Print(i, ints.Contains(i), &quot; &quot;)</span></span>
<span class="line"><span>    ints.Delete(i)</span></span>
<span class="line"><span>    fmt.Println(ints)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个数据容器平淡无奇，我们想给它加一个Undo的功能。我们可以这样来做：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type UndoableIntSet struct { // Poor style</span></span>
<span class="line"><span>    IntSet    // Embedding (delegation)</span></span>
<span class="line"><span>    functions []func()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewUndoableIntSet() UndoableIntSet {</span></span>
<span class="line"><span>    return UndoableIntSet{NewIntSet(), nil}</span></span>
<span class="line"><span>}</span></span>
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
<span class="line"><span>        set.functions[index] = nil // Free closure for garbage collection</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    set.functions = set.functions[:index]</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>于是就可以这样使用了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ints := NewUndoableIntSet()</span></span>
<span class="line"><span>for _, i := range []int{1, 3, 5, 7} {</span></span>
<span class="line"><span>    ints.Add(i)</span></span>
<span class="line"><span>    fmt.Println(ints)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>for _, i := range []int{1, 2, 3, 4, 5, 6, 7} {</span></span>
<span class="line"><span>    fmt.Println(i, ints.Contains(i), &quot; &quot;)</span></span>
<span class="line"><span>    ints.Delete(i)</span></span>
<span class="line"><span>    fmt.Println(ints)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>fmt.Println()</span></span>
<span class="line"><span>for {</span></span>
<span class="line"><span>    if err := ints.Undo(); err != nil {</span></span>
<span class="line"><span>        break</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(ints)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是，需要注意的是，我们用了一个新的 <code>UndoableIntSet</code> 几乎重写了所有的 <code>IntSet</code> 和 “写” 相关的方法，这样就可以把操作记录下来，然后 <strong>Undo</strong> 了。</p><p>但是，可能别的类也需要Undo的功能，我是不是要重写所有的需要这个功能的类啊？这样的代码类似，就是因为数据容器不一样，我就要去重写它们，这太二了。</p><p>我们能不能利用前面学到的泛型编程、函数式编程、IoC等范式来把这个事干得好一些呢？当然是可以的。</p><p>如下所示：</p><ul><li><p>我们先声明一个 <code>Undo[]</code> 的函数数组（其实是一个栈）；</p></li><li><p>并实现一个通用 <code>Add()</code>。其需要一个函数指针，并把这个函数指针存放到 <code>Undo[]</code> 函数数组中。</p></li><li><p>在 <code>Undo()</code> 的函数中，我们会遍历 <code>Undo[]</code> 函数数组，并执行之，执行完后就弹栈。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Undo []func()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (undo *Undo) Add(function func()) {</span></span>
<span class="line"><span>    *undo = append(*undo, function)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (undo *Undo) Undo() error {</span></span>
<span class="line"><span>    functions := *undo</span></span>
<span class="line"><span>    if len(functions) == 0 {</span></span>
<span class="line"><span>        return errors.New(&quot;No functions to undo&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    index := len(functions) - 1</span></span>
<span class="line"><span>    if function := functions[index]; function != nil {</span></span>
<span class="line"><span>        function()</span></span>
<span class="line"><span>        functions[index] = nil // Free closure for garbage collection</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    *undo = functions[:index]</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么我们的 <code>IntSet</code> 就可以改写成如下的形式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type IntSet struct {</span></span>
<span class="line"><span>    data map[int]bool</span></span>
<span class="line"><span>    undo Undo</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewIntSet() IntSet {</span></span>
<span class="line"><span>    return IntSet{data: make(map[int]bool)}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后在其中的 <code>Add</code> 和 <code>Delete</code> 中实现 Undo 操作。</p><ul><li><code>Add</code> 操作时加入 <code>Delete</code> 操作的 Undo。</li><li><code>Delete</code> 操作时加入 <code>Add</code> 操作的 Undo。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
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
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Undo() error {</span></span>
<span class="line"><span>    return set.undo.Undo()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (set *IntSet) Contains(x int) bool {</span></span>
<span class="line"><span>    return set.data[x]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再次看到，Go语言的Undo接口把Undo的流程给抽象出来，而要怎么Undo的事交给了业务代码来维护（通过注册一个Undo的方法）。这样在Undo的时候，就可以回调这个方法来做与业务相关的Undo操作了。</p><h1 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h1><p>这是不是和最一开始的C++的泛型编程很像？也和map、reduce、filter这样的只关心控制流程，不关心业务逻辑的做法很像？而且，一开始用一个UndoableIntSet来包装 <code>IntSet</code> 类，到反过来在 <code>IntSet</code> 里依赖 <code>Undo</code> 类，这就是控制反转IoC。</p><p>以下是《编程范式游记》系列文章的目录，方便你了解这一系列内容的全貌。</p><ul><li><a href="https://time.geekbang.org/column/article/301" target="_blank" rel="noreferrer">01 | 编程范式游记：起源</a></li><li><a href="https://time.geekbang.org/column/article/303" target="_blank" rel="noreferrer">02 | 编程范式游记：泛型编程</a></li><li><a href="https://time.geekbang.org/column/article/2017" target="_blank" rel="noreferrer">03 | 编程范式游记：类型系统和泛型的本质</a></li><li><a href="https://time.geekbang.org/column/article/2711" target="_blank" rel="noreferrer">04 | 编程范式游记：函数式编程</a></li><li><a href="https://time.geekbang.org/column/article/2723" target="_blank" rel="noreferrer">05 | 编程范式游记：修饰器模式</a></li><li><a href="https://time.geekbang.org/column/article/2729" target="_blank" rel="noreferrer">06 | 编程范式游记：面向对象编程</a></li><li><a href="https://time.geekbang.org/column/article/2741" target="_blank" rel="noreferrer">07 | 编程范式游记：基于原型的编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2748" target="_blank" rel="noreferrer">08 | 编程范式游记：Go 语言的委托模式</a></li><li><a href="https://time.geekbang.org/column/article/2751" target="_blank" rel="noreferrer">09 | 编程范式游记：编程的本质</a></li><li><a href="https://time.geekbang.org/column/article/2752" target="_blank" rel="noreferrer">10 | 编程范式游记：逻辑编程范式</a></li><li><a href="https://time.geekbang.org/column/article/2754" target="_blank" rel="noreferrer">11 | 编程范式游记：程序世界里的编程范式</a></li></ul>`,46)])])}const b=s(l,[["render",t]]);export{g as __pageData,b as default};
