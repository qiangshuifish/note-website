import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"24 | 物理内存管理（下）：会议室管理员如何分配会议室？","description":"","frontmatter":{},"headers":[{"level":2,"title":"小内存的分配","slug":"小内存的分配","link":"#小内存的分配","children":[]},{"level":2,"title":"页面换出","slug":"页面换出","link":"#页面换出","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/24-物理内存管理（下）：会议室管理员如何分配会议室？.md","filePath":"趣谈Linux操作系统/24-物理内存管理（下）：会议室管理员如何分配会议室？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/24-物理内存管理（下）：会议室管理员如何分配会议室？.md"};function l(c,s,i,r,o,_){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_24-物理内存管理-下-会议室管理员如何分配会议室" tabindex="-1">24 | 物理内存管理（下）：会议室管理员如何分配会议室？ <a class="header-anchor" href="#_24-物理内存管理-下-会议室管理员如何分配会议室" aria-label="Permalink to &quot;24 | 物理内存管理（下）：会议室管理员如何分配会议室？&quot;">​</a></h1><p>前一节，前面我们解析了整页的分配机制。如果遇到小的对象，物理内存是如何分配的呢？这一节，我们一起来看一看。</p><h2 id="小内存的分配" tabindex="-1">小内存的分配 <a class="header-anchor" href="#小内存的分配" aria-label="Permalink to &quot;小内存的分配&quot;">​</a></h2><p>前面我们讲过，如果遇到小的对象，会使用slub分配器进行分配。那我们就先来解析它的工作原理。</p><p>还记得咱们创建进程的时候，会调用dup_task_struct，它想要试图复制一个task_struct对象，需要先调用alloc_task_struct_node，分配一个task_struct对象。</p><p>从这段代码可以看出，它调用了kmem_cache_alloc_node函数，在task_struct的缓存区域task_struct_cachep分配了一块内存。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct kmem_cache *task_struct_cachep;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>task_struct_cachep = kmem_cache_create(&quot;task_struct&quot;,</span></span>
<span class="line"><span>			arch_task_struct_size, align,</span></span>
<span class="line"><span>			SLAB_PANIC|SLAB_NOTRACK|SLAB_ACCOUNT, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline struct task_struct *alloc_task_struct_node(int node)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return kmem_cache_alloc_node(task_struct_cachep, GFP_KERNEL, node);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void free_task_struct(struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	kmem_cache_free(task_struct_cachep, tsk);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在系统初始化的时候，task_struct_cachep会被kmem_cache_create函数创建。这个函数也比较容易看懂，专门用于分配task_struct对象的缓存。这个缓存区的名字就叫task_struct。缓存区中每一块的大小正好等于task_struct的大小，也即arch_task_struct_size。</p><p>有了这个缓存区，每次创建task_struct的时候，我们不用到内存里面去分配，先在缓存里面看看有没有直接可用的，这就是 <strong>kmem_cache_alloc_node</strong> 的作用。</p><p>当一个进程结束，task_struct也不用直接被销毁，而是放回到缓存中，这就是 <strong>kmem_cache_free</strong> 的作用。这样，新进程创建的时候，我们就可以直接用现成的缓存中的task_struct了。</p><p>我们来仔细看看，缓存区struct kmem_cache到底是什么样子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct kmem_cache {</span></span>
<span class="line"><span>	struct kmem_cache_cpu __percpu *cpu_slab;</span></span>
<span class="line"><span>	/* Used for retriving partial slabs etc */</span></span>
<span class="line"><span>	unsigned long flags;</span></span>
<span class="line"><span>	unsigned long min_partial;</span></span>
<span class="line"><span>	int size;		/* The size of an object including meta data */</span></span>
<span class="line"><span>	int object_size;	/* The size of an object without meta data */</span></span>
<span class="line"><span>	int offset;		/* Free pointer offset. */</span></span>
<span class="line"><span>#ifdef CONFIG_SLUB_CPU_PARTIAL</span></span>
<span class="line"><span>	int cpu_partial;	/* Number of per cpu partial objects to keep around */</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	struct kmem_cache_order_objects oo;</span></span>
<span class="line"><span>	/* Allocation and freeing of slabs */</span></span>
<span class="line"><span>	struct kmem_cache_order_objects max;</span></span>
<span class="line"><span>	struct kmem_cache_order_objects min;</span></span>
<span class="line"><span>	gfp_t allocflags;	/* gfp flags to use on each alloc */</span></span>
<span class="line"><span>	int refcount;		/* Refcount for slab cache destroy */</span></span>
<span class="line"><span>	void (*ctor)(void *);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	const char *name;	/* Name (only for display!) */</span></span>
<span class="line"><span>	struct list_head list;	/* List of slab caches */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct kmem_cache_node *node[MAX_NUMNODES];</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在struct kmem_cache里面，有个变量struct list_head list，这个结构我们已经看到过多次了。我们可以想象一下，对于操作系统来讲，要创建和管理的缓存绝对不止task_struct。难道mm_struct就不需要吗？fs_struct就不需要吗？都需要。因此，所有的缓存最后都会放在一个链表里面，也就是LIST_HEAD(slab_caches)。</p><p>对于缓存来讲，其实就是分配了连续几页的大内存块，然后根据缓存对象的大小，切成小内存块。</p><p>所以，我们这里有三个kmem_cache_order_objects类型的变量。这里面的order，就是2的order次方个页面的大内存块，objects就是能够存放的缓存对象的数量。</p><p>最终，我们将大内存块切分成小内存块，样子就像下面这样。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/172839800c8d51c49b67ec8c4d07315e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/172839800c8d51c49b67ec8c4d07315e.jpeg" alt=""></a></p><p>每一项的结构都是缓存对象后面跟一个下一个空闲对象的指针，这样非常方便将所有的空闲对象链成一个链。其实，这就相当于咱们数据结构里面学的，用数组实现一个可随机插入和删除的链表。</p><p>所以，这里面就有三个变量：size是包含这个指针的大小，object_size是纯对象的大小，offset就是把下一个空闲对象的指针存放在这一项里的偏移量。</p><p>那这些缓存对象哪些被分配了、哪些在空着，什么情况下整个大内存块都被分配完了，需要向伙伴系统申请几个页形成新的大内存块？这些信息该由谁来维护呢？</p><p>接下来就是最重要的两个成员变量出场的时候了。kmem_cache_cpu和kmem_cache_node，它们都是每个NUMA节点上有一个，我们只需要看一个节点里面的情况。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/45f38a0c7bce8c98881bbe8b8b4c190a.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/45f38a0c7bce8c98881bbe8b8b4c190a.jpeg" alt=""></a></p><p>在分配缓存块的时候，要分两种路径， <strong>fast path</strong> 和 <strong>slow path</strong>，也就是 <strong>快速通道</strong> 和 <strong>普通通道</strong>。其中kmem_cache_cpu就是快速通道，kmem_cache_node是普通通道。每次分配的时候，要先从kmem_cache_cpu进行分配。如果kmem_cache_cpu里面没有空闲的块，那就到kmem_cache_node中进行分配；如果还是没有空闲的块，才去伙伴系统分配新的页。</p><p>我们来看一下，kmem_cache_cpu里面是如何存放缓存块的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct kmem_cache_cpu {</span></span>
<span class="line"><span>	void **freelist;	/* Pointer to next available object */</span></span>
<span class="line"><span>	unsigned long tid;	/* Globally unique transaction id */</span></span>
<span class="line"><span>	struct page *page;	/* The slab from which we are allocating */</span></span>
<span class="line"><span>#ifdef CONFIG_SLUB_CPU_PARTIAL</span></span>
<span class="line"><span>	struct page *partial;	/* Partially allocated frozen slabs */</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在这里，page指向大内存块的第一个页，缓存块就是从里面分配的。freelist指向大内存块里面第一个空闲的项。按照上面说的，这一项会有指针指向下一个空闲的项，最终所有空闲的项会形成一个链表。</p><p>partial指向的也是大内存块的第一个页，之所以名字叫partial（部分），就是因为它里面部分被分配出去了，部分是空的。这是一个备用列表，当page满了，就会从这里找。</p><p>我们再来看kmem_cache_node的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct kmem_cache_node {</span></span>
<span class="line"><span>	spinlock_t list_lock;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>#ifdef CONFIG_SLUB</span></span>
<span class="line"><span>	unsigned long nr_partial;</span></span>
<span class="line"><span>	struct list_head partial;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这里面也有一个partial，是一个链表。这个链表里存放的是部分空闲的内存块。这是kmem_cache_cpu里面的partial的备用列表，如果那里没有，就到这里来找。</p><p>下面我们就来看看这个分配过程。kmem_cache_alloc_node会调用slab_alloc_node。你还是先重点看这里面的注释，这里面说的就是快速通道和普通通道的概念。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Inlined fastpath so that allocation functions (kmalloc, kmem_cache_alloc)</span></span>
<span class="line"><span> * have the fastpath folded into their functions. So no function call</span></span>
<span class="line"><span> * overhead for requests that can be satisfied on the fastpath.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * The fastpath works by first checking if the lockless freelist can be used.</span></span>
<span class="line"><span> * If not then __slab_alloc is called for slow processing.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Otherwise we can simply pick the next object from the lockless free list.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static __always_inline void *slab_alloc_node(struct kmem_cache *s,</span></span>
<span class="line"><span>		gfp_t gfpflags, int node, unsigned long addr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	void *object;</span></span>
<span class="line"><span>	struct kmem_cache_cpu *c;</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>	unsigned long tid;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tid = this_cpu_read(s-&amp;gt;cpu_slab-&amp;gt;tid);</span></span>
<span class="line"><span>	c = raw_cpu_ptr(s-&amp;gt;cpu_slab);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	object = c-&amp;gt;freelist;</span></span>
<span class="line"><span>	page = c-&amp;gt;page;</span></span>
<span class="line"><span>	if (unlikely(!object || !node_match(page, node))) {</span></span>
<span class="line"><span>		object = __slab_alloc(s, gfpflags, node, addr, c);</span></span>
<span class="line"><span>		stat(s, ALLOC_SLOWPATH);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return object;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>快速通道很简单，取出cpu_slab也即kmem_cache_cpu的freelist，这就是第一个空闲的项，可以直接返回了。如果没有空闲的了，则只好进入普通通道，调用__slab_alloc。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void *___slab_alloc(struct kmem_cache *s, gfp_t gfpflags, int node,</span></span>
<span class="line"><span>			  unsigned long addr, struct kmem_cache_cpu *c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	void *freelist;</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>redo:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* must check again c-&amp;gt;freelist in case of cpu migration or IRQ */</span></span>
<span class="line"><span>	freelist = c-&amp;gt;freelist;</span></span>
<span class="line"><span>	if (freelist)</span></span>
<span class="line"><span>		goto load_freelist;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	freelist = get_freelist(s, page);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!freelist) {</span></span>
<span class="line"><span>		c-&amp;gt;page = NULL;</span></span>
<span class="line"><span>		stat(s, DEACTIVATE_BYPASS);</span></span>
<span class="line"><span>		goto new_slab;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>load_freelist:</span></span>
<span class="line"><span>	c-&amp;gt;freelist = get_freepointer(s, freelist);</span></span>
<span class="line"><span>	c-&amp;gt;tid = next_tid(c-&amp;gt;tid);</span></span>
<span class="line"><span>	return freelist;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>new_slab:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (slub_percpu_partial(c)) {</span></span>
<span class="line"><span>		page = c-&amp;gt;page = slub_percpu_partial(c);</span></span>
<span class="line"><span>		slub_set_percpu_partial(c, page);</span></span>
<span class="line"><span>		stat(s, CPU_PARTIAL_ALLOC);</span></span>
<span class="line"><span>		goto redo;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	freelist = new_slab_objects(s, gfpflags, node, &amp;c);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return freeli</span></span></code></pre></div><p>在这里，我们首先再次尝试一下kmem_cache_cpu的freelist。为什么呢？万一当前进程被中断，等回来的时候，别人已经释放了一些缓存，说不定又有空间了呢。如果找到了，就跳到load_freelist，在这里将freelist指向下一个空闲项，返回就可以了。</p><p>如果freelist还是没有，则跳到new_slab里面去。这里面我们先去kmem_cache_cpu的partial里面看。如果partial不是空的，那就将kmem_cache_cpu的page，也就是快速通道的那一大块内存，替换为partial里面的大块内存。然后redo，重新试下。这次应该就可以成功了。</p><p>如果真的还不行，那就要到new_slab_objects了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void *new_slab_objects(struct kmem_cache *s, gfp_t flags,</span></span>
<span class="line"><span>			int node, struct kmem_cache_cpu **pc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	void *freelist;</span></span>
<span class="line"><span>	struct kmem_cache_cpu *c = *pc;</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	freelist = get_partial(s, flags, node, c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (freelist)</span></span>
<span class="line"><span>		return freelist;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	page = new_slab(s, flags, node);</span></span>
<span class="line"><span>	if (page) {</span></span>
<span class="line"><span>		c = raw_cpu_ptr(s-&amp;gt;cpu_slab);</span></span>
<span class="line"><span>		if (c-&amp;gt;page)</span></span>
<span class="line"><span>			flush_slab(s, c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		freelist = page-&amp;gt;freelist;</span></span>
<span class="line"><span>		page-&amp;gt;freelist = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		stat(s, ALLOC_SLAB);</span></span>
<span class="line"><span>		c-&amp;gt;page = page;</span></span>
<span class="line"><span>		*pc = c;</span></span>
<span class="line"><span>	} else</span></span>
<span class="line"><span>		freelist = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return freelis</span></span></code></pre></div><p>在这里面，get_partial会根据node id，找到相应的kmem_cache_node，然后调用get_partial_node，开始在这个节点进行分配。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Try to allocate a partial slab from a specific node.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static void *get_partial_node(struct kmem_cache *s, struct kmem_cache_node *n,</span></span>
<span class="line"><span>				struct kmem_cache_cpu *c, gfp_t flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct page *page, *page2;</span></span>
<span class="line"><span>	void *object = NULL;</span></span>
<span class="line"><span>	int available = 0;</span></span>
<span class="line"><span>	int objects;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	list_for_each_entry_safe(page, page2, &amp;n-&amp;gt;partial, lru) {</span></span>
<span class="line"><span>		void *t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		t = acquire_slab(s, n, page, object == NULL, &amp;objects);</span></span>
<span class="line"><span>		if (!t)</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		available += objects;</span></span>
<span class="line"><span>		if (!object) {</span></span>
<span class="line"><span>			c-&amp;gt;page = page;</span></span>
<span class="line"><span>			stat(s, ALLOC_FROM_PARTIAL);</span></span>
<span class="line"><span>			object = t;</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			put_cpu_partial(s, page, 0);</span></span>
<span class="line"><span>			stat(s, CPU_PARTIAL_NODE);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		if (!kmem_cache_has_cpu_partial(s)</span></span>
<span class="line"><span>			|| available &amp;gt; slub_cpu_partial(s) / 2)</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return object;</span></span></code></pre></div><p>acquire_slab会从kmem_cache_node的partial链表中拿下一大块内存来，并且将freelist，也就是第一块空闲的缓存块，赋值给t。并且当第一轮循环的时候，将kmem_cache_cpu的page指向取下来的这一大块内存，返回的object就是这块内存里面的第一个缓存块t。如果kmem_cache_cpu也有一个partial，就会进行第二轮，再次取下一大块内存来，这次调用put_cpu_partial，放到kmem_cache_cpu的partial里面。</p><p>如果kmem_cache_node里面也没有空闲的内存，这就说明原来分配的页里面都放满了，就要回到new_slab_objects函数，里面new_slab函数会调用allocate_slab。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct page *allocate_slab(struct kmem_cache *s, gfp_t flags, int node)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>	struct kmem_cache_order_objects oo = s-&amp;gt;oo;</span></span>
<span class="line"><span>	gfp_t alloc_gfp;</span></span>
<span class="line"><span>	void *start, *p;</span></span>
<span class="line"><span>	int idx, order;</span></span>
<span class="line"><span>	bool shuffle;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	flags &amp;= gfp_allowed_mask;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	page = alloc_slab_page(s, alloc_gfp, node, oo);</span></span>
<span class="line"><span>	if (unlikely(!page)) {</span></span>
<span class="line"><span>		oo = s-&amp;gt;min;</span></span>
<span class="line"><span>		alloc_gfp = flags;</span></span>
<span class="line"><span>		/*</span></span>
<span class="line"><span>		 * Allocation may have failed due to fragmentation.</span></span>
<span class="line"><span>		 * Try a lower order alloc if possible</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		page = alloc_slab_page(s, alloc_gfp, node, oo);</span></span>
<span class="line"><span>		if (unlikely(!page))</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span>		stat(s, ORDER_FALLBACK);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return page;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，我们看到了alloc_slab_page分配页面。分配的时候，要按kmem_cache_order_objects里面的order来。如果第一次分配不成功，说明内存已经很紧张了，那就换成min版本的kmem_cache_order_objects。</p><p>好了，这个复杂的层层分配机制，我们就讲到这里，你理解到这里也就够用了。</p><h2 id="页面换出" tabindex="-1">页面换出 <a class="header-anchor" href="#页面换出" aria-label="Permalink to &quot;页面换出&quot;">​</a></h2><p>另一个物理内存管理必须要处理的事情就是，页面换出。每个进程都有自己的虚拟地址空间，无论是32位还是64位，虚拟地址空间都非常大，物理内存不可能有这么多的空间放得下。所以，一般情况下，页面只有在被使用的时候，才会放在物理内存中。如果过了一段时间不被使用，即便用户进程并没有释放它，物理内存管理也有责任做一定的干预。例如，将这些物理内存中的页面换出到硬盘上去；将空出的物理内存，交给活跃的进程去使用。</p><p>什么情况下会触发页面换出呢？</p><p>可以想象，最常见的情况就是，分配内存的时候，发现没有地方了，就试图回收一下。例如，咱们解析申请一个页面的时候，会调用get_page_from_freelist，接下来的调用链为get_page_from_freelist-&gt;node_reclaim-&gt;__node_reclaim-&gt;shrink_node，通过这个调用链可以看出，页面换出也是以内存节点为单位的。</p><p>当然还有一种情况，就是作为内存管理系统应该主动去做的，而不能等真的出了事儿再做，这就是内核线程 <strong>kswapd</strong>。这个内核线程，在系统初始化的时候就被创建。这样它会进入一个无限循环，直到系统停止。在这个循环中，如果内存使用没有那么紧张，那它就可以放心睡大觉；如果内存紧张了，就需要去检查一下内存，看看是否需要换出一些内存页。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * The background pageout daemon, started as a kernel thread</span></span>
<span class="line"><span> * from the init process.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * This basically trickles out pages so that we have _some_</span></span>
<span class="line"><span> * free memory available even if there is no other activity</span></span>
<span class="line"><span> * that frees anything up. This is needed for things like routing</span></span>
<span class="line"><span> * etc, where we otherwise might have all activity going on in</span></span>
<span class="line"><span> * asynchronous contexts that cannot page things out.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * If there are applications that are active memory-allocators</span></span>
<span class="line"><span> * (most normal use), this basically shouldn&#39;t matter.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static int kswapd(void *p)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned int alloc_order, reclaim_order;</span></span>
<span class="line"><span>	unsigned int classzone_idx = MAX_NR_ZONES - 1;</span></span>
<span class="line"><span>	pg_data_t *pgdat = (pg_data_t*)p;</span></span>
<span class="line"><span>	struct task_struct *tsk = current;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for ( ; ; ) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        kswapd_try_to_sleep(pgdat, alloc_order, reclaim_order,</span></span>
<span class="line"><span>					classzone_idx);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        reclaim_order = balance_pgdat(pgdat, alloc_order, classzone_idx);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的调用链是balance_pgdat-&gt;kswapd_shrink_node-&gt;shrink_node，是以内存节点为单位的，最后也是调用shrink_node。</p><p>shrink_node会调用shrink_node_memcg。这里面有一个循环处理页面的列表，看这个函数的注释，其实和上面我们想表达的内存换出是一样的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * This is a basic per-node page freer.  Used by both kswapd and direct reclaim.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static void shrink_node_memcg(struct pglist_data *pgdat, struct mem_cgroup *memcg,</span></span>
<span class="line"><span>			      struct scan_control *sc, unsigned long *lru_pages)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	unsigned long nr[NR_LRU_LISTS];</span></span>
<span class="line"><span>	enum lru_list lru;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	while (nr[LRU_INACTIVE_ANON] || nr[LRU_ACTIVE_FILE] ||</span></span>
<span class="line"><span>					nr[LRU_INACTIVE_FILE]) {</span></span>
<span class="line"><span>		unsigned long nr_anon, nr_file, percentage;</span></span>
<span class="line"><span>		unsigned long nr_scanned;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		for_each_evictable_lru(lru) {</span></span>
<span class="line"><span>			if (nr[lru]) {</span></span>
<span class="line"><span>				nr_to_scan = min(nr[lru], SWAP_CLUSTER_MAX);</span></span>
<span class="line"><span>				nr[lru] -= nr_to_scan;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>				nr_reclaimed += shrink_list(lru, nr_to_scan,</span></span>
<span class="line"><span>							    lruvec, memcg, sc);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>这里面有个lru列表。从下面的定义，我们可以想象，所有的页面都被挂在LRU列表中。LRU是Least Recent Use，也就是最近最少使用。也就是说，这个列表里面会按照活跃程度进行排序，这样就容易把不怎么用的内存页拿出来做处理。</p><p>内存页总共分两类，一类是 <strong>匿名页</strong>，和虚拟地址空间进行关联；一类是 <strong>内存映射</strong>，不但和虚拟地址空间关联，还和文件管理关联。</p><p>它们每一类都有两个列表，一个是active，一个是inactive。顾名思义，active就是比较活跃的，inactive就是不怎么活跃的。这两个里面的页会变化，过一段时间，活跃的可能变为不活跃，不活跃的可能变为活跃。如果要换出内存，那就是从不活跃的列表中找出最不活跃的，换出到硬盘上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum lru_list {</span></span>
<span class="line"><span>	LRU_INACTIVE_ANON = LRU_BASE,</span></span>
<span class="line"><span>	LRU_ACTIVE_ANON = LRU_BASE + LRU_ACTIVE,</span></span>
<span class="line"><span>	LRU_INACTIVE_FILE = LRU_BASE + LRU_FILE,</span></span>
<span class="line"><span>	LRU_ACTIVE_FILE = LRU_BASE + LRU_FILE + LRU_ACTIVE,</span></span>
<span class="line"><span>	LRU_UNEVICTABLE,</span></span>
<span class="line"><span>	NR_LRU_LISTS</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define for_each_evictable_lru(lru) for (lru = 0; lru &amp;lt;= LRU_ACTIVE_FILE; lru++)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static unsigned long shrink_list(enum lru_list lru, unsigned long nr_to_scan,</span></span>
<span class="line"><span>				 struct lruvec *lruvec, struct mem_cgroup *memcg,</span></span>
<span class="line"><span>				 struct scan_control *sc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (is_active_lru(lru)) {</span></span>
<span class="line"><span>		if (inactive_list_is_low(lruvec, is_file_lru(lru),</span></span>
<span class="line"><span>					 memcg, sc, true))</span></span>
<span class="line"><span>			shrink_active_list(nr_to_scan, lruvec, sc, lru);</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return shrink_inactive_list(nr_to_scan, lruvec, sc, lru);</span></span></code></pre></div><p>从上面的代码可以看出，shrink_list会先缩减活跃页面列表，再压缩不活跃的页面列表。对于不活跃列表的缩减，shrink_inactive_list就需要对页面进行回收；对于匿名页来讲，需要分配swap，将内存页写入文件系统；对于内存映射关联了文件的，我们需要将在内存中对于文件的修改写回到文件中。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>好了，对于物理内存的管理就讲到这里了，我们来总结一下。对于物理内存来讲，从下层到上层的关系及分配模式如下：</p><ul><li><p>物理内存分NUMA节点，分别进行管理；</p></li><li><p>每个NUMA节点分成多个内存区域；</p></li><li><p>每个内存区域分成多个物理页面；</p></li><li><p>伙伴系统将多个连续的页面作为一个大的内存块分配给上层；</p></li><li><p>kswapd负责物理页面的换入换出；</p></li><li><p>Slub Allocator将从伙伴系统申请的大内存块切成小块，分配给其他系统。</p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/527e5c861fd06c6eb61a761e4214ba54.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/527e5c861fd06c6eb61a761e4214ba54.jpeg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>内存的换入和换出涉及swap分区，那你知道如何检查当前swap分区情况，如何启用和关闭swap区域，如何调整swappiness吗？</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/96623/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,67)])])}const g=a(t,[["render",l]]);export{d as __pageData,g as default};
