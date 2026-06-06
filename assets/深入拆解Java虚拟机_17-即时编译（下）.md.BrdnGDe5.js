import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"17 | 即时编译（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"Profiling","slug":"profiling","link":"#profiling","children":[]},{"level":2,"title":"基于分支profile的优化","slug":"基于分支profile的优化","link":"#基于分支profile的优化","children":[]},{"level":2,"title":"基于类型profile的优化","slug":"基于类型profile的优化","link":"#基于类型profile的优化","children":[]},{"level":2,"title":"去优化","slug":"去优化","link":"#去优化","children":[]},{"level":2,"title":"总结与实践","slug":"总结与实践","link":"#总结与实践","children":[]}],"relativePath":"深入拆解Java虚拟机/17-即时编译（下）.md","filePath":"深入拆解Java虚拟机/17-即时编译（下）.md","lastUpdated":1779821039000}'),i={name:"深入拆解Java虚拟机/17-即时编译（下）.md"};function l(t,n,c,o,r,d){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_17-即时编译-下" tabindex="-1">17 | 即时编译（下） <a class="header-anchor" href="#_17-即时编译-下" aria-label="Permalink to &quot;17 | 即时编译（下）&quot;">​</a></h1><p>今天我们来继续讲解Java虚拟机中的即时编译。</p><h2 id="profiling" tabindex="-1">Profiling <a class="header-anchor" href="#profiling" aria-label="Permalink to &quot;Profiling&quot;">​</a></h2><p>上篇提到，分层编译中的0层、2层和3层都会进行profiling，收集能够反映程序执行状态的数据。其中，最为基础的便是方法的调用次数以及循环回边的执行次数。它们被用于触发即时编译。</p><p>此外，0层和3层还会收集用于4层C2编译的数据，比如说分支跳转字节码的分支profile（branch profile），包括跳转次数和不跳转次数，以及非私有实例方法调用指令、强制类型转换checkcast指令、类型测试instanceof指令，和引用类型的数组存储aastore指令的类型profile（receiver type profile）。</p><p>分支profile和类型profile的收集将给应用程序带来不少的性能开销。据统计，正是因为这部分额外的profiling，使得3层C1代码的性能比2层C1代码的低30%。</p><p>在通常情况下，我们不会在解释执行过程中收集分支profile以及类型profile。只有在方法触发C1编译后，Java虚拟机认为该方法有可能被C2编译，方才在该方法的C1代码中收集这些profile。</p><p>只要在比较极端的情况下，例如等待C1编译的方法数目太多时，Java虚拟机才会开始在解释执行过程中收集这些profile。</p><p>那么这些耗费巨大代价收集而来的profile具体有什么作用呢？</p><p>答案是，C2可以根据收集得到的数据进行猜测，假设接下来的执行同样会按照所收集的profile进行，从而作出比较激进的优化。</p><h2 id="基于分支profile的优化" tabindex="-1">基于分支profile的优化 <a class="header-anchor" href="#基于分支profile的优化" aria-label="Permalink to &quot;基于分支profile的优化&quot;">​</a></h2><p>举个例子，下面这段代码中包含两个条件判断。第一个条件判断将测试所输入的boolean值。</p><p>如果为true，则将局部变量v设置为所输入的int值。如果为false，则将所输入的int值经过一番运算之后，再存入局部变量v之中。</p><p>第二个条件判断则测试局部变量v是否和所输入的int值相等。如果相等，则返回0。如果不等，则将局部变量v经过一番运算之后，再将之返回。显然，当所输入的boolean值为true的情况下，这段代码将返回0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int foo(boolean f, int in) {</span></span>
<span class="line"><span>  int v;</span></span>
<span class="line"><span>  if (f) {</span></span>
<span class="line"><span>    v = in;</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    v = (int) Math.sin(in);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (v == in) {</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    return (int) Math.cos(v);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 编译而成的字节码：</span></span>
<span class="line"><span>public static int foo(boolean, int);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>     0: iload_0</span></span>
<span class="line"><span>     1: ifeq          9</span></span>
<span class="line"><span>     4: iload_1</span></span>
<span class="line"><span>     5: istore_2</span></span>
<span class="line"><span>     6: goto          16</span></span>
<span class="line"><span>     9: iload_1</span></span>
<span class="line"><span>    10: i2d</span></span>
<span class="line"><span>    11: invokestatic  java/lang/Math.sin:(D)D</span></span>
<span class="line"><span>    14: d2i</span></span>
<span class="line"><span>    15: istore_2</span></span>
<span class="line"><span>    16: iload_2</span></span>
<span class="line"><span>    17: iload_1</span></span>
<span class="line"><span>    18: if_icmpne     23</span></span>
<span class="line"><span>    21: iconst_0</span></span>
<span class="line"><span>    22: ireturn</span></span>
<span class="line"><span>    23: iload_2</span></span>
<span class="line"><span>    24: i2d</span></span>
<span class="line"><span>    25: invokestatic java/lang/Math.cos:(D)D</span></span>
<span class="line"><span>    28: d2i</span></span>
<span class="line"><span>    29: ireturn</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/53d57c8c7645d8e2292a08ee97557b0e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/53d57c8c7645d8e2292a08ee97557b0e.png" alt=""></a></p><p>假设应用程序调用该方法时，所传入的boolean值皆为true。那么，偏移量为1以及偏移量为18的条件跳转指令所对应的分支profile中，跳转的次数都为0。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/90eb47e4c9b202c45804ef7383a9d6cc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/90eb47e4c9b202c45804ef7383a9d6cc.png" alt=""></a></p><p>C2可以根据这两个分支profile作出假设，在接下来的执行过程中，这两个条件跳转指令仍旧不会发生跳转。基于这个假设，C2便不再编译这两个条件跳转语句所对应的false分支了。</p><p>我们暂且不管当假设错误的时候会发生什么，先来看一看剩下来的代码。经过“剪枝”之后，在第二个条件跳转处，v的值只有可能为所输入的int值。因此，该条件跳转可以进一步被优化掉。最终的结果是，在第一个条件跳转之后，C2代码将直接返回0。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/d997a7ea02b7f85136974a54dce7589a.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/d997a7ea02b7f85136974a54dce7589a.png" alt=""></a></p><p>这里我打印了C2的编译结果。可以看到，在地址为2cee的指令处进行过一次比较之后，该机器码便直接返回0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Compiled method (c2)      95   16       4       CompilationTest::foo (30 bytes)</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>CompilationTest.foo  [0x0000000104fb2ce0, 0x0000000104fb2d38]  88 bytes</span></span>
<span class="line"><span>[Entry Point]</span></span>
<span class="line"><span>[Verified Entry Point]</span></span>
<span class="line"><span>[Constants]</span></span>
<span class="line"><span>  # {method} {0x000000012629e380} &#39;foo&#39; &#39;(ZI)I&#39; in &#39;CompilationTest&#39;</span></span>
<span class="line"><span>  # parm0:    rsi       = boolean</span></span>
<span class="line"><span>  # parm1:    rdx       = int</span></span>
<span class="line"><span>  #           [sp+0x30]  (sp of caller)</span></span>
<span class="line"><span>  0x0000000104fb2ce0: mov    DWORD PTR [rsp-0x14000],eax</span></span>
<span class="line"><span>  0x0000000104fb2ce7: push   rbp</span></span>
<span class="line"><span>  0x0000000104fb2ce8: sub    rsp,0x20</span></span>
<span class="line"><span>  0x0000000104fb2cec: test   esi,esi</span></span>
<span class="line"><span>  0x0000000104fb2cee: je     0x0000000104fb2cfe // 跳转至?</span></span>
<span class="line"><span>  0x0000000104fb2cf0: xor    eax,eax            // 将返回值设置为0</span></span>
<span class="line"><span>  0x0000000104fb2cf2: add    rsp,0x20</span></span>
<span class="line"><span>  0x0000000104fb2cf6: pop    rbp</span></span>
<span class="line"><span>  0x0000000104fb2cf7: test   DWORD PTR [rip+0xfffffffffca32303],eax // safepoint</span></span>
<span class="line"><span>  0x0000000104fb2cfd: ret</span></span>
<span class="line"><span>  ...</span></span></code></pre></div><p>总结一下，根据条件跳转指令的分支profile，即时编译器可以将从未执行过的分支剪掉，以避免编译这些很有可能不会用到的代码，从而节省编译时间以及部署代码所要消耗的内存空间。此外，“剪枝”将精简程序的数据流，从而触发更多的优化。</p><p>在现实中，分支profile出现仅跳转或者仅不跳转的情况并不多见。当然，即时编译器对分支profile的利用也不仅限于“剪枝”。它还会根据分支profile，计算每一条程序执行路径的概率，以便某些编译器优化优先处理概率较高的路径。</p><h2 id="基于类型profile的优化" tabindex="-1">基于类型profile的优化 <a class="header-anchor" href="#基于类型profile的优化" aria-label="Permalink to &quot;基于类型profile的优化&quot;">​</a></h2><p>另外一个例子则是关于instanceof以及方法调用的类型profile。下面这段代码将测试所传入的对象是否为Exception的实例，如果是，则返回它的系统哈希值；如果不是，则返回它的哈希值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static int hash(Object in) {</span></span>
<span class="line"><span>  if (in instanceof Exception) {</span></span>
<span class="line"><span>    return System.identityHashCode(in);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    return in.hashCode();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 编译而成的字节码：</span></span>
<span class="line"><span>public static int hash(java.lang.Object);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>     0: aload_0</span></span>
<span class="line"><span>     1: instanceof java/lang/Exception</span></span>
<span class="line"><span>     4: ifeq          12</span></span>
<span class="line"><span>     7: aload_0</span></span>
<span class="line"><span>     8: invokestatic java/lang/System.identityHashCode:(Ljava/lang/Object;)I</span></span>
<span class="line"><span>    11: ireturn</span></span>
<span class="line"><span>    12: aload_0</span></span>
<span class="line"><span>    13: invokevirtual java/lang/Object.hashCode:()I</span></span>
<span class="line"><span>    16: ireturn</span></span></code></pre></div><p>假设应用程序调用该方法时，所传入的Object皆为Integer实例。那么，偏移量为1的instanceof指令的类型profile仅包含Integer，偏移量为4的分支跳转语句的分支profile中不跳转的次数为0，偏移量为13的方法调用指令的类型profile仅包含Integer。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/2c13a1af8632a2bbf77338e57c957b77.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/2c13a1af8632a2bbf77338e57c957b77.png" alt=""></a></p><p>在Java虚拟机中，instanceof测试并不简单。如果instanceof的目标类型是final类型，那么Java虚拟机仅需比较测试对象的动态类型是否为该final类型。</p><p>在讲解对象的内存分布那一篇中，我曾经提到过，对象头存有该对象的动态类型。因此，获取对象的动态类型仅为单一的内存读指令。</p><p>如果目标类型不是final类型，比如说我们例子中的Exception，那么Java虚拟机需要从测试对象的动态类型开始，依次测试该类，该类的父类、祖先类，该类所直接实现或者间接实现的接口是否与目标类型一致。</p><p>不过，在我们的例子中，instanceof指令的类型profile仅包含Integer。根据这个信息，即时编译器可以假设，在接下来的执行过程中，所输入的Object对象仍为Integer实例。</p><p>因此，生成的代码将测试所输入的对象的动态类型是否为Integer。如果是的话，则继续执行接下来的代码。（该优化源自Graal，采用C2可能无法复现。）</p><p>然后，即时编译器会采用和第一个例子中一致的针对分支profile的优化，以及对方法调用的条件去虚化内联。</p><p>我会在接下来的篇章中详细介绍内联，这里先说结果：生成的代码将测试所输入的对象动态类型是否为Integer。如果是的话，则执行Integer.hashCode()方法的实质内容，也就是返回该Integer实例的value字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class Integer ... {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int hashCode() {</span></span>
<span class="line"><span>        return Integer.hashCode(value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static int hashCode(int value) {</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/ef02474d3474e96c6f55b07493652fb6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/ef02474d3474e96c6f55b07493652fb6.png" alt=""></a></p><p>和第一个例子一样，根据数据流分析，上述代码可以最终优化为极其简单的形式。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/53e470037dd49d3d27695a5174fc3dbe.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/14070/53e470037dd49d3d27695a5174fc3dbe.png" alt=""></a></p><p>这里我打印了Graal的编译结果。可以看到，在地址为1ab7的指令处进行过一次比较之后，该机器码便直接返回所传入的Integer对象的value字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Compiled method (JVMCI)     600   23       4</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>----------------------------------------------------------------------</span></span>
<span class="line"><span>CompilationTest.hash (CompilationTest.hash(Object))  [0x000000011d811aa0, 0x000000011d811b00]  96 bytes</span></span>
<span class="line"><span>[Entry Point]</span></span>
<span class="line"><span>[Verified Entry Point]</span></span>
<span class="line"><span>[Constants]</span></span>
<span class="line"><span>  # {method} {0x00000001157053c8} &#39;hash&#39; &#39;(Ljava/lang/Object;)I&#39; in &#39;CompilationTest&#39;</span></span>
<span class="line"><span>  # parm0:    rsi:rsi   = &#39;java/lang/Object&#39;</span></span>
<span class="line"><span>  #           [sp+0x20]  (sp of caller)</span></span>
<span class="line"><span>  0x000000011d811aa0: mov    DWORD PTR [rsp-0x14000],eax</span></span>
<span class="line"><span>  0x000000011d811aa7: sub    rsp,0x18</span></span>
<span class="line"><span>  0x000000011d811aab: mov    QWORD PTR [rsp+0x10],rbp</span></span>
<span class="line"><span>  // 比较[rsi+0x8]，也就是所传入的Object参数的动态类型，是否为Integer。这里0xf80022ad是Integer类的内存地址。</span></span>
<span class="line"><span>  0x000000011d811ab0: cmp    DWORD PTR [rsi+0x8],0xf80022ad</span></span>
<span class="line"><span>  // 如果不是，跳转至？</span></span>
<span class="line"><span>  0x000000011d811ab7: jne    0x000000011d811ad3</span></span>
<span class="line"><span>  // 加载Integer.value。在启用压缩指针时，该字段的偏移量为12，也就是0xc</span></span>
<span class="line"><span>  0x000000011d811abd: mov    eax,DWORD PTR [rsi+0xc]</span></span>
<span class="line"><span>  0x000000011d811ac0: mov    rbp,QWORD PTR [rsp+0x10]</span></span>
<span class="line"><span>  0x000000011d811ac5: add    rsp,0x18</span></span>
<span class="line"><span>  0x000000011d811ac9: test   DWORD PTR [rip+0xfffffffff272f537],eax</span></span>
<span class="line"><span>  0x000000011d811acf: vzeroupper</span></span>
<span class="line"><span>  0x000000011d811ad2: ret</span></span></code></pre></div><p>和基于分支profile的优化一样，基于类型profile的优化同样也是作出假设，从而精简控制流以及数据流。这两者的核心都是假设。</p><p>对于分支profile，即时编译器假设的是仅执行某一分支；对于类型profile，即时编译器假设的是对象的动态类型仅为类型profile中的那几个。</p><p>那么，当假设失败的情况下，程序将何去何从？我们继续往下看。</p><h2 id="去优化" tabindex="-1">去优化 <a class="header-anchor" href="#去优化" aria-label="Permalink to &quot;去优化&quot;">​</a></h2><p>Java虚拟机给出的解决方案便是去优化，即从执行即时编译生成的机器码切换回解释执行。</p><p>在生成的机器码中，即时编译器将在假设失败的位置上插入一个陷阱（trap）。该陷阱实际上是一条call指令，调用至Java虚拟机里专门负责去优化的方法。与普通的call指令不一样的是，去优化方法将更改栈上的返回地址，并不再返回即时编译器生成的机器码中。</p><p>在上面的程序控制流图中，我画了很多红色方框的问号。这些问号便代表着一个个的陷阱。一旦踏入这些陷阱，便将发生去优化，并切换至解释执行。</p><p>去优化的过程相当复杂。由于即时编译器采用了许多优化方式，其生成的代码和原本的字节码的差异非常之大。</p><p>在去优化的过程中，需要将当前机器码的执行状态转换至某一字节码之前的执行状态，并从该字节码开始执行。这便要求即时编译器在编译过程中记录好这两种执行状态的映射。</p><p>举例来说，经过逃逸分析之后，机器码可能并没有实际分配对象，而是在各个寄存器中存储该对象的各个字段（标量替换，具体我会在之后的篇章中进行介绍）。在去优化过程中，Java虚拟机需要还原出这个对象，以便解释执行时能够使用该对象。</p><p>当根据映射关系创建好对应的解释执行栈桢后，Java虚拟机便会采用OSR技术，动态替换栈上的内容，并在目标字节码处开始解释执行。</p><p>此外，在调用Java虚拟机的去优化方法时，即时编译器生成的机器码可以根据产生去优化的原因来决定是否保留这一份机器码，以及何时重新编译对应的Java方法。</p><p>如果去优化的原因与优化无关，即使重新编译也不会改变生成的机器码，那么生成的机器码可以在调用去优化方法时传入Action_None，表示保留这一份机器码，在下一次调用该方法时重新进入这一份机器码。</p><p>如果去优化的原因与静态分析的结果有关，例如类层次分析，那么生成的机器码可以在调用去优化方法时传入Action_Recompile，表示不保留这一份机器码，但是可以不经过重新profile，直接重新编译。</p><p>如果去优化的原因与基于profile的激进优化有关，那么生成的机器码需要在调用去优化方法时传入Action_Reinterpret，表示不保留这一份机器码，而且需要重新收集程序的profile。</p><p>这是因为基于profile的优化失败的时候，往往代表这程序的执行状态发生改变，因此需要更正已收集的profile，以更好地反映新的程序执行状态。</p><h2 id="总结与实践" tabindex="-1">总结与实践 <a class="header-anchor" href="#总结与实践" aria-label="Permalink to &quot;总结与实践&quot;">​</a></h2><p>今天我介绍了Java虚拟机的profiling以及基于所收集的数据的优化和去优化。</p><p>通常情况下，解释执行过程中仅收集方法的调用次数以及循环回边的执行次数。</p><p>当方法被3层C1所编译时，生成的C1代码将收集条件跳转指令的分支profile，以及类型相关指令的类型profile。在部分极端情况下，Java虚拟机也会在解释执行过程中收集这些profile。</p><p>基于分支profile的优化以及基于类型profile的优化都将对程序今后的执行作出假设。这些假设将精简所要编译的代码的控制流以及数据流。在假设失败的情况下，Java虚拟机将采取去优化，退回至解释执行并重新收集相关的profile。</p><p>今天的实践环节，你可以使用参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-XX:CompileCommand=&#39;print,*ClassName.methodName&#39;</span></span></code></pre></div><p>来打印程序运行过程中即时编译器生成的机器码。官方的JDK可能不包含反汇编器动态链接库，如hsdis-amd64.dylib。你可能需要另外下载。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// java -XX:CompileCommand=&#39;print,CompilationTest.foo&#39; CompilationTestjava -XX:CompileCommand=&#39;print,CompilationTest.foo&#39; CompilationTest</span></span>
<span class="line"><span>public class CompilationTest {</span></span>
<span class="line"><span>  public static int foo(boolean f, int in) {</span></span>
<span class="line"><span>    int v;</span></span>
<span class="line"><span>    if (f) {</span></span>
<span class="line"><span>      v = in;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      v = (int) Math.sin(in);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (v == in) {</span></span>
<span class="line"><span>      return 0;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      return (int) Math.cos(v);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 500000; i++) {</span></span>
<span class="line"><span>      foo(true, 2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Thread.sleep(2000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// java -XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler -XX:CompileCommand=&#39;print,CompilationTest2.hash&#39; CompilationTest2</span></span>
<span class="line"><span>public class CompilationTest2 {</span></span>
<span class="line"><span>  public static int hash(Object input) {</span></span>
<span class="line"><span>    if (input instanceof Exception) {</span></span>
<span class="line"><span>      return System.identityHashCode(input);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      return input.hashCode();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 500000; i++) {</span></span>
<span class="line"><span>      hash(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Thread.sleep(2000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,68)])])}const b=a(i,[["render",l]]);export{h as __pageData,b as default};
