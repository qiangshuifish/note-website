import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"11 | 设计模式：Go常用设计模式概述","description":"","frontmatter":{},"headers":[{"level":2,"title":"创建型模式","slug":"创建型模式","link":"#创建型模式","children":[{"level":3,"title":"单例模式","slug":"单例模式","link":"#单例模式","children":[]},{"level":3,"title":"工厂模式","slug":"工厂模式","link":"#工厂模式","children":[]}]},{"level":2,"title":"结构型模式","slug":"结构型模式","link":"#结构型模式","children":[{"level":3,"title":"策略模式","slug":"策略模式","link":"#策略模式","children":[]},{"level":3,"title":"模板模式","slug":"模板模式","link":"#模板模式","children":[]}]},{"level":2,"title":"行为型模式","slug":"行为型模式","link":"#行为型模式","children":[{"level":3,"title":"代理模式","slug":"代理模式","link":"#代理模式","children":[]},{"level":3,"title":"选项模式","slug":"选项模式","link":"#选项模式","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/11-设计模式：Go常用设计模式概述.md","filePath":"Go语言项目开发实战/11-设计模式：Go常用设计模式概述.md","lastUpdated":1779815754000}'),t={name:"Go语言项目开发实战/11-设计模式：Go常用设计模式概述.md"};function l(i,n,c,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_11-设计模式-go常用设计模式概述" tabindex="-1">11 | 设计模式：Go常用设计模式概述 <a class="header-anchor" href="#_11-设计模式-go常用设计模式概述" aria-label="Permalink to &quot;11 | 设计模式：Go常用设计模式概述&quot;">​</a></h1><p>你好，我是孔令飞，今天我们来聊聊Go项目开发中常用的设计模式。</p><p>在软件开发中，经常会遇到各种各样的编码场景，这些场景往往重复发生，因此具有典型性。针对这些典型场景，我们可以自己编码解决，也可以采取更为省时省力的方式：直接采用设计模式。</p><p>设计模式是啥呢？简单来说，就是将软件开发中需要重复性解决的编码场景，按最佳实践的方式抽象成一个模型，模型描述的解决方法就是设计模式。使用设计模式，可以使代码更易于理解，保证代码的重用性和可靠性。</p><p>在软件领域，GoF（四人帮，全拼 Gang of Four）首次系统化提出了3大类、共25种可复用的经典设计方案，来解决常见的软件设计问题，为可复用软件设计奠定了一定的理论基础。</p><p>从总体上说，这些设计模式可以分为创建型模式、结构型模式、行为型模式3大类，用来完成不同的场景。这一讲，我会介绍几个在Go项目开发中比较常用的设计模式，帮助你用更加简单快捷的方法应对不同的编码场景。其中，简单工厂模式、抽象工厂模式和工厂方法模式都属于工厂模式，我会把它们放在一起讲解。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/386238/98fb0ecb8ba65bc83f25bb2504e51d20.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/386238/98fb0ecb8ba65bc83f25bb2504e51d20.png" alt=""></a></p><h2 id="创建型模式" tabindex="-1">创建型模式 <a class="header-anchor" href="#创建型模式" aria-label="Permalink to &quot;创建型模式&quot;">​</a></h2><p>首先来看创建型模式（Creational Patterns），它提供了一种 <strong>在创建对象的同时隐藏创建逻辑</strong> 的方式，而不是使用 new 运算符直接实例化对象。</p><p>这种类型的设计模式里，单例模式和工厂模式（具体包括简单工厂模式、抽象工厂模式和工厂方法模式三种）在Go项目开发中比较常用。我们先来看单例模式。</p><h3 id="单例模式" tabindex="-1">单例模式 <a class="header-anchor" href="#单例模式" aria-label="Permalink to &quot;单例模式&quot;">​</a></h3><p>单例模式（Singleton Pattern），是 <strong>最简单的一个模式</strong>。在Go中，单例模式指的是全局只有一个实例，并且它负责创建自己的对象。单例模式不仅有利于减少内存开支，还有减少系统性能开销、防止多个实例产生冲突等优点。</p><p>因为单例模式保证了实例的全局唯一性，而且只被初始化一次，所以比较适合 <strong>全局共享一个实例，且只需要被初始化一次的场景</strong>，例如数据库实例、全局配置、全局任务池等。</p><p>单例模式又分为 <strong>饿汉方式</strong> 和 <strong>懒汉方式</strong>。饿汉方式指全局的单例实例在包被加载时创建，而懒汉方式指全局的单例实例在第一次被使用时创建。你可以看到，这种命名方式非常形象地体现了它们不同的特点。</p><p>接下来，我就来分别介绍下这两种方式。先来看 <strong>饿汉方式</strong>。</p><p>下面是一个饿汉方式的单例模式代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package singleton</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type singleton struct {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var ins *singleton = &amp;singleton{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func GetInsOr() *singleton {</span></span>
<span class="line"><span>    return ins</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你需要注意，因为实例是在包被导入时初始化的，所以如果初始化耗时，会导致程序加载时间比较长。</p><p><strong>懒汉方式是开源项目中使用最多的</strong>，但它的缺点是非并发安全，在实际使用时需要加锁。以下是懒汉方式不加锁的一个实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package singleton</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type singleton struct {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var ins *singleton</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func GetInsOr() *singleton {</span></span>
<span class="line"><span>    if ins == nil {</span></span>
<span class="line"><span>        ins = &amp;singleton{}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ins</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，在创建ins时，如果 <code>ins==nil</code>，就会再创建一个ins实例，这时候单例就会有多个实例。</p><p>为了解决懒汉方式非并发安全的问题，需要对实例进行加锁，下面是带检查锁的一个实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import &quot;sync&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type singleton struct {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var ins *singleton</span></span>
<span class="line"><span>var mu sync.Mutex</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func GetIns() *singleton {</span></span>
<span class="line"><span>	if ins == nil {</span></span>
<span class="line"><span>		mu.Lock()</span></span>
<span class="line"><span>		if ins == nil {</span></span>
<span class="line"><span>			ins = &amp;singleton{}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>        mu.Unlock()</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return ins</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码只有在创建时才会加锁，既提高了代码效率，又保证了并发安全。</p><p>除了饿汉方式和懒汉方式，在Go开发中，还有一种更优雅的实现方式，我建议你采用这种方式，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package singleton</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;sync&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type singleton struct {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var ins *singleton</span></span>
<span class="line"><span>var once sync.Once</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func GetInsOr() *singleton {</span></span>
<span class="line"><span>    once.Do(func() {</span></span>
<span class="line"><span>        ins = &amp;singleton{}</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>    return ins</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用 <code>once.Do</code> 可以确保ins实例全局只被创建一次，once.Do函数还可以确保当同时有多个创建动作时，只有一个创建动作在被执行。</p><p>另外，IAM应用中大量使用了单例模式，如果你想了解更多单例模式的使用方式，可以直接查看IAM项目代码。IAM中单例模式有 <a href="https://github.com/colin404test/iam/blob/IAMTAG/internal/authzserver/store/store.go#L45" target="_blank" rel="noreferrer">GetStoreInsOr</a>、 <a href="https://github.com/colin404test/iam/blob/IAMTAG/internal/apiserver/store/etcd/etcd.go#L83" target="_blank" rel="noreferrer">GetEtcdFactoryOr</a>、 <a href="https://github.com/colin404test/iam/blob/IAMTAG/internal/apiserver/store/mysql/mysql.go#L55" target="_blank" rel="noreferrer">GetMySQLFactoryOr</a>、 <a href="https://github.com/colin404test/iam/blob/IAMTAG/internal/apiserver/api/v1/cache/cache.go#L33" target="_blank" rel="noreferrer">GetCacheInsOr</a> 等。</p><h3 id="工厂模式" tabindex="-1">工厂模式 <a class="header-anchor" href="#工厂模式" aria-label="Permalink to &quot;工厂模式&quot;">​</a></h3><p>工厂模式（Factory Pattern）是面向对象编程中的常用模式。在Go项目开发中，你可以通过使用多种不同的工厂模式，来使代码更简洁明了。Go中的结构体，可以理解为面向对象编程中的类，例如 Person结构体（类）实现了Greet方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Person struct {</span></span>
<span class="line"><span>  Name string</span></span>
<span class="line"><span>  Age int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (p Person) Greet() {</span></span>
<span class="line"><span>  fmt.Printf(&quot;Hi! My name is %s&quot;, p.Name)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了Person“类”，就可以创建Person实例。我们可以通过简单工厂模式、抽象工厂模式、工厂方法模式这三种方式，来创建一个Person实例。</p><p>这三种工厂模式中， <strong>简单工厂模式</strong> 是最常用、最简单的。它就是一个接受一些参数，然后返回Person实例的函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Person struct {</span></span>
<span class="line"><span>  Name string</span></span>
<span class="line"><span>  Age int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (p Person) Greet() {</span></span>
<span class="line"><span>  fmt.Printf(&quot;Hi! My name is %s&quot;, p.Name)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewPerson(name string, age int) *Person {</span></span>
<span class="line"><span>  return &amp;Person{</span></span>
<span class="line"><span>    Name: name,</span></span>
<span class="line"><span>    Age: age,</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和 <code>p：=＆Person {}</code> 这种创建实例的方式相比，简单工厂模式可以确保我们创建的实例具有需要的参数，进而保证实例的方法可以按预期执行。例如，通过 <code>NewPerson</code> 创建Person实例时，可以确保实例的name和age属性被设置。</p><p>再来看 <strong>抽象工厂模式，</strong> 它和简单工厂模式的唯一区别，就是它返回的是接口而不是结构体。</p><p>通过返回接口，可以 <strong>在你不公开内部实现的情况下，让调用者使用你提供的各种功能</strong>，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Person interface {</span></span>
<span class="line"><span>  Greet()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type person struct {</span></span>
<span class="line"><span>  name string</span></span>
<span class="line"><span>  age int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (p person) Greet() {</span></span>
<span class="line"><span>  fmt.Printf(&quot;Hi! My name is %s&quot;, p.name)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Here, NewPerson returns an interface, and not the person struct itself</span></span>
<span class="line"><span>func NewPerson(name string, age int) Person {</span></span>
<span class="line"><span>  return person{</span></span>
<span class="line"><span>    name: name,</span></span>
<span class="line"><span>    age: age,</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这个代码，定义了一个不可导出的结构体 <code>person</code>，在通过NewPerson创建实例的时候返回的是接口，而不是结构体。</p><p>通过返回接口，我们还可以 <strong>实现多个工厂函数，来返回不同的接口实现</strong>，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// We define a Doer interface, that has the method signature</span></span>
<span class="line"><span>// of the \`http.Client\` structs \`Do\` method</span></span>
<span class="line"><span>type Doer interface {</span></span>
<span class="line"><span>	Do(req *http.Request) (*http.Response, error)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This gives us a regular HTTP client from the \`net/http\` package</span></span>
<span class="line"><span>func NewHTTPClient() Doer {</span></span>
<span class="line"><span>	return &amp;http.Client{}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type mockHTTPClient struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (*mockHTTPClient) Do(req *http.Request) (*http.Response, error) {</span></span>
<span class="line"><span>	// The \`NewRecorder\` method of the httptest package gives us</span></span>
<span class="line"><span>	// a new mock request generator</span></span>
<span class="line"><span>	res := httptest.NewRecorder()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// calling the \`Result\` method gives us</span></span>
<span class="line"><span>	// the default empty *http.Response object</span></span>
<span class="line"><span>	return res.Result(), nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This gives us a mock HTTP client, which returns</span></span>
<span class="line"><span>// an empty response for any request sent to it</span></span>
<span class="line"><span>func NewMockHTTPClient() Doer {</span></span>
<span class="line"><span>	return &amp;mockHTTPClient{}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>NewHTTPClient</code> 和 <code>NewMockHTTPClient</code> 都返回了同一个接口类型Doer，这使得二者可以互换使用。当你想测试一段调用了Doer接口Do方法的代码时，这一点特别有用。因为你可以使用一个Mock的HTTP客户端，从而避免了调用真实外部接口可能带来的失败。</p><p>来看个例子，假设我们想测试下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func QueryUser(doer Doer) error {</span></span>
<span class="line"><span>	req, err := http.NewRequest(&quot;Get&quot;, &quot;http://iam.api.marmotedu.com:8080/v1/secrets&quot;, nil)</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		return err</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	_, err := doer.Do(req)</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		return err</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其测试用例为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func TestQueryUser(t *testing.T) {</span></span>
<span class="line"><span>	doer := NewMockHTTPClient()</span></span>
<span class="line"><span>	if err := QueryUser(doer); err != nil {</span></span>
<span class="line"><span>		t.Errorf(&quot;QueryUser failed, err: %v&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外，在使用简单工厂模式和抽象工厂模式返回实例对象时，都可以返回指针。例如，简单工厂模式可以这样返回实例对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>return &amp;Person{</span></span>
<span class="line"><span>  Name: name,</span></span>
<span class="line"><span>  Age: age</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>抽象工厂模式可以这样返回实例对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>return &amp;person{</span></span>
<span class="line"><span>  name: name,</span></span>
<span class="line"><span>  age: age</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在实际开发中，我建议返回非指针的实例，因为我们主要是想通过创建实例，调用其提供的方法，而不是对实例做更改。如果需要对实例做更改，可以实现 <code>SetXXX</code> 的方法。通过返回非指针的实例，可以确保实例的属性，避免属性被意外/任意修改。</p><p>在 <strong>简单工厂模式</strong> 中，依赖于唯一的工厂对象，如果我们需要实例化一个产品，就要向工厂中传入一个参数，获取对应的对象；如果要增加一种产品，就要在工厂中修改创建产品的函数。这会导致耦合性过高，这时我们就可以使用 <strong>工厂方法模式</strong>。</p><p>在 <strong>工厂方法模式</strong> 中，依赖工厂函数，我们可以通过实现工厂函数来创建多种工厂，将对象创建从由一个对象负责所有具体类的实例化，变成由一群子类来负责对具体类的实例化，从而将过程解耦。</p><p>下面是 <strong>工厂方法模式</strong> 的一个代码实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Person struct {</span></span>
<span class="line"><span>	name string</span></span>
<span class="line"><span>	age int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewPersonFactory(age int) func(name string) Person {</span></span>
<span class="line"><span>	return func(name string) Person {</span></span>
<span class="line"><span>		return Person{</span></span>
<span class="line"><span>			name: name,</span></span>
<span class="line"><span>			age: age,</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们可以使用此功能来创建具有默认年龄的工厂：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>newBaby := NewPersonFactory(1)</span></span>
<span class="line"><span>baby := newBaby(&quot;john&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>newTeenager := NewPersonFactory(16)</span></span>
<span class="line"><span>teen := newTeenager(&quot;jill&quot;)</span></span></code></pre></div><h2 id="结构型模式" tabindex="-1">结构型模式 <a class="header-anchor" href="#结构型模式" aria-label="Permalink to &quot;结构型模式&quot;">​</a></h2><p>我已经向你介绍了单例模式、工厂模式这两种创建型模式，接下来我们来看结构型模式（Structural Patterns），它的特点是 <strong>关注类和对象的组合</strong>。这一类型里，我想详细讲讲策略模式和模板模式。</p><h3 id="策略模式" tabindex="-1">策略模式 <a class="header-anchor" href="#策略模式" aria-label="Permalink to &quot;策略模式&quot;">​</a></h3><p>策略模式（Strategy Pattern）定义一组算法，将每个算法都封装起来，并且使它们之间可以互换。</p><p>在什么时候，我们需要用到策略模式呢？</p><p>在项目开发中，我们经常要根据不同的场景，采取不同的措施，也就是不同的 <strong>策略</strong>。比如，假设我们需要对a、b 这两个整数进行计算，根据条件的不同，需要执行不同的计算方式。我们可以把所有的操作都封装在同一个函数中，然后通过 <code>if ... else ...</code> 的形式来调用不同的计算方式，这种方式称之为 <strong>硬编码</strong>。</p><p>在实际应用中，随着功能和体验的不断增长，我们需要经常添加/修改策略，这样就需要不断修改已有代码，不仅会让这个函数越来越难维护，还可能因为修改带来一些bug。所以为了解耦，需要使用策略模式，定义一些独立的类来封装不同的算法，每一个类封装一个具体的算法（即策略）。</p><p>下面是一个实现策略模式的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package strategy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 策略模式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个策略类</span></span>
<span class="line"><span>type IStrategy interface {</span></span>
<span class="line"><span>	do(int, int) int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 策略实现：加</span></span>
<span class="line"><span>type add struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (*add) do(a, b int) int {</span></span>
<span class="line"><span>	return a + b</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 策略实现：减</span></span>
<span class="line"><span>type reduce struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (*reduce) do(a, b int) int {</span></span>
<span class="line"><span>	return a - b</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 具体策略的执行者</span></span>
<span class="line"><span>type Operator struct {</span></span>
<span class="line"><span>	strategy IStrategy</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 设置策略</span></span>
<span class="line"><span>func (operator *Operator) setStrategy(strategy IStrategy) {</span></span>
<span class="line"><span>	operator.strategy = strategy</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用策略中的方法</span></span>
<span class="line"><span>func (operator *Operator) calculate(a, b int) int {</span></span>
<span class="line"><span>	return operator.strategy.do(a, b)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述代码中，我们定义了策略接口 IStrategy，还定义了 add 和 reduce 两种策略。最后定义了一个策略执行者，可以设置不同的策略，并执行，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func TestStrategy(t *testing.T) {</span></span>
<span class="line"><span>	operator := Operator{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	operator.setStrategy(&amp;add{})</span></span>
<span class="line"><span>	result := operator.calculate(1, 2)</span></span>
<span class="line"><span>	fmt.Println(&quot;add:&quot;, result)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	operator.setStrategy(&amp;reduce{})</span></span>
<span class="line"><span>	result = operator.calculate(2, 1)</span></span>
<span class="line"><span>	fmt.Println(&quot;reduce:&quot;, result)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，我们可以随意更换策略，而不影响Operator的所有实现。</p><h3 id="模板模式" tabindex="-1">模板模式 <a class="header-anchor" href="#模板模式" aria-label="Permalink to &quot;模板模式&quot;">​</a></h3><p>模板模式 (Template Pattern)定义一个操作中算法的骨架，而将一些步骤延迟到子类中。这种方法让子类在不改变一个算法结构的情况下，就能重新定义该算法的某些特定步骤。</p><p>简单来说，模板模式就是将一个类中能够公共使用的方法放置在抽象类中实现，将不能公共使用的方法作为抽象方法，强制子类去实现，这样就做到了将一个类作为一个模板，让开发者去填充需要填充的地方。</p><p>以下是模板模式的一个实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package template</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Cooker interface {</span></span>
<span class="line"><span>	fire()</span></span>
<span class="line"><span>	cooke()</span></span>
<span class="line"><span>	outfire()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 类似于一个抽象类</span></span>
<span class="line"><span>type CookMenu struct {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (CookMenu) fire() {</span></span>
<span class="line"><span>	fmt.Println(&quot;开火&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 做菜，交给具体的子类实现</span></span>
<span class="line"><span>func (CookMenu) cooke() {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (CookMenu) outfire() {</span></span>
<span class="line"><span>	fmt.Println(&quot;关火&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 封装具体步骤</span></span>
<span class="line"><span>func doCook(cook Cooker) {</span></span>
<span class="line"><span>	cook.fire()</span></span>
<span class="line"><span>	cook.cooke()</span></span>
<span class="line"><span>	cook.outfire()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type XiHongShi struct {</span></span>
<span class="line"><span>	CookMenu</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (*XiHongShi) cooke() {</span></span>
<span class="line"><span>	fmt.Println(&quot;做西红柿&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type ChaoJiDan struct {</span></span>
<span class="line"><span>	CookMenu</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (ChaoJiDan) cooke() {</span></span>
<span class="line"><span>	fmt.Println(&quot;做炒鸡蛋&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里来看下测试用例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func TestTemplate(t *testing.T) {</span></span>
<span class="line"><span>	// 做西红柿</span></span>
<span class="line"><span>	xihongshi := &amp;XiHongShi{}</span></span>
<span class="line"><span>	doCook(xihongshi)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	fmt.Println(&quot;\\n=====&amp;gt; 做另外一道菜&quot;)</span></span>
<span class="line"><span>	// 做炒鸡蛋</span></span>
<span class="line"><span>	chaojidan := &amp;ChaoJiDan{}</span></span>
<span class="line"><span>	doCook(chaojidan)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="行为型模式" tabindex="-1">行为型模式 <a class="header-anchor" href="#行为型模式" aria-label="Permalink to &quot;行为型模式&quot;">​</a></h2><p>然后，让我们来看最后一个类别，行为型模式（Behavioral Patterns），它的特点是关注 <strong>对象之间的通信</strong>。这一类别的设计模式中，我们会讲到代理模式和选项模式。</p><h3 id="代理模式" tabindex="-1">代理模式 <a class="header-anchor" href="#代理模式" aria-label="Permalink to &quot;代理模式&quot;">​</a></h3><p>代理模式 (Proxy Pattern)，可以为另一个对象提供一个替身或者占位符，以控制对这个对象的访问。</p><p>以下代码是一个代理模式的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package proxy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Seller interface {</span></span>
<span class="line"><span>	sell(name string)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 火车站</span></span>
<span class="line"><span>type Station struct {</span></span>
<span class="line"><span>	stock int //库存</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (station *Station) sell(name string) {</span></span>
<span class="line"><span>	if station.stock &amp;gt; 0 {</span></span>
<span class="line"><span>		station.stock--</span></span>
<span class="line"><span>		fmt.Printf(&quot;代理点中：%s买了一张票,剩余：%d \\n&quot;, name, station.stock)</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		fmt.Println(&quot;票已售空&quot;)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 火车代理点</span></span>
<span class="line"><span>type StationProxy struct {</span></span>
<span class="line"><span>	station *Station // 持有一个火车站对象</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (proxy *StationProxy) sell(name string) {</span></span>
<span class="line"><span>	if proxy.station.stock &amp;gt; 0 {</span></span>
<span class="line"><span>		proxy.station.stock--</span></span>
<span class="line"><span>		fmt.Printf(&quot;代理点中：%s买了一张票,剩余：%d \\n&quot;, name, proxy.station.stock)</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		fmt.Println(&quot;票已售空&quot;)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，StationProxy代理了Station，代理类中持有被代理类对象，并且和被代理类对象实现了同一接口。</p><h3 id="选项模式" tabindex="-1">选项模式 <a class="header-anchor" href="#选项模式" aria-label="Permalink to &quot;选项模式&quot;">​</a></h3><p>选项模式（Options Pattern）也是Go项目开发中经常使用到的模式，例如，grpc/grpc-go的 <a href="https://github.com/grpc/grpc-go/blob/v1.37.0/server.go#L514" target="_blank" rel="noreferrer">NewServer</a> 函数，uber-go/zap包的 <a href="https://github.com/uber-go/zap/blob/v1.16.0/logger.go#L65" target="_blank" rel="noreferrer">New</a> 函数都用到了选项模式。使用选项模式，我们可以创建一个带有默认值的struct变量，并选择性地修改其中一些参数的值。</p><p>在Python语言中，创建一个对象时，可以给参数设置默认值，这样在不传入任何参数时，可以返回携带默认值的对象，并在需要时修改对象的属性。这种特性可以大大简化开发者创建一个对象的成本，尤其是在对象拥有众多属性时。</p><p>而在Go语言中，因为不支持给参数设置默认值，为了既能够创建带默认值的实例，又能够创建自定义参数的实例，不少开发者会通过以下两种方法来实现：</p><p>第一种方法，我们要分别开发两个用来创建实例的函数，一个可以创建带默认值的实例，一个可以定制化创建实例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package options</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>	defaultTimeout = 10</span></span>
<span class="line"><span>	defaultCaching = false</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Connection struct {</span></span>
<span class="line"><span>	addr    string</span></span>
<span class="line"><span>	cache   bool</span></span>
<span class="line"><span>	timeout time.Duration</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// NewConnect creates a connection.</span></span>
<span class="line"><span>func NewConnect(addr string) (*Connection, error) {</span></span>
<span class="line"><span>	return &amp;Connection{</span></span>
<span class="line"><span>		addr:    addr,</span></span>
<span class="line"><span>		cache:   defaultCaching,</span></span>
<span class="line"><span>		timeout: defaultTimeout,</span></span>
<span class="line"><span>	}, nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// NewConnectWithOptions creates a connection with options.</span></span>
<span class="line"><span>func NewConnectWithOptions(addr string, cache bool, timeout time.Duration) (*Connection, error) {</span></span>
<span class="line"><span>	return &amp;Connection{</span></span>
<span class="line"><span>		addr:    addr,</span></span>
<span class="line"><span>		cache:   cache,</span></span>
<span class="line"><span>		timeout: timeout,</span></span>
<span class="line"><span>	}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用这种方式，创建同一个Connection实例，却要实现两个不同的函数，实现方式很不优雅。</p><p>另外一种方法相对优雅些。我们需要创建一个带默认值的选项，并用该选项创建实例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package options</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>	defaultTimeout = 10</span></span>
<span class="line"><span>	defaultCaching = false</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Connection struct {</span></span>
<span class="line"><span>	addr    string</span></span>
<span class="line"><span>	cache   bool</span></span>
<span class="line"><span>	timeout time.Duration</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type ConnectionOptions struct {</span></span>
<span class="line"><span>	Caching bool</span></span>
<span class="line"><span>	Timeout time.Duration</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func NewDefaultOptions() *ConnectionOptions {</span></span>
<span class="line"><span>	return &amp;ConnectionOptions{</span></span>
<span class="line"><span>		Caching: defaultCaching,</span></span>
<span class="line"><span>		Timeout: defaultTimeout,</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// NewConnect creates a connection with options.</span></span>
<span class="line"><span>func NewConnect(addr string, opts *ConnectionOptions) (*Connection, error) {</span></span>
<span class="line"><span>	return &amp;Connection{</span></span>
<span class="line"><span>		addr:    addr,</span></span>
<span class="line"><span>		cache:   opts.Caching,</span></span>
<span class="line"><span>		timeout: opts.Timeout,</span></span>
<span class="line"><span>	}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用这种方式，虽然只需要实现一个函数来创建实例，但是也有缺点：为了创建Connection实例，每次我们都要创建ConnectionOptions，操作起来比较麻烦。</p><p>那么有没有更优雅的解决方法呢？答案当然是有的，就是使用选项模式来创建实例。以下代码通过选项模式实现上述功能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package options</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Connection struct {</span></span>
<span class="line"><span>	addr    string</span></span>
<span class="line"><span>	cache   bool</span></span>
<span class="line"><span>	timeout time.Duration</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>	defaultTimeout = 10</span></span>
<span class="line"><span>	defaultCaching = false</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type options struct {</span></span>
<span class="line"><span>	timeout time.Duration</span></span>
<span class="line"><span>	caching bool</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Option overrides behavior of Connect.</span></span>
<span class="line"><span>type Option interface {</span></span>
<span class="line"><span>	apply(*options)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type optionFunc func(*options)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (f optionFunc) apply(o *options) {</span></span>
<span class="line"><span>	f(o)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithTimeout(t time.Duration) Option {</span></span>
<span class="line"><span>	return optionFunc(func(o *options) {</span></span>
<span class="line"><span>		o.timeout = t</span></span>
<span class="line"><span>	})</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func WithCaching(cache bool) Option {</span></span>
<span class="line"><span>	return optionFunc(func(o *options) {</span></span>
<span class="line"><span>		o.caching = cache</span></span>
<span class="line"><span>	})</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Connect creates a connection.</span></span>
<span class="line"><span>func NewConnect(addr string, opts ...Option) (*Connection, error) {</span></span>
<span class="line"><span>	options := options{</span></span>
<span class="line"><span>		timeout: defaultTimeout,</span></span>
<span class="line"><span>		caching: defaultCaching,</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for _, o := range opts {</span></span>
<span class="line"><span>		o.apply(&amp;options)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return &amp;Connection{</span></span>
<span class="line"><span>		addr:    addr,</span></span>
<span class="line"><span>		cache:   options.caching,</span></span>
<span class="line"><span>		timeout: options.timeout,</span></span>
<span class="line"><span>	}, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面的代码中，首先我们定义了 <code>options</code> 结构体，它携带了timeout、caching两个属性。接下来，我们通过 <code>NewConnect</code> 创建了一个连接， <code>NewConnect</code> 函数中先创建了一个带有默认值的 <code>options</code> 结构体变量，并通过调用</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for _, o := range opts {</span></span>
<span class="line"><span>    o.apply(&amp;options)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>来修改所创建的 <code>options</code> 结构体变量。</p><p>需要修改的属性，是在 <code>NewConnect</code> 时，通过Option类型的选项参数传递进来的。可以通过 <code>WithXXX</code> 函数来创建Option类型的选项参数：WithTimeout、WithCaching。</p><p>Option类型的选项参数需要实现 <code>apply(*options)</code> 函数，结合WithTimeout、WithCaching函数的返回值和optionFunc的apply方法实现，可以知道 <code>o.apply(&amp;options)</code> 其实就是把WithTimeout、WithCaching传入的参数赋值给options结构体变量，以此动态地设置options结构体变量的属性。</p><p>这里还有一个好处：我们可以在apply函数中自定义赋值逻辑，例如 <code>o.timeout = 100 * t</code>。通过这种方式，我们会有更大的灵活性来设置结构体的属性。</p><p>选项模式有很多优点，例如：支持传递多个参数，并且在参数发生变化时保持兼容性；支持任意顺序传递参数；支持默认值；方便扩展；通过WithXXX的函数命名，可以使参数意义更加明确，等等。</p><p>不过，为了实现选项模式，我们增加了很多代码，所以在开发中，要根据实际场景选择是否使用选项模式。选项模式通常适用于以下场景：</p><ul><li>结构体参数很多，创建结构体时，我们期望创建一个携带默认值的结构体变量，并选择性修改其中一些参数的值。</li><li>结构体参数经常变动，变动时我们又不想修改创建实例的函数。例如：结构体新增一个retry参数，但是又不想在NewConnect入参列表中添加 <code>retry int</code> 这样的参数声明。</li></ul><p>如果结构体参数比较少，可以慎重考虑要不要采用选项模式。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>设计模式，是业界沉淀下来的针对特定场景的最佳解决方案。在软件领域，GoF首次系统化提出了3大类设计模式：创建型模式、结构型模式、行为型模式。</p><p>这一讲，我介绍了Go项目开发中6种常用的设计模式。每种设计模式解决某一类场景，我给你总结成了一张表格，你可以根据自己的需要进行选择。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/386238/1e32f9d8318c8968b50e9ea7e89bbe01.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/386238/1e32f9d8318c8968b50e9ea7e89bbe01.png" alt=""></a></p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>你当前开发的项目中，哪些可以用单例模式、工厂模式、选项模式来重新实现呢？如果有的话，我建议你试着重写下这部分代码。</li><li>除了这一讲我们学习的 6 种设计模式之外，你还用过其他的设计模式吗？欢迎你在留言区和我分享下你的经验，或者你踩过的坑。</li></ol><p>欢迎你在留言区与我交流讨论，我们下一讲见。</p>`,112)])])}const h=s(t,[["render",l]]);export{g as __pageData,h as default};
