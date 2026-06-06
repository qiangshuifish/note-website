import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"23 | 瞧一瞧Linux：SLAB如何分配内存？","description":"","frontmatter":{},"headers":[{"level":2,"title":"SLAB","slug":"slab","link":"#slab","children":[{"level":3,"title":"走进SLAB对象","slug":"走进slab对象","link":"#走进slab对象","children":[]},{"level":3,"title":"第一个kmem_cache","slug":"第一个kmem-cache","link":"#第一个kmem-cache","children":[]},{"level":3,"title":"管理kmem_cache","slug":"管理kmem-cache","link":"#管理kmem-cache","children":[]}]},{"level":2,"title":"SLAB分配对象的过程","slug":"slab分配对象的过程","link":"#slab分配对象的过程","children":[{"level":3,"title":"SLAB分配接口","slug":"slab分配接口","link":"#slab分配接口","children":[]},{"level":3,"title":"如何查找kmem_cache结构","slug":"如何查找kmem-cache结构","link":"#如何查找kmem-cache结构","children":[]},{"level":3,"title":"分配对象","slug":"分配对象","link":"#分配对象","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/23-瞧一瞧Linux：SLAB如何分配内存？.md","filePath":"操作系统实战45讲/23-瞧一瞧Linux：SLAB如何分配内存？.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/23-瞧一瞧Linux：SLAB如何分配内存？.md"};function c(i,a,t,_,m,o){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_23-瞧一瞧linux-slab如何分配内存" tabindex="-1">23 | 瞧一瞧Linux：SLAB如何分配内存？ <a class="header-anchor" href="#_23-瞧一瞧linux-slab如何分配内存" aria-label="Permalink to &quot;23 | 瞧一瞧Linux：SLAB如何分配内存？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课我们学习了伙伴系统，了解了它是怎样管理物理内存页面的。那么你自然会想到这个问题：Linux系统中，比页更小的内存对象要怎样分配呢？</p><p>带着这个问题，我们来一起看看 <strong>SLAB分配器的原理和实现。</strong> 在学习过程中，你也可以对照一下我们Cosmos的内存管理组件，看看两者的内存管理有哪些异同。</p><h2 id="slab" tabindex="-1">SLAB <a class="header-anchor" href="#slab" aria-label="Permalink to &quot;SLAB&quot;">​</a></h2><p>与Cosmos物理内存页面管理器一样，Linux中的伙伴系统是以页面为最小单位分配的，现实更多要以内核对象为单位分配内存，其实更具体一点说，就是根据内核对象的实例变量大小来申请和释放内存空间，这些数据结构实例变量的大小通常从几十字节到几百字节不等，远远小于一个页面的大小。</p><p>如果一个几十字节大小的数据结构实例变量，就要为此分配一个页面，这无疑是对宝贵物理内存的一种巨大浪费，因此一个更好的技术方案应运而生，就是 <strong>Slab分配器</strong>（由Sun公司的雇员Jeff Bonwick在Solaris 2.4中设计并实现）。</p><p>由于作者公开了实现方法，后来被Linux所借鉴，用于实现内核中更小粒度的内存分配。看看吧，你以为Linux很强大，真的强大吗？不过是站在巨人的肩膀上飞翔的。</p><h3 id="走进slab对象" tabindex="-1">走进SLAB对象 <a class="header-anchor" href="#走进slab对象" aria-label="Permalink to &quot;走进SLAB对象&quot;">​</a></h3><p>何为SLAB对象？在SLAB分配器中，它把一个内存页面或者一组连续的内存页面，划分成大小相同的块，其中这一个小的内存块就是SLAB对象，但是这一组连续的内存页面中不只是SLAB对象，还有SLAB管理头和着色区。</p><p>我画个图你就明白了，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/1b210fe094e7eba4b19ef118f76e6322.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/1b210fe094e7eba4b19ef118f76e6322.jpg" alt=""></a></p><p>上图中有一个内存页面和两个内存页面的SLAB，你可能对着色区有点陌生，我来给你讲解一下。</p><p>这个着色区也是一块动态的内存块，建立SLAB时才会设置它的大小，目的是为了错开不同SLAB中的对象地址，降低硬件Cache行中的地址争用，以免导致Cache抖动效应，整个系统性能下降。</p><p>SLAB头其实是一个数据结构，但是它不一定放在保存对象内存页面的开始。通常会有一个保存SLAB管理头的SLAB，在Linux中，SLAB管理头用kmem_cache结构来表示，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct array_cache {</span></span>
<span class="line"><span>    unsigned int avail;</span></span>
<span class="line"><span>    unsigned int limit;</span></span>
<span class="line"><span>    void *entry[];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct kmem_cache {</span></span>
<span class="line"><span>    //是每个CPU一个array_cache类型的变量，cpu_cache是用于管理空闲对象的</span></span>
<span class="line"><span>    struct array_cache __percpu *cpu_cache;</span></span>
<span class="line"><span>    unsigned int size; //cache大小</span></span>
<span class="line"><span>    slab_flags_t flags;//slab标志</span></span>
<span class="line"><span>    unsigned int num;//对象个数</span></span>
<span class="line"><span>    unsigned int gfporder;//分配内存页面的order</span></span>
<span class="line"><span>    gfp_t allocflags;</span></span>
<span class="line"><span>    size_t colour;//着色区大小</span></span>
<span class="line"><span>    unsigned int colour_off;//着色区的开始偏移</span></span>
<span class="line"><span>    const char *name;//本SLAB的名字</span></span>
<span class="line"><span>    struct list_head list;//所有的SLAB都要链接起来</span></span>
<span class="line"><span>    int refcount;//引用计数</span></span>
<span class="line"><span>    int object_size;//对象大小</span></span>
<span class="line"><span>    int align;//对齐大小</span></span>
<span class="line"><span>    struct kmem_cache_node *node[MAX_NUMNODES];//指向管理kmemcache的上层结构</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>上述代码中，有多少个CPU，就会有多少个array_cache类型的变量。这种为每个CPU构造一个变量副本的同步机制，就是 <strong>每CPU变量</strong>（per-cpu-variable）。array_cache结构中&quot;entry[]&quot;表示了一个遵循LIFO顺序的数组，&quot;avail&quot;和&quot;limit&quot;分别指定了当前可用对象的数目和允许容纳对象的最大数目。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/8392800e70d37795c902b0d5dfebe5b6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/8392800e70d37795c902b0d5dfebe5b6.jpg" alt=""></a></p><h3 id="第一个kmem-cache" tabindex="-1">第一个kmem_cache <a class="header-anchor" href="#第一个kmem-cache" aria-label="Permalink to &quot;第一个kmem\\_cache&quot;">​</a></h3><p>第一个kmem_cache是哪里来的呢？其实它是静态定义在代码中的，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct kmem_cache kmem_cache_boot = {</span></span>
<span class="line"><span>    .batchcount = 1,</span></span>
<span class="line"><span>    .limit = BOOT_CPUCACHE_ENTRIES,</span></span>
<span class="line"><span>    .shared = 1,</span></span>
<span class="line"><span>    .size = sizeof(struct kmem_cache),</span></span>
<span class="line"><span>    .name = &quot;kmem_cache&quot;,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void __init kmem_cache_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    //指向静态定义的kmem_cache_boot</span></span>
<span class="line"><span>    kmem_cache = &amp;kmem_cache_boot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; NUM_INIT_LISTS; i++)</span></span>
<span class="line"><span>        kmem_cache_node_init(&amp;init_kmem_cache_node[i]);</span></span>
<span class="line"><span>    //建立保存kmem_cache结构的kmem_cache</span></span>
<span class="line"><span>    create_boot_cache(kmem_cache, &quot;kmem_cache&quot;,</span></span>
<span class="line"><span>        offsetof(struct kmem_cache, node) +</span></span>
<span class="line"><span>                  nr_node_ids * sizeof(struct kmem_cache_node *),</span></span>
<span class="line"><span>                  SLAB_HWCACHE_ALIGN, 0, 0);</span></span>
<span class="line"><span>    //加入全局slab_caches链表中</span></span>
<span class="line"><span>    list_add(&amp;kmem_cache-&amp;gt;list, &amp;slab_caches);</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        int nid;</span></span>
<span class="line"><span>        for_each_online_node(nid) {</span></span>
<span class="line"><span>            init_list(kmem_cache, &amp;init_kmem_cache_node[CACHE_CACHE + nid], nid);</span></span>
<span class="line"><span>            init_list(kmalloc_caches[KMALLOC_NORMAL][INDEX_NODE],                      &amp;init_kmem_cache_node[SIZE_NODE + nid], nid);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //建立kmalloc函数使用的的kmem_cache</span></span>
<span class="line"><span>    create_kmalloc_caches(ARCH_KMALLOC_FLAGS);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="管理kmem-cache" tabindex="-1">管理kmem_cache <a class="header-anchor" href="#管理kmem-cache" aria-label="Permalink to &quot;管理kmem\\_cache&quot;">​</a></h3><p>我们建好了第一个kmem_cache，以后kmem_cache越来越多，而且我们并没有看到kmem_cache结构中有任何指向内存页面的字段，但在kmem_cache结构中有个保存kmem_cache_node结构的指针数组。</p><p>kmem_cache_node结构是每个内存节点对应一个，它就是用来管理kmem_cache结构的，它开始是静态定义的，初始化时建立了第一个kmem_cache结构之后，init_list函数负责一个个分配内存空间，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define NUM_INIT_LISTS (2 * MAX_NUMNODES)</span></span>
<span class="line"><span>//定义的kmem_cache_node结构数组</span></span>
<span class="line"><span>static struct kmem_cache_node __initdata init_kmem_cache_node[NUM_INIT_LISTS];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct kmem_cache_node {</span></span>
<span class="line"><span>    spinlock_t list_lock;//自旋锁</span></span>
<span class="line"><span>    struct list_head slabs_partial;//有一部分空闲对象的kmem_cache结构</span></span>
<span class="line"><span>    struct list_head slabs_full;//没有空闲对象的kmem_cache结构</span></span>
<span class="line"><span>    struct list_head slabs_free;//对象全部空闲kmem_cache结构</span></span>
<span class="line"><span>    unsigned long total_slabs; //一共多少kmem_cache结构</span></span>
<span class="line"><span>    unsigned long free_slabs;  //空闲的kmem_cache结构</span></span>
<span class="line"><span>    unsigned long free_objects;//空闲的对象</span></span>
<span class="line"><span>    unsigned int free_limit;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>static void __init init_list(struct kmem_cache *cachep, struct kmem_cache_node *list,</span></span>
<span class="line"><span>                int nodeid)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kmem_cache_node *ptr;</span></span>
<span class="line"><span>    //分配新的 kmem_cache_node 结构的空间</span></span>
<span class="line"><span>    ptr = kmalloc_node(sizeof(struct kmem_cache_node), GFP_NOWAIT, nodeid);</span></span>
<span class="line"><span>    BUG_ON(!ptr);</span></span>
<span class="line"><span>    //复制初始时的静态kmem_cache_node结构</span></span>
<span class="line"><span>    memcpy(ptr, list, sizeof(struct kmem_cache_node));</span></span>
<span class="line"><span>    spin_lock_init(&amp;ptr-&amp;gt;list_lock);</span></span>
<span class="line"><span>    MAKE_ALL_LISTS(cachep, ptr, nodeid);</span></span>
<span class="line"><span>    //设置kmem_cache_node的地址</span></span>
<span class="line"><span>    cachep-&amp;gt;node[nodeid] = ptr;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们第一次分配对象时，肯定没有对应的内存页面存放对象，那么SLAB模块就会调用 <strong>cache_grow_begin函数</strong> 获取内存页面，然后用获取的页面来存放对象，我们一起来看看代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void slab_map_pages(struct kmem_cache *cache, struct page *page,void *freelist)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //页面结构指向kmem_cache结构</span></span>
<span class="line"><span>    page-&amp;gt;slab_cache = cache;</span></span>
<span class="line"><span>    //指向空闲对象的链表</span></span>
<span class="line"><span>    page-&amp;gt;freelist = freelist;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static struct page *cache_grow_begin(struct kmem_cache *cachep,</span></span>
<span class="line"><span>                gfp_t flags, int nodeid)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void *freelist;</span></span>
<span class="line"><span>    size_t offset;</span></span>
<span class="line"><span>    gfp_t local_flags;</span></span>
<span class="line"><span>    int page_node;</span></span>
<span class="line"><span>    struct kmem_cache_node *n;</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    WARN_ON_ONCE(cachep-&amp;gt;ctor &amp;&amp; (flags &amp; __GFP_ZERO));</span></span>
<span class="line"><span>    local_flags = flags &amp; (GFP_CONSTRAINT_MASK|GFP_RECLAIM_MASK);</span></span>
<span class="line"><span>    //获取页面</span></span>
<span class="line"><span>    page = kmem_getpages(cachep, local_flags, nodeid);</span></span>
<span class="line"><span>    //获取页面所在的内存节点号</span></span>
<span class="line"><span>    page_node = page_to_nid(page);</span></span>
<span class="line"><span>    //根据内存节点获取对应kmem_cache_node结构</span></span>
<span class="line"><span>    n = get_node(cachep, page_node);</span></span>
<span class="line"><span>    //分配管理空闲对象的数据结构</span></span>
<span class="line"><span>    freelist = alloc_slabmgmt(cachep, page, offset,</span></span>
<span class="line"><span>            local_flags &amp; ~GFP_CONSTRAINT_MASK, page_node);</span></span>
<span class="line"><span>    //让页面中相关的字段指向kmem_cache和空闲对象</span></span>
<span class="line"><span>    slab_map_pages(cachep, page, freelist);</span></span>
<span class="line"><span>    //初始化空闲对象管理数据</span></span>
<span class="line"><span>    cache_init_objs(cachep, page);</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void cache_grow_end(struct kmem_cache *cachep, struct page *page)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kmem_cache_node *n;</span></span>
<span class="line"><span>    void *list = NULL;</span></span>
<span class="line"><span>    if (!page)</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    //初始化结page构的slab_list链表</span></span>
<span class="line"><span>    INIT_LIST_HEAD(&amp;page-&amp;gt;slab_list);</span></span>
<span class="line"><span>    //根据内存节点获取对应kmem_cache_node结构.</span></span>
<span class="line"><span>    n = get_node(cachep, page_to_nid(page));</span></span>
<span class="line"><span>    spin_lock(&amp;n-&amp;gt;list_lock);</span></span>
<span class="line"><span>    //slab计数增加</span></span>
<span class="line"><span>    n-&amp;gt;total_slabs++;</span></span>
<span class="line"><span>    if (!page-&amp;gt;active) {</span></span>
<span class="line"><span>        //把这个page结构加入到kmem_cache_node结构的空闲链表中</span></span>
<span class="line"><span>        list_add_tail(&amp;page-&amp;gt;slab_list, &amp;n-&amp;gt;slabs_free);</span></span>
<span class="line"><span>        n-&amp;gt;free_slabs++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    spin_unlock(&amp;n-&amp;gt;list_lock);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的注释已经很清楚了，cache_grow_begin函数会为kmem_cache结构分配用来存放对象的页面，随后会调用与之对应的cache_grow_end函数，把这页面挂载到kmem_cache_node结构的链表中，并让页面指向kmem_cache结构。</p><p>这样kmem_cache_node，kmem_cache，page这三者之间就联系起来了。你再看一下后面的图，就更加清楚了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/e7b479af38d5ed1ab00f35b4fe88fe30.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/e7b479af38d5ed1ab00f35b4fe88fe30.jpg" alt=""></a></p><p>上图中page可能是一组连续的pages，但是只会把第一个page挂载到kmem_cache_node中，同时，在slab_map_pages函数中又让page指向了kmem_cache。</p><p>但你要特别留意kmem_cache_node中的三个链表，它们分别挂载的pages，有一部分是空闲对象的page、还有对象全部都已经分配的page，以及全部都为空闲对象的page。这是为了提高分配时查找kmem_cache的性能。</p><h2 id="slab分配对象的过程" tabindex="-1">SLAB分配对象的过程 <a class="header-anchor" href="#slab分配对象的过程" aria-label="Permalink to &quot;SLAB分配对象的过程&quot;">​</a></h2><p>有了前面对SLAB数据结构的了解，SLAB分配对象的过程你自己也能推导出来，无非是根据请求分配对象的大小，查找对应的kmem_cache结构，接着从这个结构中获取arry_cache结构，然后分配对象。</p><p>如果没有空闲对象了，就需要在kmem_cache对应的kmem_cache_node结构中查找有空闲对象的kmem_cache。如果还是没找到，最后就要分配内存页面新增kmem_cache结构了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/78868f267073d4b0a8fb73b15bb41bfe.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389880/78868f267073d4b0a8fb73b15bb41bfe.jpg" alt=""></a></p><p>下面我们从接口开始了解这些过程。</p><h3 id="slab分配接口" tabindex="-1">SLAB分配接口 <a class="header-anchor" href="#slab分配接口" aria-label="Permalink to &quot;SLAB分配接口&quot;">​</a></h3><p>其实在Linux内核中，用的最多的是kmalloc函数，经常用于分配小的缓冲区，或者数据结构分配实例空间，这个函数就是SLAB分配接口，它是用来分配对象的，这个对象就是一小块内存空间。</p><p>下面一起来看看代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __always_inline void *__do_kmalloc(size_t size, gfp_t flags,unsigned long caller)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kmem_cache *cachep;</span></span>
<span class="line"><span>    void *ret;</span></span>
<span class="line"><span>    if (unlikely(size &amp;gt; KMALLOC_MAX_CACHE_SIZE))</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    //查找size对应的kmem_cache</span></span>
<span class="line"><span>    cachep = kmalloc_slab(size, flags);</span></span>
<span class="line"><span>    if (unlikely(ZERO_OR_NULL_PTR(cachep)))</span></span>
<span class="line"><span>        return cachep;</span></span>
<span class="line"><span>    //分配对象</span></span>
<span class="line"><span>    ret = slab_alloc(cachep, flags, caller);</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void *__kmalloc(size_t size, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return __do_kmalloc(size, flags, _RET_IP_);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static __always_inline void *kmalloc(size_t size, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return __kmalloc(size, flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面代码的流程很简单，就是在__do_kmalloc函数中，查找出分配大小对应的kmem_cache结构，然后调用slab_alloc函数进行分配。可以说，slab_alloc函数才是SLAB的接口函数，但是它的参数中 <strong>必须要有kmem_cache结构</strong>。</p><p>具体是如何查找的呢？我们这就来看看。</p><h3 id="如何查找kmem-cache结构" tabindex="-1">如何查找kmem_cache结构 <a class="header-anchor" href="#如何查找kmem-cache结构" aria-label="Permalink to &quot;如何查找kmem\\_cache结构&quot;">​</a></h3><p>由于SLAB的接口函数slab_alloc，它的参数中必须要有kmem_cache结构指针，指定从哪个kmem_cache结构分配对象，所以在调用slab_alloc函数之前必须给出kmem_cache结构。</p><p>我们怎么查找到它呢？这就需要调用kmalloc_slab函数了，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum kmalloc_cache_type {</span></span>
<span class="line"><span>    KMALLOC_NORMAL = 0,</span></span>
<span class="line"><span>    KMALLOC_RECLAIM,</span></span>
<span class="line"><span>#ifdef CONFIG_ZONE_DMA</span></span>
<span class="line"><span>    KMALLOC_DMA,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    NR_KMALLOC_TYPES</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct kmem_cache *kmalloc_caches[NR_KMALLOC_TYPES][KMALLOC_SHIFT_HIGH + 1] __ro_after_init ={ static u8 size_index[24] __ro_after_init = {</span></span>
<span class="line"><span>    3,  /* 8 */</span></span>
<span class="line"><span>    4,  /* 16 */</span></span>
<span class="line"><span>    5,  /* 24 */</span></span>
<span class="line"><span>    5,  /* 32 */</span></span>
<span class="line"><span>    6,  /* 40 */</span></span>
<span class="line"><span>    6,  /* 48 */</span></span>
<span class="line"><span>    6,  /* 56 */</span></span>
<span class="line"><span>    6,  /* 64 */</span></span>
<span class="line"><span>    1,  /* 72 */</span></span>
<span class="line"><span>    1,  /* 80 */</span></span>
<span class="line"><span>    1,  /* 88 */</span></span>
<span class="line"><span>    1,  /* 96 */</span></span>
<span class="line"><span>    7,  /* 104 */</span></span>
<span class="line"><span>    7,  /* 112 */</span></span>
<span class="line"><span>    7,  /* 120 */</span></span>
<span class="line"><span>    7,  /* 128 */</span></span>
<span class="line"><span>    2,  /* 136 */</span></span>
<span class="line"><span>    2,  /* 144 */</span></span>
<span class="line"><span>    2,  /* 152 */</span></span>
<span class="line"><span>    2,  /* 160 */</span></span>
<span class="line"><span>    2,  /* 168 */</span></span>
<span class="line"><span>    2,  /* 176 */</span></span>
<span class="line"><span>    2,  /* 184 */</span></span>
<span class="line"><span>    2   /* 192 */</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>//根据分配标志返回枚举类型，其实是0、1、2其中之一</span></span>
<span class="line"><span>static __always_inline enum kmalloc_cache_type kmalloc_type(gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#ifdef CONFIG_ZONE_DMA</span></span>
<span class="line"><span>    if (likely((flags &amp; (__GFP_DMA | __GFP_RECLAIMABLE)) == 0))</span></span>
<span class="line"><span>        return KMALLOC_NORMAL;</span></span>
<span class="line"><span>    return flags &amp; __GFP_DMA ? KMALLOC_DMA : KMALLOC_RECLAIM;</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>    return flags &amp; __GFP_RECLAIMABLE ? KMALLOC_RECLAIM : KMALLOC_NORMAL;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>struct kmem_cache *kmalloc_slab(size_t size, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned int index;</span></span>
<span class="line"><span>    //计算出index</span></span>
<span class="line"><span>    if (size &amp;lt;= 192) {</span></span>
<span class="line"><span>        if (!size)</span></span>
<span class="line"><span>            return ZERO_SIZE_PTR;</span></span>
<span class="line"><span>        index = size_index[size_index_elem(size)];</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if (WARN_ON_ONCE(size &amp;gt; KMALLOC_MAX_CACHE_SIZE))</span></span>
<span class="line"><span>            return NULL;</span></span>
<span class="line"><span>        index = fls(size - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return kmalloc_caches[kmalloc_type(flags)][index];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码，不难发现kmalloc_caches就是个全局的二维数组，kmalloc_slab函数只是根据分配大小和分配标志计算出了数组下标，最后取出其中kmem_cache结构指针。</p><p>那么kmalloc_caches中的kmem_cache，它又是谁建立的呢？我们还是接着看代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct kmem_cache *__init create_kmalloc_cache(const char *name,</span></span>
<span class="line"><span>        unsigned int size, slab_flags_t flags,</span></span>
<span class="line"><span>        unsigned int useroffset, unsigned int usersize)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //从第一个kmem_cache中分配一个对象放kmem_cache</span></span>
<span class="line"><span>    struct kmem_cache *s = kmem_cache_zalloc(kmem_cache, GFP_NOWAIT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!s)</span></span>
<span class="line"><span>        panic(&quot;Out of memory when creating slab %s\\n&quot;, name);</span></span>
<span class="line"><span>    //设置s的对齐参数，处理s的freelist就是arr_cache</span></span>
<span class="line"><span>    create_boot_cache(s, name, size, flags, useroffset, usersize);</span></span>
<span class="line"><span>    list_add(&amp;s-&amp;gt;list, &amp;slab_caches);</span></span>
<span class="line"><span>    s-&amp;gt;refcount = 1;</span></span>
<span class="line"><span>    return s;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//新建一个kmem_cache</span></span>
<span class="line"><span>static void __init new_kmalloc_cache(int idx, enum kmalloc_cache_type type, slab_flags_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (type == KMALLOC_RECLAIM)</span></span>
<span class="line"><span>        flags |= SLAB_RECLAIM_ACCOUNT;</span></span>
<span class="line"><span>        //根据kmalloc_info中信息建立一个kmem_cache</span></span>
<span class="line"><span>    kmalloc_caches[type][idx] = create_kmalloc_cache(</span></span>
<span class="line"><span>                    kmalloc_info[idx].name[type],</span></span>
<span class="line"><span>                    kmalloc_info[idx].size, flags, 0,</span></span>
<span class="line"><span>                    kmalloc_info[idx].size);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//建立所有的kmalloc_caches中的kmem_cache</span></span>
<span class="line"><span>void __init create_kmalloc_caches(slab_flags_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    enum kmalloc_cache_type type;</span></span>
<span class="line"><span>    for (type = KMALLOC_NORMAL; type &amp;lt;= KMALLOC_RECLAIM; type++) {</span></span>
<span class="line"><span>        for (i = KMALLOC_SHIFT_LOW; i &amp;lt;= KMALLOC_SHIFT_HIGH; i++) {</span></span>
<span class="line"><span>            if (!kmalloc_caches[type][i])</span></span>
<span class="line"><span>                //建立一个新的kmem_cache</span></span>
<span class="line"><span>                new_kmalloc_cache(i, type, flags);</span></span>
<span class="line"><span>            if (KMALLOC_MIN_SIZE &amp;lt;= 32 &amp;&amp; i == 6 &amp;&amp;</span></span>
<span class="line"><span>                    !kmalloc_caches[type][1])</span></span>
<span class="line"><span>                new_kmalloc_cache(1, type, flags);</span></span>
<span class="line"><span>            if (KMALLOC_MIN_SIZE &amp;lt;= 64 &amp;&amp; i == 7 &amp;&amp;</span></span>
<span class="line"><span>                    !kmalloc_caches[type][2])</span></span>
<span class="line"><span>                new_kmalloc_cache(2, type, flags);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，__do_kmalloc函数中根据分配对象大小查找的所有kmem_cache结构，我们就建立好了，保存在kmalloc_caches数组中。下面我们再去看看对象是如何分配的。</p><h3 id="分配对象" tabindex="-1">分配对象 <a class="header-anchor" href="#分配对象" aria-label="Permalink to &quot;分配对象&quot;">​</a></h3><p>下面我们从slab_alloc函数开始探索对象的分配过程，slab_alloc函数的第一个参数就kmem_cache结构的指针，表示从该kmem_cache结构中分配对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __always_inline void *slab_alloc(struct kmem_cache *cachep, gfp_t flags, unsigned long caller)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned long save_flags;</span></span>
<span class="line"><span>    void *objp;</span></span>
<span class="line"><span>    //关中断</span></span>
<span class="line"><span>    local_irq_save(save_flags);</span></span>
<span class="line"><span>    //分配对象</span></span>
<span class="line"><span>    objp = __do_cache_alloc(cachep, flags);</span></span>
<span class="line"><span>    //恢复中断</span></span>
<span class="line"><span>    local_irq_restore(save_flags);</span></span>
<span class="line"><span>    return objp;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接口函数总是简单的，真正干活的是__do_cache_alloc函数，下面我们就来看看这个函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void *____cache_alloc(struct kmem_cache *cachep, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    void *objp;</span></span>
<span class="line"><span>    struct array_cache *ac;</span></span>
<span class="line"><span>    //获取当前cpu在cachep结构中的array_cache结构的指针</span></span>
<span class="line"><span>    ac = cpu_cache_get(cachep);</span></span>
<span class="line"><span>    //如果ac中的avail不为0,说明当前kmem_cache结构中freelist是有空闲对象</span></span>
<span class="line"><span>    if (likely(ac-&amp;gt;avail)) {</span></span>
<span class="line"><span>        ac-&amp;gt;touched = 1;</span></span>
<span class="line"><span>        //空间对象的地址保存在ac-&amp;gt;entry</span></span>
<span class="line"><span>        objp = ac-&amp;gt;entry[--ac-&amp;gt;avail];</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    objp = cache_alloc_refill(cachep, flags);</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    return objp;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static __always_inline void *__do_cache_alloc(struct kmem_cache *cachep, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return ____cache_alloc(cachep, flags);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中真正做事的函数是 <strong>____cache_alloc函数</strong>，它首先获取了当前kmem_cache结构中指向array_cache结构的指针，找到它里面空闲对象的地址（如果你不懂array_cache结构，请回到SLAB对象那一小节复习），然后在array_cache结构中取出一个空闲对象地址返回，这样就分配成功了。</p><p>这个速度是很快的，如果array_cache结构中没有空闲对象了，就会调用cache_alloc_refill函数。那这个函数又干了什么呢？我们接着往下看。代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct page *get_first_slab(struct kmem_cache_node *n, bool pfmemalloc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    assert_spin_locked(&amp;n-&amp;gt;list_lock);</span></span>
<span class="line"><span>    //首先从kmem_cache_node结构中的slabs_partial链表上查看有没有page</span></span>
<span class="line"><span>    page = list_first_entry_or_null(&amp;n-&amp;gt;slabs_partial, struct page,slab_list);</span></span>
<span class="line"><span>    if (!page) {</span></span>
<span class="line"><span>    //如果没有</span></span>
<span class="line"><span>        n-&amp;gt;free_touched = 1;</span></span>
<span class="line"><span>    //从kmem_cache_node结构中的slabs_free链表上查看有没有page</span></span>
<span class="line"><span>        page = list_first_entry_or_null(&amp;n-&amp;gt;slabs_free, struct page,slab_list);</span></span>
<span class="line"><span>        if (page)</span></span>
<span class="line"><span>            n-&amp;gt;free_slabs--; //空闲slab计数减一</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //返回page</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static void *cache_alloc_refill(struct kmem_cache *cachep, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int batchcount;</span></span>
<span class="line"><span>    struct kmem_cache_node *n;</span></span>
<span class="line"><span>    struct array_cache *ac, *shared;</span></span>
<span class="line"><span>    int node;</span></span>
<span class="line"><span>    void *list = NULL;</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    //获取内存节点</span></span>
<span class="line"><span>    node = numa_mem_id();</span></span>
<span class="line"><span>    ac = cpu_cache_get(cachep);</span></span>
<span class="line"><span>    batchcount = ac-&amp;gt;batchcount;</span></span>
<span class="line"><span>    //获取cachep所属的kmem_cache_node</span></span>
<span class="line"><span>    n = get_node(cachep, node);</span></span>
<span class="line"><span>    shared = READ_ONCE(n-&amp;gt;shared);</span></span>
<span class="line"><span>    if (!n-&amp;gt;free_objects &amp;&amp; (!shared || !shared-&amp;gt;avail))</span></span>
<span class="line"><span>        goto direct_grow;</span></span>
<span class="line"><span>    while (batchcount &amp;gt; 0) {</span></span>
<span class="line"><span>        //获取kmem_cache_node结构中其它kmem_cache,返回的是page，而page会指向kmem_cache</span></span>
<span class="line"><span>        page = get_first_slab(n, false);</span></span>
<span class="line"><span>        if (!page)</span></span>
<span class="line"><span>            goto must_grow;</span></span>
<span class="line"><span>        batchcount = alloc_block(cachep, ac, page, batchcount);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>must_grow:</span></span>
<span class="line"><span>    n-&amp;gt;free_objects -= ac-&amp;gt;avail;</span></span>
<span class="line"><span>direct_grow:</span></span>
<span class="line"><span>    if (unlikely(!ac-&amp;gt;avail)) {</span></span>
<span class="line"><span>        //分配新的kmem_cache并初始化</span></span>
<span class="line"><span>        page = cache_grow_begin(cachep, gfp_exact_node(flags), node);</span></span>
<span class="line"><span>        ac = cpu_cache_get(cachep);</span></span>
<span class="line"><span>        if (!ac-&amp;gt;avail &amp;&amp; page)</span></span>
<span class="line"><span>            alloc_block(cachep, ac, page, batchcount);</span></span>
<span class="line"><span>        //让page挂载到kmem_cache_node结构的slabs_list链表上</span></span>
<span class="line"><span>        cache_grow_end(cachep, page);</span></span>
<span class="line"><span>        if (!ac-&amp;gt;avail)</span></span>
<span class="line"><span>            return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ac-&amp;gt;touched = 1;</span></span>
<span class="line"><span>    //重新分配</span></span>
<span class="line"><span>    return ac-&amp;gt;entry[--ac-&amp;gt;avail];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用cache_alloc_refill函数的过程，主要的工作都有哪些呢？我给你梳理一下。</p><p>首先，获取了cachep所属的kmem_cache_node。</p><p>然后调用get_first_slab，获取kmem_cache_node结构还有没有包含空闲对象的kmem_cache。但是请注意，这里返回的是page，因为page会指向kmem_cache结构，page所代表的物理内存页面，也保存着kmem_cache结构中的对象。</p><p>最后，如果kmem_cache_node结构没有包含空闲对象的kmem_cache了，就必须调用cache_grow_begin函数，找伙伴系统分配新的内存页面，而且还要找第一个kmem_cache分配新的对象，来存放kmem_cache结构的实例变量，并进行必要的初始化。</p><p>这些步骤完成之后，再调用cache_grow_end函数，把刚刚分配的page挂载到kmem_cache_node结构的slabs_list链表上。因为cache_grow_begin和cache_grow_end函数在前面已经分析过了，这里不再赘述。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天的内容讲完了，我来帮你梳理一下本课程的重点。</p><p>1.为了分配小于1个page的小块内存，Linux实现了SLAB，用kmem_cache结构管理page对应内存页面上小块内存对象，然后让该page指向kmem_cache，由kmem_cache_node结构管理多个page。</p><p>2.我们从Linux内核中使用的kmalloc函数入手，了解了SLAB下整个内存对象的分配过程。</p><p>到此为止，我们对SLAB的研究就告一段落了，是不是感觉和Cosmos内存管理有些相像而又不同呢？甚至我们Cosmos内存管理要更为简洁和高效。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>Linux的SLAB，使用kmalloc函数能分配多大的内存对象呢？</p><p>欢迎你在留言区跟我交流互动，也欢迎你把这节课分享给你的同事、朋友，跟他一起研究SLAB相关的内容。</p><p>我是LMOS，我们下节课见！</p>`,73)])])}const g=s(l,[["render",c]]);export{r as __pageData,g as default};
