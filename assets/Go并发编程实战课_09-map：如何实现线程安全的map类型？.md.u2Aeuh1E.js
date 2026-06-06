import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"09 | map：如何实现线程安全的map类型？","description":"","frontmatter":{},"headers":[{"level":2,"title":"map的基本使用方法","slug":"map的基本使用方法","link":"#map的基本使用方法","children":[]},{"level":2,"title":"使用map的2种常见错误","slug":"使用map的2种常见错误","link":"#使用map的2种常见错误","children":[{"level":3,"title":"常见错误一：未初始化","slug":"常见错误一-未初始化","link":"#常见错误一-未初始化","children":[]},{"level":3,"title":"常见错误二：并发读写","slug":"常见错误二-并发读写","link":"#常见错误二-并发读写","children":[]}]},{"level":2,"title":"如何实现线程安全的map类型？","slug":"如何实现线程安全的map类型","link":"#如何实现线程安全的map类型","children":[{"level":3,"title":"加读写锁：扩展map，支持并发读写","slug":"加读写锁-扩展map-支持并发读写","link":"#加读写锁-扩展map-支持并发读写","children":[]},{"level":3,"title":"分片加锁：更高效的并发map","slug":"分片加锁-更高效的并发map","link":"#分片加锁-更高效的并发map","children":[]}]},{"level":2,"title":"应对特殊场景的sync.Map","slug":"应对特殊场景的sync-map","link":"#应对特殊场景的sync-map","children":[{"level":3,"title":"sync.Map的实现","slug":"sync-map的实现","link":"#sync-map的实现","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Go并发编程实战课/09-map：如何实现线程安全的map类型？.md","filePath":"Go并发编程实战课/09-map：如何实现线程安全的map类型？.md","lastUpdated":1779815724000}'),l={name:"Go并发编程实战课/09-map：如何实现线程安全的map类型？.md"};function i(t,a,c,r,o,d){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_09-map-如何实现线程安全的map类型" tabindex="-1">09 | map：如何实现线程安全的map类型？ <a class="header-anchor" href="#_09-map-如何实现线程安全的map类型" aria-label="Permalink to &quot;09 | map：如何实现线程安全的map类型？&quot;">​</a></h1><p>你好，我是鸟窝。</p><p>哈希表（Hash Table）这个数据结构，我们已经非常熟悉了。它实现的就是key-value之间的映射关系，主要提供的方法包括Add、Lookup、Delete等。因为这种数据结构是一个基础的数据结构，每个key都会有一个唯一的索引值，通过索引可以很快地找到对应的值，所以使用哈希表进行数据的插入和读取都是很快的。Go语言本身就内建了这样一个数据结构，也就是 <strong>map数据类型</strong>。</p><p>今天呢，我们就先来学习Go语言内建的这个map类型，了解它的基本使用方法和使用陷阱，然后再学习如何实现线程安全的map类型，最后我还会给你介绍Go标准库中线程安全的sync.Map类型。学完了这节课，你可以学会几种可以并发访问的map类型。</p><h2 id="map的基本使用方法" tabindex="-1">map的基本使用方法 <a class="header-anchor" href="#map的基本使用方法" aria-label="Permalink to &quot;map的基本使用方法&quot;">​</a></h2><p>Go内建的map类型如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>map[K]V</span></span></code></pre></div><p>其中， <strong>key类型的K必须是可比较的</strong>（comparable），也就是可以通过 == 和 !=操作符进行比较；value的值和类型无所谓，可以是任意的类型，或者为nil。</p><p>在Go语言中，bool、整数、浮点数、复数、字符串、指针、Channel、接口都是可比较的，包含可比较元素的struct和数组，这俩也是可比较的，而slice、map、函数值都是不可比较的。</p><p>那么，上面这些可比较的数据类型都可以作为map的key吗？显然不是。通常情况下，我们会选择内建的基本类型，比如整数、字符串做key的类型，因为这样最方便。</p><p>这里有一点需要注意，如果使用struct类型做key其实是有坑的，因为如果struct的某个字段值修改了，查询map时无法获取它add进去的值，如下面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type mapKey struct {</span></span>
<span class="line"><span>    key int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var m = make(map[mapKey]string)</span></span>
<span class="line"><span>    var key = mapKey{10}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m[key] = &quot;hello&quot;</span></span>
<span class="line"><span>    fmt.Printf(&quot;m[key]=%s\\n&quot;, m[key])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 修改key的字段的值后再次查询map，无法获取刚才add进去的值</span></span>
<span class="line"><span>    key.key = 100</span></span>
<span class="line"><span>    fmt.Printf(&quot;再次查询m[key]=%s\\n&quot;, m[key])</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那该怎么办呢？如果要使用struct作为key，我们要保证struct对象在逻辑上是不可变的，这样才会保证map的逻辑没有问题。</p><p>以上就是选取key类型的注意点了。接下来，我们看一下使用map[key]函数时需要注意的一个知识点。 <strong>在Go中，map[key]函数返回结果可以是一个值，也可以是两个值</strong>，这是容易让人迷惑的地方。原因在于，如果获取一个不存在的key对应的值时，会返回零值。为了区分真正的零值和key不存在这两种情况，可以根据第二个返回值来区分，如下面的代码的第6行、第7行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var m = make(map[string]int)</span></span>
<span class="line"><span>    m[&quot;a&quot;] = 0</span></span>
<span class="line"><span>    fmt.Printf(&quot;a=%d; b=%d\\n&quot;, m[&quot;a&quot;], m[&quot;b&quot;])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    av, aexisted := m[&quot;a&quot;]</span></span>
<span class="line"><span>    bv, bexisted := m[&quot;b&quot;]</span></span>
<span class="line"><span>    fmt.Printf(&quot;a=%d, existed: %t; b=%d, existed: %t\\n&quot;, av, aexisted, bv, bexisted)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>map是无序的，所以当遍历一个map对象的时候，迭代的元素的顺序是不确定的，无法保证两次遍历的顺序是一样的，也不能保证和插入的顺序一致。那怎么办呢？如果我们想要按照key的顺序获取map的值，需要先取出所有的key进行排序，然后按照这个排序的key依次获取对应的值。而如果我们想要保证元素有序，比如按照元素插入的顺序进行遍历，可以使用辅助的数据结构，比如 <a href="https://github.com/elliotchance/orderedmap" target="_blank" rel="noreferrer">orderedmap</a>，来记录插入顺序。</p><p>好了，总结下关于map我们需要掌握的内容：map的类型是map[key]，key类型的K必须是可比较的，通常情况下，我们会选择内建的基本类型，比如整数、字符串做key的类型。如果要使用struct作为key，我们要保证struct对象在逻辑上是不可变的。在Go中，map[key]函数返回结果可以是一个值，也可以是两个值。map是无序的，如果我们想要保证遍历map时元素有序，可以使用辅助的数据结构，比如 <a href="https://github.com/elliotchance/orderedmap" target="_blank" rel="noreferrer">orderedmap</a>。</p><h2 id="使用map的2种常见错误" tabindex="-1">使用map的2种常见错误 <a class="header-anchor" href="#使用map的2种常见错误" aria-label="Permalink to &quot;使用map的2种常见错误&quot;">​</a></h2><p>那接下来，我们来看使用map最常犯的两个错误，就是 <strong>未初始化</strong> 和 <strong>并发读写</strong>。</p><h3 id="常见错误一-未初始化" tabindex="-1">常见错误一：未初始化 <a class="header-anchor" href="#常见错误一-未初始化" aria-label="Permalink to &quot;常见错误一：未初始化&quot;">​</a></h3><p>和slice或者Mutex、RWmutex等struct类型不同，map对象必须在使用之前初始化。如果不初始化就直接赋值的话，会出现panic异常，比如下面的例子，m实例还没有初始化就直接进行操作会导致panic（第3行）:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var m map[int]int</span></span>
<span class="line"><span>    m[100] = 100</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>解决办法就是在第2行初始化这个实例（m := make(map[int]int)）。</p><p>从一个nil的map对象中获取值不会panic，而是会得到零值，所以下面的代码不会报错:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var m map[int]int</span></span>
<span class="line"><span>    fmt.Println(m[100])</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个例子很简单，我们可以意识到map的初始化问题。但有时候map作为一个struct字段的时候，就很容易忘记初始化了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Counter struct {</span></span>
<span class="line"><span>    Website      string</span></span>
<span class="line"><span>    Start        time.Time</span></span>
<span class="line"><span>    PageCounters map[string]int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    var c Counter</span></span>
<span class="line"><span>    c.Website = &quot;baidu.com&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    c.PageCounters[&quot;/&quot;]++</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，关于初始化这一点，我再强调一下，目前还没有工具可以检查，我们只能记住“ <strong>别忘记初始化</strong>”这一条规则。</p><h3 id="常见错误二-并发读写" tabindex="-1">常见错误二：并发读写 <a class="header-anchor" href="#常见错误二-并发读写" aria-label="Permalink to &quot;常见错误二：并发读写&quot;">​</a></h3><p>对于map类型，另一个很容易犯的错误就是并发访问问题。这个易错点，相当令人讨厌，如果没有注意到并发问题，程序在运行的时候就有可能出现并发读写导致的panic。</p><p>Go内建的map对象不是线程（goroutine）安全的，并发读写的时候运行时会有检查，遇到并发问题就会导致panic。</p><p>我们一起看一个并发访问map实例导致panic的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var m = make(map[int]int,10) // 初始化一个map</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        for {</span></span>
<span class="line"><span>            m[1] = 1 //设置key</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        for {</span></span>
<span class="line"><span>            _ = m[2] //访问这个map</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    select {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>虽然这段代码看起来是读写goroutine各自操作不同的元素，貌似map也没有扩容的问题，但是运行时检测到同时对map对象有并发访问，就会直接panic。panic信息会告诉我们代码中哪一行有读写问题，根据这个错误信息你就能快速定位出来是哪一个map对象在哪里出的问题了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/301174/82fb958bb73128cf8afc438de4acc862.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/301174/82fb958bb73128cf8afc438de4acc862.png" alt=""></a></p><p>这个错误非常常见，是几乎每个人都会踩到的坑。其实，不只是我们写代码时容易犯这个错，一些知名的项目中也是屡次出现这个问题，比如Docker issue 40772，在删除map对象的元素时忘记了加锁：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/301174/60642481f9707520045991030d0f00ce.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/301174/60642481f9707520045991030d0f00ce.png" alt=""></a></p><p>Docker issue 40772，Docker issue 35588、34540、39643等等，也都有并发读写map的问题。</p><p>除了Docker中，Kubernetes的issue 84431、72464、68647、64484、48045、45593、37560等，以及TiDB的issue 14960和17494等，也出现了这个错误。</p><p>这么多人都会踩的坑，有啥解决方案吗？肯定有，那接下来，我们就继续来看如何解决内建map的并发读写问题。</p><h2 id="如何实现线程安全的map类型" tabindex="-1">如何实现线程安全的map类型？ <a class="header-anchor" href="#如何实现线程安全的map类型" aria-label="Permalink to &quot;如何实现线程安全的map类型？&quot;">​</a></h2><p>避免map并发读写panic的方式之一就是加锁，考虑到读写性能，可以使用读写锁提供性能。</p><h3 id="加读写锁-扩展map-支持并发读写" tabindex="-1">加读写锁：扩展map，支持并发读写 <a class="header-anchor" href="#加读写锁-扩展map-支持并发读写" aria-label="Permalink to &quot;加读写锁：扩展map，支持并发读写&quot;">​</a></h3><p>比较遗憾的是，目前Go还没有正式发布泛型特性，我们还不能实现一个通用的支持泛型的加锁map。但是，将要发布的泛型方案已经可以验证测试了，离发布也不远了，也许发布之后sync.Map就支持泛型了。</p><p>当然了，如果没有泛型支持，我们也能解决这个问题。我们可以通过interface{}来模拟泛型，但还是要涉及接口和具体类型的转换，比较复杂，还不如将要发布的泛型方案更直接、性能更好。</p><p>这里我以一个具体的map类型为例，来演示利用读写锁实现线程安全的map[int]int类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type RWMap struct { // 一个读写锁保护的线程安全的map</span></span>
<span class="line"><span>    sync.RWMutex // 读写锁保护下面的map字段</span></span>
<span class="line"><span>    m map[int]int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 新建一个RWMap</span></span>
<span class="line"><span>func NewRWMap(n int) *RWMap {</span></span>
<span class="line"><span>    return &amp;RWMap{</span></span>
<span class="line"><span>        m: make(map[int]int, n),</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (m *RWMap) Get(k int) (int, bool) { //从map中读取一个值</span></span>
<span class="line"><span>    m.RLock()</span></span>
<span class="line"><span>    defer m.RUnlock()</span></span>
<span class="line"><span>    v, existed := m.m[k] // 在锁的保护下从map中读取</span></span>
<span class="line"><span>    return v, existed</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *RWMap) Set(k int, v int) { // 设置一个键值对</span></span>
<span class="line"><span>    m.Lock()              // 锁保护</span></span>
<span class="line"><span>    defer m.Unlock()</span></span>
<span class="line"><span>    m.m[k] = v</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *RWMap) Delete(k int) { //删除一个键</span></span>
<span class="line"><span>    m.Lock()                   // 锁保护</span></span>
<span class="line"><span>    defer m.Unlock()</span></span>
<span class="line"><span>    delete(m.m, k)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *RWMap) Len() int { // map的长度</span></span>
<span class="line"><span>    m.RLock()   // 锁保护</span></span>
<span class="line"><span>    defer m.RUnlock()</span></span>
<span class="line"><span>    return len(m.m)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *RWMap) Each(f func(k, v int) bool) { // 遍历map</span></span>
<span class="line"><span>    m.RLock()             //遍历期间一直持有读锁</span></span>
<span class="line"><span>    defer m.RUnlock()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for k, v := range m.m {</span></span>
<span class="line"><span>        if !f(k, v) {</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>正如这段代码所示，对map对象的操作，无非就是增删改查和遍历等几种常见操作。我们可以把这些操作分为读和写两类，其中，查询和遍历可以看做读操作，增加、修改和删除可以看做写操作。如例子所示，我们可以通过读写锁对相应的操作进行保护。</p><h3 id="分片加锁-更高效的并发map" tabindex="-1">分片加锁：更高效的并发map <a class="header-anchor" href="#分片加锁-更高效的并发map" aria-label="Permalink to &quot;分片加锁：更高效的并发map&quot;">​</a></h3><p>虽然使用读写锁可以提供线程安全的map，但是在大量并发读写的情况下，锁的竞争会非常激烈。我在 <a href="https://time.geekbang.org/column/article/296793" target="_blank" rel="noreferrer">第4讲</a> 中提到过，锁是性能下降的万恶之源之一。</p><p>在并发编程中，我们的一条原则就是尽量减少锁的使用。一些单线程单进程的应用（比如Redis等），基本上不需要使用锁去解决并发线程访问的问题，所以可以取得很高的性能。但是对于Go开发的应用程序来说，并发是常用的一个特性，在这种情况下，我们能做的就是， <strong>尽量减少锁的粒度和锁的持有时间</strong>。</p><p>你可以优化业务处理的代码，以此来减少锁的持有时间，比如将串行的操作变成并行的子任务执行。不过，这就是另外的故事了，今天我们还是主要讲对同步原语的优化，所以这里我重点讲如何减少锁的粒度。</p><p><strong>减少锁的粒度常用的方法就是分片</strong>（Shard），将一把锁分成几把锁，每个锁控制一个分片。Go比较知名的分片并发map的实现是 <a href="https://github.com/orcaman/concurrent-map" target="_blank" rel="noreferrer">orcaman/concurrent-map</a>。</p><p>它默认采用32个分片， <strong>GetShard是一个关键的方法，能够根据key计算出分片索引</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    var SHARD_COUNT = 32</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 分成SHARD_COUNT个分片的map</span></span>
<span class="line"><span>	type ConcurrentMap []*ConcurrentMapShared</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 通过RWMutex保护的线程安全的分片，包含一个map</span></span>
<span class="line"><span>	type ConcurrentMapShared struct {</span></span>
<span class="line"><span>		items        map[string]interface{}</span></span>
<span class="line"><span>		sync.RWMutex // Read Write mutex, guards access to internal map.</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 创建并发map</span></span>
<span class="line"><span>	func New() ConcurrentMap {</span></span>
<span class="line"><span>		m := make(ConcurrentMap, SHARD_COUNT)</span></span>
<span class="line"><span>		for i := 0; i &lt; SHARD_COUNT; i++ {</span></span>
<span class="line"><span>			m[i] = &amp;ConcurrentMapShared{items: make(map[string]interface{})}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return m</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 根据key计算分片索引</span></span>
<span class="line"><span>	func (m ConcurrentMap) GetShard(key string) *ConcurrentMapShared {</span></span>
<span class="line"><span>		return m[uint(fnv32(key))%uint(SHARD_COUNT)]</span></span>
<span class="line"><span>	}</span></span></code></pre></div><p>增加或者查询的时候，首先根据分片索引得到分片对象，然后对分片对象加锁进行操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (m ConcurrentMap) Set(key string, value interface{}) {</span></span>
<span class="line"><span>		// 根据key计算出对应的分片</span></span>
<span class="line"><span>		shard := m.GetShard(key)</span></span>
<span class="line"><span>		shard.Lock() //对这个分片加锁，执行业务操作</span></span>
<span class="line"><span>		shard.items[key] = value</span></span>
<span class="line"><span>		shard.Unlock()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m ConcurrentMap) Get(key string) (interface{}, bool) {</span></span>
<span class="line"><span>		// 根据key计算出对应的分片</span></span>
<span class="line"><span>		shard := m.GetShard(key)</span></span>
<span class="line"><span>		shard.RLock()</span></span>
<span class="line"><span>		// 从这个分片读取key的值</span></span>
<span class="line"><span>		val, ok := shard.items[key]</span></span>
<span class="line"><span>		shard.RUnlock()</span></span>
<span class="line"><span>		return val, ok</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，除了GetShard方法，ConcurrentMap还提供了很多其他的方法。这些方法都是通过计算相应的分片实现的，目的是保证把锁的粒度限制在分片上。</p><p>好了，到这里我们就学会了解决map并发panic的两个方法：加锁和分片。</p><p><strong>在我个人使用并发map的过程中，加锁和分片加锁这两种方案都比较常用，如果是追求更高的性能，显然是分片加锁更好，因为它可以降低锁的粒度，进而提高访问此map对象的吞吐。如果并发性能要求不是那么高的场景，简单加锁方式更简单。</strong></p><p>接下来，我会继续给你介绍sync.Map，这是Go官方线程安全map的标准实现。虽然是官方标准，反而是不常用的，为什么呢？一句话来说就是map要解决的场景很难描述，很多时候在做抉择时根本就不知道该不该用它。但是呢，确实有一些特定的场景，我们需要用到sync.Map来实现，所以还是很有必要学习这个知识点。具体什么场景呢，我慢慢给你道来。</p><h2 id="应对特殊场景的sync-map" tabindex="-1">应对特殊场景的sync.Map <a class="header-anchor" href="#应对特殊场景的sync-map" aria-label="Permalink to &quot;应对特殊场景的sync.Map&quot;">​</a></h2><p>Go内建的map类型不是线程安全的，所以Go 1.9中增加了一个线程安全的map，也就是sync.Map。但是，我们一定要记住，这个sync.Map并不是用来替换内建的map类型的，它只能被应用在一些特殊的场景里。</p><p>那这些特殊的场景是啥呢？ <a href="https://golang.org/pkg/sync/#Map" target="_blank" rel="noreferrer">官方的文档</a> 中指出，在以下两个场景中使用sync.Map，会比使用map+RWMutex的方式，性能要好得多：</p><ol><li>只会增长的缓存系统中，一个key只写入一次而被读很多次；</li><li>多个goroutine为不相交的键集读、写和重写键值对。</li></ol><p>这两个场景说得都比较笼统，而且，这些场景中还包含了一些特殊的情况。所以，官方建议你针对自己的场景做性能评测，如果确实能够显著提高性能，再使用sync.Map。</p><p>这么来看，我们能用到sync.Map的场景确实不多。即使是sync.Map的作者Bryan C. Mills，也很少使用sync.Map，即便是在使用sync.Map的时候，也是需要临时查询它的API，才能清楚记住它的功能。所以，我们可以把sync.Map看成一个生产环境中很少使用的同步原语。</p><h3 id="sync-map的实现" tabindex="-1">sync.Map的实现 <a class="header-anchor" href="#sync-map的实现" aria-label="Permalink to &quot;sync.Map的实现&quot;">​</a></h3><p>那sync.Map是怎么实现的呢？它是如何解决并发问题提升性能的呢？其实sync.Map的实现有几个优化点，这里先列出来，我们后面慢慢分析。</p><ul><li>空间换时间。通过冗余的两个数据结构（只读的read字段、可写的dirty），来减少加锁对性能的影响。对只读字段（read）的操作不需要加锁。</li><li>优先从read字段读取、更新、删除，因为对read字段的读取不需要锁。</li><li>动态调整。miss次数多了之后，将dirty数据提升为read，避免总是从dirty中加锁读取。</li><li>double-checking。加锁之后先还要再检查read字段，确定真的不存在才操作dirty字段。</li><li>延迟删除。删除一个键值只是打标记，只有在提升dirty字段为read字段的时候才清理删除的数据。</li></ul><p>要理解sync.Map这些优化点，我们还是得深入到它的设计和实现上，去学习它的处理方式。</p><p>我们先看一下map的数据结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Map struct {</span></span>
<span class="line"><span>    mu Mutex</span></span>
<span class="line"><span>    // 基本上你可以把它看成一个安全的只读的map</span></span>
<span class="line"><span>    // 它包含的元素其实也是通过原子操作更新的，但是已删除的entry就需要加锁操作了</span></span>
<span class="line"><span>    read atomic.Value // readOnly</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 包含需要加锁才能访问的元素</span></span>
<span class="line"><span>    // 包括所有在read字段中但未被expunged（删除）的元素以及新加的元素</span></span>
<span class="line"><span>    dirty map[interface{}]*entry</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 记录从read中读取miss的次数，一旦miss数和dirty长度一样了，就会把dirty提升为read，并把dirty置空</span></span>
<span class="line"><span>    misses int</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type readOnly struct {</span></span>
<span class="line"><span>    m       map[interface{}]*entry</span></span>
<span class="line"><span>    amended bool // 当dirty中包含read没有的数据时为true，比如新增一条数据</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// expunged是用来标识此项已经删掉的指针</span></span>
<span class="line"><span>// 当map中的一个项目被删除了，只是把它的值标记为expunged，以后才有机会真正删除此项</span></span>
<span class="line"><span>var expunged = unsafe.Pointer(new(interface{}))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// entry代表一个值</span></span>
<span class="line"><span>type entry struct {</span></span>
<span class="line"><span>    p unsafe.Pointer // *interface{}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果dirty字段非nil的话，map的read字段和dirty字段会包含相同的非expunged的项，所以如果通过read字段更改了这个项的值，从dirty字段中也会读取到这个项的新值，因为本来它们指向的就是同一个地址。</p><p>dirty包含重复项目的好处就是，一旦miss数达到阈值需要将dirty提升为read的话，只需简单地把dirty设置为read对象即可。不好的一点就是，当创建新的dirty对象的时候，需要逐条遍历read，把非expunged的项复制到dirty对象中。</p><p>接下来，我们就深入到源码去看看sync.map的实现。在看这部分源码的过程中，我们只要重点关注Store、Load和Delete这3个核心的方法就可以了。</p><p>Store、Load和Delete这三个核心函数的操作都是先从read字段中处理的，因为读取read字段的时候不用加锁。</p><h4 id="store方法" tabindex="-1">Store方法 <a class="header-anchor" href="#store方法" aria-label="Permalink to &quot;Store方法&quot;">​</a></h4><p>我们先来看Store方法，它是用来设置一个键值对，或者更新一个键值对的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (m *Map) Store(key, value interface{}) {</span></span>
<span class="line"><span>    read, _ := m.read.Load().(readOnly)</span></span>
<span class="line"><span>    // 如果read字段包含这个项，说明是更新，cas更新项目的值即可</span></span>
<span class="line"><span>    if e, ok := read.m[key]; ok &amp;&amp; e.tryStore(&amp;value) {</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // read中不存在，或者cas更新失败，就需要加锁访问dirty了</span></span>
<span class="line"><span>    m.mu.Lock()</span></span>
<span class="line"><span>    read, _ = m.read.Load().(readOnly)</span></span>
<span class="line"><span>    if e, ok := read.m[key]; ok { // 双检查，看看read是否已经存在了</span></span>
<span class="line"><span>        if e.unexpungeLocked() {</span></span>
<span class="line"><span>            // 此项目先前已经被删除了，通过将它的值设置为nil，标记为unexpunged</span></span>
<span class="line"><span>            m.dirty[key] = e</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        e.storeLocked(&amp;value) // 更新</span></span>
<span class="line"><span>    } else if e, ok := m.dirty[key]; ok { // 如果dirty中有此项</span></span>
<span class="line"><span>        e.storeLocked(&amp;value) // 直接更新</span></span>
<span class="line"><span>    } else { // 否则就是一个新的key</span></span>
<span class="line"><span>        if !read.amended { //如果dirty为nil</span></span>
<span class="line"><span>            // 需要创建dirty对象，并且标记read的amended为true,</span></span>
<span class="line"><span>            // 说明有元素它不包含而dirty包含</span></span>
<span class="line"><span>            m.dirtyLocked()</span></span>
<span class="line"><span>            m.read.Store(readOnly{m: read.m, amended: true})</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        m.dirty[key] = newEntry(value) //将新值增加到dirty对象中</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    m.mu.Unlock()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，Store既可以是新增元素，也可以是更新元素。如果运气好的话，更新的是已存在的未被删除的元素，直接更新即可，不会用到锁。如果运气不好，需要更新（重用）删除的对象、更新还未提升的dirty中的对象，或者新增加元素的时候就会使用到了锁，这个时候，性能就会下降。</p><p>所以从这一点来看，sync.Map适合那些只会增长的缓存系统，可以进行更新，但是不要删除，并且不要频繁地增加新元素。</p><p>新加的元素需要放入到dirty中，如果dirty为nil，那么需要从read字段中复制出来一个dirty对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (m *Map) dirtyLocked() {</span></span>
<span class="line"><span>    if m.dirty != nil { // 如果dirty字段已经存在，不需要创建了</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    read, _ := m.read.Load().(readOnly) // 获取read字段</span></span>
<span class="line"><span>    m.dirty = make(map[interface{}]*entry, len(read.m))</span></span>
<span class="line"><span>    for k, e := range read.m { // 遍历read字段</span></span>
<span class="line"><span>        if !e.tryExpungeLocked() { // 把非punged的键值对复制到dirty中</span></span>
<span class="line"><span>            m.dirty[k] = e</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="load方法" tabindex="-1">Load方法 <a class="header-anchor" href="#load方法" aria-label="Permalink to &quot;Load方法&quot;">​</a></h4><p>Load方法用来读取一个key对应的值。它也是从read开始处理，一开始并不需要锁。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (m *Map) Load(key interface{}) (value interface{}, ok bool) {</span></span>
<span class="line"><span>    // 首先从read处理</span></span>
<span class="line"><span>    read, _ := m.read.Load().(readOnly)</span></span>
<span class="line"><span>    e, ok := read.m[key]</span></span>
<span class="line"><span>    if !ok &amp;&amp; read.amended { // 如果不存在并且dirty不为nil(有新的元素)</span></span>
<span class="line"><span>        m.mu.Lock()</span></span>
<span class="line"><span>        // 双检查，看看read中现在是否存在此key</span></span>
<span class="line"><span>        read, _ = m.read.Load().(readOnly)</span></span>
<span class="line"><span>        e, ok = read.m[key]</span></span>
<span class="line"><span>        if !ok &amp;&amp; read.amended {//依然不存在，并且dirty不为nil</span></span>
<span class="line"><span>            e, ok = m.dirty[key]// 从dirty中读取</span></span>
<span class="line"><span>            // 不管dirty中存不存在，miss数都加1</span></span>
<span class="line"><span>            m.missLocked()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        m.mu.Unlock()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if !ok {</span></span>
<span class="line"><span>        return nil, false</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return e.load() //返回读取的对象，e既可能是从read中获得的，也可能是从dirty中获得的</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果幸运的话，我们从read中读取到了这个key对应的值，那么就不需要加锁了，性能会非常好。但是，如果请求的key不存在或者是新加的，就需要加锁从dirty中读取。所以，读取不存在的key会因为加锁而导致性能下降，读取还没有提升的新值的情况下也会因为加锁性能下降。</p><p>其中，missLocked增加miss的时候，如果miss数等于dirty长度，会将dirty提升为read，并将dirty置空。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (m *Map) missLocked() {</span></span>
<span class="line"><span>    m.misses++ // misses计数加一</span></span>
<span class="line"><span>    if m.misses &lt; len(m.dirty) { // 如果没达到阈值(dirty字段的长度),返回</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    m.read.Store(readOnly{m: m.dirty}) //把dirty字段的内存提升为read字段</span></span>
<span class="line"><span>    m.dirty = nil // 清空dirty</span></span>
<span class="line"><span>    m.misses = 0  // misses数重置为0</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="delete方法" tabindex="-1">Delete方法 <a class="header-anchor" href="#delete方法" aria-label="Permalink to &quot;Delete方法&quot;">​</a></h4><p>sync.map的第3个核心方法是Delete方法。在Go 1.15中欧长坤提供了一个LoadAndDelete的实现（ <a href="https://github.com/golang/go/issues/33762" target="_blank" rel="noreferrer">go#issue 33762</a>），所以Delete方法的核心改在了对LoadAndDelete中实现了。</p><p>同样地，Delete方法是先从read操作开始，原因我们已经知道了，因为不需要锁。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (m *Map) LoadAndDelete(key interface{}) (value interface{}, loaded bool) {</span></span>
<span class="line"><span>    read, _ := m.read.Load().(readOnly)</span></span>
<span class="line"><span>    e, ok := read.m[key]</span></span>
<span class="line"><span>    if !ok &amp;&amp; read.amended {</span></span>
<span class="line"><span>        m.mu.Lock()</span></span>
<span class="line"><span>        // 双检查</span></span>
<span class="line"><span>        read, _ = m.read.Load().(readOnly)</span></span>
<span class="line"><span>        e, ok = read.m[key]</span></span>
<span class="line"><span>        if !ok &amp;&amp; read.amended {</span></span>
<span class="line"><span>            e, ok = m.dirty[key]</span></span>
<span class="line"><span>            // 这一行长坤在1.15中实现的时候忘记加上了，导致在特殊的场景下有些key总是没有被回收</span></span>
<span class="line"><span>            delete(m.dirty, key)</span></span>
<span class="line"><span>            // miss数加1</span></span>
<span class="line"><span>            m.missLocked()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        m.mu.Unlock()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if ok {</span></span>
<span class="line"><span>        return e.delete()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return nil, false</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (m *Map) Delete(key interface{}) {</span></span>
<span class="line"><span>    m.LoadAndDelete(key)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func (e *entry) delete() (value interface{}, ok bool) {</span></span>
<span class="line"><span>    for {</span></span>
<span class="line"><span>        p := atomic.LoadPointer(&amp;e.p)</span></span>
<span class="line"><span>        if p == nil || p == expunged {</span></span>
<span class="line"><span>            return nil, false</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if atomic.CompareAndSwapPointer(&amp;e.p, p, nil) {</span></span>
<span class="line"><span>            return *(*interface{})(p), true</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果read中不存在，那么就需要从dirty中寻找这个项目。最终，如果项目存在就删除（将它的值标记为nil）。如果项目不为nil或者没有被标记为expunged，那么还可以把它的值返回。</p><p>最后，我补充一点，sync.map还有一些LoadAndDelete、LoadOrStore、Range等辅助方法，但是没有Len这样查询sync.Map的包含项目数量的方法，并且官方也不准备提供。如果你想得到sync.Map的项目数量的话，你可能不得不通过Range逐个计数。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>Go内置的map类型使用起来很方便，但是它有一个非常致命的缺陷，那就是它存在着并发问题，所以如果有多个goroutine同时并发访问这个map，就会导致程序崩溃。所以Go官方Blog很早就提供了一种加锁的 <a href="https://blog.golang.org/maps#TOC_6." target="_blank" rel="noreferrer">方法</a>，还有后来提供了适用特定场景的线程安全的sync.Map，还有第三方实现的分片式的map，这些方法都可以应用于并发访问的场景。</p><p>这里我给你的建议，也是Go开发者给的建议，就是通过性能测试，看看某种线程安全的map实现是否满足你的需求。</p><p>当然还有一些扩展其它功能的map实现，比如带有过期功能的 <a href="https://github.com/zekroTJA/timedmap" target="_blank" rel="noreferrer">timedmap</a>、使用红黑树实现的key有序的 <a href="https://godoc.org/github.com/emirpasic/gods/maps/treemap" target="_blank" rel="noreferrer">treemap</a> 等，因为和并发问题没有关系，就不详细介绍了。这里我给你提供了链接，你可以自己探索。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/301174/a80408a137b13f934b0dd6f2b6c5cc03.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/301174/a80408a137b13f934b0dd6f2b6c5cc03.jpg" alt=""></a></p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><ol><li><p>为什么sync.Map中的集合核心方法的实现中，如果read中项目不存在，加锁后还要双检查，再检查一次read？</p></li><li><p>你看到sync.map元素删除的时候只是把它的值设置为nil，那么什么时候这个key才会真正从map对象中删除？</p></li></ol><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得有所收获，也欢迎你把今天的内容分享给你的朋友或同事。</p>`,104)])])}const h=n(l,[["render",i]]);export{u as __pageData,h as default};
