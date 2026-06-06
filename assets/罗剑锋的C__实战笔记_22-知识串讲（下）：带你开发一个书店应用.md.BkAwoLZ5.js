import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"22 | 知识串讲（下）：带你开发一个书店应用","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据定义","slug":"数据定义","link":"#数据定义","children":[]},{"level":2,"title":"序列化","slug":"序列化","link":"#序列化","children":[]},{"level":2,"title":"数据存储与统计","slug":"数据存储与统计","link":"#数据存储与统计","children":[]},{"level":2,"title":"服务端主线程","slug":"服务端主线程","link":"#服务端主线程","children":[]},{"level":2,"title":"数据外发线程","slug":"数据外发线程","link":"#数据外发线程","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"课下作业","slug":"课下作业","link":"#课下作业","children":[]}],"relativePath":"罗剑锋的C++实战笔记/22-知识串讲（下）：带你开发一个书店应用.md","filePath":"罗剑锋的C++实战笔记/22-知识串讲（下）：带你开发一个书店应用.md","lastUpdated":1779821799000}'),l={name:"罗剑锋的C++实战笔记/22-知识串讲（下）：带你开发一个书店应用.md"};function t(i,a,c,r,o,d){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_22-知识串讲-下-带你开发一个书店应用" tabindex="-1">22 | 知识串讲（下）：带你开发一个书店应用 <a class="header-anchor" href="#_22-知识串讲-下-带你开发一个书店应用" aria-label="Permalink to &quot;22 | 知识串讲（下）：带你开发一个书店应用&quot;">​</a></h1><p>你好，我是Chrono。</p><p>在上节课里，我给出了一个书店程序的例子，讲了项目设计、类图和自旋锁、Lua配置文件解析等工具类，搭建出了应用的底层基础。</p><p>今天，我接着讲剩下的主要业务逻辑部分，也就是数据的表示与统计，还有数据的接收和发送主循环，最终开发出完整的应用程序。</p><p>这里我再贴一下项目的UML图，希望给你提个醒。借助图形，我们往往能够更好地把握程序的总体结构。</p><p>图中间标注为绿色的两个类SalesData、Summary和两个lambda表达式recv_cycle、log_cycle是今天这节课的主要内容，实现了书店程序的核心业务逻辑，所以需要你重点关注它。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252118/f08637cf6b49316c230d058cb2a9f5ef.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252118/f08637cf6b49316c230d058cb2a9f5ef.jpg" alt=""></a></p><h2 id="数据定义" tabindex="-1">数据定义 <a class="header-anchor" href="#数据定义" aria-label="Permalink to &quot;数据定义&quot;">​</a></h2><p>首先，我们来看一下怎么表示书本的销售记录。这里用的是SalesData类，它是书店程序数据统计的基础。</p><p>如果是实际的项目，SalesData会很复杂，因为一本书的相关信息有很多。但是，我们的这个例子只是演示，所以就简化了一些，基本的成员只有三个：ID号、销售册数和销售金额。</p><p>上节课，在讲自旋锁、配置文件等类时，我只是重点说了说代码内部逻辑，没有完整地细说，到底该怎么应用前面讲过的那些C++编码准则。</p><p>那么，这次在定义SalesData类的时候，我就集中归纳一下。这些都是我写C++代码时的“惯用法”，你也可以在自己的代码里应用它们，让代码更可读可维护：</p><ul><li>适当使用空行分隔代码里的逻辑段落；</li><li>类名使用CamelCase，函数和变量用snake_case，成员变量加“m_”前缀；</li><li>在编译阶段使用静态断言，保证整数、浮点数的精度；</li><li>使用final终结类继承体系，不允许别人产生子类；</li><li>使用default显示定义拷贝构造、拷贝赋值、转移构造、转移赋值等重要函数；</li><li>使用委托构造来编写多个不同形式的构造函数；</li><li>成员变量在声明时直接初始化；</li><li>using定义类型别名；</li><li>使用const来修饰常函数；</li><li>使用noexcept标记不抛出异常，优化函数。</li></ul><p>列的点比较多，你可以对照着源码来进行理解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class SalesData final                   // final禁止继承</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  using this_type = SalesData;         // 自己的类型别名</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  using string_type       = std::string;         // 外部的类型别名</span></span>
<span class="line"><span>  using string_view_type  = const std::string&amp;;</span></span>
<span class="line"><span>  using uint_type         = unsigned int;</span></span>
<span class="line"><span>  using currency_type     = double;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  STATIC_ASSERT(sizeof(uint_type) &amp;gt;= 4);          // 静态断言</span></span>
<span class="line"><span>  STATIC_ASSERT(sizeof(currency_type) &amp;gt;= 4);</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  SalesData(string_view_type id, uint_type s, currency_type r) noexcept         // 构造函数，保证不抛出异常</span></span>
<span class="line"><span>      : m_id(id), m_sold(s), m_revenue(r)</span></span>
<span class="line"><span>  {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SalesData(string_view_type id) noexcept         // 委托构造</span></span>
<span class="line"><span>      : SalesData(id, 0, 0)</span></span>
<span class="line"><span>  {}</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  SalesData() = default;                 // 显式default</span></span>
<span class="line"><span> ~SalesData() = default;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SalesData(const this_type&amp;) = default;</span></span>
<span class="line"><span>  SalesData&amp; operator=(const this_type&amp;) = default;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SalesData(this_type&amp;&amp; s) = default;  // 显式转移构造</span></span>
<span class="line"><span>  SalesData&amp; operator=(this_type&amp;&amp; s) = default;</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  string_type m_id        = &quot;&quot;;         // 成员变量初始化</span></span>
<span class="line"><span>  uint_type   m_sold      = 0;</span></span>
<span class="line"><span>  uint_type   m_revenue   = 0;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  void inc_sold(uint_type s) noexcept        // 不抛出异常</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>      m_sold += s;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  string_view_type id() const noexcept       // 常函数，不抛出异常</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>      return m_id;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uint_type sold() const noexcept           // 常函数，不抛出异常</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>      return m_sold;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>需要注意的是，代码里显式声明了转移构造和转移赋值函数，这样，在放入容器的时候就避免了拷贝，能提高运行效率。</p><h2 id="序列化" tabindex="-1">序列化 <a class="header-anchor" href="#序列化" aria-label="Permalink to &quot;序列化&quot;">​</a></h2><p>SalesData作为销售记录，需要在网络上传输，所以就需要序列化和反序列化。</p><p>这里我选择的是MessagePack（ <a href="https://time.geekbang.org/column/article/245880" target="_blank" rel="noreferrer">第15讲</a>），我看重的是它小巧轻便的特性，而且用起来也很容易，只要在类定义里添加一个宏，就可以实现序列化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  MSGPACK_DEFINE(m_id, m_sold, m_revenue);  // 实现MessagePack序列化功能</span></span></code></pre></div><p>为了方便使用，还可以为SalesData增加一个专门序列化的成员函数pack()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  msgpack::sbuffer pack() const          // 成员函数序列化</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>      msgpack::sbuffer sbuf;</span></span>
<span class="line"><span>      msgpack::pack(sbuf, *this);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      return sbuf;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>不过你要注意，写这个函数的同时也给SalesData类增加了点复杂度，在一定程度上违反了单一职责原则和接口隔离原则。</p><p>如果你在今后的实际项目中遇到类似的问题，就要权衡后再做决策，确认引入新功能带来的好处大于它增加的复杂度，尽量抵制扩充接口的诱惑，否则很容易写出“巨无霸”类。</p><h2 id="数据存储与统计" tabindex="-1">数据存储与统计 <a class="header-anchor" href="#数据存储与统计" aria-label="Permalink to &quot;数据存储与统计&quot;">​</a></h2><p>有了销售记录之后，我们就可以定义用于数据存储和统计的Summary类了。</p><p>Summary类依然要遵循刚才的那些基本准则。从UML类图里可以看到，它关联了好几个类，所以类型别名对于它来说就特别重要，不仅可以简化代码，也方便后续的维护，你可要仔细看一下源码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Summary final                       // final禁止继承</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  using this_type = Summary;               // 自己的类型别名</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  using sales_type        = SalesData;       // 外部的类型别名</span></span>
<span class="line"><span>  using lock_type         = SpinLock;</span></span>
<span class="line"><span>  using lock_guard_type   = SpinLockGuard;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  using string_type       = std::string;</span></span>
<span class="line"><span>  using map_type          =                  // 容器类型定义</span></span>
<span class="line"><span>          std::map&amp;lt;string_type, sales_type&amp;gt;;</span></span>
<span class="line"><span>  using minmax_sales_type =</span></span>
<span class="line"><span>          std::pair&amp;lt;string_type, string_type&amp;gt;;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  Summary() = default;                   // 显式default</span></span>
<span class="line"><span> ~Summary() = default;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Summary(const this_type&amp;) = delete;    // 显式delete</span></span>
<span class="line"><span>  Summary&amp; operator=(const this_type&amp;) = delete;</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  mutable lock_type   m_lock;            // 自旋锁</span></span>
<span class="line"><span>  map_type            m_sales;           // 存储销售记录</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>Summary类的职责是存储大量的销售记录，所以需要选择恰当的容器。</p><p>考虑到销售记录不仅要存储，还有对数据的排序要求，所以我选择了可以在插入时自动排序的有序容器map。</p><p>不过要注意，这里我没有定制比较函数，所以默认是按照书号来排序的，不符合按销售量排序的要求。</p><p>（如果要按销售量排序的话就比较麻烦，因为不能用随时变化的销量作为Key，而标准库里又没有多索引容器，所以，你可以试着把它改成unordered_map，然后再用vector暂存来排序）。</p><p>为了能够在多线程里正确访问，Summary使用自旋锁来保护核心数据，在对容器进行任何操作前都要获取锁。锁不影响类的状态，所以要用mutable修饰。</p><p>因为有了RAII的SpinLockGuard（第21讲），所以自旋锁用起来很优雅，直接构造一个变量就行，不用担心异常安全的问题。你可以看一下成员函数add_sales()的代码，里面还用到了容器的查找算法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  void add_sales(const sales_type&amp; s)       // 非const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    lock_guard_type guard(m_lock);          // 自动锁定，自动解锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const auto&amp; id = s.id();                // const auto自动类型推导</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (m_sales.find(id) == m_sales.end()) {// 查找算法</span></span>
<span class="line"><span>        m_sales[id] = s;                    // 没找到就添加元素</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m_sales[id].inc_sold(s.sold());        // 找到就修改销售量</span></span>
<span class="line"><span>    m_sales[id].inc_revenue(s.revenue());</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>Summary类里还有一个特别的统计功能，计算所有图书销量的第一名和最后一名。这用到了minmax_element算法（ <a href="https://time.geekbang.org/column/article/243357" target="_blank" rel="noreferrer">第13讲</a>）。又因为比较规则是销量，而不是ID号，所以还要用lambda表达式自定义比较函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>  minmax_sales_type minmax_sales() const    //常函数</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    lock_guard_type guard(m_lock);          // 自动锁定，自动解锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (m_sales.empty()) {                  // 容器空则不处理</span></span>
<span class="line"><span>      return minmax_sales_type();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto ret = std::minmax_element(        // 求最大最小值</span></span>
<span class="line"><span>      std::begin(m_sales), std::end(m_sales),// 全局函数获取迭代器</span></span>
<span class="line"><span>      [](const auto&amp; a, const auto&amp; b)    // 匿名lambda表达式</span></span>
<span class="line"><span>      {</span></span>
<span class="line"><span>          return a.second.sold() &amp;lt; b.second.sold();</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto min_pos = ret.first;            // 返回的是两个迭代器位置</span></span>
<span class="line"><span>    auto max_pos = ret.second;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {min_pos-&amp;gt;second.id(), max_pos-&amp;gt;second.id()};</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="服务端主线程" tabindex="-1">服务端主线程 <a class="header-anchor" href="#服务端主线程" aria-label="Permalink to &quot;服务端主线程&quot;">​</a></h2><p>好了，所有的功能类都开发完了，现在就可以把它们都组合起来了。</p><p>因为客户端程序比较简单，只是序列化，再用ZMQ发送，所以我就不讲了，你可以课下去看 <a href="https://github.com/chronolaw/cpp_study/blob/master/section5/client.cpp" target="_blank" rel="noreferrer">GitHub</a> 上的源码，今天我主要讲服务器端。</p><p>在main()函数开头，首先要加载配置文件，然后是数据存储类Summary，再定义一个用来计数的原子变量count（ <a href="https://time.geekbang.org/column/article/245259" target="_blank" rel="noreferrer">第14讲</a>），这些就是程序运行的全部环境数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Config conf;                  // 封装读取Lua配置文件</span></span>
<span class="line"><span>conf.load(&quot;./conf.lua&quot;);      // 解析配置文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Summary sum;                  // 数据存储和统计</span></span>
<span class="line"><span>std::atomic_int count {0};    // 计数用的原子变量</span></span></code></pre></div><p>接下来的服务器主循环，我使用了lambda表达式，引用捕获上面的那些变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto recv_cycle = [&amp;]()      // 主循环lambda表达式</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	...</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>主要的业务逻辑其实很简单，就是ZMQ接收数据，然后MessagePack反序列化，存储数据。</p><p>不过为了避免阻塞、充分利用多线程，我在收到数据后，就把它包装进智能指针，再扔到另外一个线程里去处理了。这样主循环就只接收数据，不会因为反序列化、插入、排序等大计算量的工作而阻塞。</p><p>我在代码里加上了详细的注释，你一定要仔细看、认真理解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto recv_cycle = [&amp;]()               // 主循环lambda表达式</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  using zmq_ctx = ZmqContext&amp;lt;1&amp;gt;;       // ZMQ的类型别名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  auto sock = zmq_ctx::recv_sock();   // 自动类型推导获得接收Socket</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  sock.bind(                           // 绑定ZMQ接收端口</span></span>
<span class="line"><span>    conf.get&amp;lt;string&amp;gt;(&quot;config.zmq_ipc_addr&quot;));   // 读取Lua配置文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for(;;) {                           // 服务器无限循环</span></span>
<span class="line"><span>    auto msg_ptr =                   // 自动类型推导获得智能指针</span></span>
<span class="line"><span>      std::make_shared&amp;lt;zmq_message_type&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sock.recv(msg_ptr.get());        // ZMQ阻塞接收数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ++count;                          // 增加原子计数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    std::thread(            // 再启动一个线程反序列化存储，没有用async</span></span>
<span class="line"><span>    [&amp;sum, msg_ptr]()                // 显式捕获，注意！！</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        SalesData book;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        auto obj = msgpack::unpack(      // 反序列化</span></span>
<span class="line"><span>                    msg_ptr-&amp;gt;data&amp;lt;char&amp;gt;(), msg_ptr-&amp;gt;size()).get();</span></span>
<span class="line"><span>        obj.convert(book);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        sum.add_sales(book);            // 存储数据</span></span>
<span class="line"><span>    }).detach();                        // 分离线程，异步运行</span></span>
<span class="line"><span>  }                                     // for(;;)结束</span></span>
<span class="line"><span>};                                      // recv_cycle lambda</span></span></code></pre></div><p>你要特别注意lambda表达式与智能指针的配合方式，要用值捕获而不能是引用捕获，否则，在线程运行的时候，智能指针可能会因为离开作用域而被销毁，引用失效，导致无法预知的错误。</p><p>有了这个lambda，现在就可以用async（ <a href="https://time.geekbang.org/column/article/245259" target="_blank" rel="noreferrer">第14讲</a>）来启动服务循环：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto fu1 = std::async(std::launch::async, recv_cycle);</span></span>
<span class="line"><span>fu1.wait();</span></span></code></pre></div><p>现在我们就能够接收客户端发过来的数据，开始统计了。</p><h2 id="数据外发线程" tabindex="-1">数据外发线程 <a class="header-anchor" href="#数据外发线程" aria-label="Permalink to &quot;数据外发线程&quot;">​</a></h2><p>recv_cycle是接收前端发来的数据，我们还需要一个线程把统计数据外发出去。同样，我实现一个lambda表达式：log_cycle。</p><p>它采用了HTTP协议，把数据打包成JSON，发送到后台的某个RESTful服务器。</p><p>搭建符合要求的Web服务不是件小事，所以这里为了方便测试，我联动了一下《透视HTTP协议》，用那里的OpenResty写了个的HTTP接口：接收POST数据，然后打印到日志里，你可以参考 <a href="https://time.geekbang.org/column/article/146833" target="_blank" rel="noreferrer">第41讲</a> 在Linux上搭建这个后台服务。</p><p>log_cycle其实就是一个简单的HTTP客户端，所以代码的处理逻辑比较好理解，要注意的知识点主要有三个，都是前面讲过的：</p><ul><li>读取Lua配置中的HTTP服务器地址和周期运行时间（ <a href="https://time.geekbang.org/column/article/245905" target="_blank" rel="noreferrer">第17讲</a>）；</li><li>JSON序列化数据（ <a href="https://time.geekbang.org/column/article/245880" target="_blank" rel="noreferrer">第15讲</a>）；</li><li>HTTP客户端发送请求（ <a href="https://time.geekbang.org/column/article/245900" target="_blank" rel="noreferrer">第16讲</a>）。</li></ul><p>你如果有点忘了，可以回顾一下，再结合下面的代码来理解、学习：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto log_cycle = [&amp;]()              // 外发循环lambda表达式</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  // 获取Lua配置文件里的配置项</span></span>
<span class="line"><span>  auto http_addr = conf.get&amp;lt;string&amp;gt;(&quot;config.http_addr&quot;);</span></span>
<span class="line"><span>  auto time_interval = conf.get&amp;lt;int&amp;gt;(&quot;config.time_interval&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for(;;) {                        // 无限循环</span></span>
<span class="line"><span>    std::this_thread::sleep_for(time_interval * 1s);  // 线程睡眠等待</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    json_t j;                        // JSON序列化数据</span></span>
<span class="line"><span>    j[&quot;count&quot;] = static_cast&amp;lt;int&amp;gt;(count);</span></span>
<span class="line"><span>    j[&quot;minmax&quot;] = sum.minmax_sales();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto res = cpr::Post(            // 发送HTTP POST请求</span></span>
<span class="line"><span>               cpr::Url{http_addr},</span></span>
<span class="line"><span>               cpr::Body{j.dump()},</span></span>
<span class="line"><span>               cpr::Timeout{200ms}  // 设置超时时间</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (res.status_code != 200) {    // 检查返回的状态码</span></span>
<span class="line"><span>        cerr &amp;lt;&amp;lt; &quot;http post failed&quot; &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }                                   // for(;;)</span></span>
<span class="line"><span>};                                    // log_cycle lambda</span></span></code></pre></div><p>然后，还是要在主线程里用async()函数来启动这个lambda表达式，让它在后台定时上报数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto fu2 = std::async(std::launch::async, log_cycle);</span></span></code></pre></div><p>这样，整个书店程序就全部完成了，试着去编译运行一下看看吧。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>好了，今天我就把书店示例程序从头到尾给讲完了。可以看到，代码里面应用了很多我们之前讲的C++特性，这些特性互相重叠、嵌套，紧凑地集成在了这个不是很大的程序里，代码整齐，逻辑清楚，很容易就实现了多线程、高性能的服务端程序，开发效率和运行效率都非常高。</p><p>我再对今天代码里的要点做个简单的小结：</p><ol><li>编写类的时候要用好final、default、using、const等关键字，从代码细节着手提高效率和安全性；</li><li>对于中小型项目，序列化格式可以选择小巧高效的MessagePack；</li><li>在存储数据时，应当选择恰当的容器，有序容器在插入元素时会自动排序，但注意排序的依据只能是Key；</li><li>在使用lambda表达式的时候，要特别注意捕获变量的生命周期，如果是在线程里异步执行，应当尽量用智能指针的值捕获，虽然有点麻烦，但比较安全。</li></ol><p>那么，这些代码是否对你的工作有一些启迪呢？你是否能够把这些知识点成功地应用到实际项目里呢？希望你能多学习我在课程里给你分享的开发技巧和经验建议，熟练地掌握它们，写出媲美甚至超越示例代码的C++程序。</p><h2 id="课下作业" tabindex="-1">课下作业 <a class="header-anchor" href="#课下作业" aria-label="Permalink to &quot;课下作业&quot;">​</a></h2><p>最后是课下作业时间，这次就不是思考题，全是动手题，是时候检验你的编码实战能力了：</p><ol><li>添加try-catch，处理可能发生的异常（ <a href="https://time.geekbang.org/column/article/240292" target="_blank" rel="noreferrer">第9讲</a>）；</li><li>写一个动态库，用Lua/Python调用C++发送请求，以脚本的方式简化客户端测试（ <a href="https://time.geekbang.org/column/article/245905" target="_blank" rel="noreferrer">第17讲</a>）；</li><li>把前端与服务器的数据交换格式改成JSON或者ProtoBuf（ <a href="https://time.geekbang.org/column/article/245880" target="_blank" rel="noreferrer">第15讲</a>），然后用工厂类封装序列化和反序列化功能，隔离接口（ <a href="https://time.geekbang.org/column/article/248880" target="_blank" rel="noreferrer">第19讲</a>、 <a href="https://time.geekbang.org/column/article/248883" target="_blank" rel="noreferrer">第20讲</a>）。</li></ol><p>再补充一点，在动手实践的过程中，你还可以顺便练习一下Git的版本管理：不要直接在master分支上开发，而是开几个不同的feature分支，测试完确认没有问题后，再合并到主干上。</p><p>欢迎你在留言区写下你的思考和答案，如果觉得今天的内容对你有所帮助，也欢迎分享给你的朋友。我们下节课见。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252118/d11b4c0f976109451d21bde86fdf6b0a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BD%97%E5%89%91%E9%94%8B%E7%9A%84C%2B%2B%E5%AE%9E%E6%88%98%E7%AC%94%E8%AE%B0/images/252118/d11b4c0f976109451d21bde86fdf6b0a.jpg" alt=""></a></p>`,74)])])}const g=s(l,[["render",t]]);export{m as __pageData,g as default};
