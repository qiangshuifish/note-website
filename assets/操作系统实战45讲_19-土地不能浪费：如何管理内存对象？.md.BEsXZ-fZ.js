import{_ as n,H as a,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const k=JSON.parse('{"title":"19 | 土地不能浪费：如何管理内存对象？","description":"","frontmatter":{},"headers":[{"level":2,"title":"malloc给我们的启发","slug":"malloc给我们的启发","link":"#malloc给我们的启发","children":[]},{"level":2,"title":"页还能细分吗","slug":"页还能细分吗","link":"#页还能细分吗","children":[]},{"level":2,"title":"如何表示一个内存对象","slug":"如何表示一个内存对象","link":"#如何表示一个内存对象","children":[]},{"level":2,"title":"内存对象容器","slug":"内存对象容器","link":"#内存对象容器","children":[]},{"level":2,"title":"初始化","slug":"初始化","link":"#初始化","children":[]},{"level":2,"title":"分配内存对象","slug":"分配内存对象","link":"#分配内存对象","children":[{"level":3,"title":"分配内存对象的接口","slug":"分配内存对象的接口","link":"#分配内存对象的接口","children":[]},{"level":3,"title":"查找内存对象容器","slug":"查找内存对象容器","link":"#查找内存对象容器","children":[]},{"level":3,"title":"建立内存对象容器","slug":"建立内存对象容器","link":"#建立内存对象容器","children":[]},{"level":3,"title":"扩容内存对象容器","slug":"扩容内存对象容器","link":"#扩容内存对象容器","children":[]},{"level":3,"title":"分配内存对象","slug":"分配内存对象-1","link":"#分配内存对象-1","children":[]}]},{"level":2,"title":"释放内存对象","slug":"释放内存对象","link":"#释放内存对象","children":[{"level":3,"title":"释放内存对象的接口","slug":"释放内存对象的接口","link":"#释放内存对象的接口","children":[]},{"level":3,"title":"查找内存对象容器","slug":"查找内存对象容器-1","link":"#查找内存对象容器-1","children":[]},{"level":3,"title":"释放内存对象","slug":"释放内存对象-1","link":"#释放内存对象-1","children":[]},{"level":3,"title":"销毁内存对象容器","slug":"销毁内存对象容器","link":"#销毁内存对象容器","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/19-土地不能浪费：如何管理内存对象？.md","filePath":"操作系统实战45讲/19-土地不能浪费：如何管理内存对象？.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/19-土地不能浪费：如何管理内存对象？.md"};function t(i,s,c,m,o,_){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_19-土地不能浪费-如何管理内存对象" tabindex="-1">19 | 土地不能浪费：如何管理内存对象？ <a class="header-anchor" href="#_19-土地不能浪费-如何管理内存对象" aria-label="Permalink to &quot;19 | 土地不能浪费：如何管理内存对象？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>在前面的课程中，我们建立了物理内存页面管理器，它既可以分配单个页面，也可以分配多个连续的页面，还能指定在特殊内存地址区域中分配页面。</p><p>但你发现没有，物理内存页面管理器一次分配至少是一个页面，而我们对内存分页是一个页面4KB，即4096字节。对于小于一个页面的内存分配请求，它无能为力。如果要实现小于一个页面的内存分配请求，又该怎么做呢？</p><p>这节课我们就一起来解决这个问题。课程配套代码，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson19~21/Cosmos" target="_blank" rel="noreferrer">这里</a> 获得。</p><h2 id="malloc给我们的启发" tabindex="-1">malloc给我们的启发 <a class="header-anchor" href="#malloc给我们的启发" aria-label="Permalink to &quot;malloc给我们的启发&quot;">​</a></h2><p>首先，我想和你说说，为什么小于一个页面的内存我们也要格外珍惜？</p><p>如果你在大学学过C程序设计语言的话，相信你对C库中的malloc函数也不会陌生，它负责完成分配一块内存空间的功能。</p><p>下面的代码。我相信你也写过，或者写过类似的，不用多介绍你也可以明白。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>int main() {</span></span>
<span class="line"><span>    char *str;</span></span>
<span class="line"><span>    //内存分配 存放15个char字符类型</span></span>
<span class="line"><span>    str = (char *) malloc(15);</span></span>
<span class="line"><span>    if (str == NULL) {</span></span>
<span class="line"><span>        printf(&quot;mem alloc err\\n&quot;);</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //把hello world字符串复制到str开始的内存地址空间中</span></span>
<span class="line"><span>    strcpy(str, &quot;hello world&quot;);</span></span>
<span class="line"><span>    //打印hello world字符串和它的地址</span></span>
<span class="line"><span>    printf(&quot;String = %s,  Address = %u\\n&quot;, str, str);</span></span>
<span class="line"><span>    //释放分配的内存</span></span>
<span class="line"><span>    free(str);</span></span>
<span class="line"><span>    return(0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个代码流程很简单，就是分配一块15字节大小的内存空间，然后把字符串复制到分配的内存空间中，最后用字符串的形式打印了那个块内存，最后释放该内存空间。</p><p>但我们并不是要了解malloc、free函数的工作原理，而是要清楚，像这样分配几个字节内存空间的操作，这在内核中比比皆是。</p><h2 id="页还能细分吗" tabindex="-1">页还能细分吗 <a class="header-anchor" href="#页还能细分吗" aria-label="Permalink to &quot;页还能细分吗&quot;">​</a></h2><p>是的，单从内存角度来看，页最小是以字节为单位的。但是从MMU角度看，内存是以页为单位的，所以我们的Cosmos的物理内存分配器也以页为单位。现在的问题是，内核中有大量远小于一个页面的内存分配请求，如果对此还是分配一个页面，就会浪费内存。</p><p>要想解决这个问题， <strong>就要细分“页”这个单位</strong>。虽然从MMU角度来看，页不能细分，但是从软件逻辑层面页可以细分，但是如何分，则十分讲究。</p><p>结合历史经验和硬件特性（Cache行大小）来看，我们可以把一个页面或者连续的多个页面，分成32字节、64字节、128字节、256字节、512字节、1024字节、2048字节、4096字节（一个页）。这些都是Cache行大小的倍数。我们给这些小块内存取个名字，叫 <strong>内存对象</strong>。</p><p>我们可以这样设计： <strong>把一个或者多个内存页面分配出来，作为一个内存对象的容器，在这个容器中容纳相同的内存对象，即同等大小的内存块。</strong> 你可以把这个容器，想像成一个内存对象数组。为了让你更好理解，我还给你画了张图解释。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/386400/a9e3c059aceb3433de2116f9bee02d47.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/386400/a9e3c059aceb3433de2116f9bee02d47.jpg" alt=""></a></p><h2 id="如何表示一个内存对象" tabindex="-1">如何表示一个内存对象 <a class="header-anchor" href="#如何表示一个内存对象" aria-label="Permalink to &quot;如何表示一个内存对象&quot;">​</a></h2><p>前面只是进行了理论上的设计和构想，下面我们就通过代码来实现这些构想，真正把想法变成现实。</p><p>我们从内存对象开始入手。如何表示一个内存对象呢？当然是要设计一个表示内存对象的数据结构，代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_FREOBJH</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t oh_list;     //链表</span></span>
<span class="line"><span>    uint_t oh_stus;       //对象状态</span></span>
<span class="line"><span>    void* oh_stat;        //对象的开始地址</span></span>
<span class="line"><span>}freobjh_t;</span></span></code></pre></div><p>我们在后面的代码中就用freobjh_t结构表示一个对象，其中的链表是为了找到这个对象。是不是很简单？没错，表示一个内存对象就是如此简单。</p><h2 id="内存对象容器" tabindex="-1">内存对象容器 <a class="header-anchor" href="#内存对象容器" aria-label="Permalink to &quot;内存对象容器&quot;">​</a></h2><p>光有内存对象还不够，如何放置内存对象是很重要的。根据前面的构想，为了把多个同等大小的内存对象放在一个内存对象容器中，我们需要设计出表示内存对象容器的数据结构。内存容器要占用内存页面，需要内存对象计数信息、内存对象大小信息，还要能扩展容量。</p><p>把上述功能综合起来，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//管理内存对象容器占用的内存页面所对应的msadsc_t结构</span></span>
<span class="line"><span>typedef struct s_MSCLST</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t ml_msanr;  //多少个msadsc_t</span></span>
<span class="line"><span>    uint_t ml_ompnr;  //一个msadsc_t对应的连续的物理内存页面数</span></span>
<span class="line"><span>    list_h_t ml_list; //挂载msadsc_t的链表</span></span>
<span class="line"><span>}msclst_t;</span></span>
<span class="line"><span>//管理内存对象容器占用的内存</span></span>
<span class="line"><span>typedef struct s_MSOMDC</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //msclst_t结构数组mc_lst[0]=1个连续页面的msadsc_t</span></span>
<span class="line"><span>    //               mc_lst[1]=2个连续页面的msadsc_t</span></span>
<span class="line"><span>    //               mc_lst[2]=4个连续页面的msadsc_t</span></span>
<span class="line"><span>    //               mc_lst[3]=8个连续页面的msadsc_t</span></span>
<span class="line"><span>    //               mc_lst[4]=16个连续页面的msadsc_t</span></span>
<span class="line"><span>    msclst_t mc_lst[MSCLST_MAX];</span></span>
<span class="line"><span>    uint_t mc_msanr;   //总共多个msadsc_t结构</span></span>
<span class="line"><span>    list_h_t mc_list;</span></span>
<span class="line"><span>    //内存对象容器第一个占用msadsc_t</span></span>
<span class="line"><span>    list_h_t mc_kmobinlst;</span></span>
<span class="line"><span>    //内存对象容器第一个占用msadsc_t对应的连续的物理内存页面数</span></span>
<span class="line"><span>    uint_t mc_kmobinpnr;</span></span>
<span class="line"><span>}msomdc_t;</span></span>
<span class="line"><span>//管理内存对象容器扩展容量</span></span>
<span class="line"><span>typedef struct s_KMBEXT</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t mt_list;        //链表</span></span>
<span class="line"><span>    adr_t mt_vstat;          //内存对象容器扩展容量开始地址</span></span>
<span class="line"><span>    adr_t mt_vend;           //内存对象容器扩展容量结束地址</span></span>
<span class="line"><span>    kmsob_t* mt_kmsb;        //指向内存对象容器结构</span></span>
<span class="line"><span>    uint_t mt_mobjnr;        //内存对象容器扩展容量的内存中有多少对象</span></span>
<span class="line"><span>}kmbext_t;</span></span>
<span class="line"><span>//内存对象容器</span></span>
<span class="line"><span>typedef struct s_KMSOB</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t so_list;        //链表</span></span>
<span class="line"><span>    spinlock_t so_lock;      //保护结构自身的自旋锁</span></span>
<span class="line"><span>    uint_t so_stus;          //状态与标志</span></span>
<span class="line"><span>    uint_t so_flgs;</span></span>
<span class="line"><span>    adr_t so_vstat;          //内存对象容器的开始地址</span></span>
<span class="line"><span>    adr_t so_vend;           //内存对象容器的结束地址</span></span>
<span class="line"><span>    size_t so_objsz;         //内存对象大小</span></span>
<span class="line"><span>    size_t so_objrelsz;      //内存对象实际大小</span></span>
<span class="line"><span>    uint_t so_mobjnr;        //内存对象容器中总共的对象个数</span></span>
<span class="line"><span>    uint_t so_fobjnr;        //内存对象容器中空闲的对象个数</span></span>
<span class="line"><span>    list_h_t so_frelst;      //内存对象容器中空闲的对象链表头</span></span>
<span class="line"><span>    list_h_t so_alclst;      //内存对象容器中分配的对象链表头</span></span>
<span class="line"><span>    list_h_t so_mextlst;     //内存对象容器扩展kmbext_t结构链表头</span></span>
<span class="line"><span>    uint_t so_mextnr;        //内存对象容器扩展kmbext_t结构个数</span></span>
<span class="line"><span>    msomdc_t so_mc;          //内存对象容器占用内存页面管理结构</span></span>
<span class="line"><span>    void* so_privp;          //本结构私有数据指针</span></span>
<span class="line"><span>    void* so_extdp;          //本结构扩展数据指针</span></span>
<span class="line"><span>}kmsob_t;</span></span></code></pre></div><p>这段代码中设计了四个数据结构：kmsob_t用于表示内存对象容器，kmbext_t用于表示内存对象容器的扩展内存，msomdc_t和msclst_t用于管理内存对象容器占用的物理内存页面。</p><p>你可能很难理解它们之间的关系，所以我为你准备了一幅图，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/386400/7yye7013ae2a878286fc6052c9318bbb.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/386400/7yye7013ae2a878286fc6052c9318bbb.jpg" alt=""></a></p><p>结合图示我们可以发现，在一组连续物理内存页面（用来存放内存对象）的开始地址那里，就存放着我们kmsob_t和kmbext_t的实例变量，它们占用了几十字节的空间。</p><h2 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h2><p>因为kmsob_t、kmbext_t、freobjh_t结构的实例变量，它们是建立内存对象容器时创建并初始化的，这个过程是伴随着分配内存对象而进行的，所以内存对象管理器的初始化很简单。</p><p>但是有一点还是要初始化的，那就是 <strong>管理kmsob_t结构的数据结构</strong>，它用于挂载不同大小的内存容器。现在我们就在cosmos/hal/x86/目录下建立一个kmsob.c文件，来实现这个数据结构并初始化，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define KOBLST_MAX (64)</span></span>
<span class="line"><span>//挂载kmsob_t结构</span></span>
<span class="line"><span>typedef struct s_KOBLST</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t ol_emplst; //挂载kmsob_t结构的链表</span></span>
<span class="line"><span>    kmsob_t* ol_cahe;   //最近一次查找的kmsob_t结构</span></span>
<span class="line"><span>    uint_t ol_emnr;     //挂载kmsob_t结构的数量</span></span>
<span class="line"><span>    size_t ol_sz;       //kmsob_t结构中内存对象的大小</span></span>
<span class="line"><span>}koblst_t;</span></span>
<span class="line"><span>//管理kmsob_t结构的数据结构</span></span>
<span class="line"><span>typedef struct s_KMSOBMGRHED</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    spinlock_t ks_lock;  //保护自身的自旋锁</span></span>
<span class="line"><span>    list_h_t ks_tclst;   //链表</span></span>
<span class="line"><span>    uint_t ks_tcnr;</span></span>
<span class="line"><span>    uint_t ks_msobnr;    //总共多少个kmsob_t结构</span></span>
<span class="line"><span>    kmsob_t* ks_msobche; //最近分配内存对象的kmsob_t结构</span></span>
<span class="line"><span>    koblst_t ks_msoblst[KOBLST_MAX]; //koblst_t结构数组</span></span>
<span class="line"><span>}kmsobmgrhed_t;</span></span>
<span class="line"><span>//初始化koblst_t结构体</span></span>
<span class="line"><span>void koblst_t_init(koblst_t *initp, size_t koblsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;ol_emplst);</span></span>
<span class="line"><span>    initp-&amp;gt;ol_cahe = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;ol_emnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ol_sz = koblsz;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化kmsobmgrhed_t结构体</span></span>
<span class="line"><span>void kmsobmgrhed_t_init(kmsobmgrhed_t *initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    size_t koblsz = 32;</span></span>
<span class="line"><span>    knl_spinlock_init(&amp;initp-&amp;gt;ks_lock);</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;ks_tclst);</span></span>
<span class="line"><span>    initp-&amp;gt;ks_tcnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ks_msobnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;ks_msobche = NULL;</span></span>
<span class="line"><span>    for (uint_t i = 0; i &amp;lt; KOBLST_MAX; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        koblst_t_init(&amp;initp-&amp;gt;ks_msoblst[i], koblsz);</span></span>
<span class="line"><span>        koblsz += 32;//这里并不是按照开始的图形分类的而是每次增加32字节，所以是32，64,96,128,160,192,224，256，.......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化kmsob</span></span>
<span class="line"><span>void init_kmsob()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmsobmgrhed_t_init(&amp;memmgrob.mo_kmsobmgr);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码注释已经很清楚了，就是init_kmsob函数调用kmsobmgrhed_t_init函数，在其中循环初始化koblst_t结构体数组，不多做解释。</p><p>但是有一点我们要搞清楚： <strong>kmsobmgrhed_t结构的实例变量是放在哪里的，它其实放在我们之前的memmgrob_t结构中了</strong>，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cosmos/include/halinc/halglobal.c</span></span>
<span class="line"><span>HAL_DEFGLOB_VARIABLE(memmgrob_t,memmgrob);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef struct s_MEMMGROB</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t mo_list;</span></span>
<span class="line"><span>    spinlock_t mo_lock;</span></span>
<span class="line"><span>    uint_t mo_stus;</span></span>
<span class="line"><span>    uint_t mo_flgs;</span></span>
<span class="line"><span>    //略去很多字段</span></span>
<span class="line"><span>    //管理kmsob_t结构的数据结构</span></span>
<span class="line"><span>    kmsobmgrhed_t mo_kmsobmgr;</span></span>
<span class="line"><span>    void* mo_privp;</span></span>
<span class="line"><span>    void* mo_extp;</span></span>
<span class="line"><span>}memmgrob_t;</span></span>
<span class="line"><span>//cosmos/hal/x86/memmgrinit.c</span></span>
<span class="line"><span>void init_memmgr()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化内存页结构</span></span>
<span class="line"><span>    init_msadsc();</span></span>
<span class="line"><span>    //初始化内存区结构</span></span>
<span class="line"><span>    init_memarea();</span></span>
<span class="line"><span>    //处理内存占用</span></span>
<span class="line"><span>    init_search_krloccupymm(&amp;kmachbsp);</span></span>
<span class="line"><span>    //合并内存页到内存区中</span></span>
<span class="line"><span>    init_memmgrob();</span></span>
<span class="line"><span>    //初始化kmsob</span></span>
<span class="line"><span>    init_kmsob();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这并没有那么难，是不是？到这里，我们在内存管理初始化init_memmgr函数中调用了init_kmsob函数，对管理内存对象容器的结构进行了初始化，这样后面我们就能分配内存对象了。</p><h2 id="分配内存对象" tabindex="-1">分配内存对象 <a class="header-anchor" href="#分配内存对象" aria-label="Permalink to &quot;分配内存对象&quot;">​</a></h2><p>根据前面的初始化过程，我们只是初始化了kmsobmgrhed_t结构，却没初始化任何kmsob_t结构，而这个结构就是存放内存对象的容器，没有它是不能进行任何分配内存对象的操作的。</p><p>下面我们一起在分配内存对象的过程中探索，应该如何查找、建立kmsob_t结构，然后在kmsob_t结构中建立freobjh_t结构，最后在内存对象容器的容量不足时，一起来扩展容器的内存。</p><h3 id="分配内存对象的接口" tabindex="-1">分配内存对象的接口 <a class="header-anchor" href="#分配内存对象的接口" aria-label="Permalink to &quot;分配内存对象的接口&quot;">​</a></h3><p>分配内存对象的流程，仍然要从分配接口开始。分配内存对象的接口很简单，只有一个内存对象大小的参数，然后返回内存对象的首地址。下面我们先在kmsob.c文件中写好这个函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//分配内存对象的核心函数</span></span>
<span class="line"><span>void *kmsob_new_core(size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取kmsobmgrhed_t结构的地址</span></span>
<span class="line"><span>    kmsobmgrhed_t *kmobmgrp = &amp;memmgrob.mo_kmsobmgr;</span></span>
<span class="line"><span>    void *retptr = NULL;</span></span>
<span class="line"><span>    koblst_t *koblp = NULL;</span></span>
<span class="line"><span>    kmsob_t *kmsp = NULL;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    //对kmsobmgrhed_t结构加锁</span></span>
<span class="line"><span>    knl_spinlock_cli(&amp;kmobmgrp-&amp;gt;ks_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    koblp = onmsz_retn_koblst(kmobmgrp, msz);</span></span>
<span class="line"><span>    if (NULL == koblp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        retptr = NULL;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kmsp = onkoblst_retn_newkmsob(koblp, msz);</span></span>
<span class="line"><span>    if (NULL == kmsp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kmsp = _create_kmsob(kmobmgrp, koblp, koblp-&amp;gt;ol_sz);</span></span>
<span class="line"><span>        if (NULL == kmsp)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            retptr = NULL;</span></span>
<span class="line"><span>            goto ret_step;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    retptr = kmsob_new_onkmsob(kmsp, msz);</span></span>
<span class="line"><span>    if (NULL == retptr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        retptr = NULL;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //更新kmsobmgrhed_t结构的信息</span></span>
<span class="line"><span>    kmsob_updata_cache(kmobmgrp, koblp, kmsp, KUC_NEWFLG);</span></span>
<span class="line"><span>ret_step:</span></span>
<span class="line"><span>    //解锁kmsobmgrhed_t结构</span></span>
<span class="line"><span>    knl_spinunlock_sti(&amp;kmobmgrp-&amp;gt;ks_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    return retptr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//内存对象分配接口</span></span>
<span class="line"><span>void *kmsob_new(size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //对于小于1 或者 大于2048字节的大小不支持 直接返回NULL表示失败</span></span>
<span class="line"><span>    if (1 &amp;gt; msz || 2048 &amp;lt; msz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用核心函数</span></span>
<span class="line"><span>    return kmsob_new_core(msz);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面代码中，内存对象分配接口很简单，只是对分配内存对象的大小进行检查，然后调用分配内存对象的核心函数，在这个核心函数中，就是围绕我们之前定义的几个数据结构，去进行一系列操作了。</p><p>但是究竟做了哪些操作呢，别急，我们继续往下看。</p><h3 id="查找内存对象容器" tabindex="-1">查找内存对象容器 <a class="header-anchor" href="#查找内存对象容器" aria-label="Permalink to &quot;查找内存对象容器&quot;">​</a></h3><p>根据前面的设计，我们已经知道内存对象是放在内存对象容器中的，所以要分配内存对象，必须要先根据要分配的内存对象大小，找到内存对象容器。</p><p>同时，我们还知道，内存对象容器数据结构kmsob_t就挂载在kmsobmgrhed_t数据结构中的ks_msoblst数组中，所以我们要遍历ks_msoblst数组，我们来写一个onmsz_retn_koblst函数，它返回ks_msoblst数组元素的指针，表示先根据内存对象的大小找到挂载kmsob_t结构对应的koblst_t结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//看看内存对象容器是不是合乎要求</span></span>
<span class="line"><span>kmsob_t *scan_newkmsob_isok(kmsob_t *kmsp, size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //只要内存对象大小小于等于内存对象容器的对象大小就行</span></span>
<span class="line"><span>    if (msz &amp;lt;= kmsp-&amp;gt;so_objsz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return kmsp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>koblst_t *onmsz_retn_koblst(kmsobmgrhed_t *kmmgrhlokp, size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //遍历ks_msoblst数组</span></span>
<span class="line"><span>    for (uint_t kli = 0; kli &amp;lt; KOBLST_MAX; kli++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //只要大小合适就返回</span></span>
<span class="line"><span>        if (kmmgrhlokp-&amp;gt;ks_msoblst[kli].ol_sz &amp;gt;= msz)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return &amp;kmmgrhlokp-&amp;gt;ks_msoblst[kli];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>kmsob_t *onkoblst_retn_newkmsob(koblst_t *koblp, size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmsob_t *kmsp = NULL, *tkmsp = NULL;</span></span>
<span class="line"><span>    list_h_t *tmplst = NULL;</span></span>
<span class="line"><span>    //先看看上次分配所用到的koblst_t是不是正好是这次需要的</span></span>
<span class="line"><span>    kmsp = scan_newkmsob_isok(koblp-&amp;gt;ol_cahe, msz);</span></span>
<span class="line"><span>    if (NULL != kmsp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return kmsp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //如果koblst_t中挂载的kmsob_t大于0</span></span>
<span class="line"><span>    if (0 &amp;lt; koblp-&amp;gt;ol_emnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //开始遍历koblst_t中挂载的kmsob_t</span></span>
<span class="line"><span>        list_for_each(tmplst, &amp;koblp-&amp;gt;ol_emplst)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            tkmsp = list_entry(tmplst, kmsob_t, so_list);</span></span>
<span class="line"><span>            //检查当前kmsob_t是否合乎要求</span></span>
<span class="line"><span>            kmsp = scan_newkmsob_isok(tkmsp, msz);</span></span>
<span class="line"><span>            if (NULL != kmsp)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return kmsp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码非常好理解，就是通过onmsz_retn_koblst函数，它根据内存对象大小查找并返回ks_msoblst数组元素的指针，这个数组元素中就挂载着相应的内存对象容器，然后由onkoblst_retn_newkmsob函数查询其中的内存对象容器并返回。</p><h3 id="建立内存对象容器" tabindex="-1">建立内存对象容器 <a class="header-anchor" href="#建立内存对象容器" aria-label="Permalink to &quot;建立内存对象容器&quot;">​</a></h3><p>不知道你发现没有，有一种情况必然会发生，那就是第一次分配内存对象时调用onkoblst_retn_newkmsob函数，它肯定会返回一个NULL。因为第一次分配时肯定没有kmsob_t结构，所以我们在这个时候建立一个kmsob_t结构，即 <strong>建立内存对象容器</strong>。</p><p>下面我们写一个_create_kmsob函数来创建kmsob_t结构，并执行一些初始化工作，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//初始化内存对象数据结构</span></span>
<span class="line"><span>void freobjh_t_init(freobjh_t *initp, uint_t stus, void *stat)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;oh_list);</span></span>
<span class="line"><span>    initp-&amp;gt;oh_stus = stus;</span></span>
<span class="line"><span>    initp-&amp;gt;oh_stat = stat;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化内存对象容器数据结构</span></span>
<span class="line"><span>void kmsob_t_init(kmsob_t *initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;so_list);</span></span>
<span class="line"><span>    knl_spinlock_init(&amp;initp-&amp;gt;so_lock);</span></span>
<span class="line"><span>    initp-&amp;gt;so_stus = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;so_flgs = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;so_vstat = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;so_vend = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;so_objsz = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;so_objrelsz = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;so_mobjnr = 0;</span></span>
<span class="line"><span>    initp-&amp;gt;so_fobjnr = 0;</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;so_frelst);</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;so_alclst);</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;so_mextlst);</span></span>
<span class="line"><span>    initp-&amp;gt;so_mextnr = 0;</span></span>
<span class="line"><span>    msomdc_t_init(&amp;initp-&amp;gt;so_mc);</span></span>
<span class="line"><span>    initp-&amp;gt;so_privp = NULL;</span></span>
<span class="line"><span>    initp-&amp;gt;so_extdp = NULL;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//把内存对象容器数据结构，挂载到对应的koblst_t结构中去</span></span>
<span class="line"><span>bool_t kmsob_add_koblst(koblst_t *koblp, kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_add(&amp;kmsp-&amp;gt;so_list, &amp;koblp-&amp;gt;ol_emplst);</span></span>
<span class="line"><span>    koblp-&amp;gt;ol_emnr++;</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化内存对象容器</span></span>
<span class="line"><span>kmsob_t *_create_init_kmsob(kmsob_t *kmsp, size_t objsz, adr_t cvadrs, adr_t cvadre, msadsc_t *msa, uint_t relpnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化kmsob结构体</span></span>
<span class="line"><span>    kmsob_t_init(kmsp);</span></span>
<span class="line"><span>    //设置内存对象容器的开始、结束地址，内存对象大小</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_vstat = cvadrs;</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_vend = cvadre;</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_objsz = objsz;</span></span>
<span class="line"><span>    //把物理内存页面对应的msadsc_t结构加入到kmsob_t中的so_mc.mc_kmobinlst链表上</span></span>
<span class="line"><span>    list_add(&amp;msa-&amp;gt;md_list, &amp;kmsp-&amp;gt;so_mc.mc_kmobinlst);</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_mc.mc_kmobinpnr = (uint_t)relpnr;</span></span>
<span class="line"><span>    //设置内存对象的开始地址为kmsob_t结构之后，结束地址为内存对象容器的结束地址</span></span>
<span class="line"><span>    freobjh_t *fohstat = (freobjh_t *)(kmsp + 1), *fohend = (freobjh_t *)cvadre;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint_t ap = (uint_t)((uint_t)fohstat);</span></span>
<span class="line"><span>    freobjh_t *tmpfoh = (freobjh_t *)((uint_t)ap);</span></span>
<span class="line"><span>    for (; tmpfoh &amp;lt; fohend;)</span></span>
<span class="line"><span>    {//相当在kmsob_t结构体之后建立一个freobjh_t结构体数组</span></span>
<span class="line"><span>        if ((ap + (uint_t)kmsp-&amp;gt;so_objsz) &amp;lt;= (uint_t)cvadre)</span></span>
<span class="line"><span>        {//初始化每个freobjh_t结构体</span></span>
<span class="line"><span>            freobjh_t_init(tmpfoh, 0, (void *)tmpfoh);</span></span>
<span class="line"><span>            //把每个freobjh_t结构体加入到kmsob_t结构体中的so_frelst中</span></span>
<span class="line"><span>           list_add(&amp;tmpfoh-&amp;gt;oh_list, &amp;kmsp-&amp;gt;so_frelst);</span></span>
<span class="line"><span>            kmsp-&amp;gt;so_mobjnr++;</span></span>
<span class="line"><span>            kmsp-&amp;gt;so_fobjnr++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ap += (uint_t)kmsp-&amp;gt;so_objsz;</span></span>
<span class="line"><span>        tmpfoh = (freobjh_t *)((uint_t)ap);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return kmsp;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//建立一个内存对象容器</span></span>
<span class="line"><span>kmsob_t *_create_kmsob(kmsobmgrhed_t *kmmgrlokp, koblst_t *koblp, size_t objsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmsob_t *kmsp = NULL;</span></span>
<span class="line"><span>    msadsc_t *msa = NULL;</span></span>
<span class="line"><span>    uint_t relpnr = 0;</span></span>
<span class="line"><span>    uint_t pages = 1;</span></span>
<span class="line"><span>    if (128 &amp;lt; objsz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        pages = 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (512 &amp;lt; objsz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        pages = 4;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //为内存对象容器分配物理内存空间，这是我们之前实现的物理内存页面管理器</span></span>
<span class="line"><span>    msa = mm_division_pages(&amp;memmgrob, pages, &amp;relpnr, MA_TYPE_KRNL, DMF_RELDIV);</span></span>
<span class="line"><span>    if (NULL == msa)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    u64_t phyadr = msa-&amp;gt;md_phyadrs.paf_padrs &amp;lt;&amp;lt; PSHRSIZE;</span></span>
<span class="line"><span>    u64_t phyade = phyadr + (relpnr &amp;lt;&amp;lt; PSHRSIZE) - 1;</span></span>
<span class="line"><span>    //计算它们的虚拟地址</span></span>
<span class="line"><span>    adr_t vadrs = phyadr_to_viradr((adr_t)phyadr);</span></span>
<span class="line"><span>    adr_t vadre = phyadr_to_viradr((adr_t)phyade);</span></span>
<span class="line"><span>    //初始化kmsob_t并建立内存对象</span></span>
<span class="line"><span>    kmsp = _create_init_kmsob((kmsob_t *)vadrs, koblp-&amp;gt;ol_sz, vadrs, vadre, msa, relpnr);</span></span>
<span class="line"><span>    //把kmsob_t结构，挂载到对应的koblst_t结构中去</span></span>
<span class="line"><span>    if (kmsob_add_koblst(koblp, kmsp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        system_error(&quot; _create_kmsob kmsob_add_koblst FALSE\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //增加计数</span></span>
<span class="line"><span>    kmmgrlokp-&amp;gt;ks_msobnr++;</span></span>
<span class="line"><span>    return kmsp;</span></span></code></pre></div><p>_create_kmsob函数就是根据分配内存对象大小，建立一个内存对象容器。</p><p>首先，这个函数会找物理内存页面管理器申请一块连续内存页面。然后，在其中的开始部分建立kmsob_t结构的实例变量，又在kmsob_t结构的后面建立freobjh_t结构数组，并把每个freobjh_t结构挂载到kmsob_t结构体中的so_frelst中。最后再把kmsob_t结构，挂载到kmsobmgrhed_t结构对应的koblst_t结构中去。</p><p>上面的注释已经很清楚了，我相信你看得懂。</p><h3 id="扩容内存对象容器" tabindex="-1">扩容内存对象容器 <a class="header-anchor" href="#扩容内存对象容器" aria-label="Permalink to &quot;扩容内存对象容器&quot;">​</a></h3><p>如果我们不断重复分配同一大小的内存对象，那么那个内存对象容器中的内存对象，迟早要分配完的。一旦内存对象分配完，内存对象容器就没有空闲的内存空间产生内存对象了。这时，我们就要为内存对象容器扩展内存空间了。</p><p>下面我们来写代码实现，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//初始化kmbext_t结构</span></span>
<span class="line"><span>void kmbext_t_init(kmbext_t *initp, adr_t vstat, adr_t vend, kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_init(&amp;initp-&amp;gt;mt_list);</span></span>
<span class="line"><span>    initp-&amp;gt;mt_vstat = vstat;</span></span>
<span class="line"><span>    initp-&amp;gt;mt_vend = vend;</span></span>
<span class="line"><span>    initp-&amp;gt;mt_kmsb = kmsp;</span></span>
<span class="line"><span>    initp-&amp;gt;mt_mobjnr = 0;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//扩展内存页面</span></span>
<span class="line"><span>bool_t kmsob_extn_pages(kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    msadsc_t *msa = NULL;</span></span>
<span class="line"><span>    uint_t relpnr = 0;</span></span>
<span class="line"><span>    uint_t pages = 1;</span></span>
<span class="line"><span>    if (128 &amp;lt; kmsp-&amp;gt;so_objsz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        pages = 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (512 &amp;lt; kmsp-&amp;gt;so_objsz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        pages = 4;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //找物理内存页面管理器分配2或者4个连续的页面</span></span>
<span class="line"><span>    msa = mm_division_pages(&amp;memmgrob, pages, &amp;relpnr, MA_TYPE_KRNL, DMF_RELDIV);</span></span>
<span class="line"><span>    if (NULL == msa)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    u64_t phyadr = msa-&amp;gt;md_phyadrs.paf_padrs &amp;lt;&amp;lt; PSHRSIZE;</span></span>
<span class="line"><span>    u64_t phyade = phyadr + (relpnr &amp;lt;&amp;lt; PSHRSIZE) - 1;</span></span>
<span class="line"><span>    adr_t vadrs = phyadr_to_viradr((adr_t)phyadr);</span></span>
<span class="line"><span>    adr_t vadre = phyadr_to_viradr((adr_t)phyade);</span></span>
<span class="line"><span>    //求出物理内存页面数对应在kmsob_t的so_mc.mc_lst数组中下标</span></span>
<span class="line"><span>    sint_t mscidx = retn_mscidx(relpnr);</span></span>
<span class="line"><span>    //把物理内存页面对应的msadsc_t结构加入到kmsob_t的so_mc.mc_lst数组中</span></span>
<span class="line"><span>    list_add(&amp;msa-&amp;gt;md_list, &amp;kmsp-&amp;gt;so_mc.mc_lst[mscidx].ml_list);</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_mc.mc_lst[mscidx].ml_msanr++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    kmbext_t *bextp = (kmbext_t *)vadrs;</span></span>
<span class="line"><span>    //初始化kmbext_t数据结构</span></span>
<span class="line"><span>    kmbext_t_init(bextp, vadrs, vadre, kmsp);</span></span>
<span class="line"><span>//设置内存对象的开始地址为kmbext_t结构之后，结束地址为扩展内存页面的结束地址</span></span>
<span class="line"><span>    freobjh_t *fohstat = (freobjh_t *)(bextp + 1), *fohend = (freobjh_t *)vadre;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint_t ap = (uint_t)((uint_t)fohstat);</span></span>
<span class="line"><span>    freobjh_t *tmpfoh = (freobjh_t *)((uint_t)ap);</span></span>
<span class="line"><span>    for (; tmpfoh &amp;lt; fohend;)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if ((ap + (uint_t)kmsp-&amp;gt;so_objsz) &amp;lt;= (uint_t)vadre)</span></span>
<span class="line"><span>        {//在扩展的内存空间中建立内存对象</span></span>
<span class="line"><span>            freobjh_t_init(tmpfoh, 0, (void *)tmpfoh);</span></span>
<span class="line"><span>            list_add(&amp;tmpfoh-&amp;gt;oh_list, &amp;kmsp-&amp;gt;so_frelst);</span></span>
<span class="line"><span>            kmsp-&amp;gt;so_mobjnr++;</span></span>
<span class="line"><span>            kmsp-&amp;gt;so_fobjnr++;</span></span>
<span class="line"><span>            bextp-&amp;gt;mt_mobjnr++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ap += (uint_t)kmsp-&amp;gt;so_objsz;</span></span>
<span class="line"><span>        tmpfoh = (freobjh_t *)((uint_t)ap);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    list_add(&amp;bextp-&amp;gt;mt_list, &amp;kmsp-&amp;gt;so_mextlst);</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_mextnr++;</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>有了前面建立内存对象容器的经验，加上这里的注释，我们理解上述代码并不难：不过是分配了另一块连续的内存空间，作为空闲的内存对象，并且把这块内存空间加内存对象容器中统一管理。</p><h3 id="分配内存对象-1" tabindex="-1">分配内存对象 <a class="header-anchor" href="#分配内存对象-1" aria-label="Permalink to &quot;分配内存对象&quot;">​</a></h3><p>有了内存对象容器，就可以分配内存对象了。由于我们前面精心设计了内存对象容器、内存对象等数据结构，这使得我们的内存对象分配代码时极其简单，而且性能极高。</p><p>下面我们来实现它吧！代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//判断内存对象容器中有没有内存对象</span></span>
<span class="line"><span>uint_t scan_kmob_objnr(kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (0 &amp;lt; kmsp-&amp;gt;so_fobjnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return kmsp-&amp;gt;so_fobjnr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//实际分配内存对象</span></span>
<span class="line"><span>void *kmsob_new_opkmsob(kmsob_t *kmsp, size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //获取kmsob_t中的so_frelst链表头的第一个空闲内存对象</span></span>
<span class="line"><span>    freobjh_t *fobh = list_entry(kmsp-&amp;gt;so_frelst.next, freobjh_t, oh_list);</span></span>
<span class="line"><span>    //从链表中脱链</span></span>
<span class="line"><span>    list_del(&amp;fobh-&amp;gt;oh_list);</span></span>
<span class="line"><span>    //kmsob_t中的空闲对象计数减一</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_fobjnr--;</span></span>
<span class="line"><span>    //返回内存对象首地址</span></span>
<span class="line"><span>    return (void *)(fobh);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void *kmsob_new_onkmsob(kmsob_t *kmsp, size_t msz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void *retptr = NULL;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    knl_spinlock_cli(&amp;kmsp-&amp;gt;so_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    //如果内存对象容器中没有空闲的内存对象了就需要扩展内存对象容器的内存了</span></span>
<span class="line"><span>    if (scan_kmsob_objnr(kmsp) &amp;lt; 1)</span></span>
<span class="line"><span>    {//扩展内存对象容器的内存</span></span>
<span class="line"><span>        if (kmsob_extn_pages(kmsp) == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            retptr = NULL;</span></span>
<span class="line"><span>            goto ret_step;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //实际分配内存对象</span></span>
<span class="line"><span>    retptr = kmsob_new_opkmsob(kmsp, msz);</span></span>
<span class="line"><span>ret_step:</span></span>
<span class="line"><span>    knl_spinunlock_sti(&amp;kmsp-&amp;gt;so_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    return retptr;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>分配内存对象的核心操作就是， <strong>kmsob_new_opkmsob函数从空闲内存对象链表头中取出第一个内存对象，返回它的首地址</strong>。这个算法非常高效，无论内存对象容器中的内存对象有多少，kmsob_new_opkmsob函数的操作始终是固定的，而如此高效的算法得益于我们先进的数据结构设计。</p><p>好了，到这里内存对象的分配就已经完成了，下面我们去实现内存对象的释放。</p><h2 id="释放内存对象" tabindex="-1">释放内存对象 <a class="header-anchor" href="#释放内存对象" aria-label="Permalink to &quot;释放内存对象&quot;">​</a></h2><p>释放内存对象，就是要把内存对象还给它所归属的内存对象容器。其逻辑就是根据释放内存对象的地址和大小，找到对应的内存对象容器，然后把该内存对象加入到对应内存对象容器的空闲链表上，最后看一看要不要释放内存对象容器占用的物理内存页面。</p><h3 id="释放内存对象的接口" tabindex="-1">释放内存对象的接口 <a class="header-anchor" href="#释放内存对象的接口" aria-label="Permalink to &quot;释放内存对象的接口&quot;">​</a></h3><p>这里我们依然要从释放内存对象的接口开始实现，下面我们在kmsob.c文中写下这个函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool_t kmsob_delete_core(void *fadrs, size_t fsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    kmsobmgrhed_t *kmobmgrp = &amp;memmgrob.mo_kmsobmgr;</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    koblst_t *koblp = NULL;</span></span>
<span class="line"><span>    kmsob_t *kmsp = NULL;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    knl_spinlock_cli(&amp;kmobmgrp-&amp;gt;ks_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    //根据释放内存对象的大小在kmsobmgrhed_t中查找并返回koblst_t，在其中挂载着对应的kmsob_t，这个在前面已经写好了</span></span>
<span class="line"><span>    koblp = onmsz_retn_koblst(kmobmgrp, fsz);</span></span>
<span class="line"><span>    if (NULL == koblp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kmsp = onkoblst_retn_delkmsob(koblp, fadrs, fsz);</span></span>
<span class="line"><span>    if (NULL == kmsp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = kmsob_delete_onkmsob(kmsp, fadrs, fsz);</span></span>
<span class="line"><span>    if (FALSE == rets)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (_destroy_kmsob(kmobmgrp, koblp, kmsp) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = TRUE;</span></span>
<span class="line"><span>ret_step:</span></span>
<span class="line"><span>    knl_spinunlock_sti(&amp;kmobmgrp-&amp;gt;ks_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放内存对象接口</span></span>
<span class="line"><span>bool_t kmsob_delete(void *fadrs, size_t fsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //对参数进行检查，但是多了对内存对象地址的检查</span></span>
<span class="line"><span>    if (NULL == fadrs || 1 &amp;gt; fsz || 2048 &amp;lt; fsz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //调用释放内存对象的核心函数</span></span>
<span class="line"><span>    return kmsob_delete_core(fadrs, fsz);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，等到kmsob_delete函数检查参数通过之后，就调用释放内存对象的核心函数kmsob_delete_core，在这个函数中，一开始根据释放内存对象大小，找到挂载其kmsob_t结构的koblst_t结构，接着又做了一系列的操作，这些操作正是我们接下来要实现的。</p><h3 id="查找内存对象容器-1" tabindex="-1">查找内存对象容器 <a class="header-anchor" href="#查找内存对象容器-1" aria-label="Permalink to &quot;查找内存对象容器&quot;">​</a></h3><p>释放内存对象，首先要找到这个将要释放的内存对象所属的内存对象容器。释放时的查找和分配时的查找不一样，因为要检查 <strong>释放的内存对象是不是属于该内存对象容器。</strong></p><p>下面我们一起来实现这个函数，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//检查释放的内存对象是不是在kmsob_t结构中</span></span>
<span class="line"><span>kmsob_t *scan_delkmsob_isok(kmsob_t *kmsp, void *fadrs, size_t fsz)</span></span>
<span class="line"><span>{//检查释放内存对象的地址是否落在kmsob_t结构的地址区间</span></span>
<span class="line"><span>    if ((adr_t)fadrs &amp;gt;= (kmsp-&amp;gt;so_vstat + sizeof(kmsob_t)) &amp;&amp; ((adr_t)fadrs + (adr_t)fsz) &amp;lt;= kmsp-&amp;gt;so_vend)</span></span>
<span class="line"><span>    {    //检查释放内存对象的大小是否小于等于kmsob_t内存对象容器的对象大小</span></span>
<span class="line"><span>        if (fsz &amp;lt;= kmsp-&amp;gt;so_objsz)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return kmsp;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (1 &amp;gt; kmsp-&amp;gt;so_mextnr)</span></span>
<span class="line"><span>    {//如果kmsob_t结构没有扩展空间，直接返回</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kmbext_t *bexp = NULL;</span></span>
<span class="line"><span>    list_h_t *tmplst = NULL;</span></span>
<span class="line"><span>    //遍历kmsob_t结构中的每个扩展空间</span></span>
<span class="line"><span>    list_for_each(tmplst, &amp;kmsp-&amp;gt;so_mextlst)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        bexp = list_entry(tmplst, kmbext_t, mt_list);</span></span>
<span class="line"><span>        //检查释放内存对象的地址是否落在扩展空间的地址区间</span></span>
<span class="line"><span>        if ((adr_t)fadrs &amp;gt;= (bexp-&amp;gt;mt_vstat + sizeof(kmbext_t)) &amp;&amp; ((adr_t)fadrs + (adr_t)fsz) &amp;lt;= bexp-&amp;gt;mt_vend)</span></span>
<span class="line"><span>        {//同样的要检查大小</span></span>
<span class="line"><span>            if (fsz &amp;lt;= kmsp-&amp;gt;so_objsz)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return kmsp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//查找释放内存对象所属的kmsob_t结构</span></span>
<span class="line"><span>kmsob_t *onkoblst_retn_delkmsob(koblst_t *koblp, void *fadrs, size_t fsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    v *kmsp = NULL, *tkmsp = NULL;</span></span>
<span class="line"><span>    list_h_t *tmplst = NULL;</span></span>
<span class="line"><span>    //看看上次刚刚操作的kmsob_t结构</span></span>
<span class="line"><span>    kmsp = scan_delkmsob_isok(koblp-&amp;gt;ol_cahe, fadrs, fsz);</span></span>
<span class="line"><span>    if (NULL != kmsp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return kmsp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (0 &amp;lt; koblp-&amp;gt;ol_emnr)</span></span>
<span class="line"><span>    {    //遍历挂载koblp-&amp;gt;ol_emplst链表上的每个kmsob_t结构</span></span>
<span class="line"><span>        list_for_each(tmplst, &amp;koblp-&amp;gt;ol_emplst)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            tkmsp = list_entry(tmplst, kmsob_t, so_list);</span></span>
<span class="line"><span>            //检查释放的内存对象是不是属于这个kmsob_t结构</span></span>
<span class="line"><span>            kmsp = scan_delkmsob_isok(tkmsp, fadrs, fsz);</span></span>
<span class="line"><span>            if (NULL != kmsp)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                return kmsp;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码注释已经很明白了，搜索对应koblst_t结构中的每个kmsob_t结构体，随后进行检查，检查了kmsob_t结构的自身内存区域和扩展内存区域。即比较释放内存对象的地址是不是落在它们的内存区间中，其大小是否合乎要求。</p><h3 id="释放内存对象-1" tabindex="-1">释放内存对象 <a class="header-anchor" href="#释放内存对象-1" aria-label="Permalink to &quot;释放内存对象&quot;">​</a></h3><p>如果不出意外，会找到释放内存对象的kmsob_t结构，这样就可以释放内存对象了，就是把这块内存空间还给内存对象容器，这个过程的具体代码实现如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool_t kmsob_del_opkmsob(kmsob_t *kmsp, void *fadrs, size_t fsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if ((kmsp-&amp;gt;so_fobjnr + 1) &amp;gt; kmsp-&amp;gt;so_mobjnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return FALSE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //让freobjh_t结构重新指向要释放的内存空间</span></span>
<span class="line"><span>    freobjh_t *obhp = (freobjh_t *)fadrs;</span></span>
<span class="line"><span>    //重新初始化块内存空间</span></span>
<span class="line"><span>    freobjh_t_init(obhp, 0, obhp);</span></span>
<span class="line"><span>    //加入kmsob_t结构的空闲链表</span></span>
<span class="line"><span>    list_add(&amp;obhp-&amp;gt;oh_list, &amp;kmsp-&amp;gt;so_frelst);</span></span>
<span class="line"><span>    //kmsob_t结构的空闲对象计数加一</span></span>
<span class="line"><span>    kmsp-&amp;gt;so_fobjnr++;</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//释放内存对象</span></span>
<span class="line"><span>bool_t kmsob_delete_onkmsob(kmsob_t *kmsp, void *fadrs, size_t fsz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bool_t rets = FALSE;</span></span>
<span class="line"><span>    cpuflg_t cpuflg;</span></span>
<span class="line"><span>    //对kmsob_t结构加锁</span></span>
<span class="line"><span>    knl_spinlock_cli(&amp;kmsp-&amp;gt;so_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    //实际完成内存对象释放</span></span>
<span class="line"><span>    if (kmsob_del_opkmsob(kmsp, fadrs, fsz) == FALSE)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        rets = FALSE;</span></span>
<span class="line"><span>        goto ret_step;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rets = TRUE;</span></span>
<span class="line"><span>ret_step:</span></span>
<span class="line"><span>    //对kmsob_t结构解锁</span></span>
<span class="line"><span>    knl_spinunlock_sti(&amp;kmsp-&amp;gt;so_lock, &amp;cpuflg);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合上述代码和注释，我们现在明白了kmsob_delete_onkmsob函数调用kmsob_del_opkmsob函数。其核心机制就是 <strong>把要释放内存对象的空间，重新初始化，变成一个freobjh_t结构的实例变量，最后把这个freobjh_t结构加入到kmsob_t结构中空闲链表中</strong>，这就实现了内存对象的释放。</p><h3 id="销毁内存对象容器" tabindex="-1">销毁内存对象容器 <a class="header-anchor" href="#销毁内存对象容器" aria-label="Permalink to &quot;销毁内存对象容器&quot;">​</a></h3><p>如果我们释放了所有的内存对象，就会出现空的内存对象容器。如果下一次请求同样大小的内存对象，那么这个空的内存对象容器还能继续复用，提高性能。</p><p>但是你有没有想到，频繁请求的是不同大小的内存对象，那么空的内存对象容器会越来越多，这会占用大量内存，所以我们必须要把空的内存对象容器销毁。</p><p>下面我们写代码实现销毁内存对象容器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint_t scan_freekmsob_isok(kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //当内存对象容器的总对象个数等于空闲对象个数时，说明这内存对象容器空闲</span></span>
<span class="line"><span>    if (kmsp-&amp;gt;so_mobjnr == kmsp-&amp;gt;so_fobjnr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool_t _destroy_kmsob_core(kmsobmgrhed_t *kmobmgrp, koblst_t *koblp, kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    list_h_t *tmplst = NULL;</span></span>
<span class="line"><span>    msadsc_t *msa = NULL;</span></span>
<span class="line"><span>    msclst_t *mscp = kmsp-&amp;gt;so_mc.mc_lst;</span></span>
<span class="line"><span>    list_del(&amp;kmsp-&amp;gt;so_list);</span></span>
<span class="line"><span>    koblp-&amp;gt;ol_emnr--;</span></span>
<span class="line"><span>    kmobmgrp-&amp;gt;ks_msobnr--;</span></span>
<span class="line"><span>    //释放内存对象容器扩展空间的物理内存页面</span></span>
<span class="line"><span>    //遍历kmsob_t结构中的so_mc.mc_lst数组</span></span>
<span class="line"><span>    for (uint_t j = 0; j &amp;lt; MSCLST_MAX; j++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (0 &amp;lt; mscp[j].ml_msanr)</span></span>
<span class="line"><span>        {//遍历每个so_mc.mc_lst数组中的msadsc_t结构</span></span>
<span class="line"><span>            list_for_each_head_dell(tmplst, &amp;mscp[j].ml_list)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                msa = list_entry(tmplst, msadsc_t, md_list);</span></span>
<span class="line"><span>                list_del(&amp;msa-&amp;gt;md_list);</span></span>
<span class="line"><span>                //msadsc_t脱链</span></span>
<span class="line"><span>                //释放msadsc_t对应的物理内存页面</span></span>
<span class="line"><span>                if (mm_merge_pages(&amp;memmgrob, msa, (uint_t)mscp[j].ml_ompnr) == FALSE)</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    system_error(&quot;_destroy_kmsob_core mm_merge_pages FALSE2\\n&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //释放内存对象容器本身占用的物理内存页面</span></span>
<span class="line"><span>    //遍历每个so_mc.mc_kmobinlst中的msadsc_t结构。它只会遍历一次</span></span>
<span class="line"><span>    list_for_each_head_dell(tmplst, &amp;kmsp-&amp;gt;so_mc.mc_kmobinlst)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        msa = list_entry(tmplst, msadsc_t, md_list);</span></span>
<span class="line"><span>        list_del(&amp;msa-&amp;gt;md_list);</span></span>
<span class="line"><span>        //msadsc_t脱链</span></span>
<span class="line"><span>        //释放msadsc_t对应的物理内存页面</span></span>
<span class="line"><span>        if (mm_merge_pages(&amp;memmgrob, msa, (uint_t)kmsp-&amp;gt;so_mc.mc_kmobinpnr) == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            system_error(&quot;_destroy_kmsob_core mm_merge_pages FALSE2\\n&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return TRUE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//</span></span>
<span class="line"><span>\`\`\`销毁内存对象容器</span></span>
<span class="line"><span>bool_t _destroy_kmsob(kmsobmgrhed_t *kmobmgrp, koblst_t *koblp, kmsob_t *kmsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //看看能不能销毁</span></span>
<span class="line"><span>    uint_t screts = scan_freekmsob_isok(kmsp);</span></span>
<span class="line"><span>    if (2 == screts)</span></span>
<span class="line"><span>    {//调用销毁内存对象容器的核心函数</span></span>
<span class="line"><span>        return _destroy_kmsob_core(kmobmgrp, koblp, kmsp);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return FALSE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，首先会检查一下内存对象容器是不是空闲的，如果空闲，就调用 <strong>销毁内存对象容器的核心函数_destroy_kmsob_core</strong>。在_destroy_kmsob_core函数中，首先要释放内存对象容器的扩展空间所占用的物理内存页面，最后才可以释放内存对象容器自身占用物理内存页面。</p><p>请注意， <strong>这个顺序不能前后颠倒</strong>，这是因为扩展空间的物理内存页面对应的msadsc_t结构，它就挂载在kmsob_t结构的so_mc.mc_lst数组中。</p><p>好了，到这里我们内存对象释放的流程就完成了，这意味着我们整个内存对象管理也告一段落了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天我们从malloc函数入手，思考内核要怎样分配大量小块内存。我们把物理内存页面进一步细分成内存对象，为了表示和管理内存对象，又设计了内存对象、内存对象容器等一系列数据结构，随后写代码把它们初始化，最后我们依赖这些数据结构实现了内存对象管理算法。</p><p>下面我们来回顾一下这节课的重点。</p><p>1.我们发现，在应用程序中可以使用malloc函数动态分配一些小块内存，其实这样的场景在内核中也是比比皆是。比如，内核经常要动态创建数据结构的实例变量，就需要分配小块的内存空间。</p><p>2.为了实现内存对象的表示、分配和释放功能，我们定义了内存对象和内存对象容器的数据结构freobjh_t、kmsob_t，并为了管理kmsob_t结构又定义了kmsobmgrhed_t结构。</p><p>3.我们写好了初始化kmsobmgrhed_t结构的函数，并在init_kmsob中调用了它，进而又被init_memmgr函数调用，由于kmsobmgrhed_t结构是为了管理kmsob_t结构的所以在一开始就要被初始化。</p><p>4.我们基于这些数据结构实现了内存对象的分配和释放。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>为什么我们在分配内存对象大小时要按照Cache行大小的倍数分配呢？</p><p>欢迎你在留言区分享你的思考或疑问。如果这节课对你有帮助，也欢迎你分享给自己的同事、朋友，跟他一起交流讨论。</p><p>好，我是LMOS，我们下节课见！</p>`,104)])])}const b=n(e,[["render",t]]);export{k as __pageData,b as default};
