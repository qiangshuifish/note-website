import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"26 | 如何绘制带宽度的曲线？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何用Canvas2D绘制带宽度的曲线？","slug":"如何用canvas2d绘制带宽度的曲线","link":"#如何用canvas2d绘制带宽度的曲线","children":[]},{"level":2,"title":"如何用WebGL绘制带宽度的曲线","slug":"如何用webgl绘制带宽度的曲线","link":"#如何用webgl绘制带宽度的曲线","children":[]},{"level":2,"title":"通过挤压(extrude)曲线绘制有宽度的曲线","slug":"通过挤压-extrude-曲线绘制有宽度的曲线","link":"#通过挤压-extrude-曲线绘制有宽度的曲线","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"relativePath":"跟月影学可视化/26-如何绘制带宽度的曲线？.md","filePath":"跟月影学可视化/26-如何绘制带宽度的曲线？.md","lastUpdated":1779822292000}'),i={name:"跟月影学可视化/26-如何绘制带宽度的曲线？.md"};function t(l,n,c,o,r,d){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_26-如何绘制带宽度的曲线" tabindex="-1">26 | 如何绘制带宽度的曲线？ <a class="header-anchor" href="#_26-如何绘制带宽度的曲线" aria-label="Permalink to &quot;26 | 如何绘制带宽度的曲线？&quot;">​</a></h1><p>你好，我是月影。</p><p>在可视化应用中，我们经常需要绘制一些带有特定宽度的曲线。比如说，在地理信息可视化中，我们会使用曲线来描绘路径，而在3D地球可视化中，我们会使用曲线来描述飞线、轮廓线等等。</p><p>在Canvas2D中，要绘制带宽度的曲线非常简单，我们直接设置上下文对象的lineWidth属性就行了。但在WebGL中，绘制带宽度的曲线是一个难点，很多开发者都在这一步被难住过。</p><p>那今天，我就来说说怎么用Canvas2D和WebGL分绘制曲线。我要特别强调一下，我们讲的曲线指广义的曲线，线段、折线和平滑曲线都包含在内。</p><h2 id="如何用canvas2d绘制带宽度的曲线" tabindex="-1">如何用Canvas2D绘制带宽度的曲线？ <a class="header-anchor" href="#如何用canvas2d绘制带宽度的曲线" aria-label="Permalink to &quot;如何用Canvas2D绘制带宽度的曲线？&quot;">​</a></h2><p>刚才我说了，用Canvas2D绘制曲线非常简单。这是为什么呢？因为Canvas2D提供了相应的API，能够绘制出不同宽度、具有特定 <strong>连线方式</strong> 和 <strong>线帽形状</strong> 的曲线。</p><p>这句话怎么理解呢？我们从两个关键词，“连线方式（lineJoin）”和“线帽形状（lineCap）”入手理解。</p><p>我们知道，曲线是由线段连接而成的，两个线段中间转折的部分，就是lineJoin。如果线宽只有一个像素，那么连接处没有什么不同的形式，就是直接连接。但如果线宽超过一个像素，那么连接处的缺口，就会有不同的填充方式，而这些不同的填充方式，就对应了不同的lineJoin。</p><p>比如说，你可以看我给出的这张图，上面就显示了四种不同的lineJoin。其中，miter是尖角，round是圆角，bevel是斜角，none是不添加lineJoin。很好理解，我就不多说了</p><p><a href="https://mapserver.org/mapfile/symbology/construction.html" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/458c1d4c49519c2ac897fe89397a0b9c.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/458c1d4c49519c2ac897fe89397a0b9c.jpeg" alt=""></a></a></p><p>说完了lineJoin，那什么是lineCap呢？lineCap就是指曲线头尾部的形状，它有三种类型。第一种是square，方形线帽，它会在线段的头尾端延长线宽的一半。第二种round也叫圆弧线帽，它会在头尾端延长一个半圆。第三种是butt，就是不添加线帽。</p><p><a href="http://falcon80.com/HTMLCanvas/Attributes/lineCap.html" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/60cfd2020c014d88b7ac4b3b69e8e7c8.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/60cfd2020c014d88b7ac4b3b69e8e7c8.jpeg" alt=""></a></a></p><p>理解了这两个关键词之后，我们接着尝试一下，怎么在Canvas的上下文中，通过设置lineJoin和lineCap属性，来实现不同的曲线效果。</p><p>首先，我们要实现一个drawPolyline函数。这个函数非常简单，就是设置lineWidth、lingJoin、lineCap，然后根据points数据的内容设置绘图指令执行绘制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function drawPolyline(context, points, {lineWidth = 1, lineJoin = &#39;miter&#39;, lineCap = &#39;butt&#39;} = {}) {</span></span>
<span class="line"><span>  context.lineWidth = lineWidth;</span></span>
<span class="line"><span>  context.lineJoin = lineJoin;</span></span>
<span class="line"><span>  context.lineCap = lineCap;</span></span>
<span class="line"><span>  context.beginPath();</span></span>
<span class="line"><span>  context.moveTo(...points[0]);</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; points.length; i++) {</span></span>
<span class="line"><span>    context.lineTo(...points[i]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  context.stroke();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在设置lingJoin、lineCap时候，我们要注意，Canvas2D的lineJoin只支持miter、bevel和round，不支持none。lineCap支持butt、square和round。</p><p>接着，我们就可以执行JavaScript代码绘制曲线了。比如，我们绘制两条线，一条宽度为10个像素的红线，另一条宽度为1个像素的蓝线，具体的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const ctx = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span>const points = [</span></span>
<span class="line"><span>  [100, 100],</span></span>
<span class="line"><span>  [100, 200],</span></span>
<span class="line"><span>  [200, 150],</span></span>
<span class="line"><span>  [300, 200],</span></span>
<span class="line"><span>  [300, 100],</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span>ctx.strokeStyle = &#39;red&#39;;</span></span>
<span class="line"><span>drawPolyline(ctx, points, {lineWidth: 10});</span></span>
<span class="line"><span>ctx.strokeStyle = &#39;blue&#39;;</span></span>
<span class="line"><span>drawPolyline(ctx, points);</span></span></code></pre></div><p>因为我们把连接设置成miter、线帽设置成了butt，所以我们绘制出来的曲线，是尖角并且不带线帽的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/d9ed91c48f6a44bcaa26dbe2yya4d5eb.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/d9ed91c48f6a44bcaa26dbe2yya4d5eb.jpeg" alt=""></a></p><p>其实，我们还可以修改lineJoins和lineCap参数。比如，我们将线帽设为圆的，连接设为斜角。除此之外，你还可以尝试不同的组合，我就不再举例了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ctx.strokeStyle = &#39;red&#39;;</span></span>
<span class="line"><span>drawPolyline(ctx, points, {lineWidth: 10, lineCap: &#39;round&#39;, lineJoin: &#39;bevel&#39;});</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/fe56yy2032acef591b6051328331d10e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/fe56yy2032acef591b6051328331d10e.jpeg" alt=""></a></p><p>除了lineJoin和lineCap外，我们还可以设置Canvas2D上下文的miterLimit属性，来改变lineJoin等于miter时的连线形式，miterLimit属性等于miter和线宽的最大比值。当我们把lineJoin设置成miter的时候，miterLimit属性就会限制尖角的最大值。</p><p>那具体会产生什么效果呢？我们可以先修改drawPolyline代码添加miterLimit。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function drawPolyline(context, points, {lineWidth = 1, lineJoin = &#39;miter&#39;, lineCap = &#39;butt&#39;, miterLimit = 10} = {}) {</span></span>
<span class="line"><span>  context.lineWidth = lineWidth;</span></span>
<span class="line"><span>  context.lineJoin = lineJoin;</span></span>
<span class="line"><span>  context.lineCap = lineCap;</span></span>
<span class="line"><span>  context.miterLimit = miterLimit;</span></span>
<span class="line"><span>  context.beginPath();</span></span>
<span class="line"><span>  context.moveTo(...points[0]);</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; points.length; i++) {</span></span>
<span class="line"><span>    context.lineTo(...points[i]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  context.stroke();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们修改参数，把miterLimit:设置为1.5：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ctx.strokeStyle = &#39;red&#39;;</span></span>
<span class="line"><span>drawPolyline(ctx, points, {lineWidth: 10, lineCap: &#39;round&#39;, lineJoin: &#39;miter&#39;, miterLimit: 1.5});</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/fe56yy2032acef591b6051328331d10e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/fe56yy2032acef591b6051328331d10e.jpeg" alt=""></a></p><p>你会发现，这样渲染出来的图形，它两侧的转角由于超过了miterLimit限制，所以表现为斜角，而中间的转角因为没有超过miterLimit限制，所以是尖角。</p><p>总的来说，Canvas2D绘制曲线的方法很简单，只要我们调用对应的API就可以了。但用WebGL来绘制同样的曲线会非常麻烦。在详细讲解之前，我希望你先记住lineJoin、lineCap以及miterLimit这些属性，在WebGL中我们需要自己去实现它们。接下来，我们一起来看一下WebGL中是怎么做的。</p><h2 id="如何用webgl绘制带宽度的曲线" tabindex="-1">如何用WebGL绘制带宽度的曲线 <a class="header-anchor" href="#如何用webgl绘制带宽度的曲线" aria-label="Permalink to &quot;如何用WebGL绘制带宽度的曲线&quot;">​</a></h2><p>我们先从绘制宽度为1的曲线开始。因为WebGL本身就支持线段类的图元，所以我们直接用图元就能绘制出宽度为1的曲线。</p><p>下面，我结合代码来说说具体的绘制过程。与Canvas2D类似，我们直接设置position顶点坐标，然后设置mode为gl.LINE_STRIP。这里的LINE_STRIP是一种图元类型，表示以首尾连接的线段方式绘制。这样，我们就可以得到宽度为1的折线了。具体的代码和效果如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {Renderer, Program, Geometry, Transform, Mesh} from &#39;../common/lib/ogl/index.mjs&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const vertex = \`</span></span>
<span class="line"><span>  attribute vec2 position;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    gl_PointSize = 10.0;</span></span>
<span class="line"><span>    float scale = 1.0 / 256.0;</span></span>
<span class="line"><span>    mat3 projectionMatrix = mat3(</span></span>
<span class="line"><span>      scale, 0, 0,</span></span>
<span class="line"><span>      0, -scale, 0,</span></span>
<span class="line"><span>      -1, 1, 1</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>    vec3 pos = projectionMatrix * vec3(position, 1);</span></span>
<span class="line"><span>    gl_Position = vec4(pos.xy, 0, 1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const fragment = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    gl_FragColor = vec4(1, 0, 0, 1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const renderer = new Renderer({</span></span>
<span class="line"><span>  canvas,</span></span>
<span class="line"><span>  width: 512,</span></span>
<span class="line"><span>  height: 512,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const gl = renderer.gl;</span></span>
<span class="line"><span>gl.clearColor(1, 1, 1, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const program = new Program(gl, {</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const geometry = new Geometry(gl, {</span></span>
<span class="line"><span>position: {size: 2,</span></span>
<span class="line"><span>  data: new Float32Array(</span></span>
<span class="line"><span>    [</span></span>
<span class="line"><span>      100, 100,</span></span>
<span class="line"><span>      100, 200,</span></span>
<span class="line"><span>      200, 150,</span></span>
<span class="line"><span>      300, 200,</span></span>
<span class="line"><span>      300, 100,</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>  )},</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const scene = new Transform();</span></span>
<span class="line"><span>const polyline = new Mesh(gl, {geometry, program, mode: gl.LINE_STRIP});</span></span>
<span class="line"><span>polyline.setParent(scene);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.render({scene});</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/ef7cdd7a0df26a237592d229bec226b3.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/ef7cdd7a0df26a237592d229bec226b3.jpeg" alt=""></a></p><p>你可能会问，我们不能直接修改gl_PointSize，来给折线设置宽度吗？很遗憾，这是不行的。因为gl_PointSize只能影响gl.POINTS图元的显示，并不能对线段图元产生影响。</p><p>那我们该怎么让线的宽度大于1个像素呢？</p><h2 id="通过挤压-extrude-曲线绘制有宽度的曲线" tabindex="-1">通过挤压(extrude)曲线绘制有宽度的曲线 <a class="header-anchor" href="#通过挤压-extrude-曲线绘制有宽度的曲线" aria-label="Permalink to &quot;通过挤压(extrude)曲线绘制有宽度的曲线&quot;">​</a></h2><p>我们可以用一种挤压（Extrude）曲线的技术，通过将曲线的顶点沿法线方向向两侧移出，让1个像素的曲线变宽。</p><p>那挤压曲线要怎么做呢？我们先看一张示意图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/396bc27a64ec8cb608734b63cf44ee67.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/396bc27a64ec8cb608734b63cf44ee67.jpeg" alt=""></a></p><p>如上图所示，黑色折线是原始的1个像素宽度的折线，蓝色虚线组成的是我们最终要生成的带宽度曲线，红色虚线是顶点移动的方向。因为折线两个端点的挤压只和一条线段的方向有关，而转角处顶点的挤压和相邻两条线段的方向都有关，所以顶点移动的方向，我们要分两种情况讨论。</p><p>首先，是折线的端点。假设线段的向量为（x, y），因为它移动方向和线段方向垂直，所以我们只要沿法线方向移动它就可以了。根据垂直向量的点积为0，我们很容易得出顶点的两个移动方向为（-y, x）和（y, -x）。如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/482af6fd993dbf91f3635bddffdcd412.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/482af6fd993dbf91f3635bddffdcd412.jpeg" alt=""></a></p><p>端点挤压方向确定了，接下来要确定转角的挤压方向了，我们还是看示意图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/fa6b04dabfba6aaca02a66dde1d743e3.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/fa6b04dabfba6aaca02a66dde1d743e3.jpeg" alt=""></a></p><p>如上图，我们假设有折线abc，b是转角。我们延长ab，就能得到一个单位向量v1，反向延长bc，可以得到另一个单位向量v2，那么挤压方向就是向量v1+v2的方向，以及相反的-(v1+v2)的方向。</p><p>现在我们得到了挤压方向，接下来就需要确定挤压向量的长度。</p><p>首先是折线端点的挤压长度，它等于lineWidth的一半。而转角的挤压长度就比较复杂了，我们需要再计算一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/d2be1cd10fe7cdd0ab5611c13ab56882.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/d2be1cd10fe7cdd0ab5611c13ab56882.jpeg" alt=""></a></p><p>绿色这条辅助线应该等于lineWidth的一半，而它又恰好是v1+v2在绿色这条向量方向的投影，所以，我们可以先用向量点积求出红色虚线和绿色虚线夹角的余弦值，然后用lineWidth的一半除以这个值，得到的就是挤压向量的长度了。</p><p>具体用JavaScript实现的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function extrudePolyline(gl, points, {thickness = 10} = {}) {</span></span>
<span class="line"><span>  const halfThick = 0.5 * thickness;</span></span>
<span class="line"><span>  const innerSide = [];</span></span>
<span class="line"><span>  const outerSide = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 构建挤压顶点</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; points.length - 1; i++) {</span></span>
<span class="line"><span>    const v1 = (new Vec2()).sub(points[i], points[i - 1]).normalize();</span></span>
<span class="line"><span>    const v2 = (new Vec2()).sub(points[i], points[i + 1]).normalize();</span></span>
<span class="line"><span>    const v = (new Vec2()).add(v1, v2).normalize(); // 得到挤压方向</span></span>
<span class="line"><span>    const norm = new Vec2(-v1.y, v1.x); // 法线方向</span></span>
<span class="line"><span>    const cos = norm.dot(v);</span></span>
<span class="line"><span>    const len = halfThick / cos;</span></span>
<span class="line"><span>    if(i === 1) { // 起始点</span></span>
<span class="line"><span>      const v0 = new Vec2(...norm).scale(halfThick);</span></span>
<span class="line"><span>      outerSide.push((new Vec2()).add(points[0], v0));</span></span>
<span class="line"><span>      innerSide.push((new Vec2()).sub(points[0], v0));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    v.scale(len);</span></span>
<span class="line"><span>    outerSide.push((new Vec2()).add(points[i], v));</span></span>
<span class="line"><span>    innerSide.push((new Vec2()).sub(points[i], v));</span></span>
<span class="line"><span>    if(i === points.length - 2) { // 结束点</span></span>
<span class="line"><span>      const norm2 = new Vec2(v2.y, -v2.x);</span></span>
<span class="line"><span>      const v0 = new Vec2(...norm2).scale(halfThick);</span></span>
<span class="line"><span>      outerSide.push((new Vec2()).add(points[points.length - 1], v0));</span></span>
<span class="line"><span>      innerSide.push((new Vec2()).sub(points[points.length - 1], v0));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这段代码中，v1、v2是线段的延长线，v是挤压方向，我们计算法线方向与挤压方向的余弦值，就能算出挤压长度了。你还要注意，我们要把起始点和结束点这两个端点的挤压也给添加进去，也就是两个if条件中的处理逻辑。</p><p>这样一来，我们就把挤压之后的折线顶点坐标给计算出来了。向内和向外挤压的点现在分别保存在innerSide和outerSide数组中。</p><p>接下来，我们就要构建对应的Geometry对象，所以我们继续添加extrudePolyline函数的后半部分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function extrudePolyline(gl, points, {thickness = 10} = {})</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  const count = innerSide.length * 4 - 4;</span></span>
<span class="line"><span>  const position = new Float32Array(count * 2);</span></span>
<span class="line"><span>  const index = new Uint16Array(6 * count / 4);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 创建 geometry 对象</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; innerSide.length - 1; i++) {</span></span>
<span class="line"><span>    const a = innerSide[i],</span></span>
<span class="line"><span>      b = outerSide[i],</span></span>
<span class="line"><span>      c = innerSide[i + 1],</span></span>
<span class="line"><span>      d = outerSide[i + 1];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const offset = i * 4;</span></span>
<span class="line"><span>    index.set([offset, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3], i * 6);</span></span>
<span class="line"><span>    position.set([...a, ...b, ...c, ...d], i * 8);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return new Geometry(gl, {</span></span>
<span class="line"><span>    position: {size: 2, data: position},</span></span>
<span class="line"><span>    index: {data: index},</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这一步骤就非常简单了，我们根据innerSide和outerSide中的顶点来构建三角网格化的几何体顶点数据，最终返回Geometry对象。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/1c423ae467bce04f49a46a4fed376d01.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/1c423ae467bce04f49a46a4fed376d01.jpeg" alt=""></a></p><p>最后，我们只要调用extrudePolyline，传入折线顶点和宽度，然后用返回的Geometry对象来构建三角网格对象，将它渲染出来就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const geometry = extrudePolyline(gl, points, {lineWidth: 10});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const scene = new Transform();</span></span>
<span class="line"><span>const polyline = new Mesh(gl, {geometry, program});</span></span>
<span class="line"><span>polyline.setParent(scene);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.render({scene});</span></span></code></pre></div><p>我们最终渲染出来的效果如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/7fb7607de6d1396ba92f53ac18e9acd4.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/275838/7fb7607de6d1396ba92f53ac18e9acd4.jpeg" alt=""></a></p><p>这样，我们就在WebGL中实现了，与Canvas2D一样带宽度的曲线。</p><p>当然，这里我们只实现了最基础的带宽度曲线，它对应于Canvas2D中的lineJoin为miter，lineCap为butt的曲线。不过，想要实现lineJoins为bevel或round，lineCap为square或round的曲线，也不会太困难。我们可以基于extrudePolyline函数，对它进行扩展，计算出相应属性下对应的顶点就行了。因为基本原理是一样的，我就不详细说了，我把扩展的任务留给你作为课后练习。</p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这节课，我们讲了绘制带宽度曲线的方法。</p><p>首先，在Canvas2D中，绘制这样的曲线比较简单，我们直接通过API设置lineWidth即可。而且，Canvas2D还支持不同的lineJoin、lineCap设置以及miterLimit设置。</p><p>在WebGL中，绘制带宽度的曲线则比较麻烦，因为没有现成的API可以使用。这个时候，我们可以使用挤压曲线的技术来得到带宽度的曲线，挤压曲线的具体步骤可以总结为三步：</p><ol><li>确定端点和转角的挤压方向，端点可以沿线段的法线挤压，转角则通过两条线段延长线的单位向量求和的方式获得。</li><li>确定端点和转角挤压的长度，端点两个方向的挤压长度是线宽lineWidth的一半。求转角挤压长度的时候，我们要先计算方向向量和线段法线的余弦，然后将线宽lineWidth的一半除以我们计算出的余弦值。</li><li>由步骤1、2计算出顶点后，我们构建三角网格化的几何体顶点数据，然后将Geometry对象返回。</li></ol><p>这样，我们就可以用WebGL绘制出有宽度的曲线了。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><ol><li>你能修改extrudePolyline函数，让它支持lineCap为square和round吗？或者让它支持lineJoin为round吗？</li><li>我想让你试着修改一下extrudePolyline函数，让它支持lineJoin为bevel，以及miterLimit。并且，当lineJoin为miter的时候，如果转角挤压长度超过了miterLimit，我们就按照bevel处理向外的挤压。</li></ol><p>那通过今天的学习，你是不是已经学会绘制带宽度曲线的方法。那不妨就把这节课分享给你的朋友，也帮助他解决这个难题吧。好了，今天的内容就到这里了，我们下节课再见</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>课程完整示例代码详见 <a href="https://github.com/akira-cn/graphics/tree/master/polyline-curve" target="_blank" rel="noreferrer">GitHub仓库</a></p>`,79)])])}const b=s(i,[["render",t]]);export{g as __pageData,b as default};
