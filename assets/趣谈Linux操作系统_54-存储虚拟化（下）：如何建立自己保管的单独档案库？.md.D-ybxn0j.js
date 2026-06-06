import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"54 | 存储虚拟化（下）：如何建立自己保管的单独档案库？","description":"","frontmatter":{},"headers":[{"level":2,"title":"前端设备驱动virtio_blk","slug":"前端设备驱动virtio-blk","link":"#前端设备驱动virtio-blk","children":[]},{"level":2,"title":"中间virtio队列的管理","slug":"中间virtio队列的管理","link":"#中间virtio队列的管理","children":[]},{"level":2,"title":"数据写入的流程","slug":"数据写入的流程","link":"#数据写入的流程","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/54-存储虚拟化（下）：如何建立自己保管的单独档案库？.md","filePath":"趣谈Linux操作系统/54-存储虚拟化（下）：如何建立自己保管的单独档案库？.md","lastUpdated":1779822193000}'),i={name:"趣谈Linux操作系统/54-存储虚拟化（下）：如何建立自己保管的单独档案库？.md"};function t(l,s,c,r,_,v){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_54-存储虚拟化-下-如何建立自己保管的单独档案库" tabindex="-1">54 | 存储虚拟化（下）：如何建立自己保管的单独档案库？ <a class="header-anchor" href="#_54-存储虚拟化-下-如何建立自己保管的单独档案库" aria-label="Permalink to &quot;54 | 存储虚拟化（下）：如何建立自己保管的单独档案库？&quot;">​</a></h1><p>上一节，我们讲了qemu启动过程中的存储虚拟化。好了，现在qemu启动了，硬盘设备文件已经打开了。那如果我们要往虚拟机的一个进程写入一个文件，该怎么做呢？最终这个文件又是如何落到宿主机上的硬盘文件的呢？这一节，我们一起来看一看。</p><h2 id="前端设备驱动virtio-blk" tabindex="-1">前端设备驱动virtio_blk <a class="header-anchor" href="#前端设备驱动virtio-blk" aria-label="Permalink to &quot;前端设备驱动virtio\\_blk&quot;">​</a></h2><p>虚拟机里面的进程写入一个文件，当然要通过文件系统。整个过程和咱们在 <a href="https://time.geekbang.org/column/article/97876" target="_blank" rel="noreferrer">文件系统</a> 那一节讲的过程没有区别。只是到了设备驱动层，我们看到的就不是普通的硬盘驱动了，而是virtio的驱动。</p><p>virtio的驱动程序代码在Linux操作系统的源代码里面，文件名叫drivers/block/virtio_blk.c。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __init init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	virtblk_wq = alloc_workqueue(&quot;virtio-blk&quot;, 0, 0);</span></span>
<span class="line"><span>	major = register_blkdev(0, &quot;virtblk&quot;);</span></span>
<span class="line"><span>	error = register_virtio_driver(&amp;virtio_blk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module_init(init);</span></span>
<span class="line"><span>module_exit(fini);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MODULE_DEVICE_TABLE(virtio, id_table);</span></span>
<span class="line"><span>MODULE_DESCRIPTION(&quot;Virtio block driver&quot;);</span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct virtio_driver virtio_blk = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.driver.name			= KBUILD_MODNAME,</span></span>
<span class="line"><span>	.driver.owner			= THIS_MODULE,</span></span>
<span class="line"><span>	.id_table			= id_table,</span></span>
<span class="line"><span>	.probe				= virtblk_probe,</span></span>
<span class="line"><span>	.remove				= virtblk_remove,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>前面我们介绍过设备驱动程序，从这里的代码中，我们能看到非常熟悉的结构。它会创建一个workqueue，注册一个块设备，并获得一个主设备号，然后注册一个驱动函数virtio_blk。</p><p>当一个设备驱动作为一个内核模块被初始化的时候，probe函数会被调用，因而我们来看一下virtblk_probe。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int virtblk_probe(struct virtio_device *vdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_blk *vblk;</span></span>
<span class="line"><span>	struct request_queue *q;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vdev-&amp;gt;priv = vblk = kmalloc(sizeof(*vblk), GFP_KERNEL);</span></span>
<span class="line"><span>	vblk-&amp;gt;vdev = vdev;</span></span>
<span class="line"><span>	vblk-&amp;gt;sg_elems = sg_elems;</span></span>
<span class="line"><span>	INIT_WORK(&amp;vblk-&amp;gt;config_work, virtblk_config_changed_work);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = init_vq(vblk);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vblk-&amp;gt;disk = alloc_disk(1 &amp;lt;&amp;lt; PART_BITS);</span></span>
<span class="line"><span>	memset(&amp;vblk-&amp;gt;tag_set, 0, sizeof(vblk-&amp;gt;tag_set));</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.ops = &amp;virtio_mq_ops;</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.queue_depth = virtblk_queue_depth;</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.numa_node = NUMA_NO_NODE;</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.flags = BLK_MQ_F_SHOULD_MERGE;</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.cmd_size =</span></span>
<span class="line"><span>		sizeof(struct virtblk_req) +</span></span>
<span class="line"><span>		sizeof(struct scatterlist) * sg_elems;</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.driver_data = vblk;</span></span>
<span class="line"><span>	vblk-&amp;gt;tag_set.nr_hw_queues = vblk-&amp;gt;num_vqs;</span></span>
<span class="line"><span>	err = blk_mq_alloc_tag_set(&amp;vblk-&amp;gt;tag_set);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	q = blk_mq_init_queue(&amp;vblk-&amp;gt;tag_set);</span></span>
<span class="line"><span>	vblk-&amp;gt;disk-&amp;gt;queue = q;</span></span>
<span class="line"><span>	q-&amp;gt;queuedata = vblk;</span></span>
<span class="line"><span>	virtblk_name_format(&quot;vd&quot;, index, vblk-&amp;gt;disk-&amp;gt;disk_name, DISK_NAME_LEN);</span></span>
<span class="line"><span>	vblk-&amp;gt;disk-&amp;gt;major = major;</span></span>
<span class="line"><span>	vblk-&amp;gt;disk-&amp;gt;first_minor = index_to_minor(index);</span></span>
<span class="line"><span>	vblk-&amp;gt;disk-&amp;gt;private_data = vblk;</span></span>
<span class="line"><span>	vblk-&amp;gt;disk-&amp;gt;fops = &amp;virtblk_fops;</span></span>
<span class="line"><span>	vblk-&amp;gt;disk-&amp;gt;flags |= GENHD_FL_EXT_DEVT;</span></span>
<span class="line"><span>	vblk-&amp;gt;index = index;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	device_add_disk(&amp;vdev-&amp;gt;dev, vblk-&amp;gt;disk);</span></span>
<span class="line"><span>	err = device_create_file(disk_to_dev(vblk-&amp;gt;disk), &amp;dev_attr_serial);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtblk_probe中，我们首先看到的是struct request_queue，这是每一个块设备都有的一个队列。还记得吗？它有两个函数，一个是make_request_fn函数，用于生成request；另一个是request_fn函数，用于处理request。</p><p>这个request_queue的初始化过程在blk_mq_init_queue中。它会调用blk_mq_init_allocated_queue-&gt;blk_queue_make_request。在这里面，我们可以将make_request_fn函数设置为blk_mq_make_request，也就是说，一旦上层有写入请求，我们就通过blk_mq_make_request这个函数，将请求放入request_queue队列中。</p><p>另外，在virtblk_probe中，我们会初始化一个gendisk。前面我们也讲了，每一个块设备都有这样一个结构。</p><p>在virtblk_probe中，还有一件重要的事情就是，init_vq会来初始化virtqueue。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int init_vq(struct virtio_blk *vblk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span>	vq_callback_t **callbacks;</span></span>
<span class="line"><span>	const char **names;</span></span>
<span class="line"><span>	struct virtqueue **vqs;</span></span>
<span class="line"><span>	unsigned short num_vqs;</span></span>
<span class="line"><span>	struct virtio_device *vdev = vblk-&amp;gt;vdev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vblk-&amp;gt;vqs = kmalloc_array(num_vqs, sizeof(*vblk-&amp;gt;vqs), GFP_KERNEL);</span></span>
<span class="line"><span>	names = kmalloc_array(num_vqs, sizeof(*names), GFP_KERNEL);</span></span>
<span class="line"><span>	callbacks = kmalloc_array(num_vqs, sizeof(*callbacks), GFP_KERNEL);</span></span>
<span class="line"><span>	vqs = kmalloc_array(num_vqs, sizeof(*vqs), GFP_KERNEL);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; num_vqs; i++) {</span></span>
<span class="line"><span>		callbacks[i] = virtblk_done;</span></span>
<span class="line"><span>		names[i] = vblk-&amp;gt;vqs[i].name;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Discover virtqueues and write information to configuration.  */</span></span>
<span class="line"><span>	err = virtio_find_vqs(vdev, num_vqs, vqs, callbacks, names, &amp;desc);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; num_vqs; i++) {</span></span>
<span class="line"><span>		vblk-&amp;gt;vqs[i].vq = vqs[i];</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	vblk-&amp;gt;num_vqs = num_vqs;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照上面的原理来说，virtqueue是一个介于客户机前端和qemu后端的一个结构，用于在这两端之间传递数据。这里建立的struct virtqueue是客户机前端对于队列的管理的数据结构，在客户机的linux内核中通过kmalloc_array进行分配。</p><p>而队列的实体需要通过函数virtio_find_vqs查找或者生成，所以这里我们还把callback函数指定为virtblk_done。当buffer使用发生变化的时候，我们需要调用这个callback函数进行通知。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline</span></span>
<span class="line"><span>int virtio_find_vqs(struct virtio_device *vdev, unsigned nvqs,</span></span>
<span class="line"><span>			struct virtqueue *vqs[], vq_callback_t *callbacks[],</span></span>
<span class="line"><span>			const char * const names[],</span></span>
<span class="line"><span>			struct irq_affinity *desc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	return vdev-&amp;gt;config-&amp;gt;find_vqs(vdev, nvqs, vqs, callbacks, names, NULL, desc);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct virtio_config_ops virtio_pci_config_ops = {</span></span>
<span class="line"><span>	.get		= vp_get,</span></span>
<span class="line"><span>	.set		= vp_set,</span></span>
<span class="line"><span>	.generation	= vp_generation,</span></span>
<span class="line"><span>	.get_status	= vp_get_status,</span></span>
<span class="line"><span>	.set_status	= vp_set_status,</span></span>
<span class="line"><span>	.reset		= vp_reset,</span></span>
<span class="line"><span>	.find_vqs	= vp_modern_find_vqs,</span></span>
<span class="line"><span>	.del_vqs	= vp_del_vqs,</span></span>
<span class="line"><span>	.get_features	= vp_get_features,</span></span>
<span class="line"><span>	.finalize_features = vp_finalize_features,</span></span>
<span class="line"><span>	.bus_name	= vp_bus_name,</span></span>
<span class="line"><span>	.set_vq_affinity = vp_set_vq_affinity,</span></span>
<span class="line"><span>	.get_vq_affinity = vp_get_vq_affinity,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>根据virtio_config_ops的定义，virtio_find_vqs会调用vp_modern_find_vqs。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int vp_modern_find_vqs(struct virtio_device *vdev, unsigned nvqs,</span></span>
<span class="line"><span>			      struct virtqueue *vqs[],</span></span>
<span class="line"><span>			      vq_callback_t *callbacks[],</span></span>
<span class="line"><span>			      const char * const names[], const bool *ctx,</span></span>
<span class="line"><span>			      struct irq_affinity *desc)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_pci_device *vp_dev = to_vp_device(vdev);</span></span>
<span class="line"><span>	struct virtqueue *vq;</span></span>
<span class="line"><span>	int rc = vp_find_vqs(vdev, nvqs, vqs, callbacks, names, ctx, desc);</span></span>
<span class="line"><span>	/* Select and activate all queues. Has to be done last: once we do</span></span>
<span class="line"><span>	 * this, there&#39;s no way to go back except reset.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	list_for_each_entry(vq, &amp;vdev-&amp;gt;vqs, list) {</span></span>
<span class="line"><span>		vp_iowrite16(vq-&amp;gt;index, &amp;vp_dev-&amp;gt;common-&amp;gt;queue_select);</span></span>
<span class="line"><span>		vp_iowrite16(1, &amp;vp_dev-&amp;gt;common-&amp;gt;queue_enable);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在vp_modern_find_vqs中，vp_find_vqs会调用vp_find_vqs_intx。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int vp_find_vqs_intx(struct virtio_device *vdev, unsigned nvqs,</span></span>
<span class="line"><span>		struct virtqueue *vqs[], vq_callback_t *callbacks[],</span></span>
<span class="line"><span>		const char * const names[], const bool *ctx)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_pci_device *vp_dev = to_vp_device(vdev);</span></span>
<span class="line"><span>	int i, err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	vp_dev-&amp;gt;vqs = kcalloc(nvqs, sizeof(*vp_dev-&amp;gt;vqs), GFP_KERNEL);</span></span>
<span class="line"><span>	err = request_irq(vp_dev-&amp;gt;pci_dev-&amp;gt;irq, vp_interrupt, IRQF_SHARED,</span></span>
<span class="line"><span>			dev_name(&amp;vdev-&amp;gt;dev), vp_dev);</span></span>
<span class="line"><span>	vp_dev-&amp;gt;intx_enabled = 1;</span></span>
<span class="line"><span>	vp_dev-&amp;gt;per_vq_vectors = false;</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; nvqs; ++i) {</span></span>
<span class="line"><span>		vqs[i] = vp_setup_vq(vdev, i, callbacks[i], names[i],</span></span>
<span class="line"><span>				     ctx ? ctx[i] : false,</span></span>
<span class="line"><span>				     VIRTIO_MSI_NO_VECTOR);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在vp_find_vqs_intx中，我们通过request_irq注册一个中断处理函数vp_interrupt，当设备的配置信息发生改变，会产生一个中断，当设备向队列中写入信息时，也会产生一个中断，我们称为vq中断，中断处理函数需要调用相应的队列的回调函数。</p><p>然后，我们根据队列的数目，依次调用vp_setup_vq，完成virtqueue、vring的分配和初始化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct virtqueue *vp_setup_vq(struct virtio_device *vdev, unsigned index,</span></span>
<span class="line"><span>				     void (*callback)(struct virtqueue *vq),</span></span>
<span class="line"><span>				     const char *name,</span></span>
<span class="line"><span>				     bool ctx,</span></span>
<span class="line"><span>				     u16 msix_vec)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_pci_device *vp_dev = to_vp_device(vdev);</span></span>
<span class="line"><span>	struct virtio_pci_vq_info *info = kmalloc(sizeof *info, GFP_KERNEL);</span></span>
<span class="line"><span>	struct virtqueue *vq;</span></span>
<span class="line"><span>	unsigned long flags;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vq = vp_dev-&amp;gt;setup_vq(vp_dev, info, index, callback, name, ctx,</span></span>
<span class="line"><span>			      msix_vec);</span></span>
<span class="line"><span>	info-&amp;gt;vq = vq;</span></span>
<span class="line"><span>	if (callback) {</span></span>
<span class="line"><span>		spin_lock_irqsave(&amp;vp_dev-&amp;gt;lock, flags);</span></span>
<span class="line"><span>		list_add(&amp;info-&amp;gt;node, &amp;vp_dev-&amp;gt;virtqueues);</span></span>
<span class="line"><span>		spin_unlock_irqrestore(&amp;vp_dev-&amp;gt;lock, flags);</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>		INIT_LIST_HEAD(&amp;info-&amp;gt;node);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	vp_dev-&amp;gt;vqs[index] = info;</span></span>
<span class="line"><span>	return vq;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct virtqueue *setup_vq(struct virtio_pci_device *vp_dev,</span></span>
<span class="line"><span>				  struct virtio_pci_vq_info *info,</span></span>
<span class="line"><span>				  unsigned index,</span></span>
<span class="line"><span>				  void (*callback)(struct virtqueue *vq),</span></span>
<span class="line"><span>				  const char *name,</span></span>
<span class="line"><span>				  bool ctx,</span></span>
<span class="line"><span>				  u16 msix_vec)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_pci_common_cfg __iomem *cfg = vp_dev-&amp;gt;common;</span></span>
<span class="line"><span>	struct virtqueue *vq;</span></span>
<span class="line"><span>	u16 num, off;</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Select the queue we&#39;re interested in */</span></span>
<span class="line"><span>	vp_iowrite16(index, &amp;cfg-&amp;gt;queue_select);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Check if queue is either not available or already active. */</span></span>
<span class="line"><span>	num = vp_ioread16(&amp;cfg-&amp;gt;queue_size);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* get offset of notification word for this vq */</span></span>
<span class="line"><span>	off = vp_ioread16(&amp;cfg-&amp;gt;queue_notify_off);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	info-&amp;gt;msix_vector = msix_vec;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* create the vring */</span></span>
<span class="line"><span>	vq = vring_create_virtqueue(index, num,</span></span>
<span class="line"><span>				    SMP_CACHE_BYTES, &amp;vp_dev-&amp;gt;vdev,</span></span>
<span class="line"><span>				    true, true, ctx,</span></span>
<span class="line"><span>				    vp_notify, callback, name);</span></span>
<span class="line"><span>	/* activate the queue */</span></span>
<span class="line"><span>	vp_iowrite16(virtqueue_get_vring_size(vq), &amp;cfg-&amp;gt;queue_size);</span></span>
<span class="line"><span>	vp_iowrite64_twopart(virtqueue_get_desc_addr(vq),</span></span>
<span class="line"><span>			     &amp;cfg-&amp;gt;queue_desc_lo, &amp;cfg-&amp;gt;queue_desc_hi);</span></span>
<span class="line"><span>	vp_iowrite64_twopart(virtqueue_get_avail_addr(vq),</span></span>
<span class="line"><span>			     &amp;cfg-&amp;gt;queue_avail_lo, &amp;cfg-&amp;gt;queue_avail_hi);</span></span>
<span class="line"><span>	vp_iowrite64_twopart(virtqueue_get_used_addr(vq),</span></span>
<span class="line"><span>			     &amp;cfg-&amp;gt;queue_used_lo, &amp;cfg-&amp;gt;queue_used_hi);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return vq;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct virtqueue *vring_create_virtqueue(</span></span>
<span class="line"><span>	unsigned int index,</span></span>
<span class="line"><span>	unsigned int num,</span></span>
<span class="line"><span>	unsigned int vring_align,</span></span>
<span class="line"><span>	struct virtio_device *vdev,</span></span>
<span class="line"><span>	bool weak_barriers,</span></span>
<span class="line"><span>	bool may_reduce_num,</span></span>
<span class="line"><span>	bool context,</span></span>
<span class="line"><span>	bool (*notify)(struct virtqueue *),</span></span>
<span class="line"><span>	void (*callback)(struct virtqueue *),</span></span>
<span class="line"><span>	const char *name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtqueue *vq;</span></span>
<span class="line"><span>	void *queue = NULL;</span></span>
<span class="line"><span>	dma_addr_t dma_addr;</span></span>
<span class="line"><span>	size_t queue_size_in_bytes;</span></span>
<span class="line"><span>	struct vring vring;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* TODO: allocate each queue chunk individually */</span></span>
<span class="line"><span>	for (; num &amp;&amp; vring_size(num, vring_align) &amp;gt; PAGE_SIZE; num /= 2) {</span></span>
<span class="line"><span>		queue = vring_alloc_queue(vdev, vring_size(num, vring_align),</span></span>
<span class="line"><span>					  &amp;dma_addr,</span></span>
<span class="line"><span>					  GFP_KERNEL|__GFP_NOWARN|__GFP_ZERO);</span></span>
<span class="line"><span>		if (queue)</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!queue) {</span></span>
<span class="line"><span>		/* Try to get a single page. You are my only hope! */</span></span>
<span class="line"><span>		queue = vring_alloc_queue(vdev, vring_size(num, vring_align),</span></span>
<span class="line"><span>					  &amp;dma_addr, GFP_KERNEL|__GFP_ZERO);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	queue_size_in_bytes = vring_size(num, vring_align);</span></span>
<span class="line"><span>	vring_init(&amp;vring, num, queue, vring_align);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	vq = __vring_new_virtqueue(index, vring, vdev, weak_barriers, context, notify, callback, name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	to_vvq(vq)-&amp;gt;queue_dma_addr = dma_addr;</span></span>
<span class="line"><span>	to_vvq(vq)-&amp;gt;queue_size_in_bytes = queue_size_in_bytes;</span></span>
<span class="line"><span>	to_vvq(vq)-&amp;gt;we_own_ring = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return vq;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在vring_create_virtqueue中，我们会调用vring_alloc_queue，来创建队列所需要的内存空间，然后调用vring_init初始化结构struct vring，来管理队列的内存空间，调用__vring_new_virtqueue，来创建struct vring_virtqueue。</p><p>这个结构的一开始，是struct virtqueue，它也是struct virtqueue的一个扩展，紧接着后面就是struct vring。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct vring_virtqueue {</span></span>
<span class="line"><span>	struct virtqueue vq;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Actual memory layout for this queue */</span></span>
<span class="line"><span>	struct vring vring;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此我们发现，虚拟机里面的virtio的前端是这样的结构：struct virtio_device里面有一个struct vring_virtqueue，在struct vring_virtqueue里面有一个struct vring。</p><h2 id="中间virtio队列的管理" tabindex="-1">中间virtio队列的管理 <a class="header-anchor" href="#中间virtio队列的管理" aria-label="Permalink to &quot;中间virtio队列的管理&quot;">​</a></h2><p>还记不记得我们上面讲qemu初始化的时候，virtio的后端有数据结构VirtIODevice，VirtQueue和vring一模一样，前端和后端对应起来，都应该指向刚才创建的那一段内存。</p><p>现在的问题是，我们刚才分配的内存在客户机的内核里面，如何告知qemu来访问这段内存呢？</p><p>别忘了，qemu模拟出来的virtio block device只是一个PCI设备。对于客户机来讲，这是一个外部设备，我们可以通过给外部设备发送指令的方式告知外部设备，这就是代码中vp_iowrite16的作用。它会调用专门给外部设备发送指令的函数iowrite，告诉外部的PCI设备。</p><p>告知的有三个地址virtqueue_get_desc_addr、virtqueue_get_avail_addr，virtqueue_get_used_addr。从客户机角度来看，这里面的地址都是物理地址，也即GPA（Guest Physical Address）。因为只有物理地址才是客户机和qemu程序都认可的地址，本来客户机的物理内存也是qemu模拟出来的。</p><p>在qemu中，对PCI总线添加一个设备的时候，我们会调用virtio_pci_device_plugged。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void virtio_pci_device_plugged(DeviceState *d, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIOPCIProxy *proxy = VIRTIO_PCI(d);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    memory_region_init_io(&amp;proxy-&amp;gt;bar, OBJECT(proxy),</span></span>
<span class="line"><span>                              &amp;virtio_pci_config_ops,</span></span>
<span class="line"><span>                              proxy, &quot;virtio-pci&quot;, size);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const MemoryRegionOps virtio_pci_config_ops = {</span></span>
<span class="line"><span>    .read = virtio_pci_config_read,</span></span>
<span class="line"><span>    .write = virtio_pci_config_write,</span></span>
<span class="line"><span>    .impl = {</span></span>
<span class="line"><span>        .min_access_size = 1,</span></span>
<span class="line"><span>        .max_access_size = 4,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    .endianness = DEVICE_LITTLE_ENDIAN,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在这里面，对于这个加载的设备进行I/O操作，会映射到读写某一块内存空间，对应的操作为virtio_pci_config_ops，也即写入这块内存空间，这就相当于对于这个PCI设备进行某种配置。</p><p>对PCI设备进行配置的时候，会有这样的调用链：virtio_pci_config_write-&gt;virtio_ioport_write-&gt;virtio_queue_set_addr。设置virtio的queue的地址是一项很重要的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void virtio_queue_set_addr(VirtIODevice *vdev, int n, hwaddr addr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    vdev-&amp;gt;vq[n].vring.desc = addr;</span></span>
<span class="line"><span>    virtio_queue_update_rings(vdev, n);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从这里我们可以看出，qemu后端的VirtIODevice的VirtQueue的vring的地址，被设置成了刚才给队列分配的内存的GPA。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/2572f8b1e75b9eaab6560866fcb31fd0.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/2572f8b1e75b9eaab6560866fcb31fd0.jpg" alt=""></a></p><p>接着，我们来看一下这个队列的格式。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/49414d5acc81933b66410bbba102b0db.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/49414d5acc81933b66410bbba102b0db.jpg" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* Virtio ring descriptors: 16 bytes.  These can chain together via &quot;next&quot;. */</span></span>
<span class="line"><span>struct vring_desc {</span></span>
<span class="line"><span>	/* Address (guest-physical). */</span></span>
<span class="line"><span>	__virtio64 addr;</span></span>
<span class="line"><span>	/* Length. */</span></span>
<span class="line"><span>	__virtio32 len;</span></span>
<span class="line"><span>	/* The flags as indicated above. */</span></span>
<span class="line"><span>	__virtio16 flags;</span></span>
<span class="line"><span>	/* We chain unused descriptors via this, too */</span></span>
<span class="line"><span>	__virtio16 next;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct vring_avail {</span></span>
<span class="line"><span>	__virtio16 flags;</span></span>
<span class="line"><span>	__virtio16 idx;</span></span>
<span class="line"><span>	__virtio16 ring[];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/* u32 is used here for ids for padding reasons. */</span></span>
<span class="line"><span>struct vring_used_elem {</span></span>
<span class="line"><span>	/* Index of start of used descriptor chain. */</span></span>
<span class="line"><span>	__virtio32 id;</span></span>
<span class="line"><span>	/* Total length of the descriptor chain which was used (written to) */</span></span>
<span class="line"><span>	__virtio32 len;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct vring_used {</span></span>
<span class="line"><span>	__virtio16 flags;</span></span>
<span class="line"><span>	__virtio16 idx;</span></span>
<span class="line"><span>	struct vring_used_elem ring[];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct vring {</span></span>
<span class="line"><span>	unsigned int num;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct vring_desc *desc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct vring_avail *avail;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct vring_used *used;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>vring包含三个成员：</p><ul><li>vring_desc指向分配的内存块，用于存放客户机和qemu之间传输的数据。</li><li>avail-&gt;ring[]是发送端维护的环形队列，指向需要接收端处理的vring_desc。</li><li>used-&gt;ring[]是接收端维护的环形队列，指向自己已经处理过了的vring_desc。</li></ul><h2 id="数据写入的流程" tabindex="-1">数据写入的流程 <a class="header-anchor" href="#数据写入的流程" aria-label="Permalink to &quot;数据写入的流程&quot;">​</a></h2><p>接下来，我们来看，真的写入一个数据的时候，会发生什么。</p><p>按照上面virtio驱动初始化的时候的逻辑，blk_mq_make_request会被调用。这个函数比较复杂，会分成多个分支，但是最终都会调用到request_queue的virtio_mq_ops的queue_rq函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct request_queue *q = rq-&amp;gt;q;</span></span>
<span class="line"><span>q-&amp;gt;mq_ops-&amp;gt;queue_rq(hctx, &amp;bd);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct blk_mq_ops virtio_mq_ops = {</span></span>
<span class="line"><span>	.queue_rq	= virtio_queue_rq,</span></span>
<span class="line"><span>	.complete	= virtblk_request_done,</span></span>
<span class="line"><span>	.init_request	= virtblk_init_request,</span></span>
<span class="line"><span>	.map_queues	= virtblk_map_queues,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>根据virtio_mq_ops的定义，我们现在要调用virtio_queue_rq。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static blk_status_t virtio_queue_rq(struct blk_mq_hw_ctx *hctx,</span></span>
<span class="line"><span>			   const struct blk_mq_queue_data *bd)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_blk *vblk = hctx-&amp;gt;queue-&amp;gt;queuedata;</span></span>
<span class="line"><span>	struct request *req = bd-&amp;gt;rq;</span></span>
<span class="line"><span>	struct virtblk_req *vbr = blk_mq_rq_to_pdu(req);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	err = virtblk_add_req(vblk-&amp;gt;vqs[qid].vq, vbr, vbr-&amp;gt;sg, num);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (notify)</span></span>
<span class="line"><span>		virtqueue_notify(vblk-&amp;gt;vqs[qid].vq);</span></span>
<span class="line"><span>	return BLK_STS_OK;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtio_queue_rq中，我们会将请求写入的数据，通过virtblk_add_req放入struct virtqueue。</p><p>因此，接下来的调用链为：virtblk_add_req-&gt;virtqueue_add_sgs-&gt;virtqueue_add。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline int virtqueue_add(struct virtqueue *_vq,</span></span>
<span class="line"><span>				struct scatterlist *sgs[],</span></span>
<span class="line"><span>				unsigned int total_sg,</span></span>
<span class="line"><span>				unsigned int out_sgs,</span></span>
<span class="line"><span>				unsigned int in_sgs,</span></span>
<span class="line"><span>				void *data,</span></span>
<span class="line"><span>				void *ctx,</span></span>
<span class="line"><span>				gfp_t gfp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vring_virtqueue *vq = to_vvq(_vq);</span></span>
<span class="line"><span>	struct scatterlist *sg;</span></span>
<span class="line"><span>	struct vring_desc *desc;</span></span>
<span class="line"><span>	unsigned int i, n, avail, descs_used, uninitialized_var(prev), err_idx;</span></span>
<span class="line"><span>	int head;</span></span>
<span class="line"><span>	bool indirect;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	head = vq-&amp;gt;free_head;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	indirect = false;</span></span>
<span class="line"><span>	desc = vq-&amp;gt;vring.desc;</span></span>
<span class="line"><span>	i = head;</span></span>
<span class="line"><span>	descs_used = total_sg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for (n = 0; n &amp;lt; out_sgs; n++) {</span></span>
<span class="line"><span>		for (sg = sgs[n]; sg; sg = sg_next(sg)) {</span></span>
<span class="line"><span>			dma_addr_t addr = vring_map_one_sg(vq, sg, DMA_TO_DEVICE);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>			desc[i].flags = cpu_to_virtio16(_vq-&amp;gt;vdev, VRING_DESC_F_NEXT);</span></span>
<span class="line"><span>			desc[i].addr = cpu_to_virtio64(_vq-&amp;gt;vdev, addr);</span></span>
<span class="line"><span>			desc[i].len = cpu_to_virtio32(_vq-&amp;gt;vdev, sg-&amp;gt;length);</span></span>
<span class="line"><span>			prev = i;</span></span>
<span class="line"><span>			i = virtio16_to_cpu(_vq-&amp;gt;vdev, desc[i].next);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Last one doesn&#39;t continue. */</span></span>
<span class="line"><span>	desc[prev].flags &amp;= cpu_to_virtio16(_vq-&amp;gt;vdev, ~VRING_DESC_F_NEXT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* We&#39;re using some buffers from the free list. */</span></span>
<span class="line"><span>	vq-&amp;gt;vq.num_free -= descs_used;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Update free pointer */</span></span>
<span class="line"><span>	vq-&amp;gt;free_head = i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Store token and indirect buffer state. */</span></span>
<span class="line"><span>	vq-&amp;gt;desc_state[head].data = data;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Put entry in available array (but don&#39;t update avail-&amp;gt;idx until they do sync). */</span></span>
<span class="line"><span>	avail = vq-&amp;gt;avail_idx_shadow &amp; (vq-&amp;gt;vring.num - 1);</span></span>
<span class="line"><span>	vq-&amp;gt;vring.avail-&amp;gt;ring[avail] = cpu_to_virtio16(_vq-&amp;gt;vdev, head);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Descriptors and available array need to be set before we expose the new available array entries. */</span></span>
<span class="line"><span>	virtio_wmb(vq-&amp;gt;weak_barriers);</span></span>
<span class="line"><span>	vq-&amp;gt;avail_idx_shadow++;</span></span>
<span class="line"><span>	vq-&amp;gt;vring.avail-&amp;gt;idx = cpu_to_virtio16(_vq-&amp;gt;vdev, vq-&amp;gt;avail_idx_shadow);</span></span>
<span class="line"><span>	vq-&amp;gt;num_added++;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtqueue_add函数中，我们能看到，free_head指向的整个内存块空闲链表的起始位置，用head变量记住这个起始位置。</p><p>接下来，i也指向这个起始位置，然后是一个for循环，将数据放到内存块里面，放的过程中，next不断指向下一个空闲位置，这样空闲的内存块被不断的占用。等所有的写入都结束了，i就会指向这次存放的内存块的下一个空闲位置，然后free_head就指向i，因为前面的都填满了。</p><p>至此，从head到i之间的内存块，就是这次写入的全部数据。</p><p>于是，在vring的avail变量中，在ring[]数组中分配新的一项，在avail的位置，avail的计算是avail_idx_shadow &amp; (vq-&gt;vring.num - 1)，其中，avail_idx_shadow是上一次的avail的位置。这里如果超过了ring[]数组的下标，则重新跳到起始位置，就说明是一个环。这次分配的新的avail的位置就存放新写入的从head到i之间的内存块。然后是avail_idx_shadow++，这说明这一块内存可以被接收方读取了。</p><p>接下来，我们回到virtio_queue_rq，调用virtqueue_notify通知接收方。而virtqueue_notify会调用vp_notify。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool vp_notify(struct virtqueue *vq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	/* we write the queue&#39;s selector into the notification register to</span></span>
<span class="line"><span>	 * signal the other end */</span></span>
<span class="line"><span>	iowrite16(vq-&amp;gt;index, (void __iomem *)vq-&amp;gt;priv);</span></span>
<span class="line"><span>	return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们写入一个I/O会触发VM exit。我们在解析CPU的时候看到过这个逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int kvm_cpu_exec(CPUState *cpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kvm_run *run = cpu-&amp;gt;kvm_run;</span></span>
<span class="line"><span>    int ret, run_ret;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    run_ret = kvm_vcpu_ioctl(cpu, KVM_RUN, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    switch (run-&amp;gt;exit_reason) {</span></span>
<span class="line"><span>        case KVM_EXIT_IO:</span></span>
<span class="line"><span>            DPRINTF(&quot;handle_io\\n&quot;);</span></span>
<span class="line"><span>            /* Called outside BQL */</span></span>
<span class="line"><span>            kvm_handle_io(run-&amp;gt;io.port, attrs,</span></span>
<span class="line"><span>                          (uint8_t *)run + run-&amp;gt;io.data_offset,</span></span>
<span class="line"><span>                          run-&amp;gt;io.direction,</span></span>
<span class="line"><span>                          run-&amp;gt;io.size,</span></span>
<span class="line"><span>                          run-&amp;gt;io.count);</span></span>
<span class="line"><span>            ret = 0;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这次写入的也是一个I/O的内存空间，同样会触发virtio_ioport_write，这次会调用virtio_queue_notify。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void virtio_queue_notify(VirtIODevice *vdev, int n)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtQueue *vq = &amp;vdev-&amp;gt;vq[n];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (vq-&amp;gt;handle_aio_output) {</span></span>
<span class="line"><span>        event_notifier_set(&amp;vq-&amp;gt;host_notifier);</span></span>
<span class="line"><span>    } else if (vq-&amp;gt;handle_output) {</span></span>
<span class="line"><span>        vq-&amp;gt;handle_output(vdev, vq);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>virtio_queue_notify会调用VirtQueue的handle_output函数，前面我们已经设置过这个函数了，是virtio_blk_handle_output。</p><p>接下来的调用链为：virtio_blk_handle_output-&gt;virtio_blk_handle_output_do-&gt;virtio_blk_handle_vq。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool virtio_blk_handle_vq(VirtIOBlock *s, VirtQueue *vq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIOBlockReq *req;</span></span>
<span class="line"><span>    MultiReqBuffer mrb = {};</span></span>
<span class="line"><span>    bool progress = false;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        virtio_queue_set_notification(vq, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while ((req = virtio_blk_get_request(s, vq))) {</span></span>
<span class="line"><span>            progress = true;</span></span>
<span class="line"><span>            if (virtio_blk_handle_request(req, &amp;mrb)) {</span></span>
<span class="line"><span>                virtqueue_detach_element(req-&amp;gt;vq, &amp;req-&amp;gt;elem, 0);</span></span>
<span class="line"><span>                virtio_blk_free_request(req);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        virtio_queue_set_notification(vq, 1);</span></span>
<span class="line"><span>    } while (!virtio_queue_empty(vq));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (mrb.num_reqs) {</span></span>
<span class="line"><span>        virtio_blk_submit_multireq(s-&amp;gt;blk, &amp;mrb);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return progress;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtio_blk_handle_vq中，有一个while循环，在循环中调用函数virtio_blk_get_request从vq中取出请求，然后调用virtio_blk_handle_request处理从vq中取出的请求。</p><p>我们先来看virtio_blk_get_request。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static VirtIOBlockReq *virtio_blk_get_request(VirtIOBlock *s, VirtQueue *vq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIOBlockReq *req = virtqueue_pop(vq, sizeof(VirtIOBlockReq));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (req) {</span></span>
<span class="line"><span>        virtio_blk_init_request(s, vq, req);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return req;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void *virtqueue_pop(VirtQueue *vq, size_t sz)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    unsigned int i, head, max;</span></span>
<span class="line"><span>    VRingMemoryRegionCaches *caches;</span></span>
<span class="line"><span>    MemoryRegionCache *desc_cache;</span></span>
<span class="line"><span>    int64_t len;</span></span>
<span class="line"><span>    VirtIODevice *vdev = vq-&amp;gt;vdev;</span></span>
<span class="line"><span>    VirtQueueElement *elem = NULL;</span></span>
<span class="line"><span>    unsigned out_num, in_num, elem_entries;</span></span>
<span class="line"><span>    hwaddr addr[VIRTQUEUE_MAX_SIZE];</span></span>
<span class="line"><span>    struct iovec iov[VIRTQUEUE_MAX_SIZE];</span></span>
<span class="line"><span>    VRingDesc desc;</span></span>
<span class="line"><span>    int rc;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* When we start there are none of either input nor output. */</span></span>
<span class="line"><span>    out_num = in_num = elem_entries = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    max = vq-&amp;gt;vring.num;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    i = head;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    caches = vring_get_region_caches(vq);</span></span>
<span class="line"><span>    desc_cache = &amp;caches-&amp;gt;desc;</span></span>
<span class="line"><span>    vring_desc_read(vdev, &amp;desc, desc_cache, i);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Collect all the descriptors */</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        bool map_ok;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (desc.flags &amp; VRING_DESC_F_WRITE) {</span></span>
<span class="line"><span>            map_ok = virtqueue_map_desc(vdev, &amp;in_num, addr + out_num,</span></span>
<span class="line"><span>                                        iov + out_num,</span></span>
<span class="line"><span>                                        VIRTQUEUE_MAX_SIZE - out_num, true,</span></span>
<span class="line"><span>                                        desc.addr, desc.len);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            map_ok = virtqueue_map_desc(vdev, &amp;out_num, addr, iov,</span></span>
<span class="line"><span>                                        VIRTQUEUE_MAX_SIZE, false,</span></span>
<span class="line"><span>                                        desc.addr, desc.len);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        rc = virtqueue_read_next_desc(vdev, &amp;desc, desc_cache, max, &amp;i);</span></span>
<span class="line"><span>    } while (rc == VIRTQUEUE_READ_DESC_MORE);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Now copy what we have collected and mapped */</span></span>
<span class="line"><span>    elem = virtqueue_alloc_element(sz, out_num, in_num);</span></span>
<span class="line"><span>    elem-&amp;gt;index = head;</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; out_num; i++) {</span></span>
<span class="line"><span>        elem-&amp;gt;out_addr[i] = addr[i];</span></span>
<span class="line"><span>        elem-&amp;gt;out_sg[i] = iov[i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; in_num; i++) {</span></span>
<span class="line"><span>        elem-&amp;gt;in_addr[i] = addr[out_num + i];</span></span>
<span class="line"><span>        elem-&amp;gt;in_sg[i] = iov[out_num + i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    vq-&amp;gt;inuse++;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return elem;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到，virtio_blk_get_request会调用virtqueue_pop。在这里面，我们能看到对于vring的操作，也即从这里面将客户机里面写入的数据读取出来，放到VirtIOBlockReq结构中。</p><p>接下来，我们就要调用virtio_blk_handle_request处理这些数据。所以接下来的调用链为：virtio_blk_handle_request-&gt;virtio_blk_submit_multireq-&gt;submit_requests。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static inline void submit_requests(BlockBackend *blk, MultiReqBuffer *mrb,int start, int num_reqs, int niov)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QEMUIOVector *qiov = &amp;mrb-&amp;gt;reqs[start]-&amp;gt;qiov;</span></span>
<span class="line"><span>    int64_t sector_num = mrb-&amp;gt;reqs[start]-&amp;gt;sector_num;</span></span>
<span class="line"><span>    bool is_write = mrb-&amp;gt;is_write;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (num_reqs &amp;gt; 1) {</span></span>
<span class="line"><span>        int i;</span></span>
<span class="line"><span>        struct iovec *tmp_iov = qiov-&amp;gt;iov;</span></span>
<span class="line"><span>        int tmp_niov = qiov-&amp;gt;niov;</span></span>
<span class="line"><span>        qemu_iovec_init(qiov, niov);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; tmp_niov; i++) {</span></span>
<span class="line"><span>            qemu_iovec_add(qiov, tmp_iov[i].iov_base, tmp_iov[i].iov_len);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = start + 1; i &amp;lt; start + num_reqs; i++) {</span></span>
<span class="line"><span>            qemu_iovec_concat(qiov, &amp;mrb-&amp;gt;reqs[i]-&amp;gt;qiov, 0,</span></span>
<span class="line"><span>                              mrb-&amp;gt;reqs[i]-&amp;gt;qiov.size);</span></span>
<span class="line"><span>            mrb-&amp;gt;reqs[i - 1]-&amp;gt;mr_next = mrb-&amp;gt;reqs[i];</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        block_acct_merge_done(blk_get_stats(blk),</span></span>
<span class="line"><span>                              is_write ? BLOCK_ACCT_WRITE : BLOCK_ACCT_READ,</span></span>
<span class="line"><span>                              num_reqs - 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (is_write) {</span></span>
<span class="line"><span>        blk_aio_pwritev(blk, sector_num &amp;lt;&amp;lt; BDRV_SECTOR_BITS, qiov, 0,</span></span>
<span class="line"><span>                        virtio_blk_rw_complete, mrb-&amp;gt;reqs[start]);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        blk_aio_preadv(blk, sector_num &amp;lt;&amp;lt; BDRV_SECTOR_BITS, qiov, 0,</span></span>
<span class="line"><span>                       virtio_blk_rw_complete, mrb-&amp;gt;reqs[start]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在submit_requests中，我们看到了BlockBackend。这是在qemu启动的时候，打开qcow2文件的时候生成的，现在我们可以用它来写入文件了，调用的是blk_aio_pwritev。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BlockAIOCB *blk_aio_pwritev(BlockBackend *blk, int64_t offset,</span></span>
<span class="line"><span>                            QEMUIOVector *qiov, BdrvRequestFlags flags,</span></span>
<span class="line"><span>                            BlockCompletionFunc *cb, void *opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return blk_aio_prwv(blk, offset, qiov-&amp;gt;size, qiov,</span></span>
<span class="line"><span>                        blk_aio_write_entry, flags, cb, opaque);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static BlockAIOCB *blk_aio_prwv(BlockBackend *blk, int64_t offset, int bytes,</span></span>
<span class="line"><span>                                void *iobuf, CoroutineEntry co_entry,</span></span>
<span class="line"><span>                                BdrvRequestFlags flags,</span></span>
<span class="line"><span>                                BlockCompletionFunc *cb, void *opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    BlkAioEmAIOCB *acb;</span></span>
<span class="line"><span>    Coroutine *co;</span></span>
<span class="line"><span>    acb = blk_aio_get(&amp;blk_aio_em_aiocb_info, blk, cb, opaque);</span></span>
<span class="line"><span>    acb-&amp;gt;rwco = (BlkRwCo) {</span></span>
<span class="line"><span>        .blk    = blk,</span></span>
<span class="line"><span>        .offset = offset,</span></span>
<span class="line"><span>        .iobuf  = iobuf,</span></span>
<span class="line"><span>        .flags  = flags,</span></span>
<span class="line"><span>        .ret    = NOT_DONE,</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    acb-&amp;gt;bytes = bytes;</span></span>
<span class="line"><span>    acb-&amp;gt;has_returned = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    co = qemu_coroutine_create(co_entry, acb);</span></span>
<span class="line"><span>    bdrv_coroutine_enter(blk_bs(blk), co);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    acb-&amp;gt;has_returned = true;</span></span>
<span class="line"><span>    return &amp;acb-&amp;gt;common;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在blk_aio_pwritev中，我们看到，又是创建了一个协程来进行写入。写入完毕之后调用virtio_blk_rw_complete-&gt;virtio_blk_req_complete。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void virtio_blk_req_complete(VirtIOBlockReq *req, unsigned char status)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIOBlock *s = req-&amp;gt;dev;</span></span>
<span class="line"><span>    VirtIODevice *vdev = VIRTIO_DEVICE(s);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    trace_virtio_blk_req_complete(vdev, req, status);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    stb_p(&amp;req-&amp;gt;in-&amp;gt;status, status);</span></span>
<span class="line"><span>    virtqueue_push(req-&amp;gt;vq, &amp;req-&amp;gt;elem, req-&amp;gt;in_len);</span></span>
<span class="line"><span>    virtio_notify(vdev, req-&amp;gt;vq);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtio_blk_req_complete中，我们先是调用virtqueue_push，更新vring中used变量，表示这部分已经写入完毕，空间可以回收利用了。但是，这部分的改变仅仅改变了qemu后端的vring，我们还需要通知客户机中virtio前端的vring的值，因而要调用virtio_notify。virtio_notify会调用virtio_irq发送一个中断。</p><p>还记得咱们前面注册过一个中断处理函数vp_interrupt吗？它就是干这个事情的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static irqreturn_t vp_interrupt(int irq, void *opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtio_pci_device *vp_dev = opaque;</span></span>
<span class="line"><span>	u8 isr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* reading the ISR has the effect of also clearing it so it&#39;s very</span></span>
<span class="line"><span>	 * important to save off the value. */</span></span>
<span class="line"><span>	isr = ioread8(vp_dev-&amp;gt;isr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Configuration change?  Tell driver if it wants to know. */</span></span>
<span class="line"><span>	if (isr &amp; VIRTIO_PCI_ISR_CONFIG)</span></span>
<span class="line"><span>		vp_config_changed(irq, opaque);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return vp_vring_interrupt(irq, opaque);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>就像前面说的一样vp_interrupt这个中断处理函数，一是处理配置变化，二是处理I/O结束。第二种的调用链为：vp_interrupt-&gt;vp_vring_interrupt-&gt;vring_interrupt。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>irqreturn_t vring_interrupt(int irq, void *_vq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vring_virtqueue *vq = to_vvq(_vq);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (vq-&amp;gt;vq.callback)</span></span>
<span class="line"><span>		vq-&amp;gt;vq.callback(&amp;vq-&amp;gt;vq);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return IRQ_HANDLED;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在vring_interrupt中，我们会调用callback函数，这个也是在前面注册过的，是virtblk_done。</p><p>接下来的调用链为：virtblk_done-&gt;virtqueue_get_buf-&gt;virtqueue_get_buf_ctx。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void *virtqueue_get_buf_ctx(struct virtqueue *_vq, unsigned int *len,</span></span>
<span class="line"><span>			    void **ctx)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vring_virtqueue *vq = to_vvq(_vq);</span></span>
<span class="line"><span>	void *ret;</span></span>
<span class="line"><span>	unsigned int i;</span></span>
<span class="line"><span>	u16 last_used;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	last_used = (vq-&amp;gt;last_used_idx &amp; (vq-&amp;gt;vring.num - 1));</span></span>
<span class="line"><span>	i = virtio32_to_cpu(_vq-&amp;gt;vdev, vq-&amp;gt;vring.used-&amp;gt;ring[last_used].id);</span></span>
<span class="line"><span>	*len = virtio32_to_cpu(_vq-&amp;gt;vdev, vq-&amp;gt;vring.used-&amp;gt;ring[last_used].len);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* detach_buf clears data, so grab it now. */</span></span>
<span class="line"><span>	ret = vq-&amp;gt;desc_state[i].data;</span></span>
<span class="line"><span>	detach_buf(vq, i, ctx);</span></span>
<span class="line"><span>	vq-&amp;gt;last_used_idx++;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtqueue_get_buf_ctx中，我们可以看到，virtio前端的vring中的last_used_idx加一，说明这块数据qemu后端已经消费完毕。我们可以通过detach_buf将其放入空闲队列中，留给以后的写入请求使用。</p><p>至此，整个存储虚拟化的写入流程才全部完成。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>下面我们来总结一下存储虚拟化的场景下，整个写入的过程。</p><ul><li>在虚拟机里面，应用层调用write系统调用写入文件。</li><li>write系统调用进入虚拟机里面的内核，经过VFS，通用块设备层，I/O调度层，到达块设备驱动。</li><li>虚拟机里面的块设备驱动是virtio_blk，它和通用的块设备驱动一样，有一个request queue，另外有一个函数make_request_fn会被设置为blk_mq_make_request，这个函数用于将请求放入队列。</li><li>虚拟机里面的块设备驱动是virtio_blk会注册一个中断处理函数vp_interrupt。当qemu写入完成之后，它会通知虚拟机里面的块设备驱动。</li><li>blk_mq_make_request最终调用virtqueue_add，将请求添加到传输队列virtqueue中，然后调用virtqueue_notify通知qemu。</li><li>在qemu中，本来虚拟机正处于KVM_RUN的状态，也即处于客户机状态。</li><li>qemu收到通知后，通过VM exit指令退出客户机状态，进入宿主机状态，根据退出原因，得知有I/O需要处理。</li><li>qemu调用virtio_blk_handle_output，最终调用virtio_blk_handle_vq。</li><li>virtio_blk_handle_vq里面有一个循环，在循环中，virtio_blk_get_request函数从传输队列中拿出请求，然后调用virtio_blk_handle_request处理请求。</li><li>virtio_blk_handle_request会调用blk_aio_pwritev，通过BlockBackend驱动写入qcow2文件。</li><li>写入完毕之后，virtio_blk_req_complete会调用virtio_notify通知虚拟机里面的驱动。数据写入完成，刚才注册的中断处理函数vp_interrupt会收到这个通知。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/79ad143a3149ea36bc80219940d7d00c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/79ad143a3149ea36bc80219940d7d00c.jpg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>请你沿着代码，仔细分析并牢记virtqueue的结构以及写入和读取方式。这个结构在下面的网络传输过程中，还要起大作用。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111522/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,95)])])}const d=n(i,[["render",t]]);export{u as __pageData,d as default};
