import{_ as e,H as n,f as s,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"19 | 比较：Jetty的线程策略EatWhatYouKill","description":"","frontmatter":{},"headers":[{"level":2,"title":"Selector编程的一般思路","slug":"selector编程的一般思路","link":"#selector编程的一般思路","children":[]},{"level":2,"title":"Jetty中的Selector编程","slug":"jetty中的selector编程","link":"#jetty中的selector编程","children":[]},{"level":2,"title":"本期精华","slug":"本期精华","link":"#本期精华","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"深入拆解Tomcat&Jetty/19-比较：Jetty的线程策略EatWhatYouKill.md","filePath":"深入拆解Tomcat&Jetty/19-比较：Jetty的线程策略EatWhatYouKill.md","lastUpdated":1779821049000}'),t={name:"深入拆解Tomcat&Jetty/19-比较：Jetty的线程策略EatWhatYouKill.md"};function l(c,a,i,o,r,d){return n(),s("div",null,[...a[0]||(a[0]=[p(`<h1 id="_19-比较-jetty的线程策略eatwhatyoukill" tabindex="-1">19 | 比较：Jetty的线程策略EatWhatYouKill <a class="header-anchor" href="#_19-比较-jetty的线程策略eatwhatyoukill" aria-label="Permalink to &quot;19 | 比较：Jetty的线程策略EatWhatYouKill&quot;">​</a></h1><p>我在前面的专栏里介绍了Jetty的总体架构设计，简单回顾一下，Jetty总体上是由一系列Connector、一系列Handler和一个ThreadPool组成，它们的关系如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/9b0e08e109f41b1c02b9f324c0a71241.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/9b0e08e109f41b1c02b9f324c0a71241.jpg" alt=""></a></p><p>相比较Tomcat的连接器，Jetty的Connector在设计上有自己的特点。Jetty的Connector支持NIO通信模型，我们知道 <strong>NIO模型中的主角就是Selector</strong>，Jetty在Java原生Selector的基础上封装了自己的Selector，叫作ManagedSelector。ManagedSelector在线程策略方面做了大胆尝试，将I/O事件的侦测和处理放到同一个线程来处理，充分利用了CPU缓存并减少了线程上下文切换的开销。</p><p>具体的数字是，根据Jetty的官方测试，这种名为“EatWhatYouKill”的线程策略将吞吐量提高了8倍。你一定很好奇它是如何实现的吧，今天我们就来看一看这背后的原理是什么。</p><h2 id="selector编程的一般思路" tabindex="-1">Selector编程的一般思路 <a class="header-anchor" href="#selector编程的一般思路" aria-label="Permalink to &quot;Selector编程的一般思路&quot;">​</a></h2><p>常规的NIO编程思路是，将I/O事件的侦测和请求的处理分别用不同的线程处理。具体过程是：</p><p>启动一个线程，在一个死循环里不断地调用select方法，检测Channel的I/O状态，一旦I/O事件达到，比如数据就绪，就把该I/O事件以及一些数据包装成一个Runnable，将Runnable放到新线程中去处理。</p><p>在这个过程中按照职责划分，有两个线程在干活，一个是I/O事件检测线程，另一个是I/O事件处理线程。我们仔细思考一下这两者的关系，其实它们是生产者和消费者的关系。I/O事件侦测线程作为生产者，负责“生产”I/O事件，也就是负责接活儿的老板；I/O处理线程是消费者，它“消费”并处理I/O事件，就是干苦力的员工。把这两个工作用不同的线程来处理，好处是它们互不干扰和阻塞对方。</p><h2 id="jetty中的selector编程" tabindex="-1">Jetty中的Selector编程 <a class="header-anchor" href="#jetty中的selector编程" aria-label="Permalink to &quot;Jetty中的Selector编程&quot;">​</a></h2><p>然而世事无绝对，将I/O事件检测和业务处理这两种工作分开的思路也有缺点。当Selector检测读就绪事件时，数据已经被拷贝到内核中的缓存了，同时CPU的缓存中也有这些数据了，我们知道CPU本身的缓存比内存快多了，这时当应用程序去读取这些数据时，如果用另一个线程去读，很有可能这个读线程使用另一个CPU核，而不是之前那个检测数据就绪的CPU核，这样CPU缓存中的数据就用不上了，并且线程切换也需要开销。</p><p>因此Jetty的Connector做了一个大胆尝试，那就是用 <strong>把I/O事件的生产和消费放到同一个线程来处理</strong>，如果这两个任务由同一个线程来执行，如果执行过程中线程不阻塞，操作系统会用同一个CPU核来执行这两个任务，这样就能利用CPU缓存了。那具体是如何做的呢，我们还是来详细分析一下Connector中的ManagedSelector组件。</p><p><strong>ManagedSelector</strong></p><p>ManagedSelector的本质就是一个Selector，负责I/O事件的检测和分发。为了方便使用，Jetty在Java原生的Selector上做了一些扩展，就变成了ManagedSelector，我们先来看看它有哪些成员变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ManagedSelector extends ContainerLifeCycle implements Dumpable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //原子变量，表明当前的ManagedSelector是否已经启动</span></span>
<span class="line"><span>    private final AtomicBoolean _started = new AtomicBoolean(false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //表明是否阻塞在select调用上</span></span>
<span class="line"><span>    private boolean _selecting = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //管理器的引用，SelectorManager管理若干ManagedSelector的生命周期</span></span>
<span class="line"><span>    private final SelectorManager _selectorManager;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //ManagedSelector不止一个，为它们每人分配一个id</span></span>
<span class="line"><span>    private final int _id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关键的执行策略，生产者和消费者是否在同一个线程处理由它决定</span></span>
<span class="line"><span>    private final ExecutionStrategy _strategy;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //Java原生的Selector</span></span>
<span class="line"><span>    private Selector _selector;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //&quot;Selector更新任务&quot;队列</span></span>
<span class="line"><span>    private Deque&lt;​SelectorUpdate&gt; _updates = new ArrayDeque&lt;&gt;();</span></span>
<span class="line"><span>    private Deque&lt;​SelectorUpdate&gt; _updateable = new ArrayDeque&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些成员变量中其他的都好理解，就是“Selector更新任务”队列 <code>_updates</code> 和执行策略 <code>_strategy</code> 可能不是很直观。</p><p><strong>SelectorUpdate接口</strong></p><p>为什么需要一个“Selector更新任务”队列呢，对于Selector的用户来说，我们对Selector的操作无非是将Channel注册到Selector或者告诉Selector我对什么I/O事件感兴趣，那么这些操作其实就是对Selector状态的更新，Jetty把这些操作抽象成SelectorUpdate接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * A selector update to be done when the selector has been woken.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface SelectorUpdate</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void update(Selector selector);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这意味着如果你不能直接操作ManageSelector中的Selector，而是需要向ManagedSelector提交一个任务类，这个类需要实现SelectorUpdate接口update方法，在update方法里定义你想要对ManagedSelector做的操作。</p><p>比如Connector中Endpoint组件对读就绪事件感兴趣，它就向ManagedSelector提交了一个内部任务类ManagedSelector.SelectorUpdate：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_selector.submit(_updateKeyAction);</span></span></code></pre></div><p>这个 <code>_updateKeyAction</code> 就是一个SelectorUpdate实例，它的update方法实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private final ManagedSelector.SelectorUpdate _updateKeyAction = new ManagedSelector.SelectorUpdate()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void update(Selector selector)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //这里的updateKey其实就是调用了SelectionKey.interestOps(OP_READ);</span></span>
<span class="line"><span>        updateKey();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>我们看到在update方法里，调用了SelectionKey类的interestOps方法，传入的参数是 <code>OP_READ</code>，意思是现在我对这个Channel上的读就绪事件感兴趣了。</p><p>那谁来负责执行这些update方法呢，答案是ManagedSelector自己，它在一个死循环里拉取这些SelectorUpdate任务类逐个执行。</p><p><strong>Selectable接口</strong></p><p>那I/O事件到达时，ManagedSelector怎么知道应该调哪个函数来处理呢？其实也是通过一个任务类接口，这个接口就是Selectable，它返回一个Runnable，这个Runnable其实就是I/O事件就绪时相应的处理逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Selectable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //当某一个Channel的I/O事件就绪后，ManagedSelector会调用的回调函数</span></span>
<span class="line"><span>    Runnable onSelected();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //当所有事件处理完了之后ManagedSelector会调的回调函数，我们先忽略。</span></span>
<span class="line"><span>    void updateKey();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ManagedSelector在检测到某个Channel上的I/O事件就绪时，也就是说这个Channel被选中了，ManagedSelector调用这个Channel所绑定的附件类的onSelected方法来拿到一个Runnable。</p><p>这句话有点绕，其实就是ManagedSelector的使用者，比如Endpoint组件在向ManagedSelector注册读就绪事件时，同时也要告诉ManagedSelector在事件就绪时执行什么任务，具体来说就是传入一个附件类，这个附件类需要实现Selectable接口。ManagedSelector通过调用这个onSelected拿到一个Runnable，然后把Runnable扔给线程池去执行。</p><p>那Endpoint的onSelected是如何实现的呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public Runnable onSelected()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int readyOps = _key.readyOps();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    boolean fillable = (readyOps &amp; SelectionKey.OP_READ) != 0;</span></span>
<span class="line"><span>    boolean flushable = (readyOps &amp; SelectionKey.OP_WRITE) != 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // return task to complete the job</span></span>
<span class="line"><span>    Runnable task= fillable</span></span>
<span class="line"><span>            ? (flushable</span></span>
<span class="line"><span>                    ? _runCompleteWriteFillable</span></span>
<span class="line"><span>                    : _runFillable)</span></span>
<span class="line"><span>            : (flushable</span></span>
<span class="line"><span>                    ? _runCompleteWrite</span></span>
<span class="line"><span>                    : null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return task;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码逻辑很简单，就是读事件到了就读，写事件到了就写。</p><p><strong>ExecutionStrategy</strong></p><p>铺垫了这么多，终于要上主菜了。前面我主要介绍了ManagedSelector的使用者如何跟ManagedSelector交互，也就是如何注册Channel以及I/O事件，提供什么样的处理类来处理I/O事件，接下来我们来看看ManagedSelector是如何统一管理和维护用户注册的Channel集合。再回到今天开始的讨论，ManagedSelector将I/O事件的生产和消费看作是生产者消费者模式，为了充分利用CPU缓存，生产和消费尽量放到同一个线程处理，那这是如何实现的呢？Jetty定义了ExecutionStrategy接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface ExecutionStrategy</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //只在HTTP2中用到，简单起见，我们先忽略这个方法。</span></span>
<span class="line"><span>    public void dispatch();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //实现具体执行策略，任务生产出来后可能由当前线程执行，也可能由新线程来执行</span></span>
<span class="line"><span>    public void produce();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //任务的生产委托给Producer内部接口，</span></span>
<span class="line"><span>    public interface Producer</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //生产一个Runnable(任务)</span></span>
<span class="line"><span>        Runnable produce();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们看到ExecutionStrategy接口比较简单，它将具体任务的生产委托内部接口Producer，而在自己的produce方法里来实现具体执行逻辑， <strong>也就是生产出来的任务要么由当前线程执行，要么放到新线程中执行</strong>。Jetty提供了一些具体策略实现类：ProduceConsume、ProduceExecuteConsume、ExecuteProduceConsume和EatWhatYouKill。它们的区别是：</p><ul><li>ProduceConsume：任务生产者自己依次生产和执行任务，对应到NIO通信模型就是用一个线程来侦测和处理一个ManagedSelector上所有的I/O事件，后面的I/O事件要等待前面的I/O事件处理完，效率明显不高。通过图来理解，图中绿色表示生产一个任务，蓝色表示执行这个任务。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/2394d237e9f7de107bfca736ffd71f3e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/2394d237e9f7de107bfca736ffd71f3e.jpg" alt=""></a></p><ul><li>ProduceExecuteConsume：任务生产者开启新线程来运行任务，这是典型的I/O事件侦测和处理用不同的线程来处理，缺点是不能利用CPU缓存，并且线程切换成本高。同样我们通过一张图来理解，图中的棕色表示线程切换。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/7e50ce9ec1bff55bbec777e79271066d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/7e50ce9ec1bff55bbec777e79271066d.png" alt=""></a></p><ul><li>ExecuteProduceConsume：任务生产者自己运行任务，但是该策略可能会新建一个新线程以继续生产和执行任务。这种策略也被称为“吃掉你杀的猎物”，它来自狩猎伦理，认为一个人不应该杀死他不吃掉的东西，对应线程来说，不应该生成自己不打算运行的任务。它的优点是能利用CPU缓存，但是潜在的问题是如果处理I/O事件的业务代码执行时间过长，会导致线程大量阻塞和线程饥饿。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/43c2dadaf5c323edf057a90ff06a71b4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Tomcat%26Jetty/images/102651/43c2dadaf5c323edf057a90ff06a71b4.png" alt=""></a></p><ul><li>EatWhatYouKill：这是Jetty对ExecuteProduceConsume策略的改良，在线程池线程充足的情况下等同于ExecuteProduceConsume；当系统比较忙线程不够时，切换成ProduceExecuteConsume策略。为什么要这么做呢，原因是ExecuteProduceConsume是在同一线程执行I/O事件的生产和消费，它使用的线程来自Jetty全局的线程池，这些线程有可能被业务代码阻塞，如果阻塞得多了，全局线程池中的线程自然就不够用了，最坏的情况是连I/O事件的侦测都没有线程可用了，会导致Connector拒绝浏览器请求。于是Jetty做了一个优化，在低线程情况下，就执行ProduceExecuteConsume策略，I/O侦测用专门的线程处理，I/O事件的处理扔给线程池处理，其实就是放到线程池的队列里慢慢处理。</li></ul><p>分析了这几种线程策略，我们再来看看Jetty是如何实现ExecutionStrategy接口的。答案其实就是实现Produce接口生产任务，一旦任务生产出来，ExecutionStrategy会负责执行这个任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private class SelectorProducer implements ExecutionStrategy.Producer</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    private Set&lt;​SelectionKey&gt; _keys = Collections.emptySet();</span></span>
<span class="line"><span>    private Iterator&lt;​SelectionKey&gt; _cursor = Collections.emptyIterator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Runnable produce()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        while (true)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            //如何Channel集合中有I/O事件就绪，调用前面提到的Selectable接口获取Runnable,直接返回给ExecutionStrategy去处理</span></span>
<span class="line"><span>            Runnable task = processSelected();</span></span>
<span class="line"><span>            if (task != null)</span></span>
<span class="line"><span>                return task;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>           //如果没有I/O事件就绪，就干点杂活，看看有没有客户提交了更新Selector的任务，就是上面提到的SelectorUpdate任务类。</span></span>
<span class="line"><span>            processUpdates();</span></span>
<span class="line"><span>            updateKeys();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>           //继续执行select方法，侦测I/O就绪事件</span></span>
<span class="line"><span>            if (!select())</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>SelectorProducer是ManagedSelector的内部类，SelectorProducer实现了ExecutionStrategy中的Producer接口中的produce方法，需要向ExecutionStrategy返回一个Runnable。在这个方法里SelectorProducer主要干了三件事情</p><ol><li>如果Channel集合中有I/O事件就绪，调用前面提到的Selectable接口获取Runnable，直接返回给ExecutionStrategy去处理。</li><li>如果没有I/O事件就绪，就干点杂活，看看有没有客户提交了更新Selector上事件注册的任务，也就是上面提到的SelectorUpdate任务类。</li><li>干完杂活继续执行select方法，侦测I/O就绪事件。</li></ol><h2 id="本期精华" tabindex="-1">本期精华 <a class="header-anchor" href="#本期精华" aria-label="Permalink to &quot;本期精华&quot;">​</a></h2><p>多线程虽然是提高并发的法宝，但并不是说线程越多越好，CPU缓存以及线程上下文切换的开销也是需要考虑的。Jetty巧妙设计了EatWhatYouKill的线程策略，尽量用同一个线程侦测I/O事件和处理I/O事件，充分利用了CPU缓存，并减少了线程切换的开销。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>文章提到ManagedSelector的使用者不能直接向它注册I/O事件，而是需要向ManagedSelector提交一个SelectorUpdate事件，ManagedSelector将这些事件Queue起来由自己来统一处理，这样做有什么好处呢？</p><p>不知道今天的内容你消化得如何？如果还有疑问，请大胆的在留言区提问，也欢迎你把你的课后思考和心得记录下来，与我和其他同学一起讨论。如果你觉得今天有所收获，欢迎你把它分享给你的朋友。</p>`,54)])])}const h=e(t,[["render",l]]);export{g as __pageData,h as default};
