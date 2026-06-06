import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"国庆策划 | 快来看看怎么用原生JavaScript实现手势解锁组件","description":"","frontmatter":{},"headers":[{"level":2,"title":"理解需求","slug":"理解需求","link":"#理解需求","children":[]},{"level":2,"title":"技术选型","slug":"技术选型","link":"#技术选型","children":[]},{"level":2,"title":"结构设计","slug":"结构设计","link":"#结构设计","children":[]},{"level":2,"title":"API 设计","slug":"api-设计","link":"#api-设计","children":[]},{"level":2,"title":"流程设计","slug":"流程设计","link":"#流程设计","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"relativePath":"跟月影学可视化/国庆策划-快来看看怎么用原生JavaScript实现手势解锁组件.md","filePath":"跟月影学可视化/国庆策划-快来看看怎么用原生JavaScript实现手势解锁组件.md","lastUpdated":1779822292000}'),l={name:"跟月影学可视化/国庆策划-快来看看怎么用原生JavaScript实现手势解锁组件.md"};function i(c,s,t,r,o,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="国庆策划-快来看看怎么用原生javascript实现手势解锁组件" tabindex="-1">国庆策划 | 快来看看怎么用原生JavaScript实现手势解锁组件 <a class="header-anchor" href="#国庆策划-快来看看怎么用原生javascript实现手势解锁组件" aria-label="Permalink to &quot;国庆策划 | 快来看看怎么用原生JavaScript实现手势解锁组件&quot;">​</a></h1><p>你好，我是月影。前几天，我给你出了一道实操题，不知道你完成得怎么样啦？</p><p>今天，我就给你一个 <a href="https://github.com/akira-cn/handlock" target="_blank" rel="noreferrer">参考版本</a>。当然，并不是说这一版就最好，而是说，借助这一版的实现，我们就能知道当遇到这样比较复杂的 UI 需求时，我们应该怎样思考和实现。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/b1a40490690d3c0418842d86fc81b2b2.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/b1a40490690d3c0418842d86fc81b2b2.jpeg" alt=""></a></p><p>首先，组件设计一般来说包括7个步骤，分别是理解需求、技术选型、结构（UI）设计、数据和API设计、流程设计、兼容性和细节优化，以及工具和工程化。</p><p>当然了，并不是每个组件设计的时候都需要进行这些过程，但一个项目总会在其中一些过程里遇到问题需要解决。所以，下面我们来做一个简单的分析。</p><h2 id="理解需求" tabindex="-1">理解需求 <a class="header-anchor" href="#理解需求" aria-label="Permalink to &quot;理解需求&quot;">​</a></h2><p>上节课的题目本身只是说设计一个常见的手势密码的 UI 交互，那我们就可以通过选择验证密码和设置密码来切换两种状态，每种状态有自己的流程。</p><p>如果你就照着需求把整个组件的状态切换和流程封装起来，或者只是提供了一定的 UI 样式配置能力的话，还远远不够。实际上这个组件如果要给用户使用，我们需要将过程节点开放出来。也就是说， <strong>需要由使用者决定设置密码的过程里执行什么操作、验证密码的过程和密码验证成功后执行什么操作</strong>，这些是组件开发者无法代替使用者来决定的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var password = &#39;11121323&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var locker = new HandLock.Locker({</span></span>
<span class="line"><span>  container: document.querySelector(&#39;#handlock&#39;),</span></span>
<span class="line"><span>  check: {</span></span>
<span class="line"><span>    checked: function(res){</span></span>
<span class="line"><span>      if(res.err){</span></span>
<span class="line"><span>        console.error(res.err); //密码错误或长度太短</span></span>
<span class="line"><span>        [执行操作...]</span></span>
<span class="line"><span>      }else{</span></span>
<span class="line"><span>        console.log(\`正确，密码是：\${res.records}\`);</span></span>
<span class="line"><span>        [执行操作...]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  update:{</span></span>
<span class="line"><span>    beforeRepeat: function(res){</span></span>
<span class="line"><span>      if(res.err){</span></span>
<span class="line"><span>        console.error(res.err); //密码长度太短</span></span>
<span class="line"><span>        [执行操作...]</span></span>
<span class="line"><span>      }else{</span></span>
<span class="line"><span>        console.log(\`密码初次输入完成，等待重复输入\`);</span></span>
<span class="line"><span>        [执行操作...]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    afterRepeat: function(res){</span></span>
<span class="line"><span>      if(res.err){</span></span>
<span class="line"><span>        console.error(res.err); //密码长度太短或者两次密码输入不一致</span></span>
<span class="line"><span>        [执行操作...]</span></span>
<span class="line"><span>      }else{</span></span>
<span class="line"><span>        console.log(\`密码更新完成，新密码是：\${res.records}\`);</span></span>
<span class="line"><span>        [执行操作...]</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>locker.check(password)</span></span></code></pre></div><h2 id="技术选型" tabindex="-1">技术选型 <a class="header-anchor" href="#技术选型" aria-label="Permalink to &quot;技术选型&quot;">​</a></h2><p>这个问题的 UI 展现的核心是九宫格和选中的小圆点，从技术上来讲，我们有三种可选方案： DOM/Canvas/SVG，三者都是可以实现主体 UI 的。那我们该怎么选择呢？</p><p>如果使用 DOM，最简单的方式是使用 flex 布局，这样能够做成响应式的。使用 DOM 的优点是容易实现响应式，事件处理简单，布局也不复杂（但是和 Canvas 比起来略微复杂），但是斜线（demo 里没有画）的长度和斜率需要计算。</p><p>除了使用 DOM 外，使用 Canvas 绘制也很方便。用 Canvas 实现有两个小细节，一是要实现响应式，我们可以用 DOM 构造一个正方形的容器。这里，我们使用 <code>padding-top:100%</code> 撑开容器高度使它等于容器宽度。 代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#container {</span></span>
<span class="line"><span>  position: relative;</span></span>
<span class="line"><span>  overflow: hidden;</span></span>
<span class="line"><span>  width: 100%;</span></span>
<span class="line"><span>  padding-top: 100%;</span></span>
<span class="line"><span>  height: 0px;</span></span>
<span class="line"><span>  background-color: white;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二个细节是为了在 retina 屏上获得清晰的显示效果，我们将 Canvas 的宽高增加一倍，然后通过 <code>transform: scale(0.5)</code> 来缩小到匹配容器宽高。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#container canvas{</span></span>
<span class="line"><span>  position: absolute;</span></span>
<span class="line"><span>  left: 50%;</span></span>
<span class="line"><span>  top: 50%;</span></span>
<span class="line"><span>  transform: translate(-50%, -50%) scale(0.5);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于 Canvas 的定位是 absolute，它本身的默认宽高并不等于容器的宽高，需要通过 JavaScript 设置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>let width = 2 * container.getBoundingClientRect().width;</span></span>
<span class="line"><span>canvas.width = canvas.height = width;</span></span></code></pre></div><p>使用上面的代码，我们就可以通过在 Canvas 上绘制实心圆和连线来实现 UI 了。具体的方法，我下面会详细来讲。</p><p>最后，我们来看一下使用 SVG 的绘制方法。不过，由于 SVG 原生操作的 API 不是很方便，我们可以使用了 <a href="http://snapsvg.io/" target="_blank" rel="noreferrer">Snap.svg 库</a>，实现起来和使用 Canvas 大同小异，我就不详细来说了。但是，SVG 的问题是移动端兼容性不如 DOM 和 Canvas 好，所以综合上面三者的情况，我最终选择使用 Canvas 来实现。</p><h2 id="结构设计" tabindex="-1">结构设计 <a class="header-anchor" href="#结构设计" aria-label="Permalink to &quot;结构设计&quot;">​</a></h2><p>使用 Canvas 实现的话， DOM 结构就比较简单了。为了实现响应式，我们需要实现一个自适应宽度的正方形容器，方法前面已经讲过了，然后我们在容器中创建 Canvas。</p><p>这里需要注意的一点是，我们应当把 Canvas 分层。这是因为 Canvas 的渲染机制里，要更新画布的内容，需要刷新要更新的区域重新绘制。因此我们有必要把频繁变化的内容和基本不变的内容分层管理，这样能显著提升性能。</p><p>在这里我把 UI 分别绘制在 3 个图层里，对应 3 个 Canvas。最上层只有随着手指头移动的那个线段，中间是九个点，最下层是已经绘制好的线。之所以这样分，是因为随手指头移动的那条线需要不断刷新，底下两层都不用频繁更新，但是把连好的线放在最底层是因为我要做出圆点把线的一部分遮挡住的效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/cf14330f6f0149252afb57ccb991a293.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/cf14330f6f0149252afb57ccb991a293.jpeg" alt=""></a></p><p>接着，我们确定圆点的位置。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/f731ffa24422655e218b7f362385f6bd.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/f731ffa24422655e218b7f362385f6bd.jpeg" alt=""></a></p><p>圆点的位置有两种定位法，第一种是九个九宫格，圆点在小九宫格的中心位置。认真的同学肯定已经发现了，在前面 DOM 方案里，我们就是采用这样的方式。这个时候，圆点的直径为 11.1%。第二种方式是用横竖三条线把宽高四等分，圆点在这些线的交点处。</p><p>在 Canvas 里我们采用第二种方法来确定圆点（代码里的 n = 3）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>let range = Math.round(width / (n + 1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>let circles = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//drawCircleCenters</span></span>
<span class="line"><span>for(let i = 1; i &amp;lt;= n; i++){</span></span>
<span class="line"><span>  for(let j = 1; j &amp;lt;= n; j++){</span></span>
<span class="line"><span>    let y = range * i, x = range * j;</span></span>
<span class="line"><span>    drawSolidCircle(circleCtx, fgColor, x, y, innerRadius);</span></span>
<span class="line"><span>    let circlePoint = {x, y};</span></span>
<span class="line"><span>    circlePoint.pos = [i, j];</span></span>
<span class="line"><span>    circles.push(circlePoint);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>最后一点严格说不属于结构设计，但因为我们的 UI 是通过触屏操作，所以我们需要考虑 Touch 事件处理和坐标的转换。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function getCanvasPoint(canvas, x, y){</span></span>
<span class="line"><span>  let rect = canvas.getBoundingClientRect();</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    x: 2 * (x - rect.left),</span></span>
<span class="line"><span>    y: 2 * (y - rect.top),</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们将 Touch 相对于屏幕的坐标转换为 Canvas 相对于画布的坐标。代码里的 2 倍是因为我们前面说了要让 retina 屏下清晰，我们将 Canvas 放大为原来的 2 倍。</p><h2 id="api-设计" tabindex="-1">API 设计 <a class="header-anchor" href="#api-设计" aria-label="Permalink to &quot;API 设计&quot;">​</a></h2><p>接下来我们需要设计给使用者使用的 API 了。在这里，我们将组件功能分解一下，独立出一个单纯记录手势的 Recorder。将组件功能分解为更加底层的组件，是一种简化组件设计的常用模式。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/53c4bb35522954095ca736bdf6d86edf.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/53c4bb35522954095ca736bdf6d86edf.jpeg" alt=""></a></p><p>我们抽取出底层的 Recorder，让 Locker 继承 Recorder，Recorder 负责记录，Locker 管理实际的设置和验证密码的过程。</p><p>我们的 Recorder 只负责记录用户行为，由于用户操作是异步操作，我们将它设计为 Promise 规范的 API，它可以以如下方式使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>var recorder = new HandLock.Recorder({</span></span>
<span class="line"><span>  container: document.querySelector(&#39;#main&#39;)</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function recorded(res){</span></span>
<span class="line"><span>  if(res.err){</span></span>
<span class="line"><span>    console.error(res.err);</span></span>
<span class="line"><span>    recorder.clearPath();</span></span>
<span class="line"><span>    if(res.err.message !== HandLock.Recorder.ERR_USER_CANCELED){</span></span>
<span class="line"><span>      recorder.record().then(recorded);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }else{</span></span>
<span class="line"><span>    console.log(res.records);</span></span>
<span class="line"><span>    recorder.record().then(recorded);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>recorder.record().then(recorded)</span></span></code></pre></div><p>对于输出结果，我们简单用选中圆点的行列坐标拼接起来得到一个唯一的序列。例如 “11121323” 就是如下选择图形：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/82500410b843734363a9c49d6f3b5fb8.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/82500410b843734363a9c49d6f3b5fb8.jpeg" alt=""></a></p><p>为了让 UI 显示具有灵活性，我们还可以将外观配置抽取出来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const defaultOptions = {</span></span>
<span class="line"><span>  container: null, //创建canvas的容器，如果不填，自动在 body 上创建覆盖全屏的层</span></span>
<span class="line"><span>  focusColor: &#39;#e06555&#39;,  //当前选中的圆的颜色</span></span>
<span class="line"><span>  fgColor: &#39;#d6dae5&#39;,     //未选中的圆的颜色</span></span>
<span class="line"><span>  bgColor: &#39;#fff&#39;,        //canvas背景颜色</span></span>
<span class="line"><span>  n: 3, //圆点的数量： n x n</span></span>
<span class="line"><span>  innerRadius: 20,  //圆点的内半径</span></span>
<span class="line"><span>  outerRadius: 50,  //圆点的外半径，focus 的时候显示</span></span>
<span class="line"><span>  touchRadius: 70,  //判定touch事件的圆半径</span></span>
<span class="line"><span>  render: true,     //自动渲染</span></span>
<span class="line"><span>  customStyle: false, //自定义样式</span></span>
<span class="line"><span>  minPoints: 4,     //最小允许的点数</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这样，我们实现完整的 Recorder 对象，核心代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[...] //定义一些私有方法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const defaultOptions = {</span></span>
<span class="line"><span>  container: null, //创建canvas的容器，如果不填，自动在 body 上创建覆盖全屏的层</span></span>
<span class="line"><span>  focusColor: &#39;#e06555&#39;,  //当前选中的圆的颜色</span></span>
<span class="line"><span>  fgColor: &#39;#d6dae5&#39;,     //未选中的圆的颜色</span></span>
<span class="line"><span>  bgColor: &#39;#fff&#39;,        //canvas背景颜色</span></span>
<span class="line"><span>  n: 3, //圆点的数量： n x n</span></span>
<span class="line"><span>  innerRadius: 20,  //圆点的内半径</span></span>
<span class="line"><span>  outerRadius: 50,  //圆点的外半径，focus 的时候显示</span></span>
<span class="line"><span>  touchRadius: 70,  //判定touch事件的圆半径</span></span>
<span class="line"><span>  render: true,     //自动渲染</span></span>
<span class="line"><span>  customStyle: false, //自定义样式</span></span>
<span class="line"><span>  minPoints: 4,     //最小允许的点数</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default class Recorder{</span></span>
<span class="line"><span>  static get ERR_NOT_ENOUGH_POINTS(){</span></span>
<span class="line"><span>    return &#39;not enough points&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  static get ERR_USER_CANCELED(){</span></span>
<span class="line"><span>    return &#39;user canceled&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  static get ERR_NO_TASK(){</span></span>
<span class="line"><span>    return &#39;no task&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  constructor(options){</span></span>
<span class="line"><span>    options = Object.assign({}, defaultOptions, options);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.options = options;</span></span>
<span class="line"><span>    this.path = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(options.render){</span></span>
<span class="line"><span>      this.render();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  render(){</span></span>
<span class="line"><span>    if(this.circleCanvas) return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let options = this.options;</span></span>
<span class="line"><span>    let container = options.container || document.createElement(&#39;div&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(!options.container &amp;&amp; !options.customStyle){</span></span>
<span class="line"><span>      Object.assign(container.style, {</span></span>
<span class="line"><span>        position: &#39;absolute&#39;,</span></span>
<span class="line"><span>        top: 0,</span></span>
<span class="line"><span>        left: 0,</span></span>
<span class="line"><span>        width: &#39;100%&#39;,</span></span>
<span class="line"><span>        height: &#39;100%&#39;,</span></span>
<span class="line"><span>        lineHeight: &#39;100%&#39;,</span></span>
<span class="line"><span>        overflow: &#39;hidden&#39;,</span></span>
<span class="line"><span>        backgroundColor: options.bgColor</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>      document.body.appendChild(container);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.container = container;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let {width, height} = container.getBoundingClientRect();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //画圆的 canvas，也是最外层监听事件的 canvas</span></span>
<span class="line"><span>    let circleCanvas = document.createElement(&#39;canvas&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //2 倍大小，为了支持 retina 屏</span></span>
<span class="line"><span>    circleCanvas.width = circleCanvas.height = 2 * Math.min(width, height);</span></span>
<span class="line"><span>    if(!options.customStyle){</span></span>
<span class="line"><span>      Object.assign(circleCanvas.style, {</span></span>
<span class="line"><span>        position: &#39;absolute&#39;,</span></span>
<span class="line"><span>        top: &#39;50%&#39;,</span></span>
<span class="line"><span>        left: &#39;50%&#39;,</span></span>
<span class="line"><span>        transform: &#39;translate(-50%, -50%) scale(0.5)&#39;,</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //画固定线条的 canvas</span></span>
<span class="line"><span>    let lineCanvas = circleCanvas.cloneNode(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //画不固定线条的 canvas</span></span>
<span class="line"><span>    let moveCanvas = circleCanvas.cloneNode(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    container.appendChild(lineCanvas);</span></span>
<span class="line"><span>    container.appendChild(moveCanvas);</span></span>
<span class="line"><span>    container.appendChild(circleCanvas);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.lineCanvas = lineCanvas;</span></span>
<span class="line"><span>    this.moveCanvas = moveCanvas;</span></span>
<span class="line"><span>    this.circleCanvas = circleCanvas;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.container.addEventListener(&#39;touchmove&#39;,</span></span>
<span class="line"><span>      evt =&amp;gt; evt.preventDefault(), {passive: false});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.clearPath();</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  clearPath(){</span></span>
<span class="line"><span>    if(!this.circleCanvas) this.render();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let {circleCanvas, lineCanvas, moveCanvas} = this,</span></span>
<span class="line"><span>        circleCtx = circleCanvas.getContext(&#39;2d&#39;),</span></span>
<span class="line"><span>        lineCtx = lineCanvas.getContext(&#39;2d&#39;),</span></span>
<span class="line"><span>        moveCtx = moveCanvas.getContext(&#39;2d&#39;),</span></span>
<span class="line"><span>        width = circleCanvas.width,</span></span>
<span class="line"><span>        {n, fgColor, innerRadius} = this.options;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    circleCtx.clearRect(0, 0, width, width);</span></span>
<span class="line"><span>    lineCtx.clearRect(0, 0, width, width);</span></span>
<span class="line"><span>    moveCtx.clearRect(0, 0, width, width);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let range = Math.round(width / (n + 1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let circles = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //drawCircleCenters</span></span>
<span class="line"><span>    for(let i = 1; i &amp;lt;= n; i++){</span></span>
<span class="line"><span>      for(let j = 1; j &amp;lt;= n; j++){</span></span>
<span class="line"><span>        let y = range * i, x = range * j;</span></span>
<span class="line"><span>        drawSolidCircle(circleCtx, fgColor, x, y, innerRadius);</span></span>
<span class="line"><span>        let circlePoint = {x, y};</span></span>
<span class="line"><span>        circlePoint.pos = [i, j];</span></span>
<span class="line"><span>        circles.push(circlePoint);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.circles = circles;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  async cancel(){</span></span>
<span class="line"><span>    if(this.recordingTask){</span></span>
<span class="line"><span>      return this.recordingTask.cancel();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Promise.resolve({err: new Error(Recorder.ERR_NO_TASK)});</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  async record(){</span></span>
<span class="line"><span>    if(this.recordingTask) return this.recordingTask.promise;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let {circleCanvas, lineCanvas, moveCanvas, options} = this,</span></span>
<span class="line"><span>        circleCtx = circleCanvas.getContext(&#39;2d&#39;),</span></span>
<span class="line"><span>        lineCtx = lineCanvas.getContext(&#39;2d&#39;),</span></span>
<span class="line"><span>        moveCtx = moveCanvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    circleCanvas.addEventListener(&#39;touchstart&#39;, ()=&amp;gt;{</span></span>
<span class="line"><span>      this.clearPath();</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let records = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let handler = evt =&amp;gt; {</span></span>
<span class="line"><span>      let {clientX, clientY} = evt.changedTouches[0],</span></span>
<span class="line"><span>          {bgColor, focusColor, innerRadius, outerRadius, touchRadius} = options,</span></span>
<span class="line"><span>          touchPoint = getCanvasPoint(moveCanvas, clientX, clientY);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      for(let i = 0; i &amp;lt; this.circles.length; i++){</span></span>
<span class="line"><span>        let point = this.circles[i],</span></span>
<span class="line"><span>            x0 = point.x,</span></span>
<span class="line"><span>            y0 = point.y;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(distance(point, touchPoint) &amp;lt; touchRadius){</span></span>
<span class="line"><span>          drawSolidCircle(circleCtx, bgColor, x0, y0, outerRadius);</span></span>
<span class="line"><span>          drawSolidCircle(circleCtx, focusColor, x0, y0, innerRadius);</span></span>
<span class="line"><span>          drawHollowCircle(circleCtx, focusColor, x0, y0, outerRadius);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          if(records.length){</span></span>
<span class="line"><span>            let p2 = records[records.length - 1],</span></span>
<span class="line"><span>                x1 = p2.x,</span></span>
<span class="line"><span>                y1 = p2.y;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            drawLine(lineCtx, focusColor, x0, y0, x1, y1);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          let circle = this.circles.splice(i, 1);</span></span>
<span class="line"><span>          records.push(circle[0]);</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if(records.length){</span></span>
<span class="line"><span>        let point = records[records.length - 1],</span></span>
<span class="line"><span>            x0 = point.x,</span></span>
<span class="line"><span>            y0 = point.y,</span></span>
<span class="line"><span>            x1 = touchPoint.x,</span></span>
<span class="line"><span>            y1 = touchPoint.y;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);</span></span>
<span class="line"><span>        drawLine(moveCtx, focusColor, x0, y0, x1, y1);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    circleCanvas.addEventListener(&#39;touchstart&#39;, handler);</span></span>
<span class="line"><span>    circleCanvas.addEventListener(&#39;touchmove&#39;, handler);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    let recordingTask = {};</span></span>
<span class="line"><span>    let promise = new Promise((resolve, reject) =&amp;gt; {</span></span>
<span class="line"><span>      recordingTask.cancel = (res = {}) =&amp;gt; {</span></span>
<span class="line"><span>        let promise = this.recordingTask.promise;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        res.err = res.err || new Error(Recorder.ERR_USER_CANCELED);</span></span>
<span class="line"><span>        circleCanvas.removeEventListener(&#39;touchstart&#39;, handler);</span></span>
<span class="line"><span>        circleCanvas.removeEventListener(&#39;touchmove&#39;, handler);</span></span>
<span class="line"><span>        document.removeEventListener(&#39;touchend&#39;, done);</span></span>
<span class="line"><span>        resolve(res);</span></span>
<span class="line"><span>        this.recordingTask = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return promise;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      let done = evt =&amp;gt; {</span></span>
<span class="line"><span>        moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);</span></span>
<span class="line"><span>        if(!records.length) return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        circleCanvas.removeEventListener(&#39;touchstart&#39;, handler);</span></span>
<span class="line"><span>        circleCanvas.removeEventListener(&#39;touchmove&#39;, handler);</span></span>
<span class="line"><span>        document.removeEventListener(&#39;touchend&#39;, done);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        let err = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if(records.length &amp;lt; options.minPoints){</span></span>
<span class="line"><span>          err = new Error(Recorder.ERR_NOT_ENOUGH_POINTS);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //这里可以选择一些复杂的编码方式，本例子用最简单的直接把坐标转成字符串</span></span>
<span class="line"><span>        let res = {err, records: records.map(o =&amp;gt; o.pos.join(&#39;&#39;)).join(&#39;&#39;)};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        resolve(res);</span></span>
<span class="line"><span>        this.recordingTask = null;</span></span>
<span class="line"><span>      };</span></span>
<span class="line"><span>      document.addEventListener(&#39;touchend&#39;, done);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    recordingTask.promise = promise;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.recordingTask</span></span></code></pre></div><p>这里有几个公开的方法，分别是ecorder 负责记录绘制结果， clearPath 负责在画布上清除上一次记录的结果，cancel 负责终止记录过程，这是为后续流程准备的。</p><h2 id="流程设计" tabindex="-1">流程设计 <a class="header-anchor" href="#流程设计" aria-label="Permalink to &quot;流程设计&quot;">​</a></h2><p>接下来，我们基于 Recorder 来设计设置和验证密码的流程：</p><p>首先是验证密码的流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/c1e94603bfb1d26a0b354377095b6f3c.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/c1e94603bfb1d26a0b354377095b6f3c.jpeg" alt=""></a></p><p>其次是设置密码的流程：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/da4509d380c71e30bdd03ec27c000e3a.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/293376/da4509d380c71e30bdd03ec27c000e3a.jpeg" alt=""></a></p><p>有了前面异步 Promise API 的 Recorder，我们不难实现上面的两个流程。</p><p><strong>验证密码的内部流程</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async check(password){</span></span>
<span class="line"><span>  if(this.mode !== Locker.MODE_CHECK){</span></span>
<span class="line"><span>    await this.cancel();</span></span>
<span class="line"><span>    this.mode = Locker.MODE_CHECK;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let checked = this.options.check.checked;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let res = await this.record();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(res.err &amp;&amp; res.err.message === Locker.ERR_USER_CANCELED){</span></span>
<span class="line"><span>    return Promise.resolve(res);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(!res.err &amp;&amp; password !== res.records){</span></span>
<span class="line"><span>    res.err = new Error(Locker.ERR_PASSWORD_MISMATCH)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  checked.call(this, res);</span></span>
<span class="line"><span>  this.check(password);</span></span>
<span class="line"><span>  return Promise.resolve(res</span></span></code></pre></div><p><strong>设置密码的内部流程</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async update(){</span></span>
<span class="line"><span>  if(this.mode !== Locker.MODE_UPDATE){</span></span>
<span class="line"><span>    await this.cancel();</span></span>
<span class="line"><span>    this.mode = Locker.MODE_UPDATE;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let beforeRepeat = this.options.update.beforeRepeat,</span></span>
<span class="line"><span>      afterRepeat = this.options.update.afterRepeat;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let first = await this.record();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(first.err &amp;&amp; first.err.message === Locker.ERR_USER_CANCELED){</span></span>
<span class="line"><span>    return Promise.resolve(first);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(first.err){</span></span>
<span class="line"><span>    this.update();</span></span>
<span class="line"><span>    beforeRepeat.call(this, first);</span></span>
<span class="line"><span>    return Promise.resolve(first);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  beforeRepeat.call(this, first);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let second = await this.record();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(second.err &amp;&amp; second.err.message === Locker.ERR_USER_CANCELED){</span></span>
<span class="line"><span>    return Promise.resolve(second);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(!second.err &amp;&amp; first.records !== second.records){</span></span>
<span class="line"><span>    second.err = new Error(Locker.ERR_PASSWORD_MISMATCH);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  this.update();</span></span>
<span class="line"><span>  afterRepeat.call(this, second);</span></span>
<span class="line"><span>  return Promise.resolve(se</span></span></code></pre></div><p>我们可以看到，有了 Recorder 之后，Locker 的验证和设置密码基本上就是顺着流程用 async/await 写下来就行了。</p><p>另外，我们还要注意一些细节问题。由于实际在手机上触屏时，如果上下拖动，浏览器的默认行为会导致页面上下移动，因此我们需要阻止 touchmove 的默认事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.container.addEventListener(&#39;touchmove&#39;,</span></span>
<span class="line"><span>      evt =&amp;gt; evt.preventDefault(), {passive: false});</span></span></code></pre></div><p>touchmove 事件在 Chrome 下默认是一个 <a href="https://dom.spec.whatwg.org/#in-passive-listener-flag" target="_blank" rel="noreferrer">Passive Event</a>，因此，我们addEventListener 的时候需要传参 {passive: false}，否则就不能 preventDefault。</p><p>此外，因为我们的代码使用了 ES6+，所以需要引入 babel 编译，我们的组件也使用 webpack 进行打包，以便于使用者在浏览器中直接引入。</p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>今天，我和你一起完成了前几天留下的“手势密码”实战题。通过解决这几道题，我希望你能记住这三件事：</p><ol><li>在设计 API 的时候思考真正的需求，判断什么该开放、什么该封装</li><li>做好技术调研和核心方案研究，选择合适的方案</li><li>着手优化和解决细节问题，要站在API使用者的角度思考</li></ol><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p><a href="https://github.com/akira-cn/handlock" target="_blank" rel="noreferrer">GitHub 工程</a></p>`,69)])])}const g=n(l,[["render",i]]);export{u as __pageData,g as default};
