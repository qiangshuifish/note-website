import{_ as s,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const m=JSON.parse('{"title":"13 | 日志：日志记录真没你想象的那么简单","description":"","frontmatter":{},"headers":[{"level":2,"title":"为什么我的日志会重复记录？","slug":"为什么我的日志会重复记录","link":"#为什么我的日志会重复记录","children":[]},{"level":2,"title":"使用异步日志改善性能的坑","slug":"使用异步日志改善性能的坑","link":"#使用异步日志改善性能的坑","children":[]},{"level":2,"title":"使用日志占位符就不需要进行日志级别判断了？","slug":"使用日志占位符就不需要进行日志级别判断了","link":"#使用日志占位符就不需要进行日志级别判断了","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/13-日志：日志记录真没你想象的那么简单.md","filePath":"Java业务开发常见错误100例/13-日志：日志记录真没你想象的那么简单.md","lastUpdated":1779815815000}'),l={name:"Java业务开发常见错误100例/13-日志：日志记录真没你想象的那么简单.md"};function t(i,a,o,c,r,g){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="_13-日志-日志记录真没你想象的那么简单" tabindex="-1">13 | 日志：日志记录真没你想象的那么简单 <a class="header-anchor" href="#_13-日志-日志记录真没你想象的那么简单" aria-label="Permalink to &quot;13 | 日志：日志记录真没你想象的那么简单&quot;">​</a></h1><p>你好，我是朱晔。今天，我和你分享的是，记录日志可能会踩的坑。</p><p>一些同学可能要说了，记录日志还不简单，无非是几个常用的API方法，比如debug、info、warn、error；但我就见过不少坑都是记录日志引起的，容易出错主要在于三个方面：</p><ul><li>日志框架众多，不同的类库可能会使用不同的日志框架，如何兼容是一个问题。</li><li>配置复杂且容易出错。日志配置文件通常很复杂，因此有些开发同学会从其他项目或者网络上复制一份配置文件，但却不知道如何修改，甚至是胡乱修改，造成很多问题。比如，重复记录日志的问题、同步日志的性能问题、异步记录的错误配置问题。</li><li>日志记录本身就有些误区，比如没考虑到日志内容获取的代价、胡乱使用日志级别等。</li></ul><p>Logback、Log4j、Log4j2、commons-logging、JDK自带的java.util.logging等，都是Java体系的日志框架，确实非常多。而不同的类库，还可能选择使用不同的日志框架。这样一来，日志的统一管理就变得非常困难。为了解决这个问题，就有了SLF4J（Simple Logging Facade For Java），如下图所示：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/97fcd8b55e5288c0e9954f070f1008fe.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/97fcd8b55e5288c0e9954f070f1008fe.png" alt=""></a></p><p>SLF4J实现了三种功能：</p><ul><li>一是提供了统一的日志门面API，即图中紫色部分，实现了中立的日志记录API。</li><li>二是桥接功能，即图中蓝色部分，用来把各种日志框架的API（图中绿色部分）桥接到SLF4J API。这样一来，即便你的程序中使用了各种日志API记录日志，最终都可以桥接到SLF4J门面API。</li><li>三是适配功能，即图中红色部分，可以实现SLF4J API和实际日志框架（图中灰色部分）的绑定。SLF4J只是日志标准，我们还是需要一个实际的日志框架。日志框架本身没有实现SLF4J API，所以需要有一个前置转换。Logback就是按照SLF4J API标准实现的，因此不需要绑定模块做转换。</li></ul><p>需要理清楚的是，虽然我们可以使用log4j-over-slf4j来实现Log4j桥接到SLF4J，也可以使用slf4j-log4j12实现SLF4J适配到Log4j，也把它们画到了一列， <strong>但是它不能同时使用它们，否则就会产生死循环。jcl和jul也是同样的道理。</strong></p><p>虽然图中有4个灰色的日志实现框架，但我看到的业务系统使用最广泛的是Logback和Log4j，它们是同一人开发的。Logback可以认为是Log4j的改进版本，我更推荐使用。所以，关于日志框架配置的案例，我都会围绕Logback展开。</p><p>Spring Boot是目前最流行的Java框架，它的日志框架也用的是Logback。那，为什么我们没有手动引入Logback的包，就可以直接使用Logback了呢？</p><p>查看Spring Boot的Maven依赖树，可以发现spring-boot-starter模块依赖了spring-boot-starter-logging模块，而spring-boot-starter-logging模块又帮我们自动引入了logback-classic（包含了SLF4J和Logback日志框架）和SLF4J的一些适配器。其中，log4j-to-slf4j用于实现Log4j2 API到SLF4J的桥接，jul-to-slf4j则是实现java.util.logging API到SLF4J的桥接：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/4c44672d280b8a30be777b78de6014e6.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/4c44672d280b8a30be777b78de6014e6.png" alt=""></a></p><p>接下来，我就用几个实际的案例和你说说日志配置和记录这两大问题，顺便以Logback为例复习一下常见的日志配置。</p><h2 id="为什么我的日志会重复记录" tabindex="-1">为什么我的日志会重复记录？ <a class="header-anchor" href="#为什么我的日志会重复记录" aria-label="Permalink to &quot;为什么我的日志会重复记录？&quot;">​</a></h2><p>日志重复记录在业务上非常常见，不但给查看日志和统计工作带来不必要的麻烦，还会增加磁盘和日志收集系统的负担。接下来，我和你分享两个重复记录的案例，同时帮助你梳理Logback配置的基本结构。</p><p><strong>第一个案例是，logger配置继承关系导致日志重复记录</strong>。首先，定义一个方法实现debug、info、warn和error四种日志的记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Log4j2</span></span>
<span class="line"><span>&amp;#64;RequestMapping(&quot;logging&quot;)</span></span>
<span class="line"><span>&amp;#64;RestController</span></span>
<span class="line"><span>public class LoggingController {</span></span>
<span class="line"><span>    &amp;#64;GetMapping(&quot;log&quot;)</span></span>
<span class="line"><span>    public void log() {</span></span>
<span class="line"><span>        log.debug(&quot;debug&quot;);</span></span>
<span class="line"><span>        log.info(&quot;info&quot;);</span></span>
<span class="line"><span>        log.warn(&quot;warn&quot;);</span></span>
<span class="line"><span>        log.error(&quot;error&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，使用下面的Logback配置：</p><ul><li>第11和12行设置了全局的日志级别为INFO，日志输出使用CONSOLE Appender。</li><li>第3到7行，首先将CONSOLE Appender定义为ConsoleAppender，也就是把日志输出到控制台（System.out/System.err）；然后通过PatternLayout定义了日志的输出格式。关于格式化字符串的各种使用方式，你可以进一步查阅 <a href="http://logback.qos.ch/manual/layouts.html#conversionWord" target="_blank" rel="noreferrer">官方文档</a>。</li><li>第8到10行实现了一个Logger配置，将应用包的日志级别设置为DEBUG、日志输出同样使用CONSOLE Appender。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender name=&quot;CONSOLE&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/layout&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;logger name=&quot;org.geekbang.time.commonmistakes.logging&quot; level=&quot;DEBUG&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;appender-ref ref=&quot;CONSOLE&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/logger&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;root level=&quot;INFO&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;appender-ref ref=&quot;CONSOLE&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/root&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/configuration&amp;gt;</span></span></code></pre></div><p>这段配置看起来没啥问题，但执行方法后出现了日志重复记录的问题：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/2c6f45bbbe06c1ed26b514e7ac873b15.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/2c6f45bbbe06c1ed26b514e7ac873b15.png" alt=""></a></p><p>从配置文件的第9和12行可以看到，CONSOLE这个Appender同时挂载到了两个Logger上，一个是我们定义的&lt;logger&gt;，一个是&lt;root&gt;，由于我们定义的&lt;logger&gt;继承自&lt;root&gt;， <strong>所以同一条日志既会通过logger记录，也会发送到root记录，因此应用package下的日志出现了重复记录。</strong></p><p>后来我了解到，这个同学如此配置的初衷是实现自定义的logger配置，让应用内的日志暂时开启DEBUG级别的日志记录。其实，他完全不需要重复挂载Appender，去掉&lt;logger&gt;下挂载的Appender即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;logger name=&quot;org.geekbang.time.commonmistakes.logging&quot; level=&quot;DEBUG&quot;/&amp;gt;</span></span></code></pre></div><p>如果自定义的&lt;logger&gt;需要把日志输出到不同的Appender，比如将应用的日志输出到文件app.log、把其他框架的日志输出到控制台，可以设置&lt;logger&gt;的additivity属性为false，这样就不会继承&lt;root&gt;的Appender了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender name=&quot;FILE&quot; class=&quot;ch.qos.logback.core.FileAppender&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;file&amp;gt;app.log&amp;lt;/file&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;encoder class=&quot;ch.qos.logback.classic.encoder.PatternLayoutEncoder&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/encoder&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender name=&quot;CONSOLE&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;/layout&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;logger name=&quot;org.geekbang.time.commonmistakes.logging&quot; level=&quot;DEBUG&quot; additivity=&quot;false&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;appender-ref ref=&quot;FILE&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/logger&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;root level=&quot;INFO&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;appender-ref ref=&quot;CONSOLE&quot; /&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/root&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/configuration&amp;gt;</span></span></code></pre></div><p><strong>第二个案例是，错误配置LevelFilter造成日志重复记录。</strong></p><p>一般互联网公司都会使用ELK三件套来统一收集日志，有一次我们发现Kibana上展示的日志有部分重复，一直怀疑是Logstash配置错误，但最后发现还是Logback的配置错误引起的。</p><p>这个项目的日志是这样配置的：在记录日志到控制台的同时，把日志记录按照不同的级别记录到两个文件中：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;property name=&quot;logDir&quot; value=&quot;./logs&quot; /&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;property name=&quot;app.name&quot; value=&quot;common-mistakes&quot; /&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;appender name=&quot;CONSOLE&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;/layout&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;appender name=&quot;INFO_FILE&quot; class=&quot;ch.qos.logback.core.FileAppender&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;File&amp;gt;\${logDir}/\${app.name}_info.log&amp;lt;/File&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;level&amp;gt;INFO&amp;lt;/level&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;/filter&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;encoder class=&quot;ch.qos.logback.classic.encoder.PatternLayoutEncoder&quot;&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;charset&amp;gt;UTF-8&amp;lt;/charset&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;/encoder&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;appender name=&quot;ERROR_FILE&quot; class=&quot;ch.qos.logback.core.FileAppender</span></span>
<span class="line"><span>&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;File&amp;gt;\${logDir}/\${app.name}_error.log&amp;lt;/File&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;filter class=&quot;ch.qos.logback.classic.filter.ThresholdFilter&quot;&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;level&amp;gt;WARN&amp;lt;/level&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;/filter&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;encoder class=&quot;ch.qos.logback.classic.encoder.PatternLayoutEncoder&quot;&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>         &amp;lt;charset&amp;gt;UTF-8&amp;lt;/charset&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;/encoder&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;root level=&quot;INFO&quot;&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;appender-ref ref=&quot;CONSOLE&quot; /&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;appender-ref ref=&quot;INFO_FILE&quot;/&amp;gt;</span></span>
<span class="line"><span>      &amp;lt;appender-ref ref=&quot;ERROR_FILE&quot;/&amp;gt;</span></span>
<span class="line"><span>   &amp;lt;/root&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/configuration&amp;gt;</span></span></code></pre></div><p>这个配置文件比较长，我带着你一段一段地看：</p><ul><li>第31到35行定义的root引用了三个Appender。</li><li>第5到9行是第一个ConsoleAppender，用于把所有日志输出到控制台。</li><li>第10到19行定义了一个FileAppender，用于记录文件日志，并定义了文件名、记录日志的格式和编码等信息。最关键的是，第12到14行定义的LevelFilter过滤日志，将过滤级别设置为INFO，目的是希望_info.log文件中可以记录INFO级别的日志。</li><li>第20到30行定义了一个类似的FileAppender，并使用ThresholdFilter来过滤日志，过滤级别设置为WARN，目的是把WARN以上级别的日志记录到另一个_error.log文件中。</li></ul><p>运行一下测试程序：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/e940f1310e70b65ff716dc81c9901d4e.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/e940f1310e70b65ff716dc81c9901d4e.png" alt=""></a></p><p>可以看到，_info.log中包含了INFO、WARN和ERROR三个级别的日志，不符合我们的预期；error.log包含了WARN和ERROR两个级别的日志。因此，造成了日志的重复收集。</p><p>你可能会问，这么明显的日志重复为什么没有及时发现？一些公司使用自动化的ELK方案收集日志，日志会同时输出到控制台和文件，开发人员在本机测试时不太会关心文件中记录的日志，而在测试和生产环境又因为开发人员没有服务器访问权限，所以原始日志文件中的重复问题并不容易发现。</p><p>为了分析日志重复的原因，我们来复习一下ThresholdFilter和LevelFilter的配置方式。</p><p>分析ThresholdFilter的源码发现，当日志级别大于等于配置的级别时返回NEUTRAL，继续调用过滤器链上的下一个过滤器；否则，返回DENY直接拒绝记录日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThresholdFilter extends Filter&amp;lt;ILoggingEvent&amp;gt; {</span></span>
<span class="line"><span>    public FilterReply decide(ILoggingEvent event) {</span></span>
<span class="line"><span>        if (!isStarted()) {</span></span>
<span class="line"><span>            return FilterReply.NEUTRAL;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (event.getLevel().isGreaterOrEqual(level)) {</span></span>
<span class="line"><span>            return FilterReply.NEUTRAL;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            return FilterReply.DENY;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在这个案例中，把ThresholdFilter设置为WARN，可以记录WARN和ERROR级别的日志。</p><p>LevelFilter用来比较日志级别，然后进行相应处理：如果匹配就调用onMatch定义的处理方式，默认是交给下一个过滤器处理（AbstractMatcherFilter基类中定义的默认值）；否则，调用onMismatch定义的处理方式，默认也是交给下一个过滤器处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LevelFilter extends AbstractMatcherFilter&amp;lt;ILoggingEvent&amp;gt; {</span></span>
<span class="line"><span>	public FilterReply decide(ILoggingEvent event) {</span></span>
<span class="line"><span>	    if (!isStarted()) {</span></span>
<span class="line"><span>	        return FilterReply.NEUTRAL;</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	    if (event.getLevel().equals(level)) {</span></span>
<span class="line"><span>	        return onMatch;</span></span>
<span class="line"><span>	    } else {</span></span>
<span class="line"><span>	        return onMismatch;</span></span>
<span class="line"><span>	    }</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public abstract class AbstractMatcherFilter&amp;lt;E&amp;gt; extends Filter&amp;lt;E&amp;gt; {</span></span>
<span class="line"><span>    protected FilterReply onMatch = FilterReply.NEUTRAL;</span></span>
<span class="line"><span>    protected FilterReply onMismatch = FilterReply.NEUTRAL;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>和ThresholdFilter不同的是，LevelFilter仅仅配置level是无法真正起作用的。 <strong>由于没有配置onMatch和onMismatch属性，所以相当于这个过滤器是无用的，导致INFO以上级别的日志都记录了。</strong></p><p>定位到问题后，修改方式就很明显了：配置LevelFilter的onMatch属性为ACCEPT，表示接收INFO级别的日志；配置onMismatch属性为DENY，表示除了INFO级别都不记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;appender name=&quot;INFO_FILE&quot; class=&quot;ch.qos.logback.core.FileAppender&quot;&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;File&amp;gt;\${logDir}/\${app.name}_info.log&amp;lt;/File&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;filter class=&quot;ch.qos.logback.classic.filter.LevelFilter&quot;&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;level&amp;gt;INFO&amp;lt;/level&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;onMatch&amp;gt;ACCEPT&amp;lt;/onMatch&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;onMismatch&amp;gt;DENY&amp;lt;/onMismatch&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;/filter&amp;gt;</span></span>
<span class="line"><span>	...</span></span>
<span class="line"><span>&amp;lt;/appender&amp;gt;</span></span></code></pre></div><p>这样修改后，_info.log文件中只会有INFO级别的日志，不会出现日志重复的问题了。</p><h2 id="使用异步日志改善性能的坑" tabindex="-1">使用异步日志改善性能的坑 <a class="header-anchor" href="#使用异步日志改善性能的坑" aria-label="Permalink to &quot;使用异步日志改善性能的坑&quot;">​</a></h2><p>掌握了把日志输出到文件中的方法后，我们接下来面临的问题是，如何避免日志记录成为应用的性能瓶颈。这可以帮助我们解决，磁盘（比如机械磁盘）IO性能较差、日志量又很大的情况下，如何记录日志的问题。</p><p>我们先来测试一下，记录日志的性能问题，定义如下的日志配置，一共有两个Appender：</p><ul><li>FILE是一个FileAppender，用于记录所有的日志；</li><li>CONSOLE是一个ConsoleAppender，用于记录带有time标记的日志。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender name=&quot;FILE&quot; class=&quot;ch.qos.logback.core.FileAppender&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;file&amp;gt;app.log&amp;lt;/file&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;encoder class=&quot;ch.qos.logback.classic.encoder.PatternLayoutEncoder&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/encoder&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender name=&quot;CONSOLE&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/layout&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;filter class=&quot;ch.qos.logback.core.filter.EvaluatorFilter&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;evaluator class=&quot;ch.qos.logback.classic.boolex.OnMarkerEvaluator&quot;&amp;gt;</span></span>
<span class="line"><span>                &amp;lt;marker&amp;gt;time&amp;lt;/marker&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;/evaluator&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;onMismatch&amp;gt;DENY&amp;lt;/onMismatch&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;onMatch&amp;gt;ACCEPT&amp;lt;/onMatch&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;/filter&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;root level=&quot;INFO&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;appender-ref ref=&quot;FILE&quot;/&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;appender-ref ref=&quot;CONSOLE&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/root&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/configuration&amp;gt;</span></span></code></pre></div><p>不知道你有没有注意到，这段代码中有个EvaluatorFilter（求值过滤器），用于判断日志是否符合某个条件。</p><p>在后续的测试代码中，我们会把大量日志输出到文件中，日志文件会非常大，如果性能测试结果也混在其中的话，就很难找到那条日志。所以，这里我们使用EvaluatorFilter对日志按照标记进行过滤，并将过滤出的日志单独输出到控制台上。在这个案例中，我们给输出测试结果的那条日志上做了time标记。</p><p>配合使用标记和EvaluatorFilter，实现日志的按标签过滤，是一个不错的小技巧。</p><p>如下测试代码中，实现了记录指定次数的大日志，每条日志包含1MB字节的模拟数据，最后记录一条以time为标记的方法执行耗时日志：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;performance&quot;)</span></span>
<span class="line"><span>public void performance(&amp;#64;RequestParam(name = &quot;count&quot;, defaultValue = &quot;1000&quot;) int count) {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    String payload = IntStream.rangeClosed(1, 1000000)</span></span>
<span class="line"><span>            .mapToObj(__ -&amp;gt; &quot;a&quot;)</span></span>
<span class="line"><span>            .collect(Collectors.joining(&quot;&quot;)) + UUID.randomUUID().toString();</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, count).forEach(i -&amp;gt; log.info(&quot;{} {}&quot;, i, payload));</span></span>
<span class="line"><span>    Marker timeMarker = MarkerFactory.getMarker(&quot;time&quot;);</span></span>
<span class="line"><span>    log.info(timeMarker, &quot;took {} ms&quot;, System.currentTimeMillis() - begin);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行程序后可以看到，记录1000次日志和10000次日志的调用耗时，分别是6.3秒和44.5秒：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/7ee5152dedcbb585f23db49571bacc52.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/7ee5152dedcbb585f23db49571bacc52.png" alt=""></a></p><p>对于只记录文件日志的代码了来说，这个耗时挺长的。为了分析其中原因，我们需要分析下FileAppender的源码。</p><p>FileAppender继承自OutputStreamAppender，查看OutputStreamAppender源码的第30到33行发现， <strong>在追加日志的时候，是直接把日志写入OutputStream中，属于同步记录日志：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class OutputStreamAppender&amp;lt;E&amp;gt; extends UnsynchronizedAppenderBase&amp;lt;E&amp;gt; {</span></span>
<span class="line"><span>	private OutputStream outputStream;</span></span>
<span class="line"><span>	boolean immediateFlush = true;</span></span>
<span class="line"><span>	&amp;#64;Override</span></span>
<span class="line"><span>    protected void append(E eventObject) {</span></span>
<span class="line"><span>        if (!isStarted()) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        subAppend(eventObject);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected void subAppend(E event) {</span></span>
<span class="line"><span>        if (!isStarted()) {</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //编码LoggingEvent</span></span>
<span class="line"><span>            byte[] byteArray = this.encoder.encode(event);</span></span>
<span class="line"><span>            //写字节流</span></span>
<span class="line"><span>            writeBytes(byteArray);</span></span>
<span class="line"><span>        } catch (IOException ioe) {</span></span>
<span class="line"><span>            ...</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void writeBytes(byte[] byteArray) throws IOException {</span></span>
<span class="line"><span>        if(byteArray == null || byteArray.length == 0)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //这个OutputStream其实是一个ResilientFileOutputStream，其内部使用的是带缓冲的BufferedOutputStream</span></span>
<span class="line"><span>            this.outputStream.write(byteArray);</span></span>
<span class="line"><span>            if (immediateFlush) {</span></span>
<span class="line"><span>                this.outputStream.flush();//刷入OS</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>分析到这里，我们就明白为什么日志大量写入时会耗时这么久了。那，有没有办法实现大量日志写入时，不会过多影响业务逻辑执行耗时，影响吞吐量呢？</p><p>办法当然有了，使用Logback提供的AsyncAppender即可实现异步的日志记录。AsyncAppende类似装饰模式，也就是在不改变类原有基本功能的情况下为其增添新功能。这样，我们就可以把AsyncAppender附加在其他的Appender上，将其变为异步的。</p><p>定义一个异步Appender ASYNCFILE，包装之前的同步文件日志记录的FileAppender，就可以实现异步记录日志到文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;appender name=&quot;ASYNCFILE&quot; class=&quot;ch.qos.logback.classic.AsyncAppender&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender-ref ref=&quot;FILE&quot;/&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>&amp;lt;root level=&quot;INFO&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender-ref ref=&quot;ASYNCFILE&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;appender-ref ref=&quot;CONSOLE&quot;/&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/root&amp;gt;</span></span></code></pre></div><p>测试一下可以发现，记录1000次日志和10000次日志的调用耗时，分别是735毫秒和668毫秒：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/98d1633d83734f9b8f08c3334b403ce1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/98d1633d83734f9b8f08c3334b403ce1.png" alt=""></a></p><p>性能居然这么好，你觉得其中有什么问题吗？异步日志真的如此神奇和万能吗？当然不是，因为这样并没有记录下所有日志。 <strong>我之前就遇到过很多关于AsyncAppender异步日志的坑，这些坑可以归结为三类：</strong></p><ul><li>记录异步日志撑爆内存；</li><li>记录异步日志出现日志丢失；</li><li>记录异步日志出现阻塞。</li></ul><p>为了解释这三种坑，我来模拟一个慢日志记录场景：首先，自定义一个继承自ConsoleAppender的MySlowAppender，作为记录到控制台的输出器，写入日志时休眠1秒。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MySlowAppender extends ConsoleAppender {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void subAppend(Object event) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 模拟慢日志</span></span>
<span class="line"><span>            TimeUnit.MILLISECONDS.sleep(1);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        super.subAppend(event);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后，在配置文件中使用AsyncAppender，将MySlowAppender包装为异步日志记录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&amp;gt;</span></span>
<span class="line"><span>&amp;lt;configuration&amp;gt;</span></span>
<span class="line"><span>&amp;lt;appender name=&quot;CONSOLE&quot; class=&quot;org.geekbang.time.commonmistakes.logging.async.MySlowAppender&quot;&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;layout class=&quot;ch.qos.logback.classic.PatternLayout&quot;&amp;gt;</span></span>
<span class="line"><span>            &amp;lt;pattern&amp;gt;[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%thread] [%-5level] [%logger{40}:%line] - %msg%n&amp;lt;/pattern&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;/layout&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;appender name=&quot;ASYNC&quot; class=&quot;ch.qos.logback.classic.AsyncAppender&quot;&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;appender-ref ref=&quot;CONSOLE&quot; /&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;/appender&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;root level=&quot;INFO&quot;&amp;gt;</span></span>
<span class="line"><span>		&amp;lt;appender-ref ref=&quot;ASYNC&quot; /&amp;gt;</span></span>
<span class="line"><span>	&amp;lt;/root&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/configuration&amp;gt;</span></span></code></pre></div><p>定义一段测试代码，循环记录一定次数的日志，最后输出方法执行耗时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;manylog&quot;)</span></span>
<span class="line"><span>public void manylog(&amp;#64;RequestParam(name = &quot;count&quot;, defaultValue = &quot;1000&quot;) int count) {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, count).forEach(i -&amp;gt; log.info(&quot;log-{}&quot;, i));</span></span>
<span class="line"><span>    System.out.println(&quot;took &quot; + (System.currentTimeMillis() - begin) + &quot; ms&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行方法后发现，耗时很短但出现了日志丢失：我们要记录1000条日志，最终控制台只能搜索到215条日志，而且日志的行号变为了一个问号。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/5fe1562b437b8672e4b1e9e463a24570.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/5fe1562b437b8672e4b1e9e463a24570.png" alt=""></a></p><p>出现这个问题的原因在于，AsyncAppender提供了一些配置参数，而我们没用对。我们结合相关源码分析一下：</p><ul><li>includeCallerData用于控制是否收集调用方数据，默认是false，此时方法行号、方法名等信息将不能显示（源码第2行以及7到11行）。</li><li>queueSize用于控制阻塞队列大小，使用的ArrayBlockingQueue阻塞队列（源码第15到17行），默认大小是256，即内存中最多保存256条日志。</li><li>discardingThreshold是控制丢弃日志的阈值，主要是防止队列满后阻塞。默认情况下，队列剩余量低于队列长度的20%，就会丢弃TRACE、DEBUG和INFO级别的日志。（参见源码第3到6行、18到19行、26到27行、33到34行、40到42行）</li><li>neverBlock用于控制队列满的时候，加入的数据是否直接丢弃，不会阻塞等待，默认是false（源码第44到68行）。这里需要注意一下offer方法和put方法的区别，当队列满的时候offer方法不阻塞，而put方法会阻塞；neverBlock为true时，使用offer方法。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AsyncAppender extends AsyncAppenderBase&amp;lt;ILoggingEvent&amp;gt; {</span></span>
<span class="line"><span>    boolean includeCallerData = false;//是否收集调用方数据</span></span>
<span class="line"><span>    protected boolean isDiscardable(ILoggingEvent event) {</span></span>
<span class="line"><span>        Level level = event.getLevel();</span></span>
<span class="line"><span>        return level.toInt() &amp;lt;= Level.INFO_INT;//丢弃&amp;lt;=INFO级别的日志</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    protected void preprocess(ILoggingEvent eventObject) {</span></span>
<span class="line"><span>        eventObject.prepareForDeferredProcessing();</span></span>
<span class="line"><span>        if (includeCallerData)</span></span>
<span class="line"><span>            eventObject.getCallerData();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class AsyncAppenderBase&amp;lt;E&amp;gt; extends UnsynchronizedAppenderBase&amp;lt;E&amp;gt; implements AppenderAttachable&amp;lt;E&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    BlockingQueue&amp;lt;E&amp;gt; blockingQueue;//异步日志的关键，阻塞队列</span></span>
<span class="line"><span>    public static final int DEFAULT_QUEUE_SIZE = 256;//默认队列大小</span></span>
<span class="line"><span>    int queueSize = DEFAULT_QUEUE_SIZE;</span></span>
<span class="line"><span>    static final int UNDEFINED = -1;</span></span>
<span class="line"><span>    int discardingThreshold = UNDEFINED;</span></span>
<span class="line"><span>    boolean neverBlock = false;//控制队列满的时候加入数据时是否直接丢弃，不会阻塞等待</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void start() {</span></span>
<span class="line"><span>       	...</span></span>
<span class="line"><span>        blockingQueue = new ArrayBlockingQueue&amp;lt;E&amp;gt;(queueSize);</span></span>
<span class="line"><span>        if (discardingThreshold == UNDEFINED)</span></span>
<span class="line"><span>            discardingThreshold = queueSize / 5;//默认丢弃阈值是队列剩余量低于队列长度的20%，参见isQueueBelowDiscardingThreshold方法</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    protected void append(E eventObject) {</span></span>
<span class="line"><span>        if (isQueueBelowDiscardingThreshold() &amp;&amp; isDiscardable(eventObject)) { //判断是否可以丢数据</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        preprocess(eventObject);</span></span>
<span class="line"><span>        put(eventObject);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private boolean isQueueBelowDiscardingThreshold() {</span></span>
<span class="line"><span>        return (blockingQueue.remainingCapacity() &amp;lt; discardingThreshold);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void put(E eventObject) {</span></span>
<span class="line"><span>        if (neverBlock) { //根据neverBlock决定使用不阻塞的offer还是阻塞的put方法</span></span>
<span class="line"><span>            blockingQueue.offer(eventObject);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            putUninterruptibly(eventObject);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //以阻塞方式添加数据到队列</span></span>
<span class="line"><span>    private void putUninterruptibly(E eventObject) {</span></span>
<span class="line"><span>        boolean interrupted = false;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            while (true) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    blockingQueue.put(eventObject);</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                } catch (InterruptedException e) {</span></span>
<span class="line"><span>                    interrupted = true;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            if (interrupted) {</span></span>
<span class="line"><span>                Thread.currentThread().interrupt();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看到默认队列大小为256，达到80%容量后开始丢弃&lt;=INFO级别的日志后，我们就可以理解日志中为什么只有215条INFO日志了。</p><p>我们可以继续分析下异步记录日志出现坑的原因。</p><ul><li>queueSize设置得特别大，就可能会导致OOM。</li><li>queueSize设置得比较小（默认值就非常小），且discardingThreshold设置为大于0的值（或者为默认值），队列剩余容量少于discardingThreshold的配置就会丢弃&lt;=INFO的日志。这里的坑点有两个。一是，因为discardingThreshold的存在，设置queueSize时容易踩坑。比如，本例中最大日志并发是1000，即便设置queueSize为1000同样会导致日志丢失。二是，discardingThreshold参数容易有歧义，它不是百分比，而是日志条数。对于总容量10000的队列，如果希望队列剩余容量少于1000条的时候丢弃，需要配置为1000。</li><li>neverBlock默认为false，意味着总可能会出现阻塞。如果discardingThreshold为0，那么队列满时再有日志写入就会阻塞；如果discardingThreshold不为0，也只会丢弃&lt;=INFO级别的日志，那么出现大量错误日志时，还是会阻塞程序。</li></ul><p>可以看出queueSize、discardingThreshold和neverBlock这三个参数息息相关，务必按需进行设置和取舍，到底是性能为先，还是数据不丢为先：</p><ul><li>如果考虑绝对性能为先，那就设置neverBlock为true，永不阻塞。</li><li>如果考虑绝对不丢数据为先，那就设置discardingThreshold为0，即使是&lt;=INFO的级别日志也不会丢，但最好把queueSize设置大一点，毕竟默认的queueSize显然太小，太容易阻塞。</li><li>如果希望兼顾两者，可以丢弃不重要的日志，把queueSize设置大一点，再设置一个合理的discardingThreshold。</li></ul><p>以上就是日志配置最常见的两个误区了。接下来，我们再看一个日志记录本身的误区。</p><h2 id="使用日志占位符就不需要进行日志级别判断了" tabindex="-1">使用日志占位符就不需要进行日志级别判断了？ <a class="header-anchor" href="#使用日志占位符就不需要进行日志级别判断了" aria-label="Permalink to &quot;使用日志占位符就不需要进行日志级别判断了？&quot;">​</a></h2><p>不知道你有没有听人说过：SLF4J的{}占位符语法，到真正记录日志时才会获取实际参数，因此解决了日志数据获取的性能问题。你觉得，这种说法对吗？</p><p>为了验证这个问题，我们写一段测试代码：有一个slowString方法，返回结果耗时1秒：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private String slowString(String s) {</span></span>
<span class="line"><span>    System.out.println(&quot;slowString called via &quot; + s);</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        TimeUnit.SECONDS.sleep(1);</span></span>
<span class="line"><span>    } catch (InterruptedException e) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return &quot;OK&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果我们记录DEBUG日志，并设置只记录&gt;=INFO级别的日志，程序是否也会耗时1秒呢？我们使用三种方法来测试：</p><ul><li>拼接字符串方式记录slowString；</li><li>使用占位符方式记录slowString；</li><li>先判断日志级别是否启用DEBUG。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>StopWatch stopWatch = new StopWatch();</span></span>
<span class="line"><span>stopWatch.start(&quot;debug1&quot;);</span></span>
<span class="line"><span>log.debug(&quot;debug1:&quot; + slowString(&quot;debug1&quot;));</span></span>
<span class="line"><span>stopWatch.stop();</span></span>
<span class="line"><span>stopWatch.start(&quot;debug2&quot;);</span></span>
<span class="line"><span>log.debug(&quot;debug2:{}&quot;, slowString(&quot;debug2&quot;));</span></span>
<span class="line"><span>stopWatch.stop();</span></span>
<span class="line"><span>stopWatch.start(&quot;debug3&quot;);</span></span>
<span class="line"><span>if (log.isDebugEnabled())</span></span>
<span class="line"><span>    log.debug(&quot;debug3:{}&quot;, slowString(&quot;debug3&quot;));</span></span>
<span class="line"><span>stopWatch.stop();</span></span></code></pre></div><p>可以看到，前两种方式都调用了slowString方法，所以耗时都是1秒：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/fbaac87cad19b2136e6f9f99bbc43183.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/fbaac87cad19b2136e6f9f99bbc43183.png" alt=""></a></p><p>使用占位符方式记录slowString的方式，同样需要耗时1秒，是因为这种方式虽然允许我们传入Object，不用拼接字符串，但也只是延迟（如果日志不记录那么就是省去）了日志参数对象.toString()和字符串拼接的耗时。</p><p>在这个案例中，除非事先判断日志级别，否则必然会调用slowString方法。 <strong>回到之前提的问题，使用{}占位符语法不能通过延迟参数值获取，来解决日志数据获取的性能问题。</strong></p><p>除了事先判断日志级别，我们还可以通过lambda表达式进行延迟参数内容获取。但，SLF4J的API还不支持lambda，因此需要使用Log4j2日志API，把Lombok的@Slf4j注解替换为@Log4j2注解，这样就可以提供一个lambda表达式作为提供参数数据的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Log4j2</span></span>
<span class="line"><span>public class LoggingController {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>log.debug(&quot;debug4:{}&quot;, ()-&amp;gt;slowString(&quot;debug4&quot;));</span></span></code></pre></div><p>像这样调用debug方法，签名是Supplier&lt;?&gt;，参数会延迟到真正需要记录日志时再获取：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void debug(String message, Supplier&amp;lt;?&amp;gt;... paramSuppliers);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void logIfEnabled(final String fqcn, final Level level, final Marker marker, final String message,</span></span>
<span class="line"><span>        final Supplier&amp;lt;?&amp;gt;... paramSuppliers) {</span></span>
<span class="line"><span>    if (isEnabled(level, marker, message)) {</span></span>
<span class="line"><span>        logMessage(fqcn, level, marker, message, paramSuppliers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>protected void logMessage(final String fqcn, final Level level, final Marker marker, final String message,</span></span>
<span class="line"><span>        final Supplier&amp;lt;?&amp;gt;... paramSuppliers) {</span></span>
<span class="line"><span>    final Message msg = messageFactory.newMessage(message, LambdaUtil.getAll(paramSuppliers));</span></span>
<span class="line"><span>    logMessageSafely(fqcn, level, marker, msg, msg.getThrowable());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>修改后再次运行测试，可以看到这次debug4并不会调用slowString方法：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/6c44d97b24fa51ec249759cb62828aab.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/220307/6c44d97b24fa51ec249759cb62828aab.png" alt=""></a></p><p>其实，我们只是换成了Log4j2 API，真正的日志记录还是走的Logback框架。没错，这就是SLF4J适配的一个好处。</p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>我将记录日志的坑，总结为框架使用配置和记录本身两个方面。</p><p>Java的日志框架众多，SLF4J实现了这些框架记录日志的统一。在使用SLF4J时，我们需要理清楚其桥接API和绑定这两个模块。如果程序启动时出现SLF4J的错误提示，那很可能是配置出现了问题，可以使用Maven的dependency:tree命令梳理依赖关系。</p><p>Logback是Java最常用的日志框架，其配置比较复杂，你可以参考官方文档中关于Appender、Layout、Filter的配置，切记不要随意从其他地方复制别人的配置，避免出现错误或与当前需求不符。</p><p>使用异步日志解决性能问题，是用空间换时间。但空间毕竟有限，当空间满了之后，我们要考虑是阻塞等待，还是丢弃日志。如果更希望不丢弃重要日志，那么选择阻塞等待；如果更希望程序不要因为日志记录而阻塞，那么就需要丢弃日志。</p><p>最后，我强调的是，日志框架提供的参数化日志记录方式不能完全取代日志级别的判断。如果你的日志量很大，获取日志参数代价也很大，就要进行相应日志级别的判断，避免不记录日志也要花费时间获取日志参数的问题。</p><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>在第一小节的案例中，我们把INFO级别的日志存放到_info.log中，把WARN和ERROR级别的日志存放到_error.log中。如果现在要把INFO和WARN级别的日志存放到_info.log中，把ERROR日志存放到_error.log中，应该如何配置Logback呢？</li><li>生产级项目的文件日志肯定需要按时间和日期进行分割和归档处理，以避免单个文件太大，同时保留一定天数的历史日志，你知道如何配置吗？可以在 <a href="http://logback.qos.ch/manual/appenders.html#RollingFileAppender" target="_blank" rel="noreferrer">官方文档</a> 找到答案。</li></ol><p>针对日志记录和配置，你还遇到过其他坑吗？我是朱晔，欢迎在评论区与我留言分享，也欢迎你把这篇文章分享给你的朋友或同事，一起交流。</p>`,116)])])}const d=s(l,[["render",t]]);export{m as __pageData,d as default};
