import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"35 | Facebook游戏实时流处理Beam Pipeline实战（上）","description":"","frontmatter":{},"headers":[{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"大规模数据处理实战/35-Facebook游戏实时流处理BeamPipeline实战（上）.md","filePath":"大规模数据处理实战/35-Facebook游戏实时流处理BeamPipeline实战（上）.md","lastUpdated":1779819497000}'),l={name:"大规模数据处理实战/35-Facebook游戏实时流处理BeamPipeline实战（上）.md"};function t(i,n,o,r,c,g){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_35-facebook游戏实时流处理beam-pipeline实战-上" tabindex="-1">35 | Facebook游戏实时流处理Beam Pipeline实战（上） <a class="header-anchor" href="#_35-facebook游戏实时流处理beam-pipeline实战-上" aria-label="Permalink to &quot;35 | Facebook游戏实时流处理Beam Pipeline实战（上）&quot;">​</a></h1><p>你好，我是蔡元楠。</p><p>今天我要与你分享的主题是“Facebook游戏实时流处理Beam Pipeline实战”。</p><p>Facebook这个社交平台我相信你一定早有耳闻。它除了能够让用户发送消息给好友，分享自己的动态图片和视频之外，还通过自身的App Center管理着各式各样的小游戏。许多游戏开发商借助Facebook的好友邀请机制让自己的App火了一把。</p><p>曾经有一段时间，在Facebook上有一款名为糖果传奇（Candy Crush Saga）的游戏风靡了整个北美。各个年龄层的玩家都会在空闲的时间拿出手机，过五关斩六将，希望尽快突破更多的关卡，并且获得高分。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%A4%A7%E8%A7%84%E6%A8%A1%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E5%AE%9E%E6%88%98/images/107529/01d81679dc22a2049f81de1622532d68.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%A4%A7%E8%A7%84%E6%A8%A1%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E5%AE%9E%E6%88%98/images/107529/01d81679dc22a2049f81de1622532d68.png" alt=""></a></p><p>当然了，除了消除游戏本身带来的乐趣以外，可以在Facebook里和自己的好友进行积分排名比拼也是另外一个能吸引用户的地方。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%A4%A7%E8%A7%84%E6%A8%A1%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E5%AE%9E%E6%88%98/images/107529/971c3a60862a448bedfc0676103bf36e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%A4%A7%E8%A7%84%E6%A8%A1%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E5%AE%9E%E6%88%98/images/107529/971c3a60862a448bedfc0676103bf36e.png" alt=""></a></p><p>想要一个类似Facebook这样的好友间积分排行榜，你可以有很多种实现方式以及各种优化方法。那么，如果我们要利用Apache Beam的话，该怎样实现一个类似的游戏积分排行榜呢？</p><p>今天我就来和你一起研究，要如何利用Apache Beam的数据流水线来实现一个我们自定义的简单游戏积分排行榜。</p><p>为了简化整个游戏积分排行榜案例的说明，我们先来做几个方面的假设：</p><ul><li><strong>面向的群体</strong>：游戏积分排行榜针对的是全局每位用户以及每一个关卡，我们不需要担心如何在Beam的数据流水线中优化每个用户自身的好友积分列表。</li><li><strong>更新时间</strong>：为了保持用户的粘性，我们设定这个游戏积分排行榜的数据每隔一周就会更新一次。也就是说如果一位用户在2019年7月15日成功通关了一次游戏并且分数是这周内自身的最高分，那么这次的最高分数将一直留在2019年7月15日至2019年7月21日这周的排行榜中。但是到了2019年7月22日后，这个分数将不会再出现，需要用户重新通关这个关卡后分数才会重新出现在新的一周游戏积分排行榜中。</li><li><strong>积分排位</strong>：游戏积分排行榜需要显示出这个关卡中得分最高的前100位用户。</li><li><strong>输入数据</strong>：每次用户通关后，这个App都会将用户自身的ID，通关游戏的时间（也就是事件时间）还有分数以CSV格式上传到服务器中，每个用户的游戏积分数据都可以从Google Cloud Bigtable中读取出来。</li><li><strong>输出数据</strong>：最终这个游戏积分排行榜结果可以从一个文件中获得。也就是说，我们的Beam数据流水线需要将最终结果写入文件中。</li></ul><p>有了这些假设，我们就一起来由浅入深地看看有哪些执行方案。</p><p>正如上一讲中所说，如果可以用简单的方法解决战斗，我们当然要避免将问题复杂化了。一种比较直观的做法就是使用crontab定时执行一个Beam数据流水线，将每周需要进行计算排名的开始时间点和结束时间点传入数据流水线中，过滤掉所有事件时间不在这个时间范围内的数据。</p><p>那么，具体要怎么做呢？</p><p>首先，我们先要定义一个类，来保存我们之前假设好用户上传的信息。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class UserScoreInfo {</span></span>
<span class="line"><span>    String userId;</span></span>
<span class="line"><span>    Double score;</span></span>
<span class="line"><span>    Long eventTimestamp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public UserScoreInfo(String userId, Double score, Long eventTimestamp) {</span></span>
<span class="line"><span>      this.userId = userId;</span></span>
<span class="line"><span>      this.score = score;</span></span>
<span class="line"><span>      this.eventTimestamp = eventTimestamp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getUserId() {</span></span>
<span class="line"><span>      return this.userId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Double getScore() {</span></span>
<span class="line"><span>      return this.score;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Long getEventTimestamp() {</span></span>
<span class="line"><span>      return this.eventTimestamp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这个类十分简单，构造函数需要传入的是用户ID、游戏通关时的积分还有通关时间。</p><p>有了这个类之后，整个数据流水线的逻辑就可以围绕着这个类来处理，步骤大致如下：</p><ol><li>从Google Cloud Bigtable中读取保存用户通关积分等信息的所有Bigtable Row出来，得到PCollection。</li><li>将PCollection转换成我们定义好的类，成为PCollection。</li><li>根据我们传入的开始边界时间和结束边界时间过滤掉不属于这一周里数据，得到有效时间内的PCollection。</li><li>将PCollection转换成PCollection&lt;​KV&lt;​String, UserScoreInfo&gt;&gt;，KV里面的Key就用户ID。</li><li>自定义一个Composite Transform，其中包括三个步骤：利用Top Transform将每一个用户的最高分率选出来，得到PCollection&lt;​KV&lt;​String, List&gt;&gt;；将PCollection&lt;​KV&lt;​String, List&gt;&gt;转换成为PCollection&lt;​KV&lt;​String, UserScoreInfo&gt;&gt;；再次利用Top Transform将PCollection&lt;​KV&lt;​String, UserScoreInfo&gt;&gt;中前100名高分用户筛选出来。</li><li>将结果写入CSV格式的文件中，格式为“用户ID，分数”。</li></ol><p>在上面所描述的步骤中，第5步出现了一个叫Composite Transform的概念。</p><p>那么，什么是Composite Transform呢？其实Composite Transform并不是指一个具体的Transform，而是指我们可以将多个不同的Transforms嵌套进一个类中，使得数据流水线更加模块化。具体做法是继承PTransform这个类，并且实现expand抽象方法来实现的。</p><p>用我们实现过的WordsCount来举例，我们可以将整个WordsCount数据流水线模块化成一个Composite Transform，示例如下：</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static class WordsCount extends PTransform&lt;​PCollection&lt;​String&gt;,</span></span>
<span class="line"><span>      PCollection&lt;​KV&lt;​String, Long&gt;&gt;&gt; {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public PCollection&lt;​KV&lt;​String, Long&gt;&gt; expand(PCollection&lt;​String&gt; lines) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      PCollection&lt;​String&gt; words = lines.apply(</span></span>
<span class="line"><span>          ParDo.of(new ExtractWordsFn()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      PCollection&lt;​KV&lt;​String, Long&gt;&gt; wordsCount =</span></span>
<span class="line"><span>          words.apply(Count.&lt;​String&gt;perElement());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      return wordsCount;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>在上面这个例子中，输入的参数是每一行字符串PCollection，输出结果是每一个单词对应出现的次数PCollection&lt;​KV&lt;​String, Long&gt;。在实现expand这个抽象方法的时候，里面总共嵌套了两个不同的Transform，分别是一个ParDo用来提取每一行的单词，还有一个Count Transform统计单词出现的次数。</p><p>所以在第5步中，我们也可以自己定义一个ExtractUserAndScore的Composite Transform来实现上面所描述的多个不同的Transforms。</p><p>好了，为了事先知道游戏积分排行榜中开始的边界时间和结束的边界时间，我们还需要自己实现一个Options接口。方法是继承PipelineOptions这个接口，具体如下所示：</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Options extends PipelineOptions {</span></span>
<span class="line"><span>    @Default.String(&quot;1970-01-01-00-00&quot;)</span></span>
<span class="line"><span>    String getStartBoundary();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setStartBoundary(String value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Default.String(&quot;2100-01-01-00-00&quot;)</span></span>
<span class="line"><span>    String getEndBoundary();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setEndBoundary(String value);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这样开始的边界时间和结束的边界时间就都可以通过Pipeline option的参数传入。</p><p>例如，我们想要得到2019年7月15日至2019年7月21日这周的排行榜，那在运行数据流水线的时候，参数就可以按照“–startBoundary=2019-07-15-00-00 --etartBoundary=2019-07-21-00-00”传入了。</p><p>整个数据流水线的大致逻辑如下：</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final class LeaderBoard {</span></span>
<span class="line"><span>  static class UserScoreInfo {</span></span>
<span class="line"><span>    String userId;</span></span>
<span class="line"><span>    Double score;</span></span>
<span class="line"><span>    Long eventTimestamp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public UserScoreInfo(String userId, Double score, Long eventTimestamp) {</span></span>
<span class="line"><span>      this.userId = userId;</span></span>
<span class="line"><span>      this.score = score;</span></span>
<span class="line"><span>      this.eventTimestamp = eventTimestamp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getUserId() {</span></span>
<span class="line"><span>      return this.userId;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Double getScore() {</span></span>
<span class="line"><span>      return this.score;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Long getEventTimestamp() {</span></span>
<span class="line"><span>      return this.eventTimestamp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static DateTimeFormatter formatter =</span></span>
<span class="line"><span>      DateTimeFormat.forPattern(&quot;yyyy-MM-dd-HH-mm&quot;)</span></span>
<span class="line"><span>          .withZone(DateTimeZone.forTimeZone(TimeZone.getTimeZone(&quot;Asia/Shanghai&quot;)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    Options options = PipelineOptionsFactory.fromArgs(args).withValidation().as(Options.class);</span></span>
<span class="line"><span>    Pipeline pipeline = Pipeline.create(options);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    final Instant startBoundary = new Instant(formatter.parseMillis(options.getStartBoundary()));</span></span>
<span class="line"><span>    final Instant endBoundary = new Instant(formatter.parseMillis(options.getEndBoundary()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pipeline</span></span>
<span class="line"><span>        .apply(</span></span>
<span class="line"><span>            BigtableIO.read()</span></span>
<span class="line"><span>                .withProjectId(projectId)</span></span>
<span class="line"><span>                .withInstanceId(instanceId)</span></span>
<span class="line"><span>                .withTableId(&quot;ScoreTable&quot;))</span></span>
<span class="line"><span>        .apply(&quot;ConvertUserScoreInfo&quot;, ParDo.of(new ConvertUserScoreInfoFn()))</span></span>
<span class="line"><span>        .apply(</span></span>
<span class="line"><span>            &quot;FilterStartTime&quot;,</span></span>
<span class="line"><span>            Filter.by((UserScoreInfo info) -&gt; info.getTimestamp() &gt; startBoundary.getMillis()))</span></span>
<span class="line"><span>        .apply(</span></span>
<span class="line"><span>            &quot;FilterEndTime&quot;,</span></span>
<span class="line"><span>            Filter.by((UserScoreInfo info) -&gt; info.getTimestamp() &lt; endBoundary.getMillis()))</span></span>
<span class="line"><span>        .apply(&quot;RetrieveTop100Players&quot;, new ExtractUserAndScore())</span></span>
<span class="line"><span>        .apply(</span></span>
<span class="line"><span>            FileIO.&lt;​List&lt;​String&gt;&gt;write()</span></span>
<span class="line"><span>                .via(</span></span>
<span class="line"><span>                    new CSVSink(Arrays.asList(&quot;userId&quot;, &quot;score&quot;))</span></span>
<span class="line"><span>                        .to(&quot;filepath&quot;)</span></span>
<span class="line"><span>                        .withPrefix(&quot;scoreboard&quot;)</span></span>
<span class="line"><span>                        .withSuffix(&quot;.csv&quot;)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pipeline.run().waitUntilFinish();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，ConvertUserScoreInfoFn这个Transform代表着第2步转换操作，数据流水线中两个Filter Transform分别代表着第3和第4步。第5步“获得最高分的前100位用户”是由ExtractUserAndScore这个Composite Transform来完成的。</p><p>你可以看到，不算上各种具体Transform的实现，整个数据流水线的逻辑框架大概用60行代码就可以表示出来。</p><p>虽然这个批处理的方法可以用简单的逻辑得到最后我们想要的结果，不过其实它还存在着不少的不足之处。</p><p>因为我们的批处理数据流水线使用crontab来定时运行，所以“运行数据流水线的时间间隔”以及“完成数据流水线”这之间的时间之和会给最终结果带来延迟。</p><p>比如，我们定义crontab每隔30分钟来运行一次数据流水线，这个数据流水线大概需要5分钟完成，那在这35分钟期间用户上传到服务器的分数是无法反应到积分排行榜中的。</p><p>那么，有没有能够缩小延时的办法呢？</p><p>当然有，答案就是将输入数据作为无边界数据集读取进来，进行实时的数据处理。在这里面我们会运用的到第23讲所讲述到的窗口（Window）、触发器（Trigger）和累加模式（Accumulation）的概念。</p><p>我将在下一讲中，与你具体分析怎样运用Beam的数据流水线实现一个实时输出的游戏积分排行榜。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天我们一起展开讨论了自己实现一个简易游戏积分排行榜的过程。可以知道的是，我们可以使用Beam的数据流水线来完成这一任务。而在Beam数据流水线的实现方式中，我们又可以分成批处理的实现方式和即将在下一讲中展开讨论的实时流处理的方式。批处理虽然简单，但是存在着延时性高、无法快速更新积分排行榜的缺点。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在今天这一讲的最后，我提示了你在实时流处理中需要用到窗口、触发器和累加模式。那我们就先来做个预热，思考一下，在流处理中你会对这三种概念赋予什么值呢？</p><p>欢迎你把答案写在留言区，与我和其他同学一起讨论。如果你觉得有所收获，也欢迎把文章分享给你的朋友。</p>`,49)])])}const m=s(l,[["render",t]]);export{d as __pageData,m as default};
