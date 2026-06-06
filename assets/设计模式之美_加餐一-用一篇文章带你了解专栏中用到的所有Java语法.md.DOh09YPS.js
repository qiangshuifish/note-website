import{_ as a,H as n,f as p,i as l}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"加餐一 | 用一篇文章带你了解专栏中用到的所有Java语法","description":"","frontmatter":{},"headers":[{"level":2,"title":"Hello World","slug":"hello-world","link":"#hello-world","children":[]},{"level":2,"title":"基本数据类型","slug":"基本数据类型","link":"#基本数据类型","children":[]},{"level":2,"title":"数组","slug":"数组","link":"#数组","children":[]},{"level":2,"title":"流程控制","slug":"流程控制","link":"#流程控制","children":[]},{"level":2,"title":"类、对象","slug":"类、对象","link":"#类、对象","children":[]},{"level":2,"title":"权限修饰符","slug":"权限修饰符","link":"#权限修饰符","children":[]},{"level":2,"title":"继承","slug":"继承","link":"#继承","children":[]},{"level":2,"title":"接口","slug":"接口","link":"#接口","children":[]},{"level":2,"title":"容器","slug":"容器","link":"#容器","children":[]},{"level":2,"title":"异常处理","slug":"异常处理","link":"#异常处理","children":[]},{"level":2,"title":"package包","slug":"package包","link":"#package包","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/加餐一-用一篇文章带你了解专栏中用到的所有Java语法.md","filePath":"设计模式之美/加餐一-用一篇文章带你了解专栏中用到的所有Java语法.md","lastUpdated":1779822055000}'),e={name:"设计模式之美/加餐一-用一篇文章带你了解专栏中用到的所有Java语法.md"};function i(c,s,t,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="加餐一-用一篇文章带你了解专栏中用到的所有java语法" tabindex="-1">加餐一 | 用一篇文章带你了解专栏中用到的所有Java语法 <a class="header-anchor" href="#加餐一-用一篇文章带你了解专栏中用到的所有java语法" aria-label="Permalink to &quot;加餐一 | 用一篇文章带你了解专栏中用到的所有Java语法&quot;">​</a></h1><p>尽管说设计模式跟编程语言没有直接关系，但是，我们也无法完全脱离代码来讲设计模式。我本人熟悉的是Java语言，所以专栏中的代码示例我都是用Java语言来写的。考虑到有些同学并不熟悉Java语言，我今天用一篇文章介绍一下专栏中用到的Java语法。</p><p>如果你有一定的编程基础，熟悉一门编程语言，结合我今天讲的Java语法知识，那看懂专栏中的代码基本不成问题。</p><p>如果你熟悉的是C/C++、C#、PHP，那几乎不用费多大力气，就能看懂Java代码。我当时从C++转到Java，也只看了一天的书，基本语法就全部掌握了。</p><p>如果你熟悉的是Python、Go、Ruby、JavaScript，这些语言的语法可能跟Java的区别稍微有些大，但是，通过这篇文章，做到能看懂也不是难事儿。</p><p>好了，现在，就让我们一块儿看下，专栏中用到的所有Java语言的语法。</p><h2 id="hello-world" tabindex="-1">Hello World <a class="header-anchor" href="#hello-world" aria-label="Permalink to &quot;Hello World&quot;">​</a></h2><p>我们先来看一下，Java语言的Hello World代码如何编写。</p><p>在Java中，所有的代码都必须写在类里面，所以，我们定义一个HelloWorld类。main()函数是程序执行的入口。main()函数中调用了Java开发包JDK提供的打印函数System.out.println()来打印hello world字符串。除此之外，Java中有两种代码注释方式，第一种是“//注释…”双斜杠，表示后面的字符串都是注释，第二种是“/*注释…*/”，表示中间的内容都是注释。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*hello world程序*/</span></span>
<span class="line"><span>public class HelloWorld {</span></span>
<span class="line"><span>    public static void main(String []args) {</span></span>
<span class="line"><span>        System.out.println(&quot;Hello World&quot;); //打印Hello World</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="基本数据类型" tabindex="-1">基本数据类型 <a class="header-anchor" href="#基本数据类型" aria-label="Permalink to &quot;基本数据类型&quot;">​</a></h2><p>Java语言中的基本数据类型跟其他语言类似，主要有下面几种：</p><ul><li>整型类型：byte（字节）、short（短整型）、int（整型）、long（长整型）</li><li>浮点类型：float（单精度浮点）、double（双精度浮点）</li><li>字符型：char</li><li>布尔型：boolean</li></ul><p>如下，我们来定义一个基本类型变量：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int a = 6;</span></span></code></pre></div><p>除此之外，为了方便我们使用，Java还提供了一些封装这些基本数据类型的类，这些类实现了一些常用的功能函数，可以直接拿来使用。常用的有下面几个类：</p><ul><li>Integer：对应封装了基本类型int；</li><li>Long：对应封装了基本类型long；</li><li>Float：对应封装了基本类型float；</li><li>Double：对应封装了基本类型double；</li><li>Boolean：对应封装了基本类型boolean；</li><li>String：对应封装了字符串类型char[]。</li></ul><p>如下，我们来定义一个Integer对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Integer oa = new Integer(6);</span></span></code></pre></div><h2 id="数组" tabindex="-1">数组 <a class="header-anchor" href="#数组" aria-label="Permalink to &quot;数组&quot;">​</a></h2><p>Java中，我们使用[]来定义一个数组，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int a[] = new int[10]; //定义了一个长度是10的int类型数组</span></span></code></pre></div><p>在Java中，我们通过如下方式访问数组中的元素：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a[1] = 3; //将下标是1的数组元素赋值为3</span></span>
<span class="line"><span>System.out.println(a[2]); //打印下标是2的数组元素值</span></span></code></pre></div><h2 id="流程控制" tabindex="-1">流程控制 <a class="header-anchor" href="#流程控制" aria-label="Permalink to &quot;流程控制&quot;">​</a></h2><p>流程控制语句跟其他语言类似，主要有下面几种。</p><ul><li>if-else语句，代码示例如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 用法一</span></span>
<span class="line"><span>int a;</span></span>
<span class="line"><span>if (a &amp;gt; 1) {</span></span>
<span class="line"><span>  //执行代码块</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  //执行代码块</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 用法二</span></span>
<span class="line"><span>int a;</span></span>
<span class="line"><span>if (a &amp;gt; 1) {</span></span>
<span class="line"><span>  //执行代码块</span></span>
<span class="line"><span>} else if (a == 1) {</span></span>
<span class="line"><span>  //执行代码块</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  //执行代码块</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>switch-case语句，代码示例如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int a;</span></span>
<span class="line"><span>switch (a) {</span></span>
<span class="line"><span>  case 1:</span></span>
<span class="line"><span>    //执行代码块</span></span>
<span class="line"><span>    break;</span></span>
<span class="line"><span>  case 2:</span></span>
<span class="line"><span>    //执行代码块</span></span>
<span class="line"><span>    break;</span></span>
<span class="line"><span>  default:</span></span>
<span class="line"><span>    //默认执行代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>for、while循环，代码示例如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (int i = 0; i &amp;lt; 10; ++i) {</span></span>
<span class="line"><span>  // 循环执行10次此代码块</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int i = 0;</span></span>
<span class="line"><span>while (i &amp;lt; 10) {</span></span>
<span class="line"><span>  // 循环执行10次此代码块</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>continue、break、return，代码示例如下所示：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (int i = 0; i &amp;lt; 10; ++i) {</span></span>
<span class="line"><span>  if (i == 4) {</span></span>
<span class="line"><span>    continue; //跳过本次循环，不会打印出4这个值</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  System.out.println(i);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for (int i = 0; i &amp;lt; 10; ++i) {</span></span>
<span class="line"><span>  if (i == 4) {</span></span>
<span class="line"><span>    break; //提前终止循环，只会打印0、1、2、3</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  System.out.println(i);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void func(int a) {</span></span>
<span class="line"><span>  if (a == 1) {</span></span>
<span class="line"><span>    return; //结束一个函数，从此处返回</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  System.out.println(a);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="类、对象" tabindex="-1">类、对象 <a class="header-anchor" href="#类、对象" aria-label="Permalink to &quot;类、对象&quot;">​</a></h2><p>Java语言使用关键词class来定义一个类，类中包含成员变量（也叫作属性）和方法（也叫作函数），其中有一种特殊的函数叫作构造函数，其命名比较固定，跟类名相同。除此之外，Java语言通过new关键词来创建一个类的对象，并且可以通过构造函数，初始化一些成员变量的值。代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Dog { // 定义了一个Dog类</span></span>
<span class="line"><span>  private int age; // 属性或者成员变量</span></span>
<span class="line"><span>  private int weight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Dog(int age, int weight) { // 构造函数</span></span>
<span class="line"><span>    this.age = age;</span></span>
<span class="line"><span>    this.weight = weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getAge() { // 函数或者方法</span></span>
<span class="line"><span>    return age;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getWeigt() {</span></span>
<span class="line"><span>    return weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Dog dog1 = new Dog(2, 10);//通过new关键词创建了一个Dog对象dog1</span></span>
<span class="line"><span>int age = dog1.getAge();//调用dog1的getAge()方法</span></span>
<span class="line"><span>dog1.run();//调用dog1的run()方法</span></span></code></pre></div><h2 id="权限修饰符" tabindex="-1">权限修饰符 <a class="header-anchor" href="#权限修饰符" aria-label="Permalink to &quot;权限修饰符&quot;">​</a></h2><p>在前面的代码示例中，我们多次用到private、public，它们跟protected一起，构成了Java语言的三个权限修饰符。权限修饰符可以修饰函数、成员变量。</p><ul><li>private修饰的函数或者成员变量，只能在类内部使用。</li><li>protected修饰的函数或者成员变量，可以在类及其子类内使用。</li><li>public修饰的函数或者成员变量，可以被任意访问。</li></ul><p>除此之外，权限修饰符还可以修饰类，不过，专栏中所有的类定义都是public访问权限的，所以，我们可以不用去了解三个修饰符修饰类的区别。</p><p>对于权限修饰符的理解，我们可以参看下面的代码示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Dog {// public修饰类</span></span>
<span class="line"><span>  private int age; // private修饰属性，只能在类内部使用</span></span>
<span class="line"><span>  private int weight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Dog(int age, int weight) {</span></span>
<span class="line"><span>    this.age = age;</span></span>
<span class="line"><span>    this.weight = weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getAge() { //public修饰的方法，任意代码都是可以调用</span></span>
<span class="line"><span>    return age;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="继承" tabindex="-1">继承 <a class="header-anchor" href="#继承" aria-label="Permalink to &quot;继承&quot;">​</a></h2><p>Java语言使用extends关键字来实现继承。被继承的类叫作父类，继承类叫作子类。子类继承父类的所有非private属性和方法。具体的代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Animal { // 父类</span></span>
<span class="line"><span>  protected int age;</span></span>
<span class="line"><span>  protected int weight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Animal(int age, int weight) {</span></span>
<span class="line"><span>    this.age = age;</span></span>
<span class="line"><span>    this.weight = weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getAge() { // 函数或者方法</span></span>
<span class="line"><span>    return age;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getWeigt() {</span></span>
<span class="line"><span>    return weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Dog extends Animal { // 子类</span></span>
<span class="line"><span>  public Dog(int age, int weight) { // 构造函数</span></span>
<span class="line"><span>    super(age, weight); //调用父类的构造函数</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void wangwang() {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Cat extends Animal { //子类</span></span>
<span class="line"><span>  public Cat(int age, int weight) { // 构造函数</span></span>
<span class="line"><span>    super(age, weight); //调用父类的构造函数</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void miaomiao() {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//使用举例</span></span>
<span class="line"><span>Dog dog = new Dog(2, 8);</span></span>
<span class="line"><span>dog.run();</span></span>
<span class="line"><span>dog.wangwang();</span></span>
<span class="line"><span>Cat cat = new Cat(1, 3);</span></span>
<span class="line"><span>cat.run();</span></span>
<span class="line"><span>cat.miaomiao();</span></span></code></pre></div><h2 id="接口" tabindex="-1">接口 <a class="header-anchor" href="#接口" aria-label="Permalink to &quot;接口&quot;">​</a></h2><p>Java语言通过interface关键字来定义接口。接口中只能声明方法，不能包含实现，也不能定义属性。类通过implements关键字来实现接口中定义的方法。在专栏的第8讲中，我们会详细讲解接口，所以，这里我只简单介绍一下语法。具体的代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Runnable {</span></span>
<span class="line"><span>  void run();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Dog implements Runnable {</span></span>
<span class="line"><span>  private int age; // 属性或者成员变量</span></span>
<span class="line"><span>  private int weight;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Dog(int age, int weight) { // 构造函数</span></span>
<span class="line"><span>    this.age = age;</span></span>
<span class="line"><span>    this.weight = weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getAge() { // 函数或者方法</span></span>
<span class="line"><span>    return age;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int getWeigt() {</span></span>
<span class="line"><span>    return weight;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void run() { //实现接口中定义的run()方法</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="容器" tabindex="-1">容器 <a class="header-anchor" href="#容器" aria-label="Permalink to &quot;容器&quot;">​</a></h2><p>Java提供了一些现成的容器。容器可以理解为一些工具类，底层封装了各种数据结构。比如ArrayList底层就是数组，LinkedList底层就是链表，HashMap底层就是散列表等。这些容器我们可以拿来直接使用，不用从零开始开发，大大提高了编码的效率。具体的代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DemoA {</span></span>
<span class="line"><span>  private ArrayList&amp;lt;User&amp;gt; users;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addUser(User user) {</span></span>
<span class="line"><span>    users.add(user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="异常处理" tabindex="-1">异常处理 <a class="header-anchor" href="#异常处理" aria-label="Permalink to &quot;异常处理&quot;">​</a></h2><p>Java提供了异常这种出错处理机制。我们可以指直接使用JDK提供的现成的异常类，也可以自定义异常。在Java中，我们通过关键字throw来抛出一个异常，通过throws声明函数抛出异常，通过try-catch-finally语句来捕获异常。代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class UserNotFoundException extends Exception { // 自定义一个异常</span></span>
<span class="line"><span>  public UserNotFoundException() {</span></span>
<span class="line"><span>    super();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserNotFoundException(String message) {</span></span>
<span class="line"><span>    super(message);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserNotFoundException(String message, Throwable e) {</span></span>
<span class="line"><span>    super(message, e);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserService {</span></span>
<span class="line"><span>  private UserRepository userRepo;</span></span>
<span class="line"><span>  public UserService(UseRepository userRepo) {</span></span>
<span class="line"><span>    this.userRepo = userRepo;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public User getUserById(long userId) throws UserNotFoundException {</span></span>
<span class="line"><span>    User user = userRepo.findUserById(userId);</span></span>
<span class="line"><span>    if (user == null) { // throw用来抛出异常</span></span>
<span class="line"><span>      throw new UserNotFoundException();//代码从此处返回</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return user;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span>  private UserService userService;</span></span>
<span class="line"><span>  public UserController(UserService userService) {</span></span>
<span class="line"><span>    this.userService = userService;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public User getUserById(long userId) {</span></span>
<span class="line"><span>    User user = null;</span></span>
<span class="line"><span>    try { //捕获异常</span></span>
<span class="line"><span>      user = userService.getUserById(userId);</span></span>
<span class="line"><span>    } catch (UserNotFoundException e) {</span></span>
<span class="line"><span>      System.out.println(&quot;User not found: &quot; + userId);</span></span>
<span class="line"><span>    } finally { //不管异常会不会发生，finally包裹的语句块总会被执行</span></span>
<span class="line"><span>      System.out.println(&quot;I am always printed.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return user;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="package包" tabindex="-1">package包 <a class="header-anchor" href="#package包" aria-label="Permalink to &quot;package包&quot;">​</a></h2><p>Java通过pacakge关键字来分门别类地组织类，通过import关键字来引入类或者package。具体的代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*class DemoA*/</span></span>
<span class="line"><span>package com.xzg.cd; // 包名com.xzg.cd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class DemoA {</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*class DemoB*/</span></span>
<span class="line"><span>package com.xzg.alg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.HashMap; // Java工具包JDK中的类</span></span>
<span class="line"><span>import java.util.Map;</span></span>
<span class="line"><span>import com.xzg.cd.DemoA;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class DemoB {</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>今天，我带你一块学习了专栏中用到的所有的Java基本语法。不过，我希望你不要纠结于专栏或者某某书籍到底是用什么编程语言来写的。语言层面的东西完全不会限制我的讲解和你的理解。这就像我们读小说一样，不管它是用英语写的，还是中文写的，故事都可以同样精彩。而且，多了解一些Java语法，对于你今后阅读Java语言编写的书籍或者文档，也很有帮助。</p><p>实际上，我之前在Google工作的时候，大家都不太在意自己熟悉的是哪种编程语言，很多同事都是“现学现卖”，什么项目适合用什么语言就现学什么语言。除此之外，Google在招聘的时候，也不限定候选人一定要熟悉哪种编程语言，也很少问跟语言特性相关的问题。因为他们觉得，编程语言只是一个工具，对于一个有一定学习能力的人，学习一门编程语言并不是件难事。</p><p>除此之外，对于专栏中的代码示例，你也可以用你熟悉语言重新实现一遍，我相信这也是件很有意义的事情，也更能加深你对内容的理解。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>不同的公司开发使用的编程语言可能不一样，比如阿里一般都是用Java，今日头条用Go、C++比较多。在招聘上，这些公司都倾向于招聘熟悉相应编程语言的同学，毕竟熟练掌握一门语言也是要花不少时间的，而且用熟悉的编程语言来开发，肯定会更得心应手，更不容易出错。今天课堂讨论的话题有两个：</p><ol><li>分享一下你学习一门编程语言的经历，从入门到熟练掌握，大约花了多久的时间？有什么好的学习编程语言的方法？</li><li>在一个程序员的技术能力评价体系中，你觉得“熟练使用某种编程语言”所占的比重有多大？</li></ol><p>欢迎在留言区写下你的想法，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,66)])])}const g=a(e,[["render",i]]);export{h as __pageData,g as default};
