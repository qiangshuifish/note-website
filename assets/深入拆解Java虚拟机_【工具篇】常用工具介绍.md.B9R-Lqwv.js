import{_ as a,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"【工具篇】 常用工具介绍","description":"","frontmatter":{},"headers":[{"level":2,"title":"javap：查阅Java字节码","slug":"javap-查阅java字节码","link":"#javap-查阅java字节码","children":[]},{"level":2,"title":"2.OpenJDK项目Code Tools：实用小工具集","slug":"_2-openjdk项目code-tools-实用小工具集","link":"#_2-openjdk项目code-tools-实用小工具集","children":[]},{"level":2,"title":"3.ASM：Java字节码框架","slug":"_3-asm-java字节码框架","link":"#_3-asm-java字节码框架","children":[]}],"relativePath":"深入拆解Java虚拟机/【工具篇】常用工具介绍.md","filePath":"深入拆解Java虚拟机/【工具篇】常用工具介绍.md","lastUpdated":1779821039000}'),e={name:"深入拆解Java虚拟机/【工具篇】常用工具介绍.md"};function i(t,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="【工具篇】-常用工具介绍" tabindex="-1">【工具篇】 常用工具介绍 <a class="header-anchor" href="#【工具篇】-常用工具介绍" aria-label="Permalink to &quot;【工具篇】 常用工具介绍&quot;">​</a></h1><p>在前面的文章中，我曾使用了不少工具来辅助讲解，也收到了不少同学留言，说不了解这些工具，不知道都有什么用，应该怎么用。那么今天我便统一做一次具体的介绍。本篇代码较多，你可以点击文稿查看。</p><h2 id="javap-查阅java字节码" tabindex="-1">javap：查阅Java字节码 <a class="header-anchor" href="#javap-查阅java字节码" aria-label="Permalink to &quot;javap：查阅Java字节码&quot;">​</a></h2><p>javap是一个能够将class文件反汇编成人类可读格式的工具。在本专栏中，我们经常借助这个工具来查阅Java字节码。</p><p>举个例子，在讲解异常处理那一篇中，我曾经展示过这么一段代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Foo {</span></span>
<span class="line"><span>  private int tryBlock;</span></span>
<span class="line"><span>  private int catchBlock;</span></span>
<span class="line"><span>  private int finallyBlock;</span></span>
<span class="line"><span>  private int methodExit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void test() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      tryBlock = 0;</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      catchBlock = 1;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      finallyBlock = 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    methodExit = 3;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>编译过后，我们便可以使用javap来查阅Foo.test方法的字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ javac Foo.java</span></span>
<span class="line"><span>$ javap -p -v Foo</span></span>
<span class="line"><span>Classfile ../Foo.class</span></span>
<span class="line"><span>  Last modified ..; size 541 bytes</span></span>
<span class="line"><span>  MD5 checksum 3828cdfbba56fea1da6c8d94fd13b20d</span></span>
<span class="line"><span>  Compiled from &quot;Foo.java&quot;</span></span>
<span class="line"><span>public class Foo</span></span>
<span class="line"><span>  minor version: 0</span></span>
<span class="line"><span>  major version: 54</span></span>
<span class="line"><span>  flags: (0x0021) ACC_PUBLIC, ACC_SUPER</span></span>
<span class="line"><span>  this_class: #7                          // Foo</span></span>
<span class="line"><span>  super_class: #8                         // java/lang/Object</span></span>
<span class="line"><span>  interfaces: 0, fields: 4, methods: 2, attributes: 1</span></span>
<span class="line"><span>Constant pool:</span></span>
<span class="line"><span>   #1 = Methodref          #8.#23</span><span>         // java/lang/Object.&quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>   #2 = Fieldref           #7.#24</span><span>         // Foo.tryBlock:I</span></span>
<span class="line"><span>   #3 = Fieldref           #7.#25</span><span>         // Foo.finallyBlock:I</span></span>
<span class="line"><span>   #4 = Class              #26</span><span>            // java/lang/Exception</span></span>
<span class="line"><span>   #5 = Fieldref           #7.#27</span><span>         // Foo.catchBlock:I</span></span>
<span class="line"><span>   #6 = Fieldref           #7.#28</span><span>         // Foo.methodExit:I</span></span>
<span class="line"><span>   #7 = Class              #29</span><span>            // Foo</span></span>
<span class="line"><span>   #8 = Class              #30</span><span>            // java/lang/Object</span></span>
<span class="line"><span>   #9 = Utf8               tryBlock</span></span>
<span class="line"><span>  #10 = Utf8               I</span></span>
<span class="line"><span>  #11 = Utf8               catchBlock</span></span>
<span class="line"><span>  #12 = Utf8               finallyBlock</span></span>
<span class="line"><span>  #13 = Utf8               methodExit</span></span>
<span class="line"><span>  #14 = Utf8               &lt;​init&gt;</span></span>
<span class="line"><span>  #15 = Utf8               ()V</span></span>
<span class="line"><span>  #16 = Utf8               Code</span></span>
<span class="line"><span>  #17 = Utf8               LineNumberTable</span></span>
<span class="line"><span>  #18 = Utf8               test</span></span>
<span class="line"><span>  #19 = Utf8               StackMapTable</span></span>
<span class="line"><span>  #20 = Class              #31</span><span>            // java/lang/Throwable</span></span>
<span class="line"><span>  #21 = Utf8               SourceFile</span></span>
<span class="line"><span>  #22 = Utf8               Foo.java</span></span>
<span class="line"><span>  #23 = NameAndType        #14:#15</span><span>        // &quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>  #24 = NameAndType        #9:#10</span><span>         // tryBlock:I</span></span>
<span class="line"><span>  #25 = NameAndType        #12:#10</span><span>        // finallyBlock:I</span></span>
<span class="line"><span>  #26 = Utf8               java/lang/Exception</span></span>
<span class="line"><span>  #27 = NameAndType        #11:#10</span><span>        // catchBlock:I</span></span>
<span class="line"><span>  #28 = NameAndType        #13:#10</span><span>        // methodExit:I</span></span>
<span class="line"><span>  #29 = Utf8               Foo</span></span>
<span class="line"><span>  #30 = Utf8               java/lang/Object</span></span>
<span class="line"><span>  #31 = Utf8               java/lang/Throwable</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  private int tryBlock;</span></span>
<span class="line"><span>    descriptor: I</span></span>
<span class="line"><span>    flags: (0x0002) ACC_PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private int catchBlock;</span></span>
<span class="line"><span>    descriptor: I</span></span>
<span class="line"><span>    flags: (0x0002) ACC_PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private int finallyBlock;</span></span>
<span class="line"><span>    descriptor: I</span></span>
<span class="line"><span>    flags: (0x0002) ACC_PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private int methodExit;</span></span>
<span class="line"><span>    descriptor: I</span></span>
<span class="line"><span>    flags: (0x0002) ACC_PRIVATE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Foo();</span></span>
<span class="line"><span>    descriptor: ()V</span></span>
<span class="line"><span>    flags: (0x0001) ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=1, locals=1, args_size=1</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: invokespecial #1                  // Method java/lang/Object.&quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>         4: return</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 1: 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void test();</span></span>
<span class="line"><span>    descriptor: ()V</span></span>
<span class="line"><span>    flags: (0x0001) ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=2, locals=3, args_size=1</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: iconst_0</span></span>
<span class="line"><span>         2: putfield      #2                  // Field tryBlock:I</span></span>
<span class="line"><span>         5: aload_0</span></span>
<span class="line"><span>         6: iconst_2</span></span>
<span class="line"><span>         7: putfield      #3                  // Field finallyBlock:I</span></span>
<span class="line"><span>        10: goto          35</span></span>
<span class="line"><span>        13: astore_1</span></span>
<span class="line"><span>        14: aload_0</span></span>
<span class="line"><span>        15: iconst_1</span></span>
<span class="line"><span>        16: putfield      #5                  // Field catchBlock:I</span></span>
<span class="line"><span>        19: aload_0</span></span>
<span class="line"><span>        20: iconst_2</span></span>
<span class="line"><span>        21: putfield      #3                  // Field finallyBlock:I</span></span>
<span class="line"><span>        24: goto          35</span></span>
<span class="line"><span>        27: astore_2</span></span>
<span class="line"><span>        28: aload_0</span></span>
<span class="line"><span>        29: iconst_2</span></span>
<span class="line"><span>        30: putfield      #3                  // Field finallyBlock:I</span></span>
<span class="line"><span>        33: aload_2</span></span>
<span class="line"><span>        34: athrow</span></span>
<span class="line"><span>        35: aload_0</span></span>
<span class="line"><span>        36: iconst_3</span></span>
<span class="line"><span>        37: putfield      #6                  // Field methodExit:I</span></span>
<span class="line"><span>        40: return</span></span>
<span class="line"><span>      Exception table:</span></span>
<span class="line"><span>         from    to  target type</span></span>
<span class="line"><span>             0     5    13   Class java/lang/Exception</span></span>
<span class="line"><span>             0     5    27   any</span></span>
<span class="line"><span>            13    19    27   any</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 9: 0</span></span>
<span class="line"><span>        line 13: 5</span></span>
<span class="line"><span>        line 14: 10</span></span>
<span class="line"><span>        line 10: 13</span></span>
<span class="line"><span>        line 11: 14</span></span>
<span class="line"><span>        line 13: 19</span></span>
<span class="line"><span>        line 14: 24</span></span>
<span class="line"><span>        line 13: 27</span></span>
<span class="line"><span>        line 14: 33</span></span>
<span class="line"><span>        line 15: 35</span></span>
<span class="line"><span>        line 16: 40</span></span>
<span class="line"><span>      StackMapTable: number_of_entries = 3</span></span>
<span class="line"><span>        frame_type = 77 /* same_locals_1_stack_item */</span></span>
<span class="line"><span>          stack = [ class java/lang/Exception ]</span></span>
<span class="line"><span>        frame_type = 77 /* same_locals_1_stack_item */</span></span>
<span class="line"><span>          stack = [ class java/lang/Throwable ]</span></span>
<span class="line"><span>        frame_type = 7 /* same */</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>SourceFile: &quot;Foo.java&quot;</span></span></code></pre></div><p>这里面我用到了两个选项。第一个选项是-p。默认情况下javap会打印所有非私有的字段和方法，当加了-p选项后，它还将打印私有的字段和方法。第二个选项是-v。它尽可能地打印所有信息。如果你只需要查阅方法对应的字节码，那么可以用-c选项来替换-v。</p><p>javap的-v选项的输出分为几大块。</p><p>1.基本信息，涵盖了原class文件的相关信息。</p><p>class文件的版本号（minor version: 0，major version: 54），该类的访问权限（flags: (0x0021) ACC_PUBLIC, ACC_SUPER），该类（this_class: #7）以及父类（super_class: #8）的名字，所实现接口（interfaces: 0）、字段（fields: 4）、方法（methods: 2）以及属性（attributes: 1）的数目。</p><p>这里属性指的是class文件所携带的辅助信息，比如该class文件的源文件的名称。这类信息通常被用于Java虚拟机的验证和运行，以及Java程序的调试，一般无须深入了解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Classfile ../Foo.class</span></span>
<span class="line"><span>  Last modified ..; size 541 bytes</span></span>
<span class="line"><span>  MD5 checksum 3828cdfbba56fea1da6c8d94fd13b20d</span></span>
<span class="line"><span>  Compiled from &quot;Foo.java&quot;</span></span>
<span class="line"><span>public class Foo</span></span>
<span class="line"><span>  minor version: 0</span></span>
<span class="line"><span>  major version: 54</span></span>
<span class="line"><span>  flags: (0x0021) ACC_PUBLIC, ACC_SUPER</span></span>
<span class="line"><span>  this_class: #7                          // Foo</span></span>
<span class="line"><span>  super_class: #8                         // java/lang/Object</span></span>
<span class="line"><span>  interfaces: 0, fields: 4, methods: 2, attributes: 1</span></span></code></pre></div><p>class文件的版本号指的是编译生成该class文件时所用的JRE版本。由较新的JRE版本中的javac编译而成的class文件，不能在旧版本的JRE上跑，否则，会出现如下异常信息。（Java 8对应的版本号为52，Java 10对应的版本号为54。）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;main&quot; java.lang.UnsupportedClassVersionError: Foo has been compiled by a more recent version of the Java Runtime (class file version 54.0), this version of the Java Runtime only recognizes class file versions up to 52.0</span></span></code></pre></div><p>类的访问权限通常为ACC_开头的常量。具体每个常量的意义可以查阅Java虚拟机规范4.1小节[1]。</p><p>2.常量池，用来存放各种常量以及符号引用。</p><p>常量池中的每一项都有一个对应的索引（如#1），并且可能引用其他的常量池项（#1 = Methodref #8.#23）。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Constant pool:</span></span>
<span class="line"><span>   #1 = Methodref          #8.#23</span><span>         // java/lang/Object.&quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>   #8 = Class              #30</span><span>            // java/lang/Object</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>  #14 = Utf8               &lt;​init&gt;</span></span>
<span class="line"><span>  #15 = Utf8               ()V</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>  #23 = NameAndType        #14:#15</span><span>        // &quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>  #30 = Utf8               java/lang/Object</span></span></code></pre></div><p>举例来说，上图中的1号常量池项是一个指向Object类构造器的符号引用。它是由另外两个常量池项所构成。如果将它看成一个树结构的话，那么它的叶节点会是字符串常量，如下图所示。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/12423/f87469e321c52b21b0d2abb88e7b288c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/12423/f87469e321c52b21b0d2abb88e7b288c.png" alt=""></a></p><p>3.字段区域，用来列举该类中的各个字段。</p><p>这里最主要的信息便是该字段的类型（descriptor: I）以及访问权限（flags: (0x0002) ACC_PRIVATE）。对于声明为final的静态字段而言，如果它是基本类型或者字符串类型，那么字段区域还将包括它的常量值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  private int tryBlock;</span></span>
<span class="line"><span>    descriptor: I</span></span>
<span class="line"><span>    flags: (0x0002) ACC_PRIVATE</span></span></code></pre></div><p>另外，Java虚拟机同样使用了“描述符”（descriptor）来描述字段的类型。具体的对照如下表所示。其中比较特殊的，我已经高亮显示。</p><p>4.方法区域，用来列举该类中的各个方法。</p><p>除了方法描述符以及访问权限之外，每个方法还包括最为重要的代码区域（Code:)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public void test();</span></span>
<span class="line"><span>    descriptor: ()V</span></span>
<span class="line"><span>    flags: (0x0001) ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=2, locals=3, args_size=1</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>        10: goto          35</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>        34: athrow</span></span>
<span class="line"><span>        35: aload_0</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>        40: return</span></span>
<span class="line"><span>      Exception table:</span></span>
<span class="line"><span>         from    to  target type</span></span>
<span class="line"><span>             0     5    13   Class java/lang/Exception</span></span>
<span class="line"><span>             0     5    27   any</span></span>
<span class="line"><span>            13    19    27   any</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 9: 0</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>        line 16: 40</span></span>
<span class="line"><span>      StackMapTable: number_of_entries = 3</span></span>
<span class="line"><span>        frame_type = 77 /* same_locals_1_stack_item */</span></span>
<span class="line"><span>          stack = [ class java/lang/Exception ]</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>代码区域一开始会声明该方法中的操作数栈（stack=2）和局部变量数目（locals=3）的最大值，以及该方法接收参数的个数（args_size=1）。注意这里局部变量指的是字节码中的局部变量，而非Java程序中的局部变量。</p><p>接下来则是该方法的字节码。每条字节码均标注了对应的偏移量（bytecode index，BCI），这是用来定位字节码的。比如说偏移量为10的跳转字节码10: goto 35，将跳转至偏移量为35的字节码35: aload_0。</p><p>紧跟着的异常表（Exception table:）也会使用偏移量来定位每个异常处理器所监控的范围（由from到to的代码区域），以及异常处理器的起始位置（target）。除此之外，它还会声明所捕获的异常类型（type）。其中，any指代任意异常类型。</p><p>再接下来的行数表（LineNumberTable:）则是Java源程序到字节码偏移量的映射。如果你在编译时使用了-g参数（javac -g Foo.java），那么这里还将出现局部变量表（LocalVariableTable:），展示Java程序中每个局部变量的名字、类型以及作用域。</p><p>行数表和局部变量表均属于调试信息。Java虚拟机并不要求class文件必备这些信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>      LocalVariableTable:</span></span>
<span class="line"><span>        Start  Length  Slot  Name   Signature</span></span>
<span class="line"><span>           14       5     1     e   Ljava/lang/Exception;</span></span>
<span class="line"><span>            0      41     0  this   LFoo;</span></span></code></pre></div><p>最后则是字节码操作数栈的映射表（StackMapTable: number_of_entries = 3）。该表描述的是字节码跳转后操作数栈的分布情况，一般被Java虚拟机用于验证所加载的类，以及即时编译相关的一些操作，正常情况下，你无须深入了解。</p><h2 id="_2-openjdk项目code-tools-实用小工具集" tabindex="-1">2.OpenJDK项目Code Tools：实用小工具集 <a class="header-anchor" href="#_2-openjdk项目code-tools-实用小工具集" aria-label="Permalink to &quot;2.OpenJDK项目Code Tools：实用小工具集&quot;">​</a></h2><p>OpenJDK的Code Tools项目[2]包含了好几个实用的小工具。</p><p>在第一篇的实践环节中，我们使用了其中的字节码汇编器反汇编器ASMTools[3]，当前6.0版本的下载地址位于[4]。ASMTools的反汇编以及汇编操作所对应的命令分别为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ java -cp /path/to/asmtools.jar org.openjdk.asmtools.jdis.Main Foo.class &gt; Foo.jasm</span></span></code></pre></div><p>和</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ java -cp /path/to/asmtools.jar org.openjdk.asmtools.jasm.Main Foo.jasm</span></span></code></pre></div><p>该反汇编器的输出格式和javap的不尽相同。一般我只使用它来进行一些简单的字节码修改，以此生成无法直接由Java编译器生成的类，它在HotSpot虚拟机自身的测试中比较常见。</p><p>在第一篇的实践环节中，我们需要将整数2赋值到一个声明为boolean类型的局部变量中。我采取的做法是将编译生成的class文件反汇编至一个文本文件中，然后找到boolean flag = true对应的字节码序列，也就是下面的两个。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>iconst_1;</span></span>
<span class="line"><span>istore_1;</span></span></code></pre></div><p>将这里的iconst_1改为iconst_2[5]，保存后再汇编至class文件即可完成第一篇实践环节的需求。</p><p>除此之外，你还可以利用这一套工具来验证我之前文章中的一些结论。比如我说过class文件允许出现参数类型相同、而返回类型不同的方法，并且，在作为库文件时Java编译器将使用先定义的那一个，来决定具体的返回类型。</p><p>具体的验证方法便是在反汇编之后，利用文本编辑工具复制某一方法，并且更改该方法的描述符，保存后再汇编至class文件。</p><p>Code Tools项目还包含另一个实用的小工具JOL[6]，当前0.9版本的下载地址位于[7]。JOL可用于查阅Java虚拟机中对象的内存分布，具体可通过如下两条指令来实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ java -jar /path/to/jol-cli-0.9-full.jar internals java.util.HashMap</span></span>
<span class="line"><span>$ java -jar /path/to/jol-cli-0.9-full.jar estimates java.util.HashMap</span></span></code></pre></div><h2 id="_3-asm-java字节码框架" tabindex="-1">3.ASM：Java字节码框架 <a class="header-anchor" href="#_3-asm-java字节码框架" aria-label="Permalink to &quot;3.ASM：Java字节码框架&quot;">​</a></h2><p>ASM[8]是一个字节码分析及修改框架。它被广泛应用于许多项目之中，例如Groovy、Kotlin的编译器，代码覆盖测试工具Cobertura、JaCoCo，以及各式各样通过字节码注入实现的程序行为监控工具。甚至是Java 8中Lambda表达式的适配器类，也是借助ASM来动态生成的。</p><p>ASM既可以生成新的class文件，也可以修改已有的class文件。前者相对比较简单一些。ASM甚至还提供了一个辅助类ASMifier，它将接收一个class文件并且输出一段生成该class文件原始字节数组的代码。如果你想快速上手ASM的话，那么你可以借助ASMifier生成的代码来探索各个API的用法。</p><p>下面我将借助ASMifier，来生成第一篇实践环节所用到的类。（你可以通过该地址[9]下载6.0-beta版。）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ echo &#39;</span></span>
<span class="line"><span>public class Foo {</span></span>
<span class="line"><span> public static void main(String[] args) {</span></span>
<span class="line"><span>  boolean flag = true;</span></span>
<span class="line"><span>  if (flag) System.out.println(&quot;Hello, Java!&quot;);</span></span>
<span class="line"><span>  if (flag == true) System.out.println(&quot;Hello, JVM!&quot;);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}&#39; &gt; Foo.java</span></span>
<span class="line"><span># 这里的javac我使用的是Java 8版本的。ASM 6.0可能暂不支持新版本的javac编译出来的class文件</span></span>
<span class="line"><span>$ javac Foo.java</span></span>
<span class="line"><span>$ java -cp /PATH/TO/asm-all-6.0_BETA.jar org.objectweb.asm.util.ASMifier Foo.class | tee FooDump.java</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>public class FooDump implements Opcodes {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static byte[] dump () throws Exception {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ClassWriter cw = new ClassWriter(0);</span></span>
<span class="line"><span>FieldVisitor fv;</span></span>
<span class="line"><span>MethodVisitor mv;</span></span>
<span class="line"><span>AnnotationVisitor av0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, &quot;Foo&quot;, null, &quot;java/lang/Object&quot;, null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>mv = cw.visitMethod(ACC_PUBLIC + ACC_STATIC, &quot;main&quot;, &quot;([Ljava/lang/String;)V&quot;, null, null);</span></span>
<span class="line"><span>mv.visitCode();</span></span>
<span class="line"><span>mv.visitInsn(ICONST_1);</span></span>
<span class="line"><span>mv.visitVarInsn(ISTORE, 1);</span></span>
<span class="line"><span>mv.visitVarInsn(ILOAD, 1);</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>mv.visitInsn(RETURN);</span></span>
<span class="line"><span>mv.visitMaxs(2, 2);</span></span>
<span class="line"><span>mv.visitEnd();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>可以看到，ASMifier生成的代码中包含一个名为FooDump的类，其中定义了一个名为dump的方法。该方法将返回一个byte数组，其值为生成类的原始字节。</p><p>在dump方法中，我们新建了功能类ClassWriter的一个实例，并通过它来访问不同的成员，例如方法、字段等等。</p><p>每当访问一种成员，我们便会得到另一个访问者。在上面这段代码中，当我们访问方法时（即visitMethod），便会得到一个MethodVisitor。在接下来的代码中，我们会用这个MethodVisitor来访问（这里等同于生成）具体的指令。</p><p>这便是ASM所使用的访问者模式。当然，这段代码仅包含ClassWriter这一个访问者，因此看不出具体有什么好处。</p><p>我们暂且不管这个访问者模式，先来看看如何实现第一篇课后实践的要求。首先，main方法中的boolean flag = true;语句对应的代码是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mv.visitInsn(ICONST_1);</span></span>
<span class="line"><span>mv.visitVarInsn(ISTORE, 1);</span></span></code></pre></div><p>也就是说，我们只需将这里的ICONST_1更改为ICONST_2，便可以满足要求。下面我用另一个类Wrapper，来调用修改过后的FooDump.dump方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ echo &#39;import java.nio.file.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Wrapper {</span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    Files.write(Paths.get(&quot;Foo.class&quot;), FooDump.dump());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}&#39; &gt; Wrapper.java</span></span>
<span class="line"><span>$ javac -cp /PATH/TO/asm-all-6.0_BETA.jar FooDump.java Wrapper.java</span></span>
<span class="line"><span>$ java -cp /PATH/TO/asm-all-6.0_BETA.jar:. Wrapper</span></span>
<span class="line"><span>$ java Foo</span></span></code></pre></div><p>这里的输出结果应和通过ASMTools修改的结果一致。</p><p>通过ASM来修改已有class文件则相对复杂一些。不过我们可以从下面这段简单的代码来开始学起：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    ClassReader cr = new ClassReader(&quot;Foo&quot;);</span></span>
<span class="line"><span>    ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);</span></span>
<span class="line"><span>    cr.accept(cw, ClassReader.SKIP_FRAMES);</span></span>
<span class="line"><span>    Files.write(Paths.get(&quot;Foo.class&quot;), cw.toByteArray());</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>这段代码的功能便是读取一个class文件，将之转换为ASM的数据结构，然后再转换为原始字节数组。其中，我使用了两个功能类。除了已经介绍过的ClassWriter外，还有一个ClassReader。</p><p>ClassReader将读取“Foo”类的原始字节，并且翻译成对应的访问请求。也就是说，在上面ASMifier生成的代码中的各个访问操作，现在都交给ClassReader.accept这一方法来发出了。</p><p>那么，如何修改这个class文件的字节码呢？原理很简单，就是将ClassReader的访问请求发给另外一个访问者，再由这个访问者委派给ClassWriter。</p><p>这样一来，新增操作可以通过在某一需要转发的请求后面附带新的请求来实现；删除操作可以通过不转发请求来实现；修改操作可以通过忽略原请求，新建并发出另外的请求来实现。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/12423/2a5d6813e32b8f88abae2b9f7b151fce.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/12423/2a5d6813e32b8f88abae2b9f7b151fce.png" alt=""></a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.nio.file.*;</span></span>
<span class="line"><span>import org.objectweb.asm.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ASMHelper implements Opcodes {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static class MyMethodVisitor extends MethodVisitor {</span></span>
<span class="line"><span>    private MethodVisitor mv;</span></span>
<span class="line"><span>    public MyMethodVisitor(int api, MethodVisitor mv) {</span></span>
<span class="line"><span>      super(api, null);</span></span>
<span class="line"><span>      this.mv = mv;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void visitCode() {</span></span>
<span class="line"><span>      mv.visitCode();</span></span>
<span class="line"><span>      mv.visitFieldInsn(GETSTATIC, &quot;java/lang/System&quot;, &quot;out&quot;, &quot;Ljava/io/PrintStream;&quot;);</span></span>
<span class="line"><span>      mv.visitLdcInsn(&quot;Hello, World!&quot;);</span></span>
<span class="line"><span>      mv.visitMethodInsn(INVOKEVIRTUAL, &quot;java/io/PrintStream&quot;, &quot;println&quot;, &quot;(Ljava/lang/String;)V&quot;, false);</span></span>
<span class="line"><span>      mv.visitInsn(RETURN);</span></span>
<span class="line"><span>      mv.visitMaxs(2, 1);</span></span>
<span class="line"><span>      mv.visitEnd();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static class MyClassVisitor extends ClassVisitor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyClassVisitor(int api, ClassVisitor cv) {</span></span>
<span class="line"><span>      super(api, cv);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature,</span></span>
<span class="line"><span>        String[] exceptions) {</span></span>
<span class="line"><span>      MethodVisitor visitor = super.visitMethod(access, name, descriptor, signature, exceptions);</span></span>
<span class="line"><span>      if (&quot;main&quot;.equals(name)) {</span></span>
<span class="line"><span>        return new MyMethodVisitor(ASM6, visitor);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return visitor;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    ClassReader cr = new ClassReader(&quot;Foo&quot;);</span></span>
<span class="line"><span>    ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);</span></span>
<span class="line"><span>    ClassVisitor cv = new MyClassVisitor(ASM6, cw);</span></span>
<span class="line"><span>    cr.accept(cv, ClassReader.SKIP_FRAMES);</span></span>
<span class="line"><span>    Files.write(Paths.get(&quot;Foo.class&quot;), cw.toByteArray());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我贴了一段代码，在ClassReader和ClassWriter中间插入了一个自定义的访问者MyClassVisitor。它将截获由ClassReader发出的对名字为“main”的方法的访问请求，并且替换为另一个自定义的MethodVisitor。</p><p>这个MethodVisitor会忽略由ClassReader发出的任何请求，仅在遇到visitCode请求时，生成一句“System.out.println(“Hello World!”);”。</p><p>由于篇幅的限制，我就不继续深入介绍下去了。如果你对ASM有浓厚的兴趣，可以参考这篇教程[10]。</p><p>你对这些常用工具还有哪些问题呢？可以给我留言，我们一起讨论。感谢你的收听，我们下期再见。</p><p>[1]</p><p><a href="https://docs.oracle.com/javase/specs/jvms/se10/html/jvms-4.html#jvms-4.1" target="_blank" rel="noreferrer">https://docs.oracle.com/javase/specs/jvms/se10/html/jvms-4.html#jvms-4.1</a></p><p>[2]</p><p><a href="http://openjdk.java.net/projects/code-tools/" target="_blank" rel="noreferrer">http://openjdk.java.net/projects/code-tools/</a></p><p>[3]</p><p><a href="https://wiki.openjdk.java.net/display/CodeTools/asmtools" target="_blank" rel="noreferrer">https://wiki.openjdk.java.net/display/CodeTools/asmtools</a></p><p>[4]</p><p><a href="https://adopt-openjdk.ci.cloudbees.com/view/OpenJDK/job/asmtools/lastSuccessfulBuild/artifact/asmtools-6.0.tar.gz" target="_blank" rel="noreferrer">https://adopt-openjdk.ci.cloudbees.com/view/OpenJDK/job/asmtools/lastSuccessfulBuild/artifact/asmtools-6.0.tar.gz</a></p><p>[5]</p><p><a href="https://cs.au.dk/~mis/dOvs/jvmspec/ref--21.html" target="_blank" rel="noreferrer">https://cs.au.dk/~mis/dOvs/jvmspec/ref--21.html</a></p><p>[6]</p><p><a href="http://openjdk.java.net/projects/code-tools/jol/" target="_blank" rel="noreferrer">http://openjdk.java.net/projects/code-tools/jol/</a></p><p>[7]</p><p><a href="http://central.maven.org/maven2/org/openjdk/jol/jol-cli/0.9/jol-cli-0.9-full.jar" target="_blank" rel="noreferrer">http://central.maven.org/maven2/org/openjdk/jol/jol-cli/0.9/jol-cli-0.9-full.jar</a></p><p>[8]</p><p><a href="https://asm.ow2.io/" target="_blank" rel="noreferrer">https://asm.ow2.io/</a></p><p>[9]</p><p><a href="https://repository.ow2.org/nexus/content/repositories/releases/org/ow2/asm/asm-all/6.0_BETA/asm-all-6.0_BETA.jar" target="_blank" rel="noreferrer">https://repository.ow2.org/nexus/content/repositories/releases/org/ow2/asm/asm-all/6.0_BETA/asm-all-6.0_BETA.jar</a></p><p>[10]</p><p><a href="http://web.cs.ucla.edu/~msb/cs239-tutorial/" target="_blank" rel="noreferrer">http://web.cs.ucla.edu/~msb/cs239-tutorial/</a></p>`,96)])])}const h=a(e,[["render",i]]);export{u as __pageData,h as default};
