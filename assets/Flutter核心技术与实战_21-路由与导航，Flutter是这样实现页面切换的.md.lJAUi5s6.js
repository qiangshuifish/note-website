import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"21 | 路由与导航，Flutter是这样实现页面切换的","description":"","frontmatter":{},"headers":[{"level":2,"title":"路由管理","slug":"路由管理","link":"#路由管理","children":[{"level":3,"title":"基本路由","slug":"基本路由","link":"#基本路由","children":[]},{"level":3,"title":"命名路由","slug":"命名路由","link":"#命名路由","children":[]},{"level":3,"title":"页面参数","slug":"页面参数","link":"#页面参数","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/21-路由与导航，Flutter是这样实现页面切换的.md","filePath":"Flutter核心技术与实战/21-路由与导航，Flutter是这样实现页面切换的.md","lastUpdated":1779815654000}'),t={name:"Flutter核心技术与实战/21-路由与导航，Flutter是这样实现页面切换的.md"};function l(i,a,o,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_21-路由与导航-flutter是这样实现页面切换的" tabindex="-1">21 | 路由与导航，Flutter是这样实现页面切换的 <a class="header-anchor" href="#_21-路由与导航-flutter是这样实现页面切换的" aria-label="Permalink to &quot;21 | 路由与导航，Flutter是这样实现页面切换的&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我带你一起学习了如何在Flutter中实现跨组件数据传递。其中，InheritedWidget适用于子Widget跨层共享父Widget数据的场景，如果子Widget还需要修改父Widget数据，则需要和State一起配套使用。而Notification，则适用于父Widget监听子Widget事件的场景。对于没有父子关系的通信双方，我们还可以使用EventBus实现基于订阅/发布模式的机制实现数据交互。</p><p>如果说UI框架的视图元素的基本单位是组件，那应用程序的基本单位就是页面了。对于拥有多个页面的应用程序而言，如何从一个页面平滑地过渡到另一个页面，我们需要有一个统一的机制来管理页面之间的跳转，通常被称为 <strong>路由管理或导航管理</strong>。</p><p>我们首先需要知道目标页面对象，在完成目标页面初始化后，用框架提供的方式打开它。比如，在Android/iOS中我们通常会初始化一个Intent或ViewController，通过startActivity或pushViewController来打开一个新的页面；而在React中，我们使用navigation来管理所有页面，只要知道页面的名称，就可以立即导航到这个页面。</p><p>其实，Flutter的路由管理也借鉴了这两种设计思路。那么，今天我们就来看看，如何在一个Flutter应用中管理不同页面的命名和过渡。</p><h2 id="路由管理" tabindex="-1">路由管理 <a class="header-anchor" href="#路由管理" aria-label="Permalink to &quot;路由管理&quot;">​</a></h2><p>在Flutter中，页面之间的跳转是通过Route和Navigator来管理的：</p><ul><li>Route是页面的抽象，主要负责创建对应的界面，接收参数，响应Navigator打开和关闭；</li><li>而Navigator则会维护一个路由栈管理Route，Route打开即入栈，Route关闭即出栈，还可以直接替换栈内的某一个Route。</li></ul><p>而根据是否需要提前注册页面标识符，Flutter中的路由管理可以分为两种方式：</p><ul><li>基本路由。无需提前注册，在页面切换时需要自己构造页面实例。</li><li>命名路由。需要提前注册页面标识符，在页面切换时通过标识符直接打开新的路由。</li></ul><p>接下来，我们先一起看看基本路由这种管理方式吧。</p><h3 id="基本路由" tabindex="-1">基本路由 <a class="header-anchor" href="#基本路由" aria-label="Permalink to &quot;基本路由&quot;">​</a></h3><p>在Flutter中， <strong>基本路由的使用方法和Android/iOS打开新页面的方式非常相似</strong>。要导航到一个新的页面，我们需要创建一个MaterialPageRoute的实例，调用Navigator.push方法将新页面压到堆栈的顶部。</p><p>其中，MaterialPageRoute是一种路由模板，定义了路由创建及切换过渡动画的相关配置，可以针对不同平台，实现与平台页面切换动画风格一致的路由切换动画。</p><p>而如果我们想返回上一个页面，则需要调用Navigator.pop方法从堆栈中删除这个页面。</p><p>下面的代码演示了基本路由的使用方法：在第一个页面的按钮事件中打开第二个页面，并在第二个页面的按钮事件中回退到第一个页面：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class FirstScreen extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return RaisedButton(</span></span>
<span class="line"><span>      //打开页面</span></span>
<span class="line"><span>      onPressed: ()=&gt; Navigator.push(context, MaterialPageRoute(builder: (context) =&gt; SecondScreen()));</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class SecondPage extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return RaisedButton(</span></span>
<span class="line"><span>      // 回退页面</span></span>
<span class="line"><span>      onPressed: ()=&gt; Navigator.pop(context)</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行一下代码，效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118421/18956211d36dffacea40592a2cc9cd10.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118421/18956211d36dffacea40592a2cc9cd10.gif" alt=""></a></p><p>图1 基本路由示例</p><p>可以看到，基本路由的使用还是比较简单的。接下来，我们再看看命名路由的使用方法。</p><h3 id="命名路由" tabindex="-1">命名路由 <a class="header-anchor" href="#命名路由" aria-label="Permalink to &quot;命名路由&quot;">​</a></h3><p>基本路由使用方式相对简单灵活，适用于应用中页面不多的场景。而在应用中页面比较多的情况下，再使用基本路由方式，那么每次跳转到一个新的页面，我们都要手动创建MaterialPageRoute实例，初始化页面，然后调用push方法打开它，还是比较麻烦的。</p><p>所以，Flutter提供了另外一种方式来简化路由管理，即命名路由。我们给页面起一个名字，然后就可以直接通过页面名字打开它了。这种方式简单直观， <strong>与React中的navigation使用方式类似</strong>。</p><p>要想通过名字来指定页面切换，我们必须先给应用程序MaterialApp提供一个页面名称映射规则，即路由表routes，这样Flutter才知道名字与页面Widget的对应关系。</p><p>路由表实际上是一个Map&lt;​String,WidgetBuilder&gt;，其中key值对应页面名字，而value值则是一个WidgetBuilder回调函数，我们需要在这个函数中创建对应的页面。而一旦在路由表中定义好了页面名字，我们就可以使用Navigator.pushNamed来打开页面了。</p><p>下面的代码演示了命名路由的使用方法：在MaterialApp完成了页面的名字second_page及页面的初始化方法注册绑定，后续我们就可以在代码中以second_page这个名字打开页面了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MaterialApp(</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    //注册路由</span></span>
<span class="line"><span>    routes:{</span></span>
<span class="line"><span>      &quot;second_page&quot;:(context)=&gt;SecondPage(),</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>//使用名字打开页面</span></span>
<span class="line"><span>Navigator.pushNamed(context,&quot;second_page&quot;);</span></span></code></pre></div><p>可以看到，命名路由的使用也很简单。</p><p>不过 <strong>由于路由的注册和使用都采用字符串来标识，这就会带来一个隐患</strong>：如果我们打开了一个不存在的路由会怎么办？</p><p>也许你会想到，我们可以约定使用字符串常量去定义、使用路由，但我们无法避免通过接口数据下发的错误路由标识符场景。面对这种情况，无论是直接报错或是不响应错误路由，都不是一个用户体验良好的解决办法。</p><p><strong>更好的办法是</strong>，对用户进行友好的错误提示，比如跳转到一个统一的NotFoundScreen页面，也方便我们对这类错误进行统一收集、上报。</p><p>在注册路由表时，Flutter提供了UnknownRoute属性，我们可以对未知的路由标识符进行统一的页面跳转处理。</p><p>下面的代码演示了如何注册错误路由处理。和基本路由的使用方法类似，我们只需要返回一个固定的页面即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MaterialApp(</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    //注册路由</span></span>
<span class="line"><span>    routes:{</span></span>
<span class="line"><span>      &quot;second_page&quot;:(context)=&gt;SecondPage(),</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    //错误路由处理，统一返回UnknownPage</span></span>
<span class="line"><span>    onUnknownRoute: (RouteSettings setting) =&gt; MaterialPageRoute(builder: (context) =&gt; UnknownPage()),</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//使用错误名字打开页面</span></span>
<span class="line"><span>Navigator.pushNamed(context,&quot;unknown_page&quot;);</span></span></code></pre></div><p>运行一下代码，可以看到，我们的应用不仅可以处理正确的页面路由标识，对错误的页面路由标识符也可以统一跳转到固定的错误处理页面了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118421/dc007d9b1313c88a22aa27b3e1f5a897.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118421/dc007d9b1313c88a22aa27b3e1f5a897.gif" alt=""></a></p><p>图2 命名路由示例</p><h3 id="页面参数" tabindex="-1">页面参数 <a class="header-anchor" href="#页面参数" aria-label="Permalink to &quot;页面参数&quot;">​</a></h3><p>与基本路由能够精确地控制目标页面初始化方式不同，命名路由只能通过字符串名字来初始化固定目标页面。为了解决不同场景下目标页面的初始化需求，Flutter提供了路由参数的机制，可以在打开路由时传递相关参数，在目标页面通过RouteSettings来获取页面参数。</p><p>下面的代码演示了如何传递并获取参数：使用页面名称second_page打开页面时，传递了一个字符串参数，随后在SecondPage中，我们取出了这个参数，并将它展示在了文本中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//打开页面时传递字符串参数</span></span>
<span class="line"><span>Navigator.of(context).pushNamed(&quot;second_page&quot;, arguments: &quot;Hey&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class SecondPage extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    //取出路由参数</span></span>
<span class="line"><span>    String msg = ModalRoute.of(context).settings.arguments as String;</span></span>
<span class="line"><span>    return Text(msg);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>除了页面打开时需要传递参数，对于特定的页面，在其关闭时，也需要传递参数告知页面处理结果。</p><p>比如在电商场景下，我们会在用户把商品加入购物车时，打开登录页面让用户登录，而在登录操作完成之后，关闭登录页面返回到当前页面时，登录页面会告诉当前页面新的用户身份，当前页面则会用新的用户身份刷新页面。</p><p>与Android提供的startActivityForResult方法可以监听目标页面的处理结果类似，Flutter也提供了 <strong>返回参数</strong> 的机制。在push目标页面时，可以设置目标页面关闭时监听函数，以获取返回参数；而目标页面可以在关闭路由时传递相关参数。</p><p>下面的代码演示了如何获取参数：在SecondPage页面关闭时，传递了一个字符串参数，随后在上一页监听函数中，我们取出了这个参数，并将它展示了出来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SecondPage extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return Scaffold(</span></span>
<span class="line"><span>      body: Column(</span></span>
<span class="line"><span>        children: &lt;​Widget&gt;[</span></span>
<span class="line"><span>          Text(&#39;Message from first screen: $msg&#39;),</span></span>
<span class="line"><span>          RaisedButton(</span></span>
<span class="line"><span>            child: Text(&#39;back&#39;),</span></span>
<span class="line"><span>            //页面关闭时传递参数</span></span>
<span class="line"><span>            onPressed: ()=&gt; Navigator.pop(context,&quot;Hi&quot;)</span></span>
<span class="line"><span>          )</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>      ));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class _FirstPageState extends State&lt;​FirstPage&gt; {</span></span>
<span class="line"><span>  String _msg=&#39;&#39;;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return new Scaffold(</span></span>
<span class="line"><span>      body: Column(children: &lt;​Widget&gt;[</span></span>
<span class="line"><span>        RaisedButton(</span></span>
<span class="line"><span>            child: Text(&#39;命名路由（参数&amp;回调）&#39;),</span></span>
<span class="line"><span>            //打开页面，并监听页面关闭时传递的参数</span></span>
<span class="line"><span>            onPressed: ()=&gt; Navigator.pushNamed(context, &quot;third_page&quot;,arguments: &quot;Hey&quot;).then((msg)=&gt;setState(()=&gt;_msg=msg)),</span></span>
<span class="line"><span>        ),</span></span>
<span class="line"><span>        Text(&#39;Message from Second screen: $_msg&#39;),</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ],),</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行一下，可以看到在关闭SecondPage，重新回到FirstPage页面时，FirstPage把接收到的msg参数展示了出来：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118421/dfb17d88a9755a0a8bafde69ff1df090.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/118421/dfb17d88a9755a0a8bafde69ff1df090.gif" alt=""></a></p><p>图3 页面路由参数</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的分享就到这里。我们简单回顾一下今天的主要内容吧。</p><p>Flutter提供了基本路由和命名路由两种方式，来管理页面间的跳转。其中，基本路由需要自己手动创建页面实例，通过Navigator.push完成页面跳转；而命名路由需要提前注册页面标识符和页面创建方法，通过Navigator.pushNamed传入标识符实现页面跳转。</p><p>对于命名路由，如果我们需要响应错误路由标识符，还需要一并注册UnknownRoute。为了精细化控制路由切换，Flutter提供了页面打开与页面关闭的参数机制，我们可以在页面创建和目标页面关闭时，取出相应的参数。</p><p>可以看到，关于路由导航，Flutter综合了Android、iOS和React的特点，简洁而不失强大。</p><p>而在中大型应用中，我们通常会使用命名路由来管理页面间的切换。命名路由的最重要作用，就是建立了字符串标识符与各个页面之间的映射关系，使得各个页面之间完全解耦，应用内页面的切换只需要通过一个字符串标识符就可以搞定，为后期模块化打好基础。</p><p>我把今天分享所涉及的的知识点打包到了 <a href="https://github.com/cyndibaby905/21_router_demo" target="_blank" rel="noreferrer">GitHub</a> 上，你可以下载工程到本地，多运行几次，从而加深对基本路由、命名路由以及路由参数具体用法的印象。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留下两个小作业吧。</p><ol><li>对于基本路由，如何传递页面参数？</li><li>请实现一个计算页面，这个页面可以对前一个页面传入的2个数值参数进行求和，并在该页面关闭时告知上一页面计算的结果。</li></ol><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,62)])])}const h=s(t,[["render",l]]);export{g as __pageData,h as default};
