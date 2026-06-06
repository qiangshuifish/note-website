import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const f=JSON.parse('{"title":"111 | Go编程模式：Map-Reduce","description":"","frontmatter":{},"headers":[{"level":2,"title":"基本示例","slug":"基本示例","link":"#基本示例","children":[{"level":3,"title":"Map示例","slug":"map示例","link":"#map示例","children":[]},{"level":3,"title":"Reduce 示例","slug":"reduce-示例","link":"#reduce-示例","children":[]},{"level":3,"title":"Filter示例","slug":"filter示例","link":"#filter示例","children":[]}]},{"level":2,"title":"业务示例","slug":"业务示例","link":"#业务示例","children":[{"level":3,"title":"员工信息","slug":"员工信息","link":"#员工信息","children":[]},{"level":3,"title":"相关的Reduce、Fitler函数","slug":"相关的reduce、fitler函数","link":"#相关的reduce、fitler函数","children":[]},{"level":3,"title":"各种自定义的统计示例","slug":"各种自定义的统计示例","link":"#各种自定义的统计示例","children":[]}]},{"level":2,"title":"泛型Map-Reduce","slug":"泛型map-reduce","link":"#泛型map-reduce","children":[{"level":3,"title":"简单版 Generic Map","slug":"简单版-generic-map","link":"#简单版-generic-map","children":[]},{"level":3,"title":"健壮版的Generic Map","slug":"健壮版的generic-map","link":"#健壮版的generic-map","children":[]},{"level":3,"title":"健壮版的 Generic Reduce","slug":"健壮版的-generic-reduce","link":"#健壮版的-generic-reduce","children":[]},{"level":3,"title":"健壮版的 Generic Filter","slug":"健壮版的-generic-filter","link":"#健壮版的-generic-filter","children":[]}]},{"level":2,"title":"后记","slug":"后记","link":"#后记","children":[]}],"relativePath":"左耳听风/111-Go编程模式：Map-Reduce.md","filePath":"左耳听风/111-Go编程模式：Map-Reduce.md","lastUpdated":1779819815000}'),l={name:"左耳听风/111-Go编程模式：Map-Reduce.md"};function i(t,n,c,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_111-go编程模式-map-reduce" tabindex="-1">111 | Go编程模式：Map-Reduce <a class="header-anchor" href="#_111-go编程模式-map-reduce" aria-label="Permalink to &quot;111 | Go编程模式：Map-Reduce&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>这节课，我们来学习一下函数式编程中非常重要的Map、Reduce、Filter这三种操作。这三种操作可以让我们轻松灵活地进行一些数据处理，毕竟，我们的程序大多数情况下都在倒腾数据。尤其是对于一些需要统计的业务场景来说，Map、Reduce、Filter是非常通用的玩法。</p><p>话不多说，我们先来看几个例子。</p><h2 id="基本示例" tabindex="-1">基本示例 <a class="header-anchor" href="#基本示例" aria-label="Permalink to &quot;基本示例&quot;">​</a></h2><h3 id="map示例" tabindex="-1">Map示例 <a class="header-anchor" href="#map示例" aria-label="Permalink to &quot;Map示例&quot;">​</a></h3><p>在下面的程序代码中，我写了两个Map函数，这两个函数需要两个参数：</p><ul><li>一个是字符串数组 <code>[]</code> <code>string</code>，说明需要处理的数据是一个字符串；</li><li>另一个是一个函数func(s string) string 或 func(s string) int。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func MapStrToStr(arr []string, fn func(s string) string) []string {</span></span>
<span class="line"><span>    var newArray = []string{}</span></span>
<span class="line"><span>    for _, it := range arr {</span></span>
<span class="line"><span>        newArray = append(newArray, fn(it))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newArray</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func MapStrToInt(arr []string, fn func(s string) int) []int {</span></span>
<span class="line"><span>    var newArray = []int{}</span></span>
<span class="line"><span>    for _, it := range arr {</span></span>
<span class="line"><span>        newArray = append(newArray, fn(it))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newArray</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>整个Map函数的运行逻辑都很相似，函数体都是在遍历第一个参数的数组，然后，调用第二个参数的函数，把它的值组合成另一个数组返回。</p><p>因此，我们就可以这样使用这两个函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var list = []string{&quot;Hao&quot;, &quot;Chen&quot;, &quot;MegaEase&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>x := MapStrToStr(list, func(s string) string {</span></span>
<span class="line"><span>    return strings.ToUpper(s)</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;%v\\n&quot;, x)</span></span>
<span class="line"><span>//[&quot;HAO&quot;, &quot;CHEN&quot;, &quot;MEGAEASE&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>y := MapStrToInt(list, func(s string) int {</span></span>
<span class="line"><span>    return len(s)</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;%v\\n&quot;, y)</span></span>
<span class="line"><span>//[3, 4, 8]</span></span></code></pre></div><p>可以看到，我们给第一个 <code>MapStrToStr()</code> 传了功能为“转大写”的函数，于是出来的数组就成了全大写的，给 <code>MapStrToInt()</code> 传的是计算长度，所以出来的数组是每个字符串的长度。</p><p>我们再来看一下Reduce和Filter的函数是什么样的。</p><h3 id="reduce-示例" tabindex="-1">Reduce 示例 <a class="header-anchor" href="#reduce-示例" aria-label="Permalink to &quot;Reduce 示例&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Reduce(arr []string, fn func(s string) int) int {</span></span>
<span class="line"><span>    sum := 0</span></span>
<span class="line"><span>    for _, it := range arr {</span></span>
<span class="line"><span>        sum += fn(it)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var list = []string{&quot;Hao&quot;, &quot;Chen&quot;, &quot;MegaEase&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>x := Reduce(list, func(s string) int {</span></span>
<span class="line"><span>    return len(s)</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;%v\\n&quot;, x)</span></span>
<span class="line"><span>// 15</span></span></code></pre></div><h3 id="filter示例" tabindex="-1">Filter示例 <a class="header-anchor" href="#filter示例" aria-label="Permalink to &quot;Filter示例&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Filter(arr []int, fn func(n int) bool) []int {</span></span>
<span class="line"><span>    var newArray = []int{}</span></span>
<span class="line"><span>    for _, it := range arr {</span></span>
<span class="line"><span>        if fn(it) {</span></span>
<span class="line"><span>            newArray = append(newArray, it)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newArray</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var intset = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}</span></span>
<span class="line"><span>out := Filter(intset, func(n int) bool {</span></span>
<span class="line"><span>   return n%2 == 1</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;%v\\n&quot;, out)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>out = Filter(intset, func(n int) bool {</span></span>
<span class="line"><span>    return n &gt; 5</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;%v\\n&quot;, out)</span></span></code></pre></div><p>为了方便你理解呢，我给你展示一张图，它形象地说明了Map-Reduce的业务语义，在数据处理中非常有用。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/332606/1506b63044071bfa5c214a725a9caf56.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%B7%A6%E8%80%B3%E5%90%AC%E9%A3%8E/images/332606/1506b63044071bfa5c214a725a9caf56.png" alt=""></a></p><h2 id="业务示例" tabindex="-1">业务示例 <a class="header-anchor" href="#业务示例" aria-label="Permalink to &quot;业务示例&quot;">​</a></h2><p>通过刚刚的一些示例，你现在应该有点明白了，Map、Reduce、Filter只是一种控制逻辑，真正的业务逻辑是以传给它们的数据和函数来定义的。</p><p>是的，这是一个很经典的“业务逻辑”和“控制逻辑”分离解耦的编程模式。</p><p>接下来，我们来看一个有业务意义的代码，来进一步帮助你理解什么叫“控制逻辑”与“业务逻辑”分离。</p><h3 id="员工信息" tabindex="-1">员工信息 <a class="header-anchor" href="#员工信息" aria-label="Permalink to &quot;员工信息&quot;">​</a></h3><p>首先，我们有一个员工对象和一些数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Employee struct {</span></span>
<span class="line"><span>    Name     string</span></span>
<span class="line"><span>    Age      int</span></span>
<span class="line"><span>    Vacation int</span></span>
<span class="line"><span>    Salary   int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var list = []Employee{</span></span>
<span class="line"><span>    {&quot;Hao&quot;, 44, 0, 8000},</span></span>
<span class="line"><span>    {&quot;Bob&quot;, 34, 10, 5000},</span></span>
<span class="line"><span>    {&quot;Alice&quot;, 23, 5, 9000},</span></span>
<span class="line"><span>    {&quot;Jack&quot;, 26, 0, 4000},</span></span>
<span class="line"><span>    {&quot;Tom&quot;, 48, 9, 7500},</span></span>
<span class="line"><span>    {&quot;Marry&quot;, 29, 0, 6000},</span></span>
<span class="line"><span>    {&quot;Mike&quot;, 32, 8, 4000},</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="相关的reduce、fitler函数" tabindex="-1">相关的Reduce、Fitler函数 <a class="header-anchor" href="#相关的reduce、fitler函数" aria-label="Permalink to &quot;相关的Reduce、Fitler函数&quot;">​</a></h3><p>然后，我们有下面的几个函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func EmployeeCountIf(list []Employee, fn func(e *Employee) bool) int {</span></span>
<span class="line"><span>    count := 0</span></span>
<span class="line"><span>    for i, _ := range list {</span></span>
<span class="line"><span>        if fn(&amp;list[i]) {</span></span>
<span class="line"><span>            count += 1</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return count</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func EmployeeFilterIn(list []Employee, fn func(e *Employee) bool) []Employee {</span></span>
<span class="line"><span>    var newList []Employee</span></span>
<span class="line"><span>    for i, _ := range list {</span></span>
<span class="line"><span>        if fn(&amp;list[i]) {</span></span>
<span class="line"><span>            newList = append(newList, list[i])</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newList</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func EmployeeSumIf(list []Employee, fn func(e *Employee) int) int {</span></span>
<span class="line"><span>    var sum = 0</span></span>
<span class="line"><span>    for i, _ := range list {</span></span>
<span class="line"><span>        sum += fn(&amp;list[i])</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sum</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>简单说明一下：</p><ul><li><code>EmployeeConutIf</code> 和 <code>EmployeeSumIf</code> 分别用于统计满足某个条件的个数或总数。它们都是Filter + Reduce的语义。</li><li><code>EmployeeFilterIn</code> 就是按某种条件过滤，就是Fitler的语义。</li></ul><h3 id="各种自定义的统计示例" tabindex="-1">各种自定义的统计示例 <a class="header-anchor" href="#各种自定义的统计示例" aria-label="Permalink to &quot;各种自定义的统计示例&quot;">​</a></h3><p>于是，我们就可以有接下来的代码了。</p><p><strong>1.统计有多少员工大于40岁</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>old := EmployeeCountIf(list, func(e *Employee) bool {</span></span>
<span class="line"><span>    return e.Age &gt; 40</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;old people: %d\\n&quot;, old)</span></span>
<span class="line"><span>//old people: 2</span></span></code></pre></div><p><strong>2.统计有多少员工的薪水大于6000</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>high_pay := EmployeeCountIf(list, func(e *Employee) bool {</span></span>
<span class="line"><span>    return e.Salary &gt; 6000</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;High Salary people: %d\\n&quot;, high_pay)</span></span>
<span class="line"><span>//High Salary people: 4</span></span></code></pre></div><p><strong>3.列出有没有休假的员工</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>no_vacation := EmployeeFilterIn(list, func(e *Employee) bool {</span></span>
<span class="line"><span>    return e.Vacation == 0</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>fmt.Printf(&quot;People no vacation: %v\\n&quot;, no_vacation)</span></span>
<span class="line"><span>//People no vacation: [{Hao 44 0 8000} {Jack 26 0 4000} {Marry 29 0 6000}]</span></span></code></pre></div><p><strong>4.统计所有员工的薪资总和</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>total_pay := EmployeeSumIf(list, func(e *Employee) int {</span></span>
<span class="line"><span>    return e.Salary</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fmt.Printf(&quot;Total Salary: %d\\n&quot;, total_pay)</span></span>
<span class="line"><span>//Total Salary: 43500</span></span></code></pre></div><p><strong>5.统计30岁以下员工的薪资总和</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>younger_pay := EmployeeSumIf(list, func(e *Employee) int {</span></span>
<span class="line"><span>    if e.Age &lt; 30 {</span></span>
<span class="line"><span>        return e.Salary</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0</span></span>
<span class="line"><span>})</span></span></code></pre></div><h2 id="泛型map-reduce" tabindex="-1">泛型Map-Reduce <a class="header-anchor" href="#泛型map-reduce" aria-label="Permalink to &quot;泛型Map-Reduce&quot;">​</a></h2><p>刚刚的Map-Reduce都因为要处理数据的类型不同，而需要写出不同版本的Map-Reduce，虽然它们的代码看上去是很类似的。所以，这里就要提到泛型编程了。</p><h3 id="简单版-generic-map" tabindex="-1">简单版 Generic Map <a class="header-anchor" href="#简单版-generic-map" aria-label="Permalink to &quot;简单版 Generic Map&quot;">​</a></h3><p>我在写这节课的时候，Go语言还不支持泛型（注：Go开发团队技术负责人Russ Cox在2012年11月21golang-dev上的mail确认了Go泛型将在Go 1.18版本落地，时间是2022年2月）。所以，目前的Go语言的泛型只能用 <code>interface{}</code> + <code>reflect</code> 来完成。 <code>interface{}</code> 可以理解为C中的 <code>void*</code>、Java中的 <code>Object</code> ， <code>reflect</code> 是Go的反射机制包，作用是在运行时检查类型。</p><p>下面，我们来看一下，一个非常简单的、不做任何类型检查的泛型的Map函数怎么写。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Map(data interface{}, fn interface{}) []interface{} {</span></span>
<span class="line"><span>    vfn := reflect.ValueOf(fn)</span></span>
<span class="line"><span>    vdata := reflect.ValueOf(data)</span></span>
<span class="line"><span>    result := make([]interface{}, vdata.Len())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for i := 0; i &lt; vdata.Len(); i++ {</span></span>
<span class="line"><span>        result[i] = vfn.Call([]reflect.Value{vdata.Index(i)})[0].Interface()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我来简单解释下这段代码。</p><ul><li>首先，我们通过 <code>reflect.ValueOf()</code> 获得 <code>interface{}</code> 的值，其中一个是数据 <code>vdata</code>，另一个是函数 <code>vfn</code>。</li><li>然后，通过 <code>vfn.Call()</code> 方法调用函数，通过 <code>[]refelct.Value{vdata.Index(i)}</code> 获得数据。</li></ul><p>Go语言中的反射的语法有点令人费解，不过，简单看一下手册，还是能够读懂的。反射不是这节课的重点，我就不讲了。如果你还不太懂这些基础知识，课下可以学习下相关的教程。</p><p>于是，我们就可以有下面的代码——不同类型的数据可以使用相同逻辑的 <code>Map()</code> 代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>square := func(x int) int {</span></span>
<span class="line"><span>  return x * x</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>nums := []int{1, 2, 3, 4}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>squared_arr := Map(nums,square)</span></span>
<span class="line"><span>fmt.Println(squared_arr)</span></span>
<span class="line"><span>//[1 4 9 16]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>upcase := func(s string) string {</span></span>
<span class="line"><span>  return strings.ToUpper(s)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>strs := []string{&quot;Hao&quot;, &quot;Chen&quot;, &quot;MegaEase&quot;}</span></span>
<span class="line"><span>upstrs := Map(strs, upcase);</span></span>
<span class="line"><span>fmt.Println(upstrs)</span></span>
<span class="line"><span>//[HAO CHEN MEGAEASE]</span></span></code></pre></div><p>但是，因为反射是运行时的事，所以，如果类型出问题的话，就会有运行时的错误。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>x := Map(5, 5)</span></span>
<span class="line"><span>fmt.Println(x)</span></span></code></pre></div><p>代码可以很轻松地编译通过，但是在运行时却出问题了，而且还是panic错误……</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>panic: reflect: call of reflect.Value.Len on int Value</span></span>
<span class="line"><span></span></span>
<span class="line"><span>goroutine 1 [running]:</span></span>
<span class="line"><span>reflect.Value.Len(0x10b5240, 0x10eeb58, 0x82, 0x10716bc)</span></span>
<span class="line"><span>        /usr/local/Cellar/go/1.15.3/libexec/src/reflect/value.go:1162 +0x185</span></span>
<span class="line"><span>main.Map(0x10b5240, 0x10eeb58, 0x10b5240, 0x10eeb60, 0x1, 0x14, 0x0)</span></span>
<span class="line"><span>        /Users/chenhao/.../map.go:12 +0x16b</span></span>
<span class="line"><span>main.main()</span></span>
<span class="line"><span>        /Users/chenhao/.../map.go:42 +0x465</span></span>
<span class="line"><span>exit status 2</span></span></code></pre></div><h3 id="健壮版的generic-map" tabindex="-1">健壮版的Generic Map <a class="header-anchor" href="#健壮版的generic-map" aria-label="Permalink to &quot;健壮版的Generic Map&quot;">​</a></h3><p>所以，如果要写一个健壮的程序，对于这种用 <code>interface{}</code> 的“过度泛型”，就需要我们自己来做类型检查。来看一个有类型检查的Map代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Transform(slice, function interface{}) interface{} {</span></span>
<span class="line"><span>  return transform(slice, function, false)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func TransformInPlace(slice, function interface{}) interface{} {</span></span>
<span class="line"><span>  return transform(slice, function, true)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func transform(slice, function interface{}, inPlace bool) interface{} {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //check the \`slice\` type is Slice</span></span>
<span class="line"><span>  sliceInType := reflect.ValueOf(slice)</span></span>
<span class="line"><span>  if sliceInType.Kind() != reflect.Slice {</span></span>
<span class="line"><span>    panic(&quot;transform: not slice&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //check the function signature</span></span>
<span class="line"><span>  fn := reflect.ValueOf(function)</span></span>
<span class="line"><span>  elemType := sliceInType.Type().Elem()</span></span>
<span class="line"><span>  if !verifyFuncSignature(fn, elemType, nil) {</span></span>
<span class="line"><span>    panic(&quot;trasform: function must be of type func(&quot; + sliceInType.Type().Elem().String() + &quot;) outputElemType&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  sliceOutType := sliceInType</span></span>
<span class="line"><span>  if !inPlace {</span></span>
<span class="line"><span>    sliceOutType = reflect.MakeSlice(reflect.SliceOf(fn.Type().Out(0)), sliceInType.Len(), sliceInType.Len())</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for i := 0; i &lt; sliceInType.Len(); i++ {</span></span>
<span class="line"><span>    sliceOutType.Index(i).Set(fn.Call([]reflect.Value{sliceInType.Index(i)})[0])</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sliceOutType.Interface()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func verifyFuncSignature(fn reflect.Value, types ...reflect.Type) bool {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //Check it is a funciton</span></span>
<span class="line"><span>  if fn.Kind() != reflect.Func {</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // NumIn() - returns a function type&#39;s input parameter count.</span></span>
<span class="line"><span>  // NumOut() - returns a function type&#39;s output parameter count.</span></span>
<span class="line"><span>  if (fn.Type().NumIn() != len(types)-1) || (fn.Type().NumOut() != 1) {</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // In() - returns the type of a function type&#39;s i&#39;th input parameter.</span></span>
<span class="line"><span>  for i := 0; i &lt; len(types)-1; i++ {</span></span>
<span class="line"><span>    if fn.Type().In(i) != types[i] {</span></span>
<span class="line"><span>      return false</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // Out() - returns the type of a function type&#39;s i&#39;th output parameter.</span></span>
<span class="line"><span>  outType := types[len(types)-1]</span></span>
<span class="line"><span>  if outType != nil &amp;&amp; fn.Type().Out(0) != outType {</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return true</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码一下子就复杂起来了，可见，复杂的代码都是在处理异常的地方。我不打算Walk through 所有的代码，别看代码多，还是可以读懂的。</p><p>我来列一下代码中的几个要点。</p><ol><li>代码中没有使用Map函数，因为和数据结构有含义冲突的问题，所以使用 <code>Transform</code>，这个来源于 C++ STL库中的命名。</li><li>有两个版本的函数，一个是返回一个全新的数组 <code>Transform()</code>，一个是“就地完成” <code>TransformInPlace()</code>。</li><li>在主函数中，用 <code>Kind()</code> 方法检查了数据类型是不是 Slice，函数类型是不是Func。</li><li>检查函数的参数和返回类型是通过 <code>verifyFuncSignature()</code> 来完成的： <code>NumIn()</code> 用来检查函数的“入参”； <code>NumOut()</code> ：用来检查函数的“返回值”。</li><li>如果需要新生成一个Slice，会使用 <code>reflect.MakeSlice()</code> 来完成。</li></ol><p>好了，有了这段代码，我们的代码就很可以很开心地使用了：</p><p>1.可以用于字符串数组：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>list := []string{&quot;1&quot;, &quot;2&quot;, &quot;3&quot;, &quot;4&quot;, &quot;5&quot;, &quot;6&quot;}</span></span>
<span class="line"><span>result := Transform(list, func(a string) string{</span></span>
<span class="line"><span>    return a +a +a</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>//{&quot;111&quot;,&quot;222&quot;,&quot;333&quot;,&quot;444&quot;,&quot;555&quot;,&quot;666&quot;}</span></span></code></pre></div><p>2.可以用于整形数组：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>list := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}</span></span>
<span class="line"><span>TransformInPlace(list, func (a int) int {</span></span>
<span class="line"><span>  return a*3</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>//{3, 6, 9, 12, 15, 18, 21, 24, 27}</span></span></code></pre></div><p>3.可以用于结构体：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var list = []Employee{</span></span>
<span class="line"><span>    {&quot;Hao&quot;, 44, 0, 8000},</span></span>
<span class="line"><span>    {&quot;Bob&quot;, 34, 10, 5000},</span></span>
<span class="line"><span>    {&quot;Alice&quot;, 23, 5, 9000},</span></span>
<span class="line"><span>    {&quot;Jack&quot;, 26, 0, 4000},</span></span>
<span class="line"><span>    {&quot;Tom&quot;, 48, 9, 7500},</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>result := TransformInPlace(list, func(e Employee) Employee {</span></span>
<span class="line"><span>    e.Salary += 1000</span></span>
<span class="line"><span>    e.Age += 1</span></span>
<span class="line"><span>    return e</span></span>
<span class="line"><span>})</span></span></code></pre></div><h3 id="健壮版的-generic-reduce" tabindex="-1">健壮版的 Generic Reduce <a class="header-anchor" href="#健壮版的-generic-reduce" aria-label="Permalink to &quot;健壮版的 Generic Reduce&quot;">​</a></h3><p>同样，泛型版的 Reduce 代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Reduce(slice, pairFunc, zero interface{}) interface{} {</span></span>
<span class="line"><span>  sliceInType := reflect.ValueOf(slice)</span></span>
<span class="line"><span>  if sliceInType.Kind() != reflect.Slice {</span></span>
<span class="line"><span>    panic(&quot;reduce: wrong type, not slice&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  len := sliceInType.Len()</span></span>
<span class="line"><span>  if len == 0 {</span></span>
<span class="line"><span>    return zero</span></span>
<span class="line"><span>  } else if len == 1 {</span></span>
<span class="line"><span>    return sliceInType.Index(0)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  elemType := sliceInType.Type().Elem()</span></span>
<span class="line"><span>  fn := reflect.ValueOf(pairFunc)</span></span>
<span class="line"><span>  if !verifyFuncSignature(fn, elemType, elemType, elemType) {</span></span>
<span class="line"><span>    t := elemType.String()</span></span>
<span class="line"><span>    panic(&quot;reduce: function must be of type func(&quot; + t + &quot;, &quot; + t + &quot;) &quot; + t)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  var ins [2]reflect.Value</span></span>
<span class="line"><span>  ins[0] = sliceInType.Index(0)</span></span>
<span class="line"><span>  ins[1] = sliceInType.Index(1)</span></span>
<span class="line"><span>  out := fn.Call(ins[:])[0]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for i := 2; i &lt; len; i++ {</span></span>
<span class="line"><span>    ins[0] = out</span></span>
<span class="line"><span>    ins[1] = sliceInType.Index(i)</span></span>
<span class="line"><span>    out = fn.Call(ins[:])[0]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return out.Interface()</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="健壮版的-generic-filter" tabindex="-1">健壮版的 Generic Filter <a class="header-anchor" href="#健壮版的-generic-filter" aria-label="Permalink to &quot;健壮版的 Generic Filter&quot;">​</a></h3><p>同样，泛型版的 Filter 代码如下（同样分是否“就地计算”的两个版本）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Filter(slice, function interface{}) interface{} {</span></span>
<span class="line"><span>  result, _ := filter(slice, function, false)</span></span>
<span class="line"><span>  return result</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func FilterInPlace(slicePtr, function interface{}) {</span></span>
<span class="line"><span>  in := reflect.ValueOf(slicePtr)</span></span>
<span class="line"><span>  if in.Kind() != reflect.Ptr {</span></span>
<span class="line"><span>    panic(&quot;FilterInPlace: wrong type, &quot; +</span></span>
<span class="line"><span>      &quot;not a pointer to slice&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  _, n := filter(in.Elem().Interface(), function, true)</span></span>
<span class="line"><span>  in.Elem().SetLen(n)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var boolType = reflect.ValueOf(true).Type()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func filter(slice, function interface{}, inPlace bool) (interface{}, int) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  sliceInType := reflect.ValueOf(slice)</span></span>
<span class="line"><span>  if sliceInType.Kind() != reflect.Slice {</span></span>
<span class="line"><span>    panic(&quot;filter: wrong type, not a slice&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  fn := reflect.ValueOf(function)</span></span>
<span class="line"><span>  elemType := sliceInType.Type().Elem()</span></span>
<span class="line"><span>  if !verifyFuncSignature(fn, elemType, boolType) {</span></span>
<span class="line"><span>    panic(&quot;filter: function must be of type func(&quot; + elemType.String() + &quot;) bool&quot;)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  var which []int</span></span>
<span class="line"><span>  for i := 0; i &lt; sliceInType.Len(); i++ {</span></span>
<span class="line"><span>    if fn.Call([]reflect.Value{sliceInType.Index(i)})[0].Bool() {</span></span>
<span class="line"><span>      which = append(which, i)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  out := sliceInType</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if !inPlace {</span></span>
<span class="line"><span>    out = reflect.MakeSlice(sliceInType.Type(), len(which), len(which))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for i := range which {</span></span>
<span class="line"><span>    out.Index(i).Set(sliceInType.Index(which[i]))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return out.Interface(), len(which)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="后记" tabindex="-1">后记 <a class="header-anchor" href="#后记" aria-label="Permalink to &quot;后记&quot;">​</a></h2><p>最后，还有几个未尽事宜：</p><ol><li>使用反射来做这些东西会有一个问题， <strong>那就是代码的性能会很差。所以，上面的代码不能用在需要高性能的地方</strong>。怎么解决这个问题，我会在下节课给你介绍下。</li><li>这节课中的代码大量地参考了 Rob Pike的版本，你可以点击这个链接查看： <a href="https://github.com/robpike/filter" target="_blank" rel="noreferrer">https://github.com/robpike/filter</a>。</li><li>其实，在全世界范围内，有大量的程序员都在问Go语言官方什么时候在标准库中支持 Map、Reduce。Rob Pike说，这种东西难写吗？还要我们官方来帮你们写吗？这种代码我多少年前就写过了，但是，我一次都没有用过，我还是喜欢用“For循环”，我觉得你最好也跟我一起用 “For循环”。</li></ol><p>我个人觉得，Map、Reduce在数据处理的时候还是很有用的，Rob Pike可能平时也不怎么写“业务逻辑”的代码，所以，他可能也不太了解业务的变化有多么频繁……</p><p>当然，好还是不好，由你来判断，但多学一些编程模式，一定是对自己很有帮助的。</p><p>好了，这节课就到这里。如果你觉得今天的内容对你有所帮助，欢迎你帮我分享给更多人。</p>`,84)])])}const h=s(l,[["render",i]]);export{f as __pageData,h as default};
