import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"29 | 如何使用设计模式优化并发编程？","description":"","frontmatter":{},"headers":[{"level":2,"title":"线程上下文设计模式","slug":"线程上下文设计模式","link":"#线程上下文设计模式","children":[]},{"level":2,"title":"Thread-Per-Message设计模式","slug":"thread-per-message设计模式","link":"#thread-per-message设计模式","children":[]},{"level":2,"title":"Worker-Thread设计模式","slug":"worker-thread设计模式","link":"#worker-thread设计模式","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Java性能调优实战/29-如何使用设计模式优化并发编程？.md","filePath":"Java性能调优实战/29-如何使用设计模式优化并发编程？.md","lastUpdated":1779815864000}'),t={name:"Java性能调优实战/29-如何使用设计模式优化并发编程？.md"};function l(i,n,c,r,o,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_29-如何使用设计模式优化并发编程" tabindex="-1">29 | 如何使用设计模式优化并发编程？ <a class="header-anchor" href="#_29-如何使用设计模式优化并发编程" aria-label="Permalink to &quot;29 | 如何使用设计模式优化并发编程？&quot;">​</a></h1><p>你好，我是刘超。</p><p>在我们使用多线程编程时，很多时候需要根据业务场景设计一套业务功能。其实，在多线程编程中，本身就存在很多成熟的功能设计模式，学好它们，用好它们，那就是如虎添翼了。今天我就带你了解几种并发编程中常用的设计模式。</p><h2 id="线程上下文设计模式" tabindex="-1">线程上下文设计模式 <a class="header-anchor" href="#线程上下文设计模式" aria-label="Permalink to &quot;线程上下文设计模式&quot;">​</a></h2><p>线程上下文是指贯穿线程整个生命周期的对象中的一些全局信息。例如，我们比较熟悉的Spring中的ApplicationContext就是一个关于上下文的类，它在整个系统的生命周期中保存了配置信息、用户信息以及注册的bean等上下文信息。</p><p>这样的解释可能有点抽象，我们不妨通过一个具体的案例，来看看到底在什么的场景下才需要上下文呢？</p><p>在执行一个比较长的请求任务时，这个请求可能会经历很多层的方法调用，假设我们需要将最开始的方法的中间结果传递到末尾的方法中进行计算，一个简单的实现方式就是在每个函数中新增这个中间结果的参数，依次传递下去。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ContextTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 上下文类</span></span>
<span class="line"><span>	public class Context {</span></span>
<span class="line"><span>		private String name;</span></span>
<span class="line"><span>		private long id</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public long getId() {</span></span>
<span class="line"><span>			return id;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void setId(long id) {</span></span>
<span class="line"><span>			this.id = id;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public String getName() {</span></span>
<span class="line"><span>			return this.name;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void setName(String name) {</span></span>
<span class="line"><span>			this.name = name;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 设置上下文名字</span></span>
<span class="line"><span>	public class QueryNameAction {</span></span>
<span class="line"><span>		public void execute(Context context) {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				Thread.sleep(1000L);</span></span>
<span class="line"><span>				String name = Thread.currentThread().getName();</span></span>
<span class="line"><span>				context.setName(name);</span></span>
<span class="line"><span>			} catch (InterruptedException e) {</span></span>
<span class="line"><span>				e.printStackTrace();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 设置上下文ID</span></span>
<span class="line"><span>	public class QueryIdAction {</span></span>
<span class="line"><span>		public void execute(Context context) {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				Thread.sleep(1000L);</span></span>
<span class="line"><span>				long id = Thread.currentThread().getId();</span></span>
<span class="line"><span>				context.setId(id);</span></span>
<span class="line"><span>			} catch (InterruptedException e) {</span></span>
<span class="line"><span>				e.printStackTrace();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 执行方法</span></span>
<span class="line"><span>	public class ExecutionTask implements Runnable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		private QueryNameAction queryNameAction = new QueryNameAction();</span></span>
<span class="line"><span>		private QueryIdAction queryIdAction = new QueryIdAction();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		&amp;#64;Override</span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			final Context context = new Context();</span></span>
<span class="line"><span>			queryNameAction.execute(context);</span></span>
<span class="line"><span>			System.out.println(&quot;The name query successful&quot;);</span></span>
<span class="line"><span>			queryIdAction.execute(context);</span></span>
<span class="line"><span>			System.out.println(&quot;The id query successful&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			System.out.println(&quot;The Name is &quot; + context.getName() + &quot; and id &quot; + context.getId());</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span>		IntStream.range(1, 5).forEach(i -&amp;gt; new Thread(new ContextTest().new ExecutionTask()).start());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>The name query successful</span></span>
<span class="line"><span>The name query successful</span></span>
<span class="line"><span>The name query successful</span></span>
<span class="line"><span>The name query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The Name is Thread-1 and id 11</span></span>
<span class="line"><span>The Name is Thread-2 and id 12</span></span>
<span class="line"><span>The Name is Thread-3 and id 13</span></span>
<span class="line"><span>The Name is Thread-0 and id 10</span></span></code></pre></div><p>然而这种方式太笨拙了，每次调用方法时，都需要传入Context作为参数，而且影响一些中间公共方法的封装。</p><p>那能不能设置一个全局变量呢？如果是在多线程情况下，需要考虑线程安全，这样的话就又涉及到了锁竞争。</p><p>除了以上这些方法，其实我们还可以使用ThreadLocal实现上下文。ThreadLocal是线程本地变量，可以实现多线程的数据隔离。ThreadLocal为每一个使用该变量的线程都提供一份独立的副本，线程间的数据是隔离的，每一个线程只能访问各自内部的副本变量。</p><p>ThreadLocal中有三个常用的方法：set、get、initialValue，我们可以通过以下一个简单的例子来看看ThreadLocal的使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void testThreadLocal() {</span></span>
<span class="line"><span>    Thread t = new Thread() {</span></span>
<span class="line"><span>        ThreadLocal&amp;lt;String&amp;gt; mStringThreadLocal = new ThreadLocal&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &amp;#64;Override</span></span>
<span class="line"><span>        public void run() {</span></span>
<span class="line"><span>            super.run();</span></span>
<span class="line"><span>            mStringThreadLocal.set(&quot;test&quot;);</span></span>
<span class="line"><span>            mStringThreadLocal.get();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    t.start();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们使用ThreadLocal来重新实现最开始的上下文设计。你会发现，我们在两个方法中并没有通过变量来传递上下文，只是通过ThreadLocal获取了当前线程的上下文信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ContextTest {</span></span>
<span class="line"><span>	// 上下文类</span></span>
<span class="line"><span>	public static class Context {</span></span>
<span class="line"><span>		private String name;</span></span>
<span class="line"><span>		private long id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public long getId() {</span></span>
<span class="line"><span>			return id;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void setId(long id) {</span></span>
<span class="line"><span>			this.id = id;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public String getName() {</span></span>
<span class="line"><span>			return this.name;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public void setName(String name) {</span></span>
<span class="line"><span>			this.name = name;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 复制上下文到ThreadLocal中</span></span>
<span class="line"><span>	public final static class ActionContext {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		private static final ThreadLocal&amp;lt;Context&amp;gt; threadLocal = new ThreadLocal&amp;lt;Context&amp;gt;() {</span></span>
<span class="line"><span>			&amp;#64;Override</span></span>
<span class="line"><span>			protected Context initialValue() {</span></span>
<span class="line"><span>				return new Context();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public static ActionContext getActionContext() {</span></span>
<span class="line"><span>			return ContextHolder.actionContext;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		public Context getContext() {</span></span>
<span class="line"><span>			return threadLocal.get();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 获取ActionContext单例</span></span>
<span class="line"><span>		public static class ContextHolder {</span></span>
<span class="line"><span>			private final static ActionContext actionContext = new ActionContext();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 设置上下文名字</span></span>
<span class="line"><span>	public class QueryNameAction {</span></span>
<span class="line"><span>		public void execute() {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				Thread.sleep(1000L);</span></span>
<span class="line"><span>				String name = Thread.currentThread().getName();</span></span>
<span class="line"><span>				ActionContext.getActionContext().getContext().setName(name);</span></span>
<span class="line"><span>			} catch (InterruptedException e) {</span></span>
<span class="line"><span>				e.printStackTrace();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 设置上下文ID</span></span>
<span class="line"><span>	public class QueryIdAction {</span></span>
<span class="line"><span>		public void execute() {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				Thread.sleep(1000L);</span></span>
<span class="line"><span>				long id = Thread.currentThread().getId();</span></span>
<span class="line"><span>				ActionContext.getActionContext().getContext().setId(id);</span></span>
<span class="line"><span>			} catch (InterruptedException e) {</span></span>
<span class="line"><span>				e.printStackTrace();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 执行方法</span></span>
<span class="line"><span>	public class ExecutionTask implements Runnable {</span></span>
<span class="line"><span>		private QueryNameAction queryNameAction = new QueryNameAction();</span></span>
<span class="line"><span>		private QueryIdAction queryIdAction = new QueryIdAction();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		&amp;#64;Override</span></span>
<span class="line"><span>		public void run() {</span></span>
<span class="line"><span>			queryNameAction.execute();//设置线程名</span></span>
<span class="line"><span>			System.out.println(&quot;The name query successful&quot;);</span></span>
<span class="line"><span>			queryIdAction.execute();//设置线程ID</span></span>
<span class="line"><span>			System.out.println(&quot;The id query successful&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			System.out.println(&quot;The Name is &quot; + ActionContext.getActionContext().getContext().getName() + &quot; and id &quot; + ActionContext.getActionContext().getContext().getId())</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) {</span></span>
<span class="line"><span>		IntStream.range(1, 5).forEach(i -&amp;gt; new Thread(new ContextTest().new ExecutionTask()).start());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>The name query successful</span></span>
<span class="line"><span>The name query successful</span></span>
<span class="line"><span>The name query successful</span></span>
<span class="line"><span>The name query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The id query successful</span></span>
<span class="line"><span>The Name is Thread-2 and id 12</span></span>
<span class="line"><span>The Name is Thread-0 and id 10</span></span>
<span class="line"><span>The Name is Thread-1 and id 11</span></span>
<span class="line"><span>The Name is Thread-3 and id 13</span></span></code></pre></div><h2 id="thread-per-message设计模式" tabindex="-1">Thread-Per-Message设计模式 <a class="header-anchor" href="#thread-per-message设计模式" aria-label="Permalink to &quot;Thread-Per-Message设计模式&quot;">​</a></h2><p>Thread-Per-Message设计模式翻译过来的意思就是每个消息一个线程的意思。例如，我们在处理Socket通信的时候，通常是一个线程处理事件监听以及I/O读写，如果I/O读写操作非常耗时，这个时候便会影响到事件监听处理事件。</p><p>这个时候Thread-Per-Message模式就可以很好地解决这个问题，一个线程监听I/O事件，每当监听到一个I/O事件，则交给另一个处理线程执行I/O操作。下面，我们还是通过一个例子来学习下该设计模式的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//IO处理</span></span>
<span class="line"><span>public class ServerHandler implements Runnable{</span></span>
<span class="line"><span>	private Socket socket;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ServerHandler(Socket socket) {</span></span>
<span class="line"><span>        this.socket = socket;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        BufferedReader in = null;</span></span>
<span class="line"><span>        PrintWriter out = null;</span></span>
<span class="line"><span>        String msg = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));</span></span>
<span class="line"><span>            out = new PrintWriter(socket.getOutputStream(),true);</span></span>
<span class="line"><span>            while ((msg = in.readLine()) != null &amp;&amp; msg.length()!=0) {//当连接成功后在此等待接收消息（挂起，进入阻塞状态）</span></span>
<span class="line"><span>                System.out.println(&quot;server received : &quot; + msg);</span></span>
<span class="line"><span>                out.print(&quot;received~\\n&quot;);</span></span>
<span class="line"><span>                out.flush();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>        	try {</span></span>
<span class="line"><span>                in.close();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                out.close();</span></span>
<span class="line"><span>            } catch (Exception e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                socket.close();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//Socket启动服务</span></span>
<span class="line"><span>public class Server {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private static int DEFAULT_PORT = 12345;</span></span>
<span class="line"><span>	private static ServerSocket server;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void start() throws IOException {</span></span>
<span class="line"><span>		start(DEFAULT_PORT);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void start(int port) throws IOException {</span></span>
<span class="line"><span>		if (server != null) {</span></span>
<span class="line"><span>			return;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			//启动服务</span></span>
<span class="line"><span>			server = new ServerSocket(port);</span></span>
<span class="line"><span>			// 通过无线循环监听客户端连接</span></span>
<span class="line"><span>			while (true) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>				Socket socket = server.accept();</span></span>
<span class="line"><span>				// 当有新的客户端接入时，会执行下面的代码</span></span>
<span class="line"><span>				long start = System.currentTimeMillis();</span></span>
<span class="line"><span>				new Thread(new ServerHandler(socket)).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>				long end = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>				System.out.println(&quot;Spend time is &quot; + (end - start));</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		} finally {</span></span>
<span class="line"><span>			if (server != null) {</span></span>
<span class="line"><span>				System.out.println(&quot;服务器已关闭。&quot;);</span></span>
<span class="line"><span>				server.close();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 运行服务端</span></span>
<span class="line"><span>		new Thread(new Runnable() {</span></span>
<span class="line"><span>			public void run() {</span></span>
<span class="line"><span>				try {</span></span>
<span class="line"><span>					Server.start();</span></span>
<span class="line"><span>				} catch (IOException e) {</span></span>
<span class="line"><span>					e.printStackTrace();</span></span>
<span class="line"><span>				}</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上，我们是完成了一个使用Thread-Per-Message设计模式实现的Socket服务端的代码。但这里是有一个问题的，你发现了吗？</p><p>使用这种设计模式，如果遇到大的高并发，就会出现严重的性能问题。如果针对每个I/O请求都创建一个线程来处理，在有大量请求同时进来时，就会创建大量线程，而此时JVM有可能会因为无法处理这么多线程，而出现内存溢出的问题。</p><p>退一步讲，即使是不会有大量线程的场景，每次请求过来也都需要创建和销毁线程，这对系统来说，也是一笔不小的性能开销。</p><p>面对这种情况，我们可以使用线程池来代替线程的创建和销毁，这样就可以避免创建大量线程而带来的性能问题，是一种很好的调优方法。</p><h2 id="worker-thread设计模式" tabindex="-1">Worker-Thread设计模式 <a class="header-anchor" href="#worker-thread设计模式" aria-label="Permalink to &quot;Worker-Thread设计模式&quot;">​</a></h2><p>这里的Worker是工人的意思，代表在Worker Thread设计模式中，会有一些工人（线程）不断轮流处理过来的工作，当没有工作时，工人则会处于等待状态，直到有新的工作进来。除了工人角色，Worker Thread设计模式中还包括了流水线和产品。</p><p>这种设计模式相比Thread-Per-Message设计模式，可以减少频繁创建、销毁线程所带来的性能开销，还有无限制地创建线程所带来的内存溢出风险。</p><p>我们可以假设一个场景来看下该模式的实现，通过Worker Thread设计模式来完成一个物流分拣的作业。</p><p>假设一个物流仓库的物流分拣流水线上有8个机器人，它们不断从流水线上获取包裹并对其进行包装，送其上车。当仓库中的商品被打包好后，会投放到物流分拣流水线上，而不是直接交给机器人，机器人会再从流水线中随机分拣包裹。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//包裹类</span></span>
<span class="line"><span>public class Package {</span></span>
<span class="line"><span>	private String name;</span></span>
<span class="line"><span>	private String address;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public String getName() {</span></span>
<span class="line"><span>		return name;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void setName(String name) {</span></span>
<span class="line"><span>		this.name = name;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public String getAddress() {</span></span>
<span class="line"><span>		return address;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void setAddress(String address) {</span></span>
<span class="line"><span>		this.address = address;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public void execute() {</span></span>
<span class="line"><span>		System.out.println(Thread.currentThread().getName()+&quot; executed &quot;+this);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//流水线</span></span>
<span class="line"><span>public class PackageChannel {</span></span>
<span class="line"><span>	private final static int MAX_PACKAGE_NUM = 100;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private final Package[] packageQueue;</span></span>
<span class="line"><span>	private final Worker[] workerPool;</span></span>
<span class="line"><span>	private int head;</span></span>
<span class="line"><span>	private int tail;</span></span>
<span class="line"><span>	private int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public PackageChannel(int workers) {</span></span>
<span class="line"><span>		this.packageQueue = new Package[MAX_PACKAGE_NUM];</span></span>
<span class="line"><span>		this.head = 0;</span></span>
<span class="line"><span>		this.tail = 0;</span></span>
<span class="line"><span>		this.count = 0;</span></span>
<span class="line"><span>		this.workerPool = new Worker[workers];</span></span>
<span class="line"><span>		this.init();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private void init() {</span></span>
<span class="line"><span>		for (int i = 0; i &amp;lt; workerPool.length; i++) {</span></span>
<span class="line"><span>			workerPool[i] = new Worker(&quot;Worker-&quot; + i, this);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * push switch to start all of worker to work</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void startWorker() {</span></span>
<span class="line"><span>		Arrays.asList(workerPool).forEach(Worker::start);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public synchronized void put(Package packagereq) {</span></span>
<span class="line"><span>		while (count &amp;gt;= packageQueue.length) {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				this.wait();</span></span>
<span class="line"><span>			} catch (InterruptedException e) {</span></span>
<span class="line"><span>				e.printStackTrace();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		this.packageQueue[tail] = packagereq;</span></span>
<span class="line"><span>		this.tail = (tail + 1) % packageQueue.length;</span></span>
<span class="line"><span>		this.count++;</span></span>
<span class="line"><span>		this.notifyAll();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public synchronized Package take() {</span></span>
<span class="line"><span>		while (count &amp;lt;= 0) {</span></span>
<span class="line"><span>			try {</span></span>
<span class="line"><span>				this.wait();</span></span>
<span class="line"><span>			} catch (InterruptedException e) {</span></span>
<span class="line"><span>				e.printStackTrace();</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		Package request = this.packageQueue[head];</span></span>
<span class="line"><span>		this.head = (this.head + 1) % this.packageQueue.length;</span></span>
<span class="line"><span>		this.count--;</span></span>
<span class="line"><span>		this.notifyAll();</span></span>
<span class="line"><span>		return request;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//机器人</span></span>
<span class="line"><span>public class Worker extends Thread{</span></span>
<span class="line"><span>	 private static final Random random = new Random(System.currentTimeMillis());</span></span>
<span class="line"><span>	 private final PackageChannel channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    public Worker(String name, PackageChannel channel) {</span></span>
<span class="line"><span>	        super(name);</span></span>
<span class="line"><span>	        this.channel = channel;</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    &amp;#64;Override</span></span>
<span class="line"><span>	    public void run() {</span></span>
<span class="line"><span>	        while (true) {</span></span>
<span class="line"><span>	            channel.take().execute();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	            try {</span></span>
<span class="line"><span>	                Thread.sleep(random.nextInt(1000));</span></span>
<span class="line"><span>	            } catch (InterruptedException e) {</span></span>
<span class="line"><span>	                e.printStackTrace();</span></span>
<span class="line"><span>	            }</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>	   public static void main(String[] args) {</span></span>
<span class="line"><span>            //新建8个工人</span></span>
<span class="line"><span>	        final PackageChannel channel = new PackageChannel(8);</span></span>
<span class="line"><span>            //开始工作</span></span>
<span class="line"><span>	        channel.startWorker();</span></span>
<span class="line"><span>            //为流水线添加包裹</span></span>
<span class="line"><span>	        for(int i=0; i&amp;lt;100; i++) {</span></span>
<span class="line"><span>	        	 Package packagereq = new Package();</span></span>
<span class="line"><span>	 	        packagereq.setAddress(&quot;test&quot;);</span></span>
<span class="line"><span>	 	        packagereq.setName(&quot;test&quot;);</span></span>
<span class="line"><span>	 	        channel.put(packagereq);</span></span>
<span class="line"><span>	        }</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到，这里有8个工人在不断地分拣仓库中已经包装好的商品。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>平时，如果需要传递或隔离一些线程变量时，我们可以考虑使用上下文设计模式。在数据库读写分离的业务场景中，则经常会用到ThreadLocal实现动态切换数据源操作。但在使用ThreadLocal时，我们需要注意内存泄漏问题，在之前的 <a href="https://time.geekbang.org/column/article/109201" target="_blank" rel="noreferrer">第25讲</a> 中，我们已经讨论过这个问题了。</p><p>当主线程处理每次请求都非常耗时时，就可能出现阻塞问题，这时候我们可以考虑将主线程业务分工到新的业务线程中，从而提高系统的并行处理能力。而 Thread-Per-Message 设计模式以及 Worker-Thread 设计模式则都是通过多线程分工来提高系统并行处理能力的设计模式。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>除了以上这些多线程的设计模式，平时你还使用过其它的设计模式来优化多线程业务吗？</p><p>期待在留言区看到你的答案。也欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他一起讨论。</p>`,44)])])}const g=s(t,[["render",l]]);export{h as __pageData,g as default};
