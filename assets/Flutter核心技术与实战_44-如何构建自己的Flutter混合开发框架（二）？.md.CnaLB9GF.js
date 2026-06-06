import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"44 | 如何构建自己的Flutter混合开发框架（二）？","description":"","frontmatter":{},"headers":[{"level":2,"title":"原生插件依赖管理原则","slug":"原生插件依赖管理原则","link":"#原生插件依赖管理原则","children":[]},{"level":2,"title":"网络插件依赖管理实践","slug":"网络插件依赖管理实践","link":"#网络插件依赖管理实践","children":[]},{"level":2,"title":"网络插件接口封装","slug":"网络插件接口封装","link":"#网络插件接口封装","children":[]},{"level":2,"title":"Flutter模块工程依赖管理","slug":"flutter模块工程依赖管理","link":"#flutter模块工程依赖管理","children":[]},{"level":2,"title":"模块工程功能实现","slug":"模块工程功能实现","link":"#模块工程功能实现","children":[]},{"level":2,"title":"构建产物应该如何封装？","slug":"构建产物应该如何封装","link":"#构建产物应该如何封装","children":[{"level":3,"title":"iOS构建产物应该如何封装？","slug":"ios构建产物应该如何封装","link":"#ios构建产物应该如何封装","children":[]},{"level":3,"title":"Android构建产物应该如何封装？","slug":"android构建产物应该如何封装","link":"#android构建产物应该如何封装","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Flutter核心技术与实战/44-如何构建自己的Flutter混合开发框架（二）？.md","filePath":"Flutter核心技术与实战/44-如何构建自己的Flutter混合开发框架（二）？.md","lastUpdated":1779815654000}'),t={name:"Flutter核心技术与实战/44-如何构建自己的Flutter混合开发框架（二）？.md"};function l(i,a,r,o,u,c){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_44-如何构建自己的flutter混合开发框架-二" tabindex="-1">44 | 如何构建自己的Flutter混合开发框架（二）？ <a class="header-anchor" href="#_44-如何构建自己的flutter混合开发框架-二" aria-label="Permalink to &quot;44 | 如何构建自己的Flutter混合开发框架（二）？&quot;">​</a></h1><p>你好，我是陈航。</p><p>在上一篇文章中，我从工程架构与工作模式两个层面，与你介绍了设计Flutter混合框架需要关注的基本设计原则，即确定分工边界。</p><p>在工程架构维度，由于Flutter模块作为原生工程的一个业务依赖，其运行环境是由原生工程提供的，因此我们需要将它们各自抽象为对应技术栈的依赖管理方式，以分层依赖的方式确定二者的边界。</p><p>而在工作模式维度，考虑到Flutter模块开发是原生开发的上游，因此我们只需要从其构建产物的过程入手，抽象出开发过程中的关键节点和高频节点，以命令行的形式进行统一管理。构建产物是Flutter模块的输出，同时也是原生工程的输入，一旦产物完成构建，我们就可以接入原生开发的工作流了。</p><p>可以看到，在Flutter混合框架中，Flutter模块与原生工程是相互依存、互利共赢的关系：</p><ul><li>Flutter跨平台开发效率高，渲染性能和多端体验一致性好，因此在分工上主要专注于实现应用层的独立业务（页面）的渲染闭环；</li><li>而原生开发稳定性高，精细化控制力强，底层基础能力丰富，因此在分工上主要专注于提供整体应用架构，为Flutter模块提供稳定的运行环境及对应的基础能力支持。</li></ul><p>那么，在原生工程中为Flutter模块提供基础能力支撑的过程中，面对跨技术栈的依赖管理，我们该遵循何种原则呢？对于Flutter模块及其依赖的原生插件们，我们又该如何以标准的原生工程依赖形式进行组件封装呢？</p><p>在今天的文章中，我就通过一个典型案例，与你讲述这两个问题的解决办法。</p><h2 id="原生插件依赖管理原则" tabindex="-1">原生插件依赖管理原则 <a class="header-anchor" href="#原生插件依赖管理原则" aria-label="Permalink to &quot;原生插件依赖管理原则&quot;">​</a></h2><p>在前面 <a href="https://time.geekbang.org/column/article/127601" target="_blank" rel="noreferrer">第26</a> 和 <a href="https://time.geekbang.org/column/article/132818" target="_blank" rel="noreferrer">31篇</a> 文章里，我与你讲述了为Flutter应用中的Dart代码提供原生能力支持的两种方式，即：在原生工程中的Flutter应用入口注册原生代码宿主回调的轻量级方案，以及使用插件工程进行独立拆分封装的工程化解耦方案。</p><p>无论使用哪种方式，Flutter应用工程都为我们提供了一体化的标准解决方案，能够在集成构建时自动管理原生代码宿主及其相应的原生依赖，因此我们只需要在应用层使用pubspec.yaml文件去管理Dart的依赖。</p><p>但 <strong>对于混合工程而言，依赖关系的管理则会复杂一些</strong>。这是因为，与Flutter应用工程有着对原生组件简单清晰的单向依赖关系不同，混合工程对原生组件的依赖关系是多向的：Flutter模块工程会依赖原生组件，而原生工程的组件之间也会互相依赖。</p><p>如果继续让Flutter的工具链接管原生组件的依赖关系，那么整个工程就会陷入不稳定的状态之中。因此，对于混合工程的原生依赖，Flutter模块并不做介入，完全交由原生工程进行统一管理。而Flutter模块工程对原生工程的依赖，体现在依赖原生代码宿主提供的底层基础能力的原生插件上。</p><p>接下来，我就以网络通信这一基础能力为例，与你展开说明原生工程与Flutter模块工程之间应该如何管理依赖关系。</p><h2 id="网络插件依赖管理实践" tabindex="-1">网络插件依赖管理实践 <a class="header-anchor" href="#网络插件依赖管理实践" aria-label="Permalink to &quot;网络插件依赖管理实践&quot;">​</a></h2><p>在第24篇文章“ <a href="https://time.geekbang.org/column/article/121163" target="_blank" rel="noreferrer">HTTP网络编程与JSON解析</a>”中，我与你介绍了在Flutter中，我们可以通过HttpClient、http与dio这三种通信方式，实现与服务端的数据交换。</p><p>但在混合工程中，考虑到其他原生组件也需要使用网络通信能力，所以通常是由原生工程来提供网络通信功能的。因为这样不仅可以在工程架构层面实现更合理的功能分治，还可以统一整个App内数据交换的行为。比如，在网络引擎中为接口请求增加通用参数，或者是集中拦截错误等。</p><p>关于原生网络通信功能，目前市面上有很多优秀的第三方开源SDK，比如iOS的AFNetworking和Alamofire、Android的OkHttp和Retrofit等。考虑到AFNetworking和OkHttp在各自平台的社区活跃度相对最高，因此我就以它俩为例，与你演示混合工程的原生插件管理方法。</p><h2 id="网络插件接口封装" tabindex="-1">网络插件接口封装 <a class="header-anchor" href="#网络插件接口封装" aria-label="Permalink to &quot;网络插件接口封装&quot;">​</a></h2><p>要想搞清楚如何管理原生插件，我们需要先使用方法通道来建立Dart层与原生代码宿主之间的联系。</p><p>原生工程为Flutter模块提供原生代码能力，我们同样需要使用Flutter插件工程来进行封装。关于这部分内容，我在第 <a href="https://time.geekbang.org/column/article/132818" target="_blank" rel="noreferrer">31</a> 和 <a href="https://time.geekbang.org/column/article/141164" target="_blank" rel="noreferrer">39</a> 篇文章中，已经分别为你演示了推送插件和数据上报插件的封装方法，你也可以再回过头来复习下相关内容。所以，今天我就不再与你过多介绍通用的流程和固定的代码声明部分了，而是重点与你讲述与接口相关的实现细节。</p><p><strong>首先，我们来看看Dart代码部分。</strong></p><p>对于插件工程的Dart层代码而言，由于它仅仅是原生工程的代码宿主代理，所以这一层的接口设计比较简单，只需要提供一个可以接收请求URL和参数，并返回接口响应数据的方法doRequest即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class FlutterPluginNetwork {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  static Future&lt;​String&gt; doRequest(url,params)  async {</span></span>
<span class="line"><span>    //使用方法通道调用原生接口doRequest，传入URL和param两个参数</span></span>
<span class="line"><span>    final String result = await _channel.invokeMethod(&#39;doRequest&#39;, {</span></span>
<span class="line"><span>      &quot;url&quot;: url,</span></span>
<span class="line"><span>      &quot;param&quot;: params,</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Dart层接口封装搞定了，我们再来看看 <strong>接管真实网络调用的Android和iOS代码宿主如何响应Dart层的接口调用</strong>。</p><p>我刚刚与你提到过，原生代码宿主提供的基础通信能力是基于AFNetworking（iOS）和OkHttp（Android）做的封装，所以为了在原生代码中使用它们，我们 <strong>首先</strong> 需要分别在flutter_plugin_network.podspec和build.gradle文件中将工程对它们的依赖显式地声明出来：</p><p>在flutter_plugin_network.podspec文件中，声明工程对AFNetworking的依赖：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Pod::Spec.new do |s|</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  s.dependency &#39;AFNetworking&#39;</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>在build.gradle文件中，声明工程对OkHttp的依赖：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dependencies {</span></span>
<span class="line"><span>    implementation &quot;com.squareup.okhttp3:okhttp:4.2.0&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>然后</strong>，我们需要在原生接口FlutterPluginNetworkPlugin类中，完成例行的初始化插件实例、绑定方法通道工作。</p><p>最后，我们还需要在方法通道中取出对应的URL和query参数，为doRequest分别提供AFNetworking和OkHttp的实现版本。</p><p>对于iOS的调用而言，由于AFNetworking的网络调用对象是AFHTTPSessionManager类，所以我们需要这个类进行实例化，并定义其接口返回的序列化方式（本例中为字符串）。然后剩下的工作就是用它去发起网络请求，使用方法通道通知Dart层执行结果了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@implementation FlutterPluginNetworkPlugin</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>//方法通道回调</span></span>
<span class="line"><span>- (void)handleMethodCall:(FlutterMethodCall*)call result:(FlutterResult)result {</span></span>
<span class="line"><span>    //响应doRequest方法调用</span></span>
<span class="line"><span>    if ([@&quot;doRequest&quot; isEqualToString:call.method]) {</span></span>
<span class="line"><span>        //取出query参数和URL</span></span>
<span class="line"><span>        NSDictionary *arguments = call.arguments[@&quot;param&quot;];</span></span>
<span class="line"><span>        NSString *url = call.arguments[@&quot;url&quot;];</span></span>
<span class="line"><span>        [self doRequest:url withParams:arguments andResult:result];</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //其他方法未实现</span></span>
<span class="line"><span>        result(FlutterMethodNotImplemented);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//处理网络调用</span></span>
<span class="line"><span>- (void)doRequest:(NSString *)url withParams:(NSDictionary *)params andResult:(FlutterResult)result {</span></span>
<span class="line"><span>    //初始化网络调用实例</span></span>
<span class="line"><span>    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];</span></span>
<span class="line"><span>    //定义数据序列化方式为字符串</span></span>
<span class="line"><span>    manager.responseSerializer = [AFHTTPResponseSerializer serializer];</span></span>
<span class="line"><span>    NSMutableDictionary *newParams = [params mutableCopy];</span></span>
<span class="line"><span>    //增加自定义参数</span></span>
<span class="line"><span>    newParams[@&quot;ppp&quot;] = @&quot;yyyy&quot;;</span></span>
<span class="line"><span>    //发起网络调用</span></span>
<span class="line"><span>    [manager GET:url parameters:params progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {</span></span>
<span class="line"><span>        //取出响应数据，响应Dart调用</span></span>
<span class="line"><span>        NSString *string = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];</span></span>
<span class="line"><span>        result(string);</span></span>
<span class="line"><span>    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {</span></span>
<span class="line"><span>        //通知Dart调用失败</span></span>
<span class="line"><span>        result([FlutterError errorWithCode:@&quot;Error&quot; message:error.localizedDescription details:nil]);</span></span>
<span class="line"><span>    }];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@end</span></span></code></pre></div><p>Android的调用也类似，OkHttp的网络调用对象是OkHttpClient类，所以我们同样需要这个类进行实例化。OkHttp的默认序列化方式已经是字符串了，所以我们什么都不用做，只需要URL参数加工成OkHttp期望的格式，然后就是用它去发起网络请求，使用方法通道通知Dart层执行结果了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FlutterPluginNetworkPlugin implements MethodCallHandler {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  //方法通道回调</span></span>
<span class="line"><span>  public void onMethodCall(MethodCall call, Result result) {</span></span>
<span class="line"><span>    //响应doRequest方法调用</span></span>
<span class="line"><span>    if (call.method.equals(&quot;doRequest&quot;)) {</span></span>
<span class="line"><span>      //取出query参数和URL</span></span>
<span class="line"><span>      HashMap param = call.argument(&quot;param&quot;);</span></span>
<span class="line"><span>      String url = call.argument(&quot;url&quot;);</span></span>
<span class="line"><span>      doRequest(url,param,result);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      //其他方法未实现</span></span>
<span class="line"><span>      result.notImplemented();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //处理网络调用</span></span>
<span class="line"><span>  void doRequest(String url, HashMap&lt;​String, String&gt; param, final Result result) {</span></span>
<span class="line"><span>    //初始化网络调用实例</span></span>
<span class="line"><span>    OkHttpClient client = new OkHttpClient();</span></span>
<span class="line"><span>    //加工URL及query参数</span></span>
<span class="line"><span>    HttpUrl.Builder urlBuilder = HttpUrl.parse(url).newBuilder();</span></span>
<span class="line"><span>    for (String key : param.keySet()) {</span></span>
<span class="line"><span>      String value = param.get(key);</span></span>
<span class="line"><span>      urlBuilder.addQueryParameter(key,value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //加入自定义通用参数</span></span>
<span class="line"><span>    urlBuilder.addQueryParameter(&quot;ppp&quot;, &quot;yyyy&quot;);</span></span>
<span class="line"><span>    String requestUrl = urlBuilder.build().toString();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //发起网络调用</span></span>
<span class="line"><span>    final Request request = new Request.Builder().url(requestUrl).build();</span></span>
<span class="line"><span>    client.newCall(request).enqueue(new Callback() {</span></span>
<span class="line"><span>      @Override</span></span>
<span class="line"><span>      public void onFailure(Call call, final IOException e) {</span></span>
<span class="line"><span>        //切换至主线程，通知Dart调用失败</span></span>
<span class="line"><span>        registrar.activity().runOnUiThread(new Runnable() {</span></span>
<span class="line"><span>          @Override</span></span>
<span class="line"><span>          public void run() {</span></span>
<span class="line"><span>            result.error(&quot;Error&quot;, e.toString(), null);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      @Override</span></span>
<span class="line"><span>      public void onResponse(Call call, final Response response) throws IOException {</span></span>
<span class="line"><span>        //取出响应数据</span></span>
<span class="line"><span>        final String content = response.body().string();</span></span>
<span class="line"><span>        //切换至主线程，响应Dart调用</span></span>
<span class="line"><span>        registrar.activity().runOnUiThread(new Runnable() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void run() {</span></span>
<span class="line"><span>              result.success(content);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要注意的是， <strong>由于方法通道是非线程安全的，所以原生代码与Flutter之间所有的接口调用必须发生在主线程。</strong> 而OktHtp在处理网络请求时，由于涉及非主线程切换，所以需要调用runOnUiThread方法以确保回调过程是在UI线程中执行的，否则应用可能会出现奇怪的Bug，甚至是Crash。</p><p>有些同学可能会比较好奇， <strong>为什么doRequest的Android实现需要手动切回UI线程，而iOS实现则不需要呢？</strong> 这其实是因为doRequest的iOS实现背后依赖的AFNetworking，已经在数据回调接口时为我们主动切换了UI线程，所以我们自然不需要重复再做一次了。</p><p>在完成了原生接口封装之后，Flutter工程所需的网络通信功能的接口实现，就全部搞定了。</p><h2 id="flutter模块工程依赖管理" tabindex="-1">Flutter模块工程依赖管理 <a class="header-anchor" href="#flutter模块工程依赖管理" aria-label="Permalink to &quot;Flutter模块工程依赖管理&quot;">​</a></h2><p>通过上面这些步骤，我们以插件的形式提供了原生网络功能的封装。接下来，我们就需要在Flutter模块工程中使用这个插件，并提供对应的构建产物封装，提供给原生工程使用了。这部分内容主要包括以下3大部分：</p><ul><li>第一，如何使用FlutterPluginNetworkPlugin插件，也就是模块工程功能如何实现；</li><li>第二，模块工程的iOS构建产物应该如何封装，也就是原生iOS工程如何管理Flutter模块工程的依赖；</li><li>第三，模块工程的Android构建产物应该如何封装，也就是原生Android工程如何管理Flutter模块工程的依赖。</li></ul><p>接下来，我们具体看看每部分应该如何实现。</p><h2 id="模块工程功能实现" tabindex="-1">模块工程功能实现 <a class="header-anchor" href="#模块工程功能实现" aria-label="Permalink to &quot;模块工程功能实现&quot;">​</a></h2><p>为了使用FlutterPluginNetworkPlugin插件实现与服务端的数据交换能力，我们首先需要在pubspec.yaml文件中，将工程对它的依赖显示地声明出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>flutter_plugin_network:</span></span>
<span class="line"><span>    git:</span></span>
<span class="line"><span>      url: https://github.com/cyndibaby905/44_flutter_plugin_network.git</span></span></code></pre></div><p>然后，我们还得在main.dart文件中为它提供一个触发入口。在下面的代码中，我们在界面上展示了一个RaisedButton按钮，并在其点击回调函数时，使用FlutterPluginNetwork插件发起了一次网络接口调用，并把网络返回的数据打印到了控制台上：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RaisedButton(</span></span>
<span class="line"><span>  child: Text(&quot;doRequest&quot;),</span></span>
<span class="line"><span>  //点击按钮发起网络请求，打印数据</span></span>
<span class="line"><span>  onPressed:()=&gt;FlutterPluginNetwork.doRequest(&quot;https://jsonplaceholder.typicode.com/posts&quot;, {&#39;userId&#39;:&#39;2&#39;}).then((s)=&gt;print(&#39;Result:$s&#39;)),</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>运行这段代码，点击doRequest按钮，观察控制台输出，可以看到，接口返回的数据信息能够被正常打印，证明Flutter模块的功能表现是完全符合预期的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/144243/6855481fc112697ff2cc03fdcc185883.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/144243/6855481fc112697ff2cc03fdcc185883.png" alt=""></a></p><p>图1 Flutter模块工程运行示例</p><h2 id="构建产物应该如何封装" tabindex="-1">构建产物应该如何封装？ <a class="header-anchor" href="#构建产物应该如何封装" aria-label="Permalink to &quot;构建产物应该如何封装？&quot;">​</a></h2><p>我们都知道，模块工程的Android构建产物是aar，iOS构建产物是Framework。而在第 <a href="https://time.geekbang.org/column/article/129754" target="_blank" rel="noreferrer">28</a> 和 <a href="https://time.geekbang.org/column/article/144156" target="_blank" rel="noreferrer">42</a> 篇文章中，我与你介绍了不带插件依赖的模块工程构建产物的两种封装方案，即手动封装方案与自动化封装方案。这两种封装方案，最终都会输出同样的组织形式（Android是aar，iOS则是带podspec的Framework封装组件）。</p><p>如果你已经不熟悉这两种封装方式的具体操作步骤了，可以再复习下这两篇文章的相关内容。接下来，我重点与你讲述的问题是： <strong>如果我们的模块工程存在插件依赖，封装过程是否有区别呢？</strong></p><p>答案是，对于模块工程本身而言，这个过程没有区别；但对于模块工程的插件依赖来说，我们需要主动告诉原生工程，哪些依赖是需要它去管理的。</p><p>由于Flutter模块工程把所有原生的依赖都交给了原生工程去管理，因此其构建产物并不会携带任何原生插件的封装实现，所以我们需要遍历模块工程所使用的原生依赖组件们，为它们逐一生成插件代码对应的原生组件封装。</p><p>在第18篇文章“ <a href="https://time.geekbang.org/column/article/114180" target="_blank" rel="noreferrer">依赖管理（二）：第三方组件库在Flutter中要如何管理？</a>”中，我与你介绍了Flutter工程管理第三方依赖的实现机制，其中.packages文件存储的是依赖的包名与系统缓存中的包文件路径。</p><p>类似的，插件依赖也有一个类似的文件进行统一管理，即 <strong>.flutter-plugins</strong>。我们可以通过这个文件，找到对应的插件名字（本例中即为flutter_plugin_network）及缓存路径：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>flutter_plugin_network=/Users/hangchen/Documents/flutter/.pub-cache/git/44_flutter_plugin_network-9b4472aa46cf20c318b088573a30bc32c6961777/</span></span></code></pre></div><p>插件缓存本身也可以被视为一个Flutter模块工程，所以我们可以采用与模块工程类似的办法，为它生成对应的原生组件封装。</p><p>对于iOS而言，这个过程相对简单些，所以我们先来看看模块工程的iOS构建产物封装过程。</p><h3 id="ios构建产物应该如何封装" tabindex="-1">iOS构建产物应该如何封装？ <a class="header-anchor" href="#ios构建产物应该如何封装" aria-label="Permalink to &quot;iOS构建产物应该如何封装？&quot;">​</a></h3><p>在插件工程的ios目录下，为我们提供了带podspec文件的源码组件，podspec文件提供了组件的声明（及其依赖），因此我们可以把这个目录下的文件拷贝出来，连同Flutter模块组件一起放到原生工程中的专用目录，并写到Podfile文件里。</p><p>原生工程会识别出组件本身及其依赖，并按照声明的依赖关系依次遍历，自动安装：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#Podfile</span></span>
<span class="line"><span>target &#39;iOSDemo&#39; do</span></span>
<span class="line"><span>  pod &#39;Flutter&#39;, :path =&gt; &#39;Flutter&#39;</span></span>
<span class="line"><span>  pod &#39;flutter_plugin_network&#39;, :path =&gt; &#39;flutter_plugin_network&#39;</span></span>
<span class="line"><span>end</span></span></code></pre></div><p>然后，我们就可以像使用不带插件依赖的模块工程一样，把它引入到原生工程中，为其设置入口，在FlutterViewController中展示Flutter模块的页面了。</p><p>不过需要注意的是，由于FlutterViewController并不感知这个过程，因此不会主动初始化项目中的插件，所以我们还需要在入口处手动将工程里所有的插件依次声明出来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//AppDelegate.m:</span></span>
<span class="line"><span>@implementation AppDelegate</span></span>
<span class="line"><span>- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {</span></span>
<span class="line"><span>    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];</span></span>
<span class="line"><span>    //初始化Flutter入口</span></span>
<span class="line"><span>    FlutterViewController *vc = [[FlutterViewController alloc]init];</span></span>
<span class="line"><span>    //初始化插件</span></span>
<span class="line"><span>    [FlutterPluginNetworkPlugin registerWithRegistrar:[vc registrarForPlugin:@&quot;FlutterPluginNetworkPlugin&quot;]];</span></span>
<span class="line"><span>    //设置路由标识符</span></span>
<span class="line"><span>    [vc setInitialRoute:@&quot;defaultRoute&quot;];</span></span>
<span class="line"><span>    self.window.rootViewController = vc;</span></span>
<span class="line"><span>    [self.window makeKeyAndVisible];</span></span>
<span class="line"><span>    return YES;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Xcode中运行这段代码，点击doRequest按钮，可以看到，接口返回的数据信息能够被正常打印，证明我们已经可以在原生iOS工程中顺利的使用Flutter模块了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/144243/329866c452354bd0524fc3de798b4fc8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/144243/329866c452354bd0524fc3de798b4fc8.png" alt=""></a></p><p>图2 原生iOS工程运行示例</p><p>我们再来看看模块工程的Android构建产物应该如何封装。</p><h3 id="android构建产物应该如何封装" tabindex="-1">Android构建产物应该如何封装？ <a class="header-anchor" href="#android构建产物应该如何封装" aria-label="Permalink to &quot;Android构建产物应该如何封装？&quot;">​</a></h3><p>与iOS的插件工程组件在ios目录类似，Android的插件工程组件在android目录。对于iOS的插件工程，我们可以直接将源码组件提供给原生工程，但对于Andriod的插件工程来说，我们只能将aar组件提供给原生工程，所以我们不仅需要像iOS操作步骤那样进入插件的组件目录，还需要借助构建命令，为插件工程生成aar：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd android</span></span>
<span class="line"><span>./gradlew flutter_plugin_network:assRel</span></span></code></pre></div><p>命令执行完成之后，aar就生成好了。aar位于android/build/outputs/aar目录下，我们打开插件缓存对应的路径，提取出对应的aar（本例中为flutter_plugin_network-debug.aar）就可以了。</p><p>我们把生成的插件aar，连同Flutter模块aar一起放到原生工程的libs目录下，最后在build.gradle文件里将它显式地声明出来，就完成了插件工程的引入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//build.gradle</span></span>
<span class="line"><span>dependencies {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    implementation(name: &#39;flutter-debug&#39;, ext: &#39;aar&#39;)</span></span>
<span class="line"><span>    implementation(name: &#39;flutter_plugin_network-debug&#39;, ext: &#39;aar&#39;)</span></span>
<span class="line"><span>    implementation &quot;com.squareup.okhttp3:okhttp:4.2.0&quot;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们就可以在原生工程中为其设置入口，在FlutterView中展示Flutter页面，愉快地使用Flutter模块带来的高效开发和高性能渲染能力了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//MainActivity.java</span></span>
<span class="line"><span>public class MainActivity extends AppCompatActivity {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected void onCreate(Bundle savedInstanceState) {</span></span>
<span class="line"><span>        super.onCreate(savedInstanceState);</span></span>
<span class="line"><span>        View FlutterView = Flutter.createView(this, getLifecycle(), &quot;defaultRoute&quot;);</span></span>
<span class="line"><span>        setContentView(FlutterView);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过 <strong>需要注意的是</strong>，与iOS插件工程的podspec能够携带组件依赖不同，Android插件工程的封装产物aar本身不携带任何配置信息。所以，如果插件工程本身存在原生依赖（像flutter_plugin_network依赖OkHttp这样），我们是无法通过aar去告诉原生工程其所需的原生依赖的。</p><p>面对这种情况，我们需要在原生工程中的build.gradle文件里手动地将插件工程的依赖（即OkHttp）显示地声明出来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//build.gradle</span></span>
<span class="line"><span>dependencies {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    implementation(name: &#39;flutter-debug&#39;, ext: &#39;aar&#39;)</span></span>
<span class="line"><span>    implementation(name: &#39;flutter_plugin_network-debug&#39;, ext: &#39;aar&#39;)</span></span>
<span class="line"><span>    implementation &quot;com.squareup.okhttp3:okhttp:4.2.0&quot;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>至此，将模块工程及其插件依赖封装成原生组件的全部工作就完成了，原生工程可以像使用一个普通的原生组件一样，去使用Flutter模块组件的功能了。</strong></p><p>在Android Studio中运行这段代码，并点击doRequest按钮，可以看到，我们可以在原生Android工程中正常使用Flutter封装的页面组件了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/144243/543a78c6839639a28b2eb9246c0196f3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/144243/543a78c6839639a28b2eb9246c0196f3.png" alt=""></a></p><p>图3 原生Android工程运行示例</p><p>当然，考虑到手动封装模块工程及其构建产物的过程，繁琐且容易出错，我们可以把这些步骤抽象成命令行脚本，并把它部署到Travis上。这样在Travis检测到代码变更之后，就会自动将Flutter模块的构建产物封装成原生工程期望的组件格式了。</p><p>关于这部分内容，你可以参考我在 <a href="https://github.com/cyndibaby905/44_flutter_module_demo" target="_blank" rel="noreferrer">flutter_module_demo</a> 里的 <a href="https://github.com/cyndibaby905/44_flutter_module_demo/blob/master/generate_aars.sh" target="_blank" rel="noreferrer">generate_aars.sh</a> 与 <a href="https://github.com/cyndibaby905/44_flutter_module_demo/blob/master/generate_pods.sh" target="_blank" rel="noreferrer">generate_pods.sh</a> 实现。如果关于这部分内容有任何问题，都可以直接留言给我。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，关于Flutter混合开发框架的依赖管理部分我们就讲到这里。接下来，我们一起总结下今天的主要内容吧。</p><p>Flutter模块工程的原生组件封装形式是aar（Android）和Framework（Pod）。与纯Flutter应用工程能够自动管理插件的原生依赖不同，这部分工作在模块工程中是完全交给原生工程去管理的。因此，我们需要查找记录了插件名称及缓存路径映射关系的.flutter-plugins文件，提取出每个插件所对应的原生组件封装，集成到原生工程中。</p><p>从今天的分享可以看出，对于有着插件依赖的Android组件封装来说，由于aar本身并不携带任何配置信息，因此其操作以手工为主：我们不仅要执行构建命令依次生成插件对应的aar，还需要将插件自身的原生依赖拷贝至原生工程，其步骤相对iOS组件封装来说要繁琐一些。</p><p>为了解决这一问题，业界出现了一种名为 <a href="https://github.com/adwiv/android-fat-aar" target="_blank" rel="noreferrer">fat-aar</a> 的打包手段，它能够将模块工程本身，及其相关的插件依赖统一打包成一个大的aar，从而省去了依赖遍历和依赖声明的过程，实现了更好的功能自治性。但这种解决方案存在一些较为明显的不足：</p><ul><li>依赖冲突问题。如果原生工程与插件工程都引用了同样的原生依赖组件（OkHttp），则原生工程的组件引用其依赖时会产生合并冲突，因此在发布时必须手动去掉原生工程的组件依赖。</li><li>嵌套依赖问题。fat-aar只会处理embedded关键字指向的这层一级依赖，而不会处理再下一层的依赖。因此，对于依赖关系复杂的插件支持，我们仍需要手动处理依赖问题。</li><li>Gradle版本限制问题。fat-aar方案对Gradle插件版本有限制，且实现方式并不是官方设计考虑的点，加之Gradle API变更较快，所以存在后续难以维护的问题。</li><li>其他未知问题。fat-aar项目已经不再维护了，最近一次更新还是2年前，在实际项目中使用“年久失修”的项目存在较大的风险。</li></ul><p>考虑到这些因素，fat-aar并不是管理插件工程依赖的好的解决方案，所以 <strong>我们最好还是得老老实实地去遍历插件依赖，以持续交付的方式自动化生成aar。</strong></p><p>我把今天分享涉及知识点打包上传到了GitHub中，你可以把 <a href="https://github.com/cyndibaby905/44_flutter_plugin_network" target="_blank" rel="noreferrer">插件工程</a>、 <a href="https://github.com/cyndibaby905/44_flutter_module_demo" target="_blank" rel="noreferrer">Flutter模块工程</a>、 <a href="https://github.com/cyndibaby905/44_AndroidDemo" target="_blank" rel="noreferrer">原生Android</a> 和 <a href="https://github.com/cyndibaby905/44_iOSDemo" target="_blank" rel="noreferrer">iOS工程</a> 下载下来，查看其Travis持续交付配置文件的构建执行命令，体会在混合框架中如何管理跨技术栈的组件依赖。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我给你留一道思考题吧。</p><p>原生插件的开发是一个需要Dart层代码封装，以及原生Android、iOS代码层实现的长链路过程。如果需要支持的基础能力较多，开发插件的过程就会变得繁琐且容易出错。我们都知道Dart是不支持反射的，但是原生代码可以。我们是否可以利用原生的反射去实现插件定义的标准化呢？</p><p>提示：在Dart层调用不存在的接口（或未实现的接口），可以通过noSuchMethod方法进行统一处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class FlutterPluginDemo {</span></span>
<span class="line"><span>  //方法通道</span></span>
<span class="line"><span>  static const MethodChannel _channel =</span></span>
<span class="line"><span>      const MethodChannel(&#39;flutter_plugin_demo&#39;);</span></span>
<span class="line"><span>  //当调用不存在接口时，Dart会交由该方法进行统一处理</span></span>
<span class="line"><span>  @override</span></span>
<span class="line"><span>  Future&lt;​dynamic&gt; noSuchMethod(Invocation invocation) {</span></span>
<span class="line"><span>    //从字符串Symbol(&quot;methodName&quot;)中取出方法名</span></span>
<span class="line"><span>    String methodName = invocation.memberName.toString().substring(8, string.length - 2);</span></span>
<span class="line"><span>    //参数</span></span>
<span class="line"><span>    dynamic args = invocation.positionalArguments;</span></span>
<span class="line"><span>    print(&#39;methodName:$methodName&#39;);</span></span>
<span class="line"><span>    print(&#39;args:$args&#39;);</span></span>
<span class="line"><span>    return methodTemplate(methodName, args);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //某未实现的方法</span></span>
<span class="line"><span>  Future&lt;​dynamic&gt; someMethodNotImplemented();</span></span>
<span class="line"><span>  //某未实现的带参数方法</span></span>
<span class="line"><span>  Future&lt;​dynamic&gt; someMethodNotImplementedWithParameter(param);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,104)])])}const h=n(t,[["render",l]]);export{g as __pageData,h as default};
