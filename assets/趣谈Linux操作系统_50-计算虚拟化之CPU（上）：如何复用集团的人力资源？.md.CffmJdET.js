import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const r=JSON.parse('{"title":"50 | 计算虚拟化之CPU（上）：如何复用集团的人力资源？","description":"","frontmatter":{},"headers":[{"level":2,"title":"1.初始化所有的Module","slug":"_1-初始化所有的module","link":"#_1-初始化所有的module","children":[]},{"level":2,"title":"2.解析qemu的命令行","slug":"_2-解析qemu的命令行","link":"#_2-解析qemu的命令行","children":[]},{"level":2,"title":"3.初始化machine","slug":"_3-初始化machine","link":"#_3-初始化machine","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/50-计算虚拟化之CPU（上）：如何复用集团的人力资源？.md","filePath":"趣谈Linux操作系统/50-计算虚拟化之CPU（上）：如何复用集团的人力资源？.md","lastUpdated":1779822193000}'),i={name:"趣谈Linux操作系统/50-计算虚拟化之CPU（上）：如何复用集团的人力资源？.md"};function l(t,s,c,_,o,m){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_50-计算虚拟化之cpu-上-如何复用集团的人力资源" tabindex="-1">50 | 计算虚拟化之CPU（上）：如何复用集团的人力资源？ <a class="header-anchor" href="#_50-计算虚拟化之cpu-上-如何复用集团的人力资源" aria-label="Permalink to &quot;50 | 计算虚拟化之CPU（上）：如何复用集团的人力资源？&quot;">​</a></h1><p>上一节，我们讲了一下虚拟化的基本原理，以及qemu、kvm之间的关系。这一节，我们就来看一下，用户态的qemu和内核态的kvm如何一起协作，来创建虚拟机，实现CPU和内存虚拟化。</p><p>这里是上一节我们讲的qemu启动时候的命令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>qemu-system-x86_64 -enable-kvm -name ubuntutest  -m 2048 -hda ubuntutest.qcow2 -vnc :19 -net nic,model=virtio -nettap,ifname=tap0,script=no,downscript=no</span></span></code></pre></div><p>接下来，我们在 <a href="https://www.qemu.org/" target="_blank" rel="noreferrer">这里下载</a> qemu的代码。qemu的main函数在vl.c下面。这是一个非常非常长的函数，我们来慢慢地解析它。</p><h2 id="_1-初始化所有的module" tabindex="-1">1.初始化所有的Module <a class="header-anchor" href="#_1-初始化所有的module" aria-label="Permalink to &quot;1.初始化所有的Module&quot;">​</a></h2><p>第一步，初始化所有的Module，调用下面的函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module_call_init(MODULE_INIT_QOM);</span></span></code></pre></div><p>上一节我们讲过，qemu作为中间人其实挺累的，对上面的虚拟机需要模拟各种各样的外部设备。当虚拟机真的要使用物理资源的时候，对下面的物理机上的资源要进行请求，所以它的工作模式有点儿类似操作系统对接驱动。驱动要符合一定的格式，才能算操作系统的一个模块。同理，qemu为了模拟各种各样的设备，也需要管理各种各样的模块，这些模块也需要符合一定的格式。</p><p>定义一个qemu模块会调用type_init。例如，kvm的模块要在accel/kvm/kvm-all.c文件里面实现。在这个文件里面，有一行下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>type_init(kvm_type_init);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define type_init(function) module_init(function, MODULE_INIT_QOM)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define module_init(function, type)                                         \\</span></span>
<span class="line"><span>static void __attribute__((constructor)) do_qemu_init_ ## function(void)    \\</span></span>
<span class="line"><span>{                                                                           \\</span></span>
<span class="line"><span>    register_module_init(function, type);                                   \\</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void register_module_init(void (*fn)(void), module_init_type type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ModuleEntry *e;</span></span>
<span class="line"><span>    ModuleTypeList *l;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    e = g_malloc0(sizeof(*e));</span></span>
<span class="line"><span>    e-&amp;gt;init = fn;</span></span>
<span class="line"><span>    e-&amp;gt;type = type;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    l = find_type(type);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    QTAILQ_INSERT_TAIL(l, e, node);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从代码里面的定义我们可以看出来，type_init后面的参数是一个函数，调用type_init就相当于调用module_init，在这里函数就是kvm_type_init，类型就是MODULE_INIT_QOM。是不是感觉和驱动有点儿像？</p><p>module_init最终要调用register_module_init。属于MODULE_INIT_QOM这种类型的，有一个Module列表ModuleTypeList，列表里面是一项一项的ModuleEntry。KVM就是其中一项，并且会初始化每一项的init函数为参数表示的函数fn，也即KVM这个module的init函数就是kvm_type_init。</p><p>当然，MODULE_INIT_QOM这种类型会有很多很多的module，从后面的代码我们可以看到，所有调用type_init的地方都注册了一个MODULE_INIT_QOM类型的Module。</p><p>了解了Module的注册机制，我们继续回到main函数中module_call_init的调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void module_call_init(module_init_type type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ModuleTypeList *l;</span></span>
<span class="line"><span>    ModuleEntry *e;</span></span>
<span class="line"><span>    l = find_type(type);</span></span>
<span class="line"><span>    QTAILQ_FOREACH(e, l, node) {</span></span>
<span class="line"><span>        e-&amp;gt;init();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在module_call_init中，我们会找到MODULE_INIT_QOM这种类型对应的ModuleTypeList，找出列表中所有的ModuleEntry，然后调用每个ModuleEntry的init函数。这里需要注意的是，在module_call_init调用的这一步，所有Module的init函数都已经被调用过了。</p><p>后面我们会看到很多的Module，当你看到它们的时候，你需要意识到，它的init函数在这里也被调用过了。这里我们还是以对于kvm这个module为例子，看看它的init函数都做了哪些事情。你会发现，其实它调用的是kvm_type_init。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void kvm_type_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    type_register_static(&amp;kvm_accel_type);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>TypeImpl *type_register_static(const TypeInfo *info)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return type_register(info);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>TypeImpl *type_register(const TypeInfo *info)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    assert(info-&amp;gt;parent);</span></span>
<span class="line"><span>    return type_register_internal(info);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static TypeImpl *type_register_internal(const TypeInfo *info)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TypeImpl *ti;</span></span>
<span class="line"><span>    ti = type_new(info);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    type_table_add(ti);</span></span>
<span class="line"><span>    return ti;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static TypeImpl *type_new(const TypeInfo *info)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TypeImpl *ti = g_malloc0(sizeof(*ti));</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (type_table_lookup(info-&amp;gt;name) != NULL) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ti-&amp;gt;name = g_strdup(info-&amp;gt;name);</span></span>
<span class="line"><span>    ti-&amp;gt;parent = g_strdup(info-&amp;gt;parent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ti-&amp;gt;class_size = info-&amp;gt;class_size;</span></span>
<span class="line"><span>    ti-&amp;gt;instance_size = info-&amp;gt;instance_size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ti-&amp;gt;class_init = info-&amp;gt;class_init;</span></span>
<span class="line"><span>    ti-&amp;gt;class_base_init = info-&amp;gt;class_base_init;</span></span>
<span class="line"><span>    ti-&amp;gt;class_data = info-&amp;gt;class_data;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ti-&amp;gt;instance_init = info-&amp;gt;instance_init;</span></span>
<span class="line"><span>    ti-&amp;gt;instance_post_init = info-&amp;gt;instance_post_init;</span></span>
<span class="line"><span>    ti-&amp;gt;instance_finalize = info-&amp;gt;instance_finalize;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ti-&amp;gt;abstract = info-&amp;gt;abstract;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (i = 0; info-&amp;gt;interfaces &amp;&amp; info-&amp;gt;interfaces[i].type; i++) {</span></span>
<span class="line"><span>        ti-&amp;gt;interfaces[i].typename = g_strdup(info-&amp;gt;interfaces[i].type);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ti-&amp;gt;num_interfaces = i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ti;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void type_table_add(TypeImpl *ti)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    assert(!enumerating_types);</span></span>
<span class="line"><span>    g_hash_table_insert(type_table_get(), (void *)ti-&amp;gt;name, ti);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static GHashTable *type_table_get(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    static GHashTable *type_table;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (type_table == NULL) {</span></span>
<span class="line"><span>        type_table = g_hash_table_new(g_str_hash, g_str_equal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return type_table;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const TypeInfo kvm_accel_type = {</span></span>
<span class="line"><span>    .name = TYPE_KVM_ACCEL,</span></span>
<span class="line"><span>    .parent = TYPE_ACCEL,</span></span>
<span class="line"><span>    .class_init = kvm_accel_class_init,</span></span>
<span class="line"><span>    .instance_size = sizeof(KVMState),</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>每一个Module既然要模拟某种设备，那应该定义一种类型TypeImpl来表示这些设备，这其实是一种面向对象编程的思路，只不过这里用的是纯C语言的实现，所以需要变相实现一下类和对象。</p><p>kvm_type_init会注册kvm_accel_type，定义上面的代码，我们可以认为这样动态定义了一个类。这个类的名字是TYPE_KVM_ACCEL，这个类有父类TYPE_ACCEL，这个类的初始化应该调用函数kvm_accel_class_init（看，这里已经直接叫类class了）。如果用这个类声明一个对象，对象的大小应该是instance_size。是不是有点儿Java语言反射的意思，根据一些名称的定义，一个类就定义好了。</p><p>这里的调用链为：kvm_type_init-&gt;type_register_static-&gt;type_register-&gt;type_register_internal。</p><p>在type_register_internal中，我们会根据kvm_accel_type这个TypeInfo，创建一个TypeImpl来表示这个新注册的类，也就是说，TypeImpl才是我们想要声明的那个class。在qemu里面，有一个全局的哈希表type_table，用来存放所有定义的类。在type_new里面，我们先从全局表里面根据名字找这个类。如果找到，说明这个类曾经被注册过，就报错；如果没有找到，说明这是一个新的类，则将TypeInfo里面信息填到TypeImpl里面。type_table_add会将这个类注册到全局的表里面。到这里，我们注意，class_init还没有被调用，也即这个类现在还处于纸面的状态。</p><p>这点更加像Java的反射机制了。在Java里面，对于一个类，首先我们写代码的时候要写一个class xxx的定义，编译好就放在.class文件中，这也是出于纸面的状态。然后，Java会有一个Class对象，用于读取和表示这个纸面上的class xxx，可以生成真正的对象。</p><p>相同的过程在后面的代码中我们也可以看到，class_init会生成XXXClass，就相当于Java里面的Class对象，TypeImpl还会有一个instance_init函数，相当于构造函数，用于根据XXXClass生成Object，这就相当于Java反射里面最终创建的对象。和构造函数对应的还有instance_finalize，相当于析构函数。</p><p>这一套反射机制放在qom文件夹下面，全称QEMU Object Model，也即用C实现了一套面向对象的反射机制。</p><p>说完了初始化Module，我们还回到main函数接着分析。</p><h2 id="_2-解析qemu的命令行" tabindex="-1">2.解析qemu的命令行 <a class="header-anchor" href="#_2-解析qemu的命令行" aria-label="Permalink to &quot;2.解析qemu的命令行&quot;">​</a></h2><p>第二步我们就要开始解析qemu的命令行了。qemu的命令行解析，就是下面这样一长串。还记得咱们自己写过一个解析命令行参数的程序吗？这里的opts是差不多的意思。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    qemu_add_opts(&amp;qemu_drive_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_chardev_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_device_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_netdev_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_nic_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_net_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_rtc_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_machine_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_accel_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_mem_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_smp_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_boot_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_name_opts);</span></span>
<span class="line"><span>    qemu_add_opts(&amp;qemu_numa_opts);</span></span></code></pre></div><p>为什么有这么多的opts呢？这是因为，我们上一节给的参数都是简单的参数，实际运行中创建的kvm参数会复杂N倍。这里我们贴一个开源云平台软件OpenStack创建出来的KVM的参数，如下所示。不要被吓坏，你不需要全部看懂，只需要看懂一部分就行了。具体我来给你解析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>qemu-system-x86_64</span></span>
<span class="line"><span>-enable-kvm</span></span>
<span class="line"><span>-name instance-00000024</span></span>
<span class="line"><span>-machine pc-i440fx-trusty,accel=kvm,usb=off</span></span>
<span class="line"><span>-cpu SandyBridge,+erms,+smep,+fsgsbase,+pdpe1gb,+rdrand,+f16c,+osxsave,+dca,+pcid,+pdcm,+xtpr,+tm2,+est,+smx,+vmx,+ds_cpl,+monitor,+dtes64,+pbe,+tm,+ht,+ss,+acpi,+ds,+vme</span></span>
<span class="line"><span>-m 2048</span></span>
<span class="line"><span>-smp 1,sockets=1,cores=1,threads=1</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>-rtc base=utc,driftfix=slew</span></span>
<span class="line"><span>-drive file=/var/lib/nova/instances/1f8e6f7e-5a70-4780-89c1-464dc0e7f308/disk,if=none,id=drive-virtio-disk0,format=qcow2,cache=none</span></span>
<span class="line"><span>-device virtio-blk-pci,scsi=off,bus=pci.0,addr=0x4,drive=drive-virtio-disk0,id=virtio-disk0,bootindex=1</span></span>
<span class="line"><span>-netdev tap,fd=32,id=hostnet0,vhost=on,vhostfd=37</span></span>
<span class="line"><span>-device virtio-net-pci,netdev=hostnet0,id=net0,mac=fa:16:3e:d1:2d:99,bus=pci.0,addr=0x3</span></span>
<span class="line"><span>-chardev file,id=charserial0,path=/var/lib/nova/instances/1f8e6f7e-5a70-4780-89c1-464dc0e7f308/console.log</span></span>
<span class="line"><span>-vnc 0.0.0.0:12</span></span>
<span class="line"><span>-device cirrus-vga,id=video0,bus=pci.0,addr=0x2</span></span></code></pre></div><ul><li><p>-enable-kvm：表示启用硬件辅助虚拟化。</p></li><li><p>-name instance-00000024：表示虚拟机的名称。</p></li><li><p>-machine pc-i440fx-trusty,accel=kvm,usb=off：machine是什么呢？其实就是计算机体系结构。不知道什么是体系结构的话，可以订阅极客时间的另一个专栏《深入浅出计算机组成原理》。</p><p>qemu会模拟多种体系结构，常用的有普通PC机，也即x86的32位或者64位的体系结构、Mac电脑PowerPC的体系结构、Sun的体系结构、MIPS的体系结构，精简指令集。如果使用KVM hardware-assisted virtualization，也即BIOS中VD-T是打开的，则参数中accel=kvm。如果不使用hardware-assisted virtualization，用的是纯模拟，则有参数accel = tcg，-no-kvm。</p></li><li><p>-cpu SandyBridge,+erms,+smep,+fsgsbase,+pdpe1gb,+rdrand,+f16c,+osxsave,+dca,+pcid,+pdcm,+xtpr,+tm2,+est,+smx,+vmx,+ds_cpl,+monitor,+dtes64,+pbe,+tm,+ht,+ss,+acpi,+ds,+vme：表示设置CPU，SandyBridge是Intel处理器，后面的加号都是添加的CPU的参数，这些参数会显示在/proc/cpuinfo里面。</p></li><li><p>-m 2048：表示内存。</p></li><li><p>-smp 1,sockets=1,cores=1,threads=1：SMP我们解析过，叫对称多处理器，和NUMA对应。qemu仿真了一个具有1个vcpu，一个socket，一个core，一个threads的处理器。</p><p>socket、core、threads是什么概念呢？socket就是主板上插cpu的槽的数目，也即常说的“路”，core就是我们平时说的“核”，即双核、4核等。thread就是每个core的硬件线程数，即超线程。举个具体的例子，某个服务器是：2路4核超线程（一般默认为2个线程），通过cat /proc/cpuinfo，我们看到的是2 <em>4</em> 2=16个processor，很多人也习惯成为16核了。</p></li><li><p>-rtc base=utc,driftfix=slew：表示系统时间由参数-rtc指定。</p></li><li><p>-device cirrus-vga,id=video0,bus=pci.0,addr=0x2：表示显示器用参数-vga设置，默认为cirrus，它模拟了CL-GD5446PCI VGA card。</p></li><li><p>有关网卡，使用-net参数和-device。</p></li><li><p>从HOST角度：-netdev tap,fd=32,id=hostnet0,vhost=on,vhostfd=37。</p></li><li><p>从GUEST角度：-device virtio-net-pci,netdev=hostnet0,id=net0,mac=fa:16:3e:d1:2d:99,bus=pci.0,addr=0x3。</p></li><li><p>有关硬盘，使用-hda -hdb，或者使用-drive和-device。</p></li><li><p>从HOST角度：-drive file=/var/lib/nova/instances/1f8e6f7e-5a70-4780-89c1-464dc0e7f308/disk,if=none,id=drive-virtio-disk0,format=qcow2,cache=none</p></li><li><p>从GUEST角度：-device virtio-blk-pci,scsi=off,bus=pci.0,addr=0x4,drive=drive-virtio-disk0,id=virtio-disk0,bootindex=1</p></li><li><p>-vnc 0.0.0.0:12：设置VNC。</p></li></ul><p>在main函数中，接下来的for循环和大量的switch case语句，就是对于这些参数的解析，我们不一一解析，后面真的用到这些参数的时候，我们再仔细看。</p><h2 id="_3-初始化machine" tabindex="-1">3.初始化machine <a class="header-anchor" href="#_3-初始化machine" aria-label="Permalink to &quot;3.初始化machine&quot;">​</a></h2><p>回到main函数，接下来是初始化machine。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>machine_class = select_machine();</span></span>
<span class="line"><span>current_machine = MACHINE(object_new(object_class_get_name(</span></span>
<span class="line"><span>                          OBJECT_CLASS(machine_class))));</span></span></code></pre></div><p>这里面的machine_class是什么呢？这还得从machine参数说起。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-machine pc-i440fx-trusty,accel=kvm,usb=off</span></span></code></pre></div><p>这里的pc-i440fx是x86机器默认的体系结构。在hw/i386/pc_piix.c中，它定义了对应的machine_class。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DEFINE_I440FX_MACHINE(v4_0, &quot;pc-i440fx-4.0&quot;, NULL,</span></span>
<span class="line"><span>                      pc_i440fx_4_0_machine_options);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define DEFINE_I440FX_MACHINE(suffix, name, compatfn, optionfn) \\</span></span>
<span class="line"><span>    static void pc_init_##suffix(MachineState *machine) \\</span></span>
<span class="line"><span>    { \\</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        pc_init1(machine, TYPE_I440FX_PCI_HOST_BRIDGE, \\</span></span>
<span class="line"><span>                 TYPE_I440FX_PCI_DEVICE); \\</span></span>
<span class="line"><span>    } \\</span></span>
<span class="line"><span>    DEFINE_PC_MACHINE(suffix, name, pc_init_##suffix, optionfn)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define DEFINE_PC_MACHINE(suffix, namestr, initfn, optsfn) \\</span></span>
<span class="line"><span>    static void pc_machine_##suffix##_class_init(ObjectClass *oc, void *data</span></span>
<span class="line"><span>) \\</span></span>
<span class="line"><span>    { \\</span></span>
<span class="line"><span>        MachineClass *mc = MACHINE_CLASS(oc); \\</span></span>
<span class="line"><span>        optsfn(mc); \\</span></span>
<span class="line"><span>        mc-&amp;gt;init = initfn; \\</span></span>
<span class="line"><span>    } \\</span></span>
<span class="line"><span>    static const TypeInfo pc_machine_type_##suffix = { \\</span></span>
<span class="line"><span>        .name       = namestr TYPE_MACHINE_SUFFIX, \\</span></span>
<span class="line"><span>        .parent     = TYPE_PC_MACHINE, \\</span></span>
<span class="line"><span>        .class_init = pc_machine_##suffix##_class_init, \\</span></span>
<span class="line"><span>    }; \\</span></span>
<span class="line"><span>    static void pc_machine_init_##suffix(void) \\</span></span>
<span class="line"><span>    { \\</span></span>
<span class="line"><span>        type_register(&amp;pc_machine_type_##suffix); \\</span></span>
<span class="line"><span>    } \\</span></span>
<span class="line"><span>    type_init(pc_machine_init_##suffix)</span></span></code></pre></div><p>为了定义machine_class，这里有一系列的宏定义。入口是DEFINE_I440FX_MACHINE。这个宏有几个参数，v4_0是后缀，&quot;pc-i440fx-4.0&quot;是名字，pc_i440fx_4_0_machine_options是一个函数，用于定义machine_class相关的选项。这个函数定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void pc_i440fx_4_0_machine_options(MachineClass *m)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    pc_i440fx_machine_options(m);</span></span>
<span class="line"><span>    m-&amp;gt;alias = &quot;pc&quot;;</span></span>
<span class="line"><span>    m-&amp;gt;is_default = 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void pc_i440fx_machine_options(MachineClass *m)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    PCMachineClass *pcmc = PC_MACHINE_CLASS(m);</span></span>
<span class="line"><span>    pcmc-&amp;gt;default_nic_model = &quot;e1000&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    m-&amp;gt;family = &quot;pc_piix&quot;;</span></span>
<span class="line"><span>    m-&amp;gt;desc = &quot;Standard PC (i440FX + PIIX, 1996)&quot;;</span></span>
<span class="line"><span>    m-&amp;gt;default_machine_opts = &quot;firmware=bios-256k.bin&quot;;</span></span>
<span class="line"><span>    m-&amp;gt;default_display = &quot;std&quot;;</span></span>
<span class="line"><span>    machine_class_allow_dynamic_sysbus_dev(m, TYPE_RAMFB_DEVICE);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们先不看pc_i440fx_4_0_machine_options，先来看DEFINE_I440FX_MACHINE。</p><p>这里面定义了一个pc_init_##suffix，也就是pc_init_v4_0。这里面转而调用pc_init1。注意这里这个函数只是定义了一下，没有被调用。</p><p>接下来，DEFINE_I440FX_MACHINE里面又定义了DEFINE_PC_MACHINE。它有四个参数，除了DEFINE_I440FX_MACHINE传进来的三个参数以外，多了一个initfn，也即初始化函数，指向刚才定义的pc_init_##suffix。</p><p>在DEFINE_PC_MACHINE中，我们定义了一个函数pc_machine_##suffix## <em>class_init。从函数的名字class_init可以看出，这是machine_class从纸面上的class初始化为Class对象的方法。在这个函数里面，我们可以看到，它创建了一个MachineClass对象，这个就是Class对象。MachineClass对象的init函数指向上面定义的pc_init</em>##suffix，说明这个函数是machine这种类型初始化的一个函数，后面会被调用。</p><p>接着，我们看DEFINE_PC_MACHINE。它定义了一个pc_machine_type_##suffix的TypeInfo。这是用于生成纸面上的class的原材料，果真后面调用了type_init。</p><p>看到了type_init，我们应该能够想到，既然它定义了一个纸面上的class，那上面的那句module_call_init，会和我们上面解析的type_init是一样的，在全局的表里面注册了一个全局的名字是&quot;pc-i440fx-4.0&quot;的纸面上的class，也即TypeImpl。</p><p>现在全局表中有这个纸面上的class了。我们回到select_machine。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static MachineClass *select_machine(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MachineClass *machine_class = find_default_machine();</span></span>
<span class="line"><span>    const char *optarg;</span></span>
<span class="line"><span>    QemuOpts *opts;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    opts = qemu_get_machine_opts();</span></span>
<span class="line"><span>    qemu_opts_loc_restore(opts);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    optarg = qemu_opt_get(opts, &quot;type&quot;);</span></span>
<span class="line"><span>    if (optarg) {</span></span>
<span class="line"><span>        machine_class = machine_parse(optarg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return machine_class;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MachineClass *find_default_machine(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GSList *el, *machines = object_class_get_list(TYPE_MACHINE, false);</span></span>
<span class="line"><span>    MachineClass *mc = NULL;</span></span>
<span class="line"><span>    for (el = machines; el; el = el-&amp;gt;next) {</span></span>
<span class="line"><span>        MachineClass *temp = el-&amp;gt;data;</span></span>
<span class="line"><span>        if (temp-&amp;gt;is_default) {</span></span>
<span class="line"><span>            mc = temp;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    g_slist_free(machines);</span></span>
<span class="line"><span>    return mc;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static MachineClass *machine_parse(const char *name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MachineClass *mc = NULL;</span></span>
<span class="line"><span>    GSList *el, *machines = object_class_get_list(TYPE_MACHINE, false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (name) {</span></span>
<span class="line"><span>        mc = find_machine(name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (mc) {</span></span>
<span class="line"><span>        g_slist_free(machines);</span></span>
<span class="line"><span>        return mc;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在select_machine中，有两种方式可以生成MachineClass。一种方式是find_default_machine，找一个默认的；另一种方式是machine_parse，通过解析参数生成MachineClass。无论哪种方式，都会调用object_class_get_list获得一个MachineClass的列表，然后在里面找。object_class_get_list定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GSList *object_class_get_list(const char *implements_type,</span></span>
<span class="line"><span>                              bool include_abstract)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GSList *list = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    object_class_foreach(object_class_get_list_tramp,</span></span>
<span class="line"><span>                         implements_type, include_abstract, &amp;list);</span></span>
<span class="line"><span>    return list;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void object_class_foreach(void (*fn)(ObjectClass *klass, void *opaque), const char *implements_type, bool include_abstract,</span></span>
<span class="line"><span>                          void *opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    OCFData data = { fn, implements_type, include_abstract, opaque };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    enumerating_types = true;</span></span>
<span class="line"><span>    g_hash_table_foreach(type_table_get(), object_class_foreach_tramp, &amp;data);</span></span>
<span class="line"><span>    enumerating_types = false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在全局表type_table_get()中，对于每一项TypeImpl，我们都执行object_class_foreach_tramp。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void object_class_foreach_tramp(gpointer key, gpointer value,</span></span>
<span class="line"><span>                                       gpointer opaque)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    OCFData *data = opaque;</span></span>
<span class="line"><span>    TypeImpl *type = value;</span></span>
<span class="line"><span>    ObjectClass *k;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    type_initialize(type);</span></span>
<span class="line"><span>    k = type-&amp;gt;class;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    data-&amp;gt;fn(k, data-&amp;gt;opaque);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void type_initialize(TypeImpl *ti)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TypeImpl *parent;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ti-&amp;gt;class_size = type_class_get_size(ti);</span></span>
<span class="line"><span>    ti-&amp;gt;instance_size = type_object_get_size(ti);</span></span>
<span class="line"><span>    if (ti-&amp;gt;instance_size == 0) {</span></span>
<span class="line"><span>        ti-&amp;gt;abstract = true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ti-&amp;gt;class = g_malloc0(ti-&amp;gt;class_size);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ti-&amp;gt;class-&amp;gt;type = ti;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (parent) {</span></span>
<span class="line"><span>        if (parent-&amp;gt;class_base_init) {</span></span>
<span class="line"><span>            parent-&amp;gt;class_base_init(ti-&amp;gt;class, ti-&amp;gt;class_data);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        parent = type_get_parent(parent);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (ti-&amp;gt;class_init) {</span></span>
<span class="line"><span>        ti-&amp;gt;class_init(ti-&amp;gt;class, ti-&amp;gt;class_data);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在object_class_foreach_tramp中，会调用将type_initialize，这里面会调用class_init将纸面上的class也即TypeImpl变为ObjectClass，ObjectClass是所有Class类的祖先，MachineClass是它的子类。</p><p>因为在machine的命令行里面，我们指定了名字为&quot;pc-i440fx-4.0&quot;，就肯定能够找到我们注册过了的TypeImpl，并调用它的class_init函数。</p><p>因而pc_machine_##suffix## <em>class_init会被调用，在这里面，pc_i440fx_machine_options才真正被调用初始化MachineClass，并且将MachineClass的init函数设置为pc_init</em>##suffix。也即，当select_machine执行完毕后，就有一个MachineClass了。</p><p>接着，我们回到object_new。这就很好理解了，MachineClass是一个Class类，接下来应该通过它生成一个Instance，也即对象，这就是object_new的作用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Object *object_new(const char *typename)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TypeImpl *ti = type_get_by_name(typename);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return object_new_with_type(ti);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static Object *object_new_with_type(Type type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Object *obj;</span></span>
<span class="line"><span>    type_initialize(type);</span></span>
<span class="line"><span>    obj = g_malloc(type-&amp;gt;instance_size);</span></span>
<span class="line"><span>    object_initialize_with_type(obj, type-&amp;gt;instance_size, type);</span></span>
<span class="line"><span>    obj-&amp;gt;free = g_free;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return obj;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>object_new中，TypeImpl的instance_init会被调用，创建一个对象。current_machine就是这个对象，它的类型是MachineState。</p><p>至此，绕了这么大一圈，有关体系结构的对象才创建完毕，接下来很多的设备的初始化，包括CPU和内存的初始化，都是围绕着体系结构的对象来的，后面我们会常常看到current_machine。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节，我们学到，虚拟机对于设备的模拟是一件非常复杂的事情，需要用复杂的参数模拟各种各样的设备。为了能够适配这些设备，qemu定义了自己的模块管理机制，只有了解了这种机制，后面看每一种设备的虚拟化的时候，才有一个整体的思路。</p><p>这里的MachineClass是我们遇到的第一个，我们需要掌握它里面各种定义之间的关系。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109335/078dc698ef1b3df93ee9569e55ea2f30.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109335/078dc698ef1b3df93ee9569e55ea2f30.png" alt=""></a></p><p>每个模块都会有一个定义TypeInfo，会通过type_init变为全局的TypeImpl。TypeInfo以及生成的TypeImpl有以下成员：</p><ul><li>name表示当前类型的名称</li><li>parent表示父类的名称</li><li>class_init用于将TypeImpl初始化为MachineClass</li><li>instance_init用于将MachineClass初始化为MachineState</li></ul><p>所以，以后遇到任何一个类型的时候，将父类和子类之间的关系，以及对应的初始化函数都要看好，这样就一目了然了。</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>你可能会问，这么复杂的qemu命令，我是怎么找到的，当然不是我一个字一个字打的，这是著名的云平台管理软件OpenStack创建虚拟机的时候自动生成的命令行。所以，给你留一道课堂练习题，请你看一下OpenStack的基本原理，看它是通过什么工具来管理如此复杂的命令行的。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>`,72)])])}const u=n(i,[["render",l]]);export{r as __pageData,u as default};
