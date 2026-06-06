import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"25 | 如何用法线贴图模拟真实物体表面","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何使用法线贴图给几何体表面增加凹凸效果？","slug":"如何使用法线贴图给几何体表面增加凹凸效果","link":"#如何使用法线贴图给几何体表面增加凹凸效果","children":[{"level":3,"title":"如何理解切线空间？","slug":"如何理解切线空间","link":"#如何理解切线空间","children":[]},{"level":3,"title":"构建TBN矩阵来计算法向量","slug":"构建tbn矩阵来计算法向量","link":"#构建tbn矩阵来计算法向量","children":[]},{"level":3,"title":"使用偏导数来实现法线贴图","slug":"使用偏导数来实现法线贴图","link":"#使用偏导数来实现法线贴图","children":[]}]},{"level":2,"title":"法线贴图的应用","slug":"法线贴图的应用","link":"#法线贴图的应用","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/25-如何用法线贴图模拟真实物体表面.md","filePath":"跟月影学可视化/25-如何用法线贴图模拟真实物体表面.md","lastUpdated":1779822292000}'),i={name:"跟月影学可视化/25-如何用法线贴图模拟真实物体表面.md"};function l(t,n,c,o,r,g){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_25-如何用法线贴图模拟真实物体表面" tabindex="-1">25 | 如何用法线贴图模拟真实物体表面 <a class="header-anchor" href="#_25-如何用法线贴图模拟真实物体表面" aria-label="Permalink to &quot;25 | 如何用法线贴图模拟真实物体表面&quot;">​</a></h1><p>你好，我是月影。</p><p>上节课，我们讲了光照的Phong反射模型，并使用它给几何体添加了光照效果。不过，我们使用的几何体表面都是平整的，没有凹凸感。而真实世界中，大部分物体的表面都是凹凸不平的，这肯定会影响光照的反射效果。</p><p>因此，只有处理好物体凹凸表面的光照效果，我们才能更加真实地模拟物体表面。在图形学中就有一种对应的技术，叫做 <strong>法线贴图</strong>。今天，我们就一起来学习一下。</p><h2 id="如何使用法线贴图给几何体表面增加凹凸效果" tabindex="-1">如何使用法线贴图给几何体表面增加凹凸效果？ <a class="header-anchor" href="#如何使用法线贴图给几何体表面增加凹凸效果" aria-label="Permalink to &quot;如何使用法线贴图给几何体表面增加凹凸效果？&quot;">​</a></h2><p>那什么是法线贴图？我们直接通过一个例子来理解。</p><p>首先，我们用Phong反射模型绘制一个灰色的立方体，并给它添加两道平行光。具体的代码和效果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {Phong, Material, vertex as v, fragment as f} from &#39;../common/lib/phong.js&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const scene = new Transform();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const phong = new Phong();</span></span>
<span class="line"><span>phong.addLight({</span></span>
<span class="line"><span>  direction: [0, -3, -3],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>phong.addLight({</span></span>
<span class="line"><span>  direction: [0, 3, 3],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>const matrial = new Material(new Color(&#39;#808080&#39;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const program = new Program(gl, {</span></span>
<span class="line"><span>  vertex: v,</span></span>
<span class="line"><span>  fragment: f,</span></span>
<span class="line"><span>  uniforms: {</span></span>
<span class="line"><span>    ...phong.uniforms,</span></span>
<span class="line"><span>    ...matrial.uniforms,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const geometry = new Box(gl);</span></span>
<span class="line"><span>const cube = new Mesh(gl, {geometry, program});</span></span>
<span class="line"><span>cube.setParent(scene);</span></span>
<span class="line"><span>cube.rotation.x = -Math.PI / 2;</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/c0241f80436bd66bb9b2ee37912e6a1f.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/c0241f80436bd66bb9b2ee37912e6a1f.jpeg" alt=""></a></p><p>现在这个立方体的表面是光滑的，如果我们想在立方体的表面贴上凹凸的花纹。我们可以加载一张 <strong>法线纹理</strong>，这是一张偏蓝色调的纹理图片。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/8c13477872b6bc541ab1f9ec8017bbf7.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/8c13477872b6bc541ab1f9ec8017bbf7.jpeg" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const normalMap = await loadTexture(&#39;../assets/normal_map.png&#39;);</span></span></code></pre></div><p>为什么这张纹理图片是偏蓝色调的呢？实际上，这张纹理图片保存的是几何体表面的每个像素的法向量数据。我们知道，正常情况下，光滑立方体每个面的法向量是固定的，如下图所示：</p><p><a href="http://www.mbsoftworks.sk/tutorials/opengl4/014-normals-diffuse-lighting/" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/13f742cafbf21d5afe6bef06a65ae3e4.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/13f742cafbf21d5afe6bef06a65ae3e4.jpeg" alt=""></a></a></p><p>但如果表面有凹凸的花纹，那不同位置的法向量就会发生变化。在 <strong>切线空间</strong> 中，因为法线都偏向于z轴，也就是法向量偏向于(0,0,1)，所以转换成的法线纹理就偏向于蓝色。如果我们根据花纹将每个点的法向量都保存下来，就会得到上面那张法线纹理的图片。</p><h3 id="如何理解切线空间" tabindex="-1">如何理解切线空间？ <a class="header-anchor" href="#如何理解切线空间" aria-label="Permalink to &quot;如何理解切线空间？&quot;">​</a></h3><p>我刚才提到了一个词，切线空间，那什么是切线空间呢？切线空间（Tangent Space）是一个特殊的坐标系，它是由几何体顶点所在平面的uv坐标和法线构成的。</p><p><a href="https://math.stackexchange.com/questions/342211/difference-between-tangent-space-and-tangent-plane" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/ebaaafe6749e1ea9d47712d259f2c291.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/ebaaafe6749e1ea9d47712d259f2c291.jpeg" alt=""></a></a></p><p>切线空间的三个轴，一般用 T (Tangent)、B (Bitangent)、N (Normal) 三个字母表示，所以切线空间也被称为TBN空间。其中T表示切线、B表示副切线、N表示法线。</p><p>对于大部分三维几何体来说，因为每个点的法线不同，所以它们各自的切线空间也不同。</p><p>接下来，我们来具体说说，切线空间中的TBN是怎么计算的。</p><p>首先，我们来回忆一下，怎么计算几何体三角形网格的法向量。假设一个三角形网格有三个点v1、v2、v3，我们把边v1v2记为e1，边v1v3记为e2，那三角形的法向量就是e1和e2的叉积表示的归一化向量。用JavaScript代码实现就是下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function getNormal(v1, v2, v3) {</span></span>
<span class="line"><span>  const e1 = Vec3.sub(v2, v1);</span></span>
<span class="line"><span>  const e2 = Vec3.sub(v3, v1);</span></span>
<span class="line"><span>  const normal = Vec3.cross(e1, e1).normalize();</span></span>
<span class="line"><span>  return normal;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而计算切线和副切线，要比计算法线复杂得多，不过，因为 <a href="https://learnopengl.com/Advanced-Lighting/Normal-Mapping" target="_blank" rel="noreferrer">数学推导过程</a> 比较复杂，我们只要记住结论就可以了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/336454df02a6f150eff17a0760c2616b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/336454df02a6f150eff17a0760c2616b.jpeg" alt=""></a></p><p>如上图和公式，我们就可以通过UV坐标和点P1、P2、P3的坐标求出对应的T和B坐标了，对应的JavaScript函数如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function createTB(geometry) {</span></span>
<span class="line"><span>  const {position, index, uv} = geometry.attributes;</span></span>
<span class="line"><span>  if(!uv) throw new Error(&#39;NO uv.&#39;);</span></span>
<span class="line"><span>  function getTBNTriangle(p1, p2, p3, uv1, uv2, uv3) {</span></span>
<span class="line"><span>    const edge1 = new Vec3().sub(p2, p1);</span></span>
<span class="line"><span>    const edge2 = new Vec3().sub(p3, p1);</span></span>
<span class="line"><span>    const deltaUV1 = new Vec2().sub(uv2, uv1);</span></span>
<span class="line"><span>    const deltaUV2 = new Vec2().sub(uv3, uv1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const tang = new Vec3();</span></span>
<span class="line"><span>    const bitang = new Vec3();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tang.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);</span></span>
<span class="line"><span>    tang.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);</span></span>
<span class="line"><span>    tang.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tang.normalize();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bitang.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);</span></span>
<span class="line"><span>    bitang.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);</span></span>
<span class="line"><span>    bitang.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bitang.normalize();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return {tang, bitang};</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const size = position.size;</span></span>
<span class="line"><span>  if(size &amp;lt; 3) throw new Error(&#39;Error dimension.&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const len = position.data.length / size;</span></span>
<span class="line"><span>  const tang = new Float32Array(len * 3);</span></span>
<span class="line"><span>  const bitang = new Float32Array(len * 3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  for(let i = 0; i &amp;lt; index.data.length; i += 3) {</span></span>
<span class="line"><span>    const i1 = index.data[i];</span></span>
<span class="line"><span>    const i2 = index.data[i + 1];</span></span>
<span class="line"><span>    const i3 = index.data[i + 2];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const p1 = [position.data[i1 * size], position.data[i1 * size + 1], position.data[i1 * size + 2]];</span></span>
<span class="line"><span>    const p2 = [position.data[i2 * size], position.data[i2 * size + 1], position.data[i2 * size + 2]];</span></span>
<span class="line"><span>    const p3 = [position.data[i3 * size], position.data[i3 * size + 1], position.data[i3 * size + 2]];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const u1 = [uv.data[i1 * 2], uv.data[i1 * 2 + 1]];</span></span>
<span class="line"><span>    const u2 = [uv.data[i2 * 2], uv.data[i2 * 2 + 1]];</span></span>
<span class="line"><span>    const u3 = [uv.data[i3 * 2], uv.data[i3 * 2 + 1]];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const {tang: t, bitang: b} = getTBNTriangle(p1, p2, p3, u1, u2, u3);</span></span>
<span class="line"><span>    tang.set(t, i1 * 3);</span></span>
<span class="line"><span>    tang.set(t, i2 * 3);</span></span>
<span class="line"><span>    tang.set(t, i3 * 3);</span></span>
<span class="line"><span>    bitang.set(b, i1 * 3);</span></span>
<span class="line"><span>    bitang.set(b, i2 * 3);</span></span>
<span class="line"><span>    bitang.set(b, i3 * 3);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  geometry.addAttribute(&#39;tang&#39;, {data: tang, size: 3});</span></span>
<span class="line"><span>  geometry.addAttribute(&#39;bitang&#39;, {data: bitang, size: 3});</span></span>
<span class="line"><span>  return geometry;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>虽然上面这段代码比较长，但并不复杂。具体的思路就是按照我给出的公式，先进行向量计算，然后将tang和bitang的值添加到geometry对象中去。</p><h3 id="构建tbn矩阵来计算法向量" tabindex="-1">构建TBN矩阵来计算法向量 <a class="header-anchor" href="#构建tbn矩阵来计算法向量" aria-label="Permalink to &quot;构建TBN矩阵来计算法向量&quot;">​</a></h3><p>有了tang和bitang之后，我们就可以构建TBN矩阵来计算法线了。这里的TBN矩阵的作用，就是将法线贴图里面读取的法向量数据，转换为对应的切线空间中实际的法向量。这里的切线空间，实际上对应着我们观察者（相机）位置的坐标系。</p><p>接下来，我们对应顶点着色器和片元着色器来说说，怎么构建TBN矩阵得出法线方向。</p><p>先看顶点着色器，我们增加了tang和bitang这两个属性。注意，这里我们用了webgl2.0的写法，因为WebGL2.0对应OpenGL ES3.0，所以这段代码和我们之前看到的着色器代码略有不同。</p><p>首先它的第一行声明 #version 300 es 表示这段代码是OpenGL ES3.0的，然后我们用in和out对应变量的输入和输出，来取代WebGL2.0的attribute和varying，其他的地方基本和WebGL1.0一样。因为OGL默认支持WebGL2.0，所以在后续例子中你还会看到更多OpenGL ES3.0的着色器写法，不过因为两个版本差别不大，也不会妨碍我们理解代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#version 300 es</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>in vec3 position;</span></span>
<span class="line"><span>in vec3 normal;</span></span>
<span class="line"><span>in vec2 uv;</span></span>
<span class="line"><span>in vec3 tang;</span></span>
<span class="line"><span>in vec3 bitang;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform mat4 modelMatrix;</span></span>
<span class="line"><span>uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>uniform mat4 viewMatrix;</span></span>
<span class="line"><span>uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>uniform mat3 normalMatrix;</span></span>
<span class="line"><span>uniform vec3 cameraPosition;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>out vec3 vNormal;</span></span>
<span class="line"><span>out vec3 vPos;</span></span>
<span class="line"><span>out vec2 vUv;</span></span>
<span class="line"><span>out vec3 vCameraPos;</span></span>
<span class="line"><span>out mat3 vTBN;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec4 pos = modelViewMatrix * vec4(position, 1.0);</span></span>
<span class="line"><span>  vPos = pos.xyz;</span></span>
<span class="line"><span>  vUv = uv;</span></span>
<span class="line"><span>  vCameraPos = (viewMatrix * vec4(cameraPosition, 1.0)).xyz;</span></span>
<span class="line"><span>  vNormal = normalize(normalMatrix * normal);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec3 N = vNormal;</span></span>
<span class="line"><span>  vec3 T = normalize(normalMatrix * tang);</span></span>
<span class="line"><span>  vec3 B = normalize(normalMatrix * bitang);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vTBN = mat3(T, B, N);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  gl_Position = projectionMatrix * pos;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接着来看代码，我们通过normal、tang和bitang建立TBN矩阵。注意，因为normal、tang和bitang都需要换到世界坐标中，所以我们要记得将它们左乘法向量矩阵normalMatrix，然后我们构建TBN矩阵(vTBN=mat(T,B,N))，将它传给片元着色器。</p><p>下面，我们接着来看片元着色器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#version 300 es</span></span>
<span class="line"><span>precision highp float;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define MAX_LIGHT_COUNT 16</span></span>
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
<span class="line"><span>uniform float specularFactor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uniform sampler2D tNormal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>in vec3 vNormal;</span></span>
<span class="line"><span>in vec3 vPos;</span></span>
<span class="line"><span>in vec2 vUv;</span></span>
<span class="line"><span>in vec3 vCameraPos;</span></span>
<span class="line"><span>in mat3 vTBN;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>out vec4 FragColor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>float getSpecular(vec3 dir, vec3 normal, vec3 eye) {</span></span>
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
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vec3 getNormal() {</span></span>
<span class="line"><span>  vec3 n = texture(tNormal, vUv).rgb * 2.0 - 1.0;</span></span>
<span class="line"><span>  return normalize(vTBN * n);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 eyeDirection = normalize(vCameraPos - vPos);</span></span>
<span class="line"><span>  vec3 normal = getNormal();</span></span>
<span class="line"><span>  vec4 phong = phongReflection(vPos, normal, eyeDirection);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 合成颜色</span></span>
<span class="line"><span>  FragColor.rgb = phong.w + (phong.xyz + ambientLight) * materialReflection;</span></span>
<span class="line"><span>  FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>片元着色器代码虽然也很长，但也并不复杂。因为其中的Phong反射模型，我们已经比较熟悉了。剩下的部分，我们重点理解，怎么从法线纹理中提取数据和TBN矩阵，来计算对应的法线就行了。具体的计算方法就是把法线纹理贴图中提取的数据转换到[-1，1]区间，然后左乘TBN矩阵并归一化。</p><p>然后，我们将经过处理之后的法向量传给phongReflection计算光照，就得到了法线贴图后的结果，效果如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/f669899196e94d06b101bb5eeea69db7.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/f669899196e94d06b101bb5eeea69db7.gif" alt=""></a></p><p>到这里我们就实现了完整的法线贴图。法线贴图就是根据法线纹理中保存的法向量数据以及TBN矩阵，将实际的法线计算出来，然后用实际的法线来计算光照的反射。具体点来说，要实现法线贴图，我们需要通过顶点数据计算几何体的切线和副切线，然后得到TBN矩阵，用TBN矩阵和法线纹理数据来计算法向量，从而完成法线贴图。</p><h3 id="使用偏导数来实现法线贴图" tabindex="-1">使用偏导数来实现法线贴图 <a class="header-anchor" href="#使用偏导数来实现法线贴图" aria-label="Permalink to &quot;使用偏导数来实现法线贴图&quot;">​</a></h3><p>但是，构建TBN矩阵求法向量的方法还是有点麻烦。事实上，还有一种更巧妙的方法，不需要用顶点数据计算几何体的切线和副切线，而是直接用坐标插值和法线纹理来计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vec3 getNormal() {</span></span>
<span class="line"><span>  vec3 pos_dx = dFdx(vPos.xyz);</span></span>
<span class="line"><span>  vec3 pos_dy = dFdy(vPos.xyz);</span></span>
<span class="line"><span>  vec2 tex_dx = dFdx(vUv);</span></span>
<span class="line"><span>  vec2 tex_dy = dFdy(vUv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec3 t = normalize(pos_dx * tex_dy.t - pos_dy * tex_dx.t);</span></span>
<span class="line"><span>  vec3 b = normalize(-pos_dx * tex_dy.s + pos_dy * tex_dx.s);</span></span>
<span class="line"><span>  mat3 tbn = mat3(t, b, normalize(vNormal));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec3 n = texture(tNormal, vUv).rgb * 2.0 - 1.0;</span></span>
<span class="line"><span>  return normalize(tbn * n);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上面代码所示，dFdx、dFdy是GLSL内置函数，可以求插值的属性在x、y轴上的偏导数。那我们为什么要求偏导数呢？ <strong>偏导数</strong> 其实就代表插值的属性向量在x、y轴上的变化率，或者说曲面的切线。然后，我们再将顶点坐标曲面切线与uv坐标的切线求叉积，就能得到垂直于两条切线的法线。</p><p>那我们在x、y两个方向上求出的两条法线，就对应TBN空间的切线tang和副切线bitang。然后，我们使用偏导数构建TBN矩阵，同样也是把TBN矩阵左乘从法线纹理中提取出的值，就可以计算出对应的法向量了。</p><p>这样做的好处是，我们不需要预先计算几何体的tang和bitang了。不过在片元着色器中计算偏导数也有一定的性能开销，所以各有利弊，我们可以根据不同情况选择不同的方案。</p><h2 id="法线贴图的应用" tabindex="-1">法线贴图的应用 <a class="header-anchor" href="#法线贴图的应用" aria-label="Permalink to &quot;法线贴图的应用&quot;">​</a></h2><p>法线贴图的两种实现方式，我们都学会了。那法线贴图除了给几何体表面增加花纹以外，还可以用来增强物体细节，让物体看起来更加真实。比如说，在实现一个石块被变化的光源照亮效果的时候，我们就可以运用法线贴图技术，让石块的表面纹路细节显得非常的逼真。我把对应的片元着色器核心代码放在了下面，你可以利用今天学到的知识自己来实现一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/b28f5b31af8af0708e77e47e584a845b.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/b28f5b31af8af0708e77e47e584a845b.gif" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uniform float uTime;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void main() {</span></span>
<span class="line"><span>  vec3 eyeDirection = normalize(vCameraPos - vPos);</span></span>
<span class="line"><span>  vec3 normal = getNormal();</span></span>
<span class="line"><span>  vec4 phong = phongReflection(vPos, normal, eyeDirection);</span></span>
<span class="line"><span>  // vec4 phong = phongReflection(vPos, vNormal, eyeDirection);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  vec3 tex = texture(tMap, vUv).rgb;</span></span>
<span class="line"><span>  vec3 light = normalize(vec3(sin(uTime), 1.0, cos(uTime)));</span></span>
<span class="line"><span>  float shading = dot(normal, light) * 0.5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  FragColor.rgb = tex + shading;</span></span>
<span class="line"><span>  FragColor.a = 1.0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这节课，我们详细说了法线贴图这个技术。法线贴图是一种经典的图形学技术，可以用来给物体表面增加细节，让我们实现的效果更逼真。</p><p>具体来说，法线贴图是用一张图片来存储表面的法线数据。这张图片叫做法线纹理，它上面的每个像素对应一个坐标点的法线数据。</p><p>要想使用法线纹理的数据，我们还需要构建TBN矩阵。这个矩阵通过向量、矩阵乘法将法线数据转换到世界坐标中。</p><p>构建TBN矩阵我们有两个方法，一个是根据几何体顶点数据来计算切线（Tangent）、副切线（Bitangent），然后结合法向量一起构建TBN矩阵。另一个方法是使用偏导数来计算，这样我们就不用预先在顶点中计算Tangent和Bitangent了。两种方法各有利弊，我们可以根据实际情况来合理选择。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>这里，我给出了两张图片，一张是纹理图片，一张是法线纹理，你能用它们分别来绘制一面墙，并且引入Phong反射模型，来实现光照效果吗？你还可以思考一下，应用法线贴图和不应用法线贴图绘制出来的墙，有什么差别？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/d107b4eeb30d46a37fa9ca85fa9b223b.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/274956/d107b4eeb30d46a37fa9ca85fa9b223b.jpeg" alt=""></a></p><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课再见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>课程中完整示例代码见 <a href="https://github.com/akira-cn/graphics/tree/master/normal-maps" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p><a href="https://learnopengl.com/Advanced-Lighting/Normal-Mapping" target="_blank" rel="noreferrer">Normal mapping</a></p>`,65)])])}const m=a(i,[["render",l]]);export{h as __pageData,m as default};
