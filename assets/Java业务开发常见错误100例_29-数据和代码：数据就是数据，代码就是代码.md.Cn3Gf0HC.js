import{_ as a,H as n,f as p,i as e}from"./chunks/framework.BH2BK_3i.js";const g=JSON.parse('{"title":"29 | 数据和代码：数据就是数据，代码就是代码","description":"","frontmatter":{},"headers":[{"level":2,"title":"SQL注入能干的事情比你想象的更多","slug":"sql注入能干的事情比你想象的更多","link":"#sql注入能干的事情比你想象的更多","children":[]},{"level":2,"title":"小心动态执行代码时代码注入漏洞","slug":"小心动态执行代码时代码注入漏洞","link":"#小心动态执行代码时代码注入漏洞","children":[]},{"level":2,"title":"XSS必须全方位严防死堵","slug":"xss必须全方位严防死堵","link":"#xss必须全方位严防死堵","children":[]},{"level":2,"title":"重点回顾","slug":"重点回顾","link":"#重点回顾","children":[]},{"level":2,"title":"思考与讨论","slug":"思考与讨论","link":"#思考与讨论","children":[]}],"relativePath":"Java业务开发常见错误100例/29-数据和代码：数据就是数据，代码就是代码.md","filePath":"Java业务开发常见错误100例/29-数据和代码：数据就是数据，代码就是代码.md","lastUpdated":1779815815000}'),t={name:"Java业务开发常见错误100例/29-数据和代码：数据就是数据，代码就是代码.md"};function i(l,s,c,o,r,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="_29-数据和代码-数据就是数据-代码就是代码" tabindex="-1">29 | 数据和代码：数据就是数据，代码就是代码 <a class="header-anchor" href="#_29-数据和代码-数据就是数据-代码就是代码" aria-label="Permalink to &quot;29 | 数据和代码：数据就是数据，代码就是代码&quot;">​</a></h1><p>你好，我是朱晔。今天，我来和你聊聊数据和代码的问题。</p><p>正如这一讲标题“数据就是数据，代码就是代码”所说，Web安全方面的很多漏洞，都是源自把数据当成了代码来执行，也就是注入类问题，比如：</p><ul><li>客户端提供给服务端的查询值，是一个数据，会成为SQL查询的一部分。黑客通过修改这个值注入一些SQL，来达到在服务端运行SQL的目的，相当于把查询条件的数据变为了查询代码。这种攻击方式，叫做SQL注入。</li><li>对于规则引擎，我们可能会用动态语言做一些计算，和SQL注入一样外部传入的数据只能当做数据使用，如果被黑客利用传入了代码，那么代码可能就会被动态执行。这种攻击方式，叫做代码注入。</li><li>对于用户注册、留言评论等功能，服务端会从客户端收集一些信息，本来用户名、邮箱这类信息是纯文本信息，但是黑客把信息替换为了JavaScript代码。那么，这些信息在页面呈现时，可能就相当于执行了JavaScript代码。甚至是，服务端可能把这样的代码，当作普通信息保存到了数据库。黑客通过构建JavaScript代码来实现修改页面呈现、盗取信息，甚至蠕虫攻击的方式，叫做XSS（跨站脚本）攻击。</li></ul><p>今天，我们就通过案例来看一下这三个问题，并了解下应对方式。</p><h2 id="sql注入能干的事情比你想象的更多" tabindex="-1">SQL注入能干的事情比你想象的更多 <a class="header-anchor" href="#sql注入能干的事情比你想象的更多" aria-label="Permalink to &quot;SQL注入能干的事情比你想象的更多&quot;">​</a></h2><p>我们应该都听说过SQL注入，也可能知道最经典的SQL注入的例子，是通过构造’or’1’=&#39;1作为密码实现登录。这种简单的攻击方式，在十几年前可以突破很多后台的登录，但现在很难奏效了。</p><p>最近几年，我们的安全意识增强了，都知道使用参数化查询来避免SQL注入问题。其中的原理是，使用参数化查询的话，参数只能作为普通数据，不可能作为SQL的一部分，以此有效避免SQL注入问题。</p><p>虽然我们已经开始关注SQL注入的问题，但还是有一些认知上的误区，主要表现在以下三个方面：</p><p>第一， <strong>认为SQL注入问题只可能发生于Http Get请求，也就是通过URL传入的参数才可能产生注入点</strong>。这是很危险的想法。从注入的难易度上来说，修改URL上的QueryString和修改Post请求体中的数据，没有任何区别，因为黑客是通过工具来注入的，而不是通过修改浏览器上的URL来注入的。甚至Cookie都可以用来SQL注入，任何提供数据的地方都可能成为注入点。</p><p>第二， <strong>认为不返回数据的接口，不可能存在注入问题</strong>。其实，黑客完全可以利用SQL语句构造出一些不正确的SQL，导致执行出错。如果服务端直接显示了错误信息，那黑客需要的数据就有可能被带出来，从而达到查询数据的目的。甚至是，即使没有详细的出错信息，黑客也可以通过所谓盲注的方式进行攻击。我后面再具体解释。</p><p>第三， <strong>认为SQL注入的影响范围，只是通过短路实现突破登录，只需要登录操作加强防范即可</strong>。首先，SQL注入完全可以实现拖库，也就是下载整个数据库的内容（之后我们会演示），SQL注入的危害不仅仅是突破后台登录。其次，根据木桶原理，整个站点的安全性受限于安全级别最低的那块短板。因此，对于安全问题，站点的所有模块必须一视同仁，并不是只加强防范所谓的重点模块。</p><p>在日常开发中，虽然我们是使用框架来进行数据访问的，但还可能会因为疏漏而导致注入问题。接下来，我就用一个实际的例子配合专业的SQL注入工具 <a href="https://github.com/sqlmapproject/sqlmap" target="_blank" rel="noreferrer">sqlmap</a>，来测试下SQL注入。</p><p>首先，在程序启动的时候使用JdbcTemplate创建一个userdata表（表中只有ID、用户名、密码三列），并初始化两条用户信息。然后，创建一个不返回任何数据的Http Post接口。在实现上，我们通过SQL拼接的方式，把传入的用户名入参拼接到LIKE子句中实现模糊查询。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//程序启动时进行表结构和数据初始化</span></span>
<span class="line"><span>&amp;#64;PostConstruct</span></span>
<span class="line"><span>public void init() {</span></span>
<span class="line"><span>    //删除表</span></span>
<span class="line"><span>    jdbcTemplate.execute(&quot;drop table IF EXISTS \`userdata\`;&quot;);</span></span>
<span class="line"><span>    //创建表，不包含自增ID、用户名、密码三列</span></span>
<span class="line"><span>    jdbcTemplate.execute(&quot;create TABLE \`userdata\` (\\n&quot; +</span></span>
<span class="line"><span>            &quot;  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,\\n&quot; +</span></span>
<span class="line"><span>            &quot;  \`name\` varchar(255) NOT NULL,\\n&quot; +</span></span>
<span class="line"><span>            &quot;  \`password\` varchar(255) NOT NULL,\\n&quot; +</span></span>
<span class="line"><span>            &quot;  PRIMARY KEY (\`id\`)\\n&quot; +</span></span>
<span class="line"><span>            &quot;) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;&quot;);</span></span>
<span class="line"><span>    //插入两条测试数据</span></span>
<span class="line"><span>    jdbcTemplate.execute(&quot;INSERT INTO \`userdata\` (name,password) VALUES (&#39;test1&#39;,&#39;haha1&#39;),(&#39;test2&#39;,&#39;haha2&#39;)&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&amp;#64;Autowired</span></span>
<span class="line"><span>private JdbcTemplate jdbcTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//用户模糊搜索接口</span></span>
<span class="line"><span>&amp;#64;PostMapping(&quot;jdbcwrong&quot;)</span></span>
<span class="line"><span>public void jdbcwrong(&amp;#64;RequestParam(&quot;name&quot;) String name) {</span></span>
<span class="line"><span>    //采用拼接SQL的方式把姓名参数拼到LIKE子句中</span></span>
<span class="line"><span>    log.info(&quot;{}&quot;, jdbcTemplate.queryForList(&quot;SELECT id,name FROM userdata WHERE name LIKE &#39;%&quot; + name + &quot;%&#39;&quot;));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用sqlmap来探索这个接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python sqlmap.py -u  http://localhost:45678/sqlinject/jdbcwrong --data name=test</span></span></code></pre></div><p>一段时间后，sqlmap给出了如下结果：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/2f8e8530dd0f76778c45333adfad5259.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/2f8e8530dd0f76778c45333adfad5259.png" alt=""></a></p><p>可以看到，这个接口的name参数有两种可能的注入方式：一种是报错注入，一种是基于时间的盲注。</p><p>接下来， <strong>仅需简单的三步，就可以直接导出整个用户表的内容了</strong>。</p><p>第一步，查询当前数据库：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python sqlmap.py -u  http://localhost:45678/sqlinject/jdbcwrong --data name=test --current-db</span></span></code></pre></div><p>可以得到当前数据库是common_mistakes：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>current database: &#39;common_mistakes&#39;</span></span></code></pre></div><p>第二步，查询数据库下的表：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python sqlmap.py -u  http://localhost:45678/sqlinject/jdbcwrong --data name=test --tables -D &quot;common_mistakes&quot;</span></span></code></pre></div><p>可以看到其中有一个敏感表userdata：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Database: common_mistakes</span></span>
<span class="line"><span>[7 tables]</span></span>
<span class="line"><span>+--------------------+</span></span>
<span class="line"><span>| user               |</span></span>
<span class="line"><span>| common_store       |</span></span>
<span class="line"><span>| hibernate_sequence |</span></span>
<span class="line"><span>| m                  |</span></span>
<span class="line"><span>| news               |</span></span>
<span class="line"><span>| r                  |</span></span>
<span class="line"><span>| userdata           |</span></span>
<span class="line"><span>+--------------------+</span></span></code></pre></div><p>第三步，查询userdata的数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python sqlmap.py -u  http://localhost:45678/sqlinject/jdbcwrong --data name=test -D &quot;common_mistakes&quot; -T &quot;userdata&quot; --dump</span></span></code></pre></div><p>你看， <strong>用户密码信息一览无遗。当然，你也可以继续查看其他表的数据</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Database: common_mistakes</span></span>
<span class="line"><span>Table: userdata</span></span>
<span class="line"><span>[2 entries]</span></span>
<span class="line"><span>+----+-------+----------+</span></span>
<span class="line"><span>| id | name  | password |</span></span>
<span class="line"><span>+----+-------+----------+</span></span>
<span class="line"><span>| 1  | test1 | haha1    |</span></span>
<span class="line"><span>| 2  | test2 | haha2    |</span></span>
<span class="line"><span>+----+-------+----------+</span></span></code></pre></div><p>在日志中可以看到，sqlmap实现拖库的方式是，让SQL执行后的出错信息包含字段内容。注意看下错误日志的第二行，错误信息中包含ID为2的用户的密码字段的值“haha2”。这，就是报错注入的基本原理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[13:22:27.375] [http-nio-45678-exec-10] [ERROR] [o.a.c.c.C.[.[.[/].[dispatcherServlet]:175 ] - Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.springframework.dao.DuplicateKeyException: StatementCallback; SQL [SELECT id,name FROM userdata WHERE name LIKE &#39;%test&#39;||(SELECT 0x694a6e64 WHERE 3941=3941 AND (SELECT 9927 FROM(SELECT COUNT(*),CONCAT(0x71626a7a71,(SELECT MID((IFNULL(CAST(password AS NCHAR),0x20)),1,54) FROM common_mistakes.userdata ORDER BY id LIMIT 1,1),0x7170706271,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a))||&#39;%&#39;]; Duplicate entry &#39;qbjzqhaha2qppbq1&#39; for key &#39;&amp;lt;group_key&amp;gt;&#39;; nested exception is java.sql.SQLIntegrityConstraintViolationException: Duplicate entry &#39;qbjzqhaha2qppbq1&#39; for key &#39;&amp;lt;group_key&amp;gt;&#39;] with root cause</span></span>
<span class="line"><span>java.sql.SQLIntegrityConstraintViolationException: Duplicate entry &#39;qbjzqhaha2qppbq1&#39; for key &#39;&amp;lt;group_key&amp;gt;&#39;</span></span></code></pre></div><p>既然是这样，我们就实现一个ExceptionHandler来屏蔽异常，看看能否解决注入问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ExceptionHandler</span></span>
<span class="line"><span>public void handle(HttpServletRequest req, HandlerMethod method, Exception ex) {</span></span>
<span class="line"><span>    log.warn(String.format(&quot;访问 %s -&amp;gt; %s 出现异常！&quot;, req.getRequestURI(), method.toString()), ex);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>重启程序后重新运行刚才的sqlmap命令，可以看到报错注入是没戏了，但使用时间盲注还是可以查询整个表的数据：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/76ec4c2217cc5ac190b578e7236dc9c4.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/76ec4c2217cc5ac190b578e7236dc9c4.png" alt=""></a></p><p>所谓盲注，指的是注入后并不能从服务器得到任何执行结果（甚至是错误信息），只能寄希望服务器对于SQL中的真假条件表现出不同的状态。比如，对于布尔盲注来说，可能是“真”可以得到200状态码，“假”可以得到500错误状态码；或者，“真”可以得到内容输出，“假”得不到任何输出。总之，对于不同的SQL注入可以得到不同的输出即可。</p><p>在这个案例中，因为接口没有输出，也彻底屏蔽了错误，布尔盲注这招儿行不通了。那么退而求其次的方式，就是时间盲注。也就是说，通过在真假条件中加入SLEEP，来实现通过判断接口的响应时间，知道条件的结果是真还是假。</p><p>不管是什么盲注，都是通过真假两种状态来完成的。你可能会好奇，通过真假两种状态如何实现数据导出？</p><p>其实你可以想一下，我们虽然不能直接查询出password字段的值，但可以按字符逐一来查，判断第一个字符是否是a、是否是b……，查询到h时发现响应变慢了，自然知道这就是真的，得出第一位就是h。以此类推，可以查询出整个值。</p><p>所以，sqlmap在返回数据的时候，也是一个字符一个字符跳出结果的，并且时间盲注的整个过程会比报错注入慢许多。</p><p>你可以引入 <a href="https://github.com/p6spy/p6spy" target="_blank" rel="noreferrer">p6spy</a> 工具打印出所有执行的SQL，观察sqlmap构造的一些SQL，来分析其中原理：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;dependency&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;groupId&amp;gt;com.github.gavlyukovskiy&amp;lt;/groupId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;artifactId&amp;gt;p6spy-spring-boot-starter&amp;lt;/artifactId&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;version&amp;gt;1.6.1&amp;lt;/version&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/dependency&amp;gt;</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/5d9a582025bb06adf863ae21ccb9280d.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/5d9a582025bb06adf863ae21ccb9280d.png" alt=""></a></p><p>所以说，即使屏蔽错误信息错误码，也不能彻底防止SQL注入。真正的解决方式，还是使用参数化查询，让任何外部输入值只可能作为数据来处理。</p><p>比如，对于之前那个接口， <strong>在SQL语句中使用“?”作为参数占位符，然后提供参数值。</strong> 这样修改后，sqlmap也就无能为力了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PostMapping(&quot;jdbcright&quot;)</span></span>
<span class="line"><span>public void jdbcright(&amp;#64;RequestParam(&quot;name&quot;) String name) {</span></span>
<span class="line"><span>    log.info(&quot;{}&quot;, jdbcTemplate.queryForList(&quot;SELECT id,name FROM userdata WHERE name LIKE ?&quot;, &quot;%&quot; + name + &quot;%&quot;));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>对于MyBatis来说，同样需要使用参数化的方式来写SQL语句。在MyBatis中，“#{}”是参数化的方式，“\${}”只是占位符替换。</strong></p><p>比如LIKE语句。因为使用“#{}”会为参数带上单引号，导致LIKE语法错误，所以一些同学会退而求其次，选择“\${}”的方式，比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Select(&quot;SELECT id,name FROM \`userdata\` WHERE name LIKE &#39;%\${name}%&#39;&quot;)</span></span>
<span class="line"><span>List&amp;lt;UserData&amp;gt; findByNameWrong(&amp;#64;Param(&quot;name&quot;) String name);</span></span></code></pre></div><p>你可以尝试一下，使用sqlmap同样可以实现注入。正确的做法是，使用“#{}”来参数化name参数，对于LIKE操作可以使用CONCAT函数来拼接%符号：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Select(&quot;SELECT id,name FROM \`userdata\` WHERE name LIKE CONCAT(&#39;%&#39;,#{name},&#39;%&#39;)&quot;)</span></span>
<span class="line"><span>List&amp;lt;UserData&amp;gt; findByNameRight(&amp;#64;Param(&quot;name&quot;) String name);</span></span></code></pre></div><p>又比如IN子句。因为涉及多个元素的拼接，一些同学不知道如何处理，也可能会选择使用“\${}”。因为使用“#{}”会把输入当做一个字符串来对待：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;select id=&quot;findByNamesWrong&quot; resultType=&quot;org.geekbang.time.commonmistakes.codeanddata.sqlinject.UserData&quot;&amp;gt;</span></span>
<span class="line"><span>    SELECT id,name FROM \`userdata\` WHERE name in (\${names})</span></span>
<span class="line"><span>&amp;lt;/select&amp;gt;</span></span></code></pre></div><p>但是，这样直接把外部传入的内容替换到IN内部，同样会有注入漏洞：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PostMapping(&quot;mybatiswrong2&quot;)</span></span>
<span class="line"><span>public List mybatiswrong2(&amp;#64;RequestParam(&quot;names&quot;) String names) {</span></span>
<span class="line"><span>    return userDataMapper.findByNamesWrong(names);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>你可以使用下面这条命令测试下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>python sqlmap.py -u  http://localhost:45678/sqlinject/mybatiswrong2 --data names=&quot;&#39;test1&#39;,&#39;test2&#39;&quot;</span></span></code></pre></div><p>最后可以发现，有4种可行的注入方式，分别是布尔盲注、报错注入、时间盲注和联合查询注入：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/bdc7a7bcb34b59396f4a99d62425d6d3.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/bdc7a7bcb34b59396f4a99d62425d6d3.png" alt=""></a></p><p>修改方式是，给MyBatis传入一个List，然后使用其foreach标签来拼接出IN中的内容，并确保IN中的每一项都是使用“#{}”来注入参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PostMapping(&quot;mybatisright2&quot;)</span></span>
<span class="line"><span>public List mybatisright2(&amp;#64;RequestParam(&quot;names&quot;) List&amp;lt;String&amp;gt; names) {</span></span>
<span class="line"><span>    return userDataMapper.findByNamesRight(names);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;select id=&quot;findByNamesRight&quot; resultType=&quot;org.geekbang.time.commonmistakes.codeanddata.sqlinject.UserData&quot;&amp;gt;</span></span>
<span class="line"><span>    SELECT id,name FROM \`userdata\` WHERE name in</span></span>
<span class="line"><span>    &amp;lt;foreach collection=&quot;names&quot; item=&quot;item&quot; open=&quot;(&quot; separator=&quot;,&quot; close=&quot;)&quot;&amp;gt;</span></span>
<span class="line"><span>        #{item}</span></span>
<span class="line"><span>    &amp;lt;/foreach&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/select&amp;gt;</span></span></code></pre></div><p>修改后这个接口就不会被注入了，你可以自行测试一下。</p><h2 id="小心动态执行代码时代码注入漏洞" tabindex="-1">小心动态执行代码时代码注入漏洞 <a class="header-anchor" href="#小心动态执行代码时代码注入漏洞" aria-label="Permalink to &quot;小心动态执行代码时代码注入漏洞&quot;">​</a></h2><p>总结下，我们刚刚看到的SQL注入漏洞的原因是，黑客把SQL攻击代码通过传参混入SQL语句中执行。同样，对于任何解释执行的其他语言代码，也可以产生类似的注入漏洞。我们看一个动态执行JavaScript代码导致注入漏洞的案例。</p><p>现在，我们要对用户名实现动态的规则判断：通过ScriptEngineManager获得一个JavaScript脚本引擎，使用Java代码来动态执行JavaScript代码，实现当外部传入的用户名为admin的时候返回1，否则返回0：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private ScriptEngineManager scriptEngineManager = new ScriptEngineManager();</span></span>
<span class="line"><span>//获得JavaScript脚本引擎</span></span>
<span class="line"><span>private ScriptEngine jsEngine = scriptEngineManager.getEngineByName(&quot;js&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;wrong&quot;)</span></span>
<span class="line"><span>public Object wrong(&amp;#64;RequestParam(&quot;name&quot;) String name) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        //通过eval动态执行JavaScript脚本，这里name参数通过字符串拼接方式混入JavaScript代码</span></span>
<span class="line"><span>        return jsEngine.eval(String.format(&quot;var name=&#39;%s&#39;; name==&#39;admin&#39;?1:0;&quot;, name));</span></span>
<span class="line"><span>    } catch (ScriptException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这个功能本身没什么问题：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/a5c253d78b6b40f6e2aa8283732f0408.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/a5c253d78b6b40f6e2aa8283732f0408.png" alt=""></a></p><p>但是，如果我们把传入的用户名修改为这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>haha&#39;;java.lang.System.exit(0);&#39;</span></span></code></pre></div><p>就可以达到关闭整个程序的目的。原因是，我们直接把代码和数据拼接在了一起。外部如果构造了一个特殊的用户名先闭合字符串的单引号，再执行一条System.exit命令的话，就可以满足脚本不出错，命令被执行。</p><p>解决这个问题有两种方式。</p><p>第一种方式和解决SQL注入一样，需要 <strong>把外部传入的条件数据仅仅当做数据来对待。我们可以通过SimpleBindings来绑定参数初始化name变量</strong>，而不是直接拼接代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;right&quot;)</span></span>
<span class="line"><span>public Object right(&amp;#64;RequestParam(&quot;name&quot;) String name) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        //外部传入的参数</span></span>
<span class="line"><span>        Map&amp;lt;String, Object&amp;gt; parm = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>        parm.put(&quot;name&quot;, name);</span></span>
<span class="line"><span>        //name参数作为绑定传给eval方法，而不是拼接JavaScript代码</span></span>
<span class="line"><span>        return jsEngine.eval(&quot;name==&#39;admin&#39;?1:0;&quot;, new SimpleBindings(parm));</span></span>
<span class="line"><span>    } catch (ScriptException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样就避免了注入问题：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/a032842a5e551db18bd45dacf7794a49.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/a032842a5e551db18bd45dacf7794a49.png" alt=""></a></p><p>第二种解决方法是，使用SecurityManager配合AccessControlContext，来构建一个脚本运行的沙箱环境。脚本能执行的所有操作权限，是通过setPermissions方法精细化设置的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>public class ScriptingSandbox {</span></span>
<span class="line"><span>    private ScriptEngine scriptEngine;</span></span>
<span class="line"><span>    private AccessControlContext accessControlContext;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private SecurityManager securityManager;</span></span>
<span class="line"><span>    private static ThreadLocal&amp;lt;Boolean&amp;gt; needCheck = ThreadLocal.withInitial(() -&amp;gt; false);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ScriptingSandbox(ScriptEngine scriptEngine) throws InstantiationException {</span></span>
<span class="line"><span>        this.scriptEngine = scriptEngine;</span></span>
<span class="line"><span>        securityManager = new SecurityManager(){</span></span>
<span class="line"><span>            //仅在需要的时候检查权限</span></span>
<span class="line"><span>            &amp;#64;Override</span></span>
<span class="line"><span>            public void checkPermission(Permission perm) {</span></span>
<span class="line"><span>                if (needCheck.get() &amp;&amp; accessControlContext != null) {</span></span>
<span class="line"><span>                    super.checkPermission(perm, accessControlContext);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        //设置执行脚本需要的权限</span></span>
<span class="line"><span>        setPermissions(Arrays.asList(</span></span>
<span class="line"><span>                new RuntimePermission(&quot;getProtectionDomain&quot;),</span></span>
<span class="line"><span>                new PropertyPermission(&quot;jdk.internal.lambda.dumpProxyClasses&quot;,&quot;read&quot;),</span></span>
<span class="line"><span>                new FilePermission(Shell.class.getProtectionDomain().getPermissions().elements().nextElement().getName(),&quot;read&quot;),</span></span>
<span class="line"><span>                new RuntimePermission(&quot;createClassLoader&quot;),</span></span>
<span class="line"><span>                new RuntimePermission(&quot;accessClassInPackage.jdk.internal.org.objectweb.*&quot;),</span></span>
<span class="line"><span>                new RuntimePermission(&quot;accessClassInPackage.jdk.nashorn.internal.*&quot;),</span></span>
<span class="line"><span>                new RuntimePermission(&quot;accessDeclaredMembers&quot;),</span></span>
<span class="line"><span>                new ReflectPermission(&quot;suppressAccessChecks&quot;)</span></span>
<span class="line"><span>        ));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //设置执行上下文的权限</span></span>
<span class="line"><span>    public void setPermissions(List&amp;lt;Permission&amp;gt; permissionCollection) {</span></span>
<span class="line"><span>        Permissions perms = new Permissions();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (permissionCollection != null) {</span></span>
<span class="line"><span>            for (Permission p : permissionCollection) {</span></span>
<span class="line"><span>                perms.add(p);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ProtectionDomain domain = new ProtectionDomain(new CodeSource(null, (CodeSigner[]) null), perms);</span></span>
<span class="line"><span>        accessControlContext = new AccessControlContext(new ProtectionDomain[]{domain});</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Object eval(final String code) {</span></span>
<span class="line"><span>        SecurityManager oldSecurityManager = System.getSecurityManager();</span></span>
<span class="line"><span>        System.setSecurityManager(securityManager);</span></span>
<span class="line"><span>        needCheck.set(true);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //在AccessController的保护下执行脚本</span></span>
<span class="line"><span>            return AccessController.doPrivileged((PrivilegedAction&amp;lt;Object&amp;gt;) () -&amp;gt; {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    return scriptEngine.eval(code);</span></span>
<span class="line"><span>                } catch (ScriptException e) {</span></span>
<span class="line"><span>                    e.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return null;</span></span>
<span class="line"><span>            }, accessControlContext);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } catch (Exception ex) {</span></span>
<span class="line"><span>            log.error(&quot;抱歉，无法执行脚本 {}&quot;, code, ex);</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            needCheck.set(false);</span></span>
<span class="line"><span>            System.setSecurityManager(oldSecurityManager);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p>写一段测试代码，使用刚才定义的ScriptingSandbox沙箱工具类来执行脚本：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;right2&quot;)</span></span>
<span class="line"><span>public Object right2(&amp;#64;RequestParam(&quot;name&quot;) String name) throws InstantiationException {</span></span>
<span class="line"><span>    //使用沙箱执行脚本</span></span>
<span class="line"><span>    ScriptingSandbox scriptingSandbox = new ScriptingSandbox(jsEngine);</span></span>
<span class="line"><span>    return scriptingSandbox.eval(String.format(&quot;var name=&#39;%s&#39;; name==&#39;admin&#39;?1:0;&quot;, name));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这次，我们再使用之前的注入脚本调用这个接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>http://localhost:45678/codeinject/right2?name=haha%27;java.lang.System.exit(0);%27</span></span></code></pre></div><p>可以看到，结果中抛出了AccessControlException异常，注入攻击失效了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[13:09:36.080] [http-nio-45678-exec-1] [ERROR] [o.g.t.c.c.codeinject.ScriptingSandbox:77  ] - 抱歉，无法执行脚本 var name=&#39;haha&#39;;java.lang.System.exit(0);&#39;&#39;; name==&#39;admin&#39;?1:0;</span></span>
<span class="line"><span>java.security.AccessControlException: access denied (&quot;java.lang.RuntimePermission&quot; &quot;exitVM.0&quot;)</span></span>
<span class="line"><span>	at java.security.AccessControlContext.checkPermission(AccessControlContext.java:472)</span></span>
<span class="line"><span>	at java.lang.SecurityManager.checkPermission(SecurityManager.java:585)</span></span>
<span class="line"><span>	at org.geekbang.time.commonmistakes.codeanddata.codeinject.ScriptingSandbox$1.checkPermission(ScriptingSandbox.java:30)</span></span>
<span class="line"><span>	at java.lang.SecurityManager.checkExit(SecurityManager.java:761)</span></span>
<span class="line"><span>	at java.lang.Runtime.exit(Runtime.java:107)</span></span></code></pre></div><p>在实际应用中，我们可以考虑同时使用这两种方法，确保代码执行的安全性。</p><h2 id="xss必须全方位严防死堵" tabindex="-1">XSS必须全方位严防死堵 <a class="header-anchor" href="#xss必须全方位严防死堵" aria-label="Permalink to &quot;XSS必须全方位严防死堵&quot;">​</a></h2><p>对于业务开发来说，XSS的问题同样要引起关注。</p><p>XSS问题的根源在于，原本是让用户传入或输入正常数据的地方，被黑客替换为了JavaScript脚本，页面没有经过转义直接显示了这个数据，然后脚本就被执行了。更严重的是，脚本没有经过转义就保存到了数据库中，随后页面加载数据的时候，数据中混入的脚本又当做代码执行了。黑客可以利用这个漏洞来盗取敏感数据，诱骗用户访问钓鱼网站等。</p><p>我们写一段代码测试下。首先，服务端定义两个接口，其中index接口查询用户名信息返回给xss页面，save接口使用@RequestParam注解接收用户名，并创建用户保存到数据库；然后，重定向浏览器到index接口：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;RequestMapping(&quot;xss&quot;)</span></span>
<span class="line"><span>&amp;#64;Slf4j</span></span>
<span class="line"><span>&amp;#64;Controller</span></span>
<span class="line"><span>public class XssController {</span></span>
<span class="line"><span>    &amp;#64;Autowired</span></span>
<span class="line"><span>    private UserRepository userRepository;</span></span>
<span class="line"><span>    //显示xss页面</span></span>
<span class="line"><span>    &amp;#64;GetMapping</span></span>
<span class="line"><span>    public String index(ModelMap modelMap) {</span></span>
<span class="line"><span>        //查数据库</span></span>
<span class="line"><span>        User user = userRepository.findById(1L).orElse(new User());</span></span>
<span class="line"><span>        //给View提供Model</span></span>
<span class="line"><span>        modelMap.addAttribute(&quot;username&quot;, user.getName());</span></span>
<span class="line"><span>        return &quot;xss&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //保存用户信息</span></span>
<span class="line"><span>    &amp;#64;PostMapping</span></span>
<span class="line"><span>    public String save(&amp;#64;RequestParam(&quot;username&quot;) String username, HttpServletRequest request) {</span></span>
<span class="line"><span>        User user = new User();</span></span>
<span class="line"><span>        user.setId(1L);</span></span>
<span class="line"><span>        user.setName(username);</span></span>
<span class="line"><span>        userRepository.save(user);</span></span>
<span class="line"><span>        //保存完成后重定向到首页</span></span>
<span class="line"><span>        return &quot;redirect:/xss/&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>//用户类，同时作为DTO和Entity</span></span>
<span class="line"><span>&amp;#64;Entity</span></span>
<span class="line"><span>&amp;#64;Data</span></span>
<span class="line"><span>public class User {</span></span>
<span class="line"><span>    &amp;#64;Id</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们使用Thymeleaf模板引擎来渲染页面。模板代码比较简单，页面加载的时候会在标签显示用户名，用户输入用户名提交后调用save接口创建用户：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;div style=&quot;font-size: 14px&quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;form id=&quot;myForm&quot; method=&quot;post&quot; th:action=&quot;&amp;#64;{/xss/}&quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;label th:utext=&quot;\${username}&quot;/&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;input id=&quot;username&quot; name=&quot;username&quot; size=&quot;100&quot; type=&quot;text&quot;/&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;button th:text=&quot;Register&quot; type=&quot;submit&quot;/&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/form&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/div&amp;gt;</span></span></code></pre></div><p>打开xss页面后，在文本框中输入&lt;script&gt;alert(‘test’)&lt;/script&gt;点击Register按钮提交，页面会弹出alert对话框：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/cc50a56d83b3687859a396081346a47f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/cc50a56d83b3687859a396081346a47f.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/c4633bc6edc93c98e1d27969f6518571.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/c4633bc6edc93c98e1d27969f6518571.png" alt=""></a></p><p>并且，脚本被保存到了数据库：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/7ed8a0a92059149ed32bae43458307bc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/7ed8a0a92059149ed32bae43458307bc.png" alt=""></a></p><p>你可能想到了，解决方式就是HTML转码。既然是通过@RequestParam来获取请求参数，那我们定义一个@InitBinder实现数据绑定的时候，对字符串进行转码即可：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;ControllerAdvice</span></span>
<span class="line"><span>public class SecurityAdvice {</span></span>
<span class="line"><span>    &amp;#64;InitBinder</span></span>
<span class="line"><span>    protected void initBinder(WebDataBinder binder) {</span></span>
<span class="line"><span>        //注册自定义的绑定器</span></span>
<span class="line"><span>        binder.registerCustomEditor(String.class, new PropertyEditorSupport() {</span></span>
<span class="line"><span>            &amp;#64;Override</span></span>
<span class="line"><span>            public String getAsText() {</span></span>
<span class="line"><span>                Object value = getValue();</span></span>
<span class="line"><span>                return value != null ? value.toString() : &quot;&quot;;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            &amp;#64;Override</span></span>
<span class="line"><span>            public void setAsText(String text) {</span></span>
<span class="line"><span>                //赋值时进行HTML转义</span></span>
<span class="line"><span>                setValue(text == null ? null : HtmlUtils.htmlEscape(text));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>的确，针对这个场景，这种做法是可行的。数据库中保存了转义后的数据，因此数据会被当做HTML显示在页面上，而不是当做脚本执行：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/5ff4c92a1571da41ccb804c4232171ca.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/5ff4c92a1571da41ccb804c4232171ca.png" alt=""></a></p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/88cedbd1557690157e52010280386801.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/88cedbd1557690157e52010280386801.png" alt=""></a></p><p>但是，这种处理方式犯了一个严重的错误，那就是没有从根儿上来处理安全问题。因为@InitBinder是Spring Web层面的处理逻辑，如果有代码不通过@RequestParam来获取数据，而是直接从HTTP请求获取数据的话，这种方式就不会奏效。比如这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>user.setName(request.getParameter(&quot;username&quot;));</span></span></code></pre></div><p>更合理的解决方式是，定义一个servlet Filter，通过HttpServletRequestWrapper实现servlet层面的统一参数替换：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//自定义过滤器</span></span>
<span class="line"><span>&amp;#64;Component</span></span>
<span class="line"><span>&amp;#64;Order(Ordered.HIGHEST_PRECEDENCE)</span></span>
<span class="line"><span>public class XssFilter implements Filter {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {</span></span>
<span class="line"><span>        chain.doFilter(new XssRequestWrapper((HttpServletRequest) request), response);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class XssRequestWrapper extends HttpServletRequestWrapper {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public XssRequestWrapper(HttpServletRequest request) {</span></span>
<span class="line"><span>        super(request);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String[] getParameterValues(String parameter) {</span></span>
<span class="line"><span>        //获取多个参数值的时候对所有参数值应用clean方法逐一清洁</span></span>
<span class="line"><span>        return Arrays.stream(super.getParameterValues(parameter)).map(this::clean).toArray(String[]::new);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String getHeader(String name) {</span></span>
<span class="line"><span>        //同样清洁请求头</span></span>
<span class="line"><span>        return clean(super.getHeader(name));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String getParameter(String parameter) {</span></span>
<span class="line"><span>        //获取参数单一值也要处理</span></span>
<span class="line"><span>        return clean(super.getParameter(parameter));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //clean方法就是对值进行HTML转义</span></span>
<span class="line"><span>    private String clean(String value) {</span></span>
<span class="line"><span>      return StringUtils.isEmpty(value)? &quot;&quot; : HtmlUtils.htmlEscape(value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样，我们就可以实现所有请求参数的HTML转义了。不过，这种方式还是不够彻底，原因是无法处理通过@RequestBody注解提交的JSON数据。比如，有这样一个PUT接口，直接保存了客户端传入的JSON User对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;PutMapping</span></span>
<span class="line"><span>public void put(&amp;#64;RequestBody User user) {</span></span>
<span class="line"><span>    userRepository.save(user);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过Postman请求这个接口，保存到数据库中的数据还是没有转义：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/6d8e2b3b68e8a623d039d9d73999a64f.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/6d8e2b3b68e8a623d039d9d73999a64f.png" alt=""></a></p><p>我们需要自定义一个Jackson反列化器，来实现反序列化时的字符串的HTML转义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//注册自定义的Jackson反序列器</span></span>
<span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public Module xssModule() {</span></span>
<span class="line"><span>    SimpleModule module = new SimpleModule();</span></span>
<span class="line"><span>    module.module.addDeserializer(String.class, new XssJsonDeserializer());</span></span>
<span class="line"><span>    return module;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class XssJsonDeserializer extends JsonDeserializer&amp;lt;String&amp;gt; {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public String deserialize(JsonParser jsonParser, DeserializationContext ctxt) throws IOException, JsonProcessingException {</span></span>
<span class="line"><span>        String value = jsonParser.getValueAsString();</span></span>
<span class="line"><span>        if (value != null) {</span></span>
<span class="line"><span>            //对于值进行HTML转义</span></span>
<span class="line"><span>            return HtmlUtils.htmlEscape(value);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Class&amp;lt;String&amp;gt; handledType() {</span></span>
<span class="line"><span>        return String.class;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样就实现了既能转义Get/Post通过请求参数提交的数据，又能转义请求体中直接提交的JSON数据。</p><p>你可能觉得做到这里，我们的防范已经很全面了，但其实不是。这种只能堵新漏，确保新数据进入数据库之前转义。如果因为之前的漏洞，数据库中已经保存了一些JavaScript代码，那么读取的时候同样可能出问题。因此，我们还要实现数据读取的时候也转义。</p><p>接下来，我们看一下具体的实现方式。</p><p>首先，之前我们处理了JSON反序列化问题，那么就需要同样处理序列化，实现数据从数据库中读取的时候转义，否则读出来的JSON可能包含JavaScript代码。</p><p>比如，我们定义这样一个GET接口以JSON来返回用户信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;#64;GetMapping(&quot;user&quot;)</span></span>
<span class="line"><span>&amp;#64;ResponseBody</span></span>
<span class="line"><span>public User query() {</span></span>
<span class="line"><span>    return userRepository.findById(1L).orElse(new User());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/b2f919307e42e79ce78622b305d455f8.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/b2f919307e42e79ce78622b305d455f8.png" alt=""></a></p><p>修改之前的SimpleModule加入自定义序列化器，并且实现序列化时处理字符串转义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//注册自定义的Jackson序列器</span></span>
<span class="line"><span>&amp;#64;Bean</span></span>
<span class="line"><span>public Module xssModule() {</span></span>
<span class="line"><span>    SimpleModule module = new SimpleModule();</span></span>
<span class="line"><span>    module.addDeserializer(String.class, new XssJsonDeserializer());</span></span>
<span class="line"><span>    module.addSerializer(String.class, new XssJsonSerializer());</span></span>
<span class="line"><span>    return module;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class XssJsonSerializer extends JsonSerializer&amp;lt;String&amp;gt; {</span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public Class&amp;lt;String&amp;gt; handledType() {</span></span>
<span class="line"><span>        return String.class;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &amp;#64;Override</span></span>
<span class="line"><span>    public void serialize(String value, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {</span></span>
<span class="line"><span>        if (value != null) {</span></span>
<span class="line"><span>            //对字符串进行HTML转义</span></span>
<span class="line"><span>            jsonGenerator.writeString(HtmlUtils.htmlEscape(value));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，这次读到的JSON也转义了：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/315f67193d1f9efe4b09db85361c53fc.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/315f67193d1f9efe4b09db85361c53fc.png" alt=""></a></p><p>其次，我们还需要处理HTML模板。对于Thymeleaf模板引擎，需要注意的是，使用th:utext来显示数据是不会进行转义的，需要使用th:text：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&amp;lt;label th:text=&quot;\${username}&quot;/&amp;gt;</span></span></code></pre></div><p>经过修改后，即使数据库中已经保存了JavaScript代码，呈现的时候也只能作为HTML显示了。现在，对于进和出两个方向，我们都实现了补漏。</p><p>但，所谓百密总有一疏。为了避免疏漏，进一步控制XSS可能带来的危害，我们还要考虑一种情况：如果需要在Cookie中写入敏感信息的话，我们可以开启HttpOnly属性。这样JavaScript代码就无法读取Cookie了，即便页面被XSS注入了攻击代码，也无法获得我们的Cookie。</p><p>写段代码测试一下。定义两个接口，其中readCookie接口读取Key为test的Cookie，writeCookie接口写入Cookie，根据参数HttpOnly确定Cookie是否开启HttpOnly：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//服务端读取Cookie</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;readCookie&quot;)</span></span>
<span class="line"><span>&amp;#64;ResponseBody</span></span>
<span class="line"><span>public String readCookie(&amp;#64;CookieValue(&quot;test&quot;) String cookieValue) {</span></span>
<span class="line"><span>    return cookieValue;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//服务端写入Cookie</span></span>
<span class="line"><span>&amp;#64;GetMapping(&quot;writeCookie&quot;)</span></span>
<span class="line"><span>&amp;#64;ResponseBody</span></span>
<span class="line"><span>public void writeCookie(&amp;#64;RequestParam(&quot;httpOnly&quot;) boolean httpOnly, HttpServletResponse response) {</span></span>
<span class="line"><span>    Cookie cookie = new Cookie(&quot;test&quot;, &quot;zhuye&quot;);</span></span>
<span class="line"><span>    //根据httpOnly入参决定是否开启HttpOnly属性</span></span>
<span class="line"><span>    cookie.setHttpOnly(httpOnly);</span></span>
<span class="line"><span>    response.addCookie(cookie);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到，由于test和_ga这两个Cookie不是HttpOnly的。通过document.cookie可以输出这两个Cookie的内容：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/726e984d392aa1afc6d7371447700977.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/726e984d392aa1afc6d7371447700977.png" alt=""></a></p><p>为test这个Cookie启用了HttpOnly属性后，就不能被document.cookie读取到了，输出中只有_ga一项：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/1b287474f0666d5a2fde8e9442ae2e0c.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/1b287474f0666d5a2fde8e9442ae2e0c.png" alt=""></a></p><p>但是服务端可以读取到这个cookie：</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/b25da8d4aa5778798652f9685a93f6bd.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/images/237139/b25da8d4aa5778798652f9685a93f6bd.png" alt=""></a></p><h2 id="重点回顾" tabindex="-1">重点回顾 <a class="header-anchor" href="#重点回顾" aria-label="Permalink to &quot;重点回顾&quot;">​</a></h2><p>今天，我通过案例，和你具体分析了SQL注入和XSS攻击这两类注入类安全问题。</p><p>在学习SQL注入的时候，我们通过sqlmap工具看到了几种常用注入方式，这可能改变了我们对SQL注入威力的认知：对于POST请求、请求没有任何返回数据、请求不会出错的情况下，仍然可以完成注入，并可以导出数据库的所有数据。</p><p>对于SQL注入来说，使用参数化的查询是最好的堵漏方式；对于JdbcTemplate来说，我们可以使用“?”作为参数占位符；对于MyBatis来说，我们需要使用“#{}”进行参数化处理。</p><p>和SQL注入类似的是，脚本引擎动态执行代码，需要确保外部传入的数据只能作为数据来处理，不能和代码拼接在一起，只能作为参数来处理。代码和数据之间需要划出清晰的界限，否则可能产生代码注入问题。同时，我们可以通过设置一个代码的执行沙箱来细化代码的权限，这样即便产生了注入问题，因为权限受限注入攻击也很难发挥威力。</p><p><strong>随后通过学习XSS案例，我们认识到处理安全问题需要确保三点。</strong></p><ul><li>第一，要从根本上、从最底层进行堵漏，尽量不要在高层框架层面做，否则堵漏可能不彻底。</li><li>第二，堵漏要同时考虑进和出，不仅要确保数据存入数据库的时候进行了转义或过滤，还要在取出数据呈现的时候再次转义，确保万无一失。</li><li>第三，除了直接堵漏外，我们还可以通过一些额外的手段限制漏洞的威力。比如，为Cookie设置HttpOnly属性，来防止数据被脚本读取；又比如，尽可能限制字段的最大保存长度，即使出现漏洞，也会因为长度问题限制黑客构造复杂攻击脚本的能力。</li></ul><p>今天用到的代码，我都放在了GitHub上，你可以点击 <a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noreferrer">这个链接</a> 查看。</p><h2 id="思考与讨论" tabindex="-1">思考与讨论 <a class="header-anchor" href="#思考与讨论" aria-label="Permalink to &quot;思考与讨论&quot;">​</a></h2><ol><li>在讨论SQL注入案例时，最后那次测试我们看到sqlmap返回了4种注入方式。其中，布尔盲注、时间盲注和报错注入，我都介绍过了。你知道联合查询注入，是什么吗？</li><li>在讨论XSS的时候，对于Thymeleaf模板引擎，我们知道如何让文本进行HTML转义显示。FreeMarker也是Java中很常用的模板引擎，你知道如何处理转义吗？</li></ol><p>你还遇到过其他类型的注入问题吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,150)])])}const m=a(t,[["render",i]]);export{g as __pageData,m as default};
