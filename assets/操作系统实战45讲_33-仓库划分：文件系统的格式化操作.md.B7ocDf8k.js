import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"33 | 仓库划分：文件系统的格式化操作","description":"","frontmatter":{},"headers":[{"level":2,"title":"文件系统设备","slug":"文件系统设备","link":"#文件系统设备","children":[]},{"level":2,"title":"文件系统系统格式化","slug":"文件系统系统格式化","link":"#文件系统系统格式化","children":[{"level":3,"title":"建立超级块","slug":"建立超级块","link":"#建立超级块","children":[]},{"level":3,"title":"建立位图","slug":"建立位图","link":"#建立位图","children":[]},{"level":3,"title":"建立根目录","slug":"建立根目录","link":"#建立根目录","children":[]},{"level":3,"title":"串联","slug":"串联","link":"#串联","children":[]}]},{"level":2,"title":"测试文件系统","slug":"测试文件系统","link":"#测试文件系统","children":[{"level":3,"title":"测试文件系统超级块","slug":"测试文件系统超级块","link":"#测试文件系统超级块","children":[]},{"level":3,"title":"测试文件系统位图","slug":"测试文件系统位图","link":"#测试文件系统位图","children":[]},{"level":3,"title":"测试文件系统根目录","slug":"测试文件系统根目录","link":"#测试文件系统根目录","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/33-仓库划分：文件系统的格式化操作.md","filePath":"操作系统实战45讲/33-仓库划分：文件系统的格式化操作.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/33-仓库划分：文件系统的格式化操作.md"};function i(t,s,r,c,d,_){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_33-仓库划分-文件系统的格式化操作" tabindex="-1">33 | 仓库划分：文件系统的格式化操作 <a class="header-anchor" href="#_33-仓库划分-文件系统的格式化操作" aria-label="Permalink to &quot;33 | 仓库划分：文件系统的格式化操作&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上一节课中，我们已经设计好了文件系统数据结构，相当于建好了仓库的基本结构。</p><p>今天，我将和你一起探索仓库的划分，即什么地方存放仓库的管理信息，什么地方存放进程的“劳动成果”（也就是文件），对应于文件系统就是文件系统的格式化操作。</p><p>具体我是这样安排的，我们先来实现文件系统设备驱动，接着建立文件系统超级块，然后建立根目录，最后建立文件系统的位图。下面，我们先从建立文件系统设备开始。</p><p>这节课的配套代码，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson33/Cosmos" target="_blank" rel="noreferrer">这里</a> 获取。</p><h2 id="文件系统设备" tabindex="-1">文件系统设备 <a class="header-anchor" href="#文件系统设备" aria-label="Permalink to &quot;文件系统设备&quot;">​</a></h2><p>根据我们前面的设计，文件系统并不是Cosmos的一部分，它只是Cosmos下的一个设备。</p><p>既然是设备，那就要编写相应的设备驱动程序。我们首先得编写文件系统设备的驱动程序。由于前面已经写过驱动程序了，你应该对驱动程序框架已经很熟悉了。</p><p>我们先在cosmos/drivers/目录下建立一个drvrfs.c文件，在里面写下文件系统驱动程序框架代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t rfs_entry(driver_t* drvp,uint_t val,void* p){……}</span></span>
<span class="line"><span>drvstus_t rfs_exit(driver_t* drvp,uint_t val,void* p){……}</span></span>
<span class="line"><span>drvstus_t rfs_open(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_close(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_read(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_write(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_lseek(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_ioctrl(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_dev_start(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_dev_stop(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_set_powerstus(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_enum_dev(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_flush(device_t* devp,void* iopack){……}</span></span>
<span class="line"><span>drvstus_t rfs_shutdown(device_t* devp,void* iopack){……}</span></span></code></pre></div><p>这个框架代码我们已经写好了，是不是感觉特别熟悉？这就是我们开发驱动程序的规范操作。下面，我们来建立文件系统设备。</p><p>按照之前的设计（如果不熟悉可以回顾 <a href="https://time.geekbang.org/column/article/397594" target="_blank" rel="noreferrer">第32课</a>），我们将使用4MB内存空间来模拟真实的储存设备，在建立文件系统设备的时候分配一块4MB大小的内存空间，这个内存空间我们用一个数据结构来描述，这个数据结构的分配内存空间的代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_RFSDEVEXT</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    spinlock_t rde_lock;//自旋锁</span></span>
<span class="line"><span>    list_h_t rde_list;//链表</span></span>
<span class="line"><span>    uint_t rde_flg;//标志</span></span>
<span class="line"><span>    uint_t rde_stus;//状态</span></span>
<span class="line"><span>    void* rde_mstart;//用于模拟储存介质的内存块的开始地址</span></span>
<span class="line"><span>    size_t rde_msize;//内存块的大小</span></span>
<span class="line"><span>    void* rde_ext;//扩展所用</span></span>
<span class="line"><span>}rfsdevext_t;</span></span>
<span class="line"><span>drvstus_t new_rfsdevext_mmblk(device_t* devp,size_t blksz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //分配模拟储存介质的内存空间，大小为4MB</span></span>
<span class="line"><span>    adr_t blkp= krlnew(blksz);</span></span>
<span class="line"><span>    //分配rfsdevext_t结构实例的内存空间</span></span>
<span class="line"><span>    rfsdevext_t* rfsexp=(rfsdevext_t*)krlnew(sizeof(rfsdevext_t));</span></span>
<span class="line"><span>    //初始化rfsdevext_t结构</span></span>
<span class="line"><span>    rfsdevext_t_init(rfsexp);</span></span>
<span class="line"><span>    rfsexp-&amp;gt;rde_mstart=(void*)blkp;</span></span>
<span class="line"><span>    rfsexp-&amp;gt;rde_msize=blksz;</span></span>
<span class="line"><span>    //把rfsdevext_t结构的地址放入device_t 结构的dev_extdata字段中，这里dev_extdata字段就起作用了</span></span>
<span class="line"><span>    devp-&amp;gt;dev_extdata=(void*)rfsexp;.</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，new_rfsdevext_mmblk函数分配了一个内存空间和一个rfsdevext_t结构实例变量，rfsdevext_t结构中保存了内存空间的地址和大小。而rfsdevext_t结构的地址放在了device_t结构的dev_extdata字段中。</p><p>剩下的就是建立文件系统设备了，我们在文件系统驱动程序的rfs_entry函数中，通过后面这段代码完成这个功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void rfs_set_device(device_t* devp,driver_t* drvp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //设备类型为文件系统类型</span></span>
<span class="line"><span>    devp-&amp;gt;dev_id.dev_mtype = FILESYS_DEVICE;</span></span>
<span class="line"><span>    devp-&amp;gt;dev_id.dev_stype = 0;</span></span>
<span class="line"><span>    devp-&amp;gt;dev_id.dev_nr = 0;</span></span>
<span class="line"><span>    //设备名称为rfs</span></span>
<span class="line"><span>    devp-&amp;gt;dev_name = &quot;rfs&quot;;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>drvstus_t rfs_entry(driver_t* drvp,uint_t val,void* p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //分配device_t结构并对其进行初级初始化</span></span>
<span class="line"><span>    device_t* devp = new_device_dsc();</span></span>
<span class="line"><span>    rfs_set_driver(drvp);</span></span>
<span class="line"><span>    rfs_set_device(devp,drvp);</span></span>
<span class="line"><span>    //分配模拟储存设备的内存空间</span></span>
<span class="line"><span>    if(new_rfsdevext_mmblk(devp,FSMM_BLK) == DFCERRSTUS){……}</span></span>
<span class="line"><span>    //把设备加入到驱动程序之中</span></span>
<span class="line"><span>    if(krldev_add_driver(devp,drvp) == DFCERRSTUS){……}</span></span>
<span class="line"><span>    //向内核注册设备</span></span>
<span class="line"><span>    if(krlnew_device(devp)==DFCERRSTUS){……}</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其实这和我们之前的写systick驱动程序的套路差不多，只不过这里需要分配一个模拟储存设备的空间，并把它放在device_t结构相关的字段中。 <strong>还有很重要的一点是，这个设备类型我们要在rfs_set_device函数把它设置好，设置成文件系统类型。</strong></p><p>需要注意的是要把rfs_entry函数放在驱动表中，文件系统程序才可以运行，下面我们就把这个rfs_entry函数，放入驱动表中，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cosmos/kernel/krlglobal.c</span></span>
<span class="line"><span>KRL_DEFGLOB_VARIABLE(drventyexit_t,osdrvetytabl)[]={systick_entry,rfs_entry,NULL};</span></span></code></pre></div><p>有了上述代码，Cosmos在启动的时候，在init_krldriver函数中就会运行rfs_entry函数。从名字就能看出rfs_entry函数的功能，这是rfs文件系统设备驱动程序的入口函数，它一旦执行，就会建立文件系统设备。</p><h2 id="文件系统系统格式化" tabindex="-1">文件系统系统格式化 <a class="header-anchor" href="#文件系统系统格式化" aria-label="Permalink to &quot;文件系统系统格式化&quot;">​</a></h2><p>我们经常听说格式化硬盘、格式化U盘，可以把设备上的数据全部清空，事实是格式化操作并不是把设备上所有的空间都清零，而是在这个设备上重建了文件系统用于管理文件的那一整套数据结构。这也解释了为什么格式化后的设备，还能通过一些反删除软件找回一些文件。</p><p>在储存设备上创建文件系统，其实就是执行这个格式化操作，即重建文件系统的数据结构。</p><p>那么接下来，我们就从建立文件系统的超级块开始，然后建立用于管理储存设备空间的位图，最后建立根目录，这样才能最终实现在储存设备上创建文件系统。</p><h3 id="建立超级块" tabindex="-1">建立超级块 <a class="header-anchor" href="#建立超级块" aria-label="Permalink to &quot;建立超级块&quot;">​</a></h3><p>我们首先来建立文件系统的超级块。建立超级块其实非常简单，就是初始化超级块的数据结构，然后把它写入到储存设备中的第一块逻辑储存块。</p><p>下面我们一起写代码来实现，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void *new_buf(size_t bufsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return (void *)krlnew(bufsz);//分配缓冲区</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void del_buf(void *buf, size_t bufsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    krldelete((adr_t)buf, bufsz)//释放缓冲区</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void rfssublk_t_init(rfssublk_t* initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    krlspinlock_init(&amp;initp-&amp;gt;rsb_lock);</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_mgic = 0x142422;//标志就是一个数字而已，无其它意义</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_vec = 1;//文件系统版本为1</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_flg = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_stus = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_sz = sizeof(rfssublk_t);//超级块本身的大小</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_sblksz = 1;//超级块占用多少个逻辑储存块</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_dblksz = FSYS_ALCBLKSZ;//逻辑储存块的大小为4KB</span></span>
<span class="line"><span>    //位图块从第1个逻辑储存块开始，超级块占用第0个逻辑储存块</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_bmpbks = 1;</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_bmpbknr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;rsb_fsysallblk = 0;</span></span>
<span class="line"><span>    rfsdir_t_init(&amp;initp-&amp;gt;rsb_rootdir);//初始化根目录</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>bool_t create_superblk(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void *buf = new_buf(FSYS_ALCBLKSZ);//分配4KB大小的缓冲区，清零</span></span>
<span class="line"><span>    hal_memset(buf, 0, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    //使rfssublk_t结构的指针指向缓冲区并进行初始化</span></span>
<span class="line"><span>    rfssublk_t *sbp = (rfssublk_t *)buf;</span></span>
<span class="line"><span>    rfssublk_t_init(sbp);</span></span>
<span class="line"><span>    //获取储存设备的逻辑储存块数并保存到超级块中</span></span>
<span class="line"><span>    sbp-&amp;gt;rsb_fsysallblk = ret_rfsdevmaxblknr(devp);</span></span>
<span class="line"><span>    //把缓冲区中超级块的数据写入到储存设备的第0个逻辑储存块中</span></span>
<span class="line"><span>    if (write_rfsdevblk(devp, buf, 0) == DFCERRSTUS)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ);//释放缓冲区</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的意思是，我们先在内存缓冲区中建立文件系统的超级块，最后会调用write_rfsdevblk函数，把内存缓冲区的数据写入到储存设备中。</p><p>下面我们来实现这个write_rfsdevblk函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//返回设备扩展数据结构</span></span>
<span class="line"><span>rfsdevext_t* ret_rfsdevext(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return (rfsdevext_t*)devp-&amp;gt;dev_extdata;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//根据块号返回储存设备的块地址</span></span>
<span class="line"><span>void* ret_rfsdevblk(device_t* devp,uint_t blknr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    rfsdevext_t* rfsexp = ret_rfsdevext(devp);</span></span>
<span class="line"><span>    //块号乘于块大小的结果再加上开始地址（用于模拟储存设备的内存空间的开始地址）</span></span>
<span class="line"><span>    void* blkp = rfsexp-&amp;gt;rde_mstart + (blknr*FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    //如果该地址没有落在储存入设备的空间中，就返回NULL表示出错</span></span>
<span class="line"><span>    if(blkp &amp;gt;= (void*)((size_t)rfsexp-&amp;gt;rde_mstart+rfsexp-&amp;gt;rde_msize))</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    //返回块地址</span></span>
<span class="line"><span>    return blkp;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//把4KB大小的缓冲区中的内容，写入到储存设备的某个逻辑储存块中</span></span>
<span class="line"><span>drvstus_t write_rfsdevblk(device_t* devp,void* weadr,uint_t blknr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //返回储存设备中第blknr块的逻辑存储块的地址</span></span>
<span class="line"><span>    void* p = ret_rfsdevblk(devp,blknr);</span></span>
<span class="line"><span>    //复制数据到逻辑储存块中</span></span>
<span class="line"><span>    hal_memcpy(weadr,p,FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>前面我们一下子写了三个函数，由于我们用内存模拟储存设备，我们要写一个ret_rfsdevext函数返回设备扩展数据结构，这个函数和ret_rfsdevblk函数将会一起根据块号，计算出内存地址。然后，我们把缓冲区的内容复制到这个地址开始的内存空间就行了。</p><h3 id="建立位图" tabindex="-1">建立位图 <a class="header-anchor" href="#建立位图" aria-label="Permalink to &quot;建立位图&quot;">​</a></h3><p>接下来，我们要建立文件系统的位图了。</p><p>延续我们文件系统的设计思路，储存设备被分成了许多同等大小的逻辑储存块，位图就是为了能准确地知道储存设备中，哪些逻辑储存块空闲、哪些是被占用的。</p><p>我们使用一个逻辑储存块空间中的所有字节，来管理逻辑储存块的状态。建立位图无非就是把储存设备中的位图块清零，因为开始文件系统刚创建时，所有的逻辑储存块都是空闲的。下面我们来写好代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//把逻辑储存块中的数据，读取到4KB大小的缓冲区中</span></span>
<span class="line"><span>drvstus_t read_rfsdevblk(device_t* devp,void* rdadr,uint_t blknr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取逻辑储存块地址</span></span>
<span class="line"><span>    void* p=ret_rfsdevblk(devp,blknr);</span></span>
<span class="line"><span>    //把逻辑储存块中的数据复制到缓冲区中</span></span>
<span class="line"><span>    hal_memcpy(p,rdadr,FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//获取超级块</span></span>
<span class="line"><span>rfssublk_t* get_superblk(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //分配4KB大小的缓冲区</span></span>
<span class="line"><span>    void* buf=new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    //清零缓冲区</span></span>
<span class="line"><span>    hal_memset(buf,FSYS_ALCBLKSZ,0);</span></span>
<span class="line"><span>    //读取第0个逻辑储存块中的数据到缓冲区中，如果读取失败则释放缓冲区</span></span>
<span class="line"><span>    read_rfsdevblk(devp,buf,0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回超级块数据结构的地址，即缓冲区的首地址</span></span>
<span class="line"><span>    return (rfssublk_t*)buf;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放超级块</span></span>
<span class="line"><span>void del_superblk(device_t* devp,rfssublk_t* sbp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //回写超级块，因为超级块中的数据可能已经发生了改变，如果出错则死机</span></span>
<span class="line"><span>    write_rfsdevblk(devp,(void*)sbp,0);//释放先前分配的4KB大小的缓冲区</span></span>
<span class="line"><span>    del_buf((void*)sbp,FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//建立位图</span></span>
<span class="line"><span>bool_t create_bitmap(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bool_t rets=FALSE;</span></span>
<span class="line"><span>    //获取超级块，失败则返回FALSE</span></span>
<span class="line"><span>    rfssublk_t* sbp = get_superblk(devp);</span></span>
<span class="line"><span>    //分配4KB大小的缓冲区</span></span>
<span class="line"><span>    void* buf = new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>      //获取超级块中位图块的开始块号</span></span>
<span class="line"><span>    uint_t bitmapblk=sbp-&amp;gt;rsb_bmpbks;</span></span>
<span class="line"><span>    //获取超级块中储存介质的逻辑储存块总数</span></span>
<span class="line"><span>    uint_t devmaxblk=sbp-&amp;gt;rsb_fsysallblk;</span></span>
<span class="line"><span>    //如果逻辑储存块总数大于4096，就认为出错了</span></span>
<span class="line"><span>    if(devmaxblk&amp;gt;FSYS_ALCBLKSZ)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets=FALSE;</span></span>
<span class="line"><span>        goto errlable;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //把缓冲区中每个字节都置成1</span></span>
<span class="line"><span>    hal_memset(buf,FSYS_ALCBLKSZ,1);</span></span>
<span class="line"><span>    u8_t* bitmap=(u8_t*)buf;</span></span>
<span class="line"><span>    //把缓冲区中的第3个字节到第devmaxblk个字节都置成0</span></span>
<span class="line"><span>    for(uint_t bi=2;bi&amp;lt;devmaxblk;bi++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        bitmap[bi]=0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //把缓冲区中的数据写入到储存介质中的第bitmapblk个逻辑储存块中，即位图块中</span></span>
<span class="line"><span>    if(write_rfsdevblk(devp,buf,bitmapblk)==DFCERRSTUS){</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto errlable;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置返回状态</span></span>
<span class="line"><span>    rets=TRUE;</span></span>
<span class="line"><span>errlable:</span></span>
<span class="line"><span>//释放超级块</span></span>
<span class="line"><span>    del_superblk(devp,sbp);</span></span>
<span class="line"><span>//释放缓冲区</span></span>
<span class="line"><span>    del_buf(buf,FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里为什么又多了几个辅助函数呢？这是因为，位图块的块号和储存介质的逻辑储存块总数，都保存在超级块中，所以要实现获取、释放超级块的函数，还需要一个读取逻辑储存块的函数，写入逻辑储存块的函数前面已经写过了。</p><p>因为第0块是超级块，第1块是位图块本身，所以代码从缓冲区中的第3个字节开始清零，一直到devmaxblk个字节，devmaxblk就是储存介质的逻辑储存块总数。缓冲区中有4096个字节，但devmaxblk肯定是小于4096的，所以devmaxblk后面的字节全部为1，这样就不会影响到后面分配逻辑储存块代码的正确性了。</p><p>最后，我们把这个缓冲区中的数据写入到储存介质中的第bitmapblk个逻辑储存块中，就完成了位图的建立。</p><p>建立好了管理逻辑储存块状态的位图，下面就去接着建立根目录吧！</p><h3 id="建立根目录" tabindex="-1">建立根目录 <a class="header-anchor" href="#建立根目录" aria-label="Permalink to &quot;建立根目录&quot;">​</a></h3><p>一切目录和文件都是存放在根目录下的，查询目录和文件也是从这里开始的，所以文件系统创建的最后一步就是创建根目录。</p><p>根目录也是一种文件，所以要为其分配相应的逻辑储存块，因为根目录下的文件和目录对应的rfsdir_t结构，就是保存在这个逻辑储存块中的。</p><p>因为根目录是文件，所以要在这个逻辑储存块的首个512字节空间中建立fimgrhd_t结构，即文件管理头数据结构。最后，我们要把这个逻辑储存块的块号，储存在超级块中的rfsdir_t结构中，同时修改该rfsdir_t结构中的文件名称为“/”。</p><p>要达到上述功能要求，就需要操作文件系统的超级块和位图，所以我们要先写好这些辅助功能函数，实现获取/释放位图块的代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//获取位图块</span></span>
<span class="line"><span>u8_t* get_bitmapblk(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取超级块</span></span>
<span class="line"><span>    rfssublk_t* sbp = get_superblk(devp);</span></span>
<span class="line"><span>    //分配4KB大小的缓冲区</span></span>
<span class="line"><span>    void* buf = new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    //缓冲区清零</span></span>
<span class="line"><span>    hal_memset(buf, FSYS_ALCBLKSZ, 0);</span></span>
<span class="line"><span>    //读取sbp-&amp;gt;rsb_bmpbks块（位图块），到缓冲区中</span></span>
<span class="line"><span>    read_rfsdevblk(devp, buf, sbp-&amp;gt;rsb_bmpbks)</span></span>
<span class="line"><span>    //释放超级块</span></span>
<span class="line"><span>    del_superblk(devp, sbp);</span></span>
<span class="line"><span>    //返回缓冲区的首地址</span></span>
<span class="line"><span>    return (u8_t*)buf;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放位图块</span></span>
<span class="line"><span>void del_bitmapblk(device_t* devp,u8_t* bitmap)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取超级块</span></span>
<span class="line"><span>    rfssublk_t* sbp = get_superblk(devp);</span></span>
<span class="line"><span>    //回写位图块，因为位图块中的数据可能已经发生改变</span></span>
<span class="line"><span>    write_rfsdevblk(devp, (void*)bitmap, sbp-&amp;gt;rsb_bmpbks)</span></span>
<span class="line"><span>    //释放超级块和存放位图块的缓冲区</span></span>
<span class="line"><span>    del_superblk(devp, sbp);</span></span>
<span class="line"><span>    del_buf((void*)bitmap, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>获取/释放位图块非常简单，就是根据超级块中的位图块号，把储存设备中的位图数据块读取到缓冲区中，而释放位图块则需要把缓冲区的数据写入到储存设备对应的逻辑块中。获取/释放超级块的函数，我们建立位图时已经写好了。</p><p>建立根目录需要分配新的逻辑储存块，分配新的逻辑储存块其实就是扫描位图数据，从中找出一个空闲的逻辑储存块，下面我们来写代码实现这个函数，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//分配新的空闲逻辑储存块</span></span>
<span class="line"><span>uint_t rfs_new_blk(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t retblk=0;</span></span>
<span class="line"><span>    //获取位图块</span></span>
<span class="line"><span>    u8_t* bitmap = get_bitmapblk(devp);</span></span>
<span class="line"><span>    if(bitmap == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for(uint_t blknr = 2; blknr &amp;lt; FSYS_ALCBLKSZ; blknr++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //找到一个为0的字节就置为1，并返回该字节对应的空闲块号</span></span>
<span class="line"><span>        if(bitmap[blknr] == 0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            bitmap[blknr] = 1;</span></span>
<span class="line"><span>            retblk = blknr;</span></span>
<span class="line"><span>            goto retl;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果到这里就说明没有空闲块了，所以返回0</span></span>
<span class="line"><span>    retblk=0;</span></span>
<span class="line"><span>retl:</span></span>
<span class="line"><span>    //释放位图块</span></span>
<span class="line"><span>    del_bitmapblk(devp,bitmap);</span></span>
<span class="line"><span>    return retblk;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>rfs_new_blk函数会返回新分配的逻辑储存块号，如果没有空闲的逻辑储存块了，就会返回0。下面我们就可以建立根目录了，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//建立根目录</span></span>
<span class="line"><span>bool_t create_rootdir(device_t* devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    //获取超级块</span></span>
<span class="line"><span>    rfssublk_t* sbp = get_superblk(devp);</span></span>
<span class="line"><span>    //分配4KB大小的缓冲区</span></span>
<span class="line"><span>    void* buf = new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    //缓冲区清零</span></span>
<span class="line"><span>    hal_memset(buf,FSYS_ALCBLKSZ,0);</span></span>
<span class="line"><span>    //分配一个空闲的逻辑储存块</span></span>
<span class="line"><span>    uint_t blk = rfs_new_blk(devp);</span></span>
<span class="line"><span>    if(blk == 0) {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto errlable;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置超级块中的rfsdir_t结构中的名称为“/”</span></span>
<span class="line"><span>    sbp-&amp;gt;rsb_rootdir.rdr_name[0] = &#39;/&#39;;</span></span>
<span class="line"><span>    //设置超级块中的rfsdir_t结构中的类型为目录类型</span></span>
<span class="line"><span>    sbp-&amp;gt;rsb_rootdir.rdr_type = RDR_DIR_TYPE;</span></span>
<span class="line"><span>    //设置超级块中的rfsdir_t结构中的块号为新分配的空闲逻辑储存块的块号</span></span>
<span class="line"><span>    sbp-&amp;gt;rsb_rootdir.rdr_blknr = blk;</span></span>
<span class="line"><span>    fimgrhd_t* fmp = (fimgrhd_t*)buf;</span></span>
<span class="line"><span>    //初始化fimgrhd_t结构</span></span>
<span class="line"><span>    fimgrhd_t_init(fmp);</span></span>
<span class="line"><span>    //因为这是目录文件所以fimgrhd_t结构的类型设置为目录类型</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_type = FMD_DIR_TYPE;</span></span>
<span class="line"><span>    //fimgrhd_t结构自身所在的块设置为新分配的空闲逻辑储存块</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_sfblk = blk;</span></span>
<span class="line"><span>    //fimgrhd_t结构中正在写入的块设置为新分配的空闲逻辑储存块</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_curfwritebk = blk;</span></span>
<span class="line"><span>    //fimgrhd_t结构中正在写入的块的偏移设置为512字节</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_curfinwbkoff = 0x200;</span></span>
<span class="line"><span>    //设置文件数据占有块数组的第0个元素</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_fleblk[0].fb_blkstart = blk;</span></span>
<span class="line"><span>    fmp-&amp;gt;fmd_fleblk[0].fb_blknr = 1;</span></span>
<span class="line"><span>    //把缓冲区中的数据写入到新分配的空闲逻辑储存块中，其中包含已经设置好的      fimgrhd_t结构</span></span>
<span class="line"><span>    if(write_rfsdevblk(devp, buf, blk) == DFCERRSTUS) {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto errlable;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = TRUE;</span></span>
<span class="line"><span>errlable:</span></span>
<span class="line"><span>    //释放缓冲区</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>errlable1:</span></span>
<span class="line"><span>    //释放超级块</span></span>
<span class="line"><span>    del_superblk(devp, sbp);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的注释已经很清楚了，虽然代码有点长，但总体流程还是挺清晰的。首先，分配一块新的逻辑储存块。接着，设置超级块中的rfsdir_t结构中的名称以及类型和块号。然后设置文件管理头，由于根目录是目录文件，所以文件管理头的类型为FMD_DIR_TYPE，表示文件数据存放的是目录结构。最后，回写对应的逻辑储存块即可。</p><h3 id="串联" tabindex="-1">串联 <a class="header-anchor" href="#串联" aria-label="Permalink to &quot;串联&quot;">​</a></h3><p>建立超级块、建立位图、建立根目录的代码已经写好了。</p><p>现在我们来写一个rfs_fmat函数，把刚才这三个操作包装起来，调用它们完成文件系统格式化这一流程。顺便，我们还可以把init_rfs函数也实现了，让它调用rfs_fmat函数，随后init_rfs函数本身会在rfs_entry函数的最后被调用，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//rfs初始化</span></span>
<span class="line"><span>void init_rfs(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //格式化rfs</span></span>
<span class="line"><span>    rfs_fmat(devp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//rfs格式化</span></span>
<span class="line"><span>void rfs_fmat(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //建立超级块</span></span>
<span class="line"><span>    if (create_superblk(devp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        hal_sysdie(&quot;create superblk err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //建立位图</span></span>
<span class="line"><span>    if (create_bitmap(devp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        hal_sysdie(&quot;create bitmap err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //建立根目录</span></span>
<span class="line"><span>    if (create_rootdir(devp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        hal_sysdie(&quot;create rootdir err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//rfs驱动程序入口</span></span>
<span class="line"><span>drvstus_t rfs_entry(driver_t *drvp, uint_t val, void *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    init_rfs(devp);//初始化rfs</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，init_rfs函数会在rfs驱动程序入口函数的最后被调用，到这里我们rfs文件系统的格式化操作就完成了，这是实现文件系统的重要一步。</p><h2 id="测试文件系统" tabindex="-1">测试文件系统 <a class="header-anchor" href="#测试文件系统" aria-label="Permalink to &quot;测试文件系统&quot;">​</a></h2><p>尽管我们的文件系统还有很多其它操作，如打开、关闭，读写文件，这些文件相关的操作我们放在下一节课中来实现。这里我们先对文件系统格式化的功能进行测试，确认一下我们的格式化代码没有问题，再进行下一步的开发。</p><h3 id="测试文件系统超级块" tabindex="-1">测试文件系统超级块 <a class="header-anchor" href="#测试文件系统超级块" aria-label="Permalink to &quot;测试文件系统超级块&quot;">​</a></h3><p>之前我们文件系统格式化操作的第一步，就是建立文件系统的超级块。</p><p>所以我们首先来测试一下建立文件系统超级块的代码，测试方法非常简单，我们只要把超级块读取到一个缓冲区中，然后把其中一些重要的数据，打印出来看一看就知道了，我们写个函数完成这个功能，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//测试文件系统超级块</span></span>
<span class="line"><span>void test_rfs_superblk(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kprint(&quot;开始文件系统超级块测试\\n&quot;);</span></span>
<span class="line"><span>    rfssublk_t *sbp = get_superblk(devp);</span></span>
<span class="line"><span>    kprint(&quot;文件系统标识:%d,版本:%d\\n&quot;, sbp-&amp;gt;rsb_mgic, sbp-&amp;gt;rsb_vec);</span></span>
<span class="line"><span>    kprint(&quot;文件系统超级块占用的块数:%d,逻辑储存块大小:%d\\n&quot;, sbp-&amp;gt;rsb_sblksz, sbp-&amp;gt;rsb_dblksz);</span></span>
<span class="line"><span>    kprint(&quot;文件系统位图块号:%d,文件系统整个逻辑储存块数:%d\\n&quot;, sbp-&amp;gt;rsb_bmpbks, sbp-&amp;gt;rsb_fsysallblk);</span></span>
<span class="line"><span>    kprint(&quot;文件系统根目录块号:%d 类型:%d\\n&quot;, sbp-&amp;gt;rsb_rootdir.rdr_blknr, sbp-&amp;gt;rsb_rootdir.rdr_type);</span></span>
<span class="line"><span>    kprint(&quot;文件系统根目录名称:%s\\n&quot;, sbp-&amp;gt;rsb_rootdir.rdr_name);</span></span>
<span class="line"><span>    del_superblk(devp, sbp);</span></span>
<span class="line"><span>    hal_sysdie(&quot;结束文件系统超级块测试&quot;);//死机用于观察测试结果</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//rfs驱动程序入口</span></span>
<span class="line"><span>drvstus_t rfs_entry(driver_t *drvp, uint_t val, void *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_rfs(devp);//初始化rfs</span></span>
<span class="line"><span>    test_rfs_superblk(devp);//测试文件系统超级块</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试代码我们已经写好了，下面我们打开终端，切换到Cosmos目录下执行make vboxtest，Cosmos加载rfs驱动程序运行后的结果，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/398697/a3cb6f6d31d2f5faaf77d2fbb3010fa4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/398697/a3cb6f6d31d2f5faaf77d2fbb3010fa4.jpg" alt=""></a></p><p>上图中我们可以看到，文件系统的标识、版本和最初定义的是相同的，逻辑储存块的大小为4KB。位图占用的是第1个逻辑储存块，因为第0个逻辑储存块被超级块占用了。</p><p>同时，我们还可以看到储存设备上共有1024个逻辑储存块，根目录文件的逻辑储存块为第2块，名称为“/”，这些正确的数据证明了建立超级块的代码是没有问题的。</p><h3 id="测试文件系统位图" tabindex="-1">测试文件系统位图 <a class="header-anchor" href="#测试文件系统位图" aria-label="Permalink to &quot;测试文件系统位图&quot;">​</a></h3><p>测试完了文件系统超级块，我们接着来测试文件系统位图。测试方法很简单，先读取位图块到一个缓冲区中，然后循环扫描这个缓冲区，看看里面有多少个为0的字节，即表明储存介质上有多少个空闲的逻辑储存块。</p><p>我们一起来写好这个测试函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void test_rfs_bitmap(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kprint(&quot;开始文件系统位图测试\\n&quot;);</span></span>
<span class="line"><span>    void *buf = new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    hal_memset(buf, 0, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    read_rfsdevblk(devp, buf, 1)//读取位图块</span></span>
<span class="line"><span>    u8_t *bmp = (u8_t *)buf;</span></span>
<span class="line"><span>    uint_t b = 0;</span></span>
<span class="line"><span>    //扫描位图块</span></span>
<span class="line"><span>    for (uint_t i = 0; i &amp;lt; FSYS_ALCBLKSZ; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (bmp[i] == 0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            b++;//记录空闲块</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kprint(&quot;文件系统空闲块数:%d\\n&quot;, b);</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    hal_sysdie(&quot;结束文件系统位图测试\\n&quot;);//死机用于观察测试结果</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>test_rfs_bitmap函数我们已经写好了，别忘了 <strong>在rfs_entry函数的末尾调用它</strong>，随后我们在终端下执行make vboxtest，就可以看到Cosmos加载rfs驱动程序运行后的结果，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/398697/718af93fc57342571df213c5c3989bf6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/398697/718af93fc57342571df213c5c3989bf6.jpg" alt=""></a></p><p>上图中的空闲块数为1021，表示储存介质上已经分配了3块逻辑储存块了。这就证明了我们建立文件系统位图的代码是没有问题的。</p><h3 id="测试文件系统根目录" tabindex="-1">测试文件系统根目录 <a class="header-anchor" href="#测试文件系统根目录" aria-label="Permalink to &quot;测试文件系统根目录&quot;">​</a></h3><p>最后我们来测试文件系统的根目录文件建立的对不对，测试方法就是先得到根目录文件的rfsdir_t结构，然后读取其中指向的逻辑储存块到缓冲区中，最后把它们的数据打印出来。</p><p>这个函数很简单，我们来写好它，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void test_rfs_rootdir(device_t *devp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kprint(&quot;开始文件系统根目录测试\\n&quot;);</span></span>
<span class="line"><span>    rfsdir_t *dr = get_rootdir(devp);</span></span>
<span class="line"><span>    void *buf = new_buf(FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    hal_memset(buf, 0, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    read_rfsdevblk(devp, buf, dr-&amp;gt;rdr_blknr)</span></span>
<span class="line"><span>    fimgrhd_t *fmp = (fimgrhd_t *)buf;</span></span>
<span class="line"><span>    kprint(&quot;文件管理头类型:%d 文件数据大小:%d 文件在开始块中偏移:%d 文件在结束块中的偏移:%d\\n&quot;,</span></span>
<span class="line"><span>            fmp-&amp;gt;fmd_type, fmp-&amp;gt;fmd_filesz, fmp-&amp;gt;fmd_fileifstbkoff, fmp-&amp;gt;fmd_fileiendbkoff);</span></span>
<span class="line"><span>    kprint(&quot;文件第一组开始块号:%d 块数:%d\\n&quot;, fmp-&amp;gt;fmd_fleblk[0].fb_blkstart, fmp-&amp;gt;fmd_fleblk[0].fb_blknr);</span></span>
<span class="line"><span>    del_buf(buf, FSYS_ALCBLKSZ);</span></span>
<span class="line"><span>    del_rootdir(devp, dr);</span></span>
<span class="line"><span>    hal_sysdie(&quot;结束文件系统根目录测试\\n&quot;);//死机用于观察测试结果</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>test_rfs_rootdir函数同样要在rfs_entry函数的末尾调用，然后我们在终端下执行make vboxtest，就可以看到cosmos加载rfs驱动程序运行后的结果了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/398697/f98f2035948514bdf5ffcc3a50b9061a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/398697/f98f2035948514bdf5ffcc3a50b9061a.jpg" alt=""></a></p><p>从上图我们可以看到，根目录文件的类型为目录文件类型。因为根目录文件才刚建立，所以文件大小为0，文件数据的存放位置从文件占用的第1块逻辑储存块的512字节处开始。因为第0、1块逻辑储存块被超级块和位图块占用了，所以根目录文件占用的逻辑储存块，就是第2块逻辑储存块，只占用了1块。</p><p>好了，上面一系列的测试结果，表明我们的文件系统格式化的代码正确无误，文件系统格式化操作的内容我们就告一段落了</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天的课程就到这里了，今天我们继续推进了文件系统的进度，实现了文件系统的格式化操作，我来为你把今天的课程重点梳理一下。</p><p>首先实现了文件系统设备驱动程序框架，这是因为我们之前的架构设计，把文件系统作为Cosmos系统下的一个设备，这有利于 <strong>扩展不同的文件系统。</strong></p><p>然后我们实现了文件系统格式化操作，包括建立文件系统超级块、位图、根目录操作，并且将它们串联在一起完成文件系统格式化。</p><p>最后是对文件系统测试，我们通过打印出文件系统超级块、位图还有根目录的相关数据来验证，最终确认了我们文件系统格式化操作的代码是正确的。</p><p>虽然我们实现了文件系统的格式化，也对其进行了测试，但是我们的文件系统还是不能存放文件，因为我们还没有实现操作文件相关的功能，下一节课我们继续探索。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问，建立文件系统的超级块、位图、根目录的三大函数的调用顺序可以随意调换吗，原因是什么？</p><p>欢迎你在留言区记录你的疑问或者收获，积极输出有利于你深入理解这节课的内容。同时，也欢迎你把这节课转给身边的同事、朋友。</p><p>好，我是LMOS，我们下节课见！</p>`,94)])])}const v=n(l,[["render",i]]);export{o as __pageData,v as default};
