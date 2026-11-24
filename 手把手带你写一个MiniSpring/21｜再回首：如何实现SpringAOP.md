# 21 | 再回首：如何实现SpringAOP

你好，我是郭屹。

到这一节课，我们的 Spring AOP 部分也就结束了，你是不是跟随我的这个步骤也实现了自己的 AOP 呢？欢迎你把你的实现代码分享出来，我们一起讨论，共同进步！为了让你对这一章的内容掌握得更加牢固，我们对 AOP 的内容做一个重点回顾。

### 重点回顾

Spring AOP 是 Spring 框架的一个核心组件之一，是 Spring 面向切面编程的探索。面向对象和面向切面，两者一纵一横，编织成一个完整的程序结构。

在 AOP 编程中，Aspect 指的是横切逻辑（cross-cutting concerns），也就是那些和基本业务逻辑无关，但是却是很多不同业务代码共同需要的功能，比如日志记录、安全检查、事务管理，等等。Aspect 能够通过 Join point，Advice 和 Pointcut 来定义，在运行的时候，能够自动在 Pointcut 范围内的不同类型的 Advice 作用在不同的 Join point 上，实现对横切逻辑的处理。

所以，这个 AOP 编程可以看作是一种以 Aspect 为核心的编程方式，它强调的是将横切逻辑作为一个独立的属性进行处理，而不是直接嵌入到基本业务逻辑中。这样做，可以提高代码的可复用性、可维护性和可扩展性，使得代码更容易理解和设计。

AOP 的实现，是基于 JDK 动态代理的，站在 Java 的角度，这很自然，概念很容易实现，但是效率不高，限制也比较多。可以说 AOP 的实现是 Spring 框架中少数不尽人意的一部分，也可以看出世界顶级高手也有考虑不周到的地方。

那我们在课程中是如何一步步实现 AOP 的呢？

我们是基于 JDK 来实现的，因为比较自然、容易。我们先是引入了 Java 的动态代理技术，探讨如何用这个技术动态插入业务逻辑。然后我们进一步抽取动态业务逻辑，引入 Spring 里的Interceptor 和 Advice 的概念。之后通过引入 Spring 的 PointCut 概念，进行 advice 作用范围的定义，让系统知道前面定义的 Advice 会对哪些对象产生影响。最后为了免除手工逐个配置PointCut 和 Interceptor 的工作，我们就通过一个自动化的机制自动生成动态代理。最终实现了一个有模有样的 AOP 解决方案。

好了，回顾完这一章的重点，我们再来看一下我每节课后给你布置的思考题。题目和答案我都放到下面了，不要偷懒，好好思考之后再来看答案。

### 17｜动态代理：如何在运行时插入逻辑？

### 思考题

如果 MiniSpring 想扩展到支持 Cglib，程序应该从哪里下手改造？

### 参考答案

我们的动态代理包装在 AopProxy 这个接口中，对 JDK 动态代理技术，使用了JdkDynamicAopProxy 这个类来实现，所以平行的做法，对于 Cglib 技术，我们就可以新增一个 CglibAopProxy 类进行实现。

同时，采用哪一种 AOP Proxy 可以由工厂方法决定，也就是在 ProxyFactoryBean 中所使用的 aopProxyFactory，它在初始化的时候有个默认实现，即 DefaultAopProxyFactory。我们可以将这个类的 createAopProxy() 方法改造一下。

```java
 public class DefaultAopProxyFactory implements AopProxyFactory {
   public AopProxy createAopProxy(Object target) {
     if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
       return new JdkDynamicAopProxy(target);
     }
     return new CglibAopProxy(config);
   }
 }
```

根据某些条件决定使用 JdkDynamicAopProxy 还是 CglibAopProxy，或者通过配置文件给一个属性来配置也可以。

### 18｜拦截器 ：如何在方法前后进行拦截？

### 思考题

如果我们希望 beforeAdvice 能在某种情况下阻止目标方法的调用，应该从哪里下手改造改造我们的程序？

### 参考答案

答案在 MethodBeforeAdviceInterceptor 的实现中，看它的 invoke 方法。

