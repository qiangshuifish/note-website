import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"57 | Namespace技术：内部创业公司应该独立运营","description":"","frontmatter":{},"headers":[{"level":2,"title":"总结时刻","slug":"总结时刻","link":"#总结时刻","children":[]},{"level":2,"title":"课堂练习","slug":"课堂练习","link":"#课堂练习","children":[]}],"relativePath":"趣谈Linux操作系统/57-Namespace技术：内部创业公司应该独立运营.md","filePath":"趣谈Linux操作系统/57-Namespace技术：内部创业公司应该独立运营.md","lastUpdated":1779822193000}'),t={name:"趣谈Linux操作系统/57-Namespace技术：内部创业公司应该独立运营.md"};function l(i,s,c,o,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_57-namespace技术-内部创业公司应该独立运营" tabindex="-1">57 | Namespace技术：内部创业公司应该独立运营 <a class="header-anchor" href="#_57-namespace技术-内部创业公司应该独立运营" aria-label="Permalink to &quot;57 | Namespace技术：内部创业公司应该独立运营&quot;">​</a></h1><p>上一节我们讲了Docker的基本原理，今天我们来看一下，“看起来隔离的”技术namespace在内核里面是如何工作的。</p><p>既然容器是一种类似公司内部创业的技术，我们可以设想一下，如果一个创新项目要独立运营，应该成立哪些看起来独立的组织和部门呢？</p><p>首先是 <strong>用户管理</strong>，咱们这个小分队应该有自己独立的用户和组管理体系，公司里面并不是任何人都知道我们在做什么。</p><p>其次是 <strong>项目管理</strong>，咱们应该有自己独立的项目管理体系，不能按照大公司的来。</p><p>然后是 <strong>档案管理</strong>，咱们这个创新项目的资料一定要保密，要不然创意让人家偷走了可不好。</p><p>最后就是 <strong>合作部</strong>，咱们这个小分队还是要和公司其他部门或者其他公司合作的，所以需要一个外向的人来干这件事情。</p><p>对应到容器技术，为了隔离不同类型的资源，Linux内核里面实现了以下几种不同类型的namespace。</p><ul><li>UTS，对应的宏为CLONE_NEWUTS，表示不同的namespace可以配置不同的hostname。</li><li>User，对应的宏为CLONE_NEWUSER，表示不同的namespace可以配置不同的用户和组。</li><li>Mount，对应的宏为CLONE_NEWNS，表示不同的namespace的文件系统挂载点是隔离的</li><li>PID，对应的宏为CLONE_NEWPID，表示不同的namespace有完全独立的pid，也即一个namespace的进程和另一个namespace的进程，pid可以是一样的，但是代表不同的进程。</li><li>Network，对应的宏为CLONE_NEWNET，表示不同的namespace有独立的网络协议栈。</li></ul><p>还记得咱们启动的那个容器吗？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># docker ps</span></span>
<span class="line"><span>CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES</span></span>
<span class="line"><span>f604f0e34bc2        testnginx:1         &quot;/bin/sh -c &#39;nginx -…&quot;   17 hours ago        Up 17 hours         0.0.0.0:8081-&amp;gt;80/tcp   youthful_torvalds</span></span></code></pre></div><p>我们可以看这个容器对应的entrypoint的pid。通过docker inspect命令，可以看到，进程号为58212。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root&amp;#64;deployer ~]# docker inspect f604f0e34bc2</span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        &quot;Id&quot;: &quot;f604f0e34bc263bc32ba683d97a1db2a65de42ab052da16df3c7811ad07f0dc3&quot;,</span></span>
<span class="line"><span>        &quot;Created&quot;: &quot;2019-07-15T17:43:44.158300531Z&quot;,</span></span>
<span class="line"><span>        &quot;Path&quot;: &quot;/bin/sh&quot;,</span></span>
<span class="line"><span>        &quot;Args&quot;: [</span></span>
<span class="line"><span>            &quot;-c&quot;,</span></span>
<span class="line"><span>            &quot;nginx -g \\&quot;daemon off;\\&quot;&quot;</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>        &quot;State&quot;: {</span></span>
<span class="line"><span>            &quot;Status&quot;: &quot;running&quot;,</span></span>
<span class="line"><span>            &quot;Running&quot;: true,</span></span>
<span class="line"><span>            &quot;Pid&quot;: 58212,</span></span>
<span class="line"><span>            &quot;ExitCode&quot;: 0,</span></span>
<span class="line"><span>            &quot;StartedAt&quot;: &quot;2019-07-15T17:43:44.651756682Z&quot;,</span></span>
<span class="line"><span>            &quot;FinishedAt&quot;: &quot;0001-01-01T00:00:00Z&quot;</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        &quot;Name&quot;: &quot;/youthful_torvalds&quot;,</span></span>
<span class="line"><span>        &quot;RestartCount&quot;: 0,</span></span>
<span class="line"><span>        &quot;Driver&quot;: &quot;overlay2&quot;,</span></span>
<span class="line"><span>        &quot;Platform&quot;: &quot;linux&quot;,</span></span>
<span class="line"><span>        &quot;HostConfig&quot;: {</span></span>
<span class="line"><span>            &quot;NetworkMode&quot;: &quot;default&quot;,</span></span>
<span class="line"><span>            &quot;PortBindings&quot;: {</span></span>
<span class="line"><span>                &quot;80/tcp&quot;: [</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        &quot;HostIp&quot;: &quot;&quot;,</span></span>
<span class="line"><span>                        &quot;HostPort&quot;: &quot;8081&quot;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                ]</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        &quot;Config&quot;: {</span></span>
<span class="line"><span>            &quot;Hostname&quot;: &quot;f604f0e34bc2&quot;,</span></span>
<span class="line"><span>            &quot;ExposedPorts&quot;: {</span></span>
<span class="line"><span>                &quot;80/tcp&quot;: {}</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>            &quot;Image&quot;: &quot;testnginx:1&quot;,</span></span>
<span class="line"><span>            &quot;Entrypoint&quot;: [</span></span>
<span class="line"><span>                &quot;/bin/sh&quot;,</span></span>
<span class="line"><span>                &quot;-c&quot;,</span></span>
<span class="line"><span>                &quot;nginx -g \\&quot;daemon off;\\&quot;&quot;</span></span>
<span class="line"><span>            ],</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        &quot;NetworkSettings&quot;: {</span></span>
<span class="line"><span>            &quot;Bridge&quot;: &quot;&quot;,</span></span>
<span class="line"><span>            &quot;SandboxID&quot;: &quot;7fd3eb469578903b66687090e512958658ae28d17bce1a7cee2da3148d1dfad4&quot;,</span></span>
<span class="line"><span>            &quot;Ports&quot;: {</span></span>
<span class="line"><span>                &quot;80/tcp&quot;: [</span></span>
<span class="line"><span>                    {</span></span>
<span class="line"><span>                        &quot;HostIp&quot;: &quot;0.0.0.0&quot;,</span></span>
<span class="line"><span>                        &quot;HostPort&quot;: &quot;8081&quot;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                ]</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>            &quot;Gateway&quot;: &quot;172.17.0.1&quot;,</span></span>
<span class="line"><span>            &quot;IPAddress&quot;: &quot;172.17.0.3&quot;,</span></span>
<span class="line"><span>            &quot;IPPrefixLen&quot;: 16,</span></span>
<span class="line"><span>            &quot;MacAddress&quot;: &quot;02:42:ac:11:00:03&quot;,</span></span>
<span class="line"><span>            &quot;Networks&quot;: {</span></span>
<span class="line"><span>                &quot;bridge&quot;: {</span></span>
<span class="line"><span>                    &quot;NetworkID&quot;: &quot;c8eef1603afb399bf17af154be202fd1e543d3772cc83ef4a1ca3f97b8bd6eda&quot;,</span></span>
<span class="line"><span>                    &quot;EndpointID&quot;: &quot;8d9bb18ca57889112e758ede193d2cfb45cbf794c9d952819763c08f8545da46&quot;,</span></span>
<span class="line"><span>                    &quot;Gateway&quot;: &quot;172.17.0.1&quot;,</span></span>
<span class="line"><span>                    &quot;IPAddress&quot;: &quot;172.17.0.3&quot;,</span></span>
<span class="line"><span>                    &quot;IPPrefixLen&quot;: 16,</span></span>
<span class="line"><span>                    &quot;MacAddress&quot;: &quot;02:42:ac:11:00:03&quot;,</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>]</span></span></code></pre></div><p>如果我们用ps查看机器上的nginx进程，可以看到master和worker，worker的父进程是master。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ps -ef |grep nginx</span></span>
<span class="line"><span>root     58212 58195  0 01:43 ?        00:00:00 /bin/sh -c nginx -g &quot;daemon off;&quot;</span></span>
<span class="line"><span>root     58244 58212  0 01:43 ?        00:00:00 nginx: master process nginx -g daemon off;</span></span>
<span class="line"><span>33       58250 58244  0 01:43 ?        00:00:00 nginx: worker process</span></span>
<span class="line"><span>33       58251 58244  0 01:43 ?        00:00:05 nginx: worker process</span></span>
<span class="line"><span>33       58252 58244  0 01:43 ?        00:00:05 nginx: worker process</span></span>
<span class="line"><span>33       58253 58244  0 01:43 ?        00:00:05 nginx: worker process</span></span></code></pre></div><p>在/proc/pid/ns里面，我们能够看到这个进程所属于的6种namespace。我们拿出两个进程来，应该可以看出来，它们属于同一个namespace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ls -l /proc/58212/ns</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 0 Jul 16 19:19 ipc -&amp;gt; ipc:[4026532278]</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 0 Jul 16 19:19 mnt -&amp;gt; mnt:[4026532276]</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 0 Jul 16 01:43 net -&amp;gt; net:[4026532281]</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 0 Jul 16 19:19 pid -&amp;gt; pid:[4026532279]</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 0 Jul 16 19:19 user -&amp;gt; user:[4026531837]</span></span>
<span class="line"><span>lrwxrwxrwx 1 root root 0 Jul 16 19:19 uts -&amp;gt; uts:[4026532277]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ls -l /proc/58253/ns</span></span>
<span class="line"><span>lrwxrwxrwx 1 33 tape 0 Jul 16 19:20 ipc -&amp;gt; ipc:[4026532278]</span></span>
<span class="line"><span>lrwxrwxrwx 1 33 tape 0 Jul 16 19:20 mnt -&amp;gt; mnt:[4026532276]</span></span>
<span class="line"><span>lrwxrwxrwx 1 33 tape 0 Jul 16 19:20 net -&amp;gt; net:[4026532281]</span></span>
<span class="line"><span>lrwxrwxrwx 1 33 tape 0 Jul 16 19:20 pid -&amp;gt; pid:[4026532279]</span></span>
<span class="line"><span>lrwxrwxrwx 1 33 tape 0 Jul 16 19:20 user -&amp;gt; user:[4026531837]</span></span>
<span class="line"><span>lrwxrwxrwx 1 33 tape 0 Jul 16 19:20 uts -&amp;gt; uts:[4026532277]</span></span></code></pre></div><p>接下来，我们来看，如何操作namespace。这里我们重点关注pid和network。</p><p>操作namespace的常用指令 <strong>nsenter</strong>，可以用来运行一个进程，进入指定的namespace。例如，通过下面的命令，我们可以运行/bin/bash，并且进入nginx所在容器的namespace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># nsenter --target 58212 --mount --uts --ipc --net --pid -- env --ignore-environment -- /bin/bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span>root&amp;#64;f604f0e34bc2:/# ip addr</span></span>
<span class="line"><span>1: lo: &amp;lt;LOOPBACK,UP,LOWER_UP&amp;gt; mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000</span></span>
<span class="line"><span>    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00</span></span>
<span class="line"><span>    inet 127.0.0.1/8 scope host lo</span></span>
<span class="line"><span>       valid_lft forever preferred_lft forever</span></span>
<span class="line"><span>23: eth0&amp;#64;if24: &amp;lt;BROADCAST,MULTICAST,UP,LOWER_UP&amp;gt; mtu 1500 qdisc noqueue state UP group default</span></span>
<span class="line"><span>    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff</span></span>
<span class="line"><span>    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0</span></span>
<span class="line"><span>       valid_lft forever preferred_lft forever</span></span></code></pre></div><p>另一个命令是 <strong>unshare</strong>，它会离开当前的namespace，创建且加入新的namespace，然后执行参数中指定的命令。</p><p>例如，运行下面这行命令之后，pid和net都进入了新的namespace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>unshare --mount --ipc --pid --net --mount-proc=/proc --fork /bin/bash</span></span></code></pre></div><p>如果从shell上运行上面这行命令的话，好像没有什么变化，但是因为pid和net都进入了新的namespace，所以我们查看进程列表和ip地址的时候应该会发现有所不同。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ip addr</span></span>
<span class="line"><span>1: lo: &amp;lt;LOOPBACK&amp;gt; mtu 65536 qdisc noop state DOWN group default qlen 1000</span></span>
<span class="line"><span>    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ps aux</span></span>
<span class="line"><span>USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND</span></span>
<span class="line"><span>root         1  0.0  0.0 115568  2136 pts/0    S    22:55   0:00 /bin/bash</span></span>
<span class="line"><span>root        13  0.0  0.0 155360  1872 pts/0    R+   22:55   0:00 ps aux</span></span></code></pre></div><p>果真，我们看不到宿主机上的IP地址和网卡了，也看不到宿主机上的所有进程了。</p><p>另外，我们还可以通过函数操作namespace。</p><p>第一个函数是 <strong>clone</strong>，也就是创建一个新的进程，并把它放到新的namespace中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int clone(int (*fn)(void *), void *child_stack, int flags, void *arg);</span></span></code></pre></div><p>clone函数我们原来介绍过。这里面有一个参数flags，原来我们没有注意它。其实它可以设置为CLONE_NEWUTS、CLONE_NEWUSER、CLONE_NEWNS、CLONE_NEWPID。CLONE_NEWNET会将clone出来的新进程放到新的namespace中。</p><p>第二个函数是 <strong>setns</strong>，用于将当前进程加入到已有的namespace中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int setns(int fd, int nstype);</span></span></code></pre></div><p>其中，fd指向/proc/[pid]/ns/目录里相应namespace对应的文件，表示要加入哪个namespace。nstype用来指定namespace的类型，可以设置为CLONE_NEWUTS、CLONE_NEWUSER、CLONE_NEWNS、CLONE_NEWPID和CLONE_NEWNET。</p><p>第三个函数是 <strong>unshare</strong>，它可以使当前进程退出当前的namespace，并加入到新创建的namespace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int unshare(int flags);</span></span></code></pre></div><p>其中，flags用于指定一个或者多个上面的CLONE_NEWUTS、CLONE_NEWUSER、CLONE_NEWNS、CLONE_NEWPID和CLONE_NEWNET。</p><p>clone和unshare的区别是，unshare是使当前进程加入新的namespace；clone是创建一个新的子进程，然后让子进程加入新的namespace，而当前进程保持不变。</p><p>这里我们尝试一下，通过clone函数来进入一个namespace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define _GNU_SOURCE</span></span>
<span class="line"><span>#include &amp;lt;sys/wait.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sys/utsname.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;sched.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;unistd.h&amp;gt;</span></span>
<span class="line"><span>#define STACK_SIZE (1024 * 1024)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int childFunc(void *arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    printf(&quot;In child process.\\n&quot;);</span></span>
<span class="line"><span>    execlp(&quot;bash&quot;, &quot;bash&quot;, (char *) NULL);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    char *stack;</span></span>
<span class="line"><span>    char *stackTop;</span></span>
<span class="line"><span>    pid_t pid;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    stack = malloc(STACK_SIZE);</span></span>
<span class="line"><span>    if (stack == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        perror(&quot;malloc&quot;);</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    stackTop = stack + STACK_SIZE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    pid = clone(childFunc, stackTop, CLONE_NEWNS|CLONE_NEWPID|CLONE_NEWNET|SIGCHLD, NULL);</span></span>
<span class="line"><span>    if (pid == -1)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        perror(&quot;clone&quot;);</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    printf(&quot;clone() returned %ld\\n&quot;, (long) pid);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sleep(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (waitpid(pid, NULL, 0) == -1)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        perror(&quot;waitpid&quot;);</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    printf(&quot;child has terminated\\n&quot;);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面的代码中，我们调用clone的时候，给的参数是CLONE_NEWNS|CLONE_NEWPID|CLONE_NEWNET，也就是说，我们会进入一个新的pid、network，以及mount的namespace。</p><p>如果我们编译运行它，可以得到下面的结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># echo $$</span></span>
<span class="line"><span>64267</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ps aux | grep bash | grep -v grep</span></span>
<span class="line"><span>root     64267  0.0  0.0 115572  2176 pts/0    Ss   16:53   0:00 -bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ./a.out</span></span>
<span class="line"><span>clone() returned 64360</span></span>
<span class="line"><span>In child process.</span></span>
<span class="line"><span></span></span>
<span class="line"><span># echo $$</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ip addr</span></span>
<span class="line"><span>1: lo: &amp;lt;LOOPBACK&amp;gt; mtu 65536 qdisc noop state DOWN group default qlen 1000</span></span>
<span class="line"><span>    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00</span></span>
<span class="line"><span></span></span>
<span class="line"><span># exit</span></span>
<span class="line"><span>exit</span></span>
<span class="line"><span>child has terminated</span></span>
<span class="line"><span></span></span>
<span class="line"><span># echo $$</span></span>
<span class="line"><span>64267</span></span></code></pre></div><p>通过 <code>echo $$</code>，我们可以得到当前bash的进程号。一旦运行了上面的程序，我们就会进入一个新的pid的namespace。</p><p>当我们再次 <code>echo $$</code> 的时候就会发现，当前bash的进程号变成了1。上面的程序运行了一个新的bash，它在一个独立的pid namespace里面，自己是1号进程。如果运行ip addr，可以看到，宿主机的网卡都找不到了，因为新的bash也在一个独立的network namespace里面，等退出了，再次echo $$的时候，就可以得到原来进程号。</p><p>clone系统调用我们在 <a href="https://time.geekbang.org/column/article/94064" target="_blank" rel="noreferrer">进程的创建</a> 那一节解析过，当时我们没有看关于namespace的代码，现在我们就来看一看，namespace在内核做了哪些事情。</p><p>在内核里面，clone会调用_do_fork-&gt;copy_process-&gt;copy_namespaces，也就是说，在创建子进程的时候，有一个机会可以复制和设置namespace。</p><p>namespace是在哪里定义的呢？在每一个进程的task_struct里面，有一个指向namespace结构体的指针nsproxy。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct task_struct {</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	/* Namespaces: */</span></span>
<span class="line"><span>	struct nsproxy			*nsproxy;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * A structure to contain pointers to all per-process</span></span>
<span class="line"><span> * namespaces - fs (mount), uts, network, sysvipc, etc.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * The pid namespace is an exception -- it&#39;s accessed using</span></span>
<span class="line"><span> * task_active_pid_ns.  The pid namespace here is the</span></span>
<span class="line"><span> * namespace that children will use.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>struct nsproxy {</span></span>
<span class="line"><span>	atomic_t count;</span></span>
<span class="line"><span>	struct uts_namespace *uts_ns;</span></span>
<span class="line"><span>	struct ipc_namespace *ipc_ns;</span></span>
<span class="line"><span>	struct mnt_namespace *mnt_ns;</span></span>
<span class="line"><span>	struct pid_namespace *pid_ns_for_children;</span></span>
<span class="line"><span>	struct net 	     *net_ns;</span></span>
<span class="line"><span>	struct cgroup_namespace *cgroup_ns;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>我们可以看到在struct nsproxy结构里面，有我们上面讲过的各种namespace。</p><p>在系统初始化的时候，有一个默认的init_nsproxy。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct nsproxy init_nsproxy = {</span></span>
<span class="line"><span>	.count			= ATOMIC_INIT(1),</span></span>
<span class="line"><span>	.uts_ns			= &amp;init_uts_ns,</span></span>
<span class="line"><span>#if defined(CONFIG_POSIX_MQUEUE) || defined(CONFIG_SYSVIPC)</span></span>
<span class="line"><span>	.ipc_ns			= &amp;init_ipc_ns,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>	.mnt_ns			= NULL,</span></span>
<span class="line"><span>	.pid_ns_for_children	= &amp;init_pid_ns,</span></span>
<span class="line"><span>#ifdef CONFIG_NET</span></span>
<span class="line"><span>	.net_ns			= &amp;init_net,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#ifdef CONFIG_CGROUPS</span></span>
<span class="line"><span>	.cgroup_ns		= &amp;init_cgroup_ns,</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>下面，我们来看copy_namespaces的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * called from clone.  This now handles copy for nsproxy and all</span></span>
<span class="line"><span> * namespaces therein.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>int copy_namespaces(unsigned long flags, struct task_struct *tsk)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct nsproxy *old_ns = tsk-&amp;gt;nsproxy;</span></span>
<span class="line"><span>	struct user_namespace *user_ns = task_cred_xxx(tsk, user_ns);</span></span>
<span class="line"><span>	struct nsproxy *new_ns;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (likely(!(flags &amp; (CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC |</span></span>
<span class="line"><span>			      CLONE_NEWPID | CLONE_NEWNET |</span></span>
<span class="line"><span>			      CLONE_NEWCGROUP)))) {</span></span>
<span class="line"><span>		get_nsproxy(old_ns);</span></span>
<span class="line"><span>		return 0;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!ns_capable(user_ns, CAP_SYS_ADMIN))</span></span>
<span class="line"><span>		return -EPERM;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_ns = create_new_namespaces(flags, tsk, user_ns, tsk-&amp;gt;fs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	tsk-&amp;gt;nsproxy = new_ns;</span></span>
<span class="line"><span>	return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果clone的参数里面没有CLONE_NEWNS | CLONE_NEWUTS | CLONE_NEWIPC | CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWCGROUP，就返回原来的namespace，调用get_nsproxy。</p><p>接着，我们调用create_new_namespaces。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * Create new nsproxy and all of its the associated namespaces.</span></span>
<span class="line"><span> * Return the newly created nsproxy.  Do not attach this to the task,</span></span>
<span class="line"><span> * leave it to the caller to do proper locking and attach it to task.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static struct nsproxy *create_new_namespaces(unsigned long flags,</span></span>
<span class="line"><span>	struct task_struct *tsk, struct user_namespace *user_ns,</span></span>
<span class="line"><span>	struct fs_struct *new_fs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct nsproxy *new_nsp;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	new_nsp = create_nsproxy();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_nsp-&amp;gt;mnt_ns = copy_mnt_ns(flags, tsk-&amp;gt;nsproxy-&amp;gt;mnt_ns, user_ns, new_fs);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_nsp-&amp;gt;uts_ns = copy_utsname(flags, user_ns, tsk-&amp;gt;nsproxy-&amp;gt;uts_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_nsp-&amp;gt;ipc_ns = copy_ipcs(flags, user_ns, tsk-&amp;gt;nsproxy-&amp;gt;ipc_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_nsp-&amp;gt;pid_ns_for_children =</span></span>
<span class="line"><span>		copy_pid_ns(flags, user_ns, tsk-&amp;gt;nsproxy-&amp;gt;pid_ns_for_children);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_nsp-&amp;gt;cgroup_ns = copy_cgroup_ns(flags, user_ns,</span></span>
<span class="line"><span>					    tsk-&amp;gt;nsproxy-&amp;gt;cgroup_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	new_nsp-&amp;gt;net_ns = copy_net_ns(flags, user_ns, tsk-&amp;gt;nsproxy-&amp;gt;net_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return new_nsp;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在create_new_namespaces中，我们可以看到对于各种namespace的复制。</p><p>我们来看copy_pid_ns对于pid namespace的复制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct pid_namespace *copy_pid_ns(unsigned long flags,</span></span>
<span class="line"><span>	struct user_namespace *user_ns, struct pid_namespace *old_ns)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	if (!(flags &amp; CLONE_NEWPID))</span></span>
<span class="line"><span>		return get_pid_ns(old_ns);</span></span>
<span class="line"><span>	if (task_active_pid_ns(current) != old_ns)</span></span>
<span class="line"><span>		return ERR_PTR(-EINVAL);</span></span>
<span class="line"><span>	return create_pid_namespace(user_ns, old_ns);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在copy_pid_ns中，如果没有设置CLONE_NEWPID，则返回老的pid namespace；如果设置了，就调用create_pid_namespace，创建新的pid namespace.</p><p>我们再来看copy_net_ns对于network namespace的复制。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct net *copy_net_ns(unsigned long flags,</span></span>
<span class="line"><span>			struct user_namespace *user_ns, struct net *old_net)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	struct ucounts *ucounts;</span></span>
<span class="line"><span>	struct net *net;</span></span>
<span class="line"><span>	int rv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if (!(flags &amp; CLONE_NEWNET))</span></span>
<span class="line"><span>		return get_net(old_net);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	ucounts = inc_net_namespaces(user_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	net = net_alloc();</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	get_user_ns(user_ns);</span></span>
<span class="line"><span>	net-&amp;gt;ucounts = ucounts;</span></span>
<span class="line"><span>	rv = setup_net(net, user_ns);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	return net;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这里面，我们需要判断，如果flags中不包含CLONE_NEWNET，也就是不会创建一个新的network namespace，则返回old_net；否则需要新建一个network namespace。</p><p>然后，copy_net_ns会调用net = net_alloc()，分配一个新的struct net结构，然后调用setup_net对新分配的net结构进行初始化，之后调用list_add_tail_rcu，将新建的network namespace，添加到全局的network namespace列表net_namespace_list中。</p><p>我们来看一下setup_net的实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> * setup_net runs the initializers for the network namespace object.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>static __net_init int setup_net(struct net *net, struct user_namespace *user_ns)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	/* Must be called with net_mutex held */</span></span>
<span class="line"><span>	const struct pernet_operations *ops, *saved_ops;</span></span>
<span class="line"><span>	LIST_HEAD(net_exit_list);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	atomic_set(&amp;net-&amp;gt;count, 1);</span></span>
<span class="line"><span>	refcount_set(&amp;net-&amp;gt;passive, 1);</span></span>
<span class="line"><span>	net-&amp;gt;dev_base_seq = 1;</span></span>
<span class="line"><span>	net-&amp;gt;user_ns = user_ns;</span></span>
<span class="line"><span>	idr_init(&amp;net-&amp;gt;netns_ids);</span></span>
<span class="line"><span>	spin_lock_init(&amp;net-&amp;gt;nsid_lock);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	list_for_each_entry(ops, &amp;pernet_list, list) {</span></span>
<span class="line"><span>		error = ops_init(ops, net);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在setup_net中，这里面有一个循环list_for_each_entry，对于pernet_list的每一项struct pernet_operations，运行ops_init，也就是调用pernet_operations的init函数。</p><p>这个pernet_list是怎么来的呢？在网络设备初始化的时候，我们要调用net_dev_init函数，这里面有下面的代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>register_pernet_device(&amp;loopback_net_ops)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int register_pernet_device(struct pernet_operations *ops)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	int error;</span></span>
<span class="line"><span>	mutex_lock(&amp;net_mutex);</span></span>
<span class="line"><span>	error = register_pernet_operations(&amp;pernet_list, ops);</span></span>
<span class="line"><span>	if (!error &amp;&amp; (first_device == &amp;pernet_list))</span></span>
<span class="line"><span>		first_device = &amp;ops-&amp;gt;list;</span></span>
<span class="line"><span>	mutex_unlock(&amp;net_mutex);</span></span>
<span class="line"><span>	return error;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct pernet_operations __net_initdata loopback_net_ops = {</span></span>
<span class="line"><span>        .init = loopback_net_init,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>register_pernet_device函数注册了一个loopback_net_ops，在这里面，把init函数设置为loopback_net_init.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static __net_init int loopback_net_init(struct net *net)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>        struct net_device *dev;</span></span>
<span class="line"><span>        dev = alloc_netdev(0, &quot;lo&quot;, NET_NAME_UNKNOWN, loopback_setup);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        dev_net_set(dev, net);</span></span>
<span class="line"><span>        err = register_netdev(dev);</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>        net-&amp;gt;loopback_dev = dev;</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在loopback_net_init函数中，我们会创建并且注册一个名字为&quot;lo&quot;的struct net_device。注册完之后，在这个namespace里面就会出现一个这样的网络设备，称为loopback网络设备。</p><p>这就是为什么上面的实验中，创建出的新的network namespace里面有一个lo网络设备。</p><h2 id="总结时刻" tabindex="-1">总结时刻 <a class="header-anchor" href="#总结时刻" aria-label="Permalink to &quot;总结时刻&quot;">​</a></h2><p>这一节我们讲了namespace相关的技术，有六种类型，分别是UTS、User、Mount、Pid、Network和IPC。</p><p>还有两个常用的命令nsenter和unshare，主要用于操作Namespace，有三个常用的函数clone、setns和unshare。</p><p>在内核里面，对于任何一个进程task_struct来讲，里面都会有一个成员struct nsproxy，用于保存namespace相关信息，里面有 struct uts_namespace、struct ipc_namespace、struct mnt_namespace、struct pid_namespace、struct net *net_ns和struct cgroup_namespace *cgroup_ns。</p><p>创建namespace的时候，我们在内核中会调用copy_namespaces，调用顺序依次是copy_mnt_ns、copy_utsname、copy_ipcs、copy_pid_ns、copy_cgroup_ns和copy_net_ns，来复制namespace。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/113692/56bb9502b58628ff3d1bee83b6f53cd7.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/113692/56bb9502b58628ff3d1bee83b6f53cd7.png" alt=""></a></p><h2 id="课堂练习" tabindex="-1">课堂练习 <a class="header-anchor" href="#课堂练习" aria-label="Permalink to &quot;课堂练习&quot;">​</a></h2><p>网络的Namespace有一个非常好的命令ip netns。请你研究一下这个命令，并且创建一个容器，用这个命令查看网络namespace。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/113692/8c0a95fa07a8b9a1abfd394479bdd637.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%B6%A3%E8%B0%88Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/images/113692/8c0a95fa07a8b9a1abfd394479bdd637.jpg" alt=""></a></p>`,83)])])}const g=n(t,[["render",l]]);export{_ as __pageData,g as default};
