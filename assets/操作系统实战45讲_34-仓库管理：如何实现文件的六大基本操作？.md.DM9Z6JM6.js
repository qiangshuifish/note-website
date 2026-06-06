import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"34 | 仓库管理：如何实现文件的六大基本操作？","description":"","frontmatter":{},"headers":[{"level":2,"title":"辅助操作","slug":"辅助操作","link":"#辅助操作","children":[{"level":3,"title":"操作根目录文件","slug":"操作根目录文件","link":"#操作根目录文件","children":[]},{"level":3,"title":"获取文件名","slug":"获取文件名","link":"#获取文件名","children":[]},{"level":3,"title":"判断文件是否存在","slug":"判断文件是否存在","link":"#判断文件是否存在","children":[]}]},{"level":2,"title":"文件相关的操作","slug":"文件相关的操作","link":"#文件相关的操作","children":[{"level":3,"title":"新建文件","slug":"新建文件","link":"#新建文件","children":[]},{"level":3,"title":"删除文件","slug":"删除文件","link":"#删除文件","children":[]},{"level":3,"title":"打开文件","slug":"打开文件","link":"#打开文件","children":[]},{"level":3,"title":"读写文件","slug":"读写文件","link":"#读写文件","children":[]},{"level":3,"title":"关闭文件","slug":"关闭文件","link":"#关闭文件","children":[]}]},{"level":2,"title":"串联整合","slug":"串联整合","link":"#串联整合","children":[]},{"level":2,"title":"测试","slug":"测试","link":"#测试","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/34-仓库管理：如何实现文件的六大基本操作？.md","filePath":"操作系统实战45讲/34-仓库管理：如何实现文件的六大基本操作？.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/34-仓库管理：如何实现文件的六大基本操作？.md"};function i(t,s,r,c,d,f){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_34-仓库管理-如何实现文件的六大基本操作" tabindex="-1">34 | 仓库管理：如何实现文件的六大基本操作？ <a class="header-anchor" href="#_34-仓库管理-如何实现文件的六大基本操作" aria-label="Permalink to &quot;34 | 仓库管理：如何实现文件的六大基本操作？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>我们在上一节课中，已经建立了仓库，并对仓库进行了划分，就是文件系统的格式化。有了仓库就需要往里面存取东西，对于我们的仓库来说，就是存取应用程序的文件。</p><p>所以今天我们要给仓库增加一些相关的操作，这些操作主要用于新建、打开、关闭、读写文件，它们也是文件系统的标准功能，自然即使我们这个最小的文件系统，也必须要支持。</p><p>好了，话不多说，我们开始吧。这节课的配套代码，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson34/Cosmos" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="辅助操作" tabindex="-1">辅助操作 <a class="header-anchor" href="#辅助操作" aria-label="Permalink to &quot;辅助操作&quot;">​</a></h2><p>通过上一节课的学习，我们了解了文件系统格式化操作，不难发现文件系统格式化并不复杂，但是它们需要大量的辅助函数。同样的，完成文件相关的操作，我们也需要大量的辅助函数。为了让你更加清楚每个实现细节，这里我们先来实现文件操作相关的辅助函数。</p><h3 id="操作根目录文件" tabindex="-1">操作根目录文件 <a class="header-anchor" href="#操作根目录文件" aria-label="Permalink to &quot;操作根目录文件&quot;">​</a></h3><p>根据我们文件系统的设计，不管是新建、删除、打开一个文件，首先都要找到与该文件对应的rfsdir_t结构。</p><p>在我们的文件系统中，一个文件的rfsdir_t结构就储存在根目录文件中，所以想要读取文件对应的rfsdir_t结构，首先就要获取和释放根目录文件。</p><p>下面我们来实现获取和释放根目录文件的函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//获取根目录文件</span></span>
<span class="line"><span>void* get_rootdirfile_blk(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void* retptr = NULL;</span></span>
<span class="line"><span>    rfsdir_t* rtdir = get_rootdir(devp);//获取根目录文件的rfsdir_t结构</span></span>
<span class="line"><span>    //分配4KB大小的缓冲区并清零</span></span>
<span class="line"><span>    void* buf = new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    hal_memset(buf, FSYS_ALCBLKSZ, 0);</span></span>
<span class="line"><span>    //读取根目录文件的逻辑储存块到缓冲区中</span></span>
<span class="line"><span>    read_rfsdevblk(devp, buf, rtdir-&amp;gt;rdr_blknr)</span></span>
<span class="line"><span>    retptr = buf;//设置缓冲区的首地址为返回值</span></span>
<span class="line"><span>    goto errl1;</span></span>
<span class="line"><span>errl:</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>errl1:</span></span>
<span class="line"><span>    del_rootdir(devp, rtdir);//释放根目录文件的rfsdir_t结构</span></span>
<span class="line"><span>    return retptr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放根目录文件</span></span>
<span class="line"><span>void del_rootdirfile_blk(device_t* devp,void* blkp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //因为逻辑储存块的头512字节的空间中，保存的就是fimgrhd_t结构</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)blkp;</span></span>
<span class="line"><span>    //把根目录文件回写到储存设备中去，块号为fimgrhd_t结构自身所在的块号</span></span>
<span class="line"><span>    write_rfsdevblk(devp, blkp, fmp-&amp;gt;fmd_sfblk)</span></span>
<span class="line"><span>    //释放缓冲区</span></span>
<span class="line"><span>    del_buf(blkp, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，get_rootdir函数的作用就是读取文件系统超级块中rfsdir_t结构到一个缓冲区中，del_rootdir函数则是用来释放这个缓冲区，其代码非常简单，我已经帮你写好了。</p><p>获取根目录文件的方法也很容易，根据超级块中的rfsdir_t结构中的信息，读取根目录文件的逻辑储存块就行了。而释放根目录文件，就是把根目录文件的储存块回写到储存设备中去，最后释放对应的缓冲区就可以了。</p><h3 id="获取文件名" tabindex="-1">获取文件名 <a class="header-anchor" href="#获取文件名" aria-label="Permalink to &quot;获取文件名&quot;">​</a></h3><p>下面我们来实现获取文件名，在我们的印象中，一个完整的文件名应该是这样的“/cosmos/drivers/drvrfs.c”，这样的文件名包含了完整目录路径。</p><p>除了第一个“/”是根目录外，其它的“/”只是一个目录路径分隔符。然而，在很多情况下，我们通常需要把目录路径分隔符去除，提取其中的目录名称或者文件名称。为了简化问题，我们对文件系统来点限制，我们的文件名只能是“/xxxx”这种类型的。</p><p>下面我们就来实现去除路径分隔符提取文件名称的函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//检查文件路径名</span></span>
<span class="line"><span>sint_t rfs_chkfilepath(char_t* fname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    char_t* chp = fname;</span></span>
<span class="line"><span>    //检查文件路径名的第一个字符是否为“/”，不是则返回2</span></span>
<span class="line"><span>    if(chp[0] != &#39;/&#39;) { return 2; }</span></span>
<span class="line"><span>    for(uint_t i = 1; ; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //检查除第1个字符外其它字符中还有没有为“/”的，有就返回3</span></span>
<span class="line"><span>        if(chp[i] == &#39;/&#39;) { return 3; }</span></span>
<span class="line"><span>        //如果这里i大于等于文件名称的最大长度，就返回4</span></span>
<span class="line"><span>        if(i &amp;gt;= DR_NM_MAX) { return 4; }</span></span>
<span class="line"><span>        //到文件路径字符串的末尾就跳出循环</span></span>
<span class="line"><span>        if(chp[i] == 0 &amp;&amp; i &amp;gt; 1) { break; }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //返回0表示正确</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//提取纯文件名</span></span>
<span class="line"><span>sint_t rfs_ret_fname(char_t* buf,char_t* fpath)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //检查文件路径名是不是“/xxxx”的形式</span></span>
<span class="line"><span>    sint_t stus = rfs_chkfilepath(fpath);</span></span>
<span class="line"><span>    //如果不为0就直接返回这个状态值表示错误</span></span>
<span class="line"><span>    if(stus != 0) { return stus; }</span></span>
<span class="line"><span>    //从路径名字符串的第2个字符开始复制字符到buf中</span></span>
<span class="line"><span>    rfs_strcpy(&amp;fpath[1], buf);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，完成获取文件名的是rfs_ret_fname函数，这个函数可以把fpath指向的路径名中的文件名提取出来，放到buf指向的缓冲区中，但在这之前，需要先调用rfs_chkfilepath函数检查路径名是不是“/xxxx”的形式，这是这个功能正常实现的必要条件。</p><h3 id="判断文件是否存在" tabindex="-1">判断文件是否存在 <a class="header-anchor" href="#判断文件是否存在" aria-label="Permalink to &quot;判断文件是否存在&quot;">​</a></h3><p>获取了文件名称，我们还需要实现这样一个功能：判断一个文件是否存在。因为新建和删除文件，要先判断储存设备里是不是存在着这个文件。具体来说，新建文件时，无法新建相同文件名的文件；删除文件时，不能删除不存在的文件。</p><p>我们一起通过后面这个函数还完成这个功能，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sint_t rfs_chkfileisindev(device_t* devp,char_t* fname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    sint_t rets = 6;</span></span>
<span class="line"><span>    sint_t ch = rfs_strlen(fname);//获取文件名的长度，注意不是文件路径名</span></span>
<span class="line"><span>    //检查文件名的长度是不是合乎要求</span></span>
<span class="line"><span>    if(ch &amp;lt; 1 || ch &amp;gt;= (sint_t)DR_NM_MAX) { return 4; }</span></span>
<span class="line"><span>    void* rdblkp = get_rootdirfile_blk(devp);</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)rdblkp;</span></span>
<span class="line"><span>    //检查该fimgrhd_t结构的类型是不是FMD_DIR_TYPE，即这个文件是不是目录文件</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_type != FMD_DIR_TYPE) { rets = 3; goto err; }</span></span>
<span class="line"><span>    //检查根目录文件是不是为空，即没有写入任何数据，所以返回0，表示根目录下没有对应的文件</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_curfwritebk == fmp-&amp;gt;fmd_fleblk[0].fb_blkstart &amp;&amp;</span></span>
<span class="line"><span> fmp-&amp;gt;fmd_curfinwbkoff == fmp-&amp;gt;fmd_fileifstbkoff) {</span></span>
<span class="line"><span>        rets = 0; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rfsdir_t* dirp = (rfsdir_t*)((uint_t)(fmp) + fmp-&amp;gt;fmd_fileifstbkoff);//指向根目录文件的第一个字节</span></span>
<span class="line"><span>    //指向根目录文件的结束地址</span></span>
<span class="line"><span>    void* maxchkp = (void*)((uint_t)rdblkp + FSYS_ALCBLKSZ - 1);</span></span>
<span class="line"><span>    //当前的rfsdir_t结构的指针比根目录文件的结束地址小，就继续循环</span></span>
<span class="line"><span>    for(;(void*)dirp &amp;lt; maxchkp;) {</span></span>
<span class="line"><span>        //如果这个rfsdir_t结构的类型是RDR_FIL_TYPE，说明它对应的是文件而不是目录，所以下面就继续比较其文件名</span></span>
<span class="line"><span>        if(dirp-&amp;gt;rdr_type == RDR_FIL_TYPE) {</span></span>
<span class="line"><span>            if(rfs_strcmp(dirp-&amp;gt;rdr_name,fname) == 1) {//比较其文件名</span></span>
<span class="line"><span>                rets = 1; goto err;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        dirp++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = 0; //到了这里说明没有找到相同的文件</span></span>
<span class="line"><span>err:</span></span>
<span class="line"><span>    del_rootdirfile_blk(devp,rdblkp);//释放根目录文件</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，rfs_chkfileisindev函数逻辑很简单。首先是检查文件名的长度，接着获取了根目录文件，然后遍历根其中的所有rfsdir_t结构并比较文件名是否相同，相同就返回1，不同就返回其它值，最后释放了根目录文件。</p><p>因为get_rootdirfile_blk函数已经把根目录文件读取到内存里了，所以可以用dirp指针和maxchkp指针操作其中的数据。</p><p>好了，操作根目录文件、获取文件名、判断一个文件是否存在的三大函数就实现了，有了它们，再去实现文件相关的其它操作就方便多了，我们接着探索。</p><h2 id="文件相关的操作" tabindex="-1">文件相关的操作 <a class="header-anchor" href="#文件相关的操作" aria-label="Permalink to &quot;文件相关的操作&quot;">​</a></h2><p>直到现在，我们还没对任何文件进行操作，而我们实现文件系统，就是为了应用程序更好地存放自己的“劳动成果”——文件，因此一个文件系统必须要支持一些文件操作。</p><p>下面我们将依次实现新建、删除、打开、读写以及关闭文件，这几大文件操作，这也是文件系统需要提供的最基本的功能。</p><h3 id="新建文件" tabindex="-1">新建文件 <a class="header-anchor" href="#新建文件" aria-label="Permalink to &quot;新建文件&quot;">​</a></h3><p>在没有文件之前，对任何文件本身的操作都是无效的，所以我们首先就要实现新建文件这个功能。</p><p>在写代码之前，我们还是先来看一看如何新建一个文件，一共可以分成后面这4步。</p><p>1.从文件路径名中提取出纯文件名，检查储存设备上是否已经存在这个文件。</p><p>2.分配一个空闲的逻辑储存块，并在根目录文件的末尾写入这个新建文件对应的rfsdir_t结构。</p><p>3.在一个新的4KB大小的缓冲区中，初始化新建文件对应的fimgrhd_t结构。</p><p>4.把第3步对应的缓冲区里的数据，写入到先前分配的空闲逻辑储存块中。</p><p>下面我们先来写好新建文件的接口函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//新建文件的接口函数</span></span>
<span class="line"><span>drvstus_t rfs_new_file(device_t* devp, char_t* fname, uint_t flg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //在栈中分配一个字符缓冲区并清零</span></span>
<span class="line"><span>    char_t fne[DR_NM_MAX];</span></span>
<span class="line"><span>    hal_memset((void*)fne, DR_NM_MAX, 0);</span></span>
<span class="line"><span>    //从文件路径名中提取出纯文件名</span></span>
<span class="line"><span>    if(rfs_ret_fname(fne, fname) != 0) { return DFCERRSTUS; }</span></span>
<span class="line"><span>    //检查储存介质上是否已经存在这个新建的文件，如果是则返回错误</span></span>
<span class="line"><span>    if(rfs_chkfileisindev(devp, fne) != 0) {return DFCERRSTUS; }</span></span>
<span class="line"><span>    //调用实际建立文件的函数</span></span>
<span class="line"><span>    return rfs_new_dirfileblk(devp, fne, RDR_FIL_TYPE, 0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们在新建文件的接口函数中，就实现了前面第一步，完成了提取文件名和检查文件是否在储存设备中存在的工作。接着我们来实现真正新建文件的函数，就是上述代码中rfs_new_dirfileblk函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_new_dirfileblk(device_t* devp,char_t* fname,uint_t flgtype,uint_t val)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    drvstus_t rets = DFCERRSTUS;</span></span>
<span class="line"><span>    void* buf = new_buf(FSYS_ALCBLKSZ);//分配一个4KB大小的缓冲区</span></span>
<span class="line"><span>    hal_memset(buf, FSYS_ALCBLKSZ, 0);//清零该缓冲区</span></span>
<span class="line"><span>    uint_t fblk = rfs_new_blk(devp);//分配一个新的空闲逻辑储存块</span></span>
<span class="line"><span>    void* rdirblk = get_rootdirfile_blk(devp);//获取根目录文件</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)rdirblk;</span></span>
<span class="line"><span>    //指向文件当前的写入地址，因为根目录文件已经被读取到内存中了</span></span>
<span class="line"><span>    rfsdir_t* wrdirp = (rfsdir_t*)((uint_t)rdirblk + fmp-&amp;gt;fmd_curfinwbkoff);</span></span>
<span class="line"><span>    //对文件当前的写入地址进行检查</span></span>
<span class="line"><span>    if(((uint_t)wrdirp) &amp;gt;= ((uint_t)rdirblk + FSYS_ALCBLKSZ)) {</span></span>
<span class="line"><span>        rets=DFCERRSTUS; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    wrdirp-&amp;gt;rdr_stus = 0;</span></span>
<span class="line"><span>    wrdirp-&amp;gt;rdr_type = flgtype;//设为文件类型</span></span>
<span class="line"><span>    wrdirp-&amp;gt;rdr_blknr = fblk;//设为刚刚分配的空闲逻辑储存块</span></span>
<span class="line"><span>    rfs_strcpy(fname, wrdirp-&amp;gt;rdr_name);//把文件名复制到rfsdir_t结构</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_filesz += (uint_t)(sizeof(rfsdir_t));//增加根目录文件的大小</span></span>
<span class="line"><span>    //增加根目录文件当前的写入地址，保证下次不被覆盖</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_curfinwbkoff += (uint_t)(sizeof(rfsdir_t));</span></span>
<span class="line"><span>    fimgrhd_t* ffmp = (fimgrhd_t*)buf;//指向新分配的缓冲区</span></span>
<span class="line"><span>    fimgrhd_t_init(ffmp);//调用fimgrhd_t结构默认的初始化函数</span></span>
<span class="line"><span>    ffmp-&amp;gt;fmd_type = FMD_FIL_TYPE;//因为建立的是文件，所以设为文件类型</span></span>
<span class="line"><span>    ffmp-&amp;gt;fmd_sfblk = fblk;//把自身所在的块，设为分配的逻辑储存块</span></span>
<span class="line"><span>    ffmp-&amp;gt;fmd_curfwritebk = fblk;//把当前写入的块，设为分配的逻辑储存块</span></span>
<span class="line"><span>    ffmp-&amp;gt;fmd_curfinwbkoff = 0x200;//把当前写入块的写入偏移量设为512</span></span>
<span class="line"><span>    //把文件储存块数组的第1个元素的开始块，设为刚刚分配的空闲逻辑储存块</span></span>
<span class="line"><span>    ffmp-&amp;gt;fmd_fleblk[0].fb_blkstart = fblk;</span></span>
<span class="line"><span>    //因为只分配了一个逻辑储存块，所以设为1</span></span>
<span class="line"><span>    ffmp-&amp;gt;fmd_fleblk[0].fb_blknr = 1;</span></span>
<span class="line"><span>    //把缓冲区中的数据写入到刚刚分配的空闲逻辑储存块中</span></span>
<span class="line"><span>    if(write_rfsdevblk(devp, buf, fblk) == DFCERRSTUS) {</span></span>
<span class="line"><span>        rets = DFCERRSTUS; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = DFCOKSTUS;</span></span>
<span class="line"><span>err:</span></span>
<span class="line"><span>    del_rootdirfile_blk(devp, rdirblk);//释放根目录文件</span></span>
<span class="line"><span>err1:</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ);//释放缓冲区</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看完上述代码，我想提醒你，在rfs_new_dirfileblk函数中有两点很关键。</p><p>第一，前面反复提到的目录文件中存放的就是 <strong>一系列的rfsdir_t结构</strong>。</p><p>第二，fmp和ffmp这两个指针很重要。fmp指针指向的是根目录文件的fimgrhd_t结构，因为要写入一个新的rfsdir_t结构，所以要获取并改写根目录文件的fimgrhd_t结构中的数据。而ffmp指针指向的是新建文件的fimgrhd_t结构，并且初始化了其中的一些数据。最后，该函数把这个缓冲区中的数据写入到分配的空闲逻辑储存块中，同时释放了根目录文件和缓冲区。</p><h3 id="删除文件" tabindex="-1">删除文件 <a class="header-anchor" href="#删除文件" aria-label="Permalink to &quot;删除文件&quot;">​</a></h3><p>新建文件的操作完成了，下面我们来实现删除文件的操作。</p><p>如果只能新建文件而不能删除文件，那么储存设备的空间最终会耗尽，所以文件系统就必须支持删除文件的操作。</p><p>同样的，还是先来了解删除文件的方法。删除文件可以通过后面这4步来实现。</p><p>1.从文件路径名中提取出纯文件名。</p><p>2.获取根目录文件，从根目录文件中查找待删除文件的rfsdir_t结构，然后释放该文件占用的逻辑储存块。</p><p>3.初始化与待删除文件相对应的rfsdir_t结构，并设置rfsdir_t结构的类型为RDR_DEL_TYPE。</p><p>4.释放根目录文件。</p><p>这次我们用三个函数来实现这些步骤，删除文件的接口函数的代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//文件删除的接口函数</span></span>
<span class="line"><span>drvstus_t rfs_del_file(device_t* devp, char_t* fname, uint_t flg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if(flg != 0) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return rfs_del_dirfileblk(devp, fname, RDR_FIL_TYPE, 0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>删除文件的接口函数非常之简单，就是判断一下标志，接着调用了rfs_del_dirfileblk函数，下面我们就来写好这个rfs_del_dirfileblk函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_del_dirfileblk(device_t* devp, char_t* fname, uint_t flgtype, uint_t val)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if(flgtype != RDR_FIL_TYPE || val != 0) { return DFCERRSTUS; }</span></span>
<span class="line"><span>    char_t fne[DR_NM_MAX];</span></span>
<span class="line"><span>    hal_memset((void*)fne, DR_NM_MAX, 0);</span></span>
<span class="line"><span>    //提取纯文件名</span></span>
<span class="line"><span>    if(rfs_ret_fname(fne,fname) != 0) { return DFCERRSTUS; }</span></span>
<span class="line"><span>    //调用删除文件的核心函数</span></span>
<span class="line"><span>    if(del_dirfileblk_core(devp, fne) != 0) { return DFCERRSTUS; }</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>rfs_del_dirfileblk函数只是提取了文件名，然后调用了一个删除文件的核心函数，这个核心函数就是del_dirfileblk_core函数，它的实现代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//删除文件的核心函数</span></span>
<span class="line"><span>sint_t del_dirfileblk_core(device_t* devp, char_t* fname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    sint_t rets = 6;</span></span>
<span class="line"><span>    void* rblkp=get_rootdirfile_blk(devp);//获取根目录文件</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)rblkp;</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_type!=FMD_DIR_TYPE) { //检查根目录文件的类型</span></span>
<span class="line"><span>        rets=4; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_curfwritebk == fmp-&amp;gt;fmd_fleblk[0].fb_blkstart &amp;&amp; fmp-&amp;gt;fmd_curfinwbkoff == fmp-&amp;gt;fmd_fileifstbkoff) { //检查根目录文件中有没有数据</span></span>
<span class="line"><span>        rets = 3; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rfsdir_t* dirp = (rfsdir_t*)((uint_t)(fmp) + fmp-&amp;gt;fmd_fileifstbkoff);</span></span>
<span class="line"><span>    void* maxchkp = (void*)((uint_t)rblkp + FSYS_ALCBLKSZ-1);</span></span>
<span class="line"><span>    for(;(void*)dirp &amp;lt; maxchkp;) {</span></span>
<span class="line"><span>        if(dirp-&amp;gt;rdr_type == RDR_FIL_TYPE) {//检查其类型是否为文件类型</span></span>
<span class="line"><span>            //如果文件名相同，就执行以下删除动作</span></span>
<span class="line"><span>            if(rfs_strcmp(dirp-&amp;gt;rdr_name, fname) == 1) {</span></span>
<span class="line"><span>                //释放rfsdir_t结构的rdr_blknr中指向的逻辑储存块</span></span>
<span class="line"><span>                rfs_del_blk(devp, dirp-&amp;gt;rdr_blknr);</span></span>
<span class="line"><span>                //初始化rfsdir_t结构，实际上是清除其中的数据</span></span>
<span class="line"><span>                rfsdir_t_init(dirp);</span></span>
<span class="line"><span>                //设置rfsdir_t结构的类型为删除类型，表示它已经删除</span></span>
<span class="line"><span>                dirp-&amp;gt;rdr_type = RDR_DEL_TYPE;</span></span>
<span class="line"><span>                rets = 0; goto err;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        dirp++;//下一个rfsdir_t</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets=1;</span></span>
<span class="line"><span>err:</span></span>
<span class="line"><span>    del_rootdirfile_blk(devp,rblkp);//释放根目录文件</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的del_dirfileblk_core函数，它主要是遍历根目录文件中所有的rfsdir_t结构，并比较其文件名，看看删除的文件名称是否相同，相同就释放该rfsdir_t结构的rdr_blknr字段对应的逻辑储存块，清除该rfsdir_t结构中的数据，同时设置该rfsdir_t结构的类型为删除类型。</p><p>你可以这样理解：删除一个文件，就是把这个文件对应的rfsdir_t结构中的数据清空，这样就无法查找到这个文件了。同时，也要释放该文件占用的逻辑储存块。因为没有清空文件数据，所以可以通过反删除软件找回文件。</p><h3 id="打开文件" tabindex="-1">打开文件 <a class="header-anchor" href="#打开文件" aria-label="Permalink to &quot;打开文件&quot;">​</a></h3><p>接下来，我们就要实现打开文件操作了。一个已经存在的文件，要对它进行读写操作，首先就应该打开这个文件。</p><p>在实现这个打开文件操作之前，我们不妨先回忆一下前面课程里提到的 <a href="https://time.geekbang.org/column/article/395772" target="_blank" rel="noreferrer">objnode_t结构</a>。</p><p>Cosmos内核上层组件调用设备驱动程序时，都需要建立一个相应的objnode_t结构，把这个I/O包发送给相应的驱动程序，但是objnode_t结构不仅仅是用于驱动程序，它还用于表示进程使用了哪些资源，例如打开了哪些设备或者文件，而每打开一个设备或者文件就建立一个objnode_t结构，放在特定进程的资源表中。</p><p>为了适应文件系统设备驱动程序，在cosmos/include/krlinc/krlobjnode_t.h文件中，需要在objnode_t结构中增加一些东西，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define OBJN_TY_DEV 1//设备类型</span></span>
<span class="line"><span>#define OBJN_TY_FIL 2//文件类型</span></span>
<span class="line"><span>#define OBJN_TY_NUL 0//默认类型</span></span>
<span class="line"><span>typedef struct s_OBJNODE</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    spinlock_t  on_lock;</span></span>
<span class="line"><span>    list_h_t    on_list;</span></span>
<span class="line"><span>    sem_t       on_complesem;</span></span>
<span class="line"><span>    uint_t      on_flgs;</span></span>
<span class="line"><span>    uint_t      on_stus;</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    void*       on_fname;//文件路径名指针</span></span>
<span class="line"><span>    void*       on_finode;//文件对应的fimgrhd_t结构指针</span></span>
<span class="line"><span>    void*       on_extp;//扩展所用</span></span>
<span class="line"><span>}objnode_t;</span></span></code></pre></div><p>上述代码中objnode_t结构里增加了两个字段，一个是指向文件路径名的指针，表示打开哪个文件。因为要知道一个文件的所有信息，所以增加了指向对应文件的fimgrhd_t结构指针，也就是我们增加的第二个字段。</p><p>现在我们来看看打开一个文件的流程。一共也是4步。</p><p>1.从objnode_t结构的文件路径提取文件名。</p><p>2.获取根目录文件，在该文件中搜索对应的rfsdir_t结构，看看文件是否存在。</p><p>3.分配一个4KB缓存区，把该文件对应的rfsdir_t结构中指向的逻辑储存块读取到缓存区中，然后释放根目录文件。</p><p>4.把缓冲区中的fimgrhd_t结构的地址，保存到objnode_t结构的on_finode域中。</p><p>下面来写两个函数实现这些流程，同样我们需要先写好接口函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//打开文件的接口函数</span></span>
<span class="line"><span>drvstus_t rfs_open_file(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t* obp = (objnode_t*)iopack;</span></span>
<span class="line"><span>    //检查objnode_t中的文件路径名</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_fname == NULL) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用打开文件的核心函数</span></span>
<span class="line"><span>    void* fmdp = rfs_openfileblk(devp, (char_t*)obp-&amp;gt;on_fname);</span></span>
<span class="line"><span>    if(fmdp == NULL) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //把返回的fimgrhd_t结构的地址保存到objnode_t中的on_finode字段中</span></span>
<span class="line"><span>    obp-&amp;gt;on_finode = fmdp;</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接口函数rfs_open_file中只是对参数进行了检查。然后调用了核心函数，这个函数就是rfs_openfileblk，它的代码实现如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//打开文件的核心函数</span></span>
<span class="line"><span>void* rfs_openfileblk(device_t *devp, char_t* fname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    char_t fne[DR_NM_MAX]; void* rets = NULL,*buf = NULL;</span></span>
<span class="line"><span>    hal_memset((void*)fne,DR_NM_MAX,0);</span></span>
<span class="line"><span>    if(rfs_ret_fname(fne, fname) != 0) {//从文件路径名中提取纯文件名</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    void* rblkp = get_rootdirfile_blk(devp); //获取根目录文件</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)rblkp;</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_type != FMD_DIR_TYPE) {//判断根目录文件的类型是否合理</span></span>
<span class="line"><span>        rets = NULL; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //判断根目录文件里有没有数据</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_curfwritebk == fmp-&amp;gt;fmd_fleblk[0].fb_blkstart &amp;&amp;</span></span>
<span class="line"><span>fmp-&amp;gt;fmd_curfinwbkoff == fmp-&amp;gt;fmd_fileifstbkoff) {</span></span>
<span class="line"><span>        rets = NULL; goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rfsdir_t* dirp = (rfsdir_t*)((uint_t)(fmp) + fmp-&amp;gt;fmd_fileifstbkoff);</span></span>
<span class="line"><span>    void* maxchkp = (void*)((uint_t)rblkp + FSYS_ALCBLKSZ - 1);</span></span>
<span class="line"><span>    for(;(void*)dirp &amp;lt; maxchkp;) {//开始遍历文件对应的rfsdir_t结构</span></span>
<span class="line"><span>        if(dirp-&amp;gt;rdr_type == RDR_FIL_TYPE) {</span></span>
<span class="line"><span>            //如果文件名相同就跳转到opfblk标号处运行</span></span>
<span class="line"><span>            if(rfs_strcmp(dirp-&amp;gt;rdr_name, fne) == 1) {</span></span>
<span class="line"><span>                goto opfblk;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        dirp++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果到这里说明没有找到该文件对应的rfsdir_t结构，所以设置返回值为NULL</span></span>
<span class="line"><span>    rets = NULL; goto err;</span></span>
<span class="line"><span>opfblk:</span></span>
<span class="line"><span>    buf = new_buf(FSYS_ALCBLKSZ);//分配4KB大小的缓冲区</span></span>
<span class="line"><span>    //读取该文件占用的逻辑储存块</span></span>
<span class="line"><span>    if(read_rfsdevblk(devp, buf, dirp-&amp;gt;rdr_blknr) == DFCERRSTUS) {</span></span>
<span class="line"><span>        rets = NULL; goto err1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    fimgrhd_t* ffmp = (fimgrhd_t*)buf;</span></span>
<span class="line"><span>    if(ffmp-&amp;gt;fmd_type == FMD_NUL_TYPE || ffmp-&amp;gt;fmd_fileifstbkoff != 0x200) {//判断将要打开的文件是否合法</span></span>
<span class="line"><span>        rets = NULL; goto err1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = buf; goto err;//设置缓冲区首地址为返回值</span></span>
<span class="line"><span>err1:</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ); //上面的步骤若出现问题就要释放缓冲区</span></span>
<span class="line"><span>err:</span></span>
<span class="line"><span>    del_rootdirfile_blk(devp, rblkp); //释放根目录文件</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合上面的代码我们能够看到，通过rfs_openfileblk函数中的for循环，可以遍历要打开的文件在根目录文件中对应的rfsdir_t结构，然后把对应文件占用的逻辑储存块读取到缓冲区中，最后返回这个缓冲区的首地址。</p><p>因为这个缓冲区开始的空间中，就存放着其文件对应的fimgrhd_t结构，所以返回fimgrhd_t结构的地址，整个打开文件的流程就结束了。</p><h3 id="读写文件" tabindex="-1">读写文件 <a class="header-anchor" href="#读写文件" aria-label="Permalink to &quot;读写文件&quot;">​</a></h3><p>刚才我们已经实现了打开文件， 而打开一个文件，就是为了对这个文件进行读写。</p><p>其实对文件的读写包含两个操作，一个是从储存设备中读取文件的数据，另一个是把文件的数据写入到储存设备中。</p><p>咱们先来看看如何读取已经打开的文件中的数据，大致的流程如下。</p><p>1.检查objnode_t结构中用于存放文件数据的缓冲区及其大小。</p><p>2.检查imgrhd_t结构中文件相关的信息。</p><p>3.把文件的数据读取到objnode_t结构中指向的缓冲区中。</p><p>通过后面的代码，我们把读文件的接口函数跟核心函数一起实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//读取文件数据的接口函数</span></span>
<span class="line"><span>drvstus_t rfs_read_file(device_t* devp,void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t* obp = (objnode_t*)iopack;</span></span>
<span class="line"><span>    //检查文件是否已经打开，以及用于存放文件数据的缓冲区和它的大小是否合理</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_finode == NULL || obp-&amp;gt;on_buf == NULL || obp-&amp;gt;on_bufsz != FSYS_ALCBLKSZ) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return rfs_readfileblk(devp, (fimgrhd_t*)obp-&amp;gt;on_finode, obp-&amp;gt;on_buf, obp-&amp;gt;on_len);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//实际读取文件数据的函数</span></span>
<span class="line"><span>drvstus_t rfs_readfileblk(device_t* devp, fimgrhd_t* fmp, void* buf, uint_t len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //检查文件的相关信息是否合理</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_sfblk != fmp-&amp;gt;fmd_curfwritebk || fmp-&amp;gt;fmd_curfwritebk != fmp-&amp;gt;fmd_fleblk[0].fb_blkstart) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //检查读取文件数据的长度是否大于（4096-512）</span></span>
<span class="line"><span>    if(len &amp;gt; (FSYS_ALCBLKSZ - fmp-&amp;gt;fmd_fileifstbkoff)) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //指向文件数据的开始地址</span></span>
<span class="line"><span>    void* wrp = (void*)((uint_t)fmp + fmp-&amp;gt;fmd_fileifstbkoff);</span></span>
<span class="line"><span>    //把文件开始处的数据复制len个字节到buf指向的缓冲区中</span></span>
<span class="line"><span>    hal_memcpy(wrp, buf, len);</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中读取文件数据的函数很简单，关键是要明白前面那个打开文件的函数，因为在那里它已经把文件数据复制到一个缓冲区中了，rfs_readfileblk函数中的参数buf、len都是接口函数rfs_read_file从objnode_t结构中提取出来的，其它的部分我已经通过注释已经说明了。</p><p>好了，我们下面就来实现怎么向文件中写入数据，和读取文件的流程一样，只不过要将要写入的数据复制到打开文件时为其分配的缓冲区中，最后还要把打开文件时为其分配的缓冲区中的数据，写入到相应的逻辑储存块中。</p><p>我们还是把写文件的接口函数和核心函数一起实现，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//写入文件数据的接口函数</span></span>
<span class="line"><span>drvstus_t rfs_write_file(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t* obp = (objnode_t*)iopack;</span></span>
<span class="line"><span>    //检查文件是否已经打开，以及用于存放文件数据的缓冲区和它的大小是否合理</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_finode == NULL || obp-&amp;gt;on_buf == NULL || obp-&amp;gt;on_bufsz != FSYS_ALCBLKSZ) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return rfs_writefileblk(devp, (fimgrhd_t*)obp-&amp;gt;on_finode, obp-&amp;gt;on_buf, obp-&amp;gt;on_len);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//实际写入文件数据的函数</span></span>
<span class="line"><span>drvstus_t rfs_writefileblk(device_t* devp, fimgrhd_t* fmp, void* buf, uint_t len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //检查文件的相关信息是否合理</span></span>
<span class="line"><span>    if(fmp-&amp;gt;fmd_sfblk != fmp-&amp;gt;fmd_curfwritebk || fmp-&amp;gt;fmd_curfwritebk != fmp-&amp;gt;fmd_fleblk[0].fb_blkstart) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //检查当前将要写入数据的偏移量加上写入数据的长度，是否大于等于4KB</span></span>
<span class="line"><span>    if((fmp-&amp;gt;fmd_curfinwbkoff + len) &amp;gt;= FSYS_ALCBLKSZ) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //指向将要写入数据的内存空间</span></span>
<span class="line"><span>    void* wrp = (void*)((uint_t)fmp + fmp-&amp;gt;fmd_curfinwbkoff);</span></span>
<span class="line"><span>    //把buf缓冲区中的数据复制len个字节到wrp指向的内存空间中去</span></span>
<span class="line"><span>    hal_memcpy(buf, wrp, len);</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_filesz += len;//增加文件大小</span></span>
<span class="line"><span>    //使fmd_curfinwbkoff指向下一次将要写入数据的位置</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_curfinwbkoff += len;</span></span>
<span class="line"><span>    //把文件数据写入到相应的逻辑储存块中，完成数据同步</span></span>
<span class="line"><span>    write_rfsdevblk(devp, (void*)fmp, fmp-&amp;gt;fmd_curfwritebk);</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，你要注意的是， <strong>rfs_writefileblk函数永远都是从fimgrhd_t 结构的fmd_curfinwbkoff字段中的偏移量开始写入文件数据的</strong>，比如向空文件中写入2个字节，那么其fmd_curfinwbkoff字段的值就是2，因为第0、1个字节空间已经被占用了，这就是 <strong>追加写入数据</strong> 的方式。</p><p>rfs_writefileblk函数最后调用write_rfsdevblk函数把文件数据写入到相应的逻辑储存块中，完成数据同步。我们发现只要打开文件了，读写文件还是很简单的，最后还要实现关闭文件的操作。</p><h3 id="关闭文件" tabindex="-1">关闭文件 <a class="header-anchor" href="#关闭文件" aria-label="Permalink to &quot;关闭文件&quot;">​</a></h3><p>有打开文件的操作，就需要有关闭文件的操作，因为打开一个文件，会为此分配一个缓冲区，这些都是系统资源，所以需要一个关闭文件的操作来释放这些资源，以防止系统资源泄漏。</p><p>关闭文件的流程很简单，首先检查文件是否已经打开。然后把文件写入到对应的逻辑储存块中，完成数据的同步。最后释放文件数据占用的缓冲区。下面我们开始写代码实现，我们依然把接口和核心函数放在一起实现，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//关闭文件的接口函数</span></span>
<span class="line"><span>drvstus_t rfs_close_file(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t* obp = (objnode_t*)iopack;</span></span>
<span class="line"><span>    //检查文件是否已经打开了</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_finode == NULL) {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return rfs_closefileblk(devp, obp-&amp;gt;on_finode);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//关闭文件的核心函数</span></span>
<span class="line"><span>drvstus_t rfs_closefileblk(device_t *devp, void* fblkp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //指向文件的fimgrhd_t结构</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)fblkp;</span></span>
<span class="line"><span>    //完成文件数据的同步</span></span>
<span class="line"><span>    write_rfsdevblk(devp, fblkp, fmp-&amp;gt;fmd_sfblk);</span></span>
<span class="line"><span>    //释放缓冲区</span></span>
<span class="line"><span>    del_buf(fblkp, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码是非常简单的，但在目前的情况下，rfs_closefileblk函数中是没有必要调用write_rfsdevblk函数的，因为前面在写入文件数据的同时，就已经把文件的数据写入到逻辑储存块中去了。最后释放了先前打开文件时分配的缓冲区，而objnode_t结构不应该在此释放，它是由Cosmos内核上层组件进行释放的。</p><h2 id="串联整合" tabindex="-1">串联整合 <a class="header-anchor" href="#串联整合" aria-label="Permalink to &quot;串联整合&quot;">​</a></h2><p>到目前为止，我们实现了文件相关的操作，并且提供了接口函数，但是我们的文件系统是以设备的形式存在的，所以文件操作的接口，必须要串联整合到文件系统设备驱动程序之中，文件系统才能真正工作。</p><p>下面我们就去整合联串文件系统设备驱动程序。首先来串联整合文件系统的打开文件操作和新建文件操作，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_open(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t* obp=(objnode_t*)iopack;</span></span>
<span class="line"><span>    //根据objnode_t结构中的访问标志进行判断</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_acsflgs == FSDEV_OPENFLG_OPEFILE) {</span></span>
<span class="line"><span>        return rfs_open_file(devp, iopack);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_acsflgs == FSDEV_OPENFLG_NEWFILE) {</span></span>
<span class="line"><span>        return rfs_new_file(devp, obp-&amp;gt;on_fname, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中rfs_open函数对应于设备驱动程序的打开功能派发函数，但没有相应的新建功能派发函数，于是我们就根据objnode_t结构中访问标志域设置不同的编码，来进行判断。</p><p>接着我们来串联整合关闭文件的操作。这次要简单一些，因为设备驱动程序有对应的关闭功能派发函数，直接调用关闭文件操作的接口函数就可以了，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_close(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return rfs_close_file(devp, iopack);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后是文件读写操作的串联整合，设备驱动程序也有对应的读写功能派发函数，同样也是直接调用文件读写操作的接口函数即可，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_read(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //调用读文件操作的接口函数</span></span>
<span class="line"><span>    return rfs_read_file(devp, iopack);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>drvstus_t rfs_write(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //调用写文件操作的接口函数</span></span>
<span class="line"><span>    return rfs_write_file(devp, iopack);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，来串联整合稍微有点复杂的删除文件操作，这是因为设备驱动程序没有对应的功能派发函数，所以我们需要用到设备驱动程序的控制功能派发函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_ioctrl(device_t* devp, void* iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t* obp = (objnode_t*)iopack;</span></span>
<span class="line"><span>    //根据objnode_t结构中的控制码进行判断</span></span>
<span class="line"><span>    if(obp-&amp;gt;on_ioctrd == FSDEV_IOCTRCD_DELFILE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //调用删除文件操作的接口函数</span></span>
<span class="line"><span>        return rfs_del_file(devp, obp-&amp;gt;on_fname, 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，我们给文件系统设备分配了一个FSDEV_IOCTRCD_DELFILE（一个整数）控制码，Cosmos内核上层组件的代码就可以根据需要，设置objnode_t结构中的控制码就能达到相应的目的了。</p><p>现在，文件相关的操作已经串联整合好了。</p><h2 id="测试" tabindex="-1">测试 <a class="header-anchor" href="#测试" aria-label="Permalink to &quot;测试&quot;">​</a></h2><p>前面实现了文件系统的6种最常用的文件操作，并且已经整合到文件系统设备驱动程序框架代码中去了，可是这些代码究竟对不对，测试运行了才知道。</p><p>下面来写好测试代码。要注意的是，Cosmos下的任何设备驱动程序 <strong>都必须要有objnode_t结构才能运行</strong>。所以，在这里我们需要手动建立一个objnode_t结构并设置好其中的字段，模拟一下Cosmos上层组件调用设备驱动程序的过程。</p><p>这一过程我们可以写个test_fsys函数来实现，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void test_fsys(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kprint(&quot;开始文件操作测试\\n&quot;);</span></span>
<span class="line"><span>    void *rwbuf = new_buf(FSYS_ALCBLKSZ);//分配缓冲区</span></span>
<span class="line"><span>    //把缓冲区中的所有字节都置为0xff</span></span>
<span class="line"><span>    hal_memset(rwbuf, 0xff, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    objnode_t *ondp = krlnew_objnode();//新建一个objnode_t结构</span></span>
<span class="line"><span>    ondp-&amp;gt;on_acsflgs = FSDEV_OPENFLG_NEWFILE;//设置新建文件标志</span></span>
<span class="line"><span>    ondp-&amp;gt;on_fname = &quot;/testfile&quot;;//设置新建文件名</span></span>
<span class="line"><span>    ondp-&amp;gt;on_buf = rwbuf;//设置缓冲区</span></span>
<span class="line"><span>    ondp-&amp;gt;on_bufsz = FSYS_ALCBLKSZ;//设置缓冲区大小</span></span>
<span class="line"><span>    ondp-&amp;gt;on_len = 512;//设置读写多少字节</span></span>
<span class="line"><span>    ondp-&amp;gt;on_ioctrd = FSDEV_IOCTRCD_DELFILE;//设置控制码</span></span>
<span class="line"><span>    if (rfs_open(devp, ondp) == DFCERRSTUS) {//新建文件</span></span>
<span class="line"><span>        hal_sysdie(&quot;新建文件错误&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ondp-&amp;gt;on_acsflgs = FSDEV_OPENFLG_OPEFILE;//设置打开文件标志</span></span>
<span class="line"><span>    if (rfs_open(devp, ondp) == DFCERRSTUS) {//打开文件</span></span>
<span class="line"><span>        hal_sysdie(&quot;打开文件错误&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (rfs_write(devp, ondp) == DFCERRSTUS) {//把数据写入文件</span></span>
<span class="line"><span>        hal_sysdie(&quot;写入文件错误&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    hal_memset(rwbuf, 0, FSYS_ALCBLKSZ);//清零缓冲区</span></span>
<span class="line"><span>    if (rfs_read(devp, ondp) == DFCERRSTUS) {//读取文件数据</span></span>
<span class="line"><span>        hal_sysdie(&quot;读取文件错误&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (rfs_close(devp, ondp) == DFCERRSTUS) {//关闭文件</span></span>
<span class="line"><span>        hal_sysdie(&quot;关闭文件错误&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    u8_t *cb = (u8_t *)rwbuf;//指向缓冲区</span></span>
<span class="line"><span>    for (uint_t i = 0; i &amp;lt; 512; i++) {//检查缓冲区空间中的头512个字节的数据，是否为0xff</span></span>
<span class="line"><span>        if (cb[i] != 0xff) {//如果不等于0xff就死机</span></span>
<span class="line"><span>            hal_sysdie(&quot;检查文件内容错误&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        kprint(&quot;testfile文件第[%x]个字节数据:%x\\n&quot;, i, (uint_t)cb[i]);//打印文件内容</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (rfs_ioctrl(devp, ondp) == DFCERRSTUS){//删除文件</span></span>
<span class="line"><span>        hal_sysdie(&quot;删除文件错误&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ondp-&amp;gt;on_acsflgs = FSDEV_OPENFLG_OPEFILE;//再次设置打开文件标志</span></span>
<span class="line"><span>    if (rfs_open(devp, ondp) == DFCERRSTUS) {//再次打开文件</span></span>
<span class="line"><span>        hal_sysdie(&quot;再次打开文件失败&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    hal_sysdie(&quot;结束文件操作测试&quot;);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码虽然有点长，因为我们一下子测试了关于文件的6大操作。每个文件操作失败后都会死机，不会继续向下运行。</p><p>测试逻辑很简单：开始会建立并打开一个文件，接着写入数据，然后读取文件中数据进行比较，看看是不是和之前写入的数据相等，最后删除这个文件并再次打开，看是否会出错。因为文件已经删除了，打开一个已经删除的文件自然要出错，出错就说明测试成功。</p><p>现在我们把test_fsys函数放在rfs_entry函数的最后调用，然后打开终端切换到cosmos目录下执行make vboxtest 命令，最后不出意外的话，你会看到如下图所示的情况。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/399700/eddb4f92fd55c34113ba55c81e2b95d4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/399700/eddb4f92fd55c34113ba55c81e2b95d4.jpg" alt=""></a></p><p>从图里我们能看到，文件中的数据和最后重新打开已经删除文件时出现的错误，这说明了我们的代码是正确无误的。</p><p>至此 ，测试了文件相关的6大操作的代码，代码质量都是相当高的，都达到了我们的预期，一个简单、有诸多限制但却五脏俱全的文件系统就实现了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>这节课告一段落，恭喜你坚持到这里。</p><p>文件系统虽然复杂，但我们发现只要做得足够“小”，就能大大降低了实现的难度。虽然降低了实现的难度，但我们的rfs文件系统依然包含了一个正常文件系统所具有的功能特性，现在我来为你梳理一下本节课的重点：</p><p>1.首先是文件系统的辅助操作，因为文件系统的复杂性，所以必须要实现一些如获取与释放根目录文件、获取文件名、判断文件是否存在等基础辅助操作函数。</p><p>2.然后实现了文件系统必须要提供的6大文件操作： <strong>新建文件、删除文件、打开文件、读写文件、关闭文件</strong>。</p><p>3.最后把这些文件操作全部串联整合到文件系统设备驱动程序之中，并且进行了测试，确认代码正确无误。</p><p>今天这节课，我们又实现了Cosmos内核的一个基础组件，即文件系统，不过它是以 <strong>设备的形式</strong> 存在的，这样做是为了方便以后的扩展和移植。</p><p>现在文件系统是实现了，不过还不够完善。你可能在想，我们文件系统在内存中，一断电数据就全完了。是的，不过你可以尝试写好硬盘驱动，然后把内存中的逻辑储存块写入到硬盘中就行了，期待你的实现。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你想一想，我们这个简单的、小的，却五脏俱全的文件系统有哪些限制？</p><p>欢迎你在留言区记录你的收获或疑问，也鼓励你边学边练，多多动手实践。同时我推荐你把这节课分享给身边的朋友，跟他一起学习进步。</p><p>好，我是LMOS，我们下节课见。</p>`,134)])])}const m=n(l,[["render",i]]);export{_ as __pageData,m as default};
