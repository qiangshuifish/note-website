import{_ as n,H as a,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"12 | 设置工作模式与环境（下）：探查和收集信息","description":"","frontmatter":{},"headers":[{"level":2,"title":"检查与收集机器信息","slug":"检查与收集机器信息","link":"#检查与收集机器信息","children":[{"level":3,"title":"检查CPU","slug":"检查cpu","link":"#检查cpu","children":[]},{"level":3,"title":"获取内存布局","slug":"获取内存布局","link":"#获取内存布局","children":[]},{"level":3,"title":"初始化内核栈","slug":"初始化内核栈","link":"#初始化内核栈","children":[]},{"level":3,"title":"放置内核文件与字库文件","slug":"放置内核文件与字库文件","link":"#放置内核文件与字库文件","children":[]},{"level":3,"title":"建立MMU页表数据","slug":"建立mmu页表数据","link":"#建立mmu页表数据","children":[]},{"level":3,"title":"设置图形模式","slug":"设置图形模式","link":"#设置图形模式","children":[]},{"level":3,"title":"串联","slug":"串联","link":"#串联","children":[]}]},{"level":2,"title":"显示Logo","slug":"显示logo","link":"#显示logo","children":[]},{"level":2,"title":"进入Cosmos","slug":"进入cosmos","link":"#进入cosmos","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/12-设置工作模式与环境（下）：探查和收集信息.md","filePath":"操作系统实战45讲/12-设置工作模式与环境（下）：探查和收集信息.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/12-设置工作模式与环境（下）：探查和收集信息.md"};function t(i,s,c,o,r,m){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_12-设置工作模式与环境-下-探查和收集信息" tabindex="-1">12 | 设置工作模式与环境（下）：探查和收集信息 <a class="header-anchor" href="#_12-设置工作模式与环境-下-探查和收集信息" aria-label="Permalink to &quot;12 | 设置工作模式与环境（下）：探查和收集信息&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课我们动手实现了自己的二级引导器。今天这节课我们将进入二级引导器，完成具体工作的环节。</p><p>在二级引导器中，我们要检查CPU是否支持64位的工作模式、收集内存布局信息，看看是不是合乎我们操作系统的最低运行要求，还要设置操作系统需要的MMU页表、设置显卡模式、释放中文字体文件。</p><p>今天课程的配套代码，你可以点击 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson12/Cosmos" target="_blank" rel="noreferrer">这里</a>，自行下载。</p><h2 id="检查与收集机器信息" tabindex="-1">检查与收集机器信息 <a class="header-anchor" href="#检查与收集机器信息" aria-label="Permalink to &quot;检查与收集机器信息&quot;">​</a></h2><p>如果ldrkrl_entry()函数是总裁，那么init_bstartparm()函数则是经理，它负责管理检查CPU模式、收集内存信息，设置内核栈，设置内核字体、建立内核MMU页表数据。</p><p>为了使代码更加清晰，我们并不直接在ldrkrl_entry()函数中搞事情，而是准备在另一个bstartparm.c文件中实现一个init_bstartparm()。</p><p>下面我们就来动手实现它，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//初始化machbstart_t结构体，清0,并设置一个标志</span></span>
<span class="line"><span>void machbstart_t_init(machbstart_t* initp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    memset(initp,0,sizeof(machbstart_t));</span></span>
<span class="line"><span>    initp-&amp;gt;mb_migc=MBS_MIGC;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void init_bstartparm()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    machbstart_t* mbsp = MBSPADR;//1MB的内存地址</span></span>
<span class="line"><span>    machbstart_t_init(mbsp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>目前我们的经理init_bstartparm()函数只是调用了一个machbstart_t_init()函数，在1MB内存地址处初始化了一个机器信息结构machbstart_t，后面随着干活越来越多，还会调用更多的函数的。</p><h3 id="检查cpu" tabindex="-1">检查CPU <a class="header-anchor" href="#检查cpu" aria-label="Permalink to &quot;检查CPU&quot;">​</a></h3><p>首先要检查我们的CPU，因为它是执行程序的关键。我们要搞清楚它能执行什么形式的代码，支持64位长模式吗？</p><p>这个工作我们交给init_chkcpu()函数来干，由于我们要CPUID指令来检查CPU是否支持64位长模式，所以这个函数中需要找两个帮工： <strong>chk_cpuid、chk_cpu_longmode</strong> 来干两件事，一个是检查CPU否支持CPUID指令，然后另一个用CPUID指令检查CPU支持64位长模式。</p><p>下面我们去写好它们，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//通过改写Eflags寄存器的第21位，观察其位的变化判断是否支持CPUID</span></span>
<span class="line"><span>int chk_cpuid()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int rets = 0;</span></span>
<span class="line"><span>    __asm__ __volatile__(</span></span>
<span class="line"><span>        &quot;pushfl \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;popl %%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;movl %%eax,%%ebx \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;xorl $0x0200000,%%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;pushl %%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;popfl \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;pushfl \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;popl %%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;xorl %%ebx,%%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;jz 1f \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;movl $1,%0 \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;jmp 2f \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;1: movl $0,%0 \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;2: \\n\\t&quot;</span></span>
<span class="line"><span>        : &quot;=c&quot;(rets)</span></span>
<span class="line"><span>        :</span></span>
<span class="line"><span>        :);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//检查CPU是否支持长模式</span></span>
<span class="line"><span>int chk_cpu_longmode()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int rets = 0;</span></span>
<span class="line"><span>    __asm__ __volatile__(</span></span>
<span class="line"><span>        &quot;movl $0x80000000,%%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;cpuid \\n\\t&quot;</span><span> //把eax中放入0x80000000调用CPUID指令</span></span>
<span class="line"><span>        &quot;cmpl $0x80000001,%%eax \\n\\t&quot;//看eax中返回结果</span></span>
<span class="line"><span>        &quot;setnb %%al \\n\\t&quot;</span><span> //不为0x80000001,则不支持0x80000001号功能</span></span>
<span class="line"><span>        &quot;jb 1f \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;movl $0x80000001,%%eax \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;cpuid \\n\\t&quot;//把eax中放入0x800000001调用CPUID指令，检查edx中的返回数据</span></span>
<span class="line"><span>        &quot;bt $29,%%edx  \\n\\t&quot;</span><span> //长模式 支持位  是否为1</span></span>
<span class="line"><span>        &quot;setcb %%al \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;1: \\n\\t&quot;</span></span>
<span class="line"><span>        &quot;movzx %%al,%%eax \\n\\t&quot;</span></span>
<span class="line"><span>        : &quot;=a&quot;(rets)</span></span>
<span class="line"><span>        :</span></span>
<span class="line"><span>        :);</span></span>
<span class="line"><span>    return rets;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//检查CPU主函数</span></span>
<span class="line"><span>void init_chkcpu(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (!chk_cpuid())</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;Your CPU is not support CPUID sys is die!&quot;);</span></span>
<span class="line"><span>        CLI_HALT();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (!chk_cpu_longmode())</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;Your CPU is not support 64bits mode sys is die!&quot;);</span></span>
<span class="line"><span>        CLI_HALT();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_cpumode = 0x40;//如果成功则设置机器信息结构的cpu模式为64位</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，检查CPU是否支持CPUID指令和检查CPU是否支持长模式，只要其中一步检查失败，我们就打印一条相应的提示信息，然后主动死机。 <strong>这里需要你留意的是，最后设置机器信息结构中的mb_cpumode字段为64,mbsp正是传递进来的机器信息machbstart_t结构体的指针。</strong></p><h3 id="获取内存布局" tabindex="-1">获取内存布局 <a class="header-anchor" href="#获取内存布局" aria-label="Permalink to &quot;获取内存布局&quot;">​</a></h3><p>好了，CPU已经检查完成 ，合乎我们的要求。下面就要获取内存布局信息了，物理内存在物理地址空间中是一段一段的，描述一段内存有一个数据结构，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define RAM_USABLE 1</span><span> //可用内存</span></span>
<span class="line"><span>#define RAM_RESERV 2</span><span> //保留内存不可使用</span></span>
<span class="line"><span>#define RAM_ACPIREC 3</span><span> //ACPI表相关的</span></span>
<span class="line"><span>#define RAM_ACPINVS 4</span><span> //ACPI NVS空间</span></span>
<span class="line"><span>#define RAM_AREACON 5</span><span> //包含坏内存</span></span>
<span class="line"><span>typedef struct s_e820{</span></span>
<span class="line"><span>    u64_t saddr;    /* 内存开始地址 */</span></span>
<span class="line"><span>    u64_t lsize;    /* 内存大小 */</span></span>
<span class="line"><span>    u32_t type;    /* 内存类型 */</span></span>
<span class="line"><span>}e820map_t;</span></span></code></pre></div><p>获取内存布局信息就是获取这个结构体的数组，这个工作我们交给init_mem函数来干，这个函数需要完成两件事：一是获取上述这个结构体数组，二是检查内存大小，因为我们的内核对内存容量有要求，不能太小。</p><p>下面我们来动手实现这个init_mem函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define ETYBAK_ADR 0x2000</span></span>
<span class="line"><span>#define PM32_EIP_OFF (ETYBAK_ADR)</span></span>
<span class="line"><span>#define PM32_ESP_OFF (ETYBAK_ADR+4)</span></span>
<span class="line"><span>#define E80MAP_NR (ETYBAK_ADR+64)//保存e820map_t结构数组元素个数的地址</span></span>
<span class="line"><span>#define E80MAP_ADRADR (ETYBAK_ADR+68)</span><span> //保存e820map_t结构数组的开始地址</span></span>
<span class="line"><span>void init_mem(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    e820map_t *retemp;</span></span>
<span class="line"><span>    u32_t retemnr = 0;</span></span>
<span class="line"><span>    mmap(&amp;retemp, &amp;retemnr);</span></span>
<span class="line"><span>    if (retemnr == 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;no e820map\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //根据e820map_t结构数据检查内存大小</span></span>
<span class="line"><span>    if (chk_memsize(retemp, retemnr, 0x100000, 0x8000000) == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;Your computer is low on memory, the memory cannot be less than 128MB!&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_e820padr = (u64_t)((u32_t)(retemp));//把e820map_t结构数组的首地址传给mbsp-&amp;gt;mb_e820padr</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_e820nr = (u64_t)retemnr;//把e820map_t结构数组元素个数传给mbsp-&amp;gt;mb_e820nr</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_e820sz = retemnr * (sizeof(e820map_t));//把e820map_t结构数组大小传给mbsp-&amp;gt;mb_e820sz</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_memsz = get_memsize(retemp, retemnr);//根据e820map_t结构数据计算内存大小。</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面最难写的是mmap函数。不过，我们还是有办法破解的。如果你理解了前面调用BIOS的机制，就会发现， <strong>只要调用了BIOS中断，就能获取e820map结构数组</strong>。</p><p>为了验证这个结论，我们来看一下mmap的函数调用关系：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void mmap(e820map_t **retemp, u32_t *retemnr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    realadr_call_entry(RLINTNR(0), 0, 0);</span></span>
<span class="line"><span>    *retemnr = *((u32_t *)(E80MAP_NR));</span></span>
<span class="line"><span>    *retemp = (e820map_t *)(*((u32_t *)(E80MAP_ADRADR)));</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，mmap函数正是通过前面讲的 <strong>realadr_call_entry函数</strong>，来调用实模式下的_getmmap函数的，并且在_getmmap函数中调用BIOS中断的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_getmmap:</span></span>
<span class="line"><span>	push ds</span></span>
<span class="line"><span>	push es</span></span>
<span class="line"><span>	push ss</span></span>
<span class="line"><span>	mov esi,0</span></span>
<span class="line"><span>	mov dword[E80MAP_NR],esi</span></span>
<span class="line"><span>	mov dword[E80MAP_ADRADR],E80MAP_ADR ;e820map结构体开始地址</span></span>
<span class="line"><span>	xor ebx,ebx</span></span>
<span class="line"><span>	mov edi,E80MAP_ADR</span></span>
<span class="line"><span>loop:</span></span>
<span class="line"><span>	mov eax,0e820h ;获取e820map结构参数</span></span>
<span class="line"><span>	mov ecx,20    ;e820map结构大小</span></span>
<span class="line"><span>	mov edx,0534d4150h ;获取e820map结构参数必须是这个数据</span></span>
<span class="line"><span>	int 15h  ;BIOS的15h中断</span></span>
<span class="line"><span>	jc .1</span></span>
<span class="line"><span>	add edi,20</span></span>
<span class="line"><span>	cmp edi,E80MAP_ADR+0x1000</span></span>
<span class="line"><span>	jg .1</span></span>
<span class="line"><span>	inc esi</span></span>
<span class="line"><span>	cmp ebx,0</span></span>
<span class="line"><span>	jne loop ;循环获取e820map结构</span></span>
<span class="line"><span>	jmp .2</span></span>
<span class="line"><span>.1:</span></span>
<span class="line"><span>	mov esi,0    ;出错处理，e820map结构数组元素个数为0</span></span>
<span class="line"><span>.2:</span></span>
<span class="line"><span>	mov dword[E80MAP_NR],esi ;e820map结构数组元素个数</span></span>
<span class="line"><span>	pop ss</span></span>
<span class="line"><span>	pop es</span></span>
<span class="line"><span>	pop ds</span></span>
<span class="line"><span>	ret</span></span></code></pre></div><p>如果你不明白上面代码的原理，请回到“Cache与内存：程序放在哪儿” <a href="https://time.geekbang.org/column/article/376711" target="_blank" rel="noreferrer">那节课</a>，看一下获取内存视图相关的知识点。</p><p>init_mem函数在调用mmap函数后，就会得到e820map结构数组，其首地址和数组元素个数由retemp，retemnr两个变量分别提供。</p><h3 id="初始化内核栈" tabindex="-1">初始化内核栈 <a class="header-anchor" href="#初始化内核栈" aria-label="Permalink to &quot;初始化内核栈&quot;">​</a></h3><p>因为我们的操作系统是C语言写的，所以需要有栈，下面我们就来给即将运行的内核初始化一个栈。这个操作非常简单，就是在机器信息结构machbstart_t中，记录一下栈地址和栈大小，供内核在启动时使用。</p><p>不过，就算操作再简单，我们也要封装成函数来使用。让我们动手来写出这个函数吧，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define IKSTACK_PHYADR (0x90000-0x10)</span></span>
<span class="line"><span>#define IKSTACK_SIZE 0x1000</span></span>
<span class="line"><span>//初始化内核栈</span></span>
<span class="line"><span>void init_krlinitstack(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (1 &amp;gt; move_krlimg(mbsp, (u64_t)(0x8f000), 0x1001))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;iks_moveimg err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_krlinitstack = IKSTACK_PHYADR;//栈顶地址</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_krlitstacksz = IKSTACK_SIZE; //栈大小是4KB</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>init_krlinitstack函数非常简单，但是其中调用了一个move_krlimg函数你要注意，这个我已经帮你写好啦，它主要负责判断一个地址空间是否和内存中存放的内容有冲突。</p><p>因为我们的内存中已经放置了机器信息结构、内存视图结构数组、二级引导器、内核映像文件，所以在处理内存空间时不能和内存中已经存在的他们冲突，否则就要覆盖他们的数据。0x8f000～（0x8f000+0x1001），正是我们的内核栈空间，我们需要检测它是否和其它空间有冲突。</p><h3 id="放置内核文件与字库文件" tabindex="-1">放置内核文件与字库文件 <a class="header-anchor" href="#放置内核文件与字库文件" aria-label="Permalink to &quot;放置内核文件与字库文件&quot;">​</a></h3><p>放置内核文件和字库文件这一步，也非常简单，甚至放置其它文件也一样。</p><p>因为我们的内核已经编译成了一个独立的二进制程序，和其它文件一起被打包到映像文件中了。所以我们必须要从映像中把它解包出来，将其放在特定的物理内存空间中才可以，放置字库文件和放置内核文件的原理一样，所以我们来一起实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//放置内核文件</span></span>
<span class="line"><span>void init_krlfile(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>//在映像中查找相应的文件，并复制到对应的地址，并返回文件的大小，这里是查找kernel.bin文件</span></span>
<span class="line"><span>    u64_t sz = r_file_to_padr(mbsp, IMGKRNL_PHYADR, &quot;kernel.bin&quot;);</span></span>
<span class="line"><span>    if (0 == sz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;r_file_to_padr err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //放置完成后更新机器信息结构中的数据</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_krlimgpadr = IMGKRNL_PHYADR;</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_krlsz = sz;</span></span>
<span class="line"><span>    //mbsp-&amp;gt;mb_nextwtpadr始终要保持指向下一段空闲内存的首地址</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_nextwtpadr = P4K_ALIGN(mbsp-&amp;gt;mb_krlimgpadr + mbsp-&amp;gt;mb_krlsz);</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_kalldendpadr = mbsp-&amp;gt;mb_krlimgpadr + mbsp-&amp;gt;mb_krlsz;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//放置字库文件</span></span>
<span class="line"><span>void init_defutfont(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t sz = 0;</span></span>
<span class="line"><span>    //获取下一段空闲内存空间的首地址</span></span>
<span class="line"><span>    u32_t dfadr = (u32_t)mbsp-&amp;gt;mb_nextwtpadr;</span></span>
<span class="line"><span>//在映像中查找相应的文件，并复制到对应的地址，并返回文件的大小，这里是查找font.fnt文件</span></span>
<span class="line"><span>    sz = r_file_to_padr(mbsp, dfadr, &quot;font.fnt&quot;);</span></span>
<span class="line"><span>    if (0 == sz)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;r_file_to_padr err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //放置完成后更新机器信息结构中的数据</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_bfontpadr = (u64_t)(dfadr);</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_bfontsz = sz;</span></span>
<span class="line"><span>    //更新机器信息结构中下一段空闲内存的首地址</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_nextwtpadr = P4K_ALIGN((u32_t)(dfadr) + sz);</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_kalldendpadr = mbsp-&amp;gt;mb_bfontpadr + mbsp-&amp;gt;mb_bfontsz;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码的注释已经很清楚了，都是调用r_file_to_padr函数在映像中查找kernel.bin和font.fnt文件，并复制到对应的空闲内存空间中。</p><p>请注意，由于内核是代码数据，所以必须要复制到指定的内存空间中。r_file_to_padr函数我已经帮你写好了，其中的原理在前面的内容里已经做了说明，这里不再展开。</p><h3 id="建立mmu页表数据" tabindex="-1">建立MMU页表数据 <a class="header-anchor" href="#建立mmu页表数据" aria-label="Permalink to &quot;建立MMU页表数据&quot;">​</a></h3><p>前面解决了文件放置问题，我们还要解决另一个问题——建立MMU页表。</p><p>我们在二级引导器中建立MMU页表数据，目的就是要在内核加载运行之初开启长模式时，MMU需要的页表数据已经准备好了。</p><p>由于我们的内核虚拟地址空间从0xffff800000000000开始，所以我们这个虚拟地址映射到从物理地址0开始，大小都是0x400000000即16GB，也就是说我们要虚拟地址空间：0xffff800000000000～0xffff800400000000 映射到物理地址空间0～0x400000000。</p><p>我们为了简化编程，使用 <strong>长模式下的2MB分页方式</strong>，下面我们用代码实现它，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define KINITPAGE_PHYADR 0x1000000</span></span>
<span class="line"><span>void init_bstartpages(machbstart_t *mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //顶级页目录</span></span>
<span class="line"><span>    u64_t *p = (u64_t *)(KINITPAGE_PHYADR);//16MB地址处</span></span>
<span class="line"><span>    //页目录指针</span></span>
<span class="line"><span>    u64_t *pdpte = (u64_t *)(KINITPAGE_PHYADR + 0x1000);</span></span>
<span class="line"><span>    //页目录</span></span>
<span class="line"><span>    u64_t *pde = (u64_t *)(KINITPAGE_PHYADR + 0x2000);</span></span>
<span class="line"><span>    //物理地址从0开始</span></span>
<span class="line"><span>    u64_t adr = 0;</span></span>
<span class="line"><span>    if (1 &amp;gt; move_krlimg(mbsp, (u64_t)(KINITPAGE_PHYADR), (0x1000 * 16 + 0x2000)))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;move_krlimg err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //将顶级页目录、页目录指针的空间清0</span></span>
<span class="line"><span>    for (uint_t mi = 0; mi &amp;lt; PGENTY_SIZE; mi++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        p[mi] = 0;</span></span>
<span class="line"><span>        pdpte[mi] = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //映射</span></span>
<span class="line"><span>    for (uint_t pdei = 0; pdei &amp;lt; 16; pdei++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        pdpte[pdei] = (u64_t)((u32_t)pde | KPDPTE_RW | KPDPTE_P);</span></span>
<span class="line"><span>        for (uint_t pdeii = 0; pdeii &amp;lt; PGENTY_SIZE; pdeii++)</span></span>
<span class="line"><span>        {//大页KPDE_PS 2MB，可读写KPDE_RW，存在KPDE_P</span></span>
<span class="line"><span>            pde[pdeii] = 0 | adr | KPDE_PS | KPDE_RW | KPDE_P;</span></span>
<span class="line"><span>            adr += 0x200000;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        pde = (u64_t *)((u32_t)pde + 0x1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //让顶级页目录中第0项和第((KRNL_VIRTUAL_ADDRESS_START) &amp;gt;&amp;gt; KPML4_SHIFT) &amp; 0x1ff项，指向同一个页目录指针页</span></span>
<span class="line"><span>    p[((KRNL_VIRTUAL_ADDRESS_START) &amp;gt;&amp;gt; KPML4_SHIFT) &amp; 0x1ff] = (u64_t)((u32_t)pdpte | KPML4_RW | KPML4_P);</span></span>
<span class="line"><span>    p[0] = (u64_t)((u32_t)pdpte | KPML4_RW | KPML4_P);</span></span>
<span class="line"><span>    //把页表首地址保存在机器信息结构中</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_pml4padr = (u64_t)(KINITPAGE_PHYADR);</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_subpageslen = (u64_t)(0x1000 * 16 + 0x2000);</span></span>
<span class="line"><span>    mbsp-&amp;gt;mb_kpmapphymemsz = (u64_t)(0x400000000);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个函数的代码写得非常简单， <strong>映射的核心逻辑由两重循环控制</strong>，外层循环控制页目录指针顶，只有16项，其中每一项都指向一个页目录，每个页目录中有512个物理页地址。</p><p>物理地址每次增加2MB，这是由26～30行的内层循环控制，每执行一次外层循环就要执行512次内层循环。</p><p>最后，顶级页目录中第0项和第((KRNL_VIRTUAL_ADDRESS_START) &gt;&gt; KPML4_SHIFT) &amp; 0x1ff项，指向同一个页目录指针页，这样的话就能让虚拟地址：0xffff800000000000～0xffff800400000000和虚拟地址：0～0x400000000，访问到同一个物理地址空间0～0x400000000，这样做是有目的， <strong>内核在启动初期，虚拟地址和物理地址要保持相同。</strong></p><h3 id="设置图形模式" tabindex="-1">设置图形模式 <a class="header-anchor" href="#设置图形模式" aria-label="Permalink to &quot;设置图形模式&quot;">​</a></h3><p>在计算机加电启动时，计算机上显卡会自动进入文本模式，文本模式只能显示ASCII字符，不能显示汉字和图形，所以我们要让显卡切换到图形模式。</p><p>切换显卡模式依然要用BIOS中断，这个调用原理我们前面已经了如指掌。在实模式切换显卡模式的汇编代码，我已经帮你写好了，下面我们只要写个C函数调用它们就好了，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_graph(machbstart_t* mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化图形数据结构</span></span>
<span class="line"><span>    graph_t_init(&amp;mbsp-&amp;gt;mb_ghparm);</span></span>
<span class="line"><span>    //获取VBE模式，通过BIOS中断</span></span>
<span class="line"><span>    get_vbemode(mbsp);</span></span>
<span class="line"><span>    //获取一个具体VBE模式的信息，通过BIOS中断</span></span>
<span class="line"><span>    get_vbemodeinfo(mbsp);</span></span>
<span class="line"><span>    //设置VBE模式，通过BIOS中断</span></span>
<span class="line"><span>    set_vbemodeinfo();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面init_graph函数中的这些处理VBE模式的代码，我已经帮你写好，你可以自己在graph.c文件查看。</p><p>什么？你不懂VBE，其实我开始也不懂，后来通过搜寻资料才知道。</p><p>其实VBE是显卡的一个图形规范标准，它定义了显卡的几种图形模式，每个模式包括屏幕分辨率，像素格式与大小，显存大小。调用BIOS 10h中断可以返回这些数据结构。 <a href="https://vesa.org/" target="_blank" rel="noreferrer">如果你实在对VBE感兴趣，可以自行阅读其规范</a> 。</p><p>这里我们选择使用了VBE的118h模式，该模式下屏幕分辨率为1024x768，显存大小是16.8MB。显存开始地址一般为0xe0000000。</p><p>屏幕分辨率为1024x768，即把屏幕分成768行，每行1024个像素点，但每个像素点占用显存的32位数据（4字节，红、绿、蓝、透明各占8位）。我们只要往对应的显存地址写入相应的像素数据，屏幕对应的位置就能显示了。</p><p>每个像素点，我们可以用如下数据结构表示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_PIXCL</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u8_t cl_b; //蓝</span></span>
<span class="line"><span>    u8_t cl_g; //绿</span></span>
<span class="line"><span>    u8_t cl_r; //红</span></span>
<span class="line"><span>    u8_t cl_a; //透明</span></span>
<span class="line"><span>}__attribute__((packed)) pixcl_t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define BGRA(r,g,b) ((0|(r&amp;lt;&amp;lt;16)|(g&amp;lt;&amp;lt;8)|b))</span></span>
<span class="line"><span>//通常情况下用pixl_t 和 BGRA宏</span></span>
<span class="line"><span>typedef u32_t pixl_t;</span></span></code></pre></div><p>我们再来看看屏幕像素点和显存位置对应的计算方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>u32_t* dispmem = (u32_t*)mbsp-&amp;gt;mb_ghparm.gh_framphyadr;</span></span>
<span class="line"><span>dispmem[x + (y * 1024)] = pix;</span></span>
<span class="line"><span>//x，y是像素的位置</span></span></code></pre></div><h3 id="串联" tabindex="-1">串联 <a class="header-anchor" href="#串联" aria-label="Permalink to &quot;串联&quot;">​</a></h3><p>好了，所有的实施工作的函数已经完成了，现在我们需要在init_bstartparm()函数中把它们串联起来，即按照事情的先后顺序，依次调用它们完成相应的工作，实现检查、收集机器信息，设置工作环境。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void init_bstartparm()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    machbstart_t *mbsp = MBSPADR;</span></span>
<span class="line"><span>    machbstart_t_init(mbsp);</span></span>
<span class="line"><span>    //检查CPU</span></span>
<span class="line"><span>    init_chkcpu(mbsp);</span></span>
<span class="line"><span>    //获取内存布局</span></span>
<span class="line"><span>    init_mem(mbsp);</span></span>
<span class="line"><span>    //初始化内核栈</span></span>
<span class="line"><span>    init_krlinitstack(mbsp);</span></span>
<span class="line"><span>    //放置内核文件</span></span>
<span class="line"><span>    init_krlfile(mbsp);</span></span>
<span class="line"><span>    //放置字库文件</span></span>
<span class="line"><span>    init_defutfont(mbsp);</span></span>
<span class="line"><span>    init_meme820(mbsp);</span></span>
<span class="line"><span>    //建立MMU页表</span></span>
<span class="line"><span>    init_bstartpages(mbsp);</span></span>
<span class="line"><span>    //设置图形模式</span></span>
<span class="line"><span>    init_graph(mbsp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这里，init_bstartparm()函数就成功完成了它的使命。</p><h2 id="显示logo" tabindex="-1">显示Logo <a class="header-anchor" href="#显示logo" aria-label="Permalink to &quot;显示Logo&quot;">​</a></h2><p>前面我们已经设置了图形模式，也应该要展示一下了，检查一下工作成果。</p><p>我们来显示一下我们内核的logo。其实在二级引导器中，我已经帮你写好了显示logo函数，而logo文件是个 <strong>24位的位图文件</strong>，目前为了简单起见，我们 <strong>只支持这种格式的图片文件</strong>。下面我们去调用这个函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void logo(machbstart_t* mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u32_t retadr=0,sz=0;</span></span>
<span class="line"><span>    //在映像文件中获取logo.bmp文件</span></span>
<span class="line"><span>    get_file_rpadrandsz(&quot;logo.bmp&quot;,mbsp,&amp;retadr,&amp;sz);</span></span>
<span class="line"><span>    if(0==retadr)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        kerror(&quot;logo getfilerpadrsz err&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //显示logo文件中的图像数据</span></span>
<span class="line"><span>    bmp_print((void*)retadr,mbsp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void init_graph(machbstart_t* mbsp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //……前面代码省略</span></span>
<span class="line"><span>    //显示</span></span>
<span class="line"><span>    logo(mbsp);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在图格式的文件中，除了文件头的数据就是图形像素点的数据，只不过24位的位图每个像素占用3字节，并且位置是倒排的，即第一个像素的数据是在文件的最后，依次类推。我们只要依次将位图文件的数据，按照倒排次序写入显存中，这样就可以显示了。</p><p>我们需要把二级引导器的文件和logo文件打包成映像文件，然后放在虚拟硬盘中。</p><p>复制文件到虚拟硬盘中得先mount，然后复制，最后转换成VDI格式的虚拟硬盘，再挂载到虚拟机上启动就行了。这也是为什么要手动建立硬盘的原因，打包命令如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>lmoskrlimg -m k -lhf initldrimh.bin -o Cosmos.eki -f initldrsve.bin initldrkrl.bin font.fnt logo.bmp</span></span></code></pre></div><p>如果手动打命令对你来说还是比较难，也别担心，我已经帮你写好了make脚本，你只需要进入代码目录中make vboxtest 就行了，运行结果如下 。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381157/c3d4f0b072b837f208fbd52749913yy0.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/381157/c3d4f0b072b837f208fbd52749913yy0.jpg" alt=""></a></p><p>啊哈！终于显示了logo。是不是挺有成就感的？这至少证明我们辛苦写的代码是正确的。</p><p>但是目前我们的代码执行流还在二级引导器中，我们的目的是开发自己的操作系统，不，我们是要开发Cosmos。</p><p><strong>后面，我们正式用Cosmos命名我们的操作系统。</strong> Cosmos可以翻译成宇宙，尽管它刚刚诞生，但我对它充满期待，所以用了这样一个能够“包括万物，包罗万象”的名字。</p><h2 id="进入cosmos" tabindex="-1">进入Cosmos <a class="header-anchor" href="#进入cosmos" aria-label="Permalink to &quot;进入Cosmos&quot;">​</a></h2><p>我们在调用Cosmos第一个C函数之前，我们依然要写一小段汇编代码，切换CPU到长模式，初始化CPU寄存器和C语言要用的栈。因为目前代码执行流在二级引导器中，进入到Cosmos中这样在二级引导器中初始过的东西都不能用了。</p><p>因为CPU进入了长模式，寄存器的位宽都变了，所以需要重新初始化。让我们一起来写这段汇编代码吧，我们先在Cosmos/hal/x86/下建立一个init_entry.asm文件，写上后面这段代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[section .start.text]</span></span>
<span class="line"><span>[BITS 32]</span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    cli</span></span>
<span class="line"><span>    mov ax,0x10</span></span>
<span class="line"><span>    mov ds,ax</span></span>
<span class="line"><span>    mov es,ax</span></span>
<span class="line"><span>    mov ss,ax</span></span>
<span class="line"><span>    mov fs,ax</span></span>
<span class="line"><span>    mov gs,ax</span></span>
<span class="line"><span>    lgdt [eGdtPtr]</span></span>
<span class="line"><span>    ;开启 PAE</span></span>
<span class="line"><span>    mov eax, cr4</span></span>
<span class="line"><span>    bts eax, 5                      ; CR4.PAE = 1</span></span>
<span class="line"><span>    mov cr4, eax</span></span>
<span class="line"><span>    mov eax, PML4T_BADR             ;加载MMU顶级页目录</span></span>
<span class="line"><span>    mov cr3, eax</span></span>
<span class="line"><span>    ;开启 64bits long-mode</span></span>
<span class="line"><span>    mov ecx, IA32_EFER</span></span>
<span class="line"><span>    rdmsr</span></span>
<span class="line"><span>    bts eax, 8                      ; IA32_EFER.LME =1</span></span>
<span class="line"><span>    wrmsr</span></span>
<span class="line"><span>    ;开启 PE 和 paging</span></span>
<span class="line"><span>    mov eax, cr0</span></span>
<span class="line"><span>    bts eax, 0                      ; CR0.PE =1</span></span>
<span class="line"><span>    bts eax, 31</span></span>
<span class="line"><span>    ;开启 CACHE</span></span>
<span class="line"><span>    btr eax,29		                ; CR0.NW=0</span></span>
<span class="line"><span>    btr eax,30		                ; CR0.CD=0  CACHE</span></span>
<span class="line"><span>    mov cr0, eax                    ; IA32_EFER.LMA = 1</span></span>
<span class="line"><span>    jmp 08:entry64</span></span>
<span class="line"><span>[BITS 64]</span></span>
<span class="line"><span>entry64:</span></span>
<span class="line"><span>    mov ax,0x10</span></span>
<span class="line"><span>    mov ds,ax</span></span>
<span class="line"><span>    mov es,ax</span></span>
<span class="line"><span>    mov ss,ax</span></span>
<span class="line"><span>    mov fs,ax</span></span>
<span class="line"><span>    mov gs,ax</span></span>
<span class="line"><span>    xor rax,rax</span></span>
<span class="line"><span>    xor rbx,rbx</span></span>
<span class="line"><span>    xor rbp,rbp</span></span>
<span class="line"><span>    xor rcx,rcx</span></span>
<span class="line"><span>    xor rdx,rdx</span></span>
<span class="line"><span>    xor rdi,rdi</span></span>
<span class="line"><span>    xor rsi,rsi</span></span>
<span class="line"><span>    xor r8,r8</span></span>
<span class="line"><span>    xor r9,r9</span></span>
<span class="line"><span>    xor r10,r10</span></span>
<span class="line"><span>    xor r11,r11</span></span>
<span class="line"><span>    xor r12,r12</span></span>
<span class="line"><span>    xor r13,r13</span></span>
<span class="line"><span>    xor r14,r14</span></span>
<span class="line"><span>    xor r15,r15</span></span>
<span class="line"><span>    mov rbx,MBSP_ADR</span></span>
<span class="line"><span>    mov rax,KRLVIRADR</span></span>
<span class="line"><span>    mov rcx,[rbx+KINITSTACK_OFF]</span></span>
<span class="line"><span>    add rax,rcx</span></span>
<span class="line"><span>    xor rcx,rcx</span></span>
<span class="line"><span>    xor rbx,rbx</span></span>
<span class="line"><span>    mov rsp,rax</span></span>
<span class="line"><span>    push 0</span></span>
<span class="line"><span>    push 0x8</span></span>
<span class="line"><span>    mov rax,hal_start                 ;调用内核主函数</span></span>
<span class="line"><span>    push rax</span></span>
<span class="line"><span>    dw 0xcb48</span></span>
<span class="line"><span>    jmp $</span></span>
<span class="line"><span>[section .start.data]</span></span>
<span class="line"><span>[BITS 32]</span></span>
<span class="line"><span>x64_GDT:</span></span>
<span class="line"><span>enull_x64_dsc:	dq 0</span></span>
<span class="line"><span>ekrnl_c64_dsc:  dq 0x0020980000000000   ; 64-bit 内核代码段</span></span>
<span class="line"><span>ekrnl_d64_dsc:  dq 0x0000920000000000   ; 64-bit 内核数据段</span></span>
<span class="line"><span>euser_c64_dsc:  dq 0x0020f80000000000   ; 64-bit 用户代码段</span></span>
<span class="line"><span>euser_d64_dsc:  dq 0x0000f20000000000   ; 64-bit 用户数据段</span></span>
<span class="line"><span>eGdtLen			equ	$ - enull_x64_dsc   ; GDT长度</span></span>
<span class="line"><span>eGdtPtr:		dw eGdtLen - 1			; GDT界限</span></span>
<span class="line"><span>				dq ex64_GDT</span></span></code></pre></div><p>上述代码中，1～11行表示加载70～75行的GDT，13～17行是设置MMU并加载在二级引导器中准备好的MMU页表，19～30行是开启长模式并打开Cache，34～54行则是初始化长模式下的寄存器，55～61行是读取二级引导器准备的机器信息结构中的栈地址，并用这个数据设置RSP寄存器。</p><p>最关键的是63～66行，它开始把8和hal_start函数的地址压入栈中。dw 0xcb48是直接写一条指令的机器码——0xcb48，这是一条返回指令。这个返回指令有点特殊，它会把栈中的数据分别弹出到RIP，CS寄存器，这正是为了调用我们Cosmos的 <strong>第一个C函数hal_start</strong>。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>这是我们设置工作模式与环境的最后一课，到此为止我们的二级引导器已经建立起来了，成功从 GRUB手中接过了权柄，开始了它自己的一系列工作，二级引导器完成的工作不算少，我来帮你梳理一下，重点如下。</p><p>1.二级引导器彻底摆脱了GRUB的控制之后，就开始检查CPU，获取内存布局信息，确认是不是我们要求的CPU和内存大小，接着初始化内核栈、放置好内核文件和字库文件，建立MMU页表数据和设置好图形模式，为后面运行内核做好准备。</p><p>2.当二级引导器完成了上述功能后，就会显示我们操作系统的logo，这标志着二级引导器所有的工作一切正常。</p><p>3.进入Cosmos，我们的二级引导器通过跳转到Cosmos的入口，结束了自己光荣使命，Cosmos的入口是一小段汇编代码，主要是开启CPU的长模式，最后调用了Cosmos的第一个C函数hal_start。</p><p>你想过吗？我们的二级引导器还可以做更多的事情，其实还可以在二级引导器中获取ACPI表，进而获取CPU数量和其它设备信息，期待你的实现。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请你想一下，init_bstartparm()函数中的init_mem820()函数，这个函数到底干了什么？</p><p>欢迎你在留言区跟我互动。如果你身边有朋友对手写操作系统有热情，也欢迎你把这节课转发给他。</p>`,96)])])}const u=n(e,[["render",t]]);export{_ as __pageData,u as default};
