import{_ as a,H as s,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"27 | 注解处理器","description":"","frontmatter":{},"headers":[{"level":2,"title":"注解处理器的原理","slug":"注解处理器的原理","link":"#注解处理器的原理","children":[]},{"level":2,"title":"利用注解处理器生成源代码","slug":"利用注解处理器生成源代码","link":"#利用注解处理器生成源代码","children":[]},{"level":2,"title":"总结与实践","slug":"总结与实践","link":"#总结与实践","children":[]}],"relativePath":"深入拆解Java虚拟机/27-注解处理器.md","filePath":"深入拆解Java虚拟机/27-注解处理器.md","lastUpdated":1779821039000}'),t={name:"深入拆解Java虚拟机/27-注解处理器.md"};function l(i,n,o,c,r,d){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="_27-注解处理器" tabindex="-1">27 | 注解处理器 <a class="header-anchor" href="#_27-注解处理器" aria-label="Permalink to &quot;27 | 注解处理器&quot;">​</a></h1><p>注解（annotation）是Java 5引入的，用来为类、方法、字段、参数等Java结构提供额外信息的机制。我先举个例子，比如，Java核心类库中的 <code>@Override</code> 注解是被用来声明某个实例方法重写了父类的同名同参数类型的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package java.lang;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Target(ElementType.METHOD)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.SOURCE)</span></span>
<span class="line"><span>public @interface Override {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>@Override</code> 注解本身被另外两个元注解（即作用在注解上的注解）所标注。其中， <code>@Target</code> 用来限定目标注解所能标注的Java结构，这里 <code>@Override</code> 便只能被用来标注方法。</p><p><code>@Retention</code> 则用来限定当前注解生命周期。注解共有三种不同的生命周期： <code>SOURCE</code>， <code>CLASS</code> 或 <code>RUNTIME</code>，分别表示注解只出现在源代码中，只出现在源代码和字节码中，以及出现在源代码、字节码和运行过程中。</p><p>这里 <code>@Override</code> 便只能出现在源代码中。一旦标注了 <code>@Override</code> 的方法所在的源代码被编译为字节码，该注解便会被擦除。</p><p>我们不难猜到， <code>@Override</code> 仅对Java编译器有用。事实上，它会为Java编译器引入了一条新的编译规则，即如果所标注的方法不是Java语言中的重写方法，那么编译器会报错。而当编译完成时，它的使命也就结束了。</p><p>我们知道，Java的注解机制允许开发人员自定义注解。这些自定义注解同样可以为Java编译器添加编译规则。不过，这种功能需要由开发人员提供，并且以插件的形式接入Java编译器中，这些插件我们称之为注解处理器（annotation processor）。</p><p>除了引入新的编译规则之外，注解处理器还可以用于修改已有的Java源文件（不推荐），或者生成新的Java源文件。下面，我将用几个案例来详细阐述注解处理器的这些功能，以及它背后的原理。</p><h2 id="注解处理器的原理" tabindex="-1">注解处理器的原理 <a class="header-anchor" href="#注解处理器的原理" aria-label="Permalink to &quot;注解处理器的原理&quot;">​</a></h2><p>在介绍注解处理器之前，我们先来了解一下Java编译器的工作流程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/40189/64e93f67c3b422afd90966bfe9aaf5b8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/images/40189/64e93f67c3b422afd90966bfe9aaf5b8.png" alt=""></a></p><p>如上图所示 出处[1]，Java源代码的编译过程可分为三个步骤：</p><ol><li>将源文件解析为抽象语法树；</li><li>调用已注册的注解处理器；</li><li>生成字节码。</li></ol><p>如果在第2步调用注解处理器过程中生成了新的源文件，那么编译器将重复第1、2步，解析并且处理新生成的源文件。每次重复我们称之为一轮（Round）。</p><p>也就是说，第一轮解析、处理的是输入至编译器中的已有源文件。如果注解处理器生成了新的源文件，则开始第二轮、第三轮，解析并且处理这些新生成的源文件。当注解处理器不再生成新的源文件，编译进入最后一轮，并最终进入生成字节码的第3步。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package foo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Target({ ElementType.TYPE, ElementType.FIELD })</span></span>
<span class="line"><span>@Retention(RetentionPolicy.SOURCE)</span></span>
<span class="line"><span>public @interface CheckGetter {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这段代码中，我定义了一个注解 <code>@CheckGetter</code>。它既可以用来标注类，也可以用来标注字段。此外，它和 <code>@Override</code> 相同，其生命周期被限定在源代码中。</p><p>下面我们来实现一个处理 <code>@CheckGetter</code> 注解的处理器。它将遍历被标注的类中的实例字段，并检查有没有相应的 <code>getter</code> 方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Processor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void init(ProcessingEnvironment processingEnv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Set&lt;​String&gt; getSupportedAnnotationTypes();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  SourceVersion getSupportedSourceVersion();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  boolean process(Set&lt;? extends TypeElement&gt; annotations, RoundEnvironment roundEnv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所有的注解处理器类都需要实现接口 <code>Processor</code>。该接口主要有四个重要方法。其中， <code>init</code> 方法用来存放注解处理器的初始化代码。之所以不用构造器，是因为在Java编译器中，注解处理器的实例是通过反射API生成的。也正是因为使用反射API，每个注解处理器类都需要定义一个无参数构造器。</p><p>通常来说，当编写注解处理器时，我们不声明任何构造器，并依赖于Java编译器，为之插入一个无参数构造器。而具体的初始化代码，则放入 <code>init</code> 方法之中。</p><p>在剩下的三个方法中， <code>getSupportedAnnotationTypes</code> 方法将返回注解处理器所支持的注解类型，这些注解类型只需用字符串形式表示即可。</p><p><code>getSupportedSourceVersion</code> 方法将返回该处理器所支持的Java版本，通常，这个版本需要与你的Java编译器版本保持一致；而 <code>process</code> 方法则是最为关键的注解处理方法。</p><p>JDK提供了一个实现 <code>Processor</code> 接口的抽象类 <code>AbstractProcessor</code>。该抽象类实现了 <code>init</code>、 <code>getSupportedAnnotationTypes</code> 和 <code>getSupportedSourceVersion</code> 方法。</p><p>它的子类可以通过 <code>@SupportedAnnotationTypes</code> 和 <code>@SupportedSourceVersion</code> 注解来声明所支持的注解类型以及Java版本。</p><p>下面这段代码便是 <code>@CheckGetter</code> 注解处理器的实现。由于我使用了Java 10的编译器，因此将支持版本设置为 <code>SourceVersion.RELEASE_10</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package bar;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Set;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.annotation.processing.*;</span></span>
<span class="line"><span>import javax.lang.model.SourceVersion;</span></span>
<span class="line"><span>import javax.lang.model.element.*;</span></span>
<span class="line"><span>import javax.lang.model.util.ElementFilter;</span></span>
<span class="line"><span>import javax.tools.Diagnostic.Kind;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import foo.CheckGetter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@SupportedAnnotationTypes(&quot;foo.CheckGetter&quot;)</span></span>
<span class="line"><span>@SupportedSourceVersion(SourceVersion.RELEASE_10)</span></span>
<span class="line"><span>public class CheckGetterProcessor extends AbstractProcessor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public boolean process(Set&lt;? extends TypeElement&gt; annotations, RoundEnvironment roundEnv) {</span></span>
<span class="line"><span>    // TODO: annotated ElementKind.FIELD</span></span>
<span class="line"><span>    for (TypeElement annotatedClass : ElementFilter.typesIn(roundEnv.getElementsAnnotatedWith(CheckGetter.class))) {</span></span>
<span class="line"><span>      for (VariableElement field : ElementFilter.fieldsIn(annotatedClass.getEnclosedElements())) {</span></span>
<span class="line"><span>        if (!containsGetter(annotatedClass, field.getSimpleName().toString())) {</span></span>
<span class="line"><span>          processingEnv.getMessager().printMessage(Kind.ERROR,</span></span>
<span class="line"><span>              String.format(&quot;getter not found for &#39;%s.%s&#39;.&quot;, annotatedClass.getSimpleName(), field.getSimpleName()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static boolean containsGetter(TypeElement typeElement, String name) {</span></span>
<span class="line"><span>    String getter = &quot;get&quot; + name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();</span></span>
<span class="line"><span>    for (ExecutableElement executableElement : ElementFilter.methodsIn(typeElement.getEnclosedElements())) {</span></span>
<span class="line"><span>      if (!executableElement.getModifiers().contains(Modifier.STATIC)</span></span>
<span class="line"><span>          &amp;&amp; executableElement.getSimpleName().toString().equals(getter)</span></span>
<span class="line"><span>          &amp;&amp; executableElement.getParameters().isEmpty()) {</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该注解处理器仅重写了 <code>process</code> 方法。这个方法将接收两个参数，分别代表该注解处理器所能处理的注解类型，以及囊括当前轮生成的抽象语法树的 <code>RoundEnvironment</code>。</p><p>由于该处理器针对的注解仅有 <code>@CheckGetter</code> 一个，而且我们并不会读取注解中的值，因此第一个参数并不重要。在代码中，我直接使用了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`roundEnv.getElementsAnnotatedWith(CheckGetter.class)\`</span></span></code></pre></div><p>来获取所有被 <code>@CheckGetter</code> 注解的类（以及字段）。</p><p><code>process</code> 方法涉及各种不同类型的 <code>Element</code>，分别指代Java程序中的各个结构。如 <code>TypeElement</code> 指代类或者接口， <code>VariableElement</code> 指代字段、局部变量、enum常量等， <code>ExecutableElement</code> 指代方法或者构造器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package foo;     // PackageElement</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Foo {      // TypeElement</span></span>
<span class="line"><span>  int a;           // VariableElement</span></span>
<span class="line"><span>  static int b;    // VariableElement</span></span>
<span class="line"><span>  Foo () {}        // ExecutableElement</span></span>
<span class="line"><span>  void setA (      // ExecutableElement</span></span>
<span class="line"><span>    int newA         // VariableElement</span></span>
<span class="line"><span>  ) {}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这些结构之间也有从属关系，如上面这段代码所示(出处[2]）。我们可以通过 <code>TypeElement.getEnclosedElements</code> 方法，获得上面这段代码中 <code>Foo</code> 类的字段、构造器以及方法。</p><p>我们也可以通过 <code>ExecutableElement.getParameters</code> 方法，获得 <code>setA</code> 方法的参数。具体这些 <code>Element</code> 类都有哪些API，你可以参考它们的Javadoc[3]。</p><p>在将该注解处理器编译成class文件后，我们便可以将其注册为Java编译器的插件，并用来处理其他源代码。注册的方法主要有两种。第一种是直接使用javac命令的 <code>-processor</code> 参数，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ javac -cp /CLASSPATH/TO/CheckGetterProcessor -processor bar.CheckGetterProcessor Foo.java</span></span>
<span class="line"><span>error: Class &#39;Foo&#39; is annotated as @CheckGetter, but field &#39;a&#39; is without getter</span></span>
<span class="line"><span>1 error</span></span></code></pre></div><p>第二种则是将注解处理器编译生成的class文件压缩入jar包中，并在jar包的配置文件中记录该注解处理器的包名及类名，即 <code>bar.CheckGetterProcessor</code>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>（具体路径及配置文件名为\`META-INF/services/javax.annotation.processing.Processor\`）</span></span></code></pre></div><p>当启动Java编译器时，它会寻找classpath路径上的jar包是否包含上述配置文件，并自动注册其中记录的注解处理器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$ javac -cp /PATH/TO/CheckGetterProcessor.jar Foo.java</span></span>
<span class="line"><span>error: Class &#39;Foo&#39; is annotated as @CheckGetter, but field &#39;a&#39; is without getter</span></span>
<span class="line"><span>1 error</span></span></code></pre></div><p>此外，我们还可以在IDE中配置注解处理器。这里我就不过多演示了，感兴趣的同学可以自行搜索。</p><h2 id="利用注解处理器生成源代码" tabindex="-1">利用注解处理器生成源代码 <a class="header-anchor" href="#利用注解处理器生成源代码" aria-label="Permalink to &quot;利用注解处理器生成源代码&quot;">​</a></h2><p>前面提到，注解处理器可以用来修改已有源代码或者生成源代码。</p><p>确切地说，注解处理器并不能真正地修改已有源代码。这里指的是修改由Java源代码生成的抽象语法树，在其中修改已有树节点或者插入新的树节点，从而使生成的字节码发生变化。</p><p>对抽象语法树的修改涉及了Java编译器的内部API，这部分很可能随着版本变更而失效。因此，我并不推荐这种修改方式。</p><p>如果你感兴趣的话，可以参考[Project Lombok][4]。这个项目自定义了一系列注解，并根据注解的内容来修改已有的源代码。例如它提供了 <code>@Getter</code> 和 <code>@Setter</code> 注解，能够为程序自动添加 <code>getter</code> 以及 <code>setter</code> 方法。有关对使用内部API的讨论，你可以参考[这篇博客][5]，以及[Lombok的回应][6]。</p><p>用注解处理器来生成源代码则比较常用。我们以前介绍过的压力测试jcstress，以及接下来即将介绍的JMH工具，都是依赖这种方式来生成测试代码的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package foo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Target(ElementType.METHOD)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.SOURCE)</span></span>
<span class="line"><span>public @interface Adapt {</span></span>
<span class="line"><span>  Class&lt;?&gt; value();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上面这段代码中，我定义了一个注解 <code>@Adapt</code>。这个注解将接收一个 <code>Class</code> 类型的参数 <code>value</code>（如果注解类仅包含一个名为 <code>value</code> 的参数时，那么在使用注解时，我们可以省略 <code>value=</code>），具体用法如这段代码所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Bar.java</span></span>
<span class="line"><span>package test;</span></span>
<span class="line"><span>import java.util.function.IntBinaryOperator;</span></span>
<span class="line"><span>import foo.Adapt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Bar {</span></span>
<span class="line"><span>  @Adapt(IntBinaryOperator.class)</span></span>
<span class="line"><span>  public static int add(int a, int b) {</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接下来，我们来实现一个处理 <code>@Adapt</code> 注解的处理器。该处理器将生成一个新的源文件，实现参数 <code>value</code> 所指定的接口，并且调用至被该注解所标注的方法之中。具体的实现代码比较长，建议你在 <a href="https://time.geekbang.org/column/108" target="_blank" rel="noreferrer">网页端</a> 观看。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package bar;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.*;</span></span>
<span class="line"><span>import java.util.Set;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.annotation.processing.*;</span></span>
<span class="line"><span>import javax.lang.model.SourceVersion;</span></span>
<span class="line"><span>import javax.lang.model.element.*;</span></span>
<span class="line"><span>import javax.lang.model.type.TypeMirror;</span></span>
<span class="line"><span>import javax.lang.model.util.ElementFilter;</span></span>
<span class="line"><span>import javax.tools.JavaFileObject;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.tools.Diagnostic.Kind;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@SupportedAnnotationTypes(&quot;foo.Adapt&quot;)</span></span>
<span class="line"><span>@SupportedSourceVersion(SourceVersion.RELEASE_10)</span></span>
<span class="line"><span>public class AdaptProcessor extends AbstractProcessor {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public boolean process(Set&lt;? extends TypeElement&gt; annotations, RoundEnvironment roundEnv) {</span></span>
<span class="line"><span>    for (TypeElement annotation : annotations) {</span></span>
<span class="line"><span>      if (!&quot;foo.Adapt&quot;.equals(annotation.getQualifiedName().toString())) {</span></span>
<span class="line"><span>        continue;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      ExecutableElement targetAsKey = getExecutable(annotation, &quot;value&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      for (ExecutableElement annotatedMethod : ElementFilter.methodsIn(roundEnv.getElementsAnnotatedWith(annotation))) {</span></span>
<span class="line"><span>        if (!annotatedMethod.getModifiers().contains(Modifier.PUBLIC)) {</span></span>
<span class="line"><span>          processingEnv.getMessager().printMessage(Kind.ERROR, &quot;@Adapt on non-public method&quot;);</span></span>
<span class="line"><span>          continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!annotatedMethod.getModifiers().contains(Modifier.STATIC)) {</span></span>
<span class="line"><span>          // TODO support non-static methods</span></span>
<span class="line"><span>          continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        TypeElement targetInterface = getAnnotationValueAsTypeElement(annotatedMethod, annotation, targetAsKey);</span></span>
<span class="line"><span>        if (targetInterface.getKind() != ElementKind.INTERFACE) {</span></span>
<span class="line"><span>          processingEnv.getMessager().printMessage(Kind.ERROR, &quot;@Adapt with non-interface input&quot;);</span></span>
<span class="line"><span>          continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        TypeElement enclosingType = getTopLevelEnclosingType(annotatedMethod);</span></span>
<span class="line"><span>        createAdapter(enclosingType, annotatedMethod, targetInterface);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void createAdapter(TypeElement enclosingClass, ExecutableElement annotatedMethod,</span></span>
<span class="line"><span>      TypeElement targetInterface) {</span></span>
<span class="line"><span>    PackageElement packageElement = (PackageElement) enclosingClass.getEnclosingElement();</span></span>
<span class="line"><span>    String packageName = packageElement.getQualifiedName().toString();</span></span>
<span class="line"><span>    String className = enclosingClass.getSimpleName().toString();</span></span>
<span class="line"><span>    String methodName = annotatedMethod.getSimpleName().toString();</span></span>
<span class="line"><span>    String adapterName = className + &quot;_&quot; + methodName + &quot;Adapter&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ExecutableElement overriddenMethod = getFirstNonDefaultExecutable(targetInterface);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      Filer filer = processingEnv.getFiler();</span></span>
<span class="line"><span>      JavaFileObject sourceFile = filer.createSourceFile(packageName + &quot;.&quot; + adapterName, new Element[0]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      try (PrintWriter out = new PrintWriter(sourceFile.openWriter())) {</span></span>
<span class="line"><span>        out.println(&quot;package &quot; + packageName + &quot;;&quot;);</span></span>
<span class="line"><span>        out.println(&quot;import &quot; + targetInterface.getQualifiedName() + &quot;;&quot;);</span></span>
<span class="line"><span>        out.println();</span></span>
<span class="line"><span>        out.println(&quot;public class &quot; + adapterName + &quot; implements &quot; + targetInterface.getSimpleName() + &quot; {&quot;);</span></span>
<span class="line"><span>        out.println(&quot;  @Override&quot;);</span></span>
<span class="line"><span>        out.println(&quot;  public &quot; + overriddenMethod.getReturnType() + &quot; &quot; + overriddenMethod.getSimpleName()</span></span>
<span class="line"><span>            + formatParameter(overriddenMethod, true) + &quot; {&quot;);</span></span>
<span class="line"><span>        out.println(&quot;    return &quot; + className + &quot;.&quot; + methodName + formatParameter(overriddenMethod, false) + &quot;;&quot;);</span></span>
<span class="line"><span>        out.println(&quot;  }&quot;);</span></span>
<span class="line"><span>        out.println(&quot;}&quot;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>      throw new RuntimeException(e);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private ExecutableElement getExecutable(TypeElement annotation, String methodName) {</span></span>
<span class="line"><span>    for (ExecutableElement method : ElementFilter.methodsIn(annotation.getEnclosedElements())) {</span></span>
<span class="line"><span>      if (methodName.equals(method.getSimpleName().toString())) {</span></span>
<span class="line"><span>        return method;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    processingEnv.getMessager().printMessage(Kind.ERROR, &quot;Incompatible @Adapt.&quot;);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private ExecutableElement getFirstNonDefaultExecutable(TypeElement annotation) {</span></span>
<span class="line"><span>    for (ExecutableElement method : ElementFilter.methodsIn(annotation.getEnclosedElements())) {</span></span>
<span class="line"><span>      if (!method.isDefault()) {</span></span>
<span class="line"><span>        return method;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    processingEnv.getMessager().printMessage(Kind.ERROR,</span></span>
<span class="line"><span>        &quot;Target interface should declare at least one non-default method.&quot;);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private TypeElement getAnnotationValueAsTypeElement(ExecutableElement annotatedMethod, TypeElement annotation,</span></span>
<span class="line"><span>      ExecutableElement annotationFunction) {</span></span>
<span class="line"><span>    TypeMirror annotationType = annotation.asType();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (AnnotationMirror annotationMirror : annotatedMethod.getAnnotationMirrors()) {</span></span>
<span class="line"><span>      if (processingEnv.getTypeUtils().isSameType(annotationMirror.getAnnotationType(), annotationType)) {</span></span>
<span class="line"><span>        AnnotationValue value = annotationMirror.getElementValues().get(annotationFunction);</span></span>
<span class="line"><span>        if (value == null) {</span></span>
<span class="line"><span>          processingEnv.getMessager().printMessage(Kind.ERROR, &quot;Unknown @Adapt target&quot;);</span></span>
<span class="line"><span>          continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        TypeMirror targetInterfaceTypeMirror = (TypeMirror) value.getValue();</span></span>
<span class="line"><span>        return (TypeElement) processingEnv.getTypeUtils().asElement(targetInterfaceTypeMirror);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    processingEnv.getMessager().printMessage(Kind.ERROR, &quot;@Adapt should contain target()&quot;);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private TypeElement getTopLevelEnclosingType(ExecutableElement annotatedMethod) {</span></span>
<span class="line"><span>    TypeElement enclosingType = null;</span></span>
<span class="line"><span>    Element enclosing = annotatedMethod.getEnclosingElement();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (enclosing != null) {</span></span>
<span class="line"><span>      if (enclosing.getKind() == ElementKind.CLASS) {</span></span>
<span class="line"><span>        enclosingType = (TypeElement) enclosing;</span></span>
<span class="line"><span>      } else if (enclosing.getKind() == ElementKind.PACKAGE) {</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      enclosing = enclosing.getEnclosingElement();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return enclosingType;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private String formatParameter(ExecutableElement method, boolean includeType) {</span></span>
<span class="line"><span>    StringBuilder builder = new StringBuilder();</span></span>
<span class="line"><span>    builder.append(&#39;(&#39;);</span></span>
<span class="line"><span>    String separator = &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (VariableElement parameter : method.getParameters()) {</span></span>
<span class="line"><span>      builder.append(separator);</span></span>
<span class="line"><span>      if (includeType) {</span></span>
<span class="line"><span>        builder.append(parameter.asType());</span></span>
<span class="line"><span>        builder.append(&#39; &#39;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      builder.append(parameter.getSimpleName());</span></span>
<span class="line"><span>      separator = &quot;, &quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    builder.append(&#39;)&#39;);</span></span>
<span class="line"><span>    return builder.toString();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个注解处理器实现中，我们将读取注解中的值，因此我将使用 <code>process</code> 方法的第一个参数，并通过它获得被标注方法对应的 <code>@Adapt</code> 注解中的 <code>value</code> 值。</p><p>之所以采用这种麻烦的方式，是因为 <code>value</code> 值属于 <code>Class</code> 类型。在编译过程中，被编译代码中的 <code>Class</code> 常量未必被加载进Java编译器所在的虚拟机中。因此，我们需要通过 <code>process</code> 方法的第一个参数，获得 <code>value</code> 所指向的接口的抽象语法树，并据此生成源代码。</p><p>生成源代码的方式实际上非常容易理解。我们可以通过 <code>Filer.createSourceFile</code> 方法获得一个类似于文件的概念，并通过 <code>PrintWriter</code> 将具体的内容一一写入即可。</p><p>当将该注解处理器作为插件接入Java编译器时，编译前面的 <code>test/Bar.java</code> 将生成下述代码，并且触发新一轮的编译。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package test;</span></span>
<span class="line"><span>import java.util.function.IntBinaryOperator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Bar_addAdapter implements IntBinaryOperator {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public int applyAsInt(int arg0, int arg1) {</span></span>
<span class="line"><span>    return Bar.add(arg0, arg1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>注意，该注解处理器没有处理所编译的代码包名为空的情况。</p></blockquote><h2 id="总结与实践" tabindex="-1">总结与实践 <a class="header-anchor" href="#总结与实践" aria-label="Permalink to &quot;总结与实践&quot;">​</a></h2><p>今天我介绍了Java编译器的注解处理器。</p><p>注解处理器主要有三个用途。一是定义编译规则，并检查被编译的源文件。二是修改已有源代码。三是生成新的源代码。其中，第二种涉及了Java编译器的内部API，因此并不推荐。第三种较为常见，是OpenJDK工具jcstress，以及JMH生成测试代码的方式。</p><p>Java源代码的编译过程可分为三个步骤，分别为解析源文件生成抽象语法树，调用已注册的注解处理器，和生成字节码。如果在第2步中，注解处理器生成了新的源代码，那么Java编译器将重复第1、2步，直至不再生成新的源代码。</p><hr><p>今天的实践环节，请实现本文的案例 <code>CheckGetterProcessor</code> 中的TODO项，处理由 <code>@CheckGetter</code> 注解的字段。</p><p>[1] <a href="http://openjdk.java.net/groups/compiler/doc/compilation-overview/index.html" target="_blank" rel="noreferrer">http://openjdk.java.net/groups/compiler/doc/compilation-overview/index.html</a></p><p>[2] <a href="http://hannesdorfmann.com/annotation-processing/annotationprocessing101" target="_blank" rel="noreferrer">http://hannesdorfmann.com/annotation-processing/annotationprocessing101</a></p><p>[3] <a href="https://docs.oracle.com/javase/10/docs/api/javax/lang/model/element/package-summary.html" target="_blank" rel="noreferrer">https://docs.oracle.com/javase/10/docs/api/javax/lang/model/element/package-summary.html</a></p><p>[4] <a href="https://projectlombok.org/" target="_blank" rel="noreferrer">https://projectlombok.org/</a></p><p>[5] <a href="http://notatube.blogspot.com/2010/11/project-lombok-trick-explained.html" target="_blank" rel="noreferrer">http://notatube.blogspot.com/2010/11/project-lombok-trick-explained.html</a></p><p>[6] <a href="http://jnb.ociweb.com/jnb/jnbJan2010.html#controversy" target="_blank" rel="noreferrer">http://jnb.ociweb.com/jnb/jnbJan2010.html#controversy</a></p>`,72)])])}const m=a(t,[["render",l]]);export{g as __pageData,m as default};
