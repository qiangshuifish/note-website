import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"61 | 搭建操作系统实验环境（下）：授人以鱼不如授人以渔","description":"","frontmatter":{},"headers":[{"level":2,"title":"了解gdb","slug":"了解gdb","link":"#了解gdb","children":[]},{"level":2,"title":"Debug kernel","slug":"debug-kernel","link":"#debug-kernel","children":[]},{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/61-搭建操作系统实验环境（下）：授人以鱼不如授人以渔.md","filePath":"趣谈Linux操作系统/61-搭建操作系统实验环境（下）：授人以鱼不如授人以渔.md","lastUpdated":1779822193000}'),l={name:"趣谈Linux操作系统/61-搭建操作系统实验环境（下）：授人以鱼不如授人以渔.md"};function t(i,s,c,o,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_61-搭建操作系统实验环境-下-授人以鱼不如授人以渔" tabindex="-1">61 | 搭建操作系统实验环境（下）：授人以鱼不如授人以渔 <a class="header-anchor" href="#_61-搭建操作系统实验环境-下-授人以鱼不如授人以渔" aria-label="Permalink to &quot;61 | 搭建操作系统实验环境（下）：授人以鱼不如授人以渔&quot;">​</a></h1><p>上一节我们做了一个实验，添加了一个系统调用，并且编译了内核。这一节，我们来尝试调试内核。这样，我们就可以一步一步来看，内核的代码逻辑执行到哪一步了，对应的变量值是什么。</p><h2 id="了解gdb" tabindex="-1">了解gdb <a class="header-anchor" href="#了解gdb" aria-label="Permalink to &quot;了解gdb&quot;">​</a></h2><p>在Linux下面，调试程序使用一个叫作gdb的工具。通过这个工具，我们可以逐行运行程序。</p><p>例如，上一节我们写的syscall.c这个程序，我们就可以通过下面的命令编译。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>gcc -g syscall.c</span></span></code></pre></div><p>其中，参数-g的意思就是在编译好的二进制程序中，加入debug所需的信息。</p><p>接下来，我们安装一下gdb。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>apt-get install gdb</span></span></code></pre></div><p>然后，我们就可以来调试这个程序了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>~/syscall# gdb ./a.out</span></span>
<span class="line"><span>GNU gdb (Ubuntu 8.1-0ubuntu3.1) 8.1.0.20180409-git</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>Reading symbols from ./a.out...done.</span></span>
<span class="line"><span>(gdb) l</span></span>
<span class="line"><span>1       #include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>2       #include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>3       #include &amp;lt;unistd.h&amp;gt;</span></span>
<span class="line"><span>4       #include &amp;lt;linux/kernel.h&amp;gt;</span></span>
<span class="line"><span>5       #include &amp;lt;sys/syscall.h&amp;gt;</span></span>
<span class="line"><span>6       #include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span>8       int main ()</span></span>
<span class="line"><span>9       {</span></span>
<span class="line"><span>10        char * words = &quot;I am liuchao from user mode.&quot;;</span></span>
<span class="line"><span>(gdb) b 10</span></span>
<span class="line"><span>Breakpoint 1 at 0x6e2: file syscall.c, line 10.</span></span>
<span class="line"><span>(gdb) r</span></span>
<span class="line"><span>Starting program: /root/syscall/a.out</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Breakpoint 1, main () at syscall.c:10</span></span>
<span class="line"><span>10        char * words = &quot;I am liuchao from user mode.&quot;;</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>12        ret = syscall(333, words, strlen(words)+1);</span></span>
<span class="line"><span>(gdb) p words</span></span>
<span class="line"><span>$1 = 0x5555555547c4 &quot;I am liuchao from user mode.&quot;</span></span>
<span class="line"><span>(gdb) s</span></span>
<span class="line"><span>__strlen_sse2 () at ../sysdeps/x86_64/multiarch/../strlen.S:79</span></span>
<span class="line"><span>(gdb) bt</span></span>
<span class="line"><span>#0  __strlen_sse2 () at ../sysdeps/x86_64/multiarch/../strlen.S:79</span></span>
<span class="line"><span>#1  0x00005555555546f9 in main () at syscall.c:12</span></span>
<span class="line"><span>(gdb) c</span></span>
<span class="line"><span>Continuing.</span></span>
<span class="line"><span>return 63 from kernel mode.</span></span>
<span class="line"><span>[Inferior 1 (process 1774) exited normally]</span></span>
<span class="line"><span>(gdb) q</span></span></code></pre></div><p>在上面的例子中，我们只要掌握简单的几个gdb的命令就可以了。</p><ul><li>l，即list，用于显示多行源代码。</li><li>b，即break，用于设置断点。</li><li>r，即run，用于开始运行程序。</li><li>n，即next，用于执行下一条语句。如果该语句为函数调用，则不会进入函数内部执行。</li><li>p，即print，用于打印内部变量值。</li><li>s，即step，用于执行下一条语句。如果该语句为函数调用，则进入函数，执行其中的第一条语句。</li><li>c，即continue，用于继续程序的运行，直到遇到下一个断点。</li><li>bt，即backtrace，用于查看函数调用信息。</li><li>q，即quit，用于退出gdb环境。</li></ul><h2 id="debug-kernel" tabindex="-1">Debug kernel <a class="header-anchor" href="#debug-kernel" aria-label="Permalink to &quot;Debug kernel&quot;">​</a></h2><p>看了debug一个进程还是简单的，接下来，我们来试着debug整个kernel。</p><p>第一步，要想kernel能够被debug，需要像上面编译程序一样，将debug所需信息也放入二进制文件里面去。这个我们在编译内核的时候已经设置过了，也就是把“CONFIG_DEBUG_INFO”和“CONFIG_FRAME_POINTER”两个变量设置为yes。</p><p>第二步，就是安装gdb。kernel运行在qemu虚拟机里面，gdb运行在宿主机上，所以我们应该在宿主机上进行安装。</p><p>第三步，找到gdb要运行的那个内核的二进制文件。这个文件在哪里呢？根据grub里面的配置，它应该在/boot/vmlinuz-4.15.18这里。</p><p>另外，为了方便在debug的过程中查看源代码，我们可以将/usr/src/linux-source-4.15.0整个目录，都拷贝到宿主机上来。因为内核一旦进入debug模式，就不能运行了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scp -r popsuper&amp;#64;192.168.57.100:/usr/src/linux-source-4.15.0 ./</span></span></code></pre></div><p>在/usr/src/linux-source-4.15.0这个目录下面，vmlinux文件也是内核的二进制文件。</p><p>第四步，修改qemu的启动参数和qemu里面虚拟机的启动参数，从而使得gdb可以远程attach到qemu里面的内核上。</p><p>我们知道，gdb debug一个进程的时候，gdb会监控进程的运行，使得进程一行一行地执行二进制文件。如果像syscall.c的二进制文件a.out一样，就在本地，gdb可以通过attach到这个进程上，作为这个进程的父进程，来监控它的运行。</p><p>但是，gdb debug一个内核的时候，因为内核在qemu虚拟机里面，所以我们无法监控本地进程，而要通过qemu来监控qemu里面的内核，这就要借助qemu的机制。</p><p>qemu有个参数-s，它代表参数-gdb tcp::1234，意思是qemu监听1234端口，gdb可以attach到这个端口上来，debug qemu里面的内核。</p><p>为了完成这一点，我们需要修改ubuntutest这个虚拟机的定义文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>virsh edit ubuntutest</span></span></code></pre></div><p>在这里，我们能将虚拟机的定义文件修改成下面的样子，其中主要改了两项：</p><ul><li>在domain的最后加上了qemu:commandline，里面指定了参数-s；</li><li>在domain中添加xmlns:qemu。没有这个XML的namespace，qemu:commandline这个参数libvirt不认。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;domain type=&#39;qemu&#39; xmlns:qemu=&#39;http://libvirt.org/schemas/domain/qemu/1.0&#39;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;name&amp;gt;ubuntutest&amp;lt;/name&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;uuid&amp;gt;0f0806ab-531d-6134-5def-c5b4955292aa&amp;lt;/uuid&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;memory unit=&#39;KiB&#39;&amp;gt;8388608&amp;lt;/memory&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;currentMemory unit=&#39;KiB&#39;&amp;gt;8388608&amp;lt;/currentMemory&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;vcpu placement=&#39;static&#39;&amp;gt;8&amp;lt;/vcpu&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;os&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;type arch=&#39;x86_64&#39; machine=&#39;pc-i440fx-trusty&#39;&amp;gt;hvm&amp;lt;/type&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;boot dev=&#39;hd&#39;/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;/os&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;clock offset=&#39;utc&#39;/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;on_poweroff&amp;gt;destroy&amp;lt;/on_poweroff&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;on_reboot&amp;gt;restart&amp;lt;/on_reboot&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;on_crash&amp;gt;restart&amp;lt;/on_crash&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;devices&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;emulator&amp;gt;/usr/bin/qemu-system-x86_64&amp;lt;/emulator&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;disk type=&#39;file&#39; device=&#39;disk&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;driver name=&#39;qemu&#39; type=&#39;qcow2&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;source file=&#39;/mnt/vdc/ubuntutest.img&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;backingStore/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;target dev=&#39;vda&#39; bus=&#39;virtio&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;alias name=&#39;virtio-disk0&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;address type=&#39;pci&#39; domain=&#39;0x0000&#39; bus=&#39;0x00&#39; slot=&#39;0x04&#39; function=&#39;0x0&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/disk&amp;gt;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    &amp;lt;interface type=&#39;bridge&#39;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;mac address=&#39;fa:16:3e:6e:89:ce&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;source bridge=&#39;br0&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;target dev=&#39;tap1&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;model type=&#39;virtio&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;alias name=&#39;net0&#39;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;address type=&#39;pci&#39; domain=&#39;0x0000&#39; bus=&#39;0x00&#39; slot=&#39;0x03&#39; function=&#39;0x0&#39;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/interface&amp;gt;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  &amp;lt;/devices&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;qemu:commandline&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;qemu:arg value=&#39;-s&#39;/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;/qemu:commandline&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/domain&amp;gt;</span></span></code></pre></div><p>另外，为了远程debug成功，我们还需要修改qemu里面的虚拟机的grub和menu.list，在内核命令行中添加nokaslr，来关闭KASLR。KASLR会使得内核地址空间布局随机化，从而会造成我们打的断点不起作用。</p><p>对于grub.conf，修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>submenu &#39;Advanced options for Ubuntu&#39; $menuentry_id_option &#39;gnulinux-advanced-470f3a42-7a97-4b9d-aaa0-26deb3d234f9&#39; {</span></span>
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
<span class="line"><span>                linux   /boot/vmlinuz-4.15.18 root=UUID=470f3a42-7a97-4b9d-aaa0-26deb3d234f9 ro nokaslr console=ttyS0 maybe-ubiquity</span></span>
<span class="line"><span>                echo    &#39;Loading initial ramdisk ...&#39;</span></span>
<span class="line"><span>                initrd  /boot/initrd.img-4.15.18</span></span>
<span class="line"><span>        }</span></span></code></pre></div><p>对于menu.list，修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>title           Ubuntu 18.04.2 LTS, kernel 4.15.18</span></span>
<span class="line"><span>root            (hd0)</span></span>
<span class="line"><span>kernel          /boot/vmlinuz-4.15.18 root=/dev/hda1 ro nokaslr console=hvc0 console=ttyS0</span></span>
<span class="line"><span>initrd          /boot/initrd.img-4.15.18</span></span></code></pre></div><p>修改完毕后，我们需要在虚拟机里面shutdown -h now，来关闭虚拟机。注意不要reboot，因为虚拟机里面运行reboot，我们改过的那个XML会不起作用。</p><p>当我们在宿主机上发现虚拟机关机之后，就可以通过virsh start ubuntutest启动虚拟机，这个时候我们添加的参数-s才起作用。</p><p>第五步，使用gdb运行内核的二进制文件，执行gdb vmlinux。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/mnt/vdc/linux-source-4.15.0# gdb vmlinux</span></span>
<span class="line"><span>GNU gdb (Ubuntu 7.11.1-0ubuntu1~16.5) 7.11.1</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>To enable execution of this file add</span></span>
<span class="line"><span>        add-auto-load-safe-path /mnt/vdc/linux-source-4.15.0/vmlinux-gdb.py</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>(gdb) b sys_sayhelloworld</span></span>
<span class="line"><span>Breakpoint 1 at 0xffffffff8109e2f0: file kernel/sys.c, line 192.</span></span>
<span class="line"><span>(gdb) target remote :1234</span></span>
<span class="line"><span>Remote debugging using :1234</span></span>
<span class="line"><span>native_safe_halt () at ./arch/x86/include/asm/irqflags.h:61</span></span>
<span class="line"><span>61      }</span></span>
<span class="line"><span>(gdb) c</span></span>
<span class="line"><span>Continuing.</span></span>
<span class="line"><span>[Switching to Thread 2]</span></span>
<span class="line"><span>Thread 2 hit Breakpoint 1, sys_sayhelloworld (words=0x563cbfa907c4 &quot;I am liuchao from user mode.&quot;, count=29) at kernel/sys.c:192</span></span>
<span class="line"><span>192     {</span></span>
<span class="line"><span>(gdb) bt</span></span>
<span class="line"><span>#0  sys_sayhelloworld (words=0x55b2811537c4 &quot;I am liuchao from user mode.&quot;, count=29) at kernel/sys.c:192</span></span>
<span class="line"><span>#1  0xffffffff810039f7 in do_syscall_64 (regs=0xffffc9000133bf58) at arch/x86/entry/common.c:290</span></span>
<span class="line"><span>#2  0xffffffff81a00081 in entry_SYSCALL_64 () at arch/x86/entry/entry_64.S:237</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>195             if(count &amp;gt;= 1024){</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>198             copy_from_user(buffer, words, count);</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>199             ret=printk(&quot;User Mode says %s to the Kernel Mode!&quot;, buffer);</span></span>
<span class="line"><span>(gdb) p buffer</span></span>
<span class="line"><span>$1 = &quot;I am liuchao from user mode.\\000\\177\\000\\000\\...</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>200             return ret;</span></span>
<span class="line"><span>(gdb) p ret</span></span>
<span class="line"><span>$2 = 63</span></span>
<span class="line"><span>(gdb) c</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>do_syscall_64 (regs=0xffffc9000133bf58) at arch/x86/entry/common.c:295</span></span>
<span class="line"><span>295             syscall_return_slowpath(regs);</span></span>
<span class="line"><span>(gdb) s</span></span>
<span class="line"><span>syscall_return_slowpath (regs=&amp;lt;optimized out&amp;gt;) at arch/x86/entry/common.c:295</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>268             prepare_exit_to_usermode(regs);</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>do_syscall_64 (regs=0xffffc9000133bf58) at arch/x86/entry/common.c:296</span></span>
<span class="line"><span>296     }</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>entry_SYSCALL_64 () at arch/x86/entry/entry_64.S:246</span></span>
<span class="line"><span>246             movq    RCX(%rsp), %rcx</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>(gdb) n</span></span>
<span class="line"><span>entry_SYSCALL_64 () at arch/x86/entry/entry_64.S:330</span></span>
<span class="line"><span>330             USERGS_SYSRET64</span></span></code></pre></div><p>我们先设置一个断点在我们自己写的系统调用上b sys_sayhelloworld，通过执行target remote :1234，来attach到qemu上，然后，执行c，也即continue运行内核。这个时候内核始终在Continuing的状态，也即持续在运行中，这个时候我们可以远程登录到qemu里的虚拟机上，执行各种命令。</p><p>如果我们在虚拟机里面运行syscall.c编译好的a.out，这个时候肯定会调用到内核。内核肯定会经过系统调用的过程，到达sys_sayhelloworld这个函数，这就碰到了我们设置的那个断点。</p><p>如果执行bt，我们能看到，这个系统调用是从entry_64.S里面的entry_SYSCALL_64 ()函数，调用到do_syscall_64函数，再调用到sys_sayhelloworld函数的。这一点和我们在 <a href="https://time.geekbang.org/column/article/90394" target="_blank" rel="noreferrer">系统调用</a> 那一节分析的过程是一模一样的。</p><p>我们可以通过执行next命令，来看sys_sayhelloworld一步一步是怎么执行的，通过p buffer查看buffer里面的内容。在这个过程中，由于内核是逐行运行的，因而我们在虚拟机里面的命令行是卡死的状态。</p><p>当我们不断地next，直到执行完毕sys_sayhelloworld的时候，会看到，do_syscall_64会调用syscall_return_slowpath。它会调用prepare_exit_to_usermode，然后会回到entry_SYSCALL_64，然后对于寄存器进行操作，最后调用指令USERGS_SYSRET64回到用户态。这个返回的过程和系统调用那一节也一模一样。</p><p>看，通过debug我们能够跟踪系统调用的整个过程。你可以将我们这一门课里面学的所有的过程都debug一下，看看变量的值，从而对于内核的工作机制有更加深入的了解。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>在这个课程里面，我们写过一些程序，为了保证程序能够顺利运行，我一般会将代码完整地放到文本中，让你拷贝下来就能编译和运行。如果你运行的时候发现有问题，或者想了解一步一步运行的细节，这一节介绍的gdb是一个很好的工具。</p><p>这一节你尤其应该掌握的是，如何通过宿主机上的gdb来debug虚拟机里面的内核。这一点非常重要，会了这个，你就能够返回去，挨个研究每一章每一节的内核数据结构和运行逻辑了。</p><p>在这门课中，进程管理、内存管理、文件管理、设备管理网络管理，我们都介绍了从系统调用到底层的整个逻辑。如果你对我前面的代码解析还比较困惑，你可以尝试着去debug这些过程，只要把断点打在系统调用的入口位置就可以了。</p><p>从此，开启你的内核debug之旅吧！</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这里给你留一道题目，你可以试着debug一下文件打开的过程。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/117939/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/117939/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,54)])])}const g=a(l,[["render",t]]);export{m as __pageData,g as default};
