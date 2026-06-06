import{_ as a,H as s,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const v=JSON.parse('{"title":"09 | JVM是怎么实现invokedynamic的？（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"invokedynamic指令","slug":"invokedynamic指令","link":"#invokedynamic指令","children":[]},{"level":2,"title":"Java 8的Lambda表达式","slug":"java-8的lambda表达式","link":"#java-8的lambda表达式","children":[]},{"level":2,"title":"Lambda以及方法句柄的性能分析","slug":"lambda以及方法句柄的性能分析","link":"#lambda以及方法句柄的性能分析","children":[]},{"level":2,"title":"总结与实践","slug":"总结与实践","link":"#总结与实践","children":[]}],"relativePath":"深入拆解Java虚拟机/09-JVM是怎么实现invokedynamic的？（下）.md","filePath":"深入拆解Java虚拟机/09-JVM是怎么实现invokedynamic的？（下）.md","lastUpdated":1779821039000}'),e={name:"深入拆解Java虚拟机/09-JVM是怎么实现invokedynamic的？（下）.md"};function i(t,n,c,o,r,d){return s(),p("div",null,[...n[0]||(n[0]=[l(`<h1 id="_09-jvm是怎么实现invokedynamic的-下" tabindex="-1">09 | JVM是怎么实现invokedynamic的？（下） <a class="header-anchor" href="#_09-jvm是怎么实现invokedynamic的-下" aria-label="Permalink to &quot;09 | JVM是怎么实现invokedynamic的？（下）&quot;">​</a></h1><p>上回讲到，为了让所有的动物都能参加赛马，Java 7引入了invokedynamic机制，允许调用任意类的“赛跑”方法。不过，我们并没有讲解invokedynamic，而是深入地探讨了它所依赖的方法句柄。</p><p>今天，我便来正式地介绍invokedynamic指令，讲讲它是如何生成调用点，并且允许应用程序自己决定链接至哪一个方法中的。</p><h2 id="invokedynamic指令" tabindex="-1">invokedynamic指令 <a class="header-anchor" href="#invokedynamic指令" aria-label="Permalink to &quot;invokedynamic指令&quot;">​</a></h2><p>invokedynamic是Java 7引入的一条新指令，用以支持动态语言的方法调用。具体来说，它将调用点（CallSite）抽象成一个Java类，并且将原本由Java虚拟机控制的方法调用以及方法链接暴露给了应用程序。在运行过程中，每一条invokedynamic指令将捆绑一个调用点，并且会调用该调用点所链接的方法句柄。</p><p>在第一次执行invokedynamic指令时，Java虚拟机会调用该指令所对应的启动方法（BootStrap Method），来生成前面提到的调用点，并且将之绑定至该invokedynamic指令中。在之后的运行过程中，Java虚拟机则会直接调用绑定的调用点所链接的方法句柄。</p><p>在字节码中，启动方法是用方法句柄来指定的。这个方法句柄指向一个返回类型为调用点的静态方法。该方法必须接收三个固定的参数，分别为一个Lookup类实例，一个用来指代目标方法名字的字符串，以及该调用点能够链接的方法句柄的类型。</p><p>除了这三个必需参数之外，启动方法还可以接收若干个其他的参数，用来辅助生成调用点，或者定位所要链接的目标方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.lang.invoke.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Horse {</span></span>
<span class="line"><span>  public void race() {</span></span>
<span class="line"><span>    System.out.println(&quot;Horse.race()&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Deer {</span></span>
<span class="line"><span>  public void race() {</span></span>
<span class="line"><span>    System.out.println(&quot;Deer.race()&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// javac Circuit.java</span></span>
<span class="line"><span>// java Circuit</span></span>
<span class="line"><span>public class Circuit {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void startRace(Object obj) {</span></span>
<span class="line"><span>    // aload obj</span></span>
<span class="line"><span>    // invokedynamic race()</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    startRace(new Horse());</span></span>
<span class="line"><span>    // startRace(new Deer());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static CallSite bootstrap(MethodHandles.Lookup l, String name, MethodType callSiteType) throws Throwable {</span></span>
<span class="line"><span>    MethodHandle mh = l.findVirtual(Horse.class, name, MethodType.methodType(void.class));</span></span>
<span class="line"><span>    return new ConstantCallSite(mh.asType(callSiteType));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我在文稿中贴了一段代码，其中便包含一个启动方法。它将接收前面提到的三个固定参数，并且返回一个链接至Horse.race方法的ConstantCallSite。</p><p>这里的ConstantCallSite是一种不可以更改链接对象的调用点。除此之外，Java核心类库还提供多种可以更改链接对象的调用点，比如MutableCallSite和VolatileCallSite。</p><p>这两者的区别就好比正常字段和volatile字段之间的区别。此外，应用程序还可以自定义调用点类，来满足特定的重链接需求。</p><p>由于Java暂不支持直接生成invokedynamic指令[1]，所以接下来我会借助之前介绍过的字节码工具ASM来实现这一目的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.io.IOException;</span></span>
<span class="line"><span>import java.lang.invoke.*;</span></span>
<span class="line"><span>import java.nio.file.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.objectweb.asm.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// javac -cp /path/to/asm-all-6.0_BETA.jar:. ASMHelper.java</span></span>
<span class="line"><span>// java -cp /path/to/asm-all-6.0_BETA.jar:. ASMHelper</span></span>
<span class="line"><span>// java Circuit</span></span>
<span class="line"><span>public class ASMHelper implements Opcodes {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static class MyMethodVisitor extends MethodVisitor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final String BOOTSTRAP_CLASS_NAME = Circuit.class.getName().replace(&#39;.&#39;, &#39;/&#39;);</span></span>
<span class="line"><span>    private static final String BOOTSTRAP_METHOD_NAME = &quot;bootstrap&quot;;</span></span>
<span class="line"><span>    private static final String BOOTSTRAP_METHOD_DESC = MethodType</span></span>
<span class="line"><span>        .methodType(CallSite.class, MethodHandles.Lookup.class, String.class, MethodType.class)</span></span>
<span class="line"><span>        .toMethodDescriptorString();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final String TARGET_METHOD_NAME = &quot;race&quot;;</span></span>
<span class="line"><span>    private static final String TARGET_METHOD_DESC = &quot;(Ljava/lang/Object;)V&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final MethodVisitor mv;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyMethodVisitor(int api, MethodVisitor mv) {</span></span>
<span class="line"><span>      super(api);</span></span>
<span class="line"><span>      this.mv = mv;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void visitCode() {</span></span>
<span class="line"><span>      mv.visitCode();</span></span>
<span class="line"><span>      mv.visitVarInsn(ALOAD, 0);</span></span>
<span class="line"><span>      Handle h = new Handle(H_INVOKESTATIC, BOOTSTRAP_CLASS_NAME, BOOTSTRAP_METHOD_NAME, BOOTSTRAP_METHOD_DESC, false);</span></span>
<span class="line"><span>      mv.visitInvokeDynamicInsn(TARGET_METHOD_NAME, TARGET_METHOD_DESC, h);</span></span>
<span class="line"><span>      mv.visitInsn(RETURN);</span></span>
<span class="line"><span>      mv.visitMaxs(1, 1);</span></span>
<span class="line"><span>      mv.visitEnd();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws IOException {</span></span>
<span class="line"><span>    ClassReader cr = new ClassReader(&quot;Circuit&quot;);</span></span>
<span class="line"><span>    ClassWriter cw = new ClassWriter(cr, ClassWriter.COMPUTE_FRAMES);</span></span>
<span class="line"><span>    ClassVisitor cv = new ClassVisitor(ASM6, cw) {</span></span>
<span class="line"><span>      @Override</span></span>
<span class="line"><span>      public MethodVisitor visitMethod(int access, String name, String descriptor, String signature,</span></span>
<span class="line"><span>          String[] exceptions) {</span></span>
<span class="line"><span>        MethodVisitor visitor = super.visitMethod(access, name, descriptor, signature, exceptions);</span></span>
<span class="line"><span>        if (&quot;startRace&quot;.equals(name)) {</span></span>
<span class="line"><span>          return new MyMethodVisitor(ASM6, visitor);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return visitor;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    cr.accept(cv, ClassReader.SKIP_FRAMES);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Files.write(Paths.get(&quot;Circuit.class&quot;), cw.toByteArray());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你无需理解上面这段代码的具体含义，只须了解它会更改同一目录下Circuit类的startRace(Object)方法，使之包含invokedynamic指令，执行所谓的赛跑方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> public static void startRace(java.lang.Object);</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: invokedynamic #80,  0 // race:(Ljava/lang/Object;)V</span></span>
<span class="line"><span>         6: return</span></span></code></pre></div><p>如果你足够细心的话，你会发现该指令所调用的赛跑方法的描述符，和Horse.race方法或者Deer.race方法的描述符并不一致。这是因为invokedynamic指令最终调用的是方法句柄，而方法句柄会将调用者当成第一个参数。因此，刚刚提到的那两个方法恰恰符合这个描述符所对应的方法句柄类型。</p><p>到目前为止，我们已经可以通过invokedynamic调用Horse.race方法了。为了支持调用任意类的race方法，我实现了一个简单的单态内联缓存。如果调用者的类型命中缓存中的类型，便直接调用缓存中的方法句柄，否则便更新缓存。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 需要更改ASMHelper.MyMethodVisitor中的BOOTSTRAP_CLASS_NAME</span></span>
<span class="line"><span>import java.lang.invoke.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MonomorphicInlineCache {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private final MethodHandles.Lookup lookup;</span></span>
<span class="line"><span>  private final String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public MonomorphicInlineCache(MethodHandles.Lookup lookup, String name) {</span></span>
<span class="line"><span>    this.lookup = lookup;</span></span>
<span class="line"><span>    this.name = name;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private Class&lt;?&gt; cachedClass = null;</span></span>
<span class="line"><span>  private MethodHandle mh = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void invoke(Object receiver) throws Throwable {</span></span>
<span class="line"><span>    if (cachedClass != receiver.getClass()) {</span></span>
<span class="line"><span>      cachedClass = receiver.getClass();</span></span>
<span class="line"><span>      mh = lookup.findVirtual(cachedClass, name, MethodType.methodType(void.class));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    mh.invoke(receiver);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static CallSite bootstrap(MethodHandles.Lookup l, String name, MethodType callSiteType) throws Throwable {</span></span>
<span class="line"><span>    MonomorphicInlineCache ic = new MonomorphicInlineCache(l, name);</span></span>
<span class="line"><span>    MethodHandle mh = l.findVirtual(MonomorphicInlineCache.class, &quot;invoke&quot;, MethodType.methodType(void.class, Object.class));</span></span>
<span class="line"><span>    return new ConstantCallSite(mh.bindTo(ic));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，尽管invokedynamic指令调用的是所谓的race方法，但是实际上我返回了一个链接至名为“invoke”的方法的调用点。由于调用点仅要求方法句柄的类型能够匹配，因此这个链接是合法的。</p><p>不过，这正是invokedynamic的目的，也就是将调用点与目标方法的链接交由应用程序来做，并且依赖于应用程序对目标方法进行验证。所以，如果应用程序将赛跑方法链接至兔子的睡觉方法，那也只能怪应用程序自己了。</p><h2 id="java-8的lambda表达式" tabindex="-1">Java 8的Lambda表达式 <a class="header-anchor" href="#java-8的lambda表达式" aria-label="Permalink to &quot;Java 8的Lambda表达式&quot;">​</a></h2><p>在Java 8中，Lambda表达式也是借助invokedynamic来实现的。</p><p>具体来说，Java编译器利用invokedynamic指令来生成实现了函数式接口的适配器。这里的函数式接口指的是仅包括一个非default接口方法的接口，一般通过@FunctionalInterface注解。不过就算是没有使用该注解，Java编译器也会将符合条件的接口辨认为函数式接口。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int x = ..</span></span>
<span class="line"><span>IntStream.of(1, 2, 3).map(i -&gt; i * 2).map(i -&gt; i * x);</span></span></code></pre></div><p>举个例子，上面这段代码会对IntStream中的元素进行两次映射。我们知道，映射方法map所接收的参数是IntUnaryOperator（这是一个函数式接口）。也就是说，在运行过程中我们需要将i-&gt;i <em>2和i-&gt;i</em> x 这两个Lambda表达式转化成IntUnaryOperator的实例。这个转化过程便是由invokedynamic来实现的。</p><p>在编译过程中，Java编译器会对Lambda表达式进行解语法糖（desugar），生成一个方法来保存Lambda表达式的内容。该方法的参数列表不仅包含原本Lambda表达式的参数，还包含它所捕获的变量。(注：方法引用，如Horse::race，则不会生成生成额外的方法。)</p><p>在上面那个例子中，第一个Lambda表达式没有捕获其他变量，而第二个Lambda表达式（也就是i-&gt;i*x）则会捕获局部变量x。这两个Lambda表达式对应的方法如下所示。可以看到，所捕获的变量同样也会作为参数传入生成的方法之中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  // i -&gt; i * 2</span></span>
<span class="line"><span>  private static int lambda$0(int);</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: iload_0</span></span>
<span class="line"><span>       1: iconst_2</span></span>
<span class="line"><span>       2: imul</span></span>
<span class="line"><span>       3: ireturn</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // i -&gt; i * x</span></span>
<span class="line"><span>  private static int lambda$1(int, int);</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: iload_1</span></span>
<span class="line"><span>       1: iload_0</span></span>
<span class="line"><span>       2: imul</span></span>
<span class="line"><span>       3: ireturn</span></span></code></pre></div><p>第一次执行invokedynamic指令时，它所对应的启动方法会通过ASM来生成一个适配器类。这个适配器类实现了对应的函数式接口，在我们的例子中，也就是IntUnaryOperator。启动方法的返回值是一个ConstantCallSite，其链接对象为一个返回适配器类实例的方法句柄。</p><p>根据Lambda表达式是否捕获其他变量，启动方法生成的适配器类以及所链接的方法句柄皆不同。</p><p>如果该Lambda表达式没有捕获其他变量，那么可以认为它是上下文无关的。因此，启动方法将新建一个适配器类的实例，并且生成一个特殊的方法句柄，始终返回该实例。</p><p>如果该Lambda表达式捕获了其他变量，那么每次执行该invokedynamic指令，我们都要更新这些捕获了的变量，以防止它们发生了变化。</p><p>另外，为了保证Lambda表达式的线程安全，我们无法共享同一个适配器类的实例。因此，在每次执行invokedynamic指令时，所调用的方法句柄都需要新建一个适配器类实例。</p><p>在这种情况下，启动方法生成的适配器类将包含一个额外的静态方法，来构造适配器类的实例。该方法将接收这些捕获的参数，并且将它们保存为适配器类实例的实例字段。</p><p>你可以通过虚拟机参数-Djdk.internal.lambda.dumpProxyClasses=/DUMP/PATH导出这些具体的适配器类。这里我导出了上面这个例子中两个Lambda表达式对应的适配器类。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// i-&gt;i*2 对应的适配器类</span></span>
<span class="line"><span>final class LambdaTest$$Lambda$1 implements IntUnaryOperator {</span></span>
<span class="line"><span> private LambdaTest$$Lambda$1();</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    0: aload_0</span></span>
<span class="line"><span>    1: invokespecial java/lang/Object.&quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>    4: return</span></span>
<span class="line"><span></span></span>
<span class="line"><span> public int applyAsInt(int);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    0: iload_1</span></span>
<span class="line"><span>    1: invokestatic LambdaTest.lambda$0:(I)I</span></span>
<span class="line"><span>    4: ireturn</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// i-&gt;i*x 对应的适配器类</span></span>
<span class="line"><span>final class LambdaTest$$Lambda$2 implements IntUnaryOperator {</span></span>
<span class="line"><span> private final int arg$1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> private LambdaTest$$Lambda$2(int);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    0: aload_0</span></span>
<span class="line"><span>    1: invokespecial java/lang/Object.&quot;&lt;​init&gt;&quot;:()V</span></span>
<span class="line"><span>    4: aload_0</span></span>
<span class="line"><span>    5: iload_1</span></span>
<span class="line"><span>    6: putfield arg$1:I</span></span>
<span class="line"><span>    9: return</span></span>
<span class="line"><span></span></span>
<span class="line"><span> private static java.util.function.IntUnaryOperator get$Lambda(int);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    0: new LambdaTest$$Lambda$2</span></span>
<span class="line"><span>    3: dup</span></span>
<span class="line"><span>    4: iload_0</span></span>
<span class="line"><span>    5: invokespecial &quot;&lt;​init&gt;&quot;:(I)V</span></span>
<span class="line"><span>    8: areturn</span></span>
<span class="line"><span></span></span>
<span class="line"><span> public int applyAsInt(int);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    0: aload_0</span></span>
<span class="line"><span>    1: getfield arg$1:I</span></span>
<span class="line"><span>    4: iload_1</span></span>
<span class="line"><span>    5: invokestatic LambdaTest.lambda$1:(II)I</span></span>
<span class="line"><span>    8: ireturn</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，捕获了局部变量的Lambda表达式多出了一个get$Lambda的方法。启动方法便会所返回的调用点链接至指向该方法的方法句柄。也就是说，每次执行invokedynamic指令时，都会调用至这个方法中，并构造一个新的适配器类实例。</p><p>这个多出来的新建实例会对程序性能造成影响吗？</p><h2 id="lambda以及方法句柄的性能分析" tabindex="-1">Lambda以及方法句柄的性能分析 <a class="header-anchor" href="#lambda以及方法句柄的性能分析" aria-label="Permalink to &quot;Lambda以及方法句柄的性能分析&quot;">​</a></h2><p>我再次请出测试反射调用性能开销的那段代码，并将其改造成使用Lambda表达式的v6版本。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// v6版本</span></span>
<span class="line"><span>import java.util.function.IntConsumer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>  public static void target(int i) { }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    long current = System.currentTimeMillis();</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= 2_000_000_000; i++) {</span></span>
<span class="line"><span>      if (i % 100_000_000 == 0) {</span></span>
<span class="line"><span>        long temp = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(temp - current);</span></span>
<span class="line"><span>        current = temp;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ((IntConsumer) j -&gt; Test.target(j)).accept(128);</span></span>
<span class="line"><span>      // ((IntConsumer) Test::target.accept(128);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测量结果显示，它与直接调用的性能并无太大的区别。也就是说，即时编译器能够将转换Lambda表达式所使用的invokedynamic，以及对IntConsumer.accept方法的调用统统内联进来，最终优化为空操作。</p><p>这个其实不难理解：Lambda表达式所使用的invokedynamic将绑定一个ConstantCallSite，其链接的目标方法无法改变。因此，即时编译器会将该目标方法直接内联进来。对于这类没有捕获变量的Lambda表达式而言，目标方法只完成了一个动作，便是加载缓存的适配器类常量。</p><p>另一方面，对IntConsumer.accept方法的调用实则是对适配器类的accept方法的调用。</p><p>如果你查看了accept方法对应的字节码的话，你会发现它仅包含一个方法调用，调用至Java编译器在解Lambda语法糖时生成的方法。</p><p>该方法的内容便是Lambda表达式的内容，也就是直接调用目标方法Test.target。将这几个方法调用内联进来之后，原本对accept方法的调用则会被优化为空操作。</p><p>下面我将之前的代码更改为带捕获变量的v7版本。理论上，每次调用invokedynamic指令，Java虚拟机都会新建一个适配器类的实例。然而，实际运行结果还是与直接调用的性能一致。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// v7版本</span></span>
<span class="line"><span>import java.util.function.IntConsumer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>  public static void target(int i) { }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    int x = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long current = System.currentTimeMillis();</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= 2_000_000_000; i++) {</span></span>
<span class="line"><span>      if (i % 100_000_000 == 0) {</span></span>
<span class="line"><span>        long temp = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(temp - current);</span></span>
<span class="line"><span>        current = temp;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ((IntConsumer) j -&gt; Test.target(x + j)).accept(128);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>显然，即时编译器的逃逸分析又将该新建实例给优化掉了。我们可以通过虚拟机参数-XX:-DoEscapeAnalysis来关闭逃逸分析。果然，这时候测得的值约为直接调用的2.5倍。</p><p>尽管逃逸分析能够去除这些额外的新建实例开销，但是它也不是时时奏效。它需要同时满足两件事：invokedynamic指令所执行的方法句柄能够内联，和接下来的对accept方法的调用也能内联。</p><p>只有这样，逃逸分析才能判定该适配器实例不逃逸。否则，我们会在运行过程中不停地生成适配器类实例。所以，我们应当尽量使用非捕获的Lambda表达式。</p><h2 id="总结与实践" tabindex="-1">总结与实践 <a class="header-anchor" href="#总结与实践" aria-label="Permalink to &quot;总结与实践&quot;">​</a></h2><p>今天我介绍了invokedynamic指令以及Lambda表达式的实现。</p><p>invokedymaic指令抽象出调用点的概念，并且将调用该调用点所链接的方法句柄。在第一次执行invokedynamic指令时，Java虚拟机将执行它所对应的启动方法，生成并且绑定一个调用点。之后如果再次执行该指令，Java虚拟机则直接调用已经绑定了的调用点所链接的方法。</p><p>Lambda表达式到函数式接口的转换是通过invokedynamic指令来实现的。该invokedynamic指令对应的启动方法将通过ASM生成一个适配器类。</p><p>对于没有捕获其他变量的Lambda表达式，该invokedynamic指令始终返回同一个适配器类的实例。对于捕获了其他变量的Lambda表达式，每次执行invokedynamic指令将新建一个适配器类实例。</p><p>不管是捕获型的还是未捕获型的Lambda表达式，它们的性能上限皆可以达到直接调用的性能。其中，捕获型Lambda表达式借助了即时编译器中的逃逸分析，来避免实际的新建适配器类实例的操作。</p><p>在上一篇的课后实践中，你应该测过这一段代码的性能开销了。我这边测得的结果约为直接调用的3.5倍。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// v8版本</span></span>
<span class="line"><span>import java.lang.invoke.MethodHandle;</span></span>
<span class="line"><span>import java.lang.invoke.MethodHandles;</span></span>
<span class="line"><span>import java.lang.invoke.MethodType;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>  public static void target(int i) { }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>    MethodHandles.Lookup l = MethodHandles.lookup();</span></span>
<span class="line"><span>    MethodType t = MethodType.methodType(void.class, int.class);</span></span>
<span class="line"><span>    MethodHandle mh = l.findStatic(Test.class, &quot;target&quot;, t);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long current = System.currentTimeMillis();</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= 2_000_000_000; i++) {</span></span>
<span class="line"><span>      if (i % 100_000_000 == 0) {</span></span>
<span class="line"><span>        long temp = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(temp - current);</span></span>
<span class="line"><span>        current = temp;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      mh.invokeExact(128);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>实际上，它与使用Lambda表达式或者方法引用的差别在于，即时编译器无法将该方法句柄识别为常量，从而无法进行内联。那么如果将它变成常量行不行呢？</p><p>一种方法便是将其赋值给final的静态变量，如下面的v9版本所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// v9版本</span></span>
<span class="line"><span>import java.lang.invoke.MethodHandle;</span></span>
<span class="line"><span>import java.lang.invoke.MethodHandles;</span></span>
<span class="line"><span>import java.lang.invoke.MethodType;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>  public static void target(int i) { }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static final MethodHandle mh;</span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      MethodHandles.Lookup l = MethodHandles.lookup();</span></span>
<span class="line"><span>      MethodType t = MethodType.methodType(void.class, int.class);</span></span>
<span class="line"><span>      mh = l.findStatic(Test.class, &quot;target&quot;, t);</span></span>
<span class="line"><span>    } catch (Throwable e) {</span></span>
<span class="line"><span>      throw new RuntimeException(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Throwable {</span></span>
<span class="line"><span>    long current = System.currentTimeMillis();</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= 2_000_000_000; i++) {</span></span>
<span class="line"><span>      if (i % 100_000_000 == 0) {</span></span>
<span class="line"><span>        long temp = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(temp - current);</span></span>
<span class="line"><span>        current = temp;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      mh.invokeExact(128);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个版本测得的数据和直接调用的性能数据一致。也就是说，即时编译器能够将该方法句柄完全内联进来，成为空操作。</p><p>今天的实践环节，我们来继续探索方法句柄的性能。运行下面的v10版本以及v11版本，比较它们的性能并思考为什么。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// v10版本</span></span>
<span class="line"><span>import java.lang.invoke.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>  public static void target(int i) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class MyCallSite {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final MethodHandle mh;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyCallSite() {</span></span>
<span class="line"><span>      mh = findTarget();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static MethodHandle findTarget() {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        MethodHandles.Lookup l = MethodHandles.lookup();</span></span>
<span class="line"><span>        MethodType t = MethodType.methodType(void.class, int.class);</span></span>
<span class="line"><span>        return l.findStatic(Test.class, &quot;target&quot;, t);</span></span>
<span class="line"><span>      } catch (Throwable e) {</span></span>
<span class="line"><span>        throw new RuntimeException(e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static final MyCallSite myCallSite = new MyCallSite();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Throwable {</span></span>
<span class="line"><span>    long current = System.currentTimeMillis();</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= 2_000_000_000; i++) {</span></span>
<span class="line"><span>      if (i % 100_000_000 == 0) {</span></span>
<span class="line"><span>        long temp = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(temp - current);</span></span>
<span class="line"><span>        current = temp;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      myCallSite.mh.invokeExact(128);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// v11版本</span></span>
<span class="line"><span>import java.lang.invoke.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>  public static void target(int i) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class MyCallSite extends ConstantCallSite {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyCallSite() {</span></span>
<span class="line"><span>      super(findTarget());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static MethodHandle findTarget() {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        MethodHandles.Lookup l = MethodHandles.lookup();</span></span>
<span class="line"><span>        MethodType t = MethodType.methodType(void.class, int.class);</span></span>
<span class="line"><span>        return l.findStatic(Test.class, &quot;target&quot;, t);</span></span>
<span class="line"><span>      } catch (Throwable e) {</span></span>
<span class="line"><span>        throw new RuntimeException(e);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static final MyCallSite myCallSite = new MyCallSite();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) throws Throwable {</span></span>
<span class="line"><span>    long current = System.currentTimeMillis();</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= 2_000_000_000; i++) {</span></span>
<span class="line"><span>      if (i % 100_000_000 == 0) {</span></span>
<span class="line"><span>        long temp = System.currentTimeMillis();</span></span>
<span class="line"><span>        System.out.println(temp - current);</span></span>
<span class="line"><span>        current = temp;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      myCallSite.getTarget().invokeExact(128);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>感谢你的收听，我们下次再见。</p><p>[1] <a href="http://openjdk.java.net/jeps/303" target="_blank" rel="noreferrer">http://openjdk.java.net/jeps/303</a></p>`,68)])])}const u=a(e,[["render",i]]);export{v as __pageData,u as default};
