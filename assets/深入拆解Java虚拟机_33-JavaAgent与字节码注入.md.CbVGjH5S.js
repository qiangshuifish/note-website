import{_ as s,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"33 | Java Agent与字节码注入","description":"","frontmatter":{},"headers":[{"level":2,"title":"字节码注入","slug":"字节码注入","link":"#字节码注入","children":[]},{"level":2,"title":"基于字节码注入的profiler","slug":"基于字节码注入的profiler","link":"#基于字节码注入的profiler","children":[]},{"level":2,"title":"面向方面编程","slug":"面向方面编程","link":"#面向方面编程","children":[]},{"level":2,"title":"总结与实践","slug":"总结与实践","link":"#总结与实践","children":[]}],"relativePath":"深入拆解Java虚拟机/33-JavaAgent与字节码注入.md","filePath":"深入拆解Java虚拟机/33-JavaAgent与字节码注入.md","lastUpdated":1779821039000}'),t={name:"深入拆解Java虚拟机/33-JavaAgent与字节码注入.md"};function l(i,a,o,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="_33-java-agent与字节码注入" tabindex="-1">33 | Java Agent与字节码注入 <a class="header-anchor" href="#_33-java-agent与字节码注入" aria-label="Permalink to &quot;33 | Java Agent与字节码注入&quot;">​</a></h1><p>关于Java agent，大家可能都听过大名鼎鼎的 <code>premain</code> 方法。顾名思义，这个方法指的就是在 <code>main</code> 方法之前执行的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.example;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyAgent {</span></span>
<span class="line"><span>  public static void premain(String args) {</span></span>
<span class="line"><span>    System.out.println(&quot;premain&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我在上面这段代码中定义了一个 <code>premain</code> 方法。这里需要注意的是，Java虚拟机所能识别的 <code>premain</code> 方法接收的是字符串类型的参数，而并非类似于 <code>main</code> 方法的字符串数组。</p><p>为了能够以Java agent的方式运行该 <code>premain</code> 方法，我们需要将其打包成jar包，并在其中的MANIFEST.MF配置文件中，指定所谓的 <code>Premain-class</code>。具体的命令如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 注意第一条命令会向manifest.txt文件写入两行数据，其中包括一行空行</span></span>
<span class="line"><span>$ echo &#39;Premain-Class: org.example.MyAgent</span></span>
<span class="line"><span>&#39; &gt; manifest.txt</span></span>
<span class="line"><span>$ jar cvmf manifest.txt myagent.jar org/</span></span>
<span class="line"><span>$ java -javaagent:myagent.jar HelloWorld</span></span>
<span class="line"><span>premain</span></span>
<span class="line"><span>Hello, World</span></span></code></pre></div><p>除了在命令行中指定Java agent之外，我们还可以通过Attach API远程加载。具体用法如下面的代码所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.sun.tools.attach.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class AttachTest {</span></span>
<span class="line"><span>  public static void main(String[] args)</span></span>
<span class="line"><span>      throws AttachNotSupportedException, IOException, AgentLoadException, AgentInitializationException {</span></span>
<span class="line"><span>    if (args.length &lt;= 1) {</span></span>
<span class="line"><span>      System.out.println(&quot;Usage: java AttachTest &lt;​PID&gt; /PATH/TO/AGENT.jar&quot;);</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    VirtualMachine vm = VirtualMachine.attach(args[0]);</span></span>
<span class="line"><span>    vm.loadAgent(args[1]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用Attach API远程加载的Java agent不会再先于 <code>main</code> 方法执行，这取决于另一虚拟机调用Attach API的时机。并且，它运行的也不再是 <code>premain</code> 方法，而是名为 <code>agentmain</code> 的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyAgent {</span></span>
<span class="line"><span>  public static void agentmain(String args) {</span></span>
<span class="line"><span>    System.out.println(&quot;agentmain&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>相应的，我们需要更新jar包中的manifest文件，使其包含 <code>Agent-Class</code> 的配置，例如 <code>Agent-Class: org.example.MyAgent</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ echo &#39;Agent-Class: org.example.MyAgent</span></span>
<span class="line"><span>&#39; &gt; manifest.txt</span></span>
<span class="line"><span>$ jar cvmf manifest.txt myagent.jar org/</span></span>
<span class="line"><span>$ java HelloWorld</span></span>
<span class="line"><span>Hello, World</span></span>
<span class="line"><span>$ jps</span></span>
<span class="line"><span>$ java AttachTest &lt;​pid&gt; myagent.jar</span></span>
<span class="line"><span>agentmain</span></span>
<span class="line"><span>// 最后一句输出来自于运行HelloWorld的Java进程</span></span></code></pre></div><p>Java虚拟机并不限制Java agent的数量。你可以在java命令后附上多个 <code>-javaagent</code> 参数，或者远程attach多个Java agent，Java虚拟机会按照定义顺序，或者attach的顺序逐个执行这些Java agent。</p><p>在 <code>premain</code> 方法或者 <code>agentmain</code> 方法中打印一些字符串并不出奇，我们完全可以将其中的逻辑并入 <code>main</code> 方法，或者其他监听端口的线程中。除此之外，Java agent还提供了一套instrumentation机制，允许应用程序拦截类加载事件，并且更改该类的字节码。</p><p>接下来，我们来了解一下基于这一机制的字节码注入。</p><h2 id="字节码注入" tabindex="-1">字节码注入 <a class="header-anchor" href="#字节码注入" aria-label="Permalink to &quot;字节码注入&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.example;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.instrument.*;</span></span>
<span class="line"><span>import java.security.ProtectionDomain;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyAgent {</span></span>
<span class="line"><span>  public static void premain(String args, Instrumentation instrumentation) {</span></span>
<span class="line"><span>    instrumentation.addTransformer(new MyTransformer());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static class MyTransformer implements ClassFileTransformer {</span></span>
<span class="line"><span>    public byte[] transform(ClassLoader loader, String className, Class&lt;?&gt; classBeingRedefined,</span></span>
<span class="line"><span>        ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {</span></span>
<span class="line"><span>      System.out.printf(&quot;Loaded %s: 0x%X%X%X%X\\n&quot;, className, classfileBuffer[0], classfileBuffer[1],</span></span>
<span class="line"><span>          classfileBuffer[2], classfileBuffer[3]);</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们先来看一个例子。在上面这段代码中， <code>premain</code> 方法多出了一个 <code>Instrumentation</code> 类型的参数，我们可以通过它来注册类加载事件的拦截器。该拦截器需要实现 <code>ClassFileTransformer</code> 接口，并重写其中的 <code>transform</code> 方法。</p><p><code>transform</code> 方法将接收一个byte数组类型的参数，它代表的是正在被加载的类的字节码。在上面这段代码中，我将打印该数组的前四个字节，也就是Java class文件的魔数（magic number）0xCAFEBABE。</p><p><code>transform</code> 方法将返回一个byte数组，代表更新过后的类的字节码。当方法返回之后，Java虚拟机会使用所返回的byte数组，来完成接下来的类加载工作。不过，如果 <code>transform</code> 方法返回null或者抛出异常，那么Java虚拟机将使用原来的byte数组完成类加载工作。</p><p>基于这一类加载事件的拦截功能，我们可以实现字节码注入（bytecode instrumentation），往正在被加载的类中插入额外的字节码。</p><p>在工具篇中我曾经介绍过字节码工程框架ASM的用法。下面我将演示它的 <a href="https://search.maven.org/artifact/org.ow2.asm/asm-tree/7.0-beta/jar" target="_blank" rel="noreferrer">tree包</a>（依赖于 <a href="https://search.maven.org/artifact/org.ow2.asm/asm/7.0-beta/jar" target="_blank" rel="noreferrer">基础包</a>），用面向对象的方式注入字节码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.example;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.instrument.*;</span></span>
<span class="line"><span>import java.security.ProtectionDomain;</span></span>
<span class="line"><span>import org.objectweb.asm.*;</span></span>
<span class="line"><span>import org.objectweb.asm.tree.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyAgent {</span></span>
<span class="line"><span>  public static void premain(String args, Instrumentation instrumentation) {</span></span>
<span class="line"><span>    instrumentation.addTransformer(new MyTransformer());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static class MyTransformer implements ClassFileTransformer, Opcodes {</span></span>
<span class="line"><span>    public byte[] transform(ClassLoader loader, String className, Class&lt;?&gt; classBeingRedefined,</span></span>
<span class="line"><span>        ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {</span></span>
<span class="line"><span>      ClassReader cr = new ClassReader(classfileBuffer);</span></span>
<span class="line"><span>      ClassNode classNode = new ClassNode(ASM7);</span></span>
<span class="line"><span>      cr.accept(classNode, ClassReader.SKIP_FRAMES);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      for (MethodNode methodNode : classNode.methods) {</span></span>
<span class="line"><span>        if (&quot;main&quot;.equals(methodNode.name)) {</span></span>
<span class="line"><span>          InsnList instrumentation = new InsnList();</span></span>
<span class="line"><span>          instrumentation.add(new FieldInsnNode(GETSTATIC, &quot;java/lang/System&quot;, &quot;out&quot;, &quot;Ljava/io/PrintStream;&quot;));</span></span>
<span class="line"><span>          instrumentation.add(new LdcInsnNode(&quot;Hello, Instrumentation!&quot;));</span></span>
<span class="line"><span>          instrumentation</span></span>
<span class="line"><span>              .add(new MethodInsnNode(INVOKEVIRTUAL, &quot;java/io/PrintStream&quot;, &quot;println&quot;, &quot;(Ljava/lang/String;)V&quot;, false));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>          methodNode.instructions.insert(instrumentation);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES | ClassWriter.COMPUTE_MAXS);</span></span>
<span class="line"><span>      classNode.accept(cw);</span></span>
<span class="line"><span>      return cw.toByteArray();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面这段代码不难理解。我们将使用 <code>ClassReader</code> 读取所传入的byte数组，并将其转换成 <code>ClassNode</code>。然后我们将遍历 <code>ClassNode</code> 中的 <code>MethodNode</code> 节点，也就是该类中的构造器和方法。</p><p>当遇到名字为 <code>&quot;main&quot;</code> 的方法时，我们会在方法的入口处注入 <code>System.out.println(&quot;Hello, Instrumentation!&quot;);</code>。运行结果如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ java -javaagent:myagent.jar -cp .:/PATH/TO/asm-7.0-beta.jar:/PATH/TO/asm-tree-7.0-beta.jar HelloWorld</span></span>
<span class="line"><span>Hello, Instrumentation!</span></span>
<span class="line"><span>Hello, World!</span></span></code></pre></div><p>Java agent还提供了另外两个功能 <code>redefine</code> 和 <code>retransform</code>。这两个功能针对的是已加载的类，并要求用户传入所要 <code>redefine</code> 或者 <code>retransform</code> 的类实例。</p><p>其中， <code>redefine</code> 指的是舍弃原本的字节码，并替换成由用户提供的byte数组。该功能比较危险，一般用于修复出错了的字节码。</p><p><code>retransform</code> 则将针对所传入的类，重新调用所有已注册的 <code>ClassFileTransformer</code> 的 <code>transform</code> 方法。它的应用场景主要有如下两个。</p><p>第一，在执行 <code>premain</code> 或者 <code>agentmain</code> 方法前，Java虚拟机早已加载了不少类，而这些类的加载事件并没有被拦截，因此也没有被注入。使用 <code>retransform</code> 功能可以注入这些已加载但未注入的类。</p><p>第二，在定义了多个Java agent，多个注入的情况下，我们可能需要移除其中的部分注入。当调用 <code>Instrumentation.removeTransformer</code> 去除某个注入类后，我们可以调用 <code>retransform</code> 功能，重新从原始byte数组开始进行注入。</p><p>Java agent的这些功能都是通过JVMTI agent，也就是C agent来实现的。JVMTI是一个事件驱动的工具实现接口，通常，我们会在C agent加载后的入口方法 <code>Agent_OnLoad</code> 处注册各个事件的钩子（hook）方法。当Java虚拟机触发了这些事件时，便会调用对应的钩子方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>JNIEXPORT jint JNICALL</span></span>
<span class="line"><span>Agent_OnLoad(JavaVM *vm, char *options, void *reserved);</span></span></code></pre></div><p>举个例子，我们可以为JVMTI中的 <code>ClassFileLoadHook</code> 事件设置钩子，从而在C层面拦截所有的类加载事件。关于JVMTI的其他事件，你可以参考该 <a href="https://docs.oracle.com/en/java/javase/11/docs/specs/jvmti.html#EventIndex" target="_blank" rel="noreferrer">链接</a>。</p><h2 id="基于字节码注入的profiler" tabindex="-1">基于字节码注入的profiler <a class="header-anchor" href="#基于字节码注入的profiler" aria-label="Permalink to &quot;基于字节码注入的profiler&quot;">​</a></h2><p>我们可以利用字节码注入来实现代码覆盖工具（例如 <a href="https://www.jacoco.org/jacoco/" target="_blank" rel="noreferrer">JaCoCo</a>），或者各式各样的profiler。</p><p>通常，我们会定义一个运行时类，并在某一程序行为的周围，注入对该运行时类中方法的调用，以表示该程序行为正要发生或者已经发生。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.example;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.concurrent.ConcurrentHashMap;</span></span>
<span class="line"><span>import java.util.concurrent.atomic.AtomicInteger;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyProfiler {</span></span>
<span class="line"><span>  public static ConcurrentHashMap&lt;​Class&lt;?&gt;, AtomicInteger&gt; data = new ConcurrentHashMap&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void fireAllocationEvent(Class&lt;?&gt; klass) {</span></span>
<span class="line"><span>    data.computeIfAbsent(klass, kls -&gt; new AtomicInteger())</span></span>
<span class="line"><span>        .incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void dump() {</span></span>
<span class="line"><span>    data.forEach((kls, counter) -&gt; {</span></span>
<span class="line"><span>      System.err.printf(&quot;%s: %d\\n&quot;, kls.getName(), counter.get());</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    Runtime.getRuntime().addShutdownHook(new Thread(MyProfiler::dump));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>举个例子，上面这段代码便是一个运行时类。该类维护了一个 <code>HashMap</code>，用来统计每个类所新建实例的数目。当程序退出时，我们将逐个打印出每个类的名字，以及其新建实例的数目。</p><p>在Java agent中，我们会截获正在加载的类，并且在每条 <code>new</code> 字节码之后插入对 <code>fireAllocationEvent</code> 方法的调用，以表示当前正在新建某个类的实例。具体的注入代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package org.example;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.instrument.*;</span></span>
<span class="line"><span>import java.security.ProtectionDomain;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.objectweb.asm.*;</span></span>
<span class="line"><span>import org.objectweb.asm.tree.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MyAgent {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void premain(String args, Instrumentation instrumentation) {</span></span>
<span class="line"><span>    instrumentation.addTransformer(new MyTransformer());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static class MyTransformer implements ClassFileTransformer, Opcodes {</span></span>
<span class="line"><span>    public byte[] transform(ClassLoader loader, String className, Class&lt;?&gt; classBeingRedefined,</span></span>
<span class="line"><span>        ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {</span></span>
<span class="line"><span>      if (className.startsWith(&quot;java&quot;)    ||</span></span>
<span class="line"><span>          className.startsWith(&quot;javax&quot;)   ||</span></span>
<span class="line"><span>          className.startsWith(&quot;jdk&quot;)     ||</span></span>
<span class="line"><span>          className.startsWith(&quot;sun&quot;)     ||</span></span>
<span class="line"><span>          className.startsWith(&quot;com/sun&quot;) ||</span></span>
<span class="line"><span>          className.startsWith(&quot;org/example&quot;)) {</span></span>
<span class="line"><span>        // Skip JDK classes and profiler classes</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ClassReader cr = new ClassReader(classfileBuffer);</span></span>
<span class="line"><span>      ClassNode classNode = new ClassNode(ASM7);</span></span>
<span class="line"><span>      cr.accept(classNode, ClassReader.SKIP_FRAMES);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      for (MethodNode methodNode : classNode.methods) {</span></span>
<span class="line"><span>        for (AbstractInsnNode node : methodNode.instructions.toArray()) {</span></span>
<span class="line"><span>          if (node.getOpcode() == NEW) {</span></span>
<span class="line"><span>            TypeInsnNode typeInsnNode = (TypeInsnNode) node;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            InsnList instrumentation = new InsnList();</span></span>
<span class="line"><span>            instrumentation.add(new LdcInsnNode(Type.getObjectType(typeInsnNode.desc)));</span></span>
<span class="line"><span>            instrumentation.add(new MethodInsnNode(INVOKESTATIC, &quot;org/example/MyProfiler&quot;, &quot;fireAllocationEvent&quot;,</span></span>
<span class="line"><span>                &quot;(Ljava/lang/Class;)V&quot;, false));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            methodNode.instructions.insert(node, instrumentation);</span></span>
<span class="line"><span>          }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES | ClassWriter.COMPUTE_MAXS);</span></span>
<span class="line"><span>      classNode.accept(cw);</span></span>
<span class="line"><span>      return cw.toByteArray();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你或许已经留意到，我们不得不排除对JDK类以及该运行时类的注入。这是因为，对这些类的注入很可能造成死循环调用，并最终抛出 <code>StackOverflowException</code> 异常。</p><p>举个例子，假设我们在 <code>PrintStream.println</code> 方法入口处注入 <code>System.out.println(&quot;blahblah&quot;)</code>，由于 <code>out</code> 是 <code>PrintStream</code> 的实例，因此当执行注入代码时，我们又会调用 <code>PrintStream.println</code> 方法，从而造成死循环。</p><p>解决这一问题的关键在于设置一个线程私有的标识位，用以区分应用代码的上下文以及注入代码的上下文。当即将执行注入代码时，我们将根据标识位判断是否已经位于注入代码的上下文之中。如果不是，则设置标识位并正常执行注入代码；如果是，则直接返回，不再执行注入代码。</p><p>字节码注入的另一个技术难点则是命名空间。举个例子，不少应用程序都依赖于字节码工程库ASM。当我们的注入逻辑依赖于ASM时，便有可能出现注入使用最新版本的ASM，而应用程序使用较低版本的ASM的问题。</p><p>JDK本身也使用了ASM库，如用来生成Lambda表达式的适配器类。JDK的做法是重命名整个ASM库，为所有类的包名添加 <code>jdk.internal</code> 前缀。我们显然不好直接更改ASM的包名，因此需要借助自定义类加载器来隔离命名空间。</p><p>除了上述技术难点之外，基于字节码注入的工具还有另一个问题，那便是观察者效应（observer effect）对所收集的数据造成的影响。</p><p>举个利用字节码注入收集每个方法的运行时间的例子。假设某个方法调用了另一个方法，而这两个方法都被注入了，那么统计被调用者运行时间的注入代码所耗费的时间，将不可避免地被计入至调用者方法的运行时间之中。</p><p>再举一个统计新建对象数目的例子。我们知道，即时编译器中的逃逸分析可能会优化掉新建对象操作，但它不会消除相应的统计操作，比如上述例子中对 <code>fireAllocationEvent</code> 方法的调用。在这种情况下，我们将统计没有实际发生的新建对象操作。</p><p>另一种情况则是，我们所注入的对 <code>fireAllocationEvent</code> 方法的调用，将影响到方法内联的决策。如果该新建对象的构造器调用恰好因此没有被内联，从而造成对象逃逸。在这种情况下，原本能够被逃逸分析优化掉的新建对象操作将无法优化，我们也将统计到原本不会发生的新建对象操作。</p><p>总而言之，当使用字节码注入开发profiler时，需要辩证地看待所收集的数据。它仅能表示在被注入的情况下程序的执行状态，而非没有注入情况下的程序执行状态。</p><h2 id="面向方面编程" tabindex="-1">面向方面编程 <a class="header-anchor" href="#面向方面编程" aria-label="Permalink to &quot;面向方面编程&quot;">​</a></h2><p>说到字节码注入，就不得不提面向方面编程（Aspect-Oriented Programming，AOP）。面向方面编程的核心理念是定义切入点（pointcut）以及通知（advice）。程序控制流中所有匹配该切入点的连接点（joinpoint）都将执行这段通知代码。</p><p>举个例子，我们定义一个指代所有方法入口的切入点，并指定在该切入点执行的“打印该方法的名字”这一通知。那么每个具体的方法入口便是一个连接点。</p><p>面向方面编程的其中一种实现方式便是字节码注入，比如 <a href="https://www.eclipse.org/aspectj/" target="_blank" rel="noreferrer">AspectJ</a>。</p><p>在前面的例子中，我们也相当于使用了面向方面编程，在所有的 <code>new</code> 字节码之后执行了下面这样一段通知代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`MyProfiler.fireAllocationEvent(&lt;​Target&gt;.class)\`</span></span></code></pre></div><p>我曾经参与开发过一个应用了面向方面编程思想的字节码注入框架 <a href="https://disl.ow2.org/" target="_blank" rel="noreferrer">DiSL</a>。它支持用注解来定义切入点，用普通Java方法来定义通知。例如，在方法入口处打印所在的方法名，可以简单表示为如下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Before(marker = BodyMarker.class)</span></span>
<span class="line"><span>static void onMethodEntry(MethodStaticContext msc) {</span></span>
<span class="line"><span>  System.out.println(msc.thisMethodFullName());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果有同学对这个工具感兴趣，或者有什么需求或者建议，欢迎你在留言中提出。</p><h2 id="总结与实践" tabindex="-1">总结与实践 <a class="header-anchor" href="#总结与实践" aria-label="Permalink to &quot;总结与实践&quot;">​</a></h2><p>今天我介绍了Java agent以及字节码注入。</p><p>我们可以通过Java agent的类加载拦截功能，修改某个类所对应的byte数组，并利用这个修改过后的byte数组完成接下来的类加载。</p><p>基于字节码注入的profiler，可以统计程序运行过程中某些行为的出现次数。如果需要收集Java核心类库的数据，那么我们需要小心避免无限递归调用。另外，我们还需通过自定义类加载器来解决命名空间的问题。</p><p>由于字节码注入会产生观察者效应，因此基于该技术的profiler所收集到的数据并不能反映程序的真实运行状态。它所反映的是程序在被注入的情况下的执行状态。</p><hr><p>今天的实践环节，请你思考如何注入方法出口。除了正常执行路径之外，你还需考虑异常执行路径。</p>`,67)])])}const g=s(t,[["render",l]]);export{u as __pageData,g as default};
