import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"115 | Go编程模式：Kubernetes Visitor模式","description":"","frontmatter":{},"headers":[{"level":2,"title":"一个简单示例","slug":"一个简单示例","link":"#一个简单示例","children":[]},{"level":2,"title":"Kubernetes相关背景","slug":"kubernetes相关背景","link":"#kubernetes相关背景","children":[]},{"level":2,"title":"kubectl的实现方法","slug":"kubectl的实现方法","link":"#kubectl的实现方法","children":[{"level":3,"title":"Visitor模式定义","slug":"visitor模式定义","link":"#visitor模式定义","children":[]},{"level":3,"title":"Name Visitor","slug":"name-visitor","link":"#name-visitor","children":[]},{"level":3,"title":"Other Visitor","slug":"other-visitor","link":"#other-visitor","children":[]},{"level":3,"title":"Log Visitor","slug":"log-visitor","link":"#log-visitor","children":[]},{"level":3,"title":"使用方代码","slug":"使用方代码","link":"#使用方代码","children":[]},{"level":3,"title":"Visitor修饰器","slug":"visitor修饰器","link":"#visitor修饰器","children":[]}]}],"relativePath":"左耳听风/115-Go编程模式：KubernetesVisitor模式.md","filePath":"左耳听风/115-Go编程模式：KubernetesVisitor模式.md","lastUpdated":1779819815000}'),i={name:"左耳听风/115-Go编程模式：KubernetesVisitor模式.md"};function l(t,s,r,o,c,d){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_115-go编程模式-kubernetes-visitor模式" tabindex="-1">115 | Go编程模式：Kubernetes Visitor模式 <a class="header-anchor" href="#_115-go编程模式-kubernetes-visitor模式" aria-label="Permalink to &quot;115 | Go编程模式：Kubernetes Visitor模式&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>这节课，我们来重点讨论一下，Kubernetes 的 <code>kubectl</code> 命令中的使用到的一个编程模式：Visitor（其实， <code>kubectl</code> 主要使用到了两个，一个是Builder，另一个是Visitor）。</p><p>本来，Visitor 是面向对象设计模式中一个很重要的设计模式（可以看下Wikipedia <a href="https://en.wikipedia.org/wiki/Visitor_pattern" target="_blank" rel="noreferrer">Visitor Pattern词条</a>），这个模式是将算法与操作对象的结构分离的一种方法。这种分离的实际结果是能够在不修改结构的情况下向现有对象结构添加新操作，是遵循开放/封闭原则的一种方法。这节课，我们重点学习一下 <code>kubelet</code> 中是怎么使用函数式的方法来实现这个模式的。</p><h2 id="一个简单示例" tabindex="-1">一个简单示例 <a class="header-anchor" href="#一个简单示例" aria-label="Permalink to &quot;一个简单示例&quot;">​</a></h2><p>首先，我们来看一个简单设计模式的Visitor的示例。</p><ul><li>我们的代码中有一个 <code>Visitor</code> 的函数定义，还有一个 <code>Shape</code> 接口，这需要使用 <code>Visitor</code> 函数作为参数。</li><li>我们的实例的对象 <code>Circle</code> 和 <code>Rectangle</code> 实现了 <code>Shape</code> 接口的 <code>accept()</code> 方法，这个方法就是等外面给我们传递一个Visitor。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;encoding/json&quot;</span></span>
<span class="line"><span>    &quot;encoding/xml&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Visitor func(shape Shape)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Shape interface {</span></span>
<span class="line"><span>    accept(Visitor)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Circle struct {</span></span>
<span class="line"><span>    Radius int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (c Circle) accept(v Visitor) {</span></span>
<span class="line"><span>    v(c)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Rectangle struct {</span></span>
<span class="line"><span>    Width, Heigh int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (r Rectangle) accept(v Visitor) {</span></span>
<span class="line"><span>    v(r)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们实现两个Visitor：一个是用来做JSON序列化的；另一个是用来做XML序列化的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func JsonVisitor(shape Shape) {</span></span>
<span class="line"><span>    bytes, err := json.Marshal(shape)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        panic(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(string(bytes))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func XmlVisitor(shape Shape) {</span></span>
<span class="line"><span>    bytes, err := xml.Marshal(shape)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        panic(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(string(bytes))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是使用Visitor这个模式的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>  c := Circle{10}</span></span>
<span class="line"><span>  r :=  Rectangle{100, 200}</span></span>
<span class="line"><span>  shapes := []Shape{c, r}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for _, s := range shapes {</span></span>
<span class="line"><span>    s.accept(JsonVisitor)</span></span>
<span class="line"><span>    s.accept(XmlVisitor)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实，这段代码的目的就是想解耦数据结构和算法。虽然使用 Strategy 模式也是可以完成的，而且会比较干净， <strong>但是在有些情况下，多个Visitor是来访问一个数据结构的不同部分，这种情况下，数据结构有点像一个数据库，而各个Visitor会成为一个个的小应用。</strong> <code>kubectl</code> 就是这种情况。</p><h2 id="kubernetes相关背景" tabindex="-1">Kubernetes相关背景 <a class="header-anchor" href="#kubernetes相关背景" aria-label="Permalink to &quot;Kubernetes相关背景&quot;">​</a></h2><p>接下来，我们再来了解一下相关的知识背景。</p><ul><li>Kubernetes抽象了很多种的Resource，比如Pod、ReplicaSet、ConfigMap、Volumes、Namespace、Roles……种类非常繁多，这些东西构成了Kubernetes的数据模型（你可以看看 <a href="https://github.com/kubernauts/practical-kubernetes-problems/blob/master/images/k8s-resources-map.png" target="_blank" rel="noreferrer">Kubernetes Resources 地图</a> ，了解下有多复杂）。</li><li><code>kubectl</code> 是Kubernetes中的一个客户端命令，操作人员用这个命令来操作Kubernetes。 <code>kubectl</code> 会联系到 Kubernetes 的API Server，API Server会联系每个节点上的 <code>kubelet</code> ，从而控制每个节点。</li><li><code>kubectl</code> 的主要工作是处理用户提交的东西（包括命令行参数、YAML文件等），接着会把用户提交的这些东西组织成一个数据结构体，发送给 API Server。</li><li>相关的源代码在 <code>src/k8s.io/cli-runtime/pkg/resource/visitor.go</code> 中（ <a href="https://github.com/kubernetes/kubernetes/blob/cea1d4e20b4a7886d8ff65f34c6d4f95efcb4742/staging/src/k8s.io/cli-runtime/pkg/resource/visitor.go" target="_blank" rel="noreferrer">源码链接</a>）。</li></ul><p><code>kubectl</code> 的代码比较复杂，不过，简单来说，基本原理就是 <strong>它从命令行和YAML文件中获取信息，通过Builder模式并把其转成一系列的资源，最后用 Visitor 模式来迭代处理这些Reources</strong>。</p><p>下面我们来看看 <code>kubectl</code> 的实现。为了简化，我不直接分析复杂的源码，而是用一个小的示例来表明 。</p><h2 id="kubectl的实现方法" tabindex="-1">kubectl的实现方法 <a class="header-anchor" href="#kubectl的实现方法" aria-label="Permalink to &quot;kubectl的实现方法&quot;">​</a></h2><h3 id="visitor模式定义" tabindex="-1">Visitor模式定义 <a class="header-anchor" href="#visitor模式定义" aria-label="Permalink to &quot;Visitor模式定义&quot;">​</a></h3><p>首先， <code>kubectl</code> 主要是用来处理 <code>Info</code> 结构体，下面是相关的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type VisitorFunc func(*Info, error) error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Visitor interface {</span></span>
<span class="line"><span>    Visit(VisitorFunc) error</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Info struct {</span></span>
<span class="line"><span>    Namespace   string</span></span>
<span class="line"><span>    Name        string</span></span>
<span class="line"><span>    OtherThings string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (info *Info) Visit(fn VisitorFunc) error {</span></span>
<span class="line"><span>  return fn(info, nil)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，</p><ul><li>有一个 <code>VisitorFunc</code> 的函数类型的定义；</li><li>一个 <code>Visitor</code> 的接口，其中需要 <code>Visit(VisitorFunc) error</code> 的方法（这就像是我们上面那个例子的 <code>Shape</code> ）；</li><li>最后，为 <code>Info</code> 实现 <code>Visitor</code> 接口中的 <code>Visit()</code> 方法，实现就是直接调用传进来的方法（与前面的例子相仿）。</li></ul><p>我们再来定义几种不同类型的 Visitor。</p><h3 id="name-visitor" tabindex="-1">Name Visitor <a class="header-anchor" href="#name-visitor" aria-label="Permalink to &quot;Name Visitor&quot;">​</a></h3><p>这个Visitor 主要是用来访问 <code>Info</code> 结构中的 <code>Name</code> 和 <code>NameSpace</code> 成员：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type NameVisitor struct {</span></span>
<span class="line"><span>  visitor Visitor</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (v NameVisitor) Visit(fn VisitorFunc) error {</span></span>
<span class="line"><span>  return v.visitor.Visit(func(info *Info, err error) error {</span></span>
<span class="line"><span>    fmt.Println(&quot;NameVisitor() before call function&quot;)</span></span>
<span class="line"><span>    err = fn(info, err)</span></span>
<span class="line"><span>    if err == nil {</span></span>
<span class="line"><span>      fmt.Printf(&quot;==&gt; Name=%s, NameSpace=%s\\n&quot;, info.Name, info.Namespace)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(&quot;NameVisitor() after call function&quot;)</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，在这段代码中：</p><ul><li>声明了一个 <code>NameVisitor</code> 的结构体，这个结构体里有一个 <code>Visitor</code> 接口成员，这里意味着多态；</li><li>在实现 <code>Visit()</code> 方法时，调用了自己结构体内的那个 <code>Visitor</code> 的 <code>Visitor()</code> 方法，这其实是一种修饰器的模式，用另一个Visitor修饰了自己（关于修饰器模式，可以复习下 <a href="https://time.geekbang.org/column/article/332608" target="_blank" rel="noreferrer">第113讲</a>）。</li></ul><h3 id="other-visitor" tabindex="-1">Other Visitor <a class="header-anchor" href="#other-visitor" aria-label="Permalink to &quot;Other Visitor&quot;">​</a></h3><p>这个Visitor主要用来访问 <code>Info</code> 结构中的 <code>OtherThings</code> 成员：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type OtherThingsVisitor struct {</span></span>
<span class="line"><span>  visitor Visitor</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (v OtherThingsVisitor) Visit(fn VisitorFunc) error {</span></span>
<span class="line"><span>  return v.visitor.Visit(func(info *Info, err error) error {</span></span>
<span class="line"><span>    fmt.Println(&quot;OtherThingsVisitor() before call function&quot;)</span></span>
<span class="line"><span>    err = fn(info, err)</span></span>
<span class="line"><span>    if err == nil {</span></span>
<span class="line"><span>      fmt.Printf(&quot;==&gt; OtherThings=%s\\n&quot;, info.OtherThings)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(&quot;OtherThingsVisitor() after call function&quot;)</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现逻辑同上，我就不再重新讲了。</p><h3 id="log-visitor" tabindex="-1">Log Visitor <a class="header-anchor" href="#log-visitor" aria-label="Permalink to &quot;Log Visitor&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type LogVisitor struct {</span></span>
<span class="line"><span>  visitor Visitor</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (v LogVisitor) Visit(fn VisitorFunc) error {</span></span>
<span class="line"><span>  return v.visitor.Visit(func(info *Info, err error) error {</span></span>
<span class="line"><span>    fmt.Println(&quot;LogVisitor() before call function&quot;)</span></span>
<span class="line"><span>    err = fn(info, err)</span></span>
<span class="line"><span>    fmt.Println(&quot;LogVisitor() after call function&quot;)</span></span>
<span class="line"><span>    return err</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="使用方代码" tabindex="-1">使用方代码 <a class="header-anchor" href="#使用方代码" aria-label="Permalink to &quot;使用方代码&quot;">​</a></h3><p>现在，我们看看使用上面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>  info := Info{}</span></span>
<span class="line"><span>  var v Visitor = &amp;info</span></span>
<span class="line"><span>  v = LogVisitor{v}</span></span>
<span class="line"><span>  v = NameVisitor{v}</span></span>
<span class="line"><span>  v = OtherThingsVisitor{v}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  loadFile := func(info *Info, err error) error {</span></span>
<span class="line"><span>    info.Name = &quot;Hao Chen&quot;</span></span>
<span class="line"><span>    info.Namespace = &quot;MegaEase&quot;</span></span>
<span class="line"><span>    info.OtherThings = &quot;We are running as remote team.&quot;</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  v.Visit(loadFile)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，</p><ul><li>Visitor们一层套一层；</li><li>我用 <code>loadFile</code> 假装从文件中读取数据；</li><li>最后执行 <code>v.Visit(loadfile)</code> ，这样，我们上面的代码就全部开始激活工作了。</li></ul><p>这段代码输出如下的信息，你可以看到代码是怎么执行起来的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LogVisitor() before call function</span></span>
<span class="line"><span>NameVisitor() before call function</span></span>
<span class="line"><span>OtherThingsVisitor() before call function</span></span>
<span class="line"><span>==&gt; OtherThings=We are running as remote team.</span></span>
<span class="line"><span>OtherThingsVisitor() after call function</span></span>
<span class="line"><span>==&gt; Name=Hao Chen, NameSpace=MegaEase</span></span>
<span class="line"><span>NameVisitor() after call function</span></span>
<span class="line"><span>LogVisitor() after call function</span></span></code></pre></div><p>上面的代码有以下几种功效：</p><ul><li>解耦了数据和程序；</li><li>使用了修饰器模式；</li><li>还做出了Pipeline的模式。</li></ul><p>所以，其实我们可以重构一下上面的代码。</p><h3 id="visitor修饰器" tabindex="-1">Visitor修饰器 <a class="header-anchor" href="#visitor修饰器" aria-label="Permalink to &quot;Visitor修饰器&quot;">​</a></h3><p>我们用 <a href="https://coolshell.cn/articles/17929.html" target="_blank" rel="noreferrer">修饰器模式</a> 来重构一下上面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type DecoratedVisitor struct {</span></span>
<span class="line"><span>  visitor    Visitor</span></span>
<span class="line"><span>  decorators []VisitorFunc</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewDecoratedVisitor(v Visitor, fn ...VisitorFunc) Visitor {</span></span>
<span class="line"><span>  if len(fn) == 0 {</span></span>
<span class="line"><span>    return v</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return DecoratedVisitor{v, fn}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Visit implements Visitor</span></span>
<span class="line"><span>func (v DecoratedVisitor) Visit(fn VisitorFunc) error {</span></span>
<span class="line"><span>  return v.visitor.Visit(func(info *Info, err error) error {</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>      return err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if err := fn(info, nil); err != nil {</span></span>
<span class="line"><span>      return err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for i := range v.decorators {</span></span>
<span class="line"><span>      if err := v.decorators[i](info, nil); err != nil {</span></span>
<span class="line"><span>        return err</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码并不复杂，我来解释下。</p><ul><li>用一个 <code>DecoratedVisitor</code> 的结构来存放所有的 <code>VistorFunc</code> 函数；</li><li><code>NewDecoratedVisitor</code> 可以把所有的 <code>VisitorFunc</code> 转给它，构造 <code>DecoratedVisitor</code> 对象；</li><li><code>DecoratedVisitor</code> 实现了 <code>Visit()</code> 方法，里面就是来做一个for-loop，顺着调用所有的 <code>VisitorFunc</code>。</li></ul><p>这样，我们的代码就可以这样运作了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>info := Info{}</span></span>
<span class="line"><span>var v Visitor = &amp;info</span></span>
<span class="line"><span>v = NewDecoratedVisitor(v, NameVisitor, OtherVisitor)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>v.Visit(LoadFile)</span></span></code></pre></div><p>是不是比之前的那个简单？需要注意的是，这个 <code>DecoratedVisitor</code> 同样可以成为一个Visitor来使用。上面的这些代码全部存在于 <code>kubectl</code> 的代码中，只要你看懂了这里面的代码逻辑，就一定能看懂 <code>kubectl</code> 的代码。</p><p>好了，这节课就到这里。如果你觉得今天的内容对你有所帮助，欢迎你帮我分享给更多人。</p>`,55)])])}const f=n(i,[["render",l]]);export{h as __pageData,f as default};
