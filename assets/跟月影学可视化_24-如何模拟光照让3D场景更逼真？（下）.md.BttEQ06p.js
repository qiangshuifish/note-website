import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"24 |  如何模拟光照让3D场景更逼真？（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何实现有向光的镜面反射?","slug":"如何实现有向光的镜面反射","link":"#如何实现有向光的镜面反射","children":[]},{"level":2,"title":"如何实现完整的Phong反射模型?","slug":"如何实现完整的phong反射模型","link":"#如何实现完整的phong反射模型","children":[{"level":3,"title":"1. 定义光源模型","slug":"_1-定义光源模型","link":"#_1-定义光源模型","children":[]},{"level":3,"title":"2. 定义几何体材质","slug":"_2-定义几何体材质","link":"#_2-定义几何体材质","children":[]},{"level":3,"title":"3. 实现着色器","slug":"_3-实现着色器","link":"#_3-实现着色器","children":[]}]},{"level":2,"title":"Phong反射模型的局限性","slug":"phong反射模型的局限性","link":"#phong反射模型的局限性","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/24-如何模拟光照让3D场景更逼真？（下）.md","filePath":"跟月影学可视化/24-如何模拟光照让3D场景更逼真？（下）.md","lastUpdated":1779822292000}'),i={name:"跟月影学可视化/24-如何模拟光照让3D场景更逼真？（下）.md"};function l(t,a,c,o,r,h){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_24-如何模拟光照让3d场景更逼真-下" tabindex="-1">24 | 如何模拟光照让3D场景更逼真？（下） <a class="header-anchor" href="#_24-如何模拟光照让3d场景更逼真-下" aria-label="Permalink to &quot;24 |  如何模拟光照让3D场景更逼真？（下）&quot;">​</a></h1><p>你好，我是月影。今天，我们接着来讲，怎么模拟光照。</p><p>上节课，我们讲了四种光照的漫反射模型。实际上，因为物体的表面材质不同，反射光不仅有漫反射，还有镜面反射。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/2ac147c6eb17d547a3ff355e58d65ed5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/2ac147c6eb17d547a3ff355e58d65ed5.jpg" alt=""></a></p><p>什么是镜面反射呢？如果若干平行光照射在表面光滑的物体上，反射出来的光依然平行，这种反射就是镜面反射。镜面反射的性质是，入射光与法线的夹角等于反射光与法线的夹角。</p><p>越光滑的材质，它的镜面反射效果也就越强。最直接的表现就是物体表面会有闪耀的光斑，也叫镜面高光。但并不是所有光都能产生镜面反射，我们上节课讲的四种光源中，环境光因为没有方向，所以不参与镜面反射。剩下的平行光、点光源、聚光灯这三种光源，都是能够产生镜面反射的有向光。</p><p><a href="https://commons.wikimedia.org" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/15a2e5bcf5dc18b4e0e02efc9e79fc0f.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/15a2e5bcf5dc18b4e0e02efc9e79fc0f.jpeg" alt=""></a></a></p><p>那么今天，我们就来讨论一下如何实现镜面反射，然后将它和上节课的漫反射结合起来，就可以实现标准的光照模型，也就是Phong反射模型了，从而能让我们实现的可视化场景更加接近于自然界的效果。</p><h2 id="如何实现有向光的镜面反射" tabindex="-1">如何实现有向光的镜面反射? <a class="header-anchor" href="#如何实现有向光的镜面反射" aria-label="Permalink to &quot;如何实现有向光的镜面反射?&quot;">​</a></h2><p>首先，镜面反射需要同时考虑光的入射方向以及相机也就是观察者所在的方向。</p><p><a href="https://blog.csdn.net/xyh930929/article/details/83418396" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/f2f1bee42562acf44941aa2b077181c9.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/f2f1bee42562acf44941aa2b077181c9.jpeg" alt=""></a></a></p><p>接着，我们再来说说怎么实现镜面反射效果，一般来说需要4个步骤。</p><p><strong>第一步，求出反射光线的方向向量</strong>。这里我们以点光源为例，要求出反射光的方向，我们可以直接使用GLSL的内置函数reflect，这个函数能够返回一个向量相对于某个法向量的反射向量，正好就是我们要的镜面反射结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 求光源与点坐标的方向向量</span></span>
<span class="line"><span>vec3 dir = (viewMatrix * vec4(pointLightPosition, 1.0)).xyz - vPos;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 归一化</span></span>
<span class="line"><span>dir = normalize(dir);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 求反射向量</span></span>
<span class="line"><span>vec3 reflectionLight = reflect(-dir, vNormal);</span></span></code></pre></div><p>第二步，我们要根据相机位置计算视线与反射光线夹角的余弦，用到原理是向量的点乘。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vec3 eyeDirection = vCameraPos - vPos;</span></span>
<span class="line"><span>eyeDirection = normalize(eyeDirection);</span></span>
<span class="line"><span>// 与视线夹角余弦</span></span>
<span class="line"><span>float eyeCos = max(dot(eyeDirection, reflectionLight), 0.0);</span></span></code></pre></div><p>第三步，我们使用系数和指数函数设置镜面反射强度。指数越大，镜面越聚焦，高光的光斑范围就越小。这里，我们指数取50.0，系数取2.0。系数能改变反射亮度，系数越大，反射的亮度就越高。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>float specular = 2.0 *  pow(eyeCos, 50.0);</span></span></code></pre></div><p>最后，我们将漫反射和镜面反射结合起来，就会让距离光源近的物体上，形成光斑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 合成颜色</span></span>
<span class="line"><span>gl_FragColor.rgb = specular + (ambientLight + diffuse) * materialReflection;</span></span>
<span class="line"><span>gl_FragColor.a = 1.0;</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/36db1c0828a5a6e6aa1c4747431cee09.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/36db1c0828a5a6e6aa1c4747431cee09.gif" alt=""></a></p><p>上面的代码是以点光源为例来实现的光斑，其实只要是有向光，都可以用同样的方法求出镜面反射，只不过对应的入射光方向计算有所不同，也就是着色器代码中的dir变量计算方式不一样。 你可以利用我上节课讲的内容，自己动手试试。</p><h2 id="如何实现完整的phong反射模型" tabindex="-1">如何实现完整的Phong反射模型? <a class="header-anchor" href="#如何实现完整的phong反射模型" aria-label="Permalink to &quot;如何实现完整的Phong反射模型?&quot;">​</a></h2><p>那在自然界中，除了环境光以外，其他每种光源在空间中都可以存在不止一个，而且因为几何体材质不同，物体表面也可能既出现漫反射，又出现镜面反射。</p><p>可能出现的情况这么多，分析和计算起来也会非常复杂。为了方便处理，我们可以把多种光源和不同材质结合起来，形成标准的反射模型，这一模型被称为 <a href="https://en.wikipedia.org/wiki/Phong_reflection_model" target="_blank" rel="noreferrer">Phong反射模型</a>。</p><p>Phong反射模型的完整公式如下：</p><p>$$</p><p>I_{\\mathrm{p}​}=k_{\\mathrm{a}​} i_{\\mathrm{a}​}+\\sum_{m \\in \\text { lights }​}\\left(k_{\\mathrm{d}​}\\left(\\hat{L}_{m} \\cdot \\hat{N}\\right) i_{m, \\mathrm{d}​}+k_{\\mathrm{s}​}\\left(\\hat{R}_{m} \\cdot \\hat{V}\\right)^{\\alpha} i_{m, \\mathrm{s}​}\\right)</p><p>$$</p><p>公式里的$k_{\\mathrm{a}​}$、$k_{\\mathrm{d}​}$和$k_{\\mathrm{s}​}$分别对应环境反射系数、漫反射系数和镜面反射系数。$\\hat{L}_{m}$是入射光，$N$是法向量，$\\hat{R}_{m}$是反射光，$V$是视线向量。$i$是强度，漫反射和镜面反射的强度可考虑因为距离的衰减。$⍺$是和物体材质有关的常量，决定了镜面高光的范围。</p><p>根据上面的公式，我们把多个光照的计算结果相加，就能得到光照下几何体的最终颜色了。不过，这里的Phong反射模型实际上是真实物理世界光照的简化模型，因为它只考虑光源的光作用于物体，没有考虑各个物体之间的反射光。所以我们最终实现出的效果也只是自然界效果的一种近似，不过这种近似也高度符合真实情况了。</p><p>在一般的图形库或者图形框架中，会提供符合Phong反射模型的物体材质，比如ThreeJS中，就支持各种光源和反射材质。</p><p>下面，我们来实现一下完整的Phong反射模型。它可以帮助你对这个模型有更深入的理解，让你以后使用ThreeJS等其他图形库，也能够更加得心应手。整个过程分为三步：定义光源模型、定义几何体材质和实现着色器。</p><h3 id="_1-定义光源模型" tabindex="-1">1. 定义光源模型 <a class="header-anchor" href="#_1-定义光源模型" aria-label="Permalink to &quot;1\\. 定义光源模型&quot;">​</a></h3><p>我们先来定义光源模型对象。环境光比较特殊，我们将它单独抽象出来，放在一个ambientLight的属性中，而其他的光源一共有5个属性与材质无关，我列了一张表放在了下面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/88ec1e9768fa4047964b19f8fc3d7fd2.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/88ec1e9768fa4047964b19f8fc3d7fd2.jpg" alt=""></a></p><p>这样，我们就可以定义一个Phong类。这个类由一个环境光属性和其他三种光源的集合组合而成，表示一个可以添加和删除光源的对象。它的主要作用是添加和删除光源，并把光源的属性通过uniforms访问器属性转换成对应的uniform变量，主要的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Phong {</span></span>
<span class="line"><span>  constructor(ambientLight = [0.5, 0.5, 0.5]) {</span></span>
<span class="line"><span>    this.ambientLight = ambientLight;</span></span>
<span class="line"><span>    this.directionalLights = new Set();</span></span>
<span class="line"><span>    this.pointLights = new Set();</span></span>
<span class="line"><span>    this.spotLights = new Set();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  addLight(light) {</span></span>
<span class="line"><span>    const {position, direction, color, decay, angle} = light;</span></span>
<span class="line"><span>    if(!position &amp;&amp; !direction) throw new TypeError(&#39;invalid light&#39;);</span></span>
<span class="line"><span>    light.color = color || [1, 1, 1];</span></span>
<span class="line"><span>    if(!position) this.directionalLights.add(light);</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      light.decay = decay || [0, 0, 1];</span></span>
<span class="line"><span>      if(!angle) {</span></span>
<span class="line"><span>        this.pointLights.add(light);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        this.spotLights.add(light);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  removeLight(light) {</span></span>
<span class="line"><span>    if(this.directionalLights.has(light)) this.directionalLights.delete(light);</span></span>
<span class="line"><span>    else if(this.pointLights.has(light)) this.pointLights.delete(light);</span></span>
<span class="line"><span>    else if(this.spotLights.has(light)) this.spotLights.delete(light);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get uniforms() {</span></span>
<span class="line"><span>    const MAX_LIGHT_COUNT = 16; // 最多每种光源设置16个</span></span>
<span class="line"><span>    this._lightData = this._lightData || {};</span></span>
<span class="line"><span>    const lightData = this._lightData;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lightData.directionalLightDirection = lightData.directionalLightDirection || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.directionalLightColor = lightData.directionalLightColor || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lightData.pointLightPosition = lightData.pointLightPosition || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.pointLightColor = lightData.pointLightColor || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.pointLightDecay = lightData.pointLightDecay || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lightData.spotLightDirection = lightData.spotLightDirection || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.spotLightPosition = lightData.spotLightPosition || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.spotLightColor = lightData.spotLightColor || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.spotLightDecay = lightData.spotLightDecay || {value: new Float32Array(MAX_LIGHT_COUNT * 3)};</span></span>
<span class="line"><span>    lightData.spotLightAngle = lightData.spotLightAngle || {value: new Float32Array(MAX_LIGHT_COUNT)};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    [...this.directionalLights].forEach((light, idx) =&amp;gt; {</span></span>
<span class="line"><span>      lightData.directionalLightDirection.value.set(light.direction, idx * 3);</span></span>
<span class="line"><span>      lightData.directionalLightColor.value.set(light.color, idx * 3);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    [...this.pointLights].forEach((light, idx) =&amp;gt; {</span></span>
<span class="line"><span>      lightData.pointLightPosition.value.set(light.position, idx * 3);</span></span>
<span class="line"><span>      lightData.pointLightColor.value.set(light.color, idx * 3);</span></span>
<span class="line"><span>      lightData.pointLightDecay.value.set(light.decay, idx * 3);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    [...this.spotLights].forEach((light, idx) =&amp;gt; {</span></span>
<span class="line"><span>      lightData.spotLightPosition.value.set(light.position, idx * 3);</span></span>
<span class="line"><span>      lightData.spotLightColor.value.set(light.color, idx * 3);</span></span>
<span class="line"><span>      lightData.spotLightDecay.value.set(light.decay, idx * 3);</span></span>
<span class="line"><span>      lightData.spotLightDirection.value.set(light.direction, idx * 3);</span></span>
<span class="line"><span>      lightData.spotLightAngle.value[idx] = light.angle;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      ambientLight: {value: this.ambientLight},</span></span>
<span class="line"><span>      ...lightData,</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了这个类之后，我们就可以创建并添加各种光源了。我在下面的代码中，添加了一个平行光和两个点光源，你可以看看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const phong = new Phong();</span></span>
<span class="line"><span>// 添加一个平行光</span></span>
<span class="line"><span>phong.addLight({</span></span>
<span class="line"><span>  direction: [-1, 0, 0],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>// 添加两个点光源</span></span>
<span class="line"><span>phong.addLight({</span></span>
<span class="line"><span>  position: [-3, 3, 0],</span></span>
<span class="line"><span>  color: [1, 0, 0],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>phong.addLight({</span></span>
<span class="line"><span>  position: [3, 3, 0],</span></span>
<span class="line"><span>  color: [0, 0, 1],</span></span>
<span class="line"><span>});</span></span></code></pre></div><h3 id="_2-定义几何体材质" tabindex="-1">2. 定义几何体材质 <a class="header-anchor" href="#_2-定义几何体材质" aria-label="Permalink to &quot;2\\. 定义几何体材质&quot;">​</a></h3><p>定义完光源之后，我们还需要定义几何体的 <strong>材质</strong>（material），因为几何体材质决定了光反射的性质。</p><p>在前面的课程里，我们已经了解了一种与几何体材质有关的变量，即物体的反射率（MaterialReflection）。那在前面计算镜面反射的公式，float specular = 2.0 * pow(eyeCos, 50.0);中也有两个常量2.0和50.0，把它们也提取出来，我们就能得到两个新的变量。其中，2.0对应specularFactor，表示镜面反射强度，50.0指的是shininess，表示镜面反射的光洁度。</p><p>这样，我们就有了3个与材质有关的变量，分别是matrialReflection （材质反射率）、specularFactor （镜面反射强度）、以及shininess （镜面反射光洁度）。</p><p>然后，我们可以创建一个Matrial类，来定义物体的材质。与光源类相比，这个类非常简单，只是设置这三个参数，并通过uniforms访问器属性，获得它的uniform数据结构形式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Material {</span></span>
<span class="line"><span>  constructor(reflection, specularFactor = 0, shininess = 50) {</span></span>
<span class="line"><span>    this.reflection = reflection;</span></span>
<span class="line"><span>    this.specularFactor = specularFactor;</span></span>
<span class="line"><span>    this.shininess = shininess;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  get uniforms() {</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      materialReflection: {value: this.reflection},</span></span>
<span class="line"><span>      specularFactor: {value: this.specularFactor},</span></span>
<span class="line"><span>      shininess: {value: this.shininess},</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么，我们就可以创建matrial对象了。这里，我一共创建4个matrial对象，分别对应要显示的四个几何体的材质。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const matrial1 = new Material(new Color(&#39;#0000ff&#39;), 2.0);</span></span>
<span class="line"><span>const matrial2 = new Material(new Color(&#39;#ff00ff&#39;), 2.0);</span></span>
<span class="line"><span>const matrial3 = new Material(new Color(&#39;#008000&#39;), 2.0);</span></span>
<span class="line"><span>const matrial4 = new Material(new Color(&#39;#ff0000&#39;), 2.0);</span></span></code></pre></div><p>有了phong对象和matrial对象，我们就可以给几何体创建WebGL程序了。那我们就使用上面四个WebGL程序，来创建真正的几何体网格，并将它们渲染出来吧。具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const program1 = new Program(gl, {</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>  uniforms: {</span></span>
<span class="line"><span>    ...matrial1.uniforms,</span></span>
<span class="line"><span>    ...phong.uniforms,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>const program2 = new Program(gl, {</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>  uniforms: {</span></span>
<span class="line"><span>    ...matrial2.uniforms,</span></span>
<span class="line"><span>    ...phong.uniforms,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>const program3 = new Program(gl, {</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>  uniforms: {</span></span>
<span class="line"><span>    ...matrial3.uniforms,</span></span>
<span class="line"><span>    ...phong.uniforms,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>const program4 = new Program(gl, {</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>  uniforms: {</span></span>
<span class="line"><span>    ...matrial4.uniforms,</span></span>
<span class="line"><span>    ...phong.uniforms,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span></code></pre></div><h3 id="_3-实现着色器" tabindex="-1">3. 实现着色器 <a class="header-anchor" href="#_3-实现着色器" aria-label="Permalink to &quot;3\\. 实现着色器&quot;">​</a></h3><p>接下来，我们重点看一下，支持phong反射模型的片元着色器代码是怎么实现的。这个着色器代码比较复杂，我们一段一段来看。</p><p>首先，我们来看光照相关的uniform变量的声明。这里，我们声明了vec3和float数组，数组的大小为16。这样，对于每一种光源，我们都可以支持16个。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define MAX_LIGHT_COUNT 16</span></span>
<span class="line"><span>uniform mat4 viewMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform vec3 ambientLight;</span></span>
<span class="line"><span>uniform vec3 directionalLightDirection[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 directionalLightColor[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 pointLightColor[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 pointLightPosition[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 pointLightDecay[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 spotLightColor[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 spotLightDirection[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 spotLightPosition[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform vec3 spotLightDecay[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span>uniform float spotLightAngle[MAX_LIGHT_COUNT];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform vec3 materialReflection;</span></span>
<span class="line"><span>uniform float shininess;</span></span>
<span class="line"><span>uniform float specularFactor;</span></span></code></pre></div><p>接下来，我们实现计算phong反射模型的主题逻辑。事实上，处理平行光、点光源、聚光灯的主体逻辑类似，都是循环处理每个光源，再计算入射光方向，然后计算漫反射以及镜面反射，最终将结果返回。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>float getSpecular(vec3 dir, vec3 normal, vec3 eye) {</span></span>
<span class="line"><span>  vec3 reflectionLight = reflect(-dir, normal);</span></span>
<span class="line"><span>  float eyeCos = max(dot(eye, reflectionLight), 0.0);</span></span>
<span class="line"><span>  return specularFactor *  pow(eyeCos, shininess);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec4 phongReflection(vec3 pos, vec3 normal, vec3 eye) {</span></span>
<span class="line"><span>  float specular = 0.0;</span></span>
<span class="line"><span>  vec3 diffuse = vec3(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 处理平行光</span></span>
<span class="line"><span>  for(int i = 0; i &amp;lt; MAX_LIGHT_COUNT; i++) {</span></span>
<span class="line"><span>    vec3 dir = directionalLightDirection[i];</span></span>
<span class="line"><span>    if(dir.x == 0.0 &amp;&amp; dir.y == 0.0 &amp;&amp; dir.z == 0.0) continue;</span></span>
<span class="line"><span>    vec4 d = viewMatrix * vec4(dir, 0.0);</span></span>
<span class="line"><span>    dir = normalize(-d.xyz);</span></span>
<span class="line"><span>    float cos = max(dot(dir, normal), 0.0);</span></span>
<span class="line"><span>    diffuse += cos * directionalLightColor[i];</span></span>
<span class="line"><span>    specular += getSpecular(dir, normal, eye);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 处理点光源</span></span>
<span class="line"><span>  for(int i = 0; i &amp;lt; MAX_LIGHT_COUNT; i++) {</span></span>
<span class="line"><span>    vec3 decay = pointLightDecay[i];</span></span>
<span class="line"><span>    if(decay.x == 0.0 &amp;&amp; decay.y == 0.0 &amp;&amp; decay.z == 0.0) continue;</span></span>
<span class="line"><span>    vec3 dir = (viewMatrix * vec4(pointLightPosition[i], 1.0)).xyz - pos;</span></span>
<span class="line"><span>    float dis = length(dir);</span></span>
<span class="line"><span>    dir = normalize(dir);</span></span>
<span class="line"><span>    float cos = max(dot(dir, normal), 0.0);</span></span>
<span class="line"><span>    float d = min(1.0, 1.0 / (decay.x * pow(dis, 2.0) + decay.y * dis + decay.z));</span></span>
<span class="line"><span>    diffuse += d * cos * pointLightColor[i];</span></span>
<span class="line"><span>    specular += getSpecular(dir, normal, eye);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 处理聚光灯</span></span>
<span class="line"><span>  for(int i = 0; i &amp;lt; MAX_LIGHT_COUNT; i++) {</span></span>
<span class="line"><span>    vec3 decay = spotLightDecay[i];</span></span>
<span class="line"><span>    if(decay.x == 0.0 &amp;&amp; decay.y == 0.0 &amp;&amp; decay.z == 0.0) continue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vec3 dir = (viewMatrix * vec4(spotLightPosition[i], 1.0)).xyz - pos;</span></span>
<span class="line"><span>    float dis = length(dir);</span></span>
<span class="line"><span>    dir = normalize(dir);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 聚光灯的朝向</span></span>
<span class="line"><span>    vec3 spotDir = (viewMatrix * vec4(spotLightDirection[i], 0.0)).xyz;</span></span>
<span class="line"><span>    // 通过余弦值判断夹角范围</span></span>
<span class="line"><span>    float ang = cos(spotLightAngle[i]);</span></span>
<span class="line"><span>    float r = step(ang, dot(dir, normalize(-spotDir)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    float cos = max(dot(dir, normal), 0.0);</span></span>
<span class="line"><span>    float d = min(1.0, 1.0 / (decay.x * pow(dis, 2.0) + decay.y * dis + decay.z));</span></span>
<span class="line"><span>    diffuse += r * d * cos * spotLightColor[i];</span></span>
<span class="line"><span>    specular += r * getSpecular(dir, normal, eye);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return vec4(diffuse, specular);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，我们在main函数中，调用phongReflection函数来合成颜色。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 eyeDirection = normalize(vCameraPos - vPos);</span></span>
<span class="line"><span>  vec4 phong = phongReflection(vPos, vNormal, eyeDirection);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 合成颜色</span></span>
<span class="line"><span>  gl_FragColor.rgb = phong.w + (phong.xyz + ambientLight) * materialReflection;</span></span>
<span class="line"><span>  gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最终呈现的视觉效果如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/36db1c0828a5a6e6aa1c4747431cee09.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/36db1c0828a5a6e6aa1c4747431cee09.gif" alt=""></a></p><p>你注意一下上图右侧的球体。因为我们一共设置了3个光源，一个平行光、两个点光源，它们都能够产生镜面反射。所以，这些光源叠加在一起后，这个球体就呈现出3个镜面高光。</p><h2 id="phong反射模型的局限性" tabindex="-1">Phong反射模型的局限性 <a class="header-anchor" href="#phong反射模型的局限性" aria-label="Permalink to &quot;Phong反射模型的局限性&quot;">​</a></h2><p>虽然，phong反射模型已经比较接近于真实的物理模型，不过它仍然是真实模型的一种近似。因为它没有考虑物体反射光对其他物体的影响，也没有考虑物体对光线遮挡产生的阴影。</p><p>当然，我们可以完善这个模型。比如，将物体本身反射光（主要是镜面反射光）对其他物体的影响纳入到模型中。另外，我们也要考虑物体的阴影。当我们把这些因素更多地考虑进去的时候，我们的模型就会更加接近真实世界的物理模型。</p><p>当我们渲染3D图形的时候，要呈现越接近真实的效果，往往要考虑更多的参数，因此所需的计算量也越大，那我们就需要有更强的渲染能力，比如，更好的显卡，更快的CPU和GPU，并且也需要我们尽可能地优化计算的性能。</p><p>但是，有很多时候，我们需要在细节和性能上做出平衡和取舍。那性能优化的部分，也是我们课程的重点，我会在性能篇详细来讲。这节课，我们就重点关注反射模型，总结出完整的Phong反射模型就可以了。</p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>今天，我们把环境光、平行光、点光源、聚光灯这四种光源整合，并且在上节课讲的漫反射的基础上，添加了镜面反射，形成了完整的Phong反射模型。在这里，我们实现的着色器代码能够结合四种光源的效果，除了环境光外，每种光源还可以设置多个。</p><p>在Phong反射模型中，光照在物体上的最终效果，由各个光源的性质（参数）和物体的表面材质共同决定。</p><p>Phong反射模型也只是真实世界的一种近似，因为我们并没有考虑物体之间反射光的相互影响，也没有考虑光线的遮挡。如果把这些因素考虑进去，那我们的模型可以更接近真实世界了。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>我们知道，平行光、点光源和聚光灯是三种常见的方向光，但真实世界还有其他的方向光，比如探照灯，它是一种有范围的平行光，类似于聚光灯，但又不完全一样。你能给物体实现探照灯效果吗？</p><p>这里，我先把需要用到的参数告诉你，包括光源方向searchLightDirection、光源半径searchLightRadius、光源位置searchLightPosition、光照颜色searchLightColor。你可以用OGL实现探照灯效果，然后把对应的着色器代码写在留言区。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/ce4bcyye0f4ac139625d96a2d5aeb06d.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274341/ce4bcyye0f4ac139625d96a2d5aeb06d.jpeg" alt=""></a></p><p>而且，探照灯的光照截面不一定是圆形，也可以是其他图形，比如三角形、菱形、正方形，你也可以试着让它支持不同的光照截面。</p><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课再见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>课程中完整代码详见 <a href="https://github.com/akira-cn/graphics/tree/master/lights" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p><a href="https://en.wikipedia.org/wiki/Phong_reflection_mode" target="_blank" rel="noreferrer">Phong反射模型简介</a></p>`,81)])])}const m=s(i,[["render",l]]);export{d as __pageData,m as default};
