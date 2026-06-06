import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"26 | 实战二（下）：如何实现一个支持各种统计规则的性能计数器？","description":"","frontmatter":{},"headers":[{"level":2,"title":"小步快跑、逐步迭代","slug":"小步快跑、逐步迭代","link":"#小步快跑、逐步迭代","children":[]},{"level":2,"title":"面向对象设计与实现","slug":"面向对象设计与实现","link":"#面向对象设计与实现","children":[{"level":3,"title":"1.划分职责进而识别出有哪些类","slug":"_1-划分职责进而识别出有哪些类","link":"#_1-划分职责进而识别出有哪些类","children":[]},{"level":3,"title":"2.定义类及类与类之间的关系","slug":"_2-定义类及类与类之间的关系","link":"#_2-定义类及类与类之间的关系","children":[]},{"level":3,"title":"3.将类组装起来并提供执行入口","slug":"_3-将类组装起来并提供执行入口","link":"#_3-将类组装起来并提供执行入口","children":[]}]},{"level":2,"title":"Review设计与实现","slug":"review设计与实现","link":"#review设计与实现","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/26-实战二（下）：如何实现一个支持各种统计规则的性能计数器？.md","filePath":"设计模式之美/26-实战二（下）：如何实现一个支持各种统计规则的性能计数器？.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/26-实战二（下）：如何实现一个支持各种统计规则的性能计数器？.md"};function i(t,s,r,c,o,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_26-实战二-下-如何实现一个支持各种统计规则的性能计数器" tabindex="-1">26 | 实战二（下）：如何实现一个支持各种统计规则的性能计数器？ <a class="header-anchor" href="#_26-实战二-下-如何实现一个支持各种统计规则的性能计数器" aria-label="Permalink to &quot;26 | 实战二（下）：如何实现一个支持各种统计规则的性能计数器？&quot;">​</a></h1><p>在上一节课中，我们对计数器框架做了需求分析和粗略的模块划分。今天这节课，我们利用面向对象设计、实现方法，并结合之前学过的设计思想、设计原则来看一下，如何编写灵活、可扩展的、高质量的代码实现。</p><p>话不多说，现在就让我们正式开始今天的学习吧！</p><h2 id="小步快跑、逐步迭代" tabindex="-1">小步快跑、逐步迭代 <a class="header-anchor" href="#小步快跑、逐步迭代" aria-label="Permalink to &quot;小步快跑、逐步迭代&quot;">​</a></h2><p>在上一节课中，我们将整个框架分为数据采集、存储、聚合统计、显示这四个模块。除此之外，关于统计触发方式（主动推送、被动触发统计）、统计时间区间（统计哪一个时间段内的数据）、统计时间间隔（对于主动推送方法，多久统计推送一次）我们也做了简单的设计。这里我就不重新描述了，你可以打开上一节课回顾一下。</p><p>虽然上一节课的最小原型为我们奠定了迭代开发的基础，但离我们最终期望的框架的样子还有很大的距离。我自己在写这篇文章的时候，试图去实现上面罗列的所有功能需求，希望写出一个完美的框架，发现这是件挺烧脑的事情，在写代码的过程中，一直有种“脑子不够使”的感觉。我这个有十多年工作经验的人尚且如此，对于没有太多经验的开发者来说，想一下子把所有需求都实现出来，更是一件非常有挑战的事情。一旦无法顺利完成，你可能就会有很强的挫败感，就会陷入自我否定的情绪中。</p><p>不过，即便你有能力将所有需求都实现，可能也要花费很大的设计精力和开发时间，迟迟没有产出，你的leader会因此产生很强的不可控感。对于现在的互联网项目来说，小步快跑、逐步迭代是一种更好的开发模式。所以，我们应该分多个版本逐步完善这个框架。第一个版本可以先实现一些基本功能，对于更高级、更复杂的功能，以及非功能性需求不做过高的要求，在后续的v2.0、v3.0……版本中继续迭代优化。</p><p>针对这个框架的开发，我们在v1.0版本中，暂时只实现下面这些功能。剩下的功能留在v2.0、v3.0版本，也就是我们后面的第39节和第40节课中再来讲解。</p><ul><li>数据采集：负责打点采集原始数据，包括记录每次接口请求的响应时间和请求时间。</li><li>存储：负责将采集的原始数据保存下来，以便之后做聚合统计。数据的存储方式有很多种，我们暂时只支持Redis这一种存储方式，并且，采集与存储两个过程同步执行。</li><li>聚合统计：负责将原始数据聚合为统计数据，包括响应时间的最大值、最小值、平均值、99.9百分位值、99百分位值，以及接口请求的次数和tps。</li><li>显示：负责将统计数据以某种格式显示到终端，暂时只支持主动推送给命令行和邮件。命令行间隔n秒统计显示上m秒的数据（比如，间隔60s统计上60s的数据）。邮件每日统计上日的数据。</li></ul><p>现在这个版本的需求比之前的要更加具体、简单了，实现起来也更加容易一些。实际上，学会结合具体的需求，做合理的预判、假设、取舍，规划版本的迭代设计开发，也是一个资深工程师必须要具备的能力。</p><h2 id="面向对象设计与实现" tabindex="-1">面向对象设计与实现 <a class="header-anchor" href="#面向对象设计与实现" aria-label="Permalink to &quot;面向对象设计与实现&quot;">​</a></h2><p>在 <a href="https://time.geekbang.org/column/article/171760" target="_blank" rel="noreferrer">第13节</a> 和 <a href="https://time.geekbang.org/column/article/171767" target="_blank" rel="noreferrer">第14节</a> 课中，我们把面向对象设计与实现分开来讲解，界限划分比较明显。在实际的软件开发中，这两个过程往往是交叉进行的。一般是先有一个粗糙的设计，然后着手实现，实现的过程发现问题，再回过头来补充修改设计。所以，对于这个框架的开发来说，我们把设计和实现放到一块来讲解。</p><p>回顾上一节课中的最小原型的实现，所有的代码都耦合在一个类中，这显然是不合理的。接下来，我们就按照之前讲的面向对象设计的几个步骤，来重新划分、设计类。</p><h3 id="_1-划分职责进而识别出有哪些类" tabindex="-1">1.划分职责进而识别出有哪些类 <a class="header-anchor" href="#_1-划分职责进而识别出有哪些类" aria-label="Permalink to &quot;1.划分职责进而识别出有哪些类&quot;">​</a></h3><p>根据需求描述，我们先大致识别出下面几个接口或类。这一步不难，完全就是翻译需求。</p><ul><li>MetricsCollector类负责提供API，来采集接口请求的原始数据。我们可以为MetricsCollector抽象出一个接口，但这并不是必须的，因为暂时我们只能想到一个MetricsCollector的实现方式。</li><li>MetricsStorage接口负责原始数据存储，RedisMetricsStorage类实现MetricsStorage接口。这样做是为了今后灵活地扩展新的存储方法，比如用HBase来存储。</li><li>Aggregator类负责根据原始数据计算统计数据。</li><li>ConsoleReporter类、EmailReporter类分别负责以一定频率统计并发送统计数据到命令行和邮件。至于ConsoleReporter和EmailReporter是否可以抽象出可复用的抽象类，或者抽象出一个公共的接口，我们暂时还不能确定。</li></ul><h3 id="_2-定义类及类与类之间的关系" tabindex="-1">2.定义类及类与类之间的关系 <a class="header-anchor" href="#_2-定义类及类与类之间的关系" aria-label="Permalink to &quot;2.定义类及类与类之间的关系&quot;">​</a></h3><p>接下来就是定义类及属性和方法，定义类与类之间的关系。这两步没法分得很开，所以，我们今天将它们合在一起来讲解。</p><p>大致地识别出几个核心的类之后，我的习惯性做法是，先在IDE中创建好这几个类，然后开始试着定义它们的属性和方法。在设计类、类与类之间交互的时候，我会不断地用之前学过的设计原则和思想来审视设计是否合理，比如，是否满足单一职责原则、开闭原则、依赖注入、KISS原则、DRY原则、迪米特法则，是否符合基于接口而非实现编程思想，代码是否高内聚、低耦合，是否可以抽象出可复用代码等等。</p><p>MetricsCollector类的定义非常简单，具体代码如下所示。对比上一节课中最小原型的代码，MetricsCollector通过引入RequestInfo类来封装原始数据信息，用一个采集函数代替了之前的两个函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MetricsCollector {</span></span>
<span class="line"><span>  private MetricsStorage metricsStorage;//基于接口而非实现编程</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //依赖注入</span></span>
<span class="line"><span>  public MetricsCollector(MetricsStorage metricsStorage) {</span></span>
<span class="line"><span>    this.metricsStorage = metricsStorage;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //用一个函数代替了最小原型中的两个函数</span></span>
<span class="line"><span>  public void recordRequest(RequestInfo requestInfo) {</span></span>
<span class="line"><span>    if (requestInfo == null || StringUtils.isBlank(requestInfo.getApiName())) {</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    metricsStorage.saveRequestInfo(requestInfo);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RequestInfo {</span></span>
<span class="line"><span>  private String apiName;</span></span>
<span class="line"><span>  private double responseTime;</span></span>
<span class="line"><span>  private long timestamp;</span></span>
<span class="line"><span>  //...省略constructor/getter/setter方法...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>MetricsStorage类和RedisMetricsStorage类的属性和方法也比较明确。具体的代码实现如下所示。注意，一次性取太长时间区间的数据，可能会导致拉取太多的数据到内存中，有可能会撑爆内存。对于Java来说，就有可能会触发OOM（Out Of Memory）。而且，即便不出现OOM，\b内存还够用，但也会因为内存吃紧，导致频繁的Full GC，进而导致系统接口请求处理变慢，甚至超时。这个问题解决起来并不难，先留给你自己思考一下。我会在第40节课中解答。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface MetricsStorage {</span></span>
<span class="line"><span>  void saveRequestInfo(RequestInfo requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  List&amp;lt;RequestInfo&amp;gt; getRequestInfos(String apiName, long startTimeInMillis, long endTimeInMillis);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Map&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; getRequestInfos(long startTimeInMillis, long endTimeInMillis);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RedisMetricsStorage implements MetricsStorage {</span></span>
<span class="line"><span>  //...省略属性和构造函数等...</span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void saveRequestInfo(RequestInfo requestInfo) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public List&amp;lt;RequestInfo&amp;gt; getRequestInfos(String apiName, long startTimestamp, long endTimestamp) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public Map&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; getRequestInfos(long startTimestamp, long endTimestamp) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>MetricsCollector类和MetricsStorage类的设计思路比较简单，不同的人给出的设计结果应该大差不差。但是，统计和显示这两个功能就不一样了，可以有多种设计思路。实际上，如果我们把统计显示所要完成的功能逻辑细分一下的话，主要包含下面4点：</p><ol><li>根据给定的时间区间，从数据库中拉取数据；</li><li>根据原始数据，计算得到统计数据；</li><li>将统计数据显示到终端（命令行或邮件）；</li><li>定时触发以上3个过程的执行。</li></ol><p>实际上，如果用一句话总结一下的话， <strong>面向对象设计和实现要做的事情，就是把合适的代码放到合适的类中</strong>。所以，我们现在要做的工作就是，把以上的4个功能逻辑划分到几个类中。划分的方法有很多种，比如，我们可以把前两个逻辑放到一个类中，第3个逻辑放到另外一个类中，第4个逻辑作为上帝类（God Class）组合前面两个类来触发前3个逻辑的执行。当然，我们也可以把第2个逻辑单独放到一个类中，第1、3、4都放到另外一个类中。</p><p>至于到底选择哪种排列组合方式，判定的标准是，让代码尽量地满足低耦合、高内聚、单一职责、对扩展开放对修改关闭等之前讲到的各种设计原则和思想，尽量地让设计满足代码易复用、易读、易扩展、易维护。</p><p>我们暂时选择把第1、3、4逻辑放到ConsoleReporter或EmailReporter类中，把第2个逻辑放到Aggregator类中。其中，Aggregator类负责的逻辑比较简单，我们把它设计成只包含静态方法的工具类。具体的代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Aggregator {</span></span>
<span class="line"><span>  public static RequestStat aggregate(List&amp;lt;RequestInfo&amp;gt; requestInfos, long durationInMillis) {</span></span>
<span class="line"><span>    double maxRespTime = Double.MIN_VALUE;</span></span>
<span class="line"><span>    double minRespTime = Double.MAX_VALUE;</span></span>
<span class="line"><span>    double avgRespTime = -1;</span></span>
<span class="line"><span>    double p999RespTime = -1;</span></span>
<span class="line"><span>    double p99RespTime = -1;</span></span>
<span class="line"><span>    double sumRespTime = 0;</span></span>
<span class="line"><span>    long count = 0;</span></span>
<span class="line"><span>    for (RequestInfo requestInfo : requestInfos) {</span></span>
<span class="line"><span>      ++count;</span></span>
<span class="line"><span>      double respTime = requestInfo.getResponseTime();</span></span>
<span class="line"><span>      if (maxRespTime &amp;lt; respTime) {</span></span>
<span class="line"><span>        maxRespTime = respTime;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (minRespTime &amp;gt; respTime) {</span></span>
<span class="line"><span>        minRespTime = respTime;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      sumRespTime += respTime;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (count != 0) {</span></span>
<span class="line"><span>      avgRespTime = sumRespTime / count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    long tps = (long)(count / durationInMillis * 1000);</span></span>
<span class="line"><span>    Collections.sort(requestInfos, new Comparator&amp;lt;RequestInfo&amp;gt;() {</span></span>
<span class="line"><span>      &amp;#64;Override</span></span>
<span class="line"><span>      public int compare(RequestInfo o1, RequestInfo o2) {</span></span>
<span class="line"><span>        double diff = o1.getResponseTime() - o2.getResponseTime();</span></span>
<span class="line"><span>        if (diff &amp;lt; 0.0) {</span></span>
<span class="line"><span>          return -1;</span></span>
<span class="line"><span>        } else if (diff &amp;gt; 0.0) {</span></span>
<span class="line"><span>          return 1;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    int idx999 = (int)(count * 0.999);</span></span>
<span class="line"><span>    int idx99 = (int)(count * 0.99);</span></span>
<span class="line"><span>    if (count != 0) {</span></span>
<span class="line"><span>      p999RespTime = requestInfos.get(idx999).getResponseTime();</span></span>
<span class="line"><span>      p99RespTime = requestInfos.get(idx99).getResponseTime();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    RequestStat requestStat = new RequestStat();</span></span>
<span class="line"><span>    requestStat.setMaxResponseTime(maxRespTime);</span></span>
<span class="line"><span>    requestStat.setMinResponseTime(minRespTime);</span></span>
<span class="line"><span>    requestStat.setAvgResponseTime(avgRespTime);</span></span>
<span class="line"><span>    requestStat.setP999ResponseTime(p999RespTime);</span></span>
<span class="line"><span>    requestStat.setP99ResponseTime(p99RespTime);</span></span>
<span class="line"><span>    requestStat.setCount(count);</span></span>
<span class="line"><span>    requestStat.setTps(tps);</span></span>
<span class="line"><span>    return requestStat;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RequestStat {</span></span>
<span class="line"><span>  private double maxResponseTime;</span></span>
<span class="line"><span>  private double minResponseTime;</span></span>
<span class="line"><span>  private double avgResponseTime;</span></span>
<span class="line"><span>  private double p999ResponseTime;</span></span>
<span class="line"><span>  private double p99ResponseTime;</span></span>
<span class="line"><span>  private long count;</span></span>
<span class="line"><span>  private long tps;</span></span>
<span class="line"><span>  //...省略getter/setter方法...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ConsoleReporter类相当于一个上帝类，定时根据给定的时间区间，从数据库中取出数据，借助Aggregator类完成统计工作，并将统计结果输出到命令行。具体的代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ConsoleReporter {</span></span>
<span class="line"><span>  private MetricsStorage metricsStorage;</span></span>
<span class="line"><span>  private ScheduledExecutorService executor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ConsoleReporter(MetricsStorage metricsStorage) {</span></span>
<span class="line"><span>    this.metricsStorage = metricsStorage;</span></span>
<span class="line"><span>    this.executor = Executors.newSingleThreadScheduledExecutor();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 第4个代码逻辑：定时触发第1、2、3代码逻辑的执行；</span></span>
<span class="line"><span>  public void startRepeatedReport(long periodInSeconds, long durationInSeconds) {</span></span>
<span class="line"><span>    executor.scheduleAtFixedRate(new Runnable() {</span></span>
<span class="line"><span>      &amp;#64;Override</span></span>
<span class="line"><span>      public void run() {</span></span>
<span class="line"><span>        // 第1个代码逻辑：根据给定的时间区间，从数据库中拉取数据；</span></span>
<span class="line"><span>        long durationInMillis = durationInSeconds * 1000;</span></span>
<span class="line"><span>        long endTimeInMillis = System.currentTimeMillis();</span></span>
<span class="line"><span>        long startTimeInMillis = endTimeInMillis - durationInMillis;</span></span>
<span class="line"><span>        Map&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; requestInfos =</span></span>
<span class="line"><span>                metricsStorage.getRequestInfos(startTimeInMillis, endTimeInMillis);</span></span>
<span class="line"><span>        Map&amp;lt;String, RequestStat&amp;gt; stats = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        for (Map.Entry&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; entry : requestInfos.entrySet()) {</span></span>
<span class="line"><span>          String apiName = entry.getKey();</span></span>
<span class="line"><span>          List&amp;lt;RequestInfo&amp;gt; requestInfosPerApi = entry.getValue();</span></span>
<span class="line"><span>          // 第2个代码逻辑：根据原始数据，计算得到统计数据；</span></span>
<span class="line"><span>          RequestStat requestStat = Aggregator.aggregate(requestInfosPerApi, durationInMillis);</span></span>
<span class="line"><span>          stats.put(apiName, requestStat);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 第3个代码逻辑：将统计数据显示到终端（命令行或邮件）；</span></span>
<span class="line"><span>        System.out.println(&quot;Time Span: [&quot; + startTimeInMillis + &quot;, &quot; + endTimeInMillis + &quot;]&quot;);</span></span>
<span class="line"><span>        Gson gson = new Gson();</span></span>
<span class="line"><span>        System.out.println(gson.toJson(stats));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }, 0, periodInSeconds, TimeUnit.SECONDS);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class EmailReporter {</span></span>
<span class="line"><span>  private static final Long DAY_HOURS_IN_SECONDS = 86400L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private MetricsStorage metricsStorage;</span></span>
<span class="line"><span>  private EmailSender emailSender;</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; toAddresses = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public EmailReporter(MetricsStorage metricsStorage) {</span></span>
<span class="line"><span>    this(metricsStorage, new EmailSender(/*省略参数*/));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public EmailReporter(MetricsStorage metricsStorage, EmailSender emailSender) {</span></span>
<span class="line"><span>    this.metricsStorage = metricsStorage;</span></span>
<span class="line"><span>    this.emailSender = emailSender;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addToAddress(String address) {</span></span>
<span class="line"><span>    toAddresses.add(address);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void startDailyReport() {</span></span>
<span class="line"><span>    Calendar calendar = Calendar.getInstance();</span></span>
<span class="line"><span>    calendar.add(Calendar.DATE, 1);</span></span>
<span class="line"><span>    calendar.set(Calendar.HOUR_OF_DAY, 0);</span></span>
<span class="line"><span>    calendar.set(Calendar.MINUTE, 0);</span></span>
<span class="line"><span>    calendar.set(Calendar.SECOND, 0);</span></span>
<span class="line"><span>    calendar.set(Calendar.MILLISECOND, 0);</span></span>
<span class="line"><span>    Date firstTime = calendar.getTime();</span></span>
<span class="line"><span>    Timer timer = new Timer();</span></span>
<span class="line"><span>    timer.schedule(new TimerTask() {</span></span>
<span class="line"><span>      &amp;#64;Override</span></span>
<span class="line"><span>      public void run() {</span></span>
<span class="line"><span>        long durationInMillis = DAY_HOURS_IN_SECONDS * 1000;</span></span>
<span class="line"><span>        long endTimeInMillis = System.currentTimeMillis();</span></span>
<span class="line"><span>        long startTimeInMillis = endTimeInMillis - durationInMillis;</span></span>
<span class="line"><span>        Map&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; requestInfos =</span></span>
<span class="line"><span>                metricsStorage.getRequestInfos(startTimeInMillis, endTimeInMillis);</span></span>
<span class="line"><span>        Map&amp;lt;String, RequestStat&amp;gt; stats = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        for (Map.Entry&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; entry : requestInfos.entrySet()) {</span></span>
<span class="line"><span>          String apiName = entry.getKey();</span></span>
<span class="line"><span>          List&amp;lt;RequestInfo&amp;gt; requestInfosPerApi = entry.getValue();</span></span>
<span class="line"><span>          RequestStat requestStat = Aggregator.aggregate(requestInfosPerApi, durationInMillis);</span></span>
<span class="line"><span>          stats.put(apiName, requestStat);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // TODO: 格式化为html格式，并且发送邮件</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }, firstTime, DAY_HOURS_IN_SECONDS * 1000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_3-将类组装起来并提供执行入口" tabindex="-1">3.将类组装起来并提供执行入口 <a class="header-anchor" href="#_3-将类组装起来并提供执行入口" aria-label="Permalink to &quot;3.将类组装起来并提供执行入口&quot;">​</a></h3><p>因为这个框架稍微有些特殊，有两个执行入口：一个是MetricsCollector类，提供了一组API来采集原始数据；另一个是ConsoleReporter类和EmailReporter类，用来触发统计显示。框架具体的使用方式如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    MetricsStorage storage = new RedisMetricsStorage();</span></span>
<span class="line"><span>    ConsoleReporter consoleReporter = new ConsoleReporter(storage);</span></span>
<span class="line"><span>    consoleReporter.startRepeatedReport(60, 60);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    EmailReporter emailReporter = new EmailReporter(storage);</span></span>
<span class="line"><span>    emailReporter.addToAddress(&quot;wangzheng&amp;#64;xzg.com&quot;);</span></span>
<span class="line"><span>    emailReporter.startDailyReport();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MetricsCollector collector = new MetricsCollector(storage);</span></span>
<span class="line"><span>    collector.recordRequest(new RequestInfo(&quot;register&quot;, 123, 10234));</span></span>
<span class="line"><span>    collector.recordRequest(new RequestInfo(&quot;register&quot;, 223, 11234));</span></span>
<span class="line"><span>    collector.recordRequest(new RequestInfo(&quot;register&quot;, 323, 12334));</span></span>
<span class="line"><span>    collector.recordRequest(new RequestInfo(&quot;login&quot;, 23, 12434));</span></span>
<span class="line"><span>    collector.recordRequest(new RequestInfo(&quot;login&quot;, 1223, 14234));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      Thread.sleep(100000);</span></span>
<span class="line"><span>    } catch (InterruptedException e) {</span></span>
<span class="line"><span>      e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="review设计与实现" tabindex="-1">Review设计与实现 <a class="header-anchor" href="#review设计与实现" aria-label="Permalink to &quot;Review设计与实现&quot;">​</a></h2><p>我们前面讲到了SOLID、KISS、DRY、YAGNI、LOD等设计原则，基于接口而非实现编程、多用组合少用继承、高内聚低耦合等设计思想。我们现在就来看下，上面的代码实现是否符合这些设计原则和思想。</p><ul><li>MetricsCollector</li></ul><p>MetricsCollector负责采集和存储数据，职责相对来说还算比较单一。它基于接口而非实现编程，通过依赖注入的方式来传递MetricsStorage对象，可以在不需要修改代码的情况下，灵活地替换不同的存储方式，满足开闭原则。</p><ul><li>MetricsStorage、RedisMetricsStorage</li></ul><p>MetricsStorage和RedisMetricsStorage的设计比较简单。当我们需要实现新的存储方式的时候，只需要实现MetricsStorage接口即可。因为所有用到MetricsStorage和RedisMetricsStorage的地方，都是基于相同的接口函数来编程的，所以，除了在组装类的地方有所改动（从RedisMetricsStorage改为新的存储实现类），其他接口函数调用的地方都不需要改动，满足开闭原则。</p><ul><li>Aggregator</li></ul><p>Aggregator类是一个工具类，里面只有一个静态函数，有50行左右的代码量，负责各种统计数据的计算。当需要扩展新的统计功能的时候，需要修改aggregate()函数代码，并且一旦越来越多的统计功能添加进来之后，这个函数的代码量会持续增加，可读性、可维护性就变差了。所以，从刚刚的分析来看，这个类的设计可能存在职责不够单一、不易扩展等问题，需要在之后的版本中，对其结构做优化。</p><ul><li>ConsoleReporter、EmailReporter</li></ul><p>ConsoleReporter和EmailReporter中存在代码重复问题。在这两个类中，从数据库中取数据、做统计的逻辑都是相同的，可以抽取出来复用，否则就违反了DRY原则。而且整个类负责的事情比较多，职责不是太单一。特别是显示部分的代码，可能会比较复杂（比如Email的展示方式），最好是将显示部分的代码逻辑拆分成独立的类。除此之外，因为代码中涉及线程操作，并且调用了Aggregator的静态函数，所以代码的可测试性不好。</p><p>今天我们给出的代码实现还是有诸多问题的，在后面的章节（第39、40讲）中，我们会慢慢优化，给你展示整个设计演进的过程，这比直接给你最终的最优方案要有意义得多！实际上，优秀的代码都是重构出来的，复杂的代码都是慢慢堆砌出来的 。所以，当你看到那些优秀而复杂的开源代码或者项目代码的时候，也不必自惭形秽，觉得自己写不出来。毕竟罗马不是一天建成的，这些优秀的代码也是靠几年的时间慢慢迭代优化出来的。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块总结回顾一下，你需要掌握的重点内容。</p><p>写代码的过程本就是一个修修改改、不停调整的过程，肯定不是一气呵成的。你看到的那些大牛开源项目的设计和实现，也都是在不停优化、修改过程中产生的。比如，我们熟悉的Unix系统，第一版很简单、粗糙，代码不到1万行。所以，迭代思维很重要，不要刚开始就追求完美。</p><p>面向对象设计和实现要做的事情，就是把合适的代码放到合适的类中。至于到底选择哪种划分方法，判定的标准是让代码尽量地满足低耦合、高内聚、单一职责、对扩展开放对修改关闭等之前讲的各种设计原则和思想，尽量地做到代码可复用、易读、易扩展、易维护。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>今天课堂讨论题有下面两道。</p><ol><li>对于今天的设计与代码实现，你有没有发现哪些不合理的地方？有哪些可以继续优化的地方呢？或者留言说说你的设计方案。</li><li>说一个你觉得不错的开源框架或者项目，聊聊你为什么觉得它不错？</li></ol><p>欢迎在留言区写下你的答案，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,53)])])}const d=n(l,[["render",i]]);export{m as __pageData,d as default};
