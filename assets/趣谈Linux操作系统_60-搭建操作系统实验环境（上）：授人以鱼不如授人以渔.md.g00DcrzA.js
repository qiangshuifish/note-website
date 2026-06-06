import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"60 | 搭建操作系统实验环境（上）：授人以鱼不如授人以渔","description":"","frontmatter":{},"headers":[{"level":2,"title":"创建虚拟机","slug":"创建虚拟机","link":"#创建虚拟机","children":[]},{"level":2,"title":"下载源代码","slug":"下载源代码","link":"#下载源代码","children":[]},{"level":2,"title":"编译内核","slug":"编译内核","link":"#编译内核","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/60-搭建操作系统实验环境（上）：授人以鱼不如授人以渔.md","filePath":"趣谈Linux操作系统/60-搭建操作系统实验环境（上）：授人以鱼不如授人以渔.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/60-搭建操作系统实验环境（上）：授人以鱼不如授人以渔.md"};function l(i,a,c,o,d,r){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_60-搭建操作系统实验环境-上-授人以鱼不如授人以渔" tabindex="-1">60 | 搭建操作系统实验环境（上）：授人以鱼不如授人以渔 <a class="header-anchor" href="#_60-搭建操作系统实验环境-上-授人以鱼不如授人以渔" aria-label="Permalink to &quot;60 | 搭建操作系统实验环境（上）：授人以鱼不如授人以渔&quot;">​</a></h1><p>操作系统的理论部分我们就讲完了，但是计算机这门学科是实验性的。为了更加深入地了解操作系统的本质，我们必须能够做一些上手实验。操作系统的实验，相比其他计算机课程的实验要更加复杂一些。</p><p>我们做任何实验，都需要一个实验环境。这个实验环境要搭建在操作系统之上，但是，我们这个课程本身就是操作系统实验，难不成要自己debug自己？到底该咋整呢？</p><p>我们有一个利器，那就是qemu啊，不知道你还记得吗？它可以在操作系统之上模拟一个操作系统，就像一个普通的进程。那我们是否可以像debug普通进程那样，通过qemu来debug虚拟机里面的操作系统呢？</p><p>这一节和下一节，我们就按照这个思路，来试试看，搭建一个操作系统的实验环境。</p><p>运行一个qemu虚拟机，首先我们要有一个虚拟机的镜像。咱们在 <a href="https://time.geekbang.org/column/article/108964" target="_blank" rel="noreferrer">虚拟机</a> 那一节，已经制作了一个虚拟机的镜像。假设我们要基于 <a href="http://ubuntu-18.04.2-live-server-amd64.iso" target="_blank" rel="noreferrer">ubuntu-18.04.2-live-server-amd64.iso</a>，它对应的内核版本是linux-source-4.15.0。</p><p>当时我们启动虚拟机的过程很复杂，设置参数的时候也很复杂，以至于解析这些参数就花了我们一章的时间。所以，这里我介绍一个简单的创建和管理虚拟机的方法。</p><p>在 <a href="https://time.geekbang.org/column/article/109335" target="_blank" rel="noreferrer">CPU虚拟化</a> 那一节，我留过一个思考题，OpenStack是如何创建和管理虚拟机的？当时我给了你一个提示，就是用libvirt。没错，这一节，我们就用libvirt来创建和管理虚拟机。</p><h2 id="创建虚拟机" tabindex="-1">创建虚拟机 <a class="header-anchor" href="#创建虚拟机" aria-label="Permalink to &quot;创建虚拟机&quot;">​</a></h2><p>首先，在宿主机上，我们需要一个网桥。我们用下面的命令创建一个网桥，并且设置一个IP地址。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>brctl addbr br0</span></span>
<span class="line"><span>ip link set br0 up</span></span>
<span class="line"><span>ifconfig br0 192.168.57.1/24</span></span></code></pre></div><p>为了访问外网，这里还需要设置/etc/sysctl.conf文件中net.ipv4.ip_forward=1参数，并且执行以下的命令，设置NAT。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE</span></span></code></pre></div><p>接下来，就要创建虚拟机了。这次我们就不再一个个指定虚拟机启动的参数，而是用libvirt。首先，使用下面的命令，安装libvirt。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apt-get install libvirt-bin</span></span>
<span class="line"><span>apt-get install virtinst</span></span></code></pre></div><p>libvirt管理qemu虚拟机，是基于XML文件，这样容易维护。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;domain type=&#39;qemu&#39;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;name&amp;gt;ubuntutest&amp;lt;/name&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;uuid&amp;gt;0f0806ab-531d-6134-5def-c5b4955292aa&amp;lt;/uuid&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;memory unit=&#39;GiB&#39;&amp;gt;4&amp;lt;/memory&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;currentMemory unit=&#39;GiB&#39;&amp;gt;4&amp;lt;/currentMemory&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;vcpu placement=&#39;static&#39;&amp;gt;2&amp;lt;/vcpu&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;os&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;type arch=&#39;x86_64&#39; machine=&#39;pc-i440fx-trusty&#39;&amp;gt;hvm&amp;lt;/type&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;boot dev=&#39;hd&#39;/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;/os&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;features&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;acpi/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;apic/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;pae/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;/features&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;clock offset=&#39;utc&#39;/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;on_poweroff&amp;gt;destroy&amp;lt;/on_poweroff&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;on_reboot&amp;gt;restart&amp;lt;/on_reboot&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;on_crash&amp;gt;restart&amp;lt;/on_crash&amp;gt;</span></span>
<span class="line"><span> &amp;lt;devices&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;emulator&amp;gt;/usr/bin/qemu-system-x86_64&amp;lt;/emulator&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;disk type=&#39;file&#39; device=&#39;disk&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;driver name=&#39;qemu&#39; type=&#39;qcow2&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;source file=&#39;/mnt/vdc/ubuntutest.img&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;target dev=&#39;vda&#39; bus=&#39;virtio&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/disk&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;controller type=&#39;pci&#39; index=&#39;0&#39; model=&#39;pci-root&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;interface type=&#39;bridge&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;mac address=&#39;fa:16:3e:6e:89:ce&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;source bridge=&#39;br0&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;target dev=&#39;tap1&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;model type=&#39;virtio&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/interface&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;serial type=&#39;pty&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;target port=&#39;0&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/serial&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;console type=&#39;pty&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;target type=&#39;serial&#39; port=&#39;0&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/console&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;graphics type=&#39;vnc&#39; port=&#39;-1&#39; autoport=&#39;yes&#39; listen=&#39;0.0.0.0&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;listen type=&#39;address&#39; address=&#39;0.0.0.0&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/graphics&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;video&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;model type=&#39;cirrus&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/video&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;/devices&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/domain&amp;gt;</span></span></code></pre></div><p>在这个XML文件中，/mnt/vdc/ubuntutest.img就是虚拟机的镜像，br0就是我们创建的网桥，连接到网桥上的网卡libvirt会自动帮我们创建。</p><p>接下来，需要将这个XML保存为domain.xml，然后调用下面的命令，交给libvirt进行管理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>virsh define domain.xml</span></span></code></pre></div><p>接下来，运行virsh list --all，我们就可以看到这个定义好的虚拟机了，然后我们调用virsh start ubuntutest，启动这个虚拟机。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># virsh list</span></span>
<span class="line"><span> Id    Name                           State</span></span>
<span class="line"><span>----------------------------------------------------</span></span>
<span class="line"><span> 1     ubuntutest                     running</span></span></code></pre></div><p>我们可以通过ps查看libvirt启动的qemu进程。这个命令行是不是很眼熟？我们之前花了一章来讲解。如果不记得了，你可以回去看看前面的内容。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ps aux | grep qemu</span></span>
<span class="line"><span>libvirt+  9343 85.1 34.7 10367352 5699400 ?    Sl   Jul27 1239:18 /usr/bin/qemu-system-x86_64 -name ubuntutest -S -machine pc-i440fx-trusty,accel=tcg,usb=off -m 4096 -realtime mlock=off -smp 2,sockets=2,cores=1,threads=1 -uuid 0f0806ab-531d-6134-5def-c5b4955292aa -no-user-config -nodefaults -chardev socket,id=charmonitor,path=/var/lib/libvirt/qemu/domain-ubuntutest/monitor.sock,server,nowait -mon chardev=charmonitor,id=monitor,mode=control -rtc base=utc -no-shutdown -boot strict=on -device piix3-usb-uhci,id=usb,bus=pci.0,addr=0x1.0x2 -drive file=/mnt/vdc/ubuntutest.img,format=qcow2,if=none,id=drive-virtio-disk0 -device virtio-blk-pci,scsi=off,bus=pci.0,addr=0x4,drive=drive-virtio-disk0,id=virtio-disk0,bootindex=1 -netdev tap,fd=26,id=hostnet0 -device virtio-net-pci,netdev=hostnet0,id=net0,mac=fa:16:3e:6e:89:ce,bus=pci.0,addr=0x3 -chardev pty,id=charserial0 -device isa-serial,chardev=charserial0,id=serial0 -vnc 0.0.0.0:0 -device cirrus-vga,id=video0,bus=pci.0,addr=0x2 -device virtio-balloon-pci,id=balloon0,bus=pci.0,addr=0x5 -msg timestamp=on</span></span></code></pre></div><p>从这里，我们可以看到，VNC的设置为0.0.0.0:0。我们可以用VNCViewer工具登录到这个虚拟机的界面，但是这样实在是太麻烦了，其实virsh有一个特别好的工具，但是需要在虚拟机里面配置一些东西。</p><p>在虚拟机里面，我们修改/boot/grub/里面的两个文件，一个是grub.cfg，另一个是menu.lst，这里面就是咱们在 <a href="https://time.geekbang.org/column/article/89739" target="_blank" rel="noreferrer">系统初始化</a> 的时候，讲过的那个启动列表。</p><p>在grub.cfg中，在submenu ‘Advanced options for Ubuntu’ 这一项，在这一行的linux /boot/vmlinuz-4.15.0-55-generic root=UUID=470f3a42-7a97-4b9d-aaa0-26deb3d234f9 ro console=ttyS0 maybe-ubiquity中，加上了console=ttyS0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>submenu &#39;Advanced options for Ubuntu&#39; $menuentry_id_option &#39;gnulinux-advanced-470f3a42-7a97-4b9d-aaa0-26deb3d234f9&#39; {</span></span>
<span class="line"><span>    menuentry &#39;Ubuntu, with Linux 4.15.0-55-generic&#39; --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option &#39;gnulinux-4.15.0-55-generic-advanced-470f3a42-7a97-4b9d-aaa0-26deb3d234f9&#39; {</span></span>
<span class="line"><span>        recordfail</span></span>
<span class="line"><span>        load_video</span></span>
<span class="line"><span>        gfxmode $linux_gfx_mode</span></span>
<span class="line"><span>        insmod gzio</span></span>
<span class="line"><span>        if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi</span></span>
<span class="line"><span>        insmod part_gpt</span></span>
<span class="line"><span>        insmod ext2</span></span>
<span class="line"><span>        set root=&#39;hd0,gpt2&#39;</span></span>
<span class="line"><span>        if [ x$feature_platform_search_hint = xy ]; then</span></span>
<span class="line"><span>            search --no-floppy --fs-uuid --set=root --hint-bios=hd0,gpt2 --hint-efi=hd0,gpt2 --hint-baremetal=ahci0,gpt2  470f3a42-7a97-4b9d-aaa0-26deb3d234f9</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            search --no-floppy --fs-uuid --set=root 470f3a42-7a97-4b9d-aaa0-26deb3d234f9</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        echo    &#39;Loading Linux 4.15.0-55-generic ...&#39;</span></span>
<span class="line"><span>        linux   /boot/vmlinuz-4.15.0-55-generic root=UUID=470f3a42-7a97-4b9d-aaa0-26deb3d234f9 ro console=ttyS0 maybe-ubiquity</span></span>
<span class="line"><span>        echo    &#39;Loading initial ramdisk ...&#39;</span></span>
<span class="line"><span>        initrd  /boot/initrd.img-4.15.0-55-generic</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>在menu.lst文件中，在Ubuntu 18.04.2 LTS, kernel 4.15.0-55-generic这一项，在kernel /boot/vmlinuz-4.15.0-55-generic root=/dev/hda1 ro console=hvc0 console=ttyS0这一行加入console=ttyS0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>title           Ubuntu 18.04.2 LTS, kernel 4.15.0-55-generic</span></span>
<span class="line"><span>root            (hd0)</span></span>
<span class="line"><span>kernel          /boot/vmlinuz-4.15.0-55-generic root=/dev/hda1 ro console=hvc0 console=ttyS0</span></span>
<span class="line"><span>initrd          /boot/initrd.img-4.15.0-55-generic</span></span></code></pre></div><p>接下来，我们重启虚拟机，重启后上面的配置就起作用了。这时候，我们可以通过下面的命令，进入机器的控制台，可以不依赖于SSH和IP地址进行登录。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># virsh console ubuntutest</span></span>
<span class="line"><span>Connected to domain ubuntutest</span></span>
<span class="line"><span>Escape character is ^]</span></span></code></pre></div><p>下面，我们可以配置这台机器的IP地址了。对于ubuntu-18.04来讲，IP地址的配置方式为修改/etc/netplan/50-cloud-init.yaml文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>network:</span></span>
<span class="line"><span>    ethernets:</span></span>
<span class="line"><span>        ens3:</span></span>
<span class="line"><span>                addresses: [192.168.57.100/24]</span></span>
<span class="line"><span>                gateway4: 192.168.57.1</span></span>
<span class="line"><span>                dhcp4: no</span></span>
<span class="line"><span>                nameservers:</span></span>
<span class="line"><span>                        addresses: [8.8.8.8,114.114.114.114]</span></span>
<span class="line"><span>                optional: true</span></span>
<span class="line"><span>    version: 2</span></span></code></pre></div><p>然后，我们可以通过netplan apply，让配置生效，这样，虚拟机里面的IP地址就配置好了。现在，我们应该能ping得通公网的一个网站了。</p><p>虚拟机就此创建好了，接下来我们需要下载源代码重新编译。</p><h2 id="下载源代码" tabindex="-1">下载源代码 <a class="header-anchor" href="#下载源代码" aria-label="Permalink to &quot;下载源代码&quot;">​</a></h2><p>首先，我们先下载源代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apt-get install linux-source-4.15.0</span></span></code></pre></div><p>这行命令会将代码下载到/usr/src/目录下，我们可以通过下面的命令解压缩。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tar vjxkf linux-source-4.15.0.tar.bz2</span></span></code></pre></div><p>至此，路径/usr/src/linux-source-4.15.0下，就是解压好的内核代码。</p><p>准备工作都做好了。这一节，我们先来做第一个实验，也就是，在原有内核代码的基础上加一个我们自己的系统调用。</p><p>在哪里加代码呢？如果你忘了，请出门左转，回顾一下 <a href="https://time.geekbang.org/column/article/90394" target="_blank" rel="noreferrer">系统调用</a> 那一节。</p><p>第一个要加的地方是arch/x86/entry/syscalls/syscall_64.tbl。这里面登记了所有的系统调用号以及相应的处理函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>332     common  statx                   sys_statx</span></span>
<span class="line"><span>333     64      sayhelloworld           sys_sayhelloworld</span></span></code></pre></div><p>在这里，我们找到332号系统调用sys_statx，然后照猫画虎，添加一个sys_sayhelloworld，这里我们只添加64位操作系统的。</p><p>第二个要加的地方是include/linux/syscalls.h，也就是系统调用的头文件，然后添加一个系统调用的声明。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>asmlinkage long sys_statx(int dfd, const char __user *path, unsigned flags,</span></span>
<span class="line"><span>                          unsigned mask, struct statx __user *buffer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asmlinkage int sys_sayhelloworld(char * words, int count);</span></span></code></pre></div><p>同样，我们找到sys_statx的声明，照猫画虎，声明一个sys_sayhelloworld。其中，words参数是用户态传递给内核态的文本的指针，count是数目。</p><p>第三个就是对于这个系统调用的实现，方便起见，我们不再用SYSCALL_DEFINEx系列的宏来定义了，直接在kernel/sys.c中实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>asmlinkage int sys_sayhelloworld(char * words, int count){</span></span>
<span class="line"><span>	int ret;</span></span>
<span class="line"><span>	char buffer[512];</span></span>
<span class="line"><span>	if(count &amp;gt;= 512){</span></span>
<span class="line"><span>		return -1;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	copy_from_user(buffer, words, count);</span></span>
<span class="line"><span>	ret=printk(&quot;User Mode says %s to the Kernel Mode!&quot;, buffer);</span></span>
<span class="line"><span>	return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来就要开始编译内核了。</p><h2 id="编译内核" tabindex="-1">编译内核 <a class="header-anchor" href="#编译内核" aria-label="Permalink to &quot;编译内核&quot;">​</a></h2><p>编译之前，我们需要安装一些编译要依赖的包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apt-get install libncurses5-dev libssl-dev bison flex libelf-dev gcc make openssl libc6-dev</span></span></code></pre></div><p>首先，我们要定义编译选项。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>make menuconfig</span></span></code></pre></div><p>然后，我们能通过选中下面的选项，激活CONFIG_DEBUG_INFO和CONFIG_FRAME_POINTER选项。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Kernel hacking  ---&amp;gt;</span></span>
<span class="line"><span>Compile-time checks and compiler options  ---&amp;gt;</span></span>
<span class="line"><span>[*] Compile the kernel with debug info</span></span>
<span class="line"><span>[*] Compile the kernel with frame pointers</span></span></code></pre></div><p>选择完毕之后，配置会保存在.config文件中。如果我们打开看，能看到这样的配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CONFIG_FRAME_POINTER=y</span></span>
<span class="line"><span>CONFIG_DEBUG_INFO=y</span></span></code></pre></div><p>接下来，我们编译内核。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nohup make -j8 &amp;gt; make1.log 2&amp;gt;&amp;1 &amp;</span></span>
<span class="line"><span>nohup make modules_install &amp;gt; make2.log 2&amp;gt;&amp;1 &amp;</span></span>
<span class="line"><span>nohup make install &amp;gt; make3.log 2&amp;gt;&amp;1 &amp;</span></span></code></pre></div><p>这是一个非常长的过程，请耐心等待，可能需要数个小时，因而这里用了nohup，你可以去干别的事情。</p><p>当编译完毕之后，grub和menu.lst都会发生改变。例如，grub.conf里面会多一个新内核的项。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>submenu &#39;Advanced options for Ubuntu&#39; $menuentry_id_option &#39;gnulinux-advanced-470f3a42-7a97-4b9d-aaa0-26deb3d234f9&#39; {</span></span>
<span class="line"><span>        menuentry &#39;Ubuntu, with Linux 4.15.18&#39; --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option &#39;gnulinux-4.15.18-advanced-470f3a42-7a97-4b9d-aaa0-26deb3d234f9&#39; {</span></span>
<span class="line"><span>                recordfail</span></span>
<span class="line"><span>                load_video</span></span>
<span class="line"><span>                gfxmode $linux_gfx_mode</span></span>
<span class="line"><span>                insmod gzio</span></span>
<span class="line"><span>                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi</span></span>
<span class="line"><span>                insmod part_gpt</span></span>
<span class="line"><span>                insmod ext2</span></span>
<span class="line"><span>                if [ x$feature_platform_search_hint = xy ]; then</span></span>
<span class="line"><span>                  search --no-floppy --fs-uuid --set=root  470f3a42-7a97-4b9d-aaa0-26deb3d234f9</span></span>
<span class="line"><span>                else</span></span>
<span class="line"><span>                  search --no-floppy --fs-uuid --set=root 470f3a42-7a97-4b9d-aaa0-26deb3d234f9</span></span>
<span class="line"><span>                fi</span></span>
<span class="line"><span>                echo    &#39;Loading Linux 4.15.18 ...&#39;</span></span>
<span class="line"><span>                linux   /boot/vmlinuz-4.15.18 root=UUID=470f3a42-7a97-4b9d-aaa0-26deb3d234f9 ro console=ttyS0 maybe-ubiquity</span></span>
<span class="line"><span>                echo    &#39;Loading initial ramdisk ...&#39;</span></span>
<span class="line"><span>                initrd  /boot/initrd.img-4.15.18</span></span>
<span class="line"><span>        }</span></span></code></pre></div><p>例如，menu.lst也多了新的内核的项。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>title           Ubuntu 18.04.2 LTS, kernel 4.15.18</span></span>
<span class="line"><span>root            (hd0)</span></span>
<span class="line"><span>kernel          /boot/vmlinuz-4.15.18 root=/dev/hda1 ro console=hvc0 console=ttyS0</span></span>
<span class="line"><span>initrd          /boot/initrd.img-4.15.18</span></span></code></pre></div><p>别忘了，这里面都要加上console=ttyS0。</p><p>下面，我们要做的就是重启虚拟机。进入的时候，会出现GRUB界面。我们选择Ubuntu高级选项，然后选择第一项进去，通过uname命令，我们就进入了新的内核。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># uname -a</span></span>
<span class="line"><span>Linux popsuper 4.15.18 #1 SMP Sat Jul 27 13:43:42 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux</span></span></code></pre></div><p>进入新的系统后，我们写一个测试程序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;unistd.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;linux/kernel.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/syscall.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main ()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  char * words = &quot;I am liuchao from user mode.&quot;;</span></span>
<span class="line"><span>  int ret;</span></span>
<span class="line"><span>  ret = syscall(333, words, strlen(words)+1);</span></span>
<span class="line"><span>  printf(&quot;return %d from kernel mode.\\n&quot;, ret);</span></span>
<span class="line"><span>  return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，我们能利用gcc编译器编译后运行。如果我们查看日志/var/log/syslog，就能够看到里面打印出来下面的日志，这说明我们的系统调用已经添加成功了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Aug  1 06:33:12 popsuper kernel: [ 2048.873393] User Mode says I am liuchao from user mode. to the Kernel Mode!</span></span></code></pre></div><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节是一节实战课，我们创建了一台虚拟机，在里面下载源代码，尝试修改了Linux内核，添加了一个自己的系统调用，并且进行了编译并安装了新内核。如果你按照这个过程做下来，你会惊喜地发现，原来令我们敬畏的内核，也是能够加以干预，为我而用的呢。没错，这就是你开始逐渐掌握内核的重要一步。</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这一节的课堂练习，希望你能够按照整个过程，一步一步操作下来。毕竟看懂不算懂，做出来才算入门啊。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p>`,81)])])}const g=s(t,[["render",l]]);export{m as __pageData,g as default};
