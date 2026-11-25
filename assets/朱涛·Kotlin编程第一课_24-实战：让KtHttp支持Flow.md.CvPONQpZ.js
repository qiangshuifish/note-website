import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"24-实战：让KtHttp支持Flow","description":"","frontmatter":{},"headers":[{"level":2,"title":"5.0 版本：Callback 转 Flow","slug":"_5-0-版本-callback-转-flow","link":"#_5-0-版本-callback-转-flow","children":[]},{"level":2,"title":"6.0 版本：直接支持 Flow","slug":"_6-0-版本-直接支持-flow","link":"#_6-0-版本-直接支持-flow","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"朱涛·Kotlin编程第一课/24-实战：让KtHttp支持Flow.md","filePath":"朱涛·Kotlin编程第一课/24-实战：让KtHttp支持Flow.md","lastUpdated":1795558358000}'),l={name:"朱涛·Kotlin编程第一课/24-实战：让KtHttp支持Flow.md"};function t(e,s,h,k,c,o){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_24-实战-让kthttp支持flow" tabindex="-1">24-实战：让KtHttp支持Flow <a class="header-anchor" href="#_24-实战-让kthttp支持flow" aria-label="Permalink to &quot;24-实战：让KtHttp支持Flow&quot;">​</a></h1><p>你好，我是朱涛。又到了熟悉的实战环节，这一次我们接着来改造 KtHttp，让它能够支持协程的 Flow API。</p><p>有了前面两次实战的基础，这次我们应该就轻车熟路了。在之前的4.0 版本中，为了让KtHttp 支持挂起函数，我们有两种思路，一种是改造内部，另一种是扩展外部。同理，为了让KtHttp 支持 Flow，这次的实战也是这两种思路。</p><p>因此，这节课我们仍然会分为两个版本。</p><ul><li><p>5.0 版本，基于 4.0 版本的代码，从 KtHttp 的外部扩展出 Flow 的能力。</p></li><li><p>6.0 版本，修改 KtHttp 内部，让它支持 Flow API。</p></li></ul><p>其实在实际的工作中，我们往往没有权限修改第三方提供的 SDK，那么这时候，如果想要让SDK 获得 Flow 的能力，我们就只能借助 Kotlin 的扩展函数，为它扩展出 Flow 的能力。而对于工程内部的代码，我们希望某个功能模块获得 Flow 的能力，就可以直接修改它的源代码，让它直接支持 Flow。</p><p>那么在这节课里，我会同时用这两种手段来扩展并改造 KtHttp，为你演示其中的关键步骤。在这个过程中，我也会为你讲解其中的常见误区和陷阱，这样一来，你就可以放心地将 Flow 应用到你的实际工作中了。</p><p>OK，让我们正式开始吧！</p><h2 id="_5-0-版本-callback-转-flow" tabindex="-1">5.0 版本：Callback 转 Flow <a class="header-anchor" href="#_5-0-版本-callback-转-flow" aria-label="Permalink to &quot;5.0 版本：Callback 转 Flow&quot;">​</a></h2><p>在上次的实战课当中，我们在 3.0 版本里，实现了 KtHttp 的异步 Callback 请求。之后在 4.0版本里，我们并没有改动 KtHttp 的源代码，而是直接在 KtCall 的基础上扩展了挂起函数的支持。让我们重新回顾一下之前的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段1</span></span>
<span class="line"><span>// 扩展函数</span></span>
<span class="line"><span>suspend fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.await(): T =</span></span>
<span class="line"><span>//      暴露挂起函数的continuation</span></span>
<span class="line"><span>//              ↓</span></span>
<span class="line"><span>   suspendCancellableCoroutine { continuation -&gt;</span></span>
<span class="line"><span>       val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>           override fun onSuccess(data: T) {</span></span>
<span class="line"><span>               println(&quot;Request success!&quot;)</span></span>
<span class="line"><span>               continuation.resume(data)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>           override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>               println(&quot;Request fail!：$throwable&quot;)</span></span>
<span class="line"><span>               continuation.resumeWithException(throwable)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       })</span></span>
<span class="line"><span>//          响应取消事件</span></span>
<span class="line"><span>//              ↓</span></span>
<span class="line"><span>       continuation.invokeOnCancellation {</span></span>
<span class="line"><span>           println(&quot;Call cancelled!&quot;)</span></span>
<span class="line"><span>           call.cancel()</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span></code></pre></div><p>我们知道，上面这种做法非常适合针对第三方 SDK 的扩展，而这一切，都要归功于 Kotlin 的扩展函数特性。那么这节课里，我们希望 KtHttp 支持 Flow，其实也同样可以借助扩展函数来实现。Kotlin 官方提供了一个 API：callbackFlow，它就是专门用于将 Callback 转为 Flow的。</p><p>Callback 转 Flow，用法跟 Callback 转挂起函数是差不多的。如果你去分析代码段 1 当中的代码模式，会发现 Callback 转挂起函数，主要有三个步骤。</p><ul><li><p>第一步：使用 suspendCancellableCoroutine 执行 Callback 代码，等待 Callback 回调；</p></li><li><p>第二步：将 Callback 回调结果传出去，onSuccess 的情况就传结果，onFail 的情况就传异常；</p></li><li><p>第三步：响应协程取消事件 invokeOnCancellation{}。</p></li></ul><p>所以使用 callbackFlow，也是这样三个步骤。如果你看过 Google 官方写的文档，你可能会写出这样的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段2</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   // 调用Callback</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           // 1，传递成功数据，报错！</span></span>
<span class="line"><span>           offer(data)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           // 2，传递失败数据</span></span>
<span class="line"><span>           close(throwable)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   // 3，响应协程取消</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段代码里，callbackFlow 的使用步骤也是分了三步。不过，由于 Google 官方写的文档已经有些过时了，如果你按照文档来写，会发现注释 1 处的代码其实会报错，IDE 会提示应该使用 trySend() 替代 offer()。</p><p>所以我们要再来改一改：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段3</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           // 1</span></span>
<span class="line"><span>           trySend(data)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           // 2</span></span>
<span class="line"><span>           close(throwable)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么从上面的代码中，你会发现，callbackFlow 的底层用到了 Channel，所以你才可以使用trySend() 这样的 API。这个 API 我在第 19 讲里提到过，它其实就是 Channel.send() 的非挂起函数版本的 API。</p><p>这样改完以后，我们的代码就已经没有明显报错了。但，它仍然还有优化空间，对应的地方我已经用注释标记出来了。</p><p>我们来看一下注释 1，这里使用 trySend()，虽然在这个案例当中用这个 API 确实没问题，但在大部分场景下，它其实是不够稳妥的。你可以查看一下它的源码文档，会看到它的返回值类型是 ChannelResult，代表 trySend() 的执行结果是成功还是失败。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段4</span></span>
<span class="line"><span>public fun trySend(element: E): ChannelResult&lt;​Unit&gt;</span></span></code></pre></div><p>也就是说，如果我们往 Channel 当中成功地添加了元素，那么 trySend() 的返回值就是成功，如果当前的 Channel 管道已经满了，那么 trySend() 的返回值就是失败。</p><p>其实，当 Channel 管道容量已满的时候，我们更希望 trySend() 可以多等等，直到管道容量空闲以后再返回成功。所以这时候，我们可以使用 trySendBlocking() 来替代它。它是 Kotlin协程 1.5 出现的一个新的 API。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段5</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           // 1，变化在这里</span></span>
<span class="line"><span>           trySendBlocking(data)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           // 2</span></span>
<span class="line"><span>           close(throwable)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，这里我们仅仅只是改为 trySendBlocking() 仍然还不够，让我们来运行一下程序，看看问题出在哪里：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段6</span></span>
<span class="line"><span>interface ApiServiceV5 {</span></span>
<span class="line"><span>   @GET(&quot;/repo&quot;)</span></span>
<span class="line"><span>   fun repos(</span></span>
<span class="line"><span>       @Field(&quot;lang&quot;) lang: String,</span></span>
<span class="line"><span>       @Field(&quot;since&quot;) since: String</span></span>
<span class="line"><span>   ): KtCall&lt;​RepoList&gt;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   testFlow()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private suspend fun testFlow() =</span></span>
<span class="line"><span>   KtHttpV5.create(ApiServiceV5::class.java)</span></span>
<span class="line"><span>       .repos(lang = &quot;Kotlin&quot;, since = &quot;weekly&quot;)</span></span>
<span class="line"><span>       .asFlow()</span></span>
<span class="line"><span>       .catch { println(&quot;Catch: $it&quot;) }</span></span>
<span class="line"><span>       .collect {</span></span>
<span class="line"><span>       println(it)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出正常程序不会终止</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span></code></pre></div><p>其实，问题的原因也很简单，由于 callbackFlow 的底层是 Channel 实现的，在我们用完它以后，应该主动将其关闭或者释放。不然的话，它就会一直占用计算机资源。所以这时候，我们可以进一步完善 trySendBlocking() 这部分的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段7</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           // 1，变化在这里</span></span>
<span class="line"><span>           trySendBlocking(data)</span></span>
<span class="line"><span>               .onSuccess { close() }</span></span>
<span class="line"><span>               .onFailure { close(it) }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           close(throwable)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果输出正常程序等待一会后自动终止</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span></code></pre></div><p>上面代码中的 onSuccess、onFailure 其实就相当于回调，在这里，不管是成功还是失败，我们都主动把 callbackFlow 当中的 Channel 关闭。这样一来，程序就可以正常终止了。</p><ul><li>提示：在大部分场景下 trySendBlocking() 会比 trySend() 更稳妥一些，因为它会尽可能发送成功。但在某些特殊情况下，trySend() 也有它的优势，因为它不会出现阻塞问题。</li></ul><p>好，现在，5.0 版本的代码其实就已经算是合格了。不过，我还想给你介绍下 callbackFlow 的一些使用细节：close() 与 close(throwable)。</p><p>close() 这个方法，我们既可以传入异常，也可以不传入。不过，这两者在 callbackFlow 当中是有差异的。如果你将代码段 7 当中所有的 close(throwable) 都改为不传异常的话，程序代码也会出现问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段8</span></span>
<span class="line"><span>// 错误示范！错误示范！错误示范！</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   testFlow()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private suspend fun testFlow() =</span></span>
<span class="line"><span>   KtHttpV5.create(ApiServiceV5::class.java)</span></span>
<span class="line"><span>       .repos(lang = &quot;Kotlin&quot;, since = &quot;weekly&quot;)</span></span>
<span class="line"><span>       .asFlow()</span></span>
<span class="line"><span>       .catch { println(&quot;Catch: $it&quot;) }</span></span>
<span class="line"><span>       .collect {</span></span>
<span class="line"><span>           println(it)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           trySendBlocking(data)</span></span>
<span class="line"><span>               .onSuccess { close() }</span></span>
<span class="line"><span>               .onFailure {</span></span>
<span class="line"><span>                   // 变化在这里</span></span>
<span class="line"><span>                   close()</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           // 变化在这里</span></span>
<span class="line"><span>           close()</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>断网执行以上代码：不会有任何结果，连异常信息都没有</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span></code></pre></div><p>在以上代码中，我们断网执行了这段程序，但在控制台上看不到任何异常的输出信息。这就是因为，我们调用 close() 的时候没有传入异常信息。</p><p>所以，在 callbackFlow 当中的异常分支里，我们如果使用 close()，一定要带上对应的异常，就像代码段 7 的那样“close(throwable)”。或者，为了防止在开发的过程中忘记传入异常信息，我们可以使用 cancel() 方法。就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段9</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           trySendBlocking(data)</span></span>
<span class="line"><span>               .onSuccess { close() }</span></span>
<span class="line"><span>               .onFailure {</span></span>
<span class="line"><span>                   // 变化在这里</span></span>
<span class="line"><span>                   cancel(CancellationException(&quot;Send channel fail!&quot;, it))</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           // 变化在这里</span></span>
<span class="line"><span>           cancel(CancellationException(&quot;Request fail!&quot;, throwable))</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>断网执行</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Catch: java.util.concurrent.CancellationException: Request fail!</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>根据这里的运行结果，我们可以看到，把 close() 改成 cancel() 以后，程序运行结果也符合预期。而 cancel 其实还有一个优势：就算不小心忘记传 throwable，我们还是可以看到一个CancellationException。</p><p>不过总的来说，只要我们可以记住传入异常信息，close() 和 cancel() 两者的差别并不大。</p><p>另外还有一点，如果我们在 callbackFlow 当中还启动了其他的协程任务，close() 和 cancel()也同样可以取消对应的协程。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段10</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   testFlow()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private suspend fun testFlow() =</span></span>
<span class="line"><span>   KtHttpV5.create(ApiServiceV5::class.java)</span></span>
<span class="line"><span>       .repos(lang = &quot;Kotlin&quot;, since = &quot;weekly&quot;)</span></span>
<span class="line"><span>       .asFlow() // 注意这里</span></span>
<span class="line"><span>       .catch { println(&quot;Catch: $it&quot;) }</span></span>
<span class="line"><span>       .collect {</span></span>
<span class="line"><span>       println(it)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val job = launch {</span></span>
<span class="line"><span>       println(&quot;Coroutine start&quot;)</span></span>
<span class="line"><span>       delay(3000L)</span></span>
<span class="line"><span>       println(&quot;Coroutine end&quot;) // 没有机会执行</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   job.invokeOnCompletion {</span></span>
<span class="line"><span>       println(&quot;Coroutine completed $it&quot;)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           trySendBlocking(data)</span></span>
<span class="line"><span>               .onSuccess { close() }</span></span>
<span class="line"><span>               .onFailure {</span></span>
<span class="line"><span>                   cancel(CancellationException(&quot;Send channel fail!&quot;, it))</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           cancel(CancellationException(&quot;Request fail!&quot;, throwable))</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   awaitClose {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>断网执行</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Coroutine start</span></span>
<span class="line"><span>Coroutine completed java.util.concurrent.CancellationException: Request fail!</span></span>
<span class="line"><span>Catch: java.util.concurrent.CancellationException: Request fail!</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>可以看到，由于协程是结构化的，所以，当我们取消 callbackFlow 的时候，在它内部创建的协程 job，也会跟着被取消。而且，它的异常信息也是一样的。</p><p>不过，如果我们把上面的 launch{} 改成了“launch(Job()){}”，那么，协程任务就不会跟随callbackFlow 一起被取消了。我相信，如果你还记得上节课讲的第二条准则，那你一定可以轻松理解这句话。因为，它们的协程的父子关系已经被破坏了！</p><p>最后，我还想再提一下 awaitClose{} 这个挂起函数，它的作用其实就是监听 callbackFlow 的生命周期，当它被关闭或者取消的时候，我们应该同时把 OkHttp 当中的网络请求也取消掉。它的作用，跟代码段 1 当中的 continuation.invokeOnCancellation{} 是类似的。</p><p>好，callbackFlow 的用法我们就讲解完了，有了它，以后我们就可以轻松地把第三方 SDK 的Callback 扩展成 Flow 了。</p><p>那么接下来，我们就进入 6.0 版本的开发吧！</p><h2 id="_6-0-版本-直接支持-flow" tabindex="-1">6.0 版本：直接支持 Flow <a class="header-anchor" href="#_6-0-版本-直接支持-flow" aria-label="Permalink to &quot;6.0 版本：直接支持 Flow&quot;">​</a></h2><p>实际上，对于 KtHttp 来说，4.0 版本、5.0 版本都只是外部扩展，我们对 KtHttp 的内部源代码并没有做改动。</p><p>而对于 6.0 版本的开发，我们其实是希望 KtHttp 可以直接支持返回 Flow 类型的数据，也就是这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段11</span></span>
<span class="line"><span>interface ApiServiceV5 {</span></span>
<span class="line"><span>   @GET(&quot;/repo&quot;)</span></span>
<span class="line"><span>   fun repos(</span></span>
<span class="line"><span>       @Field(&quot;lang&quot;) lang: String,</span></span>
<span class="line"><span>       @Field(&quot;since&quot;) since: String</span></span>
<span class="line"><span>   ): KtCall&lt;​RepoList&gt;</span></span>
<span class="line"><span>   @GET(&quot;/repo&quot;)</span></span>
<span class="line"><span>   fun reposFlow(</span></span>
<span class="line"><span>       @Field(&quot;lang&quot;) lang: String,</span></span>
<span class="line"><span>       @Field(&quot;since&quot;) since: String</span></span>
<span class="line"><span>   ): Flow&lt;​RepoList&gt; // 注意这里</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>请你留意上面的代码注释，在 ApiServiceV5 当中，我定义了一个接口方法 reposFlow()，它的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>返回值类型是 Flow&lt;​RepoList&gt;，而不是之前的 KtCall&lt;​RepoList&gt;。这样一来，我们在</span></span></code></pre></div><p>main() 函数当中使用它的时候，就不需要使用 asFlow() 这个扩展函数了。就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段12</span></span>
<span class="line"><span>private suspend fun testFlow() =</span></span>
<span class="line"><span>   KtHttpV5.create(ApiServiceV5::class.java)</span></span>
<span class="line"><span>       .reposFlow(lang = &quot;Kotlin&quot;, since = &quot;weekly&quot;)</span></span>
<span class="line"><span>       // 注意这里不需要asFlow，因为reposFlow()返回值类型就是Flow</span></span>
<span class="line"><span>       .catch { println(&quot;Catch: $it&quot;) }</span></span>
<span class="line"><span>       .collect {</span></span>
<span class="line"><span>           println(it)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   testFlow()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>可以看到，当我们把 reposFlow() 的返回值类型定义成 Flow&lt;​RepoList&gt; 以后，就需要改动</span></span></code></pre></div><p>KtHttp 的源代码了。因为，它的内部需要根据这种情况做一些特殊的判断。</p><p>其实，在前面 3.0 版本的开发中，我们就已经做过一次判断了。当时，我们特地判断了一下，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>返回值类型是 KtCall&lt;​T&gt; 还是T。让我们来重新回顾一下当时的代码细节：</span></span>
<span class="line"><span>// 代码段13</span></span>
<span class="line"><span>private fun &lt;​T: Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any?</span></span>
<span class="line"><span>   // 省略部分代码</span></span>
<span class="line"><span>   return if (isKtCallReturn(method)) {</span></span>
<span class="line"><span>       // 返回值类型是KtCall&lt;​RepoList&gt;</span></span>
<span class="line"><span>       val genericReturnType = getTypeArgument(method)</span></span>
<span class="line"><span>       KtCall&lt;​T&gt;(call, gson, genericReturnType)</span></span>
<span class="line"><span>   } else {</span></span>
<span class="line"><span>       // 返回值类型是 RepoList</span></span>
<span class="line"><span>       val response = okHttpClient.newCall(request).execute()</span></span>
<span class="line"><span>       val genericReturnType = method.genericReturnType</span></span>
<span class="line"><span>       val json = response.body?.string()</span></span>
<span class="line"><span>       gson.fromJson&lt;​Any?&gt;(json, genericReturnType)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到上面的代码，相信你马上就能想明白了，如果要支持 Flow，我们只需要在这里判断一</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>下，返回值类型是不是 Flow&lt;​T&gt; 即可。比如说：</span></span>
<span class="line"><span>// 代码段14</span></span>
<span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>   // 省略部分代码</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           val genericReturnType = getTypeArgument(method)</span></span>
<span class="line"><span>           KtCall&lt;​T&gt;(call, gson, genericReturnType)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 直接返回Flow</span></span>
<span class="line"><span>           flow&lt;​T&gt; {</span></span>
<span class="line"><span>               // 请求API</span></span>
<span class="line"><span>               val genericReturnType = getTypeArgument(method)</span></span>
<span class="line"><span>               val response = okHttpClient.newCall(request).execute()</span></span>
<span class="line"><span>               val json = response.body?.string()</span></span>
<span class="line"><span>               val result = gson.fromJson&lt;​T&gt;(json, genericReturnType)</span></span>
<span class="line"><span>               // 传出结果</span></span>
<span class="line"><span>               emit(result)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           val response = okHttpClient.newCall(request).execute()</span></span>
<span class="line"><span>           val genericReturnType = method.genericReturnType</span></span>
<span class="line"><span>           val json = response.body?.string()</span></span>
<span class="line"><span>           gson.fromJson&lt;​Any?&gt;(json, genericReturnType)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 判断返回值类型是不是 Flow&lt;​T&gt;</span></span>
<span class="line"><span>private fun isFlowReturn(method: Method) =</span></span>
<span class="line"><span>       getRawType(method.genericReturnType) == Flow::class.java</span></span></code></pre></div><p>由于代码段 13 当中已经有了 if、else 两个条件分支了，再增加一个分支的话，我们选择了when 表达式。这里，我们增加了一个 isFlowReturn(method) 的分支，意思就是判断返回值类型是不是 Flow，如果是的话，我们就直接使用 flow{} 创建一个 Flow 返回了。</p><p>至此，我们 6.0 版本的开发工作，其实就已经完成了。是不是觉得非常轻松？对比起Callback 转 Flow，让 KtHttp 直接支持 Flow 确实要简单很多。从这一点上，我们也可以看到 Flow 的强大和易用性。</p><p>那么在这时候，我们就可以写一些简单的测试代码，来验证我们的代码是否可靠了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段15</span></span>
<span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>   // 省略部分代码</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           val genericReturnType = getTypeArgument(method)</span></span>
<span class="line"><span>           KtCall&lt;​T&gt;(call, gson, genericReturnType)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 增加日志</span></span>
<span class="line"><span>           logX(&quot;Start out&quot;)</span></span>
<span class="line"><span>           flow&lt;​T&gt; {</span></span>
<span class="line"><span>               logX(&quot;Start in&quot;)</span></span>
<span class="line"><span>               val genericReturnType = getTypeArgument(method)</span></span>
<span class="line"><span>               val response = okHttpClient.newCall(request).execute()</span></span>
<span class="line"><span>               val json = response.body?.string()</span></span>
<span class="line"><span>               val result = gson.fromJson&lt;​T&gt;(json, genericReturnType)</span></span>
<span class="line"><span>               logX(&quot;Start emit&quot;)</span></span>
<span class="line"><span>               emit(result)</span></span>
<span class="line"><span>               logX(&quot;End emit&quot;)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           val response = okHttpClient.newCall(request).execute()</span></span>
<span class="line"><span>           val genericReturnType = method.genericReturnType</span></span>
<span class="line"><span>           val json = response.body?.string()</span></span>
<span class="line"><span>           gson.fromJson&lt;​Any?&gt;(json, genericReturnType)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private suspend fun testFlow() =</span></span>
<span class="line"><span>   KtHttpV5.create(ApiServiceV5::class.java)</span></span>
<span class="line"><span>       .reposFlow(lang = &quot;Kotlin&quot;, since = &quot;weekly&quot;)</span></span>
<span class="line"><span>       .flowOn(Dispatchers.IO) //切换线程</span></span>
<span class="line"><span>       .catch { println(&quot;Catch: $it&quot;) }</span></span>
<span class="line"><span>       .collect {</span></span>
<span class="line"><span>           logX(&quot;\${it.count}&quot;)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>Start out</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Start in</span></span>
<span class="line"><span>Thread:DefaultDispatcher-worker-1 @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Start emit</span></span>
<span class="line"><span>Thread:DefaultDispatcher-worker-1 @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>End emit</span></span>
<span class="line"><span>Thread:DefaultDispatcher-worker-1 @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>25</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span></code></pre></div><ul><li>程序结束</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span></code></pre></div><p>在上面的代码中，我们增加了一些日志，同时在调用处增加了“flowOn(Dispatchers.IO)”。可以看到，这样一来整个网络请求就执行在了 DefaultDispatcher 这个线程池当中，而其他部分的代码，仍然执行在 main() 线程。这也是符合预期的。</p><p>然后，我们可以通过断网来模拟出现异常的情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段16</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>Start out</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Start in</span></span>
<span class="line"><span>Thread:DefaultDispatcher-worker-1 @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Catch: java.net.UnknownHostException:  nodename nor servname provided, or not kno</span></span></code></pre></div><ul><li>程序结束</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span></code></pre></div><p>可以看到，程序的运行结果仍然是符合预期的。</p><p>下面，我们再来看看 6.0 完整的代码：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段17</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ApiServiceV5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/repo&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">repos</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Field</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;lang&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">lang</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Field</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;since&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">since</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   )</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> KtCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RepoList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 注释1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/repo&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">reposFlow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Field</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;lang&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">lang</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Field</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;since&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">since</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   )</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Flow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RepoList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">object KtHttpV5 {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   private </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> okHttpClient</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> OkHttpClient</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> OkHttpClient</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   private </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> gson</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Gson</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Gson</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> baseUrl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://baseUrl.com&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   fun </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : Any</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(service: Class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Proxy.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">newProxyInstance</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           service.classLoader,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           arrayOf</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​Class</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;*&gt;&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(service)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       ) { proxy, method, args -&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           val annotations </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method.annotations</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">annotation</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> in</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> annotations</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (annotation is </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">GET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val url </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> baseUrl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> annotation.value</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@newProxyInstance invoke</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(url, method, args</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           return@newProxyInstance null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   private fun </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : Any</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> invoke</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(path: String, method: Method, args: Array</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​Any</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (method.parameterAnnotations.size </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> args.size) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> url </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> path</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       val parameterAnnotations </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method.parameterAnnotations</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> parameterAnnotations.indices) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (parameterAnnotation </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> parameterAnnotations[i]) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (parameterAnnotation is Field) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val key </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> parameterAnnotation.value</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> args[i].</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toString</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">url.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">contains</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;?&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       url </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;?$key=$value&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                       url </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&amp;$key=$value&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       val request </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Builder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(url)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       val call </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> okHttpClient.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">newCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(request)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> when {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           isKtCallReturn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">method</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               val genericReturnType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getTypeArgument</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(method)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               KtCall</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(call, gson, genericReturnType)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           isFlowReturn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">method</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -&gt; {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">               logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Start out&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">               // 注释2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               flow</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">                   logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Start in&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val genericReturnType = </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getTypeArgument</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">method</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val response = okHttpClient.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">newCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">execute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val json = response.body?.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   val result = gson.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fromJson</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">genericReturnType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">                   logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Start emit&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">                   emit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">result</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">                   logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;End emit&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           else -&gt; {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               val response </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> okHttpClient.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">newCall</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(request).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">execute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               val genericReturnType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> method.genericReturnType</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               val json </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> response.body?.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               gson.fromJson</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​Any</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(json, genericReturnType)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   private fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getTypeArgument</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(method: Method) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       (method.genericReturnType </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ParameterizedType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).actualTypeArguments[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   private fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">isKtCallReturn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(method: Method) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">       getRawType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(method.genericReturnType) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> KtCall</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:class.java</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   private fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">isFlowReturn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(method: Method) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">       getRawType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(method.genericReturnType) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Flow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::class.java</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() = runBlocking {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   testFlow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">private suspend fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testFlow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() =</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   KtHttpV5.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ApiServiceV5</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">java</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">reposFlow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">lang</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Kotlin&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">since</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;weekly&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">flowOn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Dispatchers.IO)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .catch { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Catch: $it&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       .collect {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\${it.count}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span></code></pre></div><p>最后，我们也再来分析一下，为什么 6.0 的代码可以这么简单。这里有两个关键的地方，我也分别用注释标记了。</p><p>请你留意注释 1 处的 reposFlow() 方法的定义，它其实是一个普通的函数，并不是挂起函数。换言之，虽然它的返回值类型是 Flow，但我们并不要求它在协程当中被调用。</p><p>另外，请留意注释 2 处，flow{} 这个高阶函数，它也只是一个普通函数，同样也不是挂起函数，这就意味着，它可以在普通函数里面直接调用。我们可以看看 flow{} 的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段18</span></span>
<span class="line"><span>// 不是挂起函数</span></span>
<span class="line"><span>public fun &lt;​T&gt; flow(@BuilderInference block: suspend FlowCollector&lt;​T&gt;.() -&gt; Unit)</span></span></code></pre></div><p>所以，正因为以上这两点，就使得 Flow 的易用性非常高，还记得我们在第 20 讲当中看过的那张 Flow“上游、下游”的示意图吗？我们其实可以进一步完善它：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/24-%25E5%25AE%259E%25E6%2588%2598/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/24-%25E5%25AE%259E%25E6%2588%2598/1.png" alt=""></a></p><p>也就是说，对于 Flow 的上游、中间操作符而言，它们其实根本就不需要协程作用域，只有在下游调用 collect{} 的时候，才需要协程作用域。</p><p>因此，我们前面在写 main() 函数的时候，也可以换成这样的写法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段19</span></span>
<span class="line"><span>fun main() {</span></span>
<span class="line"><span>   // 协程作用域外</span></span>
<span class="line"><span>   val flow = KtHttpV5.create(ApiServiceV5::class.java)</span></span>
<span class="line"><span>       .reposFlow(lang = &quot;Kotlin&quot;, since = &quot;weekly&quot;)</span></span>
<span class="line"><span>       .flowOn(Dispatchers.IO)</span></span>
<span class="line"><span>       .catch { println(&quot;Catch: $it&quot;) }</span></span>
<span class="line"><span>   runBlocking {</span></span>
<span class="line"><span>       // 协程作用域内</span></span>
<span class="line"><span>       flow.collect {</span></span>
<span class="line"><span>           logX(&quot;\${it.count}&quot;)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可见，正因为 Flow 的上游不需要协程作用域，我们才可以轻松完成 6.0 版本的代码。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这节实战课，为了让 KtHttp 支持 Flow API，我们使用了两种方法。第一种，是从 KtHttp 的外部进行扩展，用这种思路，我们完成了 5.0 版本的开发；第二种，是修改 KtHttp 的内部，让ApiService 当中的方法可以直接以 Flow 作为返回值类型，利用这种思路，我们完成了 6.0 的开发。</p><p>具体来说，我们是用到了这几个知识点，你可以重点关注一下：</p><ul><li><p>callbackFlow{}，它的作用就是把 Callback 转换成 Flow。它的底层其实用到了 Channel，因此，我们可以在 callbackFlow{} 当中调用 trySend()、trySendBlocking()，这两个方法都是 Channel 当中的“非挂起函数”的方法。需要注意的是，这里我们不能直接使用 Channel的挂起函数 send()，因为它必须要在协程体当中执行。</p></li><li><p>在 callbackFlow{} 里，出现异常的逻辑分支当中，如果我们需要关闭 callbackFlow，那么在调用 close() 的时候，一定要传入对应的异常参数 close(throwable)。不然的话，Flow 的下游就无法收到任何的异常信息。</p></li><li><p>在 callbackFlow{} 当中创建的协程任务，也可以跟随 callbackFlow 一同被取消，只要我们不打破它原有的协程父子关系。</p></li><li><p>由于 Flow 的上游、中间操作符不需要协程作用域，因此，我们可以在非协程当中执行创建Flow。这就导致我们 6.0 版本的代码轻松就可以实现。</p></li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在 5.0 版本的代码中，awaitClose{} 的作用是响应协程的取消，同时取消 OkHttp 的请求。其实，它除了这个作用以外，还有另外一个作用。</p><p>你可以把 5.0 版本代码中的 awaitClose 删掉，看看会发生什么。对于这样的现象，你能想到awaitClose{} 的另一个作用吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段20</span></span>
<span class="line"><span>fun &lt;​T : Any&gt; KtCall&lt;​T&gt;.asFlow(): Flow&lt;​T&gt; = callbackFlow {</span></span>
<span class="line"><span>   val call = call(object : Callback&lt;​T&gt; {</span></span>
<span class="line"><span>       override fun onSuccess(data: T) {</span></span>
<span class="line"><span>           trySendBlocking(data)</span></span>
<span class="line"><span>               .onSuccess { close() }</span></span>
<span class="line"><span>               .onFailure {</span></span>
<span class="line"><span>                   cancel(CancellationException(&quot;Send channel fail!&quot;, it))</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onFail(throwable: Throwable) {</span></span>
<span class="line"><span>           cancel(CancellationException(&quot;Request fail!&quot;, throwable))</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   // 注意这里</span></span>
<span class="line"><span>   // awaitClose {</span></span>
<span class="line"><span>   //     call.cancel()</span></span>
<span class="line"><span>   // }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,106)])])}const d=a(l,[["render",t]]);export{E as __pageData,d as default};
