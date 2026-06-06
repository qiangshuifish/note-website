import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"大咖助场3｜傅健：那些年，影响我们达到性能巅峰的常见绊脚石（上）","description":"","frontmatter":{},"headers":[{"level":2,"title":"场景1：重试、重定向","slug":"场景1-重试、重定向","link":"#场景1-重试、重定向","children":[{"level":3,"title":"案例","slug":"案例","link":"#案例","children":[]},{"level":3,"title":"解析","slug":"解析","link":"#解析","children":[]},{"level":3,"title":"小结","slug":"小结","link":"#小结","children":[]}]},{"level":2,"title":"场景2：失败引发轮询","slug":"场景2-失败引发轮询","link":"#场景2-失败引发轮询","children":[{"level":3,"title":"案例","slug":"案例-1","link":"#案例-1","children":[]},{"level":3,"title":"解析","slug":"解析-1","link":"#解析-1","children":[]},{"level":3,"title":"小结","slug":"小结-1","link":"#小结-1","children":[]}]},{"level":2,"title":"场景3：GC的“STW”停顿","slug":"场景3-gc的-stw-停顿","link":"#场景3-gc的-stw-停顿","children":[{"level":3,"title":"案例","slug":"案例-2","link":"#案例-2","children":[]},{"level":3,"title":"解析","slug":"解析-2","link":"#解析-2","children":[]},{"level":3,"title":"小结","slug":"小结-2","link":"#小结-2","children":[]}]}],"relativePath":"系统性能调优必知必会/大咖助场3｜傅健：那些年，影响我们达到性能巅峰的常见绊脚石（上）.md","filePath":"系统性能调优必知必会/大咖助场3｜傅健：那些年，影响我们达到性能巅峰的常见绊脚石（上）.md","lastUpdated":1779821570000}'),t={name:"系统性能调优必知必会/大咖助场3｜傅健：那些年，影响我们达到性能巅峰的常见绊脚石（上）.md"};function i(l,n,o,c,r,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="大咖助场3-傅健-那些年-影响我们达到性能巅峰的常见绊脚石-上" tabindex="-1">大咖助场3｜傅健：那些年，影响我们达到性能巅峰的常见绊脚石（上） <a class="header-anchor" href="#大咖助场3-傅健-那些年-影响我们达到性能巅峰的常见绊脚石-上" aria-label="Permalink to &quot;大咖助场3｜傅健：那些年，影响我们达到性能巅峰的常见绊脚石（上）&quot;">​</a></h1><p>你好，我是傅健。这里有部分同学可能认识我，我在极客时间开设了一门视频课 <a href="https://time.geekbang.org/course/intro/237" target="_blank" rel="noreferrer">《Netty源码剖析与实战》</a>，很荣幸受邀来到陶辉老师的专栏做一些分享。今天我会围绕这门课程的主题——系统性能调优，结合我自身的工作经历补充一些内容，期待能给你一些新思路。</p><p>其实说起性能调优，我们往往有很多理论依据可以参考，例如针对分布式系统的NWR、CAP等，也有很多实践的“套路”，如绘制火焰图、监控调用链等。当然，这些内容多多少少陶辉老师都有讲到。实际上，不管方式、方法有多少，我们的终极目标都是一致的，那就是在固定的资源条件下，将系统的响应速度调整到极致。</p><p>但是在严谨地评价一个系统性能时，我们很少粗略地使用这种表述：在压力A（如1000 TPS）下，基于软硬件配置B，我们应用的C操作响应时间是D毫秒。而是加上一个百分位，例如：在压力A（如1000 TPS）下，基于软硬件配置B，我们应用的C操作响应时间 <strong>99%</strong> 已经达到D毫秒。或者当需要提供更为详细的性能报告时，我们提供的往往是类似于下面表格形式的数据来反映性能：不仅包括常见的百分比（95%、99%等或者常见的四分位），也包括平均数、中位数、最大值等。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%B3%BB%E7%BB%9F%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/262096/8f50ee7ca85c3fb40b516a195ec6b6ca.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%B3%BB%E7%BB%9F%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/262096/8f50ee7ca85c3fb40b516a195ec6b6ca.jpg" alt=""></a></p><p>那为什么要如此“严谨”？不可以直接说达到了某某水平吗？究其原因，还是我们的系统很难达到一个完美的极致，总有一些请求的处理时间超出了我们的“预期”，让我们的系统不够平滑（即常说的系统有“毛刺”）。所以在追求极致的路上，我们的工作重心已经不再是“大刀阔斧”地进行主动性能调优以满足99%的需求，而是着重观察、分析那掉队的1%请求，找出这些“绊脚石”，再各个击破，从而提高我们系统性能的“百分比”。例如，从2个9（99%）再进一步提高到3个9（99.9%）。而实际上，我们不难发现，这些所谓的绊脚石其实都是类似的，所以这期分享我就带你看看究竟有哪些绊脚石，我们结合具体场景总结应对策略。</p><h2 id="场景1-重试、重定向" tabindex="-1">场景1：重试、重定向 <a class="header-anchor" href="#场景1-重试、重定向" aria-label="Permalink to &quot;场景1：重试、重定向&quot;">​</a></h2><h3 id="案例" tabindex="-1">案例 <a class="header-anchor" href="#案例" aria-label="Permalink to &quot;案例&quot;">​</a></h3><p>当我们使用下游服务的API接口时，偶尔会出现延时较大的情况，而这些延时较大的调用最后也能成功，且没有任何明显的时间规律。例如响应延时正常时，API调用性能度量数据如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span> &quot;stepName&quot;: &quot;CallRemoteService&quot;</span></span>
<span class="line"><span> &quot;values&quot;: {</span></span>
<span class="line"><span>    &quot;componentType&quot;: &quot;RemoteService&quot;,</span></span>
<span class="line"><span>    &quot;startTime&quot;: &quot;2020-07-06T10:50:41.102Z&quot;,</span></span>
<span class="line"><span>    &quot;totalDurationInMS&quot;: 2,</span></span>
<span class="line"><span>    &quot;success&quot;: true</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而响应延时超出预期时，度量数据如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span> &quot;stepName&quot;: &quot;CallRemoteService&quot;</span></span>
<span class="line"><span> &quot;values&quot;: {</span></span>
<span class="line"><span>    &quot;componentType&quot;: &quot;RemoteService&quot;,</span></span>
<span class="line"><span>    &quot;startTime&quot;: &quot;2020-07-06T04:31:55.805Z&quot;,</span></span>
<span class="line"><span>    &quot;totalDurationInMS&quot;: 2005,</span></span>
<span class="line"><span>    &quot;success&quot;: true</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="解析" tabindex="-1">解析 <a class="header-anchor" href="#解析" aria-label="Permalink to &quot;解析&quot;">​</a></h3><p>这种情况可以说非常典型了，单从以上度量数据来看，没有什么参考意义，因为所有的性能问题都是这样的特征，即延时增大了。这里面可能的原因也有许多，例如GC影响、网络抖动等等，但是除了这些原因之外，其实最常见、最简单的原因往往都是“重试”。 <strong>重试成功前的访问往往都是很慢的，因为可能遇到了各种需要重试的错误，同时重试本身也会增加响应时间。</strong> 那作为第一个绊脚石，我们现在就对它进行一个简单的分析。</p><p>以这个案例为例，经过查询后你会发现：虽然最终是成功的，但是我们中途进行了重试，具体而言就是我们在使用HttpClient访问下游服务时，自定义了重试的策略：当遇到ConnectTimeoutException、SocketTimeoutException等错误时直接进行重试。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//构建http client</span></span>
<span class="line"><span>CloseableHttpClient httpClient = HttpClients.custom().</span></span>
<span class="line"><span>      setConnectionTimeToLive(3, TimeUnit.MINUTES).</span></span>
<span class="line"><span>      //省略其它非关键代码</span></span>
<span class="line"><span>      setServiceUnavailableRetryStrategy(new DefaultServiceUnavailableRetryStrategy(1, 50)).</span></span>
<span class="line"><span>      //设置了一个自定义的重试规则</span></span>
<span class="line"><span>      setRetryHandler(new CustomizedHttpRequestRetryHandler()).</span></span>
<span class="line"><span>            build();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//自定义的重试规则</span></span>
<span class="line"><span>&amp;#64;Immutable</span></span>
<span class="line"><span>public class CustomizedHttpRequestRetryHandler implements HttpRequestRetryHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   private final static int RETRY_COUNT = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   CustomizedHttpRequestRetryHandler() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public boolean retryRequest(final IOException exception, final int executionCount, final HttpContext context) {</span></span>
<span class="line"><span>      //控制重试次数</span></span>
<span class="line"><span>      if (executionCount &amp;gt; RETRY_COUNT) {</span></span>
<span class="line"><span>         return false;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //遇到下面这些异常情况时，进行重试</span></span>
<span class="line"><span>      if (exception instanceof ConnectTimeoutException || exception instanceof NoHttpResponseException || exception instanceof SocketTimeoutException) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      //省略其它非关键代码</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果查询日志的话（由org.apache.http.impl.execchain.RetryExec#execute输出），我们确实发现了重试的痕迹，且可以完全匹配上我们的请求和时间：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[07/06/2020 04:31:57.808][threadpool-0]INFO  RetryExec-I/O exception (org.apache.http.conn.ConnectTimeoutException) caught when processing request to {}-&amp;gt;http://10.224.86.130:8080: Connect to 10.224.86.130:8080 [/10.224.86.130] failed: connect timed out</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[07/06/2020 04:31:57.808][threadpool-0]INFO  RetryExec-Retrying request to {}-&amp;gt;http://10.224.86.130:8080</span></span></code></pre></div><p>另外除了针对异常的重试外，我们有时候也需要对于服务的短暂不可用（返回503：SC_SERVICE_UNAVAILABLE）进行重试，正如上文贴出的代码中我们设置了DefaultServiceUnavailableRetryStrategy。</p><h3 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h3><p>这个案例极其简单且常见，但是这里我需要额外补充下：假设遇到这种问题，又没有明确给出重试的痕迹（日志等）时，我们应该怎么去判断是不是重试“捣鬼”的呢？</p><p>一般而言，我们可以直接通过下游服务的调用次数数据来核对是否发生了重试。但是如果下游也没有记录，在排除完其它可能原因后，我们仍然不能排除掉重试的原因，因为重试的痕迹可能由于某种原因被隐藏起来了，例如使用的开源组件压根没有打印日志，或者是打印了但是我们应用层的日志框架没有输出。这个时候，我们也没有更好的方法，只能翻阅源码查找线索。</p><p>另外除了直接的重试导致延时增加外，还有一种类似情况也经常发生，即“重定向”，而比较坑的是，对于重定向行为，很多都被“内置”起来了：即不输出INFO日志。例如Apache HttpClient对响应码3XX的处理（参考org.apache.http.impl.client.DefaultRedirectStrategy）只打印了Debug日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final String location = locationHeader.getValue();</span></span>
<span class="line"><span>if (this.log.isDebugEnabled()) {</span></span>
<span class="line"><span>    this.log.debug(&quot;Redirect requested to location &#39;&quot; + location + &quot;&#39;&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再如，当我们使用Jedis访问Redis集群中的结点时，如果数据不在当前的节点了，也会发生“重定向”，而它并没有打印出日志让我们知道这件事的发生（参考redis.clients.jedis.JedisClusterCommand）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private T runWithRetries(final int slot, int attempts, boolean tryRandomNode, JedisRedirectionException redirect) {</span></span>
<span class="line"><span>     //省略非关键代码</span></span>
<span class="line"><span>    } catch (JedisRedirectionException jre) {</span></span>
<span class="line"><span>      // if MOVED redirection occurred,</span></span>
<span class="line"><span>      if (jre instanceof JedisMovedDataException) {</span></span>
<span class="line"><span>        //此处没有输入任何日志指明接下来的执行会“跳转”了。</span></span>
<span class="line"><span>        // it rebuilds cluster&#39;s slot cache recommended by Redis cluster specification</span></span>
<span class="line"><span>        this.connectionHandler.renewSlotCache(connection);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>      return runWithRetries(slot, attempts - 1, false, jre);</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      releaseConnection(connection);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>综上，重试是最普通的，也是最简单的导致延时增加的“绊脚石”，而重试问题的界定难度取决于自身和下游服务是否有明显的痕迹指明。而对于这种绊脚石的消除，一方面我们应该主动出击，尽量减少引发重试的因素。另一方面，我们一定要控制好重试，例如：</p><ul><li>控制好重试的次数；</li><li>错峰重试的时间；</li><li>尽可能准确识别出重试的成功率，以减少不必要的重试，例如我们可以通过“熔断”“快速失败”等机制来实现。</li></ul><h2 id="场景2-失败引发轮询" tabindex="-1">场景2：失败引发轮询 <a class="header-anchor" href="#场景2-失败引发轮询" aria-label="Permalink to &quot;场景2：失败引发轮询&quot;">​</a></h2><h3 id="案例-1" tabindex="-1">案例 <a class="header-anchor" href="#案例-1" aria-label="Permalink to &quot;案例&quot;">​</a></h3><p>在使用Apache HttpClient发送HTTP请求时，稍有经验的程序员都知道去控制下超时时间，这样，在连接不上服务器或者服务器无响应时，响应延时都会得到有效的控制，例如我们会使用下面的代码来配置HttpClient：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RequestConfig requestConfig = RequestConfig.custom().</span></span>
<span class="line"><span>            setConnectTimeout(2 * 1000). //控制连接建立时间</span></span>
<span class="line"><span>            setConnectionRequestTimeout(1 * 1000).//控制获取连接时间</span></span>
<span class="line"><span>            setSocketTimeout(3 * 1000).//控制“读取”数据等待时间</span></span>
<span class="line"><span>            build();</span></span></code></pre></div><p>以上面的代码为例，你能估算出响应时间最大是多少么？上面的代码实际设置了三个参数，是否直接相加就能计算出最大延时时间？即所有请求100%控制在6秒。</p><p>先不说结论，通过实际的生产线观察，我们确实发现大多符合我们的预期：可以说99.9%的响应都控制在6秒以内，但是总有一些“某年某月某天”，发现有一些零星的请求甚至超过了10秒，这又是为什么？</p><h3 id="解析-1" tabindex="-1">解析 <a class="header-anchor" href="#解析-1" aria-label="Permalink to &quot;解析&quot;">​</a></h3><p>经过问题跟踪，我们发现我们访问的URL是一个下游服务的域名（大多如此，并不稀奇），而这个域名本身有点特殊，由于负载均衡等因素的考虑，我们将它绑定到了多个IP地址。所以假设这些IP地址中，一些IP地址指向的服务临时不服务时，则会引发轮询，即轮询其它IP地址直到最终成功或失败，而每一次轮询中的失败都会额外增加一倍ConnectTimeout，所以我们发现超过6秒甚至10秒的请求也不稀奇了。我们可以通过HttpClient的源码来验证下这个逻辑（参考org.apache.http.impl.conn.DefaultHttpClientConnectionOperator.connect方法）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void connect(</span></span>
<span class="line"><span>        final ManagedHttpClientConnection conn,</span></span>
<span class="line"><span>        final HttpHost host,</span></span>
<span class="line"><span>        final InetSocketAddress localAddress,</span></span>
<span class="line"><span>        final int connectTimeout,</span></span>
<span class="line"><span>        final SocketConfig socketConfig,</span></span>
<span class="line"><span>        final HttpContext context) throws IOException {</span></span>
<span class="line"><span>    final Lookup&amp;lt;ConnectionSocketFactory&amp;gt; registry = getSocketFactoryRegistry(context);</span></span>
<span class="line"><span>    final ConnectionSocketFactory sf = registry.lookup(host.getSchemeName());</span></span>
<span class="line"><span>    //域名解析，可能解析出多个地址</span></span>
<span class="line"><span>    final InetAddress[] addresses = host.getAddress() != null ?</span></span>
<span class="line"><span>            new InetAddress[] { host.getAddress() } : this.dnsResolver.resolve(host.getHostName());</span></span>
<span class="line"><span>    final int port = this.schemePortResolver.resolve(host);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //对于解析出的地址，进行连接，如果中途有失败，尝试下一个</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; addresses.length; i++) {</span></span>
<span class="line"><span>        final InetAddress address = addresses[i];</span></span>
<span class="line"><span>        final boolean last = i == addresses.length - 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Socket sock = sf.createSocket(context);</span></span>
<span class="line"><span>        conn.bind(sock);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        final InetSocketAddress remoteAddress = new InetSocketAddress(address, port);</span></span>
<span class="line"><span>        if (this.log.isDebugEnabled()) {</span></span>
<span class="line"><span>            this.log.debug(&quot;Connecting to &quot; + remoteAddress);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //使用解析出的地址执行连接</span></span>
<span class="line"><span>            sock = sf.connectSocket(</span></span>
<span class="line"><span>                    connectTimeout, sock, host, remoteAddress, localAddress, context);</span></span>
<span class="line"><span>            conn.bind(sock);</span></span>
<span class="line"><span>            if (this.log.isDebugEnabled()) {</span></span>
<span class="line"><span>                this.log.debug(&quot;Connection established &quot; + conn);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            //如果连接成功，则直接退出，不继续尝试其它地址</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        } catch (final SocketTimeoutException ex) {</span></span>
<span class="line"><span>            if (last) {</span></span>
<span class="line"><span>                throw new ConnectTimeoutException(ex, host, addresses);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (final ConnectException ex) {</span></span>
<span class="line"><span>            if (last) { //如果连接到最后一个地址，还是失败，则抛出异常。如果不是最后一个，则轮询下一个地址进行连接。</span></span>
<span class="line"><span>                final String msg = ex.getMessage();</span></span>
<span class="line"><span>                if (&quot;Connection timed out&quot;.equals(msg)) {</span></span>
<span class="line"><span>                    throw new ConnectTimeoutException(ex, host, addresses);</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    throw new HttpHostConnectException(ex, host, addresses);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (this.log.isDebugEnabled()) {</span></span>
<span class="line"><span>            this.log.debug(&quot;Connect to &quot; + remoteAddress + &quot; timed out. &quot; +</span></span>
<span class="line"><span>                    &quot;Connection will be retried using another IP address&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过以上代码，我们可以清晰地看出：在一个域名能解析出多个IP地址的场景下，如果其中部分IP指向的服务不可达时，延时就可能会增加。这里不妨再举个例子，对于Redis集群，我们会在客户端配置多个连接节点（例如在SpringBoot中配置spring.redis.cluster.nodes=10.224.56.101:8001,10.224.56.102:8001），通过连接节点来获取整个集群的信息（其它所有节点）。正常情况下，我们都会连接成功，所以我们没有看到长延时情况，但是假设刚初始化时，连接的部分节点不服务了，那这个时候就会连接其它配置的节点，从而导致延时倍增。</p><h3 id="小结-1" tabindex="-1">小结 <a class="header-anchor" href="#小结-1" aria-label="Permalink to &quot;小结&quot;">​</a></h3><p>这部分我们主要看了失败引发轮询造成的长延时案例，细心的同学可能会觉得这不就是上一部分介绍的重试么？但是实际上，你仔细体会，两者虽然都旨在提供系统可靠性，但却略有区别：重试一般指的是针对同一个目标进行的再次尝试，而轮询则更侧重对同类目标的遍历。</p><p>另外，除了以上介绍的开源组件（Apache HttpClient和RedisClient）案例外，还有其它一些常见组件都可能因为轮询而造成延时超过预期。例如对于Oracle连接，我们采用下面的这种配置时，也可能会出现轮询的情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DBURL=jdbc:oracle:thin:&amp;#64;(DESCRIPTION=(load_balance=off)(failover=on)(ADDRESS=(PROTOCOL=TCP)(HOST=10.224.11.91)(PORT=1804))(ADDRESS=(PROTOCOL=TCP)(HOST=10.224.11.92)(PORT=1804))(ADDRESS=(PROTOCOL=TCP)(HOST= 10.224.11.93)(PORT=1804))(CONNECT_DATA=(SERVICE_NAME=xx.yy.com)(FAILOVER_MODE=(TYPE=SELECT)(METHOD=BASIC)(RETRIES=6)(DELAY=5))))</span></span>
<span class="line"><span>DBUserName=admin</span></span>
<span class="line"><span>DBPassword=password</span></span></code></pre></div><p>其实通过对以上三个案例的观察，我们不难得出一个小规律： <strong>假设我们配置了多个同种资源，那么就很有可能存在轮询情况，这种轮询会让延时远超出我们的预期。</strong> 只是幸运的是，在大多情况下，轮询第一次就成功了，所以我们很难观察到长延时的情况。针对这种情况造成的延时，我们除了在根源上消除外因，还要特别注意控制好超时时间，假设我们不知道这种情况，我们乐观地设置了一个很大的时间，则实际发生轮询时，这个时间会被放大很多倍。</p><p>这里再回到最开始的案例啰嗦几句，对于HttpClient的访问，是否加上最大轮询时间就是最大的延时时间呢？其实仍然不是，至少我们还忽略了一个时间，即DNS解析花费的时间。这里就不再展开讲了。</p><h2 id="场景3-gc的-stw-停顿" tabindex="-1">场景3：GC的“STW”停顿 <a class="header-anchor" href="#场景3-gc的-stw-停顿" aria-label="Permalink to &quot;场景3：GC的“STW”停顿&quot;">​</a></h2><h3 id="案例-2" tabindex="-1">案例 <a class="header-anchor" href="#案例-2" aria-label="Permalink to &quot;案例&quot;">​</a></h3><p>系统之间调用是服务最常见的方式，但这也是最容易发生“掐架”的斗争之地。例如对于组件A，运维或者测试工程师反映某接口偶然性能稍差，而对于这个接口而言，实际逻辑“简单至极”，直接调用组件B的接口，而对于这个接口的调用，平时确实都是接近1ms的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[07/04/2020 07:18:16.495 pid=3160 tid=3078502112] Info:[ComponentA] Send to Component B:</span></span>
<span class="line"><span>[07/04/2020 07:18:16.496 pid=3160 tid=3078502112] Info:[ComponentA] Receive response from B</span></span></code></pre></div><p>而反映的性能掉队不经常发生，而且发生时，也没有没有特别的信息，例如下面这段日志，延时达到了400ms：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[07/04/2020 07:16:27.222 pid=4725 tid=3078407904] Info: [ComponentA]  Send to Component B:</span></span>
<span class="line"><span>[07/04/2020 07:16:27.669 pid=4725 tid=3078407904] Info: [ComponentA]  Receive response from B</span></span></code></pre></div><p>同时，对比下，我们也发现这2次请求其实很近，只有2分钟的差距。那么这又是什么导致的呢？</p><h3 id="解析-2" tabindex="-1">解析 <a class="header-anchor" href="#解析-2" aria-label="Permalink to &quot;解析&quot;">​</a></h3><p>对于这种情况，很明显，A组件往往会直接“甩锅”给B组件。于是，B组件工程师查询了日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> [07/04/2020 07:16:27.669][nioEventLoopGroup-4-1]INFO [ComponentB] Received request from Component A</span></span>
<span class="line"><span> [07/04/2020 07:16:27.669][nioEventLoopGroup-4-1]INFO [ComponentB] Response to Component B</span></span></code></pre></div><p>然后B组件也开始甩锅：鉴于我们双方组件传输层都是可靠的，且N年没有改动，那这次的慢肯定是网络抖动造成的了。貌似双方也都得到了理想的理由，但是问题还是没有解决，这种类似的情况还是时而发生，那问题到底还有别的什么原因么？</p><p>鉴于我之前的经验，其实我们早先就知道Java的STW（Stop The World）现象，可以说Java最省心的地方也是最容易让人诟病的地方。即不管怎么优化，或采用更先进的垃圾回收算法，都避免不了GC，而GC会引发停顿。其实上面这个案例，真实的原因确实就是B组件的GC导致了它的处理停顿，从而没有及时接受到A发出的信息，何以见得呢？</p><p>早先在设计B组件时，我们就考虑到未来某天可能会发生类似的事情，所以加了一个GC的跟踪日志，我们先来看看日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;metricName&quot;: &quot;java_gc&quot;,</span></span>
<span class="line"><span>  &quot;componentType&quot;: &quot;B&quot;,</span></span>
<span class="line"><span>  &quot;componentAddress&quot;: &quot;10.224.3.10&quot;,</span></span>
<span class="line"><span>  &quot;componentVer&quot;: &quot;1.0&quot;,</span></span>
<span class="line"><span>  &quot;poolName&quot;: &quot;test001&quot;,</span></span>
<span class="line"><span>  &quot;trackingID&quot;: &quot;269&quot;,</span></span>
<span class="line"><span>  &quot;metricType&quot;: &quot;innerApi&quot;,</span></span>
<span class="line"><span>  &quot;timestamp&quot;: &quot;2020-07-04T07:16:27.219Z&quot;,</span></span>
<span class="line"><span>  &quot;values&quot;: {</span></span>
<span class="line"><span>    &quot;steps&quot;: [</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &quot;totalDurationInMS&quot;: 428</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在07:16:27.219时，发生了GC，且一直持续了428ms，所以最悲观的停顿时间是从219ms到647ms，而我们观察下A组件的请求发送时间222是落在这个区域的，再核对B组件接收这个请求的时间是669，是GC结束后的时间。所以很明显，排除其它原因以后，这明显是受了GC的影响。</p><h3 id="小结-2" tabindex="-1">小结 <a class="header-anchor" href="#小结-2" aria-label="Permalink to &quot;小结&quot;">​</a></h3><p>假设某天我们看到零星请求有“掉队”，且没有什么规律，但是又持续发生，我们往往都会怀疑是网络抖动，但是假设我们的组件是部署在同一个网络内，实际上，不大可能是网络原因导致的，而更可能是GC的原因。当然，跟踪GC有N多方法，这里我只是额外贴上了组件B使用的跟踪代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>List&amp;lt;GarbageCollectorMXBean&amp;gt; gcbeans = ManagementFactory.getGarbageCollectorMXBeans();</span></span>
<span class="line"><span>for (GarbageCollectorMXBean gcbean : gcbeans) {</span></span>
<span class="line"><span>      LOGGER.info(&quot;GC bean: &quot; + gcbean);</span></span>
<span class="line"><span>   if (!(gcbean instanceof NotificationEmitter))</span></span>
<span class="line"><span>      continue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   NotificationEmitter emitter = (NotificationEmitter) gcbean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //注册一个GC(垃圾回收)的通知回调</span></span>
<span class="line"><span>   emitter.addNotificationListener(new NotificationListenerImplementation(), notification -&amp;gt; {</span></span>
<span class="line"><span>            return GarbageCollectionNotificationInfo.GARBAGE_COLLECTION_NOTIFICATION</span></span>
<span class="line"><span>         .equals(notification.getType());</span></span>
<span class="line"><span>      }, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public final static class NotificationListenerImplementation implements NotificationListener {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Override</span></span>
<span class="line"><span>   public void handleNotification(Notification notification, Object handback) {</span></span>
<span class="line"><span>      GarbageCollectionNotificationInfo info = GarbageCollectionNotificationInfo</span></span>
<span class="line"><span>               .from((CompositeData) notification.getUserData());</span></span>
<span class="line"><span>      String gctype = info.getGcAction().replace(&quot;end of &quot;, &quot;&quot;);</span></span>
<span class="line"><span>      //此处只获取major gc的相关信息</span></span>
<span class="line"><span>      if(gctype.toLowerCase().contains(&quot;major&quot;)){</span></span>
<span class="line"><span>          long id = info.getGcInfo().getId();</span></span>
<span class="line"><span>          long startTime = info.getGcInfo().getStartTime();</span></span>
<span class="line"><span>          long duration = info.getGcInfo().getDuration();</span></span>
<span class="line"><span>          //省略非关键代码，记录GC相关信息，如耗费多久、开始时间点等。</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外同样是停顿，发生的时机不同，呈现的效果也不完全相同，具体问题还得具体分析。至于应对这个问题的策略，就是我们写Java程序一直努力的方向：减少GC引发的STW时间。</p><p>以上是我总结的3种常见“绊脚石”，那其实类似这样的问题还有很多，下一期分享我会再总结出4个场景化的问题，和你一起探讨应对策略。</p>`,64)])])}const g=s(t,[["render",i]]);export{h as __pageData,g as default};
