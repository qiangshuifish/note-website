import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"08 | smart_ptr：智能指针到底“智能”在哪里？","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是智能指针？","slug":"什么是智能指针","link":"#什么是智能指针","children":[]},{"level":2,"title":"认识unique_ptr","slug":"认识unique-ptr","link":"#认识unique-ptr","children":[]},{"level":2,"title":"unique_ptr的所有权","slug":"unique-ptr的所有权","link":"#unique-ptr的所有权","children":[]},{"level":2,"title":"认识shared_ptr","slug":"认识shared-ptr","link":"#认识shared-ptr","children":[]},{"level":2,"title":"shared_ptr的注意事项","slug":"shared-ptr的注意事项","link":"#shared-ptr的注意事项","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"课下作业","slug":"课下作业","link":"#课下作业","children":[]}],"relativePath":"罗剑锋的C++实战笔记/08-smart_ptr：智能指针到底“智能”在哪里？.md","filePath":"罗剑锋的C++实战笔记/08-smart_ptr：智能指针到底“智能”在哪里？.md","lastUpdated":1779821799000}'),t={name:"罗剑锋的C++实战笔记/08-smart_ptr：智能指针到底“智能”在哪里？.md"};function l(i,s,r,o,c,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_08-smart-ptr-智能指针到底-智能-在哪里" tabindex="-1">08 | smart_ptr：智能指针到底“智能”在哪里？ <a class="header-anchor" href="#_08-smart-ptr-智能指针到底-智能-在哪里" aria-label="Permalink to &quot;08 | smart_ptr：智能指针到底“智能”在哪里？&quot;">​</a></h1><p>你好，我是Chrono。</p><p>上节课在讲const的时候，说到const可以修饰指针，不过今天我要告诉你：请忘记这种用法，在现代C++中，绝对不要再使用“裸指针（naked pointer）”了，而是应该使用“智能指针（smart pointer）”。</p><p>你肯定或多或少听说过、用过智能指针，也可能看过实现源码，那么，你心里有没有一种疑惑，智能指针到底“智能”在哪里？难道它就是解决一切问题的“灵丹妙药”吗？</p><p>学完了今天的这节课，我想你就会有个明确的答案了。</p><h2 id="什么是智能指针" tabindex="-1">什么是智能指针？ <a class="header-anchor" href="#什么是智能指针" aria-label="Permalink to &quot;什么是智能指针？&quot;">​</a></h2><p>所谓的“智能指针”，当然是相对于“不智能指针”，也就是“裸指针”而言的。</p><p>所以，我们就先来看看裸指针，它有时候也被称为原始指针，或者直接简称为指针。</p><p>指针是源自C语言的概念，本质上是一个内存地址索引，代表了一小片内存区域（也可能会很大），能够直接读写内存。</p><p>因为它完全映射了计算机硬件，所以操作效率高，是C/C++高效的根源。当然，这也是引起无数麻烦的根源。访问无效数据、指针越界，或者内存分配后没有及时释放，就会导致运行错误、内存泄漏、资源丢失等一系列严重的问题。</p><p>其他的编程语言，比如Java、Go就没有这方面的顾虑，因为它们内置了一个“垃圾回收”机制，会检测不再使用的内存，自动释放资源，让程序员不必为此费心。</p><p>其实，C++里也是有垃圾回收的，不过不是Java、Go那种严格意义上的垃圾回收，而是广义上的垃圾回收，这就是 <strong>构造/析构函数</strong> 和 <strong>RAII惯用法</strong>（Resource Acquisition Is Initialization）。</p><p>我们可以应用代理模式，把裸指针包装起来，在构造函数里初始化，在析构函数里释放。这样当对象失效销毁时，C++就会 <strong>自动</strong> 调用析构函数，完成内存释放、资源回收等清理工作。</p><p>和Java、Go相比，这算是一种“微型”的垃圾回收机制，而且回收的时机完全“自主可控”，非常灵活。当然也有一点代价——你必须要针对每一个资源手写包装代码，又累又麻烦。</p><p>智能指针就是代替你来干这些“脏活累活”的。它完全实践了RAII，包装了裸指针，而且因为重载了*和-&gt;操作符，用起来和原始指针一模一样。</p><p>不仅如此，它还综合考虑了很多现实的应用场景，能够自动适应各种复杂的情况，防止误用指针导致的隐患，非常“聪明”，所以被称为“智能指针”。</p><p>常用的有两种智能指针，分别是 <strong>unique_ptr</strong> 和 <strong>shared_ptr</strong>，下面我就来分别介绍一下。</p><h2 id="认识unique-ptr" tabindex="-1">认识unique_ptr <a class="header-anchor" href="#认识unique-ptr" aria-label="Permalink to &quot;认识unique\\_ptr&quot;">​</a></h2><p>unique_ptr是最简单、最容易使用的一个智能指针，在声明的时候必须用模板参数指定类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unique_ptr&amp;lt;int&amp;gt; ptr1(new int(10));      // int智能指针</span></span>
<span class="line"><span>assert(*ptr1 == 10);                     // 可以使用*取内容</span></span>
<span class="line"><span>assert(ptr1 != nullptr);                // 可以判断是否为空指针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>unique_ptr&amp;lt;string&amp;gt; ptr2(new string(&quot;hello&quot;));  // string智能指针</span></span>
<span class="line"><span>assert(*ptr2 == &quot;hello&quot;);                // 可以使用*取内容</span></span>
<span class="line"><span>assert(ptr2-&amp;gt;size() == 5);               // 可以使用-&amp;gt;调用成员函数</span></span></code></pre></div><p>你需要注意的是，unique_ptr虽然名字叫指针，用起来也很像，但 <strong>它实际上并不是指针，而是一个对象。所以，不要企图对它调用delete，它会自动管理初始化时的指针，在离开作用域时析构释放内存。</strong></p><p>另外，它也没有定义加减运算，不能随意移动指针地址，这就完全避免了指针越界等危险操作，可以让代码更安全：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ptr1++;                        // 导致编译错误</span></span>
<span class="line"><span>ptr2 += 2;                     // 导致编译错误</span></span></code></pre></div><p>除了调用delete、加减运算，初学智能指针还有一个容易犯的错误是把它当成普通对象来用，不初始化，而是声明后直接使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unique_ptr&amp;lt;int&amp;gt; ptr3;                // 未初始化智能指针</span></span>
<span class="line"><span>*ptr3 = 42 ;</span><span>                         // 错误！操作了空指针</span></span></code></pre></div><p>未初始化的unique_ptr表示空指针，这样就相当于直接操作了空指针，运行时就会产生致命的错误（比如core dump）。</p><p>为了避免这种低级错误，你可以调用工厂函数 <strong>make_unique()</strong>，强制创建智能指针的时候必须初始化。同时还可以利用自动类型推导（ <a href="https://time.geekbang.org/column/article/237964" target="_blank" rel="noreferrer">第6讲</a>）的auto，少写一些代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto ptr3 = make_unique&amp;lt;int&amp;gt;(42);               // 工厂函数创建智能指针</span></span>
<span class="line"><span>assert(ptr3 &amp;&amp; *ptr3 == 42);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ptr4 = make_unique&amp;lt;string&amp;gt;(&quot;god of war&quot;);  // 工厂函数创建智能指针</span></span>
<span class="line"><span>assert(!ptr4-&amp;gt;empty());</span></span></code></pre></div><p>不过，make_unique()要求C++14，好在它的原理比较简单。如果你使用的是C++11，也可以自己实现一个简化版的make_unique()，可以参考下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&amp;lt;class T, class... Args&amp;gt;              // 可变参数模板</span></span>
<span class="line"><span>std::unique_ptr&amp;lt;T&amp;gt;                            // 返回智能指针</span></span>
<span class="line"><span>my_make_unique(Args&amp;&amp;... args)                // 可变参数模板的入口参数</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return std::unique_ptr&amp;lt;T&amp;gt;(                // 构造智能指针</span></span>
<span class="line"><span>            new T(std::forward&amp;lt;Args&amp;gt;(args)...));    // 完美转发</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="unique-ptr的所有权" tabindex="-1">unique_ptr的所有权 <a class="header-anchor" href="#unique-ptr的所有权" aria-label="Permalink to &quot;unique\\_ptr的所有权&quot;">​</a></h2><p>使用unique_ptr的时候还要特别注意指针的“ <strong>所有权</strong>”问题。</p><p>正如它的名字，表示指针的所有权是“唯一”的，不允许共享，任何时候只能有一个“人”持有它。</p><p>为了实现这个目的，unique_ptr应用了C++的“转移”（move）语义，同时禁止了拷贝赋值，所以，在向另一个unique_ptr赋值的时候，要特别留意，必须用 <strong>std::move()</strong> 函数显式地声明所有权转移。</p><p>赋值操作之后，指针的所有权就被转走了，原来的unique_ptr变成了空指针，新的unique_ptr接替了管理权，保证所有权的唯一性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto ptr1 = make_unique&amp;lt;int&amp;gt;(42);    // 工厂函数创建智能指针</span></span>
<span class="line"><span>assert(ptr1 &amp;&amp; *ptr1 == 42);         // 此时智能指针有效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ptr2 = std::move(ptr1);         // 使用move()转移所有权</span></span>
<span class="line"><span>assert(!ptr1 &amp;&amp; ptr2);               // ptr1变成了空指针</span></span></code></pre></div><p>如果你对右值、转移这些概念不是太理解，也没关系，它们用起来也的确比较“微妙”，这里你只要记住， <strong>尽量不要对unique_ptr执行赋值操作</strong> 就好了，让它“自生自灭”，完全自动化管理。</p><h2 id="认识shared-ptr" tabindex="-1">认识shared_ptr <a class="header-anchor" href="#认识shared-ptr" aria-label="Permalink to &quot;认识shared\\_ptr&quot;">​</a></h2><p>接下来要说的是shared_ptr，它是一个比unique_ptr更“智能”的智能指针。</p><p>初看上去shared_ptr和unique_ptr差不多，也可以使用工厂函数来创建，也重载了*和-&gt;操作符，用法几乎一样——只是名字不同，看看下面的代码吧：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>shared_ptr&amp;lt;int&amp;gt; ptr1(new int(10));     // int智能指针</span></span>
<span class="line"><span>assert(*ptr1 == 10);                    // 可以使用*取内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>shared_ptr&amp;lt;string&amp;gt; ptr2(new string(&quot;hello&quot;));  // string智能指针</span></span>
<span class="line"><span>assert(*ptr2 == &quot;hello&quot;);                      // 可以使用*取内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ptr3 = make_shared&amp;lt;int&amp;gt;(42);  // 工厂函数创建智能指针</span></span>
<span class="line"><span>assert(ptr3 &amp;&amp; *ptr3 == 42);       // 可以判断是否为空指针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ptr4 = make_shared&amp;lt;string&amp;gt;(&quot;zelda&quot;);  // 工厂函数创建智能指针</span></span>
<span class="line"><span>assert(!ptr4-&amp;gt;empty());                   // 可以使用-&amp;gt;调用成员函数</span></span></code></pre></div><p>但shared_ptr的名字明显表示了它与unique_ptr的最大不同点： <strong>它的所有权是可以被安全共享的</strong>，也就是说支持拷贝赋值，允许被多个“人”同时持有，就像原始指针一样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto ptr1 = make_shared&amp;lt;int&amp;gt;(42);    // 工厂函数创建智能指针</span></span>
<span class="line"><span>assert(ptr1 &amp;&amp; ptr1.unique() );     // 此时智能指针有效且唯一</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto ptr2 = ptr1;                  // 直接拷贝赋值，不需要使用move()</span></span>
<span class="line"><span>assert(ptr1 &amp;&amp; ptr2);              // 此时两个智能指针均有效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(ptr1 == ptr2);             // shared_ptr可以直接比较</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 两个智能指针均不唯一，且引用计数为2</span></span>
<span class="line"><span>assert(!ptr1.unique() &amp;&amp; ptr1.use_count() == 2);</span></span>
<span class="line"><span>assert(!ptr2.unique() &amp;&amp; ptr2.use_count() == 2);</span></span></code></pre></div><p>shared_ptr支持安全共享的秘密在于 <strong>内部使用了“引用计数”</strong>。</p><p>引用计数最开始的时候是1，表示只有一个持有者。如果发生拷贝赋值——也就是共享的时候，引用计数就增加，而发生析构销毁的时候，引用计数就减少。只有当引用计数减少到0，也就是说，没有任何人使用这个指针的时候，它才会真正调用delete释放内存。</p><p>因为shared_ptr具有完整的“值语义”（即可以拷贝赋值），所以， <strong>它可以在任何场合替代原始指针，而不用再担心资源回收的问题</strong>，比如用于容器存储指针、用于函数安全返回动态创建的对象，等等。</p><h2 id="shared-ptr的注意事项" tabindex="-1">shared_ptr的注意事项 <a class="header-anchor" href="#shared-ptr的注意事项" aria-label="Permalink to &quot;shared\\_ptr的注意事项&quot;">​</a></h2><p>那么，既然shared_ptr这么好，是不是就可以只用它而不再考虑unique_ptr了呢？</p><p>答案当然是否定的，不然也就没有必要设计出来多种不同的智能指针了。</p><p>虽然shared_ptr非常“智能”，但天下没有免费的午餐，它也是有代价的， <strong>引用计数的存储和管理都是成本</strong>，这方面是shared_ptr不如unique_ptr的地方。</p><p>如果不考虑应用场合，过度使用shared_ptr就会降低运行效率。不过，你也不需要太担心，shared_ptr内部有很好的优化，在非极端情况下，它的开销都很小。</p><p>另外一个要注意的地方是 <strong>shared_ptr的销毁动作</strong>。</p><p>因为我们把指针交给了shared_ptr去自动管理，但在运行阶段，引用计数的变动是很复杂的，很难知道它真正释放资源的时机，无法像Java、Go那样明确掌控、调整垃圾回收机制。</p><p>你要特别小心对象的析构函数，不要有非常复杂、严重阻塞的操作。一旦shared_ptr在某个不确定时间点析构释放资源，就会阻塞整个进程或者线程，“整个世界都会静止不动”（也许用过Go的同学会深有体会）。这也是我以前遇到的实际案例，排查起来费了很多功夫，真的是“血泪教训”。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class DemoShared final      //  危险的类，不定时的地雷</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    DemoShared() = default;</span></span>
<span class="line"><span>   ~DemoShared()            // 复杂的操作会导致shared_ptr析构时世界静止</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>       // Stop The World ...</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>shared_ptr的引用计数也导致了一个新的问题，就是“ <strong>循环引用</strong>”，这在把shared_ptr作为类成员的时候最容易出现，典型的例子就是 <strong>链表节点</strong>。</p><p>下面的代码演示了一个简化的场景：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Node final</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    using this_type     = Node;</span></span>
<span class="line"><span>    using shared_type   = std::shared_ptr&amp;lt;this_type&amp;gt;;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    shared_type     next;      // 使用智能指针来指向下一个节点</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto n1 = make_shared&amp;lt;Node&amp;gt;();   // 工厂函数创建智能指针</span></span>
<span class="line"><span>auto n2 = make_shared&amp;lt;Node&amp;gt;();   // 工厂函数创建智能指针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(n1.use_count() == 1);    // 引用计数为1</span></span>
<span class="line"><span>assert(n2.use_count() == 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>n1-&amp;gt;next = n2;                 // 两个节点互指，形成了循环引用</span></span>
<span class="line"><span>n2-&amp;gt;next = n1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(n1.use_count() == 2);    // 引用计数为2</span></span>
<span class="line"><span>assert(n2.use_count() == 2);    // 无法减到0，无法销毁，导致内存泄漏</span></span></code></pre></div><p>在这里，两个节点指针刚创建时，引用计数是1，但指针互指（即拷贝赋值）之后，引用计数都变成了2。</p><p>这个时候，shared_ptr就“犯傻”了，意识不到这是一个循环引用，多算了一次计数，后果就是引用计数无法减到0，无法调用析构函数执行delete，最终导致内存泄漏。</p><p>这个例子很简单，你一下子就能看出存在循环引用。但在实际开发中，指针的关系可不像例子那么清晰，很有可能会不知不觉形成一个链条很长的循环引用，复杂到你根本无法识别，想要找出来基本上是不可能的。</p><p>想要从根本上杜绝循环引用，光靠shared_ptr是不行了，必须要用到它的“小帮手”： <strong>weak_ptr</strong>。</p><p>weak_ptr顾名思义，功能很“弱”。它专门为打破循环引用而设计，只观察指针，不会增加引用计数（弱引用），但在需要的时候，可以调用成员函数lock()，获取shared_ptr（强引用）。</p><p>刚才的例子里，只要你改用weak_ptr，循环引用的烦恼就会烟消云散：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Node final</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    using this_type     = Node;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 注意这里，别名改用weak_ptr</span></span>
<span class="line"><span>    using shared_type   = std::weak_ptr&amp;lt;this_type&amp;gt;;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    shared_type     next;    // 因为用了别名，所以代码不需要改动</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto n1 = make_shared&amp;lt;Node&amp;gt;();  // 工厂函数创建智能指针</span></span>
<span class="line"><span>auto n2 = make_shared&amp;lt;Node&amp;gt;();  // 工厂函数创建智能指针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>n1-&amp;gt;next = n2;             // 两个节点互指，形成了循环引用</span></span>
<span class="line"><span>n2-&amp;gt;next = n1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>assert(n1.use_count() == 1);    // 因为使用了weak_ptr，引用计数为1</span></span>
<span class="line"><span>assert(n2.use_count() == 1);   // 打破循环引用，不会导致内存泄漏</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (!n1-&amp;gt;next.expired()) {     // 检查指针是否有效</span></span>
<span class="line"><span>    auto ptr = n1-&amp;gt;next.lock();  // lock()获取shared_ptr</span></span>
<span class="line"><span>    assert(ptr == n2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天就先到这里。智能指针的话题很大，但是学习的时候我们不可能一下子把所有知识点都穷尽，而是要有优先级。所以我会捡最要紧的先介绍给你，剩下的接口函数等细节，还是需要你根据自己的情况，再去参考一些其他资料深入学习的。</p><p>我们来回顾一下这节课的重点。</p><ol><li>智能指针是代理模式的具体应用，它使用RAII技术代理了裸指针，能够自动释放内存，无需程序员干预，所以被称为“智能指针”。</li><li>如果指针是“独占”使用，就应该选择unique_ptr，它为裸指针添加了很多限制，更加安全。</li><li>如果指针是“共享”使用，就应该选择shared_ptr，它的功能非常完善，用法几乎与原始指针一样。</li><li>应当使用工厂函数make_unique()、make_shared()来创建智能指针，强制初始化，而且还能使用auto来简化声明。</li><li>shared_ptr有少量的管理成本，也会引发一些难以排查的错误，所以不要过度使用。</li></ol><p>我还有一个很重要的建议：</p><p><strong>既然你已经理解了智能指针，就尽量不要再使用裸指针、new和delete来操作内存了</strong>。</p><p>如果严格遵守这条建议，用好unique_ptr、shared_ptr，那么，你的程序就不可能出现内存泄漏，你也就不需要去费心研究、使用valgrind等内存调试工具了，生活也会更“美好”一点。</p><h2 id="课下作业" tabindex="-1">课下作业 <a class="header-anchor" href="#课下作业" aria-label="Permalink to &quot;课下作业&quot;">​</a></h2><p>最后是课下作业时间，给你留两个思考题：</p><ol><li>你觉得unique_ptr和shared_ptr的区别有哪些？列举一下。</li><li>你觉得应该如何在程序里“消灭”new和delete？</li></ol><p>欢迎你在留言区写下你的思考和答案，如果觉得今天的内容对你有所帮助，也欢迎分享给你的朋友，我们下节课见。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/239580/e5298af2501d0156fcc50d50cdb82351.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/239580/e5298af2501d0156fcc50d50cdb82351.jpg" alt=""></a></p>`,77)])])}const g=a(t,[["render",l]]);export{h as __pageData,g as default};
