import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const o=JSON.parse('{"title":"25 | 用户态内存映射：如何找到正确的会议室？","description":"","frontmatter":{},"headers":[{"level":2,"title":"mmap的原理","slug":"mmap的原理","link":"#mmap的原理","children":[]},{"level":2,"title":"用户态缺页异常","slug":"用户态缺页异常","link":"#用户态缺页异常","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/25-用户态内存映射：如何找到正确的会议室？.md","filePath":"趣谈Linux操作系统/25-用户态内存映射：如何找到正确的会议室？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/25-用户态内存映射：如何找到正确的会议室？.md"};function l(i,a,c,m,r,_){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_25-用户态内存映射-如何找到正确的会议室" tabindex="-1">25 | 用户态内存映射：如何找到正确的会议室？ <a class="header-anchor" href="#_25-用户态内存映射-如何找到正确的会议室" aria-label="Permalink to &quot;25 | 用户态内存映射：如何找到正确的会议室？&quot;">​</a></h1><p>前面几节，我们既看了虚拟内存空间如何组织的，也看了物理页面如何管理的。现在我们需要一些数据结构，将二者关联起来。</p><h2 id="mmap的原理" tabindex="-1">mmap的原理 <a class="header-anchor" href="#mmap的原理" aria-label="Permalink to &quot;mmap的原理&quot;">​</a></h2><p>在虚拟地址空间那一节，我们知道，每一个进程都有一个列表vm_area_struct，指向虚拟地址空间的不同的内存块，这个变量的名字叫 <strong>mmap</strong>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct mm_struct {</span></span>
<span class="line"><span>	struct vm_area_struct *mmap;		/* list of VMAs */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct vm_area_struct {</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * For areas with an address space and backing store,</span></span>
<span class="line"><span>	 * linkage into the address_space-&amp;gt;i_mmap interval tree.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct {</span></span>
<span class="line"><span>		struct rb_node rb;</span></span>
<span class="line"><span>		unsigned long rb_subtree_last;</span></span>
<span class="line"><span>	} shared;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * A file&#39;s MAP_PRIVATE vma can be in both i_mmap tree and anon_vma</span></span>
<span class="line"><span>	 * list, after a COW of one of the file pages.	A MAP_SHARED vma</span></span>
<span class="line"><span>	 * can only be in the i_mmap tree.  An anonymous MAP_PRIVATE, stack</span></span>
<span class="line"><span>	 * or brk vma (with NULL file) can only be in an anon_vma list.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct list_head anon_vma_chain; /* Serialized by mmap_sem &amp;</span></span>
<span class="line"><span>					  * page_table_lock */</span></span>
<span class="line"><span>	struct anon_vma *anon_vma;	/* Serialized by page_table_lock */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Function pointers to deal with this struct. */</span></span>
<span class="line"><span>	const struct vm_operations_struct *vm_ops;</span></span>
<span class="line"><span>	/* Information about our backing store: */</span></span>
<span class="line"><span>	unsigned long vm_pgoff;		/* Offset (within vm_file) in PAGE_SIZE</span></span>
<span class="line"><span>					   units */</span></span>
<span class="line"><span>	struct file * vm_file;		/* File we map to (can be NULL). */</span></span>
<span class="line"><span>	void * vm_private_data;		/* was vm_pte (shared mem) */</span></span></code></pre></div><p>其实内存映射不仅仅是物理内存和虚拟内存之间的映射，还包括将文件中的内容映射到虚拟内存空间。这个时候，访问内存空间就能够访问到文件里面的数据。而仅有物理内存和虚拟内存的映射，是一种特殊情况。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/f0dcb83fcaa4f185a8e36c9d28f12345.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/f0dcb83fcaa4f185a8e36c9d28f12345.jpg" alt=""></a></p><p>前面咱们讲堆的时候讲过，如果我们要申请小块内存，就用brk。brk函数之前已经解析过了，这里就不多说了。如果申请一大块内存，就要用mmap。对于堆的申请来讲，mmap是映射内存空间到物理内存。</p><p>另外，如果一个进程想映射一个文件到自己的虚拟内存空间，也要通过mmap系统调用。这个时候mmap是映射内存空间到物理内存再到文件。可见mmap这个系统调用是核心，我们现在来看mmap这个系统调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE6(mmap, unsigned long, addr, unsigned long, len,</span></span>
<span class="line"><span>                unsigned long, prot, unsigned long, flags,</span></span>
<span class="line"><span>                unsigned long, fd, unsigned long, off)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        error = sys_mmap_pgoff(addr, len, prot, flags, fd, off &amp;gt;&amp;gt; PAGE_SHIFT);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYSCALL_DEFINE6(mmap_pgoff, unsigned long, addr, unsigned long, len,</span></span>
<span class="line"><span>		unsigned long, prot, unsigned long, flags,</span></span>
<span class="line"><span>		unsigned long, fd, unsigned long, pgoff)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file = fget(fd);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	retval = vm_mmap_pgoff(file, addr, len, prot, flags, pgoff);</span></span>
<span class="line"><span>	return retval;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果要映射到文件，fd会传进来一个文件描述符，并且mmap_pgoff里面通过fget函数，根据文件描述符获得struct file。struct file表示打开的一个文件。</p><p>接下来的调用链是vm_mmap_pgoff-&gt;do_mmap_pgoff-&gt;do_mmap。这里面主要干了两件事情：</p><ul><li><p>调用get_unmapped_area找到一个没有映射的区域；</p></li><li><p>调用mmap_region映射这个区域。</p></li></ul><p>我们先来看get_unmapped_area函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unsigned long</span></span>
<span class="line"><span>get_unmapped_area(struct file *file, unsigned long addr, unsigned long len,</span></span>
<span class="line"><span>		unsigned long pgoff, unsigned long flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned long (*get_area)(struct file *, unsigned long,</span></span>
<span class="line"><span>				  unsigned long, unsigned long, unsigned long);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	get_area = current-&amp;gt;mm-&amp;gt;get_unmapped_area;</span></span>
<span class="line"><span>	if (file) {</span></span>
<span class="line"><span>		if (file-&amp;gt;f_op-&amp;gt;get_unmapped_area)</span></span>
<span class="line"><span>			get_area = file-&amp;gt;f_op-&amp;gt;get_unmapped_area;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面如果是匿名映射，则调用mm_struct里面的get_unmapped_area函数。这个函数其实是arch_get_unmapped_area。它会调用find_vma_prev，在表示虚拟内存区域的vm_area_struct红黑树上找到相应的位置。之所以叫prev，是说这个时候虚拟内存区域还没有建立，找到前一个vm_area_struct。</p><p>如果不是匿名映射，而是映射到一个文件，这样在Linux里面，每个打开的文件都有一个struct file结构，里面有一个file_operations，用来表示和这个文件相关的操作。如果是我们熟知的ext4文件系统，调用的是thp_get_unmapped_area。如果我们仔细看这个函数，最终还是调用mm_struct里面的get_unmapped_area函数。殊途同归。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct file_operations ext4_file_operations = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        .mmap           = ext4_file_mmap</span></span>
<span class="line"><span>        .get_unmapped_area = thp_get_unmapped_area,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>unsigned long __thp_get_unmapped_area(struct file *filp, unsigned long len,</span></span>
<span class="line"><span>                loff_t off, unsigned long flags, unsigned long size)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        unsigned long addr;</span></span>
<span class="line"><span>        loff_t off_end = off + len;</span></span>
<span class="line"><span>        loff_t off_align = round_up(off, size);</span></span>
<span class="line"><span>        unsigned long len_pad;</span></span>
<span class="line"><span>        len_pad = len + size;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        addr = current-&amp;gt;mm-&amp;gt;get_unmapped_area(filp, 0, len_pad,</span></span>
<span class="line"><span>                                              off &amp;gt;&amp;gt; PAGE_SHIFT, flags);</span></span>
<span class="line"><span>        addr += (off - addr) &amp; (size - 1);</span></span>
<span class="line"><span>        return addr;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再来看mmap_region，看它如何映射这个虚拟内存区域。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unsigned long mmap_region(struct file *file, unsigned long addr,</span></span>
<span class="line"><span>		unsigned long len, vm_flags_t vm_flags, unsigned long pgoff,</span></span>
<span class="line"><span>		struct list_head *uf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct mm_struct *mm = current-&amp;gt;mm;</span></span>
<span class="line"><span>	struct vm_area_struct *vma, *prev;</span></span>
<span class="line"><span>	struct rb_node **rb_link, *rb_parent;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * Can we just expand an old mapping?</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	vma = vma_merge(mm, prev, addr, addr + len, vm_flags,</span></span>
<span class="line"><span>			NULL, file, pgoff, NULL, NULL_VM_UFFD_CTX);</span></span>
<span class="line"><span>	if (vma)</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * Determine the object being mapped and call the appropriate</span></span>
<span class="line"><span>	 * specific mapper. the address has already been validated, but</span></span>
<span class="line"><span>	 * not unmapped, but the maps are removed from the list.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	vma = kmem_cache_zalloc(vm_area_cachep, GFP_KERNEL);</span></span>
<span class="line"><span>	if (!vma) {</span></span>
<span class="line"><span>		error = -ENOMEM;</span></span>
<span class="line"><span>		goto unacct_error;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	vma-&amp;gt;vm_mm = mm;</span></span>
<span class="line"><span>	vma-&amp;gt;vm_start = addr;</span></span>
<span class="line"><span>	vma-&amp;gt;vm_end = addr + len;</span></span>
<span class="line"><span>	vma-&amp;gt;vm_flags = vm_flags;</span></span>
<span class="line"><span>	vma-&amp;gt;vm_page_prot = vm_get_page_prot(vm_flags);</span></span>
<span class="line"><span>	vma-&amp;gt;vm_pgoff = pgoff;</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;vma-&amp;gt;anon_vma_chain);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (file) {</span></span>
<span class="line"><span>		vma-&amp;gt;vm_file = get_file(file);</span></span>
<span class="line"><span>		error = call_mmap(file, vma);</span></span>
<span class="line"><span>		addr = vma-&amp;gt;vm_start;</span></span>
<span class="line"><span>		vm_flags = vma-&amp;gt;vm_flags;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vma_link(mm, vma, prev, rb_link, rb_parent);</span></span>
<span class="line"><span>	return addr;</span></span>
<span class="line"><span>.....</span></span></code></pre></div><p>还记得咱们刚找到了虚拟内存区域的前一个vm_area_struct，我们首先要看，是否能够基于它进行扩展，也即调用vma_merge，和前一个vm_area_struct合并到一起。</p><p>如果不能，就需要调用kmem_cache_zalloc，在Slub里面创建一个新的vm_area_struct对象，设置起始和结束位置，将它加入队列。如果是映射到文件，则设置vm_file为目标文件，调用call_mmap。其实就是调用file_operations的mmap函数。对于ext4文件系统，调用的是ext4_file_mmap。从这个函数的参数可以看出，这一刻文件和内存开始发生关系了。这里我们将vm_area_struct的内存操作设置为文件系统操作，也就是说，读写内存其实就是读写文件系统。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int call_mmap(struct file *file, struct vm_area_struct *vma)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return file-&amp;gt;f_op-&amp;gt;mmap(file, vma);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int ext4_file_mmap(struct file *file, struct vm_area_struct *vma)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>      vma-&amp;gt;vm_ops = &amp;ext4_file_vm_ops;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再回到mmap_region函数。最终，vma_link函数将新创建的vm_area_struct挂在了mm_struct里面的红黑树上。</p><p>这个时候，从内存到文件的映射关系，至少要在逻辑层面建立起来。那从文件到内存的映射关系呢？vma_link还做了另外一件事情，就是__vma_link_file。这个东西要用于建立这层映射关系。</p><p>对于打开的文件，会有一个结构struct file来表示。它有个成员指向struct address_space结构，这里面有棵变量名为i_mmap的红黑树，vm_area_struct就挂在这棵树上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct address_space {</span></span>
<span class="line"><span>	struct inode		*host;		/* owner: inode, block_device */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct rb_root		i_mmap;		/* tree of private and shared mappings */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	const struct address_space_operations *a_ops;	/* methods */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void __vma_link_file(struct vm_area_struct *vma)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	file = vma-&amp;gt;vm_file;</span></span>
<span class="line"><span>	if (file) {</span></span>
<span class="line"><span>		struct address_space *mapping = file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>		vma_interval_tree_insert(vma, &amp;mapping-&amp;gt;i_mmap);</span></span>
<span class="line"><span>	}</span></span></code></pre></div><p>到这里，内存映射的内容要告一段落了。你可能会困惑，好像还没和物理内存发生任何关系，还是在虚拟内存里面折腾呀？</p><p>对的，因为到目前为止，我们还没有开始真正访问内存呀！这个时候，内存管理并不直接分配物理内存，因为物理内存相对于虚拟地址空间太宝贵了，只有等你真正用的那一刻才会开始分配。</p><h2 id="用户态缺页异常" tabindex="-1">用户态缺页异常 <a class="header-anchor" href="#用户态缺页异常" aria-label="Permalink to &quot;用户态缺页异常&quot;">​</a></h2><p>一旦开始访问虚拟内存的某个地址，如果我们发现，并没有对应的物理页，那就触发缺页中断，调用do_page_fault。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>dotraplinkage void notrace</span></span>
<span class="line"><span>do_page_fault(struct pt_regs *regs, unsigned long error_code)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned long address = read_cr2(); /* Get the faulting address */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	__do_page_fault(regs, error_code, address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * This routine handles page faults.  It determines the address,</span></span>
<span class="line"><span> * and the problem, and then passes it off to one of the appropriate</span></span>
<span class="line"><span> * routines.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static noinline void</span></span>
<span class="line"><span>__do_page_fault(struct pt_regs *regs, unsigned long error_code,</span></span>
<span class="line"><span>		unsigned long address)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vm_area_struct *vma;</span></span>
<span class="line"><span>	struct task_struct *tsk;</span></span>
<span class="line"><span>	struct mm_struct *mm;</span></span>
<span class="line"><span>	tsk = current;</span></span>
<span class="line"><span>	mm = tsk-&amp;gt;mm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (unlikely(fault_in_kernel_space(address))) {</span></span>
<span class="line"><span>		if (vmalloc_fault(address) &amp;gt;= 0)</span></span>
<span class="line"><span>			return;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vma = find_vma(mm, address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	fault = handle_mm_fault(vma, address, flags);</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>在__do_page_fault里面，先要判断缺页中断是否发生在内核。如果发生在内核则调用vmalloc_fault，这就和咱们前面学过的虚拟内存的布局对应上了。在内核里面，vmalloc区域需要内核页表映射到物理页。咱们这里把内核的这部分放放，接着看用户空间的部分。</p><p>接下来在用户空间里面，找到你访问的那个地址所在的区域vm_area_struct，然后调用handle_mm_fault来映射这个区域。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __handle_mm_fault(struct vm_area_struct *vma, unsigned long address,</span></span>
<span class="line"><span>		unsigned int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vm_fault vmf = {</span></span>
<span class="line"><span>		.vma = vma,</span></span>
<span class="line"><span>		.address = address &amp; PAGE_MASK,</span></span>
<span class="line"><span>		.flags = flags,</span></span>
<span class="line"><span>		.pgoff = linear_page_index(vma, address),</span></span>
<span class="line"><span>		.gfp_mask = __get_fault_gfp_mask(vma),</span></span>
<span class="line"><span>	};</span></span>
<span class="line"><span>	struct mm_struct *mm = vma-&amp;gt;vm_mm;</span></span>
<span class="line"><span>	pgd_t *pgd;</span></span>
<span class="line"><span>	p4d_t *p4d;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	pgd = pgd_offset(mm, address);</span></span>
<span class="line"><span>	p4d = p4d_alloc(mm, pgd, address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vmf.pud = pud_alloc(mm, p4d, address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vmf.pmd = pmd_alloc(mm, vmf.pud, address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return handle_pte_fault(&amp;vmf);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，终于看到了我们熟悉的PGD、P4G、PUD、PMD、PTE，这就是前面讲页表的时候，讲述的四级页表的概念，因为暂且不考虑五级页表，我们暂时忽略P4G。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/9b802943af4e3ae80ce4d0d7f2190af1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/9b802943af4e3ae80ce4d0d7f2190af1.jpg" alt=""></a></p><p>pgd_t 用于全局页目录项，pud_t 用于上层页目录项，pmd_t 用于中间页目录项，pte_t 用于直接页表项。</p><p>每个进程都有独立的地址空间，为了这个进程独立完成映射，每个进程都有独立的进程页表，这个页表的最顶级的pgd存放在task_struct中的mm_struct的pgd变量里面。</p><p>在一个进程新创建的时候，会调用fork，对于内存的部分会调用copy_mm，里面调用dup_mm。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Allocate a new mm structure and copy contents from the</span></span>
<span class="line"><span> * mm structure of the passed in task structure.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static struct mm_struct *dup_mm(struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct mm_struct *mm, *oldmm = current-&amp;gt;mm;</span></span>
<span class="line"><span>	mm = allocate_mm();</span></span>
<span class="line"><span>	memcpy(mm, oldmm, sizeof(*mm));</span></span>
<span class="line"><span>	if (!mm_init(mm, tsk, mm-&amp;gt;user_ns))</span></span>
<span class="line"><span>		goto fail_nomem;</span></span>
<span class="line"><span>	err = dup_mmap(mm, oldmm);</span></span>
<span class="line"><span>	return mm;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，除了创建一个新的mm_struct，并且通过memcpy将它和父进程的弄成一模一样之外，我们还需要调用mm_init进行初始化。接下来，mm_init调用mm_alloc_pgd，分配全局页目录项，赋值给mm_struct的pgd成员变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int mm_alloc_pgd(struct mm_struct *mm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	mm-&amp;gt;pgd = pgd_alloc(mm);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>pgd_alloc里面除了分配PGD之外，还做了很重要的一个事情，就是调用pgd_ctor。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void pgd_ctor(struct mm_struct *mm, pgd_t *pgd)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	/* If the pgd points to a shared pagetable level (either the</span></span>
<span class="line"><span>	   ptes in non-PAE, or shared PMD in PAE), then just copy the</span></span>
<span class="line"><span>	   references from swapper_pg_dir. */</span></span>
<span class="line"><span>	if (CONFIG_PGTABLE_LEVELS == 2 ||</span></span>
<span class="line"><span>	    (CONFIG_PGTABLE_LEVELS == 3 &amp;&amp; SHARED_KERNEL_PMD) ||</span></span>
<span class="line"><span>	    CONFIG_PGTABLE_LEVELS &amp;gt;= 4) {</span></span>
<span class="line"><span>		clone_pgd_range(pgd + KERNEL_PGD_BOUNDARY,</span></span>
<span class="line"><span>				swapper_pg_dir + KERNEL_PGD_BOUNDARY,</span></span>
<span class="line"><span>				KERNEL_PGD_PTRS);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>pgd_ctor干了什么事情呢？我们注意看里面的注释，它拷贝了对于swapper_pg_dir的引用。swapper_pg_dir是内核页表的最顶级的全局页目录。</p><p>一个进程的虚拟地址空间包含用户态和内核态两部分。为了从虚拟地址空间映射到物理页面，页表也分为用户地址空间的页表和内核页表，这就和上面遇到的vmalloc有关系了。在内核里面，映射靠内核页表，这里内核页表会拷贝一份到进程的页表。至于swapper_pg_dir是什么，怎么初始化的，怎么工作的，我们还是先放一放，放到下一节统一讨论。</p><p>至此，一个进程fork完毕之后，有了内核页表，有了自己顶级的pgd，但是对于用户地址空间来讲，还完全没有映射过。这需要等到这个进程在某个CPU上运行，并且对内存访问的那一刻了。</p><p>当这个进程被调度到某个CPU上运行的时候，咱们在 <a href="https://time.geekbang.org/column/article/93251" target="_blank" rel="noreferrer">调度</a> 那一节讲过，要调用context_switch进行上下文切换。对于内存方面的切换会调用switch_mm_irqs_off，这里面会调用 load_new_mm_cr3。</p><p>cr3是CPU的一个寄存器，它会指向当前进程的顶级pgd。如果CPU的指令要访问进程的虚拟内存，它就会自动从cr3里面得到pgd在物理内存的地址，然后根据里面的页表解析虚拟内存的地址为物理内存，从而访问真正的物理内存上的数据。</p><p>这里需要注意两点。第一点，cr3里面存放当前进程的顶级pgd，这个是硬件的要求。cr3里面需要存放pgd在物理内存的地址，不能是虚拟地址。因而load_new_mm_cr3里面会使用__pa，将mm_struct里面的成员变量pgd（mm_struct里面存的都是虚拟地址）变为物理地址，才能加载到cr3里面去。</p><p>第二点，用户进程在运行的过程中，访问虚拟内存中的数据，会被cr3里面指向的页表转换为物理地址后，才在物理内存中访问数据，这个过程都是在用户态运行的，地址转换的过程无需进入内核态。</p><p>只有访问虚拟内存的时候，发现没有映射到物理内存，页表也没有创建过，才触发缺页异常。进入内核调用do_page_fault，一直调用到__handle_mm_fault，这才有了上面解析到这个函数的时候，我们看到的代码。既然原来没有创建过页表，那只好补上这一课。于是，__handle_mm_fault调用pud_alloc和pmd_alloc，来创建相应的页目录项，最后调用handle_pte_fault来创建页表项。</p><p>绕了一大圈，终于将页表整个机制的各个部分串了起来。但是咱们的故事还没讲完，物理的内存还没找到。我们还得接着分析handle_pte_fault的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int handle_pte_fault(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	pte_t entry;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vmf-&amp;gt;pte = pte_offset_map(vmf-&amp;gt;pmd, vmf-&amp;gt;address);</span></span>
<span class="line"><span>	vmf-&amp;gt;orig_pte = *vmf-&amp;gt;pte;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (!vmf-&amp;gt;pte) {</span></span>
<span class="line"><span>		if (vma_is_anonymous(vmf-&amp;gt;vma))</span></span>
<span class="line"><span>			return do_anonymous_page(vmf);</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			return do_fault(vmf);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!pte_present(vmf-&amp;gt;orig_pte))</span></span>
<span class="line"><span>		return do_swap_page(vmf);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面总的来说分了三种情况。如果PTE，也就是页表项，从来没有出现过，那就是新映射的页。如果是匿名页，就是第一种情况，应该映射到一个物理内存页，在这里调用的是do_anonymous_page。如果是映射到文件，调用的就是do_fault，这是第二种情况。如果PTE原来出现过，说明原来页面在物理内存中，后来换出到硬盘了，现在应该换回来，调用的是do_swap_page。</p><p>我们来看第一种情况，do_anonymous_page。对于匿名页的映射，我们需要先通过pte_alloc分配一个页表项，然后通过alloc_zeroed_user_highpage_movable分配一个页。之后它会调用alloc_pages_vma，并最终调用__alloc_pages_nodemask。</p><p>这个函数你还记得吗？就是咱们伙伴系统的核心函数，专门用来分配物理页面的。do_anonymous_page接下来要调用mk_pte，将页表项指向新分配的物理页，set_pte_at会将页表项塞到页表里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int do_anonymous_page(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vm_area_struct *vma = vmf-&amp;gt;vma;</span></span>
<span class="line"><span>	struct mem_cgroup *memcg;</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>	int ret = 0;</span></span>
<span class="line"><span>	pte_t entry;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (pte_alloc(vma-&amp;gt;vm_mm, vmf-&amp;gt;pmd, vmf-&amp;gt;address))</span></span>
<span class="line"><span>		return VM_FAULT_OOM;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	page = alloc_zeroed_user_highpage_movable(vma, vmf-&amp;gt;address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	entry = mk_pte(page, vma-&amp;gt;vm_page_prot);</span></span>
<span class="line"><span>	if (vma-&amp;gt;vm_flags &amp; VM_WRITE)</span></span>
<span class="line"><span>		entry = pte_mkwrite(pte_mkdirty(entry));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	vmf-&amp;gt;pte = pte_offset_map_lock(vma-&amp;gt;vm_mm, vmf-&amp;gt;pmd, vmf-&amp;gt;address,</span></span>
<span class="line"><span>			&amp;vmf-&amp;gt;ptl);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	set_pte_at(vma-&amp;gt;vm_mm, vmf-&amp;gt;address, vmf-&amp;gt;pte, entry);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二种情况映射到文件do_fault，最终我们会调用__do_fault。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __do_fault(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vm_area_struct *vma = vmf-&amp;gt;vma;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = vma-&amp;gt;vm_ops-&amp;gt;fault(vmf);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里调用了struct vm_operations_struct vm_ops的fault函数。还记得咱们上面用mmap映射文件的时候，对于ext4文件系统，vm_ops指向了ext4_file_vm_ops，也就是调用了ext4_filemap_fault。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct vm_operations_struct ext4_file_vm_ops = {</span></span>
<span class="line"><span>	.fault		= ext4_filemap_fault,</span></span>
<span class="line"><span>	.map_pages	= filemap_map_pages,</span></span>
<span class="line"><span>	.page_mkwrite   = ext4_page_mkwrite,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int ext4_filemap_fault(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct inode *inode = file_inode(vmf-&amp;gt;vma-&amp;gt;vm_file);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = filemap_fault(vmf);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ext4_filemap_fault里面的逻辑我们很容易就能读懂。vm_file就是咱们当时mmap的时候映射的那个文件，然后我们需要调用filemap_fault。对于文件映射来说，一般这个文件会在物理内存里面有页面作为它的缓存，find_get_page就是找那个页。如果找到了，就调用do_async_mmap_readahead，预读一些数据到内存里面；如果没有，就跳到no_cached_page。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int filemap_fault(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	struct file *file = vmf-&amp;gt;vma-&amp;gt;vm_file;</span></span>
<span class="line"><span>	struct address_space *mapping = file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>	struct inode *inode = mapping-&amp;gt;host;</span></span>
<span class="line"><span>	pgoff_t offset = vmf-&amp;gt;pgoff;</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>	int ret = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	page = find_get_page(mapping, offset);</span></span>
<span class="line"><span>	if (likely(page) &amp;&amp; !(vmf-&amp;gt;flags &amp; FAULT_FLAG_TRIED)) {</span></span>
<span class="line"><span>		do_async_mmap_readahead(vmf-&amp;gt;vma, ra, file, page, offset);</span></span>
<span class="line"><span>	} else if (!page) {</span></span>
<span class="line"><span>		goto no_cached_page;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vmf-&amp;gt;page = page;</span></span>
<span class="line"><span>	return ret | VM_FAULT_LOCKED;</span></span>
<span class="line"><span>no_cached_page:</span></span>
<span class="line"><span>	error = page_cache_read(file, offset, vmf-&amp;gt;gfp_mask);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果没有物理内存中的缓存页，那我们就调用page_cache_read。在这里显示分配一个缓存页，将这一页加到lru表里面，然后在address_space中调用address_space_operations的readpage函数，将文件内容读到内存中。address_space的作用咱们上面也介绍过了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int page_cache_read(struct file *file, pgoff_t offset, gfp_t gfp_mask)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct address_space *mapping = file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	page = __page_cache_alloc(gfp_mask|__GFP_COLD);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = add_to_page_cache_lru(page, mapping, offset, gfp_mask &amp; GFP_KERNEL);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = mapping-&amp;gt;a_ops-&amp;gt;readpage(file, page);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>struct address_space_operations对于ext4文件系统的定义如下所示。这么说来，上面的readpage调用的其实是ext4_readpage。因为我们还没讲到文件系统，这里我们不详细介绍ext4_readpage具体干了什么。你只要知道，最后会调用ext4_read_inline_page，这里面有部分逻辑和内存映射有关就行了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct address_space_operations ext4_aops = {</span></span>
<span class="line"><span>	.readpage		= ext4_readpage,</span></span>
<span class="line"><span>	.readpages		= ext4_readpages,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int ext4_read_inline_page(struct inode *inode, struct page *page)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	void *kaddr;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	kaddr = kmap_atomic(page);</span></span>
<span class="line"><span>	ret = ext4_read_inline_data(inode, kaddr, len, &amp;iloc);</span></span>
<span class="line"><span>	flush_dcache_page(page);</span></span>
<span class="line"><span>	kunmap_atomic(kaddr);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ext4_read_inline_page函数里，我们需要先调用kmap_atomic，将物理内存映射到内核的虚拟地址空间，得到内核中的地址kaddr。 我们在前面提到过kmap_atomic，它是用来做临时内核映射的。本来把物理内存映射到用户虚拟地址空间，不需要在内核里面映射一把。但是，现在因为要从文件里面读取数据并写入这个物理页面，又不能使用物理地址，我们只能使用虚拟地址，这就需要在内核里面临时映射一把。临时映射后，ext4_read_inline_data读取文件到这个虚拟地址。读取完毕后，我们取消这个临时映射kunmap_atomic就行了。</p><p>至于kmap_atomic的具体实现，我们还是放到内核映射部分再讲。</p><p>我们再来看第三种情况，do_swap_page。之前我们讲过物理内存管理，你这里可以回忆一下。如果长时间不用，就要换出到硬盘，也就是swap，现在这部分数据又要访问了，我们还得想办法再次读到内存中来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int do_swap_page(struct vm_fault *vmf)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vm_area_struct *vma = vmf-&amp;gt;vma;</span></span>
<span class="line"><span>	struct page *page, *swapcache;</span></span>
<span class="line"><span>	struct mem_cgroup *memcg;</span></span>
<span class="line"><span>	swp_entry_t entry;</span></span>
<span class="line"><span>	pte_t pte;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	entry = pte_to_swp_entry(vmf-&amp;gt;orig_pte);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	page = lookup_swap_cache(entry);</span></span>
<span class="line"><span>	if (!page) {</span></span>
<span class="line"><span>		page = swapin_readahead(entry, GFP_HIGHUSER_MOVABLE, vma,</span></span>
<span class="line"><span>					vmf-&amp;gt;address);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	swapcache = page;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	pte = mk_pte(page, vma-&amp;gt;vm_page_prot);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	set_pte_at(vma-&amp;gt;vm_mm, vmf-&amp;gt;address, vmf-&amp;gt;pte, pte);</span></span>
<span class="line"><span>	vmf-&amp;gt;orig_pte = pte;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	swap_free(entry);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>do_swap_page函数会先查找swap文件有没有缓存页。如果没有，就调用swapin_readahead，将swap文件读到内存中来，形成内存页，并通过mk_pte生成页表项。set_pte_at将页表项插入页表，swap_free将swap文件清理。因为重新加载回内存了，不再需要swap文件了。</p><p>swapin_readahead会最终调用swap_readpage，在这里，我们看到了熟悉的readpage函数，也就是说读取普通文件和读取swap文件，过程是一样的，同样需要用kmap_atomic做临时映射。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int swap_readpage(struct page *page, bool do_poll)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct bio *bio;</span></span>
<span class="line"><span>	int ret = 0;</span></span>
<span class="line"><span>	struct swap_info_struct *sis = page_swap_info(page);</span></span>
<span class="line"><span>	blk_qc_t qc;</span></span>
<span class="line"><span>	struct block_device *bdev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (sis-&amp;gt;flags &amp; SWP_FILE) {</span></span>
<span class="line"><span>		struct file *swap_file = sis-&amp;gt;swap_file;</span></span>
<span class="line"><span>		struct address_space *mapping = swap_file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>		ret = mapping-&amp;gt;a_ops-&amp;gt;readpage(swap_file, page);</span></span>
<span class="line"><span>		return ret;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过上面复杂的过程，用户态缺页异常处理完毕了。物理内存中有了页面，页表也建立好了映射。接下来，用户程序在虚拟内存空间里面，可以通过虚拟地址顺利经过页表映射的访问物理页面上的数据了。</p><p>为了加快映射速度，我们不需要每次从虚拟地址到物理地址的转换都走一遍页表。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/94efd92cbeb4d4ff155a645b93d71eb3.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/94efd92cbeb4d4ff155a645b93d71eb3.jpg" alt=""></a></p><p>页表一般都很大，只能存放在内存中。操作系统每次访问内存都要折腾两步，先通过查询页表得到物理地址，然后访问该物理地址读取指令、数据。</p><p>为了提高映射速度，我们引入了 <strong>TLB</strong>（Translation Lookaside Buffer），我们经常称为 <strong>快表</strong>，专门用来做地址映射的硬件设备。它不在内存中，可存储的数据比较少，但是比内存要快。所以，我们可以想象，TLB就是页表的Cache，其中存储了当前最可能被访问到的页表项，其内容是部分页表项的一个副本。</p><p>有了TLB之后，地址映射的过程就像图中画的。我们先查块表，块表中有映射关系，然后直接转换为物理地址。如果在TLB查不到映射关系时，才会到内存中查询页表。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>用户态的内存映射机制，我们解析的差不多了，我们来总结一下，用户态的内存映射机制包含以下几个部分。</p><ul><li><p>用户态内存映射函数mmap，包括用它来做匿名映射和文件映射。</p></li><li><p>用户态的页表结构，存储位置在mm_struct中。</p></li><li><p>在用户态访问没有映射的内存会引发缺页异常，分配物理页表、补齐页表。如果是匿名映射则分配物理内存；如果是swap，则将swap文件读入；如果是文件映射，则将文件读入。</p></li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/78d351d0105c8e5bf0e49c685a2c1a44.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/78d351d0105c8e5bf0e49c685a2c1a44.jpg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你可以试着用mmap系统调用，写一个程序来映射一个文件，并读取文件的内容。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/97030/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,90)])])}const g=s(t,[["render",l]]);export{o as __pageData,g as default};
