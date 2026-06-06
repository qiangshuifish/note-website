import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"28 | 原型模式与享元模式：提升系统性能的利器","description":"","frontmatter":{},"headers":[{"level":2,"title":"原型模式","slug":"原型模式","link":"#原型模式","children":[{"level":3,"title":"实现原型模式","slug":"实现原型模式","link":"#实现原型模式","children":[]},{"level":3,"title":"深拷贝和浅拷贝","slug":"深拷贝和浅拷贝","link":"#深拷贝和浅拷贝","children":[]},{"level":3,"title":"适用场景","slug":"适用场景","link":"#适用场景","children":[]}]},{"level":2,"title":"享元模式","slug":"享元模式","link":"#享元模式","children":[{"level":3,"title":"实现享元模式","slug":"实现享元模式","link":"#实现享元模式","children":[]},{"level":3,"title":"适用场景","slug":"适用场景-1","link":"#适用场景-1","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Java性能调优实战/28-原型模式与享元模式：提升系统性能的利器.md","filePath":"Java性能调优实战/28-原型模式与享元模式：提升系统性能的利器.md","lastUpdated":1779815864000}'),l={name:"Java性能调优实战/28-原型模式与享元模式：提升系统性能的利器.md"};function t(i,s,c,o,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_28-原型模式与享元模式-提升系统性能的利器" tabindex="-1">28 | 原型模式与享元模式：提升系统性能的利器 <a class="header-anchor" href="#_28-原型模式与享元模式-提升系统性能的利器" aria-label="Permalink to &quot;28 | 原型模式与享元模式：提升系统性能的利器&quot;">​</a></h1><p>你好，我是刘超。</p><p>原型模式和享元模式，前者是在创建多个实例时，对创建过程的性能进行调优；后者是用减少创建实例的方式，来调优系统性能。这么看，你会不会觉得两个模式有点相互矛盾呢？</p><p>其实不然，它们的使用是分场景的。在有些场景下，我们需要重复创建多个实例，例如在循环体中赋值一个对象，此时我们就可以采用原型模式来优化对象的创建过程；而在有些场景下，我们则可以避免重复创建多个实例，在内存中共享对象就好了。</p><p>今天我们就来看看这两种模式的适用场景，了解了这些你就可以更高效地使用它们提升系统性能了。</p><h2 id="原型模式" tabindex="-1">原型模式 <a class="header-anchor" href="#原型模式" aria-label="Permalink to &quot;原型模式&quot;">​</a></h2><p>我们先来了解下原型模式的实现。原型模式是通过给出一个原型对象来指明所创建的对象的类型，然后使用自身实现的克隆接口来复制这个原型对象，该模式就是用这种方式来创建出更多同类型的对象。</p><p>使用这种方式创建新的对象的话，就无需再通过new实例化来创建对象了。这是因为Object类的clone方法是一个本地方法，它可以直接操作内存中的二进制流，所以性能相对new实例化来说，更佳。</p><h3 id="实现原型模式" tabindex="-1">实现原型模式 <a class="header-anchor" href="#实现原型模式" aria-label="Permalink to &quot;实现原型模式&quot;">​</a></h3><p>我们现在通过一个简单的例子来实现一个原型模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   //实现Cloneable 接口的原型抽象类Prototype</span></span>
<span class="line"><span>   class Prototype implements Cloneable {</span></span>
<span class="line"><span>        //重写clone方法</span></span>
<span class="line"><span>        public Prototype clone(){</span></span>
<span class="line"><span>            Prototype prototype = null;</span></span>
<span class="line"><span>            try{</span></span>
<span class="line"><span>                prototype = (Prototype)super.clone();</span></span>
<span class="line"><span>            }catch(CloneNotSupportedException e){</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return prototype;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //实现原型类</span></span>
<span class="line"><span>    class ConcretePrototype extends Prototype{</span></span>
<span class="line"><span>        public void show(){</span></span>
<span class="line"><span>            System.out.println(&quot;原型模式实现类&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public class Client {</span></span>
<span class="line"><span>        public static void main(String[] args){</span></span>
<span class="line"><span>            ConcretePrototype cp = new ConcretePrototype();</span></span>
<span class="line"><span>            for(int i=0; i&amp;lt; 10; i++){</span></span>
<span class="line"><span>                ConcretePrototype clonecp = (ConcretePrototype)cp.clone();</span></span>
<span class="line"><span>                clonecp.show();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><strong>要实现一个原型类，需要具备三个条件：</strong></p><ul><li>实现Cloneable接口：Cloneable接口与序列化接口的作用类似，它只是告诉虚拟机可以安全地在实现了这个接口的类上使用clone方法。在JVM中，只有实现了Cloneable接口的类才可以被拷贝，否则会抛出CloneNotSupportedException异常。</li><li>重写Object类中的clone方法：在Java中，所有类的父类都是Object类，而Object类中有一个clone方法，作用是返回对象的一个拷贝。</li><li>在重写的clone方法中调用super.clone()：默认情况下，类不具备复制对象的能力，需要调用super.clone()来实现。</li></ul><p>从上面我们可以看出，原型模式的主要特征就是使用clone方法复制一个对象。通常，有些人会误以为 Object a=new Object();Object b=a; 这种形式就是一种对象复制的过程，然而这种复制只是对象引用的复制，也就是a和b对象指向了同一个内存地址，如果b修改了，a的值也就跟着被修改了。</p><p>我们可以通过一个简单的例子来看看普通的对象复制问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Student {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        this.name= name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String args[]) {</span></span>
<span class="line"><span>        Student stu1 = new Student();</span></span>
<span class="line"><span>        stu1.setName(&quot;test1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Student stu2 = stu1;</span></span>
<span class="line"><span>        stu2.setName(&quot;test2&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;学生1:&quot; + stu1.getName());</span></span>
<span class="line"><span>        System.out.println(&quot;学生2:&quot; + stu2.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果是复制对象，此时打印的日志应该为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>学生1:test1</span></span>
<span class="line"><span>学生2:test2</span></span></code></pre></div><p>然而，实际上是：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>学生1:test2</span></span>
<span class="line"><span>学生2:test2</span></span></code></pre></div><p>通过clone方法复制的对象才是真正的对象复制，clone方法赋值的对象完全是一个独立的对象。刚刚讲过了，Object类的clone方法是一个本地方法，它直接操作内存中的二进制流，特别是复制大对象时，性能的差别非常明显。我们可以用 clone 方法再实现一遍以上例子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//学生类实现Cloneable接口</span></span>
<span class="line"><span>class Student implements Cloneable{</span></span>
<span class="line"><span>    private String name;  //姓名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        this.name= name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   //重写clone方法</span></span>
<span class="line"><span>   public Student clone() {</span></span>
<span class="line"><span>        Student student = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            student = (Student) super.clone();</span></span>
<span class="line"><span>            } catch (CloneNotSupportedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return student;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String args[]) {</span></span>
<span class="line"><span>        Student stu1 = new Student();  //创建学生1</span></span>
<span class="line"><span>        stu1.setName(&quot;test1&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Student stu2 = stu1.clone();  //通过克隆创建学生2</span></span>
<span class="line"><span>        stu2.setName(&quot;test2&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;学生1:&quot; + stu1.getName());</span></span>
<span class="line"><span>        System.out.println(&quot;学生2:&quot; + stu2.getName());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>学生1:test1</span></span>
<span class="line"><span>学生2:test2</span></span></code></pre></div><h3 id="深拷贝和浅拷贝" tabindex="-1">深拷贝和浅拷贝 <a class="header-anchor" href="#深拷贝和浅拷贝" aria-label="Permalink to &quot;深拷贝和浅拷贝&quot;">​</a></h3><p>在调用super.clone()方法之后，首先会检查当前对象所属的类是否支持clone，也就是看该类是否实现了Cloneable接口。</p><p>如果支持，则创建当前对象所属类的一个新对象，并对该对象进行初始化，使得新对象的成员变量的值与当前对象的成员变量的值一模一样，但对于其它对象的引用以及List等类型的成员属性，则只能复制这些对象的引用了。所以简单调用super.clone()这种克隆对象方式，就是一种浅拷贝。</p><p>所以，当我们在使用clone()方法实现对象的克隆时，就需要注意浅拷贝带来的问题。我们再通过一个例子来看看浅拷贝。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//定义学生类</span></span>
<span class="line"><span>class Student implements Cloneable{</span></span>
<span class="line"><span>    private String name; //学生姓名</span></span>
<span class="line"><span>    private Teacher teacher; //定义老师类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        this.name = name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Teacher getTeacher() {</span></span>
<span class="line"><span>        return teacher;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setTeacher(Teacher teacher) {</span></span>
<span class="line"><span>        this.teacher = teacher;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>   //重写克隆方法</span></span>
<span class="line"><span>   public Student clone() {</span></span>
<span class="line"><span>        Student student = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            student = (Student) super.clone();</span></span>
<span class="line"><span>            } catch (CloneNotSupportedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return student;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//定义老师类</span></span>
<span class="line"><span>class Teacher implements Cloneable{</span></span>
<span class="line"><span>    private String name;  //老师姓名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setName(String name) {</span></span>
<span class="line"><span>        this.name= name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //重写克隆方法，堆老师类进行克隆</span></span>
<span class="line"><span>   public Teacher clone() {</span></span>
<span class="line"><span>        Teacher teacher= null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            teacher= (Teacher) super.clone();</span></span>
<span class="line"><span>            } catch (CloneNotSupportedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return student;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String args[]) {</span></span>
<span class="line"><span>        Teacher teacher = new Teacher (); //定义老师1</span></span>
<span class="line"><span>        teacher.setName(&quot;刘老师&quot;);</span></span>
<span class="line"><span>        Student stu1 = new Student();  //定义学生1</span></span>
<span class="line"><span>        stu1.setName(&quot;test1&quot;);</span></span>
<span class="line"><span>        stu1.setTeacher(teacher);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Student stu2 = stu1.clone(); //定义学生2</span></span>
<span class="line"><span>        stu2.setName(&quot;test2&quot;);</span></span>
<span class="line"><span>        stu2.getTeacher().setName(&quot;王老师&quot;);//修改老师</span></span>
<span class="line"><span>        System.out.println(&quot;学生&quot; + stu1.getName + &quot;的老师是:&quot; + stu1.getTeacher().getName);</span></span>
<span class="line"><span>        System.out.println(&quot;学生&quot; + stu1.getName + &quot;的老师是:&quot; + stu2.getTeacher().getName);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>学生test1的老师是：王老师</span></span>
<span class="line"><span>学生test2的老师是：王老师</span></span></code></pre></div><p>观察以上运行结果，我们可以发现：在我们给学生2修改老师的时候，学生1的老师也跟着被修改了。这就是浅拷贝带来的问题。</p><p>我们可以通过深拷贝来解决这种问题，其实深拷贝就是基于浅拷贝来递归实现具体的每个对象，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>   public Student clone() {</span></span>
<span class="line"><span>        Student student = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            student = (Student) super.clone();</span></span>
<span class="line"><span>            Teacher teacher = this.teacher.clone();//克隆teacher对象</span></span>
<span class="line"><span>            student.setTeacher(teacher);</span></span>
<span class="line"><span>            } catch (CloneNotSupportedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return student;</span></span>
<span class="line"><span>   }</span></span></code></pre></div><h3 id="适用场景" tabindex="-1">适用场景 <a class="header-anchor" href="#适用场景" aria-label="Permalink to &quot;适用场景&quot;">​</a></h3><p>前面我详述了原型模式的实现原理，那到底什么时候我们要用它呢？</p><p>在一些重复创建对象的场景下，我们就可以使用原型模式来提高对象的创建性能。例如，我在开头提到的，循环体内创建对象时，我们就可以考虑用clone的方式来实现。</p><p>例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for(int i=0; i&amp;lt;list.size(); i++){</span></span>
<span class="line"><span>  Student stu = new Student();</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以优化为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Student stu = new Student();</span></span>
<span class="line"><span>for(int i=0; i&amp;lt;list.size(); i++){</span></span>
<span class="line"><span> Student stu1 = (Student)stu.clone();</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>除此之外，原型模式在开源框架中的应用也非常广泛。例如Spring中，@Service默认都是单例的。用了私有全局变量，若不想影响下次注入或每次上下文获取bean，就需要用到原型模式，我们可以通过以下注解来实现，@Scope(“prototype”)。</p><h2 id="享元模式" tabindex="-1">享元模式 <a class="header-anchor" href="#享元模式" aria-label="Permalink to &quot;享元模式&quot;">​</a></h2><p>享元模式是运用共享技术有效地最大限度地复用细粒度对象的一种模式。该模式中，以对象的信息状态划分，可以分为内部数据和外部数据。内部数据是对象可以共享出来的信息，这些信息不会随着系统的运行而改变；外部数据则是在不同运行时被标记了不同的值。</p><p>享元模式一般可以分为三个角色，分别为 Flyweight（抽象享元类）、ConcreteFlyweight（具体享元类）和 FlyweightFactory（享元工厂类）。抽象享元类通常是一个接口或抽象类，向外界提供享元对象的内部数据或外部数据；具体享元类是指具体实现内部数据共享的类；享元工厂类则是主要用于创建和管理享元对象的工厂类。</p><h3 id="实现享元模式" tabindex="-1">实现享元模式 <a class="header-anchor" href="#实现享元模式" aria-label="Permalink to &quot;实现享元模式&quot;">​</a></h3><p>我们还是通过一个简单的例子来实现一个享元模式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//抽象享元类</span></span>
<span class="line"><span>interface Flyweight {</span></span>
<span class="line"><span>    //对外状态对象</span></span>
<span class="line"><span>    void operation(String name);</span></span>
<span class="line"><span>    //对内对象</span></span>
<span class="line"><span>    String getType();</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//具体享元类</span></span>
<span class="line"><span>class ConcreteFlyweight implements Flyweight {</span></span>
<span class="line"><span>    private String type;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ConcreteFlyweight(String type) {</span></span>
<span class="line"><span>        this.type = type;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void operation(String name) {</span></span>
<span class="line"><span>        System.out.printf(&quot;[类型(内在状态)] - [%s] - [名字(外在状态)] - [%s]\\n&quot;, type, name);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String getType() {</span></span>
<span class="line"><span>        return type;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//享元工厂类</span></span>
<span class="line"><span>class FlyweightFactory {</span></span>
<span class="line"><span>    private static final Map&amp;lt;String, Flyweight&amp;gt; FLYWEIGHT_MAP = new HashMap&amp;lt;&amp;gt;();//享元池，用来存储享元对象</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static Flyweight getFlyweight(String type) {</span></span>
<span class="line"><span>        if (FLYWEIGHT_MAP.containsKey(type)) {//如果在享元池中存在对象，则直接获取</span></span>
<span class="line"><span>            return FLYWEIGHT_MAP.get(type);</span></span>
<span class="line"><span>        } else {//在响应池不存在，则新创建对象，并放入到享元池</span></span>
<span class="line"><span>            ConcreteFlyweight flyweight = new ConcreteFlyweight(type);</span></span>
<span class="line"><span>            FLYWEIGHT_MAP.put(type, flyweight);</span></span>
<span class="line"><span>            return flyweight;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Client {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Flyweight fw0 = FlyweightFactory.getFlyweight(&quot;a&quot;);</span></span>
<span class="line"><span>        Flyweight fw1 = FlyweightFactory.getFlyweight(&quot;b&quot;);</span></span>
<span class="line"><span>        Flyweight fw2 = FlyweightFactory.getFlyweight(&quot;a&quot;);</span></span>
<span class="line"><span>        Flyweight fw3 = FlyweightFactory.getFlyweight(&quot;b&quot;);</span></span>
<span class="line"><span>        fw1.operation(&quot;abc&quot;);</span></span>
<span class="line"><span>        System.out.printf(&quot;[结果(对象对比)] - [%s]\\n&quot;, fw0 == fw2);</span></span>
<span class="line"><span>        System.out.printf(&quot;[结果(内在状态)] - [%s]\\n&quot;, fw1.getType());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[类型(内在状态)] - [b] - [名字(外在状态)] - [abc]</span></span>
<span class="line"><span>[结果(对象对比)] - [true]</span></span>
<span class="line"><span>[结果(内在状态)] - [b]</span></span></code></pre></div><p>观察以上代码运行结果，我们可以发现：如果对象已经存在于享元池中，则不会再创建该对象了，而是共用享元池中内部数据一致的对象。这样就减少了对象的创建，同时也节省了同样内部数据的对象所占用的内存空间。</p><h3 id="适用场景-1" tabindex="-1">适用场景 <a class="header-anchor" href="#适用场景-1" aria-label="Permalink to &quot;适用场景&quot;">​</a></h3><p>享元模式在实际开发中的应用也非常广泛。例如Java的String字符串，在一些字符串常量中，会共享常量池中字符串对象，从而减少重复创建相同值对象，占用内存空间。代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> String s1 = &quot;hello&quot;;</span></span>
<span class="line"><span> String s2 = &quot;hello&quot;;</span></span>
<span class="line"><span> System.out.println(s1==s2);//true</span></span></code></pre></div><p>还有，在日常开发中的应用。例如，线程池就是享元模式的一种实现；将商品存储在应用服务的缓存中，那么每当用户获取商品信息时，则不需要每次都从redis缓存或者数据库中获取商品信息，并在内存中重复创建商品信息了。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>通过以上讲解，相信你对原型模式和享元模式已经有了更清楚的了解了。两种模式无论是在开源框架，还是在实际开发中，应用都十分广泛。</p><p>在不得已需要重复创建大量同一对象时，我们可以使用原型模式，通过clone方法复制对象，这种方式比用new和序列化创建对象的效率要高；在创建对象时，如果我们可以共用对象的内部数据，那么通过享元模式共享相同的内部数据的对象，就可以减少对象的创建，实现系统调优。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>上一讲的单例模式和这一讲的享元模式都是为了避免重复创建对象，你知道这两者的区别在哪儿吗？</p><p>期待在留言区看到你的答案。也欢迎你点击“请朋友读”，把今天的内容分享给身边的朋友，邀请他一起讨论。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/109980/bbe343640d6b708832c4133ec53ed967.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/images/109980/bbe343640d6b708832c4133ec53ed967.jpg" alt="unpreview"></a></p>`,65)])])}const g=n(l,[["render",t]]);export{h as __pageData,g as default};
