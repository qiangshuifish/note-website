import{_ as s,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"08 | 作用域和生存期：实现块作用域和函数","description":"","frontmatter":{},"headers":[{"level":2,"title":"作用域（Scope）","slug":"作用域-scope","link":"#作用域-scope","children":[]},{"level":2,"title":"生存期（Extent）","slug":"生存期-extent","link":"#生存期-extent","children":[]},{"level":2,"title":"实现作用域和栈","slug":"实现作用域和栈","link":"#实现作用域和栈","children":[]},{"level":2,"title":"实现块作用域","slug":"实现块作用域","link":"#实现块作用域","children":[]},{"level":2,"title":"实现函数功能","slug":"实现函数功能","link":"#实现函数功能","children":[]},{"level":2,"title":"课程小结","slug":"课程小结","link":"#课程小结","children":[]},{"level":2,"title":"一课一思","slug":"一课一思","link":"#一课一思","children":[]}],"relativePath":"编译原理之美/08-作用域和生存期：实现块作用域和函数.md","filePath":"编译原理之美/08-作用域和生存期：实现块作用域和函数.md","lastUpdated":1779821665000}'),e={name:"编译原理之美/08-作用域和生存期：实现块作用域和函数.md"};function i(t,a,c,r,o,b){return n(),p("div",null,[...a[0]||(a[0]=[l(`<h1 id="_08-作用域和生存期-实现块作用域和函数" tabindex="-1">08 | 作用域和生存期：实现块作用域和函数 <a class="header-anchor" href="#_08-作用域和生存期-实现块作用域和函数" aria-label="Permalink to &quot;08 | 作用域和生存期：实现块作用域和函数&quot;">​</a></h1><p>目前，我们已经用Antlr重构了脚本解释器，有了工具的帮助，我们可以实现更高级的功能，比如函数功能、面向对象功能。当然了，在这个过程中，我们还要克服一些挑战，比如：</p><ul><li>如果要实现函数功能，要升级变量管理机制；</li><li>引入作用域机制，来保证变量的引用指向正确的变量定义；</li><li>提升变量存储机制，不能只把变量和它的值简单地扔到一个HashMap里，要管理它的生存期，减少对内存的占用。</li></ul><p>本节课，我将借实现块作用域和函数功能，带你探讨作用域和生存期及其实现机制，并升级变量管理机制。那么什么是作用域和生存期，它们的重要性又体现在哪儿呢？</p><p><strong>“作用域”和“生存期”</strong> 是计算机语言中更加基础的概念，它们可以帮你深入地理解函数、块、闭包、面向对象、静态成员、本地变量和全局变量等概念。</p><p>而且一旦你深入理解，了解作用域与生存期在编译期和运行期的机制之后，就能解决在学习过程中可能遇到的一些问题，比如：</p><ul><li>闭包的机理到底是什么？</li><li>为什么需要栈和堆两种机制来管理内存？它们的区别又是什么？</li><li>一个静态的内部类和普通的内部类有什么区别？</li></ul><p>了解上面这些内容之后，接下来，我们来具体看看什么是作用域。</p><h2 id="作用域-scope" tabindex="-1">作用域（Scope） <a class="header-anchor" href="#作用域-scope" aria-label="Permalink to &quot;作用域（Scope）&quot;">​</a></h2><p>作用域是指计算机语言中变量、函数、类等起作用的范围，我们来看一个具体的例子。</p><p>下面这段代码是用C语言写的，我们在全局以及函数fun中分别声明了a和b两个变量，然后在代码里对这些变量做了赋值操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span>scope.c</span></span>
<span class="line"><span>测试作用域。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int a = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void fun()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    a = 2;</span></span>
<span class="line"><span>    //b = 3;</span><span>   //出错，不知道b是谁</span></span>
<span class="line"><span>    int a = 3; //允许声明一个同名的变量吗？</span></span>
<span class="line"><span>    int b = a; //这里的a是哪个？</span></span>
<span class="line"><span>    printf(&quot;in fun: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int b = 4; //b的作用域从这里开始</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv){</span></span>
<span class="line"><span>    printf(&quot;main--1: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fun();</span></span>
<span class="line"><span>    printf(&quot;main--2: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //用本地变量覆盖全局变量</span></span>
<span class="line"><span>    int a = 5;</span></span>
<span class="line"><span>    int b = 5;</span></span>
<span class="line"><span>    printf(&quot;main--3: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试块作用域</span></span>
<span class="line"><span>    if (a &amp;gt; 0){</span></span>
<span class="line"><span>        int b = 3; //允许在块里覆盖外面的变量</span></span>
<span class="line"><span>        printf(&quot;main--4: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else{</span></span>
<span class="line"><span>        int b = 4; //跟if块里的b是两个不同的变量</span></span>
<span class="line"><span>        printf(&quot;main--5: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    printf(&quot;main--6: a=%d b=%d \\n&quot;, a, b);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这段代码编译后运行，结果是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>main--1: a=1 b=4</span></span>
<span class="line"><span>in fun: a=3 b=3</span></span>
<span class="line"><span>main--2: a=2 b=4</span></span>
<span class="line"><span>main--3: a=5 b=5</span></span>
<span class="line"><span>main--4: a=5 b=3</span></span>
<span class="line"><span>main--6: a=5 b=5</span></span></code></pre></div><p>我们可以得出这样的规律：</p><ul><li>变量的作用域有大有小，外部变量在函数内可以访问，而函数中的本地变量，只有本地才可以访问。</li><li>变量的作用域，从声明以后开始。</li><li>在函数里，我们可以声明跟外部变量相同名称的变量，这个时候就覆盖了外部变量。</li></ul><p>下面这张图直观地显示了示例代码中各个变量的作用域：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/128623/2ea46e1b2d1a6c863f6830a7af5fd3fc.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/128623/2ea46e1b2d1a6c863f6830a7af5fd3fc.jpg" alt=""></a></p><p>另外，C语言里还有块作用域的概念，就是用花括号包围的语句，if和else后面就跟着这样的语句块。块作用域的特征跟函数作用域的特征相似，都可以访问外部变量，也可以用本地变量覆盖掉外部变量。</p><p>你可能会问：“其他语言也有块作用域吗？特征是一样的吗？”其实，各个语言在这方面的设计机制是不同的。比如，下面这段用Java写的代码里，我们用了一个if语句块，并且在if部分、else部分和外部分别声明了一个变量c：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Scope.java</span></span>
<span class="line"><span> * 测试Java的作用域</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class ScopeTest{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String args[]){</span></span>
<span class="line"><span>        int a = 1;</span></span>
<span class="line"><span>        int b = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (a &amp;gt; 0){</span></span>
<span class="line"><span>            //int b = 3;</span><span> //不允许声明与外部变量同名的变量</span></span>
<span class="line"><span>            int c = 3;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else{</span></span>
<span class="line"><span>            int c = 4;   //允许声明另一个c，各有各的作用域</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int c = 5;  //这里也可以声明一个新的c</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你能看到，Java的块作用域跟C语言的块作用域是不同的，它不允许块作用域里的变量覆盖外部变量。那么和C、Java写起来很像的JavaScript呢？来看一看下面这段测试JavaScript作用域的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Scope.js</span></span>
<span class="line"><span> * 测试JavaScript的作用域</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>var a = 5;</span></span>
<span class="line"><span>var b = 5;</span></span>
<span class="line"><span>console.log(&quot;1: a=%d b=%d&quot;, a, b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (a &amp;gt; 0) {</span></span>
<span class="line"><span>    a = 4;</span></span>
<span class="line"><span>    console.log(&quot;2: a=%d b=%d&quot;, a, b);</span></span>
<span class="line"><span>    var b = 3; //看似声明了一个新变量，其实还是引用的外部变量</span></span>
<span class="line"><span>    console.log(&quot;3: a=%d b=%d&quot;, a, b);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else {</span></span>
<span class="line"><span>    var b = 4;</span></span>
<span class="line"><span>    console.log(&quot;4: a=%d b=%d&quot;, a, b);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(&quot;5: a=%d b=%d&quot;, a, b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for (var b = 0; b&amp;lt; 2; b++){  //这里是否能声明一个新变量，用于for循环？</span></span>
<span class="line"><span>    console.log(&quot;6-%d: a=%d b=%d&quot;,b, a, b);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(&quot;7: a=%d b=%d&quot;, a, b);</span></span></code></pre></div><p>这段代码编译后运行，结果是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1: a=5 b=5</span></span>
<span class="line"><span>2: a=4 b=5</span></span>
<span class="line"><span>3: a=4 b=3</span></span>
<span class="line"><span>5: a=4 b=3</span></span>
<span class="line"><span>6-0: a=4 b=0</span></span>
<span class="line"><span>6-1: a=4 b=1</span></span>
<span class="line"><span>7: a=4 b=2</span></span></code></pre></div><p>你可以看到，JavaScript是没有块作用域的。我们在块里和for语句试图重新定义变量b，语法上是允许的，但我们每次用到的其实是同一个变量。</p><p>对比了三种语言的作用域特征之后，你是否发现原来看上去差不多的语法，内部机理却不同？这种不同其实是语义差别的一个例子。 <strong>你要注意的是，现在我们讲的很多内容都已经属于语义的范畴了，对作用域的分析就是语义分析的任务之一。</strong></p><h2 id="生存期-extent" tabindex="-1">生存期（Extent） <a class="header-anchor" href="#生存期-extent" aria-label="Permalink to &quot;生存期（Extent）&quot;">​</a></h2><p>了解了什么是作用域之后，我们再理解一下跟它紧密相关的生存期。它是变量可以访问的时间段，也就是从分配内存给它，到收回它的内存之间的时间。</p><p>在前面几个示例程序中，变量的生存期跟作用域是一致的。出了作用域，生存期也就结束了，变量所占用的内存也就被释放了。这是本地变量的标准特征，这些本地变量是用栈来管理的。</p><p>但也有一些情况，变量的生存期跟语法上的作用域不一致，比如在堆中申请的内存，退出作用域以后仍然会存在。</p><p>下面这段C语言的示例代码中，fun函数返回了一个整数的指针。出了函数以后，本地变量b就消失了，这个指针所占用的内存（&amp;b）就收回了，其中&amp;b是取b的地址，这个地址是指向栈里的一小块空间，因为b是栈里申请的。在这个栈里的小空间里保存了一个地址，指向在堆里申请的内存。这块内存，也就是用来实际保存数值2的空间，并没有被收回，我们必须手动使用free()函数来收回。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span>extent.c</span></span>
<span class="line"><span>测试生存期。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int * fun(){</span></span>
<span class="line"><span>    int * b = (int*)malloc(1*sizeof(int)); //在堆中申请内存</span></span>
<span class="line"><span>    *b = 2;</span><span>  //给该地址赋值2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv){</span></span>
<span class="line"><span>    int * p = fun();</span></span>
<span class="line"><span>    *p = 3;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    printf(&quot;after called fun: b=%lu *b=%d \\n&quot;, (unsigned long)p, *p);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    free(p);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>类似的情况在Java里也有。Java的对象实例缺省情况下是在堆中生成的。下面的示例代码中，从一个方法中返回了对象的引用，我们可以基于这个引用继续修改对象的内容，这证明这个对象的内存并没有被释放：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Extent2.java</span></span>
<span class="line"><span> * 测试Java的生存期特性</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Extent2{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    StringBuffer myMethod(){</span></span>
<span class="line"><span>        StringBuffer b = new StringBuffer(); //在堆中生成对象实例</span></span>
<span class="line"><span>        b.append(&quot;Hello &quot;);</span></span>
<span class="line"><span>        System.out.println(System.identityHashCode(b)); //打印内存地址</span></span>
<span class="line"><span>        return b;  //返回对象引用，本质是一个内存地址</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String args[]){</span></span>
<span class="line"><span>        Extent2 extent2 = new Extent2();</span></span>
<span class="line"><span>        StringBuffer c = extent2.myMethod(); //获得对象引用</span></span>
<span class="line"><span>        System.out.println(c);</span></span>
<span class="line"><span>        c.append(&quot;World!&quot;);         //修改内存中的内容</span></span>
<span class="line"><span>        System.out.println(c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //跟在myMethod()中打印的值相同</span></span>
<span class="line"><span>        System.out.println(System.identityHashCode(c));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>因为Java对象所采用的内存超出了申请内存时所在的作用域，所以也就没有办法自动收回。所以Java采用的是自动内存管理机制，也就是垃圾回收技术。</p><p>那么为什么说作用域和生存期是计算机语言更加基础的概念呢？其实是因为它们对应到了运行时的内存管理的基本机制。虽然各门语言设计上的特性是不同的，但在运行期的机制都很相似，比如都会用到栈和堆来做内存管理。</p><p>好了，理解了作用域和生存期的原理之后，我们就来实现一下，先来设计一下作用域机制，然后再模拟实现一个栈。</p><h2 id="实现作用域和栈" tabindex="-1">实现作用域和栈 <a class="header-anchor" href="#实现作用域和栈" aria-label="Permalink to &quot;实现作用域和栈&quot;">​</a></h2><p>在之前的PlayScript脚本的实现中，处理变量赋值的时候，我们简单地把变量存在一个哈希表里，用变量名去引用，就像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SimpleScript {</span></span>
<span class="line"><span>    private HashMap&amp;lt;String, Integer&amp;gt; variables = new HashMap&amp;lt;String, Integer&amp;gt;();</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>但如果变量存在多个作用域，这样做就不行了。这时，我们就要设计一个数据结构，区分不同变量的作用域。分析前面的代码，你可以看到作用域是一个树状的结构，比如Scope.c的作用域：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/128623/2d3fc83aba7fe2fd7b29227e97184fc8.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/128623/2d3fc83aba7fe2fd7b29227e97184fc8.jpg" alt=""></a></p><p>面向对象的语言不太相同，它不是一棵树，是一片树林，每个类对应一棵树，所以它也没有全局变量。在我们的playscript语言中，我们设计了下面的对象结构来表示Scope：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//编译过程中产生的变量、函数、类、块，都被称作符号</span></span>
<span class="line"><span>public abstract class Symbol {</span></span>
<span class="line"><span>    //符号的名称</span></span>
<span class="line"><span>    protected String name = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //所属作用域</span></span>
<span class="line"><span>    protected Scope enclosingScope = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //可见性，比如public还是private</span></span>
<span class="line"><span>    protected int visibility = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //Symbol关联的AST节点</span></span>
<span class="line"><span>    protected ParserRuleContext ctx = null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//作用域</span></span>
<span class="line"><span>public abstract class Scope extends Symbol{</span></span>
<span class="line"><span>    // 该Scope中的成员，包括变量、方法、类等。</span></span>
<span class="line"><span>    protected List&amp;lt;Symbol&amp;gt; symbols = new LinkedList&amp;lt;Symbol&amp;gt;();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//块作用域</span></span>
<span class="line"><span>public class BlockScope extends Scope{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//函数作用域</span></span>
<span class="line"><span>public class Function extends Scope implements FunctionType{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//类作用域</span></span>
<span class="line"><span>public class Class extends Scope implements Type{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>目前我们划分了三种作用域，分别是块作用域（Block）、函数作用域（Function）和类作用域（Class）。</p><p>我们在解释执行playscript的AST的时候，需要建立起作用域的树结构，对作用域的分析过程是语义分析的一部分。也就是说，并不是有了AST，我们马上就可以运行它，在运行之前，我们还要做语义分析，比如对作用域做分析，让每个变量都能做正确的引用，这样才能正确地执行这个程序。</p><p>解决了作用域的问题以后，再来看看如何解决生存期的问题。还是看Scope.c的代码，随着代码的执行，各个变量的生存期表现如下：</p><ul><li>进入程序，全局变量逐一生效；</li><li>进入main函数，main函数里的变量顺序生效；</li><li>进入fun函数，fun函数里的变量顺序生效；</li><li>退出fun函数，fun函数里的变量失效；</li><li>进入if语句块，if语句块里的变量顺序生效；</li><li>退出if语句块，if语句块里的变量失效；</li><li>退出main函数，main函数里的变量失效；</li><li>退出程序，全局变量失效。</li></ul><p>通过下面这张图，你能直观地看到运行过程中栈的变化：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/128623/51f278ccd4fc7f28c6840e1d6b20bd06.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%E4%B9%8B%E7%BE%8E/images/128623/51f278ccd4fc7f28c6840e1d6b20bd06.jpg" alt=""></a></p><p>代码执行时进入和退出一个个作用域的过程，可以用栈来实现。每进入一个作用域，就往栈里压入一个数据结构，这个数据结构叫做 <strong>栈桢（Stack Frame）</strong>。栈桢能够保存当前作用域的所有本地变量的值，当退出这个作用域的时候，这个栈桢就被弹出，里面的变量也就失效了。</p><p>你可以看到，栈的机制能够有效地使用内存，变量超出作用域的时候，就没有用了，就可以从内存中丢弃。我在ASTEvaluator.java中，用下面的数据结构来表示栈和栈桢，其中的PlayObject通过一个HashMap来保存各个变量的值：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Stack&amp;lt;StackFrame&amp;gt; stack = new Stack&amp;lt;StackFrame&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class StackFrame {</span></span>
<span class="line"><span>    //该frame所对应的scope</span></span>
<span class="line"><span>    Scope scope = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //enclosingScope所对应的frame</span></span>
<span class="line"><span>    StackFrame parentFrame = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //实际存放变量的地方</span></span>
<span class="line"><span>    PlayObject object = null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class PlayObject {</span></span>
<span class="line"><span>    //成员变量</span></span>
<span class="line"><span>    protected Map&amp;lt;Variable, Object&amp;gt; fields = new HashMap&amp;lt;Variable, Object&amp;gt;();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>目前，我们只是在概念上模仿栈桢，当我们用Java语言实现的时候，PlayObject对象是存放在堆里的，Java的所有对象都是存放在堆里的，只有基础数据类型，比如int和对象引用是放在栈里的。虽然只是模仿，这不妨碍我们建立栈桢的概念，在后端技术部分，我们会实现真正意义上的栈桢。</p><p>要注意的是，栈的结构和Scope的树状结构是不一致的。也就是说，栈里的上一级栈桢，不一定是Scope的父节点。要访问上一级Scope中的变量数据，要顺着栈桢的parentFrame去找。我在上图中展现了这种情况，在调用fun函数的时候，栈里一共有三个栈桢：全局栈桢、main()函数栈桢和fun()函数栈桢，其中main()函数栈桢的parentFrame和fun()函数栈桢的parentFrame都是全局栈桢。</p><h2 id="实现块作用域" tabindex="-1">实现块作用域 <a class="header-anchor" href="#实现块作用域" aria-label="Permalink to &quot;实现块作用域&quot;">​</a></h2><p>目前，我们已经做好了作用域和栈，在这之后，就能实现很多功能了，比如让if语句和for循环语句使用块作用域和本地变量。以for语句为例，visit方法里首先为它生成一个栈桢，并加入到栈中，运行完毕之后，再从栈里弹出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BlockScope scope = (BlockScope) cr.node2Scope.get(ctx);  //获得Scope</span></span>
<span class="line"><span>StackFrame frame = new StackFrame(scope);  //创建一个栈桢</span></span>
<span class="line"><span>pushStack(frame);    //加入栈中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//运行完毕，弹出栈</span></span>
<span class="line"><span>stack.pop();</span></span></code></pre></div><p>当我们在代码中需要获取某个变量的值的时候，首先在当前桢中寻找。找不到的话，就到上一级作用域对应的桢中去找：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>StackFrame f = stack.peek();       //获取栈顶的桢</span></span>
<span class="line"><span>PlayObject valueContainer = null;</span></span>
<span class="line"><span>while (f != null) {</span></span>
<span class="line"><span>    //看变量是否属于当前栈桢里</span></span>
<span class="line"><span>    if (f.scope.containsSymbol(variable)){</span></span>
<span class="line"><span>        valueContainer = f.object;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //从上一级scope对应的栈桢里去找</span></span>
<span class="line"><span>    f = f.parentFrame;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行下面的测试代码，你会看到在执行完for循环以后，我们仍然可以声明另一个变量i，跟for循环中的i互不影响，这证明它们确实属于不同的作用域：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String script = &quot;int age = 44; for(int i = 0;i&amp;lt;10;i++) { age = age + 2;} int i = 8;&quot;;</span></span></code></pre></div><p>进一步的，我们可以实现对函数的支持。</p><h2 id="实现函数功能" tabindex="-1">实现函数功能 <a class="header-anchor" href="#实现函数功能" aria-label="Permalink to &quot;实现函数功能&quot;">​</a></h2><p>先来看一下与函数有关的语法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//函数声明</span></span>
<span class="line"><span>functionDeclaration</span></span>
<span class="line"><span>    : typeTypeOrVoid? IDENTIFIER formalParameters (&#39;[&#39; &#39;]&#39;)*</span></span>
<span class="line"><span>      functionBody</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//函数体</span></span>
<span class="line"><span>functionBody</span></span>
<span class="line"><span>    : block</span></span>
<span class="line"><span>    | &#39;;&#39;</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//类型或void</span></span>
<span class="line"><span>typeTypeOrVoid</span></span>
<span class="line"><span>    : typeType</span></span>
<span class="line"><span>    | VOID</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//函数所有参数</span></span>
<span class="line"><span>formalParameters</span></span>
<span class="line"><span>    : &#39;(&#39; formalParameterList? &#39;)&#39;</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//参数列表</span></span>
<span class="line"><span>formalParameterList</span></span>
<span class="line"><span>    : formalParameter (&#39;,&#39; formalParameter)* (&#39;,&#39; lastFormalParameter)?</span></span>
<span class="line"><span>    | lastFormalParameter</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//单个参数</span></span>
<span class="line"><span>formalParameter</span></span>
<span class="line"><span>    : variableModifier* typeType variableDeclaratorId</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//可变参数数量情况下，最后一个参数</span></span>
<span class="line"><span>lastFormalParameter</span></span>
<span class="line"><span>    : variableModifier* typeType &#39;...&#39; variableDeclaratorId</span></span>
<span class="line"><span>    ;</span></span>
<span class="line"><span>//函数调用</span></span>
<span class="line"><span>functionCall</span></span>
<span class="line"><span>    : IDENTIFIER &#39;(&#39; expressionList? &#39;)&#39;</span></span>
<span class="line"><span>    | THIS &#39;(&#39; expressionList? &#39;)&#39;</span></span>
<span class="line"><span>    | SUPER &#39;(&#39; expressionList? &#39;)&#39;</span></span>
<span class="line"><span>    ;</span></span></code></pre></div><p>在函数里，我们还要考虑一个额外的因素： <strong>参数。</strong> 在函数内部，参数变量跟普通的本地变量在使用时没什么不同，在运行期，它们也像本地变量一样，保存在栈桢里。</p><p>我们设计一个对象来代表函数的定义，它包括参数列表和返回值的类型：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Function extends Scope implements FunctionType{</span></span>
<span class="line"><span>    // 参数</span></span>
<span class="line"><span>    protected List&amp;lt;Variable&amp;gt; parameters = new LinkedList&amp;lt;Variable&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回值</span></span>
<span class="line"><span>    protected Type returnType = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在调用函数时，我们实际上做了三步工作：</p><ul><li>建立一个栈桢；</li><li>计算所有参数的值，并放入栈桢；</li><li>执行函数声明中的函数体。</li></ul><p>我把相关代码放在了下面，你可以看一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//函数声明的AST节点</span></span>
<span class="line"><span>FunctionDeclarationContext functionCode = (FunctionDeclarationContext) function.ctx;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//创建栈桢</span></span>
<span class="line"><span>functionObject = new FunctionObject(function);</span></span>
<span class="line"><span>StackFrame functionFrame = new StackFrame(functionObject);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 计算实参的值</span></span>
<span class="line"><span>List&amp;lt;Object&amp;gt; paramValues = new LinkedList&amp;lt;Object&amp;gt;();</span></span>
<span class="line"><span>if (ctx.expressionList() != null) {</span></span>
<span class="line"><span>    for (ExpressionContext exp : ctx.expressionList().expression()) {</span></span>
<span class="line"><span>        Object value = visitExpression(exp);</span></span>
<span class="line"><span>        if (value instanceof LValue) {</span></span>
<span class="line"><span>            value = ((LValue) value).getValue();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        paramValues.add(value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//根据形参的名称，在栈桢中添加变量</span></span>
<span class="line"><span>if (functionCode.formalParameters().formalParameterList() != null) {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; functionCode.formalParameters().formalParameterList().formalParameter().size(); i++) {</span></span>
<span class="line"><span>        FormalParameterContext param = functionCode.formalParameters().formalParameterList().formalParameter(i);</span></span>
<span class="line"><span>        LValue lValue = (LValue) visitVariableDeclaratorId(param.variableDeclaratorId());</span></span>
<span class="line"><span>        lValue.setValue(paramValues.get(i));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用方法体</span></span>
<span class="line"><span>rtn = visitFunctionDeclaration(functionCode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 运行完毕，弹出栈</span></span>
<span class="line"><span>stack.pop();</span></span></code></pre></div><p>你可以用playscript测试一下函数执行的效果，看看参数传递和作用域的效果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String script = &quot;int b= 10; int myfunc(int a) {return a+b+3;} myfunc(2);&quot;;</span></span></code></pre></div><h2 id="课程小结" tabindex="-1">课程小结 <a class="header-anchor" href="#课程小结" aria-label="Permalink to &quot;课程小结&quot;">​</a></h2><p>本节课，我带你实现了块作用域和函数，还跟你一起探究了计算机语言的两个底层概念：作用域和生存期。你要知道：</p><ul><li>对作用域的分析是语义分析的一项工作。Antlr能够完成很多词法分析和语法分析的工作，但语义分析工作需要我们自己做。</li><li>变量的生存期涉及运行期的内存管理，也引出了栈桢和堆的概念，我会在编译器后端技术时进一步阐述。</li></ul><p>我建议你在学习新语言的时候，先了解它在作用域和生存期上的特点，然后像示例程序那样做几个例子，借此你会更快理解语言的设计思想。比如，为什么需要命名空间这个特性？全局变量可能带来什么问题？类的静态成员与普通成员有什么区别？等等。</p><p>下一讲，我们会尝试实现面向对象特性，看看面向对象语言在语义上是怎么设计的，以及在运行期有什么特点。</p><h2 id="一课一思" tabindex="-1">一课一思 <a class="header-anchor" href="#一课一思" aria-label="Permalink to &quot;一课一思&quot;">​</a></h2><p>既然我强调了作用域和生存期的重要性，那么在你熟悉的语言中，有哪些特性是能用作用域和生存期的概念做更基础的解读呢？比如，面向对象的语言中，对象成员的作用域和生存期是怎样的？欢迎在留言区与大家一起交流。</p><p>最后，感谢你的阅读，如果这篇文章让你有所收获，也欢迎你将它分享给更多的朋友。</p><p>今天讲的功能照样能在playscript-java项目中找到示例代码，其中还有用playscript写的脚本，你可以多玩一玩。</p><ul><li>playscript-java（项目目录）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/tree/master/playscript-java" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/tree/master/playscript-java" target="_blank" rel="noreferrer">GitHub</a></li><li>PlayScript.java（入口程序）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/blob/master/playscript-java/src/main/play/PlayScript.java" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/playscript-java/src/main/play/PlayScript.java" target="_blank" rel="noreferrer">GitHub</a></li><li>PlayScript.g4（语法规则）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/blob/master/playscript-java/src/main/play/PlayScript.g4" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/playscript-java/src/main/play/PlayScript.g4" target="_blank" rel="noreferrer">GitHub</a></li><li>ASTEvaluator.java（解释器）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/blob/master/playscript-java/src/main/play/ASTEvaluator.java" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/playscript-java/src/main/play/ASTEvaluator.java" target="_blank" rel="noreferrer">GitHub</a></li><li>BlockScope.play（演示块作用域）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/blob/master/playscript-java/src/examples/BlockScope.play" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/playscript-java/src/examples/BlockScope.play" target="_blank" rel="noreferrer">GitHub</a></li><li>function.play（演示基础函数功能）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/blob/master/playscript-java/src/examples/function.play" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/blob/master/playscript-java/src/examples/function.play" target="_blank" rel="noreferrer">GitHub</a></li><li>lab/scope目录（各种语言的作用域测试）： <a href="https://gitee.com/richard-gong/PlayWithCompiler/tree/master/lab/scope" target="_blank" rel="noreferrer">码云</a> <a href="https://github.com/RichardGong/PlayWithCompiler/tree/master/lab/scope" target="_blank" rel="noreferrer">GitHub</a></li></ul>`,86)])])}const h=s(e,[["render",i]]);export{u as __pageData,h as default};
