import{_ as a,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"30 | 热点问题答疑（3）：Spring框架中的设计模式","description":"","frontmatter":{},"headers":[{"level":2,"title":"简单工厂模式","slug":"简单工厂模式","link":"#简单工厂模式","children":[]},{"level":2,"title":"工厂方法模式","slug":"工厂方法模式","link":"#工厂方法模式","children":[]},{"level":2,"title":"单例模式","slug":"单例模式","link":"#单例模式","children":[]},{"level":2,"title":"代理模式","slug":"代理模式","link":"#代理模式","children":[]},{"level":2,"title":"本期精华","slug":"本期精华","link":"#本期精华","children":[]},{"level":2,"title":"课后思考","slug":"课后思考","link":"#课后思考","children":[]}],"relativePath":"深入拆解Tomcat&Jetty/30-热点问题答疑（3）：Spring框架中的设计模式.md","filePath":"深入拆解Tomcat&Jetty/30-热点问题答疑（3）：Spring框架中的设计模式.md","lastUpdated":1779821049000}'),l={name:"深入拆解Tomcat&Jetty/30-热点问题答疑（3）：Spring框架中的设计模式.md"};function t(i,n,c,o,r,g){return s(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="_30-热点问题答疑-3-spring框架中的设计模式" tabindex="-1">30 | 热点问题答疑（3）：Spring框架中的设计模式 <a class="header-anchor" href="#_30-热点问题答疑-3-spring框架中的设计模式" aria-label="Permalink to &quot;30 | 热点问题答疑（3）：Spring框架中的设计模式&quot;">​</a></h1><p>在构思这个专栏的时候，回想当时我是如何研究Tomcat和Jetty源码的，除了理解它们的实现之外，也从中学到了很多架构和设计的理念，其中很重要的就是对设计模式的运用，让我收获到不少经验。而且这些经验通过自己消化和吸收，是可以把它应用到实际工作中去的。</p><p>在专栏的热点问题答疑第三篇，我想跟你分享一些我对设计模式的理解。有关Tomcat和Jetty所运用的设计模式我在专栏里已经有所介绍，今天想跟你分享一下Spring框架里的设计模式。Spring的核心功能是IOC容器以及AOP面向切面编程，同样也是很多Web后端工程师每天都要打交道的框架，相信你一定可以从中吸收到一些设计方面的精髓，帮助你提升设计能力。</p><h2 id="简单工厂模式" tabindex="-1">简单工厂模式 <a class="header-anchor" href="#简单工厂模式" aria-label="Permalink to &quot;简单工厂模式&quot;">​</a></h2><p>我们来考虑这样一个场景：当A对象需要调用B对象的方法时，我们需要在A中new一个B的实例，我们把这种方式叫作硬编码耦合，它的缺点是一旦需求发生变化，比如需要使用C类来代替B时，就要改写A类的方法。假如应用中有1000个类以硬编码的方式耦合了B，那改起来就费劲了。于是简单工厂模式就登场了，简单工厂模式又叫静态工厂方法，其实质是由一个工厂类根据传入的参数，动态决定应该创建哪一个产品类。</p><p>Spring中的BeanFactory就是简单工厂模式的体现，BeanFactory是Spring IOC容器中的一个核心接口，它的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface BeanFactory {</span></span>
<span class="line"><span>   Object getBean(String name) throws BeansException;</span></span>
<span class="line"><span>   &lt;​T&gt; T getBean(String name, Class&lt;​T&gt; requiredType);</span></span>
<span class="line"><span>   Object getBean(String name, Object... args);</span></span>
<span class="line"><span>   &lt;​T&gt; T getBean(Class&lt;​T&gt; requiredType);</span></span>
<span class="line"><span>   &lt;​T&gt; T getBean(Class&lt;​T&gt; requiredType, Object... args);</span></span>
<span class="line"><span>   boolean containsBean(String name);</span></span>
<span class="line"><span>   boolean isSingleton(String name);</span></span>
<span class="line"><span>   boolea isPrototype(String name);</span></span>
<span class="line"><span>   boolean isTypeMatch(String name, ResolvableType typeToMatch);</span></span>
<span class="line"><span>   boolean isTypeMatch(String name, Class&lt;?&gt; typeToMatch);</span></span>
<span class="line"><span>   Class&lt;?&gt; getType(String name);</span></span>
<span class="line"><span>   String[] getAliases(String name);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以通过它的具体实现类（比如ClassPathXmlApplicationContext）来获取Bean：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BeanFactory bf = new ClassPathXmlApplicationContext(&quot;spring.xml&quot;);</span></span>
<span class="line"><span>User userBean = (User) bf.getBean(&quot;userBean&quot;);</span></span></code></pre></div><p>从上面代码可以看到，使用者不需要自己来new对象，而是通过工厂类的方法getBean来获取对象实例，这是典型的简单工厂模式，只不过Spring是用反射机制来创建Bean的。</p><h2 id="工厂方法模式" tabindex="-1">工厂方法模式 <a class="header-anchor" href="#工厂方法模式" aria-label="Permalink to &quot;工厂方法模式&quot;">​</a></h2><p>工厂方法模式说白了其实就是简单工厂模式的一种升级或者说是进一步抽象，它可以应用于更加复杂的场景，灵活性也更高。在简单工厂中，由工厂类进行所有的逻辑判断、实例创建；如果不想在工厂类中进行判断，可以为不同的产品提供不同的工厂，不同的工厂生产不同的产品，每一个工厂都只对应一个相应的对象，这就是工厂方法模式。</p><p>Spring中的FactoryBean就是这种思想的体现，FactoryBean可以理解为工厂Bean，先来看看它的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface FactoryBean&lt;​T&gt; {</span></span>
<span class="line"><span>  T getObject()；</span></span>
<span class="line"><span>  Class&lt;?&gt; getObjectType();</span></span>
<span class="line"><span>  boolean isSingleton();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们定义一个类UserFactoryBean来实现FactoryBean接口，主要是在getObject方法里new一个User对象。这样我们通过getBean(id) 获得的是该工厂所产生的User的实例，而不是UserFactoryBean本身的实例，像下面这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BeanFactory bf = new ClassPathXmlApplicationContext(&quot;user.xml&quot;);</span></span>
<span class="line"><span>User userBean = (User) bf.getBean(&quot;userFactoryBean&quot;);</span></span></code></pre></div><h2 id="单例模式" tabindex="-1">单例模式 <a class="header-anchor" href="#单例模式" aria-label="Permalink to &quot;单例模式&quot;">​</a></h2><p>单例模式是指一个类在整个系统运行过程中，只允许产生一个实例。在Spring中，Bean可以被定义为两种模式：Prototype（多例）和Singleton（单例），Spring Bean默认是单例模式。那Spring是如何实现单例模式的呢？答案是通过单例注册表的方式，具体来说就是使用了HashMap。请注意为了方便你阅读，我对代码进行了简化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DefaultSingletonBeanRegistry {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //使用了线程安全容器ConcurrentHashMap，保存各种单实例对象</span></span>
<span class="line"><span>    private final Map&lt;​String, Object&gt; singletonObjects = new ConcurrentHashMap&lt;​String, Object&gt;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected Object getSingleton(String beanName) {</span></span>
<span class="line"><span>    //先到HashMap中拿Object</span></span>
<span class="line"><span>    Object singletonObject = singletonObjects.get(beanName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //如果没拿到通过反射创建一个对象实例，并添加到HashMap中</span></span>
<span class="line"><span>    if (singletonObject == null) {</span></span>
<span class="line"><span>      singletonObjects.put(beanName,</span></span>
<span class="line"><span>                           Class.forName(beanName).newInstance());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //返回对象实例</span></span>
<span class="line"><span>   return singletonObjects.get(beanName);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码逻辑比较清晰，先到HashMap去拿单实例对象，没拿到就创建一个添加到HashMap。</p><h2 id="代理模式" tabindex="-1">代理模式 <a class="header-anchor" href="#代理模式" aria-label="Permalink to &quot;代理模式&quot;">​</a></h2><p>所谓代理，是指它与被代理对象实现了相同的接口，客户端必须通过代理才能与被代理的目标类进行交互，而代理一般在交互的过程中（交互前后），进行某些特定的处理，比如在调用这个方法前做前置处理，调用这个方法后做后置处理。代理模式中有下面几种角色：</p><ul><li><strong>抽象接口</strong>：定义目标类及代理类的共同接口，这样在任何可以使用目标对象的地方都可以使用代理对象。</li><li><strong>目标对象</strong>： 定义了代理对象所代表的目标对象，专注于业务功能的实现。</li><li><strong>代理对象</strong>： 代理对象内部含有目标对象的引用，收到客户端的调用请求时，代理对象通常不会直接调用目标对象的方法，而是在调用之前和之后实现一些额外的逻辑。</li></ul><p>代理模式的好处是，可以在目标对象业务功能的基础上添加一些公共的逻辑，比如我们想给目标对象加入日志、权限管理和事务控制等功能，我们就可以使用代理类来完成，而没必要修改目标类，从而使得目标类保持稳定。这其实是开闭原则的体现，不要随意去修改别人已经写好的代码或者方法。</p><p>代理又分为静态代理和动态代理两种方式。静态代理需要定义接口，被代理对象（目标对象）与代理对象（Proxy)一起实现相同的接口，我们通过一个例子来理解一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//抽象接口</span></span>
<span class="line"><span>public interface IStudentDao {</span></span>
<span class="line"><span>    void save();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//目标对象</span></span>
<span class="line"><span>public class StudentDao implements IStudentDao {</span></span>
<span class="line"><span>    public void save() {</span></span>
<span class="line"><span>        System.out.println(&quot;保存成功&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//代理对象</span></span>
<span class="line"><span>public class StudentDaoProxy implements IStudentDao{</span></span>
<span class="line"><span>    //持有目标对象的引用</span></span>
<span class="line"><span>    private IStudentDao target;</span></span>
<span class="line"><span>    public StudentDaoProxy(IStudentDao target){</span></span>
<span class="line"><span>        this.target = target;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //在目标功能对象方法的前后加入事务控制</span></span>
<span class="line"><span>    public void save() {</span></span>
<span class="line"><span>        System.out.println(&quot;开始事务&quot;);</span></span>
<span class="line"><span>        target.save();//执行目标对象的方法</span></span>
<span class="line"><span>        System.out.println(&quot;提交事务&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    //创建目标对象</span></span>
<span class="line"><span>    StudentDao target = new StudentDao();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建代理对象,把目标对象传给代理对象,建立代理关系</span></span>
<span class="line"><span>    StudentDaoProxy proxy = new StudentDaoProxy(target);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //执行的是代理的方法</span></span>
<span class="line"><span>    proxy.save();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而Spring的AOP采用的是动态代理的方式，而动态代理就是指代理类在程序运行时由JVM动态创建。在上面静态代理的例子中，代理类（StudentDaoProxy）是我们自己定义好的，在程序运行之前就已经编译完成。而动态代理，代理类并不是在Java代码中定义的，而是在运行时根据我们在Java代码中的“指示”动态生成的。那我们怎么“指示”JDK去动态地生成代理类呢？</p><p>在Java的 <code>java.lang.reflect</code> 包里提供了一个Proxy类和一个InvocationHandler接口，通过这个类和这个接口可以生成动态代理对象。具体来说有如下步骤：</p><p>1.定义一个InvocationHandler类，将需要扩展的逻辑集中放到这个类中，比如下面的例子模拟了添加事务控制的逻辑。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyInvocationHandler implements InvocationHandler {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Object obj;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyInvocationHandler(Object obj){</span></span>
<span class="line"><span>        this.obj=obj;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object invoke(Object proxy, Method method, Object[] args)</span></span>
<span class="line"><span>            throws Throwable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;开始事务&quot;);</span></span>
<span class="line"><span>        Object result = method.invoke(obj, args);</span></span>
<span class="line"><span>        System.out.println(&quot;开始事务&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>2.使用Proxy的newProxyInstance方法动态的创建代理对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>  //创建目标对象StudentDao</span></span>
<span class="line"><span>  IStudentDao stuDAO = new StudentDao();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //创建MyInvocationHandler对象</span></span>
<span class="line"><span>  InvocationHandler handler = new MyInvocationHandler(stuDAO);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //使用Proxy.newProxyInstance动态的创建代理对象stuProxy</span></span>
<span class="line"><span>  IStudentDao stuProxy = (IStudentDao)</span></span>
<span class="line"><span> Proxy.newProxyInstance(stuDAO.getClass().getClassLoader(), stuDAO.getClass().getInterfaces(), handler);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //动用代理对象的方法</span></span>
<span class="line"><span>  stuProxy.save();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上面的代码实现和静态代理一样的功能，相比于静态代理，动态代理的优势在于可以很方便地对代理类的函数进行统一的处理，而不用修改每个代理类中的方法。</p><p>Spring实现了通过动态代理对类进行方法级别的切面增强，我来解释一下这句话，其实就是动态生成目标对象的代理类，并在代理类的方法中设置拦截器，通过执行拦截器中的逻辑增强了代理方法的功能，从而实现AOP。</p><h2 id="本期精华" tabindex="-1">本期精华 <a class="header-anchor" href="#本期精华" aria-label="Permalink to &quot;本期精华&quot;">​</a></h2><p>今天我和你聊了Spring中的设计模式，我记得我刚毕业那会儿，拿到一个任务时我首先考虑的是怎么把功能实现了，从不考虑设计的问题，因此写出来的代码就显得比较稚嫩。后来随着经验的积累，我会有意识地去思考，这个场景是不是用个设计模式会更高大上呢？以后重构起来是不是会更轻松呢？慢慢我也就形成一个习惯，那就是用优雅的方式去实现一个系统，这也是每个程序员需要经历的过程。</p><p>今天我们学习了Spring的两大核心功能IOC和AOP中用到的一些设计模式，主要有简单工厂模式、工厂方法模式、单例模式和代理模式。而代理模式又分为静态代理和动态代理。JDK提供实现动态代理的机制，除此之外，还可以通过CGLIB来实现，有兴趣的同学可以理解一下它的原理。</p><h2 id="课后思考" tabindex="-1">课后思考 <a class="header-anchor" href="#课后思考" aria-label="Permalink to &quot;课后思考&quot;">​</a></h2><p>注意到在newProxyInstance方法中，传入了目标类的加载器、目标类实现的接口以及MyInvocationHandler三个参数，就能得到一个动态代理对象，请你思考一下newProxyInstance方法是如何实现的。</p><p>不知道今天的内容你消化得如何？如果还有疑问，请大胆的在留言区提问，也欢迎你把你的课后思考和心得记录下来，与我和其他同学一起讨论。如果你觉得今天有所收获，欢迎你把它分享给你的朋友。</p>`,40)])])}const h=a(l,[["render",t]]);export{u as __pageData,h as default};
