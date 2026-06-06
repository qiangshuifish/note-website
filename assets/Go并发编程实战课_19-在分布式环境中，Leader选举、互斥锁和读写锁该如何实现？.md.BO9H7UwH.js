import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"19 |  在分布式环境中，Leader选举、互斥锁和读写锁该如何实现？","description":"","frontmatter":{},"headers":[{"level":2,"title":"选举","slug":"选举","link":"#选举","children":[]},{"level":2,"title":"查询","slug":"查询","link":"#查询","children":[]},{"level":2,"title":"监控","slug":"监控","link":"#监控","children":[]},{"level":2,"title":"Locker","slug":"locker","link":"#locker","children":[]},{"level":2,"title":"Mutex","slug":"mutex","link":"#mutex","children":[]}],"relativePath":"Go并发编程实战课/19-在分布式环境中，Leader选举、互斥锁和读写锁该如何实现？.md","filePath":"Go并发编程实战课/19-在分布式环境中，Leader选举、互斥锁和读写锁该如何实现？.md","lastUpdated":1779815724000}'),l={name:"Go并发编程实战课/19-在分布式环境中，Leader选举、互斥锁和读写锁该如何实现？.md"};function t(i,n,c,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_19-在分布式环境中-leader选举、互斥锁和读写锁该如何实现" tabindex="-1">19 | 在分布式环境中，Leader选举、互斥锁和读写锁该如何实现？ <a class="header-anchor" href="#_19-在分布式环境中-leader选举、互斥锁和读写锁该如何实现" aria-label="Permalink to &quot;19 |  在分布式环境中，Leader选举、互斥锁和读写锁该如何实现？&quot;">​</a></h1><p>你好，我是鸟窝。</p><p>在前面的课程里，我们学习的并发原语都是在进程内使用的，也就是我们常见的一个运行程序为了控制共享资源、实现任务编排和进行消息传递而提供的控制类型。在接下来的这两节课里，我要讲的是几个分布式的并发原语，它们控制的资源或编排的任务分布在不同进程、不同机器上。</p><p>分布式的并发原语实现更加复杂，因为在分布式环境中，网络状况、服务状态都是不可控的。不过还好有相应的软件系统去做这些事情。这些软件系统会专门去处理这些节点之间的协调和异常情况，并且保证数据的一致性。我们要做的就是在它们的基础上实现我们的业务。</p><p>常用来做协调工作的软件系统是Zookeeper、etcd、Consul之类的软件，Zookeeper为Java生态群提供了丰富的分布式并发原语（通过Curator库），但是缺少Go相关的并发原语库。Consul在提供分布式并发原语这件事儿上不是很积极，而etcd就提供了非常好的分布式并发原语，比如分布式互斥锁、分布式读写锁、Leader选举，等等。所以，今天，我就以etcd为基础，给你介绍几种分布式并发原语。</p><p>既然我们依赖etcd，那么，在生产环境中要有一个etcd集群，而且应该保证这个etcd集群是7*24工作的。在学习过程中，你可以使用一个etcd节点进行测试。</p><p>这节课我要介绍的就是Leader选举、互斥锁和读写锁。</p><h1 id="leader选举" tabindex="-1">Leader选举 <a class="header-anchor" href="#leader选举" aria-label="Permalink to &quot;Leader选举&quot;">​</a></h1><p>Leader选举常常用在主从架构的系统中。主从架构中的服务节点分为主（Leader、Master）和从（Follower、Slave）两种角色，实际节点包括1主n从，一共是n+1个节点。</p><p>主节点常常执行写操作，从节点常常执行读操作，如果读写都在主节点，从节点只是提供一个备份功能的话，那么，主从架构就会退化成主备模式架构。</p><p>主从架构中最重要的是如何确定节点的角色，也就是，到底哪个节点是主，哪个节点是从？</p><p><strong>在同一时刻，系统中不能有两个主节点，否则，如果两个节点都是主，都执行写操作的话，就有可能出现数据不一致的情况，所以，我们需要一个选主机制，选择一个节点作为主节点，这个过程就是Leader选举</strong>。</p><p>当主节点宕机或者是不可用时，就需要新一轮的选举，从其它的从节点中选择出一个节点，让它作为新主节点，宕机的原主节点恢复后，可以变为从节点，或者被摘掉。</p><p>我们可以通过etcd基础服务来实现leader选举。具体点说，我们可以将Leader选举的逻辑交给etcd基础服务，这样，我们只需要把重心放在业务开发上。etcd基础服务可以通过多节点的方式保证7*24服务，所以，我们也不用担心Leader选举不可用的问题。如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/310887/78010df8677171d9bf29c64d346d9647.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/310887/78010df8677171d9bf29c64d346d9647.jpg" alt=""></a></p><p>接下来，我会给你介绍业务开发中跟Leader选举相关的选举、查询、Leader变动监控等功能。</p><p>我要先提醒你一句，如果你想运行我下面讲到的测试代码，就要先部署一个etcd的集群，或者部署一个etcd节点做测试。</p><p>首先，我们来实现一个测试分布式程序的框架：它会先从命令行中读取命令，然后再执行相应的命令。你可以打开两个窗口，模拟不同的节点，分别执行不同的命令。</p><p>这个测试程序如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 导入所需的库</span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;bufio&quot;</span></span>
<span class="line"><span>    &quot;context&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;strconv&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3/concurrency&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 可以设置一些参数，比如节点ID</span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    nodeID    = flag.Int(&quot;id&quot;, 0, &quot;node ID&quot;)</span></span>
<span class="line"><span>    addr      = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    electName = flag.String(&quot;name&quot;, &quot;my-test-elect&quot;, &quot;election name&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将etcd的地址解析成slice of string</span></span>
<span class="line"><span>    endpoints := strings.Split(*addr, &quot;,&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 生成一个etcd的clien</span></span>
<span class="line"><span>    cli, err := clientv3.New(clientv3.Config{Endpoints: endpoints})</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer cli.Close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建session,如果程序宕机导致session断掉，etcd能检测到</span></span>
<span class="line"><span>    session, err := concurrency.NewSession(cli)</span></span>
<span class="line"><span>    defer session.Close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 生成一个选举对象。下面主要使用它进行选举和查询等操作</span></span>
<span class="line"><span>    // 另一个方法ResumeElection可以使用既有的leader初始化Election</span></span>
<span class="line"><span>    e1 := concurrency.NewElection(session, *electName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从命令行读取命令</span></span>
<span class="line"><span>    consolescanner := bufio.NewScanner(os.Stdin)</span></span>
<span class="line"><span>    for consolescanner.Scan() {</span></span>
<span class="line"><span>        action := consolescanner.Text()</span></span>
<span class="line"><span>        switch action {</span></span>
<span class="line"><span>        case &quot;elect&quot;: // 选举命令</span></span>
<span class="line"><span>            go elect(e1, *electName)</span></span>
<span class="line"><span>        case &quot;proclaim&quot;: // 只更新leader的value</span></span>
<span class="line"><span>            proclaim(e1, *electName)</span></span>
<span class="line"><span>        case &quot;resign&quot;: // 辞去leader,重新选举</span></span>
<span class="line"><span>            resign(e1, *electName)</span></span>
<span class="line"><span>        case &quot;watch&quot;: // 监控leader的变动</span></span>
<span class="line"><span>            go watch(e1, *electName)</span></span>
<span class="line"><span>        case &quot;query&quot;: // 查询当前的leader</span></span>
<span class="line"><span>            query(e1, *electName)</span></span>
<span class="line"><span>        case &quot;rev&quot;:</span></span>
<span class="line"><span>            rev(e1, *electName)</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Println(&quot;unknown action&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>部署完以后，我们就可以开始选举了。</p><h2 id="选举" tabindex="-1">选举 <a class="header-anchor" href="#选举" aria-label="Permalink to &quot;选举&quot;">​</a></h2><p>如果你的业务集群还没有主节点，或者主节点宕机了，你就需要发起新一轮的选主操作，主要会用到 <strong>Campaign和Proclaim</strong>。如果你需要主节点放弃主的角色，让其它从节点有机会成为主节点，就可以调用 <strong>Resign</strong> 方法。</p><p>这里我提到了三个和选主相关的方法，下面我来介绍下它们的用法。</p><p><strong>第一个方法是Campaign</strong>。它的作用是，把一个节点选举为主节点，并且会设置一个值。它的签名如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (e *Election) Campaign(ctx context.Context, val string) error</span></span></code></pre></div><p>需要注意的是，这是一个阻塞方法，在调用它的时候会被阻塞，直到满足下面的三个条件之一，才会取消阻塞。</p><ol><li>成功当选为主；</li><li>此方法返回错误；</li><li>ctx被取消。</li></ol><p><strong>第二个方法是Proclaim</strong>。它的作用是，重新设置Leader的值，但是不会重新选主，这个方法会返回新值设置成功或者失败的信息。方法签名如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (e *Election) Proclaim(ctx context.Context, val string) error</span></span></code></pre></div><p><strong>第三个方法是Resign</strong>：开始新一次选举。这个方法会返回新的选举成功或者失败的信息。它的签名如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (e *Election) Resign(ctx context.Context) (err error)</span></span></code></pre></div><p>这三个方法的测试代码如下。你可以使用测试程序进行测试，具体做法是，启动两个节点，执行和这三个方法相关的命令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var count int</span></span>
<span class="line"><span>// 选主</span></span>
<span class="line"><span>func elect(e1 *concurrency.Election, electName string) {</span></span>
<span class="line"><span>    log.Println(&quot;acampaigning for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>    // 调用Campaign方法选主,主的值为value-&lt;主节点ID&gt;-&lt;​count&gt;</span></span>
<span class="line"><span>    if err := e1.Campaign(context.Background(), fmt.Sprintf(&quot;value-%d-%d&quot;, *nodeID, count)); err != nil {</span></span>
<span class="line"><span>        log.Println(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;campaigned for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>    count++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 为主设置新值</span></span>
<span class="line"><span>func proclaim(e1 *concurrency.Election, electName string) {</span></span>
<span class="line"><span>    log.Println(&quot;proclaiming for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>    // 调用Proclaim方法设置新值,新值为value-&lt;主节点ID&gt;-&lt;​count&gt;</span></span>
<span class="line"><span>    if err := e1.Proclaim(context.Background(), fmt.Sprintf(&quot;value-%d-%d&quot;, *nodeID, count)); err != nil {</span></span>
<span class="line"><span>        log.Println(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;proclaimed for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>    count++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 重新选主，有可能另外一个节点被选为了主</span></span>
<span class="line"><span>func resign(e1 *concurrency.Election, electName string) {</span></span>
<span class="line"><span>    log.Println(&quot;resigning for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>    // 调用Resign重新选主</span></span>
<span class="line"><span>    if err := e1.Resign(context.TODO()); err != nil {</span></span>
<span class="line"><span>        log.Println(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;resigned for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="查询" tabindex="-1">查询 <a class="header-anchor" href="#查询" aria-label="Permalink to &quot;查询&quot;">​</a></h2><p>除了选举Leader，程序在启动的过程中，或者在运行的时候，还有可能需要查询当前的主节点是哪一个节点？主节点的值是什么？版本是多少？不光是主从节点需要查询和知道哪一个节点，在分布式系统中，还有其它一些节点也需要知道集群中的哪一个节点是主节点，哪一个节点是从节点，这样它们才能把读写请求分别发往相应的主从节点上。</p><p>etcd提供了查询当前Leader的方法 <strong>Leader</strong>，如果当前还没有Leader，就返回一个错误，你可以使用这个方法来查询主节点信息。这个方法的签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (e *Election) Leader(ctx context.Context) (*v3.GetResponse, error)</span></span></code></pre></div><p>每次主节点的变动都会生成一个新的版本号，你还可以查询版本号信息（ <strong>Rev</strong> 方法），了解主节点变动情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (e *Election) Rev() int64</span></span></code></pre></div><p>你可以在测试完选主命令后，测试查询命令（query、rev），代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 查询主的信息</span></span>
<span class="line"><span>func query(e1 *concurrency.Election, electName string) {</span></span>
<span class="line"><span>    // 调用Leader返回主的信息，包括key和value等信息</span></span>
<span class="line"><span>    resp, err := e1.Leader(context.Background())</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Printf(&quot;failed to get the current leader: %v&quot;, err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;current leader:&quot;, string(resp.Kvs[0].Key), string(resp.Kvs[0].Value))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 可以直接查询主的rev信息</span></span>
<span class="line"><span>func rev(e1 *concurrency.Election, electName string) {</span></span>
<span class="line"><span>    rev := e1.Rev()</span></span>
<span class="line"><span>    log.Println(&quot;current rev:&quot;, rev)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="监控" tabindex="-1">监控 <a class="header-anchor" href="#监控" aria-label="Permalink to &quot;监控&quot;">​</a></h2><p>有了选举和查询方法，我们还需要一个监控方法。毕竟，如果主节点变化了，我们需要得到最新的主节点信息。</p><p>我们可以通过Observe来监控主的变化，它的签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (e *Election) Observe(ctx context.Context) &lt;-chan v3.GetResponse</span></span></code></pre></div><p>它会返回一个chan，显示主节点的变动信息。需要注意的是，它不会返回主节点的全部历史变动信息，而是只返回最近的一条变动信息以及之后的变动信息。</p><p>它的测试代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func watch(e1 *concurrency.Election, electName string) {</span></span>
<span class="line"><span>    ch := e1.Observe(context.TODO())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.Println(&quot;start to watch for ID:&quot;, *nodeID)</span></span>
<span class="line"><span>    for i := 0; i &lt; 10; i++ {</span></span>
<span class="line"><span>        resp := &lt;-ch</span></span>
<span class="line"><span>        log.Println(&quot;leader changed to&quot;, string(resp.Kvs[0].Key), string(resp.Kvs[0].Value))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>etcd提供了选主的逻辑，而你要做的就是利用这些方法，让它们为你的业务服务。在使用的过程中，你还需要做一些额外的设置，比如查询当前的主节点、启动一个goroutine阻塞调用Campaign方法，等等。虽然你需要做一些额外的工作，但是跟自己实现一个分布式的选主逻辑相比，大大地减少了工作量。</p><p>接下来，我们继续看etcd提供的分布式并发原语：互斥锁。</p><h1 id="互斥锁" tabindex="-1">互斥锁 <a class="header-anchor" href="#互斥锁" aria-label="Permalink to &quot;互斥锁&quot;">​</a></h1><p>互斥锁是非常常用的一种并发原语，我专门花了4讲的时间，重点介绍了互斥锁的功能、原理和易错场景。</p><p>不过，前面说的互斥锁都是用来保护同一进程内的共享资源的，今天，我们要掌握的是分布式环境中的互斥锁。 <strong>我们要重点学习下分布在不同机器中的不同进程内的goroutine，如何利用分布式互斥锁来保护共享资源。</strong></p><p>互斥锁的应用场景和主从架构的应用场景不太一样。 <strong>使用互斥锁的不同节点是没有主从这样的角色的，所有的节点都是一样的，只不过在同一时刻，只允许其中的一个节点持有锁</strong>。</p><p>下面，我们就来学习下互斥锁相关的两个原语，即Locker和Mutex。</p><h2 id="locker" tabindex="-1">Locker <a class="header-anchor" href="#locker" aria-label="Permalink to &quot;Locker&quot;">​</a></h2><p>etcd提供了一个简单的Locker原语，它类似于Go标准库中的sync.Locker接口，也提供了Lock/UnLock的机制：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewLocker(s *Session, pfx string) sync.Locker</span></span></code></pre></div><p>可以看到，它的返回值是一个sync.Locker，因为你对标准库的Locker已经非常了解了，而且它只有Lock/Unlock两个方法，所以，接下来使用这个锁就非常容易了。下面的代码是一个使用Locker并发原语的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;math/rand&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span>    &quot;time&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3/concurrency&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr     = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    lockName = flag.String(&quot;name&quot;, &quot;my-test-lock&quot;, &quot;lock name&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    rand.Seed(time.Now().UnixNano())</span></span>
<span class="line"><span>    // etcd地址</span></span>
<span class="line"><span>    endpoints := strings.Split(*addr, &quot;,&quot;)</span></span>
<span class="line"><span>    // 生成一个etcd client</span></span>
<span class="line"><span>    cli, err := clientv3.New(clientv3.Config{Endpoints: endpoints})</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer cli.Close()</span></span>
<span class="line"><span>    useLock(cli) // 测试锁</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func useLock(cli *clientv3.Client) {</span></span>
<span class="line"><span>    // 为锁生成session</span></span>
<span class="line"><span>    s1, err := concurrency.NewSession(cli)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer s1.Close()</span></span>
<span class="line"><span>    //得到一个分布式锁</span></span>
<span class="line"><span>    locker := concurrency.NewLocker(s1, *lockName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 请求锁</span></span>
<span class="line"><span>    log.Println(&quot;acquiring lock&quot;)</span></span>
<span class="line"><span>    locker.Lock()</span></span>
<span class="line"><span>    log.Println(&quot;acquired lock&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 等待一段时间</span></span>
<span class="line"><span>    time.Sleep(time.Duration(rand.Intn(30)) * time.Second)</span></span>
<span class="line"><span>    locker.Unlock() // 释放锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.Println(&quot;released lock&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以同时在两个终端中运行这个测试程序。可以看到，它们获得锁是有先后顺序的，一个节点释放了锁之后，另外一个节点才能获取到这个分布式锁。</p><h2 id="mutex" tabindex="-1">Mutex <a class="header-anchor" href="#mutex" aria-label="Permalink to &quot;Mutex&quot;">​</a></h2><p>事实上，刚刚说的Locker是基于Mutex实现的，只不过，Mutex提供了查询Mutex的key的信息的功能。测试代码也类似：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func useMutex(cli *clientv3.Client) {</span></span>
<span class="line"><span>    // 为锁生成session</span></span>
<span class="line"><span>    s1, err := concurrency.NewSession(cli)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer s1.Close()</span></span>
<span class="line"><span>    m1 := concurrency.NewMutex(s1, *lockName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //在请求锁之前查询key</span></span>
<span class="line"><span>    log.Printf(&quot;before acquiring. key: %s&quot;, m1.Key())</span></span>
<span class="line"><span>    // 请求锁</span></span>
<span class="line"><span>    log.Println(&quot;acquiring lock&quot;)</span></span>
<span class="line"><span>    if err := m1.Lock(context.TODO()); err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Printf(&quot;acquired lock. key: %s&quot;, m1.Key())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待一段时间</span></span>
<span class="line"><span>    time.Sleep(time.Duration(rand.Intn(30)) * time.Second)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 释放锁</span></span>
<span class="line"><span>    if err := m1.Unlock(context.TODO()); err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;released lock&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，Mutex并没有实现sync.Locker接口，它的Lock/Unlock方法需要提供一个context.Context实例做参数，这也就意味着，在请求锁的时候，你可以设置超时时间，或者主动取消请求。</p><h1 id="读写锁" tabindex="-1">读写锁 <a class="header-anchor" href="#读写锁" aria-label="Permalink to &quot;读写锁&quot;">​</a></h1><p>学完了分布式Locker和互斥锁Mutex，你肯定会联想到读写锁RWMutex。是的，etcd也提供了分布式的读写锁。不过，互斥锁Mutex是在github.com/coreos/etcd/clientv3/concurrency包中提供的，读写锁RWMutex却是在github.com/coreos/etcd/contrib/recipes包中提供的。</p><p>etcd提供的分布式读写锁的功能和标准库的读写锁的功能是一样的。只不过， <strong>etcd提供的读写锁，可以在分布式环境中的不同的节点使用</strong>。它提供的方法也和标准库中的读写锁的方法一致，分别提供了RLock/RUnlock、Lock/Unlock方法。下面的代码是使用读写锁的例子，它从命令行中读取命令，执行读写锁的操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;bufio&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;math/rand&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span>    &quot;time&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3/concurrency&quot;</span></span>
<span class="line"><span>    recipe &quot;github.com/coreos/etcd/contrib/recipes&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr     = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    lockName = flag.String(&quot;name&quot;, &quot;my-test-lock&quot;, &quot;lock name&quot;)</span></span>
<span class="line"><span>    action   = flag.String(&quot;rw&quot;, &quot;w&quot;, &quot;r means acquiring read lock, w means acquiring write lock&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
<span class="line"><span>    rand.Seed(time.Now().UnixNano())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 解析etcd地址</span></span>
<span class="line"><span>    endpoints := strings.Split(*addr, &quot;,&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建etcd的client</span></span>
<span class="line"><span>    cli, err := clientv3.New(clientv3.Config{Endpoints: endpoints})</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer cli.Close()</span></span>
<span class="line"><span>    // 创建session</span></span>
<span class="line"><span>    s1, err := concurrency.NewSession(cli)</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer s1.Close()</span></span>
<span class="line"><span>    m1 := recipe.NewRWMutex(s1, *lockName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从命令行读取命令</span></span>
<span class="line"><span>    consolescanner := bufio.NewScanner(os.Stdin)</span></span>
<span class="line"><span>    for consolescanner.Scan() {</span></span>
<span class="line"><span>        action := consolescanner.Text()</span></span>
<span class="line"><span>        switch action {</span></span>
<span class="line"><span>        case &quot;w&quot;: // 请求写锁</span></span>
<span class="line"><span>            testWriteLocker(m1)</span></span>
<span class="line"><span>        case &quot;r&quot;: // 请求读锁</span></span>
<span class="line"><span>            testReadLocker(m1)</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Println(&quot;unknown action&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func testWriteLocker(m1 *recipe.RWMutex) {</span></span>
<span class="line"><span>    // 请求写锁</span></span>
<span class="line"><span>    log.Println(&quot;acquiring write lock&quot;)</span></span>
<span class="line"><span>    if err := m1.Lock(); err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;acquired write lock&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 等待一段时间</span></span>
<span class="line"><span>    time.Sleep(time.Duration(rand.Intn(10)) * time.Second)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 释放写锁</span></span>
<span class="line"><span>    if err := m1.Unlock(); err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;released write lock&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func testReadLocker(m1 *recipe.RWMutex) {</span></span>
<span class="line"><span>    // 请求读锁</span></span>
<span class="line"><span>    log.Println(&quot;acquiring read lock&quot;)</span></span>
<span class="line"><span>    if err := m1.RLock(); err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;acquired read lock&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 等待一段时间</span></span>
<span class="line"><span>    time.Sleep(time.Duration(rand.Intn(10)) * time.Second)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 释放写锁</span></span>
<span class="line"><span>    if err := m1.RUnlock(); err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    log.Println(&quot;released read lock&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h1 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h1><p>自己实现分布式环境的并发原语，是相当困难的一件事，因为你需要考虑网络的延迟和异常、节点的可用性、数据的一致性等多种情况。</p><p>所以，我们可以借助etcd这样成熟的框架，基于它提供的分布式并发原语处理分布式的场景。需要注意的是，在使用这些分布式并发原语的时候，你需要考虑异常的情况，比如网络断掉等。同时，分布式并发原语需要网络之间的通讯，所以会比使用标准库中的并发原语耗时更长。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/310887/a18a98aa9ac5de17373c953484ee4c23.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/310887/a18a98aa9ac5de17373c953484ee4c23.jpg" alt=""></a></p><p>好了，这节课就到这里，下节课，我会带你继续学习其它的分布式并发原语，包括队列、栅栏和STM，敬请期待。</p><h1 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h1><ol><li>如果持有互斥锁或者读写锁的节点意外宕机了，它持有的锁会不会被释放？</li><li>etcd提供的读写锁中的读和写有没有优先级？</li></ol><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得有所收获，也欢迎你把今天的内容分享给你的朋友或同事。</p>`,78)])])}const q=s(l,[["render",t]]);export{g as __pageData,q as default};
