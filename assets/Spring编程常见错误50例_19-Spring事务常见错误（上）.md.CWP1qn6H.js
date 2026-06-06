import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const h=JSON.parse('{"title":"19 | Spring 事务常见错误（上）","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例1：unchecked 异常与事务回滚","slug":"案例1-unchecked-异常与事务回滚","link":"#案例1-unchecked-异常与事务回滚","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：试图给 private 方法添加事务","slug":"案例-2-试图给-private-方法添加事务","link":"#案例-2-试图给-private-方法添加事务","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/19-Spring事务常见错误（上）.md","filePath":"Spring编程常见错误50例/19-Spring事务常见错误（上）.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/19-Spring事务常见错误（上）.md"};function l(i,a,c,o,r,d){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_19-spring-事务常见错误-上" tabindex="-1">19 | Spring 事务常见错误（上） <a class="header-anchor" href="#_19-spring-事务常见错误-上" aria-label="Permalink to &quot;19 | Spring 事务常见错误（上）&quot;">​</a></h1><p>你好，我是傅健。</p><p>通过上节课的学习，我们了解了 Spring Data 操作数据库的一些常见问题。这节课我们聊一聊数据库操作中的一个非常重要的话题——事务管理。</p><p>Spring 事务管理包含两种配置方式，第一种是使用 XML 进行模糊匹配，绑定事务管理；第二种是使用注解，这种方式可以对每个需要进行事务处理的方法进行单独配置，你只需要添加上@Transactional，然后在注解内添加属性配置即可。在我们的错误案例示范中，我们统一使用更为方便的注解式方式。</p><p>另外，补充一点，Spring 在初始化时，会通过扫描拦截对事务的方法进行增强。如果目标方法存在事务，Spring 就会创建一个 Bean 对应的代理（Proxy）对象，并进行相关的事务处理操作。</p><p>在正式开始讲解事务之前，我们需要搭建一个简单的 Spring 数据库的环境。这里我选择了当下最为流行的 MySQL + Mybatis 作为数据库操作的基本环境。为了正常使用，我们还需要引入一些配置文件和类，简单列举一下。</p><ol><li>数据库配置文件 jdbc.properties，配置了数据连接信息。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jdbc.driver=com.mysql.cj.jdbc.Driver</span></span>
<span class="line"><span></span></span>
<span class="line"><span>jdbc.url=jdbc:mysql://localhost:3306/spring?useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=UTC&amp;useSSL=false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>jdbc.username=root</span></span>
<span class="line"><span>jdbc.password=pass</span></span></code></pre></div><ol start="2"><li>JDBC 的配置类，从上述 jdbc.properties 加载相关配置项，并创建 JdbcTemplate、DataSource、TransactionManager 相关的 Bean 等。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class JdbcConfig {</span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${jdbc.driver}&quot;)</span></span>
<span class="line"><span>    private String driver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${jdbc.url}&quot;)</span></span>
<span class="line"><span>    private String url;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${jdbc.username}&quot;)</span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${jdbc.password}&quot;)</span></span>
<span class="line"><span>    private String password;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean(name = &quot;jdbcTemplate&quot;)</span></span>
<span class="line"><span>    public JdbcTemplate createJdbcTemplate(DataSource dataSource) {</span></span>
<span class="line"><span>        return new JdbcTemplate(dataSource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean(name = &quot;dataSource&quot;)</span></span>
<span class="line"><span>    public DataSource createDataSource() {</span></span>
<span class="line"><span>        DriverManagerDataSource ds = new DriverManagerDataSource();</span></span>
<span class="line"><span>        ds.setDriverClassName(driver);</span></span>
<span class="line"><span>        ds.setUrl(url);</span></span>
<span class="line"><span>        ds.setUsername(username);</span></span>
<span class="line"><span>        ds.setPassword(password);</span></span>
<span class="line"><span>        return ds;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean(name = &quot;transactionManager&quot;)</span></span>
<span class="line"><span>    public PlatformTransactionManager      createTransactionManager(DataSource dataSource) {</span></span>
<span class="line"><span>        return new DataSourceTransactionManager(dataSource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>应用配置类，通过注解的方式，配置了数据源、MyBatis Mapper 的扫描路径以及事务等。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Configuration</span></span>
<span class="line"><span>&amp;#64;ComponentScan</span></span>
<span class="line"><span>&amp;#64;Import({JdbcConfig.class})</span></span>
<span class="line"><span>&amp;#64;PropertySource(&quot;classpath:jdbc.properties&quot;)</span></span>
<span class="line"><span>&amp;#64;MapperScan(&quot;com.spring.puzzle.others.transaction.example1&quot;)</span></span>
<span class="line"><span>&amp;#64;EnableTransactionManagement</span></span>
<span class="line"><span>&amp;#64;EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})</span></span>
<span class="line"><span>&amp;#64;EnableAspectJAutoProxy(proxyTargetClass = true, exposeProxy = true)</span></span>
<span class="line"><span>public class AppConfig {</span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成了上述基础配置和代码后，我们开始进行案例的讲解。</p><h2 id="案例1-unchecked-异常与事务回滚" tabindex="-1">案例1：unchecked 异常与事务回滚 <a class="header-anchor" href="#案例1-unchecked-异常与事务回滚" aria-label="Permalink to &quot;案例1：unchecked 异常与事务回滚&quot;">​</a></h2><p>在系统中，我们需要增加一个学生管理的功能，每一位新生入学后，都会往数据库里存入学生的信息。我们引入了一个学生类 Student 和与之相关的 Mapper。</p><p>其中，Student 定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Student implements Serializable {</span></span>
<span class="line"><span>    private Integer id;</span></span>
<span class="line"><span>    private String realname;</span></span>
<span class="line"><span>    public Integer getId() {</span></span>
<span class="line"><span>        return id;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void setId(Integer id) {</span></span>
<span class="line"><span>        this.id = id;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String getRealname() {</span></span>
<span class="line"><span>        return realname;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void setRealname(String realname) {</span></span>
<span class="line"><span>        this.realname = realname;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Student 对应的 Mapper 类定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Mapper</span></span>
<span class="line"><span>public interface StudentMapper {</span></span>
<span class="line"><span>    &amp;#64;Insert(&quot;INSERT INTO \`student\`(\`realname\`) VALUES (#{realname})&quot;)</span></span>
<span class="line"><span>    void saveStudent(Student student);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对应数据库表的 Schema 如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE \`student\` (</span></span>
<span class="line"><span>  \`id\` int(11) NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`realname\` varchar(255) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span></code></pre></div><p>业务类 StudentService，其中包括一个保存的方法 saveStudent。执行一下保存，一切正常。</p><p>接下来，我们想要测试一下这个事务会不会回滚，于是就写了这样一段逻辑：如果发现用户名是小明，就直接抛出异常，触发事务的回滚操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class StudentService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentMapper studentMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>        Student student = new Student();</span></span>
<span class="line"><span>        student.setRealname(realname);</span></span>
<span class="line"><span>        studentMapper.saveStudent(student);</span></span>
<span class="line"><span>        if (student.getRealname().equals(&quot;小明&quot;)) {</span></span>
<span class="line"><span>            throw new Exception(&quot;该学生已存在&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后使用下面的代码来测试一下，保存一个叫小明的学生，看会不会触发事务的回滚。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AppConfig {</span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);</span></span>
<span class="line"><span>        StudentService studentService = (StudentService) context.getBean(&quot;studentService&quot;);</span></span>
<span class="line"><span>        studentService.saveStudent(&quot;小明&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果打印出了这样的信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;main&quot; java.lang.Exception: 该学生已存在</span></span>
<span class="line"><span>	at com.spring.puzzle.others.transaction.example1.StudentService.saveStudent(StudentService.java:23)</span></span></code></pre></div><p>可以看到，异常确实被抛出来，但是检查数据库，你会发现数据库里插入了一条新的记录。</p><p>但是我们的常规思维可能是：在 Spring 里，抛出异常，就会导致事务回滚，而回滚以后，是不应该有数据存入数据库才对啊。而在这个案例中，异常也抛了，回滚却没有如期而至，这是什么原因呢？我们需要研究一下 Spring 的源码，来找找答案。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>我们通过 debug 沿着 saveStudent 继续往下跟，得到了一个这样的调用栈：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/381193/5723c133b87465e44c6152f67e616152.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/381193/5723c133b87465e44c6152f67e616152.png" alt=""></a></p><p>从这个调用栈中我们看到了熟悉的 CglibAopProxy，另外事务本质上也是一种特殊的切面，在创建的过程中，被 CglibAopProxy 代理。事务处理的拦截器是 TransactionInterceptor，它支撑着整个事务功能的架构，我们来分析下这个拦截器是如何实现事务特性的。</p><p>首先，TransactionInterceptor 继承类 TransactionAspectSupport，实现了接口 MethodInterceptor。当执行代理类的目标方法时，会触发invoke()。由于我们的关注重点是在异常处理上，所以直奔主题，跳到异常处理相关的部分。当它 catch 到异常时，会调用 completeTransactionAfterThrowing 方法做进一步处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object invokeWithinTransaction(Method method, &amp;#64;Nullable Class&amp;lt;?&amp;gt; targetClass,</span></span>
<span class="line"><span>      final InvocationCallback invocation) throws Throwable {</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>      Object retVal;</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>         retVal = invocation.proceedWithInvocation();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (Throwable ex) {</span></span>
<span class="line"><span>         completeTransactionAfterThrowing(txInfo, ex);</span></span>
<span class="line"><span>         throw ex;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      finally {</span></span>
<span class="line"><span>         cleanupTransactionInfo(txInfo);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 completeTransactionAfterThrowing 的代码中，有这样一个方法 rollbackOn()，这是事务的回滚的关键判断条件。当这个条件满足时，会触发 rollback 操作，事务回滚。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void completeTransactionAfterThrowing(&amp;#64;Nullable TransactionInfo txInfo, Throwable ex) {</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>    //判断是否需要回滚</span></span>
<span class="line"><span>    if (txInfo.transactionAttribute != null &amp;&amp; txInfo.transactionAttribute.rollbackOn(ex)) {</span></span>
<span class="line"><span>       try {</span></span>
<span class="line"><span>       //执行回滚</span></span>
<span class="line"><span>txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       catch (TransactionSystemException ex2) {</span></span>
<span class="line"><span>          ex2.initApplicationException(ex);</span></span>
<span class="line"><span>          throw ex2;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>       catch (RuntimeException | Error ex2) {</span></span>
<span class="line"><span>          throw ex2;</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>rollbackOn()其实包括了两个层级，具体可参考如下代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean rollbackOn(Throwable ex) {</span></span>
<span class="line"><span>   // 层级 1：根据&quot;rollbackRules&quot;及当前捕获异常来判断是否需要回滚</span></span>
<span class="line"><span>   RollbackRuleAttribute winner = null;</span></span>
<span class="line"><span>   int deepest = Integer.MAX_VALUE;</span></span>
<span class="line"><span>   if (this.rollbackRules != null) {</span></span>
<span class="line"><span>      for (RollbackRuleAttribute rule : this.rollbackRules) {</span></span>
<span class="line"><span>         // 当前捕获的异常可能是回滚“异常”的继承体系中的“一员”</span></span>
<span class="line"><span>         int depth = rule.getDepth(ex);</span></span>
<span class="line"><span>         if (depth &amp;gt;= 0 &amp;&amp; depth &amp;lt; deepest) {</span></span>
<span class="line"><span>            deepest = depth;</span></span>
<span class="line"><span>            winner = rule;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   // 层级 2：调用父类的 rollbackOn 方法来决策是否需要 rollback</span></span>
<span class="line"><span>   if (winner == null) {</span></span>
<span class="line"><span>      return super.rollbackOn(ex);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return !(winner instanceof NoRollbackRuleAttribute);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li>RuleBasedTransactionAttribute 自身的 rollbackOn()</li></ol><p>当我们在 @Transactional 中配置了 rollbackFor，这个方法就会用捕获到的异常和 rollbackFor 中配置的异常做比较。如果捕获到的异常是 rollbackFor 配置的异常或其子类，就会直接 rollback。在我们的案例中，由于在事务的注解中没有加任何规则，所以这段逻辑处理其实找不到规则（即 winner == null），进而走到下一步。</p><ol start="2"><li>RuleBasedTransactionAttribute 父类 DefaultTransactionAttribute 的 rollbackOn()</li></ol><p>如果没有在 @Transactional 中配置 rollback 属性，或是捕获到的异常和所配置异常的类型不一致，就会继续调用父类的 rollbackOn() 进行处理。</p><p>而在父类的 rollbackOn() 中，我们发现了一个重要的线索，只有在异常类型为 RuntimeException 或者 Error 的时候才会返回 true，此时，会触发 completeTransactionAfterThrowing 方法中的 rollback 操作，事务被回滚。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean rollbackOn(Throwable ex) {</span></span>
<span class="line"><span>   return (ex instanceof RuntimeException || ex instanceof Error);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>查到这里，真相大白，Spring 处理事务的时候，如果没有在 @Transactional 中配置 rollback 属性，那么只有捕获到 RuntimeException 或者 Error 的时候才会触发回滚操作。而我们案例抛出的异常是 Exception，又没有指定与之匹配的回滚规则，所以我们不能触发回滚。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>从上述案例解析中，我们了解到，Spring 在处理事务过程中，并不会对 Exception 进行回滚，而会对 RuntimeException 或者 Error 进行回滚。</p><p>这么看来，修改方法也可以很简单，只需要把抛出的异常类型改成 RuntimeException 就可以了。于是这部分代码就可以修改如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class StudentService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentMapper studentMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>        Student student = new Student();</span></span>
<span class="line"><span>        student.setRealname(realname);</span></span>
<span class="line"><span>        studentMapper.saveStudent(student);</span></span>
<span class="line"><span>        if (student.getRealname().equals(&quot;小明&quot;)) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;该用户已存在&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>再执行一下，这时候异常会正常抛出，数据库里不会有新数据产生，表示这时候 Spring 已经对这个异常进行了处理，并将事务回滚。</p><p>但是很明显，这种修改方法看起来不够优美，毕竟我们的异常有时候是固定死不能随意修改的。所以结合前面的案例分析，我们还有一个更好的修改方式。</p><p>具体而言，我们在解析 RuleBasedTransactionAttribute.rollbackOn 的代码时提到过 rollbackFor 属性的处理规则。也就是我们在 @Transactional 的 rollbackFor 加入需要支持的异常类型（在这里是 Exception）就可以匹配上我们抛出的异常，进而在异常抛出时进行回滚。</p><p>于是我们可以完善下案例中的注解，修改后代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional(rollbackFor = Exception.class)</span></span></code></pre></div><p>再次测试运行，你会发现一切符合预期了。</p><h2 id="案例-2-试图给-private-方法添加事务" tabindex="-1">案例 2：试图给 private 方法添加事务 <a class="header-anchor" href="#案例-2-试图给-private-方法添加事务" aria-label="Permalink to &quot;案例 2：试图给 private 方法添加事务&quot;">​</a></h2><p>接着上一个案例，我们已经实现了保存学生信息的功能。接下来，我们来优化一下逻辑，让学生的创建和保存逻辑分离，于是我就对代码做了一些重构，把Student的实例创建和保存逻辑拆到两个方法中分别进行。然后，把事务的注解 @Transactional 加在了保存数据库的方法上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class StudentService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentMapper studentMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentService studentService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>        Student student = new Student();</span></span>
<span class="line"><span>        student.setRealname(realname);</span></span>
<span class="line"><span>        studentService.doSaveStudent(student);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    private void doSaveStudent(Student student) throws Exception {</span></span>
<span class="line"><span>        studentMapper.saveStudent(student);</span></span>
<span class="line"><span>        if (student.getRealname().equals(&quot;小明&quot;)) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;该用户已存在&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行的时候，继续传入参数“小明”，看看执行结果是什么样子？</p><p>异常正常抛出，事务却没有回滚。明明是在方法上加上了事务的注解啊，为什么没有生效呢？我们还是从 Spring 源码中找答案。</p><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>通过 debug，我们一步步寻找到了问题的根源，得到了以下调用栈。我们通过 Spring 的源码来解析一下完整的过程。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/381193/d87ef9769456803c6d9db35c8d7503ce.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/381193/d87ef9769456803c6d9db35c8d7503ce.png" alt=""></a></p><p>前一段是 Spring 创建 Bean 的过程。当 Bean 初始化之后，开始尝试代理操作，这个过程是从 AbstractAutoProxyCreator 里的 postProcessAfterInitialization 方法开始处理的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Object postProcessAfterInitialization(&amp;#64;Nullable Object bean, String beanName) {</span></span>
<span class="line"><span>   if (bean != null) {</span></span>
<span class="line"><span>      Object cacheKey = getCacheKey(bean.getClass(), beanName);</span></span>
<span class="line"><span>      if (this.earlyProxyReferences.remove(cacheKey) != bean) {</span></span>
<span class="line"><span>         return wrapIfNecessary(bean, beanName, cacheKey);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return bean;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们一路往下找，暂且略过那些非关键要素的代码，直到到了 AopUtils 的 canApply 方法。这个方法就是针对切面定义里的条件，确定这个方法是否可以被应用创建成代理。其中有一段 methodMatcher.matches(method, targetClass) 是用来判断这个方法是否符合这样的条件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static boolean canApply(Pointcut pc, Class&amp;lt;?&amp;gt; targetClass, boolean hasIntroductions) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   for (Class&amp;lt;?&amp;gt; clazz : classes) {</span></span>
<span class="line"><span>      Method[] methods = ReflectionUtils.getAllDeclaredMethods(clazz);</span></span>
<span class="line"><span>      for (Method method : methods) {</span></span>
<span class="line"><span>         if (introductionAwareMethodMatcher != null ?</span></span>
<span class="line"><span>               introductionAwareMethodMatcher.matches(method, targetClass, hasIntroductions) :</span></span>
<span class="line"><span>               methodMatcher.matches(method, targetClass)) {</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从 matches() 调用到了 AbstractFallbackTransactionAttributeSource 的 getTransactionAttribute：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean matches(Method method, Class&amp;lt;?&amp;gt; targetClass) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   TransactionAttributeSource tas = getTransactionAttributeSource();</span></span>
<span class="line"><span>   return (tas == null || tas.getTransactionAttribute(method, targetClass) != null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，getTransactionAttribute 这个方法是用来获取注解中的事务属性，根据属性确定事务采用什么样的策略。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public TransactionAttribute getTransactionAttribute(Method method, &amp;#64;Nullable Class&amp;lt;?&amp;gt; targetClass) {</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>      TransactionAttribute txAttr = computeTransactionAttribute(method, targetClass);</span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>接着调用到 computeTransactionAttribute 这个方法，其主要功能是根据方法和类的类型确定是否返回事务属性，执行代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected TransactionAttribute computeTransactionAttribute(Method method, &amp;#64;Nullable Class&amp;lt;?&amp;gt; targetClass) {</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>   if (allowPublicMethodsOnly() &amp;&amp; !Modifier.isPublic(method.getModifiers())) {</span></span>
<span class="line"><span>      return null;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里有这样一个判断 allowPublicMethodsOnly() &amp;&amp; !Modifier.isPublic(method.getModifiers()) ，当这个判断结果为 true 的时候返回 null，也就意味着这个方法不会被代理，从而导致事务的注解不会生效。那此处的判断值到底是不是 true 呢？我们可以分别看一下。</p><p><strong>条件1：allowPublicMethodsOnly()</strong></p><p>allowPublicMethodsOnly 返回了 AnnotationTransactionAttributeSource 的 publicMethodsOnly 属性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected boolean allowPublicMethodsOnly() {</span></span>
<span class="line"><span>   return this.publicMethodsOnly;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而这个 publicMethodsOnly 属性是通过 AnnotationTransactionAttributeSource 的构造方法初始化的，默认为 true。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public AnnotationTransactionAttributeSource() {</span></span>
<span class="line"><span>   this(true);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>条件2：Modifier.isPublic()</strong></p><p>这个方法根据传入的 method.getModifiers() 获取方法的修饰符。该修饰符是 java.lang.reflect.Modifier 的静态属性，对应的几类修饰符分别是：PUBLIC: 1，PRIVATE: 2，PROTECTED: 4。这里面做了一个位运算，只有当传入的方法修饰符是 public 类型的时候，才返回 true。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static boolean isPublic(int mod) {</span></span>
<span class="line"><span>    return (mod &amp; PUBLIC) != 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>综合上述两个条件，你会发现，只有当注解为事务的方法被声明为 public 的时候，才会被 Spring 处理。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>了解了问题的根源以后，解决它就变得很简单了，我们只需要把它的修饰符从 private 改成 public 就可以了。</p><p>不过需要额外补充的是，我们调用这个加了事务注解的方法，必须是调用被 Spring AOP 代理过的方法，也就是不能通过类的内部调用或者通过 this 的方式调用。所以我们的案例的StudentService，它含有一个自动装配（Autowired）了自身（StudentService）的实例来完成代理方法的调用。这个问题我们在之前 Spring AOP 的代码解析中重点强调过，此处就不再详述了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class StudentService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentMapper studentMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentService studentService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>        Student student = new Student();</span></span>
<span class="line"><span>        student.setRealname(realname);</span></span>
<span class="line"><span>        studentService.doSaveStudent(student);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void doSaveStudent(Student student) throws Exception {</span></span>
<span class="line"><span>        studentMapper.saveStudent(student);</span></span>
<span class="line"><span>        if (student.getRealname().equals(&quot;小明&quot;)) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;该学生已存在&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重新运行一下，异常正常抛出，数据库也没有新数据产生，事务生效了，问题解决。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;main&quot; java.lang.RuntimeException: 该学生已存在</span></span>
<span class="line"><span>	at com.spring.puzzle.others.transaction.example2.StudentService.doSaveStudent(StudentService.java:27)</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过以上两个案例，相信你对 Spring 的声明式事务机制已经有了进一步的了解，最后总结下重点：</p><ul><li>Spring 支持声明式事务机制，它通过在方法上加上@Transactional，表明该方法需要事务支持。于是，在加载的时候，根据 @Transactional 中的属性，决定对该事务采取什么样的策略；</li><li>@Transactional 对 private 方法不生效，所以我们应该把需要支持事务的方法声明为 public 类型；</li><li>Spring 处理事务的时候，默认只对 RuntimeException 和 Error 回滚，不会对Exception 回滚，如果有特殊需要，需要额外声明，例如指明 Transactional 的属性 rollbackFor 为Exception.class。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>RuntimeException 是 Exception 的子类，如果用 rollbackFor=Exception.class，那对 RuntimeException 也会生效。如果我们需要对 Exception 执行回滚操作，但对于 RuntimeException 不执行回滚操作，应该怎么做呢？</p><p>期待你的思考，我们留言区见！</p>`,97)])])}const b=n(t,[["render",l]]);export{h as __pageData,b as default};
