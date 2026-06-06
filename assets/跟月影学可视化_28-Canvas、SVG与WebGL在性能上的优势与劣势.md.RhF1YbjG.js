import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"28 | Canvas、SVG与WebGL在性能上的优势与劣势","description":"","frontmatter":{},"headers":[{"level":2,"title":"可视化渲染的性能问题有哪些？","slug":"可视化渲染的性能问题有哪些","link":"#可视化渲染的性能问题有哪些","children":[]},{"level":2,"title":"影响Canvas渲染性能的2大要素","slug":"影响canvas渲染性能的2大要素","link":"#影响canvas渲染性能的2大要素","children":[]},{"level":2,"title":"影响SVG性能的2大要素","slug":"影响svg性能的2大要素","link":"#影响svg性能的2大要素","children":[]},{"level":2,"title":"影响WebGL性能的要素","slug":"影响webgl性能的要素","link":"#影响webgl性能的要素","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"relativePath":"跟月影学可视化/28-Canvas、SVG与WebGL在性能上的优势与劣势.md","filePath":"跟月影学可视化/28-Canvas、SVG与WebGL在性能上的优势与劣势.md","lastUpdated":1779822292000}'),i={name:"跟月影学可视化/28-Canvas、SVG与WebGL在性能上的优势与劣势.md"};function l(t,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_28-canvas、svg与webgl在性能上的优势与劣势" tabindex="-1">28 | Canvas、SVG与WebGL在性能上的优势与劣势 <a class="header-anchor" href="#_28-canvas、svg与webgl在性能上的优势与劣势" aria-label="Permalink to &quot;28 | Canvas、SVG与WebGL在性能上的优势与劣势&quot;">​</a></h1><p>你好，我是月影。</p><p>性能优化，一直以来都是前端开发的难点。</p><p>我们知道，前端性能是一块比较复杂的内容，由许多因素决定，比如，网页内容和资源文件的大小、请求数、域名、服务器配置、CDN等等。如果你能把性能优化好，就能极大地增强用户体验。</p><p>在可视化领域也一样，可视化因为要突出数据表达的内容，经常需要设计一些有视觉震撼力的图形效果，比如，复杂的粒子效果和大量元素的动态效果。想要实现这些效果，图形系统的渲染性能就必须非常好，能够在用户的浏览器上稳定流畅地渲染出想要的视觉效果。</p><p>那么针对可视化渲染，我们都要解决哪些性能问题呢？</p><h2 id="可视化渲染的性能问题有哪些" tabindex="-1">可视化渲染的性能问题有哪些？ <a class="header-anchor" href="#可视化渲染的性能问题有哪些" aria-label="Permalink to &quot;可视化渲染的性能问题有哪些？&quot;">​</a></h2><p>由于前端的可视化也是在Web上展现的，因此像网页大小这些因素也会影响它的性能。而且，无论是可视化还是普通Web前端，针对这些因素进行性能优化的原理和手段都一样。</p><p>所以我今天想和你聊的是，可视化方面特殊的性能问题。它们在我们熟悉的Web前端工作中并不常见，通常只在可视化中绘制复杂图形的时候，我们才需要重点考虑。这些问题大体上可以分为两类，一类是 <strong>渲染效率问题，另一类是计算问题</strong>。</p><p><strong>我们先来看它们的定义，渲染效率问题指的是图形系统在绘图部分所花费的时间，而计算问题则是指绘图之外的其他处理所花费的时间，包括图形数据的计算、正常的程序逻辑处理等等</strong>。</p><p>我们知道，在浏览器上渲染动画，每一秒钟最高达到60帧左右。也就是说，我们可以在1秒钟内完成60次图像的绘制，那么完成一次图像绘制的时间就是1000/60（1秒=1000毫秒），约等于16毫秒。</p><p>换句话说，如果我们能在16毫秒内完成图像的计算与渲染过程，那视觉呈现就可以达到完美的60fps（即60帧每秒，fps全称是frame per second，是帧率单位）。但是，在复杂的图形渲染时，我们的帧率很可能达不到60fps。</p><p>所以，我们只能退而求其次，最低可以选择24fps，就相当于图形系统要在大约42毫秒内完成一帧图像的绘制。这是在我们的感知里，达到比较流畅的动画效果的最低帧率了。要保证这个帧率，我们就必须保证计算加上渲染的时间不能超过42毫秒。</p><p>因为计算问题与数据和算法有关，所以我们后面会专门讨论。这里，我们先关注渲染效率的问题，这个问题和图形系统息息相关。</p><p>我们知道，Canvas2D、SVG和WebGL等图形系统各自的特点不同，所以它们在绘制不同图形时的性能影响也不同，会表现出不同的性能瓶颈。其实，通过基础篇的学习，我们也大体上知道了这些图形系统的区别和优劣。那今天，我们就在此基础上，深入讨论一下影响它们各自性能的关键因素，理解了这些要素，我们针对不同图形系统，就能快速找到需要进行性能优化的点了。</p><h2 id="影响canvas渲染性能的2大要素" tabindex="-1">影响Canvas渲染性能的2大要素 <a class="header-anchor" href="#影响canvas渲染性能的2大要素" aria-label="Permalink to &quot;影响Canvas渲染性能的2大要素&quot;">​</a></h2><p>我们知道，Canvas是指令式绘图系统，它通过绘图指令来完成图形的绘制。那么我们很容易就会想到2个影响因素，首先绘制图形的数量越多，我们需要的绘图指令就越多，花费的渲染时间也会越多。其次，画布上绘制的图形越大，绘图指令执行的时间也会增多，那么花费的渲染时间也会越多。</p><p>这些其实都是我们现阶段得出的假设，而实践是检验真理的唯一标准，所以我们一起做个实验，来证明我们刚才的假设吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const ctx = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const WIDTH = canvas.width;</span></span>
<span class="line"><span>const HEIGHT = canvas.height;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function randomColor() {</span></span>
<span class="line"><span>  return \`hsl(\${Math.random() * 360}, 100%, 50%)\`;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function drawCircle(context, radius) {</span></span>
<span class="line"><span>  const x = Math.random() * WIDTH;</span></span>
<span class="line"><span>  const y = Math.random() * HEIGHT;</span></span>
<span class="line"><span>  const fillColor = randomColor();</span></span>
<span class="line"><span>  context.fillStyle = fillColor;</span></span>
<span class="line"><span>  context.beginPath();</span></span>
<span class="line"><span>  context.arc(x, y, radius, 0, Math.PI * 2);</span></span>
<span class="line"><span>  context.fill();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function draw(context, count = 500, radius = 10) {</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; count; i++) {</span></span>
<span class="line"><span>    drawCircle(context, radius);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>requestAnimationFrame(function update() {</span></span>
<span class="line"><span>  ctx.clearRect(0, 0, WIDTH, HEIGHT);</span></span>
<span class="line"><span>  draw(ctx);</span></span>
<span class="line"><span>  requestAnimationFrame(update);</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>如上面代码所示，我们在Canvas上每一帧绘制500个半径为10的小圆，效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/b278a4f98413b9029dfa914ab4b88be3.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/b278a4f98413b9029dfa914ab4b88be3.jpg" alt=""></a></p><p>注意，为了方便查看帧率的变化，我们在浏览器中开启了帧率检测。Chrome开发者工具自带这个功能，我们在开发者工具的Rendering标签页中，勾选FPS Meter就可以开启这个功能查看帧率了。</p><p>我们现在看到，即使每帧渲染500个位置和颜色都随机的小圆形，Canvas渲染的帧率依然能达到60fps。</p><p>接着，我们增加小球的数量，把它增加到1000个。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/8cbe753219d08a1b84753fe5f89518f9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/8cbe753219d08a1b84753fe5f89518f9.jpg" alt=""></a></p><p>这时你可以看到，因为小球数量增加一倍，所以帧率掉到了50fps左右，现在下降得还不算太多。而如果我们把小球的数量设置成3000，你就能看到明显的差别了。</p><p>那如果我们把小球的数量保持在500，把半径增大到很大，如200，也会看到帧率有明显下降。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/ee69d57ce2b1214f55650f8c3f8d9681.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/ee69d57ce2b1214f55650f8c3f8d9681.jpg" alt=""></a></p><p>但是，单从上图的实验来看，图形大小对帧率的影响也不是很大。因为我们把小球的半径增加了20倍，帧率也就下降到33fps。当然这也是因为画圆比较简单，如果我们绘制的图形更复杂一些，那么大小的影响会相对显著一些。</p><p>通过这个实验，我们能得出，影响Canvas的渲染性能的主要因素有两点，一是 <strong>绘制图形的数量</strong>，二是 <strong>绘制图形的大小。</strong> 这正好验证了我们开头的结论。</p><p>总的来说，Canvas2D绘制图形的性能还是比较高的。在普通的个人电脑上，我们要绘制的图形不太大时，只要不超过500个都可以达到60fps，1000个左右其实也能达到50fps，就算要绘制大约3000个图形，也能够保持在可以接受的24fps以上。</p><p>因此，在不做特殊优化的前提下，如果我们使用Canvas2D来绘图，那么3000个左右元素是一般的应用的极限，除非这个应用运行在比个人电脑的GPU和显卡更好的机器上，或者采用特殊的优化手段。那具体怎么优化，我会在下节课详细来说。</p><h2 id="影响svg性能的2大要素" tabindex="-1">影响SVG性能的2大要素 <a class="header-anchor" href="#影响svg性能的2大要素" aria-label="Permalink to &quot;影响SVG性能的2大要素&quot;">​</a></h2><p>讲完了Canvas接下来我们看一下SVG。</p><p>我们用SVG实现同样的绘制随机圆形的例子，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function randomColor() {</span></span>
<span class="line"><span>  return \`hsl(\${Math.random() * 360}, 100%, 50%)\`;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const root = document.querySelector(&#39;svg&#39;);</span></span>
<span class="line"><span>const COUNT = 500;</span></span>
<span class="line"><span>const WIDTH = 500;</span></span>
<span class="line"><span>const HEIGHT = 500;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function initCircles(count = COUNT) {</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; count; i++) {</span></span>
<span class="line"><span>    const circle = document.createElementNS(&#39;http://www.w3.org/2000/svg&#39;, &#39;circle&#39;);</span></span>
<span class="line"><span>    root.appendChild(circle);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return [...root.querySelectorAll(&#39;circle&#39;)];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const circles = initCircles();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function drawCircle(circle, radius = 10) {</span></span>
<span class="line"><span>  const x = Math.random() * WIDTH;</span></span>
<span class="line"><span>  const y = Math.random() * HEIGHT;</span></span>
<span class="line"><span>  const fillColor = randomColor();</span></span>
<span class="line"><span>  circle.setAttribute(&#39;cx&#39;, x);</span></span>
<span class="line"><span>  circle.setAttribute(&#39;cy&#39;, y);</span></span>
<span class="line"><span>  circle.setAttribute(&#39;r&#39;, radius);</span></span>
<span class="line"><span>  circle.setAttribute(&#39;fill&#39;, fillColor);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function draw() {</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; COUNT; i++) {</span></span>
<span class="line"><span>    drawCircle(circles[i]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  requestAnimationFrame(draw);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>draw();</span></span></code></pre></div><p>在我的电脑上（一台普通的MacBook Pro，内存8GB，独立显卡）绘制了500个半径为10的小球时，SVG的帧率接近60fps，会比Canvas稍慢，但是差别不是太大。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/01f6d0d37a0aeabd8449dyyecfc4e2fa.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/01f6d0d37a0aeabd8449dyyecfc4e2fa.jpg" alt=""></a></p><p>当我们将小球数量增加到1000个时，SVG的帧率就要略差一些，大概45fps左右。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/4efb6930462da79f36e913546f5eb1b6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/4efb6930462da79f36e913546f5eb1b6.jpg" alt=""></a></p><p>乍一看，似乎SVG和Canvas2D的性能差别也不是很大。不过，随着小球数量的增加，两者的差别会越来越大。比如说，当我们将小球的个数增加到3000个左右的时候，Canvas2D渲染的帧率依然保持在30fps以上，而SVG渲染帧率大约只有15fps，差距会特别明显。</p><p>之所以在小球个数较多的时候，二者差距很大，因为SVG是浏览器DOM来渲染的，元素个数越多，消耗就越大。</p><p>如果我们保证小球个数在一个小数值，然后增大每个小球的半径，那么与Canvas一样，SVG的渲染效率也会明显下降。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/19d991c1ee547d1f98fe2f504eaba1ea.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/19d991c1ee547d1f98fe2f504eaba1ea.jpg" alt=""></a></p><p>如上图所示，当渲染500个小球时，我们把半径增加到200，帧率下降到不到20fps。</p><p>最终，我们能得到的结论与Canvas类似，影响SVG的性能因素也是相同的两点，一是 <strong>绘制图形的数量</strong>，二是 <strong>绘制图形的大小</strong>。但与Canvas不同的是，图形数量增多的时候，SVG的帧率下降会更明显，因此，一般来说，在图形数量小于1000时，我们可以考虑使用SVG，当图形数量大于1000但不超过3000时，我们考虑使用Canvas2D。</p><p>那么当图形数量超过3000时，用Canvas2D也很难达到比较理想的帧率了，这时候，我们就要使用WebGL渲染。</p><h2 id="影响webgl性能的要素" tabindex="-1">影响WebGL性能的要素 <a class="header-anchor" href="#影响webgl性能的要素" aria-label="Permalink to &quot;影响WebGL性能的要素&quot;">​</a></h2><p>用WebGL渲染上面的例子，我们不需要一个一个小球去渲染，利用GPU的并行处理能力，我们可以一次完成渲染。</p><p>因为我们要渲染的小球形状相同，所以它们的顶点数据是可以共享的。在这里我们采用一种WebGL支持的批量绘制技术，叫做 <strong>InstancedDrawing（实例化渲染）</strong>。在OGL库中，我们只需要给几何体数据传递带有instanced属性的顶点数据，就可以自动使用instanced drawing技术来批量绘制图形。具体的操作代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function circleGeometry(gl, radius = 0.04, count = 30000, segments = 20) {</span></span>
<span class="line"><span>  const tau = Math.PI * 2;</span></span>
<span class="line"><span>  const position = new Float32Array(segments * 2 + 2);</span></span>
<span class="line"><span>  const index = new Uint16Array(segments * 3);</span></span>
<span class="line"><span>  const id = new Uint16Array(count);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; segments; i++) {</span></span>
<span class="line"><span>    const alpha = i / segments * tau;</span></span>
<span class="line"><span>    position.set([radius * Math.cos(alpha), radius * Math.sin(alpha)], i * 2 + 2);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; segments; i++) {</span></span>
<span class="line"><span>    if(i === segments - 1) {</span></span>
<span class="line"><span>      index.set([0, i + 1, 1], i * 3);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      index.set([0, i + 1, i + 2], i * 3);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; count; i++) {</span></span>
<span class="line"><span>    id.set([i], i);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return new Geometry(gl, {</span></span>
<span class="line"><span>    position: {</span></span>
<span class="line"><span>      data: position,</span></span>
<span class="line"><span>      size: 2,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    index: {</span></span>
<span class="line"><span>      data: index,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    id: {</span></span>
<span class="line"><span>      instanced: 1,</span></span>
<span class="line"><span>      size: 1,</span></span>
<span class="line"><span>      data: id,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们实现一个circleGeometry函数，用来生成指定数量的小球的定点数据。这里我们使用批量绘制的技术，一下子绘制了30000个小球。与绘制单个小球一样，我们计算小球的position数据和index数据，然后我们设置一个id数据，这个数据等于每个小球的下标。</p><p>我们通过instanced:1的方式告诉WebGL这是一个批量绘制的数据，让每一个值作用于一个几何体。这样我们就能区分不同的几何体，而WebGL在绘制的时候会根据id数据的个数来绘制相应多个几何体。</p><p>接着，我们实现顶点着色器，并且在顶点着色器代码中实现随机位置和随机颜色。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>precision highp float;</span></span>
<span class="line"><span>attribute vec2 position;</span></span>
<span class="line"><span>attribute float id;</span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>highp float random(vec2 co) {</span></span>
<span class="line"><span>  highp float a = 12.9898;</span></span>
<span class="line"><span>  highp float b = 78.233;</span></span>
<span class="line"><span>  highp float c = 43758.5453;</span></span>
<span class="line"><span>  highp float dt= dot(co.xy ,vec2(a,b));</span></span>
<span class="line"><span>  highp float sn= mod(dt,3.14);</span></span>
<span class="line"><span>  return fract(sin(sn) * c);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec3 hsb2rgb(vec3 c){</span></span>
<span class="line"><span>  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);</span></span>
<span class="line"><span>  rgb = rgb * rgb * (3.0 - 2.0 * rgb);</span></span>
<span class="line"><span>  return c.z * mix(vec3(1.0), rgb, c.y);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec3 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 offset = vec2(</span></span>
<span class="line"><span>    1.0 - 2.0 * random(vec2(id + uTime, 100000.0)),</span></span>
<span class="line"><span>    1.0 - 2.0 * random(vec2(id + uTime, 200000.0))</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>  vec3 color = vec3(</span></span>
<span class="line"><span>    random(vec2(id + uTime, 300000.0)),</span></span>
<span class="line"><span>    1.0,</span></span>
<span class="line"><span>    1.0</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>  vColor = hsb2rgb(color);</span></span>
<span class="line"><span>  gl_Position = vec4(position + offset, 0, 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码中的random函数和hsb2rgb函数，我们都学过了，整体逻辑也并不复杂，相信你应该能看明白。</p><p>最后，我们将uTime作为uniform传进去，结合id和uTime，用随机数就可以渲染出与前面Canvas和SVG例子一样的效果。</p><p>这个WebGL渲染的例子的性能非常高，我们将小球的个数设置为30000个，依然可以轻松达到60fps的帧率。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/84be3a259d9d7dc0572cf8044029536f.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/277717/84be3a259d9d7dc0572cf8044029536f.jpg" alt=""></a></p><p>WebGL渲染之所以能达到这么高的性能，是因为WebGL利用GPU并行执行的特性，无论我们批量绘制多少个小球，都能够同时完成计算并渲染出来。</p><p>如果我们增大小球的半径，那么帧率也会明显下降，这一点和Canvas2D与SVG一样。当我们将小球半径增加到0.8（相当于Canvas2D中的200），那么可以流畅渲染的数量就无法达到这么多，大约渲染3000个左右可以保持在30fps以上，这个效率仍比Canvas2D有着5倍以上的提升。小球半径增加导致帧率下降，是因为图形增大，片元着色器要执行的次数就会增多，就会增加GPU运算的开销。</p><p>好了，那我们来总结一下WebGL性能的要素。WebGL情况比较复杂，上面的例子其实不能涵盖所有的情况，不过不要紧，我这里先说一下结论，你先记下来，我们之后还会专门讨论WebGL的性能优化方法。</p><p>首先，WebGL和Canvas2D与SVG不同，它的性能并不直接与渲染元素的数量相关，而是取决于WebGL的渲染次数。有的时候，图形元素虽然很多，但是WebGL可以批量渲染，就像前面的例子中，虽然有上万个小球，但是通过WebGL的instanced drawing技术，可以批量完成渲染，那样它的性能就会很高。当然，元素的数量多，WebGL渲染效率也会逐渐降低，这是因为，元素越多，本身渲染耗费的内存也越多，占用内存太多，渲染效率也会下降。</p><p>其次，在渲染次数相同的情况下，WebGL的效率取决于着色器中的计算复杂度和执行次数。图形顶点越多，顶点着色器的执行次数越多，图形越大，片元着色器的执行次数越多，虽然是并行执行，但执行次数多依然会有更大的性能开销。最后，如果每次执行着色器中的计算越复杂，WebGL渲染的性能开销自然也会越大。</p><p>总的来说，WebGL的性能主要有三点决定因素， <strong>一是渲染次数，二是着色器执行的次数，三是着色器运算的复杂度。</strong> 当然，数据的大小也会决定内存的消耗，因此也会对性能有所影响，只不过影响没有前面三点那么明显。</p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>要针对可视化的渲染效率进行性能优化，我们就要先搞清影响图形系统渲染性能的主要因素。</p><p>对于Canvas和SVG来说，影响渲染性能的主要是绘制元素的数量和元素的大小。一般来说，Canvas和SVG绘制的元素越多，性能消耗越大，绘制的图形越大，性能消耗也越大。相比较而言，Canvas的整体性能要优于SVG，尤其是图形越多，二者的性能差异越大。</p><p>WebGL要复杂一些，它的渲染性能主要取决于三点。</p><p>第一点是渲染次数，渲染次数越多，性能损耗就越大。需注意，要绘制的元素个数多，不一定渲染次数就多，因为WebGL支持批量渲染。</p><p>第二点是着色器执行的次数，这里包括顶点着色器和片元着色器，前者的执行次数和几何图形的顶点数有关，后者的执行次数和图形的大小有关。</p><p>第三点是着色器运算的复杂度，复杂度和glsl代码的具体实现有关，越复杂的处理逻辑，性能的消耗就会越大。</p><p>最后，数据的大小会影响内存消耗，所以也会对WebGL的渲染性能有所影响，不过没有前面三点的影响大。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><ol><li><p>刚才我们用SVG、Canvas和WebGL分别实现了随机小球，由此比较了三种图形系统的性能。但是我们并没说HTML/CSS，你能用HTML/CSS来实现这个例子吗？用HTML/CSS来实现，在性能方面与SVG、Canvas和WebGL有什么区别呢？从中，你能得出影响HTML/CSS渲染性能的要素吗？</p></li><li><p>在WebGL的例子中，我们采用了批量绘制的技术。实际上我们也可以不采用这个技术，给每个小球生成一个mesh对象，然后让Ogl来渲染。你可以试着用Ogl不采用批量渲染来实现随机小球，然后对比它们之间的渲染方案，得出性能方面的差异吗?</p></li></ol><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/performance-basic" target="_blank" rel="noreferrer">课程中详细示例代码</a></p>`,78)])])}const g=n(i,[["render",l]]);export{b as __pageData,g as default};
