import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"题目解答-期中考试版本参考实现","description":"","frontmatter":{},"headers":[{"level":2,"title":"1.0 版本","slug":"_1-0-版本","link":"#_1-0-版本","children":[{"level":3,"title":"单元测试","slug":"单元测试","link":"#单元测试","children":[]}]},{"level":2,"title":"2.0 版本","slug":"_2-0-版本","link":"#_2-0-版本","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"朱涛·Kotlin编程第一课/题目解答-期中考试版本参考实现.md","filePath":"朱涛·Kotlin编程第一课/题目解答-期中考试版本参考实现.md","lastUpdated":1795558358000}'),l={name:"朱涛·Kotlin编程第一课/题目解答-期中考试版本参考实现.md"};function i(t,n,E,o,c,r){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="题目解答-期中考试版本参考实现" tabindex="-1">题目解答-期中考试版本参考实现 <a class="header-anchor" href="#题目解答-期中考试版本参考实现" aria-label="Permalink to &quot;题目解答-期中考试版本参考实现&quot;">​</a></h1><p>你好，我是朱涛。上节课我给你布置了一份考试题，你完成得怎么样了呢？这节课呢，我会来告诉你我是如何用 Kotlin 来做这个图片处理程序的，供你参考。</p><p>由于上节课我们已经做好了前期准备，所以这里我们直接写代码就行了。</p><h2 id="_1-0-版本" tabindex="-1">1.0 版本 <a class="header-anchor" href="#_1-0-版本" aria-label="Permalink to &quot;1.0 版本&quot;">​</a></h2><p>对于图片反转和裁切的这个问题，如果一开始你就去想象一个大图片，里面有几万个像素点，那你可能会被吓到。但是，如果你将数据规模缩小，再来分析的话，你会发现这个问题其实很简单。</p><p>这里，我们就以一张 4X4 像素的照片为例来分析一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/1.png" alt=""></a></p><p>这其实就相当于一个抽象的模型，如果我们基于这张 4X4 的照片，继续分析翻转和裁切，就会容易很多。我们可以来画一个简单的图形：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/2.png" alt=""></a></p><p>上面这张图，从左到右分别是原图、横向翻转、纵向翻转、裁切。其中，翻转看起来是要复杂一些，而裁切是最简单的。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/3.png" alt=""></a></p><p>我们先来处理裁切。对于裁切，其实只需要将图片当中某个部分的像素拷贝到内存，然后存储成为一张新图片就行了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* 图片裁切</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>fun Image.crop(startY: Int, startX: Int, width: Int, height: Int): Image {</span></span>
<span class="line"><span>   val pixels = Array(height) { y -&gt;</span></span>
<span class="line"><span>       Array(width) { x -&gt;</span></span>
<span class="line"><span>           getPixel(startY + y, startX + x)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Image(pixels)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码中，我们创建了一个新数组 pixels，它的创建方式是通过 Lambda 来实现的，而</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Lambda 当中最关键的逻辑，就是 getPixel(startY + y, startX + x)，也就是从原</span></span></code></pre></div><p>图当中取像素点。</p><p>这代码是不是比你想象中简单很多？其实，图片的翻转也是一样的。只要我们能找出坐标的对应关系，代码也非常简单。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/4.png" alt=""></a></p><p>可以看到，对于原图的 (1, 0) 这个像素点来说，它横向翻转以后就变成了 (2, 0)。所以，对于(x, y) 坐标来说，横向翻转以后，就应该变成 (width-1-x, y)。找到这个对应关系以后，我们就直接抄代码了！</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* 横向翻转图片</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>fun Image.flipHorizontal(): Image {</span></span>
<span class="line"><span>   val pixels = Array(height()) { y -&gt;</span></span>
<span class="line"><span>       Array(width()) { x -&gt;</span></span>
<span class="line"><span>           getPixel(y, width() - 1 - x)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Image(pixels)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可见，以上这段代码几乎跟裁切是一模一样的，只是说，裁切要限制宽高，而翻转则是跟原图保持一致。</p><p>看到这里，相信你也马上就能想明白纵向翻转的代码该如何写了！</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/5.png" alt=""></a></p><p>我们还是以 (1, 0) 这个像素点为例，在纵向翻转以后就变成了 (1, 3)，它们的转换规则是 (x,height-1-y)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>* 纵向翻转图片</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>fun Image.flipVertical(): Image {</span></span>
<span class="line"><span>   val pixels = Array(height()) { y -&gt;</span></span>
<span class="line"><span>       Array(width()) { x -&gt;</span></span>
<span class="line"><span>           getPixel(height() - 1 - y, x) // 改动这里</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return Image(pixels)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所以说，只要我们能找到中间的转换关系，纵向翻转的代码，只需要在横向翻转的基础上，改动一行即可。</p><h3 id="单元测试" tabindex="-1">单元测试 <a class="header-anchor" href="#单元测试" aria-label="Permalink to &quot;单元测试&quot;">​</a></h3><p>其实针对图像算法的单元测试，我们最好的方式，就是准备一些现有的图片案例。比如说，我们随便找一张图，用其他的软件工具，对它进行翻转、裁切，然后存储起来。比如还是这四张图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/6.png" alt=""></a></p><p>我们可以把处理后的图片保存在单元测试的文件夹下，方便我们写对应的测试用例。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/7.png" alt=""></a></p><p>那么，有了这些图片之后，我想你应该就能想到要怎么办了。这时候，你只需要写一个图片像素对比的方法 checkImageSame() 就好办了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private fun checkImageSame(picture: Image, expected: Image) {</span></span>
<span class="line"><span>   assertEquals(picture.height(), expected.height())</span></span>
<span class="line"><span>   assertEquals(picture.width(), expected.width())</span></span>
<span class="line"><span>   for (row in 0 until picture.height()) {</span></span>
<span class="line"><span>       for (column in 0 until picture.width()) {</span></span>
<span class="line"><span>           val actualPixel = picture.getPixel(row, column)</span></span>
<span class="line"><span>           val expectedPixel = expected.getPixel(row, column)</span></span>
<span class="line"><span>           assertEquals(actualPixel, expectedPixel)</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实，这个函数的思路也很简单，就是逐个对比两张图片之间的像素，看看它们是不是一样的，如果两张图所有的像素都一样，那肯定就是一样的。</p><p>有了这个方法以后，我们就可以快速实现单元测试代码了。整体流程大致如下：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%9C%B1%E6%B6%9B%C2%B7Kotlin%E7%BC%96%E7%A8%8B%E7%AC%AC%E4%B8%80%E8%AF%BE/images/%25E9%25A2%2598%25E7%259B%25AE%25E8%25A7%25A3%25E7%25AD%2594-%25E6%259C%259F%25E4%25B8%25AD%25E8%2580%2583%25E8%25AF%2595%25E7%2589%2588%25E6%259C%25AC%25E5%258F%2582%25E8%2580%2583%25E5%25AE%259E%25E7%258E%25B0/8.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>fun testCrop() {</span></span>
<span class="line"><span>   val image = loadImage(File(&quot;\${TEST_BASE_PATH}android.png&quot;))</span></span>
<span class="line"><span>   val height = image.height() / 2</span></span>
<span class="line"><span>   val width = image.width() / 2</span></span>
<span class="line"><span>   val target = loadImage(File(&quot;\${TEST_BASE_PATH}android_half_crop.png&quot;))</span></span>
<span class="line"><span>   val crop = image.crop(0, 0, width, height)</span></span>
<span class="line"><span>   checkImageSame(crop, target)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Test</span></span>
<span class="line"><span>fun testFlipVertical() {</span></span>
<span class="line"><span>   val origin = loadImage(File(&quot;\${TEST_BASE_PATH}android.png&quot;))</span></span>
<span class="line"><span>   val target = loadImage(File(&quot;\${TEST_BASE_PATH}android_up_side_down.png&quot;))</span></span>
<span class="line"><span>   val flipped = origin.flipVertical()</span></span>
<span class="line"><span>   checkImageSame(flipped, target)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Test</span></span>
<span class="line"><span>fun testFlipHorizontal() {</span></span>
<span class="line"><span>   val origin = loadImage(File(&quot;\${TEST_BASE_PATH}android.png&quot;))</span></span>
<span class="line"><span>   val target = loadImage(File(&quot;\${TEST_BASE_PATH}android_flipped.png&quot;))</span></span>
<span class="line"><span>   val flipped = origin.flipHorizontal()</span></span>
<span class="line"><span>   checkImageSame(flipped, target)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了单元测试，我们就再也不用担心以后改代码的时候，不小心改出问题了。</p><p>好，那么到这里，1.0 版本就算是完成了。我们接着来看看 2.0 版本。</p><h2 id="_2-0-版本" tabindex="-1">2.0 版本 <a class="header-anchor" href="#_2-0-版本" aria-label="Permalink to &quot;2.0 版本&quot;">​</a></h2><p>2.0 版本的任务，我们需要支持下载网络上面的图片，并且还要能够存起来。由于这是一个比较耗时的操作，我们希望它是一个挂起函数。</p><p>关于下载 HTTP 的图片，其实，我们借助 OkHttp 就可以简单实现。下面我们来看看代码。</p><ul><li>补充：为了不偏离主题，我们不考虑 HTTPS 的问题。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun downloadSync() {</span></span>
<span class="line"><span>   logX(&quot;Download start!&quot;)</span></span>
<span class="line"><span>   val okHttpClient = OkHttpClient().newBuilder()</span></span>
<span class="line"><span>       .connectTimeout(10L, TimeUnit.SECONDS)</span></span>
<span class="line"><span>       .readTimeout(10L, TimeUnit.SECONDS)</span></span>
<span class="line"><span>       .build()</span></span>
<span class="line"><span>   val request = Request.Builder().url(url).build()</span></span>
<span class="line"><span>   val response = okHttpClient.newCall(request).execute()</span></span>
<span class="line"><span>   val body = response.body</span></span>
<span class="line"><span>   val responseCode = response.code</span></span>
<span class="line"><span>   if (responseCode &gt;= HttpURLConnection.HTTP_OK &amp;&amp;</span></span>
<span class="line"><span>       responseCode &lt; HttpURLConnection.HTTP_MULT_CHOICE &amp;&amp;</span></span>
<span class="line"><span>       body != null</span></span>
<span class="line"><span>   ) {</span></span>
<span class="line"><span>       // 1， 注意这里</span></span>
<span class="line"><span>       body.byteStream().apply {</span></span>
<span class="line"><span>           outputFile.outputStream().use { fileOut -&gt;</span></span>
<span class="line"><span>               copyTo(fileOut)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   logX(&quot;Download finish!&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码中，有一个地方是需要注意的，我用注释标记了。也就是当我们想要把网络流中的数据存起来的时候，我们可以借助 Kotlin 提供的 IO 扩展函数快速实现，这样不仅方便，而且还不用担心 FileOutputStream 调用 close() 的问题。这个部分的代码，在 Java 当中，是要写一堆模板代码的。</p><p>下载本身的功能实现以后，挂起函数的封装也就容易了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>suspend fun downloadImage(url: String, outputFile: File): Boolean {</span></span>
<span class="line"><span>   return withContext(Dispatchers.IO) {</span></span>
<span class="line"><span>       try {</span></span>
<span class="line"><span>           downloadSync()</span></span>
<span class="line"><span>       } catch (e: Exception) {</span></span>
<span class="line"><span>           println(e)</span></span>
<span class="line"><span>           // return@withContext  不可省略</span></span>
<span class="line"><span>           return@withContext false</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       // return@withContext 可省略</span></span>
<span class="line"><span>       return@withContext true</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里，我们可以直接用 withContext，让下载的任务直接分发到 IO 线程。</p><p>代码写到这里，2.0 版本要求的功能基本上就算是完成了。这样一来，我们就可以在 main 函数当中去调用它了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fun main() = runBlocking {</span></span>
<span class="line"><span>   val url = &quot;http://xxxx.jpg&quot;</span></span>
<span class="line"><span>   val path = &quot;\${BASE_PATH}downloaded.png&quot;</span></span>
<span class="line"><span>   downloadImage(url, File(path))</span></span>
<span class="line"><span>   loadImage(File(path))</span></span>
<span class="line"><span>       .flipVertical()</span></span>
<span class="line"><span>       .writeToFile(File(&quot;\${BASE_PATH}download_flip_vertical.png&quot;))</span></span>
<span class="line"><span>   logX(&quot;Done&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 将内存图片保存到硬盘</span></span>
<span class="line"><span>fun Image.writeToFile(outputFile: File): Boolean {</span></span>
<span class="line"><span>   return try {</span></span>
<span class="line"><span>       val width = width()</span></span>
<span class="line"><span>       val height = height()</span></span>
<span class="line"><span>       val image = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)</span></span>
<span class="line"><span>       for (x in 0 until width) {</span></span>
<span class="line"><span>           for (y in 0 until height) {</span></span>
<span class="line"><span>               val awtColor = getPixel(y, x)</span></span>
<span class="line"><span>               image.setRGB(x, y, awtColor.rgb)</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       ImageIO.write(image, &quot;png&quot;, outputFile)</span></span>
<span class="line"><span>       true</span></span>
<span class="line"><span>   } catch (e: Exception) {</span></span>
<span class="line"><span>       println(e)</span></span>
<span class="line"><span>       false</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*</span></span></code></pre></div><ul><li>输出结果：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>================================</span></span>
<span class="line"><span>Download start!</span></span>
<span class="line"><span>Thread:DefaultDispatcher-worker-1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Download finish!</span></span>
<span class="line"><span>Thread:DefaultDispatcher-worker-1</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>Done</span></span>
<span class="line"><span>Thread:main</span></span>
<span class="line"><span>================================</span></span>
<span class="line"><span>*/</span></span></code></pre></div><p>通过运行结果，我们会发现图片下载的任务，已经被分发到 IO 线程池了，而其他的代码仍然在主线程之上。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>其实，课程进行到这里，你就会发现，Kotlin 和 Java、C 之类的语言的编程方式是完全不一样的。Kotlin 提供了丰富的扩展函数，在很多业务场景下，Kotlin 是可以大大减少代码量的。</p><p>另外，你也会发现，当你熟悉 Kotlin 协程以后，它的使用一点都不难。对于上面的代码，我们通过 withContext(Dispatchers.IO) 就能切换线程，之后，我们就可以在协程作用域当中随意调用了！</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>你觉得，我们在 downloadImage() 这个挂起函数内部，直接写死 Dispatchers.IO 的方式好吗？如果换成下面这种写法，会不会更好？为什么？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>suspend fun downloadImage(</span></span>
<span class="line"><span>   coroutineContext: CoroutineContext = Dispatchers.IO,</span></span>
<span class="line"><span>   url: String,</span></span>
<span class="line"><span>   outputFile: File</span></span>
<span class="line"><span>): Boolean {</span></span>
<span class="line"><span>   return withContext(coroutineContext) {</span></span>
<span class="line"><span>       try {</span></span>
<span class="line"><span>           downloadSync()</span></span>
<span class="line"><span>       } catch (e: Exception) {</span></span>
<span class="line"><span>           println(e)</span></span>
<span class="line"><span>           return@withContext false</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       return@withContext true</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,59)])])}const u=s(l,[["render",i]]);export{g as __pageData,u as default};
