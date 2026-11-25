import{_ as a,H as n,f as i,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"16-Job：协程也有生命周期吗？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Job 生命周期","slug":"job-生命周期","link":"#job-生命周期","children":[]},{"level":2,"title":"Deferred","slug":"deferred","link":"#deferred","children":[]},{"level":2,"title":"Job 与结构化并发","slug":"job-与结构化并发","link":"#job-与结构化并发","children":[]},{"level":2,"title":"思考与实战","slug":"思考与实战","link":"#思考与实战","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"朱涛·Kotlin编程第一课/16-Job：协程也有生命周期吗？.md","filePath":"朱涛·Kotlin编程第一课/16-Job：协程也有生命周期吗？.md","lastUpdated":1795558358000}'),l={name:"朱涛·Kotlin编程第一课/16-Job：协程也有生命周期吗？.md"};function e(t,s,h,k,o,c){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="_16-job-协程也有生命周期吗" tabindex="-1">16-Job：协程也有生命周期吗？ <a class="header-anchor" href="#_16-job-协程也有生命周期吗" aria-label="Permalink to &quot;16-Job：协程也有生命周期吗？&quot;">​</a></h1><p>你好，我是朱涛。今天我们来学习 Kotlin 协程的 Job。</p><p>Job 其实就是协程的句柄。从某种程度上讲，当我们用 launch 和 async 创建一个协程以后，同时也会创建一个对应的 Job 对象。另外，Job 也是我们理解协程生命周期、结构化并发的关键知识点。通过 Job 暴露的 API，我们还可以让不同的协程之间互相配合，从而实现更加复杂的功能。</p><p>虽然前面已经解释过，Job 就是协程的句柄，但你可能还是不清楚它到底是什么，因为句柄本身就是一个比较“虚”的概念。所以在这节课中，我们会从使用的角度入手，来看看 Job 到底能干什么。在充分理解了 Job 的用法以后，我们再来结合它的源代码进一步分析，这样对 Job也会有一个更加清晰的认知。</p><h2 id="job-生命周期" tabindex="-1">Job 生命周期 <a class="header-anchor" href="#job-生命周期" aria-label="Permalink to &quot;Job 生命周期&quot;">​</a></h2><p>在上节课我们学习 launch、async 的时候，我们知道它们两个返回值类型分别是 Job 和Deferred。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Deferred</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">out</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; : Job {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> suspend fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>而如果你去看 Deferred 的源代码，你会发现，它其实也是继承自 Job 的。对应的，它只是多了一个泛型参数 T，还多了一个返回类型为 T 的 await() 方法。所以，不管是 launch 还是async，它们本质上都会返回一个 Job 对象。</p><p>通过 Job 对象，我们主要可以做两件事情：</p><ul><li><p>使用 Job 监测协程的生命周期状态；</p></li><li><p>使用 Job 操控协程。</p></li></ul><p>让我们来看一个具体的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段2</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val job = launch {</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   job.log()       // ①</span></span>
<span class="line"><span>   job.cancel()    // ②</span></span>
<span class="line"><span>   job.log()       // ③</span></span>
<span class="line"><span>   delay(1500L)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>* 打印Job的状态信息</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>fun Job.log() {</span></span>
<span class="line"><span>   logX(&quot;&quot;&quot;</span></span>
<span class="line"><span>       isActive = $isActive</span></span>
<span class="line"><span>       isCancelled = $isCancelled</span></span>
<span class="line"><span>       isCompleted = $isCompleted</span></span>
<span class="line"><span>   &quot;&quot;&quot;.trimIndent())</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>* 控制台输出带协程信息的log</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>fun logX(any: Any?) {</span></span>
<span class="line"><span>   println(&quot;&quot;&quot;</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>$any</span></span>
<span class="line"><span>Thread:\${Thread.currentThread().name}</span></span>
<span class="line"><span>================================&quot;&quot;&quot;.trimIndent())</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>isActive = true</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = true</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>在这段代码当中，我们定义了一个 Job.log() 扩展函数，它的作用就是打印 Job 的生命周期状态。通过调用这个函数，我们就可以知道对应的协程处于什么状态。</p><p>注释①处的调用结果，“isActive = true”，这代表了当前的协程处于活跃状态。注释②，我们调用了 job.cancel() 以后，协程任务就会被取消。因此，注释③处的调用结果就会变成“isCancelled = true”，这代表了协程任务处于取消状态。</p><p>所以从上面的代码中，我们可以看到：job.log()，其实就是在监测协程；job.cancel()，其实就是在操控协程。</p><p>而除了 job.cancel() 可以操控协程以外，我们还经常使用 job.start() 来启动协程任务，一般来说，它都是搭配“CoroutineStart.LAZY”来使用的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段3</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   //                  变化在这里</span></span>
<span class="line"><span>   //                      ↓</span></span>
<span class="line"><span>   val job = launch(start = CoroutineStart.LAZY) {</span></span>
<span class="line"><span>       logX(&quot;Coroutine start!&quot;)</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   delay(500L)</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   job.start()     // 变化在这里</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   delay(500L)</span></span>
<span class="line"><span>   job.cancel()</span></span>
<span class="line"><span>   delay(500L)</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   delay(2000L)</span></span>
<span class="line"><span>   logX(&quot;Process end!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = true</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine start!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = true</span></span>
<span class="line"><span>isCompleted = true</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>根据以上代码的运行结果，可以发现，当我们使用 CoroutineStart.LAZY 作为启动模式的时候，协程任务被 launch 以后，并不会立即执行，即使我们在代码中 delay 了 500 毫秒，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>launch 内部的&quot;Coroutine start!&quot;也仍然没有输出。这是典型的懒加载行为模式。</span></span></code></pre></div><p>当我们在外部调用了 job.start() 以后，job 的状态才变成了 Active 活跃。而当调用了 cancel 以后，job 的状态才变成 isCancelled、isCompleted。</p><p>到这里，我们基本上就可以想象出 Job 整个的生命周期了。请参考下面这张图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/1.png" alt=""></a></p><p>从图中，我们可以看到，对于协程的 Job 来说，它有两种初始状态，如果 Job 是以懒加载的方式创建的，那么它的初始状态将会是 New；而如果一个协程是以非懒加载的方式创建的，那么它的初始状态就会是 Active。</p><p>另外如果你仔细分析了上面代码的输出结果，你会发现，当调用 cancel 以后，会出现一个奇怪的现象：isCancelled = true、isCompleted = true。也就是说，当协程任务被取消以后，isCancelled 和 isCompleted 同时都是 true。但这跟上面的流程图并不一致啊！这是为什么呢？</p><p>这是因为，协程认为由于某种原因取消的协程，也仍然是一种“结束状态”，这其实也就对应了流程图中的“最终状态”。</p><p>换句话说，流程图当中的 New、Active、Completing、Cancelling、Completed、Cancelled这些状态，都是 Job 内部私有的状态。而 Job 对外暴露出的 isCompleted 并不是与其一一对应的。Job 内部私有的 Completed、Cancelled 状态，都会认为是外部的 isCompleted 状态。</p><p>测试了协程 cancel() 方法以后，我们再来看看协程正常执行完毕的情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段4</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val job = launch(start = CoroutineStart.LAZY) {</span></span>
<span class="line"><span>       logX(&quot;Coroutine start!&quot;)</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   delay(500L)</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   job.start()</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   delay(1100L)    // ①</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   delay(2000L)    // ②</span></span>
<span class="line"><span>   logX(&quot;Process end!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = true</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine start!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = true</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span></code></pre></div><p>在这段代码中，我们可以清晰地看到，协程的状态从 Start 到 Active，最后到 Completed，这很好理解。</p><p>不过，需要注意的是注释①处，为了等待 job 任务执行完毕，我们在外面等待了 1100 毫秒，这种方式其实并不好，因为大部分情况下，我们很难从外部判断协程需要多长的时间才能结束（比如网络请求任务、下载任务）。</p><p>另外，请留意上面的注释②处，我们使用 delay(2000L) 的方式，希望在 job 执行完毕以后输出“Process end!”，这样的代码，也是建立在“我们知道 Job 只需要 1000 毫秒就能执行完毕”的前提。如果协程内部的 delay 远大于外部的 delay，以上的运行结果就会完全不一样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段5</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val job = launch(start = CoroutineStart.LAZY) {</span></span>
<span class="line"><span>       logX(&quot;Coroutine start!&quot;)</span></span>
<span class="line"><span>       delay(4000L) // 变化在这里</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   delay(500L)</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   job.start()</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   delay(1100L)</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   delay(2000L)</span></span>
<span class="line"><span>   logX(&quot;Process end!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = true</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine start!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = true</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>到这里，job仍然还在delay，整个程序并没有完全退出。</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>可以看到，当我们将 job 内部的 delay 改为 4000 毫秒以后，执行结果就完全不一样了，我们无法监测到 isCompleted 状态。</p><p>另外，如果你实际运行了上面的代码，你会发现“Process end!”输出以后，程序并没有立即结束，而是等待了大约 900 毫秒才结束，这是因为 runBlocking 会一直阻塞，等到 job 任务执行完毕以后才真正退出。</p><p>所以，为了更加灵活地等待和监听协程的结束事件，我们可以用 job.join() 以及</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>invokeOnCompletion {} 来优化上面的代码。</span></span>
<span class="line"><span>// 代码段6</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   suspend fun download() {</span></span>
<span class="line"><span>       // 模拟下载任务</span></span>
<span class="line"><span>       val time = (Random.nextDouble() * 1000).toLong()</span></span>
<span class="line"><span>       logX(&quot;Delay time: = $time&quot;)</span></span>
<span class="line"><span>       delay(time)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   val job = launch(start = CoroutineStart.LAZY) {</span></span>
<span class="line"><span>       logX(&quot;Coroutine start!&quot;)</span></span>
<span class="line"><span>       download()</span></span>
<span class="line"><span>       logX(&quot;Coroutine end!&quot;)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   delay(500L)</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   job.start()</span></span>
<span class="line"><span>   job.log()</span></span>
<span class="line"><span>   job.invokeOnCompletion {</span></span>
<span class="line"><span>       job.log() // 协程结束以后就会调用这里的代码</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   job.join()      // 等待协程执行完毕</span></span>
<span class="line"><span>   logX(&quot;Process end!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>运行结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = true</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = false</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine start!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Delay time: = 252</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine end!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>isActive = false</span></span>
<span class="line"><span>isCancelled = false</span></span>
<span class="line"><span>isCompleted = true</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>这里我们可以看到，invokeOnCompletion {} 的作用，其实就是监听协程结束的事件。需</span></span>
<span class="line"><span>要注意的是，它和前面的 isCompleted 类似，如果 job 被取消了，invokeOnCompletion</span></span>
<span class="line"><span>{} 这个回调仍然会被调用。</span></span></code></pre></div><p>而 job.join() 其实是一个“挂起函数”，它的作用就是：挂起当前的程序执行流程，等待 job 当中的协程任务执行完毕，然后再恢复当前的程序执行流程。可以看到，上节课学的“挂起函数”的概念再一次出现了，它对我们后续理解协程的 API 非常重要，如果你无法理解上面那句话的意思，一定要去重新回顾上节课的内容。</p><p>至此，我们就对 Job 的两种使用场景都已经有了充分认识了。我们来大概看看 Job 的源代码：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段7</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : CoroutineContext.Element {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // ------------ 状态查询API ------------</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val isActive</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Boolean</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val isCompleted</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Boolean</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val isCancelled</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Boolean</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getCancellationException</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): CancellationException</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // ------------ 操控状态API ------------</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): Boolean</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cancel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">cause</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">CancellationException</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">? = </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cancel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): Unit = </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cancel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cancel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">cause</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">Throwable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">? = </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): Boolean</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // ------------ 等待状态API ------------</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> suspend fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val onJoin: SelectClause0</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // ------------ 完成状态回调API ------------</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">invokeOnCompletion</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">handler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">CompletionHandler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): DisposableHandle</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">invokeOnCompletion</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       onCancelling</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">Boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> = </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       invokeImmediately</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">Boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> = </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">       handler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">CompletionHandler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): DisposableHandle</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>可见，Kotlin 官方对 Job 的 API 做了更加详细的划分，但实际上来说都属于“监测状态”“操控状态”这两个大的范畴。</p><p>现在我们对 Job 也有了更加深入的认识了，不过到底该如何理解“Job 是协程的句柄”这句话呢？</p><p>这里，我们还是可以从现实生活中找例子，来建立大致的思维模型。Job 和协程的关系，就有点像“遥控器和空调的关系”。</p><ul><li><p>空调遥控器可以监测空调的运行状态；Job 也可以监测协程的运行状态；</p></li><li><p>空调遥控器可以操控空调的运行状态，Job 也可以简单操控协程的运行状态。</p></li></ul><p>所以，从某种程度来讲，遥控器也是空调对外暴露的一个“句柄”。</p><p>好，充分理解了 Job 以后，我们来看看 Deferred。</p><h2 id="deferred" tabindex="-1">Deferred <a class="header-anchor" href="#deferred" aria-label="Permalink to &quot;Deferred&quot;">​</a></h2><p>前面我们介绍过 Deferred 其实就是继承自 Job 的一个接口，它并没有在 Job 的基础上扩展出很多其他功能，最重要的就是 await() 这个方法。让我们来看一个简单的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段8</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val deferred = async {</span></span>
<span class="line"><span>       logX(&quot;Coroutine start!&quot;)</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>       logX(&quot;Coroutine end!&quot;)</span></span>
<span class="line"><span>       &quot;Coroutine result!&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   val result = deferred.await()</span></span>
<span class="line"><span>   println(&quot;Result = $result&quot;)</span></span>
<span class="line"><span>   logX(&quot;Process end!&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine start!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Coroutine end!</span></span>
<span class="line"><span>Thread:main @coroutine#2</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Result = Coroutine result!</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>从代码的执行结果中，我们可以发现，deferred.await() 这个方法，不仅可以帮助我们获取协程的执行结果，它还会阻塞当前协程的执行流程，直到协程任务执行完毕。在这一点的行为上，await() 和 join() 是类似的。</p><p>我们也来看看 await() 的函数签名：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段9</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Deferred</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">out</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; : Job {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//          注意这里</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//            ↓</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> suspend fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>可以看到，await() 这个方法其实是一个挂起函数，这也就意味着，这个方法拥有挂起和恢复的能力。如果当前的 Deferred 任务还没执行完毕，那么，await() 就会挂起当前的协程执行流程，等待 Deferred 任务执行完毕，再恢复执行后面剩下的代码。</p><p>看到这里，也许你会觉得奇怪，挂起函数不是非阻塞的吗？怎么这里又出现了阻塞？注意，这里其实只是看起来像是阻塞了，但它实际上是将剩下的代码存了起来，留在后面才执行了。</p><p>为了让你更加透彻地理解 await() 挂起函数背后的细节，我进一步完善了之前协程思维模型的动图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/2.png" alt=""></a></p><p>所以，这里 await() 后面的代码，虽然看起来是阻塞了，但它只是执行流程被挂起和恢复的一种表现。而且如果你仔细思考的话，你会发现上面这个动图，同样也描述了之前 job.join() 的行为模式，在协程执行完毕之前，后面的协程代码都被暂时挂起了，等到协程执行完毕，才有机会继续执行。</p><p>所以，总的来说，Deferred 只是比 Job 多了一个 await() 挂起函数而已，通过这个挂起函数，我们可以等待协程执行完毕的同时，还可以直接拿到协程的执行结果。</p><p>至此，我们就已经把 Job 和 Deferred 的生命周期讲清楚了。对于 Job，我们了解了监测生命周期状态、操控生命周期状态；对于 Deferred，我们也明白了如何拿到它的执行结果。</p><p>那么接下来，就只剩下一个话题了：结构化并发。</p><h2 id="job-与结构化并发" tabindex="-1">Job 与结构化并发 <a class="header-anchor" href="#job-与结构化并发" aria-label="Permalink to &quot;Job 与结构化并发&quot;">​</a></h2><p>也许你会经常看到类似这样的话：协程的优势在于结构化并发。在我看来，Kotlin 协程的结构化并发，它的重要性，是仅次于“挂起函数”的。</p><p>也就是说，“结构化并发”是 Kotlin 协程的第二大优势。那么，到底什么是结构化并发呢？其实，这是一个非常大的话题，三言两语真的很难讲清楚。“结构化并发”会贯穿我们整个课程，随着课程的进展，你会发现，它跟很多其他协程概念都会发生牵连。</p><p>简单来说，“结构化并发”就是：带有结构和层级的并发。</p><p>说实话，在抽象的概念面前，语言和文字总会显得苍白无力。所以，我们还是来看一个具体的例子吧。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段10</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runBlocking {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   val </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">parentJob</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: Job</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> job1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> job2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> job3</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   parentJob </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       job1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(1000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       job2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(3000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       job3 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(5000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(500</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   parentJob.children.forEachIndexed { index, job </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">       when</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (index) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;job1 === job is \${job1 === job}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;job2 === job is \${job2 === job}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;job3 === job is \${job3 === job}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   parentJob.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 这里会挂起大约5秒钟</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Process end!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>job1 === job is true</span></span>
<span class="line"><span>job2 === job is true</span></span>
<span class="line"><span>job3 === job is true</span></span>
<span class="line"><span>// 等待大约5秒钟</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>在上面的代码中，我们一共定义了 4 个 Job，parentJob 是最外层的 launch 返回的对象，而在这个 launch 的内部，还额外嵌套了三个 launch，它们的 Job 对象分别赋值给了 job1、job2、job3。</p><p>接着，我们对“parentJob.children”进行了遍历，然后逐一对比了它们与 job1、job2、job3 的引用是否相等（“===”代表了引用相等，即是否是同一个对象）。</p><p>通过这样的方式，我们可以确定，job1、job2、job3 其实就是 parentJob 的 children。也就是说，我们使用 launch 创建出来的协程，是存在父子关系的。</p><p>如果你去看 Job 的源代码，你会发现它还有两个 API 是用来描述父子关系的。</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段11</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : CoroutineContext.Element {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 省略部分代码</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // ------------ parent-child ------------</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> val children</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Sequence&lt;​</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Job</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">InternalCoroutinesApi</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">attachChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">child</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ChildJob</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): ChildHandle</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>可以看到，每个 Job 对象，都会有一个 children 属性，它的类型是 Sequence，它是一个惰性的集合，我们可以对它进行遍历。而 attachChild() 则是一个协程内部的 API，用于绑定ChildJob 的，这个我们到源码篇的时候再深入了解。</p><p>所以，我们其实可以用一个简单的结构图来描述上面 4 个 Job 之间的关系：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/3.png" alt=""></a></p><p>那么，这样的父子关系到底意味着什么呢？如果你实际运行这里的代码，你就会注意到：“parentJob.join()”这行代码会被挂起大约 5 秒钟。</p><p>注意了，我们调用的是 parentJob 的 join() 方法，但是，它会等待其内部的 job1、job2、job3全部执行完毕，才会恢复执行。换句话说，只有当 job1、job2、job3 全部执行完毕，parentJob 才算是执行完毕了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/4.png" alt=""></a></p><p>所以到这里，也许你就已经可以理解前面的那句话了：结构化并发就是带有结构和层级的并发。</p><p>实际上，协程不像我们之前学过的线程，线程之间是不存在父子关系的，但协程之间是会存在父子关系的。不过要命的是，协程的这种父子关系并不明显，如果我们不深入 Job 的源码，就无法意识到这一点。这也是很多人无法理解协程运行模式的原因所在。</p><p>毕竟，如果你将上面的 4 个 launch 都割裂来看，那么无论如何，你都无法理解上面代码的运行顺序，可是一旦你建立了协程 Job 父子关系的思维模型，你就可以轻而易举地理解以上的代码。</p><p>现在，我们将上面的代码做一些修改，我相信你也可以马上弄明白它的运行模式！</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 代码段12</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fun </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runBlocking {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   val </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">parentJob</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: Job</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> job1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> job2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> job3</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Job</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   parentJob </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       job1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Job1 start!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(1000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Job1 done!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ①，不会执行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       job2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Job2 start!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(3000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Job2 done!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ②，不会执行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       job3 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> launch {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Job3 start!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(5000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">           logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Job3 done!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ③，不会执行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   delay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(500</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">L</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   parentJob.children.forEachIndexed { index, job </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">       when</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (index) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;job1 === job is \${job1 === job}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;job2 === job is \${job2 === job}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;job3 === job is \${job3 === job}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   parentJob.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cancel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 变化在这里</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">   logX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Process end!&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>Job1 start!</span></span>
<span class="line"><span>Thread:main @coroutine#3</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Job2 start!</span></span>
<span class="line"><span>Thread:main @coroutine#4</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Job3 start!</span></span>
<span class="line"><span>Thread:main @coroutine#5</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>job1 === job is true</span></span>
<span class="line"><span>job2 === job is true</span></span>
<span class="line"><span>job3 === job is true</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>// 这里不会等待5秒钟</span></span>
<span class="line"><span>Process end!</span></span>
<span class="line"><span>Thread:main @coroutine#1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>这段代码，最大的改变就在于我们将“parentJob.join”改为了“parentJob.cancel()”。从运行结果中我们可以看到，即使我们调用的只是 parentJob 的 cancel() 方法，并没有碰过 job1、job2、job3，但是它们内部的协程任务也全都被取消了。</p><p>这里，我们也可以用一个简单的动图来描述它们之间的关系：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/5.png" alt=""></a></p><p>所以，当我们以结构化的方式构建协程以后，我们的 join()、cancel() 等操作，也会以结构化的模式来执行。</p><h2 id="思考与实战" tabindex="-1">思考与实战 <a class="header-anchor" href="#思考与实战" aria-label="Permalink to &quot;思考与实战&quot;">​</a></h2><p>在学完 Job 和 Deferred 以后，也许你已经可以非常明确地判断出什么场景该用 launch，什么场景该用 async 了。那么，这是不是就意味着你已经完成了学习的目标呢？</p><p>当然不是！理论学得再多，如果不能结合实际落地场景来分析，那终究都是一场空。接下来，我们来看一个常见的代码模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段13</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   suspend fun getResult1(): String {</span></span>
<span class="line"><span>       delay(1000L) // 模拟耗时操作</span></span>
<span class="line"><span>       return &quot;Result1&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   suspend fun getResult2(): String {</span></span>
<span class="line"><span>       delay(1000L) // 模拟耗时操作</span></span>
<span class="line"><span>       return &quot;Result2&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   suspend fun getResult3(): String {</span></span>
<span class="line"><span>       delay(1000L) // 模拟耗时操作</span></span>
<span class="line"><span>       return &quot;Result3&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   val results = mutableListOf&lt;​String&gt;()</span></span>
<span class="line"><span>   val time = measureTimeMillis {</span></span>
<span class="line"><span>       results.add(getResult1())</span></span>
<span class="line"><span>       results.add(getResult2())</span></span>
<span class="line"><span>       results.add(getResult3())</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   println(&quot;Time: $time&quot;)</span></span>
<span class="line"><span>   println(results)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Time: 3018</span></span>
<span class="line"><span>[Result1, Result2, Result3]</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>这段代码里，我们在内部定义了三个挂起函数 getResult1()、getResult2()、getResult3()，它们各自都会耗时 1000 毫秒，而且它们之间的运行结果也互不相干。代码逻辑也很简单，也是我们平时在工作中会经常遇到的业务场景。</p><p>不过请问，你知道该如何优化上面的代码吗？</p><p>我们进一步来分析一下。当我们直接调用这三个挂起函数，并且拿到结果以后，整个过程大约需要消耗 3000 毫秒，也就是这几个函数耗时的总和。对于这样的情况，我们其实完全可以使用 async 来优化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段14</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   suspend fun getResult1(): String {</span></span>
<span class="line"><span>       delay(1000L) // 模拟耗时操作</span></span>
<span class="line"><span>       return &quot;Result1&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   suspend fun getResult2(): String {</span></span>
<span class="line"><span>       delay(1000L) // 模拟耗时操作</span></span>
<span class="line"><span>       return &quot;Result2&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   suspend fun getResult3(): String {</span></span>
<span class="line"><span>       delay(1000L) // 模拟耗时操作</span></span>
<span class="line"><span>       return &quot;Result3&quot;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   val results: List&lt;​String&gt;</span></span>
<span class="line"><span>   val time = measureTimeMillis {</span></span>
<span class="line"><span>       val result1 = async { getResult1() }</span></span>
<span class="line"><span>       val result2 = async { getResult2() }</span></span>
<span class="line"><span>       val result3 = async { getResult3() }</span></span>
<span class="line"><span>       results = listOf(result1.await(), result2.await(), result3.await())</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   println(&quot;Time: $time&quot;)</span></span>
<span class="line"><span>   println(results)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Time: 1032</span></span>
<span class="line"><span>[Result1, Result2, Result3]</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>所以，当我们总是拿 launch 和 async 来做对比的时候，就会不自觉地认为 async 是用来替代launch 的。但实际上，async 最常见的使用场景是：与挂起函数结合，优化并发。</p><p>请不要小看这个场景，在实际工作中，如果你仔细去分析嵌套的异步代码，你会发现，很多异步任务之间都是没有互相依赖的，这样的代码结合挂起函数后，再通过 async 并发来执行，是可以大大提升代码运行效率的。</p><p>换句话说，如果我们的任务是 IO 密集型的，代码运行效率是可以实现成倍提升的。一个简单的改造，能极大地提升运行效率，何乐而不为呢？</p><p>那么，万一我们的任务在某些场景下，并发反而会降低效率呢？这也很简单，我们也完全可以使用 CoroutineStart 来控制它的启动模式。所以，这种方式的扩展性和灵活性都很好。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这节课，我们主要学习了 Job、Deferred，通过对它们两者的学习，我们知道了，协程是有生命周期的，同时也发现，协程其实是结构化的。</p><p>具体来说，有以下几个要点我们需要好好掌握：</p><ul><li><p>Job，相当于协程的句柄，Job 与协程的关系，有点像“遥控器与空调的关系”。</p></li><li><p>Job，在它的内部，维护了一系列的生命周期状态，它也对应着协程的生命周期状态。</p></li><li><p>通过 Job，我们可以监测协程的状态，比如 isActive、isCancelled、isCompleted；另外，我们也可以一定程度地操控协程的状态，比如 start()、cancel()。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>除此之外，我们还可以通过 Job.invokeOnCompletion {} 来监听协程执行完毕的事</span></span></code></pre></div><ul><li><p>件；通过 Job.join() 这个挂起函数，我们可以挂起当前协程的执行流程，等到协程执行完毕以后，再恢复执行后面的代码。</p></li><li><p>而对于 Deferred.await()，它的行为模式和 Job.join() 类似，只是它还会返回协程的执行结果。</p></li><li><p>另外，协程是结构化的并发，这是它的第二大优势。通过分析 Job 的源码，我们发现，一个 Job 可以拥有多个 ChildJob；对应的，协程也可拥有多个“子协程”。</p></li><li><p>那么结构化并发带来的最大优势就在于，我们可以实现只控制“父协程”，从而达到控制一堆子协程的目的。在前面的例子中，parentJob.join() 不仅仅只会等待它自身执行完毕，还会等待它内部的 job1、job2、job3 执行完毕。parentJob.cancel() 同理。</p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/16-Job/6.png" alt=""></a></p><p>最后呢，我也想跟你分享一下我学习协程的一些方法论。</p><p>其实，人学习新知识最快的方式，就是与旧的知识建立关联。举个例子，第一门计算机语言往往是最难学的，因为这是一个无中生有的过程；但当你掌握 C、C++ 以后，再去学习 Java、Python 就会简单很多，因为你可以用脑子里的旧知识与其建立关联。</p><p>所以，虽然我在学习协程的时候也走了很多弯路，但总的来说，我做对了以下几件事，这里我也把经验分享给你。</p><p>第一，横向对比。在初次学习 Kotlin 协程失败以后，我去粗略学习了其他语言的协程，在那个时候，C# 之类的协程学习资源更加丰富。通过对比 C#、Go 等语言的协程后，我理解了“广义协程”的概念，并且也知道 yield、async、await 只是一种广泛存在的协程模式。而当我理解了广义协程这个旧的知识之后，我突然发现 Kotlin 的协程就不难理解了。</p><p>第二，建立思维模型。这是我的一个“习惯”，不管是计算机网络、操作系统、数据结构、设计模式，还是其他领域，比如说高中的电磁学、大学的线性代数，在学习抽象知识的时候，我都喜欢虚构一些思维模型，来模拟它们内部的运行机制。</p><p>协程，就是一门非常抽象的技术，我喜欢用协程 API 编写一些简单的 Demo 来分析它们的行为模式，同时为其建立思维模型。这样一来，我脑海里的知识既不容易遗忘，也更成体系。比如，launch 就像射箭；async 就像钓鱼，这既是思维模型，同时也是在用旧知识学新知识。</p><p>第三，纵向深入。当我通过建立思维模型，对协程有了全面认识之后，我开始深入研究协程的源码。这时候，我从源码当中找到了更多的细节，来完善、支撑我脑子里的思维模型，从此，它们就不再是我凭空编造出来的东西了，因为证据都在源码里。这是一个自顶向下、逐渐深入的过程，反之则行不通。</p><p>所以，现在回过头来看，其实最重要的，还是用旧知识学新知识。希望我的方法能对你有所启发。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问下面这段代码的执行结果是什么？你能分析出原因吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码段15</span></span>
<span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val job = launch {</span></span>
<span class="line"><span>       logX(&quot;First coroutine start!&quot;)</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>       logX(&quot;First coroutine end!&quot;)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   job.join()</span></span>
<span class="line"><span>   val job2 = launch(job) {</span></span>
<span class="line"><span>       logX(&quot;Second coroutine start!&quot;)</span></span>
<span class="line"><span>       delay(1000L)</span></span>
<span class="line"><span>       logX(&quot;Second coroutine end!&quot;)</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   job2.join()</span></span>
<span class="line"><span>   logX(&quot;Process end!&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎在留言区分享你的答案，也欢迎你把今天的内容分享给更多的朋友。</p>`,134)])])}const E=a(l,[["render",e]]);export{d as __pageData,E as default};
