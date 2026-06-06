import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"32 | 热点问题答疑（三）","description":"","frontmatter":{},"headers":[{"level":2,"title":"A/B测试SDK","slug":"a-b测试sdk","link":"#a-b测试sdk","children":[]},{"level":2,"title":"如何衡量性能监控的优劣？","slug":"如何衡量性能监控的优劣","link":"#如何衡量性能监控的优劣","children":[]},{"level":2,"title":"关于WatchDog","slug":"关于watchdog","link":"#关于watchdog","children":[]},{"level":2,"title":"关于iOS崩溃","slug":"关于ios崩溃","link":"#关于ios崩溃","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"iOS开发高手课/32-热点问题答疑（三）.md","filePath":"iOS开发高手课/32-热点问题答疑（三）.md","lastUpdated":1779817833000}'),t={name:"iOS开发高手课/32-热点问题答疑（三）.md"};function i(l,a,c,r,o,d){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_32-热点问题答疑-三" tabindex="-1">32 | 热点问题答疑（三） <a class="header-anchor" href="#_32-热点问题答疑-三" aria-label="Permalink to &quot;32 | 热点问题答疑（三）&quot;">​</a></h1><p>你好，我是戴铭。</p><p>这是我们《iOS开发高手课》专栏的第三期答疑文章，我将继续和你分享大家在学习前面文章时遇到的最普遍的问题。</p><p>今天，我在这段时间的留言问题中，挑选了几个iOS开发者普遍关注的问题，在这篇答疑文章里来做一个统一回复。</p><h2 id="a-b测试sdk" tabindex="-1">A/B测试SDK <a class="header-anchor" href="#a-b测试sdk" aria-label="Permalink to &quot;A/B测试SDK&quot;">​</a></h2><p>@鼠辈同学在第24篇文章 <a href="https://time.geekbang.org/column/article/93097" target="_blank" rel="noreferrer">《A/B测试：验证决策效果的利器》</a> 留言中问道：</p><blockquote><p>最近一直在找一个好的 A/B 测试的 SDK，不知道作者之前用过什么好的 A/B 测试的 SDK（三方的，可以后台控制的）</p></blockquote><p>我认为带后台功能的 A/B 测试 SDK没什么必要，原因有二：</p><ol><li><p>A/B 测试本身就是为业务服务的，需要对会影响产品决策的业务场景做大量定制化开发；</p></li><li><p>A/B 测试功能本身并不复杂，第三方后台定制化开发，成本也不会节省多少。</p></li></ol><p>因此，我推荐后台功能自己来做，端上使用我在第24篇文章中提到的 SkyLab 就完全没有问题了。另外，SkyLab 也可以很方便地集成到你自己的后台中。</p><h2 id="如何衡量性能监控的优劣" tabindex="-1">如何衡量性能监控的优劣？ <a class="header-anchor" href="#如何衡量性能监控的优劣" aria-label="Permalink to &quot;如何衡量性能监控的优劣？&quot;">​</a></h2><p>@ RiverLi 同学在第16篇文章 <a href="https://time.geekbang.org/column/article/90546" target="_blank" rel="noreferrer">《</a> <a href="https://time.geekbang.org/column/article/90546" target="_blank" rel="noreferrer">性能监控：衡量 App 质量的那把尺</a> <a href="https://time.geekbang.org/column/article/90546" target="_blank" rel="noreferrer">》</a> 的评论区留言问到：</p><blockquote><p>对于性能的监控有没有衡量标准，如何衡量优劣？</p></blockquote><p>我觉得，如果给所有 App 制定相同的衡量标准是不现实的，这样的标准，也是无法落地的。为什么这么说呢，很有可能由于历史原因或者 App的特性决定了有些App的性能无法达到另一个 App 的标准。又或者说，有些App需要进行大量的重构，才能要达到另一个 App 的性能标准，而这些重构明显不是一朝一夕就能落地执行的。特别是业务还在快跑的情况下，你只能够有针对性地去做优化，而不是大量的重构。</p><p>回到性能监控的初衷，它主要是希望通过监控手段去发现突发的性能问题，这也是我们再做线上性能监控时需要重点关注的。</p><p>对于 App 运行普遍存在的性能问题，我们应该在上线前就设法优化完成。因为，线下的性能问题是可控的，而线上的性能问题往往是“摸不着”的，也正是这个原因，我们需要监控线上性能问题。</p><p>因此， <strong>性能监控的标准一定是针对 App线下的性能表现来制定的</strong>。比如，你的App在线下连续3秒 CPU 占比都是在70%以下，那么 CPU 占比的监控值就可以设置为3秒内占比在70%以下。如果超过这个阈值就属于突发情况，就做报警处理，进行问题跟踪排查，然后有针对性地修复问题。</p><h2 id="关于watchdog" tabindex="-1">关于WatchDog <a class="header-anchor" href="#关于watchdog" aria-label="Permalink to &quot;关于WatchDog&quot;">​</a></h2><p>我在 <a href="https://time.geekbang.org/column/article/89494" target="_blank" rel="noreferrer">第13篇文章</a> 中讲解如何用RunLoop原理去监控卡顿的时候，用到了WatchDog机制。Xqqq0 同学在文后留言中，希望我解释一下这个机制，并推荐一些相关的学习资料。</p><p>WatchDog 是苹果公司设计的一种机制，主要是为了避免 App 界面无响应造成用户无法操作，而强杀掉 App 进程。造成 App 界面无响应的原因种类太多，于是苹果公司采用了一刀切的做法：凡是主线程卡死一定的时间就会被 WatchDog 机制强杀掉。这个卡死时间，WatchDog 在启动时设置的是 20秒，前台时设置的是10秒，后台时设置的是10分钟。</p><p>由于 WatchDog 强杀日志属于系统日志，所以你的 App 上线后需要自己来监控卡顿，这样才能够在 WatchDog 强杀之前捕获到 App 卡死的情况。关于这部分内容的详细讲解，你可以参看苹果公司关于 <a href="https://developer.apple.com/library/archive/technotes/tn2151/_index.html" target="_blank" rel="noreferrer">崩溃分析</a> 的文档。</p><h2 id="关于ios崩溃" tabindex="-1">关于iOS崩溃 <a class="header-anchor" href="#关于ios崩溃" aria-label="Permalink to &quot;关于iOS崩溃&quot;">​</a></h2><p>在专栏的第12篇文章 <a href="https://time.geekbang.org/column/article/88600" target="_blank" rel="noreferrer">《iOS 崩溃千奇百怪，如何全面监控？》</a> 后，(Jet)黄仲平同学提了这么几个问题。考虑到这几个问题涉及知识点比较有代表性，所以我特意在今天这篇答疑文章中和你详细展开下。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/iOS%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/96883/48115cbd4fa6a59c96551858aa68876e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/iOS%E5%BC%80%E5%8F%91%E9%AB%98%E6%89%8B%E8%AF%BE/images/96883/48115cbd4fa6a59c96551858aa68876e.jpg" alt=""></a></p><p>关于实现崩溃问题自动定位到人，我认为通过堆栈信息来匹配到人是没有问题的。关于实现方法的问题，也就是第一个问题，你可以先做个映射表，每个类都能够对应到一个负责人，当获取到崩溃堆栈信息时，根据映射表就能够快速定位到人了。</p><p>对于第二个问题关于日志的收集方法，我想说的是 PLCrashReporter 就是用handleSignalException 方法来收集的。</p><p>第三个关于 dSYM 解析堆栈信息工作原理的问题，也不是很复杂。dSYM 会根据线程中方法调用栈的指针，去符号表里找到这些指针所对应的符号信息进行解析，解析完之后就能够展示出可读的方法调用栈。</p><p>接下来， <strong>我来和你说说通过堆栈匹配到人的具体实现的问题。</strong></p><p><strong>第一步</strong>，通过 task_threads 获取当前所有的线程，遍历所有线程，通过 thread_info 获取各个线程的详细信息。</p><p><strong>第二步</strong>，遍历线程，每个线程都通过 thread_get_state 得到 machine context 里面函数调用栈的指针。</p><p>thread_get_state 获取函数调用栈指针的具体实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>_STRUCT_MCONTEXT machineContext; //线程栈里所有的栈指针</span></span>
<span class="line"><span>// 通过 thread_get_state 获取完整的 machineContext 信息，包含 thread 状态信息</span></span>
<span class="line"><span>mach_msg_type_number_t state_count = smThreadStateCountByCPU();</span></span>
<span class="line"><span>kern_return_t kr = thread_get_state(thread, smThreadStateByCPU(), (thread_state_t)&amp;machineContext.__ss, &amp;state_count);</span></span></code></pre></div><p>获取到的这些函数调用栈，需要一个栈结构体来保存。</p><p><strong>第三步</strong>，创建栈结构体。创建后通过栈基地址指针获取到当前栈帧地址，然后往前查找函数调用帧地址，并将它们保存到创建的栈结构体中。具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 为通用回溯设计结构支持栈地址由小到大，地址里存储上个栈指针的地址</span></span>
<span class="line"><span>typedef struct SMStackFrame {</span></span>
<span class="line"><span>    const struct SMStackFrame *const previous;</span></span>
<span class="line"><span>    const uintptr_t return_address;</span></span>
<span class="line"><span>} SMStackFrame;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SMStackFrame stackFrame = {0};</span></span>
<span class="line"><span>// 通过栈基址指针获取当前栈帧地址</span></span>
<span class="line"><span>const uintptr_t framePointer = smMachStackBasePointerByCPU(&amp;machineContext);</span></span>
<span class="line"><span>if (framePointer == 0 || smMemCopySafely((void *)framePointer, &amp;stackFrame, sizeof(stackFrame)) != KERN_SUCCESS) {</span></span>
<span class="line"><span>    return &amp;#64;&quot;Fail frame pointer&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>for (; i &amp;lt; 32; i++) {</span></span>
<span class="line"><span>    buffer[i] = stackFrame.return_address;</span></span>
<span class="line"><span>    if (buffer[i] == 0 || stackFrame.previous == 0 || smMemCopySafely(stackFrame.previous, &amp;stackFrame, sizeof(stackFrame)) != KERN_SUCCESS) {</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第四步</strong>，根据获取到的栈帧地址，找到对应的 image 的游标，从而能够获取 image 的更多信息。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 初始化保存符号结果的结构体 Dl_info</span></span>
<span class="line"><span>info-&amp;gt;dli_fname = NULL;</span></span>
<span class="line"><span>info-&amp;gt;dli_fbase = NULL;</span></span>
<span class="line"><span>info-&amp;gt;dli_sname = NULL;</span></span>
<span class="line"><span>info-&amp;gt;dli_saddr = NULL;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 根据地址获取是哪个 image</span></span>
<span class="line"><span>const uint32_t idx = smDyldImageIndexFromAddress(address);</span></span>
<span class="line"><span>if (idx == UINT_MAX) {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第五步</strong>，在知道了是哪个 image 后，根据 Mach-O 文件的结构，要想获取符号表所在的 segment，需要先找到 Mach-O 里对应的 Header。通过 _dyld_get_image_header 方法，我们可以找到 mach_header 结构体。然后，使用 _dyld_get_image_vmaddr_slide 方法，我们就能够获取虚拟内存地址 slide 的数量。而动态链接器就是通过添加 slide 数量到 image 基地址，以实现将 image 映射到未占用地址的进程虚拟地址空间来加载 image 的。具体实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> Header</span></span>
<span class="line"><span> ------------------</span></span>
<span class="line"><span> Load commands</span></span>
<span class="line"><span> Segment command 1 -------------|</span></span>
<span class="line"><span> Segment command 2              |</span></span>
<span class="line"><span> ------------------             |</span></span>
<span class="line"><span> Data                           |</span></span>
<span class="line"><span> Section 1 data |segment 1 &amp;lt;----|</span></span>
<span class="line"><span> Section 2 data |          &amp;lt;----|</span></span>
<span class="line"><span> Section 3 data |          &amp;lt;----|</span></span>
<span class="line"><span> Section 4 data |segment 2</span></span>
<span class="line"><span> Section 5 data |</span></span>
<span class="line"><span> ...            |</span></span>
<span class="line"><span> Section n data |</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>/*----------Mach Header---------*/</span></span>
<span class="line"><span>// 根据 image 的序号获取 mach_header</span></span>
<span class="line"><span>const struct mach_header* machHeader = _dyld_get_image_header(idx);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将 header 的名字和 machHeader 记录到 Dl_info 结构体里</span></span>
<span class="line"><span>info-&amp;gt;dli_fname = _dyld_get_image_name(idx);</span></span>
<span class="line"><span>info-&amp;gt;dli_fbase = (void*)machHeader;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 返回 image_index 索引的 image 的虚拟内存地址 slide 的数量</span></span>
<span class="line"><span>// 动态链接器就是通过添加 slide 数量到 image 基地址，以实现将 image 映射到未占用地址的进程虚拟地址空间来加载 image 的。</span></span>
<span class="line"><span>const uintptr_t imageVMAddressSlide = (uintptr_t)_dyld_get_image_vmaddr_slide(idx);</span></span></code></pre></div><p><strong>第六步</strong>，计算 ASLR（地址空间布局随机化） 偏移量。</p><p>ASLR 是一种防范内存损坏漏洞被利用的计算机安全技术，想详细了解 ASLR的话，你可以参看 <a href="https://en.wikipedia.org/wiki/Address_space_layout_randomization" target="_blank" rel="noreferrer">它的 Wiki页面</a>。</p><p>通过 ASLR 偏移量可以获取 segment 的基地址，segment 定义 Mach-O 文件中的字节范围以及动态链接器加载应用程序时这些字节映射到虚拟内存中的地址和内存保护属性。 所以，segment 总是虚拟内存页对齐。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*-----------ASLR 偏移量---------*/</span></span>
<span class="line"><span>// https://en.wikipedia.org/wiki/Address_space_layout_randomization</span></span>
<span class="line"><span>const uintptr_t addressWithSlide = address - imageVMAddressSlide;</span></span>
<span class="line"><span>// 通过 ASLR 偏移量可以获取 segment 的基地址</span></span>
<span class="line"><span>// segment 定义 Mach-O 文件中的字节范围以及动态链接器加载应用程序时这些字节映射到虚拟内存中的地址和内存保护属性。 所以，segment 总是虚拟内存页对齐。</span></span>
<span class="line"><span>const uintptr_t segmentBase = smSegmentBaseOfImageIndex(idx) + imageVMAddressSlide;</span></span>
<span class="line"><span>if (segmentBase == 0) {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>第七步，</strong> 遍历所有 segment，查找目标地址在哪个 segment 里。</p><p>除了 __TEXT segment 和 __DATA segment 外，还有 __LINKEDIT segment。__LINKEDIT segment 里包含了动态链接器使用的原始数据，比如符号、字符串、重定位表项。LC_SYMTAB 描述的是，__LINKEDIT segment 里查找的字符串在符号表的位置。有了符号表里字符串的位置，就能找到目标地址对应的字符串，从而完成函数调用栈地址的符号化。</p><p>这个过程的详细实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*--------------Mach Segment-------------*/</span></span>
<span class="line"><span>// 地址最匹配的symbol</span></span>
<span class="line"><span>const nlistByCPU* bestMatch = NULL;</span></span>
<span class="line"><span>uintptr_t bestDistance = ULONG_MAX;</span></span>
<span class="line"><span>uintptr_t cmdPointer = smCmdFirstPointerFromMachHeader(machHeader);</span></span>
<span class="line"><span>if (cmdPointer == 0) {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 遍历每个 segment 判断目标地址是否落在该 segment 包含的范围里</span></span>
<span class="line"><span>for (uint32_t iCmd = 0; iCmd &amp;lt; machHeader-&amp;gt;ncmds; iCmd++) {</span></span>
<span class="line"><span>    const struct load_command* loadCmd = (struct load_command*)cmdPointer;</span></span>
<span class="line"><span>    /*----------目标 Image 的符号表----------*/</span></span>
<span class="line"><span>    // Segment 除了 __TEXT 和 __DATA 外还有 __LINKEDIT segment，它里面包含动态链接器使用的原始数据，比如符号，字符串和重定位表项。</span></span>
<span class="line"><span>    // LC_SYMTAB 描述了 __LINKEDIT segment 内查找字符串和符号表的位置</span></span>
<span class="line"><span>    if (loadCmd-&amp;gt;cmd == LC_SYMTAB) {</span></span>
<span class="line"><span>        // 获取字符串和符号表的虚拟内存偏移量。</span></span>
<span class="line"><span>        const struct symtab_command* symtabCmd = (struct symtab_command*)cmdPointer;</span></span>
<span class="line"><span>        const nlistByCPU* symbolTable = (nlistByCPU*)(segmentBase + symtabCmd-&amp;gt;symoff);</span></span>
<span class="line"><span>        const uintptr_t stringTable = segmentBase + symtabCmd-&amp;gt;stroff;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (uint32_t iSym = 0; iSym &amp;lt; symtabCmd-&amp;gt;nsyms; iSym++) {</span></span>
<span class="line"><span>            // 如果 n_value 是0，symbol 指向外部对象</span></span>
<span class="line"><span>            if (symbolTable[iSym].n_value != 0) {</span></span>
<span class="line"><span>                // 给定的偏移量是文件偏移量，减去 __LINKEDIT segment 的文件偏移量获得字符串和符号表的虚拟内存偏移量</span></span>
<span class="line"><span>                uintptr_t symbolBase = symbolTable[iSym].n_value;</span></span>
<span class="line"><span>                uintptr_t currentDistance = addressWithSlide - symbolBase;</span></span>
<span class="line"><span>                // 寻找最小的距离 bestDistance，因为 addressWithSlide 是某个方法的指令地址，要大于这个方法的入口。</span></span>
<span class="line"><span>                // 离 addressWithSlide 越近的函数入口越匹配</span></span>
<span class="line"><span>                if ((addressWithSlide &amp;gt;= symbolBase) &amp;&amp; (currentDistance &amp;lt;= bestDistance)) {</span></span>
<span class="line"><span>                    bestMatch = symbolTable + iSym;</span></span>
<span class="line"><span>                    bestDistance = currentDistance;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (bestMatch != NULL) {</span></span>
<span class="line"><span>            // 将虚拟内存偏移量添加到 __LINKEDIT segment 的虚拟内存地址可以提供字符串和符号表的内存 address。</span></span>
<span class="line"><span>            info-&amp;gt;dli_saddr = (void*)(bestMatch-&amp;gt;n_value + imageVMAddressSlide);</span></span>
<span class="line"><span>            info-&amp;gt;dli_sname = (char*)((intptr_t)stringTable + (intptr_t)bestMatch-&amp;gt;n_un.n_strx);</span></span>
<span class="line"><span>            if (*info-&amp;gt;dli_sname == &#39;_&#39;) {</span></span>
<span class="line"><span>                info-&amp;gt;dli_sname++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 所有的 symbols 的已经被处理好了</span></span>
<span class="line"><span>            if (info-&amp;gt;dli_saddr == info-&amp;gt;dli_fbase &amp;&amp; bestMatch-&amp;gt;n_type == 3) {</span></span>
<span class="line"><span>                info-&amp;gt;dli_sname = NULL;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    cmdPointer += loadCmd-&amp;gt;cmdsize;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>在今天这篇文章中，我针对一些比较有代表性、你大概率会遇到的留言问题做了解答。这其中，包括第三方库的选择、性能衡量标准，以及崩溃分析方面的问题。</p><p>最后，对于第三方库的使用，我的建议是：如果和业务强相关，比如埋点或者 A/B 测试这样的库，最好是自建，你可以借鉴开源库的思路；一些基础的、通用性强的库，比如网络库和持续化存储的库，直接使用成熟的第三方库，既可以节省开发和维护时间，还能够提高产品质量；还有种情况就是，如果你所在团队较小，只有几个 iOS 开发人员，那么还是要尽可能地使用开源项目，你可以在 <a href="https://github.com/vsouza/awesome-ios" target="_blank" rel="noreferrer">Awesome iOS</a> 上去找到适合团队的项目。</p><p>感谢你的收听，欢迎你在评论区给我留言分享你的观点，也欢迎把它分享给更多的朋友一起阅读。</p>`,51)])])}const h=s(t,[["render",i]]);export{g as __pageData,h as default};
