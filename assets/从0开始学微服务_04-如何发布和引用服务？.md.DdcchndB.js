import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"04 | 如何发布和引用服务？","description":"","frontmatter":{},"headers":[{"level":2,"title":"RESTful API","slug":"restful-api","link":"#restful-api","children":[]},{"level":2,"title":"XML配置","slug":"xml配置","link":"#xml配置","children":[]},{"level":2,"title":"IDL文件","slug":"idl文件","link":"#idl文件","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"从0开始学微服务/04-如何发布和引用服务？.md","filePath":"从0开始学微服务/04-如何发布和引用服务？.md","lastUpdated":1779818389000}'),l={name:"从0开始学微服务/04-如何发布和引用服务？.md"};function t(i,s,o,r,c,m){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_04-如何发布和引用服务" tabindex="-1">04 | 如何发布和引用服务？ <a class="header-anchor" href="#_04-如何发布和引用服务" aria-label="Permalink to &quot;04 | 如何发布和引用服务？&quot;">​</a></h1><p>从这期开始，我将陆续给你讲解微服务各个基本组件的原理和实现方式。</p><p>今天我要与你分享的第一个组件是服务发布和引用。我在前面说过，想要构建微服务，首先要解决的问题是， <strong>服务提供者如何发布一个服务，服务消费者如何引用这个服务</strong>。具体来说，就是这个服务的接口名是什么？调用这个服务需要传递哪些参数？接口的返回值是什么类型？以及一些其他接口描述信息。</p><p>我前面说过，最常见的服务发布和引用的方式有三种：</p><ul><li><p>RESTful API</p></li><li><p>XML配置</p></li><li><p>IDL文件</p></li></ul><p>下面我就结合具体的实例，逐个讲解每一种方式的具体使用方法以及各自的应用场景，以便你在选型时作参考。</p><h2 id="restful-api" tabindex="-1">RESTful API <a class="header-anchor" href="#restful-api" aria-label="Permalink to &quot;RESTful API&quot;">​</a></h2><p>首先来说说RESTful API的方式，主要被 <strong>用作HTTP或者HTTPS协议的接口定义</strong>，即使在非微服务架构体系下，也被广泛采用。</p><p>下面是开源服务化框架 <a href="http://github.com/weibocom/motan" target="_blank" rel="noreferrer">Motan</a> 发布RESTful API的例子，它发布了三个RESTful格式的API，接口声明如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Path(&quot;/rest&quot;)</span></span>
<span class="line"><span> public interface RestfulService {</span></span>
<span class="line"><span>     &amp;#64;GET</span></span>
<span class="line"><span>     &amp;#64;Produces(MediaType.APPLICATION_JSON)</span></span>
<span class="line"><span>     List&amp;lt;User&amp;gt; getUsers(&amp;#64;QueryParam(&quot;uid&quot;) int uid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &amp;#64;GET</span></span>
<span class="line"><span>     &amp;#64;Path(&quot;/primitive&quot;)</span></span>
<span class="line"><span>     &amp;#64;Produces(MediaType.TEXT_PLAIN)</span></span>
<span class="line"><span>     String testPrimitiveType();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &amp;#64;POST</span></span>
<span class="line"><span>     &amp;#64;Consumes(MediaType.APPLICATION_FORM_URLENCODED)</span></span>
<span class="line"><span>     &amp;#64;Produces(MediaType.APPLICATION_JSON)</span></span>
<span class="line"><span>     Response add(&amp;#64;FormParam(&quot;id&quot;) int id, &amp;#64;FormParam(&quot;name&quot;) String name);</span></span></code></pre></div><p>具体的服务实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RestfulServerDemo implements RestfulService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &amp;#64;Override</span></span>
<span class="line"><span>     public List&amp;lt;User&amp;gt; getUsers(&amp;#64;CookieParam(&quot;uid&quot;) int uid) {</span></span>
<span class="line"><span>         return Arrays.asList(new User(uid, &quot;name&quot; + uid));</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &amp;#64;Override</span></span>
<span class="line"><span>     public String testPrimitiveType() {</span></span>
<span class="line"><span>         return &quot;helloworld!&quot;;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     &amp;#64;Override</span></span>
<span class="line"><span>     public Response add(&amp;#64;FormParam(&quot;id&quot;) int id, &amp;#64;FormParam(&quot;name&quot;) String name) {</span></span>
<span class="line"><span>         return Response.ok().cookie(new NewCookie(&quot;ck&quot;, String.valueOf(id))).entity(new User(id, name)).build();</span></span>
<span class="line"><span>     }</span></span></code></pre></div><p>服务提供者这一端通过部署代码到Tomcat中，并配置Tomcat中如下的web.xml，就可以通过servlet的方式对外提供RESTful API。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;listener&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;listener-class&amp;gt;com.weibo.api.motan.protocol.restful.support.servlet.RestfulServletContainerListener&amp;lt;/listener-class&amp;gt;</span></span>
<span class="line"><span> &amp;lt;/listener&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> &amp;lt;servlet&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;servlet-name&amp;gt;dispatcher&amp;lt;/servlet-name&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;servlet-class&amp;gt;org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher&amp;lt;/servlet-class&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;load-on-startup&amp;gt;1&amp;lt;/load-on-startup&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;init-param&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;param-name&amp;gt;resteasy.servlet.mapping.prefix&amp;lt;/param-name&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;param-value&amp;gt;/servlet&amp;lt;/param-value&amp;gt;  &amp;lt;!-- 此处实际为servlet-mapping的url-pattern，具体配置见resteasy文档--&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;/init-param&amp;gt;</span></span>
<span class="line"><span> &amp;lt;/servlet&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> &amp;lt;servlet-mapping&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;servlet-name&amp;gt;dispatcher&amp;lt;/servlet-name&amp;gt;</span></span>
<span class="line"><span>     &amp;lt;url-pattern&amp;gt;/servlet/*&amp;lt;/url-pattern&amp;gt;</span></span>
<span class="line"><span> &amp;lt;/servlet-mapping&amp;gt;</span></span></code></pre></div><p>这样服务消费者就可以通过HTTP协议调用服务了，因为HTTP协议本身是一个公开的协议，对于服务消费者来说几乎没有学习成本，所以比较适合用作跨业务平台之间的服务协议。比如你有一个服务，不仅需要在业务部门内部提供服务，还需要向其他业务部门提供服务，甚至开放给外网提供服务，这时候采用HTTP协议就比较合适，也省去了沟通服务协议的成本。</p><h2 id="xml配置" tabindex="-1">XML配置 <a class="header-anchor" href="#xml配置" aria-label="Permalink to &quot;XML配置&quot;">​</a></h2><p>接下来再来给你讲下XML配置方式，这种方式的服务发布和引用主要分三个步骤：</p><ul><li><p>服务提供者定义接口，并实现接口。</p></li><li><p>服务提供者进程启动时，通过加载server.xml配置文件将接口暴露出去。</p></li><li><p>服务消费者进程启动时，通过加载client.xml配置文件来引入要调用的接口。</p></li></ul><p>我继续以服务化框架Motan为例，它还支持以XML配置的方式来发布和引用服务。</p><p>首先，服务提供者定义接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface FooService {</span></span>
<span class="line"><span>    public String hello(String name);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后服务提供者实现接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class FooServiceImpl implements FooService {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String hello(String name) {</span></span>
<span class="line"><span>        System.out.println(name + &quot; invoked rpc service&quot;);</span></span>
<span class="line"><span>        return &quot;hello &quot; + name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后服务提供者进程启动时，加载server.xml配置文件，开启8002端口监听。</p><p>server.xml配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span> xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span> xmlns:motan=&quot;http://api.weibo.com/schema/motan&quot;</span></span>
<span class="line"><span> xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.5.xsd</span></span>
<span class="line"><span>   http://api.weibo.com/schema/motan http://api.weibo.com/schema/motan.xsd&quot;&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;!-- service implemention bean --&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;bean id=&quot;serviceImpl&quot; class=&quot;quickstart.FooServiceImpl&quot; /&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;!-- exporting service by Motan --&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:service interface=&quot;quickstart.FooService&quot; ref=&quot;serviceImpl&quot; export=&quot;8002&quot; /&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/beans&amp;gt;</span></span></code></pre></div><p>服务提供者加载server.xml的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.springframework.context.ApplicationContext;</span></span>
<span class="line"><span>import org.springframework.context.support.ClassPathXmlApplicationContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Server {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        ApplicationContext applicationContext = new ClassPathXmlApplicationContext(&quot;classpath:motan_server.xml&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;server start...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>服务消费者要想调用服务，就必须在进程启动时，加载配置client.xml，引用接口定义，然后发起调用。</p><p>client.xml配置如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;beans xmlns=&quot;http://www.springframework.org/schema/beans&quot;</span></span>
<span class="line"><span>xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>xmlns:motan=&quot;http://api.weibo.com/schema/motan&quot;</span></span>
<span class="line"><span>xsi:schemaLocation=&quot;http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.5.xsd</span></span>
<span class="line"><span>   http://api.weibo.com/schema/motan http://api.weibo.com/schema/motan.xsd&quot;&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;lt;!-- reference to the remote service --&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;motan:referer id=&quot;remoteService&quot; interface=&quot;quickstart.FooService&quot; directUrl=&quot;localhost:8002&quot;/&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/beans&amp;gt;</span></span></code></pre></div><p>服务消费者启动时，加载client.xml的代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import org.springframework.context.ApplicationContext;</span></span>
<span class="line"><span>import org.springframework.context.support.ClassPathXmlApplicationContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Client {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        ApplicationContext ctx = new ClassPathXmlApplicationContext(&quot;classpath:motan_client.xml&quot;);</span></span>
<span class="line"><span>        FooService service = (FooService) ctx.getBean(&quot;remoteService&quot;);</span></span>
<span class="line"><span>        System.out.println(service.hello(&quot;motan&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>就这样，通过在服务提供者和服务消费者之间维持一份对等的XML配置文件，来保证服务消费者按照服务提供者的约定来进行服务调用。在这种方式下，如果服务提供者变更了接口定义，不仅需要更新服务提供者加载的接口描述文件server.xml，还需要同时更新服务消费者加载的接口描述文件client.xml。</p><p>一般是私有RPC框架会选择XML配置这种方式来描述接口，因为私有RPC协议的性能要比HTTP协议高，所以在对性能要求比较高的场景下，采用XML配置的方式比较合适。但这种方式对业务代码侵入性比较高，XML配置有变更的时候，服务消费者和服务提供者都要更新，所以适合公司内部联系比较紧密的业务之间采用。如果要应用到跨部门之间的业务调用，一旦有XML配置变更，需要花费大量精力去协调不同部门做升级工作。在我经历的实际项目里，就遇到过一次底层服务的接口升级，需要所有相关的调用方都升级，为此花费了大量时间去协调沟通不同部门之间的升级工作，最后经历了大半年才最终完成。所以对于XML配置方式的服务描述，一旦应用到多个部门之间的接口格式约定，如果有变更，最好是新增接口，不到万不得已不要对原有的接口格式做变更。</p><h2 id="idl文件" tabindex="-1">IDL文件 <a class="header-anchor" href="#idl文件" aria-label="Permalink to &quot;IDL文件&quot;">​</a></h2><p>IDL就是接口描述语言（interface description language）的缩写，通过一种中立的方式来描述接口，使得在不同的平台上运行的对象和不同语言编写的程序可以相互通信交流。比如你用Java语言实现提供的一个服务，也能被PHP语言调用。</p><p>也就是说IDL主要是 <strong>用作跨语言平台的服务之间的调用</strong>，有两种最常用的IDL：一个是Facebook开源的 <strong>Thrift协议</strong>，另一个是Google开源的 <strong>gRPC协议</strong>。无论是Thrift协议还是gRPC协议，它们的工作原理都是类似的。</p><p>接下来，我以gRPC协议为例，给你讲讲如何使用IDL文件方式来描述接口。</p><p>gRPC协议使用Protobuf简称proto文件来定义接口名、调用参数以及返回值类型。</p><p>比如文件helloword.proto定义了一个接口SayHello方法，它的请求参数是HelloRequest，它的返回值是HelloReply。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// The greeter service definition.</span></span>
<span class="line"><span>service Greeter {</span></span>
<span class="line"><span>  // Sends a greeting</span></span>
<span class="line"><span>  rpc SayHello (HelloRequest) returns (HelloReply) {}</span></span>
<span class="line"><span>  rpc SayHelloAgain (HelloRequest) returns (HelloReply) {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// The request message containing the user&#39;s name.</span></span>
<span class="line"><span>message HelloRequest {</span></span>
<span class="line"><span>  string name = 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// The response message containing the greetings</span></span>
<span class="line"><span>message HelloReply {</span></span>
<span class="line"><span>  string message = 1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假如服务提供者使用的是Java语言，那么利用protoc插件即可自动生成Server端的Java代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private class GreeterImpl extends GreeterGrpc.GreeterImplBase {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void sayHello(HelloRequest req, StreamObserver&amp;lt;HelloReply&amp;gt; responseObserver) {</span></span>
<span class="line"><span>    HelloReply reply = HelloReply.newBuilder().setMessage(&quot;Hello &quot; + req.getName()).build();</span></span>
<span class="line"><span>    responseObserver.onNext(reply);</span></span>
<span class="line"><span>    responseObserver.onCompleted();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void sayHelloAgain(HelloRequest req, StreamObserver&amp;lt;HelloReply&amp;gt; responseObserver) {</span></span>
<span class="line"><span>    HelloReply reply = HelloReply.newBuilder().setMessage(&quot;Hello again &quot; + req.getName()).build();</span></span>
<span class="line"><span>    responseObserver.onNext(reply);</span></span>
<span class="line"><span>    responseObserver.onCompleted();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假如服务消费者使用的也是Java语言，那么利用protoc插件即可自动生成Client端的Java代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void greet(String name) {</span></span>
<span class="line"><span>  logger.info(&quot;Will try to greet &quot; + name + &quot; ...&quot;);</span></span>
<span class="line"><span>  HelloRequest request = HelloRequest.newBuilder().setName(name).build();</span></span>
<span class="line"><span>  HelloReply response;</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    response = blockingStub.sayHello(request);</span></span>
<span class="line"><span>  } catch (StatusRuntimeException e) {</span></span>
<span class="line"><span>    logger.log(Level.WARNING, &quot;RPC failed: {0}&quot;, e.getStatus());</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  logger.info(&quot;Greeting: &quot; + response.getMessage());</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    response = blockingStub.sayHelloAgain(request);</span></span>
<span class="line"><span>  } catch (StatusRuntimeException e) {</span></span>
<span class="line"><span>    logger.log(Level.WARNING, &quot;RPC failed: {0}&quot;, e.getStatus());</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  logger.info(&quot;Greeting: &quot; + response.getMessage());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>假如服务消费者使用的是PHP语言，那么利用protoc插件即可自动生成Client端的PHP代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    $request = new Helloworld\\HelloRequest();</span></span>
<span class="line"><span>    $request-&amp;gt;setName($name);</span></span>
<span class="line"><span>    list($reply, $status) = $client-&amp;gt;SayHello($request)-&amp;gt;wait();</span></span>
<span class="line"><span>    $message = $reply-&amp;gt;getMessage();</span></span>
<span class="line"><span>    list($reply, $status) = $client-&amp;gt;SayHelloAgain($request)-&amp;gt;wait();</span></span>
<span class="line"><span>    $message = $reply-&amp;gt;getMessage();</span></span></code></pre></div><p>由此可见，gRPC协议的服务描述是通过proto文件来定义接口的，然后再使用protoc来生成不同语言平台的客户端和服务端代码，从而具备跨语言服务调用能力。</p><p>有一点特别需要注意的是，在描述接口定义时，IDL文件需要对接口返回值进行详细定义。如果接口返回值的字段比较多，并且经常变化时，采用IDL文件方式的接口定义就不太合适了。一方面可能会造成IDL文件过大难以维护，另一方面只要IDL文件中定义的接口返回值有变更，都需要同步所有的服务消费者都更新，管理成本就太高了。</p><p>我在项目实践过程中，曾经考虑过采用Protobuf文件来描述微博内容接口，但微博内容返回的字段有几百个，并且有些字段不固定，返回什么字段是业务方自定义的，这种情况采用Protobuf文件来描述的话会十分麻烦，所以最终不得不放弃这种方式。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我给你介绍了服务描述最常见的三种方式：RESTful API、XML配置以及IDL文件。</p><p>具体采用哪种服务描述方式是根据实际情况决定的，通常情况下，如果只是企业内部之间的服务调用，并且都是Java语言的话，选择XML配置方式是最简单的。如果企业内部存在多个服务，并且服务采用的是不同语言平台，建议使用IDL文件方式进行描述服务。如果还存在对外开放服务调用的情形的话，使用RESTful API方式则更加通用。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E5%BC%80%E5%A7%8B%E5%AD%A6%E5%BE%AE%E6%9C%8D%E5%8A%A1/images/14425/6fb77c7f56052f945d09f1e8f20d0099.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E4%BB%8E0%E5%BC%80%E5%A7%8B%E5%AD%A6%E5%BE%AE%E6%9C%8D%E5%8A%A1/images/14425/6fb77c7f56052f945d09f1e8f20d0099.png" alt=""></a></p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>针对你的业务场景思考一下，假如要进行服务化，你觉得使用哪种服务描述最合适？为什么？</p><p>欢迎你在留言区写下自己的思考，与我一起讨论。</p>`,58)])])}const d=a(l,[["render",t]]);export{g as __pageData,d as default};
