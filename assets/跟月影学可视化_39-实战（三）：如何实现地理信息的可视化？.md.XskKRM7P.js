import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"39 | 实战（三）：如何实现地理信息的可视化？","description":"","frontmatter":{},"headers":[{"level":2,"title":"步骤一：准备数据","slug":"步骤一-准备数据","link":"#步骤一-准备数据","children":[]},{"level":2,"title":"步骤二：绘制地图","slug":"步骤二-绘制地图","link":"#步骤二-绘制地图","children":[]},{"level":2,"title":"步骤三：整合数据","slug":"步骤三-整合数据","link":"#步骤三-整合数据","children":[]},{"level":2,"title":"步骤四：将数据与地图结合","slug":"步骤四-将数据与地图结合","link":"#步骤四-将数据与地图结合","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"课后练习","slug":"课后练习","link":"#课后练习","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/39-实战（三）：如何实现地理信息的可视化？.md","filePath":"跟月影学可视化/39-实战（三）：如何实现地理信息的可视化？.md","lastUpdated":1779822292000}'),t={name:"跟月影学可视化/39-实战（三）：如何实现地理信息的可视化？.md"};function i(l,a,o,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_39-实战-三-如何实现地理信息的可视化" tabindex="-1">39 | 实战（三）：如何实现地理信息的可视化？ <a class="header-anchor" href="#_39-实战-三-如何实现地理信息的可视化" aria-label="Permalink to &quot;39 | 实战（三）：如何实现地理信息的可视化？&quot;">​</a></h1><p>你好，我是月影。</p><p>前段时间，我们经常能看到新冠肺炎的疫情地图。这些疫情地图非常直观地呈现了世界上不同国家和地区，一段时间内的新冠肺炎疫情进展，能够帮助我们做好应对疫情的决策。实际上，这些疫情地图都属于地理位置信息可视化，而这类信息可视化的主要呈现方式就是地图。</p><p>在如今的互联网领域，地理信息可视化应用非常广泛。除了疫情地图，我们平时使用外卖订餐、春运交通、滴滴打车，这些App中都有地理信息可视化的实现。</p><p>那地理信息可视化该如何实现呢？今天，我们就通过一个疫情地图的实现，来讲一讲地理信息可视化该怎么实现。</p><p>假设，我们要使用世界地图的可视化，来呈现不同国家和地区，从2020年1月22日到3月19日这些天的新冠肺炎疫情进展。我们具体该怎么做呢？主要有四个步骤，分别是准备数据、绘制地图、整合数据和更新绘制方法。下面，我们一一来看。</p><h2 id="步骤一-准备数据" tabindex="-1">步骤一：准备数据 <a class="header-anchor" href="#步骤一-准备数据" aria-label="Permalink to &quot;步骤一：准备数据&quot;">​</a></h2><p>新冠肺炎的官方数据在WHO网站上每天都会更新，我们可以直接找到2020年1月22日到3月19日的数据，将这些数据收集和整理成一份JSON文件。这份JSON文件的内容比较大，我把它放在Github上了，你可以去 <a href="https://github.com/akira-cn/graphics/blob/master/covid-vis/assets/data/covid-data.json" target="_blank" rel="noreferrer">Github仓库</a> 查看这份数据。</p><p>有了JSON数据之后，我们就可以将这个数据和世界地图上的国家一一对应。那接下来的任务就是准备世界地图，想要绘制一份世界地图，我们也需要有世界地图的地理数据，这也是一份JSON文件。</p><p>地理数据通常可以从开源社区中获取公开数据，或者从相应国家的测绘部门获取当地的公开数据。这次用到的世界地图的数据，我们是通过开源社区获得的。</p><p>一般来说，地图的JSON文件有两种数据格式，一种是GeoJSON，另一种是TopoJSON。其中GeoJSON是基础格式，它包含了描述地图地理信息的坐标数据。举个简单的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;type&quot;:&quot;FeatureCollection&quot;,</span></span>
<span class="line"><span>    &quot;features&quot;: [</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>          &quot;type&quot;:&quot;Feature&quot;,</span></span>
<span class="line"><span>          &quot;geometry&quot;:{</span></span>
<span class="line"><span>              &quot;type&quot;:&quot;Polygon&quot;,</span></span>
<span class="line"><span>              &quot;coordinates&quot;:</span></span>
<span class="line"><span>              [</span></span>
<span class="line"><span>                  [[117.42218831167838,31.68971206252246],</span></span>
<span class="line"><span>                  [118.8025942451759,31.685801564127132],</span></span>
<span class="line"><span>                  [118.79961418869482,30.633841626314336],</span></span>
<span class="line"><span>                  [117.41920825519742,30.637752124709664],</span></span>
<span class="line"><span>                  [117.42218831167838,31.68971206252246]]</span></span>
<span class="line"><span>              ]</span></span>
<span class="line"><span>          },</span></span>
<span class="line"><span>          &quot;properties&quot;:{&quot;Id&quot;:0}</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码就是一个合法的GeoJSON数据，它定义了一个地图上的多边形区域，坐标是由四个包含了经纬度的点组成的（代码中一共是五个点，但是首尾两个点是重合的）。</p><p>那什么是TopoJSON格式呢？TopoJSON格式就是GeoJSON格式经过压缩之后得到的，它通过对坐标建立索引来减少冗余，数据压缩能够大大减少JSON文件的体积。</p><p>因为这节课的重点主要是地理信息的可视化绘制，而GeoJSON和TopJSON文件格式的具体规范又比较复杂，不是我们课程的重点，所以我就不详细来讲了。如果你有兴趣进一步学习，可以参考我在课后给出的资料。</p><p>这节课，我们直接使用我准备好的两份世界地图的JSON数据就可以了，一份是 <a href="https://github.com/akira-cn/graphics/blob/master/convid-vis/assets/data/world-geojson.json" target="_blank" rel="noreferrer">GeoJSON数据</a>，一份是 <a href="https://github.com/akira-cn/graphics/blob/master/convid-vis/assets/data/world-topojson.json" target="_blank" rel="noreferrer">TopoJSON数据</a>。接下来，我们会分别来讲怎么使用它们来绘制地图。</p><h2 id="步骤二-绘制地图" tabindex="-1">步骤二：绘制地图 <a class="header-anchor" href="#步骤二-绘制地图" aria-label="Permalink to &quot;步骤二：绘制地图&quot;">​</a></h2><p>将数据绘制成地图的方法有很多种，我们既可以用Canvas2D、也可以用SVG，还可以用WebGL。除了用WebGL相对复杂，用Canvas2D和SVG都比较简单。为了方便你理解，我选择用比较简单的Canvas2D来绘制地图。</p><p>首先，我们将GeoJSON数据中，coordinates属性里的经纬度信息转换成画布坐标，这个转换被称为地图投影。实际上，地图有很多种投影方式，但最简单的方式是 <strong>墨卡托投影</strong>，也叫做等圆柱投影。它的实现思路就是把地球从南北两极往外扩，先变成一个圆柱体，再将世界地图看作是贴在圆柱侧面的曲面，经纬度作为x、y坐标。最后，我们再把圆柱侧面展开，经纬度自然就被投影到平面上了。</p><p><a href="https://zh.wikipedia.org/wiki/%E9%BA%A5%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1%E6%B3%95" target="_blank" rel="noreferrer"><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/cc45e95168fbfaf5bb76df694c13e3f4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/cc45e95168fbfaf5bb76df694c13e3f4.jpg" alt=""></a></a></p><p>墨卡托投影是最常用的投影方式，因为它的坐标转换非常简单，而且经过墨卡托投影之后的地图中，国家和地区的形状与真实的形状仍然保持一致。但它也有缺点，由于是从两极往外扩，因此高纬度国家的面积看起来比实际的面积要大，并且维度越高面积偏离的幅度越大。</p><p>在地图投影之前，我们先来明确一下经纬度的基本概念。经度的范围是-180度到180度，负数代表西经，正数代表东经。纬度的范围是-90度到90度，负数代表南纬，正数代表北纬。</p><p>接下来，我们就可以将经纬度按照墨卡托投影的方式转换为画布上的x、y坐标。对应的经纬度投影如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/b06a496725cdff471bf531ab3721ddc4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/b06a496725cdff471bf531ab3721ddc4.jpg" alt=""></a></p><p>注意，精度范围是360度，而维度范围是180度，而且因为y轴向下，所以计算y需要用1.0减一下。</p><p>所以对应的换算公式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>x = width * (180 + longitude) / 360;</span></span>
<span class="line"><span>y = height * (1.0 - (90 + latitude) / 180); // Canvas坐标系y轴朝下</span></span></code></pre></div><p>其中，longitude是经度，latitude是纬度，width是Canvas的宽度，height是Canvas的高度。</p><p>那有了换算公式，我们将它封装成投影函数，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 将geojson数据用墨卡托投影方式投影到1024*512宽高的canvas上</span></span>
<span class="line"><span>const width = 1024;</span></span>
<span class="line"><span>const height = 512;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function projection([longitude, latitude]) {</span></span>
<span class="line"><span>  const x = width * (180 + longitude) / 360;</span></span>
<span class="line"><span>  const y = height * (1.0 - (90 + latitude) / 180); // Canvas坐标系y轴朝下</span></span>
<span class="line"><span>  return [x, y];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了投影函数之后，我们就可以读取和遍历GeoJSON数据了。</p><p>我们用fetch来读取JSON文件，将它包含地理信息的字段取出来。根据GeoJSON规范，这个字段是features字段，类型是数组，然后我们通过forEach方法遍历这个数组。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>(async function () {</span></span>
<span class="line"><span>  const worldData = await (await fetch(&#39;./assets/data/world-geojson.json&#39;)).json();</span></span>
<span class="line"><span>  const features = worldData.features;</span></span>
<span class="line"><span>  features.forEach(({geometry}) =&amp;gt; {</span></span>
<span class="line"><span>    ...遍历数据</span></span>
<span class="line"><span>    ...进行投影转换</span></span>
<span class="line"><span>    ...进行绘制</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}();</span></span></code></pre></div><p>在forEach迭代的时候，我们可以拿到features数组中每一个元素里的geometry字段，这个字段中包含有coordinates数组，coordinates数组中的值就是经纬度值，我们可以对这些值进行投影转换，最后调用drawPoints将这个数据画出来。绘制过程十分简单，你直接看下面的代码就可以理解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function drawPoints(ctx, points) {</span></span>
<span class="line"><span>  ctx.beginPath();</span></span>
<span class="line"><span>  ctx.moveTo(...points[0]);</span></span>
<span class="line"><span>  for(let i = 1; i &amp;lt; points.length; i++) {</span></span>
<span class="line"><span>    ctx.lineTo(...points[i]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ctx.fill();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完整的代码我放在了 <a href="https://github.com/akira-cn/graphics/blob/master/convid-vis/mercator.html" target="_blank" rel="noreferrer">GitHub仓库</a> 中，你可以下载到本地运行。这里，我直接把运行的结果展示给你看。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/373977623609e83d8911f679240d7dc7.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/373977623609e83d8911f679240d7dc7.jpg" alt=""></a></p><p>以上，就是利用GeoJSON数据绘制地图的全过程。这个过程非常简单，我们只需要将coordinate数据进行投影，然后根据投影的坐标把轮廓绘制出来就可以了。但是，GeoJSON数据通常比较大，如果我们直接在Web应用中使用，有些浪费带宽，也可能会导致网络加载延迟，所以，使用TopoJSON数据是一个更好的选择。</p><p>举个例子，同样的世界地图数据，GeoJSON格式数据有251KB，而经过了压缩的TopoJSON数据只有84KB，体积约为原来的1/3。</p><p>尽管体积比GeoJSON数据小了不少，但是TopoJSON数据经过了复杂的压缩之后，我们在使用的时候还需要对它解压，把它变成GeoJSON数据。可是，如果我们自己写代码去解压，实现起来比较复杂。好在，我们可以采用现成的工具对它进行解压。这里，我们可以使用GitHub上的 <a href="https://github.com/topojson/topojson" target="_blank" rel="noreferrer">TopoJSON官方仓库</a> 的JavaScript模块来处理TopoJSON数据。</p><p>这个转换简单到只用一行代码就可以完成，转换完成之后，我们就可以用同样的方法将世界地图绘制出来了。具体的转换过程我就不多说了，你可以自己试一试。转换代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const countries = topojson.feature(worldData, worldData.objects.countries);</span></span></code></pre></div><h2 id="步骤三-整合数据" tabindex="-1">步骤三：整合数据 <a class="header-anchor" href="#步骤三-整合数据" aria-label="Permalink to &quot;步骤三：整合数据&quot;">​</a></h2><p>有了世界地图之后，下一步就是将疫情的JSON数据整合进地图数据里面。</p><p>在GeoJSON或者TopoJSON解压后的countries数据中，除了用geometries字段保存地图的地区信息外，还用properties字段来保存了其他的属性。在我们这一份地图数据中，properties只有一个name属性，对应着不同国家的名字。</p><p>我们打开 <a href="https://raw.githubusercontent.com/akira-cn/graphics/master/convid-vis/assets/data/world-topojson.json" target="_blank" rel="noreferrer">TopoJSON文件</a> 就可以看到在contries.geometries下的properties属性中有一个name属性，对应国家的名字。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/331fb9c48b9c6245446190a9f19078b6.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/331fb9c48b9c6245446190a9f19078b6.jpeg" alt=""></a></p><p>这个时候，我们再打开 <a href="https://raw.githubusercontent.com/akira-cn/graphics/master/convid-vis/assets/data/convid-data.json" target="_blank" rel="noreferrer">疫情的JSON数据</a>，我们会发现疫情数据中的contry属性和GeoJSON数据里面的国家名称是一一对应的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/a8975be77a6e8f3bdde2450c198e3f70.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/a8975be77a6e8f3bdde2450c198e3f70.jpeg" alt=""></a></p><p>这样，我们就可以建立一个数据映射关系，将疫情数据中的每个国家的疫情数据直接写入到GeoJSON数据的properties字段里面。</p><p>接着，我们增加一个数据映射函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function mapDataToCountries(geoData, convidData) {</span></span>
<span class="line"><span>  const convidDataMap = {};</span></span>
<span class="line"><span>  convidData.dailyReports.forEach((d) =&amp;gt; {</span></span>
<span class="line"><span>    const date = d.updatedDate;</span></span>
<span class="line"><span>    const countries = d.countries;</span></span>
<span class="line"><span>    countries.forEach((country) =&amp;gt; {</span></span>
<span class="line"><span>      const name = country.country;</span></span>
<span class="line"><span>      convidDataMap[name] = convidDataMap[name] || {};</span></span>
<span class="line"><span>      convidDataMap[name][date] = country;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  geoData.features.forEach((d) =&amp;gt; {</span></span>
<span class="line"><span>    const name = d.properties.name;</span></span>
<span class="line"><span>    d.properties.convid = convidDataMap[name];</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个函数里，我们先将疫情数据的数组转换成以国家名为key的Map，然后将它写入到TopoJSON读取出的Geo数据对象里。</p><p>最后，我们直接读取两个JSON数据，调用这个数据映射函数就完成了数据整合。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const worldData = await (await fetch(&#39;./assets/data/world-topojson.json&#39;)).json();</span></span>
<span class="line"><span>const countries = topojson.feature(worldData, worldData.objects.countries);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const convidData = await (await fetch(&#39;./assets/data/convid-data.json&#39;)).json();</span></span>
<span class="line"><span>mapDataToCountries(countries, convidData);</span></span></code></pre></div><p>因为整合好的数据比较多，所以我只在这里列出一个国家的示例数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;objects&quot;: {</span></span>
<span class="line"><span>  &quot;countries&quot;: {</span></span>
<span class="line"><span>    &quot;type&quot;: &quot;GeometryCollection&quot;,</span></span>
<span class="line"><span>    &quot;geometries&quot;: [{</span></span>
<span class="line"><span>      &quot;arcs&quot;: [</span></span>
<span class="line"><span>        [0, 1, 2, 3, 4, 5]</span></span>
<span class="line"><span>      ],</span></span>
<span class="line"><span>      &quot;type&quot;: &quot;Polygon&quot;,</span></span>
<span class="line"><span>      &quot;properties&quot;: {</span></span>
<span class="line"><span>        &quot;name&quot;: &quot;Afghanistan&quot;,</span></span>
<span class="line"><span>        &quot;convid&quot;: {</span></span>
<span class="line"><span>          &quot;2020-01-22&quot;: {</span></span>
<span class="line"><span>            &quot;confirmed&quot;: 1,</span></span>
<span class="line"><span>            &quot;recovered&quot;: 0,</span></span>
<span class="line"><span>            &quot;death&quot;: 0,</span></span>
<span class="line"><span>          },</span></span>
<span class="line"><span>          &quot;2020-01-23&quot;: {</span></span>
<span class="line"><span>            ...</span></span>
<span class="line"><span>          },</span></span>
<span class="line"><span>          ...</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  ...</span></span></code></pre></div><h2 id="步骤四-将数据与地图结合" tabindex="-1">步骤四：将数据与地图结合 <a class="header-anchor" href="#步骤四-将数据与地图结合" aria-label="Permalink to &quot;步骤四：将数据与地图结合&quot;">​</a></h2><p>将全部数据整合到地理数据之后，我们就可以将数据与地图结合了。在这里，我们设计用不同的颜色来表示疫情的严重程度，填充地图，确诊人数越多的区域颜色越红。要实现这个效果，我们先要创建一个确诊人数和颜色的映射函数。</p><p>我把无人感染到感染人数超过10000人划分了7个等级，每个等级用不同的颜色表示：</p><ul><li>若该地区无人感染，渲染成 #3ac 颜色</li><li>若该地区感染人数小于10，渲染成rgb(250, 247, 171)色</li><li>若该地区感染人数10~99人，渲染成rgb(255, 186, 66)色</li><li>若该地区感染人数100~499人，渲染成rgb(234, 110, 41)色</li><li>若该地区感染人数500~999人，渲染成rgb(224, 81, 57)色</li><li>若该地区感人人数1000~9999人，渲染成rgb(192, 50, 39)色</li><li>若该地区感染人数超10000人，渲染成rgb(151, 32, 19)色</li></ul><p>对应的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function mapColor(confirmed) {</span></span>
<span class="line"><span>  if(!confirmed) {</span></span>
<span class="line"><span>    return &#39;#3ac&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(confirmed &amp;lt; 10) {</span></span>
<span class="line"><span>    return &#39;rgb(250, 247, 171)&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(confirmed &amp;lt; 100) {</span></span>
<span class="line"><span>    return &#39;rgb(255, 186, 66)&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(confirmed &amp;lt; 500) {</span></span>
<span class="line"><span>    return &#39;rgb(234, 110, 41)&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(confirmed &amp;lt; 1000) {</span></span>
<span class="line"><span>    return &#39;rgb(224, 81, 57)&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if(confirmed &amp;lt; 10000) {</span></span>
<span class="line"><span>    return &#39;rgb(192, 50, 39)&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return &#39;rgb(151, 32, 19)&#39;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们在绘制地图的代码里根据确诊人数设置Canvas的填充信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function drawMap(ctx, countries, date) {</span></span>
<span class="line"><span>  date = formatDate(date); // 转换日期格式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  countries.features.forEach(({geometry, properties}) =&amp;gt; {</span></span>
<span class="line"><span>    ... 读取当前日期下的确诊人数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ctx.fillStyle = mapColor(confirmed); // 映射成地图颜色并设置到Canvas上下文</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ... 执行绘制</span></span>
<span class="line"><span>  });</span></span></code></pre></div><p>我们先把data参数设为’2020-01-22’，这样一来，我们就绘制出了2020年1月22日的疫情地图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/d79fe31cc6b92340077ccb5e1f085865.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/d79fe31cc6b92340077ccb5e1f085865.jpg" alt=""></a></p><p>可是，疫情的数据每天都会更新，如果想让疫情地图随着日期自动更新，我们该怎么做呢？我们可以给地图绘制过程加上一个定时器，这样我们就能得到一个动态的疫情地图了，它会自动显示从1月22日到当前日期疫情变化。这样，我们就能看到疫情随时间的变化了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const startDate = new Date(&#39;2020/01/22&#39;);</span></span>
<span class="line"><span>let i = 0;</span></span>
<span class="line"><span>const timer = setInterval(() =&amp;gt; {</span></span>
<span class="line"><span>  const date = new Date(startDate.getTime() + 86400000 * (++i));</span></span>
<span class="line"><span>  drawMap(ctx, countries, date);</span></span>
<span class="line"><span>  if(date.getTime() + 86400000 &amp;gt; Date.now()) {</span></span>
<span class="line"><span>    clearInterval(timer);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}, 100);</span></span>
<span class="line"><span>drawMap(ctx, countries, startDate);</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/68676fbffedcac02dfa178d603025292.gif" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/292607/68676fbffedcac02dfa178d603025292.gif" alt=""></a></p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这节课，我们讲了实现地理信息可视化的通用步骤，一共可以分为四步，我们一起来回顾一下。</p><p>第一步是准备数据，包括地图数据和要可视化的数据。地图数据有GeoJSON和TopoJSON两个规范。相比较而言，TopoJSON数据格式经过了压缩，体积会更小，比较适合Web应用。</p><p>第二步是绘制地图。要绘制地图，我们需要将地理信息中的坐标信息投影到地图上，最简单的投影方式是使用墨卡托投影。</p><p>第三步是整合数据，我们要把可视化数据和地图的地理数据集成到一起，这一步我们可以通过定义数据映射函数来实现。</p><p>最后一步，就是将数据与地图结合，根据整合后的数据结合地图完成最终的图形绘制。</p><p>总的来说，无论我们要实现多么复杂的地理信息可视化地图，核心的4个步骤是不会变的，只不过其中的每一步，我都可以替换具体的实现方式，比如，我们可以使用其他的投影方式来代替墨卡托投影，来绘制不同形状的地图。</p><h2 id="课后练习" tabindex="-1">课后练习 <a class="header-anchor" href="#课后练习" aria-label="Permalink to &quot;课后练习&quot;">​</a></h2><ol><li><p>我们今天选择使用Canvas来绘制地图，是因为它使用起来十分方便。其实，使用SVG绘制地图也很方便，你能试着改用SVG来实现今天的疫情地图吗？这和使用Canvas有什么共同点和不同点？</p></li><li><p>我们今天使用的墨卡托投影是最简单的投影方法，它的缺点是让高纬度下的国家看起来比实际的要大很多。你能试着使用D3.js的 <a href="https://github.com/d3/d3-geo" target="_blank" rel="noreferrer">d3-geo</a> 模块中提供的其他投影方式来实现地图吗？</p></li></ol><p>3.如果 我们要增加交互，让鼠标移动到某个国家区域的时候，这个区域高亮，并且显示国家名称、疫情确诊数、治愈数以及死亡数，这该怎么处理呢？你可以尝试增加这样的交互功能，来完善我们的地图应用吗？</p><p>好啦，今天的地理信息可视化实战就到这里了。欢迎你把实现的地图作品放在留言区，也欢迎把这节课转发出去，我们下节课见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>[1] <a href="https://github.com/akira-cn/graphics/blob/master/convid-vis/assets/data/convid-data.json" target="_blank" rel="noreferrer">新冠肺炎数据</a></p><p>[2] <a href="https://github.com/akira-cn/graphics/blob/master/covid-vis/assets/data/world-geojson.json" target="_blank" rel="noreferrer">GeoJSON数据</a></p><p>[3] <a href="https://github.com/akira-cn/graphics/blob/master/covid-vis/assets/data/world-topojson.json" target="_blank" rel="noreferrer">TopoJSON数据</a></p><p>[4] 完整的示例代码见 <a href="https://github.com/akira-cn/graphics/blob/master/covid-vis/mercator.html" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p>[1] <a href="https://www.jianshu.com/p/852d7ad081b3" target="_blank" rel="noreferrer">GeoJSON标准格式学习</a></p><p>[2] [GeoJSON和TopoJSON] <a href="https://blog.xcatliu.com/2015/04/24/geojson_and_topojson/" target="_blank" rel="noreferrer">reference_end</a></p><p>[3] <a href="https://geojson.org/geojson-spec.html" target="_blank" rel="noreferrer">GeoJSON规范</a></p><p>[4] <a href="https://github.com/topojson/topojson-specification/blob/master/README.md" target="_blank" rel="noreferrer">TopoJSON规范</a></p>`,92)])])}const g=s(t,[["render",i]]);export{u as __pageData,g as default};
