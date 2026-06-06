import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"22 | 瞧一瞧Linux：伙伴系统如何分配内存？","description":"","frontmatter":{},"headers":[{"level":2,"title":"伙伴系统","slug":"伙伴系统","link":"#伙伴系统","children":[{"level":3,"title":"怎样表示一个页","slug":"怎样表示一个页","link":"#怎样表示一个页","children":[]},{"level":3,"title":"怎样表示一个区","slug":"怎样表示一个区","link":"#怎样表示一个区","children":[]},{"level":3,"title":"怎样表示一个内存节点","slug":"怎样表示一个内存节点","link":"#怎样表示一个内存节点","children":[]},{"level":3,"title":"数据结构之间的关系","slug":"数据结构之间的关系","link":"#数据结构之间的关系","children":[]},{"level":3,"title":"何为伙伴","slug":"何为伙伴","link":"#何为伙伴","children":[]}]},{"level":2,"title":"分配页面","slug":"分配页面","link":"#分配页面","children":[{"level":3,"title":"通过接口找到内存节点","slug":"通过接口找到内存节点","link":"#通过接口找到内存节点","children":[]},{"level":3,"title":"开始分配","slug":"开始分配","link":"#开始分配","children":[]},{"level":3,"title":"准备分配页面的参数","slug":"准备分配页面的参数","link":"#准备分配页面的参数","children":[]},{"level":3,"title":"Plan A：快速分配路径","slug":"plan-a-快速分配路径","link":"#plan-a-快速分配路径","children":[]},{"level":3,"title":"Plan B：慢速分配路径","slug":"plan-b-慢速分配路径","link":"#plan-b-慢速分配路径","children":[]},{"level":3,"title":"如何分配内存页面","slug":"如何分配内存页面","link":"#如何分配内存页面","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/22-瞧一瞧Linux：伙伴系统如何分配内存？.md","filePath":"操作系统实战45讲/22-瞧一瞧Linux：伙伴系统如何分配内存？.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/22-瞧一瞧Linux：伙伴系统如何分配内存？.md"};function i(t,s,c,_,r,o){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_22-瞧一瞧linux-伙伴系统如何分配内存" tabindex="-1">22 | 瞧一瞧Linux：伙伴系统如何分配内存？ <a class="header-anchor" href="#_22-瞧一瞧linux-伙伴系统如何分配内存" aria-label="Permalink to &quot;22 | 瞧一瞧Linux：伙伴系统如何分配内存？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>前面我们实现了Cosmos的内存管理组件，相信你对计算机内存管理已经有了相当深刻的认识和见解。那么，像Linux这样的成熟操作系统，又是怎样实现内存管理的呢？</p><p>这就要说到Linux系统中，用来管理物理内存页面的 <strong>伙伴系统</strong>，以及负责分配比页更小的内存对象的 <strong>SLAB分配器</strong> 了。</p><p>我会通过两节课给你理清这两种内存管理技术，这节课我们先来说说伙伴系统，下节课再讲SLAB。只要你紧跟我的思路，再加上前面的学习，真正理解这两种技术也并不难。</p><h2 id="伙伴系统" tabindex="-1">伙伴系统 <a class="header-anchor" href="#伙伴系统" aria-label="Permalink to &quot;伙伴系统&quot;">​</a></h2><p>伙伴系统源于Sun公司的Solaris操作系统，是Solaris操作系统上极为优秀的物理内存页面管理算法。</p><p>但是，好东西总是容易被别人窃取或者效仿，伙伴系统也成了Linux的物理内存管理算法。由于Linux的开放和非赢利，这自然无可厚非，这不得不让我们想起了鲁迅《孔乙己》中的：“窃书不算偷”。</p><p>那Linux上伙伴系统算法是怎样实现的呢？我们不妨从一些重要的数据结构开始入手。</p><h3 id="怎样表示一个页" tabindex="-1">怎样表示一个页 <a class="header-anchor" href="#怎样表示一个页" aria-label="Permalink to &quot;怎样表示一个页&quot;">​</a></h3><p>Linux也是使用分页机制管理物理内存的，即Linux把物理内存分成4KB大小的页面进行管理。那Linux用了一个什么样的数据结构，表示一个页呢？</p><p>早期Linux使用了位图，后来使用了字节数组，但是现在Linux定义了一个page结构体来表示一个页，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct page {</span></span>
<span class="line"><span>    //page结构体的标志，它决定页面是什么状态</span></span>
<span class="line"><span>    unsigned long flags;</span></span>
<span class="line"><span>    union {</span></span>
<span class="line"><span>        struct {</span></span>
<span class="line"><span>            //挂载上级结构的链表</span></span>
<span class="line"><span>            struct list_head lru;</span></span>
<span class="line"><span>            //用于文件系统，address_space结构描述上文件占用了哪些内存页面</span></span>
<span class="line"><span>            struct address_space *mapping;</span></span>
<span class="line"><span>            pgoff_t index;</span></span>
<span class="line"><span>            unsigned long private;</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        //DMA设备的地址</span></span>
<span class="line"><span>        struct {</span></span>
<span class="line"><span>            dma_addr_t dma_addr;</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        //当页面用于内存对象时指向相关的数据结构</span></span>
<span class="line"><span>        struct {</span></span>
<span class="line"><span>            union {</span></span>
<span class="line"><span>                struct list_head slab_list;</span></span>
<span class="line"><span>                struct {</span></span>
<span class="line"><span>                    struct page *next;</span></span>
<span class="line"><span>#ifdef CONFIG_64BIT</span></span>
<span class="line"><span>                    int pages;</span></span>
<span class="line"><span>                    int pobjects;</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>                    short int pages;</span></span>
<span class="line"><span>                    short int pobjects;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>                };</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            //指向管理SLAB的结构kmem_cache</span></span>
<span class="line"><span>            struct kmem_cache *slab_cache;</span></span>
<span class="line"><span>            //指向SLAB的第一个对象</span></span>
<span class="line"><span>            void *freelist;</span></span>
<span class="line"><span>            union {</span></span>
<span class="line"><span>                void *s_mem;</span></span>
<span class="line"><span>                unsigned long counters;</span></span>
<span class="line"><span>                struct {</span></span>
<span class="line"><span>                    unsigned inuse:16;</span></span>
<span class="line"><span>                    unsigned objects:15;</span></span>
<span class="line"><span>                    unsigned frozen:1;</span></span>
<span class="line"><span>                };</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        //用于页表映射相关的字段</span></span>
<span class="line"><span>        struct {</span></span>
<span class="line"><span>            unsigned long _pt_pad_1;</span></span>
<span class="line"><span>            pgtable_t pmd_huge_pte;</span></span>
<span class="line"><span>            unsigned long _pt_pad_2;</span></span>
<span class="line"><span>            union {</span></span>
<span class="line"><span>                struct mm_struct *pt_mm;</span></span>
<span class="line"><span>                atomic_t pt_frag_refcount;</span></span>
<span class="line"><span>            };</span></span>
<span class="line"><span>            //自旋锁</span></span>
<span class="line"><span>#if ALLOC_SPLIT_PTLOCKS</span></span>
<span class="line"><span>            spinlock_t *ptl;</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>            spinlock_t ptl;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        //用于设备映射</span></span>
<span class="line"><span>        struct {</span></span>
<span class="line"><span>            struct dev_pagemap *pgmap;</span></span>
<span class="line"><span>            void *zone_device_data;</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        struct rcu_head rcu_head;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    //页面引用计数</span></span>
<span class="line"><span>    atomic_t _refcount;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef LAST_CPUPID_NOT_IN_PAGE_FLAGS</span></span>
<span class="line"><span>    int _last_cpupid;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>} _struct_page_alignment;</span></span></code></pre></div><p>这个page结构看上去非常巨大，信息量很多，但其实它占用的内存很少，根据Linux内核配置选项不同，占用20～40个字节空间。page结构大量使用了C语言union联合体定义结构字段，这个联合体的大小，要根据它里面占用内存最大的变量来决定。</p><p>不难猜出，使用过程中，page结构正是 <strong>通过flags</strong> 表示它处于哪种状态，根据不同的状态来使用union联合体的变量表示的数据信息。如果page处于空闲状态，它就会使用union联合体中的lru字段，挂载到对应空闲链表中。</p><p>一“页”障目，不见泰山，这里我们不需要了解page结构的所有细节，我们只需要知道 <strong>Linux内核中，一个page结构表示一个物理内存页面就行了。</strong></p><h3 id="怎样表示一个区" tabindex="-1">怎样表示一个区 <a class="header-anchor" href="#怎样表示一个区" aria-label="Permalink to &quot;怎样表示一个区&quot;">​</a></h3><p>Linux内核中也有区的逻辑概念，因为硬件的限制，Linux内核不能对所有的物理内存页统一对待，所以就把属性相同物理内存页面，归结到了一个区中。</p><p>不同硬件平台，区的划分也不一样。比如在32位的x86平台中，一些使用DMA的设备只能访问0~16MB的物理空间，因此将0~16MB划分为DMA区。</p><p>高内存区则适用于要访问的物理地址空间大于虚拟地址空间，Linux内核不能建立直接映射的情况。除开这两个内存区，物理内存中剩余的页面就划分到常规内存区了。有的平台没有DMA区，64位的x86平台则没有高内存区。</p><p>在Linux里可以查看自己机器上的内存区，指令如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/ce58ed9419a405f5b403ff031bb5992b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/ce58ed9419a405f5b403ff031bb5992b.jpg" alt=""></a></p><p>Linux内核用zone数据结构表示一个区，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum migratetype {</span></span>
<span class="line"><span>    MIGRATE_UNMOVABLE, //不能移动的</span></span>
<span class="line"><span>    MIGRATE_MOVABLE,   //可移动和</span></span>
<span class="line"><span>    MIGRATE_RECLAIMABLE,</span></span>
<span class="line"><span>    MIGRATE_PCPTYPES,  //属于pcp list的</span></span>
<span class="line"><span>    MIGRATE_HIGHATOMIC = MIGRATE_PCPTYPES,</span></span>
<span class="line"><span>#ifdef CONFIG_CMA</span></span>
<span class="line"><span>    MIGRATE_CMA,   //属于CMA区的</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#ifdef CONFIG_MEMORY_ISOLATION</span></span>
<span class="line"><span>    MIGRATE_ISOLATE,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    MIGRATE_TYPES</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>//页面空闲链表头</span></span>
<span class="line"><span>struct free_area {</span></span>
<span class="line"><span>    struct list_head    free_list[MIGRATE_TYPES];</span></span>
<span class="line"><span>    unsigned long       nr_free;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct zone {</span></span>
<span class="line"><span>    unsigned long _watermark[NR_WMARK];</span></span>
<span class="line"><span>    unsigned long watermark_boost;</span></span>
<span class="line"><span>    //预留的内存页面数</span></span>
<span class="line"><span>    unsigned long nr_reserved_highatomic;</span></span>
<span class="line"><span>    //内存区属于哪个内存节点</span></span>
<span class="line"><span>#ifdef CONFIG_NUMA</span></span>
<span class="line"><span>    int node;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    struct pglist_data  *zone_pgdat;</span></span>
<span class="line"><span>    //内存区开始的page结构数组的开始下标</span></span>
<span class="line"><span>    unsigned long       zone_start_pfn;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    atomic_long_t       managed_pages;</span></span>
<span class="line"><span>    //内存区总的页面数</span></span>
<span class="line"><span>    unsigned long       spanned_pages;</span></span>
<span class="line"><span>    //内存区存在的页面数</span></span>
<span class="line"><span>    unsigned long       present_pages;</span></span>
<span class="line"><span>    //内存区名字</span></span>
<span class="line"><span>    const char      *name;</span></span>
<span class="line"><span>    //挂载页面page结构的链表</span></span>
<span class="line"><span>    struct free_area    free_area[MAX_ORDER];</span></span>
<span class="line"><span>    //内存区的标志</span></span>
<span class="line"><span>    unsigned long       flags;</span></span>
<span class="line"><span>    /*保护free_area的自旋锁*/</span></span>
<span class="line"><span>    spinlock_t      lock;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>为了节约你的时间，我只列出了需要我们关注的字段。其中_watermark表示内存页面总量的水位线有min, low, high三种状态，可以作为启动内存页面回收的判断标准。spanned_pages是该内存区总的页面数。</p><p>为什么要有个present_pages字段表示页面真正存在呢？那是因为一些内存区中存在内存空洞，空洞对应的page结构不能用。你可以做个对比，我们的Cosmos不会对内存空洞建立msadsc_t，避免浪费内存。</p><p>在zone结构中我们真正要关注的是 <strong>free_area结构的数组</strong>，这个数组就是用于实现伙伴系统的。其中MAX_ORDER的值默认为11，分别表示挂载地址连续的page结构数目为1，2，4，8，16，32……最大为1024。</p><p>而free_area结构中又是一个list_head链表数组，该数组将具有相同迁移类型的page结构尽可能地分组，有的页面可以迁移，有的不可以迁移，同一类型的所有相同order的page结构，就构成了一组page结构块。</p><p>分配的时候，会先按请求的migratetype从对应的page结构块中寻找，如果不成功，才会从其他migratetype的page结构块中分配。这样做是为了 <strong>让内存页迁移更加高效，可以有效降低内存碎片。</strong></p><p>zone结构中还有一个指针，指向pglist_data结构，这个结构也很重要，下面我们一起去研究它。</p><h3 id="怎样表示一个内存节点" tabindex="-1">怎样表示一个内存节点 <a class="header-anchor" href="#怎样表示一个内存节点" aria-label="Permalink to &quot;怎样表示一个内存节点&quot;">​</a></h3><p>在了解Linux内存节点数据结构之前，我们先要了解 <strong>NUMA</strong>。</p><p>在很多服务器和大型计算机上，如果物理内存是分布式的，由多个计算节点组成，那么每个CPU核都会有自己的本地内存，CPU在访问它的本地内存的时候就比较快，访问其他CPU核内存的时候就比较慢，这种体系结构被称为Non-Uniform Memory Access（NUMA）。</p><p>逻辑如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/23d2b5c0918cce7664e158e8bf925be6.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/23d2b5c0918cce7664e158e8bf925be6.jpg" alt=""></a></p><p>Linux对NUMA进行了抽象，它可以将一整块连续物理内存的划分成几个内存节点，也可以把不是连续的物理内存当成真正的NUMA。</p><p>那么Linux使用什么数据结构表示一个内存节点呢？请看代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum {</span></span>
<span class="line"><span>    ZONELIST_FALLBACK,</span></span>
<span class="line"><span>#ifdef CONFIG_NUMA</span></span>
<span class="line"><span>    ZONELIST_NOFALLBACK,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    MAX_ZONELISTS</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct zoneref {</span></span>
<span class="line"><span>    struct zone *zone;//内存区指针</span></span>
<span class="line"><span>    int zone_idx;     //内存区对应的索引</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct zonelist {</span></span>
<span class="line"><span>    struct zoneref _zonerefs[MAX_ZONES_PER_ZONELIST + 1];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>//zone枚举类型 从0开始</span></span>
<span class="line"><span>enum zone_type {</span></span>
<span class="line"><span>#ifdef CONFIG_ZONE_DMA</span></span>
<span class="line"><span>    ZONE_DMA,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#ifdef CONFIG_ZONE_DMA32</span></span>
<span class="line"><span>    ZONE_DMA32,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    ZONE_NORMAL,</span></span>
<span class="line"><span>#ifdef CONFIG_HIGHMEM</span></span>
<span class="line"><span>    ZONE_HIGHMEM,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    ZONE_MOVABLE,</span></span>
<span class="line"><span>#ifdef CONFIG_ZONE_DEVICE</span></span>
<span class="line"><span>    ZONE_DEVICE,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    __MAX_NR_ZONES</span></span>
<span class="line"><span></span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>//定义MAX_NR_ZONES为__MAX_NR_ZONES 最大为6</span></span>
<span class="line"><span>DEFINE(MAX_NR_ZONES, __MAX_NR_ZONES);</span></span>
<span class="line"><span>//内存节点</span></span>
<span class="line"><span>typedef struct pglist_data {</span></span>
<span class="line"><span>    //定一个内存区数组，最大为6个zone元素</span></span>
<span class="line"><span>    struct zone node_zones[MAX_NR_ZONES];</span></span>
<span class="line"><span>    //两个zonelist，一个是指向本节点的的内存区，另一个指向由本节点分配不到内存时可选的备用内存区。</span></span>
<span class="line"><span>    struct zonelist node_zonelists[MAX_ZONELISTS];</span></span>
<span class="line"><span>    //本节点有多少个内存区</span></span>
<span class="line"><span>    int nr_zones;</span></span>
<span class="line"><span>    //本节点开始的page索引号</span></span>
<span class="line"><span>    unsigned long node_start_pfn;</span></span>
<span class="line"><span>    //本节点有多少个可用的页面</span></span>
<span class="line"><span>    unsigned long node_present_pages;</span></span>
<span class="line"><span>    //本节点有多少个可用的页面包含内存空洞</span></span>
<span class="line"><span>    unsigned long node_spanned_pages;</span></span>
<span class="line"><span>    //节点id</span></span>
<span class="line"><span>    int node_id;</span></span>
<span class="line"><span>    //交换内存页面相关的字段</span></span>
<span class="line"><span>    wait_queue_head_t kswapd_wait;</span></span>
<span class="line"><span>    wait_queue_head_t pfmemalloc_wait;</span></span>
<span class="line"><span>    struct task_struct *kswapd;</span></span>
<span class="line"><span>    //本节点保留的内存页面</span></span>
<span class="line"><span>    unsigned long       totalreserve_pages;</span></span>
<span class="line"><span>    //自旋锁</span></span>
<span class="line"><span>    spinlock_t      lru_lock;</span></span>
<span class="line"><span>} pg_data_t;</span></span></code></pre></div><p>可以发现，pglist_data结构中包含了zonelist数组。第一个zonelist类型的元素指向本节点内的zone数组，第二个zonelist类型的元素指向其它节点的zone数组，而一个zone结构中的free_area数组中又挂载着page结构。</p><p>这样在本节点中分配不到内存页面的时候，就会到其它节点中分配内存页面。当计算机不是NUMA时，这时Linux就只创建一个节点。</p><h3 id="数据结构之间的关系" tabindex="-1">数据结构之间的关系 <a class="header-anchor" href="#数据结构之间的关系" aria-label="Permalink to &quot;数据结构之间的关系&quot;">​</a></h3><p>现在，我们已经了解了pglist_data、zonelist、zone、page这些数据结构的核心内容。</p><p>有了这些必要的知识积累，我再带你从宏观上梳理一下这些结构的关系，只有搞清楚了它们之间的关系，你才能清楚伙伴系统的核心算法的实现。</p><p>根据前面的描述，我们来画张图就清晰了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/04d5fd0788012cd076ef13aa623b65d1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/04d5fd0788012cd076ef13aa623b65d1.jpg" alt=""></a></p><p>我相信你看了这张图，再结合 <a href="https://time.geekbang.org/column/article/388167" target="_blank" rel="noreferrer">上节课</a> Cosmos的物理内存管理器的内容，Linux的伙伴系统算法，你就已经心中有数了。下面，我们去看看何为伙伴。</p><h3 id="何为伙伴" tabindex="-1">何为伙伴 <a class="header-anchor" href="#何为伙伴" aria-label="Permalink to &quot;何为伙伴&quot;">​</a></h3><p>我们一直在说伙伴系统，但是我们还不清楚何为伙伴？</p><p>在我们现实世界中，伙伴就是好朋友，而在Linux物理内存页面管理中，连续且相同大小的pages就可以表示成伙伴。</p><p>比如，第0个page和第1个page是伙伴，但是和第2个page不是伙伴，第2个page和第3个page是伙伴。同时，第0个page和第1个page连续起来作为一个整体pages，这和第2个page和第3个page连续起来作为一个整体pages，它们又是伙伴，依次类推。</p><p>我们还是来画幅图吧，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/e98a2e51e5410be1a98d8820c60d3211.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/e98a2e51e5410be1a98d8820c60d3211.jpg" alt=""></a></p><p>上图中，首先最小的page（0,1）是伙伴，page（2,3）是伙伴，page（4,5）是伙伴，page（6,7）是伙伴，然后A与B是伙伴，C与D是伙伴，最后E与F是伙伴。有了图解，你是不是瞬间明白伙伴系统的伙伴了呢？</p><h2 id="分配页面" tabindex="-1">分配页面 <a class="header-anchor" href="#分配页面" aria-label="Permalink to &quot;分配页面&quot;">​</a></h2><p>下面，我们开始研究Linux下怎样分配物理内存页面，看过前面的数据结构和它们之间的关系，分配物理内存页面的过程很好推理： <strong>首先要找到内存节点，接着找到内存区，然后合适的空闲链表，最后在其中找到页的page结构，完成物理内存页面的分配。</strong></p><h3 id="通过接口找到内存节点" tabindex="-1">通过接口找到内存节点 <a class="header-anchor" href="#通过接口找到内存节点" aria-label="Permalink to &quot;通过接口找到内存节点&quot;">​</a></h3><p>我们先来了解一下分配内存页面的接口，我用一幅图来表示接口以及它们调用关系。我相信图解是理解接口函数的最佳方式，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/9a33d0da55dfdd7dabdeb461af671418.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/389123/9a33d0da55dfdd7dabdeb461af671418.jpg" alt=""></a></p><p>上图中，虚线框中为接口函数，下面则是分配内存页面的核心实现，所有的接口函数都会调用到alloc_pages函数，而这个函数最终会调用__alloc_pages_nodemask函数完成内存页面的分配。</p><p>下面我们来看看alloc_pages函数的形式，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct page *alloc_pages_current(gfp_t gfp, unsigned order)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct mempolicy *pol = &amp;default_policy;</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    if (!in_interrupt() &amp;&amp; !(gfp &amp; __GFP_THISNODE))</span></span>
<span class="line"><span>        pol = get_task_policy(current);</span></span>
<span class="line"><span>    if (pol-&amp;gt;mode == MPOL_INTERLEAVE)</span></span>
<span class="line"><span>        page = alloc_page_interleave(gfp, order, interleave_nodes(pol));</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        page = __alloc_pages_nodemask(gfp, order,</span></span>
<span class="line"><span>                policy_node(gfp, pol, numa_node_id()),</span></span>
<span class="line"><span>                policy_nodemask(gfp, pol));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline struct page * alloc_pages(gfp_t gfp_mask, unsigned int order)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return alloc_pages_current(gfp_mask, order);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们这里不需要关注alloc_pages_current函数的其它细节， <strong>只要知道它最终要调用__alloc_pages_nodemask函数</strong>，而且我们还要搞清楚它的参数，order很好理解，它表示请求分配2的order次方个页面， <strong>重点是gfp_t类型的gfp_mask</strong>。</p><p>gfp_mask的类型和取值如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef unsigned int __bitwise gfp_t;</span></span>
<span class="line"><span>#define ___GFP_DMA      0x01u</span></span>
<span class="line"><span>#define ___GFP_HIGHMEM      0x02u</span></span>
<span class="line"><span>#define ___GFP_DMA32        0x04u</span></span>
<span class="line"><span>#define ___GFP_MOVABLE      0x08u</span></span>
<span class="line"><span>#define ___GFP_RECLAIMABLE  0x10u</span></span>
<span class="line"><span>#define ___GFP_HIGH     0x20u</span></span>
<span class="line"><span>#define ___GFP_IO       0x40u</span></span>
<span class="line"><span>#define ___GFP_FS       0x80u</span></span>
<span class="line"><span>#define ___GFP_ZERO     0x100u</span></span>
<span class="line"><span>#define ___GFP_ATOMIC       0x200u</span></span>
<span class="line"><span>#define ___GFP_DIRECT_RECLAIM   0x400u</span></span>
<span class="line"><span>#define ___GFP_KSWAPD_RECLAIM   0x800u</span></span>
<span class="line"><span>#define ___GFP_WRITE        0x1000u</span></span>
<span class="line"><span>#define ___GFP_NOWARN       0x2000u</span></span>
<span class="line"><span>#define ___GFP_RETRY_MAYFAIL    0x4000u</span></span>
<span class="line"><span>#define ___GFP_NOFAIL       0x8000u</span></span>
<span class="line"><span>#define ___GFP_NORETRY      0x10000u</span></span>
<span class="line"><span>#define ___GFP_MEMALLOC     0x20000u</span></span>
<span class="line"><span>#define ___GFP_COMP     0x40000u</span></span>
<span class="line"><span>#define ___GFP_NOMEMALLOC   0x80000u</span></span>
<span class="line"><span>#define ___GFP_HARDWALL     0x100000u</span></span>
<span class="line"><span>#define ___GFP_THISNODE     0x200000u</span></span>
<span class="line"><span>#define ___GFP_ACCOUNT      0x400000u</span></span>
<span class="line"><span>//需要原子分配内存不得让请求者进入睡眠</span></span>
<span class="line"><span>#define GFP_ATOMIC  (__GFP_HIGH|__GFP_ATOMIC|__GFP_KSWAPD_RECLAIM)</span></span>
<span class="line"><span>//分配用于内核自己使用的内存，可以有IO和文件系统相关的操作</span></span>
<span class="line"><span>#define GFP_KERNEL  (__GFP_RECLAIM | __GFP_IO | __GFP_FS)</span></span>
<span class="line"><span>#define GFP_KERNEL_ACCOUNT (GFP_KERNEL | __GFP_ACCOUNT)</span></span>
<span class="line"><span>//分配内存不能睡眠，不能有I/O和文件系统相关的操作</span></span>
<span class="line"><span>#define GFP_NOWAIT  (__GFP_KSWAPD_RECLAIM)</span></span>
<span class="line"><span>#define GFP_NOIO    (__GFP_RECLAIM)</span></span>
<span class="line"><span>#define GFP_NOFS    (__GFP_RECLAIM | __GFP_IO)</span></span>
<span class="line"><span>//分配用于用户进程的内存</span></span>
<span class="line"><span>#define GFP_USER    (__GFP_RECLAIM | __GFP_IO | __GFP_FS | __GFP_HARDWALL)</span></span>
<span class="line"><span>//用于DMA设备的内存</span></span>
<span class="line"><span>#define GFP_DMA     __GFP_DMA</span></span>
<span class="line"><span>#define GFP_DMA32   __GFP_DMA32</span></span>
<span class="line"><span>//把高端内存区的内存分配给用户进程</span></span>
<span class="line"><span>#define GFP_HIGHUSER    (GFP_USER | __GFP_HIGHMEM)</span></span>
<span class="line"><span>#define GFP_HIGHUSER_MOVABLE    (GFP_HIGHUSER | __GFP_MOVABLE)</span></span>
<span class="line"><span>#define GFP_TRANSHUGE_LIGHT ((GFP_HIGHUSER_MOVABLE | __GFP_COMP | \\__GFP_NOMEMALLOC | __GFP_NOWARN) &amp; ~__GFP_RECLAIM)</span></span>
<span class="line"><span>#define GFP_TRANSHUGE   (GFP_TRANSHUGE_LIGHT | __GFP_DIRECT_RECLAIM)</span></span></code></pre></div><p>不难发现，gfp_t 类型就是int类型，用其中位的状态表示请求分配不同的内存区的内存页面，以及分配内存页面的不同方式。</p><h3 id="开始分配" tabindex="-1">开始分配 <a class="header-anchor" href="#开始分配" aria-label="Permalink to &quot;开始分配&quot;">​</a></h3><p>前面我们已经搞清楚了，内存页面分配接口的参数。下面我们进入分配内存页面的主要函数，这个 <strong>__alloc_pages_nodemask函数</strong> 主要干了三件事。</p><p>1.准备分配页面的参数；</p><p>2.进入快速分配路径；</p><p>3.若快速分配路径没有分配到页面，就进入慢速分配路径。</p><p>让我们来看看它的代码实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct page *__alloc_pages_nodemask(gfp_t gfp_mask, unsigned int order, int preferred_nid,  nodemask_t *nodemask)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    unsigned int alloc_flags = ALLOC_WMARK_LOW;</span></span>
<span class="line"><span>    gfp_t alloc_mask;</span></span>
<span class="line"><span>    struct alloc_context ac = { };</span></span>
<span class="line"><span>    //分配页面的order大于等于最大的order直接返回NULL</span></span>
<span class="line"><span>    if (unlikely(order &amp;gt;= MAX_ORDER)) {</span></span>
<span class="line"><span>        WARN_ON_ONCE(!(gfp_mask &amp; __GFP_NOWARN));</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    gfp_mask &amp;= gfp_allowed_mask;</span></span>
<span class="line"><span>    alloc_mask = gfp_mask;</span></span>
<span class="line"><span>    //准备分配页面的参数放在ac变量中</span></span>
<span class="line"><span>    if (!prepare_alloc_pages(gfp_mask, order, preferred_nid, nodemask, &amp;ac, &amp;alloc_mask, &amp;alloc_flags))</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    alloc_flags |= alloc_flags_nofragment(ac.preferred_zoneref-&amp;gt;zone, gfp_mask);</span></span>
<span class="line"><span>    //进入快速分配路径</span></span>
<span class="line"><span>    page = get_page_from_freelist(alloc_mask, order, alloc_flags, &amp;ac);</span></span>
<span class="line"><span>    if (likely(page))</span></span>
<span class="line"><span>        goto out;</span></span>
<span class="line"><span>    alloc_mask = current_gfp_context(gfp_mask);</span></span>
<span class="line"><span>    ac.spread_dirty_pages = false;</span></span>
<span class="line"><span>    ac.nodemask = nodemask;</span></span>
<span class="line"><span>    //进入慢速分配路径</span></span>
<span class="line"><span>    page = __alloc_pages_slowpath(alloc_mask, order, &amp;ac);</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="准备分配页面的参数" tabindex="-1">准备分配页面的参数 <a class="header-anchor" href="#准备分配页面的参数" aria-label="Permalink to &quot;准备分配页面的参数&quot;">​</a></h3><p>我想你在__alloc_pages_nodemask函数中，一定看到了 <strong>一个变量ac是alloc_context类型的</strong>，顾名思义，分配参数就保存在了ac这个分配上下文的变量中。</p><p>prepare_alloc_pages函数根据传递进来的参数，还会对ac变量做进一步处理，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct alloc_context {</span></span>
<span class="line"><span>    struct zonelist *zonelist;</span></span>
<span class="line"><span>    nodemask_t *nodemask;</span></span>
<span class="line"><span>    struct zoneref *preferred_zoneref;</span></span>
<span class="line"><span>    int migratetype;</span></span>
<span class="line"><span>    enum zone_type highest_zoneidx;</span></span>
<span class="line"><span>    bool spread_dirty_pages;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline bool prepare_alloc_pages(gfp_t gfp_mask, unsigned int order,</span></span>
<span class="line"><span>        int preferred_nid, nodemask_t *nodemask,</span></span>
<span class="line"><span>        struct alloc_context *ac, gfp_t *alloc_mask,</span></span>
<span class="line"><span>        unsigned int *alloc_flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //从哪个内存区分配内存</span></span>
<span class="line"><span>    ac-&amp;gt;highest_zoneidx = gfp_zone(gfp_mask);</span></span>
<span class="line"><span>    //根据节点id计算出zone的指针</span></span>
<span class="line"><span>    ac-&amp;gt;zonelist = node_zonelist(preferred_nid, gfp_mask);</span></span>
<span class="line"><span>    ac-&amp;gt;nodemask = nodemask;</span></span>
<span class="line"><span>    //计算出free_area中的migratetype值，比如如分配的掩码为GFP_KERNEL，那么其类型为MIGRATE_UNMOVABLE；</span></span>
<span class="line"><span>    ac-&amp;gt;migratetype = gfp_migratetype(gfp_mask);</span></span>
<span class="line"><span>    //处理CMA相关的分配选项</span></span>
<span class="line"><span>    *alloc_flags = current_alloc_flags(gfp_mask, *alloc_flags);</span></span>
<span class="line"><span>    ac-&amp;gt;spread_dirty_pages = (gfp_mask &amp; __GFP_WRITE);</span></span>
<span class="line"><span>    //搜索nodemask表示的节点中可用的zone保存在preferred_zoneref</span></span>
<span class="line"><span>    ac-&amp;gt;preferred_zoneref = first_zones_zonelist(ac-&amp;gt;zonelist,</span></span>
<span class="line"><span>                    ac-&amp;gt;highest_zoneidx, ac-&amp;gt;nodemask);</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，prepare_alloc_pages函数根据传递进入的参数，就能找出要分配内存区、候选内存区以及内存区中空闲链表的migratetype类型。它把这些全部收集到ac结构中，只要它返回true，就说明分配内存页面的参数已经准备好了。</p><h3 id="plan-a-快速分配路径" tabindex="-1">Plan A：快速分配路径 <a class="header-anchor" href="#plan-a-快速分配路径" aria-label="Permalink to &quot;Plan A：快速分配路径&quot;">​</a></h3><p>为了优化内存页面的分配性能，在一定情况下可以进入快速分配路径，请注意 <strong>快速分配路径不会处理内存页面合并和回收。</strong> 我们一起来看看代码，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct page *</span></span>
<span class="line"><span>get_page_from_freelist(gfp_t gfp_mask, unsigned int order, int alloc_flags,</span></span>
<span class="line"><span>                        const struct alloc_context *ac)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct zoneref *z;</span></span>
<span class="line"><span>    struct zone *zone;</span></span>
<span class="line"><span>    struct pglist_data *last_pgdat_dirty_limit = NULL;</span></span>
<span class="line"><span>    bool no_fallback;</span></span>
<span class="line"><span>retry:</span></span>
<span class="line"><span>    no_fallback = alloc_flags &amp; ALLOC_NOFRAGMENT;</span></span>
<span class="line"><span>    z = ac-&amp;gt;preferred_zoneref;</span></span>
<span class="line"><span>    //遍历ac-&amp;gt;preferred_zoneref中每个内存区</span></span>
<span class="line"><span>    for_next_zone_zonelist_nodemask(zone, z, ac-&amp;gt;highest_zoneidx,</span></span>
<span class="line"><span>                    ac-&amp;gt;nodemask) {</span></span>
<span class="line"><span>        struct page *page;</span></span>
<span class="line"><span>        unsigned long mark;</span></span>
<span class="line"><span>        //查看内存水位线</span></span>
<span class="line"><span>        mark = wmark_pages(zone, alloc_flags &amp; ALLOC_WMARK_MASK);</span></span>
<span class="line"><span>        //检查内存区中空闲内存是否在水印之上</span></span>
<span class="line"><span>        if (!zone_watermark_fast(zone, order, mark,</span></span>
<span class="line"><span>                       ac-&amp;gt;highest_zoneidx, alloc_flags,</span></span>
<span class="line"><span>                       gfp_mask)) {</span></span>
<span class="line"><span>            int ret;</span></span>
<span class="line"><span>            //当前内存区的内存结点需要做内存回收吗</span></span>
<span class="line"><span>            ret = node_reclaim(zone-&amp;gt;zone_pgdat, gfp_mask, order);</span></span>
<span class="line"><span>            switch (ret) {</span></span>
<span class="line"><span>            //快速分配路径不处理页面回收的问题</span></span>
<span class="line"><span>            case NODE_RECLAIM_NOSCAN:</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            case NODE_RECLAIM_FULL:</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            default:</span></span>
<span class="line"><span>                //根据分配的order数量判断内存区的水位线是否满足要求</span></span>
<span class="line"><span>                if (zone_watermark_ok(zone, order, mark,</span></span>
<span class="line"><span>                    ac-&amp;gt;highest_zoneidx, alloc_flags))</span></span>
<span class="line"><span>                    //如果可以可就从这个内存区开始分配</span></span>
<span class="line"><span>                    goto try_this_zone;</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>try_this_zone:</span></span>
<span class="line"><span>        //真正分配内存页面</span></span>
<span class="line"><span>        page = rmqueue(ac-&amp;gt;preferred_zoneref-&amp;gt;zone, zone, order,</span></span>
<span class="line"><span>                gfp_mask, alloc_flags, ac-&amp;gt;migratetype);</span></span>
<span class="line"><span>        if (page) {</span></span>
<span class="line"><span>	        //清除一些标志或者设置联合页等等</span></span>
<span class="line"><span>            prep_new_page(page, order, gfp_mask, alloc_flags);</span></span>
<span class="line"><span>            return page;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (no_fallback) {</span></span>
<span class="line"><span>        alloc_flags &amp;= ~ALLOC_NOFRAGMENT;</span></span>
<span class="line"><span>        goto retry;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述这段代码中，我删除了一部分非核心代码，如果你有兴趣深入了解请看 <a href="https://elixir.bootlin.com/linux/v5.10.23/source/mm/page_alloc.c#L3792" target="_blank" rel="noreferrer">这里</a>。这个函数的逻辑就是 <strong>遍历所有的候选内存区，然后针对每个内存区检查水位线，是不是执行内存回收机制，当一切检查通过之后，就开始调用rmqueue函数执行内存页面分配。</strong></p><h3 id="plan-b-慢速分配路径" tabindex="-1">Plan B：慢速分配路径 <a class="header-anchor" href="#plan-b-慢速分配路径" aria-label="Permalink to &quot;Plan B：慢速分配路径&quot;">​</a></h3><p>当快速分配路径没有分配到页面的时候，就会进入慢速分配路径。跟快速路径相比，慢速路径最主要的不同是它会 <strong>执行页面回收</strong>，回收页面之后会进行多次重复分配，直到最后分配到内存页面，或者分配失败，具体代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct page *</span></span>
<span class="line"><span>__alloc_pages_slowpath(gfp_t gfp_mask, unsigned int order,</span></span>
<span class="line"><span>                        struct alloc_context *ac)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    bool can_direct_reclaim = gfp_mask &amp; __GFP_DIRECT_RECLAIM;</span></span>
<span class="line"><span>    const bool costly_order = order &amp;gt; PAGE_ALLOC_COSTLY_ORDER;</span></span>
<span class="line"><span>    struct page *page = NULL;</span></span>
<span class="line"><span>    unsigned int alloc_flags;</span></span>
<span class="line"><span>    unsigned long did_some_progress;</span></span>
<span class="line"><span>    enum compact_priority compact_priority;</span></span>
<span class="line"><span>    enum compact_result compact_result;</span></span>
<span class="line"><span>    int compaction_retries;</span></span>
<span class="line"><span>    int no_progress_loops;</span></span>
<span class="line"><span>    unsigned int cpuset_mems_cookie;</span></span>
<span class="line"><span>    int reserve_flags;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>retry:</span></span>
<span class="line"><span>    //唤醒所有交换内存的线程</span></span>
<span class="line"><span>    if (alloc_flags &amp; ALLOC_KSWAPD)</span></span>
<span class="line"><span>        wake_all_kswapds(order, gfp_mask, ac);</span></span>
<span class="line"><span>    //依然调用快速分配路径入口函数尝试分配内存页面</span></span>
<span class="line"><span>     page = get_page_from_freelist(gfp_mask, order, alloc_flags, ac);</span></span>
<span class="line"><span>    if (page)</span></span>
<span class="line"><span>        goto got_pg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //尝试直接回收内存并且再分配内存页面</span></span>
<span class="line"><span>    page = __alloc_pages_direct_reclaim(gfp_mask, order, alloc_flags, ac,</span></span>
<span class="line"><span>                            &amp;did_some_progress);</span></span>
<span class="line"><span>    if (page)</span></span>
<span class="line"><span>        goto got_pg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //尝试直接压缩内存并且再分配内存页面</span></span>
<span class="line"><span>    page = __alloc_pages_direct_compact(gfp_mask, order, alloc_flags, ac,</span></span>
<span class="line"><span>                    compact_priority, &amp;compact_result);</span></span>
<span class="line"><span>    if (page)</span></span>
<span class="line"><span>        goto got_pg;</span></span>
<span class="line"><span>    //检查对于给定的分配请求，重试回收是否有意义</span></span>
<span class="line"><span>    if (should_reclaim_retry(gfp_mask, order, ac, alloc_flags,</span></span>
<span class="line"><span>                 did_some_progress &amp;gt; 0, &amp;no_progress_loops))</span></span>
<span class="line"><span>        goto retry;</span></span>
<span class="line"><span>    //检查对于给定的分配请求，重试压缩是否有意义</span></span>
<span class="line"><span>    if (did_some_progress &amp;gt; 0 &amp;&amp;</span></span>
<span class="line"><span>            should_compact_retry(ac, order, alloc_flags,</span></span>
<span class="line"><span>                compact_result, &amp;compact_priority,</span></span>
<span class="line"><span>                &amp;compaction_retries))</span></span>
<span class="line"><span>        goto retry;</span></span>
<span class="line"><span>    //回收、压缩内存已经失败了，开始尝试杀死进程，回收内存页面</span></span>
<span class="line"><span>    page = __alloc_pages_may_oom(gfp_mask, order, ac, &amp;did_some_progress);</span></span>
<span class="line"><span>    if (page)</span></span>
<span class="line"><span>        goto got_pg;</span></span>
<span class="line"><span>got_pg:</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，依然会调用快速分配路径入口函数进行分配，不过到这里大概率会分配失败，如果能成功分配，也就不会进入到__alloc_pages_slowpath函数中。</p><p>__alloc_pages_slowpath函数一开始会唤醒所有用于内存交换回收的线程get_page_from_freelist函数分配失败了就会进行内存回收，内存回收主要是释放一些文件占用的内存页面。如果内存回收不行，就会就进入到内存压缩环节。</p><p>这里有一个常见的误区你要留意， <strong>内存压缩不是指压缩内存中的数据，而是指移动内存页面，进行内存碎片整理</strong>， <strong>腾出更大的连续的内存空间。</strong> 如果内存碎片整理了，还是不能成功分配内存，就要杀死进程以便释放更多内存页面了。</p><p>因为回收内存的机制不是重点，我们主要关注的是伙伴系统的实现，这里你只要明白它们工作流程就好了。</p><h3 id="如何分配内存页面" tabindex="-1">如何分配内存页面 <a class="header-anchor" href="#如何分配内存页面" aria-label="Permalink to &quot;如何分配内存页面&quot;">​</a></h3><p>无论快速分配路径还是慢速分配路径，最终执行内存页面分配动作的始终是get_page_from_freelist函数，更准确地说，实际完成分配任务的是 <strong>rmqueue函数</strong>。</p><p>我们弄懂了这个函数，才能真正搞清楚伙伴系统的核心原理，后面这段是它的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct page *rmqueue(struct zone *preferred_zone,</span></span>
<span class="line"><span>            struct zone *zone, unsigned int order,</span></span>
<span class="line"><span>            gfp_t gfp_flags, unsigned int alloc_flags,</span></span>
<span class="line"><span>            int migratetype)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned long flags;</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    if (likely(order == 0)) {</span></span>
<span class="line"><span>        if (!IS_ENABLED(CONFIG_CMA) || alloc_flags &amp; ALLOC_CMA ||</span></span>
<span class="line"><span>                migratetype != MIGRATE_MOVABLE) {</span></span>
<span class="line"><span>    //如果order等于0,就说明是分配一个页面，说就从pcplist中分配</span></span>
<span class="line"><span>            page = rmqueue_pcplist(preferred_zone, zone, gfp_flags,</span></span>
<span class="line"><span>                    migratetype, alloc_flags);</span></span>
<span class="line"><span>            goto out;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //加锁并关中断</span></span>
<span class="line"><span>    spin_lock_irqsave(&amp;zone-&amp;gt;lock, flags);</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        page = NULL;</span></span>
<span class="line"><span>        if (order &amp;gt; 0 &amp;&amp; alloc_flags &amp; ALLOC_HARDER) {</span></span>
<span class="line"><span>        //从free_area中分配</span></span>
<span class="line"><span>            page = __rmqueue_smallest(zone, order, MIGRATE_HIGHATOMIC);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!page)</span></span>
<span class="line"><span>        //它最后也是调用__rmqueue_smallest函数</span></span>
<span class="line"><span>            page = __rmqueue(zone, order, migratetype, alloc_flags);</span></span>
<span class="line"><span>    } while (page &amp;&amp; check_new_pages(page, order));</span></span>
<span class="line"><span>    spin_unlock(&amp;zone-&amp;gt;lock);</span></span>
<span class="line"><span>    zone_statistics(preferred_zone, zone);</span></span>
<span class="line"><span>    local_irq_restore(flags);</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码中，我们只需要关注两个函数rmqueue_pcplist和__rmqueue_smallest，这是分配内存页面的核心函数。</p><p>先来看看rmqueue_pcplist函数，在请求分配一个页面的时候，就是用它从pcplist中分配页面的。所谓的pcp是指，每个CPU都有一个内存页面高速缓冲，由数据结构per_cpu_pageset描述，包含在内存区中。</p><p>在Linux内核中，系统会经常请求和释放单个页面。如果针对每个CPU，都建立出预先分配了单个内存页面的链表，用于满足本地CPU发出的单一内存请求，就能提升系统的性能，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct per_cpu_pages {</span></span>
<span class="line"><span>    int count;      //列表中的页面数</span></span>
<span class="line"><span>    int high;       //页面数高于水位线，需要清空</span></span>
<span class="line"><span>    int batch;      //从伙伴系统增加/删除的块数</span></span>
<span class="line"><span>    //页面列表，每个迁移类型一个。</span></span>
<span class="line"><span>    struct list_head lists[MIGRATE_PCPTYPES];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct per_cpu_pageset {</span></span>
<span class="line"><span>    struct per_cpu_pages pcp;</span></span>
<span class="line"><span>#ifdef CONFIG_NUMA</span></span>
<span class="line"><span>    s8 expire;</span></span>
<span class="line"><span>    u16 vm_numa_stat_diff[NR_VM_NUMA_STAT_ITEMS];</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#ifdef CONFIG_SMP</span></span>
<span class="line"><span>    s8 stat_threshold;</span></span>
<span class="line"><span>    s8 vm_stat_diff[NR_VM_ZONE_STAT_ITEMS];</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>static struct page *__rmqueue_pcplist(struct zone *zone, int migratetype,unsigned int alloc_flags,struct per_cpu_pages *pcp,</span></span>
<span class="line"><span>            struct list_head *list)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        if (list_empty(list)) {</span></span>
<span class="line"><span>            //如果list为空，就从这个内存区中分配一部分页面到pcp中来</span></span>
<span class="line"><span>            pcp-&amp;gt;count += rmqueue_bulk(zone, 0,</span></span>
<span class="line"><span>                    pcp-&amp;gt;batch, list,</span></span>
<span class="line"><span>                    migratetype, alloc_flags);</span></span>
<span class="line"><span>            if (unlikely(list_empty(list)))</span></span>
<span class="line"><span>                return NULL;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //获取list上第一个page结构</span></span>
<span class="line"><span>        page = list_first_entry(list, struct page, lru);</span></span>
<span class="line"><span>        //脱链</span></span>
<span class="line"><span>        list_del(&amp;page-&amp;gt;lru);</span></span>
<span class="line"><span>        //减少pcp页面计数</span></span>
<span class="line"><span>        pcp-&amp;gt;count--;</span></span>
<span class="line"><span>    } while (check_new_pcp(page));</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static struct page *rmqueue_pcplist(struct zone *preferred_zone,</span></span>
<span class="line"><span>            struct zone *zone, gfp_t gfp_flags,int migratetype, unsigned int alloc_flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct per_cpu_pages *pcp;</span></span>
<span class="line"><span>    struct list_head *list;</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    unsigned long flags;</span></span>
<span class="line"><span>    //关中断</span></span>
<span class="line"><span>    local_irq_save(flags);</span></span>
<span class="line"><span>    //获取当前CPU下的pcp</span></span>
<span class="line"><span>    pcp = &amp;this_cpu_ptr(zone-&amp;gt;pageset)-&amp;gt;pcp;</span></span>
<span class="line"><span>    //获取pcp下迁移的list链表</span></span>
<span class="line"><span>    list = &amp;pcp-&amp;gt;lists[migratetype];</span></span>
<span class="line"><span>    //摘取list上的page结构</span></span>
<span class="line"><span>    page = __rmqueue_pcplist(zone,  migratetype, alloc_flags, pcp, list);</span></span>
<span class="line"><span>    //开中断</span></span>
<span class="line"><span>    local_irq_restore(flags);</span></span>
<span class="line"><span>    return page;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的注释已经很清楚了，它主要是优化了请求分配单个内存页面的性能。但是遇到多个内存页面的分配请求，就会调用__rmqueue_smallest函数，从free_area数组中分配。</p><p>我们一起来看看__rmqueue_smallest函数的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline struct page *get_page_from_free_area(struct free_area *area,int migratetype)</span></span>
<span class="line"><span>{//返回free_list[migratetype]中的第一个page若没有就返回NULL</span></span>
<span class="line"><span>    return list_first_entry_or_null(&amp;area-&amp;gt;free_list[migratetype],</span></span>
<span class="line"><span>                    struct page, lru);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static inline void del_page_from_free_list(struct page *page, struct zone *zone,unsigned int order)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (page_reported(page))</span></span>
<span class="line"><span>        __ClearPageReported(page);</span></span>
<span class="line"><span>    //脱链</span></span>
<span class="line"><span>    list_del(&amp;page-&amp;gt;lru);</span></span>
<span class="line"><span>    //清除page中伙伴系统的标志</span></span>
<span class="line"><span>    __ClearPageBuddy(page);</span></span>
<span class="line"><span>    set_page_private(page, 0);</span></span>
<span class="line"><span>    //减少free_area中页面计数</span></span>
<span class="line"><span>    zone-&amp;gt;free_area[order].nr_free--;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void add_to_free_list(struct page *page, struct zone *zone,</span></span>
<span class="line"><span>                    unsigned int order, int migratetype)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct free_area *area = &amp;zone-&amp;gt;free_area[order];</span></span>
<span class="line"><span>    //把一组page的首个page加入对应的free_area中</span></span>
<span class="line"><span>    list_add(&amp;page-&amp;gt;lru, &amp;area-&amp;gt;free_list[migratetype]);</span></span>
<span class="line"><span>    area-&amp;gt;nr_free++;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//分割一组页</span></span>
<span class="line"><span>static inline void expand(struct zone *zone, struct page *page,</span></span>
<span class="line"><span>    int low, int high, int migratetype)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //最高order下连续的page数 比如high = 3 size=8</span></span>
<span class="line"><span>    unsigned long size = 1 &amp;lt;&amp;lt; high;</span></span>
<span class="line"><span>    while (high &amp;gt; low) {</span></span>
<span class="line"><span>        high--;</span></span>
<span class="line"><span>        size &amp;gt;&amp;gt;= 1;//每次循环左移一位 4,2,1</span></span>
<span class="line"><span>        //标记为保护页，当其伙伴被释放时，允许合并</span></span>
<span class="line"><span>        if (set_page_guard(zone, &amp;page[size], high, migratetype))</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        //把另一半pages加入对应的free_area中</span></span>
<span class="line"><span>        add_to_free_list(&amp;page[size], zone, high, migratetype);</span></span>
<span class="line"><span>        //设置伙伴</span></span>
<span class="line"><span>        set_buddy_order(&amp;page[size], high);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static __always_inline struct page *__rmqueue_smallest(struct zone *zone, unsigned int order,int migratetype)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned int current_order;</span></span>
<span class="line"><span>    struct free_area *area;</span></span>
<span class="line"><span>    struct page *page;</span></span>
<span class="line"><span>    for (current_order = order; current_order &amp;lt; MAX_ORDER; ++current_order) {</span></span>
<span class="line"><span>        //获取current_order对应的free_area</span></span>
<span class="line"><span>        area = &amp;(zone-&amp;gt;free_area[current_order]);</span></span>
<span class="line"><span>        //获取free_area中对应migratetype为下标的free_list中的page</span></span>
<span class="line"><span>        page = get_page_from_free_area(area, migratetype);</span></span>
<span class="line"><span>        if (!page)</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        //脱链page</span></span>
<span class="line"><span>        del_page_from_free_list(page, zone, current_order);</span></span>
<span class="line"><span>        //分割伙伴</span></span>
<span class="line"><span>        expand(zone, page, order, current_order, migratetype);</span></span>
<span class="line"><span>        set_pcppage_migratetype(page, migratetype);</span></span>
<span class="line"><span>        return page;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，在__rmqueue_smallest函数中，首先要取得current_order对应的free_area区中page，若没有，就继续增加current_order，直到最大的MAX_ORDER。要是得到一组连续page的首地址，就对其脱链，然后调用expand函数分割伙伴。</p><p>可以说 <strong>expand函数是完成伙伴算法的核心</strong>，结合注释你有没有发现，它和我们Cosmos物理内存分配算法有点类似呢？好，伙伴系统算法的核心，我们现在已经搞清楚了，下节课我再跟你说说SLAB。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>至此，伙伴系统我们就介绍完了，我来帮你梳理一下本课程的重点，主要有两个方面。</p><p>首先，我们学习了伙伴系统的数据结构，我们从页开始，Linux用page结构代表一个物理内存页面，接着在page上层定义了内存区zone，这是为了不同的地址空间的分配要求。然后Linux为了支持NUMA体系的计算机，而定义了 <strong>节点pglist_data，</strong> 每个节点中包含了多个zone，我们一起理清了这些数据结构之间的关系。</p><p>之后，我们进入到分配页面这一步，为了理解伙伴系统的内存分配的原理，我们研究了伙伴系统的分配接口，然后重点分析了它的快速分配路径和慢速分配路径。</p><p>只有在快速分配路径失败之后，才会进入慢速分配路径，慢速分配路径中会进行内存回收相关的工作。最后，我们一起了解了expand函数是如何分割伙伴，完成页面分配的。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在默认配置下，Linux伙伴系统能分配多大的连续物理内存？</p><p>欢迎你在留言区跟我交流互动，也欢迎你把这节课转给对Linux伙伴系统感兴趣的朋友，一去学习进步。</p><p>好，我是LMOS，我们下节课见！</p>`,110)])])}const u=n(l,[["render",i]]);export{d as __pageData,u as default};
