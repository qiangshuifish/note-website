import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const b=JSON.parse('{"title":"02 | 几行汇编几行C：实现一个最简单的内核","description":"","frontmatter":{},"headers":[{"level":2,"title":"PC机的引导流程","slug":"pc机的引导流程","link":"#pc机的引导流程","children":[]},{"level":2,"title":"Hello OS引导汇编代码","slug":"hello-os引导汇编代码","link":"#hello-os引导汇编代码","children":[]},{"level":2,"title":"Hello OS的主函数","slug":"hello-os的主函数","link":"#hello-os的主函数","children":[]},{"level":2,"title":"控制计算机屏幕","slug":"控制计算机屏幕","link":"#控制计算机屏幕","children":[]},{"level":2,"title":"编译和安装Hello OS","slug":"编译和安装hello-os","link":"#编译和安装hello-os","children":[]},{"level":2,"title":"make工具","slug":"make工具","link":"#make工具","children":[]},{"level":2,"title":"编译","slug":"编译","link":"#编译","children":[]},{"level":2,"title":"安装Hello OS","slug":"安装hello-os","link":"#安装hello-os","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"操作系统实战45讲/02-几行汇编几行C：实现一个最简单的内核.md","filePath":"操作系统实战45讲/02-几行汇编几行C：实现一个最简单的内核.md","lastUpdated":1779820584000}'),l={name:"操作系统实战45讲/02-几行汇编几行C：实现一个最简单的内核.md"};function i(t,s,o,c,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_02-几行汇编几行c-实现一个最简单的内核" tabindex="-1">02 | 几行汇编几行C：实现一个最简单的内核 <a class="header-anchor" href="#_02-几行汇编几行c-实现一个最简单的内核" aria-label="Permalink to &quot;02 | 几行汇编几行C：实现一个最简单的内核&quot;">​</a></h1><p>你好，我是LMOS。</p><p>我们知道，在学习许多编程语言一开始的时候，都有一段用其语言编写的经典程序——Hello World。这不过是某一操作系统平台之上的应用程序，却心高气傲地问候世界。</p><p>而我们学习操作系统的时候，那么也不妨撇开其它现有的操作系统，基于硬件，写一个最小的操作系统——Hello OS，先练练手、热热身，直观感受一下。</p><p>本节课的配套代码，你可以从 <a href="https://gitee.com/lmos/cosmos/tree/master/lesson02/HelloOS" target="_blank" rel="noreferrer">这里</a> 下载。</p><p>请注意，这节课主要是演示思路，不要求你马上动手实现。详细的环境安装、配置我们到第十节课再详细展开。有兴趣上手的同学，可以参考留言区置顶的实验笔记探索。</p><h2 id="pc机的引导流程" tabindex="-1">PC机的引导流程 <a class="header-anchor" href="#pc机的引导流程" aria-label="Permalink to &quot;PC机的引导流程&quot;">​</a></h2><p>看标题就知道，写操作系统要用汇编和C语言，尽管这个Hello OS很小，但也要用到两种编程语言。其实，现有的商业操作系统都是用这两种语言开发出来的。</p><p>先不用害怕，Hello OS的代码量很少。</p><p>其实，我们也不打算从PC的引导程序开始写起，原因是目前我们的知识储备还不够，所以先借用一下GRUB引导程序，只要我们的PC机上安装了Ubuntu Linux操作系统，GRUB就已经存在了。这会大大降低我们开始的难度，也不至于打消你的热情。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/1db2342da1abdc9f1f77e4c69a94d0dc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/1db2342da1abdc9f1f77e4c69a94d0dc.png" alt=""></a></p><p>那在写Hello OS之前，我们先要搞清楚Hello OS的引导流程，如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/f2d31ab7144bf309761711efa9d6d4bd.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/f2d31ab7144bf309761711efa9d6d4bd.jpg" alt=""></a></p><p>简单解释一下，PC机BIOS固件是固化在PC机主板上的ROM芯片中的，掉电也能保存，PC机上电后的第一条指令就是BIOS固件中的，它负责 <strong>检测和初始化CPU、内存及主板平台</strong>，然后加载引导设备（大概率是硬盘）中的第一个扇区数据，到0x7c00地址开始的内存空间，再接着跳转到0x7c00处执行指令，在我们这里的情况下就是GRUB引导程序。</p><p>当然，更先进的 <a href="https://www.uefi.org/" target="_blank" rel="noreferrer">UEFI BIOS</a> 则不同，这里就不深入其中了，你可以通过链接自行了解。</p><h2 id="hello-os引导汇编代码" tabindex="-1">Hello OS引导汇编代码 <a class="header-anchor" href="#hello-os引导汇编代码" aria-label="Permalink to &quot;Hello OS引导汇编代码&quot;">​</a></h2><p>明白了PC机的启动流程，下面只剩下我们的Hello OS了，我们马上就去写好它。</p><p>我们先来写一段汇编代码。这里我要特别说明一个问题：为什么不能直接用C？</p><p><strong>C作为通用的高级语言，不能直接操作特定的硬件，而且C语言的函数调用、函数传参，都需要用栈。</strong></p><p>栈简单来说就是一块内存空间，其中数据满足 <strong>后进先出</strong> 的特性，它由CPU特定的栈寄存器指向，所以我们要先用汇编代码处理好这些C语言的工作环境。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>;彭东 &amp;#64; 2021.01.09</span></span>
<span class="line"><span>MBT_HDR_FLAGS EQU 0x00010003</span></span>
<span class="line"><span>MBT_HDR_MAGIC EQU 0x1BADB002 ;多引导协议头魔数</span></span>
<span class="line"><span>MBT_HDR2_MAGIC EQU 0xe85250d6 ;第二版多引导协议头魔数</span></span>
<span class="line"><span>global _start ;导出_start符号</span></span>
<span class="line"><span>extern main ;导入外部的main函数符号</span></span>
<span class="line"><span>[section .start.text] ;定义.start.text代码节</span></span>
<span class="line"><span>[bits 32] ;汇编成32位代码</span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>jmp _entry</span></span>
<span class="line"><span>ALIGN 8</span></span>
<span class="line"><span>mbt_hdr:</span></span>
<span class="line"><span>dd MBT_HDR_MAGIC</span></span>
<span class="line"><span>dd MBT_HDR_FLAGS</span></span>
<span class="line"><span>dd -(MBT_HDR_MAGIC+MBT_HDR_FLAGS)</span></span>
<span class="line"><span>dd mbt_hdr</span></span>
<span class="line"><span>dd _start</span></span>
<span class="line"><span>dd 0</span></span>
<span class="line"><span>dd 0</span></span>
<span class="line"><span>dd _entry</span></span>
<span class="line"><span>;以上是GRUB所需要的头</span></span>
<span class="line"><span>ALIGN 8</span></span>
<span class="line"><span>mbt2_hdr:</span></span>
<span class="line"><span>DD MBT_HDR2_MAGIC</span></span>
<span class="line"><span>DD 0</span></span>
<span class="line"><span>DD mbt2_hdr_end - mbt2_hdr</span></span>
<span class="line"><span>DD -(MBT_HDR2_MAGIC + 0 + (mbt2_hdr_end - mbt2_hdr))</span></span>
<span class="line"><span>DW 2, 0</span></span>
<span class="line"><span>DD 24</span></span>
<span class="line"><span>DD mbt2_hdr</span></span>
<span class="line"><span>DD _start</span></span>
<span class="line"><span>DD 0</span></span>
<span class="line"><span>DD 0</span></span>
<span class="line"><span>DW 3, 0</span></span>
<span class="line"><span>DD 12</span></span>
<span class="line"><span>DD _entry</span></span>
<span class="line"><span>DD 0</span></span>
<span class="line"><span>DW 0, 0</span></span>
<span class="line"><span>DD 8</span></span>
<span class="line"><span>mbt2_hdr_end:</span></span>
<span class="line"><span>;以上是GRUB2所需要的头</span></span>
<span class="line"><span>;包含两个头是为了同时兼容GRUB、GRUB2</span></span>
<span class="line"><span>ALIGN 8</span></span>
<span class="line"><span>_entry:</span></span>
<span class="line"><span>;关中断</span></span>
<span class="line"><span>cli</span></span>
<span class="line"><span>;关不可屏蔽中断</span></span>
<span class="line"><span>in al, 0x70</span></span>
<span class="line"><span>or al, 0x80</span></span>
<span class="line"><span>out 0x70,al</span></span>
<span class="line"><span>;重新加载GDT</span></span>
<span class="line"><span>lgdt [GDT_PTR]</span></span>
<span class="line"><span>jmp dword 0x8 :_32bits_mode</span></span>
<span class="line"><span>_32bits_mode:</span></span>
<span class="line"><span>;下面初始化C语言可能会用到的寄存器</span></span>
<span class="line"><span>mov ax, 0x10</span></span>
<span class="line"><span>mov ds, ax</span></span>
<span class="line"><span>mov ss, ax</span></span>
<span class="line"><span>mov es, ax</span></span>
<span class="line"><span>mov fs, ax</span></span>
<span class="line"><span>mov gs, ax</span></span>
<span class="line"><span>xor eax,eax</span></span>
<span class="line"><span>xor ebx,ebx</span></span>
<span class="line"><span>xor ecx,ecx</span></span>
<span class="line"><span>xor edx,edx</span></span>
<span class="line"><span>xor edi,edi</span></span>
<span class="line"><span>xor esi,esi</span></span>
<span class="line"><span>xor ebp,ebp</span></span>
<span class="line"><span>xor esp,esp</span></span>
<span class="line"><span>;初始化栈，C语言需要栈才能工作</span></span>
<span class="line"><span>mov esp,0x9000</span></span>
<span class="line"><span>;调用C语言函数main</span></span>
<span class="line"><span>call main</span></span>
<span class="line"><span>;让CPU停止执行指令</span></span>
<span class="line"><span>halt_step:</span></span>
<span class="line"><span>halt</span></span>
<span class="line"><span>jmp halt_step</span></span>
<span class="line"><span>GDT_START:</span></span>
<span class="line"><span>knull_dsc: dq 0</span></span>
<span class="line"><span>kcode_dsc: dq 0x00cf9e000000ffff</span></span>
<span class="line"><span>kdata_dsc: dq 0x00cf92000000ffff</span></span>
<span class="line"><span>k16cd_dsc: dq 0x00009e000000ffff</span></span>
<span class="line"><span>k16da_dsc: dq 0x000092000000ffff</span></span>
<span class="line"><span>GDT_END:</span></span>
<span class="line"><span>GDT_PTR:</span></span>
<span class="line"><span>GDTLEN dw GDT_END-GDT_START-1</span></span>
<span class="line"><span>GDTBASE dd GDT_START</span></span></code></pre></div><p>以上的汇编代码（/lesson02/HelloOS/entry.asm）分为4个部分：</p><p>1.代码1~40行，用汇编定义的GRUB的多引导协议头，其实就是一定格式的数据，我们的Hello OS是用GRUB引导的，当然要遵循 <strong>GRUB的多引导协议标准</strong>，让GRUB能识别我们的Hello OS。之所以有两个引导头，是为了兼容GRUB1和GRUB2。</p><p>2.代码44~52行，关掉中断，设定CPU的工作模式。你现在可能不懂，没事儿，后面CPU相关的课程我们会专门再研究它。</p><p>3.代码54~73行，初始化CPU的寄存器和C语言的运行环境。</p><p>4.代码78~87行，GDT_START开始的，是CPU工作模式所需要的数据，同样，后面讲CPU时会专门介绍。</p><h2 id="hello-os的主函数" tabindex="-1">Hello OS的主函数 <a class="header-anchor" href="#hello-os的主函数" aria-label="Permalink to &quot;Hello OS的主函数&quot;">​</a></h2><p>到这，不知道你有没有发现一个问题?上面的汇编代码调用了main函数，而在其代码中并没有看到其函数体，而是从外部引入了一个符号。</p><p>那是因为这个函数是用C语言写的在（/lesson02/HelloOS/main.c）中，最终它们分别由nasm和GCC编译成可链接模块，由LD链接器链接在一起，形成可执行的程序文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//彭东 &amp;#64; 2021.01.09</span></span>
<span class="line"><span>#include &quot;vgastr.h&quot;</span></span>
<span class="line"><span>void main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  printf(&quot;Hello OS!&quot;);</span></span>
<span class="line"><span>  return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上这段代码，你应该很熟悉了吧？不过这不是应用程序的main函数，而是Hello OS的main函数。</p><p>其中的printf也不是应用程序库中的那个printf了，而是需要我们自己实现了。你可以先停下歇歇，再去实现printf函数。</p><h2 id="控制计算机屏幕" tabindex="-1">控制计算机屏幕 <a class="header-anchor" href="#控制计算机屏幕" aria-label="Permalink to &quot;控制计算机屏幕&quot;">​</a></h2><p>接着我们再看下显卡，这和我们接下来要写的代码有直接关联。</p><p>计算机屏幕显示往往是显卡的输出，显卡有很多形式：集成在主板的叫集显，做在CPU芯片内的叫核显，独立存在通过PCIE接口连接的叫独显，性能依次上升，价格也是。</p><p>独显的高性能是游戏玩家们所钟爱的，3D图形显示往往要涉及顶点处理、多边形的生成和变换、纹理、着色、打光、栅格化等。而这些任务的计算量超级大，所以独显往往有自己的RAM、多达几百个运算核心的处理器。因此独显不仅仅是可以显示图像，而且可以执行大规模并行计算，比如“挖矿”。</p><p>我们要在屏幕上显示字符，就要编程操作显卡。</p><p>其实无论我们PC上是什么显卡，它们都支持一种叫 <strong>VESA</strong> 的标准，这种标准下有两种工作模式：字符模式和图形模式。显卡们为了兼容这种标准，不得不自己提供一种叫VGABIOS的固件程序。</p><p>下面，我们来看看显卡的字符模式的工作细节。</p><p>它把屏幕分成24行，每行80个字符，把这（24*80）个位置映射到以0xb8000地址开始的内存中，每两个字节对应一个字符，其中一个字节是字符的ASCII码，另一个字节为字符的颜色值。如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/782ef574b96084fa44a33ea1f83146f5.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/782ef574b96084fa44a33ea1f83146f5.jpg" alt=""></a></p><p>明白了显卡的字符模式的工作细节，下面我们开始写代码。</p><p>这里先提个醒： <strong>C语言字符串是以0结尾的，其字符编码通常是utf8，而utf8编码对ASCII字符是兼容的，即英文字符的ASCII编码和utf8编码是相等的</strong>（关于 <a href="https://www.utf8.com/" target="_blank" rel="noreferrer">utf8</a> 编码你可以自行了解）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//彭东 &amp;#64; 2021.01.09</span></span>
<span class="line"><span>void _strwrite(char* string)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  char* p_strdst = (char*)(0xb8000);//指向显存的开始地址</span></span>
<span class="line"><span>  while (*string)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    *p_strdst = *string++;</span></span>
<span class="line"><span>    p_strdst += 2;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void printf(char* fmt, ...)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  _strwrite(fmt);</span></span>
<span class="line"><span>  return;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码很简单，printf函数直接调用了_strwrite函数，而_strwrite函数正是将字符串里每个字符依次定入到0xb8000地址开始的显存中，而p_strdst每次加2，这也是为了跳过字符的颜色信息的空间。</p><p>到这，Hello OS相关的代码就写好了，下面就是编译和安装了。你可别以为这个事情就简单了，下面请跟着我去看一看。</p><h2 id="编译和安装hello-os" tabindex="-1">编译和安装Hello OS <a class="header-anchor" href="#编译和安装hello-os" aria-label="Permalink to &quot;编译和安装Hello OS&quot;">​</a></h2><p>Hello OS的代码都已经写好，这时就要进入安装测试环节了。在安装之前，我们要进行系统编译，即把每个代码模块编译最后链接成可执行的二进制文件。</p><p>你可能觉得我在小题大做，编译不就是输入几条命令吗，这么简单的工作也值得一说？</p><p>确实，对于我们Hello OS的编译工作来说特别简单，因为总共才三个代码文件，最多四条命令就可以完成。</p><p>但是以后我们Hello OS的文件数量会爆炸式增长，一个成熟的商业操作系统更是多达几万个代码模块文件，几千万行的代码量，是这世间最复杂的软件工程之一。所以需要一个牛逼的工具来控制这个巨大的编译过程。</p><h2 id="make工具" tabindex="-1">make工具 <a class="header-anchor" href="#make工具" aria-label="Permalink to &quot;make工具&quot;">​</a></h2><p>make历史悠久，小巧方便，也是很多成熟操作系统编译所使用的构建工具。</p><p>在软件开发中，make是一个工具程序，它读取一个叫“makefile”的文件，也是一种文本文件，这个文件中写好了构建软件的规则，它能根据这些规则自动化构建软件。</p><p>makefile文件中规则是这样的：首先有一个或者多个构建目标称为“target”；目标后面紧跟着用于构建该目标所需要的文件，目标下面是构建该目标所需要的命令及参数。</p><p>与此同时，它也检查文件的依赖关系，如果需要的话，它会调用一些外部软件来完成任务。</p><p>第一次构建目标后，下一次执行make时，它会根据该目标所依赖的文件是否更新决定是否编译该目标，如果所依赖的文件没有更新且该目标又存在，那么它便不会构建该目标。这种特性非常有利于编译程序源代码。</p><p>任何一个Linux发行版中都默认自带这个make程序，所以不需要额外的安装工作，我们直接使用即可。</p><p>为了让你进一步了解make的使用，接下来我们一起看一个有关makefile的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CC = gcc #定义一个宏CC 等于gcc</span></span>
<span class="line"><span>CFLAGS = -c #定义一个宏 CFLAGS 等于-c</span></span>
<span class="line"><span>OBJS_FILE = file.o file1.o file2.o file3.o file4.o #定义一个宏</span></span>
<span class="line"><span>.PHONY : all everything #定义两个伪目标all、everything</span></span>
<span class="line"><span>all:everything #伪目标all依赖于伪目标everything</span></span>
<span class="line"><span>everything :$(OBJS_FILE) #伪目标everything依赖于OBJS_FILE，而OBJS_FILE是宏会被</span></span>
<span class="line"><span>#替换成file.o file1.o file2.o file3.o file4.o</span></span>
<span class="line"><span>%.o : %.c</span></span>
<span class="line"><span>   $(CC) $(CFLAGS) -o $&amp;#64; $&amp;lt;</span></span></code></pre></div><p>我来解释一下这个例子：</p><p>make规定“#”后面为注释，make处理makefile时会自动丢弃。</p><p>makefile中可以定义宏，方法是 <strong>在一个字符串后跟一个“=”或者“:=”符号</strong>，引用宏时要用“$(宏名)”，宏最终会在宏出现的地方替换成相应的字符串，例如：$(CC)会被替换成gcc，$( OBJS_FILE) 会被替换成file.o file1.o file2.o file3.o file4.o。</p><p>.PHONY在makefile中表示定义伪目标。所谓伪目标，就是它不代表一个真正的文件名，在执行make时可以指定这个目标来执行其所在规则定义的命令。但是伪目标可以依赖于另一个伪目标或者文件，例如：all依赖于everything，everything最终依赖于file.c file1.c file2.c file3.c file4.c。</p><p>虽然我们会发现，everything下面并没有相关的执行命令，但是下面有个通用规则：“%.o : %.c”。其中的“%”表示通配符，表示所有以“.o”结尾的文件依赖于所有以“.c”结尾的文件。</p><p>例如：file.c、file1.c、file2.c、file3.c、file4.c，通过这个通用规则会自动转换为依赖关系：file.o: file.c、file1.o: file1.c、file2.o: file2.c、file3.o: file3.c、file4.o: file4.c。</p><p>然后，针对这些依赖关系，分别会执行：$(CC) $(CFLAGS) -o $@ $&lt;命令，当然最终会转换为：gcc –c –o xxxx.o xxxx.c，这里的“xxxx”表示一个具体的文件名。</p><h2 id="编译" tabindex="-1">编译 <a class="header-anchor" href="#编译" aria-label="Permalink to &quot;编译&quot;">​</a></h2><p>下面我们用一张图来描述我们Hello OS的编译过程，如下所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/cbd634cd5256e372bcbebd4b95f21b34.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%9845%E8%AE%B2/images/369502/cbd634cd5256e372bcbebd4b95f21b34.jpg" alt=""></a></p><h2 id="安装hello-os" tabindex="-1">安装Hello OS <a class="header-anchor" href="#安装hello-os" aria-label="Permalink to &quot;安装Hello OS&quot;">​</a></h2><p>经过上述流程，我们就会得到Hello OS.bin文件，但是我们还要让GRUB能够找到它，才能在计算机启动时加载它。这个过程我们称为安装，不过这里没有写安装程序，得我们手动来做。</p><p>经研究发现，GRUB在启动时会加载一个grub.cfg的文本文件，根据其中的内容执行相应的操作，其中一部分内容就是启动项。</p><p>GRUB首先会显示启动项到屏幕，然后让我们选择启动项，最后GRUB根据启动项对应的信息，加载OS文件到内存。</p><p>下面来看看我们Hello OS的启动项：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>menuentry &#39;HelloOS&#39; {</span></span>
<span class="line"><span>     insmod part_msdos #GRUB加载分区模块识别分区</span></span>
<span class="line"><span>     insmod ext2 #GRUB加载ext文件系统模块识别ext文件系统</span></span>
<span class="line"><span>     set root=&#39;hd0,msdos4&#39; #注意boot目录挂载的分区，这是我机器上的情况</span></span>
<span class="line"><span>     multiboot2 /boot/HelloOS.bin #GRUB以multiboot2协议加载HelloOS.bin</span></span>
<span class="line"><span>     boot #GRUB启动HelloOS.bin</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果你不知道你的boot目录挂载的分区，可以在Linux系统的终端下输入命令：df /boot/，就会得到如下结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>文件系统          1K-块    已用     可用      已用% 挂载点</span></span>
<span class="line"><span>/dev/sda4      48752308 8087584 38158536   18%    /</span></span></code></pre></div><p>其中的“sda4”就是硬盘的第四个分区（硬件分区选择MBR），但是GRUB的menuentry中不能写sda4，而是要写“hd0,msdos4”，这是GRUB的命名方式，hd0表示第一块硬盘，结合起来就是第一块硬盘的第四个分区。</p><p>把上面启动项的代码插入到你的Linux机器上的/boot/grub/grub.cfg文件末尾，然后把Hello OS.bin文件复制到/boot/目录下，一定注意 <strong>这里是追加不是覆盖</strong>。最后重启计算机，你就可以看到Hello OS的启动选项了。</p><p>选择Hello OS，按下Enter键（或者重启按ESC键），这样就可以成功启动我们自己的Hello OS了。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>有没有很开心？我们终于看到我们自己的OS运行了，就算它再简单也是我们自己的OS。下面我们再次回顾下这节课的重点。</p><p>首先，我们了解了从按下PC机电源开关开始，PC机的引导过程。它从CPU上电，到加载BIOS固件，再由BIOS固件对计算机进行自检和默认的初始化，并加载GRUB引导程序，最后由GRUB加载具体的操作系统。</p><p>其次，就到了我们这节课最难的部分，即用汇编语言和C语言实现我们的Hello OS。</p><p>第一步，用汇编程序初始化CPU的寄存器、设置CPU的工作模式和栈，最重要的是 <strong>加入了GRUB引导协议头</strong>；第二步，切换到C语言，用C语言写好了 <strong>主函数和控制显卡输出的函数</strong>，其间还了解了显卡的一些工作细节。</p><p>最后，就是编译和安装Hello OS了。我们用了make工具编译整个代码，其实make会根据一些规则调用具体的nasm、gcc、ld等编译器，然后形成Hello OS.bin文件，你把这个文件写复制到boot分区，写好GRUB启动项，这样就好了。</p><p>这里只是上上手，下面我们还会去准备一些别的东西，然后就真正开始了。但你此刻也许还有很多问题没有搞清楚，比如重新加载GDT、关中断等，先不要担心，我们后面会一一解决的。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>以上printf函数定义，其中有个形式参数很奇怪，请你思考下：为什么是“…”形式参数，这个形式参数有什么作用？</p><p>欢迎你在留言区分享你的思考或疑问。</p><p>我是LMOS，我们下节课见！</p>`,92)])])}const g=n(l,[["render",i]]);export{b as __pageData,g as default};
