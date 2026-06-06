import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"14 | Channel：透过代码看典型的应用模式","description":"","frontmatter":{},"headers":[{"level":2,"title":"消息交流","slug":"消息交流","link":"#消息交流","children":[]},{"level":2,"title":"数据传递","slug":"数据传递","link":"#数据传递","children":[]},{"level":2,"title":"信号通知","slug":"信号通知","link":"#信号通知","children":[]},{"level":2,"title":"锁","slug":"锁","link":"#锁","children":[]},{"level":2,"title":"任务编排","slug":"任务编排","link":"#任务编排","children":[{"level":3,"title":"Or-Done模式","slug":"or-done模式","link":"#or-done模式","children":[]},{"level":3,"title":"扇入模式","slug":"扇入模式","link":"#扇入模式","children":[]},{"level":3,"title":"扇出模式","slug":"扇出模式","link":"#扇出模式","children":[]},{"level":3,"title":"Stream","slug":"stream","link":"#stream","children":[]},{"level":3,"title":"map-reduce","slug":"map-reduce","link":"#map-reduce","children":[]}]}],"relativePath":"Go并发编程实战课/14-Channel：透过代码看典型的应用模式.md","filePath":"Go并发编程实战课/14-Channel：透过代码看典型的应用模式.md","lastUpdated":1779815724000}'),l={name:"Go并发编程实战课/14-Channel：透过代码看典型的应用模式.md"};function c(i,n,t,r,o,h){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_14-channel-透过代码看典型的应用模式" tabindex="-1">14 | Channel：透过代码看典型的应用模式 <a class="header-anchor" href="#_14-channel-透过代码看典型的应用模式" aria-label="Permalink to &quot;14 | Channel：透过代码看典型的应用模式&quot;">​</a></h1><p>你好，我是鸟窝。</p><p>前一讲，我介绍了Channel的基础知识，并且总结了几种应用场景。这一讲，我将通过实例的方式，带你逐个学习Channel解决这些问题的方法，帮你巩固和完全掌握它的用法。</p><p>在开始上课之前，我先补充一个知识点：通过反射的方式执行select语句，在处理很多的case clause，尤其是不定长的case clause的时候，非常有用。而且，在后面介绍任务编排的实现时，我也会采用这种方法，所以，我先带你具体学习下Channel的反射用法。</p><h1 id="使用反射操作channel" tabindex="-1">使用反射操作Channel <a class="header-anchor" href="#使用反射操作channel" aria-label="Permalink to &quot;使用反射操作Channel&quot;">​</a></h1><p>select语句可以处理chan的send和recv，send和recv都可以作为case clause。如果我们同时处理两个chan，就可以写成下面的样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    select {</span></span>
<span class="line"><span>    case v := &lt;-ch1:</span></span>
<span class="line"><span>        fmt.Println(v)</span></span>
<span class="line"><span>    case v := &lt;-ch2:</span></span>
<span class="line"><span>        fmt.Println(v)</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>如果需要处理三个chan，你就可以再添加一个case clause，用它来处理第三个chan。可是，如果要处理100个chan呢？一万个chan呢？</p><p>或者是，chan的数量在编译的时候是不定的，在运行的时候需要处理一个slice of chan，这个时候，也没有办法在编译前写成字面意义的select。那该怎么办？</p><p>这个时候，就要“祭”出我们的反射大法了。</p><p>通过reflect.Select函数，你可以将一组运行时的case clause传入，当作参数执行。Go的select是伪随机的，它可以在执行的case中随机选择一个case，并把选择的这个case的索引（chosen）返回，如果没有可用的case返回，会返回一个bool类型的返回值，这个返回值用来表示是否有case成功被选择。如果是recv case，还会返回接收的元素。Select的方法签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func Select(cases []SelectCase) (chosen int, recv Value, recvOK bool)</span></span></code></pre></div><p>下面，我来借助一个例子，来演示一下，动态处理两个chan的情形。因为这样的方式可以动态处理case数据，所以，你可以传入几百几千几万的chan，这就解决了不能动态处理n个chan的问题。</p><p>首先，createCases函数分别为每个chan生成了recv case和send case，并返回一个reflect.SelectCase数组。</p><p>然后，通过一个循环10次的for循环执行reflect.Select，这个方法会从cases中选择一个case执行。第一次肯定是send case，因为此时chan还没有元素，recv还不可用。等chan中有了数据以后，recv case就可以被选择了。这样，你就可以处理不定数量的chan了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var ch1 = make(chan int, 10)</span></span>
<span class="line"><span>    var ch2 = make(chan int, 10)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建SelectCase</span></span>
<span class="line"><span>    var cases = createCases(ch1, ch2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 执行10次select</span></span>
<span class="line"><span>    for i := 0; i &lt; 10; i++ {</span></span>
<span class="line"><span>        chosen, recv, ok := reflect.Select(cases)</span></span>
<span class="line"><span>        if recv.IsValid() { // recv case</span></span>
<span class="line"><span>            fmt.Println(&quot;recv:&quot;, cases[chosen].Dir, recv, ok)</span></span>
<span class="line"><span>        } else { // send case</span></span>
<span class="line"><span>            fmt.Println(&quot;send:&quot;, cases[chosen].Dir, ok)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func createCases(chs ...chan int) []reflect.SelectCase {</span></span>
<span class="line"><span>    var cases []reflect.SelectCase</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建recv case</span></span>
<span class="line"><span>    for _, ch := range chs {</span></span>
<span class="line"><span>        cases = append(cases, reflect.SelectCase{</span></span>
<span class="line"><span>            Dir:  reflect.SelectRecv,</span></span>
<span class="line"><span>            Chan: reflect.ValueOf(ch),</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建send case</span></span>
<span class="line"><span>    for i, ch := range chs {</span></span>
<span class="line"><span>        v := reflect.ValueOf(i)</span></span>
<span class="line"><span>        cases = append(cases, reflect.SelectCase{</span></span>
<span class="line"><span>            Dir:  reflect.SelectSend,</span></span>
<span class="line"><span>            Chan: reflect.ValueOf(ch),</span></span>
<span class="line"><span>            Send: v,</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return cases</span></span>
<span class="line"><span>}</span></span></code></pre></div><h1 id="典型的应用场景" tabindex="-1">典型的应用场景 <a class="header-anchor" href="#典型的应用场景" aria-label="Permalink to &quot;典型的应用场景&quot;">​</a></h1><p>了解刚刚的反射用法，我们就解决了今天的基础知识问题，接下来，我就带你具体学习下Channel的应用场景。</p><p>首先来看消息交流。</p><h2 id="消息交流" tabindex="-1">消息交流 <a class="header-anchor" href="#消息交流" aria-label="Permalink to &quot;消息交流&quot;">​</a></h2><p>从chan的内部实现看，它是以一个循环队列的方式存放数据，所以，它有时候也会被当成线程安全的队列和buffer使用。一个goroutine可以安全地往Channel中塞数据，另外一个goroutine可以安全地从Channel中读取数据，goroutine就可以安全地实现信息交流了。</p><p>我们来看几个例子。</p><p>第一个例子是worker池的例子。Marcio Castilho 在 <a href="http://marcio.io/2015/07/handling-1-million-requests-per-minute-with-golang/" target="_blank" rel="noreferrer">使用Go每分钟处理百万请求</a> 这篇文章中，就介绍了他们应对大并发请求的设计。他们将用户的请求放在一个 chan Job 中，这个chan Job就相当于一个待处理任务队列。除此之外，还有一个chan chan Job队列，用来存放可以处理任务的worker的缓存队列。</p><p>dispatcher会把待处理任务队列中的任务放到一个可用的缓存队列中，worker会一直处理它的缓存队列。通过使用Channel，实现了一个worker池的任务处理中心，并且解耦了前端HTTP请求处理和后端任务处理的逻辑。</p><p>我在讲Pool的时候，提到了一些第三方实现的worker池，它们全部都是通过Channel实现的，这是Channel的一个常见的应用场景。worker池的生产者和消费者的消息交流都是通过Channel实现的。</p><p>第二个例子是etcd中的node节点的实现，包含大量的chan字段，比如recvc是消息处理的chan，待处理的protobuf消息都扔到这个chan中，node有一个专门的run goroutine负责处理这些消息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/306614/0643503a1yy135b476d41345d71766a4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/306614/0643503a1yy135b476d41345d71766a4.png" alt=""></a></p><h2 id="数据传递" tabindex="-1">数据传递 <a class="header-anchor" href="#数据传递" aria-label="Permalink to &quot;数据传递&quot;">​</a></h2><p>“击鼓传花”的游戏很多人都玩过，花从一个人手中传给另外一个人，就有点类似流水线的操作。这个花就是数据，花在游戏者之间流转，这就类似编程中的数据传递。</p><p>还记得上节课我给你留了一道任务编排的题吗？其实它就可以用数据传递的方式实现。</p><blockquote><p>有4个goroutine，编号为1、2、3、4。每秒钟会有一个goroutine打印出它自己的编号，要求你编写程序，让输出的编号总是按照1、2、3、4、1、2、3、4……这个顺序打印出来。</p></blockquote><p>为了实现顺序的数据传递，我们可以定义一个令牌的变量，谁得到令牌，谁就可以打印一次自己的编号，同时将令牌 <strong>传递</strong> 给下一个goroutine，我们尝试使用chan来实现，可以看下下面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Token struct{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func newWorker(id int, ch chan Token, nextCh chan Token) {</span></span>
<span class="line"><span>    for {</span></span>
<span class="line"><span>        token := &lt;-ch         // 取得令牌</span></span>
<span class="line"><span>        fmt.Println((id + 1)) // id从1开始</span></span>
<span class="line"><span>        time.Sleep(time.Second)</span></span>
<span class="line"><span>        nextCh &lt;- token</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    chs := []chan Token{make(chan Token), make(chan Token), make(chan Token), make(chan Token)}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建4个worker</span></span>
<span class="line"><span>    for i := 0; i &lt; 4; i++ {</span></span>
<span class="line"><span>        go newWorker(i, chs[i], chs[(i+1)%4])</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //首先把令牌交给第一个worker</span></span>
<span class="line"><span>    chs[0] &lt;- struct{}{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    select {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我来给你具体解释下这个实现方式。</p><p>首先，我们定义一个令牌类型（Token），接着定义一个创建worker的方法，这个方法会从它自己的chan中读取令牌。哪个goroutine取得了令牌，就可以打印出自己编号，因为需要每秒打印一次数据，所以，我们让它休眠1秒后，再把令牌交给它的下家。</p><p>接着，在第16行启动每个worker的goroutine，并在第20行将令牌先交给第一个worker。</p><p>如果你运行这个程序，就会在命令行中看到每一秒就会输出一个编号，而且编号是以1、2、3、4这样的顺序输出的。</p><p>这类场景有一个特点，就是当前持有数据的goroutine都有一个信箱，信箱使用chan实现，goroutine只需要关注自己的信箱中的数据，处理完毕后，就把结果发送到下一家的信箱中。</p><h2 id="信号通知" tabindex="-1">信号通知 <a class="header-anchor" href="#信号通知" aria-label="Permalink to &quot;信号通知&quot;">​</a></h2><p>chan类型有这样一个特点：chan如果为空，那么，receiver接收数据的时候就会阻塞等待，直到chan被关闭或者有新的数据到来。利用这个机制，我们可以实现wait/notify的设计模式。</p><p>传统的并发原语Cond也能实现这个功能。但是，Cond使用起来比较复杂，容易出错，而使用chan实现wait/notify模式，就方便多了。</p><p>除了正常的业务处理时的wait/notify，我们经常碰到的一个场景，就是程序关闭的时候，我们需要在退出之前做一些清理（doCleanup方法）的动作。这个时候，我们经常要使用chan。</p><p>比如，使用chan实现程序的graceful shutdown，在退出之前执行一些连接关闭、文件close、缓存落盘等一些动作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>	go func() {</span></span>
<span class="line"><span>      ...... // 执行业务处理</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 处理CTRL+C等中断信号</span></span>
<span class="line"><span>	termChan := make(chan os.Signal)</span></span>
<span class="line"><span>	signal.Notify(termChan, syscall.SIGINT, syscall.SIGTERM)</span></span>
<span class="line"><span>	&lt;-termChan</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 执行退出之前的清理动作</span></span>
<span class="line"><span>    doCleanup()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	fmt.Println(&quot;优雅退出&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有时候，doCleanup可能是一个很耗时的操作，比如十几分钟才能完成，如果程序退出需要等待这么长时间，用户是不能接受的，所以，在实践中，我们需要设置一个最长的等待时间。只要超过了这个时间，程序就不再等待，可以直接退出。所以，退出的时候分为两个阶段：</p><ol><li>closing，代表程序退出，但是清理工作还没做；</li><li>closed，代表清理工作已经做完。</li></ol><p>所以，上面的例子可以改写如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func main() {</span></span>
<span class="line"><span>    var closing = make(chan struct{})</span></span>
<span class="line"><span>    var closed = make(chan struct{})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        // 模拟业务处理</span></span>
<span class="line"><span>        for {</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &lt;-closing:</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            default:</span></span>
<span class="line"><span>                // ....... 业务计算</span></span>
<span class="line"><span>                time.Sleep(100 * time.Millisecond)</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 处理CTRL+C等中断信号</span></span>
<span class="line"><span>    termChan := make(chan os.Signal)</span></span>
<span class="line"><span>    signal.Notify(termChan, syscall.SIGINT, syscall.SIGTERM)</span></span>
<span class="line"><span>    &lt;-termChan</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    close(closing)</span></span>
<span class="line"><span>    // 执行退出之前的清理动作</span></span>
<span class="line"><span>    go doCleanup(closed)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    select {</span></span>
<span class="line"><span>    case &lt;-closed:</span></span>
<span class="line"><span>    case &lt;-time.After(time.Second):</span></span>
<span class="line"><span>        fmt.Println(&quot;清理超时，不等了&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fmt.Println(&quot;优雅退出&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func doCleanup(closed chan struct{}) {</span></span>
<span class="line"><span>    time.Sleep((time.Minute))</span></span>
<span class="line"><span>    close(closed)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="锁" tabindex="-1">锁 <a class="header-anchor" href="#锁" aria-label="Permalink to &quot;锁&quot;">​</a></h2><p>使用chan也可以实现互斥锁。</p><p>在chan的内部实现中，就有一把互斥锁保护着它的所有字段。从外在表现上，chan的发送和接收之间也存在着happens-before的关系，保证元素放进去之后，receiver才能读取到（关于happends-before的关系，是指事件发生的先后顺序关系，我会在下一讲详细介绍，这里你只需要知道它是一种描述事件先后顺序的方法）。</p><p>要想使用chan实现互斥锁，至少有两种方式。一种方式是先初始化一个capacity等于1的Channel，然后再放入一个元素。这个元素就代表锁，谁取得了这个元素，就相当于获取了这把锁。另一种方式是，先初始化一个capacity等于1的Channel，它的“空槽”代表锁，谁能成功地把元素发送到这个Channel，谁就获取了这把锁。</p><p>这是使用Channel实现锁的两种不同实现方式，我重点介绍下第一种。理解了这种实现方式，第二种方式也就很容易掌握了，我就不多说了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用chan实现互斥锁</span></span>
<span class="line"><span>type Mutex struct {</span></span>
<span class="line"><span>    ch chan struct{}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用锁需要初始化</span></span>
<span class="line"><span>func NewMutex() *Mutex {</span></span>
<span class="line"><span>    mu := &amp;Mutex{make(chan struct{}, 1)}</span></span>
<span class="line"><span>    mu.ch &lt;- struct{}{}</span></span>
<span class="line"><span>    return mu</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 请求锁，直到获取到</span></span>
<span class="line"><span>func (m *Mutex) Lock() {</span></span>
<span class="line"><span>    &lt;-m.ch</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 解锁</span></span>
<span class="line"><span>func (m *Mutex) Unlock() {</span></span>
<span class="line"><span>    select {</span></span>
<span class="line"><span>    case m.ch &lt;- struct{}{}:</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        panic(&quot;unlock of unlocked mutex&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 尝试获取锁</span></span>
<span class="line"><span>func (m *Mutex) TryLock() bool {</span></span>
<span class="line"><span>    select {</span></span>
<span class="line"><span>    case &lt;-m.ch:</span></span>
<span class="line"><span>        return true</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 加入一个超时的设置</span></span>
<span class="line"><span>func (m *Mutex) LockTimeout(timeout time.Duration) bool {</span></span>
<span class="line"><span>    timer := time.NewTimer(timeout)</span></span>
<span class="line"><span>    select {</span></span>
<span class="line"><span>    case &lt;-m.ch:</span></span>
<span class="line"><span>        timer.Stop()</span></span>
<span class="line"><span>        return true</span></span>
<span class="line"><span>    case &lt;-timer.C:</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 锁是否已被持有</span></span>
<span class="line"><span>func (m *Mutex) IsLocked() bool {</span></span>
<span class="line"><span>    return len(m.ch) == 0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    m := NewMutex()</span></span>
<span class="line"><span>    ok := m.TryLock()</span></span>
<span class="line"><span>    fmt.Printf(&quot;locked v %v\\n&quot;, ok)</span></span>
<span class="line"><span>    ok = m.TryLock()</span></span>
<span class="line"><span>    fmt.Printf(&quot;locked %v\\n&quot;, ok)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以用buffer等于1的chan实现互斥锁，在初始化这个锁的时候往Channel中先塞入一个元素，谁把这个元素取走，谁就获取了这把锁，把元素放回去，就是释放了锁。元素在放回到chan之前，不会有goroutine能从chan中取出元素的，这就保证了互斥性。</p><p>在这段代码中，还有一点需要我们注意下：利用select+chan的方式，很容易实现TryLock、Timeout的功能。具体来说就是，在select语句中，我们可以使用default实现TryLock，使用一个Timer来实现Timeout的功能。</p><h2 id="任务编排" tabindex="-1">任务编排 <a class="header-anchor" href="#任务编排" aria-label="Permalink to &quot;任务编排&quot;">​</a></h2><p>前面所说的消息交流的场景是一个特殊的任务编排的场景，这个“击鼓传花”的模式也被称为流水线模式。</p><p>在 <a href="https://time.geekbang.org/column/article/298516" target="_blank" rel="noreferrer">第6讲</a>，我们学习了WaitGroup，我们可以利用它实现等待模式：启动一组goroutine执行任务，然后等待这些任务都完成。其实，我们也可以使用chan实现WaitGroup的功能。这个比较简单，我就不举例子了，接下来我介绍几种更复杂的编排模式。</p><p>这里的编排既指安排goroutine按照指定的顺序执行，也指多个chan按照指定的方式组合处理的方式。goroutine的编排类似“击鼓传花”的例子，我们通过编排数据在chan之间的流转，就可以控制goroutine的执行。接下来，我来重点介绍下多个chan的编排方式，总共5种，分别是Or-Done模式、扇入模式、扇出模式、Stream和map-reduce。</p><h3 id="or-done模式" tabindex="-1">Or-Done模式 <a class="header-anchor" href="#or-done模式" aria-label="Permalink to &quot;Or-Done模式&quot;">​</a></h3><p>首先来看Or-Done模式。Or-Done模式是信号通知模式中更宽泛的一种模式。这里提到了“信号通知模式”，我先来解释一下。</p><p>我们会使用“信号通知”实现某个任务执行完成后的通知机制，在实现时，我们为这个任务定义一个类型为chan struct{}类型的done变量，等任务结束后，我们就可以close这个变量，然后，其它receiver就会收到这个通知。</p><p>这是有一个任务的情况，如果有多个任务，只要有任意一个任务执行完，我们就想获得这个信号，这就是Or-Done模式。</p><p>比如，你发送同一个请求到多个微服务节点，只要任意一个微服务节点返回结果，就算成功，这个时候，就可以参考下面的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func or(channels ...&lt;-chan interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    // 特殊情况，只有零个或者1个chan</span></span>
<span class="line"><span>    switch len(channels) {</span></span>
<span class="line"><span>    case 0:</span></span>
<span class="line"><span>        return nil</span></span>
<span class="line"><span>    case 1:</span></span>
<span class="line"><span>        return channels[0]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    orDone := make(chan interface{})</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(orDone)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        switch len(channels) {</span></span>
<span class="line"><span>        case 2: // 2个也是一种特殊情况</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &lt;-channels[0]:</span></span>
<span class="line"><span>            case &lt;-channels[1]:</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        default: //超过两个，二分法递归处理</span></span>
<span class="line"><span>            m := len(channels) / 2</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &lt;-or(channels[:m]...):</span></span>
<span class="line"><span>            case &lt;-or(channels[m:]...):</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return orDone</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以写一个测试程序测试它：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func sig(after time.Duration) &lt;-chan interface{} {</span></span>
<span class="line"><span>    c := make(chan interface{})</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(c)</span></span>
<span class="line"><span>        time.Sleep(after)</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    return c</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    start := time.Now()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;-or(</span></span>
<span class="line"><span>        sig(10*time.Second),</span></span>
<span class="line"><span>        sig(20*time.Second),</span></span>
<span class="line"><span>        sig(30*time.Second),</span></span>
<span class="line"><span>        sig(40*time.Second),</span></span>
<span class="line"><span>        sig(50*time.Second),</span></span>
<span class="line"><span>        sig(01*time.Minute),</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fmt.Printf(&quot;done after %v&quot;, time.Since(start))</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的实现使用了一个巧妙的方式， <strong>当chan的数量大于2时，使用递归的方式等待信号</strong>。</p><p>在chan数量比较多的情况下，递归并不是一个很好的解决方式，根据这一讲最开始介绍的反射的方法，我们也可以实现Or-Done模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func or(channels ...&lt;-chan interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    //特殊情况，只有0个或者1个</span></span>
<span class="line"><span>    switch len(channels) {</span></span>
<span class="line"><span>    case 0:</span></span>
<span class="line"><span>        return nil</span></span>
<span class="line"><span>    case 1:</span></span>
<span class="line"><span>        return channels[0]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    orDone := make(chan interface{})</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(orDone)</span></span>
<span class="line"><span>        // 利用反射构建SelectCase</span></span>
<span class="line"><span>        var cases []reflect.SelectCase</span></span>
<span class="line"><span>        for _, c := range channels {</span></span>
<span class="line"><span>            cases = append(cases, reflect.SelectCase{</span></span>
<span class="line"><span>                Dir:  reflect.SelectRecv,</span></span>
<span class="line"><span>                Chan: reflect.ValueOf(c),</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 随机选择一个可用的case</span></span>
<span class="line"><span>        reflect.Select(cases)</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return orDone</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这是递归和反射两种方法实现Or-Done模式的代码。反射方式避免了深层递归的情况，可以处理有大量chan的情况。其实最笨的一种方法就是为每一个Channel启动一个goroutine，不过这会启动非常多的goroutine，太多的goroutine会影响性能，所以不太常用。你只要知道这种用法就行了，不用重点掌握。</p><h3 id="扇入模式" tabindex="-1">扇入模式 <a class="header-anchor" href="#扇入模式" aria-label="Permalink to &quot;扇入模式&quot;">​</a></h3><p>扇入借鉴了数字电路的概念，它定义了单个逻辑门能够接受的数字信号输入最大量的术语。一个逻辑门可以有多个输入，一个输出。</p><p>在软件工程中，模块的扇入是指有多少个上级模块调用它。而对于我们这里的Channel扇入模式来说，就是指有多个源Channel输入、一个目的Channel输出的情况。扇入比就是源Channel数量比1。</p><p>每个源Channel的元素都会发送给目标Channel，相当于目标Channel的receiver只需要监听目标Channel，就可以接收所有发送给源Channel的数据。</p><p>扇入模式也可以使用反射、递归，或者是用最笨的每个goroutine处理一个Channel的方式来实现。</p><p>这里我列举下递归和反射的方式，帮你加深一下对这个技巧的理解。</p><p>反射的代码比较简短，易于理解，主要就是构造出SelectCase slice，然后传递给reflect.Select语句。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func fanInReflect(chans ...&lt;-chan interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    out := make(chan interface{})</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(out)</span></span>
<span class="line"><span>        // 构造SelectCase slice</span></span>
<span class="line"><span>        var cases []reflect.SelectCase</span></span>
<span class="line"><span>        for _, c := range chans {</span></span>
<span class="line"><span>            cases = append(cases, reflect.SelectCase{</span></span>
<span class="line"><span>                Dir:  reflect.SelectRecv,</span></span>
<span class="line"><span>                Chan: reflect.ValueOf(c),</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 循环，从cases中选择一个可用的</span></span>
<span class="line"><span>        for len(cases) &gt; 0 {</span></span>
<span class="line"><span>            i, v, ok := reflect.Select(cases)</span></span>
<span class="line"><span>            if !ok { // 此channel已经close</span></span>
<span class="line"><span>                cases = append(cases[:i], cases[i+1:]...)</span></span>
<span class="line"><span>                continue</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            out &lt;- v.Interface()</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    return out</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>递归模式也是在Channel大于2时，采用二分法递归merge。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func fanInRec(chans ...&lt;-chan interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    switch len(chans) {</span></span>
<span class="line"><span>    case 0:</span></span>
<span class="line"><span>        c := make(chan interface{})</span></span>
<span class="line"><span>        close(c)</span></span>
<span class="line"><span>        return c</span></span>
<span class="line"><span>    case 1:</span></span>
<span class="line"><span>        return chans[0]</span></span>
<span class="line"><span>    case 2:</span></span>
<span class="line"><span>        return mergeTwo(chans[0], chans[1])</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        m := len(chans) / 2</span></span>
<span class="line"><span>        return mergeTwo(</span></span>
<span class="line"><span>            fanInRec(chans[:m]...),</span></span>
<span class="line"><span>            fanInRec(chans[m:]...))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有一个mergeTwo的方法，是将两个Channel合并成一个Channel，是扇入形式的一种特例（只处理两个Channel）。 下面我来借助一段代码帮你理解下这个方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func mergeTwo(a, b &lt;-chan interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    c := make(chan interface{})</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(c)</span></span>
<span class="line"><span>        for a != nil || b != nil { //只要还有可读的chan</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case v, ok := &lt;-a:</span></span>
<span class="line"><span>                if !ok { // a 已关闭，设置为nil</span></span>
<span class="line"><span>                    a = nil</span></span>
<span class="line"><span>                    continue</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                c &lt;- v</span></span>
<span class="line"><span>            case v, ok := &lt;-b:</span></span>
<span class="line"><span>                if !ok { // b 已关闭，设置为nil</span></span>
<span class="line"><span>                    b = nil</span></span>
<span class="line"><span>                    continue</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                c &lt;- v</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    return c</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="扇出模式" tabindex="-1">扇出模式 <a class="header-anchor" href="#扇出模式" aria-label="Permalink to &quot;扇出模式&quot;">​</a></h3><p>有扇入模式，就有扇出模式，扇出模式是和扇入模式相反的。</p><p>扇出模式只有一个输入源Channel，有多个目标Channel，扇出比就是1比目标Channel数的值，经常用在设计模式中的 <a href="https://baike.baidu.com/item/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F/5881786?fr=aladdin" target="_blank" rel="noreferrer">观察者模式</a> 中（观察者设计模式定义了对象间的一种一对多的组合关系。这样一来，一个对象的状态发生变化时，所有依赖于它的对象都会得到通知并自动刷新）。在观察者模式中，数据变动后，多个观察者都会收到这个变更信号。</p><p>下面是一个扇出模式的实现。从源Channel取出一个数据后，依次发送给目标Channel。在发送给目标Channel的时候，可以同步发送，也可以异步发送：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func fanOut(ch &lt;-chan interface{}, out []chan interface{}, async bool) {</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer func() { //退出时关闭所有的输出chan</span></span>
<span class="line"><span>            for i := 0; i &lt; len(out); i++ {</span></span>
<span class="line"><span>                close(out[i])</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for v := range ch { // 从输入chan中读取数据</span></span>
<span class="line"><span>            v := v</span></span>
<span class="line"><span>            for i := 0; i &lt; len(out); i++ {</span></span>
<span class="line"><span>                i := i</span></span>
<span class="line"><span>                if async { //异步</span></span>
<span class="line"><span>                    go func() {</span></span>
<span class="line"><span>                        out[i] &lt;- v // 放入到输出chan中,异步方式</span></span>
<span class="line"><span>                    }()</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    out[i] &lt;- v // 放入到输出chan中，同步方式</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你也可以尝试使用反射的方式来实现，我就不列相关代码了，希望你课后可以自己思考下。</p><h3 id="stream" tabindex="-1">Stream <a class="header-anchor" href="#stream" aria-label="Permalink to &quot;Stream&quot;">​</a></h3><p>这里我来介绍一种把Channel当作流式管道使用的方式，也就是把Channel看作流（Stream），提供跳过几个元素，或者是只取其中的几个元素等方法。</p><p>首先，我们提供创建流的方法。这个方法把一个数据slice转换成流：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func asStream(done &lt;-chan struct{}, values ...interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    s := make(chan interface{}) //创建一个unbuffered的channel</span></span>
<span class="line"><span>    go func() { // 启动一个goroutine，往s中塞数据</span></span>
<span class="line"><span>        defer close(s) // 退出时关闭chan</span></span>
<span class="line"><span>        for _, v := range values { // 遍历数组</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &lt;-done:</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            case s &lt;- v: // 将数组元素塞入到chan中</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    return s</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>流创建好以后，该咋处理呢？下面我再给你介绍下实现流的方法。</p><ol><li>takeN：只取流中的前n个数据；</li><li>takeFn：筛选流中的数据，只保留满足条件的数据；</li><li>takeWhile：只取前面满足条件的数据，一旦不满足条件，就不再取；</li><li>skipN：跳过流中前几个数据；</li><li>skipFn：跳过满足条件的数据；</li><li>skipWhile：跳过前面满足条件的数据，一旦不满足条件，当前这个元素和以后的元素都会输出给Channel的receiver。</li></ol><p>这些方法的实现很类似，我们以takeN为例来具体解释一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func takeN(done &lt;-chan struct{}, valueStream &lt;-chan interface{}, num int) &lt;-chan interface{} {</span></span>
<span class="line"><span>    takeStream := make(chan interface{}) // 创建输出流</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(takeStream)</span></span>
<span class="line"><span>        for i := 0; i &lt; num; i++ { // 只读取前num个元素</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &lt;-done:</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            case takeStream &lt;- &lt;-valueStream: //从输入流中读取元素</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    return takeStream</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="map-reduce" tabindex="-1">map-reduce <a class="header-anchor" href="#map-reduce" aria-label="Permalink to &quot;map-reduce&quot;">​</a></h3><p>map-reduce是一种处理数据的方式，最早是由Google公司研究提出的一种面向大规模数据处理的并行计算模型和方法，开源的版本是hadoop，前几年比较火。</p><p>不过，我要讲的并不是分布式的map-reduce，而是单机单进程的map-reduce方法。</p><p>map-reduce分为两个步骤，第一步是映射（map），处理队列中的数据，第二步是规约（reduce），把列表中的每一个元素按照一定的处理方式处理成结果，放入到结果队列中。</p><p>就像做汉堡一样，map就是单独处理每一种食材，reduce就是从每一份食材中取一部分，做成一个汉堡。</p><p>我们先来看下map函数的处理逻辑:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func mapChan(in &lt;-chan interface{}, fn func(interface{}) interface{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    out := make(chan interface{}) //创建一个输出chan</span></span>
<span class="line"><span>    if in == nil { // 异常检查</span></span>
<span class="line"><span>        close(out)</span></span>
<span class="line"><span>        return out</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    go func() { // 启动一个goroutine,实现map的主要逻辑</span></span>
<span class="line"><span>        defer close(out)</span></span>
<span class="line"><span>        for v := range in { // 从输入chan读取数据，执行业务操作，也就是map操作</span></span>
<span class="line"><span>            out &lt;- fn(v)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return out</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>reduce函数的处理逻辑如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func reduce(in &lt;-chan interface{}, fn func(r, v interface{}) interface{}) interface{} {</span></span>
<span class="line"><span>    if in == nil { // 异常检查</span></span>
<span class="line"><span>        return nil</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    out := &lt;-in // 先读取第一个元素</span></span>
<span class="line"><span>    for v := range in { // 实现reduce的主要逻辑</span></span>
<span class="line"><span>        out = fn(out, v)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return out</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以写一个程序，这个程序使用map-reduce模式处理一组整数，map函数就是为每个整数乘以10，reduce函数就是把map处理的结果累加起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 生成一个数据流</span></span>
<span class="line"><span>func asStream(done &lt;-chan struct{}) &lt;-chan interface{} {</span></span>
<span class="line"><span>    s := make(chan interface{})</span></span>
<span class="line"><span>    values := []int{1, 2, 3, 4, 5}</span></span>
<span class="line"><span>    go func() {</span></span>
<span class="line"><span>        defer close(s)</span></span>
<span class="line"><span>        for _, v := range values { // 从数组生成</span></span>
<span class="line"><span>            select {</span></span>
<span class="line"><span>            case &lt;-done:</span></span>
<span class="line"><span>                return</span></span>
<span class="line"><span>            case s &lt;- v:</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }()</span></span>
<span class="line"><span>    return s</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    in := asStream(nil)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // map操作: 乘以10</span></span>
<span class="line"><span>    mapFn := func(v interface{}) interface{} {</span></span>
<span class="line"><span>        return v.(int) * 10</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // reduce操作: 对map的结果进行累加</span></span>
<span class="line"><span>    reduceFn := func(r, v interface{}) interface{} {</span></span>
<span class="line"><span>        return r.(int) + v.(int)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sum := reduce(mapChan(in, mapFn), reduceFn) //返回累加结果</span></span>
<span class="line"><span>    fmt.Println(sum)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h1 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h1><p>这节课，我借助代码示例，带你学习了Channel的应用场景和应用模式。这几种模式不是我们学习的终点，而是学习的起点。掌握了这几种模式之后，我们可以延伸出更多的模式。</p><p>虽然Channel最初是基于CSP设计的用于goroutine之间的消息传递的一种数据类型，但是，除了消息传递这个功能之外，大家居然还演化出了各式各样的应用模式。我不确定Go的创始人在设计这个类型的时候，有没有想到这一点，但是，我确实被各位大牛利用Channel的各种点子折服了，比如有人实现了一个基于TCP网络的分布式的Channel。</p><p>在使用Go开发程序的时候，你也不妨多考虑考虑是否能够使用chan类型，看看你是不是也能创造出别具一格的应用模式。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/306614/4140728d1f331beaf92e712cd34681c9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98%E8%AF%BE/images/306614/4140728d1f331beaf92e712cd34681c9.jpg" alt=""></a></p><h1 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h1><p>想一想，我们在利用chan实现互斥锁的时候，如果buffer设置的不是1，而是一个更大的值，会出现什么状况吗？能解决什么问题吗？</p><p>欢迎在留言区写下你的思考和答案，我们一起交流讨论。如果你觉得有所收获，也欢迎你把今天的内容分享给你的朋友或同事。</p>`,117)])])}const f=s(l,[["render",c]]);export{d as __pageData,f as default};
