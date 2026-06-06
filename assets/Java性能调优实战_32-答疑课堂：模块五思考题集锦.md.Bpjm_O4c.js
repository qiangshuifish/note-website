import{_ as a,H as n,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"32 | 答疑课堂：模块五思考题集锦","description":"","frontmatter":{},"headers":[],"relativePath":"Java性能调优实战/32-答疑课堂：模块五思考题集锦.md","filePath":"Java性能调优实战/32-答疑课堂：模块五思考题集锦.md","lastUpdated":1779815864000}'),e={name:"Java性能调优实战/32-答疑课堂：模块五思考题集锦.md"};function l(i,s,c,r,u,o){return n(),p("div",null,[...s[0]||(s[0]=[t(`<h1 id="_32-答疑课堂-模块五思考题集锦" tabindex="-1">32 | 答疑课堂：模块五思考题集锦 <a class="header-anchor" href="#_32-答疑课堂-模块五思考题集锦" aria-label="Permalink to &quot;32 | 答疑课堂：模块五思考题集锦&quot;">​</a></h1><p>你好，我是刘超。</p><p>模块五我们都在讨论设计模式，在我看来，设计模式不仅可以优化我们的代码结构，使代码可扩展性、可读性强，同时也起到了优化系统性能的作用，这是我设置这个模块的初衷。特别是在一些高并发场景中，线程协作相关的设计模式可以大大提高程序的运行性能。</p><p>那么截至本周，有关设计模式的内容就结束了，不知你有没有发现这个模块的思考题都比较发散，很多同学也在留言区中写出了很多硬核信息，促进了技术交流。这一讲的答疑课堂我就来为你总结下课后思考题，希望我的答案能让你有新的收获。</p><p><a href="https://time.geekbang.org/column/article/109564" target="_blank" rel="noreferrer">第 26 讲</a></p><p><strong>除了以上那些实现单例的方式，你还知道其它实现方式吗？</strong></p><p>在 <a href="https://time.geekbang.org/column/article/99774" target="_blank" rel="noreferrer">第9讲</a> 中，我曾提到过一个单例序列化问题，其答案就是使用枚举来实现单例，这样可以避免Java序列化破坏一个类的单例。</p><p>枚举生来就是单例，枚举类的域（field）其实是相应的enum类型的一个实例对象，因为在Java中枚举是一种语法糖，所以在编译后，枚举类中的枚举域会被声明为static属性。</p><p>在 <a href="https://time.geekbang.org/column/article/109564" target="_blank" rel="noreferrer">第26讲</a> 中，我已经详细解释了JVM是如何保证static成员变量只被实例化一次的，我们不妨再来回顾下。使用了static修饰的成员变量，会在类初始化的过程中被收集进类构造器即&lt;clinit&gt;方法中，在多线程场景下，JVM会保证只有一个线程能执行该类的&lt;clinit&gt;方法，其它线程将会被阻塞等待。等到唯一的一次&lt;clinit&gt;方法执行完成，其它线程将不会再执行&lt;clinit&gt;方法，转而执行自己的代码。也就是说，static修饰了成员变量，在多线程的情况下能保证只实例化一次。</p><p>我们可以通过代码简单了解下使用枚举实现的饿汉单例模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//饿汉模式 枚举实现</span></span>
<span class="line"><span>public enum Singleton {</span></span>
<span class="line"><span>    INSTANCE;//不实例化</span></span>
<span class="line"><span>    public List&amp;lt;String&amp;gt; list = null;// list属性</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private Singleton() {//构造函数</span></span>
<span class="line"><span>		list = new ArrayList&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    public static Singleton getInstance(){</span></span>
<span class="line"><span>        return INSTANCE;//返回已存在的对象</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方式实现的单例没有实现懒加载功能，那如果我们要使用到懒加载功能呢？此时，我们就可以基于内部类来实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//懒汉模式 枚举实现</span></span>
<span class="line"><span>public class Singleton {</span></span>
<span class="line"><span>    //不实例化</span></span>
<span class="line"><span>    public List&amp;lt;String&amp;gt; list = null;// list属性</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private Singleton(){//构造函数</span></span>
<span class="line"><span>		list = new ArrayList&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    //使用枚举作为内部类</span></span>
<span class="line"><span>    private enum EnumSingleton {</span></span>
<span class="line"><span>        INSTANCE;//不实例化</span></span>
<span class="line"><span>        private Singleton instance = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        private EnumSingleton(){//构造函数</span></span>
<span class="line"><span>		    instance = new Singleton();</span></span>
<span class="line"><span>     	}</span></span>
<span class="line"><span>        public Singleton getSingleton(){</span></span>
<span class="line"><span>            return instance;//返回已存在的对象</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static Singleton getInstance(){</span></span>
<span class="line"><span>        return EnumSingleton.INSTANCE.getSingleton();//返回已存在的对象</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a href="https://time.geekbang.org/column/article/109980" target="_blank" rel="noreferrer">第27讲</a></p><p><strong>上一讲的单例模式和这一讲的享元模式都是为了避免重复创建对象，你知道这两者的区别在哪儿吗？</strong></p><p>首先，这两种设计模式的实现方式是不同的。我们使用单例模式是避免每次调用一个类实例时，都要重复实例化该实例，目的是在类本身获取实例化对象的唯一性；而享元模式则是通过一个共享容器来实现一系列对象的共享。</p><p>其次，两者在使用场景上也是有区别的。单例模式更多的是强调减少实例化提升性能，因此它一般是使用在一些需要频繁创建和销毁实例化对象，或创建和销毁实例化对象非常消耗资源的类中。</p><p>例如，连接池和线程池中的连接就是使用单例模式实现的，数据库操作是非常频繁的，每次操作都需要创建和销毁连接，如果使用单例，可以节省不断新建和关闭数据库连接所引起的性能消耗。而享元模式更多的是强调共享相同对象或对象属性，以此节约内存使用空间。</p><p>除了区别，这两种设计模式也有共性，单例模式可以避免重复创建对象，节约内存空间，享元模式也可以避免一个类的重复实例化。总之，两者很相似，但侧重点不一样，假如碰到一些要在两种设计模式中做选择的场景，我们就可以根据侧重点来选择。</p><p><a href="https://time.geekbang.org/column/article/110862" target="_blank" rel="noreferrer">第28讲</a></p><p><strong>除了以上这些多线程的设计模式（线程上下文设计模式、Thread-Per-Message设计模式、Worker-Thread设计模式），平时你还使用过其它的设计模式来优化多线程业务吗？</strong></p><p>在这一讲的留言区，undifined同学问到了，如果我们使用Worker-Thread设计模式，worker线程如果是异步请求处理，当我们监听到有请求进来之后，将任务交给工作线程，怎么拿到返回结果，并返回给主线程呢？</p><p>回答这个问题的过程中就会用到一些别的设计模式，可以一起看看。</p><p>如果要获取到异步线程的执行结果，我们可以使用Future设计模式来解决这个问题。假设我们有一个任务，需要一台机器执行，但是该任务需要一个工人分配给机器执行，当机器执行完成之后，需要通知工人任务的具体完成结果。这个时候我们就可以设计一个Future模式来实现这个业务。</p><p>首先，我们申明一个任务接口，主要提供给任务设计：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Task&amp;lt;T, P&amp;gt; {</span></span>
<span class="line"><span>	T doTask(P param);//完成任务</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其次，我们申明一个提交任务接口类，TaskService主要用于提交任务，提交任务可以分为需要返回结果和不需要返回结果两种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface TaskService&amp;lt;T, P&amp;gt; {</span></span>
<span class="line"><span>	Future&amp;lt;?&amp;gt; submit(Runnable  runnable);//提交任务，不返回结果</span></span>
<span class="line"><span>    Future&amp;lt;?&amp;gt; submit(Task&amp;lt;T,P&amp;gt; task, P param);//提交任务，并返回结果</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接着，我们再申明一个查询执行结果的接口类，用于提交任务之后，在主线程中查询执行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Future&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	T get(); //获取返回结果</span></span>
<span class="line"><span>	boolean done(); //判断是否完成</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们先实现这个任务接口类，当需要返回结果时，我们通过调用获取结果类的finish方法将结果传回给查询执行结果类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TaskServiceImpl&amp;lt;T, P&amp;gt; implements TaskService&amp;lt;T, P&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 提交任务实现方法，不需要返回执行结果</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public Future&amp;lt;?&amp;gt; submit(Runnable runnable) {</span></span>
<span class="line"><span>		final FutureTask&amp;lt;Void&amp;gt; future = new FutureTask&amp;lt;Void&amp;gt;();</span></span>
<span class="line"><span>		new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>			runnable.run();</span></span>
<span class="line"><span>		}, Thread.currentThread().getName()).start();</span></span>
<span class="line"><span>		return future;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 提交任务实现方法，需要返回执行结果</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public Future&amp;lt;?&amp;gt; submit(Task&amp;lt;T, P&amp;gt; task, P param) {</span></span>
<span class="line"><span>		final FutureTask&amp;lt;T&amp;gt; future = new FutureTask&amp;lt;T&amp;gt;();</span></span>
<span class="line"><span>		new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>			T result = task.doTask(param);</span></span>
<span class="line"><span>			future.finish(result);</span></span>
<span class="line"><span>		}, Thread.currentThread().getName()).start();</span></span>
<span class="line"><span>		return future;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，我们再实现这个查询执行结果接口类，FutureTask中，get 和 finish 方法利用了线程间的通信wait和notifyAll实现了线程的阻塞和唤醒。当任务没有完成之前通过get方法获取结果，主线程将会进入阻塞状态，直到任务完成，再由任务线程调用finish方法将结果传回给主线程，并唤醒该阻塞线程：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FutureTask&amp;lt;T&amp;gt; implements Future&amp;lt;T&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private T result;</span></span>
<span class="line"><span>	private boolean isDone = false;</span></span>
<span class="line"><span>	private final Object LOCK = new Object();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public T get() {</span></span>
<span class="line"><span>		synchronized (LOCK) {</span></span>
<span class="line"><span>			while (!isDone) {</span></span>
<span class="line"><span>				try {</span></span>
<span class="line"><span>					LOCK.wait();//阻塞等待</span></span>
<span class="line"><span>				} catch (InterruptedException e) {</span></span>
<span class="line"><span>					// TODO Auto-generated catch block</span></span>
<span class="line"><span>					e.printStackTrace();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return result;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 获取到结果，并唤醒阻塞线程</span></span>
<span class="line"><span>	 * &amp;#64;param result</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void finish(T result) {</span></span>
<span class="line"><span>		synchronized (LOCK) {</span></span>
<span class="line"><span>			if (isDone) {</span></span>
<span class="line"><span>				return;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			this.result = result;</span></span>
<span class="line"><span>			this.isDone = true;</span></span>
<span class="line"><span>			LOCK.notifyAll();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public boolean done() {</span></span>
<span class="line"><span>		return isDone;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以实现一个造车任务，然后用任务提交类提交该造车任务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MakeCarTask&amp;lt;T, P&amp;gt; implements Task&amp;lt;T, P&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&amp;#64;SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>	public T doTask(P param) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		String car = param + &quot; is created success&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			Thread.sleep(2000);</span></span>
<span class="line"><span>		} catch (InterruptedException e) {</span></span>
<span class="line"><span>			// TODO Auto-generated catch block</span></span>
<span class="line"><span>			e.printStackTrace();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		return (T) car;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后运行该任务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class App {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span>		// TODO Auto-generated method stub</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		TaskServiceImpl&amp;lt;String, String&amp;gt; taskService = new TaskServiceImpl&amp;lt;String, String&amp;gt;();//创建任务提交类</span></span>
<span class="line"><span>		 MakeCarTask&amp;lt;String, String&amp;gt; task = new MakeCarTask&amp;lt;String, String&amp;gt;();//创建任务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		 Future&amp;lt;?&amp;gt; future = taskService.submit(task, &quot;car1&quot;);//提交任务</span></span>
<span class="line"><span>		 String result = (String) future.get();//获取结果</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		 System.out.print(result);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>car1 is created success</span></span></code></pre></div><p>从JDK1.5起，Java就提供了一个Future类，它可以通过get()方法阻塞等待获取异步执行的返回结果，然而这种方式在性能方面会比较糟糕。在JDK1.8中，Java提供了CompletableFuture类，它是基于异步函数式编程。相对阻塞式等待返回结果，CompletableFuture可以通过回调的方式来处理计算结果，所以实现了异步非阻塞，从性能上来说它更加优越了。</p><p>在Dubbo2.7.0版本中，Dubbo也是基于CompletableFuture实现了异步通信，基于回调方式实现了异步非阻塞通信，操作非常简单方便。</p><p><a href="https://time.geekbang.org/column/article/111288" target="_blank" rel="noreferrer">第29讲</a></p><p><strong>我们可以用生产者消费者模式来实现瞬时高并发的流量削峰，然而这样做虽然缓解了消费方的压力，但生产方则会因为瞬时高并发，而发生大量线程阻塞。面对这样的情况，你知道有什么方式可以优化线程阻塞所带来的性能问题吗？</strong></p><p>无论我们的程序优化得有多么出色，只要并发上来，依然会出现瓶颈。虽然生产者消费者模式可以帮我们实现流量削峰，但是当并发量上来之后，依然有可能导致生产方大量线程阻塞等待，引起上下文切换，增加系统性能开销。这时，我们可以考虑在接入层做限流。</p><p>限流的实现方式有很多，例如，使用线程池、使用Guava的RateLimiter等。但归根结底，它们都是基于这两种限流算法来实现的：漏桶算法和令牌桶算法。</p><p>漏桶算法是基于一个漏桶来实现的，我们的请求如果要进入到业务层，必须经过漏桶，漏桶出口的请求速率是均衡的，当入口的请求量比较大的时候，如果漏桶已经满了，请求将会溢出（被拒绝），这样我们就可以保证从漏桶出来的请求量永远是均衡的，不会因为入口的请求量突然增大，致使进入业务层的并发量过大而导致系统崩溃。</p><p>令牌桶算法是指系统会以一个恒定的速度在一个桶中放入令牌，一个请求如果要进来，它需要拿到一个令牌才能进入到业务层，当桶里没有令牌可以取时，则请求会被拒绝。Google的Guava包中的RateLimiter就是基于令牌桶算法实现的。</p><p>我们可以发现，漏桶算法可以通过限制容量池大小来控制流量，而令牌算法则可以通过限制发放令牌的速率来控制流量。</p><p><a href="https://time.geekbang.org/column/article/111600" target="_blank" rel="noreferrer">第30讲</a></p><p><strong>责任链模式、策略模式与装饰器模式有很多相似之处。在平时，这些设计模式除了在业务中被用到之外，在架构设计中也经常被用到，你是否在源码中见过这几种设计模式的使用场景呢？欢迎你与大家分享。</strong></p><p>责任链模式经常被用在一个处理需要经历多个事件处理的场景。为了避免一个处理跟多个事件耦合在一起，该模式会将多个事件连成一条链，通过这条链路将每个事件的处理结果传递给下一个处理事件。责任链模式由两个主要实现类组成：抽象处理类和具体处理类。</p><p>另外，很多开源框架也用到了责任链模式，例如Dubbo中的Filter就是基于该模式实现的。而Dubbo的许多功能都是通过Filter扩展实现的，比如缓存、日志、监控、安全、telnet以及RPC本身，责任链中的每个节点实现了Filter接口，然后由ProtocolFilterWrapper将所有的Filter串连起来。</p><p>策略模式与装饰器模式则更为相似，策略模式主要由一个策略基类、具体策略类以及一个工厂环境类组成，与装饰器模式不同的是，策略模式是指某个对象在不同的场景中，选择的实现策略不一样。例如，同样是价格策略，在一些场景中，我们就可以使用策略模式实现。基于红包的促销活动商品，只能使用红包策略，而基于折扣券的促销活动商品，也只能使用折扣券。</p><p>以上就是模块五所有思考题的答案，现在不妨和你的答案结合一下，看看是否有新的收获呢？如果你还有其它问题，请在留言区中提出，我会一一解答。最后欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他加入讨论。</p>`,55)])])}const d=a(e,[["render",l]]);export{m as __pageData,d as default};
