import{_ as n,H as a,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"13 | 第一个C函数：如何实现板级初始化？","description":"","frontmatter":{},"headers":[{"level":2,"title":"第一个C函数","slug":"第一个c函数","link":"#第一个c函数","children":[{"level":3,"title":"hal层初始化","slug":"hal层初始化","link":"#hal层初始化","children":[]},{"level":3,"title":"进入内核层","slug":"进入内核层","link":"#进入内核层","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/13-第一个C函数：如何实现板级初始化？.md","filePath":"操作系统实战45讲/13-第一个C函数：如何实现板级初始化？.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/13-第一个C函数：如何实现板级初始化？.md"};function i(t,s,c,r,_,o){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_13-第一个c函数-如何实现板级初始化" tabindex="-1">13 | 第一个C函数：如何实现板级初始化？ <a class="header-anchor" href="#_13-第一个c函数-如何实现板级初始化" aria-label="Permalink to &quot;13 | 第一个C函数：如何实现板级初始化？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>前面三节课，我们为调用Cosmos的 <strong>第一个C函数hal_start做了大量工作。</strong> 这节课我们要让操作系统Cosmos里的第一个C函数真正跑起来啦，也就是说，我们会真正进入到我们的内核中。</p><p>今天我们会继续在这个hal_start函数里，首先执行板级初始化，其实就是hal层（硬件抽象层，下同）初始化，其中执行了平台初始化，hal层的内存初始化，中断初始化，最后进入到内核层的初始化。</p><p>这节课的配套代码，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson13/Cosmos" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="第一个c函数" tabindex="-1">第一个C函数 <a class="header-anchor" href="#第一个c函数" aria-label="Permalink to &quot;第一个C函数&quot;">​</a></h2><p>任何软件工程，第一个函数总是简单的，因为它是总调用者，像是一个管理者，坐在那里发号施令，自己却是啥活也不干。</p><p>由于这是第一个C函数，也是初始化函数，我们还是要为它单独建立一个文件，以显示对它的尊重，依然在Cosmos/hal/x86/下建立一个hal_start.c文件。写上这样一个函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void hal_start()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //第一步：初始化hal层</span></span>
<span class="line"><span>    //第二步：初始化内核层</span></span>
<span class="line"><span>    for(;;);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据前面的设计，Cosmos是有hal层和内核层之分，所以在上述代码中，要分两步走。第一步是初始化hal层；第二步，初始化内核层。只是这两步的函数我们还没有写。</p><p>然而最后的死循环却有点奇怪，其实它的目的很简单，就是避免这个函数返回，因为这个返回了就无处可去，避免走回头路。</p><h3 id="hal层初始化" tabindex="-1">hal层初始化 <a class="header-anchor" href="#hal层初始化" aria-label="Permalink to &quot;hal层初始化&quot;">​</a></h3><p>为了分离硬件的特性，我们设计了hal层，把硬件相关的操作集中在这个层，并向上提供接口，目的是让内核上层不用关注硬件相关的细节，也能方便以后移植和扩展。(关于hal层的设计，可以回顾 <a href="https://time.geekbang.org/column/article/372609" target="_blank" rel="noreferrer">第3节课</a>)</p><p>也许今天我们是在x86平台上写Cosmos，明天就要在ARM平台上开发Cosmos，那时我们就可以写个ARM平台的hal层，来替换Cosmos中的x86平台的hal层。</p><p>下面我们在Cosmos/hal/x86/下建立一个halinit.c文件，写出hal层的初始化函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_hal()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化平台</span></span>
<span class="line"><span>    //初始化内存</span></span>
<span class="line"><span>    //初始化中断</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个函数也是一个调用者，没怎么干活。不过根据代码的注释能看出，它调用的函数多一点，但主要是完成初始化平台、初始化内存、初始化中断的功能函数。</p><h4 id="初始化平台" tabindex="-1">初始化平台 <a class="header-anchor" href="#初始化平台" aria-label="Permalink to &quot;初始化平台&quot;">​</a></h4><p>我们先来写好平台初始化函数，因为它需要最先被调用。</p><p>这个函数主要负责完成两个任务，一是 <strong>把二级引导器建立的机器信息结构复制到hal层中的一个全局变量中</strong>，方便内核中的其它代码使用里面的信息，之后二级引导器建立的数据所占用的内存都会被释放。二是要 <strong>初始化图形显示驱动</strong>，内核在运行过程要在屏幕上输出信息。</p><p>下面我们在Cosmos/hal/x86/下建立一个halplatform.c文件，写上如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void machbstart_t_init(machbstart_t *initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //清零</span></span>
<span class="line"><span>    memset(initp, 0, sizeof(machbstart_t));</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void init_machbstart()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    machbstart_t *kmbsp = &amp;kmachbsp;</span></span>
<span class="line"><span>    machbstart_t *smbsp = MBSPADR;//物理地址1MB处</span></span>
<span class="line"><span>    machbstart_t_init(kmbsp);</span></span>
<span class="line"><span>    //复制，要把地址转换成虚拟地址</span></span>
<span class="line"><span>    memcopy((void *)phyadr_to_viradr((adr_t)smbsp), (void *)kmbsp, sizeof(machbstart_t));</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//平台初始化函数</span></span>
<span class="line"><span>void init_halplaltform()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //复制机器信息结构</span></span>
<span class="line"><span>    init_machbstart();</span></span>
<span class="line"><span>    //初始化图形显示驱动</span></span>
<span class="line"><span>    init_bdvideo();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个代码中别的地方很好理解，就是kmachbsp你可能会有点奇怪，它是个结构体变量，结构体类型是machbstart_t，这个结构和二级引导器所使用的一模一样。</p><p>同时，它还是一个hal层的全局变量，我们想专门有个文件定义所有hal层的全局变量，于是我们在Cosmos/hal/x86/下建立一个halglobal.c文件，写上如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//全局变量定义变量放在data段</span></span>
<span class="line"><span>#define HAL_DEFGLOB_VARIABLE(vartype,varname) \\</span></span>
<span class="line"><span>EXTERN  __attribute__((section(&quot;.data&quot;))) vartype varname</span></span>
<span class="line"><span></span></span>
<span class="line"><span>HAL_DEFGLOB_VARIABLE(machbstart_t,kmachbsp);</span></span></code></pre></div><p>前面的EXTERN，在halglobal.c文件中定义为空，而在其它文件中定义为extern，告诉编译器这是外部文件的变量，避免发生错误。</p><p>下面，我们在Cosmos/hal/x86/下的bdvideo.c文件中，写好init_bdvideo函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_bdvideo()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    dftgraph_t *kghp = &amp;kdftgh;</span></span>
<span class="line"><span>    //初始化图形数据结构，里面放有图形模式，分辨率，图形驱动函数指针</span></span>
<span class="line"><span>    init_dftgraph();</span></span>
<span class="line"><span>    //初始bga图形显卡的函数指针</span></span>
<span class="line"><span>    init_bga();</span></span>
<span class="line"><span>    //初始vbe图形显卡的函数指针</span></span>
<span class="line"><span>    init_vbe();</span></span>
<span class="line"><span>    //清空屏幕 为黑色</span></span>
<span class="line"><span>    fill_graph(kghp, BGRA(0, 0, 0));</span></span>
<span class="line"><span>    //显示背景图片</span></span>
<span class="line"><span>    set_charsdxwflush(0, 0);</span></span>
<span class="line"><span>    hal_background();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>init_dftgraph()函数初始了dftgraph_t结构体类型的变量kdftgh，我们在halglobal.c文件中定义这个变量，结构类型我们这样来定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_DFTGRAPH</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t gh_mode;         //图形模式</span></span>
<span class="line"><span>    u64_t gh_x;            //水平像素点</span></span>
<span class="line"><span>    u64_t gh_y;            //垂直像素点</span></span>
<span class="line"><span>    u64_t gh_framphyadr;   //显存物理地址</span></span>
<span class="line"><span>    u64_t gh_fvrmphyadr;   //显存虚拟地址</span></span>
<span class="line"><span>    u64_t gh_fvrmsz;       //显存大小</span></span>
<span class="line"><span>    u64_t gh_onepixbits;   //一个像素字占用的数据位数</span></span>
<span class="line"><span>    u64_t gh_onepixbyte;</span></span>
<span class="line"><span>    u64_t gh_vbemodenr;    //vbe模式号</span></span>
<span class="line"><span>    u64_t gh_bank;         //显存的bank数</span></span>
<span class="line"><span>    u64_t gh_curdipbnk;    //当前bank</span></span>
<span class="line"><span>    u64_t gh_nextbnk;      //下一个bank</span></span>
<span class="line"><span>    u64_t gh_banksz;       //bank大小</span></span>
<span class="line"><span>    u64_t gh_fontadr;      //字库地址</span></span>
<span class="line"><span>    u64_t gh_fontsz;       //字库大小</span></span>
<span class="line"><span>    u64_t gh_fnthight;     //字体高度</span></span>
<span class="line"><span>    u64_t gh_nxtcharsx;    //下一字符显示的x坐标</span></span>
<span class="line"><span>    u64_t gh_nxtcharsy;    //下一字符显示的y坐标</span></span>
<span class="line"><span>    u64_t gh_linesz;       //字符行高</span></span>
<span class="line"><span>    pixl_t gh_deffontpx;   //默认字体大小</span></span>
<span class="line"><span>    u64_t gh_chardxw;</span></span>
<span class="line"><span>    u64_t gh_flush;</span></span>
<span class="line"><span>    u64_t gh_framnr;</span></span>
<span class="line"><span>    u64_t gh_fshdata;      //刷新相关的</span></span>
<span class="line"><span>    dftghops_t gh_opfun;   //图形驱动操作函数指针结构体</span></span>
<span class="line"><span>}dftgraph_t;</span></span>
<span class="line"><span>typedef struct s_DFTGHOPS</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //读写显存数据</span></span>
<span class="line"><span>    size_t (*dgo_read)(void* ghpdev,void* outp,size_t rdsz);</span></span>
<span class="line"><span>    size_t (*dgo_write)(void* ghpdev,void* inp,size_t wesz);</span></span>
<span class="line"><span>    sint_t (*dgo_ioctrl)(void* ghpdev,void* outp,uint_t iocode);</span></span>
<span class="line"><span>    //刷新</span></span>
<span class="line"><span>    void   (*dgo_flush)(void* ghpdev);</span></span>
<span class="line"><span>    sint_t (*dgo_set_bank)(void* ghpdev, sint_t bnr);</span></span>
<span class="line"><span>    //读写像素</span></span>
<span class="line"><span>    pixl_t (*dgo_readpix)(void* ghpdev,uint_t x,uint_t y);</span></span>
<span class="line"><span>    void   (*dgo_writepix)(void* ghpdev,pixl_t pix,uint_t x,uint_t y);</span></span>
<span class="line"><span>    //直接读写像素</span></span>
<span class="line"><span>    pixl_t (*dgo_dxreadpix)(void* ghpdev,uint_t x,uint_t y);</span></span>
<span class="line"><span>    void   (*dgo_dxwritepix)(void* ghpdev,pixl_t pix,uint_t x,uint_t y);</span></span>
<span class="line"><span>    //设置x，y坐标和偏移</span></span>
<span class="line"><span>    sint_t (*dgo_set_xy)(void* ghpdev,uint_t x,uint_t y);</span></span>
<span class="line"><span>    sint_t (*dgo_set_vwh)(void* ghpdev,uint_t vwt,uint_t vhi);</span></span>
<span class="line"><span>    sint_t (*dgo_set_xyoffset)(void* ghpdev,uint_t xoff,uint_t yoff);</span></span>
<span class="line"><span>    //获取x，y坐标和偏移</span></span>
<span class="line"><span>    sint_t (*dgo_get_xy)(void* ghpdev,uint_t* rx,uint_t* ry);</span></span>
<span class="line"><span>    sint_t (*dgo_get_vwh)(void* ghpdev,uint_t* rvwt,uint_t* rvhi);</span></span>
<span class="line"><span>    sint_t (*dgo_get_xyoffset)(void* ghpdev,uint_t* rxoff,uint_t* ryoff);</span></span>
<span class="line"><span>}dftghops_t;</span></span>
<span class="line"><span>//刷新显存</span></span>
<span class="line"><span>void flush_videoram(dftgraph_t *kghp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kghp-&amp;gt;gh_opfun.dgo_flush(kghp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>不难发现，我们正是把这些实际的图形驱动函数的地址填入了这个结构体中，然后通过这个结构体，我们就可以调用到相应的函数了。</p><p>因为写这些函数都是体力活，我已经帮你搞定了，你直接使用就可以。上面的flush_videoram函数已经证明了这一想法。</p><p>来，我们测试一下，看看结果，我们图形驱动程序初始化会显示背景图片——background.bmp，这是在打包映像文件时包含进去的，你自己可以随时替换，只要是满足 <strong>1024*768，24位的位图文件</strong> 就行了。</p><p>下面我们要把这些函数调用起来：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//在halinit.c文件中</span></span>
<span class="line"><span>void init_hal()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_halplaltform();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//在hal_start.c文件中</span></span>
<span class="line"><span>void hal_start()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_hal();//初始化hal层，其中会调用初始化平台函数，在那里会调用初始化图形驱动</span></span>
<span class="line"><span>    for(;;);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，让我们一起make vboxtest，应该很有成就感。一幅风景图呈现在我们面前，上面有Cosmos的版本、编译时间、CPU工作模式，内存大小等数据。这相当一个我们Cosmos的水印信息。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381810/c08ebf3fb25fddab6d4dbd24326aae83.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381810/c08ebf3fb25fddab6d4dbd24326aae83.jpg" alt=""></a></p><h4 id="初始化内存" tabindex="-1">初始化内存 <a class="header-anchor" href="#初始化内存" aria-label="Permalink to &quot;初始化内存&quot;">​</a></h4><p>首先，我们在Cosmos/hal/x86/下建立一个halmm.c文件，用于初始化内存，为了后面的内存管理器作好准备。</p><p>hal层的内存初始化比较容易，只要向内存管理器提供内存空间布局信息就可以。</p><p>你可能在想，不对啊，明明我们在二级引导器中已经获取了内存布局信息，是的， <strong>但Cosmos的内存管理器需要保存更多的信息，最好是顺序的内存布局信息，这样可以增加额外的功能属性，同时降低代码的复杂度。</strong></p><p>不难发现，BIOS提供的结构无法满足前面这些要求。不过我们也有办法解决，只要以BIOS提供的结构为基础，设计一套新的数据结构就搞定了。这个结构可以这样设计。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define PMR_T_OSAPUSERRAM 1</span></span>
<span class="line"><span>#define PMR_T_RESERVRAM 2</span></span>
<span class="line"><span>#define PMR_T_HWUSERRAM 8</span></span>
<span class="line"><span>#define PMR_T_ARACONRAM 0xf</span></span>
<span class="line"><span>#define PMR_T_BUGRAM 0xff</span></span>
<span class="line"><span>#define PMR_F_X86_32 (1&amp;lt;&amp;lt;0)</span></span>
<span class="line"><span>#define PMR_F_X86_64 (1&amp;lt;&amp;lt;1)</span></span>
<span class="line"><span>#define PMR_F_ARM_32 (1&amp;lt;&amp;lt;2)</span></span>
<span class="line"><span>#define PMR_F_ARM_64 (1&amp;lt;&amp;lt;3)</span></span>
<span class="line"><span>#define PMR_F_HAL_MASK 0xff</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef struct s_PHYMMARGE</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    spinlock_t pmr_lock;//保护这个结构是自旋锁</span></span>
<span class="line"><span>    u32_t pmr_type;     //内存地址空间类型</span></span>
<span class="line"><span>    u32_t pmr_stype;</span></span>
<span class="line"><span>    u32_t pmr_dtype;    //内存地址空间的子类型，见上面的宏</span></span>
<span class="line"><span>    u32_t pmr_flgs;     //结构的标志与状态</span></span>
<span class="line"><span>    u32_t pmr_stus;</span></span>
<span class="line"><span>    u64_t pmr_saddr;    //内存空间的开始地址</span></span>
<span class="line"><span>    u64_t pmr_lsize;    //内存空间的大小</span></span>
<span class="line"><span>    u64_t pmr_end;      //内存空间的结束地址</span></span>
<span class="line"><span>    u64_t pmr_rrvmsaddr;//内存保留空间的开始地址</span></span>
<span class="line"><span>    u64_t pmr_rrvmend;  //内存保留空间的结束地址</span></span>
<span class="line"><span>    void* pmr_prip;     //结构的私有数据指针，以后扩展所用</span></span>
<span class="line"><span>    void* pmr_extp;     //结构的扩展数据指针，以后扩展所用</span></span>
<span class="line"><span>}phymmarge_t;</span></span></code></pre></div><p>有些情况下内核要另起炉灶，不想把所有的内存空间都交给内存管理器去管理，所以要保留一部分内存空间，这就是上面结构中那两个pmr_rrvmsaddr、pmr_rrvmend字段的作用。</p><p>有了数据结构，我们还要写代码来操作它：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>u64_t initpmrge_core(e820map_t *e8sp, u64_t e8nr, phymmarge_t *pmargesp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t retnr = 0;</span></span>
<span class="line"><span>    for (u64_t i = 0; i &amp;lt; e8nr; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //根据一个e820map_t结构建立一个phymmarge_t结构</span></span>
<span class="line"><span>        if (init_one_pmrge(&amp;e8sp[i], &amp;pmargesp[i]) == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return retnr;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        retnr++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return retnr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void init_phymmarge()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    machbstart_t *mbsp = &amp;kmachbsp;</span></span>
<span class="line"><span>    phymmarge_t *pmarge_adr = NULL;</span></span>
<span class="line"><span>    u64_t pmrgesz = 0;</span></span>
<span class="line"><span>    //根据machbstart_t机器信息结构计算获得phymmarge_t结构的开始地址和大小</span></span>
<span class="line"><span>    ret_phymmarge_adrandsz(mbsp, &amp;pmarge_adr, &amp;pmrgesz);</span></span>
<span class="line"><span>    u64_t tmppmrphyadr = mbsp-&amp;gt;mb_nextwtpadr;</span></span>
<span class="line"><span>    e820map_t *e8p = (e820map_t *)((adr_t)(mbsp-&amp;gt;mb_e820padr));</span></span>
<span class="line"><span>    //建立phymmarge_t结构</span></span>
<span class="line"><span>    u64_t ipmgnr = initpmrge_core(e8p, mbsp-&amp;gt;mb_e820nr, pmarge_adr);</span></span>
<span class="line"><span>    //把phymmarge_t结构的地址大小个数保存machbstart_t机器信息结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_e820expadr = tmppmrphyadr;</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_e820exnr = ipmgnr;</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_e820exsz = ipmgnr * sizeof(phymmarge_t);</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_nextwtpadr = PAGE_ALIGN(mbsp-&amp;gt;mb_e820expadr + mbsp-&amp;gt;mb_e820exsz);</span></span>
<span class="line"><span>    //phymmarge_t结构中地址空间从低到高进行排序，我已经帮你写好了</span></span>
<span class="line"><span>    phymmarge_sort(pmarge_adr, ipmgnr);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合上面的代码，你会发现这是根据e820map_t结构数组，建立了一个phymmarge_t结构数组，init_one_pmrge函数正是把e820map_t结构中的信息复制到phymmarge_t结构中来。理解了这个原理，即使不看我的，你自己也会写。</p><p>下面我们把这些函数，用一个总管函数调动起来，这个总管函数叫什么名字好呢？当然是init_halmm，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_halmm()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_phymmarge();</span></span>
<span class="line"><span>    //init_memmgr();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里init_halmm函数中还调用了init_memmgr函数，这个正是这我们内存管理器初始化函数，我会在内存管理的那节课展开讲。而init_halmm函数将要被init_hal函数调用。</p><h4 id="初始化中断" tabindex="-1">初始化中断 <a class="header-anchor" href="#初始化中断" aria-label="Permalink to &quot;初始化中断&quot;">​</a></h4><p>什么是中断呢？为了帮你快速理解，我们先来看两种情景：</p><ol><li>你在开车时，突然汽车引擎坏了，你需要修复它才能继续驾驶汽车……</li><li>你在外旅游，你女朋友突然来电话了，你可以选择接电话或者不接电话，当然不接电话的后果很严重（笑）……</li></ol><p>在以上两种情景中，虽然不十分恰当，但都是在做一件事时，因为一些原因而要切换到另一件事上。其实计算机中的CPU也是一样，在做一件事时，因为一些原因要转而做另一件事，于是中断产生了……</p><p>根据原因的类型不同，中断被分为两类。</p><p>异常，这是同步的，原因是错误和故障，就像汽车引擎坏了。不修复错误就不能继续运行，所以这时，CPU会跳到这种错误的处理代码那里开始运行，运行完了会返回。</p><p>为啥说它是同步的呢？这是因为如果不修改程序中的错误，下次运行程序到这里同样会发生异常。</p><p>中断，这是异步的，我们通常说的中断就是这种类型，它是因为外部事件而产生的，就好像旅游时女朋友来电话了。通常设备需要CPU关注时，会给CPU发送一个中断信号，所以这时CPU会跳到处理这种事件的代码那里开始运行，运行完了会返回。</p><p>由于不确定何种设备何时发出这种中断信号，所以它是异步的。</p><p>在x86 CPU上，最多支持256个中断，还记得前面所说的中断表和中断门描述符吗，这意味着我们要准备256个中断门描述符和256个中断处理程序的入口。</p><p>下面我们来定义它，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_GATE</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        u16_t   offset_low;     /* 偏移 */</span></span>
<span class="line"><span>        u16_t   selector;       /* 段选择子 */</span></span>
<span class="line"><span>        u8_t    dcount;         /* 该字段只在调用门描述符中有效。如果在利用调用门调用子程序时引起特权级的转换和堆栈的改变，需要将外层堆栈中的参数复制到内层堆栈。该双字计数字段就是用于说明这种情况发生时，要复制的双字参数的数量。*/</span></span>
<span class="line"><span>        u8_t    attr;           /* P(1) DPL(2) DT(1) TYPE(4) */</span></span>
<span class="line"><span>        u16_t   offset_high;    /* 偏移的高位段 */</span></span>
<span class="line"><span>        u32_t   offset_high_h;</span></span>
<span class="line"><span>        u32_t   offset_resv;</span></span>
<span class="line"><span>}__attribute__((packed)) gate_t;</span></span>
<span class="line"><span>//定义中断表</span></span>
<span class="line"><span>HAL_DEFGLOB_VARIABLE(gate_t,x64_idt)[IDTMAX];</span></span></code></pre></div><p>说到这里你会发现，中断表其实是个gate_t结构的数组，由CPU的IDTR寄存器指向，IDTMAX为256。</p><p>但是光有数组还不行，还要设置其中的数据，下面我们就来设计这个函数，建立一个文件halsgdidt.c，在其中写一个函数，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//vector 向量也是中断号</span></span>
<span class="line"><span>//desc_type 中断门类型，中断门，陷阱门</span></span>
<span class="line"><span>//handler 中断处理程序的入口地址</span></span>
<span class="line"><span>//privilege 中断门的权限级别</span></span>
<span class="line"><span>void set_idt_desc(u8_t vector, u8_t desc_type, inthandler_t handler, u8_t privilege)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    gate_t *p_gate = &amp;x64_idt[vector];</span></span>
<span class="line"><span>    u64_t base = (u64_t)handler;</span></span>
<span class="line"><span>    p_gate-&amp;gt;offset_low = base &amp; 0xFFFF;</span></span>
<span class="line"><span>    p_gate-&amp;gt;selector = SELECTOR_KERNEL_CS;</span></span>
<span class="line"><span>    p_gate-&amp;gt;dcount = 0;</span></span>
<span class="line"><span>    p_gate-&amp;gt;attr = (u8_t)(desc_type | (privilege &amp;lt;&amp;lt; 5));</span></span>
<span class="line"><span>    p_gate-&amp;gt;offset_high = (u16_t)((base &amp;gt;&amp;gt; 16) &amp; 0xFFFF);</span></span>
<span class="line"><span>    p_gate-&amp;gt;offset_high_h = (u32_t)((base &amp;gt;&amp;gt; 32) &amp; 0xffffffff);</span></span>
<span class="line"><span>    p_gate-&amp;gt;offset_resv = 0;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码，正是按照要求，把这些数据填入中断门描述符中的。有了中断门之后，还差中断入口处理程序，中断入口处理程序只负责这三件事：</p><p>1.保护CPU 寄存器，即中断发生时的程序运行的上下文。</p><p>2.调用中断处理程序，这个程序可以是修复异常的，可以是设备驱动程序中对设备响应的程序。</p><p>3.恢复CPU寄存器，即恢复中断时程序运行的上下文，使程序继续运行。</p><p>以上这些操作又要用汇编代码才可以编写，我觉得这是内核中最重要的部分，所以我们建立一个文件，并用kernel.asm命名。</p><p>我们先来写好完成以上三个功能的汇编宏代码，避免写256遍同样的代码，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//保存中断后的寄存器</span></span>
<span class="line"><span>%macro	SAVEALL	0</span></span>
<span class="line"><span>	push rax</span></span>
<span class="line"><span>	push rbx</span></span>
<span class="line"><span>	push rcx</span></span>
<span class="line"><span>	push rdx</span></span>
<span class="line"><span>	push rbp</span></span>
<span class="line"><span>	push rsi</span></span>
<span class="line"><span>	push rdi</span></span>
<span class="line"><span>	push r8</span></span>
<span class="line"><span>	push r9</span></span>
<span class="line"><span>	push r10</span></span>
<span class="line"><span>	push r11</span></span>
<span class="line"><span>	push r12</span></span>
<span class="line"><span>	push r13</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	push r15</span></span>
<span class="line"><span>	xor r14,r14</span></span>
<span class="line"><span>	mov r14w,ds</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	mov r14w,es</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	mov r14w,fs</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	mov r14w,gs</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span>//恢复中断后寄存器</span></span>
<span class="line"><span>%macro	RESTOREALL	0</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov gs,r14w</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov fs,r14w</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov es,r14w</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov ds,r14w</span></span>
<span class="line"><span>	pop r15</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	pop r13</span></span>
<span class="line"><span>	pop r12</span></span>
<span class="line"><span>	pop r11</span></span>
<span class="line"><span>	pop r10</span></span>
<span class="line"><span>	pop r9</span></span>
<span class="line"><span>	pop r8</span></span>
<span class="line"><span>	pop rdi</span></span>
<span class="line"><span>	pop rsi</span></span>
<span class="line"><span>	pop rbp</span></span>
<span class="line"><span>	pop rdx</span></span>
<span class="line"><span>	pop rcx</span></span>
<span class="line"><span>	pop rbx</span></span>
<span class="line"><span>	pop rax</span></span>
<span class="line"><span>	iretq</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span>//保存异常下的寄存器</span></span>
<span class="line"><span>%macro	SAVEALLFAULT 0</span></span>
<span class="line"><span>	push rax</span></span>
<span class="line"><span>	push rbx</span></span>
<span class="line"><span>	push rcx</span></span>
<span class="line"><span>	push rdx</span></span>
<span class="line"><span>	push rbp</span></span>
<span class="line"><span>	push rsi</span></span>
<span class="line"><span>	push rdi</span></span>
<span class="line"><span>	push r8</span></span>
<span class="line"><span>	push r9</span></span>
<span class="line"><span>	push r10</span></span>
<span class="line"><span>	push r11</span></span>
<span class="line"><span>	push r12</span></span>
<span class="line"><span>	push r13</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	push r15</span></span>
<span class="line"><span>	xor r14,r14</span></span>
<span class="line"><span>	mov r14w,ds</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	mov r14w,es</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	mov r14w,fs</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>	mov r14w,gs</span></span>
<span class="line"><span>	push r14</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span>//恢复异常下寄存器</span></span>
<span class="line"><span>%macro	RESTOREALLFAULT	0</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov gs,r14w</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov fs,r14w</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov es,r14w</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	mov ds,r14w</span></span>
<span class="line"><span>	pop r15</span></span>
<span class="line"><span>	pop r14</span></span>
<span class="line"><span>	pop r13</span></span>
<span class="line"><span>	pop r12</span></span>
<span class="line"><span>	pop r11</span></span>
<span class="line"><span>	pop r10</span></span>
<span class="line"><span>	pop r9</span></span>
<span class="line"><span>	pop r8</span></span>
<span class="line"><span>	pop rdi</span></span>
<span class="line"><span>	pop rsi</span></span>
<span class="line"><span>	pop rbp</span></span>
<span class="line"><span>	pop rdx</span></span>
<span class="line"><span>	pop rcx</span></span>
<span class="line"><span>	pop rbx</span></span>
<span class="line"><span>	pop rax</span></span>
<span class="line"><span>	add rsp,8</span></span>
<span class="line"><span>	iretq</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span>//没有错误码CPU异常</span></span>
<span class="line"><span>%macro	SRFTFAULT 1</span></span>
<span class="line"><span>	push	  _NOERRO_CODE</span></span>
<span class="line"><span>	SAVEALLFAULT</span></span>
<span class="line"><span>	mov r14w,0x10</span></span>
<span class="line"><span>	mov ds,r14w</span></span>
<span class="line"><span>	mov es,r14w</span></span>
<span class="line"><span>	mov fs,r14w</span></span>
<span class="line"><span>	mov gs,r14w</span></span>
<span class="line"><span>	mov 	rdi,%1 ;rdi, rsi</span></span>
<span class="line"><span>	mov 	rsi,rsp</span></span>
<span class="line"><span>	call 	hal_fault_allocator</span></span>
<span class="line"><span>	RESTOREALLFAULT</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span>//CPU异常</span></span>
<span class="line"><span>%macro	SRFTFAULT_ECODE 1</span></span>
<span class="line"><span>	SAVEALLFAULT</span></span>
<span class="line"><span>	mov r14w,0x10</span></span>
<span class="line"><span>	mov ds,r14w</span></span>
<span class="line"><span>	mov es,r14w</span></span>
<span class="line"><span>	mov fs,r14w</span></span>
<span class="line"><span>	mov gs,r14w</span></span>
<span class="line"><span>	mov 	rdi,%1</span></span>
<span class="line"><span>	mov 	rsi,rsp</span></span>
<span class="line"><span>	call 	hal_fault_allocator</span></span>
<span class="line"><span>	RESTOREALLFAULT</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span>//硬件中断</span></span>
<span class="line"><span>%macro	HARWINT	1</span></span>
<span class="line"><span>	SAVEALL</span></span>
<span class="line"><span>	mov r14w,0x10</span></span>
<span class="line"><span>	mov ds,r14w</span></span>
<span class="line"><span>	mov es,r14w</span></span>
<span class="line"><span>	mov fs,r14w</span></span>
<span class="line"><span>	mov gs,r14w</span></span>
<span class="line"><span>	mov	rdi, %1</span></span>
<span class="line"><span>	mov 	rsi,rsp</span></span>
<span class="line"><span>	call    hal_intpt_allocator</span></span>
<span class="line"><span>	RESTOREALL</span></span>
<span class="line"><span>%endmacro</span></span></code></pre></div><p>别看前面的代码这么长，其实 <strong>最重要的只有两个指令：push、pop</strong>，这两个正是用来压入寄存器和弹出寄存器的，正好可以用来保存和恢复CPU所有的通用寄存器。</p><p>有的CPU异常，CPU自动把异常码压入到栈中，而有的CPU异常没有异常码， <strong>为了统一，我们对没有异常码的手动压入一个常数，维持栈的平衡。</strong></p><p>有了中断异常处理的宏，我们还要它们变成中断异常的处理程序入口点函数。汇编函数其实就是一个标号加一段汇编代码，C编译器把C语言函数编译成汇编代码后，也是标号加汇编代码，函数名就是标号。</p><p>下面我们在kernel.asm中写好它们：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//除法错误异常 比如除0</span></span>
<span class="line"><span>exc_divide_error:</span></span>
<span class="line"><span>	SRFTFAULT 0</span></span>
<span class="line"><span>//单步执行异常</span></span>
<span class="line"><span>exc_single_step_exception:</span></span>
<span class="line"><span>	SRFTFAULT 1</span></span>
<span class="line"><span>exc_nmi:</span></span>
<span class="line"><span>	SRFTFAULT 2</span></span>
<span class="line"><span>//调试断点异常</span></span>
<span class="line"><span>exc_breakpoint_exception:</span></span>
<span class="line"><span>	SRFTFAULT 3</span></span>
<span class="line"><span>//溢出异常</span></span>
<span class="line"><span>exc_overflow:</span></span>
<span class="line"><span>	SRFTFAULT 4</span></span>
<span class="line"><span>//段不存在异常</span></span>
<span class="line"><span>exc_segment_not_present:</span></span>
<span class="line"><span>	SRFTFAULT_ECODE 11</span></span>
<span class="line"><span>//栈异常</span></span>
<span class="line"><span>exc_stack_exception:</span></span>
<span class="line"><span>	SRFTFAULT_ECODE 12</span></span>
<span class="line"><span>//通用异常</span></span>
<span class="line"><span>exc_general_protection:</span></span>
<span class="line"><span>	SRFTFAULT_ECODE 13</span></span>
<span class="line"><span>//缺页异常</span></span>
<span class="line"><span>exc_page_fault:</span></span>
<span class="line"><span>	SRFTFAULT_ECODE 14</span></span>
<span class="line"><span>hxi_exc_general_intpfault:</span></span>
<span class="line"><span>	SRFTFAULT 256</span></span>
<span class="line"><span>//硬件1～7号中断</span></span>
<span class="line"><span>hxi_hwint00:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+0)</span></span>
<span class="line"><span>hxi_hwint01:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+1)</span></span>
<span class="line"><span>hxi_hwint02:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+2)</span></span>
<span class="line"><span>hxi_hwint03:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+3)</span></span>
<span class="line"><span>hxi_hwint04:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+4)</span></span>
<span class="line"><span>hxi_hwint05:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+5)</span></span>
<span class="line"><span>hxi_hwint06:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+6)</span></span>
<span class="line"><span>hxi_hwint07:</span></span>
<span class="line"><span>	HARWINT	(INT_VECTOR_IRQ0+7)</span></span></code></pre></div><p>为了突出重点，这里没有全部展示代码 ，你只用搞清原理就行了。那有了中断处理程序的入口地址，下面我们就可以在halsgdidt.c文件写出函数设置中断门描述符了，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_idt_descriptor()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//一开始把所有中断的处理程序设置为保留的通用处理程序</span></span>
<span class="line"><span>    for (u16_t intindx = 0; intindx &amp;lt;= 255; intindx++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        set_idt_desc((u8_t)intindx, DA_386IGate, hxi_exc_general_intpfault, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_DIVIDE, DA_386IGate, exc_divide_error, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_DEBUG, DA_386IGate, exc_single_step_exception, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_NMI, DA_386IGate, exc_nmi, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_BREAKPOINT, DA_386IGate, exc_breakpoint_exception, PRIVILEGE_USER);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_OVERFLOW, DA_386IGate, exc_overflow, PRIVILEGE_USER);</span></span>
<span class="line"><span>//篇幅所限，未全部展示</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_PAGE_FAULT, DA_386IGate, exc_page_fault, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_IRQ0 + 0, DA_386IGate, hxi_hwint00, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_IRQ0 + 1, DA_386IGate, hxi_hwint01, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_IRQ0 + 2, DA_386IGate, hxi_hwint02, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    set_idt_desc(INT_VECTOR_IRQ0 + 3, DA_386IGate, hxi_hwint03, PRIVILEGE_KRNL);</span></span>
<span class="line"><span>    //篇幅所限，未全部展示</span></span>
<span class="line"><span>     return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码已经很明显了，一开始把所有中断的处理程序设置为保留的通用处理程序，避免未知中断异常发生了CPU无处可去，然后对已知的中断和异常进一步设置，这会覆盖之前的通用处理程序，这样就可以确保万无一失。</p><p>下面我们把这些代码整理一下，安装到具体的调用路径上，让上层调用者调用到就好了。</p><p>我们依然在halintupt.c文件中写上init_halintupt()函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_halintupt()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_idt_descriptor();</span></span>
<span class="line"><span>    init_intfltdsc();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到此为止，CPU体系层面的中断就初始化完成了。你会发现，我们在init_halintupt()函数中还调用了 <strong>init_intfltdsc()函数</strong>，这个函数是干什么的呢？请往下看。</p><p>我们先来设计一下Cosmos的中断处理框架，后面我们把中断和异常统称为中断，因为它们的处理方式相同。</p><p>前面我们只是解决了中断的CPU相关部分，而CPU只是响应中断，但是并不能解决产生中断的问题。</p><p>比如缺页中断来了，我们要解决内存地址映射关系，程序才可以继续运行。再比如硬盘中断来了，我们要读取硬盘的数据，要处理这问题，就要写好相应的处理函数。</p><p>因为有些处理是内核所提供的，而有些处理函数是设备驱动提供的，想让它们和中断关联起来，就要好好设计 <strong>中断处理框架</strong> 了。</p><p>下面我们来画幅图，描述中断框架的设计：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381810/fd2cd9e5b63cd7e52cd68b65e81aee7a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381810/fd2cd9e5b63cd7e52cd68b65e81aee7a.jpg" alt=""></a></p><p>可以看到，中断、异常分发器的左侧的东西我们已经处理完成，下面需要写好中断、异常分发器和中断异常描述符。</p><p>我们先来搞定中断异常描述，结合框架图，中断异常描述也是个表，它在C语言中就是个结构数组，让我们一起来写好这个数组：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_INTFLTDSC{</span></span>
<span class="line"><span>    spinlock_t  i_lock;</span></span>
<span class="line"><span>    u32_t       i_flg;</span></span>
<span class="line"><span>    u32_t       i_stus;</span></span>
<span class="line"><span>    uint_t      i_prity;        //中断优先级</span></span>
<span class="line"><span>    uint_t      i_irqnr;        //中断号</span></span>
<span class="line"><span>    uint_t      i_deep;         //中断嵌套深度</span></span>
<span class="line"><span>    u64_t       i_indx;         //中断计数</span></span>
<span class="line"><span>    list_h_t    i_serlist;      //也可以使用中断回调函数的方式</span></span>
<span class="line"><span>    uint_t      i_sernr;        //中断回调函数个数</span></span>
<span class="line"><span>    list_h_t    i_serthrdlst;   //中断线程链表头</span></span>
<span class="line"><span>    uint_t      i_serthrdnr;    //中断线程个数</span></span>
<span class="line"><span>    void*       i_onethread;    //只有一个中断线程时直接用指针</span></span>
<span class="line"><span>    void*       i_rbtreeroot;   //如果中断线程太多则按优先级组成红黑树</span></span>
<span class="line"><span>    list_h_t    i_serfisrlst;</span></span>
<span class="line"><span>    uint_t      i_serfisrnr;</span></span>
<span class="line"><span>    void*       i_msgmpool;     //可能的中断消息池</span></span>
<span class="line"><span>    void*       i_privp;</span></span>
<span class="line"><span>    void*       i_extp;</span></span>
<span class="line"><span>}intfltdsc_t;</span></span></code></pre></div><p>上面结构中，记录了中断的优先级。因为有些中断可以稍后执行，而有的中断需要紧急执行，所以要设计一个优先级。其中还有中断号，中断计数等统计信息。</p><p>中断可以由线程的方式执行，也可以是一个回调函数，该函数的地址放另一个结构体中，这个结构体我已经帮你写好了，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef drvstus_t (*intflthandle_t)(uint_t ift_nr,void* device,void* sframe); //中断处理函数的指针类型</span></span>
<span class="line"><span>typedef struct s_INTSERDSC{</span></span>
<span class="line"><span>    list_h_t    s_list;        //在中断异常描述符中的链表</span></span>
<span class="line"><span>    list_h_t    s_indevlst;    //在设备描述描述符中的链表</span></span>
<span class="line"><span>    u32_t       s_flg;</span></span>
<span class="line"><span>    intfltdsc_t* s_intfltp;    //指向中断异常描述符</span></span>
<span class="line"><span>    void*       s_device;      //指向设备描述符</span></span>
<span class="line"><span>    uint_t      s_indx;</span></span>
<span class="line"><span>    intflthandle_t s_handle;   //中断处理的回调函数指针</span></span>
<span class="line"><span>}intserdsc_t;</span></span></code></pre></div><p>如果内核或者设备驱动程序要安装一个中断处理函数，就要先申请一个intserdsc_t结构体，然后把中断函数的地址写入其中，最后把这个结构挂载到对应的intfltdsc_t结构中的i_serlist链表中。</p><p>你可能要问了，为什么不能直接把中断处理函数放在intfltdsc_t结构中呢，还要多此一举搞个intserdsc_t结构体呢？</p><p>这是因为我们的计算机中可能有很多设备，每个设备都可能产生中断，但是中断控制器的中断信号线是有限的。你可以这样理解：中断控制器最多只能产生几十号中断号，而设备不止几十个，所以会有多个设备共享一根中断信号线。</p><p>这就导致一个中断发生后，无法确定是哪个设备产生的中断，所以我们干脆让设备驱动程序来决定，因为它是最了解设备的。</p><p>这里我们让这个intfltdsc_t结构上的所有中断处理函数都依次执行，查看是不是自己的设备产生了中断，如果是就处理，不是则略过。</p><p>好，明白了这两个结构之后，我们就要开始初始化了。首先是在halglobal.c文件定义intfltdsc_t结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义intfltdsc_t结构数组大小为256</span></span>
<span class="line"><span>HAL_DEFGLOB_VARIABLE(intfltdsc_t,machintflt)[IDTMAX];</span></span></code></pre></div><p>下面我们再来实现中断、异常分发器函数，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//中断处理函数</span></span>
<span class="line"><span>void hal_do_hwint(uint_t intnumb, void *krnlsframp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    intfltdsc_t *ifdscp = NULL;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    //根据中断号获取中断异常描述符地址</span></span>
<span class="line"><span>    ifdscp = hal_retn_intfltdsc(intnumb);</span></span>
<span class="line"><span>    //对断异常描述符加锁并中断</span></span>
<span class="line"><span>    hal_spinlock_saveflg_cli(&amp;ifdscp-&amp;gt;i_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    ifdscp-&amp;gt;i_indx++;</span></span>
<span class="line"><span>    ifdscp-&amp;gt;i_deep++;</span></span>
<span class="line"><span>    //运行中断处理的回调函数</span></span>
<span class="line"><span>    hal_run_intflthandle(intnumb, krnlsframp);</span></span>
<span class="line"><span>    ifdscp-&amp;gt;i_deep--;</span></span>
<span class="line"><span>    //解锁并恢复中断状态</span></span>
<span class="line"><span>    hal_spinunlock_restflg_sti(&amp;ifdscp-&amp;gt;i_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//异常分发器</span></span>
<span class="line"><span>void hal_fault_allocator(uint_t faultnumb, void *krnlsframp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //我们的异常处理回调函数也是放在中断异常描述符中的</span></span>
<span class="line"><span>    hal_do_hwint(faultnumb, krnlsframp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//中断分发器</span></span>
<span class="line"><span>void hal_hwint_allocator(uint_t intnumb, void *krnlsframp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    hal_do_hwint(intnumb, krnlsframp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>前面的代码确实是按照我们的中断框架设计实现的，下面我们去实现hal_run_intflthandle函数，它负责调用中断处理的回调函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void hal_run_intflthandle(uint_t ifdnr, void *sframe)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    intserdsc_t *isdscp;</span></span>
<span class="line"><span>    list_h_t *lst;</span></span>
<span class="line"><span>    //根据中断号获取中断异常描述符地址</span></span>
<span class="line"><span>    intfltdsc_t *ifdscp = hal_retn_intfltdsc(ifdnr);</span></span>
<span class="line"><span>    //遍历i_serlist链表</span></span>
<span class="line"><span>    list_for_each(lst, &amp;ifdscp-&amp;gt;i_serlist)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //获取i_serlist链表上对象即intserdsc_t结构</span></span>
<span class="line"><span>        isdscp = list_entry(lst, intserdsc_t, s_list);</span></span>
<span class="line"><span>        //调用中断处理回调函数</span></span>
<span class="line"><span>        isdscp-&amp;gt;s_handle(ifdnr, isdscp-&amp;gt;s_device, sframe);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码已经很清楚了，循环遍历intfltdsc_t结构中，i_serlist链表上所有挂载的intserdsc_t结构，然后调用intserdsc_t结构中的中断处理的回调函数。</p><p>我们Cosmos链表借用了Linux所用的链表，代码我已经帮你写好了，放在了list.h和list_t.h文件中，请自行查看。</p><h4 id="初始化中断控制器" tabindex="-1">初始化中断控制器 <a class="header-anchor" href="#初始化中断控制器" aria-label="Permalink to &quot;初始化中断控制器&quot;">​</a></h4><p>我们把CPU端的中断搞定了以后，还有设备端的中断，这个可以交给设备驱动程序，但是CPU和设备之间的中断控制器，还需要我们出面解决。</p><p>多个设备的中断信号线都会连接到中断控制器上，中断控制器可以决定启用或者屏蔽哪些设备的中断，还可以决定设备中断之间的优先线，所以它才叫中断控制器。</p><p>x86平台上的中断控制器有多种，最开始是8259A，然后是IOAPIC，最新的是MSI-X。为了简单的说明原理，我们选择了8259A中断控制器。</p><p>8259A在任何x86平台上都可以使用，x86平台使用了两片8259A芯片，以级联的方式存在。它拥有15个中断源（即可以有15个中断信号接入）。让我们看看8259A在系统上的框架图：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381810/4d81f7feb668abf30c5cced619549709.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381810/4d81f7feb668abf30c5cced619549709.jpg" alt=""></a></p><p>上面直接和CPU连接的是主8259A，下面的是从8259A，每一个8259A芯片都有两个I/O端口，我们可以通过它们对8259A进行编程。主8259A的端口地址是0x20，0x21；从8259A的端口地址是0xA0，0xA1。</p><p>下面我们来做代码初始化，我们程序员可以向8259A写两种命令字： ICW和OCW；ICW这种命令字用来实现8259a芯片的初始化。而OCW这种命令用来向8259A发布命令，以对其进行控制。OCW可以在8259A被初始化之后的任何时候被使用。</p><p>我已经把代码定好了，放在了8259.c文件中，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_i8259()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化主从8259a</span></span>
<span class="line"><span>    out_u8_p(ZIOPT, ICW1);</span></span>
<span class="line"><span>    out_u8_p(SIOPT, ICW1);</span></span>
<span class="line"><span>    out_u8_p(ZIOPT1, ZICW2);</span></span>
<span class="line"><span>    out_u8_p(SIOPT1, SICW2);</span></span>
<span class="line"><span>    out_u8_p(ZIOPT1, ZICW3);</span></span>
<span class="line"><span>    out_u8_p(SIOPT1, SICW3);</span></span>
<span class="line"><span>    out_u8_p(ZIOPT1, ICW4);</span></span>
<span class="line"><span>    out_u8_p(SIOPT1, ICW4);</span></span>
<span class="line"><span>    //屏蔽全部中断源</span></span>
<span class="line"><span>    out_u8_p(ZIOPT1, 0xff);</span></span>
<span class="line"><span>    out_u8_p(SIOPT1, 0xff);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果你要了解8259A的细节，就是上述代码中为什么要写入这些数据，你可以自己在Intel官方网站上搜索8259A的数据手册，自行查看。</p><p>这里你只要在init_halintupt()函数的最后，调用这个函数就行。你有没有想过，既然我们是研究操作系统不是要写硬件驱动，为什么要在初始化中断控制器后，屏蔽所有的中断源呢？因为我们Cosmos在初始化阶段还不能处理中断。</p><p>到此，我们的Cosmos的hal层初始化就结束了。关于内存管理器的初始化，我会在内存管理模块讲解，你先有个印象就行。</p><h3 id="进入内核层" tabindex="-1">进入内核层 <a class="header-anchor" href="#进入内核层" aria-label="Permalink to &quot;进入内核层&quot;">​</a></h3><p>hal层的初始化已经完成，按照前面的设计，我们的Cosmos还有内核层，我们下面就要进入到内核层，建立一个文件，写上一个函数，作为本课程的结尾。</p><p>但是这个函数是个 <strong>空函数</strong>，目前什么也不做，它是为Cosmos内核层初始化而存在的，但是由于课程只进行到这里，所以我只是写个空函数，为后面的课程做好准备。</p><p>由于内核层是从hal层进入的，必须在hal_start()函数中被调用，所以在此完成这个函数——init_krl()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_krl()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //禁止函数返回</span></span>
<span class="line"><span>    die(0);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面我们在hal_start()函数中调用它就行了，如下所示</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void hal_start()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化Cosmos的hal层</span></span>
<span class="line"><span>    init_hal();</span></span>
<span class="line"><span>    //初始化Cosmos的内核层</span></span>
<span class="line"><span>    init_krl();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上面的代码中，不难发现Cosmos的hal层初始化完成后，就自动进入了Cosmos内核层的初始化。至此本课程已经结束。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>写一个C函数是容易的，但是写操作系统的第一个C函数并不容易，好在我们一路坚持，没有放弃，才取得了这个阶段性的胜利。但温故而知新，对学过的东西要学而时习之，下面我们来回顾一下本课程的重点。</p><p>1.Cosmos的第一个C函数产生了，它十分简单但极其有意义，它的出现标志着C语言的运行环境已经完善。从此我们可以用C语言高效地开发操作系统了，由爬行时代进入了跑步前行的状态，可喜可贺。</p><p>2.第一个C函数，干的第一件重要工作就是 <strong>调用hal层的初始化函数。</strong> 这个初始化函数首先初始化了平台，初始化了机器信息结构供内核的其它代码使用，还初始化了我们图形显示驱动、显示了背景图片；其次是初始化了内存管理相关的数据结构；接着初始了中断，中断处理框架是两层，所以最为复杂；最后初始化了中断控制器。</p><p>3.当hal层初始化完成了，我们就进入了内核层，由于到了课程的尾声，我们先暂停在这里。</p><p>在这节课里我帮你写了很多代码，那些代码非常简单和枯燥，但是必须要有它们才可以。综合我们前面讲过的知识，我相信你有能力看懂它们。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你梳理一下，Cosmos hal层的函数调用关系。</p><p>欢迎你在留言区跟我交流互动，也欢迎把这节课转发给你的朋友和同事。</p><p>好，我是LMOS，咱们下节课见！</p>`,140)])])}const g=n(e,[["render",i]]);export{h as __pageData,g as default};
