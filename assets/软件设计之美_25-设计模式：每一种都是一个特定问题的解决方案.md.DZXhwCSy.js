import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"25 | 设计模式：每一种都是一个特定问题的解决方案","description":"","frontmatter":{},"headers":[{"level":2,"title":"设计模式：一种特定的解决方案","slug":"设计模式-一种特定的解决方案","link":"#设计模式-一种特定的解决方案","children":[]},{"level":2,"title":"从原则到模式","slug":"从原则到模式","link":"#从原则到模式","children":[]},{"level":2,"title":"开眼看模式","slug":"开眼看模式","link":"#开眼看模式","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"软件设计之美/25-设计模式：每一种都是一个特定问题的解决方案.md","filePath":"软件设计之美/25-设计模式：每一种都是一个特定问题的解决方案.md","lastUpdated":1779822537000}'),l={name:"软件设计之美/25-设计模式：每一种都是一个特定问题的解决方案.md"};function i(r,s,t,c,o,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_25-设计模式-每一种都是一个特定问题的解决方案" tabindex="-1">25 | 设计模式：每一种都是一个特定问题的解决方案 <a class="header-anchor" href="#_25-设计模式-每一种都是一个特定问题的解决方案" aria-label="Permalink to &quot;25 | 设计模式：每一种都是一个特定问题的解决方案&quot;">​</a></h1><p>你好，我是郑晔！</p><p>今天，我们来聊聊设计模式。作为一个讲软件设计的专栏，不讲设计模式有些说不过去。现在的程序员，基本上在工作了一段时间之后，都会意识到学习设计模式的重要性。</p><p>因为随着工作经验的增多，大家会逐渐认识到，代码写不好会造成各种问题，而设计模式则是所有软件设计的知识中，市面上参考资料最多，最容易学习的知识。</p><p>但是，你也知道，设计模式的内容很多，多到可以单独地作为一本书或一个专栏的内容。如果我们要在这个专栏的篇幅里，细致地学习设计模式的内容就会显得有些局促。</p><p>所以，这一讲，我打算和你谈谈 <strong>如何理解和学习设计模式</strong>，帮助你建立起对设计模式的一个整体认知。</p><h2 id="设计模式-一种特定的解决方案" tabindex="-1">设计模式：一种特定的解决方案 <a class="header-anchor" href="#设计模式-一种特定的解决方案" aria-label="Permalink to &quot;设计模式：一种特定的解决方案&quot;">​</a></h2><p>所谓模式，其实就是针对的就是一些普遍存在的问题给出的解决方案。模式这个说法起源于建筑领域，建筑师克里斯托佛·亚历山大曾把建筑中的一些模式汇集成册。结果却是墙里开花墙外香，模式这个说法却在软件行业流行了起来。</p><p>最早是Kent Beck和Ward Cunningham探索将模式这个想法应用于软件开发领域，之后，Erich Gamma把这一思想写入了其博士论文。而真正让建筑上的模式思想成了设计模式，在软件行业得到了广泛地接受，则是在《设计模式》这本书出版之后了。</p><p>这本书扩展了Erich Gamma的论文。四位作者Erich Gamma、Richard Helm、Ralph Johnson和John Vlissides也因此名声大噪，得到了GoF的称呼。我们今天大部分人知道的23种设计模式就是从这本书来的，而困惑也是从这里开始的。</p><p>因为，这23种设计模式只是在这本书里写的，并不是天底下只有23种设计模式。随着人们越发认识到设计模式这件事的重要性，越来越多的模式被发掘了出来，各种模式相关的书先后问世，比如，Martin Fowler 写过 <a href="http://book.douban.com/subject/4826290/" target="_blank" rel="noreferrer">《企业应用架构模式》</a>，甚至还有人写了一套 5 卷本的 <a href="/note-website/https:/book.douban.com/series/14666">《面向模式的软件架构》</a>。</p><p>但是，很多人从开始学习设计模式，就对设计模式的认知产生了偏差，所谓的23个模式其实就是23个例子。</p><p>还记得我们前面几讲学习的设计原则吗？如果用数学来比喻的话， <strong>设计原则就像公理</strong>，它们是我们讨论各种问题的基础，而 <strong>设计模式则是定理</strong>，它们是在特定场景下，对于经常发生的问题给出的一个可复用的解决方案。</p><p>所以，你要想把所有已知的模式统统学一遍，即便不是不可能，也是会花费很多时间的，更何况还会有新的模式不断地出现。而且，虽然《设计模式》那本书上提到的大部分设计模式都很流行，但 <strong>有一些模式，如果你不是编写特定的代码，你很可能根本就用不上</strong>。</p><p>比如Flyweight模式，如果你的系统中没有那么多小对象，可能就根本用不到它；而 Visitor 模式，在你设计自己系统的时候也很少会用到，因为你自己写的类常常都是可以拿到信息的，犯不上舍近求远。</p><p>所以， <strong>学习设计模式不要贪多求全，那注定会是一件费力不讨好的事</strong>。</p><p>想要有效地学习设计模式，首先我们要知道 <strong>每一个模式都是一个特定的解决方案</strong>。关键点在于，我们要知道这个模式在解决什么问题。很多人强行应用设计模式会让代码不必要地复杂起来，原因就在于他在解决的问题，和设计模式本身要解决的问题并不一定匹配。 <strong>学习设计模式不仅仅要学习代码怎么写，更重要的是要了解模式的应用场景</strong>。</p><h2 id="从原则到模式" tabindex="-1">从原则到模式 <a class="header-anchor" href="#从原则到模式" aria-label="Permalink to &quot;从原则到模式&quot;">​</a></h2><p>设计模式之所以能成为一个特定的解决方案，很大程度上是因为它是一种好的做法，符合软件设计原则，所以， <strong>设计原则其实是这些模式背后的东西</strong>。</p><p>我们前面花了大量的篇幅在讲各种编程范式、设计原则，因为它们是比设计模式更基础的东西。掌握这些内容，按照它们去写代码，可能你并没有在刻意使用一个设计模式，往往也能写出符合某个设计模式的代码。</p><p>我给你举个例子。比如，在用户注册完成之后，相关信息会发给后台的数据汇总模块，以便后面我们进行相关的数据分析。所以，我们会写出这样的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>interface UserSender {</span></span>
<span class="line"><span>  void send(User user);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 把用户信息发送给后台数据汇总模块</span></span>
<span class="line"><span>class UserCollectorSender implements UserSender {</span></span>
<span class="line"><span>  private UserCollectorChannel channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void send(final User user) {</span></span>
<span class="line"><span>    channel.send(user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同时，我们还要把用户注册成功的消息通过短信通知给用户，这里会用到第三方的服务，所以，我们这里要有一个APP的key和secret：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 通过短信发消息</span></span>
<span class="line"><span>class UserSMSSender implements UserSender {</span></span>
<span class="line"><span>  private String appKey;</span></span>
<span class="line"><span>  private String appSecret;</span></span>
<span class="line"><span>  private UserSMSChannel channel;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void send(final User user) {</span></span>
<span class="line"><span>    channel.send(appKey, appSecret, user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在，我们要对用户的一些信息做处理，保证敏感信息不会泄漏，比如，用户密码。同时，我们还希望信息在发送成功之后，有一个统计，以便我们知道发出了多少的信息。</p><p>如果不假思索地加上这段逻辑，那两个类里必然都会有相同的处理，本着单一职责原则，我们把这个处理放到一个父类里面，于是，代码就变成这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class BaseUserSender implements UserSender {</span></span>
<span class="line"><span>  // 敏感信息过滤</span></span>
<span class="line"><span>  protected User sanitize(final User user) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 收集消息发送信息</span></span>
<span class="line"><span>  protected void collectMessageSent(final User user) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserCollectorSender extends BaseUserSender {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void send(final User user) {</span></span>
<span class="line"><span>    User sanitizedUser = sanitize(user);</span></span>
<span class="line"><span>    channel.send(sanitizedUser);</span></span>
<span class="line"><span>    collectMessageSent(user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserSMSSender extends BaseUserSender {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void send(final User user) {</span></span>
<span class="line"><span>    User sanitizedUser = sanitize(user);</span></span>
<span class="line"><span>    channel.send(appKey, appSecret, user);</span></span>
<span class="line"><span>    collectMessageSent(user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然而，这两段发送的代码除了发送的部分不一样，其他部分是完全一样的。所以，我们可以考虑把共性的东西提取出来，而差异的部分让子类各自实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class BaseUserSender implements UserSender {</span></span>
<span class="line"><span>  // 发送用户信息</span></span>
<span class="line"><span>  public void send(final User user) {</span></span>
<span class="line"><span>    User sanitizedUser = sanitize(user);</span></span>
<span class="line"><span>    doSend(user);</span></span>
<span class="line"><span>    collectMessageSent(user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 敏感信息过滤</span></span>
<span class="line"><span>  private User sanitize(final User user) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 收集消息发送信息</span></span>
<span class="line"><span>  private void collectMessageSent(final User user) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserCollectorSender extends BaseUserSender {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void doSend(final User user) {</span></span>
<span class="line"><span>    channel.send(sanitizedUser);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserSMSSender extends BaseUserSender {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void doSend(final User user) {</span></span>
<span class="line"><span>    channel.send(appKey, appSecret, user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你是不是觉得这段代码有点眼熟了呢？没错，这就是Template Method的设计模式。我们只是遵循着单一职责原则，把重复的代码一点点地消除，结果，我们就得到了一个设计模式。在真实的项目中，你可能很难一眼就看出当前场景是否适合使用某个模式，更实际的做法就是这样遵循着设计原则一点点去调整代码。</p><p>其实，只要我们遵循着同样的原则，大多数设计模式都是可以这样一点点推演出来的。所以说， <strong>设计模式只是设计原则在特定场景下的应用</strong>。</p><h2 id="开眼看模式" tabindex="-1">开眼看模式 <a class="header-anchor" href="#开眼看模式" aria-label="Permalink to &quot;开眼看模式&quot;">​</a></h2><p>学习设计模式，我们还应该有一个更开阔的视角。首先是要看到 <strong>语言的局限</strong>，虽然设计模式本身并不局限于语言，但很多模式之所以出现，就是受到了语言本身的限制。</p><p>比如，Visitor模式主要是因为C++、Java之类的语言只支持单分发，也就是只能根据一个对象来决定调用哪个方法。而对于支持多分发的语言，Visitor模式存在的意义就不大了。</p><p><a href="http://norvig.com/" target="_blank" rel="noreferrer">Peter Norvig</a>，Google 公司的研究总监，早在 1996 年就曾做过一个分享 <a href="http://www.norvig.com/design-patterns/" target="_blank" rel="noreferrer">《动态语言的设计模式》</a>，他在其中也敏锐地指出，设计模式在某种意义上就是为了解决语言自身缺陷的一种权宜之计，其中列举了某些设计模式采用动态语言后的替代方案。</p><p>我们还应该知道，随着时代的发展，有一些设计模式 <strong>本身也在经历变化</strong>。比如，Singleton 模式是很多面试官喜爱的一个模式，因为它能考察很多编程的技巧。比如，通过将构造函数私有化，保证不创建出更多的对象、在多线程模式下要进行双重检查锁定（double-check locking）等等。</p><p>然而，我在讲可测试性的时候说过，Singleton并不是一个好的设计模式，它会影响系统的可测试性。从概念上说，系统里只有一个实例和限制系统里只能构建出一个实例，这其实是两件事。</p><p>尤其是在DI容器普遍使用的今天，DI容器缺省情况下生成的对象就是只有一个实例。所以，在大部分情况下，我们完全没有必要使用Singleton模式。当然，如果你的场景非常特殊，那就另当别论了。</p><p>在讲语法和程序库时，我们曾经说过，一些好的做法会逐渐被吸收到程序库，甚至成为语法。设计模式常常就是好做法的来源，所以，一些程序库就把设计模式的工作做了。比如，Observer 模式早在1.0版本的时候就进入到 JDK，被监听的对象要继承自 <a href="http://docs.oracle.com/javase/8/docs/api/java/util/Observable.html" target="_blank" rel="noreferrer">Observable</a> 类就好，用来监听的对象实现一个 <a href="http://docs.oracle.com/javase/8/docs/api/java/util/Observer.html" target="_blank" rel="noreferrer">Observer</a> 接口就行。</p><p>当然，我们讲继承时说过，继承不是一个特别好的选择，Observable是一个要去继承的类，所以，它做得也并不好。从Java 9开始，这个实现就过时（deprecated）了，当然官方的理由会更充分一些，你要是有兴趣可以去了解一下。JDK中提供的替代方案是 <a href="http://docs.oracle.com/javase/8/docs/api/java/beans/PropertyChangeSupport.html" target="_blank" rel="noreferrer">PropertyChangeSupport</a>，简言之，用组合替代了继承。</p><p>我个人更欣赏的替代方案是Guava的 <a href="http://github.com/google/guava/wiki/EventBusExplained" target="_blank" rel="noreferrer">EventBus</a>，你甚至都不用实现一个接口，只要用一个Annotation标记一下就可以监听了。</p><p>Annotation可以说是消灭设计模式的一个利器。我们刚说过，语言本身的局限造成了一些设计模式的出现，这一点在Java上表现得尤其明显。随着Java自身的发展，随着Java世界的发展，有一些设计模式就越来越少的用到了。比如，Builder模式通过Lombok这个库的一个Annotation就可以做到：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Builder</span></span>
<span class="line"><span>class Student {</span></span>
<span class="line"><span>  private String name;</span></span>
<span class="line"><span>  private int age;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而Decorator模式也可以通过Annotation实现，比如，一种使用 Decorator 模式的典型场景，是实现事务，很多Java程序员熟悉的一种做法就是使用Spring的Transactional，就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Handler {</span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void execute() {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>随着Java 8引入Lambda，Command模式的写法也会得到简化，比如写一个文件操作的宏记录器，之前的版本需要声明很多类，类似下面这种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Macro macro = new Macro();</span></span>
<span class="line"><span>macro.record(new OpenFile(fileReceiver));</span></span>
<span class="line"><span>macro.record(new WriteFile(fileReceiver));</span></span>
<span class="line"><span>macro.record(new CloseFile(fileReceiver));</span></span>
<span class="line"><span>macro.run();</span></span></code></pre></div><p>而有了Lambda，就可以简化一些，不用为每个命令声明一个类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Macro macro = new Macro();</span></span>
<span class="line"><span>macro.record(() -&amp;gt; fileReceiver.openFile());</span></span>
<span class="line"><span>macro.record(() -&amp;gt; fileReceiver.writeFile());</span></span>
<span class="line"><span>macro.record(() -&amp;gt; fileReceiver.closeFile());</span></span>
<span class="line"><span>macro.run();</span></span></code></pre></div><p>甚至还可以用Method Reference再简化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Macro macro = new Macro();</span></span>
<span class="line"><span>macro.record(fileReceiver::openFile);</span></span>
<span class="line"><span>macro.record(fileReceiver::writeFile);</span></span>
<span class="line"><span>macro.record(fileReceiver::closeFile);</span></span>
<span class="line"><span>macro.run();</span></span></code></pre></div><p>所以，我们学习设计模式除了学习标准写法的样子，还要知道，随着语言的不断发展，新的写法变成了什么样子。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>今天，我们谈到了如何学习设计模式。学习设计模式，很多人的注意力都在模式的代码应该如何编写，却忽略了模式的使用场景。强行应用模式，就会有一种削足适履的感觉。</p><p>设计模式背后其实是各种设计原则，我们在实际的工作中，更应该按照设计原则去写代码，不一定要强求设计模式，而按照设计原则去写代码的结果，往往是变成了某个模式。</p><p>学习设计模式，我们也要抬头看路，比如，很多设计模式的出现是因为程序设计语言自身能力的不足，我们还要知道，随着时代的发展，一些模式已经不再适用了。</p><p>比如 Singleton 模式，还有些模式有了新的写法，比如，Observer、Decorator、Command 等等。我们对于设计模式的理解，也要随着程序设计语言的发展不断更新。</p><p>好，关于设计模式，我们就先谈到这里。下一讲，我会和你讨论一些很多人经常挂在嘴边的编程原则，虽然它们不像设计原则那么成体系，但依然会给你一些启发性的思考。</p><p>如果今天的内容你只能记住一件事，那请记住： <strong>学习设计模式，从设计原则开始，不局限于模式。</strong></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E4%B9%8B%E7%BE%8E/images/265121/4f01c17b5509c29085b166a7ccec6c36.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E4%B9%8B%E7%BE%8E/images/265121/4f01c17b5509c29085b166a7ccec6c36.jpg" alt=""></a></p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，我想请你谈谈你是怎么学习设计模式的，你现在对于设计模式的理解又是怎样的。欢迎在留言区分享你的想法。</p><p>感谢阅读，如果你觉得这一讲的内容对你有帮助的话，也欢迎把它分享给你的朋友。</p>`,63)])])}const u=a(l,[["render",i]]);export{g as __pageData,u as default};
