import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"51 | 计算虚拟化之CPU（下）：如何复用集团的人力资源？","description":"","frontmatter":{},"headers":[{"level":2,"title":"4.初始化块设备","slug":"_4-初始化块设备","link":"#_4-初始化块设备","children":[]},{"level":2,"title":"5.初始化计算虚拟化的加速模式","slug":"_5-初始化计算虚拟化的加速模式","link":"#_5-初始化计算虚拟化的加速模式","children":[]},{"level":2,"title":"6.初始化网络设备","slug":"_6-初始化网络设备","link":"#_6-初始化网络设备","children":[]},{"level":2,"title":"7.CPU虚拟化","slug":"_7-cpu虚拟化","link":"#_7-cpu虚拟化","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/51-计算虚拟化之CPU（下）：如何复用集团的人力资源？.md","filePath":"趣谈Linux操作系统/51-计算虚拟化之CPU（下）：如何复用集团的人力资源？.md","lastUpdated":1779822193000}'),l={name:"趣谈Linux操作系统/51-计算虚拟化之CPU（下）：如何复用集团的人力资源？.md"};function t(c,s,i,_,o,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_51-计算虚拟化之cpu-下-如何复用集团的人力资源" tabindex="-1">51 | 计算虚拟化之CPU（下）：如何复用集团的人力资源？ <a class="header-anchor" href="#_51-计算虚拟化之cpu-下-如何复用集团的人力资源" aria-label="Permalink to &quot;51 | 计算虚拟化之CPU（下）：如何复用集团的人力资源？&quot;">​</a></h1><p>上一节qemu初始化的main函数，我们解析了一个开头，得到了表示体系结构的MachineClass以及MachineState。</p><h2 id="_4-初始化块设备" tabindex="-1">4.初始化块设备 <a class="header-anchor" href="#_4-初始化块设备" aria-label="Permalink to &quot;4.初始化块设备&quot;">​</a></h2><p>我们接着回到main函数，接下来初始化的是块设备，调用的是configure_blockdev。这里我们需要重点关注上面参数中的硬盘，不过我们放在存储虚拟化那一节再解析。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>configure_blockdev(&amp;bdo_queue, machine_class, snapshot);</span></span></code></pre></div><h2 id="_5-初始化计算虚拟化的加速模式" tabindex="-1">5.初始化计算虚拟化的加速模式 <a class="header-anchor" href="#_5-初始化计算虚拟化的加速模式" aria-label="Permalink to &quot;5.初始化计算虚拟化的加速模式&quot;">​</a></h2><p>接下来初始化的是计算虚拟化的加速模式，也即要不要使用KVM。根据参数中的配置是启用KVM。这里调用的是configure_accelerator。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>configure_accelerator(current_machine, argv[0]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void configure_accelerator(MachineState *ms, const char *progname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    const char *accel;</span></span>
<span class="line"><span>    char **accel_list, **tmp;</span></span>
<span class="line"><span>    int ret;</span></span>
<span class="line"><span>    bool accel_initialised = false;</span></span>
<span class="line"><span>    bool init_failed = false;</span></span>
<span class="line"><span>    AccelClass *acc = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    accel = qemu_opt_get(qemu_get_machine_opts(), &quot;accel&quot;);</span></span>
<span class="line"><span>    accel = &quot;kvm&quot;;</span></span>
<span class="line"><span>    accel_list = g_strsplit(accel, &quot;:&quot;, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (tmp = accel_list; !accel_initialised &amp;&amp; tmp &amp;&amp; *tmp; tmp++) {</span></span>
<span class="line"><span>        acc = accel_find(*tmp);</span></span>
<span class="line"><span>        ret = accel_init_machine(acc, ms);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static AccelClass *accel_find(const char *opt_name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    char *class_name = g_strdup_printf(ACCEL_CLASS_NAME(&quot;%s&quot;), opt_name);</span></span>
<span class="line"><span>    AccelClass *ac = ACCEL_CLASS(object_class_by_name(class_name));</span></span>
<span class="line"><span>    g_free(class_name);</span></span>
<span class="line"><span>    return ac;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int accel_init_machine(AccelClass *acc, MachineState *ms)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ObjectClass *oc = OBJECT_CLASS(acc);</span></span>
<span class="line"><span>    const char *cname = object_class_get_name(oc);</span></span>
<span class="line"><span>    AccelState *accel = ACCEL(object_new(cname));</span></span>
<span class="line"><span>    int ret;</span></span>
<span class="line"><span>    ms-&amp;gt;accelerator = accel;</span></span>
<span class="line"><span>    *(acc-&amp;gt;allowed) = true;</span></span>
<span class="line"><span>    ret = acc-&amp;gt;init_machine(ms);</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在configure_accelerator中，我们看命令行参数里面的accel，发现是kvm，则调用accel_find根据名字，得到相应的纸面上的class，并初始化为Class类。</p><p>MachineClass是计算机体系结构的Class类，同理，AccelClass就是加速器的Class类，然后调用accel_init_machine，通过object_new，将AccelClass这个Class类实例化为AccelState，类似对于体系结构的实例是MachineState。</p><p>在accel_find中，我们会根据名字kvm，找到纸面上的class，也即kvm_accel_type，然后调用type_initialize，里面调用kvm_accel_type的class_init方法，也即kvm_accel_class_init。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void kvm_accel_class_init(ObjectClass *oc, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AccelClass *ac = ACCEL_CLASS(oc);</span></span>
<span class="line"><span>    ac-&amp;gt;name = &quot;KVM&quot;;</span></span>
<span class="line"><span>    ac-&amp;gt;init_machine = kvm_init;</span></span>
<span class="line"><span>    ac-&amp;gt;allowed = &amp;kvm_allowed;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在kvm_accel_class_init中，我们创建AccelClass，将init_machine设置为kvm_init。在accel_init_machine中其实就调用了这个init_machine函数，也即调用kvm_init方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int kvm_init(MachineState *ms)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MachineClass *mc = MACHINE_GET_CLASS(ms);</span></span>
<span class="line"><span>    int soft_vcpus_limit, hard_vcpus_limit;</span></span>
<span class="line"><span>    KVMState *s;</span></span>
<span class="line"><span>    const KVMCapabilityInfo *missing_cap;</span></span>
<span class="line"><span>    int ret;</span></span>
<span class="line"><span>    int type = 0;</span></span>
<span class="line"><span>    const char *kvm_type;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    s = KVM_STATE(ms-&amp;gt;accelerator);</span></span>
<span class="line"><span>    s-&amp;gt;fd = qemu_open(&quot;/dev/kvm&quot;, O_RDWR);</span></span>
<span class="line"><span>    ret = kvm_ioctl(s, KVM_GET_API_VERSION, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        ret = kvm_ioctl(s, KVM_CREATE_VM, type);</span></span>
<span class="line"><span>    } while (ret == -EINTR);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    s-&amp;gt;vmfd = ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* check the vcpu limits */</span></span>
<span class="line"><span>    soft_vcpus_limit = kvm_recommended_vcpus(s);</span></span>
<span class="line"><span>    hard_vcpus_limit = kvm_max_vcpus(s);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ret = kvm_arch_init(ms, s);</span></span>
<span class="line"><span>    if (ret &amp;lt; 0) {</span></span>
<span class="line"><span>        goto err;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (machine_kernel_irqchip_allowed(ms)) {</span></span>
<span class="line"><span>        kvm_irqchip_create(ms, s);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里面的操作就从用户态到内核态的KVM了。就像前面原理讲过的一样，用户态使用内核态KVM的能力，需要打开一个文件/dev/kvm，这是一个字符设备文件，打开一个字符设备文件的过程我们讲过，这里不再赘述。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct miscdevice kvm_dev = {</span></span>
<span class="line"><span>    KVM_MINOR,</span></span>
<span class="line"><span>    &quot;kvm&quot;,</span></span>
<span class="line"><span>    &amp;kvm_chardev_ops,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file_operations kvm_chardev_ops = {</span></span>
<span class="line"><span>    .unlocked_ioctl = kvm_dev_ioctl,</span></span>
<span class="line"><span>    .compat_ioctl   = kvm_dev_ioctl,</span></span>
<span class="line"><span>    .llseek     = noop_llseek,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>KVM这个字符设备文件定义了一个字符设备文件的操作函数kvm_chardev_ops，这里面只定义了ioctl的操作。</p><p>接下来，用户态就通过ioctl系统调用，调用到kvm_dev_ioctl这个函数。这个过程我们在 <a href="https://time.geekbang.org/column/article/100068" target="_blank" rel="noreferrer">字符设备</a> 那一节也讲了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static long kvm_dev_ioctl(struct file *filp,</span></span>
<span class="line"><span>              unsigned int ioctl, unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    long r = -EINVAL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    switch (ioctl) {</span></span>
<span class="line"><span>    case KVM_GET_API_VERSION:</span></span>
<span class="line"><span>        r = KVM_API_VERSION;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case KVM_CREATE_VM:</span></span>
<span class="line"><span>        r = kvm_dev_ioctl_create_vm(arg);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case KVM_CHECK_EXTENSION:</span></span>
<span class="line"><span>        r = kvm_vm_ioctl_check_extension_generic(NULL, arg);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case KVM_GET_VCPU_MMAP_SIZE:</span></span>
<span class="line"><span>        r = PAGE_SIZE;     /* struct kvm_run */</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>    return r;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到，在用户态qemu中，调用KVM_GET_API_VERSION查看版本号，内核就有相应的分支，返回版本号，如果能够匹配上，则调用KVM_CREATE_VM创建虚拟机。</p><p>创建虚拟机，需要调用kvm_dev_ioctl_create_vm。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int kvm_dev_ioctl_create_vm(unsigned long type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int r;</span></span>
<span class="line"><span>    struct kvm *kvm;</span></span>
<span class="line"><span>    struct file *file;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    kvm = kvm_create_vm(type);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    r = get_unused_fd_flags(O_CLOEXEC);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    file = anon_inode_getfile(&quot;kvm-vm&quot;, &amp;kvm_vm_fops, kvm, O_RDWR);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    fd_install(r, file);</span></span>
<span class="line"><span>    return r;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在kvm_dev_ioctl_create_vm中，首先调用kvm_create_vm创建一个struct kvm结构。这个结构在内核里面代表一个虚拟机。</p><p>从下面结构的定义里，我们可以看到，这里面有vcpu，有mm_struct结构。这个结构本来用来管理进程的内存的。虚拟机也是一个进程，所以虚拟机的用户进程空间也是用它来表示。虚拟机里面的操作系统以及应用的进程空间不归它管。</p><p>在kvm_dev_ioctl_create_vm中，第二件事情就是创建一个文件描述符，和struct file关联起来，这个struct file的file_operations会被设置为kvm_vm_fops。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct kvm {</span></span>
<span class="line"><span>	struct mm_struct *mm; /* userspace tied to this vm */</span></span>
<span class="line"><span>	struct kvm_memslots __rcu *memslots[KVM_ADDRESS_SPACE_NUM];</span></span>
<span class="line"><span>	struct kvm_vcpu *vcpus[KVM_MAX_VCPUS];</span></span>
<span class="line"><span>	atomic_t online_vcpus;</span></span>
<span class="line"><span>	int created_vcpus;</span></span>
<span class="line"><span>	int last_boosted_vcpu;</span></span>
<span class="line"><span>	struct list_head vm_list;</span></span>
<span class="line"><span>	struct mutex lock;</span></span>
<span class="line"><span>	struct kvm_io_bus __rcu *buses[KVM_NR_BUSES];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	struct kvm_vm_stat stat;</span></span>
<span class="line"><span>	struct kvm_arch arch;</span></span>
<span class="line"><span>	refcount_t users_count;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	long tlbs_dirty;</span></span>
<span class="line"><span>	struct list_head devices;</span></span>
<span class="line"><span>	pid_t userspace_pid;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct file_operations kvm_vm_fops = {</span></span>
<span class="line"><span>	.release        = kvm_vm_release,</span></span>
<span class="line"><span>	.unlocked_ioctl = kvm_vm_ioctl,</span></span>
<span class="line"><span>	.llseek		= noop_llseek,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>kvm_dev_ioctl_create_vm结束之后，对于一台虚拟机而言，只是在内核中有一个数据结构，对于相应的资源还没有分配，所以我们还需要接着看。</p><h2 id="_6-初始化网络设备" tabindex="-1">6.初始化网络设备 <a class="header-anchor" href="#_6-初始化网络设备" aria-label="Permalink to &quot;6.初始化网络设备&quot;">​</a></h2><p>接下来，调用net_init_clients进行网络设备的初始化。我们可以解析net参数，也会在net_init_clients中解析netdev参数。这属于网络虚拟化的部分，我们先暂时放一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int net_init_clients(Error **errp)</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><h2 id="_7-cpu虚拟化" tabindex="-1">7.CPU虚拟化 <a class="header-anchor" href="#_7-cpu虚拟化" aria-label="Permalink to &quot;7.CPU虚拟化&quot;">​</a></h2><p>接下来，我们要调用machine_run_board_init。这里面调用了MachineClass的init函数。盼啊盼才到了它，这才调用了pc_init1。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void machine_run_board_init(MachineState *machine)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MachineClass *machine_class = MACHINE_GET_CLASS(machine);</span></span>
<span class="line"><span>    numa_complete_configuration(machine);</span></span>
<span class="line"><span>    if (nb_numa_nodes) {</span></span>
<span class="line"><span>        machine_numa_finish_cpu_init(machine);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    machine_class-&amp;gt;init(machine);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在pc_init1里面，我们重点关注两件重要的事情，一个的CPU的虚拟化，主要调用pc_cpus_init；另外就是内存的虚拟化，主要调用pc_memory_init。这一节我们重点关注CPU的虚拟化，下一节，我们来看内存的虚拟化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void pc_cpus_init(PCMachineState *pcms)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; smp_cpus; i++) {</span></span>
<span class="line"><span>        pc_new_cpu(possible_cpus-&amp;gt;cpus[i].type, possible_cpus-&amp;gt;cpus[i].arch_id, &amp;error_fatal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void pc_new_cpu(const char *typename, int64_t apic_id, Error **errp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Object *cpu = NULL;</span></span>
<span class="line"><span>    cpu = object_new(typename);</span></span>
<span class="line"><span>    object_property_set_uint(cpu, apic_id, &quot;apic-id&quot;, &amp;local_err);</span></span>
<span class="line"><span>    object_property_set_bool(cpu, true, &quot;realized&quot;, &amp;local_err);//调用 object_property_add_bool的时候，设置了用 device_set_realized 来设置</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在pc_cpus_init中，对于每一个CPU，都调用pc_new_cpu，在这里，我们又看到了object_new，这又是一个从TypeImpl到Class类再到对象的一个过程。</p><p>这个时候，我们就要看CPU的类是怎么组织的了。</p><p>在上面的参数里面，CPU的配置是这样的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-cpu SandyBridge,+erms,+smep,+fsgsbase,+pdpe1gb,+rdrand,+f16c,+osxsave,+dca,+pcid,+pdcm,+xtpr,+tm2,+est,+smx,+vmx,+ds_cpl,+monitor,+dtes64,+pbe,+tm,+ht,+ss,+acpi,+ds,+vme</span></span></code></pre></div><p>在这里我们知道，SandyBridge是CPU的一种类型。在hw/i386/pc.c中，我们能看到这种CPU的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{ &quot;SandyBridge&quot; &quot;-&quot; TYPE_X86_CPU, &quot;min-xlevel&quot;, &quot;0x8000000a&quot; }</span></span></code></pre></div><p>接下来，我们就来看&quot;SandyBridge&quot;，也即TYPE_X86_CPU这种CPU的类，是一个什么样的结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static const TypeInfo device_type_info = {</span></span>
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
<span class="line"><span>static const TypeInfo cpu_type_info = {</span></span>
<span class="line"><span>    .name = TYPE_CPU,</span></span>
<span class="line"><span>    .parent = TYPE_DEVICE,</span></span>
<span class="line"><span>    .instance_size = sizeof(CPUState),</span></span>
<span class="line"><span>    .instance_init = cpu_common_initfn,</span></span>
<span class="line"><span>    .instance_finalize = cpu_common_finalize,</span></span>
<span class="line"><span>    .abstract = true,</span></span>
<span class="line"><span>    .class_size = sizeof(CPUClass),</span></span>
<span class="line"><span>    .class_init = cpu_class_init,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static const TypeInfo x86_cpu_type_info = {</span></span>
<span class="line"><span>    .name = TYPE_X86_CPU,</span></span>
<span class="line"><span>    .parent = TYPE_CPU,</span></span>
<span class="line"><span>    .instance_size = sizeof(X86CPU),</span></span>
<span class="line"><span>    .instance_init = x86_cpu_initfn,</span></span>
<span class="line"><span>    .abstract = true,</span></span>
<span class="line"><span>    .class_size = sizeof(X86CPUClass),</span></span>
<span class="line"><span>    .class_init = x86_cpu_common_class_init,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>CPU这种类的定义是有多层继承关系的。TYPE_X86_CPU的父类是TYPE_CPU，TYPE_CPU的父类是TYPE_DEVICE，TYPE_DEVICE的父类是TYPE_OBJECT。到头了。</p><p>这里面每一层都有class_init，用于从TypeImpl生产xxxClass，也有instance_init将xxxClass初始化为实例。</p><p>在TYPE_X86_CPU这一层的class_init中，也即x86_cpu_common_class_init中，设置了DeviceClass的realize函数为x86_cpu_realizefn。这个函数很重要，马上就能用到。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void x86_cpu_common_class_init(ObjectClass *oc, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    X86CPUClass *xcc = X86_CPU_CLASS(oc);</span></span>
<span class="line"><span>    CPUClass *cc = CPU_CLASS(oc);</span></span>
<span class="line"><span>    DeviceClass *dc = DEVICE_CLASS(oc);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    device_class_set_parent_realize(dc, x86_cpu_realizefn,</span></span>
<span class="line"><span>                                    &amp;xcc-&amp;gt;parent_realize);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在TYPE_DEVICE这一层的instance_init函数device_initfn，会为这个设备添加一个属性&quot;realized&quot;，要设置这个属性，需要用函数device_set_realized。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void device_initfn(Object *obj)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    DeviceState *dev = DEVICE(obj);</span></span>
<span class="line"><span>    ObjectClass *class;</span></span>
<span class="line"><span>    Property *prop;</span></span>
<span class="line"><span>    dev-&amp;gt;realized = false;</span></span>
<span class="line"><span>    object_property_add_bool(obj, &quot;realized&quot;,</span></span>
<span class="line"><span>                             device_get_realized, device_set_realized, NULL);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们回到pc_new_cpu函数，这里面就是通过object_property_set_bool设置这个属性为true，所以device_set_realized函数会被调用。</p><p>在device_set_realized中，DeviceClass的realize函数x86_cpu_realizefn会被调用。这里面qemu_init_vcpu会调用qemu_kvm_start_vcpu。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void qemu_kvm_start_vcpu(CPUState *cpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    char thread_name[VCPU_THREAD_NAME_SIZE];</span></span>
<span class="line"><span>    cpu-&amp;gt;thread = g_malloc0(sizeof(QemuThread));</span></span>
<span class="line"><span>    cpu-&amp;gt;halt_cond = g_malloc0(sizeof(QemuCond));</span></span>
<span class="line"><span>    qemu_cond_init(cpu-&amp;gt;halt_cond);</span></span>
<span class="line"><span>    qemu_thread_create(cpu-&amp;gt;thread, thread_name, qemu_kvm_cpu_thread_fn, cpu, QEMU_THREAD_JOINABLE);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，为这个vcpu创建一个线程，也即虚拟机里面的一个vcpu对应物理机上的一个线程，然后这个线程被调度到某个物理CPU上。</p><p>我们来看这个vcpu的线程执行函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void *qemu_kvm_cpu_thread_fn(void *arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    CPUState *cpu = arg;</span></span>
<span class="line"><span>    int r;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    rcu_register_thread();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    qemu_mutex_lock_iothread();</span></span>
<span class="line"><span>    qemu_thread_get_self(cpu-&amp;gt;thread);</span></span>
<span class="line"><span>    cpu-&amp;gt;thread_id = qemu_get_thread_id();</span></span>
<span class="line"><span>    cpu-&amp;gt;can_do_io = 1;</span></span>
<span class="line"><span>    current_cpu = cpu;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    r = kvm_init_vcpu(cpu);</span></span>
<span class="line"><span>    kvm_init_cpu_signals(cpu);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* signal CPU creation */</span></span>
<span class="line"><span>    cpu-&amp;gt;created = true;</span></span>
<span class="line"><span>    qemu_cond_signal(&amp;qemu_cpu_cond);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        if (cpu_can_run(cpu)) {</span></span>
<span class="line"><span>            r = kvm_cpu_exec(cpu);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        qemu_wait_io_event(cpu);</span></span>
<span class="line"><span>    } while (!cpu-&amp;gt;unplug || cpu_can_run(cpu));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    qemu_kvm_destroy_vcpu(cpu);</span></span>
<span class="line"><span>    cpu-&amp;gt;created = false;</span></span>
<span class="line"><span>    qemu_cond_signal(&amp;qemu_cpu_cond);</span></span>
<span class="line"><span>    qemu_mutex_unlock_iothread();</span></span>
<span class="line"><span>    rcu_unregister_thread();</span></span>
<span class="line"><span>    return NULL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在qemu_kvm_cpu_thread_fn中，先是kvm_init_vcpu初始化这个vcpu。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int kvm_init_vcpu(CPUState *cpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KVMState *s = kvm_state;</span></span>
<span class="line"><span>    long mmap_size;</span></span>
<span class="line"><span>    int ret;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ret = kvm_get_vcpu(s, kvm_arch_vcpu_id(cpu));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    cpu-&amp;gt;kvm_fd = ret;</span></span>
<span class="line"><span>    cpu-&amp;gt;kvm_state = s;</span></span>
<span class="line"><span>    cpu-&amp;gt;vcpu_dirty = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mmap_size = kvm_ioctl(s, KVM_GET_VCPU_MMAP_SIZE, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    cpu-&amp;gt;kvm_run = mmap(NULL, mmap_size, PROT_READ | PROT_WRITE, MAP_SHARED, cpu-&amp;gt;kvm_fd, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    ret = kvm_arch_init_vcpu(cpu);</span></span>
<span class="line"><span>err:</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在kvm_get_vcpu中，我们会调用kvm_vm_ioctl(s, KVM_CREATE_VCPU, (void *)vcpu_id)，在内核里面创建一个vcpu。在上面创建KVM_CREATE_VM的时候，我们已经创建了一个struct file，它的file_operations被设置为kvm_vm_fops，这个内核文件也是可以响应ioctl的。</p><p>如果我们切换到内核KVM，在kvm_vm_ioctl函数中，有对于KVM_CREATE_VCPU的处理，调用的是kvm_vm_ioctl_create_vcpu。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static long kvm_vm_ioctl(struct file *filp,</span></span>
<span class="line"><span>			   unsigned int ioctl, unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kvm *kvm = filp-&amp;gt;private_data;</span></span>
<span class="line"><span>	void __user *argp = (void __user *)arg;</span></span>
<span class="line"><span>	int r;</span></span>
<span class="line"><span>	switch (ioctl) {</span></span>
<span class="line"><span>	case KVM_CREATE_VCPU:</span></span>
<span class="line"><span>		r = kvm_vm_ioctl_create_vcpu(kvm, arg);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	case KVM_SET_USER_MEMORY_REGION: {</span></span>
<span class="line"><span>		struct kvm_userspace_memory_region kvm_userspace_mem;</span></span>
<span class="line"><span>		if (copy_from_user(&amp;kvm_userspace_mem, argp,</span></span>
<span class="line"><span>						sizeof(kvm_userspace_mem)))</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span>		r = kvm_vm_ioctl_set_memory_region(kvm, &amp;kvm_userspace_mem);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	case KVM_CREATE_DEVICE: {</span></span>
<span class="line"><span>		struct kvm_create_device cd;</span></span>
<span class="line"><span>		if (copy_from_user(&amp;cd, argp, sizeof(cd)))</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span>		r = kvm_ioctl_create_device(kvm, &amp;cd);</span></span>
<span class="line"><span>		if (copy_to_user(argp, &amp;cd, sizeof(cd)))</span></span>
<span class="line"><span>			goto out;</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	case KVM_CHECK_EXTENSION:</span></span>
<span class="line"><span>		r = kvm_vm_ioctl_check_extension_generic(kvm, arg);</span></span>
<span class="line"><span>		break;</span></span>
<span class="line"><span>	default:</span></span>
<span class="line"><span>		r = kvm_arch_vm_ioctl(filp, ioctl, arg);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>out:</span></span>
<span class="line"><span>	return r;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在kvm_vm_ioctl_create_vcpu中，kvm_arch_vcpu_create调用kvm_x86_ops的vcpu_create函数来创建CPU。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int kvm_vm_ioctl_create_vcpu(struct kvm *kvm, u32 id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int r;</span></span>
<span class="line"><span>    struct kvm_vcpu *vcpu;</span></span>
<span class="line"><span>    kvm-&amp;gt;created_vcpus++;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    vcpu = kvm_arch_vcpu_create(kvm, id);</span></span>
<span class="line"><span>    preempt_notifier_init(&amp;vcpu-&amp;gt;preempt_notifier, &amp;kvm_preempt_ops);</span></span>
<span class="line"><span>    r = kvm_arch_vcpu_setup(vcpu);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    /* Now it&#39;s all set up, let userspace reach it */</span></span>
<span class="line"><span>    kvm_get_kvm(kvm);</span></span>
<span class="line"><span>    r = create_vcpu_fd(vcpu);</span></span>
<span class="line"><span>    kvm-&amp;gt;vcpus[atomic_read(&amp;kvm-&amp;gt;online_vcpus)] = vcpu;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct kvm_vcpu *kvm_arch_vcpu_create(struct kvm *kvm,</span></span>
<span class="line"><span>                        unsigned int id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kvm_vcpu *vcpu;</span></span>
<span class="line"><span>    vcpu = kvm_x86_ops-&amp;gt;vcpu_create(kvm, id);</span></span>
<span class="line"><span>    return vcpu;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int create_vcpu_fd(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return anon_inode_getfd(&quot;kvm-vcpu&quot;, &amp;kvm_vcpu_fops, vcpu, O_RDWR | O_CLOEXEC);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，create_vcpu_fd又创建了一个struct file，它的file_operations指向kvm_vcpu_fops。从这里可以看出，KVM的内核模块是一个文件，可以通过ioctl进行操作。基于这个内核模块创建的VM也是一个文件，也可以通过ioctl进行操作。在这个VM上创建的vcpu同样是一个文件，同样可以通过ioctl进行操作。</p><p>我们回过头来看，kvm_x86_ops的vcpu_create函数。kvm_x86_ops对于不同的硬件加速虚拟化指向不同的结构，如果是vmx，则指向vmx_x86_ops；如果是svm，则指向svm_x86_ops。我们这里看vmx_x86_ops。这个结构很长，里面有非常多的操作，我们用一个看一个。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct kvm_x86_ops vmx_x86_ops __ro_after_init = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.vcpu_create = vmx_create_vcpu,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct kvm_vcpu *vmx_create_vcpu(struct kvm *kvm, unsigned int id)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int err;</span></span>
<span class="line"><span>    struct vcpu_vmx *vmx = kmem_cache_zalloc(kvm_vcpu_cache, GFP_KERNEL);</span></span>
<span class="line"><span>    int cpu;</span></span>
<span class="line"><span>    vmx-&amp;gt;vpid = allocate_vpid();</span></span>
<span class="line"><span>    err = kvm_vcpu_init(&amp;vmx-&amp;gt;vcpu, kvm, id);</span></span>
<span class="line"><span>    vmx-&amp;gt;guest_msrs = kmalloc(PAGE_SIZE, GFP_KERNEL);</span></span>
<span class="line"><span>    vmx-&amp;gt;loaded_vmcs = &amp;vmx-&amp;gt;vmcs01;</span></span>
<span class="line"><span>    vmx-&amp;gt;loaded_vmcs-&amp;gt;vmcs = alloc_vmcs();</span></span>
<span class="line"><span>    vmx-&amp;gt;loaded_vmcs-&amp;gt;shadow_vmcs = NULL;</span></span>
<span class="line"><span>    loaded_vmcs_init(vmx-&amp;gt;loaded_vmcs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cpu = get_cpu();</span></span>
<span class="line"><span>    vmx_vcpu_load(&amp;vmx-&amp;gt;vcpu, cpu);</span></span>
<span class="line"><span>    vmx-&amp;gt;vcpu.cpu = cpu;</span></span>
<span class="line"><span>    err = vmx_vcpu_setup(vmx);</span></span>
<span class="line"><span>    vmx_vcpu_put(&amp;vmx-&amp;gt;vcpu);</span></span>
<span class="line"><span>    put_cpu();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (enable_ept) {</span></span>
<span class="line"><span>        if (!kvm-&amp;gt;arch.ept_identity_map_addr)</span></span>
<span class="line"><span>            kvm-&amp;gt;arch.ept_identity_map_addr =</span></span>
<span class="line"><span>                VMX_EPT_IDENTITY_PAGETABLE_ADDR;</span></span>
<span class="line"><span>        err = init_rmode_identity_map(kvm);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return &amp;vmx-&amp;gt;vcpu;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>vmx_create_vcpu创建用于表示vcpu的结构struct vcpu_vmx，并填写里面的内容。例如guest_msrs，咱们在讲系统调用的时候提过msr寄存器，虚拟机也需要有这样的寄存器。</p><p>enable_ept是和内存虚拟化相关的，EPT全称Extended Page Table，顾名思义，是优化内存虚拟化的，这个功能我们放到内存的那一节讲。</p><p>最最重要的就是loaded_vmcs了。VMCS是什么呢？它的全称是Virtual Machine Control Structure。它是来干什么呢？</p><p>前面咱们讲进程调度的时候讲过，为了支持进程在CPU上的切换，CPU硬件要求有一个TSS结构，用于保存进程运行时的所有寄存器的状态，进程切换的时候，需要根据TSS恢复寄存器。</p><p>虚拟机也是一个进程，也需要切换，而且切换更加的复杂，可能是两个虚拟机之间切换，也可能是虚拟机切换给内核，虚拟机因为里面还有另一个操作系统，要保存的信息比普通的进程多得多。那就需要有一个结构来保存虚拟机运行的上下文，VMCS就是是Intel实现CPU虚拟化，记录vCPU状态的一个关键数据结构。</p><p>VMCS数据结构主要包含以下信息。</p><ul><li>Guest-state area，即vCPU的状态信息，包括vCPU的基本运行环境，例如寄存器等。</li><li>Host-state area，是物理CPU的状态信息。物理CPU和vCPU之间也会来回切换，所以，VMCS中既要记录vCPU的状态，也要记录物理CPU的状态。</li><li>VM-execution control fields，对vCPU的运行行为进行控制。例如，发生中断怎么办，是否使用EPT（Extended Page Table）功能等。</li></ul><p>接下来，对于VMCS，有两个重要的操作。</p><p>VM-Entry，我们称为从根模式切换到非根模式，也即切换到guest上，这个时候CPU上运行的是虚拟机。VM-Exit我们称为CPU从非根模式切换到根模式，也即从guest切换到宿主机。例如，当要执行一些虚拟机没有权限的敏感指令时。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109904/1ec7600be619221dfac03e6ade67f7dc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109904/1ec7600be619221dfac03e6ade67f7dc.png" alt=""></a></p><p>为了维护这两个动作，VMCS里面还有几项内容：</p><ul><li>VM-exit control fields，对VM Exit的行为进行控制。比如，VM Exit的时候对vCPU来说需要保存哪些MSR寄存器，对于主机CPU来说需要恢复哪些MSR寄存器。</li><li>VM-entry control fields，对VM Entry的行为进行控制。比如，需要保存和恢复哪些MSR寄存器等。</li><li>VM-exit information fields，记录下发生VM Exit发生的原因及一些必要的信息，方便对VM Exit事件进行处理。</li></ul><p>至此，内核准备完毕。</p><p>我们再回到qemu的kvm_init_vcpu函数，这里面除了创建内核中的vcpu结构之外，还通过mmap将内核的vcpu结构，映射到qemu中CPUState的kvm_run中，为什么能用mmap呢，上面咱们不是说过了吗，vcpu也是一个文件。</p><p>我们再回到这个vcpu的线程函数qemu_kvm_cpu_thread_fn，他在执行kvm_init_vcpu创建vcpu之后，接下来是一个do-while循环，也即一直运行，并且通过调用kvm_cpu_exec，运行这个虚拟机。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int kvm_cpu_exec(CPUState *cpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kvm_run *run = cpu-&amp;gt;kvm_run;</span></span>
<span class="line"><span>    int ret, run_ret;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        run_ret = kvm_vcpu_ioctl(cpu, KVM_RUN, 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        switch (run-&amp;gt;exit_reason) {</span></span>
<span class="line"><span>        case KVM_EXIT_IO:</span></span>
<span class="line"><span>            kvm_handle_io(run-&amp;gt;io.port, attrs,</span></span>
<span class="line"><span>                          (uint8_t *)run + run-&amp;gt;io.data_offset,</span></span>
<span class="line"><span>                          run-&amp;gt;io.direction,</span></span>
<span class="line"><span>                          run-&amp;gt;io.size,</span></span>
<span class="line"><span>                          run-&amp;gt;io.count);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case KVM_EXIT_IRQ_WINDOW_OPEN:</span></span>
<span class="line"><span>            ret = EXCP_INTERRUPT;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case KVM_EXIT_SHUTDOWN:</span></span>
<span class="line"><span>            qemu_system_reset_request(SHUTDOWN_CAUSE_GUEST_RESET);</span></span>
<span class="line"><span>            ret = EXCP_INTERRUPT;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case KVM_EXIT_UNKNOWN:</span></span>
<span class="line"><span>            fprintf(stderr, &quot;KVM: unknown exit, hardware reason %&quot; PRIx64 &quot;\\n&quot;,(uint64_t)run-&amp;gt;hw.hardware_exit_reason);</span></span>
<span class="line"><span>            ret = -1;</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        case KVM_EXIT_INTERNAL_ERROR:</span></span>
<span class="line"><span>            ret = kvm_handle_internal_error(cpu, run);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } while (ret == 0);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在kvm_cpu_exec中，我们能看到一个循环，在循环中，kvm_vcpu_ioctl(KVM_RUN)运行这个虚拟机，这个时候CPU进入VM-Entry，也即进入客户机模式。</p><p>如果一直是客户机的操作系统占用这个CPU，则会一直停留在这一行运行，一旦这个调用返回了，就说明CPU进入VM-Exit退出客户机模式，将CPU交还给宿主机。在循环中，我们会对退出的原因exit_reason进行分析处理，因为有了I/O，还有了中断等，做相应的处理。处理完毕之后，再次循环，再次通过VM-Entry，进入客户机模式。如此循环，直到虚拟机正常或者异常退出。</p><p>我们来看kvm_vcpu_ioctl(KVM_RUN)在内核做了哪些事情。</p><p>上面我们也讲了，vcpu在内核也是一个文件，也是通过ioctl进行用户态和内核态通信的，在内核中，调用的是kvm_vcpu_ioctl。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static long kvm_vcpu_ioctl(struct file *filp,</span></span>
<span class="line"><span>               unsigned int ioctl, unsigned long arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct kvm_vcpu *vcpu = filp-&amp;gt;private_data;</span></span>
<span class="line"><span>    void __user *argp = (void __user *)arg;</span></span>
<span class="line"><span>    int r;</span></span>
<span class="line"><span>    struct kvm_fpu *fpu = NULL;</span></span>
<span class="line"><span>    struct kvm_sregs *kvm_sregs = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    r = vcpu_load(vcpu);</span></span>
<span class="line"><span>    switch (ioctl) {</span></span>
<span class="line"><span>    case KVM_RUN: {</span></span>
<span class="line"><span>        struct pid *oldpid;</span></span>
<span class="line"><span>        r = kvm_arch_vcpu_ioctl_run(vcpu, vcpu-&amp;gt;run);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    case KVM_GET_REGS: {</span></span>
<span class="line"><span>        struct kvm_regs *kvm_regs;</span></span>
<span class="line"><span>        kvm_regs = kzalloc(sizeof(struct kvm_regs), GFP_KERNEL);</span></span>
<span class="line"><span>        r = kvm_arch_vcpu_ioctl_get_regs(vcpu, kvm_regs);</span></span>
<span class="line"><span>        if (copy_to_user(argp, kvm_regs, sizeof(struct kvm_regs)))</span></span>
<span class="line"><span>            goto out_free1;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    case KVM_SET_REGS: {</span></span>
<span class="line"><span>        struct kvm_regs *kvm_regs;</span></span>
<span class="line"><span>        kvm_regs = memdup_user(argp, sizeof(*kvm_regs));</span></span>
<span class="line"><span>        r = kvm_arch_vcpu_ioctl_set_regs(vcpu, kvm_regs);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>kvm_arch_vcpu_ioctl_run会调用vcpu_run，这里面也是一个无限循环。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int vcpu_run(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int r;</span></span>
<span class="line"><span>	struct kvm *kvm = vcpu-&amp;gt;kvm;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for (;;) {</span></span>
<span class="line"><span>		if (kvm_vcpu_running(vcpu)) {</span></span>
<span class="line"><span>			r = vcpu_enter_guest(vcpu);</span></span>
<span class="line"><span>		} else {</span></span>
<span class="line"><span>			r = vcpu_block(kvm, vcpu);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>....</span></span>
<span class="line"><span>		if (signal_pending(current)) {</span></span>
<span class="line"><span>			r = -EINTR;</span></span>
<span class="line"><span>			vcpu-&amp;gt;run-&amp;gt;exit_reason = KVM_EXIT_INTR;</span></span>
<span class="line"><span>			++vcpu-&amp;gt;stat.signal_exits;</span></span>
<span class="line"><span>			break;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		if (need_resched()) {</span></span>
<span class="line"><span>			cond_resched();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return r;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个循环中，除了调用vcpu_enter_guest进入客户机模式运行之外，还有对于信号的响应signal_pending，也即一台虚拟机是可以被kill掉的，还有对于调度的响应，这台虚拟机可以被从当前的物理CPU上赶下来，换成别的虚拟机或者其他进程。</p><p>我们这里重点看vcpu_enter_guest。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int vcpu_enter_guest(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	r = kvm_mmu_reload(vcpu);</span></span>
<span class="line"><span>	vcpu-&amp;gt;mode = IN_GUEST_MODE;</span></span>
<span class="line"><span>	kvm_load_guest_xcr0(vcpu);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	guest_enter_irqoff();</span></span>
<span class="line"><span>	kvm_x86_ops-&amp;gt;run(vcpu);</span></span>
<span class="line"><span>	vcpu-&amp;gt;mode = OUTSIDE_GUEST_MODE;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	kvm_put_guest_xcr0(vcpu);</span></span>
<span class="line"><span>	kvm_x86_ops-&amp;gt;handle_external_intr(vcpu);</span></span>
<span class="line"><span>	++vcpu-&amp;gt;stat.exits;</span></span>
<span class="line"><span>	guest_exit_irqoff();</span></span>
<span class="line"><span>	r = kvm_x86_ops-&amp;gt;handle_exit(vcpu);</span></span>
<span class="line"><span>	return r;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct kvm_x86_ops vmx_x86_ops __ro_after_init = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	.run = vmx_vcpu_run,</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在vcpu_enter_guest中，我们会调用vmx_x86_ops 的vmx_vcpu_run函数，进入客户机模式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void __noclone vmx_vcpu_run(struct kvm_vcpu *vcpu)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct vcpu_vmx *vmx = to_vmx(vcpu);</span></span>
<span class="line"><span>	unsigned long debugctlmsr, cr3, cr4;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	cr3 = __get_current_cr3_fast();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	cr4 = cr4_read_shadow();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vmx-&amp;gt;__launched = vmx-&amp;gt;loaded_vmcs-&amp;gt;launched;</span></span>
<span class="line"><span>	asm(</span></span>
<span class="line"><span>		/* Store host registers */</span></span>
<span class="line"><span>		&quot;push %%&quot; _ASM_DX &quot;; push %%&quot; _ASM_BP &quot;;&quot;</span></span>
<span class="line"><span>		&quot;push %%&quot; _ASM_CX &quot; \\n\\t&quot; /* placeholder for guest rcx */</span></span>
<span class="line"><span>		&quot;push %%&quot; _ASM_CX &quot; \\n\\t&quot;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>		/* Load guest registers.  Don&#39;t clobber flags. */</span></span>
<span class="line"><span>		&quot;mov %c[rax](%0), %%&quot; _ASM_AX &quot; \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[rbx](%0), %%&quot; _ASM_BX &quot; \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[rdx](%0), %%&quot; _ASM_DX &quot; \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[rsi](%0), %%&quot; _ASM_SI &quot; \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[rdi](%0), %%&quot; _ASM_DI &quot; \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[rbp](%0), %%&quot; _ASM_BP &quot; \\n\\t&quot;</span></span>
<span class="line"><span>#ifdef CONFIG_X86_64</span></span>
<span class="line"><span>		&quot;mov %c[r8](%0),  %%r8  \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r9](%0),  %%r9  \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r10](%0), %%r10 \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r11](%0), %%r11 \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r12](%0), %%r12 \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r13](%0), %%r13 \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r14](%0), %%r14 \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %c[r15](%0), %%r15 \\n\\t&quot;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>		&quot;mov %c[rcx](%0), %%&quot; _ASM_CX &quot; \\n\\t&quot; /* kills %0 (ecx) */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		/* Enter guest mode */</span></span>
<span class="line"><span>		&quot;jne 1f \\n\\t&quot;</span></span>
<span class="line"><span>		__ex(ASM_VMX_VMLAUNCH) &quot;\\n\\t&quot;</span></span>
<span class="line"><span>		&quot;jmp 2f \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;1: &quot; __ex(ASM_VMX_VMRESUME) &quot;\\n\\t&quot;</span></span>
<span class="line"><span>		&quot;2: &quot;</span></span>
<span class="line"><span>		/* Save guest registers, load host registers, keep flags */</span></span>
<span class="line"><span>		&quot;mov %0, %c[wordsize](%%&quot; _ASM_SP &quot;) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;pop %0 \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_AX &quot;, %c[rax](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_BX &quot;, %c[rbx](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		__ASM_SIZE(pop) &quot; %c[rcx](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_DX &quot;, %c[rdx](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_SI &quot;, %c[rsi](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_DI &quot;, %c[rdi](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_BP &quot;, %c[rbp](%0) \\n\\t&quot;</span></span>
<span class="line"><span>#ifdef CONFIG_X86_64</span></span>
<span class="line"><span>		&quot;mov %%r8,  %c[r8](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r9,  %c[r9](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r10, %c[r10](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r11, %c[r11](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r12, %c[r12](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r13, %c[r13](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r14, %c[r14](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%r15, %c[r15](%0) \\n\\t&quot;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>		&quot;mov %%cr2, %%&quot; _ASM_AX &quot;   \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;mov %%&quot; _ASM_AX &quot;, %c[cr2](%0) \\n\\t&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		&quot;pop  %%&quot; _ASM_BP &quot;; pop  %%&quot; _ASM_DX &quot; \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;setbe %c[fail](%0) \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;.pushsection .rodata \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;.global vmx_return \\n\\t&quot;</span></span>
<span class="line"><span>		&quot;vmx_return: &quot; _ASM_PTR &quot; 2b \\n\\t&quot;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	      );</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	vmx-&amp;gt;loaded_vmcs-&amp;gt;launched = 1;</span></span>
<span class="line"><span>	vmx-&amp;gt;exit_reason = vmcs_read32(VM_EXIT_REASON);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在vmx_vcpu_run中，出现了汇编语言的代码，比较难看懂，但是没有关系呀，里面有注释呀，我们可以沿着注释来看。</p><ul><li>首先是Store host registers，要从宿主机模式变为客户机模式了，所以原来宿主机运行时候的寄存器要保存下来。</li><li>接下来是Load guest registers，将原来客户机运行的时候的寄存器加载进来。</li><li>接下来是Enter guest mode，调用ASM_VMX_VMLAUNCH进入客户机模型运行，或者ASM_VMX_VMRESUME恢复客户机模型运行。</li><li>如果客户机因为某种原因退出，Save guest registers, load host registers，也即保存客户机运行的时候的寄存器，就加载宿主机运行的时候的寄存器。</li><li>最后将exit_reason保存在vmx结构中。</li></ul><p>至此，CPU虚拟化就解析完了。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>CPU的虚拟化过程还是很复杂的，我画了一张图总结了一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109904/c43639f7024848aa3e828bcfc10ca467.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109904/c43639f7024848aa3e828bcfc10ca467.png" alt=""></a></p><ul><li>首先，我们要定义CPU这种类型的TypeInfo和TypeImpl、继承关系，并且声明它的类初始化函数。</li><li>在qemu的main函数中调用MachineClass的init函数，这个函数既会初始化CPU，也会初始化内存。</li><li>CPU初始化的时候，会调用pc_new_cpu创建一个虚拟CPU，它会调用CPU这个类的初始化函数。</li><li>每一个虚拟CPU会调用qemu_thread_create创建一个线程，线程的执行函数为qemu_kvm_cpu_thread_fn。</li><li>在虚拟CPU对应的线程执行函数中，我们先是调用kvm_vm_ioctl(KVM_CREATE_VCPU)，在内核的KVM里面，创建一个结构struct vcpu_vmx，表示这个虚拟CPU。在这个结构里面，有一个VMCS，用于保存当前虚拟机CPU的运行时的状态，用于状态切换。</li><li>在虚拟CPU对应的线程执行函数中，我们接着调用kvm_vcpu_ioctl(KVM_RUN)，在内核的KVM里面运行这个虚拟机CPU。运行的方式是保存宿主机的寄存器，加载客户机的寄存器，然后调用__ex(ASM_VMX_VMLAUNCH)或者__ex(ASM_VMX_VMRESUME)，进入客户机模式运行。一旦退出客户机模式，就会保存客户机寄存器，加载宿主机寄存器，进入宿主机模式运行，并且会记录退出虚拟机模式的原因。大部分的原因是等待I/O，因而宿主机调用kvm_handle_io进行处理。</li></ul><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>在咱们上面操作KVM的过程中，出现了好几次文件系统。不愧是“Linux中一切皆文件”。那你能否整理一下这些文件系统之间的关系呢？</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109904/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/109904/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,104)])])}const v=n(l,[["render",t]]);export{m as __pageData,v as default};
