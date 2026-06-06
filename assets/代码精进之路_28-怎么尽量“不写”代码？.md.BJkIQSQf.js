import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"28 | 怎么尽量“不写”代码？","description":"","frontmatter":{},"headers":[{"level":2,"title":"不要重新发明轮子","slug":"不要重新发明轮子","link":"#不要重新发明轮子","children":[]},{"level":2,"title":"推动轮子的改进","slug":"推动轮子的改进","link":"#推动轮子的改进","children":[]},{"level":2,"title":"不要重复多个轮子","slug":"不要重复多个轮子","link":"#不要重复多个轮子","children":[]},{"level":2,"title":"该放手时就放手","slug":"该放手时就放手","link":"#该放手时就放手","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"一起来动手","slug":"一起来动手","link":"#一起来动手","children":[]}],"relativePath":"代码精进之路/28-怎么尽量“不写”代码？.md","filePath":"代码精进之路/28-怎么尽量“不写”代码？.md","lastUpdated":1779818598000}'),i={name:"代码精进之路/28-怎么尽量“不写”代码？.md"};function l(t,a,r,c,o,d){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_28-怎么尽量-不写-代码" tabindex="-1">28 | 怎么尽量“不写”代码？ <a class="header-anchor" href="#_28-怎么尽量-不写-代码" aria-label="Permalink to &quot;28 | 怎么尽量“不写”代码？&quot;">​</a></h1><p>最有效率的编码就是少编写代码，甚至不编写代码。前面，我们讨论过避免需求膨胀和设计过度，就是减少编码的办法之一。这一次，我们讨论代码复用的问题。商业的规模依赖于可复制性，代码的质量依赖于可复用性。</p><p>比如，Java提供了很多的类库和工具，就是为了让Java程序员不再编写类似的代码，直接拿来使用就可以了。</p><h2 id="不要重新发明轮子" tabindex="-1">不要重新发明轮子 <a class="header-anchor" href="#不要重新发明轮子" aria-label="Permalink to &quot;不要重新发明轮子&quot;">​</a></h2><p>“不要重新发明轮子”，这是一个流传甚广的关于软件复用的话。如果已经有了一个轮子，可以拿来复用，就不用再重新发明一个新轮子了。 <strong>复用</strong>，是这句话的精髓部分。</p><p>如果没有现成的轮子，我们需要造一个新的。如果造的轮子可以复用，那就再好不过了。造轮子的过程，就是我们设计和实现复用接口的过程。</p><p>我刚参加工作的时候，从事的是银行综合业务系统的研发工作。银行的业务，牵涉到大量的报表。每一个报表的生成和处理，都是一个费力的编码环节。需要大量的代码，反复调试，才能生成一张漂亮的报表。那时候，市面上也没有什么可以使用的解决方案。我有一个同事负责这方面的工作，刚开始的辛苦程度可想而知。</p><p>过了几年，我们再聊起报表业务的时候，发现他已经在报表处理方面建立了巨大的优势。这个优势，就是报表处理代码的复用。他把报表的生成和处理，提炼成了一个使用非常简单的产品。用户只要使用图形界面做些简单的配置，就能生成漂亮的报表。编写大量代码、反复调试的时代，已经一去不复返了。传统的方式需要几个月的工作量，使用这个工具几天时间就搞定了。而且，客户还可以自己定义生成什么样的报表。生成花样报表的需求依然存在，但是再也不需要大量的重复劳动了。这个产品的优势，帮助他赢得了很多重要的客户。</p><p>什么样的代码可以复用呢？ <strong>一般来说，当我们使用类似的代码或者类似的功能超过两次时，就应该考虑这样的代码是不是可以复用了。</strong> 比如，当我们拷贝粘贴一段代码时，也许会做一点微小的修改，然后用到新的代码里。这时候，我们就要考虑，这段拷贝的代码是不是可以抽象成一个方法？有了抽象出来的方法，我们就不需要把这段代码拷贝到别的地方了。如果这段代码有错误，我们也只需要修改这个方法的实现就可以了。</p><h2 id="推动轮子的改进" tabindex="-1">推动轮子的改进 <a class="header-anchor" href="#推动轮子的改进" aria-label="Permalink to &quot;推动轮子的改进&quot;">​</a></h2><p>轮子发明出来了，并不意味着这个轮子就永远没有问题了。它是需要持续改进的，比如，修改错误，修复安全问题，提高计算性能等等。</p><p>“不要重新发明轮子”这句话的另外一层意思，就是改进现有的轮子。如果发现轮子有问题，不要首先试图去重新发明一个相同的轮子，而是去改进它。</p><p>每一个可以复用的代码，特别是那些经过时间检验的接口，都踩过了很多坑，经过了多年的优化。如果我们试着重新编写一个相同的接口，一般意味着这些坑我们要重新考虑一遍，还不一定能够做得更好。</p><p>比如说吧，我们前面提到了Java核心类库里String类的设计缺陷。为了避免这样的缺陷，我们当然可以发明一个新的MyString类。但是，这意味着我们要维护它以保持它长久的生命力。Java的String类，有OpenJDK社区的强大支撑，有几十亿台设备使用，有专业的人员维护、更新和改进。而我们自己发明的MyString类，就很难有这样的资源和力量去维护它。</p><p>当然，我们也不能坐等轮子的改进。 <strong>如果一个可以复用的代码出了问题，我们要第一时间叫喊起来</strong>。这对代码的维护者而言，是一个发现问题、改进代码的机会。一般来说，代码维护者，都喜欢这样的声音，并且能够及时地反馈。我们可以通过发邮件，提交bug等我们知道的任何渠道，让代码的维护者知晓问题的存在。这样，我们就加入了改进的过程，间接影响了代码的质量。</p><p>使用现有的轮子固然方便，但是如果它满足不了你的需求，或者你不能使用，也不要被“不要重新发明轮子”这句话绊住了脚。需要新轮子的时候，就去发明新轮子。</p><p>如果你去观察市场，每一种好东西，都可能有好几个品牌在竞争。手机不仅仅只有一个品牌，豆浆机也不仅仅只有一个型号，云服务也不仅仅由一家提供，互联网支付也有多种选择。如果仔细看，类似的产品也有很多不同的地方。不同的地方，就是不同的产品有意或者无意做的市场区隔。</p><h2 id="不要重复多个轮子" tabindex="-1">不要重复多个轮子 <a class="header-anchor" href="#不要重复多个轮子" aria-label="Permalink to &quot;不要重复多个轮子&quot;">​</a></h2><p>市场上存在多个轮子是合理的。但是在一个软件产品中，一个单一功能，只应该有一个轮子。如果有多个相同的轮子，不仅难以维护，而且难以使用，会造成很多编码的困扰。</p><p>比如说，在JDK 11中，我们引入了一个通过标准名称命名已知参数的类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package java.security.spec;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * This class is used to specify any algorithm parameters that are determined</span></span>
<span class="line"><span> * by a standard name.</span></span>
<span class="line"><span> * &amp;lt;snipped&amp;gt;</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class NamedParameterSpec implements AlgorithmParameterSpec {</span></span>
<span class="line"><span>    public NamedParameterSpec(String standardName) {</span></span>
<span class="line"><span>        // snipped</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        // snipped</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个类单独看，并没有什么不妥当的地方。但是，如果放在更大范围里来看，这个新添加的类就引起了不小的麻烦。这是因为还存在另外一个相似的扩展类。</p><p>而且，由于这个扩展类和它继承的类，功能几乎完全重合，带来的困扰就是，本来我们只需要一个轮子就能解决的问题，现在不得不考虑两个轮子的问题。而且，由于ECGenParameterSpec的存在，我们还可能忘记了要考虑使用更基础的NamedParameterSpec类。</p><p>问题代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public void initialize(AlgorithmParameterSpec params)</span></span>
<span class="line"><span>            throws InvalidAlgorithmParameterException {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>    if (params instanceof ECGenParameterSpec) {</span></span>
<span class="line"><span>        String name = ((ECGenParameterSpec)params).getName();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        throw new InvalidAlgorithmParameterException(</span></span>
<span class="line"><span>                &quot;ECParameterSpec or ECGenParameterSpec required for EC&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>正确代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public void initialize(AlgorithmParameterSpec params)</span></span>
<span class="line"><span>            throws InvalidAlgorithmParameterException {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>    if (params instanceof NamedParameterSpec) {</span></span>
<span class="line"><span>        String name = ((NamedParameterSpec)params).getName();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        throw new InvalidAlgorithmParameterException(</span></span>
<span class="line"><span>                &quot;ECParameterSpec or ECGenParameterSpec required for EC&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的问题，是JDK 11引入的一个编码困扰。这个困扰，导致了很多使用的问题。由于是公开接口，它的影响，要经过好多年才能慢慢消除。也许很快，在JDK的某一个版本中，这个扩展的ECGenParameterSpec类就会被废弃掉。</p><h2 id="该放手时就放手" tabindex="-1">该放手时就放手 <a class="header-anchor" href="#该放手时就放手" aria-label="Permalink to &quot;该放手时就放手&quot;">​</a></h2><p>你有没有这样的体验，一个看起来很微不足道的修改，或者没有任何问题的修改，会带来一连串的连锁反应，导致意想不到的问题出现？</p><p>前不久，OpenJDK调整了两个方法的调用顺序。 大致的修改就像下面的例子。</p><p>修改前：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Signature getSignature(PrivateKey privateKey,</span></span>
<span class="line"><span>    AlgorithmParameterSpec signAlgParameter) throws NoSuchAlgorithmException,</span></span>
<span class="line"><span>    InvalidAlgorithmParameterException, InvalidKeyException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Signature signer = Signature.getInstance(&quot;RSASSA-PSS&quot;);</span></span>
<span class="line"><span>    if (signAlgParameter != null) {</span></span>
<span class="line"><span>        signer.setParameter(signAlgParameter);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    signer.initSign(privateKey);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return signer;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>修改后：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Signature getSignature(PrivateKey privateKey,</span></span>
<span class="line"><span>    AlgorithmParameterSpec signAlgParameter) throws NoSuchAlgorithmException,</span></span>
<span class="line"><span>    InvalidAlgorithmParameterException, InvalidKeyException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Signature signer = Signature.getInstance(&quot;RSASSA-PSS&quot;);</span></span>
<span class="line"><span>    signer.initSign(privateKey);</span></span>
<span class="line"><span>    if (signAlgParameter != null) {</span></span>
<span class="line"><span>        signer.setParameter(signAlgParameter);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return signer;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个修改仅仅调换了一下两个方法的调用顺序。根据这两个方法的接口规范，调用顺序的修改不应该出现任何问题。然而，让人意向不到的是，这个接口的实现者，大都依赖于严格的调用顺序。修改前的调用顺序，已经使用了十多年了，大家都习以为常，认为严格的调用顺序依赖并没有问题。一旦改变了这个调用顺序，很多应用程序就不能正常工作了，就会出现严重的兼容性问题。</p><p>我们每个人都会写很多烂代码，过去写过，未来可能还会再写。这些烂代码，如果运行得很好，没有出现明显的问题，我们就放手吧。</p><p>但不是说烂代码我们就永远不管不问了。那么，什么时候修改烂代码呢？代码投入使用之前，以及代码出问题的时候，就是我们修改烂代码的时候。</p><p>那么代码的修改都有哪些需要注意的地方呢？</p><p>代码规范方面的修改，可以大胆些。比如命名规范、代码整理，这些都动不了代码的逻辑，是安全的修改。</p><p>代码结构方面的修改，则要谨慎些，不要伤及代码的逻辑。比如把嵌套太多的循环拆分成多个方法，把几百行的代码，拆分成不同的方法，把相似的代码抽象成复用的方法，这些也是相对安全的修改。</p><p>代码逻辑方面的修改，要特别小心，除了有明显的问题，我们都尽量避免修改代码的逻辑。即使像上面例子中那样的微小的调用顺序的改变，都可能有意想不到的问题。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我们聊了代码复用的一些基本概念。关键的有三点：</p><ol><li><p>要提高代码的复用比例，减少编码的绝对数量；</p></li><li><p>要复用外部的优质接口，并且推动它们的改进；</p></li><li><p>烂代码该放手时就放手，以免引起不必要的兼容问题。</p></li></ol><h2 id="一起来动手" tabindex="-1">一起来动手 <a class="header-anchor" href="#一起来动手" aria-label="Permalink to &quot;一起来动手&quot;">​</a></h2><p>今天的练手题，我们来分析下OpenJDK的一个接口设计问题。</p><p>不可更改的集合，是OpenJDK的核心类库提供的一个重要功能。这个功能，有助于我们设计实现“一成不变”的接口，降低编码的复杂度。</p><p>从JDK 1.2开始，这个功能是通过Collections类的方法实现的。比如Collections.unmodifiableList()方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &amp;lt;T&amp;gt; List&amp;lt;T&amp;gt; unmodifiableList​(List&amp;lt;? extends T&amp;gt; list)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Returns an unmodifiable view of the specified list. Query operations on the returned list &quot;read through&quot; to the specified list, and attempts to modify the returned list, whether direct or via its iterator, result in an UnsupportedOperationException.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>The returned list will be serializable if the specified list is serializable. Similarly, the returned list will implement RandomAccess if the specified list does.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Type Parameters:</span></span>
<span class="line"><span>    T - the class of the objects in the list</span></span>
<span class="line"><span>Parameters:</span></span>
<span class="line"><span>    list - the list for which an unmodifiable view is to be returned.</span></span>
<span class="line"><span>Returns:</span></span>
<span class="line"><span>    an unmodifiable view of the specified list.</span></span></code></pre></div><p>在JDK 10里，又添加了新的生成不可更改的集合的方法。比如List.copyOf()方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static &amp;lt;E&amp;gt; List&amp;lt;E&amp;gt; copyOf​(Collection&amp;lt;? extends E&amp;gt; coll)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Returns an unmodifiable List containing the elements of the given Collection, in its iteration order. The given Collection must not be null, and it must not contain any null elements. If the given Collection is subsequently modified, the returned List will not reflect such modifications.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Implementation Note:</span></span>
<span class="line"><span>    If the given Collection is an unmodifiable List, calling copyOf will generally not create a copy.</span></span>
<span class="line"><span>Type Parameters:</span></span>
<span class="line"><span>    E - the List&#39;s element type</span></span>
<span class="line"><span>Parameters:</span></span>
<span class="line"><span>    coll - a Collection from which elements are drawn, must be non-null</span></span>
<span class="line"><span>Returns:</span></span>
<span class="line"><span>    a List containing the elements of the given Collection</span></span>
<span class="line"><span>Throws:</span></span>
<span class="line"><span>    NullPointerException - if coll is null, or if it contains any nulls</span></span>
<span class="line"><span>Since:</span></span>
<span class="line"><span>    10</span></span></code></pre></div><p>比较两个接口，你能够理解新接口的改进吗？为什么新加了一个接口，而不是改进原来的接口？为什么使用了一个新的类（List），而不是在原来的类（Collections）里加一个新方法？</p><p>欢迎你在留言区讨论上面的问题，我们一起来了解很多接口设计背后的妥协，以及接口演进的办法。也欢迎点击“请朋友读”，把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,54)])])}const g=n(i,[["render",l]]);export{m as __pageData,g as default};
