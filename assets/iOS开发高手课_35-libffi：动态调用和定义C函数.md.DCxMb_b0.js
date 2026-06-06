import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const d=JSON.parse('{"title":"35 | libffi：动态调用和定义 C 函数","description":"","frontmatter":{},"headers":[{"level":2,"title":"如何动态地调用C函数？","slug":"如何动态地调用c函数","link":"#如何动态地调用c函数","children":[]},{"level":2,"title":"libffi 原理分析","slug":"libffi-原理分析","link":"#libffi-原理分析","children":[{"level":3,"title":"ffi_type（参数类型）","slug":"ffi-type-参数类型","link":"#ffi-type-参数类型","children":[]},{"level":3,"title":"ffi_cif（模板）","slug":"ffi-cif-模板","link":"#ffi-cif-模板","children":[]},{"level":3,"title":"ffi_call（函数调用）","slug":"ffi-call-函数调用","link":"#ffi-call-函数调用","children":[]}]},{"level":2,"title":"如何使用libffi？","slug":"如何使用libffi","link":"#如何使用libffi","children":[{"level":3,"title":"调用 C 函数","slug":"调用-c-函数","link":"#调用-c-函数","children":[]},{"level":3,"title":"定义 C 函数","slug":"定义-c-函数","link":"#定义-c-函数","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]},{"level":2,"title":"课后作业","slug":"课后作业","link":"#课后作业","children":[]}],"relativePath":"iOS开发高手课/35-libffi：动态调用和定义C函数.md","filePath":"iOS开发高手课/35-libffi：动态调用和定义C函数.md","lastUpdated":1779817833000}'),i={name:"iOS开发高手课/35-libffi：动态调用和定义C函数.md"};function l(f,s,t,c,r,o){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_35-libffi-动态调用和定义-c-函数" tabindex="-1">35 | libffi：动态调用和定义 C 函数 <a class="header-anchor" href="#_35-libffi-动态调用和定义-c-函数" aria-label="Permalink to &quot;35 | libffi：动态调用和定义 C 函数&quot;">​</a></h1><p>你好，我是戴铭。</p><p>在 iOS 开发中，我们可以使用 Runtime 接口动态地调用 Objective-C 方法，但是却无法动态调用 C 的函数。那么，我们怎么才能动态地调用 C 语言函数呢？</p><p>C 语言编译后，在可执行文件里会有原函数名信息，我们可以通过函数名字符串来找到函数的地址。现在，我们只要能够通过函数名找到函数地址，就能够实现动态地去调用C 语言函数。</p><p>而在动态链接器中，有一个接口 dlsym() 可以通过函数名字符串拿到函数地址，如果所有 C 函数的参数类型和数量都一样，而且返回类型也一样，那么我们使用 dlsym() 就能实现动态地调用 C 函数。</p><p>但是，在实际项目中，函数的参数定义不可能都一样，返回类型也不会都是 void 或者 int类型。所以， dlsym()这条路走不通。那么，还有什么办法可以实现动态地调用 C 函数呢？</p><h2 id="如何动态地调用c函数" tabindex="-1">如何动态地调用C函数？ <a class="header-anchor" href="#如何动态地调用c函数" aria-label="Permalink to &quot;如何动态地调用C函数？&quot;">​</a></h2><p>要想动态地调用 C 函数，你需要先了解函数底层是怎么调用的。</p><p>高级编程语言的函数在调用时，需要约定好参数的传递顺序、传递方式，栈维护的方式，名字修饰。这种函数调用者和被调用者对函数如何调用的约定，就叫作调用惯例（Calling Convention）。高级语言编译时，会生成遵循调用惯例的代码。</p><p>不同 CPU 架构的调用惯例不一样，比如64位机器的寄存器多些、传递参数快些，所以参数传递会优先采用寄存器传递，当参数数量超出寄存器数量后才会使用栈传递。</p><p>所以，编译时需要按照调用惯例针对不同 CPU 架构编译，生成汇编代码，确定好栈和寄存器。 如果少了编译过程，直接在运行时去动态地调用函数，就需要先生成动态调用相应寄存器和栈状态的汇编指令。而要达到事先生成相应寄存器和栈的目的，就不能使用遵循调用惯例的高级编程语言，而需要使用汇编语言。</p><p>Objective-C的函数调用采用的是发送消息的方式，使用的是 objc_msgSend 函数。objc_msgSend函数就是使用汇编语言编写的，其结构分为序言准备（Prologue）、函数体（Body）、结束收尾（Epilogue）三部分。</p><p>序言准备部分的作用是会保存之前程序执行的状态，还会将输入的参数保存到寄存器和栈上。这样，objc_msgSend 就能够先将未知的参数保存到寄存器和栈上，然后在函数体执行自身指令或者跳转其他函数，最后在结束收尾部分恢复寄存器，回到调用函数之前的状态。</p><p>得益于序言准备部分可以事先准备好寄存器和栈，objc_msgSend 可以做到函数调用无需通过编译生成汇编代码来遵循调用惯例，进而使得 Objective-C 具备了动态调用函数的能力。</p><p>但是，不同的 CPU 架构，在编译时会执行不同的objc_msgSend 函数，而且 objc_msgSend 函数无法直接调用 C 函数，所以想要实现动态地调用 C 函数就需要使用另一个用汇编语言编写的库 libffi。</p><p>那么，libffi 是什么呢，又怎么使用 libffi 来动态地调用 C 函数？接下来，我就和你分析一下这两个问题应该如何解决。</p><h2 id="libffi-原理分析" tabindex="-1">libffi 原理分析 <a class="header-anchor" href="#libffi-原理分析" aria-label="Permalink to &quot;libffi 原理分析&quot;">​</a></h2><p><a href="https://sourceware.org/libffi/" target="_blank" rel="noreferrer">libffi</a> 中ffi的全称是 Foreign Function Interface（外部函数接口），提供最底层的接口，在不确定参数个数和类型的情况下，根据相应规则，完成所需数据的准备，生成相应汇编指令的代码来完成函数调用。</p><p>libffi 还提供了可移植的高级语言接口，可以不使用函数签名间接调用 C 函数。比如，脚本语言 Python 在运行时会使用 libffi 高级语言的接口去调用 C 函数。libffi的作用类似于一个动态的编译器，在运行时就能够完成编译时所做的调用惯例函数调用代码生成。</p><p>libffi 通过调用 ffi_call（函数调用） 来进行函数调用，ffi_call 的输入是 ffi_cif（模板）、函数指针、参数地址。其中，ffi_cif 由 ffi_type（参数类型） 和 参数个数生成，也可以是 ffi_closure（闭包）。</p><p>libffi 是开源的，代码在 <a href="https://github.com/libffi/libffi" target="_blank" rel="noreferrer">GitHub</a> 上。接下来，我将结合 libffi 中的关键代码，和你详细说下 ffi_call 调用函数的过程。这样，可以帮助你更好地了解 libffi 的原理。</p><p>首先，我们来看看ffi_type。</p><h3 id="ffi-type-参数类型" tabindex="-1">ffi_type（参数类型） <a class="header-anchor" href="#ffi-type-参数类型" aria-label="Permalink to &quot;ffi\\_type（参数类型）&quot;">​</a></h3><p>ffi_type的作用是，描述 C 语言的基本类型，比如 uint32、void *、struct 等，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct _ffi_type</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  size_t size; // 所占大小</span></span>
<span class="line"><span>  unsigned short alignment; //对齐大小</span></span>
<span class="line"><span>  unsigned short type; // 标记类型的数字</span></span>
<span class="line"><span>  struct _ffi_type **elements; // 结构体中的元素</span></span>
<span class="line"><span>} ffi_type;</span></span></code></pre></div><p>其中，size表述该类型所占的大小，alignment表示该类型的对齐大小，type表示标记类型的数字，element表示结构体的元素。</p><p>当类型是 uint32 时，size的值是4，alignment也是4，type 的值是9，elements是空。</p><h3 id="ffi-cif-模板" tabindex="-1">ffi_cif（模板） <a class="header-anchor" href="#ffi-cif-模板" aria-label="Permalink to &quot;ffi\\_cif（模板）&quot;">​</a></h3><p>ffi_cif由参数类型（ffi_type） 和参数个数生成，定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct {</span></span>
<span class="line"><span>  ffi_abi abi; // 不同 CPU 架构下的 ABI，一般设置为 FFI_DEFAULT_ABI</span></span>
<span class="line"><span>  unsigned nargs; // 参数个数</span></span>
<span class="line"><span>  ffi_type **arg_types; // 参数类型</span></span>
<span class="line"><span>  ffi_type *rtype; // 返回值类型</span></span>
<span class="line"><span>  unsigned bytes; // 参数所占空间大小，16的倍数</span></span>
<span class="line"><span>  unsigned flags; // 返回类型是结构体时要做的标记</span></span>
<span class="line"><span>#ifdef FFI_EXTRA_CIF_FIELDS</span></span>
<span class="line"><span>  FFI_EXTRA_CIF_FIELDS;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>} ffi_cif;</span></span></code></pre></div><p>如代码所示，ffi_cif 包含了函数调用时需要的一些信息。</p><p>abi 表示的是不同 CPU 架构下的 ABI，一般设置为 FFI_DEFAULT_ABI：在移动设备上 CPU 架构是 ARM64时，FFI_DEFAULT_ABI 就是 FFI_SYSV；使用苹果公司笔记本CPU 架构是 X86_DARWIN 时，FFI_DEFAULT_ABI 就是 FFI_UNIX64。</p><p>nargs 表示输入参数的个数。arg_types 表示参数的类型，比如 ffi_type_uint32。rtype 表示返回类型，如果返回类型是结构体，字段 flags 需要设置数值作为标记，以便在 ffi_prep_cif_machdep 函数中处理，如果返回的不是结构体，flags 不做标记。</p><p>bytes 表示输入参数所占空间的大小，是16的倍数。</p><p>ffi_cif 是由ffi_prep_cif 函数生成的，而ffi_prep_cif 实际上调用的又是 ffi_prep_cif_core 函数。</p><p>了解 ffi_prep_cif_core 就能够知道 ffi_cif 是怎么生成的。接下来，我继续跟你说说 ffi_prep_cif_core 里是怎么生成 ffi_cif 的。ffi_prep_cif_core 函数会先初始化返回类型，然后对返回类型使用 ffi_type_test 进行完整性检查，为返回类型留出空间。</p><p>接着，使用 initialize_aggregate 函数初始化栈，对参数类型进行完整性检查，对栈进行填充，通过 ffi_prep_cif_machdep 函数执行 ffi_cif 平台相关处理。具体实现代码，你可以点击 <a href="https://github.com/libffi/libffi/blob/master/src/prep_cif.c" target="_blank" rel="noreferrer">这个链接</a> 查看，其所在文件路径是 libffi/src/prep_cif.c。</p><p>之所以将准备 ffi_cif 和 ffi_call 分开，是因为ffi_call 可能会调用多次参数个数、参数类型、函数指针相同，只有参数地址不同的函数。将它们分开，ffi_call 只需要处理不同参数地址，而其他工作只需要 ffi_cif 做一遍就行了。</p><p>接着，准备好了 ffi_cif 后，我们就可以开始函数调用了。</p><h3 id="ffi-call-函数调用" tabindex="-1">ffi_call（函数调用） <a class="header-anchor" href="#ffi-call-函数调用" aria-label="Permalink to &quot;ffi\\_call（函数调用）&quot;">​</a></h3><p>ffi_call 函数的主要处理都交给了 ffi_call_SYSV 这个汇编函数。ffi_call_SYSV 的实现代码，你可以点击 <a href="https://github.com/libffi/libffi/blob/master/src/aarch64/sysv.S" target="_blank" rel="noreferrer">这个链接</a>，其所在文件路径是 libffi/src/aarch64/sysv.S。</p><p>下面，我来跟你说说 <strong>ffi_call_SYSV 汇编函数做了什么</strong>。</p><p>首先，我们一起看看 ffi_call_SYSV 函数的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern void ffi_call_SYSV (void *stack, void *frame,</span></span>
<span class="line"><span>                  void (*fn)(void), void *rvalue,</span></span>
<span class="line"><span>                  int flags, void *closure);</span></span></code></pre></div><p>可以看到，通过 ffi_call_SYSV 函数，我们可以得到 stack、frame、fn、rvalue、flags、closure 参数。</p><p>各参数会依次保存在参数寄存器中，参数栈 stack 在 x0 寄存器中，参数地址 frame 在x1寄存器中，函数指针 fn 在x2寄存器中，用于存放返回值的 rvalue 在 x3 里，结构体标识 flags 在x4寄存器中，闭包 closure 在 x5 寄存器中。</p><p>然后，我们再看看ffi_call_SYSV 处理的核心代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    //分配 stack 和 frame</span></span>
<span class="line"><span>    cfi_def_cfa(x1, 32);</span></span>
<span class="line"><span>    stp x29, x30, [x1]</span></span>
<span class="line"><span>    mov x29, x1</span></span>
<span class="line"><span>    mov sp, x0</span></span>
<span class="line"><span>    cfi_def_cfa_register(x29)</span></span>
<span class="line"><span>    cfi_rel_offset (x29, 0)</span></span>
<span class="line"><span>    cfi_rel_offset (x30, 8)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 记录函数指针 fn</span></span>
<span class="line"><span>    mov x9, x2          /* save fn */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 记录返回值 rvalue</span></span>
<span class="line"><span>    mov x8, x3          /* install structure return */</span></span>
<span class="line"><span>#ifdef FFI_GO_CLOSURES</span></span>
<span class="line"><span>    // 记录闭包 closure</span></span>
<span class="line"><span>    mov x18, x5         /* install static chain */</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    // 保存 rvalue 和 flags</span></span>
<span class="line"><span>    stp x3, x4, [x29, #16]  /* save rvalue and flags */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //先将向量参数传到寄存器</span></span>
<span class="line"><span>    tbz w4, #AARCH64_FLAG_ARG_V_BIT, 1f</span></span>
<span class="line"><span>    ldp     q0, q1, [sp, #0]</span></span>
<span class="line"><span>    ldp     q2, q3, [sp, #32]</span></span>
<span class="line"><span>    ldp     q4, q5, [sp, #64]</span></span>
<span class="line"><span>    ldp     q6, q7, [sp, #96]</span></span>
<span class="line"><span>1:</span></span>
<span class="line"><span>    // 再将参数传到寄存器</span></span>
<span class="line"><span>    ldp     x0, x1, [sp, #16*N_V_ARG_REG + 0]</span></span>
<span class="line"><span>    ldp     x2, x3, [sp, #16*N_V_ARG_REG + 16]</span></span>
<span class="line"><span>    ldp     x4, x5, [sp, #16*N_V_ARG_REG + 32]</span></span>
<span class="line"><span>    ldp     x6, x7, [sp, #16*N_V_ARG_REG + 48]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //释放上下文，留下栈里参数</span></span>
<span class="line"><span>    add sp, sp, #CALL_CONTEXT_SIZE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 调用函数指针 fn</span></span>
<span class="line"><span>    blr     x9</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 重新读取 rvalue 和 flags</span></span>
<span class="line"><span>    ldp x3, x4, [x29, #16]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 析构部分栈指针</span></span>
<span class="line"><span>    mov     sp, x29</span></span>
<span class="line"><span>    cfi_def_cfa_register (sp)</span></span>
<span class="line"><span>    ldp     x29, x30, [x29]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 保存返回值</span></span>
<span class="line"><span>    adr x5, 0f</span></span>
<span class="line"><span>    and w4, w4, #AARCH64_RET_MASK</span></span>
<span class="line"><span>    add x5, x5, x4, lsl #3</span></span>
<span class="line"><span>    br  x5</span></span></code></pre></div><p>如上面代码所示， <strong>ffi_call_SYSV 处理过程分为下面几步</strong>：</p><p>第一步，ffi_call_SYSV 会先分配 stack 和 frame，保存记录 fn、rvalue、closure、flags。</p><p>第二步，将向量参数传到寄存器，按照参数放置规则，调整 sp 的位置，</p><p>第三步，将参数放入寄存器，存放完毕，就开始释放上下文，留下栈里的参数。</p><p>第四步，通过 blr 指令调用 x9 中的函数指针 fn ，以调用函数。</p><p>第五步，调用完函数指针，就重新读取 rvalue 和 flags，析构部分栈指针。</p><p>第六步，保存返回值。</p><p>可以看出，libffi 调用函数的原理和 objc_msgSend 的实现原理非常类似。objc_msgSend 原理，你可以参考 Mike Ash 的“ <a href="https://www.mikeash.com/pyblog/friday-qa-2017-06-30-dissecting-objc_msgsend-on-arm64.html" target="_blank" rel="noreferrer">Dissecting objc_msgSend on ARM64</a>”这篇文章。</p><p>这里我要多说一句，在专栏 <a href="https://time.geekbang.org/column/article/85331" target="_blank" rel="noreferrer">第2篇文章</a> 中我和你分享App启动速度优化时，用到了些汇编代码，有很多用户反馈看不懂这部分内容。针对这个情况，我特意在 <a href="https://time.geekbang.org/column/article/88799" target="_blank" rel="noreferrer">第11篇答疑文章</a> 中，和你分享了些汇编语言学习的方法、参考资料。如果你对上述的汇编代码感兴趣，但又感觉读起来有些吃力的话，建议你再看一下第11篇文章中的相关内容。</p><p>了解了 libffi 调用函数的原理后，相信你迫不及待就想在你的 iOS 工程中集成 libffi了吧。</p><h2 id="如何使用libffi" tabindex="-1">如何使用libffi？ <a class="header-anchor" href="#如何使用libffi" aria-label="Permalink to &quot;如何使用libffi？&quot;">​</a></h2><p>孙源在 GitHub 上有个 <a href="https://github.com/sunnyxx/libffi-iOS" target="_blank" rel="noreferrer">Demo</a>，已经集成了 iOS 可以用的 libffi 库，你可以将这个库集成到自己的工程中。接下来，我借用孙源这个Demo 中的示例代码，来分别和你说说如何使用 libffi 库来调用 C 函数和定义 C 函数。代码所在文件路径是 libffi-iOS/Demo/ViewController.m。在这里，我也特别感谢孙源的这个Demo。</p><h3 id="调用-c-函数" tabindex="-1">调用 C 函数 <a class="header-anchor" href="#调用-c-函数" aria-label="Permalink to &quot;调用 C 函数&quot;">​</a></h3><p>首先，声明一个函数，实现两个整数相加：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- (int)fooWithBar:(int)bar baz:(int)baz {</span></span>
<span class="line"><span>    return bar + baz;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，定义一个函数，使用 libffi 来调用 fooWithBar:baz 函数，也就是刚刚声明的实现两个整数相加的函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void testFFICall() {</span></span>
<span class="line"><span>    // ffi_call 调用需要准备的模板 ffi_cif</span></span>
<span class="line"><span>    ffi_cif cif;</span></span>
<span class="line"><span>    // 参数类型指针数组，根据被调用的函数入参的类型来定</span></span>
<span class="line"><span>    ffi_type *argumentTypes[] = {&amp;ffi_type_pointer, &amp;ffi_type_pointer, &amp;ffi_type_sint32, &amp;ffi_type_sint32};</span></span>
<span class="line"><span>    // 通过 ffi_prep_cif 内 ffi_prep_cif_core 来设置 ffi_cif 结构体所需要的数据，包括 ABI、参数个数、参数类型等。</span></span>
<span class="line"><span>    ffi_prep_cif(&amp;cif, FFI_DEFAULT_ABI, 4, &amp;ffi_type_pointer, argumentTypes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Sark *sark = [Sark new];</span></span>
<span class="line"><span>    SEL selector = &amp;#64;selector(fooWithBar:baz:);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 函数参数的设置</span></span>
<span class="line"><span>    int bar = 123;</span></span>
<span class="line"><span>    int baz = 456;</span></span>
<span class="line"><span>    void *arguments[] = {&amp;sark, &amp;selector, &amp;bar, &amp;baz};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 函数指针 fn</span></span>
<span class="line"><span>    IMP imp = [sark methodForSelector:selector];</span></span>
<span class="line"><span>    // 返回值声明</span></span>
<span class="line"><span>    int retValue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ffi_call 所需的 ffi_cif、函数指针、返回值、函数参数都准备好，就可以通过 ffi_call 进行函数调用了</span></span>
<span class="line"><span>    ffi_call(&amp;cif, imp, &amp;retValue, arguments);</span></span>
<span class="line"><span>    NSLog(&amp;#64;&quot;ffi_call: %d&quot;, retValue);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上面代码所示，先将 ffi_call 所需要的 ffi_cif 通过 ffi_prep_cif 函数准备好，然后设置好参数，通过 Runtime 接口获取 fooWithBar:baz 方法的函数指针 imp，最后就可以通过 ffi_call 进行函数调用了。</p><p>在这个例子中，函数指针是使用 Objective-C 的 Runtime 得到的。如果是 C 语言函数，你就可以通过 dlsym 函数获得。dlsym 获得函数指针示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 计算矩形面积</span></span>
<span class="line"><span>int rectangleArea(int length, int width) {</span></span>
<span class="line"><span>    printf(&quot;Rectangle length is %d, and with is %d, so area is %d \\n&quot;, length, width, length * width);</span></span>
<span class="line"><span>    return length * width;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void run() {</span></span>
<span class="line"><span>    // dlsym 返回 rectangleArea 函数指针</span></span>
<span class="line"><span>    void *dlsymFuncPtr = dlsym(RTLD_DEFAULT, &quot;rectangleArea&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上代码所示，dlsym 根据计算矩形面积的函数 rectangleArea 的函数名，返回 rectangleArea 函数指针给 dlsymFuncPtr。</p><p>无论是 Runtime 获取的函数指针还是 dlsym 获取的函数指针都可以在运行时去完成，接着使用 libffi 在运行时处理好参数。这样，就能够实现运行时动态地调用 C 函数了。</p><p>接下来，我再跟你说下如何使用 libffi 定义 C 函数。</p><h3 id="定义-c-函数" tabindex="-1">定义 C 函数 <a class="header-anchor" href="#定义-c-函数" aria-label="Permalink to &quot;定义 C 函数&quot;">​</a></h3><p>首先，声明一个两数相乘的函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void closureCalled(ffi_cif *cif, void *ret, void **args, void *userdata) {</span></span>
<span class="line"><span>    int bar = *((int *)args[2]);</span></span>
<span class="line"><span>    int baz = *((int *)args[3]);</span></span>
<span class="line"><span>    *((int *)ret) = bar * baz;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，再写个函数，用来定义 C 函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void testFFIClosure() {</span></span>
<span class="line"><span>    ffi_cif cif;</span></span>
<span class="line"><span>    ffi_type *argumentTypes[] = {&amp;ffi_type_pointer, &amp;ffi_type_pointer, &amp;ffi_type_sint32, &amp;ffi_type_sint32};</span></span>
<span class="line"><span>    // 准备模板 cif</span></span>
<span class="line"><span>    ffi_prep_cif(&amp;cif, FFI_DEFAULT_ABI, 4, &amp;ffi_type_pointer, argumentTypes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 声明一个新的函数指针</span></span>
<span class="line"><span>    IMP newIMP;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 分配一个 closure 关联新声明的函数指针</span></span>
<span class="line"><span>    ffi_closure *closure = ffi_closure_alloc(sizeof(ffi_closure), (void *)&amp;newIMP);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ffi_closure 关联 cif、closure、函数实体 closureCalled</span></span>
<span class="line"><span>    ffi_prep_closure_loc(closure, &amp;cif, closureCalled, NULL, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 使用 Runtime 接口动态地将 fooWithBar:baz 方法绑定到 closureCalled 函数指针上</span></span>
<span class="line"><span>    Method method = class_getInstanceMethod([Sark class], &amp;#64;selector(fooWithBar:baz:));</span></span>
<span class="line"><span>    method_setImplementation(method, newIMP);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // after hook</span></span>
<span class="line"><span>    Sark *sark = [Sark new];</span></span>
<span class="line"><span>    int ret = [sark fooWithBar:123 baz:456];</span></span>
<span class="line"><span>    NSLog(&amp;#64;&quot;ffi_closure: %d&quot;, ret);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上面代码所示，在 testFFIClosure 函数准备好 cif 后，会声明一个新的函数指针，这个新的函数指针会和分配的 ffi_closure 关联，ffi_closure 还会通过 ffi_prep_closure_loc 函数关联到 cif、closure、函数实体 closureCalled。</p><p>有了这种能力，你就具备了在运行时将一个函数指针和函数实体绑定的能力，也就能够很容易地实现动态地定义一个 C 函数了。</p><h2 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h2><p>今天，我和你分享了 libffi 的原理，以及怎么使用 libffi 调用和定义 C 函数。</p><p>当你理解了 libffi 的原理以后，再面对语言之间运行时动态调用的问题，也就做到了心中有数。在方案选择动态调用方式时，也就能够找出更多的方案，更加得心应手。</p><p>比如，使用 Aspect 进行方法替换，如果使用不当，会有较大的风险；再比如，hook已经被hook 过的方法，那么之前的 hook 会失效，新的hook 也会出错，而使用 libffi 进行 hook 不会出现这样的问题。</p><h2 id="课后作业" tabindex="-1">课后作业 <a class="header-anchor" href="#课后作业" aria-label="Permalink to &quot;课后作业&quot;">​</a></h2><p>Block 是一个 Objective-C 对象，表面看类似 C 函数，实际上却有很大不同。你可以点击 <a href="http://clang.llvm.org/docs/Block-ABI-Apple.html" target="_blank" rel="noreferrer">这个链接</a> 查看Block 的定义，也可以再看看 Mike Ash 的 <a href="https://github.com/mikeash/MABlockClosure" target="_blank" rel="noreferrer">MABlockClosure</a> 库。然后，请你在留言区说说如何通过 libffi 调用 Block。</p><p>感谢你的收听，欢迎你在评论区给我留言分享你的观点，也欢迎把它分享给更多的朋友一起阅读。</p>`,85)])])}const h=a(i,[["render",l]]);export{d as __pageData,h as default};
