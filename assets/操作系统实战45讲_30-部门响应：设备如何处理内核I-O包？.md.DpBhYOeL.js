import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const v=JSON.parse('{"title":"30 | 部门响应：设备如何处理内核I/O包？","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是I/O包","slug":"什么是i-o包","link":"#什么是i-o包","children":[{"level":3,"title":"创建和删除I/O包","slug":"创建和删除i-o包","link":"#创建和删除i-o包","children":[]}]},{"level":2,"title":"向设备发送I/O包","slug":"向设备发送i-o包","link":"#向设备发送i-o包","children":[]},{"level":2,"title":"驱动程序实例","slug":"驱动程序实例","link":"#驱动程序实例","children":[{"level":3,"title":"systick设备驱动程序的整体框架","slug":"systick设备驱动程序的整体框架","link":"#systick设备驱动程序的整体框架","children":[]},{"level":3,"title":"systick设备驱动程序的入口","slug":"systick设备驱动程序的入口","link":"#systick设备驱动程序的入口","children":[]},{"level":3,"title":"配置设备和驱动","slug":"配置设备和驱动","link":"#配置设备和驱动","children":[]},{"level":3,"title":"打开与关闭设备","slug":"打开与关闭设备","link":"#打开与关闭设备","children":[]},{"level":3,"title":"systick设备中断回调函数","slug":"systick设备中断回调函数","link":"#systick设备中断回调函数","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/30-部门响应：设备如何处理内核I-O包？.md","filePath":"操作系统实战45讲/30-部门响应：设备如何处理内核I-O包？.md","lastUpdated":1779820584000}'),i={name:"操作系统实战45讲/30-部门响应：设备如何处理内核I-O包？.md"};function l(t,s,c,d,o,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_30-部门响应-设备如何处理内核i-o包" tabindex="-1">30 | 部门响应：设备如何处理内核I/O包？ <a class="header-anchor" href="#_30-部门响应-设备如何处理内核i-o包" aria-label="Permalink to &quot;30 | 部门响应：设备如何处理内核I/O包？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>在上一课中，我们实现了建立设备的接口，这相当于制定了部门的相关法规，只要遵守这些法规就能建立一个部门。当然，建立了一个部门，是为了干活的，吃空饷可不行。</p><p>其实一个部门的职责不难确定，它应该能对上级下发的任务作出响应，并完成相关工作，而这对应到设备，就是如何处理内核的I/O包，这节课我们就来解决这个问题。</p><p>首先，我们需要搞清楚什么是I/O包，然后实现内核向设备发送I/O包的工作。最后，我还会带你一起来完成一个驱动实例，用于处理I/O包，这样你就能真正理解这里的来龙去脉了。</p><p>好，让我们开始今天的学习吧！代码你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson30/Cosmos" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="什么是i-o包" tabindex="-1">什么是I/O包 <a class="header-anchor" href="#什么是i-o包" aria-label="Permalink to &quot;什么是I/O包&quot;">​</a></h2><p>就像你要给部门下达任务时，需要准备材料报表之类的东西。同样，内核要求设备做什么事情，完成什么功能，必须要告诉设备的驱动程序。</p><p>内核要求设备完成任务，无非是调用设备的驱动程序函数，把完成任务的细节用参数的形式传递给设备的驱动程序。</p><p>由于参数很多，而且各种操作所需的参数又不相同，所以我们就想到了更高效的管理方法，也就是把各种操作所需的各种参数封装在一个数据结构中，称为I/O包，这样就可以统一驱动程序功能函数的形式了。</p><p>思路理清以后，现在我们来设计这个数据结构，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_OBJNODE</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    spinlock_t  on_lock;        //自旋锁</span></span>
<span class="line"><span>    list_h_t    on_list;        //链表</span></span>
<span class="line"><span>    sem_t       on_complesem;   //完成信号量</span></span>
<span class="line"><span>    uint_t      on_flgs;        //标志</span></span>
<span class="line"><span>    uint_t      on_stus;        //状态</span></span>
<span class="line"><span>    sint_t      on_opercode;    //操作码</span></span>
<span class="line"><span>    uint_t      on_objtype;     //对象类型</span></span>
<span class="line"><span>    void*       on_objadr;      //对象地址</span></span>
<span class="line"><span>    uint_t      on_acsflgs;     //访问设备、文件标志</span></span>
<span class="line"><span>    uint_t      on_acsstus;     //访问设备、文件状态</span></span>
<span class="line"><span>    uint_t      on_currops;     //对应于读写数据的当前位置</span></span>
<span class="line"><span>    uint_t      on_len;         //对应于读写数据的长度</span></span>
<span class="line"><span>    uint_t      on_ioctrd;      //IO控制码</span></span>
<span class="line"><span>    buf_t       on_buf;         //对应于读写数据的缓冲区</span></span>
<span class="line"><span>    uint_t      on_bufcurops;   //对应于读写数据的缓冲区的当前位置</span></span>
<span class="line"><span>    size_t      on_bufsz;       //对应于读写数据的缓冲区的大小</span></span>
<span class="line"><span>    uint_t      on_count;       //对应于对象节点的计数</span></span>
<span class="line"><span>    void*       on_safedsc;     //对应于对象节点的安全描述符</span></span>
<span class="line"><span>    void*       on_fname;       //对应于访问数据文件的名称</span></span>
<span class="line"><span>    void*       on_finode;      //对应于访问数据文件的结点</span></span>
<span class="line"><span>    void*       on_extp;        //用于扩展</span></span>
<span class="line"><span>}objnode_t;</span></span></code></pre></div><p>现在你可能还无法从objnode_t这个名字看出它跟I/O包的关系。但你从刚才的代码里可以看出，objnode_t的数据结构中包括了各个驱动程序功能函数的所有参数。</p><p>等我们后面讲到API接口时，你会发现，objnode_t结构不单是完成了I/O包传递参数的功能，它在整个I/O生命周期中，都起着重要的作用。这里为了好理解，我们就暂且把objnode_t结构当作I/O包来看。</p><h3 id="创建和删除i-o包" tabindex="-1">创建和删除I/O包 <a class="header-anchor" href="#创建和删除i-o包" aria-label="Permalink to &quot;创建和删除I/O包&quot;">​</a></h3><p>刚才，我们已经定义了I/O包也就是objnode_t结构，但若是要使用它，就必须先把它建立好。</p><p>根据以往的经验，你应该已经猜到了，这里创建I/O包就是在内存中建立objnode_t结构的实例变量并初始化它。由于这是一个全新的模块，所以我们要先在cosmos/kernel/目录下建立一个新的krlobjnode.c文件，在这个文件中写代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//建立objnode_t结构</span></span>
<span class="line"><span>objnode_t *krlnew_objnode()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    objnode_t *ondp = (objnode_t *)krlnew((size_t)sizeof(objnode_t));//分配objnode_t结构的内存空间</span></span>
<span class="line"><span>    if (ondp == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    objnode_t_init(ondp);//初始化objnode_t结构</span></span>
<span class="line"><span>    return ondp;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//删除objnode_t结构</span></span>
<span class="line"><span>bool_t krldel_objnode(objnode_t *onodep)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (krldelete((adr_t)onodep, (size_t)sizeof(objnode_t)) == FALSE)//删除objnode_t结构的内存空间</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        hal_sysdie(&quot;krldel_objnode err&quot;);</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码非常简单，主要完成了建立、删除objnode_t结构这两件事，其实说白了就是分配和释放objnode_t结构的内存空间。</p><p>这里再一次体现了 <strong>内存管理组件在操作系统内核之中的重要性</strong>，objnode_t_init函数会初始化objnode_t结构中的字段，因为其中有自旋锁、链表、信号量，而这些结构并不能简单地初始为0，否则可以直接使用memset之类的函数把那个内存空间清零就行了。</p><h2 id="向设备发送i-o包" tabindex="-1">向设备发送I/O包 <a class="header-anchor" href="#向设备发送i-o包" aria-label="Permalink to &quot;向设备发送I/O包&quot;">​</a></h2><p>现在我们假定在上层接口函数中，已经建立了一个I/O包（即objnode_t结构），并且把操作码、操作对象和相关的参数信息填写到了objnode_t结构之中。那么下一步，就需要把这个I/O发送给具体设备的驱动程序，以便驱动程序完成具体工作。</p><p>我们需要定义实现一个函数，专门用于完成这个功能，它标志着一个设备驱动程序开始运行，经它之后内核就实际的控制权交给驱动程序，由驱动程序代表内核操控设备。</p><p>下面，我们就来写好这个函数，不过这个函数属于驱动模型函数，所以要在krldevice.c文件中实现这个函数。代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//发送设备IO</span></span>
<span class="line"><span>drvstus_t krldev_io(objnode_t *nodep)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取设备对象</span></span>
<span class="line"><span>    device_t *devp = (device_t *)(nodep-&amp;gt;on_objadr);</span></span>
<span class="line"><span>    if ((nodep-&amp;gt;on_objtype != OBJN_TY_DEV &amp;&amp; nodep-&amp;gt;on_objtype != OBJN_TY_FIL) || nodep-&amp;gt;on_objadr == NULL)</span></span>
<span class="line"><span>    {//检查操作对象类型是不是文件或者设备，对象地址是不是为空</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (nodep-&amp;gt;on_opercode &amp;lt; 0 || nodep-&amp;gt;on_opercode &amp;gt;= IOIF_CODE_MAX)</span></span>
<span class="line"><span>    {//检查IO操作码是不是合乎要求</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return krldev_call_driver(devp, nodep-&amp;gt;on_opercode, 0, 0, NULL, nodep);//调用设备驱动</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//调用设备驱动</span></span>
<span class="line"><span>drvstus_t krldev_call_driver(device_t *devp, uint_t iocode, uint_t val1, uint_t val2, void *p1, void *p2)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    driver_t *drvp = NULL;</span></span>
<span class="line"><span>    if (devp == NULL || iocode &amp;gt;= IOIF_CODE_MAX)</span></span>
<span class="line"><span>    {//检查设备和IO操作码</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    drvp = devp-&amp;gt;dev_drv;</span></span>
<span class="line"><span>    if (drvp == NULL)//检查设备是否有驱动程序</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //用IO操作码为索引调用驱动程序功能分派函数数组中的函数</span></span>
<span class="line"><span>    return drvp-&amp;gt;drv_dipfun[iocode](devp, p2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>krldev_io函数，只接受一个参数，也就是objnode_t结构的指针。它会首先检查objnode_t结构中的IO操作码是不是合乎要求的，还要检查被操作的对象即设备是不是为空，然后调用krldev_call_driver函数。</p><p>这个krldev_call_driver函数会再次确认传递进来的设备和IO操作码，然后重点检查设备有没有驱动程序。这一切检查通过之后，我们就用IO操作码为索引调用驱动程序功能分派函数数组中的函数，并把设备和objnode_t结构传递进去。有没有觉得眼熟？没错，这正是我们 <a href="https://time.geekbang.org/column/article/394875" target="_blank" rel="noreferrer">前面课程</a> 中对驱动程序的设计。</p><p>好了，现在一个设备的驱动程序就能正式开始工作，开始响应处理内核发来的I/O包了。可是我们还没有驱动呢，所以下面我们就去实现一个驱动程序。</p><h2 id="驱动程序实例" tabindex="-1">驱动程序实例 <a class="header-anchor" href="#驱动程序实例" aria-label="Permalink to &quot;驱动程序实例&quot;">​</a></h2><p>现在我们一起来实现一个真实而且简单的设备驱动程序，就是systick设备驱动，它是我们Cosmos系统的心跳，systick设备的主要功能和作用是每隔 1ms产生一个中断，相当于一个定时器，每次时间到达就产生一个中断向系统报告又过了1ms，相当于千分之一秒，即每秒钟内产生1000次中断。</p><p>对于现代CPU的速度来说，这个中断频率不算太快。x86平台上有没有这样的定时器呢？当然有，其中8254就是一个古老且常用的定时器，对它进行编程设定，它就可以周期的产生定时器中断。</p><p>这里我们就以8254定时器为基础，实现Cosmos系统的systick设备。我们先从systick设备驱动程序的整体框架入手，然后建立systick设备，最后一步一步实现systick设备驱动程序。</p><h3 id="systick设备驱动程序的整体框架" tabindex="-1">systick设备驱动程序的整体框架 <a class="header-anchor" href="#systick设备驱动程序的整体框架" aria-label="Permalink to &quot;systick设备驱动程序的整体框架&quot;">​</a></h3><p>在前面的课程中，我们已经了解了在Cosmos系统下，一个设备驱动程序的基本框架，但是我们没有深入具体化。</p><p>所以，这里我会带你从全局好好了解一个真实的设备，它的驱动程序应该至少有哪些函数。由于这是个驱动程序，我们需要在cosmos/drivers/目录下建立一个drvtick.c文件，在drvtick.c文件中写入以下代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//驱动程序入口和退出函数</span></span>
<span class="line"><span>drvstus_t systick_entry(driver_t *drvp, uint_t val, void *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>drvstus_t systick_exit(driver_t *drvp, uint_t val, void *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//设备中断处理函数</span></span>
<span class="line"><span>drvstus_t systick_handle(uint_t ift_nr, void *devp, void *sframe)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCEERSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//打开、关闭设备函数</span></span>
<span class="line"><span>drvstus_t systick_open(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>drvstus_t systick_close(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//读、写设备数据函数</span></span>
<span class="line"><span>drvstus_t systick_read(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>drvstus_t systick_write(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//调整读写设备数据位置函数</span></span>
<span class="line"><span>drvstus_t systick_lseek(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//控制设备函数</span></span>
<span class="line"><span>drvstus_t systick_ioctrl(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//开启、停止设备函数</span></span>
<span class="line"><span>drvstus_t systick_dev_start(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>drvstus_t systick_dev_stop(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//设置设备电源函数</span></span>
<span class="line"><span>drvstus_t systick_set_powerstus(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//枚举设备函数</span></span>
<span class="line"><span>drvstus_t systick_enum_dev(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//刷新设备缓存函数</span></span>
<span class="line"><span>drvstus_t systick_flush(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//设备关机函数</span></span>
<span class="line"><span>drvstus_t systick_shutdown(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return DFCERRSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上就是一个驱动程序必不可少的函数， <strong>在各个函数可以返回一个错误状态，而不做任何实际工作，但是必须要有这个函数。</strong> 这样在内核发来任何设备功能请求时，驱动程序才能给予适当的响应。这样，一个驱动程序的整体框架就确定了。</p><p>写好了驱动程序的整体框架，我们这个驱动就完成了一半。下面我们来一步一步来实现它。</p><h3 id="systick设备驱动程序的入口" tabindex="-1">systick设备驱动程序的入口 <a class="header-anchor" href="#systick设备驱动程序的入口" aria-label="Permalink to &quot;systick设备驱动程序的入口&quot;">​</a></h3><p>我们先来写好systick设备驱动程序的入口函数。那这个函数用来做什么呢？其实我们在上一节课就详细讨论过，无非是建立设备，向内核注册设备，安装中断回调函数等操作，所以这里不再赘述。</p><p>我们直接写出这个函数，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t systick_entry(driver_t* drvp,uint_t val,void* p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if(drvp==NULL) //drvp是内核传递进来的参数，不能为NULL</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    device_t* devp=new_device_dsc();//建立设备描述符结构的变量实例</span></span>
<span class="line"><span>    if(devp==NULL)//不能失败</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    systick_set_driver(drvp);</span></span>
<span class="line"><span>    systick_set_device(devp,drvp);//驱动程序的功能函数设置到driver_t结构中的drv_dipfun数组中</span></span>
<span class="line"><span>    if(krldev_add_driver(devp,drvp)==DFCERRSTUS)//将设备挂载到驱动中</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if(del_device_dsc(devp)==DFCERRSTUS)//注意释放资源。</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return DFCERRSTUS;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(krlnew_device(devp)==DFCERRSTUS)//向内核注册设备</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if(del_device_dsc(devp)==DFCERRSTUS)//注意释放资源</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return DFCERRSTUS;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //安装中断回调函数systick_handle</span></span>
<span class="line"><span>    if(krlnew_devhandle(devp,systick_handle,20)==DFCERRSTUS)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return DFCERRSTUS;  //注意释放资源。</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    init_8254();//初始化物理设备</span></span>
<span class="line"><span>    if(krlenable_intline(0x20)==DFCERRSTUS)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return DFCERRSTUS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可能非常熟悉这部分代码，没错，这正是上节课中，我们的那个驱动程序入口函数的实例。</p><p>不过在上节课里，我们主要是要展示一个驱动程序入口函数的流程。这里却是要投入工作的真实设备驱动。</p><p>最后的 <strong>krlenable_intline函数</strong>，它的主要功能是开启一个中断源上的中断。而init_8254函数则是为了初始化8254，它就是一个古老且常用的定时器。这两个函数非常简单，我已经帮写好了。</p><p>但是这样还不够，有了驱动程序入口函数，驱动程序并不会自动运行。根据前面我们的设计，需要把这个驱动程序入口函数放入驱动表中。</p><p>下面我们就把这个systick_entry函数，放到驱动表里，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cosmos/kernel/krlglobal.c</span></span>
<span class="line"><span>KRL_DEFGLOB_VARIABLE(drventyexit_t,osdrvetytabl)[]={systick_entry,NULL};</span></span></code></pre></div><p>有了刚才这步操作之后，Cosmos在启动的时候，就会执行初始驱动初始化init_krldriver函数，接着这个函数就会启动运行systick设备驱动程序入口函数。我们的systick_entry函数一旦执行，就会建立systick设备，不断的产生时钟中断。</p><h3 id="配置设备和驱动" tabindex="-1">配置设备和驱动 <a class="header-anchor" href="#配置设备和驱动" aria-label="Permalink to &quot;配置设备和驱动&quot;">​</a></h3><p>在驱动程序入口函数中，除了那些标准的流程之外，我们还要对设备和驱动进行适当的配置，就是设置一些标志、状态、名称、驱动功能派发函数等等。有了这些信息，设备才能加入到驱动程序中，然后注册到内核，这样才能被内核所识别。</p><p>好，让我们先来实现设置驱动程序的函数，它主要设置设备驱动程序的名称、功能派发函数，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void systick_set_driver(driver_t *drvp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //设置驱动程序功能派发函数</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_OPEN] = systick_open;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_CLOSE] = systick_close;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_READ] = systick_read;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_WRITE] = systick_write;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_LSEEK] = systick_lseek;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_IOCTRL] = systick_ioctrl;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_DEV_START] = systick_dev_start;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_DEV_STOP] = systick_dev_stop;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_SET_POWERSTUS] = systick_set_powerstus;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_ENUM_DEV] = systick_enum_dev;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_FLUSH] = systick_flush;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_dipfun[IOIF_CODE_SHUTDOWN] = systick_shutdown;</span></span>
<span class="line"><span>    drvp-&amp;gt;drv_name = &quot;systick0drv&quot;;//设置驱动程序名称</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的功能并不复杂，我一说你就能领会。systick_set_driver函数，无非就是将12个驱动功能函数的地址，分别设置到driver_t结构的drv_dipfun数组中。其中，驱动功能函数在该数组中的元素位置，正好与IO操作码一一对应，当内核用IO操作码调用驱动时，就是调用了这个数据中的函数。最后，我们将驱动程序的名称设置为systick0drv。</p><p>新建的设备也需要配置相关的信息才能工作，比如需要指定设备，设备状态与标志，设备类型、设备名称这些信息。尤其要注意的是，设备类型非常重要，内核正是通过类型来区分各种设备的，下面我们写个函数，完成这些功能，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void systick_set_device(device_t *devp, driver_t *drvp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    devp-&amp;gt;dev_flgs = DEVFLG_SHARE;//设备可共享访问</span></span>
<span class="line"><span>    devp-&amp;gt;dev_stus = DEVSTS_NORML;//设备正常状态</span></span>
<span class="line"><span>    devp-&amp;gt;dev_id.dev_mtype = SYSTICK_DEVICE;//设备主类型</span></span>
<span class="line"><span>    devp-&amp;gt;dev_id.dev_stype = 0;//设备子类型</span></span>
<span class="line"><span>    devp-&amp;gt;dev_id.dev_nr = 0; //设备号</span></span>
<span class="line"><span>    devp-&amp;gt;dev_name = &quot;systick0&quot;;//设置设备名称</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，systick_set_device函数需要两个参数，但是第二个参数暂时没起作用，而第一个参数其实是一个device_t结构的指针，在systick_entry函数中调用new_device_dsc函数的时候，就会返回这个指针。后面我们会把设备加载到内核中，那时这个指针指向的设备才会被注册。</p><h3 id="打开与关闭设备" tabindex="-1">打开与关闭设备 <a class="header-anchor" href="#打开与关闭设备" aria-label="Permalink to &quot;打开与关闭设备&quot;">​</a></h3><p>其实对于systick这样设备，主要功能是定时中断，还不能支持读、写、控制、刷新、电源相关的功能，就算内核对systick设备发起了这样的I/O包，systick设备驱动程序相关的功能函数也只能返回一个错误码，表示不支持这样的功能请求。</p><p>但是，打开与关闭设备这样的功能还是应该要实现。下面我们就来实现这两个功能请求函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//打开设备</span></span>
<span class="line"><span>drvstus_t systick_open(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    krldev_inc_devcount(devp);//增加设备计数</span></span>
<span class="line"><span>    return DFCOKSTUS;//返回成功完成的状态</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//关闭设备</span></span>
<span class="line"><span>drvstus_t systick_close(device_t *devp, void *iopack)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    krldev_dec_devcount(devp);//减少设备计数</span></span>
<span class="line"><span>    return DFCOKSTUS;//返回成功完成的状态</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，打开与关闭设备的功能就实现了，只是简单地增加与减少设备的引用计数，然后返回成功完成的状态就行了。而增加与减少设备的引用计数，是为了统计有多少个进程打开了这个设备，当设备引用计数为0时，就说明没有进程使用该设备。</p><h3 id="systick设备中断回调函数" tabindex="-1">systick设备中断回调函数 <a class="header-anchor" href="#systick设备中断回调函数" aria-label="Permalink to &quot;systick设备中断回调函数&quot;">​</a></h3><p>对于systick设备来说，重要的并不是打开、关闭，读写等操作，而是systick设备产生的中断，以及在中断回调函数中执行的操作，即周期性的执行系统中的某些动作，比如更新系统时间，比如控制一个进程占用CPU的运行时间等，这些操作都需要在systick设备中断回调函数中执行。</p><p>按照前面的设计，systick设备每秒钟产生1000次中断，那么1秒钟就会调用1000次这个中断回调函数，这里我们只要写出这个函数就行了，因为安装中断回调函数的思路，我们在前面的课程中已经说过了（可以回顾上节课），现在我们直接实现这个中断函数，代码可以像后面这样写。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t systick_handle(uint_t ift_nr, void *devp, void *sframe)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kprint(&quot;systick_handle run devname:%s intptnr:%d\\n&quot;, ((device_t *)devp)-&amp;gt;dev_name, ift_nr);</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个中断回调函数，暂时什么也没干，就输出一条信息，让我们知道它运行了，为了直观观察它运行了，我们要对内核层初始化函数修改一下，禁止进程运行，以免进程输出的信息打扰我们观察结果，修改的代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_krl()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_krlmm();</span></span>
<span class="line"><span>    init_krldevice();//初始化设备</span></span>
<span class="line"><span>    init_krldriver();//初始化驱动程序</span></span>
<span class="line"><span>    init_krlsched();</span></span>
<span class="line"><span>    //init_krlcpuidle();禁止进程运行</span></span>
<span class="line"><span>    STI();//打开CPU响应中断的能力</span></span>
<span class="line"><span>    die(0);//进入死循环</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面，我们打开终端切到Cosmos目录下，执行make vboxtest指令，如果不出意外，我们将会中看到如下界面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/395772/84c7837a89eb56b2863c8b30eb1217e9.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/395772/84c7837a89eb56b2863c8b30eb1217e9.jpg" alt=""></a></p><p>上图中的信息，会不断地滚动出现，信息中包含设备名称和中断号，这标志着我们中断回调函数的运行正确无误。</p><p>当然，如果我们费了这么功夫搞了中断回调函数，就只是为了输出信息，那也太不划算了，我们当然有更重要的事情要做，你还记得之前讲过的进程知识吗？这里我再帮你理一理思路。</p><p>我们在每个进程中都要主动调用进程调度器函数，否则进程就会永远霸占CPU，永远运行下去。这是因为，我们没有定时器可以周期性地检查进程运行了多长时间，如果进程的运行时间超过了，就应该强制调度，让别的进程开始运行。</p><p>更新进程运行时间的代码，我已经帮你写好了，你只需要在这个中断回调函数中调用就好了，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drvstus_t systick_handle(uint_t ift_nr, void *devp, void *sframe)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    krlthd_inc_tick(krlsched_retn_currthread());//更新当前进程的tick</span></span>
<span class="line"><span>    return DFCOKSTUS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的krlthd_inc_tick函数需要一个进程指针的参数，而krlsched_retn_currthread函数是返回当前正在运行进程的指针。在krlthd_inc_tick函数中对进程的tick值加1，如果大于20（也就是20 毫秒）就重新置0，并进行调度。</p><p>下面，我们把内核层初始化函数恢复到原样，重新打开终端切到cosmos目录下，执行make vboxtest指令，我们就将会看到如下界面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/395772/75647910ba0529e6c80ba127bbe9c247.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/395772/75647910ba0529e6c80ba127bbe9c247.jpg" alt=""></a></p><p>我们可以看到，进程A、进程B，还有调度器交替输出的信息。这已经证明我们更新进程运行时间，检查其时间是否用完并进行调度的代码逻辑，都是完全正确的，恭喜你走到了这一步！</p><p>至此，我们的systick驱动程序就实现了，它非常简单，但却包含了一个驱动程序完整实现。同时，这个过程也一步步验证了我们对驱动模型的设计是正确的。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>又到课程的结尾，到此为止，我们了解了实现一个驱动程序完整过程，虽然我们只是驱动了一个定时器设备，使之周期性的产生定时中断。在定时器设备的中断回调函数中，我们调用了更新进程时间的函数，达到了这样的目的：在进程运行超时的情况下，内核有能力夺回CPU，调度别的进程运行。</p><p>现在我来为你梳理一下重点。</p><p>1.为了搞清楚设备如何处理I/O包，我们了解了什么是I/O包，写好了处理建立、删除I/O包的代码。</p><p>2.要使设备完成相应的功能，内核就必须向设备驱动发送相应的I/O包，在I/O包提供相应IO操作码和适当的参数。所以，我们动手实现了向设备发送I/O包并调用设备驱动程序的机制。</p><p>3.一切准备就绪之后，我们建立了systick驱动程序实例，这是一个完整的驱动程序，它支持打开关闭和周期性产生中断的功能请求。通过这个实例，让我们了解了一个真实设备驱动的实现以及它处理内核I/O包的过程。</p><p>你可能对这样简单的驱动程序不够满意，也不能肯定我们的驱动模型是不是能适应大多数场景，请不要着急，在后面讲到文件系统时，我们会实现一个更为复杂的驱动程序。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你想一想，为什么没有systick设备这样周期性的产生中断，进程就有可能霸占CPU呢？</p><p>欢迎你在留言区跟我交流互动，也欢迎你把这节课分享给身边的同事、朋友，一起实践驱动程序的实例。</p><p>好，我是LMOS，我们下节课见！</p>`,91)])])}const u=n(i,[["render",l]]);export{v as __pageData,u as default};
