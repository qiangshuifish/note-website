import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"38 | 如何通过自动化测试提高交付质量？","description":"","frontmatter":{},"headers":[{"level":2,"title":"单元测试","slug":"单元测试","link":"#单元测试","children":[]},{"level":2,"title":"UI测试","slug":"ui测试","link":"#ui测试","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/38-如何通过自动化测试提高交付质量？.md","filePath":"Flutter核心技术与实战/38-如何通过自动化测试提高交付质量？.md","lastUpdated":1779815654000}'),t={name:"Flutter核心技术与实战/38-如何通过自动化测试提高交付质量？.md"};function l(i,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_38-如何通过自动化测试提高交付质量" tabindex="-1">38 | 如何通过自动化测试提高交付质量？ <a class="header-anchor" href="#_38-如何通过自动化测试提高交付质量" aria-label="Permalink to &quot;38 | 如何通过自动化测试提高交付质量？&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我与你分享了如何分析并优化Flutter应用的性能问题。通过在真机上以分析模式运行应用，我们可以借助于性能图层的帮助，找到引起性能瓶颈的两类问题，即GPU渲染问题和CPU执行耗时问题。然后，我们就可以使用Flutter提供的渲染开关和CPU帧图（火焰图），来检查应用中是否存在过度渲染或是代码执行耗时长的情况，从而去定位并着手解决应用的性能问题了。</p><p>在完成了应用的开发工作，并解决了代码中的逻辑问题和性能问题之后，接下来我们就需要测试验收应用的各项功能表现了。移动应用的测试工作量通常很大，这是因为为了验证真实用户的使用体验，测试往往需要跨越多个平台（Android/iOS）及不同的物理设备手动完成。</p><p>随着产品功能不断迭代累积，测试工作量和复杂度也随之大幅增长，手动测试变得越来越困难。那么，在为产品添加新功能，或者修改已有功能时，如何才能确保应用可以继续正常工作呢？</p><p>答案是，通过编写自动化测试用例。</p><p>所谓自动化测试，是把由人驱动的测试行为改为由机器执行。具体来说就是，通过精心设计的测试用例，由机器按照执行步骤对应用进行自动测试，并输出执行结果，最后根据测试用例定义的规则确定结果是否符合预期。</p><p>也就是说，自动化测试将重复的、机械的人工操作变为自动化的验证步骤，极大的节省人力、时间和硬件资源，从而提高了测试效率。</p><p>在自动化测试用例的编写上，Flutter提供了包括单元测试和UI测试的能力。其中，单元测试可以方便地验证单个函数、方法或类的行为，而UI测试则提供了与Widget进行交互的能力，确认其功能是否符合预期。</p><p>接下来，我们就具体看看这两种自动化测试用例的用法吧。</p><h2 id="单元测试" tabindex="-1">单元测试 <a class="header-anchor" href="#单元测试" aria-label="Permalink to &quot;单元测试&quot;">​</a></h2><p>单元测试是指，对软件中的最小可测试单元进行验证的方式，并通过验证结果来确定最小单元的行为是否与预期一致。所谓最小可测试单元，一般来说，就是人为规定的、最小的被测功能模块，比如语句、函数、方法或类。</p><p>在Flutter中编写单元测试用例，我们可以在pubspec.yaml文件中使用test包来完成。其中，test包提供了编写单元测试用例的核心框架，即定义、执行和验证。如下代码所示，就是test包的用法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dev_dependencies:</span></span>
<span class="line"><span>  test:</span></span></code></pre></div><blockquote><p>备注：test包的声明需要在dev_dependencies下完成，在这个标签下面定义的包只会在开发模式生效。</p></blockquote><p>与Flutter应用通过main函数定义程序入口相同，Flutter单元测试用例也是通过main函数来定义测试入口的。不过， <strong>这两个程序入口的目录位置有些区别</strong>：应用程序的入口位于工程中的lib目录下，而测试用例的入口位于工程中的test目录下。</p><p>一个有着单元测试用例的Flutter工程目录结构，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/436f402015d289528725e69f42ec9ef7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/436f402015d289528725e69f42ec9ef7.png" alt=""></a></p><p>图1 Flutter工程目录结构</p><p>接下来，我们就可以在main.dart中声明一个用来测试的类了。在下面的例子中，我们声明了一个计数器类Counter，这个类可以支持以递增或递减的方式修改计数值count：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Counter {</span></span>
<span class="line"><span>  int count = 0;</span></span>
<span class="line"><span>  void increase() =&gt; count++;</span></span>
<span class="line"><span>  void decrease() =&gt; count--;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实现完待测试的类，我们就可以为它编写测试用例了。 <strong>在Flutter中，测试用例的声明包含定义、执行和验证三个部分：</strong> 定义和执行决定了被测试对象提供的、需要验证的最小可测单元；而验证则需要使用expect函数，将最小可测单元的执行结果与预期进行比较。</p><p>所以，在Flutter中编写一个测试用例，通常包含以下两大步骤：</p><ol><li>实现一个包含定义、执行和验证步骤的测试用例；</li><li>将其包装在test内部，test是Flutter提供的测试用例封装类。</li></ol><p>在下面的例子中，我们定义了两个测试用例，其中第一个用例用来验证调用increase函数后的计数器值是否为1，而第二个用例则用来判断1+1是否等于2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import &#39;package:test/test.dart&#39;;</span></span>
<span class="line"><span>import &#39;package:flutter_app/main.dart&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  //第一个用例，判断Counter对象调用increase方法后是否等于1</span></span>
<span class="line"><span>  test(&#39;Increase a counter value should be 1&#39;, () {</span></span>
<span class="line"><span>    final counter = Counter();</span></span>
<span class="line"><span>    counter.increase();</span></span>
<span class="line"><span>    expect(counter.value, 1);</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  //第二个用例，判断1+1是否等于2</span></span>
<span class="line"><span>  test(&#39;1+1 should be 2&#39;, () {</span></span>
<span class="line"><span>    expect(1+1, 2);</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>选择widget_test.dart文件，在右键弹出的菜单中选择“Run ‘tests in widget_test’”，就可以启动测试用例了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/c0f59369d9af26b3705daee16da352c2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/c0f59369d9af26b3705daee16da352c2.png" alt=""></a></p><p>图2 启动测试用例入口</p><p>稍等片刻，控制台就会输出测试用例的执行结果了。当然，这两个用例都能通过测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>22:05	Tests passed: 2</span></span></code></pre></div><p><strong>如果测试用例的执行结果是不通过，Flutter会给我们怎样的提示呢？</strong> 我们试着修改一下第一个计数器递增的用例，将它的期望结果改为2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>test(&#39;Increase a counter value should be 1&#39;, () {</span></span>
<span class="line"><span>  final counter = Counter();</span></span>
<span class="line"><span>  counter.increase();</span></span>
<span class="line"><span>  expect(counter.value, 2);//判断Counter对象调用increase后是否等于2</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>运行测试用例，可以看到，Flutter在执行完计数器的递增方法后，发现其结果1与预期的2不匹配，于是报错：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/fe030c283a78c133787d03eca8a3f240.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/fe030c283a78c133787d03eca8a3f240.png" alt=""></a></p><p>图3 单元测试失败示意图</p><p>上面的示例演示了单个测试用例的编写方法，而 <strong>如果有多个测试用例</strong>，它们之间是存在关联关系的，我们可以在最外层使用group将它们组合在一起。</p><p>在下面的例子中，我们定义了计数器递增和计数器递减两个用例，验证递增的结果是否等于1的同时判断递减的结果是否等于-1，并把它们组合在了一起：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import &#39;package:test/test.dart&#39;;</span></span>
<span class="line"><span>import &#39;package:counter_app/counter.dart&#39;;</span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  //组合测试用例，判断Counter对象调用increase方法后是否等于1，并且判断Counter对象调用decrease方法后是否等于-1</span></span>
<span class="line"><span>  group(&#39;Counter&#39;, () {</span></span>
<span class="line"><span>    test(&#39;Increase a counter value should be 1&#39;, () {</span></span>
<span class="line"><span>      final counter = Counter();</span></span>
<span class="line"><span>      counter.increase();</span></span>
<span class="line"><span>      expect(counter.value, 1);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    test(&#39;Decrease a counter value should be -1&#39;, () {</span></span>
<span class="line"><span>      final counter = Counter();</span></span>
<span class="line"><span>      counter.decrease();</span></span>
<span class="line"><span>      expect(counter.value, -1);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同样的，这两个测试用例的执行结果也是通过。</p><p><strong>在对程序的内部功能进行单元测试时，我们还可能需要从外部依赖（比如Web服务）获取需要测试的数据。</strong> 比如下面的例子，Todo对象的初始化就是通过Web服务返回的JSON实现的。考虑到调用Web服务的过程中可能会出错，所以我们还处理了请求码不等于200的其他异常情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import &#39;package:http/http.dart&#39; as http;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Todo {</span></span>
<span class="line"><span>  final String title;</span></span>
<span class="line"><span>  Todo({this.title});</span></span>
<span class="line"><span>  //工厂类构造方法，将JSON转换为对象</span></span>
<span class="line"><span>  factory Todo.fromJson(Map&lt;​String, dynamic&gt; json) {</span></span>
<span class="line"><span>    return Todo(</span></span>
<span class="line"><span>      title: json[&#39;title&#39;],</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Future&lt;​Todo&gt; fetchTodo(http.Client client) async {</span></span>
<span class="line"><span>  final response =</span></span>
<span class="line"><span>  await client.get(&#39;https://xxx.com/todos/1&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (response.statusCode == 200) {</span></span>
<span class="line"><span>    //请求成功，解析JSON</span></span>
<span class="line"><span>    return Todo.fromJson(json.decode(response.body));</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    //请求失败，抛出异常</span></span>
<span class="line"><span>    throw Exception(&#39;Failed to load post&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>考虑到这些外部依赖并不是我们的程序所能控制的，因此很难覆盖所有可能的成功或失败方案。比如，对于一个正常运行的Web服务来说，我们基本不可能测试出fetchTodo这个接口是如何应对403或502状态码的。因此，更好的一个办法是，在测试用例中“模拟”这些外部依赖（对应本例即为http.client），让这些外部依赖可以返回特定结果。</p><p>在单元测试用例中模拟外部依赖，我们需要在pubspec.yaml文件中使用mockito包，以接口实现的方式定义外部依赖的接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dev_dependencies:</span></span>
<span class="line"><span>  test:</span></span>
<span class="line"><span>  mockito:</span></span></code></pre></div><p>要 <strong>使用mockito包来模拟fetchTodo的依赖http.client</strong>，我们首先需要定义一个继承自Mock（这个类可以模拟任何外部依赖），并以接口定义的方式实现了http.client的模拟类；然后，在测试用例的声明中，为其制定任意的接口返回。</p><p>在下面的例子中，我们定义了一个模拟类MockClient，这个类以接口声明的方式获取到了http.Client的外部接口。随后，我们就可以使用when语句，在其调用Web服务时，为其注入相应的数据返回了。在第一个用例中，我们为其注入了JSON结果；而在第二个用例中，我们为其注入了一个403的异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import &#39;package:mockito/mockito.dart&#39;;</span></span>
<span class="line"><span>import &#39;package:http/http.dart&#39; as http;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MockClient extends Mock implements http.Client {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  group(&#39;fetchTodo&#39;, () {</span></span>
<span class="line"><span>  test(&#39;returns a Todo if successful&#39;, () async {</span></span>
<span class="line"><span>    final client = MockClient();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //使用Mockito注入请求成功的JSON字段</span></span>
<span class="line"><span>    when(client.get(&#39;https://xxx.com/todos/1&#39;))</span></span>
<span class="line"><span>        .thenAnswer((_) async =&gt; http.Response(&#39;{&quot;title&quot;: &quot;Test&quot;}&#39;, 200));</span></span>
<span class="line"><span>    //验证请求结果是否为Todo实例</span></span>
<span class="line"><span>    expect(await fetchTodo(client), isInstanceOf&lt;​Todo&gt;());</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  test(&#39;throws an exception if error&#39;, () {</span></span>
<span class="line"><span>    final client = MockClient();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //使用Mockito注入请求失败的Error</span></span>
<span class="line"><span>    when(client.get(&#39;https://xxx.com/todos/1&#39;))</span></span>
<span class="line"><span>        .thenAnswer((_) async =&gt; http.Response(&#39;Forbidden&#39;, 403));</span></span>
<span class="line"><span>    //验证请求结果是否抛出异常</span></span>
<span class="line"><span>    expect(fetchTodo(client), throwsException);</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这段测试用例，可以看到，我们在没有调用真实Web服务的情况下，成功模拟出了正常和异常两种结果，同样也是顺利通过验证了。</p><p>接下来，我们再看看UI测试吧。</p><h2 id="ui测试" tabindex="-1">UI测试 <a class="header-anchor" href="#ui测试" aria-label="Permalink to &quot;UI测试&quot;">​</a></h2><p>UI测试的目的是模仿真实用户的行为，即以真实用户的身份对应用程序执行UI交互操作，并涵盖各种用户流程。相比于单元测试，UI测试的覆盖范围更广、更关注流程和交互，可以找到单元测试期间无法找到的错误。</p><p>在Flutter中编写UI测试用例，我们需要在pubspec.yaml中使用flutter_test包，来提供编写 <strong>UI测试的核心框架</strong>，即定义、执行和验证：</p><ul><li><p>定义，即通过指定规则，找到UI测试用例需要验证的、特定的子Widget对象；</p></li><li><p>执行，意味着我们要在找到的子Widget对象中，施加用户交互事件；</p></li><li><p>验证，表示在施加了交互事件后，判断待验证的Widget对象的整体表现是否符合预期。</p></li></ul><p>如下代码所示，就是flutter_test包的用法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dev_dependencies:</span></span>
<span class="line"><span>  flutter_test:</span></span>
<span class="line"><span>    sdk: flutter</span></span></code></pre></div><p>接下来，我以Flutter默认的计时器应用模板为例，与你说明 <strong>UI测试用例的编写方法</strong>。</p><p>在计数器应用中，有两处地方会响应外部交互事件，包括响应用户点击行为的按钮Icon，与响应渲染刷新事件的文本Text。按钮点击后，计数器会累加，文本也随之刷新。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/5510a86c0d7a25a3c1f3366e485f4c03.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/140079/5510a86c0d7a25a3c1f3366e485f4c03.png" alt=""></a></p><p>图4 计数器示例</p><p>为确保程序的功能正常，我们希望编写一个UI测试用例，来验证按钮的点击行为是否与文本的刷新行为完全匹配。</p><p>与单元测试使用test对用例进行包装类似， <strong>UI测试使用testWidgets对用例进行包装</strong>。testWidgets提供了tester参数，我们可以使用这个实例来操作需要测试的Widget对象。</p><p>在下面的代码中，我们 <strong>首先</strong> 声明了需要验证的MyApp对象。在通过pumpWidget触发其完成渲染后，使用find.text方法分别查找了字符串文本为0和1的Text控件，目的是验证响应刷新事件的文本Text的初始化状态是否为0。</p><p><strong>随后</strong>，我们通过find.byIcon方法找到了按钮控件，并通过tester.tap方法对其施加了点击行为。在完成了点击后，我们使用tester.pump方法强制触发其完成渲染刷新。 <strong>最后</strong>，我们使用了与验证Text初始化状态同样的语句，判断在响应了刷新事件后的文本Text其状态是否为1：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import &#39;package:flutter_test/flutter_test.dart&#39;;</span></span>
<span class="line"><span>import &#39;package:flutter_app_demox/main.dart&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  testWidgets(&#39;Counter increments UI test&#39;, (WidgetTester tester) async {</span></span>
<span class="line"><span>  //声明所需要验证的Widget对象(即MyApp)，并触发其渲染</span></span>
<span class="line"><span>  await tester.pumpWidget(MyApp());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //查找字符串文本为&#39;0&#39;的Widget，验证查找成功</span></span>
<span class="line"><span>  expect(find.text(&#39;0&#39;), findsOneWidget);</span></span>
<span class="line"><span>  //查找字符串文本为&#39;1&#39;的Widget，验证查找失败</span></span>
<span class="line"><span>  expect(find.text(&#39;1&#39;), findsNothing);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //查找&#39;+&#39;按钮，施加点击行为</span></span>
<span class="line"><span>  await tester.tap(find.byIcon(Icons.add));</span></span>
<span class="line"><span>  //触发其渲染</span></span>
<span class="line"><span>  await tester.pump();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //查找字符串文本为&#39;0&#39;的Widget，验证查找失败</span></span>
<span class="line"><span>  expect(find.text(&#39;0&#39;), findsNothing);</span></span>
<span class="line"><span>  //查找字符串文本为&#39;1&#39;的Widget，验证查找成功</span></span>
<span class="line"><span>  expect(find.text(&#39;1&#39;), findsOneWidget);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这段UI测试用例代码，同样也顺利通过验证了。</p><p>除了点击事件之外，tester还支持其他的交互行为，比如文字输入enterText、拖动drag、长按longPress等，这里我就不再一一赘述了。如果你想深入理解这些内容，可以参考WidgetTester的 <a href="https://api.flutter.dev/flutter/flutter_test/WidgetTester-class.html" target="_blank" rel="noreferrer">官方文档</a> 进行学习。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的分享就到这里，我们总结一下今天的主要内容吧。</p><p>在Flutter中，自动化测试可以分为单元测试和UI测试。</p><p>单元测试的步骤，包括定义、执行和验证。通过单元测试用例，我们可以验证单个函数、方法或类，其行为表现是否与预期一致。而UI测试的步骤，同样是包括定义、执行和验证。我们可以通过模仿真实用户的行为，对应用进行交互操作，覆盖更广的流程。</p><p>如果测试对象存在像Web服务这样的外部依赖，为了让单元测试过程更为可控，我们可以使用mockito为其定制任意的数据返回，实现正常和异常两种测试用例。</p><p>需要注意的是，尽管UI测试扩大了应用的测试范围，可以找到单元测试期间无法找到的错误，不过相比于单元测试用例来说，UI测试用例的开发和维护代价非常高。因为一个移动应用最主要的功能其实就是UI，而UI的变化非常频繁，UI测试需要不断的维护才能保持稳定可用的状态。</p><p>“投入和回报”永远是考虑是否采用UI测试，以及采用何种级别的UI测试，需要最优先考虑的问题。我推荐的原则是，项目达到一定的规模，并且业务特征具有一定的延续规律性后，再考虑UI测试的必要性。</p><p>我把今天分享涉及的知识点打包到了 <a href="https://github.com/cyndibaby905/38_test_app" target="_blank" rel="noreferrer">GitHub</a> 中，你可以下载下来，反复运行几次，加深理解与记忆。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留下一道思考题吧。</p><p>在下面的代码中，我们定义了SharedPreferences的更新和递增方法。请你使用mockito模拟SharedPreferences的方式，来为这两个方法实现对应的单元测试用例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Future&lt;​bool&gt;updateSP(SharedPreferences prefs, int counter) async {</span></span>
<span class="line"><span>  bool result = await prefs.setInt(&#39;counter&#39;, counter);</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Future&lt;​int&gt;increaseSPCounter(SharedPreferences prefs) async {</span></span>
<span class="line"><span>  int counter = (prefs.getInt(&#39;counter&#39;) ?? 0) + 1;</span></span>
<span class="line"><span>  await updateSP(prefs, counter);</span></span>
<span class="line"><span>  return counter;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,80)])])}const h=n(t,[["render",l]]);export{g as __pageData,h as default};
