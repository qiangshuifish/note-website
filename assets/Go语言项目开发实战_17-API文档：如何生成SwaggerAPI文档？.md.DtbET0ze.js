import{_ as a,H as e,f as n,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"17 | API 文档：如何生成 Swagger API 文档 ？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Swagger介绍","slug":"swagger介绍","link":"#swagger介绍","children":[{"level":3,"title":"Swagger和OpenAPI的区别","slug":"swagger和openapi的区别","link":"#swagger和openapi的区别","children":[]}]},{"level":2,"title":"用go-swagger来生成Swagger API文档","slug":"用go-swagger来生成swagger-api文档","link":"#用go-swagger来生成swagger-api文档","children":[{"level":3,"title":"安装Swagger工具","slug":"安装swagger工具","link":"#安装swagger工具","children":[]},{"level":3,"title":"swagger命令行工具介绍","slug":"swagger命令行工具介绍","link":"#swagger命令行工具介绍","children":[]}]},{"level":2,"title":"如何使用swagger命令生成Swagger文档？","slug":"如何使用swagger命令生成swagger文档","link":"#如何使用swagger命令生成swagger文档","children":[{"level":3,"title":"解析注释生成Swagger文档","slug":"解析注释生成swagger文档","link":"#解析注释生成swagger文档","children":[]},{"level":3,"title":"go-swagger其他常用功能介绍","slug":"go-swagger其他常用功能介绍","link":"#go-swagger其他常用功能介绍","children":[]}]},{"level":2,"title":"IAM Swagger文档","slug":"iam-swagger文档","link":"#iam-swagger文档","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/17-API文档：如何生成SwaggerAPI文档？.md","filePath":"Go语言项目开发实战/17-API文档：如何生成SwaggerAPI文档？.md","lastUpdated":1779815754000}'),g={name:"Go语言项目开发实战/17-API文档：如何生成SwaggerAPI文档？.md"};function r(i,s,t,l,o,c){return e(),n("div",null,[...s[0]||(s[0]=[p(`<h1 id="_17-api-文档-如何生成-swagger-api-文档" tabindex="-1">17 | API 文档：如何生成 Swagger API 文档 ？ <a class="header-anchor" href="#_17-api-文档-如何生成-swagger-api-文档" aria-label="Permalink to &quot;17 | API 文档：如何生成 Swagger API 文档 ？&quot;">​</a></h1><p>你好，我是孔令飞。</p><p>作为一名开发者，我们通常讨厌编写文档，因为这是一件重复和缺乏乐趣的事情。但是在开发过程中，又有一些文档是我们必须要编写的，比如API文档。</p><p>一个企业级的Go后端项目，通常也会有个配套的前端。为了加快研发进度，通常是后端和前端并行开发，这就需要后端开发者在开发后端代码之前，先设计好API接口，提供给前端。所以在设计阶段，我们就需要生成API接口文档。</p><p>一个好的API文档，可以减少用户上手的复杂度，也意味着更容易留住用户。好的API文档也可以减少沟通成本，帮助开发者更好地理解API的调用方式，从而节省时间，提高开发效率。这时候，我们一定希望有一个工具能够帮我们自动生成API文档，解放我们的双手。Swagger就是这么一个工具，可以帮助我们 <strong>生成易于共享且具有足够描述性的API文档</strong>。</p><p>接下来，我们就来看下，如何使用Swagger生成API文档。</p><h2 id="swagger介绍" tabindex="-1">Swagger介绍 <a class="header-anchor" href="#swagger介绍" aria-label="Permalink to &quot;Swagger介绍&quot;">​</a></h2><p>Swagger是一套围绕OpenAPI规范构建的开源工具，可以设计、构建、编写和使用REST API。Swagger包含很多工具，其中主要的Swagger工具包括：</p><ul><li><strong>Swagger编辑器：</strong> 基于浏览器的编辑器，可以在其中编写OpenAPI规范，并实时预览API文档。 <a href="https://editor.swagger.io/" target="_blank" rel="noreferrer">https://editor.swagger.io</a> 就是一个Swagger编辑器，你可以尝试在其中编辑和预览API文档。</li><li><strong>Swagger UI：</strong> 将OpenAPI 规范呈现为交互式API文档，并可以在浏览器中尝试API调用。</li><li><strong>Swagger Codegen：</strong> 根据OpenAPI规范，生成服务器存根和客户端代码库，目前已涵盖了40多种语言。</li></ul><h3 id="swagger和openapi的区别" tabindex="-1">Swagger和OpenAPI的区别 <a class="header-anchor" href="#swagger和openapi的区别" aria-label="Permalink to &quot;Swagger和OpenAPI的区别&quot;">​</a></h3><p>我们在谈到Swagger时，也经常会谈到OpenAPI。那么二者有什么区别呢？</p><p>OpenAPI是一个API规范，它的前身叫Swagger规范，通过定义一种用来描述API格式或API定义的语言，来规范RESTful服务开发过程，目前最新的OpenAPI规范是 <a href="https://swagger.io/docs/specification" target="_blank" rel="noreferrer">OpenAPI 3.0</a>（也就是Swagger 2.0规范）。</p><p>OpenAPI规范规定了一个API必须包含的基本信息，这些信息包括：</p><ul><li>对API的描述，介绍API可以实现的功能。</li><li>每个API上可用的路径（/users）和操作（GET /users，POST /users）。</li><li>每个API的输入/返回的参数。</li><li>验证方法。</li><li>联系信息、许可证、使用条款和其他信息。</li></ul><p>所以，你可以简单地这么理解：OpenAPI是一个API规范，Swagger则是实现规范的工具。</p><p>另外，要编写Swagger文档，首先要会使用Swagger文档编写语法，因为语法比较多，这里就不多介绍了，你可以参考Swagger官方提供的 <a href="https://swagger.io/specification/" target="_blank" rel="noreferrer">OpenAPI Specification</a> 来学习。</p><h2 id="用go-swagger来生成swagger-api文档" tabindex="-1">用go-swagger来生成Swagger API文档 <a class="header-anchor" href="#用go-swagger来生成swagger-api文档" aria-label="Permalink to &quot;用go-swagger来生成Swagger API文档&quot;">​</a></h2><p>在Go项目开发中，我们可以通过下面两种方法来生成Swagger API文档：</p><p>第一，如果你熟悉Swagger语法的话，可以直接编写JSON/YAML格式的Swagger文档。建议选择YAML格式，因为它比JSON格式更简洁直观。</p><p>第二，通过工具生成Swagger文档，目前可以通过 <a href="https://github.com/swaggo/swag" target="_blank" rel="noreferrer">swag</a> 和 <a href="https://github.com/go-swagger/go-swagger" target="_blank" rel="noreferrer">go-swagger</a> 两个工具来生成。</p><p>对比这两种方法，直接编写Swagger文档，不比编写Markdown格式的API文档工作量小，我觉得不符合程序员“偷懒”的习惯。所以，本专栏我们就使用go-swagger工具，基于代码注释来自动生成Swagger文档。为什么选go-swagger呢？有这么几个原因：</p><ul><li>go-swagger比swag功能更强大：go-swagger提供了更灵活、更多的功能来描述我们的API。</li><li>使我们的代码更易读：如果使用swag，我们每一个API都需要有一个冗长的注释，有时候代码注释比代码还要长，但是通过go-swagger我们可以将代码和注释分开编写，一方面可以使我们的代码保持简洁，清晰易读，另一方面我们可以在另外一个包中，统一管理这些Swagger API文档定义。</li><li>更好的社区支持：go-swagger目前有非常多的Github star数，出现Bug的概率很小，并且处在一个频繁更新的活跃状态。</li></ul><p>你已经知道了，go-swagger是一个功能强大的、高性能的、可以根据代码注释生成Swagger API文档的工具。除此之外，go-swagger还有很多其他特性：</p><ul><li>根据Swagger定义文件生成服务端代码。</li><li>根据Swagger定义文件生成客户端代码。</li><li>校验Swagger定义文件是否正确。</li><li>启动一个HTTP服务器，使我们可以通过浏览器访问API文档。</li><li>根据Swagger文档定义的参数生成Go model结构体定义。</li></ul><p>可以看到，使用go-swagger生成Swagger文档，可以帮助我们减少编写文档的时间，提高开发效率，并能保证文档的及时性和准确性。</p><p>这里需要注意，如果我们要对外提供API的Go SDK，可以考虑使用go-swagger来生成客户端代码。但是我觉得go-swagger生成的服务端代码不够优雅，所以建议你自行编写服务端代码。</p><p>目前，有很多知名公司和组织的项目都使用了go-swagger，例如 Moby、CoreOS、Kubernetes、Cilium等。</p><h3 id="安装swagger工具" tabindex="-1">安装Swagger工具 <a class="header-anchor" href="#安装swagger工具" aria-label="Permalink to &quot;安装Swagger工具&quot;">​</a></h3><p>go-swagger通过swagger命令行工具来完成其功能，swagger安装方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go get -u github.com/go-swagger/go-swagger/cmd/swagger</span></span>
<span class="line"><span>$ swagger version</span></span>
<span class="line"><span>dev</span></span></code></pre></div><h3 id="swagger命令行工具介绍" tabindex="-1">swagger命令行工具介绍 <a class="header-anchor" href="#swagger命令行工具介绍" aria-label="Permalink to &quot;swagger命令行工具介绍&quot;">​</a></h3><p>swagger命令格式为 <code>swagger [OPTIONS] &amp;lt;command&gt;</code>。可以通过 <code>swagger -h</code> 查看swagger使用帮助。swagger提供的子命令及功能见下表：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/yy3428aa968c7029cb4f6b11f2596678.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/yy3428aa968c7029cb4f6b11f2596678.png" alt=""></a></p><h2 id="如何使用swagger命令生成swagger文档" tabindex="-1">如何使用swagger命令生成Swagger文档？ <a class="header-anchor" href="#如何使用swagger命令生成swagger文档" aria-label="Permalink to &quot;如何使用swagger命令生成Swagger文档？&quot;">​</a></h2><p>go-swagger通过解析源码中的注释来生成Swagger文档，go-swagger的详细注释语法可参考 <a href="https://goswagger.io" target="_blank" rel="noreferrer">官方文档</a>。常用的有如下几类注释语法：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/947262c5175f6f518ff677063af293b3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/947262c5175f6f518ff677063af293b3.png" alt=""></a></p><h3 id="解析注释生成swagger文档" tabindex="-1">解析注释生成Swagger文档 <a class="header-anchor" href="#解析注释生成swagger文档" aria-label="Permalink to &quot;解析注释生成Swagger文档&quot;">​</a></h3><p>swagger generate命令会找到main函数，然后遍历所有源码文件，解析源码中与Swagger相关的注释，然后自动生成swagger.json/swagger.yaml文件。</p><p>这一过程的示例代码为 <a href="https://github.com/marmotedu/gopractise-demo/tree/main/swagger" target="_blank" rel="noreferrer">gopractise-demo/swagger</a>。目录下有一个main.go文件，定义了如下API接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;log&quot;</span></span>
<span class="line"><span>    &quot;net/http&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/gin-gonic/gin&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &quot;github.com/marmotedu/gopractise-demo/swagger/api&quot;</span></span>
<span class="line"><span>    // This line is necessary for go-swagger to find your docs!</span></span>
<span class="line"><span>    _ &quot;github.com/marmotedu/gopractise-demo/swagger/docs&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var users []*api.User</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    r := gin.Default()</span></span>
<span class="line"><span>    r.POST(&quot;/users&quot;, Create)</span></span>
<span class="line"><span>    r.GET(&quot;/users/:name&quot;, Get)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    log.Fatal(r.Run(&quot;:5555&quot;))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Create create a user in memory.</span></span>
<span class="line"><span>func Create(c *gin.Context) {</span></span>
<span class="line"><span>    var user api.User</span></span>
<span class="line"><span>    if err := c.ShouldBindJSON(&amp;user); err != nil {</span></span>
<span class="line"><span>        c.JSON(http.StatusBadRequest, gin.H{&quot;message&quot;: err.Error(), &quot;code&quot;: 10001})</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for _, u := range users {</span></span>
<span class="line"><span>        if u.Name == user.Name {</span></span>
<span class="line"><span>            c.JSON(http.StatusBadRequest, gin.H{&quot;message&quot;: fmt.Sprintf(&quot;user %s already exist&quot;, user.Name), &quot;code&quot;: 10001})</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    users = append(users, &amp;user)</span></span>
<span class="line"><span>    c.JSON(http.StatusOK, user)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Get return the detail information for a user.</span></span>
<span class="line"><span>func Get(c *gin.Context) {</span></span>
<span class="line"><span>    username := c.Param(&quot;name&quot;)</span></span>
<span class="line"><span>    for _, u := range users {</span></span>
<span class="line"><span>        if u.Name == username {</span></span>
<span class="line"><span>            c.JSON(http.StatusOK, u)</span></span>
<span class="line"><span>            return</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    c.JSON(http.StatusBadRequest, gin.H{&quot;message&quot;: fmt.Sprintf(&quot;user %s not exist&quot;, username), &quot;code&quot;: 10002})</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>main包中引入的 <strong>User struct</strong> 位于gopractise-demo/swagger/api目录下的 <a href="https://github.com/marmotedu/gopractise-demo/blob/main/swagger/api/user.go" target="_blank" rel="noreferrer">user.go</a> 文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Package api defines the user model.</span></span>
<span class="line"><span>package api</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// User represents body of User request and response.</span></span>
<span class="line"><span>type User struct {</span></span>
<span class="line"><span>    // User&#39;s name.</span></span>
<span class="line"><span>    // Required: true</span></span>
<span class="line"><span>    Name string \`json:&quot;name&quot;\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // User&#39;s nickname.</span></span>
<span class="line"><span>    // Required: true</span></span>
<span class="line"><span>    Nickname string \`json:&quot;nickname&quot;\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // User&#39;s address.</span></span>
<span class="line"><span>    Address string \`json:&quot;address&quot;\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // User&#39;s email.</span></span>
<span class="line"><span>    Email string \`json:&quot;email&quot;\`</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>// Required: true</code> 说明字段是必须的，生成Swagger文档时，也会在文档中声明该字段是必须字段。</p><p>为了使代码保持简洁，我们在另外一个Go包中编写带go-swagger注释的API文档。假设该Go包名字为docs，在开始编写Go API注释之前，需要在main.go文件中导入docs包：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_ &quot;github.com/marmotedu/gopractise-demo/swagger/docs&quot;</span></span></code></pre></div><p>通过导入docs包，可以使go-swagger在递归解析main包的依赖包时，找到docs包，并解析包中的注释。</p><p>在gopractise-demo/swagger目录下，创建docs文件夹：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ mkdir docs</span></span>
<span class="line"><span>$ cd docs</span></span></code></pre></div><p>在docs目录下，创建一个doc.go文件，在该文件中提供API接口的基本信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Package docs awesome.</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// Documentation of our awesome API.</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//     Schemes: http, https</span></span>
<span class="line"><span>//     BasePath: /</span></span>
<span class="line"><span>//     Version: 0.1.0</span></span>
<span class="line"><span>//     Host: some-url.com</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//     Consumes:</span></span>
<span class="line"><span>//     - application/json</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//     Produces:</span></span>
<span class="line"><span>//     - application/json</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//     Security:</span></span>
<span class="line"><span>//     - basic</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>//    SecurityDefinitions:</span></span>
<span class="line"><span>//    basic:</span></span>
<span class="line"><span>//      type: basic</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// swagger:meta</span></span>
<span class="line"><span>package docs</span></span></code></pre></div><p><strong>Package docs</strong> 后面的字符串 <code>awesome</code> 代表我们的HTTP服务名。 <code>Documentation of our awesome API</code> 是我们API的描述。其他都是go-swagger可识别的注释，代表一定的意义。最后以 <code>swagger:meta</code> 注释结束。</p><p>编写完doc.go文件后，进入gopractise-demo/swagger目录，执行如下命令，生成Swagger API文档，并启动HTTP服务，在浏览器查看Swagger：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger generate spec -o swagger.yaml</span></span>
<span class="line"><span>$ swagger serve --no-open -F=swagger --port 36666 swagger.yaml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2020/10/20 23:16:47 serving docs at http://localhost:36666/docs</span></span></code></pre></div><ul><li>-o：指定要输出的文件名。swagger会根据文件名后缀.yaml或者.json，决定生成的文件格式为YAML或JSON。</li><li>–no-open：因为是在Linux服务器下执行命令，没有安装浏览器，所以使–no-open禁止调用浏览器打开URL。</li><li>-F：指定文档的风格，可选swagger和redoc。我选用了redoc，因为觉得redoc格式更加易读和清晰。</li><li>–port：指定启动的HTTP服务监听端口。</li></ul><p>打开浏览器，访问 <a href="http://url" target="_blank" rel="noreferrer">http://localhost:36666/docs</a> ，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/9a9fb7a31d418d8e4dc13b19cefa832c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/9a9fb7a31d418d8e4dc13b19cefa832c.png" alt=""></a></p><p>如果我们想要JSON格式的Swagger文档，可执行如下命令，将生成的swagger.yaml转换为swagger.json：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger generate spec -i ./swagger.yaml -o ./swagger.json</span></span></code></pre></div><p>接下来，我们就可以编写API接口的定义文件（位于 <a href="https://github.com/marmotedu/gopractise-demo/blob/main/swagger/docs/user.go" target="_blank" rel="noreferrer">gopractise-demo/swagger/docs/user.go</a> 文件中）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package docs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;github.com/marmotedu/gopractise-demo/swagger/api&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// swagger:route POST /users user createUserRequest</span></span>
<span class="line"><span>// Create a user in memory.</span></span>
<span class="line"><span>// responses:</span></span>
<span class="line"><span>//   200: createUserResponse</span></span>
<span class="line"><span>//   default: errResponse</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// swagger:route GET /users/{name} user getUserRequest</span></span>
<span class="line"><span>// Get a user from memory.</span></span>
<span class="line"><span>// responses:</span></span>
<span class="line"><span>//   200: getUserResponse</span></span>
<span class="line"><span>//   default: errResponse</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// swagger:parameters createUserRequest</span></span>
<span class="line"><span>type userParamsWrapper struct {</span></span>
<span class="line"><span>    // This text will appear as description of your request body.</span></span>
<span class="line"><span>    // in:body</span></span>
<span class="line"><span>    Body api.User</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This text will appear as description of your request url path.</span></span>
<span class="line"><span>// swagger:parameters getUserRequest</span></span>
<span class="line"><span>type getUserParamsWrapper struct {</span></span>
<span class="line"><span>    // in:path</span></span>
<span class="line"><span>    Name string \`json:&quot;name&quot;\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This text will appear as description of your response body.</span></span>
<span class="line"><span>// swagger:response createUserResponse</span></span>
<span class="line"><span>type createUserResponseWrapper struct {</span></span>
<span class="line"><span>    // in:body</span></span>
<span class="line"><span>    Body api.User</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This text will appear as description of your response body.</span></span>
<span class="line"><span>// swagger:response getUserResponse</span></span>
<span class="line"><span>type getUserResponseWrapper struct {</span></span>
<span class="line"><span>    // in:body</span></span>
<span class="line"><span>    Body api.User</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// This text will appear as description of your error response body.</span></span>
<span class="line"><span>// swagger:response errResponse</span></span>
<span class="line"><span>type errResponseWrapper struct {</span></span>
<span class="line"><span>    // Error code.</span></span>
<span class="line"><span>    Code int \`json:&quot;code&quot;\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Error message.</span></span>
<span class="line"><span>    Message string \`json:&quot;message&quot;\`</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>user.go文件说明：</p><ul><li>swagger:route： <code>swagger:route</code> 代表API接口描述的开始，后面的字符串格式为 <code>HTTP方法 URL Tag ID</code>。可以填写多个tag，相同tag的API接口在Swagger文档中会被分为一组。ID是一个标识符， <code>swagger:parameters</code> 是具有相同ID的 <code>swagger:route</code> 的请求参数。 <code>swagger:route</code> 下面的一行是该API接口的描述，需要以英文点号为结尾。 <code>responses:</code> 定义了API接口的返回参数，例如当HTTP状态码是200时，返回createUserResponse，createUserResponse会跟 <code>swagger:response</code> 进行匹配，匹配成功的 <code>swagger:response</code> 就是该API接口返回200状态码时的返回。</li><li>swagger:response： <code>swagger:response</code> 定义了API接口的返回，例如getUserResponseWrapper，关于名字，我们可以根据需要自由命名，并不会带来任何不同。getUserResponseWrapper中有一个Body字段，其注释为 <code>// in:body</code>，说明该参数是在HTTP Body中返回。 <code>swagger:response</code> 之上的注释会被解析为返回参数的描述。api.User自动被go-swagger解析为 <code>Example Value</code> 和 <code>Model</code>。我们不用再去编写重复的返回字段，只需要引用已有的Go结构体即可，这也是通过工具生成Swagger文档的魅力所在。</li><li>swagger:parameters： <code>swagger:parameters</code> 定义了API接口的请求参数，例如userParamsWrapper。userParamsWrapper之上的注释会被解析为请求参数的描述， <code>// in:body</code> 代表该参数是位于HTTP Body中。同样，userParamsWrapper结构体名我们也可以随意命名，不会带来任何不同。 <code>swagger:parameters</code> 之后的createUserRequest会跟 <code>swagger:route</code> 的ID进行匹配，匹配成功则说明是该ID所在API接口的请求参数。</li></ul><p>进入gopractise-demo/swagger目录，执行如下命令，生成Swagger API文档，并启动HTTP服务，在浏览器查看Swagger：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger generate spec -o swagger.yaml</span></span>
<span class="line"><span>$ swagger serve --no-open -F=swagger --port 36666 swagger.yaml</span></span>
<span class="line"><span>2020/10/20 23:28:30 serving docs at http://localhost:36666/docs</span></span></code></pre></div><p>打开浏览器，访问 <a href="http://localhost:36666/docs" target="_blank" rel="noreferrer">http://localhost:36666/docs</a> ，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/e6d6d138fb890ef219d71671d146d5e0.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/e6d6d138fb890ef219d71671d146d5e0.png" alt=""></a></p><p>上面我们生成了swagger风格的UI界面，我们也可以使用redoc风格的UI界面，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/dd568a44290283861ba5c37f28307d48.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/dd568a44290283861ba5c37f28307d48.png" alt=""></a></p><h3 id="go-swagger其他常用功能介绍" tabindex="-1">go-swagger其他常用功能介绍 <a class="header-anchor" href="#go-swagger其他常用功能介绍" aria-label="Permalink to &quot;go-swagger其他常用功能介绍&quot;">​</a></h3><p>上面，我介绍了swagger最常用的generate、serve命令，关于swagger其他有用的命令，这里也简单介绍一下。</p><ol><li>对比Swagger文档</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger diff -d change.log swagger.new.yaml swagger.old.yaml</span></span>
<span class="line"><span>$ cat change.log</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BREAKING CHANGES:</span></span>
<span class="line"><span>=================</span></span>
<span class="line"><span>/users:post Request - Body.Body.nickname.address.email.name.Body : User - Deleted property</span></span>
<span class="line"><span>compatibility test FAILED: 1 breaking changes detected</span></span></code></pre></div><ol start="2"><li>生成服务端代码</li></ol><p>我们也可以先定义Swagger接口文档，再用swagger命令，基于Swagger接口文档生成服务端代码。假设我们的应用名为go-user，进入gopractise-demo/swagger目录，创建go-user目录，并生成服务端代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ mkdir go-user</span></span>
<span class="line"><span>$ cd go-user</span></span>
<span class="line"><span>$ swagger generate server -f ../swagger.yaml -A go-user</span></span></code></pre></div><p>上述命令会在当前目录生成cmd、restapi、models文件夹，可执行如下命令查看server组件启动方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ go run cmd/go-user-server/main.go -h</span></span></code></pre></div><ol start="3"><li>生成客户端代码</li></ol><p>在go-user目录下执行如下命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger generate client -f ../swagger.yaml -A go-user</span></span></code></pre></div><p>上述命令会在当前目录生成client，包含了API接口的调用函数，也就是API接口的Go SDK。</p><ol start="4"><li>验证Swagger文档是否合法</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger validate swagger.yaml</span></span>
<span class="line"><span>2020/10/21 09:53:18</span></span>
<span class="line"><span>The swagger spec at &quot;swagger.yaml&quot; is valid against swagger specification 2.0</span></span></code></pre></div><ol start="5"><li>合并Swagger文档</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger mixin swagger_part1.yaml swagger_part2.yaml</span></span></code></pre></div><h2 id="iam-swagger文档" tabindex="-1">IAM Swagger文档 <a class="header-anchor" href="#iam-swagger文档" aria-label="Permalink to &quot;IAM Swagger文档&quot;">​</a></h2><p>IAM的Swagger文档定义在 <a href="https://github.com/marmotedu/iam/tree/v1.0.0/api/swagger/docs" target="_blank" rel="noreferrer">iam/api/swagger/docs</a> 目录下，遵循go-swagger规范进行定义。</p><p><a href="https://github.com/marmotedu/iam/blob/v1.0.0/api/swagger/docs/doc.go" target="_blank" rel="noreferrer">iam/api/swagger/docs/doc.go</a> 文件定义了更多Swagger文档的基本信息，比如开源协议、联系方式、安全认证等。</p><p>更详细的定义，你可以直接查看iam/api/swagger/docs目录下的Go源码文件。</p><p>为了便于生成文档和启动HTTP服务查看Swagger文档，该操作被放在Makefile中执行（位于 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/scripts/make-rules/swagger.mk" target="_blank" rel="noreferrer">iam/scripts/make-rules/swagger.mk</a> 文件中）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.PHONY: swagger.run</span></span>
<span class="line"><span>swagger.run: tools.verify.swagger</span></span>
<span class="line"><span>  &amp;#64;echo &quot;===========&amp;gt; Generating swagger API docs&quot;</span></span>
<span class="line"><span>  &amp;#64;swagger generate spec --scan-models -w $(ROOT_DIR)/cmd/genswaggertypedocs -o $(ROOT_DIR)/api/swagger/swagger.yaml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.PHONY: swagger.serve</span></span>
<span class="line"><span>swagger.serve: tools.verify.swagger</span></span>
<span class="line"><span>  &amp;#64;swagger serve -F=redoc --no-open --port 36666 $(ROOT_DIR)/api/swagger/swagger.yaml</span></span></code></pre></div><p>Makefile文件说明：</p><ul><li>tools.verify.swagger：检查Linux系统是否安装了go-swagger的命令行工具swagger，如果没有安装则运行go get安装。</li><li>swagger.run：运行 <code>swagger generate spec</code> 命令生成Swagger文档swagger.yaml，运行前会检查swagger是否安装。 <code>--scan-models</code> 指定生成的文档中包含带有swagger:model 注释的Go Models。 <code>-w</code> 指定swagger命令运行的目录。</li><li>swagger.serve：运行 <code>swagger serve</code> 命令打开Swagger文档swagger.yaml，运行前会检查swagger是否安装。</li></ul><p>在iam源码根目录下执行如下命令，即可生成并启动HTTP服务查看Swagger文档：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ make swagger</span></span>
<span class="line"><span>$ make serve-swagger</span></span>
<span class="line"><span>2020/10/21 06:45:03 serving docs at http://localhost:36666/docs</span></span></code></pre></div><p>打开浏览器，打开 <code>http://x.x.x.x:36666/docs</code> 查看Swagger文档，x.x.x.x是服务器的IP地址，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/6ac3529ed98aa94573862da99434683b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/6ac3529ed98aa94573862da99434683b.png" alt=""></a></p><p>IAM的Swagger文档，还可以通过在iam源码根目录下执行 <code>go generate ./...</code> 命令生成，为此，我们需要在iam/cmd/genswaggertypedocs/swagger_type_docs.go文件中，添加 <code>//go:generate</code> 注释。如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/cc03b896e5403cc55d7e11fe2078d9d7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/391142/cc03b896e5403cc55d7e11fe2078d9d7.png" alt=""></a></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在做Go服务开发时，我们要向前端或用户提供API文档，手动编写API文档工作量大，也难以维护。所以，现在很多项目都是自动生成Swagger格式的API文档。提到Swagger，很多开发者不清楚其和OpenAPI的区别，所以我也给你总结了：OpenAPI是一个API规范，Swagger则是实现规范的工具。</p><p>在Go中，用得最多的是利用go-swagger来生成Swagger格式的API文档。go-swagger包含了很多语法，我们可以访问 <a href="https://goswagger.io" target="_blank" rel="noreferrer">Swagger 2.0</a> 进行学习。学习完Swagger 2.0的语法之后，就可以编写swagger注释了，之后可以通过</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger generate spec -o swagger.yaml</span></span></code></pre></div><p>来生成swagger文档 swagger.yaml。通过</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ swagger serve --no-open -F=swagger --port 36666 swagger.yaml</span></span></code></pre></div><p>来提供一个前端界面，供我们访问swagger文档。</p><p>为了方便管理，我们可以将 <code>swagger generate spec</code> 和 <code>swagger serve</code> 命令加入到Makefile文件中，通过Makefile来生成Swagger文档，并提供给前端界面。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>尝试将你当前项目的一个API接口，用go-swagger生成swagger格式的API文档，如果中间遇到问题，欢迎在留言区与我讨论。</li><li>思考下，为什么IAM项目的swagger定义文档会放在iam/api/swagger/docs目录下，这样做有什么好处？</li></ol><p>欢迎你在留言区与我交流讨论，我们下一讲见。</p>`,110)])])}const w=a(g,[["render",r]]);export{u as __pageData,w as default};
