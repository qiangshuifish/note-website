import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"34 | 数组和集合，可变量的安全陷阱","description":"","frontmatter":{},"headers":[{"level":2,"title":"评审案例","slug":"评审案例","link":"#评审案例","children":[]},{"level":2,"title":"案例分析","slug":"案例分析","link":"#案例分析","children":[]},{"level":2,"title":"可变量局部化","slug":"可变量局部化","link":"#可变量局部化","children":[]},{"level":2,"title":"支持实例拷贝","slug":"支持实例拷贝","link":"#支持实例拷贝","children":[]},{"level":2,"title":"浅拷贝与深拷贝","slug":"浅拷贝与深拷贝","link":"#浅拷贝与深拷贝","children":[]},{"level":2,"title":"拷贝","slug":"拷贝","link":"#拷贝","children":[]},{"level":2,"title":"麻烦的集合","slug":"麻烦的集合","link":"#麻烦的集合","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"一起来动手","slug":"一起来动手","link":"#一起来动手","children":[]}],"relativePath":"代码精进之路/34-数组和集合，可变量的安全陷阱.md","filePath":"代码精进之路/34-数组和集合，可变量的安全陷阱.md","lastUpdated":1779818598000}'),l={name:"代码精进之路/34-数组和集合，可变量的安全陷阱.md"};function t(i,a,c,o,r,d){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_34-数组和集合-可变量的安全陷阱" tabindex="-1">34 | 数组和集合，可变量的安全陷阱 <a class="header-anchor" href="#_34-数组和集合-可变量的安全陷阱" aria-label="Permalink to &quot;34 | 数组和集合，可变量的安全陷阱&quot;">​</a></h1><p>在前面的章节里，我们讨论了不少不可变量的好处。在代码安全中，不可变量也减少了很多纠葛的发生，可变量则是一个非常难缠的麻烦。</p><h2 id="评审案例" tabindex="-1">评审案例 <a class="header-anchor" href="#评审案例" aria-label="Permalink to &quot;评审案例&quot;">​</a></h2><p>我们一起看下这段JavaScript代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var mutableArray = [0, {</span></span>
<span class="line"><span>    toString : function() {</span></span>
<span class="line"><span>      mutableArray.length = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }, 2];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(&quot;Array before join(): &quot;, mutableArray);</span></span>
<span class="line"><span>mutableArray.join(&#39;&#39;);</span></span>
<span class="line"><span>console.log(&quot;Array after join(): &quot;, mutableArray);</span></span></code></pre></div><p>调用mutableArray.join()前后，你知道数组mutableArray的变化吗？调用join()前，数组mutableArray包含两个数字，一个函数 （{10, {}, 20}）。调用join()后，数组mutableArray就变成一个空数组了。这其中的秘密就在于join()的实现，执行了数组中toString()函数。而toString()函数的实现，把数组\bmutableArray设置为空数组。</p><p>下面的代码，就是JavaScript引擎实现数组join()方法的一段内部C代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static JSBool</span></span>
<span class="line"><span>array_toString_sub(JSContext *cx, JSObject *obj, JSBool locale,</span></span>
<span class="line"><span>                   JSString *sepstr, CallArgs &amp;args) {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>    size_t seplen;</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>    StringBuffer sb(cx);</span></span>
<span class="line"><span>    if (!locale &amp;&amp; !seplen &amp;&amp; obj-&amp;gt;isDenseArray() &amp;&amp;</span></span>
<span class="line"><span>        !js_PrototypeHasIndexedProperties(cx, obj)) {</span></span>
<span class="line"><span>        // Elements beyond the initialized length are</span></span>
<span class="line"><span>        // &#39;undefined&#39; and thus can be ignored.</span></span>
<span class="line"><span>        const Value *beg = obj-&amp;gt;getDenseArrayElements();</span></span>
<span class="line"><span>        const Value *end =</span></span>
<span class="line"><span>            beg + Min(length, obj-&amp;gt;getDenseArrayInitializedLength());</span></span>
<span class="line"><span>        for (const Value *vp = beg; vp != end; ++vp) {</span></span>
<span class="line"><span>            if (!JS_CHECK_OPERATION_LIMIT(cx))</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (!vp-&amp;gt;isMagic(JS_ARRAY_HOLE) &amp;&amp;</span></span>
<span class="line"><span>                !vp-&amp;gt;isNullOrUndefined()) {</span></span>
<span class="line"><span>                if (!ValueToStringBuffer(cx, *vp, sb))</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码，把数组的起始地址记录在beg变量里，把数组的结束地址记录在end变量里。然后，从beg变量开始，通过调用ValueToStringBuffer()函数，把数组里的每一个变量，转换成字符串。</p><p>我们一起来看看第一段代码，是怎么在这段join()实现的for循环代码里执行的。</p><ol><li><p>vp指针初始化后，指向数组的起始地址；</p></li><li><p>如果vp的地址不等于数组的结束地址end，就把数组变量转换成字符串，然后变换vp指针到下一个地址 。我们一起来看看这段代码是如何操作数组mutableArray的：</p><p>a. 数组的第一个变量是0。0被转换成字符，vp指针换到下一个地址；</p><p>b. 数组的第二个变量是toString()函数。toString()函数被调用后，就会把mutableArray这个数组设置为空数组，vp指针换到下一个地址；</p><p>c. 数组的第三个变量本来应该是2。但是，由于数组在上一步被置为空数组，数组的第三个变量的指针指向数组外地址。</p></li><li><p>由于数组已经被设置为空数组，原数组的地址可能已经被其他数据占用，访问空数组外的地址就会造成内存泄漏或者程序崩溃。</p></li></ol><p>通过设置第一段代码里的mutableArray和利用这个内存泄漏的漏洞，攻击者可以远程执行任意代码，获取敏感信息或者造成服务崩溃。这是一个 <a href="https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:H" target="_blank" rel="noreferrer">通用缺陷评分系统评分为9.9</a> 的严重安全缺陷。</p><h2 id="案例分析" tabindex="-1">案例分析 <a class="header-anchor" href="#案例分析" aria-label="Permalink to &quot;案例分析&quot;">​</a></h2><p>我们上面讨论的第一段代码里的mutableArray的构造方式，是一个典型的用于检查JavaScript引擎实现或者其他JavaScript数组使用缺陷的技术范例。</p><p>近十多年来，陆续发现了一些相似的JavaScript引擎数组实现的严重安全漏洞。几乎所有主流的JavaScript引擎提供商都受到了影响。我们太习惯使用数组的编码模式了，数组长度的变化，很难进入我们的考量范围。因此，查看或者编写这些实现代码，我们很难发现里面的漏洞，除非我们知道了这样的攻击模式。</p><p>如果一个新语言，支持类似JavaScript语言里这么灵活的函数数组变量，你可以试着找找这门编程语言实现里有没有类似的安全漏洞。</p><p>如果我们从根本上来看可变量，它的安全威胁就在于 <strong>在不同的时间、地点里，可变量可以发生变化。如果编写代码时，意识不到不同时空里的变化，就会面临安全威胁</strong>。</p><p>我们再来看一下可变量的例子。在Java语言里，java.util.Date是一个从JDK 1.0开始就支持的类。我们可以构建一个对象，来表示构建时的时间，然后再修改成其他时间。就像下面的这段伪代码这样。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void verify(Date targetDate) {</span></span>
<span class="line"><span>    // Verify that a contract is valid in the day of targetDate.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // &amp;lt;snipped&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Display that the contract is valid in the day of targetDate</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void checkContract() {</span></span>
<span class="line"><span>    Date today = new Date();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // create a new thread that modify the date to a new date.</span></span>
<span class="line"><span>    // For example, today.setYear(100) will reset the year to 2000.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // verify that the contract is valid today.</span></span>
<span class="line"><span>    veify(today);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码中，verify()方法和修改日期的线程间就存在竞争关系。如果日期修改在verify()实现的验证和显示之间发生，显示的日期就不是验证有效的日期。这就会给人错误的信息，从而导致错误的决策。这个问题就是TOCTOU（time-of-check time-of-use）竞态危害的一种常见形式。</p><h2 id="可变量局部化" tabindex="-1">可变量局部化 <a class="header-anchor" href="#可变量局部化" aria-label="Permalink to &quot;可变量局部化&quot;">​</a></h2><p>类似于TOCTOU的安全问题，让java.util.Date的使用充满了麻烦。</p><p><strong>那么该怎么防范这种漏洞呢？当然，最有效的方法就是使用不可变量。对于可变量的参数，也可以使用拷贝等办法把共享的变量局部化。由于可变量可以在不同时空发生变化，所以，无论是传入参数，还是返回值，都要拷贝可变量</strong>。这样共享的变量，就转换成了局部变量。</p><p>比如上面的例子，我们就可以改成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void verify(Date targetDate) {</span></span>
<span class="line"><span>    // Create a copy of the targetDate so as to avoid the</span></span>
<span class="line"><span>    // impact of any changes.</span></span>
<span class="line"><span>    Date inputDate = new Date(targetDate.getTime());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Verify that a contract is valid in the day of inputDate.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // &amp;lt;snipped&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Display that the contract is valid in the day of inputDate</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void checkContract() {</span></span>
<span class="line"><span>    Date today = new Date();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // create a new thread that modify the date to a new date.</span></span>
<span class="line"><span>    // For example, today.setYear(100) will reset the year to 2000.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // verify that the contract is valid today.</span></span>
<span class="line"><span>    // Use a clone of the today date so as to avoid the impact of</span></span>
<span class="line"><span>    // any changes in the verify() implementaiton.</span></span>
<span class="line"><span>    veify((Data)today.clone());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不知道你有没有注意到，在veirfy()的实现里，我们使用了Date的构造函数来做拷贝；而在checkContract()的实现里，我们使用了Date的clone()方法来做拷贝。为什么不都使用更简洁的clone()方法呢？</p><p>在checkContract()的实现里，today变量是Date类的一个实例。我们都了解，Date类的clone()方法的实现，的确做到了日期的拷贝。而对于作为参数传入verify()方法的targetDate对象，我们并不清楚它是不是一个可靠的Date的继承类。这个继承类的clone()实现，有没有做日期的拷贝，我们也不知晓，因此，targetDate对象的clone()方法，不一定安全可靠。所以，在verify()实现里，使用clone()拷贝传入的参数，也不可靠。</p><p>类的继承还有很多麻烦的地方，后面的章节，我们还会接着讨论继承的安全缺陷。</p><h2 id="支持实例拷贝" tabindex="-1">支持实例拷贝 <a class="header-anchor" href="#支持实例拷贝" aria-label="Permalink to &quot;支持实例拷贝&quot;">​</a></h2><p>在一定的场景下，安全的编码需要通过拷贝把可变变量局部化。这也就意味着， <strong>我们设计一个可变类的时候，需要考虑支持实例的拷贝。要不然，这个类的使用，可能就会遇到无法安全拷贝的麻烦。</strong></p><p>实例的拷贝，可以使用静态的实例化方法，或者拷贝构造函数，或者使用公开的拷贝方法。需要注意的是，如果公开的拷贝方法可以被继承，继承类的实现方式就不可预料了。那么，这个公开的拷贝方法的使用就是不可靠的。支持公开的拷贝方法，一般只适用于final公开类。</p><p>静态的实例化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static MutableClass getInstance(MutableClass mutableObject) {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>拷贝构造函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public MutableClass(MutableClass mutableObject) {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>公开拷贝方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class MutableClass {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Object clone() {</span></span>
<span class="line"><span>        // snipped</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>禁用拷贝方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MutableClass {</span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public final Object clone() throws CloneNotSupportedException {</span></span>
<span class="line"><span>        throw new CloneNotSupportedException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="浅拷贝与深拷贝" tabindex="-1">浅拷贝与深拷贝 <a class="header-anchor" href="#浅拷贝与深拷贝" aria-label="Permalink to &quot;浅拷贝与深拷贝&quot;">​</a></h2><p>实现拷贝，一般有两种方法。</p><p>一种是拷贝变量的指针或者引用，并不拷贝变量指向的内容。拷贝和原实例共享指针指向的内容，如果拷贝实例里的变量指向的内容发生了改变，原实例里的变量指向的内容也随着改变。这种拷贝方法通常称为浅拷贝（shallow copy）。</p><p>另外一种方式，是拷贝变量指向的内容。拷贝后的实例和原有的实例中，变量指向的内容虽然相同，但是相互独立的。一个实例里，变量指向的内容发生了改变，对另外一个实例没有影响。这种拷贝方法通常称为深拷贝（deep copy）。</p><p><strong>对于一个类里的不可变量，一般我们使用浅拷贝就可以了</strong>。这也是不可变量的又一个优点。</p><p>下面的这段代码，就混合使用了可变量、不可变量，以及浅拷贝和深拷贝技术，来实现实例拷贝的一个示例。</p><h2 id="拷贝" tabindex="-1">拷贝 <a class="header-anchor" href="#拷贝" aria-label="Permalink to &quot;拷贝&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final class MyContract implements Cloneable {</span></span>
<span class="line"><span>  private   String title;</span></span>
<span class="line"><span>  private   Date signedDate;</span></span>
<span class="line"><span>  private   Byte[] content;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // snipped</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Object clone() throws CloneNotSupportedException {</span></span>
<span class="line"><span>        MyContract cloned = (MyContract)super.clone();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // shallow copy, String is immutable</span></span>
<span class="line"><span>        cloned.title = this.title;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // deep copy, Date is mutable</span></span>
<span class="line"><span>        cloned.signedDate = new Date(this.signedDate.getTime());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // deep copy, array are mutable</span></span>
<span class="line"><span>        cloned.content = this.content.clone();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return cloned;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>浅拷贝和原实例共享指针指向的内容，拷贝实例和原实例都可以改变指向的内容（除非内容为不可变量），这样就影响了对方的行为。所以，可变量的浅拷贝并不能解除安全隐患。</strong></p><p>由于有两种拷贝方法，而且不同的拷贝方法适用的范围有一定的区别，我们就需要弄清楚一个类支持的是哪一种拷贝方法。特别是如果一个类使用的是浅拷贝，一定要在规范里标记清楚。要不然，就容易用错这个类的拷贝方法，从而导致安全风险。</p><p>如果一个类只提供了浅拷贝方法的实现，在使用可变量局部化解决安全隐患时，我们就会遇到很多麻烦。</p><h2 id="麻烦的集合" tabindex="-1">麻烦的集合 <a class="header-anchor" href="#麻烦的集合" aria-label="Permalink to &quot;麻烦的集合&quot;">​</a></h2><p>出于效率的考虑，java.util下的集合类，一般支持的是浅拷贝。比如ArrayList的clone()方法，执行的就是浅拷贝。如果使用深度拷贝，在很多场景下，集合的低下效率我们难以承受。对于类似于集合这样的类，可变量局部化就不是一个很好的解决方案。</p><p>对于集合来说，我们该怎么解决可变量的竞态危害这个问题呢？最主要的办法，就是不要把集合使用在可能产生竞态危害的场景中，我们后面再接着讨论这个问题。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>通过对这个案例的讨论，我想和你分享下面三点个人看法。</p><ol><li><p><strong>可变量的传递，存在竞态危害的安全风险</strong>；</p></li><li><p><strong>可变量局部化，是解决可变量竞态危害的一种常用办法</strong>；</p></li><li><p><strong>变量的拷贝，有浅拷贝和深拷贝两种形式；可变量的浅拷贝无法解决竞态危害的威胁</strong>。</p></li></ol><p>对于这个案例，你还有什么别的看法吗？</p><h2 id="一起来动手" tabindex="-1">一起来动手 <a class="header-anchor" href="#一起来动手" aria-label="Permalink to &quot;一起来动手&quot;">​</a></h2><p>数组是一个常见的难以处理的可变量。和集合一样，数组的拷贝也是有损效率的。什么时候，数组的传递需要拷贝？什么时候不需要拷贝？</p><p>不管是C语言，Java还是JavaScript，数组是一个我们编码经常使用的数据类型。你不妨检查一下你的代码，看看其中的数组使用是否存在我们上面讨论的安全问题。</p><p>欢迎你在留言区分享你的发现。</p><p>如果你觉得这篇文章有所帮助，欢迎点击“请朋友读”，把它分享给你的朋友或者同事。</p>`,62)])])}const g=n(l,[["render",t]]);export{u as __pageData,g as default};
