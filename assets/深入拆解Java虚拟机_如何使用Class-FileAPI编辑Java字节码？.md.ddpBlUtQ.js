import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"如何使用Class-File API编辑Java字节码？","description":"","frontmatter":{},"headers":[{"level":2,"title":"Class-File API 的设计理念","slug":"class-file-api-的设计理念","link":"#class-file-api-的设计理念","children":[]},{"level":2,"title":"解析 Java 字节码","slug":"解析-java-字节码","link":"#解析-java-字节码","children":[]},{"level":2,"title":"生成 Java 字节码","slug":"生成-java-字节码","link":"#生成-java-字节码","children":[]},{"level":2,"title":"修改 Java 字节码","slug":"修改-java-字节码","link":"#修改-java-字节码","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"relativePath":"深入拆解Java虚拟机/如何使用Class-FileAPI编辑Java字节码？.md","filePath":"深入拆解Java虚拟机/如何使用Class-FileAPI编辑Java字节码？.md","lastUpdated":1779821039000}'),l={name:"深入拆解Java虚拟机/如何使用Class-FileAPI编辑Java字节码？.md"};function i(t,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="如何使用class-file-api编辑java字节码" tabindex="-1">如何使用Class-File API编辑Java字节码？ <a class="header-anchor" href="#如何使用class-file-api编辑java字节码" aria-label="Permalink to &quot;如何使用Class-File API编辑Java字节码？&quot;">​</a></h1><p>你好，我是郑雨迪。</p><p>关注 JDK 进展的同学们可能知道，Class-File API 是 JDK 22 引入的预览特性 <a href="https://openjdk.org/jeps/457" target="_blank" rel="noreferrer">[1]</a>。它与 ASM <a href="https://asm.ow2.io/" target="_blank" rel="noreferrer">[2]</a>、BCEL <a href="https://commons.apache.org/proper/commons-bcel/" target="_blank" rel="noreferrer">[3]</a> 和 Javassist <a href="https://www.javassist.org/" target="_blank" rel="noreferrer">[4]</a> 类似，都是用于分析、生成和修改 Java 字节码的工具。经过两个版本的迭代，这一 API 终于在 JDK 24 中正式发布。</p><p>这时，有人可能会疑惑：既然 JDK 已经内置了 ASM <a href="https://github.com/openjdk/jdk/tree/jdk23/src/java.base/share/classes/jdk/internal/org/objectweb/asm" target="_blank" rel="noreferrer">[5]</a>，为什么还要额外开发一个新的轮子？ 要回答这个问题，就必须了解 JDK 版本的更新机制以及字节码编辑工具的演进方式。</p><p>每当 JDK 版本升级，生成的类文件都会随之更新版本号，以便区分不同版本。例如，下面是 Foo.java 生成的字节码，其中，偏移量 6 处的两个字节表示该类文件的主版本号。在 JDK 23 中，这两个字节的值为 0x0043（Java 类文件采用 Big Endian 存储），而在 JDK 24 中，它变为 0x0044。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat Foo.java</span></span>
<span class="line"><span>public class Foo {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk23/bin/javac Foo.java</span></span>
<span class="line"><span>$ xxd Foo.class</span></span>
<span class="line"><span>00000000: cafe babe 0000 0043 000d 0a00 0200 0307  .......C........</span></span>
<span class="line"><span>00000010: 0004 0c00 0500 0601 0010 6a61 7661 2f6c  ..........java/l</span></span>
<span class="line"><span>00000020: 616e 672f 4f62 6a65 6374 0100 063c 696e  ang/Object...&lt;​in</span></span>
<span class="line"><span>00000030: 6974 3e01 0003 2829 5607 0008 0100 0346  it&gt;...()V......F</span></span>
<span class="line"><span>00000040: 6f6f 0100 0443 6f64 6501 000f 4c69 6e65  oo...Code...Line</span></span>
<span class="line"><span>00000050: 4e75 6d62 6572 5461 626c 6501 000a 536f  NumberTable...So</span></span>
<span class="line"><span>00000060: 7572 6365 4669 6c65 0100 0846 6f6f 2e6a  urceFile...Foo.j</span></span>
<span class="line"><span>00000070: 6176 6100 2100 0700 0200 0000 0000 0100  ava.!...........</span></span>
<span class="line"><span>00000080: 0100 0500 0600 0100 0900 0000 1d00 0100  ................</span></span>
<span class="line"><span>00000090: 0100 0000 052a b700 01b1 0000 0001 000a  .....*..........</span></span>
<span class="line"><span>000000a0: 0000 0006 0001 0000 0001 0001 000b 0000  ................</span></span>
<span class="line"><span>000000b0: 0002 000c                                ....</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/javac Foo.java</span></span>
<span class="line"><span>$ xxd Foo.class</span></span>
<span class="line"><span>00000000: cafe babe 0000 0044 000d 0a00 0200 0307  .......D........</span></span>
<span class="line"><span>00000010: 0004 0c00 0500 0601 0010 6a61 7661 2f6c  ..........java/l</span></span>
<span class="line"><span>00000020: 616e 672f 4f62 6a65 6374 0100 063c 696e  ang/Object...&lt;​in</span></span>
<span class="line"><span>00000030: 6974 3e01 0003 2829 5607 0008 0100 0346  it&gt;...()V......F</span></span>
<span class="line"><span>00000040: 6f6f 0100 0443 6f64 6501 000f 4c69 6e65  oo...Code...Line</span></span>
<span class="line"><span>00000050: 4e75 6d62 6572 5461 626c 6501 000a 536f  NumberTable...So</span></span>
<span class="line"><span>00000060: 7572 6365 4669 6c65 0100 0846 6f6f 2e6a  urceFile...Foo.j</span></span>
<span class="line"><span>00000070: 6176 6100 2100 0700 0200 0000 0000 0100  ava.!...........</span></span>
<span class="line"><span>00000080: 0100 0500 0600 0100 0900 0000 1d00 0100  ................</span></span>
<span class="line"><span>00000090: 0100 0000 052a b700 01b1 0000 0001 000a  .....*..........</span></span>
<span class="line"><span>000000a0: 0000 0006 0001 0000 0001 0001 000b 0000  ................</span></span>
<span class="line"><span>000000b0: 0002 000c                                ....</span></span></code></pre></div><p>由于新版本的 JDK 可能引入新的类文件格式，字节码编辑工具通常会维护一个支持的版本范围。当遇到超出支持范围的类文件时，这些工具往往会直接报错，以防止解析错误导致生成不合法的类文件。</p><p>为了减少因 JDK 版本间开发导致的 API 变更，字节码编辑工具通常会等到某一 JDK 版本正式发布后才开始适配新版本。如果 JDK 的更新涉及较大的字节码变更，这些工具的兼容性开发可能会持续数月。</p><p>因此，在 JDK 版本升级后，许多依赖字节码的应用和框架可能无法正常使用。比如 SpotBugs <a href="https://spotbugs.github.io/" target="_blank" rel="noreferrer">[6]</a> 这样依赖字节码解析的静态代码分析工具，以及 JaCoCo <a href="https://www.eclemma.org/jacoco/" target="_blank" rel="noreferrer">[7]</a> 这样依赖字节码注入的代码覆盖率工具。</p><p>JDK 本身也面临类似的问题，jar、jlink 等工具乃至 Lambda 表达式的相关类生成都依赖于 ASM 这一字节码编辑框架。由于 ASM 需要在 JDK 版本确定之后才能开始适配，而此时 JDK 已经进入下一个开发周期，这就导致 JDK 内部的工具无法解析新的类文件格式，进而使得 javac 也无法安全地生成这些新格式的类文件。</p><p>对于像 JDK 21 这样的长期支持版（LTS），这种情况尤为严重。LTS 版本承载着更长的维护周期，开发者对于稳定性和新特性的兼容支持有更高的期待。因此，在 LTS 版本开发周期之前的 JDK 版本中（如 JDK 20），通常会提前涌入大量相关提案，以确保 LTS 版本能够顺利支持新的类文件特性。</p><p>正是为了应对这些挑战，JDK 22 引入了 Class-File API。这个 API 设计的核心目标是与类文件格式同步演进，使得依赖它的其他组件能够自动适配最新的类文件格式，从而让新的语言特性和 JVM 特性能够被更快速、更便捷地采用。</p><h2 id="class-file-api-的设计理念" tabindex="-1">Class-File API 的设计理念 <a class="header-anchor" href="#class-file-api-的设计理念" aria-label="Permalink to &quot;Class-File API 的设计理念&quot;">​</a></h2><p><strong>Class-File API 的设计核心围绕抽象与效率两个方面展开。</strong></p><p>类文件中包含大量面向 JVM 的底层实现细节，例如常量池等。然而，对于 Java 字节码编辑工具的用户来说，这些细节并不重要。例如，用户关心的是一条 invokevirtual 指令调用的目标，而不是该目标在类文件中如何存储或索引。</p><p>Class-File API 通过不可变对象对这些关键信息进行抽象，并采用树形结构进行组织，使其更加直观和易于操作，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ClassModel</span></span>
<span class="line"><span> |- AccessFlags</span></span>
<span class="line"><span> |- Attribute[]</span></span>
<span class="line"><span> |- FieldModel[]</span></span>
<span class="line"><span>     |- AccessFlags</span></span>
<span class="line"><span>     |- Attribute[]</span></span>
<span class="line"><span> |- MethodModel[]</span></span>
<span class="line"><span>     |- AccessFlags</span></span>
<span class="line"><span>     |- Attribute[]</span></span>
<span class="line"><span>     |- CodeModel</span></span>
<span class="line"><span>         |- (Pseudo)Instruction[]</span></span></code></pre></div><p>Class-File API 为类、字段、方法以及方法内部的代码分别提供了对应的模型，分别称为 ClassModel、FieldModel、MethodModel 和 CodeModel。这些模型下的具体元素被称为 ClassElement、FieldElement、MethodElement 和 CodeElement，用于表示类文件中的各种元数据和属性。例如，在 FieldModel 中，访问标志（AccessFlags）和属性（Attribute）都属于 FieldElement。这些模型和元素构成了 Class-File API 处理类文件结构的核心抽象。</p><p>假设我们需要查找所有被 @Override 注解的方法，可以从 ClassModel 开始，遍历其 MethodModel 列表，然后再检查每个 MethodModel 的属性列表，筛选出注解相关的属性，并判断是否包含 @Override。</p><p>这种用户驱动的遍历方式使得 Class-File API 只需解析用户感兴趣的部分，而无需加载整个类文件的所有内容。例如，在上述案例中，我们无需处理字段相关数据，也不需要解析方法内部的具体字节码，因此这些部分会被跳过。 <strong>这样的惰性解析机制大幅提升了类文件分析的效率。</strong></p><p>除了用于表示类文件元数据和属性的抽象外，Class-File API 还提供了两个强大的概念：构建器（Builder）和转换器（Transform） 。构建器用于创建新的类文件结构，而转换器则用于描述字节码的修改过程。接下来，我们将通过具体案例，从解析、生成和修改三个角度介绍 Class-File API 的实际应用。</p><h2 id="解析-java-字节码" tabindex="-1">解析 Java 字节码 <a class="header-anchor" href="#解析-java-字节码" aria-label="Permalink to &quot;解析 Java 字节码&quot;">​</a></h2><p>首先，我们来看看如何使用 Class-File API 解析类文件。通常情况下，我们会拿到一个代表类文件的字节数组，比如 Java Agent 中的 ClassFileTransformer 接口就会提供这样的数据。通过一段简单的代码，我们就可以把这个字节数组解析为一个 ClassModel 对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ClassModel classModel = ClassFile.of().parse(bytes);</span></span></code></pre></div><p>拿到 ClassModel 之后，我们可以进一步遍历它的所有方法（MethodModel），再深入到方法中的代码块（CodeModel），从而获取到每一条字节码指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (MethodModel methodModel : classModel.methods()) {</span></span>
<span class="line"><span>    CodeModel codeModel = methodModel.code().orElseThrow();</span></span>
<span class="line"><span>    for (CodeElement instruction : codeModel) {</span></span>
<span class="line"><span>        // do something</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于这些指令，我们可以结合模式匹配来过滤出感兴趣的操作，并执行相应的逻辑处理。</p><p>举个例子，假如我们希望在代码里发现 System.out.println 语句时立刻报错，避免开发人员在生产环境中输出调试信息。由于 System.out 是一个静态字段，我们只需要关注 GETSTATIC 指令，然后判断它引用的字段是不是 System.out，如果是就触发告警。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (MethodModel methodModel : classModel.methods()) {</span></span>
<span class="line"><span>    CodeModel codeModel = methodModel.code().orElseThrow();</span></span>
<span class="line"><span>    for (CodeElement instruction : codeModel) {</span></span>
<span class="line"><span>        switch (instruction) {</span></span>
<span class="line"><span>            case FieldInstruction fi when fi.opcode() == Opcode.GETSTATIC</span></span>
<span class="line"><span>                    &amp;&amp; &quot;java/lang/System&quot;.equals(fi.owner().asInternalName())</span></span>
<span class="line"><span>                    &amp;&amp; &quot;out&quot;.equals(fi.name().stringValue()) -&gt;</span></span>
<span class="line"><span>                                System.err.printf(&quot;using System.out\\n&quot;);</span></span>
<span class="line"><span>            default -&gt; { }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>除此之外，我们还可以结合 ClassModel 和 CodeModel 中的其他元信息，把分析结果输出得更加详细完整，比如记录具体的文件名、行号等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String sourceFile = classModel.findAttribute(Attributes.sourceFile()).orElseThrow().sourceFile().toString();</span></span>
<span class="line"><span>int lineNo = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for (MethodModel methodModel : classModel.methods()) {</span></span>
<span class="line"><span>    CodeModel codeModel = methodModel.code().orElseThrow();</span></span>
<span class="line"><span>    for (CodeElement instruction : codeModel) {</span></span>
<span class="line"><span>        switch (instruction) {</span></span>
<span class="line"><span>            case LineNumber line -&gt; lineNo = line.line();</span></span>
<span class="line"><span>            case FieldInstruction fi when fi.opcode() == Opcode.GETSTATIC</span></span>
<span class="line"><span>                                       &amp;&amp; &quot;java/lang/System&quot;.equals(fi.owner().asInternalName())</span></span>
<span class="line"><span>                                       &amp;&amp; &quot;out&quot;.equals(fi.name().stringValue()) -&gt;</span></span>
<span class="line"><span>                System.err.printf(&quot;%s:%d is using System.out\\n&quot;, sourceFile, lineNo);</span></span>
<span class="line"><span>            default -&gt; { }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些逻辑同样可以用更函数式的方式来表达，比如结合 Stream API，把遍历、过滤和处理操作串联起来，代码会更加简洁优雅。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String sourceFile = classModel.findAttribute(Attributes.sourceFile()).orElseThrow().sourceFile().toString();</span></span>
<span class="line"><span>AtomicInteger lineNo = new AtomicInteger(-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>classModel.methods()</span></span>
<span class="line"><span>          .stream()</span></span>
<span class="line"><span>          .map(MethodModel::code)</span></span>
<span class="line"><span>          .flatMap(Optional::stream)</span></span>
<span class="line"><span>          .flatMap(CodeModel::elementStream)</span></span>
<span class="line"><span>          .forEach(i -&gt; {</span></span>
<span class="line"><span>              switch (i) {</span></span>
<span class="line"><span>                  case LineNumber line -&gt; lineNo.set(line.line());</span></span>
<span class="line"><span>                  case FieldInstruction fi when fi.opcode() == Opcode.GETSTATIC</span></span>
<span class="line"><span>                                             &amp;&amp; &quot;java/lang/System&quot;.equals(fi.owner().asInternalName())</span></span>
<span class="line"><span>                                             &amp;&amp; &quot;out&quot;.equals(fi.name().stringValue()) -&gt;</span></span>
<span class="line"><span>                          System.err.printf(&quot;%s:%d is using System.out\\n&quot;, sourceFile, lineNo.get());</span></span>
<span class="line"><span>                  default -&gt; { }</span></span>
<span class="line"><span>              }</span></span>
<span class="line"><span>          });</span></span></code></pre></div><p>如果把这段逻辑封装到一个 Java Agent 里，我们就可以对所有加载的类进行监控，检测它们是否包含 System.out.println 语句。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat MyAgent.java</span></span>
<span class="line"><span>import java.lang.classfile.*;</span></span>
<span class="line"><span>import java.lang.classfile.instruction.*;</span></span>
<span class="line"><span>import java.lang.instrument.*;</span></span>
<span class="line"><span>import java.security.ProtectionDomain;</span></span>
<span class="line"><span>import java.util.Optional;</span></span>
<span class="line"><span>import java.util.concurrent.atomic.AtomicInteger;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyAgent implements ClassFileTransformer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void premain(String agentArgs, Instrumentation inst) {</span></span>
<span class="line"><span>        inst.addTransformer(new MyAgent());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public byte[] transform(ClassLoader loader, String className, Class&lt;?&gt; classBeingRedefined,</span></span>
<span class="line"><span>                            ProtectionDomain protectionDomain, byte[] bytes) {</span></span>
<span class="line"><span>        ClassModel classModel = ClassFile.of().parse(bytes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String sourceFile = classModel.findAttribute(Attributes.sourceFile()).orElseThrow().sourceFile().toString();</span></span>
<span class="line"><span>        AtomicInteger lineNo = new AtomicInteger(-1);</span></span>
<span class="line"><span>        classModel.methods()</span></span>
<span class="line"><span>                  .stream()</span></span>
<span class="line"><span>                  .map(MethodModel::code)</span></span>
<span class="line"><span>                  .flatMap(Optional::stream)</span></span>
<span class="line"><span>                  .flatMap(CodeModel::elementStream)</span></span>
<span class="line"><span>                  .forEach(i -&gt; {</span></span>
<span class="line"><span>                      switch (i) {</span></span>
<span class="line"><span>                          case LineNumber line -&gt; lineNo.set(line.line());</span></span>
<span class="line"><span>                          case FieldInstruction fi when fi.opcode() == Opcode.GETSTATIC</span></span>
<span class="line"><span>                                                     &amp;&amp; &quot;java/lang/System&quot;.equals(fi.owner().asInternalName())</span></span>
<span class="line"><span>                                                     &amp;&amp; &quot;out&quot;.equals(fi.name().stringValue()) -&gt;</span></span>
<span class="line"><span>                                  System.err.printf(&quot;%s:%d is using System.out\\n&quot;, sourceFile, lineNo.get());</span></span>
<span class="line"><span>                          default -&gt; { }</span></span>
<span class="line"><span>                      }</span></span>
<span class="line"><span>                  });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return bytes;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/javac MyAgent.java</span></span>
<span class="line"><span>$ cat MANIFEST.MF</span></span>
<span class="line"><span>Manifest-Version: 1.0</span></span>
<span class="line"><span>Premain-Class: MyAgent</span></span>
<span class="line"><span>Agent-Class: MyAgent</span></span>
<span class="line"><span>Can-Redefine-Classes: true</span></span>
<span class="line"><span>Can-Retransform-Classes: true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/jar cmf MANIFEST.MF myagent.jar MyAgent.class</span></span>
<span class="line"><span>$ cat Foo.java</span></span>
<span class="line"><span>public class Foo {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    System.out.println(&quot;hello, world&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/java -javaagent:myagent.jar Foo.java</span></span>
<span class="line"><span>LauncherHelper.java:602 is using System.out</span></span>
<span class="line"><span>LauncherHelper.java:1189 is using System.out</span></span>
<span class="line"><span>LauncherHelper.java:1200 is using System.out</span></span>
<span class="line"><span>LauncherHelper.java:1215 is using System.out</span></span>
<span class="line"><span>ThreadLocal.java:825 is using System.out</span></span>
<span class="line"><span>ThreadLocal.java:827 is using System.out</span></span>
<span class="line"><span>Log.java:289 is using System.out</span></span>
<span class="line"><span>JavacFileManager.java:292 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1161 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1183 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1189 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1193 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1202 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1207 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1217 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1222 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1225 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1231 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1234 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1246 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1255 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1259 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1263 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1267 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1271 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1277 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1282 is using System.out</span></span>
<span class="line"><span>ClassWriter.java:1288 is using System.out</span></span>
<span class="line"><span>DocLint.java:125 is using System.out</span></span>
<span class="line"><span>Code.java:1834 is using System.out</span></span>
<span class="line"><span>Code.java:1836 is using System.out</span></span>
<span class="line"><span>Foo.java:3 is using System.out</span></span>
<span class="line"><span>hello, world</span></span></code></pre></div><p>运行之后我们会发现，不只是我们手写的 Foo.java 里的 hello, world 触发了告警，甚至连 JDK 自带的一些类也会被检测到，因为它们内部同样引用了 System.out。</p><p>除了这种被动式的告警检测，我们还可以进一步做一些主动干预，比如在字节码层面直接修改，把 out.print 替换为其他方法调用。要实现这种动态修改，首先需要了解 Class-File API 提供的字节码生成和构建能力，这也是字节码修改的基础。</p><h2 id="生成-java-字节码" tabindex="-1">生成 Java 字节码 <a class="header-anchor" href="#生成-java-字节码" aria-label="Permalink to &quot;生成 Java 字节码&quot;">​</a></h2><p>作为 JVM 即时编译器的开发人员，我们经常会碰到各种“非标准”的 Java 字节码模式。这些模式虽然无法通过常规的 javac 编译器生成，但依然能够通过 JVM 的字节码校验，并顺利执行。</p><p>对于即时编译器来说，这类字节码往往会带来巨大的挑战，甚至导致编译失败。比如，Google 的代码混淆工具 R8 和 Kotlin 编译器就会生成一些不规则的异常捕获代码 <a href="https://github.com/oracle/graal/issues/6838" target="_blank" rel="noreferrer">[8]</a> <a href="https://github.com/oracle/graal/issues/10610" target="_blank" rel="noreferrer">[9]</a>。</p><p>为了测试和模拟这些特殊场景，我们需要直接生成对应的类文件。然而，这类字节码往往无法通过 javac 直接产出，而引入第三方库又可能带来开源协议等合规风险。因此，我们更倾向于使用字节码编辑工具来手动构建所需的类文件。</p><p>前面已经提到，Class-File API 提供了构建器（Builder）这一概念，允许我们从头创建新的类文件结构。针对每种模型，Class-File API 都定义了对应的构建器接口，比如：ClassBuilder、FieldBuilder、MethodBuilder 和 CodeBuilder。</p><p>这些构建器都是接口，不能直接实例化，而是通过其定义的方法一步步搭建类文件结构。例如，下面这段代码展示了如何使用 CodeBuilder 构建一段字节码指令流：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* output from javap</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>         0: iload_0</span></span>
<span class="line"><span>         1: iflt          7</span></span>
<span class="line"><span>         4: ldc           #5                  // int 65536</span></span>
<span class="line"><span>         6: ireturn</span></span>
<span class="line"><span>         7: iload_0</span></span>
<span class="line"><span>         8: invokestatic  #11                 // Method SubIntTest.callee:(S)I</span></span>
<span class="line"><span>        11: ireturn</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>// can be generated via</span></span>
<span class="line"><span>Consumer&lt;​CodeBuilder&gt; codeGen = b -&gt; {</span></span>
<span class="line"><span>    Label falseBranch = b.newLabel();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    b.iload(0)</span></span>
<span class="line"><span>     .iflt(falseBranch)</span></span>
<span class="line"><span>     .ldc(65536)</span></span>
<span class="line"><span>     .ireturn()</span></span>
<span class="line"><span>     .labelBinding(falseBranch)</span></span>
<span class="line"><span>     .iload(0)</span></span>
<span class="line"><span>     .invokestatic(ClassDesc.of(&quot;SubIntTest&quot;), &quot;callee&quot;, MethodTypeDesc.of(CD_int, CD_short))</span></span>
<span class="line"><span>     .ireturn();</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>个人认为，Class-File API 最吸引人的地方在于，它构建字节码的方式与实际的字节码非常接近，可读性远远高于 ASM 那一套层层嵌套的 visit 方法。当然，如果你不熟悉 Java 字节码的控制流指令，或者不想手动维护跳转标签，Class-File API 还提供了更高层的封装，比如 ifThenElse 方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Consumer&lt;​CodeBuilder&gt; codeGen = b -&gt; {</span></span>
<span class="line"><span>    b.iload(0)</span></span>
<span class="line"><span>     .ifThenElse(Opcode.IFGE, thenBlock -&gt; {</span></span>
<span class="line"><span>         thenBlock.ldc(65536)</span></span>
<span class="line"><span>                  .ireturn();</span></span>
<span class="line"><span>     }, elseBlock -&gt; {</span></span>
<span class="line"><span>         elseBlock.iload(0)</span></span>
<span class="line"><span>                  .invokestatic(ClassDesc.of(&quot;SubIntTest&quot;), &quot;callee&quot;, MethodTypeDesc.of(CD_int, CD_short))</span></span>
<span class="line"><span>                  .ireturn();</span></span>
<span class="line"><span>     });</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>而后，我们可以逐级通过下层构建器构造上层构建器，最终形成一个针对顶层 ClassBuilder 的消费函数。这段函数代码作为 ClassFile.build 的参数，就可以生成代表目标类文件的字节数组，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Consumer&lt;​MethodBuilder&gt; methodGen = m -&gt; m.withCode(codeGen);</span></span>
<span class="line"><span>Consumer&lt;​ClassBuilder&gt; classGen = c -&gt; c.withMethod(&quot;get&quot;, MethodTypeDesc.of(CD_int, CD_byte), ACC_PUBLIC | ACC_STATIC, methodGen);</span></span>
<span class="line"><span>// is equivalent to</span></span>
<span class="line"><span>Consumer&lt;​ClassBuilder&gt; classGen1 = c -&gt; c.withMethodBody(&quot;get&quot;, MethodTypeDesc.of(CD_int, CD_byte), ACC_PUBLIC | ACC_STATIC, codeGen);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>byte[] newClass = ClassFile.of().build(ClassDesc.of(className), classGen1);</span></span></code></pre></div><p>得到的字节数组可以直接保存为 .class 文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat UntrustedClassGen.java</span></span>
<span class="line"><span>import static java.lang.classfile.ClassFile.ACC_PUBLIC;</span></span>
<span class="line"><span>import static java.lang.classfile.ClassFile.ACC_STATIC;</span></span>
<span class="line"><span>import static java.lang.constant.ConstantDescs.CD_int;</span></span>
<span class="line"><span>import static java.lang.constant.ConstantDescs.CD_short;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static void main(String[] args) throws IOException {</span></span>
<span class="line"><span>    byte[] bytes = ClassFile.of().build(ClassDesc.of(&quot;UntrustedClass&quot;), classBuilder -&gt; classBuilder</span></span>
<span class="line"><span>            .withMethodBody(&quot;illegal&quot;, MethodTypeDesc.of(CD_short, CD_int), ACC_PUBLIC | ACC_STATIC, b -&gt; {</span></span>
<span class="line"><span>                b.iload(0)</span></span>
<span class="line"><span>                 .ifThenElse(Opcode.IFGE, thenBlock -&gt; {</span></span>
<span class="line"><span>                     thenBlock.ldc(65536)</span></span>
<span class="line"><span>                              .ireturn();</span></span>
<span class="line"><span>                 }, elseBlock -&gt; {</span></span>
<span class="line"><span>                     elseBlock.iload(0)</span></span>
<span class="line"><span>                              .invokestatic(ClassDesc.of(&quot;SubIntTest&quot;), &quot;callee&quot;, MethodTypeDesc.of(CD_int, CD_short))</span></span>
<span class="line"><span>                              .ireturn();</span></span>
<span class="line"><span>                 });</span></span>
<span class="line"><span>            }));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    File classfile = new File(&quot;.&quot;, &quot;UntrustedClass.class&quot;);</span></span>
<span class="line"><span>    Files.write(classfile.toPath(), bytes);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/java --enable-preview UntrustedClassGen.java</span></span>
<span class="line"><span>$ jdk24/bin/javap -c -p  UntrustedClass.class</span></span>
<span class="line"><span>public class UntrustedClass {</span></span>
<span class="line"><span>  public static short illegal(int);</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>         0: iload_0</span></span>
<span class="line"><span>         1: iflt          7</span></span>
<span class="line"><span>         4: ldc           #5                  // int 65536</span></span>
<span class="line"><span>         6: ireturn</span></span>
<span class="line"><span>         7: iload_0</span></span>
<span class="line"><span>         8: invokestatic  #11                 // Method SubIntTest.callee:(S)I</span></span>
<span class="line"><span>        11: ireturn</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>生成的类文件可以被加载使用。比如下面这个例子，javac 编译后会在当前目录生成 SubIntTest.class 和 UntrustedClass.class。此时运行 SubIntTest 不会抛出异常。但如果我们执行 UntrustedClassGen，UntrustedClass.class 会被覆盖为我们生成的新版本，再次运行 SubIntTest 就会触发异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat SubIntTest.java</span></span>
<span class="line"><span>class UntrustedClass {</span></span>
<span class="line"><span>    public static short illegal(int i) {</span></span>
<span class="line"><span>        if (i &gt;= 0) {</span></span>
<span class="line"><span>            return (short) i;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return (short) SubIntTest.callee((short) i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SubIntTest {</span></span>
<span class="line"><span>    public static int callee(short s) {</span></span>
<span class="line"><span>        int i = s;</span></span>
<span class="line"><span>        if (i &gt; Short.MAX_VALUE || i &lt; Short.MIN_VALUE) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;callee&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void caller(int in) {</span></span>
<span class="line"><span>        int i = UntrustedClass.illegal(in);</span></span>
<span class="line"><span>        if (i &gt; Short.MAX_VALUE || i &lt; Short.MIN_VALUE) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;caller&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        System.out.println(&quot;caller(0)&quot;);</span></span>
<span class="line"><span>        caller(0);</span></span>
<span class="line"><span>        System.out.println(&quot;caller(-65536)&quot;);</span></span>
<span class="line"><span>        caller(-65536);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/java SubIntTest.java</span></span>
<span class="line"><span>caller(0)</span></span>
<span class="line"><span>caller(-65536)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/javac SubIntTest.java</span></span>
<span class="line"><span>$ jdk24/bin/java --enable-preview UntrustedClassGen.java</span></span>
<span class="line"><span>$ jdk24/bin/java SubIntTest</span></span>
<span class="line"><span>caller(0)</span></span>
<span class="line"><span>caller(-65536)</span></span>
<span class="line"><span>Exception in thread &quot;main&quot; java.lang.RuntimeException: callee</span></span>
<span class="line"><span>        at SubIntTest.callee(SubIntTest.java:16)</span></span>
<span class="line"><span>        at UntrustedClass.illegal(Unknown Source)</span></span>
<span class="line"><span>        at SubIntTest.caller(SubIntTest.java:22)</span></span>
<span class="line"><span>        at SubIntTest.main(SubIntTest.java:33)</span></span></code></pre></div><p>仔细分析这个例子不难发现，异常触发的条件非常特别：只有当 short 类型的参数或返回值超出其正常范围时，才会抛出异常。一般来说，IDE 的静态分析会认为这种情况不会发生，而后提示我们删除 SubIntTest.callee 和 SubIntTest.caller 中的多余条件判断。然而，这种静态分析并不符合实际情况。</p><p>这是因为我们手动构建的类文件中，故意让一个应返回 short 的方法返回了 65536（超过 short 范围）。但运行时并没有直接抛异常，这是因为 JVM 在方法返回时，会根据返回类型进行隐式的掩码操作，让返回值强制符合 short 的范围。</p><p>相反，我们在调用某个参数类型为 short 的方法时，传入了 -65536 这个超出范围的参数，这次运行时直接抛异常。说明 JVM 对于传入参数并没有像返回值那样执行隐式的掩码操作。</p><p>上述信息对即时编译器的设计至关重要：对于 boolean，byte，short，char 类型的参数来说，其静态类型信息不能简单等同于它的真实取值范围。因此，即时编译器不能贸然删除 SubIntTest.callee 中的 if 语句。</p><p>同时，在执行方法内联时，即时编译器还需要根据返回值类型手动补上掩码操作。只有做到这一点，我们才能让即时编译器生成代码的行为与 JVM 的解释执行保持完全一致。</p><h2 id="修改-java-字节码" tabindex="-1">修改 Java 字节码 <a class="header-anchor" href="#修改-java-字节码" aria-label="Permalink to &quot;修改 Java 字节码&quot;">​</a></h2><p>Class-File API 不仅提供了构建器用于生成新的类文件结构，还为每种模型定义了对应的转换器抽象，包括 ClassTransform、FieldTransform、MethodTransform 和 CodeTransform。转换器的设计与构建器的消费函数非常相似，唯一的区别是转换器额外接收一个表示原始元素的参数，这样可以保留和参考原有的类文件结构。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CodeTransform codeTransform = (codeBuilder, i) -&gt; {</span></span>
<span class="line"><span>    switch (i) {</span></span>
<span class="line"><span>        case InvokeInstruction i -&gt; codeBuilder.invoke(...);</span></span>
<span class="line"><span>        default -&gt; codeBuilder.accept(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MethodTransform methodTransform = MethodTransform.transformingCode(codeTransform);</span></span>
<span class="line"><span>ClassTransform classTransform = ClassTransform.transformingMethods(methodTransform);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ClassFile cf = ClassFile.of();</span></span>
<span class="line"><span>byte[] newClass = cf.transformClass(cf.parse(bytes), classTransform);</span></span></code></pre></div><p>比如在上述示例代码中，我们实现了一个 CodeTransform，它会检查每条指令，如果遇到特定的调用指令，就替换成其他调用指令；对于其他指令，则原样保留。类似的，这个转换器可以逐层向上组合，最终形成一个 ClassTransform，并作为参数传递给 ClassFile.transformClass，从而实现对原始类文件的修改。</p><p>回到前面解析 System.out.println 语句的案例，我们可以利用这种机制拦截对 PrintStream.println 的调用，并将其替换为自定义 Logger 的调用。最简单的做法就是直接用新的方法调用替代原有调用。</p><p>由于在执行 PrintStream.println 时，JVM 的操作数栈从栈顶到栈底依次为：String 和 PrintStream，因此我们只需要构造一个静态方法，反向接受这两个参数即可。下面是相关代码和运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ cat MyAgent.java</span></span>
<span class="line"><span>import java.io.PrintStream;</span></span>
<span class="line"><span>import java.lang.classfile.*;</span></span>
<span class="line"><span>import java.lang.classfile.constantpool.MemberRefEntry;</span></span>
<span class="line"><span>import java.lang.classfile.instruction.InvokeInstruction;</span></span>
<span class="line"><span>import java.lang.constant.*;</span></span>
<span class="line"><span>import java.lang.instrument.*;</span></span>
<span class="line"><span>import java.security.ProtectionDomain;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import static java.lang.constant.ConstantDescs.CD_String;</span></span>
<span class="line"><span>import static java.lang.constant.ConstantDescs.CD_void;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyAgent implements ClassFileTransformer {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void premain(String agentArgs, Instrumentation inst) {</span></span>
<span class="line"><span>        inst.addTransformer(new MyAgent());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public byte[] transform(ClassLoader loader, String className, Class&lt;?&gt; classBeingRedefined,</span></span>
<span class="line"><span>                            ProtectionDomain protectionDomain, byte[] bytes) {</span></span>
<span class="line"><span>        if (loader != null &amp;&amp; !&quot;MyLogger&quot;.equals(className)) {</span></span>
<span class="line"><span>            ClassFile cf = ClassFile.of();</span></span>
<span class="line"><span>            return cf.transformClass(cf.parse(bytes), ClassTransform.transformingMethodBodies((b, i) -&gt; {</span></span>
<span class="line"><span>                switch (i) {</span></span>
<span class="line"><span>                    case InvokeInstruction invoke when isPrintln(invoke.method()) -&gt;</span></span>
<span class="line"><span>                            b.invokestatic(ClassDesc.of(&quot;MyLogger&quot;),</span></span>
<span class="line"><span>                                    &quot;println&quot;,</span></span>
<span class="line"><span>                                    MethodTypeDesc.of(CD_void, PrintStream.class.describeConstable().orElseThrow(), CD_String));</span></span>
<span class="line"><span>                    default -&gt; b.accept(i);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return bytes;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static boolean isPrintln(MemberRefEntry method) {</span></span>
<span class="line"><span>        return &quot;java/io/PrintStream&quot;.equals(method.owner().asInternalName()) &amp;&amp;</span></span>
<span class="line"><span>                &quot;println&quot;.equals(method.name().stringValue()) &amp;&amp;</span></span>
<span class="line"><span>                &quot;(Ljava/lang/String;)V&quot;.equals(method.type().stringValue());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/javac MyAgent.java</span></span>
<span class="line"><span>$ cat MANIFEST.MF</span></span>
<span class="line"><span>Manifest-Version: 1.0</span></span>
<span class="line"><span>Premain-Class: MyAgent</span></span>
<span class="line"><span>Agent-Class: MyAgent</span></span>
<span class="line"><span>Can-Redefine-Classes: true</span></span>
<span class="line"><span>Can-Retransform-Classes: true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/jar cmf MANIFEST.MF myagent.jar MyAgent.class</span></span>
<span class="line"><span>$ cat Foo.java</span></span>
<span class="line"><span>public class Foo {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    System.out.println(&quot;hello, world&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyLogger {</span></span>
<span class="line"><span>  public static void println(java.io.PrintStream stream, String message) {</span></span>
<span class="line"><span>    if (stream == System.out) {</span></span>
<span class="line"><span>      System.err.println(&quot;err: &quot; + message);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ jdk24/bin/java -javaagent:myagent.jar Foo.java</span></span>
<span class="line"><span>err: hello, world</span></span></code></pre></div><p>值得注意的是，这里对修改的目标类做了过滤，比如排除了由引导类加载器加载的类，以避免对 JDK 核心类造成影响。同时，MyLogger 类本身也被排除，因为它的 println 方法中同样调用了 PrintStream.println，如果对它进行修改，就会触发递归调用，导致栈溢出。</p><p>这个例子只是针对 PrintStream.println(String) 进行了处理，有兴趣的同学还可以将其扩展到 PrintStream 的其他重载方法。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>Class-File API 的设计围绕两个关键词展开：抽象与效率。它屏蔽了类文件中的底层细节，如常量池等，将用户真正关心的内容抽象为不可变对象，并以树状结构组织起来。这种设计不仅让操作更直观，还提升了可读性和可靠性。</p><p>总体而言，Class-File API 为字节码工具的开发提供了新的可能，在比传统 ASM 更优雅、更易用的同时，降低了与 JDK 版本升级的兼容性风险。</p>`,69)])])}const m=a(l,[["render",i]]);export{g as __pageData,m as default};
