import{_ as n,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"26 | IAM项目是如何设计和实现访问认证功能的？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何设计IAM项目的认证功能？","slug":"如何设计iam项目的认证功能","link":"#如何设计iam项目的认证功能","children":[]},{"level":2,"title":"IAM项目是如何实现Basic认证的？","slug":"iam项目是如何实现basic认证的","link":"#iam项目是如何实现basic认证的","children":[]},{"level":2,"title":"IAM项目是如何实现Bearer认证的？","slug":"iam项目是如何实现bearer认证的","link":"#iam项目是如何实现bearer认证的","children":[{"level":3,"title":"iam-authz-server Bearer认证实现","slug":"iam-authz-server-bearer认证实现","link":"#iam-authz-server-bearer认证实现","children":[]},{"level":3,"title":"iam-apiserver Bearer认证实现","slug":"iam-apiserver-bearer认证实现","link":"#iam-apiserver-bearer认证实现","children":[]}]},{"level":2,"title":"IAM项目认证功能设计技巧","slug":"iam项目认证功能设计技巧","link":"#iam项目认证功能设计技巧","children":[{"level":3,"title":"技巧1：面向接口编程","slug":"技巧1-面向接口编程","link":"#技巧1-面向接口编程","children":[]},{"level":3,"title":"技巧2：使用抽象工厂模式","slug":"技巧2-使用抽象工厂模式","link":"#技巧2-使用抽象工厂模式","children":[]},{"level":3,"title":"技巧3：使用策略模式","slug":"技巧3-使用策略模式","link":"#技巧3-使用策略模式","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]}],"relativePath":"Go语言项目开发实战/26-IAM项目是如何设计和实现访问认证功能的？.md","filePath":"Go语言项目开发实战/26-IAM项目是如何设计和实现访问认证功能的？.md","lastUpdated":1779815754000}'),t={name:"Go语言项目开发实战/26-IAM项目是如何设计和实现访问认证功能的？.md"};function i(l,a,r,o,c,u){return s(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_26-iam项目是如何设计和实现访问认证功能的" tabindex="-1">26 | IAM项目是如何设计和实现访问认证功能的？ <a class="header-anchor" href="#_26-iam项目是如何设计和实现访问认证功能的" aria-label="Permalink to &quot;26 | IAM项目是如何设计和实现访问认证功能的？&quot;">​</a></h1><p>你好，我是孔令飞。</p><p>上一讲，我们学习了应用认证常用的四种方式：Basic、Digest、OAuth、Bearer。这一讲，我们再来看下IAM项目是如何设计和实现认证功能的。</p><p>IAM项目用到了Basic认证和Bearer认证。其中，Basic认证用在前端登陆的场景，Bearer认证用在调用后端API服务的场景下。</p><p>接下来，我们先来看下IAM项目认证功能的整体设计思路。</p><h2 id="如何设计iam项目的认证功能" tabindex="-1">如何设计IAM项目的认证功能？ <a class="header-anchor" href="#如何设计iam项目的认证功能" aria-label="Permalink to &quot;如何设计IAM项目的认证功能？&quot;">​</a></h2><p>在认证功能开发之前，我们要根据需求，认真考虑下如何设计认证功能，并在设计阶段通过技术评审。那么我们先来看下，如何设计IAM项目的认证功能。</p><p>首先，我们要 <strong>梳理清楚认证功能的使用场景和需求</strong>。</p><ul><li>IAM项目的iam-apiserver服务，提供了IAM系统的管理流功能接口，它的客户端可以是前端（这里也叫控制台），也可以是App端。</li><li>为了方便用户在Linux系统下调用，IAM项目还提供了iamctl命令行工具。</li><li>为了支持在第三方代码中调用iam-apiserver提供的API接口，还支持了API调用。</li><li>为了提高用户在代码中调用API接口的效率，IAM项目提供了Go SDK。</li></ul><p>可以看到，iam-apiserver有很多客户端，每种客户端适用的认证方式是有区别的。</p><p>控制台、App端需要登录系统，所以需要使用 <code>用户名：密码</code> 这种认证方式，也即Basic认证。iamctl、API调用、Go SDK因为可以不用登录系统，所以可以采用更安全的认证方式：Bearer认证。同时，Basic认证作为iam-apiserver已经集成的认证方式，仍然可以供iamctl、API调用、Go SDK使用。</p><p>这里有个地方需要注意：如果iam-apiserver采用Bearer Token的认证方式，目前最受欢迎的Token格式是JWT Token。而JWT Token需要密钥（后面统一用secretKey来指代），因此需要在iam-apiserver服务中为每个用户维护一个密钥，这样会增加开发和维护成本。</p><p>业界有一个更好的实现方式：将iam-apiserver提供的API接口注册到API网关中，通过API网关中的Token认证功能，来实现对iam-apiserver API接口的认证。有很多API网关可供选择，例如腾讯云API网关、Tyk、Kong等。</p><p>这里需要你注意：通过iam-apiserver创建的密钥对是提供给iam-authz-server使用的。</p><p>另外，我们还需要调用iam-authz-server提供的RESTful API接口： <code>/v1/authz</code>，来进行资源授权。API调用比较适合采用的认证方式是Bearer认证。</p><p>当然， <code>/v1/authz</code> 也可以直接注册到API网关中。在实际的Go项目开发中，也是我推荐的一种方式。但在这里，为了展示实现Bearer认证的过程，iam-authz-server自己实现了Bearer认证。讲到iam-authz-server Bearer认证实现的时候，我会详细介绍这一点。</p><p>Basic认证需要用户名和密码，Bearer认证则需要密钥，所以iam-apiserver需要将用户名/密码、密钥等信息保存在后端的MySQL中，持久存储起来。</p><p>在进行认证的时候，需要获取密码或密钥进行反加密，这就需要查询密码或密钥。查询密码或密钥有两种方式。一种是在请求到达时查询数据库。因为数据库的查询操作延时高，会导致API接口延时较高，所以不太适合用在数据流组件中。另外一种是将密码或密钥缓存在内存中，这样请求到来时，就可以直接从内存中查询，从而提升查询速度，提高接口性能。</p><p>但是，将密码或密钥缓存在内存中时，就要考虑内存和数据库的数据一致性，这会增加代码实现的复杂度。因为管控流组件对性能延时要求不那么敏感，而数据流组件则一定要实现非常高的接口性能，所以iam-apiserver在请求到来时查询数据库，而iam-authz-server则将密钥信息缓存在内存中。</p><p>那在这里，可以总结出一张IAM项目的认证设计图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/399307/7eed8e2364d358a8483c671d972fd2b6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/399307/7eed8e2364d358a8483c671d972fd2b6.jpg" alt=""></a></p><p>另外，为了将控制流和数据流区分开来，密钥的CURD操作也放在了iam-apiserver中，但是iam-authz-server需要用到这些密钥信息。为了解决这个问题，目前的做法是：</p><ul><li>iam-authz-server通过gRPC API请求iam-apiserver，获取所有的密钥信息；</li><li>当iam-apiserver有密钥更新时，会Pub一条消息到Redis Channel中。因为iam-authz-server订阅了同一个Redis Channel，iam-authz-searver监听到channel有新消息时，会获取、解析消息，并更新它缓存的密钥信息。这样，我们就能确保iam-authz-server内存中缓存的密钥和iam-apiserver中的密钥保持一致。</li></ul><p>学到这里，你可能会问：将所有密钥都缓存在iam-authz-server中，那岂不是要占用很大的内存？别担心，这个问题我也想过，并且替你计算好了：8G的内存大概能保存约8千万个密钥信息，完全够用。后期不够用的话，可以加大内存。</p><p>不过这里还是有个小缺陷：如果Redis down掉，或者出现网络抖动，可能会造成iam-apiserver中和iam-authz-server内存中保存的密钥数据不一致，但这不妨碍我们学习认证功能的设计和实现。至于如何保证缓存系统的数据一致性，我会在新一期的特别放送里专门介绍下。</p><p>最后注意一点：Basic 认证请求和 Bearer 认证请求都可能被截获并重放。所以，为了确保Basic认证和Bearer认证的安全性， <strong>和服务端通信时都需要配合使用HTTPS协议</strong>。</p><h2 id="iam项目是如何实现basic认证的" tabindex="-1">IAM项目是如何实现Basic认证的？ <a class="header-anchor" href="#iam项目是如何实现basic认证的" aria-label="Permalink to &quot;IAM项目是如何实现Basic认证的？&quot;">​</a></h2><p>我们已经知道，IAM项目中主要用了Basic 和 Bearer 这两种认证方式。我们要支持Basic认证和Bearer认证，并根据需要选择不同的认证方式，这很容易让我们想到使用设计模式中的策略模式来实现。所以，在IAM项目中，我将每一种认证方式都视作一个策略，通过选择不同的策略，来使用不同的认证方法。</p><p>IAM项目实现了如下策略：</p><ul><li><a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/auto.go" target="_blank" rel="noreferrer">auto策略</a>：该策略会根据HTTP头 <code>Authorization: Basic XX.YY.ZZ</code> 和 <code>Authorization: Bearer XX.YY.ZZ</code> 自动选择使用Basic认证还是Bearer认证。</li><li><a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/basic.go" target="_blank" rel="noreferrer">basic策略</a>：该策略实现了Basic认证。</li><li><a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/jwt.go" target="_blank" rel="noreferrer">jwt策略</a>：该策略实现了Bearer认证，JWT是Bearer认证的具体实现。</li><li><a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/cache.go" target="_blank" rel="noreferrer">cache策略</a>：该策略其实是一个Bearer认证的实现，Token采用了JWT格式，因为Token中的密钥ID是从内存中获取的，所以叫Cache认证。这一点后面会详细介绍。</li></ul><p>iam-apiserver通过创建需要的认证策略，并加载到需要认证的API路由上，来实现API认证。具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jwtStrategy, _ := newJWTAuth().(auth.JWTStrategy)</span></span>
<span class="line"><span>g.POST(&quot;/login&quot;, jwtStrategy.LoginHandler)</span></span>
<span class="line"><span>g.POST(&quot;/logout&quot;, jwtStrategy.LogoutHandler)</span></span>
<span class="line"><span>// Refresh time can be longer than token timeout</span></span>
<span class="line"><span>g.POST(&quot;/refresh&quot;, jwtStrategy.RefreshHandler)</span></span></code></pre></div><p>上述代码中，我们通过 <a href="https://github.com/marmotedu/iam/blob/75b978b722f0af3d6aefece3f9668269be3f5b2e/internal/apiserver/auth.go#L59" target="_blank" rel="noreferrer">newJWTAuth</a> 函数创建了 <code>auth.JWTStrategy</code> 类型的变量，该变量包含了一些认证相关函数。</p><ul><li>LoginHandler：实现了Basic认证，完成登陆认证。</li><li>RefreshHandler：重新刷新Token的过期时间。</li><li>LogoutHandler：用户注销时调用。登陆成功后，如果在Cookie中设置了认证相关的信息，执行LogoutHandler则会清空这些信息。</li></ul><p>下面，我来分别介绍下LoginHandler、RefreshHandler和LogoutHandler。</p><ol><li>LoginHandler</li></ol><p>这里，我们来看下LoginHandler Gin中间件，该函数定义位于 <code>github.com/appleboy/gin-jwt</code> 包的 <a href="https://github.com/appleboy/gin-jwt/blob/v2.6.4/auth_jwt.go#L431" target="_blank" rel="noreferrer">auth_jwt.go</a> 文件中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (mw *GinJWTMiddleware) LoginHandler(c *gin.Context) {</span></span>
<span class="line"><span>	if mw.Authenticator == nil {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusInternalServerError, mw.HTTPStatusMessageFunc(ErrMissingAuthenticatorFunc, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	data, err := mw.Authenticator(c)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(err, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// Create the token</span></span>
<span class="line"><span>	token := jwt.New(jwt.GetSigningMethod(mw.SigningAlgorithm))</span></span>
<span class="line"><span>	claims := token.Claims.(jwt.MapClaims)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if mw.PayloadFunc != nil {</span></span>
<span class="line"><span>		for key, value := range mw.PayloadFunc(data) {</span></span>
<span class="line"><span>			claims[key] = value</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	expire := mw.TimeFunc().Add(mw.Timeout)</span></span>
<span class="line"><span>	claims[&quot;exp&quot;] = expire.Unix()</span></span>
<span class="line"><span>	claims[&quot;orig_iat&quot;] = mw.TimeFunc().Unix()</span></span>
<span class="line"><span>	tokenString, err := mw.signedString(token)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(ErrFailedTokenCreation, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// set cookie</span></span>
<span class="line"><span>	if mw.SendCookie {</span></span>
<span class="line"><span>		expireCookie := mw.TimeFunc().Add(mw.CookieMaxAge)</span></span>
<span class="line"><span>		maxage := int(expireCookie.Unix() - mw.TimeFunc().Unix())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if mw.CookieSameSite != 0 {</span></span>
<span class="line"><span>			c.SetSameSite(mw.CookieSameSite)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		c.SetCookie(</span></span>
<span class="line"><span>			mw.CookieName,</span></span>
<span class="line"><span>			tokenString,</span></span>
<span class="line"><span>			maxage,</span></span>
<span class="line"><span>			&quot;/&quot;,</span></span>
<span class="line"><span>			mw.CookieDomain,</span></span>
<span class="line"><span>			mw.SecureCookie,</span></span>
<span class="line"><span>			mw.CookieHTTPOnly,</span></span>
<span class="line"><span>		)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	mw.LoginResponse(c, http.StatusOK, tokenString, expire)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从LoginHandler函数的代码实现中，我们可以知道，LoginHandler函数会执行 <code>Authenticator</code> 函数，来完成Basic认证。如果认证通过，则会签发JWT Token，并执行 <code>PayloadFunc</code> 函数设置Token Payload。如果我们设置了 <code>SendCookie=true</code> ，还会在Cookie中添加认证相关的信息，例如 Token、Token的生命周期等，最后执行 <code>LoginResponse</code> 方法返回Token和Token的过期时间。</p><p><code>Authenticator</code>、 <code>PayloadFunc</code>、 <code>LoginResponse</code> 这三个函数，是我们在创建JWT认证策略时指定的。下面我来分别介绍下。</p><p>先来看下 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/apiserver/auth.go#L97" target="_blank" rel="noreferrer">Authenticator</a> 函数。Authenticator函数从HTTP Authorization Header中获取用户名和密码，并校验密码是否合法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func authenticator() func(c *gin.Context) (interface{}, error) {</span></span>
<span class="line"><span>	return func(c *gin.Context) (interface{}, error) {</span></span>
<span class="line"><span>		var login loginInfo</span></span>
<span class="line"><span>		var err error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// support header and body both</span></span>
<span class="line"><span>		if c.Request.Header.Get(&quot;Authorization&quot;) != &quot;&quot; {</span></span>
<span class="line"><span>			login, err = parseWithHeader(c)</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			login, err = parseWithBody(c)</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		if err != nil {</span></span>
<span class="line"><span>			return &quot;&quot;, jwt.ErrFailedAuthentication</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// Get the user information by the login username.</span></span>
<span class="line"><span>		user, err := store.Client().Users().Get(c, login.Username, metav1.GetOptions{})</span></span>
<span class="line"><span>		if err != nil {</span></span>
<span class="line"><span>			log.Errorf(&quot;get user information failed: %s&quot;, err.Error())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return &quot;&quot;, jwt.ErrFailedAuthentication</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// Compare the login password with the user password.</span></span>
<span class="line"><span>		if err := user.Compare(login.Password); err != nil {</span></span>
<span class="line"><span>			return &quot;&quot;, jwt.ErrFailedAuthentication</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		return user, nil</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>Authenticator</code> 函数需要获取用户名和密码。它首先会判断是否有 <code>Authorization</code> 请求头，如果有，则调用 <code>parseWithHeader</code> 函数获取用户名和密码，否则调用 <code>parseWithBody</code> 从Body中获取用户名和密码。如果都获取失败，则返回认证失败错误。</p><p>所以，IAM项目的Basic支持以下两种请求方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ curl -XPOST -H&quot;Authorization: Basic YWRtaW46QWRtaW5AMjAyMQ==&quot; http://127.0.0.1:8080/login # 用户名:密码通过base64加码后，通过HTTP Authorization Header进行传递，因为密码非明文，建议使用这种方式。</span></span>
<span class="line"><span>$ curl -s -XPOST -H&#39;Content-Type: application/json&#39; -d&#39;{&quot;username&quot;:&quot;admin&quot;,&quot;password&quot;:&quot;Admin&amp;#64;2021&quot;}&#39; http://127.0.0.1:8080/login # 用户名和密码在HTTP Body中传递，因为密码是明文，所以这里不建议实际开发中，使用这种方式。</span></span></code></pre></div><p>这里，我们来看下 <code>parseWithHeader</code> 是如何获取用户名和密码的。假设我们的请求为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ curl -XPOST -H&quot;Authorization: Basic YWRtaW46QWRtaW5AMjAyMQ==&quot; http://127.0.0.1:8080/login</span></span></code></pre></div><p>其中， <code>YWRtaW46QWRtaW5AMjAyMQ==</code> 值由以下命令生成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ echo -n &#39;admin:Admin&amp;#64;2021&#39;|base64</span></span>
<span class="line"><span>YWRtaW46QWRtaW5AMjAyMQ==</span></span></code></pre></div><p><code>parseWithHeader</code> 实际上执行的是上述命令的逆向步骤：</p><ol><li>获取 <code>Authorization</code> 头的值，并调用strings.SplitN函数，获取一个切片变量auth，其值为 <code>[&quot;Basic&quot;,&quot;YWRtaW46QWRtaW5AMjAyMQ==&quot;]</code> 。</li><li>将 <code>YWRtaW46QWRtaW5AMjAyMQ==</code> 进行base64解码，得到 <code>admin:Admin@2021</code>。</li><li>调用 <code>strings.SplitN</code> 函数获取 <code>admin:Admin@2021</code> ，得到用户名为 <code>admin</code>，密码为 <code>Admin@2021</code>。</li></ol><p><code>parseWithBody</code> 则是调用了Gin的 <code>ShouldBindJSON</code> 函数，来从Body中解析出用户名和密码。</p><p>获取到用户名和密码之后，程序会从数据库中查询出该用户对应的加密后的密码，这里我们假设是 <code>xxxx</code>。最后 <code>authenticator</code> 函数调用 <code>user.Compare</code> 来判断 <code>xxxx</code> 是否和通过 <code>user.Compare</code> 加密后的字符串相匹配，如果匹配则认证成功，否则返回认证失败。</p><p>再来看下 <code>PayloadFunc</code> 函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func payloadFunc() func(data interface{}) jwt.MapClaims {</span></span>
<span class="line"><span>    return func(data interface{}) jwt.MapClaims {</span></span>
<span class="line"><span>        claims := jwt.MapClaims{</span></span>
<span class="line"><span>            &quot;iss&quot;: APIServerIssuer,</span></span>
<span class="line"><span>            &quot;aud&quot;: APIServerAudience,</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if u, ok := data.(*v1.User); ok {</span></span>
<span class="line"><span>            claims[jwt.IdentityKey] = u.Name</span></span>
<span class="line"><span>            claims[&quot;sub&quot;] = u.Name</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return claims</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>PayloadFunc函数会设置JWT Token中Payload部分的 iss、aud、sub、identity字段，供后面使用。</p><p>再来看下我们刚才说的第三个函数，LoginResponse函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func loginResponse() func(c *gin.Context, code int, token string, expire time.Time) {</span></span>
<span class="line"><span>    return func(c *gin.Context, code int, token string, expire time.Time) {</span></span>
<span class="line"><span>        c.JSON(http.StatusOK, gin.H{</span></span>
<span class="line"><span>            &quot;token&quot;:  token,</span></span>
<span class="line"><span>            &quot;expire&quot;: expire.Format(time.RFC3339),</span></span>
<span class="line"><span>        })</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该函数用来在Basic认证成功之后，返回Token和Token的过期时间给调用者：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ curl -XPOST -H&quot;Authorization: Basic YWRtaW46QWRtaW5AMjAyMQ==&quot; http://127.0.0.1:8080/login</span></span>
<span class="line"><span>{&quot;expire&quot;:&quot;2021-09-29T01:38:49+08:00&quot;,&quot;token&quot;:&quot;XX.YY.ZZ&quot;}</span></span></code></pre></div><p>登陆成功后，iam-apiserver会返回Token和Token的过期时间，前端可以将这些信息缓存在Cookie中或LocalStorage中，之后的请求都可以使用Token来进行认证。使用Token进行认证，不仅能够提高认证的安全性，还能够避免查询数据库，从而提高认证效率。</p><ol start="2"><li>RefreshHandler</li></ol><p><code>RefreshHandler</code> 函数会先执行Bearer认证，如果认证通过，则会重新签发Token。</p><ol start="3"><li>LogoutHandler</li></ol><p>最后，来看下 <code>LogoutHandler</code> 函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (mw *GinJWTMiddleware) LogoutHandler(c *gin.Context) {</span></span>
<span class="line"><span>    // delete auth cookie</span></span>
<span class="line"><span>    if mw.SendCookie {</span></span>
<span class="line"><span>        if mw.CookieSameSite != 0 {</span></span>
<span class="line"><span>            c.SetSameSite(mw.CookieSameSite)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        c.SetCookie(</span></span>
<span class="line"><span>            mw.CookieName,</span></span>
<span class="line"><span>            &quot;&quot;,</span></span>
<span class="line"><span>            -1,</span></span>
<span class="line"><span>            &quot;/&quot;,</span></span>
<span class="line"><span>            mw.CookieDomain,</span></span>
<span class="line"><span>            mw.SecureCookie,</span></span>
<span class="line"><span>            mw.CookieHTTPOnly,</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mw.LogoutResponse(c, http.StatusOK)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，LogoutHandler其实是用来清空Cookie中Bearer认证相关信息的。</p><p>最后，我们来做个总结：Basic认证通过用户名和密码来进行认证，通常用在登陆接口/login中。用户登陆成功后，会返回JWT Token，前端会保存该JWT Token在浏览器的Cookie或LocalStorage中，供后续请求使用。</p><p>后续请求时，均会携带该Token，以完成Bearer认证。另外，有了登陆接口，一般还会配套/logout接口和/refresh接口，分别用来进行注销和刷新Token。</p><p>这里你可能会问，为什么要刷新Token？因为通过登陆接口签发的Token有过期时间，有了刷新接口，前端就可以根据需要，自行刷新Token的过期时间。过期时间可以通过iam-apiserver配置文件的 <a href="https://github.com/marmotedu/iam/blob/master/configs/iam-apiserver.yaml#L66" target="_blank" rel="noreferrer">jwt.timeout</a> 配置项来指定。登陆后签发Token时，使用的密钥（secretKey）由 <a href="https://github.com/marmotedu/iam/blob/master/configs/iam-apiserver.yaml#L65" target="_blank" rel="noreferrer">jwt.key</a> 配置项来指定。</p><h2 id="iam项目是如何实现bearer认证的" tabindex="-1">IAM项目是如何实现Bearer认证的？ <a class="header-anchor" href="#iam项目是如何实现bearer认证的" aria-label="Permalink to &quot;IAM项目是如何实现Bearer认证的？&quot;">​</a></h2><p>上面我们介绍了Basic认证。这里，我再来介绍下IAM项目中Bearer认证的实现方式。</p><p>IAM项目中有两个地方实现了Bearer认证，分别是 iam-apiserver 和 iam-authz-server。下面我来分别介绍下它们是如何实现Bearer认证的。</p><h3 id="iam-authz-server-bearer认证实现" tabindex="-1">iam-authz-server Bearer认证实现 <a class="header-anchor" href="#iam-authz-server-bearer认证实现" aria-label="Permalink to &quot;iam-authz-server Bearer认证实现&quot;">​</a></h3><p>先来看下iam-authz-server是如何实现Bearer认证的。</p><p>iam-authz-server通过在 <code>/v1</code> 路由分组中加载cache认证中间件来使用cache认证策略：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auth := newCacheAuth()</span></span>
<span class="line"><span>apiv1 := g.Group(&quot;/v1&quot;, auth.AuthFunc())</span></span></code></pre></div><p>来看下 <a href="https://github.com/marmotedu/iam/blob/v1.0.4/internal/authzserver/jwt.go#L15" target="_blank" rel="noreferrer">newCacheAuth</a> 函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func newCacheAuth() middleware.AuthStrategy {</span></span>
<span class="line"><span>    return auth.NewCacheStrategy(getSecretFunc())</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func getSecretFunc() func(string) (auth.Secret, error) {</span></span>
<span class="line"><span>    return func(kid string) (auth.Secret, error) {</span></span>
<span class="line"><span>        cli, err := store.GetStoreInsOr(nil)</span></span>
<span class="line"><span>        if err != nil {</span></span>
<span class="line"><span>            return auth.Secret{}, errors.Wrap(err, &quot;get store instance failed&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        secret, err := cli.GetSecret(kid)</span></span>
<span class="line"><span>        if err != nil {</span></span>
<span class="line"><span>            return auth.Secret{}, err</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return auth.Secret{</span></span>
<span class="line"><span>            Username: secret.Username,</span></span>
<span class="line"><span>            ID:       secret.SecretId,</span></span>
<span class="line"><span>            Key:      secret.SecretKey,</span></span>
<span class="line"><span>            Expires:  secret.Expires,</span></span>
<span class="line"><span>        }, nil</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>newCacheAuth函数调用 <code>auth.NewCacheStrategy</code> 创建了一个cache认证策略，创建时传入了 <code>getSecretFunc</code> 函数，该函数会返回密钥的信息。密钥信息包含了以下字段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type Secret struct {</span></span>
<span class="line"><span>    Username string</span></span>
<span class="line"><span>    ID       string</span></span>
<span class="line"><span>    Key      string</span></span>
<span class="line"><span>    Expires  int64</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再来看下cache认证策略实现的 <a href="https://github.com/marmotedu/iam/blob/master/internal/pkg/middleware/auth/cache.go#L48" target="_blank" rel="noreferrer">AuthFunc</a> 方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (cache CacheStrategy) AuthFunc() gin.HandlerFunc {</span></span>
<span class="line"><span>	return func(c *gin.Context) {</span></span>
<span class="line"><span>		header := c.Request.Header.Get(&quot;Authorization&quot;)</span></span>
<span class="line"><span>		if len(header) == 0 {</span></span>
<span class="line"><span>			core.WriteResponse(c, errors.WithCode(code.ErrMissingHeader, &quot;Authorization header cannot be empty.&quot;), nil)</span></span>
<span class="line"><span>			c.Abort()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		var rawJWT string</span></span>
<span class="line"><span>		// Parse the header to get the token part.</span></span>
<span class="line"><span>		fmt.Sscanf(header, &quot;Bearer %s&quot;, &amp;rawJWT)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		// Use own validation logic, see below</span></span>
<span class="line"><span>		var secret Secret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		claims := &amp;jwt.MapClaims{}</span></span>
<span class="line"><span>		// Verify the token</span></span>
<span class="line"><span>		parsedT, err := jwt.ParseWithClaims(rawJWT, claims, func(token *jwt.Token) (interface{}, error) {</span></span>
<span class="line"><span>			// Validate the alg is HMAC signature</span></span>
<span class="line"><span>			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {</span></span>
<span class="line"><span>				return nil, fmt.Errorf(&quot;unexpected signing method: %v&quot;, token.Header[&quot;alg&quot;])</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			kid, ok := token.Header[&quot;kid&quot;].(string)</span></span>
<span class="line"><span>			if !ok {</span></span>
<span class="line"><span>				return nil, ErrMissingKID</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			var err error</span></span>
<span class="line"><span>			secret, err = cache.get(kid)</span></span>
<span class="line"><span>			if err != nil {</span></span>
<span class="line"><span>				return nil, ErrMissingSecret</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return []byte(secret.Key), nil</span></span>
<span class="line"><span>		}, jwt.WithAudience(AuthzAudience))</span></span>
<span class="line"><span>		if err != nil || !parsedT.Valid {</span></span>
<span class="line"><span>			core.WriteResponse(c, errors.WithCode(code.ErrSignatureInvalid, err.Error()), nil)</span></span>
<span class="line"><span>			c.Abort()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if KeyExpired(secret.Expires) {</span></span>
<span class="line"><span>			tm := time.Unix(secret.Expires, 0).Format(&quot;2006-01-02 15:04:05&quot;)</span></span>
<span class="line"><span>			core.WriteResponse(c, errors.WithCode(code.ErrExpired, &quot;expired at: %s&quot;, tm), nil)</span></span>
<span class="line"><span>			c.Abort()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		c.Set(CtxUsername, secret.Username)</span></span>
<span class="line"><span>		c.Next()</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// KeyExpired checks if a key has expired, if the value of user.SessionState.Expires is 0, it will be ignored.</span></span>
<span class="line"><span>func KeyExpired(expires int64) bool {</span></span>
<span class="line"><span>	if expires &amp;gt;= 1 {</span></span>
<span class="line"><span>		return time.Now().After(time.Unix(expires, 0))</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return false</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AuthFunc函数依次执行了以下四大步来完成JWT认证，每一步中又有一些小步骤，下面我们来一起看看。</p><p>第一步，从Authorization: Bearer XX.YY.ZZ请求头中获取XX.YY.ZZ，XX.YY.ZZ即为JWT Token。</p><p>第二步，调用github.com/dgrijalva/jwt-go包提供的ParseWithClaims函数，该函数会依次执行下面四步操作。</p><p>调用ParseUnverified函数，依次执行以下操作：</p><p>从Token中获取第一段XX，base64解码后得到JWT Token的Header{“alg”:“HS256”,“kid”:“a45yPqUnQ8gljH43jAGQdRo0bXzNLjlU0hxa”,“typ”:“JWT”}。</p><p>从Token中获取第二段YY，base64解码后得到JWT Token的Payload{“aud”:“iam.authz.marmotedu.com”,“exp”:1625104314,“iat”:1625097114,“iss”:“iamctl”,“nbf”:1625097114}。</p><p>根据Token Header中的alg字段，获取Token加密函数。</p><p>最终ParseUnverified函数会返回Token类型的变量，Token类型包含 Method、Header、Claims、Valid这些重要字段，这些字段会用于后续的认证步骤中。</p><p>调用传入的keyFunc获取密钥，这里来看下keyFunc的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func(token *jwt.Token) (interface{}, error) {</span></span>
<span class="line"><span>	// Validate the alg is HMAC signature</span></span>
<span class="line"><span>	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {</span></span>
<span class="line"><span>		return nil, fmt.Errorf(&quot;unexpected signing method: %v&quot;, token.Header[&quot;alg&quot;])</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	kid, ok := token.Header[&quot;kid&quot;].(string)</span></span>
<span class="line"><span>	if !ok {</span></span>
<span class="line"><span>		return nil, ErrMissingKID</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	var err error</span></span>
<span class="line"><span>	secret, err = cache.get(kid)</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		return nil, ErrMissingSecret</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return []byte(secret.Key), nil</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，keyFunc接受 <code>*Token</code> 类型的变量，并获取Token Header中的kid，kid即为密钥ID：secretID。接着，调用cache.get(kid)获取密钥secretKey。cache.get函数即为getSecretFunc，getSecretFunc函数会根据kid，从内存中查找密钥信息，密钥信息中包含了secretKey。</p><ol start="3"><li>从Token中获取Signature签名字符串ZZ，也即Token的第三段。</li><li>获取到secretKey之后，token.Method.Verify验证Signature签名字符串ZZ，也即Token的第三段是否合法。token.Method.Verify实际上是使用了相同的加密算法和相同的secretKey加密XX.YY字符串。假设加密之后的字符串为WW，接下来会用WW和ZZ base64解码后的字符串进行比较，如果相等则认证通过，如果不相等则认证失败。</li></ol><p><strong>第三步，</strong> 调用KeyExpired，验证secret是否过期。secret信息中包含过期时间，你只需要拿该过期时间和当前时间对比就行。</p><p><strong>第四步，</strong> 设置HTTP Header <code>username: colin</code>。</p><p>到这里，iam-authz-server的Bearer认证分析就完成了。</p><p>我们来做个总结：iam-authz-server通过加载Gin中间件的方式，在请求 <code>/v1/authz</code> 接口时进行访问认证。因为Bearer认证具有过期时间，而且可以在认证字符串中携带更多有用信息，还具有不可逆加密等优点，所以 <strong>/v1/authz采用了Bearer认证，Token格式采用了JWT格式</strong>，这也是业界在API认证中最受欢迎的认证方式。</p><p>Bearer认证需要secretID和secretKey，这些信息会通过gRPC接口调用，从iam-apisaerver中获取，并缓存在iam-authz-server的内存中供认证时查询使用。</p><p>当请求来临时，iam-authz-server Bearer认证中间件从JWT Token中解析出Header，并从Header的kid字段中获取到secretID，根据secretID查找到secretKey，最后使用secretKey加密JWT Token的Header和Payload，并与Signature部分进行对比。如果相等，则认证通过；如果不等，则认证失败。</p><h3 id="iam-apiserver-bearer认证实现" tabindex="-1">iam-apiserver Bearer认证实现 <a class="header-anchor" href="#iam-apiserver-bearer认证实现" aria-label="Permalink to &quot;iam-apiserver Bearer认证实现&quot;">​</a></h3><p>再来看下 iam-apiserver的Bearer认证。</p><p>iam-apiserver的Bearer认证通过以下代码（位于 <a href="https://github.com/marmotedu/iam/blob/v1.1.0/internal/apiserver/router.go#L65" target="_blank" rel="noreferrer">router.go</a> 文件中）指定使用了auto认证策略：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>v1.Use(auto.AuthFunc())</span></span></code></pre></div><p>我们来看下 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/auto.go#L38" target="_blank" rel="noreferrer">auto.AuthFunc()</a> 的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (a AutoStrategy) AuthFunc() gin.HandlerFunc {</span></span>
<span class="line"><span>	return func(c *gin.Context) {</span></span>
<span class="line"><span>		operator := middleware.AuthOperator{}</span></span>
<span class="line"><span>		authHeader := strings.SplitN(c.Request.Header.Get(&quot;Authorization&quot;), &quot; &quot;, 2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if len(authHeader) != authHeaderCount {</span></span>
<span class="line"><span>			core.WriteResponse(</span></span>
<span class="line"><span>				c,</span></span>
<span class="line"><span>				errors.WithCode(code.ErrInvalidAuthHeader, &quot;Authorization header format is wrong.&quot;),</span></span>
<span class="line"><span>				nil,</span></span>
<span class="line"><span>			)</span></span>
<span class="line"><span>			c.Abort()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		switch authHeader[0] {</span></span>
<span class="line"><span>		case &quot;Basic&quot;:</span></span>
<span class="line"><span>			operator.SetStrategy(a.basic)</span></span>
<span class="line"><span>		case &quot;Bearer&quot;:</span></span>
<span class="line"><span>			operator.SetStrategy(a.jwt)</span></span>
<span class="line"><span>			// a.JWT.MiddlewareFunc()(c)</span></span>
<span class="line"><span>		default:</span></span>
<span class="line"><span>			core.WriteResponse(c, errors.WithCode(code.ErrSignatureInvalid, &quot;unrecognized Authorization header.&quot;), nil)</span></span>
<span class="line"><span>			c.Abort()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		operator.AuthFunc()(c)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		c.Next()</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面代码中可以看到，AuthFunc函数会从Authorization Header中解析出认证方式是Basic还是Bearer。如果是Bearer，就会使用JWT认证策略；如果是Basic，就会使用Basic认证策略。</p><p>我们再来看下JWT认证策略的 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/jwt.go#L30" target="_blank" rel="noreferrer">AuthFunc</a> 函数实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (j JWTStrategy) AuthFunc() gin.HandlerFunc {</span></span>
<span class="line"><span>	return j.MiddlewareFunc()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们跟随代码，可以定位到 <code>MiddlewareFunc</code> 函数最终调用了 <code>github.com/appleboy/gin-jwt</code> 包 <code>GinJWTMiddleware</code> 结构体的 <a href="https://github.com/appleboy/gin-jwt/blob/v2.6.4/auth_jwt.go#L369" target="_blank" rel="noreferrer">middlewareImpl</a> 方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (mw *GinJWTMiddleware) middlewareImpl(c *gin.Context) {</span></span>
<span class="line"><span>	claims, err := mw.GetClaimsFromJWT(c)</span></span>
<span class="line"><span>	if err != nil {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(err, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if claims[&quot;exp&quot;] == nil {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusBadRequest, mw.HTTPStatusMessageFunc(ErrMissingExpField, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if _, ok := claims[&quot;exp&quot;].(float64); !ok {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusBadRequest, mw.HTTPStatusMessageFunc(ErrWrongFormatOfExp, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if int64(claims[&quot;exp&quot;].(float64)) &amp;lt; mw.TimeFunc().Unix() {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusUnauthorized, mw.HTTPStatusMessageFunc(ErrExpiredToken, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	c.Set(&quot;JWT_PAYLOAD&quot;, claims)</span></span>
<span class="line"><span>	identity := mw.IdentityHandler(c)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if identity != nil {</span></span>
<span class="line"><span>		c.Set(mw.IdentityKey, identity)</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if !mw.Authorizator(identity, c) {</span></span>
<span class="line"><span>		mw.unauthorized(c, http.StatusForbidden, mw.HTTPStatusMessageFunc(ErrForbidden, c))</span></span>
<span class="line"><span>		return</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	c.Next()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>分析上面的代码，我们可以知道，middlewareImpl的Bearer认证流程为：</p><p><strong>第一步</strong>：调用 <code>GetClaimsFromJWT</code> 函数，从HTTP请求中获取Authorization Header，并解析出Token字符串，进行认证，最后返回Token Payload。</p><p><strong>第二步</strong>：校验Payload中的 <code>exp</code> 是否超过当前时间，如果超过就说明Token过期，校验不通过。</p><p><strong>第三步</strong>：给gin.Context中添加 <code>JWT_PAYLOAD</code> 键，供后续程序使用（当然也可能用不到）。</p><p><strong>第四步</strong>：通过以下代码，在gin.Context中添加IdentityKey键，IdentityKey键可以在创建 <code>GinJWTMiddleware</code> 结构体时指定，这里我们设置为 <code>middleware.UsernameKey</code>，也就是username。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>identity := mw.IdentityHandler(c)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if identity != nil {</span></span>
<span class="line"><span>    c.Set(mw.IdentityKey, identity)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>IdentityKey键的值由IdentityHandler函数返回，IdentityHandler函数为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func(c *gin.Context) interface{} {</span></span>
<span class="line"><span>    claims := jwt.ExtractClaims(c)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return claims[jwt.IdentityKey]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述函数会从Token的Payload中获取identity域的值，identity域的值是在签发Token时指定的，它的值其实是用户名，你可以查看 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/apiserver/auth.go#L177" target="_blank" rel="noreferrer">payloadFunc</a> 函数了解。</p><p><strong>第五步</strong>：接下来，会调用 <code>Authorizator</code> 方法， <code>Authorizator</code> 是一个callback函数，成功时必须返回真，失败时必须返回假。 <code>Authorizator</code> 也是在创建GinJWTMiddleware时指定的，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func authorizator() func(data interface{}, c *gin.Context) bool {</span></span>
<span class="line"><span>    return func(data interface{}, c *gin.Context) bool {</span></span>
<span class="line"><span>        if v, ok := data.(string); ok {</span></span>
<span class="line"><span>            log.L(c).Infof(&quot;user \`%s\` is authenticated.&quot;, v)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            return true</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return false</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>authorizator</code> 函数返回了一个匿名函数，匿名函数在认证成功后，会打印一条认证成功日志。</p><h2 id="iam项目认证功能设计技巧" tabindex="-1">IAM项目认证功能设计技巧 <a class="header-anchor" href="#iam项目认证功能设计技巧" aria-label="Permalink to &quot;IAM项目认证功能设计技巧&quot;">​</a></h2><p>我在设计IAM项目的认证功能时，也运用了一些技巧，这里分享给你。</p><h3 id="技巧1-面向接口编程" tabindex="-1">技巧1：面向接口编程 <a class="header-anchor" href="#技巧1-面向接口编程" aria-label="Permalink to &quot;技巧1：面向接口编程&quot;">​</a></h3><p>在使用 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/auto.go#L30" target="_blank" rel="noreferrer">NewAutoStrategy</a> 函数创建auto认证策略时，传入了 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth.go#L12" target="_blank" rel="noreferrer">middleware.AuthStrategy</a> 接口类型的参数，这意味着Basic认证和Bearer认证都可以有不同的实现，这样后期可以根据需要扩展新的认证方式。</p><h3 id="技巧2-使用抽象工厂模式" tabindex="-1">技巧2：使用抽象工厂模式 <a class="header-anchor" href="#技巧2-使用抽象工厂模式" aria-label="Permalink to &quot;技巧2：使用抽象工厂模式&quot;">​</a></h3><p><a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/apiserver/auth.go" target="_blank" rel="noreferrer">auth.go</a> 文件中，通过newBasicAuth、newJWTAuth、newAutoAuth创建认证策略时，返回的都是接口。通过返回接口，可以在不公开内部实现的情况下，让调用者使用你提供的各种认证功能。</p><h3 id="技巧3-使用策略模式" tabindex="-1">技巧3：使用策略模式 <a class="header-anchor" href="#技巧3-使用策略模式" aria-label="Permalink to &quot;技巧3：使用策略模式&quot;">​</a></h3><p>在auto认证策略中，我们会根据HTTP 请求头 <code>Authorization: XXX X.Y.X</code> 中的XXX来选择并设置认证策略（Basic 或 Bearer）。具体可以查看 <code>AutoStrategy</code> 的 <a href="https://github.com/marmotedu/iam/blob/v1.0.0/internal/pkg/middleware/auth/auto.go#L38" target="_blank" rel="noreferrer">AuthFunc</a> 函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>func (a AutoStrategy) AuthFunc() gin.HandlerFunc {</span></span>
<span class="line"><span>	return func(c *gin.Context) {</span></span>
<span class="line"><span>		operator := middleware.AuthOperator{}</span></span>
<span class="line"><span>		authHeader := strings.SplitN(c.Request.Header.Get(&quot;Authorization&quot;), &quot; &quot;, 2)</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>		switch authHeader[0] {</span></span>
<span class="line"><span>		case &quot;Basic&quot;:</span></span>
<span class="line"><span>			operator.SetStrategy(a.basic)</span></span>
<span class="line"><span>		case &quot;Bearer&quot;:</span></span>
<span class="line"><span>			operator.SetStrategy(a.jwt)</span></span>
<span class="line"><span>			// a.JWT.MiddlewareFunc()(c)</span></span>
<span class="line"><span>		default:</span></span>
<span class="line"><span>			core.WriteResponse(c, errors.WithCode(code.ErrSignatureInvalid, &quot;unrecognized Authorization header.&quot;), nil)</span></span>
<span class="line"><span>			c.Abort()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			return</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		operator.AuthFunc()(c)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		c.Next()</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，如果是Basic，则设置为Basic认证方法 <code>operator.SetStrategy(a.basic)</code>；如果是Bearer，则设置为Bearer认证方法 <code>operator.SetStrategy(a.jwt)</code>。 <code>SetStrategy</code> 方法的入参是AuthStrategy类型的接口，都实现了 <code>AuthFunc() gin.HandlerFunc</code> 函数，用来进行认证，所以最后我们调用 <code>operator.AuthFunc()(c)</code> 即可完成认证。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在IAM项目中，iam-apiserver实现了Basic认证和Bearer认证，iam-authz-server实现了Bearer认证。这一讲重点介绍了iam-apiserver的认证实现。</p><p>用户要访问iam-apiserver，首先需要通过Basic认证，认证通过之后，会返回JWT Token和JWT Token的过期时间。前端将Token缓存在LocalStorage或Cookie中，后续的请求都通过Token来认证。</p><p>执行Basic认证时，iam-apiserver会从HTTP Authorization Header中解析出用户名和密码，将密码再加密，并和数据库中保存的值进行对比。如果不匹配，则认证失败，否则认证成功。认证成功之后，会返回Token，并在Token的Payload部分设置用户名，Key为 username 。</p><p>执行Bearer认证时，iam-apiserver会从JWT Token中解析出Header和Payload，并从Header中获取加密算法。接着，用获取到的加密算法和从配置文件中获取到的密钥对Header.Payload进行再加密，得到Signature，并对比两次的Signature是否相等。如果不相等，则返回 HTTP 401 Unauthorized 错误；如果相等，接下来会判断Token是否过期，如果过期则返回认证不通过，否则认证通过。认证通过之后，会将Payload中的username添加到gin.Context类型的变量中，供后面的业务逻辑使用。</p><p>我绘制了整个流程的示意图，你可以对照着再回顾一遍。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/399307/642a010388e759dd76d411055bbd637e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Go%E8%AF%AD%E8%A8%80%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98/images/399307/642a010388e759dd76d411055bbd637e.jpg" alt=""></a></p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li>走读 <code>github.com/appleboy/gin-jwt</code> 包的 <code>GinJWTMiddleware</code> 结构体的 <a href="https://github.com/appleboy/gin-jwt/blob/v2.6.4/auth_jwt.go#L407" target="_blank" rel="noreferrer">GetClaimsFromJWT</a> 方法，分析一下：GetClaimsFromJWT方法是如何从gin.Context中解析出Token，并进行认证的？</li><li>思考下，iam-apiserver和iam-authzserver是否可以使用同一个认证策略？如果可以，又该如何实现？</li></ol><p>欢迎你在留言区与我交流讨论，我们下一讲见。</p>`,144)])])}const g=n(t,[["render",i]]);export{h as __pageData,g as default};
