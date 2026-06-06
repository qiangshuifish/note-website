import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"35 | 块设备（下）：如何建立代理商销售模式？","description":"","frontmatter":{},"headers":[{"level":2,"title":"直接I/O如何访问块设备？","slug":"直接i-o如何访问块设备","link":"#直接i-o如何访问块设备","children":[]},{"level":2,"title":"缓存I/O如何访问块设备？","slug":"缓存i-o如何访问块设备","link":"#缓存i-o如何访问块设备","children":[]},{"level":2,"title":"如何向块设备层提交请求？","slug":"如何向块设备层提交请求","link":"#如何向块设备层提交请求","children":[{"level":3,"title":"块设备队列结构","slug":"块设备队列结构","link":"#块设备队列结构","children":[]},{"level":3,"title":"块设备的初始化","slug":"块设备的初始化","link":"#块设备的初始化","children":[]},{"level":3,"title":"请求提交与调度","slug":"请求提交与调度","link":"#请求提交与调度","children":[]},{"level":3,"title":"请求的处理","slug":"请求的处理","link":"#请求的处理","children":[]}]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/35-块设备（下）：如何建立代理商销售模式？.md","filePath":"趣谈Linux操作系统/35-块设备（下）：如何建立代理商销售模式？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/35-块设备（下）：如何建立代理商销售模式？.md"};function i(l,s,c,_,o,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_35-块设备-下-如何建立代理商销售模式" tabindex="-1">35 | 块设备（下）：如何建立代理商销售模式？ <a class="header-anchor" href="#_35-块设备-下-如何建立代理商销售模式" aria-label="Permalink to &quot;35 | 块设备（下）：如何建立代理商销售模式？&quot;">​</a></h1><p>在 <a href="https://time.geekbang.org/column/article/97876" target="_blank" rel="noreferrer">文件系统</a> 那一节，我们讲了文件的写入，到了设备驱动这一层，就没有再往下分析。上一节我们又讲了mount一个块设备，将block_device信息放到了ext4文件系统的super_block里面，有了这些基础，是时候把整个写入的故事串起来了。</p><p>还记得咱们在文件系统那一节分析写入流程的时候，对于ext4文件系统，最后调用的是ext4_file_write_iter，它将I/O的调用分成两种情况：</p><p>第一是 <strong>直接I/O</strong>。最终我们调用的是generic_file_direct_write，这里调用的是mapping-&gt;a_ops-&gt;direct_IO，实际调用的是ext4_direct_IO，往设备层写入数据。</p><p>第二种是 <strong>缓存I/O</strong>。最终我们会将数据从应用拷贝到内存缓存中，但是这个时候，并不执行真正的I/O操作。它们只将整个页或其中部分标记为脏。写操作由一个timer触发，那个时候，才调用wb_workfn往硬盘写入页面。</p><p>接下来的调用链为：wb_workfn-&gt;wb_do_writeback-&gt;wb_writeback-&gt;writeback_sb_inodes-&gt;__writeback_single_inode-&gt;do_writepages。在do_writepages中，我们要调用mapping-&gt;a_ops-&gt;writepages，但实际调用的是ext4_writepages，往设备层写入数据。</p><p>这一节，我们就沿着这两种情况分析下去。</p><h2 id="直接i-o如何访问块设备" tabindex="-1">直接I/O如何访问块设备？ <a class="header-anchor" href="#直接i-o如何访问块设备" aria-label="Permalink to &quot;直接I/O如何访问块设备？&quot;">​</a></h2><p>我们先来看第一种情况，直接I/O调用到ext4_direct_IO。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ssize_t ext4_direct_IO(struct kiocb *iocb, struct iov_iter *iter)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file = iocb-&amp;gt;ki_filp;</span></span>
<span class="line"><span>	struct inode *inode = file-&amp;gt;f_mapping-&amp;gt;host;</span></span>
<span class="line"><span>	size_t count = iov_iter_count(iter);</span></span>
<span class="line"><span>	loff_t offset = iocb-&amp;gt;ki_pos;</span></span>
<span class="line"><span>	ssize_t ret;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = ext4_direct_IO_write(iocb, iter);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static ssize_t ext4_direct_IO_write(struct kiocb *iocb, struct iov_iter *iter)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file = iocb-&amp;gt;ki_filp;</span></span>
<span class="line"><span>	struct inode *inode = file-&amp;gt;f_mapping-&amp;gt;host;</span></span>
<span class="line"><span>	struct ext4_inode_info *ei = EXT4_I(inode);</span></span>
<span class="line"><span>	ssize_t ret;</span></span>
<span class="line"><span>	loff_t offset = iocb-&amp;gt;ki_pos;</span></span>
<span class="line"><span>	size_t count = iov_iter_count(iter);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = __blockdev_direct_IO(iocb, inode, inode-&amp;gt;i_sb-&amp;gt;s_bdev, iter,</span></span>
<span class="line"><span>				   get_block_func, ext4_end_io_dio, NULL,</span></span>
<span class="line"><span>				   dio_flags);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>……</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在ext4_direct_IO_write调用__blockdev_direct_IO，有个参数你需要特别注意一下，那就是inode-&gt;i_sb-&gt;s_bdev。通过当前文件的inode，我们可以得到super_block。这个super_block中的s_bdev，就是咱们上一节填进去的那个block_device。</p><p>__blockdev_direct_IO会调用do_blockdev_direct_IO，在这里面我们要准备一个struct dio结构和struct dio_submit结构，用来描述将要发生的写入请求。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline ssize_t</span></span>
<span class="line"><span>do_blockdev_direct_IO(struct kiocb *iocb, struct inode *inode,</span></span>
<span class="line"><span>		      struct block_device *bdev, struct iov_iter *iter,</span></span>
<span class="line"><span>		      get_block_t get_block, dio_iodone_t end_io,</span></span>
<span class="line"><span>		      dio_submit_t submit_io, int flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned i_blkbits = ACCESS_ONCE(inode-&amp;gt;i_blkbits);</span></span>
<span class="line"><span>	unsigned blkbits = i_blkbits;</span></span>
<span class="line"><span>	unsigned blocksize_mask = (1 &amp;lt;&amp;lt; blkbits) - 1;</span></span>
<span class="line"><span>	ssize_t retval = -EINVAL;</span></span>
<span class="line"><span>	size_t count = iov_iter_count(iter);</span></span>
<span class="line"><span>	loff_t offset = iocb-&amp;gt;ki_pos;</span></span>
<span class="line"><span>	loff_t end = offset + count;</span></span>
<span class="line"><span>	struct dio *dio;</span></span>
<span class="line"><span>	struct dio_submit sdio = { 0, };</span></span>
<span class="line"><span>	struct buffer_head map_bh = { 0, };</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	dio = kmem_cache_alloc(dio_cache, GFP_KERNEL);</span></span>
<span class="line"><span>	dio-&amp;gt;flags = flags;</span></span>
<span class="line"><span>	dio-&amp;gt;i_size = i_size_read(inode);</span></span>
<span class="line"><span>	dio-&amp;gt;inode = inode;</span></span>
<span class="line"><span>	if (iov_iter_rw(iter) == WRITE) {</span></span>
<span class="line"><span>		dio-&amp;gt;op = REQ_OP_WRITE;</span></span>
<span class="line"><span>		dio-&amp;gt;op_flags = REQ_SYNC | REQ_IDLE;</span></span>
<span class="line"><span>		if (iocb-&amp;gt;ki_flags &amp; IOCB_NOWAIT)</span></span>
<span class="line"><span>			dio-&amp;gt;op_flags |= REQ_NOWAIT;</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		dio-&amp;gt;op = REQ_OP_READ;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	sdio.blkbits = blkbits;</span></span>
<span class="line"><span>	sdio.blkfactor = i_blkbits - blkbits;</span></span>
<span class="line"><span>	sdio.block_in_file = offset &amp;gt;&amp;gt; blkbits;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sdio.get_block = get_block;</span></span>
<span class="line"><span>	dio-&amp;gt;end_io = end_io;</span></span>
<span class="line"><span>	sdio.submit_io = submit_io;</span></span>
<span class="line"><span>	sdio.final_block_in_bio = -1;</span></span>
<span class="line"><span>	sdio.next_block_for_io = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	dio-&amp;gt;iocb = iocb;</span></span>
<span class="line"><span>	dio-&amp;gt;refcount = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sdio.iter = iter;</span></span>
<span class="line"><span>	sdio.final_block_in_request =</span></span>
<span class="line"><span>		(offset + iov_iter_count(iter)) &amp;gt;&amp;gt; blkbits;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sdio.pages_in_io += iov_iter_npages(iter, INT_MAX);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	retval = do_direct_IO(dio, &amp;sdio, &amp;map_bh);</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>do_direct_IO里面有两层循环，第一层循环是依次处理这次要写入的所有块。对于每一块，取出对应的内存中的页page，在这一块中，有写入的起始地址from和终止地址to，所以，第二层循环就是依次处理from到to的数据，调用submit_page_section，提交到块设备层进行写入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int do_direct_IO(struct dio *dio, struct dio_submit *sdio,</span></span>
<span class="line"><span>			struct buffer_head *map_bh)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	const unsigned blkbits = sdio-&amp;gt;blkbits;</span></span>
<span class="line"><span>	const unsigned i_blkbits = blkbits + sdio-&amp;gt;blkfactor;</span></span>
<span class="line"><span>	int ret = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	while (sdio-&amp;gt;block_in_file &amp;lt; sdio-&amp;gt;final_block_in_request) {</span></span>
<span class="line"><span>		struct page *page;</span></span>
<span class="line"><span>		size_t from, to;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		page = dio_get_page(dio, sdio);</span></span>
<span class="line"><span>        from = sdio-&amp;gt;head ? 0 : sdio-&amp;gt;from;</span></span>
<span class="line"><span>		to = (sdio-&amp;gt;head == sdio-&amp;gt;tail - 1) ? sdio-&amp;gt;to : PAGE_SIZE;</span></span>
<span class="line"><span>		sdio-&amp;gt;head++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		while (from &amp;lt; to) {</span></span>
<span class="line"><span>			unsigned this_chunk_bytes;	/* # of bytes mapped */</span></span>
<span class="line"><span>			unsigned this_chunk_blocks;	/* # of blocks */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>            ret = submit_page_section(dio, sdio, page,</span></span>
<span class="line"><span>						  from,</span></span>
<span class="line"><span>						  this_chunk_bytes,</span></span>
<span class="line"><span>						  sdio-&amp;gt;next_block_for_io,</span></span>
<span class="line"><span>						  map_bh);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			sdio-&amp;gt;next_block_for_io += this_chunk_blocks;</span></span>
<span class="line"><span>			sdio-&amp;gt;block_in_file += this_chunk_blocks;</span></span>
<span class="line"><span>			from += this_chunk_bytes;</span></span>
<span class="line"><span>			dio-&amp;gt;result += this_chunk_bytes;</span></span>
<span class="line"><span>			sdio-&amp;gt;blocks_available -= this_chunk_blocks;</span></span>
<span class="line"><span>			if (sdio-&amp;gt;block_in_file == sdio-&amp;gt;final_block_in_request)</span></span>
<span class="line"><span>				break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>submit_page_section会调用dio_bio_submit，进而调用submit_bio向块设备层提交数据。其中，参数struct bio是将数据传给块设备的通用传输对象。定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * submit_bio - submit a bio to the block device layer for I/O</span></span>
<span class="line"><span> * &amp;#64;bio: The &amp;struct bio which describes the I/O</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>blk_qc_t submit_bio(struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  return generic_make_request(bio);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="缓存i-o如何访问块设备" tabindex="-1">缓存I/O如何访问块设备？ <a class="header-anchor" href="#缓存i-o如何访问块设备" aria-label="Permalink to &quot;缓存I/O如何访问块设备？&quot;">​</a></h2><p>我们再来看第二种情况，缓存I/O调用到ext4_writepages。这个函数比较长，我们这里只截取最重要的部分来讲解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int ext4_writepages(struct address_space *mapping,</span></span>
<span class="line"><span>			   struct writeback_control *wbc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct mpage_da_data mpd;</span></span>
<span class="line"><span>	struct inode *inode = mapping-&amp;gt;host;</span></span>
<span class="line"><span>	struct ext4_sb_info *sbi = EXT4_SB(mapping-&amp;gt;host-&amp;gt;i_sb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	mpd.do_map = 0;</span></span>
<span class="line"><span>	mpd.io_submit.io_end = ext4_init_io_end(inode, GFP_KERNEL);</span></span>
<span class="line"><span>	ret = mpage_prepare_extent_to_map(&amp;mpd);</span></span>
<span class="line"><span>	/* Submit prepared bio */</span></span>
<span class="line"><span>	ext4_io_submit(&amp;mpd.io_submit);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里比较重要的一个数据结构是struct mpage_da_data。这里面有文件的inode、要写入的页的偏移量，还有一个重要的struct ext4_io_submit，里面有通用传输对象bio。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct mpage_da_data {</span></span>
<span class="line"><span>	struct inode *inode;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	pgoff_t first_page;	/* The first page to write */</span></span>
<span class="line"><span>	pgoff_t next_page;	/* Current page to examine */</span></span>
<span class="line"><span>	pgoff_t last_page;	/* Last page to examine */</span></span>
<span class="line"><span>	struct ext4_map_blocks map;</span></span>
<span class="line"><span>	struct ext4_io_submit io_submit;	/* IO submission data */</span></span>
<span class="line"><span>	unsigned int do_map:1;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct ext4_io_submit {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct bio		*io_bio;</span></span>
<span class="line"><span>	ext4_io_end_t		*io_end;</span></span>
<span class="line"><span>	sector_t		io_next_block;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在ext4_writepages中，mpage_prepare_extent_to_map用于初始化这个struct mpage_da_data结构。接下来的调用链为：mpage_prepare_extent_to_map-&gt;mpage_process_page_bufs-&gt;mpage_submit_page-&gt;ext4_bio_write_page-&gt;io_submit_add_bh。</p><p>在io_submit_add_bh中，此时的bio还是空的，因而我们要调用io_submit_init_bio，初始化bio。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int io_submit_init_bio(struct ext4_io_submit *io,</span></span>
<span class="line"><span>			      struct buffer_head *bh)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct bio *bio;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	bio = bio_alloc(GFP_NOIO, BIO_MAX_PAGES);</span></span>
<span class="line"><span>	if (!bio)</span></span>
<span class="line"><span>		return -ENOMEM;</span></span>
<span class="line"><span>	wbc_init_bio(io-&amp;gt;io_wbc, bio);</span></span>
<span class="line"><span>	bio-&amp;gt;bi_iter.bi_sector = bh-&amp;gt;b_blocknr * (bh-&amp;gt;b_size &amp;gt;&amp;gt; 9);</span></span>
<span class="line"><span>	bio-&amp;gt;bi_bdev = bh-&amp;gt;b_bdev;</span></span>
<span class="line"><span>	bio-&amp;gt;bi_end_io = ext4_end_bio;</span></span>
<span class="line"><span>	bio-&amp;gt;bi_private = ext4_get_io_end(io-&amp;gt;io_end);</span></span>
<span class="line"><span>	io-&amp;gt;io_bio = bio;</span></span>
<span class="line"><span>	io-&amp;gt;io_next_block = bh-&amp;gt;b_blocknr;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们再回到ext4_writepages中。在bio初始化完之后，我们要调用ext4_io_submit，提交I/O。在这里我们又是调用submit_bio，向块设备层传输数据。ext4_io_submit的实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void ext4_io_submit(struct ext4_io_submit *io)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct bio *bio = io-&amp;gt;io_bio;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (bio) {</span></span>
<span class="line"><span>		int io_op_flags = io-&amp;gt;io_wbc-&amp;gt;sync_mode == WB_SYNC_ALL ?</span></span>
<span class="line"><span>				  REQ_SYNC : 0;</span></span>
<span class="line"><span>		io-&amp;gt;io_bio-&amp;gt;bi_write_hint = io-&amp;gt;io_end-&amp;gt;inode-&amp;gt;i_write_hint;</span></span>
<span class="line"><span>		bio_set_op_attrs(io-&amp;gt;io_bio, REQ_OP_WRITE, io_op_flags);</span></span>
<span class="line"><span>		submit_bio(io-&amp;gt;io_bio);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	io-&amp;gt;io_bio = NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="如何向块设备层提交请求" tabindex="-1">如何向块设备层提交请求？ <a class="header-anchor" href="#如何向块设备层提交请求" aria-label="Permalink to &quot;如何向块设备层提交请求？&quot;">​</a></h2><p>既然不管是直接I/O，还是缓存I/O，最后都到了submit_bio里面，那我们就来重点分析一下它。</p><p>submit_bio会调用generic_make_request。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>blk_qc_t generic_make_request(struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * bio_list_on_stack[0] contains bios submitted by the current</span></span>
<span class="line"><span>	 * make_request_fn.</span></span>
<span class="line"><span>	 * bio_list_on_stack[1] contains bios that were submitted before</span></span>
<span class="line"><span>	 * the current make_request_fn, but that haven&#39;t been processed</span></span>
<span class="line"><span>	 * yet.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct bio_list bio_list_on_stack[2];</span></span>
<span class="line"><span>	blk_qc_t ret = BLK_QC_T_NONE;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (current-&amp;gt;bio_list) {</span></span>
<span class="line"><span>		bio_list_add(&amp;current-&amp;gt;bio_list[0], bio);</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	bio_list_init(&amp;bio_list_on_stack[0]);</span></span>
<span class="line"><span>	current-&amp;gt;bio_list = bio_list_on_stack;</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		struct request_queue *q = bdev_get_queue(bio-&amp;gt;bi_bdev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (likely(blk_queue_enter(q, bio-&amp;gt;bi_opf &amp; REQ_NOWAIT) == 0)) {</span></span>
<span class="line"><span>			struct bio_list lower, same;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			/* Create a fresh bio_list for all subordinate requests */</span></span>
<span class="line"><span>			bio_list_on_stack[1] = bio_list_on_stack[0];</span></span>
<span class="line"><span>			bio_list_init(&amp;bio_list_on_stack[0]);</span></span>
<span class="line"><span>			ret = q-&amp;gt;make_request_fn(q, bio);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			blk_queue_exit(q);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			/* sort new bios into those for a lower level</span></span>
<span class="line"><span>			 * and those for the same level</span></span>
<span class="line"><span>			 */</span></span>
<span class="line"><span>			bio_list_init(&amp;lower);</span></span>
<span class="line"><span>			bio_list_init(&amp;same);</span></span>
<span class="line"><span>			while ((bio = bio_list_pop(&amp;bio_list_on_stack[0])) != NULL)</span></span>
<span class="line"><span>				if (q == bdev_get_queue(bio-&amp;gt;bi_bdev))</span></span>
<span class="line"><span>					bio_list_add(&amp;same, bio);</span></span>
<span class="line"><span>				else</span></span>
<span class="line"><span>					bio_list_add(&amp;lower, bio);</span></span>
<span class="line"><span>			/* now assemble so we handle the lowest level first */</span></span>
<span class="line"><span>			bio_list_merge(&amp;bio_list_on_stack[0], &amp;lower);</span></span>
<span class="line"><span>			bio_list_merge(&amp;bio_list_on_stack[0], &amp;same);</span></span>
<span class="line"><span>			bio_list_merge(&amp;bio_list_on_stack[0], &amp;bio_list_on_stack[1]);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		bio = bio_list_pop(&amp;bio_list_on_stack[0]);</span></span>
<span class="line"><span>	} while (bio);</span></span>
<span class="line"><span>	current-&amp;gt;bio_list = NULL; /* deactivate */</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的逻辑有点复杂，我们先来看大的逻辑。在do-while中，我们先是获取一个请求队列request_queue，然后调用这个队列的make_request_fn函数。</p><h3 id="块设备队列结构" tabindex="-1">块设备队列结构 <a class="header-anchor" href="#块设备队列结构" aria-label="Permalink to &quot;块设备队列结构&quot;">​</a></h3><p>如果再来看struct block_device结构和struct gendisk结构，我们会发现，每个块设备都有一个请求队列struct request_queue，用于处理上层发来的请求。</p><p>在每个块设备的驱动程序初始化的时候，会生成一个request_queue。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct request_queue {</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * Together with queue_head for cacheline sharing</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct list_head	queue_head;</span></span>
<span class="line"><span>	struct request		*last_merge;</span></span>
<span class="line"><span>	struct elevator_queue	*elevator;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	request_fn_proc		*request_fn;</span></span>
<span class="line"><span>	make_request_fn		*make_request_fn;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在请求队列request_queue上，首先是有一个链表list_head，保存请求request。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct request {</span></span>
<span class="line"><span>	struct list_head queuelist;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct request_queue *q;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct bio *bio;</span></span>
<span class="line"><span>	struct bio *biotail;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>每个request包括一个链表的struct bio，有指针指向一头一尾。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct bio {</span></span>
<span class="line"><span>	struct bio		*bi_next;	/* request queue link */</span></span>
<span class="line"><span>	struct block_device	*bi_bdev;</span></span>
<span class="line"><span>	blk_status_t		bi_status;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    struct bvec_iter	bi_iter;</span></span>
<span class="line"><span>	unsigned short		bi_vcnt;	/* how many bio_vec&#39;s */</span></span>
<span class="line"><span>	unsigned short		bi_max_vecs;	/* max bvl_vecs we can hold */</span></span>
<span class="line"><span>	atomic_t		__bi_cnt;	/* pin count */</span></span>
<span class="line"><span>	struct bio_vec		*bi_io_vec;	/* the actual vec list */</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct bio_vec {</span></span>
<span class="line"><span>	struct page	*bv_page;</span></span>
<span class="line"><span>	unsigned int	bv_len;</span></span>
<span class="line"><span>	unsigned int	bv_offset;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在bio中，bi_next是链表中的下一项，struct bio_vec指向一组页面。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/101397/3c473d163b6e90985d7301f115ab660e.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/101397/3c473d163b6e90985d7301f115ab660e.jpeg" alt=""></a></p><p>在请求队列request_queue上，还有两个重要的函数，一个是make_request_fn函数，用于生成request；另一个是request_fn函数，用于处理request。</p><h3 id="块设备的初始化" tabindex="-1">块设备的初始化 <a class="header-anchor" href="#块设备的初始化" aria-label="Permalink to &quot;块设备的初始化&quot;">​</a></h3><p>我们还是以scsi驱动为例。在初始化设备驱动的时候，我们会调用scsi_alloc_queue，把request_fn设置为scsi_request_fn。我们还会调用blk_init_allocated_queue-&gt;blk_queue_make_request，把make_request_fn设置为blk_queue_bio。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * scsi_alloc_sdev - allocate and setup a scsi_Device</span></span>
<span class="line"><span> * &amp;#64;starget: which target to allocate a &amp;scsi_device for</span></span>
<span class="line"><span> * &amp;#64;lun: which lun</span></span>
<span class="line"><span> * &amp;#64;hostdata: usually NULL and set by -&amp;gt;slave_alloc instead</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Description:</span></span>
<span class="line"><span> *     Allocate, initialize for io, and return a pointer to a scsi_Device.</span></span>
<span class="line"><span> *     Stores the &amp;#64;shost, &amp;#64;channel, &amp;#64;id, and &amp;#64;lun in the scsi_Device, and</span></span>
<span class="line"><span> *     adds scsi_Device to the appropriate list.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Return value:</span></span>
<span class="line"><span> *     scsi_Device pointer, or NULL on failure.</span></span>
<span class="line"><span> **/</span></span>
<span class="line"><span>static struct scsi_device *scsi_alloc_sdev(struct scsi_target *starget,</span></span>
<span class="line"><span>					   u64 lun, void *hostdata)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct scsi_device *sdev;</span></span>
<span class="line"><span>	sdev = kzalloc(sizeof(*sdev) + shost-&amp;gt;transportt-&amp;gt;device_size,</span></span>
<span class="line"><span>		       GFP_ATOMIC);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sdev-&amp;gt;request_queue = scsi_alloc_queue(sdev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct request_queue *scsi_alloc_queue(struct scsi_device *sdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct Scsi_Host *shost = sdev-&amp;gt;host;</span></span>
<span class="line"><span>	struct request_queue *q;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	q = blk_alloc_queue_node(GFP_KERNEL, NUMA_NO_NODE);</span></span>
<span class="line"><span>	if (!q)</span></span>
<span class="line"><span>		return NULL;</span></span>
<span class="line"><span>	q-&amp;gt;cmd_size = sizeof(struct scsi_cmnd) + shost-&amp;gt;hostt-&amp;gt;cmd_size;</span></span>
<span class="line"><span>	q-&amp;gt;rq_alloc_data = shost;</span></span>
<span class="line"><span>	q-&amp;gt;request_fn = scsi_request_fn;</span></span>
<span class="line"><span>	q-&amp;gt;init_rq_fn = scsi_init_rq;</span></span>
<span class="line"><span>	q-&amp;gt;exit_rq_fn = scsi_exit_rq;</span></span>
<span class="line"><span>	q-&amp;gt;initialize_rq_fn = scsi_initialize_rq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //调用blk_queue_make_request(q, blk_queue_bio);</span></span>
<span class="line"><span>	if (blk_init_allocated_queue(q) &amp;lt; 0) {</span></span>
<span class="line"><span>		blk_cleanup_queue(q);</span></span>
<span class="line"><span>		return NULL;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	__scsi_init_queue(shost, q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return q</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在blk_init_allocated_queue中，除了初始化make_request_fn函数，我们还要做一件很重要的事情，就是初始化I/O的电梯算法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int blk_init_allocated_queue(struct request_queue *q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	q-&amp;gt;fq = blk_alloc_flush_queue(q, NUMA_NO_NODE, q-&amp;gt;cmd_size);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	blk_queue_make_request(q, blk_queue_bio);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* init elevator */</span></span>
<span class="line"><span>	if (elevator_init(q, NULL)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>电梯算法有很多种类型，定义为elevator_type。下面我来逐一说一下。</p><ul><li><strong>struct elevator_type elevator_noop</strong></li></ul><p>Noop调度算法是最简单的IO调度算法，它将IO请求放入到一个FIFO队列中，然后逐个执行这些IO请求。</p><ul><li><strong>struct elevator_type iosched_deadline</strong></li></ul><p>Deadline算法要保证每个IO请求在一定的时间内一定要被服务到，以此来避免某个请求饥饿。为了完成这个目标，算法中引入了两类队列，一类队列用来对请求按起始扇区序号进行排序，通过红黑树来组织，我们称为sort_list，按照此队列传输性能会比较高；另一类队列对请求按它们的生成时间进行排序，由链表来组织，称为fifo_list，并且每一个请求都有一个期限值。</p><ul><li><strong>struct elevator_type iosched_cfq</strong></li></ul><p>又看到了熟悉的CFQ完全公平调度算法。所有的请求会在多个队列中排序。同一个进程的请求，总是在同一队列中处理。时间片会分配到每个队列，通过轮询算法，我们保证了I/O带宽，以公平的方式，在不同队列之间进行共享。</p><p>elevator_init中会根据名称来指定电梯算法，如果没有选择，那就默认使用iosched_cfq。</p><h3 id="请求提交与调度" tabindex="-1">请求提交与调度 <a class="header-anchor" href="#请求提交与调度" aria-label="Permalink to &quot;请求提交与调度&quot;">​</a></h3><p>接下来，我们回到generic_make_request函数中。调用队列的make_request_fn函数，其实就是调用blk_queue_bio。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static blk_qc_t blk_queue_bio(struct request_queue *q, struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct request *req, *free;</span></span>
<span class="line"><span>	unsigned int request_count = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch (elv_merge(q, &amp;req, bio)) {</span></span>
<span class="line"><span>	case ELEVATOR_BACK_MERGE:</span></span>
<span class="line"><span>		if (!bio_attempt_back_merge(q, req, bio))</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		elv_bio_merged(q, req, bio);</span></span>
<span class="line"><span>		free = attempt_back_merge(q, req);</span></span>
<span class="line"><span>		if (free)</span></span>
<span class="line"><span>			__blk_put_request(q, free);</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			elv_merged_request(q, req, ELEVATOR_BACK_MERGE);</span></span>
<span class="line"><span>		goto out_unlock;</span></span>
<span class="line"><span>	case ELEVATOR_FRONT_MERGE:</span></span>
<span class="line"><span>		if (!bio_attempt_front_merge(q, req, bio))</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		elv_bio_merged(q, req, bio);</span></span>
<span class="line"><span>		free = attempt_front_merge(q, req);</span></span>
<span class="line"><span>		if (free)</span></span>
<span class="line"><span>			__blk_put_request(q, free);</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			elv_merged_request(q, req, ELEVATOR_FRONT_MERGE);</span></span>
<span class="line"><span>		goto out_unlock;</span></span>
<span class="line"><span>	default:</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>get_rq:</span></span>
<span class="line"><span>	req = get_request(q, bio-&amp;gt;bi_opf, bio, GFP_NOIO);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	blk_init_request_from_bio(req, bio);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	add_acct_request(q, req, where);</span></span>
<span class="line"><span>	__blk_run_queue(q);</span></span>
<span class="line"><span>out_unlock:</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return BLK_QC_T_NONE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>blk_queue_bio首先做的一件事情是调用elv_merge来判断，当前这个bio请求是否能够和目前已有的request合并起来，成为同一批I/O操作，从而提高读取和写入的性能。</p><p>判断标准和struct bio的成员struct bvec_iter有关，它里面有两个变量，一个是起始磁盘簇bi_sector，另一个是大小bi_size。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum elv_merge elv_merge(struct request_queue *q, struct request **req,</span></span>
<span class="line"><span>		struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct elevator_queue *e = q-&amp;gt;elevator;</span></span>
<span class="line"><span>	struct request *__rq;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (q-&amp;gt;last_merge &amp;&amp; elv_bio_merge_ok(q-&amp;gt;last_merge, bio)) {</span></span>
<span class="line"><span>		enum elv_merge ret = blk_try_merge(q-&amp;gt;last_merge, bio);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (ret != ELEVATOR_NO_MERGE) {</span></span>
<span class="line"><span>			*req = q-&amp;gt;last_merge;</span></span>
<span class="line"><span>			return ret;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	__rq = elv_rqhash_find(q, bio-&amp;gt;bi_iter.bi_sector);</span></span>
<span class="line"><span>	if (__rq &amp;&amp; elv_bio_merge_ok(__rq, bio)) {</span></span>
<span class="line"><span>		*req = __rq;</span></span>
<span class="line"><span>		return ELEVATOR_BACK_MERGE;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (e-&amp;gt;uses_mq &amp;&amp; e-&amp;gt;type-&amp;gt;ops.mq.request_merge)</span></span>
<span class="line"><span>		return e-&amp;gt;type-&amp;gt;ops.mq.request_merge(q, req, bio);</span></span>
<span class="line"><span>	else if (!e-&amp;gt;uses_mq &amp;&amp; e-&amp;gt;type-&amp;gt;ops.sq.elevator_merge_fn)</span></span>
<span class="line"><span>		return e-&amp;gt;type-&amp;gt;ops.sq.elevator_merge_fn(q, req, bio);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return ELEVATOR_NO_MERGE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>elv_merge尝试了三次合并。</p><p>第一次，它先判断和上一次合并的request能不能再次合并，看看能不能赶上马上要走的这部电梯。在blk_try_merge主要做了这样的判断：如果blk_rq_pos(rq) + blk_rq_sectors(rq) == bio-&gt;bi_iter.bi_sector，也就是说这个request的起始地址加上它的大小（其实是这个request的结束地址），如果和bio的起始地址能接得上，那就把bio放在request的最后，我们称为ELEVATOR_BACK_MERGE。</p><p>如果blk_rq_pos(rq) - bio_sectors(bio) == bio-&gt;bi_iter.bi_sector，也就是说，这个request的起始地址减去bio的大小等于bio的起始地址，这说明bio放在request的最前面能够接得上，那就把bio放在request的最前面，我们称为ELEVATOR_FRONT_MERGE。否则，那就不合并，我们称为ELEVATOR_NO_MERGE。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum elv_merge blk_try_merge(struct request *rq, struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (blk_rq_pos(rq) + blk_rq_sectors(rq) == bio-&amp;gt;bi_iter.bi_sector)</span></span>
<span class="line"><span>		return ELEVATOR_BACK_MERGE;</span></span>
<span class="line"><span>	else if (blk_rq_pos(rq) - bio_sectors(bio) == bio-&amp;gt;bi_iter.bi_sector)</span></span>
<span class="line"><span>		return ELEVATOR_FRONT_MERGE;</span></span>
<span class="line"><span>	return ELEVATOR_NO_MERGE;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>第二次，如果和上一个合并过的request无法合并，那我们就调用elv_rqhash_find。然后按照bio的起始地址查找request，看有没有能够合并的。如果有的话，因为是按照起始地址找的，应该接在人家的后面，所以是ELEVATOR_BACK_MERGE。</p><p>第三次，调用elevator_merge_fn试图合并。对于iosched_cfq，调用的是cfq_merge。在这里面，cfq_find_rq_fmerge会调用elv_rb_find函数，里面的参数是bio的结束地址。我们还是要看，能不能找到可以合并的。如果有的话，因为是按照结束地址找的，应该接在人家前面，所以是ELEVATOR_FRONT_MERGE。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static enum elv_merge cfq_merge(struct request_queue *q, struct request **req,</span></span>
<span class="line"><span>		     struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cfq_data *cfqd = q-&amp;gt;elevator-&amp;gt;elevator_data;</span></span>
<span class="line"><span>	struct request *__rq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	__rq = cfq_find_rq_fmerge(cfqd, bio);</span></span>
<span class="line"><span>	if (__rq &amp;&amp; elv_bio_merge_ok(__rq, bio)) {</span></span>
<span class="line"><span>		*req = __rq;</span></span>
<span class="line"><span>		return ELEVATOR_FRONT_MERGE;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return ELEVATOR_NO_MERGE;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct request *</span></span>
<span class="line"><span>cfq_find_rq_fmerge(struct cfq_data *cfqd, struct bio *bio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_struct *tsk = current;</span></span>
<span class="line"><span>	struct cfq_io_cq *cic;</span></span>
<span class="line"><span>	struct cfq_queue *cfqq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	cic = cfq_cic_lookup(cfqd, tsk-&amp;gt;io_context);</span></span>
<span class="line"><span>	if (!cic)</span></span>
<span class="line"><span>		return NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	cfqq = cic_to_cfqq(cic, op_is_sync(bio-&amp;gt;bi_opf));</span></span>
<span class="line"><span>	if (cfqq)</span></span>
<span class="line"><span>		return elv_rb_find(&amp;cfqq-&amp;gt;sort_list, bio_end_sector(bio));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return NUL</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>等从elv_merge返回blk_queue_bio的时候，我们就知道，应该做哪种类型的合并，接着就要进行真的合并。如果没有办法合并，那就调用get_request，创建一个新的request，调用blk_init_request_from_bio，将bio放到新的request里面，然后调用add_acct_request，把新的request加到request_queue队列中。</p><p>至此，我们解析完了generic_make_request中最重要的两大逻辑：获取一个请求队列request_queue和调用这个队列的make_request_fn函数。</p><p>其实，generic_make_request其他部分也很令人困惑。感觉里面有特别多的struct bio_list，倒腾过来，倒腾过去的。这是因为，很多块设备是有层次的。</p><p>比如，我们用两块硬盘组成RAID，两个RAID盘组成LVM，然后我们就可以在LVM上创建一个块设备给用户用，我们称接近用户的块设备为 <strong>高层次的块设备</strong>，接近底层的块设备为 <strong>低层次</strong>（lower） <strong>的块设备</strong>。这样，generic_make_request把I/O请求发送给高层次的块设备的时候，会调用高层块设备的make_request_fn，高层块设备又要调用generic_make_request，将请求发送给低层次的块设备。虽然块设备的层次不会太多，但是对于代码generic_make_request来讲，这可是递归的调用，一不小心，就会递归过深，无法正常退出，而且内核栈的大小又非常有限，所以要比较小心。</p><p>这里你是否理解了struct bio_list bio_list_on_stack[2]的名字为什么叫stack呢？其实，将栈的操作变成对于队列的操作，队列不在栈里面，会大很多。每次generic_make_request被当前任务调用的时候，将current-&gt;bio_list设置为bio_list_on_stack，并在generic_make_request的一开始就判断current-&gt;bio_list是否为空。如果不为空，说明已经在generic_make_request的调用里面了，就不必调用make_request_fn进行递归了，直接把请求加入到bio_list里面就可以了，这就实现了递归的及时退出。</p><p>如果current-&gt;bio_list为空，那我们就将current-&gt;bio_list设置为bio_list_on_stack后，进入do-while循环，做咱们分析过的generic_make_request的两大逻辑。但是，当前的队列调用make_request_fn的时候，在make_request_fn的具体实现中，会生成新的bio。调用更底层的块设备，也会生成新的bio，都会放在bio_list_on_stack的队列中，是一个边处理还边创建的过程。</p><p>bio_list_on_stack[1] = bio_list_on_stack[0]这一句在make_request_fn之前，将之前队列里面遗留没有处理的保存下来，接着bio_list_init将bio_list_on_stack[0]设置为空，然后调用make_request_fn，在make_request_fn里面如果有新的bio生成，都会加到bio_list_on_stack[0]这个队列里面来。</p><p>make_request_fn执行完毕后，可以想象bio_list_on_stack[0]可能又多了一些bio了，接下来的循环中调用bio_list_pop将bio_list_on_stack[0]积攒的bio拿出来，分别放在两个队列lower和same中，顾名思义，lower就是更低层次的块设备的bio，same是同层次的块设备的bio。</p><p>接下来我们能将lower、same以及bio_list_on_stack[1] 都取出来，放在bio_list_on_stack[0]统一进行处理。当然应该lower优先了，因为只有底层的块设备的I/O做完了，上层的块设备的I/O才能做完。</p><p>到这里，generic_make_request的逻辑才算解析完毕。对于写入的数据来讲，其实仅仅是将bio请求放在请求队列上，设备驱动程序还没往设备里面写呢。</p><h3 id="请求的处理" tabindex="-1">请求的处理 <a class="header-anchor" href="#请求的处理" aria-label="Permalink to &quot;请求的处理&quot;">​</a></h3><p>设备驱动程序往设备里面写，调用的是请求队列request_queue的另外一个函数request_fn。对于scsi设备来讲，调用的是scsi_request_fn。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void scsi_request_fn(struct request_queue *q)</span></span>
<span class="line"><span>	__releases(q-&amp;gt;queue_lock)</span></span>
<span class="line"><span>	__acquires(q-&amp;gt;queue_lock)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct scsi_device *sdev = q-&amp;gt;queuedata;</span></span>
<span class="line"><span>	struct Scsi_Host *shost;</span></span>
<span class="line"><span>	struct scsi_cmnd *cmd;</span></span>
<span class="line"><span>	struct request *req;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * To start with, we keep looping until the queue is empty, or until</span></span>
<span class="line"><span>	 * the host is no longer able to accept any more requests.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	shost = sdev-&amp;gt;host;</span></span>
<span class="line"><span>	for (;;) {</span></span>
<span class="line"><span>		int rtn;</span></span>
<span class="line"><span>		/*</span></span>
<span class="line"><span>		 * get next queueable request.  We do this early to make sure</span></span>
<span class="line"><span>		 * that the request is fully prepared even if we cannot</span></span>
<span class="line"><span>		 * accept it.</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		req = blk_peek_request(q);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/*</span></span>
<span class="line"><span>		 * Remove the request from the request list.</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		if (!(blk_queue_tagged(q) &amp;&amp; !blk_queue_start_tag(q, req)))</span></span>
<span class="line"><span>			blk_start_request(req);</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>		cmd = req-&amp;gt;special;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/*</span></span>
<span class="line"><span>		 * Dispatch the command to the low-level driver.</span></span>
<span class="line"><span>		 */</span></span>
<span class="line"><span>		cmd-&amp;gt;scsi_done = scsi_done;</span></span>
<span class="line"><span>		rtn = scsi_dispatch_cmd(cmd);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面是一个for无限循环，从request_queue中读取request，然后封装更加底层的指令，给设备控制器下指令，实施真正的I/O操作。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节我们讲了如何将块设备I/O请求送达到外部设备。</p><p>对于块设备的I/O操作分为两种，一种是直接I/O，另一种是缓存I/O。无论是哪种I/O，最终都会调用submit_bio提交块设备I/O请求。</p><p>对于每一种块设备，都有一个gendisk表示这个设备，它有一个请求队列，这个队列是一系列的request对象。每个request对象里面包含多个BIO对象，指向page cache。所谓的写入块设备，I/O就是将page cache里面的数据写入硬盘。</p><p>对于请求队列来讲，还有两个函数，一个函数叫make_request_fn函数，用于将请求放入队列。submit_bio会调用generic_make_request，然后调用这个函数。</p><p>另一个函数往往在设备驱动程序里实现，我们叫request_fn函数，它用于从队列里面取出请求来，写入外部设备。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/101397/c9f6a08075ba4eae3314523fa258363c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/101397/c9f6a08075ba4eae3314523fa258363c.png" alt=""></a></p><p>至此，整个写入文件的过程才算完全结束。这真是个复杂的过程，涉及系统调用、内存管理、文件系统和输入输出。这足以说明，操作系统真的是一个非常复杂的体系，环环相扣，需要分层次层层展开来学习。</p><p>到这里，专栏已经过半了，你应该能发现，很多我之前说“后面会细讲”的东西，现在正在一点一点解释清楚，而文中越来越多出现“前面我们讲过”的字眼，你是否当时学习前面知识的时候，没有在意，导致学习后面的知识产生困惑了呢？没关系，及时倒回去复习，再回过头去看，当初学过的很多知识会变得清晰很多。</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你知道如何查看磁盘调度算法、修改磁盘调度算法以及I/O队列的长度吗？</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/101397/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/101397/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,96)])])}const d=n(t,[["render",i]]);export{b as __pageData,d as default};
