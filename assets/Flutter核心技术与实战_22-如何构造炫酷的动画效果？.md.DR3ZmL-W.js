import{_ as a,H as s,f as e,i}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"22 | 如何构造炫酷的动画效果？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Animation、AnimationController与Listener","slug":"animation、animationcontroller与listener","link":"#animation、animationcontroller与listener","children":[]},{"level":2,"title":"AnimatedWidget与AnimatedBuilder","slug":"animatedwidget与animatedbuilder","link":"#animatedwidget与animatedbuilder","children":[]},{"level":2,"title":"hero动画","slug":"hero动画","link":"#hero动画","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/22-如何构造炫酷的动画效果？.md","filePath":"Flutter核心技术与实战/22-如何构造炫酷的动画效果？.md","lastUpdated":1779815654000}'),p={name:"Flutter核心技术与实战/22-如何构造炫酷的动画效果？.md"};function t(l,n,o,r,c,d){return s(),e("div",null,[...n[0]||(n[0]=[i(`<h1 id="_22-如何构造炫酷的动画效果" tabindex="-1">22 | 如何构造炫酷的动画效果？ <a class="header-anchor" href="#_22-如何构造炫酷的动画效果" aria-label="Permalink to &quot;22 | 如何构造炫酷的动画效果？&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我带你一起学习了Flutter中实现页面路由的两种方式：基本路由与命名路由，即手动创建页面进行切换，和通过前置路由注册后提供标识符进行跳转。除此之外，Flutter还在这两种路由方式的基础上，支持页面打开和页面关闭传递参数，可以更精确地控制路由切换。</p><p>通过前面第 <a href="https://time.geekbang.org/column/article/110292" target="_blank" rel="noreferrer">12</a>、 <a href="https://time.geekbang.org/column/article/110859" target="_blank" rel="noreferrer">13</a>、 <a href="https://time.geekbang.org/column/article/110848" target="_blank" rel="noreferrer">14</a> 和 <a href="https://time.geekbang.org/column/article/111673" target="_blank" rel="noreferrer">15</a> 篇文章的学习，我们已经掌握了开发一款样式精美的小型App的基本技能。但当下，用户对于终端页面的要求已经不再满足于只能实现产品功能，除了样式美观之外，还希望交互良好、有趣、自然。</p><p>动画就是提升用户体验的一个重要方式，一个恰当的组件动画或者页面切换动画，不仅能够缓解用户因为等待而带来的情绪问题，还会增加好感。Flutter既然完全接管了渲染层，除了静态的页面布局之外，对组件动画的支持自然也不在话下。</p><p>因此在今天的这篇文章中，我会向你介绍Flutter中动画的实现方法，看看如何让我们的页面动起来。</p><h2 id="animation、animationcontroller与listener" tabindex="-1">Animation、AnimationController与Listener <a class="header-anchor" href="#animation、animationcontroller与listener" aria-label="Permalink to &quot;Animation、AnimationController与Listener&quot;">​</a></h2><p>动画就是动起来的画面，是静态的画面根据事先定义好的规律，在一定时间内不断微调，产生变化效果。而动画实现由静止到动态，主要是靠人眼的视觉残留效应。所以，对动画系统而言，为了实现动画，它需要做三件事儿：</p><ol><li>确定画面变化的规律；</li><li>根据这个规律，设定动画周期，启动动画；</li><li>定期获取当前动画的值，不断地微调、重绘画面。</li></ol><p>这三件事情对应到Flutter中，就是Animation、AnimationController与Listener：</p><ol><li>Animation是Flutter动画库中的核心类，会根据预定规则，在单位时间内持续输出动画的当前状态。Animation知道当前动画的状态（比如，动画是否开始、停止、前进或者后退，以及动画的当前值），但却不知道这些状态究竟应用在哪个组件对象上。换句话说，Animation仅仅是用来提供动画数据，而不负责动画的渲染。</li><li>AnimationController用于管理Animation，可以用来设置动画的时长、启动动画、暂停动画、反转动画等。</li><li>Listener是Animation的回调函数，用来监听动画的进度变化，我们需要在这个回调函数中，根据动画的当前值重新渲染组件，实现动画的渲染。</li></ol><p>接下来，我们看一个具体的案例：让大屏幕中间的Flutter Logo由小变大。</p><p>首先，我们初始化了一个动画周期为1秒的、用于管理动画的AnimationController对象，并用线性变化的Tween创建了一个变化范围从50到200的Animaiton对象。</p><p>然后，我们给这个Animaiton对象设置了一个进度监听器，并在进度监听器中强制界面重绘，刷新动画状态。</p><p>接下来，我们调用AnimationController对象的forward方法，启动动画：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class _AnimateAppState extends State&lt;​AnimateApp&gt; with SingleTickerProviderStateMixin {</span></span>
<span class="line"><span>  AnimationController controller;</span></span>
<span class="line"><span>  Animation&lt;​double&gt; animation;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void initState() {</span></span>
<span class="line"><span>    super.initState();</span></span>
<span class="line"><span>    //创建动画周期为1秒的AnimationController对象</span></span>
<span class="line"><span>    controller = AnimationController(</span></span>
<span class="line"><span>        vsync: this, duration: const Duration(milliseconds: 1000));</span></span>
<span class="line"><span>    // 创建从50到200线性变化的Animation对象</span></span>
<span class="line"><span>    animation = Tween(begin: 50.0, end: 200.0).animate(controller)</span></span>
<span class="line"><span>      ..addListener(() {</span></span>
<span class="line"><span>        setState(() {}); //刷新界面</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    controller.forward(); //启动动画</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要注意的是，我们在创建AnimationController的时候，设置了一个vsync属性。这个属性是用来防止出现不可见动画的。vsync对象会把动画绑定到一个Widget，当Widget不显示时，动画将会暂停，当Widget再次显示时，动画会重新恢复执行，这样就可以避免动画的组件不在当前屏幕时白白消耗资源。</p><p>我们在一开始提到，Animation只是用于提供动画数据，并不负责动画渲染，所以我们还需要在Widget的build方法中，把当前动画状态的值读出来，用于设置Flutter Logo容器的宽和高，才能最终实现动画效果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@override</span></span>
<span class="line"><span>@override</span></span>
<span class="line"><span>Widget build(BuildContext context) {</span></span>
<span class="line"><span>  return MaterialApp(</span></span>
<span class="line"><span>    home: Center(</span></span>
<span class="line"><span>      child: Container(</span></span>
<span class="line"><span>      width: animation.value, // 将动画的值赋给widget的宽高</span></span>
<span class="line"><span>      height: animation.value,</span></span>
<span class="line"><span>      child: FlutterLogo()</span></span>
<span class="line"><span>    )));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，别忘了在页面销毁时，要释放动画资源：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@override</span></span>
<span class="line"><span>void dispose() {</span></span>
<span class="line"><span>  controller.dispose(); // 释放资源</span></span>
<span class="line"><span>  super.dispose();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们试着运行一下，可以看到，Flutter Logo动起来了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/c73f5a245ecea87be428a83634ec12db.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/c73f5a245ecea87be428a83634ec12db.gif" alt=""></a></p><p>图1 动画示例</p><p>我们在上面用到的Tween默认是线性变化的，但可以创建CurvedAnimation来实现非线性曲线动画。CurvedAnimation提供了很多常用的曲线，比如震荡曲线elasticOut：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//创建动画周期为1秒的AnimationController对象</span></span>
<span class="line"><span>controller = AnimationController(</span></span>
<span class="line"><span>    vsync: this, duration: const Duration(milliseconds: 1000));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//创建一条震荡曲线</span></span>
<span class="line"><span>final CurvedAnimation curve = CurvedAnimation(</span></span>
<span class="line"><span>    parent: controller, curve: Curves.elasticOut);</span></span>
<span class="line"><span>// 创建从50到200跟随振荡曲线变化的Animation对象</span></span>
<span class="line"><span>animation = Tween(begin: 50.0, end: 200.0).animate(curve)</span></span></code></pre></div><p>运行一下，可以看到Flutter Logo有了一个弹性动画：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/ce0f1ce6380329e3d9194518e2be2d05.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/ce0f1ce6380329e3d9194518e2be2d05.gif" alt=""></a></p><p>图2 CurvedAnimation 示例</p><p>现在的问题是，这些动画只能执行一次。如果想让它像心跳一样执行，有两个办法：</p><ol><li>在启动动画时，使用repeat(reverse: true)，让动画来回重复执行。</li><li>监听动画状态。在动画结束时，反向执行；在动画反向执行完毕时，重新启动执行。</li></ol><p>具体的实现代码，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//以下两段语句等价</span></span>
<span class="line"><span>//第一段</span></span>
<span class="line"><span>controller.repeat(reverse: true);//让动画重复执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//第二段</span></span>
<span class="line"><span>animation.addStatusListener((status) {</span></span>
<span class="line"><span>    if (status == AnimationStatus.completed) {</span></span>
<span class="line"><span>      controller.reverse();//动画结束时反向执行</span></span>
<span class="line"><span>    } else if (status == AnimationStatus.dismissed) {</span></span>
<span class="line"><span>      controller.forward();//动画反向执行完毕时，重新执行</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>controller.forward();//启动动画</span></span></code></pre></div><p>运行一下，可以看到，我们实现了Flutter Logo的心跳效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/a7e5b1fd635a557cb4289273bd299e48.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/a7e5b1fd635a557cb4289273bd299e48.gif" alt=""></a></p><p>图3 Flutter Logo心跳</p><h2 id="animatedwidget与animatedbuilder" tabindex="-1">AnimatedWidget与AnimatedBuilder <a class="header-anchor" href="#animatedwidget与animatedbuilder" aria-label="Permalink to &quot;AnimatedWidget与AnimatedBuilder&quot;">​</a></h2><p>在为Widget添加动画效果的过程中我们不难发现，Animation仅提供动画的数据，因此我们还需要监听动画执行进度，并在回调中使用setState强制刷新界面才能看到动画效果。考虑到这些步骤都是固定的，Flutter提供了两个类来帮我们简化这一步骤，即AnimatedWidget与AnimatedBuilder。</p><p>接下来，我们分别看看这两个类如何使用。</p><p>在构建Widget时，AnimatedWidget会将Animation的状态与其子Widget的视觉样式绑定。要使用AnimatedWidget，我们需要一个继承自它的新类，并接收Animation对象作为其初始化参数。然后，在build方法中，读取出Animation对象的当前值，用作初始化Widget的样式。</p><p>下面的案例演示了Flutter Logo的AnimatedWidget版本：用AnimatedLogo继承了AnimatedWidget，并在build方法中，把动画的值与容器的宽高做了绑定：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class AnimatedLogo extends AnimatedWidget {</span></span>
<span class="line"><span>  //AnimatedWidget需要在初始化时传入animation对象</span></span>
<span class="line"><span>  AnimatedLogo({Key key, Animation&lt;​double&gt; animation})</span></span>
<span class="line"><span>      : super(key: key, listenable: animation);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    //取出动画对象</span></span>
<span class="line"><span>    final Animation&lt;​double&gt; animation = listenable;</span></span>
<span class="line"><span>    return Center(</span></span>
<span class="line"><span>      child: Container(</span></span>
<span class="line"><span>        height: animation.value,//根据动画对象的当前状态更新宽高</span></span>
<span class="line"><span>        width: animation.value,</span></span>
<span class="line"><span>        child: FlutterLogo(),</span></span>
<span class="line"><span>    ));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在使用时，我们只需把Animation对象传入AnimatedLogo即可，再也不用监听动画的执行进度刷新UI了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MaterialApp(</span></span>
<span class="line"><span>  home: Scaffold(</span></span>
<span class="line"><span>    body: AnimatedLogo(animation: animation)//初始化AnimatedWidget时传入animation对象</span></span>
<span class="line"><span>));</span></span></code></pre></div><p>在上面的例子中，在AnimatedLogo的build方法中，我们使用Animation的value作为logo的宽和高。这样做对于简单组件的动画没有任何问题，但如果动画的组件比较复杂，一个更好的解决方案是， <strong>将动画和渲染职责分离</strong>：logo作为外部参数传入，只做显示；而尺寸的变化动画则由另一个类去管理。</p><p>这个分离工作，我们可以借助AnimatedBuilder来完成。</p><p>与AnimatedWidget类似，AnimatedBuilder也会自动监听Animation对象的变化，并根据需要将该控件树标记为dirty以自动刷新UI。事实上，如果你翻看 <a href="https://github.com/flutter/flutter/blob/ca5411e3aa99d571ddd80b75b814718c4a94c839/packages/flutter/lib/src/widgets/transitions.dart#L920" target="_blank" rel="noreferrer">源码</a>，就会发现AnimatedBuilder其实也是继承自AnimatedWidget。</p><p>我们以一个例子来演示如何使用AnimatedBuilder。在这个例子中，AnimatedBuilder的尺寸变化动画由builder函数管理，渲染则由外部传入child参数负责：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MaterialApp(</span></span>
<span class="line"><span>  home: Scaffold(</span></span>
<span class="line"><span>    body: Center(</span></span>
<span class="line"><span>      child: AnimatedBuilder(</span></span>
<span class="line"><span>        animation: animation,//传入动画对象</span></span>
<span class="line"><span>        child:FlutterLogo(),</span></span>
<span class="line"><span>        //动画构建回调</span></span>
<span class="line"><span>        builder: (context, child) =&gt; Container(</span></span>
<span class="line"><span>          width: animation.value,//使用动画的当前状态更新UI</span></span>
<span class="line"><span>          height: animation.value,</span></span>
<span class="line"><span>          child: child, //child参数即FlutterLogo()</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>      )</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>));</span></span></code></pre></div><p>可以看到，通过使用AnimatedWidget和AnimatedBuilder，动画的生成和最终的渲染被分离开了，构建动画的工作也被大大简化了。</p><h2 id="hero动画" tabindex="-1">hero动画 <a class="header-anchor" href="#hero动画" aria-label="Permalink to &quot;hero动画&quot;">​</a></h2><p>现在我们已经知道了如何在一个页面上实现动画效果，那么如何实现在两个页面之间切换的过渡动画呢？比如在社交类App，在Feed流中点击小图进入查看大图页面的场景中，我们希望能够实现小图到大图页面逐步放大的动画切换效果，而当用户关闭大图时，也实现原路返回的动画。</p><p>这样的跨页面共享的控件动画效果有一个专门的名词，即“共享元素变换”（Shared Element Transition）。</p><p>对于Android开发者来说，这个概念并不陌生。Android原生提供了对这种动画效果的支持，通过几行代码，就可以实现在两个Activity共享的组件之间做出流畅的转场动画。</p><p>又比如，Keynote提供了的“神奇移动”（Magic Move）功能，可以实现两个Keynote页面之间的流畅过渡。</p><p>Flutter也有类似的概念，即Hero控件。 <strong>通过Hero，我们可以在两个页面的共享元素之间，做出流畅的页面切换效果。</strong></p><p>接下来，我们通过一个案例来看看Hero组件具体如何使用。</p><p>在下面的例子中，我定义了两个页面，其中page1有一个位于底部的小Flutter Logo，page2有一个位于中部的大Flutter Logo。在点击了page1的小logo后，会使用hero效果过渡到page2。</p><p>为了实现共享元素变换，我们需要将这两个组件分别用Hero包裹，并同时为它们设置相同的tag “hero”。然后，为page1添加点击手势响应，在用户点击logo时，跳转到page2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Page1 extends StatelessWidget {</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return  Scaffold(</span></span>
<span class="line"><span>      body: GestureDetector(//手势监听点击</span></span>
<span class="line"><span>        child: Hero(</span></span>
<span class="line"><span>          tag: &#39;hero&#39;,//设置共享tag</span></span>
<span class="line"><span>          child: Container(</span></span>
<span class="line"><span>            width: 100, height: 100,</span></span>
<span class="line"><span>            child: FlutterLogo())),</span></span>
<span class="line"><span>        onTap: () {</span></span>
<span class="line"><span>          Navigator.of(context).push(MaterialPageRoute(builder: (_)=&gt;Page2()));//点击后打开第二个页面</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>      )</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Page2 extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return  Scaffold(</span></span>
<span class="line"><span>      body: Hero(</span></span>
<span class="line"><span>        tag: &#39;hero&#39;,//设置共享tag</span></span>
<span class="line"><span>        child: Container(</span></span>
<span class="line"><span>          width: 300, height: 300,</span></span>
<span class="line"><span>          child: FlutterLogo()</span></span>
<span class="line"><span>        ))</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行一下，可以看到，我们通过简单的两步，就可以实现元素跨页面飞行的复杂动画效果了！</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/c5fe68b6e627d8285ed6aadf932abcd6.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/119148/c5fe68b6e627d8285ed6aadf932abcd6.gif" alt=""></a></p><p>图4 Hero动画</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的分享就到这里。我们简单回顾一下今天的主要内容吧。</p><p>在Flutter中，动画的状态与渲染是分离的。我们通过Animation生成动画曲线，使用AnimationController控制动画时间、启动动画。而动画的渲染，则需要设置监听器获取动画进度后，重新触发组件用新的动画状态刷新后才能实现动画的更新。</p><p>为了简化这一步骤，Flutter提供了AnimatedWidget和AnimatedBuilder这两个组件，省去了状态监听和UI刷新的工作。而对于跨页面动画，Flutter提供了Hero组件，只要两个相同（相似）的组件有同样的tag，就能实现元素跨页面过渡的转场效果。</p><p>可以看到，Flutter对于动画的分层设计还是非常简单清晰的，但造成的副作用就是使用起来稍微麻烦一些。对于实际应用而言，由于动画过程涉及到页面的频繁刷新，因此我强烈建议你尽量使用AnimatedWidget或AnimatedBuilder来缩小受动画影响的组件范围，只重绘需要做动画的组件即可，要避免使用进度监听器直接刷新整个页面，让不需要做动画的组件也跟着一起销毁重建。</p><p>我把今天分享中所涉及的针对控件的普通动画，AnimatedBuilder和AnimatedWidget，以及针对页面的过渡动画Hero打包到了 <a href="https://github.com/cyndibaby905/22_app_animation" target="_blank" rel="noreferrer">GitHub</a> 上，你可以把工程下载下来，多运行几次，体会这几种动画的具体使用方法。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留下两个小作业吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AnimatedBuilder(</span></span>
<span class="line"><span>  animation: animation,</span></span>
<span class="line"><span>  child:FlutterLogo(),</span></span>
<span class="line"><span>  builder: (context, child) =&gt; Container(</span></span>
<span class="line"><span>    width: animation.value,</span></span>
<span class="line"><span>    height: animation.value,</span></span>
<span class="line"><span>    child: child</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span>)</span></span></code></pre></div><ol><li>在AnimatedBuilder的例子中，child似乎被指定了两遍（第3行的child与第7行的child），你可以解释下这么做的原因吗？</li><li>如果我把第3行的child删掉，把Flutter Logo放到第7行，动画是否能正常执行？这会有什么问题吗？</li></ol><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,74)])])}const h=a(p,[["render",t]]);export{u as __pageData,h as default};
