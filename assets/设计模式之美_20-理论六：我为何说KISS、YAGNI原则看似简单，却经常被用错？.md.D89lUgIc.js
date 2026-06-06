import{_ as s,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"20 | 理论六：我为何说KISS、YAGNI原则看似简单，却经常被用错？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何理解“KISS原则”？","slug":"如何理解-kiss原则","link":"#如何理解-kiss原则","children":[]},{"level":2,"title":"代码行数越少就越“简单”吗？","slug":"代码行数越少就越-简单-吗","link":"#代码行数越少就越-简单-吗","children":[]},{"level":2,"title":"代码逻辑复杂就违背KISS原则吗？","slug":"代码逻辑复杂就违背kiss原则吗","link":"#代码逻辑复杂就违背kiss原则吗","children":[]},{"level":2,"title":"如何写出满足KISS原则的代码？","slug":"如何写出满足kiss原则的代码","link":"#如何写出满足kiss原则的代码","children":[]},{"level":2,"title":"YAGNI跟KISS说的是一回事吗？","slug":"yagni跟kiss说的是一回事吗","link":"#yagni跟kiss说的是一回事吗","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/20-理论六：我为何说KISS、YAGNI原则看似简单，却经常被用错？.md","filePath":"设计模式之美/20-理论六：我为何说KISS、YAGNI原则看似简单，却经常被用错？.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/20-理论六：我为何说KISS、YAGNI原则看似简单，却经常被用错？.md"};function e(t,n,r,c,d,S){return a(),p("div",null,[...n[0]||(n[0]=[i(`<h1 id="_20-理论六-我为何说kiss、yagni原则看似简单-却经常被用错" tabindex="-1">20 | 理论六：我为何说KISS、YAGNI原则看似简单，却经常被用错？ <a class="header-anchor" href="#_20-理论六-我为何说kiss、yagni原则看似简单-却经常被用错" aria-label="Permalink to &quot;20 | 理论六：我为何说KISS、YAGNI原则看似简单，却经常被用错？&quot;">​</a></h1><p>上几节课中，我们学习了经典的SOLID原则。今天，我们讲两个设计原则：KISS原则和YAGNI原则。其中，KISS原则比较经典，耳熟能详，但YAGNI你可能没怎么听过，不过它理解起来也不难。</p><p>理解这两个原则时候，经常会有一个共同的问题，那就是，看一眼就感觉懂了，但深究的话，又有很多细节问题不是很清楚。比如，怎么理解KISS原则中“简单”两个字？什么样的代码才算“简单”？怎样的代码才算“复杂”？如何才能写出“简单”的代码？YAGNI原则跟KISS原则说的是一回事吗？</p><p>如果你还不能非常清晰地回答出上面这几个问题，那恭喜你，又得到了一次进步提高的机会。等你听完这节课，我相信你很自然就能回答上来了。话不多说，让我们带着这些问题，正式开始今天的学习吧！</p><h2 id="如何理解-kiss原则" tabindex="-1">如何理解“KISS原则”？ <a class="header-anchor" href="#如何理解-kiss原则" aria-label="Permalink to &quot;如何理解“KISS原则”？&quot;">​</a></h2><p>KISS原则的英文描述有好几个版本，比如下面这几个。</p><ul><li>Keep It Simple and Stupid.</li><li>Keep It Short and Simple.</li><li>Keep It Simple and Straightforward.</li></ul><p>不过，仔细看你就会发现，它们要表达的意思其实差不多，翻译成中文就是：尽量保持简单。</p><p>KISS原则算是一个万金油类型的设计原则，可以应用在很多场景中。它不仅经常用来指导软件开发，还经常用来指导更加广泛的系统设计、产品设计等，比如，冰箱、建筑、iPhone手机的设计等等。不过，咱们的专栏是讲代码设计的，所以，接下来，我还是重点讲解如何在编码开发中应用这条原则。</p><p>我们知道，代码的可读性和可维护性是衡量代码质量非常重要的两个标准。而KISS原则就是保持代码可读和可维护的重要手段。代码足够简单，也就意味着很容易读懂，bug比较难隐藏。即便出现bug，修复起来也比较简单。</p><p>不过，这条原则只是告诉我们，要保持代码“Simple and Stupid”，但并没有讲到，什么样的代码才是“Simple and Stupid”的，更没有给出特别明确的方法论，来指导如何开发出“Simple and Stupid”的代码。所以，看着非常简单，但不能落地，这就有点像我们常说的“心灵鸡汤”。哦，咱们这里应该叫“技术鸡汤”。</p><p>所以，接下来，为了能让这条原则切实地落地，能够指导实际的项目开发，我就针对刚刚的这些问题来进一步讲讲我的理解。</p><h2 id="代码行数越少就越-简单-吗" tabindex="-1">代码行数越少就越“简单”吗？ <a class="header-anchor" href="#代码行数越少就越-简单-吗" aria-label="Permalink to &quot;代码行数越少就越“简单”吗？&quot;">​</a></h2><p>我们先一起看一个例子。下面这三段代码可以实现同样一个功能：检查输入的字符串ipAddress是否是合法的IP地址。</p><p>一个合法的IP地址由四个数字组成，并且通过“.”来进行分割。每组数字的取值范围是0~255。第一组数字比较特殊，不允许为0。对比这三段代码，你觉得哪一段代码最符合KISS原则呢？如果让你来实现这个功能，你会选择用哪种实现方法呢？你可以先自己思考一下，然后再看我下面的讲解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 第一种实现方式: 使用正则表达式</span></span>
<span class="line"><span>public boolean isValidIpAddressV1(String ipAddress) {</span></span>
<span class="line"><span>  if (StringUtils.isBlank(ipAddress)) return false;</span></span>
<span class="line"><span>  String regex = &quot;^(1\\\\d{2}|2[0-4]\\\\d|25[0-5]|[1-9]\\\\d|[1-9])\\\\.&quot;</span></span>
<span class="line"><span>          + &quot;(1\\\\d{2}|2[0-4]\\\\d|25[0-5]|[1-9]\\\\d|\\\\d)\\\\.&quot;</span></span>
<span class="line"><span>          + &quot;(1\\\\d{2}|2[0-4]\\\\d|25[0-5]|[1-9]\\\\d|\\\\d)\\\\.&quot;</span></span>
<span class="line"><span>          + &quot;(1\\\\d{2}|2[0-4]\\\\d|25[0-5]|[1-9]\\\\d|\\\\d)$&quot;;</span></span>
<span class="line"><span>  return ipAddress.matches(regex);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 第二种实现方式: 使用现成的工具类</span></span>
<span class="line"><span>public boolean isValidIpAddressV2(String ipAddress) {</span></span>
<span class="line"><span>  if (StringUtils.isBlank(ipAddress)) return false;</span></span>
<span class="line"><span>  String[] ipUnits = StringUtils.split(ipAddress, &#39;.&#39;);</span></span>
<span class="line"><span>  if (ipUnits.length != 4) {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; 4; ++i) {</span></span>
<span class="line"><span>    int ipUnitIntValue;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      ipUnitIntValue = Integer.parseInt(ipUnits[i]);</span></span>
<span class="line"><span>    } catch (NumberFormatException e) {</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (ipUnitIntValue &amp;lt; 0 || ipUnitIntValue &amp;gt; 255) {</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (i == 0 &amp;&amp; ipUnitIntValue == 0) {</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return true;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 第三种实现方式: 不使用任何工具类</span></span>
<span class="line"><span>public boolean isValidIpAddressV3(String ipAddress) {</span></span>
<span class="line"><span>  char[] ipChars = ipAddress.toCharArray();</span></span>
<span class="line"><span>  int length = ipChars.length;</span></span>
<span class="line"><span>  int ipUnitIntValue = -1;</span></span>
<span class="line"><span>  boolean isFirstUnit = true;</span></span>
<span class="line"><span>  int unitsCount = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; length; ++i) {</span></span>
<span class="line"><span>    char c = ipChars[i];</span></span>
<span class="line"><span>    if (c == &#39;.&#39;) {</span></span>
<span class="line"><span>      if (ipUnitIntValue &amp;lt; 0 || ipUnitIntValue &amp;gt; 255) return false;</span></span>
<span class="line"><span>      if (isFirstUnit &amp;&amp; ipUnitIntValue == 0) return false;</span></span>
<span class="line"><span>      if (isFirstUnit) isFirstUnit = false;</span></span>
<span class="line"><span>      ipUnitIntValue = -1;</span></span>
<span class="line"><span>      unitsCount++;</span></span>
<span class="line"><span>      continue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (c &amp;lt; &#39;0&#39; || c &amp;gt; &#39;9&#39;) {</span></span>
<span class="line"><span>      return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (ipUnitIntValue == -1) ipUnitIntValue = 0;</span></span>
<span class="line"><span>    ipUnitIntValue = ipUnitIntValue * 10 + (c - &#39;0&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (ipUnitIntValue &amp;lt; 0 || ipUnitIntValue &amp;gt; 255) return false;</span></span>
<span class="line"><span>  if (unitsCount != 3) return false;</span></span>
<span class="line"><span>  return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第一种实现方式利用的是正则表达式，只用三行代码就把这个问题搞定了。它的代码行数最少，那是不是就最符合KISS原则呢？答案是否定的。虽然代码行数最少，看似最简单，实际上却很复杂。这正是因为它使用了正则表达式。</p><p>一方面，正则表达式本身是比较复杂的，写出完全没有bug的正则表达本身就比较有挑战；另一方面，并不是每个程序员都精通正则表达式。对于不怎么懂正则表达式的同事来说，看懂并且维护这段正则表达式是比较困难的。这种实现方式会导致代码的可读性和可维护性变差，所以，从KISS原则的设计初衷上来讲，这种实现方式并不符合KISS原则。</p><p>讲完了第一种实现方式，我们再来看下其他两种实现方式。</p><p>第二种实现方式使用了StringUtils类、Integer类提供的一些现成的工具函数，来处理IP地址字符串。第三种实现方式，不使用任何工具函数，而是通过逐一处理IP地址中的字符，来判断是否合法。从代码行数上来说，这两种方式差不多。但是，第三种要比第二种更加有难度，更容易写出bug。从可读性上来说，第二种实现方式的代码逻辑更清晰、更好理解。所以，在这两种实现方式中，第二种实现方式更加“简单”，更加符合KISS原则。</p><p>不过，你可能会说，第三种实现方式虽然实现起来稍微有点复杂，但性能要比第二种实现方式高一些啊。从性能的角度来说，选择第三种实现方式是不是更好些呢？</p><p>在回答这个问题之前，我先解释一下，为什么说第三种实现方式性能会更高一些。一般来说，工具类的功能都比较通用和全面，所以，在代码实现上，需要考虑和处理更多的细节，执行效率就会有所影响。而第三种实现方式，完全是自己操作底层字符，只针对IP地址这一种格式的数据输入来做处理，没有太多多余的函数调用和其他不必要的处理逻辑，所以，在执行效率上，这种类似定制化的处理代码方式肯定比通用的工具类要高些。</p><p>不过，尽管第三种实现方式性能更高些，但我还是更倾向于选择第二种实现方法。那是因为第三种实现方式实际上是一种过度优化。除非isValidIpAddress()函数是影响系统性能的瓶颈代码，否则，这样优化的投入产出比并不高，增加了代码实现的难度、牺牲了代码的可读性，性能上的提升却并不明显。</p><h2 id="代码逻辑复杂就违背kiss原则吗" tabindex="-1">代码逻辑复杂就违背KISS原则吗？ <a class="header-anchor" href="#代码逻辑复杂就违背kiss原则吗" aria-label="Permalink to &quot;代码逻辑复杂就违背KISS原则吗？&quot;">​</a></h2><p>刚刚我们提到，并不是代码行数越少就越“简单”，还要考虑逻辑复杂度、实现难度、代码的可读性等。那如果一段代码的逻辑复杂、实现难度大、可读性也不太好，是不是就一定违背KISS原则呢？在回答这个问题之前，我们先来看下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// KMP algorithm: a, b分别是主串和模式串；n, m分别是主串和模式串的长度。</span></span>
<span class="line"><span>public static int kmp(char[] a, int n, char[] b, int m) {</span></span>
<span class="line"><span>  int[] next = getNexts(b, m);</span></span>
<span class="line"><span>  int j = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; n; ++i) {</span></span>
<span class="line"><span>    while (j &amp;gt; 0 &amp;&amp; a[i] != b[j]) { // 一直找到a[i]和b[j]</span></span>
<span class="line"><span>      j = next[j - 1] + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (a[i] == b[j]) {</span></span>
<span class="line"><span>      ++j;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (j == m) { // 找到匹配模式串的了</span></span>
<span class="line"><span>      return i - m + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return -1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// b表示模式串，m表示模式串的长度</span></span>
<span class="line"><span>private static int[] getNexts(char[] b, int m) {</span></span>
<span class="line"><span>  int[] next = new int[m];</span></span>
<span class="line"><span>  next[0] = -1;</span></span>
<span class="line"><span>  int k = -1;</span></span>
<span class="line"><span>  for (int i = 1; i &amp;lt; m; ++i) {</span></span>
<span class="line"><span>    while (k != -1 &amp;&amp; b[k + 1] != b[i]) {</span></span>
<span class="line"><span>      k = next[k];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (b[k + 1] == b[i]) {</span></span>
<span class="line"><span>      ++k;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    next[i] = k;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return next;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码来自我的另一个专栏《数据结构与算法之美》中 <a href="https://time.geekbang.org/column/article/71845" target="_blank" rel="noreferrer">KMP字符串匹配算法</a> 的代码实现。这段代码完全符合我们刚提到的逻辑复杂、实现难度大、可读性差的特点，但它并不违反KISS原则。为什么这么说呢？</p><p>KMP算法以快速高效著称。当我们需要处理长文本字符串匹配问题（几百MB大小文本内容的匹配），或者字符串匹配是某个产品的核心功能（比如Vim、Word等文本编辑器），又或者字符串匹配算法是系统性能瓶颈的时候，我们就应该选择尽可能高效的KMP算法。而KMP算法本身具有逻辑复杂、实现难度大、可读性差的特点。本身就复杂的问题，用复杂的方法解决，并不违背KISS原则。</p><p>不过，平时的项目开发中涉及的字符串匹配问题，大部分都是针对比较小的文本。在这种情况下，直接调用编程语言提供的现成的字符串匹配函数就足够了。如果非得用KMP算法、BM算法来实现字符串匹配，那就真的违背KISS原则了。也就是说，同样的代码，在某个业务场景下满足KISS原则，换一个应用场景可能就不满足了。</p><h2 id="如何写出满足kiss原则的代码" tabindex="-1">如何写出满足KISS原则的代码？ <a class="header-anchor" href="#如何写出满足kiss原则的代码" aria-label="Permalink to &quot;如何写出满足KISS原则的代码？&quot;">​</a></h2><p>实际上，我们前面已经讲到了一些方法。这里我稍微总结一下。</p><ul><li>不要使用同事可能不懂的技术来实现代码。比如前面例子中的正则表达式，还有一些编程语言中过于高级的语法等。</li><li>不要重复造轮子，要善于使用已经有的工具类库。经验证明，自己去实现这些类库，出bug的概率会更高，维护的成本也比较高。</li><li>不要过度优化。不要过度使用一些奇技淫巧（比如，位运算代替算术运算、复杂的条件语句代替if-else、使用一些过于底层的函数等）来优化代码，牺牲代码的可读性。</li></ul><p>实际上，代码是否足够简单是一个挺主观的评判。同样的代码，有的人觉得简单，有的人觉得不够简单。而往往自己编写的代码，自己都会觉得够简单。所以，评判代码是否简单，还有一个很有效的间接方法，那就是code review。如果在code review的时候，同事对你的代码有很多疑问，那就说明你的代码有可能不够“简单”，需要优化啦。</p><p>这里我还想多说两句，我们在做开发的时候，一定不要过度设计，不要觉得简单的东西就没有技术含量。实际上，越是能用简单的方法解决复杂的问题，越能体现一个人的能力。</p><h2 id="yagni跟kiss说的是一回事吗" tabindex="-1">YAGNI跟KISS说的是一回事吗？ <a class="header-anchor" href="#yagni跟kiss说的是一回事吗" aria-label="Permalink to &quot;YAGNI跟KISS说的是一回事吗？&quot;">​</a></h2><p>YAGNI原则的英文全称是：You Ain’t Gonna Need It。直译就是：你不会需要它。这条原则也算是万金油了。当用在软件开发中的时候，它的意思是：不要去设计当前用不到的功能；不要去编写当前用不到的代码。实际上，这条原则的核心思想就是：不要做过度设计。</p><p>比如，我们的系统暂时只用Redis存储配置信息，以后可能会用到ZooKeeper。根据YAGNI原则，在未用到ZooKeeper之前，我们没必要提前编写这部分代码。当然，这并不是说我们就不需要考虑代码的扩展性。我们还是要预留好扩展点，等到需要的时候，再去实现ZooKeeper存储配置信息这部分代码。</p><p>再比如，我们不要在项目中提前引入不需要依赖的开发包。对于Java程序员来说，我们经常使用Maven或者Gradle来管理依赖的类库（library）。我发现，有些同事为了避免开发中library包缺失而频繁地修改Maven或者Gradle配置文件，提前往项目里引入大量常用的library包。实际上，这样的做法也是违背YAGNI原则的。</p><p>从刚刚的分析我们可以看出，YAGNI原则跟KISS原则并非一回事儿。KISS原则讲的是“如何做”的问题（尽量保持简单），而YAGNI原则说的是“要不要做”的问题（当前不需要的就不要做）。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们现在来总结回顾一下，你需要掌握的重点内容。</p><p>KISS原则是保持代码可读和可维护的重要手段。KISS原则中的“简单”并不是以代码行数来考量的。代码行数越少并不代表代码越简单，我们还要考虑逻辑复杂度、实现难度、代码的可读性等。而且，本身就复杂的问题，用复杂的方法解决，并不违背KISS原则。除此之外，同样的代码，在某个业务场景下满足KISS原则，换一个应用场景可能就不满足了。</p><p>对于如何写出满足KISS原则的代码，我还总结了下面几条指导原则：</p><ul><li>不要使用同事可能不懂的技术来实现代码；</li><li>不要重复造轮子，要善于使用已经有的工具类库；</li><li>不要过度优化。</li></ul><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>你怎么看待在开发中重复造轮子这件事情？什么时候要重复造轮子？什么时候应该使用现成的工具类库、开源框架？</p><p>欢迎在留言区写下你的答案，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,47)])])}const I=s(l,[["render",e]]);export{o as __pageData,I as default};
