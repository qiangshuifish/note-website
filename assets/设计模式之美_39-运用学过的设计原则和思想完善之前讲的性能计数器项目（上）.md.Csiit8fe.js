import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"39 | 运用学过的设计原则和思想完善之前讲的性能计数器项目（上）","description":"","frontmatter":{},"headers":[{"level":2,"title":"回顾版本1的设计与实现","slug":"回顾版本1的设计与实现","link":"#回顾版本1的设计与实现","children":[]},{"level":2,"title":"针对版本1的问题进行重构","slug":"针对版本1的问题进行重构","link":"#针对版本1的问题进行重构","children":[]},{"level":2,"title":"Review版本2的设计与实现","slug":"review版本2的设计与实现","link":"#review版本2的设计与实现","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/39-运用学过的设计原则和思想完善之前讲的性能计数器项目（上）.md","filePath":"设计模式之美/39-运用学过的设计原则和思想完善之前讲的性能计数器项目（上）.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/39-运用学过的设计原则和思想完善之前讲的性能计数器项目（上）.md"};function t(i,s,r,o,c,g){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_39-运用学过的设计原则和思想完善之前讲的性能计数器项目-上" tabindex="-1">39 | 运用学过的设计原则和思想完善之前讲的性能计数器项目（上） <a class="header-anchor" href="#_39-运用学过的设计原则和思想完善之前讲的性能计数器项目-上" aria-label="Permalink to &quot;39 | 运用学过的设计原则和思想完善之前讲的性能计数器项目（上）&quot;">​</a></h1><p>在 <a href="https://time.geekbang.org/column/article/179644" target="_blank" rel="noreferrer">第25节</a>、 <a href="https://time.geekbang.org/column/article/179673" target="_blank" rel="noreferrer">第26节</a> 中，我们讲了如何对一个性能计数器框架进行分析、设计与实现，并且实践了之前学过的一些设计原则和设计思想。当时我们提到，小步快跑、逐步迭代是一种非常实用的开发模式。所以，针对这个框架的开发，我们分多个版本来逐步完善。</p><p>在第25、26节课中，我们实现了框架的第一个版本，它只包含最基本的一些功能，在设计与实现上还有很多不足。所以，接下来，我会针对这些不足，继续迭代开发两个版本：版本2和版本3，分别对应第39节和第40节的内容。</p><p>在版本2中，我们会利用之前学过的重构方法，对版本1的设计与实现进行重构，解决版本1存在的设计问题，让它满足之前学过的设计原则、思想、编程规范。在版本3中，我们再对版本2进行迭代，并且完善框架的功能和非功能需求，让其满足第25节课中罗列的所有需求。</p><p>话不多说，让我们正式开始版本2的设计与实现吧！</p><h2 id="回顾版本1的设计与实现" tabindex="-1">回顾版本1的设计与实现 <a class="header-anchor" href="#回顾版本1的设计与实现" aria-label="Permalink to &quot;回顾版本1的设计与实现&quot;">​</a></h2><p>首先，让我们一块回顾一下版本1的设计与实现。当然，如果时间充足，你最好能再重新看一下第25、26节的内容。在版本1中，整个框架的代码被划分为下面这几个类。</p><ul><li>MetricsCollector：负责打点采集原始数据，包括记录每次接口请求的响应时间和请求时间戳，并调用MetricsStorage提供的接口来存储这些原始数据。</li><li>MetricsStorage和RedisMetricsStorage：负责原始数据的存储和读取。</li><li>Aggregator：是一个工具类，负责各种统计数据的计算，比如响应时间的最大值、最小值、平均值、百分位值、接口访问次数、tps。</li><li>ConsoleReporter和EmailReporter：相当于一个上帝类（God Class），定时根据给定的时间区间，从数据库中取出数据，借助Aggregator类完成统计工作，并将统计结果输出到相应的终端，比如命令行、邮件。</li></ul><p>MetricCollector、MetricsStorage、RedisMetricsStorage的设计与实现比较简单，不是版本2重构的重点。今天，我们重点来看一下Aggregator和ConsoleReporter、EmailReporter这几个类。</p><p><strong>我们先来看一下Aggregator类存在的问题。</strong></p><p>Aggregator类里面只有一个静态函数，有50行左右的代码量，负责各种统计数据的计算。当要添加新的统计功能的时候，我们需要修改aggregate()函数代码。一旦越来越多的统计功能添加进来之后，这个函数的代码量会持续增加，可读性、可维护性就变差了。因此，我们需要在版本2中对其进行重构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Aggregator {</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    if (count != 0) {</span></span>
<span class="line"><span>      int idx999 = (int)(count * 0.999);</span></span>
<span class="line"><span>      int idx99 = (int)(count * 0.99);</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p><strong>我们再来看一下ConsoleReporter和EmailReporter这两个类存在的问题。</strong></p><p>ConsoleReporter和EmailReporter两个类中存在代码重复问题。在这两个类中，从数据库中取数据、做统计的逻辑都是相同的，可以抽取出来复用，否则就违反了DRY原则。</p><p>整个类负责的事情比较多，不相干的逻辑糅合在里面，职责不够单一。特别是显示部分的代码可能会比较复杂（比如Email的显示方式），最好能将这部分显示逻辑剥离出来，设计成一个独立的类。</p><p>除此之外，因为代码中涉及线程操作，并且调用了Aggregator的静态函数，所以代码的可测试性也有待提高。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ConsoleReporter {</span></span>
<span class="line"><span>  private MetricsStorage metricsStorage;</span></span>
<span class="line"><span>  private ScheduledExecutorService executor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ConsoleReporter(MetricsStorage metricsStorage) {</span></span>
<span class="line"><span>    this.metricsStorage = metricsStorage;</span></span>
<span class="line"><span>    this.executor = Executors.newSingleThreadScheduledExecutor();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void startRepeatedReport(long periodInSeconds, long durationInSeconds) {</span></span>
<span class="line"><span>    executor.scheduleAtFixedRate(new Runnable() {</span></span>
<span class="line"><span>      &amp;#64;Override</span></span>
<span class="line"><span>      public void run() {</span></span>
<span class="line"><span>        long durationInMillis = durationInSeconds * 1000;</span></span>
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
<span class="line"><span>        System.out.println(&quot;Time Span: [&quot; + startTimeInMillis + &quot;, &quot; + endTimeInMillis + &quot;]&quot;);</span></span>
<span class="line"><span>        Gson gson = new Gson();</span></span>
<span class="line"><span>        System.out.println(gson.toJson(stats));</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }, 0, periodInSeconds, TimeUnit.SECONDS);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="针对版本1的问题进行重构" tabindex="-1">针对版本1的问题进行重构 <a class="header-anchor" href="#针对版本1的问题进行重构" aria-label="Permalink to &quot;针对版本1的问题进行重构&quot;">​</a></h2><p>Aggregator类和ConsoleReporter、EmailReporter类主要负责统计显示的工作。在第26节中，我们提到，如果我们把统计显示所要完成的功能逻辑细分一下，主要包含下面4点：</p><ol><li>根据给定的时间区间，从数据库中拉取数据；</li><li>根据原始数据，计算得到统计数据；</li><li>将统计数据显示到终端（命令行或邮件）；</li><li>定时触发以上三个过程的执行。</li></ol><p>之前的划分方法是将所有的逻辑都放到ConsoleReporter和EmailReporter这两个上帝类中，而Aggregator只是一个包含静态方法的工具类。这样的划分方法存在前面提到的一些问题，我们需要对其进行重新划分。</p><p>面向对象设计中的最后一步是组装类并提供执行入口，所以，组装前三部分逻辑的上帝类是必须要有的。我们可以将上帝类做的很轻量级，把核心逻辑都剥离出去，形成独立的类，上帝类只负责组装类和串联执行流程。这样做的好处是，代码结构更加清晰，底层核心逻辑更容易被复用。按照这个设计思路，具体的重构工作包含以下4个方面。</p><ul><li>第1个逻辑：根据给定时间区间，从数据库中拉取数据。这部分逻辑已经被封装在MetricsStorage类中了，所以这部分不需要处理。</li><li>第2个逻辑：根据原始数据，计算得到统计数据。我们可以将这部分逻辑移动到Aggregator类中。这样Aggregator类就不仅仅是只包含统计方法的工具类了。按照这个思路，重构之后的代码如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Aggregator {</span></span>
<span class="line"><span>  public Map&amp;lt;String, RequestStat&amp;gt; aggregate(</span></span>
<span class="line"><span>          Map&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; requestInfos, long durationInMillis) {</span></span>
<span class="line"><span>    Map&amp;lt;String, RequestStat&amp;gt; requestStats = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    for (Map.Entry&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; entry : requestInfos.entrySet()) {</span></span>
<span class="line"><span>      String apiName = entry.getKey();</span></span>
<span class="line"><span>      List&amp;lt;RequestInfo&amp;gt; requestInfosPerApi = entry.getValue();</span></span>
<span class="line"><span>      RequestStat requestStat = doAggregate(requestInfosPerApi, durationInMillis);</span></span>
<span class="line"><span>      requestStats.put(apiName, requestStat);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return requestStats;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private RequestStat doAggregate(List&amp;lt;RequestInfo&amp;gt; requestInfos, long durationInMillis) {</span></span>
<span class="line"><span>    List&amp;lt;Double&amp;gt; respTimes = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    for (RequestInfo requestInfo : requestInfos) {</span></span>
<span class="line"><span>      double respTime = requestInfo.getResponseTime();</span></span>
<span class="line"><span>      respTimes.add(respTime);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    RequestStat requestStat = new RequestStat();</span></span>
<span class="line"><span>    requestStat.setMaxResponseTime(max(respTimes));</span></span>
<span class="line"><span>    requestStat.setMinResponseTime(min(respTimes));</span></span>
<span class="line"><span>    requestStat.setAvgResponseTime(avg(respTimes));</span></span>
<span class="line"><span>    requestStat.setP999ResponseTime(percentile999(respTimes));</span></span>
<span class="line"><span>    requestStat.setP99ResponseTime(percentile99(respTimes));</span></span>
<span class="line"><span>    requestStat.setCount(respTimes.size());</span></span>
<span class="line"><span>    requestStat.setTps((long) tps(respTimes.size(), durationInMillis/1000));</span></span>
<span class="line"><span>    return requestStat;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 以下的函数的代码实现均省略...</span></span>
<span class="line"><span>  private double max(List&amp;lt;Double&amp;gt; dataset) {}</span></span>
<span class="line"><span>  private double min(List&amp;lt;Double&amp;gt; dataset) {}</span></span>
<span class="line"><span>  private double avg(List&amp;lt;Double&amp;gt; dataset) {}</span></span>
<span class="line"><span>  private double tps(int count, double duration) {}</span></span>
<span class="line"><span>  private double percentile999(List&amp;lt;Double&amp;gt; dataset) {}</span></span>
<span class="line"><span>  private double percentile99(List&amp;lt;Double&amp;gt; dataset) {}</span></span>
<span class="line"><span>  private double percentile(List&amp;lt;Double&amp;gt; dataset, double ratio) {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>第3个逻辑：将统计数据显示到终端。我们将这部分逻辑剥离出来，设计成两个类：ConsoleViewer类和EmailViewer类，分别负责将统计结果显示到命令行和邮件中。具体的代码实现如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface StatViewer {</span></span>
<span class="line"><span>  void output(Map&amp;lt;String, RequestStat&amp;gt; requestStats, long startTimeInMillis, long endTimeInMills);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ConsoleViewer implements StatViewer {</span></span>
<span class="line"><span>  public void output(</span></span>
<span class="line"><span>          Map&amp;lt;String, RequestStat&amp;gt; requestStats, long startTimeInMillis, long endTimeInMills) {</span></span>
<span class="line"><span>    System.out.println(&quot;Time Span: [&quot; + startTimeInMillis + &quot;, &quot; + endTimeInMills + &quot;]&quot;);</span></span>
<span class="line"><span>    Gson gson = new Gson();</span></span>
<span class="line"><span>    System.out.println(gson.toJson(requestStats));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class EmailViewer implements StatViewer {</span></span>
<span class="line"><span>  private EmailSender emailSender;</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; toAddresses = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public EmailViewer() {</span></span>
<span class="line"><span>    this.emailSender = new EmailSender(/*省略参数*/);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public EmailViewer(EmailSender emailSender) {</span></span>
<span class="line"><span>    this.emailSender = emailSender;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addToAddress(String address) {</span></span>
<span class="line"><span>    toAddresses.add(address);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void output(</span></span>
<span class="line"><span>          Map&amp;lt;String, RequestStat&amp;gt; requestStats, long startTimeInMillis, long endTimeInMills) {</span></span>
<span class="line"><span>    // format the requestStats to HTML style.</span></span>
<span class="line"><span>    // send it to email toAddresses.</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>第4个逻辑：组装类并定时触发执行统计显示。在将核心逻辑剥离出来之后，这个类的代码变得更加简洁、清晰，只负责组装各个类（MetricsStorage、Aggegrator、StatViewer）来完成整个工作流程。重构之后的代码如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ConsoleReporter {</span></span>
<span class="line"><span>  private MetricsStorage metricsStorage;</span></span>
<span class="line"><span>  private Aggregator aggregator;</span></span>
<span class="line"><span>  private StatViewer viewer;</span></span>
<span class="line"><span>  private ScheduledExecutorService executor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ConsoleReporter(MetricsStorage metricsStorage, Aggregator aggregator, StatViewer viewer) {</span></span>
<span class="line"><span>    this.metricsStorage = metricsStorage;</span></span>
<span class="line"><span>    this.aggregator = aggregator;</span></span>
<span class="line"><span>    this.viewer = viewer;</span></span>
<span class="line"><span>    this.executor = Executors.newSingleThreadScheduledExecutor();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void startRepeatedReport(long periodInSeconds, long durationInSeconds) {</span></span>
<span class="line"><span>    executor.scheduleAtFixedRate(new Runnable() {</span></span>
<span class="line"><span>      &amp;#64;Override</span></span>
<span class="line"><span>      public void run() {</span></span>
<span class="line"><span>        long durationInMillis = durationInSeconds * 1000;</span></span>
<span class="line"><span>        long endTimeInMillis = System.currentTimeMillis();</span></span>
<span class="line"><span>        long startTimeInMillis = endTimeInMillis - durationInMillis;</span></span>
<span class="line"><span>        Map&amp;lt;String, List&amp;lt;RequestInfo&amp;gt;&amp;gt; requestInfos =</span></span>
<span class="line"><span>                metricsStorage.getRequestInfos(startTimeInMillis, endTimeInMillis);</span></span>
<span class="line"><span>        Map&amp;lt;String, RequestStat&amp;gt; requestStats = aggregator.aggregate(requestInfos, durationInMillis);</span></span>
<span class="line"><span>        viewer.output(requestStats, startTimeInMillis, endTimeInMillis);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }, 0L, periodInSeconds, TimeUnit.SECONDS);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class EmailReporter {</span></span>
<span class="line"><span>  private static final Long DAY_HOURS_IN_SECONDS = 86400L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private MetricsStorage metricsStorage;</span></span>
<span class="line"><span>  private Aggregator aggregator;</span></span>
<span class="line"><span>  private StatViewer viewer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public EmailReporter(MetricsStorage metricsStorage, Aggregator aggregator, StatViewer viewer) {</span></span>
<span class="line"><span>    this.metricsStorage = metricsStorage;</span></span>
<span class="line"><span>    this.aggregator = aggregator;</span></span>
<span class="line"><span>    this.viewer = viewer;</span></span>
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
<span class="line"><span>        Map&amp;lt;String, RequestStat&amp;gt; stats = aggregator.aggregate(requestInfos, durationInMillis);</span></span>
<span class="line"><span>        viewer.output(stats, startTimeInMillis, endTimeInMillis);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }, firstTime, DAY_HOURS_IN_SECONDS * 1000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>经过上面的重构之后，我们现在再来看一下，现在框架该如何来使用。</p><p>我们需要在应用启动的时候，创建好ConsoleReporter对象，并且调用它的startRepeatedReport()函数，来启动定时统计并输出数据到终端。同理，我们还需要创建好EmailReporter对象，并且调用它的startDailyReport()函数，来启动每日统计并输出数据到制定邮件地址。我们通过MetricsCollector类来收集接口的访问情况，这部分收集代码会跟业务逻辑代码耦合在一起，或者统一放到类似Spring AOP的切面中完成。具体的使用代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class PerfCounterTest {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    MetricsStorage storage = new RedisMetricsStorage();</span></span>
<span class="line"><span>    Aggregator aggregator = new Aggregator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 定时触发统计并将结果显示到终端</span></span>
<span class="line"><span>    ConsoleViewer consoleViewer = new ConsoleViewer();</span></span>
<span class="line"><span>    ConsoleReporter consoleReporter = new ConsoleReporter(storage, aggregator, consoleViewer);</span></span>
<span class="line"><span>    consoleReporter.startRepeatedReport(60, 60);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 定时触发统计并将结果输出到邮件</span></span>
<span class="line"><span>    EmailViewer emailViewer = new EmailViewer();</span></span>
<span class="line"><span>    emailViewer.addToAddress(&quot;wangzheng&amp;#64;xzg.com&quot;);</span></span>
<span class="line"><span>    EmailReporter emailReporter = new EmailReporter(storage, aggregator, emailViewer);</span></span>
<span class="line"><span>    emailReporter.startDailyReport();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 收集接口访问数据</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h2 id="review版本2的设计与实现" tabindex="-1">Review版本2的设计与实现 <a class="header-anchor" href="#review版本2的设计与实现" aria-label="Permalink to &quot;Review版本2的设计与实现&quot;">​</a></h2><p>现在，我们Review一下，针对版本1重构之后，版本2的设计与实现。</p><p>重构之后，MetricsStorage负责存储，Aggregator负责统计，StatViewer（ConsoleViewer、EmailViewer）负责显示，三个类各司其职。ConsoleReporter和EmailReporter负责组装这三个类，将获取原始数据、聚合统计、显示统计结果到终端这三个阶段的工作串联起来，定时触发执行。</p><p>除此之外，MetricsStorage、Aggregator、StatViewer三个类的设计也符合迪米特法则。它们只与跟自己有直接相关的数据进行交互。MetricsStorage输出的是RequestInfo相关数据。Aggregator类输入的是RequestInfo数据，输出的是RequestStat数据。StatViewer输入的是RequestStat数据。</p><p>针对版本1和版本2，我画了一张它们的类之间依赖关系的对比图，如下所示。从图中，我们可以看出，重构之后的代码结构更加清晰、有条理。这也印证了之前提到的：面向对象设计和实现要做的事情，就是把合适的代码放到合适的类中。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/193221/1303d16f75c7266cef9105f540c54834.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/193221/1303d16f75c7266cef9105f540c54834.jpg" alt=""></a></p><p>刚刚我们分析了代码的整体结构和依赖关系，我们现在再来具体看每个类的设计。</p><p>Aggregator类从一个只包含一个静态函数的工具类，变成了一个普通的聚合统计类。现在，我们可以通过依赖注入的方式，将其组装进ConsoleReporter和EmailReporter类中，这样就更加容易编写单元测试。</p><p>Aggregator类在重构前，所有的逻辑都集中在aggregate()函数内，代码行数较多，代码的可读性和可维护性较差。在重构之后，我们将每个统计逻辑拆分成独立的函数，aggregate()函数变得比较单薄，可读性提高了。尽管我们要添加新的统计功能，还是要修改aggregate()函数，但现在的aggregate()函数代码行数很少，结构非常清晰，修改起来更加容易，可维护性提高。</p><p>目前来看，Aggregator的设计还算合理。但是，如果随着更多的统计功能的加入，Aggregator类的代码会越来越多。这个时候，我们可以将统计函数剥离出来，设计成独立的类，以解决Aggregator类的无限膨胀问题。不过，暂时来说没有必要这么做，毕竟将每个统计函数独立成类，会增加类的个数，也会影响到代码的可读性和可维护性。</p><p>ConsoleReporter和EmailReporter经过重构之后，代码的重复问题变小了，但仍然没有完全解决。尽管这两个类不再调用Aggregator的静态方法，但因为涉及多线程和时间相关的计算，代码的测试性仍然不够好。这两个问题我们留在下一节课中解决，你也可以留言说说的你解决方案。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要掌握的重点内容。</p><p>面向对象设计中的最后一步是组装类并提供执行入口，也就是上帝类要做的事情。这个上帝类是没办法去掉的，但我们可以将上帝类做得很轻量级，把核心逻辑都剥离出去，下沉形成独立的类。上帝类只负责组装类和串联执行流程。这样做的好处是，代码结构更加清晰，底层核心逻辑更容易被复用。</p><p>面向对象设计和实现要做的事情，就是把合适的代码放到合适的类中。当我们要实现某个功能的时候，不管如何设计，所需要编写的代码量基本上是一样的，唯一的区别就是如何将这些代码划分到不同的类中。不同的人有不同的划分方法，对应得到的代码结构（比如类与类之间交互等）也不尽相同。</p><p>好的设计一定是结构清晰、有条理、逻辑性强，看起来一目了然，读完之后常常有一种原来如此的感觉。差的设计往往逻辑、代码乱塞一通，没有什么设计思路可言，看起来莫名其妙，读完之后一头雾水。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><ol><li>今天我们提到，重构之后的ConsoleReporter和EmailReporter仍然存在代码重复和可测试性差的问题，你可以思考一下，应该如何解决呢？</li><li>从上面的使用示例中，我们可以看出，框架易用性有待提高：ConsoleReporter和EmailReporter的创建过程比较复杂，使用者需要正确地组装各种类才行。对于框架的易用性，你有没有什么办法改善一下呢？</li></ol><p>欢迎在留言区写下你的思考和想法，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,50)])])}const d=n(l,[["render",t]]);export{m as __pageData,d as default};
