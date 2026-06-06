import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"14 | 如何使用片元着色器进行几何造型？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何用片元着色器控制局部颜色？","slug":"如何用片元着色器控制局部颜色","link":"#如何用片元着色器控制局部颜色","children":[]},{"level":2,"title":"如何用片元着色器绘制圆、线段和几何图形","slug":"如何用片元着色器绘制圆、线段和几何图形","link":"#如何用片元着色器绘制圆、线段和几何图形","children":[{"level":3,"title":"1. 绘制圆","slug":"_1-绘制圆","link":"#_1-绘制圆","children":[]},{"level":3,"title":"2. 绘制线","slug":"_2-绘制线","link":"#_2-绘制线","children":[]},{"level":3,"title":"3. 用鼠标控制直线","slug":"_3-用鼠标控制直线","link":"#_3-用鼠标控制直线","children":[]},{"level":3,"title":"4. 绘制三角形","slug":"_4-绘制三角形","link":"#_4-绘制三角形","children":[]}]},{"level":2,"title":"片元着色器绘图方法论：符号距离场渲染","slug":"片元着色器绘图方法论-符号距离场渲染","link":"#片元着色器绘图方法论-符号距离场渲染","children":[]},{"level":2,"title":"着色器绘制几何图形的用途","slug":"着色器绘制几何图形的用途","link":"#着色器绘制几何图形的用途","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"relativePath":"跟月影学可视化/14-如何使用片元着色器进行几何造型？.md","filePath":"跟月影学可视化/14-如何使用片元着色器进行几何造型？.md","lastUpdated":1779822292000}'),i={name:"跟月影学可视化/14-如何使用片元着色器进行几何造型？.md"};function l(t,s,c,o,r,g){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_14-如何使用片元着色器进行几何造型" tabindex="-1">14 | 如何使用片元着色器进行几何造型？ <a class="header-anchor" href="#_14-如何使用片元着色器进行几何造型" aria-label="Permalink to &quot;14 | 如何使用片元着色器进行几何造型？&quot;">​</a></h1><p>你好，我是月影。</p><p>在WebGL中，片元着色器有着非常强大的能力，它能够并行处理图片上的全部像素，让数以百万计的运算同时完成。但也正因为它是并行计算的，所以它和常规代码顺序执行或者串行执行过程并不一样。因此，在使用片元着色器实现某些功能的时候，我们要采用与常规的JavaScript代码不一样的思路。</p><p>到底哪里不一样呢？今天，我就通过颜色控制，以及线段、曲线、简单几何图形等的绘制，来讲讲片元着色器是怎么进行几何造型的，从而加深你对片元着色器绘图原理的理解。</p><p>首先，我们来说比较简单的颜色控制。</p><h2 id="如何用片元着色器控制局部颜色" tabindex="-1">如何用片元着色器控制局部颜色？ <a class="header-anchor" href="#如何用片元着色器控制局部颜色" aria-label="Permalink to &quot;如何用片元着色器控制局部颜色？&quot;">​</a></h2><p>我们知道，片元着色器能够用来控制像素颜色，最简单的就是把图片绘制为纯色。比如，通过下面的代码，我们就把一张图片绘制为了纯黑色。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_FragColor = vec4(0, 0, 0, 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果想让一张图片呈现不同的颜色，我们还可以根据纹理坐标值来绘制，比如，通过下面的代码，我们就可以让某个图案的颜色，从左到右由黑向白过渡。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(vUv.x);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不过，这种颜色过渡还比较单一，这里我们还可以改变一下渲染方式让图形呈现的效果更复杂。比如说，我们可以使用乘法创造一个10*10的方格，让每个格子左上角是绿色，右下角是红色，中间是过渡色。代码和显示的效果如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv * 10.0;</span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(fract(st), 0.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/9b33fc3c5b08343114c479574f0484f6.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/9b33fc3c5b08343114c479574f0484f6.jpeg" alt=""></a></p><p>不仅如此，我们还可以在上图的基础上继续做调整。我们可以通过idx = floor(st)获取网格的索引，判断网格索引除以2的余数（奇偶性），根据它来决定是否翻转网格内的x、y坐标。这样操作后的代码和图案如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv * 10.0;</span></span>
<span class="line"><span>  vec2 idx = floor(st);</span></span>
<span class="line"><span>  vec2 grid = fract(st);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec2 t = mod(idx, 2.0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(t.x == 1.0) {</span></span>
<span class="line"><span>    grid.x = 1.0 - grid.x;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(t.y == 1.0) {</span></span>
<span class="line"><span>    grid.y = 1.0 - grid.y;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(grid, 0.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/66b0826578525073320c14e6120a8aa2.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/66b0826578525073320c14e6120a8aa2.jpeg" alt=""></a></p><p>事实上，再改用不同的方式，我们还可以生成更多有趣的图案。不过，这里我们就不继续了，因为上面这些做法有点像是灵机一动的小技巧。实际上，我们缺少的并不是小技巧，而是一套统一的方法论。我们希望能够利用它，在着色器里精确地绘制出我们想要的几何图形。</p><h2 id="如何用片元着色器绘制圆、线段和几何图形" tabindex="-1">如何用片元着色器绘制圆、线段和几何图形 <a class="header-anchor" href="#如何用片元着色器绘制圆、线段和几何图形" aria-label="Permalink to &quot;如何用片元着色器绘制圆、线段和几何图形&quot;">​</a></h2><p>那接下来，我们就通过几个例子，把片元着色器精确绘图的方法论给总结出来。</p><h3 id="_1-绘制圆" tabindex="-1">1. 绘制圆 <a class="header-anchor" href="#_1-绘制圆" aria-label="Permalink to &quot;1\\. 绘制圆&quot;">​</a></h3><p>首先，我们从最简单的几何图形，也就是圆开始，来说说片元着色器的绘图过程。</p><p>一般来说，我们画圆的时候是根据点坐标到圆心的距离来生成颜色的。在片元着色器中，我们可以用distance函数求一下vUv和画布中点vec2(0.5)的距离，然后根据这个值设置颜色。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = distance(vUv, vec2(0.5));</span></span>
<span class="line"><span>  gl_FragColor.rgb = d * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过这样的方法，我们最终绘制出了一个模糊的圆，效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/84239f4aaf8f54cdbe93a65e3bfd2d58.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/84239f4aaf8f54cdbe93a65e3bfd2d58.jpeg" alt=""></a></p><p>为什么这个圆是模糊的呢？这是因为越靠近圆心，距离d的值越小， gl_FragColor.rgb = d * vec3(1.0); 的颜色值也就越接近于黑色。</p><p>那如果我们要实现一个更清晰的圆应该怎么做呢？这个时候，你别忘了还有step函数。我们用step函数基于0.2做阶梯，就能得到一个半径为0.2的圆。实现代码和最终效果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = distance(vUv, vec2(0.5));</span></span>
<span class="line"><span>  gl_FragColor.rgb = step(d, 0.2) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/8b3acfbe004038caba9f9c1a1429ae36.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/8b3acfbe004038caba9f9c1a1429ae36.jpeg" alt=""></a></p><p>不过，你会发现我们得到的这个圆的边缘很不光滑。这是因为浮点数计算的精度导致的锯齿现象。为了解决这个问题，我们用smoothstep代替step。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/3f73b8cf75cf0c67cdb7815d0b7051c8.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/3f73b8cf75cf0c67cdb7815d0b7051c8.jpeg" alt=""></a></p><p>为什么smoothstep代替step就可以得到比较光滑的圆呢？这是因为smoothstep和step类似，都是阶梯函数。但是，与step的值是直接跳跃的不同，smoothstep在step-start和step-end之间有一个平滑过渡的区间。因此，用smoothstep绘制的圆，边缘就会有一圈颜色过渡，就能从视觉上消除锯齿。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/52c7484a1e18526e2fca815c4083b5d7.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/52c7484a1e18526e2fca815c4083b5d7.jpeg" alt=""></a></p><p>片元着色器绘制的圆，在构建图像的粒子效果中比较常用。比如，我们可以用它来实现图片的渐显渐隐效果。下面是片元着色器中代码，以及我们最终能够实现的效果图。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>uniform vec2 uResolution;</span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 uv = vUv;</span></span>
<span class="line"><span>    uv.y *= uResolution.y / uResolution.x;</span></span>
<span class="line"><span>    vec2 st = uv * 100.0;</span></span>
<span class="line"><span>    float d = distance(fract(st), vec2(0.5));</span></span>
<span class="line"><span>    float p = uTime + random(floor(st));</span></span>
<span class="line"><span>    float shading = 0.5 + 0.5 * sin(p);</span></span>
<span class="line"><span>    d = smoothstep(d, d + 0.01, 1.0 * shading);</span></span>
<span class="line"><span>    vec4 color = texture2D(tMap, vUv);</span></span>
<span class="line"><span>    gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, d + 1.0 * shading);</span></span>
<span class="line"><span>    gl_FragColor.a = color.a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/a6ffc10e75f217078c68c8dd6a7b4f9d.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/a6ffc10e75f217078c68c8dd6a7b4f9d.gif" alt=""></a></p><h3 id="_2-绘制线" tabindex="-1">2. 绘制线 <a class="header-anchor" href="#_2-绘制线" aria-label="Permalink to &quot;2\\. 绘制线&quot;">​</a></h3><p>利用片元着色器绘制圆的思路，就是根据点到圆心的距离来设置颜色。实际上，我们也可以用同样的原理来绘制线，只不过需要把点到点的距离换成点到直线（向量）的距离。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 line = vec3(1, 1, 0);</span></span>
<span class="line"><span>  float d = abs(cross(vec3(vUv,0), normalize(line)).z);</span></span>
<span class="line"><span>  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>比如，我们利用上面的代码，就能在画布上画出一条斜线。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/618fc882f894386eccdcf4bdea233e7f.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/618fc882f894386eccdcf4bdea233e7f.jpeg" alt=""></a></p><p>如果你还不能一眼看出上面的代码为什么能画出一条直线，说明你对于图形学的向量计算思维还没有完全适应。不过别着急，随着我们练习的增多，你会逐渐适应的。下面，我来解释一下这段代码。</p><p>这里，我们用一个三维向量line来定义一条直线。因为我们要绘制的是2D图形，所以z保持0就行，而x和y用来决定方向。</p><p>然后呢，我们求vUv和line的距离。这里我们直接用向量叉乘的性质就能求得。因为两个二维向量叉积的z轴分量的大小，就是这两个向量组成的平行四边形的面积，那当我们把line的向量归一化之后，这个值就是vUv到直线的距离d了。因为这个d带符号，所以我们还需要取它的绝对值。</p><p>最后，我们用这个d结合前面使用过的smoothstep来控制像素颜色，就能得到一条直线了。</p><h3 id="_3-用鼠标控制直线" tabindex="-1">3. 用鼠标控制直线 <a class="header-anchor" href="#_3-用鼠标控制直线" aria-label="Permalink to &quot;3\\. 用鼠标控制直线&quot;">​</a></h3><p>画出直线之后，我们改变line还可以得到不同的直线。比如，在着色器代码中，我们再添加一个uniform变量uMouse，就可以根据鼠标位置来控制直线方向。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform vec2 uMouse;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 line = vec3(uMouse, 0); // 用向量表示所在直线</span></span>
<span class="line"><span>  float d = abs(cross(vec3(vUv,0), normalize(line)).z); // 叉乘表示平行四边形面积，底边为1，得到距离</span></span>
<span class="line"><span>  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对应地，我们需要在JavaScript中将uMouse通过uniforms传入，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const renderer = new GlRenderer(canvas);</span></span>
<span class="line"><span>const program = renderer.compileSync(fragment, vertex);</span></span>
<span class="line"><span>renderer.useProgram(program);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.uniforms.uMouse = [-1, -1];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>canvas.addEventListener(&#39;mousemove&#39;, (e) =&amp;gt; {</span></span>
<span class="line"><span>  const {x, y, width, height} = e.target.getBoundingClientRect();</span></span>
<span class="line"><span>  renderer.uniforms.uMouse = [</span></span>
<span class="line"><span>    (e.x - x) / width,</span></span>
<span class="line"><span>    1.0 - (e.y - y) / height,</span></span>
<span class="line"><span>  ];</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.setMeshData([{</span></span>
<span class="line"><span>  positions: [</span></span>
<span class="line"><span>    [-1, -1],</span></span>
<span class="line"><span>    [-1, 1],</span></span>
<span class="line"><span>    [1, 1],</span></span>
<span class="line"><span>    [1, -1],</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  attributes: {</span></span>
<span class="line"><span>    uv: [</span></span>
<span class="line"><span>      [0, 0],</span></span>
<span class="line"><span>      [0, 1],</span></span>
<span class="line"><span>      [1, 1],</span></span>
<span class="line"><span>      [1, 0],</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  cells: [[0, 1, 2], [2, 0, 3]],</span></span>
<span class="line"><span>}]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.render();</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/aa095666cfb32167aff86d051b929271.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/aa095666cfb32167aff86d051b929271.gif" alt=""></a></p><p>在上面的例子中，我们的直线是经过原点的。那如果我们想让直线经过任意的定点该怎么办？我们可以加一个uniform变量uOrigin，来表示直线经过的固定点。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform vec2 uMouse;</span></span>
<span class="line"><span>uniform vec2 uOrigin;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 line = vec3(uMouse - uOrigin, 0); // 用向量表示所在直线</span></span>
<span class="line"><span>  float d = abs(cross(vec3(vUv - uOrigin, 0), normalize(line)).z); // 叉乘表示平行四边形面积，底边为1，得到距离</span></span>
<span class="line"><span>  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>延续这个绘制直线的思路，我们很容易就能知道该如何绘制线段了。绘制线段与绘制直线的方法几乎一样，只不过，我们要将计算点到直线的距离修改为计算点到线段的距离。</p><p>但是因为点和线段之间有两种关系，一种是点在线段上，另一种是在线段之外。所以我们在求点到线段的距离d的时候，要分两种情况讨论：当点到线段的投影位于线段两个端点中间的时候，它就等于点到直线的距离；当点到线段的投影在两个端点之外的时候，它就等于这个点到最近一个端点的距离。</p><p>这么说还是比较抽象，我画了一个示意图。你会看到，C1到线段ab的距离就等于它到线段所在直线的距离，C2到线段ab的距离是它到a点的距离，C3到线段的距离是它到b点的距离。那么如何判断究竟是C1、C2、C3中的哪一种情况呢？答案是通过C1到线段ab的投影来判断。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/64cb19cd9fabb219db3d185d3a77922b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/64cb19cd9fabb219db3d185d3a77922b.jpeg" alt=""></a></p><p>所以，我们在原本片元着色器代码的基础上，抽象出一个seg_distance函数，用来返回点到线段的距离。修改后的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform vec2 uMouse;</span></span>
<span class="line"><span>uniform vec2 uOrigin;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float seg_distance(in vec2 st, in vec2 a, in vec2 b) {</span></span>
<span class="line"><span>  vec3 ab = vec3(b - a, 0);</span></span>
<span class="line"><span>  vec3 p = vec3(st - a, 0);</span></span>
<span class="line"><span>  float l = length(ab);</span></span>
<span class="line"><span>  float d = abs(cross(p, normalize(ab)).z);</span></span>
<span class="line"><span>  float proj = dot(p, ab) / l;</span></span>
<span class="line"><span>  if(proj &amp;gt;= 0.0 &amp;&amp; proj &amp;lt;= l) return d;</span></span>
<span class="line"><span>  return min(distance(st, a), distance(st, b));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = seg_distance(vUv, uOrigin, uMouse);</span></span>
<span class="line"><span>  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这么修改之后，如果我们将uOrigin设为vec2(0.5, 0.5)，就会得到如下效果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/b4b5cf71a53c50b95a7e4abbee40d506.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/b4b5cf71a53c50b95a7e4abbee40d506.gif" alt=""></a></p><h3 id="_4-绘制三角形" tabindex="-1">4. 绘制三角形 <a class="header-anchor" href="#_4-绘制三角形" aria-label="Permalink to &quot;4\\. 绘制三角形&quot;">​</a></h3><p>你可能已经发现了，不管是画圆还是画线，我们使用的原理都是求点到点或者是点到线段距离。实际上，这个原理还可以扩展应用到封闭平面图形的绘制上。那我们就以三角形为例，来说说片元着色器的绘制结合图形的方法。</p><p>首先，我们要判断点是否在三角形内部。我们知道，点到三角形三条边的距离有三个，只要这三个距离的符号都相同，我们就能确定点在三角形内。</p><p>然后，我们建立三角形的距离模型。我们规定它的内部距离为负，外部距离为正，并且都选点到三条边的最小距离。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float line_distance(in vec2 st, in vec2 a, in vec2 b) {</span></span>
<span class="line"><span>  vec3 ab = vec3(b - a, 0);</span></span>
<span class="line"><span>  vec3 p = vec3(st - a, 0);</span></span>
<span class="line"><span>  float l = length(ab);</span></span>
<span class="line"><span>  return cross(p, normalize(ab)).z;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float seg_distance(in vec2 st, in vec2 a, in vec2 b) {</span></span>
<span class="line"><span>  vec3 ab = vec3(b - a, 0);</span></span>
<span class="line"><span>  vec3 p = vec3(st - a, 0);</span></span>
<span class="line"><span>  float l = length(ab);</span></span>
<span class="line"><span>  float d = abs(cross(p, normalize(ab)).z);</span></span>
<span class="line"><span>  float proj = dot(p, ab) / l;</span></span>
<span class="line"><span>  if(proj &amp;gt;= 0.0 &amp;&amp; proj &amp;lt;= l) return d;</span></span>
<span class="line"><span>  return min(distance(st, a), distance(st, b));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {</span></span>
<span class="line"><span>  float d1 = line_distance(st, a, b);</span></span>
<span class="line"><span>  float d2 = line_distance(st, b, c);</span></span>
<span class="line"><span>  float d3 = line_distance(st, c, a);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(d1 &amp;gt;= 0.0 &amp;&amp; d2 &amp;gt;= 0.0 &amp;&amp; d3 &amp;gt;= 0.0 || d1 &amp;lt;= 0.0 &amp;&amp; d2 &amp;lt;= 0.0 &amp;&amp; d3 &amp;lt;= 0.0) {</span></span>
<span class="line"><span>    return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部为正</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));</span></span>
<span class="line"><span>  gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，我们就绘制出了一个白色的三角形。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/34ae3dfdca357d9207ea42e02d1f269b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/34ae3dfdca357d9207ea42e02d1f269b.jpeg" alt=""></a></p><p>实际上，三角形的这种画法还可以推广到任意凸多边形。比如，矩形和正多边形就可以使用同样的方式来绘制。</p><h2 id="片元着色器绘图方法论-符号距离场渲染" tabindex="-1">片元着色器绘图方法论：符号距离场渲染 <a class="header-anchor" href="#片元着色器绘图方法论-符号距离场渲染" aria-label="Permalink to &quot;片元着色器绘图方法论：符号距离场渲染&quot;">​</a></h2><p>现在，你应该知道这些基本的线段、圆和几何图形该怎么绘制了。那我们能不能从中总结出一套统一的方法论呢？我们发现，前面绘制的图形虽然各不相同，但是它们的绘制步骤都可以总结为以下两步。</p><p><strong>第一步：定义距离</strong>。这里的距离，是一个人为定义的概念。在画圆的时候，它指的是点到圆心的距离；在画直线和线段的时候，它是指点到直线或某条线段的距离；在画几何图形的时候，它是指点到几何图形边的距离。</p><p><strong>第二步：根据距离着色</strong>。首先是用smoothstep方法，选择某个范围的距离值，比如在画直线的时候，我们设置smoothstep(0.0, 0.01, d)，就表示选取距离为0.0到0.01的值。然后对这个范围着色，我们就可以将图形的边界绘制出来了。</p><p>延续这个思路，我们还可以选择距离在0.0~0.01范围以外的点。下面，我们做一个小实验。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 line = vec3(1, 1, 0);</span></span>
<span class="line"><span>  float d = abs(cross(vec3(vUv,0), normalize(line)).z);</span></span>
<span class="line"><span>  gl_FragColor.rgb = (smoothstep(0.195, 0.2, d) - smoothstep(0.2, 0.205, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们用之前绘制直线的代码，将 gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0) 修改为 gl_FragColor.rgb = (smoothstep(0.195, 0.2, d) - smoothstep(0.2, 0.205, d)) * vec3(1.0)，我们看到输出的结果变成对称的两条直线了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/dcfb68cb31eae8c8f99dbc663a207dc9.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/dcfb68cb31eae8c8f99dbc663a207dc9.jpeg" alt=""></a></p><p>这是为什么呢？因为我们是对距离原直线0.2处的点进行的着色，那实际上距离0.2的点有两条线，所以就能绘制出两条直线了。我把它的原理画了一个示意图，你可以看看，其中红线是原直线。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/ba296d4490d0a0c699f6ecc739e003e5.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/ba296d4490d0a0c699f6ecc739e003e5.jpeg" alt=""></a></p><p>利用这个思路，再加上使用乘法和fract函数重复绘制的原理，我们就可以绘制多条平行线了。比如通过下面的代码，我们可以绘制出均匀的平面分割线。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 line = vec3(1, 1, 0);</span></span>
<span class="line"><span>  float d = abs(cross(vec3(vUv,0), normalize(line)).z);</span></span>
<span class="line"><span>  d = fract(20.0 * d);</span></span>
<span class="line"><span>  gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/2ac38ebaf3699b4d1edebf4eecc19b28.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/2ac38ebaf3699b4d1edebf4eecc19b28.jpeg" alt=""></a></p><p>利用同样的办法，我们还可以绘制圆环或者三角环或者其他图形的环。因为原理相同，下面我就直接给你展示代码和效果了。</p><p>首先是绘制圆环的代码和效果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = distance(vUv, vec2(0.5));</span></span>
<span class="line"><span>  d = fract(20.0 * d);</span></span>
<span class="line"><span>  gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/04b066db1e7b9ea0003df73e64fcbf49.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/04b066db1e7b9ea0003df73e64fcbf49.jpeg" alt=""></a></p><p>然后是绘制三角环的代码和效果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float line_distance(in vec2 st, in vec2 a, in vec2 b) {</span></span>
<span class="line"><span>  vec3 ab = vec3(b - a, 0);</span></span>
<span class="line"><span>  vec3 p = vec3(st - a, 0);</span></span>
<span class="line"><span>  float l = length(ab);</span></span>
<span class="line"><span>  return cross(p, normalize(ab)).z;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float seg_distance(in vec2 st, in vec2 a, in vec2 b) {</span></span>
<span class="line"><span>  vec3 ab = vec3(b - a, 0);</span></span>
<span class="line"><span>  vec3 p = vec3(st - a, 0);</span></span>
<span class="line"><span>  float l = length(ab);</span></span>
<span class="line"><span>  float d = abs(cross(p, normalize(ab)).z);</span></span>
<span class="line"><span>  float proj = dot(p, ab) / l;</span></span>
<span class="line"><span>  if(proj &amp;gt;= 0.0 &amp;&amp; proj &amp;lt;= l) return d;</span></span>
<span class="line"><span>  return min(distance(st, a), distance(st, b));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {</span></span>
<span class="line"><span>  float d1 = line_distance(st, a, b);</span></span>
<span class="line"><span>  float d2 = line_distance(st, b, c);</span></span>
<span class="line"><span>  float d3 = line_distance(st, c, a);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(d1 &amp;gt;= 0.0 &amp;&amp; d2 &amp;gt;= 0.0 &amp;&amp; d3 &amp;gt;= 0.0 || d1 &amp;lt;= 0.0 &amp;&amp; d2 &amp;lt;= 0.0 &amp;&amp; d3 &amp;lt;= 0.0) {</span></span>
<span class="line"><span>    return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部为正</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));</span></span>
<span class="line"><span>  d = fract(20.0 * abs(d));</span></span>
<span class="line"><span>  gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/c682ed12d9f148261d8ba076209eb90f.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/c682ed12d9f148261d8ba076209eb90f.jpeg" alt=""></a></p><p>实际上，上面这种绘制图形和环的方式，在图形渲染中有一个专有的名称叫做 <strong>符号距离场渲染</strong>（Signed Distance Fields Rendering）。它本质上就是利用空间中的距离分布来着色的。我们把上面的三角环代码换一种渲染方式，你就能看得更清楚一些了。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>  float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));</span></span>
<span class="line"><span>  d = fract(20.0 * abs(d));</span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(d);</span></span>
<span class="line"><span>  // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们在渲染的时候，还可以把main函数中原来的smoothstep渲染方式注释掉，直接用vec3(d)来渲染颜色，就会得到的如下的效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/3eaf4531819d34a61e9ea5aacef4cd84.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/3eaf4531819d34a61e9ea5aacef4cd84.jpeg" alt=""></a></p><p>你能看到，这里的每一环，两两之间的距离是沿着法线方向从0到1的，所以颜色从黑色过渡到白色，这就是三角环的距离场分布。相同颜色值的环线就是距离场的等距线，我们用step或smoothstep的方式将某些等距线的颜色设置为白色，其他位置颜色设置为黑色，就绘制出之前的环线效果来了。</p><h2 id="着色器绘制几何图形的用途" tabindex="-1">着色器绘制几何图形的用途 <a class="header-anchor" href="#着色器绘制几何图形的用途" aria-label="Permalink to &quot;着色器绘制几何图形的用途&quot;">​</a></h2><p>讨论到这里，你一定有些疑惑，我们学习这些片元着色器的绘图方式，究竟有什么实际用途呢？实际上它的用途还是挺广泛的，在这里我想先简单举几个实际的应用案例，你可以先感受一下。</p><p>不过，在讲具体案例之前，我还想多啰嗦几句。着色器造型是着色器的一种非常基础的使用方法，甚至可以说是图形学中着色器渲染最基础的原理，就好比代数的基础是四则运算一样，它构成了GPU视觉渲染的基石，我们在视觉呈现中生成的各种细节特效的方法，万变不离其宗，基本上都和着色器造型有关。</p><p>所以呢，我希望你不仅仅要了解它的用途，更要彻底弄明白它的原理和思路，尤其是非常重要的符号距离场渲染技巧，一定要理解并熟练掌握。关于着色器造型的更多、更复杂的应用场景，我们在后续的课程中还会遇到。明白了这一点，我们接着来看三个简单的案例吧。</p><p>首先，我们可以用着色器造型实现图像的剪裁。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec4 color = texture2D(tMap, vUv);</span></span>
<span class="line"><span>  vec2 uv = vUv - vec2(0.5);</span></span>
<span class="line"><span>  vec2 a = vec2(-0.577, 0) - vec2(0.5);</span></span>
<span class="line"><span>  vec2 b = vec2(0.5, 1.866) - vec2(0.5);</span></span>
<span class="line"><span>  vec2 c = vec2(1.577, 0) - vec2(0.5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  float scale = min(1.0, 0.0005 * uTime);</span></span>
<span class="line"><span>    float d = triangle_distance(uv, scale * a, scale * b, scale * c);</span></span>
<span class="line"><span>    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * color.rgb;</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>利用上面的代码，我们对图像进行三角形剪裁，可以实现的效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/877b37250d0e2da82b3e72fcd83b3754.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/877b37250d0e2da82b3e72fcd83b3754.gif" alt=""></a></p><p>其次，我们可以实现对图像的动态修饰，比如类似下面这种进度条。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tMap;</span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec4 color = texture2D(tMap, vUv);</span></span>
<span class="line"><span>  vec2 uv = vUv - vec2(0.5);</span></span>
<span class="line"><span>  vec2 a = vec2(0, 1);</span></span>
<span class="line"><span>  float time = 0.0005 * uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec2 b = vec2(sin(time), cos(time));</span></span>
<span class="line"><span>  float d = 0.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  float c0 = cross(vec3(b, 0.0), vec3(a, 0.0)).z;</span></span>
<span class="line"><span>  float c1 = cross(vec3(uv, 0.0), vec3(a, 0.0)).z;</span></span>
<span class="line"><span>  float c2 = cross(vec3(uv, 0.0), vec3(b, 0.0)).z;</span></span>
<span class="line"><span>  if(c0 &amp;gt; 0.0 &amp;&amp; c1 &amp;gt; 0.0 &amp;&amp; c2 &amp;lt; 0.0) {</span></span>
<span class="line"><span>    d = 1.0;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(c0 &amp;lt; 0.0 &amp;&amp; (c1 &amp;gt;= 0.0 || c2 &amp;lt;= 0.0)) {</span></span>
<span class="line"><span>    d = 1.0;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  gl_FragColor.rgb = color.rgb;</span></span>
<span class="line"><span>  gl_FragColor.r *= mix(0.3, 1.0, d);</span></span>
<span class="line"><span>  gl_FragColor.a = mix(0.9, 1.0, d);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/f07b6c187786c59029ab626c5b605254.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/f07b6c187786c59029ab626c5b605254.gif" alt=""></a></p><p>第三，我们还可以在一些3D场景中修饰几何体，比如像这样给一个球体套一个外壳，这个例子的代码我就不贴出来了，在后续3D课程中我们再详细来说。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/4f65c00dd8fa1a58bf7128a987d31109.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/265376/4f65c00dd8fa1a58bf7128a987d31109.gif" alt=""></a></p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这一节课，我们学习了使用片元着色器进行几何造型的2种常用方法。</p><p>首先，用片元着色器可以通过控制局部颜色来绘制图案，比如根据像素坐标来控制颜色变化，然后利用重复绘制的技巧，形成有趣的图案花纹。</p><p>其次，我们可以定义并计算像素坐标的距离，然后根据距离来填充颜色，这种方法实际上叫做符号距离场渲染，是着色器造型生成图案的基础方法。通过这种方法我们可以绘制圆、直线、线段、三角形以及其他图形。</p><p>使用着色器绘制几何图形是WebGL常用的方式，它有许多用途，比如可以剪裁图像、显示进度条、实现外壳纹路等等，因此在可视化中有许多使用场景。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>这一节课我们介绍了圆、直线、线段和三角形的基本画法，其他图形也可以用t方法来绘制。试着用同样的思路来绘制正方形、正六角星、椭圆吧！</p><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课再见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/shaping-functions" target="_blank" rel="noreferrer">本节课完整代码.</a></p>`,118)])])}const b=a(i,[["render",l]]);export{h as __pageData,b as default};
