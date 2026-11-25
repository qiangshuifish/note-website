import{_ as n,H as a,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"27-图解挂起函数：原来你就是个状态机？","description":"","frontmatter":{},"headers":[{"level":2,"title":"CPS 转换背后的细节","slug":"cps-转换背后的细节","link":"#cps-转换背后的细节","children":[{"level":3,"title":"CPS 参数变化","slug":"cps-参数变化","link":"#cps-参数变化","children":[]},{"level":3,"title":"CPS 返回值变化","slug":"cps-返回值变化","link":"#cps-返回值变化","children":[]}]},{"level":2,"title":"挂起函数的反编译","slug":"挂起函数的反编译","link":"#挂起函数的反编译","children":[{"level":3,"title":"协程未挂起的情况","slug":"协程未挂起的情况","link":"#协程未挂起的情况","children":[]}]},{"level":2,"title":"思考与实战","slug":"思考与实战","link":"#思考与实战","children":[{"level":3,"title":"17 讲思考题解答","slug":"_17-讲思考题解答","link":"#_17-讲思考题解答","children":[]},{"level":3,"title":"KtHttp 支持挂起函数","slug":"kthttp-支持挂起函数","link":"#kthttp-支持挂起函数","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"朱涛·Kotlin编程第一课/27-图解挂起函数：原来你就是个状态机？.md","filePath":"朱涛·Kotlin编程第一课/27-图解挂起函数：原来你就是个状态机？.md","lastUpdated":1795558358000}'),l={name:"朱涛·Kotlin编程第一课/27-图解挂起函数：原来你就是个状态机？.md"};function t(e,s,h,k,o,c){return a(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_27-图解挂起函数-原来你就是个状态机" tabindex="-1">27-图解挂起函数：原来你就是个状态机？ <a class="header-anchor" href="#_27-图解挂起函数-原来你就是个状态机" aria-label="Permalink to &quot;27-图解挂起函数：原来你就是个状态机？&quot;">​</a></h1><p>你好，我是朱涛。今天我们来研究 Kotlin 挂起函数的实现原理。</p><p>挂起函数，是整个 Kotlin 协程的核心，它的重要性不言而喻。几乎所有协程里的知识点，都离不开挂起函数。而且也正是因为挂起函数的原因，我们才可以使用协程简化异步任务。</p><p>今天这节课，我会从这个 CPS 转换开始说起，带你进一步挖掘它背后的细节。在这个过程中，我们还会接触到 Kotlin 库当中的协程基础元素：Continuation、CoroutineContext 与挂起函数的底层联系。最后，我会带你灵活运用下这些知识点，以此进一步完善我们的 KtHttp，让它可以直接支持挂起函数。</p><p>好，接下来，我们就正式开始吧！</p><h2 id="cps-转换背后的细节" tabindex="-1">CPS 转换背后的细节 <a class="header-anchor" href="#cps-转换背后的细节" aria-label="Permalink to &quot;CPS 转换背后的细节&quot;">​</a></h2><p>在第 15 讲当中，我们已经初步介绍过挂起函数的用法了：挂起函数，只是比普通的函数多了 suspend 关键字。有了这个 suspend 关键字以后，Kotlin 编译器就会特殊对待这个函数，将其转换成一个带有 Callback 的函数，这里的 Callback 就是 Continuation 接口。</p><p>而这个过程，我们称之为 CPS 转换：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/1.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>以上的 CPS 转换过程中，函数的类型发生了变化：suspend ()-&gt;String  变成了</span></span>
<span class="line"><span>(Continuation)-&gt; Any?。这意味着，如果你在 Java 里访问一个 Kotlin 挂起函数</span></span>
<span class="line"><span>getUserInfo()，会看到 getUserInfo() 的类型是 (Continuation)-&gt; Object，也就是：接</span></span></code></pre></div><p>收 Continuation 为参数，返回值是 Object。</p><p>而在这里，函数签名的变化可以分为两个部分：函数参数的变化和函数返回值的变化。</p><h3 id="cps-参数变化" tabindex="-1">CPS 参数变化 <a class="header-anchor" href="#cps-参数变化" aria-label="Permalink to &quot;CPS 参数变化&quot;">​</a></h3><p>我们先来看函数参数的变化，suspend() 变成 (Continuation) 的情况，这里我们以第 15 讲当中的代码为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段1</span></span>
<span class="line"><span>suspend fun testCoroutine() {</span></span>
<span class="line"><span>   val user = getUserInfo()</span></span>
<span class="line"><span>   val friendList = getFriendList(user)</span></span>
<span class="line"><span>   val feedList = getFeedList(user, friendList)</span></span>
<span class="line"><span>   log(feedList)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//挂起函数</span></span>
<span class="line"><span>// ↓</span></span>
<span class="line"><span>suspend fun getUserInfo(): String {</span></span>
<span class="line"><span>   withContext(Dispatchers.IO) {</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return &quot;BoyCoder&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//挂起函数</span></span>
<span class="line"><span>// ↓</span></span>
<span class="line"><span>suspend fun getFriendList(user: String): String {</span></span>
<span class="line"><span>   withContext(Dispatchers.IO) {</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return &quot;Tom, Jack&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//挂起函数</span></span>
<span class="line"><span>// ↓</span></span>
<span class="line"><span>suspend fun getFeedList(user: String, list: String): String {</span></span>
<span class="line"><span>   withContext(Dispatchers.IO) {</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return &quot;{FeedList..}&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这段代码，testCoroutine() 是一个挂起函数，它的内部依次调用了三个挂起函数。而如果我们从 Java 的角度来看待 testCoroutine() 的话，代码中所有的参数都会发生变化。如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段2</span></span>
<span class="line"><span>//                 变化在这里</span></span>
<span class="line"><span>//                     ↓</span></span>
<span class="line"><span>fun testCoroutine(continuation: Continuation): Any? {</span></span>
<span class="line"><span>//                          变化在这里</span></span>
<span class="line"><span>//                              ↓</span></span>
<span class="line"><span>   val user = getUserInfo(continuation)</span></span>
<span class="line"><span>//                                        变化在这里</span></span>
<span class="line"><span>//                                            ↓</span></span>
<span class="line"><span>   val friendList = getFriendList(user, continuation)</span></span>
<span class="line"><span>//                                          变化在这里</span></span>
<span class="line"><span>//                                              ↓</span></span>
<span class="line"><span>   val feedList = getFeedList(friendList, continuation)</span></span>
<span class="line"><span>   log(feedList)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可见，在这里的 testCoroutine() 当中，每一次函数调用的时候，continuation 都会作为最后一个参数传到挂起函数里。不过这一步是 Kotlin 编译器帮我们做的，我们开发者是无感知的。还记得第 15 讲我留下的思考题吗：为什么挂起函数可以调用挂起函数，普通函数则不能？</p><p>其实，这个问题的答案，我们从代码段 2 就可以看出来。请想象一下，如果 testCoroutine()只是一个普通函数，那它就不会有 continuation 这个参数了，这样 getUserInfo()、getFriendList()、getFeedList() 这几个挂起函数自然也就无法被调用了。</p><h3 id="cps-返回值变化" tabindex="-1">CPS 返回值变化 <a class="header-anchor" href="#cps-返回值变化" aria-label="Permalink to &quot;CPS 返回值变化&quot;">​</a></h3><p>好，接下来我们看看 getUserInfo() 的返回值类型的变化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段3</span></span>
<span class="line"><span>suspend fun getUserInfo(): String {}</span></span>
<span class="line"><span>//                                  变化在这里</span></span>
<span class="line"><span>//                                     ↓</span></span>
<span class="line"><span>fun getUserInfo(cont: Continuation): Any? {}</span></span></code></pre></div><p>从上面的代码里，可以看到 getUserInfo() 的返回值类型从 String 变成“Any?”。你肯定会好奇，函数原本的 String 返回值难道丢失了吗？如果原本的返回值类型丢失了，那么程序执行难道不会出问题吗？</p><p>其实并不是这样。Kotlin 官方之所以要弄这一套 CPS 转换规则，它必然是“等价转换”。也就是说，String 这个原本的返回值类型肯定不会消失，而是会换一种形式存在。只是 String 存在的形式，经过 Kotlin反编译成 Java 之后会丢失。如果你直接在 Java 当中调用 getUserInfo() 的话，就会发现 String 这个返回值类型成为了 Continuation 的泛型类型。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/2.png" alt=""></a></p><p>所以，对于 getUserInfo() 这个方法，经过 CPS 转换后，它完整的函数签名应该是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段4</span></span>
<span class="line"><span>suspend fun getUserInfo(): String {}</span></span>
<span class="line"><span>//                                变化在这里</span></span>
<span class="line"><span>//                                    ↓</span></span>
<span class="line"><span>fun getUserInfo(cont: Continuation&lt;​String&gt;): Any? {}</span></span></code></pre></div><p>这时候，我们就可以更新第 15 讲当中的那个 CPS 动图了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/3.png" alt=""></a></p><p>好，现在我们知道了，挂起函数原本的返回值类型 String 只是挪了个地方，所以，Kotlin 编译</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>器的 CPS 转换仍然是等价的转换。也就是：suspend () -&gt; String 转换成</span></span>
<span class="line"><span>(Continuation&lt;​String&gt;) -&gt; Any?。不过，这里的“Any?”又是干什么的呢？</span></span></code></pre></div><p>其实，挂起函数经过 CPS 转换后，它的返回值有一个重要作用：标志该挂起函数有没有被挂起。这听起来有点绕：挂起函数，就是可以被挂起的函数，它还能不被挂起吗？</p><p>是的，挂起函数也能不被挂起。</p><p>让我们来理清几个概念。只要有 suspend 修饰的函数，它就是挂起函数，比如我们前面的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段5</span></span>
<span class="line"><span>suspend fun getUserInfo(): String {</span></span>
<span class="line"><span>   withContext(Dispatchers.IO) {</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return &quot;BoyCoder&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当 getUserInfo() 执行到 withContext{} 的时候，就会返回</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CoroutineSingletons.COROUTINE_SUSPENDED 表示函数被挂起了。</span></span></code></pre></div><p>现在问题来了，请问下面这个函数是挂起函数吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段6</span></span>
<span class="line"><span>// suspend 修饰</span></span>
<span class="line"><span>// ↓</span></span>
<span class="line"><span>suspend fun noSuspendFriendList(user: String): String{</span></span>
<span class="line"><span>   // 函数体跟普通函数一样</span></span>
<span class="line"><span>   return &quot;Tom, Jack&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个其实是 noSuspendFriendList() 方法，它的方法体跟普通函数一样。它跟一般的挂起函数有个区别：在执行的时候，它并不会被挂起，因为它就是个普通函数。当你写出以下这样的代码后，IDE 也会提示你，suspend 是多余的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/4.png" alt=""></a></p><p>也就是，当我们调用 noSuspendFriendList() 这个挂起函数的时候，它不会真正挂起，而是会</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>直接返回 String 类型：&quot;no suspend&quot;。针对这样的挂起函数，你可以把它看作是伪挂起函</span></span></code></pre></div><p>数。</p><p>所以到这里，挂起函数经过 CPS 转换后，返回值变成“Any?”的原因也就清晰了：</p><p>由于 suspend 修饰的函数，既可能返回</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CoroutineSingletons.COROUTINE_SUSPENDED，也可能返回实际结果 &quot;no</span></span>
<span class="line"><span>suspend&quot;，甚至可能返回 null，为了适配所有的可能性，CPS 转换后的函数返回值类型就只</span></span>
<span class="line"><span>能是 Any? 了。</span></span></code></pre></div><p>可见我在第 15 讲当中给出的这个 CPS 动图，仅仅只是粗略模拟了协程的 CPS 流程，其中还有很多细节没有体现出来。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/5.png" alt=""></a></p><p>那么，为了让你对挂起函数的底层实现原理有一个更加清晰的认识，接下来，我们来看看挂起函数反编译之后会变成什么样。</p><h2 id="挂起函数的反编译" tabindex="-1">挂起函数的反编译 <a class="header-anchor" href="#挂起函数的反编译" aria-label="Permalink to &quot;挂起函数的反编译&quot;">​</a></h2><p>我们知道，通过查看 Kotlin 反编译后的字节码，可以帮助我们理解 Kotlin 的底层原理。不过，和往常不一样的是，这次我不会直接贴反编译后的代码，因为它的逻辑比较复杂。</p><p>所以，为了方便你理解，接下来我贴出的代码是我用 Kotlin 翻译后大致等价的代码，改善了可读性，抹掉了不必要的细节。当你理解其中的思想后，再去看反编译后的 Java 代码，会更轻松一些。</p><p>好，我们进入正题，这是我们即将研究的对象，testCoroutine() 反编译前的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段7</span></span>
<span class="line"><span>suspend fun testCoroutine() {</span></span>
<span class="line"><span>   log(&quot;start&quot;)</span></span>
<span class="line"><span>   val user = getUserInfo()</span></span>
<span class="line"><span>   log(user)</span></span>
<span class="line"><span>   val friendList = getFriendList(user)</span></span>
<span class="line"><span>   log(friendList)</span></span>
<span class="line"><span>   val feedList = getFeedList(friendList)</span></span>
<span class="line"><span>   log(feedList)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来我们来分析 testCoroutine() 的函数体，它相当复杂，涉及到三个挂起函数的调用。</p><p>首先，在 testCoroutine() 函数里，会多出一个 ContinuationImpl 的子类，它是整个协程挂起函数的核心。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 代码段8</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fun testCoroutine(completion: Continuation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> TestContinuation本质上是匿名内部类</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> TestContinuation(completion: Continuation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) : ContinuationImpl(co</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 表示协程状态机当前的状态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       var label: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">Int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 协程返回结果</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       var result: Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用于保存之前协程的计算结果</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       var mUser: Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       var mFriendList: Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> invokeSuspend 是协程的关键</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 它最终会调用 testCoroutine(this) 开启协程状态机</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 状态机相关代码就是后面的 when 语句</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 协程的本质，可以说就是 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CPS</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 状态机</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       override fun invokeSuspend(_result: Result</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): Any</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           result = _result</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           label = label </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">or</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Int.Companion.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">MIN_VALUE</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> testCoroutine(this)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>代码中的这个 TestContinuation 类，是 Kotlin 编译器帮我们创建的匿名内部类，这里为了方便才用的 TestContinuation 这个名称。在这个类当中定义了几个成员变量：</p><ul><li><p>label 是用来代表协程状态机当中状态的；</p></li><li><p>result 是用来存储当前挂起函数执行结果的；</p></li><li><p>mUser、mFriendList 则是用来存储历史挂起函数执行结果的；</p></li><li><p>invokeSuspend 这个函数，是整个状态机的入口，它会将执行流程转交给 testCoroutine()进行再次调用。</p></li></ul><p>接下来是要判断 testCoroutine 是不是初次运行，如果是初次运行，我们就要创建一个TestContinuation 的实例对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段9</span></span>
<span class="line"><span>//                    ↓</span></span>
<span class="line"><span>fun testCoroutine(completion: Continuation&lt;​Any?&gt;): Any? {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   val continuation = if (completion is TestContinuation) {</span></span>
<span class="line"><span>       completion</span></span>
<span class="line"><span>   } else {</span></span>
<span class="line"><span>       //                作为参数</span></span>
<span class="line"><span>       //                   ↓</span></span>
<span class="line"><span>       TestContinuation(completion)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>也就是：</p><ul><li><p>invokeSuspend 最终会调用 testCoroutine，然后走到这个判断语句；</p></li><li><p>如果是初次运行，会创建一个 TestContinuation 对象，completion 作为参数；</p></li><li><p>这相当于用一个新的 Continuation 包装了旧的 Continuation；</p></li><li><p>如果不是初次运行，直接将 completion 赋值给 continuation；</p></li><li><p>这说明 continuation 在整个运行期间，只会产生一个实例，这能极大地节省内存开销（对比CallBack）。</p></li></ul><p>接下来是几个变量的定义：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段10</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 三个变量，对应原函数的三个变量</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lateinit </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> user</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lateinit </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> friendList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lateinit </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> feedList</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> String</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// result 接收协程的运行结果</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> continuation.result</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// suspendReturn 接收挂起函数的返回值</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> suspendReturn</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Any</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// CoroutineSingletons 是个枚举类</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// COROUTINE_SUSPENDED 代表当前函数被挂起了</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">val sFlag </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CoroutineSingletons.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">COROUTINE_SUSPENDED</span></span></code></pre></div><p>上面的代码，分别代表了函数当中的临时变量、挂起函数执行结果，以及是否挂起的标志位。接着，我们来看看协程状态机的核心逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段11</span></span>
<span class="line"><span>when (continuation.label) {</span></span>
<span class="line"><span>   0 -&gt; {</span></span>
<span class="line"><span>       // 检测异常</span></span>
<span class="line"><span>       throwOnFailure(result)</span></span>
<span class="line"><span>       log(&quot;start&quot;)</span></span>
<span class="line"><span>       // 将 label 置为 1，准备进入下一次状态</span></span>
<span class="line"><span>       continuation.label = 1</span></span>
<span class="line"><span>       // 执行 getUserInfo</span></span>
<span class="line"><span>       suspendReturn = getUserInfo(continuation)</span></span>
<span class="line"><span>       // 判断是否挂起</span></span>
<span class="line"><span>       if (suspendReturn == sFlag) {</span></span>
<span class="line"><span>           return suspendReturn</span></span>
<span class="line"><span>       } else {</span></span>
<span class="line"><span>           result = suspendReturn</span></span>
<span class="line"><span>           //go to next state</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   1 -&gt; {</span></span>
<span class="line"><span>       throwOnFailure(result)</span></span>
<span class="line"><span>       // 获取 user 值</span></span>
<span class="line"><span>       user = result as String</span></span>
<span class="line"><span>       log(user)</span></span>
<span class="line"><span>       // 将协程结果存到 continuation 里</span></span>
<span class="line"><span>       continuation.mUser = user</span></span>
<span class="line"><span>       // 准备进入下一个状态</span></span>
<span class="line"><span>       continuation.label = 2</span></span>
<span class="line"><span>       // 执行 getFriendList</span></span>
<span class="line"><span>       suspendReturn = getFriendList(user, continuation)</span></span>
<span class="line"><span>       // 判断是否挂起</span></span>
<span class="line"><span>       if (suspendReturn == sFlag) {</span></span>
<span class="line"><span>           return suspendReturn</span></span>
<span class="line"><span>       } else {</span></span>
<span class="line"><span>           result = suspendReturn</span></span>
<span class="line"><span>           //go to next state</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   2 -&gt; {</span></span>
<span class="line"><span>       throwOnFailure(result)</span></span>
<span class="line"><span>       user = continuation.mUser as String</span></span>
<span class="line"><span>       // 获取 friendList 的值</span></span>
<span class="line"><span>       friendList = result as String</span></span>
<span class="line"><span>       log(friendList)</span></span>
<span class="line"><span>       // 将协程结果存到 continuation 里</span></span>
<span class="line"><span>       continuation.mUser = user</span></span>
<span class="line"><span>       continuation.mFriendList = friendList</span></span>
<span class="line"><span>       // 准备进入下一个状态</span></span>
<span class="line"><span>       continuation.label = 3</span></span>
<span class="line"><span>       // 执行 getFeedList</span></span>
<span class="line"><span>       suspendReturn = getFeedList(user, friendList, continuation)</span></span>
<span class="line"><span>       // 判断是否挂起</span></span>
<span class="line"><span>       if (suspendReturn == sFlag) {</span></span>
<span class="line"><span>           return suspendReturn</span></span>
<span class="line"><span>       } else {</span></span>
<span class="line"><span>           result = suspendReturn</span></span>
<span class="line"><span>           //go to next state</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   3 -&gt; {</span></span>
<span class="line"><span>       throwOnFailure(result)</span></span>
<span class="line"><span>       user = continuation.mUser as String</span></span>
<span class="line"><span>       friendList = continuation.mFriendList as String</span></span>
<span class="line"><span>       feedList = continuation.result as String</span></span>
<span class="line"><span>       log(feedList)</span></span>
<span class="line"><span>       loop = false</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 testCoroutine() 这个方法体当中，一共调用了三个挂起函数，这三个挂起函数把整个方法体分割成了 4 个部分，这四个部分就是上面 when 表达式当中的 4 种情况。</p><ul><li><p>when 表达式实现了协程状态机；</p></li><li><p>continuation.label 是状态流转的关键，continuation.label 改变一次，就代表了挂起函数被调用了一次；</p></li><li><p>每次挂起函数执行完后，都会检查是否发生异常；</p></li><li><p>testCoroutine 里的原本的代码，被拆分到状态机里各个状态中，分开执行；</p></li><li><p>getUserInfo(continuation)、getFriendList(user, continuation)、getFeedList(friendList,continuation) 三个函数调用的是同一个 continuation 实例；</p></li><li><p>如果一个函数被挂起了，它的返回值会是</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CoroutineSingletons.COROUTINE_SUSPENDED；</span></span></code></pre></div><ul><li>在挂起函数执行的过程中，状态机会把之前的结果以成员变量的方式保存在 continuation中。</li></ul><p>上面这一大串文字和代码看着是不是有点晕？你可以再结合着来看看这个视频演示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/6.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/6.jpeg" alt=""></a></p><p>那到这里是不是就结束了呢？并不，因为这个动画仅演示了每个协程正常挂起的情况。如果协程并没有真正挂起呢？协程状态机会怎么运行？</p><h3 id="协程未挂起的情况" tabindex="-1">协程未挂起的情况 <a class="header-anchor" href="#协程未挂起的情况" aria-label="Permalink to &quot;协程未挂起的情况&quot;">​</a></h3><p>要验证也很简单，我们将其中一个挂起函数改成伪挂起函数即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段12</span></span>
<span class="line"><span>// “伪”挂起函数</span></span>
<span class="line"><span>// 虽然它有 suspend 修饰，但执行的时候并不会真正挂起，因为它函数体里没有其他挂起函数</span></span>
<span class="line"><span>//  ↓</span></span>
<span class="line"><span>suspend fun noSuspendFriendList(user: String): String{</span></span>
<span class="line"><span>   return &quot;Tom, Jack&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>suspend fun testNoSuspend() {</span></span>
<span class="line"><span>   log(&quot;start&quot;)</span></span>
<span class="line"><span>   val user = getUserInfo()</span></span>
<span class="line"><span>   log(user)</span></span>
<span class="line"><span>   //                  变化在这里</span></span>
<span class="line"><span>   //                      ↓</span></span>
<span class="line"><span>   val friendList = noSuspendFriendList(user)</span></span>
<span class="line"><span>   log(friendList)</span></span>
<span class="line"><span>   val feedList = getFeedList(friendList)</span></span>
<span class="line"><span>   log(feedList)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>testNoSuspend() 这样的一个函数体，它反编译后的代码逻辑是怎么样的？</p><p>答案其实很简单，它的结构跟前面的 testCoroutine() 是一致的，只是函数名字变了而已，Kotlin 编译器 CPS 转换的逻辑只认 suspend 关键字。就算挂起函数内部并没有挂起的逻辑，Kotlin 编译器也照样会进行 CPS 转换。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段13</span></span>
<span class="line"><span>when (continuation.label) {</span></span>
<span class="line"><span>   0 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   1 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       //               变化在这里</span></span>
<span class="line"><span>       //                   ↓</span></span>
<span class="line"><span>       suspendReturn = noSuspendFriendList(user, continuation)</span></span>
<span class="line"><span>       // 判断是否挂起</span></span>
<span class="line"><span>       if (suspendReturn == sFlag) {</span></span>
<span class="line"><span>           return suspendReturn</span></span>
<span class="line"><span>       } else {</span></span>
<span class="line"><span>           result = suspendReturn</span></span>
<span class="line"><span>           //go to next state</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   2 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   3 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那 testNoSuspend() 的协程状态机是怎么运行的呢？</p><p>其实我们也很容易能想到，continuation.label = 0, 2, 3 的情况都是不变的，唯独在 label = 1</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>的时候，suspendReturn == sFlag 这里会有区别。</span></span></code></pre></div><p>具体区别我们还是通过动画来看吧：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/7.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/27-%25E5%259B%25BE%25E8%25A7%25A3%25E6%258C%2582%25E8%25B5%25B7%25E5%2587%25BD%25E6%2595%25B0/7.jpeg" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>通过动画我们很清楚地看到了，对于“伪挂起函数”，suspendReturn == sFlag 是会走</span></span></code></pre></div><p>else 分支的，在 else 分支里，协程状态机会直接进入下一个状态。</p><p>现在只剩最后一个问题了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段14</span></span>
<span class="line"><span>if (suspendReturn == sFlag) {</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>   // 具体代码是如何实现的？</span></span>
<span class="line"><span>   //       ↓</span></span>
<span class="line"><span>   //go to next state</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>答案其实也很简单：如果你去看协程状态机的字节码反编译后的 Java，会看到很多 label。协</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>程状态机底层字节码，是通过 label 来实现这个 go to next state 的。由于 Kotlin 没有类</span></span>
<span class="line"><span>似 goto 的语法，下面我用伪代码来表示 go to next state 的逻辑。</span></span>
<span class="line"><span>// 代码段15</span></span>
<span class="line"><span>// 伪代码</span></span>
<span class="line"><span>// Kotlin 没有这样的语法</span></span>
<span class="line"><span>// ↓      ↓</span></span>
<span class="line"><span>label: whenStart</span></span>
<span class="line"><span>when (continuation.label) {</span></span>
<span class="line"><span>   0 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   1 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>       suspendReturn = noSuspendFriendList(user, continuation)</span></span>
<span class="line"><span>       if (suspendReturn == sFlag) {</span></span>
<span class="line"><span>           return suspendReturn</span></span>
<span class="line"><span>       } else {</span></span>
<span class="line"><span>           result = suspendReturn</span></span>
<span class="line"><span>           // 让程序跳转到 label 标记的地方</span></span>
<span class="line"><span>           // 从而再执行一次 when 表达式</span></span>
<span class="line"><span>           goto: whenStart</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   2 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   3 -&gt; {</span></span>
<span class="line"><span>       ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>需要注意的是：以上只是伪代码，它只是跟协程状态机字节码逻辑上“大致等价”。真实的字节码反编译出来的 Java 代码，它的可读性要差很多，也更难理解。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段16</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 看不懂也没关系，有个印象即可</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Nullable</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> final</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testCoroutine</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NotNull</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Continuation $completion) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Object $continuation;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   label37</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ($completion </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">instanceof</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           $continuation </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$completion;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ((((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuation).label </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Integer</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               ((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuation).label </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Integer</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> label37;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       $continuation </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ContinuationImpl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">($completion) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           // $FF: synthetic field</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           Object result;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> label;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           Object L$0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           Object L$1;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Nullable</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> final</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">invokeSuspend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NotNull</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object $</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">result</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">               this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $result;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">               this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.label </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Integer.MIN_VALUE;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> TestSuspendKt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testCoroutine</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Object var10000;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   label31</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       String user;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       String friendList;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       Object var6;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       label30</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           Object $result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuation).res</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           var6 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> IntrinsicsKt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getCOROUTINE_SUSPENDED</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           switch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuation).label) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               case</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   ResultKt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">throwOnFailure</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">($result);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">                   log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;start&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   ((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuation).label </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   var10000 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getUserInfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((Continuation)$continuation);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (var10000 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> var6) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                       return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> var6;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               case</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   ResultKt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">throwOnFailure</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">($result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   var10000 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $result;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               case</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   user </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (String)((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuatio</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   ResultKt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">throwOnFailure</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">($result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   var10000 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $result;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> label30;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               case</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   friendList </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (String)((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$conti</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   user </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (String)((</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​TestSuspendKt$testCoroutine$1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)$continuatio</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   ResultKt.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">throwOnFailure</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">($result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                   var10000 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $result;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> label31;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">               default:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                   throw</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> IllegalStateException</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;call to &#39;resume&#39; before &#39;inv</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           user = (String)var10000;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           log(user);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ((&lt;​TestSuspendKt$testCoroutine$1&gt;)$continuation).L$0 = user;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ((&lt;​TestSuspendKt$testCoroutine$1&gt;)$continuation).label = 2;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           var10000 = getFriendList(user, (Continuation)$continuation);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if (var10000 == var6) {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               return var6;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       friendList = (String)var10000;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       log(friendList);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ((&lt;​TestSuspendKt$testCoroutine$1&gt;)$continuation).L$0 = user;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ((&lt;​TestSuspendKt$testCoroutine$1&gt;)$continuation).L$1 = friendList;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ((&lt;​TestSuspendKt$testCoroutine$1&gt;)$continuation).label = 3;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       var10000 = getFeedList(friendList, (Continuation)$continuation);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if (var10000 == var6) {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           return var6;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   }</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   String feedList = (String)var10000;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   log(feedList);</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   return Unit.INSTANCE;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}</span></span></code></pre></div><p>当然，对于上面反编译出来的 Java 代码，即使你看不懂也没关系，你只需要理解我们前面讲解的逻辑即可。本质上来说，Kotlin 协程就是通过 label 代码段嵌套，配合 switch 巧妙构造出一个状态机结构，这种逻辑比较复杂，相对难懂一些。毕竟 Java 的 label 在实际开发中用的很少。</p><ul><li>注意：Kotlin 挂起函数反编译出来的 Java 代码，会因为实际开发环境的不同出现细微差异。随着 Kotlin 编译器的发展，将来可能会对这部分逻辑进一步优化，但它的核心状态机思想是不会轻易改变的。</li></ul><p>好，到现在，我们就已经彻底弄懂挂起函数的实现原理了。接下来，我们就结合刚刚学习的内容，来进一步思考实战一下。</p><h2 id="思考与实战" tabindex="-1">思考与实战 <a class="header-anchor" href="#思考与实战" aria-label="Permalink to &quot;思考与实战&quot;">​</a></h2><p>在上节课我曾提到过，Kotlin 协程的源代码其实分为三层，其中基础层当中的“基础概念”尤为重要。那么，Kotlin 官方为我们提供了哪些与挂起函数相关的基础元素呢？</p><p>我们首先想到的，肯定就是Continuation.kt，在这里面，确实也可以找到一些跟挂起函数相关的基础元素。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段17</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Continuation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val context</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CoroutineContext</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">resumeWith</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">result</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: Result&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Suppress</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;WRONG_MODIFIER_TARGET&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> suspend inline val coroutineContext</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CoroutineContext</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       throw</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> NotImplementedError</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Implemented as intrinsic&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span></code></pre></div><p>在上面的代码中，我们最熟悉的就是 Continuation 这个接口了，除此之外，还有一个顶层的变量值得我们注意：suspend inline val coroutineContext。要知道，我们从来都是用suspend 修饰函数的，从未见过 suspend 修饰变量的情况。</p><p>如果我们依葫芦画瓢，创建一个类似的顶层变量的话，编译器甚至会报错：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段18</span></span>
<span class="line"><span>// 报错</span></span>
<span class="line"><span>public suspend inline val test: CoroutineContext</span></span>
<span class="line"><span>   get() = TODO()</span></span></code></pre></div><p>由此可见，suspend 的这种用法只是一种特殊用法。结合“public suspend inline val”这几个关键字来看，我们其实可以大致推测出它的作用：它是一个只有在挂起函数作用域下，才能访问的顶层的不可变的变量。这里的 inline，意味着它的具体实现会被直接复制到代码的调用处。</p><h3 id="_17-讲思考题解答" tabindex="-1">17 讲思考题解答 <a class="header-anchor" href="#_17-讲思考题解答" aria-label="Permalink to &quot;17 讲思考题解答&quot;">​</a></h3><p>为了验证我们前面的猜测，我们可以回过头来看看第 17 讲的思考题：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 代码段19</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kotlinx.coroutines.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kotlin.coroutines.coroutineContext</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                        挂起函数能可以访问协程上下文吗？</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                                 ↓</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">suspend fun testContext() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> coroutineContext</span></span></code></pre></div><p>如果你将上面的代码反编译成 Java 的话，它就会变成这样：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段20</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> final</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">testContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Continuation $completion) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $completion.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>由此可见，代码段 17 当中的“suspend inline val coroutineContext”，本质上就是 Kotlin 官方提供的一种方便开发者在挂起函数当中，获取协程上下文的手段。它的具体实现，其实是Kotlin 编译器来完成的。</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 代码段19</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kotlinx.coroutines.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kotlin.coroutines.coroutineContext</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                  Continuation当中的coroutineContext</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                                 ↓</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">suspend fun testContext() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> coroutineContext</span></span></code></pre></div><p>到这里，你就会发现一个有趣的现象：我们在挂起函数当中无法直接访问 Continuation 对象，但可以访问到 Continuation 当中的 coroutineContext。要知道，正常情况下，我们想要访问 Continuation.coroutineContext，首先是要拿到 Continuation 对象的。</p><p>但是，Kotlin 官方通过“suspend inline val coroutineContext”这个顶层变量，让我们开发者能直接拿到 coroutineContext，却对 Continuation 毫无感知。</p><p>所以到这里，我们其实也就可以回答第 17 节课思考题的问题了。</p><ul><li>课程里，我提到了“挂起函数”与 CoroutineContext 也有着紧密的联系，请问，你能找到具体的证据吗？</li></ul><p>解答：挂起函数与 CoroutineContext 确实有着紧密的联系。每个挂起函数当中都会有Continuation，而每个 Continuation 当中都会有 coroutineContext。并且，我们在挂起函数当中，就可以直接访问当前的 coroutineContext。</p><h3 id="kthttp-支持挂起函数" tabindex="-1">KtHttp 支持挂起函数 <a class="header-anchor" href="#kthttp-支持挂起函数" aria-label="Permalink to &quot;KtHttp 支持挂起函数&quot;">​</a></h3><p>在第 18 讲当中，我们并没有让 KtHttp 直接支持挂起函数，当时我们的做法是给 KtCall 扩展了一个 await() 方法，从而实现挂起函数调用的。</p><p>那么，经过这节课的学习，我们就可以来尝试让 KtHttp 直接支持挂起函数了，也就是我们可以这样来写代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface ApiServiceV7 {</span></span>
<span class="line"><span>   @GET(&quot;/repo&quot;)</span></span>
<span class="line"><span>   // 1，挂起函数</span></span>
<span class="line"><span>   suspend fun reposSuspend(</span></span>
<span class="line"><span>       @Field(&quot;lang&quot;) lang: String,</span></span>
<span class="line"><span>       @Field(&quot;since&quot;) since: String</span></span>
<span class="line"><span>   ): RepoList</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>       // 省略</span></span>
<span class="line"><span>       return when {</span></span>
<span class="line"><span>       isSuspend(method) -&gt; {</span></span>
<span class="line"><span>           // 2，支持挂起函数</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 3，判断是不是挂起函数</span></span>
<span class="line"><span>private fun isSuspend(method: Method) = method.kotlinFunction?.isSuspend ?: false</span></span>
<span class="line"><span>// 4，真正执行网络请求的方法</span></span>
<span class="line"><span>suspend fun &lt;​T: Any&gt; realCall(call: Call, gson: Gson, type: Type): T = suspendCan</span></span>
<span class="line"><span>   call.enqueue(object : Callback {</span></span>
<span class="line"><span>       override fun onFailure(call: Call, e: IOException) {</span></span>
<span class="line"><span>           continuation.resumeWithException(e)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       override fun onResponse(call: Call, response: okhttp3.Response) {</span></span>
<span class="line"><span>           try {</span></span>
<span class="line"><span>               val t = gson.fromJson&lt;​T&gt;(response.body?.string(), type)</span></span>
<span class="line"><span>               continuation.resume(t)</span></span>
<span class="line"><span>           } catch (e: Exception) {</span></span>
<span class="line"><span>               continuation.resumeWithException(e)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   })</span></span>
<span class="line"><span>   continuation.invokeOnCancellation {</span></span>
<span class="line"><span>       call.cancel()</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码一共有 4 个注释，我们一个个看：</p><ul><li><p>注释 1，这其实就是我们希望达到的效果，可以在 ApiServiceV 接口当中直接定义挂起函数。</p></li><li><p>注释 2，在 KtHttp 6.0 版本的基础上，我们在 invoke() 的 when 表达式里增加了一个分支：isSuspend()。</p></li><li><p>注释 3，isSuspend() 的实现有一个细节，这里我们使用了“method.kotlinFunction”，将Java 的 method 转换成了 kotlinFunction，这样一来，它就变成了一个 Kotlin 反射的对象了。因此，我们就可以查询到一些 Kotlin 相关的信息，比如说，它是不是一个挂起函数。</p></li><li><p>注释 4，为了直接在挂起函数里执行网络请求，我们将 KtCall 当中的部分代码逻辑挪了进来。这个 realCall() 方法，它被定义成了一个挂起函数。</p></li></ul><p>基于以上的分析，我们其实只需要借助反射，完成注释 2 处的代码逻辑，然后调用 realCall()这个挂起函数就行了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>       // 省略</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isSuspend(method) -&gt; {</span></span>
<span class="line"><span>           // 1，反射获取类型信息</span></span>
<span class="line"><span>           // 2，调用realCall()</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以，接下来我们要做的事情大致可以分为两个部分。</p><p>第一个部分，获取类型信息，准备请求网络，这个部分其实很简单。但在第二个部分“支持挂起函数”这里会遇到问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>       // 省略</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isSuspend(method) -&gt; {</span></span>
<span class="line"><span>           // 支持挂起函数</span></span>
<span class="line"><span>           val genericReturnType = method.kotlinFunction?.returnType?.javaType ?</span></span>
<span class="line"><span>           val call = okHttpClient!!.newCall(request)</span></span>
<span class="line"><span>           // 报错！！</span></span>
<span class="line"><span>           realCall&lt;​T&gt;()</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码报错的原因也很容易理解，realCall() 是一个挂起函数，它无法在普通函数里被调用！所以这里我们就面临了一个问题：如何在普通 Kotlin 函数当中调用挂起函数？</p><p>那么，我们首先可以想到的解决办法，就是强制类型转换：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>       // 省略</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isSuspend(method) -&gt; {</span></span>
<span class="line"><span>           // 支持挂起函数</span></span>
<span class="line"><span>           val genericReturnType = method.kotlinFunction?.returnType?.javaType ?</span></span>
<span class="line"><span>           val call = okHttpClient!!.newCall(request)</span></span>
<span class="line"><span>           val continuation = args.last() as? Continuation&lt;​T&gt;</span></span>
<span class="line"><span>           // 1，将挂起函数类型转换成，带Continuation的类型，报错</span></span>
<span class="line"><span>           val func = ::realCall as (Call, Gson, Type, Continuation&lt;​T&gt;?) -&gt; Any?</span></span>
<span class="line"><span>           func.invoke(call, gson, genericReturnType, continuation)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>请留意代码中的注释 1，我们尝试使用“函数引用”的方式，将 realCall() 转换成了带有Continuation 的函数类型，这样我们就可以通过传入 Continuation，来调用 realCall() 这个挂起函数了。</p><p>不过，事与愿违，我们的方法并不能奏效，因为这行代码会报错，原因是 realCall() 带有泛型，而 Kotlin 暂时不支持“函数引用带泛型”的语法。</p><p>所以在这里，为了让这个 Demo 能运行起来，我们可以定义一个临时方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>       // 省略</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isSuspend(method) -&gt; {</span></span>
<span class="line"><span>           // 支持挂起函数</span></span>
<span class="line"><span>           val genericReturnType = method.kotlinFunction?.returnType?.javaType ?</span></span>
<span class="line"><span>           val call = okHttpClient!!.newCall(request)</span></span>
<span class="line"><span>           val continuation = args.last() as? Continuation&lt;​T&gt;</span></span>
<span class="line"><span>           // 1，使用临时方法消除泛型</span></span>
<span class="line"><span>           val func = ::temp as (Call, Gson, Type, Continuation&lt;​T&gt;?) -&gt; Any?</span></span>
<span class="line"><span>           func.invoke(call, gson, genericReturnType, continuation)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>suspend fun temp(call: Call, gson: Gson, type: Type) = realCall&lt;​RepoList&gt;(call, g</span></span></code></pre></div><p>在上面的代码中，我们使用了一个临时方法消除了泛型 T，写死了返回值类型 RepoList。这样的代码，在 Demo 当中是可以运行的，这从侧面也能印证我们上面代码中的类型转换是成功的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val data: RepoList = KtHttpV7.create(ApiServiceV7::class.java).reposSuspend(</span></span>
<span class="line"><span>       lang = &quot;Kotlin&quot;,</span></span>
<span class="line"><span>       since = &quot;weekly&quot;</span></span>
<span class="line"><span>   )</span></span>
<span class="line"><span>   println(data)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果正常</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*/</span></span></code></pre></div><p>不过，这种做法明显不具备普适性，为了让 KtHttp 支持所有类型的 API 请求，我们必须要想其他的办法。具体来说，我们可以这样做：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private fun &lt;​T : Any&gt; invoke(path: String, method: Method, args: Array&lt;​Any&gt;): Any</span></span>
<span class="line"><span>       // 省略</span></span>
<span class="line"><span>   return when {</span></span>
<span class="line"><span>       isSuspend(method) -&gt; {</span></span>
<span class="line"><span>           // 支持挂起函数</span></span>
<span class="line"><span>           val genericReturnType = method.kotlinFunction?.returnType?.javaType ?</span></span>
<span class="line"><span>           val call = okHttpClient!!.newCall(request)</span></span>
<span class="line"><span>           val continuation = args.last() as? Continuation&lt;​T&gt;</span></span>
<span class="line"><span>           val func = KtHttpV7::class.getGenericFunction(&quot;realCall&quot;)</span></span>
<span class="line"><span>           // 反射调用realCall()</span></span>
<span class="line"><span>           func.call(this, call, gson, genericReturnType, continuation)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isKtCallReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       isFlowReturn(method) -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       else -&gt; {</span></span>
<span class="line"><span>           // 省略</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 2，获取方法的反射对象</span></span>
<span class="line"><span>fun KClass&lt;*&gt;.getGenericFunction(name: String): KFunction&lt;*&gt; {</span></span>
<span class="line"><span>       return members.single { it.name == name } as KFunction&lt;*&gt;</span></span>
<span class="line"><span>   }</span></span></code></pre></div><p>其实，这种思路跟前面的思路是类似的，我们仍然是对 realCall() 的类型进行了转换，只不过是通过反射来实现的而已。所以最重要的，我们还是要弄清楚 Kotlin 挂起函数 CPS 转换的细节。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这节课，我们通过研究挂起函数的反编译代码，发现了 Kotlin 的挂起函数，本质上就是一个状态机。其中主要涉及到下面几个知识点，我们需要重点掌握好。</p><ul><li>Kotlin 挂起函数的 CPS 转换，它的函数签名变化主要分为两个部分，第一部分是参数的变化，挂起函数经过 Kotlin 编译器转换以后，它会多出一个 Continuation 类型的参数。第二部分是返回值类型的变化，挂起函数原本的返回值类型，会被挪到 Continuation 当中作为</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>泛型参数，比如 Continuation&lt;​String&gt;，而转换过后的函数返回值类型会变</span></span></code></pre></div><ul><li><p>成“Any?”类型。</p></li><li><p>当挂起函数经过反编译以后，它会变成由 switch 和 label 组成的状态机结构。</p></li><li><p>为了便于研究，课程里提供了大致等价的协程状态机代码：其中，when 表达式实现了协程状态机，而 continuation.label 则代表了当前状态机的具体状态，continuation.label 改变一</p></li><li><p>次，就代表了挂起函数被调用了一次；</p></li><li><p>在一个挂起函数被调用的时候，它的返回值可能是具体的结果，也可能会是</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CoroutineSingletons.COROUTINE_SUSPENDED，这时候就代表了这个函数被挂起</span></span></code></pre></div><ul><li>了。</li></ul><p>另外在这节课里，我们还进行了一次反思和实战，通过研究协程基础层当中的“suspend inlineval coroutineContext”这个顶层变量，我们发现了挂起函数与协程上下文之间的紧密联系。并且，我们还灵活运用了这节课学到的知识，进一步改进了 KtHttp，让它可以直接支持挂起函数。</p><p>你在自己的工作场景当中，其实也可以通过这样思考与实战的方式，来进一步强化所学和所得，甚至可以把输入转化成输出，把知识真正沉淀成你自己的东西。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>我们都知道挂起函数是 Kotlin 协程里才有的概念，请问，Java 代码中可以调用 Kotlin 的挂起函数吗？比如，下面这个函数，我们可以在 Java 当中调用吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>object SuspendFromJavaExample {</span></span>
<span class="line"><span>   // 在Java当中如何调用这个方法？</span></span>
<span class="line"><span>   suspend fun getUserInfo(id: Long):String {</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>       return &quot;Kotlin&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,154)])])}const E=n(l,[["render",t]]);export{d as __pageData,E as default};
