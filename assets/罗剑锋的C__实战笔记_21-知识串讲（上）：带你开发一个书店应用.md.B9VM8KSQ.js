import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"21 | 知识串讲（上）：带你开发一个书店应用","description":"","frontmatter":{},"headers":[{"level":2,"title":"项目设计","slug":"项目设计","link":"#项目设计","children":[]},{"level":2,"title":"核心头文件","slug":"核心头文件","link":"#核心头文件","children":[]},{"level":2,"title":"自旋锁","slug":"自旋锁","link":"#自旋锁","children":[]},{"level":2,"title":"网络通信","slug":"网络通信","link":"#网络通信","children":[]},{"level":2,"title":"配置文件解析","slug":"配置文件解析","link":"#配置文件解析","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"课下作业","slug":"课下作业","link":"#课下作业","children":[]}],"relativePath":"罗剑锋的C++实战笔记/21-知识串讲（上）：带你开发一个书店应用.md","filePath":"罗剑锋的C++实战笔记/21-知识串讲（上）：带你开发一个书店应用.md","lastUpdated":1779821799000}'),l={name:"罗剑锋的C++实战笔记/21-知识串讲（上）：带你开发一个书店应用.md"};function t(i,s,c,o,r,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_21-知识串讲-上-带你开发一个书店应用" tabindex="-1">21 | 知识串讲（上）：带你开发一个书店应用 <a class="header-anchor" href="#_21-知识串讲-上-带你开发一个书店应用" aria-label="Permalink to &quot;21 | 知识串讲（上）：带你开发一个书店应用&quot;">​</a></h1><p>你好，我是Chrono。</p><p>到今天为止，课程里的C++知识就全部讲完了。前面我们总共学习了四大模块，我再带你做一个简略的回顾。</p><p>在“概论”单元，我带你从宏观的层面上重新认识了C++，讲了它的四个生命周期和五个编程范式，分别介绍了在编码阶段、预处理阶段、编译阶段，C++能够做哪些事情，接着又重点说了在C++里，运用哪些特性才能更好地实践面向对象编程。</p><p>在“语言特性”单元，我们一起研究了自动类型推导、常量、智能指针、异常、函数式编程这五个特性。这些特性是“现代”C++区别于“传统”C++的关键，掌握了它们，你就能够写出清晰、易读、安全的代码。</p><p>在“标准库”单元，我介绍了字符串、容器、算法和并发。它们是C++标准库中最核心的部分，也是现代C++和泛型编程的最佳应用和范例。学会了标准库，你才能说是真正理解了C++。</p><p>在“技能进阶”单元，我为你挑选出了一些第三方工具，包括序列化、网络通信、脚本语言和性能分析，它们很好地补充完善了C++语言和标准库，免去了我们“自己造轮子”的麻烦，让我们把精力集中在实现业务逻辑上。</p><p>除了上面的这“十八般武艺”，我还谈了谈能够帮你更好地运用C++的设计模式和设计原则，介绍了几个比较重要、常用的模式，希望你在今后的实际开发工作中，能够有意识地写出灵活、可扩展的代码。</p><p>这么回顾下来，内容还真是不少啊。</p><p>为了让你更好地把这些知识融会贯通，接下来我会再用两节课的时间，从需求、设计，到开发编码、编译运行，再加上一些我自己的实用小技巧，详细讲解一个C++程序的实际开发过程，把知识点都串联起来。</p><p>虽然说是“串讲”，但是你只要学过了前面的内容，就可以跟着我做出这个书店程序。不过，我担心有些知识点你可能忘记了，所以，涉及到具体的知识点时，我会给你标注出是在哪一节，你可以随时回去复习一下。</p><h2 id="项目设计" tabindex="-1">项目设计 <a class="header-anchor" href="#项目设计" aria-label="Permalink to &quot;项目设计&quot;">​</a></h2><p>那么，该用个什么样的例子来串讲C++的这些知识点呢？</p><p>说实话，找出一个合适的例子真的很难。因为大多数C++实际项目都很大、很底层，还有各种依赖或者内部库，不好直接学习研究。</p><p>所以我再三考虑，决定借鉴一下 <em>C++ Primer</em> 里的书店例子，修改一下它的需求，然后完全重新开发，作为我们这个课程的综合示例。</p><p>先介绍一下咱们这个书店程序。简单来说，就是销售记录管理，从多个渠道把书号、销售册数、销售额都汇总起来，做个统计分析，再把数据定期上报到后台。</p><p><em>C++ Primer</em> 里的书店程序是本地运行的，为了演示课程里讲到的的C++特性，我把它改成了网络版。不过，拓扑结构并不复杂，我画了张图，你可以看一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252107/62632ba7426af7731902c83724504097.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252107/62632ba7426af7731902c83724504097.png" alt=""></a></p><p>项目的前期需求就算是定下来了，接着就要开始做设计了，这就要用到设计模式和设计原则的知识了（ <a href="https://time.geekbang.org/column/article/248880" target="_blank" rel="noreferrer">第19讲</a>、 <a href="https://time.geekbang.org/column/article/248883" target="_blank" rel="noreferrer">第20讲</a>）。</p><p>不过这个系统还是比较简单的，不需要用什么复杂的分析手段，就能够得出设计，主要应用的是单一职责原则、接口隔离原则和包装外观模式。这里我也画了一个UML图，可以帮助你理解程序的架构。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252107/f08637cf6b49316c230d058cb2a9f5ef.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252107/f08637cf6b49316c230d058cb2a9f5ef.jpg" alt=""></a></p><p>下面我就对照这个UML类图，结合开发思路和源码，仔细说一下具体的C++开发，完整的源码都放在了 <a href="https://github.com/chronolaw/cpp_study/tree/master/section5" target="_blank" rel="noreferrer">GitHub</a> 上，课下可以仔细地看一下。</p><h2 id="核心头文件" tabindex="-1">核心头文件 <a class="header-anchor" href="#核心头文件" aria-label="Permalink to &quot;核心头文件&quot;">​</a></h2><p>首先要说的是我写C++项目的一个习惯，定义核心头文件： <strong>cpplang.hpp</strong>。它集中了C++标准头和语言相关的定义，被用于其他所有的源文件。</p><p>注意，在写它的时候，最好要有文件头注释（ <a href="https://time.geekbang.org/column/article/233689" target="_blank" rel="noreferrer">第2讲</a>），而且要有“Include guard”（ <a href="https://time.geekbang.org/column/article/233711" target="_blank" rel="noreferrer">第3讲</a>），就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Copyright (c) 2020 by Chrono</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifndef _CPP_LANG_HPP</span><span>        // Include guard</span></span>
<span class="line"><span>#define _CPP_LANG_HPP</span><span>        // Include guard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &amp;lt;cassert&amp;gt;</span><span>           // C++标准头文件</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#endif</span><span>  //_CPP_LANG_HPP</span></span></code></pre></div><p>在核心头文件里，我们还可以利用预处理编程，使用宏定义、条件编译来屏蔽操作系统、语言版本的差异，增强程序的兼容性。</p><p>比如，这里我就检查了C++的版本号，然后定义了简化版的“deprecated”和“static_assert”：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// must be C++11 or later</span></span>
<span class="line"><span>#if __cplusplus &amp;lt; 201103</span></span>
<span class="line"><span>#   error &quot;C++ is too old&quot;</span></span>
<span class="line"><span>#endif</span><span>  // __cplusplus &amp;lt; 201103</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// [[deprecated]]</span></span>
<span class="line"><span>#if __cplusplus &amp;gt;= 201402</span></span>
<span class="line"><span>#   define  CPP_DEPRECATED [[deprecated]]</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>#   define  CPP_DEPRECATED [[gnu::deprecated]]</span></span>
<span class="line"><span>#endif</span><span>  // __cplusplus &amp;gt;= 201402</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// static_assert</span></span>
<span class="line"><span>#if __cpp_static_assert &amp;gt;= 201411</span></span>
<span class="line"><span>#   define STATIC_ASSERT(x) static_assert(x)</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>#   define STATIC_ASSERT(x) static_assert(x, #x)</span></span>
<span class="line"><span>#endif</span></span></code></pre></div><h2 id="自旋锁" tabindex="-1">自旋锁 <a class="header-anchor" href="#自旋锁" aria-label="Permalink to &quot;自旋锁&quot;">​</a></h2><p>有了核心头文件之后，我们的C++程序就有了一个很好的起点，就可以考虑引入多线程，提高吞吐量，减少阻塞。</p><p>在多线程里保护数据一般要用到互斥量（Mutex），但它的代价太高，所以我设计了一个自旋锁，它使用了原子变量，所以成本低，效率高（ <a href="https://time.geekbang.org/column/article/245259" target="_blank" rel="noreferrer">第14讲</a>）。</p><p>自旋锁被封装为一个SpinLock类，所以就要遵循一些C++里常用的面向对象的设计准则（ <a href="https://time.geekbang.org/column/article/235301" target="_blank" rel="noreferrer">第5讲</a>、 <a href="https://time.geekbang.org/column/article/248880" target="_blank" rel="noreferrer">第19讲</a>），比如用final禁止继承、用default/delete显式标记构造/析构函数、成员变量初始化、类型别名，等等，你可以看看代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SpinLock final                        // 自旋锁类</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    using this_type   = SpinLock;          // 类型别名</span></span>
<span class="line"><span>    using atomic_type = std::atomic_flag;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    SpinLock() = default;                 // 默认构造函数</span></span>
<span class="line"><span>   ~SpinLock() = default;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    SpinLock(const this_type&amp;) = delete;  // 禁止拷贝</span></span>
<span class="line"><span>    SpinLock&amp; operator=(const this_type&amp;) = delete;</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    atomic_type m_lock {false};            // 成员变量初始化</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在编写成员函数的时候，为了尽量高效，需要给函数都加上noexcept修饰，表示绝不会抛出异常（ <a href="https://time.geekbang.org/column/article/240292" target="_blank" rel="noreferrer">第9讲</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  void lock() noexcept              // 自旋锁定，绝不抛出异常</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    for(;;) {                      // 无限循环</span></span>
<span class="line"><span>      if (!m_lock.test_and_set()) { // 原子变量的TAS操作</span></span>
<span class="line"><span>          return;                  // TAS成功则锁定</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      std::this_thread::yield();   // TAS失败则让出线程</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void unlock() noexcept           // 解除自旋锁定，绝不抛出异常</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    m_lock.clear();</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>为了保证异常安全，在任何时候都不会死锁，还需要利用RAII技术再编写一个LockGuard类。它在构造时锁定，在析构时解锁，这两个函数也应该用noexcept来优化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SpinLockGuard final                      // 自旋锁RAII类，自动解锁</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    using this_type      = SpinLockGuard;      // 类型别名</span></span>
<span class="line"><span>    using spin_lock_type = SpinLock;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    SpinLockGuard(const this_type&amp;) = delete;  // 禁止拷贝</span></span>
<span class="line"><span>    SpinLockGuard&amp; operator=(const this_type&amp;) = delete;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    SpinLockGuard(spin_lock_type&amp; lock) noexcept</span></span>
<span class="line"><span>        : m_lock(lock)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        m_lock.lock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ~SpinLockGuard() noexcept</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>       m_lock.unlock();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    spin_lock_type&amp; m_lock;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这样自旋锁就完成了，有了它就可以在多线程应用里保护共享的数据，避免数据竞争。</p><h2 id="网络通信" tabindex="-1">网络通信 <a class="header-anchor" href="#网络通信" aria-label="Permalink to &quot;网络通信&quot;">​</a></h2><p>自旋锁比较简单，但多线程只是书店程序的基本特性，它的核心关键词是“网络”，所以下面就来看看服务里的“重头”部分：网络通信。</p><p>正如我之前说的，在现代C++里，应当避免直接使用原生Socket来编写网络通信程序（ <a href="https://time.geekbang.org/column/article/245900" target="_blank" rel="noreferrer">第16讲</a>）。这里我选择ZMQ作为底层通信库，它不仅方便易用，而且能够保证消息不丢失、完整可靠地送达目的地。</p><p>程序里使用ZmqContext类来封装底层接口（包装外观），它是一个模板类，整数模板参数用来指定线程数，在编译阶段就固定了ZMQ的多线程处理能力。</p><p>对于ZMQ必需的运行环境变量（单件），我使用了一个小技巧： <strong>以静态成员函数来代替静态成员变量</strong>。这样就绕过了C++的语言限制，不必在实现文件“*.cpp”里再写一遍变量定义，全部的代码都可以集中在hpp头文件里：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&amp;lt;int thread_num = 1&amp;gt;        // 使用整数模板参数来指定线程数</span></span>
<span class="line"><span>class ZmqContext final</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    static                          // 静态成员函数代替静态成员变量</span></span>
<span class="line"><span>    zmq_context_type&amp; context()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        static zmq_context_type ctx(thread_num);</span></span>
<span class="line"><span>        return ctx;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>然后，我们要实现两个静态工厂函数，创建收发数据的Socket对象。</p><p>这里要注意，如果你看zmq.hpp的源码，就会发现，它的内部实际上是使用了异常来处理错误的。所以，这里我们不能在函数后面加上noexcept修饰，同时也就意味着，在使用ZMQ的时候，必须要考虑异常处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  static</span></span>
<span class="line"><span>  zmq_socket_type recv_sock(int hwm = 1000)    // 创建接收Socket</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    zmq_socket_type sock(context(), ZMQ_PULL); // 可能抛出异常</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sock.setsockopt(ZMQ_RCVHWM, hwm);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return sock;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static</span></span>
<span class="line"><span>  zmq_socket_type send_sock(int hwm = 1000)   // 创建发送Socket</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    zmq_socket_type sock(context(), ZMQ_PUSH); // 可能抛出异常</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sock.setsockopt(ZMQ_SNDHWM, hwm);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return sock;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>现在，有了ZmqContext类，书店程序的网络基础也就搭建出来了，后面就可以用它来收发数据了。</p><h2 id="配置文件解析" tabindex="-1">配置文件解析 <a class="header-anchor" href="#配置文件解析" aria-label="Permalink to &quot;配置文件解析&quot;">​</a></h2><p>接下来，我要说的是解析配置文件的类Config。</p><p>大多数程序都会用到配置文件来保存运行时的各种参数，常见的格式有INI、XML、JSON，等等。但我通常会选择把Lua嵌入C++，用Lua脚本写配置文件（ <a href="https://time.geekbang.org/column/article/242603" target="_blank" rel="noreferrer">第17讲</a>）。</p><p>这么做的好处在哪里呢？</p><p>Lua是一个完备的编程语言，所以写起来就非常自由灵活，比如添加任意的注释，数字可以写成“m × n”的运算形式。而INI、XML这些配置格式只是纯粹的数据，很难做到这样，很多时候需要在程序里做一些转换工作。</p><p>另外，在Lua脚本里，我们还能基于Lua环境写一些函数，校验数据的有效性，或者采集系统信息，实现动态配置。</p><p>总而言之，就是把Lua当作一个“可编程的配置语言”，让配置“活起来”。</p><p>给你看一下配置文件的代码吧，里面包含了几个简单的值，配置了服务器的地址、时间间隔、缓冲区大小等信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>config = {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    -- should be same as client</span></span>
<span class="line"><span>    -- you could change it to ipc</span></span>
<span class="line"><span>    zmq_ipc_addr = &quot;tcp://127.0.0.1:5555&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    -- see http_study&#39;s lua code</span></span>
<span class="line"><span>    http_addr = &quot;http://localhost/cpp_study?token=cpp&amp;#64;2020&quot;,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    time_interval = 5,  -- seconds</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    max_buf_size = 4 * 1024,</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Config类使用shared_ptr来管理Lua虚拟机（ <a href="https://time.geekbang.org/column/article/245905" target="_blank" rel="noreferrer">第17讲</a>），因为封装在类里，所以，你要注意类型别名和成员变量初始化的用法（ <a href="https://time.geekbang.org/column/article/235301" target="_blank" rel="noreferrer">第5讲</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Config final                  // 封装读取Lua配置文件</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    using vm_type      = std::shared_ptr&amp;lt;lua_State&amp;gt;;   // 类型别名</span></span>
<span class="line"><span>    using value_type   = luabridge::LuaRef;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    Config() noexcept               // 构造函数</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        assert(m_vm);</span></span>
<span class="line"><span>        luaL_openlibs(m_vm.get());  // 打开Lua基本库</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   ~Config() = default;             // 默认析构函数</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    vm_type     m_vm                 // 类型别名定义Lua虚拟机</span></span>
<span class="line"><span>      {luaL_newstate(), lua_close};  // 成员变量初始化</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>加载Lua脚本的时候还要注意一点，外部的脚本有可能会写错，导致Lua解析失败。但因为这个问题极少出现，而且一出现就很严重，没有配置就无法走后续的流程，所以非常适合用异常来处理（ <a href="https://time.geekbang.org/column/article/240292" target="_blank" rel="noreferrer">第9讲</a>）。</p><p>load()函数不会改变虚拟机成员变量，所以应该用const修饰，是一个常函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  void load(string_view_type filename) const  // 解析配置文件</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    auto status = luaL_dofile(m_vm.get(), filename.c_str());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (status != 0) {                       // 出错就抛出异常</span></span>
<span class="line"><span>        throw std::runtime_error(&quot;failed to parse config&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>为了访问Lua配置文件里的值，我决定采用“key1.key2”这样简单的两级形式，有点像INI的小节，这也正好对应Lua里的表结构。</p><p>想要解析出字符串里的前后两个key，可以使用正则表达式（ <a href="https://time.geekbang.org/column/article/242603" target="_blank" rel="noreferrer">第11讲</a>），然后再去查询Lua表。</p><p>因为构造正则表达式的成本很高，所以我把正则对象都定义为成员变量，而不是函数里的局部变量。</p><p>正则的匹配结果（m_what）是“临时”的，不会影响常量性，所以要给它加上mutable修饰。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private:</span></span>
<span class="line"><span>  const   regex_type  m_reg {R&quot;(^(\\w+)\\.(\\w+)$)&quot;};</span></span>
<span class="line"><span>  mutable match_type  m_what;              // 注意是mutable</span></span></code></pre></div><p>在C++正则库的帮助下，处理字符串就太轻松了，拿到两个key，再调用LuaBridge就可以获得Lua脚本里的配置项。</p><p>不过，为了进一步简化客户代码，我把get()函数改成了模板函数，显式转换成int、string等C++标准类型，可读性、可维护性会更好。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  template&amp;lt;typename T&amp;gt;                    // 转换配置值的类型</span></span>
<span class="line"><span>  T get(string_view_type key) const      // const常函数</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (!std::regex_match(key, m_what, m_reg)) {  // 正则匹配</span></span>
<span class="line"><span>        throw std::runtime_error(&quot;config key error&quot;);// 格式错误抛异常</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto w1 = m_what[1].str();            // 取出两个key</span></span>
<span class="line"><span>    auto w2 = m_what[2].str();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto v = getGlobal(                  // 获取Lua表</span></span>
<span class="line"><span>                m_vm.get(), w1.c_str());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return LuaRef_cast&amp;lt;T&amp;gt;(v[w2]);        // 取表里的值，再做类型转换</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>到这里呢，Config类也就完成了，可以轻松解析Lua格式的配置文件。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我用一个书店程序作为例子，把前面的知识点都串联起来，应用到了这个“半真实”的项目里，完成了UML类图里的外围部分。你也可以把刚才说的核心头文件、自旋锁、Lua配置文件这些用法放到自己的实际项目里去试试。</p><p>简单小结一下今天的内容：</p><ol><li>在项目起始阶段，应该认真做需求分析，然后应用设计模式和设计原则，得出灵活、可扩展的面向对象系统；</li><li>C++项目里最好要有一个核心头文件（cpplang.hpp），集中定义所有标准头和语言特性，规范源文件里的C++使用方式；</li><li>使用原子变量（atomic）可以实现自旋锁，比互斥量的成本要低，更高效；</li><li>使用ZMQ可以简化网络通信，但要注意它使用了异常来处理错误；</li><li>使用Lua脚本作为配置文件的好处很多，是“可编程的配置文件”；</li><li>在编写代码时要理解、用好C++特性，恰当地使用final、default、const等关键字，让代码更安全、更可读，有利于将来的维护。</li></ol><p>今天，我们分析了需求，设计出了架构，开发了一些工具类，但还没有涉及业务逻辑代码，下节课，我会带你看看容器、算法、线程，还有lambda表达式的实践应用，看看它们是怎么服务于具体业务的。</p><h2 id="课下作业" tabindex="-1">课下作业 <a class="header-anchor" href="#课下作业" aria-label="Permalink to &quot;课下作业&quot;">​</a></h2><p>最后是课下作业时间，给你留一个思考题：你能说出，程序里是怎么应用设计模式和设计原则的吗？</p><p>欢迎你在留言区写下你的思考和答案，如果觉得今天的内容对你有所帮助，也欢迎分享给你的朋友。我们下节课见。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252107/9b2d2c8285643a9202d822639fffe8e9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252107/9b2d2c8285643a9202d822639fffe8e9.png" alt=""></a></p>`,81)])])}const g=a(l,[["render",t]]);export{h as __pageData,g as default};
