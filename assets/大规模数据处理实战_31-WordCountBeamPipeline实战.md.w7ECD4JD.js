import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"31 | WordCount Beam Pipeline实战","description":"","frontmatter":{},"headers":[{"level":2,"title":"创建Pipeline","slug":"创建pipeline","link":"#创建pipeline","children":[]},{"level":2,"title":"应用Transform","slug":"应用transform","link":"#应用transform","children":[]},{"level":2,"title":"运行Pipeline","slug":"运行pipeline","link":"#运行pipeline","children":[]},{"level":2,"title":"改进代码的建议","slug":"改进代码的建议","link":"#改进代码的建议","children":[{"level":3,"title":"编写独立的DoFn","slug":"编写独立的dofn","link":"#编写独立的dofn","children":[]},{"level":3,"title":"创建PTransform合并相关联的Transform","slug":"创建ptransform合并相关联的transform","link":"#创建ptransform合并相关联的transform","children":[]},{"level":3,"title":"参数化PipelineOptions","slug":"参数化pipelineoptions","link":"#参数化pipelineoptions","children":[]},{"level":3,"title":"DoFn和PTransform的单元测试","slug":"dofn和ptransform的单元测试","link":"#dofn和ptransform的单元测试","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"大规模数据处理实战/31-WordCountBeamPipeline实战.md","filePath":"大规模数据处理实战/31-WordCountBeamPipeline实战.md","lastUpdated":1779819497000}'),t={name:"大规模数据处理实战/31-WordCountBeamPipeline实战.md"};function i(l,n,o,r,c,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_31-wordcount-beam-pipeline实战" tabindex="-1">31 | WordCount Beam Pipeline实战 <a class="header-anchor" href="#_31-wordcount-beam-pipeline实战" aria-label="Permalink to &quot;31 | WordCount Beam Pipeline实战&quot;">​</a></h1><p>你好，我是蔡元楠。</p><p>今天我要与你分享的主题是“WordCount Beam Pipeline实战”。</p><p>前面我们已经学习了Beam的基础数据结构PCollection，基本数据转换操作Transform，还有Pipeline等技术。你一定跃跃欲试，想要在实际项目中使用了。这一讲我们就一起学习一下怎样用Beam解决数据处理领域的教科书级案例——WordCount。</p><p>WordCount你一定不陌生，在 <a href="https://time.geekbang.org/column/article/97658" target="_blank" rel="noreferrer">第18讲</a> 中，我们就已经接触过了。WordCount问题是起源于MapReduce时代就广泛使用的案例。顾名思义，WordCount想要解决的问题是统计一个文本库中的词频。</p><p>比如，你可以用WordCount找出莎士比亚最喜欢使用的单词，那么你的输入是莎士比亚全集，输出就是每个单词出现的次数。举个例子，比如这一段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HAMLET</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ACT I</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SCENE I	Elsinore. A platform before the castle.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	[FRANCISCO at his post. Enter to him BERNARDO]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BERNARDO	Who&#39;s there?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FRANCISCO	Nay, answer me: stand, and unfold yourself.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BERNARDO	Long live the king!</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FRANCISCO	Bernardo?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BERNARDO	He.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FRANCISCO	You come most carefully upon your hour.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BERNARDO	&#39;Tis now struck twelve; get thee to bed, Francisco.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FRANCISCO	For this relief much thanks: &#39;tis bitter cold,</span></span>
<span class="line"><span>	And I am sick at heart.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BERNARDO	Have you had quiet guard?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FRANCISCO	Not a mouse stirring.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BERNARDO	Well, good night.</span></span>
<span class="line"><span>	If you do meet Horatio and Marcellus,</span></span>
<span class="line"><span>	The rivals of my watch, bid them make haste.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FRANCISCO	I think I hear them. Stand, ho! Who&#39;s there?</span></span></code></pre></div><p>在这个文本库中，我们用“the: 数字”表示the出现了几次，数字就是单词出现的次数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>The: 3</span></span>
<span class="line"><span>And: 3</span></span>
<span class="line"><span>Him: 1</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>那么我们怎样在Beam中处理这个问题呢？结合前面所学的知识，我们可以把Pipeline分为这样几步：</p><ol><li>用Pipeline IO读取文本库（参考 <a href="https://time.geekbang.org/column/article/102578" target="_blank" rel="noreferrer">第27讲</a>）；</li><li>用Transform对文本进行分词和词频统计操作（参考 <a href="https://time.geekbang.org/column/article/101735" target="_blank" rel="noreferrer">第25讲</a>）；</li><li>用Pipeline IO输出结果（参考 <a href="https://time.geekbang.org/column/article/102578" target="_blank" rel="noreferrer">第27讲</a>）；</li><li>所有的步骤会被打包进一个Beam Pipeline（参考 <a href="https://time.geekbang.org/column/article/102182" target="_blank" rel="noreferrer">第26讲</a>）。</li></ol><p>整个过程就如同下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%A4%A7%E8%A7%84%E6%A8%A1%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E5%AE%9E%E6%88%98/images/105324/c6b63574f6005aaa4a6aba366b0a5dcd.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%A4%A7%E8%A7%84%E6%A8%A1%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E5%AE%9E%E6%88%98/images/105324/c6b63574f6005aaa4a6aba366b0a5dcd.jpg" alt=""></a></p><h2 id="创建pipeline" tabindex="-1">创建Pipeline <a class="header-anchor" href="#创建pipeline" aria-label="Permalink to &quot;创建Pipeline&quot;">​</a></h2><p>首先，我们先用代码创建一个PipelineOptions的实例。PipelineOptions能够让我们对Pipeline进行必要的配置，比如配置执行程序的Runner，和Runner所需要的参数。我们在这里先采用默认配置。</p><p>记得第30讲中我们讲过，Beam Pipeline可以配置在不同的Runner上跑，比如SparkRunner，FlinkRunner。如果PipelineOptions不配置的情况下，默认的就是DirectRunner，也就是说会在本机执行。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PipelineOptions options = PipelineOptionsFactory.create();</span></span></code></pre></div><p>接下来，我们就可以用这个PipelineOptions去创建一个Pipeline了。一个Pipeline实例会去构建一个数据处理流水线所需要的数据处理DAG，以及这个DAG所需要进行的Transform。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Pipeline p = Pipeline.create(options);</span></span></code></pre></div><h2 id="应用transform" tabindex="-1">应用Transform <a class="header-anchor" href="#应用transform" aria-label="Permalink to &quot;应用Transform&quot;">​</a></h2><p>在上面的设计框图中，我们可以看到，我们需要进行好几种Transform。比如TextIO.Read、ParDo、Count去读取数据，操纵数据，以及存储数据。</p><p>每一种Transform都需要一些参数，并且会输出特定的数据。输入和输出往往会用PCollection的数据结构表示。简单回顾一下，PCollection是Beam对于数据集的抽象，表示任意大小、无序的数据，甚至可以是无边界的Streaming数据。</p><p>在我们这个WordCount例子中，我们的Transform依次是这样几个。</p><p>第一个Transform，是先要用TextIO.Read来读取一个外部的莎士比亚文集，生成一个PCollection，包含这个文集里的所有文本行。这个PCollection中的每个元素都是文本中的一行。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PCollection&lt;​String&gt; lines = p.apply(TextIO.read().from(&quot;gs://apache-beam-samples/shakespeare/*&quot;));</span></span></code></pre></div><p>第二个Transform，我们要把文本行中的单词提取出来，也就是做分词（tokenization）。</p><p>这一步的输入PCollection中的每个元素都表示了一行。那么输出呢？输出还是一个PCollection，但是每个元素变成了单词。</p><p>你可以留意一下，我们这里做分词时，用的正则表达式[^\\p{L}]+，意思是非Unicode Letters所以它会按空格或者标点符号等把词分开。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PCollection&lt;​String&gt; words = lines.apply(&quot;ExtractWords&quot;, FlatMapElements</span></span>
<span class="line"><span>        .into(TypeDescriptors.strings())</span></span>
<span class="line"><span>        .via((String word) -&gt; Arrays.asList(word.split(&quot;[^\\\\p{L}]+&quot;))));</span></span></code></pre></div><p>第三个Transform，我们就会使用Beam SDK提供的Count Transform。Count Transform会把任意一个PCollection转换成有key/value的组合，每一个key是原来PCollection中的非重复的元素，value则是元素出现的次数。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PCollection&lt;​KV&lt;​String, Long&gt;&gt; counts = words.apply(Count.&lt;​String&gt;perElement());</span></span></code></pre></div><p>第四个Transform会把刚才的key/value组成的PCollection转换成我们想要的输出格式，方便我们输出词频。因为大部分的时候，我们都是想要把输出存储到另一个文件里的。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PCollection&lt;​String&gt; formatted = counts.apply(&quot;FormatResults&quot;, MapElements</span></span>
<span class="line"><span>    .into(TypeDescriptors.strings())</span></span>
<span class="line"><span>    .via((KV&lt;​String, Long&gt; wordCount) -&gt; wordCount.getKey() + &quot;: &quot; + wordCount.getValue()));</span></span></code></pre></div><p>最后一个Transform就是TextIO.Write用来把最终的PCollection写进文本文档。PCollection中的每一个元素都会被写为文本文件中的独立一行。</p><h2 id="运行pipeline" tabindex="-1">运行Pipeline <a class="header-anchor" href="#运行pipeline" aria-label="Permalink to &quot;运行Pipeline&quot;">​</a></h2><p>调用Pipeline的run()方法会把这个Pipeline所包含的Transform优化并放到你指定的Runner上执行。这里你需要注意，run()方法是异步的，如果你想要同步等待Pipeline的执行结果，需要调用waitUntilFinish()方法。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>p.run().waitUntilFinish();</span></span></code></pre></div><h2 id="改进代码的建议" tabindex="-1">改进代码的建议 <a class="header-anchor" href="#改进代码的建议" aria-label="Permalink to &quot;改进代码的建议&quot;">​</a></h2><p>代码看起来都完成了，不过，我们还可以对代码再做些改进。</p><h3 id="编写独立的dofn" tabindex="-1">编写独立的DoFn <a class="header-anchor" href="#编写独立的dofn" aria-label="Permalink to &quot;编写独立的DoFn&quot;">​</a></h3><p>在上面的示例代码中，我们把Transform都inline地写在了apply()方法里。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>lines.apply(&quot;ExtractWords&quot;, FlatMapElements</span></span>
<span class="line"><span>        .into(TypeDescriptors.strings())</span></span>
<span class="line"><span>        .via((String word) -&gt; Arrays.asList(word.split(&quot;[^\\\\p{L}]+&quot;))));</span></span></code></pre></div><p>但是这样的写法在实际工作中很难维护。</p><p>一是因为真实的业务逻辑往往比较复杂，很难用一两行的代码写清楚，强行写成inline的话可读性非常糟糕。</p><p>二是因为这样inline的Transform几乎不可复用和测试。</p><p>所以，实际工作中，我们更多地会去继承DoFn来实现我们的数据操作。这样每个DoFn我们都可以单独复用和测试。</p><p>接下来，我们看看怎样用用DoFn来实现刚才的分词Transform？</p><p>其实很简单，我们继承DoFn作为我们的子类ExtracrtWordsFn，然后把单词的拆分放在DoFn的processElement成员函数里。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static class ExtractWordsFn extends DoFn&lt;​String, String&gt; {</span></span>
<span class="line"><span>    private final Counter emptyLines = Metrics.counter(ExtractWordsFn.class, &quot;emptyLines&quot;);</span></span>
<span class="line"><span>    private final Distribution lineLenDist =</span></span>
<span class="line"><span>        Metrics.distribution(ExtractWordsFn.class, &quot;lineLenDistro&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @ProcessElement</span></span>
<span class="line"><span>    public void processElement(@Element String element, OutputReceiver&lt;​String&gt; receiver) {</span></span>
<span class="line"><span>      lineLenDist.update(element.length());</span></span>
<span class="line"><span>      if (element.trim().isEmpty()) {</span></span>
<span class="line"><span>        emptyLines.inc();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Split the line into words.</span></span>
<span class="line"><span>      String[] words = element.split(“[^\\\\p{L}]+”, -1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Output each word encountered into the output PCollection.</span></span>
<span class="line"><span>      for (String word : words) {</span></span>
<span class="line"><span>        if (!word.isEmpty()) {</span></span>
<span class="line"><span>          receiver.output(word);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="创建ptransform合并相关联的transform" tabindex="-1">创建PTransform合并相关联的Transform <a class="header-anchor" href="#创建ptransform合并相关联的transform" aria-label="Permalink to &quot;创建PTransform合并相关联的Transform&quot;">​</a></h3><p>PTransform类可以用来整合一些相关联的Transform。</p><p>比如你有一些数据处理的操作包含几个Transform或者ParDo，你可以把他们封装在一个PTransform里。</p><p>我们这里试着把上面的ExtractWordsFn和Count两个Transform封装起来。这样可以对这样一整套数据处理操作复用和测试。当定义PTransform的子类时，它的输入输出类型就是一连串Transform的最初输入和最终输出。那么在这里，输入类型是String，输出类型是KV&lt;​String, Long&gt;。就如同下面的代码一样。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  /**</span></span>
<span class="line"><span>   * A PTransform that converts a PCollection containing lines of text into a PCollection of</span></span>
<span class="line"><span>   * formatted word counts.</span></span>
<span class="line"><span>   *</span></span>
<span class="line"><span>   * &lt;​p&gt;This is a custom composite transform that bundles two transforms (ParDo and</span></span>
<span class="line"><span>   * Count) as a reusable PTransform subclass. Using composite transforms allows for easy reuse,</span></span>
<span class="line"><span>   * modular testing, and an improved monitoring experience.</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class CountWords</span></span>
<span class="line"><span>      extends PTransform&lt;​PCollection&lt;​String&gt;, PCollection&lt;​KV&lt;​String, Long&gt;&gt;&gt; {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public PCollection&lt;​KV&lt;​String, Long&gt;&gt; expand(PCollection&lt;​String&gt; lines) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Convert lines of text into individual words.</span></span>
<span class="line"><span>      PCollection&lt;​String&gt; words = lines.apply(ParDo.of(new ExtractWordsFn()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // Count the number of times each word occurs.</span></span>
<span class="line"><span>      PCollection&lt;​KV&lt;​String, Long&gt;&gt; wordCounts = words.apply(Count.perElement());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      return wordCounts;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="参数化pipelineoptions" tabindex="-1">参数化PipelineOptions <a class="header-anchor" href="#参数化pipelineoptions" aria-label="Permalink to &quot;参数化PipelineOptions&quot;">​</a></h3><p>刚才我们把输入文件的路径和输出文件的路径都写在了代码中。但实际工作中我们很少会这样做。</p><p>因为这些文件的路径往往是运行时才会决定，比如测试环境和生产环境会去操作不同的文件。在真正的实际工作中，我们往往把它们作为命令行参数放在PipelineOptions里面。这就需要去继承PipelineOptions。</p><p>比如，我们创建一个WordCountOptions，把输出文件作为参数output。</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static interface WordCountOptions extends PipelineOptions {</span></span>
<span class="line"><span>    @Description(&quot;Path of the file to write to&quot;)</span></span>
<span class="line"><span>    @Required</span></span>
<span class="line"><span>    String getOutput();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setOutput(String value);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成上面两个方面的改进后，我们最终的数据处理代码会是这个样子：</p><p>Java</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>  WordCountOptions options =</span></span>
<span class="line"><span>        PipelineOptionsFactory.fromArgs(args).withValidation().as(WordCountOptions.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Pipeline p = Pipeline.create(options);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  p.apply(&quot;ReadLines&quot;, TextIO.read().from(options.getInputFile()))</span></span>
<span class="line"><span>        .apply(new CountWords())</span></span>
<span class="line"><span>        .apply(ParDo.of(new FormatAsTextFn()))</span></span>
<span class="line"><span>        .apply(&quot;WriteCounts&quot;, TextIO.write().to(options.getOutput()));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    p.run().waitUntilFinish();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="dofn和ptransform的单元测试" tabindex="-1">DoFn和PTransform的单元测试 <a class="header-anchor" href="#dofn和ptransform的单元测试" aria-label="Permalink to &quot;DoFn和PTransform的单元测试&quot;">​</a></h3><p>如同 <a href="https://time.geekbang.org/column/article/103750" target="_blank" rel="noreferrer">第29讲</a>“如何测试Pipeline”中所讲的那样，我们用PAssert测试Beam Pipeline。具体在我们这个例子中，我一再强调要把数据处理操作封装成DoFn和PTransform，因为它们可以独立地进行测试。</p><p>什么意思呢？比如，ExtractWordsFn我们想要测试它能把一个句子分拆出单词，比如“&quot; some input words &quot;，我们期待的输出是[“some”, “input”, “words”]。在测试中，我们可以这样表达：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** Example test that tests a specific {@link DoFn}. */</span></span>
<span class="line"><span>  @Test</span></span>
<span class="line"><span>  public void testExtractWordsFn() throws Exception {</span></span>
<span class="line"><span>    DoFnTester&lt;​String, String&gt; extractWordsFn = DoFnTester.of(new ExtractWordsFn());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Assert.assertThat(</span></span>
<span class="line"><span>        extractWordsFn.processBundle(&quot; some  input  words &quot;),</span></span>
<span class="line"><span>        CoreMatchers.hasItems(&quot;some&quot;, &quot;input&quot;, &quot;words&quot;));</span></span>
<span class="line"><span>    Assert.assertThat(extractWordsFn.processBundle(&quot; &quot;), CoreMatchers.hasItems());</span></span>
<span class="line"><span>    Assert.assertThat(</span></span>
<span class="line"><span>        extractWordsFn.processBundle(&quot; some &quot;, &quot; input&quot;, &quot; words&quot;),</span></span>
<span class="line"><span>        CoreMatchers.hasItems(&quot;some&quot;, &quot;input&quot;, &quot;words&quot;));</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这一讲我们应用前面学习的PCollection，Pipeline，Pipeline IO，Transform知识去解决了一个数据处理领域经典的WordCount问题。并且学会了一些在实际工作中改进数据处理代码质量的贴士，比如写成单独可测试的DoFn，和把程序参数封装进PipelineOptions。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>文中提供了分词的DoFn——ExtractWordsFn，你能利用相似的思路把输出文本的格式化写成一个DoFn吗？也就是文中的FormatAsTextFn，把PCollection&lt;​KV&lt;​String, Long&gt;&gt; 转化成PCollection，每一个元素都是 : 的格式。</p><p>欢迎你把答案写在留言区，与我和其他同学一起讨论。如果你觉得有所收获，也欢迎把文章分享给你的朋友。</p>`,82)])])}const g=s(t,[["render",i]]);export{h as __pageData,g as default};