```java
 public class MethodBeforeAdviceInterceptor implements MethodInterceptor {
   public Object invoke(MethodInvocation mi) throws Throwable {
     this.advice.before(mi.getMethod(), mi.getArguments(), mi.getThis());
     return mi.proceed();
   }
 }
```

这个方法先调用 advice.before()，然后再调用目标方法。所以如果我们希望 beforeAdvice 能够阻止流程继续，可以将 advice.before() 接口改造成有一个 boolean 返回值，规定返回 false则不调用 mi.proceed()。

### 19｜Pointcut ：如何批量匹配代理方法？

### 思考题

```
我们现在实现的匹配规则是按照  * 模式串进行匹配，如果有不同的规则，应该如何改造呢？
```

### 参考答案

如果仍然按照名字来匹配，那就可以改造 NameMatchMethodPointcut 类，它现在的核心代码是：

```java
 public class NameMatchMethodPointcut implements MethodMatcher,Pointcut{
   private String mappedName = "";
   protected boolean isMatch(String methodName, String mappedName) {
     return PatternMatchUtils.simpleMatch(mappedName, methodName);
   }
 }
```

默认的实现用的是 PatternMatchUtils.simpleMatch()，比较简单的模式串。我们可以给PatternMatchUtils 增加一个方法，如 regExprMatch() 正则表达式匹配，在这里接收正则表达式串，进行匹配校验。

如果超出名字匹配的范围，需要用到不一样的匹配规则，就可以并列增加一个OtherMatchMethodPointcut 类 h 和响应的 advisor 类，自己实现。并在配置文件里指定使用这个 Advisor。

```xml
 <bean id="advisor" class="com.minis.aop.OtherMatchMethodPointcutAdvisor">
   </bean>
   <bean id="action" class="com.minis.aop.ProxyFactoryBean">
       <property type="String" name="interceptorName" value="advisor" />
   </bean>
```

### 20｜AutoProxyCreator：如何自动添加动态代理？

### 思考题

AOP 时常用于数据库事务处理，如何用我们现在的 AOP 架构实现简单的事务处理？

### 参考答案

针对数据库事务，手工代码简化到了极致，就是执行 SQL 之前执行conn.setAutoCommit(false), 在执行完 SQL 之后，再执行 conn.commit()。因此，我们用一个MethodInterceptor 就可以简单实现。

假定有了这样一个 interceptor。

```xml
<bean id="transactionInterceptor" class="TransactionInterceptor" />
```

这个 Interceptor 拦截目标方法后添加事务处理逻辑，因此需要改造一下。

```java
public class TransactionInterceptor implements MethodInterceptor{
 @Override
 public Object invoke(MethodInvocation invocation) throws Throwable {
conn.setAutoCommit(false);
Object ret=invocation.proceed();
conn.commit();
   return ret;
 }
}
```

从代码里可以看到，这里需要一个 conn，因此我们要设法将数据源信息注入到这里。

我们可以抽取出一个 TranactionManager 类，大体如下：

```java
public class TransactionManager {
 @Autowired
 private DataSource dataSource;
 Connection conn = null;
 protected void doBegin() {
   conn = dataSource.getConnection();
   if (conn.getAutoCommit()) {
     conn.setAutoCommit(false);
   }
 }
 protected void doCommit() {
   conn.commit();
 }
}
```

由这个 transaction manager 负责数据源以及开始和提交事务，然后将这个 transactionmanager 作为一个 Bean 注入 Interceptor，因此配置应该是这样的。

```xml
<bean id="transactionInterceptor" class="TransactionInterceptor" >
   <property type="TransactionManager" name="transactionManager" value="txManage
</bean>
<bean id="txManager" class="TransactionManager">
</bean>
```

所以 Interceptor 最后应该改造成这个样子：

```java
public class TransactionInterceptor implements MethodInterceptor{
 TransactionManager transactionManager;
 @Override
 public Object invoke(MethodInvocation invocation) throws Throwable {
transactionManager.doBegin();
Object ret=invocation.proceed();
transactionManager.doCommit();
   return ret;
 }
}
```
