import{_ as n,H as a,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const u=JSON.parse('{"title":"49 | 桥接模式：如何实现支持不同类型和渠道的消息推送系统？","description":"","frontmatter":{},"headers":[{"level":2,"title":"桥接模式的原理解析","slug":"桥接模式的原理解析","link":"#桥接模式的原理解析","children":[]},{"level":2,"title":"桥接模式的应用举例","slug":"桥接模式的应用举例","link":"#桥接模式的应用举例","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"课堂讨论","slug":"课堂讨论","link":"#课堂讨论","children":[]}],"relativePath":"设计模式之美/49-桥接模式：如何实现支持不同类型和渠道的消息推送系统？.md","filePath":"设计模式之美/49-桥接模式：如何实现支持不同类型和渠道的消息推送系统？.md","lastUpdated":1779822055000}'),i={name:"设计模式之美/49-桥接模式：如何实现支持不同类型和渠道的消息推送系统？.md"};function l(t,s,c,r,o,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_49-桥接模式-如何实现支持不同类型和渠道的消息推送系统" tabindex="-1">49 | 桥接模式：如何实现支持不同类型和渠道的消息推送系统？ <a class="header-anchor" href="#_49-桥接模式-如何实现支持不同类型和渠道的消息推送系统" aria-label="Permalink to &quot;49 | 桥接模式：如何实现支持不同类型和渠道的消息推送系统？&quot;">​</a></h1><p>上一节课我们学习了第一种结构型模式：代理模式。它在不改变原始类（或者叫被代理类）代码的情况下，通过引入代理类来给原始类附加功能。代理模式在平时的开发经常被用到，常用在业务系统中开发一些非功能性需求，比如：监控、统计、鉴权、限流、事务、幂等、日志。</p><p>今天，我们再学习另外一种结构型模式：桥接模式。桥接模式的代码实现非常简单，但是理解起来稍微有点难度，并且应用场景也比较局限，所以，相对于代理模式来说，桥接模式在实际的项目中并没有那么常用，你只需要简单了解，见到能认识就可以，并不是我们学习的重点。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="桥接模式的原理解析" tabindex="-1">桥接模式的原理解析 <a class="header-anchor" href="#桥接模式的原理解析" aria-label="Permalink to &quot;桥接模式的原理解析&quot;">​</a></h2><p><strong>桥接模式</strong>，也叫作 <strong>桥梁模式</strong>，英文是 <strong>Bridge Design Pattern</strong>。这个模式可以说是23种设计模式中最难理解的模式之一了。我查阅了比较多的书籍和资料之后发现，对于这个模式有两种不同的理解方式。</p><p>当然，这其中“最纯正”的理解方式，当属GoF的《设计模式》一书中对桥接模式的定义。毕竟，这23种经典的设计模式，最初就是由这本书总结出来的。在GoF的《设计模式》一书中，桥接模式是这么定义的：“Decouple an abstraction from its implementation so that the two can vary independently。”翻译成中文就是：“将抽象和实现解耦，让它们可以独立变化。”</p><p>关于桥接模式，很多书籍、资料中，还有另外一种理解方式：“一个类存在两个（或多个）独立变化的维度，我们通过组合的方式，让这两个（或多个）维度可以独立进行扩展。”通过组合关系来替代继承关系，避免继承层次的指数级爆炸。这种理解方式非常类似于，我们之前讲过的“组合优于继承”设计原则，所以，这里我就不多解释了。我们重点看下GoF的理解方式。</p><p>GoF给出的定义非常的简短，单凭这一句话，估计没几个人能看懂是什么意思。所以，我们通过JDBC驱动的例子来解释一下。JDBC驱动是桥接模式的经典应用。我们先来看一下，如何利用JDBC驱动来查询数据库。具体的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Class.forName(&quot;com.mysql.jdbc.Driver&quot;);//加载及注册JDBC驱动程序</span></span>
<span class="line"><span>String url = &quot;jdbc:mysql://localhost:3306/sample_db?user=root&amp;password=your_password&quot;;</span></span>
<span class="line"><span>Connection con = DriverManager.getConnection(url);</span></span>
<span class="line"><span>Statement stmt = con.createStatement()；</span></span>
<span class="line"><span>String query = &quot;select * from test&quot;;</span></span>
<span class="line"><span>ResultSet rs=stmt.executeQuery(query);</span></span>
<span class="line"><span>while(rs.next()) {</span></span>
<span class="line"><span>  rs.getString(1);</span></span>
<span class="line"><span>  rs.getInt(2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果我们想要把MySQL数据库换成Oracle数据库，只需要把第一行代码中的com.mysql.jdbc.Driver换成oracle.jdbc.driver.OracleDriver就可以了。当然，也有更灵活的实现方式，我们可以把需要加载的Driver类写到配置文件中，当程序启动的时候，自动从配置文件中加载，这样在切换数据库的时候，我们都不需要修改代码，只需要修改配置文件就可以了。</p><p>不管是改代码还是改配置，在项目中，从一个数据库切换到另一种数据库，都只需要改动很少的代码，或者完全不需要改动代码，那如此优雅的数据库切换是如何实现的呢？</p><p>源码之下无秘密。要弄清楚这个问题，我们先从com.mysql.jdbc.Driver这个类的代码看起。我摘抄了部分相关代码，放到了这里，你可以看一下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.mysql.jdbc;</span></span>
<span class="line"><span>import java.sql.SQLException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Driver extends NonRegisteringDriver implements java.sql.Driver {</span></span>
<span class="line"><span>	static {</span></span>
<span class="line"><span>		try {</span></span>
<span class="line"><span>			java.sql.DriverManager.registerDriver(new Driver());</span></span>
<span class="line"><span>		} catch (SQLException E) {</span></span>
<span class="line"><span>			throw new RuntimeException(&quot;Can&#39;t register driver!&quot;);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Construct a new driver and register it with DriverManager</span></span>
<span class="line"><span>	 * &amp;#64;throws SQLException if a database error occurs.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public Driver() throws SQLException {</span></span>
<span class="line"><span>		// Required for Class.forName().newInstance()</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结合com.mysql.jdbc.Driver的代码实现，我们可以发现，当执行Class.forName(“com.mysql.jdbc.Driver”)这条语句的时候，实际上是做了两件事情。第一件事情是要求JVM查找并加载指定的Driver类，第二件事情是执行该类的静态代码，也就是将MySQL Driver注册到DriverManager类中。</p><p>现在，我们再来看一下，DriverManager类是干什么用的。具体的代码如下所示。当我们把具体的Driver实现类（比如，com.mysql.jdbc.Driver）注册到DriverManager之后，后续所有对JDBC接口的调用，都会委派到对具体的Driver实现类来执行。而Driver实现类都实现了相同的接口（java.sql.Driver ），这也是可以灵活切换Driver的原因。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class DriverManager {</span></span>
<span class="line"><span>  private final static CopyOnWriteArrayList&amp;lt;DriverInfo&amp;gt; registeredDrivers = new CopyOnWriteArrayList&amp;lt;DriverInfo&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    loadInitialDrivers();</span></span>
<span class="line"><span>    println(&quot;JDBC DriverManager initialized&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static synchronized void registerDriver(java.sql.Driver driver) throws SQLException {</span></span>
<span class="line"><span>    if (driver != null) {</span></span>
<span class="line"><span>      registeredDrivers.addIfAbsent(new DriverInfo(driver));</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      throw new NullPointerException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static Connection getConnection(String url, String user, String password) throws SQLException {</span></span>
<span class="line"><span>    java.util.Properties info = new java.util.Properties();</span></span>
<span class="line"><span>    if (user != null) {</span></span>
<span class="line"><span>      info.put(&quot;user&quot;, user);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (password != null) {</span></span>
<span class="line"><span>      info.put(&quot;password&quot;, password);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return (getConnection(url, info, Reflection.getCallerClass()));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>桥接模式的定义是“将抽象和实现解耦，让它们可以独立变化”。那弄懂定义中“抽象”和“实现”两个概念，就是理解桥接模式的关键。那在JDBC这个例子中，什么是“抽象”？什么是“实现”呢？</p><p>实际上，JDBC本身就相当于“抽象”。注意，这里所说的“抽象”，指的并非“抽象类”或“接口”，而是跟具体的数据库无关的、被抽象出来的一套“类库”。具体的Driver（比如，com.mysql.jdbc.Driver）就相当于“实现”。注意，这里所说的“实现”，也并非指“接口的实现类”，而是跟具体数据库相关的一套“类库”。JDBC和Driver独立开发，通过对象之间的组合关系，组装在一起。JDBC的所有逻辑操作，最终都委托给Driver来执行。</p><p>我画了一张图帮助你理解，你可以结合着我刚才的讲解一块看。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/202786/812234b0717043a67c2d62ea8e783b40.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/images/202786/812234b0717043a67c2d62ea8e783b40.jpg" alt=""></a></p><h2 id="桥接模式的应用举例" tabindex="-1">桥接模式的应用举例 <a class="header-anchor" href="#桥接模式的应用举例" aria-label="Permalink to &quot;桥接模式的应用举例&quot;">​</a></h2><p>在 <a href="https://time.geekbang.org/column/article/176075" target="_blank" rel="noreferrer">第16节</a> 中，我们讲过一个API接口监控告警的例子：根据不同的告警规则，触发不同类型的告警。告警支持多种通知渠道，包括：邮件、短信、微信、自动语音电话。通知的紧急程度有多种类型，包括：SEVERE（严重）、URGENCY（紧急）、NORMAL（普通）、TRIVIAL（无关紧要）。不同的紧急程度对应不同的通知渠道。比如，SERVE（严重）级别的消息会通过“自动语音电话”告知相关人员。</p><p>在当时的代码实现中，关于发送告警信息那部分代码，我们只给出了粗略的设计，现在我们来一块实现一下。我们先来看最简单、最直接的一种实现方式。代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum NotificationEmergencyLevel {</span></span>
<span class="line"><span>  SEVERE, URGENCY, NORMAL, TRIVIAL</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Notification {</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; emailAddresses;</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; telephones;</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; wechatIds;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Notification() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setEmailAddress(List&amp;lt;String&amp;gt; emailAddress) {</span></span>
<span class="line"><span>    this.emailAddresses = emailAddress;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setTelephones(List&amp;lt;String&amp;gt; telephones) {</span></span>
<span class="line"><span>    this.telephones = telephones;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setWechatIds(List&amp;lt;String&amp;gt; wechatIds) {</span></span>
<span class="line"><span>    this.wechatIds = wechatIds;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void notify(NotificationEmergencyLevel level, String message) {</span></span>
<span class="line"><span>    if (level.equals(NotificationEmergencyLevel.SEVERE)) {</span></span>
<span class="line"><span>      //...自动语音电话</span></span>
<span class="line"><span>    } else if (level.equals(NotificationEmergencyLevel.URGENCY)) {</span></span>
<span class="line"><span>      //...发微信</span></span>
<span class="line"><span>    } else if (level.equals(NotificationEmergencyLevel.NORMAL)) {</span></span>
<span class="line"><span>      //...发邮件</span></span>
<span class="line"><span>    } else if (level.equals(NotificationEmergencyLevel.TRIVIAL)) {</span></span>
<span class="line"><span>      //...发邮件</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//在API监控告警的例子中，我们如下方式来使用Notification类：</span></span>
<span class="line"><span>public class ErrorAlertHandler extends AlertHandler {</span></span>
<span class="line"><span>  public ErrorAlertHandler(AlertRule rule, Notification notification){</span></span>
<span class="line"><span>    super(rule, notification);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void check(ApiStatInfo apiStatInfo) {</span></span>
<span class="line"><span>    if (apiStatInfo.getErrorCount() &amp;gt; rule.getMatchedRule(apiStatInfo.getApi()).getMaxErrorCount()) {</span></span>
<span class="line"><span>      notification.notify(NotificationEmergencyLevel.SEVERE, &quot;...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Notification类的代码实现有一个最明显的问题，那就是有很多if-else分支逻辑。实际上，如果每个分支中的代码都不复杂，后期也没有无限膨胀的可能（增加更多if-else分支判断），那这样的设计问题并不大，没必要非得一定要摒弃if-else分支逻辑。</p><p>不过，Notification的代码显然不符合这个条件。因为每个if-else分支中的代码逻辑都比较复杂，发送通知的所有逻辑都扎堆在Notification类中。我们知道，类的代码越多，就越难读懂，越难修改，维护的成本也就越高。很多设计模式都是试图将庞大的类拆分成更细小的类，然后再通过某种更合理的结构组装在一起。</p><p>针对Notification的代码，我们将不同渠道的发送逻辑剥离出来，形成独立的消息发送类（MsgSender相关类）。其中，Notification类相当于抽象，MsgSender类相当于实现，两者可以独立开发，通过组合关系（也就是桥梁）任意组合在一起。所谓任意组合的意思就是，不同紧急程度的消息和发送渠道之间的对应关系，不是在代码中固定写死的，我们可以动态地去指定（比如，通过读取配置来获取对应关系）。</p><p>按照这个设计思路，我们对代码进行重构。重构之后的代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface MsgSender {</span></span>
<span class="line"><span>  void send(String message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TelephoneMsgSender implements MsgSender {</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; telephones;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public TelephoneMsgSender(List&amp;lt;String&amp;gt; telephones) {</span></span>
<span class="line"><span>    this.telephones = telephones;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void send(String message) {</span></span>
<span class="line"><span>    //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class EmailMsgSender implements MsgSender {</span></span>
<span class="line"><span>  // 与TelephoneMsgSender代码结构类似，所以省略...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class WechatMsgSender implements MsgSender {</span></span>
<span class="line"><span>  // 与TelephoneMsgSender代码结构类似，所以省略...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public abstract class Notification {</span></span>
<span class="line"><span>  protected MsgSender msgSender;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Notification(MsgSender msgSender) {</span></span>
<span class="line"><span>    this.msgSender = msgSender;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public abstract void notify(String message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SevereNotification extends Notification {</span></span>
<span class="line"><span>  public SevereNotification(MsgSender msgSender) {</span></span>
<span class="line"><span>    super(msgSender);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &amp;#64;Override</span></span>
<span class="line"><span>  public void notify(String message) {</span></span>
<span class="line"><span>    msgSender.send(message);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UrgencyNotification extends Notification {</span></span>
<span class="line"><span>  // 与SevereNotification代码结构类似，所以省略...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class NormalNotification extends Notification {</span></span>
<span class="line"><span>  // 与SevereNotification代码结构类似，所以省略...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class TrivialNotification extends Notification {</span></span>
<span class="line"><span>  // 与SevereNotification代码结构类似，所以省略...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>总体上来讲，桥接模式的原理比较难理解，但代码实现相对简单。</p><p>对于这个模式有两种不同的理解方式。在GoF的《设计模式》一书中，桥接模式被定义为：“将抽象和实现解耦，让它们可以独立变化。”在其他资料和书籍中，还有另外一种更加简单的理解方式：“一个类存在两个（或多个）独立变化的维度，我们通过组合的方式，让这两个（或多个）维度可以独立进行扩展。”</p><p>对于第一种GoF的理解方式，弄懂定义中“抽象”和“实现”两个概念，是理解它的关键。定义中的“抽象”，指的并非“抽象类”或“接口”，而是被抽象出来的一套“类库”，它只包含骨架代码，真正的业务逻辑需要委派给定义中的“实现”来完成。而定义中的“实现”，也并非“接口的实现类”，而是一套独立的“类库”。“抽象”和“实现”独立开发，通过对象之间的组合关系，组装在一起。</p><p>对于第二种理解方式，它非常类似我们之前讲过的“组合优于继承”设计原则，通过组合关系来替代继承关系，避免继承层次的指数级爆炸。</p><h2 id="课堂讨论" tabindex="-1">课堂讨论 <a class="header-anchor" href="#课堂讨论" aria-label="Permalink to &quot;课堂讨论&quot;">​</a></h2><p>在桥接模式的第二种理解方式的第一段代码实现中，Notification类中的三个成员变量通过set方法来设置，但是这样的代码实现存在一个明显的问题，那就是emailAddresses、telephones、wechatIds中的数据有可能在Notification类外部被修改，那如何重构代码才能避免这种情况的发生呢？</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Notification {</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; emailAddresses;</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; telephones;</span></span>
<span class="line"><span>  private List&amp;lt;String&amp;gt; wechatIds;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Notification() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setEmailAddress(List&amp;lt;String&amp;gt; emailAddress) {</span></span>
<span class="line"><span>    this.emailAddresses = emailAddress;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setTelephones(List&amp;lt;String&amp;gt; telephones) {</span></span>
<span class="line"><span>    this.telephones = telephones;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setWechatIds(List&amp;lt;String&amp;gt; wechatIds) {</span></span>
<span class="line"><span>    this.wechatIds = wechatIds;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>欢迎留言和我分享你的思考和疑惑。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,40)])])}const m=n(i,[["render",l]]);export{u as __pageData,m as default};
