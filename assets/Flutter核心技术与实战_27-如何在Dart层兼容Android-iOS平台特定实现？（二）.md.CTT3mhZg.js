import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"27 | 如何在Dart层兼容Android/iOS平台特定实现？（二）","description":"","frontmatter":{},"headers":[{"level":2,"title":"构建一个复杂App都需要什么？","slug":"构建一个复杂app都需要什么","link":"#构建一个复杂app都需要什么","children":[]},{"level":2,"title":"平台视图","slug":"平台视图","link":"#平台视图","children":[{"level":3,"title":"Flutter如何实现原生视图的接口调用？","slug":"flutter如何实现原生视图的接口调用","link":"#flutter如何实现原生视图的接口调用","children":[]},{"level":3,"title":"如何在原生系统实现接口？","slug":"如何在原生系统实现接口","link":"#如何在原生系统实现接口","children":[]}]},{"level":2,"title":"如何在程序运行时，动态地调整原生视图的样式？","slug":"如何在程序运行时-动态地调整原生视图的样式","link":"#如何在程序运行时-动态地调整原生视图的样式","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/27-如何在Dart层兼容Android-iOS平台特定实现？（二）.md","filePath":"Flutter核心技术与实战/27-如何在Dart层兼容Android-iOS平台特定实现？（二）.md","lastUpdated":1779815654000}'),l={name:"Flutter核心技术与实战/27-如何在Dart层兼容Android-iOS平台特定实现？（二）.md"};function t(i,n,r,c,o,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_27-如何在dart层兼容android-ios平台特定实现-二" tabindex="-1">27 | 如何在Dart层兼容Android/iOS平台特定实现？（二） <a class="header-anchor" href="#_27-如何在dart层兼容android-ios平台特定实现-二" aria-label="Permalink to &quot;27 | 如何在Dart层兼容Android/iOS平台特定实现？（二）&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我与你介绍了方法通道，这种在Flutter中实现调用原生Android、iOS代码的轻量级解决方案。使用方法通道，我们可以把原生代码所拥有的能力，以接口形式提供给Dart。</p><p>这样，当发起方法调用时，Flutter应用会以类似网络异步调用的方式，将请求数据通过一个唯一标识符指定的方法通道传输至原生代码宿主；而原生代码处理完毕后，会将响应结果通过方法通道回传至Flutter，从而实现Dart代码与原生Android、iOS代码的交互。这，与调用一个本地的Dart 异步API并无太多区别。</p><p>通过方法通道，我们可以把原生操作系统提供的底层能力，以及现有原生开发中一些相对成熟的解决方案，以接口封装的形式在Dart层快速搞定，从而解决原生代码在Flutter上的复用问题。然后，我们可以利用Flutter本身提供的丰富控件，做好UI渲染。</p><p>底层能力+应用层渲染，看似我们已经搞定了搭建一个复杂App的所有内容。但，真的是这样吗？</p><h2 id="构建一个复杂app都需要什么" tabindex="-1">构建一个复杂App都需要什么？ <a class="header-anchor" href="#构建一个复杂app都需要什么" aria-label="Permalink to &quot;构建一个复杂App都需要什么？&quot;">​</a></h2><p>别急，在下结论之前，我们先按照四象限分析法，把能力和渲染分解成四个维度，分析构建一个复杂App都需要什么。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/d1826dfb3a8b688db04cbf5beb04f2cc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/d1826dfb3a8b688db04cbf5beb04f2cc.png" alt=""></a></p><p>图1 四象限分析法</p><p>经过分析，我们终于发现，原来构建一个App需要覆盖那么多的知识点，通过Flutter和方法通道只能搞定应用层渲染、应用层能力和底层能力，对于那些涉及到底层渲染，比如浏览器、相机、地图，以及原生自定义视图的场景，自己在Flutter上重新开发一套显然不太现实。</p><p>在这种情况下，使用混合视图看起来是一个不错的选择。我们可以在Flutter的Widget树中提前预留一块空白区域，在Flutter的画板中（即FlutterView与FlutterViewController）嵌入一个与空白区域完全匹配的原生视图，就可以实现想要的视觉效果了。</p><p>但是，采用这种方案极其不优雅，因为嵌入的原生视图并不在Flutter的渲染层级中，需要同时在Flutter侧与原生侧做大量的适配工作，才能实现正常的用户交互体验。</p><p>幸运的是，Flutter提供了一个平台视图（Platform View）的概念。它提供了一种方法，允许开发者在Flutter里面嵌入原生系统（Android和iOS）的视图，并加入到Flutter的渲染树中，实现与Flutter一致的交互体验。</p><p>这样一来，通过平台视图，我们就可以将一个原生控件包装成Flutter控件，嵌入到Flutter页面中，就像使用一个普通的Widget一样。</p><p>接下来，我就与你详细讲述如何使用平台视图。</p><h2 id="平台视图" tabindex="-1">平台视图 <a class="header-anchor" href="#平台视图" aria-label="Permalink to &quot;平台视图&quot;">​</a></h2><p>如果说方法通道解决的是原生能力逻辑复用问题，那么平台视图解决的就是原生视图复用问题。Flutter提供了一种轻量级的方法，让我们可以创建原生（Android和iOS）的视图，通过一些简单的Dart层接口封装之后，就可以将它插入Widget树中，实现原生视图与Flutter视图的混用。</p><p>一次典型的平台视图使用过程与方法通道类似：</p><ul><li>首先，由作为客户端的Flutter，通过向原生视图的Flutter封装类（在iOS和Android平台分别是UIKitView和AndroidView）传入视图标识符，用于发起原生视图的创建请求；</li><li>然后，原生代码侧将对应原生视图的创建交给平台视图工厂（PlatformViewFactory）实现；</li><li>最后，在原生代码侧将视图标识符与平台视图工厂进行关联注册，让Flutter发起的视图创建请求可以直接找到对应的视图创建工厂。</li></ul><p>至此，我们就可以像使用Widget那样，使用原生视图了。整个流程，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/2b3afbb05585c474e4dc2d18bf6066e8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/2b3afbb05585c474e4dc2d18bf6066e8.png" alt=""></a></p><p>图2 平台视图示例</p><p>接下来，我以一个具体的案例，也就是将一个红色的原生视图内嵌到Flutter中，与你演示如何使用平台视图。这部分内容主要包括两部分：</p><ul><li>作为调用发起方的Flutter，如何实现原生视图的接口调用？</li><li>如何在原生（Android和iOS）系统实现接口？</li></ul><p>接下来，我将分别与你讲述这两个问题。</p><h3 id="flutter如何实现原生视图的接口调用" tabindex="-1">Flutter如何实现原生视图的接口调用？ <a class="header-anchor" href="#flutter如何实现原生视图的接口调用" aria-label="Permalink to &quot;Flutter如何实现原生视图的接口调用？&quot;">​</a></h3><p>在下面的代码中，我们在SampleView的内部，分别使用了原生Android、iOS视图的封装类AndroidView和UIkitView，并传入了一个唯一标识符，用于和原生视图建立关联：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SampleView extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    //使用Android平台的AndroidView，传入唯一标识符sampleView</span></span>
<span class="line"><span>    if (defaultTargetPlatform == TargetPlatform.android) {</span></span>
<span class="line"><span>      return AndroidView(viewType: &#39;sampleView&#39;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      //使用iOS平台的UIKitView，传入唯一标识符sampleView</span></span>
<span class="line"><span>      return UiKitView(viewType: &#39;sampleView&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，平台视图在Flutter侧的使用方式比较简单，与普通Widget并无明显区别。而关于普通Widget的使用方式，你可以参考第 <a href="https://time.geekbang.org/column/article/110292" target="_blank" rel="noreferrer">12</a>、 <a href="https://time.geekbang.org/column/article/110859" target="_blank" rel="noreferrer">13</a> 篇的相关内容进行复习。</p><p>调用方的实现搞定了。接下来，我们需要在原生代码中完成视图创建的封装，建立相关的绑定关系。同样的，由于需要同时适配Android和iOS平台，我们需要分别在两个系统上完成对应的接口实现。</p><h3 id="如何在原生系统实现接口" tabindex="-1">如何在原生系统实现接口？ <a class="header-anchor" href="#如何在原生系统实现接口" aria-label="Permalink to &quot;如何在原生系统实现接口？&quot;">​</a></h3><p>首先，我们来看看 <strong>Android端的实现</strong>。在下面的代码中，我们分别创建了平台视图工厂和原生视图封装类，并通过视图工厂的create方法，将它们关联起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//视图工厂类</span></span>
<span class="line"><span>class SampleViewFactory extends PlatformViewFactory {</span></span>
<span class="line"><span>    private final BinaryMessenger messenger;</span></span>
<span class="line"><span>    //初始化方法</span></span>
<span class="line"><span>    public SampleViewFactory(BinaryMessenger msger) {</span></span>
<span class="line"><span>        super(StandardMessageCodec.INSTANCE);</span></span>
<span class="line"><span>        messenger = msger;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //创建原生视图封装类，完成关联</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public PlatformView create(Context context, int id, Object obj) {</span></span>
<span class="line"><span>        return new SimpleViewControl(context, id, messenger);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//原生视图封装类</span></span>
<span class="line"><span>class SimpleViewControl implements PlatformView {</span></span>
<span class="line"><span>    private final View view;//缓存原生视图</span></span>
<span class="line"><span>    //初始化方法，提前创建好视图</span></span>
<span class="line"><span>    public SimpleViewControl(Context context, int id, BinaryMessenger messenger) {</span></span>
<span class="line"><span>        view = new View(context);</span></span>
<span class="line"><span>        view.setBackgroundColor(Color.rgb(255, 0, 0));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回原生视图</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public View getView() {</span></span>
<span class="line"><span>        return view;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //原生视图销毁回调</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void dispose() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>将原生视图封装类与原生视图工厂完成关联后，接下来就需要将Flutter侧的调用与视图工厂绑定起来了。与上一篇文章讲述的方法通道类似，我们仍然需要在MainActivity中进行绑定操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void onCreate(Bundle savedInstanceState) {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  Registrar registrar =    registrarFor(&quot;samples.chenhang/native_views&quot;);//生成注册类</span></span>
<span class="line"><span>  SampleViewFactory playerViewFactory = new SampleViewFactory(registrar.messenger());//生成视图工厂</span></span>
<span class="line"><span></span></span>
<span class="line"><span>registrar.platformViewRegistry().registerViewFactory(&quot;sampleView&quot;, playerViewFactory);//注册视图工厂</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成绑定之后，平台视图调用响应的Android部分就搞定了。</p><p>接下来，我们再来看看 <strong>iOS端的实现</strong>。</p><p>与Android类似，我们同样需要分别创建平台视图工厂和原生视图封装类，并通过视图工厂的create方法，将它们关联起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//平台视图工厂</span></span>
<span class="line"><span>@interface SampleViewFactory : NSObject&lt;​FlutterPlatformViewFactory&gt;</span></span>
<span class="line"><span>- (instancetype)initWithMessenger:(NSObject&lt;​FlutterBinaryMessenger&gt;*)messager;</span></span>
<span class="line"><span>@end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@implementation SampleViewFactory{</span></span>
<span class="line"><span>  NSObject&lt;​FlutterBinaryMessenger&gt;*_messenger;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- (instancetype)initWithMessenger:(NSObject&lt;​FlutterBinaryMessenger&gt; *)messager{</span></span>
<span class="line"><span>  self = [super init];</span></span>
<span class="line"><span>  if (self) {</span></span>
<span class="line"><span>    _messenger = messager;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return self;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-(NSObject&lt;​FlutterMessageCodec&gt; *)createArgsCodec{</span></span>
<span class="line"><span>  return [FlutterStandardMessageCodec sharedInstance];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//创建原生视图封装实例</span></span>
<span class="line"><span>-(NSObject&lt;​FlutterPlatformView&gt; *)createWithFrame:(CGRect)frame viewIdentifier:(int64_t)viewId arguments:(id)args{</span></span>
<span class="line"><span>  SampleViewControl *activity = [[SampleViewControl alloc] initWithWithFrame:frame viewIdentifier:viewId arguments:args binaryMessenger:_messenger];</span></span>
<span class="line"><span>  return activity;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//平台视图封装类</span></span>
<span class="line"><span>@interface SampleViewControl : NSObject&lt;​FlutterPlatformView&gt;</span></span>
<span class="line"><span>- (instancetype)initWithWithFrame:(CGRect)frame viewIdentifier:(int64_t)viewId arguments:(id _Nullable)args binaryMessenger:(NSObject&lt;​FlutterBinaryMessenger&gt;*)messenger;</span></span>
<span class="line"><span>@end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@implementation SampleViewControl{</span></span>
<span class="line"><span>    UIView * _templcateView;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//创建原生视图</span></span>
<span class="line"><span>- (instancetype)initWithWithFrame:(CGRect)frame viewIdentifier:(int64_t)viewId arguments:(id)args binaryMessenger:(NSObject&lt;​FlutterBinaryMessenger&gt; *)messenger{</span></span>
<span class="line"><span>  if ([super init]) {</span></span>
<span class="line"><span>    _templcateView = [[UIView alloc] init];</span></span>
<span class="line"><span>    _templcateView.backgroundColor = [UIColor redColor];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return self;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-(UIView *)view{</span></span>
<span class="line"><span>  return _templcateView;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@end</span></span></code></pre></div><p>然后，我们同样需要把原生视图的创建与Flutter侧的调用关联起来，才可以在Flutter侧找到原生视图的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {</span></span>
<span class="line"><span>  NSObject&lt;​FlutterPluginRegistrar&gt;* registrar = [self registrarForPlugin:@&quot;samples.chenhang/native_views&quot;];//生成注册类</span></span>
<span class="line"><span>  SampleViewFactory* viewFactory = [[SampleViewFactory alloc] initWithMessenger:registrar.messenger];//生成视图工厂</span></span>
<span class="line"><span>    [registrar registerViewFactory:viewFactory withId:@&quot;sampleView&quot;];//注册视图工厂</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要注意的是，在iOS平台上，Flutter内嵌UIKitView目前还处于技术预览状态，因此我们还需要在Info.plist文件中增加一项配置，把内嵌原生视图的功能开关设置为true，才能打开这个隐藏功能：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;​dict&gt;</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  &lt;​key&gt;io.flutter.embedded_views_preview&lt;​/key&gt;</span></span>
<span class="line"><span>  &lt;​true/&gt;</span></span>
<span class="line"><span>  ....</span></span>
<span class="line"><span>&lt;​/dict&gt;</span></span></code></pre></div><p>经过上面的封装与绑定，Android端与iOS端的平台视图功能都已经实现了。接下来，我们就可以在Flutter应用里，像使用普通Widget一样，去内嵌原生视图了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> Scaffold(</span></span>
<span class="line"><span>        backgroundColor: Colors.yellowAccent,</span></span>
<span class="line"><span>        body:  Container(width: 200, height:200,</span></span>
<span class="line"><span>            child: SampleView(controller: controller)</span></span>
<span class="line"><span>        ));</span></span></code></pre></div><p>如下所示，我们分别在iOS和Android平台的Flutter应用上，内嵌了一个红色的原生视图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/095093cea18f8e18b6de2c94e447d03f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/095093cea18f8e18b6de2c94e447d03f.png" alt=""></a></p><p>图3 内嵌原生视图示例</p><p>在上面的例子中，我们将原生视图封装在一个StatelessWidget中，可以有效应对静态展示的场景。如果我们需要在程序运行时动态调整原生视图的样式，又该如何处理呢？</p><h2 id="如何在程序运行时-动态地调整原生视图的样式" tabindex="-1">如何在程序运行时，动态地调整原生视图的样式？ <a class="header-anchor" href="#如何在程序运行时-动态地调整原生视图的样式" aria-label="Permalink to &quot;如何在程序运行时，动态地调整原生视图的样式？&quot;">​</a></h2><p>与基于声明式的Flutter Widget，每次变化只能以数据驱动其视图销毁重建不同，原生视图是基于命令式的，可以精确地控制视图展示样式。因此，我们可以在原生视图的封装类中，将其持有的修改视图实例相关的接口，以方法通道的方式暴露给Flutter，让Flutter也可以拥有动态调整视图视觉样式的能力。</p><p>接下来，我以一个具体的案例来演示如何在程序运行时动态调整内嵌原生视图的背景颜色。</p><p>在这个案例中，我们会用到原生视图的一个初始化属性，即onPlatformViewCreated：原生视图会在其创建完成后，以回调的形式通知视图id，因此我们可以在这个时候注册方法通道，让后续的视图修改请求通过这条通道传递给原生视图。</p><p>由于我们在底层直接持有了原生视图的实例，因此理论上可以直接在这个原生视图的Flutter封装类上提供视图修改方法，而不管它到底是StatelessWidget还是StatefulWidget。但为了遵照Flutter的Widget设计理念，我们还是决定将视图展示与视图控制分离，即：将原生视图封装为一个StatefulWidget专门用于展示，通过其controller初始化参数，在运行期修改原生视图的展示效果。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//原生视图控制器</span></span>
<span class="line"><span>class NativeViewController {</span></span>
<span class="line"><span>  MethodChannel _channel;</span></span>
<span class="line"><span>  //原生视图完成创建后，通过id生成唯一方法通道</span></span>
<span class="line"><span>  onCreate(int id) {</span></span>
<span class="line"><span>    _channel = MethodChannel(&#39;samples.chenhang/native_views_$id&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //调用原生视图方法，改变背景颜色</span></span>
<span class="line"><span>  Future&lt;​void&gt; changeBackgroundColor() async {</span></span>
<span class="line"><span>    return _channel.invokeMethod(&#39;changeBackgroundColor&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//原生视图Flutter侧封装，继承自StatefulWidget</span></span>
<span class="line"><span>class SampleView extends StatefulWidget {</span></span>
<span class="line"><span>  const SampleView({</span></span>
<span class="line"><span>    Key key,</span></span>
<span class="line"><span>    this.controller,</span></span>
<span class="line"><span>  }) : super(key: key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //持有视图控制器</span></span>
<span class="line"><span>  final NativeViewController controller;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  State&lt;​StatefulWidget&gt; createState() =&gt; _SampleViewState();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class _SampleViewState extends State&lt;​SampleView&gt; {</span></span>
<span class="line"><span>  //根据平台确定返回何种平台视图</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    if (defaultTargetPlatform == TargetPlatform.android) {</span></span>
<span class="line"><span>      return AndroidView(</span></span>
<span class="line"><span>        viewType: &#39;sampleView&#39;,</span></span>
<span class="line"><span>        //原生视图创建完成后，通过onPlatformViewCreated产生回调</span></span>
<span class="line"><span>        onPlatformViewCreated: _onPlatformViewCreated,</span></span>
<span class="line"><span>      );</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      return UiKitView(viewType: &#39;sampleView&#39;,</span></span>
<span class="line"><span>        //原生视图创建完成后，通过onPlatformViewCreated产生回调</span></span>
<span class="line"><span>        onPlatformViewCreated: _onPlatformViewCreated</span></span>
<span class="line"><span>      );</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //原生视图创建完成后，调用control的onCreate方法，传入view id</span></span>
<span class="line"><span>  _onPlatformViewCreated(int id) {</span></span>
<span class="line"><span>    if (widget.controller == null) {</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    widget.controller.onCreate(id);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Flutter的调用方实现搞定了，接下来我们分别看看Android和iOS端的实现。</p><p>程序的整体结构与之前并无不同，只是在进行原生视图初始化时，我们需要完成方法通道的注册和相关事件的处理；在响应方法调用消息时，我们需要判断方法名，如果完全匹配，则修改视图背景，否则返回异常。</p><p>Android端接口实现代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SimpleViewControl implements PlatformView, MethodCallHandler {</span></span>
<span class="line"><span>    private final MethodChannel methodChannel;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    public SimpleViewControl(Context context, int id, BinaryMessenger messenger) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        //用view id注册方法通道</span></span>
<span class="line"><span>        methodChannel = new MethodChannel(messenger, &quot;samples.chenhang/native_views_&quot; + id);</span></span>
<span class="line"><span>        //设置方法通道回调</span></span>
<span class="line"><span>        methodChannel.setMethodCallHandler(this);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //处理方法调用消息</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void onMethodCall(MethodCall methodCall, MethodChannel.Result result) {</span></span>
<span class="line"><span>        //如果方法名完全匹配</span></span>
<span class="line"><span>        if (methodCall.method.equals(&quot;changeBackgroundColor&quot;)) {</span></span>
<span class="line"><span>            //修改视图背景，返回成功</span></span>
<span class="line"><span>            view.setBackgroundColor(Color.rgb(0, 0, 255));</span></span>
<span class="line"><span>            result.success(0);</span></span>
<span class="line"><span>        }else {</span></span>
<span class="line"><span>            //调用方发起了一个不支持的API调用</span></span>
<span class="line"><span>            result.notImplemented();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>iOS端接口实现代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@implementation SampleViewControl{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    FlutterMethodChannel* _channel;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- (instancetype)initWithWithFrame:(CGRect)frame viewIdentifier:(int64_t)viewId arguments:(id)args binaryMessenger:(NSObject&lt;​FlutterBinaryMessenger&gt; *)messenger{</span></span>
<span class="line"><span>    if ([super init]) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        //使用view id完成方法通道的创建</span></span>
<span class="line"><span>        _channel = [FlutterMethodChannel methodChannelWithName:[NSString stringWithFormat:@&quot;samples.chenhang/native_views_%lld&quot;, viewId] binaryMessenger:messenger];</span></span>
<span class="line"><span>        //设置方法通道的处理回调</span></span>
<span class="line"><span>        __weak __typeof__(self) weakSelf = self;</span></span>
<span class="line"><span>        [_channel setMethodCallHandler:^(FlutterMethodCall* call, FlutterResult result) {</span></span>
<span class="line"><span>            [weakSelf onMethodCall:call result:result];</span></span>
<span class="line"><span>        }];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return self;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//响应方法调用消息</span></span>
<span class="line"><span>- (void)onMethodCall:(FlutterMethodCall*)call result:(FlutterResult)result {</span></span>
<span class="line"><span>    //如果方法名完全匹配</span></span>
<span class="line"><span>    if ([[call method] isEqualToString:@&quot;changeBackgroundColor&quot;]) {</span></span>
<span class="line"><span>        //修改视图背景色，返回成功</span></span>
<span class="line"><span>        _templcateView.backgroundColor = [UIColor blueColor];</span></span>
<span class="line"><span>        result(@0);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //调用方发起了一个不支持的API调用</span></span>
<span class="line"><span>        result(FlutterMethodNotImplemented);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>@end</span></span></code></pre></div><p>通过注册方法通道，以及暴露的changeBackgroundColor接口，Android端与iOS端修改平台视图背景颜色的功能都已经实现了。接下来，我们就可以在Flutter应用运行期间，修改原生视图展示样式了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class DefaultState extends State&lt;​DefaultPage&gt; {</span></span>
<span class="line"><span>  NativeViewController controller;</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void initState() {</span></span>
<span class="line"><span>    controller = NativeViewController();//初始化原生View控制器</span></span>
<span class="line"><span>	super.initState();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return Scaffold(</span></span>
<span class="line"><span>          ...</span></span>
<span class="line"><span>          //内嵌原生View</span></span>
<span class="line"><span>          body:  Container(width: 200, height:200,</span></span>
<span class="line"><span>              child: SampleView(controller: controller)</span></span>
<span class="line"><span>          ),</span></span>
<span class="line"><span>         //设置点击行为：改变视图颜色</span></span>
<span class="line"><span>         floatingActionButton: FloatingActionButton(onPressed: ()=&gt;controller.changeBackgroundColor())</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行一下，效果如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/fd1f6d7280aaacb3294d7733706fc8ac.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/128510/fd1f6d7280aaacb3294d7733706fc8ac.gif" alt=""></a></p><p>图4 动态修改原生视图样式</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的分享就到这里。我们总结一下今天的主要内容吧。</p><p>平台视图解决了原生渲染能力的复用问题，使得Flutter能够通过轻量级的代码封装，把原生视图组装成一个Flutter控件。</p><p>Flutter提供了平台视图工厂和视图标识符两个概念，因此Dart层发起的视图创建请求可以通过标识符直接找到对应的视图创建工厂，从而实现原生视图与Flutter视图的融合复用。对于需要在运行期动态调用原生视图接口的需求，我们可以在原生视图的封装类中注册方法通道，实现精确控制原生视图展示的效果。</p><p>需要注意的是，由于Flutter与原生渲染方式完全不同，因此转换不同的渲染数据会有较大的性能开销。如果在一个界面上同时实例化多个原生控件，就会对性能造成非常大的影响，所以我们要避免在使用Flutter控件也能实现的情况下去使用内嵌平台视图。</p><p>因为这样做，一方面需要分别在Android和iOS端写大量的适配桥接代码，违背了跨平台技术的本意，也增加了后续的维护成本；另一方面毕竟除去地图、WebView、相机等涉及底层方案的特殊情况外，大部分原生代码能够实现的UI效果，完全可以用Flutter实现。</p><p>我把今天分享所涉及到的知识点打包到了 <a href="https://github.com/cyndibaby905/27_native_view" target="_blank" rel="noreferrer">GitHub</a> 中，你可以下载下来，反复运行几次，加深理解。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留下一道思考题吧。</p><p>请你在动态调整原生视图样式的代码基础上，增加颜色参数，以实现动态变更原生视图颜色的需求。</p><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,78)])])}const h=s(l,[["render",t]]);export{g as __pageData,h as default};
