import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"37 | 从内核到应用：网络数据在内核中如何流转","description":"","frontmatter":{},"headers":[{"level":2,"title":"先看看一次具体的网络发收过程","slug":"先看看一次具体的网络发收过程","link":"#先看看一次具体的网络发收过程","children":[{"level":3,"title":"发送过程总览","slug":"发送过程总览","link":"#发送过程总览","children":[]},{"level":3,"title":"接收过程总览","slug":"接收过程总览","link":"#接收过程总览","children":[]}]},{"level":2,"title":"认识一下lwIP架构","slug":"认识一下lwip架构","link":"#认识一下lwip架构","children":[{"level":3,"title":"lwIP的三套应用程序编程接口","slug":"lwip的三套应用程序编程接口","link":"#lwip的三套应用程序编程接口","children":[]}]},{"level":2,"title":"lwIP执行流程","slug":"lwip执行流程","link":"#lwip执行流程","children":[{"level":3,"title":"数据发送","slug":"数据发送","link":"#数据发送","children":[]},{"level":3,"title":"数据接收","slug":"数据接收","link":"#数据接收","children":[]}]},{"level":2,"title":"协议栈移植","slug":"协议栈移植","link":"#协议栈移植","children":[{"level":3,"title":"有操作系统模式","slug":"有操作系统模式","link":"#有操作系统模式","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/37-从内核到应用：网络数据在内核中如何流转.md","filePath":"操作系统实战45讲/37-从内核到应用：网络数据在内核中如何流转.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/37-从内核到应用：网络数据在内核中如何流转.md"};function t(i,s,c,o,r,h){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_37-从内核到应用-网络数据在内核中如何流转" tabindex="-1">37 | 从内核到应用：网络数据在内核中如何流转 <a class="header-anchor" href="#_37-从内核到应用-网络数据在内核中如何流转" aria-label="Permalink to &quot;37 | 从内核到应用：网络数据在内核中如何流转&quot;">​</a></h1><p>你好，我是 LMOS。</p><p>上节课我们对一次请求到响应的过程积累了一些宏观认识，相信你已经对整个网络架构有了一个整体蓝图。这节课，让我们来仔细研究一下网络数据是如何在内核中流转的，让你开阔视野，真正理解底层工程的实现思路。</p><p>凡事先问目的，在网络数据在内核中的流转，最终要服务于网络收发功能。所以，我会先带你了解一次具体的网络发收过程，然后带你了解lwIP的网络数据收发。有了这些基础，我还会示范一下如何实现协议栈移植，你可以在课后自行动手拓展。</p><p>好，让我们正式开始今天的学习吧。课程配套代码，你可以点击 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson37/Cosmos" target="_blank" rel="noreferrer">这里</a> 获取。</p><h2 id="先看看一次具体的网络发收过程" tabindex="-1">先看看一次具体的网络发收过程 <a class="header-anchor" href="#先看看一次具体的网络发收过程" aria-label="Permalink to &quot;先看看一次具体的网络发收过程&quot;">​</a></h2><p>理解软件的设计思想，最重要的是先要理解需求。而内核中的数据流转也只是为了满足网络收发的需求而进行的设计。</p><h3 id="发送过程总览" tabindex="-1">发送过程总览 <a class="header-anchor" href="#发送过程总览" aria-label="Permalink to &quot;发送过程总览&quot;">​</a></h3><p>下面我们一起来看看应用程序通过网络发送数据的全过程。</p><p>应用程序首先会准备好数据，调用用户态下的库函数。接着调用系统API接口函数，进入到内核态。</p><p>内核态对应的系统服务函数会复制应用程序的数据到内核的内存空间中，然后将数据移交给网络协议栈，在网络协议栈中将数据层层打包。</p><p>最后，包装好的数据会交给网卡驱动，网卡驱动程序负责将打包好的数据写入网卡并让其发送出去。</p><p>我为你准备了一张流程图供你参考，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/dcb38fc1c0eef666eb1496cbf97a82bc.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/dcb38fc1c0eef666eb1496cbf97a82bc.jpg" alt=""></a></p><p>上图中，只是展示了大致流程，其中还有DMA处理、CRC校验、出错处理等细节，但对于我们理解梳理发送流程，这些就够了。</p><h3 id="接收过程总览" tabindex="-1">接收过程总览 <a class="header-anchor" href="#接收过程总览" aria-label="Permalink to &quot;接收过程总览&quot;">​</a></h3><p>了解了发送数据的过程以后，掌握接收数据的过程就更容易了，因为它就是 <strong>发送数据的逆过程</strong>。</p><p>首先，网卡接收到数据，通过DMA复制到指定的内存，接着发送中断，以便通知网卡驱动，由网卡驱动处理中断复制数据。然后网络协议收到网卡驱动传过来的数据，层层解包，获取真正的有效数据。最后，这个数据会发送给用户态监听的应用进程。</p><p>为了让你更加直观地了解这一过程，我特意准备了一张流程图供你参考，如下所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/8a726909f0a19ff1683e541d3712b4dd.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/8a726909f0a19ff1683e541d3712b4dd.jpg" alt=""></a></p><p>前面只是帮你梳理一下数据的发送与接收的流程，其实我们真正要关注的是网络协议。可是我们若手动实现一个完整的网络协议，不太现实，网络协议的复杂度大到也许要重新开一门课程，才可以完全解决，所以下面我们借用一下lwIP项目，以这个为基础来讨论网络协议。</p><h2 id="认识一下lwip架构" tabindex="-1">认识一下lwIP架构 <a class="header-anchor" href="#认识一下lwip架构" aria-label="Permalink to &quot;认识一下lwIP架构&quot;">​</a></h2><p>现在我们清楚了一次具体网络发收过程是怎么回事，那怎么让Cosmos实现网络通信呢？这里我们选择lwIP这个TCP/IP协议的轻量级开源项目，让它成为Cosmos的网络部的战略合作伙伴。</p><p>lwIP是由瑞典计算机科学研究院（SICS）的Adam Dunkels开发的小型开源TCP/IP协议栈。它是一个用C语言实现的软件组件，一共有两套接口层，向下是操作系统要提供的，向上是提供给应用程序的。这样lwIP就能嵌入到任何操作系统之中工作，并为这个操作系统上的应用软件提供网络功能支持了。</p><p>为啥说lwIP是轻量级的呢？很简单，跟Linux比，从代码行数上就能看得出。lwIP的设计目标就是尽量用少量资源消耗，实现一个相对完整的TCP/IP协议栈。</p><p>这里的“完整性”主要是指TCP协议的完整性，实现的关键点就是 <strong>在保持TCP协议主要功能的基础上减少对RAM的占用。</strong> 同时，lwIP还支持IPv6的标准实现，这也让我们与现代交换设备的对接变得非常方便。</p><p>这里额外提供你一份扩展阅读资料，lwIP的项目 <a href="http://savannah.nongnu.org/projects/lwip/" target="_blank" rel="noreferrer">主页链接</a>，这里包含了大量相关资料，感兴趣的同学可以课后深入了解。另外，lwIP既可以移植到操作系统上运行，也可以在没有操作系统的情况下独立运行。</p><p>lwIP在结构上可分为四层：OS层、API层、核心层、硬件驱动层，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/ba5f483d0f1a6a5d241bde9c25e6d160.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/ba5f483d0f1a6a5d241bde9c25e6d160.jpg" alt=""></a></p><p><strong>第一层</strong></p><p>MCU的业务层是lwIP的服务对象，也是其自身代码使用lwIP的地方。大部分时候我们都是从这里入手，通过netconn或lwip_api使用lwIP的各种功能函数。</p><p>在典型的TCP通信的客户端应用程序中，一般先要通过netconn_new创建一个struct netconn对象，然后调用netconn_connect连接到服务器，并返回成功或失败。成功后，可以调用netconn_write向服务器发送数据，也可以调用netconn_recv接收数据。最后，关闭连接并通过netconn_close释放资源。</p><p><strong>第二层</strong></p><p>lwIP的api层是netconn的功能代码所在的层，负责为上层代码提供netconn的api。习惯使用socket的同学也可以使用lwip_socket等函数，以标准的socket方式调用lwIP。新版本增加了http、mqtt等应用的代码，这些额外的应用对目前的物联网通信来说确实很方便。</p><p><strong>第三层</strong></p><p>lwIP的核心层存放了TCP/IP协议栈的核心代码，它不仅实现了大部分的TCP和UDP功能，还实现了DNS、ICMP、IGMP等协议，同时也实现了内存管理和网络接口功能。</p><p>该层提供了sys_arch模块设计，便于将lwIP移植到不同的操作系统，如线程创建、信号量、消息队列等功能。和操作系统相关的真正定义写在了lwip/include/sys.h文件中。</p><p><strong>第四层</strong></p><p>硬件驱动层提供PHY芯片驱动，用来匹配lwIP的使用。lwIP会调用该层的代码将组装好的数据包发送到网络，同时从网络接收数据包并进行分析，实现通信功能。</p><h3 id="lwip的三套应用程序编程接口" tabindex="-1">lwIP的三套应用程序编程接口 <a class="header-anchor" href="#lwip的三套应用程序编程接口" aria-label="Permalink to &quot;lwIP的三套应用程序编程接口&quot;">​</a></h3><p>理清了架构，我们再说一说lwIP的应用程序编程接口，一共有三套。</p><p>原始API：原始的lwIP API。它通过事件回调机制开发应用程序。该应用编程接口提供了最佳的性能和优化的代码长度，但它增加了应用程序开发的复杂性。</p><p>Netconn API：是高级的有序API、需要实时操作系统（RTOS）的支持（提供进程间通信的方法）。Netconn API支持多线程。</p><p>BSD套接字API：类似伯克利的套接字API（在Netconn API上开发，需要注意NETCONN API 即为 Sequential API）。</p><p>对于以上三种接口，前者只需要裸机调用，后两种需要操作系统调用。因此，移植lwIP有两种方法，一种是只移植内核，不过这样之后只能基于RAW/Callback API编写应用程序。第二种是移植内核和上层API。这时应用程序编程可以使用三种API，即RAW/Callback API、顺序API和Socket API。</p><h2 id="lwip执行流程" tabindex="-1">lwIP执行流程 <a class="header-anchor" href="#lwip执行流程" aria-label="Permalink to &quot;lwIP执行流程&quot;">​</a></h2><p>现在，想必聪明的你已经理解了前文中的网络收发过程。</p><p>接下来，让我们顺着之前的思路来对应到lwIP在收发过程中的核心函数，具体过程我同样梳理了流程图。你可以结合图里关键的函数名以及步骤顺序，按这个顺序在IwIP代码中检索阅读。</p><h3 id="数据发送" tabindex="-1">数据发送 <a class="header-anchor" href="#数据发送" aria-label="Permalink to &quot;数据发送&quot;">​</a></h3><p>首先要说的是数据发送过程。</p><p>由于我们把lwIP作为Cosmos的一个内核组件来工作，自然要由lwIP接收来自内核上层发来的数据。内核上层首先会调用lwIP的netconn层的接口函数 <strong>netconn_write</strong>，通过这个函数，数据正式流进lwIP组件层。</p><p>接着，netconn层调用lwIP组件的TCP层的接口函数tcp_write，在TCP层对数据首次进行打包。然后，TCP层将打包好的数据通过调用io_output函数，向下传递给lwIP组件的IP层，进行打包。</p><p>最后，IP层将打包好的数据发送给网卡驱动接口层netif，这里调用了实际的网卡驱动程序，将数据发送出去。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/b31c19ff5c0f89729f0a3d2a42a2452c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/b31c19ff5c0f89729f0a3d2a42a2452c.jpg" alt=""></a></p><h3 id="数据接收" tabindex="-1">数据接收 <a class="header-anchor" href="#数据接收" aria-label="Permalink to &quot;数据接收&quot;">​</a></h3><p>数据接收的步骤相比数据发送稍微多一些，但也不用害怕，跟住我的讲解思路一定可以理清这个过程。</p><p>数据接收需要应用程序首先调用lwIP的netconn层的netconn_recv接口。然后由netconn层调用sys_arch_mbox_fetch函数，进入监听等待相关的mbox。</p><p>接着，数据会进入网卡，驱动程序相关的函数负责把它复制到内存。再然后是调用ethernet_input函数，进入ethernet层。完成相关处理后，调用ip4_input函数，数据在lwIP组件的IP层对数据解包，进行相应处理之后，还会调用tcp_input函数，进入lwIP组件的TCP层对数据解包。</p><p>最后，调用sys_mbox_trypost函数把数据放入特定的mbox，也就是消息盒子里，这样等待监听的应用程序就能得到数据了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/d3e0530bb72990da0b56784a73e8ecef.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/d3e0530bb72990da0b56784a73e8ecef.jpg" alt=""></a></p><p>在了解了lwIP组件收发数据的过程之后，就可以进行移植的相关工作了。lwIP的结构设计非常优秀，这让移植工作变得很容易。我们这里只要了解lwIP组件的 <strong>sys_arch层的接口函数</strong> 即可。</p><p>下面我们一起了解lwIP的移植细节。</p><h2 id="协议栈移植" tabindex="-1">协议栈移植 <a class="header-anchor" href="#协议栈移植" aria-label="Permalink to &quot;协议栈移植&quot;">​</a></h2><p>lwIP有两种移植模式，一种是NO_SYS，无操作系统模式，一种是有操作系统模式。用NO_SYS模式比较简单，你可以自行探索。</p><p>操作系统模式主要需要基于操作系统的 IPC 机制，对网络连接进行了抽象（信号量、邮箱/队列、互斥体等机制），从而保证内核与应用层API的通讯，这样做的好处是 <strong>lwIP 内核线程可以只负责数据包的 TCP/IP 封装和拆封，而不用进行数据的应用层处理，从而极大地提高系统对网络数据包的处理效率。</strong></p><p>而这些操作系统模拟层的函数主要是在sys.h中声明的，我们一般在sys_arch.c文件中完成其定义。所以，我们很清楚，带操作系统的移植就是在无操作系统的基础上添加操作系统模拟层。</p><p>再接下来我们就看看操作系统模拟层的编写。</p><h3 id="有操作系统模式" tabindex="-1">有操作系统模式 <a class="header-anchor" href="#有操作系统模式" aria-label="Permalink to &quot;有操作系统模式&quot;">​</a></h3><p>在之前的课程里我们已经正确实现了Cosmos操作系统了，现在我们就可以在Cosmos系统提供的IPC等机制基础之上，对照 sys.h 文件中声明的函数一一去实现了。</p><p>实际工程中完整移植网络栈，需要将后面表格里的这30多个函数全部实现。我会带你完成邮箱和系统线程相关的关键部分移植，其他函数的移植思路也大同小异，这里就不一一演示了。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/51791a1817fca811aaa1c0240c4135ff.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/402840/51791a1817fca811aaa1c0240c4135ff.jpg" alt=""></a></p><p>从上表中我们可以发现，这些变量和函数主要面向信号量、互斥体和邮箱，包括创建、删除、释放和获取等各种操作，所以我们需要根据操作系统的规定来实现这些函数。</p><p>突然看到这么多功能，是不是有点慌？其实不用怕，因为这些功能的实现起来非常简单。首先，我们通过一个例子来看看邮箱功能的实现。</p><p>在lwIP中，用户代码通过邮箱与协议栈内部交互。邮箱本质上是指向数据的指针。API将指针传递给内核，内核通过这个指针访问数据，然后进行处理。相反，内核也是通过邮箱将数据传递给用户代码的。</p><p>具体代码如下，关键内容我都做了详细注释。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*创建一个空的邮箱。*/</span></span>
<span class="line"><span>err_t sys_mbox_new(sys_mbox_t *mbox, int size)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>osMessageQDef(QUEUE, size, void *);</span></span>
<span class="line"><span>*mbox = osMessageCreate(osMessageQ(QUEUE), NULL);</span></span>
<span class="line"><span>#if SYS_STATS</span></span>
<span class="line"><span>++lwip_stats.sys.mbox.used;</span></span>
<span class="line"><span>if (lwip_stats.sys.mbox.max &amp;lt; lwip_stats.sys.mbox.used) {</span></span>
<span class="line"><span>lwip_stats.sys.mbox.max = lwip_stats.sys.mbox.used;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#endif /* SYS_STATS */</span></span>
<span class="line"><span>if (*mbox == NULL)</span></span>
<span class="line"><span>return ERR_MEM;</span></span>
<span class="line"><span>return ERR_OK;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*重新分配一个邮箱。如果邮箱被释放时，邮箱中仍有消息，在lwIP中这是出现编码错误的指示，并通知开发人员。*/</span></span>
<span class="line"><span>void sys_mbox_free(sys_mbox_t *mbox)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if( osMessageWaiting(*mbox) )</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>portNOP();</span></span>
<span class="line"><span>#if SYS_STATS</span></span>
<span class="line"><span>lwip_stats.sys.mbox.err++;</span></span>
<span class="line"><span>#endif /* SYS_STATS */</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>osMessageDelete(*mbox);</span></span>
<span class="line"><span>#if SYS_STATS</span></span>
<span class="line"><span>--lwip_stats.sys.mbox.used;</span></span>
<span class="line"><span>#endif /* SYS_STATS */</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*发送消息到邮箱*/</span></span>
<span class="line"><span>void sys_mbox_post(sys_mbox_t *mbox, void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>while(osMessagePut(*mbox, (uint32_t)data, osWaitForever) != osOK);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*尝试将消息发送到邮箱*/</span></span>
<span class="line"><span>err_t sys_mbox_trypost(sys_mbox_t *mbox, void *msg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>err_t result;</span></span>
<span class="line"><span>if ( osMessagePut(*mbox, (uint32_t)msg, 0) == osOK)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>result = ERR_OK;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else {</span></span>
<span class="line"><span>result = ERR_MEM;</span></span>
<span class="line"><span>#if SYS_STATS</span></span>
<span class="line"><span>lwip_stats.sys.mbox.err++;</span></span>
<span class="line"><span>#endif /* SYS_STATS */</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*阻塞进程从邮箱获取消息*/</span></span>
<span class="line"><span>u32_t sys_arch_mbox_fetch(sys_mbox_t *mbox, void **msg, u32_t timeout)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>osEvent event;</span></span>
<span class="line"><span>uint32_t starttime = osKernelSysTick();;</span></span>
<span class="line"><span>if(timeout != 0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>event = osMessageGet (*mbox, timeout);</span></span>
<span class="line"><span>if(event.status == osEventMessage)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>*msg = (void *)event.value.v;</span></span>
<span class="line"><span>return (osKernelSysTick() - starttime);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>return SYS_ARCH_TIMEOUT;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>event = osMessageGet (*mbox, osWaitForever);</span></span>
<span class="line"><span>*msg = (void *)event.value.v;</span></span>
<span class="line"><span>return (osKernelSysTick() - starttime);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*尝试从邮箱获取消息*/</span></span>
<span class="line"><span>u32_t sys_arch_mbox_tryfetch(sys_mbox_t *mbox, void **msg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>osEvent event;</span></span>
<span class="line"><span>event = osMessageGet (*mbox, 0);</span></span>
<span class="line"><span>if(event.status == osEventMessage)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>*msg = (void *)event.value.v;</span></span>
<span class="line"><span>return ERR_OK;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>return SYS_MBOX_EMPTY;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*判断一个邮箱是否有效*/</span></span>
<span class="line"><span>int sys_mbox_valid(sys_mbox_t *mbox)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>if (*mbox == SYS_MBOX_NULL)</span></span>
<span class="line"><span>return 0;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>return 1;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>/*设置一个邮箱无效*/</span></span>
<span class="line"><span>void sys_mbox_set_invalid(sys_mbox_t *mbox)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>*mbox = SYS_MBOX_NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 创建一个新的信号量。而 &quot;count&quot;参数指示该信号量的初始状态</span></span>
<span class="line"><span>err_t sys_sem_new(sys_sem_t *sem, u8_t count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>osSemaphoreDef(SEM);</span></span>
<span class="line"><span>*sem = osSemaphoreCreate (osSemaphore(SEM), 1);</span></span>
<span class="line"><span>if(*sem == NULL)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#if SYS_STATS</span></span>
<span class="line"><span>++lwip_stats.sys.sem.err;</span></span>
<span class="line"><span>#endif /* SYS_STATS */</span></span>
<span class="line"><span>return ERR_MEM;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if(count == 0) // Means it can&#39;t be taken</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>osSemaphoreWait(*sem,0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#if SYS_STATS</span></span>
<span class="line"><span>++lwip_stats.sys.sem.used;</span></span>
<span class="line"><span>if (lwip_stats.sys.sem.max &amp;lt; lwip_stats.sys.sem.used) {</span></span>
<span class="line"><span>lwip_stats.sys.sem.max = lwip_stats.sys.sem.used;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#endif /* SYS_STATS */</span></span>
<span class="line"><span>return ERR_OK;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>此外还有一些函数也是协议栈需要的函数，特别是sys_thread_new函数，不但协议栈在初始化时需要用到，在后续我们实现各类基于lwIP的应用时也会用得到，它的具体实现如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sys_thread_t sys_thread_new(const char *name, lwip_thread_fn thread , void *arg, int stacksize, int prio)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>const osThreadDef_t os_thread_def = { (char *)name, (os_pthread)thread, (osPriority)prio, 0, stacksize};</span></span>
<span class="line"><span>return osThreadCreate(&amp;os_thread_def, arg);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>osThreadId osThreadCreate (const osThreadDef_t *thread_def, void *argument)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>TaskHandle_t handle;</span></span>
<span class="line"><span>#if( configSUPPORT_STATIC_ALLOCATION == 1 ) &amp;&amp; ( configSUPPORT_DYNAMIC_ALLOCATION == 1 )</span></span>
<span class="line"><span>if((thread_def-&amp;gt;buffer != NULL) &amp;&amp; (thread_def-&amp;gt;controlblock != NULL)) {</span></span>
<span class="line"><span>handle = xTaskCreateStatic((TaskFunction_t)thread_def-&amp;gt;pthread,(const portCHAR *)thread_def-&amp;gt;name,</span></span>
<span class="line"><span>thread_def-&amp;gt;stacksize, argument, makeFreeRtosPriority(thread_def-&amp;gt;tpriority),</span></span>
<span class="line"><span>thread_def-&amp;gt;buffer, thread_def-&amp;gt;controlblock);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else {</span></span>
<span class="line"><span>if (xTaskCreate((TaskFunction_t)thread_def-&amp;gt;pthread,(const portCHAR *)thread_def-&amp;gt;name,</span></span>
<span class="line"><span>thread_def-&amp;gt;stacksize, argument, makeFreeRtosPriority(thread_def-&amp;gt;tpriority),</span></span>
<span class="line"><span>&amp;handle) != pdPASS) {</span></span>
<span class="line"><span>return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#elif( configSUPPORT_STATIC_ALLOCATION == 1 )</span></span>
<span class="line"><span>handle = xTaskCreateStatic((TaskFunction_t)thread_def-&amp;gt;pthread,(const portCHAR *)thread_def-&amp;gt;name,</span></span>
<span class="line"><span>thread_def-&amp;gt;stacksize, argument, makeFreeRtosPriority(thread_def-&amp;gt;tpriority),</span></span>
<span class="line"><span>thread_def-&amp;gt;buffer, thread_def-&amp;gt;controlblock);</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>if (xTaskCreate((TaskFunction_t)thread_def-&amp;gt;pthread,(const portCHAR *)thread_def-&amp;gt;name,</span></span>
<span class="line"><span>thread_def-&amp;gt;stacksize, argument, makeFreeRtosPriority(thread_def-&amp;gt;tpriority),</span></span>
<span class="line"><span>&amp;handle) != pdPASS) {</span></span>
<span class="line"><span>return NULL;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>return handle;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>至此，基于Cosmos操作系统移植lwIP协议栈的关键部分就算完成了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好，这节课的内容告一段落了，我来给你做个总结。</p><p>我们首先从数据发送接收的视角，观察了数据从用户态到内核态，再从内核态到流动到用户态的全过程。</p><p>接着，我们发现网络协议栈移植与DMA、内核的IPC、信号量、DMA等机制密切相关。理解网络栈移植的关键步骤，能够让我们更好地理解内核特性在工程中是如何应用的。</p><p>最后，我们实现了将lwIP网络协议栈的关键部分移植到Cosmos操作系统下。不过这节课我带你实现了邮箱和系统线程相关的关键部分，其他函数移植道理相通，感兴趣的同学可以自行探索。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>我们已经了解到了操作系统内核和网络协议栈的关系，可是网络协议栈真的一定只能放在内核态实现么？</p><p>欢迎你在留言区跟我交流探讨。也欢迎你把这节课分享给自己的朋友、同事。</p><p>我是LMOS，我们下节课见！</p>`,88)])])}const m=n(l,[["render",t]]);export{d as __pageData,m as default};
