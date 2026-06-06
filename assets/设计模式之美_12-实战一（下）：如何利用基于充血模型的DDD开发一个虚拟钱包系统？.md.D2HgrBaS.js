import{_ as n,H as s,f as e,i as l}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"12 | 实战一（下）：如何利用基于充血模型的DDD开发一个虚拟钱包系统？","description":"","frontmatter":{},"headers":[{"level":2,"title":"钱包业务背景介绍","slug":"钱包业务背景介绍","link":"#钱包业务背景介绍","children":[{"level":3,"title":"1.充值","slug":"_1-充值","link":"#_1-充值","children":[]},{"level":3,"title":"2.支付","slug":"_2-支付","link":"#_2-支付","children":[]},{"level":3,"title":"3.提现","slug":"_3-提现","link":"#_3-提现","children":[]},{"level":3,"title":"4.查询余额","slug":"_4-查询余额","link":"#_4-查询余额","children":[]},{"level":3,"title":"5.查询交易流水","slug":"_5-查询交易流水","link":"#_5-查询交易流水","children":[]}]},{"level":2,"title":"钱包系统的设计思路","slug":"钱包系统的设计思路","link":"#钱包系统的设计思路","children":[]},{"level":2,"title":"基于贫血模型的传统开发模式","slug":"基于贫血模型的传统开发模式","link":"#基于贫血模型的传统开发模式","children":[]},{"level":2,"title":"基于充血模型的DDD开发模式","slug":"基于充血模型的ddd开发模式","link":"#基于充血模型的ddd开发模式","children":[]},{"level":2,"title":"辩证思考与灵活应用","slug":"辩证思考与灵活应用","link":"#辩证思考与灵活应用","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/12-实战一（下）：如何利用基于充血模型的DDD开发一个虚拟钱包系统？.md","filePath":"设计模式之美/12-实战一（下）：如何利用基于充血模型的DDD开发一个虚拟钱包系统？.md","lastUpdated":1779822055000}'),p={name:"设计模式之美/12-实战一（下）：如何利用基于充血模型的DDD开发一个虚拟钱包系统？.md"};function t(i,a,c,r,o,u){return s(),e("div",null,[...a[0]||(a[0]=[l(`<h1 id="_12-实战一-下-如何利用基于充血模型的ddd开发一个虚拟钱包系统" tabindex="-1">12 | 实战一（下）：如何利用基于充血模型的DDD开发一个虚拟钱包系统？ <a class="header-anchor" href="#_12-实战一-下-如何利用基于充血模型的ddd开发一个虚拟钱包系统" aria-label="Permalink to &quot;12 | 实战一（下）：如何利用基于充血模型的DDD开发一个虚拟钱包系统？&quot;">​</a></h1><p>上一节课，我们做了一些理论知识的铺垫性讲解，讲到了两种开发模式，基于贫血模型的传统开发模式，以及基于充血模型的DDD开发模式。今天，我们正式进入实战环节，看如何分别用这两种开发模式，设计实现一个钱包系统。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="钱包业务背景介绍" tabindex="-1">钱包业务背景介绍 <a class="header-anchor" href="#钱包业务背景介绍" aria-label="Permalink to &quot;钱包业务背景介绍&quot;">​</a></h2><p>很多具有支付、购买功能的应用（比如淘宝、滴滴出行、极客时间等）都支持钱包的功能。应用为每个用户开设一个系统内的虚拟钱包账户，支持用户充值、提现、支付、冻结、透支、转赠、查询账户余额、查询交易流水等操作。下图是一张典型的钱包功能界面，你可以直观地感受一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/9e91377602ef154eaf866c7e9263a64a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/9e91377602ef154eaf866c7e9263a64a.jpg" alt=""></a></p><p>一般来讲，每个虚拟钱包账户都会对应用户的一个真实的支付账户，有可能是银行卡账户，也有可能是三方支付账户（比如支付宝、微信钱包）。为了方便后续的讲解，我们限定钱包暂时只支持充值、提现、支付、查询余额、查询交易流水这五个核心的功能，其他比如冻结、透支、转赠等不常用的功能，我们暂不考虑。为了让你理解这五个核心功能是如何工作的，接下来，我们来一块儿看下它们的业务实现流程。</p><h3 id="_1-充值" tabindex="-1">1.充值 <a class="header-anchor" href="#_1-充值" aria-label="Permalink to &quot;1.充值&quot;">​</a></h3><p>用户通过三方支付渠道，把自己银行卡账户内的钱，充值到虚拟钱包账号中。这整个过程，我们可以分解为三个主要的操作流程：第一个操作是从用户的银行卡账户转账到应用的公共银行卡账户；第二个操作是将用户的充值金额加到虚拟钱包余额上；第三个操作是记录刚刚这笔交易流水。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/3915a6544403854d35678c81fe65f014.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/3915a6544403854d35678c81fe65f014.jpg" alt=""></a></p><h3 id="_2-支付" tabindex="-1">2.支付 <a class="header-anchor" href="#_2-支付" aria-label="Permalink to &quot;2.支付&quot;">​</a></h3><p>用户用钱包内的余额，支付购买应用内的商品。实际上，支付的过程就是一个转账的过程，从用户的虚拟钱包账户划钱到商家的虚拟钱包账户上。除此之外，我们也需要记录这笔支付的交易流水信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/7eb44e2f8661d1c3debde85f79fb2c5e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/7eb44e2f8661d1c3debde85f79fb2c5e.jpg" alt=""></a></p><h3 id="_3-提现" tabindex="-1">3.提现 <a class="header-anchor" href="#_3-提现" aria-label="Permalink to &quot;3.提现&quot;">​</a></h3><p>除了充值、支付之外，用户还可以将虚拟钱包中的余额，提现到自己的银行卡中。这个过程实际上就是扣减用户虚拟钱包中的余额，并且触发真正的银行转账操作，从应用的公共银行账户转钱到用户的银行账户。同样，我们也需要记录这笔提现的交易流水信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/66ede1de93d29b86a9194ea0f80d1e43.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/66ede1de93d29b86a9194ea0f80d1e43.jpg" alt=""></a></p><h3 id="_4-查询余额" tabindex="-1">4.查询余额 <a class="header-anchor" href="#_4-查询余额" aria-label="Permalink to &quot;4.查询余额&quot;">​</a></h3><p>查询余额功能比较简单，我们看一下虚拟钱包中的余额数字即可。</p><h3 id="_5-查询交易流水" tabindex="-1">5.查询交易流水 <a class="header-anchor" href="#_5-查询交易流水" aria-label="Permalink to &quot;5.查询交易流水&quot;">​</a></h3><p>查询交易流水也比较简单。我们只支持三种类型的交易流水：充值、支付、提现。在用户充值、支付、提现的时候，我们会记录相应的交易信息。在需要查询的时候，我们只需要将之前记录的交易流水，按照时间、类型等条件过滤之后，显示出来即可。</p><h2 id="钱包系统的设计思路" tabindex="-1">钱包系统的设计思路 <a class="header-anchor" href="#钱包系统的设计思路" aria-label="Permalink to &quot;钱包系统的设计思路&quot;">​</a></h2><p>根据刚刚讲的业务实现流程和数据流转图，我们可以把整个钱包系统的业务划分为两部分，其中一部分单纯跟应用内的虚拟钱包账户打交道，另一部分单纯跟银行账户打交道。我们基于这样一个业务划分，给系统解耦，将整个钱包系统拆分为两个子系统：虚拟钱包系统和三方支付系统。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/60d3cfec73986b52e3a6ef4fe147e562.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/60d3cfec73986b52e3a6ef4fe147e562.jpg" alt=""></a></p><p>为了能在有限的篇幅内，将今天的内容讲透彻，我们接来下只聚焦于虚拟钱包系统的设计与实现。对于三方支付系统以及整个钱包系统的设计与实现，我们不做讲解。你可以自己思考下。</p><p><strong>现在我们来看下，如果要支持钱包的这五个核心功能，虚拟钱包系统需要对应实现哪些操作。</strong> 我画了一张图，列出了这五个功能都会对应虚拟钱包的哪些操作。注意，交易流水的记录和查询，我暂时在图中打了个问号，那是因为这块比较特殊，我们待会再讲。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/d1a9aeb6642404f80a62293ab2e45630.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/d1a9aeb6642404f80a62293ab2e45630.jpg" alt=""></a></p><p>从图中我们可以看出，虚拟钱包系统要支持的操作非常简单，就是余额的加加减减。其中，充值、提现、查询余额三个功能，只涉及一个账户余额的加减操作，而支付功能涉及两个账户的余额加减操作：一个账户减余额，另一个账户加余额。</p><p><strong>现在，我们再来看一下图中问号的那部分，也就是交易流水该如何记录和查询？</strong> 我们先来看一下，交易流水都需要包含哪些信息。我觉得下面这几个信息是必须包含的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/38b56bd1981d8b40ececa4d638e4a968.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/169631/38b56bd1981d8b40ececa4d638e4a968.jpg" alt=""></a></p><p>从图中我们可以发现，交易流水的数据格式包含两个钱包账号，一个是入账钱包账号，一个是出账钱包账号。为什么要有两个账号信息呢？这主要是为了兼容支付这种涉及两个账户的交易类型。不过，对于充值、提现这两种交易类型来说，我们只需要记录一个钱包账户信息就够了。</p><p>整个虚拟钱包的设计思路到此讲完了。接下来，我们来看一下，如何分别用基于贫血模型的传统开发模式和基于充血模型的DDD开发模式，来实现这样一个虚拟钱包系统？</p><h2 id="基于贫血模型的传统开发模式" tabindex="-1">基于贫血模型的传统开发模式 <a class="header-anchor" href="#基于贫血模型的传统开发模式" aria-label="Permalink to &quot;基于贫血模型的传统开发模式&quot;">​</a></h2><p>实际上，如果你有一定Web项目的开发经验，并且听明白了我刚刚讲的设计思路，那对你来说，利用基于贫血模型的传统开发模式来实现这样一个系统，应该是一件挺简单的事情。不过，为了对比两种开发模式，我还是带你一块儿来实现一遍。</p><p>这是一个典型的Web后端项目的三层结构。其中，Controller和VO负责暴露接口，具体的代码实现如下所示。注意，Controller中，接口实现比较简单，主要就是调用Service的方法，所以，我省略了具体的代码实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class VirtualWalletController {</span></span>
<span class="line"><span>  // 通过构造函数或者IOC框架注入</span></span>
<span class="line"><span>  private VirtualWalletService virtualWalletService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public BigDecimal getBalance(Long walletId) { ... } //查询余额</span></span>
<span class="line"><span>  public void debit(Long walletId, BigDecimal amount) { ... } //出账</span></span>
<span class="line"><span>  public void credit(Long walletId, BigDecimal amount) { ... } //入账</span></span>
<span class="line"><span>  public void transfer(Long fromWalletId, Long toWalletId, BigDecimal amount) { ...} //转账</span></span>
<span class="line"><span>  //省略查询transaction的接口</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Service和BO负责核心业务逻辑，Repository和Entity负责数据存取。Repository这一层的代码实现比较简单，不是我们讲解的重点，所以我也省略掉了。Service层的代码如下所示。注意，这里我省略了一些不重要的校验代码，比如，对amount是否小于0、钱包是否存在的校验等等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class VirtualWalletBo {//省略getter/setter/constructor方法</span></span>
<span class="line"><span>  private Long id;</span></span>
<span class="line"><span>  private Long createTime;</span></span>
<span class="line"><span>  private BigDecimal balance;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Enum TransactionType {</span></span>
<span class="line"><span>  DEBIT,</span></span>
<span class="line"><span>  CREDIT,</span></span>
<span class="line"><span>  TRANSFER;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class VirtualWalletService {</span></span>
<span class="line"><span>  // 通过构造函数或者IOC框架注入</span></span>
<span class="line"><span>  private VirtualWalletRepository walletRepo;</span></span>
<span class="line"><span>  private VirtualWalletTransactionRepository transactionRepo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public VirtualWalletBo getVirtualWallet(Long walletId) {</span></span>
<span class="line"><span>    VirtualWalletEntity walletEntity = walletRepo.getWalletEntity(walletId);</span></span>
<span class="line"><span>    VirtualWalletBo walletBo = convert(walletEntity);</span></span>
<span class="line"><span>    return walletBo;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public BigDecimal getBalance(Long walletId) {</span></span>
<span class="line"><span>    return walletRepo.getBalance(walletId);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void debit(Long walletId, BigDecimal amount) {</span></span>
<span class="line"><span>    VirtualWalletEntity walletEntity = walletRepo.getWalletEntity(walletId);</span></span>
<span class="line"><span>    BigDecimal balance = walletEntity.getBalance();</span></span>
<span class="line"><span>    if (balance.compareTo(amount) &amp;lt; 0) {</span></span>
<span class="line"><span>      throw new NoSufficientBalanceException(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    VirtualWalletTransactionEntity transactionEntity = new VirtualWalletTransactionEntity();</span></span>
<span class="line"><span>    transactionEntity.setAmount(amount);</span></span>
<span class="line"><span>    transactionEntity.setCreateTime(System.currentTimeMillis());</span></span>
<span class="line"><span>    transactionEntity.setType(TransactionType.DEBIT);</span></span>
<span class="line"><span>    transactionEntity.setFromWalletId(walletId);</span></span>
<span class="line"><span>    transactionRepo.saveTransaction(transactionEntity);</span></span>
<span class="line"><span>    walletRepo.updateBalance(walletId, balance.subtract(amount));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void credit(Long walletId, BigDecimal amount) {</span></span>
<span class="line"><span>    VirtualWalletTransactionEntity transactionEntity = new VirtualWalletTransactionEntity();</span></span>
<span class="line"><span>    transactionEntity.setAmount(amount);</span></span>
<span class="line"><span>    transactionEntity.setCreateTime(System.currentTimeMillis());</span></span>
<span class="line"><span>    transactionEntity.setType(TransactionType.CREDIT);</span></span>
<span class="line"><span>    transactionEntity.setFromWalletId(walletId);</span></span>
<span class="line"><span>    transactionRepo.saveTransaction(transactionEntity);</span></span>
<span class="line"><span>    VirtualWalletEntity walletEntity = walletRepo.getWalletEntity(walletId);</span></span>
<span class="line"><span>    BigDecimal balance = walletEntity.getBalance();</span></span>
<span class="line"><span>    walletRepo.updateBalance(walletId, balance.add(amount));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void transfer(Long fromWalletId, Long toWalletId, BigDecimal amount) {</span></span>
<span class="line"><span>    VirtualWalletTransactionEntity transactionEntity = new VirtualWalletTransactionEntity();</span></span>
<span class="line"><span>    transactionEntity.setAmount(amount);</span></span>
<span class="line"><span>    transactionEntity.setCreateTime(System.currentTimeMillis());</span></span>
<span class="line"><span>    transactionEntity.setType(TransactionType.TRANSFER);</span></span>
<span class="line"><span>    transactionEntity.setFromWalletId(fromWalletId);</span></span>
<span class="line"><span>    transactionEntity.setToWalletId(toWalletId);</span></span>
<span class="line"><span>    transactionRepo.saveTransaction(transactionEntity);</span></span>
<span class="line"><span>    debit(fromWalletId, amount);</span></span>
<span class="line"><span>    credit(toWalletId, amount);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="基于充血模型的ddd开发模式" tabindex="-1">基于充血模型的DDD开发模式 <a class="header-anchor" href="#基于充血模型的ddd开发模式" aria-label="Permalink to &quot;基于充血模型的DDD开发模式&quot;">​</a></h2><p>刚刚讲了如何利用基于贫血模型的传统开发模式来实现虚拟钱包系统，现在，我们再来看一下，如何利用基于充血模型的DDD开发模式来实现这个系统？</p><p>在上一节课中，我们讲到，基于充血模型的DDD开发模式，跟基于贫血模型的传统开发模式的主要区别就在Service层，Controller层和Repository层的代码基本上相同。所以，我们重点看一下，Service层按照基于充血模型的DDD开发模式该如何来实现。</p><p>在这种开发模式下，我们把虚拟钱包VirtualWallet类设计成一个充血的Domain领域模型，并且将原来在Service类中的部分业务逻辑移动到VirtualWallet类中，让Service类的实现依赖VirtualWallet类。具体的代码实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class VirtualWallet { // Domain领域模型(充血模型)</span></span>
<span class="line"><span>  private Long id;</span></span>
<span class="line"><span>  private Long createTime = System.currentTimeMillis();;</span></span>
<span class="line"><span>  private BigDecimal balance = BigDecimal.ZERO;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public VirtualWallet(Long preAllocatedId) {</span></span>
<span class="line"><span>    this.id = preAllocatedId;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public BigDecimal balance() {</span></span>
<span class="line"><span>    return this.balance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void debit(BigDecimal amount) {</span></span>
<span class="line"><span>    if (this.balance.compareTo(amount) &amp;lt; 0) {</span></span>
<span class="line"><span>      throw new InsufficientBalanceException(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.balance = this.balance.subtract(amount);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void credit(BigDecimal amount) {</span></span>
<span class="line"><span>    if (amount.compareTo(BigDecimal.ZERO) &amp;lt; 0) {</span></span>
<span class="line"><span>      throw new InvalidAmountException(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.balance = this.balance.add(amount);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class VirtualWalletService {</span></span>
<span class="line"><span>  // 通过构造函数或者IOC框架注入</span></span>
<span class="line"><span>  private VirtualWalletRepository walletRepo;</span></span>
<span class="line"><span>  private VirtualWalletTransactionRepository transactionRepo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public VirtualWallet getVirtualWallet(Long walletId) {</span></span>
<span class="line"><span>    VirtualWalletEntity walletEntity = walletRepo.getWalletEntity(walletId);</span></span>
<span class="line"><span>    VirtualWallet wallet = convert(walletEntity);</span></span>
<span class="line"><span>    return wallet;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public BigDecimal getBalance(Long walletId) {</span></span>
<span class="line"><span>    return walletRepo.getBalance(walletId);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void debit(Long walletId, BigDecimal amount) {</span></span>
<span class="line"><span>    VirtualWalletEntity walletEntity = walletRepo.getWalletEntity(walletId);</span></span>
<span class="line"><span>    VirtualWallet wallet = convert(walletEntity);</span></span>
<span class="line"><span>    wallet.debit(amount);</span></span>
<span class="line"><span>    VirtualWalletTransactionEntity transactionEntity = new VirtualWalletTransactionEntity();</span></span>
<span class="line"><span>    transactionEntity.setAmount(amount);</span></span>
<span class="line"><span>    transactionEntity.setCreateTime(System.currentTimeMillis());</span></span>
<span class="line"><span>    transactionEntity.setType(TransactionType.DEBIT);</span></span>
<span class="line"><span>    transactionEntity.setFromWalletId(walletId);</span></span>
<span class="line"><span>    transactionRepo.saveTransaction(transactionEntity);</span></span>
<span class="line"><span>    walletRepo.updateBalance(walletId, wallet.balance());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void credit(Long walletId, BigDecimal amount) {</span></span>
<span class="line"><span>    VirtualWalletEntity walletEntity = walletRepo.getWalletEntity(walletId);</span></span>
<span class="line"><span>    VirtualWallet wallet = convert(walletEntity);</span></span>
<span class="line"><span>    wallet.credit(amount);</span></span>
<span class="line"><span>    VirtualWalletTransactionEntity transactionEntity = new VirtualWalletTransactionEntity();</span></span>
<span class="line"><span>    transactionEntity.setAmount(amount);</span></span>
<span class="line"><span>    transactionEntity.setCreateTime(System.currentTimeMillis());</span></span>
<span class="line"><span>    transactionEntity.setType(TransactionType.CREDIT);</span></span>
<span class="line"><span>    transactionEntity.setFromWalletId(walletId);</span></span>
<span class="line"><span>    transactionRepo.saveTransaction(transactionEntity);</span></span>
<span class="line"><span>    walletRepo.updateBalance(walletId, wallet.balance());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Transactional</span></span>
<span class="line"><span>  public void transfer(Long fromWalletId, Long toWalletId, BigDecimal amount) {</span></span>
<span class="line"><span>    //...跟基于贫血模型的传统开发模式的代码一样...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看了上面的代码，你可能会说，领域模型VirtualWallet类很单薄，包含的业务逻辑很简单。相对于原来的贫血模型的设计思路，这种充血模型的设计思路，貌似并没有太大优势。你说得没错！这也是大部分业务系统都使用基于贫血模型开发的原因。不过，如果虚拟钱包系统需要支持更复杂的业务逻辑，那充血模型的优势就显现出来了。比如，我们要支持透支一定额度和冻结部分余额的功能。这个时候，我们重新来看一下VirtualWallet类的实现代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class VirtualWallet {</span></span>
<span class="line"><span>  private Long id;</span></span>
<span class="line"><span>  private Long createTime = System.currentTimeMillis();;</span></span>
<span class="line"><span>  private BigDecimal balance = BigDecimal.ZERO;</span></span>
<span class="line"><span>  private boolean isAllowedOverdraft = true;</span></span>
<span class="line"><span>  private BigDecimal overdraftAmount = BigDecimal.ZERO;</span></span>
<span class="line"><span>  private BigDecimal frozenAmount = BigDecimal.ZERO;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public VirtualWallet(Long preAllocatedId) {</span></span>
<span class="line"><span>    this.id = preAllocatedId;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void freeze(BigDecimal amount) { ... }</span></span>
<span class="line"><span>  public void unfreeze(BigDecimal amount) { ...}</span></span>
<span class="line"><span>  public void increaseOverdraftAmount(BigDecimal amount) { ... }</span></span>
<span class="line"><span>  public void decreaseOverdraftAmount(BigDecimal amount) { ... }</span></span>
<span class="line"><span>  public void closeOverdraft() { ... }</span></span>
<span class="line"><span>  public void openOverdraft() { ... }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public BigDecimal balance() {</span></span>
<span class="line"><span>    return this.balance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public BigDecimal getAvaliableBalance() {</span></span>
<span class="line"><span>    BigDecimal totalAvaliableBalance = this.balance.subtract(this.frozenAmount);</span></span>
<span class="line"><span>    if (isAllowedOverdraft) {</span></span>
<span class="line"><span>      totalAvaliableBalance += this.overdraftAmount;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return totalAvaliableBalance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void debit(BigDecimal amount) {</span></span>
<span class="line"><span>    BigDecimal totalAvaliableBalance = getAvaliableBalance();</span></span>
<span class="line"><span>    if (totoalAvaliableBalance.compareTo(amount) &amp;lt; 0) {</span></span>
<span class="line"><span>      throw new InsufficientBalanceException(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.balance = this.balance.subtract(amount);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void credit(BigDecimal amount) {</span></span>
<span class="line"><span>    if (amount.compareTo(BigDecimal.ZERO) &amp;lt; 0) {</span></span>
<span class="line"><span>      throw new InvalidAmountException(...);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.balance = this.balance.add(amount);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>领域模型VirtualWallet类添加了简单的冻结和透支逻辑之后，功能看起来就丰富了很多，代码也没那么单薄了。如果功能继续演进，我们可以增加更加细化的冻结策略、透支策略、支持钱包账号（VirtualWallet id字段）自动生成的逻辑（不是通过构造函数经外部传入ID，而是通过分布式ID生成算法来自动生成ID）等等。VirtualWallet类的业务逻辑会变得越来越复杂，也就很值得设计成充血模型了。</p><h2 id="辩证思考与灵活应用" tabindex="-1">辩证思考与灵活应用 <a class="header-anchor" href="#辩证思考与灵活应用" aria-label="Permalink to &quot;辩证思考与灵活应用&quot;">​</a></h2><p>对于虚拟钱包系统的设计与两种开发模式的代码实现，我想你应该有个比较清晰的了解了。不过，我觉得还有两个问题值得讨论一下。</p><p><strong>第一个要讨论的问题是：在基于充血模型的DDD开发模式中，将业务逻辑移动到Domain中，Service类变得很薄，但在我们的代码设计与实现中，并没有完全将Service类去掉，这是为什么？或者说，Service类在这种情况下担当的职责是什么？哪些功能逻辑会放到Service类中？</strong></p><p>区别于Domain的职责，Service类主要有下面这样几个职责。</p><p>1.Service类负责与Repository交流。在我的设计与代码实现中，VirtualWalletService类负责与Repository层打交道，调用Respository类的方法，获取数据库中的数据，转化成领域模型VirtualWallet，然后由领域模型VirtualWallet来完成业务逻辑，最后调用Repository类的方法，将数据存回数据库。</p><p>这里我再稍微解释一下，之所以让VirtualWalletService类与Repository打交道，而不是让领域模型VirtualWallet与Repository打交道，那是因为我们想保持领域模型的独立性，不与任何其他层的代码（Repository层的代码）或开发框架（比如Spring、MyBatis）耦合在一起，将流程性的代码逻辑（比如从DB中取数据、映射数据）与领域模型的业务逻辑解耦，让领域模型更加可复用。</p><p>2.Service类负责跨领域模型的业务聚合功能。VirtualWalletService类中的transfer()转账函数会涉及两个钱包的操作，因此这部分业务逻辑无法放到VirtualWallet类中，所以，我们暂且把转账业务放到VirtualWalletService类中了。当然，虽然功能演进，使得转账业务变得复杂起来之后，我们也可以将转账业务抽取出来，设计成一个独立的领域模型。</p><p>3.Service类负责一些非功能性及与三方系统交互的工作。比如幂等、事务、发邮件、发消息、记录日志、调用其他系统的RPC接口等，都可以放到Service类中。</p><p><strong>第二个要讨论问题是：在基于充血模型的DDD开发模式中，尽管Service层被改造成了充血模型，但是Controller层和Repository层还是贫血模型，是否有必要也进行充血领域建模呢？</strong></p><p>答案是没有必要。Controller层主要负责接口的暴露，Repository层主要负责与数据库打交道，这两层包含的业务逻辑并不多，前面我们也提到了，如果业务逻辑比较简单，就没必要做充血建模，即便设计成充血模型，类也非常单薄，看起来也很奇怪。</p><p>尽管这样的设计是一种面向过程的编程风格，但我们只要控制好面向过程编程风格的副作用，照样可以开发出优秀的软件。那这里的副作用怎么控制呢？</p><p>就拿Repository的Entity来说，即便它被设计成贫血模型，违反面向对象编程的封装特性，有被任意代码修改数据的风险，但Entity的生命周期是有限的。一般来讲，我们把它传递到Service层之后，就会转化成BO或者Domain来继续后面的业务逻辑。Entity的生命周期到此就结束了，所以也并不会被到处任意修改。</p><p>我们再来说说Controller层的VO。实际上VO是一种DTO（Data Transfer Object，数据传输对象）。它主要是作为接口的数据传输承载体，将数据发送给其他系统。从功能上来讲，它理应不包含业务逻辑、只包含数据。所以，我们将它设计成贫血模型也是比较合理的。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天的内容到此就讲完了。我们一块来总结回顾一下，你应该重点掌握的知识点。</p><p>基于充血模型的DDD开发模式跟基于贫血模型的传统开发模式相比，主要区别在Service层。在基于充血模型的开发模式下，我们将部分原来在Service类中的业务逻辑移动到了一个充血的Domain领域模型中，让Service类的实现依赖这个Domain类。</p><p>在基于充血模型的DDD开发模式下，Service类并不会完全移除，而是负责一些不适合放在Domain类中的功能。比如，负责与Repository层打交道、跨领域模型的业务聚合功能、幂等事务等非功能性的工作。</p><p>基于充血模型的DDD开发模式跟基于贫血模型的传统开发模式相比，Controller层和Repository层的代码基本上相同。这是因为，Repository层的Entity生命周期有限，Controller层的VO只是单纯作为一种DTO。两部分的业务逻辑都不会太复杂。业务逻辑主要集中在Service层。所以，Repository层和Controller层继续沿用贫血模型的设计思路是没有问题的。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>这两节课中对于DDD的讲解，都是我的个人主观看法，你可能会有不同看法。</p><p>欢迎在留言区说一说你对DDD的看法。如果觉得有帮助，你也可以把这篇文章分享给你的朋友。</p>`,66)])])}const m=n(p,[["render",t]]);export{E as __pageData,m as default};
