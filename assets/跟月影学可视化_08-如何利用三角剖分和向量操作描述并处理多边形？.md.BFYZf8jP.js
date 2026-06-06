import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"08 | 如何利用三角剖分和向量操作描述并处理多边形？","description":"","frontmatter":{},"headers":[{"level":2,"title":"图形学中的多边形是什么？","slug":"图形学中的多边形是什么","link":"#图形学中的多边形是什么","children":[]},{"level":2,"title":"不同的图形系统如何填充多边形？","slug":"不同的图形系统如何填充多边形","link":"#不同的图形系统如何填充多边形","children":[{"level":3,"title":"1. Canvas2D如何填充多边形？","slug":"_1-canvas2d如何填充多边形","link":"#_1-canvas2d如何填充多边形","children":[]},{"level":3,"title":"2. WebGL如何填充多边形？","slug":"_2-webgl如何填充多边形","link":"#_2-webgl如何填充多边形","children":[]}]},{"level":2,"title":"如何判断点在多边形内部？","slug":"如何判断点在多边形内部","link":"#如何判断点在多边形内部","children":[{"level":3,"title":"1. Canvas2D如何判断点在多边形内部？","slug":"_1-canvas2d如何判断点在多边形内部","link":"#_1-canvas2d如何判断点在多边形内部","children":[]},{"level":3,"title":"2. 实现通用的isPointInPath方法","slug":"_2-实现通用的ispointinpath方法","link":"#_2-实现通用的ispointinpath方法","children":[]}]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/08-如何利用三角剖分和向量操作描述并处理多边形？.md","filePath":"跟月影学可视化/08-如何利用三角剖分和向量操作描述并处理多边形？.md","lastUpdated":1779822292000}'),t={name:"跟月影学可视化/08-如何利用三角剖分和向量操作描述并处理多边形？.md"};function i(l,s,c,o,r,h){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_08-如何利用三角剖分和向量操作描述并处理多边形" tabindex="-1">08 | 如何利用三角剖分和向量操作描述并处理多边形？ <a class="header-anchor" href="#_08-如何利用三角剖分和向量操作描述并处理多边形" aria-label="Permalink to &quot;08 | 如何利用三角剖分和向量操作描述并处理多边形？&quot;">​</a></h1><p>你好，我是月影。</p><p>在图形系统中，我们最终看到的丰富多彩的图像，都是由多边形构成的。换句话说，不论是2D图形还是3D图形，经过投影变换后，在屏幕上输出的都是多边形。因此，理解多边形的基本性质，了解用数学语言描述并且处理多边形的方法，是我们在可视化中必须要掌握的内容。</p><p>那今天，我们就来说说，不同的图形系统是如何用数学语言描述并处理多边形。首先，我们来说说图形学中的多边形是什么。</p><h2 id="图形学中的多边形是什么" tabindex="-1">图形学中的多边形是什么？ <a class="header-anchor" href="#图形学中的多边形是什么" aria-label="Permalink to &quot;图形学中的多边形是什么？&quot;">​</a></h2><p>多边形可以定义为由三条或三条以上的线段首尾连接构成的平面图形，其中，每条线段的端点就是多边形的顶点，线段就是多边形的边。</p><p>多边形又可以分为 <strong>简单多边形</strong> 和 <strong>复杂多边形</strong>。我们该怎么区分它们呢？如果一个多边形的每条边除了相邻的边以外，不和其他边相交，那它就是简单多边形，否则就是复杂多边形。一般来说，我们在绘图时，要尽量构建简单多边形，因为简单多边形的图形性质比较简单，绘制起来比较方便。</p><p>而简单多边形又分为凸多边形和凹多边形，我们主要是看简单多边形的内角来区分的。如果一个多边形中的每个内角都不超过180°，那它就是凸多边形，否则就是凹多边形。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/74c812ef3a15f5f20d7a5bbaff30794a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/74c812ef3a15f5f20d7a5bbaff30794a.jpg" alt=""></a></p><p>在图形系统中绘制多边形的时候，最常用的功能是填充多边形，也就是用一种颜色将多边形的内部填满。除此之外，在可视化中用户经常要用鼠标与多边形进行交互，这就要涉及多边形的边界判定。所以今天，我们就来重点讨论 <strong>多边形的填充和边界判定</strong>。首先，我们来看多边形的填充。</p><h2 id="不同的图形系统如何填充多边形" tabindex="-1">不同的图形系统如何填充多边形？ <a class="header-anchor" href="#不同的图形系统如何填充多边形" aria-label="Permalink to &quot;不同的图形系统如何填充多边形？&quot;">​</a></h2><p>不同的图形系统会用不同的方法来填充多边形。比如说，在SVG和Canvas2D中，就都内置了填充多边形的API。在SVG中，我们可以直接给元素设置fill属性来填充，那在Canvas2D中，我们可以在绘图指令结束时调用fill()方法进行填充。而在WebGL中，我们是用三角形图元来快速填充的。由于SVG和Canvas2D中的填充方法类似，因此今天，我们就主要说说Canvas2D和WebGL是怎么填充多边形的。</p><h3 id="_1-canvas2d如何填充多边形" tabindex="-1">1. Canvas2D如何填充多边形？ <a class="header-anchor" href="#_1-canvas2d如何填充多边形" aria-label="Permalink to &quot;1\\. Canvas2D如何填充多边形？&quot;">​</a></h3><p>我们先来说说Canvas2D填充多边形的具体方法，可以总结为五步。</p><p>第一步，构建多边形的顶点。这里我们直接构造5个顶点，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const points = [new Vector2D(0, 100)];</span></span>
<span class="line"><span>for(let i = 1; i &amp;lt;= 4; i++) {</span></span>
<span class="line"><span>  const p = points[0].copy().rotate(i * Math.PI * 0.4);</span></span>
<span class="line"><span>  points.push(p);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二步，绘制多边形。我们要用这5个顶点分别绘制正五边形和正五角星。显然前者是简单多边形，后者是复杂多边形。那在Canvas中，只需将顶点构造出来，我们就可以通过API绘制出多边形了。具体绘制代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const polygon = [</span></span>
<span class="line"><span>  ...points,</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 绘制正五边形</span></span>
<span class="line"><span>ctx.save();</span></span>
<span class="line"><span>ctx.translate(-128, 0);</span></span>
<span class="line"><span>draw(ctx, polygon);</span></span>
<span class="line"><span>ctx.restore();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const stars = [</span></span>
<span class="line"><span>  points[0],</span></span>
<span class="line"><span>  points[2],</span></span>
<span class="line"><span>  points[4],</span></span>
<span class="line"><span>  points[1],</span></span>
<span class="line"><span>  points[3],</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 绘制正五角星</span></span>
<span class="line"><span>ctx.save();</span></span>
<span class="line"><span>ctx.translate(128, 0);</span></span>
<span class="line"><span>draw(ctx, stars);</span></span>
<span class="line"><span>ctx.restore();</span></span></code></pre></div><p>如上面代码所示，我们用计算出的5个顶点创建polygon数组和stars数组。其中，polygon数组是正五边形的顶点数组。stars数组是我们把正五边形的顶点顺序交换之后，构成的五角星的顶点数组。</p><p>接着，我们将这些点传给draw函数，在draw函数中完成具体的绘制。在draw函数中绘制过程的时候，我们是调用context.fill来完成填充的。</p><p>这里，我要补充一点，不管是简单多边形还是复杂多边形，Canvas2D的fill都能正常填充。并且，Canvas2D的fill还支持两种填充规则。其中，默认的规则是“nonzero”，也就是说 不管有没有相交的边，只要是由边围起来的区域都一律填充。在下面的代码中，我们就是用“nonzero”规则来填充的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function draw(context, points, {</span></span>
<span class="line"><span>  fillStyle = &#39;black&#39;,</span></span>
<span class="line"><span>  close = false,</span></span>
<span class="line"><span>  rule = &#39;nonzero&#39;,</span></span>
<span class="line"><span>} = {}) {</span></span>
<span class="line"><span>  context.beginPath();</span></span>
<span class="line"><span>  context.moveTo(...points[0]);</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; points.length; i++) {</span></span>
<span class="line"><span>    context.lineTo(...points[i]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(close) context.closePath();</span></span>
<span class="line"><span>  context.fillStyle = fillStyle;</span></span>
<span class="line"><span>  context.fill(rule);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们最终绘制出的效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/371e3b8d3f484b13aa13f6e8ce60ec96.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/371e3b8d3f484b13aa13f6e8ce60ec96.jpeg" alt=""></a></p><p>除了“nonzero”，还有一种规则叫做“evenodd”，它是根据重叠区域是奇数还是偶数来判断是否填充的。那当我们增加了draw方法的参数，将五角星的填充规则改成“evenodd”之后，简单多边形没有变化，而复杂多边形由于绘制区域存在重叠，就出导致图形中心有了空洞的特殊效果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>draw(ctx, stars, {rule: &#39;evenodd&#39;});</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/81e56244233ebec7e0cc50a661d2cf44.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/81e56244233ebec7e0cc50a661d2cf44.jpeg" alt=""></a></p><p>总之，Canvas2D的fill非常实用，它可以自动填充多边形内部的区域，并且对于任何多边形都能判定和填充，你可以自己去尝试一下。</p><h3 id="_2-webgl如何填充多边形" tabindex="-1">2. WebGL如何填充多边形？ <a class="header-anchor" href="#_2-webgl如何填充多边形" aria-label="Permalink to &quot;2\\. WebGL如何填充多边形？&quot;">​</a></h3><p>在WebGL中，虽然没有提供自动填充多边形的方法，但是我们可以用三角形这种基本图元来快速地填充多边形。因此，在WebGL中填充多边形的第一步，就是将多边形分割成多个三角形。</p><p>这种将多边形分割成若干个三角形的操作，在图形学中叫做 <strong>三角剖分</strong>（Triangulation）。</p><p><a href="http://wikipedia.org" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/619872b8789bfaeb5fc2c1f0381d52dd.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/619872b8789bfaeb5fc2c1f0381d52dd.jpeg" alt=""></a></a></p><p>三角剖分是图形学和代数拓扑学中一个非常重要的基本操作，也有很多不同的实现算法。对简单多边形尤其是凸多边形的三角剖分比较简单，而复杂多边形由于有边的相交和面积重叠区域，所以相对困难许多。</p><p>那因为这些算法讲解起来比较复杂，还会涉及很多图形学的底层数学知识，你可能很难理解，所以我就不详细说三角剖分的具体算法了。如果你有兴趣学习，可以自己花一点时间去看一些 <a href="http://www.ae.metu.edu.tr/tuncer/ae546/prj/delaunay/" target="_blank" rel="noreferrer">参考资料</a>。</p><p>这里，我们就直接利用GitHub上的一些成熟的库（常用的如 <a href="https://github.com/mapbox/earcut" target="_blank" rel="noreferrer">Earcut</a>、 <a href="https://github.com/memononen/tess2.js" target="_blank" rel="noreferrer">Tess2.js</a> 以及 <a href="https://github.com/mikolalysenko/cdt2d" target="_blank" rel="noreferrer">cdt2d</a>），来对多边形进行三角剖分就可以了。具体怎么做呢？接下来，我们就以最简单的Earcut库为例，来说一说WebGL填充多边形的过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/28716416aa8c00743843ae208089c99c.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/28716416aa8c00743843ae208089c99c.jpeg" alt=""></a></p><p>假设，我们要填充一个如上图所示的不规则多边形，它的顶点数据如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const vertices = [</span></span>
<span class="line"><span>  [-0.7, 0.5],</span></span>
<span class="line"><span>  [-0.4, 0.3],</span></span>
<span class="line"><span>  [-0.25, 0.71],</span></span>
<span class="line"><span>  [-0.1, 0.56],</span></span>
<span class="line"><span>  [-0.1, 0.13],</span></span>
<span class="line"><span>  [0.4, 0.21],</span></span>
<span class="line"><span>  [0, -0.6],</span></span>
<span class="line"><span>  [-0.3, -0.3],</span></span>
<span class="line"><span>  [-0.6, -0.3],</span></span>
<span class="line"><span>  [-0.45, 0.0],</span></span>
<span class="line"><span>];</span></span></code></pre></div><p>首先，我们要对它进行三角剖分。使用Earcut库的操作很简单，我们直接调用它的API就可以完成对多边形的三角剖分，具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {earcut} from &#39;../common/lib/earcut.js&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const points = vertices.flat();</span></span>
<span class="line"><span>const triangles = earcut(points);</span></span></code></pre></div><p>因为Earcut库只接受扁平化的定点数据，所以我们先用了数组的flat方法将顶点扁平化，然后将它传给Earcut进行三角剖分。这样返回的结果是一个数组，这个数组的值是顶点数据的index，结果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> [1, 0, 9, 9, 8, 7, 7, 6, 5, 4, 3, 2, 2, 1, 9, 9, 7, 5, 4, 2, 9, 9, 5, 4]</span></span></code></pre></div><p>这里的值，比如1表示vertices中下标为1的顶点，即点(-0.4, 0.3)，每三个值可以构成一个三角形，所以1、0、9表示由(-0.4, 0.3)、(-0.7, 0.5)和(-0.45, 0.0) 构成的三角形。</p><p>然后，我们将顶点和index下标数据都输入到缓冲区，通过gl.drawElements方法就可以把图形显示出来。具体的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const position = new Float32Array(points);</span></span>
<span class="line"><span>const cells = new Uint16Array(triangles);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const pointBuffer = gl.createBuffer();</span></span>
<span class="line"><span>gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);</span></span>
<span class="line"><span>gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const vPosition = gl.getAttribLocation(program, &#39;position&#39;);</span></span>
<span class="line"><span>gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);</span></span>
<span class="line"><span>gl.enableVertexAttribArray(vPosition);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const cellsBuffer = gl.createBuffer();</span></span>
<span class="line"><span>gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer);</span></span>
<span class="line"><span>gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>gl.clear(gl.COLOR_BUFFER_BIT);</span></span>
<span class="line"><span>gl.drawElements(gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0);</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/614e29911f76757a56159ca2d080a526.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/614e29911f76757a56159ca2d080a526.jpeg" alt=""></a></p><p>你会发现，通过上面的步骤，整个多边形都被WebGL渲染并填充为了红色。这么一看，好像三角剖分并没有什么作用。但实际上，WebGL是对这个多边形三角剖分后的每个三角形分别进行填充的。为了让你看得更清楚，我们用描边代替填充，具体操作就是，修改一下gl.drawElements的渲染模式，将gl.TRIANGLES改成gl.LINE_STRIP。这样，我们就可以清晰地看出，经过Earcut处理的这个多边形被分割成了8个三角形。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/549f33d96886fa2bf04f92d30f9ea972.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/549f33d96886fa2bf04f92d30f9ea972.jpeg" alt=""></a></p><p>到这里，我们就讲完了2D图形的三角剖分。那针对3D模型，WebGL在绘制的时候，也需要使用三角剖分，而3D的三角剖分又被称为 <strong>网格化</strong>（Meshing）。</p><p>不过，因为3D模型比2D模型更加复杂，顶点的数量更多，所以针对复杂的3D模型，我们一般不在运行的时候进行三角剖分，而是通过设计工具把图形的三角剖分结果直接导出进行使用。也就是说，在3D渲染的时候，我们一般使用的模型数据都是已经经过三角剖分以后的顶点数据。</p><p>那如果必须要在可视化项目中实时创建一些几何体的时候，我们该怎么办呢？这部分内容，我们会在视觉篇详细来讲，不过在那之前呢，你也可以自己先想想。</p><p>总的来说，无论是绘制2D还是3D图形，WebGL都需要先把它们进行三角剖分，然后才能绘制。因此，三角剖分是WebGL绘图的基础。</p><h2 id="如何判断点在多边形内部" tabindex="-1">如何判断点在多边形内部？ <a class="header-anchor" href="#如何判断点在多边形内部" aria-label="Permalink to &quot;如何判断点在多边形内部？&quot;">​</a></h2><p>接下来，我们通过一个简单的例子来说说多边形的交互。这个例子要实现的效果其实就是，当用户的鼠标移动到某一个图形上时，我们要让这个图形变色。在这个例子中，我们要解决的核心问题是：判定鼠标所在位置是否在多边形的内部。</p><p>那么问题来了，不同的图形系统都是如何判断点在多边形内部的呢？</p><p>在SVG这样的图形系统里，由于多边形本身就是一个元素节点，因此我们直接通过DOM API就可以判定鼠标是否在该元素上。而对于Canvas2D，我们不能直接通过DOM API判定，而是要通过Canvas2D提供的isPointInPath方法来判定。所以下面，我们就以多边形c为例，来详细说说这个过程。</p><h3 id="_1-canvas2d如何判断点在多边形内部" tabindex="-1">1. Canvas2D如何判断点在多边形内部？ <a class="header-anchor" href="#_1-canvas2d如何判断点在多边形内部" aria-label="Permalink to &quot;1\\. Canvas2D如何判断点在多边形内部？&quot;">​</a></h3><p>首先，我们先改用Canvas2D来绘制并填充这个多边形。</p><p>然后，我们在canvas上添加mousemove事件，在事件中计算鼠标相对于canvas的位置，再将这个位置传给isPointInPath方法，isPointInPath方法就会自动判断这个位置是否位于图形内部。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const {left, top} = canvas.getBoundingClientRect();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>canvas.addEventListener(&#39;mousemove&#39;, (evt) =&amp;gt; {</span></span>
<span class="line"><span>  const {x, y} = evt;</span></span>
<span class="line"><span>  // 坐标转换</span></span>
<span class="line"><span>  const offsetX = x - left;</span></span>
<span class="line"><span>  const offsetY = y - top;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ctx.clearRect(-256, -256, 512, 512);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(ctx.isPointInPath(offsetX, offsetY)) {</span></span>
<span class="line"><span>    draw(ctx, poitions, &#39;transparent&#39;, &#39;green&#39;);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    draw(ctx, poitions, &#39;transparent&#39;, &#39;red&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>最后，上面代码运行效果如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/4f370d3187e964efc733294a3ed2de97.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/4f370d3187e964efc733294a3ed2de97.gif" alt=""></a></p><p>这个运行结果是没有问题的，但isPointInPath这个方法实际上并不好用。因为isPointInPath方法只能对当前绘制的图形生效。这是什么意思呢？我来举个例子。</p><p>假设，我们要在Canvas中绘制多边形c和小三角形。那我们先绘制多边形c，再绘制小三角形。绘制代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>draw(ctx, poitions, &#39;transparent&#39;, &#39;red&#39;);</span></span>
<span class="line"><span>draw(ctx, [[100, 100], [100, 200], [150, 200]], &#39;transparent&#39;, &#39;blue&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const {left, top} = canvas.getBoundingClientRect();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>canvas.addEventListener(&#39;mousemove&#39;, (evt) =&amp;gt; {</span></span>
<span class="line"><span>  const {x, y} = evt;</span></span>
<span class="line"><span>  // 坐标转换</span></span>
<span class="line"><span>  const offsetX = x - left;</span></span>
<span class="line"><span>  const offsetY = y - top;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ctx.clearRect(-256, -256, 512, 512);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 判断 offsetX、offsetY 的坐标是否在多边形内部</span></span>
<span class="line"><span>  if(ctx.isPointInPath(offsetX, offsetY)) {</span></span>
<span class="line"><span>    draw(ctx, poitions, &#39;transparent&#39;, &#39;green&#39;);</span></span>
<span class="line"><span>    draw(ctx, [[100, 100], [100, 200], [150, 200]], &#39;transparent&#39;, &#39;orange&#39;);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    draw(ctx, poitions, &#39;transparent&#39;, &#39;red&#39;);</span></span>
<span class="line"><span>    draw(ctx, [[100, 100], [100, 200], [150, 200]], &#39;transparent&#39;, &#39;blue&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>这里，我们还通过isPointInPath方法判断点的位置，这样得到的结果如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/5e566597db9519bcb0fdc09ce6390e3e.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/5e566597db9519bcb0fdc09ce6390e3e.gif" alt=""></a></p><p>你会看到，当我们将鼠标移动到中间大图时，它的颜色并没有发生变化，只有移动到右上角的小三角形时，这两个图形才会同时变色。这就是因为，isPointInPath仅能判断鼠标是否在最后一次绘制的小三角形内，所以大多边形就没有被识别出来。</p><p>要解决这个问题，一个最简单的办法就是，我们自己实现一个isPointInPath方法。然后在这个方法里，重新创建一个Canvas对象，并且再绘制一遍多边形c和小三角形。这个方法的核心，其实就是在绘制的过程中获取每个图形的isPointInPath结果。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function isPointInPath(ctx, x, y) {</span></span>
<span class="line"><span>  // 我们根据ctx重新clone一个新的canvas对象出来</span></span>
<span class="line"><span>  const cloned = ctx.canvas.cloneNode().getContext(&#39;2d&#39;);</span></span>
<span class="line"><span>  cloned.translate(0.5 * width, 0.5 * height);</span></span>
<span class="line"><span>  cloned.scale(1, -1);</span></span>
<span class="line"><span>  let ret = false;</span></span>
<span class="line"><span>  // 绘制多边形c，然后判断点是否在图形内部</span></span>
<span class="line"><span>  draw(cloned, poitions, &#39;transparent&#39;, &#39;red&#39;);</span></span>
<span class="line"><span>  ret |= cloned.isPointInPath(x, y);</span></span>
<span class="line"><span>  if(!ret) {</span></span>
<span class="line"><span>    // 如果不在，在绘制小三角形，然后判断点是否在图形内部</span></span>
<span class="line"><span>    draw(cloned, [[100, 100], [100, 200], [150, 200]], &#39;transparent&#39;, &#39;blue&#39;);</span></span>
<span class="line"><span>    ret |= cloned.isPointInPath(x, y);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是，这个方法并不通用。因为一旦我们修改了绘图过程，也就是增加或者减少了绘制的图形，isPointInPath方法也要跟着改变。当然，我们也有办法进行优化，比如将每一个几何图形的绘制封装起来，针对每个图形提供单独的isPointInPath判断，但是这样也很麻烦，而且有很多无谓的Canvas绘图操作，性能会很差。</p><h3 id="_2-实现通用的ispointinpath方法" tabindex="-1">2. 实现通用的isPointInPath方法 <a class="header-anchor" href="#_2-实现通用的ispointinpath方法" aria-label="Permalink to &quot;2\\. 实现通用的isPointInPath方法&quot;">​</a></h3><p>那一个更好的办法是，我们不使用Canvas的isPointInPath方法，而是直接通过点与几何图形的数学关系来判断点是否在图形内。但是，直接判断一个点是不是在一个几何图形内还是比较困难的，因为这个几何图形可能是简单多边形，也可能是复杂多边形。</p><p>这个时候，我们完全可以把视线放在最简单的多边形，也就是三角形上。因为对于三角形来说，我们有一个非常简单的方法可以判断点是否在其中。</p><p>这个方法就是，已知一个三角形的三条边分别是向量a、b、c，平面上一点u连接三角形三个顶点的向量分别为u1、u2、u3，那么u点在三角形内部的充分必要条件是：u1 X a、u2 X b、u3 X c 的符号相同。</p><p>你也可以看我下面给出的示意图，当点u在三角形a、b、c内时，因为u1到a、u2到b、u3到c的小角旋转方向是相同的（这里都为顺时针），所以u1 X a、u2 X b、u3 X c要么同正，要么同负。当点v在三角形外时，v1到a方向是顺时针，v2到b方向是逆时针，v3到c方向又是顺时针，所以它们叉乘的结果符号并不相同。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/3402b08454dbc39f9543cb4c597419c3.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/3402b08454dbc39f9543cb4c597419c3.jpg" alt=""></a></p><p>根据这个原理，我们就可以写一个简单的判定函数了，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function inTriangle(p1, p2, p3, point) {</span></span>
<span class="line"><span>  const a = p2.copy().sub(p1);</span></span>
<span class="line"><span>  const b = p3.copy().sub(p2);</span></span>
<span class="line"><span>  const c = p1.copy().sub(p3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const u1 = point.copy().sub(p1);</span></span>
<span class="line"><span>  const u2 = point.copy().sub(p2);</span></span>
<span class="line"><span>  const u3 = point.copy().sub(p3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const s1 = Math.sign(a.cross(u1));</span></span>
<span class="line"><span>  const s2 = Math.sign(b.cross(u2));</span></span>
<span class="line"><span>  const s3 = Math.sign(c.cross(u3));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return s1 === s2 &amp;&amp; s2 === s3;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你以为到这里就结束了吗？还没有。上面的代码还有个Bug，它虽然可以判定点在三角形内部，但却不能判定点恰好在三角形某条边上的情况。这又该如何优化呢？</p><p>在学习了向量乘法之后，我们知道。如果一个点u在三角形的一条边a上，那就会需要满足以下2个条件：</p><ol><li>a.cross(u1) === 0</li><li>0 &lt;= a.dot(u1) / a.length ** 2 &lt;= 1</li></ol><p>第一个条件很容易理解，我就不细说了，我们重点来看第二个条件。下面，我就分别讨论一下点u和a在一条直线上和不在一条直线上这两种情况。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/ca37834a201b3d704fe40ef3955b608e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/258101/ca37834a201b3d704fe40ef3955b608e.jpg" alt=""></a></p><p>当向量u1与a不在一条直线上时，u1与a的叉乘结果不为0，而u1与a的点乘的值除以a的长度，相当于u1在a上的投影。</p><p>当向量u1与a在一条直线上时，u1与a的叉乘结果为0，u1与a的点乘结果除以a的长度的平方，正好是u1与a的比值。</p><p>u1与a的比值也有三种情况：当u1在a上时，u1和a比值是介于0到1之间的；当u1在a的左边时，这个比值是小于0的；当u1在a的右边时，这个比值是大于1的。</p><p>因此，只有当u1和a的比值在0到1之间时，才能说明点在三角形的边上。</p><p>好了，那接下来，我们可以根据得到的结果修改一下代码。我们最终的判断逻辑如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function inTriangle(p1, p2, p3, point) {</span></span>
<span class="line"><span>  const a = p2.copy().sub(p1);</span></span>
<span class="line"><span>  const b = p3.copy().sub(p2);</span></span>
<span class="line"><span>  const c = p1.copy().sub(p3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const u1 = point.copy().sub(p1);</span></span>
<span class="line"><span>  const u2 = point.copy().sub(p2);</span></span>
<span class="line"><span>  const u3 = point.copy().sub(p3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const s1 = Math.sign(a.cross(u1));</span></span>
<span class="line"><span>  let p = a.dot(u1) / a.length ** 2;</span></span>
<span class="line"><span>  if(s1 === 0 &amp;&amp; p &amp;gt;= 0 &amp;&amp; p &amp;lt;= 1) return true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const s2 = Math.sign(b.cross(u2));</span></span>
<span class="line"><span>  p = b.dot(u2) / b.length ** 2;</span></span>
<span class="line"><span>  if(s2 === 0 &amp;&amp; p &amp;gt;= 0 &amp;&amp; p &amp;lt;= 1) return true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const s3 = Math.sign(c.cross(u3));</span></span>
<span class="line"><span>  p = c.dot(u3) / c.length ** 2;</span></span>
<span class="line"><span>  if(s3 === 0 &amp;&amp; p &amp;gt;= 0 &amp;&amp; p &amp;lt;= 1) return true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return s1 === s2 &amp;&amp; s2 === s3;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样我们就判断了一个点是否在某个三角形内部。那如果要判断一个点是否在任意多边形的内部，我们只需要在判断之前将它进行三角剖分就可以了。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function isPointInPath({vertices, cells}, point) {</span></span>
<span class="line"><span>  let ret = false;</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; cells.length; i += 3) {</span></span>
<span class="line"><span>    const p1 = new Vector2D(...vertices[cells[i]]);</span></span>
<span class="line"><span>    const p2 = new Vector2D(...vertices[cells[i + 1]]);</span></span>
<span class="line"><span>    const p3 = new Vector2D(...vertices[cells[i + 2]]);</span></span>
<span class="line"><span>    if(inTriangle(p1, p2, p3, point)) {</span></span>
<span class="line"><span>      ret = true;</span></span>
<span class="line"><span>      break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>本节课，我们学习了使用三角剖分来填充多边形以及判断点是否在多边形内部。</p><p>不同的图形系统有着不同的处理方法，Canvas2D的处理很简单，它可以使用原生的fill来填充任意多边形，使用isPointInPath来判断点是否在多边形内部。但是，三角剖分是更加通用的方式，WebGL就是使用三角剖分来处理多边形的，所以我们要牢记它的操作。</p><p>首先，在使用三角剖分填充多边形时，我们直接调用一些成熟库的API就可以完成，这并不难。而当我们要实现图形和用户的交互时，也就是要判断一个点是否在多边形内部时，也需要先对多边形进行三角剖分，然后判断该点是否在其中一个三角形内部。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><ol><li><p>在课程中，我们使用了Earcut对多边形进行三角剖分。但是tess2.js是一个比Earcut更强大的三角剖分库，使用tess2.js可以像原生的Canvas2D的fill方法那样，实现evenodd的填充规则。你能试着把代码中的earcut换成tess2.js，从而实现evenodd填充规则吗？动手之前，你可以先去读一下tess2.js的项目文档。</p></li><li><p>今天我们用三角剖分实现了不规则多边形。那你能试着利用三角剖分的原理，通过WebGL画出椭圆图案、菱形的星星图案（✦），以及正五角星吗？</p></li></ol><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/triangluations" target="_blank" rel="noreferrer">使用三角剖分填充多边形、判断点在多边形内部的完整代码</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p><a href="https://github.com/memononen/tess2.js" target="_blank" rel="noreferrer">tess2.js官方文档</a></p>`,104)])])}const d=n(t,[["render",i]]);export{u as __pageData,d as default};
