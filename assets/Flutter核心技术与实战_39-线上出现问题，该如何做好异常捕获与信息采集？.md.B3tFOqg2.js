import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"39 | 线上出现问题，该如何做好异常捕获与信息采集？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Flutter异常","slug":"flutter异常","link":"#flutter异常","children":[]},{"level":2,"title":"App异常的捕获方式","slug":"app异常的捕获方式","link":"#app异常的捕获方式","children":[]},{"level":2,"title":"Framework异常的捕获方式","slug":"framework异常的捕获方式","link":"#framework异常的捕获方式","children":[]},{"level":2,"title":"异常上报","slug":"异常上报","link":"#异常上报","children":[{"level":3,"title":"Dart接口实现","slug":"dart接口实现","link":"#dart接口实现","children":[]},{"level":3,"title":"iOS接口实现","slug":"ios接口实现","link":"#ios接口实现","children":[]},{"level":3,"title":"Android接口实现","slug":"android接口实现","link":"#android接口实现","children":[]},{"level":3,"title":"应用工程配置","slug":"应用工程配置","link":"#应用工程配置","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/39-线上出现问题，该如何做好异常捕获与信息采集？.md","filePath":"Flutter核心技术与实战/39-线上出现问题，该如何做好异常捕获与信息采集？.md","lastUpdated":1779815654000}'),t={name:"Flutter核心技术与实战/39-线上出现问题，该如何做好异常捕获与信息采集？.md"};function l(i,s,r,c,o,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_39-线上出现问题-该如何做好异常捕获与信息采集" tabindex="-1">39 | 线上出现问题，该如何做好异常捕获与信息采集？ <a class="header-anchor" href="#_39-线上出现问题-该如何做好异常捕获与信息采集" aria-label="Permalink to &quot;39 | 线上出现问题，该如何做好异常捕获与信息采集？&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我与你分享了如何为一个Flutter工程编写自动化测试用例。设计一个测试用例的基本步骤可以分为3步，即定义、执行和验证，而Flutter提供的单元测试和UI测试框架则可以帮助我们简化这些步骤。</p><p>其中，通过单元测试，我们可以很方便地验证单个函数、方法或类的行为，还可以利用mockito定制外部依赖返回任意数据，从而让测试更可控；而UI测试则提供了与Widget交互的能力，我们可以模仿用户行为，对应用进行相应的交互操作，确认其功能是否符合预期。</p><p>通过自动化测试，我们可以把重复的人工操作变成自动化的验证步骤，从而在开发阶段更及时地发现问题。但终端设备的碎片化，使得我们终究无法在应用开发期就完全模拟出真实用户的运行环境。所以，无论我们的应用写得多么完美、测试得多么全面，总是无法完全避免线上的异常问题。</p><p>这些异常，可能是因为不充分的机型适配、用户糟糕的网络状况；也可能是因为Flutter框架自身的Bug，甚至是操作系统底层的问题。这些异常一旦发生，Flutter应用会无法响应用户的交互事件，轻则报错，重则功能无法使用甚至闪退，这对用户来说都相当不友好，是开发者最不愿意看到的。</p><p>所以，我们要想办法去捕获用户的异常信息，将异常现场保存起来，并上传至服务器，这样我们就可以分析异常上下文，定位引起异常的原因，去解决此类问题了。那么今天，我们就一起来学习下Flutter异常的捕获和信息采集，以及对应的数据上报处理。</p><h2 id="flutter异常" tabindex="-1">Flutter异常 <a class="header-anchor" href="#flutter异常" aria-label="Permalink to &quot;Flutter异常&quot;">​</a></h2><p>Flutter异常指的是，Flutter程序中Dart代码运行时意外发生的错误事件。我们可以通过与Java类似的try-catch机制来捕获它。但 <strong>与Java不同的是，Dart程序不强制要求我们必须处理异常</strong>。</p><p>这是因为，Dart采用事件循环的机制来运行任务，所以各个任务的运行状态是互相独立的。也就是说，即便某个任务出现了异常我们没有捕获它，Dart程序也不会退出，只会导致当前任务后续的代码不会被执行，用户仍可以继续使用其他功能。</p><p>Dart异常，根据来源又可以细分为App异常和Framework异常。Flutter为这两种异常提供了不同的捕获方式，接下来我们就一起看看吧。</p><h2 id="app异常的捕获方式" tabindex="-1">App异常的捕获方式 <a class="header-anchor" href="#app异常的捕获方式" aria-label="Permalink to &quot;App异常的捕获方式&quot;">​</a></h2><p>App异常，就是应用代码的异常，通常由未处理应用层其他模块所抛出的异常引起。根据异常代码的执行时序，App异常可以分为两类，即同步异常和异步异常：同步异常可以通过try-catch机制捕获，异步异常则需要采用Future提供的catchError语句捕获。</p><p>这两种异常的捕获方式，如下代码所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//使用try-catch捕获同步异常</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  throw StateError(&#39;This is a Dart exception.&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch(e) {</span></span>
<span class="line"><span>  print(e);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//使用catchError捕获异步异常</span></span>
<span class="line"><span>Future.delayed(Duration(seconds: 1))</span></span>
<span class="line"><span>    .then((e) =&gt; throw StateError(&#39;This is a Dart exception in Future.&#39;))</span></span>
<span class="line"><span>    .catchError((e)=&gt;print(e));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//注意，以下代码无法捕获异步异常</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  Future.delayed(Duration(seconds: 1))</span></span>
<span class="line"><span>      .then((e) =&gt; throw StateError(&#39;This is a Dart exception in Future.&#39;))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch(e) {</span></span>
<span class="line"><span>  print(&quot;This line will never be executed. &quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要注意的是，这两种方式是不能混用的。可以看到，在上面的代码中，我们是无法使用try-catch去捕获一个异步调用所抛出的异常的。</p><p>同步的try-catch和异步的catchError，为我们提供了直接捕获特定异常的能力，而如果我们想集中管理代码中的所有异常，Flutter也提供了Zone.runZoned方法。</p><p>我们可以给代码执行对象指定一个Zone，在Dart中，Zone表示一个代码执行的环境范围，其概念类似沙盒，不同沙盒之间是互相隔离的。如果我们想要观察沙盒中代码执行出现的异常，沙盒提供了onError回调函数，拦截那些在代码执行对象中的未捕获异常。</p><p>在下面的代码中，我们将可能抛出异常的语句放置在了Zone里。可以看到，在没有使用try-catch和catchError的情况下，无论是同步异常还是异步异常，都可以通过Zone直接捕获到：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>runZoned(() {</span></span>
<span class="line"><span>  //同步抛出异常</span></span>
<span class="line"><span>  throw StateError(&#39;This is a Dart exception.&#39;);</span></span>
<span class="line"><span>}, onError: (dynamic e, StackTrace stack) {</span></span>
<span class="line"><span>  print(&#39;Sync error caught by zone&#39;);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>runZoned(() {</span></span>
<span class="line"><span>  //异步抛出异常</span></span>
<span class="line"><span>  Future.delayed(Duration(seconds: 1))</span></span>
<span class="line"><span>      .then((e) =&gt; throw StateError(&#39;This is a Dart exception in Future.&#39;));</span></span>
<span class="line"><span>}, onError: (dynamic e, StackTrace stack) {</span></span>
<span class="line"><span>  print(&#39;Async error aught by zone&#39;);</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>因此，如果我们想要集中捕获Flutter应用中的未处理异常，可以把main函数中的runApp语句也放置在Zone中。这样在检测到代码中运行异常时，我们就能根据获取到的异常上下文信息，进行统一处理了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>runZoned&lt;​Future&lt;​Null&gt;&gt;(() async {</span></span>
<span class="line"><span>  runApp(MyApp());</span></span>
<span class="line"><span>}, onError: (error, stackTrace) async {</span></span>
<span class="line"><span> //Do sth for error</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>接下来，我们再看看Framework异常应该如何捕获吧。</p><h2 id="framework异常的捕获方式" tabindex="-1">Framework异常的捕获方式 <a class="header-anchor" href="#framework异常的捕获方式" aria-label="Permalink to &quot;Framework异常的捕获方式&quot;">​</a></h2><p>Framework异常，就是Flutter框架引发的异常，通常是由应用代码触发了Flutter框架底层的异常判断引起的。比如，当布局不合规范时，Flutter就会自动弹出一个触目惊心的红色错误界面，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/e1169d19bd616705e035464020df5604.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/e1169d19bd616705e035464020df5604.png" alt=""></a></p><p>图1 Flutter布局错误提示</p><p>这其实是因为，Flutter框架在调用build方法构建页面时进行了try-catch 的处理，并提供了一个ErrorWidget，用于在出现异常时进行信息提示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@override</span></span>
<span class="line"><span>void performRebuild() {</span></span>
<span class="line"><span>  Widget built;</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    //创建页面</span></span>
<span class="line"><span>    built = build();</span></span>
<span class="line"><span>  } catch (e, stack) {</span></span>
<span class="line"><span>    //使用ErrorWidget创建页面</span></span>
<span class="line"><span>    built = ErrorWidget.builder(_debugReportException(ErrorDescription(&quot;building $this&quot;), e, stack));</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个页面反馈的信息比较丰富，适合开发期定位问题。但如果让用户看到这样一个页面，就很糟糕了。因此，我们通常会重写ErrorWidget.builder方法，将这样的错误提示页面替换成一个更加友好的页面。</p><p>下面的代码演示了自定义错误页面的具体方法。在这个例子中，我们直接返回了一个居中的Text控件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ErrorWidget.builder = (FlutterErrorDetails flutterErrorDetails){</span></span>
<span class="line"><span>  return Scaffold(</span></span>
<span class="line"><span>    body: Center(</span></span>
<span class="line"><span>      child: Text(&quot;Custom Error Widget&quot;),</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>运行效果如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/032d9bda533fa00a4b8cb86ffd2310a8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/032d9bda533fa00a4b8cb86ffd2310a8.png" alt=""></a></p><p>图2 自定义错误提示页面</p><p>比起之前触目惊心的红色错误页面，白色主题的自定义页面看起来稍微友好些了。需要注意的是，ErrorWidget.builder方法提供了一个参数details用于表示当前的错误上下文，为避免用户直接看到错误信息，这里我们并没有将它展示到界面上。但是，我们不能丢弃掉这样的异常信息，需要提供统一的异常处理机制，用于后续分析异常原因。</p><p>为了集中处理框架异常， <strong>Flutter提供了FlutterError类，这个类的onError属性会在接收到框架异常时执行相应的回调</strong>。因此，要实现自定义捕获逻辑，我们只要为它提供一个自定义的错误处理回调即可。</p><p>在下面的代码中，我们使用Zone提供的handleUncaughtError语句，将Flutter框架的异常统一转发到当前的Zone中，这样我们就可以统一使用Zone去处理应用内的所有异常了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FlutterError.onError = (FlutterErrorDetails details) async {</span></span>
<span class="line"><span>  //转发至Zone中</span></span>
<span class="line"><span>  Zone.current.handleUncaughtError(details.exception, details.stack);</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>runZoned&lt;​Future&lt;​Null&gt;&gt;(() async {</span></span>
<span class="line"><span>  runApp(MyApp());</span></span>
<span class="line"><span>}, onError: (error, stackTrace) async {</span></span>
<span class="line"><span> //Do sth for error</span></span>
<span class="line"><span>});</span></span></code></pre></div><h2 id="异常上报" tabindex="-1">异常上报 <a class="header-anchor" href="#异常上报" aria-label="Permalink to &quot;异常上报&quot;">​</a></h2><p>到目前为止，我们已经捕获到了应用中所有的未处理异常。但如果只是把这些异常在控制台中打印出来还是没办法解决问题，我们还需要把它们上报到开发者能看到的地方，用于后续分析定位并解决问题。</p><p>关于开发者数据上报，目前市面上有很多优秀的第三方SDK服务厂商，比如友盟、Bugly，以及开源的Sentry等，而它们提供的功能和接入流程都是类似的。考虑到Bugly的社区活跃度比较高，因此我就以它为例，与你演示在抓取到异常后，如何实现自定义数据上报。</p><h3 id="dart接口实现" tabindex="-1">Dart接口实现 <a class="header-anchor" href="#dart接口实现" aria-label="Permalink to &quot;Dart接口实现&quot;">​</a></h3><p>目前Bugly仅提供了原生Android/iOS的SDK，因此我们需要采用与第31篇文章“ <a href="https://time.geekbang.org/column/article/132818" target="_blank" rel="noreferrer">如何实现原生推送能力</a>？”中同样的插件工程，为Bugly的数据上报提供Dart层接口。</p><p>与接入Push能力相比，接入数据上报要简单得多，我们只需要完成一些前置应用信息关联绑定和SDK初始化工作，就可以使用Dart层封装好的数据上报接口去上报异常了。可以看到，对于一个应用而言，接入数据上报服务的过程，总体上可以分为两个步骤：</p><ol><li>初始化Bugly SDK；</li><li>使用数据上报接口。</li></ol><p>这两步对应着在Dart层需要封装的2个原生接口调用，即setup和postException，它们都是在方法通道上调用原生代码宿主提供的方法。考虑到数据上报是整个应用共享的能力，因此我们将数据上报类FlutterCrashPlugin的接口都封装成了单例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class FlutterCrashPlugin {</span></span>
<span class="line"><span>  //初始化方法通道</span></span>
<span class="line"><span>  static const MethodChannel _channel =</span></span>
<span class="line"><span>      const MethodChannel(&#39;flutter_crash_plugin&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static void setUp(appID) {</span></span>
<span class="line"><span>    //使用app_id进行SDK注册</span></span>
<span class="line"><span>    _channel.invokeMethod(&quot;setUp&quot;,{&#39;app_id&#39;:appID});</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  static void postException(error, stack) {</span></span>
<span class="line"><span>    //将异常和堆栈上报至Bugly</span></span>
<span class="line"><span>    _channel.invokeMethod(&quot;postException&quot;,{&#39;crash_message&#39;:error.toString(),&#39;crash_detail&#39;:stack.toString()});</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Dart层是原生代码宿主的代理，可以看到这一层的接口设计还是比较简单的。接下来，我们分别去接管数据上报的Android和iOS平台上完成相应的实现。</p><h3 id="ios接口实现" tabindex="-1">iOS接口实现 <a class="header-anchor" href="#ios接口实现" aria-label="Permalink to &quot;iOS接口实现&quot;">​</a></h3><p>考虑到iOS平台的数据上报配置工作相对较少，因此我们先用Xcode打开example下的iOS工程进行插件开发工作。需要注意的是，由于iOS子工程的运行依赖于Flutter工程编译构建产物，所以在打开iOS工程进行开发前，你需要确保整个工程代码至少build过一次，否则IDE会报错。</p><blockquote><p>备注：以下操作步骤参考 <a href="https://bugly.qq.com/docs/user-guide/instruction-manual-ios/?v=20190712210424" target="_blank" rel="noreferrer">Bugly异常上报iOS SDK接入指南</a>。</p></blockquote><p><strong>首先</strong>，我们需要在插件工程下的flutter_crash_plugin.podspec文件中引入Bugly SDK，即Bugly，这样我们就可以在原生工程中使用Bugly提供的数据上报功能了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Pod::Spec.new do |s|</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  s.dependency &#39;Bugly&#39;</span></span>
<span class="line"><span>end</span></span></code></pre></div><p><strong>然后</strong>，在原生接口FlutterCrashPlugin类中，依次初始化插件实例、绑定方法通道，并在方法通道中先后为setup与postException提供Bugly iOS SDK的实现版本：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@implementation FlutterCrashPlugin</span></span>
<span class="line"><span>+ (void)registerWithRegistrar:(NSObject&lt;​FlutterPluginRegistrar&gt;*)registrar {</span></span>
<span class="line"><span>    //注册方法通道</span></span>
<span class="line"><span>    FlutterMethodChannel* channel = [FlutterMethodChannel</span></span>
<span class="line"><span>      methodChannelWithName:@&quot;flutter_crash_plugin&quot;</span></span>
<span class="line"><span>            binaryMessenger:[registrar messenger]];</span></span>
<span class="line"><span>    //初始化插件实例，绑定方法通道</span></span>
<span class="line"><span>    FlutterCrashPlugin* instance = [[FlutterCrashPlugin alloc] init];</span></span>
<span class="line"><span>    //注册方法通道回调函数</span></span>
<span class="line"><span>    [registrar addMethodCallDelegate:instance channel:channel];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- (void)handleMethodCall:(FlutterMethodCall*)call result:(FlutterResult)result {</span></span>
<span class="line"><span>    if([@&quot;setUp&quot; isEqualToString:call.method]) {</span></span>
<span class="line"><span>        //Bugly SDK初始化方法</span></span>
<span class="line"><span>        NSString *appID = call.arguments[@&quot;app_id&quot;];</span></span>
<span class="line"><span>        [Bugly startWithAppId:appID];</span></span>
<span class="line"><span>    } else if ([@&quot;postException&quot; isEqualToString:call.method]) {</span></span>
<span class="line"><span>      //获取Bugly数据上报所需要的各个参数信息</span></span>
<span class="line"><span>      NSString *message = call.arguments[@&quot;crash_message&quot;];</span></span>
<span class="line"><span>      NSString *detail = call.arguments[@&quot;crash_detail&quot;];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      NSArray *stack = [detail componentsSeparatedByString:@&quot;\\n&quot;];</span></span>
<span class="line"><span>      //调用Bugly数据上报接口</span></span>
<span class="line"><span>      [Bugly reportExceptionWithCategory:4 name:message reason:stack[0] callStack:stack extraInfo:@{} terminateApp:NO];</span></span>
<span class="line"><span>      result(@0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    //方法未实现</span></span>
<span class="line"><span>    result(FlutterMethodNotImplemented);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@end</span></span></code></pre></div><p>至此，在完成了Bugly iOS SDK的接口封装之后，FlutterCrashPlugin插件的iOS部分也就搞定了。接下来，我们去看看Android部分如何实现吧。</p><h3 id="android接口实现" tabindex="-1">Android接口实现 <a class="header-anchor" href="#android接口实现" aria-label="Permalink to &quot;Android接口实现&quot;">​</a></h3><p>与iOS类似，我们需要使用Android Studio打开example下的android工程进行插件开发工作。同样，在打开android工程前，你需要确保整个工程代码至少build过一次，否则IDE会报错。</p><blockquote><p>备注：以下操作步骤参考 <a href="https://bugly.qq.com/docs/user-guide/instruction-manual-android/" target="_blank" rel="noreferrer">Bugly异常上报Android SDK接入指南</a></p></blockquote><p><strong>首先</strong>，我们需要在插件工程下的build.gradle文件引入Bugly SDK，即crashreport与nativecrashreport，其中前者提供了Java和自定义异常的的数据上报能力，而后者则是JNI的异常上报封装 ：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dependencies {</span></span>
<span class="line"><span>    implementation &#39;com.tencent.bugly:crashreport:latest.release&#39;</span></span>
<span class="line"><span>    implementation &#39;com.tencent.bugly:nativecrashreport:latest.release&#39;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>然后</strong>，在原生接口FlutterCrashPlugin类中，依次初始化插件实例、绑定方法通道，并在方法通道中先后为setup与postException提供Bugly Android SDK的实现版本：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FlutterCrashPlugin implements MethodCallHandler {</span></span>
<span class="line"><span>  //注册器，通常为MainActivity</span></span>
<span class="line"><span>  public final Registrar registrar;</span></span>
<span class="line"><span>  //注册插件</span></span>
<span class="line"><span>  public static void registerWith(Registrar registrar) {</span></span>
<span class="line"><span>    //注册方法通道</span></span>
<span class="line"><span>    final MethodChannel channel = new MethodChannel(registrar.messenger(), &quot;flutter_crash_plugin&quot;);</span></span>
<span class="line"><span>    //初始化插件实例，绑定方法通道，并注册方法通道回调函数</span></span>
<span class="line"><span>    channel.setMethodCallHandler(new FlutterCrashPlugin(registrar));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private FlutterCrashPlugin(Registrar registrar) {</span></span>
<span class="line"><span>    this.registrar = registrar;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void onMethodCall(MethodCall call, Result result) {</span></span>
<span class="line"><span>    if(call.method.equals(&quot;setUp&quot;)) {</span></span>
<span class="line"><span>      //Bugly SDK初始化方法</span></span>
<span class="line"><span>      String appID = call.argument(&quot;app_id&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      CrashReport.initCrashReport(registrar.activity().getApplicationContext(), appID, true);</span></span>
<span class="line"><span>      result.success(0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else if(call.method.equals(&quot;postException&quot;)) {</span></span>
<span class="line"><span>      //获取Bugly数据上报所需要的各个参数信息</span></span>
<span class="line"><span>      String message = call.argument(&quot;crash_message&quot;);</span></span>
<span class="line"><span>      String detail = call.argument(&quot;crash_detail&quot;);</span></span>
<span class="line"><span>      //调用Bugly数据上报接口</span></span>
<span class="line"><span>      CrashReport.postException(4,&quot;Flutter Exception&quot;,message,detail,null);</span></span>
<span class="line"><span>      result.success(0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      result.notImplemented();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在完成了Bugly Android接口的封装之后，由于Android系统的权限设置较细，考虑到Bugly还需要网络、日志读取等权限，因此我们还需要在插件工程的AndroidManifest.xml文件中，将这些权限信息显示地声明出来，完成对系统的注册：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;​manifest xmlns:android=&quot;http://schemas.android.com/apk/res/android&quot;</span></span>
<span class="line"><span>  package=&quot;com.hangchen.flutter_crash_plugin&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 电话状态读取权限 --&gt;</span></span>
<span class="line"><span>    &lt;​uses-permission android:name=&quot;android.permission.READ_PHONE_STATE&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!-- 网络权限 --&gt;</span></span>
<span class="line"><span>    &lt;​uses-permission android:name=&quot;android.permission.INTERNET&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!-- 访问网络状态权限 --&gt;</span></span>
<span class="line"><span>    &lt;​uses-permission android:name=&quot;android.permission.ACCESS_NETWORK_STATE&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!-- 访问wifi状态权限 --&gt;</span></span>
<span class="line"><span>    &lt;​uses-permission android:name=&quot;android.permission.ACCESS_WIFI_STATE&quot; /&gt;</span></span>
<span class="line"><span>    &lt;!-- 日志读取权限 --&gt;</span></span>
<span class="line"><span>    &lt;​uses-permission android:name=&quot;android.permission.READ_LOGS&quot; /&gt;</span></span>
<span class="line"><span>&lt;​/manifest&gt;</span></span></code></pre></div><p>至此，在完成了极光Android SDK的接口封装和权限配置之后，FlutterCrashPlugin插件的Android部分也搞定了。</p><p>FlutterCrashPlugin插件为Flutter应用提供了数据上报的封装，不过要想Flutter工程能够真正地上报异常消息，我们还需要为Flutter工程关联Bugly的应用配置。</p><h3 id="应用工程配置" tabindex="-1">应用工程配置 <a class="header-anchor" href="#应用工程配置" aria-label="Permalink to &quot;应用工程配置&quot;">​</a></h3><p>在单独为Android/iOS应用进行数据上报配置之前，我们首先需要去 <a href="https://bugly.qq.com" target="_blank" rel="noreferrer">Bugly的官方网站</a>，为应用注册唯一标识符（即AppKey）。这里需要注意的是，在Bugly中，Android应用与iOS应用被视为不同的产品，所以我们需要分别注册：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/63ca78fb4d188345c1659c9b8fb523f3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/63ca78fb4d188345c1659c9b8fb523f3.png" alt=""></a></p><p>图3 Android应用Demo配置</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/4764fd46d9087c949b9d7270fd0043cb.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/4764fd46d9087c949b9d7270fd0043cb.png" alt=""></a></p><p>图4 iOS应用Demo配置</p><p>在得到了AppKey之后，我们需要 <strong>依次进行Android与iOS的配置工作</strong>。</p><p>iOS的配置工作相对简单，整个配置过程完全是应用与Bugly SDK的关联工作，而这些关联工作仅需要通过Dart层调用setUp接口，访问原生代码宿主所封装的Bugly API就可以完成，因此无需额外操作。</p><p>而Android的配置工作则相对繁琐些。由于涉及NDK和Android P网络安全的适配，我们还需要分别在build.gradle和AndroidManifest.xml文件进行相应的配置工作。</p><p><strong>首先</strong>，由于Bugly SDK需要支持NDK，因此我们需要在App的build.gradle文件中为其增加NDK的架构支持：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>defaultConfig {</span></span>
<span class="line"><span>    ndk {</span></span>
<span class="line"><span>        // 设置支持的SO库架构</span></span>
<span class="line"><span>        abiFilters &#39;armeabi&#39; , &#39;x86&#39;, &#39;armeabi-v7a&#39;, &#39;x86_64&#39;, &#39;arm64-v8a&#39;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>然后</strong>，由于Android P默认限制http明文传输数据，因此我们需要为Bugly声明一项网络安全配置network_security_config.xml，允许其使用http传输数据，并在AndroidManifest.xml中新增同名网络安全配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//res/xml/network_security_config.xml</span></span>
<span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;!-- 网络安全配置 --&gt;</span></span>
<span class="line"><span>&lt;​network-security-config&gt;</span></span>
<span class="line"><span>    &lt;!-- 允许明文传输数据 --&gt;</span></span>
<span class="line"><span>    &lt;​domain-config cleartextTrafficPermitted=&quot;true&quot;&gt;</span></span>
<span class="line"><span>        &lt;!-- 将Bugly的域名加入白名单 --&gt;</span></span>
<span class="line"><span>        &lt;​domain includeSubdomains=&quot;true&quot;&gt;android.bugly.qq.com&lt;​/domain&gt;</span></span>
<span class="line"><span>    &lt;​/domain-config&gt;</span></span>
<span class="line"><span>&lt;​/network-security-config&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//AndroidManifest/xml</span></span>
<span class="line"><span>&lt;​application</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  android:networkSecurityConfig=&quot;@xml/network_security_config&quot;</span></span>
<span class="line"><span>  ...&gt;</span></span>
<span class="line"><span>&lt;​/application&gt;</span></span></code></pre></div><p>至此，Flutter工程所需的原生配置工作和接口实现，就全部搞定了。</p><p>接下来，我们就可以在Flutter工程中的main.dart文件中， <strong>使用FlutterCrashPlugin插件来实现异常数据上报能力了</strong>。当然，我们 <strong>首先</strong> 还需要在pubspec.yaml文件中，将工程对它的依赖显示地声明出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dependencies:</span></span>
<span class="line"><span>  flutter_push_plugin:</span></span>
<span class="line"><span>    git:</span></span>
<span class="line"><span>      url: https://github.com/cyndibaby905/39_flutter_crash_plugin</span></span></code></pre></div><p>在下面的代码中，我们在main函数里为应用的异常提供了统一的回调，并在回调函数内使用postException方法将异常上报至Bugly。</p><p>而在SDK的初始化方法里，由于Bugly视iOS和Android为两个独立的应用，因此我们判断了代码的运行宿主，分别使用两个不同的App ID对其进行了初始化工作。</p><p>此外，为了与你演示具体的异常拦截功能，我们还在两个按钮的点击事件处理中分别抛出了同步和异步两类异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//上报数据至Bugly</span></span>
<span class="line"><span>Future&lt;​Null&gt; _reportError(dynamic error, dynamic stackTrace) async {</span></span>
<span class="line"><span>  FlutterCrashPlugin.postException(error, stackTrace);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Future&lt;​Null&gt; main() async {</span></span>
<span class="line"><span>  //注册Flutter框架的异常回调</span></span>
<span class="line"><span>  FlutterError.onError = (FlutterErrorDetails details) async {</span></span>
<span class="line"><span>    //转发至Zone的错误回调</span></span>
<span class="line"><span>    Zone.current.handleUncaughtError(details.exception, details.stack);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  //自定义错误提示页面</span></span>
<span class="line"><span>  ErrorWidget.builder = (FlutterErrorDetails flutterErrorDetails){</span></span>
<span class="line"><span>    return Scaffold(</span></span>
<span class="line"><span>      body: Center(</span></span>
<span class="line"><span>        child: Text(&quot;Custom Error Widget&quot;),</span></span>
<span class="line"><span>      )</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  //使用runZone方法将runApp的运行放置在Zone中，并提供统一的异常回调</span></span>
<span class="line"><span>  runZoned&lt;​Future&lt;​Null&gt;&gt;(() async {</span></span>
<span class="line"><span>    runApp(MyApp());</span></span>
<span class="line"><span>  }, onError: (error, stackTrace) async {</span></span>
<span class="line"><span>    await _reportError(error, stackTrace);</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyApp extends StatefulWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  State&lt;​StatefulWidget&gt; createState() =&gt; _MyAppState();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class _MyAppState extends State&lt;​MyApp&gt; {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  void initState() {</span></span>
<span class="line"><span>    //由于Bugly视iOS和Android为两个独立的应用，因此需要使用不同的App ID进行初始化</span></span>
<span class="line"><span>    if(Platform.isAndroid){</span></span>
<span class="line"><span>      FlutterCrashPlugin.setUp(&#39;43eed8b173&#39;);</span></span>
<span class="line"><span>    }else if(Platform.isIOS){</span></span>
<span class="line"><span>      FlutterCrashPlugin.setUp(&#39;088aebe0d5&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    super.initState();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return MaterialApp(</span></span>
<span class="line"><span>      home: MyHomePage(),</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyHomePage extends StatelessWidget {</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Widget build(BuildContext context) {</span></span>
<span class="line"><span>    return Scaffold(</span></span>
<span class="line"><span>      appBar: AppBar(</span></span>
<span class="line"><span>        title: Text(&#39;Crashy&#39;),</span></span>
<span class="line"><span>      ),</span></span>
<span class="line"><span>      body: Center(</span></span>
<span class="line"><span>        child: Column(</span></span>
<span class="line"><span>          mainAxisAlignment: MainAxisAlignment.center,</span></span>
<span class="line"><span>          children: &lt;​Widget&gt;[</span></span>
<span class="line"><span>            RaisedButton(</span></span>
<span class="line"><span>              child: Text(&#39;Dart exception&#39;),</span></span>
<span class="line"><span>              onPressed: () {</span></span>
<span class="line"><span>                //触发同步异常</span></span>
<span class="line"><span>                throw StateError(&#39;This is a Dart exception.&#39;);</span></span>
<span class="line"><span>              },</span></span>
<span class="line"><span>            ),</span></span>
<span class="line"><span>            RaisedButton(</span></span>
<span class="line"><span>              child: Text(&#39;async Dart exception&#39;),</span></span>
<span class="line"><span>              onPressed: () {</span></span>
<span class="line"><span>                //触发异步异常</span></span>
<span class="line"><span>                Future.delayed(Duration(seconds: 1))</span></span>
<span class="line"><span>                      .then((e) =&gt; throw StateError(&#39;This is a Dart exception in Future.&#39;));</span></span>
<span class="line"><span>              },</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>          ],</span></span>
<span class="line"><span>        ),</span></span>
<span class="line"><span>      ),</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行这段代码，分别点击Dart exception按钮和async Dart exception按钮几次，可以看到我们的应用以及控制台并没有提示任何异常信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/2c87e21fcfc55b1b80b599032f2de148.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/2c87e21fcfc55b1b80b599032f2de148.png" alt=""></a></p><p>图5 异常拦截演示示例（iOS）</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/dd668e2fe931b66cf315b04fdfedecf7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/dd668e2fe931b66cf315b04fdfedecf7.png" alt=""></a></p><p>图6 异常拦截演示示例（Android）</p><p><strong>然后</strong>，我们打开 <a href="https://bugly.qq.com/v2/workbench/apps" target="_blank" rel="noreferrer">Bugly开发者后台</a>，选择对应的App，切换到错误分析选项查看对应的面板信息。可以看到，Bugly已经成功接收到上报的异常上下文了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/d54b4af764a71ed8865c2888e8df36c0.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/d54b4af764a71ed8865c2888e8df36c0.png" alt=""></a></p><p>图7 Bugly iOS错误分析上报数据查看</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/a819f51de79ea327cd04cff2b4ab7525.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/141164/a819f51de79ea327cd04cff2b4ab7525.png" alt=""></a></p><p>图8 Bugly Android错误分析上报数据查看</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，今天的分享就到这里，我们来小结下吧。</p><p>对于Flutter应用的异常捕获，可以分为单个异常捕获和多异常统一拦截两种情况。</p><p>其中，单异常捕获，使用Dart提供的同步异常try-catch，以及异步异常catchError机制即可实现。而对多个异常的统一拦截，可以细分为如下两种情况：一是App异常，我们可以将代码执行块放置到Zone中，通过onError回调进行统一处理；二是Framework异常，我们可以使用FlutterError.onError回调进行拦截。</p><p>在捕获到异常之后，我们需要上报异常信息，用于后续分析定位问题。考虑到Bugly的社区活跃度比较高，所以我以Bugly为例，与你讲述了以原生插件封装的形式，如何进行异常信息上报。</p><p>需要注意的是，Flutter提供的异常拦截只能拦截Dart层的异常，而无法拦截Engine层的异常。这是因为，Engine层的实现大部分是C++的代码，一旦出现异常，整个程序就直接Crash掉了。不过通常来说，这类异常出现的概率极低，一般都是Flutter底层的Bug，与我们在应用层的实现没太大关系，所以我们也无需过度担心。</p><p>如果我们想要追踪Engine层的异常（比如，给Flutter提Issue），则需要借助于原生系统提供的Crash监听机制。这，就是一个很繁琐的工作了。</p><p>幸运的是，我们使用的数据上报SDK Bugly就提供了这样的能力，可以自动收集原生代码的Crash。而在Bugly收集到对应的Crash之后，我们需要做的事情就是，将Flutter Engine层对应的符号表下载下来，使用Android提供的ndk-stack、iOS提供的symbolicatecrash或atos命令，对相应Crash堆栈进行解析，从而得出Engine层崩溃的具体代码。</p><p>关于这些步骤的详细说明，你可以参考Flutter <a href="https://github.com/flutter/flutter/wiki/Crashes" target="_blank" rel="noreferrer">官方文档</a>。</p><p>我把今天分享涉及的知识点打包到了 <a href="https://github.com/cyndibaby905/39_crashy_demo" target="_blank" rel="noreferrer">GitHub</a> 中，你可以下载下来，反复运行几次，加深理解与记忆。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留下两道思考题吧。</p><p>第一个问题，请扩展_reportError和自定义错误提示页面的实现，在Debug环境下将异常数据打印至控制台，并保留原有系统错误提示页面实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//上报数据至Bugly</span></span>
<span class="line"><span>Future&lt;​Null&gt; _reportError(dynamic error, dynamic stackTrace) async {</span></span>
<span class="line"><span>  FlutterCrashPlugin.postException(error, stackTrace);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//自定义错误提示页面</span></span>
<span class="line"><span>ErrorWidget.builder = (FlutterErrorDetails flutterErrorDetails){</span></span>
<span class="line"><span>  return Scaffold(</span></span>
<span class="line"><span>    body: Center(</span></span>
<span class="line"><span>      child: Text(&quot;Custom Error Widget&quot;),</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>第二个问题，并发Isolate的异常可以通过今天分享中介绍的捕获机制去拦截吗？如果不行，应该怎么做呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//并发Isolate</span></span>
<span class="line"><span>doSth(msg) =&gt; throw ConcurrentModificationError(&#39;This is a Dart exception.&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//主Isolate</span></span>
<span class="line"><span>Isolate.spawn(doSth, &quot;Hi&quot;);</span></span></code></pre></div><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,115)])])}const h=n(t,[["render",l]]);export{g as __pageData,h as default};
