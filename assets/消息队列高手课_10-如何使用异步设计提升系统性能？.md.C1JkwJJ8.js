import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"10 | 如何使用异步设计提升系统性能？","description":"","frontmatter":{},"headers":[{"level":2,"title":"异步设计如何提升系统性能？","slug":"异步设计如何提升系统性能","link":"#异步设计如何提升系统性能","children":[]},{"level":2,"title":"简单实用的异步框架: CompletableFuture","slug":"简单实用的异步框架-completablefuture","link":"#简单实用的异步框架-completablefuture","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"消息队列高手课/10-如何使用异步设计提升系统性能？.md","filePath":"消息队列高手课/10-如何使用异步设计提升系统性能？.md","lastUpdated":1779821001000}'),t={name:"消息队列高手课/10-如何使用异步设计提升系统性能？.md"};function l(c,a,i,o,r,u){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_10-如何使用异步设计提升系统性能" tabindex="-1">10 | 如何使用异步设计提升系统性能？ <a class="header-anchor" href="#_10-如何使用异步设计提升系统性能" aria-label="Permalink to &quot;10 | 如何使用异步设计提升系统性能？&quot;">​</a></h1><p>你好，我是李玥，这一讲我们来聊一聊异步。</p><p>对于开发者来说，异步是一种程序设计的思想，使用异步模式设计的程序可以显著减少线程等待，从而在高吞吐量的场景中，极大提升系统的整体性能，显著降低时延。</p><p>因此，像消息队列这种需要超高吞吐量和超低时延的中间件系统，在其核心流程中，一定会大量采用异步的设计思想。</p><p>接下来，我们一起来通过一个非常简单的例子学习一下，使用异步设计是如何提升系统性能的。</p><h2 id="异步设计如何提升系统性能" tabindex="-1">异步设计如何提升系统性能？ <a class="header-anchor" href="#异步设计如何提升系统性能" aria-label="Permalink to &quot;异步设计如何提升系统性能？&quot;">​</a></h2><p>假设我们要实现一个转账的微服务Transfer( accountFrom, accountTo, amount)，这个服务有三个参数：分别是转出账户、转入账户和转账金额。</p><p>实现过程也比较简单，我们要从账户A中转账100元到账户B中：</p><ol><li>先从A的账户中减去100元；</li><li>再给B的账户加上100元，转账完成。</li></ol><p>对应的时序图是这样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97%E9%AB%98%E6%89%8B%E8%AF%BE/images/117272/3f7faf335a9e6c3009902d85b71d3058.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97%E9%AB%98%E6%89%8B%E8%AF%BE/images/117272/3f7faf335a9e6c3009902d85b71d3058.jpg" alt=""></a></p><p>在这个例子的实现过程中，我们调用了另外一个微服务Add(account, amount)，它的功能是给账户account增加金额amount，当amount为负值的时候，就是扣减响应的金额。</p><p>需要特别说明的是，在这段代码中，我为了使问题简化以便我们能专注于异步和性能优化，省略了错误处理和事务相关的代码，你在实际的开发中不要这样做。</p><h4 id="_1-同步实现的性能瓶颈" tabindex="-1">1. 同步实现的性能瓶颈 <a class="header-anchor" href="#_1-同步实现的性能瓶颈" aria-label="Permalink to &quot;1\\. 同步实现的性能瓶颈&quot;">​</a></h4><p>首先我们来看一下同步实现，对应的伪代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Transfer(accountFrom, accountTo, amount) {</span></span>
<span class="line"><span>  // 先从accountFrom的账户中减去相应的钱数</span></span>
<span class="line"><span>  Add(accountFrom, -1 * amount)</span></span>
<span class="line"><span>  // 再把减去的钱数加到accountTo的账户中</span></span>
<span class="line"><span>  Add(accountTo, amount)</span></span>
<span class="line"><span>  return OK</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的伪代码首先从accountFrom的账户中减去相应的钱数，再把减去的钱数加到accountTo的账户中，这种同步实现是一种很自然方式，简单直接。那么性能表现如何呢？接下来我们就来一起分析一下性能。</p><p>假设微服务Add的平均响应时延是50ms，那么很容易计算出我们实现的微服务Transfer的平均响应时延大约等于执行2次Add的时延，也就是100ms。那随着调用Transfer服务的请求越来越多，会出现什么情况呢？</p><p>在这种实现中，每处理一个请求需要耗时100ms，并在这100ms过程中是需要独占一个线程的，那么可以得出这样一个结论：每个线程每秒钟最多可以处理10个请求。我们知道，每台计算机上的线程资源并不是无限的，假设我们使用的服务器同时打开的线程数量上限是10,000，可以计算出这台服务器每秒钟可以处理的请求上限是： 10,000 （个线程）* 10（次请求每秒） = 100,000 次每秒。</p><p>如果请求速度超过这个值，那么请求就不能被马上处理，只能阻塞或者排队，这时候Transfer服务的响应时延由100ms延长到了：排队的等待时延 + 处理时延(100ms)。也就是说，在大量请求的情况下，我们的微服务的平均响应时延变长了。</p><p>这是不是已经到了这台服务器所能承受的极限了呢？其实远远没有，如果我们监测一下服务器的各项指标，会发现无论是CPU、内存，还是网卡流量或者是磁盘的IO都空闲的很，那我们Transfer服务中的那10,000个线程在干什么呢？对，绝大部分线程都在等待Add服务返回结果。</p><p>也就是说， <strong>采用同步实现的方式，整个服务器的所有线程大部分时间都没有在工作，而是都在等待。</strong></p><p>如果我们能减少或者避免这种无意义的等待，就可以大幅提升服务的吞吐能力，从而提升服务的总体性能。</p><h4 id="_2-采用异步实现解决等待问题" tabindex="-1">2. 采用异步实现解决等待问题 <a class="header-anchor" href="#_2-采用异步实现解决等待问题" aria-label="Permalink to &quot;2\\. 采用异步实现解决等待问题&quot;">​</a></h4><p>接下来我们看一下，如何用异步的思想来解决这个问题，实现同样的业务逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TransferAsync(accountFrom, accountTo, amount, OnComplete()) {</span></span>
<span class="line"><span>  // 异步从accountFrom的账户中减去相应的钱数，然后调用OnDebit方法。</span></span>
<span class="line"><span>  AddAsync(accountFrom, -1 * amount, OnDebit(accountTo, amount, OnAllDone(OnComplete())))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 扣减账户accountFrom完成后调用</span></span>
<span class="line"><span>OnDebit(accountTo, amount, OnAllDone(OnComplete())) {</span></span>
<span class="line"><span>  //  再异步把减去的钱数加到accountTo的账户中，然后执行OnAllDone方法</span></span>
<span class="line"><span>  AddAsync(accountTo, amount, OnAllDone(OnComplete()))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 转入账户accountTo完成后调用</span></span>
<span class="line"><span>OnAllDone(OnComplete()) {</span></span>
<span class="line"><span>  OnComplete()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>细心的你可能已经注意到了，TransferAsync服务比Transfer多了一个参数，并且这个参数传入的是一个回调方法OnComplete()（虽然Java语言并不支持将方法作为方法参数传递，但像JavaScript等很多语言都具有这样的特性，在Java语言中，也可以通过传入一个回调类的实例来变相实现类似的功能）。</p><p>这个TransferAsync()方法的语义是：请帮我执行转账操作，当转账完成后，请调用OnComplete()方法。调用TransferAsync的线程不必等待转账完成就可以立即返回了，待转账结束后，TransferService自然会调用OnComplete()方法来执行转账后续的工作。</p><p>异步的实现过程相对于同步来说，稍微有些复杂。我们先定义2个回调方法：</p><ul><li><strong>OnDebit()</strong>：扣减账户accountFrom完成后调用的回调方法；</li><li><strong>OnAllDone()</strong>：转入账户accountTo完成后调用的回调方法。</li></ul><p>整个异步实现的语义相当于：</p><ol><li>异步从accountFrom的账户中减去相应的钱数，然后调用OnDebit方法；</li><li>在OnDebit方法中，异步把减去的钱数加到accountTo的账户中，然后执行OnAllDone方法；</li><li>在OnAllDone方法中，调用OnComplete方法。</li></ol><p>绘制成时序图是这样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97%E9%AB%98%E6%89%8B%E8%AF%BE/images/117272/38ab8de8fbfaf4cd4b34fbd9ddd3360d.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97%E9%AB%98%E6%89%8B%E8%AF%BE/images/117272/38ab8de8fbfaf4cd4b34fbd9ddd3360d.jpg" alt=""></a></p><p>你会发现，异步化实现后，整个流程的时序和同步实现是完全一样的， <strong>区别只是在线程模型上由同步顺序调用改为了异步调用和回调的机制。</strong></p><p>接下来我们分析一下异步实现的性能，由于流程的时序和同步实现是一样，在低请求数量的场景下，平均响应时延一样是100ms。在超高请求数量场景下，异步的实现不再需要线程等待执行结果，只需要个位数量的线程，即可实现同步场景大量线程一样的吞吐量。</p><p>由于没有了线程的数量的限制，总体吞吐量上限会大大超过同步实现，并且在服务器CPU、网络带宽资源达到极限之前，响应时延不会随着请求数量增加而显著升高，几乎可以一直保持约100ms的平均响应时延。</p><p>看，这就是异步的魔力。</p><h2 id="简单实用的异步框架-completablefuture" tabindex="-1">简单实用的异步框架: CompletableFuture <a class="header-anchor" href="#简单实用的异步框架-completablefuture" aria-label="Permalink to &quot;简单实用的异步框架: CompletableFuture&quot;">​</a></h2><p>在实际开发时，我们可以使用异步框架和响应式框架，来解决一些通用的异步编程问题，简化开发。Java中比较常用的异步框架有Java8内置的 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html" target="_blank" rel="noreferrer">CompletableFuture</a> 和ReactiveX的 <a href="https://github.com/ReactiveX/RxJava" target="_blank" rel="noreferrer">RxJava</a>，我个人比较喜欢简单实用易于理解的CompletableFuture，但是RxJava的功能更加强大。有兴趣的同学可以深入了解一下。</p><p>Java 8中新增了一个非常强大的用于异步编程的类：CompletableFuture，几乎囊获了我们在开发异步程序的大部分功能，使用CompletableFuture很容易编写出优雅且易于维护的异步代码。</p><p>接下来，我们来看下，如何用CompletableFuture实现的转账服务。</p><p>首先，我们用CompletableFuture定义2个微服务的接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 账户服务</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface AccountService {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 变更账户金额</span></span>
<span class="line"><span>     * @param account 账户ID</span></span>
<span class="line"><span>     * @param amount 增加的金额，负值为减少</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    CompletableFuture&lt;​Void&gt; add(int account, int amount);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 转账服务</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface TransferService {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 异步转账服务</span></span>
<span class="line"><span>     * @param fromAccount 转出账户</span></span>
<span class="line"><span>     * @param toAccount 转入账户</span></span>
<span class="line"><span>     * @param amount 转账金额，单位分</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    CompletableFuture&lt;​Void&gt; transfer(int fromAccount, int toAccount, int amount);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到这两个接口中定义的方法的返回类型都是一个带泛型的CompletableFuture，尖括号中的泛型类型就是真正方法需要返回数据的类型，我们这两个服务不需要返回数据，所以直接用Void类型就可以。</p><p>然后我们来实现转账服务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 转账服务的实现</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class TransferServiceImpl implements TransferService {</span></span>
<span class="line"><span>    @Inject</span></span>
<span class="line"><span>    private  AccountService accountService; // 使用依赖注入获取账户服务的实例</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public CompletableFuture&lt;​Void&gt; transfer(int fromAccount, int toAccount, int amount) {</span></span>
<span class="line"><span>      // 异步调用add方法从fromAccount扣减相应金额</span></span>
<span class="line"><span>      return accountService.add(fromAccount, -1 * amount)</span></span>
<span class="line"><span>      // 然后调用add方法给toAccount增加相应金额</span></span>
<span class="line"><span>      .thenCompose(v -&gt; accountService.add(toAccount, amount));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在转账服务的实现类TransferServiceImpl里面，先定义一个AccountService实例，这个实例从外部注入进来，至于怎么注入不是我们关心的问题，就假设这个实例是可用的就好了。</p><p>然后我们看实现transfer()方法的实现，我们先调用一次账户服务accountService.add()方法从fromAccount扣减响应的金额，因为add()方法返回的就是一个CompletableFuture对象，可以用CompletableFuture的thenCompose()方法将下一次调用accountService.add()串联起来，实现异步依次调用两次账户服务完整转账。</p><p>客户端使用CompletableFuture也非常灵活，既可以同步调用，也可以异步调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Client {</span></span>
<span class="line"><span>    @Inject</span></span>
<span class="line"><span>    private TransferService transferService; // 使用依赖注入获取转账服务的实例</span></span>
<span class="line"><span>    private final static int A = 1000;</span></span>
<span class="line"><span>    private final static int B = 1001;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void syncInvoke() throws ExecutionException, InterruptedException {</span></span>
<span class="line"><span>        // 同步调用</span></span>
<span class="line"><span>        transferService.transfer(A, B, 100).get();</span></span>
<span class="line"><span>        System.out.println(&quot;转账完成！&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void asyncInvoke() {</span></span>
<span class="line"><span>        // 异步调用</span></span>
<span class="line"><span>        transferService.transfer(A, B, 100)</span></span>
<span class="line"><span>                .thenRun(() -&gt; System.out.println(&quot;转账完成！&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在调用异步方法获得返回值CompletableFuture对象后，既可以调用CompletableFuture的get方法，像调用同步方法那样等待调用的方法执行结束并获得返回值，也可以像异步回调的方式一样，调用CompletableFuture那些以then开头的一系列方法，为CompletableFuture定义异步方法结束之后的后续操作。比如像上面这个例子中，我们调用thenRun()方法，参数就是将转账完成打印在控台上这个操作，这样就可以实现在转账完成后，在控制台打印“转账完成！”了。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>简单的说，异步思想就是， <strong>当我们要执行一项比较耗时的操作时，不去等待操作结束，而是给这个操作一个命令：“当操作完成后，接下来去执行什么。”</strong></p><p>使用异步编程模型，虽然并不能加快程序本身的速度，但可以减少或者避免线程等待，只用很少的线程就可以达到超高的吞吐能力。</p><p>同时我们也需要注意到异步模型的问题：相比于同步实现，异步实现的复杂度要大很多，代码的可读性和可维护性都会显著的下降。虽然使用一些异步编程框架会在一定程度上简化异步开发，但是并不能解决异步模型高复杂度的问题。</p><p>异步性能虽好，但一定不要滥用，只有类似在像消息队列这种业务逻辑简单并且需要超高吞吐量的场景下，或者必须长时间等待资源的地方，才考虑使用异步模型。如果系统的业务逻辑比较复杂，在性能足够满足业务需求的情况下，采用符合人类自然的思路且易于开发和维护的同步模型是更加明智的选择。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>课后给你留2个思考题：</p><p>第一个思考题是，我们实现转账服务时，并没有考虑处理失败的情况。你回去可以想一下，在异步实现中，如果调用账户服务失败时，如何将错误报告给客户端？在两次调用账户服务的Add方法时，如果某一次调用失败了，该如何处理才能保证账户数据是平的？</p><p>第二个思考题是，在异步实现中，回调方法OnComplete()是在什么线程中运行的？我们是否能控制回调方法的执行线程数？该如何做？欢迎在留言区写下你的想法。</p><p>感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给你的朋友。</p>`,63)])])}const h=n(t,[["render",l]]);export{m as __pageData,h as default};
