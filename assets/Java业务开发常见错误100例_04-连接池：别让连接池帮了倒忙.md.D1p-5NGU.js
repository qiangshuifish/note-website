import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"04 | 连接池：别让连接池帮了倒忙","description":"","frontmatter":{},"headers":[{"level":2,"title":"注意鉴别客户端SDK是否基于连接池","slug":"注意鉴别客户端sdk是否基于连接池","link":"#注意鉴别客户端sdk是否基于连接池","children":[]},{"level":2,"title":"使用连接池务必确保复用","slug":"使用连接池务必确保复用","link":"#使用连接池务必确保复用","children":[]},{"level":2,"title":"连接池的配置不是一成不变的","slug":"连接池的配置不是一成不变的","link":"#连接池的配置不是一成不变的","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/04-连接池：别让连接池帮了倒忙.md","filePath":"Java业务开发常见错误100例/04-连接池：别让连接池帮了倒忙.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/04-连接池：别让连接池帮了倒忙.md"};function i(l,s,o,c,r,d){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_04-连接池-别让连接池帮了倒忙" tabindex="-1">04 | 连接池：别让连接池帮了倒忙 <a class="header-anchor" href="#_04-连接池-别让连接池帮了倒忙" aria-label="Permalink to &quot;04 | 连接池：别让连接池帮了倒忙&quot;">​</a></h1><p>你好，我是朱晔。今天，我们来聊聊使用连接池需要注意的问题。</p><p>在上一讲，我们学习了使用线程池需要注意的问题。今天，我再与你说说另一种很重要的池化技术，即连接池。</p><p>我先和你说说连接池的结构。连接池一般对外提供获得连接、归还连接的接口给客户端使用，并暴露最小空闲连接数、最大连接数等可配置参数，在内部则实现连接建立、连接心跳保持、连接管理、空闲连接回收、连接可用性检测等功能。连接池的结构示意图，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/1685d9db2602e1de8483de171af6fd7e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/1685d9db2602e1de8483de171af6fd7e.png" alt=""></a></p><p>业务项目中经常会用到的连接池，主要是数据库连接池、Redis连接池和HTTP连接池。所以，今天我就以这三种连接池为例，和你聊聊使用和配置连接池容易出错的地方。</p><h2 id="注意鉴别客户端sdk是否基于连接池" tabindex="-1">注意鉴别客户端SDK是否基于连接池 <a class="header-anchor" href="#注意鉴别客户端sdk是否基于连接池" aria-label="Permalink to &quot;注意鉴别客户端SDK是否基于连接池&quot;">​</a></h2><p>在使用三方客户端进行网络通信时，我们首先要确定客户端SDK是否是基于连接池技术实现的。我们知道，TCP是面向连接的基于字节流的协议：</p><ul><li>面向连接，意味着连接需要先创建再使用，创建连接的三次握手有一定开销；</li><li>基于字节流，意味着字节是发送数据的最小单元，TCP协议本身无法区分哪几个字节是完整的消息体，也无法感知是否有多个客户端在使用同一个TCP连接，TCP只是一个读写数据的管道。</li></ul><p>如果客户端SDK没有使用连接池，而直接是TCP连接，那么就需要考虑每次建立TCP连接的开销， <strong>并且因为TCP基于字节流，在多线程的情况下对同一连接进行复用，可能会产生线程安全问题</strong>。</p><p>我们先看一下涉及TCP连接的客户端SDK，对外提供API的三种方式。在面对各种三方客户端的时候，只有先识别出其属于哪一种，才能理清楚使用方式。</p><ul><li>连接池和连接分离的API：有一个XXXPool类负责连接池实现，先从其获得连接XXXConnection，然后用获得的连接进行服务端请求，完成后使用者需要归还连接。通常，XXXPool是线程安全的，可以并发获取和归还连接，而XXXConnection是非线程安全的。对应到连接池的结构示意图中，XXXPool就是右边连接池那个框，左边的客户端是我们自己的代码。</li><li>内部带有连接池的API：对外提供一个XXXClient类，通过这个类可以直接进行服务端请求；这个类内部维护了连接池，SDK使用者无需考虑连接的获取和归还问题。一般而言，XXXClient是线程安全的。对应到连接池的结构示意图中，整个API就是蓝色框包裹的部分。</li><li>非连接池的API：一般命名为XXXConnection，以区分其是基于连接池还是单连接的，而不建议命名为XXXClient或直接是XXX。直接连接方式的API基于单一连接，每次使用都需要创建和断开连接，性能一般，且通常不是线程安全的。对应到连接池的结构示意图中，这种形式相当于没有右边连接池那个框，客户端直接连接服务端创建连接。</li></ul><p>虽然上面提到了SDK一般的命名习惯，但不排除有一些客户端特立独行，因此在使用三方SDK时，一定要先查看官方文档了解其最佳实践，或是在类似Stackoverflow的网站搜索XXX threadsafe/singleton字样看看大家的回复，也可以一层一层往下看源码，直到定位到原始Socket来判断Socket和客户端API的对应关系。</p><p>明确了SDK连接池的实现方式后，我们就大概知道了使用SDK的最佳实践：</p><ul><li>如果是分离方式，那么连接池本身一般是线程安全的，可以复用。每次使用需要从连接池获取连接，使用后归还，归还的工作由使用者负责。</li><li>如果是内置连接池，SDK会负责连接的获取和归还，使用的时候直接复用客户端。</li><li>如果SDK没有实现连接池（大多数中间件、数据库的客户端SDK都会支持连接池），那通常不是线程安全的，而且短连接的方式性能不会很高，使用的时候需要考虑是否自己封装一个连接池。</li></ul><p>接下来，我就以Java中用于操作Redis最常见的库Jedis为例，从源码角度分析下Jedis类到底属于哪种类型的API，直接在多线程环境下复用一个连接会产生什么问题，以及如何用最佳实践来修复这个问题。</p><p>首先，向Redis初始化2组数据，Key=a、Value=1，Key=b、Value=2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PostConstruct</span></span>
<span class="line"><span>public void init() {</span></span>
<span class="line"><span>    try (Jedis jedis = new Jedis(&quot;127.0.0.1&quot;, 6379)) {</span></span>
<span class="line"><span>        Assert.isTrue(&quot;OK&quot;.equals(jedis.set(&quot;a&quot;, &quot;1&quot;)), &quot;set a = 1 return OK&quot;);</span></span>
<span class="line"><span>        Assert.isTrue(&quot;OK&quot;.equals(jedis.set(&quot;b&quot;, &quot;2&quot;)), &quot;set b = 2 return OK&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，启动两个线程，共享操作同一个Jedis实例，每一个线程循环1000次，分别读取Key为a和b的Value，判断是否分别为1和2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Jedis jedis = new Jedis(&quot;127.0.0.1&quot;, 6379);</span></span>
<span class="line"><span>new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 1000; i++) {</span></span>
<span class="line"><span>        String result = jedis.get(&quot;a&quot;);</span></span>
<span class="line"><span>        if (!result.equals(&quot;1&quot;)) {</span></span>
<span class="line"><span>            log.warn(&quot;Expect a to be 1 but found {}&quot;, result);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}).start();</span></span>
<span class="line"><span>new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 1000; i++) {</span></span>
<span class="line"><span>        String result = jedis.get(&quot;b&quot;);</span></span>
<span class="line"><span>        if (!result.equals(&quot;2&quot;)) {</span></span>
<span class="line"><span>            log.warn(&quot;Expect b to be 2 but found {}&quot;, result);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}).start();</span></span>
<span class="line"><span>TimeUnit.SECONDS.sleep(5);</span></span></code></pre></div><p>执行程序多次，可以看到日志中出现了各种奇怪的异常信息，有的是读取Key为b的Value读取到了1，有的是流非正常结束，还有的是连接关闭异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//错误1</span></span>
<span class="line"><span>[14:56:19.069] [Thread-28] [WARN ] [.t.c.c.redis.JedisMisreuseController:45  ] - Expect b to be 2 but found 1</span></span>
<span class="line"><span>//错误2</span></span>
<span class="line"><span>redis.clients.jedis.exceptions.JedisConnectionException: Unexpected end of stream.</span></span>
<span class="line"><span>	at redis.clients.jedis.util.RedisInputStream.ensureFill(RedisInputStream.java:202)</span></span>
<span class="line"><span>	at redis.clients.jedis.util.RedisInputStream.readLine(RedisInputStream.java:50)</span></span>
<span class="line"><span>	at redis.clients.jedis.Protocol.processError(Protocol.java:114)</span></span>
<span class="line"><span>	at redis.clients.jedis.Protocol.process(Protocol.java:166)</span></span>
<span class="line"><span>	at redis.clients.jedis.Protocol.read(Protocol.java:220)</span></span>
<span class="line"><span>	at redis.clients.jedis.Connection.readProtocolWithCheckingBroken(Connection.java:318)</span></span>
<span class="line"><span>	at redis.clients.jedis.Connection.getBinaryBulkReply(Connection.java:255)</span></span>
<span class="line"><span>	at redis.clients.jedis.Connection.getBulkReply(Connection.java:245)</span></span>
<span class="line"><span>	at redis.clients.jedis.Jedis.get(Jedis.java:181)</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.connectionpool.redis.JedisMisreuseController.lambda$wrong$1(JedisMisreuseController.java:43)</span></span>
<span class="line"><span>	at java.lang.Thread.run(Thread.java:748)</span></span>
<span class="line"><span>//错误3</span></span>
<span class="line"><span>java.io.IOException: Socket Closed</span></span>
<span class="line"><span>	at java.net.AbstractPlainSocketImpl.getOutputStream(AbstractPlainSocketImpl.java:440)</span></span>
<span class="line"><span>	at java.net.Socket$3.run(Socket.java:954)</span></span>
<span class="line"><span>	at java.net.Socket$3.run(Socket.java:952)</span></span>
<span class="line"><span>	at java.security.AccessController.doPrivileged(Native Method)</span></span>
<span class="line"><span>	at java.net.Socket.getOutputStream(Socket.java:951)</span></span>
<span class="line"><span>	at redis.clients.jedis.Connection.connect(Connection.java:200)</span></span>
<span class="line"><span>	... 7 more</span></span></code></pre></div><p>让我们分析一下Jedis类的源码，搞清楚其中缘由吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Jedis extends BinaryJedis implements JedisCommands, MultiKeyCommands,</span></span>
<span class="line"><span>    AdvancedJedisCommands, ScriptingCommands, BasicCommands, ClusterCommands, SentinelCommands, ModuleCommands {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class BinaryJedis implements BasicCommands, BinaryJedisCommands, MultiKeyBinaryCommands,</span></span>
<span class="line"><span>    AdvancedBinaryJedisCommands, BinaryScriptingCommands, Closeable {</span></span>
<span class="line"><span>	protected Client client = null;</span></span>
<span class="line"><span>      ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Client extends BinaryClient implements Commands {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class BinaryClient extends Connection {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Connection implements Closeable {</span></span>
<span class="line"><span>  private Socket socket;</span></span>
<span class="line"><span>  private RedisOutputStream outputStream;</span></span>
<span class="line"><span>  private RedisInputStream inputStream;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，Jedis继承了BinaryJedis，BinaryJedis中保存了单个Client的实例，Client最终继承了Connection，Connection中保存了单个Socket的实例，和Socket对应的两个读写流。因此，一个Jedis对应一个Socket连接。类图如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/e72120b1f6daf4a951e75c05b9191a0f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/e72120b1f6daf4a951e75c05b9191a0f.png" alt=""></a></p><p>BinaryClient封装了各种Redis命令，其最终会调用基类Connection的方法，使用Protocol类发送命令。看一下Protocol类的sendCommand方法的源码，可以发现其发送命令时是直接操作RedisOutputStream写入字节。</p><p>我们在多线程环境下复用Jedis对象，其实就是在复用RedisOutputStream。 <strong>如果多个线程在执行操作，那么既无法确保整条命令以一个原子操作写入Socket，也无法确保写入后、读取前没有其他数据写到远端</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static void sendCommand(final RedisOutputStream os, final byte[] command,</span></span>
<span class="line"><span>	  final byte[]... args) {</span></span>
<span class="line"><span>	try {</span></span>
<span class="line"><span>	  os.write(ASTERISK_BYTE);</span></span>
<span class="line"><span>	  os.writeIntCrLf(args.length + 1);</span></span>
<span class="line"><span>	  os.write(DOLLAR_BYTE);</span></span>
<span class="line"><span>	  os.writeIntCrLf(command.length);</span></span>
<span class="line"><span>	  os.write(command);</span></span>
<span class="line"><span>	  os.writeCrLf();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	  for (final byte[] arg : args) {</span></span>
<span class="line"><span>	    os.write(DOLLAR_BYTE);</span></span>
<span class="line"><span>	    os.writeIntCrLf(arg.length);</span></span>
<span class="line"><span>	    os.write(arg);</span></span>
<span class="line"><span>	    os.writeCrLf();</span></span>
<span class="line"><span>	  }</span></span>
<span class="line"><span>	} catch (IOException e) {</span></span>
<span class="line"><span>	  throw new JedisConnectionException(e);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到这里我们也可以理解了，为啥多线程情况下使用Jedis对象操作Redis会出现各种奇怪的问题。</p><p>比如，写操作互相干扰，多条命令相互穿插的话，必然不是合法的Redis命令，那么Redis会关闭客户端连接，导致连接断开；又比如，线程1和2先后写入了get a和get b操作的请求，Redis也返回了值1和2，但是线程2先读取了数据1就会出现数据错乱的问题。</p><p>修复方式是，使用Jedis提供的另一个线程安全的类JedisPool来获得Jedis的实例。JedisPool可以声明为static在多个线程之间共享，扮演连接池的角色。使用时，按需使用try-with-resources模式从JedisPool获得和归还Jedis实例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static JedisPool jedisPool = new JedisPool(&quot;127.0.0.1&quot;, 6379);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>    try (Jedis jedis = jedisPool.getResource()) {</span></span>
<span class="line"><span>        for (int i = 0; i &amp;lt; 1000; i++) {</span></span>
<span class="line"><span>            String result = jedis.get(&quot;a&quot;);</span></span>
<span class="line"><span>            if (!result.equals(&quot;1&quot;)) {</span></span>
<span class="line"><span>                log.warn(&quot;Expect a to be 1 but found {}&quot;, result);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}).start();</span></span>
<span class="line"><span>new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>    try (Jedis jedis = jedisPool.getResource()) {</span></span>
<span class="line"><span>        for (int i = 0; i &amp;lt; 1000; i++) {</span></span>
<span class="line"><span>            String result = jedis.get(&quot;b&quot;);</span></span>
<span class="line"><span>            if (!result.equals(&quot;2&quot;)) {</span></span>
<span class="line"><span>                log.warn(&quot;Expect b to be 2 but found {}&quot;, result);</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}).start();</span></span></code></pre></div><p>这样修复后，代码不再有线程安全问题了。此外，我们最好通过shutdownhook，在程序退出之前关闭JedisPool：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PostConstruct</span></span>
<span class="line"><span>public void init() {</span></span>
<span class="line"><span>    Runtime.getRuntime().addShutdownHook(new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>        jedisPool.close();</span></span>
<span class="line"><span>    }));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看一下Jedis类close方法的实现可以发现，如果Jedis是从连接池获取的话，那么close方法会调用连接池的return方法归还连接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Jedis extends BinaryJedis implements JedisCommands, MultiKeyCommands,</span></span>
<span class="line"><span>    AdvancedJedisCommands, ScriptingCommands, BasicCommands, ClusterCommands, SentinelCommands, ModuleCommands {</span></span>
<span class="line"><span>  protected JedisPoolAbstract dataSource = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void close() {</span></span>
<span class="line"><span>    if (dataSource != null) {</span></span>
<span class="line"><span>      JedisPoolAbstract pool = this.dataSource;</span></span>
<span class="line"><span>      this.dataSource = null;</span></span>
<span class="line"><span>      if (client.isBroken()) {</span></span>
<span class="line"><span>        pool.returnBrokenResource(this);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        pool.returnResource(this);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      super.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果不是，则直接关闭连接，其最终调用Connection类的disconnect方法来关闭TCP连接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void disconnect() {</span></span>
<span class="line"><span>  if (isConnected()) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      outputStream.flush();</span></span>
<span class="line"><span>      socket.close();</span></span>
<span class="line"><span>    } catch (IOException ex) {</span></span>
<span class="line"><span>      broken = true;</span></span>
<span class="line"><span>      throw new JedisConnectionException(ex);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      IOUtils.closeQuietly(socket);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，Jedis可以独立使用，也可以配合连接池使用，这个连接池就是JedisPool。我们再看看JedisPool的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class JedisPool extends JedisPoolAbstract {</span></span>
<span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>  public Jedis getResource() {</span></span>
<span class="line"><span>    Jedis jedis = super.getResource();</span></span>
<span class="line"><span>    jedis.setDataSource(this);</span></span>
<span class="line"><span>    return jedis;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  protected void returnResource(final Jedis resource) {</span></span>
<span class="line"><span>    if (resource != null) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        resource.resetState();</span></span>
<span class="line"><span>        returnResourceObject(resource);</span></span>
<span class="line"><span>      } catch (Exception e) {</span></span>
<span class="line"><span>        returnBrokenResource(resource);</span></span>
<span class="line"><span>        throw new JedisException(&quot;Resource is returned to the pool as broken&quot;, e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JedisPoolAbstract extends Pool&amp;lt;Jedis&amp;gt; {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public abstract class Pool&amp;lt;T&amp;gt; implements Closeable {</span></span>
<span class="line"><span>  protected GenericObjectPool&amp;lt;T&amp;gt; internalPool;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>JedisPool的getResource方法在拿到Jedis对象后，将自己设置为了连接池。连接池JedisPool，继承了JedisPoolAbstract，而后者继承了抽象类Pool，Pool内部维护了Apache Common的通用池GenericObjectPool。JedisPool的连接池就是基于GenericObjectPool的。</p><p>看到这里我们了解了，Jedis的API实现是我们说的三种类型中的第一种，也就是连接池和连接分离的API，JedisPool是线程安全的连接池，Jedis是非线程安全的单一连接。知道了原理之后，我们再使用Jedis就胸有成竹了。</p><h2 id="使用连接池务必确保复用" tabindex="-1">使用连接池务必确保复用 <a class="header-anchor" href="#使用连接池务必确保复用" aria-label="Permalink to &quot;使用连接池务必确保复用&quot;">​</a></h2><p>在介绍 <a href="https://time.geekbang.org/column/article/210337" target="_blank" rel="noreferrer">线程池</a> 的时候我们强调过， <strong>池一定是用来复用的，否则其使用代价会比每次创建单一对象更大。对连接池来说更是如此，原因如下：</strong></p><ul><li>创建连接池的时候很可能一次性创建了多个连接，大多数连接池考虑到性能，会在初始化的时候维护一定数量的最小连接（毕竟初始化连接池的过程一般是一次性的），可以直接使用。如果每次使用连接池都按需创建连接池，那么很可能你只用到一个连接，但是创建了N个连接。</li><li>连接池一般会有一些管理模块，也就是连接池的结构示意图中的绿色部分。举个例子，大多数的连接池都有闲置超时的概念。连接池会检测连接的闲置时间，定期回收闲置的连接，把活跃连接数降到最低（闲置）连接的配置值，减轻服务端的压力。一般情况下，闲置连接由独立线程管理，启动了空闲检测的连接池相当于还会启动一个线程。此外，有些连接池还需要独立线程负责连接保活等功能。因此，启动一个连接池相当于启动了N个线程。</li></ul><p>除了使用代价，连接池不释放，还可能会引起线程泄露。接下来，我就以Apache HttpClient为例，和你说说连接池不复用的问题。</p><p>首先，创建一个CloseableHttpClient，设置使用PoolingHttpClientConnectionManager连接池并启用空闲连接驱逐策略，最大空闲时间为60秒，然后使用这个连接来请求一个会返回OK字符串的服务端接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;wrong1&quot;)</span></span>
<span class="line"><span>public String wrong1() {</span></span>
<span class="line"><span>    CloseableHttpClient client = HttpClients.custom()</span></span>
<span class="line"><span>            .setConnectionManager(new PoolingHttpClientConnectionManager())</span></span>
<span class="line"><span>            .evictIdleConnections(60, TimeUnit.SECONDS).build();</span></span>
<span class="line"><span>    try (CloseableHttpResponse response = client.execute(new HttpGet(&quot;http://127.0.0.1:45678/httpclientnotreuse/test&quot;))) {</span></span>
<span class="line"><span>        return EntityUtils.toString(response.getEntity());</span></span>
<span class="line"><span>    } catch (Exception ex) {</span></span>
<span class="line"><span>        ex.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>访问这个接口几次后查看应用线程情况，可以看到有大量叫作Connection evictor的线程，且这些线程不会销毁：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/33a2389c20653e97b8157897d06c1510.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/33a2389c20653e97b8157897d06c1510.png" alt=""></a></p><p>对这个接口进行几秒的压测（压测使用wrk，1个并发1个连接）可以看到，已经建立了三千多个TCP连接到45678端口（其中有1个是压测客户端到Tomcat的连接，大部分都是HttpClient到Tomcat的连接）：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/54a71ee9a7bbbd5e121b12fe6289aff2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/54a71ee9a7bbbd5e121b12fe6289aff2.png" alt=""></a></p><p>好在有了空闲连接回收的策略，60秒之后连接处于CLOSE_WAIT状态，最终彻底关闭。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/8ea5f53e6510d76cf447c23fb15daa77.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/8ea5f53e6510d76cf447c23fb15daa77.png" alt=""></a></p><p>这2点证明，CloseableHttpClient属于第二种模式，即内部带有连接池的API，其背后是连接池，最佳实践一定是复用。</p><p>复用方式很简单，你可以把CloseableHttpClient声明为static，只创建一次，并且在JVM关闭之前通过addShutdownHook钩子关闭连接池，在使用的时候直接使用CloseableHttpClient即可，无需每次都创建。</p><p>首先，定义一个right接口来实现服务端接口调用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static CloseableHttpClient httpClient = null;</span></span>
<span class="line"><span>static {</span></span>
<span class="line"><span>    //当然，也可以把CloseableHttpClient定义为Bean，然后在&amp;#64;PreDestroy标记的方法内close这个HttpClient</span></span>
<span class="line"><span>    httpClient = HttpClients.custom().setMaxConnPerRoute(1).setMaxConnTotal(1).evictIdleConnections(60, TimeUnit.SECONDS).build();</span></span>
<span class="line"><span>    Runtime.getRuntime().addShutdownHook(new Thread(() -&amp;gt; {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            httpClient.close();</span></span>
<span class="line"><span>        } catch (IOException ignored) {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;right&quot;)</span></span>
<span class="line"><span>public String right() {</span></span>
<span class="line"><span>    try (CloseableHttpResponse response = httpClient.execute(new HttpGet(&quot;http://127.0.0.1:45678/httpclientnotreuse/test&quot;))) {</span></span>
<span class="line"><span>        return EntityUtils.toString(response.getEntity());</span></span>
<span class="line"><span>    } catch (Exception ex) {</span></span>
<span class="line"><span>        ex.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，重新定义一个wrong2接口，修复之前按需创建CloseableHttpClient的代码，每次用完之后确保连接池可以关闭：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;wrong2&quot;)</span></span>
<span class="line"><span>public String wrong2() {</span></span>
<span class="line"><span>    try (CloseableHttpClient client = HttpClients.custom()</span></span>
<span class="line"><span>            .setConnectionManager(new PoolingHttpClientConnectionManager())</span></span>
<span class="line"><span>            .evictIdleConnections(60, TimeUnit.SECONDS).build();</span></span>
<span class="line"><span>         CloseableHttpResponse response = client.execute(new HttpGet(&quot;http://127.0.0.1:45678/httpclientnotreuse/test&quot;))) {</span></span>
<span class="line"><span>            return EntityUtils.toString(response.getEntity());</span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>        ex.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用wrk对wrong2和right两个接口分别压测60秒，可以看到两种使用方式性能上的差异，每次创建连接池的QPS是337，而复用连接池的QPS是2022：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/b79fb99cf8a5c3a17e60b0850544472d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/b79fb99cf8a5c3a17e60b0850544472d.png" alt=""></a></p><p>如此大的性能差异显然是因为TCP连接的复用。你可能注意到了，刚才定义连接池时，我将最大连接数设置为1。所以，复用连接池方式复用的始终应该是同一个连接，而新建连接池方式应该是每次都会创建新的TCP连接。</p><p>接下来，我们通过网络抓包工具Wireshark来证实这一点。</p><p>如果调用wrong2接口每次创建新的连接池来发起HTTP请求，从Wireshark可以看到，每次请求服务端45678的客户端端口都是新的。这里我发起了三次请求，程序通过HttpClient访问服务端45678的客户端端口号，分别是51677、51679和51681：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/7b8f651755cef0c05ecb08727d315e35.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/7b8f651755cef0c05ecb08727d315e35.png" alt=""></a></p><p>也就是说，每次都是新的TCP连接，放开HTTP这个过滤条件也可以看到完整的TCP握手、挥手的过程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/4815c0edd21d5bf0cae8c0c3e578960d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/4815c0edd21d5bf0cae8c0c3e578960d.png" alt=""></a></p><p>而复用连接池方式的接口right的表现就完全不同了。可以看到，第二次HTTP请求#41的客户端端口61468和第一次连接#23的端口是一样的，Wireshark也提示了整个TCP会话中，当前#41请求是第二次请求，前一次是#23，后面一次是#75：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/2cbada9be98ce33321b29d38adb09f2c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/2cbada9be98ce33321b29d38adb09f2c.png" alt=""></a></p><p>只有TCP连接闲置超过60秒后才会断开，连接池会新建连接。你可以尝试通过Wireshark观察这一过程。</p><p>接下来，我们就继续聊聊连接池的配置问题。</p><h2 id="连接池的配置不是一成不变的" tabindex="-1">连接池的配置不是一成不变的 <a class="header-anchor" href="#连接池的配置不是一成不变的" aria-label="Permalink to &quot;连接池的配置不是一成不变的&quot;">​</a></h2><p>为方便根据容量规划设置连接处的属性，连接池提供了许多参数，包括最小（闲置）连接、最大连接、闲置连接生存时间、连接生存时间等。其中，最重要的参数是最大连接数，它决定了连接池能使用的连接数量上限，达到上限后，新来的请求需要等待其他请求释放连接。</p><p>但， <strong>最大连接数不是设置得越大越好</strong>。如果设置得太大，不仅仅是客户端需要耗费过多的资源维护连接，更重要的是由于服务端对应的是多个客户端，每一个客户端都保持大量的连接，会给服务端带来更大的压力。这个压力又不仅仅是内存压力，可以想一下如果服务端的网络模型是一个TCP连接一个线程，那么几千个连接意味着几千个线程，如此多的线程会造成大量的线程切换开销。</p><p>当然， <strong>连接池最大连接数设置得太小，很可能会因为获取连接的等待时间太长，导致吞吐量低下，甚至超时无法获取连接</strong>。</p><p>接下来，我们就模拟下压力增大导致数据库连接池打满的情况，来实践下如何确认连接池的使用情况，以及有针对性地进行参数优化。</p><p>首先，定义一个用户注册方法，通过@Transactional注解为方法开启事务。其中包含了500毫秒的休眠，一个数据库事务对应一个TCP连接，所以500多毫秒的时间都会占用数据库连接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional</span></span>
<span class="line"><span>public User register(){</span></span>
<span class="line"><span>    User user=new User();</span></span>
<span class="line"><span>    user.setName(&quot;new-user-&quot;+System.currentTimeMillis());</span></span>
<span class="line"><span>    userRepository.save(user);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        TimeUnit.MILLISECONDS.sleep(500);</span></span>
<span class="line"><span>    } catch (InterruptedException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return user;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>随后，修改配置文件启用register-mbeans，使Hikari连接池能通过JMX MBean注册连接池相关统计信息，方便观察连接池：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.datasource.hikari.register-mbeans=true</span></span></code></pre></div><p>启动程序并通过JConsole连接进程后，可以看到默认情况下最大连接数为10：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/7b8e5aff5a3ef6ade1d8027c20c92f94.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/7b8e5aff5a3ef6ade1d8027c20c92f94.png" alt=""></a></p><p>使用wrk对应用进行压测，可以看到连接数一下子从0到了10，有20个线程在等待获取连接：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/b22169b8d8bbfabbb8b93ece11a1f9ef.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/b22169b8d8bbfabbb8b93ece11a1f9ef.png" alt=""></a></p><p>不久就出现了无法获取数据库连接的异常，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[15:37:56.156] [http-nio-45678-exec-15] [ERROR] [.a.c.c.C.[.[.[/].[dispatcherServlet]:175 ] - Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.dao.DataAccessResourceFailureException: unable to obtain isolated JDBC connection; nested exception is org.hibernate.exception.JDBCConnectionException: unable to obtain isolated JDBC connection] with root cause</span></span>
<span class="line"><span>java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.</span></span></code></pre></div><p>从异常信息中可以看到，数据库连接池是HikariPool，解决方式很简单，修改一下配置文件，调整数据库连接池最大连接参数到50即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.datasource.hikari.maximum-pool-size=50</span></span></code></pre></div><p>然后，再观察一下这个参数是否适合当前压力，满足需求的同时也不占用过多资源。从监控来看这个调整是合理的，有一半的富余资源，再也没有线程需要等待连接了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/d24f23f05d49378a10a857cd8b9ef031.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/211388/d24f23f05d49378a10a857cd8b9ef031.png" alt=""></a></p><p>在这个Demo里，我知道压测大概能对应使用25左右的并发连接，所以直接把连接池最大连接设置为了50。在真实情况下，只要数据库可以承受，你可以选择在遇到连接超限的时候先设置一个足够大的连接数，然后观察最终应用的并发，再按照实际并发数留出一半的余量来设置最终的最大连接。</p><p>其实，看到错误日志后再调整已经有点儿晚了。更合适的做法是， <strong>对类似数据库连接池的重要资源进行持续检测，并设置一半的使用量作为报警阈值，出现预警后及时扩容</strong>。</p><p>在这里我是为了演示，才通过JConsole查看参数配置后的效果，生产上需要把相关数据对接到指标监控体系中持续监测。</p><p><strong>这里要强调的是，修改配置参数务必验证是否生效，并且在监控系统中确认参数是否生效、是否合理。之所以要“强调”，是因为这里有坑</strong>。</p><p>我之前就遇到过这样一个事故。应用准备针对大促活动进行扩容，把数据库配置文件中Druid连接池最大连接数maxActive从50提高到了100，修改后并没有通过监控验证，结果大促当天应用因为连接池连接数不够爆了。</p><p>经排查发现，当时修改的连接数并没有生效。原因是，应用虽然一开始使用的是Druid连接池，但后来框架升级了，把连接池替换为了Hikari实现，原来的那些配置其实都是无效的，修改后的参数配置当然也不会生效。</p><p>所以说，对连接池进行调参，一定要眼见为实。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我以三种业务代码最常用的Redis连接池、HTTP连接池、数据库连接池为例，和你探讨了有关连接池实现方式、使用姿势和参数配置的三大问题。</p><p>客户端SDK实现连接池的方式，包括池和连接分离、内部带有连接池和非连接池三种。要正确使用连接池，就必须首先鉴别连接池的实现方式。比如，Jedis的API实现的是池和连接分离的方式，而Apache HttpClient是内置连接池的API。</p><p>对于使用姿势其实就是两点，一是确保连接池是复用的，二是尽可能在程序退出之前显式关闭连接池释放资源。连接池设计的初衷就是为了保持一定量的连接，这样连接可以随取随用。从连接池获取连接虽然很快，但连接池的初始化会比较慢，需要做一些管理模块的初始化以及初始最小闲置连接。一旦连接池不是复用的，那么其性能会比随时创建单一连接更差。</p><p>最后，连接池参数配置中，最重要的是最大连接数，许多高并发应用往往因为最大连接数不够导致性能问题。但，最大连接数不是设置得越大越好，够用就好。需要注意的是，针对数据库连接池、HTTP连接池、Redis连接池等重要连接池，务必建立完善的监控和报警机制，根据容量规划及时调整参数配置。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>有了连接池之后，获取连接是从连接池获取，没有足够连接时连接池会创建连接。这时，获取连接操作往往有两个超时时间：一个是从连接池获取连接的最长等待时间，通常叫作请求连接超时connectRequestTimeout或连接等待超时connectWaitTimeout；一个是连接池新建TCP连接三次握手的连接超时，通常叫作连接超时connectTimeout。针对JedisPool、Apache HttpClient和Hikari数据库连接池，你知道如何设置这2个参数吗？</li><li>对于带有连接池的SDK的使用姿势，最主要的是鉴别其内部是否实现了连接池，如果实现了连接池要尽量复用Client。对于NoSQL中的MongoDB来说，使用MongoDB Java驱动时，MongoClient类应该是每次都创建还是复用呢？你能否在 <a href="https://mongodb.github.io/mongo-java-driver/3.12/" target="_blank" rel="noreferrer">官方文档</a> 中找到答案呢？</li></ol><p>关于连接池，你还遇到过什么坑吗？我是朱晔，欢迎在评论区与我留言分享，也欢迎你把这篇文章分享给你的朋友或同事，一起交流。</p>`,108)])])}const h=n(t,[["render",i]]);export{g as __pageData,h as default};
