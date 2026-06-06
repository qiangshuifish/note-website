import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"31 | 辅助界面元素的架构设计","description":"","frontmatter":{},"headers":[{"level":2,"title":"辅助界面元素的框架","slug":"辅助界面元素的框架","link":"#辅助界面元素的框架","children":[]},{"level":2,"title":"jQuery 颜色选择器","slug":"jquery-颜色选择器","link":"#jquery-颜色选择器","children":[]},{"level":2,"title":"辅助界面元素的架构设计","slug":"辅助界面元素的架构设计","link":"#辅助界面元素的架构设计","children":[]},{"level":2,"title":"结语","slug":"结语","link":"#结语","children":[]}],"relativePath":"许式伟的架构课/31-辅助界面元素的架构设计.md","filePath":"许式伟的架构课/31-辅助界面元素的架构设计.md","lastUpdated":1779821983000}'),t={name:"许式伟的架构课/31-辅助界面元素的架构设计.md"};function l(i,a,o,r,c,u){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_31-辅助界面元素的架构设计" tabindex="-1">31 | 辅助界面元素的架构设计 <a class="header-anchor" href="#_31-辅助界面元素的架构设计" aria-label="Permalink to &quot;31 | 辅助界面元素的架构设计&quot;">​</a></h1><p>你好，我是七牛云许式伟。</p><p>我们第二章 “桌面软件开发” 今天开始进入尾声。前面我们主要围绕一个完整的桌面应用程序，从单机到 B/S 结构，我们的系统架构应该如何考虑。并且，我们通过五讲的 “画图” 程序实战，来验证我们的架构设计思路。</p><p>这个实战有点复杂。对于编码量不多的初学者，理解起来还是有点复杂性的。为了减轻理解的难度，我们从原计划的上下两讲，扩大到了五讲。尽管如此，理解上的难度仍然还是有的，后面我们做总结时，会给出一个不基于 MVC 架构的实现代码。</p><p>今天我们不谈桌面应用的架构，而是来谈谈辅助界面元素的架构设计。</p><p>辅助界面元素非常常见，它其实就是通用控件，或者我们自定义的控件。例如在我们画图程序中使用了线型选择控件（ <a href="https://github.com/qiniu/qpaint/blob/v30/paintweb/www/accel/menu.js#L105" target="_blank" rel="noreferrer">menu.js#L105</a>），如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;select id=&quot;lineWidth&quot; onchange=&quot;onIntPropChanged(&#39;lineWidth&#39;)&quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;1&quot;&amp;gt;1&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;3&quot;&amp;gt;3&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;5&quot;&amp;gt;5&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;7&quot;&amp;gt;7&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;9&quot;&amp;gt;9&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;11&quot;&amp;gt;11&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/select&amp;gt;</span></span></code></pre></div><p>还有颜色选择控件（ <a href="https://github.com/qiniu/qpaint/blob/v30/paintweb/www/accel/menu.js#L115" target="_blank" rel="noreferrer">menu.js#L115</a>），如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;select id=&quot;lineColor&quot; onchange=&quot;onPropChanged(&#39;lineColor&#39;)&quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;black&quot;&amp;gt;black&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;red&quot;&amp;gt;red&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;blue&quot;&amp;gt;blue&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;green&quot;&amp;gt;green&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;yellow&quot;&amp;gt;yellow&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;gray&quot;&amp;gt;gray&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/select&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;select id=&quot;fillColor&quot; onchange=&quot;onPropChanged(&#39;fillColor&#39;)&quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;white&quot;&amp;gt;white&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;null&quot;&amp;gt;transparent&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;black&quot;&amp;gt;black&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;red&quot;&amp;gt;red&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;blue&quot;&amp;gt;blue&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;green&quot;&amp;gt;green&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;yellow&quot;&amp;gt;yellow&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;option value=&quot;gray&quot;&amp;gt;gray&amp;lt;/option&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/select&amp;gt;</span></span></code></pre></div><p>我们统一用通用的 select 控件实现了一个线型选择器、两个颜色选择器的实例。虽然这种方式实现的颜色选择器不够美观，但是它们的确可以正常工作。</p><p>不过，产品经理很快就提出反对意见，说我们需要更加用户友好的界面。赶紧换一个更加可视化的颜色选择器吧？比如像下图这样的：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/65ca44b08788bd03776bcd86ea3d0749.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/65ca44b08788bd03776bcd86ea3d0749.png" alt=""></a></p><h2 id="辅助界面元素的框架" tabindex="-1">辅助界面元素的框架 <a class="header-anchor" href="#辅助界面元素的框架" aria-label="Permalink to &quot;辅助界面元素的框架&quot;">​</a></h2><p>怎么做到？</p><p>我们不妨把上面基础版本的线型选择器、颜色选择器叫做 BaseLineWidthPicker、BaseColorPicker，我们总结它们在画图程序中的使用接口如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/4c660159e3d632130c25614f0b0eb02c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/4c660159e3d632130c25614f0b0eb02c.png" alt=""></a></p><p>我们解释一下这个表格中的各项内容。</p><p>id 是控件的 id，通过它可以获取到辅助界面元素的顶层结点。</p><p>value 是界面元素的值，其实也就是辅助界面元素的 Model 层的数据。从 MVC 架构角度来说，Model 层的数据一般是一棵 DOM 树。但是对很多辅助界面元素来说，它的 DOM 树比较简单，只是一个数值。比如线型选择器是一个 number，颜色选择器是一个 Color 值。</p><p>palette 是颜色选择器的调色板，用来指示颜色选择器可以选择哪些颜色。</p><p>blur() 方法是主动让一个界面元素失去焦点。</p><p>onchange 事件是在该界面元素的值（value）通过用户界面交互进行改变时发送的事件。需要注意的是，这个事件只在用户交互时发送。直接调用 element.value = xxx 这样的方式来修改界面元素的值是不会触发 onchange 事件的。</p><p>为了便于修改辅助界面元素，我们计划引入统一的辅助界面元素的框架。</p><p>这个框架长什么样？</p><p>首先，每个界面元素使用的时候，统一以 <code>&amp;lt;div type=&quot;xxx&quot;&gt;</code> 来表示。比如上面的一个线型选择器、两个颜色选择器的实例可以这样来表示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;div type=&quot;BaseLineWidthPicker&quot; id=&quot;lineWidth&quot; onchange=&quot;onIntPropChanged(&#39;lineWidth&#39;)&quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;div type=&quot;BaseColorPicker&quot; id=&quot;lineColor&quot; onchange=&quot;onPropChanged(&#39;lineColor&#39;)&quot; palette=&quot;black,red,blue,green,yellow,gray&quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;div type=&quot;BaseColorPicker&quot; id=&quot;fillColor&quot; onchange=&quot;onPropChanged(&#39;fillColor&#39;)&quot; palette=&quot;white,null(transparent),black,red,blue,green,yellow,gray&quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span></code></pre></div><p>那么它是怎么被替换成前面的界面元素的？</p><p>我们引入一个全局的 qcontrols: QControls 实例，所有我们定义的控件都向它注册（register）自己。注册的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class QControls {</span></span>
<span class="line"><span>  constructor() {</span></span>
<span class="line"><span>    this.data = {}</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  register(type, control) {</span></span>
<span class="line"><span>    this.data[type] = control</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看出，注册的逻辑基本上没做什么，只是建立了类型（type）和控件的构建函数（control）的关联。有了这个关联表，我们就可以在适当的时候，把所有的 <code>&amp;lt;div type=&quot;xxx&quot;&gt;</code> 的div 替换为实际的控件。替换过程如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class QControls {</span></span>
<span class="line"><span>  init() {</span></span>
<span class="line"><span>    let divs = document.getElementsByTagName(&quot;div&quot;)</span></span>
<span class="line"><span>    let n = divs.length</span></span>
<span class="line"><span>    for (let i = n-1; i &amp;gt;= 0; i--) {</span></span>
<span class="line"><span>      let div = divs[i]</span></span>
<span class="line"><span>      let type = div.getAttribute(&quot;type&quot;)</span></span>
<span class="line"><span>      if (type != null) {</span></span>
<span class="line"><span>        let control = this.data[type]</span></span>
<span class="line"><span>        if (control) {</span></span>
<span class="line"><span>          control(div)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码逻辑很简单，遍历文档中所有的 div，如果带 type 属性，就去查这个 type 有没有注册过，注册过就用注册时指定的构建函数去构建控件实例。</p><p>完整的辅助界面元素框架代码如下：</p><ul><li><a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/base.js" target="_blank" rel="noreferrer">controls/base.js</a></li></ul><p>具体构建控件的代码是怎么样的？源代码请参考这两个文件：</p><ul><li><a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/BaseLineWidthPicker.js" target="_blank" rel="noreferrer">controls/BaseLineWidthPicker.js</a></li><li><a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/BaseColorPicker.js" target="_blank" rel="noreferrer">controls/BaseColorPicker.js</a></li></ul><p>我们拿 BaseColorPicker 作为例子看下吧：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function BaseColorPicker(div) {</span></span>
<span class="line"><span>  let id = div.id</span></span>
<span class="line"><span>  let onchange = div.onchange</span></span>
<span class="line"><span>  let palette = div.getAttribute(&quot;palette&quot;)</span></span>
<span class="line"><span>  let colors = palette.split(&quot;,&quot;)</span></span>
<span class="line"><span>  let options = []</span></span>
<span class="line"><span>  for (let i in colors) {</span></span>
<span class="line"><span>    let color = colors[i]</span></span>
<span class="line"><span>    let n = color.length</span></span>
<span class="line"><span>    if (color.charAt(n-1) == &quot;)&quot;) {</span></span>
<span class="line"><span>      let offset = color.indexOf(&quot;(&quot;)</span></span>
<span class="line"><span>      options.push(\`&amp;lt;option value=&quot;\` + color.substring(0, offset) + \`&quot;&amp;gt;\` + color.substring(offset+1, n-1) + \`&amp;lt;/option&amp;gt;\`)</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      options.push(\`&amp;lt;option value=&quot;\` + color + \`&quot;&amp;gt;\` + color + \`&amp;lt;/option&amp;gt;\`)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  div.outerHTML = \`&amp;lt;select id=&quot;\` + id + \`&quot;&amp;gt;\` + options.join(&quot;&quot;) + \`&amp;lt;/select&amp;gt;\`</span></span>
<span class="line"><span>  let elem = document.getElementById(id)</span></span>
<span class="line"><span>  if (onchange) {</span></span>
<span class="line"><span>    elem.onchange = onchange</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>qcontrols.register(&quot;BaseColorPicker&quot;, BaseColorPicker)</span></span></code></pre></div><p>可以看到，构建函数的代码大体分为如下三步。</p><p>第一步，从占位的 div 元素中读入所有的输入参数。这里是 id, onchange, palette。</p><p>第二步，把占位的 div 元素替换为实际的界面。也就是 div.outerHTML = <code>xxx</code> 这段代码。</p><p>第三步，如果用户对 onchange 事件感兴趣，把 onchange 响应函数安装到实际界面的 onchange 事件中。</p><h2 id="jquery-颜色选择器" tabindex="-1">jQuery 颜色选择器 <a class="header-anchor" href="#jquery-颜色选择器" aria-label="Permalink to &quot;jQuery 颜色选择器&quot;">​</a></h2><p>接下来我们就开始考虑替换颜色选择器的实现了。新版本的颜色选择器，我们不妨命名为 ColorPicker。这个新版本的使用姿势必须和 BaseColorPicker 一样，也就是：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/fc3856e8ab9aaf35c7af1611e57a47f8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/fc3856e8ab9aaf35c7af1611e57a47f8.png" alt=""></a></p><p>从使用的角度来说，我们只需要把之前的 BaseColorPicker 换成 ColorPicker。如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;div type=&quot;BaseLineWidthPicker&quot; id=&quot;lineWidth&quot; onchange=&quot;onIntPropChanged(&#39;lineWidth&#39;)&quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;div type=&quot;ColorPicker&quot; id=&quot;lineColor&quot; onchange=&quot;onPropChanged(&#39;lineColor&#39;)&quot; palette=&quot;black,red,blue,green,yellow,gray&quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;div type=&quot;ColorPicker&quot; id=&quot;fillColor&quot; onchange=&quot;onPropChanged(&#39;fillColor&#39;)&quot; palette=&quot;white,null(transparent),black,red,blue,green,yellow,gray&quot;&amp;gt;&amp;lt;/div&amp;gt;</span></span></code></pre></div><p>那么实现方面呢？</p><p>我们决定基于 jQuery 社区的 <a href="https://github.com/bgrins/spectrum" target="_blank" rel="noreferrer">spectrum</a> 颜色选择器。</p><p>我们的画图程序的主体并没有引用任何现成的框架代码。jQuery 是第一个被引入的。</p><p>对待 jQuery，我们可以有两种态度。一种是认为 jQuery 设计非常优良，我们很喜欢，决定将其作为团队的编程用的基础框架。</p><p>在这种态度下，我们允许 jQuery 风格的代码蔓延得到处都是，典型表现就是满屏皆是 $ 符号。</p><p>当然这种选择的风险是不低的。有一天我们不想再基于 jQuery 开发了，这意味着大量的模块需要进行调整，尤其是那些活跃的项目。</p><p>另一种态度是，认为 jQuery 并不是我们的主体框架，只是因为我们有些模块用了社区的成果，比如 <a href="https://github.com/bgrins/spectrum" target="_blank" rel="noreferrer">spectrum</a> 颜色选择器，它是基于 jQuery 实现的。这意味着我们要用 <a href="https://github.com/bgrins/spectrum" target="_blank" rel="noreferrer">spectrum</a>，就需要引入 jQuery。</p><p>这种团队下，我们会尽可能限制 jQuery 的使用范围，尽量不要让它的代码蔓延，而只是限制在颜色选择器等少量场景中。</p><p>我们这一讲假设我们的态度是后者。我们有自己的基础开发框架（虽然我们其实基本上接近裸写 JavaScript 的状态），所以不会大面积使用 jQuery。</p><p>这样我们需要包装 jQuery 组件。代码如下（参阅 <a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/ColorPicker.js" target="_blank" rel="noreferrer">controls/ColorPicker.js</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function ColorPicker(div) {</span></span>
<span class="line"><span>  let id = div.id</span></span>
<span class="line"><span>  let onchange = div.onchange</span></span>
<span class="line"><span>  let palette = div.getAttribute(&quot;palette&quot;)</span></span>
<span class="line"><span>  let colors = palette.split(&quot;,&quot;)</span></span>
<span class="line"><span>  let value = colors[0]</span></span>
<span class="line"><span>  div.outerHTML = \`&amp;lt;input type=&quot;button&quot; id=&quot;\` + id + \`&quot; value=&quot;\` + value + \`&quot;&amp;gt;\`</span></span>
<span class="line"><span>  let elem = $(&quot;#&quot; + id)</span></span>
<span class="line"><span>  elem.spectrum({</span></span>
<span class="line"><span>    showInitial: true,</span></span>
<span class="line"><span>    showInput: true,</span></span>
<span class="line"><span>    showButtons: true,</span></span>
<span class="line"><span>    preferredFormat: &quot;hex6&quot;</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>  if (onchange) {</span></span>
<span class="line"><span>    elem.change(onchange)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  Object.defineProperty(document.getElementById(id), &quot;value&quot;, {</span></span>
<span class="line"><span>    get() {</span></span>
<span class="line"><span>      return value</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    set(x) {</span></span>
<span class="line"><span>      if (this.busy) {</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      value = x</span></span>
<span class="line"><span>      this.busy = true</span></span>
<span class="line"><span>      elem.spectrum(&quot;set&quot;, value)</span></span>
<span class="line"><span>      this.busy = false</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>qcontrols.register(&quot;ColorPicker&quot;, ColorPicker)</span></span></code></pre></div><p>这里大部分代码比较常规，只有 Object.defineProperty 这一段看起来比较古怪一些。这段代码是在改写 document.getElementById(id) 这个界面元素的 value 属性的读写（get/set）函数。</p><p>为什么需要改写？</p><p>因为我们希望感知到使用者对 value 的改写。正常我们可能认为接管 onchange 就可以了，但是实际上 element.value = xxx 这样的属性改写是不会触发 onchange 事件的。所以我们只能从改写 value 属性的 set 函数来做。</p><p>set 函数收到 value 被改写后，会调用 elem.spectrum(&quot;set&quot;, value) 来改变 spectrum 颜色控件的当前值。</p><p>但这里又有个细节问题：elem.spectrum(&quot;set&quot;, value) 内部又会调用 element.value = value 来修改 document.getElementById(id) 这个界面元素的 value 属性，这样就出现了死循环。怎么办？我们通过引入一个 busy 标志来解决：如果当前已经处于 value 属性的 set 函数，就直接返回。</p><h2 id="辅助界面元素的架构设计" tabindex="-1">辅助界面元素的架构设计 <a class="header-anchor" href="#辅助界面元素的架构设计" aria-label="Permalink to &quot;辅助界面元素的架构设计&quot;">​</a></h2><p>到目前为止，我们实现了三个符合我们定义的控件规范的辅助界面元素。如下：</p><ul><li><a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/BaseLineWidthPicker.js" target="_blank" rel="noreferrer">controls/BaseLineWidthPicker.js</a></li><li><a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/BaseColorPicker.js" target="_blank" rel="noreferrer">controls/BaseColorPicker.js</a></li><li><a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/controls/ColorPicker.js" target="_blank" rel="noreferrer">controls/ColorPicker.js</a></li></ul><p>观察这些辅助界面元素的代码，你会发现它们都没有基于 MVC 架构。</p><p>是因为辅助界面元素不适合用 MVC 架构来编写么？</p><p>当然不是。</p><p>更本质的原因是因为它们规模太小了。这些界面元素的特点是 DOM 都是一个 value，并不是一棵树，这样 Model 层就没什么代码了。同样的逻辑，View 层、Control 层代码量都过于短小，就没必要有那么清楚的模块划分。View 负责界面呈现，Control 负责事件响应，只是在心里有谱就好了。</p><p>但并不是所有辅助界面元素都这么简单。</p><p>举一个简单的例子。让我们给自己设定一个新目标：把我们前面实战的 “画图” 程序，改造成一个标准的辅助界面元素，这可行么？</p><p>答案当然是肯定的。</p><p>但是这意味着我们有一些假设需要修正。这些假设通常都和唯一性有关。</p><p>比如，全局有唯一的 View 对象实例 qview: QPaintView。如果我们是辅助界面元素，意味着我们可能在同一个界面出现多个实例。在多实例的情况下，View 对象显然就应该有多个。</p><p>再比如，我们画图程序的辅助界面元素（参见 <a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/accel/menu.js" target="_blank" rel="noreferrer">accel/menu.js</a>）都是单例，具体表现为这些界面元素的 id 都是固定的。</p><p>当然，辅助界面元素的改造方案有多种可能性。一种方案是将辅助界面元素也改造为多例，使得每个 QPaint 实例都有自己的辅助界面元素。</p><p>另一种方案是继续保持单例，这意味着多个 QPaint 实例会有一个当前实例的概念。辅助界面元素根据场景，可以是操作全部实例，也可以是操作当前实例。</p><p>我们选择继续保持单例。这意味着 qview: QPaintView 这个全局变量可以继续存在，但是和之前的含义有了很大不同。之前 qview 代表的是单例，现在 qview 代表的是当前实例。</p><p>有了当前实例当然就有切换。这样就需要增加焦点相关的事件响应。</p><p>在画图程序中，很多 Controller 都是 View 实例相关的。比如：PathCreator、ShapeSelector 等。在 View 存在多例的情况下，这些 Controller 之前的 registerController 动作就需要重新考虑。</p><p>为了支持多例，我们引入了 onViewAdded、onCurrentViewChanged 事件。当一个新的 View 实例被创建时，会发送 onViewAdded 事件。Controller 可以响应该事件去完成 registerController 动作。如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>onViewAdded(function(view) {</span></span>
<span class="line"><span>  view.registerController(&quot;PathCreator&quot;, function() {</span></span>
<span class="line"><span>    return new QPathCreator(view, false)</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>原先，当前图形样式是放在 View 中的，通过 qview.style 可以访问到。这会导致多个 View 实例的当前图形样式不一样，但是我们辅助界面元素又是单例的，这就非常让人混淆。最后我们决定把 qview.style 挪到全局，改名叫 defaultStyle（参阅 <a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/accel/menu.js#L42" target="_blank" rel="noreferrer">accel/menu.js#L42</a>）。</p><p>做完这些改造，我们的画图程序就有了成为一个标准控件的基础。具体代码如下（参阅 <a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/PaintView.js" target="_blank" rel="noreferrer">PaintView.js</a>）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function newPaintView(drawingID) {</span></span>
<span class="line"><span>  let view = new QPaintView(drawingID)</span></span>
<span class="line"><span>  fireViewAdded(view)</span></span>
<span class="line"><span>  return view</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function initPaintView(drawingID) {</span></span>
<span class="line"><span>  let view = newPaintView(drawingID)</span></span>
<span class="line"><span>  setCurrentView(view)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function PaintView(div) {</span></span>
<span class="line"><span>  let id = div.id</span></span>
<span class="line"><span>  let width = div.getAttribute(&quot;width&quot;)</span></span>
<span class="line"><span>  let height = div.getAttribute(&quot;height&quot;)</span></span>
<span class="line"><span>  div.outerHTML = \`&amp;lt;canvas id=&quot;\` + id + \`&quot; width=&quot;\` + width + \`&quot; height=&quot;\` + height + \`&quot;&amp;gt;你的浏览器不支持Canvas！&amp;lt;/canvas&amp;gt;\`</span></span>
<span class="line"><span>  initPaintView(id)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>qcontrols.register(&quot;PaintView&quot;, PaintView)</span></span></code></pre></div><p>有了这个 PaintView 控件，我们就可以到处引用它了。我们做了一个 PaintView 控件的 DEMO 程序，它效果看起来是这样的（代码参阅 <a href="https://github.com/qiniu/qpaint/blob/v31/paintweb/www/PaintDemo.htm" target="_blank" rel="noreferrer">PaintDemo.htm</a>）：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/295e17f40fa63b929a4a5175da39ae52.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%B8%E5%BC%8F%E4%BC%9F%E7%9A%84%E6%9E%B6%E6%9E%84%E8%AF%BE/images/113569/295e17f40fa63b929a4a5175da39ae52.png" alt=""></a></p><p>从这个截图看，细心的你可能会留意到，还有一个问题是没有被修改的，那就是 URL 地址。我们的 QPaintView 在 load 文档后会修改 URL，这作为应用程序并没有问题。但是如果是一个控件，整个界面有好多个 PaintView，URL 中应该显示哪个文档的 ID？</p><p>显然谁都不合适。如果非要显示，可能要在 PaintView 实例附近放一个辅助界面元素来显示它。</p><p>怎么修改？</p><p>这个问题暂且留给大家。</p><h2 id="结语" tabindex="-1">结语 <a class="header-anchor" href="#结语" aria-label="Permalink to &quot;结语&quot;">​</a></h2><p>今天探讨了辅助界面元素，或者叫控件的架构设计。从大的实现逻辑来说，它和应用程序不应该有本质的不同。但控件总是要考虑支持多实例，这会带来一些细节上的差异。</p><p>支持多实例听起来是一项简单的工作，但是从我的观察看，对很多工程师来说实际上并不简单。不少初级工程师写代码往往容易全局变量满天飞，模块之间相互传递信息不假思索地基于全局变量来完成。这些不良习惯会导致代码极难控件化。</p><p>当然我们不见得什么桌面应用程序都要考虑把它控件化。但是我们花一些精力去思考控件化的话，会有助于你对架构设计中的一些决策提供帮助。</p><p>当然更重要的，其实是让你有机会形成更好的架构设计规范。</p><p>这一讲我们作出的修改如下：</p><ul><li><a href="https://github.com/qiniu/qpaint/compare/v30...v31" target="_blank" rel="noreferrer">https://github.com/qiniu/qpaint/compare/v30...v31</a></li></ul><p>这是最新版本的源代码：</p><ul><li><a href="https://github.com/qiniu/qpaint/tree/v31" target="_blank" rel="noreferrer">https://github.com/qiniu/qpaint/tree/v31</a></li></ul><p>如果你对今天的内容有什么思考与解读，欢迎给我留言，我们一起讨论。下一讲我们会谈谈架构设计的第二步：如何做好系统架构。</p><p>如果你觉得有所收获，也欢迎把文章分享给你的朋友。感谢你的收听，我们下期再见。</p>`,103)])])}const h=n(t,[["render",l]]);export{d as __pageData,h as default};
