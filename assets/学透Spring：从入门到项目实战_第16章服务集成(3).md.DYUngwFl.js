import{_ as a,H as i,f as n,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"第16章服务集成(3)","description":"","frontmatter":{},"headers":[{"level":2,"title":"16.4　基于 Spring Cloud Gateway 实现微服务网关","slug":"_16-4-基于-spring-cloud-gateway-实现微服务网关","link":"#_16-4-基于-spring-cloud-gateway-实现微服务网关","children":[{"level":3,"title":"16.4.1　什么是微服务网关","slug":"_16-4-1-什么是微服务网关","link":"#_16-4-1-什么是微服务网关","children":[]},{"level":3,"title":"16.4.2　Spring Cloud Gateway 的路由配置","slug":"_16-4-2-spring-cloud-gateway-的路由配置","link":"#_16-4-2-spring-cloud-gateway-的路由配置","children":[]}]},{"level":2,"title":"16.5　小结","slug":"_16-5-小结","link":"#_16-5-小结","children":[]}],"relativePath":"学透Spring：从入门到项目实战/第16章服务集成(3).md","filePath":"学透Spring：从入门到项目实战/第16章服务集成(3).md","lastUpdated":1795556072000}'),l={name:"学透Spring：从入门到项目实战/第16章服务集成(3).md"};function e(t,s,h,k,d,r){return i(),n("div",null,[...s[0]||(s[0]=[p(`<h1 id="第16章服务集成-3" tabindex="-1">第16章服务集成(3) <a class="header-anchor" href="#第16章服务集成-3" aria-label="Permalink to &quot;第16章服务集成(3)&quot;">​</a></h1><h2 id="_16-4-基于-spring-cloud-gateway-实现微服务网关" tabindex="-1">16.4　基于 Spring Cloud Gateway 实现微服务网关 <a class="header-anchor" href="#_16-4-基于-spring-cloud-gateway-实现微服务网关" aria-label="Permalink to &quot;16.4　基于 Spring Cloud Gateway 实现微服务网关&quot;">​</a></h2><p>不同的微服务各司其职，相对独立地对外提供服务，这在组织内部也许不是个大问题，但当外部需要访问内部的服务时，这就会带来很多不便，比如外部客户端不得不感知内部的服务细节，又比如至少需要知道如何找到所需的服务，还有一系列其他问题有待解决。为此，可以在边界上引入微服务网关。这一节就让我们来聊聊微服务网关，以及如何使用 Spring CloudGateway 来实现微服务网关。</p><h3 id="_16-4-1-什么是微服务网关" tabindex="-1">16.4.1　什么是微服务网关 <a class="header-anchor" href="#_16-4-1-什么是微服务网关" aria-label="Permalink to &quot;16.4.1　什么是微服务网关&quot;">​</a></h3><p>在具体了解微服务网关之前，先看看没有它的时候究竟会存在些什么问题。以客户端的视角作为切入点，会发现下面这些问题。</p><ul><li><p>客户端必须了解分散在不同微服务之间的各种领域和组织细节。</p></li><li><p>客户端的接入点过于分散，不同的服务要么是不同的域名，要么直接暴露 IP，这就增加了潜在的安全风险。</p></li><li><p>不同客户端对服务的粒度要求不同，服务太散会导致交互过于频繁。</p></li><li><p>不同的服务也许会使用不同的认证方式和通信协议，不利于客户端的接入。</p></li></ul><p>服务端也有很多痛点需要解决，例如安全防护、身份认证、权限控制、审计日志、负载均衡18</p><ul><li>、容错降级、监控告警等。如果这些功能都让服务自己解决，那势必会消耗大量的人力物</li></ul><p>力，而他们本该将资源聚焦在业务上。</p><p>出于上述种种原因，微服务网关应运而生，它为内部服务提供了一个统一的入口，同时还可以提供上述提到的服务端所需的一系列横向功能，解放业务团队的生产力。微服务网关通常是一个独立的组件，根据其定位，有的网关会保持业务无关性，仅提供通用能力，有的则会包含一部分简单的业务逻辑。但总体上，建议避免将业务逻辑渗透到网关中，从而减少相互之间的耦合度。</p><ol><li>常见的微服务网关既然微服务网关这个需求如此常见，这也就意味着一定已经有了不少优秀的开源网关，我们可以先来了解一下。</li></ol><ul><li><p>NginxNginx 通常用作网站的负载均衡设施，所以它也理所应当可以用来做微服务网关。Nginx本身就有很多插件，遇到特殊需求，还可以搭配 Lua 脚本来实现，这就慢慢延伸出了知名的 OpenResty 高性能 Web 平台。后来，在 OpenResty 基础之上诞生了 Kong 网关，它是一款灵活的轻量级云原生服务网关，面向去中心化架构，可以部署在混合云和多云环境中。Kong 可以通过插件实现对请求和响应的拦截，有点类似 AOP 或者过滤器，常用的插件包含身份认证插件、安全控制插件、流量控制插件、分析监控插件、日志应用插件、协议转换插件等。Kong 本身也提供了丰富的 API，可以通过 API 实现对集群的各种管理，而 Kong 集群的各种配置和数据则会记录在 PostgreSQL 或者 Cassandra 里，维护也很方便。</p></li><li><p>Apache APISIXApache APISIX 是另一款基于 OpenResty 开发的微服务网关，兼具云原生、高性能、可扩展等诸多优点。APISIX 自带前端，可以方便地在界面上进行路由配置、负载均衡、限流和身份验证等各种操作。APISIX 与 Kong 在核心功能上不相上下，但在细节上似乎更胜一筹，例如，APISIX 在架构上是 Nginx 搭配 Etcd，可以实现配置变更的主动推送，而 Kong 是 Nginx 搭配数据库，需要主动轮询配置变更；Kong 的路由实现是遍历，而APISIX 是基于基数树，相对更高效。而且，APISIX 是国人开发，对国内主流的一些软件和框架的支持更加友好，例如能够搭配阿里巴巴开源的 Tengine 一同使用，支持Dubbo 协议代理。此外，作为 Apache 顶级项目，APISIX 也可谓自带光环。</p></li><li><p>Zuul对 Java 程序员来说，如果微服务网关是 Java 写的，那肯定会是加分项。Netflix 开源的Zuul 就是一款由 Java 编写且经过大流量考验的微服务网关。而且它是 Spring Cloud 早期推荐的微服务网关，两者无缝整合，加之本身由 Netflix 出品，与 Eureka、Ribbon 和</p></li><li><p>Hystrix 的配合更是不在话下。在之前的各种场合，Spring Cloud 都会搭配 Zuul 来进行各种演示，在实践中也一样。Zuul 的核心是请求的过滤器，通过各种过滤器来实现身份认证、审计、监控、动态路由、负载均衡等功能。此外，因为 Netflix 是大量部署在AWS 之上的，所以 Zuul 对 AWS 做了大量的优化，例如能够实现跨可用区访问，支持AWS 的 ELB（Elastic Load Balancing）等。如果我们的系统是部署在 AWS 上的，那使用 Netflix 的全套设施无疑是个好选择。</p></li><li><p>Zuul 1.x 用的是阻塞线程，到了 Zuul 2.x，对架构做了比较大的改动，基于 Netty 实现了异步非阻塞。可惜 Zuul 2.x 并不开源，所以现在它在 Spring Cloud 中的位置逐步被Spring Cloud Gateawy 所取代。</p></li></ul><ol start="2"><li>Spring Cloud Gateway 概述由于 Zuul 2.x 的开发一直跳票，到后来索性宣布不再开源，而 Zuul 1.x 又是阻塞式的，长期看来并不符合大的发展趋势，因而 Spring 团队自己开发了一个微服务网关来代替 Zuul，这就是 Spring Cloud Gateway。</li></ol><ul><li><p>Spring Cloud Gateway 是一款简单、高效的轻量级微服务网关，构建在 Spring 生态之上，用到了 Spring Framework 5、Spring Boot 2 和 Project Reactor 等项目。由于使用了Spring WebFlux，Spring Cloud Gateway 实现了非阻塞通信，相比 Zuul 1.x 在性能上有很大的提升。</p></li><li><p>与前文提到的微服务网关一样，Spring Cloud Gateway 也提供了不少微服务所需的公共能力，例如安全防护、监控、限流熔断等。这些能力都是由过滤器实现的，Spring Cloud</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Gateway 内置了大量实用的过滤器，它们全是 GatewayFilter 接口的实现，通过可配置</span></span>
<span class="line"><span>的过滤器链（GatewayFilterChain）可以满足绝大部分日常需求。就算遇到了内置过滤</span></span>
<span class="line"><span>器解决不了的问题，也可以直接动手实现自己的 GatewayFilter。当一个请求到达</span></span>
<span class="line"><span>Spring Cloud Gateway 服务器后，RoutePredicateHandlerMapping 会根据请求去查</span></span></code></pre></div><ul><li>19</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>找对应的 Route（也就是路由配置），其中包含了路由 ID、目标 URI、断言</span></span></code></pre></div><ul><li>（predicate）以及过滤器。整体上来说，Spring Cloud Gateway 的配置非常灵活，在配置服务路由信息20</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>时有两种方式可供选择，第一种是完全在 application.yml 中进行配置</span></span></code></pre></div><ul><li>，第二种是使用 Java 配置类。我们在下文详细介绍路由配置时会分别演示这两种方式。</li></ul><h3 id="_16-4-2-spring-cloud-gateway-的路由配置" tabindex="-1">16.4.2　Spring Cloud Gateway 的路由配置 <a class="header-anchor" href="#_16-4-2-spring-cloud-gateway-的路由配置" aria-label="Permalink to &quot;16.4.2　Spring Cloud Gateway 的路由配置&quot;">​</a></h3><p>Spring Cloud Gateway 并不是一个现成的独立服务，而是一个框架，我们需要自己构建一个</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Spring Cloud 工程，配置好 spring-cloud-dependencies，像下面这样引入 spring-</span></span>
<span class="line"><span>cloud-starter-gateway 依赖，随后就能在配置文件或者配置类中增加对应的路由规则</span></span></code></pre></div><p>了。如果还有服务注册与发现的需求，还可以加入对应的起步依赖，Spring Boot 会为我们完成自动配置。</p><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​groupId&gt;org.springframework.cloud&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​artifactId&gt;spring-cloud-starter-gateway&lt;​/artifactId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span></code></pre></div><p>接下来，让我们通过一个例子来具体看看应该如何进行 Spring Cloud Gateway 的路由配置。</p><ul><li>需求描述　通常情况下，奶茶店系统的后端可被视为一个整体，而顾客在系统外部。因此在顾客访问二进制奶茶店时，最好能够屏蔽系统的内部细节，也就是把 BinaryTea 和TeaMaker 作为一个整体，与 Customer 隔离开，增加一个独立的服务网关似乎是个不错的选择。</li></ul><ol><li>基础配置Spring Cloud Gateway 作为一个网关，本质上就是接收请求，然后根据预先配置的路由规则对其进行匹配并加以处理，随后转发给后端具体的服务。因此，配置路由规则、用好内置的断言和过滤器基本就是配置的所有工作了。路由的配置以</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.cloud.gateway.routes 为前缀，主要包含如下几块：</span></span>
<span class="line"><span>id，路由的编号；</span></span>
<span class="line"><span>uri，要转发的 URI，可以转给特定的后端 URI，也可以是个负载均衡的服务名；</span></span>
<span class="line"><span>predicates，要匹配的断言内容，可以是一条，也可以是多条；</span></span>
<span class="line"><span>filters，在请求转发给后端前需要经过的一个或多个过滤器。</span></span>
<span class="line"><span>以转发 /token 请求为例，代码示例 16-20 演示了如何将 /token 请求转发给</span></span>
<span class="line"><span>http://localhost:8080，最后拼接的 URI 是 http://localhost:8080/token。</span></span></code></pre></div><ul><li><p>21</p></li><li><p>代码示例 16-20　最简单的路径匹配路由</p></li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">token-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">http://localhost:8080</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path=/token</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">断言的配置有两种形式：一种是上面看到的简短写法，断言名称 Path 后跟一个 =，后续</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">内容是要传给断言的参数，用逗号 , 分隔；另一种方式是将断言完全展开，用 name 来指</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">定断言，args 来提供参数（每个断言用到的参数不太一样，可以参考官方文档中的说</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">明）。代码示例 16-21 就演示了如何用第二种方式设置 Path 断言，这里匹配 /order/**</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">的意思就是匹配以 /order/ 开头的所有路径；同时还用了服务发现来配置 URI，可以看到</span></span></code></pre></div><ul><li>22</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>其中的 URI 以 lb:// 开头，后面跟的是服务名。</span></span></code></pre></div><ul><li>代码示例 16-21　展开的断言配置</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">order-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lb://binarytea</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">             args</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               patterns</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/order/**</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">完成了 /token 和 /order 的路由配置，还剩下 /menu 这个路径，这次我们换 Java 配置</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">类的方式。在配置类中提供一个 RouteLocator 类型的 Bean，通过</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">RouteLocatorBuilder 来构造我们需要的 RouteLocator，每个路由都能用</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">PredicateSpec 来描述。代码示例 16-22 就配置了一个 /menu/** 的路由规则，把请求</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">转发到 lb://binarytea 上。</span></span></code></pre></div><ul><li>代码示例 16-22　在 Java 配置类中设置路由规则</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SpringBootApplication</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> GatewayApplication</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 省略其他代码</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Bean</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RouteLocator </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">customRouteLocator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(RouteLocatorBuilder </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">builder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)    {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> builder.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">route</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;menu-route&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, r </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> r.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">path</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/menu/**&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;lb://binarytea&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span></code></pre></div><ul><li>最后，要让我们的网关能顺利运行起来，还需要提供一些基础的配置，包括 Zookeeper 配置用来做服务发现与注册，Zipkin 与 Sleuth 的配置，以便能在 Zipkin 里看到实际的请求链路。大概的 YAML 配置会是下面这样的：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server.port: 8888</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>spring:</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span> application.name: gateway</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span> config.zookeeper.connect-string: &quot;localhost:2181&quot;</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span> zipkin.base-url: &quot;http://localhost:9411&quot;</span></span>
<span class="line"><span>6</span></span>
<span class="line"><span> sleuth.sampler.probability: 1.0</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span>8</span></span>
<span class="line"><span>management:</span></span>
<span class="line"><span>9</span></span>
<span class="line"><span> endpoint.gateway.enabled: true</span></span>
<span class="line"><span>10</span></span>
<span class="line"><span> endpoints.web.exposure.include: &quot;*&quot;</span></span>
<span class="line"><span>11</span></span></code></pre></div><ul><li>为了让 Customer 能通过网关来访问 BinaryTea，而非直接通过服务发现找到目标，我们可</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>以在 application.properties 中将 binarytea.url 改为 http://gateway，同</span></span>
<span class="line"><span>时将 OrderService 上的 @FeignClient 注解里的 name 属性值也改成 gateway。这</span></span></code></pre></div><ul><li>23</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">里的 gateway 就是进行服务注册与发现时网关用的名称。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FeignClient</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">contextId</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;orderService&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;gateway&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">path</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;/order&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> OrderService</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {...}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span></code></pre></div><ul><li>现在以此运行 TeaMaker、BinaryTea、Gateway 和 Customer 就能看到实际的运行效果。通过 Zipkin 可以看到实际的请求链路，具体如图 16-9 所示。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%AD%A6%E9%80%8FSpring%EF%BC%9A%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/images/%25E7%25AC%25AC16%25E7%25AB%25A0%25E6%259C%258D%25E5%258A%25A1%25E9%259B%2586%25E6%2588%2590-3-/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%AD%A6%E9%80%8FSpring%EF%BC%9A%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/images/%25E7%25AC%25AC16%25E7%25AB%25A0%25E6%259C%258D%25E5%258A%25A1%25E9%259B%2586%25E6%2588%2590-3-/1.png" alt=""></a></p><ul><li><p>图 16-9　通过网关访问的链路图</p></li><li><p>对于网关，通常都会设置一个向后端请求的超时时间。在 Spring Cloud Gateway 中，与后</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>端请求相关的 HTTP 配置都以 spring.cloud.gateway.httpclient 为前缀，对应的</span></span>
<span class="line"><span>属性类是 HttpClientProperties。其中 connect-timeout 对应了连接超时，单位</span></span>
<span class="line"><span>为毫秒；response-timeout 则是请求的应答超时，它的类型是 Duration，我们可以</span></span></code></pre></div><ul><li>自己指定时间单位，默认是毫秒。大概的配置可以是像下面这样的：</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     httpclient</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">       connect-timeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">       response-timeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">3s</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span></code></pre></div><ul><li>除了统一的超时配置，也可以针对每条不同的路由规则单独设置超时时间，这些配置属于路</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>由的元数据，因此要配置在 metadata 里，元数据的属性定义在 RouteMetadataUtils</span></span></code></pre></div><ul><li>里，其实也就两个，使用时是这样的：</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">token-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">http://localhost:8080</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path=/token</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         metadata</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">           connect-timeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">           response-timeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">在上面的例子中，我们已经看到了针对路径进行判断的 Path 断言。Spring Cloud</span></span></code></pre></div><ul><li>Gateway 中内置了很多不同的路由断言，每种断言都接受不同的参数，表 16-8 罗列了其中</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>的一些断言。路径的 URI 模板中可以添加变量，例如 /binarytea/order/，这里的变量</span></span>
<span class="line"><span>会被保存在 ServerWebExchange.getAttributes() 里，用的键名是</span></span>
<span class="line"><span>ServerWebExchangeUtils.URI_TEMPLATE_VARIABLES_ATTRIBUTE，在过滤器里</span></span></code></pre></div><ul><li><p>也能用到这些变量。</p></li><li><p>表 16-8　Spring Cloud Gateway 的一些常用路由断言</p></li><li><p>名称作用参数</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name，要匹配的 Cookie 名称；</span></span>
<span class="line"><span>Cookie</span></span></code></pre></div><ul><li>根据特定 Cookie 值进行正则匹配值要匹配的正则表达式</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>header，要匹配的 Header 名称</span></span>
<span class="line"><span>Header</span></span></code></pre></div><ul><li>根据特定 HTTP Header 值进行正则匹配头的值要匹配的正则表达式</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>patterns，主机名列表，不同</span></span>
<span class="line"><span>Host</span></span></code></pre></div><ul><li>根据请求的主机名进行匹配隔，主机名可以使用 ANT 风格</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>methods，HTTP 方法列表，不</span></span>
<span class="line"><span>Method</span></span></code></pre></div><ul><li>根据 HTTP 方法进行匹配例如24如果我们的网关在负载均衡后面，可能无法直接取得实际的对端地址。通常负载均衡</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>会把真实地址放在 X-ForwardedFor 之类的 HTTP Header 里，Spring Cloud Gateway</span></span>
<span class="line"><span>自带一个 RemoteAddressResolver 地址解析器，可以在 Java 类配置路由断言时传</span></span>
<span class="line"><span>入该解析器的实例，从 X-Forwarded-For 中获取地址。</span></span></code></pre></div><ol start="2"><li>常用过滤器前面介绍过了匹配请求用的断言，接下来再来了解一下路由配置中的另一个重点，也就是过滤器。通过过滤器可以对请求和应答进行各种调整。Spring Cloud Gateway 内置了大量的</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>过滤器，它们都是 GatewayFilter 接口的实现，有的专门处理 HTTP Header，有的专门</span></span></code></pre></div><ul><li>处理请求中的参数，还有的专门处理路径……过滤器的配置方法与断言类似，区别只是它们</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">配置在 filters 下。过滤器都是用 = 来分隔过滤器名称与参数，而参数之间用 , 分隔；</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">也可以用完整配置的方式，name 配置过滤器名称，args 下配置各个参数对。</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">下面的配置会保留请求中的 HostHeader，使用的就是 PreserveHostHeader 过滤器。</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">token-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">http://localhost:8080</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path=/token</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         filters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">PreserveHostHeader</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span></code></pre></div><ul><li><p>内置过滤器中有很大一部分是处理 Header 的，表 16-9 中罗列的都是针对 Header 的过滤器。</p></li><li><p>表 16-9　部分针对 HTTP Header 的过滤器</p></li><li><p>过滤器名称作用参数</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AddRequestHeader</span></span>
<span class="line"><span>na</span></span></code></pre></div><ul><li>向请求中添加 Header</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AddResponseHeader</span></span>
<span class="line"><span>na</span></span></code></pre></div><ul><li>向应答中添加 Header</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RemoveRequestHeader</span></span>
<span class="line"><span>na</span></span></code></pre></div><ul><li><p>从请求中删除 Header</p></li><li><p>除了 HTTP Header，Spring Cloud Gateway 中还有一些用来处理路径的过滤器，如表 16-10 所示。</p></li><li><p>表 16-10　部分针对路径的过滤器</p></li><li><p>过滤器名称作用参数</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PrefixPath</span></span>
<span class="line"><span>prefix，要添加的前缀</span></span></code></pre></div><ul><li>在所有匹配的请求前增加一个路径前缀</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>parts，要截掉的数量，即用 /</span></span>
<span class="line"><span>StripPrefix</span></span></code></pre></div><ul><li>将匹配请求的路径截去一部分数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>regexp，要匹配的正则表达式</span></span>
<span class="line"><span>RewritePath</span></span></code></pre></div><ul><li>根据正则匹配替换路径内容替换成的内容</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template，路径模板，用的就</span></span>
<span class="line"><span>SetPath</span></span></code></pre></div><ul><li>直接设置发送给下游的请求路径板</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">我们可以像下面这样用 StripPrefix 来处理路径，去除 /binarytea/token 中的</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/token。</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">new-token-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lb://binarytea</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path=/binarytea/token</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Method=POST</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         filters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">StripPrefix=1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span></code></pre></div><ul><li><p>还有几个比较有用的过滤器，如表 16-11 所示。</p></li><li><p>表 16-11　其他一些有用的过滤器</p></li><li><p>过滤器名称作用参数</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AddRequestParameter</span></span>
<span class="line"><span>name，要添加的参数名；</span></span></code></pre></div><ul><li>增加请求参数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RemoveRequestParameter</span></span>
<span class="line"><span>name，要移除的参数名</span></span></code></pre></div><ul><li>移除请求参数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>status，要返回的响应码</span></span>
<span class="line"><span>SetStatus</span></span></code></pre></div><ul><li>控制请求应答的 HTTP 响应码中定义的枚举值，也可以</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>200 都可以</span></span>
<span class="line"><span>status，传入 3xx 响应</span></span>
<span class="line"><span>RedirectTo</span></span></code></pre></div><ul><li>直接重定向请求URL</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CacheRequestBody</span></span>
<span class="line"><span>bodyClass，请求体对应</span></span></code></pre></div><ul><li><p>缓存请求体</p></li><li><p>过滤器不仅可以配置在单条路由规则上，还可以批量配置默认的过滤器，使用</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring.cloud.gateway.default-filters 可以轻松地为所有路由规则配置过滤器，</span></span>
<span class="line"><span>比如下面这段配置会为所有路由加上 SecureHeaders 过滤器。</span></span></code></pre></div><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     default-filters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">SecureHeaders</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span></code></pre></div><ol start="3"><li>服务容错保护在 Spring Cloud Gateway 内置的过滤器中，还有一类特殊的过滤器，需要单独拿出来做一下介绍。在第 15 章里我们介绍了如何进行容错保护，在每个服务中通过引入 Resilience4j等框架来实现基础的保护。其实，微服务网关可以统一为背后的服务提供断路、限流、重试等保护，后端服务如果没有非常强烈的特殊需要，完全可以将这些事托付给网关来处理。</li></ol><ul><li>先来说说断路保护。Spring Cloud Gateway 默认支持 Spring Cloud CircuitBreaker 提供的断路器，在 15.3 节中我们已经介绍过它了。由于 Spring Cloud Gateway 是响应式的，因</li></ul><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">而我们要先在 pom.xml 中引入 spring-cloud-starter-circuitbreaker-</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">reactor-resilience4j 依赖。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​groupId&gt;org.springframework.cloud&lt;​/groupId&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   &lt;​artifactId&gt;spring-cloud-starter-circuitbreaker-reactor-resilience4j&lt;​/artif</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​/dependency&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">CircuitBreaker 过滤器有三个参数，第一个 name 设置了断路器的名称，有了名字就可</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">以像 15.2.2 节中那样为断路器配置各种参数；第二个参数是可选的 fallbackUri，用来</span></span></code></pre></div><ul><li>25</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>设置断路后重定向的 URI，目前仅支持以 forward:</span></span></code></pre></div><ul><li>为前缀的 URI，异常信息会被保存</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在 ServerWebExchange 的属性里，键名是</span></span>
<span class="line"><span>ServerWebExchangeUtils.CIRCUITBREAKER_EXECUTION_EXCEPTION_ATTR；第</span></span>
<span class="line"><span>三个参数是可选的 statusCodes，这是一个 HttpStatus 列表，可以根据 HTTP 响应码</span></span>
<span class="line"><span>来进行断路统计。在 forward: 跳转到 fallbackUri 时，可以通过</span></span>
<span class="line"><span>FallbackHeaders 过滤器在 HTTP Header 中传递异常相关的信息（如果有异常信息的</span></span></code></pre></div><ul><li><p>话），Header 名可以用表 16-12 中的参数进行设置。</p></li><li><p>表 16-12　FallbackHeaders 可以传递的异常信息</p></li><li><p>参数默认值</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>executionExceptionTypeHeaderName</span></span>
<span class="line"><span>Execution-Exception-Type</span></span>
<span class="line"><span>executionExceptionMessageHeaderName</span></span>
<span class="line"><span>Execution-Exception-Message</span></span>
<span class="line"><span>rootCauseExceptionTypeHeaderName</span></span>
<span class="line"><span>Root-Cause-Exception-Type</span></span>
<span class="line"><span>rootCauseExceptionMessageHeaderName</span></span>
<span class="line"><span>Root-Cause-Exception-Message</span></span>
<span class="line"><span>我们以 /menu/** 的请求为例，在出现 500 Internal Server Error 时希望能够降</span></span>
<span class="line"><span>级到一个特定的 /fallbackURI 上，menu-route 的配置大概会是代码示例 16-23 这样</span></span></code></pre></div><ul><li><p>的。</p></li><li><p>代码示例 16-23　包含熔断降级功能的菜单路由配置</p></li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">spring</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cloud</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   gateway</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     routes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> menu</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         uri</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> lb</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//binarytea</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         predicates</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Path</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">menu</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">8</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         filters:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">9</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           - FallbackHeaders</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">10</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           - name: CircuitBreaker</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">11</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             args:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">12</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               name: menu-cb</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">13</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               fallbackUri: forward:/fallback</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">14</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               statusCodes:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">15</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">                 - INTERNAL_SERVER_ERROR</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">16</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">我们需要在 Gateway 工程中添加一个 /fallback 的 WebFlux 控制器，如代码示例 16-24</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">所示，它直接返回一个 {}JSON 字符串，把所有的 HTTP Header 打印在日志里。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">代码示例 16-24　/fallback 控制器</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">@RestController</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">@Slf4j</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">2</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">public class FallbackController {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">3</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   @RequestMapping(&quot;/fallback&quot;)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">4</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   public Mono&lt;​String&gt; fallback(ServerHttpRequest request) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">5</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       request.getHeaders().forEach((k, v) -&gt; log.info(&quot;Header [{}] : {}&quot;,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">6</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           k, v.stream().collect(Collectors.joining(&quot;,&quot;))));</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">7</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       return Mono.just(&quot;{}&quot;);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">8</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   }</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">9</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">10</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">假设我们稍微修改一下 BinaryTea 中 /menu/ 的代码，会直接抛出一个</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">RuntimeException，在没有设置 CircuitBreaker 过滤器时，curl 命令访问的输出</span></span></code></pre></div><ul><li>是这样的：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>▸ curl -v http://localhost:8888/menu/1</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>*   Trying ::1:8888...</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>* Connected to localhost (::1) port 8888 (#0)</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>&gt; GET /menu/1 HTTP/1.1</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>&gt; Host: localhost:8888</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span>&gt; User-Agent: curl/7.77.0</span></span>
<span class="line"><span>6</span></span>
<span class="line"><span>&gt; Accept: */*</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span>&gt;</span></span>
<span class="line"><span>8</span></span>
<span class="line"><span>&lt; HTTP/1.1 500 Internal Server Error</span></span>
<span class="line"><span>9</span></span>
<span class="line"><span>&lt; transfer-encoding: chunked</span></span>
<span class="line"><span>10</span></span>
<span class="line"><span>省略很多HTTP Header……</span></span>
<span class="line"><span>11</span></span>
<span class="line"><span>&lt; X-Permitted-Cross-Domain-Policies: none</span></span>
<span class="line"><span>12</span></span>
<span class="line"><span>&lt;</span></span>
<span class="line"><span>13</span></span>
<span class="line"><span>* Connection #0 to host localhost left intact</span></span>
<span class="line"><span>14</span></span>
<span class="line"><span>{&quot;timestamp&quot;:&quot;2021-12-28T15:14:45.994+00:00&quot;,&quot;status&quot;:500,&quot;error&quot;:&quot;Internal Se</span></span>
<span class="line"><span>15</span></span>
<span class="line"><span>而按照代码示例 16-23 配置后，输出的效果则变成了返回 200 OK，说明我们的断路保护</span></span></code></pre></div><ul><li>生效了。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>▸ curl -v http://localhost:8888/menu/1</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>*   Trying ::1:8888...</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>* Connected to localhost (::1) port 8888 (#0)</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>&gt; GET /menu/1 HTTP/1.1</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>&gt; Host: localhost:8888</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span>&gt; User-Agent: curl/7.77.0</span></span>
<span class="line"><span>6</span></span>
<span class="line"><span>&gt; Accept: */*</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span>&gt;</span></span>
<span class="line"><span>8</span></span>
<span class="line"><span>&lt; HTTP/1.1 200 OK</span></span>
<span class="line"><span>9</span></span>
<span class="line"><span>&lt; Content-Type: text/plain;charset=UTF-8</span></span>
<span class="line"><span>10</span></span>
<span class="line"><span>&lt; Content-Length: 2</span></span>
<span class="line"><span>11</span></span>
<span class="line"><span>&lt;</span></span>
<span class="line"><span>12</span></span>
<span class="line"><span>* Connection #0 to host localhost left intact</span></span>
<span class="line"><span>13</span></span>
<span class="line"><span>{}%</span></span>
<span class="line"><span>14</span></span>
<span class="line"><span>对于限流的场景，Spring Cloud Gateway 提供了 RequestRateLimiter 过滤器。它通过</span></span>
<span class="line"><span>RateLimiter 来判断当前请求是否可以通过，如果不能，则默认返回 429 Too Many</span></span>
<span class="line"><span>Requests 响应码。我们可以用 keyResolver 参数传入 Bean ID，形式是 #</span></span>
<span class="line"><span>{@BeanID}。这是一个 KeyResolver 的实现，告诉 RequestRateLimiter 如何从请</span></span>
<span class="line"><span>求中解析出限流用的键名，默认会用 PrincipalNameKeyResolver，它将从</span></span>
<span class="line"><span>ServerWebExchange 里取得的 Principal 名称作为键名。如果取不到键名，默认会返</span></span>
<span class="line"><span>回 403 Forbidden 拒绝当前请求，也可以通过调整</span></span>
<span class="line"><span>spring.cloud.gateway.filter.request-rate-limiter.deny-empty-</span></span>
<span class="line"><span>key=false 和 spring.cloud.gateway.filter.request-rate-</span></span>
<span class="line"><span>limiter.empty-key-status-code=200 改变默认设置。需要注意的是，这个过滤器</span></span></code></pre></div><ul><li>必须使用完整配置的方式来配置，不支持简单方式配置。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在现实场景中，集群限流的需求也很强烈，因此 RequestRateLimiter 还支持基于</span></span>
<span class="line"><span>Redis 的令牌桶算法，通过 Redis 在集群间共享令牌。对 Redis 的支持是由 spring-</span></span>
<span class="line"><span>boot-starter-data-redis-reactive 来提供的，所以网关需要添加这个依赖。相关</span></span></code></pre></div><ul><li>的参数如表 16-13 所示，不同的搭配能产生不同的限流效果。例如，只允许 1 秒处理 1 个</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请求可以设置 replenishRate=1、burstCapacity=1 和 requestedTokens=1，如</span></span>
<span class="line"><span>果是 1 分钟处理 1 个请求，则是 replenishRate=1、burstCapacity=60 和</span></span>
<span class="line"><span>requestedTokens=60。</span></span></code></pre></div><ul><li><p>表 16-13　Redis 限流的参数</p></li><li><p>参数默认值说明</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>redis-rate-limiter.replenishRate</span></span></code></pre></div><ul><li>填充令牌桶的速率，也就是每秒</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>redis-rate-limiter.burstCapacity</span></span></code></pre></div><ul><li>令牌桶的最大容量</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>redis-rate-limiter.requestedTokens</span></span>
<span class="line"><span>1</span></span></code></pre></div><ul><li>每次请求从令牌桶中取出的令牌</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">假设我们希望对 /menu 下的请求进行全局限流，每 30 秒只能请求 1 次，可以像下面这样</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">配置 Redis 限流。注意，由于 YAML 格式的原因，keyResolver 的值需要加引号。</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> redis</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   host</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">localhost</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   port</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6379</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">menu-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lb://binarytea</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path=/menu/**</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         filters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">RequestRateLimiter</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">13</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">             args</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               keyResolver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;#{@pathKeyResolver}&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               redis-rate-limiter.replenishRate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               redis-rate-limiter.burstCapacity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               redis-rate-limiter.requestedTokens</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">18</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">为了针对路径进行限流，我们专门配置了一个 pathKeyResolver Bean，它的配置如代</span></span></code></pre></div><ul><li>码示例 16-25 所示，此处直接从请求中取出路径作为键名。</li></ul><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">代码示例 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">25</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">　GatewayApplication 中的 pathKeyResolver 配置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SpringBootApplication</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> GatewayApplication</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Bean</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> KeyResolver </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pathKeyResolver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> exchange </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Mono.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">just</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(exchange.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getRequest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getPath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toString</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 省略其他代码</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">用 curl 命令访问 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">menu</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">，可以观察一下应答的内容，其中包含了限流相关的信息。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">▸ curl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">v http</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//localhost:8888/menu/1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Trying </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">8888...</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Connected to </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">localhost</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) port </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8888</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (#</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> GET </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">menu</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HTTP</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.1</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Host</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> localhost</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8888</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> User</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Agent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> curl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7.77</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">0</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Accept</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">7</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">8</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; HTTP/1.1 200 OK</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">9</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Remaining: 0</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">10</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Requested-Tokens: 30</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">11</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Burst-Capacity: 30</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">12</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Replenish-Rate: 1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">13</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; ETag: &quot;028ff1e8fd36bd1f2a847a91b06f668ee&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">14</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">……</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">15</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">{&quot;id&quot;:1,&quot;name&quot;:&quot;Java咖啡&quot;,&quot;size&quot;:&quot;MEDIUM&quot;,&quot;price&quot;:{&quot;amount&quot;:12.00,&quot;currency&quot;:&quot;C</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">16</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&quot;2022-01-02T11:53:56.868+00:00&quot;,&quot;updateTime&quot;:&quot;2022-01-02T11:53:56.868+00:00&quot;}%</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">17</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">在 30 秒内连续访问后，响应码会变为 429 Too Many Requests，也就是被限流了。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">……</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; HTTP/1.1 429 Too Many Requests</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">2</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Remaining: 3</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">3</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Requested-Tokens: 30</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">4</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Burst-Capacity: 30</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">5</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt; X-RateLimit-Replenish-Rate: 1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">6</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">……</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">7</span></span></code></pre></div><ul><li>在发生非正常响应时，通常可以让服务的上游自行处理。对于时间在可接受的范围内、下游又支持重试的情况，让网关发起重试也不失为一种好的选择。Spring Cloud Gateway 提供</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>了 Retry 过滤器，可以精确地控制网关的重试动作。表 16-14 罗列了 Retry 过滤器的参</span></span></code></pre></div><ul><li><p>数，通过这几个参数可以控制重试次数以及何时重试。</p></li><li><p>表 16-14　Retry 过滤器的参数</p></li><li><p>参数默认值说明</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>retries</span></span>
<span class="line"><span>3</span></span></code></pre></div><ul><li>重试次数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>statuses</span></span></code></pre></div><ul><li>要重试的 HTTP 响应码列表，枚</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>methods</span></span>
<span class="line"><span>GET</span></span></code></pre></div><ul><li>要重试的HTTP 方法列表枚举</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>如果希望两次重试之间的时间间隔能呈指数级递增，可以配置 backoff 参数。这个参数默</span></span>
<span class="line"><span>认是关闭的，下面有多个参数配合，表 16-15 是 backoff 中可以配置的参数。如果</span></span>
<span class="line"><span>basedOnPreviousValue 为 true，间隔时间是上次间隔时间 * factor；如果为</span></span>
<span class="line"><span>false，则为 firstBackoff * (factor ^ n)，n 为迭代数，间隔时间的计算方式可</span></span>
<span class="line"><span>以参考 Backoff.exponential() 方法。</span></span></code></pre></div><ul><li><p>表 16-15　backoff 中包含的参数</p></li><li><p>参数默认值说明</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>firstBackoff</span></span>
<span class="line"><span>5ms</span></span></code></pre></div><ul><li>首次间隔时间</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>maxBackoff</span></span></code></pre></div><ul><li>最大的间隔时间，为空则没有上限</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>factor</span></span>
<span class="line"><span>2</span></span></code></pre></div><ul><li>指数级递增的因子</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>basedOnPreviousValue</span></span>
<span class="line"><span>true</span></span></code></pre></div><ul><li>是否基于上一次的间隔时间进行计算</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>下面针对 /token 这个路径的 POST 请求配置了一个重试策略：重试 5 次；间隔时间第 1</span></span></code></pre></div><ul><li>次为 10 毫秒，第 2 次为 20 毫秒，第 3 次为 40 毫秒，第 4 次为 50 毫秒，第 5 次为 50 毫秒，算上第一次正常请求，一共会有 6 次调用。</li></ul><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">spring</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> cloud</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">   gateway</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">     routes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">token-route</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         uri</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">http://localhost:8080</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         predicates</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Path=/token</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">         filters</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">9</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Retry</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">             args</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">11</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               retries</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               methods</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POST</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">13</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               series</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">CLIENT_ERROR</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">               backoff</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">                 firstBackoff</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">10ms</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">                 maxBackoff</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">50ms</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">17</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">basedOnPreviousValue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">18</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">这里为了方便演示，专门针对 4XX 的应答进行了重试配置。用下面的 curl 命令请求后，可</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">以观察 BinaryTea 的日志，能看到有 6 次响应码是 400 的请求。</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">▸ curl -v -X POST -H &quot;Content-Type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">application/json&quot; -d &quot;{}&quot; http://localhost</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span></code></pre></div><h2 id="_16-5-小结" tabindex="-1">16.5　小结 <a class="header-anchor" href="#_16-5-小结" aria-label="Permalink to &quot;16.5　小结&quot;">​</a></h2><p>本章我们着重了解了一些与服务集成有关的知识，例如，在 REST 服务这种方式以外，还可以使用 Apache Dubbo 进行 RPC 通信，通过消息中心进行异步的消息通信。在复杂的微服务架构里，如何在 OpenZipkin 的帮助下了解服务的全貌。市面上几乎所有的服务链路治理工具都受到了 Dapper 论文的影响，Trace ID 和 Span ID 十分重要。最后我们还看了下 SpringCloud Gateway。在 Spring Cloud 的早期版本中，微服务网关是 Zuul 1.x，但现在已经是以Spring Cloud Gateway 为主了。作为一款简单易用的微服务网关，它很好地嵌入了 Spring 生态。</p><ul><li><p>二进制奶茶店项目开发小结在本章中，针对二进制奶茶店的系统，我们尝试用 Dubbo RPC 服务来代替 REST 服务。对于下面两个更适合用异步通知的场景，还用 MQ 消息代替了 HTTP 服务：支付后通知调茶师开始制作订单；</p></li><li><p>订单制作完毕通知前台。</p></li><li><p>为了应对不断增长的复杂性，我们引入了 Spring Cloud Sleuth 来进行服务链路分析，帮助我们理解一个订单的处理链路。针对要对外提供服务的微服务，通常还会在服务的前面增加微服务网关，我们用 Spring Cloud Gateway 配置了一个最基础的网关。纵观整个二进制奶茶店的例子，它为我们演示了很多功能，包括但不限于：Spring Framework 与 Spring Boot 的基础使用方法；</p></li><li><p>通过 JDBC 与 ORM 框架来操作数据库；</p></li><li><p>Redis 的基础用法；</p></li><li><p>基于 Spring MVC 的 Web 开发方法；</p></li><li><p>发布与调用 RESTful 风格的 Web 服务；</p></li><li><p>通过 Spring Security 保护 Web 服务；</p></li><li><p>生产并消费基于消息中间件的消息；</p></li><li><p>基于 Spring Cloud 实现服务注册与发现、服务配置与服务容错。</p></li><li><p>这个例子相对简单，并不能直接放到生产中使用，但它已经足够用来说明框架与组件的使用方法了。</p></li></ul><p>[18]：之前我们介绍过服务注册与发现机制可以用来解决负载均衡的问题，但服务注册中心通常是在内部使用的，不会暴露到组织外</p><ul><li>部，因此一般情况下这种方案不适用于外部的客户端，外部还是得要通过事先约定好的域名或 IP 来访问服务。</li></ul><p>[19]：遵从业内的惯用翻译，将 predicate 翻译为断言。在本节，断言特指 predicate，本书其他章节的断言为 assertion。[20]：因为路由配置可能会很复杂，因此在这里建议使用表现力更强的 YAML，而非 Properties 文件。[21]：这部分的示例在第 16 章的 gateway 工程里，对应修改的客户端示例则是 customer-gateway。[22]：如果用到服务发现与注册机制，不要忘记添加相关的依赖。[23]：如果是外部访问内部服务，通常都不会用服务发现机制，而是通过域名或 IP 来访问负载均衡设施。在内部服务访问时，可以</p><ul><li>考虑示例中的方式。</li></ul><p>[25]：在 9.3.1 中介绍过这个前缀，这是一个服务器端的重定向，可以带着请求上下文跳转。</p>`,157)])])}const o=a(l,[["render",e]]);export{g as __pageData,o as default};
