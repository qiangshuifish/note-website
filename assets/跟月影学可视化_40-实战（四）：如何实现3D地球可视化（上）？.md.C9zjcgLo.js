import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"40| 实战（四）：如何实现3D地球可视化（上）？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何实现一个3D地球","slug":"如何实现一个3d地球","link":"#如何实现一个3d地球","children":[{"level":3,"title":"1. 绘制一个3D球体","slug":"_1-绘制一个3d球体","link":"#_1-绘制一个3d球体","children":[]},{"level":3,"title":"2. 绘制地图","slug":"_2-绘制地图","link":"#_2-绘制地图","children":[]},{"level":3,"title":"3. 将地图作为纹理","slug":"_3-将地图作为纹理","link":"#_3-将地图作为纹理","children":[]}]},{"level":2,"title":"如何实现星空背景","slug":"如何实现星空背景","link":"#如何实现星空背景","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]}],"relativePath":"跟月影学可视化/40-实战（四）：如何实现3D地球可视化（上）？.md","filePath":"跟月影学可视化/40-实战（四）：如何实现3D地球可视化（上）？.md","lastUpdated":1779822292000}'),l={name:"跟月影学可视化/40-实战（四）：如何实现3D地球可视化（上）？.md"};function t(i,s,c,o,r,h){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_40-实战-四-如何实现3d地球可视化-上" tabindex="-1">40| 实战（四）：如何实现3D地球可视化（上）？ <a class="header-anchor" href="#_40-实战-四-如何实现3d地球可视化-上" aria-label="Permalink to &quot;40| 实战（四）：如何实现3D地球可视化（上）？&quot;">​</a></h1><p>你好，我是月影。</p><p>前几节课我们一起进行了简单图表和二维地图的实战，这节课，我们来实现更炫酷的3D地球可视化。</p><p>3D地球可视化主要是以3D的方式呈现整个地球的模型，视觉上看起来更炫酷。它是可视化应用里常见的一种形式，通常用来实现全球地理信息相关的可视化应用，例如全球黑客攻防示意图、全球航班信息示意图以及全球贸易活动示意图等等。</p><p>因为内容比较多，所以我会用两节课来讲解3D地球的实现效果。而且，由于我们的关注点在效果，因此为了简化实现过程和把重点聚焦在效果上，我就不刻意准备数据了，我们用一些随机数据来实现。不过，即使我们要实现的是包含真实数据的3D可视化应用项目，前面学过的数据处理方法仍然是适用的。这里，我就不多说了。</p><p>在学习之前，你可以先看一下我们最终要实现的3D地球可视化效果，先有一个直观的印象。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/2d3a38yy1b1a0974a830a277150a54e5.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/2d3a38yy1b1a0974a830a277150a54e5.gif" alt=""></a></p><p>如上面动画图像所示，我们要做的3D可视化效果是一个悬浮于宇宙空间中的地球，它的背后是一些星空背景和浅色的光晕，并且地球在不停旋转的同时，会有一些不同的地点出现飞线动画。</p><p>接下来，我们就来一步步实现这样的效果。</p><h2 id="如何实现一个3d地球" tabindex="-1">如何实现一个3D地球 <a class="header-anchor" href="#如何实现一个3d地球" aria-label="Permalink to &quot;如何实现一个3D地球&quot;">​</a></h2><p>第一步，我们自然是要实现一个旋转的地球。通过前面课程的学习，我们知道直接用SpriteJS的3D扩展就可以方便地绘制3D图形。这里，我们再系统地说一下实现的方法。</p><h3 id="_1-绘制一个3d球体" tabindex="-1">1. 绘制一个3D球体 <a class="header-anchor" href="#_1-绘制一个3d球体" aria-label="Permalink to &quot;1\\. 绘制一个3D球体&quot;">​</a></h3><p>首先，我们加载SpriteJS和3D扩展，最简单的方式还是直接使用CDN上打包好的文件，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;script src=&quot;http://unpkg.com/spritejs/dist/spritejs.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span>
<span class="line"><span>&amp;lt;script src=&quot;http://unpkg.com/sprite-extend-3d/dist/sprite-extend-3d.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span></code></pre></div><p>加载完成之后，我们创建场景对象，添加Layer，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const {Scene} = spritejs;</span></span>
<span class="line"><span>const container = document.getElementById(&#39;container&#39;);</span></span>
<span class="line"><span>const scene = new Scene({</span></span>
<span class="line"><span>  container,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>const layer = scene.layer3d(&#39;fglayer&#39;, {</span></span>
<span class="line"><span>  alpha: false,</span></span>
<span class="line"><span>  camera: {</span></span>
<span class="line"><span>    fov: 35,</span></span>
<span class="line"><span>    pos: [0, 0, 5],</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>与2D的Layer不同，SpriteJS的3D扩展创建的Layer需要设置相机。这里，我们设置了一个透视相机，视角为35度，位置为 0, 0, 5</p><p>接着是创建WebGL的Program，我们通过Layer对象的createProgram来创建，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const {Sphere, shaders} = spritejs.ext3d;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const program = layer.createProgram({</span></span>
<span class="line"><span>  ...shaders.GEOMETRY,</span></span>
<span class="line"><span>  cullFace: null,</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>SpriteJS的3D扩展内置了一些常用的Shader，比如shaders.GEOMETRY 就是一个符合Phong反射模型的几何体Shader，所以这次，我们直接使用它。</p><p>接着，我们创建一个球体，它在SpriteJS的3D扩展中对应Sphere对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const globe = new Sphere(program, {</span></span>
<span class="line"><span>  colors: &#39;#333&#39;,</span></span>
<span class="line"><span>  widthSegments: 64,</span></span>
<span class="line"><span>  heightSegments: 32,</span></span>
<span class="line"><span>  radius: 1,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layer.append(globe);</span></span></code></pre></div><p>我们给球体设置颜色、宽度、高度和半径这些默认的属性，然后将它添加到layer上，这样我们就能在画布上将这个球体显示出来了，效果如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/11f33d265ded0f54973860671f265d21.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/11f33d265ded0f54973860671f265d21.jpeg" alt=""></a></p><p>现在，我们只在画布上显示了一个灰色的球体，它和我们要实现的地球还相差甚远。别着急，我们一步一步来。</p><h3 id="_2-绘制地图" tabindex="-1">2. 绘制地图 <a class="header-anchor" href="#_2-绘制地图" aria-label="Permalink to &quot;2\\. 绘制地图&quot;">​</a></h3><p>上节课，我们已经讲了绘制平面地图的方法，就是把表示地图的 JSON 数据利用墨卡托投影到平面上。接下来，我们也要先绘制一张平面地图，然后把它以纹理的方式添加到我们创建的3D球体上。</p><p>不过，与平面地图采用墨卡托投影不同，作为纹理的球面地图需要采用 <strong>等角方位投影</strong>(Equirectangular Projection)。d3-geo模块中同样支持这种投影方式，我们可以直接加载d3-geo模块，然后使用对应的代码来创建投影。</p><p>从CDN加载d3-geo模块需要加载以下两个JS文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;script src=&quot;https://d3js.org/d3-array.v2.min.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span>
<span class="line"><span>&amp;lt;script src=&quot;https://d3js.org/d3-geo.v2.min.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span></code></pre></div><p>然后，我们创建对应的投影：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const mapWidth = 960;</span></span>
<span class="line"><span>const mapHeight = 480;</span></span>
<span class="line"><span>const mapScale = 4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const projection = d3.geoEquirectangular();</span></span>
<span class="line"><span>projection.scale(projection.scale() * mapScale).translate([mapWidth * mapScale * 0.5, (mapHeight + 2) * mapScale * 0.5]);</span></span></code></pre></div><p>这里，我们首先通过 d3.geoEquirectangular 方法来创建等角方位投影，再将它进行缩放。d3的地图投影默认宽高为960 * 480，我们将投影缩放为4倍，也就是将地图绘制为 3480 * 1920大小。这样一来，它就能在大屏上显示得更清晰。</p><p>然后，我们通过tanslate将中心点调整到画布中心，因为JSON的地图数据的0,0点在画布正中心。仔细看我上面的代码，你会注意到我们在Y方向上多调整一个像素，这是因为原始数据坐标有一点偏差。</p><p>通过我刚才说的这些步骤，我们就创建好了投影，接下来就可以开始绘制地图了。我们从topoJSON数据加载地图。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>async function loadMap(src = topojsonData, {strokeColor, fillColor} = {}) {</span></span>
<span class="line"><span>  const data = await (await fetch(src)).json();</span></span>
<span class="line"><span>  const countries = topojson.feature(data, data.objects.countries);</span></span>
<span class="line"><span>  const canvas = new OffscreenCanvas(mapScale * mapWidth, mapScale * mapHeight);</span></span>
<span class="line"><span>  const context = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span>  context.imageSmoothingEnabled = false;</span></span>
<span class="line"><span>  return drawMap({context, countries, strokeColor, fillColor});</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们创建一个离屏Canvas，用加载的数据来绘制地图到离屏Canvas上，对应的绘制地图的逻辑如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function drawMap({</span></span>
<span class="line"><span>  context,</span></span>
<span class="line"><span>  countries,</span></span>
<span class="line"><span>  strokeColor = &#39;#666&#39;,</span></span>
<span class="line"><span>  fillColor = &#39;#000&#39;,</span></span>
<span class="line"><span>  strokeWidth = 1.5,</span></span>
<span class="line"><span>} = {}) {</span></span>
<span class="line"><span>  const path = d3.geoPath(projection).context(context);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  context.save();</span></span>
<span class="line"><span>  context.strokeStyle = strokeColor;</span></span>
<span class="line"><span>  context.lineWidth = strokeWidth;</span></span>
<span class="line"><span>  context.fillStyle = fillColor;</span></span>
<span class="line"><span>  context.beginPath();</span></span>
<span class="line"><span>  path(countries);</span></span>
<span class="line"><span>  context.fill();</span></span>
<span class="line"><span>  context.stroke();</span></span>
<span class="line"><span>  context.restore();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return context.canvas;</span></span></code></pre></div><p>这样，我们就完成了地图加载和绘制的逻辑。当然，我们现在还看不到地图，因为我们只是将它绘制到了一个离屏的Canvas对象上，并没有将这个对象显示出来。</p><h3 id="_3-将地图作为纹理" tabindex="-1">3. 将地图作为纹理 <a class="header-anchor" href="#_3-将地图作为纹理" aria-label="Permalink to &quot;3\\. 将地图作为纹理&quot;">​</a></h3><p>要显示地图为3D地球，我们需要将刚刚绘制的地图作为纹理添加到之前绘制的球体上。之前我们绘制球体时，使用的是SpriteJS中默认的shader，它是符合Phong光照模型的几何材质的。因为考虑到地球有特殊光照，我们现在自己实现一组自定义的shader。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const vertex = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  attribute vec3 position;</span></span>
<span class="line"><span>  attribute vec3 normal;</span></span>
<span class="line"><span>  attribute vec4 color;</span></span>
<span class="line"><span>  attribute vec2 uv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>  uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>  uniform mat3 normalMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec3 vNormal;</span></span>
<span class="line"><span>  varying vec2 vUv;</span></span>
<span class="line"><span>  varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform vec3 pointLightPosition; //点光源位置</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    vNormal = normalize(normalMatrix * normal);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vUv = uv;</span></span>
<span class="line"><span>    vColor = color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const fragment = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec3 vNormal;</span></span>
<span class="line"><span>  varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform sampler2D tMap;</span></span>
<span class="line"><span>  varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform vec2 uResolution;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    vec4 color = vColor;</span></span>
<span class="line"><span>    vec4 texColor = texture2D(tMap, vUv);</span></span>
<span class="line"><span>    vec2 st = gl_FragCoord.xy / uResolution;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    float alpha = texColor.a;</span></span>
<span class="line"><span>    color.rgb = mix(color.rgb, texColor.rgb, alpha);</span></span>
<span class="line"><span>    color.rgb = mix(texColor.rgb, color.rgb, clamp(color.a / max(0.0001, texColor.a), 0.0, 1.0));</span></span>
<span class="line"><span>    color.a = texColor.a + (1.0 - texColor.a) * color.a;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    float d = distance(st, vec2(0.5));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    gl_FragColor.rgb = color.rgb + 0.3 * pow((1.0 - d), 3.0);</span></span>
<span class="line"><span>    gl_FragColor.a = color.a;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span></code></pre></div><p>我们用上面的Shader来创建Program。这组Shader并不复杂，原理我们在视觉篇都已经解释过了。如果你觉得理解起来依然有困难，可以复习一下视觉篇的内容。接着，我们创建一个Texture对象，将它赋给Program对象，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const texture = layer.createTexture({});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const program = layer.createProgram({</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>  texture,</span></span>
<span class="line"><span>  cullFace: null,</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>现在，画布上就显示出了一个中心有些亮光的球体。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/aeb4a6736810d9d5674b48b1e683800d.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/aeb4a6736810d9d5674b48b1e683800d.jpeg" alt=""></a></p><p>从中，我们还是看不出地球的样子。这是因为我们给的texture对象是一个空的纹理对象。接下来，我们只要执行loadMap方法，将地图加载出来，再添加给这个空的纹理对象，然后刷新画布就可以了。对应代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>loadMap().then((map) =&amp;gt; {</span></span>
<span class="line"><span>  texture.image = map;</span></span>
<span class="line"><span>  texture.needsUpdate = true;</span></span>
<span class="line"><span>  layer.forceUpdate();</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>最终，我们就显示出了地球的样子。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/b637c0ae60390d16ed72a17749a8d9a3.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/b637c0ae60390d16ed72a17749a8d9a3.jpeg" alt=""></a></p><p>我们还可以给地球添加轨迹球控制，并让它自动旋转。在SpriteJS中非常简单，只需要一行代码即可完成。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layer.setOrbit({autoRotate: true}); // 开启旋转控制</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/063675af883cf21766ba63af91f74347.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/063675af883cf21766ba63af91f74347.gif" alt=""></a></p><p>这样我们就得到一个自动旋转的地球效果了。</p><h2 id="如何实现星空背景" tabindex="-1">如何实现星空背景 <a class="header-anchor" href="#如何实现星空背景" aria-label="Permalink to &quot;如何实现星空背景&quot;">​</a></h2><p>不过，这个孤零零的地球悬浮在黑色背景的空间里，看起来不是很吸引人，所以我们可以给地球添加一些背景，比如星空，让它真正悬浮在群星闪耀的太空中。</p><p>要实现星空的效果，第一步是要创建一个天空包围盒。天空包围盒也是一个球体（Sphere）对象，只不过它要比地球大很多，以此让摄像机处于整个球体内部。为了显示群星，天空包围盒有自己特殊的Shader。我们来看一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const skyVertex = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  attribute vec3 position;</span></span>
<span class="line"><span>  attribute vec3 normal;</span></span>
<span class="line"><span>  attribute vec2 uv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform mat3 normalMatrix;</span></span>
<span class="line"><span>  uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>  uniform mat4 projectionMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    vUv = uv;</span></span>
<span class="line"><span>    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const skyFragment = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span>  varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  highp float random(vec2 co)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    highp float a = 12.9898;</span></span>
<span class="line"><span>    highp float b = 78.233;</span></span>
<span class="line"><span>    highp float c = 43758.5453;</span></span>
<span class="line"><span>    highp float dt= dot(co.xy ,vec2(a,b));</span></span>
<span class="line"><span>    highp float sn= mod(dt,3.14);</span></span>
<span class="line"><span>    return fract(sin(sn) * c);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Value Noise by Inigo Quilez - iq/2013</span></span>
<span class="line"><span>  // https://www.shadertoy.com/view/lsf3WH</span></span>
<span class="line"><span>  highp float noise(vec2 st) {</span></span>
<span class="line"><span>    vec2 i = floor(st);</span></span>
<span class="line"><span>    vec2 f = fract(st);</span></span>
<span class="line"><span>    vec2 u = f * f * (3.0 - 2.0 * f);</span></span>
<span class="line"><span>    return mix( mix( random( i + vec2(0.0,0.0) ),</span></span>
<span class="line"><span>                    random( i + vec2(1.0,0.0) ), u.x),</span></span>
<span class="line"><span>                mix( random( i + vec2(0.0,1.0) ),</span></span>
<span class="line"><span>                    random( i + vec2(1.0,1.0) ), u.x), u.y);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    gl_FragColor.rgb = vec3(1.0);</span></span>
<span class="line"><span>    gl_FragColor.a = step(0.93, noise(vUv * 6000.0));</span></span></code></pre></div><p>上面的代码是天空包围盒的Shader，实际上它是我们使用二维噪声的技巧来实现的。在第16节课中也有过类似的做法，当时我们是用它来模拟水滴滚过的效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/72fbc484227f00ec4dcf7f2729c8f391.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/72fbc484227f00ec4dcf7f2729c8f391.jpeg" alt=""></a></p><p>但在这里，我们通过step函数和vUv的缩放，将它缩小之后，最终呈现出来星空效果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/e2dfac7b34718ecc347969f807a6f9c5.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/e2dfac7b34718ecc347969f807a6f9c5.jpeg" alt=""></a></p><p>对应的创建天空盒子的JavaScript代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function createSky(layer, skyProgram) {</span></span>
<span class="line"><span>  skyProgram = skyProgram || layer.createProgram({</span></span>
<span class="line"><span>    vertex: skyVertex,</span></span>
<span class="line"><span>    fragment: skyFragment,</span></span>
<span class="line"><span>    transparent: true,</span></span>
<span class="line"><span>    cullFace: null,</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  const skyBox = new Sphere(skyProgram);</span></span>
<span class="line"><span>  skyBox.attributes.scale = 100;</span></span>
<span class="line"><span>  layer.append(skyBox);</span></span>
<span class="line"><span>  return skyBox;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>createSky(layer);</span></span></code></pre></div><p>不过，光看这些代码，你可能还不能完全明白，为什么二维噪声技巧就能实现星空效果。那也不要紧，完整的示例代码在 <a href="https://github.com/akira-cn/graphics/tree/master/vis-geo-earth" target="_blank" rel="noreferrer">GitHub仓库</a> 中，最好的理解方式还是你自己试着手动修改一下skyFragment中的绘制参数，看看实现出来效果，你就能明白了。</p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这节课，我们讲了实现3D地球可视化效果的方法，以及给3D地球添加天空背景的方法。</p><p>要实现3D地球效果，我们可以使用SpriteJS和它的3D扩展库。首先，我们绘制一个3D球体。然后，我们用topoJSON数据绘制地图，注意地图的投影方式必须选择等角方位投影。最后，我们把地图作为纹理添加到3D球体上，这样就绘制出了3D地球。</p><p>而要实现星空背景，我们需要创建一个天空盒子，它可以看成是一个放大很多倍的球体，包裹在地球的外面。具体的思路就是，我们创建一组特殊的Shader，通过二维噪声来实现星空的效果。</p><p>说的这里，你可能会有一些疑问，我们为什么要用topoJSON数据来绘制地图，而不采用现成的等角方位投影的平面地图图片，直接用它来作为纹理，那样不是能够更快绘制出3D地球吗？的确，这样确实也能够更简单地绘制出3D地球，但这么做也有代价，就是我们没有地图数据就不能进一步实现交互效果了，比如说，点击某个地理区域实现当前国家地区的高亮效果了。</p><p>那在下节课，我们就会进一步讲解怎么在3D地球上添加交互效果，以及根据地理位置来放置各种记号。你的疑问也都会一一解开。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>我们说，如果不考虑交互，可以直接使用更简单的等角方位投影地图作为纹理来直接绘制3D地球。你能试着在网上搜索类似的纹理图片来实现3D地球效果吗？</p><p>另外，你可以找类似的其他行星的图片，比如火星、木星图片来实现3D火星、木星的效果吗？</p><p>最后，你也可以想想，除了星空背景，如果我们还想在地球外部实现一层淡绿色的光晕，又该怎么做呢（提示：你可以使用距离场和颜色插值来实现）？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/bcc477ea54486f586e2b90715c944439.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294332/bcc477ea54486f586e2b90715c944439.gif" alt=""></a></p><p>今天的3D地球可视化实战就到这里了。欢迎把你实现的效果分享到留言区，我们一起交流。也欢迎把这节课转发出去，我们下节课见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p><a href="https://github.com/akira-cn/graphics/tree/master/vis-geo-earth" target="_blank" rel="noreferrer">课程完整示例代码详</a></p>`,80)])])}const u=a(l,[["render",t]]);export{d as __pageData,u as default};
