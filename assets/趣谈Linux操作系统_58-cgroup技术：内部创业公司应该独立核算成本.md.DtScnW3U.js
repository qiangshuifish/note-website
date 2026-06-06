import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"58 | cgroup技术：内部创业公司应该独立核算成本","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/58-cgroup技术：内部创业公司应该独立核算成本.md","filePath":"趣谈Linux操作系统/58-cgroup技术：内部创业公司应该独立核算成本.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/58-cgroup技术：内部创业公司应该独立核算成本.md"};function c(l,s,i,o,r,_){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_58-cgroup技术-内部创业公司应该独立核算成本" tabindex="-1">58 | cgroup技术：内部创业公司应该独立核算成本 <a class="header-anchor" href="#_58-cgroup技术-内部创业公司应该独立核算成本" aria-label="Permalink to &quot;58 | cgroup技术：内部创业公司应该独立核算成本&quot;">​</a></h1><p>我们前面说了，容器实现封闭的环境主要靠两种技术，一种是“看起来是隔离”的技术Namespace，另一种是用起来是隔离的技术cgroup。</p><p>上一节我们讲了“看起来隔离“的技术Namespace，这一节我们就来看一下“用起来隔离“的技术cgroup。</p><p>cgroup全称是control group，顾名思义，它是用来做“控制”的。控制什么东西呢？当然是资源的使用了。那它都能控制哪些资源的使用呢？我们一起来看一看。</p><p>首先，cgroup定义了下面的一系列子系统，每个子系统用于控制某一类资源。</p><ul><li>CPU子系统，主要限制进程的CPU使用率。</li><li>cpuacct 子系统，可以统计 cgroup 中的进程的 CPU 使用报告。</li><li>cpuset 子系统，可以为 cgroup 中的进程分配单独的 CPU 节点或者内存节点。</li><li>memory 子系统，可以限制进程的 Memory 使用量。</li><li>blkio 子系统，可以限制进程的块设备 IO。</li><li>devices 子系统，可以控制进程能够访问某些设备。</li><li>net_cls 子系统，可以标记 cgroups 中进程的网络数据包，然后可以使用 tc 模块（traffic control）对数据包进行控制。</li><li>freezer 子系统，可以挂起或者恢复 cgroup 中的进程。</li></ul><p>这么多子系统，你可能要说了，那我们不用都掌握吧？没错，这里面最常用的是对于CPU和内存的控制，所以下面我们详细来说它。</p><p>在容器这一章的第一节，我们讲了，Docker有一些参数能够限制CPU和内存的使用，如果把它落地到cgroup里面会如何限制呢？</p><p>为了验证Docker的参数与cgroup的映射关系，我们运行一个命令特殊的docker run命令，这个命令比较长，里面的参数都会映射为cgroup的某项配置，然后我们运行docker ps，可以看到，这个容器的id为3dc0601189dd。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>docker run -d --cpu-shares 513 --cpus 2 --cpuset-cpus 1,3 --memory 1024M --memory-swap 1234M --memory-swappiness 7 -p 8081:80 testnginx:1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># docker ps</span></span>
<span class="line"><span>CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                  NAMES</span></span>
<span class="line"><span>3dc0601189dd        testnginx:1         &quot;/bin/sh -c &#39;nginx -…&quot;   About a minute ago   Up About a minute   0.0.0.0:8081-&amp;gt;80/tcp   boring_cohen</span></span></code></pre></div><p>在Linux上，为了操作cgroup，有一个专门的cgroup文件系统，我们运行mount命令可以查看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># mount -t cgroup</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,xattr,release_agent=/usr/lib/systemd/systemd-cgroups-agent,name=systemd)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/net_cls,net_prio type cgroup (rw,nosuid,nodev,noexec,relatime,net_prio,net_cls)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpuacct,cpu)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/hugetlb type cgroup (rw,nosuid,nodev,noexec,relatime,hugetlb)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer)</span></span>
<span class="line"><span>cgroup on /sys/fs/cgroup/pids type cgroup (rw,nosuid,nodev,noexec,relatime,pids)</span></span></code></pre></div><p>cgroup文件系统多挂载到/sys/fs/cgroup下，通过上面的命令行，我们可以看到我们可以用cgroup控制哪些资源。</p><p>对于CPU的控制，我在这一章的第一节讲过，Docker可以控制cpu-shares、cpus和cpuset。</p><p>我们在/sys/fs/cgroup/下面能看到下面的目录结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>drwxr-xr-x 5 root root  0 May 30 17:00 blkio</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 11 May 30 17:00 cpu -&amp;gt; cpu,cpuacct</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 11 May 30 17:00 cpuacct -&amp;gt; cpu,cpuacct</span></span>
<span class="line"><span>drwxr-xr-x 5 root root  0 May 30 17:00 cpu,cpuacct</span></span>
<span class="line"><span>drwxr-xr-x 3 root root  0 May 30 17:00 cpuset</span></span>
<span class="line"><span>drwxr-xr-x 5 root root  0 May 30 17:00 devices</span></span>
<span class="line"><span>drwxr-xr-x 3 root root  0 May 30 17:00 freezer</span></span>
<span class="line"><span>drwxr-xr-x 3 root root  0 May 30 17:00 hugetlb</span></span>
<span class="line"><span>drwxr-xr-x 5 root root  0 May 30 17:00 memory</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 16 May 30 17:00 net_cls -&amp;gt; net_cls,net_prio</span></span>
<span class="line"><span>drwxr-xr-x 3 root root  0 May 30 17:00 net_cls,net_prio</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 16 May 30 17:00 net_prio -&amp;gt; net_cls,net_prio</span></span>
<span class="line"><span>drwxr-xr-x 3 root root  0 May 30 17:00 perf_event</span></span>
<span class="line"><span>drwxr-xr-x 5 root root  0 May 30 17:00 pids</span></span>
<span class="line"><span>drwxr-xr-x 5 root root  0 May 30 17:00 systemd</span></span></code></pre></div><p>我们可以想象，CPU的资源控制的配置文件，应该在cpu,cpuacct这个文件夹下面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ls</span></span>
<span class="line"><span>cgroup.clone_children  cpu.cfs_period_us  notify_on_release</span></span>
<span class="line"><span>cgroup.event_control   cpu.cfs_quota_us   release_agent</span></span>
<span class="line"><span>cgroup.procs           cpu.rt_period_us   system.slice</span></span>
<span class="line"><span>cgroup.sane_behavior   cpu.rt_runtime_us  tasks</span></span>
<span class="line"><span>cpuacct.stat           cpu.shares         user.slice</span></span>
<span class="line"><span>cpuacct.usage          cpu.stat</span></span>
<span class="line"><span>cpuacct.usage_percpu   docker</span></span></code></pre></div><p>果真，这下面是对CPU的相关控制，里面还有一个路径叫docker。我们进入这个路径。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>]# ls</span></span>
<span class="line"><span>cgroup.clone_children</span></span>
<span class="line"><span>cgroup.event_control</span></span>
<span class="line"><span>cgroup.procs</span></span>
<span class="line"><span>cpuacct.stat</span></span>
<span class="line"><span>cpuacct.usage</span></span>
<span class="line"><span>cpuacct.usage_percpu</span></span>
<span class="line"><span>cpu.cfs_period_us</span></span>
<span class="line"><span>cpu.cfs_quota_us</span></span>
<span class="line"><span>cpu.rt_period_us</span></span>
<span class="line"><span>cpu.rt_runtime_us</span></span>
<span class="line"><span>cpu.shares</span></span>
<span class="line"><span>cpu.stat</span></span>
<span class="line"><span>3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd</span></span>
<span class="line"><span>notify_on_release</span></span>
<span class="line"><span>tasks</span></span></code></pre></div><p>这里面有个很长的id，是我们创建的docker的id。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# ls</span></span>
<span class="line"><span>cgroup.clone_children  cpuacct.usage_percpu  cpu.shares</span></span>
<span class="line"><span>cgroup.event_control   cpu.cfs_period_us     cpu.stat</span></span>
<span class="line"><span>cgroup.procs           cpu.cfs_quota_us      notify_on_release</span></span>
<span class="line"><span>cpuacct.stat           cpu.rt_period_us      tasks</span></span>
<span class="line"><span>cpuacct.usage          cpu.rt_runtime_us</span></span></code></pre></div><p>在这里，我们能看到cpu.shares，还有一个重要的文件tasks。这里面是这个容器里所有进程的进程号，也即所有这些进程都被这些CPU策略控制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat tasks</span></span>
<span class="line"><span>39487</span></span>
<span class="line"><span>39520</span></span>
<span class="line"><span>39526</span></span>
<span class="line"><span>39527</span></span>
<span class="line"><span>39528</span></span>
<span class="line"><span>39529</span></span></code></pre></div><p>如果我们查看cpu.shares，里面就是我们设置的513。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat cpu.shares</span></span>
<span class="line"><span>513</span></span></code></pre></div><p>另外，我们还配置了cpus，这个值其实是由cpu.cfs_period_us和cpu.cfs_quota_us共同决定的。cpu.cfs_period_us是运行周期，cpu.cfs_quota_us是在周期内这些进程占用多少时间。我们设置了cpus为2，代表的意思是，在周期100000微秒的运行周期内，这些进程要占用200000微秒的时间，也即需要两个CPU同时运行一个整的周期。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat cpu.cfs_period_us</span></span>
<span class="line"><span>100000</span></span>
<span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat cpu.cfs_quota_us</span></span>
<span class="line"><span>200000</span></span></code></pre></div><p>对于cpuset，也即CPU绑核的参数，在另外一个文件夹里面/sys/fs/cgroup/cpuset，这里面同样有一个docker文件夹，下面同样有docker id 也即3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd文件夹，这里面的cpuset.cpus就是配置的绑定到1、3两个核。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat cpuset.cpus</span></span>
<span class="line"><span>1,3</span></span></code></pre></div><p>这一章的第一节我们还讲了Docker可以限制内存的使用量，例如memory、memory-swap、memory-swappiness。这些在哪里控制呢？</p><p>/sys/fs/cgroup/下面还有一个memory路径，控制策略就是在这里面定义的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root&amp;#64;deployer memory]# ls</span></span>
<span class="line"><span>cgroup.clone_children               memory.memsw.failcnt</span></span>
<span class="line"><span>cgroup.event_control                memory.memsw.limit_in_bytes</span></span>
<span class="line"><span>cgroup.procs                        memory.memsw.max_usage_in_bytes</span></span>
<span class="line"><span>cgroup.sane_behavior                memory.memsw.usage_in_bytes</span></span>
<span class="line"><span>docker                              memory.move_charge_at_immigrate</span></span>
<span class="line"><span>memory.failcnt                      memory.numa_stat</span></span>
<span class="line"><span>memory.force_empty                  memory.oom_control</span></span>
<span class="line"><span>memory.kmem.failcnt                 memory.pressure_level</span></span>
<span class="line"><span>memory.kmem.limit_in_bytes          memory.soft_limit_in_bytes</span></span>
<span class="line"><span>memory.kmem.max_usage_in_bytes      memory.stat</span></span>
<span class="line"><span>memory.kmem.slabinfo                memory.swappiness</span></span>
<span class="line"><span>memory.kmem.tcp.failcnt             memory.usage_in_bytes</span></span>
<span class="line"><span>memory.kmem.tcp.limit_in_bytes      memory.use_hierarchy</span></span>
<span class="line"><span>memory.kmem.tcp.max_usage_in_bytes  notify_on_release</span></span>
<span class="line"><span>memory.kmem.tcp.usage_in_bytes      release_agent</span></span>
<span class="line"><span>memory.kmem.usage_in_bytes          system.slice</span></span>
<span class="line"><span>memory.limit_in_bytes               tasks</span></span>
<span class="line"><span>memory.max_usage_in_bytes           user.slice</span></span></code></pre></div><p>这里面全是对于memory的控制参数，在这里面我们可看到了docker，里面还有容器的id作为文件夹。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[docker]# ls</span></span>
<span class="line"><span>3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd</span></span>
<span class="line"><span>cgroup.clone_children</span></span>
<span class="line"><span>cgroup.event_control</span></span>
<span class="line"><span>cgroup.procs</span></span>
<span class="line"><span>memory.failcnt</span></span>
<span class="line"><span>memory.force_empty</span></span>
<span class="line"><span>memory.kmem.failcnt</span></span>
<span class="line"><span>memory.kmem.limit_in_bytes</span></span>
<span class="line"><span>memory.kmem.max_usage_in_bytes</span></span>
<span class="line"><span>memory.kmem.slabinfo</span></span>
<span class="line"><span>memory.kmem.tcp.failcnt</span></span>
<span class="line"><span>memory.kmem.tcp.limit_in_bytes</span></span>
<span class="line"><span>memory.kmem.tcp.max_usage_in_bytes</span></span>
<span class="line"><span>memory.kmem.tcp.usage_in_bytes</span></span>
<span class="line"><span>memory.kmem.usage_in_bytes</span></span>
<span class="line"><span>memory.limit_in_bytes</span></span>
<span class="line"><span>memory.max_usage_in_bytes</span></span>
<span class="line"><span>memory.memsw.failcnt</span></span>
<span class="line"><span>memory.memsw.limit_in_bytes</span></span>
<span class="line"><span>memory.memsw.max_usage_in_bytes</span></span>
<span class="line"><span>memory.memsw.usage_in_bytes</span></span>
<span class="line"><span>memory.move_charge_at_immigrate</span></span>
<span class="line"><span>memory.numa_stat</span></span>
<span class="line"><span>memory.oom_control</span></span>
<span class="line"><span>memory.pressure_level</span></span>
<span class="line"><span>memory.soft_limit_in_bytes</span></span>
<span class="line"><span>memory.stat</span></span>
<span class="line"><span>memory.swappiness</span></span>
<span class="line"><span>memory.usage_in_bytes</span></span>
<span class="line"><span>memory.use_hierarchy</span></span>
<span class="line"><span>notify_on_release</span></span>
<span class="line"><span>tasks</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# ls</span></span>
<span class="line"><span>cgroup.clone_children               memory.memsw.failcnt</span></span>
<span class="line"><span>cgroup.event_control                memory.memsw.limit_in_bytes</span></span>
<span class="line"><span>cgroup.procs                        memory.memsw.max_usage_in_bytes</span></span>
<span class="line"><span>memory.failcnt                      memory.memsw.usage_in_bytes</span></span>
<span class="line"><span>memory.force_empty                  memory.move_charge_at_immigrate</span></span>
<span class="line"><span>memory.kmem.failcnt                 memory.numa_stat</span></span>
<span class="line"><span>memory.kmem.limit_in_bytes          memory.oom_control</span></span>
<span class="line"><span>memory.kmem.max_usage_in_bytes      memory.pressure_level</span></span>
<span class="line"><span>memory.kmem.slabinfo                memory.soft_limit_in_bytes</span></span>
<span class="line"><span>memory.kmem.tcp.failcnt             memory.stat</span></span>
<span class="line"><span>memory.kmem.tcp.limit_in_bytes      memory.swappiness</span></span>
<span class="line"><span>memory.kmem.tcp.max_usage_in_bytes  memory.usage_in_bytes</span></span>
<span class="line"><span>memory.kmem.tcp.usage_in_bytes      memory.use_hierarchy</span></span>
<span class="line"><span>memory.kmem.usage_in_bytes          notify_on_release</span></span>
<span class="line"><span>memory.limit_in_bytes               tasks</span></span>
<span class="line"><span>memory.max_usage_in_bytes</span></span></code></pre></div><p>在docker id的文件夹下面，有一个memory.limit_in_bytes，里面配置的就是memory。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat memory.limit_in_bytes</span></span>
<span class="line"><span>1073741824</span></span></code></pre></div><p>还有memory.swappiness，里面配置的就是memory-swappiness。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat memory.swappiness</span></span>
<span class="line"><span>7</span></span></code></pre></div><p>还有就是memory.memsw.limit_in_bytes，里面配置的是memory-swap。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat memory.memsw.limit_in_bytes</span></span>
<span class="line"><span>1293942784</span></span></code></pre></div><p>我们还可以看一下tasks文件的内容，tasks里面是容器里面所有进程的进程号。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[3dc0601189dd218898f31f9526a6cfae83913763a4da59f95ec789c6e030ecfd]# cat tasks</span></span>
<span class="line"><span>39487</span></span>
<span class="line"><span>39520</span></span>
<span class="line"><span>39526</span></span>
<span class="line"><span>39527</span></span>
<span class="line"><span>39528</span></span>
<span class="line"><span>39529</span></span></code></pre></div><p>至此，我们看到了cgroup对于Docker资源的控制，在用户态是如何表现的。我画了一张图总结一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/115582/1c762a6283429ff3587a7fc370fc090f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/115582/1c762a6283429ff3587a7fc370fc090f.png" alt=""></a></p><p>在内核中，cgroup是如何实现的呢？</p><p>首先，在系统初始化的时候，cgroup也会进行初始化，在start_kernel中，cgroup_init_early和cgroup_init都会进行初始化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>asmlinkage __visible void __init start_kernel(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  cgroup_init_early();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>  cgroup_init();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在cgroup_init_early和cgroup_init中，会有下面的循环。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for_each_subsys(ss, i) {</span></span>
<span class="line"><span>	ss-&amp;gt;id = i;</span></span>
<span class="line"><span>	ss-&amp;gt;name = cgroup_subsys_name[i];</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	cgroup_init_subsys(ss, true);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define for_each_subsys(ss, ssid)					\\</span></span>
<span class="line"><span>	for ((ssid) = 0; (ssid) &amp;lt; CGROUP_SUBSYS_COUNT &amp;&amp;		\\</span></span>
<span class="line"><span>	     (((ss) = cgroup_subsys[ssid]) || true); (ssid)++)</span></span></code></pre></div><p>for_each_subsys会在cgroup_subsys数组中进行循环。这个cgroup_subsys数组是如何形成的呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define SUBSYS(_x) [_x ## _cgrp_id] = &amp;_x ## _cgrp_subsys,</span></span>
<span class="line"><span>struct cgroup_subsys *cgroup_subsys[] = {</span></span>
<span class="line"><span>#include &amp;lt;linux/cgroup_subsys.h&amp;gt;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>#undef SUBSYS</span></span></code></pre></div><p>SUBSYS这个宏定义了这个cgroup_subsys数组，数组中的项定义在cgroup_subsys.h头文件中。例如，对于CPU和内存有下面的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//cgroup_subsys.h</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#if IS_ENABLED(CONFIG_CPUSETS)</span></span>
<span class="line"><span>SUBSYS(cpuset)</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#if IS_ENABLED(CONFIG_CGROUP_SCHED)</span></span>
<span class="line"><span>SUBSYS(cpu)</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#if IS_ENABLED(CONFIG_CGROUP_CPUACCT)</span></span>
<span class="line"><span>SUBSYS(cpuacct)</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#if IS_ENABLED(CONFIG_MEMCG)</span></span>
<span class="line"><span>SUBSYS(memory)</span></span>
<span class="line"><span>#endif</span></span></code></pre></div><p>根据SUBSYS的定义，SUBSYS(cpu)其实是[cpu_cgrp_id] = &amp;cpu_cgrp_subsys，而SUBSYS(memory)其实是[memory_cgrp_id] = &amp;memory_cgrp_subsys。</p><p>我们能够找到cpu_cgrp_subsys和memory_cgrp_subsys的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cpuset_cgrp_subsys</span></span>
<span class="line"><span>struct cgroup_subsys cpuset_cgrp_subsys = {</span></span>
<span class="line"><span>	.css_alloc	= cpuset_css_alloc,</span></span>
<span class="line"><span>	.css_online	= cpuset_css_online,</span></span>
<span class="line"><span>	.css_offline	= cpuset_css_offline,</span></span>
<span class="line"><span>	.css_free	= cpuset_css_free,</span></span>
<span class="line"><span>	.can_attach	= cpuset_can_attach,</span></span>
<span class="line"><span>	.cancel_attach	= cpuset_cancel_attach,</span></span>
<span class="line"><span>	.attach		= cpuset_attach,</span></span>
<span class="line"><span>	.post_attach	= cpuset_post_attach,</span></span>
<span class="line"><span>	.bind		= cpuset_bind,</span></span>
<span class="line"><span>	.fork		= cpuset_fork,</span></span>
<span class="line"><span>	.legacy_cftypes	= files,</span></span>
<span class="line"><span>	.early_init	= true,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cpu_cgrp_subsys</span></span>
<span class="line"><span>struct cgroup_subsys cpu_cgrp_subsys = {</span></span>
<span class="line"><span>	.css_alloc	= cpu_cgroup_css_alloc,</span></span>
<span class="line"><span>	.css_online	= cpu_cgroup_css_online,</span></span>
<span class="line"><span>	.css_released	= cpu_cgroup_css_released,</span></span>
<span class="line"><span>	.css_free	= cpu_cgroup_css_free,</span></span>
<span class="line"><span>	.fork		= cpu_cgroup_fork,</span></span>
<span class="line"><span>	.can_attach	= cpu_cgroup_can_attach,</span></span>
<span class="line"><span>	.attach		= cpu_cgroup_attach,</span></span>
<span class="line"><span>	.legacy_cftypes	= cpu_files,</span></span>
<span class="line"><span>	.early_init	= true,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>memory_cgrp_subsys</span></span>
<span class="line"><span>struct cgroup_subsys memory_cgrp_subsys = {</span></span>
<span class="line"><span>	.css_alloc = mem_cgroup_css_alloc,</span></span>
<span class="line"><span>	.css_online = mem_cgroup_css_online,</span></span>
<span class="line"><span>	.css_offline = mem_cgroup_css_offline,</span></span>
<span class="line"><span>	.css_released = mem_cgroup_css_released,</span></span>
<span class="line"><span>	.css_free = mem_cgroup_css_free,</span></span>
<span class="line"><span>	.css_reset = mem_cgroup_css_reset,</span></span>
<span class="line"><span>	.can_attach = mem_cgroup_can_attach,</span></span>
<span class="line"><span>	.cancel_attach = mem_cgroup_cancel_attach,</span></span>
<span class="line"><span>	.post_attach = mem_cgroup_move_task,</span></span>
<span class="line"><span>	.bind = mem_cgroup_bind,</span></span>
<span class="line"><span>	.dfl_cftypes = memory_files,</span></span>
<span class="line"><span>	.legacy_cftypes = mem_cgroup_legacy_files,</span></span>
<span class="line"><span>	.early_init = 0,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在for_each_subsys的循环里面，cgroup_subsys[]数组中的每一个cgroup_subsys，都会调用cgroup_init_subsys，对于cgroup_subsys对于初始化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void __init cgroup_init_subsys(struct cgroup_subsys *ss, bool early)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cgroup_subsys_state *css;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	idr_init(&amp;ss-&amp;gt;css_idr);</span></span>
<span class="line"><span>	INIT_LIST_HEAD(&amp;ss-&amp;gt;cfts);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Create the root cgroup state for this subsystem */</span></span>
<span class="line"><span>	ss-&amp;gt;root = &amp;cgrp_dfl_root;</span></span>
<span class="line"><span>	css = ss-&amp;gt;css_alloc(cgroup_css(&amp;cgrp_dfl_root.cgrp, ss));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	init_and_link_css(css, ss, &amp;cgrp_dfl_root.cgrp);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	css-&amp;gt;id = cgroup_idr_alloc(&amp;ss-&amp;gt;css_idr, css, 1, 2, GFP_KERNEL);</span></span>
<span class="line"><span>	init_css_set.subsys[ss-&amp;gt;id] = css;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	BUG_ON(online_css(css));</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>cgroup_init_subsys里面会做两件事情，一个是调用cgroup_subsys的css_alloc函数创建一个cgroup_subsys_state；另外就是调用online_css，也即调用cgroup_subsys的css_online函数，激活这个cgroup。</p><p>对于CPU来讲，css_alloc函数就是cpu_cgroup_css_alloc。这里面会调用 sched_create_group创建一个struct task_group。在这个结构中，第一项就是cgroup_subsys_state，也就是说，task_group是cgroup_subsys_state的一个扩展，最终返回的是指向cgroup_subsys_state结构的指针，可以通过强制类型转换变为task_group。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct task_group {</span></span>
<span class="line"><span>	struct cgroup_subsys_state css;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef CONFIG_FAIR_GROUP_SCHED</span></span>
<span class="line"><span>	/* schedulable entities of this group on each cpu */</span></span>
<span class="line"><span>	struct sched_entity **se;</span></span>
<span class="line"><span>	/* runqueue &quot;owned&quot; by this group on each cpu */</span></span>
<span class="line"><span>	struct cfs_rq **cfs_rq;</span></span>
<span class="line"><span>	unsigned long shares;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef	CONFIG_SMP</span></span>
<span class="line"><span>	atomic_long_t load_avg ____cacheline_aligned;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct rcu_head rcu;</span></span>
<span class="line"><span>	struct list_head list;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct task_group *parent;</span></span>
<span class="line"><span>	struct list_head siblings;</span></span>
<span class="line"><span>	struct list_head children;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct cfs_bandwidth cfs_bandwidth;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在task_group结构中，有一个成员是sched_entity，前面我们讲进程调度的时候，遇到过它。它是调度的实体，也即这一个task_group也是一个调度实体。</p><p>接下来，online_css会被调用。对于CPU来讲，online_css调用的是cpu_cgroup_css_online。它会调用sched_online_group-&gt;online_fair_sched_group。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void online_fair_sched_group(struct task_group *tg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct sched_entity *se;</span></span>
<span class="line"><span>	struct rq *rq;</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	for_each_possible_cpu(i) {</span></span>
<span class="line"><span>		rq = cpu_rq(i);</span></span>
<span class="line"><span>		se = tg-&amp;gt;se[i];</span></span>
<span class="line"><span>		update_rq_clock(rq);</span></span>
<span class="line"><span>		attach_entity_cfs_rq(se);</span></span>
<span class="line"><span>		sync_throttle(tg, i);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，对于每一个CPU，取出每个CPU的运行队列rq，也取出task_group的sched_entity，然后通过attach_entity_cfs_rq将sched_entity添加到运行队列中。</p><p>对于内存来讲，css_alloc函数就是mem_cgroup_css_alloc。这里面会调用 mem_cgroup_alloc，创建一个struct mem_cgroup。在这个结构中，第一项就是cgroup_subsys_state，也就是说，mem_cgroup是cgroup_subsys_state的一个扩展，最终返回的是指向cgroup_subsys_state结构的指针，我们可以通过强制类型转换变为mem_cgroup。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct mem_cgroup {</span></span>
<span class="line"><span>	struct cgroup_subsys_state css;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Private memcg ID. Used to ID objects that outlive the cgroup */</span></span>
<span class="line"><span>	struct mem_cgroup_id id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Accounted resources */</span></span>
<span class="line"><span>	struct page_counter memory;</span></span>
<span class="line"><span>	struct page_counter swap;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Legacy consumer-oriented counters */</span></span>
<span class="line"><span>	struct page_counter memsw;</span></span>
<span class="line"><span>	struct page_counter kmem;</span></span>
<span class="line"><span>	struct page_counter tcpmem;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Normal memory consumption range */</span></span>
<span class="line"><span>	unsigned long low;</span></span>
<span class="line"><span>	unsigned long high;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* Range enforcement for interrupt charges */</span></span>
<span class="line"><span>	struct work_struct high_work;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	unsigned long soft_limit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	int	swappiness;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/*</span></span>
<span class="line"><span>	 * percpu counter.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	struct mem_cgroup_stat_cpu __percpu *stat;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	int last_scanned_node;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/* List of events which userspace want to receive */</span></span>
<span class="line"><span>	struct list_head event_list;</span></span>
<span class="line"><span>	spinlock_t event_list_lock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	struct mem_cgroup_per_node *nodeinfo[0];</span></span>
<span class="line"><span>	/* WARNING: nodeinfo must be the last member here */</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在cgroup_init函数中，cgroup的初始化还做了一件很重要的事情，它会调用cgroup_init_cftypes(NULL, cgroup1_base_files)，来初始化对于cgroup文件类型cftype的操作函数，也就是将struct kernfs_ops *kf_ops设置为cgroup_kf_ops。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct cftype cgroup1_base_files[] = {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;tasks&quot;,</span></span>
<span class="line"><span>        .seq_start = cgroup_pidlist_start,</span></span>
<span class="line"><span>        .seq_next = cgroup_pidlist_next,</span></span>
<span class="line"><span>        .seq_stop = cgroup_pidlist_stop,</span></span>
<span class="line"><span>        .seq_show = cgroup_pidlist_show,</span></span>
<span class="line"><span>        .private = CGROUP_FILE_TASKS,</span></span>
<span class="line"><span>        .write = cgroup_tasks_write,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct kernfs_ops cgroup_kf_ops = {</span></span>
<span class="line"><span>	.atomic_write_len	= PAGE_SIZE,</span></span>
<span class="line"><span>	.open			= cgroup_file_open,</span></span>
<span class="line"><span>	.release		= cgroup_file_release,</span></span>
<span class="line"><span>	.write			= cgroup_file_write,</span></span>
<span class="line"><span>	.seq_start		= cgroup_seqfile_start,</span></span>
<span class="line"><span>	.seq_next		= cgroup_seqfile_next,</span></span>
<span class="line"><span>	.seq_stop		= cgroup_seqfile_stop,</span></span>
<span class="line"><span>	.seq_show		= cgroup_seqfile_show,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>在cgroup初始化完毕之后，接下来就是创建一个cgroup的文件系统，用于配置和操作cgroup。</p><p>cgroup是一种特殊的文件系统。它的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct file_system_type cgroup_fs_type = {</span></span>
<span class="line"><span>	.name = &quot;cgroup&quot;,</span></span>
<span class="line"><span>	.mount = cgroup_mount,</span></span>
<span class="line"><span>	.kill_sb = cgroup_kill_sb,</span></span>
<span class="line"><span>	.fs_flags = FS_USERNS_MOUNT,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>当我们mount这个cgroup文件系统的时候，会调用cgroup_mount-&gt;cgroup1_mount。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct dentry *cgroup1_mount(struct file_system_type *fs_type, int flags,</span></span>
<span class="line"><span>			     void *data, unsigned long magic,</span></span>
<span class="line"><span>			     struct cgroup_namespace *ns)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct super_block *pinned_sb = NULL;</span></span>
<span class="line"><span>	struct cgroup_sb_opts opts;</span></span>
<span class="line"><span>	struct cgroup_root *root;</span></span>
<span class="line"><span>	struct cgroup_subsys *ss;</span></span>
<span class="line"><span>	struct dentry *dentry;</span></span>
<span class="line"><span>	int i, ret;</span></span>
<span class="line"><span>	bool new_root = false;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	root = kzalloc(sizeof(*root), GFP_KERNEL);</span></span>
<span class="line"><span>	new_root = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	init_cgroup_root(root, &amp;opts);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ret = cgroup_setup_root(root, opts.subsys_mask, PERCPU_REF_INIT_DEAD);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	dentry = cgroup_do_mount(&amp;cgroup_fs_type, flags, root,</span></span>
<span class="line"><span>				 CGROUP_SUPER_MAGIC, ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return dentry;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>cgroup被组织成为树形结构，因而有cgroup_root。init_cgroup_root会初始化这个cgroup_root。cgroup_root是cgroup的根，它有一个成员kf_root，是cgroup文件系统的根struct kernfs_root。kernfs_create_root就是用来创建这个kernfs_root结构的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int cgroup_setup_root(struct cgroup_root *root, u16 ss_mask, int ref_flags)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	LIST_HEAD(tmp_links);</span></span>
<span class="line"><span>	struct cgroup *root_cgrp = &amp;root-&amp;gt;cgrp;</span></span>
<span class="line"><span>	struct kernfs_syscall_ops *kf_sops;</span></span>
<span class="line"><span>	struct css_set *cset;</span></span>
<span class="line"><span>	int i, ret;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	root-&amp;gt;kf_root = kernfs_create_root(kf_sops,</span></span>
<span class="line"><span>					   KERNFS_ROOT_CREATE_DEACTIVATED,</span></span>
<span class="line"><span>					   root_cgrp);</span></span>
<span class="line"><span>	root_cgrp-&amp;gt;kn = root-&amp;gt;kf_root-&amp;gt;kn;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ret = css_populate_dir(&amp;root_cgrp-&amp;gt;self);</span></span>
<span class="line"><span>	ret = rebind_subsystems(root, ss_mask);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	list_add(&amp;root-&amp;gt;root_list, &amp;cgroup_roots);</span></span>
<span class="line"><span>	cgroup_root_count++;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	kernfs_activate(root_cgrp-&amp;gt;kn);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>就像在普通文件系统上，每一个文件都对应一个inode，在cgroup文件系统上，每个文件都对应一个struct kernfs_node结构，当然kernfs_root作为文件系的根也对应一个kernfs_node结构。</p><p>接下来，css_populate_dir会调用cgroup_addrm_files-&gt;cgroup_add_file-&gt;cgroup_add_file，来创建整棵文件树，并且为树中的每个文件创建对应的kernfs_node结构，并将这个文件的操作函数设置为kf_ops，也即指向cgroup_kf_ops 。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int cgroup_add_file(struct cgroup_subsys_state *css, struct cgroup *cgrp,</span></span>
<span class="line"><span>			   struct cftype *cft)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	char name[CGROUP_FILE_NAME_MAX];</span></span>
<span class="line"><span>	struct kernfs_node *kn;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	kn = __kernfs_create_file(cgrp-&amp;gt;kn, cgroup_file_name(cgrp, cft, name),</span></span>
<span class="line"><span>				  cgroup_file_mode(cft), 0, cft-&amp;gt;kf_ops, cft,</span></span>
<span class="line"><span>				  NULL, key);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct kernfs_node *__kernfs_create_file(struct kernfs_node *parent,</span></span>
<span class="line"><span>					 const char *name,</span></span>
<span class="line"><span>					 umode_t mode, loff_t size,</span></span>
<span class="line"><span>					 const struct kernfs_ops *ops,</span></span>
<span class="line"><span>					 void *priv, const void *ns,</span></span>
<span class="line"><span>					 struct lock_class_key *key)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct kernfs_node *kn;</span></span>
<span class="line"><span>	unsigned flags;</span></span>
<span class="line"><span>	int rc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	flags = KERNFS_FILE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	kn = kernfs_new_node(parent, name, (mode &amp; S_IALLUGO) | S_IFREG, flags);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	kn-&amp;gt;attr.ops = ops;</span></span>
<span class="line"><span>	kn-&amp;gt;attr.size = size;</span></span>
<span class="line"><span>	kn-&amp;gt;ns = ns;</span></span>
<span class="line"><span>	kn-&amp;gt;priv = priv;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	rc = kernfs_add_one(kn);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return kn;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从cgroup_setup_root返回后，接下来，在cgroup1_mount中，要做的一件事情是cgroup_do_mount，调用kernfs_mount真的去mount这个文件系统，返回一个普通的文件系统都认识的dentry。这种特殊的文件系统对应的文件操作函数为kernfs_file_fops。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const struct file_operations kernfs_file_fops = {</span></span>
<span class="line"><span>	.read		= kernfs_fop_read,</span></span>
<span class="line"><span>	.write		= kernfs_fop_write,</span></span>
<span class="line"><span>	.llseek		= generic_file_llseek,</span></span>
<span class="line"><span>	.mmap		= kernfs_fop_mmap,</span></span>
<span class="line"><span>	.open		= kernfs_fop_open,</span></span>
<span class="line"><span>	.release	= kernfs_fop_release,</span></span>
<span class="line"><span>	.poll		= kernfs_fop_poll,</span></span>
<span class="line"><span>	.fsync		= noop_fsync,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>当我们要写入一个CGroup文件来设置参数的时候，根据文件系统的操作，kernfs_fop_write会被调用，在这里面会调用kernfs_ops的write函数，根据上面的定义为cgroup_file_write，在这里会调用cftype的write函数。对于CPU和内存的write函数，有以下不同的定义。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static struct cftype cpu_files[] = {</span></span>
<span class="line"><span>#ifdef CONFIG_FAIR_GROUP_SCHED</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;shares&quot;,</span></span>
<span class="line"><span>        .read_u64 = cpu_shares_read_u64,</span></span>
<span class="line"><span>        .write_u64 = cpu_shares_write_u64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#ifdef CONFIG_CFS_BANDWIDTH</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;cfs_quota_us&quot;,</span></span>
<span class="line"><span>        .read_s64 = cpu_cfs_quota_read_s64,</span></span>
<span class="line"><span>        .write_s64 = cpu_cfs_quota_write_s64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;cfs_period_us&quot;,</span></span>
<span class="line"><span>        .read_u64 = cpu_cfs_period_read_u64,</span></span>
<span class="line"><span>        .write_u64 = cpu_cfs_period_write_u64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct cftype mem_cgroup_legacy_files[] = {</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;usage_in_bytes&quot;,</span></span>
<span class="line"><span>        .private = MEMFILE_PRIVATE(_MEM, RES_USAGE),</span></span>
<span class="line"><span>        .read_u64 = mem_cgroup_read_u64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;max_usage_in_bytes&quot;,</span></span>
<span class="line"><span>        .private = MEMFILE_PRIVATE(_MEM, RES_MAX_USAGE),</span></span>
<span class="line"><span>        .write = mem_cgroup_reset,</span></span>
<span class="line"><span>        .read_u64 = mem_cgroup_read_u64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;limit_in_bytes&quot;,</span></span>
<span class="line"><span>        .private = MEMFILE_PRIVATE(_MEM, RES_LIMIT),</span></span>
<span class="line"><span>        .write = mem_cgroup_write,</span></span>
<span class="line"><span>        .read_u64 = mem_cgroup_read_u64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .name = &quot;soft_limit_in_bytes&quot;,</span></span>
<span class="line"><span>        .private = MEMFILE_PRIVATE(_MEM, RES_SOFT_LIMIT),</span></span>
<span class="line"><span>        .write = mem_cgroup_write,</span></span>
<span class="line"><span>        .read_u64 = mem_cgroup_read_u64,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果设置的是cpu.shares，则调用cpu_shares_write_u64。在这里面，task_group的shares变量更新了，并且更新了CPU队列上的调度实体。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int sched_group_set_shares(struct task_group *tg, unsigned long shares)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int i;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	shares = clamp(shares, scale_load(MIN_SHARES), scale_load(MAX_SHARES));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tg-&amp;gt;shares = shares;</span></span>
<span class="line"><span>	for_each_possible_cpu(i) {</span></span>
<span class="line"><span>		struct rq *rq = cpu_rq(i);</span></span>
<span class="line"><span>		struct sched_entity *se = tg-&amp;gt;se[i];</span></span>
<span class="line"><span>		struct rq_flags rf;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		update_rq_clock(rq);</span></span>
<span class="line"><span>		for_each_sched_entity(se) {</span></span>
<span class="line"><span>			update_load_avg(se, UPDATE_TG);</span></span>
<span class="line"><span>			update_cfs_shares(se);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但是这个时候别忘了，我们还没有将CPU的文件夹下面的tasks文件写入进程号呢。写入一个进程号到tasks文件里面，按照cgroup1_base_files里面的定义，我们应该调用cgroup_tasks_write。</p><p>接下来的调用链为：cgroup_tasks_write-&gt;__cgroup_procs_write-&gt;cgroup_attach_task-&gt; cgroup_migrate-&gt;cgroup_migrate_execute。将这个进程和一个cgroup关联起来，也即将这个进程迁移到这个cgroup下面。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int cgroup_migrate_execute(struct cgroup_mgctx *mgctx)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct cgroup_taskset *tset = &amp;mgctx-&amp;gt;tset;</span></span>
<span class="line"><span>	struct cgroup_subsys *ss;</span></span>
<span class="line"><span>	struct task_struct *task, *tmp_task;</span></span>
<span class="line"><span>	struct css_set *cset, *tmp_cset;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (tset-&amp;gt;nr_tasks) {</span></span>
<span class="line"><span>		do_each_subsys_mask(ss, ssid, mgctx-&amp;gt;ss_mask) {</span></span>
<span class="line"><span>			if (ss-&amp;gt;attach) {</span></span>
<span class="line"><span>				tset-&amp;gt;ssid = ssid;</span></span>
<span class="line"><span>				ss-&amp;gt;attach(tset);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		} while_each_subsys_mask();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>每一个cgroup子系统会调用相应的attach函数。而CPU调用的是cpu_cgroup_attach-&gt; sched_move_task-&gt; sched_change_group。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void sched_change_group(struct task_struct *tsk, int type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct task_group *tg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tg = container_of(task_css_check(tsk, cpu_cgrp_id, true),</span></span>
<span class="line"><span>			  struct task_group, css);</span></span>
<span class="line"><span>	tg = autogroup_task_group(tsk, tg);</span></span>
<span class="line"><span>	tsk-&amp;gt;sched_task_group = tg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef CONFIG_FAIR_GROUP_SCHED</span></span>
<span class="line"><span>	if (tsk-&amp;gt;sched_class-&amp;gt;task_change_group)</span></span>
<span class="line"><span>		tsk-&amp;gt;sched_class-&amp;gt;task_change_group(tsk, type);</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>		set_task_rq(tsk, task_cpu(tsk));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在sched_change_group中设置这个进程以这个task_group的方式参与调度，从而使得上面的cpu.shares起作用。</p><p>对于内存来讲，写入内存的限制使用函数mem_cgroup_write-&gt;mem_cgroup_resize_limit来设置struct mem_cgroup的memory.limit成员。</p><p>在进程执行过程中，申请内存的时候，我们会调用handle_pte_fault-&gt;do_anonymous_page()-&gt;mem_cgroup_try_charge()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int mem_cgroup_try_charge(struct page *page, struct mm_struct *mm,</span></span>
<span class="line"><span>			  gfp_t gfp_mask, struct mem_cgroup **memcgp,</span></span>
<span class="line"><span>			  bool compound)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct mem_cgroup *memcg = NULL;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	if (!memcg)</span></span>
<span class="line"><span>		memcg = get_mem_cgroup_from_mm(mm);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ret = try_charge(memcg, gfp_mask, nr_pages);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在mem_cgroup_try_charge中，先是调用get_mem_cgroup_from_mm获得这个进程对应的mem_cgroup结构，然后在try_charge中，根据mem_cgroup的限制，看是否可以申请分配内存。</p><p>至此，cgroup对于内存的限制才真正起作用。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>内核中cgroup的工作机制，我们在这里总结一下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/115582/c9cc56d20e6a4bac0f9657e6380a96c4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/115582/c9cc56d20e6a4bac0f9657e6380a96c4.png" alt=""></a></p><p>第一步，系统初始化的时候，初始化cgroup的各个子系统的操作函数，分配各个子系统的数据结构。</p><p>第二步，mount cgroup文件系统，创建文件系统的树形结构，以及操作函数。</p><p>第三步，写入cgroup文件，设置cpu或者memory的相关参数，这个时候文件系统的操作函数会调用到cgroup子系统的操作函数，从而将参数设置到cgroup子系统的数据结构中。</p><p>第四步，写入tasks文件，将进程交给某个cgroup进行管理，因为tasks文件也是一个cgroup文件，统一会调用文件系统的操作函数进而调用cgroup子系统的操作函数，将cgroup子系统的数据结构和进程关联起来。</p><p>第五步，对于CPU来讲，会修改scheduled entity，放入相应的队列里面去，从而下次调度的时候就起作用了。对于内存的cgroup设定，只有在申请内存的时候才起作用。</p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>这里我们用cgroup限制了CPU和内存，如何限制网络呢？给你一个提示tc，请你研究一下。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>`,108)])])}const m=n(t,[["render",c]]);export{g as __pageData,m as default};
