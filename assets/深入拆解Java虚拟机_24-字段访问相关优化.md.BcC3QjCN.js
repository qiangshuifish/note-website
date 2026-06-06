import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"24 | 字段访问相关优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"字段读取优化","slug":"字段读取优化","link":"#字段读取优化","children":[]},{"level":2,"title":"字段存储优化","slug":"字段存储优化","link":"#字段存储优化","children":[]},{"level":2,"title":"死代码消除","slug":"死代码消除","link":"#死代码消除","children":[]},{"level":2,"title":"总结与实践","slug":"总结与实践","link":"#总结与实践","children":[]}],"relativePath":"深入拆解Java虚拟机/24-字段访问相关优化.md","filePath":"深入拆解Java虚拟机/24-字段访问相关优化.md","lastUpdated":1779821039000}'),l={name:"深入拆解Java虚拟机/24-字段访问相关优化.md"};function i(t,s,c,o,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_24-字段访问相关优化" tabindex="-1">24 | 字段访问相关优化 <a class="header-anchor" href="#_24-字段访问相关优化" aria-label="Permalink to &quot;24 | 字段访问相关优化&quot;">​</a></h1><p>在上一篇文章中，我介绍了逃逸分析，也介绍了基于逃逸分析的优化方式锁消除、栈上分配以及标量替换等内容。</p><p>其中的标量替换，可以看成将对象本身拆散为一个个字段，并把原本对对象字段的访问，替换为对一个个局部变量的访问。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Foo {</span></span>
<span class="line"><span>  int a = 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int bar(int x) {</span></span>
<span class="line"><span>  Foo foo = new Foo();</span></span>
<span class="line"><span>  foo.a = x;</span></span>
<span class="line"><span>  return foo.a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举个例子，上面这段代码中的 <code>bar</code> 方法，经过逃逸分析以及标量替换后，其优化结果如下所示。（确切地说，是指所生成的IR图与下述代码所生成的IR图类似。之后不再重复解释。）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(int x) {</span></span>
<span class="line"><span>  int a = x;</span></span>
<span class="line"><span>  return a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于Sea-of-Nodes IR的特性，局部变量不复存在，取而代之的是一个个值。在例子对应的IR图中，返回节点将直接返回所输入的参数。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/39683/14c64d61e81b764253a2fc96795d095d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/39683/14c64d61e81b764253a2fc96795d095d.png" alt=""></a></p><p><strong>经过标量替换的 <code>bar</code> 方法</strong></p><p>下面我列举了 <code>bar</code> 方法经由C2即时编译生成的机器码（这里略去了指令地址的前48位）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  # {method} &#39;bar&#39; &#39;(I)I&#39; in &#39;FieldAccessTest&#39;</span></span>
<span class="line"><span>  # parm0:    rsi       = int</span><span>             // 参数x</span></span>
<span class="line"><span>  #           [sp+0x20]  (sp of caller)</span></span>
<span class="line"><span>0x06a0: sub    rsp,0x18                   // 创建方法栈桢</span></span>
<span class="line"><span>0x06a7: mov    QWORD PTR [rsp+0x10],rbp   // 无关指令</span></span>
<span class="line"><span>0x06ac: mov    eax,esi                    // 将参数x存入返回值eax中</span></span>
<span class="line"><span>0x06ae: add    rsp,0x10                   // 弹出方法栈桢</span></span>
<span class="line"><span>0x06b2: pop    rbp                        // 无关指令</span></span>
<span class="line"><span>0x06b3: mov    r10,QWORD PTR [r15+0x70]   // 安全点测试</span></span>
<span class="line"><span>0x06b7: test   DWORD PTR [r10],eax        // 安全点测试</span></span>
<span class="line"><span>0x06ba: ret</span></span></code></pre></div><blockquote><p>在X86_64的机器码中，每当使用call指令进入目标方法的方法体中时，我们需要在栈上为当前方法分配一块内存作为其栈桢。而在退出该方法时，我们需要弹出当前方法所使用的栈桢。</p></blockquote><blockquote><p>由于寄存器rsp维护着当前线程的栈顶指针，因此这些操作都是通过增减寄存器rsp来实现的，即上面这段机器码中偏移量为0x06a0以及0x06ae的指令。</p></blockquote><blockquote><p>在介绍安全点（safepoint）时我曾介绍过，HotSpot虚拟机的即时编译器将在方法返回时插入安全点测试指令，即图中偏移量为0x06b3以及0x06ba的指令。其中真正的安全点测试是0x06b7指令。</p></blockquote><blockquote><p>如果虚拟机需要所有线程都到达安全点，那么该test指令所访问的内存地址所在的页将被标记为不可访问，而该指令也将触发segfault，并借由segfault处理器进入安全点之中。通常，该指令会附带 <code>; {poll_return}</code> 这样子的注释，这里被我略去了。</p></blockquote><blockquote><p>在X8_64中，前几个传入参数会被放置于寄存器中，而返回值则需要存放在rax寄存器中。有时候你会看到返回值被存入eax寄存器中，这其实是同一个寄存器，只不过rax表示64位寄存器，而eax表示32位寄存器。具体可以参考x86 calling conventions[1]。</p></blockquote><p>当忽略掉创建、弹出方法栈桢，安全点测试以及其他无关指令之后，所剩下的方法体就只剩下偏移量为0x06ac的mov指令，以及0x06ba的ret指令。前者将所传入的int型参数x移至代表返回值的eax寄存器中，后者是退出当前方法并返回至调用者中。</p><p>虽然在部分情况下，逃逸分析以及基于逃逸分析的优化已经十分高效了，能够将代码优化到极其简单的地步，但是逃逸分析毕竟不是Java虚拟机的银色子弹。</p><p>在现实中，Java程序中的对象或许本身便是逃逸的，或许因为方法内联不够彻底而被即时编译器当成是逃逸的。这两种情况都将导致即时编译器无法进行标量替换。这时候，针对对象字段访问的优化也变得格外重要起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(Foo o, int x) {</span></span>
<span class="line"><span>  o.a = x;</span></span>
<span class="line"><span>  return o.a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这段代码中，对象 <code>o</code> 是传入参数，不属于逃逸分析的范围（Java虚拟机中的逃逸分析针对的是新建对象）。该方法会将所传入的int型参数 <code>x</code> 的值存储至实例字段 <code>Foo.a</code> 中，然后再读取并返回同一字段的值。</p><p>这段代码将涉及两次内存访问操作：存储以及读取实例字段 <code>Foo.a</code>。我们可以轻易地将其手工优化为直接读取并返回传入参数x的值。由于这段代码较为简单，因此它极大可能被编译为寄存器之间的移动指令（即将输入参数 <code>x</code> 的值移至寄存器eax中）。这与原本的内存访问指令相比，显然要高效得多。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(Foo o, int x) {</span></span>
<span class="line"><span>  o.a = x;</span></span>
<span class="line"><span>  return x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么即时编译器是否能够作出类似的自动优化呢？</p><h2 id="字段读取优化" tabindex="-1">字段读取优化 <a class="header-anchor" href="#字段读取优化" aria-label="Permalink to &quot;字段读取优化&quot;">​</a></h2><p>答案是可以的。即时编译器会优化实例字段以及静态字段访问，以减少总的内存访问数目。具体来说，它将沿着控制流，缓存各个字段存储节点将要存储的值，或者字段读取节点所得到的值。</p><p>当即时编译器遇到对同一字段的读取节点时，如果缓存值还没有失效，那么它会将读取节点替换为该缓存值。</p><p>当即时编译器遇到对同一字段的存储节点时，它会更新所缓存的值。当即时编译器遇到可能更新字段的节点时，如方法调用节点（在即时编译器看来，方法调用会执行未知代码），或者内存屏障节点（其他线程可能异步更新了字段），那么它会采取保守的策略，舍弃所有缓存值。</p><p>在前面的例子中，我们见识了缓存字段存储节点的情况。下面我们来看一下缓存字段读取节点的情况。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(Foo o, int x) {</span></span>
<span class="line"><span>  int y = o.a + x;</span></span>
<span class="line"><span>  return o.a + y;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这段代码中，实例字段 <code>Foo.a</code> 将被读取两次。即时编译器会将第一次读取的值缓存起来，并且替换第二次字段读取操作，以节省一次内存访问。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(Foo o, int x) {</span></span>
<span class="line"><span>  int t = o.a;</span></span>
<span class="line"><span>  int y = t + x;</span></span>
<span class="line"><span>  return t + y;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果字段读取节点被替换成一个常量，那么它将进一步触发更多优化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(Foo o, int x) {</span></span>
<span class="line"><span>  o.a = 1;</span></span>
<span class="line"><span>  if (o.a &gt;= 0)</span></span>
<span class="line"><span>    return x;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    return -x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>例如在上面这段代码中，实例字段 <code>Foo.a</code> 会被赋值为1。接下来的if语句将判断同一实例字段是否不小于0。经过字段读取优化之后， <code>&gt;=</code> 节点的两个输入参数分别为常数1和0，因此可以直接替换为具体结果 <code>true</code>。如此一来，else分支将变成不可达代码，可以直接删除，其优化结果如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bar(Foo o, int x) {</span></span>
<span class="line"><span>  o.a = 1;</span></span>
<span class="line"><span>  return x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再来看另一个例子。下面这段代码的 <code>bar</code> 方法中，实例字段 <code>a</code> 会被赋值为 <code>true</code>，后面紧跟着一个以 <code>a</code> 为条件的while循环。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Foo {</span></span>
<span class="line"><span>  boolean a;</span></span>
<span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = true;</span></span>
<span class="line"><span>    while (a) {}</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  void whatever() { a = false; }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>同样，即时编译器会将while循环中读取实例字段 <code>a</code> 的操作直接替换为常量 <code>true</code>，即下面代码所示的死循环。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = true;</span></span>
<span class="line"><span>    while (true) {}</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>// 生成的机器码将陷入这一死循环中</span></span>
<span class="line"><span>0x066b: mov    r11,QWORD PTR [r15+0x70] // 安全点测试</span></span>
<span class="line"><span>0x066f: test   DWORD PTR [r11],eax      // 安全点测试</span></span>
<span class="line"><span>0x0672: jmp    0x066b                   // while (true)</span></span></code></pre></div><p>在介绍Java内存模型时，我们便知道可以通过volatile关键字标记实例字段 <code>a</code>，以此强制对它的读取。</p><p>实际上，即时编译器将在volatile字段访问前后插入内存屏障节点。这些内存屏障节点会阻止即时编译器将屏障之前所缓存的值用于屏障之后的读取节点之上。</p><p>就我们的例子而言，尽管在X86_64平台上，volatile字段读取操作前后的内存屏障是no-op，在即时编译过程中的屏障节点，还是会阻止即时编译器的字段读取优化，强制在循环中使用内存读取指令访问实例字段 <code>Foo.a</code> 的最新值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>0x00e0: movzx  r11d,BYTE PTR [rbx+0xc]   // 读取a</span></span>
<span class="line"><span>0x00e5: mov    r10,QWORD PTR [r15+0x70]  // 安全点测试</span></span>
<span class="line"><span>0x00e9: test   DWORD PTR [r10],eax       // 安全点测试</span></span>
<span class="line"><span>0x00ec: test   r11d,r11d                 // while (a)</span></span>
<span class="line"><span>0x00ef: jne    0x00e0                    // while (a)</span></span></code></pre></div><p>同理，加锁、解锁操作也同样会阻止即时编译器的字段读取优化。</p><h2 id="字段存储优化" tabindex="-1">字段存储优化 <a class="header-anchor" href="#字段存储优化" aria-label="Permalink to &quot;字段存储优化&quot;">​</a></h2><p>除了字段读取优化之外，即时编译器还将消除冗余的存储节点。如果一个字段先后被存储了两次，而且这两次存储之间没有对第一次存储内容的读取，那么即时编译器可以将第一个字段存储给消除掉。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Foo {</span></span>
<span class="line"><span>  int a = 0;</span></span>
<span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = 1;</span></span>
<span class="line"><span>    a = 2;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举例来说，上面这段代码中的 <code>bar</code> 方法先后存储了两次 <code>Foo.a</code> 实例字段。由于第一次存储之后没有读取 <code>Foo.a</code> 的值，因此，即时编译器会将其看成冗余存储，并将之消除掉，生成如下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = 2;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>实际上，即便是在这两个字段存储操作之间读取该字段，即时编译器还是有可能在字段读取优化的帮助下，将第一个存储操作当成冗余存储给消除掉。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Foo {</span></span>
<span class="line"><span>  int a = 0;</span></span>
<span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = 1;</span></span>
<span class="line"><span>    int t = a;</span></span>
<span class="line"><span>    a = t + 2;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 优化为</span></span>
<span class="line"><span>class Foo {</span></span>
<span class="line"><span>  int a = 0;</span></span>
<span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = 1;</span></span>
<span class="line"><span>    int t = 1;</span></span>
<span class="line"><span>    a = t + 2;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 进一步优化为</span></span>
<span class="line"><span>class Foo {</span></span>
<span class="line"><span>  int a = 0;</span></span>
<span class="line"><span>  void bar() {</span></span>
<span class="line"><span>    a = 3;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然，如果所存储的字段被标记为volatile，那么即时编译器也不能将冗余的存储操作消除掉。</p><p>这种情况看似很蠢，但实际上并不少见，比如说两个存储之间隔着许多其他代码，或者因为方法内联的缘故，将两个存储操作（如构造器中字段的初始化以及随后的更新）纳入同一个编译单元里。</p><h2 id="死代码消除" tabindex="-1">死代码消除 <a class="header-anchor" href="#死代码消除" aria-label="Permalink to &quot;死代码消除&quot;">​</a></h2><p>除了字段存储优化之外，局部变量的死存储（dead store）同样也涉及了冗余存储。这是死代码消除（dead code eliminiation）的一种。不过，由于Sea-of-Nodes IR的特性，死存储的优化无须额外代价。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(int x, int y) {</span></span>
<span class="line"><span>  int t = x*y;</span></span>
<span class="line"><span>  t = x+y;</span></span>
<span class="line"><span>  return t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这段代码涉及两个存储局部变量操作。当即时编译器将其转换为Sea-of-Nodes IR之后，没有节点依赖于t的第一个值 <code>x*y</code>。因此，该乘法运算将被消除，其结果如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(int x, int y) {</span></span>
<span class="line"><span>  return x+y;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>死存储还有一种变体，即在部分程序路径上有冗余存储。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(boolean f, int x, int y) {</span></span>
<span class="line"><span>  int t = x*y;</span></span>
<span class="line"><span>  if (f)</span></span>
<span class="line"><span>    t = x+y;</span></span>
<span class="line"><span>  return t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举个例子，上面这段代码中，如果所传入的boolean类型的参数 <code>f</code> 是 <code>true</code>，那么在程序执行路径上将先后进行两次对局部变量 <code>t</code> 的存储。</p><p>同样，经过Sea-of-Nodes IR转换之后，返回节点所依赖的值是一个phi节点，将根据程序路径选择 <code>x+y</code> 或者 <code>x*y</code>。也就是说，当 <code>f</code> 为 <code>true</code> 的程序路径上的乘法运算会被消除，其结果如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(boolean f, int x, int y) {</span></span>
<span class="line"><span>  int t;</span></span>
<span class="line"><span>  if (f)</span></span>
<span class="line"><span>    t = x+y;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    t = x*y;</span></span>
<span class="line"><span>  return t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另一种死代码消除则是不可达分支消除。不可达分支就是任何程序路径都不可到达的分支，我们之前已经多次接触过了。</p><p>在即时编译过程中，我们经常因为方法内联、常量传播以及基于profile的优化等，生成许多不可达分支。通过消除不可达分支，即时编译器可以精简数据流，并且减少编译时间以及最终生成机器码的大小。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(int x) {</span></span>
<span class="line"><span>  if (false)</span></span>
<span class="line"><span>    return x;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    return -x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举个例子，在上面的代码中，if语句将一直跳转至else分支之中。因此，另一不可达分支可以直接消除掉，形成下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(int x) {</span></span>
<span class="line"><span>  return -x;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结与实践" tabindex="-1">总结与实践 <a class="header-anchor" href="#总结与实践" aria-label="Permalink to &quot;总结与实践&quot;">​</a></h2><p>今天我介绍了即时编译器关于字段访问的优化方式，以及死代码消除。</p><p>即时编译器将沿着控制流缓存字段存储、读取的值，并在接下来的字段读取操作时直接使用该缓存值。</p><p>这要求生成缓存值的访问以及使用缓存值的读取之间没有方法调用、内存屏障，或者其他可能存储该字段的节点。</p><p>即时编译器还会优化冗余的字段存储操作。如果一个字段的两次存储之间没有对该字段的读取操作、方法调用以及内存屏障，那么即时编译器可以将第一个冗余的存储操作给消除掉。</p><p>此外，我还介绍了死代码消除的两种形式。第一种是局部变量的死存储消除以及部分死存储消除。它们可以通过转换为Sea-of-Nodes IR来完成。第二种则是不可达分支。通过消除不可达分支，即时编译器可以精简数据流，并且减少编译时间以及最终生成机器码的大小。</p><p>今天的实践环节，请思考即时编译器会怎么优化下面代码中的除法操作？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int bar(int x, int y) {</span></span>
<span class="line"><span>  int t = x/y;</span></span>
<span class="line"><span>  t = x+y;</span></span>
<span class="line"><span>  return t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>[1] <a href="https://en.wikipedia.org/wiki/X86_calling_conventions#System_V_AMD64_ABI" target="_blank" rel="noreferrer">https://en.wikipedia.org/wiki/X86_calling_conventions#System_V_AMD64_ABI</a></p>`,78)])])}const u=a(l,[["render",i]]);export{b as __pageData,u as default};
