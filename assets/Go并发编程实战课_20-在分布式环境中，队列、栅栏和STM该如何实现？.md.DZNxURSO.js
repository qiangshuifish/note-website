import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const q=JSON.parse('{"title":"20 | 在分布式环境中，队列、栅栏和STM该如何实现？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Barrier：分布式栅栏","slug":"barrier-分布式栅栏","link":"#barrier-分布式栅栏","children":[]},{"level":2,"title":"DoubleBarrier：计数型栅栏","slug":"doublebarrier-计数型栅栏","link":"#doublebarrier-计数型栅栏","children":[]}],"relativePath":"Go并发编程实战课/20-在分布式环境中，队列、栅栏和STM该如何实现？.md","filePath":"Go并发编程实战课/20-在分布式环境中，队列、栅栏和STM该如何实现？.md","lastUpdated":1779815724000}'),l={name:"Go并发编程实战课/20-在分布式环境中，队列、栅栏和STM该如何实现？.md"};function t(i,n,c,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_20-在分布式环境中-队列、栅栏和stm该如何实现" tabindex="-1">20 | 在分布式环境中，队列、栅栏和STM该如何实现？ <a class="header-anchor" href="#_20-在分布式环境中-队列、栅栏和stm该如何实现" aria-label="Permalink to &quot;20 | 在分布式环境中，队列、栅栏和STM该如何实现？&quot;">​</a></h1><p>你好，我是鸟窝。</p><p>上一讲，我已经带你认识了基于etcd实现的Leader选举、互斥锁和读写锁，今天，我们来学习下基于etcd的分布式队列、栅栏和STM。</p><p>只要你学过计算机算法和数据结构相关的知识， 队列这种数据结构你一定不陌生，它是一种先进先出的类型，有出队（dequeue）和入队（enqueue）两种操作。在 <a href="https://time.geekbang.org/column/article/304127" target="_blank" rel="noreferrer">第12讲</a> 中，我专门讲到了一种叫做lock-free的队列。队列在单机的应用程序中常常使用，但是在分布式环境中，多节点如何并发地执行入队和出队的操作呢？这一讲，我会带你认识一下基于etcd实现的分布式队列。</p><p>除此之外，我还会讲用分布式栅栏编排一组分布式节点同时执行的方法，以及简化多个key的操作并且提供事务功能的STM（Software Transactional Memory，软件事务内存）。</p><h1 id="分布式队列和优先级队列" tabindex="-1">分布式队列和优先级队列 <a class="header-anchor" href="#分布式队列和优先级队列" aria-label="Permalink to &quot;分布式队列和优先级队列&quot;">​</a></h1><p>前一讲我也讲到，我们并不是从零开始实现一个分布式队列，而是站在etcd的肩膀上，利用etcd提供的功能实现分布式队列。</p><p>etcd集群的可用性由etcd集群的维护者来保证，我们不用担心网络分区、节点宕机等问题。我们可以把这些通通交给etcd的运维人员，把我们自己的关注点放在使用上。</p><p>下面，我们就来了解下etcd提供的分布式队列。etcd通过github.com/coreos/etcd/contrib/recipes包提供了分布式队列这种数据结构。</p><p>创建分布式队列的方法非常简单，只有一个，即NewQueue，你只需要传入etcd的client和这个队列的名字，就可以了。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewQueue(client *v3.Client, keyPrefix string) *Queue</span></span></code></pre></div><p><strong>这个队列只有两个方法，分别是出队和入队，队列中的元素是字符串类型</strong>。这两个方法的签名如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 入队</span></span>
<span class="line"><span>func (q *Queue) Enqueue(val string) error</span></span>
<span class="line"><span>//出队</span></span>
<span class="line"><span>func (q *Queue) Dequeue() (string, error)</span></span></code></pre></div><p>需要注意的是，如果这个分布式队列当前为空，调用Dequeue方法的话，会被阻塞，直到有元素可以出队才返回。</p><p>既然是分布式的队列，那就意味着，我们可以在一个节点将元素放入队列，在另外一个节点把它取出。</p><p>在我接下来讲的例子中，你就可以启动两个节点，一个节点往队列中放入元素，一个节点从队列中取出元素，看看是否能正常取出来。etcd的分布式队列是一种多读多写的队列，所以，你也可以启动多个写节点和多个读节点。</p><p>下面我们来借助代码，看一下如何实现分布式队列。</p><p>首先，我们启动一个程序，它会从命令行读取你的命令，然后执行。你可以输入 <code>push &lt;​value&gt;</code>，将一个元素入队，输入 <code>pop</code>，将一个元素弹出。另外，你还可以使用这个程序启动多个实例，用来模拟分布式的环境：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;bufio&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    recipe &quot;github.com/coreos/etcd/contrib/recipes&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr      = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    queueName = flag.String(&quot;name&quot;, &quot;my-test-queue&quot;, &quot;queue name&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    // 创建/获取队列</span></span>
<span class="line"><span>    q := recipe.NewQueue(cli, *queueName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从命令行读取命令</span></span>
<span class="line"><span>    consolescanner := bufio.NewScanner(os.Stdin)</span></span>
<span class="line"><span>    for consolescanner.Scan() {</span></span>
<span class="line"><span>        action := consolescanner.Text()</span></span>
<span class="line"><span>        items := strings.Split(action, &quot; &quot;)</span></span>
<span class="line"><span>        switch items[0] {</span></span>
<span class="line"><span>        case &quot;push&quot;: // 加入队列</span></span>
<span class="line"><span>            if len(items) != 2 {</span></span>
<span class="line"><span>                fmt.Println(&quot;must set value to push&quot;)</span></span>
<span class="line"><span>                continue</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            q.Enqueue(items[1]) // 入队</span></span>
<span class="line"><span>        case &quot;pop&quot;: // 从队列弹出</span></span>
<span class="line"><span>            v, err := q.Dequeue() // 出队</span></span>
<span class="line"><span>            if err != nil {</span></span>
<span class="line"><span>                log.Fatal(err)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            fmt.Println(v) // 输出出队的元素</span></span>
<span class="line"><span>        case &quot;quit&quot;, &quot;exit&quot;: //退出</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Println(&quot;unknown action&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以打开两个终端，分别执行这个程序。在第一个终端中执行入队操作，在第二个终端中执行出队操作，并且观察一下出队、入队是否正常。</p><p>除了刚刚说的分布式队列，etcd还提供了优先级队列（PriorityQueue）。</p><p>它的用法和队列类似，也提供了出队和入队的操作，只不过，在入队的时候，除了需要把一个值加入到队列，我们还需要提供uint16类型的一个整数，作为此值的优先级，优先级高的元素会优先出队。</p><p>优先级队列的测试程序如下，你可以在一个节点输入一些不同优先级的元素，在另外一个节点读取出来，看看它们是不是按照优先级顺序弹出的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;bufio&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;strconv&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    recipe &quot;github.com/coreos/etcd/contrib/recipes&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr      = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    queueName = flag.String(&quot;name&quot;, &quot;my-test-queue&quot;, &quot;queue name&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    // 创建/获取队列</span></span>
<span class="line"><span>    q := recipe.NewPriorityQueue(cli, *queueName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从命令行读取命令</span></span>
<span class="line"><span>    consolescanner := bufio.NewScanner(os.Stdin)</span></span>
<span class="line"><span>    for consolescanner.Scan() {</span></span>
<span class="line"><span>        action := consolescanner.Text()</span></span>
<span class="line"><span>        items := strings.Split(action, &quot; &quot;)</span></span>
<span class="line"><span>        switch items[0] {</span></span>
<span class="line"><span>        case &quot;push&quot;: // 加入队列</span></span>
<span class="line"><span>            if len(items) != 3 {</span></span>
<span class="line"><span>                fmt.Println(&quot;must set value and priority to push&quot;)</span></span>
<span class="line"><span>                continue</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            pr, err := strconv.Atoi(items[2]) // 读取优先级</span></span>
<span class="line"><span>            if err != nil {</span></span>
<span class="line"><span>                fmt.Println(&quot;must set uint16 as priority&quot;)</span></span>
<span class="line"><span>                continue</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            q.Enqueue(items[1], uint16(pr)) // 入队</span></span>
<span class="line"><span>        case &quot;pop&quot;: // 从队列弹出</span></span>
<span class="line"><span>            v, err := q.Dequeue() // 出队</span></span>
<span class="line"><span>            if err != nil {</span></span>
<span class="line"><span>                log.Fatal(err)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            fmt.Println(v) // 输出出队的元素</span></span>
<span class="line"><span>        case &quot;quit&quot;, &quot;exit&quot;: //退出</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Println(&quot;unknown action&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你看，利用etcd实现分布式队列和分布式优先队列，就是这么简单。所以，在实际项目中，如果有这类需求的话，你就可以选择用etcd实现。</p><p>不过，在使用分布式并发原语时，除了需要考虑可用性和数据一致性，还需要考虑分布式设计带来的性能损耗问题。所以，在使用之前，你一定要做好性能的评估。</p><h1 id="分布式栅栏" tabindex="-1">分布式栅栏 <a class="header-anchor" href="#分布式栅栏" aria-label="Permalink to &quot;分布式栅栏&quot;">​</a></h1><p>在 <a href="https://time.geekbang.org/column/article/309098" target="_blank" rel="noreferrer">第17讲</a> 中，我们学习了循环栅栏CyclicBarrier，它和 <a href="https://time.geekbang.org/column/article/298516" target="_blank" rel="noreferrer">第6讲</a> 的标准库中的WaitGroup，本质上是同一类并发原语，都是等待同一组goroutine同时执行，或者是等待同一组goroutine都完成。</p><p>在分布式环境中，我们也会遇到这样的场景：一组节点协同工作，共同等待一个信号，在信号未出现前，这些节点会被阻塞住，而一旦信号出现，这些阻塞的节点就会同时开始继续执行下一步的任务。</p><p>etcd也提供了相应的分布式并发原语。</p><ul><li><strong>Barrier：分布式栅栏</strong>。如果持有Barrier的节点释放了它，所有等待这个Barrier的节点就不会被阻塞，而是会继续执行。</li><li><strong>DoubleBarrier：计数型栅栏</strong>。在初始化计数型栅栏的时候，我们就必须提供参与节点的数量，当这些数量的节点都Enter或者Leave的时候，这个栅栏就会放开。所以，我们把它称为计数型栅栏。</li></ul><h2 id="barrier-分布式栅栏" tabindex="-1">Barrier：分布式栅栏 <a class="header-anchor" href="#barrier-分布式栅栏" aria-label="Permalink to &quot;Barrier：分布式栅栏&quot;">​</a></h2><p>我们先来学习下分布式Barrier。</p><p>分布式Barrier的创建很简单，你只需要提供etcd的Client和Barrier的名字就可以了，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewBarrier(client *v3.Client, key string) *Barrier</span></span></code></pre></div><p>Barrier提供了三个方法，分别是Hold、 <strong>Release和Wait，</strong> 代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (b *Barrier) Hold() error</span></span>
<span class="line"><span>func (b *Barrier) Release() error</span></span>
<span class="line"><span>func (b *Barrier) Wait() error</span></span></code></pre></div><ul><li><strong>Hold方法</strong> 是创建一个Barrier。如果Barrier已经创建好了，有节点调用它的Wait方法，就会被阻塞。</li><li><strong>Release方法</strong> 是释放这个Barrier，也就是打开栅栏。如果使用了这个方法，所有被阻塞的节点都会被放行，继续执行。</li><li><strong>Wait方法</strong> 会阻塞当前的调用者，直到这个Barrier被release。如果这个栅栏不存在，调用者不会被阻塞，而是会继续执行。</li></ul><p><strong>学习并发原语最好的方式就是使用它</strong>。下面我们就来借助一个例子，来看看Barrier该怎么用。</p><p>你可以在一个终端中运行这个程序，执行&quot;hold&quot;&quot;release&quot;命令，模拟栅栏的持有和释放。在另外一个终端中运行这个程序，不断调用&quot;wait&quot;方法，看看是否能正常地跳出阻塞继续执行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;bufio&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    recipe &quot;github.com/coreos/etcd/contrib/recipes&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr        = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    barrierName = flag.String(&quot;name&quot;, &quot;my-test-queue&quot;, &quot;barrier name&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    // 创建/获取栅栏</span></span>
<span class="line"><span>    b := recipe.NewBarrier(cli, *barrierName)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从命令行读取命令</span></span>
<span class="line"><span>    consolescanner := bufio.NewScanner(os.Stdin)</span></span>
<span class="line"><span>    for consolescanner.Scan() {</span></span>
<span class="line"><span>        action := consolescanner.Text()</span></span>
<span class="line"><span>        items := strings.Split(action, &quot; &quot;)</span></span>
<span class="line"><span>        switch items[0] {</span></span>
<span class="line"><span>        case &quot;hold&quot;: // 持有这个barrier</span></span>
<span class="line"><span>            b.Hold()</span></span>
<span class="line"><span>            fmt.Println(&quot;hold&quot;)</span></span>
<span class="line"><span>        case &quot;release&quot;: // 释放这个barrier</span></span>
<span class="line"><span>            b.Release()</span></span>
<span class="line"><span>            fmt.Println(&quot;released&quot;)</span></span>
<span class="line"><span>        case &quot;wait&quot;: // 等待barrier被释放</span></span>
<span class="line"><span>            b.Wait()</span></span>
<span class="line"><span>            fmt.Println(&quot;after wait&quot;)</span></span>
<span class="line"><span>        case &quot;quit&quot;, &quot;exit&quot;: //退出</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Println(&quot;unknown action&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="doublebarrier-计数型栅栏" tabindex="-1">DoubleBarrier：计数型栅栏 <a class="header-anchor" href="#doublebarrier-计数型栅栏" aria-label="Permalink to &quot;DoubleBarrier：计数型栅栏&quot;">​</a></h2><p>etcd还提供了另外一种栅栏，叫做DoubleBarrier，这也是一种非常有用的栅栏。这个栅栏初始化的时候需要提供一个计数count，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func NewDoubleBarrier(s *concurrency.Session, key string, count int) *DoubleBarrier</span></span></code></pre></div><p>同时，它还提供了两个方法，分别是Enter和Leave，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (b *DoubleBarrier) Enter() error</span></span>
<span class="line"><span>func (b *DoubleBarrier) Leave() error</span></span></code></pre></div><p>我来解释下这两个方法的作用。</p><p>当调用者调用Enter时，会被阻塞住，直到一共有count（初始化这个栅栏的时候设定的值）个节点调用了Enter，这count个被阻塞的节点才能继续执行。所以，你可以利用它编排一组节点，让这些节点在同一个时刻开始执行任务。</p><p>同理，如果你想让一组节点在同一个时刻完成任务，就可以调用Leave方法。节点调用Leave方法的时候，会被阻塞，直到有count个节点，都调用了Leave方法，这些节点才能继续执行。</p><p>我们再来看一下DoubleBarrier的使用例子。你可以起两个节点，同时执行Enter方法，看看这两个节点是不是先阻塞，之后才继续执行。然后，你再执行Leave方法，也观察一下，是不是先阻塞又继续执行的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;bufio&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;os&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3/concurrency&quot;</span></span>
<span class="line"><span>    recipe &quot;github.com/coreos/etcd/contrib/recipes&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr        = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>    barrierName = flag.String(&quot;name&quot;, &quot;my-test-doublebarrier&quot;, &quot;barrier name&quot;)</span></span>
<span class="line"><span>    count       = flag.Int(&quot;c&quot;, 2, &quot;&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    // 创建/获取栅栏</span></span>
<span class="line"><span>    b := recipe.NewDoubleBarrier(s1, *barrierName, *count)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从命令行读取命令</span></span>
<span class="line"><span>    consolescanner := bufio.NewScanner(os.Stdin)</span></span>
<span class="line"><span>    for consolescanner.Scan() {</span></span>
<span class="line"><span>        action := consolescanner.Text()</span></span>
<span class="line"><span>        items := strings.Split(action, &quot; &quot;)</span></span>
<span class="line"><span>        switch items[0] {</span></span>
<span class="line"><span>        case &quot;enter&quot;: // 持有这个barrier</span></span>
<span class="line"><span>            b.Enter()</span></span>
<span class="line"><span>            fmt.Println(&quot;enter&quot;)</span></span>
<span class="line"><span>        case &quot;leave&quot;: // 释放这个barrier</span></span>
<span class="line"><span>            b.Leave()</span></span>
<span class="line"><span>            fmt.Println(&quot;leave&quot;)</span></span>
<span class="line"><span>        case &quot;quit&quot;, &quot;exit&quot;: //退出</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            fmt.Println(&quot;unknown action&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>好了，我们先来简单总结一下。我们在第17讲学习的循环栅栏，控制的是同一个进程中的不同goroutine的执行，而 <strong>分布式栅栏和计数型栅栏控制的是不同节点、不同进程的执行</strong>。当你需要协调一组分布式节点在某个时间点同时运行的时候，可以考虑etcd提供的这组并发原语。</p><h1 id="stm" tabindex="-1">STM <a class="header-anchor" href="#stm" aria-label="Permalink to &quot;STM&quot;">​</a></h1><p>提到事务，你肯定不陌生。在开发基于数据库的应用程序的时候，我们经常用到事务。事务就是要保证一组操作要么全部成功，要么全部失败。</p><p>在学习STM之前，我们要先了解一下etcd的事务以及它的问题。</p><p>etcd提供了在一个事务中对多个key的更新功能，这一组key的操作要么全部成功，要么全部失败。etcd的事务实现方式是基于CAS方式实现的，融合了Get、Put和Delete操作。</p><p>etcd的事务操作如下，分为条件块、成功块和失败块，条件块用来检测事务是否成功，如果成功，就执行Then(...)，如果失败，就执行Else(...)：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Txn().If(cond1, cond2, ...).Then(op1, op2, ...,).Else(op1’, op2’, …)</span></span></code></pre></div><p>我们来看一个利用etcd的事务实现转账的小例子。我们从账户from 向账户to转账 amount，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func doTxnXfer(etcd *v3.Client, from, to string, amount uint) (bool, error) {</span></span>
<span class="line"><span>    // 一个查询事务</span></span>
<span class="line"><span>    getresp, err := etcd.Txn(ctx.TODO()).Then(OpGet(from), OpGet(to)).Commit()</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>         return false, err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 获取转账账户的值</span></span>
<span class="line"><span>    fromKV := getresp.Responses[0].GetRangeResponse().Kvs[0]</span></span>
<span class="line"><span>    toKV := getresp.Responses[1].GetRangeResponse().Kvs[1]</span></span>
<span class="line"><span>    fromV, toV := toUInt64(fromKV.Value), toUint64(toKV.Value)</span></span>
<span class="line"><span>    if fromV &lt; amount {</span></span>
<span class="line"><span>        return false, fmt.Errorf(“insufficient value”)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 转账事务</span></span>
<span class="line"><span>    // 条件块</span></span>
<span class="line"><span>    txn := etcd.Txn(ctx.TODO()).If(</span></span>
<span class="line"><span>        v3.Compare(v3.ModRevision(from), “=”, fromKV.ModRevision),</span></span>
<span class="line"><span>        v3.Compare(v3.ModRevision(to), “=”, toKV.ModRevision))</span></span>
<span class="line"><span>    // 成功块</span></span>
<span class="line"><span>    txn = txn.Then(</span></span>
<span class="line"><span>        OpPut(from, fromUint64(fromV - amount)),</span></span>
<span class="line"><span>        OpPut(to, fromUint64(toV + amount))</span></span>
<span class="line"><span>    //提交事务</span></span>
<span class="line"><span>    putresp, err := txn.Commit()</span></span>
<span class="line"><span>    // 检查事务的执行结果</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        return false, err</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return putresp.Succeeded, nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从刚刚的这段代码中，我们可以看到，虽然可以利用etcd实现事务操作，但是逻辑还是比较复杂的。</p><p>因为事务使用起来非常麻烦，所以etcd又在这些基础API上进行了封装，新增了一种叫做STM的操作，提供了更加便利的方法。</p><p>下面我们来看一看STM怎么用。</p><p>要使用STM，你需要先编写一个apply函数，这个函数的执行是在一个事务之中的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apply func(STM) error</span></span></code></pre></div><p>这个方法包含一个STM类型的参数，它提供了对key值的读写操作。</p><p>STM提供了4个方法，分别是Get、Put、Receive和Delete，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type STM interface {</span></span>
<span class="line"><span>	Get(key ...string) string</span></span>
<span class="line"><span>	Put(key, val string, opts ...v3.OpOption)</span></span>
<span class="line"><span>	Rev(key string) int64</span></span>
<span class="line"><span>	Del(key string)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用etcd STM的时候，我们只需要定义一个apply方法，比如说转账方法exchange，然后通过concurrency.NewSTM(cli, exchange)，就可以完成转账事务的执行了。</p><p>STM咋用呢？我们还是借助一个例子来学习下。</p><p>下面这个例子创建了5个银行账号，然后随机选择一些账号两两转账。在转账的时候，要把源账号一半的钱要转给目标账号。这个例子启动了10个goroutine去执行这些事务，每个goroutine要完成100个事务。</p><p>为了确认事务是否出错了，我们最后要校验每个账号的钱数和总钱数。总钱数不变，就代表执行成功了。这个例子的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;context&quot;</span></span>
<span class="line"><span>    &quot;flag&quot;</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;math/rand&quot;</span></span>
<span class="line"><span>    &quot;strings&quot;</span></span>
<span class="line"><span>    &quot;sync&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3&quot;</span></span>
<span class="line"><span>    &quot;github.com/coreos/etcd/clientv3/concurrency&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var (</span></span>
<span class="line"><span>    addr = flag.String(&quot;addr&quot;, &quot;http://127.0.0.1:2379&quot;, &quot;etcd addresses&quot;)</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    flag.Parse()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 解析etcd地址</span></span>
<span class="line"><span>    endpoints := strings.Split(*addr, &quot;,&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cli, err := clientv3.New(clientv3.Config{Endpoints: endpoints})</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer cli.Close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置5个账户，每个账号都有100元，总共500元</span></span>
<span class="line"><span>    totalAccounts := 5</span></span>
<span class="line"><span>    for i := 0; i &lt; totalAccounts; i++ {</span></span>
<span class="line"><span>        k := fmt.Sprintf(&quot;accts/%d&quot;, i)</span></span>
<span class="line"><span>        if _, err = cli.Put(context.TODO(), k, &quot;100&quot;); err != nil {</span></span>
<span class="line"><span>            log.Fatal(err)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // STM的应用函数，主要的事务逻辑</span></span>
<span class="line"><span>    exchange := func(stm concurrency.STM) error {</span></span>
<span class="line"><span>        // 随机得到两个转账账号</span></span>
<span class="line"><span>        from, to := rand.Intn(totalAccounts), rand.Intn(totalAccounts)</span></span>
<span class="line"><span>        if from == to {</span></span>
<span class="line"><span>            // 自己不和自己转账</span></span>
<span class="line"><span>            return nil</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 读取账号的值</span></span>
<span class="line"><span>        fromK, toK := fmt.Sprintf(&quot;accts/%d&quot;, from), fmt.Sprintf(&quot;accts/%d&quot;, to)</span></span>
<span class="line"><span>        fromV, toV := stm.Get(fromK), stm.Get(toK)</span></span>
<span class="line"><span>        fromInt, toInt := 0, 0</span></span>
<span class="line"><span>        fmt.Sscanf(fromV, &quot;%d&quot;, &amp;fromInt)</span></span>
<span class="line"><span>        fmt.Sscanf(toV, &quot;%d&quot;, &amp;toInt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 把源账号一半的钱转账给目标账号</span></span>
<span class="line"><span>        xfer := fromInt / 2</span></span>
<span class="line"><span>        fromInt, toInt = fromInt-xfer, toInt+xfer</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 把转账后的值写回</span></span>
<span class="line"><span>        stm.Put(fromK, fmt.Sprintf(&quot;%d&quot;, fromInt))</span></span>
<span class="line"><span>        stm.Put(toK, fmt.Sprintf(&quot;%d&quot;, toInt))</span></span>
<span class="line"><span>        return nil</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 启动10个goroutine进行转账操作</span></span>
<span class="line"><span>    var wg sync.WaitGroup</span></span>
<span class="line"><span>    wg.Add(10)</span></span>
<span class="line"><span>    for i := 0; i &lt; 10; i++ {</span></span>
<span class="line"><span>        go func() {</span></span>
<span class="line"><span>            defer wg.Done()</span></span>
<span class="line"><span>            for j := 0; j &lt; 100; j++ {</span></span>
<span class="line"><span>                if _, serr := concurrency.NewSTM(cli, exchange); serr != nil {</span></span>
<span class="line"><span>                    log.Fatal(serr)</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }()</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    wg.Wait()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 检查账号最后的数目</span></span>
<span class="line"><span>    sum := 0</span></span>
<span class="line"><span>    accts, err := cli.Get(context.TODO(), &quot;accts/&quot;, clientv3.WithPrefix()) // 得到所有账号</span></span>
<span class="line"><span>    if err != nil {</span></span>
<span class="line"><span>        log.Fatal(err)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for _, kv := range accts.Kvs { // 遍历账号的值</span></span>
<span class="line"><span>        v := 0</span></span>
<span class="line"><span>        fmt.Sscanf(string(kv.Value), &quot;%d&quot;, &amp;v)</span></span>
<span class="line"><span>        sum += v</span></span>
<span class="line"><span>        log.Printf(&quot;account %s: %d&quot;, kv.Key, v)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.Println(&quot;account sum is&quot;, sum) // 总数</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>总结一下，当你利用etcd做存储时，是可以利用STM实现事务操作的，一个事务可以包含多个账号的数据更改操作，事务能够保证这些更改要么全成功，要么全失败。</p><h1 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h1><p>如果我们把眼光放得更宽广一些，其实并不只是etcd提供了这些并发原语，比如我上节课一开始就提到了，Zookeeper很早也提供了类似的并发原语，只不过只提供了Java的库，并没有提供合适的Go库。另外，根据Consul官方的反馈，他们并没有开发这些并发原语的计划，所以，从目前来看，etcd是个不错的选择。</p><p>当然，也有一些其它不太知名的分布式原语库，但是活跃度不高，可用性低，所以我们也不需要去了解了。</p><p>其实，你也可以使用Redis实现分布式锁，或者是基于MySQL实现分布式锁，这也是常用的选择。对于大厂来说，选择起来是非常简单的，只需要看看厂内提供了哪个基础服务，哪个更稳定些。对于没有etcd、Redis这些基础服务的公司来说，很重要的一点，就是自己搭建一套这样的基础服务，并且运维好，这就需要考察你们对etcd、Redis、MySQL的技术把控能力了，哪个用得更顺手，就用哪个。</p><p>一般来说，我不建议你自己去实现分布式原语，最好是直接使用etcd、Redis这些成熟的软件提供的功能，这也意味着，我们将程序的风险转嫁到了这些基础服务上，这些基础服务必须要能够提供足够的服务保障。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/312590/c0d48fd09b91685c836829570fdc7b1d.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/312590/c0d48fd09b91685c836829570fdc7b1d.jpg" alt=""></a></p><h1 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h1><ol><li>部署一个3节点的etcd集群，测试一下分布式队列的性能。</li><li>etcd提供的STM是分布式事务吗？</li></ol><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得有所收获，也欢迎你把今天的内容分享给你的朋友或同事。</p>`,83)])])}const g=s(l,[["render",t]]);export{q as __pageData,g as default};
