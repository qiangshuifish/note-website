import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"32 | 字符设备（上）：如何建立直销模式？","description":"","frontmatter":{},"headers":[{"level":2,"title":"内核模块","slug":"内核模块","link":"#内核模块","children":[]},{"level":2,"title":"打开字符设备","slug":"打开字符设备","link":"#打开字符设备","children":[]},{"level":2,"title":"写入字符设备","slug":"写入字符设备","link":"#写入字符设备","children":[]},{"level":2,"title":"使用IOCTL控制设备","slug":"使用ioctl控制设备","link":"#使用ioctl控制设备","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/32-字符设备（上）：如何建立直销模式？.md","filePath":"趣谈Linux操作系统/32-字符设备（上）：如何建立直销模式？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/32-字符设备（上）：如何建立直销模式？.md"};function i(l,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_32-字符设备-上-如何建立直销模式" tabindex="-1">32 | 字符设备（上）：如何建立直销模式？ <a class="header-anchor" href="#_32-字符设备-上-如何建立直销模式" aria-label="Permalink to &quot;32 | 字符设备（上）：如何建立直销模式？&quot;">​</a></h1><p>上一节，我们讲了输入输出设备的层次模型，还是比较复杂的，块设备尤其复杂。这一节为了让你更清晰地了解设备驱动程序的架构，我们先来讲稍微简单一点的字符设备驱动。</p><p>这一节，我找了两个比较简单的字符设备驱动来解析一下。一个是输入字符设备，鼠标。代码在drivers/input/mouse/logibm.c这里。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Logitech Bus Mouse Driver for Linux</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>module_init(logibm_init);</span></span>
<span class="line"><span>module_exit(logibm_exit);</span></span></code></pre></div><p>另外一个是输出字符设备，打印机，代码drivers/char/lp.c这里。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Generic parallel printer driver</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>module_init(lp_init_module);</span></span>
<span class="line"><span>module_exit(lp_cleanup_module);</span></span></code></pre></div><h2 id="内核模块" tabindex="-1">内核模块 <a class="header-anchor" href="#内核模块" aria-label="Permalink to &quot;内核模块&quot;">​</a></h2><p>上一节，我们讲过，设备驱动程序是一个内核模块，以ko的文件形式存在，可以通过insmod加载到内核中。那我们首先来看一下，怎么样才能构建一个内核模块呢？</p><p>一个内核模块应该由以下几部分组成。</p><p><strong>第一部分，头文件部分</strong>。一般的内核模块，都需要include下面两个头文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;linux/module.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;linux/init.h&amp;gt;</span></span></code></pre></div><p>如果你去看上面两个驱动程序，都能找到这两个头文件。当然如果需要的话，我们还可以引入更多的头文件。</p><p><strong>第二部分，定义一些函数，用于处理内核模块的主要逻辑</strong>。例如打开、关闭、读取、写入设备的函数或者响应中断的函数。</p><p>例如，logibm.c里面就定义了logibm_open。logibm_close就是处理打开和关闭的，定义了logibm_interrupt就是用来响应中断的。再如，lp.c里面就定义了lp_read，lp_write就是处理读写的。</p><p><strong>第三部分，定义一个file_operations结构</strong>。前面我们讲过，设备是可以通过文件系统的接口进行访问的。咱们讲文件系统的时候说过，对于某种文件系统的操作，都是放在file_operations里面的。例如ext4就定义了这么一个结构，里面都是ext4_xxx之类的函数。设备要想被文件系统的接口操作，也需要定义这样一个结构。</p><p>例如，lp.c里面就定义了这样一个结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct file_operations lp_fops = {</span></span>
<span class="line"><span>	.owner		= THIS_MODULE,</span></span>
<span class="line"><span>	.write		= lp_write,</span></span>
<span class="line"><span>	.unlocked_ioctl	= lp_ioctl,</span></span>
<span class="line"><span>#ifdef CONFIG_COMPAT</span></span>
<span class="line"><span>	.compat_ioctl	= lp_compat_ioctl,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	.open		= lp_open,</span></span>
<span class="line"><span>	.release	= lp_release,</span></span>
<span class="line"><span>#ifdef CONFIG_PARPORT_1284</span></span>
<span class="line"><span>	.read		= lp_read,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	.llseek		= noop_llseek,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在logibm.c里面，我们找不到这样的结构，是因为它属于众多输入设备的一种，而输入设备的操作被统一定义在drivers/input/input.c里面，logibm.c只是定义了一些自己独有的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct file_operations input_devices_fileops = {</span></span>
<span class="line"><span>	.owner		= THIS_MODULE,</span></span>
<span class="line"><span>	.open		= input_proc_devices_open,</span></span>
<span class="line"><span>	.poll		= input_proc_devices_poll,</span></span>
<span class="line"><span>	.read		= seq_read,</span></span>
<span class="line"><span>	.llseek		= seq_lseek,</span></span>
<span class="line"><span>	.release	= seq_release,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p><strong>第四部分，定义整个模块的初始化函数和退出函数</strong>，用于加载和卸载这个ko的时候调用。</p><p>例如lp.c就定义了lp_init_module和lp_cleanup_module，logibm.c就定义了logibm_init和logibm_exit。</p><p><strong>第五部分，调用module_init和module_exit</strong>，分别指向上面两个初始化函数和退出函数。就像本节最开头展示的一样。</p><p><strong>第六部分，声明一下lisense，调用MODULE_LICENSE</strong>。</p><p>有了这六部分，一个内核模块就基本合格了，可以工作了。</p><h2 id="打开字符设备" tabindex="-1">打开字符设备 <a class="header-anchor" href="#打开字符设备" aria-label="Permalink to &quot;打开字符设备&quot;">​</a></h2><p>字符设备可不是一个普通的内核模块，它有自己独特的行为。接下来，我们就沿着打开一个字符设备的过程，看看字符设备这个内核模块做了哪些特殊的事情。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/2e29767e84b299324ea7fc524a3dcee6.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/2e29767e84b299324ea7fc524a3dcee6.jpeg" alt=""></a></p><p>要使用一个字符设备，我们首先要把写好的内核模块，通过insmod加载进内核。这个时候，先调用的就是module_init调用的初始化函数。</p><p>例如，在lp.c的初始化函数lp_init对应的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __init lp_init (void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (register_chrdev (LP_MAJOR, &quot;lp&quot;, &amp;lp_fops)) {</span></span>
<span class="line"><span>		printk (KERN_ERR &quot;lp: unable to get major %d\\n&quot;, LP_MAJOR);</span></span>
<span class="line"><span>		return -EIO;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int __register_chrdev(unsigned int major, unsigned int baseminor,</span></span>
<span class="line"><span>		      unsigned int count, const char *name,</span></span>
<span class="line"><span>		      const struct file_operations *fops)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct char_device_struct *cd;</span></span>
<span class="line"><span>	struct cdev *cdev;</span></span>
<span class="line"><span>	int err = -ENOMEM;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	cd = __register_chrdev_region(major, baseminor, count, name);</span></span>
<span class="line"><span>	cdev = cdev_alloc();</span></span>
<span class="line"><span>	cdev-&amp;gt;owner = fops-&amp;gt;owner;</span></span>
<span class="line"><span>	cdev-&amp;gt;ops = fops;</span></span>
<span class="line"><span>	kobject_set_name(&amp;cdev-&amp;gt;kobj, &quot;%s&quot;, name);</span></span>
<span class="line"><span>	err = cdev_add(cdev, MKDEV(cd-&amp;gt;major, baseminor), count);</span></span>
<span class="line"><span>	cd-&amp;gt;cdev = cdev;</span></span>
<span class="line"><span>	return major ? 0 : cd-&amp;gt;major;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在字符设备驱动的内核模块加载的时候，最重要的一件事情就是，注册这个字符设备。注册的方式是调用__register_chrdev_region，注册字符设备的主次设备号和名称，然后分配一个struct cdev结构，将cdev的ops成员变量指向这个模块声明的file_operations。然后，cdev_add会将这个字符设备添加到内核中一个叫作struct kobj_map *cdev_map的结构，来统一管理所有字符设备。</p><p>其中，MKDEV(cd-&gt;major, baseminor)表示将主设备号和次设备号生成一个dev_t的整数，然后将这个整数dev_t和cdev关联起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * cdev_add() - add a char device to the system</span></span>
<span class="line"><span> * &amp;#64;p: the cdev structure for the device</span></span>
<span class="line"><span> * &amp;#64;dev: the first device number for which this device is responsible</span></span>
<span class="line"><span> * &amp;#64;count: the number of consecutive minor numbers corresponding to this</span></span>
<span class="line"><span> *         device</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * cdev_add() adds the device represented by &amp;#64;p to the system, making it</span></span>
<span class="line"><span> * live immediately.  A negative error code is returned on failure.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>int cdev_add(struct cdev *p, dev_t dev, unsigned count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	p-&amp;gt;dev = dev;</span></span>
<span class="line"><span>	p-&amp;gt;count = count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = kobj_map(cdev_map, dev, count, NULL,</span></span>
<span class="line"><span>			 exact_match, exact_lock, p);</span></span>
<span class="line"><span>	kobject_get(p-&amp;gt;kobj.parent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return 0;</span></span></code></pre></div><p>在logibm.c中，我们在logibm_init找不到注册字符设备，这是因为input.c里面的初始化函数input_init会调用register_chrdev_region，注册输入的字符设备，会在logibm_init中调用input_register_device，将logibm.c这个字符设备注册到input.c里面去，这就相当于input.c对多个输入字符设备进行统一的管理。</p><p>内核模块加载完毕后，接下来要通过mknod在/dev下面创建一个设备文件，只有有了这个设备文件，我们才能通过文件系统的接口，对这个设备文件进行操作。</p><p>mknod也是一个系统调用，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(mknod, const char __user *, filename, umode_t, mode, unsigned, dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return sys_mknodat(AT_FDCWD, filename, mode, dev);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SYSCALL_DEFINE4(mknodat, int, dfd, const char __user *, filename, umode_t, mode,</span></span>
<span class="line"><span>		unsigned, dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct dentry *dentry;</span></span>
<span class="line"><span>	struct path path;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	dentry = user_path_create(dfd, filename, &amp;path, lookup_flags);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	switch (mode &amp; S_IFMT) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		case S_IFCHR: case S_IFBLK:</span></span>
<span class="line"><span>			error = vfs_mknod(path.dentry-&amp;gt;d_inode,dentry,mode,</span></span>
<span class="line"><span>					new_decode_dev(dev));</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以在这个系统调用里看到，在文件系统上，顺着路径找到/dev/xxx所在的文件夹，然后为这个新创建的设备文件创建一个dentry。这是维护文件和inode之间的关联关系的结构。</p><p>接下来，如果是字符文件S_IFCHR或者设备文件S_IFBLK，我们就调用vfs_mknod。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int vfs_mknod(struct inode *dir, struct dentry *dentry, umode_t mode, dev_t dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = dir-&amp;gt;i_op-&amp;gt;mknod(dir, dentry, mode, dev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里需要调用对应的文件系统的inode_operations。应该调用哪个文件系统呢？</p><p>如果我们在linux下面执行mount命令，能看到下面这一行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>devtmpfs on /dev type devtmpfs (rw,nosuid,size=3989584k,nr_inodes=997396,mode=755)</span></span></code></pre></div><p>也就是说，/dev下面的文件系统的名称为devtmpfs，我们可以在内核中找到它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct dentry *dev_mount(struct file_system_type *fs_type, int flags,</span></span>
<span class="line"><span>		      const char *dev_name, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#ifdef CONFIG_TMPFS</span></span>
<span class="line"><span>	return mount_single(fs_type, flags, data, shmem_fill_super);</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>	return mount_single(fs_type, flags, data, ramfs_fill_super);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file_system_type dev_fs_type = {</span></span>
<span class="line"><span>	.name = &quot;devtmpfs&quot;,</span></span>
<span class="line"><span>	.mount = dev_mount,</span></span>
<span class="line"><span>	.kill_sb = kill_litter_super,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>从这里可以看出，devtmpfs在挂载的时候，有两种模式，一种是ramfs，一种是shmem都是基于内存的文件系统。这里你先不用管，基于内存的文件系统具体是怎么回事儿。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct inode_operations ramfs_dir_inode_operations = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.mknod		= ramfs_mknod,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct inode_operations shmem_dir_inode_operations = {</span></span>
<span class="line"><span>#ifdef CONFIG_TMPFS</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.mknod		= shmem_mknod,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>这两个mknod虽然实现不同，但是都会调用到同一个函数init_special_inode。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_special_inode(struct inode *inode, umode_t mode, dev_t rdev)</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>显然这个文件是个特殊文件，inode也是特殊的。这里这个inode可以关联字符设备、块设备、FIFO文件、Socket等。我们这里只看字符设备。</p><p>这里的inode的file_operations指向一个def_chr_fops，这里面只有一个open，就等着你打开它。</p><p>另外，inode的i_rdev指向这个设备的dev_t。还记得cdev_map吗？通过这个dev_t，可以找到我们刚在加载的字符设备cdev。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct file_operations def_chr_fops = {</span></span>
<span class="line"><span>	.open = chrdev_open,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>到目前为止，我们只是创建了/dev下面的一个文件，并且和相应的设备号关联起来。但是，我们还没有打开这个/dev下面的设备文件。</p><p>现在我们来打开它。打开一个文件的流程，我们在 <a href="https://time.geekbang.org/column/article/97876" target="_blank" rel="noreferrer">文件系统</a> 那一节讲过了，这里不再重复。最终就像打开字符设备的图中一样，打开文件的进程的task_struct里，有一个数组代表它打开的文件，下标就是文件描述符fd，每一个打开的文件都有一个struct file结构，会指向一个dentry项。dentry可以用来关联inode。这个dentry就是咱们上面mknod的时候创建的。</p><p>在进程里面调用open函数，最终会调用到这个特殊的inode的open函数，也就是chrdev_open。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int chrdev_open(struct inode *inode, struct file *filp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	const struct file_operations *fops;</span></span>
<span class="line"><span>	struct cdev *p;</span></span>
<span class="line"><span>	struct cdev *new = NULL;</span></span>
<span class="line"><span>	int ret = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	p = inode-&amp;gt;i_cdev;</span></span>
<span class="line"><span>	if (!p) {</span></span>
<span class="line"><span>		struct kobject *kobj;</span></span>
<span class="line"><span>		int idx;</span></span>
<span class="line"><span>		kobj = kobj_lookup(cdev_map, inode-&amp;gt;i_rdev, &amp;idx);</span></span>
<span class="line"><span>		new = container_of(kobj, struct cdev, kobj);</span></span>
<span class="line"><span>		p = inode-&amp;gt;i_cdev;</span></span>
<span class="line"><span>		if (!p) {</span></span>
<span class="line"><span>			inode-&amp;gt;i_cdev = p = new;</span></span>
<span class="line"><span>			list_add(&amp;inode-&amp;gt;i_devices, &amp;p-&amp;gt;list);</span></span>
<span class="line"><span>			new = NULL;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	fops = fops_get(p-&amp;gt;ops);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	replace_fops(filp, fops);</span></span>
<span class="line"><span>	if (filp-&amp;gt;f_op-&amp;gt;open) {</span></span>
<span class="line"><span>		ret = filp-&amp;gt;f_op-&amp;gt;open(inode, filp);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个函数里面，我们首先看这个inode的i_cdev，是否已经关联到cdev。如果第一次打开，当然没有。没有没关系，inode里面有i_rdev呀，也就是有dev_t。我们可以通过它在cdev_map中找cdev。咱们上面注册过了，所以肯定能够找到。找到后我们就将inode的i_cdev，关联到找到的cdev new。</p><p>找到cdev就好办了。cdev里面有file_operations，这是设备驱动程序自己定义的。我们可以通过它来操作设备驱动程序，把它付给struct file里面的file_operations。这样以后操作文件描述符，就是直接操作设备了。</p><p>最后，我们需要调用设备驱动程序的file_operations的open函数，真正打开设备。对于打印机，调用的是lp_open。对于鼠标调用的是input_proc_devices_open，最终会调用到logibm_open。这些多和设备相关，你不必看懂它们。</p><h2 id="写入字符设备" tabindex="-1">写入字符设备 <a class="header-anchor" href="#写入字符设备" aria-label="Permalink to &quot;写入字符设备&quot;">​</a></h2><p>当我们像打开一个文件一样打开一个字符设备之后，接下来就是对这个设备的读写。对于文件的读写咱们在文件系统那一章详细讲述过，读写的过程是类似的，所以这里我们只解析打印机驱动写入的过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/9bd3cd8a8705dbf69f889ba3b2b5c2e2.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/9bd3cd8a8705dbf69f889ba3b2b5c2e2.jpeg" alt=""></a></p><p>写入一个字符设备，就是用文件系统的标准接口write，参数文件描述符fd，在内核里面调用的sys_write，在sys_write里面根据文件描述符fd得到struct file结构。接下来再调用vfs_write。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ssize_t __vfs_write(struct file *file, const char __user *p, size_t count, loff_t *pos)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (file-&amp;gt;f_op-&amp;gt;write)</span></span>
<span class="line"><span>		return file-&amp;gt;f_op-&amp;gt;write(file, p, count, pos);</span></span>
<span class="line"><span>	else if (file-&amp;gt;f_op-&amp;gt;write_iter)</span></span>
<span class="line"><span>		return new_sync_write(file, p, count, pos);</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		return -EINVAL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到，在__vfs_write里面，我们会调用struct file结构里的file_operations的write函数。上面我们打开字符设备的时候，已经将struct file结构里面的file_operations指向了设备驱动程序的file_operations结构，所以这里的write函数最终会调用到lp_write。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ssize_t lp_write(struct file * file, const char __user * buf,</span></span>
<span class="line"><span>		        size_t count, loff_t *ppos)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned int minor = iminor(file_inode(file));</span></span>
<span class="line"><span>	struct parport *port = lp_table[minor].dev-&amp;gt;port;</span></span>
<span class="line"><span>	char *kbuf = lp_table[minor].lp_buffer;</span></span>
<span class="line"><span>	ssize_t retv = 0;</span></span>
<span class="line"><span>	ssize_t written;</span></span>
<span class="line"><span>	size_t copy_size = count;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Need to copy the data from user-space. */</span></span>
<span class="line"><span>	if (copy_size &amp;gt; LP_BUFFER_SIZE)</span></span>
<span class="line"><span>		copy_size = LP_BUFFER_SIZE;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (copy_from_user (kbuf, buf, copy_size)) {</span></span>
<span class="line"><span>		retv = -EFAULT;</span></span>
<span class="line"><span>		goto out_unlock;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	do {</span></span>
<span class="line"><span>		/* Write the data. */</span></span>
<span class="line"><span>		written = parport_write (port, kbuf, copy_size);</span></span>
<span class="line"><span>		if (written &amp;gt; 0) {</span></span>
<span class="line"><span>			copy_size -= written;</span></span>
<span class="line"><span>			count -= written;</span></span>
<span class="line"><span>			buf  += written;</span></span>
<span class="line"><span>			retv += written;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        if (need_resched())</span></span>
<span class="line"><span>			schedule ();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (count) {</span></span>
<span class="line"><span>			copy_size = count;</span></span>
<span class="line"><span>			if (copy_size &amp;gt; LP_BUFFER_SIZE)</span></span>
<span class="line"><span>				copy_size = LP_BUFFER_SIZE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (copy_from_user(kbuf, buf, copy_size)) {</span></span>
<span class="line"><span>				if (retv == 0)</span></span>
<span class="line"><span>					retv = -EFAULT;</span></span>
<span class="line"><span>				break;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	} while (count &amp;gt; 0);</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>这个设备驱动程序的写入函数的实现还是比较典型的。先是调用copy_from_user将数据从用户态拷贝到内核态的缓存中，然后调用parport_write写入外部设备。这里还有一个schedule函数，也即写入的过程中，给其他线程抢占CPU的机会。然后，如果count还是大于0，也就是数据还没有写完，那我们就接着copy_from_user，接着parport_write，直到写完为止。</p><h2 id="使用ioctl控制设备" tabindex="-1">使用IOCTL控制设备 <a class="header-anchor" href="#使用ioctl控制设备" aria-label="Permalink to &quot;使用IOCTL控制设备&quot;">​</a></h2><p>对于I/O设备来讲，我们前面也说过，除了读写设备，还会调用ioctl，做一些特殊的I/O操作。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/c3498dad4f15712529354e0fa123c31d.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/c3498dad4f15712529354e0fa123c31d.jpeg" alt=""></a></p><p>ioctl也是一个系统调用，它在内核里面的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SYSCALL_DEFINE3(ioctl, unsigned int, fd, unsigned int, cmd, unsigned long, arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	struct fd f = fdget(fd);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	error = do_vfs_ioctl(f.file, fd, cmd, arg);</span></span>
<span class="line"><span>	fdput(f);</span></span>
<span class="line"><span>	return error;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，fd是这个设备的文件描述符，cmd是传给这个设备的命令，arg是命令的参数。其中，对于命令和命令的参数，使用ioctl系统调用的用户和驱动程序的开发人员约定好行为即可。</p><p>其实cmd看起来是一个int，其实他的组成比较复杂，它由几部分组成：</p><ul><li>最低八位为NR，是命令号；</li><li>然后八位是TYPE，是类型；</li><li>然后十四位是参数的大小；</li><li>最高两位是DIR，是方向，表示写入、读出，还是读写。</li></ul><p>由于组成比较复杂，有一些宏是专门用于组成这个cmd值的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Used to create numbers.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>#define _IO(type,nr)		_IOC(_IOC_NONE,(type),(nr),0)</span></span>
<span class="line"><span>#define _IOR(type,nr,size)	_IOC(_IOC_READ,(type),(nr),(_IOC_TYPECHECK(size)))</span></span>
<span class="line"><span>#define _IOW(type,nr,size)	_IOC(_IOC_WRITE,(type),(nr),(_IOC_TYPECHECK(size)))</span></span>
<span class="line"><span>#define _IOWR(type,nr,size)	_IOC(_IOC_READ|_IOC_WRITE,(type),(nr),(_IOC_TYPECHECK(size)))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* used to decode ioctl numbers.. */</span></span>
<span class="line"><span>#define _IOC_DIR(nr)		(((nr) &amp;gt;&amp;gt; _IOC_DIRSHIFT) &amp; _IOC_DIRMASK)</span></span>
<span class="line"><span>#define _IOC_TYPE(nr)		(((nr) &amp;gt;&amp;gt; _IOC_TYPESHIFT) &amp; _IOC_TYPEMASK)</span></span>
<span class="line"><span>#define _IOC_NR(nr)		(((nr) &amp;gt;&amp;gt; _IOC_NRSHIFT) &amp; _IOC_NRMASK)</span></span>
<span class="line"><span>#define _IOC_SIZE(nr)		(((nr) &amp;gt;&amp;gt; _IOC_SIZESHIFT) &amp; _IOC_SIZEMASK)</span></span></code></pre></div><p>在用户程序中，可以通过上面的“Used to create numbers”这些宏，根据参数生成cmd，在驱动程序中，可以通过下面的“used to decode ioctl numbers”这些宏，解析cmd后，执行指令。</p><p>ioctl中会调用do_vfs_ioctl，这里面对于已经定义好的cmd，进行相应的处理。如果不是默认定义好的cmd，则执行默认操作。对于普通文件，调用file_ioctl；对于其他文件调用vfs_ioctl。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int do_vfs_ioctl(struct file *filp, unsigned int fd, unsigned int cmd,</span></span>
<span class="line"><span>	     unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error = 0;</span></span>
<span class="line"><span>	int __user *argp = (int __user *)arg;</span></span>
<span class="line"><span>	struct inode *inode = file_inode(filp);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch (cmd) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case FIONBIO:</span></span>
<span class="line"><span>		error = ioctl_fionbio(filp, argp);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	case FIOASYNC:</span></span>
<span class="line"><span>		error = ioctl_fioasync(fd, filp, argp);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case FICLONE:</span></span>
<span class="line"><span>		return ioctl_file_clone(filp, arg, 0, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	default:</span></span>
<span class="line"><span>		if (S_ISREG(inode-&amp;gt;i_mode))</span></span>
<span class="line"><span>			error = file_ioctl(filp, cmd, arg);</span></span>
<span class="line"><span>		else</span></span>
<span class="line"><span>			error = vfs_ioctl(filp, cmd, arg);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return error;</span></span></code></pre></div><p>由于咱们这里是设备驱动程序，所以调用的是vfs_ioctl。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * vfs_ioctl - call filesystem specific ioctl methods</span></span>
<span class="line"><span> * &amp;#64;filp:	open file to invoke ioctl method on</span></span>
<span class="line"><span> * &amp;#64;cmd:	ioctl command to execute</span></span>
<span class="line"><span> * &amp;#64;arg:	command-specific argument for ioctl</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Invokes filesystem specific -&amp;gt;unlocked_ioctl, if one exists; otherwise</span></span>
<span class="line"><span> * returns -ENOTTY.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * Returns 0 on success, -errno on error.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>long vfs_ioctl(struct file *filp, unsigned int cmd, unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error = -ENOTTY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!filp-&amp;gt;f_op-&amp;gt;unlocked_ioctl)</span></span>
<span class="line"><span>		goto out;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	error = filp-&amp;gt;f_op-&amp;gt;unlocked_ioctl(filp, cmd, arg);</span></span>
<span class="line"><span>	if (error == -ENOIOCTLCMD)</span></span>
<span class="line"><span>		error = -ENOTTY;</span></span>
<span class="line"><span> out:</span></span>
<span class="line"><span>	return error;</span></span></code></pre></div><p>这里面调用的是struct file里file_operations的unlocked_ioctl函数。我们前面初始化设备驱动的时候，已经将file_operations指向设备驱动的file_operations了。这里调用的是设备驱动的unlocked_ioctl。对于打印机程序来讲，调用的是lp_ioctl。可以看出来，这里面就是switch语句，它会根据不同的cmd，做不同的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static long lp_ioctl(struct file *file, unsigned int cmd,</span></span>
<span class="line"><span>			unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned int minor;</span></span>
<span class="line"><span>	struct timeval par_timeout;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	minor = iminor(file_inode(file));</span></span>
<span class="line"><span>	mutex_lock(&amp;lp_mutex);</span></span>
<span class="line"><span>	switch (cmd) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	default:</span></span>
<span class="line"><span>		ret = lp_do_ioctl(minor, cmd, arg, (void __user *)arg);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	mutex_unlock(&amp;lp_mutex);</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int lp_do_ioctl(unsigned int minor, unsigned int cmd,</span></span>
<span class="line"><span>	unsigned long arg, void __user *argp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int status;</span></span>
<span class="line"><span>	int retval = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	switch ( cmd ) {</span></span>
<span class="line"><span>		case LPTIME:</span></span>
<span class="line"><span>			if (arg &amp;gt; UINT_MAX / HZ)</span></span>
<span class="line"><span>				return -EINVAL;</span></span>
<span class="line"><span>			LP_TIME(minor) = arg * HZ/100;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPCHAR:</span></span>
<span class="line"><span>			LP_CHAR(minor) = arg;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPABORT:</span></span>
<span class="line"><span>			if (arg)</span></span>
<span class="line"><span>				LP_F(minor) |= LP_ABORT;</span></span>
<span class="line"><span>			else</span></span>
<span class="line"><span>				LP_F(minor) &amp;= ~LP_ABORT;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPABORTOPEN:</span></span>
<span class="line"><span>			if (arg)</span></span>
<span class="line"><span>				LP_F(minor) |= LP_ABORTOPEN;</span></span>
<span class="line"><span>			else</span></span>
<span class="line"><span>				LP_F(minor) &amp;= ~LP_ABORTOPEN;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPCAREFUL:</span></span>
<span class="line"><span>			if (arg)</span></span>
<span class="line"><span>				LP_F(minor) |= LP_CAREFUL;</span></span>
<span class="line"><span>			else</span></span>
<span class="line"><span>				LP_F(minor) &amp;= ~LP_CAREFUL;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPWAIT:</span></span>
<span class="line"><span>			LP_WAIT(minor) = arg;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPSETIRQ:</span></span>
<span class="line"><span>			return -EINVAL;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPGETIRQ:</span></span>
<span class="line"><span>			if (copy_to_user(argp, &amp;LP_IRQ(minor),</span></span>
<span class="line"><span>					sizeof(int)))</span></span>
<span class="line"><span>				return -EFAULT;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPGETSTATUS:</span></span>
<span class="line"><span>			if (mutex_lock_interruptible(&amp;lp_table[minor].port_mutex))</span></span>
<span class="line"><span>				return -EINTR;</span></span>
<span class="line"><span>			lp_claim_parport_or_block (&amp;lp_table[minor]);</span></span>
<span class="line"><span>			status = r_str(minor);</span></span>
<span class="line"><span>			lp_release_parport (&amp;lp_table[minor]);</span></span>
<span class="line"><span>			mutex_unlock(&amp;lp_table[minor].port_mutex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			if (copy_to_user(argp, &amp;status, sizeof(int)))</span></span>
<span class="line"><span>				return -EFAULT;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		case LPRESET:</span></span>
<span class="line"><span>			lp_reset(minor);</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span> 		case LPGETFLAGS:</span></span>
<span class="line"><span> 			status = LP_F(minor);</span></span>
<span class="line"><span>			if (copy_to_user(argp, &amp;status, sizeof(int)))</span></span>
<span class="line"><span>				return -EFAULT;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		default:</span></span>
<span class="line"><span>			retval = -EINVAL;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return retval</span></span></code></pre></div><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节我们讲了字符设备的打开、写入和ioctl等最常见的操作。一个字符设备要能够工作，需要三部分配合。</p><p>第一，有一个设备驱动程序的ko模块，里面有模块初始化函数、中断处理函数、设备操作函数。这里面封装了对于外部设备的操作。加载设备驱动程序模块的时候，模块初始化函数会被调用。在内核维护所有字符设备驱动的数据结构cdev_map里面注册，我们就可以很容易根据设备号，找到相应的设备驱动程序。</p><p>第二，在/dev目录下有一个文件表示这个设备，这个文件在特殊的devtmpfs文件系统上，因而也有相应的dentry和inode。这里的inode是一个特殊的inode，里面有设备号。通过它，我们可以在cdev_map中找到设备驱动程序，里面还有针对字符设备文件的默认操作def_chr_fops。</p><p>第三，打开一个字符设备文件和打开一个普通的文件有类似的数据结构，有文件描述符、有struct file、指向字符设备文件的dentry和inode。字符设备文件的相关操作file_operations一开始指向def_chr_fops，在调用def_chr_fops里面的chrdev_open函数的时候，修改为指向设备操作函数，从而读写一个字符设备文件就会直接变成读写外部设备了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/fba61fe95e0d2746235b1070eb4c18cd.jpeg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/fba61fe95e0d2746235b1070eb4c18cd.jpeg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这节我用打印机驱动程序作为例子来给你讲解字符设备，请你仔细看一下它的代码，设想一下，如果让你自己写一个字符设备驱动程序，应该实现哪些函数呢？</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/100068/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,95)])])}const m=n(t,[["render",i]]);export{u as __pageData,m as default};
