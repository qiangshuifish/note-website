import{_ as a,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"26 | 多个活动要安排（下）：如何实现进程的等待与唤醒机制？","description":"","frontmatter":{},"headers":[{"level":2,"title":"进程的等待与唤醒","slug":"进程的等待与唤醒","link":"#进程的等待与唤醒","children":[{"level":3,"title":"进程等待结构","slug":"进程等待结构","link":"#进程等待结构","children":[]},{"level":3,"title":"进程等待","slug":"进程等待","link":"#进程等待","children":[]},{"level":3,"title":"进程唤醒","slug":"进程唤醒","link":"#进程唤醒","children":[]}]},{"level":2,"title":"空转进程","slug":"空转进程","link":"#空转进程","children":[{"level":3,"title":"建立空转进程","slug":"建立空转进程","link":"#建立空转进程","children":[]},{"level":3,"title":"空转进程运行","slug":"空转进程运行","link":"#空转进程运行","children":[]}]},{"level":2,"title":"多进程运行","slug":"多进程运行","link":"#多进程运行","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/26-多个活动要安排（下）：如何实现进程的等待与唤醒机制？.md","filePath":"操作系统实战45讲/26-多个活动要安排（下）：如何实现进程的等待与唤醒机制？.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/26-多个活动要安排（下）：如何实现进程的等待与唤醒机制？.md"};function t(i,s,c,d,r,o){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_26-多个活动要安排-下-如何实现进程的等待与唤醒机制" tabindex="-1">26 | 多个活动要安排（下）：如何实现进程的等待与唤醒机制？ <a class="header-anchor" href="#_26-多个活动要安排-下-如何实现进程的等待与唤醒机制" aria-label="Permalink to &quot;26 | 多个活动要安排（下）：如何实现进程的等待与唤醒机制？&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课，我带你一起设计了我们Cosmos的进程调度器，但有了进程调度器还不够，因为调度器它始终只是让一个进程让出CPU，切换到它选择的下一个进程上去运行。</p><p>结合前面我们对进程生命周期的讲解，估计你已经反应过来了。没错，多进程调度方面，我们还要实现进程的等待与唤醒机制，今天我们就来搞定它。</p><p>这节课的配套代码，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson25~26/Cosmos" target="_blank" rel="noreferrer">这里</a> 下载。</p><h2 id="进程的等待与唤醒" tabindex="-1">进程的等待与唤醒 <a class="header-anchor" href="#进程的等待与唤醒" aria-label="Permalink to &quot;进程的等待与唤醒&quot;">​</a></h2><p>我们已经知道，进程得不到所需的某个资源时就会进入等待状态，直到这种资源可用时，才会被唤醒。那么进程的等待与唤醒机制到底应该这样设计呢，请听我慢慢为你梳理。</p><h3 id="进程等待结构" tabindex="-1">进程等待结构 <a class="header-anchor" href="#进程等待结构" aria-label="Permalink to &quot;进程等待结构&quot;">​</a></h3><p>很显然，在实现进程的等待与唤醒的机制之前，我们需要设计一种数据结构，用于挂载等待的进程，在唤醒的时候才可以找到那些等待的进程 ，这段代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_KWLST</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    spinlock_t wl_lock;  //自旋锁</span></span>
<span class="line"><span>    uint_t   wl_tdnr;    //等待进程的个数</span></span>
<span class="line"><span>    list_h_t wl_list;    //挂载等待进程的链表头</span></span>
<span class="line"><span>}kwlst_t;</span></span></code></pre></div><p>其实，这个结构在前面讲 <a href="https://time.geekbang.org/column/article/377913" target="_blank" rel="noreferrer">信号量</a> 的时候，我们已经见过了。这是因为它经常被包含在信号量等上层数据结构中，而信号量结构，通常用于保护访问受限的共享资源。这个结构非常简单，我们不用多说。</p><h3 id="进程等待" tabindex="-1">进程等待 <a class="header-anchor" href="#进程等待" aria-label="Permalink to &quot;进程等待&quot;">​</a></h3><p>现在我们来实现让进程进入等待状态的机制，它也是一个函数。这个函数会设置进程状态为等待状态，让进程从调度系统数据结构中脱离，最后让进程加入到kwlst_t等待结构中，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void krlsched_wait(kwlst_t *wlst)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    cpuflg_t cufg, tcufg;</span></span>
<span class="line"><span>    uint_t cpuid = hal_retn_cpuid();</span></span>
<span class="line"><span>    schdata_t *schdap = &amp;osschedcls.scls_schda[cpuid];</span></span>
<span class="line"><span>    //获取当前正在运行的进程</span></span>
<span class="line"><span>    thread_t *tdp = krlsched_retn_currthread();</span></span>
<span class="line"><span>    uint_t pity = tdp-&amp;gt;td_priority;</span></span>
<span class="line"><span>    krlspinlock_cli(&amp;schdap-&amp;gt;sda_lock, &amp;cufg);</span></span>
<span class="line"><span>    krlspinlock_cli(&amp;tdp-&amp;gt;td_lock, &amp;tcufg);</span></span>
<span class="line"><span>    tdp-&amp;gt;td_stus = TDSTUS_WAIT;//设置进程状态为等待状态</span></span>
<span class="line"><span>    list_del(&amp;tdp-&amp;gt;td_list);//脱链</span></span>
<span class="line"><span>    krlspinunlock_sti(&amp;tdp-&amp;gt;td_lock, &amp;tcufg);</span></span>
<span class="line"><span>    if (schdap-&amp;gt;sda_thdlst[pity].tdl_curruntd == tdp)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        schdap-&amp;gt;sda_thdlst[pity].tdl_curruntd = NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    schdap-&amp;gt;sda_thdlst[pity].tdl_nr--;</span></span>
<span class="line"><span>    krlspinunlock_sti(&amp;schdap-&amp;gt;sda_lock, &amp;cufg);</span></span>
<span class="line"><span>    krlwlst_add_thread(wlst, tdp);//将进程加入等待结构中</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码也不难，你结合注释就能理解。有一点需要注意，这个函数使进程进入等待状态，而这个 <strong>进程是当前正在运行的进程，而当前正在运行的进程正是调用这个函数的进程</strong>，所以一个进程想要进入等待状态，只要调用这个函数就好了。</p><h3 id="进程唤醒" tabindex="-1">进程唤醒 <a class="header-anchor" href="#进程唤醒" aria-label="Permalink to &quot;进程唤醒&quot;">​</a></h3><p>进程的唤醒则是进程等待的反向操作行为，即从等待数据结构中获取进程，然后设置进程的状态为运行状态，最后将这个进程加入到进程调度系统数据结构中。这个函数的代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void krlsched_up(kwlst_t *wlst)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    cpuflg_t cufg, tcufg;</span></span>
<span class="line"><span>    uint_t cpuid = hal_retn_cpuid();</span></span>
<span class="line"><span>    schdata_t *schdap = &amp;osschedcls.scls_schda[cpuid];</span></span>
<span class="line"><span>    thread_t *tdp;</span></span>
<span class="line"><span>    uint_t pity;</span></span>
<span class="line"><span>    //取出等待数据结构第一个进程并从等待数据结构中删除</span></span>
<span class="line"><span>    tdp = krlwlst_del_thread(wlst);</span></span>
<span class="line"><span>    pity = tdp-&amp;gt;td_priority;//获取进程的优先级</span></span>
<span class="line"><span>    krlspinlock_cli(&amp;schdap-&amp;gt;sda_lock, &amp;cufg);</span></span>
<span class="line"><span>    krlspinlock_cli(&amp;tdp-&amp;gt;td_lock, &amp;tcufg);</span></span>
<span class="line"><span>    tdp-&amp;gt;td_stus = TDSTUS_RUN;//设置进程的状态为运行状态</span></span>
<span class="line"><span>    krlspinunlock_sti(&amp;tdp-&amp;gt;td_lock, &amp;tcufg);</span></span>
<span class="line"><span>    list_add_tail(&amp;tdp-&amp;gt;td_list, &amp;(schdap-&amp;gt;sda_thdlst[pity].tdl_lsth));//加入进程优先级链表</span></span>
<span class="line"><span>    schdap-&amp;gt;sda_thdlst[pity].tdl_nr++;</span></span>
<span class="line"><span>    krlspinunlock_sti(&amp;schdap-&amp;gt;sda_lock, &amp;cufg);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码相对简单，我想以你的能力，还能写出比以上更好的代码。好了，到这里，我们进程的等待与唤醒的机制已经实现了。</p><h2 id="空转进程" tabindex="-1">空转进程 <a class="header-anchor" href="#空转进程" aria-label="Permalink to &quot;空转进程&quot;">​</a></h2><p>下面我们一起来建立空转进程 ，它也是我们系统下的第一个进程。空转进程是操作系统在没任何进程可以调度运行的时候，就选择调度空转进程来运行，可以说 <strong>空转进程是进程调度器最后的选择。</strong></p><p>请注意，这个最后的选择一定要有，现在几乎所有的操作系统，都有一个或者几个空转进程（多CPU的情况下，每个CPU一个空转进程）。我们的Cosmos虽然是简单了些，但也必须要有空转进程，而且这是我们Cosmos上的第一个进程。</p><h3 id="建立空转进程" tabindex="-1">建立空转进程 <a class="header-anchor" href="#建立空转进程" aria-label="Permalink to &quot;建立空转进程&quot;">​</a></h3><p>我们Cosmos的空转进程是个内核进程，按照常理，我们只要调用上节课实现的建立进程的接口，创建一个内核进程就好了。</p><p>但是我们的空转进程有点特殊，它是内核进程没错，但它不加入调度系统，而是一个专用的指针指向它的。</p><p>下面我们来建立一个空转进程。由于空转进程是个独立的模块，我们建立一个新的C语言文件Cosmos/kernel/krlcpuidle.c，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>thread_t *new_cpuidle_thread()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    thread_t *ret_td = NULL;</span></span>
<span class="line"><span>    bool_t acs = FALSE;</span></span>
<span class="line"><span>    adr_t krlstkadr = NULL;</span></span>
<span class="line"><span>    uint_t cpuid = hal_retn_cpuid();</span></span>
<span class="line"><span>    schdata_t *schdap = &amp;osschedcls.scls_schda[cpuid];</span></span>
<span class="line"><span>    krlstkadr = krlnew(DAFT_TDKRLSTKSZ);//分配进程的内核栈</span></span>
<span class="line"><span>    if (krlstkadr == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //分配thread_t结构体变量</span></span>
<span class="line"><span>    ret_td = krlnew_thread_dsc();</span></span>
<span class="line"><span>    if (ret_td == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        acs = krldelete(krlstkadr, DAFT_TDKRLSTKSZ);</span></span>
<span class="line"><span>        if (acs == FALSE)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return NULL;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置进程具有系统权限</span></span>
<span class="line"><span>    ret_td-&amp;gt;td_privilege = PRILG_SYS;</span></span>
<span class="line"><span>    ret_td-&amp;gt;td_priority = PRITY_MIN;</span></span>
<span class="line"><span>    //设置进程的内核栈顶和内核栈开始地址</span></span>
<span class="line"><span>    ret_td-&amp;gt;td_krlstktop = krlstkadr + (adr_t)(DAFT_TDKRLSTKSZ - 1);</span></span>
<span class="line"><span>    ret_td-&amp;gt;td_krlstkstart = krlstkadr;</span></span>
<span class="line"><span>    //初始化进程的内核栈</span></span>
<span class="line"><span>    krlthread_kernstack_init(ret_td, (void *)krlcpuidle_main, KMOD_EFLAGS);</span></span>
<span class="line"><span>    //设置调度系统数据结构的空转进程和当前进程为ret_td</span></span>
<span class="line"><span>    schdap-&amp;gt;sda_cpuidle = ret_td;</span></span>
<span class="line"><span>    schdap-&amp;gt;sda_currtd = ret_td;</span></span>
<span class="line"><span>    return ret_td;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//新建空转进程</span></span>
<span class="line"><span>void new_cpuidle()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    thread_t *thp = new_cpuidle_thread();//建立空转进程</span></span>
<span class="line"><span>    if (thp == NULL)</span></span>
<span class="line"><span>    {//失败则主动死机</span></span>
<span class="line"><span>        hal_sysdie(&quot;newcpuilde err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kprint(&quot;CPUIDLETASK: %x\\n&quot;, (uint_t)thp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，建立空转进程由new_cpuidle函数调用new_cpuidle_thread函数完成，new_cpuidle_thread函数的操作和前面建立内核进程差不多，只不过在函数的最后，让调度系统数据结构的空转进程和当前进程的指针，指向了刚刚建立的进程。</p><p>但是你要注意，上述代码中调用初始内核栈函数时，将krlcpuidle_main函数传了进去，这就是空转进程的主函数，下面我们来写好。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void krlcpuidle_main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t i = 0;</span></span>
<span class="line"><span>    for (;; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kprint(&quot;空转进程运行:%x\\n&quot;, i);//打印</span></span>
<span class="line"><span>        krlschedul();//调度进程</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我给你解释一下，空转进程的主函数本质就是个死循环，在死循环中打印一行信息，然后进行进程调度，这个函数就是永无休止地执行这两个步骤。</p><h3 id="空转进程运行" tabindex="-1">空转进程运行 <a class="header-anchor" href="#空转进程运行" aria-label="Permalink to &quot;空转进程运行&quot;">​</a></h3><p>我们已经建立了空转进程，下面就要去运行它了。</p><p>由于是第一进程，所以没法用调度器来调度它，我们得手动启动它，才可以运行。其实 <a href="https://time.geekbang.org/column/article/391222" target="_blank" rel="noreferrer">上节课</a> 我们已经写了启动一个新建进程运行的函数，我们现在只要调用它就好了，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void krlcpuidle_start()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t cpuid = hal_retn_cpuid();</span></span>
<span class="line"><span>    schdata_t *schdap = &amp;osschedcls.scls_schda[cpuid];</span></span>
<span class="line"><span>    //取得空转进程</span></span>
<span class="line"><span>    thread_t *tdp = schdap-&amp;gt;sda_cpuidle;</span></span>
<span class="line"><span>    //设置空转进程的tss和R0特权级的栈</span></span>
<span class="line"><span>    tdp-&amp;gt;td_context.ctx_nexttss = &amp;x64tss[cpuid];</span></span>
<span class="line"><span>    tdp-&amp;gt;td_context.ctx_nexttss-&amp;gt;rsp0 = tdp-&amp;gt;td_krlstktop;</span></span>
<span class="line"><span>    //设置空转进程的状态为运行状态</span></span>
<span class="line"><span>    tdp-&amp;gt;td_stus = TDSTUS_RUN;</span></span>
<span class="line"><span>    //启动进程运行</span></span>
<span class="line"><span>    retnfrom_first_sched(tdp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码的逻辑也很容易理解，我为你梳理一下。首先就是取出空转进程，然后设置一下机器上下文结构和运行状态，最后调用retnfrom_first_sched函数，恢复进程内核栈中的内容，让进程启动运行。</p><p>不过这还没完，我们应该把建立空转进程和启动空转进程运行函数封装起来，放在一个初始化空转进程的函数中，并在内核层初始化init_krl函数的最后调用，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_krl()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_krlsched();//初始化进程调度器</span></span>
<span class="line"><span>    init_krlcpuidle();//初始化空转进程</span></span>
<span class="line"><span>    die(0);//防止init_krl函数返回</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//初始化空转进程</span></span>
<span class="line"><span>void init_krlcpuidle()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    new_cpuidle();//建立空转进程</span></span>
<span class="line"><span>    krlcpuidle_start();//启动空转进程运行</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>好了，所有的代码都已备好，终于到我们检验学习成果的时候了，我切换到这节课程的cosmos目录下执行make vboxtest 命令，就会出现如下图的结果，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/392198/efcf95c11732273ace5329152c782924.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/392198/efcf95c11732273ace5329152c782924.jpg" alt=""></a></p><p>可以看到，现在空转进程和调度器输出的信息在屏幕上交替滚动出现，这说明我们的空转进程和进程调度器都已经正常工作了。</p><h2 id="多进程运行" tabindex="-1">多进程运行 <a class="header-anchor" href="#多进程运行" aria-label="Permalink to &quot;多进程运行&quot;">​</a></h2><p>虽然我们的空转进程和调度器已经正常工作了，但你可能心里会有疑问，我们系统中就一个空转进程，那怎么证明我们进程调度器是正常工作的呢？</p><p>其实我们在空转进程中调用了调度器函数，然后进程调度器会发现系统中没有进程，又不得不调度空转进程，所以最后结果就是：空转进程调用进程调度器，而调度器又选择了空转进程，导致形成了一个闭环。</p><p>但是我们现在想要看看多个进程会是什么情况，就需要建立多个进程。下面我们马上就来实现这个想法，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void thread_a_main()//进程A主函数</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t i = 0;</span></span>
<span class="line"><span>    for (;; i++) {</span></span>
<span class="line"><span>        kprint(&quot;进程A运行:%x\\n&quot;, i);</span></span>
<span class="line"><span>        krlschedul();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void thread_b_main()//进程B主函数</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint_t i = 0;</span></span>
<span class="line"><span>    for (;; i++) {</span></span>
<span class="line"><span>        kprint(&quot;进程B运行:%x\\n&quot;, i);</span></span>
<span class="line"><span>        krlschedul();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void init_ab_thread()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    krlnew_thread((void*)thread_a_main, KERNTHREAD_FLG,</span></span>
<span class="line"><span>                PRILG_SYS, PRITY_MIN, DAFT_TDUSRSTKSZ, DAFT_TDKRLSTKSZ);//建立进程A</span></span>
<span class="line"><span>    krlnew_thread((void*)thread_b_main, KERNTHREAD_FLG,</span></span>
<span class="line"><span>                PRILG_SYS, PRITY_MIN, DAFT_TDUSRSTKSZ, DAFT_TDKRLSTKSZ);//建立进程B</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void init_krlcpuidle()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    new_cpuidle();//建立空转进程</span></span>
<span class="line"><span>    init_ab_thread();//初始化建立A、B进程</span></span>
<span class="line"><span>    krlcpuidle_start();//开始运行空转进程</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，我们在init_ab_thread函数中建立两个内核进程，分别运行两个函数，这两个函数会打印信息，init_ab_thread函数由init_krlcpuidle函数调用。这样在初始化空转进程的时候，就建立了进程A和进程B。</p><p>好了，现在我们在Linux终端下进入cosmos目录，在目录下输入make vboxtest运行一下，结果如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/392198/f986251428c419f5b2000308236466b1.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/392198/f986251428c419f5b2000308236466b1.jpg" alt=""></a></p><p>上图中，进程A和进程B在调度器的调度下交替运行，而空转进程不再运行，这表明我们的多进程机制完全正确。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>这节课我们接着上一节课，实现了进程的等待与唤醒机制，然后建立了空转进程，最后对进程调度进行了测试。下面我来为你梳理一下要点。</p><ol><li><p><strong>等待和唤醒机制。</strong> 为了让进程能进入等待状态随后又能在其它条件满足的情况下被唤醒，我们实现了进程等待和唤醒机制。</p></li><li><p><strong>空转进程。</strong> 是我们Cosmos系统下的第一个进程，它只干一件事情就是调用调度器函数调度进程，在系统中没有其它可以运行进程时，调度器又会调度空转进程，形成了一个闭环。</p></li><li><p><strong>测试。</strong> 为了验证我们的进程调度器是否是正常工作的，我们建立了两个进程，让它们运行，结果在屏幕上出现了它们交替输出的信息。这证明了我们的进程调度器是功能正常的。</p></li></ol><p>你也许发现了，我们的进程中都调用了krlschedul函数，不调用它就是始终只有一个进程运行了，你在开发应用程序中，需要调用调度器主动让出CPU吗？</p><p>这是什么原因呢？这是因为我们的Cosmos没有定时器驱动，系统的TICK机制无法工作，一旦我们系统TICK机开始工作，就能控制进程运行了多长时间，然后强制调度进程。系统TICK设备我们等到驱动与设备相关的模块，再给你展开讲解。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问，我们让进程进入等待状态后，这进程会立马停止运行吗？</p><p>欢迎你在留言区和我交流，相信通过积极参与，你将更好地理解这节课的内容。</p><p>好，我是LMOS，我们下节课见！</p>`,59)])])}const u=a(e,[["render",t]]);export{h as __pageData,u as default};
