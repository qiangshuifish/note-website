import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"41 | 实战（五）：如何实现3D地球可视化（下）？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何选中地球上的地理位置？","slug":"如何选中地球上的地理位置","link":"#如何选中地球上的地理位置","children":[{"level":3,"title":"实现坐标转换","slug":"实现坐标转换","link":"#实现坐标转换","children":[]},{"level":3,"title":"高亮国家地区的方法","slug":"高亮国家地区的方法","link":"#高亮国家地区的方法","children":[]}]},{"level":2,"title":"如何在地球上放置标记？","slug":"如何在地球上放置标记","link":"#如何在地球上放置标记","children":[{"level":3,"title":"如何计算几何体摆放位置？","slug":"如何计算几何体摆放位置","link":"#如何计算几何体摆放位置","children":[]},{"level":3,"title":"摆放光柱","slug":"摆放光柱","link":"#摆放光柱","children":[]},{"level":3,"title":"摆放地标","slug":"摆放地标","link":"#摆放地标","children":[]}]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/41-实战（五）：如何实现3D地球可视化（下）？.md","filePath":"跟月影学可视化/41-实战（五）：如何实现3D地球可视化（下）？.md","lastUpdated":1779822292000}'),l={name:"跟月影学可视化/41-实战（五）：如何实现3D地球可视化（下）？.md"};function i(t,s,c,o,r,h){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_41-实战-五-如何实现3d地球可视化-下" tabindex="-1">41 | 实战（五）：如何实现3D地球可视化（下）？ <a class="header-anchor" href="#_41-实战-五-如何实现3d地球可视化-下" aria-label="Permalink to &quot;41 | 实战（五）：如何实现3D地球可视化（下）？&quot;">​</a></h1><p>你好，我是月影。</p><p>上节课，我们实现了一个有着星空背景的3D地球效果。但这个效果还比较简单，在某些可视化大屏项目中，我们不仅要呈现视觉效果，还要允许用户与可视化大屏中呈现的内容进行交互。所以这节课，我们会先给这个3D地球添加各种交互细节，比如让地球上的国家随着我们鼠标的移动而高亮，接着，我们再在地球上放置各种记号，比如光柱、地标等等。</p><h2 id="如何选中地球上的地理位置" tabindex="-1">如何选中地球上的地理位置？ <a class="header-anchor" href="#如何选中地球上的地理位置" aria-label="Permalink to &quot;如何选中地球上的地理位置？&quot;">​</a></h2><p>我们先来解决上节课留下的一个问题，为什么我们在绘制3D地球的时候，要大费周章地使用topoJSON数据，而不是直接用一个现成的等角方位投影的世界地图图片作为球体的纹理。这是因为，我们想让地球能够和我们的鼠标进行交互，比如当点击到地图上的中国区域的时候，我们想让中国显示高亮，这是纹理图片无法实现的。接下来，我们就来看看怎么实现这样交互的效果。</p><h3 id="实现坐标转换" tabindex="-1">实现坐标转换 <a class="header-anchor" href="#实现坐标转换" aria-label="Permalink to &quot;实现坐标转换&quot;">​</a></h3><p>实现交互效果的难点在于坐标转换。因为鼠标指向地球上的某个区域的时候，我们通过SpriteJS拿到的是当前鼠标在点击的地球区域的一个三维坐标，而这个坐标是不能直接判断点中的区域属于哪个国家的，我们需要将它转换成二维的地图经纬度坐标，才能通过地图数据来获取到当前经纬度下的国家或地区信息。</p><p>那如何实现这个坐标转换呢？首先，我们的鼠标在地球上移动的时候，通过SpriteJS，我们拿到三维的球面坐标，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layer.setRaycast();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>globe.addEventListener(&#39;mousemove&#39;, (e) =&amp;gt; {</span></span>
<span class="line"><span>  console.log(e.hit.localPoint);</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>skyBox.attributes.raycast = &#39;none&#39;;</span></span></code></pre></div><p>上面的代码中有一个小细节，我们将天空包围盒的raycast设置成了none。为什么要这么做呢？因为地球包围在天空盒子内，这样设置之后，鼠标就能穿透天空包围盒到达地球，如果不这么做，天空盒子就会遮挡住鼠标事件，地球也就捕获不到事件了。这样一来，当鼠标移动到地球上时，我们就可以得到相应的三维坐标信息了。</p><p>接下来，我们要将三维坐标信息转换为经纬度信息，那第一步就是将三维坐标转换为二维平面坐标。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 将球面坐标转换为平面地图坐标</span></span>
<span class="line"><span> * &amp;#64;param {*} x</span></span>
<span class="line"><span> * &amp;#64;param {*} y</span></span>
<span class="line"><span> * &amp;#64;param {*} z</span></span>
<span class="line"><span> * &amp;#64;param {*} radius</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>function unproject(x, y, z, radius = 1) {</span></span>
<span class="line"><span>  const pLength = Math.PI * 2;</span></span>
<span class="line"><span>  const tLength = Math.PI;</span></span>
<span class="line"><span>  const v = Math.acos(y / radius) / tLength; // const y = radius * Math.cos(v * tLength);</span></span>
<span class="line"><span>  let u = Math.atan2(-z, x) + Math.PI; // z / x = -1 * Math.tan(u * pLength);</span></span>
<span class="line"><span>  u /= pLength;</span></span>
<span class="line"><span>  return [u * mapScale * mapWidth, v * mapScale * mapHeight];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个球面和平面坐标转换，实际上就是将空间坐标系从球坐标系转换为平面直接坐标系。具体的转换方法是，我们先将球坐标系转为圆柱坐标系，再将圆柱坐标系转为平面直角坐标系。具体的公式推导过程比较复杂，我们没必要深入理解，你只要会用我给出的unproject函数就可以了。如果你对推导原理有兴趣可以回顾 <a href="https://time.geekbang.org/column/article/266346" target="_blank" rel="noreferrer">第15课</a>，自己来推导一下，或者阅读 <a href="https://zhuanlan.zhihu.com/p/34485962" target="_blank" rel="noreferrer">这篇文章</a>。</p><p>拿到了二维平面直角坐标之后，我们可以直接用等角方位投影函数的反函数将这个平面直角坐标转换为经纬度，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function positionToLatlng(x, y, z, radius = 1) {</span></span>
<span class="line"><span>  const [u, v] = unproject(x, y, z, radius);</span></span>
<span class="line"><span>  return projection.invert([u, v]);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接着，我们实现一个通过经纬度拿到国家信息的函数。这里，我们直接通过d3.geoContains方法，从countries数据中拿到对应的国家信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function getCountryInfo(latitude, longitude, countries) {</span></span>
<span class="line"><span>  if(!countries) return {index: -1};</span></span>
<span class="line"><span>  let idx = -1;</span></span>
<span class="line"><span>  countries.features.some((d, i) =&amp;gt; {</span></span>
<span class="line"><span>    const ret = d3.geoContains(d, [longitude, latitude]);</span></span>
<span class="line"><span>    if(ret) idx = i;</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  const info = idx &amp;gt;= 0 ? {...countries.features[idx]} : {};</span></span>
<span class="line"><span>  info.index = idx;</span></span>
<span class="line"><span>  return info;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样一来，我们只要修改mousemove方法，就可以知道我们的鼠标移动在哪个国家之上了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>globe.addEventListener(&#39;mousemove&#39;, (e) =&amp;gt; {</span></span>
<span class="line"><span>  const [lng, lat] = positionToLatlng(...e.hit.localPoint);</span></span>
<span class="line"><span>  const country = getCountryInfo(lat, lng, countries);</span></span>
<span class="line"><span>  if(country.properties) {</span></span>
<span class="line"><span>    console.log(country.properties.name);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span></code></pre></div><h3 id="高亮国家地区的方法" tabindex="-1">高亮国家地区的方法 <a class="header-anchor" href="#高亮国家地区的方法" aria-label="Permalink to &quot;高亮国家地区的方法&quot;">​</a></h3><p>下一步，我们就可以实现一个方法来高亮鼠标移动到的国家或地区了。要高亮对应的国家或地区，其实处理起来并不复杂。我们先把原始的非高亮的图片另存一份，然后根据选中国家的index信息，从contries原始数据中取出对应的那个国家，用不同的填充色fillStyle再绘制一次，最后更新texture和layer，就可以将高亮区域绘制出来了。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function highlightMap(texture, info, countries) {</span></span>
<span class="line"><span>  if(texture.index === info.index) return;</span></span>
<span class="line"><span>  const canvas = texture.image;</span></span>
<span class="line"><span>  if(!canvas) return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const idx = info.index;</span></span>
<span class="line"><span>  const highlightMapContxt = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(!imgCache) {</span></span>
<span class="line"><span>    imgCache = new OffscreenCanvas(canvas.width, canvas.height);</span></span>
<span class="line"><span>    imgCache.getContext(&#39;2d&#39;).drawImage(canvas, 0, 0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  highlightMapContxt.clearRect(0, 0, mapScale * mapWidth, mapScale * mapHeight);</span></span>
<span class="line"><span>  highlightMapContxt.drawImage(imgCache, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(idx &amp;gt; 0) {</span></span>
<span class="line"><span>    const path = d3.geoPath(projection).context(highlightMapContxt);</span></span>
<span class="line"><span>    highlightMapContxt.save();</span></span>
<span class="line"><span>    highlightMapContxt.fillStyle = &#39;#fff&#39;;</span></span>
<span class="line"><span>    highlightMapContxt.beginPath();</span></span>
<span class="line"><span>    path({type: &#39;FeatureCollection&#39;, features: countries.features.slice(idx, idx + 1)});</span></span>
<span class="line"><span>    highlightMapContxt.fill();</span></span>
<span class="line"><span>    highlightMapContxt.restore();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  texture.index = idx;</span></span>
<span class="line"><span>  texture.needsUpdate = true;</span></span>
<span class="line"><span>  layer.forceUpdate();</span></span></code></pre></div><p>仔细看上面的代码你会发现，这里我们实际上做了两点优化，一是我们在texture对象上记录了上一次选中区域的index。如果移动鼠标时，index没发生变化，说明鼠标仍然在当前高亮的国家内，没有必要重绘。二是我们保存了原始非高亮图片。之所以这样做，是因为我们只要将保存的非高亮图片通过drawImage一次绘制，然后再绘制高亮区域，就可以完成地图高亮效果，而不需要每次都重新用Path来绘制整个地图了，因而大大减少了Canvas2D绘图指令的数量，显著提升了性能。</p><p>实现了这个函数之后，我们改写mousemove事件处理函数，就能将这个交互效果完整地显示出来了。具体的代码和效果图如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>globe.addEventListener(&#39;mousemove&#39;, (e) =&amp;gt; {</span></span>
<span class="line"><span>  const [lng, lat] = positionToLatlng(...e.hit.localPoint);</span></span>
<span class="line"><span>  const country = getCountryInfo(lat, lng, countries);</span></span>
<span class="line"><span>  highlightMap(texture, country, countries);</span></span>
<span class="line"><span>});</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/14ea287ce617789ce37cd2e3d40ee4e8.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/14ea287ce617789ce37cd2e3d40ee4e8.gif" alt=""></a></p><h2 id="如何在地球上放置标记" tabindex="-1">如何在地球上放置标记？ <a class="header-anchor" href="#如何在地球上放置标记" aria-label="Permalink to &quot;如何在地球上放置标记？&quot;">​</a></h2><p>通过选中对应的国家，我们可以实现鼠标的移动的高亮交互效果。接下来，我们来实现另一个交互效果，在地球的指定经纬度处放置一些标记。</p><h3 id="如何计算几何体摆放位置" tabindex="-1">如何计算几何体摆放位置？ <a class="header-anchor" href="#如何计算几何体摆放位置" aria-label="Permalink to &quot;如何计算几何体摆放位置？&quot;">​</a></h3><p>既然要把物体放置在地球指定的经纬坐标处，那我们接下来的操作依然离不开坐标转换。首先，我们知道几何体通常默认是以中心点为（0,0）点，但我们放置的时候，却需要将物体的底部放置在球面上，所以我们需要对球面坐标位置进行一个坐标变换。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/82406267ec504e29b8d975789a4f8a06.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/82406267ec504e29b8d975789a4f8a06.jpg" alt=""></a></p><p>因此，我们在实现放置函数的时候，会通过 latlngToPosition 先将经纬度转成球面坐标pos，再延展到物体高度的一半，因为球心的坐标是0,0，所以pos位置就是对应的三维向量，我们使用scale就可以直接将它移动到我们要的高度了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function setGlobeTarget(globe, target, {latitude, longitude, transpose = false, ...attrs}) {</span></span>
<span class="line"><span>  const radius = globe.attributes.radius;</span></span>
<span class="line"><span>  if(transpose) target.transpose();</span></span>
<span class="line"><span>  if(latitude != null &amp;&amp; longitude != null) {</span></span>
<span class="line"><span>    const scale = target.attributes.scaleY * (attrs.scale || 1.0);</span></span>
<span class="line"><span>    const height = target.attributes.height;</span></span>
<span class="line"><span>    const pos = latlngToPosition(latitude, longitude, radius);</span></span>
<span class="line"><span>    // 要将底部放置在地面上</span></span>
<span class="line"><span>    pos.scale(height * 0.5 * scale / radius + 1);</span></span>
<span class="line"><span>    attrs.pos = pos;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  target.attr(attrs);</span></span>
<span class="line"><span>  const sp = new Vec3().copy(attrs.pos).scale(2);</span></span>
<span class="line"><span>  target.lookAt(sp);</span></span>
<span class="line"><span>  globe.append(target);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的 latlngToPosition 是前面 positionToLatlng 的反向操作，也就是先用 projection 函数将经纬度映射为地图上的直角坐标，然后用直角坐标转球面坐标的公式，将它转为球面坐标。具体的实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 将经纬度转换为球面坐标</span></span>
<span class="line"><span> * &amp;#64;param {*} latitude</span></span>
<span class="line"><span> * &amp;#64;param {*} longitude</span></span>
<span class="line"><span> * &amp;#64;param {*} radius</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>function latlngToPosition(latitude, longitude, radius = 1) {</span></span>
<span class="line"><span>  const [u, v] = projection([longitude, latitude]);</span></span>
<span class="line"><span>  return project(u, v, radius);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 将平面地图坐标转换为球面坐标</span></span>
<span class="line"><span> * &amp;#64;param {*} u</span></span>
<span class="line"><span> * &amp;#64;param {*} v</span></span>
<span class="line"><span> * &amp;#64;param {*} radius</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>function project(u, v, radius = 1) {</span></span>
<span class="line"><span>  u /= mapScale * mapWidth;</span></span>
<span class="line"><span>  v /= mapScale * mapHeight;</span></span>
<span class="line"><span>  const pLength = Math.PI * 2;</span></span>
<span class="line"><span>  const tLength = Math.PI;</span></span>
<span class="line"><span>  const x = -radius * Math.cos(u * pLength) * Math.sin(v * tLength);</span></span>
<span class="line"><span>  const y = radius * Math.cos(v * tLength);</span></span>
<span class="line"><span>  const z = radius * Math.sin(u * pLength) * Math.sin(v * tLength);</span></span>
<span class="line"><span>  return new Vec3(x, y, z);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了这个位置之后，我们将物体放上去，并且让物体朝向球面的法线方向。这一步我们可以用lookAt函数来实现。不过，lookAt函数是让物体的z轴朝向向量方向，而我们绘制的一些几何体，比如圆柱体，其实是要让y轴朝向向量方向，所以这种情况下，我们需要对几何体的顶点做一个转置操作，也就是将它的顶点向量的x、y、z的值轮换一下，让x = y、y = z、 z = x。这么做之后，我们就可以在地球表面摆放几何体了。</p><h3 id="摆放光柱" tabindex="-1">摆放光柱 <a class="header-anchor" href="#摆放光柱" aria-label="Permalink to &quot;摆放光柱&quot;">​</a></h3><p>我们先在地球的指定位置上放置一些光柱，光柱通常可以用来标记当前位置是一个重要的地点。光柱效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/2d02f5fd187b659b47a299baa4fe9e67.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/2d02f5fd187b659b47a299baa4fe9e67.gif" alt=""></a></p><p>这个效果怎么实现呢？因为光柱本身是圆柱体，所以我们可以用Cylindar对象来绘制。而光柱的光线还会随着高度衰减，对应的Shader代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    const beamVertx = \`</span></span>
<span class="line"><span>      precision highp float;</span></span>
<span class="line"><span>      precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      attribute vec3 position;</span></span>
<span class="line"><span>      attribute vec3 normal;</span></span>
<span class="line"><span>      attribute vec4 color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>      uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>      uniform mat3 normalMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      varying vec3 vNormal;</span></span>
<span class="line"><span>      varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      uniform vec4 ambientColor; // 环境光</span></span>
<span class="line"><span>      uniform float uHeight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      void main() {</span></span>
<span class="line"><span>        vNormal = normalize(normalMatrix * normal);</span></span>
<span class="line"><span>        vec3 ambient = ambientColor.rgb * color.rgb;// 计算环境光反射颜色</span></span>
<span class="line"><span>        float height = 0.5 - position.z / uHeight;</span></span>
<span class="line"><span>        vColor = vec4(ambient + 0.3 * sin(height), color.a * height);</span></span>
<span class="line"><span>        vec3 P = position;</span></span>
<span class="line"><span>        P.xy *= 2.0 - pow(height, 3.0);</span></span>
<span class="line"><span>        gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      \`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const beamFrag = \`</span></span>
<span class="line"><span>      precision highp float;</span></span>
<span class="line"><span>      precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      varying vec3 vNormal;</span></span>
<span class="line"><span>      varying vec4 vColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      void main() {</span></span>
<span class="line"><span>        gl_FragColor = vColor;</span></span></code></pre></div><p>实现Shader的代码并不复杂，在顶点着色器里，我们可以根据高度减少颜色的不透明度。另外，我们还可以根据高度对xy也就是圆柱的截面做一个扩展： P.xy *= 2.0 - pow(height, 3.0)，这样就能产生一种光线发散（顶部比底部略大）的效果了。</p><p>于是，对应的addBeam函数实现如下所示。它就是根据参数创建对应的圆柱体对象，并把它们添加到地球对应的经纬度位置上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function addBeam(globe, {</span></span>
<span class="line"><span>  latitude,</span></span>
<span class="line"><span>  longitude,</span></span>
<span class="line"><span>  width = 1.0,</span></span>
<span class="line"><span>  height = 25.0,</span></span>
<span class="line"><span>  color = &#39;rgba(245,250,113, 0.5)&#39;,</span></span>
<span class="line"><span>  raycast = &#39;none&#39;,</span></span>
<span class="line"><span>  segments = 60} = {}) {</span></span>
<span class="line"><span>  const layer = globe.layer;</span></span>
<span class="line"><span>  const radius = globe.attributes.radius;</span></span>
<span class="line"><span>  if(layer) {</span></span>
<span class="line"><span>    const r = width / 2;</span></span>
<span class="line"><span>    const scale = radius * 0.015;</span></span>
<span class="line"><span>    const program = layer.createProgram({</span></span>
<span class="line"><span>      transparent: true,</span></span>
<span class="line"><span>      vertex: beamVertx,</span></span>
<span class="line"><span>      fragment: beamFrag,</span></span>
<span class="line"><span>      uniforms: {</span></span>
<span class="line"><span>        uHeight: {value: height},</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    const beam = new Cylinder(program, {</span></span>
<span class="line"><span>      radiusTop: r,</span></span>
<span class="line"><span>      radiusBottom: r,</span></span>
<span class="line"><span>      radialSegments: segments,</span></span>
<span class="line"><span>      height,</span></span>
<span class="line"><span>      colors: color,</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    setGlobeTarget(globe, beam, {transpose: true, latitude, longitude, scale, raycast});</span></span>
<span class="line"><span>    return beam;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="摆放地标" tabindex="-1">摆放地标 <a class="header-anchor" href="#摆放地标" aria-label="Permalink to &quot;摆放地标&quot;">​</a></h3><p>除了摆放光柱，我们还可以摆放地标。地标通常表示当前位置产生了一个重大事件。地标实现起来会比光柱更复杂一些，它由一个定位点（Spot）和一个动态的标记（Marker）共同组成。摆放了地标的地图效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/bc82d420e44aed51be20a16f63c9434f.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/294944/bc82d420e44aed51be20a16f63c9434f.gif" alt=""></a></p><p>想要实现它，第一步我们还是要实现对应的Shader。不过，我们这次需要实现两组Shader。首先是spot的顶点着色器和片元着色器，实现起来也非常简单。在顶点着色器中，我们根据uWidth扩展x、y坐标，根据顶点绘制出一个特定大小的平面图形。在片元着色器中，我们让图形的中心稍亮一些，让边缘亮度随着距离衰减，这么做是为了增强视觉效果。不过，由于分辨率的原因，具体的效果在截图中可能体现不出来，你可以运行示例代码把地球局部放大，来实际观察和体会一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const spotVertex = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  attribute vec4 position;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>  uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>  uniform mat3 normalMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform float uWidth;</span></span>
<span class="line"><span>  uniform float uSpeed;</span></span>
<span class="line"><span>  uniform float uHeight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec2 st;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    float s = 0.0 + (0.2 * uWidth * position.w);</span></span>
<span class="line"><span>    vec3 P = vec3(s * position.xy, 0.0);</span></span>
<span class="line"><span>    st = P.xy;</span></span>
<span class="line"><span>    gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const spotFragment = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform vec2 uResolution;</span></span>
<span class="line"><span>  uniform vec3 uColor;</span></span>
<span class="line"><span>  uniform float uWidth;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec2 st;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    float d = distance(st, vec2(0));</span></span>
<span class="line"><span>    gl_FragColor.rgb = uColor + 1.5 * (0.2 * uWidth - 2.0 * d);</span></span>
<span class="line"><span>    gl_FragColor.a = 1.</span></span></code></pre></div><p>接着，我们实现marker的顶点着色器和片元着色器，它们稍微复杂一些。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const markerVertex = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  attribute vec4 position;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>  uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>  uniform mat3 normalMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform float uTime;</span></span>
<span class="line"><span>  uniform float uWidth;</span></span>
<span class="line"><span>  uniform float uSpeed;</span></span>
<span class="line"><span>  uniform float uHeight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying float time;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    time = mod(uTime, 1.5 / uSpeed) * uSpeed + position.z - 1.0;</span></span>
<span class="line"><span>    float d = clamp(0.0, uWidth * mix(1.0, 0.5, min(1.0, uHeight)), time);</span></span>
<span class="line"><span>    float s = d + (0.1 * position.w);</span></span>
<span class="line"><span>    vec3 P = vec3(s * position.xy, uHeight * time);</span></span>
<span class="line"><span>    gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const markerFragment = \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span>  precision highp int;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  uniform vec2 uResolution;</span></span>
<span class="line"><span>  uniform vec3 uColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying float time;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    float t = clamp(0.0, 1.0, time);</span></span>
<span class="line"><span>    gl_FragColor.rgb = uColor;</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0 - t</span></span></code></pre></div><p>在顶点着色器里，我们根据时间参数uTime来调整物体定点的高度。这样，当我们设置uHeight参数时，marker就能呈现出立体的效果。</p><p>有了这两组着色器之后，我们再实现两个函数，用来分别生成spot和marker的顶点，函数代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function makeSpotVerts(radis = 1.0, n_segments) {</span></span>
<span class="line"><span>  const vertex = [];</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt;= n_segments; i++) {</span></span>
<span class="line"><span>    const theta = Math.PI * 2 * i / n_segments;</span></span>
<span class="line"><span>    const x = radis * Math.cos(theta);</span></span>
<span class="line"><span>    const y = radis * Math.sin(theta);</span></span>
<span class="line"><span>    vertex.push(x, y, 1, 0, x, y, 1, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    position: {data: vertex, size: 4},</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function makeMarkerVerts(radis = 1.0, n_segments) {</span></span>
<span class="line"><span>  const vertex = [];</span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt;= n_segments; i++) {</span></span>
<span class="line"><span>    const theta = Math.PI * 2 * i / n_segments;</span></span>
<span class="line"><span>    const x = radis * Math.cos(theta);</span></span>
<span class="line"><span>    const y = radis * Math.sin(theta);</span></span>
<span class="line"><span>    vertex.push(x, y, 1, 0, x, y, 1, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  const copied = [...vertex];</span></span>
<span class="line"><span>  vertex.push(...copied.map((v, i) =&amp;gt; {</span></span>
<span class="line"><span>    return i % 4 === 2 ? 0.33 : v;</span></span>
<span class="line"><span>  }));</span></span>
<span class="line"><span>  vertex.push(...copied.map((v, i) =&amp;gt; {</span></span>
<span class="line"><span>    return i % 4 === 2 ? 0.67 : v;</span></span>
<span class="line"><span>  }));</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    position: {data: vertex, size: 4},</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这两个函数都是用生成正多边形顶点的算法来生成对应的顶点，它们的区别是，spot只生成一组顶点，因为是平面图形，所以z坐标为0，而marker则生成三组不同高度的顶点组成立体的形状。</p><p>接着，我们再实现一个初始化函数，用来生成spot和marker对应的WebGLProgram，函数代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function initMarker(layer, globe, {width, height, speed, color, segments}) {</span></span>
<span class="line"><span>  const markerProgram = layer.createProgram({</span></span>
<span class="line"><span>    transparent: true,</span></span>
<span class="line"><span>    vertex: markerVertex,</span></span>
<span class="line"><span>    fragment: markerFragment,</span></span>
<span class="line"><span>    uniforms: {</span></span>
<span class="line"><span>      uTime: {value: 0},</span></span>
<span class="line"><span>      uColor: {value: new Color(color).slice(0, 3)},</span></span>
<span class="line"><span>      uWidth: {value: width},</span></span>
<span class="line"><span>      uSpeed: {value: speed},</span></span>
<span class="line"><span>      uHeight: {value: height},</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const markerGeometry = new Geometry(layer.gl, makeMarkerVerts(globe.attributes.radius, segments));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const spotProgram = layer.createProgram({</span></span>
<span class="line"><span>    transparent: true,</span></span>
<span class="line"><span>    vertex: spotVertex,</span></span>
<span class="line"><span>    fragment: spotFragment,</span></span>
<span class="line"><span>    uniforms: {</span></span>
<span class="line"><span>      uTime: {value: 0},</span></span>
<span class="line"><span>      uColor: {value: new Color(color).slice(0, 3)},</span></span>
<span class="line"><span>      uWidth: {value: width},</span></span>
<span class="line"><span>      uSpeed: {value: speed},</span></span>
<span class="line"><span>      uHeight: {value: height},</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const spotGeometry = new Geometry(layer.gl, makeSpotVerts(globe.attributes.radius, segments));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    program: markerProgram,</span></span>
<span class="line"><span>    geometry: markerGeometry,</span></span>
<span class="line"><span>    spotGeometry,</span></span>
<span class="line"><span>    spotProgram,</span></span>
<span class="line"><span>    mode: &#39;TRIANGLE_STRIP&#39;,</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>最后，我们实现addMarker方法，将地标添加到地球上。这样，我们就实现了绘制地标的功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function addMarker(globe, {</span></span>
<span class="line"><span>  latitude,</span></span>
<span class="line"><span>  longitude,</span></span>
<span class="line"><span>  width = 1.0,</span></span>
<span class="line"><span>  height = 0.0,</span></span>
<span class="line"><span>  speed = 1.0,</span></span>
<span class="line"><span>  color = &#39;rgb(245,250,113)&#39;,</span></span>
<span class="line"><span>  segments = 60,</span></span>
<span class="line"><span>  lifeTime = Infinity} = {}) {</span></span>
<span class="line"><span>  const layer = globe.layer;</span></span>
<span class="line"><span>  const radius = globe.attributes.radius;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if(layer) {</span></span>
<span class="line"><span>    let mode = &#39;TRIANGLES&#39;;</span></span>
<span class="line"><span>    const ret = initMarker(layer, globe, {width, height, speed, color, segments});</span></span>
<span class="line"><span>    const markerProgram = ret.program;</span></span>
<span class="line"><span>    const markerGeometry = ret.geometry;</span></span>
<span class="line"><span>    const spotProgram = ret.spotProgram;</span></span>
<span class="line"><span>    const spotGeometry = ret.spotGeometry;</span></span>
<span class="line"><span>    mode = ret.mode;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if(markerProgram) {</span></span>
<span class="line"><span>      const pos = latlngToPosition(latitude, longitude, radius);</span></span>
<span class="line"><span>      const marker = new Mesh3d(markerProgram, {model: markerGeometry, mode});</span></span>
<span class="line"><span>      const spot = new Mesh3d(spotProgram, {model: spotGeometry, mode});</span></span>
<span class="line"><span>      setGlobeTarget(globe, marker, {pos, scale: 0.05, raycast: &#39;none&#39;});</span></span>
<span class="line"><span>      setGlobeTarget(globe, spot, {pos, scale: 0.05, raycast: &#39;none&#39;});</span></span>
<span class="line"><span>      layer.bindTime(marker.program);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if(Number.isFinite(lifeTime)) {</span></span>
<span class="line"><span>        setTimeout(() =&amp;gt; {</span></span>
<span class="line"><span>          layer.unbindTime(marker.program);</span></span>
<span class="line"><span>          marker.dispose();</span></span>
<span class="line"><span>          spot.dispose();</span></span>
<span class="line"><span>          marker.program.remove();</span></span>
<span class="line"><span>          spot.program.remove();</span></span>
<span class="line"><span>        }, lifeTime);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return {marker, spot};</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>今天，我们在上节课的基础上学习了与地球交互，以及在地球上放置标记的方法。</p><p>与地球交互的实现过程，我们可以总结为四步：首先我们通过将三维球面坐标转换为经纬度坐标，再通过topoJSON的API获取当前选中的国家或地区信息，然后在离屏Canvas上将当前选中的国家或地区高亮显示，最后更新纹理和重绘layer。这样，高亮显示的国家或地区就出现在3D地球上了。</p><p>而要在地球上放置标记，我们先要计算几何体摆放位置，然后实现标记对应的shader，创建WebGLProgram，最后将标记添加到地球表面对应经纬度换算的球面坐标位置处，用lookAt让它朝向法线方向就可以了。</p><p>到这里，地球3D可视化的核心功能我们就全部实现了。实际上，除了这些功能以外，我们还可以添加一些更加复杂的标记，比如两个点之间连线以及动态的飞线。这些功能实现的基本原理其实和放置标记是一样的，所以只要你掌握了我们今天讲的思路，就能比较轻松地解决这些需求了。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>实际上，地球上不仅可以放置普通的单点标记，还可以用曲线将两个地理点连接起来。具体的方法是在两个点之间计算弧线或贝塞尔曲线，然后将这些连线生成并绘制出来。在SpriteJS的3D扩展中有一个Path3d对象，它可以绘制空间中的三维曲线。你能试着实现两点之间的连线吗？如果很轻松就能实现，你还可以试着添加动画，实现两点之间的飞线动画效果。（提示：你可以通过官方文档来学习Path3d的用法，实现两点之间的连线。在实现飞线动画效果的时候，你可以参照GitHub仓库里的代码来进行学习，来理解我是怎么做的）</p><p>欢迎把你实现的效果分享到留言区，我们一起交流。也欢迎你把这节课转发出去，我们下节课见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>示例代码详见 <a href="https://github.com/akira-cn/graphics/tree/master/vis-geo-earth" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p><a href="https://zhuanlan.zhihu.com/p/34485962" target="_blank" rel="noreferrer">球坐标与直角坐标的转换</a></p>`,72)])])}const u=n(l,[["render",i]]);export{g as __pageData,u as default};
