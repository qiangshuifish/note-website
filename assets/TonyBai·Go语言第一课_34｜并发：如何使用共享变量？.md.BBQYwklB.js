import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"34｜并发：如何使用共享变量？","description":"","frontmatter":{},"headers":[{"level":2,"title":"sync包低级同步原语可以用在哪？","slug":"sync包低级同步原语可以用在哪","link":"#sync包低级同步原语可以用在哪","children":[]},{"level":2,"title":"sync包中同步原语使用的注意事项","slug":"sync包中同步原语使用的注意事项","link":"#sync包中同步原语使用的注意事项","children":[]},{"level":2,"title":"互斥锁（Mutex）还是读写锁（RWMutex）？","slug":"互斥锁-mutex-还是读写锁-rwmutex","link":"#互斥锁-mutex-还是读写锁-rwmutex","children":[]},{"level":2,"title":"条件变量","slug":"条件变量","link":"#条件变量","children":[]},{"level":2,"title":"原子操作（atomic operations）","slug":"原子操作-atomic-operations","link":"#原子操作-atomic-operations","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"TonyBai·Go语言第一课/34｜并发：如何使用共享变量？.md","filePath":"TonyBai·Go语言第一课/34｜并发：如何使用共享变量？.md","lastUpdated":1779817248000}'),l={name:"TonyBai·Go语言第一课/34｜并发：如何使用共享变量？.md"};function t(h,s,k,e,r,E){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_34-并发-如何使用共享变量" tabindex="-1">34｜并发：如何使用共享变量？ <a class="header-anchor" href="#_34-并发-如何使用共享变量" aria-label="Permalink to &quot;34｜并发：如何使用共享变量？&quot;">​</a></h1><p>你好，我是Tony Bai。</p><p>在前面的讲解中，我们学习了Go的并发实现方案，知道了Go基于Tony Hoare的 <strong>CSP并发模型</strong> 理论，实现了Goroutine、channel等并发原语。</p><p>并且，Go语言之父Rob Pike还有一句经典名言：“不要通过共享内存来通信，应该通过通信来共享内存（Don’t communicate by sharing memory, share memory by communicating）”，这就奠定了Go应用并发设计的主流风格： <strong>使用channel进行不同Goroutine间的通信</strong>。</p><p>不过，Go也并没有彻底放弃基于共享内存的并发模型，而是在提供CSP并发模型原语的同时，还通过标准库的sync包，提供了针对传统的、基于共享内存并发模型的低级同步原语，包括：互斥锁（sync.Mutex）、读写锁（sync.RWMutex）、条件变量（sync.Cond）等，并通过atomic包提供了原子操作原语等等。显然，基于共享内存的并发模型在Go语言中依然有它的“用武之地”。</p><p>所以，在并发的最后一讲，我们就围绕sync包中的几个同步结构与对应的方法，聊聊基于共享内存的并发模型在Go中的应用。</p><p>我们先来看看在哪些场景下，我们需要用到sync包提供的低级同步原语。</p><h2 id="sync包低级同步原语可以用在哪" tabindex="-1">sync包低级同步原语可以用在哪？ <a class="header-anchor" href="#sync包低级同步原语可以用在哪" aria-label="Permalink to &quot;sync包低级同步原语可以用在哪？&quot;">​</a></h2><p>这里我要先强调一句，一般情况下，我建议你优先使用CSP并发模型进行并发程序设计。但是在下面一些场景中，我们依然需要sync包提供的低级同步原语。</p><p><strong>首先是需要高性能的临界区（critical section）同步机制场景。</strong></p><p>在Go中，channel并发原语也可以用于对数据对象访问的同步，我们可以把channel看成是一种高级的同步原语，它自身的实现也是建构在低级同步原语之上的。也正因为如此，channel自身的性能与低级同步原语相比要略微逊色，开销要更大。</p><p>这里，关于sync.Mutex和channel各自实现的临界区同步机制，我做了一个简单的性能基准测试对比，通过对比结果，我们可以很容易看出两者的性能差异：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var cs = 0 // 模拟临界区要保护的数据</span></span>
<span class="line"><span>var mu sync.Mutex</span></span>
<span class="line"><span>var c = make(chan struct{}, 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func criticalSectionSyncByMutex() {</span></span>
<span class="line"><span>    mu.Lock()</span></span>
<span class="line"><span>    cs++</span></span>
<span class="line"><span>    mu.Unlock()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func criticalSectionSyncByChan() {</span></span>
<span class="line"><span>    c &amp;lt;- struct{}{}</span></span>
<span class="line"><span>    cs++</span></span>
<span class="line"><span>    &amp;lt;-c</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkCriticalSectionSyncByMutex(b *testing.B) {</span></span>
<span class="line"><span>    for n := 0; n &amp;lt; b.N; n++ {</span></span>
<span class="line"><span>        criticalSectionSyncByMutex()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkCriticalSectionSyncByMutexInParallel(b *testing.B) {</span></span>
<span class="line"><span>    b.RunParallel(func(pb *testing.PB) {</span></span>
<span class="line"><span>        for pb.Next() {</span></span>
<span class="line"><span>            criticalSectionSyncByMutex()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkCriticalSectionSyncByChan(b *testing.B) {</span></span>
<span class="line"><span>    for n := 0; n &amp;lt; b.N; n++ {</span></span>
<span class="line"><span>        criticalSectionSyncByChan()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkCriticalSectionSyncByChanInParallel(b *testing.B) {</span></span>
<span class="line"><span>    b.RunParallel(func(pb *testing.PB) {</span></span>
<span class="line"><span>        for pb.Next() {</span></span>
<span class="line"><span>            criticalSectionSyncByChan()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这个对比测试（Go 1.17），我们得到：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$go test -bench .</span></span>
<span class="line"><span>goos: darwin</span></span>
<span class="line"><span>goarch: amd64</span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span>BenchmarkCriticalSectionSyncByMutex-8             	88083549	        13.64 ns/op</span></span>
<span class="line"><span>BenchmarkCriticalSectionSyncByMutexInParallel-8   	22337848	        55.29 ns/op</span></span>
<span class="line"><span>BenchmarkCriticalSectionSyncByChan-8              	28172056	        42.48 ns/op</span></span>
<span class="line"><span>BenchmarkCriticalSectionSyncByChanInParallel-8    	 5722972	       208.1 ns/op</span></span>
<span class="line"><span>PASS</span></span></code></pre></div><p>通过这个对比实验，我们可以看到，无论是在单Goroutine情况下，还是在并发测试情况下， <code>sync.Mutex</code> 实现的同步机制的性能，都要比channel实现的高出三倍多。</p><p>因此，通常在需要高性能的临界区（critical section）同步机制的情况下，sync包提供的低级同步原语更为适合。</p><p><strong>第二种就是在不想转移结构体对象所有权，但又要保证结构体内部状态数据的同步访问的场景。</strong></p><p>基于channel的并发设计，有一个特点：在Goroutine间通过channel转移数据对象的所有权。所以，只有拥有数据对象所有权（从channel接收到该数据）的Goroutine才可以对该数据对象进行状态变更。</p><p>如果你的设计中没有转移结构体对象所有权，但又要保证结构体内部状态数据在多个Goroutine之间同步访问，那么你可以使用sync包提供的低级同步原语来实现，比如最常用的 <code>sync.Mutex</code>。</p><p>了解了这些应用场景之后，接着我们就来看看如何使用sync包中的各个同步结构，不过在使用之前，我们需要先看看一个sync包中同步原语使用的注意事项。</p><h2 id="sync包中同步原语使用的注意事项" tabindex="-1">sync包中同步原语使用的注意事项 <a class="header-anchor" href="#sync包中同步原语使用的注意事项" aria-label="Permalink to &quot;sync包中同步原语使用的注意事项&quot;">​</a></h2><p>在sync包的注释中（在 <code>$GOROOT/src/sync/mutex.go</code> 文件的头部注释），我们看到这样一行说明：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Values containing the types defined in this package should not be copied.</span></span></code></pre></div><p>翻译过来就是：“不应复制那些包含了此包中类型的值”。</p><p>在sync包的其他源文件中，我们同样看到类似的一些注释：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>// $GOROOT/src/sync/mutex.go</span></span>
<span class="line"><span>// A Mutex must not be copied after first use. （禁止复制首次使用后的Mutex）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// $GOROOT/src/sync/rwmutex.go</span></span>
<span class="line"><span>// A RWMutex must not be copied after first use.（禁止复制首次使用后的RWMutex）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// $GOROOT/src/sync/cond.go</span></span>
<span class="line"><span>// A Cond must not be copied after first use.（禁止复制首次使用后的Cond）</span></span>
<span class="line"><span>... ...</span></span></code></pre></div><p>那么，为什么首次使用Mutex等sync包中定义的结构类型后，我们不应该再对它们进行复制操作呢？我们以Mutex这个同步原语为例，看看它的实现是怎样的。</p><p>Go标准库中sync.Mutex的定义是这样的：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// $GOROOT/src/sync/mutex.go</span></span>
<span class="line"><span>type Mutex struct {</span></span>
<span class="line"><span>    state int32</span></span>
<span class="line"><span>    sema  uint32</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到，Mutex的定义非常简单，由两个整型字段state和sema组成：</p><ul><li>state：表示当前互斥锁的状态；</li><li>sema：用于控制锁状态的信号量。</li></ul><p>初始情况下，Mutex的实例处于 <strong>Unlocked</strong> 状态（state和sema均为0）。对Mutex实例的复制也就是两个整型字段的复制。一旦发生复制，原变量与副本就是两个单独的内存块，各自发挥同步作用，互相就没有了关联。</p><p>如果发生复制后，你仍然认为原变量与副本保护的是同一个数据对象，那可就大错特错了。我们来看一个例子：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> func main() {</span></span>
<span class="line"><span>     var wg sync.WaitGroup</span></span>
<span class="line"><span>     i := 0</span></span>
<span class="line"><span>     var mu sync.Mutex // 负责对i的同步访问</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     wg.Add(1)</span></span>
<span class="line"><span>     // g1</span></span>
<span class="line"><span>     go func(mu1 sync.Mutex) {</span></span>
<span class="line"><span>         mu1.Lock()</span></span>
<span class="line"><span>         i = 10</span></span>
<span class="line"><span>         time.Sleep(10 * time.Second)</span></span>
<span class="line"><span>         fmt.Printf(&quot;g1: i = %d\\n&quot;, i)</span></span>
<span class="line"><span>         mu1.Unlock()</span></span>
<span class="line"><span>         wg.Done()</span></span>
<span class="line"><span>     }(mu)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     time.Sleep(time.Second)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     mu.Lock()</span></span>
<span class="line"><span>     i = 1</span></span>
<span class="line"><span>     fmt.Printf(&quot;g0: i = %d\\n&quot;, i)</span></span>
<span class="line"><span>     mu.Unlock()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     wg.Wait()</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>在这个例子中，我们使用一个sync.Mutex类型变量mu来同步对整型变量i的访问。我们创建一个新Goroutine：g1，g1通过函数参数得到mu的一份拷贝mu1，然后g1会通过mu1来同步对整型变量i的访问。</p><p>那么，g0通过mu和g1通过mu的拷贝mu1，是否能实现对同一个变量i的同步访问呢？我们来看看运行这个示例的运行结果：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>g0: i = 1</span></span>
<span class="line"><span>g1: i = 1</span></span></code></pre></div><p>从结果来看，这个程序并没有实现对i的同步访问，第9行g1对mu1的加锁操作，并没能阻塞第19行g0对mu的加锁。于是，g1刚刚将i赋值为10后，g0就又将i赋值为1了。</p><p>出现这种结果的原因就是我们前面分析的情况，一旦Mutex类型变量被拷贝，原变量与副本就各自发挥作用，互相没有关联了。甚至，如果拷贝的时机不对，比如在一个mutex处于locked的状态时对它进行了拷贝，就会对副本进行加锁操作，将导致加锁的Goroutine永远阻塞下去。</p><p>通过前面这个例子，我们可以很直观地看到：如果对使用过的、sync包中的类型的实例进行复制，并使用了复制后得到的副本，将导致不可预期的结果。所以，在使用sync包中的类型的时候，我们推荐通过 <strong>闭包</strong> 方式，或者是 <strong>传递类型实例（或包裹该类型的类型实例）的地址（指针）</strong> 的方式进行。这就是使用sync包时最值得我们注意的事项。</p><p>接下来，我们就来逐个分析日常使用较多的sync包中同步原语。我们先来看看互斥锁与读写锁。</p><h2 id="互斥锁-mutex-还是读写锁-rwmutex" tabindex="-1">互斥锁（Mutex）还是读写锁（RWMutex）？ <a class="header-anchor" href="#互斥锁-mutex-还是读写锁-rwmutex" aria-label="Permalink to &quot;互斥锁（Mutex）还是读写锁（RWMutex）？&quot;">​</a></h2><p>sync包提供了两种用于临界区同步的原语：互斥锁（Mutex）和读写锁（RWMutex）。它们都是零值可用的数据类型，也就是不需要显式初始化就可以使用，并且使用方法都比较简单。在上面的示例中，我们已经看到了Mutex的应用方法，这里再总结一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var mu sync.Mutex</span></span>
<span class="line"><span>mu.Lock()   // 加锁</span></span>
<span class="line"><span>doSomething()</span></span>
<span class="line"><span>mu.Unlock() // 解锁</span></span></code></pre></div><p>一旦某个Goroutine调用的Mutex执行Lock操作成功，它将成功持有这把互斥锁。这个时候，如果有其他Goroutine执行Lock操作，就会阻塞在这把互斥锁上，直到持有这把锁的Goroutine调用Unlock释放掉这把锁后，才会抢到这把锁的持有权并进入临界区。</p><p>由此，我们也可以得到使用互斥锁的两个原则：</p><ul><li><strong>尽量减少在锁中的操作</strong>。这可以减少其他因Goroutine阻塞而带来的损耗与延迟。</li><li><strong>一定要记得调用Unlock解锁</strong>。忘记解锁会导致程序局部死锁，甚至是整个程序死锁，会导致严重的后果。同时，我们也可以结合第23讲学习到的defer，优雅地执行解锁操作。</li></ul><p>读写锁与互斥锁用法大致相同，只不过多了一组加读锁和解读锁的方法：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var rwmu sync.RWMutex</span></span>
<span class="line"><span>rwmu.RLock()   //加读锁</span></span>
<span class="line"><span>readSomething()</span></span>
<span class="line"><span>rwmu.RUnlock() //解读锁</span></span>
<span class="line"><span>rwmu.Lock()    //加写锁</span></span>
<span class="line"><span>changeSomething()</span></span>
<span class="line"><span>rwmu.Unlock()  //解写锁</span></span></code></pre></div><p>写锁与Mutex的行为十分类似，一旦某Goroutine持有写锁，其他Goroutine无论是尝试加读锁，还是加写锁，都会被阻塞在写锁上。</p><p>但读锁就宽松多了，一旦某个Goroutine持有读锁，它不会阻塞其他尝试加读锁的Goroutine，但加写锁的Goroutine依然会被阻塞住。</p><p>通常， <strong>互斥锁（Mutex）是临界区同步原语的首选</strong>，它常被用来对结构体对象的内部状态、缓存等进行保护，是使用最为广泛的临界区同步原语。相比之下，读写锁的应用就没那么广泛了，只活跃于它擅长的场景下。</p><p>那读写锁（RWMutex）究竟擅长在哪种场景下呢？我们先来看一组基准测试：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var cs1 = 0 // 模拟临界区要保护的数据</span></span>
<span class="line"><span>var mu1 sync.Mutex</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var cs2 = 0 // 模拟临界区要保护的数据</span></span>
<span class="line"><span>var mu2 sync.RWMutex</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkWriteSyncByMutex(b *testing.B) {</span></span>
<span class="line"><span>    b.RunParallel(func(pb *testing.PB) {</span></span>
<span class="line"><span>        for pb.Next() {</span></span>
<span class="line"><span>            mu1.Lock()</span></span>
<span class="line"><span>            cs1++</span></span>
<span class="line"><span>            mu1.Unlock()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkReadSyncByMutex(b *testing.B) {</span></span>
<span class="line"><span>    b.RunParallel(func(pb *testing.PB) {</span></span>
<span class="line"><span>        for pb.Next() {</span></span>
<span class="line"><span>            mu1.Lock()</span></span>
<span class="line"><span>            _ = cs1</span></span>
<span class="line"><span>            mu1.Unlock()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkReadSyncByRWMutex(b *testing.B) {</span></span>
<span class="line"><span>    b.RunParallel(func(pb *testing.PB) {</span></span>
<span class="line"><span>        for pb.Next() {</span></span>
<span class="line"><span>            mu2.RLock()</span></span>
<span class="line"><span>            _ = cs2</span></span>
<span class="line"><span>            mu2.RUnlock()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func BenchmarkWriteSyncByRWMutex(b *testing.B) {</span></span>
<span class="line"><span>    b.RunParallel(func(pb *testing.PB) {</span></span>
<span class="line"><span>        for pb.Next() {</span></span>
<span class="line"><span>            mu2.Lock()</span></span>
<span class="line"><span>            cs2++</span></span>
<span class="line"><span>            mu2.Unlock()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些基准测试都是并发测试，度量的是Mutex、RWMutex在并发下的读写性能。我们分别在cpu=2、8、16、32的情况下运行这个并发性能测试，测试结果如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>goos: darwin</span></span>
<span class="line"><span>goarch: amd64</span></span>
<span class="line"><span>... ...</span></span>
<span class="line"><span>BenchmarkWriteSyncByMutex-2     	73423770	        16.12 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByMutex-2      	84031135	        15.08 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByRWMutex-2    	37182219	        31.87 ns/op</span></span>
<span class="line"><span>BenchmarkWriteSyncByRWMutex-2   	40727782	        29.08 ns/op</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BenchmarkWriteSyncByMutex-8     	22153354	        56.39 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByMutex-8      	24164278	        51.12 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByRWMutex-8    	38589122	        31.17 ns/op</span></span>
<span class="line"><span>BenchmarkWriteSyncByRWMutex-8   	18482208	        65.27 ns/op</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BenchmarkWriteSyncByMutex-16      	20672842	        62.94 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByMutex-16       	19247158	        62.94 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByRWMutex-16     	29978614	        39.98 ns/op</span></span>
<span class="line"><span>BenchmarkWriteSyncByRWMutex-16    	16095952	        78.19 ns/op</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BenchmarkWriteSyncByMutex-32      	20539290	        60.20 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByMutex-32       	18807060	        72.61 ns/op</span></span>
<span class="line"><span>BenchmarkReadSyncByRWMutex-32     	29772936	        40.45 ns/op</span></span>
<span class="line"><span>BenchmarkWriteSyncByRWMutex-32    	13320544	        86.53 ns/op</span></span></code></pre></div><p>通过测试结果对比，我们得到了一些结论：</p><ul><li>并发量较小的情况下，Mutex性能最好；随着并发量增大，Mutex的竞争激烈，导致加锁和解锁性能下降；</li><li>RWMutex的读锁性能并没有随着并发量的增大，而发生较大变化，性能始终恒定在40ns左右；</li><li>在并发量较大的情况下，RWMutex的写锁性能和Mutex、RWMutex读锁相比，是最差的，并且随着并发量增大，RWMutex写锁性能有继续下降趋势。</li></ul><p>由此，我们就可以看出， <strong>读写锁适合应用在具有一定并发量且读多写少的场合</strong>。在大量并发读的情况下，多个Goroutine可以同时持有读锁，从而减少在锁竞争中等待的时间。</p><p>而互斥锁，即便是读请求的场合，同一时刻也只能有一个Goroutine持有锁，其他Goroutine只能阻塞在加锁操作上等待被调度。</p><p>接下来，我们继续看条件变量sync.Cond。</p><h2 id="条件变量" tabindex="-1">条件变量 <a class="header-anchor" href="#条件变量" aria-label="Permalink to &quot;条件变量&quot;">​</a></h2><p><code>sync.Cond</code> 是传统的条件变量原语概念在Go语言中的实现。我们可以把一个条件变量理解为一个容器，这个容器中存放着一个或一组等待着某个条件成立的Goroutine。当条件成立后，这些处于等待状态的Goroutine将得到通知，并被唤醒继续进行后续的工作。这与百米飞人大战赛场上，各位运动员等待裁判员的发令枪声的情形十分类似。</p><p>条件变量是同步原语的一种，如果没有条件变量，开发人员可能需要在Goroutine中通过连续轮询的方式，检查某条件是否为真，这种连续轮询非常消耗资源，因为Goroutine在这个过程中是处于活动状态的，但它的工作又没有进展。</p><p>这里我们先看一个用 <code>sync.Mutex</code> 实现对条件轮询等待的例子：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> signal</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> struct</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ready </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">bool</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> worker</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	fmt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;worker </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">: is working...</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, i)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	time.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sleep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time.Second)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	fmt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;worker </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">: works done</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, i)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> spawnGroup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">f</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">num</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">mu</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Mutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-chan</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> signal {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	c </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> make</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">chan</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> signal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> wg </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">WaitGroup</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt; num; i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		wg.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		go</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">			for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">				mu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Lock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">				if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> !</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ready {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">					mu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unlock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">					time.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sleep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time.Millisecond)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">					continue</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">				}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">				mu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unlock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">				fmt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;worker </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">%d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">: start to work...</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, i)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">				f</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(i)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">				wg.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Done</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">				return</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		}(i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	go</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		wg.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Wait</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		c </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> signal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">struct</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}{})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	}()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	fmt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;start a group of workers...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	mu </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Mutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	c </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> spawnGroup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(worker, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, mu)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	time.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sleep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time.Second) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 模拟ready前的准备工作</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	fmt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;the group of workers start to work...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	mu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Lock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	ready </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	mu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unlock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">c</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	fmt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;the group of workers work done!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>就像前面提到的，轮询的方式开销大，轮询间隔设置的不同，条件检查的及时性也会受到影响。</p><p><code>sync.Cond</code> 为Goroutine在这个场景下提供了另一种可选的、资源消耗更小、使用体验更佳的同步方式。使用条件变量原语，我们可以在实现相同目标的同时，避免对条件的轮询。</p><p>我们用 <code>sync.Cond</code> 对上面的例子进行改造，改造后的代码如下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type signal struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var ready bool</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func worker(i int) {</span></span>
<span class="line"><span>	fmt.Printf(&quot;worker %d: is working...\\n&quot;, i)</span></span>
<span class="line"><span>	time.Sleep(1 * time.Second)</span></span>
<span class="line"><span>	fmt.Printf(&quot;worker %d: works done\\n&quot;, i)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func spawnGroup(f func(i int), num int, groupSignal *sync.Cond) &amp;lt;-chan signal {</span></span>
<span class="line"><span>	c := make(chan signal)</span></span>
<span class="line"><span>	var wg sync.WaitGroup</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for i := 0; i &amp;lt; num; i++ {</span></span>
<span class="line"><span>		wg.Add(1)</span></span>
<span class="line"><span>		go func(i int) {</span></span>
<span class="line"><span>			groupSignal.L.Lock()</span></span>
<span class="line"><span>			for !ready {</span></span>
<span class="line"><span>				groupSignal.Wait()</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			groupSignal.L.Unlock()</span></span>
<span class="line"><span>			fmt.Printf(&quot;worker %d: start to work...\\n&quot;, i)</span></span>
<span class="line"><span>			f(i)</span></span>
<span class="line"><span>			wg.Done()</span></span>
<span class="line"><span>		}(i + 1)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	go func() {</span></span>
<span class="line"><span>		wg.Wait()</span></span>
<span class="line"><span>		c &amp;lt;- signal(struct{}{})</span></span>
<span class="line"><span>	}()</span></span>
<span class="line"><span>	return c</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	fmt.Println(&quot;start a group of workers...&quot;)</span></span>
<span class="line"><span>	groupSignal := sync.NewCond(&amp;sync.Mutex{})</span></span>
<span class="line"><span>	c := spawnGroup(worker, 5, groupSignal)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	time.Sleep(5 * time.Second) // 模拟ready前的准备工作</span></span>
<span class="line"><span>	fmt.Println(&quot;the group of workers start to work...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	groupSignal.L.Lock()</span></span>
<span class="line"><span>	ready = true</span></span>
<span class="line"><span>	groupSignal.Broadcast()</span></span>
<span class="line"><span>	groupSignal.L.Unlock()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&amp;lt;-c</span></span>
<span class="line"><span>	fmt.Println(&quot;the group of workers work done!&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们运行这个示例程序，得到：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>start a group of workers...</span></span>
<span class="line"><span>the group of workers start to work...</span></span>
<span class="line"><span>worker 2: start to work...</span></span>
<span class="line"><span>worker 2: is working...</span></span>
<span class="line"><span>worker 3: start to work...</span></span>
<span class="line"><span>worker 3: is working...</span></span>
<span class="line"><span>worker 1: start to work...</span></span>
<span class="line"><span>worker 1: is working...</span></span>
<span class="line"><span>worker 4: start to work...</span></span>
<span class="line"><span>worker 5: start to work...</span></span>
<span class="line"><span>worker 5: is working...</span></span>
<span class="line"><span>worker 4: is working...</span></span>
<span class="line"><span>worker 4: works done</span></span>
<span class="line"><span>worker 2: works done</span></span>
<span class="line"><span>worker 3: works done</span></span>
<span class="line"><span>worker 1: works done</span></span>
<span class="line"><span>worker 5: works done</span></span>
<span class="line"><span>the group of workers work done!</span></span></code></pre></div><p>我们看到， <code>sync.Cond</code> 实例的初始化，需要一个满足实现了 <code>sync.Locker</code> 接口的类型实例，通常我们使用 <code>sync.Mutex</code>。</p><p>条件变量需要这个互斥锁来同步临界区，保护用作条件的数据。加锁后，各个等待条件成立的Goroutine判断条件是否成立，如果不成立，则调用 <code>sync.Cond</code> 的Wait方法进入等待状态。Wait方法在Goroutine挂起前会进行Unlock操作。</p><p>当main goroutine将 <code>ready</code> 置为true，并调用 <code>sync.Cond</code> 的Broadcast方法后，各个阻塞的Goroutine将被唤醒，并从Wait方法中返回。Wait方法返回前，Wait方法会再次加锁让Goroutine进入临界区。接下来Goroutine会再次对条件数据进行判定，如果条件成立，就会解锁并进入下一个工作阶段；如果条件依旧不成立，那么会再次进入循环体，并调用Wait方法挂起等待。</p><p>和 <code>sync.Mutex</code> 、 <code>sync.RWMutex</code> 等相比， <code>sync.Cond</code> 应用的场景更为有限，只有在需要“等待某个条件成立”的场景下，Cond才有用武之地。</p><p>其实，面向CSP并发模型的channel原语和面向传统共享内存并发模型的sync包提供的原语，已经能够满足Go语言应用并发设计中99.9%的并发同步需求了。而剩余那0.1%的需求，我们可以使用Go标准库提供的atomic包来实现。</p><h2 id="原子操作-atomic-operations" tabindex="-1">原子操作（atomic operations） <a class="header-anchor" href="#原子操作-atomic-operations" aria-label="Permalink to &quot;原子操作（atomic operations）&quot;">​</a></h2><p>atomic包是Go语言给用户提供的原子操作原语的相关接口。原子操作（atomic operations）是相对于普通指令操作而言的。</p><p>我们以一个整型变量自增的语句为例说明一下：</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var a int</span></span>
<span class="line"><span>a++</span></span></code></pre></div><p>a++这行语句需要3条普通机器指令来完成变量a的自增：</p><ul><li>LOAD：将变量从内存加载到CPU寄存器；</li><li>ADD：执行加法指令；</li><li>STORE：将结果存储回原内存地址中。</li></ul><p>这3条普通指令在执行过程中是可以被中断的。而原子操作的指令是不可中断的，它就好比一个事务，要么不执行，一旦执行就一次性全部执行完毕，中间不可分割。也正因为如此，原子操作也可以被用于共享数据的并发同步。</p><p>原子操作由底层硬件直接提供支持，是一种硬件实现的指令级的“事务”，因此相对于操作系统层面和Go运行时层面提供的同步技术而言，它更为原始。</p><p>atomic包封装了CPU实现的部分原子操作指令，为用户层提供体验良好的原子操作函数，因此atomic包中提供的原语更接近硬件底层，也更为低级，它也常被用于实现更为高级的并发同步技术，比如channel和sync包中的同步原语。</p><p>我们以atomic.SwapInt64函数在x86_64平台上的实现为例，看看这个函数的实现方法：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// $GOROOT/src/sync/atomic/doc.go</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SwapInt64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">addr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">new</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">old</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// $GOROOT/src/sync/atomic/asm.s</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TEXT ·</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SwapInt64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),NOSPLIT,$</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        JMP     runtime∕internal∕atomic·</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Xchg64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// $GOROOT/src/runtime/internal/atomic/asm_amd64.s</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TEXT runtime∕internal∕atomic·</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Xchg64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), NOSPLIT, $</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">24</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MOVQ    ptr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FP</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), BX</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MOVQ    new</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FP</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), AX</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        XCHGQ   AX, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MOVQ    AX, ret</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">FP</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        RET</span></span></code></pre></div><p>从函数SwapInt64的实现中，我们可以看到：它基本就是对x86_64 CPU实现的原子操作指令 <code>XCHGQ</code> 的直接封装。</p><p>原子操作的特性，让atomic包也可以被用作对共享数据的并发同步，那么和更为高级的channel以及sync包中原语相比，我们究竟该怎么选择呢？</p><p>我们先来看看atomic包提供了哪些能力。</p><p>atomic包提供了两大类原子操作接口，一类是针对整型变量的，包括有符号整型、无符号整型以及对应的指针类型；另外一类是针对自定义类型的。因此，第一类原子操作接口的存在让atomic包天然适合去实现某一个共享整型变量的并发同步。</p><p>我们再看一个例子：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int64</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> addSyncByAtomic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">delta</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> atomic.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">AddInt64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n1, delta)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> readSyncByAtomic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> atomic.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">LoadInt64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n1)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int64</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rwmu </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RWMutex</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> addSyncByRWMutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">delta</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	rwmu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Lock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	n2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> delta</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	rwmu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unlock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> readSyncByRWMutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int64</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int64</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	rwmu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RLock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	n </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	rwmu.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RUnlock</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BenchmarkAddSyncByAtomic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">b</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">B</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	b.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RunParallel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">pb</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pb.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">			addSyncByAtomic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BenchmarkReadSyncByAtomic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">b</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">B</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	b.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RunParallel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">pb</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pb.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">			readSyncByAtomic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BenchmarkAddSyncByRWMutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">b</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">B</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	b.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RunParallel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">pb</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pb.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">			addSyncByRWMutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BenchmarkReadSyncByRWMutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">b</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">B</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	b.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RunParallel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">func</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">pb</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pb.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Next</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">			readSyncByRWMutex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>我们分别在cpu=2、 8、16、32的情况下运行上述性能基准测试，得到结果如下：</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">goos: darwin</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">goarch: amd64</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     	75426774</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        17.69</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    	1000000000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	         0.7437</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    	39041671</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        30.16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   	41325093</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        28.48</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     	77497987</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        15.25</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    	1000000000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	         0.2395</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    	17702034</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        67.16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   	29966182</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        40.37</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      	57727968</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        20.39</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     	1000000000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	         0.2536</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     	15029635</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        78.61</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    	29722464</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        40.28</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      	58010497</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        20.40</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     	1000000000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	         0.2402</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkAddSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     	11748312</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        93.15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BenchmarkReadSyncByRWMutex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    	29845912</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	        40.54</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">op</span></span></code></pre></div><p>通过这个运行结果，我们可以得出一些结论：</p><ul><li>读写锁的性能随着并发量增大的情况，与前面讲解的sync.RWMutex一致；</li><li>利用原子操作的无锁并发写的性能，随着并发量增大几乎保持恒定；</li><li>利用原子操作的无锁并发读的性能，随着并发量增大有持续提升的趋势，并且性能是读锁的约200倍。</li></ul><p>通过这些结论，我们大致可以看到atomic原子操作的特性：随着并发量提升，使用atomic实现的 <strong>共享变量</strong> 的并发读写性能表现更为稳定，尤其是原子读操作，和sync包中的读写锁原语比起来，atomic表现出了更好的伸缩性和高性能。</p><p>由此，我们也可以看出atomic包更适合 <strong>一些对性能十分敏感、并发量较大且读多写少的场合</strong>。</p><p>不过，atomic原子操作可用来同步的范围有比较大限制，只能同步一个整型变量或自定义类型变量。如果我们要对一个复杂的临界区数据进行同步，那么首选的依旧是sync包中的原语。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天的课讲到这里就结束了，现在我们一起来回顾一下吧。</p><p>虽然Go推荐基于通信来共享内存的并发设计风格，但Go并没有彻底抛弃对基于共享内存并发模型的支持，Go通过标准库的sync包以及atomic包提供了低级同步原语。这些原语有着它们自己的应用场景。</p><p>如果我们考虑使用低级同步原语，一般都是因为低级同步原语可以提供 <strong>更佳的性能表现</strong>，性能基准测试结果告诉我们，使用低级同步原语的性能可以高出channel许多倍。在性能敏感的场景下，我们依然离不开这些低级同步原语。</p><p>在使用sync包提供的同步原语之前，我们一定要牢记这些原语使用的注意事项： <strong>不要复制首次使用后的Mutex/RWMutex/Cond等</strong>。一旦复制，你将很大可能得到意料之外的运行结果。</p><p>sync包中的低级同步原语各有各的擅长领域，你可以记住：</p><ul><li>在具有一定并发量且读多写少的场合使用RWMutex；</li><li>在需要“等待某个条件成立”的场景下使用Cond；</li><li>当你不确定使用什么原语时，那就使用Mutex吧。</li></ul><p>如果你对同步的性能有极致要求，且并发量较大，读多写少，那么可以考虑一下atomic包提供的原子操作函数。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>使用基于共享内存的并发模型时，最令人头疼的可能就是“死锁”问题的存在了。你了解死锁的产生条件么？能编写一个程序模拟一下死锁的发生么？</p><p>欢迎你把这节课分享给更多对Go并发感兴趣的朋友。我是Tony Bai，我们下节课见。</p>`,113)])])}const g=a(l,[["render",t]]);export{d as __pageData,g as default};
