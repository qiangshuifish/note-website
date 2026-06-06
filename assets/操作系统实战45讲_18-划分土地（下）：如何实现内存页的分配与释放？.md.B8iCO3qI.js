import{_ as a,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const f=JSON.parse('{"title":"18 | 划分土地（下）：如何实现内存页的分配与释放？","description":"","frontmatter":{},"headers":[{"level":2,"title":"内存页的分配","slug":"内存页的分配","link":"#内存页的分配","children":[]},{"level":2,"title":"内存页的释放","slug":"内存页的释放","link":"#内存页的释放","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/18-划分土地（下）：如何实现内存页的分配与释放？.md","filePath":"操作系统实战45讲/18-划分土地（下）：如何实现内存页的分配与释放？.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/18-划分土地（下）：如何实现内存页的分配与释放？.md"};function t(m,s,i,c,r,_){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_18-划分土地-下-如何实现内存页的分配与释放" tabindex="-1">18 | 划分土地（下）：如何实现内存页的分配与释放？ <a class="header-anchor" href="#_18-划分土地-下-如何实现内存页的分配与释放" aria-label="Permalink to &quot;18 | 划分土地（下）：如何实现内存页的分配与释放？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>通过前面两节课的学习，我们已经组织好了内存页，也初始化了内存页和内存区。我们前面做了这么多准备工作，就是为了实现分配和释放内存页面，达到内存管理的目的。</p><p>那有了前面的基础，我想你自己也能大概实现这个分配和释放的代码。但是，根据前面我们设计的数据结构和对其初始化的工作，估计你也可以隐约感觉到，我们的内存管理的算法还是有一点点难度的。</p><p>今天这节课，就让我们一起来实现这项富有挑战性的任务吧！这节课的配套代码，你可以通过 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson16~18/Cosmos" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="内存页的分配" tabindex="-1">内存页的分配 <a class="header-anchor" href="#内存页的分配" aria-label="Permalink to &quot;内存页的分配&quot;">​</a></h2><p>如果让你实现一次只分配一个页面，我相信这个问题很好解决，因为你只需要写一段循环代码，在其中遍历出一个空闲的msadsc_t结构，就可以返回了，这个算法就可以结束了。</p><p>但现实却不容许我们这么简单地处理问题，我们内存管理器要为内核、驱动，还有应用提供服务，它们对请求内存页面的多少、内存页面是不是连续，内存页面所处的物理地址都有要求。</p><p>这样一来，问题就复杂了。不过你也不必担心，我们可以从 <strong>内存分配的接口函数</strong> 下手。</p><p>下面我们根据上述要求来设计实现内存分配接口函数。我们还是先来建立一个新的C语言代码文件，在cosmos/hal/x86目录中建立一个memdivmer.c文件，在其中写一个内存分配接口函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//内存分配页面框架函数</span></span>
<span class="line"><span>msadsc_t *mm_divpages_fmwk(memmgrob_t *mmobjp, uint_t pages, uint_t *retrelpnr, uint_t mrtype, uint_t flgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //返回mrtype对应的内存区结构的指针</span></span>
<span class="line"><span>    memarea_t *marea = onmrtype_retn_marea(mmobjp, mrtype);</span></span>
<span class="line"><span>    if (NULL == marea)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *retrelpnr = 0;</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    uint_t retpnr = 0;</span></span>
<span class="line"><span>    //内存分配的核心函数</span></span>
<span class="line"><span>    msadsc_t *retmsa = mm_divpages_core(marea, pages, &amp;retpnr, flgs);</span></span>
<span class="line"><span>    if (NULL == retmsa)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *retrelpnr = 0;</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    *retrelpnr = retpnr;</span></span>
<span class="line"><span>    return retmsa;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//内存分配页面接口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//mmobjp-&amp;gt;内存管理数据结构指针</span></span>
<span class="line"><span>//pages-&amp;gt;请求分配的内存页面数</span></span>
<span class="line"><span>//retrealpnr-&amp;gt;存放实际分配内存页面数的指针</span></span>
<span class="line"><span>//mrtype-&amp;gt;请求的分配内存页面的内存区类型</span></span>
<span class="line"><span>//flgs-&amp;gt;请求分配的内存页面的标志位</span></span>
<span class="line"><span>msadsc_t *mm_division_pages(memmgrob_t *mmobjp, uint_t pages, uint_t *retrealpnr, uint_t mrtype, uint_t flgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (NULL == mmobjp || NULL == retrealpnr || 0 == mrtype)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint_t retpnr = 0;</span></span>
<span class="line"><span>    msadsc_t *retmsa = mm_divpages_fmwk(mmobjp, pages, &amp;retpnr, mrtype, flgs);</span></span>
<span class="line"><span>    if (NULL == retmsa)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *retrealpnr = 0;</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    *retrealpnr = retpnr;</span></span>
<span class="line"><span>    return retmsa;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们内存管理代码的结构是：接口函数调用框架函数，框架函数调用核心函数。可以发现，这个接口函数返回的是一个msadsc_t结构的指针，如果是多个页面返回的就是起始页面对应的msadsc_t结构的指针。</p><p>为什么不直接返回内存的物理地址呢？因为我们物理内存管理器是最底层的内存管理器，而上层代码中可能需要页面的相关信息，所以直接返回页面对应msadsc_t结构的指针。</p><p>还有一个参数是用于返回实际分配的页面数的。比如，内核功能代码请求分配三个页面，我们的内存管理器不能分配三个页面，只能分配两个或四个页面，这时内存管理器就会分配四个页面返回，retrealpnr指向的变量中就存放数字4，表示实际分配页面的数量。</p><p>有了内存分配接口、框架函数，下面我们来实现内存分配的核心函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool_t onmpgs_retn_bafhlst(memarea_t *malckp, uint_t pages, bafhlst_t **retrelbafh, bafhlst_t **retdivbafh)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取bafhlst_t结构数组的开始地址</span></span>
<span class="line"><span>    bafhlst_t *bafhstat = malckp-&amp;gt;ma_mdmdata.dm_mdmlielst;</span></span>
<span class="line"><span>    //根据分配页面数计算出分配页面在dm_mdmlielst数组中下标</span></span>
<span class="line"><span>    sint_t dividx = retn_divoder(pages);</span></span>
<span class="line"><span>    //从第dividx个数组元素开始搜索</span></span>
<span class="line"><span>    for (sint_t idx = dividx; idx &amp;lt; MDIVMER_ARR_LMAX; idx++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    //如果第idx个数组元素对应的一次可分配连续的页面数大于等于请求的页面数，且其中的可分配对象大于0则返回</span></span>
<span class="line"><span>        if (bafhstat[idx].af_oderpnr &amp;gt;= pages &amp;&amp; 0 &amp;lt; bafhstat[idx].af_fobjnr)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            //返回请求分配的bafhlst_t结构指针</span></span>
<span class="line"><span>            *retrelbafh = &amp;bafhstat[dividx];</span></span>
<span class="line"><span>            //返回实际分配的bafhlst_t结构指针</span></span>
<span class="line"><span>            *retdivbafh = &amp;bafhstat[idx];</span></span>
<span class="line"><span>            return TRUE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    *retrelbafh = NULL;</span></span>
<span class="line"><span>    *retdivbafh = NULL;</span></span>
<span class="line"><span>    return FALSE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>msadsc_t *mm_reldivpages_onmarea(memarea_t *malckp, uint_t pages, uint_t *retrelpnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bafhlst_t *retrelbhl = NULL, *retdivbhl = NULL;</span></span>
<span class="line"><span>    //根据页面数在内存区的m_mdmlielst数组中找出其中请求分配页面的bafhlst_t结构（retrelbhl）和实际要在其中分配页面的bafhlst_t结构(retdivbhl)</span></span>
<span class="line"><span>    bool_t rets = onmpgs_retn_bafhlst(malckp, pages, &amp;retrelbhl, &amp;retdivbhl);</span></span>
<span class="line"><span>    if (FALSE == rets)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *retrelpnr = 0;</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    uint_t retpnr = 0;</span></span>
<span class="line"><span>    //实际在bafhlst_t结构中分配页面</span></span>
<span class="line"><span>    msadsc_t *retmsa = mm_reldpgsdivmsa_bafhl(malckp, pages, &amp;retpnr, retrelbhl, retdivbhl);</span></span>
<span class="line"><span>    if (NULL == retmsa)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *retrelpnr = 0;</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    *retrelpnr = retpnr;</span></span>
<span class="line"><span>    return retmsa;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>msadsc_t *mm_divpages_core(memarea_t *mareap, uint_t pages, uint_t *retrealpnr, uint_t flgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t retpnr = 0;</span></span>
<span class="line"><span>    msadsc_t *retmsa = NULL;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    //内存区加锁</span></span>
<span class="line"><span>    knl_spinlock_cli(&amp;mareap-&amp;gt;ma_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    if (DMF_RELDIV == flgs)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //分配内存</span></span>
<span class="line"><span>        retmsa = mm_reldivpages_onmarea(mareap, pages, &amp;retpnr);</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    retmsa = NULL;</span></span>
<span class="line"><span>    retpnr = 0;</span></span>
<span class="line"><span>ret_step:</span></span>
<span class="line"><span>    //内存区解锁</span></span>
<span class="line"><span>    knl_spinunlock_sti(&amp;mareap-&amp;gt;ma_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    *retrealpnr = retpnr;</span></span>
<span class="line"><span>    return retmsa;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>很明显，上述代码中onmpgs_retn_bafhlst函数返回的两个bafhlst_t结构指针，若是相等的，则在mm_reldpgsdivmsa_bafhl函数中很容易处理，只要取出bafhlst_t结构中对应的msadsc_t结构返回就好了。</p><p>问题是很多时候它们不相等，这就要分隔连续的msadsc_t结构了，下面我们通过mm_reldpgsdivmsa_bafhl这个函数来处理这个问题，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool_t mrdmb_add_msa_bafh(bafhlst_t *bafhp, msadsc_t *msastat, msadsc_t *msaend)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //把一段连续的msadsc_t结构加入到它所对应的bafhlst_t结构中</span></span>
<span class="line"><span>    msastat-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_ODER;</span></span>
<span class="line"><span>    msastat-&amp;gt;md_odlink = msaend;</span></span>
<span class="line"><span>    msaend-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_BAFH;</span></span>
<span class="line"><span>    msaend-&amp;gt;md_odlink = bafhp;</span></span>
<span class="line"><span>    list_add(&amp;msastat-&amp;gt;md_list, &amp;bafhp-&amp;gt;af_frelst);</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_mobjnr++;</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_fobjnr++;</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>msadsc_t *mm_divpages_opmsadsc(msadsc_t *msastat, uint_t mnr)</span></span>
<span class="line"><span>{   //单个msadsc_t结构的情况</span></span>
<span class="line"><span>    if (mend == msastat)</span></span>
<span class="line"><span>    {//增加msadsc_t结构中分配计数，分配标志位设置为1</span></span>
<span class="line"><span>        msastat-&amp;gt;md_indxflgs.mf_uindx++;</span></span>
<span class="line"><span>        msastat-&amp;gt;md_phyadrs.paf_alloc = PAF_ALLOC;</span></span>
<span class="line"><span>        msastat-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_ODER;</span></span>
<span class="line"><span>        msastat-&amp;gt;md_odlink = mend;</span></span>
<span class="line"><span>        return msastat;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    msastat-&amp;gt;md_indxflgs.mf_uindx++;</span></span>
<span class="line"><span>    msastat-&amp;gt;md_phyadrs.paf_alloc = PAF_ALLOC;</span></span>
<span class="line"><span>    //多个msadsc_t结构的情况下，末端msadsc_t结构也设置已分配状态</span></span>
<span class="line"><span>    mend-&amp;gt;md_indxflgs.mf_uindx++;</span></span>
<span class="line"><span>    mend-&amp;gt;md_phyadrs.paf_alloc = PAF_ALLOC;</span></span>
<span class="line"><span>    msastat-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_ODER;</span></span>
<span class="line"><span>    msastat-&amp;gt;md_odlink = mend;</span></span>
<span class="line"><span>    return msastat;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t mm_retnmsaob_onbafhlst(bafhlst_t *bafhp, msadsc_t **retmstat, msadsc_t **retmend)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //取出一个msadsc_t结构</span></span>
<span class="line"><span>    msadsc_t *tmp = list_entry(bafhp-&amp;gt;af_frelst.next, msadsc_t, md_list);</span></span>
<span class="line"><span>    //从链表中删除</span></span>
<span class="line"><span>    list_del(&amp;tmp-&amp;gt;md_list);</span></span>
<span class="line"><span>    //减少bafhlst_t结构中的msadsc_t计数</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_mobjnr--;</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_fobjnr--;</span></span>
<span class="line"><span>    //返回msadsc_t结构</span></span>
<span class="line"><span>    *retmstat = tmp;</span></span>
<span class="line"><span>    //返回当前msadsc_t结构连续的那个结尾的msadsc_t结构</span></span>
<span class="line"><span>    *retmend = (msadsc_t *)tmp-&amp;gt;md_odlink;</span></span>
<span class="line"><span>    if (MF_OLKTY_BAFH == tmp-&amp;gt;md_indxflgs.mf_olkty)</span></span>
<span class="line"><span>    {//如果只单个msadsc_t结构，那就是它本身</span></span>
<span class="line"><span>        *retmend = tmp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>msadsc_t *mm_reldpgsdivmsa_bafhl(memarea_t *malckp, uint_t pages, uint_t *retrelpnr, bafhlst_t *relbfl, bafhlst_t *divbfl)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    msadsc_t *retmsa = NULL;</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    msadsc_t *retmstat = NULL, *retmend = NULL;</span></span>
<span class="line"><span>    //处理相等的情况</span></span>
<span class="line"><span>    if (relbfl == divbfl)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    //从bafhlst_t结构中获取msadsc_t结构的开始与结束地址</span></span>
<span class="line"><span>        rets = mm_retnmsaob_onbafhlst(relbfl, &amp;retmstat, &amp;retmend);</span></span>
<span class="line"><span>        //设置msadsc_t结构的相关信息表示已经删除</span></span>
<span class="line"><span>        retmsa = mm_divpages_opmsadsc(retmstat, relbfl-&amp;gt;af_oderpnr);</span></span>
<span class="line"><span>        //返回实际的分配页数</span></span>
<span class="line"><span>        *retrelpnr = relbfl-&amp;gt;af_oderpnr;</span></span>
<span class="line"><span>        return retmsa;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //处理不等的情况</span></span>
<span class="line"><span>    //从bafhlst_t结构中获取msadsc_t结构的开始与结束地址</span></span>
<span class="line"><span>    rets = mm_retnmsaob_onbafhlst(divbfl, &amp;retmstat, &amp;retmend);</span></span>
<span class="line"><span>     uint_t divnr = divbfl-&amp;gt;af_oderpnr;</span></span>
<span class="line"><span>     //从高bafhlst_t数组元素中向下遍历</span></span>
<span class="line"><span>    for (bafhlst_t *tmpbfl = divbfl - 1; tmpbfl &amp;gt;= relbfl; tmpbfl--)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //开始分割连续的msadsc_t结构，把剩下的一段连续的msadsc_t结构加入到对应该bafhlst_t结构中</span></span>
<span class="line"><span>        if (mrdmb_add_msa_bafh(tmpbfl, &amp;retmstat[tmpbfl-&amp;gt;af_oderpnr], (msadsc_t *)retmstat-&amp;gt;md_odlink) == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            system_error(&quot;mrdmb_add_msa_bafh fail\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        retmstat-&amp;gt;md_odlink = &amp;retmstat[tmpbfl-&amp;gt;af_oderpnr - 1];</span></span>
<span class="line"><span>        divnr -= tmpbfl-&amp;gt;af_oderpnr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    retmsa = mm_divpages_opmsadsc(retmstat, divnr);</span></span>
<span class="line"><span>    if (NULL == retmsa)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *retrelpnr = 0;</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    *retrelpnr = relbfl-&amp;gt;af_oderpnr;</span></span>
<span class="line"><span>    return retmsa;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个代码有点长，我写出了完成这个逻辑的所有函数，好像很难看懂。别怕，难懂很正常，因为这是一个分配算法的核心逻辑。你之所以看不懂只是因为不懂这个算法，之前我们确实也没提过这个算法。</p><p>下面我就举个例子来演绎一下这个算法，帮助你理解它。比如现在我们要分配一个页面，这个算法将执行如下步骤：</p><p>1.根据一个页面的请求，会返回m_mdmlielst数组中的第0个bafhlst_t结构。</p><p>2.如果第0个bafhlst_t结构中有msadsc_t结构就直接返回，若没有msadsc_t结构，就会继续查找m_mdmlielst数组中的第1个bafhlst_t结构。</p><p>3.如果第1个bafhlst_t结构中也没有msadsc_t结构，就会继续查找m_mdmlielst数组中的第2个bafhlst_t结构。</p><p>4.如果第2个bafhlst_t结构中有msadsc_t结构，记住第2个bafhlst_t结构中对应是4个连续的msadsc_t结构。这时让这4个连续的msadsc_t结构从第2个bafhlst_t结构中脱离。</p><p>5.把这4个连续的msadsc_t结构，对半分割成2个双msadsc_t结构，把其中一个双msadsc_t结构挂载到第1个bafhlst_t结构中。</p><p>6.把剩下一个双msadsc_t结构，继续对半分割成两个单msadsc_t结构，把其中一个单msadsc_t结构挂载到第0个bafhlst_t结构中，剩下一个单msadsc_t结构返回给请求者，完成内存分配。</p><p>我画幅图表示这个过程，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/385628/299b8f21c876a2b324da7a2974e8302a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/385628/299b8f21c876a2b324da7a2974e8302a.jpg" alt=""></a></p><p>代码、文字、图，三管齐下，你一看便明白了。</p><h2 id="内存页的释放" tabindex="-1">内存页的释放 <a class="header-anchor" href="#内存页的释放" aria-label="Permalink to &quot;内存页的释放&quot;">​</a></h2><p>理解了内存页的分配，掌握内存页的释放就是水到渠成的事儿。其实，内存页的释放就是内存页分配的逆向过程。我们从内存页分配过程了解到，可以一次分配一个或者多个页面，那么释放内存页也必须支持一次释放一个或者多个页面。</p><p>我们同样在cosmos/hal/x86/memdivmer.c文件中，写一个内存释放的接口函数和框架函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//释放内存页面核心</span></span>
<span class="line"><span>bool_t mm_merpages_core(memarea_t *marea, msadsc_t *freemsa, uint_t freepgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    //内存区加锁</span></span>
<span class="line"><span>    knl_spinlock_cli(&amp;marea-&amp;gt;ma_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    //针对一个内存区进行操作</span></span>
<span class="line"><span>    rets = mm_merpages_onmarea(marea, freemsa, freepgs);</span></span>
<span class="line"><span>    //内存区解锁</span></span>
<span class="line"><span>    knl_spinunlock_sti(&amp;marea-&amp;gt;ma_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放内存页面框架函数</span></span>
<span class="line"><span>bool_t mm_merpages_fmwk(memmgrob_t *mmobjp, msadsc_t *freemsa, uint_t freepgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取要释放msadsc_t结构所在的内存区</span></span>
<span class="line"><span>    memarea_t *marea = onfrmsa_retn_marea(mmobjp, freemsa, freepgs);</span></span>
<span class="line"><span>    if (NULL == marea)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //释放内存页面的核心函数</span></span>
<span class="line"><span>    bool_t rets = mm_merpages_core(marea, freemsa, freepgs);</span></span>
<span class="line"><span>    if (FALSE == rets)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//释放内存页面接口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//mmobjp-&amp;gt;内存管理数据结构指针</span></span>
<span class="line"><span>//freemsa-&amp;gt;释放内存页面对应的首个msadsc_t结构指针</span></span>
<span class="line"><span>//freepgs-&amp;gt;请求释放的内存页面数</span></span>
<span class="line"><span>bool_t mm_merge_pages(memmgrob_t *mmobjp, msadsc_t *freemsa, uint_t freepgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (NULL == mmobjp || NULL == freemsa || 1 &amp;gt; freepgs)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用释放内存页面的框架函数</span></span>
<span class="line"><span>    bool_t rets = mm_merpages_fmwk(mmobjp, freemsa, freepgs);</span></span>
<span class="line"><span>    if (FALSE == rets)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们的内存释放页面的代码的结构依然是：接口函数调用框架函数，框架函数调用核心函数，函数的返回值都是bool类型，即TRUE或者FALSE，来表示内存页面释放操作成功与否。</p><p>我们从框架函数中可以发现，内存区是由msadsc_t结构中获取的，因为之前该结构中保留了所在内存区的类型，所以可以查到并返回内存区。</p><p>在释放内存页面的核心mm_merpages_core函数中，会调用mm_merpages_onmarea函数，下面我们来实现这个函数，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sint_t mm_merpages_opmsadsc(bafhlst_t *bafh, msadsc_t *freemsa, uint_t freepgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    msadsc_t *fmend = (msadsc_t *)freemsa-&amp;gt;md_odlink;</span></span>
<span class="line"><span>    //处理只有一个单页的情况</span></span>
<span class="line"><span>    if (freemsa == fmend)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //页面的分配计数减1</span></span>
<span class="line"><span>        freemsa-&amp;gt;md_indxflgs.mf_uindx--;</span></span>
<span class="line"><span>        if (0 &amp;lt; freemsa-&amp;gt;md_indxflgs.mf_uindx)</span></span>
<span class="line"><span>        {//如果依然大于0说明它是共享页面 直接返回1指示不需要进行下一步操作</span></span>
<span class="line"><span>            return 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //设置页未分配的标志</span></span>
<span class="line"><span>        freemsa-&amp;gt;md_phyadrs.paf_alloc = PAF_NO_ALLOC;</span></span>
<span class="line"><span>        freemsa-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_BAFH;</span></span>
<span class="line"><span>        freemsa-&amp;gt;md_odlink = bafh;//指向所属的bafhlst_t结构</span></span>
<span class="line"><span>        //返回2指示需要进行下一步操作</span></span>
<span class="line"><span>        return 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //多个页面的起始页面和结束页面都要减一</span></span>
<span class="line"><span>    freemsa-&amp;gt;md_indxflgs.mf_uindx--;</span></span>
<span class="line"><span>    fmend-&amp;gt;md_indxflgs.mf_uindx--;</span></span>
<span class="line"><span>    //如果依然大于0说明它是共享页面 直接返回1指示不需要进行下一步操作</span></span>
<span class="line"><span>    if (0 &amp;lt; freemsa-&amp;gt;md_indxflgs.mf_uindx)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置起始、结束页页未分配的标志</span></span>
<span class="line"><span>    freemsa-&amp;gt;md_phyadrs.paf_alloc = PAF_NO_ALLOC;</span></span>
<span class="line"><span>    fmend-&amp;gt;md_phyadrs.paf_alloc = PAF_NO_ALLOC;</span></span>
<span class="line"><span>    freemsa-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_ODER;</span></span>
<span class="line"><span>    //起始页面指向结束页面</span></span>
<span class="line"><span>    freemsa-&amp;gt;md_odlink = fmend;</span></span>
<span class="line"><span>    fmend-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_BAFH;</span></span>
<span class="line"><span>    //结束页面指向所属的bafhlst_t结构</span></span>
<span class="line"><span>    fmend-&amp;gt;md_odlink = bafh;</span></span>
<span class="line"><span>    //返回2指示需要进行下一步操作</span></span>
<span class="line"><span>    return 2;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t onfpgs_retn_bafhlst(memarea_t *malckp, uint_t freepgs, bafhlst_t **retrelbf, bafhlst_t **retmerbf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取bafhlst_t结构数组的开始地址</span></span>
<span class="line"><span>    bafhlst_t *bafhstat = malckp-&amp;gt;ma_mdmdata.dm_mdmlielst;</span></span>
<span class="line"><span>    //根据分配页面数计算出分配页面在dm_mdmlielst数组中下标</span></span>
<span class="line"><span>    sint_t dividx = retn_divoder(freepgs);</span></span>
<span class="line"><span>    //返回请求释放的bafhlst_t结构指针</span></span>
<span class="line"><span>    *retrelbf = &amp;bafhstat[dividx];</span></span>
<span class="line"><span>    //返回最大释放的bafhlst_t结构指针</span></span>
<span class="line"><span>    *retmerbf = &amp;bafhstat[MDIVMER_ARR_LMAX - 1];</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t mm_merpages_onmarea(memarea_t *malckp, msadsc_t *freemsa, uint_t freepgs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bafhlst_t *prcbf = NULL;</span></span>
<span class="line"><span>    sint_t pocs = 0;</span></span>
<span class="line"><span>    bafhlst_t *retrelbf = NULL, *retmerbf = NULL;</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    //根据freepgs返回请求释放的和最大释放的bafhlst_t结构指针</span></span>
<span class="line"><span>    rets = onfpgs_retn_bafhlst(malckp, freepgs, &amp;retrelbf, &amp;retmerbf);</span></span>
<span class="line"><span>    //设置msadsc_t结构的信息，完成释放，返回1表示不需要下一步合并操作，返回2表示要进行合并操作</span></span>
<span class="line"><span>    sint_t mopms = mm_merpages_opmsadsc(retrelbf, freemsa, freepgs);</span></span>
<span class="line"><span>    if (2 == mopms)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //把msadsc_t结构进行合并然后加入对应bafhlst_t结构</span></span>
<span class="line"><span>        return mm_merpages_onbafhlst(freemsa, freepgs, retrelbf, retmerbf);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (1 == mopms)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return TRUE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return FALSE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了节约篇幅，也为了帮你抓住重点，这段代码我删除了很多检查错误的代码，你可以在 <a href="https://gitee.com/lmos/cosmos/blob/master/lesson16~18/Cosmos/hal/x86/memdivmer.c#L1117" target="_blank" rel="noreferrer">源代码</a> 中查看。</p><p>显然，在经过mm_merpages_opmsadsc函数操作之后，我们并没有将msadsc_t结构加入到对应的bafhlst_t结构中，这其实是在下一个函数完成的，那就是mm_merpages_onbafhlst这个函数。下面我们来实现它，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool_t mpobf_add_msadsc(bafhlst_t *bafhp, msadsc_t *freemstat, msadsc_t *freemend)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    freemstat-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_ODER;</span></span>
<span class="line"><span>    //设置起始页面指向结束页</span></span>
<span class="line"><span>    freemstat-&amp;gt;md_odlink = freemend;</span></span>
<span class="line"><span>    freemend-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_BAFH;</span></span>
<span class="line"><span>    //结束页面指向所属的bafhlst_t结构</span></span>
<span class="line"><span>    freemend-&amp;gt;md_odlink = bafhp;</span></span>
<span class="line"><span>    //把起始页面挂载到所属的bafhlst_t结构中</span></span>
<span class="line"><span>    list_add(&amp;freemstat-&amp;gt;md_list, &amp;bafhp-&amp;gt;af_frelst);</span></span>
<span class="line"><span>    //增加bafhlst_t结构的空闲页面对象和总的页面对象的计数</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_fobjnr++;</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_mobjnr++;</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t mm_merpages_onbafhlst(msadsc_t *freemsa, uint_t freepgs, bafhlst_t *relbf, bafhlst_t *merbf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    sint_t rets = 0;</span></span>
<span class="line"><span>    msadsc_t *mnxs = freemsa, *mnxe = &amp;freemsa[freepgs - 1];</span></span>
<span class="line"><span>    bafhlst_t *tmpbf = relbf;</span></span>
<span class="line"><span>    //从实际要开始遍历，直到最高的那个bafhlst_t结构</span></span>
<span class="line"><span>    for (; tmpbf &amp;lt; merbf; tmpbf++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //查看最大地址连续、且空闲msadsc_t结构，如释放的是第0个msadsc_t结构我们就去查找第1个msadsc_t结构是否空闲，且与第0个msadsc_t结构的地址是不是连续的</span></span>
<span class="line"><span>        rets = mm_find_cmsa2blk(tmpbf, &amp;mnxs, &amp;mnxe);</span></span>
<span class="line"><span>        if (1 == rets)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //把合并的msadsc_t结构（从mnxs到mnxe）加入到对应的bafhlst_t结构中</span></span>
<span class="line"><span>    if (mpobf_add_msadsc(tmpbf, mnxs, mnxe) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码的注释，已经写出了整个释放页面逻辑， <strong>最核心的还是要对空闲页面进行合并，合并成更大的连续的内存页面</strong>，这是这个释放算法的核心逻辑。</p><p>还是老规矩，我同样举个例子来演绎一下这个算法。比如，现在我们要释放一个页面，这个算法将执行如下步骤。</p><p>1.释放一个页面，会返回m_mdmlielst数组中的第0个bafhlst_t结构。</p><ol start="2"><li><p>设置这个页面对应的msadsc_t结构的相关信息，表示已经执行了释放操作。</p></li><li><p>开始查看第0个bafhlst_t结构中有没有空闲的msadsc_t，并且它和要释放的msadsc_t对应的物理地址是连续的。没有则把这个释放的msadsc_t挂载第0个bafhlst_t结构中，算法结束，否则进入下一步。</p></li><li><p>把第0个bafhlst_t结构中的msadsc_t结构拿出来与释放的msadsc_t结构，合并成2个连续且更大的msadsc_t。</p></li><li><p>继续查看第1个bafhlst_t结构中有没有空闲的msadsc_t，而且这个空闲msadsc_t要和上一步合并的2个msadsc_t对应的物理地址是连续的。没有则把这个合并的2个msadsc_t挂载第1个bafhlst_t结构中，算法结束，否则进入下一步。</p></li><li><p>把第1个bafhlst_t结构中的2个连续的msadsc_t结构，还有合并的2个地址连续的msadsc_t结构拿出来，合并成4个连续且更大的msadsc_t结构。</p></li><li><p>继续查看第2个bafhlst_t结构，有没有空闲的msadsc_t结构，并且它要和上一步合并的4个msadsc_t结构对应的物理地址是连续的。没有则把这个合并的4个msadsc_t挂载第2个bafhlst_t结构中，算法结束。</p></li></ol><p>上述步骤，我们只要在一个循环中执行就行。我用一幅图表示这个过程，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/385628/a280682b0ee533984c4yya14dee67834.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/385628/a280682b0ee533984c4yya14dee67834.jpg" alt=""></a></p><p>这个是不是很熟悉，这正是前面的内存分配图反过来了的结果。最终我们验证了，释放内存就是分配内存的逆向过程。</p><p>好了，到这里，一个优秀的物理内存页面管理器就实现了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天我们依赖 <a href="https://time.geekbang.org/column/article/384772" target="_blank" rel="noreferrer">上节课</a> 设计好的数据结构，实现了内存页面管理算法。下面来回顾一下本课的重点。</p><p>1.我们实现了内存分配接口、框架、核心处理函数，其分配算法是：如果能在dm_mdmlielst数组中找到对应请求页面数的msadsc_t结构就直接返回，如果没有就寻找下一个dm_mdmlielst数组中元素，依次迭代直到最大的dm_mdmlielst数组元素，然后依次对半分割，直到分割到请求的页面数为止。</p><p>2.对应于内存分配过程，我们实现了释放页面的接口、框架、核心处理函数，其释放算法则是 <strong>分配算法的逆向过程</strong>，会查找相邻且物理地址连续的msadsc_t结构，进行合并，合并工作也是迭代过程，直到合并到最大的连续msadsc_t结构或者后面不能合并为止，最后把这个合并到最大的连续msadsc_t结构，挂载到对应的dm_mdmlielst数组中。</p><p>你是不是感觉我们的内存管理器还有缺陷，这只能分配页面？是的，只能分配页面是不行的，你有什么更好的方案吗？下一课我们一起讨论。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在内存页面分配过程中，是怎样尽可能保证内存页面连续的呢？</p><p>欢迎你在留言区记录你的收获或疑问。如果这节课对你有启发，也欢迎分享给你的同事、朋友。</p><p>好，我是LMOS，我们下节课见！</p>`,58)])])}const o=a(e,[["render",t]]);export{f as __pageData,o as default};
