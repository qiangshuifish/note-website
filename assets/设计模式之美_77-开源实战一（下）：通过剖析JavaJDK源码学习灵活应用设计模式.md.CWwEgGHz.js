import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"77 | 开源实战一（下）：通过剖析Java JDK源码学习灵活应用设计模式","description":"","frontmatter":{},"headers":[{"level":2,"title":"模板模式在Collections类中的应用","slug":"模板模式在collections类中的应用","link":"#模板模式在collections类中的应用","children":[]},{"level":2,"title":"观察者模式在JDK中的应用","slug":"观察者模式在jdk中的应用","link":"#观察者模式在jdk中的应用","children":[]},{"level":2,"title":"单例模式在Runtime类中的应用","slug":"单例模式在runtime类中的应用","link":"#单例模式在runtime类中的应用","children":[]},{"level":2,"title":"其他模式在JDK中的应用汇总","slug":"其他模式在jdk中的应用汇总","link":"#其他模式在jdk中的应用汇总","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/77-开源实战一（下）：通过剖析JavaJDK源码学习灵活应用设计模式.md","filePath":"设计模式之美/77-开源实战一（下）：通过剖析JavaJDK源码学习灵活应用设计模式.md","lastUpdated":1779822055000}'),l={name:"设计模式之美/77-开源实战一（下）：通过剖析JavaJDK源码学习灵活应用设计模式.md"};function t(i,s,c,o,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_77-开源实战一-下-通过剖析java-jdk源码学习灵活应用设计模式" tabindex="-1">77 | 开源实战一（下）：通过剖析Java JDK源码学习灵活应用设计模式 <a class="header-anchor" href="#_77-开源实战一-下-通过剖析java-jdk源码学习灵活应用设计模式" aria-label="Permalink to &quot;77 | 开源实战一（下）：通过剖析Java JDK源码学习灵活应用设计模式&quot;">​</a></h1><p>上一节课，我们讲解了工厂模式、建造者模式、装饰器模式、适配器模式在Java JDK中的应用，其中，Calendar类用到了工厂模式和建造者模式，Collections类用到了装饰器模式、适配器模式。学习的重点是让你了解，在真实的项目中模式的实现和应用更加灵活、多变，会根据具体的场景做实现或者设计上的调整。</p><p>今天，我们继续延续这个话题，再重点讲一下模板模式、观察者模式这两个模式在JDK中的应用。除此之外，我还会对在理论部分已经讲过的一些模式在JDK中的应用做一个汇总，带你一块回忆复习一下。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="模板模式在collections类中的应用" tabindex="-1">模板模式在Collections类中的应用 <a class="header-anchor" href="#模板模式在collections类中的应用" aria-label="Permalink to &quot;模板模式在Collections类中的应用&quot;">​</a></h2><p>我们前面提到，策略、模板、职责链三个模式常用在框架的设计中，提供框架的扩展点，让框架使用者，在不修改框架源码的情况下，基于扩展点定制化框架的功能。Java中的Collections类的sort()函数就是利用了模板模式的这个扩展特性。</p><p>首先，我们看下Collections.sort()函数是如何使用的。我写了一个示例代码，如下所示。这个代码实现了按照不同的排序方式（按照年龄从小到大、按照名字字母序从小到大、按照成绩从大到小）对students数组进行排序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    List&amp;lt;Student&amp;gt; students = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    students.add(new Student(&quot;Alice&quot;, 19, 89.0f));</span></span>
<span class="line"><span>    students.add(new Student(&quot;Peter&quot;, 20, 78.0f));</span></span>
<span class="line"><span>    students.add(new Student(&quot;Leo&quot;, 18, 99.0f));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Collections.sort(students, new AgeAscComparator());</span></span>
<span class="line"><span>    print(students);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Collections.sort(students, new NameAscComparator());</span></span>
<span class="line"><span>    print(students);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Collections.sort(students, new ScoreDescComparator());</span></span>
<span class="line"><span>    print(students);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void print(List&amp;lt;Student&amp;gt; students) {</span></span>
<span class="line"><span>    for (Student s : students) {</span></span>
<span class="line"><span>      System.out.println(s.getName() + &quot; &quot; + s.getAge() + &quot; &quot; + s.getScore());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class AgeAscComparator implements Comparator&amp;lt;Student&amp;gt; {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public int compare(Student o1, Student o2) {</span></span>
<span class="line"><span>      return o1.getAge() - o2.getAge();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class NameAscComparator implements Comparator&amp;lt;Student&amp;gt; {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public int compare(Student o1, Student o2) {</span></span>
<span class="line"><span>      return o1.getName().compareTo(o2.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static class ScoreDescComparator implements Comparator&amp;lt;Student&amp;gt; {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public int compare(Student o1, Student o2) {</span></span>
<span class="line"><span>      if (Math.abs(o1.getScore() - o2.getScore()) &amp;lt; 0.001) {</span></span>
<span class="line"><span>        return 0;</span></span>
<span class="line"><span>      } else if (o1.getScore() &amp;lt; o2.getScore()) {</span></span>
<span class="line"><span>        return 1;</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合刚刚这个例子，我们再来看下，为什么说Collections.sort()函数用到了模板模式？</p><p>Collections.sort()实现了对集合的排序。为了扩展性，它将其中“比较大小”这部分逻辑，委派给用户来实现。如果我们把比较大小这部分逻辑看作整个排序逻辑的其中一个步骤，那我们就可以把它看作模板模式。不过，从代码实现的角度来看，它看起来有点类似之前讲过的JdbcTemplate，并不是模板模式的经典代码实现，而是基于Callback回调机制来实现的。</p><p>不过，在其他资料中，我还看到有人说，Collections.sort()使用的是策略模式。这样的说法也不是没有道理的。如果我们并不把“比较大小”看作排序逻辑中的一个步骤，而是看作一种算法或者策略，那我们就可以把它看作一种策略模式的应用。</p><p>不过，这也不是典型的策略模式，我们前面讲到，在典型的策略模式中，策略模式分为策略的定义、创建、使用这三部分。策略通过工厂模式来创建，并且在程序运行期间，根据配置、用户输入、计算结果等这些不确定因素，动态决定使用哪种策略。而在Collections.sort()函数中，策略的创建并非通过工厂模式，策略的使用也非动态确定。</p><h2 id="观察者模式在jdk中的应用" tabindex="-1">观察者模式在JDK中的应用 <a class="header-anchor" href="#观察者模式在jdk中的应用" aria-label="Permalink to &quot;观察者模式在JDK中的应用&quot;">​</a></h2><p>在讲到观察者模式的时候，我们重点讲解了Google Guava的EventBus框架，它提供了观察者模式的骨架代码。使用EventBus，我们不需要从零开始开发观察者模式。实际上，Java JDK也提供了观察者模式的简单框架实现。在平时的开发中，如果我们不希望引入Google Guava开发库，可以直接使用Java语言本身提供的这个框架类。</p><p>不过，它比EventBus要简单多了，只包含两个类：java.util.Observable和java.util.Observer。前者是被观察者，后者是观察者。它们的代码实现也非常简单，为了方便你查看，我直接copy-paste到了这里。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Observer {</span></span>
<span class="line"><span>    void update(Observable o, Object arg);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Observable {</span></span>
<span class="line"><span>    private boolean changed = false;</span></span>
<span class="line"><span>    private Vector&amp;lt;Observer&amp;gt; obs;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Observable() {</span></span>
<span class="line"><span>        obs = new Vector&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public synchronized void addObserver(Observer o) {</span></span>
<span class="line"><span>        if (o == null)</span></span>
<span class="line"><span>            throw new NullPointerException();</span></span>
<span class="line"><span>        if (!obs.contains(o)) {</span></span>
<span class="line"><span>            obs.addElement(o);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public synchronized void deleteObserver(Observer o) {</span></span>
<span class="line"><span>        obs.removeElement(o);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void notifyObservers() {</span></span>
<span class="line"><span>        notifyObservers(null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void notifyObservers(Object arg) {</span></span>
<span class="line"><span>        Object[] arrLocal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        synchronized (this) {</span></span>
<span class="line"><span>            if (!changed)</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            arrLocal = obs.toArray();</span></span>
<span class="line"><span>            clearChanged();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int i = arrLocal.length-1; i&amp;gt;=0; i--)</span></span>
<span class="line"><span>            ((Observer)arrLocal[i]).update(this, arg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public synchronized void deleteObservers() {</span></span>
<span class="line"><span>        obs.removeAllElements();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected synchronized void setChanged() {</span></span>
<span class="line"><span>        changed = true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected synchronized void clearChanged() {</span></span>
<span class="line"><span>        changed = false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于Observable、Observer的代码实现，大部分都很好理解，我们重点来看其中的两个地方。一个是changed成员变量，另一个是notifyObservers()函数。</p><p><strong>我们先来看changed成员变量。</strong></p><p>它用来表明被观察者（Observable）有没有状态更新。当有状态更新时，我们需要手动调用setChanged()函数，将changed变量设置为true，这样才能在调用notifyObservers()函数的时候，真正触发观察者（Observer）执行update()函数。否则，即便你调用了notifyObservers()函数，观察者的update()函数也不会被执行。</p><p>也就是说，当通知观察者被观察者状态更新的时候，我们需要依次调用setChanged()和notifyObservers()两个函数，单独调用notifyObservers()函数是不起作用的。你觉得这样的设计是不是多此一举呢？这个问题留给你思考，你可以在留言区说说你的看法。</p><p><strong>我们再来看notifyObservers()函数。</strong></p><p>为了保证在多线程环境下，添加、移除、通知观察者三个操作之间不发生冲突，Observable类中的大部分函数都通过synchronized加了锁，不过，也有特例，notifyObservers()这函数就没有加synchronized锁。这是为什么呢？在JDK的代码实现中，notifyObservers()函数是如何保证跟其他函数操作不冲突的呢？这种加锁方法是否存在问题？又存在什么问题呢？</p><p>notifyObservers()函数之所以没有像其他函数那样，一把大锁加在整个函数上，主要还是出于性能的考虑。</p><p>notifyObservers()函数依次执行每个观察者的update()函数，每个update()函数执行的逻辑提前未知，有可能会很耗时。如果在notifyObservers()函数上加synchronized锁，notifyObservers()函数持有锁的时间就有可能会很长，这就会导致其他线程迟迟获取不到锁，影响整个Observable类的并发性能。</p><p>我们知道，Vector类不是线程安全的，在多线程环境下，同时添加、删除、遍历Vector类对象中的元素，会出现不可预期的结果。所以，在JDK的代码实现中，为了避免直接给notifyObservers()函数加锁而出现性能问题，JDK采用了一种折中的方案。这个方案有点类似于我们之前讲过的让迭代器支持”快照“的解决方案。</p><p>在notifyObservers()函数中，我们先拷贝一份观察者列表，赋值给函数的局部变量，我们知道，局部变量是线程私有的，并不在线程间共享。这个拷贝出来的线程私有的观察者列表就相当于一个快照。我们遍历快照，逐一执行每个观察者的update()函数。而这个遍历执行的过程是在快照这个局部变量上操作的，不存在线程安全问题，不需要加锁。所以，我们只需要对拷贝创建快照的过程加锁，加锁的范围减少了很多，并发性能提高了。</p><p>为什么说这是一种折中的方案呢？这是因为，这种加锁方法实际上是存在一些问题的。在创建好快照之后，添加、删除观察者都不会更新快照，新加入的观察者就不会被通知到，新删除的观察者仍然会被通知到。这种权衡是否能接受完全看你的业务场景。实际上，这种处理方式也是多线程编程中减小锁粒度、提高并发性能的常用方法。</p><h2 id="单例模式在runtime类中的应用" tabindex="-1">单例模式在Runtime类中的应用 <a class="header-anchor" href="#单例模式在runtime类中的应用" aria-label="Permalink to &quot;单例模式在Runtime类中的应用&quot;">​</a></h2><p>JDK中java.lang.Runtime类就是一个单例类。这个类你有没有比较眼熟呢？是的，我们之前讲到Callback回调的时候，添加shutdown hook就是通过这个类来实现的。</p><p>每个Java应用在运行时会启动一个JVM进程，每个JVM进程都只对应一个Runtime实例，用于查看JVM状态以及控制JVM行为。进程内唯一，所以比较适合设计为单例。在编程的时候，我们不能自己去实例化一个Runtime对象，只能通过getRuntime()静态方法来获得。</p><p>Runtime类的的代码实现如下所示。这里面只包含部分相关代码，其他代码做了省略。从代码中，我们也可以看出，它使用了最简单的饿汉式的单例实现方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Every Java application has a single instance of class</span></span>
<span class="line"><span> * &amp;lt;code&amp;gt;Runtime&amp;lt;/code&amp;gt; that allows the application to interface with</span></span>
<span class="line"><span> * the environment in which the application is running. The current</span></span>
<span class="line"><span> * runtime can be obtained from the &amp;lt;code&amp;gt;getRuntime&amp;lt;/code&amp;gt; method.</span></span>
<span class="line"><span> * &amp;lt;p&amp;gt;</span></span>
<span class="line"><span> * An application cannot create its own instance of this class.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * &amp;#64;author  unascribed</span></span>
<span class="line"><span> * &amp;#64;see     java.lang.Runtime#getRuntime()</span></span>
<span class="line"><span> * &amp;#64;since   JDK1.0</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Runtime {</span></span>
<span class="line"><span>  private static Runtime currentRuntime = new Runtime();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static Runtime getRuntime() {</span></span>
<span class="line"><span>    return currentRuntime;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  /** Don&#39;t let anyone else instantiate this class */</span></span>
<span class="line"><span>  private Runtime() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //....</span></span>
<span class="line"><span>  public void addShutdownHook(Thread hook) {</span></span>
<span class="line"><span>    SecurityManager sm = System.getSecurityManager();</span></span>
<span class="line"><span>    if (sm != null) {</span></span>
<span class="line"><span>       sm.checkPermission(new RuntimePermission(&quot;shutdownHooks&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ApplicationShutdownHooks.add(hook);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="其他模式在jdk中的应用汇总" tabindex="-1">其他模式在JDK中的应用汇总 <a class="header-anchor" href="#其他模式在jdk中的应用汇总" aria-label="Permalink to &quot;其他模式在JDK中的应用汇总&quot;">​</a></h2><p>实际上，我们在讲解理论部分的时候，已经讲过很多模式在Java JDK中的应用了。这里我们一块再回顾一下，如果你对哪一部分有所遗忘，可以再回过头去看下。</p><p>在讲到模板模式的时候，我们结合Java Servlet、JUnit TestCase、Java InputStream、Java AbstractList四个例子，来具体讲解了它的两个作用：扩展性和复用性。</p><p>在讲到享元模式的时候，我们讲到Integer类中的-128~127之间的整型对象是可以复用的，还讲到String类型中的常量字符串也是可以复用的。这些都是享元模式的经典应用。</p><p>在讲到职责链模式的时候，我们讲到\bJava Servlet中的Filter就是通过职责链来实现的，同时还对比了Spring中的interceptor。实际上，拦截器、过滤器这些功能绝大部分都是采用职责链模式来实现的。</p><p>在讲到的迭代器模式的时候，我们重点剖析了Java中Iterator迭代器的实现，手把手带你实现了一个针对线性数据结构的迭代器。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>这两节课主要剖析了JDK中用到的几个经典设计模式，其中重点剖析的有：工厂模式、建造者模式、装饰器模式、适配器模式、模板模式、观察者模式，除此之外，我们还汇总了其他模式在JDK中的应用，比如：单例模式、享元模式、职责链模式、迭代器模式。</p><p>实际上，源码都很简单，理解起来都不难，都没有跳出我们之前讲解的理论知识的范畴。学习的重点并不是表面上去理解、记忆某某类用了某某设计模式，而是让你了解我反复强调的一点，也是标题中突出的一点，在真实的项目开发中，如何灵活应用设计模式，做到活学活用，能够根据具体的场景、需求，做灵活的设计和实现上的调整。这也是模式新手和老手的最大区别。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>针对Java JDK中观察者模式的代码实现，我有两个问题请你思考。</p><ol><li>每个函数都加一把synchronized大锁，会不会影响并发性能？有没有优化的方法？</li><li>changed成员变量是否多此一举？</li></ol><p>欢迎留言和我分享你的想法，如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,46)])])}const h=n(l,[["render",t]]);export{m as __pageData,h as default};
