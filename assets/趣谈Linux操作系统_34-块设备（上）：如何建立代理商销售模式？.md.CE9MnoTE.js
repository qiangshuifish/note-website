import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"34 | 块设备（上）：如何建立代理商销售模式？","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/34-块设备（上）：如何建立代理商销售模式？.md","filePath":"趣谈Linux操作系统/34-块设备（上）：如何建立代理商销售模式？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/34-块设备（上）：如何建立代理商销售模式？.md"};function l(i,s,c,d,o,_){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_34-块设备-上-如何建立代理商销售模式" tabindex="-1">34 | 块设备（上）：如何建立代理商销售模式？ <a class="header-anchor" href="#_34-块设备-上-如何建立代理商销售模式" aria-label="Permalink to &quot;34 | 块设备（上）：如何建立代理商销售模式？&quot;">​</a></h1><p>上一章，我们解析了文件系统，最后讲文件系统读写的流程到达底层的时候，没有更深入地分析下去，这是因为文件系统再往下就是硬盘设备了。上两节，我们解析了字符设备的mknod、打开和读写流程。那这一节我们就来讲块设备的mknod、打开流程，以及文件系统和下层的硬盘设备的读写流程。</p><p>块设备一般会被格式化为文件系统，但是，下面的讲述中，你可能会有一点困惑。你会看到各种各样的dentry和inode。块设备涉及三种文件系统，所以你看到的这些dentry和inode可能都不是一回事儿，请注意分辨。</p><p>块设备需要mknod吗？对于启动盘，你可能觉得，启动了就在那里了。可是如果我们要插进一块新的USB盘，还是要有这个操作的。</p><p>mknod还是会创建在/dev路径下面，这一点和字符设备一样。/dev路径下面是devtmpfs文件系统。 <strong>这是块设备遇到的第一个文件系统</strong>。我们会为这个块设备文件，分配一个特殊的inode，这一点和字符设备也是一样的。只不过字符设备走S_ISCHR这个分支，对应inode的file_operations是def_chr_fops；而块设备走S_ISBLK这个分支，对应的inode的file_operations是def_blk_fops。这里要注意，inode里面的i_rdev被设置成了块设备的设备号dev_t，这个我们后面会用到，你先记住有这么一回事儿。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_special_inode(struct inode *inode, umode_t mode, dev_t rdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	inode-&amp;gt;i_mode = mode;</span></span>
<span class="line"><span>	if (S_ISCHR(mode)) {</span></span>
<span class="line"><span>		inode-&amp;gt;i_fop = &amp;def_chr_fops;</span></span>
<span class="line"><span>		inode-&amp;gt;i_rdev = rdev;</span></span>
<span class="line"><span>	} else if (S_ISBLK(mode)) {</span></span>
<span class="line"><span>		inode-&amp;gt;i_fop = &amp;def_blk_fops;</span></span>
<span class="line"><span>		inode-&amp;gt;i_rdev = rdev;</span></span>
<span class="line"><span>	} else if (S_ISFIFO(mode))</span></span>
<span class="line"><span>		inode-&amp;gt;i_fop = &amp;pipefifo_fops;</span></span>
<span class="line"><span>	else if (S_ISSOCK(mode))</span></span>
<span class="line"><span>		;	/* leave it no_open_fops */</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>特殊inode的默认file_operations是def_blk_fops，就像字符设备一样，有打开、读写这个块设备文件，但是我们常规操作不会这样做。我们会将这个块设备文件mount到一个文件夹下面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct file_operations def_blk_fops = {</span></span>
<span class="line"><span>        .open           = blkdev_open,</span></span>
<span class="line"><span>        .release        = blkdev_close,</span></span>
<span class="line"><span>        .llseek         = block_llseek,</span></span>
<span class="line"><span>        .read_iter      = blkdev_read_iter,</span></span>
<span class="line"><span>        .write_iter     = blkdev_write_iter,</span></span>
<span class="line"><span>        .mmap           = generic_file_mmap,</span></span>
<span class="line"><span>        .fsync          = blkdev_fsync,</span></span>
<span class="line"><span>        .unlocked_ioctl = block_ioctl,</span></span>
<span class="line"><span>        .splice_read    = generic_file_splice_read,</span></span>
<span class="line"><span>        .splice_write   = iter_file_splice_write,</span></span>
<span class="line"><span>        .fallocate      = blkdev_fallocate,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>不过，这里我们还是简单看一下，打开这个块设备的操作blkdev_open。它里面调用的是blkdev_get打开这个块设备，了解到这一点就可以了。</p><p>接下来，我们要调用mount，将这个块设备文件挂载到一个文件夹下面。如果这个块设备原来被格式化为一种文件系统的格式，例如ext4，那我们调用的就是ext4相应的mount操作。 <strong>这是块设备遇到的第二个文件系统</strong>，也是向这个块设备读写文件，需要基于的主流文件系统。咱们在文件系统那一节解析的对于文件的读写流程，都是基于这个文件系统的。</p><p>还记得，咱们注册ext4文件系统的时候，有下面这样的结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct file_system_type ext4_fs_type = {</span></span>
<span class="line"><span>	.owner		= THIS_MODULE,</span></span>
<span class="line"><span>	.name		= &quot;ext4&quot;,</span></span>
<span class="line"><span>	.mount		= ext4_mount,</span></span>
<span class="line"><span>	.kill_sb	= kill_block_super,</span></span>
<span class="line"><span>	.fs_flags	= FS_REQUIRES_DEV,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在将一个硬盘的块设备mount成为ext4的时候，我们会调用ext4_mount-&gt;mount_bdev。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct dentry *ext4_mount(struct file_system_type *fs_type, int flags, const char *dev_name, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return mount_bdev(fs_type, flags, dev_name, data, ext4_fill_super);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct dentry *mount_bdev(struct file_system_type *fs_type,</span></span>
<span class="line"><span>	int flags, const char *dev_name, void *data,</span></span>
<span class="line"><span>	int (*fill_super)(struct super_block *, void *, int))</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct block_device *bdev;</span></span>
<span class="line"><span>	struct super_block *s;</span></span>
<span class="line"><span>	fmode_t mode = FMODE_READ | FMODE_EXCL;</span></span>
<span class="line"><span>	int error = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!(flags &amp; MS_RDONLY))</span></span>
<span class="line"><span>		mode |= FMODE_WRITE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	bdev = blkdev_get_by_path(dev_name, mode, fs_type);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	s = sget(fs_type, test_bdev_super, set_bdev_super, flags | MS_NOSEC, bdev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return dget(s-&amp;gt;s_root);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>mount_bdev主要做了两件大事情。第一，blkdev_get_by_path根据/dev/xxx这个名字，找到相应的设备并打开它；第二，sget根据打开的设备文件，填充ext4文件系统的super_block，从而以此为基础，建立一整套咱们在文件系统那一章讲的体系。</p><p>一旦这套体系建立起来以后，对于文件的读写都是通过ext4文件系统这个体系进行的，创建的inode结构也是指向ext4文件系统的。文件系统那一章我们只解析了这部分，由于没有到达底层，也就没有关注块设备相关的操作。这一章我们重新回过头来，一方面看mount的时候，对于块设备都做了哪些操作，另一方面看读写的时候，到了底层，对于块设备做了哪些操作。</p><p>这里我们先来看mount_bdev做的第一件大事情，通过blkdev_get_by_path，根据设备名/dev/xxx，得到struct block_device *bdev。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * blkdev_get_by_path - open a block device by name</span></span>
<span class="line"><span> * &amp;#64;path: path to the block device to open</span></span>
<span class="line"><span> * &amp;#64;mode: FMODE_* mask</span></span>
<span class="line"><span> * &amp;#64;holder: exclusive holder identifier</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Open the blockdevice described by the device file at &amp;#64;path.  &amp;#64;mode</span></span>
<span class="line"><span> * and &amp;#64;holder are identical to blkdev_get().</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * On success, the returned block_device has reference count of one.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct block_device *blkdev_get_by_path(const char *path, fmode_t mode,</span></span>
<span class="line"><span>					void *holder)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct block_device *bdev;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	bdev = lookup_bdev(path);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = blkdev_get(bdev, mode, holder);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return bdev;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>blkdev_get_by_path干了两件事情。第一个，lookup_bdev根据设备路径/dev/xxx得到block_device。第二个，打开这个设备，调用blkdev_get。</p><p>咱们上面分析过def_blk_fops的默认打开设备函数blkdev_open，它也是调用blkdev_get的。块设备的打开往往不是直接调用设备文件的打开函数，而是调用mount来打开的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * lookup_bdev  - lookup a struct block_device by name</span></span>
<span class="line"><span> * &amp;#64;pathname:	special file representing the block device</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Get a reference to the blockdevice at &amp;#64;pathname in the current</span></span>
<span class="line"><span> * namespace if possible and return it.  Return ERR_PTR(error)</span></span>
<span class="line"><span> * otherwise.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct block_device *lookup_bdev(const char *pathname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct block_device *bdev;</span></span>
<span class="line"><span>	struct inode *inode;</span></span>
<span class="line"><span>	struct path path;</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!pathname || !*pathname)</span></span>
<span class="line"><span>		return ERR_PTR(-EINVAL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = kern_path(pathname, LOOKUP_FOLLOW, &amp;path);</span></span>
<span class="line"><span>	if (error)</span></span>
<span class="line"><span>		return ERR_PTR(error);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	inode = d_backing_inode(path.dentry);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	bdev = bd_acquire(inode);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	goto out;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>lookup_bdev这里的pathname是设备的文件名，例如/dev/xxx。这个文件是在devtmpfs文件系统中的，kern_path可以在这个文件系统里面，一直找到它对应的dentry。接下来，d_backing_inode会获得inode。这个inode就是那个init_special_inode生成的特殊inode。</p><p>接下来，bd_acquire通过这个特殊的inode，找到struct block_device。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct block_device *bd_acquire(struct inode *inode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct block_device *bdev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	bdev = bdget(inode-&amp;gt;i_rdev);</span></span>
<span class="line"><span>	if (bdev) {</span></span>
<span class="line"><span>		spin_lock(&amp;bdev_lock);</span></span>
<span class="line"><span>		if (!inode-&amp;gt;i_bdev) {</span></span>
<span class="line"><span>			/*</span></span>
<span class="line"><span>			 * We take an additional reference to bd_inode,</span></span>
<span class="line"><span>			 * and it&#39;s released in clear_inode() of inode.</span></span>
<span class="line"><span>			 * So, we can access it via -&amp;gt;i_mapping always</span></span>
<span class="line"><span>			 * without igrab().</span></span>
<span class="line"><span>			 */</span></span>
<span class="line"><span>			bdgrab(bdev);</span></span>
<span class="line"><span>			inode-&amp;gt;i_bdev = bdev;</span></span>
<span class="line"><span>			inode-&amp;gt;i_mapping = bdev-&amp;gt;bd_inode-&amp;gt;i_mapping;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return bdev;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>bd_acquire中最主要的就是调用bdget，它的参数是特殊inode的i_rdev。这里面在mknod的时候，放的是设备号dev_t。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct block_device *bdget(dev_t dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        struct block_device *bdev;</span></span>
<span class="line"><span>        struct inode *inode;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inode = iget5_locked(blockdev_superblock, hash(dev),</span></span>
<span class="line"><span>                        bdev_test, bdev_set, &amp;dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        bdev = &amp;BDEV_I(inode)-&amp;gt;bdev;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (inode-&amp;gt;i_state &amp; I_NEW) {</span></span>
<span class="line"><span>                bdev-&amp;gt;bd_contains = NULL;</span></span>
<span class="line"><span>                bdev-&amp;gt;bd_super = NULL;</span></span>
<span class="line"><span>                bdev-&amp;gt;bd_inode = inode;</span></span>
<span class="line"><span>                bdev-&amp;gt;bd_block_size = i_blocksize(inode);</span></span>
<span class="line"><span>                bdev-&amp;gt;bd_part_count = 0;</span></span>
<span class="line"><span>                bdev-&amp;gt;bd_invalidated = 0;</span></span>
<span class="line"><span>                inode-&amp;gt;i_mode = S_IFBLK;</span></span>
<span class="line"><span>                inode-&amp;gt;i_rdev = dev;</span></span>
<span class="line"><span>                inode-&amp;gt;i_bdev = bdev;</span></span>
<span class="line"><span>                inode-&amp;gt;i_data.a_ops = &amp;def_blk_aops;</span></span>
<span class="line"><span>                mapping_set_gfp_mask(&amp;inode-&amp;gt;i_data, GFP_USER);</span></span>
<span class="line"><span>                spin_lock(&amp;bdev_lock);</span></span>
<span class="line"><span>                list_add(&amp;bdev-&amp;gt;bd_list, &amp;all_bdevs);</span></span>
<span class="line"><span>                spin_unlock(&amp;bdev_lock);</span></span>
<span class="line"><span>                unlock_new_inode(inode);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return bdev;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>在bdget中，我们遇到了第三个文件系统，bdev伪文件系统</strong>。bdget函数根据传进来的dev_t，在blockdev_superblock这个文件系统里面找到inode。这里注意，这个inode已经不是devtmpfs文件系统的inode了。blockdev_superblock的初始化在整个系统初始化的时候，会调用bdev_cache_init进行初始化。它的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct super_block *blockdev_superblock __read_mostly;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file_system_type bd_type = {</span></span>
<span class="line"><span>        .name           = &quot;bdev&quot;,</span></span>
<span class="line"><span>        .mount          = bd_mount,</span></span>
<span class="line"><span>        .kill_sb        = kill_anon_super,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void __init bdev_cache_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        int err;</span></span>
<span class="line"><span>        static struct vfsmount *bd_mnt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        bdev_cachep = kmem_cache_create(&quot;bdev_cache&quot;, sizeof(struct bdev_inode), 0, (SLAB_HWCACHE_ALIGN|SLAB_RECLAIM_ACCOUNT|SLAB_MEM_SPREAD|SLAB_ACCOUNT|SLAB_PANIC), init_once);</span></span>
<span class="line"><span>        err = register_filesystem(&amp;bd_type);</span></span>
<span class="line"><span>        if (err)</span></span>
<span class="line"><span>                panic(&quot;Cannot register bdev pseudo-fs&quot;);</span></span>
<span class="line"><span>        bd_mnt = kern_mount(&amp;bd_type);</span></span>
<span class="line"><span>        if (IS_ERR(bd_mnt))</span></span>
<span class="line"><span>                panic(&quot;Cannot create bdev pseudo-fs&quot;);</span></span>
<span class="line"><span>        blockdev_superblock = bd_mnt-&amp;gt;mnt_sb;   /* For writeback */</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所有表示块设备的inode都保存在伪文件系统 bdev中，这些对用户层不可见，主要为了方便块设备的管理。Linux将块设备的block_device和bdev文件系统的块设备的inode，通过struct bdev_inode进行关联。所以，在bdget中，BDEV_I就是通过bdev文件系统的inode，获得整个struct bdev_inode结构的地址，然后取成员bdev，得到block_device。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct bdev_inode {</span></span>
<span class="line"><span>	struct block_device bdev;</span></span>
<span class="line"><span>	struct inode vfs_inode;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>绕了一大圈，我们终于通过设备文件/dev/xxx，获得了设备的结构block_device。有点儿绕，我们再捋一下。设备文件/dev/xxx在devtmpfs文件系统中，找到devtmpfs文件系统中的inode，里面有dev_t。我们可以通过dev_t，在伪文件系统 bdev中找到对应的inode，然后根据struct bdev_inode找到关联的block_device。</p><p>接下来，blkdev_get_by_path开始做第二件事情，在找到block_device之后，要调用blkdev_get打开这个设备。blkdev_get会调用__blkdev_get。</p><p>在分析打开一个设备之前，我们先来看block_device这个结构是什么样的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct block_device {</span></span>
<span class="line"><span>	dev_t			bd_dev;  /* not a kdev_t - it&#39;s a search key */</span></span>
<span class="line"><span>	int			bd_openers;</span></span>
<span class="line"><span>	struct super_block *	bd_super;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct block_device *	bd_contains;</span></span>
<span class="line"><span>	unsigned		bd_block_size;</span></span>
<span class="line"><span>	struct hd_struct *	bd_part;</span></span>
<span class="line"><span>	unsigned		bd_part_count;</span></span>
<span class="line"><span>	int			bd_invalidated;</span></span>
<span class="line"><span>	struct gendisk *	bd_disk;</span></span>
<span class="line"><span>	struct request_queue *  bd_queue;</span></span>
<span class="line"><span>	struct backing_dev_info *bd_bdi;</span></span>
<span class="line"><span>	struct list_head	bd_list;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>} ;</span></span></code></pre></div><p>你应该能发现，这个结构和其他几个结构有着千丝万缕的联系，比较复杂。这是因为块设备本身就比较复杂。</p><p>比方说，我们有一个磁盘/dev/sda，我们既可以把它整个格式化成一个文件系统，也可以把它分成多个分区/dev/sda1、 /dev/sda2，然后把每个分区格式化成不同的文件系统。如果我们访问某个分区的设备文件/dev/sda2，我们应该能知道它是哪个磁盘设备的。按说它们的驱动应该是一样的。如果我们访问整个磁盘的设备文件/dev/sda，我们也应该能知道它分了几个区域，所以就有了下图这个复杂的关系结构。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100942/85f4d83e7ebf2aadf7ffcd5fd393b176.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100942/85f4d83e7ebf2aadf7ffcd5fd393b176.png" alt=""></a></p><p>struct gendisk是用来描述整个设备的，因而上面的例子中，gendisk只有一个实例，指向/dev/sda。它的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct gendisk {</span></span>
<span class="line"><span>	int major;			/* major number of driver */</span></span>
<span class="line"><span>	int first_minor;</span></span>
<span class="line"><span>	int minors;                     /* maximum number of minors, =1 for disks that can&#39;t be partitioned. */</span></span>
<span class="line"><span>	char disk_name[DISK_NAME_LEN];	/* name of major driver */</span></span>
<span class="line"><span>	char *(*devnode)(struct gendisk *gd, umode_t *mode);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct disk_part_tbl __rcu *part_tbl;</span></span>
<span class="line"><span>	struct hd_struct part0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	const struct block_device_operations *fops;</span></span>
<span class="line"><span>	struct request_queue *queue;</span></span>
<span class="line"><span>	void *private_data;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	int flags;</span></span>
<span class="line"><span>	struct kobject *slave_dir;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这里major是主设备号，first_minor表示第一个分区的从设备号，minors表示分区的数目。</p><p>disk_name给出了磁盘块设备的名称。</p><p>struct disk_part_tbl结构里是一个struct hd_struct的数组，用于表示各个分区。struct block_device_operations fops指向对于这个块设备的各种操作。struct request_queue queue是表示在这个块设备上的请求队列。</p><p>struct hd_struct是用来表示某个分区的，在上面的例子中，有两个hd_struct的实例，分别指向/dev/sda1、 /dev/sda2。它的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct hd_struct {</span></span>
<span class="line"><span>	sector_t start_sect;</span></span>
<span class="line"><span>	sector_t nr_sects;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct device __dev;</span></span>
<span class="line"><span>	struct kobject *holder_dir;</span></span>
<span class="line"><span>	int policy, partno;</span></span>
<span class="line"><span>	struct partition_meta_info *info;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct disk_stats dkstats;</span></span>
<span class="line"><span>	struct percpu_ref ref;</span></span>
<span class="line"><span>	struct rcu_head rcu_head;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在hd_struct中，比较重要的成员变量保存了如下的信息：从磁盘的哪个扇区开始，到哪个扇区结束。</p><p>而block_device既可以表示整个块设备，也可以表示某个分区，所以对于上面的例子，block_device有三个实例，分别指向/dev/sda1、/dev/sda2、/dev/sda。</p><p>block_device的成员变量bd_disk，指向的gendisk就是整个块设备。这三个实例都指向同一个gendisk。bd_part指向的某个分区的hd_struct，bd_contains指向的是整个块设备的block_device。</p><p>了解了这些复杂的关系，我们再来看打开设备文件的代码，就会清晰很多。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __blkdev_get(struct block_device *bdev, fmode_t mode, int for_part)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct gendisk *disk;</span></span>
<span class="line"><span>	struct module *owner;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span>	int partno;</span></span>
<span class="line"><span>	int perm = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (mode &amp; FMODE_READ)</span></span>
<span class="line"><span>		perm |= MAY_READ;</span></span>
<span class="line"><span>	if (mode &amp; FMODE_WRITE)</span></span>
<span class="line"><span>		perm |= MAY_WRITE;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	disk = get_gendisk(bdev-&amp;gt;bd_dev, &amp;partno);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	owner = disk-&amp;gt;fops-&amp;gt;owner;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (!bdev-&amp;gt;bd_openers) {</span></span>
<span class="line"><span>		bdev-&amp;gt;bd_disk = disk;</span></span>
<span class="line"><span>		bdev-&amp;gt;bd_queue = disk-&amp;gt;queue;</span></span>
<span class="line"><span>		bdev-&amp;gt;bd_contains = bdev;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (!partno) {</span></span>
<span class="line"><span>			ret = -ENXIO;</span></span>
<span class="line"><span>			bdev-&amp;gt;bd_part = disk_get_part(disk, partno);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			if (disk-&amp;gt;fops-&amp;gt;open) {</span></span>
<span class="line"><span>				ret = disk-&amp;gt;fops-&amp;gt;open(bdev, mode);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (!ret)</span></span>
<span class="line"><span>				bd_set_size(bdev,(loff_t)get_capacity(disk)&amp;lt;&amp;lt;9);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (bdev-&amp;gt;bd_invalidated) {</span></span>
<span class="line"><span>				if (!ret)</span></span>
<span class="line"><span>					rescan_partitions(disk, bdev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			struct block_device *whole;</span></span>
<span class="line"><span>			whole = bdget_disk(disk, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			ret = __blkdev_get(whole, mode, 1);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			bdev-&amp;gt;bd_contains = whole;</span></span>
<span class="line"><span>			bdev-&amp;gt;bd_part = disk_get_part(disk, partno);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			bd_set_size(bdev, (loff_t)bdev-&amp;gt;bd_part-&amp;gt;nr_sects &amp;lt;&amp;lt; 9);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	bdev-&amp;gt;bd_openers++;</span></span>
<span class="line"><span>	if (for_part)</span></span>
<span class="line"><span>		bdev-&amp;gt;bd_part_count++;</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在__blkdev_get函数中，我们先调用get_gendisk，根据block_device获取gendisk。具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * get_gendisk - get partitioning information for a given device</span></span>
<span class="line"><span> * &amp;#64;devt: device to get partitioning information for</span></span>
<span class="line"><span> * &amp;#64;partno: returned partition index</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * This function gets the structure containing partitioning</span></span>
<span class="line"><span> * information for the given device &amp;#64;devt.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct gendisk *get_gendisk(dev_t devt, int *partno)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct gendisk *disk = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (MAJOR(devt) != BLOCK_EXT_MAJOR) {</span></span>
<span class="line"><span>		struct kobject *kobj;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		kobj = kobj_lookup(bdev_map, devt, partno);</span></span>
<span class="line"><span>		if (kobj)</span></span>
<span class="line"><span>			disk = dev_to_disk(kobj_to_dev(kobj));</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		struct hd_struct *part;</span></span>
<span class="line"><span>		part = idr_find(&amp;ext_devt_idr, blk_mangle_minor(MINOR(devt)));</span></span>
<span class="line"><span>		if (part &amp;&amp; get_disk(part_to_disk(part))) {</span></span>
<span class="line"><span>			*partno = part-&amp;gt;partno;</span></span>
<span class="line"><span>			disk = part_to_disk(part);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return disk;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以想象这里面有两种情况。第一种情况是，block_device是指向整个磁盘设备的。这个时候，我们只需要根据dev_t，在bdev_map中将对应的gendisk拿出来就好。</p><p>bdev_map是干什么的呢？前面咱们学习字符设备驱动的时候讲过，任何一个字符设备初始化的时候，都需要调用__register_chrdev_region，注册这个字符设备。对于块设备也是类似的，每一个块设备驱动初始化的时候，都会调用add_disk注册一个gendisk。</p><p>这里需要说明一下，gen的意思是general通用的意思，也就是说，所有的块设备，不仅仅是硬盘disk，都会用一个gendisk来表示，然后通过调用链add_disk-&gt;device_add_disk-&gt;blk_register_region，将dev_t和一个gendisk关联起来，保存在bdev_map中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct kobj_map *bdev_map;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void add_disk(struct gendisk *disk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	device_add_disk(NULL, disk);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * device_add_disk - add partitioning information to kernel list</span></span>
<span class="line"><span> * &amp;#64;parent: parent device for the disk</span></span>
<span class="line"><span> * &amp;#64;disk: per-device partitioning information</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * This function registers the partitioning information in &amp;#64;disk</span></span>
<span class="line"><span> * with the kernel.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>void device_add_disk(struct device *parent, struct gendisk *disk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>blk_register_region(disk_devt(disk), disk-&amp;gt;minors, NULL,</span></span>
<span class="line"><span>			    exact_match, exact_lock, disk);</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * Register device numbers dev..(dev+range-1)</span></span>
<span class="line"><span> * range must be nonzero</span></span>
<span class="line"><span> * The hash chain is sorted on range, so that subranges can override.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>void blk_register_region(dev_t devt, unsigned long range, struct module *module,</span></span>
<span class="line"><span>			 struct kobject *(*probe)(dev_t, int *, void *),</span></span>
<span class="line"><span>			 int (*lock)(dev_t, void *), void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	kobj_map(bdev_map, devt, range, module, probe, lock, data);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>get_gendisk要处理的第二种情况是，block_device是指向某个分区的。这个时候我们要先得到hd_struct，然后通过hd_struct，找到对应的整个设备的gendisk，并且把partno设置为分区号。</p><p>我们再回到__blkdev_get函数中，得到gendisk。接下来我们可以分两种情况。</p><p>如果partno为0，也就是说，打开的是整个设备而不是分区，那我们就调用disk_get_part，获取gendisk中的分区数组，然后调用block_device_operations里面的open函数打开设备。</p><p>如果partno不为0，也就是说打开的是分区，那我们就获取整个设备的block_device，赋值给变量struct block_device *whole，然后调用递归__blkdev_get，打开whole代表的整个设备，将bd_contains设置为变量whole。</p><p>block_device_operations就是在驱动层了。例如在drivers/scsi/sd.c里面，也就是MODULE_DESCRIPTION(“SCSI disk (sd) driver”)中，就有这样的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct block_device_operations sd_fops = {</span></span>
<span class="line"><span>	.owner			= THIS_MODULE,</span></span>
<span class="line"><span>	.open			= sd_open,</span></span>
<span class="line"><span>	.release		= sd_release,</span></span>
<span class="line"><span>	.ioctl			= sd_ioctl,</span></span>
<span class="line"><span>	.getgeo			= sd_getgeo,</span></span>
<span class="line"><span>#ifdef CONFIG_COMPAT</span></span>
<span class="line"><span>	.compat_ioctl		= sd_compat_ioctl,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	.check_events		= sd_check_events,</span></span>
<span class="line"><span>	.revalidate_disk	= sd_revalidate_disk,</span></span>
<span class="line"><span>	.unlock_native_capacity	= sd_unlock_native_capacity,</span></span>
<span class="line"><span>	.pr_ops			= &amp;sd_pr_ops,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> *	sd_open - open a scsi disk device</span></span>
<span class="line"><span> *	&amp;#64;bdev: Block device of the scsi disk to open</span></span>
<span class="line"><span> *	&amp;#64;mode: FMODE_* mask</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> *	Returns 0 if successful. Returns a negated errno value in case</span></span>
<span class="line"><span> *	of error.</span></span>
<span class="line"><span> **/</span></span>
<span class="line"><span>static int sd_open(struct block_device *bdev, fmode_t mode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在驱动层打开了磁盘设备之后，我们可以看到，在这个过程中，block_device相应的成员变量该填的都填上了，这才完成了mount_bdev的第一件大事，通过blkdev_get_by_path得到block_device。</p><p>接下来就是第二件大事情，我们要通过sget，将block_device塞进superblock里面。注意，调用sget的时候，有一个参数是一个函数set_bdev_super。这里面将block_device设置进了super_block。而sget要做的，就是分配一个super_block，然后调用set_bdev_super这个callback函数。这里的super_block是ext4文件系统的super_block。</p><p>sget(fs_type, test_bdev_super, set_bdev_super, flags | MS_NOSEC, bdev);</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int set_bdev_super(struct super_block *s, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	s-&amp;gt;s_bdev = data;</span></span>
<span class="line"><span>	s-&amp;gt;s_dev = s-&amp;gt;s_bdev-&amp;gt;bd_dev;</span></span>
<span class="line"><span>	s-&amp;gt;s_bdi = bdi_get(s-&amp;gt;s_bdev-&amp;gt;bd_bdi);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> *	sget	-	find or create a superblock</span></span>
<span class="line"><span> *	&amp;#64;type:	  filesystem type superblock should belong to</span></span>
<span class="line"><span> *	&amp;#64;test:	  comparison callback</span></span>
<span class="line"><span> *	&amp;#64;set:	  setup callback</span></span>
<span class="line"><span> *	&amp;#64;flags:	  mount flags</span></span>
<span class="line"><span> *	&amp;#64;data:	  argument to each of them</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct super_block *sget(struct file_system_type *type,</span></span>
<span class="line"><span>			int (*test)(struct super_block *,void *),</span></span>
<span class="line"><span>			int (*set)(struct super_block *,void *),</span></span>
<span class="line"><span>			int flags,</span></span>
<span class="line"><span>			void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return sget_userns(type, test, set, flags, user_ns, data);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> *	sget_userns -	find or create a superblock</span></span>
<span class="line"><span> *	&amp;#64;type:	filesystem type superblock should belong to</span></span>
<span class="line"><span> *	&amp;#64;test:	comparison callback</span></span>
<span class="line"><span> *	&amp;#64;set:	setup callback</span></span>
<span class="line"><span> *	&amp;#64;flags:	mount flags</span></span>
<span class="line"><span> *	&amp;#64;user_ns: User namespace for the super_block</span></span>
<span class="line"><span> *	&amp;#64;data:	argument to each of them</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct super_block *sget_userns(struct file_system_type *type,</span></span>
<span class="line"><span>			int (*test)(struct super_block *,void *),</span></span>
<span class="line"><span>			int (*set)(struct super_block *,void *),</span></span>
<span class="line"><span>			int flags, struct user_namespace *user_ns,</span></span>
<span class="line"><span>			void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct super_block *s = NULL;</span></span>
<span class="line"><span>	struct super_block *old;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (!s) {</span></span>
<span class="line"><span>		s = alloc_super(type, (flags &amp; ~MS_SUBMOUNT), user_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	err = set(s, data);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	s-&amp;gt;s_type = type;</span></span>
<span class="line"><span>	strlcpy(s-&amp;gt;s_id, type-&amp;gt;name, sizeof(s-&amp;gt;s_id));</span></span>
<span class="line"><span>	list_add_tail(&amp;s-&amp;gt;s_list, &amp;super_blocks);</span></span>
<span class="line"><span>	hlist_add_head(&amp;s-&amp;gt;s_instances, &amp;type-&amp;gt;fs_supers);</span></span>
<span class="line"><span>	spin_unlock(&amp;sb_lock);</span></span>
<span class="line"><span>	get_filesystem(type);</span></span>
<span class="line"><span>	register_shrinker(&amp;s-&amp;gt;s_shrink);</span></span>
<span class="line"><span>	return s;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>好了，到此为止，mount中一个块设备的过程就结束了。设备打开了，形成了block_device结构，并且塞到了super_block中。</p><p>有了ext4文件系统的super_block之后，接下来对于文件的读写过程，就和文件系统那一章的过程一摸一样了。只要不涉及真正写入设备的代码，super_block中的这个block_device就没啥用处。这也是为什么文件系统那一章，我们丝毫感觉不到它的存在，但是一旦到了底层，就到了block_device起作用的时候了，这个我们下一节仔细分析。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>从这一节我们可以看出，块设备比字符设备复杂多了，涉及三个文件系统，工作过程我用一张图总结了一下，下面带你总结一下。</p><ol><li>所有的块设备被一个map结构管理从dev_t到gendisk的映射；</li><li>所有的block_device表示的设备或者分区都在bdev文件系统的inode列表中；</li><li>mknod创建出来的块设备文件在devtemfs文件系统里面，特殊inode里面有块设备号；</li><li>mount一个块设备上的文件系统，调用这个文件系统的mount接口；</li><li>通过按照/dev/xxx在文件系统devtmpfs文件系统上搜索到特殊inode，得到块设备号；</li><li>根据特殊inode里面的dev_t在bdev文件系统里面找到inode；</li><li>根据bdev文件系统上的inode找到对应的block_device，根据dev_t在map中找到gendisk，将两者关联起来；</li><li>找到block_device后打开设备，调用和block_device关联的gendisk里面的block_device_operations打开设备；</li><li>创建被mount的文件系统的super_block。</li></ol><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100942/6290b73283063f99d6eb728c26339620.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100942/6290b73283063f99d6eb728c26339620.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>到这里，你是否真的体会到了Linux里面“一切皆文件”了呢？那个特殊的inode除了能够表示字符设备和块设备，还能表示什么呢？请你看代码分析一下。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>`,74)])])}const v=n(t,[["render",l]]);export{b as __pageData,v as default};
