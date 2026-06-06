import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"20 | 如何用WebGL绘制3D物体？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何用WebGL绘制三维立方体","slug":"如何用webgl绘制三维立方体","link":"#如何用webgl绘制三维立方体","children":[]},{"level":2,"title":"投影矩阵：变换WebGL坐标系","slug":"投影矩阵-变换webgl坐标系","link":"#投影矩阵-变换webgl坐标系","children":[]},{"level":2,"title":"模型矩阵：让立方体旋转起来","slug":"模型矩阵-让立方体旋转起来","link":"#模型矩阵-让立方体旋转起来","children":[]},{"level":2,"title":"如何用WebGL绘制圆柱体","slug":"如何用webgl绘制圆柱体","link":"#如何用webgl绘制圆柱体","children":[]},{"level":2,"title":"构造和使用法向量","slug":"构造和使用法向量","link":"#构造和使用法向量","children":[{"level":3,"title":"1. 构造法向量","slug":"_1-构造法向量","link":"#_1-构造法向量","children":[]},{"level":3,"title":"2. 法向量矩阵","slug":"_2-法向量矩阵","link":"#_2-法向量矩阵","children":[]}]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"relativePath":"跟月影学可视化/20-如何用WebGL绘制3D物体？.md","filePath":"跟月影学可视化/20-如何用WebGL绘制3D物体？.md","lastUpdated":1779822292000}'),l={name:"跟月影学可视化/20-如何用WebGL绘制3D物体？.md"};function i(t,s,c,o,r,h){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_20-如何用webgl绘制3d物体" tabindex="-1">20 | 如何用WebGL绘制3D物体？ <a class="header-anchor" href="#_20-如何用webgl绘制3d物体" aria-label="Permalink to &quot;20 | 如何用WebGL绘制3D物体？&quot;">​</a></h1><p>你好，我是月影。这一节课开始，我们学习3D图形的绘制。</p><p>之前我们主要讨论的都是2D图形的绘制，实际上WebGL真正强大之处在于，它可以绘制各种3D图形，而3D图形能够极大地增强可视化的表现能力。</p><p>用WebGL绘制3D图形，其实在基本原理上和绘制2D图形并没有什么区别，只不过是我们把绘图空间从二维扩展到三维，所以计算起来会更加复杂一些。</p><p>今天，我们就从绘制最简单的三维立方体，讲到矩阵、法向量在三维空间中的使用，这样由浅入深地带你去了解，如何用WebGL绘制出各种3D图形。</p><h2 id="如何用webgl绘制三维立方体" tabindex="-1">如何用WebGL绘制三维立方体 <a class="header-anchor" href="#如何用webgl绘制三维立方体" aria-label="Permalink to &quot;如何用WebGL绘制三维立方体&quot;">​</a></h2><p>首先，我们来绘制熟悉的2D图形，比如矩形，再把它拓展到三维空间变成立方体。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// vertex shader  顶点着色器</span></span>
<span class="line"><span>attribute vec2 a_vertexPosition;</span></span>
<span class="line"><span>attribute vec4 color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_PointSize = 1.0;</span></span>
<span class="line"><span>  vColor = color;</span></span>
<span class="line"><span>  gl_Position = vec4(a_vertexPosition, 1, 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// fragment shader   片元着色器</span></span>
<span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_FragColor = vColor;</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>// 顶点信息</span></span>
<span class="line"><span>renderer.setMeshData([{</span></span>
<span class="line"><span>  positions: [</span></span>
<span class="line"><span>    [-0.5, -0.5],</span></span>
<span class="line"><span>    [-0.5, 0.5],</span></span>
<span class="line"><span>    [0.5, 0.5],</span></span>
<span class="line"><span>    [0.5, -0.5],</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  attributes: {</span></span>
<span class="line"><span>    color: [</span></span>
<span class="line"><span>      [1, 0, 0, 1],</span></span>
<span class="line"><span>      [1, 0, 0, 1],</span></span>
<span class="line"><span>      [1, 0, 0, 1],</span></span>
<span class="line"><span>      [1, 0, 0, 1],</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  cells: [[0, 1, 2], [0, 2, 3]],</span></span>
<span class="line"><span>}]);</span></span>
<span class="line"><span>renderer.render();</span></span></code></pre></div><p>上面的3段代码，分别对应顶点着色器、片元着色器和基本的顶点信息。通过它们，我们就在画布上绘制出了一个红色的矩形。接下来，要想把2维矩形拓展到3维，我们的第一步就是要把顶点扩展到3维。这一步的操作比较简单，我们只需要把顶点从vec2扩展到vec3就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// vertex shader</span></span>
<span class="line"><span>attribute vec3 a_vertexPosition;</span></span>
<span class="line"><span>attribute vec4 color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_PointSize = 1.0;</span></span>
<span class="line"><span>  vColor = color;</span></span>
<span class="line"><span>  gl_Position = vec4(a_vertexPosition, 1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>然后，我们需要计算立方体的顶点数据</strong>。我们知道一个立方体有8个顶点，这8个顶点能组成6个面。在WebGL中，我们就需要用12个三角形来绘制它。如果每个面的属性相同，我们就可以复用8个顶点来绘制。而如果属性不同，比如每个面要绘制成不同的颜色，或者添加不同的纹理图片，我们还得把每个面的顶点分开。这样的话，我们一共需要24个顶点。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/47cc2a856e7b2f675467f7484373e74e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/47cc2a856e7b2f675467f7484373e74e.jpeg" alt=""></a></p><p>为了方便使用，我们可以写一个JavaScript函数，用来生成立方体6个面的24个顶点，以及12个三角形的索引，而且我直接在这个函数里定义了每个面的颜色。具体的函数代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function cube(size = 1.0, colors = [[1, 0, 0, 1]]) {</span></span>
<span class="line"><span>  const h = 0.5 * size;</span></span>
<span class="line"><span>  const vertices = [</span></span>
<span class="line"><span>    [-h, -h, -h],</span></span>
<span class="line"><span>    [-h, h, -h],</span></span>
<span class="line"><span>    [h, h, -h],</span></span>
<span class="line"><span>    [h, -h, -h],</span></span>
<span class="line"><span>    [-h, -h, h],</span></span>
<span class="line"><span>    [-h, h, h],</span></span>
<span class="line"><span>    [h, h, h],</span></span>
<span class="line"><span>    [h, -h, h],</span></span>
<span class="line"><span>  ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const positions = [];</span></span>
<span class="line"><span>  const color = [];</span></span>
<span class="line"><span>  const cells = [];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let colorIdx = 0;</span></span>
<span class="line"><span>  let cellsIdx = 0;</span></span>
<span class="line"><span>  const colorLen = colors.length;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  function quad(a, b, c, d) {</span></span>
<span class="line"><span>    [a, b, c, d].forEach((i) =&amp;gt; {</span></span>
<span class="line"><span>      positions.push(vertices[i]);</span></span>
<span class="line"><span>      color.push(colors[colorIdx % colorLen]);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    cells.push(</span></span>
<span class="line"><span>      [0, 1, 2].map(i =&amp;gt; i + cellsIdx),</span></span>
<span class="line"><span>      [0, 2, 3].map(i =&amp;gt; i + cellsIdx),</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>    colorIdx++;</span></span>
<span class="line"><span>    cellsIdx += 4;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  quad(1, 0, 3, 2);</span></span>
<span class="line"><span>  quad(4, 5, 6, 7);</span></span>
<span class="line"><span>  quad(2, 3, 7, 6);</span></span>
<span class="line"><span>  quad(5, 4, 0, 1);</span></span>
<span class="line"><span>  quad(3, 0, 4, 7);</span></span>
<span class="line"><span>  quad(6, 5, 1, 2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return {positions, color, cells};</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，我们就可以构建出立方体的顶点信息，我在下面给出了12个立方体的顶点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const geometry = cube(1.0, [</span></span>
<span class="line"><span>  [1, 0, 0, 1],</span></span>
<span class="line"><span>  [0, 0.5, 0, 1],</span></span>
<span class="line"><span>  [1, 0, 1, 1],</span></span>
<span class="line"><span>]);</span></span></code></pre></div><p>通过上面的代码，我们就能创建出一个棱长为1的立方体，并且六个面的颜色分别是“红、绿、蓝、红、绿、蓝”。</p><p>这里我还想补充一点内容，绘制3D图形与绘制2D图形有一点不一样，那就是我们必须要开启 <strong>深度检测和启用深度缓冲区</strong>。在WebGL中，我们可以通过 <code>gl.enable(gl.DEPTH_TEST)</code>，来开启深度检测。</p><p>而且，我们在清空画布的时候，也要用 <code>gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);</code>，来同时清空颜色缓冲区和深度缓冲区。启动和清空深度检测和深度缓冲区这两个步骤，是这个过程中非常重要的一环，但是我们几乎不会用原生的方式来写代码，所以我们了解到这个程度就可以了。</p><p>事实上，对于上面这些步骤，为了方便使用，我们还是可以直接使用gl-renderer库。它封装了深度检测，在使用它的时候，我们只要在创建renderer的时候设置一个参数depth: true即可。</p><p>现在，我们把这个三维立方体用gl-renderer渲染出来，渲染代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const renderer = new GlRenderer(canvas, {</span></span>
<span class="line"><span>  depth: true,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const program = renderer.compileSync(fragment, vertex);</span></span>
<span class="line"><span>renderer.useProgram(program);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>renderer.setMeshData([{</span></span>
<span class="line"><span>  positions: geometry.positions,</span></span>
<span class="line"><span>  attributes: {</span></span>
<span class="line"><span>    color: geometry.color,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  cells: geometry.cells,</span></span>
<span class="line"><span>}]);</span></span>
<span class="line"><span>renderer.render();</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/39bc7f588350b3c990c4cd0e2b616e4d.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/39bc7f588350b3c990c4cd0e2b616e4d.jpeg" alt=""></a></p><h2 id="投影矩阵-变换webgl坐标系" tabindex="-1">投影矩阵：变换WebGL坐标系 <a class="header-anchor" href="#投影矩阵-变换webgl坐标系" aria-label="Permalink to &quot;投影矩阵：变换WebGL坐标系&quot;">​</a></h2><p>结合渲染出来的这个图形，我想让你再仔细观看一下我们刚才调用的代码。</p><p>当时立方体的顶点我们是这么定义的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> const vertices = [</span></span>
<span class="line"><span>    [-h, -h, -h],</span></span>
<span class="line"><span>    [-h, h, -h],</span></span>
<span class="line"><span>    [h, h, -h],</span></span>
<span class="line"><span>    [h, -h, -h],</span></span>
<span class="line"><span>    [-h, -h, h],</span></span>
<span class="line"><span>    [-h, h, h],</span></span>
<span class="line"><span>    [h, h, h],</span></span>
<span class="line"><span>    [h, -h, h],</span></span></code></pre></div><p>而立方体的六个面的颜色，我们是这么定义的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//立方体的六个面</span></span>
<span class="line"><span>  quad(1, 0, 3, 2); // 红 -- 这一面应该朝内</span></span>
<span class="line"><span>  quad(4, 5, 6, 7);  // 绿 -- 这一面应该朝外</span></span>
<span class="line"><span>  quad(2, 3, 7, 6);  // 蓝</span></span>
<span class="line"><span>  quad(5, 4, 0, 1);  // 红</span></span>
<span class="line"><span>  quad(3, 0, 4, 7);  // 绿</span></span>
<span class="line"><span>  quad(6, 5, 1, 2);  // 蓝</span></span></code></pre></div><p>有没有发现问题？我们之前说过，WebGL的坐标系是z轴向外为正，z轴向内为负，所以根据我们调用的代码，赋给靠外那一面的颜色应该是绿色，而不是红色。但是这个立方体朝向我们的一面却是红色，这是为什么呢？</p><p>实际上，WebGL默认的 <strong>剪裁坐标</strong> 的z轴方向，的确是朝内的。也就是说，WebGL坐标系就是一个左手系而不是右手系。但是，基本上所有的WebGL教程，也包括我们前面的课程，一直都在说WebGL坐标系是右手系，这又是为什么呢？</p><p>这是因为，规范的直角坐标系是右手坐标系，符合我们的使用习惯。因此，一般来说，不管什么图形库或图形框架，在绘图的时候，都会默认将坐标系从左手系转换为右手系。</p><p><strong>那我们下一步，就是要将WebGL的坐标系从左手系转换为右手系。</strong> 关于坐标转换，我们可以通过齐次矩阵来完成。将左手系坐标转换为右手系，实际上就是将z轴坐标方向反转，对应的齐次矩阵如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[</span></span>
<span class="line"><span>  1, 0, 0, 0,</span></span>
<span class="line"><span>  0, 1, 0, 0,</span></span>
<span class="line"><span>  0, 0, -1, 0,</span></span>
<span class="line"><span>  0, 0, 0, 1</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>这种转换坐标的齐次矩阵，又被称为 <strong>投影矩阵</strong>（ProjectionMatrix）。接着，我们就修改一下顶点着色器，将投影矩阵加入进去。这样，画布上显示的就是绿色的正方形了。代码和效果图如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>attribute vec3 a_vertexPosition;</span></span>
<span class="line"><span>attribute vec4 color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span>uniform mat4 projectionMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_PointSize = 1.0;</span></span>
<span class="line"><span>  vColor = color;</span></span>
<span class="line"><span>  gl_Position = projectionMatrix * vec4(a_vertexPosition, 1.0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/19ee7c8dbddee10663e83b00eb740040.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/19ee7c8dbddee10663e83b00eb740040.jpeg" alt=""></a></p><p>投影矩阵不仅可以用来改变z轴坐标，还可以用来实现正交投影、透视投影以及其他的投影变换，在下一节课我们会深入去讲。</p><h2 id="模型矩阵-让立方体旋转起来" tabindex="-1">模型矩阵：让立方体旋转起来 <a class="header-anchor" href="#模型矩阵-让立方体旋转起来" aria-label="Permalink to &quot;模型矩阵：让立方体旋转起来&quot;">​</a></h2><p>通过前面的操作，我们还是只能看到立方体的一个面，因为我们的视线正好是垂直于z轴的，所以其他的面被完全挡住了。不过，我们可以通过旋转立方体，将其他的面露出来。旋转立方体，同样可以通过矩阵运算来实现。这次我们要用到另一个齐次矩阵，它定义了被绘制的物体变换，这个矩阵叫做 <strong>模型矩阵</strong>（ModelMatrix）。接下来，我们就把模型矩阵加入到顶点着色器中，然后将它与投影矩阵相乘，最后再乘上齐次坐标，就得到最终的顶点坐标了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>attribute vec3 a_vertexPosition;</span></span>
<span class="line"><span>attribute vec4 color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span>uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>uniform mat4 modelMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_PointSize = 1.0;</span></span>
<span class="line"><span>  vColor = color;</span></span>
<span class="line"><span>  gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接着，我们定义一个JavaScript函数，用立方体沿x、y、z轴的旋转来生成模型矩阵。我们以x、y、z三个方向的旋转得到三个齐次矩阵，然后将它们相乘，就能得到最终的模型矩阵。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {multiply} from &#39;../common/lib/math/functions/Mat4Func.js&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function fromRotation(rotationX, rotationY, rotationZ) {</span></span>
<span class="line"><span>  let c = Math.cos(rotationX);</span></span>
<span class="line"><span>  let s = Math.sin(rotationX);</span></span>
<span class="line"><span>  const rx = [</span></span>
<span class="line"><span>    1, 0, 0, 0,</span></span>
<span class="line"><span>    0, c, s, 0,</span></span>
<span class="line"><span>    0, -s, c, 0,</span></span>
<span class="line"><span>    0, 0, 0, 1,</span></span>
<span class="line"><span>  ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  c = Math.cos(rotationY);</span></span>
<span class="line"><span>  s = Math.sin(rotationY);</span></span>
<span class="line"><span>  const ry = [</span></span>
<span class="line"><span>    c, 0, s, 0,</span></span>
<span class="line"><span>    0, 1, 0, 0,</span></span>
<span class="line"><span>    -s, 0, c, 0,</span></span>
<span class="line"><span>    0, 0, 0, 1,</span></span>
<span class="line"><span>  ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  c = Math.cos(rotationZ);</span></span>
<span class="line"><span>  s = Math.sin(rotationZ);</span></span>
<span class="line"><span>  const rz = [</span></span>
<span class="line"><span>    c, s, 0, 0,</span></span>
<span class="line"><span>    -s, c, 0, 0,</span></span>
<span class="line"><span>    0, 0, 1, 0,</span></span>
<span class="line"><span>    0, 0, 0, 1,</span></span>
<span class="line"><span>  ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const ret = [];</span></span>
<span class="line"><span>  multiply(ret, rx, ry);</span></span>
<span class="line"><span>  multiply(ret, ret, rz);</span></span>
<span class="line"><span>  return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，我们把这个模型矩阵传给顶点着色器，不断更新三个旋转角度，就能实现立方体旋转的效果，也就可以看到立方体其他各个面了。效果和代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>let rotationX = 0;</span></span>
<span class="line"><span>let rotationY = 0;</span></span>
<span class="line"><span>let rotationZ = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function update() {</span></span>
<span class="line"><span>  rotationX += 0.003;</span></span>
<span class="line"><span>  rotationY += 0.005;</span></span>
<span class="line"><span>  rotationZ += 0.007;</span></span>
<span class="line"><span>  renderer.uniforms.modelMatrix = fromRotation(rotationX, rotationY, rotationZ);</span></span>
<span class="line"><span>  requestAnimationFrame(update);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>update();</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/ff4dd2c260eb6aba433b4yye4cef7569.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/ff4dd2c260eb6aba433b4yye4cef7569.gif" alt=""></a></p><p>到这里，我们就完成了一个旋转的立方体。</p><h2 id="如何用webgl绘制圆柱体" tabindex="-1">如何用WebGL绘制圆柱体 <a class="header-anchor" href="#如何用webgl绘制圆柱体" aria-label="Permalink to &quot;如何用WebGL绘制圆柱体&quot;">​</a></h2><p>立方体还是比较简单的几何体，那类似的，我们还可以构建顶点和三角形，来绘制更加复杂的图形，比如圆柱体、球体等等。这里，我再用绘制圆柱体来举个例子。</p><p>我们知道圆柱体的两个底面都是圆，我们可以用割圆的方式对圆进行简单的三角剖分，然后把圆柱的侧面用上下两个圆上的顶点进行三角剖分。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/30a5c31ea777ef8b5f9586d5bb6ed401.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/30a5c31ea777ef8b5f9586d5bb6ed401.jpg" alt=""></a></p><p>具体的算法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function cylinder(radius = 1.0, height = 1.0, segments = 30, colorCap = [0, 0, 1, 1], colorSide = [1, 0, 0, 1]) {</span></span>
<span class="line"><span>  const positions = [];</span></span>
<span class="line"><span>  const cells = [];</span></span>
<span class="line"><span>  const color = [];</span></span>
<span class="line"><span>  const cap = [[0, 0]];</span></span>
<span class="line"><span>  const h = 0.5 * height;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 顶和底的圆</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt;= segments; i++) {</span></span>
<span class="line"><span>    const theta = Math.PI * 2 * i / segments;</span></span>
<span class="line"><span>    const p = [radius * Math.cos(theta), radius * Math.sin(theta)];</span></span>
<span class="line"><span>    cap.push(p);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  positions.push(...cap.map(([x, y]) =&amp;gt; [x, y, -h]));</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; cap.length - 1; i++) {</span></span>
<span class="line"><span>    cells.push([0, i, i + 1]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  cells.push([0, cap.length - 1, 1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  let offset = positions.length;</span></span>
<span class="line"><span>  positions.push(...cap.map(([x, y]) =&amp;gt; [x, y, h]));</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; cap.length - 1; i++) {</span></span>
<span class="line"><span>    cells.push([offset, offset + i, offset + i + 1]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  cells.push([offset, offset + cap.length - 1, offset + 1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  color.push(...positions.map(() =&amp;gt; colorCap));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 侧面</span></span>
<span class="line"><span>  offset = positions.length;</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; cap.length; i++) {</span></span>
<span class="line"><span>    const a = [...cap[i], h];</span></span>
<span class="line"><span>    const b = [...cap[i], -h];</span></span>
<span class="line"><span>    const nextIdx = i &amp;lt; cap.length - 1 ? i + 1 : 1;</span></span>
<span class="line"><span>    const c = [...cap[nextIdx], -h];</span></span>
<span class="line"><span>    const d = [...cap[nextIdx], h];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    positions.push(a, b, c, d);</span></span>
<span class="line"><span>    color.push(colorSide, colorSide, colorSide, colorSide);</span></span>
<span class="line"><span>    cells.push([offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]);</span></span>
<span class="line"><span>    offset += 4;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return {positions, cells, color};</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样呢，我们就可以绘制出圆柱体了，把前面例子代码里的cube改为cylinder，效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/b14b73c131c9bf29887bcbbf8df4d506.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/b14b73c131c9bf29887bcbbf8df4d506.gif" alt=""></a></p><p>所以我们看到，用WebGL绘制三维物体，实际上和绘制二维物体没有什么本质不同，都是将图形（对于三维来说，也就是几何体）的顶点数据构造出来，然后将它们送到缓冲区中，再执行绘制。只不过三维图形的绘制需要构造三维的顶点和网格，在绘制前还需要启用深度缓冲区。</p><h2 id="构造和使用法向量" tabindex="-1">构造和使用法向量 <a class="header-anchor" href="#构造和使用法向量" aria-label="Permalink to &quot;构造和使用法向量&quot;">​</a></h2><p>在前面两个例子中，我们构造出了几何体的顶点信息，包括顶点的位置和颜色信息，除此之外，我们还可以构造几何体的其他信息，其中一种比较有用的信息是顶点的法向量信息。</p><p>法向量那什么是法向量呢？法向量表示每个顶点所在的面的法线方向，在3D渲染中，我们可以通过法向量来计算光照、阴影、进行边缘检测等等。法向量非常有用，所以我们也要掌握它的构造方法。</p><h3 id="_1-构造法向量" tabindex="-1">1. 构造法向量 <a class="header-anchor" href="#_1-构造法向量" aria-label="Permalink to &quot;1\\. 构造法向量&quot;">​</a></h3><p>对于立方体来说，得到法向量非常简单，我们只要找到垂直于立方体6个面上的线段，再得到这些线段所在向量上的单位向量就行了。显然，标准立方体中6个面的法向量如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[0, 0, -1]</span></span>
<span class="line"><span>[0, 0, 1]</span></span>
<span class="line"><span>[0, -1, 0]</span></span>
<span class="line"><span>[0, 1, 0]</span></span>
<span class="line"><span>[-1, 0, 0]</span></span>
<span class="line"><span>[1, 0, 0]</span></span></code></pre></div><p>对于圆柱体来说，底面和顶面法线分别是(0, 0, -1)和(0, 0, 1)。侧面的计算稍微复杂一些，需要通过三角网格来计算。具体怎么做呢？</p><p>因为几何体是由三角网格构成的，而法线是垂直于三角网格的线，如果要计算法线，我们可以借助三角形的顶点，使用向量的叉积定理来求。我们假设在一个平面内，有向量a和b，n是它们的法向量，那我们可以得到公式：n = a X b。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/e5bddfd9b16c6f325c0c2e95e428a285.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/e5bddfd9b16c6f325c0c2e95e428a285.jpeg" alt=""></a></p><p>根据这个公式，我们可以通过以下方法求出侧面的法向量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  const tmp1 = [];</span></span>
<span class="line"><span>  const tmp2 = [];</span></span>
<span class="line"><span>  // 侧面</span></span>
<span class="line"><span>  offset = positions.length;</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; cap.length; i++) {</span></span>
<span class="line"><span>    const a = [...cap[i], h];</span></span>
<span class="line"><span>    const b = [...cap[i], -h];</span></span>
<span class="line"><span>    const nextIdx = i &amp;lt; cap.length - 1 ? i + 1 : 1;</span></span>
<span class="line"><span>    const c = [...cap[nextIdx], -h];</span></span>
<span class="line"><span>    const d = [...cap[nextIdx], h];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    positions.push(a, b, c, d);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const norm = [];</span></span>
<span class="line"><span>    cross(norm, subtract(tmp1, b, a), subtract(tmp2, c, a));</span></span>
<span class="line"><span>    normalize(norm, norm);</span></span>
<span class="line"><span>    normal.push(norm, norm, norm, norm); // abcd四个点共面，它们的法向量相同</span></span>
<span class="line"><span>    color.push(colorSide, colorSide, colorSide, colorSide);</span></span>
<span class="line"><span>    cells.push([offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]);</span></span>
<span class="line"><span>    offset += 4;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>求出法向量，我们可以使用法向量来实现丰富的效果，比如点光源。下面，我们就在shader中实现点光源效果。</p><h3 id="_2-法向量矩阵" tabindex="-1">2. 法向量矩阵 <a class="header-anchor" href="#_2-法向量矩阵" aria-label="Permalink to &quot;2\\. 法向量矩阵&quot;">​</a></h3><p>因为我们在shader中，会使用模型矩阵对顶点进行变换，所以在片元着色器中，我们拿到的是变换后的顶点坐标，这时候，如果我们要应用法向量，需要对法向量也进行变换，我们可以通过一个矩阵来实现，这个矩阵叫做法向量矩阵（NormalMatrix）。它是模型矩阵的逆转置矩阵，不过它非常特殊，是一个3X3的矩阵（mat3），而像模型矩阵、投影矩阵等等矩阵都是4X4的。</p><p>得到了法向量和法向量矩阵，我们可以使用法向量和法向量矩阵来实现点光源光照效果。首先，我们要实现如下顶点着色器：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>attribute vec3 a_vertexPosition;</span></span>
<span class="line"><span>attribute vec4 color;</span></span>
<span class="line"><span>attribute vec3 normal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span>varying float vCos;</span></span>
<span class="line"><span>uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>uniform mat4 modelMatrix;</span></span>
<span class="line"><span>uniform mat3 normalMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const vec3 lightPosition = vec3(1, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_PointSize = 1.0;</span></span>
<span class="line"><span>  vColor = color;</span></span>
<span class="line"><span>  vec4 pos =  modelMatrix * vec4(a_vertexPosition, 1.0);</span></span>
<span class="line"><span>  vec3 invLight = lightPosition - pos.xyz;</span></span>
<span class="line"><span>  vec3 norm = normalize(normalMatrix * normal);</span></span>
<span class="line"><span>  vCos = max(dot(normalize(invLight), norm), 0.0);</span></span>
<span class="line"><span>  gl_Position = projectionMatrix * pos;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面顶点着色器的代码中，我们计算的是位于(1,0,0)坐标处的点光源与几何体法线的夹角余弦。那根据物体漫反射模型，光照强度等于光线与法向量夹角的余弦。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/f620694bfbf78143dd99965cc111b97b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/f620694bfbf78143dd99965cc111b97b.jpeg" alt=""></a></p><p>因此，我们求出这个余弦值，就能在片元着色器叠加光照了。操作代码和实现效果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform vec4 lightColor;</span></span>
<span class="line"><span>varying vec4 vColor;</span></span>
<span class="line"><span>varying float vCos;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  gl_FragColor.rgb = vColor.rgb + vCos * lightColor.a * lightColor.rgb;</span></span>
<span class="line"><span>  gl_FragColor.a = vColor.a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/e87fe067e3fc7461d4fd489e12461003.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/270356/e87fe067e3fc7461d4fd489e12461003.gif" alt=""></a></p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>今天，我们以绘制立方体和圆柱体为例，讲了用WebGL绘制三维几何体的基本原理。3D绘图在原理上和2D绘图几乎是完全一样的，就是构建顶点数据，然后将数据送入缓冲区执行绘制。只是，2D绘图用二维顶点数据，而3D绘图用三维定点数据。</p><p>另外，3D绘图时，我们除了构造顶点数据之外，还可以构造其他的数据，比较有用的是法向量。法向量是垂直于物体表面三角网格的向量，使用它可以来计算光照。在片元着色器中我们拿到的是经过模型矩阵变换后的顶点，使用法向量，我们还需要用一个法向量矩阵对它进行变换。法向量矩阵是模型矩阵的逆转置矩阵，它是一个3X3的矩阵，将法向量经过法向量矩阵变换后，我们就可以和片元着色器中的顶点进行运算了。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><ol><li>在今天的课程中，我们绘制出了正立方体。那你能修改例子中的cube函数，构造出非正立方体吗？新的cube函数签名如下：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> function cube(width = 1.0, height = 1.0, depth = 1.0, colors = [[1, 0, 0, 1]])</span></span></code></pre></div><ol start="2"><li>你能用我们今天讲的方法绘制出一个正四面体，并给不同的面设置不同的颜色，然后在正四面体上实现点光源光照效果吗？</li></ol><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>课程中完整示例代码见 <a href="https://github.com/akira-cn/graphics/tree/master/3d-basic" target="_blank" rel="noreferrer">GitHub仓库</a></p>`,90)])])}const b=n(l,[["render",i]]);export{g as __pageData,b as default};
