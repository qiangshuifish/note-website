import{_ as s,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"55 | 网络虚拟化：如何成立独立的合作部？","description":"","frontmatter":{},"headers":[{"level":2,"title":"解析初始化过程","slug":"解析初始化过程","link":"#解析初始化过程","children":[]},{"level":2,"title":"qemu的启动过程中的网络虚拟化","slug":"qemu的启动过程中的网络虚拟化","link":"#qemu的启动过程中的网络虚拟化","children":[]},{"level":2,"title":"关联前端设备驱动和后端设备驱动","slug":"关联前端设备驱动和后端设备驱动","link":"#关联前端设备驱动和后端设备驱动","children":[]},{"level":2,"title":"发送网络包过程","slug":"发送网络包过程","link":"#发送网络包过程","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/55-网络虚拟化：如何成立独立的合作部？.md","filePath":"趣谈Linux操作系统/55-网络虚拟化：如何成立独立的合作部？.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/55-网络虚拟化：如何成立独立的合作部？.md"};function i(l,n,c,_,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_55-网络虚拟化-如何成立独立的合作部" tabindex="-1">55 | 网络虚拟化：如何成立独立的合作部？ <a class="header-anchor" href="#_55-网络虚拟化-如何成立独立的合作部" aria-label="Permalink to &quot;55 | 网络虚拟化：如何成立独立的合作部？&quot;">​</a></h1><p>上一节，我们讲了存储虚拟化，这一节我们来讲网络虚拟化。</p><p>网络虚拟化有和存储虚拟化类似的地方，例如，它们都是基于virtio的，因而我们在看网络虚拟化的过程中，会看到和存储虚拟化很像的数据结构和原理。但是，网络虚拟化也有自己的特殊性。例如，存储虚拟化是将宿主机上的文件作为客户机上的硬盘，而网络虚拟化需要依赖于内核协议栈进行网络包的封装与解封装。那怎么实现客户机和宿主机之间的互通呢？我们就一起来看一看。</p><h2 id="解析初始化过程" tabindex="-1">解析初始化过程 <a class="header-anchor" href="#解析初始化过程" aria-label="Permalink to &quot;解析初始化过程&quot;">​</a></h2><p>我们还是从Virtio Network Device这个设备的初始化讲起。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const TypeInfo device_type_info = {</span></span>
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
<span class="line"><span>static const TypeInfo virtio_net_info = {</span></span>
<span class="line"><span>    .name = TYPE_VIRTIO_NET,</span></span>
<span class="line"><span>    .parent = TYPE_VIRTIO_DEVICE,</span></span>
<span class="line"><span>    .instance_size = sizeof(VirtIONet),</span></span>
<span class="line"><span>    .instance_init = virtio_net_instance_init,</span></span>
<span class="line"><span>    .class_init = virtio_net_class_init,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void virtio_register_types(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    type_register_static(&amp;virtio_net_info);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>type_init(virtio_register_types)</span></span></code></pre></div><p>Virtio Network Device这种类的定义是有多层继承关系的，TYPE_VIRTIO_NET的父类是TYPE_VIRTIO_DEVICE，TYPE_VIRTIO_DEVICE的父类是TYPE_DEVICE，TYPE_DEVICE的父类是TYPE_OBJECT，继承关系到头了。</p><p>type_init用于注册这种类。这里面每一层都有class_init，用于从TypeImpl生成xxxClass，也有instance_init，会将xxxClass初始化为实例。</p><p>TYPE_VIRTIO_NET层的class_init函数virtio_net_class_init，定义了DeviceClass的realize函数为virtio_net_device_realize，这一点和存储块设备是一样的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void virtio_net_device_realize(DeviceState *dev, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIODevice *vdev = VIRTIO_DEVICE(dev);</span></span>
<span class="line"><span>    VirtIONet *n = VIRTIO_NET(dev);</span></span>
<span class="line"><span>    NetClientState *nc;</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    virtio_init(vdev, &quot;virtio-net&quot;, VIRTIO_ID_NET, n-&amp;gt;config_size);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * We set a lower limit on RX queue size to what it always was.</span></span>
<span class="line"><span>     * Guests that want a smaller ring can always resize it without</span></span>
<span class="line"><span>     * help from us (using virtio 1 and up).</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    if (n-&amp;gt;net_conf.rx_queue_size &amp;lt; VIRTIO_NET_RX_QUEUE_MIN_SIZE ||</span></span>
<span class="line"><span>        n-&amp;gt;net_conf.rx_queue_size &amp;gt; VIRTQUEUE_MAX_SIZE ||</span></span>
<span class="line"><span>        !is_power_of_2(n-&amp;gt;net_conf.rx_queue_size)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (n-&amp;gt;net_conf.tx_queue_size &amp;lt; VIRTIO_NET_TX_QUEUE_MIN_SIZE ||</span></span>
<span class="line"><span>        n-&amp;gt;net_conf.tx_queue_size &amp;gt; VIRTQUEUE_MAX_SIZE ||</span></span>
<span class="line"><span>        !is_power_of_2(n-&amp;gt;net_conf.tx_queue_size)) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    n-&amp;gt;max_queues = MAX(n-&amp;gt;nic_conf.peers.queues, 1);</span></span>
<span class="line"><span>    if (n-&amp;gt;max_queues * 2 + 1 &amp;gt; VIRTIO_QUEUE_MAX) {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    n-&amp;gt;vqs = g_malloc0(sizeof(VirtIONetQueue) * n-&amp;gt;max_queues);</span></span>
<span class="line"><span>    n-&amp;gt;curr_queues = 1;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    n-&amp;gt;net_conf.tx_queue_size = MIN(virtio_net_max_tx_queue_size(n),</span></span>
<span class="line"><span>                                    n-&amp;gt;net_conf.tx_queue_size);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; n-&amp;gt;max_queues; i++) {</span></span>
<span class="line"><span>        virtio_net_add_queue(n, i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    n-&amp;gt;ctrl_vq = virtio_add_queue(vdev, 64, virtio_net_handle_ctrl);</span></span>
<span class="line"><span>    qemu_macaddr_default_if_unset(&amp;n-&amp;gt;nic_conf.macaddr);</span></span>
<span class="line"><span>    memcpy(&amp;n-&amp;gt;mac[0], &amp;n-&amp;gt;nic_conf.macaddr, sizeof(n-&amp;gt;mac));</span></span>
<span class="line"><span>    n-&amp;gt;status = VIRTIO_NET_S_LINK_UP;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (n-&amp;gt;netclient_type) {</span></span>
<span class="line"><span>        n-&amp;gt;nic = qemu_new_nic(&amp;net_virtio_info, &amp;n-&amp;gt;nic_conf,</span></span>
<span class="line"><span>                              n-&amp;gt;netclient_type, n-&amp;gt;netclient_name, n);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        n-&amp;gt;nic = qemu_new_nic(&amp;net_virtio_info, &amp;n-&amp;gt;nic_conf,</span></span>
<span class="line"><span>                              object_get_typename(OBJECT(dev)), dev-&amp;gt;id, n);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面创建了一个VirtIODevice，这一点和存储虚拟化也是一样的。virtio_init用来初始化这个设备。VirtIODevice结构里面有一个VirtQueue数组，这就是virtio前端和后端互相传数据的队列，最多有VIRTIO_QUEUE_MAX个。</p><p>刚才我们说的都是一样的地方，其实也有不一样的地方，我们下面来看。</p><p>你会发现，这里面有这样的语句n-&gt;max_queues * 2 + 1 &gt; VIRTIO_QUEUE_MAX。为什么要乘以2呢？这是因为，对于网络设备来讲，应该分发送队列和接收队列两个方向，所以乘以2。</p><p>接下来，我们调用virtio_net_add_queue来初始化队列，可以看出来，这里面就有发送tx_vq和接收rx_vq两个队列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct VirtIONetQueue {</span></span>
<span class="line"><span>    VirtQueue *rx_vq;</span></span>
<span class="line"><span>    VirtQueue *tx_vq;</span></span>
<span class="line"><span>    QEMUTimer *tx_timer;</span></span>
<span class="line"><span>    QEMUBH *tx_bh;</span></span>
<span class="line"><span>    uint32_t tx_waiting;</span></span>
<span class="line"><span>    struct {</span></span>
<span class="line"><span>        VirtQueueElement *elem;</span></span>
<span class="line"><span>    } async_tx;</span></span>
<span class="line"><span>    struct VirtIONet *n;</span></span>
<span class="line"><span>} VirtIONetQueue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void virtio_net_add_queue(VirtIONet *n, int index)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIODevice *vdev = VIRTIO_DEVICE(n);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    n-&amp;gt;vqs[index].rx_vq = virtio_add_queue(vdev, n-&amp;gt;net_conf.rx_queue_size, virtio_net_handle_rx);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>......</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    n-&amp;gt;vqs[index].tx_vq = virtio_add_queue(vdev, n-&amp;gt;net_conf.tx_queue_size, virtio_net_handle_tx_bh);</span></span>
<span class="line"><span>    n-&amp;gt;vqs[index].tx_bh = qemu_bh_new(virtio_net_tx_bh, &amp;n-&amp;gt;vqs[index]);</span></span>
<span class="line"><span>    n-&amp;gt;vqs[index].n = n;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>每个VirtQueue中，都有一个vring用来维护这个队列里面的数据；另外还有函数virtio_net_handle_rx用于处理网络包的接收；函数virtio_net_handle_tx_bh用于网络包的发送，这个函数我们后面会用到。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>NICState *qemu_new_nic(NetClientInfo *info,</span></span>
<span class="line"><span>                       NICConf *conf,</span></span>
<span class="line"><span>                       const char *model,</span></span>
<span class="line"><span>                       const char *name,</span></span>
<span class="line"><span>                       void *opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    NetClientState **peers = conf-&amp;gt;peers.ncs;</span></span>
<span class="line"><span>    NICState *nic;</span></span>
<span class="line"><span>    int i, queues = MAX(1, conf-&amp;gt;peers.queues);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    nic = g_malloc0(info-&amp;gt;size + sizeof(NetClientState) * queues);</span></span>
<span class="line"><span>    nic-&amp;gt;ncs = (void *)nic + info-&amp;gt;size;</span></span>
<span class="line"><span>    nic-&amp;gt;conf = conf;</span></span>
<span class="line"><span>    nic-&amp;gt;opaque = opaque;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; queues; i++) {</span></span>
<span class="line"><span>        qemu_net_client_setup(&amp;nic-&amp;gt;ncs[i], info, peers[i], model, name, NULL);</span></span>
<span class="line"><span>        nic-&amp;gt;ncs[i].queue_index = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return nic;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void qemu_net_client_setup(NetClientState *nc,</span></span>
<span class="line"><span>                                  NetClientInfo *info,</span></span>
<span class="line"><span>                                  NetClientState *peer,</span></span>
<span class="line"><span>                                  const char *model,</span></span>
<span class="line"><span>                                  const char *name,</span></span>
<span class="line"><span>                                  NetClientDestructor *destructor)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    nc-&amp;gt;info = info;</span></span>
<span class="line"><span>    nc-&amp;gt;model = g_strdup(model);</span></span>
<span class="line"><span>    if (name) {</span></span>
<span class="line"><span>        nc-&amp;gt;name = g_strdup(name);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        nc-&amp;gt;name = assign_name(nc, model);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    QTAILQ_INSERT_TAIL(&amp;net_clients, nc, next);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    nc-&amp;gt;incoming_queue = qemu_new_net_queue(qemu_deliver_packet_iov, nc);</span></span>
<span class="line"><span>    nc-&amp;gt;destructor = destructor;</span></span>
<span class="line"><span>    QTAILQ_INIT(&amp;nc-&amp;gt;filters);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，qemu_new_nic会创建一个虚拟机里面的网卡。</p><h2 id="qemu的启动过程中的网络虚拟化" tabindex="-1">qemu的启动过程中的网络虚拟化 <a class="header-anchor" href="#qemu的启动过程中的网络虚拟化" aria-label="Permalink to &quot;qemu的启动过程中的网络虚拟化&quot;">​</a></h2><p>初始化过程解析完毕以后，我们接下来从qemu的启动过程看起。</p><p>对于网卡的虚拟化，qemu的启动参数里面有关的是下面两行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-netdev tap,fd=32,id=hostnet0,vhost=on,vhostfd=37</span></span>
<span class="line"><span>-device virtio-net-pci,netdev=hostnet0,id=net0,mac=fa:16:3e:d1:2d:99,bus=pci.0,addr=0x3</span></span></code></pre></div><p>qemu的main函数会调用net_init_clients进行网络设备的初始化，可以解析net参数，也可以在net_init_clients中解析netdev参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int net_init_clients(Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QTAILQ_INIT(&amp;net_clients);</span></span>
<span class="line"><span>    if (qemu_opts_foreach(qemu_find_opts(&quot;netdev&quot;),</span></span>
<span class="line"><span>                          net_init_netdev, NULL, errp)) {</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (qemu_opts_foreach(qemu_find_opts(&quot;nic&quot;), net_param_nic, NULL, errp)) {</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>    if (qemu_opts_foreach(qemu_find_opts(&quot;net&quot;), net_init_client, NULL, errp)) {</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>net_init_clients会解析参数。上面的参数netdev会调用net_init_netdev-&gt;net_client_init-&gt;net_client_init1。</p><p>net_client_init1会根据不同的driver类型，调用不同的初始化函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int (* const net_client_init_fun[NET_CLIENT_DRIVER__MAX])(</span></span>
<span class="line"><span>    const Netdev *netdev,</span></span>
<span class="line"><span>    const char *name,</span></span>
<span class="line"><span>    NetClientState *peer, Error **errp) = {</span></span>
<span class="line"><span>        [NET_CLIENT_DRIVER_NIC]       = net_init_nic,</span></span>
<span class="line"><span>        [NET_CLIENT_DRIVER_TAP]       = net_init_tap,</span></span>
<span class="line"><span>        [NET_CLIENT_DRIVER_SOCKET]    = net_init_socket,</span></span>
<span class="line"><span>        [NET_CLIENT_DRIVER_HUBPORT]   = net_init_hubport,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>由于我们配置的driver的类型是tap，因而这里会调用net_init_tap-&gt;net_tap_init-&gt;tap_open。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define PATH_NET_TUN &quot;/dev/net/tun&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int tap_open(char *ifname, int ifname_size, int *vnet_hdr,</span></span>
<span class="line"><span>             int vnet_hdr_required, int mq_required, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct ifreq ifr;</span></span>
<span class="line"><span>    int fd, ret;</span></span>
<span class="line"><span>    int len = sizeof(struct virtio_net_hdr);</span></span>
<span class="line"><span>    unsigned int features;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    TFR(fd = open(PATH_NET_TUN, O_RDWR));</span></span>
<span class="line"><span>    memset(&amp;ifr, 0, sizeof(ifr));</span></span>
<span class="line"><span>    ifr.ifr_flags = IFF_TAP | IFF_NO_PI;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (ioctl(fd, TUNGETFEATURES, &amp;features) == -1) {</span></span>
<span class="line"><span>        features = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (features &amp; IFF_ONE_QUEUE) {</span></span>
<span class="line"><span>        ifr.ifr_flags |= IFF_ONE_QUEUE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (*vnet_hdr) {</span></span>
<span class="line"><span>        if (features &amp; IFF_VNET_HDR) {</span></span>
<span class="line"><span>            *vnet_hdr = 1;</span></span>
<span class="line"><span>            ifr.ifr_flags |= IFF_VNET_HDR;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            *vnet_hdr = 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ioctl(fd, TUNSETVNETHDRSZ, &amp;len);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ret = ioctl(fd, TUNSETIFF, (void *) &amp;ifr);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    fcntl(fd, F_SETFL, O_NONBLOCK);</span></span>
<span class="line"><span>    return fd;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tap_open中，我们打开一个文件&quot;/dev/net/tun&quot;，然后通过ioctl操作这个文件。这是Linux内核的一项机制，和KVM机制很像。其实这就是一种通过打开这个字符设备文件，然后通过ioctl操作这个文件和内核打交道，来使用内核的能力。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/243e93913b18c3ab00be5676bef334d3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/243e93913b18c3ab00be5676bef334d3.png" alt=""></a></p><p>为什么需要使用内核的机制呢？因为网络包需要从虚拟机里面发送到虚拟机外面，发送到宿主机上的时候，必须是一个正常的网络包才能被转发。要形成一个网络包，我们那就需要经过复杂的协议栈，协议栈的复杂咱们在 <a href="https://time.geekbang.org/column/article/106490" target="_blank" rel="noreferrer">发送网络包</a> 那一节讲过了。</p><p>客户机会将网络包发送给qemu。qemu自己没有网络协议栈，现去实现一个也不可能，太复杂了。于是，它就要借助内核的力量。</p><p>qemu会将客户机发送给它的网络包，然后转换成为文件流，写入&quot;/dev/net/tun&quot;字符设备。就像写一个文件一样。内核中TUN/TAP字符设备驱动会收到这个写入的文件流，然后交给TUN/TAP的虚拟网卡驱动。这个驱动会将文件流再次转成网络包，交给TCP/IP栈，最终从虚拟TAP网卡tap0发出来，成为标准的网络包。后面我们会看到这个过程。</p><p>现在我们到内核里面，看一看打开&quot;/dev/net/tun&quot;字符设备后，内核会发生什么事情。内核的实现在drivers/net/tun.c文件中。这是一个字符设备驱动程序，应该符合字符设备的格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module_init(tun_init);</span></span>
<span class="line"><span>module_exit(tun_cleanup);</span></span>
<span class="line"><span>MODULE_DESCRIPTION(DRV_DESCRIPTION);</span></span>
<span class="line"><span>MODULE_AUTHOR(DRV_COPYRIGHT);</span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span>
<span class="line"><span>MODULE_ALIAS_MISCDEV(TUN_MINOR);</span></span>
<span class="line"><span>MODULE_ALIAS(&quot;devname:net/tun&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init tun_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = rtnl_link_register(&amp;tun_link_ops);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = misc_register(&amp;tun_miscdev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	ret = register_netdevice_notifier(&amp;tun_notifier_block);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面注册了一个tun_miscdev字符设备，从它的定义可以看出，这就是&quot;/dev/net/tun&quot;字符设备。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct miscdevice tun_miscdev = {</span></span>
<span class="line"><span>	.minor = TUN_MINOR,</span></span>
<span class="line"><span>	.name = &quot;tun&quot;,</span></span>
<span class="line"><span>	.nodename = &quot;net/tun&quot;,</span></span>
<span class="line"><span>	.fops = &amp;tun_fops,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct file_operations tun_fops = {</span></span>
<span class="line"><span>	.owner	= THIS_MODULE,</span></span>
<span class="line"><span>	.llseek = no_llseek,</span></span>
<span class="line"><span>	.read_iter  = tun_chr_read_iter,</span></span>
<span class="line"><span>	.write_iter = tun_chr_write_iter,</span></span>
<span class="line"><span>	.poll	= tun_chr_poll,</span></span>
<span class="line"><span>	.unlocked_ioctl	= tun_chr_ioctl,</span></span>
<span class="line"><span>	.open	= tun_chr_open,</span></span>
<span class="line"><span>	.release = tun_chr_close,</span></span>
<span class="line"><span>	.fasync = tun_chr_fasync,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>qemu的tap_open函数会打开这个字符设备PATH_NET_TUN。打开字符设备的过程我们不再重复。我就说一下，到了驱动这一层，调用的是tun_chr_open。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int tun_chr_open(struct inode *inode, struct file * file)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tun_file *tfile;</span></span>
<span class="line"><span>	tfile = (struct tun_file *)sk_alloc(net, AF_UNSPEC, GFP_KERNEL,</span></span>
<span class="line"><span>					    &amp;tun_proto, 0);</span></span>
<span class="line"><span>	RCU_INIT_POINTER(tfile-&amp;gt;tun, NULL);</span></span>
<span class="line"><span>	tfile-&amp;gt;flags = 0;</span></span>
<span class="line"><span>	tfile-&amp;gt;ifindex = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	init_waitqueue_head(&amp;tfile-&amp;gt;wq.wait);</span></span>
<span class="line"><span>	RCU_INIT_POINTER(tfile-&amp;gt;socket.wq, &amp;tfile-&amp;gt;wq);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tfile-&amp;gt;socket.file = file;</span></span>
<span class="line"><span>	tfile-&amp;gt;socket.ops = &amp;tun_socket_ops;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sock_init_data(&amp;tfile-&amp;gt;socket, &amp;tfile-&amp;gt;sk);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tfile-&amp;gt;sk.sk_write_space = tun_sock_write_space;</span></span>
<span class="line"><span>	tfile-&amp;gt;sk.sk_sndbuf = INT_MAX;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	file-&amp;gt;private_data = tfile;</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;tfile-&amp;gt;next);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	sock_set_flag(&amp;tfile-&amp;gt;sk, SOCK_ZEROCOPY);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在tun_chr_open的参数里面，有一个struct file，这是代表什么文件呢？它代表的就是打开的字符设备文件&quot;/dev/net/tun&quot;，因而往这个字符设备文件中写数据，就会通过这个struct file写入。这个struct file里面的file_operations，按照字符设备打开的规则，指向的就是tun_fops。</p><p>另外，我们还需要在tun_chr_open创建了一个结构struct tun_file，并且将struct file的private_data指向它。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* A tun_file connects an open character device to a tuntap netdevice. It</span></span>
<span class="line"><span> * also contains all socket related structures</span></span>
<span class="line"><span> * to serve as one transmit queue for tuntap device.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct tun_file {</span></span>
<span class="line"><span>	struct sock sk;</span></span>
<span class="line"><span>	struct socket socket;</span></span>
<span class="line"><span>	struct socket_wq wq;</span></span>
<span class="line"><span>	struct tun_struct __rcu *tun;</span></span>
<span class="line"><span>	struct fasync_struct *fasync;</span></span>
<span class="line"><span>	/* only used for fasnyc */</span></span>
<span class="line"><span>	unsigned int flags;</span></span>
<span class="line"><span>	union {</span></span>
<span class="line"><span>		u16 queue_index;</span></span>
<span class="line"><span>		unsigned int ifindex;</span></span>
<span class="line"><span>	};</span></span>
<span class="line"><span>	struct list_head next;</span></span>
<span class="line"><span>	struct tun_struct *detached;</span></span>
<span class="line"><span>	struct skb_array tx_array;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct tun_struct {</span></span>
<span class="line"><span>	struct tun_file __rcu	*tfiles[MAX_TAP_QUEUES];</span></span>
<span class="line"><span>	unsigned int            numqueues;</span></span>
<span class="line"><span>	unsigned int 		flags;</span></span>
<span class="line"><span>	kuid_t			owner;</span></span>
<span class="line"><span>	kgid_t			group;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct net_device	*dev;</span></span>
<span class="line"><span>	netdev_features_t	set_features;</span></span>
<span class="line"><span>	int			align;</span></span>
<span class="line"><span>	int			vnet_hdr_sz;</span></span>
<span class="line"><span>	int			sndbuf;</span></span>
<span class="line"><span>	struct tap_filter	txflt;</span></span>
<span class="line"><span>	struct sock_fprog	fprog;</span></span>
<span class="line"><span>	/* protected by rtnl lock */</span></span>
<span class="line"><span>	bool			filter_attached;</span></span>
<span class="line"><span>	spinlock_t lock;</span></span>
<span class="line"><span>	struct hlist_head flows[TUN_NUM_FLOW_ENTRIES];</span></span>
<span class="line"><span>	struct timer_list flow_gc_timer;</span></span>
<span class="line"><span>	unsigned long ageing_time;</span></span>
<span class="line"><span>	unsigned int numdisabled;</span></span>
<span class="line"><span>	struct list_head disabled;</span></span>
<span class="line"><span>	void *security;</span></span>
<span class="line"><span>	u32 flow_count;</span></span>
<span class="line"><span>	u32 rx_batched;</span></span>
<span class="line"><span>	struct tun_pcpu_stats __percpu *pcpu_stats;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const struct proto_ops tun_socket_ops = {</span></span>
<span class="line"><span>	.peek_len = tun_peek_len,</span></span>
<span class="line"><span>	.sendmsg = tun_sendmsg,</span></span>
<span class="line"><span>	.recvmsg = tun_recvmsg,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在struct tun_file中，有一个成员struct tun_struct，它里面有一个struct net_device，这个用来表示宿主机上的tuntap网络设备。在struct tun_file中，还有struct socket和struct sock，因为要用到内核的网络协议栈，所以就需要这两个结构，这在 <a href="https://time.geekbang.org/column/article/105338" target="_blank" rel="noreferrer">网络协议</a> 那一节已经分析过了。</p><p>所以，按照struct tun_file的注释说的，这是一个很重要的数据结构。&quot;/dev/net/tun&quot;对应的struct file的private_data指向它，因而可以接收qemu发过来的数据。除此之外，它还可以通过struct sock来操作内核协议栈，然后将网络包从宿主机上的tuntap网络设备发出去，宿主机上的tuntap网络设备对应的struct net_device也归它管。</p><p>在qemu的tap_open函数中，打开这个字符设备文件之后，接下来要做的事情是，通过ioctl来设置宿主机的网卡TUNSETIFF。</p><p>接下来，ioctl到了内核里面，会调用tun_chr_ioctl。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static long __tun_chr_ioctl(struct file *file, unsigned int cmd,</span></span>
<span class="line"><span>			    unsigned long arg, int ifreq_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tun_file *tfile = file-&amp;gt;private_data;</span></span>
<span class="line"><span>	struct tun_struct *tun;</span></span>
<span class="line"><span>	void __user* argp = (void __user*)arg;</span></span>
<span class="line"><span>	struct ifreq ifr;</span></span>
<span class="line"><span>	kuid_t owner;</span></span>
<span class="line"><span>	kgid_t group;</span></span>
<span class="line"><span>	int sndbuf;</span></span>
<span class="line"><span>	int vnet_hdr_sz;</span></span>
<span class="line"><span>	unsigned int ifindex;</span></span>
<span class="line"><span>	int le;</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (cmd == TUNSETIFF || cmd == TUNSETQUEUE || _IOC_TYPE(cmd) == SOCK_IOC_TYPE) {</span></span>
<span class="line"><span>		if (copy_from_user(&amp;ifr, argp, ifreq_len))</span></span>
<span class="line"><span>			return -EFAULT;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	tun = __tun_get(tfile);</span></span>
<span class="line"><span>	if (cmd == TUNSETIFF) {</span></span>
<span class="line"><span>		ifr.ifr_name[IFNAMSIZ-1] = &#39;\\0&#39;;</span></span>
<span class="line"><span>		ret = tun_set_iff(sock_net(&amp;tfile-&amp;gt;sk), file, &amp;ifr);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		if (copy_to_user(argp, &amp;ifr, ifreq_len))</span></span>
<span class="line"><span>			ret = -EFAULT;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在__tun_chr_ioctl中，我们首先通过copy_from_user把配置从用户态拷贝到内核态，调用tun_set_iff设置tuntap网络设备，然后调用copy_to_user将配置结果返回。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int tun_set_iff(struct net *net, struct file *file, struct ifreq *ifr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct tun_struct *tun;</span></span>
<span class="line"><span>	struct tun_file *tfile = file-&amp;gt;private_data;</span></span>
<span class="line"><span>	struct net_device *dev;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	char *name;</span></span>
<span class="line"><span>	unsigned long flags = 0;</span></span>
<span class="line"><span>	int queues = ifr-&amp;gt;ifr_flags &amp; IFF_MULTI_QUEUE ?</span></span>
<span class="line"><span>			     MAX_TAP_QUEUES : 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (ifr-&amp;gt;ifr_flags &amp; IFF_TUN) {</span></span>
<span class="line"><span>		/* TUN device */</span></span>
<span class="line"><span>		flags |= IFF_TUN;</span></span>
<span class="line"><span>		name = &quot;tun%d&quot;;</span></span>
<span class="line"><span>	} else if (ifr-&amp;gt;ifr_flags &amp; IFF_TAP) {</span></span>
<span class="line"><span>		/* TAP device */</span></span>
<span class="line"><span>		flags |= IFF_TAP;</span></span>
<span class="line"><span>		name = &quot;tap%d&quot;;</span></span>
<span class="line"><span>	} else</span></span>
<span class="line"><span>		return -EINVAL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (*ifr-&amp;gt;ifr_name)</span></span>
<span class="line"><span>		name = ifr-&amp;gt;ifr_name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	dev = alloc_netdev_mqs(sizeof(struct tun_struct), name,</span></span>
<span class="line"><span>				       NET_NAME_UNKNOWN, tun_setup, queues,</span></span>
<span class="line"><span>				       queues);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	err = dev_get_valid_name(net, dev, name);</span></span>
<span class="line"><span>	dev_net_set(dev, net);</span></span>
<span class="line"><span>	dev-&amp;gt;rtnl_link_ops = &amp;tun_link_ops;</span></span>
<span class="line"><span>	dev-&amp;gt;ifindex = tfile-&amp;gt;ifindex;</span></span>
<span class="line"><span>	dev-&amp;gt;sysfs_groups[0] = &amp;tun_attr_group;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tun = netdev_priv(dev);</span></span>
<span class="line"><span>	tun-&amp;gt;dev = dev;</span></span>
<span class="line"><span>	tun-&amp;gt;flags = flags;</span></span>
<span class="line"><span>	tun-&amp;gt;txflt.count = 0;</span></span>
<span class="line"><span>	tun-&amp;gt;vnet_hdr_sz = sizeof(struct virtio_net_hdr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tun-&amp;gt;align = NET_SKB_PAD;</span></span>
<span class="line"><span>	tun-&amp;gt;filter_attached = false;</span></span>
<span class="line"><span>	tun-&amp;gt;sndbuf = tfile-&amp;gt;socket.sk-&amp;gt;sk_sndbuf;</span></span>
<span class="line"><span>	tun-&amp;gt;rx_batched = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tun_net_init(dev);</span></span>
<span class="line"><span>	tun_flow_init(tun);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	err = tun_attach(tun, file, false);</span></span>
<span class="line"><span>	err = register_netdevice(tun-&amp;gt;dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	netif_carrier_on(tun-&amp;gt;dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (netif_running(tun-&amp;gt;dev))</span></span>
<span class="line"><span>		netif_tx_wake_all_queues(tun-&amp;gt;dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	strcpy(ifr-&amp;gt;ifr_name, tun-&amp;gt;dev-&amp;gt;name);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>tun_set_iff创建了struct tun_struct和struct net_device，并且将这个tuntap网络设备通过register_netdevice注册到内核中。这样，我们就能在宿主机上通过ip addr看到这个网卡了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/9826223c7375bec19bd13588f3875ffd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/9826223c7375bec19bd13588f3875ffd.png" alt=""></a></p><p>至此宿主机上的内核的数据结构也完成了。</p><h2 id="关联前端设备驱动和后端设备驱动" tabindex="-1">关联前端设备驱动和后端设备驱动 <a class="header-anchor" href="#关联前端设备驱动和后端设备驱动" aria-label="Permalink to &quot;关联前端设备驱动和后端设备驱动&quot;">​</a></h2><p>下面，我们来解析在客户机中发送一个网络包的时候，会发生哪些事情。</p><p>虚拟机里面的进程发送一个网络包，通过文件系统和Socket调用网络协议栈，到达网络设备层。只不过这个不是普通的网络设备，而是virtio_net的驱动。</p><p>virtio_net的驱动程序代码在Linux操作系统的源代码里面，文件名为drivers/net/virtio_net.c。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __init int virtio_net_driver_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ret = register_virtio_driver(&amp;virtio_net_driver);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>module_init(virtio_net_driver_init);</span></span>
<span class="line"><span>module_exit(virtio_net_driver_exit);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MODULE_DEVICE_TABLE(virtio, id_table);</span></span>
<span class="line"><span>MODULE_DESCRIPTION(&quot;Virtio network driver&quot;);</span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct virtio_driver virtio_net_driver = {</span></span>
<span class="line"><span>	.driver.name =	KBUILD_MODNAME,</span></span>
<span class="line"><span>	.driver.owner =	THIS_MODULE,</span></span>
<span class="line"><span>	.id_table =	id_table,</span></span>
<span class="line"><span>	.validate =	virtnet_validate,</span></span>
<span class="line"><span>	.probe =	virtnet_probe,</span></span>
<span class="line"><span>	.remove =	virtnet_remove,</span></span>
<span class="line"><span>	.config_changed = virtnet_config_changed,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在virtio_net的驱动程序的初始化代码中，我们需要注册一个驱动函数virtio_net_driver。</p><p>当一个设备驱动作为一个内核模块被初始化的时候，probe函数会被调用，因而我们来看一下virtnet_probe。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int virtnet_probe(struct virtio_device *vdev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int i, err;</span></span>
<span class="line"><span>	struct net_device *dev;</span></span>
<span class="line"><span>	struct virtnet_info *vi;</span></span>
<span class="line"><span>	u16 max_queue_pairs;</span></span>
<span class="line"><span>	int mtu;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Allocate ourselves a network device with room for our info */</span></span>
<span class="line"><span>	dev = alloc_etherdev_mq(sizeof(struct virtnet_info), max_queue_pairs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Set up network device as normal. */</span></span>
<span class="line"><span>	dev-&amp;gt;priv_flags |= IFF_UNICAST_FLT | IFF_LIVE_ADDR_CHANGE;</span></span>
<span class="line"><span>	dev-&amp;gt;netdev_ops = &amp;virtnet_netdev;</span></span>
<span class="line"><span>	dev-&amp;gt;features = NETIF_F_HIGHDMA;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	dev-&amp;gt;ethtool_ops = &amp;virtnet_ethtool_ops;</span></span>
<span class="line"><span>	SET_NETDEV_DEV(dev, &amp;vdev-&amp;gt;dev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* MTU range: 68 - 65535 */</span></span>
<span class="line"><span>	dev-&amp;gt;min_mtu = MIN_MTU;</span></span>
<span class="line"><span>	dev-&amp;gt;max_mtu = MAX_MTU;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Set up our device-specific information */</span></span>
<span class="line"><span>	vi = netdev_priv(dev);</span></span>
<span class="line"><span>	vi-&amp;gt;dev = dev;</span></span>
<span class="line"><span>	vi-&amp;gt;vdev = vdev;</span></span>
<span class="line"><span>	vdev-&amp;gt;priv = vi;</span></span>
<span class="line"><span>	vi-&amp;gt;stats = alloc_percpu(struct virtnet_stats);</span></span>
<span class="line"><span>	INIT_WORK(&amp;vi-&amp;gt;config_work, virtnet_config_changed_work);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vi-&amp;gt;max_queue_pairs = max_queue_pairs;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Allocate/initialize the rx/tx queues, and invoke find_vqs */</span></span>
<span class="line"><span>	err = init_vqs(vi);</span></span>
<span class="line"><span>	netif_set_real_num_tx_queues(dev, vi-&amp;gt;curr_queue_pairs);</span></span>
<span class="line"><span>	netif_set_real_num_rx_queues(dev, vi-&amp;gt;curr_queue_pairs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	virtnet_init_settings(dev);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	err = register_netdev(dev);</span></span>
<span class="line"><span>	virtio_device_ready(vdev);</span></span>
<span class="line"><span>	virtnet_set_queues(vi, vi-&amp;gt;curr_queue_pairs);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在virtnet_probe中，会创建struct net_device，并且通过register_netdev注册这个网络设备，这样在客户机里面，就能看到这个网卡了。</p><p>在virtnet_probe中，还有一件重要的事情就是，init_vqs会初始化发送和接收的virtqueue。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int init_vqs(struct virtnet_info *vi)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Allocate send &amp; receive queues */</span></span>
<span class="line"><span>	ret = virtnet_alloc_queues(vi);</span></span>
<span class="line"><span>	ret = virtnet_find_vqs(vi);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	get_online_cpus();</span></span>
<span class="line"><span>	virtnet_set_affinity(vi);</span></span>
<span class="line"><span>	put_online_cpus();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int virtnet_alloc_queues(struct virtnet_info *vi)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	vi-&amp;gt;sq = kzalloc(sizeof(*vi-&amp;gt;sq) * vi-&amp;gt;max_queue_pairs, GFP_KERNEL);</span></span>
<span class="line"><span>	vi-&amp;gt;rq = kzalloc(sizeof(*vi-&amp;gt;rq) * vi-&amp;gt;max_queue_pairs, GFP_KERNEL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	INIT_DELAYED_WORK(&amp;vi-&amp;gt;refill, refill_work);</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; vi-&amp;gt;max_queue_pairs; i++) {</span></span>
<span class="line"><span>		vi-&amp;gt;rq[i].pages = NULL;</span></span>
<span class="line"><span>		netif_napi_add(vi-&amp;gt;dev, &amp;vi-&amp;gt;rq[i].napi, virtnet_poll,</span></span>
<span class="line"><span>			       napi_weight);</span></span>
<span class="line"><span>		netif_tx_napi_add(vi-&amp;gt;dev, &amp;vi-&amp;gt;sq[i].napi, virtnet_poll_tx,</span></span>
<span class="line"><span>				  napi_tx ? napi_weight : 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		sg_init_table(vi-&amp;gt;rq[i].sg, ARRAY_SIZE(vi-&amp;gt;rq[i].sg));</span></span>
<span class="line"><span>		ewma_pkt_len_init(&amp;vi-&amp;gt;rq[i].mrg_avg_pkt_len);</span></span>
<span class="line"><span>		sg_init_table(vi-&amp;gt;sq[i].sg, ARRAY_SIZE(vi-&amp;gt;sq[i].sg));</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>按照上一节的virtio原理，virtqueue是一个介于客户机前端和qemu后端的一个结构，用于在这两端之间传递数据，对于网络设备来讲有发送和接收两个方向的队列。这里建立的struct virtqueue是客户机前端对于队列的管理的数据结构。</p><p>队列的实体需要通过函数virtnet_find_vqs查找或者生成，这里还会指定接收队列的callback函数为skb_recv_done，发送队列的callback函数为skb_xmit_done。那当buffer使用发生变化的时候，我们可以调用这个callback函数进行通知。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int virtnet_find_vqs(struct virtnet_info *vi)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	vq_callback_t **callbacks;</span></span>
<span class="line"><span>	struct virtqueue **vqs;</span></span>
<span class="line"><span>	int ret = -ENOMEM;</span></span>
<span class="line"><span>	int i, total_vqs;</span></span>
<span class="line"><span>	const char **names;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Allocate space for find_vqs parameters */</span></span>
<span class="line"><span>	vqs = kzalloc(total_vqs * sizeof(*vqs), GFP_KERNEL);</span></span>
<span class="line"><span>	callbacks = kmalloc(total_vqs * sizeof(*callbacks), GFP_KERNEL);</span></span>
<span class="line"><span>	names = kmalloc(total_vqs * sizeof(*names), GFP_KERNEL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Allocate/initialize parameters for send/receive virtqueues */</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; vi-&amp;gt;max_queue_pairs; i++) {</span></span>
<span class="line"><span>		callbacks[rxq2vq(i)] = skb_recv_done;</span></span>
<span class="line"><span>		callbacks[txq2vq(i)] = skb_xmit_done;</span></span>
<span class="line"><span>		names[rxq2vq(i)] = vi-&amp;gt;rq[i].name;</span></span>
<span class="line"><span>		names[txq2vq(i)] = vi-&amp;gt;sq[i].name;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ret = vi-&amp;gt;vdev-&amp;gt;config-&amp;gt;find_vqs(vi-&amp;gt;vdev, total_vqs, vqs, callbacks, names, ctx, NULL);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	for (i = 0; i &amp;lt; vi-&amp;gt;max_queue_pairs; i++) {</span></span>
<span class="line"><span>		vi-&amp;gt;rq[i].vq = vqs[rxq2vq(i)];</span></span>
<span class="line"><span>		vi-&amp;gt;rq[i].min_buf_len = mergeable_min_buf_len(vi, vi-&amp;gt;rq[i].vq);</span></span>
<span class="line"><span>		vi-&amp;gt;sq[i].vq = vqs[txq2vq(i)];</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的find_vqs是在struct virtnet_info里的struct virtio_device里的struct virtio_config_ops *config里面定义的。</p><p>根据virtio_config_ops的定义，find_vqs会调用vp_modern_find_vqs，到这一步和块设备是一样的了。</p><p>在vp_modern_find_vqs中，vp_find_vqs会调用vp_find_vqs_intx。在vp_find_vqs_intx中，通过request_irq注册一个中断处理函数vp_interrupt。当设备向队列中写入信息时，会产生一个中断，也就是vq中断。中断处理函数需要调用相应的队列的回调函数，然后根据队列的数目，依次调用vp_setup_vq完成virtqueue、vring的分配和初始化。</p><p>同样，这些数据结构会和virtio后端的VirtIODevice、VirtQueue、vring对应起来，都应该指向刚才创建的那一段内存。</p><p>客户机同样会通过调用专门给外部设备发送指令的函数iowrite告诉外部的pci设备，这些共享内存的地址。</p><p>至此前端设备驱动和后端设备驱动之间的两个收发队列就关联好了，这两个队列的格式和块设备是一样的。</p><h2 id="发送网络包过程" tabindex="-1">发送网络包过程 <a class="header-anchor" href="#发送网络包过程" aria-label="Permalink to &quot;发送网络包过程&quot;">​</a></h2><p>接下来，我们来看当真的发送一个网络包的时候，会发生什么。</p><p>当网络包经过客户机的协议栈到达virtio_net驱动的时候，按照net_device_ops的定义，start_xmit会被调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const struct net_device_ops virtnet_netdev = {</span></span>
<span class="line"><span>	.ndo_open            = virtnet_open,</span></span>
<span class="line"><span>	.ndo_stop   	     = virtnet_close,</span></span>
<span class="line"><span>	.ndo_start_xmit      = start_xmit,</span></span>
<span class="line"><span>	.ndo_validate_addr   = eth_validate_addr,</span></span>
<span class="line"><span>	.ndo_set_mac_address = virtnet_set_mac_address,</span></span>
<span class="line"><span>	.ndo_set_rx_mode     = virtnet_set_rx_mode,</span></span>
<span class="line"><span>	.ndo_get_stats64     = virtnet_stats,</span></span>
<span class="line"><span>	.ndo_vlan_rx_add_vid = virtnet_vlan_rx_add_vid,</span></span>
<span class="line"><span>	.ndo_vlan_rx_kill_vid = virtnet_vlan_rx_kill_vid,</span></span>
<span class="line"><span>	.ndo_xdp		= virtnet_xdp,</span></span>
<span class="line"><span>	.ndo_features_check	= passthru_features_check,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>接下来的调用链为：start_xmit-&gt;xmit_skb-&gt; virtqueue_add_outbuf-&gt;virtqueue_add，将网络包放入队列中，并调用virtqueue_notify通知接收方。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static netdev_tx_t start_xmit(struct sk_buff *skb, struct net_device *dev)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct virtnet_info *vi = netdev_priv(dev);</span></span>
<span class="line"><span>	int qnum = skb_get_queue_mapping(skb);</span></span>
<span class="line"><span>	struct send_queue *sq = &amp;vi-&amp;gt;sq[qnum];</span></span>
<span class="line"><span>	int err;</span></span>
<span class="line"><span>	struct netdev_queue *txq = netdev_get_tx_queue(dev, qnum);</span></span>
<span class="line"><span>	bool kick = !skb-&amp;gt;xmit_more;</span></span>
<span class="line"><span>	bool use_napi = sq-&amp;gt;napi.weight;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Try to transmit */</span></span>
<span class="line"><span>	err = xmit_skb(sq, skb);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (kick || netif_xmit_stopped(txq))</span></span>
<span class="line"><span>		virtqueue_kick(sq-&amp;gt;vq);</span></span>
<span class="line"><span>	return NETDEV_TX_OK;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool virtqueue_kick(struct virtqueue *vq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (virtqueue_kick_prepare(vq))</span></span>
<span class="line"><span>		return virtqueue_notify(vq);</span></span>
<span class="line"><span>	return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>写入一个I/O会使得qemu触发VM exit，这个逻辑我们在解析CPU的时候看到过。</p><p>接下来，我们那会调用VirtQueue的handle_output函数。前面我们已经设置过这个函数了，其实就是virtio_net_handle_tx_bh。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void virtio_net_handle_tx_bh(VirtIODevice *vdev, VirtQueue *vq)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIONet *n = VIRTIO_NET(vdev);</span></span>
<span class="line"><span>    VirtIONetQueue *q = &amp;n-&amp;gt;vqs[vq2q(virtio_get_queue_index(vq))];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    q-&amp;gt;tx_waiting = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    virtio_queue_set_notification(vq, 0);</span></span>
<span class="line"><span>    qemu_bh_schedule(q-&amp;gt;tx_bh);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>virtio_net_handle_tx_bh调用了qemu_bh_schedule，而在virtio_net_add_queue中调用qemu_bh_new，并把函数设置为virtio_net_tx_bh。</p><p>virtio_net_tx_bh函数调用发送函数virtio_net_flush_tx。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int32_t virtio_net_flush_tx(VirtIONetQueue *q)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    VirtIONet *n = q-&amp;gt;n;</span></span>
<span class="line"><span>    VirtIODevice *vdev = VIRTIO_DEVICE(n);</span></span>
<span class="line"><span>    VirtQueueElement *elem;</span></span>
<span class="line"><span>    int32_t num_packets = 0;</span></span>
<span class="line"><span>    int queue_index = vq2q(virtio_get_queue_index(q-&amp;gt;tx_vq));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        ssize_t ret;</span></span>
<span class="line"><span>        unsigned int out_num;</span></span>
<span class="line"><span>        struct iovec sg[VIRTQUEUE_MAX_SIZE], sg2[VIRTQUEUE_MAX_SIZE + 1], *out_sg;</span></span>
<span class="line"><span>        struct virtio_net_hdr_mrg_rxbuf mhdr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        elem = virtqueue_pop(q-&amp;gt;tx_vq, sizeof(VirtQueueElement));</span></span>
<span class="line"><span>        out_num = elem-&amp;gt;out_num;</span></span>
<span class="line"><span>        out_sg = elem-&amp;gt;out_sg;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        ret = qemu_sendv_packet_async(qemu_get_subqueue(n-&amp;gt;nic, queue_index),out_sg, out_num, virtio_net_tx_complete);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return num_packets;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>virtio_net_flush_tx会调用virtqueue_pop。这里面，我们能看到对于vring的操作，也即从这里面将客户机里面写入的数据读取出来。</p><p>然后，我们调用qemu_sendv_packet_async发送网络包。接下来的调用链为：qemu_sendv_packet_async-&gt;qemu_net_queue_send_iov-&gt;qemu_net_queue_flush-&gt;qemu_net_queue_deliver。</p><p>在qemu_net_queue_deliver中，我们会调用NetQueue的deliver函数。前面qemu_new_net_queue会把deliver函数设置为qemu_deliver_packet_iov。它会调用nc-&gt;info-&gt;receive_iov。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static NetClientInfo net_tap_info = {</span></span>
<span class="line"><span>    .type = NET_CLIENT_DRIVER_TAP,</span></span>
<span class="line"><span>    .size = sizeof(TAPState),</span></span>
<span class="line"><span>    .receive = tap_receive,</span></span>
<span class="line"><span>    .receive_raw = tap_receive_raw,</span></span>
<span class="line"><span>    .receive_iov = tap_receive_iov,</span></span>
<span class="line"><span>    .poll = tap_poll,</span></span>
<span class="line"><span>    .cleanup = tap_cleanup,</span></span>
<span class="line"><span>    .has_ufo = tap_has_ufo,</span></span>
<span class="line"><span>    .has_vnet_hdr = tap_has_vnet_hdr,</span></span>
<span class="line"><span>    .has_vnet_hdr_len = tap_has_vnet_hdr_len,</span></span>
<span class="line"><span>    .using_vnet_hdr = tap_using_vnet_hdr,</span></span>
<span class="line"><span>    .set_offload = tap_set_offload,</span></span>
<span class="line"><span>    .set_vnet_hdr_len = tap_set_vnet_hdr_len,</span></span>
<span class="line"><span>    .set_vnet_le = tap_set_vnet_le,</span></span>
<span class="line"><span>    .set_vnet_be = tap_set_vnet_be,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>根据net_tap_info的定义调用的是tap_receive_iov。他会调用tap_write_packet-&gt;writev写入这个字符设备。</p><p>在内核的字符设备驱动中，tun_chr_write_iter会被调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ssize_t tun_chr_write_iter(struct kiocb *iocb, struct iov_iter *from)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct file *file = iocb-&amp;gt;ki_filp;</span></span>
<span class="line"><span>	struct tun_struct *tun = tun_get(file);</span></span>
<span class="line"><span>	struct tun_file *tfile = file-&amp;gt;private_data;</span></span>
<span class="line"><span>	ssize_t result;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	result = tun_get_user(tun, tfile, NULL, from,</span></span>
<span class="line"><span>			      file-&amp;gt;f_flags &amp; O_NONBLOCK, false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tun_put(tun);</span></span>
<span class="line"><span>	return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当我们使用writev()系统调用向tun/tap设备的字符设备文件写入数据时，tun_chr_write函数将被调用。它会使用tun_get_user，从用户区接收数据，将数据存入skb中，然后调用关键的函数netif_rx_ni(skb) ，将skb送给tcp/ip协议栈处理，最终完成虚拟网卡的数据接收。</p><p>至此，从虚拟机内部到宿主机的网络传输过程才算结束。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>最后，我们把网络虚拟化场景下网络包的发送过程总结一下。</p><ul><li>在虚拟机里面的用户态，应用程序通过write系统调用写入socket。</li><li>写入的内容经过VFS层，内核协议栈，到达虚拟机里面的内核的网络设备驱动，也即virtio_net。</li><li>virtio_net网络设备有一个操作结构struct net_device_ops，里面定义了发送一个网络包调用的函数为start_xmit。</li><li>在virtio_net的前端驱动和qemu中的后端驱动之间，有两个队列virtqueue，一个用于发送，一个用于接收。然后，我们需要在start_xmit中调用virtqueue_add，将网络包放入发送队列，然后调用virtqueue_notify通知qemu。</li><li>qemu本来处于KVM_RUN的状态，收到通知后，通过VM exit指令退出客户机模式，进入宿主机模式。发送网络包的时候，virtio_net_handle_tx_bh函数会被调用。</li><li>接下来是一个for循环，我们需要在循环中调用virtqueue_pop，从传输队列中获取要发送的数据，然后调用qemu_sendv_packet_async进行发送。</li><li>qemu会调用writev向字符设备文件写入，进入宿主机的内核。</li><li>在宿主机内核中字符设备文件的file_operations里面的write_iter会被调用，也即会调用tun_chr_write_iter。</li><li>在tun_chr_write_iter函数中，tun_get_user将要发送的网络包从qemu拷贝到宿主机内核里面来，然后调用netif_rx_ni开始调用宿主机内核协议栈进行处理。</li><li>宿主机内核协议栈处理完毕之后，会发送给tap虚拟网卡，完成从虚拟机里面到宿主机的整个发送过程。</li></ul><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/e329505cfcd367612f8ae47054ec8e44.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/e329505cfcd367612f8ae47054ec8e44.jpg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这一节我们解析的是发送过程，请你根据类似的思路，解析一下接收过程。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/111686/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,102)])])}const v=s(t,[["render",i]]);export{d as __pageData,v as default};
