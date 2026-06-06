import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"37 | 实战（一）：如何使用图表库绘制常用数据图表？","description":"","frontmatter":{},"headers":[{"level":2,"title":"课前准备","slug":"课前准备","link":"#课前准备","children":[]},{"level":2,"title":"QCharts图表的基本用法","slug":"qcharts图表的基本用法","link":"#qcharts图表的基本用法","children":[]},{"level":2,"title":"QCharts绘制折线图、面积图、柱状图和饼图的方法","slug":"qcharts绘制折线图、面积图、柱状图和饼图的方法","link":"#qcharts绘制折线图、面积图、柱状图和饼图的方法","children":[]},{"level":2,"title":"QCharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图","slug":"qcharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图","link":"#qcharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图","children":[]},{"level":2,"title":"QCharts绘制图表组合","slug":"qcharts绘制图表组合","link":"#qcharts绘制图表组合","children":[]},{"level":2,"title":"要点总结","slug":"要点总结","link":"#要点总结","children":[]},{"level":2,"title":"小试牛刀","slug":"小试牛刀","link":"#小试牛刀","children":[]},{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"推荐阅读","slug":"推荐阅读","link":"#推荐阅读","children":[]}],"relativePath":"跟月影学可视化/37-实战（一）：如何使用图表库绘制常用数据图表？.md","filePath":"跟月影学可视化/37-实战（一）：如何使用图表库绘制常用数据图表？.md","lastUpdated":1779822292000}'),t={name:"跟月影学可视化/37-实战（一）：如何使用图表库绘制常用数据图表？.md"};function l(i,a,c,o,r,h){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_37-实战-一-如何使用图表库绘制常用数据图表" tabindex="-1">37 | 实战（一）：如何使用图表库绘制常用数据图表？ <a class="header-anchor" href="#_37-实战-一-如何使用图表库绘制常用数据图表" aria-label="Permalink to &quot;37 | 实战（一）：如何使用图表库绘制常用数据图表？&quot;">​</a></h1><p>你好，我是月影。</p><p>图表是我们在可视化中展示数据常用的方式之一，常见的有柱状图、折线图、饼图等等，我们之前也都一一实现过。如果我让你总结一下图表的实现方法，你能说出来吗？总结不出来也没关系，这节课，我们就一起梳理一下实际项目中常用的制图方法。</p><p>实现图表有两种方式，一是使用现成的图表库，二是使用数据驱动框架，前者胜在简单易用，后者则更加灵活。所以，我们会用两节课的时间分别来讲，使用图表库和使用数据驱动框架的制图思路。</p><p>因为使用图表库更加简单，所以这一节课我们先来讲怎么使用它实现图表。另外，这节课的实践性比较强，我建议你跟着我的讲解一块儿动手去写，这样能更快地理解课程的内容。</p><h2 id="课前准备" tabindex="-1">课前准备 <a class="header-anchor" href="#课前准备" aria-label="Permalink to &quot;课前准备&quot;">​</a></h2><p>说了这么多，我们今天到底会用哪些图表库呢？我们主要会使用我们比较熟悉的SpriteJS和QCharts来绘制图表。其他的图表库，例如更常用的 <a href="https://echarts.apache.org/" target="_blank" rel="noreferrer">ECharts</a>，它在图表实现上的原理和用法和我们今天讲的基本相同，所以学完了今天的内容，你完全可以根据它的教程文档去自学。</p><p>好了，确定了要使用的工具之后，我们就要配置和加载SpriteJS和QCharts。具体怎么做呢？</p><p>最简单的方式是，我们直接通过CDN，用script标签来加载SpriteJS和QCharts打包好的文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;script src=&quot;https://unpkg.com/spritejs/dist/spritejs.min.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span>
<span class="line"><span>&amp;lt;script src=&quot;https://unpkg.com/&amp;#64;qcharts/core&amp;#64;1.0.25/dist/index.js&quot;&amp;gt;&amp;lt;/script&amp;gt;</span></span></code></pre></div><p>如果是完整的工程项目的话，你也可以使用webpack来打包和加载模块。这里有一个 <a href="https://github.com/qcharts/quickstart" target="_blank" rel="noreferrer">Quick Start</a>，你可以fork这个项目，按照其中的配置项来设置。当加载完成之后，我们就可以开始绘制基础的图表了。</p><h2 id="qcharts图表的基本用法" tabindex="-1">QCharts图表的基本用法 <a class="header-anchor" href="#qcharts图表的基本用法" aria-label="Permalink to &quot;QCharts图表的基本用法&quot;">​</a></h2><p>QCharts图表由图表（Chart）对象及其子元素构成。其中图表对象的子元素包含图形（Visual）和其他插件（Plugin)。图形是必选元素，其他的插件都是可选元素。</p><p>图表在构建的时候，需要传入一个DOM元素，这个元素可以是页面上任意一个块级元素，QCharts用这个元素作为容器来创建Canvas画布，并其还会根据容器的大小来设置Canvas画布的大小。默认情况下，图表会根据画布大小来自动适配。</p><p>接下来，我们看一下具体的操作。首先，我们创建一个图表对象，设置它的容器设置成一个id为app的元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const { Chart, Line } = qcharts;</span></span>
<span class="line"><span>const chart = new Chart({</span></span>
<span class="line"><span>  container: &#39;#app&#39;</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>创建了这个容器之后，我们就可以为它绑定数据，假设我们绑定一份销售数据。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const data = [</span></span>
<span class="line"><span>  { date: &#39;05-01&#39;, category: &#39;图例一&#39;, sales: 15.2 },</span></span>
<span class="line"><span>  { date: &#39;05-02&#39;, category: &#39;图例一&#39;, sales: 39.2 },</span></span>
<span class="line"><span>  { date: &#39;05-03&#39;, category: &#39;图例一&#39;, sales: 31.2 },</span></span>
<span class="line"><span>  { date: &#39;05-04&#39;, category: &#39;图例一&#39;, sales: 65.2 },</span></span>
<span class="line"><span>  { date: &#39;05-05&#39;, category: &#39;图例一&#39;, sales: 55.2 },</span></span>
<span class="line"><span>  { date: &#39;05-06&#39;, category: &#39;图例一&#39;, sales: 75.2 },</span></span>
<span class="line"><span>  { date: &#39;05-07&#39;, category: &#39;图例一&#39;, sales: 95.2 },</span></span>
<span class="line"><span>  { date: &#39;05-08&#39;, category: &#39;图例一&#39;, sales: 100 }</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.source(data, {</span></span>
<span class="line"><span>  row: &#39;category&#39;,</span></span>
<span class="line"><span>  value: &#39;sales&#39;,</span></span>
<span class="line"><span>  text: &#39;date&#39;</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>如上面代码所示，我们将数据内容与图表对象通过chart.source方法绑定起来。绑定数据的时候，我们可以指定数据的行（列）、数值和文本，这些设置会被图形（Visual）和其他插件使用。这里，我们将行设为category这个字段，数值设为sales字段，文本设为data字段。</p><p>设置之后，图表并没有马上显示出来。这是因为，我们还没有给图表指定图形。QCharts支持多种图形对象，比如Line、Area、Bar等等。假设我们选择了Line对象，那我们只需要创建它，然后将它添加到chart对象的子元素中就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const line = new Line();</span></span>
<span class="line"><span>chart.append([line]);</span></span></code></pre></div><p>这样，我们就让图形显示出来了，效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/b6a87f9984082b6a02a99b484262ef9f.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/b6a87f9984082b6a02a99b484262ef9f.jpeg" alt=""></a></p><p>了解了QCharts图表的基本用法之后，我们一起进入实践环节吧。</p><h2 id="qcharts绘制折线图、面积图、柱状图和饼图的方法" tabindex="-1">QCharts绘制折线图、面积图、柱状图和饼图的方法 <a class="header-anchor" href="#qcharts绘制折线图、面积图、柱状图和饼图的方法" aria-label="Permalink to &quot;QCharts绘制折线图、面积图、柱状图和饼图的方法&quot;">​</a></h2><p>我们先来讲讲折线图、面积图、柱状图和饼图的实现方法，因为之前已经实现过很多次了，所以理解起来比较容易。</p><p>首先是折线图，它是可视化中最常用的图表之一。刚才我们用Line图形绘制了一条折线，但它还不是完整的折线图。完整的折线图，除了有图形以外，还要有表示数据的坐标轴、提示信息和图例，这些都需要在QCharts中由插件来完成。</p><p>接下来，我们就继续给前面的代码添加元素。首先，我们给它增加两个坐标轴，分别是底部和左侧的。</p><p>我们通过Axis类来创建axis对象，默认的坐标轴是在底部不用修改，再通过.style改变它的样式属性，比如我们将&quot;grid&quot;设置为false，这样画布上不会显示纵向的网格线。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const axisBottom = new Axis().style(&quot;grid&quot;, false);</span></span></code></pre></div><p>然后，我们同样创建一个axis对象，通过设置orient: “left” 让它朝左，这样就成功创建了左侧的坐标轴。同样，我们也要把它样式中的&quot;axis&quot;属性设置为false，这样画布上就不会显示坐标轴的实线了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const axisLeft = new Axis({ orient: &quot;left&quot; })</span></span>
<span class="line"><span>      .style(&quot;axis&quot;, false);</span></span></code></pre></div><p>最后，我们将两个坐标轴添加到chart对象的子元素中去，就可以将坐标轴显示出来。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/62c0556935f2756c6eac5a88057eb784.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/62c0556935f2756c6eac5a88057eb784.jpeg" alt=""></a></p><p>添加完坐标轴之后，我们再添加图例（Legend）和提示（Tooltip）。最简单的方式，是我们直接创建两个对象，然后将它们添加到charts对象的子元素中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const legend = new Legend();</span></span>
<span class="line"><span>const tooltip = new Tooltip();</span></span>
<span class="line"><span>chart.append([line, axisBottom, axisLeft, legend, tooltip]);</span></span></code></pre></div><p>添加了图例和提示信息后的图表如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/5896a90b8979ecaf081726195f632985.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/5896a90b8979ecaf081726195f632985.jpeg" alt=""></a></p><p><strong>接下来，我们再来说说怎么用QCharts绘制面积图和柱状图。</strong></p><p>学会了折线图的绘制方法，我们就可以用相同的思路非常简单地绘制其他图形了，比如说，我们可以简单将Line对象换成Area或Bar对象，这样就可以用同样的数据绘制出面积图或柱状图。这是为什么呢？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/2b29397b83cdbe7630bd88982d717cbf.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/2b29397b83cdbe7630bd88982d717cbf.jpeg" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/c70fe007a4e74124a8e23afbb59175fd.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/c70fe007a4e74124a8e23afbb59175fd.jpeg" alt=""></a></p><p>因为像折线图、面积图、柱状图这些表现形式不同的图表，它们能够接受同样格式的数据，只是想要侧重表达的信息不同而已。一般来说，折线图强调数据变化趋势，柱状图强调数据的量和差值，而面积图同时强调数据量和变化趋势。在实际项目中，我们要根据不同的需求选择不同的基本图形。</p><p>如果要强调整体和局部比例，我们还可以选择绘制饼图。与折线图、面积图、柱状图相比，饼图不用配置图例，因为图例会自动生成，而且饼图也不需要坐标轴，所以使用起来更加简单。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const data = [</span></span>
<span class="line"><span>  { date: &#39;05-01&#39;, sales: 15.2 },</span></span>
<span class="line"><span>  { date: &#39;05-02&#39;, sales: 39.2 },</span></span>
<span class="line"><span>  { date: &#39;05-03&#39;, sales: 31.2 },</span></span>
<span class="line"><span>  { date: &#39;05-04&#39;, sales: 65.2 },</span></span>
<span class="line"><span>  { date: &#39;05-05&#39;, sales: 55.2 },</span></span>
<span class="line"><span>  { date: &#39;05-06&#39;, sales: 75.2 },</span></span>
<span class="line"><span>  { date: &#39;05-07&#39;, sales: 95.2 },</span></span>
<span class="line"><span>  { date: &#39;05-08&#39;, sales: 100 }</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.source(data, {</span></span>
<span class="line"><span>  row: &#39;date&#39;,</span></span>
<span class="line"><span>  value: &#39;sales&#39;,</span></span>
<span class="line"><span>  text: &#39;date&#39;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const pie = new Pie();</span></span>
<span class="line"><span>const legend = new Legend();</span></span>
<span class="line"><span>const tooltip = new Tooltip();</span></span>
<span class="line"><span>chart.append([pie, legend, tooltip]);</span></span></code></pre></div><p>上面的代码用同样的数据绘制了一个饼图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/12dffaec3578995169de1db76491947d.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/12dffaec3578995169de1db76491947d.jpeg" alt=""></a></p><h2 id="qcharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图" tabindex="-1">QCharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图 <a class="header-anchor" href="#qcharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图" aria-label="Permalink to &quot;QCharts绘制雷达图、仪表盘和玉玦图、南丁格尔玫瑰图&quot;">​</a></h2><p>讲完了这些常见的基础图表，我们再来看几个比较有趣的图表。</p><p>首先是雷达图，它一般用来绘制多组固定数量的数据，可以比较直观地显示出这组数据的特点。我们经常会在游戏中看见它的应用，比如，下面这张图表就显示了三国武将诸葛亮的各方面数据。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/96b37e3a3267470ce6a95e3c358dcbae.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/96b37e3a3267470ce6a95e3c358dcbae.jpeg" alt=""></a></p><p>雷达图的实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const data = [</span></span>
<span class="line"><span>  { date: &#39;体力&#39;, category: &#39;诸葛亮&#39;, sales: 100 },</span></span>
<span class="line"><span>  { date: &#39;武力&#39;, category: &#39;诸葛亮&#39;, sales: 69 },</span></span>
<span class="line"><span>  { date: &#39;智力&#39;, category: &#39;诸葛亮&#39;, sales: 100 },</span></span>
<span class="line"><span>  { date: &#39;统帅&#39;, category: &#39;诸葛亮&#39;, sales: 95 },</span></span>
<span class="line"><span>  { date: &#39;魅力&#39;, category: &#39;诸葛亮&#39;, sales: 95 },</span></span>
<span class="line"><span>  { date: &#39;忠诚&#39;, category: &#39;诸葛亮&#39;, sales: 100 },</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.source(data, {</span></span>
<span class="line"><span>  row: &#39;category&#39;,</span></span>
<span class="line"><span>  value: &#39;sales&#39;,</span></span>
<span class="line"><span>  text: &#39;date&#39;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const radar = new Radar();</span></span>
<span class="line"><span>radar.style(&#39;section&#39;, (d) =&amp;gt; ({ opacity: 0.3 }));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const legend = new Legend({ align: [&#39;center&#39;, &#39;bottom&#39;] });</span></span>
<span class="line"><span>const tooltip = new Tooltip();</span></span>
<span class="line"><span>chart.append([radar, legend, tooltip]);</span></span></code></pre></div><p>除此之外，还有一些其他类型的图表，可以用来展示特殊的信息。比较典型的有仪表盘，它可以显示某个变量的进度。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/6a21ab85d811fa8a6abyy30ab0516b9e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/6a21ab85d811fa8a6abyy30ab0516b9e.jpeg" alt=""></a></p><p>仪表盘实现代码比较简单，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const gauge = new Gauge({</span></span>
<span class="line"><span>  min: 0,</span></span>
<span class="line"><span>  max: 100,</span></span>
<span class="line"><span>  percent:60,</span></span>
<span class="line"><span>  lineWidth: 20,</span></span>
<span class="line"><span>  tickStep: 10</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>gauge.style(&#39;title&#39;, { fontSize: 36 });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.append(gauge);</span></span></code></pre></div><p>如果我们要显示多个变量的进度，还可以使用玉玦图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/b76efc4a8c052fb8d11ba976ef039782.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/b76efc4a8c052fb8d11ba976ef039782.jpeg" alt=""></a></p><p>对应的代码也非常简单，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const data = [</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    type: &#39;政法干部&#39;,</span></span>
<span class="line"><span>    count: 6654</span></span>
<span class="line"><span>  },{</span></span>
<span class="line"><span>    type: &#39;平安志愿者&#39;,</span></span>
<span class="line"><span>    count: 5341</span></span>
<span class="line"><span>  },{</span></span>
<span class="line"><span>    type: &#39;人民调解员&#39;,</span></span>
<span class="line"><span>    count: 3546</span></span>
<span class="line"><span>  },{</span></span>
<span class="line"><span>    type: &#39;心理咨询师&#39;,</span></span>
<span class="line"><span>    count: 4321</span></span>
<span class="line"><span>  },{</span></span>
<span class="line"><span>    type: &#39;法律工作者&#39;,</span></span>
<span class="line"><span>    count: 3923</span></span>
<span class="line"><span>  },{</span></span>
<span class="line"><span>    type: &#39;网格员&#39;,</span></span>
<span class="line"><span>    count: 5345</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>].sort((a, b) =&amp;gt; a.count - b.count);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.source(data, {</span></span>
<span class="line"><span>  row: &#39;type&#39;,</span></span>
<span class="line"><span>  text: &#39;type&#39;,</span></span>
<span class="line"><span>  value: &#39;count&#39;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const radialBar = new RadialBar({</span></span>
<span class="line"><span>  min: 0,</span></span>
<span class="line"><span>  max: 10000,</span></span>
<span class="line"><span>  radius: 0.6,</span></span>
<span class="line"><span>  innerRadius: 0.1,</span></span>
<span class="line"><span>  lineWidth: 10</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>radialBar.style(&#39;arc&#39;, { lineCap: &#39;round&#39; });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const legend = new Legend({</span></span>
<span class="line"><span>  orient: &#39;vertical&#39;,</span></span>
<span class="line"><span>  align: [&#39;right&#39;, &#39;center&#39;],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.append([radialBar, legend, new Tooltip()]);</span></span></code></pre></div><p>最后是南丁格尔玫瑰图，它可以显示多维度的信息，比如下图就显示了男女游客在公园四个区域内的分布情况。南丁格尔玫瑰图的绘制思路和代码，我们在 <a href="https://time.geekbang.org/column/article/288323" target="_blank" rel="noreferrer">第35节课</a> 已经说过，这里就不再多说了。如果你还不熟悉，可以再去回顾一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/47eca31ddbf1cb2423aa3db23bcabca8.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/47eca31ddbf1cb2423aa3db23bcabca8.jpeg" alt=""></a></p><h2 id="qcharts绘制图表组合" tabindex="-1">QCharts绘制图表组合 <a class="header-anchor" href="#qcharts绘制图表组合" aria-label="Permalink to &quot;QCharts绘制图表组合&quot;">​</a></h2><p>我们刚才讲的都是在图表上绘制单一变量，那要想在图表上聚合多元变量，比如在一张天气图表上同时展示降水量、气温，我们可以同时绘制多个图形来表示。</p><p>我们可以分两种情况来讨论，最简单的情况是用相同的图形来绘制不同的变量。这个时候，我们可以直接通过不同category来绘制多个图形。比如，下面的数据就是用两组category分别绘制了两条折线。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const data = [</span></span>
<span class="line"><span>  { date: &quot;1月&quot;, catgory: &quot;降水量&quot;, val: 15.2 },</span></span>
<span class="line"><span>  { date: &quot;2月&quot;, catgory: &quot;降水量&quot;, val: 19.2 },</span></span>
<span class="line"><span>  { date: &quot;3月&quot;, catgory: &quot;降水量&quot;, val: 11.2 },</span></span>
<span class="line"><span>  { date: &quot;4月&quot;, catgory: &quot;降水量&quot;, val: 45.2 },</span></span>
<span class="line"><span>  { date: &quot;5月&quot;, catgory: &quot;降水量&quot;, val: 55.2 },</span></span>
<span class="line"><span>  { date: &quot;6月&quot;, catgory: &quot;降水量&quot;, val: 75.2 },</span></span>
<span class="line"><span>  { date: &quot;7月&quot;, catgory: &quot;降水量&quot;, val: 95.2 },</span></span>
<span class="line"><span>  { date: &quot;8月&quot;, catgory: &quot;降水量&quot;, val: 135.2 },</span></span>
<span class="line"><span>  { date: &quot;9月&quot;, catgory: &quot;降水量&quot;, val: 162.2 },</span></span>
<span class="line"><span>  { date: &quot;10月&quot;, catgory: &quot;降水量&quot;, val: 32.2 },</span></span>
<span class="line"><span>  { date: &quot;11月&quot;, catgory: &quot;降水量&quot;, val: 32.2 },</span></span>
<span class="line"><span>  { date: &quot;12月&quot;, catgory: &quot;降水量&quot;, val: 15.2 },</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  { date: &quot;1月&quot;, catgory: &quot;气温&quot;, val: 2.2 },</span></span>
<span class="line"><span>  { date: &quot;2月&quot;, catgory: &quot;气温&quot;, val: 3.2 },</span></span>
<span class="line"><span>  { date: &quot;3月&quot;, catgory: &quot;气温&quot;, val: 5.2 },</span></span>
<span class="line"><span>  { date: &quot;4月&quot;, catgory: &quot;气温&quot;, val: 6.2 },</span></span>
<span class="line"><span>  { date: &quot;5月&quot;, catgory: &quot;气温&quot;, val: 8.2 },</span></span>
<span class="line"><span>  { date: &quot;6月&quot;, catgory: &quot;气温&quot;, val: 15.2 },</span></span>
<span class="line"><span>  { date: &quot;7月&quot;, catgory: &quot;气温&quot;, val: 25.2 },</span></span>
<span class="line"><span>  { date: &quot;8月&quot;, catgory: &quot;气温&quot;, val: 23.2 },</span></span>
<span class="line"><span>  { date: &quot;9月&quot;, catgory: &quot;气温&quot;, val: 24.2 },</span></span>
<span class="line"><span>  { date: &quot;10月&quot;, catgory: &quot;气温&quot;, val: 16.2 },</span></span>
<span class="line"><span>  { date: &quot;11月&quot;, catgory: &quot;气温&quot;, val: 12.2 },</span></span>
<span class="line"><span>  { date: &quot;12月&quot;, catgory: &quot;气温&quot;, val: 6.6 },</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>chart.source(data, {</span></span>
<span class="line"><span>  row: &quot;catgory&quot;,</span></span>
<span class="line"><span>  value: &quot;val&quot;,</span></span>
<span class="line"><span>  text: &quot;date&quot;,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const line = new Line({ axisGap: true });</span></span>
<span class="line"><span>...</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/b88746440cae3937beb3c638b9bda392.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/b88746440cae3937beb3c638b9bda392.jpeg" alt=""></a></p><p>如果我们想用不同类型的图形来展示多个变量，在QCharts中，我们只需要创建多个不同的图形对象，然后把它们都添加到chart对象的子元素中去就可以了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const ds = chart.dataset;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const d1 = ds.selectRows(&quot;降水量&quot;);</span></span>
<span class="line"><span>const line = new Line({ axisGap: true })</span></span>
<span class="line"><span>  .source(d1)</span></span>
<span class="line"><span>  .style(&quot;point&quot;, { strokeColor: &quot;#fff&quot; });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const d2 = ds.selectRows(&quot;气温&quot;);</span></span>
<span class="line"><span>const bar = new Bar().source(d2);</span></span>
<span class="line"><span>bar.style(&quot;pillar&quot;, { fillColor: &quot;#6CD3FF&quot; });</span></span></code></pre></div><p>如上面代码所示，我们先可以通过chart.dataset拿到通过.source绑定给chart对象的数据集，然后，通过selectRows分别将降水量和气温数据过滤出来。接着，我们分别创建Line和Bar两个图形对象，再将降水量和气温数据分别绑定给它们。最后，我们将这两个对象同时添加到chart子元素列表里，就可以将两个不同类型的图形显示出来了，具体的效果如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/f8688798100f4a9yyc04c9d34fc79262.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B7%9F%E6%9C%88%E5%BD%B1%E5%AD%A6%E5%8F%AF%E8%A7%86%E5%8C%96/images/290387/f8688798100f4a9yyc04c9d34fc79262.jpeg" alt=""></a></p><h2 id="要点总结" tabindex="-1">要点总结 <a class="header-anchor" href="#要点总结" aria-label="Permalink to &quot;要点总结&quot;">​</a></h2><p>这节课，我们主要学习了QCharts图表库的使用。</p><p>QCharts是基于SpriteJS的简单可视化图表库，我们通过它可以绘制各种类型的图表。一般来说，我们是先创建图表对象，然后绑定数据，接着添加图形对象以及其他的插件，包括图例和提示。通过将图形和插件以子元素的形式添加到图表对象上，就能把图表内容最终显示出来了。</p><p>我们可以很方便地根据数据特点和业务需要，用数据绘制折线图、面积图、柱状图、饼图、雷达图等图表，还可以绘制特殊的仪表盘和玉玦图。另外，如果要显示多维数据，我们也可以用稍微复杂一些的南丁格尔玫瑰图。</p><p>最后，我们还可以把多维度变量聚合在一个图表中来显示不同的图形组合。具体操作是，我们先筛选数据，然后创建不同类型的图形对象，最后将它们都添加到图表对象的子元素中。</p><p>总的来说，我们今天讲的其实都是QCharts图表库，最基础、最常用的方法。QCharts还提供了众多其他类型的图表，以及灵活操作图表样式的API。如果你有兴趣继续钻研，可以通过我课后给出的参考链接进一步学习。</p><h2 id="小试牛刀" tabindex="-1">小试牛刀 <a class="header-anchor" href="#小试牛刀" aria-label="Permalink to &quot;小试牛刀&quot;">​</a></h2><p>你学会了使用不同图表来表达不同数据了吗？你可以试着使用GitHub仓库里的北京市天气数据和空气质量数据，实现一个温度、湿度、风速、空气质量的聚合图表吗？如果用来展示温度、湿度、风速和空气质量的图形都不相同就更好了。</p><p>这些常用的制图方法你都学会了吗？下节课，我们会接着来学，怎么使用数据驱动框架来表达不同数据，挑战才刚刚开始呢，我们下节课再见！</p><hr><h2 id="源码" tabindex="-1">源码 <a class="header-anchor" href="#源码" aria-label="Permalink to &quot;源码&quot;">​</a></h2><p>课程代码详见 <a href="https://github.com/akira-cn/graphics/tree/master/qcharts" target="_blank" rel="noreferrer">GitHub仓库</a></p><h2 id="推荐阅读" tabindex="-1">推荐阅读 <a class="header-anchor" href="#推荐阅读" aria-label="Permalink to &quot;推荐阅读&quot;">​</a></h2><p><a href="https://www.qcharts.cn/#/home" target="_blank" rel="noreferrer">QCharts官网</a></p>`,86)])])}const d=s(t,[["render",l]]);export{g as __pageData,d as default};
