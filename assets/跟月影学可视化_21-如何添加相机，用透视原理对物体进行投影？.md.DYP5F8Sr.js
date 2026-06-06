import{_ as s,H as a,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"21 | 如何添加相机，用透视原理对物体进行投影？","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何理解相机和视图矩阵？","slug":"如何理解相机和视图矩阵","link":"#如何理解相机和视图矩阵","children":[]},{"level":2,"title":"剪裁空间和投影对3D图像的影响","slug":"剪裁空间和投影对3d图像的影响","link":"#剪裁空间和投影对3d图像的影响","children":[]},{"level":2,"title":"3D绘图标准模型","slug":"_3d绘图标准模型","link":"#_3d绘图标准模型","children":[]},{"level":2,"title":"如何使用OGL绘制基本的几何体","slug":"如何使用ogl绘制基本的几何体","link":"#如何使用ogl绘制基本的几何体","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/21-如何添加相机，用透视原理对物体进行投影？.md","filePath":"跟月影学可视化/21-如何添加相机，用透视原理对物体进行投影？.md","lastUpdated":1779822292000}'),t={name:"跟月影学可视化/21-如何添加相机，用透视原理对物体进行投影？.md"};function i(l,n,o,r,c,h){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_21-如何添加相机-用透视原理对物体进行投影" tabindex="-1">21 | 如何添加相机，用透视原理对物体进行投影？ <a class="header-anchor" href="#_21-如何添加相机-用透视原理对物体进行投影" aria-label="Permalink to &quot;21 | 如何添加相机，用透视原理对物体进行投影？&quot;">​</a></h1><p>你好，我是月影。</p><p>上节课，我们在绘制3D几何体的时候，实际上有一个假设，那就是观察者始终从三维空间坐标系的正面，也就是z轴正方向，看向坐标原点。但在真实世界的模型里，观察者可以处在任何一个位置上。</p><p>那今天，我们就在上节课的基础上，引入一个空间观察者的角色，或者说是相机（Camera），来总结一个更通用的绘图模型。这样，我们就能绘制出，从三维空间中任意一个位置观察物体的效果了。</p><p>首先，我们来说说什么是相机。</p><h2 id="如何理解相机和视图矩阵" tabindex="-1">如何理解相机和视图矩阵？ <a class="header-anchor" href="#如何理解相机和视图矩阵" aria-label="Permalink to &quot;如何理解相机和视图矩阵？&quot;">​</a></h2><p>我们现在假设，在WebGL的三维世界任意位置上有一个相机，它可以用一个三维坐标（Position）和一个三维向量方向（LookAt Target）来表示。</p><p>在初始情况下，相机的参考坐标和世界坐标是重合的。但是，当我们移动或者旋转相机的时候，相机的参考坐标和世界坐标就不重合了。</p><p>而我们最终要在Canvas画布上绘制出的是，以相机为观察者的图形，所以我们就需要用一个变换，将世界坐标转换为相机坐标。这个变换的矩阵就是 <strong>视图矩阵</strong>（ViewMatrix）。</p><p>计算视图矩阵比较简单的一种方法是，我们先计算相机的模型矩阵，然后对矩阵使用lookAt函数，这样我们得到的矩阵就是视图矩阵的逆矩阵。然后，我们再对这个逆矩阵求一次逆，就可以得到视图矩阵了。</p><p>这么说还是有点比较抽象，我们通过代码来理解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function updateCamera(eye, target = [0, 0, 0]) {</span></span>
<span class="line"><span>  const [x, y, z] = eye;</span></span>
<span class="line"><span>  const m = new Mat4(</span></span>
<span class="line"><span>    1, 0, 0, 0,</span></span>
<span class="line"><span>    0, 1, 0, 0,</span></span>
<span class="line"><span>    0, 0, 1, 0,</span></span>
<span class="line"><span>    x, y, z, 1,</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>  const up = [0, 1, 0];</span></span>
<span class="line"><span>  m.lookAt(eye, target, up).inverse();</span></span>
<span class="line"><span>  renderer.uniforms.viewMatrix = m;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上面代码所示，我们设置相机初始位置矩阵m，然后执行m.lookAt(eye, target, up)，这里的up是一个向量，表示朝上的方向，我们把它定义为y轴正向。然后我们调用inverse，将这个结果求逆，得到的就是视图矩阵。</p><p>为了让你看到相机的效果，我们改写上节课圆柱体的顶点着色器代码，加入视图矩阵。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> attribute vec3 a_vertexPosition;</span></span>
<span class="line"><span>  attribute vec4 color;</span></span>
<span class="line"><span>  attribute vec3 normal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec4 vColor;</span></span>
<span class="line"><span>  varying float vCos;</span></span>
<span class="line"><span>  uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>  uniform mat4 modelMatrix;</span></span>
<span class="line"><span>  uniform mat4 viewMatrix;</span></span>
<span class="line"><span>  uniform mat3 normalMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const vec3 lightPosition = vec3(1, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>    gl_PointSize = 1.0;</span></span>
<span class="line"><span>    vColor = color;</span></span>
<span class="line"><span>    vec4 pos = viewMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);</span></span>
<span class="line"><span>    vec4 lp = viewMatrix * vec4(lightPosition, 1.0);</span></span>
<span class="line"><span>    vec3 invLight = lp.xyz - pos.xyz;</span></span>
<span class="line"><span>    vec3 norm = normalize(normalMatrix * normal);</span></span>
<span class="line"><span>    vCos = max(dot(normalize(invLight), norm), 0.0);</span></span>
<span class="line"><span>    gl_Position = projectionMatrix * pos;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这样，如果我们就把相机位置改变了。我们以updateCamera([0.5, 0, 0.5]); 为例，这样朝向(0, 0, 0)拍摄图像的最终效果就如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/0cb89b225568d718d3b0e29ec2107a3d.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/0cb89b225568d718d3b0e29ec2107a3d.jpeg" alt=""></a></p><h2 id="剪裁空间和投影对3d图像的影响" tabindex="-1">剪裁空间和投影对3D图像的影响 <a class="header-anchor" href="#剪裁空间和投影对3d图像的影响" aria-label="Permalink to &quot;剪裁空间和投影对3D图像的影响&quot;">​</a></h2><p>在前面的课程中我们说过，WebGL的默认坐标范围是从-1到1的。也就是说，只有当图像的x、y、z的值在-1到1区间内才会被显示在画布上，而在其他位置上的图像都会被剪裁掉。</p><p>举个例子，如果我们修改模型矩阵，让圆柱体沿x、y轴平移，向右上方各平移0.5，那么圆柱中x、y值大于1的部分都会被剪裁掉，因为这些部分已经超过了Canvas边缘。操作代码和最终效果如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function update() {</span></span>
<span class="line"><span>  const modelMatrix = fromRotation(rotationX, rotationY, rotationZ);</span></span>
<span class="line"><span>  modelMatrix[12] = 0.5; // 给 x 轴增加 0.5 的平移</span></span>
<span class="line"><span>  modelMatrix[13] = 0.5; // 给 y 轴也增加 0.5 的平移</span></span>
<span class="line"><span>  renderer.uniforms.modelMatrix = modelMatrix;</span></span>
<span class="line"><span>  renderer.uniforms.normalMatrix = normalFromMat4([], modelMatrix);</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/0ce1b0da1ddaf4c993f928a6fc16a869.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/0ce1b0da1ddaf4c993f928a6fc16a869.jpeg" alt=""></a></p><p>对于只有x、y的二维坐标系来说，这一点很好理解。但是，对于三维坐标系来说，不仅x、y轴会被剪裁，z轴同样也会被剪裁。我们还是直接修改代码，给z轴增加0.5的平移。你会看到，最终绘制出来的图形非常奇怪。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/a0808ebaf37784b633271e1b41047e8c.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/a0808ebaf37784b633271e1b41047e8c.jpeg" alt=""></a></p><p>会显示这么奇怪的结果，就是因为z轴超过范围的部分也被剪裁掉了，导致投影出现了问题。</p><p>既然是投影出现了问题，我们先回想一下，我们都对z轴做过哪些投影操作。在绘制圆柱体的时候，我们只是用投影矩阵非常简单地反转了一下z轴，除此之外，没做过其他任何操作了。所以，为了让图形在剪裁空间中正确显示，我们不能只反转z轴，还需要将图像从三维空间中 <strong>投影</strong> 到剪裁坐标内。那么问题来了，图像是怎么被投影到剪裁坐标内的呢？</p><p>一般来说，投影有两种方式，分别是 <strong>正投影</strong> 与 <strong>透视投影</strong>。你可以结合我给出的示意图，来理解它们各自的特点。</p><p><strong>首先是正投影</strong>，它又叫做平行投影。正投影是将物体投影到一个长方体的空间（又称为视景体），并且无论相机与物体距离多远，投影的大小都不变。</p><p><a href="https://glumes.com/post/opengl/opengl-tutorial-projection-matrix/" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/d69c5a24cf92bea9ebf24f6222a225b1.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/d69c5a24cf92bea9ebf24f6222a225b1.jpeg" alt=""></a></a></p><p>而 <strong>透视投影</strong> 则更接近我们的视觉感知。它投影的规律是，离相机近的物体大，离相机远的物体小。与正投影不同，正投影的视景体是一个长方体，而透视投影的视景体是一个棱台。</p><p><a href="https://glumes.com/post/opengl/opengl-tutorial-projection-matrix/" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/fd76c623daba4a80f6c557e03a82bb43.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/fd76c623daba4a80f6c557e03a82bb43.jpeg" alt=""></a></a></p><p>知道了不同投影方式的特点，我们就可以根据投影方式和给定的参数来计算投影矩阵了。因为数学推导过程比较复杂，我在这里就不详细推导了，直接给出对应的JavaScript函数，你只要记住ortho和perspective这两个投影函数就可以了，函数如下所示。</p><p>其中，ortho是计算正投影的函数，它的参数是视景体x、y、z三个方向的坐标范围，它的返回值就是投影矩阵。而perspective是计算透视投影的函数，它的参数是近景平面near、远景平面far、视角fov和宽高比率aspect，返回值也是投影矩阵。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 计算正投影矩阵</span></span>
<span class="line"><span>function ortho(out, left, right, bottom, top, near, far) {</span></span>
<span class="line"><span>   let lr = 1 / (left - right);</span></span>
<span class="line"><span>   let bt = 1 / (bottom - top);</span></span>
<span class="line"><span>   let nf = 1 / (near - far);</span></span>
<span class="line"><span>   out[0] = -2 * lr;</span></span>
<span class="line"><span>   out[1] = 0;</span></span>
<span class="line"><span>   out[2] = 0;</span></span>
<span class="line"><span>   out[3] = 0;</span></span>
<span class="line"><span>   out[4] = 0;</span></span>
<span class="line"><span>   out[5] = -2 * bt;</span></span>
<span class="line"><span>   out[6] = 0;</span></span>
<span class="line"><span>   out[7] = 0;</span></span>
<span class="line"><span>   out[8] = 0;</span></span>
<span class="line"><span>   out[9] = 0;</span></span>
<span class="line"><span>   out[10] = 2 * nf;</span></span>
<span class="line"><span>   out[11] = 0;</span></span>
<span class="line"><span>   out[12] = (left + right) * lr;</span></span>
<span class="line"><span>   out[13] = (top + bottom) * bt;</span></span>
<span class="line"><span>   out[14] = (far + near) * nf;</span></span>
<span class="line"><span>   out[15] = 1;</span></span>
<span class="line"><span>   return out;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 计算透视投影矩阵</span></span>
<span class="line"><span>function perspective(out, fovy, aspect, near, far) {</span></span>
<span class="line"><span>   let f = 1.0 / Math.tan(fovy / 2);</span></span>
<span class="line"><span>   let nf = 1 / (near - far);</span></span>
<span class="line"><span>   out[0] = f / aspect;</span></span>
<span class="line"><span>   out[1] = 0;</span></span>
<span class="line"><span>   out[2] = 0;</span></span>
<span class="line"><span>   out[3] = 0;</span></span>
<span class="line"><span>   out[4] = 0;</span></span>
<span class="line"><span>   out[5] = f;</span></span>
<span class="line"><span>   out[6] = 0;</span></span>
<span class="line"><span>   out[7] = 0;</span></span>
<span class="line"><span>   out[8] = 0;</span></span>
<span class="line"><span>   out[9] = 0;</span></span>
<span class="line"><span>   out[10] = (far + near) * nf;</span></span>
<span class="line"><span>   out[11] = -1;</span></span>
<span class="line"><span>   out[12] = 0;</span></span>
<span class="line"><span>   out[13] = 0;</span></span>
<span class="line"><span>   out[14] = 2 * far * near * nf;</span></span>
<span class="line"><span>   out[15] = 0;</span></span>
<span class="line"><span>   return out;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们先试试对圆柱体进行正投影。假设，在正投影的时候，我们让视景体三个方向的范围都是(-2,2)。以刚才的相机位置为参照（任何一个位置观察都一样，不管物体在哪里，都是只有之前大小的一半。因为视景体范围增加了），我们绘制出来的圆柱体的大小只有之前的一半。这是因为我们通过投影变换将空间坐标范围增大了一倍。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {ortho} from &#39;../common/lib/math/functions/Mat4Func.js&#39;;</span></span>
<span class="line"><span>function projection(left, right, bottom, top, near, far) {</span></span>
<span class="line"><span>  return ortho([], left, right, bottom, top, near, far);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const projectionMatrix = projection(-2, 2, -2, 2, -2, 2);</span></span>
<span class="line"><span>renderer.uniforms.projectionMatrix = projectionMatrix; // 投影矩阵</span></span>
<span class="line"><span></span></span>
<span class="line"><span>updateCamera([0.5, 0, 0.5]); // 设置相机位置</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/05fdd4fe5e56eaf27e1f1a00825e8yyb.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/05fdd4fe5e56eaf27e1f1a00825e8yyb.jpeg" alt=""></a></p><p>接下来，我们再试一下对圆柱体进行透视投影。在进行透视投影的时候，我们将相机的位置放在(2, 2, 3)的地方。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {perspective} from &#39;../common/lib/math/functions/Mat4Func.js&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function projection(near = 0.1, far = 100, fov = 45, aspect = 1) {</span></span>
<span class="line"><span>  return perspective([], fov * Math.PI / 180, aspect, near, far);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const projectionMatrix = projection();</span></span>
<span class="line"><span>renderer.uniforms.projectionMatrix = projectionMatrix;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>updateCamera([2, 2, 3]); // 设置相机位置</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/cb20b6589554e7bae62567d68bff7938.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/cb20b6589554e7bae62567d68bff7938.jpeg" alt=""></a></p><p>我们发现，在透视投影下，距离观察者（相机）近的部分大，距离它远的部分小。这更符合真实世界中我们看到的效果，所以一般来说，在绘制3D图形时，我们更偏向使用透视投影。</p><h2 id="_3d绘图标准模型" tabindex="-1">3D绘图标准模型 <a class="header-anchor" href="#_3d绘图标准模型" aria-label="Permalink to &quot;3D绘图标准模型&quot;">​</a></h2><p>实际上，通过上节课和刚才的内容，我们已经能总结出3D绘制几何体的基本数学模型，也就是3D绘图的 <strong>标准模型</strong>。这个标准模型一共有四个矩阵，它们分别是： <strong>投影矩阵、视图矩阵（ViewMatrix）、模型矩阵（ModelMatrix）、法向量矩阵（NormalMatrix）</strong>。</p><p>其中，前三个矩阵用来计算最终显示的几何体的顶点位置，第四个矩阵用来实现光照等效果。比较成熟的图形库，如 <a href="https://threejs.org/" target="_blank" rel="noreferrer">ThreeJS</a>、 <a href="https://www.babylonjs.com/" target="_blank" rel="noreferrer">BabylonJS</a>，基本上都是采用这个标准模型来进行3D绘图的。所以理解这个模型，也有助于增强我们对图形库的认识，帮助我们更好地去使用这些流行的图形库。</p><p>在前面的课程中，因为WebGL原生的API在使用上比较复杂，所以我们使用了简易的gl-renderer库来简化2D绘图过程。而3D绘图是一个比2D绘图更加复杂的过程，即使是gl-renderer库也有点力不从心，我们需要更加强大的绘图库，来简化我们的绘制，以便于我们能够把精力专注于理解图形学本身的核心内容。</p><p>当然，使用ThreeJS或BabeylonJS都是不错的选择。但是在这节课中，我会使用一个更加轻量级的图形库，叫做 <a href="https://github.com/oframe/ogl" target="_blank" rel="noreferrer">OGL</a>。它拥有我们可视化绘图需要的所有基本功能，而且，相比于ThreeJS等流行图形库，它的AP相对更底层、更简单一些。因此不会有太多高级的特性对我们的学习造成干扰。</p><p>接下来，我就用这个库来绘制一些简单的圆柱体、立方体等等，让你对这个库的使用有一个全面的了解。</p><h2 id="如何使用ogl绘制基本的几何体" tabindex="-1">如何使用OGL绘制基本的几何体 <a class="header-anchor" href="#如何使用ogl绘制基本的几何体" aria-label="Permalink to &quot;如何使用OGL绘制基本的几何体&quot;">​</a></h2><p>OGL库使用的也是我们刚才说的标准模型，因此，使用它所以绘制几何体非常简单，分成以下7个步骤，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/5b2b4622f1bea87199788d20a2629b4c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/5b2b4622f1bea87199788d20a2629b4c.jpg" alt=""></a></p><p>接下来，我们详细来看看每一步的操作。</p><p>首先，是创建Renderer对象。我们可以创建一个画布宽高为512的Renderer对象。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const canvas = document.querySelector(&#39;canvas&#39;);</span></span>
<span class="line"><span>const renderer = new Renderer({</span></span>
<span class="line"><span>  canvas,</span></span>
<span class="line"><span>  width: 512,</span></span>
<span class="line"><span>  height: 512,</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>然后，我们在OGL中，通过new Camera来创建相机，默认创建出的是透视投影相机。这里我们把视角设置为35度，位置设置为(0,1,7)，朝向为(0,0,0)。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const gl = renderer.gl;</span></span>
<span class="line"><span>gl.clearColor(1, 1, 1, 1);</span></span>
<span class="line"><span>const camera = new Camera(gl, {fov: 35});</span></span>
<span class="line"><span>camera.position.set(0, 1, 7);</span></span>
<span class="line"><span>camera.lookAt([0, 0, 0]);</span></span></code></pre></div><p>接着，我们创建场景。OGL使用树形渲染的方式，所以在用OGL创建场景时，我们要使用Transform元素。Transform类型是基本元素，它可以添加子元素和设置几何变换，如果父元素设置了变换，这些变换也会被应用到子元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const scene = new Transform();</span></span></code></pre></div><p>然后，我们创建几何体对象。OGL内置了许多常用的几何体对象，包括球体Sphere、立方体Box、柱/锥体Cylinder以及环面Torus等等。使用这些对象，我们可以快速创建这些几何体的顶点信息。那在这里，我创建了4个几何体对象，分别是球体、立方体、椎体和环面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const sphereGeometry = new Sphere(gl);</span></span>
<span class="line"><span>const cubeGeometry = new Box(gl);</span></span>
<span class="line"><span>const cylinderGeometry = new Cylinder(gl);</span></span>
<span class="line"><span>const torusGeometry = new Torus(gl);</span></span></code></pre></div><p>再然后，我们创建 WebGL 程序。并且，我们在着色器中给这些几何体设置了浅蓝色和简单的光照效果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const vertex = /* glsl */ \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  attribute vec3 position;</span></span>
<span class="line"><span>  attribute vec3 normal;</span></span>
<span class="line"><span>  uniform mat4 modelViewMatrix;</span></span>
<span class="line"><span>  uniform mat4 projectionMatrix;</span></span>
<span class="line"><span>  uniform mat3 normalMatrix;</span></span>
<span class="line"><span>  varying vec3 vNormal;</span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>      vNormal = normalize(normalMatrix * normal);</span></span>
<span class="line"><span>      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const fragment = /* glsl */ \`</span></span>
<span class="line"><span>  precision highp float;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  varying vec3 vNormal;</span></span>
<span class="line"><span>  void main() {</span></span>
<span class="line"><span>      vec3 normal = normalize(vNormal);</span></span>
<span class="line"><span>      float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));</span></span>
<span class="line"><span>      gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1;</span></span>
<span class="line"><span>      gl_FragColor.a = 1.0;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>\`;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const program = new Program(gl, {</span></span>
<span class="line"><span>  vertex,</span></span>
<span class="line"><span>  fragment,</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>有了WebGL程序之后，我们使用它和几何体对象来构建真正的网格（Mesh）元素，最终再把这些元素渲染到画布上。我们创建了4个网格对象，它们的形状分别是环面、球体、立方体和圆柱，我们给它们设置了不同的位置，然后将它们添加到场景scene中去。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const torus = new Mesh(gl, {geometry: torusGeometry, program});</span></span>
<span class="line"><span>torus.position.set(0, 1.3, 0);</span></span>
<span class="line"><span>torus.setParent(scene);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const sphere = new Mesh(gl, {geometry: sphereGeometry, program});</span></span>
<span class="line"><span>sphere.position.set(1.3, 0, 0);</span></span>
<span class="line"><span>sphere.setParent(scene);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const cube = new Mesh(gl, {geometry: cubeGeometry, program});</span></span>
<span class="line"><span>cube.position.set(0, -1.3, 0);</span></span>
<span class="line"><span>cube.setParent(scene);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const cylinder = new Mesh(gl, {geometry: cylinderGeometry, program});</span></span>
<span class="line"><span>cylinder.position.set(-1.3, 0, 0);</span></span>
<span class="line"><span>cylinder.setParent(scene);</span></span></code></pre></div><p>最后，我们将它们用相机camera对象的设定渲染出来，并分别设置绕y轴旋转的动画，你就能看到这4个图像旋转的画面了。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>requestAnimationFrame(update);</span></span>
<span class="line"><span>function update() {</span></span>
<span class="line"><span>  requestAnimationFrame(update);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  torus.rotation.y -= 0.02;</span></span>
<span class="line"><span>  sphere.rotation.y -= 0.03;</span></span>
<span class="line"><span>  cube.rotation.y -= 0.04;</span></span>
<span class="line"><span>  cylinder.rotation.y -= 0.02;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  renderer.render({scene, camera});</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/b8eb9696d1201035d962bf39f6105141.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/b8eb9696d1201035d962bf39f6105141.gif" alt=""></a></p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>在这一节课，我们在三维空间里，引入了相机和视图矩阵的概念，相机分为透视相机和正交相机，它们有不同的投影方式，并且设置它们还可以改变剪裁空间。视图矩阵和前一节课介绍的投影矩阵、模型矩阵、法向量矩阵一起，构成了3D绘图标准模型，这是一般的图形库遵循的标准绘图方式。</p><p>为了巩固学习到的知识，我们使用OGL库来尝试绘制不同的3D几何体，我们依次用OGL绘制了球体、立方体、圆柱体和环面。OGL绘制图形的基本步骤可以总结为7步，如下图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/5b2b4622f1bea87199788d20a2629b4c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/271225/5b2b4622f1bea87199788d20a2629b4c.jpg" alt=""></a></p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><ol><li>在上面的例子里，使用OGL绘制的球体看起来不是很圆，你可以研究一下 <a href="https://github.com/oframe/ogl" target="_blank" rel="noreferrer">OGL的代码</a>，修改一下创建球体的参数，让它看起来更圆。</li><li>你能试着修改一下片元着色器，让上面绘制的4个几何体呈现不同的颜色吗？将它们分别改成红色、黄色、蓝色和绿色。</li></ol><p>欢迎在留言区和我讨论，分享你的答案和思考，也欢迎你把这节课分享给你的朋友，我们下节课见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>课程中完整示例代码详见 <a href="https://github.com/akira-cn/graphics/tree/master/3d-camera" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p><a href="https://github.com/oframe/ogl" target="_blank" rel="noreferrer">OGL</a></p>`,78)])])}const b=s(t,[["render",i]]);export{u as __pageData,b as default};
