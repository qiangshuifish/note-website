import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"24 | Web 服务：Web 服务核心功能有哪些，如何实现？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Web服务的核心功能","slug":"web服务的核心功能","link":"#web服务的核心功能","children":[]},{"level":2,"title":"为什么选择Gin框架？","slug":"为什么选择gin框架","link":"#为什么选择gin框架","children":[]},{"level":2,"title":"Gin是如何支持Web服务基础功能的？","slug":"gin是如何支持web服务基础功能的","link":"#gin是如何支持web服务基础功能的","children":[{"level":3,"title":"HTTP/HTTPS支持","slug":"http-https支持","link":"#http-https支持","children":[]},{"level":3,"title":"JSON数据格式支持","slug":"json数据格式支持","link":"#json数据格式支持","children":[]},{"level":3,"title":"路由匹配","slug":"路由匹配","link":"#路由匹配","children":[]},{"level":3,"title":"路由分组","slug":"路由分组","link":"#路由分组","children":[]},{"level":3,"title":"一进程多服务","slug":"一进程多服务","link":"#一进程多服务","children":[]},{"level":3,"title":"参数解析、参数校验、逻辑处理、返回结果","slug":"参数解析、参数校验、逻辑处理、返回结果","link":"#参数解析、参数校验、逻辑处理、返回结果","children":[]}]},{"level":2,"title":"Gin是如何支持Web服务高级功能的？","slug":"gin是如何支持web服务高级功能的","link":"#gin是如何支持web服务高级功能的","children":[{"level":3,"title":"中间件","slug":"中间件","link":"#中间件","children":[]},{"level":3,"title":"认证、RequestID、跨域","slug":"认证、requestid、跨域","link":"#认证、requestid、跨域","children":[]},{"level":3,"title":"优雅关停","slug":"优雅关停","link":"#优雅关停","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/24-Web服务：Web服务核心功能有哪些，如何实现？.md","filePath":"Go语言项目开发实战/24-Web服务：Web服务核心功能有哪些，如何实现？.md","lastUpdated":1779815754000}'),t={name:"Go语言项目开发实战/24-Web服务：Web服务核心功能有哪些，如何实现？.md"};function l(i,n,o,c,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_24-web-服务-web-服务核心功能有哪些-如何实现" tabindex="-1">24 | Web 服务：Web 服务核心功能有哪些，如何实现？ <a class="header-anchor" href="#_24-web-服务-web-服务核心功能有哪些-如何实现" aria-label="Permalink to &quot;24 | Web 服务：Web 服务核心功能有哪些，如何实现？&quot;">​</a></h1><p>你好，我是孔令飞。从今天开始，我们进入实战第三站：服务开发。在这个部分，我会讲解 IAM项目各个服务的构建方式，帮助你掌握Go 开发阶段的各个技能点。</p><p>在Go项目开发中，绝大部分情况下，我们是在写能提供某种功能的后端服务，这些功能以RPC API 接口或者RESTful API接口的形式对外提供，能提供这两种API接口的服务也统称为Web服务。今天这一讲，我就通过介绍RESTful API风格的Web服务，来给你介绍下如何实现Web服务的核心功能。</p><p>那今天我们就来看下，Web服务的核心功能有哪些，以及如何开发这些功能。</p><h2 id="web服务的核心功能" tabindex="-1">Web服务的核心功能 <a class="header-anchor" href="#web服务的核心功能" aria-label="Permalink to &quot;Web服务的核心功能&quot;">​</a></h2><p>Web服务有很多功能，为了便于你理解，我将这些功能分成了基础功能和高级功能两大类，并总结在了下面这张图中：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/1a6d38450cdd0e115e505ab30113602e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/1a6d38450cdd0e115e505ab30113602e.jpg" alt=""></a></p><p>下面，我就按图中的顺序，来串讲下这些功能。</p><p>要实现一个Web服务，首先我们要选择通信协议和通信格式。在Go项目开发中，有HTTP+JSON 和 gRPC+Protobuf两种组合可选。因为iam-apiserver主要提供的是REST风格的API接口，所以选择的是HTTP+JSON组合。</p><p><strong>Web服务最核心的功能是路由匹配。</strong> 路由匹配其实就是根据 <code>(HTTP方法, 请求路径)</code> 匹配到处理这个请求的函数，最终由该函数处理这次请求，并返回结果，过程如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/1f5yydeffb32732e7d0e23a0a9cd369d.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/1f5yydeffb32732e7d0e23a0a9cd369d.jpg" alt=""></a></p><p>一次HTTP请求经过路由匹配，最终将请求交由 <code>Delete(c *gin.Context)</code> 函数来处理。变量 <code>c</code> 中存放了这次请求的参数，在Delete函数中，我们可以进行参数解析、参数校验、逻辑处理，最终返回结果。</p><p>对于大型系统，可能会有很多个API接口，API接口随着需求的更新迭代，可能会有多个版本，为了便于管理，我们需要 <strong>对路由进行分组</strong>。</p><p>有时候，我们需要在一个服务进程中，同时开启HTTP服务的80端口和HTTPS的443端口，这样我们就可以做到：对内的服务，访问80端口，简化服务访问复杂度；对外的服务，访问更为安全的HTTPS服务。显然，我们没必要为相同功能启动多个服务进程，所以这时候就需要Web服务能够支持 <strong>一进程多服务</strong> 的功能。</p><p>我们开发Web服务最核心的诉求是：输入一些参数，校验通过后，进行业务逻辑处理，然后返回结果。所以Web服务还应该能够进行 <strong>参数解析</strong>、 <strong>参数校验</strong>、 <strong>逻辑处理</strong>、 <strong>返回结果</strong>。这些都是Web服务的业务处理功能。</p><p>上面这些是Web服务的基本功能，此外，我们还需要支持一些高级功能。</p><p>在进行HTTP请求时，经常需要针对每一次请求都设置一些通用的操作，比如添加Header、添加RequestID、统计请求次数等，这就要求我们的Web服务能够支持 <strong>中间件</strong> 特性。</p><p>为了保证系统安全，对于每一个请求，我们都需要进行 <strong>认证</strong>。Web服务中，通常有两种认证方式，一种是基于用户名和密码，一种是基于Token。认证通过之后，就可以继续处理请求了。</p><p>为了方便定位和跟踪某一次请求，需要支持 <strong>RequestID</strong>，定位和跟踪RequestID主要是为了排障。</p><p>最后，当前的软件架构中，很多采用了前后端分离的架构。在前后端分离的架构中，前端访问地址和后端访问地址往往是不同的，浏览器为了安全，会针对这种情况设置跨域请求，所以Web服务需要能够处理浏览器的 <strong>跨域</strong> 请求。</p><p>到这里，我就把Web服务的基础功能和高级功能串讲了一遍。当然，上面只介绍了Web服务的核心功能，还有很多其他的功能，你可以通过学习 <a href="https://github.com/gin-gonic/gin" target="_blank" rel="noreferrer">Gin的官方文档</a> 来了解。</p><p>你可以看到，Web服务有很多核心功能，这些功能我们可以基于net/http包自己封装。但在实际的项目开发中， 我们更多会选择使用基于net/http包进行封装的优秀开源Web框架。本实战项目选择了Gin框架。</p><p>接下来，我们主要看下Gin框架是如何实现以上核心功能的，这些功能我们在实际的开发中可以直接拿来使用。</p><h2 id="为什么选择gin框架" tabindex="-1">为什么选择Gin框架？ <a class="header-anchor" href="#为什么选择gin框架" aria-label="Permalink to &quot;为什么选择Gin框架？&quot;">​</a></h2><p>优秀的Web框架有很多，我们为什么要选择Gin呢？在回答这个问题之前，我们先来看下选择Web框架时的关注点。</p><p>在选择Web框架时，我们可以关注如下几点：</p><ul><li>路由功能；</li><li>是否具备middleware/filter能力；</li><li>HTTP 参数（path、query、form、header、body）解析和返回；</li><li>性能和稳定性；</li><li>使用复杂度；</li><li>社区活跃度。</li></ul><p>按 GitHub Star 数来排名，当前比较火的 Go Web 框架有 Gin、Beego、Echo、Revel 、Martini。经过调研，我从中选择了Gin框架，原因是Gin具有如下特性：</p><ul><li>轻量级，代码质量高，性能比较高；</li><li>项目目前很活跃，并有很多可用的 Middleware；</li><li>作为一个 Web 框架，功能齐全，使用起来简单。</li></ul><p>那接下来，我就先详细介绍下Gin框架。</p><p><a href="https://github.com/gin-gonic/gin" target="_blank" rel="noreferrer">Gin</a> 是用Go语言编写的Web框架，功能完善，使用简单，性能很高。Gin核心的路由功能是通过一个定制版的 <a href="https://github.com/julienschmidt/httprouter" target="_blank" rel="noreferrer">HttpRouter</a> 来实现的，具有很高的路由性能。</p><p>Gin有很多功能，这里我给你列出了它的一些核心功能：</p><ul><li>支持HTTP方法：GET、POST、PUT、PATCH、DELETE、OPTIONS。</li><li>支持不同位置的HTTP参数：路径参数（path）、查询字符串参数（query）、表单参数（form）、HTTP头参数（header）、消息体参数（body）。</li><li>支持HTTP路由和路由分组。</li><li>支持middleware和自定义middleware。</li><li>支持自定义Log。</li><li>支持binding和validation，支持自定义validator。可以bind如下参数：query、path、body、header、form。</li><li>支持重定向。</li><li>支持basic auth middleware。</li><li>支持自定义HTTP配置。</li><li>支持优雅关闭。</li><li>支持HTTP2。</li><li>支持设置和获取cookie。</li></ul><h2 id="gin是如何支持web服务基础功能的" tabindex="-1">Gin是如何支持Web服务基础功能的？ <a class="header-anchor" href="#gin是如何支持web服务基础功能的" aria-label="Permalink to &quot;Gin是如何支持Web服务基础功能的？&quot;">​</a></h2><p>接下来，我们先通过一个具体的例子，看下Gin是如何支持Web服务基础功能的，后面再详细介绍这些功能的用法。</p><p>我们创建一个webfeature目录，用来存放示例代码。因为要演示HTTPS的用法，所以需要创建证书文件。具体可以分为两步。</p><p>第一步，执行以下命令创建证书：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cat &amp;lt;&amp;lt; &#39;EOF&#39; &amp;gt; ca.pem</span></span>
<span class="line"><span>-----BEGIN CERTIFICATE-----</span></span>
<span class="line"><span>MIICSjCCAbOgAwIBAgIJAJHGGR4dGioHMA0GCSqGSIb3DQEBCwUAMFYxCzAJBgNV</span></span>
<span class="line"><span>BAYTAkFVMRMwEQYDVQQIEwpTb21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBX</span></span>
<span class="line"><span>aWRnaXRzIFB0eSBMdGQxDzANBgNVBAMTBnRlc3RjYTAeFw0xNDExMTEyMjMxMjla</span></span>
<span class="line"><span>Fw0yNDExMDgyMjMxMjlaMFYxCzAJBgNVBAYTAkFVMRMwEQYDVQQIEwpTb21lLVN0</span></span>
<span class="line"><span>YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQxDzANBgNVBAMT</span></span>
<span class="line"><span>BnRlc3RjYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAwEDfBV5MYdlHVHJ7</span></span>
<span class="line"><span>+L4nxrZy7mBfAVXpOc5vMYztssUI7mL2/iYujiIXM+weZYNTEpLdjyJdu7R5gGUu</span></span>
<span class="line"><span>g1jSVK/EPHfc74O7AyZU34PNIP4Sh33N+/A5YexrNgJlPY+E3GdVYi4ldWJjgkAd</span></span>
<span class="line"><span>Qah2PH5ACLrIIC6tRka9hcaBlIECAwEAAaMgMB4wDAYDVR0TBAUwAwEB/zAOBgNV</span></span>
<span class="line"><span>HQ8BAf8EBAMCAgQwDQYJKoZIhvcNAQELBQADgYEAHzC7jdYlzAVmddi/gdAeKPau</span></span>
<span class="line"><span>sPBG/C2HCWqHzpCUHcKuvMzDVkY/MP2o6JIW2DBbY64bO/FceExhjcykgaYtCH/m</span></span>
<span class="line"><span>oIU63+CFOTtR7otyQAWHqXa7q4SbCDlG7DyRFxqG0txPtGvy12lgldA2+RgcigQG</span></span>
<span class="line"><span>Dfcog5wrJytaQ6UA0wE=</span></span>
<span class="line"><span>-----END CERTIFICATE-----</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cat &amp;lt;&amp;lt; &#39;EOF&#39; &amp;gt; server.key</span></span>
<span class="line"><span>-----BEGIN PRIVATE KEY-----</span></span>
<span class="line"><span>MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAOHDFScoLCVJpYDD</span></span>
<span class="line"><span>M4HYtIdV6Ake/sMNaaKdODjDMsux/4tDydlumN+fm+AjPEK5GHhGn1BgzkWF+slf</span></span>
<span class="line"><span>3BxhrA/8dNsnunstVA7ZBgA/5qQxMfGAq4wHNVX77fBZOgp9VlSMVfyd9N8YwbBY</span></span>
<span class="line"><span>AckOeUQadTi2X1S6OgJXgQ0m3MWhAgMBAAECgYAn7qGnM2vbjJNBm0VZCkOkTIWm</span></span>
<span class="line"><span>V10okw7EPJrdL2mkre9NasghNXbE1y5zDshx5Nt3KsazKOxTT8d0Jwh/3KbaN+YY</span></span>
<span class="line"><span>tTCbKGW0pXDRBhwUHRcuRzScjli8Rih5UOCiZkhefUTcRb6xIhZJuQy71tjaSy0p</span></span>
<span class="line"><span>dHZRmYyBYO2YEQ8xoQJBAPrJPhMBkzmEYFtyIEqAxQ/o/A6E+E4w8i+KM7nQCK7q</span></span>
<span class="line"><span>K4JXzyXVAjLfyBZWHGM2uro/fjqPggGD6QH1qXCkI4MCQQDmdKeb2TrKRh5BY1LR</span></span>
<span class="line"><span>81aJGKcJ2XbcDu6wMZK4oqWbTX2KiYn9GB0woM6nSr/Y6iy1u145YzYxEV/iMwff</span></span>
<span class="line"><span>DJULAkB8B2MnyzOg0pNFJqBJuH29bKCcHa8gHJzqXhNO5lAlEbMK95p/P2Wi+4Hd</span></span>
<span class="line"><span>aiEIAF1BF326QJcvYKmwSmrORp85AkAlSNxRJ50OWrfMZnBgzVjDx3xG6KsFQVk2</span></span>
<span class="line"><span>ol6VhqL6dFgKUORFUWBvnKSyhjJxurlPEahV6oo6+A+mPhFY8eUvAkAZQyTdupP3</span></span>
<span class="line"><span>XEFQKctGz+9+gKkemDp7LBBMEMBXrGTLPhpEfcjv/7KPdnFHYmhYeBTBnuVmTVWe</span></span>
<span class="line"><span>F98XJ7tIFfJq</span></span>
<span class="line"><span>-----END PRIVATE KEY-----</span></span>
<span class="line"><span>EOF</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cat &amp;lt;&amp;lt; &#39;EOF&#39; &amp;gt; server.pem</span></span>
<span class="line"><span>-----BEGIN CERTIFICATE-----</span></span>
<span class="line"><span>MIICnDCCAgWgAwIBAgIBBzANBgkqhkiG9w0BAQsFADBWMQswCQYDVQQGEwJBVTET</span></span>
<span class="line"><span>MBEGA1UECBMKU29tZS1TdGF0ZTEhMB8GA1UEChMYSW50ZXJuZXQgV2lkZ2l0cyBQ</span></span>
<span class="line"><span>dHkgTHRkMQ8wDQYDVQQDEwZ0ZXN0Y2EwHhcNMTUxMTA0MDIyMDI0WhcNMjUxMTAx</span></span>
<span class="line"><span>MDIyMDI0WjBlMQswCQYDVQQGEwJVUzERMA8GA1UECBMISWxsaW5vaXMxEDAOBgNV</span></span>
<span class="line"><span>BAcTB0NoaWNhZ28xFTATBgNVBAoTDEV4YW1wbGUsIENvLjEaMBgGA1UEAxQRKi50</span></span>
<span class="line"><span>ZXN0Lmdvb2dsZS5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAOHDFSco</span></span>
<span class="line"><span>LCVJpYDDM4HYtIdV6Ake/sMNaaKdODjDMsux/4tDydlumN+fm+AjPEK5GHhGn1Bg</span></span>
<span class="line"><span>zkWF+slf3BxhrA/8dNsnunstVA7ZBgA/5qQxMfGAq4wHNVX77fBZOgp9VlSMVfyd</span></span>
<span class="line"><span>9N8YwbBYAckOeUQadTi2X1S6OgJXgQ0m3MWhAgMBAAGjazBpMAkGA1UdEwQCMAAw</span></span>
<span class="line"><span>CwYDVR0PBAQDAgXgME8GA1UdEQRIMEaCECoudGVzdC5nb29nbGUuZnKCGHdhdGVy</span></span>
<span class="line"><span>em9vaS50ZXN0Lmdvb2dsZS5iZYISKi50ZXN0LnlvdXR1YmUuY29thwTAqAEDMA0G</span></span>
<span class="line"><span>CSqGSIb3DQEBCwUAA4GBAJFXVifQNub1LUP4JlnX5lXNlo8FxZ2a12AFQs+bzoJ6</span></span>
<span class="line"><span>hM044EDjqyxUqSbVePK0ni3w1fHQB5rY9yYC5f8G7aqqTY1QOhoUk8ZTSTRpnkTh</span></span>
<span class="line"><span>y4jjdvTZeLDVBlueZUTDRmy2feY5aZIU18vFDK08dTG0A87pppuv1LNIR3loveU8</span></span>
<span class="line"><span>-----END CERTIFICATE-----</span></span>
<span class="line"><span>EOF</span></span></code></pre></div><p>第二步，创建main.go文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;fmt&quot;</span></span>
<span class="line"><span>	&quot;log&quot;</span></span>
<span class="line"><span>	&quot;net/http&quot;</span></span>
<span class="line"><span>	&quot;sync&quot;</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/gin-gonic/gin&quot;</span></span>
<span class="line"><span>	&quot;golang.org/x/sync/errgroup&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type Product struct {</span></span>
<span class="line"><span>	Username    string    \`json:&quot;username&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span>	Name        string    \`json:&quot;name&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span>	Category    string    \`json:&quot;category&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span>	Price       int       \`json:&quot;price&quot; binding:&quot;gte=0&quot;\`</span></span>
<span class="line"><span>	Description string    \`json:&quot;description&quot;\`</span></span>
<span class="line"><span>	CreatedAt   time.Time \`json:&quot;createdAt&quot;\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type productHandler struct {</span></span>
<span class="line"><span>	sync.RWMutex</span></span>
<span class="line"><span>	products map[string]Product</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func newProductHandler() *productHandler {</span></span>
<span class="line"><span>	return &amp;productHandler{</span></span>
<span class="line"><span>		products: make(map[string]Product),</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (u *productHandler) Create(c *gin.Context) {</span></span>
<span class="line"><span>	u.Lock()</span></span>
<span class="line"><span>	defer u.Unlock()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 1. 参数解析</span></span>
<span class="line"><span>	var product Product</span></span>
<span class="line"><span>	if err := c.ShouldBindJSON(&amp;product); err != nil {</span></span>
<span class="line"><span>		c.JSON(http.StatusBadRequest, gin.H{&quot;error&quot;: err.Error()})</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 2. 参数校验</span></span>
<span class="line"><span>	if _, ok := u.products[product.Name]; ok {</span></span>
<span class="line"><span>		c.JSON(http.StatusBadRequest, gin.H{&quot;error&quot;: fmt.Sprintf(&quot;product %s already exist&quot;, product.Name)})</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	product.CreatedAt = time.Now()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 3. 逻辑处理</span></span>
<span class="line"><span>	u.products[product.Name] = product</span></span>
<span class="line"><span>	log.Printf(&quot;Register product %s success&quot;, product.Name)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 4. 返回结果</span></span>
<span class="line"><span>	c.JSON(http.StatusOK, product)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func (u *productHandler) Get(c *gin.Context) {</span></span>
<span class="line"><span>	u.Lock()</span></span>
<span class="line"><span>	defer u.Unlock()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	product, ok := u.products[c.Param(&quot;name&quot;)]</span></span>
<span class="line"><span>	if !ok {</span></span>
<span class="line"><span>		c.JSON(http.StatusNotFound, gin.H{&quot;error&quot;: fmt.Errorf(&quot;can not found product %s&quot;, c.Param(&quot;name&quot;))})</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	c.JSON(http.StatusOK, product)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func router() http.Handler {</span></span>
<span class="line"><span>	router := gin.Default()</span></span>
<span class="line"><span>	productHandler := newProductHandler()</span></span>
<span class="line"><span>	// 路由分组、中间件、认证</span></span>
<span class="line"><span>	v1 := router.Group(&quot;/v1&quot;)</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>		productv1 := v1.Group(&quot;/products&quot;)</span></span>
<span class="line"><span>		{</span></span>
<span class="line"><span>			// 路由匹配</span></span>
<span class="line"><span>			productv1.POST(&quot;&quot;, productHandler.Create)</span></span>
<span class="line"><span>			productv1.GET(&quot;:name&quot;, productHandler.Get)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return router</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	var eg errgroup.Group</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 一进程多端口</span></span>
<span class="line"><span>	insecureServer := &amp;http.Server{</span></span>
<span class="line"><span>		Addr:         &quot;:8080&quot;,</span></span>
<span class="line"><span>		Handler:      router(),</span></span>
<span class="line"><span>		ReadTimeout:  5 * time.Second,</span></span>
<span class="line"><span>		WriteTimeout: 10 * time.Second,</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	secureServer := &amp;http.Server{</span></span>
<span class="line"><span>		Addr:         &quot;:8443&quot;,</span></span>
<span class="line"><span>		Handler:      router(),</span></span>
<span class="line"><span>		ReadTimeout:  5 * time.Second,</span></span>
<span class="line"><span>		WriteTimeout: 10 * time.Second,</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	eg.Go(func() error {</span></span>
<span class="line"><span>		err := insecureServer.ListenAndServe()</span></span>
<span class="line"><span>		if err != nil &amp;&amp; err != http.ErrServerClosed {</span></span>
<span class="line"><span>			log.Fatal(err)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return err</span></span>
<span class="line"><span>	})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	eg.Go(func() error {</span></span>
<span class="line"><span>		err := secureServer.ListenAndServeTLS(&quot;server.pem&quot;, &quot;server.key&quot;)</span></span>
<span class="line"><span>		if err != nil &amp;&amp; err != http.ErrServerClosed {</span></span>
<span class="line"><span>			log.Fatal(err)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return err</span></span>
<span class="line"><span>	})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if err := eg.Wait(); err != nil {</span></span>
<span class="line"><span>		log.Fatal(err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行以上代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run main.go</span></span></code></pre></div><p>打开另外一个终端，请求HTTP接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 创建产品</span></span>
<span class="line"><span>$ curl -XPOST -H&quot;Content-Type: application/json&quot; -d&#39;{&quot;username&quot;:&quot;colin&quot;,&quot;name&quot;:&quot;iphone12&quot;,&quot;category&quot;:&quot;phone&quot;,&quot;price&quot;:8000,&quot;description&quot;:&quot;cannot afford&quot;}&#39; http://127.0.0.1:8080/v1/products</span></span>
<span class="line"><span>{&quot;username&quot;:&quot;colin&quot;,&quot;name&quot;:&quot;iphone12&quot;,&quot;category&quot;:&quot;phone&quot;,&quot;price&quot;:8000,&quot;description&quot;:&quot;cannot afford&quot;,&quot;createdAt&quot;:&quot;2021-06-20T11:17:03.818065988+08:00&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取产品信息</span></span>
<span class="line"><span>$ curl -XGET http://127.0.0.1:8080/v1/products/iphone12</span></span>
<span class="line"><span>{&quot;username&quot;:&quot;colin&quot;,&quot;name&quot;:&quot;iphone12&quot;,&quot;category&quot;:&quot;phone&quot;,&quot;price&quot;:8000,&quot;description&quot;:&quot;cannot afford&quot;,&quot;createdAt&quot;:&quot;2021-06-20T11:17:03.818065988+08:00&quot;}</span></span></code></pre></div><p>示例代码存放地址为 <a href="https://github.com/marmotedu/gopractise-demo/tree/master/gin/webfeature" target="_blank" rel="noreferrer">webfeature</a>。</p><p>另外，Gin项目仓库中也包含了很多使用示例，如果你想详细了解，可以参考 <a href="https://github.com/gin-gonic/examples" target="_blank" rel="noreferrer">gin examples</a>。</p><p>下面，我来详细介绍下Gin是如何支持Web服务基础功能的。</p><h3 id="http-https支持" tabindex="-1">HTTP/HTTPS支持 <a class="header-anchor" href="#http-https支持" aria-label="Permalink to &quot;HTTP/HTTPS支持&quot;">​</a></h3><p>因为Gin是基于net/http包封装的一个Web框架，所以它天然就支持HTTP/HTTPS。在上述代码中，通过以下方式开启一个HTTP服务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>insecureServer := &amp;http.Server{</span></span>
<span class="line"><span>	Addr:         &quot;:8080&quot;,</span></span>
<span class="line"><span>	Handler:      router(),</span></span>
<span class="line"><span>	ReadTimeout:  5 * time.Second,</span></span>
<span class="line"><span>	WriteTimeout: 10 * time.Second,</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>err := insecureServer.ListenAndServe()</span></span></code></pre></div><p>通过以下方式开启一个HTTPS服务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>secureServer := &amp;http.Server{</span></span>
<span class="line"><span>	Addr:         &quot;:8443&quot;,</span></span>
<span class="line"><span>	Handler:      router(),</span></span>
<span class="line"><span>	ReadTimeout:  5 * time.Second,</span></span>
<span class="line"><span>	WriteTimeout: 10 * time.Second,</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>err := secureServer.ListenAndServeTLS(&quot;server.pem&quot;, &quot;server.key&quot;)</span></span></code></pre></div><h3 id="json数据格式支持" tabindex="-1">JSON数据格式支持 <a class="header-anchor" href="#json数据格式支持" aria-label="Permalink to &quot;JSON数据格式支持&quot;">​</a></h3><p>Gin支持多种数据通信格式，例如application/json、application/xml。可以通过 <code>c.ShouldBindJSON</code> 函数，将Body中的JSON格式数据解析到指定的Struct中，通过 <code>c.JSON</code> 函数返回JSON格式的数据。</p><h3 id="路由匹配" tabindex="-1">路由匹配 <a class="header-anchor" href="#路由匹配" aria-label="Permalink to &quot;路由匹配&quot;">​</a></h3><p>Gin支持两种路由匹配规则。</p><p><strong>第一种匹配规则是精确匹配。</strong> 例如，路由为/products/:name，匹配情况如下表所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/11be05d7fe7f935e01725e2635f315df.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/11be05d7fe7f935e01725e2635f315df.jpg" alt=""></a></p><p><strong>第二种匹配规则是模糊匹配。</strong> 例如，路由为/products/*name，匹配情况如下表所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/b5ccd9924e53dd90a64af6002967b67b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/b5ccd9924e53dd90a64af6002967b67b.jpg" alt=""></a></p><h3 id="路由分组" tabindex="-1">路由分组 <a class="header-anchor" href="#路由分组" aria-label="Permalink to &quot;路由分组&quot;">​</a></h3><p>Gin通过Group函数实现了路由分组的功能。路由分组是一个非常常用的功能，可以将相同版本的路由分为一组，也可以将相同RESTful资源的路由分为一组。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>v1 := router.Group(&quot;/v1&quot;, gin.BasicAuth(gin.Accounts{&quot;foo&quot;: &quot;bar&quot;, &quot;colin&quot;: &quot;colin404&quot;}))</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    productv1 := v1.Group(&quot;/products&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 路由匹配</span></span>
<span class="line"><span>        productv1.POST(&quot;&quot;, productHandler.Create)</span></span>
<span class="line"><span>        productv1.GET(&quot;:name&quot;, productHandler.Get)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    orderv1 := v1.Group(&quot;/orders&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 路由匹配</span></span>
<span class="line"><span>        orderv1.POST(&quot;&quot;, orderHandler.Create)</span></span>
<span class="line"><span>        orderv1.GET(&quot;:name&quot;, orderHandler.Get)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>v2 := router.Group(&quot;/v2&quot;, gin.BasicAuth(gin.Accounts{&quot;foo&quot;: &quot;bar&quot;, &quot;colin&quot;: &quot;colin404&quot;}))</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    productv2 := v2.Group(&quot;/products&quot;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 路由匹配</span></span>
<span class="line"><span>        productv2.POST(&quot;&quot;, productHandler.Create)</span></span>
<span class="line"><span>        productv2.GET(&quot;:name&quot;, productHandler.Get)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过将路由分组，可以对相同分组的路由做统一处理。比如上面那个例子，我们可以通过代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>v1 := router.Group(&quot;/v1&quot;, gin.BasicAuth(gin.Accounts{&quot;foo&quot;: &quot;bar&quot;, &quot;colin&quot;: &quot;colin404&quot;}))</span></span></code></pre></div><p>给所有属于v1分组的路由都添加gin.BasicAuth中间件，以实现认证功能。中间件和认证，这里你先不用深究，下面讲高级功能的时候会介绍到。</p><h3 id="一进程多服务" tabindex="-1">一进程多服务 <a class="header-anchor" href="#一进程多服务" aria-label="Permalink to &quot;一进程多服务&quot;">​</a></h3><p>我们可以通过以下方式实现一进程多服务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var eg errgroup.Group</span></span>
<span class="line"><span>insecureServer := &amp;http.Server{...}</span></span>
<span class="line"><span>secureServer := &amp;http.Server{...}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>eg.Go(func() error {</span></span>
<span class="line"><span>	err := insecureServer.ListenAndServe()</span></span>
<span class="line"><span>	if err != nil &amp;&amp; err != http.ErrServerClosed {</span></span>
<span class="line"><span>		log.Fatal(err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>eg.Go(func() error {</span></span>
<span class="line"><span>	err := secureServer.ListenAndServeTLS(&quot;server.pem&quot;, &quot;server.key&quot;)</span></span>
<span class="line"><span>	if err != nil &amp;&amp; err != http.ErrServerClosed {</span></span>
<span class="line"><span>		log.Fatal(err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return err</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if err := eg.Wait(); err != nil {</span></span>
<span class="line"><span>	log.Fatal(err)</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>上述代码实现了两个相同的服务，分别监听在不同的端口。这里需要注意的是，为了不阻塞启动第二个服务，我们需要把ListenAndServe函数放在goroutine中执行，并且调用eg.Wait()来阻塞程序进程，从而让两个HTTP服务在goroutine中持续监听端口，并提供服务。</p><h3 id="参数解析、参数校验、逻辑处理、返回结果" tabindex="-1">参数解析、参数校验、逻辑处理、返回结果 <a class="header-anchor" href="#参数解析、参数校验、逻辑处理、返回结果" aria-label="Permalink to &quot;参数解析、参数校验、逻辑处理、返回结果&quot;">​</a></h3><p>此外，Web服务还应该具有参数解析、参数校验、逻辑处理、返回结果4类功能，因为这些功能联系紧密，我们放在一起来说。</p><p>在productHandler的Create方法中，我们通过 <code>c.ShouldBindJSON</code> 来解析参数，接下来自己编写校验代码，然后将product信息保存在内存中（也就是业务逻辑处理），最后通过 <code>c.JSON</code> 返回创建的product信息。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (u *productHandler) Create(c *gin.Context) {</span></span>
<span class="line"><span>	u.Lock()</span></span>
<span class="line"><span>	defer u.Unlock()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 1. 参数解析</span></span>
<span class="line"><span>	var product Product</span></span>
<span class="line"><span>	if err := c.ShouldBindJSON(&amp;product); err != nil {</span></span>
<span class="line"><span>		c.JSON(http.StatusBadRequest, gin.H{&quot;error&quot;: err.Error()})</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 2. 参数校验</span></span>
<span class="line"><span>	if _, ok := u.products[product.Name]; ok {</span></span>
<span class="line"><span>		c.JSON(http.StatusBadRequest, gin.H{&quot;error&quot;: fmt.Sprintf(&quot;product %s already exist&quot;, product.Name)})</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	product.CreatedAt = time.Now()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 3. 逻辑处理</span></span>
<span class="line"><span>	u.products[product.Name] = product</span></span>
<span class="line"><span>	log.Printf(&quot;Register product %s success&quot;, product.Name)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 4. 返回结果</span></span>
<span class="line"><span>	c.JSON(http.StatusOK, product)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那这个时候，你可能会问：HTTP的请求参数可以存在不同的位置，Gin是如何解析的呢？这里，我们先来看下HTTP有哪些参数类型。HTTP具有以下5种参数类型：</p><ul><li>路径参数（path）。例如 <code>gin.Default().GET(&quot;/user/:name&quot;, nil)</code>， name就是路径参数。</li><li>查询字符串参数（query）。例如 <code>/welcome?firstname=Lingfei&amp;lastname=Kong</code>，firstname和lastname就是查询字符串参数。</li><li>表单参数（form）。例如 <code>curl -X POST -F &#39;username=colin&#39; -F &#39;password=colin1234&#39; http://mydomain.com/login</code>，username和password就是表单参数。</li><li>HTTP头参数（header）。例如 <code>curl -X POST -H &#39;Content-Type: application/json&#39; -d &#39;&amp;#123;&quot;username&quot;:&quot;colin&quot;,&quot;password&quot;:&quot;colin1234&quot;&amp;#125;&#39; http://mydomain.com/login</code>，Content-Type就是HTTP头参数。</li><li>消息体参数（body）。例如 <code>curl -X POST -H &#39;Content-Type: application/json&#39; -d &#39;&amp;#123;&quot;username&quot;:&quot;colin&quot;,&quot;password&quot;:&quot;colin1234&quot;&amp;#125;&#39; http://mydomain.com/login</code>，username和password就是消息体参数。</li></ul><p>Gin提供了一些函数，来分别读取这些HTTP参数，每种类别会提供两种函数，一种函数可以直接读取某个参数的值，另外一种函数会把同类HTTP参数绑定到一个Go结构体中。比如，有如下路径参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>gin.Default().GET(&quot;/:name/:id&quot;, nil)</span></span></code></pre></div><p>我们可以直接读取每个参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>name := c.Param(&quot;name&quot;)</span></span>
<span class="line"><span>action := c.Param(&quot;action&quot;)</span></span></code></pre></div><p>也可以将所有的路径参数，绑定到结构体中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Person struct {</span></span>
<span class="line"><span>    ID string \`uri:&quot;id&quot; binding:&quot;required,uuid&quot;\`</span></span>
<span class="line"><span>    Name string \`uri:&quot;name&quot; binding:&quot;required&quot;\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if err := c.ShouldBindUri(&amp;person); err != nil {</span></span>
<span class="line"><span>    // normal code</span></span>
<span class="line"><span>    return</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Gin在绑定参数时，是通过结构体的tag来判断要绑定哪类参数到结构体中的。这里要注意，不同的HTTP参数有不同的结构体tag。</p><ul><li>路径参数：uri。</li><li>查询字符串参数：form。</li><li>表单参数：form。</li><li>HTTP头参数：header。</li><li>消息体参数：会根据Content-Type，自动选择使用json或者xml，也可以调用ShouldBindJSON或者ShouldBindXML直接指定使用哪个tag。</li></ul><p>针对每种参数类型，Gin都有对应的函数来获取和绑定这些参数。这些函数都是基于如下两个函数进行封装的：</p><ol><li>ShouldBindWith(obj interface{}, b binding.Binding) error</li></ol><p>非常重要的一个函数，很多ShouldBindXXX函数底层都是调用ShouldBindWith函数来完成参数绑定的。该函数会根据传入的绑定引擎，将参数绑定到传入的结构体指针中， <strong>如果绑定失败，只返回错误内容，但不终止HTTP请求。</strong> ShouldBindWith支持多种绑定引擎，例如 binding.JSON、binding.Query、binding.Uri、binding.Header等，更详细的信息你可以参考 <a href="https://github.com/gin-gonic/gin/blob/v1.7.2/binding/binding.go#L72" target="_blank" rel="noreferrer">binding.go</a>。</p><ol start="2"><li>MustBindWith(obj interface{}, b binding.Binding) error</li></ol><p>这是另一个非常重要的函数，很多BindXXX函数底层都是调用MustBindWith函数来完成参数绑定的。该函数会根据传入的绑定引擎，将参数绑定到传入的结构体指针中， <strong>如果绑定失败，返回错误并终止请求，返回HTTP 400错误。</strong> MustBindWith所支持的绑定引擎跟ShouldBindWith函数一样。</p><p>Gin基于ShouldBindWith和MustBindWith这两个函数，又衍生出很多新的Bind函数。这些函数可以满足不同场景下获取HTTP参数的需求。Gin提供的函数可以获取5个类别的HTTP参数。</p><ul><li>路径参数：ShouldBindUri、BindUri；</li><li>查询字符串参数：ShouldBindQuery、BindQuery；</li><li>表单参数：ShouldBind；</li><li>HTTP头参数：ShouldBindHeader、BindHeader；</li><li>消息体参数：ShouldBindJSON、BindJSON等。</li></ul><p>每个类别的Bind函数，详细信息你可以参考 <a href="https://github.com/marmotedu/geekbang-go/blob/master/Gin%E6%8F%90%E4%BE%9B%E7%9A%84Bind%E5%87%BD%E6%95%B0.md" target="_blank" rel="noreferrer">Gin提供的Bind函数</a>。</p><p>这里要注意，Gin并没有提供类似ShouldBindForm、BindForm这类函数来绑定表单参数，但我们可以通过ShouldBind来绑定表单参数。当HTTP方法为GET时，ShouldBind只绑定Query类型的参数；当HTTP方法为POST时，会先检查content-type是否是json或者xml，如果不是，则绑定Form类型的参数。</p><p>所以，ShouldBind可以绑定Form类型的参数，但前提是HTTP方法是POST，并且content-type不是application/json、application/xml。</p><p>在Go项目开发中，我建议使用ShouldBindXXX，这样可以确保我们设置的HTTP Chain（Chain可以理解为一个HTTP请求的一系列处理插件）能够继续被执行。</p><h2 id="gin是如何支持web服务高级功能的" tabindex="-1">Gin是如何支持Web服务高级功能的？ <a class="header-anchor" href="#gin是如何支持web服务高级功能的" aria-label="Permalink to &quot;Gin是如何支持Web服务高级功能的？&quot;">​</a></h2><p>上面介绍了Web服务的基础功能，这里我再来介绍下高级功能。Web服务可以具备多个高级功能，但比较核心的高级功能是中间件、认证、RequestID、跨域和优雅关停。</p><h3 id="中间件" tabindex="-1">中间件 <a class="header-anchor" href="#中间件" aria-label="Permalink to &quot;中间件&quot;">​</a></h3><p>Gin支持中间件，HTTP请求在转发到实际的处理函数之前，会被一系列加载的中间件进行处理。在中间件中，可以解析HTTP请求做一些逻辑处理，例如：跨域处理或者生成X-Request-ID并保存在context中，以便追踪某个请求。处理完之后，可以选择中断并返回这次请求，也可以选择将请求继续转交给下一个中间件处理。当所有的中间件都处理完之后，请求才会转给路由函数进行处理。具体流程如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/f0783cb9ee8cffa969f846ebe8eae880.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/f0783cb9ee8cffa969f846ebe8eae880.jpg" alt=""></a></p><p>通过中间件，可以实现对所有请求都做统一的处理，提高开发效率，并使我们的代码更简洁。但是，因为所有的请求都需要经过中间件的处理，可能会增加请求延时。对于中间件特性，我有如下建议：</p><ul><li>中间件做成可加载的，通过配置文件指定程序启动时加载哪些中间件。</li><li>只将一些通用的、必要的功能做成中间件。</li><li>在编写中间件时，一定要保证中间件的代码质量和性能。</li></ul><p>在Gin中，可以通过gin.Engine的Use方法来加载中间件。中间件可以加载到不同的位置上，而且不同的位置作用范围也不同，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>router := gin.New()</span></span>
<span class="line"><span>router.Use(gin.Logger(), gin.Recovery()) // 中间件作用于所有的HTTP请求</span></span>
<span class="line"><span>v1 := router.Group(&quot;/v1&quot;).Use(gin.BasicAuth(gin.Accounts{&quot;foo&quot;: &quot;bar&quot;, &quot;colin&quot;: &quot;colin404&quot;})) // 中间件作用于v1 group</span></span>
<span class="line"><span>v1.POST(&quot;/login&quot;, Login).Use(gin.BasicAuth(gin.Accounts{&quot;foo&quot;: &quot;bar&quot;, &quot;colin&quot;: &quot;colin404&quot;})) //中间件只作用于/v1/login API接口</span></span></code></pre></div><p>Gin框架本身支持了一些中间件。</p><ul><li><strong>gin.Logger()：</strong> Logger中间件会将日志写到gin.DefaultWriter，gin.DefaultWriter默认为 os.Stdout。</li><li><strong>gin.Recovery()：</strong> Recovery中间件可以从任何panic恢复，并且写入一个500状态码。</li><li><strong>gin.CustomRecovery(handle gin.RecoveryFunc)：</strong> 类似Recovery中间件，但是在恢复时还会调用传入的handle方法进行处理。</li><li><strong>gin.BasicAuth()：</strong> HTTP请求基本认证（使用用户名和密码进行认证）。</li></ul><p>另外，Gin还支持自定义中间件。中间件其实是一个函数，函数类型为gin.HandlerFunc，HandlerFunc底层类型为func(*Context)。如下是一个Logger中间件的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;log&quot;</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/gin-gonic/gin&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func Logger() gin.HandlerFunc {</span></span>
<span class="line"><span>	return func(c *gin.Context) {</span></span>
<span class="line"><span>		t := time.Now()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 设置变量example</span></span>
<span class="line"><span>		c.Set(&quot;example&quot;, &quot;12345&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 请求之前</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		c.Next()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 请求之后</span></span>
<span class="line"><span>		latency := time.Since(t)</span></span>
<span class="line"><span>		log.Print(latency)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// 访问我们发送的状态</span></span>
<span class="line"><span>		status := c.Writer.Status()</span></span>
<span class="line"><span>		log.Println(status)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	r := gin.New()</span></span>
<span class="line"><span>	r.Use(Logger())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	r.GET(&quot;/test&quot;, func(c *gin.Context) {</span></span>
<span class="line"><span>		example := c.MustGet(&quot;example&quot;).(string)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// it would print: &quot;12345&quot;</span></span>
<span class="line"><span>		log.Println(example)</span></span>
<span class="line"><span>	})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// Listen and serve on 0.0.0.0:8080</span></span>
<span class="line"><span>	r.Run(&quot;:8080&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外，还有很多开源的中间件可供我们选择，我把一些常用的总结在了表格里：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/67137697a09d9f37bd87a81bf322f510.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/397475/67137697a09d9f37bd87a81bf322f510.jpg" alt=""></a></p><h3 id="认证、requestid、跨域" tabindex="-1">认证、RequestID、跨域 <a class="header-anchor" href="#认证、requestid、跨域" aria-label="Permalink to &quot;认证、RequestID、跨域&quot;">​</a></h3><p>认证、RequestID、跨域这三个高级功能，都可以通过Gin的中间件来实现，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>router := gin.New()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 认证</span></span>
<span class="line"><span>router.Use(gin.BasicAuth(gin.Accounts{&quot;foo&quot;: &quot;bar&quot;, &quot;colin&quot;: &quot;colin404&quot;}))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// RequestID</span></span>
<span class="line"><span>router.Use(requestid.New(requestid.Config{</span></span>
<span class="line"><span>    Generator: func() string {</span></span>
<span class="line"><span>        return &quot;test&quot;</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>}))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 跨域</span></span>
<span class="line"><span>// CORS for https://foo.com and https://github.com origins, allowing:</span></span>
<span class="line"><span>// - PUT and PATCH methods</span></span>
<span class="line"><span>// - Origin header</span></span>
<span class="line"><span>// - Credentials share</span></span>
<span class="line"><span>// - Preflight requests cached for 12 hours</span></span>
<span class="line"><span>router.Use(cors.New(cors.Config{</span></span>
<span class="line"><span>    AllowOrigins:     []string{&quot;https://foo.com&quot;},</span></span>
<span class="line"><span>    AllowMethods:     []string{&quot;PUT&quot;, &quot;PATCH&quot;},</span></span>
<span class="line"><span>    AllowHeaders:     []string{&quot;Origin&quot;},</span></span>
<span class="line"><span>    ExposeHeaders:    []string{&quot;Content-Length&quot;},</span></span>
<span class="line"><span>    AllowCredentials: true,</span></span>
<span class="line"><span>    AllowOriginFunc: func(origin string) bool {</span></span>
<span class="line"><span>        return origin == &quot;https://github.com&quot;</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    MaxAge: 12 * time.Hour,</span></span>
<span class="line"><span>}))</span></span></code></pre></div><h3 id="优雅关停" tabindex="-1">优雅关停 <a class="header-anchor" href="#优雅关停" aria-label="Permalink to &quot;优雅关停&quot;">​</a></h3><p>Go项目上线后，我们还需要不断迭代来丰富项目功能、修复Bug等，这也就意味着，我们要不断地重启Go服务。对于HTTP服务来说，如果访问量大，重启服务的时候可能还有很多连接没有断开，请求没有完成。如果这时候直接关闭服务，这些连接会直接断掉，请求异常终止，这就会对用户体验和产品口碑造成很大影响。因此，这种关闭方式不是一种优雅的关闭方式。</p><p>这时候，我们期望HTTP服务可以在处理完所有请求后，正常地关闭这些连接，也就是优雅地关闭服务。我们有两种方法来优雅关闭HTTP服务，分别是借助第三方的Go包和自己编码实现。</p><p>方法一：借助第三方的Go包</p><p>如果使用第三方的Go包来实现优雅关闭，目前用得比较多的包是 <a href="https://github.com/fvbock/endless" target="_blank" rel="noreferrer">fvbock/endless</a>。我们可以使用fvbock/endless来替换掉net/http的ListenAndServe方法，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>router := gin.Default()</span></span>
<span class="line"><span>router.GET(&quot;/&quot;, handler)</span></span>
<span class="line"><span>// [...]</span></span>
<span class="line"><span>endless.ListenAndServe(&quot;:4242&quot;, router)</span></span></code></pre></div><p>方法二：编码实现</p><p>借助第三方包的好处是可以稍微减少一些编码工作量，但缺点是引入了一个新的依赖包，因此我更倾向于自己编码实现。Go 1.8版本或者更新的版本，http.Server内置的Shutdown方法，已经实现了优雅关闭。下面是一个示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// +build go1.8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>	&quot;context&quot;</span></span>
<span class="line"><span>	&quot;log&quot;</span></span>
<span class="line"><span>	&quot;net/http&quot;</span></span>
<span class="line"><span>	&quot;os&quot;</span></span>
<span class="line"><span>	&quot;os/signal&quot;</span></span>
<span class="line"><span>	&quot;syscall&quot;</span></span>
<span class="line"><span>	&quot;time&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	&quot;github.com/gin-gonic/gin&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>	router := gin.Default()</span></span>
<span class="line"><span>	router.GET(&quot;/&quot;, func(c *gin.Context) {</span></span>
<span class="line"><span>		time.Sleep(5 * time.Second)</span></span>
<span class="line"><span>		c.String(http.StatusOK, &quot;Welcome Gin Server&quot;)</span></span>
<span class="line"><span>	})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	srv := &amp;http.Server{</span></span>
<span class="line"><span>		Addr:    &quot;:8080&quot;,</span></span>
<span class="line"><span>		Handler: router,</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// Initializing the server in a goroutine so that</span></span>
<span class="line"><span>	// it won&#39;t block the graceful shutdown handling below</span></span>
<span class="line"><span>	go func() {</span></span>
<span class="line"><span>		if err := srv.ListenAndServe(); err != nil &amp;&amp; err != http.ErrServerClosed {</span></span>
<span class="line"><span>			log.Fatalf(&quot;listen: %s\\n&quot;, err)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// Wait for interrupt signal to gracefully shutdown the server with</span></span>
<span class="line"><span>	// a timeout of 5 seconds.</span></span>
<span class="line"><span>	quit := make(chan os.Signal, 1)</span></span>
<span class="line"><span>	// kill (no param) default send syscall.SIGTERM</span></span>
<span class="line"><span>	// kill -2 is syscall.SIGINT</span></span>
<span class="line"><span>	// kill -9 is syscall.SIGKILL but can&#39;t be catch, so don&#39;t need add it</span></span>
<span class="line"><span>	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)</span></span>
<span class="line"><span>	&amp;lt;-quit</span></span>
<span class="line"><span>	log.Println(&quot;Shutting down server...&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// The context is used to inform the server it has 5 seconds to finish</span></span>
<span class="line"><span>	// the request it is currently handling</span></span>
<span class="line"><span>	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)</span></span>
<span class="line"><span>	defer cancel()</span></span>
<span class="line"><span>	if err := srv.Shutdown(ctx); err != nil {</span></span>
<span class="line"><span>		log.Fatal(&quot;Server forced to shutdown:&quot;, err)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	log.Println(&quot;Server exiting&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的示例中，需要把srv.ListenAndServe放在goroutine中执行，这样才不会阻塞到srv.Shutdown函数。因为我们把srv.ListenAndServe放在了goroutine中，所以需要一种可以让整个进程常驻的机制。</p><p>这里，我们借助了有缓冲channel，并且调用signal.Notify函数将该channel绑定到SIGINT、SIGTERM信号上。这样，收到SIGINT、SIGTERM信号后，quilt通道会被写入值，从而结束阻塞状态，程序继续运行，执行srv.Shutdown(ctx)，优雅关停HTTP服务。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天我们主要学习了Web服务的核心功能，以及如何开发这些功能。在实际的项目开发中， 我们一般会使用基于net/http包进行封装的优秀开源Web框架。</p><p>当前比较火的Go Web框架有 Gin、Beego、Echo、Revel、Martini。你可以根据需要进行选择。我比较推荐Gin，Gin也是目前比较受欢迎的Web框架。Gin Web框架支持Web服务的很多基础功能，例如 HTTP/HTTPS、JSON格式的数据、路由分组和匹配、一进程多服务等。</p><p>另外，Gin还支持Web服务的一些高级功能，例如 中间件、认证、RequestID、跨域和优雅关停等。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>使用 Gin 框架编写一个简单的Web服务，要求该Web服务可以解析参数、校验参数，并进行一些简单的业务逻辑处理，最终返回处理结果。欢迎在留言区分享你的成果，或者遇到的问题。</li><li>思考下，如何给iam-apiserver的/healthz接口添加一个限流中间件，用来限制请求/healthz的频率。</li></ol><p>欢迎你在留言区与我交流讨论，我们下一讲见。</p>`,131)])])}const h=s(t,[["render",l]]);export{g as __pageData,h as default};
