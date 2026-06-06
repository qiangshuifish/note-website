import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"35 | Hot Reload是怎么做到的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"热重载","slug":"热重载","link":"#热重载","children":[]},{"level":2,"title":"不支持热重载的场景","slug":"不支持热重载的场景","link":"#不支持热重载的场景","children":[]},{"level":2,"title":"代码出现编译错误","slug":"代码出现编译错误","link":"#代码出现编译错误","children":[]},{"level":2,"title":"Widget状态无法兼容","slug":"widget状态无法兼容","link":"#widget状态无法兼容","children":[]},{"level":2,"title":"全局变量和静态属性的更改","slug":"全局变量和静态属性的更改","link":"#全局变量和静态属性的更改","children":[]},{"level":2,"title":"main方法里的更改","slug":"main方法里的更改","link":"#main方法里的更改","children":[]},{"level":2,"title":"initState方法里的更改","slug":"initstate方法里的更改","link":"#initstate方法里的更改","children":[]},{"level":2,"title":"枚举和泛型类型更改","slug":"枚举和泛型类型更改","link":"#枚举和泛型类型更改","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/35-HotReload是怎么做到的？.md","filePath":"Flutter核心技术与实战/35-HotReload是怎么做到的？.md","lastUpdated":1779815654000}'),t={name:"Flutter核心技术与实战/35-HotReload是怎么做到的？.md"};function l(i,a,r,c,o,d){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_35-hot-reload是怎么做到的" tabindex="-1">35 | Hot Reload是怎么做到的？ <a class="header-anchor" href="#_35-hot-reload是怎么做到的" aria-label="Permalink to &quot;35 | Hot Reload是怎么做到的？&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我与你分享了Flutter的Debug与Release编译模式，以及如何通过断言与编译常数来精准识别当前代码所运行的编译模式，从而写出只在Debug或Release模式下生效的代码。</p><p>另外，对于在开发期与发布期分别使用不同的配置环境，Flutter也提供了支持。我们可以将应用中可配置的部分进行封装抽象，使用配置多入口的方式，通过InheritedWidget来为应用的启动注入环境配置。</p><p>如果你有过原生应用的开发经历，那你一定知道在原生应用开发时，如果我们想要在硬件设备上看到调整后的运行效果，在完成了代码修改后，必须要经过漫长的重新编译，才能同步到设备上。</p><p>而Flutter则不然，由于Debug模式支持JIT，并且为开发期的运行和调试提供了大量优化，因此代码修改后，我们可以通过亚秒级的热重载（Hot Reload）进行增量代码的快速刷新，而无需经过全量的代码编译，从而大大缩短了从代码修改到看到修改产生的变化之间所需要的时间。</p><p>比如，在开发页面的过程中，当我们点击按钮出现一个弹窗的时候，发现弹窗标题没有对齐，这时候只要修改标题的对齐样式，然后保存，在代码并没有重新编译的情况下，标题样式就发生了改变，感觉就像是在UI编辑面板中直接修改元素样式一样，非常方便。</p><p>那么，Flutter的热重载到底是如何实现的呢？</p><h2 id="热重载" tabindex="-1">热重载 <a class="header-anchor" href="#热重载" aria-label="Permalink to &quot;热重载&quot;">​</a></h2><p>热重载是指，在不中断App正常运行的情况下，动态注入修改后的代码片段。而这一切的背后，离不开Flutter所提供的运行时编译能力。为了更好地理解Flutter的热重载实现原理，我们先简单回顾一下Flutter编译模式背后的技术吧。</p><ul><li>JIT（Just In Time），指的是即时编译或运行时编译，在Debug模式中使用，可以动态下发和执行代码，启动速度快，但执行性能受运行时编译影响；</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/136886/ab692d1e072df378bc78fef6245205a3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/136886/ab692d1e072df378bc78fef6245205a3.png" alt=""></a></p><p>图1 JIT编译模式示意图</p><ul><li>AOT（Ahead Of Time），指的是提前编译或运行前编译，在Release模式中使用，可以为特定的平台生成稳定的二进制代码，执行性能好、运行速度快，但每次执行均需提前编译，开发调试效率低。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/136886/fe8712b8a36a032b0646ed85fec9b2a5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/136886/fe8712b8a36a032b0646ed85fec9b2a5.png" alt=""></a></p><p>图2 AOT编译模式示意图</p><p>可以看到，Flutter提供的两种编译模式中，AOT是静态编译，即编译成设备可直接执行的二进制码；而JIT则是动态编译，即将Dart代码编译成中间代码（Script Snapshot），在运行时设备需要Dart VM解释执行。</p><p>而热重载之所以只能在Debug模式下使用，是因为Debug模式下，Flutter采用的是JIT动态编译（而Release模式下采用的是AOT静态编译）。JIT编译器将Dart代码编译成可以运行在Dart VM上的Dart Kernel，而Dart Kernel是可以动态更新的，这就实现了代码的实时更新功能。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/136886/2dfbedae7b95dd152a587070db4bb9fa.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/136886/2dfbedae7b95dd152a587070db4bb9fa.png" alt=""></a></p><p>图3 热重载流程</p><p>总体来说， <strong>热重载的流程可以分为扫描工程改动、增量编译、推送更新、代码合并、Widget重建5个步骤：</strong></p><ol><li>工程改动。热重载模块会逐一扫描工程中的文件，检查是否有新增、删除或者改动，直到找到在上次编译之后，发生变化的Dart代码。</li><li>增量编译。热重载模块会将发生变化的Dart代码，通过编译转化为增量的Dart Kernel文件。</li><li>推送更新。热重载模块将增量的Dart Kernel文件通过HTTP端口，发送给正在移动设备上运行的Dart VM。</li><li>代码合并。Dart VM会将收到的增量Dart Kernel文件，与原有的Dart Kernel文件进行合并，然后重新加载新的Dart Kernel文件。</li><li>Widget重建。在确认Dart VM资源加载成功后，Flutter会将其UI线程重置，通知Flutter Framework重建Widget。</li></ol><p>可以看到，Flutter提供的热重载在收到代码变更后，并不会让App重新启动执行，而只会触发Widget树的重新绘制，因此可以保持改动前的状态，这就大大节省了调试复杂交互界面的时间。</p><p>比如，我们需要为一个视图栈很深的页面调整UI样式，若采用重新编译的方式，不仅需要漫长的全量编译时间，而为了恢复视图栈，也需要重复之前的多次点击交互，才能重新进入到这个页面查看改动效果。但如果是采用热重载的方式，不仅没有编译时间，而且页面的视图栈状态也得以保留，完成热重载之后马上就可以预览UI效果了，相当于局部界面刷新。</p><h2 id="不支持热重载的场景" tabindex="-1">不支持热重载的场景 <a class="header-anchor" href="#不支持热重载的场景" aria-label="Permalink to &quot;不支持热重载的场景&quot;">​</a></h2><p>Flutter提供的亚秒级热重载一直是开发者的调试利器。通过热重载，我们可以快速修改UI、修复Bug，无需重启应用即可看到改动效果，从而大大提升了UI调试效率。</p><p>不过，Flutter的热重载也有一定的局限性。因为涉及到状态保存与恢复，所以并不是所有的代码改动都可以通过热重载来更新。</p><p>接下来，我就与你介绍几个不支持热重载的典型场景：</p><ul><li>代码出现编译错误；</li><li>Widget状态无法兼容；</li><li>全局变量和静态属性的更改；</li><li>main方法里的更改；</li><li>initState方法里的更改；</li><li>枚举和泛类型更改。</li></ul><p>现在，我们就具体看看这几种场景的问题，应该如何解决吧。</p><h2 id="代码出现编译错误" tabindex="-1">代码出现编译错误 <a class="header-anchor" href="#代码出现编译错误" aria-label="Permalink to &quot;代码出现编译错误&quot;">​</a></h2><p>当代码更改导致编译错误时，热重载会提示编译错误信息。比如下面的例子中，代码中漏写了一个反括号，在使用热重载时，编译器直接报错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Initializing hot reload...</span></span>
<span class="line"><span>Syncing files to device iPhone X...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Compiler message:</span></span>
<span class="line"><span>lib/main.dart:84:23: Error: Can&#39;t find &#39;)&#39; to match &#39;(&#39;.</span></span>
<span class="line"><span>    return MaterialApp(</span></span>
<span class="line"><span>                      ^</span></span>
<span class="line"><span>Reloaded 1 of 462 libraries in 301ms.</span></span></code></pre></div><p>在这种情况下，只需更正上述代码中的错误，就可以继续使用热重载。</p><h2 id="widget状态无法兼容" tabindex="-1">Widget状态无法兼容 <a class="header-anchor" href="#widget状态无法兼容" aria-label="Permalink to &quot;Widget状态无法兼容&quot;">​</a></h2><p>当代码更改会影响Widget的状态时，会使得热重载前后Widget所使用的数据不一致，即应用程序保留的状态与新的更改不兼容。这时，热重载也是无法使用的。</p><p>比如下面的代码中，我们将某个类的定义从 StatelessWidget改为StatefulWidget时，热重载就会直接报错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//改动前</span></span>
<span class="line"><span>class MyWidget extends StatelessWidget {</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return GestureDetector(onTap: () =&gt; print(&#39;T&#39;));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//改动后</span></span>
<span class="line"><span>class MyWidget extends StatefulWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  State&lt;​MyWidget&gt; createState() =&gt; MyWidgetState();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class MyWidgetState extends State&lt;​MyWidget&gt; { /*...*/ }</span></span></code></pre></div><p>当遇到这种情况时，我们需要重启应用，才能看到更新后的程序。</p><h2 id="全局变量和静态属性的更改" tabindex="-1">全局变量和静态属性的更改 <a class="header-anchor" href="#全局变量和静态属性的更改" aria-label="Permalink to &quot;全局变量和静态属性的更改&quot;">​</a></h2><p>在Flutter中，全局变量和静态属性都被视为状态，在第一次运行应用程序时，会将它们的值设为初始化语句的执行结果，因此在热重载期间不会重新初始化。</p><p>比如下面的代码中，我们修改了一个静态Text数组的初始化元素。虽然热重载并不会报错，但由于静态变量并不会在热重载之后初始化，因此这个改变并不会产生效果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//改动前</span></span>
<span class="line"><span>final sampleText = [</span></span>
<span class="line"><span>  Text(&quot;T1&quot;),</span></span>
<span class="line"><span>  Text(&quot;T2&quot;),</span></span>
<span class="line"><span>  Text(&quot;T3&quot;),</span></span>
<span class="line"><span>  Text(&quot;T4&quot;),</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//改动后</span></span>
<span class="line"><span>final sampleText = [</span></span>
<span class="line"><span>  Text(&quot;T1&quot;),</span></span>
<span class="line"><span>  Text(&quot;T2&quot;),</span></span>
<span class="line"><span>  Text(&quot;T3&quot;),</span></span>
<span class="line"><span>  Text(&quot;T10&quot;),    //改动点</span></span>
<span class="line"><span>];</span></span></code></pre></div><p>如果我们需要更改全局变量和静态属性的初始化语句，重启应用才能查看更改效果。</p><h2 id="main方法里的更改" tabindex="-1">main方法里的更改 <a class="header-anchor" href="#main方法里的更改" aria-label="Permalink to &quot;main方法里的更改&quot;">​</a></h2><p>在Flutter中，由于热重载之后只会根据原来的根节点重新创建控件树，因此main函数的任何改动并不会在热重载后重新执行。所以，如果我们改动了main函数体内的代码，是无法通过热重载看到更新效果的。</p><p>在第1篇文章“ <a href="https://time.geekbang.org/column/article/104051" target="_blank" rel="noreferrer">预习篇 · 从零开始搭建Flutter开发环境</a>”中，我与你介绍了这种情况。在更新前，我们通过MyApp封装了一个展示“Hello World”的文本，在更新后，直接在main函数封装了一个展示“Hello 2019”的文本：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//更新前</span></span>
<span class="line"><span>class MyAPP extends StatelessWidget {</span></span>
<span class="line"><span>@override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return const Center(child: Text(&#39;Hello World&#39;, textDirection: TextDirection.ltr));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() =&gt; runApp(new MyAPP());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//更新后</span></span>
<span class="line"><span>void main() =&gt; runApp(const Center(child: Text(&#39;Hello, 2019&#39;, textDirection: TextDirection.ltr)));</span></span></code></pre></div><p>由于main函数并不会在热重载后重新执行，因此以上改动是无法通过热重载查看更新的。</p><h2 id="initstate方法里的更改" tabindex="-1">initState方法里的更改 <a class="header-anchor" href="#initstate方法里的更改" aria-label="Permalink to &quot;initState方法里的更改&quot;">​</a></h2><p>在热重载时，Flutter会保存Widget的状态，然后重建Widget。而initState方法是Widget状态的初始化方法，这个方法里的更改会与状态保存发生冲突，因此热重载后不会产生效果。</p><p>在下面的例子中，我们将计数器的初始值由10改为100：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//更改前</span></span>
<span class="line"><span>class _MyHomePageState extends State&lt;​MyHomePage&gt; {</span></span>
<span class="line"><span>  int _counter;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void initState() {</span></span>
<span class="line"><span>    _counter = 10;</span></span>
<span class="line"><span>    super.initState();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//更改后</span></span>
<span class="line"><span>class _MyHomePageState extends State&lt;​MyHomePage&gt; {</span></span>
<span class="line"><span>  int _counter;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void initState() {</span></span>
<span class="line"><span>    _counter = 100;</span></span>
<span class="line"><span>    super.initState();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于这样的改动发生在initState方法中，因此无法通过热重载查看更新，我们需要重启应用，才能看到更改效果。</p><h2 id="枚举和泛型类型更改" tabindex="-1">枚举和泛型类型更改 <a class="header-anchor" href="#枚举和泛型类型更改" aria-label="Permalink to &quot;枚举和泛型类型更改&quot;">​</a></h2><p>在Flutter中，枚举和泛型也被视为状态，因此对它们的修改也不支持热重载。比如在下面的代码中，我们将一个枚举类型改为普通类，并为其增加了一个泛型参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//更改前</span></span>
<span class="line"><span>enum Color {</span></span>
<span class="line"><span>  red,</span></span>
<span class="line"><span>  green,</span></span>
<span class="line"><span>  blue</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class C&lt;​U&gt; {</span></span>
<span class="line"><span>  U u;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//更改后</span></span>
<span class="line"><span>class Color {</span></span>
<span class="line"><span>  Color(this.r, this.g, this.b);</span></span>
<span class="line"><span>  final int r;</span></span>
<span class="line"><span>  final int g;</span></span>
<span class="line"><span>  final int b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class C&lt;​U, V&gt; {</span></span>
<span class="line"><span>  U u;</span></span>
<span class="line"><span>  V v;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这两类更改都会导致热重载失败，并生成对应的提示消息。同样的，我们需要重启应用，才能查看到更改效果。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的分享就到这里，我们总结一下今天的主要内容吧。</p><p>Flutter的热重载是基于JIT编译模式的代码增量同步。由于JIT属于动态编译，能够将Dart代码编译成生成中间代码，让Dart VM在运行时解释执行，因此可以通过动态更新中间代码实现增量同步。</p><p>热重载的流程可以分为5步，包括：扫描工程改动、增量编译、推送更新、代码合并、Widget重建。Flutter在接收到代码变更后，并不会让App重新启动执行，而只会触发Widget树的重新绘制，因此可以保持改动前的状态，大大缩短了从代码修改到看到修改产生的变化之间所需要的时间。</p><p>而另一方面，由于涉及到状态保存与恢复，因此涉及状态兼容与状态初始化的场景，热重载是无法支持的，比如改动前后Widget状态无法兼容、全局变量与静态属性的更改、main方法里的更改、initState方法里的更改、枚举和泛型的更改等。</p><p>可以发现，热重载提高了调试UI的效率，非常适合写界面样式这样需要反复查看修改效果的场景。但由于其状态保存的机制所限，热重载本身也有一些无法支持的边界。</p><p>如果你在写业务逻辑的时候，不小心碰到了热重载无法支持的场景，也不需要进行漫长的重新编译加载等待，只要点击位于工程面板左下角的热重启（Hot Restart）按钮，就可以以秒级的速度进行代码重新编译以及程序重启了，同样也很快。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留下一道思考题吧。</p><p>你是否了解其他框架（比如React Native、Webpack）的热重载机制？它们的热重载机制与Flutter有何区别？</p><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,69)])])}const g=n(t,[["render",l]]);export{h as __pageData,g as default};
