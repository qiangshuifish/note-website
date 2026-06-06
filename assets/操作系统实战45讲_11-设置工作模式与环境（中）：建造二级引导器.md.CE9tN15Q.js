import{_ as n,H as a,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"11 | 设置工作模式与环境（中）：建造二级引导器","description":"","frontmatter":{},"headers":[{"level":2,"title":"设计机器信息结构","slug":"设计机器信息结构","link":"#设计机器信息结构","children":[]},{"level":2,"title":"规划二级引导器","slug":"规划二级引导器","link":"#规划二级引导器","children":[]},{"level":2,"title":"实现GRUB头","slug":"实现grub头","link":"#实现grub头","children":[]},{"level":2,"title":"进入二级引导器","slug":"进入二级引导器","link":"#进入二级引导器","children":[]},{"level":2,"title":"巧妙调用BIOS中断","slug":"巧妙调用bios中断","link":"#巧妙调用bios中断","children":[]},{"level":2,"title":"二级引导器主函数","slug":"二级引导器主函数","link":"#二级引导器主函数","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/11-设置工作模式与环境（中）：建造二级引导器.md","filePath":"操作系统实战45讲/11-设置工作模式与环境（中）：建造二级引导器.md","lastUpdated":1779820584000}'),e={name:"操作系统实战45讲/11-设置工作模式与环境（中）：建造二级引导器.md"};function i(t,s,c,d,r,o){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="_11-设置工作模式与环境-中-建造二级引导器" tabindex="-1">11 | 设置工作模式与环境（中）：建造二级引导器 <a class="header-anchor" href="#_11-设置工作模式与环境-中-建造二级引导器" aria-label="Permalink to &quot;11 | 设置工作模式与环境（中）：建造二级引导器&quot;">​</a></h1><p>你好，我是LMOS。</p><p>上节课，我们建造了属于我们的“计算机”，并且在上面安装好了GRUB。这节课我会带你一起实现二级引导器这个关键组件。</p><p>看到这儿你可能会问，GRUB不是已经把我们的操作系统加载到内存中了吗？我们有了GRUB，我们为什么还要实现二级引导器呢？</p><p>这里我要给你说说我的观点，二级引导器作为操作系统的先驱，它需要 <strong>收集机器信息</strong>，确定这个计算机能不能运行我们的操作系统，对CPU、内存、显卡进行一些初级的配置，放置好内核相关的文件。</p><p>因为我们二级引导器不是执行具体的加载任务的，而是解析内核文件、收集机器环境信息，它具体收集哪些信息，我会在下节课详细展开。</p><h2 id="设计机器信息结构" tabindex="-1">设计机器信息结构 <a class="header-anchor" href="#设计机器信息结构" aria-label="Permalink to &quot;设计机器信息结构&quot;">​</a></h2><p>二级引导器收集的信息，需要地点存放，我们需要设计一个数据结构。信息放在这个数据结构中，这个结构放在内存1MB的地方，方便以后传给我们的操作系统。</p><p>为了让你抓住重点，我选取了这个数据结构的 <strong>关键代码</strong>，这里并没有列出该结构的所有字段（Cosmos/initldr/include/ldrtype.h），这个结构如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct s_MACHBSTART</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    u64_t   mb_krlinitstack;//内核栈地址</span></span>
<span class="line"><span>    u64_t   mb_krlitstacksz;//内核栈大小</span></span>
<span class="line"><span>    u64_t   mb_imgpadr;//操作系统映像</span></span>
<span class="line"><span>    u64_t   mb_imgsz;//操作系统映像大小</span></span>
<span class="line"><span>    u64_t   mb_bfontpadr;//操作系统字体地址</span></span>
<span class="line"><span>    u64_t   mb_bfontsz;//操作系统字体大小</span></span>
<span class="line"><span>    u64_t   mb_fvrmphyadr;//机器显存地址</span></span>
<span class="line"><span>    u64_t   mb_fvrmsz;//机器显存大小</span></span>
<span class="line"><span>    u64_t   mb_cpumode;//机器CPU工作模式</span></span>
<span class="line"><span>    u64_t   mb_memsz;//机器内存大小</span></span>
<span class="line"><span>    u64_t   mb_e820padr;//机器e820数组地址</span></span>
<span class="line"><span>    u64_t   mb_e820nr;//机器e820数组元素个数</span></span>
<span class="line"><span>    u64_t   mb_e820sz;//机器e820数组大小</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    u64_t   mb_pml4padr;//机器页表数据地址</span></span>
<span class="line"><span>    u64_t   mb_subpageslen;//机器页表个数</span></span>
<span class="line"><span>    u64_t   mb_kpmapphymemsz;//操作系统映射空间大小</span></span>
<span class="line"><span>    //……</span></span>
<span class="line"><span>    graph_t mb_ghparm;//图形信息</span></span>
<span class="line"><span>}__attribute__((packed)) machbstart_t;</span></span></code></pre></div><h2 id="规划二级引导器" tabindex="-1">规划二级引导器 <a class="header-anchor" href="#规划二级引导器" aria-label="Permalink to &quot;规划二级引导器&quot;">​</a></h2><p>在开始写代码之前，我们先来从整体划分一下二级引导器的功能模块，从全局了解下功能应该怎么划分，这里我特意为你梳理了一个表格。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/380507/3169e9db4549ab036c2de269788a281e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/380507/3169e9db4549ab036c2de269788a281e.jpg" alt=""></a></p><p>前面表格里的这些文件，我都放在了课程配套源码中了，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson10~11" target="_blank" rel="noreferrer">这里</a> 下载。</p><p>上述这些文件都在lesson10～11/Cosmos/initldr/ldrkrl目录中，它们在编译之后会形成三个文件，编译脚本我已经写好了，下面我们用一幅图来展示这个编译过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/380507/bd55f67d02edff4415f06c914403bc40.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/380507/bd55f67d02edff4415f06c914403bc40.jpg" alt=""></a></p><p>这最后三个文件用我们前面说的映像工具打包成映像文件，其指令如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>lmoskrlimg -m k -lhf initldrimh.bin -o Cosmos.eki -f initldrkrl.bin initldrsve.bin</span></span></code></pre></div><h2 id="实现grub头" tabindex="-1">实现GRUB头 <a class="header-anchor" href="#实现grub头" aria-label="Permalink to &quot;实现GRUB头&quot;">​</a></h2><p>我们的GRUB头有两个文件组成， <strong>一个imginithead.asm汇编文件</strong>，它有两个功能，既能让GRUB识别，又能设置C语言运行环境，用于调用C函数； <strong>第二就是inithead.c文件</strong>，它的主要功能是查找二级引导器的核心文件——initldrkrl.bin，然后把它放置到特定的内存地址上。</p><p>我们先来实现imginithead.asm，它主要工作是初始化CPU的寄存器，加载GDT，切换到CPU的保护模式，我们一步一步来实现。</p><p>首先是GRUB1和GRUB2需要的两个头结构，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>MBT_HDR_FLAGS	EQU 0x00010003</span></span>
<span class="line"><span>MBT_HDR_MAGIC	EQU 0x1BADB002</span></span>
<span class="line"><span>MBT2_MAGIC	EQU 0xe85250d6</span></span>
<span class="line"><span>global _start</span></span>
<span class="line"><span>extern inithead_entry</span></span>
<span class="line"><span>[section .text]</span></span>
<span class="line"><span>[bits 32]</span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>	jmp _entry</span></span>
<span class="line"><span>align 4</span></span>
<span class="line"><span>mbt_hdr:</span></span>
<span class="line"><span>	dd MBT_HDR_MAGIC</span></span>
<span class="line"><span>	dd MBT_HDR_FLAGS</span></span>
<span class="line"><span>	dd -(MBT_HDR_MAGIC+MBT_HDR_FLAGS)</span></span>
<span class="line"><span>	dd mbt_hdr</span></span>
<span class="line"><span>	dd _start</span></span>
<span class="line"><span>	dd 0</span></span>
<span class="line"><span>	dd 0</span></span>
<span class="line"><span>	dd _entry</span></span>
<span class="line"><span>ALIGN 8</span></span>
<span class="line"><span>mbhdr:</span></span>
<span class="line"><span>	DD	0xE85250D6</span></span>
<span class="line"><span>	DD	0</span></span>
<span class="line"><span>	DD	mhdrend - mbhdr</span></span>
<span class="line"><span>	DD	-(0xE85250D6 + 0 + (mhdrend - mbhdr))</span></span>
<span class="line"><span>	DW	2, 0</span></span>
<span class="line"><span>	DD	24</span></span>
<span class="line"><span>	DD	mbhdr</span></span>
<span class="line"><span>	DD	_start</span></span>
<span class="line"><span>	DD	0</span></span>
<span class="line"><span>	DD	0</span></span>
<span class="line"><span>	DW	3, 0</span></span>
<span class="line"><span>	DD	12</span></span>
<span class="line"><span>	DD	_entry</span></span>
<span class="line"><span>	DD  0</span></span>
<span class="line"><span>	DW	0, 0</span></span>
<span class="line"><span>	DD	8</span></span>
<span class="line"><span>mhdrend:</span></span></code></pre></div><p>然后是关中断并加载GDT，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_entry:</span></span>
<span class="line"><span>	cli           ；关中断</span></span>
<span class="line"><span>	in al, 0x70</span></span>
<span class="line"><span>	or al, 0x80</span></span>
<span class="line"><span>	out 0x70,al  ；关掉不可屏蔽中断</span></span>
<span class="line"><span>	lgdt [GDT_PTR] ；加载GDT地址到GDTR寄存器</span></span>
<span class="line"><span>	jmp dword 0x8 :_32bits_mode ；长跳转刷新CS影子寄存器</span></span>
<span class="line"><span>  ;………………</span></span>
<span class="line"><span>;GDT全局段描述符表</span></span>
<span class="line"><span>GDT_START:</span></span>
<span class="line"><span>knull_dsc: dq 0</span></span>
<span class="line"><span>kcode_dsc: dq 0x00cf9e000000ffff</span></span>
<span class="line"><span>kdata_dsc: dq 0x00cf92000000ffff</span></span>
<span class="line"><span>k16cd_dsc: dq 0x00009e000000ffff ；16位代码段描述符</span></span>
<span class="line"><span>k16da_dsc: dq 0x000092000000ffff ；16位数据段描述符</span></span>
<span class="line"><span>GDT_END:</span></span>
<span class="line"><span>GDT_PTR:</span></span>
<span class="line"><span>GDTLEN	dw GDT_END-GDT_START-1	;GDT界限</span></span>
<span class="line"><span>GDTBASE	dd GDT_START</span></span></code></pre></div><p>最后是初始化段寄存器和通用寄存器、栈寄存器，这是为了给调用inithead_entry这个C函数做准备，代码如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_32bits_mode：</span></span>
<span class="line"><span>	mov ax, 0x10</span></span>
<span class="line"><span>	mov ds, ax</span></span>
<span class="line"><span>	mov ss, ax</span></span>
<span class="line"><span>	mov es, ax</span></span>
<span class="line"><span>	mov fs, ax</span></span>
<span class="line"><span>	mov gs, ax</span></span>
<span class="line"><span>	xor eax,eax</span></span>
<span class="line"><span>	xor ebx,ebx</span></span>
<span class="line"><span>	xor ecx,ecx</span></span>
<span class="line"><span>	xor edx,edx</span></span>
<span class="line"><span>	xor edi,edi</span></span>
<span class="line"><span>	xor esi,esi</span></span>
<span class="line"><span>	xor ebp,ebp</span></span>
<span class="line"><span>	xor esp,esp</span></span>
<span class="line"><span>	mov esp,0x7c00 ；设置栈顶为0x7c00</span></span>
<span class="line"><span>	call inithead_entry ；调用inithead_entry函数在inithead.c中实现</span></span>
<span class="line"><span>	jmp 0x200000  ；跳转到0x200000地址</span></span></code></pre></div><p>上述代码的最后调用了inithead_entry函数，这个函数我们需要另外在inithead.c中实现，我们这就来实现它，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define MDC_ENDGIC 0xaaffaaffaaffaaff</span></span>
<span class="line"><span>#define MDC_RVGIC 0xffaaffaaffaaffaa</span></span>
<span class="line"><span>#define REALDRV_PHYADR 0x1000</span></span>
<span class="line"><span>#define IMGFILE_PHYADR 0x4000000</span></span>
<span class="line"><span>#define IMGKRNL_PHYADR 0x2000000</span></span>
<span class="line"><span>#define LDRFILEADR IMGFILE_PHYADR</span></span>
<span class="line"><span>#define MLOSDSC_OFF (0x1000)</span></span>
<span class="line"><span>#define MRDDSC_ADR (mlosrddsc_t*)(LDRFILEADR+0x1000)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void inithead_entry()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    write_realintsvefile();</span></span>
<span class="line"><span>    write_ldrkrlfile();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//写initldrsve.bin文件到特定的内存中</span></span>
<span class="line"><span>void write_realintsvefile()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    fhdsc_t *fhdscstart = find_file(&quot;initldrsve.bin&quot;);</span></span>
<span class="line"><span>    if (fhdscstart == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        error(&quot;not file initldrsve.bin&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    m2mcopy((void *)((u32_t)(fhdscstart-&amp;gt;fhd_intsfsoff) + LDRFILEADR),</span></span>
<span class="line"><span>            (void *)REALDRV_PHYADR, (sint_t)fhdscstart-&amp;gt;fhd_frealsz);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//写initldrkrl.bin文件到特定的内存中</span></span>
<span class="line"><span>void write_ldrkrlfile()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    fhdsc_t *fhdscstart = find_file(&quot;initldrkrl.bin&quot;);</span></span>
<span class="line"><span>    if (fhdscstart == NULL)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        error(&quot;not file initldrkrl.bin&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    m2mcopy((void *)((u32_t)(fhdscstart-&amp;gt;fhd_intsfsoff) + LDRFILEADR),</span></span>
<span class="line"><span>            (void *)ILDRKRL_PHYADR, (sint_t)fhdscstart-&amp;gt;fhd_frealsz);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//在映像文件中查找对应的文件</span></span>
<span class="line"><span>fhdsc_t *find_file(char_t *fname)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    mlosrddsc_t *mrddadrs = MRDDSC_ADR;</span></span>
<span class="line"><span>    if (mrddadrs-&amp;gt;mdc_endgic != MDC_ENDGIC ||</span></span>
<span class="line"><span>        mrddadrs-&amp;gt;mdc_rv != MDC_RVGIC ||</span></span>
<span class="line"><span>        mrddadrs-&amp;gt;mdc_fhdnr &amp;lt; 2 ||</span></span>
<span class="line"><span>        mrddadrs-&amp;gt;mdc_filnr &amp;lt; 2)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        error(&quot;no mrddsc&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    s64_t rethn = -1;</span></span>
<span class="line"><span>    fhdsc_t *fhdscstart = (fhdsc_t *)((u32_t)(mrddadrs-&amp;gt;mdc_fhdbk_s) + LDRFILEADR);</span></span>
<span class="line"><span>    for (u64_t i = 0; i &amp;lt; mrddadrs-&amp;gt;mdc_fhdnr; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (strcmpl(fname, fhdscstart[i].fhd_name) == 0)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            rethn = (s64_t)i;</span></span>
<span class="line"><span>            goto ok_l;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    rethn = -1;</span></span>
<span class="line"><span>ok_l:</span></span>
<span class="line"><span>    if (rethn &amp;lt; 0)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        error(&quot;not find file&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return &amp;fhdscstart[rethn];</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们实现了inithead_entry函数，它主要干了两件事，即分别调用write_realintsvefile();、write_ldrkrlfile()函数，把映像文件中的initldrsve.bin文件和initldrkrl.bin文件写入到特定的内存地址空间中，具体地址在上面代码中的宏有详细定义。</p><p>这两个函数分别依赖于find_file和m2mcopy函数。</p><p>正如其名，find_file函数负责扫描映像文件中的文件头描述符，对比其中的文件名，然后返回对应的文件头描述符的地址，这样就可以得到文件在映像文件中的位置和大小了。</p><p>find_file函数的接力队友就是m2mcopy函数，因为查找对比之后，最后就是m2mcopy函数负责把映像文件复制到具体的内存空间里。</p><p>代码中的其它函数我就不展开了，感兴趣的同学请自行研究，或者自己改写。</p><h2 id="进入二级引导器" tabindex="-1">进入二级引导器 <a class="header-anchor" href="#进入二级引导器" aria-label="Permalink to &quot;进入二级引导器&quot;">​</a></h2><p>你应该还有印象，刚才说的实现GRUB头这个部分，在imghead.asm汇编文件代码中，我们的最后一条指令是“ <strong>jmp 0x200000</strong>”，即跳转到物理内存的0x200000地址处。</p><p>请你注意，这时地址还是物理地址，这个地址正是在inithead.c中由write_ldrkrlfile()函数放置的initldrkrl.bin文件，这一跳就进入了二级引导器的主模块了。</p><p>由于模块的改变，我们还需要写一小段汇编代码，建立下面这个initldr32.asm（配套代码库中对应ldrkrl32.asm）文件，并写上如下代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_entry:</span></span>
<span class="line"><span>	cli</span></span>
<span class="line"><span>	lgdt [GDT_PTR]；加载GDT地址到GDTR寄存器</span></span>
<span class="line"><span>	lidt [IDT_PTR]；加载IDT地址到IDTR寄存器</span></span>
<span class="line"><span>	jmp dword 0x8 :_32bits_mode；长跳转刷新CS影子寄存器</span></span>
<span class="line"><span>_32bits_mode:</span></span>
<span class="line"><span>	mov ax, 0x10	; 数据段选择子(目的)</span></span>
<span class="line"><span>	mov ds, ax</span></span>
<span class="line"><span>	mov ss, ax</span></span>
<span class="line"><span>	mov es, ax</span></span>
<span class="line"><span>	mov fs, ax</span></span>
<span class="line"><span>	mov gs, ax</span></span>
<span class="line"><span>	xor eax,eax</span></span>
<span class="line"><span>	xor ebx,ebx</span></span>
<span class="line"><span>	xor ecx,ecx</span></span>
<span class="line"><span>	xor edx,edx</span></span>
<span class="line"><span>	xor edi,edi</span></span>
<span class="line"><span>	xor esi,esi</span></span>
<span class="line"><span>	xor ebp,ebp</span></span>
<span class="line"><span>	xor esp,esp</span></span>
<span class="line"><span>	mov esp,0x90000 ；使得栈底指向了0x90000</span></span>
<span class="line"><span>	call ldrkrl_entry ；调用ldrkrl_entry函数</span></span>
<span class="line"><span>	xor ebx,ebx</span></span>
<span class="line"><span>	jmp 0x2000000 ；跳转到0x2000000的内存地址</span></span>
<span class="line"><span>	jmp $</span></span>
<span class="line"><span>GDT_START:</span></span>
<span class="line"><span>knull_dsc: dq 0</span></span>
<span class="line"><span>kcode_dsc: dq 0x00cf9a000000ffff ;a-e</span></span>
<span class="line"><span>kdata_dsc: dq 0x00cf92000000ffff</span></span>
<span class="line"><span>k16cd_dsc: dq 0x00009a000000ffff ；16位代码段描述符</span></span>
<span class="line"><span>k16da_dsc: dq 0x000092000000ffff ；16位数据段描述符</span></span>
<span class="line"><span>GDT_END:</span></span>
<span class="line"><span>GDT_PTR:</span></span>
<span class="line"><span>GDTLEN	dw GDT_END-GDT_START-1	;GDT界限</span></span>
<span class="line"><span>GDTBASE	dd GDT_START</span></span>
<span class="line"><span></span></span>
<span class="line"><span>IDT_PTR:</span></span>
<span class="line"><span>IDTLEN	dw 0x3ff</span></span>
<span class="line"><span>IDTBAS	dd 0  ；这是BIOS中断表的地址和长度</span></span></code></pre></div><p>我来给你做个解读，代码的1～4行是在加载GDTR和IDTR寄存器，然后初始化CPU相关的寄存器。</p><p>和先前一样，因为代码模块的改变，所以我们要把GDT、IDT，寄存器这些东西重新初始化，最后再去调用二级引导器的主函数ldrkrl_entry。</p><h2 id="巧妙调用bios中断" tabindex="-1">巧妙调用BIOS中断 <a class="header-anchor" href="#巧妙调用bios中断" aria-label="Permalink to &quot;巧妙调用BIOS中断&quot;">​</a></h2><p>我们不要急着去写ldrkrl_entry函数，因为在后面我们要获得内存布局信息，要设置显卡图形模式，而这些功能依赖于BIOS提供中断服务。</p><p>可是，要在C函数中调用BIOS中断是不可能的，因为C语言代码工作在32位保护模式下，BIOS中断工作在16位的实模式。</p><p>所以，C语言环境下调用BIOS中断，需要处理的问题如下：</p><p>1.保存C语言环境下的CPU上下文 ，即保护模式下的所有通用寄存器、段寄存器、程序指针寄存器，栈寄存器，把它们都保存在内存中。</p><p>2.切换回实模式，调用BIOS中断，把BIOS中断返回的相关结果，保存在内存中。</p><p>3.切换回保护模式，重新加载第1步中保存的寄存器。这样C语言代码才能重新恢复执行。</p><p>要完成上面的功能，必须要写一个汇编函数才能完成，我们就把它写在ldrkrl32.asm文件中，如下所示 。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>realadr_call_entry:</span></span>
<span class="line"><span>	pushad     ;保存通用寄存器</span></span>
<span class="line"><span>	push    ds</span></span>
<span class="line"><span>	push    es</span></span>
<span class="line"><span>	push    fs ;保存4个段寄存器</span></span>
<span class="line"><span>	push    gs</span></span>
<span class="line"><span>	call save_eip_jmp ；调用save_eip_jmp</span></span>
<span class="line"><span>	pop	gs</span></span>
<span class="line"><span>	pop	fs</span></span>
<span class="line"><span>	pop	es      ;恢复4个段寄存器</span></span>
<span class="line"><span>	pop	ds</span></span>
<span class="line"><span>	popad       ;恢复通用寄存器</span></span>
<span class="line"><span>	ret</span></span>
<span class="line"><span>save_eip_jmp:</span></span>
<span class="line"><span>	pop esi  ；弹出call save_eip_jmp时保存的eip到esi寄存器中，</span></span>
<span class="line"><span>	mov [PM32_EIP_OFF],esi ；把eip保存到特定的内存空间中</span></span>
<span class="line"><span>	mov [PM32_ESP_OFF],esp ；把esp保存到特定的内存空间中</span></span>
<span class="line"><span>	jmp dword far [cpmty_mode]；长跳转这里表示把cpmty_mode处的第一个4字节装入eip，把其后的2字节装入cs</span></span>
<span class="line"><span>cpmty_mode:</span></span>
<span class="line"><span>	dd 0x1000</span></span>
<span class="line"><span>	dw 0x18</span></span>
<span class="line"><span>	jmp $</span></span></code></pre></div><p>上面的代码我列了详细注释，你一看就能明白。不过这里唯一不好懂的是 <strong>jmp dword far [cpmty_mode]指令</strong>，别担心，听我给你解读一下。</p><p>其实这个指令是一个 <strong>长跳转</strong>，表示把[cpmty_mode]处的数据装入CS：EIP，也就是把0x18：0x1000装入到CS：EIP中。</p><p>这个0x18就是段描述索引（这个知识点不熟悉的话，你可以回看我们 <a href="https://time.geekbang.org/column/article/375278" target="_blank" rel="noreferrer">第五节课</a>），它正是指向GDT中的16位代码段描述符；0x1000代表段内的偏移地址，所以在这个地址上，我们必须放一段代码指令，不然CPU跳转到这里将没指令可以执行，那样就会发生错误。</p><p>因为这是一个16位代码，所以我们需要新建立一个文件realintsve.asm，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[bits 16]</span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>_16_mode:</span></span>
<span class="line"><span>	mov	bp,0x20 ;0x20是指向GDT中的16位数据段描述符</span></span>
<span class="line"><span>	mov	ds, bp</span></span>
<span class="line"><span>	mov	es, bp</span></span>
<span class="line"><span>	mov	ss, bp</span></span>
<span class="line"><span>	mov	ebp, cr0</span></span>
<span class="line"><span>	and	ebp, 0xfffffffe</span></span>
<span class="line"><span>	mov	cr0, ebp ；CR0.P=0 关闭保护模式</span></span>
<span class="line"><span>	jmp	0:real_entry ；刷新CS影子寄存器，真正进入实模式</span></span>
<span class="line"><span>real_entry:</span></span>
<span class="line"><span>	mov bp, cs</span></span>
<span class="line"><span>	mov ds, bp</span></span>
<span class="line"><span>	mov es, bp</span></span>
<span class="line"><span>	mov ss, bp ；重新设置实模式下的段寄存器 都是CS中值，即为0</span></span>
<span class="line"><span>	mov sp, 08000h ；设置栈</span></span>
<span class="line"><span>	mov bp,func_table</span></span>
<span class="line"><span>	add bp,ax</span></span>
<span class="line"><span>	call [bp] ；调用函数表中的汇编函数，ax是C函数中传递进来的</span></span>
<span class="line"><span>	cli</span></span>
<span class="line"><span>	call disable_nmi</span></span>
<span class="line"><span>	mov	ebp, cr0</span></span>
<span class="line"><span>	or	ebp, 1</span></span>
<span class="line"><span>	mov	cr0, ebp ；CR0.P=1 开启保护模式</span></span>
<span class="line"><span>	jmp dword 0x8 :_32bits_mode</span></span>
<span class="line"><span>[BITS 32]</span></span>
<span class="line"><span>_32bits_mode:</span></span>
<span class="line"><span>	mov bp, 0x10</span></span>
<span class="line"><span>	mov ds, bp</span></span>
<span class="line"><span>	mov ss, bp；重新设置保护模式下的段寄存器0x10是32位数据段描述符的索引</span></span>
<span class="line"><span>	mov esi,[PM32_EIP_OFF]；加载先前保存的EIP</span></span>
<span class="line"><span>	mov esp,[PM32_ESP_OFF]；加载先前保存的ESP</span></span>
<span class="line"><span>	jmp esi ；eip=esi 回到了realadr_call_entry函数中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func_table:  ;函数表</span></span>
<span class="line"><span>	dw _getmmap ；获取内存布局视图的函数</span></span>
<span class="line"><span>	dw _read ；读取硬盘的函数</span></span>
<span class="line"><span>    dw _getvbemode ；获取显卡VBE模式</span></span>
<span class="line"><span>    dw _getvbeonemodeinfo ；获取显卡VBE模式的数据</span></span>
<span class="line"><span>    dw _setvbemode ；设置显卡VBE模式</span></span></code></pre></div><p>上面的代码我们只要将它编译成16位的二进制的文件，并把它放在0x1000开始的内存空间中就可以了。这样在realadr_call_entry函数的最后，就运行到这段代码中来了。</p><p>上述的代码的流程是这样的：首先从 _16_mode:标号处进入实模式，然后根据传递进来（由ax寄存器传入）的函数号，到函数表中调用对应的函数，里面的函数执行完成后，再次进入保护模式，加载EIP和ESP寄存器从而回到realadr_call_entry函数中。GDT还是imghead.asm汇编代码文件中的GDT，这没有变，因为它是由GDTR寄存器指向的。</p><p>说到这里，相信你会立刻明白，之前write_realintsvefile()函数的功能与意义了。它会把 <strong>映像文件中的initldrsve.bin文件写入到特定的内存地址空间中</strong>，而initldrsve.bin正是由上面的realintsve.asm文件编译而成的。</p><h2 id="二级引导器主函数" tabindex="-1">二级引导器主函数 <a class="header-anchor" href="#二级引导器主函数" aria-label="Permalink to &quot;二级引导器主函数&quot;">​</a></h2><p>好，现在我们准备得差不多了，从二级引导器的主函数开始，这个函数我们要用C来写，估计你也感受到了写汇编语言的压力，所以不能老是写汇编。</p><p>我们先建立一个C文件ldrkrlentry.c，在其中写上一个主函数，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void ldrkrl_entry()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    init_bstartparm();</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中的 ldrkrl_entry()函数在initldr32.asm文件（配套代码库中对应ldrkrl32.asm）中被调用，从那条call ldrkrl_entry 指令开始进入了ldrkrl_entry()函数，在其中调用了 <strong>init_bstartparm()函数</strong>，这个函数我们还没有实现，但通过名字我们不难推测，它是负责处理开始参数的。</p><p>你还记不记得，我们建造二级引导器的目的，就是要收集机器环境信息。我们要把这些信息形成一个有结构的参数，传递给我们的操作系统内核以备后续使用。</p><p>由此，我们能够确定， <strong>init_bstartparm()函数成了收集机器环境信息的主函数</strong>，下节课我们就会去实现它。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天我们开始实现二级引导器了，但是我们还没有完全实现，我们下一节课再接着继续这项工作。</p><p>现在，我们来梳理一下这节课的内容，回顾一下我们今天的成果。</p><p>1.我们设计了机器信息结构，用于存放后面二级引导器收集到的机器信息。</p><p>2.对二级引导器代码模块进行了规划，确定各模块的主要功能。</p><p>3.实现了GRUB规定的GRUB头，以便被GRUB识别，在GRUB头中初始化了CPU寄存器，并且跳转到物理内存的0x200000地址处，真正进入到二级引导器中开始运行。</p><p>4.为了二级引导器能够调用BIOS中断服务程序，我们实现了专门用来完成调用BIOS中断服务程序的realintsve.asm模块。</p><p>5.最后，我们实现了二级引导器的主函数，由它调用完成其它功能的函数。</p><p>这里我还想聊聊，为什么我们要花这么多功夫，去设计二级引导器这个组件呢？</p><p>我们把这些处理操作系统运行环境的工作独立出来，交给二级引导器来做，这会 <strong>大大降低后面开发操作系统的难度，也能增加操作系统的通用性。</strong> 而且，针对不同的硬件平台，我们只要开发不同的二级引导器就好了。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>请问GRUB头中为什么需要_entry标号和_start标号的地址？</p><p>欢迎你在留言区跟我交流活动。如果你身边的同事、朋友，对二级引导器的建立有兴趣，也欢迎你把这节课分享给他。</p><p>好，我是LMOS，我们下节课见！</p>`,79)])])}const h=n(e,[["render",i]]);export{m as __pageData,h as default};
