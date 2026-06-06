import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"重磅加餐 | 带你快速入门Scala语言","description":"","frontmatter":{},"headers":[{"level":2,"title":"Java函数式编程","slug":"java函数式编程","link":"#java函数式编程","children":[]},{"level":2,"title":"定义变量和函数","slug":"定义变量和函数","link":"#定义变量和函数","children":[]},{"level":2,"title":"定义元组（Tuple）","slug":"定义元组-tuple","link":"#定义元组-tuple","children":[]},{"level":2,"title":"循环写法","slug":"循环写法","link":"#循环写法","children":[]},{"level":2,"title":"case类","slug":"case类","link":"#case类","children":[]},{"level":2,"title":"模式匹配","slug":"模式匹配","link":"#模式匹配","children":[]},{"level":2,"title":"Option对象","slug":"option对象","link":"#option对象","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"Kafka核心源码解读/重磅加餐-带你快速入门Scala语言.md","filePath":"Kafka核心源码解读/重磅加餐-带你快速入门Scala语言.md","lastUpdated":1779815932000}'),t={name:"Kafka核心源码解读/重磅加餐-带你快速入门Scala语言.md"};function l(i,a,o,c,r,g){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="重磅加餐-带你快速入门scala语言" tabindex="-1">重磅加餐 | 带你快速入门Scala语言 <a class="header-anchor" href="#重磅加餐-带你快速入门scala语言" aria-label="Permalink to &quot;重磅加餐 | 带你快速入门Scala语言&quot;">​</a></h1><p>你好，我是胡夕。最近，我在留言区看到一些同学反馈说“Scala语言不太容易理解”，于是，我决定临时加一节课，给你讲一讲Scala语言的基础语法，包括变量和函数的定义、元组的写法、函数式编程风格的循环语句的写法、它独有的case类和强大的match模式匹配功能，以及Option对象的用法。</p><p>学完这节课以后，相信你能够在较短的时间里掌握这些实用的Scala语法，特别是Kafka源码中用到的Scala语法特性，彻底扫清源码阅读路上的编程语言障碍。</p><h2 id="java函数式编程" tabindex="-1">Java函数式编程 <a class="header-anchor" href="#java函数式编程" aria-label="Permalink to &quot;Java函数式编程&quot;">​</a></h2><p>就像我在开篇词里面说的，你不熟悉Scala语言其实并没有关系，但你至少要对Java 8的函数式编程有一定的了解，特别是要熟悉Java 8 Stream的用法。</p><p>倘若你之前没有怎么接触过Lambda表达式和Java 8 Stream，我给你推荐一本好书： <strong>《Java 8实战》</strong>。这本书通过大量的实例深入浅出地讲解了Lambda表达式、Stream以及函数式编程方面的内容，你可以去读一读。</p><p>现在，我就给你分享一个实际的例子，借着它开始我们今天的所有讨论。</p><p>TopicPartition是Kafka定义的主题分区类，它建模的是Kafka主题的分区对象，其关键代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class TopicPartition implements Serializable {</span></span>
<span class="line"><span>  private final int partition;</span></span>
<span class="line"><span>  private final String topic;</span></span>
<span class="line"><span>  // 其他字段和方法......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于任何一个分区而言，一个TopicPartition实例最重要的就是 <strong>topic和partition字段</strong>，即 <strong>Kafka的主题和分区号</strong>。假设给定了一组分区对象List &lt; TopicPartition &gt; ，我想要找出分区数大于3且以“test”开头的所有主题列表，我应该怎么写这段Java代码呢？你可以先思考一下，然后再看下面的答案。</p><p>我先给出Java 8 Stream风格的答案：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 假设分区对象列表变量名是list</span></span>
<span class="line"><span>Set&amp;lt;String&amp;gt; topics = list.stream()</span></span>
<span class="line"><span>        .filter(tp -&amp;gt; tp.topic().startsWith(&quot;test-&quot;))</span></span>
<span class="line"><span>        .collect(Collectors.groupingBy(TopicPartition::topic, Collectors.counting()))</span></span>
<span class="line"><span>        .entrySet().stream()</span></span>
<span class="line"><span>        .filter(entry -&amp;gt; entry.getValue() &amp;gt; 3)</span></span>
<span class="line"><span>        .map(entry -&amp;gt; entry.getKey()).collect(Collectors.toSet());</span></span></code></pre></div><p>这是典型的Java 8 Stream代码，里面大量使用了诸如filter、map等操作算子,以及Lambda表达式，这让代码看上去一气呵成，而且具有很好的可读性。</p><p>我从第3行开始解释下每一行的作用：第3行的filter方法调用实现了筛选以“test”开头主题的功能；第4行是运行collect方法，同时指定使用groupingBy统计分区数并按照主题进行分组，进而生成一个Map对象；第5~7行是提取出这个Map对象的所有&lt;K, V&gt;对，然后再次调用filter方法，将分区数大于3的主题提取出来；最后是将这些主题做成一个集合返回。</p><p>其实，给出这个例子，我只是想说明， <strong>Scala语言的编写风格和Java 8 Stream有很多相似之处</strong>：一方面，代码中有大量的filter、map，甚至是flatMap等操作算子；另一方面，代码的风格也和Java中的Lambda表达式写法类似。</p><p>如果你不信的话，我们来看下Kafka中计算消费者Lag的getLag方法代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def getLag(offset: Option[Long], logEndOffset: Option[Long]): Option[Long] =</span></span>
<span class="line"><span>  offset.filter(_ != -1).flatMap(offset =&amp;gt; logEndOffset.map(_ - offset))</span></span></code></pre></div><p>你看，这里面也有filter和map。是不是和上面的Java代码有异曲同工之妙？</p><p>如果你现在还看不懂这个方法的代码是什么意思，也不用着急，接下来我会带着你一步一步来学习。我相信，学完了这节课以后，你一定能自主搞懂getLag方法的源码含义。getLag代码是非常典型的Kafka源码，一旦你熟悉了这种编码风格，后面一定可以举一反三，一举攻克其他的源码阅读难题。</p><p>我们先从Scala语言中的变量（Variable）开始说起。毕竟，不管是学习任何编程语言，最基础的就是先搞明白变量是如何定义的。</p><h2 id="定义变量和函数" tabindex="-1">定义变量和函数 <a class="header-anchor" href="#定义变量和函数" aria-label="Permalink to &quot;定义变量和函数&quot;">​</a></h2><p>Scala有两类变量： <strong>val和var</strong>。 <strong>val等同于Java中的final变量，一旦被初始化，就不能再被重新赋值了</strong>。相反地， <strong>var是非final变量，可以重复被赋值</strong>。我们看下这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scala&amp;gt; val msg = &quot;hello, world&quot;</span></span>
<span class="line"><span>msg: String = hello, world</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; msg = &quot;another string&quot;</span></span>
<span class="line"><span>&amp;lt;console&amp;gt;:12: error: reassignment to val</span></span>
<span class="line"><span>       msg = &quot;another string&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; var a:Long = 1L</span></span>
<span class="line"><span>a: Long = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; a = 2</span></span>
<span class="line"><span>a: Long = 2</span></span></code></pre></div><p>很直观，对吧？msg是一个val，a是一个var，所以msg不允许被重复赋值，而a可以。我想提醒你的是， <strong>变量后面可以跟“冒号+类型”，以显式标注变量的类型</strong>。比如，这段代码第6行的“：Long”，就是告诉我们变量a是一个Long型。当然，如果你不写“：Long”，也是可以的，因为Scala可以通过后面的值“1L”自动判断出a的类型。</p><p>不过，很多时候，显式标注上变量类型，可以让代码有更好的可读性和可维护性。</p><p>下面，我们来看下Scala中的函数如何定义。我以获取两个整数最大值的Max函数为例，进行说明，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def max(x: Int, y: Int): Int = {</span></span>
<span class="line"><span>  if (x &amp;gt; y) x</span></span>
<span class="line"><span>  else y</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先，def关键字表示这是一个函数。max是函数名，括号中的x和y是函数输入参数，它们都是Int类型的值。结尾的“Int =”组合表示max函数返回一个整数。</p><p>其次，max代码使用if语句比较x和y的大小，并返回两者中较大的值，但是它没有使用所谓的return关键字，而是直接写了x或y。 <strong>在Scala中，函数体具体代码块最后一行的值将被作为函数结果返回</strong>。在这个例子中，if分支代码块的最后一行是x，因此，此路分支返回x。同理，else分支返回y。</p><p>讲完了max函数，我再用Kafka源码中的一个真实函数，来帮你进一步地理解Scala函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def deleteIndicesIfExist(</span></span>
<span class="line"><span>  // 这里参数suffix的默认值是&quot;&quot;，即空字符串</span></span>
<span class="line"><span>  // 函数结尾处的Unit类似于Java中的void关键字，表示该函数不返回任何结果</span></span>
<span class="line"><span>  baseFile: File, suffix: String = &quot;&quot;): Unit = {</span></span>
<span class="line"><span>  info(s&quot;Deleting index files with suffix $suffix for baseFile $baseFile&quot;)</span></span>
<span class="line"><span>  val offset = offsetFromFile(baseFile)</span></span>
<span class="line"><span>  Files.deleteIfExists(Log.offsetIndexFile(dir, offset, suffix).toPath)</span></span>
<span class="line"><span>  Files.deleteIfExists(Log.timeIndexFile(dir, offset, suffix).toPath)</span></span>
<span class="line"><span>  Files.deleteIfExists(Log.transactionIndexFile(dir, offset, suffix).toPath)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和上面的max函数相比，这个函数有两个额外的语法特性需要你了解。</p><p>第一个特性是 <strong>参数默认值</strong>，这是Java不支持的。这个函数的参数suffix默认值是空字符串，因此，以下两种调用方式都是合法的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>deleteIndicesIfExist(baseFile) // OK</span></span>
<span class="line"><span>deleteIndicesIfExist(baseFile, &quot;.swap&quot;) // OK</span></span></code></pre></div><p>第二个特性是 <strong>该函数的返回值Unit</strong>。Scala的Unit类似于Java的void，因此，deleteIndicesIfExist函数的返回值是Unit类型，表明它仅仅是执行一段逻辑代码，不需要返回任何结果。</p><h2 id="定义元组-tuple" tabindex="-1">定义元组（Tuple） <a class="header-anchor" href="#定义元组-tuple" aria-label="Permalink to &quot;定义元组（Tuple）&quot;">​</a></h2><p>接下来，我们来看下Scala中的元组概念。 <strong>元组是承载数据的容器，一旦被创建，就不能再被更改了</strong>。元组中的数据可以是不同数据类型的。定义和访问元组的方法很简单，请看下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scala&amp;gt; val a = (1, 2.3, &quot;hello&quot;, List(1,2,3)) // 定义一个由4个元素构成的元组，每个元素允许是不同的类型</span></span>
<span class="line"><span>a: (Int, Double, String, List[Int]) = (1,2.3,hello,List(1, 2, 3))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; a._1 // 访问元组的第一个元素</span></span>
<span class="line"><span>res0: Int = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; a._2 // 访问元组的第二个元素</span></span>
<span class="line"><span>res1: Double = 2.3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; a._3 // 访问元组的第三个元素</span></span>
<span class="line"><span>res2: String = hello</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; a._4 // 访问元组的第四个元素</span></span>
<span class="line"><span>res3: List[Int] = List(1, 2, 3)</span></span></code></pre></div><p>总体上而言，元组的用法简单而优雅。Kafka源码中也有很多使用元组的例子，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def checkEnoughReplicasReachOffset(requiredOffset: Long): (Boolean, Errors) = { // 返回(Boolean，Errors)类型的元组</span></span>
<span class="line"><span>	......</span></span>
<span class="line"><span>	if (minIsr &amp;lt;= curInSyncReplicaIds.size) {</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>		(true, Errors.NONE)</span></span>
<span class="line"><span>    } else</span></span>
<span class="line"><span>		(false, Errors.NOT_ENOUGH_REPLICAS_AFTER_APPEND)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>checkEnoughReplicasReachOffset方法返回一个(Boolean, Errors)类型的元组，即元组的第一个元素或字段是Boolean类型，第二个元素是Kafka自定义的Errors类型。</p><p>该方法会判断某分区ISR中副本的数量，是否大于等于所需的最小ISR副本数，如果是，就返回（true, Errors.NONE）元组，否则返回（false，Errors.NOT_ENOUGH_REPLICAS_AFTER_APPEND）。目前，你不必理会代码中minIsr或curInSyncReplicaIds的含义，仅仅掌握Kafka源码中的元组用法就够了。</p><h2 id="循环写法" tabindex="-1">循环写法 <a class="header-anchor" href="#循环写法" aria-label="Permalink to &quot;循环写法&quot;">​</a></h2><p>下面我们来看下Scala中循环的写法。我们常见的循环有两种写法： <strong>命令式编程方式</strong> 和 <strong>函数式编程方式</strong>。我们熟悉的是第一种，比如下面的for循环代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scala&amp;gt; val list = List(1, 2, 3, 4, 5)</span></span>
<span class="line"><span>list: List[Int] = List(1, 2, 3, 4, 5)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; for (element &amp;lt;- list) println(element)</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>5</span></span></code></pre></div><p>Scala支持的函数式编程风格的循环，类似于下面的这种代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scala&amp;gt; list.foreach(e =&amp;gt; println(e))</span></span>
<span class="line"><span>// 省略输出......</span></span>
<span class="line"><span>scala&amp;gt; list.foreach(println)</span></span>
<span class="line"><span>// 省略输出......</span></span></code></pre></div><p>特别是代码中的第二种写法，会让代码写得异常简洁。我用一段真实的Kafka源码再帮你加强下记忆。它取自SocketServer组件中stopProcessingRequests方法，主要目的是让Broker停止请求和新入站TCP连接的处理。SocketServer组件是实现Kafka网络通信的重要组件，后面我会花3节课的时间专门讨论它。这里，咱们先来学习下这段明显具有函数式风格的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// dataPlaneAcceptors:ConcurrentHashMap&amp;lt;Endpoint, Acceptor&amp;gt;对象</span></span>
<span class="line"><span>dataPlaneAcceptors.asScala.values.foreach(_.initiateShutdown())</span></span></code></pre></div><p>这一行代码首先调用asScala方法，将Java的ConcurrentHashMap转换成Scala语言中的concurrent.Map对象；然后获取它保存的所有Acceptor线程，通过foreach循环，调用每个Acceptor对象的initiateShutdown方法。如果这个逻辑用命令式编程来实现，至少要几行甚至是十几行才能完成。</p><h2 id="case类" tabindex="-1">case类 <a class="header-anchor" href="#case类" aria-label="Permalink to &quot;case类&quot;">​</a></h2><p>在Scala中，case类与普通类是类似的，只是它具有一些非常重要的不同点。Case类非常适合用来表示不可变数据。同时，它最有用的一个特点是，case类自动地为所有类字段定义Getter方法，这样能省去很多样本代码。我举个例子说明一下。</p><p>如果我们要编写一个类表示平面上的一个点，Java代码大概长这个样子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class Point {</span></span>
<span class="line"><span>  private int x;</span></span>
<span class="line"><span>  private int y;</span></span>
<span class="line"><span>  public Point(int x, int y) {</span></span>
<span class="line"><span>    this.x = x;</span></span>
<span class="line"><span>    this.y = y;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // setter methods......</span></span>
<span class="line"><span>  // getter methods......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我就不列出完整的Getter和Setter方法了，写过Java的你一定知道这些样本代码。但如果用Scala的case类，只需要写一行代码就可以了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>case class Point(x:Int, y: Int) // 默认写法。不能修改x和y</span></span>
<span class="line"><span>case class Point(var x: Int, var y: Int) // 支持修改x和y</span></span></code></pre></div><p>Scala会自动地帮你创建出x和y的Getter方法。默认情况下，x和y不能被修改，如果要支持修改，你要采用上面代码中第二行的写法。</p><h2 id="模式匹配" tabindex="-1">模式匹配 <a class="header-anchor" href="#模式匹配" aria-label="Permalink to &quot;模式匹配&quot;">​</a></h2><p>有了case类的基础，接下来我们就可以学习下Scala中强大的模式匹配功能了。</p><p>和Java中switch仅仅只能比较数值和字符串相比，Scala中的match要强大得多。我先来举个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def describe(x: Any) = x match {</span></span>
<span class="line"><span>  case 1 =&amp;gt; &quot;one&quot;</span></span>
<span class="line"><span>  case false =&amp;gt; &quot;False&quot;</span></span>
<span class="line"><span>  case &quot;hi&quot; =&amp;gt; &quot;hello, world!&quot;</span></span>
<span class="line"><span>  case Nil =&amp;gt; &quot;the empty list&quot;</span></span>
<span class="line"><span>  case e: IOException =&amp;gt; &quot;this is an IOException&quot;</span></span>
<span class="line"><span>  case s: String if s.length &amp;gt; 10 =&amp;gt; &quot;a long string&quot;</span></span>
<span class="line"><span>  case _ =&amp;gt; &quot;something else&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个函数的x是Any类型，这相当于Java中的Object类型，即所有类的父类。注意倒数第二行的“case _”的写法，它是用来兜底的。如果上面的所有case分支都不匹配，那就进入到这个分支。另外，它还支持一些复杂的表达式，比如倒数第三行的case分支，表示x是字符串类型，而且x的长度超过10的话，就进入到这个分支。</p><p>要知道，Java在JDK 14才刚刚引入这个相同的功能，足见Scala语法的强大和便捷。</p><h2 id="option对象" tabindex="-1">Option对象 <a class="header-anchor" href="#option对象" aria-label="Permalink to &quot;Option对象&quot;">​</a></h2><p>最后，我再介绍一个小的语法特性或语言特点： <strong>Option对象</strong>。</p><p>实际上，Java也引入了类似的类：Optional。根据我的理解，不论是Scala中的Option，还是Java中的Optional，都是用来帮助我们更好地规避NullPointerException异常的。</p><p>Option表示一个容器对象，里面可能装了值，也可能没有装任何值。由于是容器，因此一般都是这样的写法：Option[Any]。中括号里面的Any就是上面说到的Any类型，它能是任何类型。如果值存在的话，就可以使用Some(x)来获取值或给值赋值，否则就使用None来表示。我用一段代码帮助你理解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scala&amp;gt; val keywords = Map(&quot;scala&quot; -&amp;gt; &quot;option&quot;, &quot;java&quot; -&amp;gt; &quot;optional&quot;) // 创建一个Map对象</span></span>
<span class="line"><span>keywords: scala.collection.immutable.Map[String,String] = Map(scala -&amp;gt; option, java -&amp;gt; optional)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; keywords.get(&quot;java&quot;) // 获取key值为java的value值。由于值存在故返回Some(optional)</span></span>
<span class="line"><span>res24: Option[String] = Some(optional)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; keywords.get(&quot;C&quot;) // 获取key值为C的value值。由于不存在故返回None</span></span>
<span class="line"><span>res23: Option[String] = None</span></span></code></pre></div><p>Option对象还经常与模式匹配语法一起使用，以实现不同情况下的处理逻辑。比如，Option对象有值和没有值时分别执行什么代码。具体写法你可以参考下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def display(game: Option[String]) = game match {</span></span>
<span class="line"><span>  case Some(s) =&amp;gt; s</span></span>
<span class="line"><span>  case None =&amp;gt; &quot;unknown&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; display(Some(&quot;Heroes 3&quot;))</span></span>
<span class="line"><span>res26: String = Heroes 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; display(Some(&quot;StarCraft&quot;))</span></span>
<span class="line"><span>res27: String = StarCraft</span></span>
<span class="line"><span></span></span>
<span class="line"><span>scala&amp;gt; display(None)</span></span>
<span class="line"><span>res28: String = unknown</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我们专门花了些时间快速地学习了一下Scala语言的语法，这些语法能够帮助你更快速地上手Kafka源码的学习。现在，让我们再来看下这节课刚开始时我提到的getLag方法源码，你看看现在是否能够说出它的含义。我再次把它贴出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private def getLag(offset: Option[Long], logEndOffset: Option[Long]): Option[Long] =</span></span>
<span class="line"><span>  offset.filter(_ != -1).flatMap(offset =&amp;gt; logEndOffset.map(_ - offset))</span></span></code></pre></div><p>现在，你应该知道了，它是一个函数，接收两个类型为Option[Long]的参数，同时返回一个Option[Long]的结果。代码逻辑很简单，首先判断offset是否有值且不能是-1。这些都是在filter函数中完成的，之后调用flatMap方法计算logEndOffset值与offset的差值，最后返回这个差值作为Lag。</p><p>这节课结束以后，语言问题应该不再是你学习源码的障碍了，接下来，我们就可以继续专心地学习源码了。借着这个机会，我还想跟你多说几句。</p><p>很多时候，我们都以为，要有足够强大的毅力才能把源码学习坚持下去，但实际上，毅力是在你读源码的过程中培养起来的。</p><p>考虑到源码并不像具体技术本身那样容易掌握，我力争用最清晰易懂的方式来讲这门课。所以，我希望你每天都能花一点点时间跟着我一起学习，我相信，到结课的时候，你不仅可以搞懂Kafka Broker端源码，还能提升自己的毅力。而毅力和执行力的提升，可能比技术本身的提升还要弥足珍贵。</p><p>另外，我还想给你分享一个小技巧：想要养成每天阅读源码的习惯，你最好把目标拆解得足够小。人的大脑都是有惰性的，比起“我每天要读1000行源码”，它更愿意接受“每天只读20行”。你可能会说，每天读20行，这也太少了吧？其实不是的。只要你读了20行源码，你就一定能再多读一些，“20行”这个小目标只是为了促使你愿意开始去做这件事情。而且，即使你真的只读了20行，那又怎样？读20行总好过1行都没有读，对吧？</p><p>当然了，阅读源码经常会遇到一种情况，那就是读不懂某部分的代码。没关系，读不懂的代码，你可以选择先跳过。</p><p>如果你是个追求完美的人，那么对于读不懂的代码，我给出几点建议：</p><ol><li><strong>多读几遍</strong>。不要小看这个朴素的建议。有的时候，我们的大脑是很任性的，只让它看一遍代码，它可能“傲娇地表示不理解”，但你多给它看几遍，也许就恍然大悟了。</li><li><strong>结合各种资料来学习</strong>。比如，社区或网上关于这部分代码的设计文档、源码注释或源码测试用例等。尤其是搞懂测试用例，往往是让我们领悟代码精神最快捷的办法了。</li></ol><p>总之，阅读源码是一项长期的工程，不要幻想有捷径或一蹴而就，微小积累会引发巨大改变，我们一起加油。</p>`,82)])])}const u=s(t,[["render",l]]);export{h as __pageData,u as default};
