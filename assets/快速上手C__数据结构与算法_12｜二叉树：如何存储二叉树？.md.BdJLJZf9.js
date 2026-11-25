import{_ as n,H as a,f as p,i}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"12 | 二叉树：如何存储二叉树？","description":"","frontmatter":{},"headers":[{"level":2,"title":"顺序存储方式","slug":"顺序存储方式","link":"#顺序存储方式","children":[]},{"level":2,"title":"2k","slug":"_2k","link":"#_2k","children":[]},{"level":2,"title":"24","slug":"_24","link":"#_24","children":[]},{"level":2,"title":"24","slug":"_24-1","link":"#_24-1","children":[]},{"level":2,"title":"24","slug":"_24-2","link":"#_24-2","children":[]},{"level":2,"title":"链式存储方式","slug":"链式存储方式","link":"#链式存储方式","children":[]},{"level":2,"title":"二叉树顺序存储的常用操作","slug":"二叉树顺序存储的常用操作","link":"#二叉树顺序存储的常用操作","children":[]},{"level":2,"title":"二叉树链式存储的常用操作","slug":"二叉树链式存储的常用操作","link":"#二叉树链式存储的常用操作","children":[{"level":3,"title":"类定义、初始化和释放操作","slug":"类定义、初始化和释放操作","link":"#类定义、初始化和释放操作","children":[]},{"level":3,"title":"创建树节点操作","slug":"创建树节点操作","link":"#创建树节点操作","children":[]},{"level":3,"title":"遍历操作","slug":"遍历操作","link":"#遍历操作","children":[]},{"level":3,"title":"其他常用操作","slug":"其他常用操作","link":"#其他常用操作","children":[]},{"level":3,"title":"非递归遍历操作","slug":"非递归遍历操作","link":"#非递归遍历操作","children":[]},{"level":3,"title":"通过遍历序列创建二叉树","slug":"通过遍历序列创建二叉树","link":"#通过遍历序列创建二叉树","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"快速上手C++数据结构与算法/12｜二叉树：如何存储二叉树？.md","filePath":"快速上手C++数据结构与算法/12｜二叉树：如何存储二叉树？.md","lastUpdated":1795557152000}'),e={name:"快速上手C++数据结构与算法/12｜二叉树：如何存储二叉树？.md"};function l(t,s,h,r,o,c){return a(),p("div",null,[...s[0]||(s[0]=[i(`<h1 id="_12-二叉树-如何存储二叉树" tabindex="-1">12 | 二叉树：如何存储二叉树？ <a class="header-anchor" href="#_12-二叉树-如何存储二叉树" aria-label="Permalink to &quot;12 | 二叉树：如何存储二叉树？&quot;">​</a></h1><p>你好，我是王健伟。</p><p>聊过了二叉树的遍历问题，终于要开始写程序了，所以今天就来聊聊存储二叉树的几种方法。</p><p>二叉树的存储一般有两种方式，一种是基于数组的顺序存储方式，一种是链式存储方式。它们有什么不同呢？</p><h2 id="顺序存储方式" tabindex="-1">顺序存储方式 <a class="header-anchor" href="#顺序存储方式" aria-label="Permalink to &quot;顺序存储方式&quot;">​</a></h2><p>顺序存储方式是用一段连续的内存单元（数组）依次从上到下、从左到右存储二叉树各个节点元素。</p><p>假设我们存储的是一棵完全二叉树，如果把根节点存储在数组中下标 i = 1 的位置，那么根据之前讲解的二叉树编号规律（二叉树性质 6），左子节点就存储在下标 2 * i = 2 的位置，右子节点就存储在 2 * i + 1 = 3 的位置。这样就可以通过下标把整棵树串起来。</p><p>因为节点编号从 1 开始，所以数组中下标为 0 的位置可以空出来不用，让数组下标和节点编号保持一致。虽然这样浪费了一个存储空间，不过这点你可以自由决定。</p><p>参考下图 1。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/1.png" alt=""></a></p><ul><li>图1 存储完全二叉树节点时所对应的数组下标示意图</li></ul><p>不难看到，数组的下标可以体现出节点的存储位置。换句话说，数组的下标能够体现出节点之间的逻辑关系（父子、兄弟）。</p><p>但如果存储的不是一棵完全二叉树，而是普通二叉树，那么存储的时候，也需要将其按照完全二叉树的方式来编号存储，这样肯定会浪费较多的数组存储空间。</p><p>参考下图 2。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/2.png" alt=""></a></p><ul><li>图2 存储普通二叉树节点时所对应的数组下标示意图</li></ul><p>图 2 中虚线表示的节点表示不存在的节点，但在存储时却要给其留出位置。可以看到，下标6、8 的数组空间都被浪费掉了。</p><p>你可以想一种极端的情况：如果有一棵深度为 4 的右斜树需要保存，会浪费多少个数组空间呢？</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/3.png" alt=""></a></p><ul><li>图3 右斜树顺序存储方式会浪费很大的空间</li></ul><h2 id="_2k" tabindex="-1">2k <a class="header-anchor" href="#_2k" aria-label="Permalink to &quot;2k&quot;">​</a></h2><p>根据二叉树性质 2，“高度为 k 的二叉树至多有</p><ul><li>-1 个节点”，存储高度为 4 的二叉树，最坏</li></ul><h2 id="_24" tabindex="-1">24 <a class="header-anchor" href="#_24" aria-label="Permalink to &quot;24&quot;">​</a></h2><h2 id="_24-1" tabindex="-1">24 <a class="header-anchor" href="#_24-1" aria-label="Permalink to &quot;24&quot;">​</a></h2><p>情况下空间需求是</p><ul><li>-1=15，因为下标为 0 的空间不使用，所以最坏情况下空间需求是</li></ul><h2 id="_24-2" tabindex="-1">24 <a class="header-anchor" href="#_24-2" aria-label="Permalink to &quot;24&quot;">​</a></h2><p>=16，而图 3 的右斜树恰恰需要</p><ul><li>=16 个存储空间。即便下标为 0 的位置不计算在内，也整</li></ul><p>整浪费了 11 个位置。</p><p>可是，完全二叉树就不会存在这个问题。这就是完全二叉树最后一层叶节点都靠左侧排列这种硬性规定所带来的存储益处。换句话说，顺序存储结构一般是用于存储完全二叉树。</p><h2 id="链式存储方式" tabindex="-1">链式存储方式 <a class="header-anchor" href="#链式存储方式" aria-label="Permalink to &quot;链式存储方式&quot;">​</a></h2><p>链式存储方式要存储额外的左右子节点的指针，而顺序存储方式是不需要指针的，所以通常来讲，链式存储方式多用于存储普通的二叉树。</p><p>链式存储中，二叉树的每个节点最多有两个子节点，所以为每个节点设计结构时一般都包括一个数据域和两个指针域，分别指向左孩子节点和右孩子节点。至于没有用到的指针，设置为nullptr 即可。结构示意图如图 4 所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/4.png" alt=""></a></p><ul><li>图4 链式存储方式的结构示意图</li></ul><p>从图 4 可以看到，只要拎住最上面的根节点，就可以通过左右子节点的指针把整棵树串起来。</p><p>利用这种节点结构所得到的二叉树存储结构，叫做二叉链表，一个节点结构中带两个指针。有时候为了方便找到某个节点的父节点，还可以在设计节点结构的时候再增加一个指针，用于指向其父节点，这种节点结构所得到的二叉树存储结构，就叫做三叉链表，也就是一个节点结构中带三个指针。</p><h2 id="二叉树顺序存储的常用操作" tabindex="-1">二叉树顺序存储的常用操作 <a class="header-anchor" href="#二叉树顺序存储的常用操作" aria-label="Permalink to &quot;二叉树顺序存储的常用操作&quot;">​</a></h2><p>概念理清之后，我们就要开始代码层面的学习了。虽然顺序存储结构一般是用于存储完全二叉树，但为了让写出的代码也支持普通二叉树，所以我会用二叉树的顺序存储方式，存储图 5 左侧所示的普通二叉树。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/5.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/5.png" alt=""></a></p><ul><li>图5 左侧为一个二叉树，右侧为一个二叉树的扩展二叉树</li></ul><p>二叉树顺序存储的实现代码参见课件。</p><p>在 main 主函数中，增加如下测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BinaryTree&lt;​int&gt; mytree;</span></span>
<span class="line"><span>//创建一棵二叉树</span></span>
<span class="line"><span>int indexRoot = mytree.CreateNode(-1, E_Root, &#39;A&#39;); //创建树根节点A</span></span>
<span class="line"><span>int indexNodeB = mytree.CreateNode(indexRoot, E_ChildLeft, &#39;B&#39;);  //创建树根的左子节</span></span>
<span class="line"><span>int indexNodeC = mytree.CreateNode(indexRoot, E_ChildRight, &#39;C&#39;); //创建树根的右子节</span></span>
<span class="line"><span>int indexNodeD = mytree.CreateNode(indexNodeB, E_ChildLeft, &#39;D&#39;); //创建节点B的左子节</span></span>
<span class="line"><span>int indexNodeE = mytree.CreateNode(indexNodeC, E_ChildRight, &#39;E&#39;); //创建节点C的右子</span></span>
<span class="line"><span>int iParentIndexE = mytree.getParentIdx(indexNodeE);   //获取某个节点的父节点的下标</span></span>
<span class="line"><span>cout &lt;&lt; &quot;节点E的父节点的下标是：&quot; &lt;&lt; iParentIndexE &lt;&lt; endl;</span></span>
<span class="line"><span>int iLevel = mytree.getPointLevel(indexNodeD);  //获取某个节点所在的高度</span></span>
<span class="line"><span>cout &lt;&lt; &quot;节点D所在的高度是：&quot; &lt;&lt; iLevel &lt;&lt; endl;</span></span>
<span class="line"><span>iLevel = mytree.getPointLevel(indexNodeE);</span></span>
<span class="line"><span>cout &lt;&lt; &quot;节点E所在的高度是：&quot; &lt;&lt; iLevel &lt;&lt; endl;</span></span>
<span class="line"><span>cout &lt;&lt; &quot;二叉树的深度是：&quot; &lt;&lt; mytree.getLevel() &lt;&lt; endl;</span></span>
<span class="line"><span>cout &lt;&lt; &quot;二叉树是个完全二叉树吗？&quot; &lt;&lt; mytree.ifCompleteBT() &lt;&lt; endl;</span></span>
<span class="line"><span>cout &lt;&lt; &quot;------------&quot; &lt;&lt; endl;</span></span>
<span class="line"><span>cout &lt;&lt; &quot;前序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree.preOrder();   //前序遍历</span></span></code></pre></div><p>代码的执行结果如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/6.png" alt=""></a></p><p>特别说明，因为在面试和实际应用中，二叉树的链式存储使用得更加频繁，因此许多常用操作我会在下面讲解链式存储中实现，有兴趣的话，你也可以尝试将这些常用操作搬移到二叉树的顺序存储中实现。</p><h2 id="二叉树链式存储的常用操作" tabindex="-1">二叉树链式存储的常用操作 <a class="header-anchor" href="#二叉树链式存储的常用操作" aria-label="Permalink to &quot;二叉树链式存储的常用操作&quot;">​</a></h2><p>下面我们熟悉一下二叉树链式存储的常用操作。完整的课件在这里。</p><h3 id="类定义、初始化和释放操作" tabindex="-1">类定义、初始化和释放操作 <a class="header-anchor" href="#类定义、初始化和释放操作" aria-label="Permalink to &quot;类定义、初始化和释放操作&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">enum ECCHILDSIGN  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">节点标记</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> E_Root,       </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">树根</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> E_ChildLeft,  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">左孩子</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> E_ChildRight  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">右孩子</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">树中每个节点的定义</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​typename T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">T代表数据元素的类型</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">struct BinaryTreeNode</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> T               </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;        </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">数据域，存放数据元素</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> leftChild,   </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">左子节点指针</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rightChild;  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">右子节点指针</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> parent;      </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">父节点指针，可以根据需要决定是否引入</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">二叉树的定义</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​typename T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">class BinaryTree</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> BinaryTree();  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">构造函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ~BinaryTree(); </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">析构函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">创建一个树节点</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CreateNode(BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> parentnode, ECCHILDSIGN pointS</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> //</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">释放树节点</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> void ReleaseNode(BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pnode);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> root</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">树根指针</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">构造函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​class T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BinaryTree</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::BinaryTree()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> root</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nullptr;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">析构函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​class T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BinaryTree</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::~BinaryTree()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ReleaseNode(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">root</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">//</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">释放二叉树节点</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">template</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​class T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">void BinaryTree</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">::ReleaseNode(BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pnode)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (pnode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nullptr)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ReleaseNode(pnode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">leftChild);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   ReleaseNode(pnode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rightChild);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pnode;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="创建树节点操作" tabindex="-1">创建树节点操作 <a class="header-anchor" href="#创建树节点操作" aria-label="Permalink to &quot;创建树节点操作&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//创建一个树节点</span></span>
<span class="line"><span>template&lt;​class T&gt;</span></span>
<span class="line"><span>//参数1：父节点指针，参数2：标记所创建的是树根、左孩子、右孩子，参数3：插入的树节点的元素值</span></span>
<span class="line"><span>BinaryTreeNode&lt;​T&gt;* BinaryTree&lt;​T&gt;::CreateNode(BinaryTreeNode&lt;​T&gt;* parentnode, ECCHI</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> //将新节点创建出来</span></span>
<span class="line"><span> BinaryTreeNode&lt;​T&gt;*  tmpnode = new BinaryTreeNode&lt;​T&gt;;</span></span>
<span class="line"><span> tmpnode-&gt;data = e;</span></span>
<span class="line"><span> tmpnode-&gt;leftChild = nullptr;</span></span>
<span class="line"><span> tmpnode-&gt;rightChild = nullptr;</span></span>
<span class="line"><span> //把新节点放入正确的位置</span></span>
<span class="line"><span> if (pointSign == E_Root)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //创建的是根节点</span></span>
<span class="line"><span>   root = tmpnode;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> if (pointSign == E_ChildLeft)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //创建的是左孩子节点</span></span>
<span class="line"><span>   parentnode-&gt;leftChild = tmpnode;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else  if (pointSign == E_ChildRight)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //创建的是右孩子节点</span></span>
<span class="line"><span>   parentnode-&gt;rightChild = tmpnode;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return tmpnode;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 main 主函数中，加入如下代码，创建一个如前面图 5 左侧所示的一棵二叉树。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BinaryTree&lt;​int&gt; mytree;</span></span>
<span class="line"><span>//创建一棵二叉树</span></span>
<span class="line"><span>BinaryTreeNode&lt;​int&gt;* rootpoint = mytree.CreateNode(nullptr, E_Root, &#39;A&#39;); //创建树</span></span>
<span class="line"><span>BinaryTreeNode&lt;​int&gt;* subpoint = mytree.CreateNode(rootpoint, E_ChildLeft, &#39;B&#39;); /</span></span>
<span class="line"><span>subpoint = mytree.CreateNode(subpoint, E_ChildLeft, &#39;D&#39;); //创建左子节点B下的左子节点</span></span>
<span class="line"><span>subpoint = mytree.CreateNode(rootpoint, E_ChildRight, &#39;C&#39;); //创建树根的右子节点C</span></span>
<span class="line"><span>subpoint = mytree.CreateNode(subpoint, E_ChildRight, &#39;E&#39;);  //创建右子节点C下的右子节</span></span></code></pre></div><p>在前面讲解扩展二叉树时，你已经知道，给出一个扩展二叉树的前序遍历序列，能够唯一确定一棵二叉树。前面图 5 中右侧的扩展二叉树，其前序遍历序列是“ABD###C#E##”，那么如果想通过这个遍历序列把这棵二叉树创建，是否可以做到呢？可以。</p><p>我们在类模板 BinaryTree 中增加如下两个成员函数声明。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public:</span></span>
<span class="line"><span> //利用扩展二叉树的前序遍历序列来创建一棵二叉树</span></span>
<span class="line"><span> void CreateBTreeAccordPT(char* pstr);</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span> //利用扩展二叉树的前序遍历序列创建二叉树的递归函数</span></span>
<span class="line"><span> void CreateBTreeAccordPTRecu(BinaryTreeNode&lt;​T&gt;*&amp; tnode, char*&amp; pstr);//参数为引用</span></span></code></pre></div><p>在类模板 BinaryTree 定义之外，实现上述两个成员函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//利用扩展二叉树的前序遍历序列来创建一棵二叉树</span></span>
<span class="line"><span>template&lt;​class T&gt;</span></span>
<span class="line"><span>void BinaryTree&lt;​T&gt;::CreateBTreeAccordPT(char* pstr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> CreateBTreeAccordPTRecu(root, pstr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//利用扩展二叉树的前序遍历序列创建二叉树的递归函数</span></span>
<span class="line"><span>template&lt;​class T&gt;</span></span>
<span class="line"><span>void BinaryTree&lt;​T&gt;::CreateBTreeAccordPTRecu(BinaryTreeNode&lt;​T&gt;* &amp;tnode, char* &amp;pst</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (*pstr == &#39;#&#39;)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   tnode = nullptr;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   tnode = new BinaryTreeNode&lt;​T&gt;; //创建根节点</span></span>
<span class="line"><span>   tnode-&gt;data = *pstr;</span></span>
<span class="line"><span>   CreateBTreeAccordPTRecu(tnode-&gt;leftChild, ++pstr); //创建左子树</span></span>
<span class="line"><span>   CreateBTreeAccordPTRecu(tnode-&gt;rightChild, ++pstr);//创建右子树</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 main 主函数中，注释掉以往的代码，新增如下测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BinaryTree&lt;​int&gt; mytree2;</span></span>
<span class="line"><span>mytree2.CreateBTreeAccordPT((char *)&quot;ABD###C#E##&quot;);</span></span></code></pre></div><p>通过跟踪调试，不难看到，上述的 mytree2 所存储的数据正是图 5 左侧所示的二叉树。</p><h3 id="遍历操作" tabindex="-1">遍历操作 <a class="header-anchor" href="#遍历操作" aria-label="Permalink to &quot;遍历操作&quot;">​</a></h3><p>二叉树创建出来后，就可以通过前面讲解过的遍历方式，将树中各个节点的内容输出出来以方便观察。我们从深度、广度优先遍历两种方式的角度去了解。</p><ul><li>深度优先遍历</li></ul><p>将下列前序、中序、后序遍历的代码加入到类模板 BinaryTree 的定义中，注意用 public 修饰。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//前序遍历二叉树</span></span>
<span class="line"><span>void preOrder()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> preOrder(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void preOrder(BinaryTreeNode&lt;​T&gt;* tNode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tNode != nullptr) //若二叉树非空</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //根左右顺序</span></span>
<span class="line"><span>   cout &lt;&lt; (char) tNode-&gt;data &lt;&lt; &quot; &quot;; //输出节点的数据域的值，为方便观察，用char以显示字</span></span>
<span class="line"><span>   preOrder(tNode-&gt;leftChild);  //递归方式前序遍历左子树</span></span>
<span class="line"><span>   preOrder(tNode-&gt;rightChild); //递归方式前序遍历右子树</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//--------------------------</span></span>
<span class="line"><span>//中序遍历二叉树</span></span>
<span class="line"><span>void inOrder()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> inOrder(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void inOrder(BinaryTreeNode&lt;​T&gt;* tNode)  //中序遍历二叉树</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tNode != nullptr) //若二叉树非空</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //左根右顺序</span></span>
<span class="line"><span>   inOrder(tNode-&gt;leftChild);  //递归方式中序遍历左子树</span></span>
<span class="line"><span>   cout &lt;&lt; (char)tNode-&gt;data &lt;&lt; &quot; &quot;; //输出节点的数据域的值</span></span>
<span class="line"><span>   inOrder(tNode-&gt;rightChild); //递归方式中序遍历右子树</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//--------------------------</span></span>
<span class="line"><span>//后序遍历二叉树</span></span>
<span class="line"><span>void postOrder()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> postOrder(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void postOrder(BinaryTreeNode&lt;​T&gt;* tNode)  //后序遍历二叉树</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tNode != nullptr) //若二叉树非空</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //左右根顺序</span></span>
<span class="line"><span>   postOrder(tNode-&gt;leftChild);  //递归方式后序遍历左子树</span></span>
<span class="line"><span>   postOrder(tNode-&gt;rightChild); //递归方式后序遍历右子树</span></span>
<span class="line"><span>   cout &lt;&lt; (char)tNode-&gt;data &lt;&lt; &quot; &quot;; //输出节点的数据域的值</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 main 主函数中，继续增加如下代码对刚刚创建的树进行前序、中序和后序遍历。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; &quot;前序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.preOrder();   //前序遍历</span></span>
<span class="line"><span>cout &lt;&lt; endl; //换行</span></span>
<span class="line"><span>cout &lt;&lt; &quot;中序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.inOrder();    //中序遍历</span></span>
<span class="line"><span>cout &lt;&lt; endl; //换行</span></span>
<span class="line"><span>cout &lt;&lt; &quot;后序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.postOrder();  //后序遍历</span></span></code></pre></div><p>新增代码的执行结果如下，正是对图 5 左侧所示的二叉树进行前序、中序、后序遍历得到的结果。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/7.png" alt=""></a></p><ul><li>广度优先遍历</li></ul><p>除了对二叉树进行前序、中序、后序遍历之外，还有一种遍历方式叫层序遍历。前面说过，二叉树的层序遍历需要借助队列来完成，因为难以估计二叉树节点个数，所以使用顺序队列不合适，这里就用链式队列。</p><p>我们把以往讲解的链式队列相关的代码复制到本项目当前的 MyProject.cpp 文件中来。将下列代码加入到类模板 BinaryTree 的定义中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//--------------------------</span></span>
<span class="line"><span>//层序遍历二叉树</span></span>
<span class="line"><span>void levelOrder()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> levelOrder(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void levelOrder(BinaryTreeNode&lt;​T&gt;* tNode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tNode != nullptr) //若二叉树非空</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   BinaryTreeNode&lt;​T&gt;* tmpnode;</span></span>
<span class="line"><span>   LinkQueue&lt;​BinaryTreeNode&lt;​T&gt;*&gt; lnobj;//注意，队列的元素类型是“节点指针”类型</span></span>
<span class="line"><span>   lnobj.EnQueue(tNode); //先把根节点指针入队</span></span>
<span class="line"><span>   while (!lnobj.IsEmpty()) //循环判断队列是否为空</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     lnobj.DeQueue(tmpnode); //出队列</span></span>
<span class="line"><span>     cout &lt;&lt; (char)tmpnode-&gt;data &lt;&lt; &quot; &quot;;</span></span>
<span class="line"><span>     if(tmpnode-&gt;leftChild != nullptr)</span></span>
<span class="line"><span>       lnobj.EnQueue(tmpnode-&gt;leftChild);  //左孩子入队</span></span>
<span class="line"><span>     if (tmpnode-&gt;rightChild != nullptr)     //右孩子入队</span></span>
<span class="line"><span>       lnobj.EnQueue(tmpnode-&gt;rightChild);</span></span>
<span class="line"><span>   } //end while</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 main 主函数中，继续增加如下代码对刚刚创建的树进行层序遍历。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; endl; //换行</span></span>
<span class="line"><span>cout &lt;&lt; &quot;层序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.levelOrder();</span></span></code></pre></div><p>新增代码的执行结果如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/8.png" alt=""></a></p><p>这里可以进一步思考一下，如何在上述层序遍历代码中加入一些代码来判断二叉树是否是一棵完全二叉树呢？</p><p>如果某个节点的左子节点不存在而右子节点存在，那么这棵二叉树就不是完全二叉树，所以上述层序遍历代码中，在出队列一个节点后，可以加入如下代码来判断一棵二叉树是否是完全二叉树。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if(tmpnode-&gt;leftChild == nullptr &amp;&amp; tmpnode-&gt;rightChild != nullptr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> //这棵二叉树不是一棵完全二叉树。</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述无论何种遍历方式，每个节点被访问的次数都是有限的，所以遍历操作的时间复杂度和二叉树的节点个数成正比，即二叉树遍历的时间复杂度为 O(n)。</p><h3 id="其他常用操作" tabindex="-1">其他常用操作 <a class="header-anchor" href="#其他常用操作" aria-label="Permalink to &quot;其他常用操作&quot;">​</a></h3><p>最后，我们将分别实现二叉树的一些常用操作，包括计算节点个数、求二叉树的高度、根据给的节点值查找某个节点、查找某个节点的父节点、二叉树的拷贝。这些代码都可以在类模板BinaryTree 的定义中实现。</p><ul><li>计算二叉树的节点个数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//求二叉树节点个数</span></span>
<span class="line"><span>int getSize()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> return getSize(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>int getSize(BinaryTreeNode&lt;​T&gt;* tNode) //也可以用遍历二叉树的方式求节点个数</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tNode == nullptr)</span></span>
<span class="line"><span>   return  0;</span></span>
<span class="line"><span> return getSize(tNode-&gt;leftChild) + getSize(tNode-&gt;rightChild) + 1; //之所以+1，是</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码（在 main 主函数中），确保增加的操作能够正常运行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; &quot;二叉树节点个数为：&quot; &lt;&lt; mytree2.getSize() &lt;&lt; endl;</span></span>
<span class="line"><span>//求二叉树高度（取左右子树中高度更高的）</span></span>
<span class="line"><span>int getHeight()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> return getHeight(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>int getHeight(BinaryTreeNode&lt;​T&gt;* tNode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tNode == nullptr)</span></span>
<span class="line"><span>   return  0;</span></span>
<span class="line"><span> int lheight = getHeight(tNode-&gt;leftChild); //左子树高度</span></span>
<span class="line"><span> int rheight = getHeight(tNode-&gt;rightChild); //右子树高度</span></span>
<span class="line"><span> if (lheight &gt; rheight)</span></span>
<span class="line"><span>   return lheight + 1 ; //之所以+1，是因为还包括根节点的高度</span></span>
<span class="line"><span> return rheight + 1;   //之所以+1，是因为还包括根节点的高度</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; &quot;二叉树的高度为：&quot; &lt;&lt; mytree2.getHeight() &lt;&lt; endl;</span></span></code></pre></div><ul><li>查找某个节点（假设二叉树的节点各不相同）</li></ul><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SearchElem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(const </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SearchElem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(root, e);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SearchElem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> tNode,const </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (tNode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nullptr)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nullptr;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (tNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e)  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//从根开始找</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> tNode;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> BinaryTreeNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">​</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> p </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SearchElem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(tNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">leftChild, e); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//查找左子树</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (p </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> nullptr) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//这里的判断不可缺少</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> p;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SearchElem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(tNode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rightChild, e); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//左子树查不到，继续到右子树查找，这里可以直接</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//查找某个节点</span></span>
<span class="line"><span>int val = &#39;B&#39;;</span></span>
<span class="line"><span>BinaryTreeNode&lt;​int&gt;*  p = mytree2.SearchElem(val);</span></span>
<span class="line"><span>if (p != nullptr)</span></span>
<span class="line"><span> cout &lt;&lt; &quot;找到了值为&quot; &lt;&lt; (char)val &lt;&lt; &quot;的节点&quot; &lt;&lt; endl;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> cout &lt;&lt; &quot;没找到值为&quot; &lt;&lt; (char)val &lt;&lt; &quot;的节点&quot; &lt;&lt; endl;</span></span></code></pre></div><ul><li>查找某个节点的父节点</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BinaryTreeNode&lt;​T&gt;* GetParent(BinaryTreeNode&lt;​T&gt;* tSonNode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> return GetParent(root, tSonNode);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>BinaryTreeNode&lt;​T&gt;* GetParent(BinaryTreeNode&lt;​T&gt;* tParNode, BinaryTreeNode&lt;​T&gt;* tSon</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tParNode == nullptr || tSonNode == nullptr)</span></span>
<span class="line"><span>   return nullptr;</span></span>
<span class="line"><span> if (tParNode-&gt;leftChild == tSonNode || tParNode-&gt;rightChild == tSonNode)</span></span>
<span class="line"><span>   return tParNode;</span></span>
<span class="line"><span> BinaryTreeNode&lt;​T&gt;* pl = GetParent(tParNode-&gt;leftChild, tSonNode);</span></span>
<span class="line"><span> if (pl != nullptr)</span></span>
<span class="line"><span>   return pl;</span></span>
<span class="line"><span> return  GetParent(tParNode-&gt;rightChild, tSonNode);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//查找某个节点的父节点</span></span>
<span class="line"><span>BinaryTreeNode&lt;​int&gt;* parp = mytree2.GetParent(p);</span></span>
<span class="line"><span>if (parp != nullptr)</span></span>
<span class="line"><span> cout &lt;&lt; &quot;找到了值为&quot; &lt;&lt; (char)val &lt;&lt; &quot;的节点的父节点&quot; &lt;&lt; (char)parp-&gt;data &lt;&lt; endl;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> cout &lt;&lt; &quot;没找到值为&quot; &lt;&lt; (char)val &lt;&lt; &quot;的节点的父节点&quot; &lt;&lt; endl;</span></span></code></pre></div><ul><li>树的拷贝</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void CopyTree(BinaryTree&lt;​T&gt;* targetTree)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> CopyTree(root,targetTree-&gt;root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void CopyTree(BinaryTreeNode&lt;​T&gt;* tSource,BinaryTreeNode&lt;​T&gt;* &amp;tTarget) //注意第二个参</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tSource == nullptr)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   tTarget = nullptr;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   tTarget = new BinaryTreeNode&lt;​T&gt;;</span></span>
<span class="line"><span>   tTarget-&gt;data = tSource-&gt;data;</span></span>
<span class="line"><span>   CopyTree(tSource-&gt;leftChild, tTarget-&gt;leftChild);  //对左子树进行拷贝</span></span>
<span class="line"><span>   CopyTree(tSource-&gt;rightChild, tTarget-&gt;rightChild);//对右子树进行拷贝</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//测试树的拷贝</span></span>
<span class="line"><span>BinaryTree&lt;​int&gt; mytree3;</span></span>
<span class="line"><span>mytree2.CopyTree(&amp;mytree3);</span></span></code></pre></div><h3 id="非递归遍历操作" tabindex="-1">非递归遍历操作 <a class="header-anchor" href="#非递归遍历操作" aria-label="Permalink to &quot;非递归遍历操作&quot;">​</a></h3><p>在前面的二叉树遍历代码实现中，除层序遍历外，前序、中序、后序遍历采用的都是递归方式来实现的，这种实现方法代码比较简单。但实际的面试中，有时也会要求采用非递归的方式实现前序、中序、后序遍历，这往往需要借助栈来实现。并且实际的应用中，如果二叉树的高度特别高，节点特别多，用递归的方式遍历可能会导致栈溢出，此时就需要采用非递归方式遍历了。</p><p>把第 10 节课提到的链式栈相关代码复制到当前的 MyProject.cpp 文件中来。非递归遍历代码都可以在类模板 BinaryTree 的定义中实现。</p><ul><li>前序遍历（根左右）</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/9.png" alt=""></a></p><ul><li>前序遍历过程</li></ul><p>你可以根据图片提示，自己手工绘制一下入栈和出栈的过程，这样也会对通过栈实现前序遍历有一个更深刻的认识。</p><p>我们把以往讲解的链式栈相关的代码复制到本项目当前的 MyProject.cpp 文件中来。将下列代码加入到类模板 BinaryTree 的定义中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//非递归方式前序遍历二叉树</span></span>
<span class="line"><span>void preOrder_noRecu()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> preOrder_noRecu(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void preOrder_noRecu(BinaryTreeNode&lt;​T&gt;* tRoot)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tRoot == nullptr)</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> LinkStack&lt; BinaryTreeNode&lt;​T&gt;* &gt; slinkobj;</span></span>
<span class="line"><span> slinkobj.Push(tRoot); //根节点入栈</span></span>
<span class="line"><span> BinaryTreeNode&lt;​T&gt;* tmpnode;</span></span>
<span class="line"><span> while (!slinkobj.Empty()) //栈不空</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   slinkobj.Pop(tmpnode);               //栈顶元素出栈</span></span>
<span class="line"><span>   cout &lt;&lt; (char)tmpnode-&gt;data &lt;&lt; &quot; &quot;;  //访问栈顶元素</span></span>
<span class="line"><span>   if (tmpnode-&gt;rightChild != nullptr) //注意先判断右树再判断左树</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     slinkobj.Push(tmpnode-&gt;rightChild); //把右树入栈</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (tmpnode-&gt;leftChild != nullptr)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     slinkobj.Push(tmpnode-&gt;leftChild); //把左树入栈</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> } //end while</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; &quot;非递归方式前序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.preOrder_noRecu();</span></span>
<span class="line"><span>cout &lt;&lt; endl;</span></span></code></pre></div><p>新增代码的执行结果如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/10.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/10.png" alt=""></a></p><ul><li>中序遍历（左根右）</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/11.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/11.png" alt=""></a></p><ul><li>中序遍历过程</li></ul><p>相应的代码我也放在了下面，不过写法不限于这一种，有兴趣可以发挥自己的想象力，根据“左根右”这个遍历顺序写出不同的非递归遍历代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//非递归方式中序遍历二叉树</span></span>
<span class="line"><span>void inOrder_noRecu()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> inOrder_noRecu(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void inOrder_noRecu(BinaryTreeNode&lt;​T&gt;* tRoot)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tRoot == nullptr)</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> LinkStack&lt; BinaryTreeNode&lt;​T&gt;* &gt; slinkobj;</span></span>
<span class="line"><span> slinkobj.Push(tRoot);//根节点入栈</span></span>
<span class="line"><span> BinaryTreeNode&lt;​T&gt;* tmpnode;</span></span>
<span class="line"><span> while (!slinkobj.Empty()) //栈不空</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   while (tRoot-&gt;leftChild != nullptr)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     slinkobj.Push(tRoot-&gt;leftChild);  //将“当前节点的左节点”入栈</span></span>
<span class="line"><span>     tRoot = tRoot-&gt;leftChild; //将“当前节点的左节点”重新标记为当前节点。</span></span>
<span class="line"><span>   } //end while</span></span>
<span class="line"><span>   slinkobj.Pop(tmpnode); //对栈顶元素出栈(同时获取了栈顶元素)</span></span>
<span class="line"><span>   cout &lt;&lt; (char)tmpnode-&gt;data &lt;&lt; &quot; &quot;;</span></span>
<span class="line"><span>   //查看右树</span></span>
<span class="line"><span>   if (tmpnode-&gt;rightChild != nullptr)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     tRoot = tmpnode-&gt;rightChild;  //将刚刚从栈顶出栈的元素的右节点标记为当前节点</span></span>
<span class="line"><span>     slinkobj.Push(tRoot); //右节点入栈</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span> }//end while</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; &quot;非递归方式中序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.inOrder_noRecu();</span></span>
<span class="line"><span>cout &lt;&lt; endl;</span></span></code></pre></div><p>新增代码的执行结果如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/12.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/12.png" alt=""></a></p><ul><li>后序遍历（左右根）</li></ul><p>后序遍历的实现比前序和中序遍历更繁琐一些。因为后序遍历的顺序是“左右根”，也就是说，是否访问某个节点，取决于当前访问完毕的是该节点的左子树还是右子树。</p><p>如果是左子树访问完毕，根据“左右根”的遍历顺序，必须去访问右子树，如果是右子树访问完毕，则就可以去访问该根节点。</p><p>因此，要实现这里的后序遍历，当将一个节点入栈的时候，必须同时标记后续入栈的是该节点的左子树还是右子树，这意味着需要将“节点指针和标记”同时入栈和出栈。</p><p>所以，前面代码中定义的用于表示树中每个节点的 BinaryTreeNode 类模板中，缺少了一个标记字段用来标记左右子树。</p><p>为了实现非递归后序遍历，可以考虑扩充 BinaryTreeNode 类模板的定义，也就是增加一个左右节点的标记，也可以定义一个新的类模板增加一个左右节点的标记，并将 BinaryTreeNode类模板包含在其中。</p><p>这里采用后一种实现方式——在 BinaryTreeNode 类模板的实现代码之下，增加新的类模板BTNode_extra，实现代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//为实现二叉树的非递归后序遍历引入的新类模板</span></span>
<span class="line"><span>template &lt;​typename T&gt; //T代表数据元素的类型</span></span>
<span class="line"><span>struct BTNode_extra</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> BinaryTreeNode&lt;​T&gt; * point;</span></span>
<span class="line"><span> ECCHILDSIGN pointSign;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在这里先把后序遍历的过程描述一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/13.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/13.png" alt=""></a></p><ul><li>后序遍历过程</li></ul><p>非递归方式后序遍历二叉树的代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//非递归后序遍历二叉树</span></span>
<span class="line"><span>void postOrder_noRecu()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> postOrder_noRecu(root);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void postOrder_noRecu(BinaryTreeNode&lt;​T&gt;* tRoot)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (tRoot == nullptr)</span></span>
<span class="line"><span>   return;</span></span>
<span class="line"><span> LinkStack&lt; BTNode_extra&lt;​T&gt; &gt; slinkobj;</span></span>
<span class="line"><span> BTNode_extra&lt;​T&gt; ext_tmpnode;</span></span>
<span class="line"><span> do</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   while (tRoot != nullptr)</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     ext_tmpnode.point = tRoot;</span></span>
<span class="line"><span>     ext_tmpnode.pointSign = E_ChildLeft;  //标记先处理该节点的左孩子</span></span>
<span class="line"><span>     slinkobj.Push(ext_tmpnode);</span></span>
<span class="line"><span>     tRoot = tRoot-&gt;leftChild;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   while (!slinkobj.Empty())</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>     slinkobj.Pop(ext_tmpnode); //出栈</span></span>
<span class="line"><span>     if (ext_tmpnode.pointSign == E_ChildLeft)</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>       //把左标记更改为右标记</span></span>
<span class="line"><span>       ext_tmpnode.pointSign = E_ChildRight; //标记该节点的右孩子</span></span>
<span class="line"><span>       slinkobj.Push(ext_tmpnode);         //重新入栈</span></span>
<span class="line"><span>       tRoot = ext_tmpnode.point-&gt;rightChild;</span></span>
<span class="line"><span>       break;  //终止while循环</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     else //if (ext_tmpnode.pointSign == E_ChildRight) 肯定是右子树标记，所以这个if不</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>       //根据左右根规则，右节点之后可以访问根节点</span></span>
<span class="line"><span>       cout &lt;&lt; (char)ext_tmpnode.point-&gt;data &lt;&lt; &quot; &quot;;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>   } //end while</span></span>
<span class="line"><span> } while (!slinkobj.Empty());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>增加下列测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cout &lt;&lt; &quot;非递归方式后序遍历序列为：&quot;;</span></span>
<span class="line"><span>mytree2.postOrder_noRecu();</span></span>
<span class="line"><span>cout &lt;&lt; endl;</span></span></code></pre></div><p>新增代码的执行结果如下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/14.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8BC%2B%2B%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/images/12/14.png" alt=""></a></p><h3 id="通过遍历序列创建二叉树" tabindex="-1">通过遍历序列创建二叉树 <a class="header-anchor" href="#通过遍历序列创建二叉树" aria-label="Permalink to &quot;通过遍历序列创建二叉树&quot;">​</a></h3><p>前面我们说过一个结论：已知前序和中序遍历序列，能够唯一确定一棵二叉树。那么，是否可以实现一个这样的成员函数，用来实现这棵二叉树的创建呢？</p><p>完全可以。在 BinaryTree 类模板的定义中实现，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//如何根据前序、中序遍历序列来创建一棵二叉树呢？</span></span>
<span class="line"><span>//pP_T：前序遍历序列，比如是“ABDCE”，pI_T：中序遍历序列，比如是“DBACE”</span></span>
<span class="line"><span>void CreateBTreeAccordPI(char* pP_T, char* pI_T)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> CreateBTreeAccordPI(root, pP_T, pI_T, strlen(pP_T));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void CreateBTreeAccordPI(BinaryTreeNode&lt;​T&gt;*&amp; tnode, char* pP_T,char * pI_T,int n)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> if (n == 0)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   tnode = nullptr;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>   //(1)在中序遍历序列中找根，前序遍历序列中根在最前面</span></span>
<span class="line"><span>   int tmpindex = 0;   //下标</span></span>
<span class="line"><span>   while (pP_T[0] != pI_T[tmpindex])</span></span>
<span class="line"><span>     ++tmpindex;</span></span>
<span class="line"><span>   tnode = new BinaryTreeNode&lt;​T&gt;; //创建根节点</span></span>
<span class="line"><span>   tnode-&gt;data = pI_T[tmpindex];  //第一次tmpindex=2</span></span>
<span class="line"><span>   //(2)创建左孩子</span></span>
<span class="line"><span>   CreateBTreeAccordPI(</span></span>
<span class="line"><span>     tnode-&gt;leftChild,   //创建左孩子</span></span>
<span class="line"><span>     pP_T + 1,           //找到前序遍历序列中左树开始节点的位置，这里跳过第一个（根）节点A</span></span>
<span class="line"><span>     pI_T,               //不需要改动，仍旧是“DBACE”</span></span>
<span class="line"><span>     tmpindex            //左孩子有2个节点</span></span>
<span class="line"><span>   );</span></span>
<span class="line"><span>   //(3)创建右孩子</span></span>
<span class="line"><span>   CreateBTreeAccordPI(</span></span>
<span class="line"><span>     tnode-&gt;rightChild,   //创建右孩子</span></span>
<span class="line"><span>     pP_T + tmpindex + 1, //找到前序遍历系列中右树开始节点的位置，不难发现，前序遍历序列和</span></span>
<span class="line"><span>     pI_T + tmpindex + 1, //找到中序遍历系列中右树开始节点的位置。得到的是“CE”</span></span>
<span class="line"><span>     n - tmpindex - 1   //右孩子节点数</span></span>
<span class="line"><span>   );</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 main 主函数中，把如下创建二叉树的代码行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mytree2.CreateBTreeAccordPT((char *)&quot;ABD###C#E##&quot;);</span></span></code></pre></div><p>替换为新的代码行来创建一棵图 5 左侧所示的二叉树。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mytree2.CreateBTreeAccordPI((char*)&quot;ABDCE&quot;, (char*)&quot;DBACE&quot;);</span></span></code></pre></div><p>发现二叉树创建成功。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>这节课，我们学习了二叉树的两种存储方式——顺序存储方式、链式存储方式，以及他们的实现方式。</p><p>二叉树的顺序存储，是用一段连续的内存依次从上到下从左到右存储二叉树各个节点元素，但是很容易造成存储空间的浪费，因此顺序存储往往比较适合存储完全二叉树。</p><p>二叉树的链式存储，需要存储额外的左右节点指针。虽然增加了存储的灵活性，但也消耗了更多的存储空间。链式存储方式中，还涉及到了二叉链表和三叉链表的概念。二叉链表的一个节点结构带有两根指针以指向左右孩子节点，而三叉链表中一个节点结构带有三根指针，其中第三个指针用于指向当前节点的父节点，这给找当前节点的父节点带来了最大的便利。</p><p>由于与顺序存储相比，二叉树链式存储更加常用，所以这节课我将重点放在了二叉树链式存储的常用操作。给出了创建树节点，获取二叉树的前序、中序、后序、层序遍历序列，获取二叉树节点个数，获取二叉树高度，查找某个节点，查找某个节点的父节点，树的拷贝等操作代码。这里要重点记忆二叉树前序、中序、后序遍历代码，理解性记忆层序遍历代码，以防在面试中出现。</p><p>此外，我们也利用非递归的编程方式实现了二叉树的前序、中序、后序遍历。注意，非递归的遍历操作需要借助栈来实现。这些代码需要我们简单理解、适当记忆，万一面试中出现，能说上几句就是好的。</p><p>最后，如何从无到有创建出一棵二叉树来呢？我们在最后用前序、中序遍历序列创建了一棵二叉树，这些代码都不复杂，但一定可以作为参考和借鉴，帮助你进一步拓展创建二叉树的思路。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>已知“中序和后序遍历序列”，也能够唯一确定一棵二叉树，请你尝试实现相关代码。</p><p>欢迎在留言区分享你的成果代码。如果觉得有所收获，也可以把课程分享给更多的朋友一起学习。我们下节课见！</p>`,164)])])}const k=n(e,[["render",l]]);export{E as __pageData,k as default};
