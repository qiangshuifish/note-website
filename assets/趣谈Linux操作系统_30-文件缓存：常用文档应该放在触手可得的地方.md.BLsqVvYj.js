import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"30 | 文件缓存：常用文档应该放在触手可得的地方","description":"","frontmatter":{},"headers":[{"level":2,"title":"系统调用层和虚拟文件系统层","slug":"系统调用层和虚拟文件系统层","link":"#系统调用层和虚拟文件系统层","children":[]},{"level":2,"title":"ext4文件系统层","slug":"ext4文件系统层","link":"#ext4文件系统层","children":[]},{"level":2,"title":"带缓存的写入操作","slug":"带缓存的写入操作","link":"#带缓存的写入操作","children":[]},{"level":2,"title":"带缓存的读操作","slug":"带缓存的读操作","link":"#带缓存的读操作","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/30-文件缓存：常用文档应该放在触手可得的地方.md","filePath":"趣谈Linux操作系统/30-文件缓存：常用文档应该放在触手可得的地方.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/30-文件缓存：常用文档应该放在触手可得的地方.md"};function i(l,s,c,r,_,o){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_30-文件缓存-常用文档应该放在触手可得的地方" tabindex="-1">30 | 文件缓存：常用文档应该放在触手可得的地方 <a class="header-anchor" href="#_30-文件缓存-常用文档应该放在触手可得的地方" aria-label="Permalink to &quot;30 | 文件缓存：常用文档应该放在触手可得的地方&quot;">​</a></h1><p>上一节，我们讲了文件系统的挂载和文件的打开，并通过打开文件的过程，构建了一个文件管理的整套数据结构体系。其实到这里，我们还没有对文件进行读写，还属于对于元数据的操作。那这一节，我们就重点关注读写。</p><h2 id="系统调用层和虚拟文件系统层" tabindex="-1">系统调用层和虚拟文件系统层 <a class="header-anchor" href="#系统调用层和虚拟文件系统层" aria-label="Permalink to &quot;系统调用层和虚拟文件系统层&quot;">​</a></h2><p>文件系统的读写，其实就是调用系统函数read和write。由于读和写的很多逻辑是相似的，这里我们一起来看一下这个过程。</p><p>下面的代码就是read和write的系统调用，在内核里面的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(read, unsigned int, fd, char __user *, buf, size_t, count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct fd f = fdget_pos(fd);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	loff_t pos = file_pos_read(f.file);</span></span>
<span class="line"><span>	ret = vfs_read(f.file, buf, count, &amp;pos);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYSCALL_DEFINE3(write, unsigned int, fd, const char __user *, buf,</span></span>
<span class="line"><span>		size_t, count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct fd f = fdget_pos(fd);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	loff_t pos = file_pos_read(f.file);</span></span>
<span class="line"><span>    ret = vfs_write(f.file, buf, count, &amp;pos);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于read来讲，里面调用vfs_read-&gt;__vfs_read。对于write来讲，里面调用vfs_write-&gt;__vfs_write。</p><p>下面是__vfs_read和__vfs_write的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ssize_t __vfs_read(struct file *file, char __user *buf, size_t count,</span></span>
<span class="line"><span>		   loff_t *pos)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (file-&amp;gt;f_op-&amp;gt;read)</span></span>
<span class="line"><span>		return file-&amp;gt;f_op-&amp;gt;read(file, buf, count, pos);</span></span>
<span class="line"><span>	else if (file-&amp;gt;f_op-&amp;gt;read_iter)</span></span>
<span class="line"><span>		return new_sync_read(file, buf, count, pos);</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		return -EINVAL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ssize_t __vfs_write(struct file *file, const char __user *p, size_t count,</span></span>
<span class="line"><span>		    loff_t *pos)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (file-&amp;gt;f_op-&amp;gt;write)</span></span>
<span class="line"><span>		return file-&amp;gt;f_op-&amp;gt;write(file, p, count, pos);</span></span>
<span class="line"><span>	else if (file-&amp;gt;f_op-&amp;gt;write_iter)</span></span>
<span class="line"><span>		return new_sync_write(file, p, count, pos);</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		return -EINVAL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上一节，我们讲了，每一个打开的文件，都有一个struct file结构。这里面有一个struct file_operations f_op，用于定义对这个文件做的操作。__vfs_read会调用相应文件系统的file_operations里面的read操作，__vfs_write会调用相应文件系统file_operations里的write操作。</p><h2 id="ext4文件系统层" tabindex="-1">ext4文件系统层 <a class="header-anchor" href="#ext4文件系统层" aria-label="Permalink to &quot;ext4文件系统层&quot;">​</a></h2><p>对于ext4文件系统来讲，内核定义了一个ext4_file_operations。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct file_operations ext4_file_operations = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.read_iter	= ext4_file_read_iter,</span></span>
<span class="line"><span>	.write_iter	= ext4_file_write_iter,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于ext4没有定义read和write函数，于是会调用ext4_file_read_iter和ext4_file_write_iter。</p><p>ext4_file_read_iter会调用generic_file_read_iter，ext4_file_write_iter会调用__generic_file_write_iter。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ssize_t</span></span>
<span class="line"><span>generic_file_read_iter(struct kiocb *iocb, struct iov_iter *iter)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (iocb-&amp;gt;ki_flags &amp; IOCB_DIRECT) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        struct address_space *mapping = file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        retval = mapping-&amp;gt;a_ops-&amp;gt;direct_IO(iocb, iter);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    retval = generic_file_buffered_read(iocb, iter, retval);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ssize_t __generic_file_write_iter(struct kiocb *iocb, struct iov_iter *from)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (iocb-&amp;gt;ki_flags &amp; IOCB_DIRECT) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        written = generic_file_direct_write(iocb, from);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		written = generic_perform_write(file, from, iocb-&amp;gt;ki_pos);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>generic_file_read_iter和__generic_file_write_iter有相似的逻辑，就是要区分是否用缓存。</p><p>缓存其实就是内存中的一块空间。因为内存比硬盘快得多，Linux为了改进性能，有时候会选择不直接操作硬盘，而是读写都在内存中，然后批量读取或者写入硬盘。一旦能够命中内存，读写效率就会大幅度提高。</p><p>因此，根据是否使用内存做缓存，我们可以把文件的I/O操作分为两种类型。</p><p>第一种类型是 <strong>缓存I/O</strong>。大多数文件系统的默认I/O操作都是缓存I/O。对于读操作来讲，操作系统会先检查，内核的缓冲区有没有需要的数据。如果已经缓存了，那就直接从缓存中返回；否则从磁盘中读取，然后缓存在操作系统的缓存中。对于写操作来讲，操作系统会先将数据从用户空间复制到内核空间的缓存中。这时对用户程序来说，写操作就已经完成。至于什么时候再写到磁盘中由操作系统决定，除非显式地调用了sync同步命令。</p><p>第二种类型是 <strong>直接IO</strong>，就是应用程序直接访问磁盘数据，而不经过内核缓冲区，从而减少了在内核缓存和用户程序之间数据复制。</p><p>如果在读的逻辑generic_file_read_iter里面，发现设置了IOCB_DIRECT，则会调用address_space的direct_IO的函数，将数据直接读取硬盘。我们在mmap映射文件到内存的时候讲过address_space，它主要用于在内存映射的时候将文件和内存页产生关联。</p><p>同样，对于缓存来讲，也需要文件和内存页进行关联，这就要用到address_space。address_space的相关操作定义在struct address_space_operations结构中。对于ext4文件系统来讲， address_space的操作定义在ext4_aops，direct_IO对应的函数是ext4_direct_IO。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct address_space_operations ext4_aops = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.direct_IO		= ext4_direct_IO,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>如果在写的逻辑__generic_file_write_iter里面，发现设置了IOCB_DIRECT，则调用generic_file_direct_write，里面同样会调用address_space的direct_IO的函数，将数据直接写入硬盘。</p><p>ext4_direct_IO最终会调用到__blockdev_direct_IO-&gt;do_blockdev_direct_IO，这就跨过了缓存层，到了通用块层，最终到了文件系统的设备驱动层。由于文件系统是块设备，所以这个调用的是blockdev相关的函数，有关块设备驱动程序的原理我们下一章详细讲，这一节我们就讲到文件系统到块设备的分界线部分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * This is a library function for use by filesystem drivers.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static inline ssize_t</span></span>
<span class="line"><span>do_blockdev_direct_IO(struct kiocb *iocb, struct inode *inode,</span></span>
<span class="line"><span>		      struct block_device *bdev, struct iov_iter *iter,</span></span>
<span class="line"><span>		      get_block_t get_block, dio_iodone_t end_io,</span></span>
<span class="line"><span>		      dio_submit_t submit_io, int flags)</span></span>
<span class="line"><span>{......}</span></span></code></pre></div><p>接下来，我们重点看带缓存的部分如果进行读写。</p><h2 id="带缓存的写入操作" tabindex="-1">带缓存的写入操作 <a class="header-anchor" href="#带缓存的写入操作" aria-label="Permalink to &quot;带缓存的写入操作&quot;">​</a></h2><p>我们先来看带缓存写入的函数generic_perform_write。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ssize_t generic_perform_write(struct file *file,</span></span>
<span class="line"><span>				struct iov_iter *i, loff_t pos)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct address_space *mapping = file-&amp;gt;f_mapping;</span></span>
<span class="line"><span>	const struct address_space_operations *a_ops = mapping-&amp;gt;a_ops;</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		struct page *page;</span></span>
<span class="line"><span>		unsigned long offset;	/* Offset into pagecache page */</span></span>
<span class="line"><span>		unsigned long bytes;	/* Bytes to write to page */</span></span>
<span class="line"><span>		status = a_ops-&amp;gt;write_begin(file, mapping, pos, bytes, flags,</span></span>
<span class="line"><span>						&amp;page, &amp;fsdata);</span></span>
<span class="line"><span>		copied = iov_iter_copy_from_user_atomic(page, i, offset, bytes);</span></span>
<span class="line"><span>		flush_dcache_page(page);</span></span>
<span class="line"><span>		status = a_ops-&amp;gt;write_end(file, mapping, pos, bytes, copied,</span></span>
<span class="line"><span>						page, fsdata);</span></span>
<span class="line"><span>		pos += copied;</span></span>
<span class="line"><span>		written += copied;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		balance_dirty_pages_ratelimited(mapping);</span></span>
<span class="line"><span>	} while (iov_iter_count(i));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个函数里，是一个while循环。我们需要找出这次写入影响的所有的页，然后依次写入。对于每一个循环，主要做四件事情：</p><ul><li>对于每一页，先调用address_space的write_begin做一些准备；</li><li>调用iov_iter_copy_from_user_atomic，将写入的内容从用户态拷贝到内核态的页中；</li><li>调用address_space的write_end完成写操作；</li><li>调用balance_dirty_pages_ratelimited，看脏页是否太多，需要写回硬盘。所谓脏页，就是写入到缓存，但是还没有写入到硬盘的页面。</li></ul><p>我们依次来看这四个步骤。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct address_space_operations ext4_aops = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.write_begin		= ext4_write_begin,</span></span>
<span class="line"><span>	.write_end		= ext4_write_end,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第一步，对于ext4来讲，调用的是ext4_write_begin。</p><p>ext4是一种日志文件系统，是为了防止突然断电的时候的数据丢失，引入了 <strong>日志</strong>**（ <strong>Journal</strong>）** <strong>模式</strong>。日志文件系统比非日志文件系统多了一个Journal区域。文件在ext4中分两部分存储，一部分是文件的元数据，另一部分是数据。元数据和数据的操作日志Journal也是分开管理的。你可以在挂载ext4的时候，选择Journal模式。这种模式在将数据写入文件系统前，必须等待元数据和数据的日志已经落盘才能发挥作用。这样性能比较差，但是最安全。</p><p>另一种模式是 <strong>order模式</strong>。这个模式不记录数据的日志，只记录元数据的日志，但是在写元数据的日志前，必须先确保数据已经落盘。这个折中，是默认模式。</p><p>还有一种模式是 <strong>writeback</strong>，不记录数据的日志，仅记录元数据的日志，并且不保证数据比元数据先落盘。这个性能最好，但是最不安全。</p><p>在ext4_write_begin，我们能看到对于ext4_journal_start的调用，就是在做日志相关的工作。</p><p>在ext4_write_begin中，还做了另外一件重要的事情，就是调用grab_cache_page_write_begin，来得到应该写入的缓存页。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct page *grab_cache_page_write_begin(struct address_space *mapping,</span></span>
<span class="line"><span>					pgoff_t index, unsigned flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct page *page;</span></span>
<span class="line"><span>	int fgp_flags = FGP_LOCK|FGP_WRITE|FGP_CREAT;</span></span>
<span class="line"><span>	page = pagecache_get_page(mapping, index, fgp_flags,</span></span>
<span class="line"><span>			mapping_gfp_mask(mapping));</span></span>
<span class="line"><span>	if (page)</span></span>
<span class="line"><span>		wait_for_stable_page(page);</span></span>
<span class="line"><span>	return page;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在内核中，缓存以页为单位放在内存里面，那我们如何知道，一个文件的哪些数据已经被放到缓存中了呢？每一个打开的文件都有一个struct file结构，每个struct file结构都有一个struct address_space用于关联文件和内存，就是在这个结构里面，有一棵树，用于保存所有与这个文件相关的的缓存页。</p><p>我们查找的时候，往往需要根据文件中的偏移量找出相应的页面，而基数树radix tree这种数据结构能够快速根据一个长整型查找到其相应的对象，因而这里缓存页就放在radix基数树里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct address_space {</span></span>
<span class="line"><span>	struct inode		*host;		/* owner: inode, block_device */</span></span>
<span class="line"><span>	struct radix_tree_root	page_tree;	/* radix tree of all pages */</span></span>
<span class="line"><span>	spinlock_t		tree_lock;	/* and lock protecting it */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>pagecache_get_page就是根据pgoff_t index这个长整型，在这棵树里面查找缓存页，如果找不到就会创建一个缓存页。</p><p>第二步，调用iov_iter_copy_from_user_atomic。先将分配好的页面调用kmap_atomic映射到内核里面的一个虚拟地址，然后将用户态的数据拷贝到内核态的页面的虚拟地址中，调用kunmap_atomic把内核里面的映射删除。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>size_t iov_iter_copy_from_user_atomic(struct page *page,</span></span>
<span class="line"><span>		struct iov_iter *i, unsigned long offset, size_t bytes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	char *kaddr = kmap_atomic(page), *p = kaddr + offset;</span></span>
<span class="line"><span>	iterate_all_kinds(i, bytes, v,</span></span>
<span class="line"><span>		copyin((p += v.iov_len) - v.iov_len, v.iov_base, v.iov_len),</span></span>
<span class="line"><span>		memcpy_from_page((p += v.bv_len) - v.bv_len, v.bv_page,</span></span>
<span class="line"><span>				 v.bv_offset, v.bv_len),</span></span>
<span class="line"><span>		memcpy((p += v.iov_len) - v.iov_len, v.iov_base, v.iov_len)</span></span>
<span class="line"><span>	)</span></span>
<span class="line"><span>	kunmap_atomic(kaddr);</span></span>
<span class="line"><span>	return bytes;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第三步，调用ext4_write_end完成写入。这里面会调用ext4_journal_stop完成日志的写入，会调用block_write_end-&gt;__block_commit_write-&gt;mark_buffer_dirty，将修改过的缓存标记为脏页。可以看出，其实所谓的完成写入，并没有真正写入硬盘，仅仅是写入缓存后，标记为脏页。</p><p>但是这里有一个问题，数据很危险，一旦宕机就没有了，所以需要一种机制，将写入的页面真正写到硬盘中，我们称为回写（Write Back）。</p><p>第四步，调用 balance_dirty_pages_ratelimited，是回写脏页的一个很好的时机。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * balance_dirty_pages_ratelimited - balance dirty memory state</span></span>
<span class="line"><span> * &amp;#64;mapping: address_space which was dirtied</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Processes which are dirtying memory should call in here once for each page</span></span>
<span class="line"><span> * which was newly dirtied.  The function will periodically check the system&#39;s</span></span>
<span class="line"><span> * dirty state and will initiate writeback if needed.</span></span>
<span class="line"><span>  */</span></span>
<span class="line"><span>void balance_dirty_pages_ratelimited(struct address_space *mapping)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct inode *inode = mapping-&amp;gt;host;</span></span>
<span class="line"><span>	struct backing_dev_info *bdi = inode_to_bdi(inode);</span></span>
<span class="line"><span>	struct bdi_writeback *wb = NULL;</span></span>
<span class="line"><span>	int ratelimit;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (unlikely(current-&amp;gt;nr_dirtied &amp;gt;= ratelimit))</span></span>
<span class="line"><span>		balance_dirty_pages(mapping, wb, current-&amp;gt;nr_dirtied);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在balance_dirty_pages_ratelimited里面，发现脏页的数目超过了规定的数目，就调用balance_dirty_pages-&gt;wb_start_background_writeback，启动一个背后线程开始回写。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void wb_start_background_writeback(struct bdi_writeback *wb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * We just wake up the flusher thread. It will perform background</span></span>
<span class="line"><span>	 * writeback as soon as there is no other work to do.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	wb_wakeup(wb);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void wb_wakeup(struct bdi_writeback *wb)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	spin_lock_bh(&amp;wb-&amp;gt;work_lock);</span></span>
<span class="line"><span>	if (test_bit(WB_registered, &amp;wb-&amp;gt;state))</span></span>
<span class="line"><span>		mod_delayed_work(bdi_wq, &amp;wb-&amp;gt;dwork, 0);</span></span>
<span class="line"><span>	spin_unlock_bh(&amp;wb-&amp;gt;work_lock);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  (_tflags) | TIMER_IRQSAFE);		\\</span></span>
<span class="line"><span>	} while (0)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* bdi_wq serves all asynchronous writeback tasks */</span></span>
<span class="line"><span>struct workqueue_struct *bdi_wq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * mod_delayed_work - modify delay of or queue a delayed work</span></span>
<span class="line"><span> * &amp;#64;wq: workqueue to use</span></span>
<span class="line"><span> * &amp;#64;dwork: work to queue</span></span>
<span class="line"><span> * &amp;#64;delay: number of jiffies to wait before queueing</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * mod_delayed_work_on() on local CPU.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static inline bool mod_delayed_work(struct workqueue_struct *wq,</span></span>
<span class="line"><span>				    struct delayed_work *dwork,</span></span>
<span class="line"><span>				    unsigned long delay)</span></span>
<span class="line"><span>{....</span></span></code></pre></div><p>通过上面的代码，我们可以看出，bdi_wq是一个全局变量，所有回写的任务都挂在这个队列上。mod_delayed_work函数负责将一个回写任务bdi_writeback挂在这个队列上。bdi_writeback有个成员变量struct delayed_work dwork，bdi_writeback就是以delayed_work的身份挂到队列上的，并且把delay设置为0，意思就是一刻不等，马上执行。</p><p>那具体这个任务由谁来执行呢？这里的bdi的意思是backing device info，用于描述后端存储相关的信息。每个块设备都会有这样一个结构，并且在初始化块设备的时候，调用bdi_init初始化这个结构，在初始化bdi的时候，也会调用wb_init初始化bdi_writeback。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int wb_init(struct bdi_writeback *wb, struct backing_dev_info *bdi,</span></span>
<span class="line"><span>		   int blkcg_id, gfp_t gfp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	wb-&amp;gt;bdi = bdi;</span></span>
<span class="line"><span>	wb-&amp;gt;last_old_flush = jiffies;</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;wb-&amp;gt;b_dirty);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;wb-&amp;gt;b_io);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;wb-&amp;gt;b_more_io);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;wb-&amp;gt;b_dirty_time);</span></span>
<span class="line"><span>	wb-&amp;gt;bw_time_stamp = jiffies;</span></span>
<span class="line"><span>	wb-&amp;gt;balanced_dirty_ratelimit = INIT_BW;</span></span>
<span class="line"><span>	wb-&amp;gt;dirty_ratelimit = INIT_BW;</span></span>
<span class="line"><span>	wb-&amp;gt;write_bandwidth = INIT_BW;</span></span>
<span class="line"><span>	wb-&amp;gt;avg_write_bandwidth = INIT_BW;</span></span>
<span class="line"><span>	spin_lock_init(&amp;wb-&amp;gt;work_lock);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;wb-&amp;gt;work_list);</span></span>
<span class="line"><span>	INIT_DELAYED_WORK(&amp;wb-&amp;gt;dwork, wb_workfn);</span></span>
<span class="line"><span>	wb-&amp;gt;dirty_sleep = jiffies;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define __INIT_DELAYED_WORK(_work, _func, _tflags)			\\</span></span>
<span class="line"><span>	do {								\\</span></span>
<span class="line"><span>		INIT_WORK(&amp;(_work)-&amp;gt;work, (_func));			\\</span></span>
<span class="line"><span>		__setup_timer(&amp;(_work)-&amp;gt;timer, delayed_work_timer_fn,	\\</span></span>
<span class="line"><span>			      (unsigned long)(_work),			\\</span></span></code></pre></div><p>这里面最重要的是INIT_DELAYED_WORK。其实就是初始化一个timer，也即定时器，到时候我们就执行wb_workfn这个函数。</p><p>接下来的调用链为：wb_workfn-&gt;wb_do_writeback-&gt;wb_writeback-&gt;writeback_sb_inodes-&gt;__writeback_single_inode-&gt;do_writepages，写入页面到硬盘。</p><p>在调用write的最后，当发现缓存的数据太多的时候，会触发回写，这仅仅是回写的一种场景。另外还有几种场景也会触发回写：</p><ul><li>用户主动调用sync，将缓存刷到硬盘上去，最终会调用wakeup_flusher_threads，同步脏页；</li><li>当内存十分紧张，以至于无法分配页面的时候，会调用free_more_memory，最终会调用wakeup_flusher_threads，释放脏页；</li><li>脏页已经更新了较长时间，时间上超过了timer，需要及时回写，保持内存和磁盘上数据一致性。</li></ul><h2 id="带缓存的读操作" tabindex="-1">带缓存的读操作 <a class="header-anchor" href="#带缓存的读操作" aria-label="Permalink to &quot;带缓存的读操作&quot;">​</a></h2><p>带缓存的写分析完了，接下来，我们看带缓存的读，对应的是函数generic_file_buffered_read。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ssize_t generic_file_buffered_read(struct kiocb *iocb,</span></span>
<span class="line"><span>		struct iov_iter *iter, ssize_t written)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *filp = iocb-&amp;gt;ki_filp;</span></span>
<span class="line"><span>	struct address_space *mapping = filp-&amp;gt;f_mapping;</span></span>
<span class="line"><span>	struct inode *inode = mapping-&amp;gt;host;</span></span>
<span class="line"><span>	for (;;) {</span></span>
<span class="line"><span>		struct page *page;</span></span>
<span class="line"><span>		pgoff_t end_index;</span></span>
<span class="line"><span>		loff_t isize;</span></span>
<span class="line"><span>		page = find_get_page(mapping, index);</span></span>
<span class="line"><span>		if (!page) {</span></span>
<span class="line"><span>			if (iocb-&amp;gt;ki_flags &amp; IOCB_NOWAIT)</span></span>
<span class="line"><span>				goto would_block;</span></span>
<span class="line"><span>			page_cache_sync_readahead(mapping,</span></span>
<span class="line"><span>					ra, filp,</span></span>
<span class="line"><span>					index, last_index - index);</span></span>
<span class="line"><span>			page = find_get_page(mapping, index);</span></span>
<span class="line"><span>			if (unlikely(page == NULL))</span></span>
<span class="line"><span>				goto no_cached_page;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		if (PageReadahead(page)) {</span></span>
<span class="line"><span>			page_cache_async_readahead(mapping,</span></span>
<span class="line"><span>					ra, filp, page,</span></span>
<span class="line"><span>					index, last_index - index);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		/*</span></span>
<span class="line"><span>		 * Ok, we have the page, and it&#39;s up-to-date, so</span></span>
<span class="line"><span>		 * now we can copy it to user space...</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		ret = copy_page_to_iter(page, offset, nr, iter);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>读取比写入总体而言简单一些，主要涉及预读的问题。</p><p>在generic_file_buffered_read函数中，我们需要先找到page cache里面是否有缓存页。如果没有找到，不但读取这一页，还要进行预读，这需要在page_cache_sync_readahead函数中实现。预读完了以后，再试一把查找缓存页，应该能找到了。</p><p>如果第一次找缓存页就找到了，我们还是要判断，是不是应该继续预读；如果需要，就调用page_cache_async_readahead发起一个异步预读。</p><p>最后，copy_page_to_iter会将内容从内核缓存页拷贝到用户内存空间。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节对于读取和写入的分析就到这里了。我们发现这个过程还是很复杂的，我这里画了一张调用图，你可以看到调用过程。</p><p>在系统调用层我们需要仔细学习read和write。在VFS层调用的是vfs_read和vfs_write并且调用file_operation。在ext4层调用的是ext4_file_read_iter和ext4_file_write_iter。</p><p>接下来就是分叉。你需要知道缓存I/O和直接I/O。直接I/O读写的流程是一样的，调用ext4_direct_IO，再往下就调用块设备层了。缓存I/O读写的流程不一样。对于读，从块设备读取到缓存中，然后从缓存中拷贝到用户态。对于写，从用户态拷贝到缓存，设置缓存页为脏，然后启动一个线程写入块设备。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/99108/0c49a870b9e6441381fec8d9bf3dee65.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/99108/0c49a870b9e6441381fec8d9bf3dee65.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你知道如何查询和清除文件系统缓存吗？</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/99108/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/99108/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,77)])])}const b=a(t,[["render",i]]);export{g as __pageData,b as default};
