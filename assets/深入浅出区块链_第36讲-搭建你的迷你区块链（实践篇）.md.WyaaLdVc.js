import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"第36讲 | 搭建你的迷你区块链（实践篇）","description":"","frontmatter":{},"headers":[{"level":2,"title":"代码编写","slug":"代码编写","link":"#代码编写","children":[{"level":3,"title":"代码编写1 Server","slug":"代码编写1-server","link":"#代码编写1-server","children":[]},{"level":3,"title":"代码编写2 node","slug":"代码编写2-node","link":"#代码编写2-node","children":[]},{"level":3,"title":"代码编写3 blockchain","slug":"代码编写3-blockchain","link":"#代码编写3-blockchain","children":[]},{"level":3,"title":"代码编写4 network","slug":"代码编写4-network","link":"#代码编写4-network","children":[]},{"level":3,"title":"代码编写5 consensus","slug":"代码编写5-consensus","link":"#代码编写5-consensus","children":[]},{"level":3,"title":"代码编写6 database","slug":"代码编写6-database","link":"#代码编写6-database","children":[]},{"level":3,"title":"代码编写7 commands","slug":"代码编写7-commands","link":"#代码编写7-commands","children":[]},{"level":3,"title":"代码编写8 基础类","slug":"代码编写8-基础类","link":"#代码编写8-基础类","children":[]}]},{"level":2,"title":"首次运行","slug":"首次运行","link":"#首次运行","children":[]},{"level":2,"title":"首次挖矿","slug":"首次挖矿","link":"#首次挖矿","children":[]},{"level":2,"title":"第一笔交易","slug":"第一笔交易","link":"#第一笔交易","children":[]},{"level":2,"title":"分叉与合并","slug":"分叉与合并","link":"#分叉与合并","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"深入浅出区块链/第36讲-搭建你的迷你区块链（实践篇）.md","filePath":"深入浅出区块链/第36讲-搭建你的迷你区块链（实践篇）.md","lastUpdated":1779821079000}'),l={name:"深入浅出区块链/第36讲-搭建你的迷你区块链（实践篇）.md"};function t(i,s,c,o,r,h){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="第36讲-搭建你的迷你区块链-实践篇" tabindex="-1">第36讲 | 搭建你的迷你区块链（实践篇） <a class="header-anchor" href="#第36讲-搭建你的迷你区块链-实践篇" aria-label="Permalink to &quot;第36讲 | 搭建你的迷你区块链（实践篇）&quot;">​</a></h1><p>上一篇文章中，我们介绍了实现一个迷你区块链的大致思路。今天，我们将通过代码编写，以及简单的功能测试，来完成我们的迷你区块链Tinychain。</p><p>除了正常的测试案例之外，我们还可以构造一些极端测试案例，来观察Tinychain的分叉合并，挖矿难度调整等情况。</p><h2 id="代码编写" tabindex="-1">代码编写 <a class="header-anchor" href="#代码编写" aria-label="Permalink to &quot;代码编写&quot;">​</a></h2><p>通过前文的分析，\b我们已经了解到了实践一个迷你区块链的大致思路。接下来，我将从顶层到底层来搭建区块链。</p><h3 id="代码编写1-server" tabindex="-1">代码编写1 Server <a class="header-anchor" href="#代码编写1-server" aria-label="Permalink to &quot;代码编写1 Server&quot;">​</a></h3><p>从链的顶层设计来看，我们需要一个入口，那么我们就从入口开始：我需要先为整个服务做一些基础设置，最后再来Server.run()。</p><p>所以，我们的代码大概是这样子的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// server setup</span></span>
<span class="line"><span>node my_node;</span></span>
<span class="line"><span>mgbubble::RestServ Server{&quot;webroot&quot;, my_node};</span></span>
<span class="line"><span>auto&amp; conn = Server.bind(&quot;0.0.0.0:8000&quot;);</span></span>
<span class="line"><span>mg_set_protocol_http_websocket(&amp;conn);</span></span>
<span class="line"><span>log::info(&quot;main&quot;)&lt;&lt;&quot;httpserver started&quot;;</span></span>
<span class="line"><span>Server.run();</span></span></code></pre></div><p>我们首先生成一个node实例，然后被Server\b装载进去，最后设置好Server启动。</p><p>这个Server主要有两个功用，第一是向本地用户服务，也就是接受命令行，接受本地RPC调用；第二是接受外部网络传送进来是的新交易，和新的区块。所以Server是整个节点的入口。</p><h3 id="代码编写2-node" tabindex="-1">代码编写2 node <a class="header-anchor" href="#代码编写2-node" aria-label="Permalink to &quot;代码编写2 node&quot;">​</a></h3><p>那么这里的node其实就是区块链的node，里面包含了区块链的基本设置，这些一般都是硬编码在代码中的，例如\b一般区块链都有个“魔法数”，实际上就是区块链ID，这个ID会被放在所有消息的开头，如果区块链ID不匹配，则抛弃接收到的消息。</p><p>这里的区块链ID我们设置在这里。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>blockchain(uint16_t id = 3721):id_(id) {</span></span>
<span class="line"><span>    id_ = id;</span></span>
<span class="line"><span>    create_genesis_block();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码中所展示的id_就是区块链ID，在Tinychain的案例中，我也是硬编码的。</p><p>在一个node当中，至少要包含network、blockchain、miner三个模块。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>    void miner_run(address_t address);</span></span>
<span class="line"><span>    blockchain&amp; chain() { return blockchain_; }</span></span>
<span class="line"><span>    network&amp; p2p() { return network_; }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private:</span></span>
<span class="line"><span>    network network_;</span></span>
<span class="line"><span>    blockchain blockchain_;</span></span>
<span class="line"><span>    miner miner_{blockchain_};</span></span></code></pre></div><p>network也就是P2P网络类，blockchain是区块链的核心类，miner是共识模块下的核心类，三者被聚合到node中。</p><p>同时，node也会\b提供一些blockchain和miner的接口，方便Server层调用。</p><h3 id="代码编写3-blockchain" tabindex="-1">代码编写3 blockchain <a class="header-anchor" href="#代码编写3-blockchain" aria-label="Permalink to &quot;代码编写3 blockchain&quot;">​</a></h3><p>一个blockchain实例，应当包含下面的内容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    uint16_t id_;</span></span>
<span class="line"><span>    block genesis_block_;</span></span>
<span class="line"><span>    chain_database chain_;</span></span>
<span class="line"><span>    key_pair_database key_pair_database_;</span></span>
<span class="line"><span>    memory_pool_t pool_;</span></span></code></pre></div><p>genesis <em>block</em> 就是创世区块，这个是预先生成好的。genesis_block的信息也是被硬编码在代码中，我在Tinychain的例子为了方便测试，每个genesis_block都是可以自行生成的。</p><p>chain <em>database\b chain</em> 是相对于memory <em>pool而言的，chain</em> 就是已经经过确认，并且在本地持久化存储的区块数据（由于时间有限，Tinychain的案例中还未实现持久化存储，可以后续升级替换）。</p><p>memory_pool 是指还未经过确认，暂时驻留在内存中的交易池，交易池中的交易会在挖矿时，被导入到新的区块中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // 装载交易</span></span>
<span class="line"><span>    new_block.setup(pool);</span></span></code></pre></div><p>这里的pool就是交易池。</p><p>key_pair_database 是指专门存储用户的私钥的数据库，同时提供私钥管理。</p><p>同时blockchain也负责统一对外提供上述功能的接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // 获取当前节点高度</span></span>
<span class="line"><span>    uint64_t height() { return chain_.height(); }</span></span>
<span class="line"><span>    // 获取当前节点最新区块</span></span>
<span class="line"><span>    block get_last_block();</span></span>
<span class="line"><span>    // 查询指定区块</span></span>
<span class="line"><span>    bool get_block(sha256_t block_hash, block&amp; out);</span></span>
<span class="line"><span>    // 查询指定交易</span></span>
<span class="line"><span>    bool get_tx(sha256_t tx_hash, tx&amp; out);</span></span>
<span class="line"><span>    // 查询目标地址的余额</span></span>
<span class="line"><span>    bool get_balance(address_t address, uint64_t balance);</span></span>
<span class="line"><span>    // 获取当前区块链的ID</span></span>
<span class="line"><span>    auto id() {return id_;}</span></span>
<span class="line"><span>    // 获得交易池数据</span></span>
<span class="line"><span>    memory_pool_t pool() { return pool_; }</span></span>
<span class="line"><span>    // 区块打包成功以后，用于清空交易池</span></span>
<span class="line"><span>    void pool_reset() { pool_.clear(); }</span></span>
<span class="line"><span>    // 从网络中收集未确认的交易到交易池</span></span>
<span class="line"><span>    void collect(tx&amp; tx) {</span></span>
<span class="line"><span>        pool_.push_back(tx);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void merge_replace(block_list_t&amp; block_list)；</span></span></code></pre></div><p>除了上述接口之外，blockchain还负责当发现自己处于较短的分叉链上时，自动合并到最长链。</p><h3 id="代码编写4-network" tabindex="-1">代码编写4 network <a class="header-anchor" href="#代码编写4-network" aria-label="Permalink to &quot;代码编写4 network&quot;">​</a></h3><p>在network中，可用的地址簿代表了可用的其他对等节点，至少是连接过成功一次的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>    void broadcast(const block&amp; block);</span></span>
<span class="line"><span>    void broadcast(const tx&amp; transaction);</span></span>
<span class="line"><span>    void process(event_t ev, func_t f);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private:</span></span>
<span class="line"><span>    endpoint_book_t book_;</span></span>
<span class="line"><span>    channels_t channels_;</span></span></code></pre></div><p>地址簿会随着网络的变化进行更新，实时状态的地址簿是驻留在内存中的，当节点关闭是，会被刷到持久化存储中。</p><p>channels代表了已经激活的连接，这些连接可以被broadcast接口\b使用，当本地节点产生新的区块和交易时，会调起这些channels。</p><p>当P2P网络产生了新的事件时，会通过process接口处理新到达的交易和区块，这一事件会传导给blockchain模块。</p><h3 id="代码编写5-consensus" tabindex="-1">代码编写5 consensus <a class="header-anchor" href="#代码编写5-consensus" aria-label="Permalink to &quot;代码编写5 consensus&quot;">​</a></h3><p>consensus的含义为共识，共识会在两种情况下产生，第一是对本地生产的交易进行验证，第二是外来的区块和交易进行验证。</p><p>无论是哪种情况，他们遵循的验证规则是一样的。validate_tx和validate_block分别承担了这样的功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool validate_tx(const tx&amp; new_tx) ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool validate_block(const tx&amp; new_block) ;</span></span></code></pre></div><p>除了验证区块之外，还涉及到提供基础挖矿设施。我们知道挖矿分为两种，一种叫做solo挖矿，另外一种叫做联合挖矿。其实无论哪种挖矿类型，都必须用到miner类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span>    //开始挖矿</span></span>
<span class="line"><span>    void start(address_t&amp; addr);</span></span>
<span class="line"><span>    inline bool pow_once(block&amp; new_block, address_t&amp; addr);</span></span>
<span class="line"><span>    // 填写自己奖励——coinbase</span></span>
<span class="line"><span>    tx create_coinbase_tx(address_t&amp; addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    blockchain&amp; chain_;</span></span></code></pre></div><p>miner类展示了在solo挖矿情况下，支持开始挖矿以及计算自己的coinbase的过程。</p><p>实际pow_once的挖矿代码如下，pow_once被start调用，start里面是一个死循环，死循环里面包了pow_once函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool miner::pow_once(block&amp; new_block, address_t&amp; addr) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto&amp;&amp; pool = chain_.pool();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto&amp;&amp; prev_block = chain_.get_last_block();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 填充新块</span></span>
<span class="line"><span>    new_block.header_.height = prev_block.header_.height + 1;</span></span>
<span class="line"><span>    new_block.header_.prev_hash = prev_block.header_.hash;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    new_block.header_.timestamp = get_now_timestamp();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    new_block.header_.tx_count = pool.size();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 难度调整:</span></span>
<span class="line"><span>    // 控制每块速度，控制最快速度，大约10秒</span></span>
<span class="line"><span>    uint64_t time_peroid = new_block.header_.timestamp - prev_block.header_.timestamp;</span></span>
<span class="line"><span>    //log::info(&quot;consensus&quot;) &lt;&lt; &quot;target:&quot; &lt;&lt; ncan;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (time_peroid &lt;= 10u) {</span></span>
<span class="line"><span>        new_block.header_.difficulty = prev_block.header_.difficulty + 9000;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        new_block.header_.difficulty = prev_block.header_.difficulty - 3000;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 计算挖矿目标值,最大值除以难度就目标值</span></span>
<span class="line"><span>    uint64_t target = 0xffffffffffffffff / prev_block.header_.difficulty;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 设置coinbase交易</span></span>
<span class="line"><span>    auto&amp;&amp; tx = create_coinbase_tx(addr);</span></span>
<span class="line"><span>    pool.push_back(tx);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 装载交易</span></span>
<span class="line"><span>    new_block.setup(pool);</span></span>
<span class="line"><span>    // 计算目标值</span></span>
<span class="line"><span>    for ( uint64_t n = 0; ; ++n) {</span></span>
<span class="line"><span>        //尝试候选目标值</span></span>
<span class="line"><span>        new_block.header_.nonce = n;</span></span>
<span class="line"><span>        auto&amp;&amp; jv_block = new_block.to_json();</span></span>
<span class="line"><span>        auto&amp;&amp; can = to_sha256(jv_block);</span></span>
<span class="line"><span>        uint64_t ncan = std::stoull(can.substr(0, 16), 0, 16); //截断前16位，转换uint64 后进行比较</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 找到了</span></span>
<span class="line"><span>        if (ncan &lt; target) {</span></span>
<span class="line"><span>            //log::info(&quot;consensus&quot;) &lt;&lt; &quot;target:&quot; &lt;&lt; ncan;</span></span>
<span class="line"><span>            //log::info(&quot;consensus&quot;) &lt;&lt; &quot;hash  :&quot; &lt;&lt; to_sha256(jv_block);</span></span>
<span class="line"><span>            new_block.header_.hash = can;</span></span>
<span class="line"><span>            log::info(&quot;consensus&quot;) &lt;&lt; &quot;new block :&quot; &lt;&lt; jv_block.toStyledString();</span></span>
<span class="line"><span>            log::info(&quot;consensus&quot;) &lt;&lt; &quot;new block :&quot; &lt;&lt; can;</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>上面的代码从一开始到for循环之前，都可以提取出来，做成叫做getblocktemplate的接口，getblocktemplate是一种JSON-RPC调用。</p><p>通过这个调用，就可以把挖矿的状态信息分享给其他矿机，矿机拿到blocktemplate以后直接进行nonce部分暴力搜索即可。</p><h3 id="代码编写6-database" tabindex="-1">代码编写6 database <a class="header-anchor" href="#代码编写6-database" aria-label="Permalink to &quot;代码编写6 database&quot;">​</a></h3><p>database是偏底层的接口，主要的功能有两个，第一是提供区块和私钥的持久化存储，第二是提供交易和区块的查询接口。</p><p>上文blockchain中的blockchain_database和keypair_database都是从database派生过来的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>key_pair_database</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 相当于是本地钱包的私钥管理</span></span>
<span class="line"><span>class key_pair_database</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    key_pair get_new_key_pair()；</span></span>
<span class="line"><span>    const key_pair_database_t&amp; list_keys() const；</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    key_pair_database_t key_pair_database_;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>blockchain_database</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint64_t height();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto get_last_block();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool get_block (const sha256_t block_hash, block&amp; b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool get_tx (const sha256_t tx_hash, tx&amp; t);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool push_block (const block&amp; b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool pop_block (cconst sha256_t block_hash);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    chain_database_t chain_database_;</span></span></code></pre></div><h3 id="代码编写7-commands" tabindex="-1">代码编写7 commands <a class="header-anchor" href="#代码编写7-commands" aria-label="Permalink to &quot;代码编写7 commands&quot;">​</a></h3><p>commands提供了开发者命令行交互接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    bool exec(Json::Value&amp; out);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    static const vargv_t commands_list;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    vargv_t vargv_;</span></span>
<span class="line"><span>    node&amp; node_;</span></span></code></pre></div><p>首先得有一个可识别的命令列表，接着是执行接口，例如命令行发起生成新key_pair的过程，执行getnewkey命令。</p><p>先被command解析，接着执行exec，执行的时候需要用到node对象。</p><p>实际上command类比较繁琐，因为一个功能复杂的钱包，维护的命令和种类可能多达几十种。</p><p>同时命令又可以被JSON-RPC调用，所以一般命令行客户端本身就是一个轻量级的http-client。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>    std::string url{&quot;127.0.0.1:8000/rpc&quot;};</span></span>
<span class="line"><span>    // HTTP request call commands</span></span>
<span class="line"><span>    HttpReq req(url, 3000, reply_handler(my_impl));</span></span></code></pre></div><h3 id="代码编写8-基础类" tabindex="-1">代码编写8 基础类 <a class="header-anchor" href="#代码编写8-基础类" aria-label="Permalink to &quot;代码编写8 基础类&quot;">​</a></h3><p>基础类是实际生成公私钥对、构建交易tx的基本单元类，构建区块的基本单元类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>key_pair:</span></span>
<span class="line"><span>class key_pair</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    key_pair()  {</span></span>
<span class="line"><span>        private_key_ = RSA::new_key();</span></span>
<span class="line"><span>        public_key_ = private_key_.public_key();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    address_t address()；</span></span>
<span class="line"><span>    sha256_t public_key() const；</span></span>
<span class="line"><span>    uint64_t private_key() const；</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ...一些序列化接口(tinychain中是Json)</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    private_key_t private_key_;</span></span>
<span class="line"><span>    public_key_t public_key_;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tx:</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    input_t inputs() const { return inputs_; }</span></span>
<span class="line"><span>    output_t outputs() const { return outputs_; }</span></span>
<span class="line"><span>    sha256_t hash() const { return hash_; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    input_t inputs_;</span></span>
<span class="line"><span>    output_t outputs_;</span></span>
<span class="line"><span>    sha256_t hash_;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>block:</span></span>
<span class="line"><span>class block</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    typedef std::vector&lt;​tx&gt; tx_list_t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct blockheader {</span></span>
<span class="line"><span>        uint64_t nonce{0};</span></span>
<span class="line"><span>        uint64_t height{0};</span></span>
<span class="line"><span>        uint64_t timestamp{0};</span></span>
<span class="line"><span>        uint64_t tx_count{0};</span></span>
<span class="line"><span>        uint64_t difficulty{0};</span></span>
<span class="line"><span>        sha256_t hash;</span></span>
<span class="line"><span>        sha256_t merkel_root_hash; //TODO</span></span>
<span class="line"><span>        sha256_t prev_hash;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    // ... 一些其他接口和序列化函数</span></span>
<span class="line"><span>    std::string to_string() {</span></span>
<span class="line"><span>        auto&amp;&amp; j = to_json();</span></span>
<span class="line"><span>        return j.toStyledString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sha256_t hash() const { return header_.hash; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    void setup(tx_list_t&amp; txs) {tx_list_.swap(txs);}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    blockheader header_;</span></span>
<span class="line"><span>    tx_list_t tx_list_;</span></span></code></pre></div><h2 id="首次运行" tabindex="-1">首次运行 <a class="header-anchor" href="#首次运行" aria-label="Permalink to &quot;首次运行&quot;">​</a></h2><p>我们编写完基础类和基本结构的代码之后，就可以运行试一试。</p><p>编译成功是这样子的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/32c5b165815109bf8bb088ea26840781.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/32c5b165815109bf8bb088ea26840781.png" alt=""></a></p><p>我们可以看到有Tinychain和Cli-tinychain。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/513ed7a30252931af514559789292a75.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/513ed7a30252931af514559789292a75.png" alt=""></a></p><p>Tnychain就是我们的核心程序，cli-tinychain就是我们的命令行客户端。</p><p>实际上我在Server里还嵌入了一个可视化的Websocket界面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/62e883f4177cd5d117025cee207ec188.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/62e883f4177cd5d117025cee207ec188.png" alt=""></a></p><p>只需要在Tinychain可执行文件同目录底下创建webroot文件夹，将etc底下的index放入webroot下，接着打开浏览器127.0.0.1:8000就可以看到了。</p><p>实际上这个页面我想做成区块的监视页面，只是还没改造完成，目前支持发送命令。</p><p>我们开始首次运行Tinychain。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/1e9c369b71436faf3e4778d4ec6358c9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/1e9c369b71436faf3e4778d4ec6358c9.png" alt=""></a></p><p>运行后，等node和server全部started，就可以开始操作命令行了。</p><p>也可以通过日志进行监视，但是需要在代码处详细打桩，这次我偷懒了，没有好好打，所以不多，直接查看同目录下debug.log和error.log即可。</p><h2 id="首次挖矿" tabindex="-1">首次挖矿 <a class="header-anchor" href="#首次挖矿" aria-label="Permalink to &quot;首次挖矿&quot;">​</a></h2><p>我们通过./tinychain启动之后，开始第一次挖矿。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> ✘ chenhao@chenhaodeMacBook-Pro  ~/workspace/tinychain/build/bin   master  ./tinychain</span></span>
<span class="line"><span>20180610T232347 INFO [main] started</span></span>
<span class="line"><span>20180610T232347 INFO [node] node started</span></span>
<span class="line"><span>20180610T232347 INFO [main] httpserver started</span></span>
<span class="line"><span>20180610T232356 INFO [consensus] new block :{</span></span>
<span class="line"><span> &quot;header&quot; :</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>  &quot;difficulty&quot; : 9001,</span></span>
<span class="line"><span>  &quot;hash&quot; : &quot;&quot;,</span></span>
<span class="line"><span>  &quot;height&quot; : 1,</span></span>
<span class="line"><span>  &quot;merkel_header_hash&quot; : &quot;&quot;,</span></span>
<span class="line"><span>  &quot;nonce&quot; : 0,</span></span>
<span class="line"><span>  &quot;prev_hash&quot; : &quot;00b586611d6f2580e1ea0773ec8b684dc4acf231710519e6272ed7d0c61ed43e&quot;,</span></span>
<span class="line"><span>  &quot;timestamp&quot; : 1528644236,</span></span>
<span class="line"><span>  &quot;tx_count&quot; : 0</span></span>
<span class="line"><span> },</span></span>
<span class="line"><span> &quot;txs&quot; :</span></span>
<span class="line"><span> [</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>   &quot;hash&quot; : &quot;cddf6e838eff470d81155cb4c26fd3a7615b94a00e82f99b1fd9f583d7bc0659&quot;,</span></span>
<span class="line"><span>   &quot;inputs&quot; :</span></span>
<span class="line"><span>   [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>     &quot;hash&quot; : &quot;00000000000000000000000000000000&quot;,</span></span>
<span class="line"><span>     &quot;index&quot; : 0</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   ],</span></span>
<span class="line"><span>   &quot;outputs&quot; :</span></span>
<span class="line"><span>   [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>     &quot;address&quot; : &quot;122b03d11a622ac3384904948c4d808&quot;,</span></span>
<span class="line"><span>     &quot;value&quot; : 1000</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> ]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>20180610T232356 INFO [consensus] new block :0de5c36420aab2f7fc9413cfbd21bece697a349106771dc58b25a6a099d6aa86</span></span>
<span class="line"><span>20180610T232357 INFO [consensus] new block :{</span></span>
<span class="line"><span> &quot;header&quot; :</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>  &quot;difficulty&quot; : 18001,</span></span>
<span class="line"><span>  &quot;hash&quot; : &quot;&quot;,</span></span>
<span class="line"><span>  &quot;height&quot; : 2,</span></span>
<span class="line"><span>  &quot;merkel_header_hash&quot; : &quot;&quot;,</span></span>
<span class="line"><span>  &quot;nonce&quot; : 6048,</span></span>
<span class="line"><span>  &quot;prev_hash&quot; : &quot;0de5c36420aab2f7fc9413cfbd21bece697a349106771dc58b25a6a099d6aa86&quot;,</span></span>
<span class="line"><span>  &quot;timestamp&quot; : 1528644236,</span></span>
<span class="line"><span>  &quot;tx_count&quot; : 0</span></span>
<span class="line"><span> },</span></span>
<span class="line"><span> &quot;txs&quot; :</span></span>
<span class="line"><span> [</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>   &quot;hash&quot; : &quot;cddf6e838eff470d81155cb4c26fd3a7615b94a00e82f99b1fd9f583d7bc0659&quot;,</span></span>
<span class="line"><span>   &quot;inputs&quot; :</span></span>
<span class="line"><span>   [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>     &quot;hash&quot; : &quot;00000000000000000000000000000000&quot;,</span></span>
<span class="line"><span>     &quot;index&quot; : 0</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   ],</span></span>
<span class="line"><span>   &quot;outputs&quot; :</span></span>
<span class="line"><span>   [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>     &quot;address&quot; : &quot;122b03d11a622ac3384904948c4d808&quot;,</span></span>
<span class="line"><span>     &quot;value&quot; : 1000</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>刚开始挖矿会比较快，随着难度提升，会趋向于稳定到10秒种左右一个块，如果长时间不出块，难度会自动降下来。曾经元界的代码在难度调整上有缺陷，遭受了严重的“难度坠落”攻击。</p><p>我们可以通过这个位置观察难度调整的情况。 <a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/e91d8eb7857043c606266e591d5f8f43.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/e91d8eb7857043c606266e591d5f8f43.png" alt=""></a></p><h2 id="第一笔交易" tabindex="-1">第一笔交易 <a class="header-anchor" href="#第一笔交易" aria-label="Permalink to &quot;第一笔交易&quot;">​</a></h2><p>我们\b保持挖矿，接下来发送一笔交易。 我们先通过getnewkey命令获得一个新公私钥对以及对应的地址。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/76de5f90f37883321783c99032ec62a5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/76de5f90f37883321783c99032ec62a5.png" alt=""></a></p><p>接着发送第一笔交易。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/7f84d975e3d38641c50804e1982560da.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/7f84d975e3d38641c50804e1982560da.png" alt=""></a></p><p>探测到接下来被打包到区块中。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/a236bed57775c050b6e6d43b2156979c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E5%8C%BA%E5%9D%97%E9%93%BE/images/9273/a236bed57775c050b6e6d43b2156979c.png" alt=""></a></p><h2 id="分叉与合并" tabindex="-1">分叉与合并 <a class="header-anchor" href="#分叉与合并" aria-label="Permalink to &quot;分叉与合并&quot;">​</a></h2><p>区块链分叉是数据全网不一致的表现，通常是矿工\b节点行为不一致导致的，常见的有网络分区和协议不兼容，如果同时产生，那么必然会出现两条比较长的分叉链。</p><p>在现实情况中，分叉1个是最常见的，2个已经非常罕见了，3个以上基本是网络分区造成的。</p><p>如果我们要在Tinychain中实践网络分区和分叉，我们需要构建局域网多节点私链环境，可以通过docker来试验。</p><p>通过本文，你可以看到即使是搭建一个迷你区块链，它的工作量也是巨大的，\b其中不仅仅只是组合几个基础组件那么简单，还要涉及各个模块的设计和交互等详细的工作。</p><p>由于在短时间内全部搭建以及实现Tinychain所有功能是不可行的，在这里，我只为你提供了一些实践的思路。</p><p>目前Tinychain缺失了P2P网络实现、RSA公私钥对集成、共识模块的交易和区块的验证等内容，我会在后续\b逐渐完善，你也可以跟我一起补充。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>好了，通过今天的代码实践，我们实现了迷你区块链Tinychain，并且，通过运行与测试Tinychain，我们了解到了一个最简单区块链的运行原理，希望通过今天的文章，可以帮你加深对区块链技术的理解。</p><p>区块链技术只是作为基础设施，服务于广大的开发者和业务需求。\b目前区块链的发展远远不止Tinychain中所展现的样子，我们还需要去考虑区块链2.0智能合约，如何设计Token经济等一些问题。</p><p>随着区块链的发展和应用规模，区块链安全问题也日益突出，所以今天的问题是，如果要攻击Tinychain，可以采取什么手段呢？你可以给我留言，我们一起讨论。</p><p>感谢你的收听，我们下次再见。</p>`,105)])])}const b=n(l,[["render",t]]);export{u as __pageData,b as default};
