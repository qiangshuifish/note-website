import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"36 | Pandas & Numpy：策略与回测系统","description":"","frontmatter":{},"headers":[{"level":2,"title":"OHLCV数据","slug":"ohlcv数据","link":"#ohlcv数据","children":[]},{"level":2,"title":"回测框架","slug":"回测框架","link":"#回测框架","children":[]},{"level":2,"title":"交易策略","slug":"交易策略","link":"#交易策略","children":[]},{"level":2,"title":"模拟交易","slug":"模拟交易","link":"#模拟交易","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Python核心技术与实战/36-Pandas&Numpy：策略与回测系统.md","filePath":"Python核心技术与实战/36-Pandas&Numpy：策略与回测系统.md","lastUpdated":1779816143000}'),l={name:"Python核心技术与实战/36-Pandas&Numpy：策略与回测系统.md"};function i(t,s,c,o,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_36-pandas-numpy-策略与回测系统" tabindex="-1">36 | Pandas &amp; Numpy：策略与回测系统 <a class="header-anchor" href="#_36-pandas-numpy-策略与回测系统" aria-label="Permalink to &quot;36 | Pandas &amp; Numpy：策略与回测系统&quot;">​</a></h1><p>大家好，我是景霄。</p><p>上节课，我们介绍了交易所的数据抓取，特别是orderbook和tick数据的抓取。今天这节课，我们考虑的是，怎么在这些历史数据上测试一个交易策略。</p><p>首先我们要明确，对于很多策略来说，我们上节课抓取的密集的orderbook和tick数据，并不能简单地直接使用。因为数据量太密集，包含了太多细节；而且长时间连接时，网络随机出现的不稳定，会导致丢失部分tick数据。因此，我们还需要进行合适的清洗、聚合等操作。</p><p>此外，为了进行回测，我们需要一个交易策略，还需要一个测试框架。目前已存在很多成熟的回测框架，但是为了Python学习，我决定带你搭建一个简单的回测框架，并且从中简单一窥Pandas的优势。</p><h2 id="ohlcv数据" tabindex="-1">OHLCV数据 <a class="header-anchor" href="#ohlcv数据" aria-label="Permalink to &quot;OHLCV数据&quot;">​</a></h2><p>了解过一些股票交易的同学，可能知道K线这种东西。K线又称“蜡烛线”，是一种反映价格走势的图线。它的特色在于，一个线段内记录了多项讯息，相当易读易懂且实用有效，因此被广泛用于股票、期货、贵金属、数字货币等行情的技术分析。下面便是一个K线示意图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/470a68b8eaff3807efd89bc616e5659b.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/470a68b8eaff3807efd89bc616e5659b.png" alt=""></a></p><p>K线示意图</p><p>其中，每一个小蜡烛，都代表着当天的开盘价（Open）、最高价（High）、最低价（Low）和收盘价（Close），也就是我画的第二张图表示的这样。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/58ce87e32aa4655211da02ce88223757.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/58ce87e32aa4655211da02ce88223757.png" alt=""></a></p><p>K线的“小蜡烛” -- OHLC</p><p>类似的，除了日K线之外，还有周K线、小时K线、分钟K线等等。那么这个K线是怎么计算来的呢？</p><p>我们以小时K线图为例，还记得我们当时抓取的tick数据吗？也就是每一笔交易的价格和数量。那么，如果从上午10:00开始，我们开始积累tick的交易数据，以10:00开始的第一个交易作为Open数据，11:00前的最后一笔交易作为Close值，并把这一个小时最低和最高的成交价格分别作为High和Low的值，我们就可以绘制出这一个小时对应的“小蜡烛”形状了。</p><p>如果再加上这一个小时总的成交量（Volumn），就得到了OHLCV数据。</p><p>所以，如果我们一直抓取着tick底层原始数据，我们就能在上层聚合出1分钟K线、小时K线以及日、周k线等等。如果你对这一部分操作有兴趣，可以把此作为今天的课后作业来实践。</p><p>接下来，我们将使用Gemini从2015年到2019年7月这个时间内，BTC对USD每个小时的OHLCV数据，作为策略和回测的输入。你可以在 <a href="https://github.com/caunion/simple_backtesting/blob/master/BTCUSD_GEMINI.csv" target="_blank" rel="noreferrer">这里</a> 下载数据。</p><p>数据下载完成后，我们可以利用Pandas读取，比如下面这段代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def assert_msg(condition, msg):</span></span>
<span class="line"><span>    if not condition:</span></span>
<span class="line"><span>        raise Exception(msg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def read_file(filename):</span></span>
<span class="line"><span>    # 获得文件绝对路径</span></span>
<span class="line"><span>    filepath = path.join(path.dirname(__file__), filename)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 判定文件是否存在</span></span>
<span class="line"><span>    assert_msg(path.exists(filepath), &quot;文件不存在&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 读取CSV文件并返回</span></span>
<span class="line"><span>    return pd.read_csv(filepath,</span></span>
<span class="line"><span>                       index_col=0,</span></span>
<span class="line"><span>                       parse_dates=True,</span></span>
<span class="line"><span>                       infer_datetime_format=True)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BTCUSD = read_file(&#39;BTCUSD_GEMINI.csv&#39;)</span></span>
<span class="line"><span>assert_msg(BTCUSD.__len__() &amp;gt; 0, &#39;读取失败&#39;)</span></span>
<span class="line"><span>print(BTCUSD.head())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>########## 输出 ##########</span></span>
<span class="line"><span>Time                 Symbol      Open      High       Low     Close     Volume</span></span>
<span class="line"><span>Date</span></span>
<span class="line"><span>2019-07-08 00:00:00  BTCUSD  11475.07  11540.33  11469.53  11506.43  10.770731</span></span>
<span class="line"><span>2019-07-07 23:00:00  BTCUSD  11423.00  11482.72  11423.00  11475.07  32.996559</span></span>
<span class="line"><span>2019-07-07 22:00:00  BTCUSD  11526.25  11572.74  11333.59  11423.00  48.937730</span></span>
<span class="line"><span>2019-07-07 21:00:00  BTCUSD  11515.80  11562.65  11478.20  11526.25  25.323908</span></span>
<span class="line"><span>2019-07-07 20:00:00  BTCUSD  11547.98  11624.88  11423.94  11515.80  63.211972</span></span></code></pre></div><p>这段代码提供了两个工具函数。</p><ul><li>一个是read_file，它的作用是，用pandas读取csv文件。</li><li>另一个是assert_msg，它的作用类似于assert，如果传入的条件（contidtion）为否，就会抛出异常。不过，你需要提供一个参数，用于指定要抛出的异常信息。</li></ul><h2 id="回测框架" tabindex="-1">回测框架 <a class="header-anchor" href="#回测框架" aria-label="Permalink to &quot;回测框架&quot;">​</a></h2><p>说完了数据，我们接着来看回测数据。常见的回测框架有两类。一类是向量化回测框架，它通常基于Pandas+Numpy来自己搭建计算核心；后端则是用MySQL或者MongoDB作为源。这种框架通过Pandas+Numpy对OHLC数组进行向量运算，可以在较长的历史数据上进行回测。不过，因为这类框架一般只用OHLC，所以模拟会比较粗糙。</p><p>另一类则是事件驱动型回测框架。这类框架，本质上是针对每一个tick的变动或者orderbook的变动生成事件；然后，再把一个个事件交给策略进行执行。因此，虽然它的拓展性很强，可以允许更加灵活的策略，但回测速度是很慢的。</p><p>我们想要学习量化交易，使用大型成熟的回测框架，自然是第一选择。</p><ul><li>比如Zipline，就是一个热门的事件驱动型回测框架，背后有大型社区和文档的支持。</li><li>PyAlgoTrade也是事件驱动的回测框架，文档相对完整，整合了知名的技术分析（Techique Analysis）库TA-Lib。在速度和灵活方面，它比Zipline 强。不过，它的一大硬伤是不支持 Pandas 的模块和对象。</li></ul><p>显然，对于我们Python学习者来说，第一类也就是向量型回测框架，才是最适合我们练手的项目了。那么，我们就开始吧。</p><p>首先，我先为你梳理下回测流程，也就是下面五步：</p><ol><li>读取OHLC数据；</li><li>对OHLC进行指标运算；</li><li>策略根据指标向量决定买卖；</li><li>发给模拟的”交易所“进行交易；</li><li>最后，统计结果。</li></ol><p>对此，使用之前学到的面向对象思维方式，我们可以大致抽取三个类：</p><ul><li>交易所类（ ExchangeAPI）：负责维护账户的资金和仓位，以及进行模拟的买卖；</li><li>策略类（Strategy）：负责根据市场信息生成指标，根据指标决定买卖；</li><li>回测类框架（Backtest）：包含一个策略类和一个交易所类，负责迭代地对每个数据点调用策略执行。</li></ul><p>接下来，我们先从最外层的大框架开始。这样的好处在于，我们是从上到下、从外往内地思考，虽然还没有开始设计依赖项（Backtest的依赖项是ExchangeAPI和Strategy），但我们可以推测出它们应有的接口形式。推测接口的本质，其实就是推测程序的输入。</p><p>这也是我在一开始提到过的，对于程序这个“黑箱”，你在一开始设计的时候，就要想好输入和输出。</p><p>回到最外层Backtest类。我们需要知道，输出是最后的收益，那么显然，输入应该是初始输入的资金数量（cash）。</p><p>此外，为了模拟得更加真实，我们还要考虑交易所的手续费（commission）。手续费的多少取决于券商（broker）或者交易所，比如我们买卖股票的券商手续费可能是万七，那么就是0.0007。但是在比特币交易领域，手续费通常会稍微高一点，可能是千分之二左右。当然，无论怎么多，一般也不会超过5 %。否则我们大家交易几次就破产了，也就不会有人去交易了。</p><p>这里说一句题外话，不知道你有没有发现，无论数字货币的价格是涨还是跌，总有一方永远不亏，那就是交易所。因为只要有人交易，他们就有白花花的银子进账。</p><p>回到正题，至此，我们就确定了Backtest的输入和输出。</p><p>它的输入是：</p><ul><li>OHLC数据；</li><li>初始资金；</li><li>手续费率；</li><li>交易所类；</li><li>策略类。</li></ul><p>输出则是：</p><ul><li>最后剩余市值。</li></ul><p>对此，你可以参考下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Backtest:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    Backtest回测类，用于读取历史行情数据、执行策略、模拟交易并估计</span></span>
<span class="line"><span>    收益。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    初始化的时候调用Backtest.run来时回测</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    instance, or \`backtesting.backtesting.Backtest.optimize\` to</span></span>
<span class="line"><span>    optimize it.</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __init__(self,</span></span>
<span class="line"><span>                 data: pd.DataFrame,</span></span>
<span class="line"><span>                 strategy_type: type(Strategy),</span></span>
<span class="line"><span>                 broker_type: type(ExchangeAPI),</span></span>
<span class="line"><span>                 cash: float = 10000,</span></span>
<span class="line"><span>                 commission: float = .0):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        构造回测对象。需要的参数包括：历史数据，策略对象，初始资金数量，手续费率等。</span></span>
<span class="line"><span>        初始化过程包括检测输入类型，填充数据空值等。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        参数：</span></span>
<span class="line"><span>        :param data:            pd.DataFrame        pandas Dataframe格式的历史OHLCV数据</span></span>
<span class="line"><span>        :param broker_type:     type(ExchangeAPI)   交易所API类型，负责执行买卖操作以及账户状态的维护</span></span>
<span class="line"><span>        :param strategy_type:   type(Strategy)      策略类型</span></span>
<span class="line"><span>        :param cash:            float               初始资金数量</span></span>
<span class="line"><span>        :param commission:       float               每次交易手续费率。如2%的手续费此处为0.02</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        assert_msg(issubclass(strategy_type, Strategy), &#39;strategy_type不是一个Strategy类型&#39;)</span></span>
<span class="line"><span>        assert_msg(issubclass(broker_type, ExchangeAPI), &#39;strategy_type不是一个Strategy类型&#39;)</span></span>
<span class="line"><span>        assert_msg(isinstance(commission, Number), &#39;commission不是浮点数值类型&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        data = data.copy(False)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 如果没有Volumn列，填充NaN</span></span>
<span class="line"><span>        if &#39;Volume&#39; not in data:</span></span>
<span class="line"><span>            data[&#39;Volume&#39;] = np.nan</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 验证OHLC数据格式</span></span>
<span class="line"><span>        assert_msg(len(data.columns &amp; {&#39;Open&#39;, &#39;High&#39;, &#39;Low&#39;, &#39;Close&#39;, &#39;Volume&#39;}) == 5,</span></span>
<span class="line"><span>                   (&quot;输入的\`data\`格式不正确，至少需要包含这些列：&quot;</span></span>
<span class="line"><span>                    &quot;&#39;Open&#39;, &#39;High&#39;, &#39;Low&#39;, &#39;Close&#39;&quot;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 检查缺失值</span></span>
<span class="line"><span>        assert_msg(not data[[&#39;Open&#39;, &#39;High&#39;, &#39;Low&#39;, &#39;Close&#39;]].max().isnull().any(),</span></span>
<span class="line"><span>            (&#39;部分OHLC包含缺失值，请去掉那些行或者通过差值填充. &#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 如果行情数据没有按照时间排序，重新排序一下</span></span>
<span class="line"><span>        if not data.index.is_monotonic_increasing:</span></span>
<span class="line"><span>            data = data.sort_index()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 利用数据，初始化交易所对象和策略对象。</span></span>
<span class="line"><span>        self._data = data  # type: pd.DataFrame</span></span>
<span class="line"><span>        self._broker = broker_type(data, cash, commission)</span></span>
<span class="line"><span>        self._strategy = strategy_type(self._broker, self._data)</span></span>
<span class="line"><span>        self._results = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def run(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        运行回测，迭代历史数据，执行模拟交易并返回回测结果。</span></span>
<span class="line"><span>        Run the backtest. Returns \`pd.Series\` with results and statistics.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Keyword arguments are interpreted as strategy parameters.</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        strategy = self._strategy</span></span>
<span class="line"><span>        broker = self._broker</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 策略初始化</span></span>
<span class="line"><span>        strategy.init()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 设定回测开始和结束位置</span></span>
<span class="line"><span>        start = 100</span></span>
<span class="line"><span>        end = len(self._data)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 回测主循环，更新市场状态，然后执行策略</span></span>
<span class="line"><span>        for i in range(start, end):</span></span>
<span class="line"><span>            # 注意要先把市场状态移动到第i时刻，然后再执行策略。</span></span>
<span class="line"><span>            broker.next(i)</span></span>
<span class="line"><span>            strategy.next(i)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 完成策略执行之后，计算结果并返回</span></span>
<span class="line"><span>        self._results = self._compute_result(broker)</span></span>
<span class="line"><span>        return self._results</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def _compute_result(self, broker):</span></span>
<span class="line"><span>        s = pd.Series()</span></span>
<span class="line"><span>        s[&#39;初始市值&#39;] = broker.initial_cash</span></span>
<span class="line"><span>        s[&#39;结束市值&#39;] = broker.market_value</span></span>
<span class="line"><span>        s[&#39;收益&#39;] = broker.market_value - broker.initial_cash</span></span>
<span class="line"><span>        return s</span></span></code></pre></div><p>这段代码有点长，但是核心其实就两部分。</p><ul><li>初始化函数（ <strong>init</strong>）：传入必要参数，对OHLC数据进行简单清洗、排序和验证。我们从不同地方下载的数据，可能格式不一样；而排序的方式也可能是从前往后。所以，这里我们把数据统一设置为按照时间从之前往现在的排序。</li><li>执行函数（run）：这是回测框架的主要循环部分，核心是更新市场还有更新策略的时间。迭代完成所有的历史数据后，它会计算收益并返回。</li></ul><p>你应该注意到了，此时，我们还没有定义策略和交易所API的结构。不过，通过回测的执行函数，我们可以确定这两个类的接口形式。</p><p>策略类（Strategy）的接口形式为：</p><ul><li>初始化函数init()，根据历史数据进行指标（Indicator）计算。</li><li>步进函数next()，根据当前时间和指标，决定买卖操作，并发给交易所类执行。</li></ul><p>交易所类（ExchangeAPI）的接口形式为：</p><ul><li>步进函数next()，根据当前时间，更新最新的价格；</li><li>买入操作buy()，买入资产；</li><li>卖出操作sell()，卖出资产。</li></ul><h2 id="交易策略" tabindex="-1">交易策略 <a class="header-anchor" href="#交易策略" aria-label="Permalink to &quot;交易策略&quot;">​</a></h2><p>接下来我们来看交易策略。交易策略的开发是一个非常复杂的学问。为了达到学习的目的，我们来想一个简单的策略——移动均值交叉策略。</p><p>为了了解这个策略，我们先了解一下，什么叫做简单移动均值（Simple Moving Average，简称为SMA，以下皆用SMA表示简单移动均值）。我们知道，N个数的序列 x[0]、x[1] .…… x[N] 的均值，就是这N个数的和除以N。</p><p>现在，我假设一个比较小的数K，比N小很多。我们用一个K大小的滑动窗口，在原始的数组上滑动。通过对每次框住的K个元素求均值，我们就可以得到，原始数组的窗口大小为K的SMA了。</p><p>SMA，实质上就是对原始数组进行了一个简单平滑处理。比如，某支股票的价格波动很大，那么，我们用SMA平滑之后，就会得到下面这张图的效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/b543927903fbbaa33980a2046651530f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/b543927903fbbaa33980a2046651530f.png" alt=""></a></p><p>某个投资品价格的SMA，窗口大小为50</p><p>你可以看出，如果窗口大小越大，那么SMA应该越平滑，变化越慢；反之，如果SMA比较小，那么短期的变化也会越快地反映在SMA上。</p><p>于是，我们想到，能不能对投资品的价格设置两个指标呢？这俩指标，一个是小窗口的SMA，一个是大窗口的SMA。</p><ul><li>如果小窗口的SMA曲线从下面刺破或者穿过大窗口SMA，那么说明，这个投资品的价格在短期内快速上涨，同时这个趋势很强烈，可能是一个买入的信号；</li><li>反之，如果大窗口的SMA从下方突破小窗口SMA，那么说明，投资品的价格在短期内快速下跌，我们应该考虑卖出。</li></ul><p>下面这幅图，就展示了这两种情况。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/408ff342683f6ac1af798ba3d488c266.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Python%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/images/111296/408ff342683f6ac1af798ba3d488c266.png" alt=""></a></p><p>明白了这里的概念和原理后，接下来的操作就不难了。利用Pandas，我们可以非常简单地计算SMA和SMA交叉。比如，你可以引入下面两个工具函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def SMA(values, n):</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    返回简单滑动平均</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    return pd.Series(values).rolling(n).mean()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def crossover(series1, series2) -&amp;gt; bool:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    检查两个序列是否在结尾交叉</span></span>
<span class="line"><span>    :param series1:  序列1</span></span>
<span class="line"><span>    :param series2:  序列2</span></span>
<span class="line"><span>    :return:         如果交叉返回True，反之False</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    return series1[-2] &amp;lt; series2[-2] and series1[-1] &amp;gt; series2[-1]</span></span></code></pre></div><p>如代码所示，对于输入的一个数组，Pandas的rolling(k)函数，可以方便地计算窗内口大小为K的SMA数组；而想要检查某个时刻两个SMA是否交叉，你只需要查看两个数组末尾的两个元素即可。</p><p>那么，基于此，我们就可以开发出一个简单的策略了。下面这段代码表示策略的核心思想，我做了详细的注释，你理解起来应该没有问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    def next(self, tick):</span></span>
<span class="line"><span>        # 如果此时快线刚好越过慢线，买入全部</span></span>
<span class="line"><span>        if crossover(self.sma1[:tick], self.sma2[:tick]):</span></span>
<span class="line"><span>            self.buy()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 如果是慢线刚好越过快线，卖出全部</span></span>
<span class="line"><span>        elif crossover(self.sma2[:tick], self.sma1[:tick]):</span></span>
<span class="line"><span>            self.sell()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 否则，这个时刻不执行任何操作。</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            pass</span></span></code></pre></div><p>说完策略的核心思想，我们开始搭建策略类的框子。</p><p>首先，我们要考虑到，策略类Strategy应该是一个可以被继承的类，同时应该包含一些固定的接口。这样，回测器才能方便地调用。</p><p>于是，我们可以定义一个Strategy抽象类，包含两个接口方法init和next，分别对应我们前面说的指标计算和步进函数。不过注意，抽象类是不能被实例化的。所以，我们必须定义一个具体的子类，同时实现了init和next方法才可以。</p><p>这个类的定义，你可以参考下面代码的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import abc</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>from typing import Callable</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Strategy(metaclass=abc.ABCMeta):</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    抽象策略类，用于定义交易策略。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    如果要定义自己的策略类，需要继承这个基类，并实现两个抽象方法：</span></span>
<span class="line"><span>    Strategy.init</span></span>
<span class="line"><span>    Strategy.next</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    def __init__(self, broker, data):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        构造策略对象。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        &amp;#64;params broker:  ExchangeAPI    交易API接口，用于模拟交易</span></span>
<span class="line"><span>        &amp;#64;params data:    list           行情数据数据</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        self._indicators = []</span></span>
<span class="line"><span>        self._broker = broker  # type: _Broker</span></span>
<span class="line"><span>        self._data = data  # type: _Data</span></span>
<span class="line"><span>        self._tick = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def I(self, func: Callable, *args) -&amp;gt; np.ndarray:</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        计算买卖指标向量。买卖指标向量是一个数组，长度和历史数据对应；</span></span>
<span class="line"><span>        用于判定这个时间点上需要进行&quot;买&quot;还是&quot;卖&quot;。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        例如计算滑动平均：</span></span>
<span class="line"><span>        def init():</span></span>
<span class="line"><span>            self.sma = self.I(utils.SMA, self.data.Close, N)</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        value = func(*args)</span></span>
<span class="line"><span>        value = np.asarray(value)</span></span>
<span class="line"><span>        assert_msg(value.shape[-1] == len(self._data.Close), &#39;指示器长度必须和data长度相同&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self._indicators.append(value)</span></span>
<span class="line"><span>        return value</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def tick(self):</span></span>
<span class="line"><span>        return self._tick</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;abc.abstractmethod</span></span>
<span class="line"><span>    def init(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        初始化策略。在策略回测/执行过程中调用一次，用于初始化策略内部状态。</span></span>
<span class="line"><span>        这里也可以预计算策略的辅助参数。比如根据历史行情数据：</span></span>
<span class="line"><span>        计算买卖的指示器向量；</span></span>
<span class="line"><span>        训练模型/初始化模型参数</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;abc.abstractmethod</span></span>
<span class="line"><span>    def next(self, tick):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        步进函数，执行第tick步的策略。tick代表当前的&quot;时间&quot;。比如data[tick]用于访问当前的市场价格。</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def buy(self):</span></span>
<span class="line"><span>        self._broker.buy()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def sell(self):</span></span>
<span class="line"><span>        self._broker.sell()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def data(self):</span></span>
<span class="line"><span>        return self._data</span></span></code></pre></div><p>为了方便访问成员，我们还定义了一些Python property。同时，我们的买卖请求是由策略类发出、由交易所API来执行的，所以我们的策略类里依赖于ExchangeAPI类。</p><p>现在，有了这个框架，我们实现移动均线交叉策略就很简单了。你只需要在init函数中，定义计算大小窗口SMA的逻辑；同时，在next函数中完成交叉检测和买卖调用就行了。具体实现，你可以参考下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from utils import assert_msg, crossover, SMA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class SmaCross(Strategy):</span></span>
<span class="line"><span>    # 小窗口SMA的窗口大小，用于计算SMA快线</span></span>
<span class="line"><span>    fast = 10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 大窗口SMA的窗口大小，用于计算SMA慢线</span></span>
<span class="line"><span>    slow = 20</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def init(self):</span></span>
<span class="line"><span>        # 计算历史上每个时刻的快线和慢线</span></span>
<span class="line"><span>        self.sma1 = self.I(SMA, self.data.Close, self.fast)</span></span>
<span class="line"><span>        self.sma2 = self.I(SMA, self.data.Close, self.slow)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def next(self, tick):</span></span>
<span class="line"><span>        # 如果此时快线刚好越过慢线，买入全部</span></span>
<span class="line"><span>        if crossover(self.sma1[:tick], self.sma2[:tick]):</span></span>
<span class="line"><span>            self.buy()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 如果是慢线刚好越过快线，卖出全部</span></span>
<span class="line"><span>        elif crossover(self.sma2[:tick], self.sma1[:tick]):</span></span>
<span class="line"><span>            self.sell()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 否则，这个时刻不执行任何操作。</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            pass</span></span></code></pre></div><h2 id="模拟交易" tabindex="-1">模拟交易 <a class="header-anchor" href="#模拟交易" aria-label="Permalink to &quot;模拟交易&quot;">​</a></h2><p>到这里，我们的回测就只差最后一块儿了。胜利就在眼前，我们继续加油。</p><p>我们前面提到过，交易所类负责模拟交易，而模拟的基础，就是需要当前市场的价格。这里，我们可以用OHLC中的Close，作为那个时刻的价格。</p><p>此外，为了简化设计，我们假设买卖操作都利用的是当前账户的所有资金、仓位，且市场容量足够大。这样，我们的下单请求就能够马上完全执行。</p><p>也别忘了手续费这个大头。考虑到有手续费的情况，此时，我们最核心的买卖函数应该怎么来写呢？</p><p>我们一起来想这个问题。假设，我们现在有1000.0元，此时BTC的价格是100.00元（当然没有这么好的事情啊，这里只是假设），并且交易手续费为1%。那么，我们能买到多少BTC呢？</p><p>我们可以采用这种算法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>买到的数量 = 投入的资金 * (1.0 - 手续费) / 价格</span></span></code></pre></div><p>那么此时，你就能收到9.9个BTC。</p><p>类似的，卖出的时候结算方式如下，也不难理解：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>卖出的收益 = 持有的数量 * 价格 *  (1.0 - 手续费)</span></span></code></pre></div><p>所以，最终模拟交易所类的实现，你可以参考下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from utils import read_file, assert_msg, crossover, SMA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ExchangeAPI:</span></span>
<span class="line"><span>    def __init__(self, data, cash, commission):</span></span>
<span class="line"><span>        assert_msg(0 &amp;lt; cash, &quot;初始现金数量大于0，输入的现金数量：{}&quot;.format(cash))</span></span>
<span class="line"><span>        assert_msg(0 &amp;lt;= commission &amp;lt;= 0.05, &quot;合理的手续费率一般不会超过5%，输入的费率：{}&quot;.format(commission))</span></span>
<span class="line"><span>        self._inital_cash = cash</span></span>
<span class="line"><span>        self._data = data</span></span>
<span class="line"><span>        self._commission = commission</span></span>
<span class="line"><span>        self._position = 0</span></span>
<span class="line"><span>        self._cash = cash</span></span>
<span class="line"><span>        self._i = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def cash(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        :return: 返回当前账户现金数量</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        return self._cash</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def position(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        :return: 返回当前账户仓位</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        return self._position</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def initial_cash(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        :return: 返回初始现金数量</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        return self._inital_cash</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def market_value(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        :return: 返回当前市值</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        return self._cash + self._position * self.current_price</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;property</span></span>
<span class="line"><span>    def current_price(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        :return: 返回当前市场价格</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        return self._data.Close[self._i]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def buy(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        用当前账户剩余资金，按照市场价格全部买入</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        self._position = float(self._cash / (self.current_price * (1 + self._commission)))</span></span>
<span class="line"><span>        self._cash = 0.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def sell(self):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        卖出当前账户剩余持仓</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        self._cash += float(self._position * self.current_price * (1 - self._commission))</span></span>
<span class="line"><span>        self._position = 0.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def next(self, tick):</span></span>
<span class="line"><span>        self._i = tick</span></span></code></pre></div><p>其中的current_price（当前价格），可以方便地获得模拟交易所当前时刻的商品价格；而market_value，则可以获得当前总市值。在初始化函数的时候，我们检查手续费率和输入的现金数量，是不是在一个合理的范围。</p><p>有了所有的这些部分，我们就可以来模拟回测啦！</p><p>首先，我们设置初始资金量为10000.00美元，交易所手续费率为0。这里你可以猜一下，如果我们从2015年到现在，都按照SMA来买卖，现在应该有多少钱呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def main():</span></span>
<span class="line"><span>    BTCUSD = read_file(&#39;BTCUSD_GEMINI.csv&#39;)</span></span>
<span class="line"><span>    ret = Backtest(BTCUSD, SmaCross, ExchangeAPI, 10000.0, 0.00).run()</span></span>
<span class="line"><span>    print(ret)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    main()</span></span></code></pre></div><p>铛铛铛，答案揭晓，程序将输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>初始市值     10000.000000</span></span>
<span class="line"><span>结束市值     576361.772884</span></span>
<span class="line"><span>收益         566361.772884</span></span></code></pre></div><p>哇，结束时，我们将有57万美元，翻了整整57倍啊！简直不要太爽。不过，等等，这个手续费率为0，实在是有点碍眼，因为根本不可能啊。我们现在来设一个比较真实的值吧，大概千分之三，然后再来试试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>初始市值    10000.000000</span></span>
<span class="line"><span>结束市值     2036.562001</span></span>
<span class="line"><span>收益      -7963.437999</span></span></code></pre></div><p>什么鬼？我们变成赔钱了，只剩下2000美元了！这是真的吗？</p><p>这是真的，也是假的。</p><p>我说的“真”是指，如果你真的用SMA交叉这种简单的方法去交易，那么手续费摩擦和滑点等因素，确实可能让你的高频策略赔钱。</p><p>而我说是“假”是指，这种模拟交易的方式非常粗糙。真实的市场情况，并非这么理想——比如买卖请求永远马上执行；再比如，我们在市场中进行交易的同时不会影响市场价格等，这些理想情况都是不可能的。所以，很多时候，回测永远赚钱，但实盘马上赔钱。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这节课，我们继承上一节，介绍了回测框架的分类、数据的格式，并且带你从头开始写了一个简单的回测系统。你可以把今天的代码片段“拼”起来，这样就会得到一个简化的回测系统样例。同时，我们实现了一个简单的交易策略，并且在真实的历史数据上运行了回测结果。我们观察到，在加入手续费后，策略的收益情况发生了显著的变化。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>最后，给你留一个思考题。之前我们介绍了如何抓取tick数据，你可以根据抓取的tick数据，生成5分钟、每小时和每天的OHLCV数据吗？欢迎在留言区写下你的答案和问题，也欢迎你把这篇文章分享出去。</p>`,104)])])}const m=n(l,[["render",i]]);export{h as __pageData,m as default};
