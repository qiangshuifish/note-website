import{_ as a,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"21 | 土地需求扩大与保障：如何分配和释放虚拟内存？","description":"","frontmatter":{},"headers":[{"level":2,"title":"虚拟地址的空间的分配与释放","slug":"虚拟地址的空间的分配与释放","link":"#虚拟地址的空间的分配与释放","children":[{"level":3,"title":"虚拟地址空间分配接口","slug":"虚拟地址空间分配接口","link":"#虚拟地址空间分配接口","children":[]},{"level":3,"title":"分配时查找虚拟地址区间","slug":"分配时查找虚拟地址区间","link":"#分配时查找虚拟地址区间","children":[]},{"level":3,"title":"虚拟地址空间释放接口","slug":"虚拟地址空间释放接口","link":"#虚拟地址空间释放接口","children":[]},{"level":3,"title":"释放时查找虚拟地址区间","slug":"释放时查找虚拟地址区间","link":"#释放时查找虚拟地址区间","children":[]}]},{"level":2,"title":"测试环节：虚拟空间能正常访问么？","slug":"测试环节-虚拟空间能正常访问么","link":"#测试环节-虚拟空间能正常访问么","children":[{"level":3,"title":"准备工作","slug":"准备工作","link":"#准备工作","children":[]},{"level":3,"title":"异常情况与原因分析","slug":"异常情况与原因分析","link":"#异常情况与原因分析","children":[]},{"level":3,"title":"开始处理缺页异常","slug":"开始处理缺页异常","link":"#开始处理缺页异常","children":[]},{"level":3,"title":"处理缺页异常的核心","slug":"处理缺页异常的核心","link":"#处理缺页异常的核心","children":[]},{"level":3,"title":"缺页地址是否合法","slug":"缺页地址是否合法","link":"#缺页地址是否合法","children":[]},{"level":3,"title":"建立kvmemcbox_t结构","slug":"建立kvmemcbox-t结构","link":"#建立kvmemcbox-t结构","children":[]},{"level":3,"title":"映射物理内存页面","slug":"映射物理内存页面","link":"#映射物理内存页面","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/21-土地需求扩大与保障：如何分配和释放虚拟内存？.md","filePath":"操作系统实战45讲/21-土地需求扩大与保障：如何分配和释放虚拟内存？.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/21-土地需求扩大与保障：如何分配和释放虚拟内存？.md"};function t(i,s,c,r,m,d){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_21-土地需求扩大与保障-如何分配和释放虚拟内存" tabindex="-1">21 | 土地需求扩大与保障：如何分配和释放虚拟内存？ <a class="header-anchor" href="#_21-土地需求扩大与保障-如何分配和释放虚拟内存" aria-label="Permalink to &quot;21 | 土地需求扩大与保障：如何分配和释放虚拟内存？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>今天，我们继续研究操作系统如何实现虚拟内存。在上节课，我们已经建立了虚拟内存的初始流程，这节课我们来实现虚拟内存的核心功能：写出分配、释放虚拟地址空间的代码，最后实现虚拟地址空间到物理地址空间的映射。</p><p>这节课的配套代码，你可以点击 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson19~21/Cosmos" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="虚拟地址的空间的分配与释放" tabindex="-1">虚拟地址的空间的分配与释放 <a class="header-anchor" href="#虚拟地址的空间的分配与释放" aria-label="Permalink to &quot;虚拟地址的空间的分配与释放&quot;">​</a></h2><p>通过上节课的学习，我们知道整个虚拟地址空间就是由一个个虚拟地址区间组成的。那么不难猜到，分配一个虚拟地址空间就是在整个虚拟地址空间分割出一个区域，而释放一块虚拟地址空间，就是把这个区域合并到整个虚拟地址空间中去。</p><h3 id="虚拟地址空间分配接口" tabindex="-1">虚拟地址空间分配接口 <a class="header-anchor" href="#虚拟地址空间分配接口" aria-label="Permalink to &quot;虚拟地址空间分配接口&quot;">​</a></h3><p>我们先来研究地址的分配，依然从虚拟地址空间的分配接口开始实现，一步步带着你完成虚拟 空间的分配。</p><p>在我们的想像中，分配虚拟地址空间应该有大小、有类型、有相关标志，还有从哪里开始分配等信息。根据这些信息，我们在krlvadrsmem.c文件中设计好分配虚拟地址空间的接口，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>adr_t vma_new_vadrs_core(mmadrsdsc_t *mm, adr_t start, size_t vassize, u64_t vaslimits, u32_t vastype)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    adr_t retadrs = NULL;</span></span>
<span class="line"><span>    kmvarsdsc_t *newkmvd = NULL, *currkmvd = NULL;</span></span>
<span class="line"><span>    virmemadrs_t *vma = &amp;mm-&amp;gt;msd_virmemadrs;</span></span>
<span class="line"><span>    knl_spinlock(&amp;vma-&amp;gt;vs_lock);</span></span>
<span class="line"><span>    //查找虚拟地址区间</span></span>
<span class="line"><span>    currkmvd = vma_find_kmvarsdsc(vma, start, vassize);</span></span>
<span class="line"><span>    if (NULL == currkmvd)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        retadrs = NULL;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //进行虚拟地址区间进行检查看能否复用这个数据结构</span></span>
<span class="line"><span>    if (((NULL == start) || (start == currkmvd-&amp;gt;kva_end)) &amp;&amp; (vaslimits == currkmvd-&amp;gt;kva_limits) &amp;&amp; (vastype == currkmvd-&amp;gt;kva_maptype))</span></span>
<span class="line"><span>    {//能复用的话，当前虚拟地址区间的结束地址返回</span></span>
<span class="line"><span>        retadrs = currkmvd-&amp;gt;kva_end;</span></span>
<span class="line"><span>        //扩展当前虚拟地址区间的结束地址为分配虚拟地址区间的大小</span></span>
<span class="line"><span>        currkmvd-&amp;gt;kva_end += vassize;</span></span>
<span class="line"><span>        vma-&amp;gt;vs_currkmvdsc = currkmvd;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //建立一个新的kmvarsdsc_t虚拟地址区间结构</span></span>
<span class="line"><span>    newkmvd = new_kmvarsdsc();</span></span>
<span class="line"><span>    if (NULL == newkmvd)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        retadrs = NULL;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果分配的开始地址为NULL就由系统动态决定</span></span>
<span class="line"><span>    if (NULL == start)</span></span>
<span class="line"><span>    {//当然是接着当前虚拟地址区间之后开始</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_start = currkmvd-&amp;gt;kva_end;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {//否则这个新的虚拟地址区间的开始就是请求分配的开始地址</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_start = start;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置新的虚拟地址区间的结束地址</span></span>
<span class="line"><span>    newkmvd-&amp;gt;kva_end = newkmvd-&amp;gt;kva_start + vassize;</span></span>
<span class="line"><span>    newkmvd-&amp;gt;kva_limits = vaslimits;</span></span>
<span class="line"><span>    newkmvd-&amp;gt;kva_maptype = vastype;</span></span>
<span class="line"><span>    newkmvd-&amp;gt;kva_mcstruct = vma;</span></span>
<span class="line"><span>    vma-&amp;gt;vs_currkmvdsc = newkmvd;</span></span>
<span class="line"><span>    //将新的虚拟地址区间加入到virmemadrs_t结构中</span></span>
<span class="line"><span>    list_add(&amp;newkmvd-&amp;gt;kva_list, &amp;currkmvd-&amp;gt;kva_list);</span></span>
<span class="line"><span>    //看看新的虚拟地址区间是否是最后一个</span></span>
<span class="line"><span>    if (list_is_last(&amp;newkmvd-&amp;gt;kva_list, &amp;vma-&amp;gt;vs_list) == TRUE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        vma-&amp;gt;vs_endkmvdsc = newkmvd;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //返回新的虚拟地址区间的开始地址</span></span>
<span class="line"><span>    retadrs = newkmvd-&amp;gt;kva_start;</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    knl_spinunlock(&amp;vma-&amp;gt;vs_lock);</span></span>
<span class="line"><span>    return retadrs;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//分配虚拟地址空间的接口</span></span>
<span class="line"><span>adr_t vma_new_vadrs(mmadrsdsc_t *mm, adr_t start, size_t vassize, u64_t vaslimits, u32_t vastype)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (NULL == mm || 1 &amp;gt; vassize)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (NULL != start)</span></span>
<span class="line"><span>    {//进行参数检查，开始地址要和页面（4KB）对齐，结束地址不能超过整个虚拟地址空间</span></span>
<span class="line"><span>        if (((start &amp; 0xfff) != 0) || (0x1000 &amp;gt; start) || (USER_VIRTUAL_ADDRESS_END &amp;lt; (start + vassize)))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return NULL;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用虚拟地址空间分配的核心函数</span></span>
<span class="line"><span>    return vma_new_vadrs_core(mm, start, VADSZ_ALIGN(vassize), vaslimits, vastype);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中依然是接口函数进行参数检查，然后调用核心函数完成实际的工作。在核心函数中，会调用vma_find_kmvarsdsc函数去查找virmemadrs_t结构中的所有kmvarsdsc_t结构，找出合适的虚拟地址区间。</p><p>需要注意的是， <strong>我们允许应用程序指定分配虚拟地址空间的开始地址，也可以由系统决定，但是应用程序指定的话，分配更容易失败，因为很可能指定的开始地址已经被占用了。</strong></p><p>接口的实现并不是很难，接下来我们继续完成核心实现。</p><h3 id="分配时查找虚拟地址区间" tabindex="-1">分配时查找虚拟地址区间 <a class="header-anchor" href="#分配时查找虚拟地址区间" aria-label="Permalink to &quot;分配时查找虚拟地址区间&quot;">​</a></h3><p>在前面的核心函数中我写上了vma_find_kmvarsdsc函数，但是我们并没有实现它，现在我们就来完成这项工作，主要是根据分配的开始地址和大小，在virmemadrs_t结构中查找相应的kmvarsdsc_t结构。</p><p>它是如何查找的呢？举个例子吧，比如virmemadrs_t结构中有两个kmvarsdsc_t结构，A_kmvarsdsc_t结构表示0x1000～0x4000的虚拟地址空间，B_kmvarsdsc_t结构表示0x7000～0x9000的虚拟地址空间。</p><p>这时，我们分配2KB的虚拟地址空间，vma_find_kmvarsdsc函数查找发现A_kmvarsdsc_t结构和B_kmvarsdsc_t结构之间正好有0x4000～0x7000的空间，刚好放得下0x2000大小的空间，于是这个函数就会返回A_kmvarsdsc_t结构，否则就会继续向后查找。</p><p>明白了原理，我们就来写代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//检查kmvarsdsc_t结构</span></span>
<span class="line"><span>kmvarsdsc_t *vma_find_kmvarsdsc_is_ok(virmemadrs_t *vmalocked, kmvarsdsc_t *curr, adr_t start, size_t vassize)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmvarsdsc_t *nextkmvd = NULL;</span></span>
<span class="line"><span>    adr_t newend = start + (adr_t)vassize;</span></span>
<span class="line"><span>    //如果curr不是最后一个先检查当前kmvarsdsc_t结构</span></span>
<span class="line"><span>    if (list_is_last(&amp;curr-&amp;gt;kva_list, &amp;vmalocked-&amp;gt;vs_list) == FALSE)</span></span>
<span class="line"><span>    {//就获取curr的下一个kmvarsdsc_t结构</span></span>
<span class="line"><span>        nextkmvd = list_next_entry(curr, kmvarsdsc_t, kva_list);</span></span>
<span class="line"><span>        //由系统动态决定分配虚拟空间的开始地址</span></span>
<span class="line"><span>        if (NULL == start)</span></span>
<span class="line"><span>        {//如果curr的结束地址加上分配的大小小于等于下一个kmvarsdsc_t结构的开始地址就返回curr</span></span>
<span class="line"><span>            if ((curr-&amp;gt;kva_end + (adr_t)vassize) &amp;lt;= nextkmvd-&amp;gt;kva_start)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return curr;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {//否则比较应用指定分配的开始、结束地址是不是在curr和下一个kmvarsdsc_t结构之间</span></span>
<span class="line"><span>            if ((curr-&amp;gt;kva_end &amp;lt;= start) &amp;&amp; (newend &amp;lt;= nextkmvd-&amp;gt;kva_start))</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return curr;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {//否则curr为最后一个kmvarsdsc_t结构</span></span>
<span class="line"><span>        if (NULL == start)</span></span>
<span class="line"><span>        {//curr的结束地址加上分配空间的大小是不是小于整个虚拟地址空间</span></span>
<span class="line"><span>            if ((curr-&amp;gt;kva_end + (adr_t)vassize) &amp;lt; vmalocked-&amp;gt;vs_isalcend)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return curr;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {//否则比较应用指定分配的开始、结束地址是不是在curr的结束地址和整个虚拟地址空间的结束地址之间</span></span>
<span class="line"><span>            if ((curr-&amp;gt;kva_end &amp;lt;= start) &amp;&amp; (newend &amp;lt; vmalocked-&amp;gt;vs_isalcend))</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return curr;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//查找kmvarsdsc_t结构</span></span>
<span class="line"><span>kmvarsdsc_t *vma_find_kmvarsdsc(virmemadrs_t *vmalocked, adr_t start, size_t vassize)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmvarsdsc_t *kmvdcurrent = NULL, *curr = vmalocked-&amp;gt;vs_currkmvdsc;</span></span>
<span class="line"><span>    adr_t newend = start + vassize;</span></span>
<span class="line"><span>    list_h_t *listpos = NULL;</span></span>
<span class="line"><span>    //分配的虚拟空间大小小于4KB不行</span></span>
<span class="line"><span>    if (0x1000 &amp;gt; vassize)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //将要分配虚拟地址空间的结束地址大于整个虚拟地址空间 不行</span></span>
<span class="line"><span>    if (newend &amp;gt; vmalocked-&amp;gt;vs_isalcend)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (NULL != curr)</span></span>
<span class="line"><span>    {//先检查当前kmvarsdsc_t结构行不行</span></span>
<span class="line"><span>        kmvdcurrent = vma_find_kmvarsdsc_is_ok(vmalocked, curr, start, vassize);</span></span>
<span class="line"><span>        if (NULL != kmvdcurrent)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return kmvdcurrent;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //遍历virmemadrs_t中的所有的kmvarsdsc_t结构</span></span>
<span class="line"><span>    list_for_each(listpos, &amp;vmalocked-&amp;gt;vs_list)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        curr = list_entry(listpos, kmvarsdsc_t, kva_list);</span></span>
<span class="line"><span>        //检查每个kmvarsdsc_t结构</span></span>
<span class="line"><span>        kmvdcurrent = vma_find_kmvarsdsc_is_ok(vmalocked, curr, start, vassize);</span></span>
<span class="line"><span>        if (NULL != kmvdcurrent)</span></span>
<span class="line"><span>        {//如果符合要求就返回</span></span>
<span class="line"><span>            return kmvdcurrent;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合前面的描述和代码注释，我们发现 <strong>vma_find_kmvarsdsc函数才是这个分配虚拟地址空间算法的核心实现</strong>，真的这么简单？是的，对分配虚拟地址空间，真的结束了。</p><p>不过，这个分配的虚拟地址空间可以使用吗？这个问题，等我们解决了虚拟地址空间的释放，再来处理。</p><h3 id="虚拟地址空间释放接口" tabindex="-1">虚拟地址空间释放接口 <a class="header-anchor" href="#虚拟地址空间释放接口" aria-label="Permalink to &quot;虚拟地址空间释放接口&quot;">​</a></h3><p>有分配就要有释放，否则再大的虚拟地址空间也会用完，下面我们就来研究如何释放一个虚拟地址空间。我们依然从设计接口开始，这次我们只需要释放的虚拟空间的开始地址和大小就行了。我们来写代码实现吧，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//释放虚拟地址空间的核心函数</span></span>
<span class="line"><span>bool_t vma_del_vadrs_core(mmadrsdsc_t *mm, adr_t start, size_t vassize)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    kmvarsdsc_t *newkmvd = NULL, *delkmvd = NULL;</span></span>
<span class="line"><span>    virmemadrs_t *vma = &amp;mm-&amp;gt;msd_virmemadrs;</span></span>
<span class="line"><span>    knl_spinlock(&amp;vma-&amp;gt;vs_lock);</span></span>
<span class="line"><span>    //查找要释放虚拟地址空间的kmvarsdsc_t结构</span></span>
<span class="line"><span>    delkmvd = vma_del_find_kmvarsdsc(vma, start, vassize);</span></span>
<span class="line"><span>    if (NULL == delkmvd)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //第一种情况要释放的虚拟地址空间正好等于查找的kmvarsdsc_t结构</span></span>
<span class="line"><span>    if ((delkmvd-&amp;gt;kva_start == start) &amp;&amp; (delkmvd-&amp;gt;kva_end == (start + (adr_t)vassize)))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //脱链</span></span>
<span class="line"><span>        list_del(&amp;delkmvd-&amp;gt;kva_list);</span></span>
<span class="line"><span>        //删除kmvarsdsc_t结构</span></span>
<span class="line"><span>        del_kmvarsdsc(delkmvd);</span></span>
<span class="line"><span>        vma-&amp;gt;vs_kmvdscnr--;</span></span>
<span class="line"><span>        rets = TRUE;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //第二种情况要释放的虚拟地址空间是在查找的kmvarsdsc_t结构的上半部分</span></span>
<span class="line"><span>    if ((delkmvd-&amp;gt;kva_start == start) &amp;&amp; (delkmvd-&amp;gt;kva_end &amp;gt; (start + (adr_t)vassize)))</span></span>
<span class="line"><span>    {    //所以直接把查找的kmvarsdsc_t结构的开始地址设置为释放虚拟地址空间的结束地址</span></span>
<span class="line"><span>        delkmvd-&amp;gt;kva_start = start + (adr_t)vassize;</span></span>
<span class="line"><span>        rets = TRUE;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //第三种情况要释放的虚拟地址空间是在查找的kmvarsdsc_t结构的下半部分</span></span>
<span class="line"><span>    if ((delkmvd-&amp;gt;kva_start &amp;lt; start) &amp;&amp; (delkmvd-&amp;gt;kva_end == (start + (adr_t)vassize)))</span></span>
<span class="line"><span>    {//所以直接把查找的kmvarsdsc_t结构的结束地址设置为释放虚拟地址空间的开始地址</span></span>
<span class="line"><span>        delkmvd-&amp;gt;kva_end = start;</span></span>
<span class="line"><span>        rets = TRUE;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //第四种情况要释放的虚拟地址空间是在查找的kmvarsdsc_t结构的中间</span></span>
<span class="line"><span>    if ((delkmvd-&amp;gt;kva_start &amp;lt; start) &amp;&amp; (delkmvd-&amp;gt;kva_end &amp;gt; (start + (adr_t)vassize)))</span></span>
<span class="line"><span>    {//所以要再新建一个kmvarsdsc_t结构来处理释放虚拟地址空间之后的下半虚拟部分地址空间</span></span>
<span class="line"><span>        newkmvd = new_kmvarsdsc();</span></span>
<span class="line"><span>        if (NULL == newkmvd)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            rets = FALSE;</span></span>
<span class="line"><span>            goto out;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //让新的kmvarsdsc_t结构指向查找的kmvarsdsc_t结构的后半部分虚拟地址空间</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_end = delkmvd-&amp;gt;kva_end;</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_start = start + (adr_t)vassize;</span></span>
<span class="line"><span>        //和查找到的kmvarsdsc_t结构保持一致</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_limits = delkmvd-&amp;gt;kva_limits;</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_maptype = delkmvd-&amp;gt;kva_maptype;</span></span>
<span class="line"><span>        newkmvd-&amp;gt;kva_mcstruct = vma;</span></span>
<span class="line"><span>        delkmvd-&amp;gt;kva_end = start;</span></span>
<span class="line"><span>        //加入链表</span></span>
<span class="line"><span>        list_add(&amp;newkmvd-&amp;gt;kva_list, &amp;delkmvd-&amp;gt;kva_list);</span></span>
<span class="line"><span>        vma-&amp;gt;vs_kmvdscnr++;</span></span>
<span class="line"><span>        //是否为最后一个kmvarsdsc_t结构</span></span>
<span class="line"><span>        if (list_is_last(&amp;newkmvd-&amp;gt;kva_list, &amp;vma-&amp;gt;vs_list) == TRUE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            vma-&amp;gt;vs_endkmvdsc = newkmvd;</span></span>
<span class="line"><span>            vma-&amp;gt;vs_currkmvdsc = newkmvd;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            vma-&amp;gt;vs_currkmvdsc = newkmvd;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        rets = TRUE;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = FALSE;</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    knl_spinunlock(&amp;vma-&amp;gt;vs_lock);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放虚拟地址空间的接口</span></span>
<span class="line"><span>bool_t vma_del_vadrs(mmadrsdsc_t *mm, adr_t start, size_t vassize)</span></span>
<span class="line"><span>{    //对参数进行检查</span></span>
<span class="line"><span>    if (NULL == mm || 1 &amp;gt; vassize || NULL == start)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用核心处理函数</span></span>
<span class="line"><span>    return vma_del_vadrs_core(mm, start, VADSZ_ALIGN(vassize));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合上面的代码和注释，我相信你能够看懂。需要注意的是，处理释放虚拟地址空间的四种情况。</p><p>因为分配虚拟地址空间时，我们 <strong>为了节约kmvarsdsc_t结构占用的内存空间</strong>，规定只要分配的虚拟地址空间上一个虚拟地址空间是连续且类型相同的，我们就 <strong>借用</strong> 上一个kmvarsdsc_t结构，而不是重新分配一个kmvarsdsc_t结构表示新分配的虚拟地址空间。</p><p>你可以想像一下，一个应用每次分配一个页面的虚拟地址空间，不停地分配，而每个新分配的虚拟地址空间都有一个kmvarsdsc_t结构对应，这样物理内存将很快被耗尽。</p><h3 id="释放时查找虚拟地址区间" tabindex="-1">释放时查找虚拟地址区间 <a class="header-anchor" href="#释放时查找虚拟地址区间" aria-label="Permalink to &quot;释放时查找虚拟地址区间&quot;">​</a></h3><p>上面释放虚拟地址空间的核心处理函数vma_del_vadrs_core函数中，调用了vma_del_find_kmvarsdsc函数，用于查找要释放虚拟地址空间的kmvarsdsc_t结构，可是为什么不用分配虚拟地址空间时那个查找函数（vma_find_kmvarsdsc）呢？</p><p>这是因为释放时查找的要求不一样。释放时仅仅需要保证，释放的虚拟地址空间的开始地址和结束地址，他们落在某一个kmvarsdsc_t结构表示的虚拟地址区间就行，所以我们还是另写一个函数，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kmvarsdsc_t *vma_del_find_kmvarsdsc(virmemadrs_t *vmalocked, adr_t start, size_t vassize)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmvarsdsc_t *curr = vmalocked-&amp;gt;vs_currkmvdsc;</span></span>
<span class="line"><span>    adr_t newend = start + (adr_t)vassize;</span></span>
<span class="line"><span>    list_h_t *listpos = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (NULL != curr)</span></span>
<span class="line"><span>    {//释放的虚拟地址空间落在了当前kmvarsdsc_t结构表示的虚拟地址区间</span></span>
<span class="line"><span>        if ((curr-&amp;gt;kva_start) &amp;lt;= start &amp;&amp; (newend &amp;lt;= curr-&amp;gt;kva_end))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return curr;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //遍历所有的kmvarsdsc_t结构</span></span>
<span class="line"><span>    list_for_each(listpos, &amp;vmalocked-&amp;gt;vs_list)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        curr = list_entry(listpos, kmvarsdsc_t, kva_list);</span></span>
<span class="line"><span>        //释放的虚拟地址空间是否落在了其中的某个kmvarsdsc_t结构表示的虚拟地址区间</span></span>
<span class="line"><span>        if ((start &amp;gt;= curr-&amp;gt;kva_start) &amp;&amp; (newend &amp;lt;= curr-&amp;gt;kva_end))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return curr;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>释放时，查找虚拟地址区间的函数非常简单，仅仅是检查释放的虚拟地址空间是否落在查找kmvarsdsc_t结构表示的虚拟地址区间中，而可能的四种变换形式，交给核心释放函数处理。到这里，我们释放虚拟地址空间的功能就实现了。</p><h2 id="测试环节-虚拟空间能正常访问么" tabindex="-1">测试环节：虚拟空间能正常访问么？ <a class="header-anchor" href="#测试环节-虚拟空间能正常访问么" aria-label="Permalink to &quot;测试环节：虚拟空间能正常访问么？&quot;">​</a></h2><p>我们已经实现了虚拟地址空间的分配和释放，但是我们从未访问过分配的虚拟地址空间，也不知道能不能访问，会有什么我们没有预想到的结果。保险起见，我们这就进入测试环节，试一试访问一下分配的虚拟地址空间。</p><h3 id="准备工作" tabindex="-1">准备工作 <a class="header-anchor" href="#准备工作" aria-label="Permalink to &quot;准备工作&quot;">​</a></h3><p>想要访问一个虚拟地址空间，当然需要先分配一个虚拟地址空间，所以我们要做点准备工作，写点测试代码，分配一个虚拟地址空间并访问它，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//测试函数</span></span>
<span class="line"><span>void test_vadr()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//分配一个0x1000大小的虚拟地址空间</span></span>
<span class="line"><span>    adr_t vadr = vma_new_vadrs(&amp;initmmadrsdsc, NULL, 0x1000, 0, 0);</span></span>
<span class="line"><span>    //返回NULL表示分配失败</span></span>
<span class="line"><span>    if(NULL == vadr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kprint(&quot;分配虚拟地址空间失败\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //在刷屏幕上打印分配虚拟地址空间的开始地址</span></span>
<span class="line"><span>    kprint(&quot;分配虚拟地址空间地址:%x\\n&quot;, vadr);</span></span>
<span class="line"><span>    kprint(&quot;开始写入分配虚拟地址空间\\n&quot;);</span></span>
<span class="line"><span>    //访问虚拟地址空间，把这空间全部设置为0</span></span>
<span class="line"><span>    hal_memset((void*)vadr, 0, 0x1000);</span></span>
<span class="line"><span>    kprint(&quot;结束写入分配虚拟地址空间\\n&quot;);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void init_kvirmemadrs()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    //调用测试函数</span></span>
<span class="line"><span>    test_vadr();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你大概已经猜到，这个在init_kvirmemadrs函数的最后调用的test_vadr函数，一旦执行，一定会发生异常。为了显示这个异常，我们要在异常分发器函数中写点代码。代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cosmos/hal/x86/halintupt.c</span></span>
<span class="line"><span>void hal_fault_allocator(uint_t faultnumb, void *krnlsframp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //打印异常号</span></span>
<span class="line"><span>    kprint(&quot;faultnumb is :%d\\n&quot;, faultnumb);</span></span>
<span class="line"><span>    //如果异常号等于14则是内存缺页异常</span></span>
<span class="line"><span>    if (faultnumb == 14)</span></span>
<span class="line"><span>    {//打印缺页地址，这地址保存在CPU的CR2寄存器中</span></span>
<span class="line"><span>        kprint(&quot;异常地址:%x,此地址禁止访问\\n&quot;, read_cr2());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //死机，不让这个函数返回了</span></span>
<span class="line"><span>    die(0);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码非常简单，下面我们来测试一下，看看最终结果。</p><h3 id="异常情况与原因分析" tabindex="-1">异常情况与原因分析 <a class="header-anchor" href="#异常情况与原因分析" aria-label="Permalink to &quot;异常情况与原因分析&quot;">​</a></h3><p>所有的代码已经准备好了，我们进入Cosmos目录下执行make vboxtest指令，等Cosmos跑起来的时候，你会看到如下所示的情况。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/388167/85dbd081f523fdedb71c34f091989eb1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/388167/85dbd081f523fdedb71c34f091989eb1.jpg" alt=""></a></p><p>上图中，显示我们分配了0x1000大小的虚拟地址空间，其虚拟地址是0x5000，接着对这个地址进行访问，最后产生了缺页异常，缺页的地址正是我们分配的虚拟空间的开始地址。</p><p>为什么会发生这个缺页异常呢？因为我们访问了一个虚拟地址，这个虚拟地址由CPU发送给MMU，而MMU无法把它转换成对应的物理地址，CPU的那条访存指令无法执行了，因此就产生一个缺页异常。于是，CPU跳转到缺页异常处理的入口地址（kernel.asm文件中的exc_page_fault标号处）开始执行代码，处理这个缺页异常。</p><p>因为我们仅仅是分配了一个虚拟地址空间，就对它进行访问，所以才会缺页。既然我们并没有为这个虚拟地址空间分配任何物理内存页面，建立对应的MMU页表，那我们可不可以分配虚拟地址空间时，就分配物理内存页面并建立好对应的MMU页表呢？</p><p>这当然可以解决问题，但是现实中往往是等到发生缺页异常了，才分配物理内存页面，建立对应的MMU页表。 <strong>这种延迟内存分配技术在系统工程中非常有用，因为它能最大限度的节约物理内存。</strong> 分配的虚拟地址空间，只有实际访问到了才分配对应的物理内存页面。</p><h3 id="开始处理缺页异常" tabindex="-1">开始处理缺页异常 <a class="header-anchor" href="#开始处理缺页异常" aria-label="Permalink to &quot;开始处理缺页异常&quot;">​</a></h3><p>准确地说，缺页异常是从kernel.asm文件中的exc_page_fault标号处开始，但它只是保存了CPU的上下文，然后调用了内核的通用异常分发器函数，最后由异常分发器函数调用不同的异常处理函数，如果是缺页异常，就要调用缺页异常处理的接口函数。</p><p>这个函数之前还没有写呢，下面我们一起来实现它，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//缺页异常处理接口</span></span>
<span class="line"><span>sint_t vma_map_fairvadrs(mmadrsdsc_t *mm, adr_t vadrs)</span></span>
<span class="line"><span>{//对参数进行检查</span></span>
<span class="line"><span>    if ((0x1000 &amp;gt; vadrs) || (USER_VIRTUAL_ADDRESS_END &amp;lt; vadrs) || (NULL == mm))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return -EPARAM;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //进行缺页异常的核心处理</span></span>
<span class="line"><span>    return vma_map_fairvadrs_core(mm, vadrs);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//由异常分发器调用的接口</span></span>
<span class="line"><span>sint_t krluserspace_accessfailed(adr_t fairvadrs)</span></span>
<span class="line"><span>{//这里应该获取当前进程的mm，但是现在我们没有进程，才initmmadrsdsc代替</span></span>
<span class="line"><span>    mmadrsdsc_t* mm = &amp;initmmadrsdsc;</span></span>
<span class="line"><span>    //应用程序的虚拟地址不可能大于USER_VIRTUAL_ADDRESS_END</span></span>
<span class="line"><span>    if(USER_VIRTUAL_ADDRESS_END &amp;lt; fairvadrs)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return -EACCES;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return vma_map_fairvadrs(mm, fairvadrs);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的接口函数非常简单，不过我们要在cosmos/hal/x86/halintupt.c文件的异常分发器函数中来调用它，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void hal_fault_allocator(uint_t faultnumb, void *krnlsframp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    adr_t fairvadrs;</span></span>
<span class="line"><span>    kprint(&quot;faultnumb is :%d\\n&quot;, faultnumb);</span></span>
<span class="line"><span>    if (faultnumb == 14)</span></span>
<span class="line"><span>    {    //获取缺页的地址</span></span>
<span class="line"><span>        fairvadrs = (adr_t)read_cr2();</span></span>
<span class="line"><span>        kprint(&quot;异常地址:%x,此地址禁止访问\\n&quot;, fairvadrs);</span></span>
<span class="line"><span>        if (krluserspace_accessfailed(fairvadrs) != 0)</span></span>
<span class="line"><span>        {//处理缺页失败就死机</span></span>
<span class="line"><span>            system_error(&quot;缺页处理失败\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //成功就返回</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    die(0);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接口函数和调用流程已经写好了，下面就要真正开始处理缺页了。</p><h3 id="处理缺页异常的核心" tabindex="-1">处理缺页异常的核心 <a class="header-anchor" href="#处理缺页异常的核心" aria-label="Permalink to &quot;处理缺页异常的核心&quot;">​</a></h3><p>在前面缺页异常处理接口时，调用了vma_map_fairvadrs_core函数，来进行缺页异常的核心处理、那缺页异常处理究竟有哪些操作呢？</p><p>这里给你留个悬念，我先来写个函数，你可以结合自己的观察，想想它做了什么，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sint_t vma_map_fairvadrs_core(mmadrsdsc_t *mm, adr_t vadrs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    sint_t rets = FALSE;</span></span>
<span class="line"><span>    adr_t phyadrs = NULL;</span></span>
<span class="line"><span>    virmemadrs_t *vma = &amp;mm-&amp;gt;msd_virmemadrs;</span></span>
<span class="line"><span>    kmvarsdsc_t *kmvd = NULL;</span></span>
<span class="line"><span>    kvmemcbox_t *kmbox = NULL;</span></span>
<span class="line"><span>    knl_spinlock(&amp;vma-&amp;gt;vs_lock);</span></span>
<span class="line"><span>    //查找对应的kmvarsdsc_t结构</span></span>
<span class="line"><span>    kmvd = vma_map_find_kmvarsdsc(vma, vadrs);</span></span>
<span class="line"><span>    if (NULL == kmvd)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = -EFAULT;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //返回kmvarsdsc_t结构下对应kvmemcbox_t结构</span></span>
<span class="line"><span>    kmbox = vma_map_retn_kvmemcbox(kmvd);</span></span>
<span class="line"><span>    if (NULL == kmbox)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = -ENOMEM;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //分配物理内存页面并建立MMU页表</span></span>
<span class="line"><span>    phyadrs = vma_map_phyadrs(mm, kmvd, vadrs, (0 | PML4E_US | PML4E_RW | PML4E_P));</span></span>
<span class="line"><span>    if (NULL == phyadrs)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = -ENOMEM;</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = EOK;</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    knl_spinunlock(&amp;vma-&amp;gt;vs_lock);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过对上述代码的观察，你就能发现，以上代码中做了三件事。</p><p>首先，查找缺页地址对应的kmvarsdsc_t结构，没找到说明没有分配该虚拟地址空间，那属于非法访问不予处理；然后，查找kmvarsdsc_t结构下面的对应kvmemcbox_t结构，它是用来挂载物理内存页面的；最后，分配物理内存页面并建立MMU页表映射关系。</p><p>下面我们分别来实现这三个步骤。</p><h3 id="缺页地址是否合法" tabindex="-1">缺页地址是否合法 <a class="header-anchor" href="#缺页地址是否合法" aria-label="Permalink to &quot;缺页地址是否合法&quot;">​</a></h3><p>要想判断一个缺页地址是否合法，我们就要确定它是不是已经分配的虚拟地址，也就是看这个虚拟地址是不是会落在某个kmvarsdsc_t结构表示的虚拟地址区间。</p><p>因此，我们要去查找相应的kmvarsdsc_t结构，如果没有找到则虚拟地址没有分配，即这个缺页地址不合法。这个查找kmvarsdsc_t结构的函数可以这样写。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kmvarsdsc_t *vma_map_find_kmvarsdsc(virmemadrs_t *vmalocked, adr_t vadrs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t *pos = NULL;</span></span>
<span class="line"><span>    kmvarsdsc_t *curr = vmalocked-&amp;gt;vs_currkmvdsc;</span></span>
<span class="line"><span>    //看看上一次刚刚被操作的kmvarsdsc_t结构</span></span>
<span class="line"><span>    if (NULL != curr)</span></span>
<span class="line"><span>    {//虚拟地址是否落在kmvarsdsc_t结构表示的虚拟地址区间</span></span>
<span class="line"><span>        if ((vadrs &amp;gt;= curr-&amp;gt;kva_start) &amp;&amp; (vadrs &amp;lt; curr-&amp;gt;kva_end))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return curr;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //遍历每个kmvarsdsc_t结构</span></span>
<span class="line"><span>    list_for_each(pos, &amp;vmalocked-&amp;gt;vs_list)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        curr = list_entry(pos, kmvarsdsc_t, kva_list);</span></span>
<span class="line"><span>        //虚拟地址是否落在kmvarsdsc_t结构表示的虚拟地址区间</span></span>
<span class="line"><span>        if ((vadrs &amp;gt;= curr-&amp;gt;kva_start) &amp;&amp; (vadrs &amp;lt; curr-&amp;gt;kva_end))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return curr;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个函数非常简单，核心逻辑就是用虚拟地址和kmvarsdsc_t结构中的数据做比较，大于等于kmvarsdsc_t结构的开始地址并且小于kmvarsdsc_t结构的结束地址，就行了。</p><h3 id="建立kvmemcbox-t结构" tabindex="-1">建立kvmemcbox_t结构 <a class="header-anchor" href="#建立kvmemcbox-t结构" aria-label="Permalink to &quot;建立kvmemcbox\\_t结构&quot;">​</a></h3><p>kvmemcbox_t结构可以用来挂载物理内存页面msadsc_t结构，而这个msadsc_t结构是由虚拟地址区间kmvarsdsc_t结构代表的虚拟空间所映射的物理内存页面。一个kmvarsdsc_t结构，必须要有一个kvmemcbox_t结构，才能分配物理内存。除了这个功能，kvmemcbox_t结构还可以在内存共享的时候使用。</p><p>现在我们一起来写个函数，实现建立kvmemcbox_t结构，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kvmemcbox_t *vma_map_retn_kvmemcbox(kmvarsdsc_t *kmvd)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kvmemcbox_t *kmbox = NULL;</span></span>
<span class="line"><span>    //如果kmvarsdsc_t结构中已经存在了kvmemcbox_t结构，则直接返回</span></span>
<span class="line"><span>    if (NULL != kmvd-&amp;gt;kva_kvmbox)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return kmvd-&amp;gt;kva_kvmbox;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //新建一个kvmemcbox_t结构</span></span>
<span class="line"><span>    kmbox = knl_get_kvmemcbox();</span></span>
<span class="line"><span>    if (NULL == kmbox)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //指向这个新建的kvmemcbox_t结构</span></span>
<span class="line"><span>    kmvd-&amp;gt;kva_kvmbox = kmbox;</span></span>
<span class="line"><span>    return kmvd-&amp;gt;kva_kvmbox;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码非常简单，knl_get_kvmemcbox函数就是调用kmsob_new函数分配一个kvmemcbox_t结构大小的内存空间对象，然后其中实例化kvmemcbox_t结构的变量。</p><h3 id="映射物理内存页面" tabindex="-1">映射物理内存页面 <a class="header-anchor" href="#映射物理内存页面" aria-label="Permalink to &quot;映射物理内存页面&quot;">​</a></h3><p>好，现在我们正式给虚拟地址分配对应的物理内存页面，建立对应的MMU页表，使虚拟地址到物理地址可以转换成功，数据终于能写入到物理内存之中了。</p><p>这个步骤完成，就意味着缺页处理完成了，我们来写代码吧。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>adr_t vma_map_msa_fault(mmadrsdsc_t *mm, kvmemcbox_t *kmbox, adr_t vadrs, u64_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    msadsc_t *usermsa;</span></span>
<span class="line"><span>    adr_t phyadrs = NULL;</span></span>
<span class="line"><span>   //分配一个物理内存页面，挂载到kvmemcbox_t中，并返回对应的msadsc_t结构</span></span>
<span class="line"><span>    usermsa = vma_new_usermsa(mm, kmbox);</span></span>
<span class="line"><span>    if (NULL == usermsa)</span></span>
<span class="line"><span>    {//没有物理内存页面返回NULL表示失败</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //获取msadsc_t对应的内存页面的物理地址</span></span>
<span class="line"><span>    phyadrs = msadsc_ret_addr(usermsa);</span></span>
<span class="line"><span>    //建立MMU页表完成虚拟地址到物理地址的映射</span></span>
<span class="line"><span>    if (hal_mmu_transform(&amp;mm-&amp;gt;msd_mmu, vadrs, phyadrs, flags) == TRUE)</span></span>
<span class="line"><span>    {//映射成功则返回物理地址</span></span>
<span class="line"><span>        return phyadrs;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //映射失败就要先释放分配的物理内存页面</span></span>
<span class="line"><span>    vma_del_usermsa(mm, kmbox, usermsa, phyadrs);</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//接口函数</span></span>
<span class="line"><span>adr_t vma_map_phyadrs(mmadrsdsc_t *mm, kmvarsdsc_t *kmvd, adr_t vadrs, u64_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kvmemcbox_t *kmbox = kmvd-&amp;gt;kva_kvmbox;</span></span>
<span class="line"><span>    if (NULL == kmbox)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用核心函数，flags表示页表条目中的相关权限、存在、类型等位段</span></span>
<span class="line"><span>    return vma_map_msa_fault(mm, kmbox, vadrs, flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，调用vma_map_msa_fault函数做实际的工作。首先，它会调用vma_new_usermsa函数，在vma_new_usermsa函数内部调用了我们前面学过的页面内存管理接口，分配一个物理内存页面并把对应的msadsc_t结构挂载到kvmemcbox_t结构上。</p><p>接着获取msadsc_t结构对应内存页面的物理地址，最后是调用hal_mmu_transform函数完成虚拟地址到物理地址的映射工作，它主要是建立MMU页表，在cosmos/hal/x86/halmmu.c文件中，我已经帮你写好了代码，我相信你结合前面MMU相关的课程，你一定能看懂。</p><p>vma_map_phyadrs函数一旦成功返回，就会随着原有的代码路径层层返回。至此，处理缺页异常就结束了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天这节课我们学习了如何实现虚拟内存的分配与释放，现在我把重点为你梳理一下。</p><p>首先，我们实现了虚拟地址空间的分配与释放。这是虚拟内存管理的核心功能，通过查找地址区间结构来确定哪些虚拟地址空间已经分配或者空闲。</p><p>然后我们解决了缺页异常处理问题。我们分配一段虚拟地址空间，并没有分配对应的物理内存页面，而是等到真正访问虚拟地址空间时，才触发了缺页异常。这时，我们再来处理缺页异常中分配物理内存页面的工作，建立对应的MMU页表映射关系。 <strong>这种延迟分配技术可以有效节约物理内存。</strong></p><p>至此，从物理内存页面管理到内存对象管理再到虚拟内存管理，我们一层一层地建好了Cosmos的内存管理组件。内存可以说是专栏的重中之重，以后Cosmos内核的其它组件，也都要依赖于内存管理组件。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问，x86 CPU的缺页异常，是第几号异常？缺页的地址保存在哪个寄存器中？</p><p>欢迎你在留言区跟我交流互动，也感谢你坚持不懈跟我学习，如果你身边有对内存管理感兴趣的朋友，记得把今天这节课分享给他。</p><p>好，我是LMOS，我们下节课见。</p>`,87)])])}const k=a(e,[["render",t]]);export{_ as __pageData,k as default};
