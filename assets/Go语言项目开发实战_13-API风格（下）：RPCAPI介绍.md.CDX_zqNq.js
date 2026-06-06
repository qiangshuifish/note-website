import{_ as n,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"13 | API 风格（下）：RPC API介绍","description":"","frontmatter":{},"headers":[{"level":2,"title":"RPC介绍","slug":"rpc介绍","link":"#rpc介绍","children":[]},{"level":2,"title":"gRPC介绍","slug":"grpc介绍","link":"#grpc介绍","children":[]},{"level":2,"title":"Protocol Buffers介绍","slug":"protocol-buffers介绍","link":"#protocol-buffers介绍","children":[]},{"level":2,"title":"gRPC示例","slug":"grpc示例","link":"#grpc示例","children":[]},{"level":2,"title":"RESTful VS gRPC","slug":"restful-vs-grpc","link":"#restful-vs-grpc","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/13-API风格（下）：RPCAPI介绍.md","filePath":"Go语言项目开发实战/13-API风格（下）：RPCAPI介绍.md","lastUpdated":1779815754000}'),l={name:"Go语言项目开发实战/13-API风格（下）：RPCAPI介绍.md"};function t(i,s,o,r,c,g){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_13-api-风格-下-rpc-api介绍" tabindex="-1">13 | API 风格（下）：RPC API介绍 <a class="header-anchor" href="#_13-api-风格-下-rpc-api介绍" aria-label="Permalink to &quot;13 | API 风格（下）：RPC API介绍&quot;">​</a></h1><p>你好，我是孔令飞。这一讲，我们继续来看下如何设计应用的API风格。</p><p>上一讲，我介绍了REST API风格，这一讲我来介绍下另外一种常用的API风格，RPC。在Go项目开发中，如果业务对性能要求比较高，并且需要提供给多种编程语言调用，这时候就可以考虑使用RPC API接口。RPC在Go项目开发中用得也非常多，需要我们认真掌握。</p><h2 id="rpc介绍" tabindex="-1">RPC介绍 <a class="header-anchor" href="#rpc介绍" aria-label="Permalink to &quot;RPC介绍&quot;">​</a></h2><p>根据维基百科的定义，RPC（Remote Procedure Call），即远程过程调用，是一个计算机通信协议。该协议允许运行于一台计算机的程序调用另一台计算机的子程序，而程序员不用额外地为这个交互作用编程。</p><p>通俗来讲，就是服务端实现了一个函数，客户端使用RPC框架提供的接口，像调用本地函数一样调用这个函数，并获取返回值。RPC屏蔽了底层的网络通信细节，使得开发人员无需关注网络编程的细节，可以将更多的时间和精力放在业务逻辑本身的实现上，从而提高开发效率。</p><p>RPC的调用过程如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/984yy094616b9b24193b22a1f2f2271d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/984yy094616b9b24193b22a1f2f2271d.png" alt=""></a></p><p>RPC调用具体流程如下：</p><ol><li>Client通过本地调用，调用Client Stub。</li><li>Client Stub将参数打包（也叫Marshalling）成一个消息，然后发送这个消息。</li><li>Client所在的OS将消息发送给Server。</li><li>Server端接收到消息后，将消息传递给Server Stub。</li><li>Server Stub将消息解包（也叫 Unmarshalling）得到参数。</li><li>Server Stub调用服务端的子程序（函数），处理完后，将最终结果按照相反的步骤返回给 Client。</li></ol><p>这里需要注意，Stub负责调用参数和返回值的流化（serialization）、参数的打包和解包，以及网络层的通信。Client端一般叫Stub，Server端一般叫Skeleton。</p><p>目前，业界有很多优秀的RPC协议，例如腾讯的Tars、阿里的Dubbo、微博的Motan、Facebook的Thrift、RPCX，等等。但使用最多的还是 <a href="https://github.com/grpc/grpc-go" target="_blank" rel="noreferrer">gRPC</a>，这也是本专栏所采用的RPC框架，所以接下来我会重点介绍gRPC框架。</p><h2 id="grpc介绍" tabindex="-1">gRPC介绍 <a class="header-anchor" href="#grpc介绍" aria-label="Permalink to &quot;gRPC介绍&quot;">​</a></h2><p>gRPC是由Google开发的高性能、开源、跨多种编程语言的通用RPC框架，基于HTTP 2.0协议开发，默认采用Protocol Buffers数据序列化协议。gRPC具有如下特性：</p><ul><li>支持多种语言，例如 Go、Java、C、C++、C#、Node.js、PHP、Python、Ruby等。</li><li>基于IDL（Interface Definition Language）文件定义服务，通过proto3工具生成指定语言的数据结构、服务端接口以及客户端Stub。通过这种方式，也可以将服务端和客户端解耦，使客户端和服务端可以并行开发。</li><li>通信协议基于标准的HTTP/2设计，支持双向流、消息头压缩、单TCP的多路复用、服务端推送等特性。</li><li>支持Protobuf和JSON序列化数据格式。Protobuf是一种语言无关的高性能序列化框架，可以减少网络传输流量，提高通信效率。</li></ul><p>这里要注意的是，gRPC的全称不是golang Remote Procedure Call，而是google Remote Procedure Call。</p><p>gRPC的调用如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/01ac424c7c1d64f678e1218827bc0109.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/01ac424c7c1d64f678e1218827bc0109.png" alt=""></a></p><p>在gRPC中，客户端可以直接调用部署在不同机器上的gRPC服务所提供的方法，调用远端的gRPC方法就像调用本地的方法一样，非常简单方便，通过gRPC调用 <strong>，我们可以非常容易地构建出一个分布式应用。</strong></p><p>像很多其他的RPC服务一样，gRPC也是通过IDL语言，预先定义好接口（接口的名字、传入参数和返回参数等）。在服务端，gRPC服务实现我们所定义的接口。在客户端，gRPC存根提供了跟服务端相同的方法。</p><p>gRPC支持多种语言，比如我们可以用Go语言实现gRPC服务，并通过Java语言客户端调用gRPC服务所提供的方法。通过多语言支持，我们编写的gRPC服务能满足客户端多语言的需求。</p><p>gRPC API接口通常使用的数据传输格式是Protocol Buffers。接下来，我们就一起了解下Protocol Buffers。</p><h2 id="protocol-buffers介绍" tabindex="-1">Protocol Buffers介绍 <a class="header-anchor" href="#protocol-buffers介绍" aria-label="Permalink to &quot;Protocol Buffers介绍&quot;">​</a></h2><p>Protocol Buffers（ProtocolBuffer/ protobuf）是Google开发的一套对数据结构进行序列化的方法，可用作（数据）通信协议、数据存储格式等，也是一种更加灵活、高效的数据格式，与XML、JSON类似。它的传输性能非常好，所以常被用在一些对数据传输性能要求比较高的系统中，作为数据传输格式。Protocol Buffers的主要特性有下面这几个。</p><ul><li>更快的数据传输速度：protobuf在传输时，会将数据序列化为二进制数据，和XML、JSON的文本传输格式相比，这可以节省大量的IO操作，从而提高数据传输速度。</li><li>跨平台多语言：protobuf自带的编译工具 protoc 可以基于protobuf定义文件，编译出不同语言的客户端或者服务端，供程序直接调用，因此可以满足多语言需求的场景。</li><li>具有非常好的扩展性和兼容性，可以更新已有的数据结构，而不破坏和影响原有的程序。</li><li>基于IDL文件定义服务，通过proto3工具生成指定语言的数据结构、服务端和客户端接口。</li></ul><p>在gRPC的框架中，Protocol Buffers主要有三个作用。</p><p><strong>第一，可以用来定义数据结构。</strong> 举个例子，下面的代码定义了一个SecretInfo数据结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// SecretInfo contains secret details.</span></span>
<span class="line"><span>message SecretInfo {</span></span>
<span class="line"><span>    string name = 1;</span></span>
<span class="line"><span>    string secret_id  = 2;</span></span>
<span class="line"><span>    string username   = 3;</span></span>
<span class="line"><span>    string secret_key = 4;</span></span>
<span class="line"><span>    int64 expires = 5;</span></span>
<span class="line"><span>    string description = 6;</span></span>
<span class="line"><span>    string created_at = 7;</span></span>
<span class="line"><span>    string updated_at = 8;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第二，可以用来定义服务接口。</strong> 下面的代码定义了一个Cache服务，服务包含了ListSecrets和ListPolicies 两个API接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Cache implements a cache rpc service.</span></span>
<span class="line"><span>service Cache{</span></span>
<span class="line"><span>  rpc ListSecrets(ListSecretsRequest) returns (ListSecretsResponse) {}</span></span>
<span class="line"><span>  rpc ListPolicies(ListPoliciesRequest) returns (ListPoliciesResponse) {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第三，可以通过protobuf序列化和反序列化，提升传输效率。</strong></p><h2 id="grpc示例" tabindex="-1">gRPC示例 <a class="header-anchor" href="#grpc示例" aria-label="Permalink to &quot;gRPC示例&quot;">​</a></h2><p>我们已经对gRPC这一通用RPC框架有了一定的了解，但是你可能还不清楚怎么使用gRPC编写API接口。接下来，我就通过gRPC官方的一个示例来快速给大家展示下。运行本示例需要在Linux服务器上安装Go编译器、Protocol buffer编译器（protoc，v3）和 protoc 的Go语言插件，在 <a href="https://time.geekbang.org/column/article/378076" target="_blank" rel="noreferrer"><strong>02讲</strong></a> 中我们已经安装过，这里不再讲具体的安装方法。</p><p>这个示例分为下面几个步骤：</p><ol><li>定义gRPC服务。</li><li>生成客户端和服务器代码。</li><li>实现gRPC服务。</li><li>实现gRPC客户端。</li></ol><p>示例代码存放在 <a href="https://github.com/marmotedu/gopractise-demo/tree/main/apistyle/greeter" target="_blank" rel="noreferrer">gopractise-demo/apistyle/greeter</a> 目录下。代码结构如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ tree</span></span>
<span class="line"><span>├── client</span></span>
<span class="line"><span>│   └── main.go</span></span>
<span class="line"><span>├── helloworld</span></span>
<span class="line"><span>│   ├── helloworld.pb.go</span></span>
<span class="line"><span>│   └── helloworld.proto</span></span>
<span class="line"><span>└── server</span></span>
<span class="line"><span>    └── main.go</span></span></code></pre></div><p>client目录存放Client端的代码，helloworld目录用来存放服务的IDL定义，server目录用来存放Server端的代码。</p><p>下面我具体介绍下这个示例的四个步骤。</p><ol><li>定义gRPC服务。</li></ol><p>首先，需要定义我们的服务。进入helloworld目录，新建文件helloworld.proto：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cd helloworld</span></span>
<span class="line"><span>$ vi helloworld.proto</span></span></code></pre></div><p>内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>syntax = &quot;proto3&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>option go_package = &quot;github.com/marmotedu/gopractise-demo/apistyle/greeter/helloworld&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package helloworld;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// The greeting service definition.</span></span>
<span class="line"><span>service Greeter {</span></span>
<span class="line"><span>  // Sends a greeting</span></span>
<span class="line"><span>  rpc SayHello (HelloRequest) returns (HelloReply) {}</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>在helloworld.proto定义文件中，option关键字用来对.proto文件进行一些设置，其中go_package是必需的设置，而且go_package的值必须是包导入的路径。package关键字指定生成的.pb.go文件所在的包名。我们通过service关键字定义服务，然后再指定该服务拥有的RPC方法，并定义方法的请求和返回的结构体类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>service Greeter {</span></span>
<span class="line"><span>  // Sends a greeting</span></span>
<span class="line"><span>  rpc SayHello (HelloRequest) returns (HelloReply) {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>gRPC支持定义4种类型的服务方法，分别是简单模式、服务端数据流模式、客户端数据流模式和双向数据流模式。</p><ul><li><p>简单模式（Simple RPC）：是最简单的gRPC模式。客户端发起一次请求，服务端响应一个数据。定义格式为rpc SayHello (HelloRequest) returns (HelloReply) {}。</p></li><li><p>服务端数据流模式（Server-side streaming RPC）：客户端发送一个请求，服务器返回数据流响应，客户端从流中读取数据直到为空。定义格式为rpc SayHello (HelloRequest) returns (stream HelloReply) {}。</p></li><li><p>客户端数据流模式（Client-side streaming RPC）：客户端将消息以流的方式发送给服务器，服务器全部处理完成之后返回一次响应。定义格式为rpc SayHello (stream HelloRequest) returns (HelloReply) {}。</p></li><li><p>双向数据流模式（Bidirectional streaming RPC）：客户端和服务端都可以向对方发送数据流，这个时候双方的数据可以同时互相发送，也就是可以实现实时交互RPC框架原理。定义格式为rpc SayHello (stream HelloRequest) returns (stream HelloReply) {}。</p></li></ul><p>本示例使用了简单模式。.proto文件也包含了Protocol Buffers 消息的定义，包括请求消息和返回消息。例如请求消息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// The request message containing the user&#39;s name.</span></span>
<span class="line"><span>message HelloRequest {</span></span>
<span class="line"><span>  string name = 1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>生成客户端和服务器代码。</li></ol><p>接下来，我们需要根据.proto服务定义生成gRPC客户端和服务器接口。我们可以使用protoc编译工具，并指定使用其Go语言插件来生成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ protoc -I. --go_out=plugins=grpc:$GOPATH/src helloworld.proto</span></span>
<span class="line"><span>$ ls</span></span>
<span class="line"><span>helloworld.pb.go  helloworld.proto</span></span></code></pre></div><p>你可以看到，新增了一个helloworld.pb.go文件。</p><ol start="3"><li>实现gRPC服务。</li></ol><p>接着，我们就可以实现gRPC服务了。进入server目录，新建main.go文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cd ../server</span></span>
<span class="line"><span>$ vi main.go</span></span></code></pre></div><p>main.go内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Package main implements a server for Greeter service.</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;context&quot;</span></span>
<span class="line"><span>	&quot;log&quot;</span></span>
<span class="line"><span>	&quot;net&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	pb &quot;github.com/marmotedu/gopractise-demo/apistyle/greeter/helloworld&quot;</span></span>
<span class="line"><span>	&quot;google.golang.org/grpc&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>	port = &quot;:50051&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// server is used to implement helloworld.GreeterServer.</span></span>
<span class="line"><span>type server struct {</span></span>
<span class="line"><span>	pb.UnimplementedGreeterServer</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// SayHello implements helloworld.GreeterServer</span></span>
<span class="line"><span>func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {</span></span>
<span class="line"><span>	log.Printf(&quot;Received: %v&quot;, in.GetName())</span></span>
<span class="line"><span>	return &amp;pb.HelloReply{Message: &quot;Hello &quot; + in.GetName()}, nil</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	lis, err := net.Listen(&quot;tcp&quot;, port)</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		log.Fatalf(&quot;failed to listen: %v&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	s := grpc.NewServer()</span></span>
<span class="line"><span>	pb.RegisterGreeterServer(s, &amp;server{})</span></span>
<span class="line"><span>	if err := s.Serve(lis); err != nil {</span></span>
<span class="line"><span>		log.Fatalf(&quot;failed to serve: %v&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码实现了我们上一步根据服务定义生成的Go接口。</p><p>我们先定义了一个Go结构体server，并为server结构体添加 <code>SayHello(context.Context, pb.HelloRequest) (pb.HelloReply, error)</code> 方法，也就是说server是GreeterServer接口（位于helloworld.pb.go文件中）的一个实现。</p><p>在我们实现了gRPC服务所定义的方法之后，就可以通过 <code>net.Listen(...)</code> 指定监听客户端请求的端口；接着，通过 <code>grpc.NewServer()</code> 创建一个gRPC Server实例，并通过 <code>pb.RegisterGreeterServer(s, &amp;server{})</code> 将该服务注册到gRPC框架中；最后，通过 <code>s.Serve(lis)</code> 启动gRPC服务。</p><p>创建完main.go文件后，在当前目录下执行 <code>go run main.go</code> ，启动gRPC服务。</p><ol start="4"><li>实现gRPC客户端。</li></ol><p>打开一个新的Linux终端，进入client目录，新建main.go文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cd ../client</span></span>
<span class="line"><span>$ vi main.go</span></span></code></pre></div><p>main.go内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Package main implements a client for Greeter service.</span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;context&quot;</span></span>
<span class="line"><span>	&quot;log&quot;</span></span>
<span class="line"><span>	&quot;os&quot;</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	pb &quot;github.com/marmotedu/gopractise-demo/apistyle/greeter/helloworld&quot;</span></span>
<span class="line"><span>	&quot;google.golang.org/grpc&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const (</span></span>
<span class="line"><span>	address     = &quot;localhost:50051&quot;</span></span>
<span class="line"><span>	defaultName = &quot;world&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	// Set up a connection to the server.</span></span>
<span class="line"><span>	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		log.Fatalf(&quot;did not connect: %v&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	defer conn.Close()</span></span>
<span class="line"><span>	c := pb.NewGreeterClient(conn)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// Contact the server and print out its response.</span></span>
<span class="line"><span>	name := defaultName</span></span>
<span class="line"><span>	if len(os.Args) &amp;gt; 1 {</span></span>
<span class="line"><span>		name = os.Args[1]</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	ctx, cancel := context.WithTimeout(context.Background(), time.Second)</span></span>
<span class="line"><span>	defer cancel()</span></span>
<span class="line"><span>	r, err := c.SayHello(ctx, &amp;pb.HelloRequest{Name: name})</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		log.Fatalf(&quot;could not greet: %v&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	log.Printf(&quot;Greeting: %s&quot;, r.Message)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面的代码中，我们通过如下代码创建了一个gRPC连接，用来跟服务端进行通信：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Set up a connection to the server.</span></span>
<span class="line"><span>conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())</span></span>
<span class="line"><span>if err != nil {</span></span>
<span class="line"><span>    log.Fatalf(&quot;did not connect: %v&quot;, err)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>defer conn.Close()</span></span></code></pre></div><p>在创建连接时，我们可以指定不同的选项，用来控制创建连接的方式，例如grpc.WithInsecure()、grpc.WithBlock()等。gRPC支持很多选项，更多的选项可以参考grpc仓库下 <a href="https://github.com/grpc/grpc-go/blob/v1.37.0/dialoptions.go" target="_blank" rel="noreferrer">dialoptions.go</a> 文件中以With开头的函数。</p><p>连接建立起来之后，我们需要创建一个客户端stub，用来执行RPC请求 <code>c := pb.NewGreeterClient(conn)</code>。创建完成之后，我们就可以像调用本地函数一样，调用远程的方法了。例如，下面一段代码通过 <code>c.SayHello</code> 这种本地式调用方式调用了远端的SayHello接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>r, err := c.SayHello(ctx, &amp;pb.HelloRequest{Name: name})</span></span>
<span class="line"><span>if err != nil {</span></span>
<span class="line"><span>    log.Fatalf(&quot;could not greet: %v&quot;, err)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>log.Printf(&quot;Greeting: %s&quot;, r.Message)</span></span></code></pre></div><p>从上面的调用格式中，我们可以看到RPC调用具有下面两个特点。</p><ul><li>调用方便：RPC屏蔽了底层的网络通信细节，使得调用RPC就像调用本地方法一样方便，调用方式跟大家所熟知的调用类的方法一致： <code>ClassName.ClassFuc(params)</code>。</li><li>不需要打包和解包：RPC调用的入参和返回的结果都是Go的结构体，不需要对传入参数进行打包操作，也不需要对返回参数进行解包操作，简化了调用步骤。</li></ul><p>最后，创建完main.go文件后，在当前目录下，执行go run main.go发起RPC调用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run main.go</span></span>
<span class="line"><span>2020/10/17 07:55:00 Greeting: Hello world</span></span></code></pre></div><p>至此，我们用四个步骤，创建并调用了一个gRPC服务。接下来我再给大家讲解一个在具体场景中的注意事项。</p><p>在做服务开发时，我们经常会遇到一种场景：定义一个接口，接口会通过判断是否传入某个参数，决定接口行为。例如，我们想提供一个GetUser接口，期望GetUser接口在传入username参数时，根据username查询用户的信息，如果没有传入username，则默认根据userId查询用户信息。</p><p>这时候，我们需要判断客户端有没有传入username参数。我们不能根据username是否为空值来判断，因为我们不能区分客户端传的是空值，还是没有传username参数。这是由Go语言的语法特性决定的：如果客户端没有传入username参数，Go会默认赋值为所在类型的零值，而字符串类型的零值就是空字符串。</p><p>那我们怎么判断客户端有没有传入username参数呢？最好的方法是通过指针来判断，如果是nil指针就说明没有传入，非nil指针就说明传入，具体实现步骤如下：</p><ol><li>编写protobuf定义文件。</li></ol><p>新建user.proto文件，内容如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>syntax = &quot;proto3&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package proto;</span></span>
<span class="line"><span>option go_package = &quot;github.com/marmotedu/gopractise-demo/protobuf/user&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//go:generate protoc -I. --experimental_allow_proto3_optional --go_out=plugins=grpc:.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>service User {</span></span>
<span class="line"><span>  rpc GetUser(GetUserRequest) returns (GetUserResponse) {}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>message GetUserRequest {</span></span>
<span class="line"><span>  string class = 1;</span></span>
<span class="line"><span>  optional string username = 2;</span></span>
<span class="line"><span>  optional string user_id = 3;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>message GetUserResponse {</span></span>
<span class="line"><span>  string class = 1;</span></span>
<span class="line"><span>  string user_id = 2;</span></span>
<span class="line"><span>  string username = 3;</span></span>
<span class="line"><span>  string address = 4;</span></span>
<span class="line"><span>  string sex = 5;</span></span>
<span class="line"><span>  string phone = 6;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你需要注意，这里我们在需要设置为可选字段的前面添加了 <strong>optional</strong> 标识。</p><ol start="2"><li>使用protoc工具编译protobuf文件。</li></ol><p>在执行protoc命令时，需要传入 <code>--experimental_allow_proto3_optional</code> 参数以打开 <strong>optional</strong> 选项，编译命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ protoc --experimental_allow_proto3_optional --go_out=plugins=grpc:. user.proto</span></span></code></pre></div><p>上述编译命令会生成user.pb.go文件，其中的GetUserRequest结构体定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type GetUserRequest struct {</span></span>
<span class="line"><span>    state         protoimpl.MessageState</span></span>
<span class="line"><span>    sizeCache     protoimpl.SizeCache</span></span>
<span class="line"><span>    unknownFields protoimpl.UnknownFields</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Class    string  \`protobuf:&quot;bytes,1,opt,name=class,proto3&quot; json:&quot;class,omitempty&quot;\`</span></span>
<span class="line"><span>    Username *string \`protobuf:&quot;bytes,2,opt,name=username,proto3,oneof&quot; json:&quot;username,omitempty&quot;\`</span></span>
<span class="line"><span>    UserId   *string \`protobuf:&quot;bytes,3,opt,name=user_id,json=userId,proto3,oneof&quot; json:&quot;user_id,omitempty&quot;\`</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过 <code>optional</code> + <code>--experimental_allow_proto3_optional</code> 组合，我们可以将一个字段编译为指针类型。</p><ol start="3"><li>编写gRPC接口实现。</li></ol><p>新建一个user.go文件，内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package user</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;context&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pb &quot;github.com/marmotedu/api/proto/apiserver/v1&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/marmotedu/iam/internal/apiserver/store&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type User struct {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (c *User) GetUser(ctx context.Context, r *pb.GetUserRequest) (*pb.GetUserResponse, error) {</span></span>
<span class="line"><span>    if r.Username != nil {</span></span>
<span class="line"><span>        return store.Client().Users().GetUserByName(r.Class, r.Username)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return store.Client().Users().GetUserByID(r.Class, r.UserId)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>总之，在GetUser方法中，我们可以通过判断r.Username是否为nil，来判断客户端是否传入了Username参数。</p><h2 id="restful-vs-grpc" tabindex="-1">RESTful VS gRPC <a class="header-anchor" href="#restful-vs-grpc" aria-label="Permalink to &quot;RESTful VS gRPC&quot;">​</a></h2><p>到这里，今天我们已经介绍完了gRPC API。回想一下我们昨天学习的RESTful API，你可能想问：这两种API风格分别有什么优缺点，适用于什么场景呢？我把这个问题的答案放在了下面这张表中，你可以对照着它，根据自己的需求在实际应用时进行选择。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/e6ae61fc4b0fc821f94d257239f332ab.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/e6ae61fc4b0fc821f94d257239f332ab.png" alt=""></a></p><p>当然，更多的时候，RESTful API 和gRPC API是一种合作的关系，对内业务使用gRPC API，对外业务使用RESTful API，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/471ac923d2eaeca8fe13cb74731c1318.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/387602/471ac923d2eaeca8fe13cb74731c1318.png" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在Go项目开发中，我们可以选择使用 RESTful API 风格和 RPC API 风格，这两种服务都用得很多。其中，RESTful API风格因为规范、易理解、易用，所以 <strong>适合用在需要对外提供API接口的场景中</strong>。而RPC API因为性能比较高、调用方便， <strong>更适合用在内部业务中</strong>。</p><p>RESTful API使用的是HTTP协议，而RPC API使用的是RPC协议。目前，有很多RPC协议可供你选择，而我推荐你使用gRPC，因为它很轻量，同时性能很高、很稳定，是一个优秀的RPC框架。所以目前业界用的最多的还是gRPC协议，腾讯、阿里等大厂内部很多核心的线上服务用的就是gRPC。</p><p>除了使用gRPC协议，在进行Go项目开发前，你也可以了解业界一些其他的优秀Go RPC框架，比如腾讯的tars-go、阿里的dubbo-go、Facebook的thrift、rpcx等，你可以在项目开发之前一并调研，根据实际情况进行选择。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>使用gRPC包，快速实现一个RPC API服务，并实现PrintHello接口，该接口会返回“Hello World”字符串。</li><li>请你思考这个场景：你有一个gRPC服务，但是却希望该服务同时也能提供RESTful API接口，这该如何实现？</li></ol><p>期待在留言区看到你的思考和答案，也欢迎和我一起探讨关于RPC API相关的问题，我们下一讲见！</p>`,107)])])}const h=n(l,[["render",t]]);export{d as __pageData,h as default};
