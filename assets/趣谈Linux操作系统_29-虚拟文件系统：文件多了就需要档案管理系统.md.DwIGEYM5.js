import{_ as s,H as a,f as p,i as t}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"29 | 虚拟文件系统：文件多了就需要档案管理系统","description":"","frontmatter":{},"headers":[{"level":2,"title":"挂载文件系统","slug":"挂载文件系统","link":"#挂载文件系统","children":[]},{"level":2,"title":"打开文件","slug":"打开文件","link":"#打开文件","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/29-虚拟文件系统：文件多了就需要档案管理系统.md","filePath":"趣谈Linux操作系统/29-虚拟文件系统：文件多了就需要档案管理系统.md","lastUpdated":1779822193000}'),e={name:"趣谈Linux操作系统/29-虚拟文件系统：文件多了就需要档案管理系统.md"};function l(i,n,o,c,r,d){return a(),p("div",null,[...n[0]||(n[0]=[t(`<h1 id="_29-虚拟文件系统-文件多了就需要档案管理系统" tabindex="-1">29 | 虚拟文件系统：文件多了就需要档案管理系统 <a class="header-anchor" href="#_29-虚拟文件系统-文件多了就需要档案管理系统" aria-label="Permalink to &quot;29 | 虚拟文件系统：文件多了就需要档案管理系统&quot;">​</a></h1><p>上一节，咱们的图书馆书架，也就是硬盘上的文件系统格式都搭建好了，现在我们还需要一个图书管理与借阅系统，也就是文件管理模块，不然我们怎么知道书都借给谁了呢？</p><p>进程要想往文件系统里面读写数据，需要很多层的组件一起合作。具体是怎么合作的呢？我们一起来看一看。</p><ul><li>在应用层，进程在进行文件读写操作时，可通过系统调用如sys_open、sys_read、sys_write等。</li><li>在内核，每个进程都需要为打开的文件，维护一定的数据结构。</li><li>在内核，整个系统打开的文件，也需要维护一定的数据结构。</li><li>Linux可以支持多达数十种不同的文件系统。它们的实现各不相同，因此Linux内核向用户空间提供了虚拟文件系统这个统一的接口，来对文件系统进行操作。它提供了常见的文件系统对象模型，例如inode、directory entry、mount等，以及操作这些对象的方法，例如inode operations、directory operations、file operations等。</li><li>然后就是对接的是真正的文件系统，例如我们上节讲的ext4文件系统。</li><li>为了读写ext4文件系统，要通过块设备I/O层，也即BIO层。这是文件系统层和块设备驱动的接口。</li><li>为了加快块设备的读写效率，我们还有一个缓存层。</li><li>最下层是块设备驱动程序。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/3c506edf93b15341da3db658e9970773.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/3c506edf93b15341da3db658e9970773.jpg" alt=""></a></p><p>接下来我们逐层解析。</p><p>在这之前，有一点你需要注意。解析系统调用是了解内核架构最有力的一把钥匙，这里我们只要重点关注这几个最重要的系统调用就可以了：</p><ul><li>mount系统调用用于挂载文件系统；</li><li>open系统调用用于打开或者创建文件，创建要在flags中设置O_CREAT，对于读写要设置flags为O_RDWR；</li><li>read系统调用用于读取文件内容；</li><li>write系统调用用于写入文件内容。</li></ul><h2 id="挂载文件系统" tabindex="-1">挂载文件系统 <a class="header-anchor" href="#挂载文件系统" aria-label="Permalink to &quot;挂载文件系统&quot;">​</a></h2><p>想要操作文件系统，第一件事情就是挂载文件系统。</p><p>内核是不是支持某种类型的文件系统，需要我们进行注册才能知道。例如，咱们上一节解析的ext4文件系统，就需要通过register_filesystem进行注册，传入的参数是ext4_fs_type，表示注册的是ext4类型的文件系统。这里面最重要的一个成员变量就是ext4_mount。记住它，这个我们后面还会用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>register_filesystem(&amp;ext4_fs_type);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file_system_type ext4_fs_type = {</span></span>
<span class="line"><span>	.owner		= THIS_MODULE,</span></span>
<span class="line"><span>	.name		= &quot;ext4&quot;,</span></span>
<span class="line"><span>	.mount		= ext4_mount,</span></span>
<span class="line"><span>	.kill_sb	= kill_block_super,</span></span>
<span class="line"><span>	.fs_flags	= FS_REQUIRES_DEV,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>如果一种文件系统的类型曾经在内核注册过，这就说明允许你挂载并且使用这个文件系统。</p><p>刚才我说了几个需要重点关注的系统调用，那我们就从第一个mount系统调用开始解析。mount系统调用的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE5(mount, char __user *, dev_name, char __user *, dir_name, char __user *, type, unsigned long, flags, void __user *, data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = do_mount(kernel_dev, dir_name, kernel_type, flags, options);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来的调用链为：do_mount-&gt;do_new_mount-&gt;vfs_kern_mount。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct vfsmount *</span></span>
<span class="line"><span>vfs_kern_mount(struct file_system_type *type, int flags, const char *name, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	mnt = alloc_vfsmnt(name);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	root = mount_fs(type, flags, name, data);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	mnt-&amp;gt;mnt.mnt_root = root;</span></span>
<span class="line"><span>	mnt-&amp;gt;mnt.mnt_sb = root-&amp;gt;d_sb;</span></span>
<span class="line"><span>	mnt-&amp;gt;mnt_mountpoint = mnt-&amp;gt;mnt.mnt_root;</span></span>
<span class="line"><span>	mnt-&amp;gt;mnt_parent = mnt;</span></span>
<span class="line"><span>	list_add_tail(&amp;mnt-&amp;gt;mnt_instance, &amp;root-&amp;gt;d_sb-&amp;gt;s_mounts);</span></span>
<span class="line"><span>	return &amp;mnt-&amp;gt;mnt;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>vfs_kern_mount先是创建struct mount结构，每个挂载的文件系统都对应于这样一个结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct mount {</span></span>
<span class="line"><span>	struct hlist_node mnt_hash;</span></span>
<span class="line"><span>	struct mount *mnt_parent;</span></span>
<span class="line"><span>	struct dentry *mnt_mountpoint;</span></span>
<span class="line"><span>	struct vfsmount mnt;</span></span>
<span class="line"><span>	union {</span></span>
<span class="line"><span>		struct rcu_head mnt_rcu;</span></span>
<span class="line"><span>		struct llist_node mnt_llist;</span></span>
<span class="line"><span>	};</span></span>
<span class="line"><span>	struct list_head mnt_mounts;	/* list of children, anchored here */</span></span>
<span class="line"><span>	struct list_head mnt_child;	/* and going through their mnt_child */</span></span>
<span class="line"><span>	struct list_head mnt_instance;	/* mount instance on sb-&amp;gt;s_mounts */</span></span>
<span class="line"><span>	const char *mnt_devname;	/* Name of device e.g. /dev/dsk/hda1 */</span></span>
<span class="line"><span>	struct list_head mnt_list;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>} __randomize_layout;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct vfsmount {</span></span>
<span class="line"><span>	struct dentry *mnt_root;	/* root of the mounted tree */</span></span>
<span class="line"><span>	struct super_block *mnt_sb;	/* pointer to superblock */</span></span>
<span class="line"><span>	int mnt_flags;</span></span>
<span class="line"><span>} __randomize_layout;</span></span></code></pre></div><p>其中，mnt_parent是装载点所在的父文件系统，mnt_mountpoint是装载点在父文件系统中的dentry；struct dentry表示目录，并和目录的inode关联；mnt_root是当前文件系统根目录的dentry，mnt_sb是指向超级块的指针。</p><p>接下来，我们来看调用mount_fs挂载文件系统。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct dentry *</span></span>
<span class="line"><span>mount_fs(struct file_system_type *type, int flags, const char *name, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct dentry *root;</span></span>
<span class="line"><span>	struct super_block *sb;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	root = type-&amp;gt;mount(type, flags, name, data);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	sb = root-&amp;gt;d_sb;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里调用的是ext4_fs_type的mount函数，也就是咱们上面提到的ext4_mount，从文件系统里面读取超级块。在文件系统的实现中，每个在硬盘上的结构，在内存中也对应相同格式的结构。当所有的数据结构都读到内存里面，内核就可以通过操作这些数据结构，来操作文件系统了。</p><p>可以看出来，理解各个数据结构在这里的关系，非常重要。我这里举一个例子，来解析经过mount之后，刚刚那些数据结构之间的关系。</p><p>我们假设根文件系统下面有一个目录home，有另外一个文件系统A挂载在这个目录home下面。在文件系统A的根目录下面有另外一个文件夹hello。由于文件系统A已经挂载到了目录home下面，所以我们就有了目录/home/hello，然后有另外一个文件系统B挂载在/home/hello下面。在文件系统B的根目录下面有另外一个文件夹world，在world下面有个文件夹data。由于文件系统B已经挂载到了/home/hello下面，所以我们就有了目录/home/hello/world/data。</p><p>为了维护这些关系，操作系统创建了这一系列数据结构。具体你可以看下面的图。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/663b3c5903d15fd9ba52f6d049e0dc27.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/663b3c5903d15fd9ba52f6d049e0dc27.jpeg" alt=""></a></p><p>文件系统是树形关系。如果所有的文件夹都是几代单传，那就变成了一条线。你注意看图中的三条斜线。</p><p>第一条线是最左边的向左斜的 <strong>dentry斜线</strong>。每一个文件和文件夹都有dentry，用于和inode关联。第二条线是最右面的向右斜的 <strong>mount斜线</strong>，因为这个例子涉及两次文件系统的挂载，再加上启动的时候挂载的根文件系统，一共三个mount。第三条线是中间的向右斜的 <strong>file斜线</strong>，每个打开的文件都有一个file结构，它里面有两个变量，一个指向相应的mount，一个指向相应的dentry。</p><p>我们从最上面往下看。根目录/对应一个dentry，根目录是在根文件系统上的，根文件系统是系统启动的时候挂载的，因而有一个mount结构。这个mount结构的mount point指针和mount root指针都是指向根目录的dentry。根目录对应的file的两个指针，一个指向根目录的dentry，一个指向根目录的挂载结构mount。</p><p>我们再来看第二层。下一层目录home对应了两个dentry，而且它们的parent都指向第一层的dentry。这是为什么呢？这是因为文件系统A挂载到了这个目录下。这使得这个目录有两个用处。一方面，home是根文件系统的一个挂载点；另一方面，home是文件系统A的根目录。</p><p>因为还有一次挂载，因而又有了一个mount结构。这个mount结构的mount point指针指向作为挂载点的那个dentry。mount root指针指向作为根目录的那个dentry，同时parent指针指向第一层的mount结构。home对应的file的两个指针，一个指向文件系统A根目录的dentry，一个指向文件系统A的挂载结构mount。</p><p>我们再来看第三层。目录hello又挂载了一个文件系统B，所以第三层的结构和第二层几乎一样。</p><p>接下来是第四层。目录world就是一个普通的目录。只要它的dentry的parent指针指向上一层就可以了。我们来看world对应的file结构。由于挂载点不变，还是指向第三层的mount结构。</p><p>接下来是第五层。对于文件data，是一个普通的文件，它的dentry的parent指向第四层的dentry。对于data对应的file结构，由于挂载点不变，还是指向第三层的mount结构。</p><h2 id="打开文件" tabindex="-1">打开文件 <a class="header-anchor" href="#打开文件" aria-label="Permalink to &quot;打开文件&quot;">​</a></h2><p>接下来，我们从分析Open系统调用说起。</p><p>在 <a href="https://time.geekbang.org/column/article/89251" target="_blank" rel="noreferrer">系统调用</a> 的那一节，我们知道，在进程里面通过open系统调用打开文件，最终对调用到内核的系统调用实现sys_open。当时我们仅仅解析了系统调用的原理，没有接着分析下去，现在我们接着分析这个过程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(open, const char __user *, filename, int, flags, umode_t, mode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return do_sys_open(AT_FDCWD, filename, flags, mode);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long do_sys_open(int dfd, const char __user *filename, int flags, umode_t mode)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	fd = get_unused_fd_flags(flags);</span></span>
<span class="line"><span>	if (fd &amp;gt;= 0) {</span></span>
<span class="line"><span>		struct file *f = do_filp_open(dfd, tmp, &amp;op);</span></span>
<span class="line"><span>		if (IS_ERR(f)) {</span></span>
<span class="line"><span>			put_unused_fd(fd);</span></span>
<span class="line"><span>			fd = PTR_ERR(f);</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			fsnotify_open(f);</span></span>
<span class="line"><span>			fd_install(fd, f);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	putname(tmp);</span></span>
<span class="line"><span>	return fd;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>要打开一个文件，首先要通过get_unused_fd_flags得到一个没有用的文件描述符。如何获取这个文件描述符呢？</p><p>在每一个进程的task_struct中，有一个指针files，类型是files_struct。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct files_struct		*files;</span></span></code></pre></div><p>files_struct里面最重要的是一个文件描述符列表，每打开一个文件，就会在这个列表中分配一项，下标就是文件描述符。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct files_struct {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct file __rcu * fd_array[NR_OPEN_DEFAULT];</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>对于任何一个进程，默认情况下，文件描述符0表示stdin标准输入，文件描述符1表示stdout标准输出，文件描述符2表示stderr标准错误输出。另外，再打开的文件，都会从这个列表中找一个空闲位置分配给它。</p><p>文件描述符列表的每一项都是一个指向struct file的指针，也就是说，每打开一个文件，都会有一个struct file对应。</p><p>do_sys_open中调用do_filp_open，就是创建这个struct file结构，然后fd_install(fd, f)是将文件描述符和这个结构关联起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct file *do_filp_open(int dfd, struct filename *pathname,</span></span>
<span class="line"><span>		const struct open_flags *op)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	set_nameidata(&amp;nd, dfd, pathname);</span></span>
<span class="line"><span>	filp = path_openat(&amp;nd, op, flags | LOOKUP_RCU);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	restore_nameidata();</span></span>
<span class="line"><span>	return filp;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>do_filp_open里面首先初始化了struct nameidata这个结构。我们知道，文件都是一串的路径名称，需要逐个解析。这个结构在解析和查找路径的时候提供辅助作用。</p><p>在struct nameidata里面有一个关键的成员变量struct path。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct path {</span></span>
<span class="line"><span>	struct vfsmount *mnt;</span></span>
<span class="line"><span>	struct dentry *dentry;</span></span>
<span class="line"><span>} __randomize_layout;</span></span></code></pre></div><p>其中，struct vfsmount和文件系统的挂载有关。另一个struct dentry，除了上面说的用于标识目录之外，还可以表示文件名，还会建立文件名及其inode之间的关联。</p><p>接下来就调用path_openat，主要做了以下几件事情：</p><ul><li>get_empty_filp生成一个struct file结构；</li><li>path_init初始化nameidata，准备开始节点路径查找；</li><li>link_path_walk对于路径名逐层进行节点路径查找，这里面有一个大的循环，用“/”分隔逐层处理；</li><li>do_last获取文件对应的inode对象，并且初始化file对象。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct file *path_openat(struct nameidata *nd,</span></span>
<span class="line"><span>			const struct open_flags *op, unsigned flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file = get_empty_filp();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	s = path_init(nd, flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	while (!(error = link_path_walk(s, nd)) &amp;&amp;</span></span>
<span class="line"><span>		(error = do_last(nd, file, op, &amp;opened)) &amp;gt; 0) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	terminate_walk(nd);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return file;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>例如，文件“/root/hello/world/data”，link_path_walk会解析前面的路径部分“/root/hello/world”，解析完毕的时候nameidata的dentry为路径名的最后一部分的父目录“/root/hello/world”，而nameidata的filename为路径名的最后一部分“data”。</p><p>最后一部分的解析和处理，我们交给do_last。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int do_last(struct nameidata *nd,</span></span>
<span class="line"><span>		   struct file *file, const struct open_flags *op,</span></span>
<span class="line"><span>		   int *opened)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = lookup_fast(nd, &amp;path, &amp;inode, &amp;seq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    error = lookup_open(nd, &amp;path, file, op, got_write, opened);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = vfs_open(&amp;nd-&amp;gt;path, file, current_cred());</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，我们需要先查找文件路径最后一部分对应的dentry。如何查找呢？</p><p>Linux为了提高目录项对象的处理效率，设计与实现了目录项高速缓存dentry cache，简称dcache。它主要由两个数据结构组成：</p><ul><li>哈希表dentry_hashtable：dcache中的所有dentry对象都通过d_hash指针链到相应的dentry哈希链表中；</li><li>未使用的dentry对象链表s_dentry_lru：dentry对象通过其d_lru指针链入LRU链表中。LRU的意思是最近最少使用，我们已经好几次看到它了。只要有它，就说明长时间不使用，就应该释放了。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/82dd76e1e84915206eefb8fc88385859.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/82dd76e1e84915206eefb8fc88385859.jpeg" alt=""></a></p><p>这两个列表之间会产生复杂的关系：</p><ul><li>引用为0：一个在散列表中的dentry变成没有人引用了，就会被加到LRU表中去；</li><li>再次被引用：一个在LRU表中的dentry再次被引用了，则从LRU表中移除；</li><li>分配：当dentry在散列表中没有找到，则从Slub分配器中分配一个；</li><li>过期归还：当LRU表中最长时间没有使用的dentry应该释放回Slub分配器；</li><li>文件删除：文件被删除了，相应的dentry应该释放回Slub分配器；</li><li>结构复用：当需要分配一个dentry，但是无法分配新的，就从LRU表中取出一个来复用。</li></ul><p>所以，do_last()在查找dentry的时候，当然先从缓存中查找，调用的是lookup_fast。</p><p>如果缓存中没有找到，就需要真的到文件系统里面去找了，lookup_open会创建一个新的dentry，并且调用上一级目录的Inode的inode_operations的lookup函数，对于ext4来讲，调用的是ext4_lookup，会到咱们上一节讲的文件系统里面去找inode。最终找到后将新生成的dentry赋给path变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int lookup_open(struct nameidata *nd, struct path *path,</span></span>
<span class="line"><span>			struct file *file,</span></span>
<span class="line"><span>			const struct open_flags *op,</span></span>
<span class="line"><span>			bool got_write, int *opened)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    dentry = d_alloc_parallel(dir, &amp;nd-&amp;gt;last, &amp;wq);</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    struct dentry *res = dir_inode-&amp;gt;i_op-&amp;gt;lookup(dir_inode, dentry,</span></span>
<span class="line"><span>							     nd-&amp;gt;flags);</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    path-&amp;gt;dentry = dentry;</span></span>
<span class="line"><span>	path-&amp;gt;mnt = nd-&amp;gt;path.mnt;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const struct inode_operations ext4_dir_inode_operations = {</span></span>
<span class="line"><span>	.create		= ext4_create,</span></span>
<span class="line"><span>	.lookup		= ext4_lookup,</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>do_last()的最后一步是调用vfs_open真正打开文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int vfs_open(const struct path *path, struct file *file,</span></span>
<span class="line"><span>	     const struct cred *cred)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct dentry *dentry = d_real(path-&amp;gt;dentry, NULL, file-&amp;gt;f_flags, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	file-&amp;gt;f_path = *path;</span></span>
<span class="line"><span>	return do_dentry_open(file, d_backing_inode(dentry), NULL, cred);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int do_dentry_open(struct file *f,</span></span>
<span class="line"><span>			  struct inode *inode,</span></span>
<span class="line"><span>			  int (*open)(struct inode *, struct file *),</span></span>
<span class="line"><span>			  const struct cred *cred)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	f-&amp;gt;f_mode = OPEN_FMODE(f-&amp;gt;f_flags) | FMODE_LSEEK |</span></span>
<span class="line"><span>				FMODE_PREAD | FMODE_PWRITE;</span></span>
<span class="line"><span>	path_get(&amp;f-&amp;gt;f_path);</span></span>
<span class="line"><span>	f-&amp;gt;f_inode = inode;</span></span>
<span class="line"><span>	f-&amp;gt;f_mapping = inode-&amp;gt;i_mapping;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	f-&amp;gt;f_op = fops_get(inode-&amp;gt;i_fop);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	open = f-&amp;gt;f_op-&amp;gt;open;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = open(inode, f);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	f-&amp;gt;f_flags &amp;= ~(O_CREAT | O_EXCL | O_NOCTTY | O_TRUNC);</span></span>
<span class="line"><span>	file_ra_state_init(&amp;f-&amp;gt;f_ra, f-&amp;gt;f_mapping-&amp;gt;host-&amp;gt;i_mapping);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const struct file_operations ext4_file_operations = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.open		= ext4_file_open,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>vfs_open里面最终要做的一件事情是，调用f_op-&gt;open，也就是调用ext4_file_open。另外一件重要的事情是将打开文件的所有信息，填写到struct file这个结构里面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct file {</span></span>
<span class="line"><span>	union {</span></span>
<span class="line"><span>		struct llist_node	fu_llist;</span></span>
<span class="line"><span>		struct rcu_head 	fu_rcuhead;</span></span>
<span class="line"><span>	} f_u;</span></span>
<span class="line"><span>	struct path		f_path;</span></span>
<span class="line"><span>	struct inode		*f_inode;	/* cached value */</span></span>
<span class="line"><span>	const struct file_operations	*f_op;</span></span>
<span class="line"><span>	spinlock_t		f_lock;</span></span>
<span class="line"><span>	enum rw_hint		f_write_hint;</span></span>
<span class="line"><span>	atomic_long_t		f_count;</span></span>
<span class="line"><span>	unsigned int 		f_flags;</span></span>
<span class="line"><span>	fmode_t			f_mode;</span></span>
<span class="line"><span>	struct mutex		f_pos_lock;</span></span>
<span class="line"><span>	loff_t			f_pos;</span></span>
<span class="line"><span>	struct fown_struct	f_owner;</span></span>
<span class="line"><span>	const struct cred	*f_cred;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct address_space	*f_mapping;</span></span>
<span class="line"><span>	errseq_t		f_wb_err;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>对于虚拟文件系统的解析就到这里了，我们可以看出，有关文件的数据结构层次多，而且很复杂，就得到了下面这张图，这张图在这个专栏最开始的时候，已经展示过一遍，到这里，你应该能明白它们之间的关系了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/8070294bacd74e0ac5ccc5ac88be1bb9.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/8070294bacd74e0ac5ccc5ac88be1bb9.png" alt=""></a></p><p>这张图十分重要，一定要掌握。因为我们后面的字符设备、块设备、管道、进程间通信、网络等等，全部都要用到这里面的知识。希望当你再次遇到它的时候，能够马上说出各个数据结构之间的关系。</p><p>这里我带你简单做一个梳理，帮助你理解记忆它。</p><p>对于每一个进程，打开的文件都有一个文件描述符，在files_struct里面会有文件描述符数组。每个一个文件描述符是这个数组的下标，里面的内容指向一个file结构，表示打开的文件。这个结构里面有这个文件对应的inode，最重要的是这个文件对应的操作file_operation。如果操作这个文件，就看这个file_operation里面的定义了。</p><p>对于每一个打开的文件，都有一个dentry对应，虽然叫作directory entry，但是不仅仅表示文件夹，也表示文件。它最重要的作用就是指向这个文件对应的inode。</p><p>如果说file结构是一个文件打开以后才创建的，dentry是放在一个dentry cache里面的，文件关闭了，他依然存在，因而他可以更长期地维护内存中的文件的表示和硬盘上文件的表示之间的关系。</p><p>inode结构就表示硬盘上的inode，包括块设备号等。</p><p>几乎每一种结构都有自己对应的operation结构，里面都是一些方法，因而当后面遇到对于某种结构进行处理的时候，如果不容易找到相应的处理函数，就先找这个operation结构，就清楚了。</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>上一节的总结中，我们说，同一个文件系统中，文件夹和文件的对应关系。如果跨的是文件系统，你知道如何维护这种映射关系吗？</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/98855/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,85)])])}const m=s(e,[["render",l]]);export{_ as __pageData,m as default};
