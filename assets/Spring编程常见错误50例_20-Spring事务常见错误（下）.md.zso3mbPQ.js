import{_ as n,H as s,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"20 | Spring 事务常见错误（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"案例 1：嵌套事务回滚错误","slug":"案例-1-嵌套事务回滚错误","link":"#案例-1-嵌套事务回滚错误","children":[{"level":3,"title":"案例解析","slug":"案例解析","link":"#案例解析","children":[]},{"level":3,"title":"问题修正","slug":"问题修正","link":"#问题修正","children":[]}]},{"level":2,"title":"案例 2：多数据源间切换之谜","slug":"案例-2-多数据源间切换之谜","link":"#案例-2-多数据源间切换之谜","children":[{"level":3,"title":"案例解析","slug":"案例解析-1","link":"#案例解析-1","children":[]},{"level":3,"title":"问题修正","slug":"问题修正-1","link":"#问题修正-1","children":[]}]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"Spring编程常见错误50例/20-Spring事务常见错误（下）.md","filePath":"Spring编程常见错误50例/20-Spring事务常见错误（下）.md","lastUpdated":1779817075000}'),t={name:"Spring编程常见错误50例/20-Spring事务常见错误（下）.md"};function l(i,a,c,o,r,u){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_20-spring-事务常见错误-下" tabindex="-1">20 | Spring 事务常见错误（下） <a class="header-anchor" href="#_20-spring-事务常见错误-下" aria-label="Permalink to &quot;20 | Spring 事务常见错误（下）&quot;">​</a></h1><p>你好，我是傅健。</p><p>通过上一节课的学习，我们了解了 Spring 事务的原理，并解决了几个常见的问题。这节课我们将继续讨论事务中的另外两个问题，一个是关于事务的传播机制，另一个是关于多数据源的切换问题，通过这两个问题，你可以更加深入地了解 Spring 事务的核心机制。</p><h2 id="案例-1-嵌套事务回滚错误" tabindex="-1">案例 1：嵌套事务回滚错误 <a class="header-anchor" href="#案例-1-嵌套事务回滚错误" aria-label="Permalink to &quot;案例 1：嵌套事务回滚错误&quot;">​</a></h2><p>上一节课我们完成了学生注册功能，假设我们需要对这个功能继续进行扩展，当学生注册完成后，需要给这个学生登记一门英语必修课，并更新这门课的登记学生数。为此，我添加了两个表。</p><ol><li>课程表 course，记录课程名称和注册的学生数。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE \`course\` (</span></span>
<span class="line"><span>  \`id\` int(11) NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`course_name\` varchar(64) DEFAULT NULL,</span></span>
<span class="line"><span>  \`number\` int(11) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span></code></pre></div><ol start="2"><li>学生选课表 student_course，记录学生表 student 和课程表 course 之间的多对多关联。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE \`student_course\` (</span></span>
<span class="line"><span>  \`student_id\` int(11) NOT NULL,</span></span>
<span class="line"><span>  \`course_id\` int(11) NOT NULL</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span></code></pre></div><p>同时我为课程表初始化了一条课程信息，id = 1，course_name = &quot;英语&quot;，number = 0。</p><p>接下来我们完成用户的相关操作，主要包括两部分。</p><ol><li>新增学生选课记录</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Mapper</span></span>
<span class="line"><span>public interface StudentCourseMapper {</span></span>
<span class="line"><span>    &amp;#64;Insert(&quot;INSERT INTO \`student_course\`(\`student_id\`, \`course_id\`) VALUES (#{studentId}, #{courseId})&quot;)</span></span>
<span class="line"><span>    void saveStudentCourse(&amp;#64;Param(&quot;studentId&quot;) Integer studentId, &amp;#64;Param(&quot;courseId&quot;) Integer courseId);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>课程登记学生数 + 1</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Mapper</span></span>
<span class="line"><span>public interface CourseMapper {</span></span>
<span class="line"><span>    &amp;#64;Update(&quot;update \`course\` set number = number + 1 where id = #{id}&quot;)</span></span>
<span class="line"><span>    void addCourseNumber(int courseId);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们增加了一个新的业务类 CourseService，用于实现相关业务逻辑。分别调用了上述两个方法来保存学生与课程的关联关系，并给课程注册人数+1。最后，别忘了给这个方法加上事务注解。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class CourseService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private CourseMapper courseMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private StudentCourseMapper studentCourseMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //注意这个方法标记了“Transactional”</span></span>
<span class="line"><span>    &amp;#64;Transactional(rollbackFor = Exception.class)</span></span>
<span class="line"><span>    public void regCourse(int studentId) throws Exception {</span></span>
<span class="line"><span>        studentCourseMapper.saveStudentCourse(studentId, 1);</span></span>
<span class="line"><span>        courseMapper.addCourseNumber(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们在之前的 StudentService.saveStudent() 中调用了 regCourse()，实现了完整的业务逻辑。为了避免注册课程的业务异常导致学生信息无法保存，在这里 catch 了注册课程方法中抛出的异常。我们希望的结果是，当注册课程发生错误时，只回滚注册课程部分，保证学生信息依然正常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class StudentService {</span></span>
<span class="line"><span>  //省略非关键代码</span></span>
<span class="line"><span>  &amp;#64;Transactional(rollbackFor = Exception.class)</span></span>
<span class="line"><span>  public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>      Student student = new Student();</span></span>
<span class="line"><span>      student.setRealname(realname);</span></span>
<span class="line"><span>      studentService.doSaveStudent(student);</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>          courseService.regCourse(student.getId());</span></span>
<span class="line"><span>      } catch (Exception e) {</span></span>
<span class="line"><span>          e.printStackTrace();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了验证异常是否符合预期，我们在 regCourse() 里抛出了一个注册失败的异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional(rollbackFor = Exception.class)</span></span>
<span class="line"><span>public void regCourse(int studentId) throws Exception {</span></span>
<span class="line"><span>    studentCourseMapper.saveStudentCourse(studentId, 1);</span></span>
<span class="line"><span>    courseMapper.addCourseNumber(1);</span></span>
<span class="line"><span>    throw new Exception(&quot;注册失败&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行一下这段代码，在控制台里我们看到了以下提示信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java.lang.Exception: 注册失败</span></span>
<span class="line"><span>	at com.spring.puzzle.others.transaction.example3.CourseService.regCourse(CourseService.java:22)</span></span>
<span class="line"><span>//......省略非关键代码.....</span></span>
<span class="line"><span>Exception in thread &quot;main&quot; org.springframework.transaction.UnexpectedRollbackException: Transaction rolled back because it has been marked as rollback-only</span></span>
<span class="line"><span>	at org.springframework.transaction.support.AbstractPlatformTransactionManager.processRollback(AbstractPlatformTransactionManager.java:873)</span></span>
<span class="line"><span>	at org.springframework.transaction.support.AbstractPlatformTransactionManager.commit(AbstractPlatformTransactionManager.java:710)</span></span>
<span class="line"><span>	at org.springframework.transaction.interceptor.TransactionAspectSupport.commitTransactionAfterReturning(TransactionAspectSupport.java:533)</span></span>
<span class="line"><span>	at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:304)</span></span>
<span class="line"><span>	at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:98)</span></span>
<span class="line"><span>	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:186)</span></span>
<span class="line"><span>	at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:688)</span></span>
<span class="line"><span>	at com.spring.puzzle.others.transaction.example3.StudentService$$EnhancerBySpringCGLIB$$50cda404.saveStudent(&amp;lt;generated&amp;gt;)</span></span>
<span class="line"><span>	at com.spring.puzzle.others.transaction.example3.AppConfig.main(AppConfig.java:22)</span></span></code></pre></div><p>其中，注册失败部分的异常符合预期，但是后面又多了一个这样的错误提示：Transaction rolled back because it has been marked as rollback-only。</p><p>最后的结果是，学生和选课的信息都被回滚了，显然这并不符合我们的预期。我们期待的结果是即便内部事务regCourse()发生异常，外部事务saveStudent()俘获该异常后，内部事务应自行回滚，不影响外部事务。那么这是什么原因造成的呢？我们需要研究一下 Spring 的源码，来找找答案。</p><h3 id="案例解析" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>在做进一步的解析之前，我们可以先通过伪代码把整个事务的结构梳理一下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  // 外层事务</span></span>
<span class="line"><span>  &amp;#64;Transactional(rollbackFor = Exception.class)</span></span>
<span class="line"><span>  public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>      //......省略逻辑代码.....</span></span>
<span class="line"><span>      studentService.doSaveStudent(student);</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        // 嵌套的内层事务</span></span>
<span class="line"><span>        &amp;#64;Transactional(rollbackFor = Exception.class)</span></span>
<span class="line"><span>        public void regCourse(int studentId) throws Exception {</span></span>
<span class="line"><span>          //......省略逻辑代码.....</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } catch (Exception e) {</span></span>
<span class="line"><span>          e.printStackTrace();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>可以看出来，整个业务是包含了 2 层事务，外层的 saveStudent() 的事务和内层的 regCourse() 事务。</p><p>在 Spring 声明式的事务处理中，有一个属性 propagation，表示打算对这些方法怎么使用事务，即一个带事务的方法调用了另一个带事务的方法，被调用的方法它怎么处理自己事务和调用方法事务之间的关系。</p><p>其中 propagation 有7种配置：REQUIRED、SUPPORTS、MANDATORY、REQUIRES_NEW、NOT_SUPPORTED、NEVER、NESTED。默认是 REQUIRED，它的含义是：如果本来有事务，则加入该事务，如果没有事务，则创建新的事务。</p><p>结合我们的伪代码示例，因为在 saveStudent() 上声明了一个外部的事务，就已经存在一个事务了，在propagation值为默认的REQUIRED的情况下， regCourse() 就会加入到已有的事务中，两个方法共用一个事务。</p><p>我们再来看下 Spring 事务处理的核心，其关键实现参考TransactionAspectSupport.invokeWithinTransaction()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected Object invokeWithinTransaction(Method method, &amp;#64;Nullable Class&amp;lt;?&amp;gt; targetClass,</span></span>
<span class="line"><span>      final InvocationCallback invocation) throws Throwable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   TransactionAttributeSource tas = getTransactionAttributeSource();</span></span>
<span class="line"><span>   final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);</span></span>
<span class="line"><span>   final PlatformTransactionManager tm = determineTransactionManager(txAttr);</span></span>
<span class="line"><span>   final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);</span></span>
<span class="line"><span>   if (txAttr == null || !(tm instanceof CallbackPreferringPlatformTransactionManager)) {</span></span>
<span class="line"><span>      // 是否需要创建一个事务</span></span>
<span class="line"><span>      TransactionInfo txInfo = createTransactionIfNecessary(tm, txAttr, joinpointIdentification);</span></span>
<span class="line"><span>      Object retVal = null;</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>         // 调用具体的业务方法</span></span>
<span class="line"><span>         retVal = invocation.proceedWithInvocation();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      catch (Throwable ex) {</span></span>
<span class="line"><span>         // 当发生异常时进行处理</span></span>
<span class="line"><span>         completeTransactionAfterThrowing(txInfo, ex);</span></span>
<span class="line"><span>         throw ex;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      finally {</span></span>
<span class="line"><span>         cleanupTransactionInfo(txInfo);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      // 正常返回时提交事务</span></span>
<span class="line"><span>      commitTransactionAfterReturning(txInfo);</span></span>
<span class="line"><span>      return retVal;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //......省略非关键代码.....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>整个方法完成了事务的一整套处理逻辑，如下：</p><ol><li>检查是否需要创建事务；</li><li>调用具体的业务方法进行处理；</li><li>提交事务；</li><li>处理异常。</li></ol><p>这里要格外注意的是，当前案例是两个事务嵌套的场景，外层事务 doSaveStudent()和内层事务 regCourse()，每个事务都会调用到这个方法。所以，这个方法会被调用两次。下面我们来具体来看下内层事务对异常的处理。</p><p>当捕获了异常，会调用TransactionAspectSupport.completeTransactionAfterThrowing() 进行异常处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void completeTransactionAfterThrowing(&amp;#64;Nullable TransactionInfo txInfo, Throwable ex) {</span></span>
<span class="line"><span>   if (txInfo != null &amp;&amp; txInfo.getTransactionStatus() != null) {</span></span>
<span class="line"><span>      if (txInfo.transactionAttribute != null &amp;&amp; txInfo.transactionAttribute.rollbackOn(ex)) {</span></span>
<span class="line"><span>         try {</span></span>
<span class="line"><span>            txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         catch (TransactionSystemException ex2) {</span></span>
<span class="line"><span>            logger.error(&quot;Application exception overridden by rollback exception&quot;, ex);</span></span>
<span class="line"><span>            ex2.initApplicationException(ex);</span></span>
<span class="line"><span>            throw ex2;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>         catch (RuntimeException | Error ex2) {</span></span>
<span class="line"><span>            logger.error(&quot;Application exception overridden by rollback exception&quot;, ex);</span></span>
<span class="line"><span>            throw ex2;</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //......省略非关键代码.....</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个方法里，我们对异常类型做了一些检查，当符合声明中的定义后，执行了具体的 rollback 操作，这个操作是通过 TransactionManager.rollback() 完成的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void rollback(TransactionStatus status) throws TransactionException {</span></span>
<span class="line"><span>   if (status.isCompleted()) {</span></span>
<span class="line"><span>      throw new IllegalTransactionStateException(</span></span>
<span class="line"><span>            &quot;Transaction is already completed - do not call commit or rollback more than once per transaction&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   DefaultTransactionStatus defStatus = (DefaultTransactionStatus) status;</span></span>
<span class="line"><span>   processRollback(defStatus, false);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而 rollback() 是在 AbstractPlatformTransactionManager 中实现的，继续调用了 processRollback()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void processRollback(DefaultTransactionStatus status, boolean unexpected) {</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      boolean unexpectedRollback = unexpected;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (status.hasSavepoint()) {</span></span>
<span class="line"><span>         // 有保存点</span></span>
<span class="line"><span>         status.rollbackToHeldSavepoint();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else if (status.isNewTransaction()) {</span></span>
<span class="line"><span>         // 是否为一个新的事务</span></span>
<span class="line"><span>         doRollback(status);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      else {</span></span>
<span class="line"><span>        // 处于一个更大的事务中</span></span>
<span class="line"><span>        if (status.hasTransaction()) {</span></span>
<span class="line"><span>           // 分支1</span></span>
<span class="line"><span>           if (status.isLocalRollbackOnly() || isGlobalRollbackOnParticipationFailure()) {</span></span>
<span class="line"><span>              doSetRollbackOnly(status);</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (!isFailEarlyOnGlobalRollbackOnly()) {</span></span>
<span class="line"><span>           unexpectedRollback = false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      // 省略非关键代码</span></span>
<span class="line"><span>      if (unexpectedRollback) {</span></span>
<span class="line"><span>         throw new UnexpectedRollbackException(</span></span>
<span class="line"><span>               &quot;Transaction rolled back because it has been marked as rollback-only&quot;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   finally {</span></span>
<span class="line"><span>      cleanupAfterCompletion(status);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法里区分了三种不同类型的情况：</p><ol><li>是否有保存点；</li><li>是否为一个新的事务；</li><li>是否处于一个更大的事务中。</li></ol><p>在这里，因为我们用的是默认的传播类型REQUIRED，嵌套的事务并没有开启一个新的事务，所以在这种情况下，当前事务是处于一个更大的事务中，所以会走到情况3分支1的代码块下。</p><p>这里有两个判断条件来确定是否设置为仅回滚：</p><p>if (status.isLocalRollbackOnly() || isGlobalRollbackOnParticipationFailure())</p><p>满足任何一个，都会执行 doSetRollbackOnly() 操作。isLocalRollbackOnly 在当前的情况下是 false，所以是否分设置为仅回滚就由 isGlobalRollbackOnParticipationFailure() 这个方法来决定了，其默认值为 true， 即是否回滚交由外层事务统一决定 。</p><p>显然这里的条件得到了满足，从而执行 doSetRollbackOnly：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doSetRollbackOnly(DefaultTransactionStatus status) {</span></span>
<span class="line"><span>   DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();</span></span>
<span class="line"><span>   txObject.setRollbackOnly();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以及最终调用到的 <strong>DataSourceTransactionObject中的setRollbackOnly()：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setRollbackOnly() {</span></span>
<span class="line"><span>   getConnectionHolder().setRollbackOnly();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>到这一步，内层事务的操作基本执行完毕，它处理了异常，并最终调用到了 <strong>DataSourceTransactionObject中的setRollbackOnly()</strong>。</p><p>接下来，我们来看外层事务。因为在外层事务中，我们自己的代码捕获了内层抛出来的异常，所以这个异常不会继续往上抛，最后的事务会在 TransactionAspectSupport.invokeWithinTransaction() 中的 commitTransactionAfterReturning() 中进行处理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void commitTransactionAfterReturning(&amp;#64;Nullable TransactionInfo txInfo) {</span></span>
<span class="line"><span>   if (txInfo != null &amp;&amp; txInfo.getTransactionStatus() != null) {     txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个方法里我们执行了 commit 操作，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void commit(TransactionStatus status) throws TransactionException {</span></span>
<span class="line"><span>   //......省略非关键代码.....</span></span>
<span class="line"><span>   if (!shouldCommitOnGlobalRollbackOnly() &amp;&amp; defStatus.isGlobalRollbackOnly()) {</span></span>
<span class="line"><span>      processRollback(defStatus, true);</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   processCommit(defStatus);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在 AbstractPlatformTransactionManager.commit()中，当满足了 shouldCommitOnGlobalRollbackOnly() 和 defStatus.isGlobalRollbackOnly()，就会回滚，否则会继续提交事务。其中shouldCommitOnGlobalRollbackOnly()的作用为，如果发现了事务被标记了全局回滚，并且在发生了全局回滚的情况下，判断是否应该提交事务，这个方法的默认实现是返回了 false，这里我们不需要关注它，继续查看isGlobalRollbackOnly()的实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isGlobalRollbackOnly() {</span></span>
<span class="line"><span>   return ((this.transaction instanceof SmartTransactionObject) &amp;&amp;</span></span>
<span class="line"><span>         ((SmartTransactionObject) this.transaction).isRollbackOnly());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个方法最终进入了 <strong>DataSourceTransactionObject类中的isRollbackOnly()：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isRollbackOnly() {</span></span>
<span class="line"><span>   return getConnectionHolder().isRollbackOnly();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>现在让我们再次回顾一下之前的内部事务处理结果，其最终调用到的是 <strong>DataSourceTransactionObject中的setRollbackOnly()：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void setRollbackOnly() {</span></span>
<span class="line"><span>   getConnectionHolder().setRollbackOnly();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>isRollbackOnly()和setRollbackOnly()这两个方法的执行本质都是对ConnectionHolder中rollbackOnly属性标志位的存取，而ConnectionHolder则存在于DefaultTransactionStatus类实例的transaction属性之中。</p><p>至此，答案基本浮出水面了，我们把整个逻辑串在一起就是：外层事务是否回滚的关键，最终取决于 <strong>DataSourceTransactionObject类中的isRollbackOnly()，而该方法的返回值，正是我们在内层异常的时候设置的</strong>。</p><p>所以最终外层事务也被回滚了，从而在控制台中打印出异常信息：&quot;Transaction rolled back because it has been marked as rollback-only&quot;。</p><p>所以到这里，问题也就清楚了，Spring默认的事务传播属性为REQUIRED，如我们之前介绍的，它的含义是：如果本来有事务，则加入该事务，如果没有事务，则创建新的事务，因而内外两层事务都处于同一个事务中。所以，当我们在 regCourse()中抛出异常，并触发了回滚操作时，这个回滚会进一步传播，从而把 saveStudent() 也回滚了。最终导致整个事务都被回滚了。</p><h3 id="问题修正" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>从上述案例解析中，我们了解到，Spring 在处理事务过程中，有个默认的传播属性 REQUIRED，在整个事务的调用链上，任何一个环节抛出的异常都会导致全局回滚。</p><p>知道了这个结论，修改方法也就很简单了，我们只需要对传播属性进行修改，把类型改成 REQUIRES_NEW 就可以了。于是这部分代码就修改成这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRES_NEW)</span></span>
<span class="line"><span>public void regCourse(int studentId) throws Exception {</span></span>
<span class="line"><span>    studentCourseMapper.saveStudentCourse(studentId, 1);</span></span>
<span class="line"><span>    courseMapper.addCourseNumber(1);</span></span>
<span class="line"><span>    throw new Exception(&quot;注册失败&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行一下看看：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java.lang.Exception: 注册失败</span></span>
<span class="line"><span>	at com.spring.puzzle.others.transaction.example3.CourseService.regCourse(CourseService.java:22)</span></span></code></pre></div><p>异常正常抛出，注册课程部分的数据没有保存，但是学生还是正常注册成功。这意味着此时Spring 只对注册课程这部分的数据进行了回滚，并没有传播到上一级。</p><p>这里我简单解释下这个过程：</p><ul><li>当子事务声明为 Propagation.REQUIRES_NEW 时，在 TransactionAspectSupport.invokeWithinTransaction() 中调用 createTransactionIfNecessary() 就会创建一个新的事务，独立于外层事务。</li><li>而在 AbstractPlatformTransactionManager.processRollback() 进行 rollback 处理时，因为 status.isNewTransaction() 会因为它处于一个新的事务中而返回 true，所以它走入到了另一个分支，执行了 doRollback() 操作，让这个子事务单独回滚，不会影响到主事务。</li></ul><p>至此，这个问题得到了很好的解决。</p><h2 id="案例-2-多数据源间切换之谜" tabindex="-1">案例 2：多数据源间切换之谜 <a class="header-anchor" href="#案例-2-多数据源间切换之谜" aria-label="Permalink to &quot;案例 2：多数据源间切换之谜&quot;">​</a></h2><p>在前面的案例中，我们完成了学生注册功能和课程注册功能。假设新需求又来了，每个学生注册的时候，需要给他们发一张校园卡，并给校园卡里充入 50 元钱。但是这个校园卡管理系统是一个第三方系统，使用的是另一套数据库，这样我们就需要在一个事务中同时操作两个数据库。</p><p>第三方的 Card 表如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CREATE TABLE \`card\` (</span></span>
<span class="line"><span>  \`id\` int(11) NOT NULL AUTO_INCREMENT,</span></span>
<span class="line"><span>  \`student_id\` int(11) DEFAULT NULL,</span></span>
<span class="line"><span>  \`balance\` int(11) DEFAULT NULL,</span></span>
<span class="line"><span>  PRIMARY KEY (\`id\`)</span></span>
<span class="line"><span>) ENGINE=InnoDB DEFAULT CHARSET=utf8;</span></span></code></pre></div><p>对应的 Card 对象如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Card {</span></span>
<span class="line"><span>    private Integer id;</span></span>
<span class="line"><span>    private Integer studentId;</span></span>
<span class="line"><span>    private Integer balance;</span></span>
<span class="line"><span>    //省略 Get/Set 方法</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对应的 Mapper 接口如下，里面包含了一个 saveCard 的 insert 语句，用于创建一条校园卡记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Mapper</span></span>
<span class="line"><span>public interface CardMapper {</span></span>
<span class="line"><span>    &amp;#64;Insert(&quot;INSERT INTO \`card\`(\`student_id\`, \`balance\`) VALUES (#{studentId}, #{balance})&quot;)</span></span>
<span class="line"><span>    &amp;#64;Options(useGeneratedKeys = true, keyProperty = &quot;id&quot;)</span></span>
<span class="line"><span>    int saveCard(Card card);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Card 的业务类如下，里面实现了卡与学生 ID 关联，以及充入 50 元的操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class CardService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private CardMapper cardMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional</span></span>
<span class="line"><span>    public void createCard(int studentId) throws Exception {</span></span>
<span class="line"><span>        Card card = new Card();</span></span>
<span class="line"><span>        card.setStudentId(studentId);</span></span>
<span class="line"><span>        card.setBalance(50);</span></span>
<span class="line"><span>        cardMapper.saveCard(card);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="案例解析-1" tabindex="-1">案例解析 <a class="header-anchor" href="#案例解析-1" aria-label="Permalink to &quot;案例解析&quot;">​</a></h3><p>这是一个相对常见的需求，学生注册和发卡都要在一个事务里完成，但是我们都默认只会连一个数据源，之前我们一直连的都是学生信息这个数据源，在这里，我们还需要对校园卡的数据源进行操作。于是，我们需要在一个事务里完成对两个数据源的操作，该如何实现这样的功能呢？</p><p>我们继续从 Spring 的源码中寻找答案。在 Spring 里有这样一个抽象类 AbstractRoutingDataSource，这个类相当于 DataSource 的路由中介，在运行时根据某种 key 值来动态切换到所需的 DataSource 上。通过实现这个类就可以实现我们期望的动态数据源切换。</p><p>这里强调一下，这个类里有这么几个关键属性：</p><ul><li>targetDataSources 保存了 key 和数据库连接的映射关系；</li><li>defaultTargetDataSource 标识默认的连接；</li><li>resolvedDataSources 存储数据库标识和数据源的映射关系。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractRoutingDataSource extends AbstractDataSource implements InitializingBean {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Nullable</span></span>
<span class="line"><span>   private Map&amp;lt;Object, Object&amp;gt; targetDataSources;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Nullable</span></span>
<span class="line"><span>   private Object defaultTargetDataSource;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   private boolean lenientFallback = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   private DataSourceLookup dataSourceLookup = new JndiDataSourceLookup();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Nullable</span></span>
<span class="line"><span>   private Map&amp;lt;Object, DataSource&amp;gt; resolvedDataSources;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   &amp;#64;Nullable</span></span>
<span class="line"><span>   private DataSource resolvedDefaultDataSource;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AbstractRoutingDataSource 实现了 InitializingBean 接口，并覆写了 afterPropertiesSet()。该方法会在初始化 Bean 的时候执行，将多个 DataSource 初始化到 resolvedDataSources。这里的 targetDataSources 属性存储了将要切换的多数据源 Bean 信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public void afterPropertiesSet() {</span></span>
<span class="line"><span>   if (this.targetDataSources == null) {</span></span>
<span class="line"><span>      throw new IllegalArgumentException(&quot;Property &#39;targetDataSources&#39; is required&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   this.resolvedDataSources = new HashMap&amp;lt;&amp;gt;(this.targetDataSources.size());</span></span>
<span class="line"><span>   this.targetDataSources.forEach((key, value) -&amp;gt; {</span></span>
<span class="line"><span>      Object lookupKey = resolveSpecifiedLookupKey(key);</span></span>
<span class="line"><span>      DataSource dataSource = resolveSpecifiedDataSource(value);</span></span>
<span class="line"><span>      this.resolvedDataSources.put(lookupKey, dataSource);</span></span>
<span class="line"><span>   });</span></span>
<span class="line"><span>   if (this.defaultTargetDataSource != null) {</span></span>
<span class="line"><span>      this.resolvedDefaultDataSource = resolveSpecifiedDataSource(this.defaultTargetDataSource);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>获取数据库连接的是 getConnection()，它调用了 determineTargetDataSource()来创建连接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public Connection getConnection() throws SQLException {</span></span>
<span class="line"><span>   return determineTargetDataSource().getConnection();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;Override</span></span>
<span class="line"><span>public Connection getConnection(String username, String password) throws SQLException {</span></span>
<span class="line"><span>   return determineTargetDataSource().getConnection(username, password);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>determineTargetDataSource()是整个部分的核心，它的作用就是动态切换数据源。有多少个数据源，就存多少个数据源在 targetDataSources 中。</p><p>targetDataSources 是一个 Map 类型的属性，key 表示每个数据源的名字，value 对应的是每个数据源 DataSource。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected DataSource determineTargetDataSource() {</span></span>
<span class="line"><span>   Assert.notNull(this.resolvedDataSources, &quot;DataSource router not initialized&quot;);</span></span>
<span class="line"><span>   Object lookupKey = determineCurrentLookupKey();</span></span>
<span class="line"><span>   DataSource dataSource = this.resolvedDataSources.get(lookupKey);</span></span>
<span class="line"><span>   if (dataSource == null &amp;&amp; (this.lenientFallback || lookupKey == null)) {</span></span>
<span class="line"><span>      dataSource = this.resolvedDefaultDataSource;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   if (dataSource == null) {</span></span>
<span class="line"><span>      throw new IllegalStateException(&quot;Cannot determine target DataSource for lookup key [&quot; + lookupKey + &quot;]&quot;);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return dataSource;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而选择哪个数据源又是由 determineCurrentLookupKey()来决定的，此方法是抽象方法，需要我们继承 AbstractRoutingDataSource 抽象类来重写此方法。该方法返回一个 key，该 key 是 Bean 中的 beanName，并赋值给 lookupKey，由此 key 可以通过 resolvedDataSources 属性的键来获取对应的 DataSource 值，从而达到数据源切换的效果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected abstract Object determineCurrentLookupKey();</span></span></code></pre></div><p>这样看来，这个方法的实现就得由我们完成了。接下来我们将会完成一系列相关的代码，解决这个问题。</p><h3 id="问题修正-1" tabindex="-1">问题修正 <a class="header-anchor" href="#问题修正-1" aria-label="Permalink to &quot;问题修正&quot;">​</a></h3><p>首先，我们创建一个 MyDataSource 类，继承了 AbstractRoutingDataSource，并覆写了 determineCurrentLookupKey()：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyDataSource extends AbstractRoutingDataSource {</span></span>
<span class="line"><span>    private static final ThreadLocal&amp;lt;String&amp;gt; key = new ThreadLocal&amp;lt;String&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected Object determineCurrentLookupKey() {</span></span>
<span class="line"><span>        return key.get();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void setDataSource(String dataSource) {</span></span>
<span class="line"><span>        key.set(dataSource);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static String getDatasource() {</span></span>
<span class="line"><span>        return key.get();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void clearDataSource() {</span></span>
<span class="line"><span>        key.remove();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其次，我们需要修改 JdbcConfig。这里我新写了一个 dataSource，将原来的 dataSource 改成 dataSourceCore，再将新定义的 dataSourceCore 和 dataSourceCard 放进一个 Map，对应的 key 分别是 core 和 card，并把 Map 赋值给 setTargetDataSources</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class JdbcConfig {</span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${card.driver}&quot;)</span></span>
<span class="line"><span>    private String cardDriver;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${card.url}&quot;)</span></span>
<span class="line"><span>    private String cardUrl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${card.username}&quot;)</span></span>
<span class="line"><span>    private String cardUsername;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Value(&quot;\${card.password}&quot;)</span></span>
<span class="line"><span>    private String cardPassword;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    &amp;#64;Qualifier(&quot;dataSourceCard&quot;)</span></span>
<span class="line"><span>    private DataSource dataSourceCard;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    &amp;#64;Qualifier(&quot;dataSourceCore&quot;)</span></span>
<span class="line"><span>    private DataSource dataSourceCore;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean(name = &quot;dataSourceCore&quot;)</span></span>
<span class="line"><span>    public DataSource createCoreDataSource() {</span></span>
<span class="line"><span>        DriverManagerDataSource ds = new DriverManagerDataSource();</span></span>
<span class="line"><span>        ds.setDriverClassName(driver);</span></span>
<span class="line"><span>        ds.setUrl(url);</span></span>
<span class="line"><span>        ds.setUsername(username);</span></span>
<span class="line"><span>        ds.setPassword(password);</span></span>
<span class="line"><span>        return ds;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean(name = &quot;dataSourceCard&quot;)</span></span>
<span class="line"><span>    public DataSource createCardDataSource() {</span></span>
<span class="line"><span>        DriverManagerDataSource ds = new DriverManagerDataSource();</span></span>
<span class="line"><span>        ds.setDriverClassName(cardDriver);</span></span>
<span class="line"><span>        ds.setUrl(cardUrl);</span></span>
<span class="line"><span>        ds.setUsername(cardUsername);</span></span>
<span class="line"><span>        ds.setPassword(cardPassword);</span></span>
<span class="line"><span>        return ds;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Bean(name = &quot;dataSource&quot;)</span></span>
<span class="line"><span>    public MyDataSource createDataSource() {</span></span>
<span class="line"><span>        MyDataSource myDataSource = new MyDataSource();</span></span>
<span class="line"><span>        Map&amp;lt;Object, Object&amp;gt; map = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        map.put(&quot;core&quot;, dataSourceCore);</span></span>
<span class="line"><span>        map.put(&quot;card&quot;, dataSourceCard);</span></span>
<span class="line"><span>        myDataSource.setTargetDataSources(map);</span></span>
<span class="line"><span>        myDataSource.setDefaultTargetDataSource(dataSourceCore);</span></span>
<span class="line"><span>        return myDataSource;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后还剩下一个问题，setDataSource 这个方法什么时候执行呢？</p><p>我们可以用 Spring AOP 来设置，把配置的数据源类型都设置成注解标签， Service层中在切换数据源的方法上加上注解标签，就会调用相应的方法切换数据源。</p><p>我们定义了一个新的注解 @DataSource，可以直接加在 Service()上，实现数据库切换：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Documented</span></span>
<span class="line"><span>&amp;#64;Target({ElementType.TYPE, ElementType.METHOD})</span></span>
<span class="line"><span>&amp;#64;Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public &amp;#64;interface DataSource {</span></span>
<span class="line"><span>    String value();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String core = &quot;core&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String card = &quot;card&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>声明方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;DataSource(DataSource.card)</span></span></code></pre></div><p>另外，我们还需要写一个 Spring AOP 来对相应的服务方法进行拦截，完成数据源的切换操作。特别要注意的是，这里要加上一个 @Order(1) 标记它的初始化顺序。这个 Order 值一定要比事务的 AOP 切面的值小，这样可以获得更高的优先级，否则自动切换数据源将会失效。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Aspect</span></span>
<span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>&amp;#64;Order(1)</span></span>
<span class="line"><span>public class DataSourceSwitch {</span></span>
<span class="line"><span>    &amp;#64;Around(&quot;execution(* com.spring.puzzle.others.transaction.example3.CardService.*(..))&quot;)</span></span>
<span class="line"><span>    public void around(ProceedingJoinPoint point) throws Throwable {</span></span>
<span class="line"><span>        Signature signature = point.getSignature();</span></span>
<span class="line"><span>        MethodSignature methodSignature = (MethodSignature) signature;</span></span>
<span class="line"><span>        Method method = methodSignature.getMethod();</span></span>
<span class="line"><span>        if (method.isAnnotationPresent(DataSource.class)) {</span></span>
<span class="line"><span>            DataSource dataSource = method.getAnnotation(DataSource.class);</span></span>
<span class="line"><span>            MyDataSource.setDataSource(dataSource.value());</span></span>
<span class="line"><span>            System.out.println(&quot;数据源切换至：&quot; + MyDataSource.getDatasource());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        point.proceed();</span></span>
<span class="line"><span>        MyDataSource.clearDataSource();</span></span>
<span class="line"><span>        System.out.println(&quot;数据源已移除！&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>最后，我们实现了 Card 的发卡逻辑，在方法前声明了切换数据库：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Service</span></span>
<span class="line"><span>public class CardService {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private CardMapper cardMapper;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Transactional(propagation = Propagation.REQUIRES_NEW)</span></span>
<span class="line"><span>    &amp;#64;DataSource(DataSource.card)</span></span>
<span class="line"><span>    public void createCard(int studentId) throws Exception {</span></span>
<span class="line"><span>        Card card = new Card();</span></span>
<span class="line"><span>        card.setStudentId(studentId);</span></span>
<span class="line"><span>        card.setBalance(50);</span></span>
<span class="line"><span>        cardMapper.saveCard(card);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>并在 saveStudent() 里调用了发卡逻辑：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Transactional(rollbackFor = Exception.class)</span></span>
<span class="line"><span>public void saveStudent(String realname) throws Exception {</span></span>
<span class="line"><span>    Student student = new Student();</span></span>
<span class="line"><span>    student.setRealname(realname);</span></span>
<span class="line"><span>    studentService.doSaveStudent(student);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        courseService.regCourse(student.getId());</span></span>
<span class="line"><span>        cardService.createCard(student.getId());</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行一下，一切正常，两个库的数据都可以正常保存了。</p><p>最后我们来看一下整个过程的调用栈，重新过一遍流程（这里我略去了不重要的部分）。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382150/5d1801904d9472b54e7e049ff17220bc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Spring%E7%BC%96%E7%A8%8B%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF50%E4%BE%8B/images/382150/5d1801904d9472b54e7e049ff17220bc.png" alt=""></a></p><p>在创建了事务以后，会通过 DataSourceTransactionManager.doBegin()获取相应的数据库连接：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected void doBegin(Object transaction, TransactionDefinition definition) {</span></span>
<span class="line"><span>   DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;</span></span>
<span class="line"><span>   Connection con = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      if (!txObject.hasConnectionHolder() ||</span></span>
<span class="line"><span>txObject.getConnectionHolder().isSynchronizedWithTransaction()) {</span></span>
<span class="line"><span>         Connection newCon = obtainDataSource().getConnection();</span></span>
<span class="line"><span>         txObject.setConnectionHolder(new ConnectionHolder(newCon), true);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      //省略非关键代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里的 obtainDataSource().getConnection() 调用到了 AbstractRoutingDataSource.getConnection()，这就与我们实现的功能顺利会师了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Connection getConnection() throws SQLException {</span></span>
<span class="line"><span>   return determineTargetDataSource().getConnection();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>通过以上两个案例，相信你对 Spring 的事务机制已经有了深刻的认识，最后总结下重点：</p><ul><li>Spring 在事务处理中有一个很重要的属性 Propagation，主要用来配置当前需要执行的方法如何使用事务，以及与其它事务之间的关系。</li><li>Spring 默认的传播属性是 REQUIRED，在有事务状态下执行，如果当前没有事务，则创建新的事务；</li><li>Spring 事务是可以对多个数据源生效，它提供了一个抽象类 AbstractRoutingDataSource，通过实现这个抽象类，我们可以实现自定义的数据库切换。</li></ul><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>结合案例2，请你思考这样一个问题：在这个案例中，我们在 CardService类方法上声明了这样的事务传播属性，@Transactional(propagation = Propagation.REQUIRES_NEW)，如果使用 Spring 的默认声明行不行，为什么？</p><p>期待你的思考，我们留言区见！</p>`,134)])])}const b=n(t,[["render",l]]);export{g as __pageData,b as default};
