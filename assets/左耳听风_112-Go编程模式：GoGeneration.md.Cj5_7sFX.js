import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"112 | Go编程模式：Go Generation","description":"","frontmatter":{},"headers":[{"level":2,"title":"现实中的类比","slug":"现实中的类比","link":"#现实中的类比","children":[]},{"level":2,"title":"Go语方的类型检查","slug":"go语方的类型检查","link":"#go语方的类型检查","children":[{"level":3,"title":"Type Assert","slug":"type-assert","link":"#type-assert","children":[]},{"level":3,"title":"Reflection","slug":"reflection","link":"#reflection","children":[]}]},{"level":2,"title":"他山之石","slug":"他山之石","link":"#他山之石","children":[]},{"level":2,"title":"Go Generator","slug":"go-generator","link":"#go-generator","children":[{"level":3,"title":"函数模板","slug":"函数模板","link":"#函数模板","children":[]},{"level":3,"title":"函数生成脚本","slug":"函数生成脚本","link":"#函数生成脚本","children":[]},{"level":3,"title":"生成代码","slug":"生成代码","link":"#生成代码","children":[]}]},{"level":2,"title":"新版Filter","slug":"新版filter","link":"#新版filter","children":[]},{"level":2,"title":"第三方工具","slug":"第三方工具","link":"#第三方工具","children":[]}],"relativePath":"左耳听风/112-Go编程模式：GoGeneration.md","filePath":"左耳听风/112-Go编程模式：GoGeneration.md","lastUpdated":1779819815000}'),l={name:"左耳听风/112-Go编程模式：GoGeneration.md"};function i(t,n,c,o,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_112-go编程模式-go-generation" tabindex="-1">112 | Go编程模式：Go Generation <a class="header-anchor" href="#_112-go编程模式-go-generation" aria-label="Permalink to &quot;112 | Go编程模式：Go Generation&quot;">​</a></h1><p>你好，我是陈皓，网名左耳朵耗子。</p><p>这节课，我们来学习一下Go语言的代码生成的玩法。</p><p>Go语言的代码生成主要还是用来解决编程泛型的问题。泛型编程主要是解决这样一个问题：因为静态类型语言有类型，所以，相关的算法或是对数据处理的程序会因为类型不同而需要复制一份，这样会导致数据类型和算法功能耦合。</p><p>我之所以说泛型编程可以解决这样的问题，就是说，在写代码的时候，不用关心处理数据的类型，只需要关心相关的处理逻辑。</p><p>泛型编程是静态语言中非常非常重要的特征，如果没有泛型，我们就很难做到多态，也很难完成抽象，这就会导致我们的代码冗余量很大。</p><h2 id="现实中的类比" tabindex="-1">现实中的类比 <a class="header-anchor" href="#现实中的类比" aria-label="Permalink to &quot;现实中的类比&quot;">​</a></h2><p>为了帮你更好地理解，我举个现实当中的例子。我们用螺丝刀来做打比方，螺丝刀本来只有一个拧螺丝的作用，但是因为螺丝的类型太多，有平口的，有十字口的，有六角的……螺丝还有不同的尺寸，这就导致我们的螺丝刀为了要适配各种千奇百怪的螺丝类型（样式和尺寸），也是各种样式的。</p><p>而真正的抽象是，螺丝刀不应该关心螺丝的类型，它只要关注自己的功能是不是完备，并且让自己可以适配不同类型的螺丝就行了，这就是所谓的泛型编程要解决的实际问题。</p><h2 id="go语方的类型检查" tabindex="-1">Go语方的类型检查 <a class="header-anchor" href="#go语方的类型检查" aria-label="Permalink to &quot;Go语方的类型检查&quot;">​</a></h2><p>因为Go语言目前并不支持真正的泛型，所以，只能用 <code>interface{}</code> 这样的类似于 <code>void*</code> 的过度泛型来玩，这就导致我们要在实际过程中进行类型检查。</p><p>Go语言的类型检查有两种技术，一种是 Type Assert，一种是Reflection。</p><h3 id="type-assert" tabindex="-1">Type Assert <a class="header-anchor" href="#type-assert" aria-label="Permalink to &quot;Type Assert&quot;">​</a></h3><p>这种技术，一般是对某个变量进行 <code>.(type)</code> 的转型操作，它会返回两个值，分别是variable和error。 variable是被转换好的类型，error表示如果不能转换类型，则会报错。</p><p>在下面的示例中，我们有一个通用类型的容器，可以进行 <code>Put(val)</code> 和 <code>Get()</code>，注意，这里使用了 <code>interface{}</code> 做泛型。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Container is a generic container, accepting anything.</span></span>
<span class="line"><span>type Container []interface{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//Put adds an element to the container.</span></span>
<span class="line"><span>func (c *Container) Put(elem interface{}) {</span></span>
<span class="line"><span>    *c = append(*c, elem)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//Get gets an element from the container.</span></span>
<span class="line"><span>func (c *Container) Get() interface{} {</span></span>
<span class="line"><span>    elem := (*c)[0]</span></span>
<span class="line"><span>    *c = (*c)[1:]</span></span>
<span class="line"><span>    return elem</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以这样使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>intContainer := &amp;Container{}</span></span>
<span class="line"><span>intContainer.Put(7)</span></span>
<span class="line"><span>intContainer.Put(42)</span></span></code></pre></div><p>但是，在把数据取出来时，因为类型是 <code>interface{}</code> ，所以，你还要做一个转型，只有转型成功，才能进行后续操作（因为 <code>interface{}</code> 太泛了，泛到什么类型都可以放）。</p><p>下面是一个Type Assert的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// assert that the actual type is int</span></span>
<span class="line"><span>elem, ok := intContainer.Get().(int)</span></span>
<span class="line"><span>if !ok {</span></span>
<span class="line"><span>    fmt.Println(&quot;Unable to read an int from intContainer&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fmt.Printf(&quot;assertExample: %d (%T)\\n&quot;, elem, elem)</span></span></code></pre></div><h3 id="reflection" tabindex="-1">Reflection <a class="header-anchor" href="#reflection" aria-label="Permalink to &quot;Reflection&quot;">​</a></h3><p>对于Reflection，我们需要把上面的代码修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Container struct {</span></span>
<span class="line"><span>    s reflect.Value</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func NewContainer(t reflect.Type, size int) *Container {</span></span>
<span class="line"><span>    if size &lt;=0  { size=64 }</span></span>
<span class="line"><span>    return &amp;Container{</span></span>
<span class="line"><span>        s: reflect.MakeSlice(reflect.SliceOf(t), 0, size),</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *Container) Put(val interface{})  error {</span></span>
<span class="line"><span>    if reflect.ValueOf(val).Type() != c.s.Type().Elem() {</span></span>
<span class="line"><span>        return fmt.Errorf(“Put: cannot put a %T into a slice of %s&quot;,</span></span>
<span class="line"><span>            val, c.s.Type().Elem()))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    c.s = reflect.Append(c.s, reflect.ValueOf(val))</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *Container) Get(refval interface{}) error {</span></span>
<span class="line"><span>    if reflect.ValueOf(refval).Kind() != reflect.Ptr ||</span></span>
<span class="line"><span>        reflect.ValueOf(refval).Elem().Type() != c.s.Type().Elem() {</span></span>
<span class="line"><span>        return fmt.Errorf(&quot;Get: needs *%s but got %T&quot;, c.s.Type().Elem(), refval)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    reflect.ValueOf(refval).Elem().Set( c.s.Index(0) )</span></span>
<span class="line"><span>    c.s = c.s.Slice(1, c.s.Len())</span></span>
<span class="line"><span>    return nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的代码并不难懂，这是完全使用 Reflection的玩法，我简单解释下。</p><ul><li>在 <code>NewContainer()</code> 时，会根据参数的类型初始化一个Slice。</li><li>在 <code>Put()</code> 时，会检查 <code>val</code> 是否和Slice的类型一致。</li><li>在 <code>Get()</code> 时，我们需要用一个入参的方式，因为我们没有办法返回 <code>reflect.Value</code> 或 <code>interface{}</code>，不然还要做Type Assert。</li><li>不过有类型检查，所以，必然会有检查不对的时候，因此，需要返回 <code>error</code>。</li></ul><p>于是，在使用这段代码的时候，会是下面这个样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>f1 := 3.1415926</span></span>
<span class="line"><span>f2 := 1.41421356237</span></span>
<span class="line"><span></span></span>
<span class="line"><span>c := NewMyContainer(reflect.TypeOf(f1), 16)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if err := c.Put(f1); err != nil {</span></span>
<span class="line"><span>  panic(err)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if err := c.Put(f2); err != nil {</span></span>
<span class="line"><span>  panic(err)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>g := 0.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if err := c.Get(&amp;g); err != nil {</span></span>
<span class="line"><span>  panic(err)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>fmt.Printf(&quot;%v (%T)\\n&quot;, g, g) //3.1415926 (float64)</span></span>
<span class="line"><span>fmt.Println(c.s.Index(0)) //1.4142135623</span></span></code></pre></div><p>可以看到，Type Assert是不用了，但是用反射写出来的代码还是有点复杂的。那么，有没有什么好的方法？</p><h2 id="他山之石" tabindex="-1">他山之石 <a class="header-anchor" href="#他山之石" aria-label="Permalink to &quot;他山之石&quot;">​</a></h2><p>对于泛型编程最牛的语言 C++ 来说，这类问题都是使用 Template解决的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//用&lt;​class T&gt;来描述泛型</span></span>
<span class="line"><span>template &lt;​class T&gt;</span></span>
<span class="line"><span>T GetMax (T a, T b)  {</span></span>
<span class="line"><span>    T result;</span></span>
<span class="line"><span>    result = (a&gt;b)? a : b;</span></span>
<span class="line"><span>    return (result);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int i=5, j=6, k;</span></span>
<span class="line"><span>//生成int类型的函数</span></span>
<span class="line"><span>k=GetMax&lt;​int&gt;(i,j);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long l=10, m=5, n;</span></span>
<span class="line"><span>//生成long类型的函数</span></span>
<span class="line"><span>n=GetMax&lt;​long&gt;(l,m);</span></span></code></pre></div><p>C++的编译器会在编译时分析代码，根据不同的变量类型来自动化生成相关类型的函数或类，在C++里，叫模板的具体化。</p><p>这个技术是编译时的问题，所以，我们不需要在运行时进行任何的类型识别，我们的程序也会变得比较干净。</p><p>那么，我们是否可以在Go中使用C++的这种技术呢？答案是肯定的，只是Go的编译器不会帮你干，你需要自己动手。</p><h2 id="go-generator" tabindex="-1">Go Generator <a class="header-anchor" href="#go-generator" aria-label="Permalink to &quot;Go Generator&quot;">​</a></h2><p>要玩 Go的代码生成，你需要三个东西：</p><ol><li>一个函数模板，在里面设置好相应的占位符；</li><li>一个脚本，用于按规则来替换文本并生成新的代码；</li><li>一行注释代码。</li></ol><h3 id="函数模板" tabindex="-1">函数模板 <a class="header-anchor" href="#函数模板" aria-label="Permalink to &quot;函数模板&quot;">​</a></h3><p>我们把之前的示例改成模板，取名为 <code>container.tmp.go</code> 放在 <code>./template/</code> 下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package PACKAGE_NAME</span></span>
<span class="line"><span>type GENERIC_NAMEContainer struct {</span></span>
<span class="line"><span>    s []GENERIC_TYPE</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func NewGENERIC_NAMEContainer() *GENERIC_NAMEContainer {</span></span>
<span class="line"><span>    return &amp;GENERIC_NAMEContainer{s: []GENERIC_TYPE{}​}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *GENERIC_NAMEContainer) Put(val GENERIC_TYPE) {</span></span>
<span class="line"><span>    c.s = append(c.s, val)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *GENERIC_NAMEContainer) Get() GENERIC_TYPE {</span></span>
<span class="line"><span>    r := c.s[0]</span></span>
<span class="line"><span>    c.s = c.s[1:]</span></span>
<span class="line"><span>    return r</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，函数模板中我们有如下的占位符：</p><ul><li><code>PACKAGE_NAME</code>：包名</li><li><code>GENERIC_NAME</code> ：名字</li><li><code>GENERIC_TYPE</code> ：实际的类型</li></ul><p>其它的代码都是一样的。</p><h3 id="函数生成脚本" tabindex="-1">函数生成脚本 <a class="header-anchor" href="#函数生成脚本" aria-label="Permalink to &quot;函数生成脚本&quot;">​</a></h3><p>然后，我们有一个叫 <code>gen.sh</code> 的生成脚本，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set -e</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SRC_FILE=\${1}</span></span>
<span class="line"><span>PACKAGE=\${2}</span></span>
<span class="line"><span>TYPE=\${3}</span></span>
<span class="line"><span>DES=\${4}</span></span>
<span class="line"><span>#uppcase the first char</span></span>
<span class="line"><span>PREFIX=&quot;$(tr &#39;[:lower:]&#39; &#39;[:upper:]&#39; &lt;&lt;&lt; \${TYPE:0:1})\${TYPE:1}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DES_FILE=$(echo \${TYPE}| tr &#39;[:upper:]&#39; &#39;[:lower:]&#39;)_\${DES}.go</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sed &#39;s/PACKAGE_NAME/&#39;&quot;\${PACKAGE}&quot;&#39;/g&#39; \${SRC_FILE} | \\</span></span>
<span class="line"><span>    sed &#39;s/GENERIC_TYPE/&#39;&quot;\${TYPE}&quot;&#39;/g&#39; | \\</span></span>
<span class="line"><span>    sed &#39;s/GENERIC_NAME/&#39;&quot;\${PREFIX}&quot;&#39;/g&#39; &gt; \${DES_FILE}</span></span></code></pre></div><p>这里需要4个参数：</p><ul><li>模板源文件；</li><li>包名；</li><li>实际需要具体化的类型；</li><li>用于构造目标文件名的后缀。</li></ul><p>然后，我们用 <code>sed</code> 命令去替换刚刚的函数模板，并生成到目标文件中（关于sed命令，我给你推荐一篇文章：《 <a href="https://coolshell.cn/articles/9104.html" target="_blank" rel="noreferrer">sed 简明教程</a>》）。</p><h3 id="生成代码" tabindex="-1">生成代码 <a class="header-anchor" href="#生成代码" aria-label="Permalink to &quot;生成代码&quot;">​</a></h3><p>接下来，我们只需要在代码中打一个特殊的注释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//go:generate ./gen.sh ./template/container.tmp.go gen uint32 container</span></span>
<span class="line"><span>func generateUint32Example() {</span></span>
<span class="line"><span>    var u uint32 = 42</span></span>
<span class="line"><span>    c := NewUint32Container()</span></span>
<span class="line"><span>    c.Put(u)</span></span>
<span class="line"><span>    v := c.Get()</span></span>
<span class="line"><span>    fmt.Printf(&quot;generateExample: %d (%T)\\n&quot;, v, v)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//go:generate ./gen.sh ./template/container.tmp.go gen string container</span></span>
<span class="line"><span>func generateStringExample() {</span></span>
<span class="line"><span>    var s string = &quot;Hello&quot;</span></span>
<span class="line"><span>    c := NewStringContainer()</span></span>
<span class="line"><span>    c.Put(s)</span></span>
<span class="line"><span>    v := c.Get()</span></span>
<span class="line"><span>    fmt.Printf(&quot;generateExample: %s (%T)\\n&quot;, v, v)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，</p><ul><li>第一个注释是生成包名gen，类型是uint32，目标文件名以container为后缀。</li><li>第二个注释是生成包名gen，类型是string，目标文件名是以container为后缀。</li></ul><p>然后，在工程目录中直接执行 <code>go generate</code> 命令，就会生成两份代码：</p><p>一份文件名为uint32_container.go：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package gen</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Uint32Container struct {</span></span>
<span class="line"><span>    s []uint32</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func NewUint32Container() *Uint32Container {</span></span>
<span class="line"><span>    return &amp;Uint32Container{s: []uint32{}​}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *Uint32Container) Put(val uint32) {</span></span>
<span class="line"><span>    c.s = append(c.s, val)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *Uint32Container) Get() uint32 {</span></span>
<span class="line"><span>    r := c.s[0]</span></span>
<span class="line"><span>    c.s = c.s[1:]</span></span>
<span class="line"><span>    return r</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另一份的文件名为 string_container.go：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package gen</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type StringContainer struct {</span></span>
<span class="line"><span>    s []string</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func NewStringContainer() *StringContainer {</span></span>
<span class="line"><span>    return &amp;StringContainer{s: []string{}​}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *StringContainer) Put(val string) {</span></span>
<span class="line"><span>    c.s = append(c.s, val)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (c *StringContainer) Get() string {</span></span>
<span class="line"><span>    r := c.s[0]</span></span>
<span class="line"><span>    c.s = c.s[1:]</span></span>
<span class="line"><span>    return r</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这两份代码可以让我们的代码完全编译通过，付出的代价就是需要多执行一步 <code>go generate</code> 命令。</p><h2 id="新版filter" tabindex="-1">新版Filter <a class="header-anchor" href="#新版filter" aria-label="Permalink to &quot;新版Filter&quot;">​</a></h2><p>现在我们再回头看看上节课里的那些用反射整出来的例子，你就会发现，有了这样的技术，我们就不用在代码里，用那些晦涩难懂的反射来做运行时的类型检查了。我们可以写出很干净的代码，让编译器在编译时检查类型对不对。</p><p>下面是一个Fitler的模板文件 <code>filter.tmp.go</code>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package PACKAGE_NAME</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type GENERIC_NAMEList []GENERIC_TYPE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type GENERIC_NAMEToBool func(*GENERIC_TYPE) bool</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (al GENERIC_NAMEList) Filter(f GENERIC_NAMEToBool) GENERIC_NAMEList {</span></span>
<span class="line"><span>    var ret GENERIC_NAMEList</span></span>
<span class="line"><span>    for _, a := range al {</span></span>
<span class="line"><span>        if f(&amp;a) {</span></span>
<span class="line"><span>            ret = append(ret, a)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，我们可以在需要使用这个的地方，加上相关的 Go Generate 的注释：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Employee struct {</span></span>
<span class="line"><span>  Name     string</span></span>
<span class="line"><span>  Age      int</span></span>
<span class="line"><span>  Vacation int</span></span>
<span class="line"><span>  Salary   int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//go:generate ./gen.sh ./template/filter.tmp.go gen Employee filter</span></span>
<span class="line"><span>func filterEmployeeExample() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  var list = EmployeeList{</span></span>
<span class="line"><span>    {&quot;Hao&quot;, 44, 0, 8000},</span></span>
<span class="line"><span>    {&quot;Bob&quot;, 34, 10, 5000},</span></span>
<span class="line"><span>    {&quot;Alice&quot;, 23, 5, 9000},</span></span>
<span class="line"><span>    {&quot;Jack&quot;, 26, 0, 4000},</span></span>
<span class="line"><span>    {&quot;Tom&quot;, 48, 9, 7500},</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  var filter EmployeeList</span></span>
<span class="line"><span>  filter = list.Filter(func(e *Employee) bool {</span></span>
<span class="line"><span>    return e.Age &gt; 40</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  fmt.Println(&quot;----- Employee.Age &gt; 40 ------&quot;)</span></span>
<span class="line"><span>  for _, e := range filter {</span></span>
<span class="line"><span>    fmt.Println(e)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  filter = list.Filter(func(e *Employee) bool {</span></span>
<span class="line"><span>    return e.Salary &lt;= 5000</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  fmt.Println(&quot;----- Employee.Salary &lt;= 5000 ------&quot;)</span></span>
<span class="line"><span>  for _, e := range filter {</span></span>
<span class="line"><span>    fmt.Println(e)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="第三方工具" tabindex="-1">第三方工具 <a class="header-anchor" href="#第三方工具" aria-label="Permalink to &quot;第三方工具&quot;">​</a></h2><p>我们并不需要自己手写 <code>gen.sh</code> 这样的工具类，我们可以直接使用第三方已经写好的工具。我给你提供一个列表。</p><ul><li><a href="https://github.com/cheekybits/genny" target="_blank" rel="noreferrer">Genny</a></li><li><a href="https://github.com/taylorchu/generic" target="_blank" rel="noreferrer">Generic</a></li><li><a href="https://github.com/joeshaw/gengen" target="_blank" rel="noreferrer">GenGen</a></li><li><a href="https://github.com/clipperhouse/gen" target="_blank" rel="noreferrer">Gen</a></li></ul><p>好了，这节课就到这里。如果你觉得今天的内容对你有所帮助，欢迎你帮我分享给更多人。</p>`,72)])])}const h=s(l,[["render",i]]);export{g as __pageData,h as default};
