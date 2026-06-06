import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"16 | 如何使用噪声生成复杂的纹理？","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是噪声？","slug":"什么是噪声","link":"#什么是噪声","children":[]},{"level":2,"title":"如何实现噪声函数？","slug":"如何实现噪声函数","link":"#如何实现噪声函数","children":[]},{"level":2,"title":"噪声的应用","slug":"噪声的应用","link":"#噪声的应用","children":[{"level":3,"title":"梯度噪声","slug":"梯度噪声","link":"#梯度噪声","children":[]},{"level":3,"title":"用噪声实现云雾效果","slug":"用噪声实现云雾效果","link":"#用噪声实现云雾效果","children":[]},{"level":3,"title":"Simplex Noise","slug":"simplex-noise","link":"#simplex-noise","children":[]},{"level":3,"title":"网格噪声","slug":"网格噪声","link":"#网格噪声","children":[]}]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/16-如何使用噪声生成复杂的纹理？.md","filePath":"跟月影学可视化/16-如何使用噪声生成复杂的纹理？.md","lastUpdated":1779822292000}'),i={name:"跟月影学可视化/16-如何使用噪声生成复杂的纹理？.md"};function l(t,s,c,o,r,h){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="_16-如何使用噪声生成复杂的纹理" tabindex="-1">16 | 如何使用噪声生成复杂的纹理？ <a class="header-anchor" href="#_16-如何使用噪声生成复杂的纹理" aria-label="Permalink to &quot;16 | 如何使用噪声生成复杂的纹理？&quot;">​</a></h1><p>你好，我是月影。</p><p>在 <a href="https://time.geekbang.org/column/article/262330" target="_blank" rel="noreferrer">第11节课</a> 中，我们使用随机技巧生成噪点、迷宫等复杂图案。它们的作用都是表达数据和增强视觉效果。要想在可视化视觉呈现中实现更加酷炫的视觉效果，我们经常需要生成能够模拟大自然的、丰富而复杂的纹理图案。</p><p>那么这节课，我们就继续来讨论，如何使用随机技巧来生成更加复杂的纹理图案。</p><h2 id="什么是噪声" tabindex="-1">什么是噪声？ <a class="header-anchor" href="#什么是噪声" aria-label="Permalink to &quot;什么是噪声？&quot;">​</a></h2><p>我们先来回忆一下，随机效果是怎么生成的。在第11节课中，我们使用一个离散的二维伪随机函数，随机生成了一片带有噪点的图案。代码和最终效果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/3a539a23b70f8ca34a3c126139035d8e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/3a539a23b70f8ca34a3c126139035d8e.jpeg" alt=""></a></p><p>然后，我们用取整的技巧，将这个图案局部放大，就呈现出了如下的方格状图案：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/4082865db53e073b31520b9cyy90642a.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/4082865db53e073b31520b9cyy90642a.jpeg" alt=""></a></p><p>在真实的自然界中，这种离散的随机是存在的，比如鸟雀随机地鸣叫，蝉鸣随机地响起再停止，雨滴随机地落在某个位置等等。但随机和连续并存是更常见的情况，比如山脉的走向是随机的，山峰之间的高度又是连续，类似的还有天上的云朵、水流的波纹、被侵蚀的土地等等。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/0441979299f96d57f2a6c87d0c9f08c0.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/0441979299f96d57f2a6c87d0c9f08c0.jpeg" alt=""></a></p><p>因此，要模拟这些真实自然的图形，我们就需要把随机和连续结合起来，这样就形成了 <strong>噪声</strong>（Noise）。</p><h2 id="如何实现噪声函数" tabindex="-1">如何实现噪声函数？ <a class="header-anchor" href="#如何实现噪声函数" aria-label="Permalink to &quot;如何实现噪声函数？&quot;">​</a></h2><p>随机和连续究竟是怎么合成的呢？换句话说，噪声函数是怎么实现的呢？</p><p>因为随机数是离散的，那如果我们对离散的随机点进行插值，可以让每个点之间的值连续过渡。因此，我们用smoothstep或者用平滑的三次样条来插值，就可以形成一条连续平滑的随机曲线。</p><p>下面，我们就通过生成折线的小例子来验证一下。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 随机函数</span></span>
<span class="line"><span>float random (float x) {</span></span>
<span class="line"><span>  return fract(sin(x * 1243758.5453123));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv - vec2(0.5);</span></span>
<span class="line"><span>  st *= 10.0;</span></span>
<span class="line"><span>  float i = floor(st.x);</span></span>
<span class="line"><span>  float f = fract(st.x);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // d直接等于随机函数返回值，这样d不连续</span></span>
<span class="line"><span>  float d = random(i);</span></span>
<span class="line"><span>  // float d = mix(random(i), random(i + 1.0), f);</span></span>
<span class="line"><span>  // float d = mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f));</span></span>
<span class="line"><span>  // float d = mix(random(i), random(i + 1.0), f * f * (3.0 - 2.0 * f));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  gl_FragColor.rgb = (smoothstep(st.y - 0.05, st.y, d) - smoothstep(st.y, st.y + 0.05, d)) * vec3(1.0);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先，我们对floor(st.x)取随机数，取出10个不同的d值，然后把它们绘制出来，就能在画布上呈现出10段不连续的线段。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/2c89840e5d6e10ed22188bdc827b762c.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/2c89840e5d6e10ed22188bdc827b762c.jpeg" alt=""></a></p><p>然后，我们用 mix(random(i), random(i + 1.0), f); 替换 random(i)（你可以将上面代码第18行注释掉，将第19行注释去掉），那么这些线段的首尾就会连起来，也就是说我们将得到一段连续的折线。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/aeccd8853f623190c30ed74759dfafd4.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/aeccd8853f623190c30ed74759dfafd4.jpeg" alt=""></a></p><p>不过，我们得到的折线虽然连续，但因为这个函数在端点处不可导，所以它不平滑。因此，我们可以改用 mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f)); 替换 random(i)（上面代码的第20行），或者直接采用三次多项式 mix(random(i), random(i + 1.0), f * f * (3.0 - 2.0 * f));（上面代码的第21行，这个三次多形式能达到和smoothstep一样的效果）来替换step。这样，我们就得到一条连续并且平滑的曲线了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/f4a05f47b8520ec2bf0dff35d561244a.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/f4a05f47b8520ec2bf0dff35d561244a.jpeg" alt=""></a></p><p>这也就是我们想要的噪声函数了。</p><p>但是，这个函数是一维的，如果要使用二维的，我们还可以把它扩展到二维。这个时候，我们就必须要知道，二维噪声和一维噪声之间的区别。很明显，一维噪声是对两点进行插值的，而二维噪声需要对平面画布上方形区域的四个顶点，分别从x、y方向进行两次插值。</p><p><a href="https://thebookofshaders.com/11/?lan=ch" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/9802a1a82dd52d108c1d5yy449cefbef.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/9802a1a82dd52d108c1d5yy449cefbef.jpeg" alt=""></a></a></p><p>具体怎么做呢？我们可以把st与方形区域的四个顶点（对应四个向量）做插值，这样就能得到二维噪声。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float random (vec2 st) {</span></span>
<span class="line"><span>    return fract(sin(dot(st.xy,</span></span>
<span class="line"><span>                        vec2(12.9898,78.233)))*</span></span>
<span class="line"><span>        43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 二维噪声，对st与方形区域的四个顶点插值</span></span>
<span class="line"><span>highp float noise(vec2 st) {</span></span>
<span class="line"><span>    vec2 i = floor(st);</span></span>
<span class="line"><span>    vec2 f = fract(st);</span></span>
<span class="line"><span>    vec2 u = f * f * (3.0 - 2.0 * f);</span></span>
<span class="line"><span>    return mix( mix( random( i + vec2(0.0,0.0) ),</span></span>
<span class="line"><span>                    random( i + vec2(1.0,0.0) ), u.x),</span></span>
<span class="line"><span>                mix( random( i + vec2(0.0,1.0) ),</span></span>
<span class="line"><span>                    random( i + vec2(1.0,1.0) ), u.x), u.y);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = vUv * 20.0;</span></span>
<span class="line"><span>    gl_FragColor.rgb = vec3(noise(st));</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面的代码，我们就可以得到下面这个看起来比较模糊的噪声图案。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/fb617c991c7abfa6b61fcb298ce4a8b3.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/fb617c991c7abfa6b61fcb298ce4a8b3.jpeg" alt=""></a></p><h2 id="噪声的应用" tabindex="-1">噪声的应用 <a class="header-anchor" href="#噪声的应用" aria-label="Permalink to &quot;噪声的应用&quot;">​</a></h2><p>那你可能想问了，我们上面实现的一维噪声波形和二维的模糊噪声图案都比较简单，那它们到底是怎么模拟自然界中的现象，又该怎么实现有趣的视觉效果呢？</p><p>接下来，我们先结合上面得到的噪声函数，来讲2个简单的噪声应用，让你对它们能有更具体的认知。然后，我会在此基础上，再讲一些其他噪声函数，以及噪声能实现的更复杂视觉效果，让你对噪声有更深入的理解。</p><p>首先，我们可以结合噪声和距离场，来实现类似于水滴滚过物体表面的效果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = mix(vec2(-10, -10), vec2(10, 10), vUv);</span></span>
<span class="line"><span>    float d = distance(st, vec2(0));</span></span>
<span class="line"><span>    d *= noise(uTime + st);</span></span>
<span class="line"><span>    d = smoothstep(0.0, 1.0, d) - step(1.0, d);</span></span>
<span class="line"><span>    gl_FragColor.rgb = vec3(d);</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/a6325bb4912957b864390789c5468118.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/a6325bb4912957b864390789c5468118.gif" alt=""></a></p><p>我们也可以使用不同的距离场构造方式，加上旋转噪声，构造出类似于木头的条纹。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>float lines(in vec2 pos, float b){</span></span>
<span class="line"><span>  float scale = 10.0;</span></span>
<span class="line"><span>  pos *= scale;</span></span>
<span class="line"><span>  return smoothstep(0.0, 0.5 + b * 0.5, abs((sin(pos.x * 3.1415) + b * 2.0)) * 0.5);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec2 rotate(vec2 v0, float ang) {</span></span>
<span class="line"><span>  float sinA = sin(ang);</span></span>
<span class="line"><span>  float cosA = cos(ang);</span></span>
<span class="line"><span>  mat3 m = mat3(cosA, -sinA, 0, sinA, cosA, 0, 0, 0, 1);</span></span>
<span class="line"><span>  return (m * vec3(v0, 1.0)).xy;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv.yx * vec2(10.0, 3.0);</span></span>
<span class="line"><span>  st = rotate(st, noise(st));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  float d = lines(st, 0.5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  gl_FragColor.rgb = 1.0 - vec3(d);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/e8237529e1aa3795e89ea3a9366a56fe.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/e8237529e1aa3795e89ea3a9366a56fe.jpeg" alt=""></a></p><p>这两个应用的实现代码非常简单，你直接看代码就能理解。我更希望的是，你能通过我给出的代码，来理解这种噪声结合距离场的实现思路。</p><h3 id="梯度噪声" tabindex="-1">梯度噪声 <a class="header-anchor" href="#梯度噪声" aria-label="Permalink to &quot;梯度噪声&quot;">​</a></h3><p>我们前面说的噪声算法，它的原理是对离散的随机值进行插值，因此它又被称为 <strong>插值噪声</strong>（Value Noise）。插值噪声有一个缺点，就是它的值的梯度不均匀。最直观的表现就是，二维噪声图像有明显的“块状”特点，不够平滑。</p><p>想要解决这个问题，我们可以使用另一种噪声算法，也就是 <strong>梯度噪声</strong>（Gradient Noise）。梯度噪声是对随机的二维向量来插值，而不是一维的随机数。这样我们就能够获得更加平滑的噪声效果。梯度噪声的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec2 random2(vec2 st){</span></span>
<span class="line"><span>  st = vec2( dot(st,vec2(127.1,311.7)),</span></span>
<span class="line"><span>            dot(st,vec2(269.5,183.3)) );</span></span>
<span class="line"><span>  return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Gradient Noise by Inigo Quilez - iq/2013</span></span>
<span class="line"><span>// https://www.shadertoy.com/view/XdXGW8</span></span>
<span class="line"><span>float noise(vec2 st) {</span></span>
<span class="line"><span>  vec2 i = floor(st);</span></span>
<span class="line"><span>  vec2 f = fract(st);</span></span>
<span class="line"><span>  vec2 u = f * f * (3.0 - 2.0 * f);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),</span></span>
<span class="line"><span>                  dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),</span></span>
<span class="line"><span>              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),</span></span>
<span class="line"><span>                  dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = vUv * 20.0;</span></span>
<span class="line"><span>    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>梯度噪声可以平滑到什么程度呢？我在下面给出了两种噪声算法生成的图像，你可以明显得看出对比。第一个图是插值噪声的效果，黑白色之间过渡不够平滑，还有明显的色块感，第二个图是梯度噪声的效果，黑白的过渡就明显平滑多了，不再呈现块状。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/f553f0eb5621f795a134e6d85478e52d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/f553f0eb5621f795a134e6d85478e52d.png" alt=""></a></p><p>因此，梯度噪声在二维空间中的应用更广泛，许多有趣的模拟自然界特效的视觉实现都采用了梯度噪声。你可以研究一下 <a href="https://www.shadertoy.com/" target="_blank" rel="noreferrer">Shadertoy.com</a> 平台上的一些例子，其中很多模拟自然界的例子都和梯度噪声有关，我就不一一列举了。</p><h3 id="用噪声实现云雾效果" tabindex="-1">用噪声实现云雾效果 <a class="header-anchor" href="#用噪声实现云雾效果" aria-label="Permalink to &quot;用噪声实现云雾效果&quot;">​</a></h3><p>我还想给你讲一种使用噪声来模拟云雾效果的方法。如果你看过极客时间里winter老师的《重学前端》，可能对这个方法有所了解，因为他在一篇加餐简单提到过。在这里，我想给你详细说说云雾效果究竟是怎么实现的。</p><p>我们可以通过改变噪声范围，然后按照不同权重来叠加的方式创造云雾效果。比如，我们可以将噪声叠加6次，然后让它每次叠加的时候范围扩大一倍，但是权重减半。通过这个新的噪声算法，我们就能生成云雾效果了。你也可以试试，让这个噪声配合色相变化，可以创造出非常有趣的图形，比如模拟飞机航拍效果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define OCTAVES 6</span></span>
<span class="line"><span>float mist(vec2 st) {</span></span>
<span class="line"><span>  //Initial values</span></span>
<span class="line"><span>  float value = 0.0;</span></span>
<span class="line"><span>  float amplitude = 0.5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 叠加6次</span></span>
<span class="line"><span>  for(int i = 0; i &amp;lt; OCTAVES; i++) {</span></span>
<span class="line"><span>    // 每次范围扩大一倍，权重减半</span></span>
<span class="line"><span>    value += amplitude * noise(st);</span></span>
<span class="line"><span>    st *= 2.0;</span></span>
<span class="line"><span>    amplitude *= 0.5;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return value;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//配合色相的变化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv;</span></span>
<span class="line"><span>  st.x += 0.1 * uTime;</span></span>
<span class="line"><span>  gl_FragColor.rgb = hsb2rgb(vec3 (mist(st), 1.0, 1.0));</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/3f1719cb63f5e6d0c0d182a15505e5f2.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/3f1719cb63f5e6d0c0d182a15505e5f2.gif" alt=""></a></p><h3 id="simplex-noise" tabindex="-1">Simplex Noise <a class="header-anchor" href="#simplex-noise" aria-label="Permalink to &quot;Simplex Noise&quot;">​</a></h3><p>接下来，我还想给你讲一种更新的噪声算法，它是Ken Perlin在2001 年的 Siggraph会议上展示的Simplex Noise算法。</p><p>相比于前面的噪声算法，Simplex Noise算法有更低的计算复杂度和更少的乘法运算，并且可以用更少的计算量达到更高的维度，而且它制造出的噪声非常自然。</p><p>Simplex Noise与插值噪声以及梯度噪声的不同之处在于，它不是对四边形进行插值，而是对三角网格进行插值。与四边形插值相比，三角网格插值需要计算的点更少了，这样自然大大降低了计算量，从而提升了渲染性能。</p><p>Simplex Noise具体的实现思路非常精巧和复杂，其中包含的数学技巧比较高深，这里我就不详细来讲了，如果你有兴趣学习可以参考 <a href="https://thebookofshaders.com/11/?lan=ch" target="_blank" rel="noreferrer">Book of Shaders的文章</a> 来学习。</p><p>尽管Simplex Noise的原理很巧妙和复杂，但是在Shader中实现Simplex Noise代码并不算太复杂，你可以记住下面的代码，在需要的时候直接拿来使用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }</span></span>
<span class="line"><span>vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }</span></span>
<span class="line"><span>vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>// Description : GLSL 2D simplex noise function</span></span>
<span class="line"><span>//      Author : Ian McEwan, Ashima Arts</span></span>
<span class="line"><span>//  Maintainer : ijm</span></span>
<span class="line"><span>//     Lastmod : 20110822 (ijm)</span></span>
<span class="line"><span>//     License :</span></span>
<span class="line"><span>//  Copyright (C) 2011 Ashima Arts. All rights reserved.</span></span>
<span class="line"><span>//  Distributed under the MIT License. See LICENSE file.</span></span>
<span class="line"><span>//  https://github.com/ashima/webgl-noise</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>float noise(vec2 v) {</span></span>
<span class="line"><span>    // Precompute values for skewed triangular grid</span></span>
<span class="line"><span>    const vec4 C = vec4(0.211324865405187,</span></span>
<span class="line"><span>                        // (3.0-sqrt(3.0))/6.0</span></span>
<span class="line"><span>                        0.366025403784439,</span></span>
<span class="line"><span>                        // 0.5*(sqrt(3.0)-1.0)</span></span>
<span class="line"><span>                        -0.577350269189626,</span></span>
<span class="line"><span>                        // -1.0 + 2.0 * C.x</span></span>
<span class="line"><span>                        0.024390243902439);</span></span>
<span class="line"><span>                        // 1.0 / 41.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // First corner (x0)</span></span>
<span class="line"><span>    vec2 i  = floor(v + dot(v, C.yy));</span></span>
<span class="line"><span>    vec2 x0 = v - i + dot(i, C.xx);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Other two corners (x1, x2)</span></span>
<span class="line"><span>    vec2 i1 = vec2(0.0);</span></span>
<span class="line"><span>    i1 = (x0.x &amp;gt; x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);</span></span>
<span class="line"><span>    vec2 x1 = x0.xy + C.xx - i1;</span></span>
<span class="line"><span>    vec2 x2 = x0.xy + C.zz;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Do some permutations to avoid</span></span>
<span class="line"><span>    // truncation effects in permutation</span></span>
<span class="line"><span>    i = mod289(i);</span></span>
<span class="line"><span>    vec3 p = permute(</span></span>
<span class="line"><span>            permute( i.y + vec3(0.0, i1.y, 1.0))</span></span>
<span class="line"><span>                + i.x + vec3(0.0, i1.x, 1.0 ));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vec3 m = max(0.5 - vec3(</span></span>
<span class="line"><span>                        dot(x0,x0),</span></span>
<span class="line"><span>                        dot(x1,x1),</span></span>
<span class="line"><span>                        dot(x2,x2)</span></span>
<span class="line"><span>                        ), 0.0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m = m*m ;</span></span>
<span class="line"><span>    m = m*m ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Gradients:</span></span>
<span class="line"><span>    //  41 pts uniformly over a line, mapped onto a diamond</span></span>
<span class="line"><span>    //  The ring size 17*17 = 289 is close to a multiple</span></span>
<span class="line"><span>    //      of 41 (41*7 = 287)</span></span>
<span class="line"><span>    vec3 x = 2.0 * fract(p * C.www) - 1.0;</span></span>
<span class="line"><span>    vec3 h = abs(x) - 0.5;</span></span>
<span class="line"><span>    vec3 ox = floor(x + 0.5);</span></span>
<span class="line"><span>    vec3 a0 = x - ox;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Normalise gradients implicitly by scaling m</span></span>
<span class="line"><span>    // Approximation of: m *= inversesqrt(a0*a0 + h*h);</span></span>
<span class="line"><span>    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Compute final noise value at P</span></span>
<span class="line"><span>    vec3 g = vec3(0.0);</span></span>
<span class="line"><span>    g.x  = a0.x  * x0.x  + h.x  * x0.y;</span></span>
<span class="line"><span>    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);</span></span>
<span class="line"><span>    return 130.0 * dot(m, g);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>    vec2 st = vUv * 20.0;</span></span>
<span class="line"><span>    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);</span></span>
<span class="line"><span>    gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>渲染效果如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/3984a318acc90ccce0dcaf65aaf0a60a.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/3984a318acc90ccce0dcaf65aaf0a60a.jpeg" alt=""></a></p><p>Simplex Noise可以实现出令人惊叹的效果，在 <a href="https://www.shadertoy.com/" target="_blank" rel="noreferrer">Shadertoy.com</a> 平台上经常有大神分享他们创作的神奇效果。比如， <a href="https://www.shadertoy.com/view/MdSXzz" target="_blank" rel="noreferrer">这个</a> 像某种溶洞的岩壁效果，就有一种大自然鬼斧神工的韵味在。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/bbb7f35c9a0f4b639825074764025a48.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/bbb7f35c9a0f4b639825074764025a48.gif" alt=""></a></p><p>再比如， <a href="https://www.shadertoy.com/view/Ms2SD1" target="_blank" rel="noreferrer">这种像电影大片中才有的效果</a>，你很难想象这并不是视频，甚至不是图片，只不过是我们用数学公式在Shader中计算并绘制出来的图案而已。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/0c209d3f0f65d45457420f74c057d2cc.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/0c209d3f0f65d45457420f74c057d2cc.gif" alt=""></a></p><h3 id="网格噪声" tabindex="-1">网格噪声 <a class="header-anchor" href="#网格噪声" aria-label="Permalink to &quot;网格噪声&quot;">​</a></h3><p>最后，我们来讲讲网格噪声。前面我们已经使用过大量网格化的技术，我想你也应该比较熟悉了。那什么是网格噪声呢？它就是将噪声与网格结合使用的一种纹理生成技术。下面，让我们通过一个生成动态生物细胞的例子，来详细理解一下如何使用网格噪声。</p><p>首先，我们用网格技术将画布分为10*10的网格。然后，我们构建距离场。这个距离场是在每个网格中随机一个特征点，然后计算网格内到该点的距离，最后根据距离来着色。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef GL_ES</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>varying vec2 vUv;</span></span>
<span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec2 random2(vec2 st){</span></span>
<span class="line"><span>  st = vec2( dot(st,vec2(127.1,311.7)),</span></span>
<span class="line"><span>            dot(st,vec2(269.5,183.3)) );</span></span>
<span class="line"><span>  return fract(sin(st) * 43758.5453123);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv * 10.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  float d = 1.0;</span></span>
<span class="line"><span>  vec2 i_st = floor(st);</span></span>
<span class="line"><span>  vec2 f_st = fract(st);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec2 p = random2(i_st);</span></span>
<span class="line"><span>  d = distance(f_st, p);</span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(d);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面的代码，我们最终能得到如下的效果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/dc089df759336b3636f2a3cf7bfa71ed.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/dc089df759336b3636f2a3cf7bfa71ed.jpeg" alt=""></a></p><p>我们可以看到，这里的每个网格是独立的，并且界限分明。那如果我们想让它们的边界过渡更圆滑该怎么办呢？我们可以在原来的代码上做改变，具体来说就是不仅计算特征点到当前网格的距离，还要计算它到周围相邻的8个网格的距离，然后取最小值。与其他的编程语言类似，这个可以通过for循环来实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv * 10.0;</span></span>
<span class="line"><span>  float d = 1.0;</span></span>
<span class="line"><span>  vec2 i_st = floor(st);</span></span>
<span class="line"><span>  vec2 f_st = fract(st);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for(int i = -1; i &amp;lt;= 1; i++) {</span></span>
<span class="line"><span>    for(int j = -1; j &amp;lt;= 1; j++) {</span></span>
<span class="line"><span>      vec2 neighbor = vec2(float(i), float(j));</span></span>
<span class="line"><span>      vec2 p = random2(i_st + neighbor);</span></span>
<span class="line"><span>      d = min(d, distance(f_st, neighbor + p));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(d);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有一点需要注意，GLSL语言的for循环限制比较多。其中，检查循环是否继续的次数必须是常量，不能是变量。所以GLSL中没有动态循环，而且迭代的次数必须是确定的。这里我们要检查9个网格，所以就用了两重循环来实现。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/e8ed59accc7575f2fa22dc0a3e580fc6.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/e8ed59accc7575f2fa22dc0a3e580fc6.jpeg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/277a3bb605dc035edb2ae43db1a679bb.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/277a3bb605dc035edb2ae43db1a679bb.jpeg" alt=""></a></p><p>然后我们加上uTime，让网格动起来，另外我们把特征点也给显示出来。我们修改一下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec2 st = vUv * 10.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  float d = 1.0;</span></span>
<span class="line"><span>  vec2 i_st = floor(st);</span></span>
<span class="line"><span>  vec2 f_st = fract(st);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for(int i = -1; i &amp;lt;= 1; i++) {</span></span>
<span class="line"><span>    for(int j = -1; j &amp;lt;= 1; j++) {</span></span>
<span class="line"><span>      vec2 neighbor = vec2(float(i), float(j));</span></span>
<span class="line"><span>      vec2 p = random2(i_st + neighbor);</span></span>
<span class="line"><span>      p = 0.5 + 0.5 * sin(uTime + 6.2831 * p);</span></span>
<span class="line"><span>      d = min(d, distance(f_st, neighbor + p));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  gl_FragColor.rgb = vec3(d) + step(d, 0.03);</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，最终绘制的效果如下，它就有点像是运动的生物细胞。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/b635854be3e0a9336906b02e46cdb3c6.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/b635854be3e0a9336906b02e46cdb3c6.gif" alt=""></a></p><p>网格噪声是一种目前被广泛应用的程序化纹理技术，用来生成随机网格类的视觉效果，可以用来模拟物体表面的晶格、晶体生长、细胞、微生物等等有趣的效果。</p><p><a href="https://thebookofshaders.com/12/?lan=ch" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/6396d5c7f143410352cb04da2a3cdbc7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/6396d5c7f143410352cb04da2a3cdbc7.jpg" alt=""></a></a></p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>总的来说，这节课我给你讲的技术，实际上是一种复杂的程序化纹理生成技术。所谓程序化纹理生成技术，就是用程序来生成物体表面的图案。我们在这些图案中引入类似于自然界中的随机性，就可以模拟出自然的、丰富多采的以及包含真实细节的纹理图案。</p><p>这其中最有代表性的就是噪声了，噪声就是随机性与连续性结合而成的。噪声是自然界中普遍存在的自然规律。模拟噪声的基本思路是对离散的随机数进行平滑处理，对随机数进行平滑处理有不同的数学技巧，所以有插值噪声、梯度噪声、Simplex Noise等等不同的噪声算法。它们各有特点，我们可以根据不同的情况来选择怎么使用。</p><p>这一节课的内容偏向于技巧性，要想掌握好，我建议你多动手实践。我推荐给你一个非常不错的平台， <a href="https://www.shadertoy.com/" target="_blank" rel="noreferrer">Shadertoy.com</a> 。它是一个非常优秀的创作和分享着色器效果的平台，你可以在上面学习到很多优秀的案例，然后通过代码来理解创作者的创意和思路，巩固今天所学的知识。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>你能试着写出一个Shader，来实现我在下面给出的网格噪声效果吗？欢迎你把它分享出来。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/d098bfc78426b56bf83efd5ddae6ffa0.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/267016/d098bfc78426b56bf83efd5ddae6ffa0.gif" alt=""></a></p><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课再见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>完整示例代码见 <a href="https://github.com/akira-cn/graphics/tree/master/noise" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p>[1] <a href="https://www.shadertoy.com/" target="_blank" rel="noreferrer">Shadertoy</a></p><p>[2] <a href="https://thebookofshaders.com/11/?lan=ch" target="_blank" rel="noreferrer">The Book of Shaders</a></p>`,97)])])}const b=a(i,[["render",l]]);export{d as __pageData,b as default};
