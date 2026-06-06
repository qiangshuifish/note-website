import{_ as a,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"17 | 划分土地（中）：如何实现内存页面初始化？","description":"","frontmatter":{},"headers":[{"level":2,"title":"初始化","slug":"初始化","link":"#初始化","children":[{"level":3,"title":"内存页结构初始化","slug":"内存页结构初始化","link":"#内存页结构初始化","children":[]},{"level":3,"title":"内存区结构初始化","slug":"内存区结构初始化","link":"#内存区结构初始化","children":[]},{"level":3,"title":"处理初始内存占用问题","slug":"处理初始内存占用问题","link":"#处理初始内存占用问题","children":[]},{"level":3,"title":"合并内存页到内存区","slug":"合并内存页到内存区","link":"#合并内存页到内存区","children":[]},{"level":3,"title":"初始化汇总","slug":"初始化汇总","link":"#初始化汇总","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/17-划分土地（中）：如何实现内存页面初始化？.md","filePath":"操作系统实战45讲/17-划分土地（中）：如何实现内存页面初始化？.md","lastUpdated":1779820584000}'),m={name:"操作系统实战45讲/17-划分土地（中）：如何实现内存页面初始化？.md"};function e(t,s,i,c,_,r){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_17-划分土地-中-如何实现内存页面初始化" tabindex="-1">17 | 划分土地（中）：如何实现内存页面初始化？ <a class="header-anchor" href="#_17-划分土地-中-如何实现内存页面初始化" aria-label="Permalink to &quot;17 | 划分土地（中）：如何实现内存页面初始化？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课，我们确定了用分页方式管理内存，并且一起动手设计了表示内存页、内存区相关的内存管理数据结构。不过，虽然内存管理相关的数据结构已经定义好了，但是我们还没有在内存中建立对应的 <strong>实例变量</strong>。</p><p>我们都知道，在代码中实际操作的数据结构必须在内存中有相应的变量，这节课我们就去建立对应的实例变量，并初始化它们。</p><h2 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h2><p>前面的课里，我们在hal层初始化中，初始化了从二级引导器中获取的内存布局信息，也就是那个 <strong>e820map_t数组</strong>，并把这个数组转换成了phymmarge_t结构数组，还对它做了排序。</p><p>但是，我们Cosmos物理内存管理器剩下的部分还没有完成初始化，下面我们就去实现它。</p><p>Cosmos的物理内存管理器，我们依然要放在Cosmos的hal层。</p><p>因为物理内存还和硬件平台相关，所以我们要在cosmos/hal/x86/目录下建立一个memmgrinit.c文件，在这个文件中写入一个Cosmos物理内存管理器初始化的大总管——init_memmgr函数，并在init_halmm函数中调用它，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cosmos/hal/x86/halmm.c中</span></span>
<span class="line"><span>//hal层的内存初始化函数</span></span>
<span class="line"><span>void init_halmm()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_phymmarge();</span></span>
<span class="line"><span>    init_memmgr();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//Cosmos物理内存管理器初始化</span></span>
<span class="line"><span>void init_memmgr()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化内存页结构msadsc_t</span></span>
<span class="line"><span>    //初始化内存区结构memarea_t</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据前面我们对内存管理相关数据结构的设计，你应该不难想到，在init_memmgr函数中应该要完成 <strong>内存页结构msadsc_t和内存区结构memarea_t的初始化</strong>，下面就分别搞定这两件事。</p><h3 id="内存页结构初始化" tabindex="-1">内存页结构初始化 <a class="header-anchor" href="#内存页结构初始化" aria-label="Permalink to &quot;内存页结构初始化&quot;">​</a></h3><p>内存页结构的初始化，其实就是初始化msadsc_t结构对应的变量。因为一个msadsc_t结构体变量代表一个物理内存页，而物理内存由多个页组成，所以最终会形成一个msadsc_t结构体数组。</p><p>这会让我们的工作变得简单，我们只需要找一个内存地址，作为msadsc_t结构体数组的开始地址，当然这个内存地址必须是可用的，而且之后内存空间足以存放msadsc_t结构体数组。</p><p>然后，我们要扫描phymmarge_t结构体数组中的信息，只要它的类型是可用内存，就建立一个msadsc_t结构体，并把其中的开始地址作为第一个页面地址。</p><p>接着，要给这个开始地址加上0x1000，如此循环，直到其结束地址。</p><p>当这个phymmarge_t结构体的地址区间，它对应的所有msadsc_t结构体都建立完成之后，就开始下一个phymmarge_t结构体。依次类推，最后，我们就能建好所有可用物理内存页面对应的msadsc_t结构体。</p><p>下面，我们去cosmos/hal/x86/目录下建立一个msadsc.c文件。在这里写下完成这些功能的代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void write_one_msadsc(msadsc_t *msap, u64_t phyadr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //对msadsc_t结构做基本的初始化，比如链表、锁、标志位</span></span>
<span class="line"><span>    msadsc_t_init(msap);</span></span>
<span class="line"><span>    //这是把一个64位的变量地址转换成phyadrflgs_t*类型方便取得其中的地址位段</span></span>
<span class="line"><span>    phyadrflgs_t *tmp = (phyadrflgs_t *)(&amp;phyadr);</span></span>
<span class="line"><span>    //把页的物理地址写入到msadsc_t结构中</span></span>
<span class="line"><span>    msap-&amp;gt;md_phyadrs.paf_padrs = tmp-&amp;gt;paf_padrs;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>u64_t init_msadsc_core(machbstart_t *mbsp, msadsc_t *msavstart, u64_t msanr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取phymmarge_t结构数组开始地址</span></span>
<span class="line"><span>    phymmarge_t *pmagep = (phymmarge_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_e820expadr);</span></span>
<span class="line"><span>    u64_t mdindx = 0;</span></span>
<span class="line"><span>    //扫描phymmarge_t结构数组</span></span>
<span class="line"><span>    for (u64_t i = 0; i &amp;lt; mbsp-&amp;gt;mb_e820exnr; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //判断phymmarge_t结构的类型是不是可用内存</span></span>
<span class="line"><span>        if (PMR_T_OSAPUSERRAM == pmagep[i].pmr_type)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            //遍历phymmarge_t结构的地址区间</span></span>
<span class="line"><span>            for (u64_t start = pmagep[i].pmr_saddr; start &amp;lt; pmagep[i].pmr_end; start += 4096)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                //每次加上4KB-1比较是否小于等于phymmarge_t结构的结束地址</span></span>
<span class="line"><span>                if ((start + 4096 - 1) &amp;lt;= pmagep[i].pmr_end)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    //与当前地址为参数写入第mdindx个msadsc结构</span></span>
<span class="line"><span>                    write_one_msadsc(&amp;msavstart[mdindx], start);</span></span>
<span class="line"><span>                    mdindx++;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return mdindx;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void init_msadsc()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t coremdnr = 0, msadscnr = 0;</span></span>
<span class="line"><span>    msadsc_t *msadscvp = NULL;</span></span>
<span class="line"><span>    machbstart_t *mbsp = &amp;kmachbsp;</span></span>
<span class="line"><span>    //计算msadsc_t结构数组的开始地址和数组元素个数</span></span>
<span class="line"><span>    if (ret_msadsc_vadrandsz(mbsp, &amp;msadscvp, &amp;msadscnr) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        system_error(&quot;init_msadsc ret_msadsc_vadrandsz err\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //开始真正初始化msadsc_t结构数组</span></span>
<span class="line"><span>    coremdnr = init_msadsc_core(mbsp, msadscvp, msadscnr);</span></span>
<span class="line"><span>    if (coremdnr != msadscnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        system_error(&quot;init_msadsc init_msadsc_core err\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //将msadsc_t结构数组的开始的物理地址写入kmachbsp结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memmappadr = viradr_to_phyadr((adr_t)msadscvp);</span></span>
<span class="line"><span>    //将msadsc_t结构数组的元素个数写入kmachbsp结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memmapnr = coremdnr;</span></span>
<span class="line"><span>    //将msadsc_t结构数组的大小写入kmachbsp结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memmapsz = coremdnr * sizeof(msadsc_t);</span></span>
<span class="line"><span>    //计算下一个空闲内存的开始地址</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_nextwtpadr = PAGE_ALIGN(mbsp-&amp;gt;mb_memmappadr + mbsp-&amp;gt;mb_memmapsz);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码量很少，逻辑也很简单，再配合注释，相信你看得懂。其中的ret_msadsc_vadrandsz函数也是遍历phymmarge_t结构数组，计算出有多大的可用内存空间，可以分成多少个页面，需要多少个msadsc_t结构。</p><h3 id="内存区结构初始化" tabindex="-1">内存区结构初始化 <a class="header-anchor" href="#内存区结构初始化" aria-label="Permalink to &quot;内存区结构初始化&quot;">​</a></h3><p>前面我们将整个物理地址空间在逻辑上分成了三个区，分别是 <strong>：硬件区、内核区、用户区</strong>，这就要求我们要在内存中建立三个memarea_t结构体的实例变量。</p><p>就像建立msadsc_t结构数组一样，我们只需要在内存中找个空闲空间，存放这三个memarea_t结构体就行。相比建立msadsc_t结构数组这更为简单，因为memarea_t结构体是顶层结构，并不依赖其它数据结构，只是对其本身进行初始化就好了。</p><p>但是由于它自身包含了其它数据结构，在初始化它时，要对其中的其它数据结构进行初始化，所以要小心一些。</p><p>下面我们去cosmos/hal/x86/目录下建立一个memarea.c文件，写下完成这些功能的代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void bafhlst_t_init(bafhlst_t *initp, u32_t stus, uint_t oder, uint_t oderpnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化bafhlst_t结构体的基本数据</span></span>
<span class="line"><span>    knl_spinlock_init(&amp;initp-&amp;gt;af_lock);</span></span>
<span class="line"><span>    initp-&amp;gt;af_stus = stus;</span></span>
<span class="line"><span>    initp-&amp;gt;af_oder = oder;</span></span>
<span class="line"><span>    initp-&amp;gt;af_oderpnr = oderpnr;</span></span>
<span class="line"><span>    initp-&amp;gt;af_fobjnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;af_mobjnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;af_alcindx = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;af_freindx = 0;</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;af_frelst);</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;af_alclst);</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;af_ovelst);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void memdivmer_t_init(memdivmer_t *initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化medivmer_t结构体的基本数据</span></span>
<span class="line"><span>    knl_spinlock_init(&amp;initp-&amp;gt;dm_lock);</span></span>
<span class="line"><span>    initp-&amp;gt;dm_stus = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;dm_divnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;dm_mernr = 0;</span></span>
<span class="line"><span>    //循环初始化memdivmer_t结构体中dm_mdmlielst数组中的每个bafhlst_t结构的基本数据</span></span>
<span class="line"><span>    for (uint_t li = 0; li &amp;lt; MDIVMER_ARR_LMAX; li++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        bafhlst_t_init(&amp;initp-&amp;gt;dm_mdmlielst[li], BAFH_STUS_DIVM, li, (1UL &amp;lt;&amp;lt; li));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    bafhlst_t_init(&amp;initp-&amp;gt;dm_onemsalst, BAFH_STUS_ONEM, 0, 1UL);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void memarea_t_init(memarea_t *initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化memarea_t结构体的基本数据</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;ma_list);</span></span>
<span class="line"><span>    knl_spinlock_init(&amp;initp-&amp;gt;ma_lock);</span></span>
<span class="line"><span>    initp-&amp;gt;ma_stus = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_flgs = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_type = MA_TYPE_INIT;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_maxpages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_allocpages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_freepages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_resvpages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_horizline = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_logicstart = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_logicend = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ma_logicsz = 0;</span></span>
<span class="line"><span>    //初始化memarea_t结构体中的memdivmer_t结构体</span></span>
<span class="line"><span>    memdivmer_t_init(&amp;initp-&amp;gt;ma_mdmdata);</span></span>
<span class="line"><span>    initp-&amp;gt;ma_privp = NULL;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t init_memarea_core(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取memarea_t结构开始地址</span></span>
<span class="line"><span>    u64_t phymarea = mbsp-&amp;gt;mb_nextwtpadr;</span></span>
<span class="line"><span>    //检查内存空间够不够放下MEMAREA_MAX个memarea_t结构实例变量</span></span>
<span class="line"><span>    if (initchkadr_is_ok(mbsp, phymarea, (sizeof(memarea_t) * MEMAREA_MAX)) != 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    memarea_t *virmarea = (memarea_t *)phyadr_to_viradr((adr_t)phymarea);</span></span>
<span class="line"><span>    for (uint_t mai = 0; mai &amp;lt; MEMAREA_MAX; mai++)</span></span>
<span class="line"><span>    {   //循环初始化每个memarea_t结构实例变量</span></span>
<span class="line"><span>        memarea_t_init(&amp;virmarea[mai]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置硬件区的类型和空间大小</span></span>
<span class="line"><span>    virmarea[0].ma_type = MA_TYPE_HWAD;</span></span>
<span class="line"><span>    virmarea[0].ma_logicstart = MA_HWAD_LSTART;</span></span>
<span class="line"><span>    virmarea[0].ma_logicend = MA_HWAD_LEND;</span></span>
<span class="line"><span>    virmarea[0].ma_logicsz = MA_HWAD_LSZ;</span></span>
<span class="line"><span>    //设置内核区的类型和空间大小</span></span>
<span class="line"><span>    virmarea[1].ma_type = MA_TYPE_KRNL;</span></span>
<span class="line"><span>    virmarea[1].ma_logicstart = MA_KRNL_LSTART;</span></span>
<span class="line"><span>    virmarea[1].ma_logicend = MA_KRNL_LEND;</span></span>
<span class="line"><span>    virmarea[1].ma_logicsz = MA_KRNL_LSZ;</span></span>
<span class="line"><span>    //设置应用区的类型和空间大小</span></span>
<span class="line"><span>    virmarea[2].ma_type = MA_TYPE_PROC;</span></span>
<span class="line"><span>    virmarea[2].ma_logicstart = MA_PROC_LSTART;</span></span>
<span class="line"><span>    virmarea[2].ma_logicend = MA_PROC_LEND;</span></span>
<span class="line"><span>    virmarea[2].ma_logicsz = MA_PROC_LSZ;</span></span>
<span class="line"><span>    //将memarea_t结构的开始的物理地址写入kmachbsp结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memznpadr = phymarea;</span></span>
<span class="line"><span>    //将memarea_t结构的个数写入kmachbsp结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memznnr = MEMAREA_MAX;</span></span>
<span class="line"><span>    //将所有memarea_t结构的大小写入kmachbsp结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memznsz = sizeof(memarea_t) * MEMAREA_MAX;</span></span>
<span class="line"><span>    //计算下一个空闲内存的开始地址</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_nextwtpadr = PAGE_ALIGN(phymarea + sizeof(memarea_t) * MEMAREA_MAX);</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化内存区</span></span>
<span class="line"><span>void init_memarea()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //真正初始化内存区</span></span>
<span class="line"><span>    if (init_memarea_core(&amp;kmachbsp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        system_error(&quot;init_memarea_core fail&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于这些数据结构很大，所以代码有点长，但是重要的代码我都做了详细注释。</p><p>在init_memarea_core函数的开始，我们调用了memarea_t_init函数，对MEMAREA_MAX个memarea_t结构进行了基本的初始化。</p><p>然后，在memarea_t_init函数中又调用了memdivmer_t_init函数，而在memdivmer_t_init函数中又调用了bafhlst_t_init函数，这保证了那些被包含的数据结构得到了初始化。</p><p>最后，我们给三个区分别设置了类型和地址空间。</p><h3 id="处理初始内存占用问题" tabindex="-1">处理初始内存占用问题 <a class="header-anchor" href="#处理初始内存占用问题" aria-label="Permalink to &quot;处理初始内存占用问题&quot;">​</a></h3><p>我们初始化了内存页和内存区对应的数据结构，已经可以组织好内存页面了。现在看似已经万事俱备了，其实这有个重大的问题，你知道是什么吗？我给你分析一下。</p><p>目前我们的内存中已经有很多数据了，有Cosmos内核本身的执行文件，有字体文件，有MMU页表，有打包的内核映像文件，还有刚刚建立的内存页和内存区的数据结构，这些数据都要占用实际的物理内存。</p><p>再回头看看我们建立内存页结构msadsc_t，所有的都是空闲状态，而它们每一个都表示一个实际的物理内存页。</p><p>假如在这种情况下，对调用内存分配接口进行内存分配， <strong>它按既定的分配算法查找空闲的msadsc_t结构，那它一定会找到内核占用的内存页所对应的msadsc_t结构，并把这个内存页分配出去，然后得到这个页面的程序对其进行改写。这样内核数据就会被覆盖，这种情况是我们绝对不能允许的。</strong></p><p>所以，我们要把这些已经占用的内存页面所对应的msadsc_t结构标记出来，标记成 <strong>已分配</strong>，这样内存分配算法就不会找到它们了。</p><p>要解决这个问题，我们只要给出被占用内存的起始地址和结束地址，然后从起始地址开始查找对应的msadsc_t结构，再把它标记为已经分配，最后直到查找到结束地址为止。</p><p>下面我们在msadsc.c文件中来实现这个方案，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//搜索一段内存地址空间所对应的msadsc_t结构</span></span>
<span class="line"><span>u64_t search_segment_occupymsadsc(msadsc_t *msastart, u64_t msanr, u64_t ocpystat, u64_t ocpyend)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t mphyadr = 0, fsmsnr = 0;</span></span>
<span class="line"><span>    msadsc_t *fstatmp = NULL;</span></span>
<span class="line"><span>    for (u64_t mnr = 0; mnr &amp;lt; msanr; mnr++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if ((msastart[mnr].md_phyadrs.paf_padrs &amp;lt;&amp;lt; PSHRSIZE) == ocpystat)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            //找出开始地址对应的第一个msadsc_t结构，就跳转到step1</span></span>
<span class="line"><span>            fstatmp = &amp;msastart[mnr];</span></span>
<span class="line"><span>            goto step1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>step1:</span></span>
<span class="line"><span>    fsmsnr = 0;</span></span>
<span class="line"><span>    if (NULL == fstatmp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (u64_t tmpadr = ocpystat; tmpadr &amp;lt; ocpyend; tmpadr += PAGESIZE, fsmsnr++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //从开始地址对应的第一个msadsc_t结构开始设置，直到结束地址对应的最后一个masdsc_t结构</span></span>
<span class="line"><span>        mphyadr = fstatmp[fsmsnr].md_phyadrs.paf_padrs &amp;lt;&amp;lt; PSHRSIZE;</span></span>
<span class="line"><span>        if (mphyadr != tmpadr)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (MF_MOCTY_FREE != fstatmp[fsmsnr].md_indxflgs.mf_mocty ||</span></span>
<span class="line"><span>            0 != fstatmp[fsmsnr].md_indxflgs.mf_uindx ||</span></span>
<span class="line"><span>            PAF_NO_ALLOC != fstatmp[fsmsnr].md_phyadrs.paf_alloc)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //设置msadsc_t结构为已经分配，已经分配给内核</span></span>
<span class="line"><span>        fstatmp[fsmsnr].md_indxflgs.mf_mocty = MF_MOCTY_KRNL;</span></span>
<span class="line"><span>        fstatmp[fsmsnr].md_indxflgs.mf_uindx++;</span></span>
<span class="line"><span>        fstatmp[fsmsnr].md_phyadrs.paf_alloc = PAF_ALLOC;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //进行一些数据的正确性检查</span></span>
<span class="line"><span>    u64_t ocpysz = ocpyend - ocpystat;</span></span>
<span class="line"><span>    if ((ocpysz &amp; 0xfff) != 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (((ocpysz &amp;gt;&amp;gt; PSHRSIZE) + 1) != fsmsnr)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return fsmsnr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if ((ocpysz &amp;gt;&amp;gt; PSHRSIZE) != fsmsnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return fsmsnr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t search_krloccupymsadsc_core(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t retschmnr = 0;</span></span>
<span class="line"><span>    msadsc_t *msadstat = (msadsc_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_memmappadr);</span></span>
<span class="line"><span>    u64_t msanr = mbsp-&amp;gt;mb_memmapnr;</span></span>
<span class="line"><span>    //搜索BIOS中断表占用的内存页所对应msadsc_t结构</span></span>
<span class="line"><span>    retschmnr = search_segment_occupymsadsc(msadstat, msanr, 0, 0x1000);</span></span>
<span class="line"><span>    if (0 == retschmnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //搜索内核栈占用的内存页所对应msadsc_t结构</span></span>
<span class="line"><span>    retschmnr = search_segment_occupymsadsc(msadstat, msanr, mbsp-&amp;gt;mb_krlinitstack &amp; (~(0xfffUL)), mbsp-&amp;gt;mb_krlinitstack);</span></span>
<span class="line"><span>    if (0 == retschmnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //搜索内核占用的内存页所对应msadsc_t结构</span></span>
<span class="line"><span>    retschmnr = search_segment_occupymsadsc(msadstat, msanr, mbsp-&amp;gt;mb_krlimgpadr, mbsp-&amp;gt;mb_nextwtpadr);</span></span>
<span class="line"><span>    if (0 == retschmnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //搜索内核映像文件占用的内存页所对应msadsc_t结构</span></span>
<span class="line"><span>    retschmnr = search_segment_occupymsadsc(msadstat, msanr, mbsp-&amp;gt;mb_imgpadr, mbsp-&amp;gt;mb_imgpadr + mbsp-&amp;gt;mb_imgsz);</span></span>
<span class="line"><span>    if (0 == retschmnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化搜索内核占用的内存页面</span></span>
<span class="line"><span>void init_search_krloccupymm(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //实际初始化搜索内核占用的内存页面</span></span>
<span class="line"><span>    if (search_krloccupymsadsc_core(mbsp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        system_error(&quot;search_krloccupymsadsc_core fail\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这三个函数逻辑很简单，由init_search_krloccupymm函数入口，search_krloccupymsadsc_core函数驱动，由search_segment_occupymsadsc函数完成实际的工作。</p><p>由于初始化阶段各种数据占用的开始、结束地址和大小，这些信息都保存在machbstart_t类型的kmachbsp变量中，所以函数与machbstart_t类型的指针为参数。</p><p>其实phymmarge_t、msadsc_t、memarea_t这些结构的实例变量和MMU页表，它们所占用的内存空间已经涵盖在了内核自身占用的内存空间。</p><p>好了，这个问题我们已经完美解决，只要在初始化内存页结构和内存区结构之后调用init_search_krloccupymm函数即可。</p><h3 id="合并内存页到内存区" tabindex="-1">合并内存页到内存区 <a class="header-anchor" href="#合并内存页到内存区" aria-label="Permalink to &quot;合并内存页到内存区&quot;">​</a></h3><p>我们做了这么多前期工作，依然没有让内存页和内存区联系起来，即让msadsc_t结构挂载到内存区对应的数组中。只有这样，我们才能提高内存管理器的分配速度。</p><p>让我们来着手干这件事情，这件事情有点复杂，但是我给你梳理以后就会清晰很多。整体上可以分成两步。</p><ol><li><p><strong>确定内存页属于哪个区</strong>，即标定一系列msadsc_t结构是属于哪个memarea_t结构的。</p></li><li><p><strong>把特定的内存页合并</strong>，然后挂载到特定的内存区下的memdivmer_t结构中的dm_mdmlielst数组中。</p></li></ol><p>我们先来做第一件事，这件事比较简单，我们只要遍历每个memarea_t结构，遍历过程中根据特定的memarea_t结构，然后去扫描整个msadsc_t结构数组，最后依次对比msadsc_t的物理地址，看它是否落在memarea_t结构的地址区间中。</p><p>如果是，就把这个memarea_t结构的类型值写入msadsc_t结构中，这样就一个一个打上了标签，遍历memarea_t结构结束之后，每个msadsc_t结构就只归属于某一个memarea_t结构了。</p><p>我们在memarea.c文件中写几个函数，来实现前面这个步骤，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//给msadsc_t结构打上标签</span></span>
<span class="line"><span>uint_t merlove_setallmarflgs_onmemarea(memarea_t *mareap, msadsc_t *mstat, uint_t msanr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u32_t muindx = 0;</span></span>
<span class="line"><span>    msadflgs_t *mdfp = NULL;</span></span>
<span class="line"><span>    //获取内存区类型</span></span>
<span class="line"><span>    switch (mareap-&amp;gt;ma_type){</span></span>
<span class="line"><span>    case MA_TYPE_HWAD:</span></span>
<span class="line"><span>        muindx = MF_MARTY_HWD &amp;lt;&amp;lt; 5;//硬件区标签</span></span>
<span class="line"><span>        mdfp = (msadflgs_t *)(&amp;muindx);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case MA_TYPE_KRNL:</span></span>
<span class="line"><span>        muindx = MF_MARTY_KRL &amp;lt;&amp;lt; 5;//内核区标签</span></span>
<span class="line"><span>        mdfp = (msadflgs_t *)(&amp;muindx);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case MA_TYPE_PROC:</span></span>
<span class="line"><span>        muindx = MF_MARTY_PRC &amp;lt;&amp;lt; 5;//应用区标签</span></span>
<span class="line"><span>        mdfp = (msadflgs_t *)(&amp;muindx);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    u64_t phyadr = 0;</span></span>
<span class="line"><span>    uint_t retnr = 0;</span></span>
<span class="line"><span>    //扫描所有的msadsc_t结构</span></span>
<span class="line"><span>    for (uint_t mix = 0; mix &amp;lt; msanr; mix++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (MF_MARTY_INIT == mstat[mix].md_indxflgs.mf_marty)</span></span>
<span class="line"><span>        {    //获取msadsc_t结构对应的地址</span></span>
<span class="line"><span>            phyadr = mstat[mix].md_phyadrs.paf_padrs &amp;lt;&amp;lt; PSHRSIZE;</span></span>
<span class="line"><span>            //和内存区的地址区间比较</span></span>
<span class="line"><span>            if (phyadr &amp;gt;= mareap-&amp;gt;ma_logicstart &amp;&amp; ((phyadr + PAGESIZE) - 1) &amp;lt;= mareap-&amp;gt;ma_logicend)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                //设置msadsc_t结构的标签</span></span>
<span class="line"><span>                mstat[mix].md_indxflgs.mf_marty = mdfp-&amp;gt;mf_marty;</span></span>
<span class="line"><span>                retnr++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return retnr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t merlove_mem_core(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取msadsc_t结构的首地址</span></span>
<span class="line"><span>    msadsc_t *mstatp = (msadsc_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_memmappadr);</span></span>
<span class="line"><span>    //获取msadsc_t结构的个数</span></span>
<span class="line"><span>    uint_t msanr = (uint_t)mbsp-&amp;gt;mb_memmapnr, maxp = 0;</span></span>
<span class="line"><span>    //获取memarea_t结构的首地址</span></span>
<span class="line"><span>    memarea_t *marea = (memarea_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_memznpadr);</span></span>
<span class="line"><span>    uint_t sretf = ~0UL, tretf = ~0UL;</span></span>
<span class="line"><span>    //遍历每个memarea_t结构</span></span>
<span class="line"><span>    for (uint_t mi = 0; mi &amp;lt; (uint_t)mbsp-&amp;gt;mb_memznnr; mi++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //针对其中一个memarea_t结构给msadsc_t结构打上标签</span></span>
<span class="line"><span>        sretf = merlove_setallmarflgs_onmemarea(&amp;marea[mi], mstatp, msanr);</span></span>
<span class="line"><span>        if ((~0UL) == sretf)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return FALSE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     //遍历每个memarea_t结构</span></span>
<span class="line"><span>    for (uint_t maidx = 0; maidx &amp;lt; (uint_t)mbsp-&amp;gt;mb_memznnr; maidx++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //针对其中一个memarea_t结构对msadsc_t结构进行合并</span></span>
<span class="line"><span>        if (merlove_mem_onmemarea(&amp;marea[maidx], mstatp, msanr) == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return FALSE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        maxp += marea[maidx].ma_maxpages;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化页面合并</span></span>
<span class="line"><span>void init_merlove_mem()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (merlove_mem_core(&amp;kmachbsp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        system_error(&quot;merlove_mem_core fail\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们一下子写了三个函数，它们的作用且听我一一道来。从init_merlove_mem函数开始，但是它并不实际干活，作为入口函数，它调用的merlove_mem_core函数才是真正干活的。</p><p>这个merlove_mem_core函数有两个遍历内存区，第一次遍历是为了完成上述第一步：确定内存页属于哪个区。</p><p>当确定内存页属于哪个区之后，就来到了第二次遍历memarea_t结构，合并其中的msadsc_t结构，并把它们挂载到其中的memdivmer_t结构下的dm_mdmlielst数组中。</p><p>这个操作就稍微有点复杂了。 <strong>第一，它要保证其中所有的msadsc_t结构挂载到dm_mdmlielst数组中合适的bafhlst_t结构中。</strong></p><p><strong>第二，它要保证多个msadsc_t结构有最大的连续性。</strong></p><p>举个例子，比如一个内存区中有12个页面，其中10个页面是连续的地址为0～0x9000，还有两个页面其中一个地址为0xb000，另一个地址为0xe000。</p><p>这样的情况下，需要多个页面保持最大的连续性，还有在m_mdmlielst数组中找到合适的bafhlst_t结构。</p><p>那么：0～0x7000这8个页面就要挂载到m_mdmlielst数组中第3个bafhlst_t结构中；0x8000～0x9000这2个页面要挂载到m_mdmlielst数组中第1个bafhlst_t结构中，而0xb000和0xe000这2个页面都要挂载到m_mdmlielst数组中第0个bafhlst_t结构中。</p><p>从上述代码可以看出，遍历每个内存区，然后针对其中每一个内存区进行msadsc_t结构的合并操作，完成这个操作的是 <strong>merlove_mem_onmemarea</strong>，我们这就去写好这个函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool_t continumsadsc_add_bafhlst(memarea_t *mareap, bafhlst_t *bafhp, msadsc_t *fstat, msadsc_t *fend, uint_t fmnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    fstat-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_ODER;</span></span>
<span class="line"><span>    //开始的msadsc_t结构指向最后的msadsc_t结构</span></span>
<span class="line"><span>    fstat-&amp;gt;md_odlink = fend;</span></span>
<span class="line"><span>    fend-&amp;gt;md_indxflgs.mf_olkty = MF_OLKTY_BAFH;</span></span>
<span class="line"><span>    //最后的msadsc_t结构指向它属于的bafhlst_t结构</span></span>
<span class="line"><span>    fend-&amp;gt;md_odlink = bafhp;</span></span>
<span class="line"><span>    //把多个地址连续的msadsc_t结构的的开始的那个msadsc_t结构挂载到bafhlst_t结构的af_frelst中</span></span>
<span class="line"><span>    list_add(&amp;fstat-&amp;gt;md_list, &amp;bafhp-&amp;gt;af_frelst);</span></span>
<span class="line"><span>    //更新bafhlst_t的统计数据</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_fobjnr++;</span></span>
<span class="line"><span>    bafhp-&amp;gt;af_mobjnr++;</span></span>
<span class="line"><span>    //更新内存区的统计数据</span></span>
<span class="line"><span>    mareap-&amp;gt;ma_maxpages += fmnr;</span></span>
<span class="line"><span>    mareap-&amp;gt;ma_freepages += fmnr;</span></span>
<span class="line"><span>    mareap-&amp;gt;ma_allmsadscnr += fmnr;</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t continumsadsc_mareabafh_core(memarea_t *mareap, msadsc_t **rfstat, msadsc_t **rfend, uint_t *rfmnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t retval = *rfmnr, tmpmnr = 0;</span></span>
<span class="line"><span>    msadsc_t *mstat = *rfstat, *mend = *rfend;</span></span>
<span class="line"><span>    //根据地址连续的msadsc_t结构的数量查找合适bafhlst_t结构</span></span>
<span class="line"><span>    bafhlst_t *bafhp = find_continumsa_inbafhlst(mareap, retval);</span></span>
<span class="line"><span>    //判断bafhlst_t结构状态和类型对不对</span></span>
<span class="line"><span>    if ((BAFH_STUS_DIVP == bafhp-&amp;gt;af_stus || BAFH_STUS_DIVM == bafhp-&amp;gt;af_stus) &amp;&amp; MA_TYPE_PROC != mareap-&amp;gt;ma_type)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //看地址连续的msadsc_t结构的数量是不是正好是bafhp-&amp;gt;af_oderpnr</span></span>
<span class="line"><span>        tmpmnr = retval - bafhp-&amp;gt;af_oderpnr;</span></span>
<span class="line"><span>        //根据地址连续的msadsc_t结构挂载到bafhlst_t结构中</span></span>
<span class="line"><span>        if (continumsadsc_add_bafhlst(mareap, bafhp, mstat, &amp;mstat[bafhp-&amp;gt;af_oderpnr - 1], bafhp-&amp;gt;af_oderpnr) == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return FALSE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //如果地址连续的msadsc_t结构的数量正好是bafhp-&amp;gt;af_oderpnr则完成，否则返回再次进入此函数</span></span>
<span class="line"><span>        if (tmpmnr == 0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            *rfmnr = tmpmnr;</span></span>
<span class="line"><span>            *rfend = NULL;</span></span>
<span class="line"><span>            return TRUE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //挂载bafhp-&amp;gt;af_oderpnr地址连续的msadsc_t结构到bafhlst_t中</span></span>
<span class="line"><span>        *rfstat = &amp;mstat[bafhp-&amp;gt;af_oderpnr];</span></span>
<span class="line"><span>        //还剩多少个地址连续的msadsc_t结构</span></span>
<span class="line"><span>        *rfmnr = tmpmnr;</span></span>
<span class="line"><span>        return TRUE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return FALSE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t merlove_continumsadsc_mareabafh(memarea_t *mareap, msadsc_t *mstat, msadsc_t *mend, uint_t mnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t mnridx = mnr;</span></span>
<span class="line"><span>    msadsc_t *fstat = mstat, *fend = mend;</span></span>
<span class="line"><span>    //如果mnridx &amp;gt; 0并且NULL != fend就循环调用continumsadsc_mareabafh_core函数，而mnridx和fend由这个函数控制</span></span>
<span class="line"><span>    for (; (mnridx &amp;gt; 0 &amp;&amp; NULL != fend);)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    //为一段地址连续的msadsc_t结构寻找合适m_mdmlielst数组中的bafhlst_t结构</span></span>
<span class="line"><span>        continumsadsc_mareabafh_core(mareap, &amp;fstat, &amp;fend, &amp;mnridx)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t merlove_scan_continumsadsc(memarea_t *mareap, msadsc_t *fmstat, uint_t *fntmsanr, uint_t fmsanr,</span></span>
<span class="line"><span>                                         msadsc_t **retmsastatp, msadsc_t **retmsaendp, uint_t *retfmnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u32_t muindx = 0;</span></span>
<span class="line"><span>    msadflgs_t *mdfp = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    msadsc_t *msastat = fmstat;</span></span>
<span class="line"><span>    uint_t retfindmnr = 0;</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    uint_t tmidx = *fntmsanr;</span></span>
<span class="line"><span>    //从外层函数的fntmnr变量开始遍历所有msadsc_t结构</span></span>
<span class="line"><span>    for (; tmidx &amp;lt; fmsanr; tmidx++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    //一个msadsc_t结构是否属于这个内存区，是否空闲</span></span>
<span class="line"><span>        if (msastat[tmidx].md_indxflgs.mf_marty == mdfp-&amp;gt;mf_marty &amp;&amp;</span></span>
<span class="line"><span>            0 == msastat[tmidx].md_indxflgs.mf_uindx &amp;&amp;</span></span>
<span class="line"><span>            MF_MOCTY_FREE == msastat[tmidx].md_indxflgs.mf_mocty &amp;&amp;</span></span>
<span class="line"><span>            PAF_NO_ALLOC == msastat[tmidx].md_phyadrs.paf_alloc)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>        //返回从这个msadsc_t结构开始到下一个非空闲、地址非连续的msadsc_t结构对应的msadsc_t结构索引号到retfindmnr变量中</span></span>
<span class="line"><span>            rets = scan_len_msadsc(&amp;msastat[tmidx], mdfp, fmsanr, &amp;retfindmnr);</span></span>
<span class="line"><span>            //下一轮开始的msadsc_t结构索引</span></span>
<span class="line"><span>            *fntmsanr = tmidx + retfindmnr + 1;</span></span>
<span class="line"><span>            //当前地址连续msadsc_t结构的开始地址</span></span>
<span class="line"><span>            *retmsastatp = &amp;msastat[tmidx];</span></span>
<span class="line"><span>            //当前地址连续msadsc_t结构的结束地址</span></span>
<span class="line"><span>            *retmsaendp = &amp;msastat[tmidx + retfindmnr];</span></span>
<span class="line"><span>            //当前有多少个地址连续msadsc_t结构</span></span>
<span class="line"><span>            *retfmnr = retfindmnr + 1;</span></span>
<span class="line"><span>            return TRUE;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return FALSE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t merlove_mem_onmemarea(memarea_t *mareap, msadsc_t *mstat, uint_t msanr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    msadsc_t *retstatmsap = NULL, *retendmsap = NULL, *fntmsap = mstat;</span></span>
<span class="line"><span>    uint_t retfindmnr = 0;</span></span>
<span class="line"><span>    uint_t fntmnr = 0;</span></span>
<span class="line"><span>    bool_t retscan = FALSE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (; fntmnr &amp;lt; msanr;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //获取最多且地址连续的msadsc_t结构体的开始、结束地址、一共多少个msadsc_t结构体，下一次循环的fntmnr</span></span>
<span class="line"><span>        retscan = merlove_scan_continumsadsc(mareap, fntmsap, &amp;fntmnr, msanr, &amp;retstatmsap, &amp;retendmsap, &amp;retfindmnr);</span></span>
<span class="line"><span>        if (NULL != retstatmsap &amp;&amp; NULL != retendmsap)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>        //把一组连续的msadsc_t结构体挂载到合适的m_mdmlielst数组中的bafhlst_t结构中</span></span>
<span class="line"><span>        merlove_continumsadsc_mareabafh(mareap, retstatmsap, retendmsap, retfindmnr)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了节约篇幅，我删除了大量检查错误的代码，你可以在我提供的 <a href="https://gitee.com/lmos/cosmos/blob/master/lesson16~18/Cosmos/hal/x86/memarea.c#L694" target="_blank" rel="noreferrer">源代码</a> 里自行查看。</p><p>上述代码中，整体上分为两步。</p><p>第一步，通过merlove_scan_continumsadsc函数，返回最多且地址连续的msadsc_t结构体的开始、结束地址、一共多少个msadsc_t结构体，下一轮开始的msadsc_t结构体的索引号。</p><p>第二步，根据第一步获取的信息调用merlove_continumsadsc_mareabafh函数，把第一步返回那一组连续的msadsc_t结构体，挂载到合适的m_mdmlielst数组中的bafhlst_t结构中。详细的逻辑已经在注释中说明。</p><p>好，内存页已经按照规定的方式组织起来了，这表示物理内存管理器的初始化工作已经进入尾声。</p><h3 id="初始化汇总" tabindex="-1">初始化汇总 <a class="header-anchor" href="#初始化汇总" aria-label="Permalink to &quot;初始化汇总&quot;">​</a></h3><p>别急！先别急着写内存分配相关的代码。到目前为止，我们一起写了这么多的内存初始化相关的代码，但是我们没有调用它们。</p><p>根据前面内存管理数据结构的关系，很显然， <strong>它们的调用次序很重要，谁先谁后都有严格的规定，这关乎内存管理初始化的成败。</strong> 所以，现在我们就在先前的init_memmgr函数中去调用它们，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_memmgr()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化内存页结构</span></span>
<span class="line"><span>    init_msadsc();</span></span>
<span class="line"><span>    //初始化内存区结构</span></span>
<span class="line"><span>    init_memarea();</span></span>
<span class="line"><span>    //处理内存占用</span></span>
<span class="line"><span>    init_search_krloccupymm(&amp;kmachbsp);</span></span>
<span class="line"><span>    //合并内存页到内存区中</span></span>
<span class="line"><span>    init_merlove_mem();</span></span>
<span class="line"><span>    init_memmgrob();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，init_msadsc、init_memarea函数是可以交换次序的，它们俩互不影响，但它们俩必须最先开始调用，而后面的函数要依赖它们生成的数据结构。</p><p>但是init_search_krloccupymm函数必须要在init_merlove_mem函数之前被调用，因为init_merlove_mem函数在合并页面时，必须先知道哪些页面被占用了。</p><p>等一等，init_memmgrob是什么函数，这个我们还没写呢。下面我们就来现实它。</p><p>不知道你发现没有，我们的phymmarge_t结构体的地址和数量、msadsc_t结构体的地址和数据、memarea_t结构体的地址和数量都保存在了kmachbsp变量中，这个变量其实不是用来管理内存的，而且它里面放的是 <strong>物理地址</strong>。</p><p>但内核使用的是虚拟地址，每次都要转换极不方便，所以我们要设计一个专用的数据结构，用于内存管理。我们来定义一下这个结构，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cosmos/include/halinc/halglobal.c</span></span>
<span class="line"><span>HAL_DEFGLOB_VARIABLE(memmgrob_t,memmgrob);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef struct s_MEMMGROB</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t mo_list;</span></span>
<span class="line"><span>    spinlock_t mo_lock;        //保护自身自旋锁</span></span>
<span class="line"><span>    uint_t mo_stus;            //状态</span></span>
<span class="line"><span>    uint_t mo_flgs;            //标志</span></span>
<span class="line"><span>    u64_t mo_memsz;            //内存大小</span></span>
<span class="line"><span>    u64_t mo_maxpages;         //内存最大页面数</span></span>
<span class="line"><span>    u64_t mo_freepages;        //内存最大空闲页面数</span></span>
<span class="line"><span>    u64_t mo_alocpages;        //内存最大分配页面数</span></span>
<span class="line"><span>    u64_t mo_resvpages;        //内存保留页面数</span></span>
<span class="line"><span>    u64_t mo_horizline;        //内存分配水位线</span></span>
<span class="line"><span>    phymmarge_t* mo_pmagestat; //内存空间布局结构指针</span></span>
<span class="line"><span>    u64_t mo_pmagenr;</span></span>
<span class="line"><span>    msadsc_t* mo_msadscstat;   //内存页面结构指针</span></span>
<span class="line"><span>    u64_t mo_msanr;</span></span>
<span class="line"><span>    memarea_t* mo_mareastat;   //内存区结构指针</span></span>
<span class="line"><span>    u64_t mo_mareanr;</span></span>
<span class="line"><span>}memmgrob_t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//cosmos/hal/x86/memmgrinit.c</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void memmgrob_t_init(memmgrob_t *initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;mo_list);</span></span>
<span class="line"><span>    knl_spinlock_init(&amp;initp-&amp;gt;mo_lock);</span></span>
<span class="line"><span>    initp-&amp;gt;mo_stus = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_flgs = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_memsz = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_maxpages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_freepages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_alocpages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_resvpages = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_horizline = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_pmagestat = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_pmagenr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_msadscstat = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_msanr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_mareastat = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;mo_mareanr = 0;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void init_memmgrob()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    machbstart_t *mbsp = &amp;kmachbsp;</span></span>
<span class="line"><span>    memmgrob_t *mobp = &amp;memmgrob;</span></span>
<span class="line"><span>    memmgrob_t_init(mobp);</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_pmagestat = (phymmarge_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_e820expadr);</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_pmagenr = mbsp-&amp;gt;mb_e820exnr;</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_msadscstat = (msadsc_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_memmappadr);</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_msanr = mbsp-&amp;gt;mb_memmapnr;</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_mareastat = (memarea_t *)phyadr_to_viradr((adr_t)mbsp-&amp;gt;mb_memznpadr);</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_mareanr = mbsp-&amp;gt;mb_memznnr;</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_memsz = mbsp-&amp;gt;mb_memmapnr &amp;lt;&amp;lt; PSHRSIZE;</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_maxpages = mbsp-&amp;gt;mb_memmapnr;</span></span>
<span class="line"><span>    uint_t aidx = 0;</span></span>
<span class="line"><span>    for (uint_t i = 0; i &amp;lt; mobp-&amp;gt;mo_msanr; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (1 == mobp-&amp;gt;mo_msadscstat[i].md_indxflgs.mf_uindx &amp;&amp;</span></span>
<span class="line"><span>            MF_MOCTY_KRNL == mobp-&amp;gt;mo_msadscstat[i].md_indxflgs.mf_mocty &amp;&amp;</span></span>
<span class="line"><span>            PAF_ALLOC == mobp-&amp;gt;mo_msadscstat[i].md_phyadrs.paf_alloc)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            aidx++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_alocpages = aidx;</span></span>
<span class="line"><span>    mobp-&amp;gt;mo_freepages = mobp-&amp;gt;mo_maxpages - mobp-&amp;gt;mo_alocpages;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些代码非常容易理解，我们就不再讨论了，无非是将内存管理核心数据结构的地址和数量放在其中，并计算了一些统计信息，这没有任何难度，相信你会轻松理解。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天课程的重点工作是初始化我们设计的内存管理数据结构，在内存中建立它们的实例变量，我来为你梳理一下重点。</p><p>首先，我们从初始化msadsc_t结构开始，在内存中建立msadsc_t结构的实例变量，每个物理内存页面一个msadsc_t结构的实例变量。</p><p>然后是初始化memarea_t结构，在msadsc_t结构的实例变量之后，每个内存区一个memarea_t结构实例变量。</p><p>接着标记哪些msadsc_t结构对应的物理内存被内核占用了，这些被标记msadsc_t结构是不能纳入内存管理结构中去的。</p><p>最后，把所有的空闲msadsc_t结构按最大地址连续的形式组织起来，挂载到memarea_t结构下的memdivmer_t结构中，对应的dm_mdmlielst数组中。</p><p>不知道你是否想过，随着物理内存不断增加，msadsc_t结构实例变量本身占用的内存空间就会增加，那你有办法降低msadsc_t结构实例变量占用的内存空间吗？期待你的实现。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问在4GB的物理内存的情况下，msadsc_t结构实例变量本身占用多大的内存空间？</p><p>欢迎你在留言区跟我交流互动，也希望你能把这节课分享给你的同事、朋友。</p><p>好，我是LMOS，我们下节课见！</p>`,88)])])}const g=a(m,[["render",e]]);export{o as __pageData,g as default};
