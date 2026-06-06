import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const v=JSON.parse('{"title":"53 | 存储虚拟化（上）：如何建立自己保管的单独档案库？","description":"","frontmatter":{},"headers":[{"level":2,"title":"virtio的基本原理","slug":"virtio的基本原理","link":"#virtio的基本原理","children":[]},{"level":2,"title":"初始化阶段的存储虚拟化","slug":"初始化阶段的存储虚拟化","link":"#初始化阶段的存储虚拟化","children":[]},{"level":2,"title":"qemu启动过程中的存储虚拟化","slug":"qemu启动过程中的存储虚拟化","link":"#qemu启动过程中的存储虚拟化","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/53-存储虚拟化（上）：如何建立自己保管的单独档案库？.md","filePath":"趣谈Linux操作系统/53-存储虚拟化（上）：如何建立自己保管的单独档案库？.md","lastUpdated":1779822193000}'),i={name:"趣谈Linux操作系统/53-存储虚拟化（上）：如何建立自己保管的单独档案库？.md"};function l(t,s,c,o,r,_){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_53-存储虚拟化-上-如何建立自己保管的单独档案库" tabindex="-1">53 | 存储虚拟化（上）：如何建立自己保管的单独档案库？ <a class="header-anchor" href="#_53-存储虚拟化-上-如何建立自己保管的单独档案库" aria-label="Permalink to &quot;53 | 存储虚拟化（上）：如何建立自己保管的单独档案库？&quot;">​</a></h1><p>前面几节，我们讲了CPU和内存的虚拟化。我们知道，完全虚拟化是很慢的，而通过内核的KVM技术和EPT技术，加速虚拟机对于物理CPU和内存的使用，我们称为硬件辅助虚拟化。</p><p>对于一台虚拟机而言，除了要虚拟化CPU和内存，存储和网络也需要虚拟化，存储和网络都属于外部设备，这些外部设备应该如何虚拟化呢？</p><p>当然一种方式还是完全虚拟化。比如，有什么样的硬盘设备或者网卡设备，我们就用qemu模拟一个一模一样的软件的硬盘和网卡设备，这样在虚拟机里面的操作系统看来，使用这些设备和使用物理设备是一样的。当然缺点就是，qemu模拟的设备又是一个翻译官的角色。虽然这个时候虚拟机里面的操作系统，意识不到自己是运行在虚拟机里面的，但是这种每个指令都翻译的方式，实在是太慢了。</p><p>另外一种方式就是，虚拟机里面的操作系统不是一个通用的操作系统，它知道自己是运行在虚拟机里面的，使用的硬盘设备和网络设备都是虚拟的，应该加载特殊的驱动才能运行。这些特殊的驱动往往要通过虚拟机里面和外面配合工作的模式，来加速对于物理存储和网络设备的使用。</p><h2 id="virtio的基本原理" tabindex="-1">virtio的基本原理 <a class="header-anchor" href="#virtio的基本原理" aria-label="Permalink to &quot;virtio的基本原理&quot;">​</a></h2><p>在虚拟化技术的早期，不同的虚拟化技术会针对不同硬盘设备和网络设备实现不同的驱动，虚拟机里面的操作系统也要根据不同的虚拟化技术和物理存储和网络设备，选择加载不同的驱动。但是，由于硬盘设备和网络设备太多了，驱动纷繁复杂。</p><p>后来慢慢就形成了一定的标准，这就是 <strong>virtio</strong>，就是 <strong>虚拟化I/O设备</strong> 的意思。virtio负责对于虚拟机提供统一的接口。也就是说，在虚拟机里面的操作系统加载的驱动，以后都统一加载virtio就可以了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/1e13ffd5ac846c52739291cb489d0233.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/1e13ffd5ac846c52739291cb489d0233.png" alt=""></a></p><p>在虚拟机外，我们可以实现不同的virtio的后端，来适配不同的物理硬件设备。那virtio到底长什么样子呢？我们一起来看一看。</p><p>virtio的架构可以分为四层。</p><ul><li>首先，在虚拟机里面的virtio前端，针对不同类型的设备有不同的 <strong>驱动程序</strong>，但是接口都是统一的。例如，硬盘就是virtio_blk，网络就是virtio_net。</li><li>其次，在宿主机的qemu里面，实现virtio后端的逻辑，主要就是 <strong>操作硬件的设备</strong>。例如通过写一个物理机硬盘上的文件来完成虚拟机写入硬盘的操作。再如向内核协议栈发送一个网络包完成虚拟机对于网络的操作。</li><li>在virtio的前端和后端之间，有一个通信层，里面包含 <strong>virtio层</strong> 和 <strong>virtio-ring层</strong>。virtio这一层实现的是虚拟队列接口，算是前后端通信的桥梁。而virtio-ring则是该桥梁的具体实现。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/2e9ef612f7b80ec9fcd91e200f4946f3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/2e9ef612f7b80ec9fcd91e200f4946f3.png" alt=""></a></p><p>virtio使用virtqueue进行前端和后端的高速通信。不同类型的设备队列数目不同。virtio-net使用两个队列，一个用于接收，另一个用于发送；而 virtio-blk仅使用一个队列。</p><p>如果客户机要向宿主机发送数据，客户机会将数据的buffer添加到virtqueue中，然后通过写入寄存器通知宿主机。这样宿主机就可以从virtqueue 中收到的buffer里面的数据。</p><p>了解了virtio的基本原理，接下来，我们以硬盘写入为例，具体看一下存储虚拟化的过程。</p><h2 id="初始化阶段的存储虚拟化" tabindex="-1">初始化阶段的存储虚拟化 <a class="header-anchor" href="#初始化阶段的存储虚拟化" aria-label="Permalink to &quot;初始化阶段的存储虚拟化&quot;">​</a></h2><p>和咱们在学习CPU的时候看到的一样，Virtio Block Device也是一种类。它的继承关系如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const TypeInfo device_type_info = {</span></span>
<span class="line"><span>    .name = TYPE_DEVICE,</span></span>
<span class="line"><span>    .parent = TYPE_OBJECT,</span></span>
<span class="line"><span>    .instance_size = sizeof(DeviceState),</span></span>
<span class="line"><span>    .instance_init = device_initfn,</span></span>
<span class="line"><span>    .instance_post_init = device_post_init,</span></span>
<span class="line"><span>    .instance_finalize = device_finalize,</span></span>
<span class="line"><span>    .class_base_init = device_class_base_init,</span></span>
<span class="line"><span>    .class_init = device_class_init,</span></span>
<span class="line"><span>    .abstract = true,</span></span>
<span class="line"><span>    .class_size = sizeof(DeviceClass),</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const TypeInfo virtio_device_info = {</span></span>
<span class="line"><span>    .name = TYPE_VIRTIO_DEVICE,</span></span>
<span class="line"><span>    .parent = TYPE_DEVICE,</span></span>
<span class="line"><span>    .instance_size = sizeof(VirtIODevice),</span></span>
<span class="line"><span>    .class_init = virtio_device_class_init,</span></span>
<span class="line"><span>    .instance_finalize = virtio_device_instance_finalize,</span></span>
<span class="line"><span>    .abstract = true,</span></span>
<span class="line"><span>    .class_size = sizeof(VirtioDeviceClass),</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const TypeInfo virtio_blk_info = {</span></span>
<span class="line"><span>    .name = TYPE_VIRTIO_BLK,</span></span>
<span class="line"><span>    .parent = TYPE_VIRTIO_DEVICE,</span></span>
<span class="line"><span>    .instance_size = sizeof(VirtIOBlock),</span></span>
<span class="line"><span>    .instance_init = virtio_blk_instance_init,</span></span>
<span class="line"><span>    .class_init = virtio_blk_class_init,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void virtio_register_types(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    type_register_static(&amp;virtio_blk_info);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type_init(virtio_register_types)</span></span></code></pre></div><p>Virtio Block Device这种类的定义是有多层继承关系的。TYPE_VIRTIO_BLK的父类是TYPE_VIRTIO_DEVICE，TYPE_VIRTIO_DEVICE的父类是TYPE_DEVICE，TYPE_DEVICE的父类是TYPE_OBJECT。到头了。</p><p>type_init用于注册这种类。这里面每一层都有class_init，用于从TypeImpl生产xxxClass。还有instance_init，可以将xxxClass初始化为实例。</p><p>在TYPE_VIRTIO_BLK层的class_init函数virtio_blk_class_init中，定义了DeviceClass的realize函数为virtio_blk_device_realize，这一点在 <a href="https://time.geekbang.org/column/article/109335" target="_blank" rel="noreferrer">CPU</a> 那一节也有类似的结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void virtio_blk_device_realize(DeviceState *dev, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIODevice *vdev = VIRTIO_DEVICE(dev);</span></span>
<span class="line"><span>    VirtIOBlock *s = VIRTIO_BLK(dev);</span></span>
<span class="line"><span>    VirtIOBlkConf *conf = &amp;s-&amp;gt;conf;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    blkconf_blocksizes(&amp;conf-&amp;gt;conf);</span></span>
<span class="line"><span>    virtio_blk_set_config_size(s, s-&amp;gt;host_features);</span></span>
<span class="line"><span>    virtio_init(vdev, &quot;virtio-blk&quot;, VIRTIO_ID_BLOCK, s-&amp;gt;config_size);</span></span>
<span class="line"><span>    s-&amp;gt;blk = conf-&amp;gt;conf.blk;</span></span>
<span class="line"><span>    s-&amp;gt;rq = NULL;</span></span>
<span class="line"><span>    s-&amp;gt;sector_mask = (s-&amp;gt;conf.conf.logical_block_size / BDRV_SECTOR_SIZE) - 1;</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; conf-&amp;gt;num_queues; i++) {</span></span>
<span class="line"><span>        virtio_add_queue(vdev, conf-&amp;gt;queue_size, virtio_blk_handle_output);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    virtio_blk_data_plane_create(vdev, conf, &amp;s-&amp;gt;dataplane, &amp;err);</span></span>
<span class="line"><span>    s-&amp;gt;change = qemu_add_vm_change_state_handler(virtio_blk_dma_restart_cb, s);</span></span>
<span class="line"><span>    blk_set_dev_ops(s-&amp;gt;blk, &amp;virtio_block_ops, s);</span></span>
<span class="line"><span>    blk_set_guest_block_size(s-&amp;gt;blk, s-&amp;gt;conf.conf.logical_block_size);</span></span>
<span class="line"><span>    blk_iostatus_enable(s-&amp;gt;blk);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtio_blk_device_realize函数中，我们先是通过virtio_init初始化VirtIODevice结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void virtio_init(VirtIODevice *vdev, const char *name,</span></span>
<span class="line"><span>                 uint16_t device_id, size_t config_size)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    BusState *qbus = qdev_get_parent_bus(DEVICE(vdev));</span></span>
<span class="line"><span>    VirtioBusClass *k = VIRTIO_BUS_GET_CLASS(qbus);</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    int nvectors = k-&amp;gt;query_nvectors ? k-&amp;gt;query_nvectors(qbus-&amp;gt;parent) : 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (nvectors) {</span></span>
<span class="line"><span>        vdev-&amp;gt;vector_queues =</span></span>
<span class="line"><span>            g_malloc0(sizeof(*vdev-&amp;gt;vector_queues) * nvectors);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    vdev-&amp;gt;device_id = device_id;</span></span>
<span class="line"><span>    vdev-&amp;gt;status = 0;</span></span>
<span class="line"><span>    atomic_set(&amp;vdev-&amp;gt;isr, 0);</span></span>
<span class="line"><span>    vdev-&amp;gt;queue_sel = 0;</span></span>
<span class="line"><span>    vdev-&amp;gt;config_vector = VIRTIO_NO_VECTOR;</span></span>
<span class="line"><span>    vdev-&amp;gt;vq = g_malloc0(sizeof(VirtQueue) * VIRTIO_QUEUE_MAX);</span></span>
<span class="line"><span>    vdev-&amp;gt;vm_running = runstate_is_running();</span></span>
<span class="line"><span>    vdev-&amp;gt;broken = false;</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; VIRTIO_QUEUE_MAX; i++) {</span></span>
<span class="line"><span>        vdev-&amp;gt;vq[i].vector = VIRTIO_NO_VECTOR;</span></span>
<span class="line"><span>        vdev-&amp;gt;vq[i].vdev = vdev;</span></span>
<span class="line"><span>        vdev-&amp;gt;vq[i].queue_index = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    vdev-&amp;gt;name = name;</span></span>
<span class="line"><span>    vdev-&amp;gt;config_len = config_size;</span></span>
<span class="line"><span>    if (vdev-&amp;gt;config_len) {</span></span>
<span class="line"><span>        vdev-&amp;gt;config = g_malloc0(config_size);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        vdev-&amp;gt;config = NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    vdev-&amp;gt;vmstate = qemu_add_vm_change_state_handler(virtio_vmstate_change,</span></span>
<span class="line"><span>                                                     vdev);</span></span>
<span class="line"><span>    vdev-&amp;gt;device_endian = virtio_default_endian();</span></span>
<span class="line"><span>    vdev-&amp;gt;use_guest_notifier_mask = true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从virtio_init中可以看出，VirtIODevice结构里面有一个VirtQueue数组，这就是virtio前端和后端互相传数据的队列，最多VIRTIO_QUEUE_MAX个。</p><p>我们回到virtio_blk_device_realize函数。接下来，根据配置的队列数目num_queues，对于每个队列都调用virtio_add_queue来初始化队列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VirtQueue *virtio_add_queue(VirtIODevice *vdev, int queue_size,</span></span>
<span class="line"><span>                            VirtIOHandleOutput handle_output)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    vdev-&amp;gt;vq[i].vring.num = queue_size;</span></span>
<span class="line"><span>    vdev-&amp;gt;vq[i].vring.num_default = queue_size;</span></span>
<span class="line"><span>    vdev-&amp;gt;vq[i].vring.align = VIRTIO_PCI_VRING_ALIGN;</span></span>
<span class="line"><span>    vdev-&amp;gt;vq[i].handle_output = handle_output;</span></span>
<span class="line"><span>    vdev-&amp;gt;vq[i].handle_aio_output = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &amp;vdev-&amp;gt;vq[i];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在每个VirtQueue中，都有一个vring，用来维护这个队列里面的数据；另外还有一个函数virtio_blk_handle_output，用于处理数据写入，这个函数我们后面会用到。</p><p>至此，VirtIODevice，VirtQueue，vring之间的关系如下图所示。这是在qemu里面的对应关系，请你记好，后面我们还能看到类似的结构。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/e18dae0a5951392c4a8e8630e53a616d.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/e18dae0a5951392c4a8e8630e53a616d.jpg" alt=""></a></p><h2 id="qemu启动过程中的存储虚拟化" tabindex="-1">qemu启动过程中的存储虚拟化 <a class="header-anchor" href="#qemu启动过程中的存储虚拟化" aria-label="Permalink to &quot;qemu启动过程中的存储虚拟化&quot;">​</a></h2><p>初始化过程解析完毕以后，我们接下来从qemu的启动过程看起。</p><p>对于硬盘的虚拟化，qemu的启动参数里面有关的是下面两行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-drive file=/var/lib/nova/instances/1f8e6f7e-5a70-4780-89c1-464dc0e7f308/disk,if=none,id=drive-virtio-disk0,format=qcow2,cache=none</span></span>
<span class="line"><span>-device virtio-blk-pci,scsi=off,bus=pci.0,addr=0x4,drive=drive-virtio-disk0,id=virtio-disk0,bootindex=1</span></span></code></pre></div><p>其中，第一行指定了宿主机硬盘上的一个文件，文件的格式是qcow2，这个格式我们这里不准备解析它，你只要明白，对于宿主机上的一个文件，可以被qemu模拟称为客户机上的一块硬盘就可以了。</p><p>而第二行说明了，使用的驱动是virtio-blk驱动。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>configure_blockdev(&amp;bdo_queue, machine_class, snapshot);</span></span></code></pre></div><p>在qemu启动的main函数里面，初始化块设备，是通过configure_blockdev调用开始的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void configure_blockdev(BlockdevOptionsQueue *bdo_queue, MachineClass *machine_class, int snapshot)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (qemu_opts_foreach(qemu_find_opts(&quot;drive&quot;), drive_init_func,</span></span>
<span class="line"><span>                          &amp;machine_class-&amp;gt;block_default_type, &amp;error_fatal)) {</span></span>
<span class="line"><span>.....</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int drive_init_func(void *opaque, QemuOpts *opts, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    BlockInterfaceType *block_default_type = opaque;</span></span>
<span class="line"><span>    return drive_new(opts, *block_default_type, errp) == NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在configure_blockdev中，我们能看到对于drive这个参数的解析，并且初始化这个设备要调用drive_init_func函数，这里面会调用drive_new创建一个设备。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DriveInfo *drive_new(QemuOpts *all_opts, BlockInterfaceType block_default_type, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    const char *value;</span></span>
<span class="line"><span>    BlockBackend *blk;</span></span>
<span class="line"><span>    DriveInfo *dinfo = NULL;</span></span>
<span class="line"><span>    QDict *bs_opts;</span></span>
<span class="line"><span>    QemuOpts *legacy_opts;</span></span>
<span class="line"><span>    DriveMediaType media = MEDIA_DISK;</span></span>
<span class="line"><span>    BlockInterfaceType type;</span></span>
<span class="line"><span>    int max_devs, bus_id, unit_id, index;</span></span>
<span class="line"><span>    const char *werror, *rerror;</span></span>
<span class="line"><span>    bool read_only = false;</span></span>
<span class="line"><span>    bool copy_on_read;</span></span>
<span class="line"><span>    const char *filename;</span></span>
<span class="line"><span>    Error *local_err = NULL;</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    legacy_opts = qemu_opts_create(&amp;qemu_legacy_drive_opts, NULL, 0,</span></span>
<span class="line"><span>                                   &amp;error_abort);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Add virtio block device */</span></span>
<span class="line"><span>    if (type == IF_VIRTIO) {</span></span>
<span class="line"><span>        QemuOpts *devopts;</span></span>
<span class="line"><span>        devopts = qemu_opts_create(qemu_find_opts(&quot;device&quot;), NULL, 0,</span></span>
<span class="line"><span>                                   &amp;error_abort);</span></span>
<span class="line"><span>        qemu_opt_set(devopts, &quot;driver&quot;, &quot;virtio-blk-pci&quot;, &amp;error_abort);</span></span>
<span class="line"><span>        qemu_opt_set(devopts, &quot;drive&quot;, qdict_get_str(bs_opts, &quot;id&quot;),</span></span>
<span class="line"><span>                     &amp;error_abort);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    filename = qemu_opt_get(legacy_opts, &quot;file&quot;);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Actual block device init: Functionality shared with blockdev-add */</span></span>
<span class="line"><span>    blk = blockdev_init(filename, bs_opts, &amp;local_err);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Create legacy DriveInfo */</span></span>
<span class="line"><span>    dinfo = g_malloc0(sizeof(*dinfo));</span></span>
<span class="line"><span>    dinfo-&amp;gt;opts = all_opts;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    dinfo-&amp;gt;type = type;</span></span>
<span class="line"><span>    dinfo-&amp;gt;bus = bus_id;</span></span>
<span class="line"><span>    dinfo-&amp;gt;unit = unit_id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    blk_set_legacy_dinfo(blk, dinfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    switch(type) {</span></span>
<span class="line"><span>    case IF_IDE:</span></span>
<span class="line"><span>    case IF_SCSI:</span></span>
<span class="line"><span>    case IF_XEN:</span></span>
<span class="line"><span>    case IF_NONE:</span></span>
<span class="line"><span>        dinfo-&amp;gt;media_cd = media == MEDIA_CDROM;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在drive_new里面，会解析qemu的启动参数。对于virtio来讲，会解析device参数，把driver设置为virtio-blk-pci；还会解析file参数，就是指向那个宿主机上的文件。</p><p>接下来，drive_new会调用blockdev_init，根据参数进行初始化，最后会创建一个DriveInfo来管理这个设备。</p><p>我们重点来看blockdev_init。在这里面，我们发现，如果file不为空，则应该调用blk_new_open打开宿主机上的硬盘文件，返回的结果是BlockBackend，对应我们上面讲原理的时候的virtio的后端。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BlockBackend *blk_new_open(const char *filename, const char *reference,</span></span>
<span class="line"><span>                           QDict *options, int flags, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    BlockBackend *blk;</span></span>
<span class="line"><span>    BlockDriverState *bs;</span></span>
<span class="line"><span>    uint64_t perm = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    blk = blk_new(perm, BLK_PERM_ALL);</span></span>
<span class="line"><span>    bs = bdrv_open(filename, reference, options, flags, errp);</span></span>
<span class="line"><span>    blk-&amp;gt;root = bdrv_root_attach_child(bs, &quot;root&quot;, &amp;child_root,</span></span>
<span class="line"><span>                                       perm, BLK_PERM_ALL, blk, errp);</span></span>
<span class="line"><span>    return blk;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来的调用链为：bdrv_open-&gt;bdrv_open_inherit-&gt;bdrv_open_common.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int bdrv_open_common(BlockDriverState *bs, BlockBackend *file,</span></span>
<span class="line"><span>                            QDict *options, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int ret, open_flags;</span></span>
<span class="line"><span>    const char *filename;</span></span>
<span class="line"><span>    const char *driver_name = NULL;</span></span>
<span class="line"><span>    const char *node_name = NULL;</span></span>
<span class="line"><span>    const char *discard;</span></span>
<span class="line"><span>    QemuOpts *opts;</span></span>
<span class="line"><span>    BlockDriver *drv;</span></span>
<span class="line"><span>    Error *local_err = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    drv = bdrv_find_format(driver_name);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ret = bdrv_open_driver(bs, drv, node_name, options, open_flags, errp);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int bdrv_open_driver(BlockDriverState *bs, BlockDriver *drv,</span></span>
<span class="line"><span>                            const char *node_name, QDict *options,</span></span>
<span class="line"><span>                            int open_flags, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    bs-&amp;gt;drv = drv;</span></span>
<span class="line"><span>    bs-&amp;gt;read_only = !(bs-&amp;gt;open_flags &amp; BDRV_O_RDWR);</span></span>
<span class="line"><span>    bs-&amp;gt;opaque = g_malloc0(drv-&amp;gt;instance_size);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (drv-&amp;gt;bdrv_open) {</span></span>
<span class="line"><span>        ret = drv-&amp;gt;bdrv_open(bs, options, open_flags, &amp;local_err);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在bdrv_open_common中，根据硬盘文件的格式，得到BlockDriver。因为虚拟机的硬盘文件格式有很多种，qcow2是一种，raw是一种，vmdk是一种，各有优缺点，启动虚拟机的时候，可以自由选择。</p><p>对于不同的格式，打开的方式不一样，我们拿qcow2来解析。它的BlockDriver定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BlockDriver bdrv_qcow2 = {</span></span>
<span class="line"><span>    .format_name        = &quot;qcow2&quot;,</span></span>
<span class="line"><span>    .instance_size      = sizeof(BDRVQcow2State),</span></span>
<span class="line"><span>    .bdrv_probe         = qcow2_probe,</span></span>
<span class="line"><span>    .bdrv_open          = qcow2_open,</span></span>
<span class="line"><span>    .bdrv_close         = qcow2_close,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    .bdrv_snapshot_create   = qcow2_snapshot_create,</span></span>
<span class="line"><span>    .bdrv_snapshot_goto     = qcow2_snapshot_goto,</span></span>
<span class="line"><span>    .bdrv_snapshot_delete   = qcow2_snapshot_delete,</span></span>
<span class="line"><span>    .bdrv_snapshot_list     = qcow2_snapshot_list,</span></span>
<span class="line"><span>    .bdrv_snapshot_load_tmp = qcow2_snapshot_load_tmp,</span></span>
<span class="line"><span>    .bdrv_measure           = qcow2_measure,</span></span>
<span class="line"><span>    .bdrv_get_info          = qcow2_get_info,</span></span>
<span class="line"><span>    .bdrv_get_specific_info = qcow2_get_specific_info,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    .bdrv_save_vmstate    = qcow2_save_vmstate,</span></span>
<span class="line"><span>    .bdrv_load_vmstate    = qcow2_load_vmstate,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    .supports_backing           = true,</span></span>
<span class="line"><span>    .bdrv_change_backing_file   = qcow2_change_backing_file,</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    .bdrv_refresh_limits        = qcow2_refresh_limits,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>根据上面的定义，对于qcow2来讲，bdrv_open调用的是qcow2_open。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int qcow2_open(BlockDriverState *bs, QDict *options, int flags,</span></span>
<span class="line"><span>                      Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    BDRVQcow2State *s = bs-&amp;gt;opaque;</span></span>
<span class="line"><span>    QCow2OpenCo qoc = {</span></span>
<span class="line"><span>        .bs = bs,</span></span>
<span class="line"><span>        .options = options,</span></span>
<span class="line"><span>        .flags = flags,</span></span>
<span class="line"><span>        .errp = errp,</span></span>
<span class="line"><span>        .ret = -EINPROGRESS</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bs-&amp;gt;file = bdrv_open_child(NULL, options, &quot;file&quot;, bs, &amp;child_file,</span></span>
<span class="line"><span>                               false, errp);</span></span>
<span class="line"><span>    qemu_coroutine_enter(qemu_coroutine_create(qcow2_open_entry, &amp;qoc));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在qcow2_open中，我们会通过qemu_coroutine_enter进入一个协程coroutine。什么叫协程呢？我们可以简单地将它理解为用户态自己实现的线程。</p><p>前面咱们讲线程的时候说过，如果一个程序想实现并发，可以创建多个线程，但是线程是一个内核的概念，创建的每一个线程内核都能看到，内核的调度也是以线程为单位的。这对于普通的进程没有什么问题，但是对于qemu这种虚拟机，如果在用户态和内核态切换来切换去，由于还涉及虚拟机的状态，代价比较大。</p><p>但是，qemu的设备也是需要多线程能力的，怎么办呢？我们就在用户态实现一个类似线程的东西，也就是协程，用于实现并发，并且不被内核看到，调度全部在用户态完成。</p><p>从后面的读写过程可以看出，协程在后端经常使用。这里打开一个qcow2文件就是使用一个协程，创建一个协程和创建一个线程很像，也需要指定一个函数来执行，qcow2_open_entry就是协程的函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void coroutine_fn qcow2_open_entry(void *opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QCow2OpenCo *qoc = opaque;</span></span>
<span class="line"><span>    BDRVQcow2State *s = qoc-&amp;gt;bs-&amp;gt;opaque;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    qemu_co_mutex_lock(&amp;s-&amp;gt;lock);</span></span>
<span class="line"><span>    qoc-&amp;gt;ret = qcow2_do_open(qoc-&amp;gt;bs, qoc-&amp;gt;options, qoc-&amp;gt;flags, qoc-&amp;gt;errp);</span></span>
<span class="line"><span>    qemu_co_mutex_unlock(&amp;s-&amp;gt;lock);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到，qcow2_open_entry函数前面有一个coroutine_fn，说明它是一个协程函数。在qcow2_do_open中，qcow2_do_open根据qcow2的格式打开硬盘文件。这个格式 <a href="https://github.com/qemu/qemu/blob/master/docs/interop/qcow2.txt" target="_blank" rel="noreferrer">官网</a> 就有，我们这里就不花篇幅解析了。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>我们这里来总结一下，存储虚拟化的过程分为前端、后端和中间的队列。</p><ul><li>前端有前端的块设备驱动Front-end driver，在客户机的内核里面，它符合普通设备驱动的格式，对外通过VFS暴露文件系统接口给客户机里面的应用。这一部分这一节我们没有讲，放在下一节解析。</li><li>后端有后端的设备驱动Back-end driver，在宿主机的qemu进程中，当收到客户机的写入请求的时候，调用文件系统的write函数，写入宿主机的VFS文件系统，最终写到物理硬盘设备上的qcow2文件。</li><li>中间的队列用于前端和后端之间传输数据，在前端的设备驱动和后端的设备驱动，都有类似的数据结构virt-queue来管理这些队列，这一部分这一节我们也没有讲，也放到下一节解析。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/1f0c3043a11d6ea1a802f7d0f3b0b34b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/1f0c3043a11d6ea1a802f7d0f3b0b34b.jpg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>对于qemu-kvm来讲，qcow2是一种常见的文件格式。它有精妙的格式设计，从而适应虚拟化的场景，请你研究一下这个文件格式。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110697/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,67)])])}const u=n(i,[["render",l]]);export{v as __pageData,u as default};
