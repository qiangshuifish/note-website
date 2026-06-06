import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"52 | 计算虚拟化之内存：如何建立独立的办公室？","description":"","frontmatter":{},"headers":[{"level":2,"title":"内存管理","slug":"内存管理","link":"#内存管理","children":[]},{"level":2,"title":"页面分配和映射","slug":"页面分配和映射","link":"#页面分配和映射","children":[{"level":3,"title":"影子页表","slug":"影子页表","link":"#影子页表","children":[]},{"level":3,"title":"扩展页表","slug":"扩展页表","link":"#扩展页表","children":[]}]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/52-计算虚拟化之内存：如何建立独立的办公室？.md","filePath":"趣谈Linux操作系统/52-计算虚拟化之内存：如何建立独立的办公室？.md","lastUpdated":1779822193000}'),l={name:"趣谈Linux操作系统/52-计算虚拟化之内存：如何建立独立的办公室？.md"};function t(i,s,c,o,_,m){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_52-计算虚拟化之内存-如何建立独立的办公室" tabindex="-1">52 | 计算虚拟化之内存：如何建立独立的办公室？ <a class="header-anchor" href="#_52-计算虚拟化之内存-如何建立独立的办公室" aria-label="Permalink to &quot;52 | 计算虚拟化之内存：如何建立独立的办公室？&quot;">​</a></h1><p>上一节，我们解析了计算虚拟化之CPU。可以看到，CPU的虚拟化是用户态的qemu和内核态的KVM共同配合完成的。它们二者通过ioctl进行通信。对于内存管理来讲，也是需要这两者配合完成的。</p><p>咱们在内存管理的时候讲过，操作系统给每个进程分配的内存都是虚拟内存，需要通过页表映射，变成物理内存进行访问。当有了虚拟机之后，情况会变得更加复杂。因为虚拟机对于物理机来讲是一个进程，但是虚拟机里面也有内核，也有虚拟机里面跑的进程。所以有了虚拟机，内存就变成了四类：</p><ul><li><strong>虚拟机里面的虚拟内存</strong>（Guest OS Virtual Memory，GVA），这是虚拟机里面的进程看到的内存空间；</li><li><strong>虚拟机里面的物理内存</strong>（Guest OS Physical Memory，GPA），这是虚拟机里面的操作系统看到的内存，它认为这是物理内存；</li><li><strong>物理机的虚拟内存</strong>（Host Virtual Memory，HVA），这是物理机上的qemu进程看到的内存空间；</li><li><strong>物理机的物理内存</strong>（Host Physical Memory，HPA），这是物理机上的操作系统看到的内存。</li></ul><p>咱们内存管理那一章讲的两大内容，一个是内存管理，它变得非常复杂；另一个是内存映射，具体来说就是，从GVA到GPA，到HVA，再到HPA，这样几经转手，计算机的性能就会变得很差。当然，虚拟化技术成熟的今天，有了一些优化的手段，具体怎么优化呢？我们这一节就来一一解析。</p><h2 id="内存管理" tabindex="-1">内存管理 <a class="header-anchor" href="#内存管理" aria-label="Permalink to &quot;内存管理&quot;">​</a></h2><p>我们先来看内存管理的部分。</p><p>由于CPU和内存是紧密结合的，因而内存虚拟化的初始化过程，和CPU虚拟化的初始化是一起完成的。</p><p>上一节说CPU虚拟化初始化的时候，我们会调用kvm_init函数，这里面打开了&quot;/dev/kvm&quot;这个字符文件，并且通过ioctl调用到内核kvm的KVM_CREATE_VM操作，除了这些CPU相关的调用，接下来还有内存相关的。我们来看看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int kvm_init(MachineState *ms)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MachineClass *mc = MACHINE_GET_CLASS(ms);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    kvm_memory_listener_register(s, &amp;s-&amp;gt;memory_listener,</span></span>
<span class="line"><span>                                 &amp;address_space_memory, 0);</span></span>
<span class="line"><span>    memory_listener_register(&amp;kvm_io_listener,</span></span>
<span class="line"><span>                             &amp;address_space_io);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AddressSpace address_space_io;</span></span>
<span class="line"><span>AddressSpace address_space_memory;</span></span></code></pre></div><p>这里面有两个地址空间AddressSpace，一个是系统内存的地址空间address_space_memory，一个用于I/O的地址空间address_space_io。这里我们重点看address_space_memory。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct AddressSpace {</span></span>
<span class="line"><span>    /* All fields are private. */</span></span>
<span class="line"><span>    struct rcu_head rcu;</span></span>
<span class="line"><span>    char *name;</span></span>
<span class="line"><span>    MemoryRegion *root;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Accessed via RCU.  */</span></span>
<span class="line"><span>    struct FlatView *current_map;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int ioeventfd_nb;</span></span>
<span class="line"><span>    struct MemoryRegionIoeventfd *ioeventfds;</span></span>
<span class="line"><span>    QTAILQ_HEAD(, MemoryListener) listeners;</span></span>
<span class="line"><span>    QTAILQ_ENTRY(AddressSpace) address_spaces_link;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>对于一个地址空间，会有多个内存区域MemoryRegion组成树形结构。这里面，root是这棵树的根。另外，还有一个MemoryListener链表，当内存区域发生变化的时候，需要做一些动作，使得用户态和内核态能够协同，就是由这些MemoryListener完成的。</p><p>在kvm_init这个时候，还没有内存区域加入进来，root还是空的，但是我们可以先注册MemoryListener，这里注册的是KVMMemoryListener。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void kvm_memory_listener_register(KVMState *s, KVMMemoryListener *kml,</span></span>
<span class="line"><span>                                  AddressSpace *as, int as_id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    kml-&amp;gt;slots = g_malloc0(s-&amp;gt;nr_slots * sizeof(KVMSlot));</span></span>
<span class="line"><span>    kml-&amp;gt;as_id = as_id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; s-&amp;gt;nr_slots; i++) {</span></span>
<span class="line"><span>        kml-&amp;gt;slots[i].slot = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    kml-&amp;gt;listener.region_add = kvm_region_add;</span></span>
<span class="line"><span>    kml-&amp;gt;listener.region_del = kvm_region_del;</span></span>
<span class="line"><span>    kml-&amp;gt;listener.priority = 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    memory_listener_register(&amp;kml-&amp;gt;listener, as);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个KVMMemoryListener中是这样配置的：当添加一个MemoryRegion的时候，region_add会被调用，这个我们后面会用到。</p><p>接下来，在qemu启动的main函数中，我们会调用cpu_exec_init_all-&gt;memory_map_init.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void memory_map_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    system_memory = g_malloc(sizeof(*system_memory));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    memory_region_init(system_memory, NULL, &quot;system&quot;, UINT64_MAX);</span></span>
<span class="line"><span>    address_space_init(&amp;address_space_memory, system_memory, &quot;memory&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    system_io = g_malloc(sizeof(*system_io));</span></span>
<span class="line"><span>    memory_region_init_io(system_io, NULL, &amp;unassigned_io_ops, NULL, &quot;io&quot;,</span></span>
<span class="line"><span>                          65536);</span></span>
<span class="line"><span>    address_space_init(&amp;address_space_io, system_io, &quot;I/O&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里，对于系统内存区域system_memory和用于I/O的内存区域system_io，我们都进行了初始化，并且关联到了相应的地址空间AddressSpace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void address_space_init(AddressSpace *as, MemoryRegion *root, const char *name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    memory_region_ref(root);</span></span>
<span class="line"><span>    as-&amp;gt;root = root;</span></span>
<span class="line"><span>    as-&amp;gt;current_map = NULL;</span></span>
<span class="line"><span>    as-&amp;gt;ioeventfd_nb = 0;</span></span>
<span class="line"><span>    as-&amp;gt;ioeventfds = NULL;</span></span>
<span class="line"><span>    QTAILQ_INIT(&amp;as-&amp;gt;listeners);</span></span>
<span class="line"><span>    QTAILQ_INSERT_TAIL(&amp;address_spaces, as, address_spaces_link);</span></span>
<span class="line"><span>    as-&amp;gt;name = g_strdup(name ? name : &quot;anonymous&quot;);</span></span>
<span class="line"><span>    address_space_update_topology(as);</span></span>
<span class="line"><span>    address_space_update_ioeventfds(as);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于系统内存地址空间address_space_memory，我们需要把它里面内存区域的根root设置为system_memory。</p><p>另外，在这里，我们还调用了address_space_update_topology。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void address_space_update_topology(AddressSpace *as)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MemoryRegion *physmr = memory_region_get_flatview_root(as-&amp;gt;root);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    flatviews_init();</span></span>
<span class="line"><span>    if (!g_hash_table_lookup(flat_views, physmr)) {</span></span>
<span class="line"><span>        generate_memory_topology(physmr);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    address_space_set_flatview(as);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void address_space_set_flatview(AddressSpace *as)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    FlatView *old_view = address_space_to_flatview(as);</span></span>
<span class="line"><span>    MemoryRegion *physmr = memory_region_get_flatview_root(as-&amp;gt;root);</span></span>
<span class="line"><span>    FlatView *new_view = g_hash_table_lookup(flat_views, physmr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (old_view == new_view) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (!QTAILQ_EMPTY(&amp;as-&amp;gt;listeners)) {</span></span>
<span class="line"><span>        FlatView tmpview = { .nr = 0 }, *old_view2 = old_view;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!old_view2) {</span></span>
<span class="line"><span>            old_view2 = &amp;tmpview;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        address_space_update_topology_pass(as, old_view2, new_view, false);</span></span>
<span class="line"><span>        address_space_update_topology_pass(as, old_view2, new_view, true);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Writes are protected by the BQL.  */</span></span>
<span class="line"><span>    atomic_rcu_set(&amp;as-&amp;gt;current_map, new_view);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面会生成AddressSpace的flatview。flatview是什么意思呢？</p><p>我们可以看到，在AddressSpace里面，除了树形结构的MemoryRegion之外，还有一个flatview结构，其实这个结构就是把这样一个树形的内存结构变成平的内存结构。因为树形内存结构比较容易管理，但是平的内存结构，比较方便和内核里面通信，来请求物理内存。虽然操作系统内核里面也是用树形结构来表示内存区域的，但是用户态向内核申请内存的时候，会按照平的、连续的模式进行申请。这里，qemu在用户态，所以要做这样一个转换。</p><p>在address_space_set_flatview中，我们将老的flatview和新的flatview进行比较。如果不同，说明内存结构发生了变化，会调用address_space_update_topology_pass-&gt;MEMORY_LISTENER_UPDATE_REGION-&gt;MEMORY_LISTENER_CALL。</p><p>这里面调用所有的listener。但是，这个逻辑这里不会执行的。这是因为这里内存处于初始化的阶段，全局的flat_views里面肯定找不到。因而generate_memory_topology第一次生成了FlatView，然后才调用了address_space_set_flatview。这里面，老的flatview和新的flatview一定是一样的。</p><p>但是，请你记住这个逻辑，到这里我们还没解析qemu有关内存的参数，所以这里添加的MemoryRegion虽然是一个根，但是是空的，是为了管理使用的，后面真的添加内存的时候，这个逻辑还会调用到。</p><p>我们再回到qemu启动的main函数中。接下来的初始化过程会调用pc_init1。在这里面，对于CPU虚拟化，我们会调用pc_cpus_init。这个我们在上一节已经讲过了。另外，pc_init1还会调用pc_memory_init，进行内存的虚拟化，我们这里解析这一部分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void pc_memory_init(PCMachineState *pcms,</span></span>
<span class="line"><span>                    MemoryRegion *system_memory,</span></span>
<span class="line"><span>                    MemoryRegion *rom_memory,</span></span>
<span class="line"><span>                    MemoryRegion **ram_memory)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int linux_boot, i;</span></span>
<span class="line"><span>    MemoryRegion *ram, *option_rom_mr;</span></span>
<span class="line"><span>    MemoryRegion *ram_below_4g, *ram_above_4g;</span></span>
<span class="line"><span>    FWCfgState *fw_cfg;</span></span>
<span class="line"><span>    MachineState *machine = MACHINE(pcms);</span></span>
<span class="line"><span>    PCMachineClass *pcmc = PC_MACHINE_GET_CLASS(pcms);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Allocate RAM.  We allocate it as a single memory region and use</span></span>
<span class="line"><span>     * aliases to address portions of it, mostly for backwards compatibility with older qemus that used qemu_ram_alloc().</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    ram = g_malloc(sizeof(*ram));</span></span>
<span class="line"><span>    memory_region_allocate_system_memory(ram, NULL, &quot;pc.ram&quot;,</span></span>
<span class="line"><span>                                         machine-&amp;gt;ram_size);</span></span>
<span class="line"><span>    *ram_memory = ram;</span></span>
<span class="line"><span>    ram_below_4g = g_malloc(sizeof(*ram_below_4g));</span></span>
<span class="line"><span>    memory_region_init_alias(ram_below_4g, NULL, &quot;ram-below-4g&quot;, ram,</span></span>
<span class="line"><span>                             0, pcms-&amp;gt;below_4g_mem_size);</span></span>
<span class="line"><span>    memory_region_add_subregion(system_memory, 0, ram_below_4g);</span></span>
<span class="line"><span>    e820_add_entry(0, pcms-&amp;gt;below_4g_mem_size, E820_RAM);</span></span>
<span class="line"><span>    if (pcms-&amp;gt;above_4g_mem_size &amp;gt; 0) {</span></span>
<span class="line"><span>        ram_above_4g = g_malloc(sizeof(*ram_above_4g));</span></span>
<span class="line"><span>        memory_region_init_alias(ram_above_4g, NULL, &quot;ram-above-4g&quot;, ram, pcms-&amp;gt;below_4g_mem_size, pcms-&amp;gt;above_4g_mem_size);</span></span>
<span class="line"><span>        memory_region_add_subregion(system_memory, 0x100000000ULL,</span></span>
<span class="line"><span>                                    ram_above_4g);</span></span>
<span class="line"><span>        e820_add_entry(0x100000000ULL, pcms-&amp;gt;above_4g_mem_size, E820_RAM);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在pc_memory_init中，我们已经知道了虚拟机要申请的内存ram_size，于是通过memory_region_allocate_system_memory来申请内存。</p><p>接下来的调用链为：memory_region_allocate_system_memory-&gt;allocate_system_memory_nonnuma-&gt;memory_region_init_ram_nomigrate-&gt;memory_region_init_ram_shared_nomigrate。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void memory_region_init_ram_shared_nomigrate(MemoryRegion *mr,</span></span>
<span class="line"><span>                                             Object *owner,</span></span>
<span class="line"><span>                                             const char *name,</span></span>
<span class="line"><span>                                             uint64_t size,</span></span>
<span class="line"><span>                                             bool share,</span></span>
<span class="line"><span>                                             Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Error *err = NULL;</span></span>
<span class="line"><span>    memory_region_init(mr, owner, name, size);</span></span>
<span class="line"><span>    mr-&amp;gt;ram = true;</span></span>
<span class="line"><span>    mr-&amp;gt;terminates = true;</span></span>
<span class="line"><span>    mr-&amp;gt;destructor = memory_region_destructor_ram;</span></span>
<span class="line"><span>    mr-&amp;gt;ram_block = qemu_ram_alloc(size, share, mr, &amp;err);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static</span></span>
<span class="line"><span>RAMBlock *qemu_ram_alloc_internal(ram_addr_t size, ram_addr_t max_size, void (*resized)(const char*,uint64_t length,void *host),void *host, bool resizeable, bool share,MemoryRegion *mr, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    RAMBlock *new_block;</span></span>
<span class="line"><span>    size = HOST_PAGE_ALIGN(size);</span></span>
<span class="line"><span>    max_size = HOST_PAGE_ALIGN(max_size);</span></span>
<span class="line"><span>    new_block = g_malloc0(sizeof(*new_block));</span></span>
<span class="line"><span>    new_block-&amp;gt;mr = mr;</span></span>
<span class="line"><span>    new_block-&amp;gt;resized = resized;</span></span>
<span class="line"><span>    new_block-&amp;gt;used_length = size;</span></span>
<span class="line"><span>    new_block-&amp;gt;max_length = max_size;</span></span>
<span class="line"><span>    new_block-&amp;gt;fd = -1;</span></span>
<span class="line"><span>    new_block-&amp;gt;page_size = getpagesize();</span></span>
<span class="line"><span>    new_block-&amp;gt;host = host;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ram_block_add(new_block, &amp;local_err, share);</span></span>
<span class="line"><span>    return new_block;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void ram_block_add(RAMBlock *new_block, Error **errp, bool shared)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    RAMBlock *block;</span></span>
<span class="line"><span>    RAMBlock *last_block = NULL;</span></span>
<span class="line"><span>    ram_addr_t old_ram_size, new_ram_size;</span></span>
<span class="line"><span>    Error *err = NULL;</span></span>
<span class="line"><span>    old_ram_size = last_ram_page();</span></span>
<span class="line"><span>    new_block-&amp;gt;offset = find_ram_offset(new_block-&amp;gt;max_length);</span></span>
<span class="line"><span>    if (!new_block-&amp;gt;host) {</span></span>
<span class="line"><span>        new_block-&amp;gt;host = phys_mem_alloc(new_block-&amp;gt;max_length, &amp;new_block-&amp;gt;mr-&amp;gt;align, shared);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面，我们会调用qemu_ram_alloc，创建一个RAMBlock用来表示内存块。这里面调用ram_block_add-&gt;phys_mem_alloc。phys_mem_alloc是一个函数指针，指向函数qemu_anon_ram_alloc，这里面调用qemu_ram_mmap，在qemu_ram_mmap中调用mmap分配内存。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void *(*phys_mem_alloc)(size_t size, uint64_t *align, bool shared) = qemu_anon_ram_alloc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void *qemu_anon_ram_alloc(size_t size, uint64_t *alignment, bool shared)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    size_t align = QEMU_VMALLOC_ALIGN;</span></span>
<span class="line"><span>    void *ptr = qemu_ram_mmap(-1, size, align, shared);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    if (alignment) {</span></span>
<span class="line"><span>        *alignment = align;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ptr;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void *qemu_ram_mmap(int fd, size_t size, size_t align, bool shared)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int flags;</span></span>
<span class="line"><span>    int guardfd;</span></span>
<span class="line"><span>    size_t offset;</span></span>
<span class="line"><span>    size_t pagesize;</span></span>
<span class="line"><span>    size_t total;</span></span>
<span class="line"><span>    void *guardptr;</span></span>
<span class="line"><span>    void *ptr;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    total = size + align;</span></span>
<span class="line"><span>    guardfd = -1;</span></span>
<span class="line"><span>    pagesize = getpagesize();</span></span>
<span class="line"><span>    flags = MAP_PRIVATE | MAP_ANONYMOUS;</span></span>
<span class="line"><span>    guardptr = mmap(0, total, PROT_NONE, flags, guardfd, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    flags = MAP_FIXED;</span></span>
<span class="line"><span>    flags |= fd == -1 ? MAP_ANONYMOUS : 0;</span></span>
<span class="line"><span>    flags |= shared ? MAP_SHARED : MAP_PRIVATE;</span></span>
<span class="line"><span>    offset = QEMU_ALIGN_UP((uintptr_t)guardptr, align) - (uintptr_t)guardptr;</span></span>
<span class="line"><span>    ptr = mmap(guardptr + offset, size, PROT_READ | PROT_WRITE, flags, fd, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return ptr;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们回到pc_memory_init，通过memory_region_allocate_system_memory申请到内存以后，为了兼容过去的版本，我们分成两个MemoryRegion进行管理，一个是ram_below_4g，一个是ram_above_4g。对于这两个MemoryRegion，我们都会初始化一个alias，也即别名，意思是说，两个MemoryRegion其实都指向memory_region_allocate_system_memory分配的内存，只不过分成两个部分，起两个别名指向不同的区域。</p><p>这两部分MemoryRegion都会调用memory_region_add_subregion，将这两部分作为子的内存区域添加到system_memory这棵树上。</p><p>接下来的调用链为：memory_region_add_subregion-&gt;memory_region_add_subregion_common-&gt;memory_region_update_container_subregions。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void memory_region_update_container_subregions(MemoryRegion *subregion)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MemoryRegion *mr = subregion-&amp;gt;container;</span></span>
<span class="line"><span>    MemoryRegion *other;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    memory_region_transaction_begin();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    memory_region_ref(subregion);</span></span>
<span class="line"><span>    QTAILQ_FOREACH(other, &amp;mr-&amp;gt;subregions, subregions_link) {</span></span>
<span class="line"><span>        if (subregion-&amp;gt;priority &amp;gt;= other-&amp;gt;priority) {</span></span>
<span class="line"><span>            QTAILQ_INSERT_BEFORE(other, subregion, subregions_link);</span></span>
<span class="line"><span>            goto done;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    QTAILQ_INSERT_TAIL(&amp;mr-&amp;gt;subregions, subregion, subregions_link);</span></span>
<span class="line"><span>done:</span></span>
<span class="line"><span>    memory_region_update_pending |= mr-&amp;gt;enabled &amp;&amp; subregion-&amp;gt;enabled;</span></span>
<span class="line"><span>    memory_region_transaction_commit();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在memory_region_update_container_subregions中，我们会将子区域放到链表中，然后调用memory_region_transaction_commit。在这里面，我们会调用address_space_set_flatview。因为内存区域变了，flatview也会变，就像上面分析过的一样，listener会被调用。</p><p>因为添加了一个MemoryRegion，region_add也即kvm_region_add。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void kvm_region_add(MemoryListener *listener,</span></span>
<span class="line"><span>                           MemoryRegionSection *section)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KVMMemoryListener *kml = container_of(listener, KVMMemoryListener, listener);</span></span>
<span class="line"><span>    kvm_set_phys_mem(kml, section, true);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void kvm_set_phys_mem(KVMMemoryListener *kml,</span></span>
<span class="line"><span>                             MemoryRegionSection *section, bool add)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KVMSlot *mem;</span></span>
<span class="line"><span>    int err;</span></span>
<span class="line"><span>    MemoryRegion *mr = section-&amp;gt;mr;</span></span>
<span class="line"><span>    bool writeable = !mr-&amp;gt;readonly &amp;&amp; !mr-&amp;gt;rom_device;</span></span>
<span class="line"><span>    hwaddr start_addr, size;</span></span>
<span class="line"><span>    void *ram;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    size = kvm_align_section(section, &amp;start_addr);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* use aligned delta to align the ram address */</span></span>
<span class="line"><span>    ram = memory_region_get_ram_ptr(mr) + section-&amp;gt;offset_within_region + (start_addr - section-&amp;gt;offset_within_address_space);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* register the new slot */</span></span>
<span class="line"><span>    mem = kvm_alloc_slot(kml);</span></span>
<span class="line"><span>    mem-&amp;gt;memory_size = size;</span></span>
<span class="line"><span>    mem-&amp;gt;start_addr = start_addr;</span></span>
<span class="line"><span>    mem-&amp;gt;ram = ram;</span></span>
<span class="line"><span>    mem-&amp;gt;flags = kvm_mem_flags(mr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    err = kvm_set_user_memory_region(kml, mem, true);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>kvm_region_add调用的是kvm_set_phys_mem，这里面分配一个用于放这块内存的KVMSlot结构，就像一个内存条一样，当然这是在用户态模拟出来的内存条，放在KVMState结构里面。这个结构是我们上一节创建虚拟机的时候创建的。</p><p>接下来，kvm_set_user_memory_region就会将用户态模拟出来的内存条，和内核中的KVM模块关联起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int kvm_set_user_memory_region(KVMMemoryListener *kml, KVMSlot *slot, bool new)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KVMState *s = kvm_state;</span></span>
<span class="line"><span>    struct kvm_userspace_memory_region mem;</span></span>
<span class="line"><span>    int ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mem.slot = slot-&amp;gt;slot | (kml-&amp;gt;as_id &amp;lt;&amp;lt; 16);</span></span>
<span class="line"><span>    mem.guest_phys_addr = slot-&amp;gt;start_addr;</span></span>
<span class="line"><span>    mem.userspace_addr = (unsigned long)slot-&amp;gt;ram;</span></span>
<span class="line"><span>    mem.flags = slot-&amp;gt;flags;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    mem.memory_size = slot-&amp;gt;memory_size;</span></span>
<span class="line"><span>    ret = kvm_vm_ioctl(s, KVM_SET_USER_MEMORY_REGION, &amp;mem);</span></span>
<span class="line"><span>    slot-&amp;gt;old_flags = mem.flags;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>终于，在这里，我们又看到了可以和内核通信的kvm_vm_ioctl。我们来看内核收到KVM_SET_USER_MEMORY_REGION会做哪些事情。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static long kvm_vm_ioctl(struct file *filp,</span></span>
<span class="line"><span>               unsigned int ioctl, unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kvm *kvm = filp-&amp;gt;private_data;</span></span>
<span class="line"><span>    void __user *argp = (void __user *)arg;</span></span>
<span class="line"><span>    switch (ioctl) {</span></span>
<span class="line"><span>    case KVM_SET_USER_MEMORY_REGION: {</span></span>
<span class="line"><span>        struct kvm_userspace_memory_region kvm_userspace_mem;</span></span>
<span class="line"><span>        if (copy_from_user(&amp;kvm_userspace_mem, argp,</span></span>
<span class="line"><span>                        sizeof(kvm_userspace_mem)))</span></span>
<span class="line"><span>            goto out;</span></span>
<span class="line"><span>        r = kvm_vm_ioctl_set_memory_region(kvm, &amp;kvm_userspace_mem);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来的调用链为：kvm_vm_ioctl_set_memory_region-&gt;kvm_set_memory_region-&gt;__kvm_set_memory_region。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int __kvm_set_memory_region(struct kvm *kvm,</span></span>
<span class="line"><span>			    const struct kvm_userspace_memory_region *mem)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int r;</span></span>
<span class="line"><span>	gfn_t base_gfn;</span></span>
<span class="line"><span>	unsigned long npages;</span></span>
<span class="line"><span>	struct kvm_memory_slot *slot;</span></span>
<span class="line"><span>	struct kvm_memory_slot old, new;</span></span>
<span class="line"><span>	struct kvm_memslots *slots = NULL, *old_memslots;</span></span>
<span class="line"><span>	int as_id, id;</span></span>
<span class="line"><span>	enum kvm_mr_change change;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	as_id = mem-&amp;gt;slot &amp;gt;&amp;gt; 16;</span></span>
<span class="line"><span>	id = (u16)mem-&amp;gt;slot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	slot = id_to_memslot(__kvm_memslots(kvm, as_id), id);</span></span>
<span class="line"><span>	base_gfn = mem-&amp;gt;guest_phys_addr &amp;gt;&amp;gt; PAGE_SHIFT;</span></span>
<span class="line"><span>	npages = mem-&amp;gt;memory_size &amp;gt;&amp;gt; PAGE_SHIFT;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new = old = *slot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	new.id = id;</span></span>
<span class="line"><span>	new.base_gfn = base_gfn;</span></span>
<span class="line"><span>	new.npages = npages;</span></span>
<span class="line"><span>	new.flags = mem-&amp;gt;flags;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span> 	if (change == KVM_MR_CREATE) {</span></span>
<span class="line"><span>		new.userspace_addr = mem-&amp;gt;userspace_addr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if (kvm_arch_create_memslot(kvm, &amp;new, npages))</span></span>
<span class="line"><span>			goto out_free;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	slots = kvzalloc(sizeof(struct kvm_memslots), GFP_KERNEL);</span></span>
<span class="line"><span>	memcpy(slots, __kvm_memslots(kvm, as_id), sizeof(struct kvm_memslots));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	r = kvm_arch_prepare_memory_region(kvm, &amp;new, mem, change);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	update_memslots(slots, &amp;new);</span></span>
<span class="line"><span>	old_memslots = install_new_memslots(kvm, as_id, slots);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	kvm_arch_commit_memory_region(kvm, mem, &amp;old, &amp;new, change);</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在用户态每个KVMState有多个KVMSlot，在内核里面，同样每个struct kvm也有多个struct kvm_memory_slot，两者是对应起来的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//用户态</span></span>
<span class="line"><span>struct KVMState</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    int nr_slots;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    KVMMemoryListener memory_listener;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef struct KVMMemoryListener {</span></span>
<span class="line"><span>    MemoryListener listener;</span></span>
<span class="line"><span>    KVMSlot *slots;</span></span>
<span class="line"><span>    int as_id;</span></span>
<span class="line"><span>} KVMMemoryListener</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef struct KVMSlot</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    hwaddr start_addr;</span></span>
<span class="line"><span>    ram_addr_t memory_size;</span></span>
<span class="line"><span>    void *ram;</span></span>
<span class="line"><span>    int slot;</span></span>
<span class="line"><span>    int flags;</span></span>
<span class="line"><span>    int old_flags;</span></span>
<span class="line"><span>} KVMSlot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//内核态</span></span>
<span class="line"><span>struct kvm {</span></span>
<span class="line"><span>	spinlock_t mmu_lock;</span></span>
<span class="line"><span>	struct mutex slots_lock;</span></span>
<span class="line"><span>	struct mm_struct *mm; /* userspace tied to this vm */</span></span>
<span class="line"><span>	struct kvm_memslots __rcu *memslots[KVM_ADDRESS_SPACE_NUM];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct kvm_memslots {</span></span>
<span class="line"><span>	u64 generation;</span></span>
<span class="line"><span>	struct kvm_memory_slot memslots[KVM_MEM_SLOTS_NUM];</span></span>
<span class="line"><span>	/* The mapping table from slot id to the index in memslots[]. */</span></span>
<span class="line"><span>	short id_to_index[KVM_MEM_SLOTS_NUM];</span></span>
<span class="line"><span>	atomic_t lru_slot;</span></span>
<span class="line"><span>	int used_slots;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct kvm_memory_slot {</span></span>
<span class="line"><span>	gfn_t base_gfn;//根据guest_phys_addr计算</span></span>
<span class="line"><span>	unsigned long npages;</span></span>
<span class="line"><span>	unsigned long *dirty_bitmap;</span></span>
<span class="line"><span>	struct kvm_arch_memory_slot arch;</span></span>
<span class="line"><span>	unsigned long userspace_addr;</span></span>
<span class="line"><span>	u32 flags;</span></span>
<span class="line"><span>	short id;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>并且，id_to_memslot函数可以根据用户态的slot号得到内核态的slot结构。</p><p>如果传进来的参数是KVM_MR_CREATE，表示要创建一个新的内存条，就会调用kvm_arch_create_memslot来创建kvm_memory_slot的成员kvm_arch_memory_slot。</p><p>接下来就是创建kvm_memslots结构，填充这个结构，然后通过install_new_memslots将这个新的内存条，添加到struct kvm结构中。</p><p>至此，用户态的内存结构和内核态的内存结构算是对应了起来。</p><h2 id="页面分配和映射" tabindex="-1">页面分配和映射 <a class="header-anchor" href="#页面分配和映射" aria-label="Permalink to &quot;页面分配和映射&quot;">​</a></h2><p>上面对于内存的管理，还只是停留在元数据的管理。对于内存的分配与映射，我们还没有涉及，接下来，我们就来看看，页面是如何进行分配和映射的。</p><p>上面咱们说了，内存映射对于虚拟机来讲是一件非常麻烦的事情，从GVA到GPA到HVA到HPA，性能很差，为了解决这个问题，有两种主要的思路。</p><h3 id="影子页表" tabindex="-1">影子页表 <a class="header-anchor" href="#影子页表" aria-label="Permalink to &quot;影子页表&quot;">​</a></h3><p>第一种方式就是软件的方式， <strong>影子页表</strong> （Shadow Page Table）。</p><p>按照咱们在内存管理那一节讲的，内存映射要通过页表来管理，页表地址应该放在cr3寄存器里面。本来的过程是，客户机要通过cr3找到客户机的页表，实现从GVA到GPA的转换，然后在宿主机上，要通过cr3找到宿主机的页表，实现从HVA到HPA的转换。</p><p>为了实现客户机虚拟地址空间到宿主机物理地址空间的直接映射。客户机中每个进程都有自己的虚拟地址空间，所以KVM需要为客户机中的每个进程页表都要维护一套相应的影子页表。</p><p>在客户机访问内存时，使用的不是客户机的原来的页表，而是这个页表对应的影子页表，从而实现了从客户机虚拟地址到宿主机物理地址的直接转换。而且，在TLB和CPU 缓存上缓存的是来自影子页表中客户机虚拟地址和宿主机物理地址之间的映射，也因此提高了缓存的效率。</p><p>但是影子页表的引入也意味着 KVM 需要为每个客户机的每个进程的页表都要维护一套相应的影子页表，内存占用比较大，而且客户机页表和和影子页表也需要进行实时同步。</p><h3 id="扩展页表" tabindex="-1">扩展页表 <a class="header-anchor" href="#扩展页表" aria-label="Permalink to &quot;扩展页表&quot;">​</a></h3><p>于是就有了第二种方式，就是硬件的方式，Intel的EPT（Extent Page Table，扩展页表）技术。</p><p>EPT在原有客户机页表对客户机虚拟地址到客户机物理地址映射的基础上，又引入了 EPT页表来实现客户机物理地址到宿主机物理地址的另一次映射。客户机运行时，客户机页表被载入 CR3，而EPT页表被载入专门的EPT 页表指针寄存器 EPTP。</p><p>有了EPT，在客户机物理地址到宿主机物理地址转换的过程中，缺页会产生EPT 缺页异常。KVM首先根据引起异常的客户机物理地址，映射到对应的宿主机虚拟地址，然后为此虚拟地址分配新的物理页，最后 KVM 再更新 EPT 页表，建立起引起异常的客户机物理地址到宿主机物理地址之间的映射。</p><p>KVM 只需为每个客户机维护一套 EPT 页表，也大大减少了内存的开销。</p><p>这里，我们重点看第二种方式。因为使用了EPT之后，客户机里面的页表映射，也即从GVA到GPA的转换，还是用传统的方式，和在内存管理那一章讲的没有什么区别。而EPT重点帮我们解决的就是从GPA到HPA的转换问题。因为要经过两次页表，所以EPT又称为tdp（two dimentional paging）。</p><p>EPT的页表结构也是分为四层，EPT Pointer （EPTP）指向PML4的首地址。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110488/02e4740398bc3685f366351260ae7230.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110488/02e4740398bc3685f366351260ae7230.jpg" alt=""></a></p><p>管理物理页面的Page结构和咱们讲内存管理那一章是一样的。EPT页表也需要存放在一个页中，这些页要用kvm_mmu_page这个结构来管理。</p><p>当一个虚拟机运行，进入客户机模式的时候，我们上一节解析过，它会调用vcpu_enter_guest函数，这里面会调用kvm_mmu_reload-&gt;kvm_mmu_load。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int kvm_mmu_load(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	r = mmu_topup_memory_caches(vcpu);</span></span>
<span class="line"><span>	r = mmu_alloc_roots(vcpu);</span></span>
<span class="line"><span>	kvm_mmu_sync_roots(vcpu);</span></span>
<span class="line"><span>	/* set_cr3() should ensure TLB has been flushed */</span></span>
<span class="line"><span>	vcpu-&amp;gt;arch.mmu.set_cr3(vcpu, vcpu-&amp;gt;arch.mmu.root_hpa);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int mmu_alloc_roots(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (vcpu-&amp;gt;arch.mmu.direct_map)</span></span>
<span class="line"><span>		return mmu_alloc_direct_roots(vcpu);</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		return mmu_alloc_shadow_roots(vcpu);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int mmu_alloc_direct_roots(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kvm_mmu_page *sp;</span></span>
<span class="line"><span>	unsigned i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (vcpu-&amp;gt;arch.mmu.shadow_root_level == PT64_ROOT_LEVEL) {</span></span>
<span class="line"><span>		spin_lock(&amp;vcpu-&amp;gt;kvm-&amp;gt;mmu_lock);</span></span>
<span class="line"><span>		make_mmu_pages_available(vcpu);</span></span>
<span class="line"><span>		sp = kvm_mmu_get_page(vcpu, 0, 0, PT64_ROOT_LEVEL, 1, ACC_ALL);</span></span>
<span class="line"><span>		++sp-&amp;gt;root_count;</span></span>
<span class="line"><span>		spin_unlock(&amp;vcpu-&amp;gt;kvm-&amp;gt;mmu_lock);</span></span>
<span class="line"><span>		vcpu-&amp;gt;arch.mmu.root_hpa = __pa(sp-&amp;gt;spt);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里构建的是页表的根部，也即顶级页表，并且设置cr3来刷新TLB。mmu_alloc_roots会调用mmu_alloc_direct_roots，因为我们用的是EPT模式，而非影子表。在mmu_alloc_direct_roots中，kvm_mmu_get_page会分配一个kvm_mmu_page，来存放顶级页表项。</p><p>接下来，当虚拟机真的要访问内存的时候，会发现有的页表没有建立，有的物理页没有分配，这都会触发缺页异常，在KVM里面会发送VM-Exit，从客户机模式转换为宿主机模式，来修复这个缺失的页表或者物理页。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int (*const kvm_vmx_exit_handlers[])(struct kvm_vcpu *vcpu) = {</span></span>
<span class="line"><span>    [EXIT_REASON_EXCEPTION_NMI]           = handle_exception,</span></span>
<span class="line"><span>    [EXIT_REASON_EXTERNAL_INTERRUPT]      = handle_external_interrupt,</span></span>
<span class="line"><span>    [EXIT_REASON_IO_INSTRUCTION]          = handle_io,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    [EXIT_REASON_EPT_VIOLATION]       = handle_ept_violation,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>咱们前面讲过，虚拟机退出客户机模式有很多种原因，例如接收到中断、接收到I/O等，EPT的缺页异常也是一种类型，我们称为EXIT_REASON_EPT_VIOLATION，对应的处理函数是handle_ept_violation。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int handle_ept_violation(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	gpa_t gpa;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	gpa = vmcs_read64(GUEST_PHYSICAL_ADDRESS);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vcpu-&amp;gt;arch.gpa_available = true;</span></span>
<span class="line"><span>	vcpu-&amp;gt;arch.exit_qualification = exit_qualification;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	return kvm_mmu_page_fault(vcpu, gpa, error_code, NULL, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int kvm_mmu_page_fault(struct kvm_vcpu *vcpu, gva_t cr2, u64 error_code,</span></span>
<span class="line"><span>		       void *insn, int insn_len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	r = vcpu-&amp;gt;arch.mmu.page_fault(vcpu, cr2, lower_32_bits(error_code),false);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在handle_ept_violation里面，我们从VMCS中得到没有解析成功的GPA，也即客户机的物理地址，然后调用kvm_mmu_page_fault，看为什么解析不成功。kvm_mmu_page_fault会调用page_fault函数，其实是tdp_page_fault函数。tdp的意思就是EPT，前面我们解释过了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int tdp_page_fault(struct kvm_vcpu *vcpu, gva_t gpa, u32 error_code, bool prefault)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	kvm_pfn_t pfn;</span></span>
<span class="line"><span>	int r;</span></span>
<span class="line"><span>	int level;</span></span>
<span class="line"><span>	bool force_pt_level;</span></span>
<span class="line"><span>	gfn_t gfn = gpa &amp;gt;&amp;gt; PAGE_SHIFT;</span></span>
<span class="line"><span>	unsigned long mmu_seq;</span></span>
<span class="line"><span>	int write = error_code &amp; PFERR_WRITE_MASK;</span></span>
<span class="line"><span>	bool map_writable;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	r = mmu_topup_memory_caches(vcpu);</span></span>
<span class="line"><span>	level = mapping_level(vcpu, gfn, &amp;force_pt_level);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (try_async_pf(vcpu, prefault, gfn, gpa, &amp;pfn, write, &amp;map_writable))</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (handle_abnormal_pfn(vcpu, 0, gfn, pfn, ACC_ALL, &amp;r))</span></span>
<span class="line"><span>		return r;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	make_mmu_pages_available(vcpu);</span></span>
<span class="line"><span>	r = __direct_map(vcpu, write, map_writable, level, gfn, pfn, prefault);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>既然没有映射，就应该加上映射，tdp_page_fault就是干这个事情的。</p><p>在tdp_page_fault这个函数开头，我们通过gpa，也即客户机的物理地址得到客户机的页号gfn。接下来，我们要通过调用try_async_pf得到宿主机的物理地址对应的页号，也即真正的物理页的页号，然后通过__direct_map将两者关联起来。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static bool try_async_pf(struct kvm_vcpu *vcpu, bool prefault, gfn_t gfn, gva_t gva, kvm_pfn_t *pfn, bool write, bool *writable)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kvm_memory_slot *slot;</span></span>
<span class="line"><span>	bool async;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	slot = kvm_vcpu_gfn_to_memslot(vcpu, gfn);</span></span>
<span class="line"><span>	async = false;</span></span>
<span class="line"><span>	*pfn = __gfn_to_pfn_memslot(slot, gfn, false, &amp;async, write, writable);</span></span>
<span class="line"><span>	if (!async)</span></span>
<span class="line"><span>		return false; /* *pfn has correct page already */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!prefault &amp;&amp; kvm_can_do_async_pf(vcpu)) {</span></span>
<span class="line"><span>		if (kvm_find_async_pf_gfn(vcpu, gfn)) {</span></span>
<span class="line"><span>			kvm_make_request(KVM_REQ_APF_HALT, vcpu);</span></span>
<span class="line"><span>			return true;</span></span>
<span class="line"><span>		} else if (kvm_arch_setup_async_pf(vcpu, gva, gfn))</span></span>
<span class="line"><span>			return true;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	*pfn = __gfn_to_pfn_memslot(slot, gfn, false, NULL, write, writable);</span></span>
<span class="line"><span>	return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在try_async_pf中，要想得到pfn，也即物理页的页号，会先通过kvm_vcpu_gfn_to_memslot，根据客户机的物理地址对应的页号找到内存条，然后调用__gfn_to_pfn_memslot，根据内存条找到pfn。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>kvm_pfn_t __gfn_to_pfn_memslot(struct kvm_memory_slot *slot, gfn_t gfn,bool atomic, bool *async, bool write_fault,bool *writable)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	unsigned long addr = __gfn_to_hva_many(slot, gfn, NULL, write_fault);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return hva_to_pfn(addr, atomic, async, write_fault,</span></span>
<span class="line"><span>			  writable);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在__gfn_to_pfn_memslot中，我们会调用__gfn_to_hva_many，从客户机物理地址对应的页号，得到宿主机虚拟地址hva，然后从宿主机虚拟地址到宿主机物理地址，调用的是hva_to_pfn。</p><p>hva_to_pfn会调用hva_to_pfn_slow。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int hva_to_pfn_slow(unsigned long addr, bool *async, bool write_fault,</span></span>
<span class="line"><span>			   bool *writable, kvm_pfn_t *pfn)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct page *page[1];</span></span>
<span class="line"><span>	int npages = 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (async) {</span></span>
<span class="line"><span>		npages = get_user_page_nowait(addr, write_fault, page);</span></span>
<span class="line"><span>	} else {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		npages = get_user_pages_unlocked(addr, 1, page, flags);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	*pfn = page_to_pfn(page[0]);</span></span>
<span class="line"><span>	return npages;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在hva_to_pfn_slow中，我们要先调用get_user_page_nowait，得到一个物理页面，然后再调用page_to_pfn将物理页面转换成为物理页号。</p><p>无论是哪一种get_user_pages_XXX，最终都会调用__get_user_pages函数。这里面会调用faultin_page，在faultin_page中我们会调用handle_mm_fault。看到这个是不是很熟悉？这就是咱们内存管理那一章讲的缺页异常的逻辑，分配一个物理内存。</p><p>至此，try_async_pf得到了物理页面，并且转换为对应的物理页号。</p><p>接下来，__direct_map会关联客户机物理页号和宿主机物理页号。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int __direct_map(struct kvm_vcpu *vcpu, int write, int map_writable,</span></span>
<span class="line"><span>			int level, gfn_t gfn, kvm_pfn_t pfn, bool prefault)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kvm_shadow_walk_iterator iterator;</span></span>
<span class="line"><span>	struct kvm_mmu_page *sp;</span></span>
<span class="line"><span>	int emulate = 0;</span></span>
<span class="line"><span>	gfn_t pseudo_gfn;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!VALID_PAGE(vcpu-&amp;gt;arch.mmu.root_hpa))</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for_each_shadow_entry(vcpu, (u64)gfn &amp;lt;&amp;lt; PAGE_SHIFT, iterator) {</span></span>
<span class="line"><span>		if (iterator.level == level) {</span></span>
<span class="line"><span>			emulate = mmu_set_spte(vcpu, iterator.sptep, ACC_ALL,</span></span>
<span class="line"><span>					       write, level, gfn, pfn, prefault,</span></span>
<span class="line"><span>					       map_writable);</span></span>
<span class="line"><span>			direct_pte_prefetch(vcpu, iterator.sptep);</span></span>
<span class="line"><span>			++vcpu-&amp;gt;stat.pf_fixed;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		drop_large_spte(vcpu, iterator.sptep);</span></span>
<span class="line"><span>		if (!is_shadow_present_pte(*iterator.sptep)) {</span></span>
<span class="line"><span>			u64 base_addr = iterator.addr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			base_addr &amp;= PT64_LVL_ADDR_MASK(iterator.level);</span></span>
<span class="line"><span>			pseudo_gfn = base_addr &amp;gt;&amp;gt; PAGE_SHIFT;</span></span>
<span class="line"><span>			sp = kvm_mmu_get_page(vcpu, pseudo_gfn, iterator.addr,</span></span>
<span class="line"><span>					      iterator.level - 1, 1, ACC_ALL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			link_shadow_page(vcpu, iterator.sptep, sp);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return emulate;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>__direct_map首先判断页表的根是否存在，当然存在，我们刚才初始化了。</p><p>接下来是for_each_shadow_entry一个循环。每一个循环中，先是会判断需要映射的level，是否正是当前循环的这个iterator.level。如果是，则说明是叶子节点，直接映射真正的物理页面pfn，然后退出。接着是非叶子节点的情形，判断如果这一项指向的页表项不存在，就要建立页表项，通过kvm_mmu_get_page得到保存页表项的页面，然后将这一项指向下一级的页表页面。</p><p>至此，内存映射就结束了。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>我们这里来总结一下，虚拟机的内存管理也是需要用户态的qemu和内核态的KVM共同完成。为了加速内存映射，需要借助硬件的EPT技术。</p><p>在用户态qemu中，有一个结构AddressSpace address_space_memory来表示虚拟机的系统内存，这个内存可能包含多个内存区域struct MemoryRegion，组成树形结构，指向由mmap分配的虚拟内存。</p><p>在AddressSpace结构中，有一个struct KVMMemoryListener，当有新的内存区域添加的时候，会被通知调用kvm_region_add来通知内核。</p><p>在用户态qemu中，对于虚拟机有一个结构struct KVMState表示这个虚拟机，这个结构会指向一个数组的struct KVMSlot表示这个虚拟机的多个内存条，KVMSlot中有一个void *ram指针指向mmap分配的那块虚拟内存。</p><p>kvm_region_add是通过ioctl来通知内核KVM的，会给内核KVM发送一个KVM_SET_USER_MEMORY_REGION消息，表示用户态qemu添加了一个内存区域，内核KVM也应该添加一个相应的内存区域。</p><p>和用户态qemu对应的内核KVM，对于虚拟机有一个结构struct kvm表示这个虚拟机，这个结构会指向一个数组的struct kvm_memory_slot表示这个虚拟机的多个内存条，kvm_memory_slot中有起始页号，页面数目，表示这个虚拟机的物理内存空间。</p><p>虚拟机的物理内存空间里面的页面当然不是一开始就映射到物理页面的，只有当虚拟机的内存被访问的时候，也即mmap分配的虚拟内存空间被访问的时候，先查看EPT页表，是否已经映射过，如果已经映射过，则经过四级页表映射，就能访问到物理页面。</p><p>如果没有映射过，则虚拟机会通过VM-Exit指令回到宿主机模式，通过handle_ept_violation补充页表映射。先是通过handle_mm_fault为虚拟机的物理内存空间分配真正的物理页面，然后通过__direct_map添加EPT页表映射。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110488/0186c533b7ef706df880dfd775c2449b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110488/0186c533b7ef706df880dfd775c2449b.jpg" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这一节，影子页表我们没有深入去讲，你能自己研究一下，它是如何实现的吗？</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110488/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/110488/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,112)])])}const d=n(l,[["render",t]]);export{g as __pageData,d as default};
